/* -*- indent-tabs-mode: nil; js-indent-level: 2 -*- */
/* vim: set ft= javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

 "use strict";
 
 //const {Cc, Ci, Cu, components} = require("chrome");
 //const {isWindowIncluded} = require("devtools/shared/layout/utils");
 //const Services = require("Services");
 //const {XPCOMUtils} = require("resource://gre/modules/XPCOMUtils.jsm");
 
 // TODO: Bug 842672 - browser/ imports modules from toolkit/.
 // Note that these are only used in WebConsoleCommands, see $0 and pprint().
 //loader.lazyImporter(this, "VariablesView", "resource://devtools/client/shared/widgets/VariablesView.jsm");
 
 //XPCOMUtils.defineLazyServiceGetter(this,
 //                                   "swm",
 //                                   "@mozilla.org/serviceworkers/manager;1",
 //                                   "nsIServiceWorkerManager");
 
const CONSOLE_WORKER_IDS = [
  "SharedWorker",
  "ServiceWorker",
  "Worker"
];

var WebConsoleUtils = {

  /**
   * Given a message, return one of CONSOLE_WORKER_IDS if it matches
   * one of those.
   *
   * @return string
   */
  getWorkerType: function (message) {
    let id = message ? message.innerID : null;
    return CONSOLE_WORKER_IDS[CONSOLE_WORKER_IDS.indexOf(id)] || null;
  },

  /**
   * Clone an object.
   *
   * @param object object
   *        The object you want cloned.
   * @param boolean recursive
   *        Tells if you want to dig deeper into the object, to clone
   *        recursively.
   * @param function [filter]
   *        Optional, filter function, called for every property. Three
   *        arguments are passed: key, value and object. Return true if the
   *        property should be added to the cloned object. Return false to skip
   *        the property.
   * @return object
   *         The cloned object.
   */
  cloneObject: function (object, recursive, filter) {
    if (typeof object != "object") {
      return object;
    }

    let temp;

    if (Array.isArray(object)) {
      temp = [];
      Array.forEach(object, function (value, index) {
        if (!filter || filter(index, value, object)) {
          temp.push(recursive ? WebConsoleUtils.cloneObject(value) : value);
        }
      });
    } else {
      temp = {};
      for (let key in object) {
        let value = object[key];
        if (object.hasOwnProperty(key) &&
            (!filter || filter(key, value, object))) {
          temp[key] = recursive ? WebConsoleUtils.cloneObject(value) : value;
        }
      }
    }

    return temp;
  },

  /**
   * Gets the ID of the inner window of this DOM window.
   *
   * @param nsIDOMWindow window
   * @return integer
   *         Inner ID for the given window.
   */
  getInnerWindowId: function (window) {
    return window.QueryInterface(Ci.nsIInterfaceRequestor)
             .getInterface(Ci.nsIDOMWindowUtils).currentInnerWindowID;
  },

  /**
   * Recursively gather a list of inner window ids given a
   * top level window.
   *
   * @param nsIDOMWindow window
   * @return Array
   *         list of inner window ids.
   */
  getInnerWindowIDsForFrames: function (window) {
    let innerWindowID = this.getInnerWindowId(window);
    let ids = [innerWindowID];

    if (window.frames) {
      for (let i = 0; i < window.frames.length; i++) {
        let frame = window.frames[i];
        ids = ids.concat(this.getInnerWindowIDsForFrames(frame));
      }
    }

    return ids;
  },

  /**
   * Get the property descriptor for the given object.
   *
   * @param object object
   *        The object that contains the property.
   * @param string prop
   *        The property you want to get the descriptor for.
   * @return object
   *         Property descriptor.
   */
  getPropertyDescriptor: function (object, prop) {
    let desc = null;
    while (object) {
      try {
        if ((desc = Object.getOwnPropertyDescriptor(object, prop))) {
          break;
        }
      } catch (ex) {
        // Native getters throw here. See bug 520882.
        // null throws TypeError.
        if (ex.name != "NS_ERROR_XPC_BAD_CONVERT_JS" &&
            ex.name != "NS_ERROR_XPC_BAD_OP_ON_WN_PROTO" &&
            ex.name != "TypeError") {
          throw ex;
        }
      }

      try {
        object = Object.getPrototypeOf(object);
      } catch (ex) {
        if (ex.name == "TypeError") {
          return desc;
        }
        throw ex;
      }
    }
    return desc;
  },

  /**
   * Create a grip for the given value. If the value is an object,
   * an object wrapper will be created.
   *
   * @param mixed value
   *        The value you want to create a grip for, before sending it to the
   *        client.
   * @param function objectWrapper
   *        If the value is an object then the objectWrapper function is
   *        invoked to give us an object grip. See this.getObjectGrip().
   * @return mixed
   *         The value grip.
   */
  createValueGrip: function (value, objectWrapper) {
    switch (typeof value) {
      case "boolean":
        return value;
      case "string":
        return objectWrapper(value);
      case "number":
        if (value === Infinity) {
          return { type: "Infinity" };
        } else if (value === -Infinity) {
          return { type: "-Infinity" };
        } else if (Number.isNaN(value)) {
          return { type: "NaN" };
        } else if (!value && 1 / value === -Infinity) {
          return { type: "-0" };
        }
        return value;
      case "undefined":
        return { type: "undefined" };
      case "object":
        if (value === null) {
          return { type: "null" };
        }
        // Fall through.
      case "function":
        return objectWrapper(value);
      default:
        console.error("Failed to provide a grip for value of " + typeof value
                      + ": " + value);
        return null;
    }
  },
};

