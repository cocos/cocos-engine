(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// window.CC_RUNTIME = true;
window.CC_JSB = true;
// console.log("CC_JSB:" + CC_JSB);
window.CC_WECHATGAME = true;

// Simulate wechat game API:

window.wx = {
    getSystemInfoSync: function getSystemInfoSync() {
        return {
            platform: 'mac',
            language: 'CN',
            system: 1.0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
        };
    },
    onShow: function onShow() {},
    onHide: function onHide() {}
};

var oldRequestFrameCallback = null;
var requestAnimationFrameID = 0;
var requestAnimationFrameCallbacks = {};

window.requestAnimationFrame = function (cb) {
    var id = ++requestAnimationFrameID;
    requestAnimationFrameCallbacks[id] = cb;
    return id;
};

window.cancelAnimationFrame = function (id) {
    delete requestAnimationFrameCallbacks[id];
};

function tick(nowMilliSeconds) {
    fireTimeout(nowMilliSeconds);

    for (var id in requestAnimationFrameCallbacks) {
        oldRequestFrameCallback = requestAnimationFrameCallbacks[id];
        if (oldRequestFrameCallback) {
            delete requestAnimationFrameCallbacks[id];
            oldRequestFrameCallback(nowMilliSeconds);
        }
    }
}

var _timeoutIDIndex = 0;

var TimeoutInfo = function TimeoutInfo(cb, delay, isRepeat, target, args) {
    _classCallCheck(this, TimeoutInfo);

    this.cb = cb;
    this.id = ++_timeoutIDIndex;
    this.start = performance.now();
    this.delay = delay;
    this.isRepeat = isRepeat;
    this.target = target;
    this.args = args;
};

var _timeoutInfos = {};

function fireTimeout(nowMilliSeconds) {
    var info = void 0;
    for (var id in _timeoutInfos) {
        info = _timeoutInfos[id];
        if (info && info.cb) {
            if (nowMilliSeconds - info.start >= info.delay) {
                //                console.log(`fireTimeout: id ${id}, start: ${info.start}, delay: ${info.delay}, now: ${nowMilliSeconds}`);
                info.cb.apply(info.target, info.args);
                if (info.isRepeat) {
                    info.start = nowMilliSeconds;
                } else {
                    delete _timeoutInfos[id];
                }
            }
        }
    }
}

function createTimeoutInfo(prevFuncArgs, isRepeat) {
    var cb = prevFuncArgs[0];
    if (!cb) {
        console.error("createTimeoutInfo doesn't pass a callback ...");
        return 0;
    }

    var delay = prevFuncArgs.length > 1 ? prevFuncArgs[1] : 0;
    var args = void 0;

    if (prevFuncArgs.length > 2) {
        args = Array.prototype.slice.call(prevFuncArgs, 2);
    }

    var info = new TimeoutInfo(cb, delay, isRepeat, this, args);
    _timeoutInfos[info.id] = info;
    return info.id;
}

window.setTimeout = function (cb) {
    return createTimeoutInfo(arguments, false);
};

window.clearTimeout = function (id) {
    delete _timeoutInfos[id];
};

window.setInterval = function (cb) {
    return createTimeoutInfo(arguments, true);
};

window.clearInterval = window.clearTimeout;

window.alert = console.error.bind(console);

// File utils (Temporary, won't be accessible)
cc.fileUtils = cc.FileUtils.getInstance();
cc.fileUtils.setPopupNotify(false);

/**
 * @type {Object}
 * @name jsb.fileUtils
 * jsb.fileUtils is the native file utils singleton object,
 * please refer to Cocos2d-x API to know how to use it.
 * Only available in JSB
 */
jsb.fileUtils = cc.fileUtils;
delete cc.FileUtils;
delete cc.fileUtils;

window.CanvasRenderingContext2D = cc.CanvasRenderingContext2D;
delete cc.CanvasRenderingContext2D;

jsb.urlRegExp = new RegExp("^(?:https?|ftp)://\\S*$", "i");

require('./jsb_prepare');
require('./jsb_opengl');
window.DOMParser = require('./xmldom/dom-parser').DOMParser;
require('./jsb-adapter');
require('./jsb_audioengine');

/**
 * @type {Object}
 * @name jsb.reflection
 * jsb.reflection is a bridge to let you invoke Java static functions.
 * please refer to this document to know how to use it: http://www.cocos2d-x.org/docs/manual/framework/html5/v3/reflection/en
 * Only available on Android platform
 */
jsb.reflection = {
    callStaticMethod: function callStaticMethod() {
        cc.log("not supported on current platform");
    }
};

XMLHttpRequest.prototype.addEventListener = function (eventName, listener, options) {
    this['on' + eventName] = listener;
};

XMLHttpRequest.prototype.removeEventListener = function (eventName, listener, options) {
    this['on' + eventName] = null;
};

//NOTE: Runtime API should not private Javascript bridge functionality for security issues.
// JS to Native bridges
// if(window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID){
//     jsb.reflection = new JavascriptJavaBridge();
//     cc.sys.capabilities["keyboard"] = true;
// }
// else if(window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)){
//     jsb.reflection = new JavaScriptObjCBridge();
// }

// SocketIO
if (window.SocketIO) {
    window.io = window.SocketIO;
    SocketIO.prototype._jsbEmit = SocketIO.prototype.emit;
    SocketIO.prototype.emit = function (uri, delegate) {
        if ((typeof delegate === 'undefined' ? 'undefined' : _typeof(delegate)) === 'object') {
            delegate = JSON.stringify(delegate);
        }
        this._jsbEmit(uri, delegate);
    };
}

window.gameTick = tick;

},{"./jsb-adapter":20,"./jsb_audioengine":25,"./jsb_opengl":26,"./jsb_prepare":28,"./xmldom/dom-parser":29}],2:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLAudioElement = require('./HTMLAudioElement');

var HAVE_NOTHING = 0;
var HAVE_METADATA = 1;
var HAVE_CURRENT_DATA = 2;
var HAVE_FUTURE_DATA = 3;
var HAVE_ENOUGH_DATA = 4;

var _innerAudioContext = new WeakMap();
var _src = new WeakMap();
var _loop = new WeakMap();
var _autoplay = new WeakMap();

var Audio = function (_HTMLAudioElement) {
  _inherits(Audio, _HTMLAudioElement);

  function Audio() {
    _classCallCheck(this, Audio);

    return _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).apply(this, arguments));
  }

  return Audio;
}(HTMLAudioElement);

module.exports = Audio;

},{"./HTMLAudioElement":9}],3:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Node = require('./Node');

var Element = function (_Node) {
  _inherits(Element, _Node);

  function Element() {
    _classCallCheck(this, Element);

    var _this = _possibleConstructorReturn(this, (Element.__proto__ || Object.getPrototypeOf(Element)).call(this));

    _this.className = '';
    _this.children = [];
    return _this;
  }

  return Element;
}(Node);

module.exports = Element;

},{"./Node":16}],4:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @see https://dom.spec.whatwg.org/#interface-event
 * @private
 */
/**
 * The event wrapper.
 * @constructor
 * @param {EventTarget} eventTarget The event target of this dispatching.
 * @param {Event|{type:string}} event The original event to wrap.
 */
var Event = function () {
  function Event(type, eventInit) {
    _classCallCheck(this, Event);

    this._type = type;
    this._eventTarget = null;
    this._eventPhase = 2;
    this._currentTarget = null;
    this._canceled = false;
    this._stopped = false; // The flag to stop propagation immediately.
    this._passiveListener = null;
    this._timeStamp = Date.now();
  }

  /**
   * The type of this event.
   * @type {string}
   */


  _createClass(Event, [{
    key: "composedPath",


    /**
     * @returns {EventTarget[]} The composed path of this event.
     */
    value: function composedPath() {
      var currentTarget = this._currentTarget;
      if (currentTarget === null) {
        return [];
      }
      return [currentTarget];
    }

    /**
     * The target of this event.
     * @type {number}
     */

  }, {
    key: "stopPropagation",


    /**
     * Stop event bubbling.
     * @returns {void}
     */
    value: function stopPropagation() {}

    /**
     * Stop event bubbling.
     * @returns {void}
     */

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this._stopped = true;
    }

    /**
     * The flag to be bubbling.
     * @type {boolean}
     */

  }, {
    key: "preventDefault",


    /**
     * Cancel this event.
     * @returns {void}
     */
    value: function preventDefault() {
      if (this._passiveListener !== null) {
        console.warn("Event#preventDefault() was called from a passive listener:", this._passiveListener);
        return;
      }
      if (!this.cancelable) {
        return;
      }

      this._canceled = true;
    }

    /**
     * The flag to indicate cancellation state.
     * @type {boolean}
     */

  }, {
    key: "type",
    get: function get() {
      return this._type;
    }

    /**
     * The target of this event.
     * @type {EventTarget}
     */

  }, {
    key: "target",
    get: function get() {
      return this._eventTarget;
    }

    /**
     * The target of this event.
     * @type {EventTarget}
     */

  }, {
    key: "currentTarget",
    get: function get() {
      return this._currentTarget;
    }
  }, {
    key: "isTrusted",
    get: function get() {
      // https://heycam.github.io/webidl/#Unforgeable
      return false;
    }
  }, {
    key: "timeStamp",


    /**
     * The unix time of this event.
     * @type {number}
     */
    get: function get() {
      return this._timeStamp;
    }
  }, {
    key: "eventPhase",
    get: function get() {
      return this._eventPhase;
    }
  }, {
    key: "bubbles",
    get: function get() {
      return false;
    }

    /**
     * The flag to be cancelable.
     * @type {boolean}
     */

  }, {
    key: "cancelable",
    get: function get() {
      return true;
    }
  }, {
    key: "defaultPrevented",
    get: function get() {
      return this._canceled;
    }

    /**
     * The flag to be composed.
     * @type {boolean}
     */

  }, {
    key: "composed",
    get: function get() {
      return false;
    }
  }]);

  return Event;
}();

/**
 * Constant of NONE.
 * @type {number}
 */


Event.NONE = 0;

/**
 * Constant of CAPTURING_PHASE.
 * @type {number}
 */
Event.CAPTURING_PHASE = 1;

/**
 * Constant of AT_TARGET.
 * @type {number}
 */
Event.AT_TARGET = 2;

/**
 * Constant of BUBBLING_PHASE.
 * @type {number}
 */
Event.BUBBLING_PHASE = 3;

module.exports = Event;

},{}],5:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Listener types
var CAPTURE = 1;
var BUBBLE = 2;
var ATTRIBUTE = 3;

/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */
function isObject(x) {
    return x && (typeof x === "undefined" ? "undefined" : _typeof(x)) === "object"; //eslint-disable-line no-restricted-syntax
}

/**
 * EventTarget.
 * 
 * - This is constructor if no arguments.
 * - This is a function which returns a CustomEventTarget constructor if there are arguments.
 * 
 * For example:
 * 
 *     class A extends EventTarget {}
 */
function EventTarget() {
    this._listeners = new Map();
}

// Should be enumerable, but class methods are not enumerable.
EventTarget.prototype = {
    /**
     * Add a given listener to this event target.
     * @param {string} eventName The event name to add.
     * @param {Function} listener The listener to add.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was added actually.
     */
    addEventListener: function addEventListener(eventName, listener, options) {
        if (!listener) {
            return false;
        }
        if (typeof listener !== "function" && !isObject(listener)) {
            throw new TypeError("'listener' should be a function or an object.");
        }

        var listeners = this._listeners;
        var optionsIsObj = isObject(options);
        var capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
        var listenerType = capture ? CAPTURE : BUBBLE;
        var newNode = {
            listener: listener,
            listenerType: listenerType,
            passive: optionsIsObj && Boolean(options.passive),
            once: optionsIsObj && Boolean(options.once),
            next: null

            // Set it as the first node if the first node is null.
        };var node = listeners.get(eventName);
        if (node === undefined) {
            listeners.set(eventName, newNode);
            return true;
        }

        // Traverse to the tail while checking duplication..
        var prev = null;
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                // Should ignore duplication.
                return false;
            }
            prev = node;
            node = node.next;
        }

        // Add it.
        prev.next = newNode;
        return true;
    },


    /**
     * Remove a given listener from this event target.
     * @param {string} eventName The event name to remove.
     * @param {Function} listener The listener to remove.
     * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
     * @returns {boolean} `true` if the listener was removed actually.
     */
    removeEventListener: function removeEventListener(eventName, listener, options) {
        if (!listener) {
            return false;
        }

        var listeners = this._listeners;
        var capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
        var listenerType = capture ? CAPTURE : BUBBLE;

        var prev = null;
        var node = listeners.get(eventName);
        while (node) {
            if (node.listener === listener && node.listenerType === listenerType) {
                if (prev) {
                    prev.next = node.next;
                } else if (node.next) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
                return true;
            }

            prev = node;
            node = node.next;
        }

        return false;
    },


    /**
     * Dispatch a given event.
     * @param {Event|{type:string}} event The event to dispatch.
     * @returns {boolean} `false` if canceled.
     */
    dispatchEvent: function dispatchEvent(event) {
        if (!event || typeof event.type !== "string") {
            throw new TypeError("\"event.type\" should be a string.");
        }

        // If listeners aren't registered, terminate.
        var listeners = this._listeners;
        var eventName = event.type;
        var node = listeners.get(eventName);
        if (!node) {
            return true;
        }

        event._target = event._currentTarget = this;
        // This doesn't process capturing phase and bubbling phase.
        // This isn't participating in a tree.
        var prev = null;
        while (node) {
            // Remove this listener if it's once
            if (node.once) {
                if (prev) {
                    prev.next = node.next;
                } else if (node.next) {
                    listeners.set(eventName, node.next);
                } else {
                    listeners.delete(eventName);
                }
            } else {
                prev = node;
            }

            // Call this listener
            event._passiveListener = node.passive ? node.listener : null;
            if (typeof node.listener === "function") {
                node.listener.call(this, event);
            } else if (node.listenerType !== ATTRIBUTE && typeof node.listener.handleEvent === "function") {
                node.listener.handleEvent(event);
            }

            // Break if `event.stopImmediatePropagation` was called.
            if (event._stopped) {
                break;
            }

            node = node.next;
        }
        event._target = event._currentTarget = null;
        event._eventPhase = 0;
        event._passiveListener = null;

        return !event.defaultPrevented;
    }
};

// `constructor` is not enumerable.
Object.defineProperty(EventTarget.prototype, "constructor", { value: EventTarget, configurable: true, writable: true });

// Ensure `eventTarget instanceof window.EventTarget` is `true`.
if (typeof window !== "undefined" && typeof window.EventTarget !== "undefined") {
    Object.setPrototypeOf(EventTarget.prototype, window.EventTarget.prototype);
}

// export { defineEventAttribute, EventTarget }
// export default EventTarget
module.exports = EventTarget;

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * TODO 使用 wx.readFile 来封装 FileReader
 */
var FileReader = function () {
  function FileReader() {
    _classCallCheck(this, FileReader);
  }

  _createClass(FileReader, [{
    key: "construct",
    value: function construct() {}
  }]);

  return FileReader;
}();

module.exports = FileReader;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FontFace = function () {
    function FontFace(family, source, descriptors) {
        var _this = this;

        _classCallCheck(this, FontFace);

        this.family = family;
        this.source = source;
        this.descriptors = descriptors;

        this._status = 'unloaded';

        this._loaded = new Promise(function (resolve, reject) {
            _this._resolveCB = resolve;
            _this._rejectCB = reject;
        });
    }

    // Promise load() {
    //     jsb.loadFont(this.source);
    // }

    _createClass(FontFace, [{
        key: 'status',
        get: function get() {
            return this._status;
        }
    }, {
        key: 'loaded',
        get: function get() {
            return this._loaded;
        }
    }]);

    return FontFace;
}();

module.exports = FontFace;

},{}],8:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventTarget = require('./EventTarget');
var Event = require('./Event');

var FontFaceSet = function (_EventTarget) {
    _inherits(FontFaceSet, _EventTarget);

    function FontFaceSet() {
        _classCallCheck(this, FontFaceSet);

        var _this = _possibleConstructorReturn(this, (FontFaceSet.__proto__ || Object.getPrototypeOf(FontFaceSet)).call(this));

        _this._status = 'loading';
        return _this;
    }

    _createClass(FontFaceSet, [{
        key: 'add',
        value: function add(fontFace) {
            var _this2 = this;

            this._status = fontFace._status = 'loading';
            this.dispatchEvent(new Event('loading'));
            // Call native binding method to set the ttf font to native platform.
            var family = jsb.loadFont(fontFace.family, fontFace.source);
            setTimeout(function () {
                if (family) {
                    fontFace._status = _this2._status = 'loaded';
                    fontFace._resolveCB();
                    _this2.dispatchEvent(new Event('loadingdone'));
                } else {
                    fontFace._status = _this2._status = 'error';
                    fontFace._rejectCB();
                    _this2.dispatchEvent(new Event('loadingerror'));
                }
            }, 0);
        }
    }, {
        key: 'clear',
        value: function clear() {}
    }, {
        key: 'delete',
        value: function _delete() {}
    }, {
        key: 'load',
        value: function load() {}
    }, {
        key: 'ready',
        value: function ready() {}
    }, {
        key: 'status',
        get: function get() {
            return this._status;
        }
    }, {
        key: 'onloading',
        set: function set(listener) {
            this.addEventListener('loading', listener);
        }
    }, {
        key: 'onloadingdone',
        set: function set(listener) {
            this.addEventListener('loadingdone', listener);
        }
    }, {
        key: 'onloadingerror',
        set: function set(listener) {
            this.addEventListener('loadingerror', listener);
        }
    }]);

    return FontFaceSet;
}(EventTarget);

module.exports = FontFaceSet;

},{"./Event":4,"./EventTarget":5}],9:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLMediaElement = require('./HTMLMediaElement');

var HTMLAudioElement = function (_HTMLMediaElement) {
  _inherits(HTMLAudioElement, _HTMLMediaElement);

  function HTMLAudioElement() {
    _classCallCheck(this, HTMLAudioElement);

    return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, 'audio'));
  }

  return HTMLAudioElement;
}(HTMLMediaElement);

module.exports = HTMLAudioElement;

},{"./HTMLMediaElement":13}],10:[function(require,module,exports){
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HTMLElement = require('./HTMLElement');
var ImageData = require('./ImageData');

var CanvasGradient = function () {
    function CanvasGradient() {
        _classCallCheck(this, CanvasGradient);

        console.log("==> CanvasGradient constructor");
    }

    _createClass(CanvasGradient, [{
        key: 'addColorStop',
        value: function addColorStop(offset, color) {
            console.log("==> CanvasGradient addColorStop");
        }
    }]);

    return CanvasGradient;
}();

var TextMetrics = function () {
    function TextMetrics(width) {
        _classCallCheck(this, TextMetrics);

        this._width = width;
    }

    _createClass(TextMetrics, [{
        key: 'width',
        get: function get() {
            return this._width;
        }
    }]);

    return TextMetrics;
}();

// class CanvasRenderingContext2D {
//     constructor() {
//         console.log("==> CanvasRenderingContext2D constructor");

//         // Line styles
//         this.lineWidth = 1;
//         this.lineCap = 'butt';
//         this.lineJoin = 'miter';
//         this.miterLimit = 10;
//         this.lineDashOffset = 0;

//         // Text styles
//         this.font = '10px sans-serif';
//         this.textAlign = 'start';
//         this.textBaseline = 'alphabetic';

//         // Fill and stroke styles
//         this.fillStyle = '#000';
//         this.strokeStyle = '#000';

//         // Shadows
//         this.shadowBlur = 0;
//         this.shadowColor = 'black';
//         this.shadowOffsetX = 0;
//         this.shadowOffsetY = 0;

//         // Compositing
//         this.globalAlpha = 1;
//         this.globalCompositeOperation = 'source-over';

//     }

//     clearRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D clearRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     fillRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D fillRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     strokeRect(x, y, width, height) {
//         console.log(`==> CanvasRenderingContext2D strokeRect: [${x}, ${y}, ${width}, ${height}]`);
//     }

//     getLineDash() {
//         return [];
//     }

//     setLineDash(segments) {

//     }

//     drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
//         console.log("==> CanvasRenderingContext2D drawImage");
//     }

//     getImageData(sx, sy, sw, sh) {
//         console.log(`==> CanvasRenderingContext2D getImageData(${sx}, ${sy}, ${sw}, ${sh})`);
//         let data = new Uint8ClampedArray(sw * sh * 4);
//         for (let i = 0; i < data.length; ++i) {
//             data[i] = Math.floor(Math.random() * 255);
//         }
//         return {
//             width: sw,
//             height: sh,
//             data: data
//         };
//     }

//     fillText(text, x, y, maxWidth) {
//         console.log("==> CanvasRenderingContext2D fillText: " + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//     }

//     strokeText(text, x, y, maxWidth) {
//         console.log("==> CanvasRenderingContext2D strokeText" + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//     }

//     measureText(text) {
//         console.log("==> CanvasRenderingContext2D measureText: " + text 
//             + ', font: ' + this.font + ', textAlign: ' + this.textAlign
//             + ', textBaseline: ' + this.textBaseline);
//         if (text === '') {
//             new Error("measureText empty");
//         }
//         return new TextMetrics(100);
//     }

//     // Gradients and patterns
//     createLinearGradient(x0, y0, x1, y1) {
//         console.log("==> CanvasRenderingContext2D createLinearGradient");
//         return new CanvasGradient();
//     }

//     createRadialGradient(x0, y0, r0, x1, y1, r1) {
//         return null;
//     }

//     createPattern(image, repetition) {
//         return null;
//     }

//     save() {
//         console.log("==> CanvasRenderingContext2D save");
//     }

//     // Paths
//     beginPath() {
//         console.log("==> CanvasRenderingContext2D beginPath");
//     }

//     closePath() {

//     }

//     moveTo() {
//         console.log("==> CanvasRenderingContext2D moveTo");
//     }

//     lineTo() {
//         console.log("==> CanvasRenderingContext2D lineTo");
//     }

//     bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {

//     }

//     quadraticCurveTo(cpx, cpy, x, y) {

//     }

//     arc(x, y, radius, startAngle, endAngle, anticlockwise) {

//     }

//     rect(x, y, width, height) {

//     }

//     // Drawing paths
//     stroke() {
//         console.log("==> CanvasRenderingContext2D stroke");
//     }

//     /*
//     void ctx.fill([fillRule]);
//     void ctx.fill(path[, fillRule]);
//     */
//     fill() {

//     }

//     restore() {

//     }
// }

var __listenTouchEventCanvasMap = {};

var HTMLCanvasElement = function (_HTMLElement) {
    _inherits(HTMLCanvasElement, _HTMLElement);

    function HTMLCanvasElement(width, height) {
        _classCallCheck(this, HTMLCanvasElement);

        var _this = _possibleConstructorReturn(this, (HTMLCanvasElement.__proto__ || Object.getPrototypeOf(HTMLCanvasElement)).call(this, 'canvas'));

        _this.id = 'glcanvas';
        _this.type = 'canvas';

        _this.top = 0;
        _this.left = 0;
        _this._width = width ? width : window.innerWidth;
        _this._height = height ? height : window.innerHeight;
        _this._context2D = null;
        _this._data = null;
        return _this;
    }

    //TODO: implement opts.


    _createClass(HTMLCanvasElement, [{
        key: 'getContext',
        value: function getContext(name, opts) {
            var self = this;
            console.log('==> Canvas getContext(' + name + ')');
            if (name === 'webgl' || name === 'experimental-webgl') {
                return window.gl;
            } else if (name === '2d') {
                if (!this._context2D) {
                    this._context2D = new CanvasRenderingContext2D(this._width, this._height);
                    this._context2D._canvas = this;
                    this._context2D.setCanvasBufferUpdatedCallback(function (data) {
                        console.log('setCanvasBufferUpdatedCallback: dataLen: ' + data.length);
                        self._data = new ImageData(data, self._width, self._height);
                    });
                }
                return this._context2D;
            }

            return null;
        }
    }, {
        key: 'toDataURL',
        value: function toDataURL() {
            console.log("==> Canvas toDataURL");
            return "";
        }
    }, {
        key: 'addEventListener',
        value: function addEventListener(eventName, listener, options) {
            var ret = _get(HTMLCanvasElement.prototype.__proto__ || Object.getPrototypeOf(HTMLCanvasElement.prototype), 'addEventListener', this).call(this, eventName, listener, options);
            if (ret) {
                if (eventName === 'touchstart') {
                    __listenTouchEventCanvasMap[this._index] = this;
                }
            }

            return ret;
        }
    }, {
        key: 'removeEventListener',
        value: function removeEventListener(eventName, listener, options) {
            var ret = _get(HTMLCanvasElement.prototype.__proto__ || Object.getPrototypeOf(HTMLCanvasElement.prototype), 'removeEventListener', this).call(this, eventName, listener, options);
            if (ret) {
                if (eventName === 'touchstart') {
                    delete __listenTouchEventCanvasMap[this._index];
                }
            }

            return ret;
        }
    }, {
        key: 'width',
        set: function set(width) {
            console.log('==> HTMLCanvasElement.width = ' + width);
            if (this._width !== width) {
                this._width = width;
                if (this._context2D) {
                    this._context2D._width = width;
                }
            }
        },
        get: function get() {
            return this._width;
        }
    }, {
        key: 'height',
        set: function set(height) {
            console.log('==> HTMLCanvasElement.height = ' + height);
            if (this._height !== height) {
                this._height = height;
                if (this._context2D) {
                    this._context2D._height = height;
                }
            }
        },
        get: function get() {
            return this._height;
        }
    }]);

    return HTMLCanvasElement;
}(HTMLElement);

var ctx2DProto = CanvasRenderingContext2D.prototype;
ctx2DProto.createImageData = function (width, height) {
    return new ImageData(width, height);
};

ctx2DProto.putImageData = function (imagedata, dx, dy) {
    this._canvas._data = imagedata; //TODO: consider dx, dy?
};

ctx2DProto.getImageData = function (sx, sy, sw, sh) {
    //TODO:cjh
    return this._canvas._data;
};

ctx2DProto.drawImage = function (image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
    //TODO:cjh
};

function touchEventHandlerFactory(type) {
    return function (touches) {
        var touchEvent = new TouchEvent(type);

        touchEvent.touches = touches;
        // touchEvent.targetTouches = Array.prototype.slice.call(event.touches)
        touchEvent.changedTouches = touches; //event.changedTouches
        // touchEvent.timeStamp = event.timeStamp

        for (var key in __listenTouchEventCanvasMap) {
            __listenTouchEventCanvasMap[key].dispatchEvent(touchEvent);
        }
    };
}

jsb.onTouchStart = touchEventHandlerFactory('touchstart');
jsb.onTouchMove = touchEventHandlerFactory('touchmove');
jsb.onTouchEnd = touchEventHandlerFactory('touchend');
jsb.onTouchCancel = touchEventHandlerFactory('touchcancel');

module.exports = HTMLCanvasElement;

},{"./HTMLElement":11,"./ImageData":15}],11:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Element = require('./Element');

