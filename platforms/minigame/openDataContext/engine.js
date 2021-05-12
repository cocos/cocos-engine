module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EE", function() { return EE; });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_env_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_elements_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _common_pool_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4);
/* harmony import */ var tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(tiny_emitter__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6);
/* harmony import */ var css_layout__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(css_layout__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);
/* harmony import */ var _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8);
/* harmony import */ var _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _common_bitMapFont__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(14);
/* harmony import */ var _components_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(16);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }








 // components

 // 全局事件管道

var EE = new tiny_emitter__WEBPACK_IMPORTED_MODULE_3___default.a();
var imgPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_2__["default"]('imgPool');
var canvasPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_2__["default"]('canvasPool');
var constructorMap = {
  view: _components_index_js__WEBPACK_IMPORTED_MODULE_8__["View"],
  text: _components_index_js__WEBPACK_IMPORTED_MODULE_8__["Text"],
  image: _components_index_js__WEBPACK_IMPORTED_MODULE_8__["Image"],
  scrollview: _components_index_js__WEBPACK_IMPORTED_MODULE_8__["ScrollView"],
  bitmaptext: _components_index_js__WEBPACK_IMPORTED_MODULE_8__["BitMapText"]
};

function isPercent(data) {
  return typeof data === 'string' && /\d+(?:\.\d+)?%/.test(data);
}

function convertPercent(data, parentData) {
  if (typeof data === 'number') {
    return data;
  }

  var matchData = data.match(/(\d+(?:\.\d+)?)%/)[1];

  if (matchData) {
    return parentData * matchData * 0.01;
  }
}

var create = function create(node, style, parent) {
  var _this = this;

  var _constructor = constructorMap[node.name];
  var children = node.children || [];
  var attr = node.attr || {};
  var id = attr.id || '';
  var args = Object.keys(attr).reduce(function (obj, key) {
    var value = attr[key];
    var attribute = key;

    if (key === 'id') {
      obj.style = Object.assign(obj.style || {}, style[id] || {});
      return obj;
    }

    if (key === 'class') {
      obj.style = value.split(/\s+/).reduce(function (res, oneClass) {
        return Object.assign(res, style[oneClass]);
      }, obj.style || {});
      return obj;
    } // if (/\{\{.+\}\}/.test(value)) {
    // }


    if (value === 'true') {
      obj[attribute] = true;
    } else if (value === 'false') {
      obj[attribute] = false;
    } else {
      obj[attribute] = value;
    }

    return obj;
  }, {}); // 用于后续元素查询

  args.idName = id;
  args.className = attr["class"] || '';
  var thisStyle = args.style;

  if (thisStyle) {
    var parentStyle;

    if (parent) {
      parentStyle = parent.style;
    } else if (typeof sharedCanvas !== 'undefined') {
      parentStyle = sharedCanvas;
    } else {
      parentStyle = __env.getSharedCanvas();
    }

    if (isPercent(thisStyle.width)) {
      thisStyle.width = parentStyle.width ? convertPercent(thisStyle.width, parentStyle.width) : 0;
    }

    if (isPercent(thisStyle.height)) {
      thisStyle.height = parentStyle.height ? convertPercent(thisStyle.height, parentStyle.height) : 0;
    }
  }

  var element = new _constructor(args);
  element.root = this;
  children.forEach(function (childNode) {
    var childElement = create.call(_this, childNode, style, args);
    element.add(childElement);
  });
  return element;
};

var getChildren = function getChildren(element) {
  return Object.keys(element.children).map(function (id) {
    return element.children[id];
  }).map(function (child) {
    return {
      id: child.id,
      name: child.name,
      style: child.style,
      children: getChildren(child)
    };
  });
};

var renderChildren = function renderChildren(children, context) {
  children.forEach(function (child) {
    if (child.type === 'ScrollView') {
      // ScrollView的子节点渲染交给ScrollView自己，不支持嵌套ScrollView
      child.insertScrollView(context);
    } else {
      child.insert(context);
      return renderChildren(child.children, context);
    }
  });
};

function layoutChildren(dataArray, children) {
  var _this2 = this;

  dataArray.forEach(function (data) {
    var child = children.find(function (item) {
      return item.id === data.id;
    });
    child.layoutBox = child.layoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      child.layoutBox[prop] = data.layout[prop];
    });

    if (child.parent) {
      child.layoutBox.absoluteX = (child.parent.layoutBox.absoluteX || 0) + child.layoutBox.left;
      child.layoutBox.absoluteY = (child.parent.layoutBox.absoluteY || 0) + child.layoutBox.top;
    } else {
      child.layoutBox.absoluteX = child.layoutBox.left;
      child.layoutBox.absoluteY = child.layoutBox.top;
    }

    child.layoutBox.originalAbsoluteY = child.layoutBox.absoluteY; // 滚动列表的画板尺寸和主画板保持一致

    if (child.type === 'ScrollView') {
      child.updateRenderPort(_this2.renderport);
    }

    layoutChildren.call(_this2, data.children, child.children);
  });
}

var updateRealLayout = function updateRealLayout(dataArray, children, scale) {
  dataArray.forEach(function (data) {
    var child = children.find(function (item) {
      return item.id === data.id;
    });
    child.realLayoutBox = child.realLayoutBox || {};
    ['left', 'top', 'width', 'height'].forEach(function (prop) {
      child.realLayoutBox[prop] = data.layout[prop] * scale;
    });

    if (child.parent) {
      child.realLayoutBox.realX = (child.parent.realLayoutBox.realX || 0) + child.realLayoutBox.left;
      Object.defineProperty(child.realLayoutBox, 'realY', {
        configurable: true,
        enumerable: true,
        get: function get() {
          var res = (child.parent.realLayoutBox.realY || 0) + child.realLayoutBox.top;
          /**
           * 滚动列表事件处理
           */

          if (child.parent && child.parent.type === 'ScrollView') {
            res -= child.parent.top * scale;
          }

          return res;
        }
      });
    } else {
      child.realLayoutBox.realX = child.realLayoutBox.left;
      child.realLayoutBox.realY = child.realLayoutBox.top;
    }

    updateRealLayout(data.children, child.children, scale);
  });
};

function _getElementsById(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var id = arguments.length > 2 ? arguments[2] : undefined;
  Object.keys(tree.children).forEach(function (key) {
    var child = tree.children[key];

    if (child.idName === id) {
      list.push(child);
    }

    if (Object.keys(child.children).length) {
      _getElementsById(child, list, id);
    }
  });
  return list;
}

function _getElementsByClassName(tree) {
  var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var className = arguments.length > 2 ? arguments[2] : undefined;
  Object.keys(tree.children).forEach(function (key) {
    var child = tree.children[key];

    if (child.className.split(/\s+/).indexOf(className) > -1) {
      list.push(child);
    }

    if (Object.keys(child.children).length) {
      _getElementsByClassName(child, list, className);
    }
  });
  return list;
}

var _Layout = /*#__PURE__*/function (_Element) {
  _inherits(_Layout, _Element);

  var _super = _createSuper(_Layout);

  function _Layout() {
    var _this3;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        style = _ref.style,
        name = _ref.name;

    _classCallCheck(this, _Layout);

    _this3 = _super.call(this, {
      style: style,
      id: 0,
      name: name
    });
    _this3.hasEventHandler = false;
    _this3.elementTree = null;
    _this3.renderContext = null;
    _this3.debugInfo = {};
    _this3.renderport = {};
    _this3.viewport = {};
    _this3.touchStart = _this3.eventHandler('touchstart').bind(_assertThisInitialized(_this3));
    _this3.touchMove = _this3.eventHandler('touchmove').bind(_assertThisInitialized(_this3));
    _this3.touchEnd = _this3.eventHandler('touchend').bind(_assertThisInitialized(_this3));
    _this3.touchCancel = _this3.eventHandler('touchcancel').bind(_assertThisInitialized(_this3));
    _this3.version = '0.0.1';
    _this3.touchMsg = {};
    _this3.hasViewPortSet = false;
    _this3.realLayoutBox = {
      realX: 0,
      realY: 0
    };
    _this3.state = _common_util_js__WEBPACK_IMPORTED_MODULE_5__["STATE"].UNINIT;
    _this3.bitMapFonts = [];
    return _this3;
  }
  /**
   * 更新被绘制canvas的窗口信息，本渲染引擎并不关心是否会和其他游戏引擎共同使用
   * 而本身又需要支持事件处理，因此，如果被渲染内容是绘制到离屏canvas，需要将最终绘制在屏幕上
   * 的绝对尺寸和位置信息更新到本渲染引擎。
   * 其中，width为物理像素宽度，height为物理像素高度，x为距离屏幕左上角的物理像素x坐标，y为距离屏幕左上角的物理像素
   * y坐标
   */


  _createClass(_Layout, [{
    key: "updateViewPort",
    value: function updateViewPort(box) {
      this.viewport.width = box.width || 0;
      this.viewport.height = box.height || 0;
      this.viewport.x = box.x || 0;
      this.viewport.y = box.y || 0;
      this.realLayoutBox = {
        realX: this.viewport.x,
        realY: this.viewport.y
      };
      this.hasViewPortSet = true;
    }
  }, {
    key: "init",
    value: function init(template, style, attrValueProcessor) {
      var start = new Date();
      /*if( parser.validate(template) === true) { //optional (it'll return an object in case it's not valid)*/

      /*}*/

      var parseConfig = {
        attributeNamePrefix: "",
        attrNodeName: "attr",
        //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: true,
        allowBooleanAttributes: true,
        parseNodeValue: false,
        parseAttributeValue: false,
        trimValues: true,
        parseTrueNumberOnly: false
      };

      if (attrValueProcessor && typeof attrValueProcessor === "function") {
        parseConfig.attrValueProcessor = attrValueProcessor;
      }

      var jsonObj = _libs_fast_xml_parser_parser_js__WEBPACK_IMPORTED_MODULE_6___default.a.parse(template, parseConfig, true);
      var xmlTree = jsonObj.children[0];
      this.debugInfo.xmlTree = new Date() - start; // XML树生成渲染树

      this.layoutTree = create.call(this, xmlTree, style);
      this.debugInfo.layoutTree = new Date() - start;
      this.add(this.layoutTree);
      var elementTree = {
        id: this.id,
        style: {
          width: this.style.width,
          height: this.style.height,
          flexDirection: 'row'
        },
        children: getChildren(this)
      }; // 计算布局树

      css_layout__WEBPACK_IMPORTED_MODULE_4___default()(elementTree);
      this.elementTree = elementTree;
      this.debugInfo.renderTree = new Date() - start;
      var rootEle = this.children[0];

      if (rootEle.style.width === undefined || rootEle.style.height === undefined) {
        console.error('Please set width and height property for root element');
      } else {
        this.renderport.width = rootEle.style.width;
        this.renderport.height = rootEle.style.height;
      }

      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_5__["STATE"].INITED;
    }
  }, {
    key: "layout",
    value: function layout(context) {
      var start = new Date();
      this.renderContext = context;

      if (this.renderContext) {
        this.renderContext.clearRect(0, 0, this.renderport.width, this.renderport.height);
      }

      if (!this.hasViewPortSet) {
        console.error('Please invoke method `updateViewPort` before method `layout`');
      }

      layoutChildren.call(this, this.elementTree.children, this.children);
      this.debugInfo.layoutChildren = new Date() - start; // 计算真实的物理像素位置，用于事件处理

      updateRealLayout(this.elementTree.children, this.children, this.viewport.width / this.renderport.width);
      this.debugInfo.updateRealLayout = new Date() - start;
      renderChildren(this.children, context);
      this.debugInfo.renderChildren = new Date() - start;
      this.bindEvents();
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_5__["STATE"].RENDERED;
    }
  }, {
    key: "initRepaint",
    value: function initRepaint() {
      var _this4 = this;

      this.on('repaint', function () {
        _this4.repaint();
      });
      this.EE.on('one__image__render__done', function (img) {
        _this4.repaint();
      });
    }
  }, {
    key: "repaint",
    value: function repaint() {
      var start = new Date();
      Object(_common_util_js__WEBPACK_IMPORTED_MODULE_5__["repaintChildren"])(this.children);
      this.emit('repaint__done');
    }
  }, {
    key: "getChildByPos",
    value: function getChildByPos(tree, x, y) {
      var list = Object.keys(tree.children);

      for (var i = 0; i < list.length; i++) {
        var child = tree.children[list[i]];
        var box = child.realLayoutBox;

        if (box.realX <= x && x <= box.realX + box.width && box.realY <= y && y <= box.realY + box.height) {
          if (Object.keys(child.children).length) {
            return this.getChildByPos(child, x, y);
          } else {
            return child;
          }
        }
      }

      return tree;
    }
  }, {
    key: "eventHandler",
    value: function eventHandler(eventName) {
      return function touchEventHandler(e) {
        if (!this.elementTree) {
          return;
        }

        var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

        if (!touch || !touch.pageX || !touch.pageY) {
          return;
        }

        if (!touch.timeStamp) {
          touch.timeStamp = e.timeStamp;
        }

        var item = touch && this.getChildByPos(this, touch.pageX, touch.pageY);
        item && item.emit(eventName, e);

        if (eventName === 'touchstart' || eventName === 'touchend') {
          this.touchMsg[eventName] = touch;
        }

        if (eventName === 'touchend' && Object(_common_util_js__WEBPACK_IMPORTED_MODULE_5__["isClick"])(this.touchMsg)) {
          item && item.emit('click', e);
        }
      };
    }
  }, {
    key: "bindEvents",
    value: function bindEvents() {
      if (this.hasEventHandler) {
        return;
      }

      this.hasEventHandler = true;

      if (typeof __env !== 'undefined') {
        __env.onTouchStart(this.touchStart);

        __env.onTouchMove(this.touchMove);

        __env.onTouchEnd(this.touchEnd);

        __env.onTouchCancel(this.touchCancel);
      } else {
        document.onmousedown = this.touchStart;
        document.onmousemove = this.touchMove;
        document.onmouseup = this.touchEnd;
        document.onmouseleave = this.touchEnd;
      }
    }
  }, {
    key: "emit",
    value: function emit(event, data) {
      EE.emit(event, data);
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      EE.on(event, callback);
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      EE.once(event, callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      EE.off(event, callback);
    }
  }, {
    key: "getElementsById",
    value: function getElementsById(id) {
      return _getElementsById(this, [], id);
    }
  }, {
    key: "getElementsByClassName",
    value: function getElementsByClassName(className) {
      return _getElementsByClassName(this, [], className);
    }
  }, {
    key: "destroyAll",
    value: function destroyAll(tree) {
      var _this5 = this;

      if (!tree) {
        tree = this;
      }

      var children = tree.children;
      children.forEach(function (child) {
        child.destroy();

        _this5.destroyAll(child);

        child.destroySelf && child.destroySelf();
      });
    }
  }, {
    key: "clear",
    value: function clear() {
      this.destroyAll();
      this.elementTree = null;
      this.children = [];
      this.layoutTree = {};
      this.state = _common_util_js__WEBPACK_IMPORTED_MODULE_5__["STATE"].CLEAR;
      canvasPool.getList().forEach(function (item) {
        item.context && item.context.clearRect(0, 0, item.canvas.width, item.canvas.height);
        item.elements = [];
        item.canvas = null;
        item.context = null;
      });

      if (this.renderContext) {
        this.renderContext.clearRect(0, 0, this.renderContext.canvas.width, this.renderContext.canvas.height);
      }
      /*['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(eventName => {
        this.off(eventName);
      });*/


      this.EE.off('image__render__done');
    }
  }, {
    key: "clearPool",
    value: function clearPool() {
      imgPool.clear();
      canvasPool.clear();
    }
  }, {
    key: "clearAll",
    value: function clearAll() {
      this.clear();
      this.clearPool();
    }
  }, {
    key: "loadImgs",
    value: function loadImgs(arr) {
      arr.forEach(function (src) {
        var img = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_5__["createImage"])();
        imgPool.set(src, img);

        img.onload = function () {
          img.loadDone = true;
        };

        img.onloadcbks = [];
        img.src = src;
      });
    }
  }, {
    key: "registBitMapFont",
    value: function registBitMapFont(name, src, config) {
      var font = new _common_bitMapFont__WEBPACK_IMPORTED_MODULE_7__["default"](name, src, config);
      this.bitMapFonts.push(font);
    }
  }]);

  return _Layout;
}(_components_elements_js__WEBPACK_IMPORTED_MODULE_1__["default"]);

