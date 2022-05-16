(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (setImmediate,clearImmediate){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":1,"timers":2}],3:[function(require,module,exports){
(function (global){
"use strict";

/* Blob.js
 * A Blob implementation.
 * 2017-11-15
 *
 * By Eli Grey, http://eligrey.com
 * By Devin Samarin, https://github.com/dsamarin
 * License: MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

/*global self, unescape */

/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */
(function (global) {
  (function (factory) {
    if (typeof define === "function" && define.amd) {
      // AMD. Register as an anonymous module.
      define(["exports"], factory);
    } else if (typeof exports === "object" && typeof exports.nodeName !== "string") {
      // CommonJS
      factory(exports);
    } else {
      // Browser globals
      factory(global);
    }
  })(function (exports) {
    "use strict";

    exports.URL = global.URL || global.webkitURL;

    if (global.Blob && global.URL) {
      try {
        new Blob();
        return;
      } catch (e) {}
    } // Internally we use a BlobBuilder implementation to base Blob off of
    // in order to support older browsers that only have BlobBuilder


    var BlobBuilder = global.BlobBuilder || global.WebKitBlobBuilder || global.MozBlobBuilder || function () {
      var get_class = function (object) {
        return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
      },
          FakeBlobBuilder = function BlobBuilder() {
        this.data = [];
      },
          FakeBlob = function Blob(data, type, encoding) {
        this.data = data;
        this.size = data.length;
        this.type = type;
        this.encoding = encoding;
      },
          FBB_proto = FakeBlobBuilder.prototype,
          FB_proto = FakeBlob.prototype,
          FileReaderSync = global.FileReaderSync,
          FileException = function (type) {
        this.code = this[this.name = type];
      },
          file_ex_codes = ("NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR " + "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR").split(" "),
          file_ex_code = file_ex_codes.length,
          real_URL = global.URL || global.webkitURL || exports,
          real_create_object_URL = real_URL.createObjectURL,
          real_revoke_object_URL = real_URL.revokeObjectURL,
          URL = real_URL,
          btoa = global.btoa,
          atob = global.atob,
          ArrayBuffer = global.ArrayBuffer,
          Uint8Array = global.Uint8Array,
          origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;

      FakeBlob.fake = FB_proto.fake = true;

      while (file_ex_code--) {
        FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
      } // Polyfill URL


      if (!real_URL.createObjectURL) {
        URL = exports.URL = function (uri) {
          var uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
              uri_origin;
          uri_info.href = uri;

          if (!("origin" in uri_info)) {
            if (uri_info.protocol.toLowerCase() === "data:") {
              uri_info.origin = null;
            } else {
              uri_origin = uri.match(origin);
              uri_info.origin = uri_origin && uri_origin[1];
            }
          }

          return uri_info;
        };
      }

      URL.createObjectURL = function (blob) {
        var type = blob.type,
            data_URI_header;

        if (type === null) {
          type = "application/octet-stream";
        }

        if (blob instanceof FakeBlob) {
          data_URI_header = "data:" + type;

          if (blob.encoding === "base64") {
            return data_URI_header + ";base64," + blob.data;
          } else if (blob.encoding === "URI") {
            return data_URI_header + "," + decodeURIComponent(blob.data);
          }

          if (btoa) {
            return data_URI_header + ";base64," + btoa(blob.data);
          } else {
            return data_URI_header + "," + encodeURIComponent(blob.data);
          }
        } else if (real_create_object_URL) {
          return real_create_object_URL.call(real_URL, blob);
        }
      };

      URL.revokeObjectURL = function (object_URL) {
        if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
          real_revoke_object_URL.call(real_URL, object_URL);
        }
      };

      FBB_proto.append = function (data
      /*, endings*/
      ) {
        var bb = this.data; // decode data to a binary string

        if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
          var str = "",
              buf = new Uint8Array(data),
              i = 0,
              buf_len = buf.length;

          for (; i < buf_len; i++) {
            str += String.fromCharCode(buf[i]);
          }

          bb.push(str);
        } else if (get_class(data) === "Blob" || get_class(data) === "File") {
          if (FileReaderSync) {
            var fr = new FileReaderSync();
            bb.push(fr.readAsBinaryString(data));
          } else {
            // async FileReader won't work as BlobBuilder is sync
            throw new FileException("NOT_READABLE_ERR");
          }
        } else if (data instanceof FakeBlob) {
          if (data.encoding === "base64" && atob) {
            bb.push(atob(data.data));
          } else if (data.encoding === "URI") {
            bb.push(decodeURIComponent(data.data));
          } else if (data.encoding === "raw") {
            bb.push(data.data);
          }
        } else {
          if (typeof data !== "string") {
            data += ""; // convert unsupported types to strings
          } // decode UTF-16 to binary string


          bb.push(unescape(encodeURIComponent(data)));
        }
      };

      FBB_proto.getBlob = function (type) {
        if (!arguments.length) {
          type = null;
        }

        return new FakeBlob(this.data.join(""), type, "raw");
      };

      FBB_proto.toString = function () {
        return "[object BlobBuilder]";
      };

      FB_proto.slice = function (start, end, type) {
        var args = arguments.length;

        if (args < 3) {
          type = null;
        }

        return new FakeBlob(this.data.slice(start, args > 1 ? end : this.data.length), type, this.encoding);
      };

      FB_proto.toString = function () {
        return "[object Blob]";
      };

      FB_proto.close = function () {
        this.size = 0;
        delete this.data;
      };

      return FakeBlobBuilder;
    }();

    exports.Blob = function (blobParts, options) {
      var type = options ? options.type || "" : "";
      var builder = new BlobBuilder();

      if (blobParts) {
        for (var i = 0, len = blobParts.length; i < len; i++) {
          if (Uint8Array && blobParts[i] instanceof Uint8Array) {
            builder.append(blobParts[i].buffer);
          } else {
            builder.append(blobParts[i]);
          }
        }
      }

      var blob = builder.getBlob(type);

      if (!blob.slice && blob.webkitSlice) {
        blob.slice = blob.webkitSlice;
      }

      return blob;
    };

    var getPrototypeOf = Object.getPrototypeOf || function (object) {
      return object.__proto__;
    };

    exports.Blob.prototype = getPrototypeOf(new exports.Blob());
  });
})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || typeof global !== "undefined" && global || (void 0).content || void 0);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";

!function () {
  function e(e) {
    this.message = e;
  }

  var t = "undefined" != typeof exports ? exports : "undefined" != typeof self ? self : $.global,
      r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  e.prototype = new Error(), e.prototype.name = "InvalidCharacterError", t.btoa || (t.btoa = function (t) {
    for (var o, n, a = String(t), i = 0, f = r, c = ""; a.charAt(0 | i) || (f = "=", i % 1); c += f.charAt(63 & o >> 8 - i % 1 * 8)) {
      if (n = a.charCodeAt(i += .75), n > 255) throw new e("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
      o = o << 8 | n;
    }

    return c;
  }), t.atob || (t.atob = function (t) {
    var o = String(t).replace(/[=]+$/, "");
    if (o.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded.");

    for (var n, a, i = 0, f = 0, c = ""; a = o.charAt(f++); ~a && (n = i % 4 ? 64 * n + a : a, i++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * i & 6)) : 0) a = r.indexOf(a);

    return c;
  });
}();

},{}],5:[function(require,module,exports){
"use strict";

jsb.device = jsb.Device; // cc namespace will be reset to {} in creator, use jsb namespace instead.

const {
  btoa,
  atob
} = require('./base64/base64.min');

window.btoa = btoa;
window.atob = atob;

const {
  Blob,
  URL
} = require('./Blob');

window.Blob = Blob;
window.URL = URL;
window.DOMParser = require('./xmldom/dom-parser').DOMParser;

require('./jsb_prepare');

require('./jsb-adapter');

require('./jsb_audioengine');

require('./jsb_input');

let _oldRequestFrameCallback = null;
let _requestAnimationFrameID = 0;
let _requestAnimationFrameCallbacks = {};
let _firstTick = true;

window.requestAnimationFrame = function (cb) {
  let id = ++_requestAnimationFrameID;
  _requestAnimationFrameCallbacks[id] = cb;
  return id;
};

window.cancelAnimationFrame = function (id) {
  delete _requestAnimationFrameCallbacks[id];
};

function tick(nowMilliSeconds) {
  if (_firstTick) {
    _firstTick = false;

    if (window.onload) {
      var event = new Event('load');
      event._target = window;
      window.onload(event);
    }
  }

  fireTimeout(nowMilliSeconds);

  for (let id in _requestAnimationFrameCallbacks) {
    _oldRequestFrameCallback = _requestAnimationFrameCallbacks[id];

    if (_oldRequestFrameCallback) {
      delete _requestAnimationFrameCallbacks[id];

      _oldRequestFrameCallback(nowMilliSeconds);
    }
  }
}

let _timeoutIDIndex = 0;

class TimeoutInfo {
  constructor(cb, delay, isRepeat, target, args) {
    this.cb = cb;
    this.id = ++_timeoutIDIndex;
    this.start = performance.now();
    this.delay = delay;
    this.isRepeat = isRepeat;
    this.target = target;
    this.args = args;
  }

}

let _timeoutInfos = {};

function fireTimeout(nowMilliSeconds) {
  let info;

  for (let id in _timeoutInfos) {
    info = _timeoutInfos[id];

    if (info && info.cb) {
      if (nowMilliSeconds - info.start >= info.delay) {
        // console.log(`fireTimeout: id ${id}, start: ${info.start}, delay: ${info.delay}, now: ${nowMilliSeconds}`);
        if (typeof info.cb === 'string') {
          Function(info.cb)();
        } else if (typeof info.cb === 'function') {
          info.cb.apply(info.target, info.args);
        }

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
  let cb = prevFuncArgs[0];

  if (!cb) {
    console.error("createTimeoutInfo doesn't pass a callback ...");
    return 0;
  }

  let delay = prevFuncArgs.length > 1 ? prevFuncArgs[1] : 0;
  let args;

  if (prevFuncArgs.length > 2) {
    args = Array.prototype.slice.call(prevFuncArgs, 2);
  }

  let info = new TimeoutInfo(cb, delay, isRepeat, this, args);
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
window.alert = console.error.bind(console); // File utils (Temporary, won't be accessible)

if (typeof jsb.FileUtils !== 'undefined') {
  jsb.fileUtils = jsb.FileUtils.getInstance();
  delete jsb.FileUtils;
}

XMLHttpRequest.prototype.addEventListener = function (eventName, listener, options) {
  this['on' + eventName] = listener;
};

XMLHttpRequest.prototype.removeEventListener = function (eventName, listener, options) {
  this['on' + eventName] = null;
}; // SocketIO


if (window.SocketIO) {
  window.io = window.SocketIO;
  SocketIO.prototype._Emit = SocketIO.prototype.emit;

  SocketIO.prototype.emit = function (uri, delegate) {
    if (typeof delegate === 'object') {
      delegate = JSON.stringify(delegate);
    }

    this._Emit(uri, delegate);
  };
}

window.gameTick = tick; // generate get set function

jsb.generateGetSet = function (moduleObj) {
  for (let classKey in moduleObj) {
    let classProto = moduleObj[classKey] && moduleObj[classKey].prototype;
    if (!classProto) continue;

    for (let getName in classProto) {
      let getPos = getName.search(/^get/);
      if (getPos == -1) continue;
      let propName = getName.replace(/^get/, '');
      let nameArr = propName.split('');
      let lowerFirst = nameArr[0].toLowerCase();
      let upperFirst = nameArr[0].toUpperCase();
      nameArr.splice(0, 1);
      let left = nameArr.join('');
      propName = lowerFirst + left;
      let setName = 'set' + upperFirst + left;
      if (classProto.hasOwnProperty(propName)) continue;
      let setFunc = classProto[setName];
      let hasSetFunc = typeof setFunc === 'function';

      if (hasSetFunc) {
        Object.defineProperty(classProto, propName, {
          get() {
            return this[getName]();
          },

          set(val) {
            this[setName](val);
          },

          configurable: true
        });
      } else {
        Object.defineProperty(classProto, propName, {
          get() {
            return this[getName]();
          },

          configurable: true
        });
      }
    }
  }
}; // promise polyfill relies on setTimeout implementation


require('./promise.min');

},{"./Blob":3,"./base64/base64.min":4,"./jsb-adapter":30,"./jsb_audioengine":35,"./jsb_input":36,"./jsb_prepare":37,"./promise.min":38,"./xmldom/dom-parser":39}],6:[function(require,module,exports){
"use strict";

const ImageData = require('./ImageData');

class Context2DAttribute {
  constructor() {
    this.lineWidth = undefined;
    this.lineJoin = undefined;
    this.fillStyle = undefined;
    this.font = undefined;
    this.lineCap = undefined;
    this.textAlign = undefined;
    this.textBaseline = undefined;
    this.strokeStyle = undefined;
    this.globalCompositeOperation = undefined;
  }

}

class CanvasRenderingContext2D {
  constructor(width, height) {
    this._nativeObj = new jsb.CanvasRenderingContext2D(width, height);
    this._attris = new Context2DAttribute();
  } // Do not cache width and height, as they will change buffer and sync to JS.


  get width() {
    return this._nativeObj.width;
  }

  set width(val) {
    this._nativeObj.width = val;
  }

  get height() {
    return this._nativeObj.height;
  }

  set height(val) {
    this._nativeObj.height = val;
  }

  get lineWidth() {
    return this._attris.lineWidth;
  }

  set lineWidth(val) {
    this._attris.lineWidth = val;
  }

  get lineJoin() {
    return this._attris.lineJoin;
  }

  set lineJoin(val) {
    this._attris.lineJoin = val;
  }

  get fillStyle() {
    return this._attris.fillStyle;
  }

  set fillStyle(val) {
    this._attris.fillStyle = val;
  }

  get font() {
    return this._attris.font;
  }

  set font(val) {
    this._attris.font = val;
  }

  get lineCap() {
    return this._attris.lineCap;
  }

  set lineCap(val) {
    this._attris.lineCap = val;
  }

  get textAlign() {
    return this._attris.textAlign;
  }

  set textAlign(val) {
    this._attris.textAlign = val;
  }

  get textBaseline() {
    return this._attris.textBaseline;
  }

  set textBaseline(val) {
    this._attris.textBaseline = val;
  }

  get strokeStyle() {
    return this._attris.strokeStyle;
  }

  set strokeStyle(val) {
    this._attris.strokeStyle = val;
  }

  get globalCompositeOperation() {
    return this._attris.globalCompositeOperation;
  }

  set globalCompositeOperation(val) {
    this._attris.globalCompositeOperation = val;
  }

  restore() {
    this._nativeObj.restore();
  }

  moveTo(x, y) {
    this._nativeObj.moveTo(x, y);
  }

  lineTo(x, y) {
    this._nativeObj.lineTo(x, y);
  }

  setTransform(a, b, c, d, e, f) {
    this._nativeObj.setTransform(a, b, c, d, e, f);
  }

  stroke() {
    this._canvas._dataInner = null;

    this._nativeObj.stroke();
  }

  measureText(text) {
    return this._nativeObj.measureText(text, this._attris);
  }

  fill() {
    this._canvas._dataInner = null;

    this._nativeObj.fill();
  }

  _fillImageData(data, width, height, offsetX, offsetY) {
    this._canvas._dataInner = null;

    this._nativeObj._fillImageData(data, width, height, offsetX, offsetY);
  }

  scale(x, y) {
    this._nativeObj.scale(x, y);
  }

  clearRect(x, y, width, height) {
    this._canvas._dataInner = null;

    this._nativeObj.clearRect(x, y, width, height);
  }

  transform(a, b, c, d, e, f) {
    this._nativeObj.transform(a, b, c, d, e, f);
  }

  fillText(text, x, y, maxWidth) {
    this._canvas._dataInner = null;

    this._nativeObj.fillText(text, x, y, maxWidth, this._attris);
  }

  strokeText(text, x, y, maxWidth) {
    this._canvas._dataInner = null;

    this._nativeObj.strokeText(text, x, y, maxWidth, this._attris);
  }

  save() {
    this._nativeObj.save();
  }

  fillRect(x, y, width, height) {
    this._canvas._dataInner = null;

    this._nativeObj.fillRect(x, y, width, height, this._attris);
  }

  fetchData() {
    if (typeof this._nativeObj.fetchData !== 'undefined') {
      this._nativeObj.fetchData();
    }
  }

  rotate(angle) {
    this._nativeObj.rotate(angle);
  }

  beginPath() {
    this._nativeObj.beginPath();
  }

  rect(x, y, width, height) {
    this._nativeObj.rect(x, y, width, height);
  }

  translate(x, y) {
    this._nativeObj.translate(x, y);
  }

  createLinearGradient(x0, y0, x1, y1) {
    return this._nativeObj.createLinearGradient(x0, y0, x1, y1);
  }

  closePath() {
    this._nativeObj.closePath();
  } // void ctx.putImageData(imagedata, dx, dy);
  // void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);


  putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
    this._canvas._data = imageData;
  } // ImageData ctx.createImageData(imagedata);
  // ImageData ctx.createImageData(width, height);


  createImageData(args1, args2) {
    if (typeof args1 === 'number' && typeof args2 === 'number') {
      return new ImageData(args1, args2);
    } else if (args1 instanceof ImageData) {
      return new ImageData(args1.data, args1.width, args1.height);
    }
  } // Comment it seems it is not used.
  // // ImageData ctx.getImageData(sx, sy, sw, sh);
  // getImageData (sx, sy, sw, sh) {
  //     var canvasWidth = this._canvas._width;
  //     var canvasHeight = this._canvas._height;
  //     var canvasBuffer = this._canvas._data.data;
  //     // image rect may bigger that canvas rect
  //     var maxValidSH = (sh + sy) < canvasHeight ? sh : (canvasHeight - sy);
  //     var maxValidSW = (sw + sx) < canvasWidth ? sw : (canvasWidth - sx);
  //     var imgBuffer = new Uint8ClampedArray(sw * sh * 4);
  //     for (var y = 0; y < maxValidSH; y++) {
  //         for (var x = 0; x < maxValidSW; x++) {
  //             var canvasPos = (y + sy) * canvasWidth + (x + sx);
  //             var imgPos = y * sw + x;
  //             imgBuffer[imgPos * 4 + 0] = canvasBuffer[canvasPos * 4 + 0];
  //             imgBuffer[imgPos * 4 + 1] = canvasBuffer[canvasPos * 4 + 1];
  //             imgBuffer[imgPos * 4 + 2] = canvasBuffer[canvasPos * 4 + 2];
  //             imgBuffer[imgPos * 4 + 3] = canvasBuffer[canvasPos * 4 + 3];
  //         }
  //     }
  //     return new ImageData(imgBuffer, sw, sh);
  // }


  _setCanvasBufferUpdatedCallback(func) {
    this._nativeObj._setCanvasBufferUpdatedCallback(func);
  }

}

module.exports = CanvasRenderingContext2D;

},{"./ImageData":22}],7:[function(require,module,exports){
"use strict";

class DOMRect {
  constructor(x, y, width, height) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.width = width ? width : 0;
    this.height = height ? height : 0;
    this.left = this.x;
    this.top = this.y;
    this.right = this.x + this.width;
    this.bottom = this.y + this.height;
  }

}

module.exports = DOMRect;

},{}],8:[function(require,module,exports){
"use strict";

const Event = require('./Event');

class DeviceMotionEvent extends Event {
  constructor(initArgs) {
    super('devicemotion');

    if (initArgs) {
      this._acceleration = initArgs.acceleration ? initArgs.acceleration : {
        x: 0,
        y: 0,
        z: 0
      };
      this._accelerationIncludingGravity = initArgs.accelerationIncludingGravity ? initArgs.accelerationIncludingGravity : {
        x: 0,
        y: 0,
        z: 0
      };
      this._rotationRate = initArgs.rotationRate ? initArgs.rotationRate : {
        alpha: 0,
        beta: 0,
        gamma: 0
      };
      this._interval = initArgs.interval;
    } else {
      this._acceleration = {
        x: 0,
        y: 0,
        z: 0
      };
      this._accelerationIncludingGravity = {
        x: 0,
        y: 0,
        z: 0
      };
      this._rotationRate = {
        alpha: 0,
        beta: 0,
        gamma: 0
      };
      this._interval = 0;
    }
  }

  get acceleration() {
    return this._acceleration;
  }

  get accelerationIncludingGravity() {
    return this._accelerationIncludingGravity;
  }

  get rotationRate() {
    return this._rotationRate;
  }

  get interval() {
    return this._interval;
  }

}

module.exports = DeviceMotionEvent;

},{"./Event":10}],9:[function(require,module,exports){
"use strict";

const Node = require('./Node');

const DOMRect = require('./DOMRect');

class Element extends Node {
  constructor() {
    super();
    this.className = '';
    this.children = [];
    this.clientLeft = 0;
    this.clientTop = 0;
    this.scrollLeft = 0;
    this.scrollTop = 0;
  }

  get clientWidth() {
    return 0;
  }

  get clientHeight() {
    return 0;
  }

  getBoundingClientRect() {
    return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  } // attrName is a string that names the attribute to be removed from element.


  removeAttribute(attrName) {}

}

module.exports = Element;

},{"./DOMRect":7,"./Node":26}],10:[function(require,module,exports){
"use strict";

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
class Event {
  constructor(type, eventInit) {
    this._type = type;
    this._target = null;
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


  get type() {
    return this._type;
  }
  /**
   * The target of this event.
   * @type {EventTarget}
   */


  get target() {
    return this._target;
  }
  /**
   * The target of this event.
   * @type {EventTarget}
   */


  get currentTarget() {
    return this._currentTarget;
  }

  get isTrusted() {
    // https://heycam.github.io/webidl/#Unforgeable
    return false;
  }

  get timeStamp() {
    return this._timeStamp;
  }
  /**
   * @returns {EventTarget[]} The composed path of this event.
   */


  composedPath() {
    const currentTarget = this._currentTarget;

    if (currentTarget === null) {
      return [];
    }

    return [currentTarget];
  }
  /**
   * The target of this event.
   * @type {number}
   */


  get eventPhase() {
    return this._eventPhase;
  }
  /**
   * Stop event bubbling.
   * @returns {void}
   */


  stopPropagation() {}
  /**
   * Stop event bubbling.
   * @returns {void}
   */


  stopImmediatePropagation() {
    this._stopped = true;
  }
  /**
   * The flag to be bubbling.
   * @type {boolean}
   */


  get bubbles() {
    return false;
  }
  /**
   * The flag to be cancelable.
   * @type {boolean}
   */


  get cancelable() {
    return true;
  }
  /**
   * Cancel this event.
   * @returns {void}
   */


  preventDefault() {
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


  get defaultPrevented() {
    return this._canceled;
  }
  /**
   * The flag to be composed.
   * @type {boolean}
   */


  get composed() {
    return false;
  }
  /**
   * The unix time of this event.
   * @type {number}
   */


  get timeStamp() {
    return this._timeStamp;
  }

}
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

},{}],11:[function(require,module,exports){
"use strict";

var __targetID = 0;
var __listenerMap = {
  touch: {},
  mouse: {},
  keyboard: {},
  devicemotion: {}
};
var __listenerCountMap = {
  touch: 0,
  mouse: 0,
  keyboard: 0,
  devicemotion: 0
};
var __enableCallbackMap = {
  touch: null,
  mouse: null,
  keyboard: null,
  //FIXME: Cocos Creator invokes addEventListener('devicemotion') when engine initializes, it will active sensor hardware.
  // In that case, CPU and temperature cost will increase. Therefore, we require developer to invoke 'jsb.device.setMotionEnabled(true)'
  // on native platforms since most games will not listen motion event.
  devicemotion: null // devicemotion: function() {
  //     jsb.device.setMotionEnabled(true);
  // }

};
var __disableCallbackMap = {
  touch: null,
  mouse: null,
  //FIXME: Cocos Creator invokes addEventListener('devicemotion') when engine initializes, it will active sensor hardware.
  // In that case, CPU and temperature cost will increase. Therefore, we require developer to invoke 'jsb.device.setMotionEnabled(true)'
  // on native platforms since most games will not listen motion event.
  keyboard: null,
  devicemotion: null // devicemotion: function() {
  //     jsb.device.setMotionEnabled(false);
  // }

};
const __handleEventNames = {
  touch: ['touchstart', 'touchmove', 'touchend', 'touchcancel'],
  mouse: ['mousedown', 'mousemove', 'mouseup', 'mousewheel'],
  keyboard: ['keydown', 'keyup', 'keypress'],
  devicemotion: ['devicemotion']
}; // Listener types

const CAPTURE = 1;
const BUBBLE = 2;
const ATTRIBUTE = 3;
/**
 * Check whether a given value is an object or not.
 * @param {any} x The value to check.
 * @returns {boolean} `true` if the value is an object.
 */

function isObject(x) {
  return x && typeof x === "object"; //eslint-disable-line no-restricted-syntax
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


class EventTarget {
  constructor() {
    this._targetID = ++__targetID;
    this._listenerCount = {
      touch: 0,
      mouse: 0,
      keyboard: 0,
      devicemotion: 0
    };
    this._listeners = new Map();
  }

  _associateSystemEventListener(eventName) {
    var handleEventNames;

    for (var key in __handleEventNames) {
      handleEventNames = __handleEventNames[key];

      if (handleEventNames.indexOf(eventName) > -1) {
        if (__enableCallbackMap[key] && __listenerCountMap[key] === 0) {
          __enableCallbackMap[key]();
        }

        if (this._listenerCount[key] === 0) __listenerMap[key][this._targetID] = this;
        ++this._listenerCount[key];
        ++__listenerCountMap[key];
        break;
      }
    }
  }

  _dissociateSystemEventListener(eventName) {
    var handleEventNames;

    for (var key in __handleEventNames) {
      handleEventNames = __handleEventNames[key];

      if (handleEventNames.indexOf(eventName) > -1) {
        if (this._listenerCount[key] <= 0) delete __listenerMap[key][this._targetID];
        --__listenerCountMap[key];

        if (__disableCallbackMap[key] && __listenerCountMap[key] === 0) {
          __disableCallbackMap[key]();
        }

        break;
      }
    }
  }
  /**
   * Add a given listener to this event target.
   * @param {string} eventName The event name to add.
   * @param {Function} listener The listener to add.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {boolean} `true` if the listener was added actually.
   */


  addEventListener(eventName, listener, options) {
    if (!listener) {
      return false;
    }

    if (typeof listener !== "function" && !isObject(listener)) {
      throw new TypeError("'listener' should be a function or an object.");
    }

    const listeners = this._listeners;
    const optionsIsObj = isObject(options);
    const capture = optionsIsObj ? Boolean(options.capture) : Boolean(options);
    const listenerType = capture ? CAPTURE : BUBBLE;
    const newNode = {
      listener,
      listenerType,
      passive: optionsIsObj && Boolean(options.passive),
      once: optionsIsObj && Boolean(options.once),
      next: null
    }; // Set it as the first node if the first node is null.

    let node = listeners.get(eventName);

    if (node === undefined) {
      listeners.set(eventName, newNode);

      this._associateSystemEventListener(eventName);

      return true;
    } // Traverse to the tail while checking duplication..


    let prev = null;

    while (node) {
      if (node.listener === listener && node.listenerType === listenerType) {
        // Should ignore duplication.
        return false;
      }

      prev = node;
      node = node.next;
    } // Add it.


    prev.next = newNode;

    this._associateSystemEventListener(eventName);

    return true;
  }
  /**
   * Remove a given listener from this event target.
   * @param {string} eventName The event name to remove.
   * @param {Function} listener The listener to remove.
   * @param {boolean|{capture?:boolean,passive?:boolean,once?:boolean}} [options] The options for this listener.
   * @returns {boolean} `true` if the listener was removed actually.
   */


  removeEventListener(eventName, listener, options) {
    if (!listener) {
      return false;
    }

    const listeners = this._listeners;
    const capture = isObject(options) ? Boolean(options.capture) : Boolean(options);
    const listenerType = capture ? CAPTURE : BUBBLE;
    let prev = null;
    let node = listeners.get(eventName);

    while (node) {
      if (node.listener === listener && node.listenerType === listenerType) {
        if (prev) {
          prev.next = node.next;
        } else if (node.next) {
          listeners.set(eventName, node.next);
        } else {
          listeners.delete(eventName);
        }

        this._dissociateSystemEventListener(eventName);

        return true;
      }

      prev = node;
      node = node.next;
    }

    return false;
  }
  /**
   * Dispatch a given event.
   * @param {Event|{type:string}} event The event to dispatch.
   * @returns {boolean} `false` if canceled.
   */


  dispatchEvent(event) {
    if (!event || typeof event.type !== "string") {
      throw new TypeError("\"event.type\" should be a string.");
    }

    const eventName = event.type;
    var onFunc = this['on' + eventName];

    if (onFunc && typeof onFunc === 'function') {
      event._target = event._currentTarget = this;
      onFunc.call(this, event);
      event._target = event._currentTarget = null;
      event._eventPhase = 0;
      event._passiveListener = null;
      if (event.defaultPrevented) return false;
    } // If listeners aren't registered, terminate.


    const listeners = this._listeners;
    let node = listeners.get(eventName);

    if (!node) {
      return true;
    }

    event._target = event._currentTarget = this; // This doesn't process capturing phase and bubbling phase.
    // This isn't participating in a tree.

    let prev = null;

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
      } // Call this listener


      event._passiveListener = node.passive ? node.listener : null;

      if (typeof node.listener === "function") {
        node.listener.call(this, event);
      } // Break if `event.stopImmediatePropagation` was called.


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

}

module.exports = EventTarget;

},{}],12:[function(require,module,exports){
"use strict";

const EventTarget = require('./EventTarget');

class FileReader extends EventTarget {
  construct() {
    this.result = null;
  } // Aborts the read operation. Upon return, the readyState will be DONE.


  abort() {} // Starts reading the contents of the specified Blob, once finished, the result attribute contains an ArrayBuffer representing the file's data.


  readAsArrayBuffer() {} // Starts reading the contents of the specified Blob, once finished, the result attribute contains a data: URL representing the file's data.


  readAsDataURL(blob) {
    this.result = 'data:image/png;base64,' + window.btoa(blob);
    var event = new Event('load');
    this.dispatchEvent(event);
  } // Starts reading the contents of the specified Blob, once finished, the result attribute contains the contents of the file as a text string.


  readAsText() {}

}

module.exports = FileReader;

},{"./EventTarget":11}],13:[function(require,module,exports){
"use strict";

class FontFace {
  constructor(family, source, descriptors) {
    this.family = family;
    this.source = source;
    this.descriptors = descriptors;
    this._status = 'unloaded';
    this._loaded = new Promise((resolve, reject) => {
      this._resolveCB = resolve;
      this._rejectCB = reject;
    });
  }

  load() {// class FontFaceSet, add(fontFace) have done the load work
  }

  get status() {
    return this._status;
  }

  get loaded() {
    return this._loaded;
  }

}

module.exports = FontFace;

},{}],14:[function(require,module,exports){
"use strict";

const EventTarget = require('./EventTarget');

const Event = require('./Event');

class FontFaceSet extends EventTarget {
  constructor() {
    super();
    this._status = 'loading';
  }

  get status() {
    return this._status;
  }

  set onloading(listener) {
    this.addEventListener('loading', listener);
  }

  set onloadingdone(listener) {
    this.addEventListener('loadingdone', listener);
  }

  set onloadingerror(listener) {
    this.addEventListener('loadingerror', listener);
  }

  add(fontFace) {
    this._status = fontFace._status = 'loading';
    this.dispatchEvent(new Event('loading')); // Call native binding method to set the ttf font to native platform.

    let family = jsb.loadFont(fontFace.family, fontFace.source);
    setTimeout(() => {
      if (family) {
        fontFace._status = this._status = 'loaded';

        fontFace._resolveCB();

        this.dispatchEvent(new Event('loadingdone'));
      } else {
        fontFace._status = this._status = 'error';

        fontFace._rejectCB();

        this.dispatchEvent(new Event('loadingerror'));
      }
    }, 0);
  }

  clear() {}

  delete() {}

  load() {}

  ready() {}

}

module.exports = FontFaceSet;

},{"./Event":10,"./EventTarget":11}],15:[function(require,module,exports){
"use strict";

const HTMLElement = require('./HTMLElement');

const ImageData = require('./ImageData');

const DOMRect = require('./DOMRect');

const CanvasRenderingContext2D = require('./CanvasRenderingContext2D');

const clamp = function (value) {
  value = Math.round(value);
  return value < 0 ? 0 : value < 255 ? value : 255;
};

class CanvasGradient {
  constructor() {
    console.log('==> CanvasGradient constructor');
  }

  addColorStop(offset, color) {
    console.log('==> CanvasGradient addColorStop');
  }

}

class TextMetrics {
  constructor(width) {
    this._width = width;
  }

  get width() {
    return this._width;
  }

}

class HTMLCanvasElement extends HTMLElement {
  constructor(width, height) {
    super('canvas');
    this.id = 'glcanvas';
    this.type = 'canvas';
    this.top = 0;
    this.left = 0;
    this._width = width ? Math.ceil(width) : 0;
    this._height = height ? Math.ceil(height) : 0;
    this._context2D = null;
    this._dataInner = null;
  } //REFINE: implement opts.


  getContext(name, opts) {
    const self = this;

    if (name === '2d') {
      if (!this._context2D) {
        this._context2D = new CanvasRenderingContext2D(this._width, this._height);
        this._context2D._canvas = this;

        this._context2D._setCanvasBufferUpdatedCallback(data => {
          // FIXME: Canvas's data will take 2x memory size, one in C++, another is obtained by Uint8Array here.
          self._dataInner = new ImageData(data, self._width, self._height);
        });
      }

      return this._context2D;
    }

    return null;
  }

  get _data() {
    if (this._context2D === null) {
      return null;
    }

    if (!this._dataInner) {
      this._context2D.fetchData();
    }

    return this._dataInner;
  }

  set _data(data) {
    this._dataInner = data;
  }

  set width(width) {
    width = Math.ceil(width);

    if (this._width !== width) {
      this._dataInner = null;
      this._width = width;

      if (this._context2D) {
        this._context2D.width = width;
      }
    }
  }

  get width() {
    return this._width;
  }

  set height(height) {
    height = Math.ceil(height);

    if (this._height !== height) {
      this._dataInner = null;
      this._height = height;

      if (this._context2D) {
        this._context2D.height = height;
      }
    }
  }

  get height() {
    return this._height;
  }

  get clientWidth() {
    return window.innerWidth;
  }

  get clientHeight() {
    return window.innerHeight;
  }

  get data() {
    if (this._data) {
      return this._data.data;
    }

    return null;
  }

  getBoundingClientRect() {
    return new DOMRect(0, 0, window.innerWidth, window.innerHeight);
  }

  requestPointerLock() {
    jsb.setCursorEnabled(false);
  }

}

module.exports = HTMLCanvasElement;

},{"./CanvasRenderingContext2D":6,"./DOMRect":7,"./HTMLElement":16,"./ImageData":22}],16:[function(require,module,exports){
"use strict";

const Element = require('./Element');

const {
  noop
} = require('./util');

class HTMLElement extends Element {
  constructor(tagName = '') {
    super();
    this.tagName = tagName.toUpperCase();
    this.className = '';
    this.children = [];
    this.style = {
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`
    };
    this.innerHTML = '';
    this.parentElement = window.__canvas;
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  getAttribute(name) {
    return this[name];
  }

  focus() {}

}

module.exports = HTMLElement;

},{"./Element":9,"./util":33}],17:[function(require,module,exports){
"use strict";

const HTMLElement = require('./HTMLElement');

const Event = require('./Event');

class HTMLImageElement extends HTMLElement {
  constructor(width, height, isCalledFromImage) {
    if (!isCalledFromImage) {
      throw new TypeError("Illegal constructor, use 'new Image(w, h); instead!'");
    }

    super('img');
    this.width = width ? width : 0;
    this.height = height ? height : 0;
    this._data = null;
    this._src = null;
    this.complete = false;
    this.crossOrigin = null;
  }

  destroy() {
    if (this._data) {
      jsb.destroyImage(this._data);
      this._data = null;
    }

    this._src = null;
  }

  set src(src) {
    this._src = src;
    if (src === '') return;
    jsb.loadImage(src, info => {
      if (!info) {
        this._data = null;
        var event = new Event('error');
        this.dispatchEvent(event);
        return;
      }

      this.width = this.naturalWidth = info.width;
      this.height = this.naturalHeight = info.height;
      this._data = info.data;
      this.complete = true;
      var event = new Event('load');
      this.dispatchEvent(event);
    });
  }

  get src() {
    return this._src;
  }

  get clientWidth() {
    return this.width;
  }

  get clientHeight() {
    return this.height;
  }

  getBoundingClientRect() {
    return new DOMRect(0, 0, this.width, this.height);
  }

}

module.exports = HTMLImageElement;

},{"./Event":10,"./HTMLElement":16}],18:[function(require,module,exports){
"use strict";

const HTMLElement = require('./HTMLElement');

const MediaError = require('./MediaError');

const HAVE_NOTHING = 0;
const HAVE_METADATA = 1;
const HAVE_CURRENT_DATA = 2;
const HAVE_FUTURE_DATA = 3;
const HAVE_ENOUGH_DATA = 4;

class HTMLMediaElement extends HTMLElement {
  constructor(type) {
    super(type);
    this._volume = 1.0;
    this._duration = 0;
    this._isEnded = false;
    this._isMute = false;
    this._readyState = HAVE_NOTHING;
    this._error = new MediaError();
  }

  addTextTrack() {}

  captureStream() {}

  fastSeek() {}

  load() {}

  pause() {}

  play() {}

  canPlayType(mediaType) {
    return '';
  }

  set volume(volume) {
    this._volume = volume;
  }

  get volume() {
    return this._volume;
  }

  get duration() {
    return this._duration;
  }

  get ended() {
    return this._isEnded;
  }

  get muted() {
    return this._isMute;
  }

  get readyState() {
    return this._readyState;
  }

  get error() {
    return this._error;
  }

  get currentTime() {
    return 0;
  }

}

module.exports = HTMLMediaElement;

},{"./HTMLElement":16,"./MediaError":24}],19:[function(require,module,exports){
"use strict";

const HTMLElement = require('./HTMLElement');

const Event = require('./Event');

const _importmaps = [];

class HTMLScriptElement extends HTMLElement {
  constructor(width, height) {
    super('script');
  }

  set type(type) {
    if (type === "systemjs-importmap") {
      if (_importmaps.indexOf(this) === -1) {
        _importmaps.push(this);
      }
    }
  }

  set src(url) {
    setTimeout(() => {
      require(url);

      this.dispatchEvent(new Event('load'));
    }, 0);
  }

}

HTMLScriptElement._getAllScriptElementsSystemJSImportType = function () {
  return _importmaps;
};

module.exports = HTMLScriptElement;

},{"./Event":10,"./HTMLElement":16}],20:[function(require,module,exports){
"use strict";

const HTMLMediaElement = require('./HTMLMediaElement');

class HTMLVideoElement extends HTMLMediaElement {
  constructor() {
    super('video');
  }

  canPlayType(type) {
    if (type === 'video/mp4') return true;
    return false;
  }

}

module.exports = HTMLVideoElement;

},{"./HTMLMediaElement":18}],21:[function(require,module,exports){
"use strict";

let HTMLImageElement = require('./HTMLImageElement');

class Image extends HTMLImageElement {
  constructor(width, height) {
    super(width, height, true);
  }

}

module.exports = Image;

},{"./HTMLImageElement":17}],22:[function(require,module,exports){
"use strict";

class ImageData {
  // var imageData = new ImageData(array, width, height);
  // var imageData = new ImageData(width, height);
  constructor(array, width, height) {
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

  get data() {
    return this._data;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

}

module.exports = ImageData;

},{}],23:[function(require,module,exports){
"use strict";

const Event = require('./Event');

const __numberShiftMap = {
  '48': ')',
  // 0
  '49': '!',
  // 1
  '50': '@',
  // 2
  '51': '#',
  // 3
  '52': '$',
  // 4
  '53': '%',
  // 5
  '54': '^',
  // 6
  '55': '&',
  // 7
  '56': '*',
  // 8
  '57': '(' // 9

};
var __capsLockActive = false;

class KeyboardEvent extends Event {
  constructor(type, KeyboardEventInit) {
    super(type);

    if (typeof KeyboardEventInit === 'object') {
      this._altKeyActive = KeyboardEventInit.altKey ? KeyboardEventInit.altKey : false;
      this._ctrlKeyActive = KeyboardEventInit.ctrlKey ? KeyboardEventInit.ctrlKey : false;
      this._metaKeyActive = KeyboardEventInit.metaKey ? KeyboardEventInit.metaKey : false;
      this._shiftKeyActive = KeyboardEventInit.shiftKey ? KeyboardEventInit.shiftKey : false;
      this._keyCode = KeyboardEventInit.keyCode ? KeyboardEventInit.keyCode : -1;
      this._repeat = KeyboardEventInit.repeat ? KeyboardEventInit.repeat : false;
    } else {
      this._altKeyActive = false;
      this._ctrlKeyActive = false;
      this._metaKeyActive = false;
      this._shiftKeyActive = false;
      this._keyCode = -1;
      this._repeat = false;
    }

    var keyCode = this._keyCode;

    if (keyCode >= 48 && keyCode <= 57) {
      // 0 ~ 9
      var number = keyCode - 48;
      this._code = 'Digit' + number;
      this._key = this._shiftKeyActive ? __numberShiftMap[keyCode] : '' + number;
    } else if (keyCode >= 10048 && keyCode <= 10057) {
      // Numberpad 0 ~ 9
      // reset to web keyCode since it's a hack in C++ for distinguish numbers in Numberpad.
      keyCode = this._keyCode = keyCode - 10000;
      var number = keyCode - 48;
      this._code = 'Numpad' + number;
      this._key = '' + number;
    } else if (keyCode >= 65 && keyCode <= 90) {
      // A ~ Z
      var charCode = String.fromCharCode(keyCode);
      this._code = 'Key' + charCode;
      this._key = this._shiftKeyActive ^ __capsLockActive ? charCode : charCode.toLowerCase();
    } else if (keyCode >= 97 && keyCode <= 122) {
      // a ~ z
      var charCode = String.fromCharCode(keyCode);
      this._keyCode = keyCode - (97 - 65); // always return uppercase keycode for backward-compatibility

      this._code = 'Key' + charCode;
      this._key = this._shiftKeyActive ^ __capsLockActive ? charCode.toUpperCase() : charCode;
    } else if (keyCode >= 112 && keyCode <= 123) {
      // F1 ~ F12
      this._code = this._key = 'F' + (keyCode - 111);
    } else if (keyCode === 27) {
      this._code = this._key = 'Escape';
    } else if (keyCode === 189) {
      this._code = 'Minus';
      this._key = this._shiftKeyActive ? '_' : '-';
    } else if (keyCode === 187) {
      this._code = 'Equal';
      this._key = this._shiftKeyActive ? '+' : '=';
    } else if (keyCode === 220) {
      this._code = 'Backslash';
      this._key = this._shiftKeyActive ? '|' : '\\';
    } else if (keyCode === 192) {
      this._code = 'Backquote';
      this._key = this._shiftKeyActive ? '~' : '`';
    } else if (keyCode === 8) {
      this._code = this._key = 'Backspace';
    } else if (keyCode === 13) {
      this._code = this._key = 'Enter';
    } else if (keyCode === 219) {
      this._code = 'BracketLeft';
      this._key = this._shiftKeyActive ? '{' : '[';
    } else if (keyCode === 221) {
      this._code = 'BracketRight';
      this._key = this._shiftKeyActive ? '}' : ']';
    } else if (keyCode === 186) {
      this._code = 'Semicolon';
      this._key = this._shiftKeyActive ? ':' : ';';
    } else if (keyCode === 222) {
      this._code = 'Quote';
      this._key = this._shiftKeyActive ? '"' : "'";
    } else if (keyCode === 9) {
      this._code = this._key = 'Tab';
    } else if (keyCode === 17) {
      this._code = 'ControlLeft';
      this._key = 'Control';
    } else if (keyCode === 20017) {
      this._keyCode = 17; // Reset to the real value.

      this._code = 'ControlRight';
      this._key = 'Control';
    } else if (keyCode === 16) {
      this._code = 'ShiftLeft';
      this._key = 'Shift';
    } else if (keyCode === 20016) {
      this._keyCode = 16; // Reset to the real value.

      this._code = 'ShiftRight';
      this._key = 'Shift';
    } else if (keyCode === 18) {
      this._code = 'AltLeft';
      this._key = 'Alt';
    } else if (keyCode === 20018) {
      this._keyCode = 18; // Reset to the real value.

      this._code = 'AltRight';
      this._key = 'Alt';
    } else if (keyCode === 91) {
      this._code = 'MetaLeft';
      this._key = 'Meta';
    } else if (keyCode === 93) {
      this._code = 'MetaRight';
      this._key = 'Meta';
    } else if (keyCode === 37) {
      this._code = this._key = 'ArrowLeft';
    } else if (keyCode === 38) {
      this._code = this._key = 'ArrowUp';
    } else if (keyCode === 39) {
      this._code = this._key = 'ArrowRight';
    } else if (keyCode === 40) {
      this._code = this._key = 'ArrowDown';
    } else if (keyCode === 20093) {
      this._keyCode = 93; // Bug of brower since its keycode is the same as MetaRight.

      this._code = this._key = 'ContextMenu';
    } else if (keyCode === 20013) {
      this._keyCode = 13;
      this._code = 'NumpadEnter';
      this._key = 'Enter';
    } else if (keyCode === 107) {
      this._code = 'NumpadAdd';
      this._key = '+';
    } else if (keyCode === 109) {
      this._code = 'NumpadSubtract';
      this._key = '-';
    } else if (keyCode === 106) {
      this._code = 'NumpadMultiply';
      this._key = '*';
    } else if (keyCode === 111) {
      this._code = 'NumpadDivide';
      this._key = '/';
    } else if (keyCode === 12) {
      this._code = 'NumLock';
      this._key = 'Clear';
    } else if (keyCode === 124) {
      this._code = this._key = 'F13';
    } else if (keyCode === 36) {
      this._code = this._key = 'Home';
    } else if (keyCode === 33) {
      this._code = this._key = 'PageUp';
    } else if (keyCode === 34) {
      this._code = this._key = 'PageDown';
    } else if (keyCode === 35) {
      this._code = this._key = 'End';
    } else if (keyCode === 188) {
      this._code = 'Comma';
      this._key = this._shiftKeyActive ? '<' : ',';
    } else if (keyCode === 190) {
      this._code = 'Period';
      this._key = this._shiftKeyActive ? '>' : '.';
    } else if (keyCode === 191) {
      this._code = 'Slash';
      this._key = this._shiftKeyActive ? '?' : '/';
    } else if (keyCode === 32) {
      this._code = 'Space';
      this._key = ' ';
    } else if (keyCode === 46) {
      this._code = this._key = 'Delete';
    } else if (keyCode === 110) {
      this._code = 'NumpadDecimal';
      this._key = '.';
    } else if (keyCode === 20) {
      this._code = this._key = 'CapsLock';

      if (type === 'keyup') {
        __capsLockActive = !__capsLockActive;
      }
    } else {
      console.log("Unknown keyCode: " + this._keyCode);
    }
  } // Returns a Boolean indicating if the modifier key, like Alt, Shift, Ctrl, or Meta, was pressed when the event was created.


  getModifierState() {
    return false;
  } // Returns a Boolean that is true if the Alt ( Option or ⌥ on OS X) key was active when the key event was generated.


  get altKey() {
    return this._altKeyActive;
  } // Returns a DOMString with the code value of the key represented by the event.


  get code() {
    return this._code;
  } // Returns a Boolean that is true if the Ctrl key was active when the key event was generated.


  get ctrlKey() {
    return this._ctrlKeyActive;
  } // Returns a Boolean that is true if the event is fired between after compositionstart and before compositionend.


  get isComposing() {
    return false;
  } // Returns a DOMString representing the key value of the key represented by the event.


  get key() {
    return this._key;
  }

  get keyCode() {
    return this._keyCode;
  } // Returns a Number representing the location of the key on the keyboard or other input device.


  get location() {
    return 0;
  } // Returns a Boolean that is true if the Meta key (on Mac keyboards, the ⌘ Command key; on Windows keyboards, the Windows key (⊞)) was active when the key event was generated.


  get metaKey() {
    return this._metaKeyActive;
  } // Returns a Boolean that is true if the key is being held down such that it is automatically repeating.


  get repeat() {
    return this._repeat;
  } // Returns a Boolean that is true if the Shift key was active when the key event was generated.


  get shiftKey() {
    return this._shiftKeyActive;
  }

}

module.exports = KeyboardEvent;

},{"./Event":10}],24:[function(require,module,exports){
"use strict";

const MEDIA_ERR_ABORTED = 1;
const MEDIA_ERR_NETWORK = 2;
const MEDIA_ERR_DECODE = 3;
const MEDIA_ERR_SRC_NOT_SUPPORTED = 4;

class MediaError {
  constructor() {}

  get code() {
    return MEDIA_ERR_ABORTED;
  }

  get message() {
    return "";
  }

}

module.exports = MediaError;

},{}],25:[function(require,module,exports){
"use strict";

const Event = require('./Event');

class MouseEvent extends Event {
  constructor(type, initArgs) {
    super(type);
    this._button = initArgs.button;
    this._which = initArgs.which;
    this._wheelDelta = initArgs.wheelDelta;
    this._clientX = initArgs.clientX;
    this._clientY = initArgs.clientY;
    this._screenX = initArgs.screenX;
    this._screenY = initArgs.screenY;
    this._pageX = initArgs.pageX;
    this._pageY = initArgs.pageY;
  }

  get button() {
    return this._button;
  }

  get which() {
    return this._which;
  }

  get wheelDelta() {
    return this._wheelDelta;
  }

  get clientX() {
    return this._clientX;
  }

  get clientY() {
    return this._clientY;
  }

  get screenX() {
    return this._screenX;
  }

  get screenY() {
    return this._screenY;
  }

  get pageX() {
    return this._pageX;
  }

  get pageY() {
    return this._pageY;
  }

}

module.exports = MouseEvent;

},{"./Event":10}],26:[function(require,module,exports){
"use strict";

const EventTarget = require('./EventTarget');

class Node extends EventTarget {
  constructor() {
    super();
    this.childNodes = [];
    this.parentNode = window.__canvas;
  }

  appendChild(node) {
    if (node instanceof Node) {
      this.childNodes.push(node);
    } else {
      throw new TypeError('Failed to executed \'appendChild\' on \'Node\': parameter 1 is not of type \'Node\'.');
    }
  }

  insertBefore(newNode, referenceNode) {
    //REFINE:
    return newNode;
  }

  replaceChild(newChild, oldChild) {
    //REFINE:
    return oldChild;
  }

  cloneNode() {
    const copyNode = Object.create(this);
    Object.assign(copyNode, this);
    return copyNode;
  }

  removeChild(node) {
    const index = this.childNodes.findIndex(child => child === node);

    if (index > -1) {
      return this.childNodes.splice(index, 1);
    }

    return null;
  }

  contains(node) {
    return this.childNodes.indexOf(node) > -1;
  }

}

module.exports = Node;

},{"./EventTarget":11}],27:[function(require,module,exports){
"use strict";

const Event = require('./Event');

class TouchEvent extends Event {
  constructor(type, touchEventInit) {
    super(type);
    this.touches = [];
    this.targetTouches = [];
    this.changedTouches = [];
  }

}

module.exports = TouchEvent;

},{"./Event":10}],28:[function(require,module,exports){
"use strict";

const HTMLElement = require('./HTMLElement');

const Image = require('./Image');

const HTMLCanvasElement = require('./HTMLCanvasElement');

const HTMLVideoElement = require('./HTMLVideoElement');

const HTMLScriptElement = require('./HTMLScriptElement');

const Node = require('./Node');

const FontFaceSet = require('./FontFaceSet');

class Document extends Node {
  constructor() {
    super();
    this.readyState = 'complete';
    this.visibilityState = 'visible';
    this.documentElement = window;
    this.hidden = false;
    this.style = {};
    this.location = require('./location');
    this.head = new HTMLElement('head');
    this.body = new HTMLElement('body');
    this.fonts = new FontFaceSet();
    this.scripts = [];
  }

  createElementNS(namespaceURI, qualifiedName, options) {
    return this.createElement(qualifiedName);
  }

  createElement(tagName) {
    if (tagName === 'canvas') {
      return new HTMLCanvasElement(1, 1);
    } else if (tagName === 'img') {
      return new Image();
    } else if (tagName === 'video') {
      return new HTMLVideoElement();
    } else if (tagName === 'script') {
      return new HTMLScriptElement();
    }

    return new HTMLElement(tagName);
  }

  getElementById(id) {
    if (id === window.__canvas.id || id === 'canvas') {
      return window.__canvas;
    }

    return new HTMLElement(id);
  }

  getElementsByTagName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.__canvas];
    }

    return [new HTMLElement(tagName)];
  }

  getElementsByName(tagName) {
    if (tagName === 'head') {
      return [document.head];
    } else if (tagName === 'body') {
      return [document.body];
    } else if (tagName === 'canvas') {
      return [window.__canvas];
    }

    return [new HTMLElement(tagName)];
  }

  querySelector(query) {
    if (query === 'head') {
      return document.head;
    } else if (query === 'body') {
      return document.body;
    } else if (query === 'canvas') {
      return window.__canvas;
    } else if (query === `#${window.__canvas.id}`) {
      return window.__canvas;
    }

    return new HTMLElement(query);
  }

  querySelectorAll(query) {
    if (query === 'head') {
      return [document.head];
    } else if (query === 'body') {
      return [document.body];
    } else if (query === 'canvas') {
      return [window.__canvas];
    } else if (query.startsWith('script[type="systemjs-importmap"]')) {
      return HTMLScriptElement._getAllScriptElementsSystemJSImportType();
    }

    return [new HTMLElement(query)];
  }

  createTextNode() {
    return new HTMLElement('text');
  }

  elementFromPoint() {
    return window.canvas;
  }

  createEvent(type) {
    if (window[type]) {
      return new window[type]();
    }

    return null;
  }

  exitPointerLock() {
    jsb.setCursorEnabled(true);
  }

}

let document = new Document();
module.exports = document;

},{"./FontFaceSet":14,"./HTMLCanvasElement":15,"./HTMLElement":16,"./HTMLScriptElement":19,"./HTMLVideoElement":20,"./Image":21,"./Node":26,"./location":31}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.fetch = fetch;
exports.DOMException = void 0;
var self = window;
var support = {
  searchParams: 'URLSearchParams' in self,
  iterable: 'Symbol' in self && 'iterator' in Symbol,
  blob: 'FileReader' in self && 'Blob' in self && function () {
    try {
      new Blob();
      return true;
    } catch (e) {
      return false;
    }
  }(),
  formData: 'FormData' in self,
  arrayBuffer: 'ArrayBuffer' in self
};

function isDataView(obj) {
  return obj && DataView.prototype.isPrototypeOf(obj);
}

if (support.arrayBuffer) {
  var viewClasses = ['[object Int8Array]', '[object Uint8Array]', '[object Uint8ClampedArray]', '[object Int16Array]', '[object Uint16Array]', '[object Int32Array]', '[object Uint32Array]', '[object Float32Array]', '[object Float64Array]'];

  var isArrayBufferView = ArrayBuffer.isView || function (obj) {
    return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
  };
}

function normalizeName(name) {
  if (typeof name !== 'string') {
    name = String(name);
  }

  if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name) || name === '') {
    throw new TypeError('Invalid character in header field name');
  }

  return name.toLowerCase();
}

function normalizeValue(value) {
  if (typeof value !== 'string') {
    value = String(value);
  }

  return value;
} // Build a destructive iterator for the value list


function iteratorFor(items) {
  var iterator = {
    next: function () {
      var value = items.shift();
      return {
        done: value === undefined,
        value: value
      };
    }
  };

  if (support.iterable) {
    iterator[Symbol.iterator] = function () {
      return iterator;
    };
  }

  return iterator;
}

function Headers(headers) {
  this.map = {};

  if (headers instanceof Headers) {
    headers.forEach(function (value, name) {
      this.append(name, value);
    }, this);
  } else if (Array.isArray(headers)) {
    headers.forEach(function (header) {
      this.append(header[0], header[1]);
    }, this);
  } else if (headers) {
    Object.getOwnPropertyNames(headers).forEach(function (name) {
      this.append(name, headers[name]);
    }, this);
  }
}

Headers.prototype.append = function (name, value) {
  name = normalizeName(name);
  value = normalizeValue(value);
  var oldValue = this.map[name];
  this.map[name] = oldValue ? oldValue + ', ' + value : value;
};

Headers.prototype['delete'] = function (name) {
  delete this.map[normalizeName(name)];
};

Headers.prototype.get = function (name) {
  name = normalizeName(name);
  return this.has(name) ? this.map[name] : null;
};

Headers.prototype.has = function (name) {
  return this.map.hasOwnProperty(normalizeName(name));
};

Headers.prototype.set = function (name, value) {
  this.map[normalizeName(name)] = normalizeValue(value);
};

Headers.prototype.forEach = function (callback, thisArg) {
  for (var name in this.map) {
    if (this.map.hasOwnProperty(name)) {
      callback.call(thisArg, this.map[name], name, this);
    }
  }
};

Headers.prototype.keys = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push(name);
  });
  return iteratorFor(items);
};