var _require = require('./util'),
    noop = _require.noop;

var _require2 = require('./WindowProperties'),
    innerWidth = _require2.innerWidth,
    innerHeight = _require2.innerHeight;

var HTMLElement = function (_Element) {
  _inherits(HTMLElement, _Element);

  function HTMLElement() {
    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, HTMLElement);

    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

    _this.tagName = tagName.toUpperCase();

    _this.className = '';
    _this.children = [];
    _this.style = {
      width: innerWidth + 'px',
      height: innerHeight + 'px'
    };

    _this.insertBefore = noop;

    _this.innerHTML = '';
    _this.parentElement = window.canvas;
    return _this;
  }

  _createClass(HTMLElement, [{
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      this[name] = value;
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(name) {
      return this[name];
    }
  }, {
    key: 'getBoundingClientRect',
    value: function getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: innerWidth,
        height: innerHeight
      };
    }
  }, {
    key: 'focus',
    value: function focus() {}
  }, {
    key: 'clientWidth',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10) * this.innerHTML.length;

      return Number.isNaN(ret) ? 0 : ret;
    }
  }, {
    key: 'clientHeight',
    get: function get() {
      var ret = parseInt(this.style.fontSize, 10);

      return Number.isNaN(ret) ? 0 : ret;
    }
  }]);

  return HTMLElement;
}(Element);

module.exports = HTMLElement;

},{"./Element":3,"./WindowProperties":18,"./util":23}],12:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = require('./HTMLElement');
var Event = require('./Event');

var HTMLImageElement = function (_HTMLElement) {
    _inherits(HTMLImageElement, _HTMLElement);

    function HTMLImageElement(width, height) {
        _classCallCheck(this, HTMLImageElement);

        var _this = _possibleConstructorReturn(this, (HTMLImageElement.__proto__ || Object.getPrototypeOf(HTMLImageElement)).call(this, 'img'));

        _this.width = width;
        _this.height = height;
        _this._data = null;
        _this.onload = null;
        _this._src = null;
        _this.complete = false;
        _this._glFormat = _this._glInternalFormat = gl.RGBA;
        _this.crossOrigin = null;
        return _this;
    }

    _createClass(HTMLImageElement, [{
        key: 'src',
        set: function set(src) {
            var _this2 = this;

            this._src = src;
            jsb.loadImage(src, function (info) {
                _this2.width = _this2.naturalWidth = info.width;
                _this2.height = _this2.naturalHeight = info.height;
                _this2._data = info.data;
                // console.log(`glFormat: ${info.glFormat}, glInternalFormat: ${info.glInternalFormat}, glType: ${info.glType}`);
                _this2._glFormat = info.glFormat;
                _this2._glInternalFormat = info.glInternalFormat;
                _this2._glType = info.glType;
                _this2._numberOfMipmaps = info.numberOfMipmaps;
                _this2._compressed = info.compressed;
                _this2._bpp = info.bpp;

                _this2._alignment = 1;
                // Set the row align only when mipmapsNum == 1 and the data is uncompressed
                if (_this2._numberOfMipmaps == 1 && !_this2._compressed) {
                    var bytesPerRow = _this2.width * _this2._bpp / 8;
                    if (bytesPerRow % 8 == 0) _alignment = 8;else if (bytesPerRow % 4 == 0) _alignment = 4;else if (bytesPerRow % 2 == 0) _alignment = 2;
                }

                _this2.complete = true;

                _this2.dispatchEvent(new Event('load'));

                if (_this2.onload) {
                    _this2.onload();
                }
            });
        },
        get: function get() {
            return this._src;
        }
    }]);

    return HTMLImageElement;
}(HTMLElement);

module.exports = HTMLImageElement;

},{"./Event":4,"./HTMLElement":11}],13:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = require('./HTMLElement');

var HTMLMediaElement = function (_HTMLElement) {
  _inherits(HTMLMediaElement, _HTMLElement);

  function HTMLMediaElement(type) {
    _classCallCheck(this, HTMLMediaElement);

    return _possibleConstructorReturn(this, (HTMLMediaElement.__proto__ || Object.getPrototypeOf(HTMLMediaElement)).call(this, type));
  }

  _createClass(HTMLMediaElement, [{
    key: 'addTextTrack',
    value: function addTextTrack() {}
  }, {
    key: 'captureStream',
    value: function captureStream() {}
  }, {
    key: 'fastSeek',
    value: function fastSeek() {}
  }, {
    key: 'load',
    value: function load() {}
  }, {
    key: 'pause',
    value: function pause() {}
  }, {
    key: 'play',
    value: function play() {}
  }]);

  return HTMLMediaElement;
}(HTMLElement);

module.exports = HTMLMediaElement;

},{"./HTMLElement":11}],14:[function(require,module,exports){
'use strict';

var HTMLImageElement = require('./HTMLImageElement');

function Image(width, height) {
    return new HTMLImageElement(width, height);
}

module.exports = Image;

},{"./HTMLImageElement":12}],15:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ImageData = function () {

    // var imageData = new ImageData(array, width, height);
    // var imageData = new ImageData(width, height);
    function ImageData(array, width, height) {
        _classCallCheck(this, ImageData);

        if (typeof array === 'number' && typeof width == 'number') {
            height = width;
            width = array;
            array = null;
        }
        if (array === null) {
            this._data = new Uint8ClampedArray(width * height * 4);
        } else {
            this._data = array;
        }
        this._width = width;
        this._height = height;
    }

    _createClass(ImageData, [{
        key: 'data',
        get: function get() {
            return this._data;
        }
    }, {
        key: 'width',
        get: function get() {
            return this._width;
        }
    }, {
        key: 'height',
        get: function get() {
            return this._height;
        }
    }]);

    return ImageData;
}();

module.exports = ImageData;

},{}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventTarget = require('./EventTarget');

var Node = function (_EventTarget) {
  _inherits(Node, _EventTarget);

  function Node() {
    _classCallCheck(this, Node);

    var _this = _possibleConstructorReturn(this, (Node.__proto__ || Object.getPrototypeOf(Node)).call(this));

    _this.childNodes = [];
    return _this;
  }

  _createClass(Node, [{
    key: 'appendChild',
    value: function appendChild(node) {
      if (node instanceof Node) {
        this.childNodes.push(node);
      } else {
        throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.');
      }
    }
  }, {
    key: 'cloneNode',
    value: function cloneNode() {
      var copyNode = Object.create(this);

      Object.assign(copyNode, this);
      return copyNode;
    }
  }, {
    key: 'removeChild',
    value: function removeChild(node) {
      var index = this.childNodes.findIndex(function (child) {
        return child === node;
      });

      if (index > -1) {
        return this.childNodes.splice(index, 1);
      }
      return null;
    }
  }]);

  return Node;
}(EventTarget);

module.exports = Node;

},{"./EventTarget":5}],17:[function(require,module,exports){
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Event = require('./Event');

var TouchEvent = function (_Event) {
  _inherits(TouchEvent, _Event);

  function TouchEvent(type, touchEventInit) {
    _classCallCheck(this, TouchEvent);

    var _this = _possibleConstructorReturn(this, (TouchEvent.__proto__ || Object.getPrototypeOf(TouchEvent)).call(this, type));

    _this.touches = [];
    _this.targetTouches = [];
    _this.changedTouches = [];
    return _this;
  }

  return TouchEvent;
}(Event);

module.exports = TouchEvent;

},{"./Event":4}],18:[function(require,module,exports){
"use strict";

var _screenWidth$screenHe = { screenWidth: window.innerWidth, screenHeight: window.innerHeight, devicePixelRatio: 1 },
    screenWidth = _screenWidth$screenHe.screenWidth,
    screenHeight = _screenWidth$screenHe.screenHeight,
    devicePixelRatio = _screenWidth$screenHe.devicePixelRatio; //cjh wx.getSystemInfoSync()

var innerWidth = screenWidth;
var innerHeight = screenHeight;
var screen = {
    availWidth: innerWidth,
    availHeight: innerHeight
};
var performance = null; //cjh wx.getPerformance()
var ontouchstart = null;
var ontouchmove = null;
var ontouchend = null;

module.exports = {
    innerWidth: innerWidth,
    innerHeight: innerHeight,
    devicePixelRatio: devicePixelRatio,
    screen: screen,
    performance: performance,
    ontouchstart: ontouchstart,
    ontouchmove: ontouchmove,
    ontouchend: ontouchend
};

},{}],19:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HTMLElement = require('./HTMLElement');
var Image = require('./Image');
var Audio = require('./Audio');
var HTMLCanvasElement = require('./HTMLCanvasElement');
var Node = require('./Node');
var FontFaceSet = require('./FontFaceSet');

var Document = function (_Node) {
  _inherits(Document, _Node);

  function Document() {
    _classCallCheck(this, Document);

    var _this = _possibleConstructorReturn(this, (Document.__proto__ || Object.getPrototypeOf(Document)).call(this));

    _this.readyState = 'complete';
    _this.visibilityState = 'visible';
    _this.documentElement = window;
    _this.hidden = false;
    _this.style = {};
    _this.location = window.location;

    _this.head = new HTMLElement('head');
    _this.body = new HTMLElement('body');

    _this.fonts = new FontFaceSet();
    return _this;
  }

  _createClass(Document, [{
    key: 'createElement',
    value: function createElement(tagName) {
      if (tagName === 'canvas') {
        return new HTMLCanvasElement();
      } else if (tagName === 'audio') {
        return new Audio();
      } else if (tagName === 'img') {
        return new Image();
      } else if (tagName === 'video') {
        return {
          canPlayType: function canPlayType() {
            return false;
          }
        };
      }

      return new HTMLElement(tagName);
    }
  }, {
    key: 'getElementById',
    value: function getElementById(id) {
      if (id === window.canvas.id) {
        return window.canvas;
      }
      return null;
    }
  }, {
    key: 'getElementsByTagName',
    value: function getElementsByTagName(tagName) {
      if (tagName === 'head') {
        return [document.head];
      } else if (tagName === 'body') {
        return [document.body];
      } else if (tagName === 'canvas') {
        return [window.canvas];
      }
      return [];
    }
  }, {
    key: 'getElementsByName',
    value: function getElementsByName(tagName) {
      if (tagName === 'head') {
        return [document.head];
      } else if (tagName === 'body') {
        return [document.body];
      } else if (tagName === 'canvas') {
        return [window.canvas];
      }
      return [];
    }
  }, {
    key: 'querySelector',
    value: function querySelector(query) {
      if (query === 'head') {
        return document.head;
      } else if (query === 'body') {
        return document.body;
      } else if (query === 'canvas' || query === 'GameCanvas') {
        return window.canvas;
      } else if (query === '#' + window.canvas.id) {
        return window.canvas;
      }
      return null;
    }
  }, {
    key: 'querySelectorAll',
    value: function querySelectorAll(query) {
      if (query === 'head') {
        return [document.head];
      } else if (query === 'body') {
        return [document.body];
      } else if (query === 'canvas') {
        return [window.canvas];
      }
      return [];
    }
  }, {
    key: 'createTextNode',
    value: function createTextNode() {
      return new HTMLElement('text');
    }
  }]);

  return Document;
}(Node);

var document = new Document();

module.exports = document;

},{"./Audio":2,"./FontFaceSet":8,"./HTMLCanvasElement":10,"./HTMLElement":11,"./Image":14,"./Node":16}],20:[function(require,module,exports){
'use strict';

require('./window');

},{"./window":24}],21:[function(require,module,exports){
'use strict';

var location = {
  href: 'game.js',
  reload: function reload() {}
};

module.exports = location;

},{}],22:[function(require,module,exports){
'use strict';

var _require = require('./util'),
    noop = _require.noop;

// TODO 需要 wx.getSystemInfo 获取更详细信息
// cjh const { platform } = wx.getSystemInfoSync()


var navigator = {
  platform: 'wx', //cjh added wx
  language: 'zh-cn',
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 MiniGame NetType/WIFI Language/zh_CN',
  onLine: true, // TODO 用 wx.getNetworkStateChange 和 wx.onNetworkStateChange 来返回真实的状态

  // TODO 用 wx.getLocation 来封装 geolocation
  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  }
};

module.exports = navigator;

},{"./util":23}],23:[function(require,module,exports){
"use strict";

function noop() {}

module.exports = noop;

},{}],24:[function(require,module,exports){
'use strict';

function inject() {
    window.top = window.parent = window;

    window.document = require('./document');
    window.HTMLElement = require('./HTMLElement');
    window.HTMLCanvasElement = require('./HTMLCanvasElement');
    window.HTMLImageElement = require('./HTMLImageElement');
    window.HTMLMediaElement = require('./HTMLMediaElement');
    window.HTMLAudioElement = require('./HTMLAudioElement');
    window.canvas = new HTMLCanvasElement();
    window.gl.canvas = window.canvas;
    window.WebGLRenderingContext = window.gl;
    window.navigator = require('./navigator');
    window.Image = require('./Image');
    window.Audio = require('./Audio');
    window.FileReader = require('./FileReader');
    window.location = require('./location');
    window.FontFace = require('./FontFace');
    window.FontFaceSet = require('./FontFaceSet');
    window.EventTarget = require('./EventTarget');
    window.Event = require('./Event');
    window.TouchEvent = require('./TouchEvent');

    window.ontouchstart = null;
    window.ontouchmove = null;
    window.ontouchend = null;
    window.ontouchcancel = null;

    window.addEventListener = function (eventName, listener, options) {
        window.canvas.addEventListener(eventName, listener, options);
    };

    window.removeEventListener = function (eventName, listener, options) {
        window.canvas.removeEventListener(eventName, listener, options);
    };

    window.dispatchEvent = function (event) {
        window.canvas.dispatchEvent(event);
    };

    window._isInjected = true;
}

if (!window._isInjected) {
    inject();
}

window.canvas.getContext = function (name) {
    if (name === 'webgl' || name === 'experimental-webgl') {
        return window.gl;
    }
    return null;
};

window.localStorage = sys.localStorage;

},{"./Audio":2,"./Event":4,"./EventTarget":5,"./FileReader":6,"./FontFace":7,"./FontFaceSet":8,"./HTMLAudioElement":9,"./HTMLCanvasElement":10,"./HTMLElement":11,"./HTMLImageElement":12,"./HTMLMediaElement":13,"./Image":14,"./TouchEvent":17,"./document":19,"./location":21,"./navigator":22}],25:[function(require,module,exports){
"use strict";

/*
 * Copyright (c) 2015-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function (jsb) {

    if (!jsb || !jsb.AudioEngine) return;

    jsb.AudioEngine.AudioState = {
        ERROR: -1,
        INITIALZING: 0,
        PLAYING: 1,
        PAUSED: 2
    };

    jsb.AudioEngine.INVALID_AUDIO_ID = -1;
    jsb.AudioEngine.TIME_UNKNOWN = -1;
})(jsb);

},{}],26:[function(require,module,exports){
'use strict';

/*
 * OpenGL ES 2.0 / WebGL helper functions
 *
 * According to the WebGL specification ( For further info see:s http://www.khronos.org/registry/webgl/specs/latest/webgl.idl ),
 * the API should work with objects like WebGLTexture, WebGLBuffer, WebGLRenderBuffer, WebGLFramebuffer, WebGLProgram, WebGLShader.
 * OpenGL ES 2.0 doesn't have "objects" concepts: Instead it uses ids (GLints). So, these objects are emulated in this thin wrapper.
 *
 * Copyright (c) 2013-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

require('./jsb_opengl_constants');
window.gl = window.gl || {};

gl.canvas = {
    clientWidth: window.innerWidth,
    clientHeight: window.innerHeight
};

//
// Create functions
//
gl.createTexture = function () {
    // Returns a "WebGLTexture" object
    var ret = gl._createTexture();
    return { texture_id: ret };
};

gl.createBuffer = function () {
    // Returns a "WebGLBuffer" object
    var ret = gl._createBuffer();
    return { buffer_id: ret };
};

gl.createRenderbuffer = function () {
    // Returns a "WebGLRenderBuffer" object
    var ret = gl._createRenderuffer();
    return { renderbuffer_id: ret };
};

gl.createFramebuffer = function () {
    // Returns a "WebGLFramebuffer" object
    var ret = gl._createFramebuffer();
    return { framebuffer_id: ret };
};

gl.createProgram = function () {
    // Returns a "WebGLProgram" object
    var ret = gl._createProgram();
    return { program_id: ret };
};

gl.createShader = function (shaderType) {
    // Returns a "WebGLShader" object
    var ret = gl._createShader(shaderType);
    return { shader_id: ret };
};

//
// Delete Functions
//
gl.deleteTexture = function (texture) {
    var texture_id = texture.texture_id;
    // Accept numbers too. eg: gl.deleteTexture(0)
    if (typeof texture === 'number') texture_id = texture;

    gl._deleteTexture(texture_id);
};

gl.deleteBuffer = function (buffer) {
    var buffer_id = buffer.buffer_id;
    // Accept numbers too. eg: gl.deleteBuffer(0)
    if (typeof buffer === 'number') buffer_id = buffer;

    gl._deleteBuffer(buffer_id);
};

gl.deleteRenderbuffer = function (buffer) {
    var buffer_id = buffer.renderbuffer_id;
    // Accept numbers too. eg: gl.deleteRenderbuffer(0)
    if (typeof buffer === 'number') buffer_id = buffer;

    gl._deleteRenderbuffer(renderbuffer_id);
};

gl.deleteFramebuffer = function (buffer) {
    var buffer_id;
    if (buffer) buffer_id = buffer.framebuffer_id;else buffer_id = null;
    gl._deleteFramebuffer(buffer_id);
};

gl.deleteProgram = function (program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.deleteShader(0)
    if (typeof program === 'number') program_id = program;

    gl._deleteProgram(program_id);
};

gl.deleteShader = function (shader) {
    var shader_id = shader.shader_id;
    // Accept numbers too. eg: gl.deleteShader(0)
    if (typeof shader === 'number') shader_id = shader;

    gl._deleteShader(shader_id);
};

//
// Bind Related
//
// void bindTexture(GLenum target, WebGLTexture? texture);
gl.bindTexture = function (target, texture) {

    var texture_id;
    // Accept numbers too. eg: gl.bindTexture(0)
    if (typeof texture === 'number') texture_id = texture;else if (texture === null) texture_id = 0;else texture_id = texture.texture_id;

    gl._bindTexture(target, texture_id);
};

// void bindBuffer(GLenum target, WebGLBuffer? buffer);
gl.bindBuffer = function (target, buffer) {
    var buffer_id;
    // Accept numbers too. eg: gl.bindBuffer(0)
    if (typeof buffer === 'number') buffer_id = buffer;else if (buffer === null) buffer_id = 0;else buffer_id = buffer.buffer_id;

    gl._bindBuffer(target, buffer_id);
};

// void bindRenderbuffer(GLenum target, WebGLRenderbuffer? renderbuffer);
gl.bindRenderBuffer = function (target, buffer) {
    var buffer_id;

    // Accept numbers too. eg: gl.bindRenderbuffer(0)
    if (typeof buffer === 'number') buffer_id = buffer;else if (buffer === null) buffer_id = 0;else buffer_id = buffer.buffer_id;

    gl._bindRenderbuffer(target, buffer_id);
};

// void bindFramebuffer(GLenum target, WebGLFramebuffer? framebuffer);
gl.bindFramebuffer = function (target, buffer) {
    var buffer_id;

    // Accept numbers too. eg: gl.bindFramebuffer(0)
    if (typeof buffer === 'number') buffer_id = buffer;else if (buffer === null) buffer_id = null;else buffer_id = buffer.buffer_id;

    gl._bindFramebuffer(target, buffer_id);
};

gl.framebufferTexture2D = function (target, attachment, textarget, texture, level) {
    gl._framebufferTexture2D(target, attachment, textarget, texture.texture_id, level);
};

//
// Uniform related
//
// any getUniform(WebGLProgram? program, WebGLUniformLocation? location);
gl.getUniform = function (program, location) {
    var program_id;
    var location_id;

    // Accept numbers too. eg: gl.bindFramebuffer(0)
    if (typeof program === 'number') program_id = program;else program_id = program.program_id;

    if (typeof location === 'number') location_id = location;else location_id = location.location_id;

    return gl._getUniform(program_id, location_id);
};

// gl.uniformMatrix2fv = function(location, bool, matrix) {
//  gl._uniformMatrix2fv(program.program_id, bool, matrix);
// };

// gl.uniformMatrix3fv = function(program, bool, matrix) {
//  gl._uniformMatrix3fv(program.program_id, bool, matrix);
// };

// gl.uniformMatrix4fv = function(program, bool, matrix) {
//  gl._uniformMatrix4fv(program.program_id, bool, matrix);
// };


//
// Shader related
//
// void compileShader(WebGLShader? shader);
gl.compileShader = function (shader) {
    gl._compileShader(shader.shader_id);
};

// void shaderSource(WebGLShader? shader, DOMString source);
gl.shaderSource = function (shader, source) {
    gl._shaderSource(shader.shader_id, source);
};

// any getShaderParameter(WebGLShader? shader, GLenum pname);
gl.getShaderParameter = function (shader, e) {
    return gl._getShaderParameter(shader.shader_id, e);
};

// DOMString? getShaderInfoLog(WebGLShader? shader);
gl.getShaderInfoLog = function (shader) {
    return gl._getShaderInfoLog(shader.shader_id);
};

// DOMString gl.getShaderSource(shader);
gl.getShaderSource = function (shader) {
    return gl._getShaderSource(shader.shader_id);
};

//
// program related
//
// void attachShader(WebGLProgram? program, WebGLShader? shader);
gl.attachShader = function (program, shader) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.attachShader(17)
    if (typeof program === 'number') program_id = program;

    gl._attachShader(program_id, shader.shader_id);
};

// void linkProgram(WebGLProgram? program);
gl.linkProgram = function (program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.linkProgram(17)
    if (typeof program === 'number') program_id = program;

    gl._linkProgram(program_id);
};

gl.bindAttribLocation = function (program, index, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.linkProgram(17)
    if (typeof program === 'number') program_id = program;

    gl._bindAttribLocation(program_id, index, name);
};

// any getProgramParameter(WebGLProgram? program, GLenum pname);
gl.getProgramParameter = function (program, e) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getProgramParameter(17)
    if (typeof program === 'number') program_id = program;

    return gl._getProgramParameter(program_id, e);
};

gl.getProgramInfoLog = function (program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getProgramParameter(17)
    if (typeof program === 'number') program_id = program;

    return gl._getProgramInfoLog(program_id);
};

// void useProgram(WebGLProgram? program);
gl.useProgram = function (program) {
    var program_id;
    // Accept numbers too. eg: gl.useProgram(17)
    if (typeof program === 'number') program_id = program;else program_id = program.program_id;

    gl._useProgram(program_id);
};

// [WebGLHandlesContextLoss] GLint getAttribLocation(WebGLProgram? program, DOMString name);
gl.getAttribLocation = function (program, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getAttribLocation(17)
    if (typeof program === 'number') program_id = program;

    return gl._getAttribLocation(program_id, name);
};

// WebGLUniformLocation? getUniformLocation(WebGLProgram? program, DOMString name);
gl.getUniformLocation = function (program, name) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getUniformLocation(17)
    if (typeof program === 'number') program_id = program;

    // XXX: it should return an object, not an integer
    return gl._getUniformLocation(program_id, name);
};

// WebGLActiveInfo? getActiveAttrib(WebGLProgram? program, GLuint index);
gl.getActiveAttrib = function (program, index) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getActiveAttrib(17)
    if (typeof program === 'number') program_id = program;

    return gl._getActiveAttrib(program_id, index);
};

// WebGLActiveInfo? getActiveUniform(WebGLProgram? program, GLuint index);
gl.getActiveUniform = function (program, index) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getActiveUniform(17)
    if (typeof program === 'number') program_id = program;

    return gl._getActiveUniform(program_id, index);
};

// sequence<WebGLShader>? getAttachedShaders(WebGLProgram? program);
gl.getAttachedShaders = function (program) {
    var program_id = program.program_id;
    // Accept numbers too. eg: gl.getAttachedShaders(17)
    if (typeof program === 'number') program_id = program;

    return gl._getAttachedShaders(program_id);
};

//
// Extensions
//
// From the WebGL spec:
// Returns an object if, and only if, name is an ASCII case-insensitive match [HTML] for one of the names returned from getSupportedExtensions;
// otherwise, returns null. The object returned from getExtension contains any constants or functions provided by the extension.
// A returned object may have no constants or functions if the extension does not define any, but a unique object must still be returned.
// That object is used to indicate that the extension has been enabled.
// XXX: The returned object must return the functions and constants.
gl.getExtension = function (extension) {
    var extensions = gl.getSupportedExtensions();
    if (extensions.indexOf(extension) > -1) return {};
    return null;
};

var HTMLCanvasElement = require('./jsb-adapter/HTMLCanvasElement');
var HTMLImageElement = require('./jsb-adapter/HTMLImageElement');
var ImageData = require('./jsb-adapter/ImageData');

var _glTexImage2D = gl.texImage2D;

/*
// WebGL1:
void gl.texImage2D(target, level, internalformat, width, height, border, format, type, ArrayBufferView? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageData? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLImageElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLCanvasElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, HTMLVideoElement? pixels);
void gl.texImage2D(target, level, internalformat, format, type, ImageBitmap? pixels);
*/
gl.texImage2D = function (target, level, internalformat, width, height, border, format, type, pixels) {
    var argCount = arguments.length;
    if (argCount == 6) {
        var image = border;
        type = height;
        format = width;

        if (image instanceof HTMLImageElement) {
            console.log('==> texImage2D HTMLImageElement internalformat: ' + image._glInternalFormat + ', format: ' + image._glFormat + ', image: w:' + image.width + ', h:' + image.height + ', dataLen:' + image._data.length);
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, image._alignment);

            _glTexImage2D(target, level, image._glInternalFormat, image.width, image.height, 0, image._glFormat, image._glType, image._data);
        } else if (image instanceof HTMLCanvasElement) {
            console.log('==> texImage2D HTMLCanvasElement internalformat: ' + internalformat + ', format: ' + format + ', image: w:' + image.width + ', h:' + image.height); //, dataLen:${image._data.length}`);
            _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image._data._data);
        } else if (image instanceof ImageData) {
            console.log('==> texImage2D ImageData internalformat: ' + internalformat + ', format: ' + format + ', image: w:' + image.width + ', h:' + image.height);
            _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image._data);
        } else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        }
    } else if (argCount == 9) {
        _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
    } else {
        console.error("gl.texImage2D: invalid argument count!");
    }
};