var Layout = new _Layout({
  style: {
    width: 0,
    height: 0
  },
  name: 'layout'
});
/* harmony default export */ __webpack_exports__["default"] = (Layout);

/***/ }),
/* 1 */
/***/ (function(module, exports) {

GameGlobal.__env = GameGlobal.wx || GameGlobal.tt || GameGlobal.swan;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Element; });
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Emitter = __webpack_require__(4); // 全局事件管道


var EE = new Emitter();
var uuid = 0;
var dpr = 1;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getRgba(hex, opacity) {
  var rgbObj = hexToRgb(hex);

  if (opacity == undefined) {
    opacity = 1;
  }

  return "rgba(".concat(rgbObj.r, ", ").concat(rgbObj.g, ", ").concat(rgbObj.b, ", ").concat(opacity, ")");
}

var toEventName = function toEventName(event, id) {
  var elementEvent = ['click', 'touchstart', 'touchmove', 'touchend', 'touchcancel'];

  if (elementEvent.indexOf(event) !== -1) {
    return "element-".concat(id, "-").concat(event);
  }

  return "element-".concat(id, "-").concat(event);
};

var Element = /*#__PURE__*/function () {
  function Element(_ref) {
    var _this = this;

    var _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className,
        _ref$id = _ref.id,
        id = _ref$id === void 0 ? ++uuid : _ref$id;

    _classCallCheck(this, Element);

    this.children = [];
    this.childMap = {};
    this.parent = null;
    this.parentId = 0;
    this.id = id;
    this.props = props;
    this.idName = idName;
    this.className = className;
    this.style = style;
    this.EE = EE;
    this.root = null;
    this.isDestroyed = false;
    this.layoutBox = {};

    if (style.opacity !== undefined && style.color && style.color.indexOf('#') > -1) {
      style.color = getRgba(style.color, style.opacity);
    }

    if (style.opacity !== undefined && style.backgroundColor && style.backgroundColor.indexOf('#') > -1) {
      style.backgroundColor = getRgba(style.backgroundColor, style.opacity);
    }

    for (var key in this.style) {
      if (_style_js__WEBPACK_IMPORTED_MODULE_0__["scalableStyles"].indexOf(key) > -1) {
        this.style[key] *= dpr;
      }
    } // 事件冒泡逻辑


    ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click'].forEach(function (eventName) {
      _this.on(eventName, function (e, touchMsg) {
        _this.parent && _this.parent.emit(eventName, e, touchMsg);
      });
    });
    this.initRepaint();
  }

  _createClass(Element, [{
    key: "initRepaint",
    value: function initRepaint() {
      var _this2 = this;

      this.on('repaint', function (e) {
        _this2.parent && _this2.parent.emit('repaint', e);
      });
    } // 子类填充实现

  }, {
    key: "repaint",
    value: function repaint() {} // 子类填充实现

  }, {
    key: "insert",
    value: function insert() {}
  }, {
    key: "checkNeedRender",
    value: function checkNeedRender() {
      return true;
    } // 子类填充实现

  }, {
    key: "destroy",
    value: function destroy() {
      var _this3 = this;

      ['touchstart', 'touchmove', 'touchcancel', 'touchend', 'click', 'repaint'].forEach(function (eventName) {
        _this3.off(eventName);
      });
      this.EE.off('image__render__done');
      this.isDestroyed = true;
      this.EE = null;
      /*this.root          = null;*/

      this.parent = null;
      this.ctx = null;
      this.realLayoutBox = null;
      this.layoutBox = null;
      this.props = null;
      this.style = null;

      if (this.renderBoxes) {
        this.renderBoxes = null;
      }
    }
  }, {
    key: "add",
    value: function add(element) {
      element.parent = this;
      element.parentId = this.id;
      this.children.push(element);
    }
  }, {
    key: "emit",
    value: function emit(event) {
      for (var _len = arguments.length, theArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        theArgs[_key - 1] = arguments[_key];
      }

      EE.emit.apply(EE, [toEventName(event, this.id)].concat(theArgs));
    }
  }, {
    key: "on",
    value: function on(event, callback) {
      EE.on(toEventName(event, this.id), callback);
    }
  }, {
    key: "once",
    value: function once(event, callback) {
      EE.once(toEventName(event, this.id), callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      EE.off(toEventName(event, this.id), callback);
    } // 方便子类实现borderRadius

  }, {
    key: "roundRect",
    value: function roundRect(ctx, layoutBox) {
      var style = this.style || {};
      var box = layoutBox || this.layoutBox;
      var w = box.width;
      var h = box.height;
      var r = style.borderRadius;
      var x = box.absoluteX;
      var y = box.absoluteY;
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.clip();
    }
  }, {
    key: "renderBorder",
    value: function renderBorder(ctx, layoutBox) {
      var style = this.style || {};

      if (style.borderRadius) {
        this.roundRect(ctx, layoutBox);
      }

      ctx.save();
      var box = layoutBox || this.layoutBox;
      var borderWidth = style.borderWidth || 0;
      var borderLeftWidth = style.borderLeftWidth || 0;
      var borderRightWidth = style.borderRightWidth || 0;
      var borderTopWidth = style.borderTopWidth || 0;
      var borderBottomWidth = style.borderBottomWidth || 0;
      var radius = style.borderRadius || 0;
      var borderColor = style.borderColor;
      var drawX = box.absoluteX;
      var drawY = box.absoluteY;
      ctx.beginPath();

      if (borderWidth && borderColor) {
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.strokeRect(drawX, drawY, box.width, box.height);
      }

      if (borderTopWidth && (borderColor || style.borderTopColor)) {
        ctx.lineWidth = borderTopWidth;
        ctx.strokeStyle = style.borderTopColor || borderColor;
        ctx.moveTo(radius ? drawX + radius : drawX, drawY + borderTopWidth / 2);
        ctx.lineTo(radius ? drawX + box.width - radius : drawX + box.width, drawY + borderTopWidth / 2);
      }

      if (borderBottomWidth && (borderColor || style.borderBottomColor)) {
        ctx.lineWidth = borderBottomWidth;
        ctx.strokeStyle = style.borderBottomColor || borderColor;
        ctx.moveTo(radius ? drawX + radius : drawX, drawY + box.height - borderBottomWidth / 2);
        ctx.lineTo(radius ? drawX + box.width - radius : drawX + box.width, drawY + box.height - borderBottomWidth / 2);
      }

      if (borderLeftWidth && (borderColor || style.borderLeftColor)) {
        ctx.lineWidth = borderLeftWidth;
        ctx.strokeStyle = style.borderLeftColor || borderColor;
        ctx.moveTo(drawX + borderLeftWidth / 2, radius ? drawY + radius : drawY);
        ctx.lineTo(drawX + borderLeftWidth / 2, radius ? drawY + box.height - radius : drawY + box.height);
      }

      if (borderRightWidth && (borderColor || style.borderRightColor)) {
        ctx.lineWidth = borderRightWidth;
        ctx.strokeStyle = style.borderRightColor || borderColor;
        ctx.moveTo(drawX + box.width - borderRightWidth / 2, radius ? drawY + radius : drawY);
        ctx.lineTo(drawX + box.width - borderRightWidth / 2, radius ? drawY + box.height - radius : drawY + box.height);
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  }]);

  return Element;
}();



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scalableStyles", function() { return scalableStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "textStyles", function() { return textStyles; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "layoutAffectedStyles", function() { return layoutAffectedStyles; });
var textStyles = ['color', 'fontSize', 'textAlign', 'fontWeight', 'lineHeight', 'lineBreak'];
var scalableStyles = ['left', 'top', 'right', 'bottom', 'width', 'height', 'margin', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'padding', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'fontSize', 'lineHeight', 'borderRadius', 'minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
var layoutAffectedStyles = ['margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight', 'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'width', 'height'];


/***/ }),
/* 4 */
/***/ (function(module, exports) {

function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;
module.exports.TinyEmitter = E;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Pool; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var pools = [];

var Pool = /*#__PURE__*/function () {
  function Pool() {
    var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'pool';

    _classCallCheck(this, Pool);

    var curr = pools.find(function (item) {
      return item.name === name;
    });

    if (curr) {
      return curr;
    }

    this.name = name;
    this.pool = {};
    pools.push(this);
  }

  _createClass(Pool, [{
    key: "get",
    value: function get(key) {
      return this.pool[key];
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this.pool[key] = value;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.pool = {};
    }
  }, {
    key: "getList",
    value: function getList() {
      return Object.values(this.pool);
    }
  }]);

  return Pool;
}();



/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// UMD (Universal Module Definition)
// See https://github.com/umdjs/umd for reference
//
// This file uses the following specific UMD implementation:
// https://github.com/umdjs/umd/blob/master/returnExports.js
(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, function() {
  /**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

var computeLayout = (function() {

  var CSS_UNDEFINED;

  var CSS_DIRECTION_INHERIT = 'inherit';
  var CSS_DIRECTION_LTR = 'ltr';
  var CSS_DIRECTION_RTL = 'rtl';

  var CSS_FLEX_DIRECTION_ROW = 'row';
  var CSS_FLEX_DIRECTION_ROW_REVERSE = 'row-reverse';
  var CSS_FLEX_DIRECTION_COLUMN = 'column';
  var CSS_FLEX_DIRECTION_COLUMN_REVERSE = 'column-reverse';

  var CSS_JUSTIFY_FLEX_START = 'flex-start';
  var CSS_JUSTIFY_CENTER = 'center';
  var CSS_JUSTIFY_FLEX_END = 'flex-end';
  var CSS_JUSTIFY_SPACE_BETWEEN = 'space-between';
  var CSS_JUSTIFY_SPACE_AROUND = 'space-around';

  var CSS_ALIGN_FLEX_START = 'flex-start';
  var CSS_ALIGN_CENTER = 'center';
  var CSS_ALIGN_FLEX_END = 'flex-end';
  var CSS_ALIGN_STRETCH = 'stretch';

  var CSS_POSITION_RELATIVE = 'relative';
  var CSS_POSITION_ABSOLUTE = 'absolute';

  var leading = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var trailing = {
    'row': 'right',
    'row-reverse': 'left',
    'column': 'bottom',
    'column-reverse': 'top'
  };
  var pos = {
    'row': 'left',
    'row-reverse': 'right',
    'column': 'top',
    'column-reverse': 'bottom'
  };
  var dim = {
    'row': 'width',
    'row-reverse': 'width',
    'column': 'height',
    'column-reverse': 'height'
  };

  // When transpiled to Java / C the node type has layout, children and style
  // properties. For the JavaScript version this function adds these properties
  // if they don't already exist.
  function fillNodes(node) {
    if (!node.layout || node.isDirty) {
      node.layout = {
        width: undefined,
        height: undefined,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      };
    }

    if (!node.style) {
      node.style = {};
    }

    if (!node.children) {
      node.children = [];
    }
    node.children.forEach(fillNodes);
    return node;
  }

  function isUndefined(value) {
    return value === undefined;
  }

  function isRowDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_ROW ||
           flexDirection === CSS_FLEX_DIRECTION_ROW_REVERSE;
  }

  function isColumnDirection(flexDirection) {
    return flexDirection === CSS_FLEX_DIRECTION_COLUMN ||
           flexDirection === CSS_FLEX_DIRECTION_COLUMN_REVERSE;
  }

  function getLeadingMargin(node, axis) {
    if (node.style.marginStart !== undefined && isRowDirection(axis)) {
      return node.style.marginStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginLeft;   break;
      case 'row-reverse':    value = node.style.marginRight;  break;
      case 'column':         value = node.style.marginTop;    break;
      case 'column-reverse': value = node.style.marginBottom; break;
    }

    if (value !== undefined) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getTrailingMargin(node, axis) {
    if (node.style.marginEnd !== undefined && isRowDirection(axis)) {
      return node.style.marginEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.marginRight;  break;
      case 'row-reverse':    value = node.style.marginLeft;   break;
      case 'column':         value = node.style.marginBottom; break;
      case 'column-reverse': value = node.style.marginTop;    break;
    }

    if (value != null) {
      return value;
    }

    if (node.style.margin !== undefined) {
      return node.style.margin;
    }

    return 0;
  }

  function getLeadingPadding(node, axis) {
    if (node.style.paddingStart !== undefined && node.style.paddingStart >= 0
        && isRowDirection(axis)) {
      return node.style.paddingStart;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingLeft;   break;
      case 'row-reverse':    value = node.style.paddingRight;  break;
      case 'column':         value = node.style.paddingTop;    break;
      case 'column-reverse': value = node.style.paddingBottom; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getTrailingPadding(node, axis) {
    if (node.style.paddingEnd !== undefined && node.style.paddingEnd >= 0
        && isRowDirection(axis)) {
      return node.style.paddingEnd;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.paddingRight;  break;
      case 'row-reverse':    value = node.style.paddingLeft;   break;
      case 'column':         value = node.style.paddingBottom; break;
      case 'column-reverse': value = node.style.paddingTop;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.padding !== undefined && node.style.padding >= 0) {
      return node.style.padding;
    }

    return 0;
  }

  function getLeadingBorder(node, axis) {
    if (node.style.borderStartWidth !== undefined && node.style.borderStartWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderStartWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderLeftWidth;   break;
      case 'row-reverse':    value = node.style.borderRightWidth;  break;
      case 'column':         value = node.style.borderTopWidth;    break;
      case 'column-reverse': value = node.style.borderBottomWidth; break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getTrailingBorder(node, axis) {
    if (node.style.borderEndWidth !== undefined && node.style.borderEndWidth >= 0
        && isRowDirection(axis)) {
      return node.style.borderEndWidth;
    }

    var value = null;
    switch (axis) {
      case 'row':            value = node.style.borderRightWidth;  break;
      case 'row-reverse':    value = node.style.borderLeftWidth;   break;
      case 'column':         value = node.style.borderBottomWidth; break;
      case 'column-reverse': value = node.style.borderTopWidth;    break;
    }

    if (value != null && value >= 0) {
      return value;
    }

    if (node.style.borderWidth !== undefined && node.style.borderWidth >= 0) {
      return node.style.borderWidth;
    }

    return 0;
  }

  function getLeadingPaddingAndBorder(node, axis) {
    return getLeadingPadding(node, axis) + getLeadingBorder(node, axis);
  }

  function getTrailingPaddingAndBorder(node, axis) {
    return getTrailingPadding(node, axis) + getTrailingBorder(node, axis);
  }

  function getBorderAxis(node, axis) {
    return getLeadingBorder(node, axis) + getTrailingBorder(node, axis);
  }

  function getMarginAxis(node, axis) {
    return getLeadingMargin(node, axis) + getTrailingMargin(node, axis);
  }

  function getPaddingAndBorderAxis(node, axis) {
    return getLeadingPaddingAndBorder(node, axis) +
        getTrailingPaddingAndBorder(node, axis);
  }

  function getJustifyContent(node) {
    if (node.style.justifyContent) {
      return node.style.justifyContent;
    }
    return 'flex-start';
  }

  function getAlignContent(node) {
    if (node.style.alignContent) {
      return node.style.alignContent;
    }
    return 'flex-start';
  }

  function getAlignItem(node, child) {
    if (child.style.alignSelf) {
      return child.style.alignSelf;
    }
    if (node.style.alignItems) {
      return node.style.alignItems;
    }
    return 'stretch';
  }

  function resolveAxis(axis, direction) {
    if (direction === CSS_DIRECTION_RTL) {
      if (axis === CSS_FLEX_DIRECTION_ROW) {
        return CSS_FLEX_DIRECTION_ROW_REVERSE;
      } else if (axis === CSS_FLEX_DIRECTION_ROW_REVERSE) {
        return CSS_FLEX_DIRECTION_ROW;
      }
    }

    return axis;
  }

  function resolveDirection(node, parentDirection) {
    var direction;
    if (node.style.direction) {
      direction = node.style.direction;
    } else {
      direction = CSS_DIRECTION_INHERIT;
    }

    if (direction === CSS_DIRECTION_INHERIT) {
      direction = (parentDirection === undefined ? CSS_DIRECTION_LTR : parentDirection);
    }

    return direction;
  }

  function getFlexDirection(node) {
    if (node.style.flexDirection) {
      return node.style.flexDirection;
    }
    return CSS_FLEX_DIRECTION_COLUMN;
  }

  function getCrossFlexDirection(flexDirection, direction) {
    if (isColumnDirection(flexDirection)) {
      return resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);
    } else {
      return CSS_FLEX_DIRECTION_COLUMN;
    }
  }

  function getPositionType(node) {
    if (node.style.position) {
      return node.style.position;
    }
    return 'relative';
  }

  function isFlex(node) {
    return (
      getPositionType(node) === CSS_POSITION_RELATIVE &&
      node.style.flex > 0
    );
  }

  function isFlexWrap(node) {
    return node.style.flexWrap === 'wrap';
  }

  function getDimWithMargin(node, axis) {
    return node.layout[dim[axis]] + getMarginAxis(node, axis);
  }

  function isDimDefined(node, axis) {
    return node.style[dim[axis]] !== undefined && node.style[dim[axis]] >= 0;
  }

  function isPosDefined(node, pos) {
    return node.style[pos] !== undefined;
  }

  function isMeasureDefined(node) {
    return node.style.measure !== undefined;
  }

  function getPosition(node, pos) {
    if (node.style[pos] !== undefined) {
      return node.style[pos];
    }
    return 0;
  }

  function boundAxis(node, axis, value) {
    var min = {
      'row': node.style.minWidth,
      'row-reverse': node.style.minWidth,
      'column': node.style.minHeight,
      'column-reverse': node.style.minHeight
    }[axis];

    var max = {
      'row': node.style.maxWidth,
      'row-reverse': node.style.maxWidth,
      'column': node.style.maxHeight,
      'column-reverse': node.style.maxHeight
    }[axis];

    var boundValue = value;
    if (max !== undefined && max >= 0 && boundValue > max) {
      boundValue = max;
    }
    if (min !== undefined && min >= 0 && boundValue < min) {
      boundValue = min;
    }
    return boundValue;
  }

  function fmaxf(a, b) {
    if (a > b) {
      return a;
    }
    return b;
  }

  // When the user specifically sets a value for width or height
  function setDimensionFromStyle(node, axis) {
    // The parent already computed us a width or height. We just skip it
    if (node.layout[dim[axis]] !== undefined) {
      return;
    }
    // We only run if there's a width or height defined
    if (!isDimDefined(node, axis)) {
      return;
    }

    // The dimensions can never be smaller than the padding and border
    node.layout[dim[axis]] = fmaxf(
      boundAxis(node, axis, node.style[dim[axis]]),
      getPaddingAndBorderAxis(node, axis)
    );
  }

  function setTrailingPosition(node, child, axis) {
    child.layout[trailing[axis]] = node.layout[dim[axis]] -
        child.layout[dim[axis]] - child.layout[pos[axis]];
  }

  // If both left and right are defined, then use left. Otherwise return
  // +left or -right depending on which is defined.
  function getRelativePosition(node, axis) {
    if (node.style[leading[axis]] !== undefined) {
      return getPosition(node, leading[axis]);
    }
    return -getPosition(node, trailing[axis]);
  }

  function layoutNodeImpl(node, parentMaxWidth, /*css_direction_t*/parentDirection) {
    var/*css_direction_t*/ direction = resolveDirection(node, parentDirection);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ mainAxis = resolveAxis(getFlexDirection(node), direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ crossAxis = getCrossFlexDirection(mainAxis, direction);
    var/*(c)!css_flex_direction_t*//*(java)!int*/ resolvedRowAxis = resolveAxis(CSS_FLEX_DIRECTION_ROW, direction);

    // Handle width and height style attributes
    setDimensionFromStyle(node, mainAxis);
    setDimensionFromStyle(node, crossAxis);

    // Set the resolved resolution in the node's layout
    node.layout.direction = direction;

    // The position is set by the parent, but we need to complete it with a
    // delta composed of the margin and left/top/right/bottom
    node.layout[leading[mainAxis]] += getLeadingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[trailing[mainAxis]] += getTrailingMargin(node, mainAxis) +
      getRelativePosition(node, mainAxis);
    node.layout[leading[crossAxis]] += getLeadingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);
    node.layout[trailing[crossAxis]] += getTrailingMargin(node, crossAxis) +
      getRelativePosition(node, crossAxis);

    // Inline immutable values from the target node to avoid excessive method
    // invocations during the layout calculation.
    var/*int*/ childCount = node.children.length;
    var/*float*/ paddingAndBorderAxisResolvedRow = getPaddingAndBorderAxis(node, resolvedRowAxis);

    if (isMeasureDefined(node)) {
      var/*bool*/ isResolvedRowDimDefined = !isUndefined(node.layout[dim[resolvedRowAxis]]);

      var/*float*/ width = CSS_UNDEFINED;
      if (isDimDefined(node, resolvedRowAxis)) {
        width = node.style.width;
      } else if (isResolvedRowDimDefined) {
        width = node.layout[dim[resolvedRowAxis]];
      } else {
        width = parentMaxWidth -
          getMarginAxis(node, resolvedRowAxis);
      }
      width -= paddingAndBorderAxisResolvedRow;

      // We only need to give a dimension for the text if we haven't got any
      // for it computed yet. It can either be from the style attribute or because
      // the element is flexible.
      var/*bool*/ isRowUndefined = !isDimDefined(node, resolvedRowAxis) && !isResolvedRowDimDefined;
      var/*bool*/ isColumnUndefined = !isDimDefined(node, CSS_FLEX_DIRECTION_COLUMN) &&
        isUndefined(node.layout[dim[CSS_FLEX_DIRECTION_COLUMN]]);

      // Let's not measure the text if we already know both dimensions
      if (isRowUndefined || isColumnUndefined) {
        var/*css_dim_t*/ measureDim = node.style.measure(
          /*(c)!node->context,*/
          /*(java)!layoutContext.measureOutput,*/
          width
        );
        if (isRowUndefined) {
          node.layout.width = measureDim.width +
            paddingAndBorderAxisResolvedRow;
        }
        if (isColumnUndefined) {
          node.layout.height = measureDim.height +
            getPaddingAndBorderAxis(node, CSS_FLEX_DIRECTION_COLUMN);
        }
      }
      if (childCount === 0) {
        return;
      }
    }

    var/*bool*/ isNodeFlexWrap = isFlexWrap(node);

    var/*css_justify_t*/ justifyContent = getJustifyContent(node);

    var/*float*/ leadingPaddingAndBorderMain = getLeadingPaddingAndBorder(node, mainAxis);
    var/*float*/ leadingPaddingAndBorderCross = getLeadingPaddingAndBorder(node, crossAxis);
    var/*float*/ paddingAndBorderAxisMain = getPaddingAndBorderAxis(node, mainAxis);
    var/*float*/ paddingAndBorderAxisCross = getPaddingAndBorderAxis(node, crossAxis);

    var/*bool*/ isMainDimDefined = !isUndefined(node.layout[dim[mainAxis]]);
    var/*bool*/ isCrossDimDefined = !isUndefined(node.layout[dim[crossAxis]]);
    var/*bool*/ isMainRowDirection = isRowDirection(mainAxis);

    var/*int*/ i;
    var/*int*/ ii;
    var/*css_node_t**/ child;
    var/*(c)!css_flex_direction_t*//*(java)!int*/ axis;

    var/*css_node_t**/ firstAbsoluteChild = null;
    var/*css_node_t**/ currentAbsoluteChild = null;

    var/*float*/ definedMainDim = CSS_UNDEFINED;
    if (isMainDimDefined) {
      definedMainDim = node.layout[dim[mainAxis]] - paddingAndBorderAxisMain;
    }

    // We want to execute the next two loops one per line with flex-wrap
    var/*int*/ startLine = 0;
    var/*int*/ endLine = 0;
    // var/*int*/ nextOffset = 0;
    var/*int*/ alreadyComputedNextLayout = 0;
    // We aggregate the total dimensions of the container in those two variables
    var/*float*/ linesCrossDim = 0;
    var/*float*/ linesMainDim = 0;
    var/*int*/ linesCount = 0;
    while (endLine < childCount) {
      // <Loop A> Layout non flexible children and count children by type

      // mainContentDim is accumulation of the dimensions and margin of all the
      // non flexible children. This will be used in order to either set the
      // dimensions of the node if none already exist, or to compute the
      // remaining space left for the flexible children.
      var/*float*/ mainContentDim = 0;

      // There are three kind of children, non flexible, flexible and absolute.
      // We need to know how many there are in order to distribute the space.
      var/*int*/ flexibleChildrenCount = 0;
      var/*float*/ totalFlexible = 0;
      var/*int*/ nonFlexibleChildrenCount = 0;

      // Use the line loop to position children in the main axis for as long
      // as they are using a simple stacking behaviour. Children that are
      // immediately stacked in the initial loop will not be touched again
      // in <Loop C>.
      var/*bool*/ isSimpleStackMain =
          (isMainDimDefined && justifyContent === CSS_JUSTIFY_FLEX_START) ||
          (!isMainDimDefined && justifyContent !== CSS_JUSTIFY_CENTER);
      var/*int*/ firstComplexMain = (isSimpleStackMain ? childCount : startLine);

      // Use the initial line loop to position children in the cross axis for
      // as long as they are relatively positioned with alignment STRETCH or
      // FLEX_START. Children that are immediately stacked in the initial loop
      // will not be touched again in <Loop D>.
      var/*bool*/ isSimpleStackCross = true;
      var/*int*/ firstComplexCross = childCount;

      var/*css_node_t**/ firstFlexChild = null;
      var/*css_node_t**/ currentFlexChild = null;

      var/*float*/ mainDim = leadingPaddingAndBorderMain;
      var/*float*/ crossDim = 0;

      var/*float*/ maxWidth;
      for (i = startLine; i < childCount; ++i) {
        child = node.children[i];
        child.lineIndex = linesCount;

        child.nextAbsoluteChild = null;
        child.nextFlexChild = null;

        var/*css_align_t*/ alignItem = getAlignItem(node, child);

        // Pre-fill cross axis dimensions when the child is using stretch before
        // we call the recursive layout pass
        if (alignItem === CSS_ALIGN_STRETCH &&
            getPositionType(child) === CSS_POSITION_RELATIVE &&
            isCrossDimDefined &&
            !isDimDefined(child, crossAxis)) {
          child.layout[dim[crossAxis]] = fmaxf(
            boundAxis(child, crossAxis, node.layout[dim[crossAxis]] -
              paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(child, crossAxis)
          );
        } else if (getPositionType(child) === CSS_POSITION_ABSOLUTE) {
          // Store a private linked list of absolutely positioned children
          // so that we can efficiently traverse them later.
          if (firstAbsoluteChild === null) {
            firstAbsoluteChild = child;
          }
          if (currentAbsoluteChild !== null) {
            currentAbsoluteChild.nextAbsoluteChild = child;
          }
          currentAbsoluteChild = child;

          // Pre-fill dimensions when using absolute position and both offsets for the axis are defined (either both
          // left and right or top and bottom).
          for (ii = 0; ii < 2; ii++) {
            axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;
            if (!isUndefined(node.layout[dim[axis]]) &&
                !isDimDefined(child, axis) &&
                isPosDefined(child, leading[axis]) &&
                isPosDefined(child, trailing[axis])) {
              child.layout[dim[axis]] = fmaxf(
                boundAxis(child, axis, node.layout[dim[axis]] -
                  getPaddingAndBorderAxis(node, axis) -
                  getMarginAxis(child, axis) -
                  getPosition(child, leading[axis]) -
                  getPosition(child, trailing[axis])),
                // You never want to go smaller than padding
                getPaddingAndBorderAxis(child, axis)
              );
            }
          }
        }

        var/*float*/ nextContentDim = 0;

        // It only makes sense to consider a child flexible if we have a computed
        // dimension for the node.
        if (isMainDimDefined && isFlex(child)) {
          flexibleChildrenCount++;
          totalFlexible += child.style.flex;

          // Store a private linked list of flexible children so that we can
          // efficiently traverse them later.
          if (firstFlexChild === null) {
            firstFlexChild = child;
          }
          if (currentFlexChild !== null) {
            currentFlexChild.nextFlexChild = child;
          }
          currentFlexChild = child;

          // Even if we don't know its exact size yet, we already know the padding,
          // border and margin. We'll use this partial information, which represents
          // the smallest possible size for the child, to compute the remaining
          // available space.
          nextContentDim = getPaddingAndBorderAxis(child, mainAxis) +
            getMarginAxis(child, mainAxis);

        } else {
          maxWidth = CSS_UNDEFINED;
          if (!isMainRowDirection) {
            if (isDimDefined(node, resolvedRowAxis)) {
              maxWidth = node.layout[dim[resolvedRowAxis]] -
                paddingAndBorderAxisResolvedRow;
            } else {
              maxWidth = parentMaxWidth -
                getMarginAxis(node, resolvedRowAxis) -
                paddingAndBorderAxisResolvedRow;
            }
          }

          // This is the main recursive call. We layout non flexible children.
          if (alreadyComputedNextLayout === 0) {
            layoutNode(/*(java)!layoutContext, */child, maxWidth, direction);
          }

          // Absolute positioned elements do not take part of the layout, so we
          // don't use them to compute mainContentDim
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            nonFlexibleChildrenCount++;
            // At this point we know the final size and margin of the element.
            nextContentDim = getDimWithMargin(child, mainAxis);
          }
        }

        // The element we are about to add would make us go to the next line
        if (isNodeFlexWrap &&
            isMainDimDefined &&
            mainContentDim + nextContentDim > definedMainDim &&
            // If there's only one element, then it's bigger than the content
            // and needs its own line
            i !== startLine) {
          nonFlexibleChildrenCount--;
          alreadyComputedNextLayout = 1;
          break;
        }

        // Disable simple stacking in the main axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop C>.
        if (isSimpleStackMain &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE || isFlex(child))) {
          isSimpleStackMain = false;
          firstComplexMain = i;
        }

        // Disable simple stacking in the cross axis for the current line as
        // we found a non-trivial child. The remaining children will be laid out
        // in <Loop D>.
        if (isSimpleStackCross &&
            (getPositionType(child) !== CSS_POSITION_RELATIVE ||
                (alignItem !== CSS_ALIGN_STRETCH && alignItem !== CSS_ALIGN_FLEX_START) ||
                isUndefined(child.layout[dim[crossAxis]]))) {
          isSimpleStackCross = false;
          firstComplexCross = i;
        }

        if (isSimpleStackMain) {
          child.layout[pos[mainAxis]] += mainDim;
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          mainDim += getDimWithMargin(child, mainAxis);
          crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
        }

        if (isSimpleStackCross) {
          child.layout[pos[crossAxis]] += linesCrossDim + leadingPaddingAndBorderCross;
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }

        alreadyComputedNextLayout = 0;
        mainContentDim += nextContentDim;
        endLine = i + 1;
      }

      // <Loop B> Layout flexible children and allocate empty space

      // In order to position the elements in the main axis, we have two
      // controls. The space between the beginning and the first element
      // and the space between each two elements.
      var/*float*/ leadingMainDim = 0;
      var/*float*/ betweenMainDim = 0;

      // The remaining available space that needs to be allocated
      var/*float*/ remainingMainDim = 0;
      if (isMainDimDefined) {
        remainingMainDim = definedMainDim - mainContentDim;
      } else {
        remainingMainDim = fmaxf(mainContentDim, 0) - mainContentDim;
      }

      // If there are flexible children in the mix, they are going to fill the
      // remaining space
      if (flexibleChildrenCount !== 0) {
        var/*float*/ flexibleMainDim = remainingMainDim / totalFlexible;
        var/*float*/ baseMainDim;
        var/*float*/ boundMainDim;

        // If the flex share of remaining space doesn't meet min/max bounds,
        // remove this child from flex calculations.
        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          baseMainDim = flexibleMainDim * currentFlexChild.style.flex +
              getPaddingAndBorderAxis(currentFlexChild, mainAxis);
          boundMainDim = boundAxis(currentFlexChild, mainAxis, baseMainDim);

          if (baseMainDim !== boundMainDim) {
            remainingMainDim -= boundMainDim;
            totalFlexible -= currentFlexChild.style.flex;
          }

          currentFlexChild = currentFlexChild.nextFlexChild;
        }
        flexibleMainDim = remainingMainDim / totalFlexible;

        // The non flexible children can overflow the container, in this case
        // we should just assume that there is no space available.
        if (flexibleMainDim < 0) {
          flexibleMainDim = 0;
        }

        currentFlexChild = firstFlexChild;
        while (currentFlexChild !== null) {
          // At this point we know the final size of the element in the main
          // dimension
          currentFlexChild.layout[dim[mainAxis]] = boundAxis(currentFlexChild, mainAxis,
            flexibleMainDim * currentFlexChild.style.flex +
                getPaddingAndBorderAxis(currentFlexChild, mainAxis)
          );

          maxWidth = CSS_UNDEFINED;
          if (isDimDefined(node, resolvedRowAxis)) {
            maxWidth = node.layout[dim[resolvedRowAxis]] -
              paddingAndBorderAxisResolvedRow;
          } else if (!isMainRowDirection) {
            maxWidth = parentMaxWidth -
              getMarginAxis(node, resolvedRowAxis) -
              paddingAndBorderAxisResolvedRow;
          }

          // And we recursively call the layout algorithm for this child
          layoutNode(/*(java)!layoutContext, */currentFlexChild, maxWidth, direction);

          child = currentFlexChild;
          currentFlexChild = currentFlexChild.nextFlexChild;
          child.nextFlexChild = null;
        }

      // We use justifyContent to figure out how to allocate the remaining
      // space available
      } else if (justifyContent !== CSS_JUSTIFY_FLEX_START) {
        if (justifyContent === CSS_JUSTIFY_CENTER) {
          leadingMainDim = remainingMainDim / 2;
        } else if (justifyContent === CSS_JUSTIFY_FLEX_END) {
          leadingMainDim = remainingMainDim;
        } else if (justifyContent === CSS_JUSTIFY_SPACE_BETWEEN) {
          remainingMainDim = fmaxf(remainingMainDim, 0);
          if (flexibleChildrenCount + nonFlexibleChildrenCount - 1 !== 0) {
            betweenMainDim = remainingMainDim /
              (flexibleChildrenCount + nonFlexibleChildrenCount - 1);
          } else {
            betweenMainDim = 0;
          }
        } else if (justifyContent === CSS_JUSTIFY_SPACE_AROUND) {
          // Space on the edges is half of the space between elements
          betweenMainDim = remainingMainDim /
            (flexibleChildrenCount + nonFlexibleChildrenCount);
          leadingMainDim = betweenMainDim / 2;
        }
      }

      // <Loop C> Position elements in the main axis and compute dimensions

      // At this point, all the children have their dimensions set. We need to
      // find their position. In order to do that, we accumulate data in
      // variables that are also useful to compute the total dimensions of the
      // container!
      mainDim += leadingMainDim;

      for (i = firstComplexMain; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[mainAxis])) {
          // In case the child is position absolute and has left/top being
          // defined, we override the position to whatever the user said
          // (and margin/border).
          child.layout[pos[mainAxis]] = getPosition(child, leading[mainAxis]) +
            getLeadingBorder(node, mainAxis) +
            getLeadingMargin(child, mainAxis);
        } else {
          // If the child is position absolute (without top/left) or relative,
          // we put it at the current accumulated offset.
          child.layout[pos[mainAxis]] += mainDim;

          // Define the trailing position accordingly.
          if (isMainDimDefined) {
            setTrailingPosition(node, child, mainAxis);
          }

          // Now that we placed the element, we need to update the variables
          // We only need to do that for relative elements. Absolute elements
          // do not take part in that phase.
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            // The main dimension is the sum of all the elements dimension plus
            // the spacing.
            mainDim += betweenMainDim + getDimWithMargin(child, mainAxis);
            // The cross dimension is the max of the elements dimension since there
            // can only be one element in that cross dimension.
            crossDim = fmaxf(crossDim, boundAxis(child, crossAxis, getDimWithMargin(child, crossAxis)));
          }
        }
      }

      var/*float*/ containerCrossAxis = node.layout[dim[crossAxis]];
      if (!isCrossDimDefined) {
        containerCrossAxis = fmaxf(
          // For the cross dim, we add both sides at the end because the value
          // is aggregate via a max function. Intermediate negative values
          // can mess this computation otherwise
          boundAxis(node, crossAxis, crossDim + paddingAndBorderAxisCross),
          paddingAndBorderAxisCross
        );
      }

      // <Loop D> Position elements in the cross axis
      for (i = firstComplexCross; i < endLine; ++i) {
        child = node.children[i];

        if (getPositionType(child) === CSS_POSITION_ABSOLUTE &&
            isPosDefined(child, leading[crossAxis])) {
          // In case the child is absolutely positionned and has a
          // top/left/bottom/right being set, we override all the previously
          // computed positions to set it correctly.
          child.layout[pos[crossAxis]] = getPosition(child, leading[crossAxis]) +
            getLeadingBorder(node, crossAxis) +
            getLeadingMargin(child, crossAxis);

        } else {
          var/*float*/ leadingCrossDim = leadingPaddingAndBorderCross;

          // For a relative children, we're either using alignItems (parent) or
          // alignSelf (child) in order to determine the position in the cross axis
          if (getPositionType(child) === CSS_POSITION_RELATIVE) {
            /*eslint-disable */
            // This variable is intentionally re-defined as the code is transpiled to a block scope language
            var/*css_align_t*/ alignItem = getAlignItem(node, child);
            /*eslint-enable */
            if (alignItem === CSS_ALIGN_STRETCH) {
              // You can only stretch if the dimension has not already been set
              // previously.
              if (isUndefined(child.layout[dim[crossAxis]])) {
                child.layout[dim[crossAxis]] = fmaxf(
                  boundAxis(child, crossAxis, containerCrossAxis -
                    paddingAndBorderAxisCross - getMarginAxis(child, crossAxis)),
                  // You never want to go smaller than padding
                  getPaddingAndBorderAxis(child, crossAxis)
                );
              }
            } else if (alignItem !== CSS_ALIGN_FLEX_START) {
              // The remaining space between the parent dimensions+padding and child
              // dimensions+margin.
              var/*float*/ remainingCrossDim = containerCrossAxis -
                paddingAndBorderAxisCross - getDimWithMargin(child, crossAxis);

              if (alignItem === CSS_ALIGN_CENTER) {
                leadingCrossDim += remainingCrossDim / 2;
              } else { // CSS_ALIGN_FLEX_END
                leadingCrossDim += remainingCrossDim;
              }
            }
          }

          // And we apply the position
          child.layout[pos[crossAxis]] += linesCrossDim + leadingCrossDim;

          // Define the trailing position accordingly.
          if (isCrossDimDefined) {
            setTrailingPosition(node, child, crossAxis);
          }
        }
      }

      linesCrossDim += crossDim;
      linesMainDim = fmaxf(linesMainDim, mainDim);
      linesCount += 1;
      startLine = endLine;
    }

    // <Loop E>
    //
    // Note(prenaux): More than one line, we need to layout the crossAxis
    // according to alignContent.
    //
    // Note that we could probably remove <Loop D> and handle the one line case
    // here too, but for the moment this is safer since it won't interfere with
    // previously working code.
    //
    // See specs:
    // http://www.w3.org/TR/2012/CR-css3-flexbox-20120918/#layout-algorithm
    // section 9.4
    //
    if (linesCount > 1 && isCrossDimDefined) {
      var/*float*/ nodeCrossAxisInnerSize = node.layout[dim[crossAxis]] -
          paddingAndBorderAxisCross;
      var/*float*/ remainingAlignContentDim = nodeCrossAxisInnerSize - linesCrossDim;

      var/*float*/ crossDimLead = 0;
      var/*float*/ currentLead = leadingPaddingAndBorderCross;

      var/*css_align_t*/ alignContent = getAlignContent(node);
      if (alignContent === CSS_ALIGN_FLEX_END) {
        currentLead += remainingAlignContentDim;
      } else if (alignContent === CSS_ALIGN_CENTER) {
        currentLead += remainingAlignContentDim / 2;
      } else if (alignContent === CSS_ALIGN_STRETCH) {
        if (nodeCrossAxisInnerSize > linesCrossDim) {
          crossDimLead = (remainingAlignContentDim / linesCount);
        }
      }

      var/*int*/ endIndex = 0;
      for (i = 0; i < linesCount; ++i) {
        var/*int*/ startIndex = endIndex;

        // compute the line's height and find the endIndex
        var/*float*/ lineHeight = 0;
        for (ii = startIndex; ii < childCount; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }
          if (child.lineIndex !== i) {
            break;
          }
          if (!isUndefined(child.layout[dim[crossAxis]])) {
            lineHeight = fmaxf(
              lineHeight,
              child.layout[dim[crossAxis]] + getMarginAxis(child, crossAxis)
            );
          }
        }
        endIndex = ii;
        lineHeight += crossDimLead;

        for (ii = startIndex; ii < endIndex; ++ii) {
          child = node.children[ii];
          if (getPositionType(child) !== CSS_POSITION_RELATIVE) {
            continue;
          }

          var/*css_align_t*/ alignContentAlignItem = getAlignItem(node, child);
          if (alignContentAlignItem === CSS_ALIGN_FLEX_START) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
          } else if (alignContentAlignItem === CSS_ALIGN_FLEX_END) {
            child.layout[pos[crossAxis]] = currentLead + lineHeight - getTrailingMargin(child, crossAxis) - child.layout[dim[crossAxis]];
          } else if (alignContentAlignItem === CSS_ALIGN_CENTER) {
            var/*float*/ childHeight = child.layout[dim[crossAxis]];
            child.layout[pos[crossAxis]] = currentLead + (lineHeight - childHeight) / 2;
          } else if (alignContentAlignItem === CSS_ALIGN_STRETCH) {
            child.layout[pos[crossAxis]] = currentLead + getLeadingMargin(child, crossAxis);
            // TODO(prenaux): Correctly set the height of items with undefined
            //                (auto) crossAxis dimension.
          }
        }

        currentLead += lineHeight;
      }
    }

    var/*bool*/ needsMainTrailingPos = false;
    var/*bool*/ needsCrossTrailingPos = false;

    // If the user didn't specify a width or height, and it has not been set
    // by the container, then we set it via the children.
    if (!isMainDimDefined) {
      node.layout[dim[mainAxis]] = fmaxf(
        // We're missing the last padding at this point to get the final
        // dimension
        boundAxis(node, mainAxis, linesMainDim + getTrailingPaddingAndBorder(node, mainAxis)),
        // We can never assign a width smaller than the padding and borders
        paddingAndBorderAxisMain
      );

      if (mainAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          mainAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsMainTrailingPos = true;
      }
    }

    if (!isCrossDimDefined) {
      node.layout[dim[crossAxis]] = fmaxf(
        // For the cross dim, we add both sides at the end because the value
        // is aggregate via a max function. Intermediate negative values
        // can mess this computation otherwise
        boundAxis(node, crossAxis, linesCrossDim + paddingAndBorderAxisCross),
        paddingAndBorderAxisCross
      );

      if (crossAxis === CSS_FLEX_DIRECTION_ROW_REVERSE ||
          crossAxis === CSS_FLEX_DIRECTION_COLUMN_REVERSE) {
        needsCrossTrailingPos = true;
      }
    }

    // <Loop F> Set trailing position if necessary
    if (needsMainTrailingPos || needsCrossTrailingPos) {
      for (i = 0; i < childCount; ++i) {
        child = node.children[i];

        if (needsMainTrailingPos) {
          setTrailingPosition(node, child, mainAxis);
        }

        if (needsCrossTrailingPos) {
          setTrailingPosition(node, child, crossAxis);
        }
      }
    }

    // <Loop G> Calculate dimensions for absolutely positioned elements
    currentAbsoluteChild = firstAbsoluteChild;
    while (currentAbsoluteChild !== null) {
      // Pre-fill dimensions when using absolute position and both offsets for
      // the axis are defined (either both left and right or top and bottom).
      for (ii = 0; ii < 2; ii++) {
        axis = (ii !== 0) ? CSS_FLEX_DIRECTION_ROW : CSS_FLEX_DIRECTION_COLUMN;

        if (!isUndefined(node.layout[dim[axis]]) &&
            !isDimDefined(currentAbsoluteChild, axis) &&
            isPosDefined(currentAbsoluteChild, leading[axis]) &&
            isPosDefined(currentAbsoluteChild, trailing[axis])) {
          currentAbsoluteChild.layout[dim[axis]] = fmaxf(
            boundAxis(currentAbsoluteChild, axis, node.layout[dim[axis]] -
              getBorderAxis(node, axis) -
              getMarginAxis(currentAbsoluteChild, axis) -
              getPosition(currentAbsoluteChild, leading[axis]) -
              getPosition(currentAbsoluteChild, trailing[axis])
            ),
            // You never want to go smaller than padding
            getPaddingAndBorderAxis(currentAbsoluteChild, axis)
          );
        }

        if (isPosDefined(currentAbsoluteChild, trailing[axis]) &&
            !isPosDefined(currentAbsoluteChild, leading[axis])) {
          currentAbsoluteChild.layout[leading[axis]] =
            node.layout[dim[axis]] -
            currentAbsoluteChild.layout[dim[axis]] -
            getPosition(currentAbsoluteChild, trailing[axis]);
        }
      }

      child = currentAbsoluteChild;
      currentAbsoluteChild = currentAbsoluteChild.nextAbsoluteChild;
      child.nextAbsoluteChild = null;
    }
  }

  function layoutNode(node, parentMaxWidth, parentDirection) {
    node.shouldUpdate = true;

    var direction = node.style.direction || CSS_DIRECTION_LTR;
    var skipLayout =
      !node.isDirty &&
      node.lastLayout &&
      node.lastLayout.requestedHeight === node.layout.height &&
      node.lastLayout.requestedWidth === node.layout.width &&
      node.lastLayout.parentMaxWidth === parentMaxWidth &&
      node.lastLayout.direction === direction;

    if (skipLayout) {
      node.layout.width = node.lastLayout.width;
      node.layout.height = node.lastLayout.height;
      node.layout.top = node.lastLayout.top;
      node.layout.left = node.lastLayout.left;
    } else {
      if (!node.lastLayout) {
        node.lastLayout = {};
      }

      node.lastLayout.requestedWidth = node.layout.width;
      node.lastLayout.requestedHeight = node.layout.height;
      node.lastLayout.parentMaxWidth = parentMaxWidth;
      node.lastLayout.direction = direction;

      // Reset child layouts
      node.children.forEach(function(child) {
        child.layout.width = undefined;
        child.layout.height = undefined;
        child.layout.top = 0;
        child.layout.left = 0;
      });

      layoutNodeImpl(node, parentMaxWidth, parentDirection);

      node.lastLayout.width = node.layout.width;
      node.lastLayout.height = node.layout.height;
      node.lastLayout.top = node.layout.top;
      node.lastLayout.left = node.layout.left;
    }
  }

  return {
    layoutNodeImpl: layoutNodeImpl,
    computeLayout: layoutNode,
    fillNodes: fillNodes
  };
})();