Headers.prototype.values = function () {
  var items = [];
  this.forEach(function (value) {
    items.push(value);
  });
  return iteratorFor(items);
};

Headers.prototype.entries = function () {
  var items = [];
  this.forEach(function (value, name) {
    items.push([name, value]);
  });
  return iteratorFor(items);
};

if (support.iterable) {
  Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
}

function consumed(body) {
  if (body.bodyUsed) {
    return Promise.reject(new TypeError('Already read'));
  }

  body.bodyUsed = true;
}

function fileReaderReady(reader) {
  return new Promise(function (resolve, reject) {
    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function () {
      reject(reader.error);
    };
  });
}

function readBlobAsArrayBuffer(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsArrayBuffer(blob);
  return promise;
}

function readBlobAsText(blob) {
  var reader = new FileReader();
  var promise = fileReaderReady(reader);
  reader.readAsText(blob);
  return promise;
}

function readArrayBufferAsText(buf) {
  var view = new Uint8Array(buf);
  var chars = new Array(view.length);

  for (var i = 0; i < view.length; i++) {
    chars[i] = String.fromCharCode(view[i]);
  }

  return chars.join('');
}

function bufferClone(buf) {
  if (buf.slice) {
    return buf.slice(0);
  } else {
    var view = new Uint8Array(buf.byteLength);
    view.set(new Uint8Array(buf));
    return view.buffer;
  }
}