var _glTexSubImage2D = gl.texSubImage2D;
/*
 // WebGL 1:
 void gl.texSubImage2D(target, level, xoffset, yoffset, width, height, format, type, ArrayBufferView? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageData? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLImageElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLCanvasElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, HTMLVideoElement? pixels);
 void gl.texSubImage2D(target, level, xoffset, yoffset, format, type, ImageBitmap? pixels);
 */
gl.texSubImage2D = function (target, level, xoffset, yoffset, width, height, format, type, pixels) {
    var argCount = arguments.length;
    if (argCount == 7) {
        var image = format;
        type = height;
        format = width;

        //TODO: ImageData
        if (image instanceof HTMLImageElement) {
            gl.pixelStorei(gl.UNPACK_ALIGNMENT, image._alignment);
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, image._glFormat, image._glType, image._data);
        } else if (image instanceof HTMLCanvasElement) {
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image._data._data);
        } else if (image instanceof ImageData) {
            _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image._data);
        } else {
            console.error("Invalid pixel argument passed to gl.texImage2D!");
        }
    } else if (argCount == 9) {
        _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
    } else {
        console.error(new Error("gl.texImage2D: invalid argument count!").stack);
    }
};

//TODO:cjh get the real value
gl.getContextAttributes = function () {
    return {
        alpha: true,
        antialias: true,
        depth: true,
        failIfMajorPerformanceCaveat: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        stencil: true
    };
};

gl.isContextLost = function () {
    return false;
};

},{"./jsb-adapter/HTMLCanvasElement":10,"./jsb-adapter/HTMLImageElement":12,"./jsb-adapter/ImageData":15,"./jsb_opengl_constants":27}],27:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/*
* AUTOGENERATED FILE. DO NOT EDIT IT
* Generated by "generate_jsb.py -c opengl_jsb.ini" on 2013-03-18
* Script version: v0.6
*/

window.gl = window.gl || {};