//  exports.Utils = WebConsoleUtils;

// The page errors listener

/**
 * The nsIConsoleService listener. This is used to send all of the console
 * messages (JavaScript, CSS and more) to the remote Web Console instance.
 *
 * @constructor
 * @param nsIDOMWindow [window]
 *        Optional - the window object for which we are created. This is used
 *        for filtering out messages that belong to other windows.
 * @param object listener
 *        The listener object must have one method:
 *        - onConsoleServiceMessage(). This method is invoked with one argument,
 *        the nsIConsoleMessage, whenever a relevant message is received.
 */
function ConsoleServiceListener(window, listener) {
  this.window = window;
  this.listener = listener;
}
//  exports.ConsoleServiceListener = ConsoleServiceListener;

ConsoleServiceListener.prototype =
{
//  QueryInterface: XPCOMUtils.generateQI([Ci.nsIConsoleListener]),

  /**
   * The content window for which we listen to page errors.
   * @type nsIDOMWindow
   */
  window: null,

  /**
   * The listener object which is notified of messages from the console service.
   * @type object
   */
  listener: null,

  /**
   * Initialize the nsIConsoleService listener.
   */
  init: function () {
    Services.console.registerListener(this);
  },

  /**
   * The nsIConsoleService observer. This method takes all the script error
   * messages belonging to the current window and sends them to the remote Web
   * Console instance.
   *
   * @param nsIConsoleMessage message
   *        The message object coming from the nsIConsoleService.
   */
  observe: function (message) {
    if (!this.listener) {
      return;
    }

    if (this.window) {
      if (!(message instanceof Ci.nsIScriptError) ||
          !message.outerWindowID ||
          !this.isCategoryAllowed(message.category)) {
        return;
      }

      let errorWindow = Services.wm.getOuterWindowWithId(message.outerWindowID);
      if (!errorWindow || !isWindowIncluded(this.window, errorWindow)) {
        return;
      }
    }

    this.listener.onConsoleServiceMessage(message);
  },

  /**
   * Check if the given message category is allowed to be tracked or not.
   * We ignore chrome-originating errors as we only care about content.
   *
   * @param string category
   *        The message category you want to check.
   * @return boolean
   *         True if the category is allowed to be logged, false otherwise.
   */
  isCategoryAllowed: function (category) {
    if (!category) {
      return false;
    }

    switch (category) {
      case "XPConnect JavaScript":
      case "component javascript":
      case "chrome javascript":
      case "chrome registration":
      case "XBL":
      case "XBL Prototype Handler":
      case "XBL Content Sink":
      case "xbl javascript":
        return false;
    }

    return true;
  },

  /**
   * Get the cached page errors for the current inner window and its (i)frames.
   *
   * @param boolean [includePrivate=false]
   *        Tells if you want to also retrieve messages coming from private
   *        windows. Defaults to false.
   * @return array
   *         The array of cached messages. Each element is an nsIScriptError or
   *         an nsIConsoleMessage
   */
  getCachedMessages: function (includePrivate = false) {
    let errors = Services.console.getMessageArray() || [];

    // if !this.window, we're in a browser console. Still need to filter
    // private messages.
    if (!this.window) {
      return errors.filter((error) => {
        if (error instanceof Ci.nsIScriptError) {
          if (!includePrivate && error.isFromPrivateWindow) {
            return false;
          }
        }

        return true;
      });
    }

    let ids = WebConsoleUtils.getInnerWindowIDsForFrames(this.window);

    return errors.filter((error) => {
      if (error instanceof Ci.nsIScriptError) {
        if (!includePrivate && error.isFromPrivateWindow) {
          return false;
        }
        if (ids &&
            (ids.indexOf(error.innerWindowID) == -1 ||
             !this.isCategoryAllowed(error.category))) {
          return false;
        }
      } else if (ids && ids[0]) {
        // If this is not an nsIScriptError and we need to do window-based
        // filtering we skip this message.
        return false;
      }

      return true;
    });
  },

  /**
   * Remove the nsIConsoleService listener.
   */
  destroy: function () {
    Services.console.unregisterListener(this);
    this.listener = this.window = null;
  },
};