function Body() {
  this.bodyUsed = false;

  this._initBody = function (body) {
    this._bodyInit = body;

    if (!body) {
      this._bodyText = '';
    } else if (typeof body === 'string') {
      this._bodyText = body;
    } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
      this._bodyBlob = body;
    } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
      this._bodyFormData = body;
    } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
      this._bodyText = body.toString();
    } else if (support.arrayBuffer && support.blob && isDataView(body)) {
      this._bodyArrayBuffer = bufferClone(body.buffer); // IE 10-11 can't handle a DataView body.

      this._bodyInit = new Blob([this._bodyArrayBuffer]);
    } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
      this._bodyArrayBuffer = bufferClone(body);
    } else {
      this._bodyText = body = Object.prototype.toString.call(body);
    }

    if (!this.headers.get('content-type')) {
      if (typeof body === 'string') {
        this.headers.set('content-type', 'text/plain;charset=UTF-8');
      } else if (this._bodyBlob && this._bodyBlob.type) {
        this.headers.set('content-type', this._bodyBlob.type);
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
      }
    }
  };

  if (support.blob) {
    this.blob = function () {
      var rejected = consumed(this);

      if (rejected) {
        return rejected;
      }

      if (this._bodyBlob) {
        return Promise.resolve(this._bodyBlob);
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(new Blob([this._bodyArrayBuffer]));
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as blob');
      } else {
        return Promise.resolve(new Blob([this._bodyText]));
      }
    };

    this.arrayBuffer = function () {
      if (this._bodyArrayBuffer) {
        return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
      } else {
        return this.blob().then(readBlobAsArrayBuffer);
      }
    };
  }

  this.text = function () {
    var rejected = consumed(this);

    if (rejected) {
      return rejected;
    }

    if (this._bodyBlob) {
      return readBlobAsText(this._bodyBlob);
    } else if (this._bodyArrayBuffer) {
      return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
    } else if (this._bodyFormData) {
      throw new Error('could not read FormData body as text');
    } else {
      return Promise.resolve(this._bodyText);
    }
  };

  if (support.formData) {
    this.formData = function () {
      return this.text().then(decode);
    };
  }

  this.json = function () {
    return this.text().then(JSON.parse);
  };

  return this;
} // HTTP methods whose capitalization should be normalized


