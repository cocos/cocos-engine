/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _window2 = __webpack_require__(1);

	var _window = _interopRequireWildcard(_window2);

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function inject() {
	  var global = GameGlobal;

	  _window.addEventListener = function (type, listener) {
	    _window.document.addEventListener(type, listener);
	  };
	  _window.removeEventListener = function (type, listener) {
	    _window.document.removeEventListener(type, listener);
	  };

	  if (_window.canvas) {
	    _window.canvas.addEventListener = _window.addEventListener;
	    _window.canvas.removeEventListener = _window.removeEventListener;
	  }

	  var sysInfo = qg.getSystemInfoSync();
	  var platform = sysInfo.platformVersionName || sysInfo.platform;

	  // 旧版无法重定义 window
	  var docDescriptor = Object.getOwnPropertyDescriptor(window, 'document');

	  if (platform === 'devtools' || !docDescriptor.configurable) {
	    for (var key in _window) {
	      var descriptor = Object.getOwnPropertyDescriptor(global, key);

	      if (!descriptor || descriptor.configurable === true) {
	        Object.defineProperty(window, key, {
	          value: _window[key]
	        });
	      }
	    }

	    for (var _key in _window.document) {
	      var _descriptor = Object.getOwnPropertyDescriptor(global.document, _key);

	      if (!_descriptor || _descriptor.configurable === true) {
	        Object.defineProperty(global.document, _key, {
	          value: _window.document[_key]
	        });
	      }
	    }
	    window.parent = window;
	  } else {
	    for (var _key2 in _window) {
	      global[_key2] = _window[_key2];
	    }
	    global.window = _window;
	    window = global;
	    window.top = window.parent = window;
	  }
	}

	if (window.GameGlobal && !GameGlobal.__isAdapterInjected) {
	  GameGlobal.__isAdapterInjected = true;
	  inject();
	}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.canvas = exports.location = exports.HTMLElement = exports.FileReader = exports.Audio = exports.navigator = exports.document = undefined;

	var _WindowProperties = __webpack_require__(2);

	Object.keys(_WindowProperties).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _WindowProperties[key];
	    }
	  });
	});

	var _constructor = __webpack_require__(4);

	Object.keys(_constructor).forEach(function (key) {
	  if (key === "default" || key === "__esModule") return;
	  Object.defineProperty(exports, key, {
	    enumerable: true,
	    get: function get() {
	      return _constructor[key];
	    }
	  });
	});

	var _Canvas = __webpack_require__(10);

	var _Canvas2 = _interopRequireDefault(_Canvas);

	var _document2 = __webpack_require__(11);

	var _document3 = _interopRequireDefault(_document2);

	var _navigator2 = __webpack_require__(15);

	var _navigator3 = _interopRequireDefault(_navigator2);

	var _Audio2 = __webpack_require__(12);

	var _Audio3 = _interopRequireDefault(_Audio2);

	var _FileReader2 = __webpack_require__(16);

	var _FileReader3 = _interopRequireDefault(_FileReader2);

	var _HTMLElement2 = __webpack_require__(5);

	var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

	var _location2 = __webpack_require__(17);

	var _location3 = _interopRequireDefault(_location2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.document = _document3.default;
	exports.navigator = _navigator3.default;
	// export XMLHttpRequest from './XMLHttpRequest'
	// export WebSocket from './WebSocket'
	// export Image from './Image'

	exports.Audio = _Audio3.default;
	exports.FileReader = _FileReader3.default;
	exports.HTMLElement = _HTMLElement3.default;
	// export localStorage from './localStorage'

	exports.location = _location3.default;


	// 暴露全局的 canvas
	var canvas = new _Canvas2.default();

	exports.canvas = canvas;
	// export { setTimeout }
	// export { setInterval }
	// export { clearTimeout }
	// export { clearInterval }
	// export { requestAnimationFrame }
	// export { cancelAnimationFrame }

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.performance = exports.ontouchend = exports.ontouchmove = exports.ontouchstart = exports.screen = exports.devicePixelRatio = exports.innerHeight = exports.innerWidth = undefined;

	var _performance2 = __webpack_require__(3);

	var _performance3 = _interopRequireDefault(_performance2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _window = window;

	var _qg$getSystemInfoSync = qg.getSystemInfoSync(),
	    devicePixelRatio = _qg$getSystemInfoSync.pixelRatio;

	var innerWidth = exports.innerWidth = _window.innerWidth;
	var innerHeight = exports.innerHeight = _window.innerHeight;
	exports.devicePixelRatio = devicePixelRatio;
	var screen = exports.screen = {
	  availWidth: innerWidth,
	  availHeight: innerHeight
	};
	var ontouchstart = exports.ontouchstart = null;
	var ontouchmove = exports.ontouchmove = null;
	var ontouchend = exports.ontouchend = null;

	exports.performance = _performance3.default;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var performance = void 0;

	if (qg.getPerformance) {
	  var sysInfo = qg.getSystemInfoSync();
	  var platform = sysInfo.platformVersionName || sysInfo.platform;
	  var qgPerf = qg.getPerformance();
	  var initTime = qgPerf.now();

	  var clientPerfAdapter = Object.assign({}, qgPerf, {
	    now: function now() {
	      return (qgPerf.now() - initTime) / 1000;
	    }
	  });

	  performance = platform === 'devtools' ? qgPerf : clientPerfAdapter;
	}

	exports.default = performance;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.HTMLCanvasElement = exports.HTMLImageElement = undefined;

	var _HTMLElement3 = __webpack_require__(5);

	var _HTMLElement4 = _interopRequireDefault(_HTMLElement3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLImageElement = exports.HTMLImageElement = function (_HTMLElement) {
	  _inherits(HTMLImageElement, _HTMLElement);

	  function HTMLImageElement() {
	    _classCallCheck(this, HTMLImageElement);

	    return _possibleConstructorReturn(this, (HTMLImageElement.__proto__ || Object.getPrototypeOf(HTMLImageElement)).call(this, 'img'));
	  }

	  return HTMLImageElement;
	}(_HTMLElement4.default);

	var HTMLCanvasElement = exports.HTMLCanvasElement = function (_HTMLElement2) {
	  _inherits(HTMLCanvasElement, _HTMLElement2);

	  function HTMLCanvasElement() {
	    _classCallCheck(this, HTMLCanvasElement);

	    return _possibleConstructorReturn(this, (HTMLCanvasElement.__proto__ || Object.getPrototypeOf(HTMLCanvasElement)).call(this, 'canvas'));
	  }

	  return HTMLCanvasElement;
	}(_HTMLElement4.default);

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Element2 = __webpack_require__(6);

	var _Element3 = _interopRequireDefault(_Element2);

	var _util = __webpack_require__(9);

	var _WindowProperties = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLElement = function (_Element) {
	  _inherits(HTMLElement, _Element);

	  function HTMLElement() {
	    var tagName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	    _classCallCheck(this, HTMLElement);

	    var _this = _possibleConstructorReturn(this, (HTMLElement.__proto__ || Object.getPrototypeOf(HTMLElement)).call(this));

	    _this.className = '';
	    _this.childern = [];
	    _this.style = {
	      width: _WindowProperties.innerWidth + 'px',
	      height: _WindowProperties.innerHeight + 'px'
	    };
	    _this.insertBefore = _util.noop;
	    _this.innerHTML = '';

	    _this.tagName = tagName.toUpperCase();
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
	        width: _WindowProperties.innerWidth,
	        height: _WindowProperties.innerHeight
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
	}(_Element3.default);

	exports.default = HTMLElement;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Node2 = __webpack_require__(7);

	var _Node3 = _interopRequireDefault(_Node2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var ELement = function (_Node) {
	  _inherits(ELement, _Node);

	  function ELement() {
	    _classCallCheck(this, ELement);

	    var _this = _possibleConstructorReturn(this, (ELement.__proto__ || Object.getPrototypeOf(ELement)).call(this));

	    _this.className = '';
	    _this.children = [];
	    return _this;
	  }

	  return ELement;
	}(_Node3.default);

	exports.default = ELement;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _EventTarget2 = __webpack_require__(8);

	var _EventTarget3 = _interopRequireDefault(_EventTarget2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
	}(_EventTarget3.default);

	exports.default = Node;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _events = new WeakMap();

	var EventTarget = function () {
	  function EventTarget() {
	    _classCallCheck(this, EventTarget);

	    _events.set(this, {});
	  }

	  _createClass(EventTarget, [{
	    key: 'addEventListener',
	    value: function addEventListener(type, listener) {
	      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	      var events = _events.get(this);

	      if (!events) {
	        events = {};
	        _events.set(this, events);
	      }
	      if (!events[type]) {
	        events[type] = [];
	      }
	      events[type].push(listener);

	      if (options.capture) {
	        console.warn('EventTarget.addEventListener: options.capture is not implemented.');
	      }
	      if (options.once) {
	        console.warn('EventTarget.addEventListener: options.once is not implemented.');
	      }
	      if (options.passive) {
	        console.warn('EventTarget.addEventListener: options.passive is not implemented.');
	      }
	    }
	  }, {
	    key: 'removeEventListener',
	    value: function removeEventListener(type, listener) {
	      var listeners = _events.get(this)[type];

	      if (listeners && listeners.length > 0) {
	        for (var i = listeners.length; i--; i > 0) {
	          if (listeners[i] === listener) {
	            listeners.splice(i, 1);
	            break;
	          }
	        }
	      }
	    }
	  }, {
	    key: 'dispatchEvent',
	    value: function dispatchEvent() {
	      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      var listeners = _events.get(this)[event.type];

	      if (listeners) {
	        for (var i = 0; i < listeners.length; i++) {
	          listeners[i](event);
	        }
	      }
	    }
	  }]);

	  return EventTarget;
	}();

	exports.default = EventTarget;

/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.noop = noop;
	function noop() {}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Canvas;

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _document = window.document;

	var isGetCanvas = true;
	function createCanvas() {
	  if (isGetCanvas) {
	    isGetCanvas = false;
	    return _document.getElementById('canvas');
	  }
	  return _document.createElement('canvas');
	}
	function Canvas() {

	  var canvas = createCanvas();

	  canvas.type = 'canvas';

	  canvas.__proto__.__proto__ = new _HTMLElement2.default('canvas');

	  var _getContext = canvas.getContext;

	  canvas.getBoundingClientRect = function () {
	    var ret = {
	      top: 0,
	      left: 0,
	      width: window.innerWidth,
	      height: window.innerHeight
	    };
	    return ret;
	  };

	  return canvas;
	}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _window2 = __webpack_require__(1);

	var _window = _interopRequireWildcard(_window2);

	var _HTMLElement = __webpack_require__(5);

	var _HTMLElement2 = _interopRequireDefault(_HTMLElement);

	var _Audio = __webpack_require__(12);

	var _Audio2 = _interopRequireDefault(_Audio);

	var _Canvas = __webpack_require__(10);

	var _Canvas2 = _interopRequireDefault(_Canvas);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	// import './EventIniter/'

	// import Image from './Image'
	var events = {};
	var nativeEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
	var _addEventListener = window.addEventListener;
	var _removeEventListener = window.removeEventListener;

	var document = {
	  readyState: 'complete',
	  visibilityState: 'visible',
	  documentElement: _window,
	  hidden: false,
	  style: {},
	  location: _window.location,
	  ontouchstart: null,
	  ontouchmove: null,
	  ontouchend: null,

	  head: new _HTMLElement2.default('head'),
	  body: new _HTMLElement2.default('body'),

	  createElement: function createElement(tagName) {
	    if (tagName === 'canvas') {
	      return new _Canvas2.default();
	    } else if (tagName === 'audio') {
	      return new _Audio2.default();
	    } else if (tagName === 'img') {
	      return new Image();
	    }

	    return new _HTMLElement2.default(tagName);
	  },
	  getElementById: function getElementById(id) {
	    if (id === 'canvas') {
	      return _window.canvas;
	    }
	    return null;
	  },
	  getElementsByTagName: function getElementsByTagName(tagName) {
	    if (tagName === 'head') {
	      return [document.head];
	    } else if (tagName === 'body') {
	      return [document.body];
	    } else if (tagName === 'canvas') {
	      return [_window.canvas];
	    }
	    return [];
	  },
	  getElementsByName: function getElementsByName(tagName) {
	    if (tagName === 'head') {
	      return [document.head];
	    } else if (tagName === 'body') {
	      return [document.body];
	    } else if (tagName === 'canvas') {
	      return [_window.canvas];
	    }
	    return [];
	  },
	  querySelector: function querySelector(query) {
	    if (query === 'head') {
	      return document.head;
	    } else if (query === 'body') {
	      return document.body;
	    } else if (query === 'canvas') {
	      return _window.canvas;
	    } else if (query === '#' + _window.canvas.id) {
	      return _window.canvas;
	    }
	    return null;
	  },
	  querySelectorAll: function querySelectorAll(query) {
	    if (query === 'head') {
	      return [document.head];
	    } else if (query === 'body') {
	      return [document.body];
	    } else if (query === 'canvas') {
	      return [_window.canvas];
	    }
	    return [];
	  },
	  addEventListener: function addEventListener(type, listener) {
	    if (nativeEvents.indexOf(type) > -1 && _addEventListener) {
	      _addEventListener(type, listener);
	      return;
	    }
	    if (!events[type]) {
	      events[type] = [];
	    }
	    events[type].push(listener);
	  },
	  removeEventListener: function removeEventListener(type, listener) {
	    var listeners = events[type];

	    if (nativeEvents.indexOf(type) > -1 && _removeEventListener) {
	      _removeEventListener(type, listener);
	      return;
	    }
	    if (listeners && listeners.length > 0) {
	      for (var i = listeners.length; i--; i > 0) {
	        if (listeners[i] === listener) {
	          listeners.splice(i, 1);
	          break;
	        }
	      }
	    }
	  },
	  dispatchEvent: function dispatchEvent(event) {
	    var listeners = events[event.type];

	    if (listeners) {
	      for (var i = 0; i < listeners.length; i++) {
	        listeners[i](event);
	      }
	    }
	  }
	};

	exports.default = document;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _HTMLAudioElement2 = __webpack_require__(13);

	var _HTMLAudioElement3 = _interopRequireDefault(_HTMLAudioElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

	  function Audio(url) {
	    _classCallCheck(this, Audio);

	    var _this = _possibleConstructorReturn(this, (Audio.__proto__ || Object.getPrototypeOf(Audio)).call(this));

	    _this.HAVE_NOTHING = HAVE_NOTHING;
	    _this.HAVE_METADATA = HAVE_METADATA;
	    _this.HAVE_CURRENT_DATA = HAVE_CURRENT_DATA;
	    _this.HAVE_FUTURE_DATA = HAVE_FUTURE_DATA;
	    _this.HAVE_ENOUGH_DATA = HAVE_ENOUGH_DATA;
	    _this.readyState = HAVE_NOTHING;


	    _src.set(_this, '');

	    var innerAudioContext = qg.createInnerAudioContext();

	    _innerAudioContext.set(_this, innerAudioContext);

	    innerAudioContext.onCanplay(function () {
	      _this.dispatchEvent({ type: 'load' });
	      _this.dispatchEvent({ type: 'loadend' });
	      _this.dispatchEvent({ type: 'canplay' });
	      _this.dispatchEvent({ type: 'canplaythrough' });
	      _this.dispatchEvent({ type: 'loadedmetadata' });
	      _this.readyState = HAVE_CURRENT_DATA;
	    });
	    innerAudioContext.onPlay(function () {
	      _this.dispatchEvent({ type: 'play' });
	    });
	    innerAudioContext.onPause(function () {
	      _this.dispatchEvent({ type: 'pause' });
	    });
	    innerAudioContext.onEnded(function () {
	      _this.dispatchEvent({ type: 'ended' });
	      _this.readyState = HAVE_ENOUGH_DATA;
	    });
	    innerAudioContext.onError(function () {
	      _this.dispatchEvent({ type: 'error' });
	    });

	    if (url) {
	      _innerAudioContext.get(_this).src = url;
	    }
	    return _this;
	  }

	  _createClass(Audio, [{
	    key: 'load',
	    value: function load() {
	      console.warn('HTMLAudioElement.load() is not implemented.');
	    }
	  }, {
	    key: 'play',
	    value: function play() {
	      _innerAudioContext.get(this).play();
	    }
	  }, {
	    key: 'pause',
	    value: function pause() {
	      _innerAudioContext.get(this).pause();
	    }
	  }, {
	    key: 'canPlayType',
	    value: function canPlayType() {
	      var mediaType = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	      if (typeof mediaType !== 'string') {
	        return '';
	      }

	      if (mediaType.indexOf('audio/mpeg') > -1 || mediaType.indexOf('audio/mp4')) {
	        return 'probably';
	      }
	      return '';
	    }
	  }, {
	    key: 'cloneNode',
	    value: function cloneNode() {
	      var newAudio = new Audio();
	      newAudio.loop = _innerAudioContext.get(this).loop;
	      newAudio.autoplay = _innerAudioContext.get(this).autoplay;
	      newAudio.src = this.src;
	      return newAudio;
	    }
	  }, {
	    key: 'currentTime',
	    get: function get() {
	      return _innerAudioContext.get(this).currentTime;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).seek(value);
	    }
	  }, {
	    key: 'src',
	    get: function get() {
	      return _src.get(this);
	    },
	    set: function set(value) {
	      _src.set(this, value);
	      _innerAudioContext.get(this).src = value;
	    }
	  }, {
	    key: 'loop',
	    get: function get() {
	      return _innerAudioContext.get(this).loop;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).loop = value;
	    }
	  }, {
	    key: 'autoplay',
	    get: function get() {
	      return _innerAudioContext.get(this).autoplay;
	    },
	    set: function set(value) {
	      _innerAudioContext.get(this).autoplay = value;
	    }
	  }, {
	    key: 'paused',
	    get: function get() {
	      return _innerAudioContext.get(this).paused;
	    }
	  }]);

	  return Audio;
	}(_HTMLAudioElement3.default);

	exports.default = Audio;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _HTMLMediaElement2 = __webpack_require__(14);

	var _HTMLMediaElement3 = _interopRequireDefault(_HTMLMediaElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var HTMLAudioElement = function (_HTMLMediaElement) {
	  _inherits(HTMLAudioElement, _HTMLMediaElement);

	  function HTMLAudioElement() {
	    _classCallCheck(this, HTMLAudioElement);

	    return _possibleConstructorReturn(this, (HTMLAudioElement.__proto__ || Object.getPrototypeOf(HTMLAudioElement)).call(this, 'audio'));
	  }

	  return HTMLAudioElement;
	}(_HTMLMediaElement3.default);

	exports.default = HTMLAudioElement;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _HTMLElement2 = __webpack_require__(5);

	var _HTMLElement3 = _interopRequireDefault(_HTMLElement2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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
	}(_HTMLElement3.default);

	exports.default = HTMLMediaElement;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _util = __webpack_require__(9);

	// TODO 需要 qg.getSystemInfo 获取更详细信息
	var sysInfo = qg.getSystemInfoSync();
	var platform = sysInfo.platformVersionName || sysInfo.platform;
	var navigator = {
	  platform: platform,
	  language: 'zh-cn',
	  appVersion: '5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
	  // userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Mobile/14E8301 MicroMessenger/6.6.0 QuickGame NetType/WIFI Language/zh_CN',
	  userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Redmi Note 4X Build/NRD90M; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/61.0.3163.128 Mobile Safari/537.36 QuickGame Language/zh_CN',
	  onLine: true, // TODO 用 qg.getNetworkStateChange 和 qg.onNetworkStateChange 来返回真实的状态

	  // TODO 用 qg.getLocation 来封装 geolocation
	  geolocation: {
	    getCurrentPosition: _util.noop,
	    watchPosition: _util.noop,
	    clearWatch: _util.noop
	  }
	};

	exports.default = navigator;

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * TODO 使用 qg.readFile 来封装 FileReader
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

	exports.default = FileReader;

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var location = {
	  href: 'game.js',
	  protocol: '',
	  reload: function reload() {}
	};

	exports.default = location;

/***/ })
/******/ ]);