// The window.console API observer

/**
 * The window.console API observer. This allows the window.console API messages
 * to be sent to the remote Web Console instance.
 *
 * @constructor
 * @param nsIDOMWindow window
 *        Optional - the window object for which we are created. This is used
 *        for filtering out messages that belong to other windows.
 * @param object owner
 *        The owner object must have the following methods:
 *        - onConsoleAPICall(). This method is invoked with one argument, the
 *        Console API message that comes from the observer service, whenever
 *        a relevant console API call is received.
 * @param object filteringOptions
 *        Optional - The filteringOptions that this listener should listen to:
 *        - addonId: filter console messages based on the addonId.
 */
function ConsoleAPIListener(window, owner, {addonId} = {}) {
  this.window = window;
  this.owner = owner;
  this.addonId = addonId;
}
//  exports.ConsoleAPIListener = ConsoleAPIListener;

ConsoleAPIListener.prototype =
{
//  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),

  /**
   * The content window for which we listen to window.console API calls.
   * @type nsIDOMWindow
   */
  window: null,

  /**
   * The owner object which is notified of window.console API calls. It must
   * have a onConsoleAPICall method which is invoked with one argument: the
   * console API call object that comes from the observer service.
   *
   * @type object
   * @see WebConsoleActor
   */
  owner: null,

  /**
   * The addonId that we listen for. If not null then only messages from this
   * console will be returned.
   */
  addonId: null,

  /**
   * Initialize the window.console API observer.
   */
  init: function () {
    // Note that the observer is process-wide. We will filter the messages as
    // needed, see CAL_observe().
//    Services.obs.addObserver(this, "console-api-log-event", false);
  },

  /**
   * The console API message observer. When messages are received from the
   * observer service we forward them to the remote Web Console instance.
   *
   * @param object message
   *        The message object receives from the observer service.
   * @param string topic
   *        The message topic received from the observer service.
   */
  observe: function (message, topic) {
    if (!this.owner) {
      return;
    }

    // Here, wrappedJSObject is not a security wrapper but a property defined
    // by the XPCOM component which allows us to unwrap the XPCOM interface and
    // access the underlying JSObject.
    let apiMessage = message.wrappedJSObject;

    if (!this.isMessageRelevant(apiMessage)) {
      return;
    }

    this.owner.onConsoleAPICall(apiMessage);
  },

  /**
   * Given a message, return true if this window should show it and false
   * if it should be ignored.
   *
   * @param message
   *        The message from the Storage Service
   * @return bool
   *         Do we care about this message?
   */
  isMessageRelevant: function (message) {
    let workerType = WebConsoleUtils.getWorkerType(message);

    if (this.window && workerType === "ServiceWorker") {
      // For messages from Service Workers, message.ID is the
      // scope, which can be used to determine whether it's controlling
      // a window.
      let scope = message.ID;

      if (!swm.shouldReportToWindow(this.window, scope)) {
        return false;
      }
    }

    if (this.window && !workerType) {
      let msgWindow = Services.wm.getCurrentInnerWindowWithId(message.innerID);
      if (!msgWindow || !isWindowIncluded(this.window, msgWindow)) {
        // Not the same window!
        return false;
      }
    }

    if (this.addonId) {
      // ConsoleAPI.jsm messages contains a consoleID, (and it is currently
      // used in Addon SDK add-ons), the standard 'console' object
      // (which is used in regular webpages and in WebExtensions pages)
      // contains the originAttributes of the source document principal.

      // Filtering based on the originAttributes used by
      // the Console API object.
      if (message.originAttributes &&
          message.originAttributes.addonId == this.addonId) {
        return true;
      }

      // Filtering based on the old-style consoleID property used by
      // the legacy Console JSM module.
      if (message.consoleID && message.consoleID == `addon/${this.addonId}`) {
        return true;
      }

      return false;
    }

    return true;
  },

  /**
   * Get the cached messages for the current inner window and its (i)frames.
   *
   * @param boolean [includePrivate=false]
   *        Tells if you want to also retrieve messages coming from private
   *        windows. Defaults to false.
   * @return array
   *         The array of cached messages.
   */
  getCachedMessages: function (includePrivate = false) {
    let messages = [];
//    let ConsoleAPIStorage = Cc["@mozilla.org/consoleAPI-storage;1"]
//                              .getService(Ci.nsIConsoleAPIStorage);

    // if !this.window, we're in a browser console. Retrieve all events
    // for filtering based on privacy.
//    if (!this.window) {
//      messages = ConsoleAPIStorage.getEvents();
//    } else {
//      let ids = WebConsoleUtils.getInnerWindowIDsForFrames(this.window);
//      ids.forEach((id) => {
//        messages = messages.concat(ConsoleAPIStorage.getEvents(id));
//      });
//    }
//
//    CONSOLE_WORKER_IDS.forEach((id) => {
//      messages = messages.concat(ConsoleAPIStorage.getEvents(id));
//    });

    messages = messages.filter(msg => {
      return this.isMessageRelevant(msg);
    });

    if (includePrivate) {
      return messages;
    }

    return messages.filter((m) => !m.private);
  },

  /**
   * Destroy the console API listener.
   */
  destroy: function () {
//    Services.obs.removeObserver(this, "console-api-log-event");
    this.window = this.owner = null;
  },
};