var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

function normalizeMethod(method) {
  var upcased = method.toUpperCase();
  return methods.indexOf(upcased) > -1 ? upcased : method;
}

function Request(input, options) {
  options = options || {};
  var body = options.body;

  if (input instanceof Request) {
    if (input.bodyUsed) {
      throw new TypeError('Already read');
    }

    this.url = input.url;
    this.credentials = input.credentials;

    if (!options.headers) {
      this.headers = new Headers(input.headers);
    }

    this.method = input.method;
    this.mode = input.mode;
    this.signal = input.signal;

    if (!body && input._bodyInit != null) {
      body = input._bodyInit;
      input.bodyUsed = true;
    }
  } else {
    this.url = String(input);
  }

  this.credentials = options.credentials || this.credentials || 'same-origin';

  if (options.headers || !this.headers) {
    this.headers = new Headers(options.headers);
  }

  this.method = normalizeMethod(options.method || this.method || 'GET');
  this.mode = options.mode || this.mode || null;
  this.signal = options.signal || this.signal;
  this.referrer = null;

  if ((this.method === 'GET' || this.method === 'HEAD') && body) {
    throw new TypeError('Body not allowed for GET or HEAD requests');
  }

  this._initBody(body);
}

Request.prototype.clone = function () {
  return new Request(this, {
    body: this._bodyInit
  });
};

