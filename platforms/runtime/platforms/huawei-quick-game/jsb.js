(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _features = {};
var _default = {
  setFeature: function setFeature(featureName, property, value) {
    var feature = _features[featureName];

    if (!feature) {
      feature = _features[featureName] = {};
    }

    feature[property] = value;
  },
  getFeatureProperty: function getFeatureProperty(featureName, property) {
    var feature = _features[featureName];
    return feature ? feature[property] : undefined;
  }
};
exports["default"] = _default;

},{}],2:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("onShow", hbs, ral);

_util["default"].exportTo("onHide", hbs, ral);

_util["default"].exportTo("offShow", hbs, ral);

_util["default"].exportTo("offHide", hbs, ral);

},{"../../util":20}],3:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("loadSubpackage", hbs, ral);

},{"../../util":20}],4:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("env", hbs, ral);

_util["default"].exportTo("getSystemInfo", hbs, ral);

_util["default"].exportTo("getSystemInfoSync", hbs, ral);

},{"../../util":20}],5:[function(require,module,exports){
"use strict";

if (!window.jsb) {
  window.jsb = {};
}

var jsb = window.jsb;
var _touches = [];

var _getTouchIndex = function _getTouchIndex(touch) {
  var element;

  for (var index = 0; index < _touches.length; index++) {
    element = _touches[index];

    if (touch.identifier === element.identifier) {
      return index;
    }
  }

  return -1;
};

var _copyObject = function _copyObject(fromObj, toObject) {
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      toObject[key] = fromObj[key];
    }
  }
};

var _listenerMap = {
  "touchstart": [],
  "touchmove": [],
  "touchend": [],
  "touchcancel": []
};

function _addListener(key, value) {
  var listenerArr = _listenerMap[key];

  for (var index = 0, length = listenerArr.length; index < length; index++) {
    if (value === listenerArr[index]) {
      return;
    }
  }

  listenerArr.push(value);
}

function _removeListener(key, value) {
  var listenerArr = _listenerMap[key] || [];
  var length = listenerArr.length;

  for (var index = 0; index < length; ++index) {
    if (value === listenerArr[index]) {
      listenerArr.splice(index, 1);
      return;
    }
  }
}

var _hasDellWith = false;

var _systemInfo = hbs.getSystemInfoSync();

if (window.innerWidth && _systemInfo.windowWidth !== window.innerWidth) {
  _hasDellWith = true;
}

var _touchEventHandlerFactory = function _touchEventHandlerFactory(type) {
  return function (changedTouches) {
    if (typeof changedTouches === "function") {
      _addListener(type, changedTouches);

      return;
    }

    var touchEvent = new TouchEvent(type);
    var index;

    if (type === "touchstart") {
      changedTouches.forEach(function (touch) {
        index = _getTouchIndex(touch);

        if (index >= 0) {
          _copyObject(touch, _touches[index]);
        } else {
          var tmp = {};

          _copyObject(touch, tmp);

          _touches.push(tmp);
        }
      });
    } else if (type === "touchmove") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);

        if (index >= 0) {
          _copyObject(element, _touches[index]);
        }
      });
    } else if (type === "touchend" || type === "touchcancel") {
      changedTouches.forEach(function (element) {
        index = _getTouchIndex(element);

        if (index >= 0) {
          _touches.splice(index, 1);
        }
      });
    }

    var touches = [].concat(_touches);
    var _changedTouches = [];
    changedTouches.forEach(function (touch) {
      var length = touches.length;

      for (var _index = 0; _index < length; ++_index) {
        var _touch = touches[_index];

        if (touch.identifier === _touch.identifier) {
          _changedTouches.push(_touch);

          return;
        }
      }

      _changedTouches.push(touch);
    });
    touchEvent.touches = touches;
    touchEvent.targetTouches = touches;
    touchEvent.changedTouches = _changedTouches;

    if (_hasDellWith) {
      touches.forEach(function (touch) {
        touch.clientX /= window.devicePixelRatio;
        touch.clientY /= window.devicePixelRatio;
        touch.pageX /= window.devicePixelRatio;
        touch.pageY /= window.devicePixelRatio;
      });

      if (type === "touchcancel" || type === "touchend") {
        _changedTouches.forEach(function (touch) {
          touch.clientX /= window.devicePixelRatio;
          touch.clientY /= window.devicePixelRatio;
          touch.pageX /= window.devicePixelRatio;
          touch.pageY /= window.devicePixelRatio;
        });
      }
    }

    var listenerArr = _listenerMap[type];
    var length = listenerArr.length;

    for (var _index2 = 0; _index2 < length; _index2++) {
      listenerArr[_index2](touchEvent);
    }
  };
};

if (hbs.onTouchStart) {
  ral.onTouchStart = hbs.onTouchStart;
  ral.offTouchStart = hbs.offTouchStart;
} else {
  jsb.onTouchStart = _touchEventHandlerFactory('touchstart');

  jsb.offTouchStart = function (callback) {
    _removeListener("touchstart", callback);
  };

  ral.onTouchStart = jsb.onTouchStart.bind(jsb);
  ral.offTouchStart = jsb.offTouchStart.bind(jsb);
}

if (hbs.onTouchMove) {
  ral.onTouchMove = hbs.onTouchMove;
  ral.offTouchMove = hbs.offTouchMove;
} else {
  jsb.onTouchMove = _touchEventHandlerFactory('touchmove');

  jsb.offTouchMove = function (callback) {
    _removeListener("touchmove", callback);
  };

  ral.onTouchMove = jsb.onTouchMove.bind(jsb);
  ral.offTouchMove = jsb.offTouchMove.bind(jsb);
}

if (hbs.onTouchCancel) {
  ral.onTouchCancel = hbs.onTouchCancel;
  ral.offTouchCancel = hbs.offTouchCancel;
} else {
  jsb.onTouchCancel = _touchEventHandlerFactory('touchcancel');

  jsb.offTouchCancel = function (callback) {
    _removeListener("touchcancel", callback);
  };

  ral.onTouchCancel = jsb.onTouchCancel.bind(jsb);
  ral.offTouchCancel = jsb.offTouchCancel.bind(jsb);
}

if (hbs.onTouchEnd) {
  ral.onTouchEnd = hbs.onTouchEnd;
  ral.offTouchEnd = hbs.offTouchEnd;
} else {
  jsb.onTouchEnd = _touchEventHandlerFactory('touchend');

  jsb.offTouchEnd = function (callback) {
    _removeListener("touchend", callback);
  };

  ral.onTouchEnd = jsb.onTouchEnd.bind(jsb);
  ral.offTouchEnd = jsb.offTouchEnd.bind(jsb);
}

},{}],6:[function(require,module,exports){
"use strict";

var _systemInfo = hbs.getSystemInfoSync();

var _listeners = [];
ral.device = ral.device || {};
ral.stopAccelerometer = hbs.stopAccelerometer.bind(hbs);
ral.startAccelerometer = hbs.startAccelerometer.bind(hbs);
ral.onAccelerometerChange = hbs.onAccelerometerChange.bind(hbs);

},{}],7:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("getBatteryInfo", hbs, ral);

_util["default"].exportTo("getBatteryInfoSync", hbs, ral);

},{"../../util":20}],8:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("getFileSystemManager", hbs, ral);

},{"../../util":20}],9:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../util"));

var _feature = _interopRequireDefault(require("../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (!window.ral) {
  window.ral = {};
}

require("./base/lifecycle");

require("./base/subpackage");

require("./base/system-info");

require("./base/touch-event");

require("./device/accelerometer");

require("./device/battery");

require("./file/file-system-manager");

require("./interface/keyboard");

require("./interface/window");

require("./media/audio");

require("./network/download");

require("./rendering/canvas");

require("./rendering/webgl");

require("./rendering/font");

require("./rendering/frame");

require("./rendering/image");

_util["default"].exportTo("getFeatureProperty", _feature["default"], ral);

},{"../feature":1,"../util":20,"./base/lifecycle":2,"./base/subpackage":3,"./base/system-info":4,"./base/touch-event":5,"./device/accelerometer":6,"./device/battery":7,"./file/file-system-manager":8,"./interface/keyboard":10,"./interface/window":11,"./media/audio":12,"./network/download":13,"./rendering/canvas":14,"./rendering/font":15,"./rendering/frame":16,"./rendering/image":17,"./rendering/webgl":18}],10:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("onKeyboardInput", hbs, ral);

_util["default"].exportTo("onKeyboardConfirm", hbs, ral);

_util["default"].exportTo("onKeyboardComplete", hbs, ral);

_util["default"].exportTo("offKeyboardInput", hbs, ral);

_util["default"].exportTo("offKeyboardConfirm", hbs, ral);

_util["default"].exportTo("offKeyboardComplete", hbs, ral);