/**
 * WebConsole commands manager.
 *
 * Defines a set of functions /variables ("commands") that are available from
 * the Web Console but not from the web page.
 *
 */
var WebConsoleCommands = {
  _registeredCommands: new Map(),
  _originalCommands: new Map(),

  /**
   * @private
   * Reserved for built-in commands. To register a command from the code of an
   * add-on, see WebConsoleCommands.register instead.
   *
   * @see WebConsoleCommands.register
   */
  _registerOriginal: function (name, command) {
    this.register(name, command);
    this._originalCommands.set(name, this.getCommand(name));
  },

  /**
   * Register a new command.
   * @param {string} name The command name (exemple: "$")
   * @param {(function|object)} command The command to register.
   *  It can be a function so the command is a function (like "$()"),
   *  or it can also be a property descriptor to describe a getter / value (like
   *  "$0").
   *
   *  The command function or the command getter are passed a owner object as
   *  their first parameter (see the example below).
   *
   *  Note that setters don't work currently and "enumerable" and "configurable"
   *  are forced to true.
   *
   * @example
   *
   *   WebConsoleCommands.register("$", function JSTH_$(owner, selector)
   *   {
   *     return owner.window.document.querySelector(selector);
   *   });
   *
   *   WebConsoleCommands.register("$0", {
   *     get: function(owner) {
   *       return owner.makeDebuggeeValue(owner.selectedNode);
   *     }
   *   });
   */
  register: function (name, command) {
    this._registeredCommands.set(name, command);
  },

  /**
   * Unregister a command.
   *
   * If the command being unregister overrode a built-in command,
   * the latter is restored.
   *
   * @param {string} name The name of the command
   */
  unregister: function (name) {
    this._registeredCommands.delete(name);
    if (this._originalCommands.has(name)) {
      this.register(name, this._originalCommands.get(name));
    }
  },

  /**
   * Returns a command by its name.
   *
   * @param {string} name The name of the command.
   *
   * @return {(function|object)} The command.
   */
  getCommand: function (name) {
    return this._registeredCommands.get(name);
  },

  /**
   * Returns true if a command is registered with the given name.
   *
   * @param {string} name The name of the command.
   *
   * @return {boolean} True if the command is registered.
   */
  hasCommand: function (name) {
    return this._registeredCommands.has(name);
  },
};

