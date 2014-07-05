/**
 * @fileoverview Library of utility methods.
 */

goog.provide('life.utils');

goog.require('life');
goog.require('life.utils');


/**
 * Looks up application configuration by the given name.
 *
 * @param {string} name The application name to look for.
 * @return {Object|undefined} The application configuration, if found.
 */
life.utils.getAppConfiguration = function(name) {
  return life.DEFAULT_APPS[name];
};


/**
 * Configures the Nunjucks template settings.
 */
life.utils.configureTemplates = function() {
  var env = nunjucks.configure('templates', {'autoescape': true});
  env.addFilter('time', function(timestamp) {
      var days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ];
      var date = new Date(timestamp);
      var readable = [
        days[date.getDay()],
        [(date.getMonth() + 1), date.getDate(), date.getFullYear()].join('/'),
        [date.getHours(), date.getMinutes(), date.getSeconds()].join(':')
      ];
      return readable.join(', ');
  });
};


/**
 * Parses the current windows URL path to determine the current CouchDB
 * database name that the aplication is deployed to.
 *
 * @return {string} The name of the current database.
 */
life.utils.getCurrentDbName = function() {
  var db = window.location.pathname.substr(
    1,
    window.location.pathname.indexOf('/', 1) - 1
  );
  if(db) {
    return db;
  } else {
    return '_db';
  }
};


/**
 * The database reference.
 *
 * @type {?PouchDB}
 */
life.utils.db = null;


/**
 * Fetches the current database object.
 *
 * @return {PouchDB} The jQuery couch database object.
 */
life.utils.getDb = function() {
  life.utils.db = life.utils.db || new PouchDB(
    window.location.origin+ '/' + life.utils.getCurrentDbName()
  );
  return life.utils.db;
};


/**
 * Return a list of the given path components.
 *
 * @param {string=} path The URL path to parse. If not provided will use the
 *     current window.location.hash.
 * @return {Array.<string>} The path as a list.
 */
life.utils.getPathList = function(path) {
  if(!path) {
    path = window.location.hash.substr(1);
  }
  return _.compact(path.split('/'));
};


/**
 * A simple (though maybe not the most efficient) method to deep copy a simple
 * object.
 *
 * @param {Object} target The object to clone.
 * @return {Object} The cloned object.
 */
life.utils.clone = function(target) {
  return JSON.parse(JSON.stringify(target));
};