gl.GCCSO_SHADER_BINARY_FJ = 0x9260;
gl._3DC_XY_AMD = 0x87fa;
gl._3DC_X_AMD = 0x87f9;
gl.ACTIVE_ATTRIBUTES = 0x8b89;
gl.ACTIVE_ATTRIBUTE_MAX_LENGTH = 0x8b8a;
gl.ACTIVE_PROGRAM_EXT = 0x8259;
gl.ACTIVE_TEXTURE = 0x84e0;
gl.ACTIVE_UNIFORMS = 0x8b86;
gl.ACTIVE_UNIFORM_MAX_LENGTH = 0x8b87;
gl.ALIASED_LINE_WIDTH_RANGE = 0x846e;
gl.ALIASED_POINT_SIZE_RANGE = 0x846d;
gl.ALL_COMPLETED_NV = 0x84f2;
gl.ALL_SHADER_BITS_EXT = 0xffffffff;
gl.ALPHA = 0x1906;
gl.ALPHA16F_EXT = 0x881c;
gl.ALPHA32F_EXT = 0x8816;
gl.ALPHA8_EXT = 0x803c;
gl.ALPHA8_OES = 0x803c;
gl.ALPHA_BITS = 0xd55;
gl.ALPHA_TEST_FUNC_QCOM = 0xbc1;
gl.ALPHA_TEST_QCOM = 0xbc0;
gl.ALPHA_TEST_REF_QCOM = 0xbc2;
gl.ALREADY_SIGNALED_APPLE = 0x911a;
gl.ALWAYS = 0x207;
gl.AMD_compressed_3DC_texture = 0x1;
gl.AMD_compressed_ATC_texture = 0x1;
gl.AMD_performance_monitor = 0x1;
gl.AMD_program_binary_Z400 = 0x1;
gl.ANGLE_depth_texture = 0x1;
gl.ANGLE_framebuffer_blit = 0x1;
gl.ANGLE_framebuffer_multisample = 0x1;
gl.ANGLE_instanced_arrays = 0x1;
gl.ANGLE_pack_reverse_row_order = 0x1;
gl.ANGLE_program_binary = 0x1;
gl.ANGLE_texture_compression_dxt3 = 0x1;
gl.ANGLE_texture_compression_dxt5 = 0x1;
gl.ANGLE_texture_usage = 0x1;
gl.ANGLE_translated_shader_source = 0x1;
gl.ANY_SAMPLES_PASSED_CONSERVATIVE_EXT = 0x8d6a;
gl.ANY_SAMPLES_PASSED_EXT = 0x8c2f;
gl.APPLE_copy_texture_levels = 0x1;
gl.APPLE_framebuffer_multisample = 0x1;
gl.APPLE_rgb_422 = 0x1;
gl.APPLE_sync = 0x1;
gl.APPLE_texture_format_BGRA8888 = 0x1;
gl.APPLE_texture_max_level = 0x1;
gl.ARM_mali_program_binary = 0x1;
gl.ARM_mali_shader_binary = 0x1;
gl.ARM_rgba8 = 0x1;
gl.ARRAY_BUFFER = 0x8892;
gl.ARRAY_BUFFER_BINDING = 0x8894;
gl.ATC_RGBA_EXPLICIT_ALPHA_AMD = 0x8c93;
gl.ATC_RGBA_INTERPOLATED_ALPHA_AMD = 0x87ee;
gl.ATC_RGB_AMD = 0x8c92;
gl.ATTACHED_SHADERS = 0x8b85;
gl.BACK = 0x405;
gl.BGRA8_EXT = 0x93a1;
gl.BGRA_EXT = 0x80e1;
gl.BGRA_IMG = 0x80e1;
gl.BINNING_CONTROL_HINT_QCOM = 0x8fb0;
gl.BLEND = 0xbe2;
gl.BLEND_COLOR = 0x8005;
gl.BLEND_DST_ALPHA = 0x80ca;
gl.BLEND_DST_RGB = 0x80c8;
gl.BLEND_EQUATION = 0x8009;
gl.BLEND_EQUATION_ALPHA = 0x883d;
gl.BLEND_EQUATION_RGB = 0x8009;
gl.BLEND_SRC_ALPHA = 0x80cb;
gl.BLEND_SRC_RGB = 0x80c9;
gl.BLUE_BITS = 0xd54;
gl.BOOL = 0x8b56;
gl.BOOL_VEC2 = 0x8b57;
gl.BOOL_VEC3 = 0x8b58;
gl.BOOL_VEC4 = 0x8b59;
gl.BUFFER = 0x82e0;
gl.BUFFER_ACCESS_OES = 0x88bb;
gl.BUFFER_MAPPED_OES = 0x88bc;
gl.BUFFER_MAP_POINTER_OES = 0x88bd;
gl.BUFFER_OBJECT_EXT = 0x9151;
gl.BUFFER_SIZE = 0x8764;
gl.BUFFER_USAGE = 0x8765;
gl.BYTE = 0x1400;
gl.CCW = 0x901;
gl.CLAMP_TO_BORDER_NV = 0x812d;
gl.CLAMP_TO_EDGE = 0x812f;
gl.COLOR_ATTACHMENT0 = 0x8ce0;
gl.COLOR_ATTACHMENT0_NV = 0x8ce0;
gl.COLOR_ATTACHMENT10_NV = 0x8cea;
gl.COLOR_ATTACHMENT11_NV = 0x8ceb;
gl.COLOR_ATTACHMENT12_NV = 0x8cec;
gl.COLOR_ATTACHMENT13_NV = 0x8ced;
gl.COLOR_ATTACHMENT14_NV = 0x8cee;
gl.COLOR_ATTACHMENT15_NV = 0x8cef;
gl.COLOR_ATTACHMENT1_NV = 0x8ce1;
gl.COLOR_ATTACHMENT2_NV = 0x8ce2;
gl.COLOR_ATTACHMENT3_NV = 0x8ce3;
gl.COLOR_ATTACHMENT4_NV = 0x8ce4;
gl.COLOR_ATTACHMENT5_NV = 0x8ce5;
gl.COLOR_ATTACHMENT6_NV = 0x8ce6;
gl.COLOR_ATTACHMENT7_NV = 0x8ce7;
gl.COLOR_ATTACHMENT8_NV = 0x8ce8;
gl.COLOR_ATTACHMENT9_NV = 0x8ce9;
gl.COLOR_ATTACHMENT_EXT = 0x90f0;
gl.COLOR_BUFFER_BIT = 0x4000;
gl.COLOR_BUFFER_BIT0_QCOM = 0x1;
gl.COLOR_BUFFER_BIT1_QCOM = 0x2;
gl.COLOR_BUFFER_BIT2_QCOM = 0x4;
gl.COLOR_BUFFER_BIT3_QCOM = 0x8;
gl.COLOR_BUFFER_BIT4_QCOM = 0x10;
gl.COLOR_BUFFER_BIT5_QCOM = 0x20;
gl.COLOR_BUFFER_BIT6_QCOM = 0x40;
gl.COLOR_BUFFER_BIT7_QCOM = 0x80;
gl.COLOR_CLEAR_VALUE = 0xc22;
gl.COLOR_EXT = 0x1800;
gl.COLOR_WRITEMASK = 0xc23;
gl.COMPARE_REF_TO_TEXTURE_EXT = 0x884e;
gl.COMPILE_STATUS = 0x8b81;
gl.COMPRESSED_RGBA_ASTC_10x10_KHR = 0x93bb;
gl.COMPRESSED_RGBA_ASTC_10x5_KHR = 0x93b8;
gl.COMPRESSED_RGBA_ASTC_10x6_KHR = 0x93b9;
gl.COMPRESSED_RGBA_ASTC_10x8_KHR = 0x93ba;
gl.COMPRESSED_RGBA_ASTC_12x10_KHR = 0x93bc;
gl.COMPRESSED_RGBA_ASTC_12x12_KHR = 0x93bd;
gl.COMPRESSED_RGBA_ASTC_4x4_KHR = 0x93b0;
gl.COMPRESSED_RGBA_ASTC_5x4_KHR = 0x93b1;
gl.COMPRESSED_RGBA_ASTC_5x5_KHR = 0x93b2;
gl.COMPRESSED_RGBA_ASTC_6x5_KHR = 0x93b3;
gl.COMPRESSED_RGBA_ASTC_6x6_KHR = 0x93b4;
gl.COMPRESSED_RGBA_ASTC_8x5_KHR = 0x93b5;
gl.COMPRESSED_RGBA_ASTC_8x6_KHR = 0x93b6;
gl.COMPRESSED_RGBA_ASTC_8x8_KHR = 0x93b7;
gl.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8c03;
gl.COMPRESSED_RGBA_PVRTC_2BPPV2_IMG = 0x9137;
gl.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8c02;
gl.COMPRESSED_RGBA_PVRTC_4BPPV2_IMG = 0x9138;
gl.COMPRESSED_RGBA_S3TC_DXT1_EXT = 0x83f1;
gl.COMPRESSED_RGBA_S3TC_DXT3_ANGLE = 0x83f2;
gl.COMPRESSED_RGBA_S3TC_DXT5_ANGLE = 0x83f3;
gl.COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8c01;
gl.COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8c00;
gl.COMPRESSED_RGB_S3TC_DXT1_EXT = 0x83f0;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR = 0x93db;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR = 0x93d8;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR = 0x93d9;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR = 0x93da;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR = 0x93dc;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR = 0x93dd;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR = 0x93d0;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR = 0x93d1;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR = 0x93d2;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR = 0x93d3;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR = 0x93d4;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR = 0x93d5;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR = 0x93d6;
gl.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR = 0x93d7;
gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_NV = 0x8c4d;
gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_NV = 0x8c4e;
gl.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_NV = 0x8c4f;
gl.COMPRESSED_SRGB_S3TC_DXT1_NV = 0x8c4c;
gl.COMPRESSED_TEXTURE_FORMATS = 0x86a3;
gl.CONDITION_SATISFIED_APPLE = 0x911c;
gl.CONSTANT_ALPHA = 0x8003;
gl.CONSTANT_COLOR = 0x8001;
gl.CONTEXT_FLAG_DEBUG_BIT = 0x2;
gl.CONTEXT_ROBUST_ACCESS_EXT = 0x90f3;
gl.COUNTER_RANGE_AMD = 0x8bc1;
gl.COUNTER_TYPE_AMD = 0x8bc0;
gl.COVERAGE_ALL_FRAGMENTS_NV = 0x8ed5;
gl.COVERAGE_ATTACHMENT_NV = 0x8ed2;
gl.COVERAGE_AUTOMATIC_NV = 0x8ed7;
gl.COVERAGE_BUFFERS_NV = 0x8ed3;
gl.COVERAGE_BUFFER_BIT_NV = 0x8000;
gl.COVERAGE_COMPONENT4_NV = 0x8ed1;
gl.COVERAGE_COMPONENT_NV = 0x8ed0;
gl.COVERAGE_EDGE_FRAGMENTS_NV = 0x8ed6;
gl.COVERAGE_SAMPLES_NV = 0x8ed4;
gl.CPU_OPTIMIZED_QCOM = 0x8fb1;
gl.CULL_FACE = 0xb44;
gl.CULL_FACE_MODE = 0xb45;
gl.CURRENT_PROGRAM = 0x8b8d;
gl.CURRENT_QUERY_EXT = 0x8865;
gl.CURRENT_VERTEX_ATTRIB = 0x8626;
gl.CW = 0x900;
gl.DEBUG_CALLBACK_FUNCTION = 0x8244;
gl.DEBUG_CALLBACK_USER_PARAM = 0x8245;
gl.DEBUG_GROUP_STACK_DEPTH = 0x826d;
gl.DEBUG_LOGGED_MESSAGES = 0x9145;
gl.DEBUG_NEXT_LOGGED_MESSAGE_LENGTH = 0x8243;
gl.DEBUG_OUTPUT = 0x92e0;
gl.DEBUG_OUTPUT_SYNCHRONOUS = 0x8242;
gl.DEBUG_SEVERITY_HIGH = 0x9146;
gl.DEBUG_SEVERITY_LOW = 0x9148;
gl.DEBUG_SEVERITY_MEDIUM = 0x9147;
gl.DEBUG_SEVERITY_NOTIFICATION = 0x826b;
gl.DEBUG_SOURCE_API = 0x8246;
gl.DEBUG_SOURCE_APPLICATION = 0x824a;
gl.DEBUG_SOURCE_OTHER = 0x824b;
gl.DEBUG_SOURCE_SHADER_COMPILER = 0x8248;
gl.DEBUG_SOURCE_THIRD_PARTY = 0x8249;
gl.DEBUG_SOURCE_WINDOW_SYSTEM = 0x8247;
gl.DEBUG_TYPE_DEPRECATED_BEHAVIOR = 0x824d;
gl.DEBUG_TYPE_ERROR = 0x824c;
gl.DEBUG_TYPE_MARKER = 0x8268;
gl.DEBUG_TYPE_OTHER = 0x8251;
gl.DEBUG_TYPE_PERFORMANCE = 0x8250;
gl.DEBUG_TYPE_POP_GROUP = 0x826a;
gl.DEBUG_TYPE_PORTABILITY = 0x824f;
gl.DEBUG_TYPE_PUSH_GROUP = 0x8269;
gl.DEBUG_TYPE_UNDEFINED_BEHAVIOR = 0x824e;
gl.DECR = 0x1e03;
gl.DECR_WRAP = 0x8508;
gl.DELETE_STATUS = 0x8b80;
gl.DEPTH24_STENCIL8_OES = 0x88f0;
gl.DEPTH_ATTACHMENT = 0x8d00;
gl.DEPTH_BITS = 0xd56;
gl.DEPTH_BUFFER_BIT = 0x100;
gl.DEPTH_BUFFER_BIT0_QCOM = 0x100;
gl.DEPTH_BUFFER_BIT1_QCOM = 0x200;
gl.DEPTH_BUFFER_BIT2_QCOM = 0x400;
gl.DEPTH_BUFFER_BIT3_QCOM = 0x800;
gl.DEPTH_BUFFER_BIT4_QCOM = 0x1000;
gl.DEPTH_BUFFER_BIT5_QCOM = 0x2000;
gl.DEPTH_BUFFER_BIT6_QCOM = 0x4000;
gl.DEPTH_BUFFER_BIT7_QCOM = 0x8000;
gl.DEPTH_CLEAR_VALUE = 0xb73;
gl.DEPTH_COMPONENT = 0x1902;
gl.DEPTH_COMPONENT16 = 0x81a5;
gl.DEPTH_COMPONENT16_NONLINEAR_NV = 0x8e2c;
gl.DEPTH_COMPONENT16_OES = 0x81a5;
gl.DEPTH_COMPONENT24_OES = 0x81a6;
gl.DEPTH_COMPONENT32_OES = 0x81a7;
gl.DEPTH_EXT = 0x1801;
gl.DEPTH_FUNC = 0xb74;
gl.DEPTH_RANGE = 0xb70;
gl.DEPTH_STENCIL = 0x84f9;
gl.DEPTH_STENCIL_OES = 0x84f9;
gl.DEPTH_TEST = 0xb71;
gl.DEPTH_WRITEMASK = 0xb72;
gl.DITHER = 0xbd0;
gl.DMP_shader_binary = 0x1;
gl.DONT_CARE = 0x1100;
gl.DRAW_BUFFER0_NV = 0x8825;
gl.DRAW_BUFFER10_NV = 0x882f;
gl.DRAW_BUFFER11_NV = 0x8830;
gl.DRAW_BUFFER12_NV = 0x8831;
gl.DRAW_BUFFER13_NV = 0x8832;
gl.DRAW_BUFFER14_NV = 0x8833;
gl.DRAW_BUFFER15_NV = 0x8834;
gl.DRAW_BUFFER1_NV = 0x8826;
gl.DRAW_BUFFER2_NV = 0x8827;
gl.DRAW_BUFFER3_NV = 0x8828;
gl.DRAW_BUFFER4_NV = 0x8829;
gl.DRAW_BUFFER5_NV = 0x882a;
gl.DRAW_BUFFER6_NV = 0x882b;
gl.DRAW_BUFFER7_NV = 0x882c;
gl.DRAW_BUFFER8_NV = 0x882d;
gl.DRAW_BUFFER9_NV = 0x882e;
gl.DRAW_BUFFER_EXT = 0xc01;
gl.DRAW_FRAMEBUFFER_ANGLE = 0x8ca9;
gl.DRAW_FRAMEBUFFER_APPLE = 0x8ca9;
gl.DRAW_FRAMEBUFFER_BINDING_ANGLE = 0x8ca6;
gl.DRAW_FRAMEBUFFER_BINDING_APPLE = 0x8ca6;
gl.DRAW_FRAMEBUFFER_BINDING_NV = 0x8ca6;
gl.DRAW_FRAMEBUFFER_NV = 0x8ca9;
gl.DST_ALPHA = 0x304;
gl.DST_COLOR = 0x306;
gl.DYNAMIC_DRAW = 0x88e8;
gl.ELEMENT_ARRAY_BUFFER = 0x8893;
gl.ELEMENT_ARRAY_BUFFER_BINDING = 0x8895;
gl.EQUAL = 0x202;
gl.ES_VERSION_2_0 = 0x1;
gl.ETC1_RGB8_OES = 0x8d64;
gl.ETC1_SRGB8_NV = 0x88ee;
gl.EXTENSIONS = 0x1f03;
gl.EXT_blend_minmax = 0x1;
gl.EXT_color_buffer_half_float = 0x1;
gl.EXT_debug_label = 0x1;
gl.EXT_debug_marker = 0x1;
gl.EXT_discard_framebuffer = 0x1;
gl.EXT_map_buffer_range = 0x1;
gl.EXT_multi_draw_arrays = 0x1;
gl.EXT_multisampled_render_to_texture = 0x1;
gl.EXT_multiview_draw_buffers = 0x1;
gl.EXT_occlusion_query_boolean = 0x1;
gl.EXT_read_format_bgra = 0x1;
gl.EXT_robustness = 0x1;
gl.EXT_sRGB = 0x1;
gl.EXT_separate_shader_objects = 0x1;
gl.EXT_shader_framebuffer_fetch = 0x1;
gl.EXT_shader_texture_lod = 0x1;
gl.EXT_shadow_samplers = 0x1;
gl.EXT_texture_compression_dxt1 = 0x1;
gl.EXT_texture_filter_anisotropic = 0x1;
gl.EXT_texture_format_BGRA8888 = 0x1;
gl.EXT_texture_rg = 0x1;
gl.EXT_texture_storage = 0x1;
gl.EXT_texture_type_2_10_10_10_REV = 0x1;
gl.EXT_unpack_subimage = 0x1;
gl.FALSE = 0x0;
gl.FASTEST = 0x1101;
gl.FENCE_CONDITION_NV = 0x84f4;
gl.FENCE_STATUS_NV = 0x84f3;
gl.FIXED = 0x140c;
gl.FJ_shader_binary_GCCSO = 0x1;
gl.FLOAT = 0x1406;
gl.FLOAT_MAT2 = 0x8b5a;
gl.FLOAT_MAT3 = 0x8b5b;
gl.FLOAT_MAT4 = 0x8b5c;
gl.FLOAT_VEC2 = 0x8b50;
gl.FLOAT_VEC3 = 0x8b51;
gl.FLOAT_VEC4 = 0x8b52;
gl.FRAGMENT_SHADER = 0x8b30;
gl.FRAGMENT_SHADER_BIT_EXT = 0x2;
gl.FRAGMENT_SHADER_DERIVATIVE_HINT_OES = 0x8b8b;
gl.FRAGMENT_SHADER_DISCARDS_SAMPLES_EXT = 0x8a52;
gl.FRAMEBUFFER = 0x8d40;
gl.FRAMEBUFFER_ATTACHMENT_ANGLE = 0x93a3;
gl.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT = 0x8210;
gl.FRAMEBUFFER_ATTACHMENT_COMPONENT_TYPE_EXT = 0x8211;
gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = 0x8cd1;
gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = 0x8cd0;
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_3D_ZOFFSET_OES = 0x8cd4;
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = 0x8cd3;
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = 0x8cd2;
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_SAMPLES_EXT = 0x8d6c;
gl.FRAMEBUFFER_BINDING = 0x8ca6;
gl.FRAMEBUFFER_COMPLETE = 0x8cd5;
gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8cd6;
gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8cd9;
gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8cd7;
gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_ANGLE = 0x8d56;
gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_APPLE = 0x8d56;
gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_EXT = 0x8d56;
gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_IMG = 0x9134;
gl.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE_NV = 0x8d56;
gl.FRAMEBUFFER_UNDEFINED_OES = 0x8219;
gl.FRAMEBUFFER_UNSUPPORTED = 0x8cdd;
gl.FRONT = 0x404;
gl.FRONT_AND_BACK = 0x408;
gl.FRONT_FACE = 0xb46;
gl.FUNC_ADD = 0x8006;
gl.FUNC_REVERSE_SUBTRACT = 0x800b;
gl.FUNC_SUBTRACT = 0x800a;
gl.GENERATE_MIPMAP_HINT = 0x8192;
gl.GEQUAL = 0x206;
gl.GPU_OPTIMIZED_QCOM = 0x8fb2;
gl.GREATER = 0x204;
gl.GREEN_BITS = 0xd53;
gl.GUILTY_CONTEXT_RESET_EXT = 0x8253;
gl.HALF_FLOAT_OES = 0x8d61;
gl.HIGH_FLOAT = 0x8df2;
gl.HIGH_INT = 0x8df5;
gl.IMG_multisampled_render_to_texture = 0x1;
gl.IMG_program_binary = 0x1;
gl.IMG_read_format = 0x1;
gl.IMG_shader_binary = 0x1;
gl.IMG_texture_compression_pvrtc = 0x1;
gl.IMG_texture_compression_pvrtc2 = 0x1;
gl.IMPLEMENTATION_COLOR_READ_FORMAT = 0x8b9b;
gl.IMPLEMENTATION_COLOR_READ_TYPE = 0x8b9a;
gl.INCR = 0x1e02;
gl.INCR_WRAP = 0x8507;
gl.INFO_LOG_LENGTH = 0x8b84;
gl.INNOCENT_CONTEXT_RESET_EXT = 0x8254;
gl.INT = 0x1404;
gl.INT_10_10_10_2_OES = 0x8df7;
gl.INT_VEC2 = 0x8b53;
gl.INT_VEC3 = 0x8b54;
gl.INT_VEC4 = 0x8b55;
gl.INVALID_ENUM = 0x500;
gl.INVALID_FRAMEBUFFER_OPERATION = 0x506;
gl.INVALID_OPERATION = 0x502;
gl.INVALID_VALUE = 0x501;
gl.INVERT = 0x150a;
gl.KEEP = 0x1e00;
gl.KHR_debug = 0x1;
gl.KHR_texture_compression_astc_ldr = 0x1;
gl.LEFT = 0x0406;
gl.LEQUAL = 0x203;
gl.LESS = 0x201;
gl.LINEAR = 0x2601;
gl.LINEAR_MIPMAP_LINEAR = 0x2703;
gl.LINEAR_MIPMAP_NEAREST = 0x2701;
gl.LINES = 0x1;
gl.LINE_LOOP = 0x2;
gl.LINE_STRIP = 0x3;
gl.LINE_WIDTH = 0xb21;
gl.LINK_STATUS = 0x8b82;
gl.LOSE_CONTEXT_ON_RESET_EXT = 0x8252;
gl.LOW_FLOAT = 0x8df0;
gl.LOW_INT = 0x8df3;
gl.LUMINANCE = 0x1909;
gl.LUMINANCE16F_EXT = 0x881e;
gl.LUMINANCE32F_EXT = 0x8818;
gl.LUMINANCE4_ALPHA4_OES = 0x8043;
gl.LUMINANCE8_ALPHA8_EXT = 0x8045;
gl.LUMINANCE8_ALPHA8_OES = 0x8045;
gl.LUMINANCE8_EXT = 0x8040;
gl.LUMINANCE8_OES = 0x8040;
gl.LUMINANCE_ALPHA = 0x190a;
gl.LUMINANCE_ALPHA16F_EXT = 0x881f;
gl.LUMINANCE_ALPHA32F_EXT = 0x8819;
gl.MALI_PROGRAM_BINARY_ARM = 0x8f61;
gl.MALI_SHADER_BINARY_ARM = 0x8f60;
gl.MAP_FLUSH_EXPLICIT_BIT_EXT = 0x10;
gl.MAP_INVALIDATE_BUFFER_BIT_EXT = 0x8;
gl.MAP_INVALIDATE_RANGE_BIT_EXT = 0x4;
gl.MAP_READ_BIT_EXT = 0x1;
gl.MAP_UNSYNCHRONIZED_BIT_EXT = 0x20;
gl.MAP_WRITE_BIT_EXT = 0x2;
gl.MAX_3D_TEXTURE_SIZE_OES = 0x8073;
gl.MAX_COLOR_ATTACHMENTS_NV = 0x8cdf;
gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = 0x8b4d;
gl.MAX_CUBE_MAP_TEXTURE_SIZE = 0x851c;
gl.MAX_DEBUG_GROUP_STACK_DEPTH = 0x826c;
gl.MAX_DEBUG_LOGGED_MESSAGES = 0x9144;
gl.MAX_DEBUG_MESSAGE_LENGTH = 0x9143;
gl.MAX_DRAW_BUFFERS_NV = 0x8824;
gl.MAX_EXT = 0x8008;
gl.MAX_FRAGMENT_UNIFORM_VECTORS = 0x8dfd;
gl.MAX_LABEL_LENGTH = 0x82e8;
gl.MAX_MULTIVIEW_BUFFERS_EXT = 0x90f2;
gl.MAX_RENDERBUFFER_SIZE = 0x84e8;
gl.MAX_SAMPLES_ANGLE = 0x8d57;
gl.MAX_SAMPLES_APPLE = 0x8d57;
gl.MAX_SAMPLES_EXT = 0x8d57;
gl.MAX_SAMPLES_IMG = 0x9135;
gl.MAX_SAMPLES_NV = 0x8d57;
gl.MAX_SERVER_WAIT_TIMEOUT_APPLE = 0x9111;
gl.MAX_TEXTURE_IMAGE_UNITS = 0x8872;
gl.MAX_TEXTURE_MAX_ANISOTROPY_EXT = 0x84ff;
gl.MAX_TEXTURE_SIZE = 0xd33;
gl.MAX_VARYING_VECTORS = 0x8dfc;
gl.MAX_VERTEX_ATTRIBS = 0x8869;
gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = 0x8b4c;
gl.MAX_VERTEX_UNIFORM_VECTORS = 0x8dfb;
gl.MAX_VIEWPORT_DIMS = 0xd3a;
gl.MEDIUM_FLOAT = 0x8df1;
gl.MEDIUM_INT = 0x8df4;
gl.MIN_EXT = 0x8007;
gl.MIRRORED_REPEAT = 0x8370;
gl.MULTISAMPLE_BUFFER_BIT0_QCOM = 0x1000000;
gl.MULTISAMPLE_BUFFER_BIT1_QCOM = 0x2000000;
gl.MULTISAMPLE_BUFFER_BIT2_QCOM = 0x4000000;
gl.MULTISAMPLE_BUFFER_BIT3_QCOM = 0x8000000;
gl.MULTISAMPLE_BUFFER_BIT4_QCOM = 0x10000000;
gl.MULTISAMPLE_BUFFER_BIT5_QCOM = 0x20000000;
gl.MULTISAMPLE_BUFFER_BIT6_QCOM = 0x40000000;
gl.MULTISAMPLE_BUFFER_BIT7_QCOM = 0x80000000;
gl.MULTIVIEW_EXT = 0x90f1;
gl.NEAREST = 0x2600;
gl.NEAREST_MIPMAP_LINEAR = 0x2702;
gl.NEAREST_MIPMAP_NEAREST = 0x2700;
gl.NEVER = 0x200;
gl.NICEST = 0x1102;
gl.NONE = 0x0;
gl.NOTEQUAL = 0x205;
gl.NO_ERROR = 0x0;
gl.NO_RESET_NOTIFICATION_EXT = 0x8261;
gl.NUM_COMPRESSED_TEXTURE_FORMATS = 0x86a2;
gl.NUM_PROGRAM_BINARY_FORMATS_OES = 0x87fe;
gl.NUM_SHADER_BINARY_FORMATS = 0x8df9;
gl.NV_coverage_sample = 0x1;
gl.NV_depth_nonlinear = 0x1;
gl.NV_draw_buffers = 0x1;
gl.NV_draw_instanced = 0x1;
gl.NV_fbo_color_attachments = 0x1;
gl.NV_fence = 0x1;
gl.NV_framebuffer_blit = 0x1;
gl.NV_framebuffer_multisample = 0x1;
gl.NV_generate_mipmap_sRGB = 0x1;
gl.NV_instanced_arrays = 0x1;
gl.NV_read_buffer = 0x1;
gl.NV_read_buffer_front = 0x1;
gl.NV_read_depth = 0x1;
gl.NV_read_depth_stencil = 0x1;
gl.NV_read_stencil = 0x1;
gl.NV_sRGB_formats = 0x1;
gl.NV_shadow_samplers_array = 0x1;
gl.NV_shadow_samplers_cube = 0x1;
gl.NV_texture_border_clamp = 0x1;
gl.NV_texture_compression_s3tc_update = 0x1;
gl.NV_texture_npot_2D_mipmap = 0x1;
gl.OBJECT_TYPE_APPLE = 0x9112;
gl.OES_EGL_image = 0x1;
gl.OES_EGL_image_external = 0x1;
gl.OES_compressed_ETC1_RGB8_texture = 0x1;
gl.OES_compressed_paletted_texture = 0x1;
gl.OES_depth24 = 0x1;
gl.OES_depth32 = 0x1;
gl.OES_depth_texture = 0x1;
gl.OES_element_index_uint = 0x1;
gl.OES_fbo_render_mipmap = 0x1;
gl.OES_fragment_precision_high = 0x1;
gl.OES_get_program_binary = 0x1;
gl.OES_mapbuffer = 0x1;
gl.OES_packed_depth_stencil = 0x1;
gl.OES_required_internalformat = 0x1;
gl.OES_rgb8_rgba8 = 0x1;
gl.OES_standard_derivatives = 0x1;
gl.OES_stencil1 = 0x1;
gl.OES_stencil4 = 0x1;
gl.OES_surfaceless_context = 0x1;
gl.OES_texture_3D = 0x1;
gl.OES_texture_float = 0x1;
gl.OES_texture_float_linear = 0x1;
gl.OES_texture_half_float = 0x1;
gl.OES_texture_half_float_linear = 0x1;
gl.OES_texture_npot = 0x1;
gl.OES_vertex_array_object = 0x1;
gl.OES_vertex_half_float = 0x1;
gl.OES_vertex_type_10_10_10_2 = 0x1;
gl.ONE = 0x1;
gl.ONE_MINUS_CONSTANT_ALPHA = 0x8004;
gl.ONE_MINUS_CONSTANT_COLOR = 0x8002;
gl.ONE_MINUS_DST_ALPHA = 0x305;
gl.ONE_MINUS_DST_COLOR = 0x307;
gl.ONE_MINUS_SRC_ALPHA = 0x303;
gl.ONE_MINUS_SRC_COLOR = 0x301;
gl.OUT_OF_MEMORY = 0x505;
gl.PACK_ALIGNMENT = 0xd05;
gl.PACK_REVERSE_ROW_ORDER_ANGLE = 0x93a4;
gl.PALETTE4_R5_G6_B5_OES = 0x8b92;
gl.PALETTE4_RGB5_A1_OES = 0x8b94;
gl.PALETTE4_RGB8_OES = 0x8b90;
gl.PALETTE4_RGBA4_OES = 0x8b93;
gl.PALETTE4_RGBA8_OES = 0x8b91;
gl.PALETTE8_R5_G6_B5_OES = 0x8b97;
gl.PALETTE8_RGB5_A1_OES = 0x8b99;
gl.PALETTE8_RGB8_OES = 0x8b95;
gl.PALETTE8_RGBA4_OES = 0x8b98;
gl.PALETTE8_RGBA8_OES = 0x8b96;
gl.PERCENTAGE_AMD = 0x8bc3;
gl.PERFMON_GLOBAL_MODE_QCOM = 0x8fa0;
gl.PERFMON_RESULT_AMD = 0x8bc6;
gl.PERFMON_RESULT_AVAILABLE_AMD = 0x8bc4;
gl.PERFMON_RESULT_SIZE_AMD = 0x8bc5;
gl.POINTS = 0x0;
gl.POLYGON_OFFSET_FACTOR = 0x8038;
gl.POLYGON_OFFSET_FILL = 0x8037;
gl.POLYGON_OFFSET_UNITS = 0x2a00;
gl.PROGRAM = 0x82e2;
gl.PROGRAM_BINARY_ANGLE = 0x93a6;
gl.PROGRAM_BINARY_FORMATS_OES = 0x87ff;
gl.PROGRAM_BINARY_LENGTH_OES = 0x8741;
gl.PROGRAM_OBJECT_EXT = 0x8b40;
gl.PROGRAM_PIPELINE_BINDING_EXT = 0x825a;
gl.PROGRAM_PIPELINE_OBJECT_EXT = 0x8a4f;
gl.PROGRAM_SEPARABLE_EXT = 0x8258;
gl.QCOM_alpha_test = 0x1;
gl.QCOM_binning_control = 0x1;
gl.QCOM_driver_control = 0x1;
gl.QCOM_extended_get = 0x1;
gl.QCOM_extended_get2 = 0x1;
gl.QCOM_perfmon_global_mode = 0x1;
gl.QCOM_tiled_rendering = 0x1;
gl.QCOM_writeonly_rendering = 0x1;
gl.QUERY = 0x82e3;
gl.QUERY_OBJECT_EXT = 0x9153;
gl.QUERY_RESULT_AVAILABLE_EXT = 0x8867;
gl.QUERY_RESULT_EXT = 0x8866;
gl.R16F_EXT = 0x822d;
gl.R32F_EXT = 0x822e;
gl.R8_EXT = 0x8229;
gl.READ_BUFFER_EXT = 0xc02;
gl.READ_BUFFER_NV = 0xc02;
gl.READ_FRAMEBUFFER_ANGLE = 0x8ca8;
gl.READ_FRAMEBUFFER_APPLE = 0x8ca8;
gl.READ_FRAMEBUFFER_BINDING_ANGLE = 0x8caa;
gl.READ_FRAMEBUFFER_BINDING_APPLE = 0x8caa;
gl.READ_FRAMEBUFFER_BINDING_NV = 0x8caa;
gl.READ_FRAMEBUFFER_NV = 0x8ca8;
gl.RED_BITS = 0xd52;
gl.RED_EXT = 0x1903;
gl.RENDERBUFFER = 0x8d41;
gl.RENDERBUFFER_ALPHA_SIZE = 0x8d53;
gl.RENDERBUFFER_BINDING = 0x8ca7;
gl.RENDERBUFFER_BLUE_SIZE = 0x8d52;
gl.RENDERBUFFER_DEPTH_SIZE = 0x8d54;
gl.RENDERBUFFER_GREEN_SIZE = 0x8d51;
gl.RENDERBUFFER_HEIGHT = 0x8d43;
gl.RENDERBUFFER_INTERNAL_FORMAT = 0x8d44;
gl.RENDERBUFFER_RED_SIZE = 0x8d50;
gl.RENDERBUFFER_SAMPLES_ANGLE = 0x8cab;
gl.RENDERBUFFER_SAMPLES_APPLE = 0x8cab;
gl.RENDERBUFFER_SAMPLES_EXT = 0x8cab;
gl.RENDERBUFFER_SAMPLES_IMG = 0x9133;
gl.RENDERBUFFER_SAMPLES_NV = 0x8cab;
gl.RENDERBUFFER_STENCIL_SIZE = 0x8d55;
gl.RENDERBUFFER_WIDTH = 0x8d42;
gl.RENDERER = 0x1f01;
gl.RENDER_DIRECT_TO_FRAMEBUFFER_QCOM = 0x8fb3;
gl.REPEAT = 0x2901;
gl.REPLACE = 0x1e01;
gl.REQUIRED_TEXTURE_IMAGE_UNITS_OES = 0x8d68;
gl.RESET_NOTIFICATION_STRATEGY_EXT = 0x8256;
gl.RG16F_EXT = 0x822f;
gl.RG32F_EXT = 0x8230;
gl.RG8_EXT = 0x822b;
gl.RGB = 0x1907;
gl.RGB10_A2_EXT = 0x8059;
gl.RGB10_EXT = 0x8052;
gl.RGB16F_EXT = 0x881b;
gl.RGB32F_EXT = 0x8815;
gl.RGB565 = 0x8d62;
gl.RGB565_OES = 0x8d62;
gl.RGB5_A1 = 0x8057;
gl.RGB5_A1_OES = 0x8057;
gl.RGB8_OES = 0x8051;
gl.RGBA = 0x1908;
gl.RGBA16F_EXT = 0x881a;
gl.RGBA32F_EXT = 0x8814;
gl.RGBA4 = 0x8056;
gl.RGBA4_OES = 0x8056;
gl.RGBA8_OES = 0x8058;
gl.RGB_422_APPLE = 0x8a1f;
gl.RG_EXT = 0x8227;
gl.RIGHT = 0x0407;
gl.SAMPLER = 0x82e6;
gl.SAMPLER_2D = 0x8b5e;
gl.SAMPLER_2D_ARRAY_SHADOW_NV = 0x8dc4;
gl.SAMPLER_2D_SHADOW_EXT = 0x8b62;
gl.SAMPLER_3D_OES = 0x8b5f;
gl.SAMPLER_CUBE = 0x8b60;
gl.SAMPLER_CUBE_SHADOW_NV = 0x8dc5;
gl.SAMPLER_EXTERNAL_OES = 0x8d66;
gl.SAMPLES = 0x80a9;
gl.SAMPLE_ALPHA_TO_COVERAGE = 0x809e;
gl.SAMPLE_BUFFERS = 0x80a8;
gl.SAMPLE_COVERAGE = 0x80a0;
gl.SAMPLE_COVERAGE_INVERT = 0x80ab;
gl.SAMPLE_COVERAGE_VALUE = 0x80aa;
gl.SCISSOR_BOX = 0xc10;
gl.SCISSOR_TEST = 0xc11;
gl.SGX_BINARY_IMG = 0x8c0a;
gl.SGX_PROGRAM_BINARY_IMG = 0x9130;
gl.SHADER = 0x82e1;
gl.SHADER_BINARY_DMP = 0x9250;
gl.SHADER_BINARY_FORMATS = 0x8df8;
gl.SHADER_BINARY_VIV = 0x8fc4;
gl.SHADER_COMPILER = 0x8dfa;
gl.SHADER_OBJECT_EXT = 0x8b48;
gl.SHADER_SOURCE_LENGTH = 0x8b88;
gl.SHADER_TYPE = 0x8b4f;
gl.SHADING_LANGUAGE_VERSION = 0x8b8c;
gl.SHORT = 0x1402;
gl.SIGNALED_APPLE = 0x9119;
gl.SLUMINANCE8_ALPHA8_NV = 0x8c45;
gl.SLUMINANCE8_NV = 0x8c47;
gl.SLUMINANCE_ALPHA_NV = 0x8c44;
gl.SLUMINANCE_NV = 0x8c46;
gl.SRC_ALPHA = 0x302;
gl.SRC_ALPHA_SATURATE = 0x308;
gl.SRC_COLOR = 0x300;
gl.SRGB8_ALPHA8_EXT = 0x8c43;
gl.SRGB8_NV = 0x8c41;
gl.SRGB_ALPHA_EXT = 0x8c42;
gl.SRGB_EXT = 0x8c40;
gl.STACK_OVERFLOW = 0x503;
gl.STACK_UNDERFLOW = 0x504;
gl.STATE_RESTORE = 0x8bdc;
gl.STATIC_DRAW = 0x88e4;
gl.STENCIL_ATTACHMENT = 0x8d20;
gl.STENCIL_BACK_FAIL = 0x8801;
gl.STENCIL_BACK_FUNC = 0x8800;
gl.STENCIL_BACK_PASS_DEPTH_FAIL = 0x8802;
gl.STENCIL_BACK_PASS_DEPTH_PASS = 0x8803;
gl.STENCIL_BACK_REF = 0x8ca3;
gl.STENCIL_BACK_VALUE_MASK = 0x8ca4;
gl.STENCIL_BACK_WRITEMASK = 0x8ca5;
gl.STENCIL_BITS = 0xd57;
gl.STENCIL_BUFFER_BIT = 0x400;
gl.STENCIL_BUFFER_BIT0_QCOM = 0x10000;
gl.STENCIL_BUFFER_BIT1_QCOM = 0x20000;
gl.STENCIL_BUFFER_BIT2_QCOM = 0x40000;
gl.STENCIL_BUFFER_BIT3_QCOM = 0x80000;
gl.STENCIL_BUFFER_BIT4_QCOM = 0x100000;
gl.STENCIL_BUFFER_BIT5_QCOM = 0x200000;
gl.STENCIL_BUFFER_BIT6_QCOM = 0x400000;
gl.STENCIL_BUFFER_BIT7_QCOM = 0x800000;
gl.STENCIL_CLEAR_VALUE = 0xb91;
gl.STENCIL_EXT = 0x1802;
gl.STENCIL_FAIL = 0xb94;
gl.STENCIL_FUNC = 0xb92;
gl.STENCIL_INDEX1_OES = 0x8d46;
gl.STENCIL_INDEX4_OES = 0x8d47;
gl.STENCIL_INDEX8 = 0x8d48;
gl.STENCIL_PASS_DEPTH_FAIL = 0xb95;
gl.STENCIL_PASS_DEPTH_PASS = 0xb96;
gl.STENCIL_REF = 0xb97;
gl.STENCIL_TEST = 0xb90;
gl.STENCIL_VALUE_MASK = 0xb93;
gl.STENCIL_WRITEMASK = 0xb98;
gl.STREAM_DRAW = 0x88e0;
gl.SUBPIXEL_BITS = 0xd50;
gl.SYNC_CONDITION_APPLE = 0x9113;
gl.SYNC_FENCE_APPLE = 0x9116;
gl.SYNC_FLAGS_APPLE = 0x9115;
gl.SYNC_FLUSH_COMMANDS_BIT_APPLE = 0x1;
gl.SYNC_GPU_COMMANDS_COMPLETE_APPLE = 0x9117;
gl.SYNC_OBJECT_APPLE = 0x8a53;
gl.SYNC_STATUS_APPLE = 0x9114;
gl.TEXTURE = 0x1702;
gl.TEXTURE0 = 0x84c0;
gl.TEXTURE1 = 0x84c1;
gl.TEXTURE10 = 0x84ca;
gl.TEXTURE11 = 0x84cb;
gl.TEXTURE12 = 0x84cc;
gl.TEXTURE13 = 0x84cd;
gl.TEXTURE14 = 0x84ce;
gl.TEXTURE15 = 0x84cf;
gl.TEXTURE16 = 0x84d0;
gl.TEXTURE17 = 0x84d1;
gl.TEXTURE18 = 0x84d2;
gl.TEXTURE19 = 0x84d3;
gl.TEXTURE2 = 0x84c2;
gl.TEXTURE20 = 0x84d4;
gl.TEXTURE21 = 0x84d5;
gl.TEXTURE22 = 0x84d6;
gl.TEXTURE23 = 0x84d7;
gl.TEXTURE24 = 0x84d8;
gl.TEXTURE25 = 0x84d9;
gl.TEXTURE26 = 0x84da;
gl.TEXTURE27 = 0x84db;
gl.TEXTURE28 = 0x84dc;
gl.TEXTURE29 = 0x84dd;
gl.TEXTURE3 = 0x84c3;
gl.TEXTURE30 = 0x84de;
gl.TEXTURE31 = 0x84df;
gl.TEXTURE4 = 0x84c4;
gl.TEXTURE5 = 0x84c5;
gl.TEXTURE6 = 0x84c6;
gl.TEXTURE7 = 0x84c7;
gl.TEXTURE8 = 0x84c8;
gl.TEXTURE9 = 0x84c9;
gl.TEXTURE_2D = 0xde1;
gl.TEXTURE_3D_OES = 0x806f;
gl.TEXTURE_BINDING_2D = 0x8069;
gl.TEXTURE_BINDING_3D_OES = 0x806a;
gl.TEXTURE_BINDING_CUBE_MAP = 0x8514;
gl.TEXTURE_BINDING_EXTERNAL_OES = 0x8d67;
gl.TEXTURE_BORDER_COLOR_NV = 0x1004;
gl.TEXTURE_COMPARE_FUNC_EXT = 0x884d;
gl.TEXTURE_COMPARE_MODE_EXT = 0x884c;
gl.TEXTURE_CUBE_MAP = 0x8513;
gl.TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516;
gl.TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518;
gl.TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851a;
gl.TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515;
gl.TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517;
gl.TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519;
gl.TEXTURE_DEPTH_QCOM = 0x8bd4;
gl.TEXTURE_EXTERNAL_OES = 0x8d65;
gl.TEXTURE_FORMAT_QCOM = 0x8bd6;
gl.TEXTURE_HEIGHT_QCOM = 0x8bd3;
gl.TEXTURE_IMAGE_VALID_QCOM = 0x8bd8;
gl.TEXTURE_IMMUTABLE_FORMAT_EXT = 0x912f;
gl.TEXTURE_INTERNAL_FORMAT_QCOM = 0x8bd5;
gl.TEXTURE_MAG_FILTER = 0x2800;
gl.TEXTURE_MAX_ANISOTROPY_EXT = 0x84fe;
gl.TEXTURE_MAX_LEVEL_APPLE = 0x813d;
gl.TEXTURE_MIN_FILTER = 0x2801;
gl.TEXTURE_NUM_LEVELS_QCOM = 0x8bd9;
gl.TEXTURE_OBJECT_VALID_QCOM = 0x8bdb;
gl.TEXTURE_SAMPLES_IMG = 0x9136;
gl.TEXTURE_TARGET_QCOM = 0x8bda;
gl.TEXTURE_TYPE_QCOM = 0x8bd7;
gl.TEXTURE_USAGE_ANGLE = 0x93a2;
gl.TEXTURE_WIDTH_QCOM = 0x8bd2;
gl.TEXTURE_WRAP_R_OES = 0x8072;
gl.TEXTURE_WRAP_S = 0x2802;
gl.TEXTURE_WRAP_T = 0x2803;
gl.TIMEOUT_EXPIRED_APPLE = 0x911b;
gl.TIMEOUT_IGNORED_APPLE = 0xffffffffffffffff;
gl.TRANSLATED_SHADER_SOURCE_LENGTH_ANGLE = 0x93a0;
gl.TRIANGLES = 0x4;
gl.TRIANGLE_FAN = 0x6;
gl.TRIANGLE_STRIP = 0x5;
gl.TRUE = 0x1;
gl.UNKNOWN_CONTEXT_RESET_EXT = 0x8255;
gl.UNPACK_ALIGNMENT = 0xcf5;
gl.UNPACK_ROW_LENGTH = 0xcf2;
gl.UNPACK_SKIP_PIXELS = 0xcf4;
gl.UNPACK_SKIP_ROWS = 0xcf3;
gl.UNSIGNALED_APPLE = 0x9118;
gl.UNSIGNED_BYTE = 0x1401;
gl.UNSIGNED_INT = 0x1405;
gl.UNSIGNED_INT64_AMD = 0x8bc2;
gl.UNSIGNED_INT_10_10_10_2_OES = 0x8df6;
gl.UNSIGNED_INT_24_8_OES = 0x84fa;
gl.UNSIGNED_INT_2_10_10_10_REV_EXT = 0x8368;
gl.UNSIGNED_NORMALIZED_EXT = 0x8c17;
gl.UNSIGNED_SHORT = 0x1403;
gl.UNSIGNED_SHORT_1_5_5_5_REV_EXT = 0x8366;
gl.UNSIGNED_SHORT_4_4_4_4 = 0x8033;
gl.UNSIGNED_SHORT_4_4_4_4_REV_EXT = 0x8365;
gl.UNSIGNED_SHORT_4_4_4_4_REV_IMG = 0x8365;
gl.UNSIGNED_SHORT_5_5_5_1 = 0x8034;
gl.UNSIGNED_SHORT_5_6_5 = 0x8363;
gl.UNSIGNED_SHORT_8_8_APPLE = 0x85ba;
gl.UNSIGNED_SHORT_8_8_REV_APPLE = 0x85bb;
gl.VALIDATE_STATUS = 0x8b83;
gl.VENDOR = 0x1f00;
gl.VERSION = 0x1f02;
gl.VERTEX_ARRAY_BINDING_OES = 0x85b5;
gl.VERTEX_ARRAY_OBJECT_EXT = 0x9154;
gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = 0x889f;
gl.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE = 0x88fe;
gl.VERTEX_ATTRIB_ARRAY_DIVISOR_NV = 0x88fe;
gl.VERTEX_ATTRIB_ARRAY_ENABLED = 0x8622;
gl.VERTEX_ATTRIB_ARRAY_NORMALIZED = 0x886a;
gl.VERTEX_ATTRIB_ARRAY_POINTER = 0x8645;
gl.VERTEX_ATTRIB_ARRAY_SIZE = 0x8623;
gl.VERTEX_ATTRIB_ARRAY_STRIDE = 0x8624;
gl.VERTEX_ATTRIB_ARRAY_TYPE = 0x8625;
gl.VERTEX_SHADER = 0x8b31;
gl.VERTEX_SHADER_BIT_EXT = 0x1;
gl.VIEWPORT = 0xba2;
gl.VIV_shader_binary = 0x1;
gl.WAIT_FAILED_APPLE = 0x911d;
gl.WRITEONLY_RENDERING_QCOM = 0x8823;
gl.WRITE_ONLY_OES = 0x88b9;
gl.Z400_BINARY_AMD = 0x8740;
gl.ZERO = 0x0;