//  exports.WebConsoleCommands = WebConsoleCommands;

/*
 * Built-in commands.
  *
  * A list of helper functions used by Firebug can be found here:
  *   http://getfirebug.com/wiki/index.php/Command_Line_API
 */

/**
 * Find a node by ID.
 *
 * @param string id
 *        The ID of the element you want.
 * @return nsIDOMNode or null
 *         The result of calling document.querySelector(selector).
 */
WebConsoleCommands._registerOriginal("$", function (owner, selector) {
  return owner.window.document.querySelector(selector);
});

/**
 * Find the nodes matching a CSS selector.
 *
 * @param string selector
 *        A string that is passed to window.document.querySelectorAll.
 * @return nsIDOMNodeList
 *         Returns the result of document.querySelectorAll(selector).
 */
WebConsoleCommands._registerOriginal("$$", function (owner, selector) {
  let nodes = owner.window.document.querySelectorAll(selector);

  // Calling owner.window.Array.from() doesn't work without accessing the
  // wrappedJSObject, so just loop through the results instead.
  let result = new owner.window.Array();
  for (let i = 0; i < nodes.length; i++) {
    result.push(nodes[i]);
  }
  return result;
});

/**
 * Returns the result of the last console input evaluation
 *
 * @return object|undefined
 * Returns last console evaluation or undefined
 */
WebConsoleCommands._registerOriginal("$_", {
  get: function (owner) {
    return owner.consoleActor.getLastConsoleInputEvaluation();
  }
});

/**
 * Runs an xPath query and returns all matched nodes.
 *
 * @param string xPath
 *        xPath search query to execute.
 * @param [optional] nsIDOMNode context
 *        Context to run the xPath query on. Uses window.document if not set.
 * @return array of nsIDOMNode
 */
WebConsoleCommands._registerOriginal("$x", function (owner, xPath, context) {
  let nodes = new owner.window.Array();

  // Not waiving Xrays, since we want the original Document.evaluate function,
  // instead of anything that's been redefined.
  let doc = owner.window.document;
  context = context || doc;

  let results = doc.evaluate(xPath, context, null,
                             Ci.nsIDOMXPathResult.ANY_TYPE, null);
  let node;
  while ((node = results.iterateNext())) {
    nodes.push(node);
  }

  return nodes;
});

/**
 * Returns the currently selected object in the highlighter.
 *
 * @return Object representing the current selection in the
 *         Inspector, or null if no selection exists.
 */
WebConsoleCommands._registerOriginal("$0", {
  get: function (owner) {
    return owner.makeDebuggeeValue(owner.selectedNode);
  }
});

/**
 * Clears the output of the WebConsole.
 */
WebConsoleCommands._registerOriginal("clear", function (owner) {
  owner.helperResult = {
    type: "clearOutput",
  };
});

/**
 * Clears the input history of the WebConsole.
 */
WebConsoleCommands._registerOriginal("clearHistory", function (owner) {
  owner.helperResult = {
    type: "clearHistory",
  };
});

/**
 * Returns the result of Object.keys(object).
 *
 * @param object object
 *        Object to return the property names from.
 * @return array of strings
 */