// This module export is only used for the purposes of unit testing this file. When
// the library is packaged this file is included within css-layout.js which forms
// the public API.
if (true) {
  module.exports = computeLayout;
}


  return function(node) {
    /*eslint-disable */
    // disabling ESLint because this code relies on the above include
    computeLayout.fillNodes(node);
    computeLayout.computeLayout(node);
    /*eslint-enable */
  };
}));


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "throttle", function() { return throttle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "none", function() { return none; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isClick", function() { return isClick; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createCanvas", function() { return createCanvas; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createImage", function() { return createImage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getDpr", function() { return getDpr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "STATE", function() { return STATE; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "repaintChildren", function() { return repaintChildren; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "repaintTree", function() { return repaintTree; });
function throttle(fn, threshhold, scope) {
  threshhold || (threshhold = 250);
  var last, deferTimer;
  return function () {
    var context = scope || this;
    var now = +new Date(),
        args = arguments;

    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}
/* istanbul ignore next */

function none() {}
/**
 * 根据触摸时长和触摸位置变化来判断是否属于点击事件
 */

function isClick(touchMsg) {
  var start = touchMsg.touchstart;
  var end = touchMsg.touchend;

  if (!start || !end || !start.timeStamp || !end.timeStamp || start.pageX === undefined || start.pageY === undefined || end.pageX === undefined || end.pageY === undefined) {
    return false;
  }

  var startPosX = start.pageX;
  var startPosY = start.pageY;
  var endPosX = end.pageX;
  var endPosY = end.pageY;
  var touchTimes = end.timeStamp - start.timeStamp;
  return !!(Math.abs(endPosY - startPosY) < 30 && Math.abs(endPosX - startPosX) < 30 && touchTimes < 300);
}
function createCanvas() {
  /* istanbul ignore if*/
  if (typeof __env !== "undefined") {
    return __env.createCanvas();
  } else {
    return document.createElement('canvas');
  }
}
function createImage() {
  /* istanbul ignore if*/
  if (typeof __env !== "undefined") {
    return __env.createImage();
  } else {
    return document.createElement('img');
  }
}

var _dpr; // only Baidu platform need to recieve system info from main context


if (typeof swan !== 'undefined') {
  __env.onMessage(function (res) {
    if (res && res.type === 'engine') {
      if (res.event === 'systemInfo') {
        _dpr = res.systemInfo.devicePixelRatio;
      }
    }
  });
}

function getDpr() {
  if (typeof _dpr !== 'undefined') {
    return _dpr;
  }

  if (typeof __env !== "undefined" && __env.getSystemInfoSync) {
    _dpr = __env.getSystemInfoSync().devicePixelRatio;
  } else {
    console.warn('failed to access device pixel ratio, fallback to 1');
    _dpr = 1;
  }

  return _dpr;
}
var STATE = {
  "UNINIT": "UNINIT",
  "INITED": "INITED",
  "RENDERED": "RENDERED",
  "CLEAR": "CLEAR"
};
var repaintChildren = function repaintChildren(children) {
  children.forEach(function (child) {
    child.repaint();
    repaintChildren(child.children);
  });
};
var repaintTree = function repaintTree(tree) {
  tree.repaint();
  tree.children.forEach(function (child) {
    child.repaint();
    repaintTree(child);
  });
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var nodeToJson = __webpack_require__(9);

var xmlToNodeobj = __webpack_require__(11);

var x2xmlnode = __webpack_require__(11);

var buildOptions = __webpack_require__(10).buildOptions;

var validator = __webpack_require__(13);

exports.parse = function (xmlData, options, validationOption) {
  if (validationOption) {
    if (validationOption === true) validationOption = {};
    var result = validator.validate(xmlData, validationOption);

    if (result !== true) {
      throw Error(result.err.msg);
    }
  }

  options = buildOptions(options, x2xmlnode.defaultOptions, x2xmlnode.props);
  return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(10);

var convertToJson = function convertToJson(node, options) {
  var jObj = {
    name: node.tagname
  }; //when no child node or attr is present

  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) && !!node.val ? node.val : jObj;
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        if (options.arrayMode === "strict") {
          jObj[options.textNodeName] = [node.val];
        } else {
          jObj[options.textNodeName] = node.val;
        }
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);
  jObj.children = [];
  node.children.forEach(function (child) {
    jObj.children.push(convertToJson(child, options));
  }); // const keys = Object.keys(node.child);
  // for (let index = 0; index < keys.length; index++) {
  //   var tagname = keys[index];
  //   if (node.child[tagname] && node.child[tagname].length > 1) {
  //     jObj[tagname] = [];
  //     for (var tag in node.child[tagname]) {
  //       jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
  //     }
  //   } else {
  //     if(options.arrayMode === true){
  //       const result = convertToJson(node.child[tagname][0], options)
  //       if(typeof result === 'object')
  //         jObj[tagname] = [ result ];
  //       else
  //         jObj[tagname] = result;
  //     }else if(options.arrayMode === "strict"){
  //       jObj[tagname] = [convertToJson(node.child[tagname][0], options) ];
  //     }else{
  //       jObj[tagname] = convertToJson(node.child[tagname][0], options);
  //     }
  //   }
  // }
  //add value

  return jObj;
};

exports.convertToJson = convertToJson;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var getAllMatches = function getAllMatches(string, regex) {
  var matches = [];
  var match = regex.exec(string);

  while (match) {
    var allmatches = [];
    var len = match.length;

    for (var index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }

    matches.push(allmatches);
    match = regex.exec(string);
  }

  return matches;
};

var doesMatch = function doesMatch(string, regex) {
  var match = regex.exec(string);
  return !(match === null || typeof match === 'undefined');
};

var doesNotMatch = function doesNotMatch(string, regex) {
  return !doesMatch(string, regex);
};

exports.isExist = function (v) {
  return typeof v !== 'undefined';
};

exports.isEmptyObject = function (obj) {
  return Object.keys(obj).length === 0;
};
/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */


exports.merge = function (target, a, arrayMode) {
  if (a) {
    var keys = Object.keys(a); // will return an array of own properties

    var len = keys.length; //don't make it inline

    for (var i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [a[keys[i]]];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
};
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */


exports.getValue = function (v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
}; // const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};


exports.buildOptions = function (options, defaultOptions, props) {
  var newOptions = {};

  if (!options) {
    return defaultOptions; //if there are not options
  }

  for (var i = 0; i < props.length; i++) {
    if (options[props[i]] !== undefined) {
      newOptions[props[i]] = options[props[i]];
    } else {
      newOptions[props[i]] = defaultOptions[props[i]];
    }
  }

  return newOptions;
};

exports.doesMatch = doesMatch;
exports.doesNotMatch = doesNotMatch;
exports.getAllMatches = getAllMatches;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(10);

var buildOptions = __webpack_require__(10).buildOptions;

var xmlNode = __webpack_require__(12);

var TagType = {
  OPENING: 1,
  CLOSING: 2,
  SELF: 3,
  CDATA: 4
};
var regx = '<((!\\[CDATA\\[([\\s\\S]*?)(]]>))|(([\\w:\\-._]*:)?([\\w:\\-._]+))([^>]*)>|((\\/)(([\\w:\\-._]*:)?([\\w:\\-._]+))\\s*>))([^<]*)'; //const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");
//polyfill

if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}

if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}

var defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  localeRange: '',
  tagValueProcessor: function tagValueProcessor(a) {
    return a;
  },
  attrValueProcessor: function attrValueProcessor(a) {
    return a;
  },
  stopNodes: [] //decodeStrict: false,

};
exports.defaultOptions = defaultOptions;
var props = ['attributeNamePrefix', 'attrNodeName', 'textNodeName', 'ignoreAttributes', 'ignoreNameSpace', 'allowBooleanAttributes', 'parseNodeValue', 'parseAttributeValue', 'arrayMode', 'trimValues', 'cdataTagName', 'cdataPositionChar', 'localeRange', 'tagValueProcessor', 'attrValueProcessor', 'parseTrueNumberOnly', 'stopNodes'];
exports.props = props;

var getTraversalObj = function getTraversalObj(xmlData, options) {
  options = buildOptions(options, defaultOptions, props); //xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line

  xmlData = xmlData.replace(/<!--[\s\S]*?-->/g, ''); //Remove  comments

  var xmlObj = new xmlNode('!xml');
  var currentNode = xmlObj;
  regx = regx.replace(/\[\\w/g, '[' + options.localeRange + '\\w');
  var tagsRegx = new RegExp(regx, 'g');
  var tag = tagsRegx.exec(xmlData);
  var nextTag = tagsRegx.exec(xmlData);

  while (tag) {
    var tagType = checkForTagType(tag);

    if (tagType === TagType.CLOSING) {
      //add parsed data to parent node
      if (currentNode.parent && tag[14]) {
        currentNode.parent.val = util.getValue(currentNode.parent.val) + '' + processTagValue(tag, options, currentNode.parent.tagname);
      }

      if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
        currentNode.child = [];

        if (currentNode.attrsMap == undefined) {
          currentNode.attrsMap = {};
        }

        currentNode.val = xmlData.substr(currentNode.startIndex + 1, tag.index - currentNode.startIndex - 1);
      }

      currentNode = currentNode.parent;
    } else if (tagType === TagType.CDATA) {
      if (options.cdataTagName) {
        //add cdata node
        var childNode = new xmlNode(options.cdataTagName, currentNode, tag[3]);
        childNode.attrsMap = buildAttributesMap(tag[8], options);
        currentNode.addChild(childNode); //for backtracking

        currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar; //add rest value to parent node

        if (tag[14]) {
          currentNode.val += processTagValue(tag, options);
        }
      } else {
        currentNode.val = (currentNode.val || '') + (tag[3] || '') + processTagValue(tag, options);
      }
    } else if (tagType === TagType.SELF) {
      if (currentNode && tag[14]) {
        currentNode.val = util.getValue(currentNode.val) + '' + processTagValue(tag, options);
      }

      var _childNode = new xmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, '');

      if (tag[8] && tag[8].length > 0) {
        tag[8] = tag[8].substr(0, tag[8].length - 1);
      }

      _childNode.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode);
    } else {
      //TagType.OPENING
      var _childNode2 = new xmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, processTagValue(tag, options));

      if (options.stopNodes.length && options.stopNodes.includes(_childNode2.tagname)) {
        _childNode2.startIndex = tag.index + tag[1].length;
      }

      _childNode2.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode2);
      currentNode = _childNode2;
    }

    tag = nextTag;
    nextTag = tagsRegx.exec(xmlData);
  }

  return xmlObj;
};

function processTagValue(parsedTags, options, parentTagName) {
  var tagName = parsedTags[7] || parentTagName;
  var val = parsedTags[14];

  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }

    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function checkForTagType(match) {
  if (match[4] === ']]>') {
    return TagType.CDATA;
  } else if (match[10] === '/') {
    return TagType.CLOSING;
  } else if (typeof match[8] !== 'undefined' && match[8].substr(match[8].length - 1) === '/') {
    return TagType.SELF;
  } else {
    return TagType.OPENING;
  }
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    var tags = tagname.split(':');
    var prefix = tagname.charAt(0) === '/' ? '/' : '';

    if (tags[0] === 'xmlns') {
      return '';
    }

    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }

  return tagname;
}