gl.UNPACK_FLIP_Y_WEBGL = 0x9240;
gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = 0x9241;
gl.CONTEXT_LOST_WEBGL = 0x9242;
gl.UNPACK_COLORSPACE_CONVERSION_WEBGL = 0x9243;
gl.BROWSER_DEFAULT_WEBGL = 0x9244;

},{}],28:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * Copyright (c) 2014-2016 Chukong Technologies Inc.
 * Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Prepare JSB environment
window.cc = window.cc || {};
/**
 * @namespace jsb
 * @name jsb
 */
window.jsb = window.jsb || {};

/**
 * Common getter setter configuration function
 * @function
 * @param {Object}   proto      A class prototype or an object to config
 * @param {String}   prop       Property name
 * @param {function} getter     Getter function for the property
 * @param {function} setter     Setter function for the property
 */
cc.defineGetterSetter = function (proto, prop, getter, setter) {
    var desc = { enumerable: false, configurable: true };
    getter && (desc.get = getter);
    setter && (desc.set = setter);
    Object.defineProperty(proto, prop, desc);
};

/**
 * Create a new object and copy all properties in an exist object to the new object
 * @method clone
 * @param {Object|Array} obj - The source object
 * @return {Array|Object} The created object
 */
cc.clone = function (obj) {
    // Cloning is better if the new object is having the same prototype chain
    // as the copied obj (or otherwise, the cloned object is certainly going to
    // have a different hidden class). Play with C1/C2 of the
    // PerformanceVirtualMachineTests suite to see how this makes an impact
    // under extreme conditions.
    //
    // Object.create(Object.getPrototypeOf(obj)) doesn't work well because the
    // prototype lacks a link to the constructor (Carakan, V8) so the new
    // object wouldn't have the hidden class that's associated with the
    // constructor (also, for whatever reasons, utilizing
    // Object.create(Object.getPrototypeOf(obj)) + Object.defineProperty is even
    // slower than the original in V8). Therefore, we call the constructor, but
    // there is a big caveat - it is possible that the this.init() in the
    // constructor would throw with no argument. It is also possible that a
    // derived class forgets to set "constructor" on the prototype. We ignore
    // these possibities for and the ultimate solution is a standardized
    // Object.clone(<object>).
    var newObj = obj.constructor ? new obj.constructor() : {};

    // Assuming that the constuctor above initialized all properies on obj, the
    // following keyed assignments won't turn newObj into dictionary mode
    // becasue they're not *appending new properties* but *assigning existing
    // ones* (note that appending indexed properties is another story). See
    // CCClass.js for a link to the devils when the assumption fails.
    for (var key in obj) {
        var copy = obj[key];
        // Beware that typeof null == "object" !
        if ((typeof copy === "undefined" ? "undefined" : _typeof(copy)) === "object" && copy && !(copy instanceof _ccsg.Node) && (CC_JSB || !(copy instanceof HTMLElement))) {
            newObj[key] = cc.clone(copy);
        } else {
            newObj[key] = copy;
        }
    }
    return newObj;
};

var ClassManager = {
    id: 0 | Math.random() * 998,

    instanceId: 0 | Math.random() * 998,

    getNewID: function getNewID() {
        return this.id++;
    },

    getNewInstanceId: function getNewInstanceId() {
        return this.instanceId++;
    }
};
//
// 2) Using "extend" subclassing
// Simple JavaScript Inheritance By John Resig http://ejohn.org/
//
cc.Class = function () {};
cc.Class.extend = function (prop) {
    var _super = this.prototype,
        prototype = void 0,
        Class = void 0,
        classId = void 0,
        className = prop._className || "",
        name = void 0,
        desc = void 0;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    prototype = Object.create(_super);
    initializing = false;
    fnTest = /xyz/.test(function () {
        xyz;
    }) ? /\b_super\b/ : /.*/;

    // Copy the properties over onto the new prototype
    for (name in prop) {
        // Check if we're overwriting an existing function
        prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? function (name, fn) {
            return function () {
                var tmp = this._super;

                // Add a new ._super() method that is the same method
                // but on the super-class
                this._super = _super[name];

                // The method only need to be bound temporarily, so we
                // remove it when we're done executing
                var ret = fn.apply(this, arguments);
                this._super = tmp;

                return ret;
            };
        }(name, prop[name]) : prop[name];
    }

    Class = function Class() {
        if (!initializing) {
            this.__instanceId = ClassManager.getNewInstanceId();
            if (this.ctor) {
                switch (arguments.length) {
                    case 0:
                        this.ctor();break;
                    case 1:
                        this.ctor(arguments[0]);break;
                    case 2:
                        this.ctor(arguments[0], arguments[1]);break;
                    case 3:
                        this.ctor(arguments[0], arguments[1], arguments[2]);break;
                    case 4:
                        this.ctor(arguments[0], arguments[1], arguments[2], arguments[3]);break;
                    case 5:
                        this.ctor(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);break;
                    default:
                        this.ctor.apply(this, arguments);
                }
            }
        }
    };
    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = cc.Class.extend;

    classId = ClassManager.getNewID();
    ClassManager[classId] = _super;
    desc = { writable: true, enumerable: false, configurable: true };
    Class.id = classId;
    desc.value = classId;
    Object.defineProperty(prototype, '__pid', desc);

    return Class;
};

jsb.__obj_ref_id = 0;

jsb.registerNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var targetID = target.__jsb_ref_id;
        if (targetID === undefined) targetID = target.__jsb_ref_id = jsb.__obj_ref_id++;

        var refs = owner.__nativeRefs;
        if (!refs) {
            refs = owner.__nativeRefs = {};
        }

        refs[targetID] = target;
    }
};

jsb.unregisterNativeRef = function (owner, target) {
    if (owner && target && owner !== target) {
        var targetID = target.__jsb_ref_id;
        if (targetID === undefined) return;

        var refs = owner.__nativeRefs;
        if (!refs) {
            return;
        }

        delete refs[targetID];
    }
};

jsb.unregisterAllNativeRefs = function (owner) {
    if (!owner) return;
    delete owner.__nativeRefs;
};