_util["default"].exportTo("hideKeyboard", hbs, ral);

_util["default"].exportTo("showKeyboard", hbs, ral);

_util["default"].exportTo("updateKeyboard", hbs, ral);

},{"../../util":20}],11:[function(require,module,exports){
"use strict";

var _onWindowResize = hbs.onWindowResize;

ral.onWindowResize = function (callBack) {
  _onWindowResize(function (size) {
    callBack(size.width || size.windowWidth, size.height || size.windowHeight);
  });
};

},{}],12:[function(require,module,exports){
"use strict";

var _innerContext = _interopRequireDefault(require("../../inner-context"));

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("AudioEngine", hbs, ral);

_util["default"].exportTo("createInnerAudioContext", hbs, ral, function () {
  if (_rt.AudioEngine) {
    ral.createInnerAudioContext = function () {
      return (0, _innerContext["default"])(hbs.AudioEngine);
    };
  }
});

},{"../../inner-context":19,"../../util":20}],13:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("downloadFile", hbs, ral);

},{"../../util":20}],14:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("createCanvas", hbs, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createCanvas = function () {
      return document.createElement("canvas");
    };
  }

  _feature["default"].setFeature("ral.createCanvas", "spec", featureValue);
});

},{"../../feature":1,"../../util":20}],15:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("loadFont", hbs, ral);

},{"../../util":20}],16:[function(require,module,exports){
"use strict";

if (jsb && jsb.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = jsb.setPreferredFramesPerSecond.bind(jsb);
} else if (hbs.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = hbs.setPreferredFramesPerSecond.bind(hbs);

  if (jsb) {
    jsb.setPreferredFramesPerSecond = ral.setPreferredFramesPerSecond.bind(ral);
  }
} else {
  ral.setPreferredFramesPerSecond = function () {
    console.error("The setPreferredFramesPerSecond is not define!");
  };

  if (jsb) {
    jsb.setPreferredFramesPerSecond = function () {
      console.error("The setPreferredFramesPerSecond is not define!");
    };
  }
}

},{}],17:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_util["default"].exportTo("loadImageData", hbs, ral, function () {
  if (typeof jsb.loadImage === "function") {
    ral.loadImageData = jsb.loadImage;
  } else {
    console.error("loadImageData is not function");
  }
});

_util["default"].exportTo("createImage", hbs, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createImage = function () {
      return document.createElement("image");
    };
  }
});

var featureValue = "huawei_platform_support";

_feature["default"].setFeature("ral.createImage", "spec", featureValue);

},{"../../feature":1,"../../util":20}],18:[function(require,module,exports){
"use strict";

if (window.__gl) {
  var gl = window.__gl;
  var _glTexImage2D = gl.texImage2D;

  gl.texImage2D = function (target, level, internalformat, width, height, border, format, type, pixels) {
    var argc = arguments.length;

    if (argc === 6) {
      var image = border;
      type = height;
      format = width;

      if (image instanceof HTMLImageElement) {
        _glTexImage2D(target, level, image._glInternalFormat, image.width, image.height, 0, image._glFormat, image._glType, image._data);
      } else if (image instanceof HTMLCanvasElement) {
        if (image._context2D && image._context2D._getData) {
          var data = image._context2D._getData();

          _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, data);
        } else {
          console.error("Invalid image argument gl.texImage2D!");
        }
      } else if (image.height && image.width && image.data) {
        var error = console.error;

        console.error = function () {};

        _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image.data);

        console.error = error;
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
      }
    } else if (argc === 9) {
      _glTexImage2D(target, level, internalformat, width, height, border, format, type, pixels);
    } else {
      console.error("gl.texImage2D: invalid argument count!");
    }
  };

  var _glTexSubImage2D = gl.texSubImage2D;

  gl.texSubImage2D = function (target, level, xoffset, yoffset, width, height, format, type, pixels) {
    var argc = arguments.length;

    if (argc === 7) {
      var image = format;
      type = height;
      format = width;

      if (image instanceof HTMLImageElement) {
        _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, image._glFormat, image._glType, image._data);
      } else if (image instanceof HTMLCanvasElement) {
        if (image._context2D && image._context2D._getData) {
          var data = image._context2D._getData();

          _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, data);
        } else {
          console.error("Invalid image argument gl.texSubImage2D!");
        }
      } else if (image.height && image.width && image.data) {
        var error = console.error;

        console.error = function () {};

        _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image.data);

        console.error = error;
      } else {
        console.error("Invalid pixel argument passed to gl.texSubImage2D!");
      }
    } else if (argc === 9) {
      _glTexSubImage2D(target, level, xoffset, yoffset, width, height, format, type, pixels);
    } else {
      console.error(new Error("gl.texImage2D: invalid argument count!").stack);
    }
  };
}

},{}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;
var _CANPLAY_CALLBACK = "canplayCallbacks";
var _ENDED_CALLBACK = "endedCallbacks";
var _ERROR_CALLBACK = "errorCallbacks";
var _PAUSE_CALLBACK = "pauseCallbacks";
var _PLAY_CALLBACK = "playCallbacks";
var _SEEKED_CALLBACK = "seekedCallbacks";
var _SEEKING_CALLBACK = "seekingCallbacks";
var _STOP_CALLBACK = "stopCallbacks";
var _TIME_UPDATE_CALLBACK = "timeUpdateCallbacks";
var _WAITING_CALLBACK = "waitingCallbacks";
var _ERROR_CODE = {
  ERROR_SYSTEM: 10001,
  ERROR_NET: 10002,
  ERROR_FILE: 10003,
  ERROR_FORMAT: 10004,
  ERROR_UNKNOWN: -1
};
var _STATE = {
  ERROR: -1,
  INITIALIZING: 0,
  PLAYING: 1,
  PAUSED: 2
};
var _audioEngine = undefined;

var _weakMap = new WeakMap();

var _offCallback = function _offCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);

  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }

  var callbacks = privateThis[type] || [];

  for (var i = 0, len = callbacks.length; i < len; ++i) {
    if (callback === callbacks[i]) {
      callbacks.splice(i, 1);
      return callback.length + 1;
    }
  }

  return 0;
};

var _onCallback = function _onCallback(target, type, callback) {
  var privateThis = _weakMap.get(target);

  if (typeof callback !== "function" || !privateThis) {
    return -1;
  }

  var callbacks = privateThis[type];

  if (!callbacks) {
    callbacks = privateThis[type] = [callback];
  } else {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      if (callback === callbacks[i]) {
        return 0;
      }
    }

    callbacks.push(callback);
  }

  return callbacks.length;
};

var _dispatchCallback = function _dispatchCallback(target, type) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var privateThis = _weakMap.get(target);

  if (privateThis) {
    var callbacks = privateThis[type] || [];

    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(target, args);
    }
  }
};

function InnerAudioContext() {
  this.startTime = 0;
  this.autoplay = false;

  _weakMap.set(this, {
    src: "",
    volume: 1,
    loop: false
  });

  Object.defineProperty(this, "loop", {
    set: function set(value) {
      value = !!value;

      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setLoop(audioID, value);
        }

        privateThis.loop = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.loop : false;
    }
  });
  Object.defineProperty(this, "volume", {
    set: function set(value) {
      if (typeof value === "number") {
        if (value < 0) {
          value = 0;
        } else if (value > 1) {
          value = 1;
        }
      } else {
        value = 1;
      }

      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          _audioEngine.setVolume(audioID, value);
        }

        privateThis.volume = value;
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.volume : 1;
    }
  });
  Object.defineProperty(this, "src", {
    set: function set(value) {
      var privateThis = _weakMap.get(this);

      if (!privateThis) {
        return;
      }

      var oldSrc = privateThis.src;
      privateThis.src = value;

      if (typeof value === "string") {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PAUSED && oldSrc !== value) {
          _audioEngine.stop(audioID);

          privateThis.audioID = -1;
        }

        var self = this;

        _audioEngine.preload(value, function () {
          setTimeout(function () {
            if (self.src === value) {
              _dispatchCallback(self, _CANPLAY_CALLBACK);

              if (self.autoplay) {
                self.play();
              }
            }
          });
        });
      }
    },
    get: function get() {
      var privateThis = _weakMap.get(this);

      return privateThis ? privateThis.src : "";
    }
  });
  Object.defineProperty(this, "duration", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getDuration(audioID);
        }
      }

      return NaN;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "currentTime", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getCurrentTime(audioID);
        }
      }

      return 0;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "paused", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getState(audioID) === _STATE.PAUSED;
        }
      }

      return true;
    },
    set: function set() {}
  });
  Object.defineProperty(this, "buffered", {
    get: function get() {
      var privateThis = _weakMap.get(this);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0) {
          return _audioEngine.getBuffered(audioID);
        }
      }

      return 0;
    },
    set: function set() {}
  });
}

