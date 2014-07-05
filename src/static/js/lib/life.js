/**
 * @fileoverview High level classes and functions for use in the application.
 */

goog.provide('life');
goog.provide('life.Modal');
goog.provide('life.Router');
goog.provide('life.View');


/**
 * Default application defintions for the interface.
 *
 * @type {Object.<string, Object>}
 */
life.DEFAULT_APPS = {
  'notes': {
    title: 'Notes',
    template: [
      {key: 'title', type: 'string'},
      {key: 'description', type: 'rich'}
    ],
    type: 'note'
  },
  'passwords': {
    title: 'Passwords',
    template: [
      {key: 'title', type: 'string'},
      {key: 'link', type: 'string'},
      {key: 'username', type: 'string', encrypted: true},
      {key: 'password', type: 'password', encrypted: true},
      {key: 'email', type: 'string', encrypted: true}
    ],
    type: 'password'
  },
  'links': {
    title: 'Links',
    template: [
      {key: 'title', type: 'string'},
      {key: 'link', type: 'string'},
      {key: 'description', type: 'rich'}
    ],
    type: 'link'
  }
};
// TODO(jordoncm): Add typedefs for these above.


/**
 * Provides method for simple inheritance.
 *
 * @param {function} child The child class constructor.
 * @param {function} parent Thr parent class constructor.
 * @return {function} The child constructor now inherited from the parent.
 */
life.extend = function(child, parent) {
  // TODO(jordoncm): Add mixin capability.
  if(parent) {
    // Creating a tmp function here prevents the parent's constructor from
    // being called, leaving it to the child to call super if needed.

    // Create a temporary class.
    var tmp = function() {};
    // Assign the parent's prototype (methods and properties) to the temporary
    // class.
    tmp.prototype = parent.prototype;
    // Instantiate the temporary class (to make a copy) and assign that to the
    // child's prototype so it gets access to all the parent methods and
    // properties.
    child.prototype = new tmp();
    // Put the child's constructor back in place so new instances call the
    // correct method when created.
    child.prototype.constructor = child;
  }
  return child;
};


/**
 * Change the route of the application.
 *
 * @param {string|Array.<string>} path The full path to change the location to.
 */
life.route = function(path) {
  if(typeof path === 'object') {
    path = '/' + path.join('/') + '/';
    if(path === '//') {
      path = '/';
    }
  }
  window.location.hash = '#' + path;
};



/**
 * Monitors the hash path and publishes events accordingly.
 *
 * @constructor
 * @param {Object.<string, string>} routes A hash of path matching expressions
 *     and the topics to publish to when the path is executed.
 */
life.Router = function(routes) {
  this.routes = routes;
};


/**
 * A mapping of string expressions to the topic that should publish if the hash
 * matches the route.
 *
 * @type {Object.<string, string>}
 */
life.Router.prototype.routes;


/**
 * Starts the instance of the router listening to changes in the window hash
 * path.
 */
life.Router.prototype.start = function() {
  $(window).hashchange(_.bind(this.route, this));
  $(window).hashchange();
};


/**
 * Handles a change in the URL hash.
 */
life.Router.prototype.route = function() {
  var url = window.location.hash.substr(1);
  if(this.currentRoute !== url) {
    if(url === '') {
      window.location.hash = '#/';
      return;
    }
    for(var key in this.routes) {
      this.testRoute(url, key, this.routes[key]);
    }
    this.currentRoute = url;
  }
};


/**
 * Tests a specifc route against the current URL and publishes the route change
 * if there is a match.
 *
 * It will also publish an exit route to the previous route if there is one.
 *
 * @param {string} url The current path (from the window hash).
 * @param {string} regex The string to pass into the constructor of RegExp for
 *     testing.
 * @param {string} topic The topic to publish to if the expression matches.
 */
life.Router.prototype.testRoute = function(url, regex, topic) {
  var expression = new RegExp(regex);
  if(expression.test(url)) {
    $.publish(topic, _.rest(expression.exec(url)));
  } else if (this.currentRoute && expression.test(this.currentRoute)) {
    // Notify old route in case they need to change state when moving away from
    // a given route (i.e. derender).
    $.publish(topic + '/exit', url);
  }
};



/**
 * Base view class.
 *
 * @constructor
 */
life.View = function() {
  this.events = [];
  this.subscriptions = [];
};


/**
 * The current active application.
 *
 * @type {string}
 */
life.View.prototype.app = '';


/**
 * List of events the view is managing.
 *
 * @type {Array.<Object>}
 */
life.View.prototype.events;


/**
 * Add an event to the view.
 *
 * @param {string} target The selector to bind the event to.
 * @param {string} event The type of event to trigger on.
 * @param {function} callback The method to call when the event fires.
 * @return {number} The index to track the event by.
 */
life.View.prototype.on = function(target, event, callback) {
  this.events = this.events || [];
  this.events.push({
    target: target,
    event: event,
    callback: callback
  });
  $(target).on(event, callback);
  return this.events.length;
};


/**
 * Disable an event managed by the view.
 *
 * @param {number} index The index of the event.
 */
life.View.prototype.off = function(index) {
  this.events = this.events || [];
  if(this.events[index]) {
    var event = this.events[index];
    $(event.target).off(event.event, event.callback);
    this.events[index] = null;
  }
};


/**
 * List of subscriptions managed by the view.
 *
 * @type {Array.<Object>}
 */
life.View.prototype.subscriptions;


/**
 * Subscribe to a topic and tie it to the view.
 *
 * @param {string} topic The topic to subscribe to.
 * @param {function} callback The method to call when the event fires.
 * @return {number} An index which can be used to unsubscribe with.
 */
life.View.prototype.subscribe = function(topic, callback) {
  this.subscriptions = this.subscriptions || [];
  this.subscriptions.push({topic: topic, callback: callback});
  $.subscribe(topic, callback);
  return this.subscriptions.length;
};


/**
 * Unsubscribe from a topic/callback tied to the view.
 *
 * @param {number} index The index given at time of subscription.
 */
life.View.prototype.unsubscribe = function(index) {
  this.subscriptions = this.subscriptions || [];
  if(this.subscriptions[index]) {
    var subscription = this.subscriptions[index];
    $.unsubscribe(subscription.topic, subscription.callback);
    this.subscriptions[index] = null;
  }
};


/**
 * The selector target to render templates to.
 *
 * @type {string}
 */
life.View.prototype.el = '#content';


/**
 * Dispose of the DOM and events of the view.
 */
life.View.prototype.dispose = function() {
  for(var i = 0; i < this.events.length; i++) {
    this.off(i);
  }
  this.events = [];

  $(this.el).html('');

  if(typeof this.onDispose === 'function') {
    this.onDispose();
  }
};


/**
 * Close the view.
 */
life.View.prototype.close = function() {
  this.dispose();

  for(var i = 0; i < this.subscriptions.length; i++) {
    this.unsubscribe(i);
  }
  this.subscriptions = [];

  if(typeof this.onClose === 'function') {
    this.onClose();
  }
};



/**
 * A base view for modal dialogs to extend from.
 *
 * @constructor
 * @extends {life.View}
 */
life.Modal = life.extend(function() {
  life.View.call(this);
}, life.View);


/**
 * The selector target for the view to render into.
 *
 * @type {string}
 */
life.Modal.prototype.el = '#modal';
