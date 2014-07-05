/**
 * @fileoverview  Tests for the life namespace.
 */

goog.provide('life.test');

goog.require('life');


/**
 * Tests for the life namespace.
 */
life.test.run = function() {
  module('life');

  // Causes compiler warning (though always passes). Frankly not that relevant
  // of a test.
  // test('life', function() {
  //   notEqual(life, undefined, 'Life namespace should exist.');
  // });

  test('DEFAULT_APPS.testSchema', function() {
    for(var key in life.DEFAULT_APPS) {
      equal(typeof key, 'string', 'App name should be a string.');
      equal(key, key.toLowerCase(), 'App name should be lowercase.');

      var app = life.DEFAULT_APPS[key];
      notEqual(app.template, undefined, 'App template should be defined.');
      ok(app.template.length > 0, 'App template should have items.');
      for(var i = 0; i < app.template.length; i++) {
        var t = app.template[i];
        equal(typeof t, 'object', 'Template item should be an object.');
        equal(typeof t.key, 'string', 'Template item key should be a string.');
        notEqual(t.key, '', 'Template item key should not be empty.');
        equal(
          t.key,
          t.key.toLowerCase(),
          'Template item key should be lowercase.'
        );
        ok(
          !/^[a-z_]+&/.test(t.key),
          'Template item key should be valid characters.'
        );

        equal(
          typeof t.type,
          'string',
          'Template item type should be a string.'
        );
        notEqual(t.type, '', 'Template item type should not be empty.');
        equal(
          t.type,
          t.type.toLowerCase(),
          'Template item type should be lowercase.'
        );
        // TODO(jordoncm): Validate value is within supported types.
      }

      notEqual(app.type, undefined, 'App type should be defined.');
      equal(typeof app.type, 'string', 'App type should be a string.');
      notEqual(app.type, '', 'App type should not be empty.');
      equal(app.type, app.type.toLowerCase(), 'App type should be lowercase.');
    }
  });

  test('extend.testSuper', function() {
    var superExecuted = false;
    var Parent = function() {
      superExecuted = true;
    };

    Parent.prototype.a = 1;

    var Child = life.extend(function() {}, Parent);
    ok(
      !superExecuted,
      'Parent constructor should not execute when extending to a child.'
    );

    var c = new Child();
    ok(
      !superExecuted,
      'Parent constructor should not execute when initializing a child.'
    );
    equal(c.a, 1, 'A child class should inherit parent properties.');

    Child = life.extend(function() {
      Parent.call(this);
    }, Parent);
    ok(
      !superExecuted,
      'Parent constructor should not execute when extending to a child.'
    );

    c = new Child();
    ok(
      superExecuted,
      'Parent constructor should execute at child initialization if called.'
    );
  });

  test('extend.testInheritance', function() {
    var Parent = function() {};
    Parent.prototype.pProperty = 1;
    Parent.prototype.pMethod = function() {
      return this.pProperty;
    };
    var Child = life.extend(function() {}, Parent);
    Child.prototype.cProperty = 2;
    Child.prototype.cMethod = function() {
      return this.cProperty;
    };
    Child.prototype.c2p = function() {
      return this.pProperty;
    };

    var p = new Parent();
    var c = new Child();

    equal(
      p.cProperty,
      undefined,
      'A parent should not inherit child properties.'
    );
    notEqual(
      c.pProperty,
      undefined,
      'A child should inherit parent properties.'
    );
    notEqual(c.cProperty, undefined, 'A child should keep its properties.');

    equal(p.pMethod(), 1, 'A parent should be able to call its methods.');
    equal(c.pMethod(), 1, 'A child should be able to call parent methods.');
    equal(c.cMethod(), 2, 'A child should be able to call its methods.');
    equal(
      c.c2p(),
      1,
      'A child method should be able to read parent properties.'
    );
  });

  test('route.testString', function() {
    window.location.hash = '';
    life.route('/');
    equal(
      window.location.hash,
      '#/',
      'The window hash should update on route change.'
    );
    life.route('/foo/');
    equal(
      window.location.hash,
      '#/foo/',
      'The window hash should update on route change.'
    );
    life.route('/bar/');
    equal(
      window.location.hash,
      '#/bar/',
      'The window hash should update on route change.'
    );
    window.location.hash = '';
  });

  test('route.testArray', function() {
    window.location.hash = '';
    life.route([]);
    equal(
      window.location.hash,
      '#/',
      'The window hash should update on route change.'
    );
    life.route(['foo']);
    equal(
      window.location.hash,
      '#/foo/',
      'The window hash should update on route change.'
    );
    life.route(['bar']);
    equal(
      window.location.hash,
      '#/bar/',
      'The window hash should update on route change.'
    );
    window.location.hash = '';
  });
};