var _prototype = InnerAudioContext.prototype;

_prototype.destroy = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;

      _dispatchCallback(this, _STOP_CALLBACK);
    }

    privateThis[_CANPLAY_CALLBACK] = [];
    privateThis[_ENDED_CALLBACK] = [];
    privateThis[_ERROR_CALLBACK] = [];
    privateThis[_PAUSE_CALLBACK] = [];
    privateThis[_PLAY_CALLBACK] = [];
    privateThis[_SEEKED_CALLBACK] = [];
    privateThis[_SEEKING_CALLBACK] = [];
    privateThis[_STOP_CALLBACK] = [];
    privateThis[_TIME_UPDATE_CALLBACK] = [];
    privateThis[_WAITING_CALLBACK] = [];
    clearInterval(privateThis.intervalID);
  }
};

_prototype.play = function () {
  var privateThis = _weakMap.get(this);

  if (!privateThis) {
    return;
  }

  var src = privateThis.src;
  var audioID = privateThis.audioID;

  if (typeof src !== "string" || src === "") {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "invalid src",
      errCode: _ERROR_CODE.ERROR_FILE
    }]);

    return;
  }

  if (typeof audioID === "number" && audioID >= 0) {
    if (_audioEngine.getState(audioID) === _STATE.PAUSED) {
      _audioEngine.resume(audioID);

      _dispatchCallback(this, _PLAY_CALLBACK);

      return;
    } else {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;
    }
  }

  audioID = _audioEngine.play(src, this.loop, this.volume);

  if (audioID === -1) {
    _dispatchCallback(this, _ERROR_CALLBACK, [{
      errMsg: "unknown",
      errCode: _ERROR_CODE.ERROR_UNKNOWN
    }]);

    return;
  }

  privateThis.audioID = audioID;

  if (typeof this.startTime === "number" && this.startTime > 0) {
    _audioEngine.setCurrentTime(audioID, this.startTime);
  }

  _dispatchCallback(this, _WAITING_CALLBACK);

  var self = this;

  _audioEngine.setCanPlayCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _CANPLAY_CALLBACK);

      _dispatchCallback(self, _PLAY_CALLBACK);
    }
  });

  _audioEngine.setWaitingCallback(audioID, function () {
    if (src === self.src) {
      _dispatchCallback(self, _WAITING_CALLBACK);
    }
  });

  _audioEngine.setErrorCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;

      _dispatchCallback(self, _ERROR_CALLBACK);
    }
  });

  _audioEngine.setFinishCallback(audioID, function () {
    if (src === self.src) {
      privateThis.audioID = -1;

      _dispatchCallback(self, _ENDED_CALLBACK);
    }
  });
};

_prototype.pause = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.pause(audioID);

      _dispatchCallback(this, _PAUSE_CALLBACK);
    }
  }
};

_prototype.seek = function (position) {
  var privateThis = _weakMap.get(this);

  if (privateThis && typeof position === "number" && position >= 0) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.setCurrentTime(audioID, position);

      _dispatchCallback(this, _SEEKING_CALLBACK);

      _dispatchCallback(this, _SEEKED_CALLBACK);
    }
  }
};

_prototype.stop = function () {
  var privateThis = _weakMap.get(this);

  if (privateThis) {
    var audioID = privateThis.audioID;

    if (typeof audioID === "number" && audioID >= 0) {
      _audioEngine.stop(audioID);

      privateThis.audioID = -1;

      _dispatchCallback(this, _STOP_CALLBACK);
    }
  }
};

_prototype.offCanplay = function (callback) {
  _offCallback(this, _CANPLAY_CALLBACK, callback);
};

_prototype.offEnded = function (callback) {
  _offCallback(this, _ENDED_CALLBACK, callback);
};

_prototype.offError = function (callback) {
  _offCallback(this, _ERROR_CALLBACK, callback);
};

_prototype.offPause = function (callback) {
  _offCallback(this, _PAUSE_CALLBACK, callback);
};

_prototype.offPlay = function (callback) {
  _offCallback(this, _PLAY_CALLBACK, callback);
};

_prototype.offSeeked = function (callback) {
  _offCallback(this, _SEEKED_CALLBACK, callback);
};

_prototype.offSeeking = function (callback) {
  _offCallback(this, _SEEKING_CALLBACK, callback);
};

_prototype.offStop = function (callback) {
  _offCallback(this, _STOP_CALLBACK, callback);
};

_prototype.offTimeUpdate = function (callback) {
  var result = _offCallback(this, _TIME_UPDATE_CALLBACK, callback);

  if (result === 1) {
    clearInterval(_weakMap.get(this).intervalID);
  }
};

_prototype.offWaiting = function (callback) {
  _offCallback(this, _WAITING_CALLBACK, callback);
};

_prototype.onCanplay = function (callback) {
  _onCallback(this, _CANPLAY_CALLBACK, callback);
};

_prototype.onEnded = function (callback) {
  _onCallback(this, _ENDED_CALLBACK, callback);
};

_prototype.onError = function (callback) {
  _onCallback(this, _ERROR_CALLBACK, callback);
};

_prototype.onPause = function (callback) {
  _onCallback(this, _PAUSE_CALLBACK, callback);
};

_prototype.onPlay = function (callback) {
  _onCallback(this, _PLAY_CALLBACK, callback);
};

_prototype.onSeeked = function (callback) {
  _onCallback(this, _SEEKED_CALLBACK, callback);
};

_prototype.onSeeking = function (callback) {
  _onCallback(this, "seekingCallbacks", callback);
};

_prototype.onStop = function (callback) {
  _onCallback(this, _STOP_CALLBACK, callback);
};

_prototype.onTimeUpdate = function (callback) {
  var result = _onCallback(this, _TIME_UPDATE_CALLBACK, callback);

  if (result === 1) {
    var privateThis = _weakMap.get(this);

    var self = this;
    var intervalID = setInterval(function () {
      var privateThis = _weakMap.get(self);

      if (privateThis) {
        var audioID = privateThis.audioID;

        if (typeof audioID === "number" && audioID >= 0 && _audioEngine.getState(audioID) === _STATE.PLAYING) {
          _dispatchCallback(self, _TIME_UPDATE_CALLBACK);
        }
      } else {
        clearInterval(intervalID);
      }
    }, 500);
    privateThis.intervalID = intervalID;
  }
};

_prototype.onWaiting = function (callback) {
  _onCallback(this, _WAITING_CALLBACK, callback);
};

function _default(AudioEngine) {
  if (_audioEngine === undefined) {
    _audioEngine = Object.assign({}, AudioEngine);
    Object.keys(AudioEngine).forEach(function (name) {
      if (typeof AudioEngine[name] === "function") {
        AudioEngine[name] = function () {
          console.warn("AudioEngine." + name + " is deprecated");
          return _audioEngine[name].apply(AudioEngine, arguments);
        };
      }
    });
  }

  return new InnerAudioContext();
}

