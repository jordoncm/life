/**
 * @fileoverview Tests for the list view.
 */

goog.provide('life.test.views.List');

goog.require('life.views.List');


/**
 * Tests for the list view.
 */
life.test.views.List.run = function() {
  module('life.views.List');

  test('routeToTag.test', function() {
    var view = new life.views.List();
    view.el = '#qunit-fixture';
    view.render({'rows': []});
    view.app = 'foo';
    var input = $(view.el + ' #search-tag input');
    // Set a value into the tag filter field.
    input.val('bar');
    equal(
      input.val(),
      'bar',
      'The tag filter input should contain the desired value.'
    );
    view.routeToTag();
    equal(
      window.location.hash,
      '#/foo/tag/bar/',
      'The window hash should update to the target tag.'
    );
    window.location.hash = '';
  });
};
