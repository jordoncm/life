/*
 * Copyright (c) 2013 Jordon Mears.
 *
 * Web Application Scaffolding is made available under the MIT license.
 * <http://opensource.org/licenses/MIT>
 */

/**
 * @fileoverview Basics for making the compiler function as expected.
 *
 * In general you should not add to or change this file unless you know what
 * you are doing.
 */

goog.provide('__was__');


/**
 * A magic constant to help the compiler to know whether or not to strip calls
 * to 'console'.
 *
 * @define {boolean} This value is set by the compiler at runtime.
 */
var __DEBUG__ = false;

if(!__DEBUG__) {
  /**
   * @type {Object.<string, function>}
   */
  var console = {};


  /**
   * @type {function}
   */
  console.debug = function() {};


  /**
   * @type {function}
   */
  console.dir = function() {};


  /**
   * @type {function}
   */
  console.error = function() {};


  /**
   * @type {function}
   */
  console.group = function() {};


  /**
   * @type {function}
   */
  console.groupCollapsed = function() {};


  /**
   * @type {function}
   */
  console.groupEnd = function() {};


  /**
   * @type {function}
   */
  console.info = function() {};


  /**
   * @type {function}
   */
  console.log = function() {};


  /**
   * @type {function}
   */
  console.profile = function() {};


  /**
   * @type {function}
   */
  console.profileEnd = function() {};


  /**
   * @type {function}
   */
  console.time = function() {};


  /**
   * @type {function}
   */
  console.timeEnd = function() {};


  /**
   * @type {function}
   */
  console.trace = function() {};


  /**
   * @type {function}
   */
  console.warn = function() {};
}


/**
 * Export a symbol out of the compiler.
 *
 * This is a replacement for goog.exportSymbol. Did not want to require the
 * entire Closure library for a simple method to make properties available
 * outside of the compilers renaming.
 *
 * @param {string} ns The full namespace path to register the given object to.
 * @param {Object} obj The object to export.
 */
__was__.exportSymbol = function(ns, obj) {
  var parts = ns.split('.');
  var cur = window;

  if(!(parts[0] in cur) && cur.execScript) {
    cur.execScript('var ' + parts[0]);
  }

  for(var part; parts.length && (part = parts.shift());) {
    if(!parts.length && obj !== undefined) {
      // Last part and we have an object; use it.
      cur[part] = obj;
    } else if(cur[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};
