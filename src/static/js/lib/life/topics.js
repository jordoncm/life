/**
 * @fileoverview Enumerations of the publish and subscribe topics.
 */

goog.provide('life.topics.Document');
goog.provide('life.topics.Route');


/**
 * Document related topics.
 *
 * @enum {string}
 */
life.topics.Document = {
  CHANGE: '//doc/change',
  DELETE: '//doc/delete',
  SAVE: '//doc/save'
};


/**
 * Route related topics.
 *
 * @enum {string}
 */
life.topics.Route = {
  BASE: '//route',
  APP: '//route/app',
  APP_EXIT: '//route/app/exit',
  APP_DOC: '//route/app/doc',
  APP_DOC_EXIT: '//route/app/doc/exit',
  APP_TAG: '//route/app/tag',
  APP_TAG_EXIT: '//route/app/tag/exit'
};
