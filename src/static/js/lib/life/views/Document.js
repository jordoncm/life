/**
 * @fileoverview Document management view.
 */

goog.provide('life.views.Document');

goog.require('life');
goog.require('life.View');
goog.require('life.crypto');
goog.require('life.topics.Route');
goog.require('life.types');
goog.require('life.utils');



/**
 * View for managing a document.
 *
 * @constructor
 * @extends {life.View}
 */
life.views.Document = life.extend(function() {
  life.View.call(this);
  this.subscribe(life.topics.Route.APP_DOC, _.bind(this.fetchDocument, this));
  this.subscribe(life.topics.Route.APP_DOC_EXIT, _.bind(this.exit, this));
  this.contexts = [];
}, life.View);


/**
 * The list of context object from type processing helplers.
 *
 * @type {Array.<Object>}
 */
life.views.Document.prototype.contexts;


/**
 * The current document id the view is working with.
 *
 * @type {string}
 */
life.views.Document.prototype.docId;


/**
 * The current document the view is working with.
 *
 * Represents the object in sync with the server.
 *
 * @type {Object}
 */
life.views.Document.prototype.doc;


/**
 * The current unsaved document the view is working with.
 *
 * Represents the object in sync with the edits in the UI.
 *
 * @type {Object}
 */
life.views.Document.prototype.unsaved;


/**
 * The current unsaved document the view is working with.
 *
 * Temporarily set while a document save is submitted to the server. This helps
 * track changes in case the object is edited in the UI while the HTTP save
 * request is outstanding or the save fails altogether.
 *
 * @type {Object}
 */
life.views.Document.prototype.saving;


/**
 * Reference to a window.setInterval used to track document changes.
 *
 * @type {number}
 */
life.views.Document.prototype.interval;


/**
 * Fetches the given document.
 *
 * @param {Object} e The event object.
 * @param {string} app The name of the application to fetch documents from.
 * @param {string=} docId The id of the document to lookup.
 */
life.views.Document.prototype.fetchDocument = function(e, app, docId) {
  if(this.doc && docId && this.doc['_id'] == docId) {
    // Don't fetch/rerender if the document is already loaded.
    return;
  }

  this.app = app;
  this.docId = docId;

  if(docId) {
    life.utils.getDb().openDoc(docId, {}, {
      'success': _.bind(this.render, this)
    });
  } else {
    this.render();
  }
};


/**
 * Renders the template to the DOM.
 *
 * @param {Object=} doc The document to render. If not set renders empty (new)
 *     document DOM.
 */
life.views.Document.prototype.render = function(doc) {
  var appConfig = life.utils.getAppConfiguration(this.app);
  var warn = life.crypto.decryptDoc(doc, appConfig.template);
  this.doc = doc || {};
  // Duplicate the doc for tracking unsaved changes.
  this.unsaved = life.utils.clone(this.doc);

  $(this.el).html(nunjucks.render('document.html', {
    'doc': this.doc,
    'template': appConfig.template,
    'warn_decryption': warn
  }));
  _.each(appConfig.template, function(t, i) {
    this.contexts.push(life.types.get(t.type).onRender(this, i));
  }, this);

  this.on(this.el + ' button', 'click', _.bind(this.action, this));
  this.interval = window.setInterval(_.bind(this.updateDoc, this), 250);
};


/**
 * Updates the unsaved document based on the UI form and sets the state on
 * saved/unsaved in the UI.
 */
life.views.Document.prototype.updateDoc = function() {
  this.buildDocFromForm(this.unsaved);
  if(_.isEqual(this.unsaved, this.doc)) {
    this.makeClean();
  } else {
    this.makeDirty();
  }
};


/**
 * Pulls the field values from the active document form and updates the given
 * document.
 *
 * @param {Object} doc The document to update. NOTE: The document is updated in
 *     place (does not make a clone of the object).
 */
