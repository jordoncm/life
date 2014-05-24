/**
 * @fileoverview Collects tests and executes them.
 */

goog.require('life.test');
goog.require('life.test.views.List');
goog.require('life.utils');

$(function() {
  life.utils.configureTemplates();

  life.test.run();
  life.test.views.List.run();
});