;

},{}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = {
  exportTo: function exportTo(name, from, to, errCallback) {
    if (_typeof(from) !== "object" || _typeof(to) !== "object") {
      console.warn("invalid exportTo: ", name);
      return;
    }

    var fromProperty = from[name];

    if (typeof fromProperty !== "undefined") {
      if (typeof fromProperty === "function") {
        to[name] = fromProperty.bind(from);
        Object.assign(to[name], fromProperty);
      } else {
        to[name] = fromProperty;
      }
    } else {
      to[name] = function () {
        console.error(name + " is not support!");
        return {};
      };

      if (typeof errCallback === "function") {
        errCallback();
      }
    }
  }
};
exports["default"] = _default;

},{}]},{},[9]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJqc2IuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHNbXCJkZWZhdWx0XCJdID0gdm9pZCAwO1xudmFyIF9mZWF0dXJlcyA9IHt9O1xudmFyIF9kZWZhdWx0ID0ge1xuICBzZXRGZWF0dXJlOiBmdW5jdGlvbiBzZXRGZWF0dXJlKGZlYXR1cmVOYW1lLCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICB2YXIgZmVhdHVyZSA9IF9mZWF0dXJlc1tmZWF0dXJlTmFtZV07XG5cbiAgICBpZiAoIWZlYXR1cmUpIHtcbiAgICAgIGZlYXR1cmUgPSBfZmVhdHVyZXNbZmVhdHVyZU5hbWVdID0ge307XG4gICAgfVxuXG4gICAgZmVhdHVyZVtwcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgfSxcbiAgZ2V0RmVhdHVyZVByb3BlcnR5OiBmdW5jdGlvbiBnZXRGZWF0dXJlUHJvcGVydHkoZmVhdHVyZU5hbWUsIHByb3BlcnR5KSB7XG4gICAgdmFyIGZlYXR1cmUgPSBfZmVhdHVyZXNbZmVhdHVyZU5hbWVdO1xuICAgIHJldHVybiBmZWF0dXJlID8gZmVhdHVyZVtwcm9wZXJ0eV0gOiB1bmRlZmluZWQ7XG4gIH1cbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XSwyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uU2hvd1wiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uSGlkZVwiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZlNob3dcIiwgaGJzLCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZIaWRlXCIsIGhicywgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjB9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImxvYWRTdWJwYWNrYWdlXCIsIGhicywgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjB9XSw0OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImVudlwiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldFN5c3RlbUluZm9cIiwgaGJzLCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRTeXN0ZW1JbmZvU3luY1wiLCBoYnMsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIwfV0sNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxuaWYgKCF3aW5kb3cuanNiKSB7XG4gIHdpbmRvdy5qc2IgPSB7fTtcbn1cblxudmFyIGpzYiA9IHdpbmRvdy5qc2I7XG52YXIgX3RvdWNoZXMgPSBbXTtcblxudmFyIF9nZXRUb3VjaEluZGV4ID0gZnVuY3Rpb24gX2dldFRvdWNoSW5kZXgodG91Y2gpIHtcbiAgdmFyIGVsZW1lbnQ7XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IF90b3VjaGVzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGVsZW1lbnQgPSBfdG91Y2hlc1tpbmRleF07XG5cbiAgICBpZiAodG91Y2guaWRlbnRpZmllciA9PT0gZWxlbWVudC5pZGVudGlmaWVyKSB7XG4gICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xO1xufTtcblxudmFyIF9jb3B5T2JqZWN0ID0gZnVuY3Rpb24gX2NvcHlPYmplY3QoZnJvbU9iaiwgdG9PYmplY3QpIHtcbiAgZm9yICh2YXIga2V5IGluIGZyb21PYmopIHtcbiAgICBpZiAoZnJvbU9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0b09iamVjdFtrZXldID0gZnJvbU9ialtrZXldO1xuICAgIH1cbiAgfVxufTtcblxudmFyIF9saXN0ZW5lck1hcCA9IHtcbiAgXCJ0b3VjaHN0YXJ0XCI6IFtdLFxuICBcInRvdWNobW92ZVwiOiBbXSxcbiAgXCJ0b3VjaGVuZFwiOiBbXSxcbiAgXCJ0b3VjaGNhbmNlbFwiOiBbXVxufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKGtleSwgdmFsdWUpIHtcbiAgdmFyIGxpc3RlbmVyQXJyID0gX2xpc3RlbmVyTWFwW2tleV07XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwLCBsZW5ndGggPSBsaXN0ZW5lckFyci5sZW5ndGg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgaWYgKHZhbHVlID09PSBsaXN0ZW5lckFycltpbmRleF0pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cblxuICBsaXN0ZW5lckFyci5wdXNoKHZhbHVlKTtcbn1cblxuZnVuY3Rpb24gX3JlbW92ZUxpc3RlbmVyKGtleSwgdmFsdWUpIHtcbiAgdmFyIGxpc3RlbmVyQXJyID0gX2xpc3RlbmVyTWFwW2tleV0gfHwgW107XG4gIHZhciBsZW5ndGggPSBsaXN0ZW5lckFyci5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgIGlmICh2YWx1ZSA9PT0gbGlzdGVuZXJBcnJbaW5kZXhdKSB7XG4gICAgICBsaXN0ZW5lckFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuXG52YXIgX2hhc0RlbGxXaXRoID0gZmFsc2U7XG5cbnZhciBfc3lzdGVtSW5mbyA9IGhicy5nZXRTeXN0ZW1JbmZvU3luYygpO1xuXG5pZiAod2luZG93LmlubmVyV2lkdGggJiYgX3N5c3RlbUluZm8ud2luZG93V2lkdGggIT09IHdpbmRvdy5pbm5lcldpZHRoKSB7XG4gIF9oYXNEZWxsV2l0aCA9IHRydWU7XG59XG5cbnZhciBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5ID0gZnVuY3Rpb24gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSh0eXBlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoY2hhbmdlZFRvdWNoZXMpIHtcbiAgICBpZiAodHlwZW9mIGNoYW5nZWRUb3VjaGVzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIF9hZGRMaXN0ZW5lcih0eXBlLCBjaGFuZ2VkVG91Y2hlcyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdG91Y2hFdmVudCA9IG5ldyBUb3VjaEV2ZW50KHR5cGUpO1xuICAgIHZhciBpbmRleDtcblxuICAgIGlmICh0eXBlID09PSBcInRvdWNoc3RhcnRcIikge1xuICAgICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgICAgaW5kZXggPSBfZ2V0VG91Y2hJbmRleCh0b3VjaCk7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBfY29weU9iamVjdCh0b3VjaCwgX3RvdWNoZXNbaW5kZXhdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdG1wID0ge307XG5cbiAgICAgICAgICBfY29weU9iamVjdCh0b3VjaCwgdG1wKTtcblxuICAgICAgICAgIF90b3VjaGVzLnB1c2godG1wKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSBcInRvdWNobW92ZVwiKSB7XG4gICAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIGluZGV4ID0gX2dldFRvdWNoSW5kZXgoZWxlbWVudCk7XG5cbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgICBfY29weU9iamVjdChlbGVtZW50LCBfdG91Y2hlc1tpbmRleF0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwidG91Y2hlbmRcIiB8fCB0eXBlID09PSBcInRvdWNoY2FuY2VsXCIpIHtcbiAgICAgIGNoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaW5kZXggPSBfZ2V0VG91Y2hJbmRleChlbGVtZW50KTtcblxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIF90b3VjaGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciB0b3VjaGVzID0gW10uY29uY2F0KF90b3VjaGVzKTtcbiAgICB2YXIgX2NoYW5nZWRUb3VjaGVzID0gW107XG4gICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgIHZhciBsZW5ndGggPSB0b3VjaGVzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgX2luZGV4ID0gMDsgX2luZGV4IDwgbGVuZ3RoOyArK19pbmRleCkge1xuICAgICAgICB2YXIgX3RvdWNoID0gdG91Y2hlc1tfaW5kZXhdO1xuXG4gICAgICAgIGlmICh0b3VjaC5pZGVudGlmaWVyID09PSBfdG91Y2guaWRlbnRpZmllcikge1xuICAgICAgICAgIF9jaGFuZ2VkVG91Y2hlcy5wdXNoKF90b3VjaCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgX2NoYW5nZWRUb3VjaGVzLnB1c2godG91Y2gpO1xuICAgIH0pO1xuICAgIHRvdWNoRXZlbnQudG91Y2hlcyA9IHRvdWNoZXM7XG4gICAgdG91Y2hFdmVudC50YXJnZXRUb3VjaGVzID0gdG91Y2hlcztcbiAgICB0b3VjaEV2ZW50LmNoYW5nZWRUb3VjaGVzID0gX2NoYW5nZWRUb3VjaGVzO1xuXG4gICAgaWYgKF9oYXNEZWxsV2l0aCkge1xuICAgICAgdG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uICh0b3VjaCkge1xuICAgICAgICB0b3VjaC5jbGllbnRYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0b3VjaC5jbGllbnRZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0b3VjaC5wYWdlWCAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgdG91Y2gucGFnZVkgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICB9KTtcblxuICAgICAgaWYgKHR5cGUgPT09IFwidG91Y2hjYW5jZWxcIiB8fCB0eXBlID09PSBcInRvdWNoZW5kXCIpIHtcbiAgICAgICAgX2NoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICAgICAgdG91Y2guY2xpZW50WCAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICB0b3VjaC5jbGllbnRZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIHRvdWNoLnBhZ2VYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIHRvdWNoLnBhZ2VZIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbGlzdGVuZXJBcnIgPSBfbGlzdGVuZXJNYXBbdHlwZV07XG4gICAgdmFyIGxlbmd0aCA9IGxpc3RlbmVyQXJyLmxlbmd0aDtcblxuICAgIGZvciAodmFyIF9pbmRleDIgPSAwOyBfaW5kZXgyIDwgbGVuZ3RoOyBfaW5kZXgyKyspIHtcbiAgICAgIGxpc3RlbmVyQXJyW19pbmRleDJdKHRvdWNoRXZlbnQpO1xuICAgIH1cbiAgfTtcbn07XG5cbmlmIChoYnMub25Ub3VjaFN0YXJ0KSB7XG4gIHJhbC5vblRvdWNoU3RhcnQgPSBoYnMub25Ub3VjaFN0YXJ0O1xuICByYWwub2ZmVG91Y2hTdGFydCA9IGhicy5vZmZUb3VjaFN0YXJ0O1xufSBlbHNlIHtcbiAganNiLm9uVG91Y2hTdGFydCA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNoc3RhcnQnKTtcblxuICBqc2Iub2ZmVG91Y2hTdGFydCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIF9yZW1vdmVMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoU3RhcnQgPSBqc2Iub25Ub3VjaFN0YXJ0LmJpbmQoanNiKTtcbiAgcmFsLm9mZlRvdWNoU3RhcnQgPSBqc2Iub2ZmVG91Y2hTdGFydC5iaW5kKGpzYik7XG59XG5cbmlmIChoYnMub25Ub3VjaE1vdmUpIHtcbiAgcmFsLm9uVG91Y2hNb3ZlID0gaGJzLm9uVG91Y2hNb3ZlO1xuICByYWwub2ZmVG91Y2hNb3ZlID0gaGJzLm9mZlRvdWNoTW92ZTtcbn0gZWxzZSB7XG4gIGpzYi5vblRvdWNoTW92ZSA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNobW92ZScpO1xuXG4gIGpzYi5vZmZUb3VjaE1vdmUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoTW92ZSA9IGpzYi5vblRvdWNoTW92ZS5iaW5kKGpzYik7XG4gIHJhbC5vZmZUb3VjaE1vdmUgPSBqc2Iub2ZmVG91Y2hNb3ZlLmJpbmQoanNiKTtcbn1cblxuaWYgKGhicy5vblRvdWNoQ2FuY2VsKSB7XG4gIHJhbC5vblRvdWNoQ2FuY2VsID0gaGJzLm9uVG91Y2hDYW5jZWw7XG4gIHJhbC5vZmZUb3VjaENhbmNlbCA9IGhicy5vZmZUb3VjaENhbmNlbDtcbn0gZWxzZSB7XG4gIGpzYi5vblRvdWNoQ2FuY2VsID0gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSgndG91Y2hjYW5jZWwnKTtcblxuICBqc2Iub2ZmVG91Y2hDYW5jZWwgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaGNhbmNlbFwiLCBjYWxsYmFjayk7XG4gIH07XG5cbiAgcmFsLm9uVG91Y2hDYW5jZWwgPSBqc2Iub25Ub3VjaENhbmNlbC5iaW5kKGpzYik7XG4gIHJhbC5vZmZUb3VjaENhbmNlbCA9IGpzYi5vZmZUb3VjaENhbmNlbC5iaW5kKGpzYik7XG59XG5cbmlmIChoYnMub25Ub3VjaEVuZCkge1xuICByYWwub25Ub3VjaEVuZCA9IGhicy5vblRvdWNoRW5kO1xuICByYWwub2ZmVG91Y2hFbmQgPSBoYnMub2ZmVG91Y2hFbmQ7XG59IGVsc2Uge1xuICBqc2Iub25Ub3VjaEVuZCA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNoZW5kJyk7XG5cbiAganNiLm9mZlRvdWNoRW5kID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgX3JlbW92ZUxpc3RlbmVyKFwidG91Y2hlbmRcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoRW5kID0ganNiLm9uVG91Y2hFbmQuYmluZChqc2IpO1xuICByYWwub2ZmVG91Y2hFbmQgPSBqc2Iub2ZmVG91Y2hFbmQuYmluZChqc2IpO1xufVxuXG59LHt9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3N5c3RlbUluZm8gPSBoYnMuZ2V0U3lzdGVtSW5mb1N5bmMoKTtcblxudmFyIF9saXN0ZW5lcnMgPSBbXTtcbnJhbC5kZXZpY2UgPSByYWwuZGV2aWNlIHx8IHt9O1xucmFsLnN0b3BBY2NlbGVyb21ldGVyID0gaGJzLnN0b3BBY2NlbGVyb21ldGVyLmJpbmQoaGJzKTtcbnJhbC5zdGFydEFjY2VsZXJvbWV0ZXIgPSBoYnMuc3RhcnRBY2NlbGVyb21ldGVyLmJpbmQoaGJzKTtcbnJhbC5vbkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBoYnMub25BY2NlbGVyb21ldGVyQ2hhbmdlLmJpbmQoaGJzKTtcblxufSx7fV0sNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRCYXR0ZXJ5SW5mb1wiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldEJhdHRlcnlJbmZvU3luY1wiLCBoYnMsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIwfV0sODpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRGaWxlU3lzdGVtTWFuYWdlclwiLCBoYnMsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIwfV0sOTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vdXRpbFwiKSk7XG5cbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL2ZlYXR1cmVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuaWYgKCF3aW5kb3cucmFsKSB7XG4gIHdpbmRvdy5yYWwgPSB7fTtcbn1cblxucmVxdWlyZShcIi4vYmFzZS9saWZlY3ljbGVcIik7XG5cbnJlcXVpcmUoXCIuL2Jhc2Uvc3VicGFja2FnZVwiKTtcblxucmVxdWlyZShcIi4vYmFzZS9zeXN0ZW0taW5mb1wiKTtcblxucmVxdWlyZShcIi4vYmFzZS90b3VjaC1ldmVudFwiKTtcblxucmVxdWlyZShcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIik7XG5cbnJlcXVpcmUoXCIuL2RldmljZS9iYXR0ZXJ5XCIpO1xuXG5yZXF1aXJlKFwiLi9maWxlL2ZpbGUtc3lzdGVtLW1hbmFnZXJcIik7XG5cbnJlcXVpcmUoXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiKTtcblxucmVxdWlyZShcIi4vaW50ZXJmYWNlL3dpbmRvd1wiKTtcblxucmVxdWlyZShcIi4vbWVkaWEvYXVkaW9cIik7XG5cbnJlcXVpcmUoXCIuL25ldHdvcmsvZG93bmxvYWRcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9jYW52YXNcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy93ZWJnbFwiKTtcblxucmVxdWlyZShcIi4vcmVuZGVyaW5nL2ZvbnRcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9mcmFtZVwiKTtcblxucmVxdWlyZShcIi4vcmVuZGVyaW5nL2ltYWdlXCIpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRGZWF0dXJlUHJvcGVydHlcIiwgX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLCByYWwpO1xuXG59LHtcIi4uL2ZlYXR1cmVcIjoxLFwiLi4vdXRpbFwiOjIwLFwiLi9iYXNlL2xpZmVjeWNsZVwiOjIsXCIuL2Jhc2Uvc3VicGFja2FnZVwiOjMsXCIuL2Jhc2Uvc3lzdGVtLWluZm9cIjo0LFwiLi9iYXNlL3RvdWNoLWV2ZW50XCI6NSxcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIjo2LFwiLi9kZXZpY2UvYmF0dGVyeVwiOjcsXCIuL2ZpbGUvZmlsZS1zeXN0ZW0tbWFuYWdlclwiOjgsXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiOjEwLFwiLi9pbnRlcmZhY2Uvd2luZG93XCI6MTEsXCIuL21lZGlhL2F1ZGlvXCI6MTIsXCIuL25ldHdvcmsvZG93bmxvYWRcIjoxMyxcIi4vcmVuZGVyaW5nL2NhbnZhc1wiOjE0LFwiLi9yZW5kZXJpbmcvZm9udFwiOjE1LFwiLi9yZW5kZXJpbmcvZnJhbWVcIjoxNixcIi4vcmVuZGVyaW5nL2ltYWdlXCI6MTcsXCIuL3JlbmRlcmluZy93ZWJnbFwiOjE4fV0sMTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25LZXlib2FyZElucHV0XCIsIGhicywgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25LZXlib2FyZENvbmZpcm1cIiwgaGJzLCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvbktleWJvYXJkQ29tcGxldGVcIiwgaGJzLCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJvZmZLZXlib2FyZElucHV0XCIsIGhicywgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmS2V5Ym9hcmRDb25maXJtXCIsIGhicywgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmS2V5Ym9hcmRDb21wbGV0ZVwiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImhpZGVLZXlib2FyZFwiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcInNob3dLZXlib2FyZFwiLCBoYnMsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcInVwZGF0ZUtleWJvYXJkXCIsIGhicywgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjB9XSwxMTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF9vbldpbmRvd1Jlc2l6ZSA9IGhicy5vbldpbmRvd1Jlc2l6ZTtcblxucmFsLm9uV2luZG93UmVzaXplID0gZnVuY3Rpb24gKGNhbGxCYWNrKSB7XG4gIF9vbldpbmRvd1Jlc2l6ZShmdW5jdGlvbiAoc2l6ZSkge1xuICAgIGNhbGxCYWNrKHNpemUud2lkdGggfHwgc2l6ZS53aW5kb3dXaWR0aCwgc2l6ZS5oZWlnaHQgfHwgc2l6ZS53aW5kb3dIZWlnaHQpO1xuICB9KTtcbn07XG5cbn0se31dLDEyOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX2lubmVyQ29udGV4dCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2lubmVyLWNvbnRleHRcIikpO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIkF1ZGlvRW5naW5lXCIsIGhicywgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiY3JlYXRlSW5uZXJBdWRpb0NvbnRleHRcIiwgaGJzLCByYWwsIGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9ydC5BdWRpb0VuZ2luZSkge1xuICAgIHJhbC5jcmVhdGVJbm5lckF1ZGlvQ29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoMCwgX2lubmVyQ29udGV4dFtcImRlZmF1bHRcIl0pKGhicy5BdWRpb0VuZ2luZSk7XG4gICAgfTtcbiAgfVxufSk7XG5cbn0se1wiLi4vLi4vaW5uZXItY29udGV4dFwiOjE5LFwiLi4vLi4vdXRpbFwiOjIwfV0sMTM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZG93bmxvYWRGaWxlXCIsIGhicywgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjB9XSwxNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2ZlYXR1cmVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiY3JlYXRlQ2FudmFzXCIsIGhicywgcmFsLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBmZWF0dXJlVmFsdWUgPSBcInVuc3VwcG9ydGVkXCI7XG5cbiAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmZWF0dXJlVmFsdWUgPSBcIndyYXBwZXJcIjtcblxuICAgIHJhbC5jcmVhdGVDYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICB9O1xuICB9XG5cbiAgX2ZlYXR1cmVbXCJkZWZhdWx0XCJdLnNldEZlYXR1cmUoXCJyYWwuY3JlYXRlQ2FudmFzXCIsIFwic3BlY1wiLCBmZWF0dXJlVmFsdWUpO1xufSk7XG5cbn0se1wiLi4vLi4vZmVhdHVyZVwiOjEsXCIuLi8uLi91dGlsXCI6MjB9XSwxNTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJsb2FkRm9udFwiLCBoYnMsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIwfV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmIChqc2IgJiYganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCkge1xuICByYWwuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kID0ganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZC5iaW5kKGpzYik7XG59IGVsc2UgaWYgKGhicy5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQpIHtcbiAgcmFsLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCA9IGhicy5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQuYmluZChoYnMpO1xuXG4gIGlmIChqc2IpIHtcbiAgICBqc2Iuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kID0gcmFsLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZC5iaW5kKHJhbCk7XG4gIH1cbn0gZWxzZSB7XG4gIHJhbC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgY29uc29sZS5lcnJvcihcIlRoZSBzZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgaXMgbm90IGRlZmluZSFcIik7XG4gIH07XG5cbiAgaWYgKGpzYikge1xuICAgIGpzYi5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiVGhlIHNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCBpcyBub3QgZGVmaW5lIVwiKTtcbiAgICB9O1xuICB9XG59XG5cbn0se31dLDE3OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxudmFyIF9mZWF0dXJlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vZmVhdHVyZVwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJsb2FkSW1hZ2VEYXRhXCIsIGhicywgcmFsLCBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YganNiLmxvYWRJbWFnZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmFsLmxvYWRJbWFnZURhdGEgPSBqc2IubG9hZEltYWdlO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJsb2FkSW1hZ2VEYXRhIGlzIG5vdCBmdW5jdGlvblwiKTtcbiAgfVxufSk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZUltYWdlXCIsIGhicywgcmFsLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBmZWF0dXJlVmFsdWUgPSBcInVuc3VwcG9ydGVkXCI7XG5cbiAgaWYgKGRvY3VtZW50ICYmIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmZWF0dXJlVmFsdWUgPSBcIndyYXBwZXJcIjtcblxuICAgIHJhbC5jcmVhdGVJbWFnZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1hZ2VcIik7XG4gICAgfTtcbiAgfVxufSk7XG5cbnZhciBmZWF0dXJlVmFsdWUgPSBcImh1YXdlaV9wbGF0Zm9ybV9zdXBwb3J0XCI7XG5cbl9mZWF0dXJlW1wiZGVmYXVsdFwiXS5zZXRGZWF0dXJlKFwicmFsLmNyZWF0ZUltYWdlXCIsIFwic3BlY1wiLCBmZWF0dXJlVmFsdWUpO1xuXG59LHtcIi4uLy4uL2ZlYXR1cmVcIjoxLFwiLi4vLi4vdXRpbFwiOjIwfV0sMTg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmICh3aW5kb3cuX19nbCkge1xuICB2YXIgZ2wgPSB3aW5kb3cuX19nbDtcbiAgdmFyIF9nbFRleEltYWdlMkQgPSBnbC50ZXhJbWFnZTJEO1xuXG4gIGdsLnRleEltYWdlMkQgPSBmdW5jdGlvbiAodGFyZ2V0LCBsZXZlbCwgaW50ZXJuYWxmb3JtYXQsIHdpZHRoLCBoZWlnaHQsIGJvcmRlciwgZm9ybWF0LCB0eXBlLCBwaXhlbHMpIHtcbiAgICB2YXIgYXJnYyA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgICBpZiAoYXJnYyA9PT0gNikge1xuICAgICAgdmFyIGltYWdlID0gYm9yZGVyO1xuICAgICAgdHlwZSA9IGhlaWdodDtcbiAgICAgIGZvcm1hdCA9IHdpZHRoO1xuXG4gICAgICBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XG4gICAgICAgIF9nbFRleEltYWdlMkQodGFyZ2V0LCBsZXZlbCwgaW1hZ2UuX2dsSW50ZXJuYWxGb3JtYXQsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsIDAsIGltYWdlLl9nbEZvcm1hdCwgaW1hZ2UuX2dsVHlwZSwgaW1hZ2UuX2RhdGEpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIGlmIChpbWFnZS5fY29udGV4dDJEICYmIGltYWdlLl9jb250ZXh0MkQuX2dldERhdGEpIHtcbiAgICAgICAgICB2YXIgZGF0YSA9IGltYWdlLl9jb250ZXh0MkQuX2dldERhdGEoKTtcblxuICAgICAgICAgIF9nbFRleEltYWdlMkQodGFyZ2V0LCBsZXZlbCwgaW50ZXJuYWxmb3JtYXQsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsIDAsIGZvcm1hdCwgdHlwZSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgaW1hZ2UgYXJndW1lbnQgZ2wudGV4SW1hZ2UyRCFcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaGVpZ2h0ICYmIGltYWdlLndpZHRoICYmIGltYWdlLmRhdGEpIHtcbiAgICAgICAgdmFyIGVycm9yID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgX2dsVGV4SW1hZ2UyRCh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgaW1hZ2Uud2lkdGgsIGltYWdlLmhlaWdodCwgMCwgZm9ybWF0LCB0eXBlLCBpbWFnZS5kYXRhKTtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZXJyb3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBwaXhlbCBhcmd1bWVudCBwYXNzZWQgdG8gZ2wudGV4SW1hZ2UyRCFcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcmdjID09PSA5KSB7XG4gICAgICBfZ2xUZXhJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIGZvcm1hdCwgdHlwZSwgcGl4ZWxzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcImdsLnRleEltYWdlMkQ6IGludmFsaWQgYXJndW1lbnQgY291bnQhXCIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2dsVGV4U3ViSW1hZ2UyRCA9IGdsLnRleFN1YkltYWdlMkQ7XG5cbiAgZ2wudGV4U3ViSW1hZ2UyRCA9IGZ1bmN0aW9uICh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIHBpeGVscykge1xuICAgIHZhciBhcmdjID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIGlmIChhcmdjID09PSA3KSB7XG4gICAgICB2YXIgaW1hZ2UgPSBmb3JtYXQ7XG4gICAgICB0eXBlID0gaGVpZ2h0O1xuICAgICAgZm9ybWF0ID0gd2lkdGg7XG5cbiAgICAgIGlmIChpbWFnZSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCBpbWFnZS5fZ2xGb3JtYXQsIGltYWdlLl9nbFR5cGUsIGltYWdlLl9kYXRhKTtcbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UgaW5zdGFuY2VvZiBIVE1MQ2FudmFzRWxlbWVudCkge1xuICAgICAgICBpZiAoaW1hZ2UuX2NvbnRleHQyRCAmJiBpbWFnZS5fY29udGV4dDJELl9nZXREYXRhKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSBpbWFnZS5fY29udGV4dDJELl9nZXREYXRhKCk7XG5cbiAgICAgICAgICBfZ2xUZXhTdWJJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIHhvZmZzZXQsIHlvZmZzZXQsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsIGZvcm1hdCwgdHlwZSwgZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgaW1hZ2UgYXJndW1lbnQgZ2wudGV4U3ViSW1hZ2UyRCFcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoaW1hZ2UuaGVpZ2h0ICYmIGltYWdlLndpZHRoICYmIGltYWdlLmRhdGEpIHtcbiAgICAgICAgdmFyIGVycm9yID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIGltYWdlLmRhdGEpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBlcnJvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJJbnZhbGlkIHBpeGVsIGFyZ3VtZW50IHBhc3NlZCB0byBnbC50ZXhTdWJJbWFnZTJEIVwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGFyZ2MgPT09IDkpIHtcbiAgICAgIF9nbFRleFN1YkltYWdlMkQodGFyZ2V0LCBsZXZlbCwgeG9mZnNldCwgeW9mZnNldCwgd2lkdGgsIGhlaWdodCwgZm9ybWF0LCB0eXBlLCBwaXhlbHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKG5ldyBFcnJvcihcImdsLnRleEltYWdlMkQ6IGludmFsaWQgYXJndW1lbnQgY291bnQhXCIpLnN0YWNrKTtcbiAgICB9XG4gIH07XG59XG5cbn0se31dLDE5OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcbnZhciBfQ0FOUExBWV9DQUxMQkFDSyA9IFwiY2FucGxheUNhbGxiYWNrc1wiO1xudmFyIF9FTkRFRF9DQUxMQkFDSyA9IFwiZW5kZWRDYWxsYmFja3NcIjtcbnZhciBfRVJST1JfQ0FMTEJBQ0sgPSBcImVycm9yQ2FsbGJhY2tzXCI7XG52YXIgX1BBVVNFX0NBTExCQUNLID0gXCJwYXVzZUNhbGxiYWNrc1wiO1xudmFyIF9QTEFZX0NBTExCQUNLID0gXCJwbGF5Q2FsbGJhY2tzXCI7XG52YXIgX1NFRUtFRF9DQUxMQkFDSyA9IFwic2Vla2VkQ2FsbGJhY2tzXCI7XG52YXIgX1NFRUtJTkdfQ0FMTEJBQ0sgPSBcInNlZWtpbmdDYWxsYmFja3NcIjtcbnZhciBfU1RPUF9DQUxMQkFDSyA9IFwic3RvcENhbGxiYWNrc1wiO1xudmFyIF9USU1FX1VQREFURV9DQUxMQkFDSyA9IFwidGltZVVwZGF0ZUNhbGxiYWNrc1wiO1xudmFyIF9XQUlUSU5HX0NBTExCQUNLID0gXCJ3YWl0aW5nQ2FsbGJhY2tzXCI7XG52YXIgX0VSUk9SX0NPREUgPSB7XG4gIEVSUk9SX1NZU1RFTTogMTAwMDEsXG4gIEVSUk9SX05FVDogMTAwMDIsXG4gIEVSUk9SX0ZJTEU6IDEwMDAzLFxuICBFUlJPUl9GT1JNQVQ6IDEwMDA0LFxuICBFUlJPUl9VTktOT1dOOiAtMVxufTtcbnZhciBfU1RBVEUgPSB7XG4gIEVSUk9SOiAtMSxcbiAgSU5JVElBTElaSU5HOiAwLFxuICBQTEFZSU5HOiAxLFxuICBQQVVTRUQ6IDJcbn07XG52YXIgX2F1ZGlvRW5naW5lID0gdW5kZWZpbmVkO1xuXG52YXIgX3dlYWtNYXAgPSBuZXcgV2Vha01hcCgpO1xuXG52YXIgX29mZkNhbGxiYWNrID0gZnVuY3Rpb24gX29mZkNhbGxiYWNrKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRhcmdldCk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiIHx8ICFwcml2YXRlVGhpcykge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHZhciBjYWxsYmFja3MgPSBwcml2YXRlVGhpc1t0eXBlXSB8fCBbXTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGNhbGxiYWNrID09PSBjYWxsYmFja3NbaV0pIHtcbiAgICAgIGNhbGxiYWNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICByZXR1cm4gY2FsbGJhY2subGVuZ3RoICsgMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn07XG5cbnZhciBfb25DYWxsYmFjayA9IGZ1bmN0aW9uIF9vbkNhbGxiYWNrKHRhcmdldCwgdHlwZSwgY2FsbGJhY2spIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRhcmdldCk7XG5cbiAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gXCJmdW5jdGlvblwiIHx8ICFwcml2YXRlVGhpcykge1xuICAgIHJldHVybiAtMTtcbiAgfVxuXG4gIHZhciBjYWxsYmFja3MgPSBwcml2YXRlVGhpc1t0eXBlXTtcblxuICBpZiAoIWNhbGxiYWNrcykge1xuICAgIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdID0gW2NhbGxiYWNrXTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBpZiAoY2FsbGJhY2sgPT09IGNhbGxiYWNrc1tpXSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxsYmFja3MucHVzaChjYWxsYmFjayk7XG4gIH1cblxuICByZXR1cm4gY2FsbGJhY2tzLmxlbmd0aDtcbn07XG5cbnZhciBfZGlzcGF0Y2hDYWxsYmFjayA9IGZ1bmN0aW9uIF9kaXNwYXRjaENhbGxiYWNrKHRhcmdldCwgdHlwZSkge1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogW107XG5cbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRhcmdldCk7XG5cbiAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgdmFyIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdIHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRhcmdldCwgYXJncyk7XG4gICAgfVxuICB9XG59O1xuXG5mdW5jdGlvbiBJbm5lckF1ZGlvQ29udGV4dCgpIHtcbiAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICB0aGlzLmF1dG9wbGF5ID0gZmFsc2U7XG5cbiAgX3dlYWtNYXAuc2V0KHRoaXMsIHtcbiAgICBzcmM6IFwiXCIsXG4gICAgdm9sdW1lOiAxLFxuICAgIGxvb3A6IGZhbHNlXG4gIH0pO1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImxvb3BcIiwge1xuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICB2YWx1ZSA9ICEhdmFsdWU7XG5cbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgX2F1ZGlvRW5naW5lLnNldExvb3AoYXVkaW9JRCwgdmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZVRoaXMubG9vcCA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIHJldHVybiBwcml2YXRlVGhpcyA/IHByaXZhdGVUaGlzLmxvb3AgOiBmYWxzZTtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJ2b2x1bWVcIiwge1xuICAgIHNldDogZnVuY3Rpb24gc2V0KHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGlmICh2YWx1ZSA8IDApIHtcbiAgICAgICAgICB2YWx1ZSA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPiAxKSB7XG4gICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICB9XG5cbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgX2F1ZGlvRW5naW5lLnNldFZvbHVtZShhdWRpb0lELCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlVGhpcy52b2x1bWUgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICByZXR1cm4gcHJpdmF0ZVRoaXMgPyBwcml2YXRlVGhpcy52b2x1bWUgOiAxO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInNyY1wiLCB7XG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKCFwcml2YXRlVGhpcykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBvbGRTcmMgPSBwcml2YXRlVGhpcy5zcmM7XG4gICAgICBwcml2YXRlVGhpcy5zcmMgPSB2YWx1ZTtcblxuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCAmJiBfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QQVVTRUQgJiYgb2xkU3JjICE9PSB2YWx1ZSkge1xuICAgICAgICAgIF9hdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuXG4gICAgICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAgIF9hdWRpb0VuZ2luZS5wcmVsb2FkKHZhbHVlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5zcmMgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9DQU5QTEFZX0NBTExCQUNLKTtcblxuICAgICAgICAgICAgICBpZiAoc2VsZi5hdXRvcGxheSkge1xuICAgICAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIHJldHVybiBwcml2YXRlVGhpcyA/IHByaXZhdGVUaGlzLnNyYyA6IFwiXCI7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiZHVyYXRpb25cIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICByZXR1cm4gX2F1ZGlvRW5naW5lLmdldER1cmF0aW9uKGF1ZGlvSUQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBOYU47XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJjdXJyZW50VGltZVwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0Q3VycmVudFRpbWUoYXVkaW9JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJwYXVzZWRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICByZXR1cm4gX2F1ZGlvRW5naW5lLmdldFN0YXRlKGF1ZGlvSUQpID09PSBfU1RBVEUuUEFVU0VEO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiYnVmZmVyZWRcIiwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICByZXR1cm4gX2F1ZGlvRW5naW5lLmdldEJ1ZmZlcmVkKGF1ZGlvSUQpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAwO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQoKSB7fVxuICB9KTtcbn1cblxudmFyIF9wcm90b3R5cGUgPSBJbm5lckF1ZGlvQ29udGV4dC5wcm90b3R5cGU7XG5cbl9wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gIGlmIChwcml2YXRlVGhpcykge1xuICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5zdG9wKGF1ZGlvSUQpO1xuXG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TVE9QX0NBTExCQUNLKTtcbiAgICB9XG5cbiAgICBwcml2YXRlVGhpc1tfQ0FOUExBWV9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfRU5ERURfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX0VSUk9SX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19QQVVTRV9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfUExBWV9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfU0VFS0VEX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19TRUVLSU5HX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19TVE9QX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19USU1FX1VQREFURV9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfV0FJVElOR19DQUxMQkFDS10gPSBbXTtcbiAgICBjbGVhckludGVydmFsKHByaXZhdGVUaGlzLmludGVydmFsSUQpO1xuICB9XG59O1xuXG5fcHJvdG90eXBlLnBsYXkgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICBpZiAoIXByaXZhdGVUaGlzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHNyYyA9IHByaXZhdGVUaGlzLnNyYztcbiAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gIGlmICh0eXBlb2Ygc3JjICE9PSBcInN0cmluZ1wiIHx8IHNyYyA9PT0gXCJcIikge1xuICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9FUlJPUl9DQUxMQkFDSywgW3tcbiAgICAgIGVyck1zZzogXCJpbnZhbGlkIHNyY1wiLFxuICAgICAgZXJyQ29kZTogX0VSUk9SX0NPREUuRVJST1JfRklMRVxuICAgIH1dKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICBpZiAoX2F1ZGlvRW5naW5lLmdldFN0YXRlKGF1ZGlvSUQpID09PSBfU1RBVEUuUEFVU0VEKSB7XG4gICAgICBfYXVkaW9FbmdpbmUucmVzdW1lKGF1ZGlvSUQpO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfUExBWV9DQUxMQkFDSyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgX2F1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG5cbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcbiAgICB9XG4gIH1cblxuICBhdWRpb0lEID0gX2F1ZGlvRW5naW5lLnBsYXkoc3JjLCB0aGlzLmxvb3AsIHRoaXMudm9sdW1lKTtcblxuICBpZiAoYXVkaW9JRCA9PT0gLTEpIHtcbiAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIFt7XG4gICAgICBlcnJNc2c6IFwidW5rbm93blwiLFxuICAgICAgZXJyQ29kZTogX0VSUk9SX0NPREUuRVJST1JfVU5LTk9XTlxuICAgIH1dKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSBhdWRpb0lEO1xuXG4gIGlmICh0eXBlb2YgdGhpcy5zdGFydFRpbWUgPT09IFwibnVtYmVyXCIgJiYgdGhpcy5zdGFydFRpbWUgPiAwKSB7XG4gICAgX2F1ZGlvRW5naW5lLnNldEN1cnJlbnRUaW1lKGF1ZGlvSUQsIHRoaXMuc3RhcnRUaW1lKTtcbiAgfVxuXG4gIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9XQUlUSU5HX0NBTExCQUNLKTtcblxuICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgX2F1ZGlvRW5naW5lLnNldENhblBsYXlDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNyYyA9PT0gc2VsZi5zcmMpIHtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9DQU5QTEFZX0NBTExCQUNLKTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX1BMQVlfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG5cbiAgX2F1ZGlvRW5naW5lLnNldFdhaXRpbmdDYWxsYmFjayhhdWRpb0lELCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHNyYyA9PT0gc2VsZi5zcmMpIHtcbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9XQUlUSU5HX0NBTExCQUNLKTtcbiAgICB9XG4gIH0pO1xuXG4gIF9hdWRpb0VuZ2luZS5zZXRFcnJvckNhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfRVJST1JfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG5cbiAgX2F1ZGlvRW5naW5lLnNldEZpbmlzaENhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfRU5ERURfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG59O1xuXG5fcHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnBhdXNlKGF1ZGlvSUQpO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfUEFVU0VfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfVxufTtcblxuX3Byb3RvdHlwZS5zZWVrID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICBpZiAocHJpdmF0ZVRoaXMgJiYgdHlwZW9mIHBvc2l0aW9uID09PSBcIm51bWJlclwiICYmIHBvc2l0aW9uID49IDApIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc2V0Q3VycmVudFRpbWUoYXVkaW9JRCwgcG9zaXRpb24pO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfU0VFS0lOR19DQUxMQkFDSyk7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TRUVLRURfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfVxufTtcblxuX3Byb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG5cbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfVxufTtcblxuX3Byb3RvdHlwZS5vZmZDYW5wbGF5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfQ0FOUExBWV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZFbmRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX0VOREVEX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZkVycm9yID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmUGF1c2UgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9QQVVTRV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZQbGF5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfUExBWV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZTZWVrZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9TRUVLRURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmU2Vla2luZyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1NFRUtJTkdfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmVGltZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgcmVzdWx0ID0gX29mZkNhbGxiYWNrKHRoaXMsIF9USU1FX1VQREFURV9DQUxMQkFDSywgY2FsbGJhY2spO1xuXG4gIGlmIChyZXN1bHQgPT09IDEpIHtcbiAgICBjbGVhckludGVydmFsKF93ZWFrTWFwLmdldCh0aGlzKS5pbnRlcnZhbElEKTtcbiAgfVxufTtcblxuX3Byb3RvdHlwZS5vZmZXYWl0aW5nID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfV0FJVElOR19DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vbkNhbnBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX0NBTlBMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25FbmRlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfRU5ERURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25FcnJvciA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfRVJST1JfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25QYXVzZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfUEFVU0VfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25QbGF5ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9QTEFZX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uU2Vla2VkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9TRUVLRURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25TZWVraW5nID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIFwic2Vla2luZ0NhbGxiYWNrc1wiLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uU3RvcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfU1RPUF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblRpbWVVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgdmFyIHJlc3VsdCA9IF9vbkNhbGxiYWNrKHRoaXMsIF9USU1FX1VQREFURV9DQUxMQkFDSywgY2FsbGJhY2spO1xuXG4gIGlmIChyZXN1bHQgPT09IDEpIHtcbiAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGludGVydmFsSUQgPSBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQoc2VsZik7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCAmJiBfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QTEFZSU5HKSB7XG4gICAgICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX1RJTUVfVVBEQVRFX0NBTExCQUNLKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2xlYXJJbnRlcnZhbChpbnRlcnZhbElEKTtcbiAgICAgIH1cbiAgICB9LCA1MDApO1xuICAgIHByaXZhdGVUaGlzLmludGVydmFsSUQgPSBpbnRlcnZhbElEO1xuICB9XG59O1xuXG5fcHJvdG90eXBlLm9uV2FpdGluZyA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfV0FJVElOR19DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuZnVuY3Rpb24gX2RlZmF1bHQoQXVkaW9FbmdpbmUpIHtcbiAgaWYgKF9hdWRpb0VuZ2luZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgX2F1ZGlvRW5naW5lID0gT2JqZWN0LmFzc2lnbih7fSwgQXVkaW9FbmdpbmUpO1xuICAgIE9iamVjdC5rZXlzKEF1ZGlvRW5naW5lKS5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIEF1ZGlvRW5naW5lW25hbWVdID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgQXVkaW9FbmdpbmVbbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFwiQXVkaW9FbmdpbmUuXCIgKyBuYW1lICsgXCIgaXMgZGVwcmVjYXRlZFwiKTtcbiAgICAgICAgICByZXR1cm4gX2F1ZGlvRW5naW5lW25hbWVdLmFwcGx5KEF1ZGlvRW5naW5lLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBJbm5lckF1ZGlvQ29udGV4dCgpO1xufVxuXG47XG5cbn0se31dLDIwOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSB2b2lkIDA7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IFwiQGJhYmVsL2hlbHBlcnMgLSB0eXBlb2ZcIjsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIF9kZWZhdWx0ID0ge1xuICBleHBvcnRUbzogZnVuY3Rpb24gZXhwb3J0VG8obmFtZSwgZnJvbSwgdG8sIGVyckNhbGxiYWNrKSB7XG4gICAgaWYgKF90eXBlb2YoZnJvbSkgIT09IFwib2JqZWN0XCIgfHwgX3R5cGVvZih0bykgIT09IFwib2JqZWN0XCIpIHtcbiAgICAgIGNvbnNvbGUud2FybihcImludmFsaWQgZXhwb3J0VG86IFwiLCBuYW1lKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZnJvbVByb3BlcnR5ID0gZnJvbVtuYW1lXTtcblxuICAgIGlmICh0eXBlb2YgZnJvbVByb3BlcnR5ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGZyb21Qcm9wZXJ0eSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRvW25hbWVdID0gZnJvbVByb3BlcnR5LmJpbmQoZnJvbSk7XG4gICAgICAgIE9iamVjdC5hc3NpZ24odG9bbmFtZV0sIGZyb21Qcm9wZXJ0eSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b1tuYW1lXSA9IGZyb21Qcm9wZXJ0eTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobmFtZSArIFwiIGlzIG5vdCBzdXBwb3J0IVwiKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfTtcblxuICAgICAgaWYgKHR5cGVvZiBlcnJDYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGVyckNhbGxiYWNrKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV19LHt9LFs5XSk7XG4iXSwiZmlsZSI6ImpzYi5qcyJ9