function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    var parsed;

    if (val.trim() === '' || isNaN(val)) {
      parsed = val === 'true' ? true : val === 'false' ? false : val;
    } else {
      if (val.indexOf('0x') !== -1) {
        //support hexa decimal
        parsed = Number.parseInt(val, 16);
      } else if (val.indexOf('.') !== -1) {
        parsed = Number.parseFloat(val);
      } else {
        parsed = Number.parseInt(val, 10);
      }

      if (parseTrueNumberOnly) {
        parsed = String(parsed) === val ? parsed : val;
      }
    }

    return parsed;
  } else {
    if (util.isExist(val)) {
      return val;
    } else {
      return '';
    }
  }
} //TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");


var attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' '); //attrStr = attrStr || attrStr.trim();

    var matches = util.getAllMatches(attrStr, attrsRegx);
    var len = matches.length; //don't make it inline

    var attrs = {};

    for (var i = 0; i < len; i++) {
      var attrName = resolveNameSpace(matches[i][1], options);

      if (attrName.length) {
        if (matches[i][4] !== undefined) {
          if (options.trimValues) {
            matches[i][4] = matches[i][4].trim();
          }

          matches[i][4] = options.attrValueProcessor(matches[i][4], attrName);
          attrs[options.attributeNamePrefix + attrName] = parseValue(matches[i][4], options.parseAttributeValue, options.parseTrueNumberOnly);
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }

    if (!Object.keys(attrs).length) {
      return;
    }

    if (options.attrNodeName) {
      var attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }

    return attrs;
  }
}

