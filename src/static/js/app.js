/**
 * @fileoverview Life interface application launcher.
 */

goog.require('life');
goog.require('life.Router');
goog.require('life.topics.Route');
goog.require('life.utils');
goog.require('life.views.Base');
goog.require('life.views.Document');
goog.require('life.views.List');

$(function() {
  life.utils.configureTemplates();

  (new life.views.Base()).render();
  new life.views.Document();
  new life.views.List();

  // Redirect the root to the default notes app.
  $.subscribe(life.topics.Route.BASE, function() {
    life.route('/notes/');
  });

  (new life.Router({
    '^/?$': life.topics.Route.BASE,
    '^/([A-Za-z0-9\\-]+)/?$': life.topics.Route.APP,
    '^/([A-Za-z0-9\\-]+)/tag/([A-Za-z0-9\\-]*)/?$': life.topics.Route.APP_TAG,
    '^/([A-Za-z0-9\\-]+)/doc/([A-Za-z0-9\\-]*)/?$': life.topics.Route.APP_DOC
  })).start();
});