jsb.unregisterChildRefsForNode = function (node, recursive) {
    if (!(node instanceof cc.Node)) return;
    recursive = !!recursive;
    var children = node.getChildren(),
        i = void 0,
        l = void 0,
        child = void 0;
    for (i = 0, l = children.length; i < l; ++i) {
        child = children[i];
        jsb.unregisterNativeRef(node, child);
        if (recursive) {
            jsb.unregisterChildRefsForNode(child, recursive);
        }
    }
};

},{}],29:[function(require,module,exports){
'use strict';

function DOMParser(options) {
	this.options = options || { locator: {} };
}

DOMParser.prototype.parseFromString = function (source, mimeType) {
	var options = this.options;
	var sax = new XMLReader();
	var domBuilder = options.domBuilder || new DOMHandler(); //contentHandler and LexicalHandler
	var errorHandler = options.errorHandler;
	var locator = options.locator;
	var defaultNSMap = options.xmlns || {};
	var isHTML = /\/x?html?$/.test(mimeType); //mimeType.toLowerCase().indexOf('html') > -1;
	var entityMap = isHTML ? htmlEntity.entityMap : { 'lt': '<', 'gt': '>', 'amp': '&', 'quot': '"', 'apos': "'" };
	if (locator) {
		domBuilder.setDocumentLocator(locator);
	}

	sax.errorHandler = buildErrorHandler(errorHandler, domBuilder, locator);
	sax.domBuilder = options.domBuilder || domBuilder;
	if (isHTML) {
		defaultNSMap[''] = 'http://www.w3.org/1999/xhtml';
	}
	defaultNSMap.xml = defaultNSMap.xml || 'http://www.w3.org/XML/1998/namespace';
	if (source) {
		sax.parse(source, defaultNSMap, entityMap);
	} else {
		sax.errorHandler.error("invalid doc source");
	}
	return domBuilder.doc;
};
function buildErrorHandler(errorImpl, domBuilder, locator) {
	if (!errorImpl) {
		if (domBuilder instanceof DOMHandler) {
			return domBuilder;
		}
		errorImpl = domBuilder;
	}
	var errorHandler = {};
	var isCallback = errorImpl instanceof Function;
	locator = locator || {};
	function build(key) {
		var fn = errorImpl[key];
		if (!fn && isCallback) {
			fn = errorImpl.length == 2 ? function (msg) {
				errorImpl(key, msg);
			} : errorImpl;
		}
		errorHandler[key] = fn && function (msg) {
			fn('[xmldom ' + key + ']\t' + msg + _locator(locator));
		} || function () {};
	}
	build('warning');
	build('error');
	build('fatalError');
	return errorHandler;
}

//console.log('#\n\n\n\n\n\n\n####')
/**
 * +ContentHandler+ErrorHandler
 * +LexicalHandler+EntityResolver2
 * -DeclHandler-DTDHandler 
 * 
 * DefaultHandler:EntityResolver, DTDHandler, ContentHandler, ErrorHandler
 * DefaultHandler2:DefaultHandler,LexicalHandler, DeclHandler, EntityResolver2
 * @link http://www.saxproject.org/apidoc/org/xml/sax/helpers/DefaultHandler.html
 */
function DOMHandler() {
	this.cdata = false;
}
function position(locator, node) {
	node.lineNumber = locator.lineNumber;
	node.columnNumber = locator.columnNumber;
}
/**
 * @see org.xml.sax.ContentHandler#startDocument
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ContentHandler.html
 */
DOMHandler.prototype = {
	startDocument: function startDocument() {
		this.doc = new DOMImplementation().createDocument(null, null, null);
		if (this.locator) {
			this.doc.documentURI = this.locator.systemId;
		}
	},
	startElement: function startElement(namespaceURI, localName, qName, attrs) {
		var doc = this.doc;
		var el = doc.createElementNS(namespaceURI, qName || localName);
		var len = attrs.length;
		appendElement(this, el);
		this.currentElement = el;

		this.locator && position(this.locator, el);
		for (var i = 0; i < len; i++) {
			var namespaceURI = attrs.getURI(i);
			var value = attrs.getValue(i);
			var qName = attrs.getQName(i);
			var attr = doc.createAttributeNS(namespaceURI, qName);
			this.locator && position(attrs.getLocator(i), attr);
			attr.value = attr.nodeValue = value;
			el.setAttributeNode(attr);
		}
	},
	endElement: function endElement(namespaceURI, localName, qName) {
		var current = this.currentElement;
		var tagName = current.tagName;
		this.currentElement = current.parentNode;
	},
	startPrefixMapping: function startPrefixMapping(prefix, uri) {},
	endPrefixMapping: function endPrefixMapping(prefix) {},
	processingInstruction: function processingInstruction(target, data) {
		var ins = this.doc.createProcessingInstruction(target, data);
		this.locator && position(this.locator, ins);
		appendElement(this, ins);
	},
	ignorableWhitespace: function ignorableWhitespace(ch, start, length) {},
	characters: function characters(chars, start, length) {
		chars = _toString.apply(this, arguments);
		//console.log(chars)
		if (chars) {
			if (this.cdata) {
				var charNode = this.doc.createCDATASection(chars);
			} else {
				var charNode = this.doc.createTextNode(chars);
			}
			if (this.currentElement) {
				this.currentElement.appendChild(charNode);
			} else if (/^\s*$/.test(chars)) {
				this.doc.appendChild(charNode);
				//process xml
			}
			this.locator && position(this.locator, charNode);
		}
	},
	skippedEntity: function skippedEntity(name) {},
	endDocument: function endDocument() {
		this.doc.normalize();
	},
	setDocumentLocator: function setDocumentLocator(locator) {
		if (this.locator = locator) {
			// && !('lineNumber' in locator)){
			locator.lineNumber = 0;
		}
	},
	//LexicalHandler
	comment: function comment(chars, start, length) {
		chars = _toString.apply(this, arguments);
		var comm = this.doc.createComment(chars);
		this.locator && position(this.locator, comm);
		appendElement(this, comm);
	},

	startCDATA: function startCDATA() {
		//used in characters() methods
		this.cdata = true;
	},
	endCDATA: function endCDATA() {
		this.cdata = false;
	},

	startDTD: function startDTD(name, publicId, systemId) {
		var impl = this.doc.implementation;
		if (impl && impl.createDocumentType) {
			var dt = impl.createDocumentType(name, publicId, systemId);
			this.locator && position(this.locator, dt);
			appendElement(this, dt);
		}
	},
	/**
  * @see org.xml.sax.ErrorHandler
  * @link http://www.saxproject.org/apidoc/org/xml/sax/ErrorHandler.html
  */
	warning: function warning(error) {
		console.warn('[xmldom warning]\t' + error, _locator(this.locator));
	},
	error: function error(_error) {
		console.error('[xmldom error]\t' + _error, _locator(this.locator));
	},
	fatalError: function fatalError(error) {
		console.error('[xmldom fatalError]\t' + error, _locator(this.locator));
		throw error;
	}
};
function _locator(l) {
	if (l) {
		return '\n@' + (l.systemId || '') + '#[line:' + l.lineNumber + ',col:' + l.columnNumber + ']';
	}
}
function _toString(chars, start, length) {
	if (typeof chars == 'string') {
		return chars.substr(start, length);
	} else {
		//java sax connect width xmldom on rhino(what about: "? && !(chars instanceof String)")
		if (chars.length >= start + length || start) {
			return new java.lang.String(chars, start, length) + '';
		}
		return chars;
	}
}

/*
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/LexicalHandler.html
 * used method of org.xml.sax.ext.LexicalHandler:
 *  #comment(chars, start, length)
 *  #startCDATA()
 *  #endCDATA()
 *  #startDTD(name, publicId, systemId)
 *
 *
 * IGNORED method of org.xml.sax.ext.LexicalHandler:
 *  #endDTD()
 *  #startEntity(name)
 *  #endEntity(name)
 *
 *
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/DeclHandler.html
 * IGNORED method of org.xml.sax.ext.DeclHandler
 * 	#attributeDecl(eName, aName, type, mode, value)
 *  #elementDecl(name, model)
 *  #externalEntityDecl(name, publicId, systemId)
 *  #internalEntityDecl(name, value)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/ext/EntityResolver2.html
 * IGNORED method of org.xml.sax.EntityResolver2
 *  #resolveEntity(String name,String publicId,String baseURI,String systemId)
 *  #resolveEntity(publicId, systemId)
 *  #getExternalSubset(name, baseURI)
 * @link http://www.saxproject.org/apidoc/org/xml/sax/DTDHandler.html
 * IGNORED method of org.xml.sax.DTDHandler
 *  #notationDecl(name, publicId, systemId) {};
 *  #unparsedEntityDecl(name, publicId, systemId, notationName) {};
 */
"endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (key) {
	DOMHandler.prototype[key] = function () {
		return null;
	};
});

/* Private static helpers treated below as private instance methods, so don't need to add these to the public API; we might use a Relator to also get rid of non-standard public properties */
function appendElement(hander, node) {
	if (!hander.currentElement) {
		hander.doc.appendChild(node);
	} else {
		hander.currentElement.appendChild(node);
	}
} //appendChild and setAttributeNS are preformance key

//if(typeof require == 'function'){
var htmlEntity = require('./entities');
var XMLReader = require('./sax').XMLReader;
var DOMImplementation = exports.DOMImplementation = require('./dom').DOMImplementation;
exports.XMLSerializer = require('./dom').XMLSerializer;
exports.DOMParser = DOMParser;
//}

},{"./dom":30,"./entities":31,"./sax":32}],30:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * DOM Level 2
 * Object DOMException
 * @see http://www.w3.org/TR/REC-DOM-Level-1/ecma-script-language-binding.html
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/ecma-script-binding.html
 */

function copy(src, dest) {
	for (var p in src) {
		dest[p] = src[p];
	}
}
/**
^\w+\.prototype\.([_\w]+)\s*=\s*((?:.*\{\s*?[\r\n][\s\S]*?^})|\S.*?(?=[;\r\n]));?
^\w+\.prototype\.([_\w]+)\s*=\s*(\S.*?(?=[;\r\n]));?
 */
function _extends(Class, Super) {
	var pt = Class.prototype;
	if (!(pt instanceof Super)) {
		var t = function t() {};

		;
		t.prototype = Super.prototype;
		t = new t();
		copy(pt, t);
		Class.prototype = pt = t;
	}
	if (pt.constructor != Class) {
		if (typeof Class != 'function') {
			console.error("unknow Class:" + Class);
		}
		pt.constructor = Class;
	}
}
var htmlns = 'http://www.w3.org/1999/xhtml';
// Node Types
var NodeType = {};
var ELEMENT_NODE = NodeType.ELEMENT_NODE = 1;
var ATTRIBUTE_NODE = NodeType.ATTRIBUTE_NODE = 2;
var TEXT_NODE = NodeType.TEXT_NODE = 3;
var CDATA_SECTION_NODE = NodeType.CDATA_SECTION_NODE = 4;
var ENTITY_REFERENCE_NODE = NodeType.ENTITY_REFERENCE_NODE = 5;
var ENTITY_NODE = NodeType.ENTITY_NODE = 6;
var PROCESSING_INSTRUCTION_NODE = NodeType.PROCESSING_INSTRUCTION_NODE = 7;
var COMMENT_NODE = NodeType.COMMENT_NODE = 8;
var DOCUMENT_NODE = NodeType.DOCUMENT_NODE = 9;
var DOCUMENT_TYPE_NODE = NodeType.DOCUMENT_TYPE_NODE = 10;
var DOCUMENT_FRAGMENT_NODE = NodeType.DOCUMENT_FRAGMENT_NODE = 11;
var NOTATION_NODE = NodeType.NOTATION_NODE = 12;

// ExceptionCode
var ExceptionCode = {};
var ExceptionMessage = {};
var INDEX_SIZE_ERR = ExceptionCode.INDEX_SIZE_ERR = (ExceptionMessage[1] = "Index size error", 1);
var DOMSTRING_SIZE_ERR = ExceptionCode.DOMSTRING_SIZE_ERR = (ExceptionMessage[2] = "DOMString size error", 2);
var HIERARCHY_REQUEST_ERR = ExceptionCode.HIERARCHY_REQUEST_ERR = (ExceptionMessage[3] = "Hierarchy request error", 3);
var WRONG_DOCUMENT_ERR = ExceptionCode.WRONG_DOCUMENT_ERR = (ExceptionMessage[4] = "Wrong document", 4);
var INVALID_CHARACTER_ERR = ExceptionCode.INVALID_CHARACTER_ERR = (ExceptionMessage[5] = "Invalid character", 5);
var NO_DATA_ALLOWED_ERR = ExceptionCode.NO_DATA_ALLOWED_ERR = (ExceptionMessage[6] = "No data allowed", 6);
var NO_MODIFICATION_ALLOWED_ERR = ExceptionCode.NO_MODIFICATION_ALLOWED_ERR = (ExceptionMessage[7] = "No modification allowed", 7);
var NOT_FOUND_ERR = ExceptionCode.NOT_FOUND_ERR = (ExceptionMessage[8] = "Not found", 8);
var NOT_SUPPORTED_ERR = ExceptionCode.NOT_SUPPORTED_ERR = (ExceptionMessage[9] = "Not supported", 9);
var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10);
//level2
var INVALID_STATE_ERR = ExceptionCode.INVALID_STATE_ERR = (ExceptionMessage[11] = "Invalid state", 11);
var SYNTAX_ERR = ExceptionCode.SYNTAX_ERR = (ExceptionMessage[12] = "Syntax error", 12);
var INVALID_MODIFICATION_ERR = ExceptionCode.INVALID_MODIFICATION_ERR = (ExceptionMessage[13] = "Invalid modification", 13);
var NAMESPACE_ERR = ExceptionCode.NAMESPACE_ERR = (ExceptionMessage[14] = "Invalid namespace", 14);
var INVALID_ACCESS_ERR = ExceptionCode.INVALID_ACCESS_ERR = (ExceptionMessage[15] = "Invalid access", 15);

function DOMException(code, message) {
	if (message instanceof Error) {
		var error = message;
	} else {
		error = this;
		Error.call(this, ExceptionMessage[code]);
		this.message = ExceptionMessage[code];
		if (Error.captureStackTrace) Error.captureStackTrace(this, DOMException);
	}
	error.code = code;
	if (message) this.message = this.message + ": " + message;
	return error;
};
DOMException.prototype = Error.prototype;
copy(ExceptionCode, DOMException);
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */
function NodeList() {};
NodeList.prototype = {
	/**
  * The number of nodes in the list. The range of valid child node indices is 0 to length-1 inclusive.
  * @standard level1
  */
	length: 0,
	/**
  * Returns the indexth item in the collection. If index is greater than or equal to the number of nodes in the list, this returns null.
  * @standard level1
  * @param index  unsigned long 
  *   Index into the collection.
  * @return Node
  * 	The node at the indexth position in the NodeList, or null if that is not a valid index. 
  */
	item: function item(index) {
		return this[index] || null;
	},
	toString: function toString(isHTML, nodeFilter) {
		for (var buf = [], i = 0; i < this.length; i++) {
			serializeToString(this[i], buf, isHTML, nodeFilter);
		}
		return buf.join('');
	}
};
function LiveNodeList(node, refresh) {
	this._node = node;
	this._refresh = refresh;
	_updateLiveList(this);
}
function _updateLiveList(list) {
	var inc = list._node._inc || list._node.ownerDocument._inc;
	if (list._inc != inc) {
		var ls = list._refresh(list._node);
		//console.log(ls.length)
		__set__(list, 'length', ls.length);
		copy(ls, list);
		list._inc = inc;
	}
}
LiveNodeList.prototype.item = function (i) {
	_updateLiveList(this);
	return this[i];
};

_extends(LiveNodeList, NodeList);
/**
 * 
 * Objects implementing the NamedNodeMap interface are used to represent collections of nodes that can be accessed by name. Note that NamedNodeMap does not inherit from NodeList; NamedNodeMaps are not maintained in any particular order. Objects contained in an object implementing NamedNodeMap may also be accessed by an ordinal index, but this is simply to allow convenient enumeration of the contents of a NamedNodeMap, and does not imply that the DOM specifies an order to these Nodes.
 * NamedNodeMap objects in the DOM are live.
 * used for attributes or DocumentType entities 
 */
function NamedNodeMap() {};

function _findNodeIndex(list, node) {
	var i = list.length;
	while (i--) {
		if (list[i] === node) {
			return i;
		}
	}
}

