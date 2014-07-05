goog.provide('life.views.List');

goog.require('life');
goog.require('life.View');
goog.require('life.topics.Document');
goog.require('life.topics.Route');
goog.require('life.utils');
goog.require('life.views.modals.DocumentDelete');



/**
 * The list view of documents.
 *
 * @constructor
 * @extends {life.View}
 * @param {string=} view The name of the database view to use to fecth the
 *     document list.
 */
life.views.List = life.extend(function(view) {
  life.View.call(this);

  this.subscribe(life.topics.Document.DELETE, _.bind(function() {
    this.dispose();
    this.fetchList(null, this.app);
  }, this));

  this.subscribe(life.topics.Route.APP, _.bind(this.fetchList, this));
  this.subscribe(life.topics.Route.APP_EXIT, _.bind(this.dispose, this));

  this.subscribe(life.topics.Route.APP_TAG, _.bind(this.fetchList, this));
  this.subscribe(life.topics.Route.APP_TAG_EXIT, _.bind(this.dispose, this));

  if(view) {
    this.view = view;
  }
}, life.View);


/**
 * CouchDB view sorting by document type.
 *
 * @const
 * @type {string}
 */
life.views.List.VIEW_TYPE = 'life/type';


/**
 * CouchDB view sorting by document type and tag.
 *
 * @const
 * @type {string}
 */
life.views.List.VIEW_TAG = 'life/tag';


/**
 * The key of the current app that is loaded.
 *
 * @type {string}
 */
life.views.List.prototype.app;


/**
 * The current tag filter.
 *
 * @type {string}
 */
life.views.List.prototype.tag;


/**
 * The name of the database view to use to fecth the document list.
 *
 * @type {string}
 */
life.views.List.prototype.view = life.views.List.VIEW_TYPE;


/**
 * Fetches the document list from the server.
 *
 * @param {Object} e The event object.
 * @param {string} app The name of the application to fetch documents from.
 * @param {string=} tag Optional tag to filter items by.
 */
life.views.List.prototype.fetchList = function(e, app, tag) {
  this.app = app;
  this.tag = tag;
  var appConfig = life.utils.getAppConfiguration(app);

  this.view = life.views.List.VIEW_TYPE;
  var startKey = [appConfig.type, '9999999999999'].join('-');
  var endKey = [appConfig.type, '0000000000000'].join('-');
  if(tag) {
    this.view = life.views.List.VIEW_TAG;
    startKey = [appConfig.type, tag, '9999999999999'].join('-');
    endKey = [appConfig.type, tag, '0000000000000'].join('-');
  }

  // startkey must be higher than endkey since we are sorting by descending.
  life.utils.getDb().query(this.view, {
    'descending': 'true',
    'startkey': startKey,
    'endkey': endKey
  }, _.bind(this.render, this));
};


/**
 * Renders the template to the DOM.
 *
 * @param {?Object} err The error object if request fails.
 * @param {Object=} response The list of documents to render (will not be set
 *     if there is an error).
 */
life.views.List.prototype.render = function(err, response) {
  if(err) {
    return;
  }

  $(this.el).html(nunjucks.render('list.html', {
    'response': response,
    'tag': this.tag
  }));

  this.on(
    [this.el + ' button', this.el + ' a'].join(', '),
    'click',
    _.bind(this.action, this)
  );
  this.on(this.el + ' #search-tag', 'submit', _.bind(this.routeToTag, this));
  this.on(
    this.el + ' #search-tag .glyphicon-filter',
    'click',
    _.bind(this.routeToTag, this)
  );
  this.on(
    this.el + ' #search-tag .glyphicon-remove',
    'click',
    _.bind(function() {
      life.route([this.app]);
    }, this)
  );
};


/**
 * Handles a button click in the document list.
 *
 * @param {Object} e The event object.
 */
life.views.List.prototype.action = function(e) {
  var action = $(e.target).data('key');
  switch(action) {
    case 'create':
      life.route('/' + this.app + '/doc/');
      break;
    case 'delete':
      (new life.views.modals.DocumentDelete(
        $(e.target).data('id'),
        $(e.target).data('rev')
      )).render();
      break;
    case 'edit':
      life.route('/' + this.app + '/doc/' + $(e.target).data('id') + '/');
      break;
  }
};


/**
 * Pulls the tag from the form and routes the browser to the given filter if
 * one is set.
 */
life.views.List.prototype.routeToTag = function() {
  var tag = $(this.el + ' #search-tag input').val();
  tag = tag.split(' ')[0].toLowerCase();
  if(tag !== '') {
    life.route([this.app, 'tag', tag]);
  }
};
