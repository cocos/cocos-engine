/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/**
 * EventEmitter.
 */

// (function (factory) { // Module boilerplate
//   if (this.module && module.id.indexOf("event-emitter") >= 0) { // require
//     factory.call(this, require, exports, module);
//   } else { // Cu.import
//       const Cu = Components.utils;
//       const { require } = Cu.import("resource://gre/modules/devtools/Loader.jsm", {});
//       this.isWorker = false;
//       this.promise = Cu.import("resource://gre/modules/Promise.jsm", {}).Promise;
//       factory.call(this, require, this, { exports: this });
//       this.EXPORTED_SYMBOLS = ["EventEmitter"];
//   }
// }).call(this, function (require, exports, module) {

this.EventEmitter = function EventEmitter() {};
// module.exports = EventEmitter;

// const { Cu, components } = require("chrome");
// const Services = require("Services");
// const promise = require("promise");
var loggingEnabled = true;

// if (!isWorker) {
//   loggingEnabled = Services.prefs.getBoolPref("devtools.dump.emit");
//   Services.prefs.addObserver("devtools.dump.emit", {
//     observe: () => {
//       loggingEnabled = Services.prefs.getBoolPref("devtools.dump.emit");
//     }
//   }, false);
// }

/**
 * Decorate an object with event emitter functionality.
 *
 * @param Object objectToDecorate
 *        Bind all public methods of EventEmitter to
 *        the objectToDecorate object.
 */
EventEmitter.decorate = function (objectToDecorate) {
  let emitter = new EventEmitter();
  objectToDecorate.on = emitter.on.bind(emitter);
  objectToDecorate.off = emitter.off.bind(emitter);
  objectToDecorate.once = emitter.once.bind(emitter);
  objectToDecorate.emit = emitter.emit.bind(emitter);
};

EventEmitter.prototype = {
  /**
   * Connect a listener.
   *
   * @param string event
   *        The event name to which we're connecting.
   * @param function listener
   *        Called when the event is fired.
   */
  on(event, listener) {
    if (!this._eventEmitterListeners) {
      this._eventEmitterListeners = new Map();
    }
    if (!this._eventEmitterListeners.has(event)) {
      this._eventEmitterListeners.set(event, []);
    }
    this._eventEmitterListeners.get(event).push(listener);
  },

  /**
   * Listen for the next time an event is fired.
   *
   * @param string event
   *        The event name to which we're connecting.
   * @param function listener
   *        (Optional) Called when the event is fired. Will be called at most
   *        one time.
   * @return promise
   *        A promise which is resolved when the event next happens. The
   *        resolution value of the promise is the first event argument. If
   *        you need access to second or subsequent event arguments (it's rare
   *        that this is needed) then use listener
   */
  once(event, listener) {
    let deferred = Promise.defer();

    let handler = (_, first, ...rest) => {
      this.off(event, handler);
      if (listener) {
        listener.apply(null, [event, first, ...rest]);
      }
      deferred.resolve(first);
    };

    handler._originalListener = listener;
    this.on(event, handler);

    return deferred.promise;
  },

  /**
   * Remove a previously-registered event listener.  Works for events
   * registered with either on or once.
   *
   * @param string event
   *        The event name whose listener we're disconnecting.
   * @param function listener
   *        The listener to remove.
   */
  off(event, listener) {
    if (!this._eventEmitterListeners) {
      return;
    }
    let listeners = this._eventEmitterListeners.get(event);
    if (listeners) {
      this._eventEmitterListeners.set(event, listeners.filter(l => {
        return l !== listener && l._originalListener !== listener;
      }));
    }
  },

  /**
   * Emit an event.  All arguments to this method will
   * be sent to listener functions.
   */
  emit(event) {
    this.logEvent(event, arguments);

    if (!this._eventEmitterListeners || !this._eventEmitterListeners.has(event)) {
      return;
    }

    let originalListeners = this._eventEmitterListeners.get(event);
    for (let listener of this._eventEmitterListeners.get(event)) {
      // If the object was destroyed during event emission, stop
      // emitting.
      if (!this._eventEmitterListeners) {
        break;
      }

      // If listeners were removed during emission, make sure the
      // event handler we're going to fire wasn't removed.
      if (originalListeners === this._eventEmitterListeners.get(event) ||
          this._eventEmitterListeners.get(event).some(l => l === listener)) {
        try {
          listener.apply(null, arguments);
        } catch (ex) {
          // Prevent a bad listener from interfering with the others.
          let msg = ex + ": " + ex.stack;
          log(msg);
          DevToolsUtils.dumpn(msg + "\n");
        }
      }
    }
  },

  logEvent(event, args) {
    if (!loggingEnabled) {
      return;
    }

    let caller, func, path;
//    if (!isWorker) {
//      caller = components.stack.caller.caller;
//      func = caller.name;
//      let file = caller.filename;
//      if (file.includes(" -> ")) {
//        file = caller.filename.split(/ -> /)[1];
//      }
//      path = file + ":" + caller.lineNumber;
//    }

    let argOut = "(";
    if (args.length === 1) {
      argOut += event;
    }

    let out = "EMITTING: ";

    // We need this try / catch to prevent any dead object errors.
    try {
      for (let i = 1; i < args.length; i++) {
        if (i === 1) {
          argOut = "(" + event + ", ";
        } else {
          argOut += ", ";
        }

        let arg = args[i];
        argOut += arg;

        if (arg && arg.nodeName) {
          argOut += " (" + arg.nodeName;
          if (arg.id) {
            argOut += "#" + arg.id;
          }
          if (arg.className) {
            argOut += "." + arg.className;
          }
          argOut += ")";
        }
      }
    } catch(e) {
      // Object is dead so the toolbox is most likely shutting down,
      // do nothing.
    }

    argOut += ")";
    out += "emit" + argOut + " from " + func + "() -> " + path + "\n";

    DevToolsUtils.dumpn(out);
  },
};

// });