exports.getTraversalObj = getTraversalObj;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (tagname, parent, val) {
  this.tagname = tagname;
  this.parent = parent;
  this.child = {}; //child tags

  this.attrsMap = {}; //attributes map

  this.children = [];
  this.val = val; //text only

  this.addChild = function (child) {
    this.children.push(child);

    if (Array.isArray(this.child[child.tagname])) {
      //already presents
      this.child[child.tagname].push(child);
    } else {
      this.child[child.tagname] = [child];
    }
  };
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(10);

var defaultOptions = {
  allowBooleanAttributes: false,
  //A tag can have attributes without any value
  localeRange: 'a-zA-Z'
};
var props = ['allowBooleanAttributes', 'localeRange']; //const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");

exports.validate = function (xmlData, options) {
  options = util.buildOptions(options, defaultOptions, props); //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE

  var tags = [];
  var tagFound = false;

  if (xmlData[0] === "\uFEFF") {
    // check for byte order mark (BOM)
    xmlData = xmlData.substr(1);
  }

  var regxAttrName = new RegExp('^[_w][\\w\\-.:]*$'.replace('_w', '_' + options.localeRange));
  var regxTagName = new RegExp('^([w]|_)[\\w.\\-_:]*'.replace('([w', '([' + options.localeRange));

  for (var i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === '<') {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value
      i++;

      if (xmlData[i] === '?') {
        i = readPI(xmlData, ++i);

        if (i.err) {
          return i;
        }
      } else if (xmlData[i] === '!') {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        var closingTag = false;

        if (xmlData[i] === '/') {
          //closing tag
          closingTag = true;
          i++;
        } //read tagname


        var tagName = '';

        for (; i < xmlData.length && xmlData[i] !== '>' && xmlData[i] !== ' ' && xmlData[i] !== '\t' && xmlData[i] !== '\n' && xmlData[i] !== '\r'; i++) {
          tagName += xmlData[i];
        }

        tagName = tagName.trim(); //console.log(tagName);

        if (tagName[tagName.length - 1] === '/') {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          continue;
        }

        if (!validateTagName(tagName, regxTagName)) {
          return {
            err: {
              code: 'InvalidTag',
              msg: 'Tag ' + tagName + ' is an invalid name.'
            }
          };
        }

        var result = readAttributeStr(xmlData, i);

        if (result === false) {
          return {
            err: {
              code: 'InvalidAttr',
              msg: 'Attributes for "' + tagName + '" have open quote.'
            }
          };
        }

        var attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === '/') {
          //self closing tag
          attrStr = attrStr.substring(0, attrStr.length - 1);
          var isValid = validateAttributeString(attrStr, options, regxAttrName);

          if (isValid === true) {
            tagFound = true; //continue; //text may presents after self closing tag
          } else {
            return isValid;
          }
        } else if (closingTag) {
          if (!result.tagClosed) {
            return {
              err: {
                code: 'InvalidTag',
                msg: 'closing tag "' + tagName + "\" don't have proper closing."
              }
            };
          } else if (attrStr.trim().length > 0) {
            return {
              err: {
                code: 'InvalidTag',
                msg: 'closing tag "' + tagName + "\" can't have attributes or invalid starting."
              }
            };
          } else {
            var otg = tags.pop();

            if (tagName !== otg) {
              return {
                err: {
                  code: 'InvalidTag',
                  msg: 'closing tag ' + otg + ' is expected inplace of ' + tagName + '.'
                }
              };
            }
          }
        } else {
          var _isValid = validateAttributeString(attrStr, options, regxAttrName);

          if (_isValid !== true) {
            return _isValid;
          }

          tags.push(tagName);
          tagFound = true;
        } //skip tag text value
        //It may include comments and CDATA value


        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === '<') {
            if (xmlData[i + 1] === '!') {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else {
              break;
            }
          }
        } //end of reading tag text value


        if (xmlData[i] === '<') {
          i--;
        }
      }
    } else {
      if (xmlData[i] === ' ' || xmlData[i] === '\t' || xmlData[i] === '\n' || xmlData[i] === '\r') {
        continue;
      }

      return {
        err: {
          code: 'InvalidChar',
          msg: 'char ' + xmlData[i] + ' is not expected .'
        }
      };
    }
  }

  if (!tagFound) {
    return {
      err: {
        code: 'InvalidXml',
        msg: 'Start tag expected.'
      }
    };
  } else if (tags.length > 0) {
    return {
      err: {
        code: 'InvalidXml',
        msg: 'Invalid ' + JSON.stringify(tags, null, 4).replace(/\r?\n/g, '') + ' found.'
      }
    };
  }

  return true;
};
/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */


function readPI(xmlData, i) {
  var start = i;

  for (; i < xmlData.length; i++) {
    if (xmlData[i] == '?' || xmlData[i] == ' ') {
      //tagname
      var tagname = xmlData.substr(start, i - start);

      if (i > 5 && tagname === 'xml') {
        return {
          err: {
            code: 'InvalidXml',
            msg: 'XML declaration allowed only at the start of the document.'
          }
        };
      } else if (xmlData[i] == '?' && xmlData[i + 1] == '>') {
        //check if valid attribut string
        i++;
        break;
      } else {
        continue;
      }
    }
  }

  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === '-' && xmlData[i + 2] === '-') {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === '-' && xmlData[i + 1] === '-' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  } else if (xmlData.length > i + 8 && xmlData[i + 1] === 'D' && xmlData[i + 2] === 'O' && xmlData[i + 3] === 'C' && xmlData[i + 4] === 'T' && xmlData[i + 5] === 'Y' && xmlData[i + 6] === 'P' && xmlData[i + 7] === 'E') {
    var angleBracketsCount = 1;

    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === '<') {
        angleBracketsCount++;
      } else if (xmlData[i] === '>') {
        angleBracketsCount--;

        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i + 9 && xmlData[i + 1] === '[' && xmlData[i + 2] === 'C' && xmlData[i + 3] === 'D' && xmlData[i + 4] === 'A' && xmlData[i + 5] === 'T' && xmlData[i + 6] === 'A' && xmlData[i + 7] === '[') {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === ']' && xmlData[i + 1] === ']' && xmlData[i + 2] === '>') {
        i += 2;
        break;
      }
    }
  }

  return i;
}

var doubleQuote = '"';
var singleQuote = "'";
/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */

function readAttributeStr(xmlData, i) {
  var attrStr = '';
  var startChar = '';
  var tagClosed = false;

  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === '') {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
        continue;
      } else {
        startChar = '';
      }
    } else if (xmlData[i] === '>') {
      if (startChar === '') {
        tagClosed = true;
        break;
      }
    }

    attrStr += xmlData[i];
  }

  if (startChar !== '') {
    return false;
  }

  return {
    value: attrStr,
    index: i,
    tagClosed: tagClosed
  };
}
/**
 * Select all the attributes whether valid or invalid.
 */


var validAttrStrRegxp = new RegExp('(\\s*)([^\\s=]+)(\\s*=)?(\\s*([\'"])(([\\s\\S])*?)\\5)?', 'g'); //attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options, regxAttrName) {
  //console.log("start:"+attrStr+":end");
  //if(attrStr.trim().length === 0) return true; //empty string
  var matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  var attrNames = {};

  for (var i = 0; i < matches.length; i++) {
    //console.log(matches[i]);
    if (matches[i][1].length === 0) {
      //nospace before attribute name: a="sd"b="saf"
      return {
        err: {
          code: 'InvalidAttr',
          msg: 'attribute ' + matches[i][2] + ' has no space in starting.'
        }
      };
    } else if (matches[i][3] === undefined && !options.allowBooleanAttributes) {
      //independent attribute: ab
      return {
        err: {
          code: 'InvalidAttr',
          msg: 'boolean attribute ' + matches[i][2] + ' is not allowed.'
        }
      };
    }
    /* else if(matches[i][6] === undefined){//attribute without value: ab=
                    return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
                } */


    var attrName = matches[i][2];

    if (!validateAttrName(attrName, regxAttrName)) {
      return {
        err: {
          code: 'InvalidAttr',
          msg: 'attribute ' + attrName + ' is an invalid name.'
        }
      };
    }
    /*if (!attrNames.hasOwnProperty(attrName)) {*/


    if (!Object.prototype.hasOwnProperty.call(attrNames, attrName)) {
      //check for duplicate attribute.
      attrNames[attrName] = 1;
    } else {
      return {
        err: {
          code: 'InvalidAttr',
          msg: 'attribute ' + attrName + ' is repeated.'
        }
      };
    }
  }

  return true;
} // const validAttrRegxp = /^[_a-zA-Z][\w\-.:]*$/;


function validateAttrName(attrName, regxAttrName) {
  // const validAttrRegxp = new RegExp(regxAttrName);
  return util.doesMatch(attrName, regxAttrName);
} //const startsWithXML = new RegExp("^[Xx][Mm][Ll]");
//  startsWith = /^([a-zA-Z]|_)[\w.\-_:]*/;


function validateTagName(tagname, regxTagName) {
  /*if(util.doesMatch(tagname,startsWithXML)) return false;
    else*/
  return !util.doesNotMatch(tagname, regxTagName);
}

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BitMapFont; });
/* harmony import */ var _imageManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _pool__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var bitMapPool = new _pool__WEBPACK_IMPORTED_MODULE_1__["default"]('bitMapPool');

var Emitter = __webpack_require__(4);
/**
 * http://www.angelcode.com/products/bmfont/doc/file_format.html
 */


var BitMapFont = /*#__PURE__*/function () {
  function BitMapFont(name, src, config) {
    var _this = this;

    _classCallCheck(this, BitMapFont);

    var cache = bitMapPool.get(name);

    if (cache) {
      return cache;
    }

    this.config = config;
    this.chars = this.parseConfig(config);
    this.ready = false;
    this.event = new Emitter();
    this.texture = _imageManager__WEBPACK_IMPORTED_MODULE_0__["default"].loadImage(src, function (texture, fromCache) {
      if (fromCache) {
        _this.texture = texture;
      }

      _this.ready = true;

      _this.event.emit('text__load__done');
    });
    bitMapPool.set(name, this);
  }

  _createClass(BitMapFont, [{
    key: "parseConfig",
    value: function parseConfig(fntText) {
      fntText = fntText.split("\r\n").join("\n");
      var lines = fntText.split("\n");
      var charsCount = this.getConfigByKey(lines[3], "count");
      this.lineHeight = this.getConfigByKey(lines[1], 'lineHeight');
      this.fontSize = this.getConfigByKey(lines[0], 'size');
      var chars = {};

      for (var i = 4; i < 4 + charsCount; i++) {
        var charText = lines[i];
        var letter = String.fromCharCode(this.getConfigByKey(charText, "id"));
        var c = {};
        chars[letter] = c;
        c["x"] = this.getConfigByKey(charText, "x");
        c["y"] = this.getConfigByKey(charText, "y");
        c["w"] = this.getConfigByKey(charText, "width");
        c["h"] = this.getConfigByKey(charText, "height");
        c["offX"] = this.getConfigByKey(charText, "xoffset");
        c["offY"] = this.getConfigByKey(charText, "yoffset");
        c["xadvance"] = this.getConfigByKey(charText, "xadvance");
      }

      return chars;
    }
  }, {
    key: "getConfigByKey",
    value: function getConfigByKey(configText, key) {
      var itemConfigTextList = configText.split(" ");

      for (var i = 0, length = itemConfigTextList.length; i < length; i++) {
        var itemConfigText = itemConfigTextList[i];

        if (key === itemConfigText.substring(0, key.length)) {
          var value = itemConfigText.substring(key.length + 1);
          return parseInt(value);
        }
      }

      return 0;
    }
  }]);

  return BitMapFont;
}();



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _pool__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var imgPool = new _pool__WEBPACK_IMPORTED_MODULE_0__["default"]('imgPool');

var ImageManager = /*#__PURE__*/function () {
  function ImageManager() {
    _classCallCheck(this, ImageManager);
  }

  _createClass(ImageManager, [{
    key: "getRes",
    value: function getRes(src) {
      return imgPool.get(src);
    }
  }, {
    key: "loadImage",
    value: function loadImage(src) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _util__WEBPACK_IMPORTED_MODULE_1__["none"];
      var img = null;
      var cache = this.getRes(src);

      if (!src) {
        return img;
      } // 图片已经被加载过，直接返回图片并且执行回调


      if (cache && cache.loadDone) {
        img = cache;
        callback(img, true);
      } else if (cache && !cache.loadDone) {
        // 图片正在加载过程中，返回图片并且等待图片加载完成执行回调
        img = cache;
        cache.onloadcbks.push(callback);
      } else {
        // 创建图片，将回调函数推入回调函数栈
        img = Object(_util__WEBPACK_IMPORTED_MODULE_1__["createImage"])();
        img.onloadcbks = [callback];
        imgPool.set(src, img);

        img.onload = function () {
          img.onloadcbks.forEach(function (fn) {
            return fn(img, false);
          });
          img.onloadcbks = [];
          img.loadDone = true;
        };

        img.onerror = function (e) {
          console.log('img load error', e);
        };

        img.src = src;
      }

      return img;
    }
  }]);

  return ImageManager;
}();

/* harmony default export */ __webpack_exports__["default"] = (new ImageManager());

/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "View", function() { return _view_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _image_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Image", function() { return _image_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });

/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return _text_js__WEBPACK_IMPORTED_MODULE_2__["default"]; });

