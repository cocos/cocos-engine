(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("onShow", _rt, ral);

_util["default"].exportTo("onHide", _rt, ral);

_util["default"].exportTo("offShow", _rt, ral);

_util["default"].exportTo("offHide", _rt, ral);

},{"../../util":21}],2:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadSubpackage", _rt, ral);

},{"../../util":21}],3:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("env", _rt, ral);

_util["default"].exportTo("getSystemInfo", _rt, ral);

_util["default"].exportTo("getSystemInfoSync", _rt, ral);

},{"../../util":21}],4:[function(require,module,exports){
"use strict";

var _jsb = window.jsb;

if (!_jsb) {
  _jsb = {};
}

var _rt = loadRuntime();

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

var _systemInfo = _rt.getSystemInfoSync();

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

if (_rt.onTouchStart) {
  ral.onTouchStart = _rt.onTouchStart;
  ral.offTouchStart = _rt.offTouchStart;
} else {
  _jsb.onTouchStart = _touchEventHandlerFactory('touchstart');

  _jsb.offTouchStart = function (callback) {
    _removeListener("touchstart", callback);
  };

  ral.onTouchStart = _jsb.onTouchStart.bind(_jsb);
  ral.offTouchStart = _jsb.offTouchStart.bind(_jsb);
}

if (_rt.onTouchMove) {
  ral.onTouchMove = _rt.onTouchMove;
  ral.offTouchMove = _rt.offTouchMove;
} else {
  _jsb.onTouchMove = _touchEventHandlerFactory('touchmove');

  _jsb.offTouchMove = function (callback) {
    _removeListener("touchmove", callback);
  };

  ral.onTouchMove = _jsb.onTouchMove.bind(_jsb);
  ral.offTouchMove = _jsb.offTouchMove.bind(_jsb);
}

if (_rt.onTouchCancel) {
  ral.onTouchCancel = _rt.onTouchCancel;
  ral.offTouchCancel = _rt.offTouchCancel;
} else {
  _jsb.onTouchCancel = _touchEventHandlerFactory('touchcancel');

  _jsb.offTouchCancel = function (callback) {
    _removeListener("touchcancel", callback);
  };

  ral.onTouchCancel = _jsb.onTouchCancel.bind(_jsb);
  ral.offTouchCancel = _jsb.offTouchCancel.bind(_jsb);
}

if (_rt.onTouchEnd) {
  ral.onTouchEnd = _rt.onTouchEnd;
  ral.offTouchEnd = _rt.offTouchEnd;
} else {
  _jsb.onTouchEnd = _touchEventHandlerFactory('touchend');

  _jsb.offTouchEnd = function (callback) {
    _removeListener("touchend", callback);
  };

  ral.onTouchEnd = _jsb.onTouchEnd.bind(_jsb);
  ral.offTouchEnd = _jsb.offTouchEnd.bind(_jsb);
}

},{}],5:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

var _listeners = [];
ral.device = ral.device || {};

if (_rt.offAccelerometerChange) {
  ral.onAccelerometerChange = _rt.onAccelerometerChange.bind(_rt);
  ral.offAccelerometerChange = _rt.offAccelerometerChange.bind(_rt);
  ral.stopAccelerometer = _rt.stopAccelerometer.bind(_rt);

  var _startAccelerometer = _rt.startAccelerometer.bind(_rt);

  ral.startAccelerometer = function (obj) {
    return _startAccelerometer(Object.assign({
      type: "accelerationIncludingGravity"
    }, obj));
  };
} else {
  ral.onAccelerometerChange = function (listener) {
    if (typeof listener === "function") {
      var length = _listeners.length;

      for (var index = 0; index < length; ++index) {
        if (listener === _listeners[index]) {
          return;
        }
      }

      _listeners.push(listener);
    }
  };

  ral.offAccelerometerChange = function (listener) {
    var length = _listeners.length;

    for (var index = 0; index < length; ++index) {
      if (listener === _listeners[index]) {
        _listeners.splice(index, 1);

        return;
      }
    }
  };

  var _systemInfo = _rt.getSystemInfoSync();

  var _isAndroid = _systemInfo.platform.toLowerCase() === "android";

  jsb.device.dispatchDeviceMotionEvent = function (event) {
    var acceleration = Object.assign({}, event._accelerationIncludingGravity);

    if (_isAndroid) {
      acceleration.x /= -10;
      acceleration.y /= -10;
      acceleration.z /= -10;
    } else {
      acceleration.x /= 10;
      acceleration.y /= 10;
      acceleration.z /= 10;
    }

    _listeners.forEach(function (listener) {
      listener({
        x: acceleration.x,
        y: acceleration.y,
        z: acceleration.z
      });
    });
  };

  ral.stopAccelerometer = function () {
    jsb.device.setMotionEnabled(false);
  };

  ral.startAccelerometer = function () {
    jsb.device.setMotionEnabled(true);
  };
}

},{"../../util":21}],6:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("getBatteryInfo", _rt, ral);

_util["default"].exportTo("getBatteryInfoSync", _rt, ral);

},{"../../util":21}],7:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("getFileSystemManager", _rt, ral);

},{"../../util":21}],8:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../util"));

var _feature = _interopRequireDefault(require("../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

if (window.jsb) {
  window.ral = Object.assign({}, window.jsb);
} else {
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

require("./media/video");

require("./network/download");

require("./rendering/canvas");

require("./rendering/webgl");

require("./rendering/font");

require("./rendering/frame");

require("./rendering/image");

_util["default"].exportTo("getFeatureProperty", _feature["default"], ral);

},{"../feature":19,"../util":21,"./base/lifecycle":1,"./base/subpackage":2,"./base/system-info":3,"./base/touch-event":4,"./device/accelerometer":5,"./device/battery":6,"./file/file-system-manager":7,"./interface/keyboard":9,"./interface/window":10,"./media/audio":11,"./media/video":12,"./network/download":13,"./rendering/canvas":14,"./rendering/font":15,"./rendering/frame":16,"./rendering/image":17,"./rendering/webgl":18}],9:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("onKeyboardInput", _rt, ral);

_util["default"].exportTo("onKeyboardConfirm", _rt, ral);

_util["default"].exportTo("onKeyboardComplete", _rt, ral);

_util["default"].exportTo("offKeyboardInput", _rt, ral);

_util["default"].exportTo("offKeyboardConfirm", _rt, ral);

_util["default"].exportTo("offKeyboardComplete", _rt, ral);

_util["default"].exportTo("hideKeyboard", _rt, ral);

_util["default"].exportTo("showKeyboard", _rt, ral);

_util["default"].exportTo("updateKeyboard", _rt, ral);

},{"../../util":21}],10:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();

var _onWindowResize = _rt.onWindowResize;