function decode(body) {
  var form = new FormData();
  body.trim().split('&').forEach(function (bytes) {
    if (bytes) {
      var split = bytes.split('=');
      var name = split.shift().replace(/\+/g, ' ');
      var value = split.join('=').replace(/\+/g, ' ');
      form.append(decodeURIComponent(name), decodeURIComponent(value));
    }
  });
  return form;
}

function parseHeaders(rawHeaders) {
  var headers = new Headers(); // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
  // https://tools.ietf.org/html/rfc7230#section-3.2

  var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
  preProcessedHeaders.split(/\r?\n/).forEach(function (line) {
    var parts = line.split(':');
    var key = parts.shift().trim();

    if (key) {
      var value = parts.join(':').trim();
      headers.append(key, value);
    }
  });
  return headers;
}

Body.call(Request.prototype);

function Response(bodyInit, options) {
  if (!options) {
    options = {};
  }

  this.type = 'default';
  this.status = options.status === undefined ? 200 : options.status;
  this.ok = this.status >= 200 && this.status < 300;
  this.statusText = 'statusText' in options ? options.statusText : 'OK';
  this.headers = new Headers(options.headers);
  this.url = options.url || '';

  this._initBody(bodyInit);
}

Body.call(Response.prototype);

Response.prototype.clone = function () {
  return new Response(this._bodyInit, {
    status: this.status,
    statusText: this.statusText,
    headers: new Headers(this.headers),
    url: this.url
  });
};

Response.error = function () {
  var response = new Response(null, {
    status: 0,
    statusText: ''
  });
  response.type = 'error';
  return response;
};

var redirectStatuses = [301, 302, 303, 307, 308];

Response.redirect = function (url, status) {
  if (redirectStatuses.indexOf(status) === -1) {
    throw new RangeError('Invalid status code');
  }

  return new Response(null, {
    status: status,
    headers: {
      location: url
    }
  });
};

var DOMException = self.DOMException;
exports.DOMException = DOMException;

try {
  new DOMException();
} catch (err) {
  exports.DOMException = DOMException = function (message, name) {
    this.message = message;
    this.name = name;
    var error = Error(message);
    this.stack = error.stack;
  };

  DOMException.prototype = Object.create(Error.prototype);
  DOMException.prototype.constructor = DOMException;
}

function fetch(input, init) {
  return new Promise(function (resolve, reject) {
    var request = new Request(input, init);

    if (request.signal && request.signal.aborted) {
      return reject(new DOMException('Aborted', 'AbortError'));
    }

    var xhr = new XMLHttpRequest();

    function abortXhr() {
      xhr.abort();
    }

    xhr.onload = function () {
      var options = {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders() || '')
      };
      options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
      var body = 'response' in xhr ? xhr.response : xhr.responseText;
      resolve(new Response(body, options));
    };

    xhr.onerror = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.ontimeout = function () {
      reject(new TypeError('Network request failed'));
    };

    xhr.onabort = function () {
      reject(new DOMException('Aborted', 'AbortError'));
    };

    xhr.open(request.method, request.url, true);

    if (request.credentials === 'include') {
      xhr.withCredentials = true;
    } else if (request.credentials === 'omit') {
      xhr.withCredentials = false;
    }

    if ('responseType' in xhr && support.blob) {
      xhr.responseType = 'blob';
    }

    request.headers.forEach(function (value, name) {
      xhr.setRequestHeader(name, value);
    });

    if (request.signal) {
      request.signal.addEventListener('abort', abortXhr);

      xhr.onreadystatechange = function () {
        // DONE (success or failure)
        if (xhr.readyState === 4) {
          request.signal.removeEventListener('abort', abortXhr);
        }
      };
    }

    xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
  });
}