WebConsoleCommands._registerOriginal("keys", function (owner, object) {
  // Need to waive Xrays so we can iterate functions and accessor properties
  return Cu.cloneInto(Object.keys(Cu.waiveXrays(object)), owner.window);
});

/**
 * Returns the values of all properties on object.
 *
 * @param object object
 *        Object to display the values from.
 * @return array of string
 */
WebConsoleCommands._registerOriginal("values", function (owner, object) {
  let values = [];
  // Need to waive Xrays so we can iterate functions and accessor properties
  let waived = Cu.waiveXrays(object);
  let names = Object.getOwnPropertyNames(waived);

  for (let name of names) {
    values.push(waived[name]);
  }

  return Cu.cloneInto(values, owner.window);
});

/**
 * Opens a help window in MDN.
 */
WebConsoleCommands._registerOriginal("help", function (owner) {
  owner.helperResult = { type: "help" };
});

/**
 * Change the JS evaluation scope.
 *
 * @param DOMElement|string|window window
 *        The window object to use for eval scope. This can be a string that
 *        is used to perform document.querySelector(), to find the iframe that
 *        you want to cd() to. A DOMElement can be given as well, the
 *        .contentWindow property is used. Lastly, you can directly pass
 *        a window object. If you call cd() with no arguments, the current
 *        eval scope is cleared back to its default (the top window).
 */
WebConsoleCommands._registerOriginal("cd", function (owner, window) {
  if (!window) {
    owner.consoleActor.evalWindow = null;
    owner.helperResult = { type: "cd" };
    return;
  }

  if (typeof window == "string") {
    window = owner.window.document.querySelector(window);
  }
  if (window instanceof Ci.nsIDOMElement && window.contentWindow) {
    window = window.contentWindow;
  }
  if (!(window instanceof Ci.nsIDOMWindow)) {
    owner.helperResult = {
      type: "error",
      message: "cdFunctionInvalidArgument"
    };
    return;
  }

  owner.consoleActor.evalWindow = window;
  owner.helperResult = { type: "cd" };
});

/**
 * Inspects the passed object. This is done by opening the PropertyPanel.
 *
 * @param object object
 *        Object to inspect.
 */
WebConsoleCommands._registerOriginal("inspect", function (owner, object) {
  let dbgObj = owner.makeDebuggeeValue(object);
  let grip = owner.createValueGrip(dbgObj);
  owner.helperResult = {
    type: "inspectObject",
    input: owner.evalInput,
    object: grip,
  };
});

/**
 * Prints object to the output.
 *
 * @param object object
 *        Object to print to the output.
 * @return string
 */
WebConsoleCommands._registerOriginal("pprint", function (owner, object) {
  if (object === null || object === undefined || object === true ||
      object === false) {
    owner.helperResult = {
      type: "error",
      message: "helperFuncUnsupportedTypeError",
    };
    return null;
  }

  owner.helperResult = { rawOutput: true };

  if (typeof object == "function") {
    return object + "\n";
  }

  let output = [];

  let obj = object;
  for (let name in obj) {
    let desc = WebConsoleUtils.getPropertyDescriptor(obj, name) || {};
    if (desc.get || desc.set) {
      // TODO: Bug 842672 - toolkit/ imports modules from browser/.
      let getGrip = VariablesView.getGrip(desc.get);
      let setGrip = VariablesView.getGrip(desc.set);
      let getString = VariablesView.getString(getGrip);
      let setString = VariablesView.getString(setGrip);
      output.push(name + ":", "  get: " + getString, "  set: " + setString);
    } else {
      let valueGrip = VariablesView.getGrip(obj[name]);
      let valueString = VariablesView.getString(valueGrip);
      output.push(name + ": " + valueString);
    }
  }

  return "  " + output.join("\n  ");
});

/**
 * Print the String representation of a value to the output, as-is.
 *
 * @param any value
 *        A value you want to output as a string.
 * @return void
 */
WebConsoleCommands._registerOriginal("print", function (owner, value) {
  owner.helperResult = { rawOutput: true };
  if (typeof value === "symbol") {
    return Symbol.prototype.toString.call(value);
  }
  // Waiving Xrays here allows us to see a closer representation of the
  // underlying object. This may execute arbitrary content code, but that
  // code will run with content privileges, and the result will be rendered
  // inert by coercing it to a String.
  return String(Cu.waiveXrays(value));
});