function _addNamedNode(el, list, newAttr, oldAttr) {
	if (oldAttr) {
		list[_findNodeIndex(list, oldAttr)] = newAttr;
	} else {
		list[list.length++] = newAttr;
	}
	if (el) {
		newAttr.ownerElement = el;
		var doc = el.ownerDocument;
		if (doc) {
			oldAttr && _onRemoveAttribute(doc, el, oldAttr);
			_onAddAttribute(doc, el, newAttr);
		}
	}
}
function _removeNamedNode(el, list, attr) {
	//console.log('remove attr:'+attr)
	var i = _findNodeIndex(list, attr);
	if (i >= 0) {
		var lastIndex = list.length - 1;
		while (i < lastIndex) {
			list[i] = list[++i];
		}
		list.length = lastIndex;
		if (el) {
			var doc = el.ownerDocument;
			if (doc) {
				_onRemoveAttribute(doc, el, attr);
				attr.ownerElement = null;
			}
		}
	} else {
		throw DOMException(NOT_FOUND_ERR, new Error(el.tagName + '@' + attr));
	}
}
NamedNodeMap.prototype = {
	length: 0,
	item: NodeList.prototype.item,
	getNamedItem: function getNamedItem(key) {
		//		if(key.indexOf(':')>0 || key == 'xmlns'){
		//			return null;
		//		}
		//console.log()
		var i = this.length;
		while (i--) {
			var attr = this[i];
			//console.log(attr.nodeName,key)
			if (attr.nodeName == key) {
				return attr;
			}
		}
	},
	setNamedItem: function setNamedItem(attr) {
		var el = attr.ownerElement;
		if (el && el != this._ownerElement) {
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		var oldAttr = this.getNamedItem(attr.nodeName);
		_addNamedNode(this._ownerElement, this, attr, oldAttr);
		return oldAttr;
	},
	/* returns Node */
	setNamedItemNS: function setNamedItemNS(attr) {
		// raises: WRONG_DOCUMENT_ERR,NO_MODIFICATION_ALLOWED_ERR,INUSE_ATTRIBUTE_ERR
		var el = attr.ownerElement,
		    oldAttr;
		if (el && el != this._ownerElement) {
			throw new DOMException(INUSE_ATTRIBUTE_ERR);
		}
		oldAttr = this.getNamedItemNS(attr.namespaceURI, attr.localName);
		_addNamedNode(this._ownerElement, this, attr, oldAttr);
		return oldAttr;
	},

	/* returns Node */
	removeNamedItem: function removeNamedItem(key) {
		var attr = this.getNamedItem(key);
		_removeNamedNode(this._ownerElement, this, attr);
		return attr;
	}, // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR

	//for level2
	removeNamedItemNS: function removeNamedItemNS(namespaceURI, localName) {
		var attr = this.getNamedItemNS(namespaceURI, localName);
		_removeNamedNode(this._ownerElement, this, attr);
		return attr;
	},
	getNamedItemNS: function getNamedItemNS(namespaceURI, localName) {
		var i = this.length;
		while (i--) {
			var node = this[i];
			if (node.localName == localName && node.namespaceURI == namespaceURI) {
				return node;
			}
		}
		return null;
	}
};
/**
 * @see http://www.w3.org/TR/REC-DOM-Level-1/level-one-core.html#ID-102161490
 */
function DOMImplementation( /* Object */features) {
	this._features = {};
	if (features) {
		for (var feature in features) {
			this._features = features[feature];
		}
	}
};

DOMImplementation.prototype = {
	hasFeature: function hasFeature( /* string */feature, /* string */version) {
		var versions = this._features[feature.toLowerCase()];
		if (versions && (!version || version in versions)) {
			return true;
		} else {
			return false;
		}
	},
	// Introduced in DOM Level 2:
	createDocument: function createDocument(namespaceURI, qualifiedName, doctype) {
		// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR,WRONG_DOCUMENT_ERR
		var doc = new Document();
		doc.implementation = this;
		doc.childNodes = new NodeList();
		doc.doctype = doctype;
		if (doctype) {
			doc.appendChild(doctype);
		}
		if (qualifiedName) {
			var root = doc.createElementNS(namespaceURI, qualifiedName);
			doc.appendChild(root);
		}
		return doc;
	},
	// Introduced in DOM Level 2:
	createDocumentType: function createDocumentType(qualifiedName, publicId, systemId) {
		// raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
		var node = new DocumentType();
		node.name = qualifiedName;
		node.nodeName = qualifiedName;
		node.publicId = publicId;
		node.systemId = systemId;
		// Introduced in DOM Level 2:
		//readonly attribute DOMString        internalSubset;

		//TODO:..
		//  readonly attribute NamedNodeMap     entities;
		//  readonly attribute NamedNodeMap     notations;
		return node;
	}
};

/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {};

Node.prototype = {
	firstChild: null,
	lastChild: null,
	previousSibling: null,
	nextSibling: null,
	attributes: null,
	parentNode: null,
	childNodes: null,
	ownerDocument: null,
	nodeValue: null,
	namespaceURI: null,
	prefix: null,
	localName: null,
	// Modified in DOM Level 2:
	insertBefore: function insertBefore(newChild, refChild) {
		//raises 
		return _insertBefore(this, newChild, refChild);
	},
	replaceChild: function replaceChild(newChild, oldChild) {
		//raises 
		this.insertBefore(newChild, oldChild);
		if (oldChild) {
			this.removeChild(oldChild);
		}
	},
	removeChild: function removeChild(oldChild) {
		return _removeChild(this, oldChild);
	},
	appendChild: function appendChild(newChild) {
		return this.insertBefore(newChild, null);
	},
	hasChildNodes: function hasChildNodes() {
		return this.firstChild != null;
	},
	cloneNode: function cloneNode(deep) {
		return _cloneNode(this.ownerDocument || this, this, deep);
	},
	// Modified in DOM Level 2:
	normalize: function normalize() {
		var child = this.firstChild;
		while (child) {
			var next = child.nextSibling;
			if (next && next.nodeType == TEXT_NODE && child.nodeType == TEXT_NODE) {
				this.removeChild(next);
				child.appendData(next.data);
			} else {
				child.normalize();
				child = next;
			}
		}
	},
	// Introduced in DOM Level 2:
	isSupported: function isSupported(feature, version) {
		return this.ownerDocument.implementation.hasFeature(feature, version);
	},
	// Introduced in DOM Level 2:
	hasAttributes: function hasAttributes() {
		return this.attributes.length > 0;
	},
	lookupPrefix: function lookupPrefix(namespaceURI) {
		var el = this;
		while (el) {
			var map = el._nsMap;
			//console.dir(map)
			if (map) {
				for (var n in map) {
					if (map[n] == namespaceURI) {
						return n;
					}
				}
			}
			el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
		}
		return null;
	},
	// Introduced in DOM Level 3:
	lookupNamespaceURI: function lookupNamespaceURI(prefix) {
		var el = this;
		while (el) {
			var map = el._nsMap;
			//console.dir(map)
			if (map) {
				if (prefix in map) {
					return map[prefix];
				}
			}
			el = el.nodeType == ATTRIBUTE_NODE ? el.ownerDocument : el.parentNode;
		}
		return null;
	},
	// Introduced in DOM Level 3:
	isDefaultNamespace: function isDefaultNamespace(namespaceURI) {
		var prefix = this.lookupPrefix(namespaceURI);
		return prefix == null;
	}
};

function _xmlEncoder(c) {
	return c == '<' && '&lt;' || c == '>' && '&gt;' || c == '&' && '&amp;' || c == '"' && '&quot;' || '&#' + c.charCodeAt() + ';';
}

copy(NodeType, Node);
copy(NodeType, Node.prototype);

/**
 * @param callback return true for continue,false for break
 * @return boolean true: break visit;
 */
function _visitNode(node, callback) {
	if (callback(node)) {
		return true;
	}
	if (node = node.firstChild) {
		do {
			if (_visitNode(node, callback)) {
				return true;
			}
		} while (node = node.nextSibling);
	}
}

function Document() {}
function _onAddAttribute(doc, el, newAttr) {
	doc && doc._inc++;
	var ns = newAttr.namespaceURI;
	if (ns == 'http://www.w3.org/2000/xmlns/') {
		//update namespace
		el._nsMap[newAttr.prefix ? newAttr.localName : ''] = newAttr.value;
	}
}
function _onRemoveAttribute(doc, el, newAttr, remove) {
	doc && doc._inc++;
	var ns = newAttr.namespaceURI;
	if (ns == 'http://www.w3.org/2000/xmlns/') {
		//update namespace
		delete el._nsMap[newAttr.prefix ? newAttr.localName : ''];
	}
}
function _onUpdateChild(doc, el, newChild) {
	if (doc && doc._inc) {
		doc._inc++;
		//update childNodes
		var cs = el.childNodes;
		if (newChild) {
			cs[cs.length++] = newChild;
		} else {
			//console.log(1)
			var child = el.firstChild;
			var i = 0;
			while (child) {
				cs[i++] = child;
				child = child.nextSibling;
			}
			cs.length = i;
		}
	}
}

/**
 * attributes;
 * children;
 * 
 * writeable properties:
 * nodeValue,Attr:value,CharacterData:data
 * prefix
 */
function _removeChild(parentNode, child) {
	var previous = child.previousSibling;
	var next = child.nextSibling;
	if (previous) {
		previous.nextSibling = next;
	} else {
		parentNode.firstChild = next;
	}
	if (next) {
		next.previousSibling = previous;
	} else {
		parentNode.lastChild = previous;
	}
	_onUpdateChild(parentNode.ownerDocument, parentNode);
	return child;
}
/**
 * preformance key(refChild == null)
 */
function _insertBefore(parentNode, newChild, nextChild) {
	var cp = newChild.parentNode;
	if (cp) {
		cp.removeChild(newChild); //remove and update
	}
	if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
		var newFirst = newChild.firstChild;
		if (newFirst == null) {
			return newChild;
		}
		var newLast = newChild.lastChild;
	} else {
		newFirst = newLast = newChild;
	}
	var pre = nextChild ? nextChild.previousSibling : parentNode.lastChild;

	newFirst.previousSibling = pre;
	newLast.nextSibling = nextChild;

	if (pre) {
		pre.nextSibling = newFirst;
	} else {
		parentNode.firstChild = newFirst;
	}
	if (nextChild == null) {
		parentNode.lastChild = newLast;
	} else {
		nextChild.previousSibling = newLast;
	}
	do {
		newFirst.parentNode = parentNode;
	} while (newFirst !== newLast && (newFirst = newFirst.nextSibling));
	_onUpdateChild(parentNode.ownerDocument || parentNode, parentNode);
	//console.log(parentNode.lastChild.nextSibling == null)
	if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
		newChild.firstChild = newChild.lastChild = null;
	}
	return newChild;
}
function _appendSingleChild(parentNode, newChild) {
	var cp = newChild.parentNode;
	if (cp) {
		var pre = parentNode.lastChild;
		cp.removeChild(newChild); //remove and update
		var pre = parentNode.lastChild;
	}
	var pre = parentNode.lastChild;
	newChild.parentNode = parentNode;
	newChild.previousSibling = pre;
	newChild.nextSibling = null;
	if (pre) {
		pre.nextSibling = newChild;
	} else {
		parentNode.firstChild = newChild;
	}
	parentNode.lastChild = newChild;
	_onUpdateChild(parentNode.ownerDocument, parentNode, newChild);
	return newChild;
	//console.log("__aa",parentNode.lastChild.nextSibling == null)
}
Document.prototype = {
	//implementation : null,
	nodeName: '#document',
	nodeType: DOCUMENT_NODE,
	doctype: null,
	documentElement: null,
	_inc: 1,

	insertBefore: function insertBefore(newChild, refChild) {
		//raises 
		if (newChild.nodeType == DOCUMENT_FRAGMENT_NODE) {
			var child = newChild.firstChild;
			while (child) {
				var next = child.nextSibling;
				this.insertBefore(child, refChild);
				child = next;
			}
			return newChild;
		}
		if (this.documentElement == null && newChild.nodeType == ELEMENT_NODE) {
			this.documentElement = newChild;
		}

		return _insertBefore(this, newChild, refChild), newChild.ownerDocument = this, newChild;
	},
	removeChild: function removeChild(oldChild) {
		if (this.documentElement == oldChild) {
			this.documentElement = null;
		}
		return _removeChild(this, oldChild);
	},
	// Introduced in DOM Level 2:
	importNode: function importNode(importedNode, deep) {
		return _importNode(this, importedNode, deep);
	},
	// Introduced in DOM Level 2:
	getElementById: function getElementById(id) {
		var rtv = null;
		_visitNode(this.documentElement, function (node) {
			if (node.nodeType == ELEMENT_NODE) {
				if (node.getAttribute('id') == id) {
					rtv = node;
					return true;
				}
			}
		});
		return rtv;
	},

	//document factory method:
	createElement: function createElement(tagName) {
		var node = new Element();
		node.ownerDocument = this;
		node.nodeName = tagName;
		node.tagName = tagName;
		node.childNodes = new NodeList();
		var attrs = node.attributes = new NamedNodeMap();
		attrs._ownerElement = node;
		return node;
	},
	createDocumentFragment: function createDocumentFragment() {
		var node = new DocumentFragment();
		node.ownerDocument = this;
		node.childNodes = new NodeList();
		return node;
	},
	createTextNode: function createTextNode(data) {
		var node = new Text();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createComment: function createComment(data) {
		var node = new Comment();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createCDATASection: function createCDATASection(data) {
		var node = new CDATASection();
		node.ownerDocument = this;
		node.appendData(data);
		return node;
	},
	createProcessingInstruction: function createProcessingInstruction(target, data) {
		var node = new ProcessingInstruction();
		node.ownerDocument = this;
		node.tagName = node.target = target;
		node.nodeValue = node.data = data;
		return node;
	},
	createAttribute: function createAttribute(name) {
		var node = new Attr();
		node.ownerDocument = this;
		node.name = name;
		node.nodeName = name;
		node.localName = name;
		node.specified = true;
		return node;
	},
	createEntityReference: function createEntityReference(name) {
		var node = new EntityReference();
		node.ownerDocument = this;
		node.nodeName = name;
		return node;
	},
	// Introduced in DOM Level 2:
	createElementNS: function createElementNS(namespaceURI, qualifiedName) {
		var node = new Element();
		var pl = qualifiedName.split(':');
		var attrs = node.attributes = new NamedNodeMap();
		node.childNodes = new NodeList();
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.tagName = qualifiedName;
		node.namespaceURI = namespaceURI;
		if (pl.length == 2) {
			node.prefix = pl[0];
			node.localName = pl[1];
		} else {
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		attrs._ownerElement = node;
		return node;
	},
	// Introduced in DOM Level 2:
	createAttributeNS: function createAttributeNS(namespaceURI, qualifiedName) {
		var node = new Attr();
		var pl = qualifiedName.split(':');
		node.ownerDocument = this;
		node.nodeName = qualifiedName;
		node.name = qualifiedName;
		node.namespaceURI = namespaceURI;
		node.specified = true;
		if (pl.length == 2) {
			node.prefix = pl[0];
			node.localName = pl[1];
		} else {
			//el.prefix = null;
			node.localName = qualifiedName;
		}
		return node;
	}
};
_extends(Document, Node);

function Element() {
	this._nsMap = {};
};
Element.prototype = {
	nodeType: ELEMENT_NODE,
	hasAttribute: function hasAttribute(name) {
		return this.getAttributeNode(name) != null;
	},
	getAttribute: function getAttribute(name) {
		var attr = this.getAttributeNode(name);
		return attr && attr.value || '';
	},
	getAttributeNode: function getAttributeNode(name) {
		return this.attributes.getNamedItem(name);
	},
	setAttribute: function setAttribute(name, value) {
		var attr = this.ownerDocument.createAttribute(name);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr);
	},
	removeAttribute: function removeAttribute(name) {
		var attr = this.getAttributeNode(name);
		attr && this.removeAttributeNode(attr);
	},

	//four real opeartion method
	appendChild: function appendChild(newChild) {
		if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
			return this.insertBefore(newChild, null);
		} else {
			return _appendSingleChild(this, newChild);
		}
	},
	setAttributeNode: function setAttributeNode(newAttr) {
		return this.attributes.setNamedItem(newAttr);
	},
	setAttributeNodeNS: function setAttributeNodeNS(newAttr) {
		return this.attributes.setNamedItemNS(newAttr);
	},
	removeAttributeNode: function removeAttributeNode(oldAttr) {
		//console.log(this == oldAttr.ownerElement)
		return this.attributes.removeNamedItem(oldAttr.nodeName);
	},
	//get real attribute name,and remove it by removeAttributeNode
	removeAttributeNS: function removeAttributeNS(namespaceURI, localName) {
		var old = this.getAttributeNodeNS(namespaceURI, localName);
		old && this.removeAttributeNode(old);
	},

	hasAttributeNS: function hasAttributeNS(namespaceURI, localName) {
		return this.getAttributeNodeNS(namespaceURI, localName) != null;
	},
	getAttributeNS: function getAttributeNS(namespaceURI, localName) {
		var attr = this.getAttributeNodeNS(namespaceURI, localName);
		return attr && attr.value || '';
	},
	setAttributeNS: function setAttributeNS(namespaceURI, qualifiedName, value) {
		var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
		attr.value = attr.nodeValue = "" + value;
		this.setAttributeNode(attr);
	},
	getAttributeNodeNS: function getAttributeNodeNS(namespaceURI, localName) {
		return this.attributes.getNamedItemNS(namespaceURI, localName);
	},

	getElementsByTagName: function getElementsByTagName(tagName) {
		return new LiveNodeList(this, function (base) {
			var ls = [];
			_visitNode(base, function (node) {
				if (node !== base && node.nodeType == ELEMENT_NODE && (tagName === '*' || node.tagName == tagName)) {
					ls.push(node);
				}
			});
			return ls;
		});
	},
	getElementsByTagNameNS: function getElementsByTagNameNS(namespaceURI, localName) {
		return new LiveNodeList(this, function (base) {
			var ls = [];
			_visitNode(base, function (node) {
				if (node !== base && node.nodeType === ELEMENT_NODE && (namespaceURI === '*' || node.namespaceURI === namespaceURI) && (localName === '*' || node.localName == localName)) {
					ls.push(node);
				}
			});
			return ls;
		});
	}
};
Document.prototype.getElementsByTagName = Element.prototype.getElementsByTagName;
Document.prototype.getElementsByTagNameNS = Element.prototype.getElementsByTagNameNS;

_extends(Element, Node);
function Attr() {};
Attr.prototype.nodeType = ATTRIBUTE_NODE;
_extends(Attr, Node);

function CharacterData() {};
CharacterData.prototype = {
	data: '',
	substringData: function substringData(offset, count) {
		return this.data.substring(offset, offset + count);
	},
	appendData: function appendData(text) {
		text = this.data + text;
		this.nodeValue = this.data = text;
		this.length = text.length;
	},
	insertData: function insertData(offset, text) {
		this.replaceData(offset, 0, text);
	},
	appendChild: function appendChild(newChild) {
		throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
	},
	deleteData: function deleteData(offset, count) {
		this.replaceData(offset, count, "");
	},
	replaceData: function replaceData(offset, count, text) {
		var start = this.data.substring(0, offset);
		var end = this.data.substring(offset + count);
		text = start + text + end;
		this.nodeValue = this.data = text;
		this.length = text.length;
	}
};
_extends(CharacterData, Node);
function Text() {};
Text.prototype = {
	nodeName: "#text",
	nodeType: TEXT_NODE,
	splitText: function splitText(offset) {
		var text = this.data;
		var newText = text.substring(offset);
		text = text.substring(0, offset);
		this.data = this.nodeValue = text;
		this.length = text.length;
		var newNode = this.ownerDocument.createTextNode(newText);
		if (this.parentNode) {
			this.parentNode.insertBefore(newNode, this.nextSibling);
		}
		return newNode;
	}
};
_extends(Text, CharacterData);
function Comment() {};
Comment.prototype = {
	nodeName: "#comment",
	nodeType: COMMENT_NODE
};
_extends(Comment, CharacterData);

function CDATASection() {};
CDATASection.prototype = {
	nodeName: "#cdata-section",
	nodeType: CDATA_SECTION_NODE
};
_extends(CDATASection, CharacterData);

function DocumentType() {};
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;
_extends(DocumentType, Node);

function Notation() {};
Notation.prototype.nodeType = NOTATION_NODE;
_extends(Notation, Node);

function Entity() {};
Entity.prototype.nodeType = ENTITY_NODE;
_extends(Entity, Node);

function EntityReference() {};
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;
_extends(EntityReference, Node);

function DocumentFragment() {};
DocumentFragment.prototype.nodeName = "#document-fragment";
DocumentFragment.prototype.nodeType = DOCUMENT_FRAGMENT_NODE;
_extends(DocumentFragment, Node);

function ProcessingInstruction() {}
ProcessingInstruction.prototype.nodeType = PROCESSING_INSTRUCTION_NODE;
_extends(ProcessingInstruction, Node);
function XMLSerializer() {}
XMLSerializer.prototype.serializeToString = function (node, isHtml, nodeFilter) {
	return nodeSerializeToString.call(node, isHtml, nodeFilter);
};
Node.prototype.toString = nodeSerializeToString;
function nodeSerializeToString(isHtml, nodeFilter) {
	var buf = [];
	var refNode = this.nodeType == 9 && this.documentElement || this;
	var prefix = refNode.prefix;
	var uri = refNode.namespaceURI;

	if (uri && prefix == null) {
		//console.log(prefix)
		var prefix = refNode.lookupPrefix(uri);
		if (prefix == null) {
			//isHTML = true;
			var visibleNamespaces = [{ namespace: uri, prefix: null
				//{namespace:uri,prefix:''}
			}];
		}
	}
	serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces);
	//console.log('###',this.nodeType,uri,prefix,buf.join(''))
	return buf.join('');
}
function needNamespaceDefine(node, isHTML, visibleNamespaces) {
	var prefix = node.prefix || '';
	var uri = node.namespaceURI;
	if (!prefix && !uri) {
		return false;
	}
	if (prefix === "xml" && uri === "http://www.w3.org/XML/1998/namespace" || uri == 'http://www.w3.org/2000/xmlns/') {
		return false;
	}

	var i = visibleNamespaces.length;
	//console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)
	while (i--) {
		var ns = visibleNamespaces[i];
		// get namespace prefix
		//console.log(node.nodeType,node.tagName,ns.prefix,prefix)
		if (ns.prefix == prefix) {
			return ns.namespace != uri;
		}
	}
	//console.log(isHTML,uri,prefix=='')
	//if(isHTML && prefix ==null && uri == 'http://www.w3.org/1999/xhtml'){
	//	return false;
	//}
	//node.flag = '11111'
	//console.error(3,true,node.flag,node.prefix,node.namespaceURI)
	return true;
}
function serializeToString(node, buf, isHTML, nodeFilter, visibleNamespaces) {
	if (nodeFilter) {
		node = nodeFilter(node);
		if (node) {
			if (typeof node == 'string') {
				buf.push(node);
				return;
			}
		} else {
			return;
		}
		//buf.sort.apply(attrs, attributeSorter);
	}
	switch (node.nodeType) {
		case ELEMENT_NODE:
			if (!visibleNamespaces) visibleNamespaces = [];
			var startVisibleNamespaces = visibleNamespaces.length;
			var attrs = node.attributes;
			var len = attrs.length;
			var child = node.firstChild;
			var nodeName = node.tagName;

			isHTML = htmlns === node.namespaceURI || isHTML;
			buf.push('<', nodeName);

			for (var i = 0; i < len; i++) {
				// add namespaces for attributes
				var attr = attrs.item(i);
				if (attr.prefix == 'xmlns') {
					visibleNamespaces.push({ prefix: attr.localName, namespace: attr.value });
				} else if (attr.nodeName == 'xmlns') {
					visibleNamespaces.push({ prefix: '', namespace: attr.value });
				}
			}
			for (var i = 0; i < len; i++) {
				var attr = attrs.item(i);
				if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
					var prefix = attr.prefix || '';
					var uri = attr.namespaceURI;
					var ns = prefix ? ' xmlns:' + prefix : " xmlns";
					buf.push(ns, '="', uri, '"');
					visibleNamespaces.push({ prefix: prefix, namespace: uri });
				}
				serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
			}
			// add namespace for current node		
			if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
				var prefix = node.prefix || '';
				var uri = node.namespaceURI;
				var ns = prefix ? ' xmlns:' + prefix : " xmlns";
				buf.push(ns, '="', uri, '"');
				visibleNamespaces.push({ prefix: prefix, namespace: uri });
			}

			if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
				buf.push('>');
				//if is cdata child node
				if (isHTML && /^script$/i.test(nodeName)) {
					while (child) {
						if (child.data) {
							buf.push(child.data);
						} else {
							serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
						}
						child = child.nextSibling;
					}
				} else {
					while (child) {
						serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
						child = child.nextSibling;
					}
				}
				buf.push('</', nodeName, '>');
			} else {
				buf.push('/>');
			}
			// remove added visible namespaces
			//visibleNamespaces.length = startVisibleNamespaces;
			return;
		case DOCUMENT_NODE:
		case DOCUMENT_FRAGMENT_NODE:
			var child = node.firstChild;
			while (child) {
				serializeToString(child, buf, isHTML, nodeFilter, visibleNamespaces);
				child = child.nextSibling;
			}
			return;
		case ATTRIBUTE_NODE:
			return buf.push(' ', node.name, '="', node.value.replace(/[<&"]/g, _xmlEncoder), '"');
		case TEXT_NODE:
			return buf.push(node.data.replace(/[<&]/g, _xmlEncoder));
		case CDATA_SECTION_NODE:
			return buf.push('<![CDATA[', node.data, ']]>');
		case COMMENT_NODE:
			return buf.push("<!--", node.data, "-->");
		case DOCUMENT_TYPE_NODE:
			var pubid = node.publicId;
			var sysid = node.systemId;
			buf.push('<!DOCTYPE ', node.name);
			if (pubid) {
				buf.push(' PUBLIC "', pubid);
				if (sysid && sysid != '.') {
					buf.push('" "', sysid);
				}
				buf.push('">');
			} else if (sysid && sysid != '.') {
				buf.push(' SYSTEM "', sysid, '">');
			} else {
				var sub = node.internalSubset;
				if (sub) {
					buf.push(" [", sub, "]");
				}
				buf.push(">");
			}
			return;
		case PROCESSING_INSTRUCTION_NODE:
			return buf.push("<?", node.target, " ", node.data, "?>");
		case ENTITY_REFERENCE_NODE:
			return buf.push('&', node.nodeName, ';');
		//case ENTITY_NODE:
		//case NOTATION_NODE:
		default:
			buf.push('??', node.nodeName);
	}
}
function _importNode(doc, node, deep) {
	var node2;
	switch (node.nodeType) {
		case ELEMENT_NODE:
			node2 = node.cloneNode(false);
			node2.ownerDocument = doc;
		//var attrs = node2.attributes;
		//var len = attrs.length;
		//for(var i=0;i<len;i++){
		//node2.setAttributeNodeNS(importNode(doc,attrs.item(i),deep));
		//}
		case DOCUMENT_FRAGMENT_NODE:
			break;
		case ATTRIBUTE_NODE:
			deep = true;
			break;
		//case ENTITY_REFERENCE_NODE:
		//case PROCESSING_INSTRUCTION_NODE:
		////case TEXT_NODE:
		//case CDATA_SECTION_NODE:
		//case COMMENT_NODE:
		//	deep = false;
		//	break;
		//case DOCUMENT_NODE:
		//case DOCUMENT_TYPE_NODE:
		//cannot be imported.
		//case ENTITY_NODE:
		//case NOTATION_NODE：
		//can not hit in level3
		//default:throw e;
	}
	if (!node2) {
		node2 = node.cloneNode(false); //false
	}
	node2.ownerDocument = doc;
	node2.parentNode = null;
	if (deep) {
		var child = node.firstChild;
		while (child) {
			node2.appendChild(_importNode(doc, child, deep));
			child = child.nextSibling;
		}
	}
	return node2;
}
//
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};
function _cloneNode(doc, node, deep) {
	var node2 = new node.constructor();
	for (var n in node) {
		var v = node[n];
		if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) != 'object') {
			if (v != node2[n]) {
				node2[n] = v;
			}
		}
	}
	if (node.childNodes) {
		node2.childNodes = new NodeList();
	}
	node2.ownerDocument = doc;
	switch (node2.nodeType) {
		case ELEMENT_NODE:
			var attrs = node.attributes;
			var attrs2 = node2.attributes = new NamedNodeMap();
			var len = attrs.length;
			attrs2._ownerElement = node2;
			for (var i = 0; i < len; i++) {
				node2.setAttributeNode(_cloneNode(doc, attrs.item(i), true));
			}
			break;;
		case ATTRIBUTE_NODE:
			deep = true;
	}
	if (deep) {
		var child = node.firstChild;
		while (child) {
			node2.appendChild(_cloneNode(doc, child, deep));
			child = child.nextSibling;
		}
	}
	return node2;
}

function __set__(object, key, value) {
	object[key] = value;
}
//do dynamic
try {
	if (Object.defineProperty) {
		var getTextContent = function getTextContent(node) {
			switch (node.nodeType) {
				case ELEMENT_NODE:
				case DOCUMENT_FRAGMENT_NODE:
					var buf = [];
					node = node.firstChild;
					while (node) {
						if (node.nodeType !== 7 && node.nodeType !== 8) {
							buf.push(getTextContent(node));
						}
						node = node.nextSibling;
					}
					return buf.join('');
				default:
					return node.nodeValue;
			}
		};

		Object.defineProperty(LiveNodeList.prototype, 'length', {
			get: function get() {
				_updateLiveList(this);
				return this.$$length;
			}
		});
		Object.defineProperty(Node.prototype, 'textContent', {
			get: function get() {
				return getTextContent(this);
			},
			set: function set(data) {
				switch (this.nodeType) {
					case ELEMENT_NODE:
					case DOCUMENT_FRAGMENT_NODE:
						while (this.firstChild) {
							this.removeChild(this.firstChild);
						}
						if (data || String(data)) {
							this.appendChild(this.ownerDocument.createTextNode(data));
						}
						break;
					default:
						//TODO:
						this.data = data;
						this.value = data;
						this.nodeValue = data;
				}
			}
		});

		__set__ = function __set__(object, key, value) {
			//console.log(value)
			object['$$' + key] = value;
		};
	}
} catch (e) {} //ie8


