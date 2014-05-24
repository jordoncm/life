/**
 * @fileoverview Main application views.
 */

goog.provide('life.views.Base');

goog.require('life');
goog.require('life.View');
goog.require('life.topics.Route');



/**
 * The main application view.
 *
 * @constructor
 * @extends {life.View}
 */
life.views.Base = life.extend(function() {
  life.View.call(this);
  this.subscribe(life.topics.Route.APP, _.bind(this.activate, this));
  this.subscribe(life.topics.Route.APP_TAG, _.bind(this.activate, this));
}, life.View);


/**
 * The selector target for the view.
 *
 * @type {string}
 */
life.views.Base.prototype.el = 'body';


/**
 * Update the navigation bar activating the correct application in the menu.
 *
 * @param {Object} e The event object.
 * @param {string} app The name of the application to set as active.
 */
life.views.Base.prototype.activate = function(e, app) {
  $('#apps-menu li').removeClass('active');
  $('#apps-menu li[data-key="' + app + '"]').addClass('active');
};


/**
 * Renders the template to the DOM.
 */
life.views.Base.prototype.render = function() {
  // TODO(jordoncm): Come up with a better way to persist passphrase between
  // page loads. This is unsafe.
  $(this.el).html(nunjucks.render('base.html', {
    'apps': life.DEFAULT_APPS,
    'apps_featured': 2,
    'passphrase': localStorage.getItem('passphrase') || ''
  }));
  this.on('#passphrase', 'keyup', function(e) {
    localStorage.setItem('passphrase', $(e.target).val());
  });
};