/**
 * Copy the String representation of a value to the clipboard.
 *
 * @param any value
 *        A value you want to copy as a string.
 * @return void
 */
WebConsoleCommands._registerOriginal("copy", function (owner, value) {
  let payload;
  try {
    if (value instanceof Ci.nsIDOMElement) {
      payload = value.outerHTML;
    } else if (typeof value == "string") {
      payload = value;
    } else {
      payload = JSON.stringify(value, null, "  ");
    }
  } catch (ex) {
    payload = "/* " + ex + " */";
  }
  owner.helperResult = {
    type: "copyValueToClipboard",
    value: payload,
  };
});

/**
 * (Internal only) Add the bindings to |owner.sandbox|.
 * This is intended to be used by the WebConsole actor only.
  *
  * @param object owner
  *        The owning object.
  */
function addWebConsoleCommands(owner) {
  if (!owner) {
    throw new Error("The owner is required");
  }
  for (let [name, command] of WebConsoleCommands._registeredCommands) {
    if (typeof command === "function") {
      owner.sandbox[name] = command.bind(undefined, owner);
    } else if (typeof command === "object") {
      let clone = Object.assign({}, command, {
        // We force the enumerability and the configurability (so the
        // WebConsoleActor can reconfigure the property).
        enumerable: true,
        configurable: true
      });

      if (typeof command.get === "function") {
        clone.get = command.get.bind(undefined, owner);
      }
      if (typeof command.set === "function") {
        clone.set = command.set.bind(undefined, owner);
      }

      Object.defineProperty(owner.sandbox, name, clone);
    }
  }
}

//exports.addWebConsoleCommands = addWebConsoleCommands;

/**
 * A ReflowObserver that listens for reflow events from the page.
 * Implements nsIReflowObserver.
 *
 * @constructor
 * @param object window
 *        The window for which we need to track reflow.
 * @param object owner
 *        The listener owner which needs to implement:
 *        - onReflowActivity(reflowInfo)
 */

function ConsoleReflowListener(window, listener) {
  this.docshell = window.QueryInterface(Ci.nsIInterfaceRequestor)
                         .getInterface(Ci.nsIWebNavigation)
                         .QueryInterface(Ci.nsIDocShell);
  this.listener = listener;
  this.docshell.addWeakReflowObserver(this);
}

//  exports.ConsoleReflowListener = ConsoleReflowListener;

ConsoleReflowListener.prototype =
{
//  QueryInterface: XPCOMUtils.generateQI([Ci.nsIReflowObserver,
//                                         Ci.nsISupportsWeakReference]),
  docshell: null,
  listener: null,

  /**
   * Forward reflow event to listener.
   *
   * @param DOMHighResTimeStamp start
   * @param DOMHighResTimeStamp end
   * @param boolean interruptible
   */
  sendReflow: function (start, end, interruptible) {
      let frame;// = components.stack.caller.caller;

    let filename = frame ? frame.filename : null;

    if (filename) {
      // Because filename could be of the form "xxx.js -> xxx.js -> xxx.js",
      // we only take the last part.
      filename = filename.split(" ").pop();
    }

    this.listener.onReflowActivity({
      interruptible: interruptible,
      start: start,
      end: end,
      sourceURL: filename,
      sourceLine: frame ? frame.lineNumber : null,
      functionName: frame ? frame.name : null
    });
  },

  /**
   * On uninterruptible reflow
   *
   * @param DOMHighResTimeStamp start
   * @param DOMHighResTimeStamp end
   */
  reflow: function (start, end) {
    this.sendReflow(start, end, false);
  },

  /**
   * On interruptible reflow
   *
   * @param DOMHighResTimeStamp start
   * @param DOMHighResTimeStamp end
   */
  reflowInterruptible: function (start, end) {
    this.sendReflow(start, end, true);
  },

  /**
   * Unregister listener.
   */
  destroy: function () {
    this.docshell.removeWeakReflowObserver(this);
    this.listener = this.docshell = null;
  },
};