//if(typeof require == 'function'){
exports.DOMImplementation = DOMImplementation;
exports.XMLSerializer = XMLSerializer;
//}

},{}],31:[function(require,module,exports){
'use strict';

exports.entityMap = {
       lt: '<',
       gt: '>',
       amp: '&',
       quot: '"',
       apos: "'",
       Agrave: "À",
       Aacute: "Á",
       Acirc: "Â",
       Atilde: "Ã",
       Auml: "Ä",
       Aring: "Å",
       AElig: "Æ",
       Ccedil: "Ç",
       Egrave: "È",
       Eacute: "É",
       Ecirc: "Ê",
       Euml: "Ë",
       Igrave: "Ì",
       Iacute: "Í",
       Icirc: "Î",
       Iuml: "Ï",
       ETH: "Ð",
       Ntilde: "Ñ",
       Ograve: "Ò",
       Oacute: "Ó",
       Ocirc: "Ô",
       Otilde: "Õ",
       Ouml: "Ö",
       Oslash: "Ø",
       Ugrave: "Ù",
       Uacute: "Ú",
       Ucirc: "Û",
       Uuml: "Ü",
       Yacute: "Ý",
       THORN: "Þ",
       szlig: "ß",
       agrave: "à",
       aacute: "á",
       acirc: "â",
       atilde: "ã",
       auml: "ä",
       aring: "å",
       aelig: "æ",
       ccedil: "ç",
       egrave: "è",
       eacute: "é",
       ecirc: "ê",
       euml: "ë",
       igrave: "ì",
       iacute: "í",
       icirc: "î",
       iuml: "ï",
       eth: "ð",
       ntilde: "ñ",
       ograve: "ò",
       oacute: "ó",
       ocirc: "ô",
       otilde: "õ",
       ouml: "ö",
       oslash: "ø",
       ugrave: "ù",
       uacute: "ú",
       ucirc: "û",
       uuml: "ü",
       yacute: "ý",
       thorn: "þ",
       yuml: "ÿ",
       nbsp: " ",
       iexcl: "¡",
       cent: "¢",
       pound: "£",
       curren: "¤",
       yen: "¥",
       brvbar: "¦",
       sect: "§",
       uml: "¨",
       copy: "©",
       ordf: "ª",
       laquo: "«",
       not: "¬",
       shy: "­­",
       reg: "®",
       macr: "¯",
       deg: "°",
       plusmn: "±",
       sup2: "²",
       sup3: "³",
       acute: "´",
       micro: "µ",
       para: "¶",
       middot: "·",
       cedil: "¸",
       sup1: "¹",
       ordm: "º",
       raquo: "»",
       frac14: "¼",
       frac12: "½",
       frac34: "¾",
       iquest: "¿",
       times: "×",
       divide: "÷",
       forall: "∀",
       part: "∂",
       exist: "∃",
       empty: "∅",
       nabla: "∇",
       isin: "∈",
       notin: "∉",
       ni: "∋",
       prod: "∏",
       sum: "∑",
       minus: "−",
       lowast: "∗",
       radic: "√",
       prop: "∝",
       infin: "∞",
       ang: "∠",
       and: "∧",
       or: "∨",
       cap: "∩",
       cup: "∪",
       'int': "∫",
       there4: "∴",
       sim: "∼",
       cong: "≅",
       asymp: "≈",
       ne: "≠",
       equiv: "≡",
       le: "≤",
       ge: "≥",
       sub: "⊂",
       sup: "⊃",
       nsub: "⊄",
       sube: "⊆",
       supe: "⊇",
       oplus: "⊕",
       otimes: "⊗",
       perp: "⊥",
       sdot: "⋅",
       Alpha: "Α",
       Beta: "Β",
       Gamma: "Γ",
       Delta: "Δ",
       Epsilon: "Ε",
       Zeta: "Ζ",
       Eta: "Η",
       Theta: "Θ",
       Iota: "Ι",
       Kappa: "Κ",
       Lambda: "Λ",
       Mu: "Μ",
       Nu: "Ν",
       Xi: "Ξ",
       Omicron: "Ο",
       Pi: "Π",
       Rho: "Ρ",
       Sigma: "Σ",
       Tau: "Τ",
       Upsilon: "Υ",
       Phi: "Φ",
       Chi: "Χ",
       Psi: "Ψ",
       Omega: "Ω",
       alpha: "α",
       beta: "β",
       gamma: "γ",
       delta: "δ",
       epsilon: "ε",
       zeta: "ζ",
       eta: "η",
       theta: "θ",
       iota: "ι",
       kappa: "κ",
       lambda: "λ",
       mu: "μ",
       nu: "ν",
       xi: "ξ",
       omicron: "ο",
       pi: "π",
       rho: "ρ",
       sigmaf: "ς",
       sigma: "σ",
       tau: "τ",
       upsilon: "υ",
       phi: "φ",
       chi: "χ",
       psi: "ψ",
       omega: "ω",
       thetasym: "ϑ",
       upsih: "ϒ",
       piv: "ϖ",
       OElig: "Œ",
       oelig: "œ",
       Scaron: "Š",
       scaron: "š",
       Yuml: "Ÿ",
       fnof: "ƒ",
       circ: "ˆ",
       tilde: "˜",
       ensp: " ",
       emsp: " ",
       thinsp: " ",
       zwnj: "‌",
       zwj: "‍",
       lrm: "‎",
       rlm: "‏",
       ndash: "–",
       mdash: "—",
       lsquo: "‘",
       rsquo: "’",
       sbquo: "‚",
       ldquo: "“",
       rdquo: "”",
       bdquo: "„",
       dagger: "†",
       Dagger: "‡",
       bull: "•",
       hellip: "…",
       permil: "‰",
       prime: "′",
       Prime: "″",
       lsaquo: "‹",
       rsaquo: "›",
       oline: "‾",
       euro: "€",
       trade: "™",
       larr: "←",
       uarr: "↑",
       rarr: "→",
       darr: "↓",
       harr: "↔",
       crarr: "↵",
       lceil: "⌈",
       rceil: "⌉",
       lfloor: "⌊",
       rfloor: "⌋",
       loz: "◊",
       spades: "♠",
       clubs: "♣",
       hearts: "♥",
       diams: "♦"
};
//for(var  n in exports.entityMap){console.log(exports.entityMap[n].charCodeAt())}

},{}],32:[function(require,module,exports){
"use strict";

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/; //\u10000-\uEFFFF
var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$');
//var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
//var handlers = 'resolveEntity,getExternalSubset,characters,endDocument,endElement,endPrefixMapping,ignorableWhitespace,processingInstruction,setDocumentLocator,skippedEntity,startDocument,startElement,startPrefixMapping,notationDecl,unparsedEntityDecl,error,fatalError,warning,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,comment,endCDATA,endDTD,endEntity,startCDATA,startDTD,startEntity'.split(',')

//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
var S_TAG = 0; //tag name offerring
var S_ATTR = 1; //attr name offerring 
var S_ATTR_SPACE = 2; //attr name end and space offer
var S_EQ = 3; //=space?
var S_ATTR_NOQUOT_VALUE = 4; //attr value(no quot value only)
var S_ATTR_END = 5; //attr value end and no space(quot end)
var S_TAG_SPACE = 6; //(attr value end || tag end ) && (space offer)
var S_TAG_CLOSE = 7; //closed el<el />

function XMLReader() {}

XMLReader.prototype = {
	parse: function parse(source, defaultNSMap, entityMap) {
		var domBuilder = this.domBuilder;
		domBuilder.startDocument();
		_copy(defaultNSMap, defaultNSMap = {});
		_parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
		domBuilder.endDocument();
	}
};
function _parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
	function fixedFromCharCode(code) {
		// String.prototype.fromCharCode does not supports
		// > 2 bytes unicode chars directly
		if (code > 0xffff) {
			code -= 0x10000;
			var surrogate1 = 0xd800 + (code >> 10),
			    surrogate2 = 0xdc00 + (code & 0x3ff);

			return String.fromCharCode(surrogate1, surrogate2);
		} else {
			return String.fromCharCode(code);
		}
	}
	function entityReplacer(a) {
		var k = a.slice(1, -1);
		if (k in entityMap) {
			return entityMap[k];
		} else if (k.charAt(0) === '#') {
			return fixedFromCharCode(parseInt(k.substr(1).replace('x', '0x')));
		} else {
			errorHandler.error('entity not found:' + a);
			return a;
		}
	}
	function appendText(end) {
		//has some bugs
		if (end > start) {
			var xt = source.substring(start, end).replace(/&#?\w+;/g, entityReplacer);
			locator && position(start);
			domBuilder.characters(xt, 0, end - start);
			start = end;
		}
	}
	function position(p, m) {
		while (p >= lineEnd && (m = linePattern.exec(source))) {
			lineStart = m.index;
			lineEnd = lineStart + m[0].length;
			locator.lineNumber++;
			//console.log('line++:',locator,startPos,endPos)
		}
		locator.columnNumber = p - lineStart + 1;
	}
	var lineStart = 0;
	var lineEnd = 0;
	var linePattern = /.*(?:\r\n?|\n)|.*$/g;
	var locator = domBuilder.locator;

	var parseStack = [{ currentNSMap: defaultNSMapCopy }];
	var closeMap = {};
	var start = 0;
	while (true) {
		try {
			var tagStart = source.indexOf('<', start);
			if (tagStart < 0) {
				if (!source.substr(start).match(/^\s*$/)) {
					var doc = domBuilder.doc;
					var text = doc.createTextNode(source.substr(start));
					doc.appendChild(text);
					domBuilder.currentElement = text;
				}
				return;
			}
			if (tagStart > start) {
				appendText(tagStart);
			}
			switch (source.charAt(tagStart + 1)) {
				case '/':
					var end = source.indexOf('>', tagStart + 3);
					var tagName = source.substring(tagStart + 2, end);
					var config = parseStack.pop();
					if (end < 0) {

						tagName = source.substring(tagStart + 2).replace(/[\s<].*/, '');
						//console.error('#@@@@@@'+tagName)
						errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
						end = tagStart + 1 + tagName.length;
					} else if (tagName.match(/\s</)) {
						tagName = tagName.replace(/[\s<].*/, '');
						errorHandler.error("end tag name: " + tagName + ' maybe not complete');
						end = tagStart + 1 + tagName.length;
					}
					//console.error(parseStack.length,parseStack)
					//console.error(config);
					var localNSMap = config.localNSMap;
					var endMatch = config.tagName == tagName;
					var endIgnoreCaseMach = endMatch || config.tagName && config.tagName.toLowerCase() == tagName.toLowerCase();
					if (endIgnoreCaseMach) {
						domBuilder.endElement(config.uri, config.localName, tagName);
						if (localNSMap) {
							for (var prefix in localNSMap) {
								domBuilder.endPrefixMapping(prefix);
							}
						}
						if (!endMatch) {
							errorHandler.fatalError("end tag name: " + tagName + ' is not match the current start tagName:' + config.tagName);
						}
					} else {
						parseStack.push(config);
					}

					end++;
					break;
				// end elment
				case '?':
					// <?...?>
					locator && position(tagStart);
					end = parseInstruction(source, tagStart, domBuilder);
					break;
				case '!':
					// <!doctype,<![CDATA,<!--
					locator && position(tagStart);
					end = parseDCC(source, tagStart, domBuilder, errorHandler);
					break;
				default:
					locator && position(tagStart);
					var el = new ElementAttributes();
					var currentNSMap = parseStack[parseStack.length - 1].currentNSMap;
					//elStartEnd
					var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
					var len = el.length;

					if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
						el.closed = true;
						if (!entityMap.nbsp) {
							errorHandler.warning('unclosed xml attribute');
						}
					}
					if (locator && len) {
						var locator2 = copyLocator(locator, {});
						//try{//attribute position fixed
						for (var i = 0; i < len; i++) {
							var a = el[i];
							position(a.offset);
							a.locator = copyLocator(locator, {});
						}
						//}catch(e){console.error('@@@@@'+e)}
						domBuilder.locator = locator2;
						if (appendElement(el, domBuilder, currentNSMap)) {
							parseStack.push(el);
						}
						domBuilder.locator = locator;
					} else {
						if (appendElement(el, domBuilder, currentNSMap)) {
							parseStack.push(el);
						}
					}

					if (el.uri === 'http://www.w3.org/1999/xhtml' && !el.closed) {
						end = parseHtmlSpecialContent(source, end, el.tagName, entityReplacer, domBuilder);
					} else {
						end++;
					}
			}
		} catch (e) {
			errorHandler.error('element parse error: ' + e);
			//errorHandler.error('element parse error: '+e);
			end = -1;
			//throw e;
		}
		if (end > start) {
			start = end;
		} else {
			//TODO: 这里有可能sax回退，有位置错误风险
			appendText(Math.max(tagStart, start) + 1);
		}
	}
}
function copyLocator(f, t) {
	t.lineNumber = f.lineNumber;
	t.columnNumber = f.columnNumber;
	return t;
}

/**
 * @see #appendElement(source,elStartEnd,el,selfClosed,entityReplacer,domBuilder,parseStack);
 * @return end of the elementStartPart(end of elementEndPart for selfClosed el)
 */
function parseElementStartPart(source, start, el, currentNSMap, entityReplacer, errorHandler) {
	var attrName;
	var value;
	var p = ++start;
	var s = S_TAG; //status
	while (true) {
		var c = source.charAt(p);
		switch (c) {
			case '=':
				if (s === S_ATTR) {
					//attrName
					attrName = source.slice(start, p);
					s = S_EQ;
				} else if (s === S_ATTR_SPACE) {
					s = S_EQ;
				} else {
					//fatalError: equal must after attrName or space after attrName
					throw new Error('attribute equal must after attrName');
				}
				break;
			case '\'':
			case '"':
				if (s === S_EQ || s === S_ATTR //|| s == S_ATTR_SPACE
				) {
						//equal
						if (s === S_ATTR) {
							errorHandler.warning('attribute value must after "="');
							attrName = source.slice(start, p);
						}
						start = p + 1;
						p = source.indexOf(c, start);
						if (p > 0) {
							value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
							el.add(attrName, value, start - 1);
							s = S_ATTR_END;
						} else {
							//fatalError: no end quot match
							throw new Error('attribute value no end \'' + c + '\' match');
						}
					} else if (s == S_ATTR_NOQUOT_VALUE) {
					value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
					//console.log(attrName,value,start,p)
					el.add(attrName, value, start);
					//console.dir(el)
					errorHandler.warning('attribute "' + attrName + '" missed start quot(' + c + ')!!');
					start = p + 1;
					s = S_ATTR_END;
				} else {
					//fatalError: no equal before
					throw new Error('attribute value must after "="');
				}
				break;
			case '/':
				switch (s) {
					case S_TAG:
						el.setTagName(source.slice(start, p));
					case S_ATTR_END:
					case S_TAG_SPACE:
					case S_TAG_CLOSE:
						s = S_TAG_CLOSE;
						el.closed = true;
					case S_ATTR_NOQUOT_VALUE:
					case S_ATTR:
					case S_ATTR_SPACE:
						break;
					//case S_EQ:
					default:
						throw new Error("attribute invalid close char('/')");
				}
				break;
			case '':
				//end document
				//throw new Error('unexpected end of input')
				errorHandler.error('unexpected end of input');
				if (s == S_TAG) {
					el.setTagName(source.slice(start, p));
				}
				return p;
			case '>':
				switch (s) {
					case S_TAG:
						el.setTagName(source.slice(start, p));
					case S_ATTR_END:
					case S_TAG_SPACE:
					case S_TAG_CLOSE:
						break; //normal
					case S_ATTR_NOQUOT_VALUE: //Compatible state
					case S_ATTR:
						value = source.slice(start, p);
						if (value.slice(-1) === '/') {
							el.closed = true;
							value = value.slice(0, -1);
						}
					case S_ATTR_SPACE:
						if (s === S_ATTR_SPACE) {
							value = attrName;
						}
						if (s == S_ATTR_NOQUOT_VALUE) {
							errorHandler.warning('attribute "' + value + '" missed quot(")!!');
							el.add(attrName, value.replace(/&#?\w+;/g, entityReplacer), start);
						} else {
							if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !value.match(/^(?:disabled|checked|selected)$/i)) {
								errorHandler.warning('attribute "' + value + '" missed value!! "' + value + '" instead!!');
							}
							el.add(value, value, start);
						}
						break;
					case S_EQ:
						throw new Error('attribute value missed!!');
				}
				//			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))
				return p;
			/*xml space '\x20' | #x9 | #xD | #xA; */
			case "\x80":
				c = ' ';
			default:
				if (c <= ' ') {
					//space
					switch (s) {
						case S_TAG:
							el.setTagName(source.slice(start, p)); //tagName
							s = S_TAG_SPACE;
							break;
						case S_ATTR:
							attrName = source.slice(start, p);
							s = S_ATTR_SPACE;
							break;
						case S_ATTR_NOQUOT_VALUE:
							var value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer);
							errorHandler.warning('attribute "' + value + '" missed quot(")!!');
							el.add(attrName, value, start);
						case S_ATTR_END:
							s = S_TAG_SPACE;
							break;
						//case S_TAG_SPACE:
						//case S_EQ:
						//case S_ATTR_SPACE:
						//	void();break;
						//case S_TAG_CLOSE:
						//ignore warning
					}
				} else {
					//not space
					//S_TAG,	S_ATTR,	S_EQ,	S_ATTR_NOQUOT_VALUE
					//S_ATTR_SPACE,	S_ATTR_END,	S_TAG_SPACE, S_TAG_CLOSE
					switch (s) {
						//case S_TAG:void();break;
						//case S_ATTR:void();break;
						//case S_ATTR_NOQUOT_VALUE:void();break;
						case S_ATTR_SPACE:
							var tagName = el.tagName;
							if (currentNSMap[''] !== 'http://www.w3.org/1999/xhtml' || !attrName.match(/^(?:disabled|checked|selected)$/i)) {
								errorHandler.warning('attribute "' + attrName + '" missed value!! "' + attrName + '" instead2!!');
							}
							el.add(attrName, attrName, start);
							start = p;
							s = S_ATTR;
							break;
						case S_ATTR_END:
							errorHandler.warning('attribute space is required"' + attrName + '"!!');
						case S_TAG_SPACE:
							s = S_ATTR;
							start = p;
							break;
						case S_EQ:
							s = S_ATTR_NOQUOT_VALUE;
							start = p;
							break;
						case S_TAG_CLOSE:
							throw new Error("elements closed character '/' and '>' must be connected to");
					}
				}
		} //end outer switch
		//console.log('p++',p)
		p++;
	}
}
/**
 * @return true if has new namespace define
 */
function appendElement(el, domBuilder, currentNSMap) {
	var tagName = el.tagName;
	var localNSMap = null;
	//var currentNSMap = parseStack[parseStack.length-1].currentNSMap;
	var i = el.length;
	while (i--) {
		var a = el[i];
		var qName = a.qName;
		var value = a.value;
		var nsp = qName.indexOf(':');
		if (nsp > 0) {
			var prefix = a.prefix = qName.slice(0, nsp);
			var localName = qName.slice(nsp + 1);
			var nsPrefix = prefix === 'xmlns' && localName;
		} else {
			localName = qName;
			prefix = null;
			nsPrefix = qName === 'xmlns' && '';
		}
		//can not set prefix,because prefix !== ''
		a.localName = localName;
		//prefix == null for no ns prefix attribute 
		if (nsPrefix !== false) {
			//hack!!
			if (localNSMap == null) {
				localNSMap = {};
				//console.log(currentNSMap,0)
				_copy(currentNSMap, currentNSMap = {});
				//console.log(currentNSMap,1)
			}
			currentNSMap[nsPrefix] = localNSMap[nsPrefix] = value;
			a.uri = 'http://www.w3.org/2000/xmlns/';
			domBuilder.startPrefixMapping(nsPrefix, value);
		}
	}
	var i = el.length;
	while (i--) {
		a = el[i];
		var prefix = a.prefix;
		if (prefix) {
			//no prefix attribute has no namespace
			if (prefix === 'xml') {
				a.uri = 'http://www.w3.org/XML/1998/namespace';
			}if (prefix !== 'xmlns') {
				a.uri = currentNSMap[prefix || ''];

				//{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
			}
		}
	}
	var nsp = tagName.indexOf(':');
	if (nsp > 0) {
		prefix = el.prefix = tagName.slice(0, nsp);
		localName = el.localName = tagName.slice(nsp + 1);
	} else {
		prefix = null; //important!!
		localName = el.localName = tagName;
	}
	//no prefix element has default namespace
	var ns = el.uri = currentNSMap[prefix || ''];
	domBuilder.startElement(ns, localName, tagName, el);
	//endPrefixMapping and startPrefixMapping have not any help for dom builder
	//localNSMap = null
	if (el.closed) {
		domBuilder.endElement(ns, localName, tagName);
		if (localNSMap) {
			for (prefix in localNSMap) {
				domBuilder.endPrefixMapping(prefix);
			}
		}
	} else {
		el.currentNSMap = currentNSMap;
		el.localNSMap = localNSMap;
		//parseStack.push(el);
		return true;
	}
}
function parseHtmlSpecialContent(source, elStartEnd, tagName, entityReplacer, domBuilder) {
	if (/^(?:script|textarea)$/i.test(tagName)) {
		var elEndStart = source.indexOf('</' + tagName + '>', elStartEnd);
		var text = source.substring(elStartEnd + 1, elEndStart);
		if (/[&<]/.test(text)) {
			if (/^script$/i.test(tagName)) {
				//if(!/\]\]>/.test(text)){
				//lexHandler.startCDATA();
				domBuilder.characters(text, 0, text.length);
				//lexHandler.endCDATA();
				return elEndStart;
				//}
			} //}else{//text area
			text = text.replace(/&#?\w+;/g, entityReplacer);
			domBuilder.characters(text, 0, text.length);
			return elEndStart;
			//}
		}
	}
	return elStartEnd + 1;
}
function fixSelfClosed(source, elStartEnd, tagName, closeMap) {
	//if(tagName in closeMap){
	var pos = closeMap[tagName];
	if (pos == null) {
		//console.log(tagName)
		pos = source.lastIndexOf('</' + tagName + '>');
		if (pos < elStartEnd) {
			//忘记闭合
			pos = source.lastIndexOf('</' + tagName);
		}
		closeMap[tagName] = pos;
	}
	return pos < elStartEnd;
	//} 
}
function _copy(source, target) {
	for (var n in source) {
		target[n] = source[n];
	}
}
function parseDCC(source, start, domBuilder, errorHandler) {
	//sure start with '<!'
	var next = source.charAt(start + 2);
	switch (next) {
		case '-':
			if (source.charAt(start + 3) === '-') {
				var end = source.indexOf('-->', start + 4);
				//append comment source.substring(4,end)//<!--
				if (end > start) {
					domBuilder.comment(source, start + 4, end - start - 4);
					return end + 3;
				} else {
					errorHandler.error("Unclosed comment");
					return -1;
				}
			} else {
				//error
				return -1;
			}
		default:
			if (source.substr(start + 3, 6) == 'CDATA[') {
				var end = source.indexOf(']]>', start + 9);
				domBuilder.startCDATA();
				domBuilder.characters(source, start + 9, end - start - 9);
				domBuilder.endCDATA();
				return end + 3;
			}
			//<!DOCTYPE
			//startDTD(java.lang.String name, java.lang.String publicId, java.lang.String systemId) 
			var matchs = split(source, start);
			var len = matchs.length;
			if (len > 1 && /!doctype/i.test(matchs[0][0])) {
				var name = matchs[1][0];
				var pubid = len > 3 && /^public$/i.test(matchs[2][0]) && matchs[3][0];
				var sysid = len > 4 && matchs[4][0];
				var lastMatch = matchs[len - 1];
				domBuilder.startDTD(name, pubid && pubid.replace(/^(['"])(.*?)\1$/, '$2'), sysid && sysid.replace(/^(['"])(.*?)\1$/, '$2'));
				domBuilder.endDTD();

				return lastMatch.index + lastMatch[0].length;
			}
	}
	return -1;
}

function parseInstruction(source, start, domBuilder) {
	var end = source.indexOf('?>', start);
	if (end) {
		var match = source.substring(start, end).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
		if (match) {
			var len = match[0].length;
			domBuilder.processingInstruction(match[1], match[2]);
			return end + 2;
		} else {
			//error
			return -1;
		}
	}
	return -1;
}

/**
 * @param source
 */
function ElementAttributes(source) {}
ElementAttributes.prototype = {
	setTagName: function setTagName(tagName) {
		if (!tagNamePattern.test(tagName)) {
			throw new Error('invalid tagName:' + tagName);
		}
		this.tagName = tagName;
	},
	add: function add(qName, value, offset) {
		if (!tagNamePattern.test(qName)) {
			throw new Error('invalid attribute:' + qName);
		}
		this[this.length++] = { qName: qName, value: value, offset: offset };
	},
	length: 0,
	getLocalName: function getLocalName(i) {
		return this[i].localName;
	},
	getLocator: function getLocator(i) {
		return this[i].locator;
	},
	getQName: function getQName(i) {
		return this[i].qName;
	},
	getURI: function getURI(i) {
		return this[i].uri;
	},
	getValue: function getValue(i) {
		return this[i].value;
	}
	//	,getIndex:function(uri, localName)){
	//		if(localName){
	//			
	//		}else{
	//			var qName = uri
	//		}
	//	},
	//	getValue:function(){return this.getValue(this.getIndex.apply(this,arguments))},
	//	getType:function(uri,localName){}
	//	getType:function(i){},
};

function split(source, start) {
	var match;
	var buf = [];
	var reg = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
	reg.lastIndex = start;
	reg.exec(source); //skip <
	while (match = reg.exec(source)) {
		buf.push(match);
		if (match[1]) return buf;
	}
}

exports.XMLReader = XMLReader;

},{}]},{},[1]);
