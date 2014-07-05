/**
 * @fileoverview Couchapp design document definition.
 */

var couchapp = require('couchapp');
var path = require('path');


/**
 * The design document.
 *
 * @type {Object}
 */
var ddoc = {
  /**
   * The application id.
   *
   * @type {string}
   */
  _id: '_design/life'
};


/**
 * Rewrite rules for the application.
 *
 * @type {Array.<Object>}
 */
ddoc.rewrites = [
  {
    description: 'Access to this database.',
    from: '_db',
    to: '../..'
  },
  {
    from: '_db/*',
    to: '../../*'
  },
  {
    description: 'Access to this design document.',
    from: '_ddoc',
    to: ''
  },
  {
    from: '_ddoc/*',
    to: '*'
  },
  {
    from: '/',
    to: 'index.html'
  },
  {
    from: '/*',
    to: '*'
  }
];


/**
 * Application map/reduce methods.
 *
 * @type {Object}
 */
ddoc.views = {
  tag: {
    map: function(doc) {
      if(doc.tags) {
        for(var i = 0; i < doc.tags.length; i++) {
          emit(
            [doc.type, doc.tags[i], doc.mtime].join('-'),
            {_rev: doc._rev, title: doc.title, mtime: doc.mtime, tags: doc.tags}
          );
        }
      }
    }
  },
  type: {
    map: function(doc) {
      emit(
        [doc.type, doc.mtime].join('-'),
        {_rev: doc._rev, title: doc.title, mtime: doc.mtime, tags: doc.tags}
      );
    }
  }
};


/**
 * Document update validation method.
 *
 * @param {Object} newDoc The updated document.
 * @param {Object} oldDoc The original document.
 * @param {Object} userCtx The user context object.
 */
ddoc.validate_doc_update = function(newDoc, oldDoc, userCtx) {
  if(newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
    throw 'Only admin can delete documents on this database.';
  }
};

// Load the static files into the document.
couchapp.loadAttachments(ddoc, path.join(__dirname, 'static'));

module.exports = ddoc;