ral.onWindowResize = function (callBack) {
  _onWindowResize(function (size) {
    callBack(size.width || size.windowWidth, size.height || size.windowHeight);
  });
};

},{}],11:[function(require,module,exports){
"use strict";

var _innerContext = _interopRequireDefault(require("../../inner-context"));

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("AudioEngine", _rt, ral);

_util["default"].exportTo("createInnerAudioContext", _rt, ral, function () {
  if (_rt.AudioEngine) {
    ral.createInnerAudioContext = function () {
      return (0, _innerContext["default"])(_rt.AudioEngine);
    };
  }
});

},{"../../inner-context":20,"../../util":21}],12:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("createVideo", _rt, ral);

},{"../../util":21}],13:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("downloadFile", _rt, ral);

},{"../../util":21}],14:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("createCanvas", _rt, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createCanvas = function () {
      return document.createElement("canvas");
    };
  }

  _feature["default"].setFeature("ral.createCanvas", "spec", featureValue);
});

},{"../../feature":19,"../../util":21}],15:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadFont", _rt, ral);

},{"../../util":21}],16:[function(require,module,exports){
"use strict";

var _rt = loadRuntime();

if (window.jsb && jsb.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = jsb.setPreferredFramesPerSecond.bind(jsb);
} else if (_rt.setPreferredFramesPerSecond) {
  ral.setPreferredFramesPerSecond = _rt.setPreferredFramesPerSecond.bind(_rt);
} else {
  ral.setPreferredFramesPerSecond = function () {
    console.error("The setPreferredFramesPerSecond is not define!");
  };
}

},{}],17:[function(require,module,exports){
"use strict";

var _util = _interopRequireDefault(require("../../util"));

var _feature = _interopRequireDefault(require("../../feature"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _rt = loadRuntime();

_util["default"].exportTo("loadImageData", _rt, ral);

_util["default"].exportTo("createImage", _rt, ral, function () {
  var featureValue = "unsupported";

  if (document && typeof document.createElement === "function") {
    featureValue = "wrapper";

    ral.createImage = function () {
      return document.createElement("image");
    };
  }

  _feature["default"].setFeature("ral.createImage", "spec", featureValue);
});

},{"../../feature":19,"../../util":21}],18:[function(require,module,exports){
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
        var error = console.error;

        console.error = function () {};

        _glTexImage2D.apply(void 0, arguments);

        console.error = error;
        gl.texImage2D_image(target, level, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error = console.error;

        console.error = function () {};

        _glTexImage2D.apply(void 0, arguments);

        console.error = _error;
        var context2D = image.getContext('2d');
        gl.texImage2D_canvas(target, level, internalformat, format, type, context2D);
      } else if (image instanceof ImageData) {
        var _error2 = console.error;

        console.error = function () {};

        _glTexImage2D(target, level, internalformat, image.width, image.height, 0, format, type, image.data);

        console.error = _error2;
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
        var error = console.error;

        console.error = function () {};

        _glTexSubImage2D.apply(void 0, arguments);

        console.error = error;
        gl.texSubImage2D_image(target, level, xoffset, yoffset, image._imageMeta);
      } else if (image instanceof HTMLCanvasElement) {
        var _error3 = console.error;

        console.error = function () {};

        _glTexSubImage2D.apply(void 0, arguments);

        console.error = _error3;
        var context2D = image.getContext('2d');
        gl.texSubImage2D_canvas(target, level, xoffset, yoffset, format, type, context2D);
      } else if (image instanceof ImageData) {
        var _error4 = console.error;

        console.error = function () {};

        _glTexSubImage2D(target, level, xoffset, yoffset, image.width, image.height, format, type, image.data);

        console.error = _error4;
      } else {
        console.error("Invalid pixel argument passed to gl.texImage2D!");
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}]},{},[8]);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyYWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSh7MTpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25TaG93XCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25IaWRlXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmU2hvd1wiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZkhpZGVcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImxvYWRTdWJwYWNrYWdlXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwzOltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJlbnZcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRTeXN0ZW1JbmZvXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZ2V0U3lzdGVtSW5mb1N5bmNcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDQ6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfanNiID0gd2luZG93LmpzYjtcblxuaWYgKCFfanNiKSB7XG4gIF9qc2IgPSB7fTtcbn1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbnZhciBfdG91Y2hlcyA9IFtdO1xuXG52YXIgX2dldFRvdWNoSW5kZXggPSBmdW5jdGlvbiBfZ2V0VG91Y2hJbmRleCh0b3VjaCkge1xuICB2YXIgZWxlbWVudDtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgX3RvdWNoZXMubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgZWxlbWVudCA9IF90b3VjaGVzW2luZGV4XTtcblxuICAgIGlmICh0b3VjaC5pZGVudGlmaWVyID09PSBlbGVtZW50LmlkZW50aWZpZXIpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gLTE7XG59O1xuXG52YXIgX2NvcHlPYmplY3QgPSBmdW5jdGlvbiBfY29weU9iamVjdChmcm9tT2JqLCB0b09iamVjdCkge1xuICBmb3IgKHZhciBrZXkgaW4gZnJvbU9iaikge1xuICAgIGlmIChmcm9tT2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHRvT2JqZWN0W2tleV0gPSBmcm9tT2JqW2tleV07XG4gICAgfVxuICB9XG59O1xuXG52YXIgX2xpc3RlbmVyTWFwID0ge1xuICBcInRvdWNoc3RhcnRcIjogW10sXG4gIFwidG91Y2htb3ZlXCI6IFtdLFxuICBcInRvdWNoZW5kXCI6IFtdLFxuICBcInRvdWNoY2FuY2VsXCI6IFtdXG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIoa2V5LCB2YWx1ZSkge1xuICB2YXIgbGlzdGVuZXJBcnIgPSBfbGlzdGVuZXJNYXBba2V5XTtcblxuICBmb3IgKHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IGxpc3RlbmVyQXJyLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICBpZiAodmFsdWUgPT09IGxpc3RlbmVyQXJyW2luZGV4XSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxuXG4gIGxpc3RlbmVyQXJyLnB1c2godmFsdWUpO1xufVxuXG5mdW5jdGlvbiBfcmVtb3ZlTGlzdGVuZXIoa2V5LCB2YWx1ZSkge1xuICB2YXIgbGlzdGVuZXJBcnIgPSBfbGlzdGVuZXJNYXBba2V5XSB8fCBbXTtcbiAgdmFyIGxlbmd0aCA9IGxpc3RlbmVyQXJyLmxlbmd0aDtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyArK2luZGV4KSB7XG4gICAgaWYgKHZhbHVlID09PSBsaXN0ZW5lckFycltpbmRleF0pIHtcbiAgICAgIGxpc3RlbmVyQXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG5cbnZhciBfaGFzRGVsbFdpdGggPSBmYWxzZTtcblxudmFyIF9zeXN0ZW1JbmZvID0gX3J0LmdldFN5c3RlbUluZm9TeW5jKCk7XG5cbmlmICh3aW5kb3cuaW5uZXJXaWR0aCAmJiBfc3lzdGVtSW5mby53aW5kb3dXaWR0aCAhPT0gd2luZG93LmlubmVyV2lkdGgpIHtcbiAgX2hhc0RlbGxXaXRoID0gdHJ1ZTtcbn1cblxudmFyIF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkgPSBmdW5jdGlvbiBfdG91Y2hFdmVudEhhbmRsZXJGYWN0b3J5KHR5cGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChjaGFuZ2VkVG91Y2hlcykge1xuICAgIGlmICh0eXBlb2YgY2hhbmdlZFRvdWNoZXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgX2FkZExpc3RlbmVyKHR5cGUsIGNoYW5nZWRUb3VjaGVzKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB0b3VjaEV2ZW50ID0gbmV3IFRvdWNoRXZlbnQodHlwZSk7XG4gICAgdmFyIGluZGV4O1xuXG4gICAgaWYgKHR5cGUgPT09IFwidG91Y2hzdGFydFwiKSB7XG4gICAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uICh0b3VjaCkge1xuICAgICAgICBpbmRleCA9IF9nZXRUb3VjaEluZGV4KHRvdWNoKTtcblxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIF9jb3B5T2JqZWN0KHRvdWNoLCBfdG91Y2hlc1tpbmRleF0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0bXAgPSB7fTtcblxuICAgICAgICAgIF9jb3B5T2JqZWN0KHRvdWNoLCB0bXApO1xuXG4gICAgICAgICAgX3RvdWNoZXMucHVzaCh0bXApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT09IFwidG91Y2htb3ZlXCIpIHtcbiAgICAgIGNoYW5nZWRUb3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgaW5kZXggPSBfZ2V0VG91Y2hJbmRleChlbGVtZW50KTtcblxuICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgIF9jb3B5T2JqZWN0KGVsZW1lbnQsIF90b3VjaGVzW2luZGV4XSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gXCJ0b3VjaGVuZFwiIHx8IHR5cGUgPT09IFwidG91Y2hjYW5jZWxcIikge1xuICAgICAgY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBpbmRleCA9IF9nZXRUb3VjaEluZGV4KGVsZW1lbnQpO1xuXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgX3RvdWNoZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIHRvdWNoZXMgPSBbXS5jb25jYXQoX3RvdWNoZXMpO1xuICAgIHZhciBfY2hhbmdlZFRvdWNoZXMgPSBbXTtcbiAgICBjaGFuZ2VkVG91Y2hlcy5mb3JFYWNoKGZ1bmN0aW9uICh0b3VjaCkge1xuICAgICAgdmFyIGxlbmd0aCA9IHRvdWNoZXMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBfaW5kZXggPSAwOyBfaW5kZXggPCBsZW5ndGg7ICsrX2luZGV4KSB7XG4gICAgICAgIHZhciBfdG91Y2ggPSB0b3VjaGVzW19pbmRleF07XG5cbiAgICAgICAgaWYgKHRvdWNoLmlkZW50aWZpZXIgPT09IF90b3VjaC5pZGVudGlmaWVyKSB7XG4gICAgICAgICAgX2NoYW5nZWRUb3VjaGVzLnB1c2goX3RvdWNoKTtcblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfY2hhbmdlZFRvdWNoZXMucHVzaCh0b3VjaCk7XG4gICAgfSk7XG4gICAgdG91Y2hFdmVudC50b3VjaGVzID0gdG91Y2hlcztcbiAgICB0b3VjaEV2ZW50LnRhcmdldFRvdWNoZXMgPSB0b3VjaGVzO1xuICAgIHRvdWNoRXZlbnQuY2hhbmdlZFRvdWNoZXMgPSBfY2hhbmdlZFRvdWNoZXM7XG5cbiAgICBpZiAoX2hhc0RlbGxXaXRoKSB7XG4gICAgICB0b3VjaGVzLmZvckVhY2goZnVuY3Rpb24gKHRvdWNoKSB7XG4gICAgICAgIHRvdWNoLmNsaWVudFggLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIHRvdWNoLmNsaWVudFkgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIHRvdWNoLnBhZ2VYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB0b3VjaC5wYWdlWSAvPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodHlwZSA9PT0gXCJ0b3VjaGNhbmNlbFwiIHx8IHR5cGUgPT09IFwidG91Y2hlbmRcIikge1xuICAgICAgICBfY2hhbmdlZFRvdWNoZXMuZm9yRWFjaChmdW5jdGlvbiAodG91Y2gpIHtcbiAgICAgICAgICB0b3VjaC5jbGllbnRYIC89IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgIHRvdWNoLmNsaWVudFkgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgdG91Y2gucGFnZVggLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgdG91Y2gucGFnZVkgLz0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBsaXN0ZW5lckFyciA9IF9saXN0ZW5lck1hcFt0eXBlXTtcbiAgICB2YXIgbGVuZ3RoID0gbGlzdGVuZXJBcnIubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgX2luZGV4MiA9IDA7IF9pbmRleDIgPCBsZW5ndGg7IF9pbmRleDIrKykge1xuICAgICAgbGlzdGVuZXJBcnJbX2luZGV4Ml0odG91Y2hFdmVudCk7XG4gICAgfVxuICB9O1xufTtcblxuaWYgKF9ydC5vblRvdWNoU3RhcnQpIHtcbiAgcmFsLm9uVG91Y2hTdGFydCA9IF9ydC5vblRvdWNoU3RhcnQ7XG4gIHJhbC5vZmZUb3VjaFN0YXJ0ID0gX3J0Lm9mZlRvdWNoU3RhcnQ7XG59IGVsc2Uge1xuICBfanNiLm9uVG91Y2hTdGFydCA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNoc3RhcnQnKTtcblxuICBfanNiLm9mZlRvdWNoU3RhcnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBfcmVtb3ZlTGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByYWwub25Ub3VjaFN0YXJ0ID0gX2pzYi5vblRvdWNoU3RhcnQuYmluZChfanNiKTtcbiAgcmFsLm9mZlRvdWNoU3RhcnQgPSBfanNiLm9mZlRvdWNoU3RhcnQuYmluZChfanNiKTtcbn1cblxuaWYgKF9ydC5vblRvdWNoTW92ZSkge1xuICByYWwub25Ub3VjaE1vdmUgPSBfcnQub25Ub3VjaE1vdmU7XG4gIHJhbC5vZmZUb3VjaE1vdmUgPSBfcnQub2ZmVG91Y2hNb3ZlO1xufSBlbHNlIHtcbiAgX2pzYi5vblRvdWNoTW92ZSA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNobW92ZScpO1xuXG4gIF9qc2Iub2ZmVG91Y2hNb3ZlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgX3JlbW92ZUxpc3RlbmVyKFwidG91Y2htb3ZlXCIsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByYWwub25Ub3VjaE1vdmUgPSBfanNiLm9uVG91Y2hNb3ZlLmJpbmQoX2pzYik7XG4gIHJhbC5vZmZUb3VjaE1vdmUgPSBfanNiLm9mZlRvdWNoTW92ZS5iaW5kKF9qc2IpO1xufVxuXG5pZiAoX3J0Lm9uVG91Y2hDYW5jZWwpIHtcbiAgcmFsLm9uVG91Y2hDYW5jZWwgPSBfcnQub25Ub3VjaENhbmNlbDtcbiAgcmFsLm9mZlRvdWNoQ2FuY2VsID0gX3J0Lm9mZlRvdWNoQ2FuY2VsO1xufSBlbHNlIHtcbiAgX2pzYi5vblRvdWNoQ2FuY2VsID0gX3RvdWNoRXZlbnRIYW5kbGVyRmFjdG9yeSgndG91Y2hjYW5jZWwnKTtcblxuICBfanNiLm9mZlRvdWNoQ2FuY2VsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgX3JlbW92ZUxpc3RlbmVyKFwidG91Y2hjYW5jZWxcIiwgY2FsbGJhY2spO1xuICB9O1xuXG4gIHJhbC5vblRvdWNoQ2FuY2VsID0gX2pzYi5vblRvdWNoQ2FuY2VsLmJpbmQoX2pzYik7XG4gIHJhbC5vZmZUb3VjaENhbmNlbCA9IF9qc2Iub2ZmVG91Y2hDYW5jZWwuYmluZChfanNiKTtcbn1cblxuaWYgKF9ydC5vblRvdWNoRW5kKSB7XG4gIHJhbC5vblRvdWNoRW5kID0gX3J0Lm9uVG91Y2hFbmQ7XG4gIHJhbC5vZmZUb3VjaEVuZCA9IF9ydC5vZmZUb3VjaEVuZDtcbn0gZWxzZSB7XG4gIF9qc2Iub25Ub3VjaEVuZCA9IF90b3VjaEV2ZW50SGFuZGxlckZhY3RvcnkoJ3RvdWNoZW5kJyk7XG5cbiAgX2pzYi5vZmZUb3VjaEVuZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIF9yZW1vdmVMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbGxiYWNrKTtcbiAgfTtcblxuICByYWwub25Ub3VjaEVuZCA9IF9qc2Iub25Ub3VjaEVuZC5iaW5kKF9qc2IpO1xuICByYWwub2ZmVG91Y2hFbmQgPSBfanNiLm9mZlRvdWNoRW5kLmJpbmQoX2pzYik7XG59XG5cbn0se31dLDU6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbnZhciBfbGlzdGVuZXJzID0gW107XG5yYWwuZGV2aWNlID0gcmFsLmRldmljZSB8fCB7fTtcblxuaWYgKF9ydC5vZmZBY2NlbGVyb21ldGVyQ2hhbmdlKSB7XG4gIHJhbC5vbkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBfcnQub25BY2NlbGVyb21ldGVyQ2hhbmdlLmJpbmQoX3J0KTtcbiAgcmFsLm9mZkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBfcnQub2ZmQWNjZWxlcm9tZXRlckNoYW5nZS5iaW5kKF9ydCk7XG4gIHJhbC5zdG9wQWNjZWxlcm9tZXRlciA9IF9ydC5zdG9wQWNjZWxlcm9tZXRlci5iaW5kKF9ydCk7XG5cbiAgdmFyIF9zdGFydEFjY2VsZXJvbWV0ZXIgPSBfcnQuc3RhcnRBY2NlbGVyb21ldGVyLmJpbmQoX3J0KTtcblxuICByYWwuc3RhcnRBY2NlbGVyb21ldGVyID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBfc3RhcnRBY2NlbGVyb21ldGVyKE9iamVjdC5hc3NpZ24oe1xuICAgICAgdHlwZTogXCJhY2NlbGVyYXRpb25JbmNsdWRpbmdHcmF2aXR5XCJcbiAgICB9LCBvYmopKTtcbiAgfTtcbn0gZWxzZSB7XG4gIHJhbC5vbkFjY2VsZXJvbWV0ZXJDaGFuZ2UgPSBmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBsZW5ndGggPSBfbGlzdGVuZXJzLmxlbmd0aDtcblxuICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgICAgICBpZiAobGlzdGVuZXIgPT09IF9saXN0ZW5lcnNbaW5kZXhdKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9saXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9O1xuXG4gIHJhbC5vZmZBY2NlbGVyb21ldGVyQ2hhbmdlID0gZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgdmFyIGxlbmd0aCA9IF9saXN0ZW5lcnMubGVuZ3RoO1xuXG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGxlbmd0aDsgKytpbmRleCkge1xuICAgICAgaWYgKGxpc3RlbmVyID09PSBfbGlzdGVuZXJzW2luZGV4XSkge1xuICAgICAgICBfbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICB2YXIgX3N5c3RlbUluZm8gPSBfcnQuZ2V0U3lzdGVtSW5mb1N5bmMoKTtcblxuICB2YXIgX2lzQW5kcm9pZCA9IF9zeXN0ZW1JbmZvLnBsYXRmb3JtLnRvTG93ZXJDYXNlKCkgPT09IFwiYW5kcm9pZFwiO1xuXG4gIGpzYi5kZXZpY2UuZGlzcGF0Y2hEZXZpY2VNb3Rpb25FdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhY2NlbGVyYXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCBldmVudC5fYWNjZWxlcmF0aW9uSW5jbHVkaW5nR3Jhdml0eSk7XG5cbiAgICBpZiAoX2lzQW5kcm9pZCkge1xuICAgICAgYWNjZWxlcmF0aW9uLnggLz0gLTEwO1xuICAgICAgYWNjZWxlcmF0aW9uLnkgLz0gLTEwO1xuICAgICAgYWNjZWxlcmF0aW9uLnogLz0gLTEwO1xuICAgIH0gZWxzZSB7XG4gICAgICBhY2NlbGVyYXRpb24ueCAvPSAxMDtcbiAgICAgIGFjY2VsZXJhdGlvbi55IC89IDEwO1xuICAgICAgYWNjZWxlcmF0aW9uLnogLz0gMTA7XG4gICAgfVxuXG4gICAgX2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgbGlzdGVuZXIoe1xuICAgICAgICB4OiBhY2NlbGVyYXRpb24ueCxcbiAgICAgICAgeTogYWNjZWxlcmF0aW9uLnksXG4gICAgICAgIHo6IGFjY2VsZXJhdGlvbi56XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICByYWwuc3RvcEFjY2VsZXJvbWV0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAganNiLmRldmljZS5zZXRNb3Rpb25FbmFibGVkKGZhbHNlKTtcbiAgfTtcblxuICByYWwuc3RhcnRBY2NlbGVyb21ldGVyID0gZnVuY3Rpb24gKCkge1xuICAgIGpzYi5kZXZpY2Uuc2V0TW90aW9uRW5hYmxlZCh0cnVlKTtcbiAgfTtcbn1cblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSw2OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJnZXRCYXR0ZXJ5SW5mb1wiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImdldEJhdHRlcnlJbmZvU3luY1wiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZ2V0RmlsZVN5c3RlbU1hbmFnZXJcIiwgX3J0LCByYWwpO1xuXG59LHtcIi4uLy4uL3V0aWxcIjoyMX1dLDg6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3V0aWxcIikpO1xuXG52YXIgX2ZlYXR1cmUgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi9mZWF0dXJlXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbmlmICh3aW5kb3cuanNiKSB7XG4gIHdpbmRvdy5yYWwgPSBPYmplY3QuYXNzaWduKHt9LCB3aW5kb3cuanNiKTtcbn0gZWxzZSB7XG4gIHdpbmRvdy5yYWwgPSB7fTtcbn1cblxucmVxdWlyZShcIi4vYmFzZS9saWZlY3ljbGVcIik7XG5cbnJlcXVpcmUoXCIuL2Jhc2Uvc3VicGFja2FnZVwiKTtcblxucmVxdWlyZShcIi4vYmFzZS9zeXN0ZW0taW5mb1wiKTtcblxucmVxdWlyZShcIi4vYmFzZS90b3VjaC1ldmVudFwiKTtcblxucmVxdWlyZShcIi4vZGV2aWNlL2FjY2VsZXJvbWV0ZXJcIik7XG5cbnJlcXVpcmUoXCIuL2RldmljZS9iYXR0ZXJ5XCIpO1xuXG5yZXF1aXJlKFwiLi9maWxlL2ZpbGUtc3lzdGVtLW1hbmFnZXJcIik7XG5cbnJlcXVpcmUoXCIuL2ludGVyZmFjZS9rZXlib2FyZFwiKTtcblxucmVxdWlyZShcIi4vaW50ZXJmYWNlL3dpbmRvd1wiKTtcblxucmVxdWlyZShcIi4vbWVkaWEvYXVkaW9cIik7XG5cbnJlcXVpcmUoXCIuL21lZGlhL3ZpZGVvXCIpO1xuXG5yZXF1aXJlKFwiLi9uZXR3b3JrL2Rvd25sb2FkXCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvY2FudmFzXCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvd2ViZ2xcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9mb250XCIpO1xuXG5yZXF1aXJlKFwiLi9yZW5kZXJpbmcvZnJhbWVcIik7XG5cbnJlcXVpcmUoXCIuL3JlbmRlcmluZy9pbWFnZVwiKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZ2V0RmVhdHVyZVByb3BlcnR5XCIsIF9mZWF0dXJlW1wiZGVmYXVsdFwiXSwgcmFsKTtcblxufSx7XCIuLi9mZWF0dXJlXCI6MTksXCIuLi91dGlsXCI6MjEsXCIuL2Jhc2UvbGlmZWN5Y2xlXCI6MSxcIi4vYmFzZS9zdWJwYWNrYWdlXCI6MixcIi4vYmFzZS9zeXN0ZW0taW5mb1wiOjMsXCIuL2Jhc2UvdG91Y2gtZXZlbnRcIjo0LFwiLi9kZXZpY2UvYWNjZWxlcm9tZXRlclwiOjUsXCIuL2RldmljZS9iYXR0ZXJ5XCI6NixcIi4vZmlsZS9maWxlLXN5c3RlbS1tYW5hZ2VyXCI6NyxcIi4vaW50ZXJmYWNlL2tleWJvYXJkXCI6OSxcIi4vaW50ZXJmYWNlL3dpbmRvd1wiOjEwLFwiLi9tZWRpYS9hdWRpb1wiOjExLFwiLi9tZWRpYS92aWRlb1wiOjEyLFwiLi9uZXR3b3JrL2Rvd25sb2FkXCI6MTMsXCIuL3JlbmRlcmluZy9jYW52YXNcIjoxNCxcIi4vcmVuZGVyaW5nL2ZvbnRcIjoxNSxcIi4vcmVuZGVyaW5nL2ZyYW1lXCI6MTYsXCIuL3JlbmRlcmluZy9pbWFnZVwiOjE3LFwiLi9yZW5kZXJpbmcvd2ViZ2xcIjoxOH1dLDk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uS2V5Ym9hcmRJbnB1dFwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9uS2V5Ym9hcmRDb25maXJtXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib25LZXlib2FyZENvbXBsZXRlXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwib2ZmS2V5Ym9hcmRJbnB1dFwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZktleWJvYXJkQ29uZmlybVwiLCBfcnQsIHJhbCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIm9mZktleWJvYXJkQ29tcGxldGVcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJoaWRlS2V5Ym9hcmRcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJzaG93S2V5Ym9hcmRcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJ1cGRhdGVLZXlib2FyZFwiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sMTA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG52YXIgX29uV2luZG93UmVzaXplID0gX3J0Lm9uV2luZG93UmVzaXplO1xuXG5yYWwub25XaW5kb3dSZXNpemUgPSBmdW5jdGlvbiAoY2FsbEJhY2spIHtcbiAgX29uV2luZG93UmVzaXplKGZ1bmN0aW9uIChzaXplKSB7XG4gICAgY2FsbEJhY2soc2l6ZS53aWR0aCB8fCBzaXplLndpbmRvd1dpZHRoLCBzaXplLmhlaWdodCB8fCBzaXplLndpbmRvd0hlaWdodCk7XG4gIH0pO1xufTtcblxufSx7fV0sMTE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfaW5uZXJDb250ZXh0ID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vaW5uZXItY29udGV4dFwiKSk7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcIkF1ZGlvRW5naW5lXCIsIF9ydCwgcmFsKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiY3JlYXRlSW5uZXJBdWRpb0NvbnRleHRcIiwgX3J0LCByYWwsIGZ1bmN0aW9uICgpIHtcbiAgaWYgKF9ydC5BdWRpb0VuZ2luZSkge1xuICAgIHJhbC5jcmVhdGVJbm5lckF1ZGlvQ29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiAoMCwgX2lubmVyQ29udGV4dFtcImRlZmF1bHRcIl0pKF9ydC5BdWRpb0VuZ2luZSk7XG4gICAgfTtcbiAgfVxufSk7XG5cbn0se1wiLi4vLi4vaW5uZXItY29udGV4dFwiOjIwLFwiLi4vLi4vdXRpbFwiOjIxfV0sMTI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfdXRpbCA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL3V0aWxcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZVZpZGVvXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxMzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG52YXIgX3J0ID0gbG9hZFJ1bnRpbWUoKTtcblxuX3V0aWxbXCJkZWZhdWx0XCJdLmV4cG9ydFRvKFwiZG93bmxvYWRGaWxlXCIsIF9ydCwgcmFsKTtcblxufSx7XCIuLi8uLi91dGlsXCI6MjF9XSwxNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2ZlYXR1cmVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImNyZWF0ZUNhbnZhc1wiLCBfcnQsIHJhbCwgZnVuY3Rpb24gKCkge1xuICB2YXIgZmVhdHVyZVZhbHVlID0gXCJ1bnN1cHBvcnRlZFwiO1xuXG4gIGlmIChkb2N1bWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZmVhdHVyZVZhbHVlID0gXCJ3cmFwcGVyXCI7XG5cbiAgICByYWwuY3JlYXRlQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgfTtcbiAgfVxuXG4gIF9mZWF0dXJlW1wiZGVmYXVsdFwiXS5zZXRGZWF0dXJlKFwicmFsLmNyZWF0ZUNhbnZhc1wiLCBcInNwZWNcIiwgZmVhdHVyZVZhbHVlKTtcbn0pO1xuXG59LHtcIi4uLy4uL2ZlYXR1cmVcIjoxOSxcIi4uLy4uL3V0aWxcIjoyMX1dLDE1OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgX3V0aWwgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuLi8uLi91dGlsXCIpKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJsb2FkRm9udFwiLCBfcnQsIHJhbCk7XG5cbn0se1wiLi4vLi4vdXRpbFwiOjIxfV0sMTY6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBfcnQgPSBsb2FkUnVudGltZSgpO1xuXG5pZiAod2luZG93LmpzYiAmJiBqc2Iuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kKSB7XG4gIHJhbC5zZXRQcmVmZXJyZWRGcmFtZXNQZXJTZWNvbmQgPSBqc2Iuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kLmJpbmQoanNiKTtcbn0gZWxzZSBpZiAoX3J0LnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCkge1xuICByYWwuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kID0gX3J0LnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZC5iaW5kKF9ydCk7XG59IGVsc2Uge1xuICByYWwuc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJUaGUgc2V0UHJlZmVycmVkRnJhbWVzUGVyU2Vjb25kIGlzIG5vdCBkZWZpbmUhXCIpO1xuICB9O1xufVxuXG59LHt9XSwxNzpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIF91dGlsID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi4vLi4vdXRpbFwiKSk7XG5cbnZhciBfZmVhdHVyZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uLy4uL2ZlYXR1cmVcIikpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxudmFyIF9ydCA9IGxvYWRSdW50aW1lKCk7XG5cbl91dGlsW1wiZGVmYXVsdFwiXS5leHBvcnRUbyhcImxvYWRJbWFnZURhdGFcIiwgX3J0LCByYWwpO1xuXG5fdXRpbFtcImRlZmF1bHRcIl0uZXhwb3J0VG8oXCJjcmVhdGVJbWFnZVwiLCBfcnQsIHJhbCwgZnVuY3Rpb24gKCkge1xuICB2YXIgZmVhdHVyZVZhbHVlID0gXCJ1bnN1cHBvcnRlZFwiO1xuXG4gIGlmIChkb2N1bWVudCAmJiB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZmVhdHVyZVZhbHVlID0gXCJ3cmFwcGVyXCI7XG5cbiAgICByYWwuY3JlYXRlSW1hZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImltYWdlXCIpO1xuICAgIH07XG4gIH1cblxuICBfZmVhdHVyZVtcImRlZmF1bHRcIl0uc2V0RmVhdHVyZShcInJhbC5jcmVhdGVJbWFnZVwiLCBcInNwZWNcIiwgZmVhdHVyZVZhbHVlKTtcbn0pO1xuXG59LHtcIi4uLy4uL2ZlYXR1cmVcIjoxOSxcIi4uLy4uL3V0aWxcIjoyMX1dLDE4OltmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXtcblwidXNlIHN0cmljdFwiO1xuXG5pZiAod2luZG93Ll9fZ2wpIHtcbiAgdmFyIGdsID0gd2luZG93Ll9fZ2w7XG4gIHZhciBfZ2xUZXhJbWFnZTJEID0gZ2wudGV4SW1hZ2UyRDtcblxuICBnbC50ZXhJbWFnZTJEID0gZnVuY3Rpb24gKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIGZvcm1hdCwgdHlwZSwgcGl4ZWxzKSB7XG4gICAgdmFyIGFyZ2MgPSBhcmd1bWVudHMubGVuZ3RoO1xuXG4gICAgaWYgKGFyZ2MgPT09IDYpIHtcbiAgICAgIHZhciBpbWFnZSA9IGJvcmRlcjtcbiAgICAgIHR5cGUgPSBoZWlnaHQ7XG4gICAgICBmb3JtYXQgPSB3aWR0aDtcblxuICAgICAgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xuICAgICAgICB2YXIgZXJyb3IgPSBjb25zb2xlLmVycm9yO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBmdW5jdGlvbiAoKSB7fTtcblxuICAgICAgICBfZ2xUZXhJbWFnZTJELmFwcGx5KHZvaWQgMCwgYXJndW1lbnRzKTtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZXJyb3I7XG4gICAgICAgIGdsLnRleEltYWdlMkRfaW1hZ2UodGFyZ2V0LCBsZXZlbCwgaW1hZ2UuX2ltYWdlTWV0YSk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdmFyIF9lcnJvciA9IGNvbnNvbGUuZXJyb3I7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIF9nbFRleEltYWdlMkQuYXBwbHkodm9pZCAwLCBhcmd1bWVudHMpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBfZXJyb3I7XG4gICAgICAgIHZhciBjb250ZXh0MkQgPSBpbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBnbC50ZXhJbWFnZTJEX2NhbnZhcyh0YXJnZXQsIGxldmVsLCBpbnRlcm5hbGZvcm1hdCwgZm9ybWF0LCB0eXBlLCBjb250ZXh0MkQpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEltYWdlRGF0YSkge1xuICAgICAgICB2YXIgX2Vycm9yMiA9IGNvbnNvbGUuZXJyb3I7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGZ1bmN0aW9uICgpIHt9O1xuXG4gICAgICAgIF9nbFRleEltYWdlMkQodGFyZ2V0LCBsZXZlbCwgaW50ZXJuYWxmb3JtYXQsIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQsIDAsIGZvcm1hdCwgdHlwZSwgaW1hZ2UuZGF0YSk7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IF9lcnJvcjI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBwaXhlbCBhcmd1bWVudCBwYXNzZWQgdG8gZ2wudGV4SW1hZ2UyRCFcIik7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhcmdjID09PSA5KSB7XG4gICAgICBfZ2xUZXhJbWFnZTJEKHRhcmdldCwgbGV2ZWwsIGludGVybmFsZm9ybWF0LCB3aWR0aCwgaGVpZ2h0LCBib3JkZXIsIGZvcm1hdCwgdHlwZSwgcGl4ZWxzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcImdsLnRleEltYWdlMkQ6IGludmFsaWQgYXJndW1lbnQgY291bnQhXCIpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgX2dsVGV4U3ViSW1hZ2UyRCA9IGdsLnRleFN1YkltYWdlMkQ7XG5cbiAgZ2wudGV4U3ViSW1hZ2UyRCA9IGZ1bmN0aW9uICh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIHBpeGVscykge1xuICAgIHZhciBhcmdjID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICAgIGlmIChhcmdjID09PSA3KSB7XG4gICAgICB2YXIgaW1hZ2UgPSBmb3JtYXQ7XG4gICAgICB0eXBlID0gaGVpZ2h0O1xuICAgICAgZm9ybWF0ID0gd2lkdGg7XG5cbiAgICAgIGlmIChpbWFnZSBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGVycm9yID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRC5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IGVycm9yO1xuICAgICAgICBnbC50ZXhTdWJJbWFnZTJEX2ltYWdlKHRhcmdldCwgbGV2ZWwsIHhvZmZzZXQsIHlvZmZzZXQsIGltYWdlLl9pbWFnZU1ldGEpO1xuICAgICAgfSBlbHNlIGlmIChpbWFnZSBpbnN0YW5jZW9mIEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICAgIHZhciBfZXJyb3IzID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRC5hcHBseSh2b2lkIDAsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgY29uc29sZS5lcnJvciA9IF9lcnJvcjM7XG4gICAgICAgIHZhciBjb250ZXh0MkQgPSBpbWFnZS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBnbC50ZXhTdWJJbWFnZTJEX2NhbnZhcyh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBmb3JtYXQsIHR5cGUsIGNvbnRleHQyRCk7XG4gICAgICB9IGVsc2UgaWYgKGltYWdlIGluc3RhbmNlb2YgSW1hZ2VEYXRhKSB7XG4gICAgICAgIHZhciBfZXJyb3I0ID0gY29uc29sZS5lcnJvcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yID0gZnVuY3Rpb24gKCkge307XG5cbiAgICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIGltYWdlLmRhdGEpO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IgPSBfZXJyb3I0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkludmFsaWQgcGl4ZWwgYXJndW1lbnQgcGFzc2VkIHRvIGdsLnRleEltYWdlMkQhXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXJnYyA9PT0gOSkge1xuICAgICAgX2dsVGV4U3ViSW1hZ2UyRCh0YXJnZXQsIGxldmVsLCB4b2Zmc2V0LCB5b2Zmc2V0LCB3aWR0aCwgaGVpZ2h0LCBmb3JtYXQsIHR5cGUsIHBpeGVscyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IobmV3IEVycm9yKFwiZ2wudGV4SW1hZ2UyRDogaW52YWxpZCBhcmd1bWVudCBjb3VudCFcIikuc3RhY2spO1xuICAgIH1cbiAgfTtcbn1cblxufSx7fV0sMTk6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcbnZhciBfZmVhdHVyZXMgPSB7fTtcbnZhciBfZGVmYXVsdCA9IHtcbiAgc2V0RmVhdHVyZTogZnVuY3Rpb24gc2V0RmVhdHVyZShmZWF0dXJlTmFtZSwgcHJvcGVydHksIHZhbHVlKSB7XG4gICAgdmFyIGZlYXR1cmUgPSBfZmVhdHVyZXNbZmVhdHVyZU5hbWVdO1xuXG4gICAgaWYgKCFmZWF0dXJlKSB7XG4gICAgICBmZWF0dXJlID0gX2ZlYXR1cmVzW2ZlYXR1cmVOYW1lXSA9IHt9O1xuICAgIH1cblxuICAgIGZlYXR1cmVbcHJvcGVydHldID0gdmFsdWU7XG4gIH0sXG4gIGdldEZlYXR1cmVQcm9wZXJ0eTogZnVuY3Rpb24gZ2V0RmVhdHVyZVByb3BlcnR5KGZlYXR1cmVOYW1lLCBwcm9wZXJ0eSkge1xuICAgIHZhciBmZWF0dXJlID0gX2ZlYXR1cmVzW2ZlYXR1cmVOYW1lXTtcbiAgICByZXR1cm4gZmVhdHVyZSA/IGZlYXR1cmVbcHJvcGVydHldIDogdW5kZWZpbmVkO1xuICB9XG59O1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBfZGVmYXVsdDtcblxufSx7fV0sMjA6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xudmFyIF9DQU5QTEFZX0NBTExCQUNLID0gXCJjYW5wbGF5Q2FsbGJhY2tzXCI7XG52YXIgX0VOREVEX0NBTExCQUNLID0gXCJlbmRlZENhbGxiYWNrc1wiO1xudmFyIF9FUlJPUl9DQUxMQkFDSyA9IFwiZXJyb3JDYWxsYmFja3NcIjtcbnZhciBfUEFVU0VfQ0FMTEJBQ0sgPSBcInBhdXNlQ2FsbGJhY2tzXCI7XG52YXIgX1BMQVlfQ0FMTEJBQ0sgPSBcInBsYXlDYWxsYmFja3NcIjtcbnZhciBfU0VFS0VEX0NBTExCQUNLID0gXCJzZWVrZWRDYWxsYmFja3NcIjtcbnZhciBfU0VFS0lOR19DQUxMQkFDSyA9IFwic2Vla2luZ0NhbGxiYWNrc1wiO1xudmFyIF9TVE9QX0NBTExCQUNLID0gXCJzdG9wQ2FsbGJhY2tzXCI7XG52YXIgX1RJTUVfVVBEQVRFX0NBTExCQUNLID0gXCJ0aW1lVXBkYXRlQ2FsbGJhY2tzXCI7XG52YXIgX1dBSVRJTkdfQ0FMTEJBQ0sgPSBcIndhaXRpbmdDYWxsYmFja3NcIjtcbnZhciBfRVJST1JfQ09ERSA9IHtcbiAgRVJST1JfU1lTVEVNOiAxMDAwMSxcbiAgRVJST1JfTkVUOiAxMDAwMixcbiAgRVJST1JfRklMRTogMTAwMDMsXG4gIEVSUk9SX0ZPUk1BVDogMTAwMDQsXG4gIEVSUk9SX1VOS05PV046IC0xXG59O1xudmFyIF9TVEFURSA9IHtcbiAgRVJST1I6IC0xLFxuICBJTklUSUFMSVpJTkc6IDAsXG4gIFBMQVlJTkc6IDEsXG4gIFBBVVNFRDogMlxufTtcbnZhciBfYXVkaW9FbmdpbmUgPSB1bmRlZmluZWQ7XG5cbnZhciBfd2Vha01hcCA9IG5ldyBXZWFrTWFwKCk7XG5cbnZhciBfb2ZmQ2FsbGJhY2sgPSBmdW5jdGlvbiBfb2ZmQ2FsbGJhY2sodGFyZ2V0LCB0eXBlLCBjYWxsYmFjaykge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGFyZ2V0KTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgfHwgIXByaXZhdGVUaGlzKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdIHx8IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoY2FsbGJhY2sgPT09IGNhbGxiYWNrc1tpXSkge1xuICAgICAgY2FsbGJhY2tzLnNwbGljZShpLCAxKTtcbiAgICAgIHJldHVybiBjYWxsYmFjay5sZW5ndGggKyAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufTtcblxudmFyIF9vbkNhbGxiYWNrID0gZnVuY3Rpb24gX29uQ2FsbGJhY2sodGFyZ2V0LCB0eXBlLCBjYWxsYmFjaykge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGFyZ2V0KTtcblxuICBpZiAodHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgfHwgIXByaXZhdGVUaGlzKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgdmFyIGNhbGxiYWNrcyA9IHByaXZhdGVUaGlzW3R5cGVdO1xuXG4gIGlmICghY2FsbGJhY2tzKSB7XG4gICAgY2FsbGJhY2tzID0gcHJpdmF0ZVRoaXNbdHlwZV0gPSBbY2FsbGJhY2tdO1xuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjYWxsYmFja3MubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgIGlmIChjYWxsYmFjayA9PT0gY2FsbGJhY2tzW2ldKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhbGxiYWNrcy5wdXNoKGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsYmFja3MubGVuZ3RoO1xufTtcblxudmFyIF9kaXNwYXRjaENhbGxiYWNrID0gZnVuY3Rpb24gX2Rpc3BhdGNoQ2FsbGJhY2sodGFyZ2V0LCB0eXBlKSB7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMl0gOiBbXTtcblxuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGFyZ2V0KTtcblxuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgY2FsbGJhY2tzID0gcHJpdmF0ZVRoaXNbdHlwZV0gfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY2FsbGJhY2tzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICBjYWxsYmFja3NbaV0uYXBwbHkodGFyZ2V0LCBhcmdzKTtcbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIElubmVyQXVkaW9Db250ZXh0KCkge1xuICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gIHRoaXMuYXV0b3BsYXkgPSBmYWxzZTtcblxuICBfd2Vha01hcC5zZXQodGhpcywge1xuICAgIHNyYzogXCJcIixcbiAgICB2b2x1bWU6IDEsXG4gICAgbG9vcDogZmFsc2VcbiAgfSk7XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwibG9vcFwiLCB7XG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIHZhbHVlID0gISF2YWx1ZTtcblxuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICBfYXVkaW9FbmdpbmUuc2V0TG9vcChhdWRpb0lELCB2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlVGhpcy5sb29wID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgcmV0dXJuIHByaXZhdGVUaGlzID8gcHJpdmF0ZVRoaXMubG9vcCA6IGZhbHNlO1xuICAgIH1cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInZvbHVtZVwiLCB7XG4gICAgc2V0OiBmdW5jdGlvbiBzZXQodmFsdWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgaWYgKHZhbHVlIDwgMCkge1xuICAgICAgICAgIHZhbHVlID0gMDtcbiAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IDEpIHtcbiAgICAgICAgICB2YWx1ZSA9IDE7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gMTtcbiAgICAgIH1cblxuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICAgICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgICAgICBfYXVkaW9FbmdpbmUuc2V0Vm9sdW1lKGF1ZGlvSUQsIHZhbHVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGVUaGlzLnZvbHVtZSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIHJldHVybiBwcml2YXRlVGhpcyA/IHByaXZhdGVUaGlzLnZvbHVtZSA6IDE7XG4gICAgfVxuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwic3JjXCIsIHtcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCh2YWx1ZSkge1xuICAgICAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gICAgICBpZiAoIXByaXZhdGVUaGlzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIG9sZFNyYyA9IHByaXZhdGVUaGlzLnNyYztcbiAgICAgIHByaXZhdGVUaGlzLnNyYyA9IHZhbHVlO1xuXG4gICAgICBpZiAodHlwZW9mIHZhbHVlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwICYmIF9hdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKSA9PT0gX1NUQVRFLlBBVVNFRCAmJiBvbGRTcmMgIT09IHZhbHVlKSB7XG4gICAgICAgICAgX2F1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG5cbiAgICAgICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgICAgX2F1ZGlvRW5naW5lLnByZWxvYWQodmFsdWUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLnNyYyA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX0NBTlBMQVlfQ0FMTEJBQ0spO1xuXG4gICAgICAgICAgICAgIGlmIChzZWxmLmF1dG9wbGF5KSB7XG4gICAgICAgICAgICAgICAgc2VsZi5wbGF5KCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgcmV0dXJuIHByaXZhdGVUaGlzID8gcHJpdmF0ZVRoaXMuc3JjIDogXCJcIjtcbiAgICB9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJkdXJhdGlvblwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0RHVyYXRpb24oYXVkaW9JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KCkge31cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImN1cnJlbnRUaW1lXCIsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIF9hdWRpb0VuZ2luZS5nZXRDdXJyZW50VGltZShhdWRpb0lEKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gMDtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0KCkge31cbiAgfSk7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcInBhdXNlZFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QQVVTRUQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJidWZmZXJlZFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgICAgIGlmIChwcml2YXRlVGhpcykge1xuICAgICAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmUuZ2V0QnVmZmVyZWQoYXVkaW9JRCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIDA7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCgpIHt9XG4gIH0pO1xufVxuXG52YXIgX3Byb3RvdHlwZSA9IElubmVyQXVkaW9Db250ZXh0LnByb3RvdHlwZTtcblxuX3Byb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgcHJpdmF0ZVRoaXMgPSBfd2Vha01hcC5nZXQodGhpcyk7XG5cbiAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgdmFyIGF1ZGlvSUQgPSBwcml2YXRlVGhpcy5hdWRpb0lEO1xuXG4gICAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgICAgX2F1ZGlvRW5naW5lLnN0b3AoYXVkaW9JRCk7XG5cbiAgICAgIHByaXZhdGVUaGlzLmF1ZGlvSUQgPSAtMTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1NUT1BfQ0FMTEJBQ0spO1xuICAgIH1cblxuICAgIHByaXZhdGVUaGlzW19DQU5QTEFZX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19FTkRFRF9DQUxMQkFDS10gPSBbXTtcbiAgICBwcml2YXRlVGhpc1tfRVJST1JfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1BBVVNFX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19QTEFZX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19TRUVLRURfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1NFRUtJTkdfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1NUT1BfQ0FMTEJBQ0tdID0gW107XG4gICAgcHJpdmF0ZVRoaXNbX1RJTUVfVVBEQVRFX0NBTExCQUNLXSA9IFtdO1xuICAgIHByaXZhdGVUaGlzW19XQUlUSU5HX0NBTExCQUNLXSA9IFtdO1xuICAgIGNsZWFySW50ZXJ2YWwocHJpdmF0ZVRoaXMuaW50ZXJ2YWxJRCk7XG4gIH1cbn07XG5cbl9wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gIGlmICghcHJpdmF0ZVRoaXMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgc3JjID0gcHJpdmF0ZVRoaXMuc3JjO1xuICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgaWYgKHR5cGVvZiBzcmMgIT09IFwic3RyaW5nXCIgfHwgc3JjID09PSBcIlwiKSB7XG4gICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX0VSUk9SX0NBTExCQUNLLCBbe1xuICAgICAgZXJyTXNnOiBcImludmFsaWQgc3JjXCIsXG4gICAgICBlcnJDb2RlOiBfRVJST1JfQ09ERS5FUlJPUl9GSUxFXG4gICAgfV0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBhdWRpb0lEID09PSBcIm51bWJlclwiICYmIGF1ZGlvSUQgPj0gMCkge1xuICAgIGlmIChfYXVkaW9FbmdpbmUuZ2V0U3RhdGUoYXVkaW9JRCkgPT09IF9TVEFURS5QQVVTRUQpIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5yZXN1bWUoYXVkaW9JRCk7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9QTEFZX0NBTExCQUNLKTtcblxuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcblxuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuICAgIH1cbiAgfVxuXG4gIGF1ZGlvSUQgPSBfYXVkaW9FbmdpbmUucGxheShzcmMsIHRoaXMubG9vcCwgdGhpcy52b2x1bWUpO1xuXG4gIGlmIChhdWRpb0lEID09PSAtMSkge1xuICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9FUlJPUl9DQUxMQkFDSywgW3tcbiAgICAgIGVyck1zZzogXCJ1bmtub3duXCIsXG4gICAgICBlcnJDb2RlOiBfRVJST1JfQ09ERS5FUlJPUl9VTktOT1dOXG4gICAgfV0pO1xuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IGF1ZGlvSUQ7XG5cbiAgaWYgKHR5cGVvZiB0aGlzLnN0YXJ0VGltZSA9PT0gXCJudW1iZXJcIiAmJiB0aGlzLnN0YXJ0VGltZSA+IDApIHtcbiAgICBfYXVkaW9FbmdpbmUuc2V0Q3VycmVudFRpbWUoYXVkaW9JRCwgdGhpcy5zdGFydFRpbWUpO1xuICB9XG5cbiAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1dBSVRJTkdfQ0FMTEJBQ0spO1xuXG4gIHZhciBzZWxmID0gdGhpcztcblxuICBfYXVkaW9FbmdpbmUuc2V0Q2FuUGxheUNhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX0NBTlBMQVlfQ0FMTEJBQ0spO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfUExBWV9DQUxMQkFDSyk7XG4gICAgfVxuICB9KTtcblxuICBfYXVkaW9FbmdpbmUuc2V0V2FpdGluZ0NhbGxiYWNrKGF1ZGlvSUQsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoc3JjID09PSBzZWxmLnNyYykge1xuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2soc2VsZiwgX1dBSVRJTkdfQ0FMTEJBQ0spO1xuICAgIH1cbiAgfSk7XG5cbiAgX2F1ZGlvRW5naW5lLnNldEVycm9yQ2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzcmMgPT09IHNlbGYuc3JjKSB7XG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9FUlJPUl9DQUxMQkFDSyk7XG4gICAgfVxuICB9KTtcblxuICBfYXVkaW9FbmdpbmUuc2V0RmluaXNoQ2FsbGJhY2soYXVkaW9JRCwgZnVuY3Rpb24gKCkge1xuICAgIGlmIChzcmMgPT09IHNlbGYuc3JjKSB7XG4gICAgICBwcml2YXRlVGhpcy5hdWRpb0lEID0gLTE7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHNlbGYsIF9FTkRFRF9DQUxMQkFDSyk7XG4gICAgfVxuICB9KTtcbn07XG5cbl9wcm90b3R5cGUucGF1c2UgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUucGF1c2UoYXVkaW9JRCk7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9QQVVTRV9DQUxMQkFDSyk7XG4gICAgfVxuICB9XG59O1xuXG5fcHJvdG90eXBlLnNlZWsgPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgdmFyIHByaXZhdGVUaGlzID0gX3dlYWtNYXAuZ2V0KHRoaXMpO1xuXG4gIGlmIChwcml2YXRlVGhpcyAmJiB0eXBlb2YgcG9zaXRpb24gPT09IFwibnVtYmVyXCIgJiYgcG9zaXRpb24gPj0gMCkge1xuICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgIGlmICh0eXBlb2YgYXVkaW9JRCA9PT0gXCJudW1iZXJcIiAmJiBhdWRpb0lEID49IDApIHtcbiAgICAgIF9hdWRpb0VuZ2luZS5zZXRDdXJyZW50VGltZShhdWRpb0lELCBwb3NpdGlvbik7XG5cbiAgICAgIF9kaXNwYXRjaENhbGxiYWNrKHRoaXMsIF9TRUVLSU5HX0NBTExCQUNLKTtcblxuICAgICAgX2Rpc3BhdGNoQ2FsbGJhY2sodGhpcywgX1NFRUtFRF9DQUxMQkFDSyk7XG4gICAgfVxuICB9XG59O1xuXG5fcHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICBpZiAocHJpdmF0ZVRoaXMpIHtcbiAgICB2YXIgYXVkaW9JRCA9IHByaXZhdGVUaGlzLmF1ZGlvSUQ7XG5cbiAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwKSB7XG4gICAgICBfYXVkaW9FbmdpbmUuc3RvcChhdWRpb0lEKTtcblxuICAgICAgcHJpdmF0ZVRoaXMuYXVkaW9JRCA9IC0xO1xuXG4gICAgICBfZGlzcGF0Y2hDYWxsYmFjayh0aGlzLCBfU1RPUF9DQUxMQkFDSyk7XG4gICAgfVxuICB9XG59O1xuXG5fcHJvdG90eXBlLm9mZkNhbnBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9DQU5QTEFZX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZkVuZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfRU5ERURfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub2ZmRXJyb3IgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9FUlJPUl9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZQYXVzZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1BBVVNFX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9QTEFZX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9mZlNlZWtlZCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb2ZmQ2FsbGJhY2sodGhpcywgX1NFRUtFRF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZTZWVraW5nID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfU0VFS0lOR19DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZTdG9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vZmZDYWxsYmFjayh0aGlzLCBfU1RPUF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vZmZUaW1lVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHZhciByZXN1bHQgPSBfb2ZmQ2FsbGJhY2sodGhpcywgX1RJTUVfVVBEQVRFX0NBTExCQUNLLCBjYWxsYmFjayk7XG5cbiAgaWYgKHJlc3VsdCA9PT0gMSkge1xuICAgIGNsZWFySW50ZXJ2YWwoX3dlYWtNYXAuZ2V0KHRoaXMpLmludGVydmFsSUQpO1xuICB9XG59O1xuXG5fcHJvdG90eXBlLm9mZldhaXRpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29mZkNhbGxiYWNrKHRoaXMsIF9XQUlUSU5HX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uQ2FucGxheSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICBfb25DYWxsYmFjayh0aGlzLCBfQ0FOUExBWV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vbkVuZGVkID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9FTkRFRF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vbkVycm9yID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9FUlJPUl9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblBhdXNlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9QQVVTRV9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblBsYXkgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1BMQVlfQ0FMTEJBQ0ssIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25TZWVrZWQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgX1NFRUtFRF9DQUxMQkFDSywgY2FsbGJhY2spO1xufTtcblxuX3Byb3RvdHlwZS5vblNlZWtpbmcgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgX29uQ2FsbGJhY2sodGhpcywgXCJzZWVraW5nQ2FsbGJhY2tzXCIsIGNhbGxiYWNrKTtcbn07XG5cbl9wcm90b3R5cGUub25TdG9wID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9TVE9QX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5fcHJvdG90eXBlLm9uVGltZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICB2YXIgcmVzdWx0ID0gX29uQ2FsbGJhY2sodGhpcywgX1RJTUVfVVBEQVRFX0NBTExCQUNLLCBjYWxsYmFjayk7XG5cbiAgaWYgKHJlc3VsdCA9PT0gMSkge1xuICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldCh0aGlzKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgaW50ZXJ2YWxJRCA9IHNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBwcml2YXRlVGhpcyA9IF93ZWFrTWFwLmdldChzZWxmKTtcblxuICAgICAgaWYgKHByaXZhdGVUaGlzKSB7XG4gICAgICAgIHZhciBhdWRpb0lEID0gcHJpdmF0ZVRoaXMuYXVkaW9JRDtcblxuICAgICAgICBpZiAodHlwZW9mIGF1ZGlvSUQgPT09IFwibnVtYmVyXCIgJiYgYXVkaW9JRCA+PSAwICYmIF9hdWRpb0VuZ2luZS5nZXRTdGF0ZShhdWRpb0lEKSA9PT0gX1NUQVRFLlBMQVlJTkcpIHtcbiAgICAgICAgICBfZGlzcGF0Y2hDYWxsYmFjayhzZWxmLCBfVElNRV9VUERBVEVfQ0FMTEJBQ0spO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhckludGVydmFsKGludGVydmFsSUQpO1xuICAgICAgfVxuICAgIH0sIDUwMCk7XG4gICAgcHJpdmF0ZVRoaXMuaW50ZXJ2YWxJRCA9IGludGVydmFsSUQ7XG4gIH1cbn07XG5cbl9wcm90b3R5cGUub25XYWl0aW5nID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIF9vbkNhbGxiYWNrKHRoaXMsIF9XQUlUSU5HX0NBTExCQUNLLCBjYWxsYmFjayk7XG59O1xuXG5mdW5jdGlvbiBfZGVmYXVsdChBdWRpb0VuZ2luZSkge1xuICBpZiAoX2F1ZGlvRW5naW5lID09PSB1bmRlZmluZWQpIHtcbiAgICBfYXVkaW9FbmdpbmUgPSBPYmplY3QuYXNzaWduKHt9LCBBdWRpb0VuZ2luZSk7XG4gICAgT2JqZWN0LmtleXMoQXVkaW9FbmdpbmUpLmZvckVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgQXVkaW9FbmdpbmVbbmFtZV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBBdWRpb0VuZ2luZVtuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oXCJBdWRpb0VuZ2luZS5cIiArIG5hbWUgKyBcIiBpcyBkZXByZWNhdGVkXCIpO1xuICAgICAgICAgIHJldHVybiBfYXVkaW9FbmdpbmVbbmFtZV0uYXBwbHkoQXVkaW9FbmdpbmUsIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbmV3IElubmVyQXVkaW9Db250ZXh0KCk7XG59XG5cbjtcblxufSx7fV0sMjE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IHZvaWQgMDtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgX2RlZmF1bHQgPSB7XG4gIGV4cG9ydFRvOiBmdW5jdGlvbiBleHBvcnRUbyhuYW1lLCBmcm9tLCB0bywgZXJyQ2FsbGJhY2spIHtcbiAgICBpZiAoX3R5cGVvZihmcm9tKSAhPT0gXCJvYmplY3RcIiB8fCBfdHlwZW9mKHRvKSAhPT0gXCJvYmplY3RcIikge1xuICAgICAgY29uc29sZS53YXJuKFwiaW52YWxpZCBleHBvcnRUbzogXCIsIG5hbWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBmcm9tUHJvcGVydHkgPSBmcm9tW25hbWVdO1xuXG4gICAgaWYgKHR5cGVvZiBmcm9tUHJvcGVydHkgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIGlmICh0eXBlb2YgZnJvbVByb3BlcnR5ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdG9bbmFtZV0gPSBmcm9tUHJvcGVydHkuYmluZChmcm9tKTtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0b1tuYW1lXSwgZnJvbVByb3BlcnR5KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRvW25hbWVdID0gZnJvbVByb3BlcnR5O1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0b1tuYW1lXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihuYW1lICsgXCIgaXMgbm90IHN1cHBvcnQhXCIpO1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9O1xuXG4gICAgICBpZiAodHlwZW9mIGVyckNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgZXJyQ2FsbGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG59LHt9XX0se30sWzhdKTtcbiJdLCJmaWxlIjoicmFsLmpzIn0=