life.views.Document.prototype.buildDocFromForm = function(doc) {
  var appConfig = life.utils.getAppConfiguration(this.app);
  doc['type'] = appConfig.type;
  var inputs = $('#content input, #content textarea');
  for(var i = 0; i < inputs.length; i++) {
    var input = $(inputs.get(i));
    var key = input.data('key');
    var value = input.val();
    switch(key) {
      case 'tags':
        doc['tags'] = [];
        var tagList = value.split(' ');
        for(var j = 0; j < tagList.length; j++) {
          if(tagList[j] !== '') {
            doc['tags'].push(tagList[j].toLowerCase());
          }
        }
        doc['tags'] = _.sortBy(doc['tags'], function(tag) { return tag; });
        break;
      default:
        if(value !== '') {
            doc[key] = value;
        }
        break;
    }
  }
};


/**
 * Updates the UI to relfect that the document is saved.
 */
life.views.Document.prototype.makeClean = function() {
  var button = $(this.el + ' button[data-key="save"]');
  button.removeClass('btn-warning');
  button.addClass('btn-primary');
  button.html('Saved');
};


/**
 * Updates the UI to reflect that the document is not saved.
 */
life.views.Document.prototype.makeDirty = function() {
  var button = $(this.el + ' button[data-key="save"]');
  button.removeClass('btn-primary');
  button.addClass('btn-warning');
  button.html('Save');
};


/**
 * Handles a button click in the document form.
 *
 * @param {Object} e The event object.
 */
life.views.Document.prototype.action = function(e) {
  var action = $(e.target).data('key');
  switch(action) {
    case 'save':
      $(e.target).html('Saving...');
      this.saveDoc();
      break;
    case 'close':
      life.route([this.app]);
      break;
  }
};


/**
 * Kicks off a save for the current document.
 */
life.views.Document.prototype.saveDoc = function() {
  var appConfig = life.utils.getAppConfiguration(this.app);
  // Duplicate the unsaved doc.
  var doc = life.utils.clone(this.unsaved);
  // Update the doc from the form.
  this.buildDocFromForm(doc);
  life.crypto.encryptDoc(doc, appConfig.template);
  // Update mtime and set ctime if needed.
  doc['mtime'] = this.doc['mtime'] = this.unsaved['mtime'] = (
    new Date()
  ).getTime();
  if(!doc['ctime']) {
    var ctime = (new Date()).getTime();
    // If there is not a ctime, add it to the docs as the user has
    // attempted first save.
    doc['ctime'] = this.doc['ctime'] = this.unsaved['ctime'] = ctime;
  }
  this.saving = doc;
  life.utils.getDb().saveDoc(
    doc,
    {
      'success': _.bind(this.docSaveSuccess, this)
    }
  );
};


/**
 * Callback for document save success.
 *
 * Updates the DOM form and the document with _id and _rev values. Also changes
 * the URL route when a new document is saved for the first time.
 *
 * @param {Object} response The updated document from the server.
 */
life.views.Document.prototype.docSaveSuccess = function(response) {
  var appConfig = life.utils.getAppConfiguration(this.app);
  // Sync all the key fields.
  this.saving['_id'] = this.unsaved['_id'] = response['id'];
  this.saving['_rev'] = this.unsaved['_rev'] = response['rev'];
  life.crypto.decryptDoc(this.saving, appConfig.template);
  this.doc = this.saving;
  delete this.saving;

  if(_.last(life.utils.getPathList()) != this.doc['_id']) {
    // Tack the id onto the URL in the case of a first save of a new document.
    life.route([this.app, 'doc', this.doc['_id']]);
  }
};


/**
 * Handles a publish to the exit topic and disposes the view if needed.
 *
 * @param {Object} e The event object.
 * @param {string} path The path that the application is heading towards.
 */
life.views.Document.prototype.exit = function(e, path) {
  var last = _.last(life.utils.getPathList(path));
  if(!this.doc['_id'] || last != this.doc['_id']) {
    // Don't dispose if the URL changed to the current document. This should
    // only happen when a new document gets saved for the first time.
    this.dispose();
  }
};


/**
 * Calls the type processing helpers dispose methods and cleans up local
 * contexts.
 */
life.views.Document.prototype.onDispose = function() {
  window.clearInterval(this.interval);
  var appConfig = life.utils.getAppConfiguration(this.app);
  var template = appConfig.template;
  for(var i = 0; i < template.length; i++) {
    life.types.get(template[i].type).onDispose(this, this.contexts[i]);
  }
  this.contexts = [];
  delete this.docId;
  delete this.doc;
};
