(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/component-event-handler.js", "../../core/components/ui-base/index.js", "../../core/data/decorators/index.js", "../../core/event/index.js", "../../core/platform/index.js", "../../core/math/index.js", "./layout.js", "./scroll-bar.js", "./view-group.js", "../../core/scene-graph/node.js", "../../core/director.js", "../../core/scene-graph/node-enum.js", "../../core/default-constants.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/component-event-handler.js"), require("../../core/components/ui-base/index.js"), require("../../core/data/decorators/index.js"), require("../../core/event/index.js"), require("../../core/platform/index.js"), require("../../core/math/index.js"), require("./layout.js"), require("./scroll-bar.js"), require("./view-group.js"), require("../../core/scene-graph/node.js"), require("../../core/director.js"), require("../../core/scene-graph/node-enum.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.componentEventHandler, global.index, global.index, global.index, global.index, global.index, global.layout, global.scrollBar, global.viewGroup, global.node, global.director, global.nodeEnum, global.defaultConstants, global.globalExports);
    global.scrollView = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _componentEventHandler, _index, _index2, _index3, _index4, _index5, _layout, _scrollBar, _viewGroup, _node, _director, _nodeEnum, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ScrollView = _exports.EventType = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
  var OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;
  var EPSILON = 1e-4;
  var TOLERANCE = 1e4;
  var MOVEMENT_FACTOR = 0.7;
  var ZERO = new _index5.Vec3();

  var _tempVec3 = new _index5.Vec3();

  var _tempVec3_1 = new _index5.Vec3();

  var _tempVec2 = new _index5.Vec2();

  var _tempVec2_1 = new _index5.Vec2();

  var quintEaseOut = function quintEaseOut(time) {
    time -= 1;
    return time * time * time * time * time + 1;
  };

  var getTimeInMilliseconds = function getTimeInMilliseconds() {
    var currentTime = new Date();
    return currentTime.getMilliseconds();
  };

  var eventMap = {
    'scroll-to-top': 0,
    'scroll-to-bottom': 1,
    'scroll-to-left': 2,
    'scroll-to-right': 3,
    'scrolling': 4,
    'bounce-bottom': 6,
    'bounce-left': 7,
    'bounce-right': 8,
    'bounce-top': 5,
    'scroll-ended': 9,
    'touch-up': 10,
    'scroll-ended-with-threshold': 11,
    'scroll-began': 12
  };
  /**
   * @en
   * Enum for ScrollView event type.
   *
   * @zh
   * 滚动视图事件类型
   */

  var EventType;
  /**
   * @en
   * Layout container for a view hierarchy that can be scrolled by the user,
   * allowing it to be larger than the physical display.
   *
   * @zh
   * 滚动视图组件。
   */

  _exports.EventType = EventType;

  (function (EventType) {
    EventType["SCROLL_TO_TOP"] = "scroll-to-top";
    EventType["SCROLL_TO_BOTTOM"] = "scroll-to-bottom";
    EventType["SCROLL_TO_LEFT"] = "scroll-to-left";
    EventType["SCROLL_TO_RIGHT"] = "scroll-to-right";
    EventType["SCROLL_BEGAN"] = "scroll-began";
    EventType["SCROLL_ENDED"] = "scroll-ended";
    EventType["BOUNCE_TOP"] = "bounce-top";
    EventType["BOUNCE_BOTTOM"] = "bounce-bottom";
    EventType["BOUNCE_LEFT"] = "bounce-left";
    EventType["BOUNCE_RIGHT"] = "bounce-right";
    EventType["SCROLLING"] = "scrolling";
    EventType["SCROLL_ENG_WITH_THRESHOLD"] = "scroll-ended-with-threshold";
    EventType["TOUCH_UP"] = "touch-up";
  })(EventType || (_exports.EventType = EventType = {}));

  var ScrollView = (_dec = (0, _index2.ccclass)('cc.ScrollView'), _dec2 = (0, _index2.help)('i18n:cc.ScrollView'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/ScrollView'), _dec5 = (0, _index2.requireComponent)(_index.UITransform), _dec6 = (0, _index2.range)([0, 10]), _dec7 = (0, _index2.displayOrder)(0), _dec8 = (0, _index2.tooltip)('回弹持续的时间，0 表示将立即反弹'), _dec9 = (0, _index2.range)([0, 1, 0.1]), _dec10 = (0, _index2.displayOrder)(1), _dec11 = (0, _index2.tooltip)('开启惯性后，在用户停止触摸后滚动多快停止，0 表示永不停止，1 表示立刻停止'), _dec12 = (0, _index2.displayOrder)(2), _dec13 = (0, _index2.tooltip)('是否允许滚动内容超过边界，并在停止触摸后回弹'), _dec14 = (0, _index2.displayOrder)(3), _dec15 = (0, _index2.tooltip)('是否开启滚动惯性'), _dec16 = (0, _index2.type)(_node.Node), _dec17 = (0, _index2.displayOrder)(4), _dec18 = (0, _index2.tooltip)('可滚动展示内容的节点'), _dec19 = (0, _index2.displayOrder)(5), _dec20 = (0, _index2.tooltip)('是否开启水平滚动'), _dec21 = (0, _index2.type)(_scrollBar.ScrollBar), _dec22 = (0, _index2.displayOrder)(6), _dec23 = (0, _index2.tooltip)('水平滚动的 ScrollBar'), _dec24 = (0, _index2.displayOrder)(7), _dec25 = (0, _index2.tooltip)('是否开启垂直滚动'), _dec26 = (0, _index2.type)(_scrollBar.ScrollBar), _dec27 = (0, _index2.displayOrder)(8), _dec28 = (0, _index2.tooltip)('垂直滚动的 ScrollBar'), _dec29 = (0, _index2.displayOrder)(9), _dec30 = (0, _index2.tooltip)('滚动行为是否会取消子节点上注册的触摸事件'), _dec31 = (0, _index2.type)([_componentEventHandler.EventHandler]), _dec32 = (0, _index2.displayOrder)(10), _dec33 = (0, _index2.tooltip)('滚动视图的事件回调函数'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_ViewGroup) {
    _inherits(ScrollView, _ViewGroup);

    function ScrollView() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ScrollView);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ScrollView)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "bounceDuration", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "brake", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "elastic", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "inertia", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "horizontal", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "vertical", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "cancelInnerEvents", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "scrollEvents", _descriptor8, _assertThisInitialized(_this));

      _this._autoScrolling = false;
      _this._scrolling = false;

      _initializerDefineProperty(_this, "_content", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_horizontalScrollBar", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_verticalScrollBar", _descriptor11, _assertThisInitialized(_this));

      _this._topBoundary = 0;
      _this._bottomBoundary = 0;
      _this._leftBoundary = 0;
      _this._rightBoundary = 0;
      _this._touchMoveDisplacements = [];
      _this._touchMoveTimeDeltas = [];
      _this._touchMovePreviousTimestamp = 0;
      _this._touchMoved = false;
      _this._autoScrollAttenuate = false;
      _this._autoScrollStartPosition = new _index5.Vec3();
      _this._autoScrollTargetDelta = new _index5.Vec3();
      _this._autoScrollTotalTime = 0;
      _this._autoScrollAccumulatedTime = 0;
      _this._autoScrollCurrentlyOutOfBoundary = false;
      _this._autoScrollBraking = false;
      _this._autoScrollBrakingStartPosition = new _index5.Vec3();
      _this._outOfBoundaryAmount = new _index5.Vec3();
      _this._outOfBoundaryAmountDirty = true;
      _this._stopMouseWheel = false;
      _this._mouseWheelEventElapsedTime = 0.0;
      _this._isScrollEndedWithThresholdEventFired = false;
      _this._scrollEventEmitMask = 0;
      _this._isBouncing = false;
      _this._contentPos = new _index5.Vec3();
      _this._deltaPos = new _index5.Vec3();
      return _this;
    }

    _createClass(ScrollView, [{
      key: "scrollToBottom",

      /**
       * @en
       * Scroll the content to the bottom boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图底部。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到底部边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the bottom of the view.
       * scrollView.scrollToBottom(0.1);
       * ```
       */
      value: function scrollToBottom(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, 0),
          applyToHorizontal: false,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta, true);
        }
      }
      /**
       * @en
       * Scroll the content to the top boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图顶部。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到顶部边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the top of the view.
       * scrollView.scrollToTop(0.1);
       * ```
       */

    }, {
      key: "scrollToTop",
      value: function scrollToTop(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, 1),
          applyToHorizontal: false,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the left boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图左边。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左边边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the left of the view.
       * scrollView.scrollToLeft(0.1);
       * ```
       */

    }, {
      key: "scrollToLeft",
      value: function scrollToLeft(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, 0),
          applyToHorizontal: true,
          applyToVertical: false
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the right boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图右边。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右边边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the right of the view.
       * scrollView.scrollToRight(0.1);
       * ```
       */

    }, {
      key: "scrollToRight",
      value: function scrollToRight(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(1, 0),
          applyToHorizontal: true,
          applyToVertical: false
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the top left boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图左上角。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左上边边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the upper left corner of the view.
       * scrollView.scrollToTopLeft(0.1);
       * ```
       */

    }, {
      key: "scrollToTopLeft",
      value: function scrollToTopLeft(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, 1),
          applyToHorizontal: true,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the top right boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图右上角。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右上边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the top right corner of the view.
       * scrollView.scrollToTopRight(0.1);
       * ```
       */

    }, {
      key: "scrollToTopRight",
      value: function scrollToTopRight(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(1, 1),
          applyToHorizontal: true,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the bottom left boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图左下角。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到左下边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the lower left corner of the view.
       * scrollView.scrollToBottomLeft(0.1);
       * ```
       */

    }, {
      key: "scrollToBottomLeft",
      value: function scrollToBottomLeft(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, 0),
          applyToHorizontal: true,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the bottom right boundary of ScrollView.
       *
       * @zh
       * 视图内容将在规定时间内滚动到视图右下角。
       *
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到右边下边界。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to the lower right corner of the view.
       * scrollView.scrollToBottomRight(0.1);
       * ```
       */

    }, {
      key: "scrollToBottomRight",
      value: function scrollToBottomRight(timeInSecond) {
        var attenuated = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(1, 0),
          applyToHorizontal: true,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll with an offset related to the ScrollView's top left origin, if timeInSecond is omitted, then it will jump to the specific offset immediately.
       *
       * @zh
       * 视图内容在规定时间内将滚动到 ScrollView 相对左上角原点的偏移位置, 如果 timeInSecond 参数不传，则立即滚动到指定偏移位置。
       *
       * @param offset - 指定移动偏移量。
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定偏移量处。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to middle position in 0.1 second in x-axis
       * let maxScrollOffset = this.getMaxScrollOffset();
       * scrollView.scrollToOffset(new Vec3(maxScrollOffset.x / 2, 0, 0), 0.1);
       * ```
       */

    }, {
      key: "scrollToOffset",
      value: function scrollToOffset(offset, timeInSecond) {
        var attenuated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var maxScrollOffset = this.getMaxScrollOffset();
        var anchor = new _index5.Vec2(0, 0); // if maxScrollOffset is 0, then always align the content's top left origin to the top left corner of its parent

        if (maxScrollOffset.x === 0) {
          anchor.x = 0;
        } else {
          anchor.x = offset.x / maxScrollOffset.x;
        }

        if (maxScrollOffset.y === 0) {
          anchor.y = 1;
        } else {
          anchor.y = (maxScrollOffset.y - offset.y) / maxScrollOffset.y;
        }

        this.scrollTo(anchor, timeInSecond, attenuated);
      }
      /**
       * @en
       * Get the positive offset value corresponds to the content's top left boundary.
       *
       * @zh
       * 获取滚动视图相对于左上角原点的当前滚动偏移。
       *
       * @return - 当前滚动偏移量。
       */

    }, {
      key: "getScrollOffset",
      value: function getScrollOffset() {
        var topDelta = this._getContentTopBoundary() - this._topBoundary;

        var leftDelta = this._getContentLeftBoundary() - this._leftBoundary;

        return new _index5.Vec3(leftDelta, topDelta, 0);
      }
      /**
       * @en
       * Get the maximize available  scroll offset.
       *
       * @zh
       * 获取滚动视图最大可以滚动的偏移量。
       *
       * @return - 最大可滚动偏移量。
       */

    }, {
      key: "getMaxScrollOffset",
      value: function getMaxScrollOffset() {
        if (!this._content || !this.view) {
          return ZERO;
        }

        var contentSize = this._content._uiProps.uiTransformComp.contentSize;
        var horizontalMaximizeOffset = contentSize.width - this.view.width;
        var verticalMaximizeOffset = contentSize.height - this.view.height;
        horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
        verticalMaximizeOffset = verticalMaximizeOffset >= 0 ? verticalMaximizeOffset : 0;
        return new _index5.Vec3(horizontalMaximizeOffset, verticalMaximizeOffset, 0);
      }
      /**
       * @en
       * Scroll the content to the horizontal percent position of ScrollView.
       *
       * @zh
       * 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
       *
       * @param percent - 0 - 之间的百分比。
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定水平百分比位置。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Scroll to middle position.
       * scrollView.scrollToBottomRight(0.5, 0.1);
       * ```
       */

    }, {
      key: "scrollToPercentHorizontal",
      value: function scrollToPercentHorizontal(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(percent, 0),
          applyToHorizontal: true,
          applyToVertical: false
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the percent position of ScrollView in any direction.
       *
       * @zh
       * 视图内容在规定时间内进行垂直方向和水平方向的滚动，并且滚动到指定百分比位置上。
       *
       * @param anchor - 在 new Vec2(0,0) and new Vec2(1,1) 上取差值的一个点。
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定水平或垂直百分比位置。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * // Vertical scroll to the bottom of the view.
       * scrollView.scrollTo(new Vec2(0, 1), 0.1);
       *
       * // Horizontal scroll to view right.
       * scrollView.scrollTo(new Vec2(1, 0), 0.1);
       * ```
       */

    }, {
      key: "scrollTo",
      value: function scrollTo(anchor, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(anchor),
          applyToHorizontal: true,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Scroll the content to the vertical percent position of ScrollView.
       *
       * @zh
       * 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
       *
       * @param percent - 0 - 1 之间的百分比。
       * @param timeInSecond - 滚动时间（s）。 如果超时，内容将立即跳到指定垂直百分比位置。
       * @param attenuated - 滚动加速是否衰减，默认为 true。
       * @example
       * ```ts
       * scrollView.scrollToPercentVertical(0.5, 0.1);
       * ```
       */

    }, {
      key: "scrollToPercentVertical",
      value: function scrollToPercentVertical(percent, timeInSecond, attenuated) {
        var moveDelta = this._calculateMovePercentDelta({
          anchor: new _index5.Vec2(0, percent),
          applyToHorizontal: false,
          applyToVertical: true
        });

        if (timeInSecond) {
          this._startAutoScroll(moveDelta, timeInSecond, attenuated);
        } else {
          this._moveContent(moveDelta);
        }
      }
      /**
       * @en
       * Stop auto scroll immediately.
       *
       * @zh
       * 停止自动滚动, 调用此 API 可以让 ScrollView 立即停止滚动。
       */

    }, {
      key: "stopAutoScroll",
      value: function stopAutoScroll() {
        this._autoScrolling = false;
        this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
      }
      /**
       * @en
       * Modify the content position.
       *
       * @zh
       * 设置当前视图内容的坐标点。
       *
       * @param position - 当前视图坐标点.
       */

    }, {
      key: "setContentPosition",
      value: function setContentPosition(position) {
        if (!this._content) {
          return;
        }

        var contentPos = this.getContentPosition();

        if (Math.abs(position.x - contentPos.x) < EPSILON && Math.abs(position.y - contentPos.y) < EPSILON) {
          return;
        }

        this._content.setPosition(position);

        this._outOfBoundaryAmountDirty = true;
      }
      /**
       * @en
       * Query the content's position in its parent space.
       *
       * @zh
       * 获取当前视图内容的坐标点。
       *
       * @returns - 当前视图内容的坐标点.
       */

    }, {
      key: "getContentPosition",
      value: function getContentPosition() {
        if (!this._content) {
          return ZERO;
        }

        this._contentPos.set(this._content.position);

        return this._contentPos;
      }
      /**
       * @en
       * Query whether the user is currently dragging the ScrollView to scroll it.
       *
       * @zh
       * 用户是否在拖拽当前滚动视图。
       *
       * @returns - 是否在拖拽当前滚动视图。
       */

    }, {
      key: "isScrolling",
      value: function isScrolling() {
        return this._scrolling;
      }
      /**
       * @en
       * Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
       *
       * @zh
       * 当前滚动视图是否在惯性滚动。
       *
       * @returns - 滚动视图是否在惯性滚动。
       */

    }, {
      key: "isAutoScrolling",
      value: function isAutoScrolling() {
        return this._autoScrolling;
      }
    }, {
      key: "getScrollEndedEventTiming",
      value: function getScrollEndedEventTiming() {
        return EPSILON;
      }
    }, {
      key: "start",
      value: function start() {
        this._calculateBoundary(); // Because widget component will adjust content position and scrollView position is correct after visit
        // So this event could make sure the content is on the correct position after loading.


        if (this._content) {
          _director.director.once(_director.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this._registerEvent();

          if (this._content) {
            this._content.on(_node.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);

            this._content.on(_node.Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);

            if (this.view) {
              this.view.node.on(_node.Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
              this.view.node.on(_node.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
            }
          }

          this._calculateBoundary();
        }

        this._updateScrollBarState();
      }
    }, {
      key: "update",
      value: function update(dt) {
        if (this._autoScrolling) {
          this._processAutoScrolling(dt);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this._unregisterEvent();

          if (this._content) {
            this._content.off(_node.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);

            this._content.off(_node.Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);

            if (this.view) {
              this.view.node.off(_node.Node.EventType.TRANSFORM_CHANGED, this._scaleChanged, this);
              this.view.node.off(_node.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
            }
          }
        }

        this._hideScrollBar();

        this.stopAutoScroll();
      } // private methods

    }, {
      key: "_registerEvent",
      value: function _registerEvent() {
        this.node.on(_node.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(_node.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(_node.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(_node.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(_node.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
      }
    }, {
      key: "_unregisterEvent",
      value: function _unregisterEvent() {
        this.node.off(_node.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(_node.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(_node.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(_node.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off(_node.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
      }
    }, {
      key: "_onMouseWheel",
      value: function _onMouseWheel(event, captureListeners) {
        if (!this.enabledInHierarchy) {
          return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
          return;
        }

        var deltaMove = new _index5.Vec3();
        var wheelPrecision = -0.1;
        var scrollY = event.getScrollY();

        if (this.vertical) {
          deltaMove.set(0, scrollY * wheelPrecision, 0);
        } else if (this.horizontal) {
          deltaMove.set(scrollY * wheelPrecision, 0, 0);
        }

        this._mouseWheelEventElapsedTime = 0;

        this._processDeltaMove(deltaMove);

        if (!this._stopMouseWheel) {
          this._handlePressLogic();

          this.schedule(this._checkMouseWheel, 1.0 / 60, NaN, 0);
          this._stopMouseWheel = true;
        }

        this._stopPropagationIfTargetIsMe(event);
      }
    }, {
      key: "_onTouchBegan",
      value: function _onTouchBegan(event, captureListeners) {
        if (!this.enabledInHierarchy || !this._content) {
          return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
          return;
        }

        this._handlePressLogic();

        this._touchMoved = false;

        this._stopPropagationIfTargetIsMe(event);
      }
    }, {
      key: "_onTouchMoved",
      value: function _onTouchMoved(event, captureListeners) {
        if (!this.enabledInHierarchy || !this._content) {
          return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
          return;
        }

        var touch = event.touch;

        this._handleMoveLogic(touch); // Do not prevent touch events in inner nodes


        if (!this.cancelInnerEvents) {
          return;
        }

        var deltaMove = touch.getUILocation(_tempVec2);
        deltaMove.subtract(touch.getUIStartLocation(_tempVec2_1)); // FIXME: touch move delta should be calculated by DPI.

        if (deltaMove.length() > 7) {
          if (!this._touchMoved && event.target !== this.node) {
            // Simulate touch cancel for target node
            var cancelEvent = new _index4.EventTouch(event.getTouches(), event.bubbles);
            cancelEvent.type = _node.Node.EventType.TOUCH_CANCEL;
            cancelEvent.touch = event.touch;
            cancelEvent.simulate = true;
            event.target.dispatchEvent(cancelEvent);
            this._touchMoved = true;
          }
        }

        this._stopPropagationIfTargetIsMe(event);
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event, captureListeners) {
        if (!this.enabledInHierarchy || !this._content || !event) {
          return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
          return;
        }

        this._dispatchEvent(EventType.TOUCH_UP);

        var touch = event.touch;

        this._handleReleaseLogic(touch);

        if (this._touchMoved) {
          event.propagationStopped = true;
        } else {
          this._stopPropagationIfTargetIsMe(event);
        }
      }
    }, {
      key: "_onTouchCancelled",
      value: function _onTouchCancelled(event, captureListeners) {
        if (!this.enabledInHierarchy || !this._content) {
          return;
        }

        if (this._hasNestedViewGroup(event, captureListeners)) {
          return;
        } // Filter touch cancel event send from self


        if (event && !event.simulate) {
          var touch = event.touch;

          this._handleReleaseLogic(touch);
        }

        this._stopPropagationIfTargetIsMe(event);
      }
    }, {
      key: "_calculateBoundary",
      value: function _calculateBoundary() {
        if (this._content && this.view) {
          // refresh content size
          var layout = this._content.getComponent(_layout.Layout);

          if (layout && layout.enabledInHierarchy) {
            layout.updateLayout();
          }

          var viewTrans = this.view;
          var anchorX = viewTrans.width * viewTrans.anchorX;
          var anchorY = viewTrans.height * viewTrans.anchorY;
          this._leftBoundary = -anchorX;
          this._bottomBoundary = -anchorY;
          this._rightBoundary = this._leftBoundary + viewTrans.width;
          this._topBoundary = this._bottomBoundary + viewTrans.height;

          this._moveContentToTopLeft(viewTrans.contentSize);
        }
      }
    }, {
      key: "_hasNestedViewGroup",
      value: function _hasNestedViewGroup(event, captureListeners) {
        if (!event || event.eventPhase !== _index3.Event.CAPTURING_PHASE) {
          return;
        }

        if (captureListeners) {
          // captureListeners are arranged from child to parent
          var _iterator = _createForOfIteratorHelper(captureListeners),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var listener = _step.value;
              var item = listener;

              if (this.node === item) {
                if (event.target && event.target.getComponent(_viewGroup.ViewGroup)) {
                  return true;
                }

                return false;
              }

              if (item.getComponent(_viewGroup.ViewGroup)) {
                return true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }

        return false;
      }
    }, {
      key: "_startInertiaScroll",
      value: function _startInertiaScroll(touchMoveVelocity) {
        var inertiaTotalMovement = new _index5.Vec3(touchMoveVelocity);
        inertiaTotalMovement.multiplyScalar(MOVEMENT_FACTOR);

        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
      }
    }, {
      key: "_calculateAttenuatedFactor",
      value: function _calculateAttenuatedFactor(distance) {
        if (this.brake <= 0) {
          return 1 - this.brake;
        } // attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters


        return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
      }
    }, {
      key: "_startAttenuatingAutoScroll",
      value: function _startAttenuatingAutoScroll(deltaMove, initialVelocity) {
        var targetDelta = new _index5.Vec3(deltaMove);
        targetDelta.normalize();

        if (this._content && this.view) {
          var contentSize = this._content._uiProps.uiTransformComp.contentSize;
          var scrollViewSize = this.view.contentSize;
          var totalMoveWidth = contentSize.width - scrollViewSize.width;
          var totalMoveHeight = contentSize.height - scrollViewSize.height;

          var attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);

          var attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

          targetDelta.x = targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX;
          targetDelta.y = targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake);
          targetDelta.z = 0;
        }

        var originalMoveLength = deltaMove.length();
        var factor = targetDelta.length() / originalMoveLength;
        targetDelta.add(deltaMove);

        if (this.brake > 0 && factor > 7) {
          factor = Math.sqrt(factor);
          var a = new _index5.Vec3(deltaMove);
          a.multiplyScalar(factor);
          targetDelta.set(a);
          targetDelta.add(deltaMove);
        }

        var time = this._calculateAutoScrollTimeByInitialSpeed(initialVelocity.length());

        if (this.brake > 0 && factor > 3) {
          factor = 3;
          time = time * factor;
        }

        if (this.brake === 0 && factor > 1) {
          time = time * factor;
        }

        this._startAutoScroll(targetDelta, time, true);
      }
    }, {
      key: "_calculateAutoScrollTimeByInitialSpeed",
      value: function _calculateAutoScrollTimeByInitialSpeed(initialSpeed) {
        return Math.sqrt(Math.sqrt(initialSpeed / 5));
      }
    }, {
      key: "_startAutoScroll",
      value: function _startAutoScroll(deltaMove, timeInSecond) {
        var attenuated = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        var adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;

        _index5.Vec3.copy(this._autoScrollStartPosition, this.getContentPosition());

        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._isScrollEndedWithThresholdEventFired = false;
        this._autoScrollBrakingStartPosition = new _index5.Vec3();

        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

        if (!currentOutOfBoundary.equals(ZERO, EPSILON)) {
          this._autoScrollCurrentlyOutOfBoundary = true;
        }
      }
    }, {
      key: "_calculateTouchMoveVelocity",
      value: function _calculateTouchMoveVelocity() {
        var totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
          return a + b;
        }, totalTime);

        if (totalTime <= 0 || totalTime >= 0.5) {
          return new _index5.Vec3();
        }

        var totalMovement = new _index5.Vec3();
        totalMovement = this._touchMoveDisplacements.reduce(function (a, b) {
          a.add(b);
          return a;
        }, totalMovement);
        return new _index5.Vec3(totalMovement.x * (1 - this.brake) / totalTime, totalMovement.y * (1 - this.brake) / totalTime, 0);
      }
    }, {
      key: "_flattenVectorByDirection",
      value: function _flattenVectorByDirection(vector) {
        var result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
      }
    }, {
      key: "_moveContent",
      value: function _moveContent(deltaMove, canStartBounceBack) {
        var adjustedMove = this._flattenVectorByDirection(deltaMove);

        _tempVec3.set(this.getContentPosition());

        _tempVec3.add(adjustedMove);

        _tempVec3.set(Math.floor(_tempVec3.x * TOLERANCE) * EPSILON, Math.floor(_tempVec3.y * TOLERANCE) * EPSILON, _tempVec3.z);

        this.setContentPosition(_tempVec3);

        var outOfBoundary = this._getHowMuchOutOfBoundary();

        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
          this._startBounceBackIfNeeded();
        }
      }
    }, {
      key: "_getContentLeftBoundary",
      value: function _getContentLeftBoundary() {
        if (!this._content) {
          return -1;
        }

        var contentPos = this.getContentPosition();
        var uiTrans = this._content._uiProps.uiTransformComp;
        return contentPos.x - uiTrans.anchorX * uiTrans.width;
      }
    }, {
      key: "_getContentRightBoundary",
      value: function _getContentRightBoundary() {
        if (!this._content) {
          return -1;
        }

        var uiTrans = this._content._uiProps.uiTransformComp;
        return this._getContentLeftBoundary() + uiTrans.width;
      }
    }, {
      key: "_getContentTopBoundary",
      value: function _getContentTopBoundary() {
        if (!this._content) {
          return -1;
        }

        var uiTrans = this._content._uiProps.uiTransformComp;
        return this._getContentBottomBoundary() + uiTrans.height;
      }
    }, {
      key: "_getContentBottomBoundary",
      value: function _getContentBottomBoundary() {
        if (!this._content) {
          return -1;
        }

        var contentPos = this.getContentPosition();
        var uiTrans = this._content._uiProps.uiTransformComp;
        return contentPos.y - uiTrans.anchorY * uiTrans.height;
      }
    }, {
      key: "_getHowMuchOutOfBoundary",
      value: function _getHowMuchOutOfBoundary(addition) {
        addition = addition || new _index5.Vec3();

        if (addition.equals(ZERO, EPSILON) && !this._outOfBoundaryAmountDirty) {
          return this._outOfBoundaryAmount;
        }

        var outOfBoundaryAmount = new _index5.Vec3();

        if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
          outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
        } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
          outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
        }

        if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
          outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
        } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
          outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
        }

        if (addition.equals(ZERO, EPSILON)) {
          this._outOfBoundaryAmount = outOfBoundaryAmount;
          this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);
        return outOfBoundaryAmount;
      }
    }, {
      key: "_updateScrollBar",
      value: function _updateScrollBar(outOfBoundary) {
        if (this._horizontalScrollBar) {
          this._horizontalScrollBar.onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
          this.verticalScrollBar.onScroll(outOfBoundary);
        }
      }
    }, {
      key: "_onScrollBarTouchBegan",
      value: function _onScrollBarTouchBegan() {
        if (this._horizontalScrollBar) {
          this._horizontalScrollBar.onTouchBegan();
        }

        if (this.verticalScrollBar) {
          this.verticalScrollBar.onTouchBegan();
        }
      }
    }, {
      key: "_onScrollBarTouchEnded",
      value: function _onScrollBarTouchEnded() {
        if (this._horizontalScrollBar) {
          this._horizontalScrollBar.onTouchEnded();
        }

        if (this.verticalScrollBar) {
          this.verticalScrollBar.onTouchEnded();
        }
      }
    }, {
      key: "_dispatchEvent",
      value: function _dispatchEvent(event) {
        if (event === EventType.SCROLL_ENDED) {
          this._scrollEventEmitMask = 0;
        } else if (event === EventType.SCROLL_TO_TOP || event === EventType.SCROLL_TO_BOTTOM || event === EventType.SCROLL_TO_LEFT || event === EventType.SCROLL_TO_RIGHT) {
          var flag = 1 << eventMap[event];

          if (this._scrollEventEmitMask & flag) {
            return;
          } else {
            this._scrollEventEmitMask |= flag;
          }
        }

        _componentEventHandler.EventHandler.emitEvents(this.scrollEvents, this, eventMap[event]);

        this.node.emit(event, this);
      }
    }, {
      key: "_adjustContentOutOfBoundary",
      value: function _adjustContentOutOfBoundary() {
        if (!this._content) {
          return;
        }

        this._outOfBoundaryAmountDirty = true;

        if (this._isOutOfBoundary()) {
          var outOfBoundary = this._getHowMuchOutOfBoundary();

          _tempVec3.set(this.getContentPosition());

          _tempVec3.add(outOfBoundary);

          this._content.setPosition(_tempVec3);

          this._updateScrollBar(ZERO);
        }
      }
    }, {
      key: "_hideScrollBar",
      value: function _hideScrollBar() {
        if (this._horizontalScrollBar) {
          this._horizontalScrollBar.hide();
        }

        if (this._verticalScrollBar) {
          this._verticalScrollBar.hide();
        }
      }
    }, {
      key: "_updateScrollBarState",
      value: function _updateScrollBarState() {
        if (!this._content || !this.view) {
          return;
        }

        var viewTrans = this.view;
        var uiTrans = this._content._uiProps.uiTransformComp;

        if (this.verticalScrollBar) {
          if (uiTrans.height < viewTrans.height) {
            this.verticalScrollBar.hide();
          } else {
            this.verticalScrollBar.show();
          }
        }

        if (this.horizontalScrollBar) {
          if (uiTrans.width < viewTrans.width) {
            this.horizontalScrollBar.hide();
          } else {
            this.horizontalScrollBar.show();
          }
        }
      } // This is for ScrollView as children of a Button

    }, {
      key: "_stopPropagationIfTargetIsMe",
      value: function _stopPropagationIfTargetIsMe(event) {
        if (event.eventPhase === _index3.Event.AT_TARGET && event.target === this.node) {
          event.propagationStopped = true;
        }
      }
    }, {
      key: "_processDeltaMove",
      value: function _processDeltaMove(deltaMove) {
        this._scrollChildren(deltaMove);

        this._gatherTouchMove(deltaMove);
      }
    }, {
      key: "_handleMoveLogic",
      value: function _handleMoveLogic(touch) {
        this._deltaPos.set(this._getLocalAxisAlignDelta(touch));

        this._processDeltaMove(this._deltaPos);
      }
    }, {
      key: "_handleReleaseLogic",
      value: function _handleReleaseLogic(touch) {
        this._deltaPos.set(this._getLocalAxisAlignDelta(touch));

        this._gatherTouchMove(this._deltaPos);

        this._processInertiaScroll();

        if (this._scrolling) {
          this._scrolling = false;

          if (!this._autoScrolling) {
            this._dispatchEvent(EventType.SCROLL_ENDED);
          }
        }
      }
    }, {
      key: "_getLocalAxisAlignDelta",
      value: function _getLocalAxisAlignDelta(touch) {
        var uiTransformComp = this.node._uiProps.uiTransformComp;
        var vec = new _index5.Vec3();

        if (uiTransformComp) {
          touch.getUILocation(_tempVec2);
          touch.getUIPreviousLocation(_tempVec2_1);

          _tempVec3.set(_tempVec2.x, _tempVec2.y, 0);

          _tempVec3_1.set(_tempVec2_1.x, _tempVec2_1.y, 0);

          uiTransformComp.convertToNodeSpaceAR(_tempVec3, _tempVec3);
          uiTransformComp.convertToNodeSpaceAR(_tempVec3_1, _tempVec3_1);

          _index5.Vec3.subtract(vec, _tempVec3, _tempVec3_1);
        }

        return vec;
      }
    }, {
      key: "_scrollChildren",
      value: function _scrollChildren(deltaMove) {
        deltaMove = this._clampDelta(deltaMove);
        var realMove = deltaMove;
        var outOfBoundary;

        if (this.elastic) {
          outOfBoundary = this._getHowMuchOutOfBoundary();
          realMove.x *= outOfBoundary.x === 0 ? 1 : 0.5;
          realMove.y *= outOfBoundary.y === 0 ? 1 : 0.5;
        }

        if (!this.elastic) {
          outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
          realMove.add(outOfBoundary);
        }

        var scrollEventType;

        if (this._content) {
          var _ref = this._content._uiProps.uiTransformComp,
              anchorX = _ref.anchorX,
              anchorY = _ref.anchorY,
              width = _ref.width,
              height = _ref.height;
          var pos = this._content.position || ZERO;

          if (realMove.y > 0) {
            // up
            var icBottomPos = pos.y - anchorY * height;

            if (icBottomPos + realMove.y >= this._bottomBoundary) {
              scrollEventType = EventType.SCROLL_TO_BOTTOM;
            }
          } else if (realMove.y < 0) {
            // down
            var icTopPos = pos.y - anchorY * height + height;

            if (icTopPos + realMove.y <= this._topBoundary) {
              scrollEventType = EventType.SCROLL_TO_TOP;
            }
          }

          if (realMove.x < 0) {
            // left
            var icRightPos = pos.x - anchorX * width + width;

            if (icRightPos + realMove.x <= this._rightBoundary) {
              scrollEventType = EventType.SCROLL_TO_RIGHT;
            }
          } else if (realMove.x > 0) {
            // right
            var icLeftPos = pos.x - anchorX * width;

            if (icLeftPos + realMove.x >= this._leftBoundary) {
              scrollEventType = EventType.SCROLL_TO_LEFT;
            }
          }
        }

        this._moveContent(realMove, false);

        if (realMove.x !== 0 || realMove.y !== 0) {
          if (!this._scrolling) {
            this._scrolling = true;

            this._dispatchEvent(EventType.SCROLL_BEGAN);
          }

          this._dispatchEvent(EventType.SCROLLING);
        }

        if (scrollEventType && scrollEventType.length > 0) {
          this._dispatchEvent(scrollEventType);
        }
      }
    }, {
      key: "_handlePressLogic",
      value: function _handlePressLogic() {
        if (this._autoScrolling) {
          this._dispatchEvent(EventType.SCROLL_ENDED);
        }

        this._autoScrolling = false;
        this._isBouncing = false;
        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements.length = 0;
        this._touchMoveTimeDeltas.length = 0;

        this._onScrollBarTouchBegan();
      }
    }, {
      key: "_clampDelta",
      value: function _clampDelta(delta) {
        if (this._content && this.view) {
          var scrollViewSize = this.view.contentSize;
          var uiTrans = this._content._uiProps.uiTransformComp;

          if (uiTrans.width < scrollViewSize.width) {
            delta.x = 0;
          }

          if (uiTrans.height < scrollViewSize.height) {
            delta.y = 0;
          }
        }

        return delta;
      }
    }, {
      key: "_gatherTouchMove",
      value: function _gatherTouchMove(delta) {
        var clampDt = delta.clone();

        this._clampDelta(clampDt);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
          this._touchMoveDisplacements.shift();

          this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(clampDt);

        var timeStamp = getTimeInMilliseconds();

        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);

        this._touchMovePreviousTimestamp = timeStamp;
      }
    }, {
      key: "_startBounceBackIfNeeded",
      value: function _startBounceBackIfNeeded() {
        if (!this.elastic) {
          return false;
        }

        var bounceBackAmount = this._getHowMuchOutOfBoundary();

        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (bounceBackAmount.equals(ZERO, EPSILON)) {
          return false;
        }

        var bounceBackTime = Math.max(this.bounceDuration, 0);

        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        if (!this._isBouncing) {
          if (bounceBackAmount.y > 0) {
            this._dispatchEvent(EventType.BOUNCE_TOP);
          }

          if (bounceBackAmount.y < 0) {
            this._dispatchEvent(EventType.BOUNCE_BOTTOM);
          }

          if (bounceBackAmount.x > 0) {
            this._dispatchEvent(EventType.BOUNCE_RIGHT);
          }

          if (bounceBackAmount.x < 0) {
            this._dispatchEvent(EventType.BOUNCE_LEFT);
          }

          this._isBouncing = true;
        }

        return true;
      }
    }, {
      key: "_processInertiaScroll",
      value: function _processInertiaScroll() {
        var bounceBackStarted = this._startBounceBackIfNeeded();

        if (!bounceBackStarted && this.inertia) {
          var touchMoveVelocity = this._calculateTouchMoveVelocity();

          if (!touchMoveVelocity.equals(_tempVec3, EPSILON) && this.brake < 1) {
            this._startInertiaScroll(touchMoveVelocity);
          }
        }

        this._onScrollBarTouchEnded();
      }
    }, {
      key: "_isOutOfBoundary",
      value: function _isOutOfBoundary() {
        var outOfBoundary = this._getHowMuchOutOfBoundary();

        return !outOfBoundary.equals(ZERO, EPSILON);
      }
    }, {
      key: "_isNecessaryAutoScrollBrake",
      value: function _isNecessaryAutoScrollBrake() {
        if (this._autoScrollBraking) {
          return true;
        }

        if (this._isOutOfBoundary()) {
          if (!this._autoScrollCurrentlyOutOfBoundary) {
            this._autoScrollCurrentlyOutOfBoundary = true;
            this._autoScrollBraking = true;
            this._autoScrollBrakingStartPosition = this.getContentPosition();
            return true;
          }
        } else {
          this._autoScrollCurrentlyOutOfBoundary = false;
        }

        return false;
      }
    }, {
      key: "_processAutoScrolling",
      value: function _processAutoScrolling(dt) {
        var isAutoScrollBrake = this._isNecessaryAutoScrollBrake();

        var brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);
        var percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);

        if (this._autoScrollAttenuate) {
          percentage = quintEaseOut(percentage);
        }

        var a = new _index5.Vec3(this._autoScrollTargetDelta);
        a.multiplyScalar(percentage);
        var newPosition = new _index5.Vec3(this._autoScrollStartPosition);
        newPosition.add(a);
        var reachedEnd = Math.abs(percentage - 1) <= EPSILON;
        var fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();

        if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
          this._dispatchEvent(EventType.SCROLL_ENG_WITH_THRESHOLD);

          this._isScrollEndedWithThresholdEventFired = true;
        }

        if (this.elastic) {
          var brakeOffsetPosition = new _index5.Vec3(newPosition);
          brakeOffsetPosition.subtract(this._autoScrollBrakingStartPosition);

          if (isAutoScrollBrake) {
            brakeOffsetPosition.multiplyScalar(brakingFactor);
          }

          newPosition.set(this._autoScrollBrakingStartPosition);
          newPosition.add(brakeOffsetPosition);
        } else {
          var moveDelta = new _index5.Vec3(newPosition);
          moveDelta.subtract(this.getContentPosition());

          var outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);

          if (!outOfBoundary.equals(ZERO, EPSILON)) {
            newPosition.add(outOfBoundary);
            reachedEnd = true;
          }
        }

        if (reachedEnd) {
          this._autoScrolling = false;
        }

        var deltaMove = new _index5.Vec3(newPosition);
        deltaMove.subtract(this.getContentPosition());

        this._moveContent(this._clampDelta(deltaMove), reachedEnd);

        this._dispatchEvent(EventType.SCROLLING);

        if (!this._autoScrolling) {
          this._isBouncing = false;
          this._scrolling = false;

          this._dispatchEvent(EventType.SCROLL_ENDED);
        }
      }
    }, {
      key: "_checkMouseWheel",
      value: function _checkMouseWheel(dt) {
        var currentOutOfBoundary = this._getHowMuchOutOfBoundary();

        var maxElapsedTime = 0.1;

        if (!currentOutOfBoundary.equals(ZERO, EPSILON)) {
          this._processInertiaScroll();

          this.unschedule(this._checkMouseWheel);

          this._dispatchEvent(EventType.SCROLL_ENDED);

          this._stopMouseWheel = false;
          return;
        }

        this._mouseWheelEventElapsedTime += dt; // mouse wheel event is ended

        if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
          this._onScrollBarTouchEnded();

          this.unschedule(this._checkMouseWheel);

          this._dispatchEvent(EventType.SCROLL_ENDED);

          this._stopMouseWheel = false;
        }
      }
    }, {
      key: "_calculateMovePercentDelta",
      value: function _calculateMovePercentDelta(options) {
        var anchor = options.anchor;
        var applyToHorizontal = options.applyToHorizontal;
        var applyToVertical = options.applyToVertical;

        this._calculateBoundary();

        anchor.clampf(new _index5.Vec2(0, 0), new _index5.Vec2(1, 1));

        var bottomDelta = this._getContentBottomBoundary() - this._bottomBoundary;

        bottomDelta = -bottomDelta;

        var leftDelta = this._getContentLeftBoundary() - this._leftBoundary;

        leftDelta = -leftDelta;
        var moveDelta = new _index5.Vec3();

        if (this._content && this.view) {
          var totalScrollDelta = 0;
          var uiTrans = this._content._uiProps.uiTransformComp;
          var contentSize = uiTrans.contentSize;
          var scrollSize = this.view.contentSize;

          if (applyToHorizontal) {
            totalScrollDelta = contentSize.width - scrollSize.width;
            moveDelta.x = leftDelta - totalScrollDelta * anchor.x;
          }

          if (applyToVertical) {
            totalScrollDelta = contentSize.height - scrollSize.height;
            moveDelta.y = bottomDelta - totalScrollDelta * anchor.y;
          }
        }

        return moveDelta;
      }
    }, {
      key: "_moveContentToTopLeft",
      value: function _moveContentToTopLeft(scrollViewSize) {
        var bottomDelta = this._getContentBottomBoundary() - this._bottomBoundary;

        bottomDelta = -bottomDelta;
        var moveDelta = new _index5.Vec3();
        var totalScrollDelta = 0;

        var leftDelta = this._getContentLeftBoundary() - this._leftBoundary;

        leftDelta = -leftDelta; // 是否限制在上视区上边

        if (this._content) {
          var uiTrans = this._content._uiProps.uiTransformComp;
          var contentSize = uiTrans.contentSize;

          if (contentSize.height < scrollViewSize.height) {
            totalScrollDelta = contentSize.height - scrollViewSize.height;
            moveDelta.y = bottomDelta - totalScrollDelta;
          } // 是否限制在上视区左边


          if (contentSize.width < scrollViewSize.width) {
            totalScrollDelta = contentSize.width - scrollViewSize.width;
            moveDelta.x = leftDelta;
          }
        }

        this._updateScrollBarState();

        this._moveContent(moveDelta);

        this._adjustContentOutOfBoundary();
      }
    }, {
      key: "_scaleChanged",
      value: function _scaleChanged(value) {
        if (value === _nodeEnum.TransformBit.SCALE) {
          this._calculateBoundary();
        }
      }
    }, {
      key: "content",

      /**
       * @en
       * This is a reference to the UI element to be scrolled.
       *
       * @zh
       * 可滚动展示内容的节点。
       */
      get: function get() {
        return this._content;
      },
      set: function set(value) {
        if (this._content === value) {
          return;
        }

        var viewTrans = value && value.parent && value.parent._uiProps.uiTransformComp;

        if (value && (!value || !viewTrans)) {
          (0, _index4.logID)(4302);
          return;
        }

        this._content = value;

        this._calculateBoundary();
      }
      /**
       * @en
       * Enable horizontal scroll.
       *
       * @zh
       * 是否开启水平滚动。
       */

    }, {
      key: "horizontalScrollBar",

      /**
       * @en
       * The horizontal scrollbar reference.
       * @zh
       * 水平滚动的 ScrollBar。
       */
      get: function get() {
        return this._horizontalScrollBar;
      },
      set: function set(value) {
        if (this._horizontalScrollBar === value) {
          return;
        }

        this._horizontalScrollBar = value;

        if (this._horizontalScrollBar) {
          this._horizontalScrollBar.setScrollView(this);

          this._updateScrollBar(ZERO);
        }
      }
      /**
       * @en
       * Enable vertical scroll.
       *
       * @zh
       * 是否开启垂直滚动。
       */

    }, {
      key: "verticalScrollBar",

      /**
       * @en
       * The vertical scrollbar reference.
       *
       * @zh
       * 垂直滚动的 ScrollBar。
       */
      get: function get() {
        return this._verticalScrollBar;
      },
      set: function set(value) {
        if (this._verticalScrollBar === value) {
          return;
        }

        this._verticalScrollBar = value;

        if (this._verticalScrollBar) {
          this._verticalScrollBar.setScrollView(this);

          this._updateScrollBar(ZERO);
        }
      }
      /**
       * @en
       * If cancelInnerEvents is set to true, the scroll behavior will cancel touch events on inner content nodes
       * It's set to true by default.
       *
       * @zh
       * 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。<br/>
       * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
       */

    }, {
      key: "view",
      get: function get() {
        var parent = this._content && this._content.parent;

        if (!parent) {
          return null;
        }

        return parent._uiProps.uiTransformComp;
      }
    }]);

    return ScrollView;
  }(_viewGroup.ViewGroup), _class3.EventType = EventType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "bounceDuration", [_index2.serializable, _dec6, _dec7, _dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "brake", [_index2.serializable, _dec9, _dec10, _dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "elastic", [_index2.serializable, _dec12, _dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "inertia", [_index2.serializable, _dec14, _dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "content", [_dec16, _dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "content"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "horizontal", [_index2.serializable, _dec19, _dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "horizontalScrollBar", [_dec21, _dec22, _dec23], Object.getOwnPropertyDescriptor(_class2.prototype, "horizontalScrollBar"), _class2.prototype), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "vertical", [_index2.serializable, _dec24, _dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "verticalScrollBar", [_dec26, _dec27, _dec28], Object.getOwnPropertyDescriptor(_class2.prototype, "verticalScrollBar"), _class2.prototype), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "cancelInnerEvents", [_index2.serializable, _dec29, _dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "scrollEvents", [_dec31, _index2.serializable, _dec32, _dec33], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_content", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_horizontalScrollBar", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_verticalScrollBar", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-to-top
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-to-bottom
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-to-left
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-to-right
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scrolling
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event bounce-bottom
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event bounce-top
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event bounce-left
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event bounce-right
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-ended
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event touch-up
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event scroll-began
   * @param {Event.EventCustom} event
   * @param {ScrollView} scrollView - The ScrollView component.
   */

  _exports.ScrollView = ScrollView;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvc2Nyb2xsLXZpZXcudHMiXSwibmFtZXMiOlsiTlVNQkVSX09GX0dBVEhFUkVEX1RPVUNIRVNfRk9SX01PVkVfU1BFRUQiLCJPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SIiwiRVBTSUxPTiIsIlRPTEVSQU5DRSIsIk1PVkVNRU5UX0ZBQ1RPUiIsIlpFUk8iLCJWZWMzIiwiX3RlbXBWZWMzIiwiX3RlbXBWZWMzXzEiLCJfdGVtcFZlYzIiLCJWZWMyIiwiX3RlbXBWZWMyXzEiLCJxdWludEVhc2VPdXQiLCJ0aW1lIiwiZ2V0VGltZUluTWlsbGlzZWNvbmRzIiwiY3VycmVudFRpbWUiLCJEYXRlIiwiZ2V0TWlsbGlzZWNvbmRzIiwiZXZlbnRNYXAiLCJFdmVudFR5cGUiLCJTY3JvbGxWaWV3IiwiVUlUcmFuc2Zvcm0iLCJOb2RlIiwiU2Nyb2xsQmFyIiwiQ29tcG9uZW50RXZlbnRIYW5kbGVyIiwiX2F1dG9TY3JvbGxpbmciLCJfc2Nyb2xsaW5nIiwiX3RvcEJvdW5kYXJ5IiwiX2JvdHRvbUJvdW5kYXJ5IiwiX2xlZnRCb3VuZGFyeSIsIl9yaWdodEJvdW5kYXJ5IiwiX3RvdWNoTW92ZURpc3BsYWNlbWVudHMiLCJfdG91Y2hNb3ZlVGltZURlbHRhcyIsIl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCIsIl90b3VjaE1vdmVkIiwiX2F1dG9TY3JvbGxBdHRlbnVhdGUiLCJfYXV0b1Njcm9sbFN0YXJ0UG9zaXRpb24iLCJfYXV0b1Njcm9sbFRhcmdldERlbHRhIiwiX2F1dG9TY3JvbGxUb3RhbFRpbWUiLCJfYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSIsIl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSIsIl9hdXRvU2Nyb2xsQnJha2luZyIsIl9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24iLCJfb3V0T2ZCb3VuZGFyeUFtb3VudCIsIl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkiLCJfc3RvcE1vdXNlV2hlZWwiLCJfbW91c2VXaGVlbEV2ZW50RWxhcHNlZFRpbWUiLCJfaXNTY3JvbGxFbmRlZFdpdGhUaHJlc2hvbGRFdmVudEZpcmVkIiwiX3Njcm9sbEV2ZW50RW1pdE1hc2siLCJfaXNCb3VuY2luZyIsIl9jb250ZW50UG9zIiwiX2RlbHRhUG9zIiwidGltZUluU2Vjb25kIiwiYXR0ZW51YXRlZCIsIm1vdmVEZWx0YSIsIl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhIiwiYW5jaG9yIiwiYXBwbHlUb0hvcml6b250YWwiLCJhcHBseVRvVmVydGljYWwiLCJfc3RhcnRBdXRvU2Nyb2xsIiwiX21vdmVDb250ZW50Iiwib2Zmc2V0IiwibWF4U2Nyb2xsT2Zmc2V0IiwiZ2V0TWF4U2Nyb2xsT2Zmc2V0IiwieCIsInkiLCJzY3JvbGxUbyIsInRvcERlbHRhIiwiX2dldENvbnRlbnRUb3BCb3VuZGFyeSIsImxlZnREZWx0YSIsIl9nZXRDb250ZW50TGVmdEJvdW5kYXJ5IiwiX2NvbnRlbnQiLCJ2aWV3IiwiY29udGVudFNpemUiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsImhvcml6b250YWxNYXhpbWl6ZU9mZnNldCIsIndpZHRoIiwidmVydGljYWxNYXhpbWl6ZU9mZnNldCIsImhlaWdodCIsInBlcmNlbnQiLCJwb3NpdGlvbiIsImNvbnRlbnRQb3MiLCJnZXRDb250ZW50UG9zaXRpb24iLCJNYXRoIiwiYWJzIiwic2V0UG9zaXRpb24iLCJzZXQiLCJfY2FsY3VsYXRlQm91bmRhcnkiLCJkaXJlY3RvciIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9EUkFXIiwiX2FkanVzdENvbnRlbnRPdXRPZkJvdW5kYXJ5IiwiRURJVE9SIiwibGVnYWN5Q0MiLCJHQU1FX1ZJRVciLCJfcmVnaXN0ZXJFdmVudCIsIm9uIiwiU0laRV9DSEFOR0VEIiwiVFJBTlNGT1JNX0NIQU5HRUQiLCJfc2NhbGVDaGFuZ2VkIiwibm9kZSIsIl91cGRhdGVTY3JvbGxCYXJTdGF0ZSIsImR0IiwiX3Byb2Nlc3NBdXRvU2Nyb2xsaW5nIiwiX3VucmVnaXN0ZXJFdmVudCIsIm9mZiIsIl9oaWRlU2Nyb2xsQmFyIiwic3RvcEF1dG9TY3JvbGwiLCJUT1VDSF9TVEFSVCIsIl9vblRvdWNoQmVnYW4iLCJUT1VDSF9NT1ZFIiwiX29uVG91Y2hNb3ZlZCIsIlRPVUNIX0VORCIsIl9vblRvdWNoRW5kZWQiLCJUT1VDSF9DQU5DRUwiLCJfb25Ub3VjaENhbmNlbGxlZCIsIk1PVVNFX1dIRUVMIiwiX29uTW91c2VXaGVlbCIsImV2ZW50IiwiY2FwdHVyZUxpc3RlbmVycyIsImVuYWJsZWRJbkhpZXJhcmNoeSIsIl9oYXNOZXN0ZWRWaWV3R3JvdXAiLCJkZWx0YU1vdmUiLCJ3aGVlbFByZWNpc2lvbiIsInNjcm9sbFkiLCJnZXRTY3JvbGxZIiwidmVydGljYWwiLCJob3Jpem9udGFsIiwiX3Byb2Nlc3NEZWx0YU1vdmUiLCJfaGFuZGxlUHJlc3NMb2dpYyIsInNjaGVkdWxlIiwiX2NoZWNrTW91c2VXaGVlbCIsIk5hTiIsIl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUiLCJ0b3VjaCIsIl9oYW5kbGVNb3ZlTG9naWMiLCJjYW5jZWxJbm5lckV2ZW50cyIsImdldFVJTG9jYXRpb24iLCJzdWJ0cmFjdCIsImdldFVJU3RhcnRMb2NhdGlvbiIsImxlbmd0aCIsInRhcmdldCIsImNhbmNlbEV2ZW50IiwiRXZlbnRUb3VjaCIsImdldFRvdWNoZXMiLCJidWJibGVzIiwidHlwZSIsInNpbXVsYXRlIiwiZGlzcGF0Y2hFdmVudCIsIl9kaXNwYXRjaEV2ZW50IiwiVE9VQ0hfVVAiLCJfaGFuZGxlUmVsZWFzZUxvZ2ljIiwicHJvcGFnYXRpb25TdG9wcGVkIiwibGF5b3V0IiwiZ2V0Q29tcG9uZW50IiwiTGF5b3V0IiwidXBkYXRlTGF5b3V0Iiwidmlld1RyYW5zIiwiYW5jaG9yWCIsImFuY2hvclkiLCJfbW92ZUNvbnRlbnRUb1RvcExlZnQiLCJldmVudFBoYXNlIiwiRXZlbnQiLCJDQVBUVVJJTkdfUEhBU0UiLCJsaXN0ZW5lciIsIml0ZW0iLCJWaWV3R3JvdXAiLCJ0b3VjaE1vdmVWZWxvY2l0eSIsImluZXJ0aWFUb3RhbE1vdmVtZW50IiwibXVsdGlwbHlTY2FsYXIiLCJfc3RhcnRBdHRlbnVhdGluZ0F1dG9TY3JvbGwiLCJkaXN0YW5jZSIsImJyYWtlIiwiaW5pdGlhbFZlbG9jaXR5IiwidGFyZ2V0RGVsdGEiLCJub3JtYWxpemUiLCJzY3JvbGxWaWV3U2l6ZSIsInRvdGFsTW92ZVdpZHRoIiwidG90YWxNb3ZlSGVpZ2h0IiwiYXR0ZW51YXRlZEZhY3RvclgiLCJfY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3RvciIsImF0dGVudWF0ZWRGYWN0b3JZIiwieiIsIm9yaWdpbmFsTW92ZUxlbmd0aCIsImZhY3RvciIsImFkZCIsInNxcnQiLCJhIiwiX2NhbGN1bGF0ZUF1dG9TY3JvbGxUaW1lQnlJbml0aWFsU3BlZWQiLCJpbml0aWFsU3BlZWQiLCJhZGp1c3RlZERlbHRhTW92ZSIsIl9mbGF0dGVuVmVjdG9yQnlEaXJlY3Rpb24iLCJjb3B5IiwiY3VycmVudE91dE9mQm91bmRhcnkiLCJfZ2V0SG93TXVjaE91dE9mQm91bmRhcnkiLCJlcXVhbHMiLCJ0b3RhbFRpbWUiLCJyZWR1Y2UiLCJiIiwidG90YWxNb3ZlbWVudCIsInZlY3RvciIsInJlc3VsdCIsImNhblN0YXJ0Qm91bmNlQmFjayIsImFkanVzdGVkTW92ZSIsImZsb29yIiwic2V0Q29udGVudFBvc2l0aW9uIiwib3V0T2ZCb3VuZGFyeSIsIl91cGRhdGVTY3JvbGxCYXIiLCJlbGFzdGljIiwiX3N0YXJ0Qm91bmNlQmFja0lmTmVlZGVkIiwidWlUcmFucyIsIl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkiLCJhZGRpdGlvbiIsIm91dE9mQm91bmRhcnlBbW91bnQiLCJfZ2V0Q29udGVudFJpZ2h0Qm91bmRhcnkiLCJfY2xhbXBEZWx0YSIsIl9ob3Jpem9udGFsU2Nyb2xsQmFyIiwib25TY3JvbGwiLCJ2ZXJ0aWNhbFNjcm9sbEJhciIsIm9uVG91Y2hCZWdhbiIsIm9uVG91Y2hFbmRlZCIsIlNDUk9MTF9FTkRFRCIsIlNDUk9MTF9UT19UT1AiLCJTQ1JPTExfVE9fQk9UVE9NIiwiU0NST0xMX1RPX0xFRlQiLCJTQ1JPTExfVE9fUklHSFQiLCJmbGFnIiwiZW1pdEV2ZW50cyIsInNjcm9sbEV2ZW50cyIsImVtaXQiLCJfaXNPdXRPZkJvdW5kYXJ5IiwiaGlkZSIsIl92ZXJ0aWNhbFNjcm9sbEJhciIsInNob3ciLCJob3Jpem9udGFsU2Nyb2xsQmFyIiwiQVRfVEFSR0VUIiwiX3Njcm9sbENoaWxkcmVuIiwiX2dhdGhlclRvdWNoTW92ZSIsIl9nZXRMb2NhbEF4aXNBbGlnbkRlbHRhIiwiX3Byb2Nlc3NJbmVydGlhU2Nyb2xsIiwidmVjIiwiZ2V0VUlQcmV2aW91c0xvY2F0aW9uIiwiY29udmVydFRvTm9kZVNwYWNlQVIiLCJyZWFsTW92ZSIsInNjcm9sbEV2ZW50VHlwZSIsInBvcyIsImljQm90dG9tUG9zIiwiaWNUb3BQb3MiLCJpY1JpZ2h0UG9zIiwiaWNMZWZ0UG9zIiwiU0NST0xMX0JFR0FOIiwiU0NST0xMSU5HIiwiX29uU2Nyb2xsQmFyVG91Y2hCZWdhbiIsImRlbHRhIiwiY2xhbXBEdCIsImNsb25lIiwic2hpZnQiLCJwdXNoIiwidGltZVN0YW1wIiwiYm91bmNlQmFja0Ftb3VudCIsImJvdW5jZUJhY2tUaW1lIiwibWF4IiwiYm91bmNlRHVyYXRpb24iLCJCT1VOQ0VfVE9QIiwiQk9VTkNFX0JPVFRPTSIsIkJPVU5DRV9SSUdIVCIsIkJPVU5DRV9MRUZUIiwiYm91bmNlQmFja1N0YXJ0ZWQiLCJpbmVydGlhIiwiX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5IiwiX3N0YXJ0SW5lcnRpYVNjcm9sbCIsIl9vblNjcm9sbEJhclRvdWNoRW5kZWQiLCJpc0F1dG9TY3JvbGxCcmFrZSIsIl9pc05lY2Vzc2FyeUF1dG9TY3JvbGxCcmFrZSIsImJyYWtpbmdGYWN0b3IiLCJwZXJjZW50YWdlIiwibWluIiwibmV3UG9zaXRpb24iLCJyZWFjaGVkRW5kIiwiZmlyZUV2ZW50IiwiZ2V0U2Nyb2xsRW5kZWRFdmVudFRpbWluZyIsIlNDUk9MTF9FTkdfV0lUSF9USFJFU0hPTEQiLCJicmFrZU9mZnNldFBvc2l0aW9uIiwibWF4RWxhcHNlZFRpbWUiLCJ1bnNjaGVkdWxlIiwib3B0aW9ucyIsImNsYW1wZiIsImJvdHRvbURlbHRhIiwidG90YWxTY3JvbGxEZWx0YSIsInNjcm9sbFNpemUiLCJ2YWx1ZSIsIlRyYW5zZm9ybUJpdCIsIlNDQUxFIiwicGFyZW50Iiwic2V0U2Nyb2xsVmlldyIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDQSxNQUFNQSx5Q0FBeUMsR0FBRyxDQUFsRDtBQUNBLE1BQU1DLCtCQUErQixHQUFHLElBQXhDO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLElBQWhCO0FBQ0EsTUFBTUMsU0FBUyxHQUFHLEdBQWxCO0FBQ0EsTUFBTUMsZUFBZSxHQUFHLEdBQXhCO0FBQ0EsTUFBTUMsSUFBSSxHQUFHLElBQUlDLFlBQUosRUFBYjs7QUFDQSxNQUFNQyxTQUFTLEdBQUcsSUFBSUQsWUFBSixFQUFsQjs7QUFDQSxNQUFNRSxXQUFXLEdBQUcsSUFBSUYsWUFBSixFQUFwQjs7QUFDQSxNQUFNRyxTQUFTLEdBQUcsSUFBSUMsWUFBSixFQUFsQjs7QUFDQSxNQUFNQyxXQUFXLEdBQUcsSUFBSUQsWUFBSixFQUFwQjs7QUFFQSxNQUFNRSxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxJQUFELEVBQWtCO0FBQ25DQSxJQUFBQSxJQUFJLElBQUksQ0FBUjtBQUNBLFdBQVFBLElBQUksR0FBR0EsSUFBUCxHQUFjQSxJQUFkLEdBQXFCQSxJQUFyQixHQUE0QkEsSUFBNUIsR0FBbUMsQ0FBM0M7QUFDSCxHQUhEOztBQUtBLE1BQU1DLHFCQUFxQixHQUFHLFNBQXhCQSxxQkFBd0IsR0FBTTtBQUNoQyxRQUFNQyxXQUFX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QUFVQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgYXMgQ29tcG9uZW50RXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzL2NvbXBvbmVudC1ldmVudC1oYW5kbGVyJztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZSc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCByZXF1aXJlQ29tcG9uZW50LCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHJhbmdlLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBFdmVudCB9IGZyb20gJy4uLy4uL2NvcmUvZXZlbnQnO1xyXG5pbXBvcnQgeyBFdmVudE1vdXNlLCBFdmVudFRvdWNoLCBUb3VjaCwgbG9nSUQgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtJztcclxuaW1wb3J0IHsgU2l6ZSwgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0IHsgU2Nyb2xsQmFyIH0gZnJvbSAnLi9zY3JvbGwtYmFyJztcclxuaW1wb3J0IHsgVmlld0dyb3VwIH0gZnJvbSAnLi92aWV3LWdyb3VwJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZSc7XHJcbmltcG9ydCB7IGRpcmVjdG9yLCBEaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1CaXQgfSBmcm9tICcuLi8uLi9jb3JlL3NjZW5lLWdyYXBoL25vZGUtZW51bSc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBOVU1CRVJfT0ZfR0FUSEVSRURfVE9VQ0hFU19GT1JfTU9WRV9TUEVFRCA9IDU7XHJcbmNvbnN0IE9VVF9PRl9CT1VOREFSWV9CUkVBS0lOR19GQUNUT1IgPSAwLjA1O1xyXG5jb25zdCBFUFNJTE9OID0gMWUtNDtcclxuY29uc3QgVE9MRVJBTkNFID0gMWU0O1xyXG5jb25zdCBNT1ZFTUVOVF9GQUNUT1IgPSAwLjc7XHJcbmNvbnN0IFpFUk8gPSBuZXcgVmVjMygpO1xyXG5jb25zdCBfdGVtcFZlYzMgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBfdGVtcFZlYzNfMSA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF90ZW1wVmVjMiA9IG5ldyBWZWMyKCk7XHJcbmNvbnN0IF90ZW1wVmVjMl8xID0gbmV3IFZlYzIoKTtcclxuXHJcbmNvbnN0IHF1aW50RWFzZU91dCA9ICh0aW1lOiBudW1iZXIpID0+IHtcclxuICAgIHRpbWUgLT0gMTtcclxuICAgIHJldHVybiAodGltZSAqIHRpbWUgKiB0aW1lICogdGltZSAqIHRpbWUgKyAxKTtcclxufTtcclxuXHJcbmNvbnN0IGdldFRpbWVJbk1pbGxpc2Vjb25kcyA9ICgpID0+IHtcclxuICAgIGNvbnN0IGN1cnJlbnRUaW1lID0gbmV3IERhdGUoKTtcclxuICAgIHJldHVybiBjdXJyZW50VGltZS5nZXRNaWxsaXNlY29uZHMoKTtcclxufTtcclxuXHJcbmNvbnN0IGV2ZW50TWFwID0ge1xyXG4gICAgJ3Njcm9sbC10by10b3AnOiAwLFxyXG4gICAgJ3Njcm9sbC10by1ib3R0b20nOiAxLFxyXG4gICAgJ3Njcm9sbC10by1sZWZ0JzogMixcclxuICAgICdzY3JvbGwtdG8tcmlnaHQnOiAzLFxyXG4gICAgJ3Njcm9sbGluZyc6IDQsXHJcbiAgICAnYm91bmNlLWJvdHRvbSc6IDYsXHJcbiAgICAnYm91bmNlLWxlZnQnOiA3LFxyXG4gICAgJ2JvdW5jZS1yaWdodCc6IDgsXHJcbiAgICAnYm91bmNlLXRvcCc6IDUsXHJcbiAgICAnc2Nyb2xsLWVuZGVkJzogOSxcclxuICAgICd0b3VjaC11cCc6IDEwLFxyXG4gICAgJ3Njcm9sbC1lbmRlZC13aXRoLXRocmVzaG9sZCc6IDExLFxyXG4gICAgJ3Njcm9sbC1iZWdhbic6IDEyLFxyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBFbnVtIGZvciBTY3JvbGxWaWV3IGV2ZW50IHR5cGUuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDmu5rliqjop4blm77kuovku7bnsbvlnotcclxuICovXHJcbmV4cG9ydCBlbnVtIEV2ZW50VHlwZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGVtaXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgdG9wIGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOinhuWbvua7muWKqOWIsOmhtumDqOi+ueeVjOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBTQ1JPTExfVE9fVE9QID0gJ3Njcm9sbC10by10b3AnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmu5rliqjop4blm77mu5rliqjliLDlupXpg6jovrnnlYzkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgU0NST0xMX1RPX0JPVFRPTSA9ICdzY3JvbGwtdG8tYm90dG9tJyxcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZXZlbnQgZW1pdHRlZCB3aGVuIFNjcm9sbFZpZXcgc2Nyb2xsIHRvIHRoZSBsZWZ0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOinhuWbvua7muWKqOWIsOW3pui+ueeVjOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBTQ1JPTExfVE9fTEVGVCA9ICdzY3JvbGwtdG8tbGVmdCcsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGVtaXR0ZWQgd2hlbiBTY3JvbGxWaWV3IHNjcm9sbCB0byB0aGUgcmlnaHQgYm91bmRhcnkgb2YgaW5uZXIgY29udGFpbmVyLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5Y+z6L6555WM5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIFNDUk9MTF9UT19SSUdIVCA9ICdzY3JvbGwtdG8tcmlnaHQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgYmVnYW4uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmu5rliqjop4blm77mu5rliqjlvIDlp4vml7blj5Hlh7rnmoTkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgU0NST0xMX0JFR0FOID0gJ3Njcm9sbC1iZWdhbicsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGVtaXR0ZWQgd2hlbiBTY3JvbGxWaWV3IGF1dG8gc2Nyb2xsIGVuZGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo6KeG5Zu+5rua5Yqo57uT5p2f55qE5pe25YCZ5Y+R5Ye655qE5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIFNDUk9MTF9FTkRFRCA9ICdzY3JvbGwtZW5kZWQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHRvcCBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIgYW5kIHN0YXJ0IGJvdW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOinhuWbvua7muWKqOWIsOmhtumDqOi+ueeVjOW5tuS4lOW8gOWni+WbnuW8ueaXtuWPkeWHuueahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBCT1VOQ0VfVE9QID0gJ2JvdW5jZS10b3AnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIGJvdHRvbSBib3VuZGFyeSBvZiBpbm5lciBjb250YWluZXIgYW5kIHN0YXJ0IGJvdW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOinhuWbvua7muWKqOWIsOW6lemDqOi+ueeVjOW5tuS4lOW8gOWni+WbnuW8ueaXtuWPkeWHuueahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBCT1VOQ0VfQk9UVE9NID0gJ2JvdW5jZS1ib3R0b20nLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIGxlZnQgYm91bmRhcnkgb2YgaW5uZXIgY29udGFpbmVyIGFuZCBzdGFydCBib3VuY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmu5rliqjop4blm77mu5rliqjliLDlt6bovrnnlYzlubbkuJTlvIDlp4vlm57lvLnml7blj5Hlh7rnmoTkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgQk9VTkNFX0xFRlQgPSAnYm91bmNlLWxlZnQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBzY3JvbGwgdG8gdGhlIHJpZ2h0IGJvdW5kYXJ5IG9mIGlubmVyIGNvbnRhaW5lciBhbmQgc3RhcnQgYm91bmNlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo6KeG5Zu+5rua5Yqo5Yiw5Y+z6L6555WM5bm25LiU5byA5aeL5Zue5by55pe25Y+R5Ye655qE5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIEJPVU5DRV9SSUdIVCA9ICdib3VuY2UtcmlnaHQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gU2Nyb2xsVmlldyBpcyBzY3JvbGxpbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmu5rliqjop4blm77mraPlnKjmu5rliqjml7blj5Hlh7rnmoTkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgU0NST0xMSU5HID0gJ3Njcm9sbGluZycsXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGV2ZW50IGVtaXR0ZWQgd2hlbiBTY3JvbGxWaWV3IGF1dG8gc2Nyb2xsIGVuZGVkIHdpdGggYSB0aHJlc2hvbGQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmu5rliqjop4blm77oh6rliqjmu5rliqjlv6vopoHnu5PmnZ/nmoTml7blgJnlj5Hlh7rnmoTkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgU0NST0xMX0VOR19XSVRIX1RIUkVTSE9MRCA9ICdzY3JvbGwtZW5kZWQtd2l0aC10aHJlc2hvbGQnLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBldmVudCBlbWl0dGVkIHdoZW4gdXNlciByZWxlYXNlIHRoZSB0b3VjaC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+eUqOaIt+advuaJi+eahOaXtuWAmeS8muWPkeWHuuS4gOS4quS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBUT1VDSF9VUCA9ICd0b3VjaC11cCcsXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTGF5b3V0IGNvbnRhaW5lciBmb3IgYSB2aWV3IGhpZXJhcmNoeSB0aGF0IGNhbiBiZSBzY3JvbGxlZCBieSB0aGUgdXNlcixcclxuICogYWxsb3dpbmcgaXQgdG8gYmUgbGFyZ2VyIHRoYW4gdGhlIHBoeXNpY2FsIGRpc3BsYXkuXHJcbiAqXHJcbiAqIEB6aFxyXG4gKiDmu5rliqjop4blm77nu4Tku7bjgIJcclxuICovXHJcblxyXG5AY2NjbGFzcygnY2MuU2Nyb2xsVmlldycpXHJcbkBoZWxwKCdpMThuOmNjLlNjcm9sbFZpZXcnKVxyXG5AZXhlY3V0aW9uT3JkZXIoMTEwKVxyXG5AbWVudSgnVUkvU2Nyb2xsVmlldycpXHJcbkByZXF1aXJlQ29tcG9uZW50KFVJVHJhbnNmb3JtKVxyXG5leHBvcnQgY2xhc3MgU2Nyb2xsVmlldyBleHRlbmRzIFZpZXdHcm91cCB7XHJcbiAgICBwdWJsaWMgc3RhdGljIEV2ZW50VHlwZSA9IEV2ZW50VHlwZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGVsYXBzZSB0aW1lIG9mIGJvdW5jaW5nIGJhY2suIEEgdmFsdWUgb2YgMCB3aWxsIGJvdW5jZSBiYWNrIGltbWVkaWF0ZWx5LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5Zue5by55oyB57ut55qE5pe26Ze077yMMCDooajnpLrlsIbnq4vljbPlj43lvLnjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFswLCAxMF0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn5Zue5by55oyB57ut55qE5pe26Ze077yMMCDooajnpLrlsIbnq4vljbPlj43lvLknKVxyXG4gICAgcHVibGljIGJvdW5jZUR1cmF0aW9uID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSXQgZGV0ZXJtaW5lcyBob3cgcXVpY2tseSB0aGUgY29udGVudCBzdG9wIG1vdmluZy4gQSB2YWx1ZSBvZiAxIHdpbGwgc3RvcCB0aGUgbW92ZW1lbnQgaW1tZWRpYXRlbHkuXHJcbiAgICAgKiBBIHZhbHVlIG9mIDAgd2lsbCBuZXZlciBzdG9wIHRoZSBtb3ZlbWVudCB1bnRpbCBpdCByZWFjaGVzIHRvIHRoZSBib3VuZGFyeSBvZiBzY3JvbGx2aWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5byA5ZCv5oOv5oCn5ZCO77yM5Zyo55So5oi35YGc5q2i6Kem5pG45ZCO5rua5Yqo5aSa5b+r5YGc5q2i77yMMOihqOekuuawuOS4jeWBnOatou+8jDHooajnpLrnq4vliLvlgZzmraLjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFswLCAxLCAwLjFdKVxyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+W8gOWQr+aDr+aAp+WQju+8jOWcqOeUqOaIt+WBnOatouinpuaRuOWQjua7muWKqOWkmuW/q+WBnOatou+8jDAg6KGo56S65rC45LiN5YGc5q2i77yMMSDooajnpLrnq4vliLvlgZzmraInKVxyXG4gICAgcHVibGljIGJyYWtlID0gMC41O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBXaGVuIGVsYXN0aWMgaXMgc2V0LCB0aGUgY29udGVudCB3aWxsIGJlIGJvdW5jZSBiYWNrIHdoZW4gbW92ZSBvdXQgb2YgYm91bmRhcnkuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblhYHorrjmu5rliqjlhoXlrrnotoXov4fovrnnlYzvvIzlubblnKjlgZzmraLop6bmkbjlkI7lm57lvLnjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWFgeiuuOa7muWKqOWGheWuuei2hei/h+i+ueeVjO+8jOW5tuWcqOWBnOatouinpuaRuOWQjuWbnuW8uScpXHJcbiAgICBwdWJsaWMgZWxhc3RpYyA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdoZW4gaW5lcnRpYSBpcyBzZXQsIHRoZSBjb250ZW50IHdpbGwgY29udGludWUgdG8gbW92ZSB3aGVuIHRvdWNoIGVuZGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5piv5ZCm5byA5ZCv5rua5Yqo5oOv5oCn44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCfmmK/lkKblvIDlkK/mu5rliqjmg6/mgKcnKVxyXG4gICAgcHVibGljIGluZXJ0aWEgPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGlzIGlzIGEgcmVmZXJlbmNlIHRvIHRoZSBVSSBlbGVtZW50IHRvIGJlIHNjcm9sbGVkLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5Y+v5rua5Yqo5bGV56S65YaF5a6555qE6IqC54K544CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE5vZGUpXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgn5Y+v5rua5Yqo5bGV56S65YaF5a6555qE6IqC54K5JylcclxuICAgIGdldCBjb250ZW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudDtcclxuICAgIH1cclxuICAgIHNldCBjb250ZW50ICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50ID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCB2aWV3VHJhbnMgPSB2YWx1ZSAmJiB2YWx1ZS5wYXJlbnQgJiYgdmFsdWUucGFyZW50Ll91aVByb3BzLnVpVHJhbnNmb3JtQ29tcDtcclxuICAgICAgICBpZiAodmFsdWUgJiYgKCF2YWx1ZSB8fCAhdmlld1RyYW5zKSkge1xyXG4gICAgICAgICAgICBsb2dJRCg0MzAyKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEVuYWJsZSBob3Jpem9udGFsIHNjcm9sbC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaYr+WQpuW8gOWQr+awtOW5s+a7muWKqOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgn5piv5ZCm5byA5ZCv5rC05bmz5rua5YqoJylcclxuICAgIHB1YmxpYyBob3Jpem9udGFsID0gdHJ1ZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGhvcml6b250YWwgc2Nyb2xsYmFyIHJlZmVyZW5jZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5rC05bmz5rua5Yqo55qEIFNjcm9sbEJhcuOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTY3JvbGxCYXIpXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdG9vbHRpcCgn5rC05bmz5rua5Yqo55qEIFNjcm9sbEJhcicpXHJcbiAgICBnZXQgaG9yaXpvbnRhbFNjcm9sbEJhciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hvcml6b250YWxTY3JvbGxCYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGhvcml6b250YWxTY3JvbGxCYXIgKHZhbHVlOiBTY3JvbGxCYXIgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWxTY3JvbGxCYXIgPT09IHZhbHVlKXtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faG9yaXpvbnRhbFNjcm9sbEJhciA9IHZhbHVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbFNjcm9sbEJhcikge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3Jpem9udGFsU2Nyb2xsQmFyLnNldFNjcm9sbFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNjcm9sbEJhcihaRVJPKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEVuYWJsZSB2ZXJ0aWNhbCBzY3JvbGwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmmK/lkKblvIDlkK/lnoLnm7Tmu5rliqjjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcig3KVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuW8gOWQr+WeguebtOa7muWKqCcpXHJcbiAgICBwdWJsaWMgdmVydGljYWwgPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgdmVydGljYWwgc2Nyb2xsYmFyIHJlZmVyZW5jZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWeguebtOa7muWKqOeahCBTY3JvbGxCYXLjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU2Nyb2xsQmFyKVxyXG4gICAgQGRpc3BsYXlPcmRlcig4KVxyXG4gICAgQHRvb2x0aXAoJ+WeguebtOa7muWKqOeahCBTY3JvbGxCYXInKVxyXG4gICAgZ2V0IHZlcnRpY2FsU2Nyb2xsQmFyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmVydGljYWxTY3JvbGxCYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRpY2FsU2Nyb2xsQmFyICh2YWx1ZTogU2Nyb2xsQmFyIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl92ZXJ0aWNhbFNjcm9sbEJhciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdmVydGljYWxTY3JvbGxCYXIgPSB2YWx1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlcnRpY2FsU2Nyb2xsQmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlcnRpY2FsU2Nyb2xsQmFyLnNldFNjcm9sbFZpZXcodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVNjcm9sbEJhcihaRVJPKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIElmIGNhbmNlbElubmVyRXZlbnRzIGlzIHNldCB0byB0cnVlLCB0aGUgc2Nyb2xsIGJlaGF2aW9yIHdpbGwgY2FuY2VsIHRvdWNoIGV2ZW50cyBvbiBpbm5lciBjb250ZW50IG5vZGVzXHJcbiAgICAgKiBJdCdzIHNldCB0byB0cnVlIGJ5IGRlZmF1bHQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlpoLmnpzov5nkuKrlsZ7mgKfooqvorr7nva7kuLogdHJ1Ze+8jOmCo+S5iOa7muWKqOihjOS4uuS8muWPlua2iOWtkOiKgueCueS4iuazqOWGjOeahOinpuaRuOS6i+S7tu+8jOm7mOiupOiiq+iuvue9ruS4uiB0cnVl44CCPGJyLz5cclxuICAgICAqIOazqOaEj++8jOWtkOiKgueCueS4iueahCB0b3VjaHN0YXJ0IOS6i+S7tuS7jeeEtuS8muinpuWPke+8jOinpueCueenu+WKqOi3neemu+mdnuW4uOefreeahOaDheWGteS4iyB0b3VjaG1vdmUg5ZKMIHRvdWNoZW5kIOS5n+S4jeS8muWPl+W9seWTjeOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDkpXHJcbiAgICBAdG9vbHRpcCgn5rua5Yqo6KGM5Li65piv5ZCm5Lya5Y+W5raI5a2Q6IqC54K55LiK5rOo5YaM55qE6Kem5pG45LqL5Lu2JylcclxuICAgIHB1YmxpYyBjYW5jZWxJbm5lckV2ZW50cyA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbFZpZXcgZXZlbnRzIGNhbGxiYWNrLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo6KeG5Zu+55qE5LqL5Lu25Zue6LCD5Ye95pWw44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFtDb21wb25lbnRFdmVudEhhbmRsZXJdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxMClcclxuICAgIEB0b29sdGlwKCfmu5rliqjop4blm77nmoTkuovku7blm57osIPlh73mlbAnKVxyXG4gICAgcHVibGljIHNjcm9sbEV2ZW50czogQ29tcG9uZW50RXZlbnRIYW5kbGVyW10gPSBbXTtcclxuXHJcbiAgICBnZXQgdmlldyAoKSB7XHJcbiAgICAgICAgbGV0IHBhcmVudCA9IHRoaXMuX2NvbnRlbnQgJiYgdGhpcy5fY29udGVudC5wYXJlbnQ7XHJcbiAgICAgICAgaWYgKCFwYXJlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwYXJlbnQuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9zY3JvbGxpbmcgPSBmYWxzZTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY29udGVudDogTm9kZSB8IG51bGwgPSBudWxsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9ob3Jpem9udGFsU2Nyb2xsQmFyOiBTY3JvbGxCYXIgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdmVydGljYWxTY3JvbGxCYXI6IFNjcm9sbEJhciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdG9wQm91bmRhcnkgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9ib3R0b21Cb3VuZGFyeSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2xlZnRCb3VuZGFyeSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX3JpZ2h0Qm91bmRhcnkgPSAwO1xyXG5cclxuICAgIHByb3RlY3RlZCBfdG91Y2hNb3ZlRGlzcGxhY2VtZW50czogVmVjM1tdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3RvdWNoTW92ZVRpbWVEZWx0YXM6IG51bWJlcltdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3RvdWNoTW92ZVByZXZpb3VzVGltZXN0YW1wID0gMDtcclxuICAgIHByb3RlY3RlZCBfdG91Y2hNb3ZlZCA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9hdXRvU2Nyb2xsQXR0ZW51YXRlID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX2F1dG9TY3JvbGxTdGFydFBvc2l0aW9uID0gbmV3IFZlYzMoKTtcclxuICAgIHByb3RlY3RlZCBfYXV0b1Njcm9sbFRhcmdldERlbHRhID0gbmV3IFZlYzMoKTtcclxuICAgIHByb3RlY3RlZCBfYXV0b1Njcm9sbFRvdGFsVGltZSA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2F1dG9TY3JvbGxBY2N1bXVsYXRlZFRpbWUgPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9hdXRvU2Nyb2xsQnJha2luZyA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24gPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIHByb3RlY3RlZCBfb3V0T2ZCb3VuZGFyeUFtb3VudCA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcm90ZWN0ZWQgX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSA9IHRydWU7XHJcbiAgICBwcm90ZWN0ZWQgX3N0b3BNb3VzZVdoZWVsID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lID0gMC4wO1xyXG4gICAgcHJvdGVjdGVkIF9pc1Njcm9sbEVuZGVkV2l0aFRocmVzaG9sZEV2ZW50RmlyZWQgPSBmYWxzZTtcclxuICAgIC8vIHVzZSBiaXQgd2lzZSBvcGVyYXRpb25zIHRvIGluZGljYXRlIHRoZSBkaXJlY3Rpb25cclxuICAgIHByb3RlY3RlZCBfc2Nyb2xsRXZlbnRFbWl0TWFzayA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX2lzQm91bmNpbmcgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfY29udGVudFBvcyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcm90ZWN0ZWQgX2RlbHRhUG9zID0gbmV3IFZlYzMoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBib3R0b20gYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuW6lemDqOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0aW1lSW5TZWNvbmQgLSDmu5rliqjml7bpl7TvvIhz77yJ44CCIOWmguaenOi2heaXtu+8jOWGheWuueWwhueri+WNs+i3s+WIsOW6lemDqOi+ueeVjOOAglxyXG4gICAgICogQHBhcmFtIGF0dGVudWF0ZWQgLSDmu5rliqjliqDpgJ/mmK/lkKboobDlh4/vvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdmlldy5cclxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Cb3R0b20oMC4xKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2Nyb2xsVG9Cb3R0b20gKHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigwLCAwKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgdG9wIGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77pobbpg6jjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDpobbpg6jovrnnlYzjgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSB0b3Agb2YgdGhlIHZpZXcuXHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvVG9wKDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wICh0aW1lSW5TZWNvbmQ/OiBudW1iZXIsIGF0dGVudWF0ZWQgPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XHJcbiAgICAgICAgICAgIGFuY2hvcjogbmV3IFZlYzIoMCwgMSksXHJcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiBmYWxzZSxcclxuICAgICAgICAgICAgYXBwbHlUb1ZlcnRpY2FsOiB0cnVlLFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGltZUluU2Vjb25kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChtb3ZlRGVsdGEsIHRpbWVJblNlY29uZCwgYXR0ZW51YXRlZCAhPT0gZmFsc2UpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIGxlZnQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuW3pui+ueOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0aW1lSW5TZWNvbmQgLSDmu5rliqjml7bpl7TvvIhz77yJ44CCIOWmguaenOi2heaXtu+8jOWGheWuueWwhueri+WNs+i3s+WIsOW3pui+uei+ueeVjOOAglxyXG4gICAgICogQHBhcmFtIGF0dGVudWF0ZWQgLSDmu5rliqjliqDpgJ/mmK/lkKboobDlh4/vvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIGxlZnQgb2YgdGhlIHZpZXcuXHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvTGVmdCgwLjEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzY3JvbGxUb0xlZnQgKHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigwLCAwKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgcmlnaHQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuWPs+i+ueOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0aW1lSW5TZWNvbmQgLSDmu5rliqjml7bpl7TvvIhz77yJ44CCIOWmguaenOi2heaXtu+8jOWGheWuueWwhueri+WNs+i3s+WIsOWPs+i+uei+ueeVjOOAglxyXG4gICAgICogQHBhcmFtIGF0dGVudWF0ZWQgLSDmu5rliqjliqDpgJ/mmK/lkKboobDlh4/vvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIHJpZ2h0IG9mIHRoZSB2aWV3LlxyXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1JpZ2h0KDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvUmlnaHQgKHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigxLCAwKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgdG9wIGxlZnQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuW3puS4iuinkuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0aW1lSW5TZWNvbmQgLSDmu5rliqjml7bpl7TvvIhz77yJ44CCIOWmguaenOi2heaXtu+8jOWGheWuueWwhueri+WNs+i3s+WIsOW3puS4iui+uei+ueeVjOOAglxyXG4gICAgICogQHBhcmFtIGF0dGVudWF0ZWQgLSDmu5rliqjliqDpgJ/mmK/lkKboobDlh4/vvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIHVwcGVyIGxlZnQgY29ybmVyIG9mIHRoZSB2aWV3LlxyXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1RvcExlZnQoMC4xKTtcclxuICAgICAqIGBgYFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2Nyb2xsVG9Ub3BMZWZ0ICh0aW1lSW5TZWNvbmQ/OiBudW1iZXIsIGF0dGVudWF0ZWQgPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XHJcbiAgICAgICAgICAgIGFuY2hvcjogbmV3IFZlYzIoMCwgMSksXHJcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiB0cnVlLFxyXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgdG9wIHJpZ2h0IGJvdW5kYXJ5IG9mIFNjcm9sbFZpZXcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop4blm77lhoXlrrnlsIblnKjop4Tlrprml7bpl7TlhoXmu5rliqjliLDop4blm77lj7PkuIrop5LjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDlj7PkuIrovrnnlYzjgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gU2Nyb2xsIHRvIHRoZSB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSB2aWV3LlxyXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1RvcFJpZ2h0KDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvVG9wUmlnaHQgKHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigxLCAxKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBib3R0b20gbGVmdCBib3VuZGFyeSBvZiBTY3JvbGxWaWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6KeG5Zu+5YaF5a655bCG5Zyo6KeE5a6a5pe26Ze05YaF5rua5Yqo5Yiw6KeG5Zu+5bem5LiL6KeS44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRpbWVJblNlY29uZCAtIOa7muWKqOaXtumXtO+8iHPvvInjgIIg5aaC5p6c6LaF5pe277yM5YaF5a655bCG56uL5Y2z6Lez5Yiw5bem5LiL6L6555WM44CCXHJcbiAgICAgKiBAcGFyYW0gYXR0ZW51YXRlZCAtIOa7muWKqOWKoOmAn+aYr+WQpuihsOWHj++8jOm7mOiupOS4uiB0cnVl44CCXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogYGBgdHNcclxuICAgICAqIC8vIFNjcm9sbCB0byB0aGUgbG93ZXIgbGVmdCBjb3JuZXIgb2YgdGhlIHZpZXcuXHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvQm90dG9tTGVmdCgwLjEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzY3JvbGxUb0JvdHRvbUxlZnQgKHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigwLCAwKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQgIT09IGZhbHNlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2Nyb2xsIHRoZSBjb250ZW50IHRvIHRoZSBib3R0b20gcmlnaHQgYm91bmRhcnkgb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWwhuWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsOinhuWbvuWPs+S4i+inkuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0aW1lSW5TZWNvbmQgLSDmu5rliqjml7bpl7TvvIhz77yJ44CCIOWmguaenOi2heaXtu+8jOWGheWuueWwhueri+WNs+i3s+WIsOWPs+i+ueS4i+i+ueeVjOOAglxyXG4gICAgICogQHBhcmFtIGF0dGVudWF0ZWQgLSDmu5rliqjliqDpgJ/mmK/lkKboobDlh4/vvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiAvLyBTY3JvbGwgdG8gdGhlIGxvd2VyIHJpZ2h0IGNvcm5lciBvZiB0aGUgdmlldy5cclxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Cb3R0b21SaWdodCgwLjEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzY3JvbGxUb0JvdHRvbVJpZ2h0ICh0aW1lSW5TZWNvbmQ/OiBudW1iZXIsIGF0dGVudWF0ZWQgPSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XHJcbiAgICAgICAgICAgIGFuY2hvcjogbmV3IFZlYzIoMSwgMCksXHJcbiAgICAgICAgICAgIGFwcGx5VG9Ib3Jpem9udGFsOiB0cnVlLFxyXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB3aXRoIGFuIG9mZnNldCByZWxhdGVkIHRvIHRoZSBTY3JvbGxWaWV3J3MgdG9wIGxlZnQgb3JpZ2luLCBpZiB0aW1lSW5TZWNvbmQgaXMgb21pdHRlZCwgdGhlbiBpdCB3aWxsIGp1bXAgdG8gdGhlIHNwZWNpZmljIG9mZnNldCBpbW1lZGlhdGVseS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWcqOinhOWumuaXtumXtOWGheWwhua7muWKqOWIsCBTY3JvbGxWaWV3IOebuOWvueW3puS4iuinkuWOn+eCueeahOWBj+enu+S9jee9riwg5aaC5p6cIHRpbWVJblNlY29uZCDlj4LmlbDkuI3kvKDvvIzliJnnq4vljbPmu5rliqjliLDmjIflrprlgY/np7vkvY3nva7jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gb2Zmc2V0IC0g5oyH5a6a56e75Yqo5YGP56e76YeP44CCXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDmjIflrprlgY/np7vph4/lpITjgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gU2Nyb2xsIHRvIG1pZGRsZSBwb3NpdGlvbiBpbiAwLjEgc2Vjb25kIGluIHgtYXhpc1xyXG4gICAgICogbGV0IG1heFNjcm9sbE9mZnNldCA9IHRoaXMuZ2V0TWF4U2Nyb2xsT2Zmc2V0KCk7XHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvT2Zmc2V0KG5ldyBWZWMzKG1heFNjcm9sbE9mZnNldC54IC8gMiwgMCwgMCksIDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvT2Zmc2V0IChvZmZzZXQ6IFZlYzMsIHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZCA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBtYXhTY3JvbGxPZmZzZXQgPSB0aGlzLmdldE1heFNjcm9sbE9mZnNldCgpO1xyXG5cclxuICAgICAgICBjb25zdCBhbmNob3IgPSBuZXcgVmVjMigwLCAwKTtcclxuICAgICAgICAvLyBpZiBtYXhTY3JvbGxPZmZzZXQgaXMgMCwgdGhlbiBhbHdheXMgYWxpZ24gdGhlIGNvbnRlbnQncyB0b3AgbGVmdCBvcmlnaW4gdG8gdGhlIHRvcCBsZWZ0IGNvcm5lciBvZiBpdHMgcGFyZW50XHJcbiAgICAgICAgaWYgKG1heFNjcm9sbE9mZnNldC54ID09PSAwKSB7XHJcbiAgICAgICAgICAgIGFuY2hvci54ID0gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbmNob3IueCA9IG9mZnNldC54IC8gbWF4U2Nyb2xsT2Zmc2V0Lng7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAobWF4U2Nyb2xsT2Zmc2V0LnkgPT09IDApIHtcclxuICAgICAgICAgICAgYW5jaG9yLnkgPSAxO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFuY2hvci55ID0gKG1heFNjcm9sbE9mZnNldC55IC0gb2Zmc2V0LnkpIC8gbWF4U2Nyb2xsT2Zmc2V0Lnk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjcm9sbFRvKGFuY2hvciwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0IHRoZSBwb3NpdGl2ZSBvZmZzZXQgdmFsdWUgY29ycmVzcG9uZHMgdG8gdGhlIGNvbnRlbnQncyB0b3AgbGVmdCBib3VuZGFyeS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPlua7muWKqOinhuWbvuebuOWvueS6juW3puS4iuinkuWOn+eCueeahOW9k+WJjea7muWKqOWBj+enu+OAglxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gLSDlvZPliY3mu5rliqjlgY/np7vph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjcm9sbE9mZnNldCAoKSB7XHJcbiAgICAgICAgY29uc3QgdG9wRGVsdGEgPSB0aGlzLl9nZXRDb250ZW50VG9wQm91bmRhcnkoKSAtIHRoaXMuX3RvcEJvdW5kYXJ5O1xyXG4gICAgICAgIGNvbnN0IGxlZnREZWx0YSA9IHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSAtIHRoaXMuX2xlZnRCb3VuZGFyeTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ldyBWZWMzKGxlZnREZWx0YSwgdG9wRGVsdGEsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgdGhlIG1heGltaXplIGF2YWlsYWJsZSAgc2Nyb2xsIG9mZnNldC5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPlua7muWKqOinhuWbvuacgOWkp+WPr+S7pea7muWKqOeahOWBj+enu+mHj+OAglxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gLSDmnIDlpKflj6/mu5rliqjlgY/np7vph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1heFNjcm9sbE9mZnNldCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb250ZW50IHx8ICF0aGlzLnZpZXcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRTaXplID0gdGhpcy5fY29udGVudCEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5jb250ZW50U2l6ZTtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbE1heGltaXplT2Zmc2V0ID0gY29udGVudFNpemUud2lkdGggLSB0aGlzLnZpZXcud2lkdGg7XHJcbiAgICAgICAgbGV0IHZlcnRpY2FsTWF4aW1pemVPZmZzZXQgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSB0aGlzLnZpZXcuaGVpZ2h0O1xyXG4gICAgICAgIGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCA9IGhvcml6b250YWxNYXhpbWl6ZU9mZnNldCA+PSAwID8gaG9yaXpvbnRhbE1heGltaXplT2Zmc2V0IDogMDtcclxuICAgICAgICB2ZXJ0aWNhbE1heGltaXplT2Zmc2V0ID0gdmVydGljYWxNYXhpbWl6ZU9mZnNldCA+PSAwID8gdmVydGljYWxNYXhpbWl6ZU9mZnNldCA6IDA7XHJcblxyXG4gICAgICAgIHJldHVybiBuZXcgVmVjMyhob3Jpem9udGFsTWF4aW1pemVPZmZzZXQsIHZlcnRpY2FsTWF4aW1pemVPZmZzZXQsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIGhvcml6b250YWwgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6KeG5Zu+5YaF5a655Zyo6KeE5a6a5pe26Ze05YaF5bCG5rua5Yqo5YiwIFNjcm9sbFZpZXcg5rC05bmz5pa55ZCR55qE55m+5YiG5q+U5L2N572u5LiK44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBlcmNlbnQgLSAwIC0g5LmL6Ze055qE55m+5YiG5q+U44CCXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDmjIflrprmsLTlubPnmb7liIbmr5TkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gU2Nyb2xsIHRvIG1pZGRsZSBwb3NpdGlvbi5cclxuICAgICAqIHNjcm9sbFZpZXcuc2Nyb2xsVG9Cb3R0b21SaWdodCgwLjUsIDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvUGVyY2VudEhvcml6b250YWwgKHBlcmNlbnQ6IG51bWJlciwgdGltZUluU2Vjb25kOiBudW1iZXIsIGF0dGVudWF0ZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMihwZXJjZW50LCAwKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkICE9PSBmYWxzZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQobW92ZURlbHRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNjcm9sbCB0aGUgY29udGVudCB0byB0aGUgcGVyY2VudCBwb3NpdGlvbiBvZiBTY3JvbGxWaWV3IGluIGFueSBkaXJlY3Rpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop4blm77lhoXlrrnlnKjop4Tlrprml7bpl7TlhoXov5vooYzlnoLnm7TmlrnlkJHlkozmsLTlubPmlrnlkJHnmoTmu5rliqjvvIzlubbkuJTmu5rliqjliLDmjIflrprnmb7liIbmr5TkvY3nva7kuIrjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYW5jaG9yIC0g5ZyoIG5ldyBWZWMyKDAsMCkgYW5kIG5ldyBWZWMyKDEsMSkg5LiK5Y+W5beu5YC855qE5LiA5Liq54K544CCXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDmjIflrprmsLTlubPmiJblnoLnm7Tnmb7liIbmr5TkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogLy8gVmVydGljYWwgc2Nyb2xsIHRvIHRoZSBib3R0b20gb2YgdGhlIHZpZXcuXHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvKG5ldyBWZWMyKDAsIDEpLCAwLjEpO1xyXG4gICAgICpcclxuICAgICAqIC8vIEhvcml6b250YWwgc2Nyb2xsIHRvIHZpZXcgcmlnaHQuXHJcbiAgICAgKiBzY3JvbGxWaWV3LnNjcm9sbFRvKG5ldyBWZWMyKDEsIDApLCAwLjEpO1xyXG4gICAgICogYGBgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzY3JvbGxUbyAoYW5jaG9yOiBWZWMyLCB0aW1lSW5TZWNvbmQ/OiBudW1iZXIsIGF0dGVudWF0ZWQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgY29uc3QgbW92ZURlbHRhID0gdGhpcy5fY2FsY3VsYXRlTW92ZVBlcmNlbnREZWx0YSh7XHJcbiAgICAgICAgICAgIGFuY2hvcjogbmV3IFZlYzIoYW5jaG9yKSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IHRydWUsXHJcbiAgICAgICAgICAgIGFwcGx5VG9WZXJ0aWNhbDogdHJ1ZSxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRpbWVJblNlY29uZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwobW92ZURlbHRhLCB0aW1lSW5TZWNvbmQsIGF0dGVudWF0ZWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTY3JvbGwgdGhlIGNvbnRlbnQgdG8gdGhlIHZlcnRpY2FsIHBlcmNlbnQgcG9zaXRpb24gb2YgU2Nyb2xsVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOinhuWbvuWGheWuueWcqOinhOWumuaXtumXtOWGhea7muWKqOWIsCBTY3JvbGxWaWV3IOWeguebtOaWueWQkeeahOeZvuWIhuavlOS9jee9ruS4iuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwZXJjZW50IC0gMCAtIDEg5LmL6Ze055qE55m+5YiG5q+U44CCXHJcbiAgICAgKiBAcGFyYW0gdGltZUluU2Vjb25kIC0g5rua5Yqo5pe26Ze077yIc++8ieOAgiDlpoLmnpzotoXml7bvvIzlhoXlrrnlsIbnq4vljbPot7PliLDmjIflrprlnoLnm7Tnmb7liIbmr5TkvY3nva7jgIJcclxuICAgICAqIEBwYXJhbSBhdHRlbnVhdGVkIC0g5rua5Yqo5Yqg6YCf5piv5ZCm6KGw5YeP77yM6buY6K6k5Li6IHRydWXjgIJcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogc2Nyb2xsVmlldy5zY3JvbGxUb1BlcmNlbnRWZXJ0aWNhbCgwLjUsIDAuMSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvUGVyY2VudFZlcnRpY2FsIChwZXJjZW50OiBudW1iZXIsIHRpbWVJblNlY29uZD86IG51bWJlciwgYXR0ZW51YXRlZD86IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSB0aGlzLl9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhKHtcclxuICAgICAgICAgICAgYW5jaG9yOiBuZXcgVmVjMigwLCBwZXJjZW50KSxcclxuICAgICAgICAgICAgYXBwbHlUb0hvcml6b250YWw6IGZhbHNlLFxyXG4gICAgICAgICAgICBhcHBseVRvVmVydGljYWw6IHRydWUsXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aW1lSW5TZWNvbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RhcnRBdXRvU2Nyb2xsKG1vdmVEZWx0YSwgdGltZUluU2Vjb25kLCBhdHRlbnVhdGVkKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3ZlQ29udGVudChtb3ZlRGVsdGEpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3RvcCBhdXRvIHNjcm9sbCBpbW1lZGlhdGVseS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWBnOatouiHquWKqOa7muWKqCwg6LCD55So5q2kIEFQSSDlj6/ku6XorqkgU2Nyb2xsVmlldyDnq4vljbPlgZzmraLmu5rliqjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0b3BBdXRvU2Nyb2xsICgpIHtcclxuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsaW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEFjY3VtdWxhdGVkVGltZSA9IHRoaXMuX2F1dG9TY3JvbGxUb3RhbFRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIE1vZGlmeSB0aGUgY29udGVudCBwb3NpdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruW9k+WJjeinhuWbvuWGheWuueeahOWdkOagh+eCueOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwb3NpdGlvbiAtIOW9k+WJjeinhuWbvuWdkOagh+eCuS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldENvbnRlbnRQb3NpdGlvbiAocG9zaXRpb246IFZlYzMpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMocG9zaXRpb24ueCAtIGNvbnRlbnRQb3MueCkgPCBFUFNJTE9OICYmIE1hdGguYWJzKHBvc2l0aW9uLnkgLSBjb250ZW50UG9zLnkpIDwgRVBTSUxPTikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb250ZW50LnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBRdWVyeSB0aGUgY29udGVudCdzIHBvc2l0aW9uIGluIGl0cyBwYXJlbnQgc3BhY2UuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvZPliY3op4blm77lhoXlrrnnmoTlnZDmoIfngrnjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJucyAtIOW9k+WJjeinhuWbvuWGheWuueeahOWdkOagh+eCuS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENvbnRlbnRQb3NpdGlvbiAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb250ZW50KXtcclxuICAgICAgICAgICAgcmV0dXJuIFpFUk87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb250ZW50UG9zLnNldCh0aGlzLl9jb250ZW50LnBvc2l0aW9uKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29udGVudFBvcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUXVlcnkgd2hldGhlciB0aGUgdXNlciBpcyBjdXJyZW50bHkgZHJhZ2dpbmcgdGhlIFNjcm9sbFZpZXcgdG8gc2Nyb2xsIGl0LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog55So5oi35piv5ZCm5Zyo5ouW5ou95b2T5YmN5rua5Yqo6KeG5Zu+44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMgLSDmmK/lkKblnKjmi5bmi73lvZPliY3mu5rliqjop4blm77jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzU2Nyb2xsaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBRdWVyeSB3aGV0aGVyIHRoZSBTY3JvbGxWaWV3IGlzIGN1cnJlbnRseSBzY3JvbGxpbmcgYmVjYXVzZSBvZiBhIGJvdW5jZWJhY2sgb3IgaW5lcnRpYSBzbG93ZG93bi5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjea7muWKqOinhuWbvuaYr+WQpuWcqOaDr+aAp+a7muWKqOOAglxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm5zIC0g5rua5Yqo6KeG5Zu+5piv5ZCm5Zyo5oOv5oCn5rua5Yqo44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpc0F1dG9TY3JvbGxpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvU2Nyb2xsaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTY3JvbGxFbmRlZEV2ZW50VGltaW5nICgpIHtcclxuICAgICAgICByZXR1cm4gRVBTSUxPTjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhcnQgKCkge1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5KCk7XHJcbiAgICAgICAgLy8gQmVjYXVzZSB3aWRnZXQgY29tcG9uZW50IHdpbGwgYWRqdXN0IGNvbnRlbnQgcG9zaXRpb24gYW5kIHNjcm9sbFZpZXcgcG9zaXRpb24gaXMgY29ycmVjdCBhZnRlciB2aXNpdFxyXG4gICAgICAgIC8vIFNvIHRoaXMgZXZlbnQgY291bGQgbWFrZSBzdXJlIHRoZSBjb250ZW50IGlzIG9uIHRoZSBjb3JyZWN0IHBvc2l0aW9uIGFmdGVyIGxvYWRpbmcuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRlbnQpIHtcclxuICAgICAgICAgICAgZGlyZWN0b3Iub25jZShEaXJlY3Rvci5FVkVOVF9CRUZPUkVfRFJBVywgdGhpcy5fYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnksIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGlmICghRURJVE9SIHx8IGxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZWdpc3RlckV2ZW50KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50Lm9uKE5vZGUuRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnksIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29udGVudC5vbihOb2RlLkV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fc2NhbGVDaGFuZ2VkLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZpZXcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fc2NhbGVDaGFuZ2VkLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlU2Nyb2xsQmFyU3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlIChkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TY3JvbGxpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc0F1dG9TY3JvbGxpbmcoZHQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUiB8fCBsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgdGhpcy5fdW5yZWdpc3RlckV2ZW50KCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb250ZW50Lm9mZihOb2RlLkV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5LCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbnRlbnQub2ZmKE5vZGUuRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCB0aGlzLl9zY2FsZUNoYW5nZWQsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmlldykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlldy5ub2RlLm9mZihOb2RlLkV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgdGhpcy5fc2NhbGVDaGFuZ2VkLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXcubm9kZS5vZmYoTm9kZS5FdmVudFR5cGUuU0laRV9DSEFOR0VELCB0aGlzLl9jYWxjdWxhdGVCb3VuZGFyeSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faGlkZVNjcm9sbEJhcigpO1xyXG4gICAgICAgIHRoaXMuc3RvcEF1dG9TY3JvbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwcml2YXRlIG1ldGhvZHNcclxuICAgIHByb3RlY3RlZCBfcmVnaXN0ZXJFdmVudCAoKSB7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5UT1VDSF9NT1ZFLCB0aGlzLl9vblRvdWNoTW92ZWQsIHRoaXMsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vbihOb2RlLkV2ZW50VHlwZS5UT1VDSF9FTkQsIHRoaXMuX29uVG91Y2hFbmRlZCwgdGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9uKE5vZGUuRXZlbnRUeXBlLk1PVVNFX1dIRUVMLCB0aGlzLl9vbk1vdXNlV2hlZWwsIHRoaXMsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdW5yZWdpc3RlckV2ZW50ICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGUuRXZlbnRUeXBlLlRPVUNIX1NUQVJULCB0aGlzLl9vblRvdWNoQmVnYW4sIHRoaXMsIHRydWUpO1xyXG4gICAgICAgIHRoaXMubm9kZS5vZmYoTm9kZS5FdmVudFR5cGUuVE9VQ0hfTU9WRSwgdGhpcy5fb25Ub3VjaE1vdmVkLCB0aGlzLCB0cnVlKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgdGhpcy5fb25Ub3VjaEVuZGVkLCB0aGlzLCB0cnVlKTtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKE5vZGUuRXZlbnRUeXBlLlRPVUNIX0NBTkNFTCwgdGhpcy5fb25Ub3VjaENhbmNlbGxlZCwgdGhpcywgdHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5ub2RlLm9mZihOb2RlLkV2ZW50VHlwZS5NT1VTRV9XSEVFTCwgdGhpcy5fb25Nb3VzZVdoZWVsLCB0aGlzLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uTW91c2VXaGVlbCAoZXZlbnQ6IEV2ZW50TW91c2UsIGNhcHR1cmVMaXN0ZW5lcnM/OiBOb2RlW10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9oYXNOZXN0ZWRWaWV3R3JvdXAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGRlbHRhTW92ZSA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgY29uc3Qgd2hlZWxQcmVjaXNpb24gPSAtMC4xO1xyXG4gICAgICAgIGNvbnN0IHNjcm9sbFkgPSBldmVudC5nZXRTY3JvbGxZKCk7XHJcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWwpIHtcclxuICAgICAgICAgICAgZGVsdGFNb3ZlLnNldCgwLCBzY3JvbGxZICogd2hlZWxQcmVjaXNpb24sIDApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5ob3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgIGRlbHRhTW92ZS5zZXQoc2Nyb2xsWSAqIHdoZWVsUHJlY2lzaW9uLCAwLCAwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lID0gMDtcclxuICAgICAgICB0aGlzLl9wcm9jZXNzRGVsdGFNb3ZlKGRlbHRhTW92ZSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fc3RvcE1vdXNlV2hlZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5faGFuZGxlUHJlc3NMb2dpYygpO1xyXG4gICAgICAgICAgICB0aGlzLnNjaGVkdWxlKHRoaXMuX2NoZWNrTW91c2VXaGVlbCwgMS4wIC8gNjAsIE5hTiwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0b3BNb3VzZVdoZWVsID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3N0b3BQcm9wYWdhdGlvbklmVGFyZ2V0SXNNZShldmVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoQmVnYW4gKGV2ZW50OiBFdmVudFRvdWNoLCBjYXB0dXJlTGlzdGVuZXJzPzogTm9kZVtdKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSB8fCAhdGhpcy5fY29udGVudCkgeyByZXR1cm47IH1cclxuICAgICAgICBpZiAodGhpcy5faGFzTmVzdGVkVmlld0dyb3VwKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKSkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgdGhpcy5faGFuZGxlUHJlc3NMb2dpYygpO1xyXG5cclxuICAgICAgICB0aGlzLl90b3VjaE1vdmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hNb3ZlZCAoZXZlbnQ6IEV2ZW50VG91Y2gsIGNhcHR1cmVMaXN0ZW5lcnM/OiBOb2RlW10pIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5IHx8ICF0aGlzLl9jb250ZW50KSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICh0aGlzLl9oYXNOZXN0ZWRWaWV3R3JvdXAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoITtcclxuICAgICAgICB0aGlzLl9oYW5kbGVNb3ZlTG9naWModG91Y2gpO1xyXG5cclxuICAgICAgICAvLyBEbyBub3QgcHJldmVudCB0b3VjaCBldmVudHMgaW4gaW5uZXIgbm9kZXNcclxuICAgICAgICBpZiAoIXRoaXMuY2FuY2VsSW5uZXJFdmVudHMpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVsdGFNb3ZlID0gdG91Y2guZ2V0VUlMb2NhdGlvbihfdGVtcFZlYzIpO1xyXG4gICAgICAgIGRlbHRhTW92ZS5zdWJ0cmFjdCh0b3VjaC5nZXRVSVN0YXJ0TG9jYXRpb24oX3RlbXBWZWMyXzEpKTtcclxuICAgICAgICAvLyBGSVhNRTogdG91Y2ggbW92ZSBkZWx0YSBzaG91bGQgYmUgY2FsY3VsYXRlZCBieSBEUEkuXHJcbiAgICAgICAgaWYgKGRlbHRhTW92ZS5sZW5ndGgoKSA+IDcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl90b3VjaE1vdmVkICYmIGV2ZW50LnRhcmdldCAhPT0gdGhpcy5ub2RlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBTaW11bGF0ZSB0b3VjaCBjYW5jZWwgZm9yIHRhcmdldCBub2RlXHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW5jZWxFdmVudCA9IG5ldyBFdmVudFRvdWNoKGV2ZW50LmdldFRvdWNoZXMoKSwgZXZlbnQuYnViYmxlcyk7XHJcbiAgICAgICAgICAgICAgICBjYW5jZWxFdmVudC50eXBlID0gTm9kZS5FdmVudFR5cGUuVE9VQ0hfQ0FOQ0VMO1xyXG4gICAgICAgICAgICAgICAgY2FuY2VsRXZlbnQudG91Y2ggPSBldmVudC50b3VjaDtcclxuICAgICAgICAgICAgICAgIGNhbmNlbEV2ZW50LnNpbXVsYXRlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIChldmVudC50YXJnZXQgYXMgTm9kZSkuZGlzcGF0Y2hFdmVudChjYW5jZWxFdmVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaEVuZGVkIChldmVudDogRXZlbnRUb3VjaCwgY2FwdHVyZUxpc3RlbmVycz86IE5vZGVbXSkge1xyXG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkgfHwgIXRoaXMuX2NvbnRlbnQgfHwgIWV2ZW50KSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICh0aGlzLl9oYXNOZXN0ZWRWaWV3R3JvdXAoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5UT1VDSF9VUCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQudG91Y2ghO1xyXG4gICAgICAgIHRoaXMuX2hhbmRsZVJlbGVhc2VMb2dpYyh0b3VjaCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl90b3VjaE1vdmVkKSB7XHJcbiAgICAgICAgICAgIGV2ZW50LnByb3BhZ2F0aW9uU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fc3RvcFByb3BhZ2F0aW9uSWZUYXJnZXRJc01lKGV2ZW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoQ2FuY2VsbGVkIChldmVudDogRXZlbnRUb3VjaCwgY2FwdHVyZUxpc3RlbmVycz86IE5vZGVbXSkge1xyXG4gICAgICAgIGlmICghdGhpcy5lbmFibGVkSW5IaWVyYXJjaHkgfHwgIXRoaXMuX2NvbnRlbnQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2hhc05lc3RlZFZpZXdHcm91cChldmVudCwgY2FwdHVyZUxpc3RlbmVycykpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIC8vIEZpbHRlciB0b3VjaCBjYW5jZWwgZXZlbnQgc2VuZCBmcm9tIHNlbGZcclxuICAgICAgICBpZiAoZXZlbnQgJiYgIWV2ZW50LnNpbXVsYXRlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRvdWNoID0gZXZlbnQudG91Y2ghO1xyXG4gICAgICAgICAgICB0aGlzLl9oYW5kbGVSZWxlYXNlTG9naWModG91Y2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUoZXZlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2FsY3VsYXRlQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50ICYmIHRoaXMudmlldykge1xyXG4gICAgICAgICAgICAvLyByZWZyZXNoIGNvbnRlbnQgc2l6ZVxyXG4gICAgICAgICAgICBjb25zdCBsYXlvdXQgPSB0aGlzLl9jb250ZW50LmdldENvbXBvbmVudChMYXlvdXQpO1xyXG4gICAgICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5lbmFibGVkSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCB2aWV3VHJhbnMgPSB0aGlzLnZpZXc7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhbmNob3JYID0gdmlld1RyYW5zLndpZHRoICogdmlld1RyYW5zLmFuY2hvclg7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuY2hvclkgPSB2aWV3VHJhbnMuaGVpZ2h0ICogdmlld1RyYW5zLmFuY2hvclk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9sZWZ0Qm91bmRhcnkgPSAtYW5jaG9yWDtcclxuICAgICAgICAgICAgdGhpcy5fYm90dG9tQm91bmRhcnkgPSAtYW5jaG9yWTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0Qm91bmRhcnkgPSB0aGlzLl9sZWZ0Qm91bmRhcnkgKyB2aWV3VHJhbnMud2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvcEJvdW5kYXJ5ID0gdGhpcy5fYm90dG9tQm91bmRhcnkgKyB2aWV3VHJhbnMuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnRUb1RvcExlZnQodmlld1RyYW5zLmNvbnRlbnRTaXplKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGFzTmVzdGVkVmlld0dyb3VwIChldmVudDogRXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnM/OiBOb2RlW10pIHtcclxuICAgICAgICBpZiAoIWV2ZW50IHx8IGV2ZW50LmV2ZW50UGhhc2UgIT09IEV2ZW50LkNBUFRVUklOR19QSEFTRSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY2FwdHVyZUxpc3RlbmVycykge1xyXG4gICAgICAgICAgICAvLyBjYXB0dXJlTGlzdGVuZXJzIGFyZSBhcnJhbmdlZCBmcm9tIGNoaWxkIHRvIHBhcmVudFxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGxpc3RlbmVyIG9mIGNhcHR1cmVMaXN0ZW5lcnMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSBsaXN0ZW5lcjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ub2RlID09PSBpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCAmJiAoZXZlbnQudGFyZ2V0IGFzIE5vZGUpLmdldENvbXBvbmVudChWaWV3R3JvdXApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uZ2V0Q29tcG9uZW50KFZpZXdHcm91cCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zdGFydEluZXJ0aWFTY3JvbGwgKHRvdWNoTW92ZVZlbG9jaXR5OiBWZWMzKSB7XHJcbiAgICAgICAgY29uc3QgaW5lcnRpYVRvdGFsTW92ZW1lbnQgPSBuZXcgVmVjMyh0b3VjaE1vdmVWZWxvY2l0eSk7XHJcbiAgICAgICAgaW5lcnRpYVRvdGFsTW92ZW1lbnQubXVsdGlwbHlTY2FsYXIoTU9WRU1FTlRfRkFDVE9SKTtcclxuICAgICAgICB0aGlzLl9zdGFydEF0dGVudWF0aW5nQXV0b1Njcm9sbChpbmVydGlhVG90YWxNb3ZlbWVudCwgdG91Y2hNb3ZlVmVsb2NpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3RvciAoZGlzdGFuY2U6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLmJyYWtlIDw9IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuICgxIC0gdGhpcy5icmFrZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBhdHRlbnVhdGUgZm9ybXVsYSBmcm9tOiBodHRwOi8vbGVhcm5vcGVuZ2wuY29tLyMhTGlnaHRpbmcvTGlnaHQtY2FzdGVyc1xyXG4gICAgICAgIHJldHVybiAoMSAtIHRoaXMuYnJha2UpICogKDEgLyAoMSArIGRpc3RhbmNlICogMC4wMDAwMTQgKyBkaXN0YW5jZSAqIGRpc3RhbmNlICogMC4wMDAwMDAwMDgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N0YXJ0QXR0ZW51YXRpbmdBdXRvU2Nyb2xsIChkZWx0YU1vdmU6IFZlYzMsIGluaXRpYWxWZWxvY2l0eTogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldERlbHRhID0gbmV3IFZlYzMoZGVsdGFNb3ZlKTtcclxuICAgICAgICB0YXJnZXREZWx0YS5ub3JtYWxpemUoKTtcclxuICAgICAgICBpZiAodGhpcy5fY29udGVudCAmJiB0aGlzLnZpZXcpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGVudFNpemUgPSB0aGlzLl9jb250ZW50IS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhLmNvbnRlbnRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCBzY3JvbGxWaWV3U2l6ZSA9IHRoaXMudmlldy5jb250ZW50U2l6ZTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHRvdGFsTW92ZVdpZHRoID0gKGNvbnRlbnRTaXplLndpZHRoIC0gc2Nyb2xsVmlld1NpemUud2lkdGgpO1xyXG4gICAgICAgICAgICBjb25zdCB0b3RhbE1vdmVIZWlnaHQgPSAoY29udGVudFNpemUuaGVpZ2h0IC0gc2Nyb2xsVmlld1NpemUuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGVudWF0ZWRGYWN0b3JYID0gdGhpcy5fY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3Rvcih0b3RhbE1vdmVXaWR0aCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dGVudWF0ZWRGYWN0b3JZID0gdGhpcy5fY2FsY3VsYXRlQXR0ZW51YXRlZEZhY3Rvcih0b3RhbE1vdmVIZWlnaHQpO1xyXG5cclxuICAgICAgICAgICAgdGFyZ2V0RGVsdGEueCA9IHRhcmdldERlbHRhLnggKiB0b3RhbE1vdmVXaWR0aCAqICgxIC0gdGhpcy5icmFrZSkgKiBhdHRlbnVhdGVkRmFjdG9yWDtcclxuICAgICAgICAgICAgdGFyZ2V0RGVsdGEueSA9IHRhcmdldERlbHRhLnkgKiB0b3RhbE1vdmVIZWlnaHQgKiBhdHRlbnVhdGVkRmFjdG9yWSAqICgxIC0gdGhpcy5icmFrZSk7XHJcbiAgICAgICAgICAgIHRhcmdldERlbHRhLnogPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxNb3ZlTGVuZ3RoID0gZGVsdGFNb3ZlLmxlbmd0aCgpO1xyXG4gICAgICAgIGxldCBmYWN0b3IgPSB0YXJnZXREZWx0YS5sZW5ndGgoKSAvIG9yaWdpbmFsTW92ZUxlbmd0aDtcclxuICAgICAgICB0YXJnZXREZWx0YS5hZGQoZGVsdGFNb3ZlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYnJha2UgPiAwICYmIGZhY3RvciA+IDcpIHtcclxuICAgICAgICAgICAgZmFjdG9yID0gTWF0aC5zcXJ0KGZhY3Rvcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGEgPSBuZXcgVmVjMyhkZWx0YU1vdmUpO1xyXG4gICAgICAgICAgICBhLm11bHRpcGx5U2NhbGFyKGZhY3Rvcik7XHJcbiAgICAgICAgICAgIHRhcmdldERlbHRhLnNldChhKTtcclxuICAgICAgICAgICAgdGFyZ2V0RGVsdGEuYWRkKGRlbHRhTW92ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgdGltZSA9IHRoaXMuX2NhbGN1bGF0ZUF1dG9TY3JvbGxUaW1lQnlJbml0aWFsU3BlZWQoaW5pdGlhbFZlbG9jaXR5Lmxlbmd0aCgpKTtcclxuICAgICAgICBpZiAodGhpcy5icmFrZSA+IDAgJiYgZmFjdG9yID4gMykge1xyXG4gICAgICAgICAgICBmYWN0b3IgPSAzO1xyXG4gICAgICAgICAgICB0aW1lID0gdGltZSAqIGZhY3RvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJyYWtlID09PSAwICYmIGZhY3RvciA+IDEpIHtcclxuICAgICAgICAgICAgdGltZSA9IHRpbWUgKiBmYWN0b3I7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zdGFydEF1dG9TY3JvbGwodGFyZ2V0RGVsdGEsIHRpbWUsIHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2FsY3VsYXRlQXV0b1Njcm9sbFRpbWVCeUluaXRpYWxTcGVlZCAoaW5pdGlhbFNwZWVkOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGguc3FydChpbml0aWFsU3BlZWQgLyA1KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zdGFydEF1dG9TY3JvbGwgKGRlbHRhTW92ZTogVmVjMywgdGltZUluU2Vjb25kOiBudW1iZXIsIGF0dGVudWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IGFkanVzdGVkRGVsdGFNb3ZlID0gdGhpcy5fZmxhdHRlblZlY3RvckJ5RGlyZWN0aW9uKGRlbHRhTW92ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxUYXJnZXREZWx0YSA9IGFkanVzdGVkRGVsdGFNb3ZlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxBdHRlbnVhdGUgPSBhdHRlbnVhdGVkO1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9hdXRvU2Nyb2xsU3RhcnRQb3NpdGlvbiwgdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKSk7XHJcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZSA9IHRpbWVJblNlY29uZDtcclxuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lID0gMDtcclxuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU2Nyb2xsRW5kZWRXaXRoVGhyZXNob2xkRXZlbnRGaXJlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxCcmFraW5nU3RhcnRQb3NpdGlvbiA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRPdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcclxuICAgICAgICBpZiAoIWN1cnJlbnRPdXRPZkJvdW5kYXJ5LmVxdWFscyhaRVJPLCBFUFNJTE9OKSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY2FsY3VsYXRlVG91Y2hNb3ZlVmVsb2NpdHkgKCkge1xyXG4gICAgICAgIGxldCB0b3RhbFRpbWUgPSAwO1xyXG4gICAgICAgIHRvdGFsVGltZSA9IHRoaXMuX3RvdWNoTW92ZVRpbWVEZWx0YXMucmVkdWNlKChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhICsgYjtcclxuICAgICAgICB9LCB0b3RhbFRpbWUpO1xyXG5cclxuICAgICAgICBpZiAodG90YWxUaW1lIDw9IDAgfHwgdG90YWxUaW1lID49IDAuNSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB0b3RhbE1vdmVtZW50ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICB0b3RhbE1vdmVtZW50ID0gdGhpcy5fdG91Y2hNb3ZlRGlzcGxhY2VtZW50cy5yZWR1Y2UoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgYS5hZGQoYik7XHJcbiAgICAgICAgICAgIHJldHVybiBhO1xyXG4gICAgICAgIH0sIHRvdGFsTW92ZW1lbnQpO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzModG90YWxNb3ZlbWVudC54ICogKDEgLSB0aGlzLmJyYWtlKSAvIHRvdGFsVGltZSxcclxuICAgICAgICAgICAgdG90YWxNb3ZlbWVudC55ICogKDEgLSB0aGlzLmJyYWtlKSAvIHRvdGFsVGltZSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9mbGF0dGVuVmVjdG9yQnlEaXJlY3Rpb24gKHZlY3RvcjogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHZlY3RvcjtcclxuICAgICAgICByZXN1bHQueCA9IHRoaXMuaG9yaXpvbnRhbCA/IHJlc3VsdC54IDogMDtcclxuICAgICAgICByZXN1bHQueSA9IHRoaXMudmVydGljYWwgPyByZXN1bHQueSA6IDA7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX21vdmVDb250ZW50IChkZWx0YU1vdmU6IFZlYzMsIGNhblN0YXJ0Qm91bmNlQmFjaz86IGJvb2xlYW4pIHtcclxuICAgICAgICBjb25zdCBhZGp1c3RlZE1vdmUgPSB0aGlzLl9mbGF0dGVuVmVjdG9yQnlEaXJlY3Rpb24oZGVsdGFNb3ZlKTtcclxuICAgICAgICBfdGVtcFZlYzMuc2V0KHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIF90ZW1wVmVjMy5hZGQoYWRqdXN0ZWRNb3ZlKTtcclxuICAgICAgICBfdGVtcFZlYzMuc2V0KE1hdGguZmxvb3IoX3RlbXBWZWMzLnggKiBUT0xFUkFOQ0UpICogRVBTSUxPTiwgTWF0aC5mbG9vcihfdGVtcFZlYzMueSAqIFRPTEVSQU5DRSkgKiBFUFNJTE9OLCBfdGVtcFZlYzMueik7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50UG9zaXRpb24oX3RlbXBWZWMzKTtcclxuICAgICAgICBjb25zdCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIob3V0T2ZCb3VuZGFyeSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmVsYXN0aWMgJiYgY2FuU3RhcnRCb3VuY2VCYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0Qm91bmNlQmFja0lmTmVlZGVkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0Q29udGVudExlZnRCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY29udGVudFBvcyA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCk7XHJcbiAgICAgICAgY29uc3QgdWlUcmFucyA9IHRoaXMuX2NvbnRlbnQhLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRlbnRQb3MueCAtIHVpVHJhbnMuYW5jaG9yWCAqIHVpVHJhbnMud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgdWlUcmFucyA9IHRoaXMuX2NvbnRlbnQhLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcCE7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSArIHVpVHJhbnMud2lkdGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRDb250ZW50VG9wQm91bmRhcnkgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fY29udGVudCkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVpVHJhbnMgPSB0aGlzLl9jb250ZW50IS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSArIHVpVHJhbnMuaGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcclxuICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5fY29udGVudCEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICByZXR1cm4gY29udGVudFBvcy55IC0gdWlUcmFucy5hbmNob3JZICogdWlUcmFucy5oZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSAoYWRkaXRpb24/OiBWZWMzKSB7XHJcbiAgICAgICAgYWRkaXRpb24gPSBhZGRpdGlvbiB8fCBuZXcgVmVjMygpO1xyXG4gICAgICAgIGlmIChhZGRpdGlvbi5lcXVhbHMoWkVSTywgRVBTSUxPTikgJiYgIXRoaXMuX291dE9mQm91bmRhcnlBbW91bnREaXJ0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb3V0T2ZCb3VuZGFyeUFtb3VudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBvdXRPZkJvdW5kYXJ5QW1vdW50ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCA+IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5QW1vdW50LnggPSB0aGlzLl9sZWZ0Qm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLl9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCA8IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC54ID0gdGhpcy5fcmlnaHRCb3VuZGFyeSAtICh0aGlzLl9nZXRDb250ZW50UmlnaHRCb3VuZGFyeSgpICsgYWRkaXRpb24ueCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55IDwgdGhpcy5fdG9wQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgb3V0T2ZCb3VuZGFyeUFtb3VudC55ID0gdGhpcy5fdG9wQm91bmRhcnkgLSAodGhpcy5fZ2V0Q29udGVudFRvcEJvdW5kYXJ5KCkgKyBhZGRpdGlvbi55KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2dldENvbnRlbnRCb3R0b21Cb3VuZGFyeSgpICsgYWRkaXRpb24ueSA+IHRoaXMuX2JvdHRvbUJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQueSA9IHRoaXMuX2JvdHRvbUJvdW5kYXJ5IC0gKHRoaXMuX2dldENvbnRlbnRCb3R0b21Cb3VuZGFyeSgpICsgYWRkaXRpb24ueSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWRkaXRpb24uZXF1YWxzKFpFUk8sIEVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX291dE9mQm91bmRhcnlBbW91bnQgPSBvdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG91dE9mQm91bmRhcnlBbW91bnQgPSB0aGlzLl9jbGFtcERlbHRhKG91dE9mQm91bmRhcnlBbW91bnQpO1xyXG4gICAgICAgIHJldHVybiBvdXRPZkJvdW5kYXJ5QW1vdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlU2Nyb2xsQmFyIChvdXRPZkJvdW5kYXJ5OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWxTY3JvbGxCYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5faG9yaXpvbnRhbFNjcm9sbEJhci5vblNjcm9sbChvdXRPZkJvdW5kYXJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIub25TY3JvbGwob3V0T2ZCb3VuZGFyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25TY3JvbGxCYXJUb3VjaEJlZ2FuICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faG9yaXpvbnRhbFNjcm9sbEJhcikge1xyXG4gICAgICAgICAgICB0aGlzLl9ob3Jpem9udGFsU2Nyb2xsQmFyLm9uVG91Y2hCZWdhbigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMudmVydGljYWxTY3JvbGxCYXIpIHtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0aWNhbFNjcm9sbEJhci5vblRvdWNoQmVnYW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblNjcm9sbEJhclRvdWNoRW5kZWQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ob3Jpem9udGFsU2Nyb2xsQmFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2hvcml6b250YWxTY3JvbGxCYXIub25Ub3VjaEVuZGVkKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyLm9uVG91Y2hFbmRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2Rpc3BhdGNoRXZlbnQgKGV2ZW50OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoZXZlbnQgPT09IEV2ZW50VHlwZS5TQ1JPTExfRU5ERUQpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2Nyb2xsRXZlbnRFbWl0TWFzayA9IDA7XHJcblxyXG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IEV2ZW50VHlwZS5TQ1JPTExfVE9fVE9QXHJcbiAgICAgICAgICAgIHx8IGV2ZW50ID09PSBFdmVudFR5cGUuU0NST0xMX1RPX0JPVFRPTVxyXG4gICAgICAgICAgICB8fCBldmVudCA9PT0gRXZlbnRUeXBlLlNDUk9MTF9UT19MRUZUXHJcbiAgICAgICAgICAgIHx8IGV2ZW50ID09PSBFdmVudFR5cGUuU0NST0xMX1RPX1JJR0hUKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmbGFnID0gKDEgPDwgZXZlbnRNYXBbZXZlbnRdKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Njcm9sbEV2ZW50RW1pdE1hc2sgJiBmbGFnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxFdmVudEVtaXRNYXNrIHw9IGZsYWc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIENvbXBvbmVudEV2ZW50SGFuZGxlci5lbWl0RXZlbnRzKHRoaXMuc2Nyb2xsRXZlbnRzLCB0aGlzLCBldmVudE1hcFtldmVudF0pO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KGV2ZW50LCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2FkanVzdENvbnRlbnRPdXRPZkJvdW5kYXJ5ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRlbnQpe1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vdXRPZkJvdW5kYXJ5QW1vdW50RGlydHkgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9pc091dE9mQm91bmRhcnkoKSkge1xyXG4gICAgICAgICAgICBjb25zdCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcclxuICAgICAgICAgICAgX3RlbXBWZWMzLnNldCh0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpKTtcclxuICAgICAgICAgICAgX3RlbXBWZWMzLmFkZChvdXRPZkJvdW5kYXJ5KTtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudC5zZXRQb3NpdGlvbihfdGVtcFZlYzMpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXIoWkVSTyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGlkZVNjcm9sbEJhciAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2hvcml6b250YWxTY3JvbGxCYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5faG9yaXpvbnRhbFNjcm9sbEJhci5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fdmVydGljYWxTY3JvbGxCYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fdmVydGljYWxTY3JvbGxCYXIuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZVNjcm9sbEJhclN0YXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2NvbnRlbnQgfHwgIXRoaXMudmlldykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHZpZXdUcmFucyA9IHRoaXMudmlldztcclxuICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5fY29udGVudCEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICBpZiAodGhpcy52ZXJ0aWNhbFNjcm9sbEJhcikge1xyXG4gICAgICAgICAgICBpZiAodWlUcmFucy5oZWlnaHQgPCB2aWV3VHJhbnMuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZlcnRpY2FsU2Nyb2xsQmFyLmhpZGUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmVydGljYWxTY3JvbGxCYXIuc2hvdygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyKSB7XHJcbiAgICAgICAgICAgIGlmICh1aVRyYW5zLndpZHRoIDwgdmlld1RyYW5zLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWxTY3JvbGxCYXIuaGlkZSgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsU2Nyb2xsQmFyLnNob3coKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gVGhpcyBpcyBmb3IgU2Nyb2xsVmlldyBhcyBjaGlsZHJlbiBvZiBhIEJ1dHRvblxyXG4gICAgcHJvdGVjdGVkIF9zdG9wUHJvcGFnYXRpb25JZlRhcmdldElzTWUgKGV2ZW50OiBFdmVudCkge1xyXG4gICAgICAgIGlmIChldmVudC5ldmVudFBoYXNlID09PSBFdmVudC5BVF9UQVJHRVQgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLm5vZGUpIHtcclxuICAgICAgICAgICAgZXZlbnQucHJvcGFnYXRpb25TdG9wcGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9wcm9jZXNzRGVsdGFNb3ZlIChkZWx0YU1vdmU6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9zY3JvbGxDaGlsZHJlbihkZWx0YU1vdmUpO1xyXG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZShkZWx0YU1vdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGFuZGxlTW92ZUxvZ2ljICh0b3VjaDogVG91Y2gpIHtcclxuICAgICAgICB0aGlzLl9kZWx0YVBvcy5zZXQodGhpcy5fZ2V0TG9jYWxBeGlzQWxpZ25EZWx0YSh0b3VjaCkpO1xyXG4gICAgICAgIHRoaXMuX3Byb2Nlc3NEZWx0YU1vdmUodGhpcy5fZGVsdGFQb3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGFuZGxlUmVsZWFzZUxvZ2ljICh0b3VjaDogVG91Y2gpIHtcclxuICAgICAgICB0aGlzLl9kZWx0YVBvcy5zZXQodGhpcy5fZ2V0TG9jYWxBeGlzQWxpZ25EZWx0YSh0b3VjaCkpO1xyXG4gICAgICAgIHRoaXMuX2dhdGhlclRvdWNoTW92ZSh0aGlzLl9kZWx0YVBvcyk7XHJcbiAgICAgICAgdGhpcy5fcHJvY2Vzc0luZXJ0aWFTY3JvbGwoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbGluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9zY3JvbGxpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9hdXRvU2Nyb2xsaW5nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5TQ1JPTExfRU5ERUQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2V0TG9jYWxBeGlzQWxpZ25EZWx0YSAodG91Y2g6IFRvdWNoKXtcclxuICAgICAgICBjb25zdCB1aVRyYW5zZm9ybUNvbXAgPSB0aGlzLm5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgICAgIGNvbnN0IHZlYyA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgICAgIGlmICh1aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICAgICAgdG91Y2guZ2V0VUlMb2NhdGlvbihfdGVtcFZlYzIpO1xyXG4gICAgICAgICAgICB0b3VjaC5nZXRVSVByZXZpb3VzTG9jYXRpb24oX3RlbXBWZWMyXzEpO1xyXG4gICAgICAgICAgICBfdGVtcFZlYzMuc2V0KF90ZW1wVmVjMi54LCBfdGVtcFZlYzIueSwgMCk7XHJcbiAgICAgICAgICAgIF90ZW1wVmVjM18xLnNldChfdGVtcFZlYzJfMS54LCBfdGVtcFZlYzJfMS55LCAwKTtcclxuICAgICAgICAgICAgdWlUcmFuc2Zvcm1Db21wLmNvbnZlcnRUb05vZGVTcGFjZUFSKF90ZW1wVmVjMywgX3RlbXBWZWMzKTtcclxuICAgICAgICAgICAgdWlUcmFuc2Zvcm1Db21wLmNvbnZlcnRUb05vZGVTcGFjZUFSKF90ZW1wVmVjM18xLCBfdGVtcFZlYzNfMSk7XHJcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QodmVjLCBfdGVtcFZlYzMsIF90ZW1wVmVjM18xKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2ZWM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zY3JvbGxDaGlsZHJlbiAoZGVsdGFNb3ZlOiBWZWMzKSB7XHJcbiAgICAgICAgZGVsdGFNb3ZlID0gdGhpcy5fY2xhbXBEZWx0YShkZWx0YU1vdmUpO1xyXG5cclxuICAgICAgICBjb25zdCByZWFsTW92ZSA9IGRlbHRhTW92ZTtcclxuICAgICAgICBsZXQgb3V0T2ZCb3VuZGFyeTogVmVjMztcclxuICAgICAgICBpZiAodGhpcy5lbGFzdGljKSB7XHJcbiAgICAgICAgICAgIG91dE9mQm91bmRhcnkgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSgpO1xyXG4gICAgICAgICAgICByZWFsTW92ZS54ICo9IChvdXRPZkJvdW5kYXJ5LnggPT09IDAgPyAxIDogMC41KTtcclxuICAgICAgICAgICAgcmVhbE1vdmUueSAqPSAob3V0T2ZCb3VuZGFyeS55ID09PSAwID8gMSA6IDAuNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuZWxhc3RpYykge1xyXG4gICAgICAgICAgICBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkocmVhbE1vdmUpO1xyXG4gICAgICAgICAgICByZWFsTW92ZS5hZGQob3V0T2ZCb3VuZGFyeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgc2Nyb2xsRXZlbnRUeXBlO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgYW5jaG9yWCwgYW5jaG9yWSwgd2lkdGgsIGhlaWdodCB9ID0gdGhpcy5fY29udGVudCEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICAgICAgY29uc3QgcG9zID0gdGhpcy5fY29udGVudC5wb3NpdGlvbiB8fCBaRVJPO1xyXG4gICAgICAgICAgICBpZiAocmVhbE1vdmUueSA+IDApIHsgLy8gdXBcclxuICAgICAgICAgICAgICAgIGNvbnN0IGljQm90dG9tUG9zID0gcG9zLnkgLSBhbmNob3JZICogaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpY0JvdHRvbVBvcyArIHJlYWxNb3ZlLnkgPj0gdGhpcy5fYm90dG9tQm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxFdmVudFR5cGUgPSBFdmVudFR5cGUuU0NST0xMX1RPX0JPVFRPTTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZWFsTW92ZS55IDwgMCkgeyAvLyBkb3duXHJcbiAgICAgICAgICAgICAgICBjb25zdCBpY1RvcFBvcyA9IHBvcy55IC0gYW5jaG9yWSAqIGhlaWdodCArIGhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaWNUb3BQb3MgKyByZWFsTW92ZS55IDw9IHRoaXMuX3RvcEJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsRXZlbnRUeXBlID0gRXZlbnRUeXBlLlNDUk9MTF9UT19UT1A7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlYWxNb3ZlLnggPCAwKSB7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgIGNvbnN0IGljUmlnaHRQb3MgPSBwb3MueCAtIGFuY2hvclggKiB3aWR0aCArIHdpZHRoO1xyXG4gICAgICAgICAgICAgICAgaWYgKGljUmlnaHRQb3MgKyByZWFsTW92ZS54IDw9IHRoaXMuX3JpZ2h0Qm91bmRhcnkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzY3JvbGxFdmVudFR5cGUgPSBFdmVudFR5cGUuU0NST0xMX1RPX1JJR0hUO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlYWxNb3ZlLnggPiAwKSB7IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpY0xlZnRQb3MgPSBwb3MueCAtIGFuY2hvclggKiB3aWR0aDtcclxuICAgICAgICAgICAgICAgIGlmIChpY0xlZnRQb3MgKyByZWFsTW92ZS54ID49IHRoaXMuX2xlZnRCb3VuZGFyeSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbEV2ZW50VHlwZSA9IEV2ZW50VHlwZS5TQ1JPTExfVE9fTEVGVDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbW92ZUNvbnRlbnQocmVhbE1vdmUsIGZhbHNlKTtcclxuXHJcbiAgICAgICAgaWYgKHJlYWxNb3ZlLnggIT09IDAgfHwgcmVhbE1vdmUueSAhPT0gMCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3Njcm9sbGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2Nyb2xsaW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlNDUk9MTF9CRUdBTik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuU0NST0xMSU5HKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzY3JvbGxFdmVudFR5cGUgJiYgc2Nyb2xsRXZlbnRUeXBlLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChzY3JvbGxFdmVudFR5cGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9oYW5kbGVQcmVzc0xvZ2ljICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXV0b1Njcm9sbGluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5TQ1JPTExfRU5ERUQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzQm91bmNpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlUHJldmlvdXNUaW1lc3RhbXAgPSBnZXRUaW1lSW5NaWxsaXNlY29uZHMoKTtcclxuICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlVGltZURlbHRhcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICB0aGlzLl9vblNjcm9sbEJhclRvdWNoQmVnYW4oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NsYW1wRGVsdGEgKGRlbHRhOiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbnRlbnQgJiYgdGhpcy52aWV3KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFZpZXdTaXplID0gdGhpcy52aWV3LmNvbnRlbnRTaXplO1xyXG4gICAgICAgICAgICBjb25zdCB1aVRyYW5zID0gdGhpcy5fY29udGVudCEuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICAgICAgaWYgKHVpVHJhbnMud2lkdGggPCBzY3JvbGxWaWV3U2l6ZS53aWR0aCkge1xyXG4gICAgICAgICAgICAgICAgZGVsdGEueCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHVpVHJhbnMuaGVpZ2h0IDwgc2Nyb2xsVmlld1NpemUuaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgICAgICBkZWx0YS55ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGRlbHRhO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZ2F0aGVyVG91Y2hNb3ZlIChkZWx0YTogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IGNsYW1wRHQgPSBkZWx0YS5jbG9uZSgpO1xyXG4gICAgICAgIHRoaXMuX2NsYW1wRGVsdGEoY2xhbXBEdCk7XHJcblxyXG4gICAgICAgIHdoaWxlICh0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLmxlbmd0aCA+PSBOVU1CRVJfT0ZfR0FUSEVSRURfVE9VQ0hFU19GT1JfTU9WRV9TUEVFRCkge1xyXG4gICAgICAgICAgICB0aGlzLl90b3VjaE1vdmVEaXNwbGFjZW1lbnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3RvdWNoTW92ZVRpbWVEZWx0YXMuc2hpZnQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3RvdWNoTW92ZURpc3BsYWNlbWVudHMucHVzaChjbGFtcER0KTtcclxuXHJcbiAgICAgICAgY29uc3QgdGltZVN0YW1wID0gZ2V0VGltZUluTWlsbGlzZWNvbmRzKCk7XHJcbiAgICAgICAgdGhpcy5fdG91Y2hNb3ZlVGltZURlbHRhcy5wdXNoKCh0aW1lU3RhbXAgLSB0aGlzLl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCkgLyAxMDAwKTtcclxuICAgICAgICB0aGlzLl90b3VjaE1vdmVQcmV2aW91c1RpbWVzdGFtcCA9IHRpbWVTdGFtcDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N0YXJ0Qm91bmNlQmFja0lmTmVlZGVkICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZWxhc3RpYykge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2dldEhvd011Y2hPdXRPZkJvdW5kYXJ5KCk7XHJcbiAgICAgICAgYm91bmNlQmFja0Ftb3VudCA9IHRoaXMuX2NsYW1wRGVsdGEoYm91bmNlQmFja0Ftb3VudCk7XHJcblxyXG4gICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LmVxdWFscyhaRVJPLCBFUFNJTE9OKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBib3VuY2VCYWNrVGltZSA9IE1hdGgubWF4KHRoaXMuYm91bmNlRHVyYXRpb24sIDApO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0QXV0b1Njcm9sbChib3VuY2VCYWNrQW1vdW50LCBib3VuY2VCYWNrVGltZSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5faXNCb3VuY2luZykge1xyXG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC55ID4gMCkgeyB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5CT1VOQ0VfVE9QKTsgfVxyXG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC55IDwgMCkgeyB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5CT1VOQ0VfQk9UVE9NKTsgfVxyXG4gICAgICAgICAgICBpZiAoYm91bmNlQmFja0Ftb3VudC54ID4gMCkgeyB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5CT1VOQ0VfUklHSFQpOyB9XHJcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPCAwKSB7IHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLkJPVU5DRV9MRUZUKTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9pc0JvdW5jaW5nID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfcHJvY2Vzc0luZXJ0aWFTY3JvbGwgKCkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5jZUJhY2tTdGFydGVkID0gdGhpcy5fc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQoKTtcclxuICAgICAgICBpZiAoIWJvdW5jZUJhY2tTdGFydGVkICYmIHRoaXMuaW5lcnRpYSkge1xyXG4gICAgICAgICAgICBjb25zdCB0b3VjaE1vdmVWZWxvY2l0eSA9IHRoaXMuX2NhbGN1bGF0ZVRvdWNoTW92ZVZlbG9jaXR5KCk7XHJcbiAgICAgICAgICAgIGlmICghdG91Y2hNb3ZlVmVsb2NpdHkuZXF1YWxzKF90ZW1wVmVjMywgRVBTSUxPTikgJiYgdGhpcy5icmFrZSA8IDEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXJ0SW5lcnRpYVNjcm9sbCh0b3VjaE1vdmVWZWxvY2l0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaXNPdXRPZkJvdW5kYXJ5ICgpIHtcclxuICAgICAgICBjb25zdCBvdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcclxuICAgICAgICByZXR1cm4gIW91dE9mQm91bmRhcnkuZXF1YWxzKFpFUk8sIEVQU0lMT04pO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaXNOZWNlc3NhcnlBdXRvU2Nyb2xsQnJha2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9hdXRvU2Nyb2xsQnJha2luZykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pc091dE9mQm91bmRhcnkoKSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2F1dG9TY3JvbGxDdXJyZW50bHlPdXRPZkJvdW5kYXJ5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQ3VycmVudGx5T3V0T2ZCb3VuZGFyeSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24gPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbEN1cnJlbnRseU91dE9mQm91bmRhcnkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3Byb2Nlc3NBdXRvU2Nyb2xsaW5nIChkdCkge1xyXG4gICAgICAgIGNvbnN0IGlzQXV0b1Njcm9sbEJyYWtlID0gdGhpcy5faXNOZWNlc3NhcnlBdXRvU2Nyb2xsQnJha2UoKTtcclxuICAgICAgICBjb25zdCBicmFraW5nRmFjdG9yID0gaXNBdXRvU2Nyb2xsQnJha2UgPyBPVVRfT0ZfQk9VTkRBUllfQlJFQUtJTkdfRkFDVE9SIDogMTtcclxuICAgICAgICB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lICs9IGR0ICogKDEgLyBicmFraW5nRmFjdG9yKTtcclxuXHJcbiAgICAgICAgbGV0IHBlcmNlbnRhZ2UgPSBNYXRoLm1pbigxLCB0aGlzLl9hdXRvU2Nyb2xsQWNjdW11bGF0ZWRUaW1lIC8gdGhpcy5fYXV0b1Njcm9sbFRvdGFsVGltZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TY3JvbGxBdHRlbnVhdGUpIHtcclxuICAgICAgICAgICAgcGVyY2VudGFnZSA9IHF1aW50RWFzZU91dChwZXJjZW50YWdlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGEgPSBuZXcgVmVjMyh0aGlzLl9hdXRvU2Nyb2xsVGFyZ2V0RGVsdGEpO1xyXG4gICAgICAgIGEubXVsdGlwbHlTY2FsYXIocGVyY2VudGFnZSk7XHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSBuZXcgVmVjMyh0aGlzLl9hdXRvU2Nyb2xsU3RhcnRQb3NpdGlvbik7XHJcbiAgICAgICAgbmV3UG9zaXRpb24uYWRkKGEpO1xyXG4gICAgICAgIGxldCByZWFjaGVkRW5kID0gTWF0aC5hYnMocGVyY2VudGFnZSAtIDEpIDw9IEVQU0lMT047XHJcblxyXG4gICAgICAgIGNvbnN0IGZpcmVFdmVudCA9IE1hdGguYWJzKHBlcmNlbnRhZ2UgLSAxKSA8PSB0aGlzLmdldFNjcm9sbEVuZGVkRXZlbnRUaW1pbmcoKTtcclxuICAgICAgICBpZiAoZmlyZUV2ZW50ICYmICF0aGlzLl9pc1Njcm9sbEVuZGVkV2l0aFRocmVzaG9sZEV2ZW50RmlyZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuU0NST0xMX0VOR19XSVRIX1RIUkVTSE9MRCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzU2Nyb2xsRW5kZWRXaXRoVGhyZXNob2xkRXZlbnRGaXJlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5lbGFzdGljKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJyYWtlT2Zmc2V0UG9zaXRpb24gPSBuZXcgVmVjMyhuZXdQb3NpdGlvbik7XHJcbiAgICAgICAgICAgIGJyYWtlT2Zmc2V0UG9zaXRpb24uc3VidHJhY3QodGhpcy5fYXV0b1Njcm9sbEJyYWtpbmdTdGFydFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGlzQXV0b1Njcm9sbEJyYWtlKSB7XHJcbiAgICAgICAgICAgICAgICBicmFrZU9mZnNldFBvc2l0aW9uLm11bHRpcGx5U2NhbGFyKGJyYWtpbmdGYWN0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld1Bvc2l0aW9uLnNldCh0aGlzLl9hdXRvU2Nyb2xsQnJha2luZ1N0YXJ0UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBuZXdQb3NpdGlvbi5hZGQoYnJha2VPZmZzZXRQb3NpdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbW92ZURlbHRhID0gbmV3IFZlYzMobmV3UG9zaXRpb24pO1xyXG4gICAgICAgICAgICBtb3ZlRGVsdGEuc3VidHJhY3QodGhpcy5nZXRDb250ZW50UG9zaXRpb24oKSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG91dE9mQm91bmRhcnkgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeShtb3ZlRGVsdGEpO1xyXG4gICAgICAgICAgICBpZiAoIW91dE9mQm91bmRhcnkuZXF1YWxzKFpFUk8sIEVQU0lMT04pKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdQb3NpdGlvbi5hZGQob3V0T2ZCb3VuZGFyeSk7XHJcbiAgICAgICAgICAgICAgICByZWFjaGVkRW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlYWNoZWRFbmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fYXV0b1Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVsdGFNb3ZlID0gbmV3IFZlYzMobmV3UG9zaXRpb24pO1xyXG4gICAgICAgIGRlbHRhTW92ZS5zdWJ0cmFjdCh0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpKTtcclxuICAgICAgICB0aGlzLl9tb3ZlQ29udGVudCh0aGlzLl9jbGFtcERlbHRhKGRlbHRhTW92ZSksIHJlYWNoZWRFbmQpO1xyXG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlNDUk9MTElORyk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fYXV0b1Njcm9sbGluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9pc0JvdW5jaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEV2ZW50KEV2ZW50VHlwZS5TQ1JPTExfRU5ERUQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NoZWNrTW91c2VXaGVlbCAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRPdXRPZkJvdW5kYXJ5ID0gdGhpcy5fZ2V0SG93TXVjaE91dE9mQm91bmRhcnkoKTtcclxuICAgICAgICBjb25zdCBtYXhFbGFwc2VkVGltZSA9IDAuMTtcclxuXHJcbiAgICAgICAgaWYgKCFjdXJyZW50T3V0T2ZCb3VuZGFyeS5lcXVhbHMoWkVSTywgRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgdGhpcy5fcHJvY2Vzc0luZXJ0aWFTY3JvbGwoKTtcclxuICAgICAgICAgICAgdGhpcy51bnNjaGVkdWxlKHRoaXMuX2NoZWNrTW91c2VXaGVlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoRXZlbnRUeXBlLlNDUk9MTF9FTkRFRCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0b3BNb3VzZVdoZWVsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21vdXNlV2hlZWxFdmVudEVsYXBzZWRUaW1lICs9IGR0O1xyXG5cclxuICAgICAgICAvLyBtb3VzZSB3aGVlbCBldmVudCBpcyBlbmRlZFxyXG4gICAgICAgIGlmICh0aGlzLl9tb3VzZVdoZWVsRXZlbnRFbGFwc2VkVGltZSA+IG1heEVsYXBzZWRUaW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uU2Nyb2xsQmFyVG91Y2hFbmRlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVuc2NoZWR1bGUodGhpcy5fY2hlY2tNb3VzZVdoZWVsKTtcclxuICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hFdmVudChFdmVudFR5cGUuU0NST0xMX0VOREVEKTtcclxuICAgICAgICAgICAgdGhpcy5fc3RvcE1vdXNlV2hlZWwgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jYWxjdWxhdGVNb3ZlUGVyY2VudERlbHRhIChvcHRpb25zKSB7XHJcbiAgICAgICAgY29uc3QgYW5jaG9yID0gb3B0aW9ucy5hbmNob3I7XHJcbiAgICAgICAgY29uc3QgYXBwbHlUb0hvcml6b250YWwgPSBvcHRpb25zLmFwcGx5VG9Ib3Jpem9udGFsO1xyXG4gICAgICAgIGNvbnN0IGFwcGx5VG9WZXJ0aWNhbCA9IG9wdGlvbnMuYXBwbHlUb1ZlcnRpY2FsO1xyXG4gICAgICAgIHRoaXMuX2NhbGN1bGF0ZUJvdW5kYXJ5KCk7XHJcblxyXG4gICAgICAgIGFuY2hvci5jbGFtcGYobmV3IFZlYzIoMCwgMCksIG5ldyBWZWMyKDEsIDEpKTtcclxuXHJcbiAgICAgICAgbGV0IGJvdHRvbURlbHRhID0gdGhpcy5fZ2V0Q29udGVudEJvdHRvbUJvdW5kYXJ5KCkgLSB0aGlzLl9ib3R0b21Cb3VuZGFyeTtcclxuICAgICAgICBib3R0b21EZWx0YSA9IC1ib3R0b21EZWx0YTtcclxuXHJcbiAgICAgICAgbGV0IGxlZnREZWx0YSA9IHRoaXMuX2dldENvbnRlbnRMZWZ0Qm91bmRhcnkoKSAtIHRoaXMuX2xlZnRCb3VuZGFyeTtcclxuICAgICAgICBsZWZ0RGVsdGEgPSAtbGVmdERlbHRhO1xyXG5cclxuICAgICAgICBjb25zdCBtb3ZlRGVsdGEgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50ICYmIHRoaXMudmlldykge1xyXG4gICAgICAgICAgICBsZXQgdG90YWxTY3JvbGxEZWx0YSA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHVpVHJhbnMgPSB0aGlzLl9jb250ZW50IS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50U2l6ZSA9IHVpVHJhbnMuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFNpemUgPSB0aGlzLnZpZXcuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgIGlmIChhcHBseVRvSG9yaXpvbnRhbCkge1xyXG4gICAgICAgICAgICAgICAgdG90YWxTY3JvbGxEZWx0YSA9IGNvbnRlbnRTaXplLndpZHRoIC0gc2Nyb2xsU2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIG1vdmVEZWx0YS54ID0gbGVmdERlbHRhIC0gdG90YWxTY3JvbGxEZWx0YSAqIGFuY2hvci54O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChhcHBseVRvVmVydGljYWwpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSBzY3JvbGxTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgICAgIG1vdmVEZWx0YS55ID0gYm90dG9tRGVsdGEgLSB0b3RhbFNjcm9sbERlbHRhICogYW5jaG9yLnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBtb3ZlRGVsdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9tb3ZlQ29udGVudFRvVG9wTGVmdCAoc2Nyb2xsVmlld1NpemU6IFNpemUpIHtcclxuICAgICAgICBsZXQgYm90dG9tRGVsdGEgPSB0aGlzLl9nZXRDb250ZW50Qm90dG9tQm91bmRhcnkoKSAtIHRoaXMuX2JvdHRvbUJvdW5kYXJ5O1xyXG4gICAgICAgIGJvdHRvbURlbHRhID0gLWJvdHRvbURlbHRhO1xyXG4gICAgICAgIGNvbnN0IG1vdmVEZWx0YSA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgbGV0IHRvdGFsU2Nyb2xsRGVsdGEgPSAwO1xyXG5cclxuICAgICAgICBsZXQgbGVmdERlbHRhID0gdGhpcy5fZ2V0Q29udGVudExlZnRCb3VuZGFyeSgpIC0gdGhpcy5fbGVmdEJvdW5kYXJ5O1xyXG4gICAgICAgIGxlZnREZWx0YSA9IC1sZWZ0RGVsdGE7XHJcblxyXG4gICAgICAgIC8vIOaYr+WQpumZkOWItuWcqOS4iuinhuWMuuS4iui+uVxyXG4gICAgICAgIGlmICh0aGlzLl9jb250ZW50KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVpVHJhbnMgPSB0aGlzLl9jb250ZW50IS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50U2l6ZSA9IHVpVHJhbnMuY29udGVudFNpemU7XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50U2l6ZS5oZWlnaHQgPCBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHRvdGFsU2Nyb2xsRGVsdGEgPSBjb250ZW50U2l6ZS5oZWlnaHQgLSBzY3JvbGxWaWV3U2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICBtb3ZlRGVsdGEueSA9IGJvdHRvbURlbHRhIC0gdG90YWxTY3JvbGxEZWx0YTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g5piv5ZCm6ZmQ5Yi25Zyo5LiK6KeG5Yy65bem6L65XHJcbiAgICAgICAgICAgIGlmIChjb250ZW50U2l6ZS53aWR0aCA8IHNjcm9sbFZpZXdTaXplLndpZHRoKSB7XHJcbiAgICAgICAgICAgICAgICB0b3RhbFNjcm9sbERlbHRhID0gY29udGVudFNpemUud2lkdGggLSBzY3JvbGxWaWV3U2l6ZS53aWR0aDtcclxuICAgICAgICAgICAgICAgIG1vdmVEZWx0YS54ID0gbGVmdERlbHRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl91cGRhdGVTY3JvbGxCYXJTdGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuX21vdmVDb250ZW50KG1vdmVEZWx0YSk7XHJcbiAgICAgICAgdGhpcy5fYWRqdXN0Q29udGVudE91dE9mQm91bmRhcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NjYWxlQ2hhbmdlZCAodmFsdWU6IFRyYW5zZm9ybUJpdCl7XHJcbiAgICAgICAgaWYgKHZhbHVlID09PSBUcmFuc2Zvcm1CaXQuU0NBTEUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FsY3VsYXRlQm91bmRhcnkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCBzY3JvbGwtdG8tdG9wXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLWJvdHRvbVxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IHNjcm9sbC10by1sZWZ0XHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgc2Nyb2xsLXRvLXJpZ2h0XHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgc2Nyb2xsaW5nXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgYm91bmNlLWJvdHRvbVxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IGJvdW5jZS10b3BcclxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcclxuICogQHBhcmFtIHtTY3JvbGxWaWV3fSBzY3JvbGxWaWV3IC0gVGhlIFNjcm9sbFZpZXcgY29tcG9uZW50LlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCBib3VuY2UtbGVmdFxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IGJvdW5jZS1yaWdodFxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IHNjcm9sbC1lbmRlZFxyXG4gKiBAcGFyYW0ge0V2ZW50LkV2ZW50Q3VzdG9tfSBldmVudFxyXG4gKiBAcGFyYW0ge1Njcm9sbFZpZXd9IHNjcm9sbFZpZXcgLSBUaGUgU2Nyb2xsVmlldyBjb21wb25lbnQuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBOb3RlOiBUaGlzIGV2ZW50IGlzIGVtaXR0ZWQgZnJvbSB0aGUgbm9kZSB0byB3aGljaCB0aGUgY29tcG9uZW50IGJlbG9uZ3MuXHJcbiAqIEB6aFxyXG4gKiDms6jmhI/vvJrmraTkuovku7bmmK/ku47or6Xnu4Tku7bmiYDlsZ7nmoQgTm9kZSDkuIrpnaLmtL7lj5Hlh7rmnaXnmoTvvIzpnIDopoHnlKggbm9kZS5vbiDmnaXnm5HlkKzjgIJcclxuICogQGV2ZW50IHRvdWNoLXVwXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIE5vdGU6IFRoaXMgZXZlbnQgaXMgZW1pdHRlZCBmcm9tIHRoZSBub2RlIHRvIHdoaWNoIHRoZSBjb21wb25lbnQgYmVsb25ncy5cclxuICogQHpoXHJcbiAqIOazqOaEj++8muatpOS6i+S7tuaYr+S7juivpee7hOS7tuaJgOWxnueahCBOb2RlIOS4iumdoua0vuWPkeWHuuadpeeahO+8jOmcgOimgeeUqCBub2RlLm9uIOadpeebkeWQrOOAglxyXG4gKiBAZXZlbnQgc2Nyb2xsLWJlZ2FuXHJcbiAqIEBwYXJhbSB7RXZlbnQuRXZlbnRDdXN0b219IGV2ZW50XHJcbiAqIEBwYXJhbSB7U2Nyb2xsVmlld30gc2Nyb2xsVmlldyAtIFRoZSBTY3JvbGxWaWV3IGNvbXBvbmVudC5cclxuICovXHJcbiJdfQ==