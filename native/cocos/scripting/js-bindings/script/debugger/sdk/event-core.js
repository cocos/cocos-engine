/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const UNCAUGHT_ERROR = 'An error event was emitted for which there was no listener.';
const BAD_LISTENER = 'The event listener must be a function.';

const EVENT_TYPE_PATTERN = /^on([A-Z]\w+$)/;

// Count of total listeners ever added.
// This is used to keep track of when a listener was added, which can
// have an effect on when it is and isn't dispatched. See comments in
// emitOnObject for more details.
let listenerCount = 0;

const observers = new DefaultWeakMap(() => {
  return new DefaultMap(() => new Map());
});

/**
 * Registers an event `listener` that is called every time events of
 * specified `type` is emitted on the given event `target`.
 * @param {Object} target
 *    Event target object.
 * @param {String} type
 *    The type of event.
 * @param {Function} listener
 *    The listener function that processes the event.
 */
function on(target, type, listener) {
  if (typeof(listener) !== 'function')
    throw new Error(BAD_LISTENER);

  observers.get(target).get(type).set(listener, listenerCount++);
}
// exports.on = on;


// Map of wrapper functions for listeners added using `once`.
var onceWeakMap = new WeakMap();

/**
 * Registers an event `listener` that is called only the next time an event
 * of the specified `type` is emitted on the given event `target`.
 * @param {Object} target
 *    Event target object.
 * @param {String} type
 *    The type of the event.
 * @param {Function} listener
 *    The listener function that processes the event.
 */
function once(target, type, listener) {
  function replacement(...args) {
    off(target, type, replacement);
    onceWeakMap.delete(listener);
    listener.apply(target, args);
  };
  onceWeakMap.set(listener, replacement);
  on(target, type, replacement);
}
// exports.once = once;

/**
 * Execute each of the listeners in order with the supplied arguments.
 * All the exceptions that are thrown by listeners during the emit
 * are caught and can be handled by listeners of 'error' event. Thrown
 * exceptions are passed as an argument to an 'error' event listener.
 * If no 'error' listener is registered exception will be logged into an
 * error console.
 * @param {Object} target
 *    Event target object.
 * @param {String} type
 *    The type of event.
 * @params {Object|Number|String|Boolean} args
 *    Arguments that will be passed to listeners.
 */
function emit (target, type, ...args) {
  emitOnObject(target, type, target, ...args);
}
// exports.emit = emit;

/**
 * A variant of emit that allows setting the this property for event listeners
 */
function emitOnObject(target, type, thisArg, ...args) {
  let allListeners = observers.get(target);
  let listeners = allListeners.get(type);

  // If error event and there are no handlers (explicit or catch-all)
  // then print error message to the console.
  if (type === 'error' && !listeners.size && !allListeners.get('*').size)
    console.exception(args[0]);

  let count = listenerCount;
  for (let [listener, added] of listeners)
    try {
      // Since our contract unfortunately requires that we not dispatch to
      // this event to listeners that were either added or removed during this
      // dispatch, we need to check when each listener was added.
      if (added >= count)
        break;
      listener.apply(thisArg, args);
    }
    catch (error) {
      // If exception is not thrown by a error listener and error listener is
      // registered emit `error` event. Otherwise dump exception to the console.
      if (type !== 'error')
        emitOnObject(target, 'error', target, error);
      else
        console.exception(error);
    }

  // Also emit on `"*"` so that one could listen for all events.
  if (type !== '*' && allListeners.get('*').size)
    emitOnObject(target, '*', target, type, ...args);
}
// exports.emitOnObject = emitOnObject;

/**
 * Removes an event `listener` for the given event `type` on the given event
 * `target`. If no `listener` is passed removes all listeners of the given
 * `type`. If `type` is not passed removes all the listeners of the given
 * event `target`.
 * @param {Object} target
 *    The event target object.
 * @param {String} type
 *    The type of event.
 * @param {Function} listener
 *    The listener function that processes the event.
 */
function off(target, type, listener) {
  let length = arguments.length;
  if (length === 3) {
    if (onceWeakMap.has(listener)) {
      observers.get(target).get(type)
               .delete(onceWeakMap.get(listener));
      onceWeakMap.delete(listener);
    }

    observers.get(target).get(type).delete(listener);
  }
  else if (length === 2) {
    observers.get(target).get(type).clear();
    observers.get(target).delete(type);
  }
  else if (length === 1) {
    for (let listeners of observers.get(target).values())
      listeners.clear();
    observers.delete(target);
  }
}
// exports.off = off;

/**
 * Returns a number of event listeners registered for the given event `type`
 * on the given event `target`.
 */
function count(target, type) {
  return observers.get(target).get(type).size;
}
// exports.count = count;

/**
 * Registers listeners on the given event `target` from the given `listeners`
 * dictionary. Iterates over the listeners and if property name matches name
 * pattern `onEventType` and property is a function, then registers it as
 * an `eventType` listener on `target`.
 *
 * @param {Object} target
 *    The type of event.
 * @param {Object} listeners
 *    Dictionary of listeners.
 */
function setListeners(target, listeners) {
  Object.keys(listeners || {}).forEach(key => {
    let match = EVENT_TYPE_PATTERN.exec(key);
    let type = match && match[1].toLowerCase();
    if (!type)
      return;

    let listener = listeners[key];
    if (typeof(listener) === 'function')
      on(target, type, listener);
  });
}
// exports.setListeners = setListeners;