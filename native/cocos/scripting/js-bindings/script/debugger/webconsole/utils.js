/* -*- js-indent-level: 2; indent-tabs-mode: nil -*- */
/* vim: set ft=javascript ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// const {Cc, Ci, Cu, components} = require("chrome");
// const {isWindowIncluded} = require("devtools/toolkit/layout/utils");

// Cu.import("resource://gre/modules/XPCOMUtils.jsm");

// loader.lazyImporter(this, "Services", "resource://gre/modules/Services.jsm");

// TODO: Bug 842672 - browser/ imports modules from toolkit/.
// Note that these are only used in WebConsoleCommands, see $0 and pprint().
// loader.lazyImporter(this, "VariablesView", "resource:///modules/devtools/VariablesView.jsm");
// const DevToolsUtils = require("devtools/toolkit/DevToolsUtils");

// Match the function name from the result of toString() or toSource().
//
// Examples:
// (function foobar(a, b) { ...
// function foobar2(a) { ...
// function() { ...

var exports = exports || {};


const REGEX_MATCH_FUNCTION_NAME = /^\(?function\s+([^(\s]+)\s*\(/;

// Number of terminal entries for the self-xss prevention to go away
const CONSOLE_ENTRY_THRESHOLD = 5;

const CONSOLE_WORKER_IDS = exports.CONSOLE_WORKER_IDS = [
  "SharedWorker",
  "ServiceWorker",
  "Worker"
];

var WebConsoleUtils = {

  /**
   * Wrap a string in an nsISupportsString object.
   *
   * @param string string
   * @return nsISupportsString
   */
  supportsString: function (string) {
    let str = Cc["@mozilla.org/supports-string;1"]
              .createInstance(Ci.nsISupportsString);
    str.data = string;
    return str;
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
   * Copies certain style attributes from one element to another.
   *
   * @param nsIDOMNode from
   *        The target node.
   * @param nsIDOMNode to
   *        The destination node.
   */
  copyTextStyles: function (from, to) {
    let win = from.ownerDocument.defaultView;
    let style = win.getComputedStyle(from);
    to.style.fontFamily = style.getPropertyCSSValue("font-family").cssText;
    to.style.fontSize = style.getPropertyCSSValue("font-size").cssText;
    to.style.fontWeight = style.getPropertyCSSValue("font-weight").cssText;
    to.style.fontStyle = style.getPropertyCSSValue("font-style").cssText;
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

  /**
   * Determine if the given request mixes HTTP with HTTPS content.
   *
   * @param string request
   *        Location of the requested content.
   * @param string location
   *        Location of the current page.
   * @return boolean
   *         True if the content is mixed, false if not.
   */
  isMixedHTTPSRequest: function (request, location) {
    try {
      let requestURI = Services.io.newURI(request, null, null);
      let contentURI = Services.io.newURI(location, null, null);
      return (contentURI.scheme == "https" && requestURI.scheme != "https");
    } catch (ex) {
      return false;
    }
  },

  /**
   * Helper function to deduce the name of the provided function.
   *
   * @param funtion function
   *        The function whose name will be returned.
   * @return string
   *         Function name.
   */
  getFunctionName: function (func) {
    let name = null;
    if (func.name) {
      name = func.name;
    } else {
      let desc;
      try {
        desc = func.getOwnPropertyDescriptor("displayName");
      } catch (ex) {
        // Ignore.
      }
      if (desc && typeof desc.value == "string") {
        name = desc.value;
      }
    }
    if (!name) {
      try {
        let str = (func.toString() || func.toSource()) + "";
        name = (str.match(REGEX_MATCH_FUNCTION_NAME) || [])[1];
      } catch (ex) {
        // Ignore.
      }
    }
    return name;
  },

  /**
   * Get the object class name. For example, the |window| object has the Window
   * class name (based on [object Window]).
   *
   * @param object object
   *        The object you want to get the class name for.
   * @return string
   *         The object class name.
   */
  getObjectClassName: function (object) {
    if (object === null) {
      return "null";
    }
    if (object === undefined) {
      return "undefined";
    }

    let type = typeof object;
    if (type != "object") {
      // Grip class names should start with an uppercase letter.
      return type.charAt(0).toUpperCase() + type.substr(1);
    }

    let className;

    try {
      className = ((object + "").match(/^\[object (\S+)\]$/) || [])[1];
      if (!className) {
        className = ((object.constructor + "")
                     .match(/^\[object (\S+)\]$/) || [])[1];
      }
      if (!className && typeof object.constructor == "function") {
        className = this.getFunctionName(object.constructor);
      }
    } catch (ex) {
      // Ignore.
    }

    return className;
  },

  /**
   * Check if the given value is a grip with an actor.
   *
   * @param mixed grip
   *        Value you want to check if it is a grip with an actor.
   * @return boolean
   *         True if the given value is a grip with an actor.
   */
  isActorGrip: function (grip) {
    return grip && typeof (grip) == "object" && grip.actor;
  },
  /**
   * Value of devtools.selfxss.count preference
   *
   * @type number
   * @private
   */
  _usageCount: 0,
  get usageCount() {
    if (WebConsoleUtils._usageCount < CONSOLE_ENTRY_THRESHOLD) {
      WebConsoleUtils._usageCount =
        Services.prefs.getIntPref("devtools.selfxss.count");
      if (Services.prefs.getBoolPref("devtools.chrome.enabled")) {
        WebConsoleUtils.usageCount = CONSOLE_ENTRY_THRESHOLD;
      }
    }
    return WebConsoleUtils._usageCount;
  },
  set usageCount(newUC) {
    if (newUC <= CONSOLE_ENTRY_THRESHOLD) {
      WebConsoleUtils._usageCount = newUC;
      Services.prefs.setIntPref("devtools.selfxss.count", newUC);
    }
  },
  /**
   * The inputNode "paste" event handler generator. Helps prevent
   * self-xss attacks
   *
   * @param nsIDOMElement inputField
   * @param nsIDOMElement notificationBox
   * @returns A function to be added as a handler to 'paste' and
   *'drop' events on the input field
   */
  pasteHandlerGen: function (inputField, notificationBox, msg, okstring) {
    let handler = function (event) {
      if (WebConsoleUtils.usageCount >= CONSOLE_ENTRY_THRESHOLD) {
        inputField.removeEventListener("paste", handler);
        inputField.removeEventListener("drop", handler);
        return true;
      }
      if (notificationBox.getNotificationWithValue("selfxss-notification")) {
        event.preventDefault();
        event.stopPropagation();
        return false;
      }


      let notification = notificationBox.appendNotification(msg,
        "selfxss-notification", null,
        notificationBox.PRIORITY_WARNING_HIGH, null,
        function (eventType) {
          // Cleanup function if notification is dismissed
          if (eventType == "removed") {
            inputField.removeEventListener("keyup", pasteKeyUpHandler);
          }
        });

      function pasteKeyUpHandler(event2) {
        let value = inputField.value || inputField.textContent;
        if (value.includes(okstring)) {
          notificationBox.removeNotification(notification);
          inputField.removeEventListener("keyup", pasteKeyUpHandler);
          WebConsoleUtils.usageCount = CONSOLE_ENTRY_THRESHOLD;
        }
      }
      inputField.addEventListener("keyup", pasteKeyUpHandler);

      event.preventDefault();
      event.stopPropagation();
      return false;
    };
    return handler;
  },


};

exports.Utils = WebConsoleUtils;

// Localization

WebConsoleUtils.L10n = function (bundleURI) {
  this._helper = new LocalizationHelper(bundleURI);
};

WebConsoleUtils.L10n.prototype = {
  /**
   * Generates a formatted timestamp string for displaying in console messages.
   *
   * @param integer [milliseconds]
   *        Optional, allows you to specify the timestamp in milliseconds since
   *        the UNIX epoch.
   * @return string
   *         The timestamp formatted for display.
   */
  timestampString: function (milliseconds) {
    let d = new Date(milliseconds ? milliseconds : null);
    let hours = d.getHours(), minutes = d.getMinutes();
    let seconds = d.getSeconds();
    milliseconds = d.getMilliseconds();
    let parameters = [hours, minutes, seconds, milliseconds];
    return this.getFormatStr("timestampFormat", parameters);
  },

  /**
   * Retrieve a localized string.
   *
   * @param string name
   *        The string name you want from the Web Console string bundle.
   * @return string
   *         The localized string.
   */
  getStr: function (name) {
    try {
      return this._helper.getStr(name);
    } catch (ex) {
      console.error("Failed to get string: " + name);
      throw ex;
    }
  },

  /**
   * Retrieve a localized string formatted with values coming from the given
   * array.
   *
   * @param string name
   *        The string name you want from the Web Console string bundle.
   * @param array array
   *        The array of values you want in the formatted string.
   * @return string
   *         The formatted local string.
   */
  getFormatStr: function (name, array) {
    try {
      return this._helper.getFormatStr(name, ...array);
    } catch (ex) {
      console.error("Failed to format string: " + name);
      throw ex;
    }
  },
};
