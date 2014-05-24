/**
 * @fileoverview Processing methods for document key types.
 */

goog.provide('life.types');
goog.provide('life.types.Base');
goog.provide('life.types.Password');
goog.provide('life.types.Rich');


/**
 * Fetch the type processing object for the given type.
 *
 * @param {string} type The type of the document key.
 * @return {Object} Returns processing object.
 */
life.types.get = function(type) {
  var mapping = {
    'password': life.types.Password,
    'rich': life.types.Rich
  };
  if(mapping[type]) {
    return mapping[type];
  } else {
    return life.types.Base;
  }
};


/**
 * A base implementation of the methods needed on a processing object.
 *
 * Can be cloned and then override the methods for as needed for the custom
 * type.
 *
 * @type {Object}
 */
life.types.Base = {}; // TODO(jordoncm): Create a typedef for this.


/**
 * Method executed by the document view after the types HTML template has been
 * rendered.
 *
 * This is the place to add event listeners, create addtional Javascript
 * objects as needed for the interface to manipulate this type correctly. NOTE:
 * This will get called multiple times if the documents template has the type
 * more than once.
 *
 * @param {life.View} view The calling view. Use to track event listeners and
 *     so forth.
 * @param {number} index The index of the type in the document template.
 * @return {Object|undefined} Optionally return a context object the view
 *     should keep in order to dispose properly.
 */
life.types.Base.onRender = function(view, index) {};


/**
 * Method executed by the document view before the key of the given type is
 * assigned to the document.
 *
 * This is the place to do any kind of validation, default value or other
 * manipulation before the value gets stored to the key in the document.
 *
 * @param {*} value The value of the key type from the view.
 * @return {*} The value the view should store to the key in the document.
 */
life.types.Base.onSave = function(value) {
  return value;
};


/**
 * Method executed by the document view when the view calls dispose.
 *
 * This is the place to clean up any events, DOM, etc that the view does not
 * know how to for the given type.
 *
 * @param {life.View} view The calling view.
 * @param {Object=} context The context created by onRender.
 */
life.types.Base.onDispose = function(view, context) {};


/**
 * Type processing for encrypted password fields.
 */
life.types.Password = _.clone(life.types.Base);


/**
 * Adds the click listener that enables toggling visibility of the password.
 *
 * @param {life.View} view The calling view.
 * @param {number} index The index of the type in the document template.
 */
life.types.Password.onRender = function(view, index) {
  view.on(
    '#content #item-' + index + ' span.glyphicon',
    'click',
    _.bind(function(e) {
      var input = $('#content #item-' + index + ' input');
      var type = '';
      if(input.attr('type') === 'password') {
        $(e.target).removeClass('glyphicon-eye-open');
        $(e.target).addClass('glyphicon-eye-close');
        type = 'text';
      } else {
        $(e.target).removeClass('glyphicon-eye-close');
        $(e.target).addClass('glyphicon-eye-open');
        type = 'password';
      }
      var value = input.val();
      input.replaceWith(nunjucks.render('type-password-input.html', {
        'data_key': input.data('key'),
        'data_type': input.data('type'),
        'type': type
      }));
      // Have to refetch after replacing the DOM.
      input = $('#content #item-' + index + ' input');
      input.val(value);
    }, view)
  );
};


/**
 * Type processing for rich text fields.
 */
life.types.Rich = _.clone(life.types.Base);


/**
 * Creates the markdown editor and ties it to the type template DOM.
 *
 * @param {life.View} view The calling view.
 * @param {number} index The index of the type in the document template.
 * @return {EpicEditor} The markdown editor object.
 */
life.types.Rich.onRender = function(view, index) {
  var context = new EpicEditor({
    'container': $('#content #item-' + index + ' #epiceditor').get(0),
    'textarea': $('#content #item-' + index + ' textarea').get(0),
    'basePath': '',
    'clientSideStorage': false,
    'theme': {
      'base': 'thirdparty/epiceditor/themes/base/epiceditor.css',
      'preview': 'thirdparty/epiceditor/themes/preview/preview-dark.css',
      'editor': 'thirdparty/epiceditor/themes/editor/epic-dark.css'
    }
  });
  context.load();
  return context;
};


/**
 * Cleans up the markdown editor.
 *
 * @param {life.View} view The calling view.
 * @param {EpicEditor} context The markdown object created on render.
 */
life.types.Rich.onDispose = function(view, context) {
  // context.unload();
};