/* harmony import */ var _scrollview_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(20);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ScrollView", function() { return _scrollview_js__WEBPACK_IMPORTED_MODULE_3__["default"]; });

/* harmony import */ var _bitmaptext_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(22);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BitMapText", function() { return _bitmaptext_js__WEBPACK_IMPORTED_MODULE_4__["default"]; });








/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return View; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var View = /*#__PURE__*/function (_Element) {
  _inherits(View, _Element);

  var _super = _createSuper(View);

  function View(_ref) {
    var _this;

    var _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className;

    _classCallCheck(this, View);

    _this = _super.call(this, {
      props: props,
      idName: idName,
      className: className,
      style: style
    });
    _this.type = 'View';
    _this.ctx = null;
    _this.renderBoxes = [];
    return _this;
  }

  _createClass(View, [{
    key: "destroySelf",
    value: function destroySelf() {
      this.isDestroyed = true;
      this.children = null;
      this.root = null;
    } // 有些节点仅仅作为容器，实际上不需要任何渲染逻辑，这里加个判断可以提高性能

  }, {
    key: "checkNeedRender",
    value: function checkNeedRender() {
      var style = this.style || {};
      var borderColor = style.borderColor;
      return !!(style.backgroundColor || style.borderWidth && borderColor || style.borderTopWidth && (borderColor || style.borderTopColor) || style.borderBottomWidth && (borderColor || style.borderBottomColor) || style.borderLeftWidth && (borderColor || style.borderLeftColor) || style.borderRightWidth && (borderColor || style.borderRightColor));
    }
  }, {
    key: "render",
    value: function render(ctx, layoutBox) {
      var style = this.style || {};
      var box = layoutBox || this.layoutBox;
      ctx.save();
      var borderWidth = style.borderWidth || 0;
      var drawX = box.absoluteX;
      var drawY = box.absoluteY;
      var borderLeftWidth = style.borderLeftWidth || borderWidth;
      var borderRightWidth = style.borderRightWidth || borderWidth;
      var borderTopWidth = style.borderTopWidth || borderWidth;
      var borderBottomWidth = style.borderBottomWidth || borderWidth;
      this.renderBorder(ctx, layoutBox);

      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(drawX + borderLeftWidth, drawY + borderRightWidth, box.width - (borderLeftWidth + borderRightWidth), box.height - (borderTopWidth + borderBottomWidth));
      }

      ctx.restore();
    }
  }, {
    key: "insert",
    value: function insert(ctx, box) {
      this.ctx = ctx;

      if (!box) {
        box = this.layoutBox;
      }

      this.renderBoxes.push({
        ctx: ctx,
        box: box
      });
      this.render(ctx, box);
    }
  }, {
    key: "repaint",
    value: function repaint() {
      var _this2 = this;

      this.renderBoxes.forEach(function (item) {
        _this2.render(item.ctx, item.box);
      });
    }
  }]);

  return View;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Image; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _common_imageManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }




var Image = /*#__PURE__*/function (_Element) {
  _inherits(Image, _Element);

  var _super = _createSuper(Image);

  function Image(opts) {
    var _this;

    _classCallCheck(this, Image);

    var _opts$style = opts.style,
        style = _opts$style === void 0 ? {} : _opts$style,
        _opts$props = opts.props,
        props = _opts$props === void 0 ? {} : _opts$props,
        _opts$idName = opts.idName,
        idName = _opts$idName === void 0 ? '' : _opts$idName,
        _opts$className = opts.className,
        className = _opts$className === void 0 ? '' : _opts$className,
        _opts$src = opts.src,
        src = _opts$src === void 0 ? '' : _opts$src;
    _this = _super.call(this, {
      props: props,
      idName: idName,
      className: className,
      style: style
    });
    _this.imgsrc = src;
    Object.defineProperty(_assertThisInitialized(_this), "src", {
      get: function get() {
        return this.imgsrc;
      },
      set: function set(newValue) {
        var _this2 = this;

        if (newValue !== this.imgsrc) {
          this.imgsrc = newValue;
          _common_imageManager__WEBPACK_IMPORTED_MODULE_1__["default"].loadImage(this.src, function (img) {
            _this2.img = img;
            /*this.repaint();*/

            _this2.emit('repaint');
          });
        }
      },
      enumerable: true,
      configurable: true
    });
    _this.type = 'Image';
    _this.renderBoxes = [];
    return _this;
  }

  _createClass(Image, [{
    key: "repaint",
    value: function repaint() {
      var _this3 = this;

      this.renderBoxes.forEach(function (item) {
        _this3.renderImg(item.ctx, item.box, false);
      });
    } // 子类填充实现

  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.isDestroyed = true;
      this.img = null;
      delete this.src;
      this.root = null;
    }
  }, {
    key: "renderImg",
    value: function renderImg(ctx, layoutBox) {
      var needEmitEvent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      if (!this.img) {
        return;
      }

      var style = this.style || {};
      var box = layoutBox || this.layoutBox;
      ctx.save();

      if (style.borderColor) {
        ctx.strokeStyle = style.borderColor;
      }

      ctx.lineWidth = style.borderWidth || 0;
      var drawX = box.absoluteX;
      var drawY = box.absoluteY;
      this.renderBorder(ctx, layoutBox);
      ctx.drawImage(this.img, drawX, drawY, box.width, box.height);
      ctx.restore();
    }
  }, {
    key: "insert",
    value: function insert(ctx, box) {
      var _this4 = this;

      this.renderBoxes.push({
        ctx: ctx,
        box: box
      });
      this.img = _common_imageManager__WEBPACK_IMPORTED_MODULE_1__["default"].loadImage(this.src, function (img, fromCache) {
        // 来自缓存的，还没返回img就会执行回调函数
        if (fromCache) {
          _this4.img = img;

          _this4.renderImg(ctx, box, false);
        } else {
          // 当图片加载完成，实例可能已经被销毁了
          if (_this4.img) {
            var eventName = _this4.isScrollViewChild ? 'image__render__done' : 'one__image__render__done';

            _this4.EE.emit(eventName, _this4);
          }
        }
      });
    }
  }, {
    key: "isScrollViewChild",
    get: function get() {
      var flag = false;
      var parent = this.parent;

      while (parent && !flag) {
        if (parent.type === 'ScrollView') {
          flag = true;
        } else {
          parent = parent.parent;
        }
      }

      return flag;
    }
  }]);

  return Image;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Text; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var DEFAULT_FONT_FAMILY = 'PingFangSC-Regular, sans-serif';
var context = null;

var getContext = function getContext() {
  if (context) {
    return context;
  }

  var canvas = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_1__["createCanvas"])();
  canvas.width = 1;
  canvas.height = 1;
  context = canvas.getContext('2d');
  return context;
};

function getTextWidth(style, value) {
  var context = getContext();
  context.font = "".concat(style.fontWeight || 'normal', " ").concat(style.fontSize || 12, "px ").concat(style.fontFamily || DEFAULT_FONT_FAMILY);
  return context.measureText(value).width || 0;
}

function getTextWidthWithoutSetFont(value) {
  return getContext().measureText(value).width || 0;
}

function parseText(style, value) {
  value = String(value);
  var maxWidth = style.width;
  var wordWidth = getTextWidth(style, value); // 对文字溢出的处理，默认用...

  var textOverflow = style.textOverflow || 'ellipsis'; // 文字最大长度不超限制

  if (wordWidth <= maxWidth) {
    return value;
  } // 对于用点点点处理的情况，先将最大宽度减去...的宽度


  if (textOverflow === 'ellipsis') {
    maxWidth -= getTextWidthWithoutSetFont('...');
  }

  var length = value.length - 1;
  var str = value.substring(0, length);

  while (getTextWidthWithoutSetFont(str) > maxWidth && length > 0) {
    length--;
    str = value.substring(0, length);
  }

  return length && textOverflow === 'ellipsis' ? str + '...' : str;
}

var Text = /*#__PURE__*/function (_Element) {
  _inherits(Text, _Element);

  var _super = _createSuper(Text);

  function Text(_ref) {
    var _this;

    var _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$idName = _ref.idName,
        idName = _ref$idName === void 0 ? '' : _ref$idName,
        _ref$className = _ref.className,
        className = _ref$className === void 0 ? '' : _ref$className,
        _ref$value = _ref.value,
        value = _ref$value === void 0 ? '' : _ref$value;

    _classCallCheck(this, Text);

    // 没有设置宽度的时候通过canvas计算出文字宽度
    if (style.width === undefined) {
      style.width = getTextWidth(style, value);
    } else if (style.textOverflow === 'ellipsis') {
      value = parseText(style, value);
    }

    _this = _super.call(this, {
      props: props,
      idName: idName,
      className: className,
      style: style
    });
    _this.type = 'Text';
    _this.ctx = null;
    _this.valuesrc = value;
    _this.renderBoxes = [];
    Object.defineProperty(_assertThisInitialized(_this), "value", {
      get: function get() {
        return this.valuesrc;
      },
      set: function set(newValue) {
        if (newValue !== this.valuesrc) {
          this.valuesrc = newValue;
          this.emit('repaint');
        }
      },
      enumerable: true,
      configurable: true
    });
    return _this;
  }

  _createClass(Text, [{
    key: "toCanvasData",
    value: function toCanvasData() {
      var style = this.style || {};
      this.fontSize = style.fontSize || 12;
      this.textBaseline = 'top';
      this.font = "".concat(style.fontWeight || '', " ").concat(style.fontSize || 12, "px ").concat(DEFAULT_FONT_FAMILY);
      this.textAlign = style.textAlign || 'left';
      this.fillStyle = style.color || '#000';
    }
  }, {
    key: "insert",
    value: function insert(ctx, box) {
      this.renderBoxes.push({
        ctx: ctx,
        box: box
      });
      this.render(ctx, box);
    }
  }, {
    key: "repaint",
    value: function repaint() {
      var _this2 = this;

      this.renderBoxes.forEach(function (item) {
        _this2.render(item.ctx, item.box);
      });
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.root = null;
    }
  }, {
    key: "render",
    value: function render(ctx, layoutBox) {
      this.toCanvasData();
      ctx.save();
      var box = layoutBox || this.layoutBox;
      var style = this.style;
      ctx.textBaseline = this.textBaseline;
      ctx.font = this.font;
      ctx.textAlign = this.textAlign;
      var drawX = box.absoluteX;
      var drawY = box.absoluteY;
      this.renderBorder(ctx, layoutBox);

      if (style.backgroundColor) {
        ctx.fillStyle = style.backgroundColor;
        ctx.fillRect(drawX, drawY, box.width, box.height);
      }

      ctx.fillStyle = this.fillStyle;

      if (this.textAlign === 'center') {
        drawX += box.width / 2;
      } else if (this.textAlign === 'right') {
        drawX += box.width;
      }

      if (style.lineHeight) {
        ctx.textBaseline = 'middle';
        drawY += style.lineHeight / 2;
      }

      ctx.fillText(this.value, drawX, drawY);
      ctx.restore();
    }
  }]);

  return Text;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ScrollView; });
/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _common_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _common_touch_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(21);
/* harmony import */ var _common_util_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }





var id = 0;
var canvasPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]('canvasPool');

