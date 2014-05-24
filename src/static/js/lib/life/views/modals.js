/**
 * @fileoverview Main application views.
 */

goog.provide('life.views.modals.DocumentDelete');

goog.require('life');
goog.require('life.Modal');
goog.require('life.utils');



/**
 * Warning dialog for deleting a document.
 *
 * @constructor
 * @extends {life.Modal}
 * @param {string} docId The id of the document to be deleted.
 * @param {string} docRev The revision of the document to be deleted.
 */
life.views.modals.DocumentDelete = life.extend(function(docId, docRev) {
  life.Modal.call(this);
  this.docId = docId;
  this.docRev = docRev;
}, life.Modal);


/**
 * The id of the document to be deleted.
 *
 * @type {?string}
 */
life.views.modals.DocumentDelete.prototype.docId = null;


/**
 * The revision of the document to be deleted.
 *
 * @type {?string}
 */
life.views.modals.DocumentDelete.prototype.docRev = null;


/**
 * Renders the modal for delete confirmation.
 */
life.views.modals.DocumentDelete.prototype.render = function() {
  $(this.el).html(nunjucks.render('modal-delete.html'));
  this.on('#modal button', 'click', _.bind(this.action, this));
  $(this.el + ' div.modal').modal('show');
};


/**
 * Handles a button click in the dialog.
 *
 * @param {Object} e The event object.
 */
life.views.modals.DocumentDelete.prototype.action = function(e) {
  var action = $(e.target).data('key');
  if(action === 'delete') {
    life.utils.getDb().removeDoc(
      {'_id': this.docId, '_rev': this.docRev},
      {'success': function() {$.publish('//doc/delete')}}
    );
  }
  // This is a hack to let the fade out of the modal to work correctly before
  // destroying the views DOM.
  window.setTimeout(_.bind(this.close, this), 1000);
};


/**
 * Reset's the views properties on dispose.
 */
life.views.modals.DocumentDelete.prototype.onDispose = function() {
  this.docId = null;
  this.docRev = null;
};
