/**
 * @fileoverview Application externs.
 * @externs
 */


$.couch = {};


/**
 * @param {string} name
 * @return {$.couch.db}
 */
$.couch.db = function(name) {};


$.couch.db.prototype.openDoc = function() {};


$.couch.db.prototype.removeDoc = function() {};


$.couch.db.prototype.saveDoc = function() {};


$.couch.db.prototype.view = function() {};


/**
 * @param {function=} callback
 */
$.hashchange = function(callback) {};


/**
 * @param {string} topic
 * @param {Object=} data
 */
$.publish = function(topic, data) {};


/**
 * @param {string} data
 * @param {function} callback
 */
$.subscribe = function(data, callback) {};


/**
 * @param {string} action
 */
jQuery.prototype.modal = function(action) {};


var PouchDB = function(name, options) {};

PouchDB.prototype.get = function() {};
PouchDB.prototype.post = function() {};
PouchDB.prototype.put = function() {};
PouchDB.prototype.query = function() {};
PouchDB.prototype.remove = function() {};


var nunjucks = {};


/**
 * @param {string} path
 * @param {Object=} options
 * @return {Environment}
 */
nunjucks.configure = function(path, options) {};


/**
 * @param {string} template
 * @param {Object=} options
 * @return {string}
 */
nunjucks.render = function(template, options) {};



/**
 * @constructor
 * @return {EpicEditor}
 */
var Environment = function() {};


/**
 * @param {string} name
 * @param {function} method
 */
Environment.prototype.addFilter = function(name, method) {};



/**
 * @constructor
 * @param {Object.<string,*>=} options
 * @return {EpicEditor}
 */
var EpicEditor = function(options) {};


EpicEditor.prototype.load = function() {};


EpicEditor.prototype.unload = function() {};


var CryptoJS = {};


CryptoJS.AES = {};


/**
 * @param {string} data
 * @param {string} key
 * @return {string}
 */
CryptoJS.AES.encrypt = function(data, key) {};


/**
 * @param {string} data
 * @param {string} key
 * @return {string}
 */
CryptoJS.AES.decrypt = function(data, key) {};


CryptoJS.enc = {};


CryptoJS.enc.Utf8 = {};