var ScrollView = /*#__PURE__*/function (_View) {
  _inherits(ScrollView, _View);

  var _super = _createSuper(ScrollView);

  function ScrollView(_ref) {
    var _this;

    var _ref$style = _ref.style,
        style = _ref$style === void 0 ? {} : _ref$style,
        _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props,
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? '' : _ref$name;

    _classCallCheck(this, ScrollView);

    _this = _super.call(this, {
      props: props,
      name: name,
      style: style
    });
    _this.type = 'ScrollView'; // 当前列表滚动的值

    _this.top = 0; // 滚动处理器

    _this.touch = new _common_touch_js__WEBPACK_IMPORTED_MODULE_2__["default"](); // canvas高度不能过高，在小游戏里面，对canvas尺寸是有限制的

    _this.pageHeight = 2000; // 根据列表总高度和单页高度计算的分页数量

    _this.pageCount = 1;
    _this.canvasMap = {}; // 图片加载完成之后会触发scrollView的重绘函数，当图片过多的时候用节流提升性能

    _this.throttleRepaint = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["throttle"])(_this.clipRepaint, 16, _assertThisInitialized(_this));
    _this.throttleImageLoadDone = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["throttle"])(_this.childImageLoadDoneCbk, 32, _assertThisInitialized(_this));
    _this.renderTimers = [];
    _this.requestID = null;
    return _this;
  }
  /**
   * 获取滚动列表内所有元素的高度和
   * 这里不能简单将所有子元素的高度累加，因为每个元素之间可能是有空隙的
   */


  _createClass(ScrollView, [{
    key: "repaint",
    value: function repaint() {
      var _this2 = this;

      this.clear();
      this.renderBoxes.forEach(function (item) {
        _this2.render(item.ctx, item.box);
      });
    }
    /**
     * 列表子元素重绘之前先将所有的canvas擦除
     */

  }, {
    key: "clear",
    value: function clear() {
      var _this3 = this;

      Object.keys(this.canvasMap).forEach(function (key) {
        var item = _this3.canvasMap[key];
        item.context && item.context.clearRect(0, 0, item.canvas.width, item.canvas.height);
      });
    } // 与主canvas的尺寸保持一致

  }, {
    key: "updateRenderPort",
    value: function updateRenderPort(renderport) {
      this.renderport = renderport;
    }
    /**
     * 计算分页数据
     * 小游戏的canvas对尺寸有要求，如果如果高度过高，可能出现渲染不出来的情况
     * 因此需要手动分页，列表过长的时候将数据绘制到几个canvas上面，这里预创建几个canvas
     */

  }, {
    key: "calPageData",
    value: function calPageData() {
      this.pageCount = Math.ceil((this.scrollHeight + this.layoutBox.absoluteY) / this.pageHeight);

      for (var i = 0; i < this.pageCount; i++) {
        var cache = canvasPool.get(i);

        if (cache) {
          cache.context && cache.context.clearRect(0, 0, cache.canvas.width, cache.canvas.height);
          cache.elements = [];
          this.canvasMap[i] = cache;
        } else {
          this.canvasMap[i] = {
            elements: []
          };
          canvasPool.set(i, this.canvasMap[i]);
        }
      }
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.touch = null;
      this.isDestroyed = true;
      this.throttleRepaint = null;
      this.renderTimers.forEach(function (timer) {
        clearTimeout(timer);
      });
      this.root.off('repaint__done');
      this.renderTimers = [];
      this.canvasMap = {};
      this.ctx = null;
      this.children = null;
      this.requestID && cancelAnimationFrame(this.requestID);
      this.root = null;
    }
    /**
     * 滚动列表重绘逻辑
     * 将分页canvas按照滚动裁剪绘制到主canvas上面
     */

  }, {
    key: "clipRepaint",
    value: function clipRepaint(top) {
      var _this4 = this;

      if (this.isDestroyed) {
        return;
      }

      this.requestID = requestAnimationFrame(function () {
        top = -top;
        _this4.top = top;
        var box = _this4.layoutBox;
        var abY = box.absoluteY;

        if (_this4.isDestroyed || _this4.root.state === _common_util_js__WEBPACK_IMPORTED_MODULE_3__["STATE"].CLEAR) {
          return;
        } // 在主canvas上面将滚动列表区域擦除


        _this4.ctx.clearRect(box.absoluteX, abY, box.width, box.height); // 背景填充


        _this4.ctx.fillStyle = _this4.parent.style.backgroundColor || '#ffffff';

        _this4.ctx.fillRect(box.absoluteX, abY, box.width, box.height);

        for (var i = 0; i < _this4.pageCount; i++) {
          var canvas = _this4.canvasMap[i].canvas; // 根据滚动值获取裁剪区域

          var startY = abY + top;
          var endY = abY + top + box.height; // 计算在裁剪区域内的canvas

          if (startY < _this4.pageHeight * (i + 1) && endY > _this4.pageHeight * i) {
            /**
             * 这里不能按照box.width * box.height的区域去裁剪
             * 在浏览器里面正常，但是在小游戏里面会出现诡异的渲染出错，所以裁剪canvas真实有效的区域
             */
            var clipY = abY + top - _this4.pageHeight * i;
            var clipH = box.height;
            var renderY = abY;

            if (clipY > 0 && _this4.pageHeight - clipY < box.height) {
              clipH = _this4.pageHeight - clipY;
            } else if (clipY < 0) {
              clipH = clipY + box.height;
              renderY = renderY - clipY;
              clipY = 0;
            }

            _this4.ctx.drawImage(canvas, box.absoluteX, clipY, box.width, clipH, box.absoluteX, renderY, box.width, clipH);
          }
        }
      });
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(tree) {
      var _this5 = this;

      var children = tree.children;
      var height = this.pageHeight;
      Object.keys(children).forEach(function (id) {
        var child = children[id];
        var originY = child.layoutBox.originalAbsoluteY;
        var pageIndex = Math.floor(originY / height);
        var nextPage = pageIndex + 1;
        child.layoutBox.absoluteY -= _this5.pageHeight * pageIndex;

        if (child.checkNeedRender()) {
          _this5.canvasMap[pageIndex].elements.push({
            element: child,
            box: child.layoutBox
          });
        } // 对于跨界的元素，两边都绘制下


        if (originY + child.layoutBox.height > height * nextPage) {
          var tmpBox = Object.assign({}, child.layoutBox);
          tmpBox.absoluteY = originY - _this5.pageHeight * nextPage;

          if (child.checkNeedRender()) {
            _this5.canvasMap[nextPage].elements.push({
              element: child,
              box: tmpBox
            });
          }
        }

        _this5.renderChildren(child);
      });
    }
  }, {
    key: "insertElements",
    value: function insertElements(pageIndex) {
      var _this6 = this;

      var can = Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["createCanvas"])();
      var ctx = can.getContext('2d');
      can.width = this.renderport.width;
      can.height = this.pageHeight;
      ctx.id = ++id;
      this.canvasMap[pageIndex].canvas = can;
      this.canvasMap[pageIndex].context = ctx;
      this.canvasMap[pageIndex].elements.forEach(function (ele) {
        ele.element.insert(ctx, ele.box);
      });

      if (pageIndex < this.pageCount - 1) {
        var timer = setTimeout(function () {
          _this6.insertElements(++pageIndex);
        }, 250);
        this.renderTimers.push(timer);
      }
    }
  }, {
    key: "childImageLoadDoneCbk",
    value: function childImageLoadDoneCbk(img) {
      var start = new Date();
      var list = Object.values(this.canvasMap);
      var pageIndex = -1;

      for (var i = 0; i < list.length; i++) {
        if (list[i].elements.find(function (item) {
          return item.element === img;
        })) {
          pageIndex = i;
          break;
        }
      }

      if (pageIndex > -1) {
        var _start = new Date();

        var canItem = this.canvasMap[pageIndex];
        var canvas = canItem.canvas;
        var ctx = canItem.context;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.canvasMap[pageIndex].elements.forEach(function (ele) {
          Object(_common_util_js__WEBPACK_IMPORTED_MODULE_3__["repaintTree"])(ele.element);
        });
      }
      /*this.throttleRepaint(-this.top || 0);*/


      this.clipRepaint(-this.top);
    }
  }, {
    key: "insertScrollView",
    value: function insertScrollView(context) {
      var _this7 = this;

      // 绘制容器
      this.insert(context);
      this.root.on('repaint__done', function () {
        _this7.clipRepaint(-_this7.top);
      }); // 计算列表应该分割成几页

      this.calPageData(); // 计算分页数据：每个元素应该坐落在哪个canvas

      this.renderChildren(this);
      this.insertElements(0);
      this.clipRepaint(-this.top); // 图片加载可能是异步的，监听图片加载完成事件完成列表重绘逻辑

      this.EE.on('image__render__done', function (img) {
        _this7.throttleImageLoadDone(img);
      });

      if (this.scrollHeight > this.layoutBox.height) {
        this.touch.setTouchRange(-(this.scrollHeight - this.layoutBox.height), 0, this.clipRepaint.bind(this)); // 监听触摸相关事件，将滚动处理逻辑交给相应的处理器处理

        this.on('touchstart', this.touch.startFunc);
        this.on('touchmove', this.touch.moveFunc);
        this.on('touchend', this.touch.endFunc);
      }
    }
  }, {
    key: "scrollHeight",
    get: function get() {
      // scrollview为空的情况
      if (!this.children.length) {
        return 0;
      }

      var last = this.children[this.children.length - 1];
      return last.layoutBox.top + last.layoutBox.height;
    }
  }]);

  return ScrollView;
}(_view_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Touch; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Touch = /*#__PURE__*/function () {
  function Touch() {
    _classCallCheck(this, Touch);

    this.needProcess = false;
    this.startFunc = this.touchStartHandler.bind(this);
    this.endFunc = this.touchEndHandler.bind(this);
    this.moveFunc = this.touchMoveHandler.bind(this);
  }

  _createClass(Touch, [{
    key: "reset",
    value: function reset() {
      this.touchTime = new Date();
      this.touchStartX = 0;
      this.touchStartY = 0; // 滚动区间

      this.start = 0;
      this.end = 0; // 当前位置

      this.move = 0; // 目标位置

      this.target = 0; // 滚动回调函数

      this.scroll = null; // for istanbul

      /* istanbul ignore if*/

      if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animate);
      }
    }
  }, {
    key: "enable",
    value: function enable() {
      this.reset();
      this.needProcess = true;
    }
  }, {
    key: "disable",
    value: function disable() {
      this.needProcess = false;
    } // 设置滚动区间，比如一个排行榜的滚动区间可能是[-300, 0]

  }, {
    key: "setTouchRange",
    value: function setTouchRange(start, end, scroll) {
      // 考虑到切换游戏的场景，每次设置的时候重置所有变量
      this.enable();
      this.start = start;
      this.end = end;

      if (start === 0 && end === 0) {
        return;
      }

      this.scroll = scroll; // this.animate = requestAnimationFrame(this.loop.bind(this));
    } // 保证滚动目标位置在滚动区间内

  }, {
    key: "limitTarget",
    value: function limitTarget(target) {
      var result = target;

      if (target > this.end) {
        result = this.end;
      } else if (target < this.start) {
        result = this.start;
      }

      return result;
    }
  }, {
    key: "touchStartHandler",
    value: function touchStartHandler(e) {
      var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      }

      var dpr = Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["getDpr"])();
      this.touchStartX = touch.clientX * dpr;
      this.touchStartY = touch.clientY * dpr;
      this.touchTime = new Date();
      this.isMoving = true;
      this.needProcess = true;
      this.animate = requestAnimationFrame(this.loop.bind(this));
    }
  }, {
    key: "touchMoveHandler",
    value: function touchMoveHandler(e) {
      if (!this.isMoving) {
        return;
      }

      var touch = e.touches && e.touches[0] || e.changedTouches && e.changedTouches[0] || e;

      if (!touch || !touch.pageX || !touch.pageY) {
        return;
      }

      var dpr = Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["getDpr"])();
      var currY = touch.clientY * dpr;

      if (this.touchStartY - currY > 2 || this.touchStartY - currY < -2) {
        this.target -= this.touchStartY - currY;
      }

      this.target = this.limitTarget(this.target);
      this.touchStartY = currY;
    }
  }, {
    key: "touchEndHandler",
    value: function touchEndHandler() {
      this.isMoving = false;
      var timeInS = (Date.now() - this.touchTime) / 1000;
      /*console.log(Date.now(), this.touchTime.getTime(), Date.now() - this.touchTime);*/

      if (timeInS < 0.9) {
        /*console.log(1, timeInS, this.target, this.move);*/
        this.target += (this.target - this.move) * 0.6 / (timeInS * 5);
        /*console.log(2, this.target)*/

        this.target = this.limitTarget(this.target);
        /*console.log(3, this.target)*/
      }
    }
  }, {
    key: "loop",
    value: function loop() {
      if (this.needProcess) {
        if (this.isMoving) {
          if (this.move !== this.target) {
            // 手指移动可能过快，切片以使得滑动流畅
            if (Math.abs(this.target - this.move) > 1) {
              this.move += (this.target - this.move) * 0.4;
            } else {
              this.move = this.target;
            }

            this.scroll && this.scroll(this.move);
          }
        } else {
          if (this.move !== this.target) {
            /**
             * 如果滑动很快，为了滚动流畅，需要将滑动过程切片
             */
            if (Math.abs(this.target - this.move) > 1) {
              this.move += (this.target - this.move) * 0.3;
            } else {
              this.move = this.target;
            }

            this.scroll && this.scroll(this.move);
          } else {
            // 滑动结束，停止动画
            this.needProcess = false;
          }
        }

        this.animate = requestAnimationFrame(this.loop.bind(this));
      } else if (typeof cancelAnimationFrame !== 'undefined') {
        cancelAnimationFrame(this.animate);
      }
    }
  }]);

  return Touch;
}();



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BitMapText; });
/* harmony import */ var _elements_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _common_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }



var bitMapPool = new _common_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]('bitMapPool');

var BitMapText = /*#__PURE__*/function (_Element) {
  _inherits(BitMapText, _Element);

  var _super = _createSuper(BitMapText);

  function BitMapText(opts) {
    var _this;

    _classCallCheck(this, BitMapText);

    var _opts$style = opts.style,
        style = _opts$style === void 0 ? {} : _opts$style,
        _opts$props = opts.props,
        props = _opts$props === void 0 ? {} : _opts$props,
        _opts$idName = opts.idName,
        idName = _opts$idName === void 0 ? '' : _opts$idName,
        _opts$className = opts.className,
        className = _opts$className === void 0 ? '' : _opts$className,
        _opts$value = opts.value,
        value = _opts$value === void 0 ? '' : _opts$value,
        _opts$font = opts.font,
        font = _opts$font === void 0 ? '' : _opts$font;
    _this = _super.call(this, {
      props: props,
      idName: idName,
      className: className,
      style: style
    });
    _this.type = "BitMapText";
    _this.ctx = null;
    _this.valuesrc = value;
    _this.renderBoxes = [];
    Object.defineProperty(_assertThisInitialized(_this), "value", {
      get: function get() {
        return this.valuesrc;
      },
      set: function set(newValue) {
        if (newValue !== this.valuesrc) {
          this.valuesrc = newValue;
          this.emit('repaint');
        }
      },
      enumerable: true,
      configurable: true
    });
    _this.font = bitMapPool.get(font);

    if (!_this.font) {
      console.error('Please invoke API `registBitMapFont` before using `BitMapText`');
    }

    return _this;
  }

  _createClass(BitMapText, [{
    key: "insert",
    value: function insert(ctx, box) {
      this.renderBoxes.push({
        ctx: ctx,
        box: box
      });
      this.render(ctx, box);
    }
  }, {
    key: "repaint",
    value: function repaint() {
      var _this2 = this;

      this.renderBoxes.forEach(function (item) {
        _this2.render(item.ctx, item.box);
      });
    }
  }, {
    key: "destroySelf",
    value: function destroySelf() {
      this.root = null;
    }
  }, {
    key: "render",
    value: function render(ctx, layoutBox) {
      var _this3 = this;

      if (!this.font) {
        return;
      }

      if (this.font.ready) {
        this.renderText(ctx, layoutBox);
      } else {
        this.font.event.on('text__load__done', function () {
          if (!_this3.isDestroyed) {
            _this3.renderText(ctx, layoutBox);
          }
        });
      }
    }
  }, {
    key: "getTextBounds",
    value: function getTextBounds() {
      var style = this.style;
      var _style$letterSpacing = style.letterSpacing,
          letterSpacing = _style$letterSpacing === void 0 ? 0 : _style$letterSpacing;
      var width = 0;

      for (var i = 0, len = this.value.length; i < len; i++) {
        var _char = this.value[i];
        var cfg = this.font.chars[_char];

        if (cfg) {
          width += cfg.w;

          if (i < len - 1) {
            width += letterSpacing;
          }
        }
      }

      return {
        width: width,
        height: this.font.lineHeight
      };
    }
  }, {
    key: "renderText",
    value: function renderText(ctx, layoutBox) {
      var bounds = this.getTextBounds();
      var defaultLineHeight = this.font.lineHeight;
      ctx.save();
      this.renderBorder(ctx, layoutBox);
      var box = layoutBox || this.layoutBox;
      var style = this.style;
      var width = style.width,
          height = style.height,
          _style$lineHeight = style.lineHeight,
          lineHeight = _style$lineHeight === void 0 ? defaultLineHeight : _style$lineHeight,
          textAlign = style.textAlign,
          verticalAlign = style.verticalAlign; // 元素包围盒的左上角坐标

      var x = box.absoluteX;
      var y = box.absoluteY;
      var scaleY = lineHeight / defaultLineHeight;
      var realWidth = scaleY * bounds.width; // 如果文字的渲染区域高度小于盒子高度，采用对齐方式

      if (lineHeight < height) {
        if (verticalAlign === 'middle') {
          y += (height - lineHeight) / 2;
        } else if (verticalAlign === 'bottom') {
          y = y + height - lineHeight;
        }
      }

      if (width > realWidth) {
        if (textAlign === 'center') {
          x += (width - realWidth) / 2;
        } else if (textAlign === 'right') {
          x += width - realWidth;
        }
      }

      for (var i = 0; i < this.value.length; i++) {
        var _char2 = this.value[i];
        var cfg = this.font.chars[_char2];

        if (cfg) {
          ctx.drawImage(this.font.texture, cfg.x, cfg.y, cfg.w, cfg.h, x + cfg.offX * scaleY, y + cfg.offY * scaleY, cfg.w * scaleY, cfg.h * scaleY);
          x += cfg.w * scaleY;
        }
      }
    }
  }]);

  return BitMapText;
}(_elements_js__WEBPACK_IMPORTED_MODULE_0__["default"]);



/***/ })
/******/ ]);