fetch.polyfill = true;

},{}],30:[function(require,module,exports){
"use strict";

require('./window');

},{"./window":34}],31:[function(require,module,exports){
"use strict";

const location = {
  href: 'game.js',
  pathname: 'game.js',
  search: '',
  hash: '',
  protocol: '',

  reload() {}

};
module.exports = location;

},{}],32:[function(require,module,exports){
"use strict";

let {
  noop
} = require('./util');

const navigator = {
  platform: __getOS(),
  language: __getCurrentLanguage(),
  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 NetType/WIFI Language/zh_CN',
  onLine: true,
  //FIXME:
  geolocation: {
    getCurrentPosition: noop,
    watchPosition: noop,
    clearWatch: noop
  },
  maxTouchPoints: 10 //FIXME: getting the number from OS.

};
module.exports = navigator;

},{"./util":33}],33:[function(require,module,exports){
"use strict";

function noop() {}

module.exports = noop;

},{}],34:[function(require,module,exports){
"use strict";

function inject() {
  window.top = window.parent = window;
  window.ontouchstart = null;
  window.ontouchmove = null;
  window.ontouchend = null;
  window.ontouchcancel = null;
  window.pageXOffset = window.pageYOffset = window.clientTop = window.clientLeft = 0;
  window.outerWidth = window.innerWidth;
  window.outerHeight = window.innerHeight;
  window.clientWidth = window.innerWidth;
  window.clientHeight = window.innerHeight;
  window.location = require('./location');
  window.document = require('./document');
  window.CanvasRenderingContext2D = require('./CanvasRenderingContext2D');
  window.Element = require('./Element');
  window.HTMLElement = require('./HTMLElement');
  window.HTMLCanvasElement = require('./HTMLCanvasElement');
  window.HTMLImageElement = require('./HTMLImageElement');
  window.HTMLMediaElement = require('./HTMLMediaElement');
  window.HTMLVideoElement = require('./HTMLVideoElement');
  window.HTMLScriptElement = require('./HTMLScriptElement');
  window.__canvas = new HTMLCanvasElement();
  window.__canvas._width = window.innerWidth;
  window.__canvas._height = window.innerHeight;
  window.navigator = require('./navigator');
  window.Image = require('./Image');
  window.FileReader = require('./FileReader');
  window.FontFace = require('./FontFace');
  window.FontFaceSet = require('./FontFaceSet');
  window.EventTarget = require('./EventTarget');
  window.Event = require('./Event');
  window.TouchEvent = require('./TouchEvent');
  window.MouseEvent = require('./MouseEvent');
  window.KeyboardEvent = require('./KeyboardEvent');
  window.DeviceMotionEvent = require('./DeviceMotionEvent'); // ES6

  var m_fetch = require('./fetch');

  window.fetch = m_fetch.fetch;
  window.Headers = m_fetch.Headers;
  window.Request = m_fetch.Request;
  window.Response = m_fetch.Response; // const PORTRAIT = 0;
  // const LANDSCAPE_LEFT = -90;
  // const PORTRAIT_UPSIDE_DOWN = 180;
  // const LANDSCAPE_RIGHT = 90;

  window.orientation = jsb.device.getDeviceOrientation(); // window.devicePixelRatio is readonly

  Object.defineProperty(window, "devicePixelRatio", {
    get: function () {
      return jsb.device.getDevicePixelRatio ? jsb.device.getDevicePixelRatio() : 1;
    },
    set: function (_dpr) {
      /* ignore */
    },
    enumerable: true,
    configurable: true
  });
  window.screen = {
    availTop: 0,
    availLeft: 0,
    availHeight: window.innerWidth,
    availWidth: window.innerHeight,
    colorDepth: 8,
    pixelDepth: 8,
    left: 0,
    top: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: {
      //FIXME:cjh
      type: 'portrait-primary' // portrait-primary, portrait-secondary, landscape-primary, landscape-secondary

    },
    onorientationchange: function (event) {}
  };

  window.addEventListener = function (eventName, listener, options) {
    window.__canvas.addEventListener(eventName, listener, options);
  };

  window.removeEventListener = function (eventName, listener, options) {
    window.__canvas.removeEventListener(eventName, listener, options);
  };

  window.dispatchEvent = function (event) {
    window.__canvas.dispatchEvent(event);
  };

  window.getComputedStyle = function (element) {
    return {
      position: 'absolute',
      left: '0px',
      top: '0px',
      height: '0px'
    };
  };

  window.resize = function (width, height) {
    window.innerWidth = width;
    window.innerHeight = height;
    window.outerWidth = window.innerWidth;
    window.outerHeight = window.innerHeight;
    window.__canvas._width = window.innerWidth;
    window.__canvas._height = window.innerHeight;
    window.screen.availWidth = window.innerWidth;
    window.screen.availHeight = window.innerHeight;
    window.screen.width = window.innerWidth;
    window.screen.height = window.innerHeight;
    window.clientWidth = window.innerWidth;
    window.clientHeight = window.innerHeight; // emit resize consistent with web behavior

    let resizeEvent = new Event('resize');
    resizeEvent._target = window;
    window.dispatchEvent(resizeEvent);
  };

  window.focus = function () {};

  window.scroll = function () {};

  window._isInjected = true;
}

if (!window._isInjected) {
  inject();
}

window.localStorage = sys.localStorage;

},{"./CanvasRenderingContext2D":6,"./DeviceMotionEvent":8,"./Element":9,"./Event":10,"./EventTarget":11,"./FileReader":12,"./FontFace":13,"./FontFaceSet":14,"./HTMLCanvasElement":15,"./HTMLElement":16,"./HTMLImageElement":17,"./HTMLMediaElement":18,"./HTMLScriptElement":19,"./HTMLVideoElement":20,"./Image":21,"./KeyboardEvent":23,"./MouseEvent":25,"./TouchEvent":27,"./document":28,"./fetch":29,"./location":31,"./navigator":32}],35:[function(require,module,exports){
"use strict";

(function (jsb) {
  if (!jsb || !jsb.AudioEngine) return;
  jsb.AudioEngine.AudioState = {
    ERROR: -1,
    INITIALZING: 0,
    PLAYING: 1,
    PAUSED: 2,
    STOPPED: 3
  };
  jsb.AudioEngine.INVALID_AUDIO_ID = -1;
  jsb.AudioEngine.TIME_UNKNOWN = -1; // Adapt to normal runtime based API

  jsb.AudioEngine.play = jsb.AudioEngine.play2d;

  jsb.AudioEngine.setErrorCallback = () => {};
})(jsb);

},{}],36:[function(require,module,exports){
"use strict";

const EventTarget = require('./jsb-adapter/EventTarget');

const Event = require('./jsb-adapter/Event');

var eventTarget = new EventTarget();
var callbackWrappers = {};
var callbacks = {};
var index = 1;

var callbackWrapper = function (cb) {
  if (!cb) return null;

  var func = function (event) {
    cb({
      value: event.text
    });
  };

  cb.___index = index++;
  callbackWrappers[cb.___index] = func;
  return func;
};

var getCallbackWrapper = function (cb) {
  if (cb && cb.___index) {
    var ret = callbackWrappers[cb.___index];
    delete callbackWrappers[cb.___index];
    return ret;
  } else return null;
};

var removeListener = function (name, cb) {
  if (cb) eventTarget.removeEventListener(name, getCallbackWrapper(cb));else {
    // remove all listeners of name
    var cbs = callbacks[name];
    if (!cbs) return;

    for (var i = 0, len = cbs.length; i < len; ++i) eventTarget.removeEventListener(name, cbs[i]);

    delete callbacks[name];
  }
};

var recordCallback = function (name, cb) {
  if (!cb || !name || name === '') return;
  if (!callbacks[name]) callbacks[name] = [];
  callbacks[name].push(cb);
};

jsb.inputBox = {
  onConfirm: function (cb) {
    var newCb = callbackWrapper(cb);
    eventTarget.addEventListener('confirm', newCb);
    recordCallback('confirm', newCb);
  },
  offConfirm: function (cb) {
    removeListener('confirm', cb);
  },
  onComplete: function (cb) {
    var newCb = callbackWrapper(cb);
    eventTarget.addEventListener('complete', newCb);
    recordCallback('complete', newCb);
  },
  offComplete: function (cb) {
    removeListener('complete', cb);
  },
  onInput: function (cb) {
    var newCb = callbackWrapper(cb);
    eventTarget.addEventListener('input', newCb);
    recordCallback('input', newCb);
  },
  offInput: function (cb) {
    removeListener('input', cb);
  },

  /**
   * @param {string}		options.defaultValue
   * @param {number}		options.maxLength
   * @param {bool}        options.multiple
   * @param {bool}        options.confirmHold
   * @param {string}      options.confirmType
   * @param {string}      options.inputType
   * 
   * Values of options.confirmType can be [done|next|search|go|send].
   * Values of options.inputType can be [text|email|number|phone|password].
   */
  show: function (options) {
    jsb.showInputBox(options);
  },
  hide: function () {
    jsb.hideInputBox();
  }
};

jsb.onTextInput = function (eventName, text) {
  var event = new Event(eventName);
  event.text = text;
  eventTarget.dispatchEvent(event);
};

},{"./jsb-adapter/Event":10,"./jsb-adapter/EventTarget":11}],37:[function(require,module,exports){
"use strict";

jsb.__obj_ref_id = 0;

jsb.registerNativeRef = function (owner, target) {
  if (owner && target && owner !== target) {
    let targetID = target.__jsb_ref_id;
    if (targetID === undefined) targetID = target.__jsb_ref_id = jsb.__obj_ref_id++;
    let refs = owner.__nativeRefs;

    if (!refs) {
      refs = owner.__nativeRefs = {};
    }

    refs[targetID] = target;
  }
};

jsb.unregisterNativeRef = function (owner, target) {
  if (owner && target && owner !== target) {
    let targetID = target.__jsb_ref_id;
    if (targetID === undefined) return;
    let refs = owner.__nativeRefs;

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
  recursive = !!recursive;
  let children = node.getChildren(),
      i,
      l,
      child;

  for (i = 0, l = children.length; i < l; ++i) {
    child = children[i];
    jsb.unregisterNativeRef(node, child);

    if (recursive) {
      jsb.unregisterChildRefsForNode(child, recursive);
    }
  }
};

},{}],38:[function(require,module,exports){
(function (global,setImmediate){
"use strict";

/* promise.min.js
 * A Promise polyfill implementation.
 * 2018-11-16
 *
 * By taylorhakes, https://github.com/taylorhakes
 * License: MIT
 *   See https://github.com/taylorhakes/promise-polyfill/blob/master/LICENSE
 */

/*! @source https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.js */
!function (e, n) {
  "object" == typeof exports && "undefined" != typeof module ? n() : "function" == typeof define && define.amd ? define(n) : n();
}(0, function () {
  "use strict";

  function e(e) {
    var n = this.constructor;
    return this.then(function (t) {
      return n.resolve(e()).then(function () {
        return t;
      });
    }, function (t) {
      return n.resolve(e()).then(function () {
        return n.reject(t);
      });
    });
  }

  function n() {}

  function t(e) {
    if (!(this instanceof t)) throw new TypeError("Promises must be constructed via new");
    if ("function" != typeof e) throw new TypeError("not a function");
    this._state = 0, this._handled = !1, this._value = undefined, this._deferreds = [], u(e, this);
  }

  function o(e, n) {
    for (; 3 === e._state;) e = e._value;

    0 !== e._state ? (e._handled = !0, t._immediateFn(function () {
      var t = 1 === e._state ? n.onFulfilled : n.onRejected;

      if (null !== t) {
        var o;

        try {
          o = t(e._value);
        } catch (f) {
          return void i(n.promise, f);
        }

        r(n.promise, o);
      } else (1 === e._state ? r : i)(n.promise, e._value);
    })) : e._deferreds.push(n);
  }

  function r(e, n) {
    try {
      if (n === e) throw new TypeError("A promise cannot be resolved with itself.");

      if (n && ("object" == typeof n || "function" == typeof n)) {
        var o = n.then;
        if (n instanceof t) return e._state = 3, e._value = n, void f(e);
        if ("function" == typeof o) return void u(function (e, n) {
          return function () {
            e.apply(n, arguments);
          };
        }(o, n), e);
      }

      e._state = 1, e._value = n, f(e);
    } catch (r) {
      i(e, r);
    }
  }

  function i(e, n) {
    e._state = 2, e._value = n, f(e);
  }

  function f(e) {
    2 === e._state && 0 === e._deferreds.length && t._immediateFn(function () {
      e._handled || t._unhandledRejectionFn(e._value);
    });

    for (var n = 0, r = e._deferreds.length; r > n; n++) o(e, e._deferreds[n]);

    e._deferreds = null;
  }

  function u(e, n) {
    var t = !1;

    try {
      e(function (e) {
        t || (t = !0, r(n, e));
      }, function (e) {
        t || (t = !0, i(n, e));
      });
    } catch (o) {
      if (t) return;
      t = !0, i(n, o);
    }
  }

  var c = setTimeout;
  t.prototype["catch"] = function (e) {
    return this.then(null, e);
  }, t.prototype.then = function (e, t) {
    var r = new this.constructor(n);
    return o(this, new function (e, n, t) {
      this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof n ? n : null, this.promise = t;
    }(e, t, r)), r;
  }, t.prototype["finally"] = e, t.all = function (e) {
    return new t(function (n, t) {
      function o(e, f) {
        try {
          if (f && ("object" == typeof f || "function" == typeof f)) {
            var u = f.then;
            if ("function" == typeof u) return void u.call(f, function (n) {
              o(e, n);
            }, t);
          }

          r[e] = f, 0 == --i && n(r);
        } catch (c) {
          t(c);
        }
      }

      if (!e || "undefined" == typeof e.length) throw new TypeError("Promise.all accepts an array");
      var r = Array.prototype.slice.call(e);
      if (0 === r.length) return n([]);

      for (var i = r.length, f = 0; r.length > f; f++) o(f, r[f]);
    });
  }, t.resolve = function (e) {
    return e && "object" == typeof e && e.constructor === t ? e : new t(function (n) {
      n(e);
    });
  }, t.reject = function (e) {
    return new t(function (n, t) {
      t(e);
    });
  }, t.race = function (e) {
    return new t(function (n, t) {
      for (var o = 0, r = e.length; r > o; o++) e[o].then(n, t);
    });
  }, t._immediateFn = "function" == typeof setImmediate && function (e) {
    setImmediate(e);
  } || function (e) {
    c(e, 0);
  }, t._unhandledRejectionFn = function (e) {
    void 0 !== console && console && console.warn("Possible Unhandled Promise Rejection:", e);
  };

  var l = function () {
    if ("undefined" != typeof self) return self;
    if ("undefined" != typeof window) return window;
    if ("undefined" != typeof global) return global;
    throw Error("unable to locate global object");
  }();

  "Promise" in l ? l.Promise.prototype["finally"] || (l.Promise.prototype["finally"] = e) : l.Promise = t;
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"timers":2}],39:[function(require,module,exports){
"use strict";

function DOMParser(options) {
  this.options = options || {
    locator: {}
  };
}

DOMParser.prototype.parseFromString = function (source, mimeType) {
  var options = this.options;
  var sax = new XMLReader();
  var domBuilder = options.domBuilder || new DOMHandler(); //contentHandler and LexicalHandler

  var errorHandler = options.errorHandler;
  var locator = options.locator;
  var defaultNSMap = options.xmlns || {};
  var isHTML = /\/x?html?$/.test(mimeType); //mimeType.toLowerCase().indexOf('html') > -1;

  var entityMap = isHTML ? htmlEntity.entityMap : {
    'lt': '<',
    'gt': '>',
    'amp': '&',
    'quot': '"',
    'apos': "'"
  };

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
} //console.log('#\n\n\n\n\n\n\n####')

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
  startDocument: function () {
    this.doc = new DOMImplementation().createDocument(null, null, null);

    if (this.locator) {
      this.doc.documentURI = this.locator.systemId;
    }
  },
  startElement: function (namespaceURI, localName, qName, attrs) {
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
  endElement: function (namespaceURI, localName, qName) {
    var current = this.currentElement;
    var tagName = current.tagName;
    this.currentElement = current.parentNode;
  },
  startPrefixMapping: function (prefix, uri) {},
  endPrefixMapping: function (prefix) {},
  processingInstruction: function (target, data) {
    var ins = this.doc.createProcessingInstruction(target, data);
    this.locator && position(this.locator, ins);
    appendElement(this, ins);
  },
  ignorableWhitespace: function (ch, start, length) {},
  characters: function (chars, start, length) {
    chars = _toString.apply(this, arguments); //console.log(chars)

    if (chars) {
      if (this.cdata) {
        var charNode = this.doc.createCDATASection(chars);
      } else {
        var charNode = this.doc.createTextNode(chars);
      }

      if (this.currentElement) {
        this.currentElement.appendChild(charNode);
      } else if (/^\s*$/.test(chars)) {
        this.doc.appendChild(charNode); //process xml
      }

      this.locator && position(this.locator, charNode);
    }
  },
  skippedEntity: function (name) {},
  endDocument: function () {
    this.doc.normalize();
  },
  setDocumentLocator: function (locator) {
    if (this.locator = locator) {
      // && !('lineNumber' in locator)){
      locator.lineNumber = 0;
    }
  },
  //LexicalHandler
  comment: function (chars, start, length) {
    chars = _toString.apply(this, arguments);
    var comm = this.doc.createComment(chars);
    this.locator && position(this.locator, comm);
    appendElement(this, comm);
  },
  startCDATA: function () {
    //used in characters() methods
    this.cdata = true;
  },
  endCDATA: function () {
    this.cdata = false;
  },
  startDTD: function (name, publicId, systemId) {
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
  warning: function (error) {
    console.warn('[xmldom warning]\t' + error, _locator(this.locator));
  },
  error: function (error) {
    console.error('[xmldom error]\t' + error, _locator(this.locator));
  },
  fatalError: function (error) {
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
exports.DOMParser = DOMParser; //}

},{"./dom":40,"./entities":41,"./sax":42}],40:[function(require,module,exports){
"use strict";

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
    function t() {}

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

var htmlns = 'http://www.w3.org/1999/xhtml'; // Node Types

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
var NOTATION_NODE = NodeType.NOTATION_NODE = 12; // ExceptionCode

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
var INUSE_ATTRIBUTE_ERR = ExceptionCode.INUSE_ATTRIBUTE_ERR = (ExceptionMessage[10] = "Attribute in use", 10); //level2

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
}

;
DOMException.prototype = Error.prototype;
copy(ExceptionCode, DOMException);
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-536297177
 * The NodeList interface provides the abstraction of an ordered collection of nodes, without defining or constraining how this collection is implemented. NodeList objects in the DOM are live.
 * The items in the NodeList are accessible via an integral index, starting from 0.
 */

function NodeList() {}

;
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
  item: function (index) {
    return this[index] || null;
  },
  toString: function (isHTML, nodeFilter) {
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
    var ls = list._refresh(list._node); //console.log(ls.length)


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


function NamedNodeMap() {}

;

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
  getNamedItem: function (key) {
    //		if(key.indexOf(':')>0 || key == 'xmlns'){
    //			return null;
    //		}
    //console.log()
    var i = this.length;

    while (i--) {
      var attr = this[i]; //console.log(attr.nodeName,key)

      if (attr.nodeName == key) {
        return attr;
      }
    }
  },
  setNamedItem: function (attr) {
    var el = attr.ownerElement;

    if (el && el != this._ownerElement) {
      throw new DOMException(INUSE_ATTRIBUTE_ERR);
    }

    var oldAttr = this.getNamedItem(attr.nodeName);

    _addNamedNode(this._ownerElement, this, attr, oldAttr);

    return oldAttr;
  },

  /* returns Node */
  setNamedItemNS: function (attr) {
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
  removeNamedItem: function (key) {
    var attr = this.getNamedItem(key);

    _removeNamedNode(this._ownerElement, this, attr);

    return attr;
  },
  // raises: NOT_FOUND_ERR,NO_MODIFICATION_ALLOWED_ERR
  //for level2
  removeNamedItemNS: function (namespaceURI, localName) {
    var attr = this.getNamedItemNS(namespaceURI, localName);

    _removeNamedNode(this._ownerElement, this, attr);

    return attr;
  },
  getNamedItemNS: function (namespaceURI, localName) {
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

function DOMImplementation(
/* Object */
features) {
  this._features = {};

  if (features) {
    for (var feature in features) {
      this._features = features[feature];
    }
  }
}

;
DOMImplementation.prototype = {
  hasFeature: function (
  /* string */
  feature,
  /* string */
  version) {
    var versions = this._features[feature.toLowerCase()];

    if (versions && (!version || version in versions)) {
      return true;
    } else {
      return false;
    }
  },
  // Introduced in DOM Level 2:
  createDocument: function (namespaceURI, qualifiedName, doctype) {
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
  createDocumentType: function (qualifiedName, publicId, systemId) {
    // raises:INVALID_CHARACTER_ERR,NAMESPACE_ERR
    var node = new DocumentType();
    node.name = qualifiedName;
    node.nodeName = qualifiedName;
    node.publicId = publicId;
    node.systemId = systemId; // Introduced in DOM Level 2:
    //readonly attribute DOMString        internalSubset;
    //REFINE:..
    //  readonly attribute NamedNodeMap     entities;
    //  readonly attribute NamedNodeMap     notations;

    return node;
  }
};
/**
 * @see http://www.w3.org/TR/2000/REC-DOM-Level-2-Core-20001113/core.html#ID-1950641247
 */

function Node() {}

;
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
  insertBefore: function (newChild, refChild) {
    //raises 
    return _insertBefore(this, newChild, refChild);
  },
  replaceChild: function (newChild, oldChild) {
    //raises 
    this.insertBefore(newChild, oldChild);

    if (oldChild) {
      this.removeChild(oldChild);
    }
  },
  removeChild: function (oldChild) {
    return _removeChild(this, oldChild);
  },
  appendChild: function (newChild) {
    return this.insertBefore(newChild, null);
  },
  hasChildNodes: function () {
    return this.firstChild != null;
  },
  cloneNode: function (deep) {
    return cloneNode(this.ownerDocument || this, this, deep);
  },
  // Modified in DOM Level 2:
  normalize: function () {
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
  isSupported: function (feature, version) {
    return this.ownerDocument.implementation.hasFeature(feature, version);
  },
  // Introduced in DOM Level 2:
  hasAttributes: function () {
    return this.attributes.length > 0;
  },
  lookupPrefix: function (namespaceURI) {
    var el = this;

    while (el) {
      var map = el._nsMap; //console.dir(map)

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
  lookupNamespaceURI: function (prefix) {
    var el = this;

    while (el) {
      var map = el._nsMap; //console.dir(map)

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
  isDefaultNamespace: function (namespaceURI) {
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
    doc._inc++; //update childNodes

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

  _onUpdateChild(parentNode.ownerDocument || parentNode, parentNode); //console.log(parentNode.lastChild.nextSibling == null)


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

  return newChild; //console.log("__aa",parentNode.lastChild.nextSibling == null)
}

Document.prototype = {
  //implementation : null,
  nodeName: '#document',
  nodeType: DOCUMENT_NODE,
  doctype: null,
  documentElement: null,
  _inc: 1,
  insertBefore: function (newChild, refChild) {
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
  removeChild: function (oldChild) {
    if (this.documentElement == oldChild) {
      this.documentElement = null;
    }

    return _removeChild(this, oldChild);
  },
  // Introduced in DOM Level 2:
  importNode: function (importedNode, deep) {
    return importNode(this, importedNode, deep);
  },
  // Introduced in DOM Level 2:
  getElementById: function (id) {
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
  createElement: function (tagName) {
    var node = new Element();
    node.ownerDocument = this;
    node.nodeName = tagName;
    node.tagName = tagName;
    node.childNodes = new NodeList();
    var attrs = node.attributes = new NamedNodeMap();
    attrs._ownerElement = node;
    return node;
  },
  createDocumentFragment: function () {
    var node = new DocumentFragment();
    node.ownerDocument = this;
    node.childNodes = new NodeList();
    return node;
  },
  createTextNode: function (data) {
    var node = new Text();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createComment: function (data) {
    var node = new Comment();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createCDATASection: function (data) {
    var node = new CDATASection();
    node.ownerDocument = this;
    node.appendData(data);
    return node;
  },
  createProcessingInstruction: function (target, data) {
    var node = new ProcessingInstruction();
    node.ownerDocument = this;
    node.tagName = node.target = target;
    node.nodeValue = node.data = data;
    return node;
  },
  createAttribute: function (name) {
    var node = new Attr();
    node.ownerDocument = this;
    node.name = name;
    node.nodeName = name;
    node.localName = name;
    node.specified = true;
    return node;
  },
  createEntityReference: function (name) {
    var node = new EntityReference();
    node.ownerDocument = this;
    node.nodeName = name;
    return node;
  },
  // Introduced in DOM Level 2:
  createElementNS: function (namespaceURI, qualifiedName) {
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
  createAttributeNS: function (namespaceURI, qualifiedName) {
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
}

;
Element.prototype = {
  nodeType: ELEMENT_NODE,
  hasAttribute: function (name) {
    return this.getAttributeNode(name) != null;
  },
  getAttribute: function (name) {
    var attr = this.getAttributeNode(name);
    return attr && attr.value || '';
  },
  getAttributeNode: function (name) {
    return this.attributes.getNamedItem(name);
  },
  setAttribute: function (name, value) {
    var attr = this.ownerDocument.createAttribute(name);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  removeAttribute: function (name) {
    var attr = this.getAttributeNode(name);
    attr && this.removeAttributeNode(attr);
  },
  //four real opeartion method
  appendChild: function (newChild) {
    if (newChild.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return this.insertBefore(newChild, null);
    } else {
      return _appendSingleChild(this, newChild);
    }
  },
  setAttributeNode: function (newAttr) {
    return this.attributes.setNamedItem(newAttr);
  },
  setAttributeNodeNS: function (newAttr) {
    return this.attributes.setNamedItemNS(newAttr);
  },
  removeAttributeNode: function (oldAttr) {
    //console.log(this == oldAttr.ownerElement)
    return this.attributes.removeNamedItem(oldAttr.nodeName);
  },
  //get real attribute name,and remove it by removeAttributeNode
  removeAttributeNS: function (namespaceURI, localName) {
    var old = this.getAttributeNodeNS(namespaceURI, localName);
    old && this.removeAttributeNode(old);
  },
  hasAttributeNS: function (namespaceURI, localName) {
    return this.getAttributeNodeNS(namespaceURI, localName) != null;
  },
  getAttributeNS: function (namespaceURI, localName) {
    var attr = this.getAttributeNodeNS(namespaceURI, localName);
    return attr && attr.value || '';
  },
  setAttributeNS: function (namespaceURI, qualifiedName, value) {
    var attr = this.ownerDocument.createAttributeNS(namespaceURI, qualifiedName);
    attr.value = attr.nodeValue = "" + value;
    this.setAttributeNode(attr);
  },
  getAttributeNodeNS: function (namespaceURI, localName) {
    return this.attributes.getNamedItemNS(namespaceURI, localName);
  },
  getElementsByTagName: function (tagName) {
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
  getElementsByTagNameNS: function (namespaceURI, localName) {
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

function Attr() {}

;
Attr.prototype.nodeType = ATTRIBUTE_NODE;

_extends(Attr, Node);

function CharacterData() {}

;
CharacterData.prototype = {
  data: '',
  substringData: function (offset, count) {
    return this.data.substring(offset, offset + count);
  },
  appendData: function (text) {
    text = this.data + text;
    this.nodeValue = this.data = text;
    this.length = text.length;
  },
  insertData: function (offset, text) {
    this.replaceData(offset, 0, text);
  },
  appendChild: function (newChild) {
    throw new Error(ExceptionMessage[HIERARCHY_REQUEST_ERR]);
  },
  deleteData: function (offset, count) {
    this.replaceData(offset, count, "");
  },
  replaceData: function (offset, count, text) {
    var start = this.data.substring(0, offset);
    var end = this.data.substring(offset + count);
    text = start + text + end;
    this.nodeValue = this.data = text;
    this.length = text.length;
  }
};

_extends(CharacterData, Node);

function Text() {}

;
Text.prototype = {
  nodeName: "#text",
  nodeType: TEXT_NODE,
  splitText: function (offset) {
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

function Comment() {}

;
Comment.prototype = {
  nodeName: "#comment",
  nodeType: COMMENT_NODE
};

_extends(Comment, CharacterData);

function CDATASection() {}

;
CDATASection.prototype = {
  nodeName: "#cdata-section",
  nodeType: CDATA_SECTION_NODE
};

_extends(CDATASection, CharacterData);

function DocumentType() {}

;
DocumentType.prototype.nodeType = DOCUMENT_TYPE_NODE;

_extends(DocumentType, Node);

function Notation() {}

;
Notation.prototype.nodeType = NOTATION_NODE;

_extends(Notation, Node);

function Entity() {}

;
Entity.prototype.nodeType = ENTITY_NODE;

_extends(Entity, Node);

function EntityReference() {}

;
EntityReference.prototype.nodeType = ENTITY_REFERENCE_NODE;

_extends(EntityReference, Node);

function DocumentFragment() {}

;
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
      var visibleNamespaces = [{
        namespace: uri,
        prefix: null
      } //{namespace:uri,prefix:''}
      ];
    }
  }

  serializeToString(this, buf, isHtml, nodeFilter, visibleNamespaces); //console.log('###',this.nodeType,uri,prefix,buf.join(''))

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

  var i = visibleNamespaces.length; //console.log('@@@@',node.tagName,prefix,uri,visibleNamespaces)

  while (i--) {
    var ns = visibleNamespaces[i]; // get namespace prefix
    //console.log(node.nodeType,node.tagName,ns.prefix,prefix)

    if (ns.prefix == prefix) {
      return ns.namespace != uri;
    }
  } //console.log(isHTML,uri,prefix=='')
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
    } //buf.sort.apply(attrs, attributeSorter);

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
          visibleNamespaces.push({
            prefix: attr.localName,
            namespace: attr.value
          });
        } else if (attr.nodeName == 'xmlns') {
          visibleNamespaces.push({
            prefix: '',
            namespace: attr.value
          });
        }
      }

      for (var i = 0; i < len; i++) {
        var attr = attrs.item(i);

        if (needNamespaceDefine(attr, isHTML, visibleNamespaces)) {
          var prefix = attr.prefix || '';
          var uri = attr.namespaceURI;
          var ns = prefix ? ' xmlns:' + prefix : " xmlns";
          buf.push(ns, '="', uri, '"');
          visibleNamespaces.push({
            prefix: prefix,
            namespace: uri
          });
        }

        serializeToString(attr, buf, isHTML, nodeFilter, visibleNamespaces);
      } // add namespace for current node		


      if (needNamespaceDefine(node, isHTML, visibleNamespaces)) {
        var prefix = node.prefix || '';
        var uri = node.namespaceURI;
        var ns = prefix ? ' xmlns:' + prefix : " xmlns";
        buf.push(ns, '="', uri, '"');
        visibleNamespaces.push({
          prefix: prefix,
          namespace: uri
        });
      }

      if (child || isHTML && !/^(?:meta|link|img|br|hr|input)$/i.test(nodeName)) {
        buf.push('>'); //if is cdata child node

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
      } // remove added visible namespaces
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

function importNode(doc, node, deep) {
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
      node2.appendChild(importNode(doc, child, deep));
      child = child.nextSibling;
    }
  }

  return node2;
} //
//var _relationMap = {firstChild:1,lastChild:1,previousSibling:1,nextSibling:1,
//					attributes:1,childNodes:1,parentNode:1,documentElement:1,doctype,};


function cloneNode(doc, node, deep) {
  var node2 = new node.constructor();

  for (var n in node) {
    var v = node[n];

    if (typeof v != 'object') {
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
        node2.setAttributeNode(cloneNode(doc, attrs.item(i), true));
      }

      break;
      ;

    case ATTRIBUTE_NODE:
      deep = true;
  }

  if (deep) {
    var child = node.firstChild;

    while (child) {
      node2.appendChild(cloneNode(doc, child, deep));
      child = child.nextSibling;
    }
  }

  return node2;
}

function __set__(object, key, value) {
  object[key] = value;
} //do dynamic


try {
  if (Object.defineProperty) {
    Object.defineProperty(LiveNodeList.prototype, 'length', {
      get: function () {
        _updateLiveList(this);

        return this.$$length;
      }
    });
    Object.defineProperty(Node.prototype, 'textContent', {
      get: function () {
        return getTextContent(this);
      },
      set: function (data) {
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
            //REFINE:
            this.data = data;
            this.value = data;
            this.nodeValue = data;
        }
      }
    });

    function getTextContent(node) {
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
    }

    __set__ = function (object, key, value) {
      //console.log(value)
      object['$$' + key] = value;
    };
  }
} catch (e) {//ie8
} //if(typeof require == 'function'){


exports.DOMImplementation = DOMImplementation;
exports.XMLSerializer = XMLSerializer; //}

},{}],41:[function(require,module,exports){
"use strict";

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
}; //for(var  n in exports.entityMap){console.log(exports.entityMap[n].charCodeAt())}

},{}],42:[function(require,module,exports){
"use strict";

//[4]   	NameStartChar	   ::=   	":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
//[4a]   	NameChar	   ::=   	NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
//[5]   	Name	   ::=   	NameStartChar (NameChar)*
var nameStartChar = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/; //\u10000-\uEFFFF

var nameChar = new RegExp("[\\-\\.0-9" + nameStartChar.source.slice(1, -1) + "\\u00B7\\u0300-\\u036F\\u203F-\\u2040]");
var tagNamePattern = new RegExp('^' + nameStartChar.source + nameChar.source + '*(?:\:' + nameStartChar.source + nameChar.source + '*)?$'); //var tagNamePattern = /^[a-zA-Z_][\w\-\.]*(?:\:[a-zA-Z_][\w\-\.]*)?$/
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
  parse: function (source, defaultNSMap, entityMap) {
    var domBuilder = this.domBuilder;
    domBuilder.startDocument();

    _copy(defaultNSMap, defaultNSMap = {});

    parse(source, defaultNSMap, entityMap, domBuilder, this.errorHandler);
    domBuilder.endDocument();
  }
};

function parse(source, defaultNSMapCopy, entityMap, domBuilder, errorHandler) {
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
      locator.lineNumber++; //console.log('line++:',locator,startPos,endPos)
    }

    locator.columnNumber = p - lineStart + 1;
  }

  var lineStart = 0;
  var lineEnd = 0;
  var linePattern = /.*(?:\r\n?|\n)|.*$/g;
  var locator = domBuilder.locator;
  var parseStack = [{
    currentNSMap: defaultNSMapCopy
  }];
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
            tagName = source.substring(tagStart + 2).replace(/[\s<].*/, ''); //console.error('#@@@@@@'+tagName)

            errorHandler.error("end tag name: " + tagName + ' is not complete:' + config.tagName);
            end = tagStart + 1 + tagName.length;
          } else if (tagName.match(/\s</)) {
            tagName = tagName.replace(/[\s<].*/, '');
            errorHandler.error("end tag name: " + tagName + ' maybe not complete');
            end = tagStart + 1 + tagName.length;
          } //console.error(parseStack.length,parseStack)
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
          var currentNSMap = parseStack[parseStack.length - 1].currentNSMap; //elStartEnd

          var end = parseElementStartPart(source, tagStart, el, currentNSMap, entityReplacer, errorHandler);
          var len = el.length;

          if (!el.closed && fixSelfClosed(source, end, el.tagName, closeMap)) {
            el.closed = true;

            if (!entityMap.nbsp) {
              errorHandler.warning('unclosed xml attribute');
            }
          }

          if (locator && len) {
            var locator2 = copyLocator(locator, {}); //try{//attribute position fixed

            for (var i = 0; i < len; i++) {
              var a = el[i];
              position(a.offset);
              a.locator = copyLocator(locator, {});
            } //}catch(e){console.error('@@@@@'+e)}


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
      errorHandler.error('element parse error: ' + e); //errorHandler.error('element parse error: '+e);

      end = -1; //throw e;
    }

    if (end > start) {
      start = end;
    } else {
      //REFINE: 这里有可能sax回退，有位置错误风险
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
          value = source.slice(start, p).replace(/&#?\w+;/g, entityReplacer); //console.log(attrName,value,start,p)

          el.add(attrName, value, start); //console.dir(el)

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
            break;
          //normal

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
        } //			console.log(tagName,tagNamePattern,tagNamePattern.test(tagName))


        return p;

      /*xml space '\x20' | #x9 | #xD | #xA; */

      case '\u0080':
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
  var localNSMap = null; //var currentNSMap = parseStack[parseStack.length-1].currentNSMap;

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
    } //can not set prefix,because prefix !== ''


    a.localName = localName; //prefix == null for no ns prefix attribute 

    if (nsPrefix !== false) {
      //hack!!
      if (localNSMap == null) {
        localNSMap = {}; //console.log(currentNSMap,0)

        _copy(currentNSMap, currentNSMap = {}); //console.log(currentNSMap,1)

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
      }

      if (prefix !== 'xmlns') {
        a.uri = currentNSMap[prefix || '']; //{console.log('###'+a.qName,domBuilder.locator.systemId+'',currentNSMap,a.uri)}
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
  } //no prefix element has default namespace


  var ns = el.uri = currentNSMap[prefix || ''];
  domBuilder.startElement(ns, localName, tagName, el); //endPrefixMapping and startPrefixMapping have not any help for dom builder
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
    el.localNSMap = localNSMap; //parseStack.push(el);

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
        domBuilder.characters(text, 0, text.length); //lexHandler.endCDATA();

        return elEndStart; //}
      } //}else{//text area


      text = text.replace(/&#?\w+;/g, entityReplacer);
      domBuilder.characters(text, 0, text.length);
      return elEndStart; //}
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

  return pos < elStartEnd; //} 
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
        var end = source.indexOf('-->', start + 4); //append comment source.substring(4,end)//<!--

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
      } //<!DOCTYPE
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
  setTagName: function (tagName) {
    if (!tagNamePattern.test(tagName)) {
      throw new Error('invalid tagName:' + tagName);
    }

    this.tagName = tagName;
  },
  add: function (qName, value, offset) {
    if (!tagNamePattern.test(qName)) {
      throw new Error('invalid attribute:' + qName);
    }

    this[this.length++] = {
      qName: qName,
      value: value,
      offset: offset
    };
  },
  length: 0,
  getLocalName: function (i) {
    return this[i].localName;
  },
  getLocator: function (i) {
    return this[i].locator;
  },
  getQName: function (i) {
    return this[i].qName;
  },
  getURI: function (i) {
    return this[i].uri;
  },
  getValue: function (i) {
    return this[i].value;
  } //	,getIndex:function(uri, localName)){
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

},{}]},{},[5]);
