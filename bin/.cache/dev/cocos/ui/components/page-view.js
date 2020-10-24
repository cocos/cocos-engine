(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/components/index.js", "../../core/data/decorators/index.js", "../../core/platform/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "./layout.js", "./page-view-indicator.js", "./scroll-view.js", "./scroll-bar.js", "../../core/platform/debug.js", "../../core/data/utils/extends-enum.js", "../../core/default-constants.js", "../../core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/components/index.js"), require("../../core/data/decorators/index.js"), require("../../core/platform/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("./layout.js"), require("./page-view-indicator.js"), require("./scroll-view.js"), require("./scroll-bar.js"), require("../../core/platform/debug.js"), require("../../core/data/utils/extends-enum.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global._enum, global.layout, global.pageViewIndicator, global.scrollView, global.scrollBar, global.debug, global.extendsEnum, global.defaultConstants, global.globalExports);
    global.pageView = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _enum, _layout, _pageViewIndicator, _scrollView, _scrollBar, _debug, _extendsEnum, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PageView = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

  function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _temp_vec2 = new _index4.Vec2();
  /**
   * @en Enum for Page View Size Mode.
   *
   * @zh 页面视图每个页面统一的大小类型
   */


  var SizeMode;

  (function (SizeMode) {
    SizeMode[SizeMode["Unified"] = 0] = "Unified";
    SizeMode[SizeMode["Free"] = 1] = "Free";
  })(SizeMode || (SizeMode = {}));

  (0, _enum.ccenum)(SizeMode);
  /**
   * @en Enum for Page View Direction.
   *
   * @zh 页面视图滚动类型
   */

  var Direction;

  (function (Direction) {
    Direction[Direction["Horizontal"] = 0] = "Horizontal";
    Direction[Direction["Vertical"] = 1] = "Vertical";
  })(Direction || (Direction = {}));

  (0, _enum.ccenum)(Direction);
  /**
   * @en Enum for ScrollView event type.
   *
   * @zh 滚动视图事件类型
   */

  var EventType;
  /**
   * @en
   * The PageView control.
   *
   * @zh
   * 页面视图组件
   */

  (function (EventType) {
    EventType["PAGE_TURNING"] = "page-turning";
  })(EventType || (EventType = {}));

  var // @ts-ignore
  PageView = (_dec = (0, _index2.ccclass)('cc.PageView'), _dec2 = (0, _index2.help)('i18n:cc.PageView'), _dec3 = (0, _index2.executionOrder)(110), _dec4 = (0, _index2.menu)('UI/PageView'), _dec5 = (0, _index2.type)(SizeMode), _dec6 = (0, _index2.tooltip)('页面视图中每个页面大小类型'), _dec7 = (0, _index2.type)(Direction), _dec8 = (0, _index2.tooltip)('页面视图滚动类型'), _dec9 = (0, _index2.range)([0, 1, 0.01]), _dec10 = (0, _index2.tooltip)('滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原'), _dec11 = (0, _index2.range)([0, 1, 0.01]), _dec12 = (0, _index2.tooltip)('设置 PageView PageTurning 事件的发送时机'), _dec13 = (0, _index2.type)(_pageViewIndicator.PageViewIndicator), _dec14 = (0, _index2.tooltip)('页面视图指示器组件'), _dec15 = (0, _index2.tooltip)('快速滑动翻页临界值\n当用户快速滑动时，会根据滑动开始和结束的距离与时间计算出一个速度值\n该值与此临界值相比较，如果大于临界值，则进行自动翻页'), _dec16 = (0, _index2.type)(_scrollBar.ScrollBar), _dec17 = (0, _index2.visible)(false), _dec18 = (0, _index2.type)(_scrollBar.ScrollBar), _dec19 = (0, _index2.visible)(false), _dec20 = (0, _index2.visible)(false), _dec21 = (0, _index2.visible)(false), _dec22 = (0, _index2.visible)(false), _dec23 = (0, _index2.type)([_index.EventHandler]), _dec24 = (0, _index2.visible)(false), _dec25 = (0, _index2.type)([_index.EventHandler]), _dec26 = (0, _index2.tooltip)('滚动视图的事件回调函数'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_ScrollView) {
    _inherits(PageView, _ScrollView);

    function PageView() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, PageView);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PageView)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "autoPageTurningThreshold", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "horizontal", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "vertical", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "cancelInnerEvents", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "scrollEvents", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pageTurningSpeed", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "pageEvents", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_sizeMode", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_scrollThreshold", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_pageTurningEventTiming", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_indicator", _descriptor12, _assertThisInitialized(_this));

      _this._curPageIdx = 0;
      _this._lastPageIdx = 0;
      _this._pages = [];
      _this._initContentPos = new _index4.Vec3();
      _this._scrollCenterOffsetX = [];
      _this._scrollCenterOffsetY = [];
      _this._touchBeganPosition = new _index4.Vec3();
      _this._touchEndPosition = new _index4.Vec3();
      return _this;
    }

    _createClass(PageView, [{
      key: "__preload",
      value: function __preload() {
        this.node.on(_index3.SystemEventType.SIZE_CHANGED, this._updateAllPagesSize, this);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        _get(_getPrototypeOf(PageView.prototype), "onEnable", this).call(this);

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.on(PageView.EventType.SCROLL_ENG_WITH_THRESHOLD, this._dispatchPageTurningEvent, this);
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        _get(_getPrototypeOf(PageView.prototype), "onDisable", this).call(this);

        if (!_defaultConstants.EDITOR || _globalExports.legacyCC.GAME_VIEW) {
          this.node.off(PageView.EventType.SCROLL_ENG_WITH_THRESHOLD, this._dispatchPageTurningEvent, this);
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        this._initPages();

        if (this.indicator) {
          this.indicator.setPageView(this);
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this.node.off(_index3.SystemEventType.SIZE_CHANGED, this._updateAllPagesSize, this);
      }
      /**
       * @en
       * Returns current page index.
       *
       * @zh
       * 返回当前页面索引。
       *
       * @returns 当前页面索引。
       */

    }, {
      key: "getCurrentPageIndex",
      value: function getCurrentPageIndex() {
        return this._curPageIdx;
      }
      /**
       * @en
       * Set current page index.
       *
       * @zh
       * 设置当前页面索引。
       * @param index 索引。
       */

    }, {
      key: "setCurrentPageIndex",
      value: function setCurrentPageIndex(index) {
        this.scrollToPage(index, 1);
      }
      /**
       * @en
       * Returns all pages of pageview.
       *
       * @zh
       * 返回视图中的所有页面。
       *
       * @returns 输=视图所有页面。
       */

    }, {
      key: "getPages",
      value: function getPages() {
        return this._pages;
      }
      /**
       * @en
       * At the end of the current page view to insert a new view.
       *
       * @zh
       * 在当前页面视图的尾部插入一个新视图。
       *
       * @param page 新视图。
       */

    }, {
      key: "addPage",
      value: function addPage(page) {
        if (!page || this._pages.indexOf(page) !== -1 || !this.content) {
          return;
        }

        if (!page._uiProps.uiTransformComp) {
          (0, _debug.logID)(4301);
          return;
        }

        this.content.addChild(page);

        this._pages.push(page);

        this._updatePageView();
      }
      /**
       * @en
       * Inserts a page in the specified location.
       *
       * @zh
       * 将页面插入指定位置中。
       *
       * @param page 新视图。
       * @param index 指定位置。
       */

    }, {
      key: "insertPage",
      value: function insertPage(page, index) {
        if (index < 0 || !page || this._pages.indexOf(page) !== -1 || !this.content) {
          return;
        }

        var pageCount = this._pages.length;

        if (index >= pageCount) {
          this.addPage(page);
        } else {
          if (!page._uiProps.uiTransformComp) {
            (0, _debug.logID)(4301);
            return;
          }

          this._pages.splice(index, 0, page);

          this.content.insertChild(page, index);

          this._updatePageView();
        }
      }
      /**
       * @en
       * Removes a page from PageView.
       *
       * @zh
       * 移除指定页面。
       *
       * @param page 指定页面。
       */

    }, {
      key: "removePage",
      value: function removePage(page) {
        if (!page || !this.content) {
          return;
        }

        var index = this._pages.indexOf(page);

        if (index === -1) {
          (0, _debug.warnID)(4300, page.name);
          return;
        }

        this.removePageAtIndex(index);
      }
      /**
       * @en
       * Removes a page at index of PageView.
       *
       * @zh
       * 移除指定下标的页面。
       *
       * @param index 页面下标。
       */

    }, {
      key: "removePageAtIndex",
      value: function removePageAtIndex(index) {
        var pageList = this._pages;

        if (index < 0 || index >= pageList.length) {
          return;
        }

        var page = pageList[index];

        if (!page || !this.content) {
          return;
        }

        this.content.removeChild(page);
        pageList.splice(index, 1);

        this._updatePageView();
      }
      /**
       * @en
       * Removes all pages from PageView.
       *
       * @zh
       * 移除所有页面。
       */

    }, {
      key: "removeAllPages",
      value: function removeAllPages() {
        if (!this.content) {
          return;
        }

        var locPages = this._pages;

        for (var i = 0, len = locPages.length; i < len; i++) {
          this.content.removeChild(locPages[i]);
        }

        this._pages.length = 0;

        this._updatePageView();
      }
      /**
       * @en
       * Scroll PageView to index.
       *
       * @zh
       * 滚动到指定页面
       *
       * @param idx index of page.
       * @param timeInSecond scrolling time.
       */

    }, {
      key: "scrollToPage",
      value: function scrollToPage(idx) {
        var timeInSecond = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.3;

        if (idx < 0 || idx >= this._pages.length) {
          return;
        }

        this._curPageIdx = idx;
        this.scrollToOffset(this._moveOffsetValue(idx), timeInSecond, true);

        if (this.indicator) {
          this.indicator._changedState();
        }
      } // override the method of ScrollView

    }, {
      key: "getScrollEndedEventTiming",
      value: function getScrollEndedEventTiming() {
        return this.pageTurningEventTiming;
      } // 刷新页面视图

    }, {
      key: "_updatePageView",
      value: function _updatePageView() {
        // 当页面数组变化时修改 content 大小
        if (!this.content) {
          return;
        }

        var layout = this.content.getComponent(_layout.Layout);

        if (layout && layout.enabled) {
          layout.updateLayout();
        }

        var pageCount = this._pages.length;

        if (this._curPageIdx >= pageCount) {
          this._curPageIdx = pageCount === 0 ? 0 : pageCount - 1;
          this._lastPageIdx = this._curPageIdx;
        } // 进行排序


        var contentPos = this._initContentPos;

        for (var i = 0; i < pageCount; ++i) {
          var page = this._pages[i]; // page.setSiblingIndex(i);

          var pos = page.position;

          if (this.direction === Direction.Horizontal) {
            this._scrollCenterOffsetX[i] = Math.abs(contentPos.x + pos.x);
          } else {
            this._scrollCenterOffsetY[i] = Math.abs(contentPos.y + pos.y);
          }
        } // 刷新 indicator 信息与状态


        if (this.indicator) {
          this.indicator._refresh();
        }
      } // 刷新所有页面的大小

    }, {
      key: "_updateAllPagesSize",
      value: function _updateAllPagesSize() {
        var viewTrans = this.view;

        if (!this.content || !viewTrans) {
          return;
        }

        if (this._sizeMode !== SizeMode.Unified) {
          return;
        }

        var locPages = _defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW ? this.content.children : this._pages;
        var selfSize = viewTrans.contentSize;

        for (var i = 0, len = locPages.length; i < len; i++) {
          locPages[i]._uiProps.uiTransformComp.setContentSize(selfSize);
        }
      }
    }, {
      key: "_handleReleaseLogic",
      value: function _handleReleaseLogic() {
        this._autoScrollToPage();

        if (this._scrolling) {
          this._scrolling = false;

          if (!this._autoScrolling) {
            this._dispatchEvent(PageView.EventType.SCROLL_ENDED);
          }
        }
      }
    }, {
      key: "_onTouchBegan",
      value: function _onTouchBegan(event, captureListeners) {
        event.touch.getUILocation(_temp_vec2);

        _index4.Vec3.set(this._touchBeganPosition, _temp_vec2.x, _temp_vec2.y, 0);

        _get(_getPrototypeOf(PageView.prototype), "_onTouchBegan", this).call(this, event, captureListeners);
      }
    }, {
      key: "_onTouchMoved",
      value: function _onTouchMoved(event, captureListeners) {
        _get(_getPrototypeOf(PageView.prototype), "_onTouchMoved", this).call(this, event, captureListeners);
      }
    }, {
      key: "_onTouchEnded",
      value: function _onTouchEnded(event, captureListeners) {
        event.touch.getUILocation(_temp_vec2);

        _index4.Vec3.set(this._touchEndPosition, _temp_vec2.x, _temp_vec2.y, 0);

        _get(_getPrototypeOf(PageView.prototype), "_onTouchEnded", this).call(this, event, captureListeners);
      }
    }, {
      key: "_onTouchCancelled",
      value: function _onTouchCancelled(event, captureListeners) {
        event.touch.getUILocation(_temp_vec2);

        _index4.Vec3.set(this._touchEndPosition, _temp_vec2.x, _temp_vec2.y, 0);

        _get(_getPrototypeOf(PageView.prototype), "_onTouchCancelled", this).call(this, event, captureListeners);
      }
    }, {
      key: "_onMouseWheel",
      value: function _onMouseWheel() {}
    }, {
      key: "_syncScrollDirection",
      value: function _syncScrollDirection() {
        this.horizontal = this.direction === Direction.Horizontal;
        this.vertical = this.direction === Direction.Vertical;
      }
    }, {
      key: "_syncSizeMode",
      value: function _syncSizeMode() {
        var viewTrans = this.view;

        if (!this.content || !viewTrans) {
          return;
        }

        var layout = this.content.getComponent(_layout.Layout);

        if (layout) {
          if (this._sizeMode === SizeMode.Free && this._pages.length > 0) {
            var firstPageTrans = this._pages[0]._uiProps.uiTransformComp;
            var lastPageTrans = this._pages[this._pages.length - 1]._uiProps.uiTransformComp;

            if (this.direction === Direction.Horizontal) {
              layout.paddingLeft = (viewTrans.width - firstPageTrans.width) / 2;
              layout.paddingRight = (viewTrans.width - lastPageTrans.width) / 2;
            } else if (this.direction === Direction.Vertical) {
              layout.paddingTop = (viewTrans.height - firstPageTrans.height) / 2;
              layout.paddingBottom = (viewTrans.height - lastPageTrans.height) / 2;
            }
          }

          layout.updateLayout();
        }
      } // 初始化页面

    }, {
      key: "_initPages",
      value: function _initPages() {
        if (!this.content) {
          return;
        }

        this._initContentPos = this.content.position;
        var children = this.content.children;

        for (var i = 0; i < children.length; ++i) {
          var page = children[i];

          if (this._pages.indexOf(page) >= 0) {
            continue;
          }

          this._pages.push(page);
        }

        this._syncScrollDirection();

        this._syncSizeMode();

        this._updatePageView();
      }
    }, {
      key: "_dispatchPageTurningEvent",
      value: function _dispatchPageTurningEvent() {
        if (this._lastPageIdx === this._curPageIdx) {
          return;
        }

        this._lastPageIdx = this._curPageIdx;

        _index.EventHandler.emitEvents(this.pageEvents, this, EventType.PAGE_TURNING);

        this.node.emit(EventType.PAGE_TURNING, this);
      } // 快速滑动

    }, {
      key: "_isQuicklyScrollable",
      value: function _isQuicklyScrollable(touchMoveVelocity) {
        if (this.direction === Direction.Horizontal) {
          if (Math.abs(touchMoveVelocity.x) > this.autoPageTurningThreshold) {
            return true;
          }
        } else if (this.direction === Direction.Vertical) {
          if (Math.abs(touchMoveVelocity.y) > this.autoPageTurningThreshold) {
            return true;
          }
        }

        return false;
      } // 通过 idx 获取偏移值数值

    }, {
      key: "_moveOffsetValue",
      value: function _moveOffsetValue(idx) {
        var offset = new _index4.Vec3();

        if (this._sizeMode === SizeMode.Free) {
          if (this.direction === Direction.Horizontal) {
            offset.x = this._scrollCenterOffsetX[idx];
          } else if (this.direction === Direction.Vertical) {
            offset.y = this._scrollCenterOffsetY[idx];
          }
        } else {
          var viewTrans = this.view;

          if (!viewTrans) {
            return offset;
          }

          if (this.direction === Direction.Horizontal) {
            offset.x = idx * viewTrans.width;
          } else if (this.direction === Direction.Vertical) {
            offset.y = idx * viewTrans.height;
          }
        }

        return offset;
      }
    }, {
      key: "_getDragDirection",
      value: function _getDragDirection(moveOffset) {
        if (this._direction === Direction.Horizontal) {
          if (moveOffset.x === 0) {
            return 0;
          }

          return moveOffset.x > 0 ? 1 : -1;
        } else {
          // 由于滚动 Y 轴的原点在在右上角所以应该是小于 0
          if (moveOffset.y === 0) {
            return 0;
          }

          return moveOffset.y < 0 ? 1 : -1;
        }
      } // 是否超过自动滚动临界值

    }, {
      key: "_isScrollable",
      value: function _isScrollable(offset, index, nextIndex) {
        if (this._sizeMode === SizeMode.Free) {
          var curPageCenter = 0;
          var nextPageCenter = 0;

          if (this.direction === Direction.Horizontal) {
            curPageCenter = this._scrollCenterOffsetX[index];
            nextPageCenter = this._scrollCenterOffsetX[nextIndex];
            return Math.abs(offset.x) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
          } else if (this.direction === Direction.Vertical) {
            curPageCenter = this._scrollCenterOffsetY[index];
            nextPageCenter = this._scrollCenterOffsetY[nextIndex];
            return Math.abs(offset.y) >= Math.abs(curPageCenter - nextPageCenter) * this.scrollThreshold;
          }
        } else {
          var viewTrans = this.view;

          if (!viewTrans) {
            return;
          }

          if (this.direction === Direction.Horizontal) {
            return Math.abs(offset.x) >= viewTrans.width * this.scrollThreshold;
          } else if (this.direction === Direction.Vertical) {
            return Math.abs(offset.y) >= viewTrans.height * this.scrollThreshold;
          }
        }
      }
    }, {
      key: "_autoScrollToPage",
      value: function _autoScrollToPage() {
        var bounceBackStarted = this._startBounceBackIfNeeded();

        if (bounceBackStarted) {
          var bounceBackAmount = this._getHowMuchOutOfBoundary();

          bounceBackAmount = this._clampDelta(bounceBackAmount);

          if (bounceBackAmount.x > 0 || bounceBackAmount.y < 0) {
            this._curPageIdx = this._pages.length === 0 ? 0 : this._pages.length - 1;
          }

          if (bounceBackAmount.x < 0 || bounceBackAmount.y > 0) {
            this._curPageIdx = 0;
          }

          if (this.indicator) {
            this.indicator._changedState();
          }
        } else {
          var moveOffset = new _index4.Vec3();

          _index4.Vec3.subtract(moveOffset, this._touchBeganPosition, this._touchEndPosition);

          var index = this._curPageIdx;

          var nextIndex = index + this._getDragDirection(moveOffset);

          var timeInSecond = this.pageTurningSpeed * Math.abs(index - nextIndex);

          if (nextIndex < this._pages.length) {
            if (this._isScrollable(moveOffset, index, nextIndex)) {
              this.scrollToPage(nextIndex, timeInSecond);
              return;
            } else {
              var touchMoveVelocity = this._calculateTouchMoveVelocity();

              if (this._isQuicklyScrollable(touchMoveVelocity)) {
                this.scrollToPage(nextIndex, timeInSecond);
                return;
              }
            }
          }

          this.scrollToPage(index, timeInSecond);
        }
      }
    }, {
      key: "sizeMode",

      /**
       * @en
       * Specify the size type of each page in PageView.
       *
       * @zh
       * 页面视图中每个页面大小类型
       */
      get: function get() {
        return this._sizeMode;
      },
      set: function set(value) {
        if (this._sizeMode === value) {
          return;
        }

        this._sizeMode = value;

        this._syncSizeMode();
      }
      /**
       * @en
       * The page view direction.
       *
       * @zh
       * 页面视图滚动类型
       */

    }, {
      key: "direction",
      get: function get() {
        return this._direction;
      },
      set: function set(value) {
        if (this._direction === value) {
          return;
        }

        this._direction = value;

        this._syncScrollDirection();
      }
      /**
       * @en
       * The scroll threshold value, when drag exceeds this value,
       * release the next page will automatically scroll, less than the restore.
       *
       * @zh
       * 滚动临界值，默认单位百分比，当拖拽超出该数值时，松开会自动滚动下一页，小于时则还原。
       */

    }, {
      key: "scrollThreshold",
      get: function get() {
        return this._scrollThreshold;
      },
      set: function set(value) {
        if (this._scrollThreshold === value) {
          return;
        }

        this._scrollThreshold = value;
      }
      /**
       * @en
       * Change the PageTurning event timing of PageView.
       *
       * @zh
       * 设置 PageView PageTurning 事件的发送时机。
       */

    }, {
      key: "pageTurningEventTiming",
      get: function get() {
        return this._pageTurningEventTiming;
      },
      set: function set(value) {
        if (this._pageTurningEventTiming === value) {
          return;
        }

        this._pageTurningEventTiming = value;
      }
      /**
       * @en
       * The Page View Indicator.
       *
       * @zh
       * 页面视图指示器组件
       */

    }, {
      key: "indicator",
      get: function get() {
        return this._indicator;
      },
      set: function set(value) {
        if (this._indicator === value) {
          return;
        }

        this._indicator = value;

        if (this.indicator) {
          this.indicator.setPageView(this);
        }
      }
    }, {
      key: "curPageIdx",
      get: function get() {
        return this._curPageIdx;
      }
    }, {
      key: "verticalScrollBar",
      get: function get() {
        return _get(_getPrototypeOf(PageView.prototype), "verticalScrollBar", this);
      },
      set: function set(value) {
        _set(_getPrototypeOf(PageView.prototype), "verticalScrollBar", value, this, true);
      }
    }, {
      key: "horizontalScrollBar",
      get: function get() {
        return _get(_getPrototypeOf(PageView.prototype), "horizontalScrollBar", this);
      },
      set: function set(value) {
        _set(_getPrototypeOf(PageView.prototype), "horizontalScrollBar", value, this, true);
      }
    }]);

    return PageView;
  }(_scrollView.ScrollView), _class3.SizeMode = SizeMode, _class3.Direction = Direction, _class3.EventType = (0, _extendsEnum.extendsEnum)(EventType, _scrollView.EventType), _temp), (_applyDecoratedDescriptor(_class2.prototype, "sizeMode", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "sizeMode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "scrollThreshold", [_index2.slide, _dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "scrollThreshold"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "pageTurningEventTiming", [_index2.slide, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "pageTurningEventTiming"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "indicator", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class2.prototype, "indicator"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "autoPageTurningThreshold", [_index2.serializable, _dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 100;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "verticalScrollBar", [_dec16, _index2.override, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "verticalScrollBar"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "horizontalScrollBar", [_dec18, _index2.override, _dec19], Object.getOwnPropertyDescriptor(_class2.prototype, "horizontalScrollBar"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "horizontal", [_index2.override, _index2.serializable, _dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "vertical", [_index2.override, _index2.serializable, _dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "cancelInnerEvents", [_index2.override, _index2.serializable, _dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "scrollEvents", [_dec23, _index2.serializable, _index2.override, _dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "pageTurningSpeed", [_index2.serializable, _index2.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.3;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "pageEvents", [_dec25, _index2.serializable, _dec26], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_sizeMode", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return SizeMode.Unified;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Direction.Horizontal;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_scrollThreshold", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.5;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_pageTurningEventTiming", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "_indicator", [_index2.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  /**
   * @en
   * Note: This event is emitted from the node to which the component belongs.
   * @zh
   * 注意：此事件是从该组件所属的 Node 上面派发出来的，需要用 node.on 来监听。
   * @event page-turning
   * @param {Event.EventCustom} event
   * @param {PageView} pageView - The PageView component.
   */

  _exports.PageView = PageView;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvcGFnZS12aWV3LnRzIl0sIm5hbWVzIjpbIl90ZW1wX3ZlYzIiLCJWZWMyIiwiU2l6ZU1vZGUiLCJEaXJlY3Rpb24iLCJFdmVudFR5cGUiLCJQYWdlVmlldyIsIlBhZ2VWaWV3SW5kaWNhdG9yIiwiU2Nyb2xsQmFyIiwiQ29tcG9uZW50RXZlbnRIYW5kbGVyIiwiX2N1clBhZ2VJZHgiLCJfbGFzdFBhZ2VJZHgiLCJfcGFnZXMiLCJfaW5pdENvbnRlbnRQb3MiLCJWZWMzIiwiX3Njcm9sbENlbnRlck9mZnNldFgiLCJfc2Nyb2xsQ2VudGVyT2Zmc2V0WSIsIl90b3VjaEJlZ2FuUG9zaXRpb24iLCJfdG91Y2hFbmRQb3NpdGlvbiIsIm5vZGUiLCJvbiIsIlN5c3RlbUV2ZW50VHlwZSIsIlNJWkVfQ0hBTkdFRCIsIl91cGRhdGVBbGxQYWdlc1NpemUiLCJFRElUT1IiLCJsZWdhY3lDQyIsIkdBTUVfVklFVyIsIlNDUk9MTF9FTkdfV0lUSF9USFJFU0hPTEQiLCJfZGlzcGF0Y2hQYWdlVHVybmluZ0V2ZW50Iiwib2ZmIiwiX2luaXRQYWdlcyIsImluZGljYXRvciIsInNldFBhZ2VWaWV3IiwiaW5kZXgiLCJzY3JvbGxUb1BhZ2UiLCJwYWdlIiwiaW5kZXhPZiIsImNvbnRlbnQiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsImFkZENoaWxkIiwicHVzaCIsIl91cGRhdGVQYWdlVmlldyIsInBhZ2VDb3VudCIsImxlbmd0aCIsImFkZFBhZ2UiLCJzcGxpY2UiLCJpbnNlcnRDaGlsZCIsIm5hbWUiLCJyZW1vdmVQYWdlQXRJbmRleCIsInBhZ2VMaXN0IiwicmVtb3ZlQ2hpbGQiLCJsb2NQYWdlcyIsImkiLCJsZW4iLCJpZHgiLCJ0aW1lSW5TZWNvbmQiLCJzY3JvbGxUb09mZnNldCIsIl9tb3ZlT2Zmc2V0VmFsdWUiLCJfY2hhbmdlZFN0YXRlIiwicGFnZVR1cm5pbmdFdmVudFRpbWluZyIsImxheW91dCIsImdldENvbXBvbmVudCIsIkxheW91dCIsImVuYWJsZWQiLCJ1cGRhdGVMYXlvdXQiLCJjb250ZW50UG9zIiwicG9zIiwicG9zaXRpb24iLCJkaXJlY3Rpb24iLCJIb3Jpem9udGFsIiwiTWF0aCIsImFicyIsIngiLCJ5IiwiX3JlZnJlc2giLCJ2aWV3VHJhbnMiLCJ2aWV3IiwiX3NpemVNb2RlIiwiVW5pZmllZCIsImNoaWxkcmVuIiwic2VsZlNpemUiLCJjb250ZW50U2l6ZSIsInNldENvbnRlbnRTaXplIiwiX2F1dG9TY3JvbGxUb1BhZ2UiLCJfc2Nyb2xsaW5nIiwiX2F1dG9TY3JvbGxpbmciLCJfZGlzcGF0Y2hFdmVudCIsIlNDUk9MTF9FTkRFRCIsImV2ZW50IiwiY2FwdHVyZUxpc3RlbmVycyIsInRvdWNoIiwiZ2V0VUlMb2NhdGlvbiIsInNldCIsImhvcml6b250YWwiLCJ2ZXJ0aWNhbCIsIlZlcnRpY2FsIiwiRnJlZSIsImZpcnN0UGFnZVRyYW5zIiwibGFzdFBhZ2VUcmFucyIsInBhZGRpbmdMZWZ0Iiwid2lkdGgiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwiaGVpZ2h0IiwicGFkZGluZ0JvdHRvbSIsIl9zeW5jU2Nyb2xsRGlyZWN0aW9uIiwiX3N5bmNTaXplTW9kZSIsImVtaXRFdmVudHMiLCJwYWdlRXZlbnRzIiwiUEFHRV9UVVJOSU5HIiwiZW1pdCIsInRvdWNoTW92ZVZlbG9jaXR5IiwiYXV0b1BhZ2VUdXJuaW5nVGhyZXNob2xkIiwib2Zmc2V0IiwibW92ZU9mZnNldCIsIl9kaXJlY3Rpb24iLCJuZXh0SW5kZXgiLCJjdXJQYWdlQ2VudGVyIiwibmV4dFBhZ2VDZW50ZXIiLCJzY3JvbGxUaHJlc2hvbGQiLCJib3VuY2VCYWNrU3RhcnRlZCIsIl9zdGFydEJvdW5jZUJhY2tJZk5lZWRlZCIsImJvdW5jZUJhY2tBbW91bnQiLCJfZ2V0SG93TXVjaE91dE9mQm91bmRhcnkiLCJfY2xhbXBEZWx0YSIsInN1YnRyYWN0IiwiX2dldERyYWdEaXJlY3Rpb24iLCJwYWdlVHVybmluZ1NwZWVkIiwiX2lzU2Nyb2xsYWJsZSIsIl9jYWxjdWxhdGVUb3VjaE1vdmVWZWxvY2l0eSIsIl9pc1F1aWNrbHlTY3JvbGxhYmxlIiwidmFsdWUiLCJfc2Nyb2xsVGhyZXNob2xkIiwiX3BhZ2VUdXJuaW5nRXZlbnRUaW1pbmciLCJfaW5kaWNhdG9yIiwiU2Nyb2xsVmlldyIsIlNjcm9sbEV2ZW50VHlwZSIsInNsaWRlIiwic2VyaWFsaXphYmxlIiwib3ZlcnJpZGUiLCJlZGl0YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2Q0EsTUFBTUEsVUFBVSxHQUFHLElBQUlDLFlBQUosRUFBbkI7QUFFQTs7Ozs7OztNQUtLQyxROzthQUFBQSxRO0FBQUFBLElBQUFBLFEsQ0FBQUEsUTtBQUFBQSxJQUFBQSxRLENBQUFBLFE7S0FBQUEsUSxLQUFBQSxROztBQWFMLG9CQUFPQSxRQUFQO0FBRUE7Ozs7OztNQUtLQyxTOzthQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7S0FBQUEsUyxLQUFBQSxTOztBQWFMLG9CQUFPQSxTQUFQO0FBRUE7Ozs7OztNQUtLQyxTO0FBSUw7Ozs7Ozs7O2FBSktBLFM7QUFBQUEsSUFBQUEsUztLQUFBQSxTLEtBQUFBLFM7O01BZUw7QUFDYUMsRUFBQUEsUSxXQUxaLHFCQUFRLGFBQVIsQyxVQUNBLGtCQUFLLGtCQUFMLEMsVUFDQSw0QkFBZSxHQUFmLEMsVUFDQSxrQkFBSyxhQUFMLEMsVUFVSSxrQkFBS0gsUUFBTCxDLFVBQ0EscUJBQVEsZUFBUixDLFVBcUJBLGtCQUFLQyxTQUFMLEMsVUFDQSxxQkFBUSxVQUFSLEMsVUF1QkEsbUJBQU0sQ0FBQyxDQUFELEVBQUksQ0FBSixFQUFPLElBQVAsQ0FBTixDLFdBQ0EscUJBQVEsMkNBQVIsQyxXQXFCQSxtQkFBTSxDQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sSUFB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Ii8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgdWlcclxuICovXHJcblxyXG5pbXBvcnQgeyBFdmVudEhhbmRsZXIgYXMgQ29tcG9uZW50RXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vLi4vY29yZS9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0aW9uT3JkZXIsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIHNsaWRlLCByYW5nZSwgdmlzaWJsZSwgb3ZlcnJpZGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBFdmVudFRvdWNoLCBTeXN0ZW1FdmVudFR5cGUgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtJztcclxuaW1wb3J0IHsgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IExheW91dCB9IGZyb20gJy4vbGF5b3V0JztcclxuaW1wb3J0IHsgUGFnZVZpZXdJbmRpY2F0b3IgfSBmcm9tICcuL3BhZ2Utdmlldy1pbmRpY2F0b3InO1xyXG5pbXBvcnQgeyBTY3JvbGxWaWV3IH0gZnJvbSAnLi9zY3JvbGwtdmlldyc7XHJcbmltcG9ydCB7IFNjcm9sbEJhciB9IGZyb20gJy4vc2Nyb2xsLWJhcic7XHJcbmltcG9ydCB7IHdhcm5JRCwgbG9nSUQgfSBmcm9tICcuLi8uLi9jb3JlL3BsYXRmb3JtL2RlYnVnJztcclxuaW1wb3J0IHsgZXh0ZW5kc0VudW0gfSBmcm9tICcuLi8uLi9jb3JlL2RhdGEvdXRpbHMvZXh0ZW5kcy1lbnVtJztcclxuaW1wb3J0IHsgRXZlbnRUeXBlIGFzIFNjcm9sbEV2ZW50VHlwZSB9IGZyb20gJy4vc2Nyb2xsLXZpZXcnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5jb25zdCBfdGVtcF92ZWMyID0gbmV3IFZlYzIoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgUGFnZSBWaWV3IFNpemUgTW9kZS5cclxuICpcclxuICogQHpoIOmhtemdouinhuWbvuavj+S4qumhtemdoue7n+S4gOeahOWkp+Wwj+exu+Wei1xyXG4gKi9cclxuZW51bSBTaXplTW9kZSB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFYWNoIHBhZ2UgaXMgdW5pZmllZCBpbiBzaXplXHJcbiAgICAgKiBAemgg5q+P5Liq6aG16Z2i57uf5LiA5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIFVuaWZpZWQgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRWFjaCBwYWdlIGlzIGluIGZyZWUgc2l6ZVxyXG4gICAgICogQHpoIOavj+S4qumhtemdouWkp+Wwj+maj+aEj1xyXG4gICAgICovXHJcbiAgICBGcmVlID0gMSxcclxufVxyXG5cclxuY2NlbnVtKFNpemVNb2RlKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gRW51bSBmb3IgUGFnZSBWaWV3IERpcmVjdGlvbi5cclxuICpcclxuICogQHpoIOmhtemdouinhuWbvua7muWKqOexu+Wei1xyXG4gKi9cclxuZW51bSBEaXJlY3Rpb24ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSG9yaXpvbnRhbCBzY3JvbGwuXHJcbiAgICAgKiBAemgg5rC05bmz5rua5YqoXHJcbiAgICAgKi9cclxuICAgIEhvcml6b250YWwgPSAwLFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVmVydGljYWwgc2Nyb2xsLlxyXG4gICAgICogQHpoIOWeguebtOa7muWKqFxyXG4gICAgICovXHJcbiAgICBWZXJ0aWNhbCA9IDEsXHJcbn1cclxuXHJcbmNjZW51bShEaXJlY3Rpb24pO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBTY3JvbGxWaWV3IGV2ZW50IHR5cGUuXHJcbiAqXHJcbiAqIEB6aCDmu5rliqjop4blm77kuovku7bnsbvlnotcclxuICovXHJcbmVudW0gRXZlbnRUeXBlIHtcclxuICAgIFBBR0VfVFVSTklORyA9ICdwYWdlLXR1cm5pbmcnLFxyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFRoZSBQYWdlVmlldyBjb250cm9sLlxyXG4gKlxyXG4gKiBAemhcclxuICog6aG16Z2i6KeG5Zu+57uE5Lu2XHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuUGFnZVZpZXcnKVxyXG5AaGVscCgnaTE4bjpjYy5QYWdlVmlldycpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9QYWdlVmlldycpXHJcbi8vIEB0cy1pZ25vcmVcclxuZXhwb3J0IGNsYXNzIFBhZ2VWaWV3IGV4dGVuZHMgU2Nyb2xsVmlldyB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU3BlY2lmeSB0aGUgc2l6ZSB0eXBlIG9mIGVhY2ggcGFnZSBpbiBQYWdlVmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmhtemdouinhuWbvuS4reavj+S4qumhtemdouWkp+Wwj+exu+Wei1xyXG4gICAgICovXHJcbiAgICBAdHlwZShTaXplTW9kZSlcclxuICAgIEB0b29sdGlwKCfpobXpnaLop4blm77kuK3mr4/kuKrpobXpnaLlpKflsI/nsbvlnosnKVxyXG4gICAgZ2V0IHNpemVNb2RlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplTW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2l6ZU1vZGUodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fc2l6ZU1vZGUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NpemVNb2RlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5fc3luY1NpemVNb2RlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBwYWdlIHZpZXcgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6aG16Z2i6KeG5Zu+5rua5Yqo57G75Z6LXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKERpcmVjdGlvbilcclxuICAgIEB0b29sdGlwKCfpobXpnaLop4blm77mu5rliqjnsbvlnosnKVxyXG4gICAgZ2V0IGRpcmVjdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGlyZWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBkaXJlY3Rpb24odmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uID09PSB2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9kaXJlY3Rpb24gPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9zeW5jU2Nyb2xsRGlyZWN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBzY3JvbGwgdGhyZXNob2xkIHZhbHVlLCB3aGVuIGRyYWcgZXhjZWVkcyB0aGlzIHZhbHVlLFxyXG4gICAgICogcmVsZWFzZSB0aGUgbmV4dCBwYWdlIHdpbGwgYXV0b21hdGljYWxseSBzY3JvbGwsIGxlc3MgdGhhbiB0aGUgcmVzdG9yZS5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa7muWKqOS4tOeVjOWAvO+8jOm7mOiupOWNleS9jeeZvuWIhuavlO+8jOW9k+aLluaLvei2heWHuuivpeaVsOWAvOaXtu+8jOadvuW8gOS8muiHquWKqOa7muWKqOS4i+S4gOmhte+8jOWwj+S6juaXtuWImei/mOWOn+OAglxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMCwgMSwgMC4wMV0pXHJcbiAgICBAdG9vbHRpcCgn5rua5Yqo5Li055WM5YC877yM6buY6K6k5Y2V5L2N55m+5YiG5q+U77yM5b2T5ouW5ou96LaF5Ye66K+l5pWw5YC85pe277yM5p2+5byA5Lya6Ieq5Yqo5rua5Yqo5LiL5LiA6aG177yM5bCP5LqO5pe25YiZ6L+Y5Y6fJylcclxuICAgIGdldCBzY3JvbGxUaHJlc2hvbGQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Njcm9sbFRocmVzaG9sZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2Nyb2xsVGhyZXNob2xkKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Njcm9sbFRocmVzaG9sZCA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2Nyb2xsVGhyZXNob2xkID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENoYW5nZSB0aGUgUGFnZVR1cm5pbmcgZXZlbnQgdGltaW5nIG9mIFBhZ2VWaWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572uIFBhZ2VWaWV3IFBhZ2VUdXJuaW5nIOS6i+S7tueahOWPkemAgeaXtuacuuOAglxyXG4gICAgICovXHJcbiAgICBAc2xpZGVcclxuICAgIEByYW5nZShbMCwgMSwgMC4wMV0pXHJcbiAgICBAdG9vbHRpcCgn6K6+572uIFBhZ2VWaWV3IFBhZ2VUdXJuaW5nIOS6i+S7tueahOWPkemAgeaXtuacuicpXHJcbiAgICBnZXQgcGFnZVR1cm5pbmdFdmVudFRpbWluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VUdXJuaW5nRXZlbnRUaW1pbmc7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHBhZ2VUdXJuaW5nRXZlbnRUaW1pbmcgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhZ2VUdXJuaW5nRXZlbnRUaW1pbmcgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3BhZ2VUdXJuaW5nRXZlbnRUaW1pbmcgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIFBhZ2UgVmlldyBJbmRpY2F0b3IuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDpobXpnaLop4blm77mjIfnpLrlmajnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgQHR5cGUoUGFnZVZpZXdJbmRpY2F0b3IpXHJcbiAgICBAdG9vbHRpcCgn6aG16Z2i6KeG5Zu+5oyH56S65Zmo57uE5Lu2JylcclxuICAgIGdldCBpbmRpY2F0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZGljYXRvcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaW5kaWNhdG9yKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGljYXRvciA9PT0gdmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5kaWNhdG9yID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLnNldFBhZ2VWaWV3KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgY3VyUGFnZUlkeCgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY3VyUGFnZUlkeDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIFNpemVNb2RlID0gU2l6ZU1vZGU7XHJcbiAgICBwdWJsaWMgc3RhdGljIERpcmVjdGlvbiA9IERpcmVjdGlvbjtcclxuICAgIHB1YmxpYyBzdGF0aWMgRXZlbnRUeXBlID0gZXh0ZW5kc0VudW0oRXZlbnRUeXBlLCBTY3JvbGxFdmVudFR5cGUpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBdXRvIHBhZ2UgdHVybmluZyB2ZWxvY2l0eSB0aHJlc2hvbGQuIFdoZW4gdXNlcnMgc3dpcGUgdGhlIFBhZ2VWaWV3IHF1aWNrbHksXHJcbiAgICAgKiBpdCB3aWxsIGNhbGN1bGF0ZSBhIHZlbG9jaXR5IGJhc2VkIG9uIHRoZSBzY3JvbGwgZGlzdGFuY2UgYW5kIHRpbWUsXHJcbiAgICAgKiBpZiB0aGUgY2FsY3VsYXRlZCB2ZWxvY2l0eSBpcyBsYXJnZXIgdGhhbiB0aGUgdGhyZXNob2xkLCB0aGVuIGl0IHdpbGwgdHJpZ2dlciBwYWdlIHR1cm5pbmcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlv6vpgJ/mu5Hliqjnv7vpobXkuLTnlYzlgLzjgIJcclxuICAgICAqIOW9k+eUqOaIt+W/q+mAn+a7keWKqOaXtu+8jOS8muagueaNrua7keWKqOW8gOWni+WSjOe7k+adn+eahOi3neemu+S4juaXtumXtOiuoeeul+WHuuS4gOS4qumAn+W6puWAvO+8jFxyXG4gICAgICog6K+l5YC85LiO5q2k5Li055WM5YC855u45q+U6L6D77yM5aaC5p6c5aSn5LqO5Li055WM5YC877yM5YiZ6L+b6KGM6Ieq5Yqo57+76aG144CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB0b29sdGlwKCflv6vpgJ/mu5Hliqjnv7vpobXkuLTnlYzlgLxcXG7lvZPnlKjmiLflv6vpgJ/mu5Hliqjml7bvvIzkvJrmoLnmja7mu5HliqjlvIDlp4vlkoznu5PmnZ/nmoTot53nprvkuI7ml7bpl7TorqHnrpflh7rkuIDkuKrpgJ/luqblgLxcXG7or6XlgLzkuI7mraTkuLTnlYzlgLznm7jmr5TovoPvvIzlpoLmnpzlpKfkuo7kuLTnlYzlgLzvvIzliJnov5vooYzoh6rliqjnv7vpobUnKVxyXG4gICAgcHVibGljIGF1dG9QYWdlVHVybmluZ1RocmVzaG9sZCA9IDEwMDtcclxuXHJcbiAgICBAdHlwZShTY3JvbGxCYXIpXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEB2aXNpYmxlKGZhbHNlKVxyXG4gICAgZ2V0IHZlcnRpY2FsU2Nyb2xsQmFyICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIudmVydGljYWxTY3JvbGxCYXI7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHZlcnRpY2FsU2Nyb2xsQmFyICh2YWx1ZSkge1xyXG4gICAgICAgIHN1cGVyLnZlcnRpY2FsU2Nyb2xsQmFyID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgQHR5cGUoU2Nyb2xsQmFyKVxyXG4gICAgQG92ZXJyaWRlXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIGdldCBob3Jpem9udGFsU2Nyb2xsQmFyICgpIHtcclxuICAgICAgICByZXR1cm4gc3VwZXIuaG9yaXpvbnRhbFNjcm9sbEJhcjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgaG9yaXpvbnRhbFNjcm9sbEJhciAodmFsdWUpIHtcclxuICAgICAgICBzdXBlci5ob3Jpem9udGFsU2Nyb2xsQmFyID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgQG92ZXJyaWRlXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIHB1YmxpYyBob3Jpem9udGFsID0gdHJ1ZTtcclxuXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB2aXNpYmxlKGZhbHNlKVxyXG4gICAgcHVibGljIHZlcnRpY2FsID0gdHJ1ZTtcclxuXHJcbiAgICBAb3ZlcnJpZGVcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB2aXNpYmxlKGZhbHNlKVxyXG4gICAgcHVibGljIGNhbmNlbElubmVyRXZlbnRzID0gdHJ1ZTtcclxuXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBwdWJsaWMgc2Nyb2xsRXZlbnRzOiBDb21wb25lbnRFdmVudEhhbmRsZXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0aW1lIHJlcXVpcmVkIHRvIHR1cm4gb3ZlciBhIHBhZ2UuIHVuaXQ6IHNlY29uZFxyXG4gICAgICogQHpoIOavj+S4qumhtemdoue/u+mhteaXtuaJgOmcgOaXtumXtOOAguWNleS9je+8muenklxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBwYWdlVHVybmluZ1NwZWVkID0gMC4zO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFBhZ2VWaWV3IGV2ZW50cyBjYWxsYmFja1xyXG4gICAgICogQHpoIOa7muWKqOinhuWbvueahOS6i+S7tuWbnuiwg+WHveaVsFxyXG4gICAgICovXHJcbiAgICBAdHlwZShbQ29tcG9uZW50RXZlbnRIYW5kbGVyXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB0b29sdGlwKCfmu5rliqjop4blm77nmoTkuovku7blm57osIPlh73mlbAnKVxyXG4gICAgcHVibGljIHBhZ2VFdmVudHM6IENvbXBvbmVudEV2ZW50SGFuZGxlcltdID0gW107XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zaXplTW9kZSA9IFNpemVNb2RlLlVuaWZpZWQ7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2RpcmVjdGlvbiA9IERpcmVjdGlvbi5Ib3Jpem9udGFsO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zY3JvbGxUaHJlc2hvbGQgPSAwLjU7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3BhZ2VUdXJuaW5nRXZlbnRUaW1pbmcgPSAwLjE7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2luZGljYXRvcjogUGFnZVZpZXdJbmRpY2F0b3IgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2N1clBhZ2VJZHggPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9sYXN0UGFnZUlkeCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX3BhZ2VzOiBOb2RlW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfaW5pdENvbnRlbnRQb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgcHJvdGVjdGVkIF9zY3JvbGxDZW50ZXJPZmZzZXRYOiBudW1iZXJbXSA9IFtdOyAvLyDmr4/kuIDkuKrpobXpnaLlsYXkuK3ml7bpnIDopoHnmoTlgY/np7vph4/vvIhY77yJXHJcbiAgICBwcm90ZWN0ZWQgX3Njcm9sbENlbnRlck9mZnNldFk6IG51bWJlcltdID0gW107IC8vIOavj+S4gOS4qumhtemdouWxheS4reaXtumcgOimgeeahOWBj+enu+mHj++8iFnvvIlcclxuICAgIHByb3RlY3RlZCBfdG91Y2hCZWdhblBvc2l0aW9uID0gbmV3IFZlYzMoKTtcclxuICAgIHByb3RlY3RlZCBfdG91Y2hFbmRQb3NpdGlvbiA9IG5ldyBWZWMzKCk7XHJcblxyXG4gICAgcHVibGljIF9fcHJlbG9hZCgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub24oU3lzdGVtRXZlbnRUeXBlLlNJWkVfQ0hBTkdFRCwgdGhpcy5fdXBkYXRlQWxsUGFnZXNTaXplLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25FbmFibGUoKSB7XHJcbiAgICAgICAgc3VwZXIub25FbmFibGUoKTtcclxuICAgICAgICBpZiAoIUVESVRPUiB8fCBsZWdhY3lDQy5HQU1FX1ZJRVcpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLm9uKFBhZ2VWaWV3LkV2ZW50VHlwZS5TQ1JPTExfRU5HX1dJVEhfVEhSRVNIT0xELCB0aGlzLl9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlKCkge1xyXG4gICAgICAgIHN1cGVyLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIGlmICghRURJVE9SIHx8IGxlZ2FjeUNDLkdBTUVfVklFVykge1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUub2ZmKFBhZ2VWaWV3LkV2ZW50VHlwZS5TQ1JPTExfRU5HX1dJVEhfVEhSRVNIT0xELCB0aGlzLl9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkKCkge1xyXG4gICAgICAgIHRoaXMuX2luaXRQYWdlcygpO1xyXG4gICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5zZXRQYWdlVmlldyh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLm5vZGUub2ZmKFN5c3RlbUV2ZW50VHlwZS5TSVpFX0NIQU5HRUQsIHRoaXMuX3VwZGF0ZUFsbFBhZ2VzU2l6ZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgY3VycmVudCBwYWdlIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue5b2T5YmN6aG16Z2i57Si5byV44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMg5b2T5YmN6aG16Z2i57Si5byV44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRDdXJyZW50UGFnZUluZGV4KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJQYWdlSWR4O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXQgY3VycmVudCBwYWdlIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5b2T5YmN6aG16Z2i57Si5byV44CCXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg57Si5byV44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRDdXJyZW50UGFnZUluZGV4KGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbFRvUGFnZShpbmRleCwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgYWxsIHBhZ2VzIG9mIHBhZ2V2aWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog6L+U5Zue6KeG5Zu+5Lit55qE5omA5pyJ6aG16Z2i44CCXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybnMg6L6TPeinhuWbvuaJgOaciemhtemdouOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UGFnZXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhZ2VzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBdCB0aGUgZW5kIG9mIHRoZSBjdXJyZW50IHBhZ2UgdmlldyB0byBpbnNlcnQgYSBuZXcgdmlldy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWcqOW9k+WJjemhtemdouinhuWbvueahOWwvumDqOaPkuWFpeS4gOS4quaWsOinhuWbvuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwYWdlIOaWsOinhuWbvuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkUGFnZShwYWdlOiBOb2RlKSB7XHJcbiAgICAgICAgaWYgKCFwYWdlIHx8IHRoaXMuX3BhZ2VzLmluZGV4T2YocGFnZSkgIT09IC0xIHx8ICF0aGlzLmNvbnRlbnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXBhZ2UuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wKSB7XHJcbiAgICAgICAgICAgIGxvZ0lEKDQzMDEpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5hZGRDaGlsZChwYWdlKTtcclxuICAgICAgICB0aGlzLl9wYWdlcy5wdXNoKHBhZ2UpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluc2VydHMgYSBwYWdlIGluIHRoZSBzcGVjaWZpZWQgbG9jYXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbpobXpnaLmj5LlhaXmjIflrprkvY3nva7kuK3jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcGFnZSDmlrDop4blm77jgIJcclxuICAgICAqIEBwYXJhbSBpbmRleCDmjIflrprkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluc2VydFBhZ2UocGFnZTogTm9kZSwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpbmRleCA8IDAgfHwgIXBhZ2UgfHwgdGhpcy5fcGFnZXMuaW5kZXhPZihwYWdlKSAhPT0gLTEgfHwgIXRoaXMuY29udGVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBhZ2VDb3VudCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcclxuICAgICAgICBpZiAoaW5kZXggPj0gcGFnZUNvdW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICghcGFnZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICAgICAgICAgIGxvZ0lEKDQzMDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX3BhZ2VzLnNwbGljZShpbmRleCwgMCwgcGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5pbnNlcnRDaGlsZChwYWdlLCBpbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW1vdmVzIGEgcGFnZSBmcm9tIFBhZ2VWaWV3LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog56e76Zmk5oyH5a6a6aG16Z2i44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHBhZ2Ug5oyH5a6a6aG16Z2i44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVQYWdlKHBhZ2U6IE5vZGUpIHtcclxuICAgICAgICBpZiAoIXBhZ2UgfHwgIXRoaXMuY29udGVudCkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3BhZ2VzLmluZGV4T2YocGFnZSk7XHJcbiAgICAgICAgaWYgKGluZGV4ID09PSAtMSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNDMwMCwgcGFnZS5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnJlbW92ZVBhZ2VBdEluZGV4KGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVtb3ZlcyBhIHBhZ2UgYXQgaW5kZXggb2YgUGFnZVZpZXcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnp7vpmaTmjIflrprkuIvmoIfnmoTpobXpnaLjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gaW5kZXgg6aG16Z2i5LiL5qCH44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVQYWdlQXRJbmRleChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcGFnZUxpc3QgPSB0aGlzLl9wYWdlcztcclxuICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHBhZ2VMaXN0Lmxlbmd0aCkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBwYWdlID0gcGFnZUxpc3RbaW5kZXhdO1xyXG4gICAgICAgIGlmICghcGFnZSB8fCAhdGhpcy5jb250ZW50KSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVDaGlsZChwYWdlKTtcclxuICAgICAgICBwYWdlTGlzdC5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlbW92ZXMgYWxsIHBhZ2VzIGZyb20gUGFnZVZpZXcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnp7vpmaTmiYDmnInpobXpnaLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUFsbFBhZ2VzKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZW50KSB7IHJldHVybjsgfVxyXG4gICAgICAgIGNvbnN0IGxvY1BhZ2VzID0gdGhpcy5fcGFnZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGxvY1BhZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGVudC5yZW1vdmVDaGlsZChsb2NQYWdlc1tpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BhZ2VzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUGFnZVZpZXcoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2Nyb2xsIFBhZ2VWaWV3IHRvIGluZGV4LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5rua5Yqo5Yiw5oyH5a6a6aG16Z2iXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGlkeCBpbmRleCBvZiBwYWdlLlxyXG4gICAgICogQHBhcmFtIHRpbWVJblNlY29uZCBzY3JvbGxpbmcgdGltZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNjcm9sbFRvUGFnZShpZHg6IG51bWJlciwgdGltZUluU2Vjb25kID0gMC4zKSB7XHJcbiAgICAgICAgaWYgKGlkeCA8IDAgfHwgaWR4ID49IHRoaXMuX3BhZ2VzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jdXJQYWdlSWR4ID0gaWR4O1xyXG4gICAgICAgIHRoaXMuc2Nyb2xsVG9PZmZzZXQodGhpcy5fbW92ZU9mZnNldFZhbHVlKGlkeCksIHRpbWVJblNlY29uZCwgdHJ1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuaW5kaWNhdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kaWNhdG9yLl9jaGFuZ2VkU3RhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gb3ZlcnJpZGUgdGhlIG1ldGhvZCBvZiBTY3JvbGxWaWV3XHJcbiAgICBwdWJsaWMgZ2V0U2Nyb2xsRW5kZWRFdmVudFRpbWluZygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wYWdlVHVybmluZ0V2ZW50VGltaW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOWIt+aWsOmhtemdouinhuWbvlxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVQYWdlVmlldygpIHtcclxuICAgICAgICAvLyDlvZPpobXpnaLmlbDnu4Tlj5jljJbml7bkv67mlLkgY29udGVudCDlpKflsI9cclxuICAgICAgICBpZiAoIXRoaXMuY29udGVudCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMuY29udGVudC5nZXRDb21wb25lbnQoTGF5b3V0KTtcclxuICAgICAgICBpZiAobGF5b3V0ICYmIGxheW91dC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgIGxheW91dC51cGRhdGVMYXlvdXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhZ2VDb3VudCA9IHRoaXMuX3BhZ2VzLmxlbmd0aDtcclxuICAgICAgICBpZiAodGhpcy5fY3VyUGFnZUlkeCA+PSBwYWdlQ291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IHBhZ2VDb3VudCA9PT0gMCA/IDAgOiBwYWdlQ291bnQgLSAxO1xyXG4gICAgICAgICAgICB0aGlzLl9sYXN0UGFnZUlkeCA9IHRoaXMuX2N1clBhZ2VJZHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIOi/m+ihjOaOkuW6j1xyXG4gICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLl9pbml0Q29udGVudFBvcztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhZ2VDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhZ2UgPSB0aGlzLl9wYWdlc1tpXTtcclxuICAgICAgICAgICAgLy8gcGFnZS5zZXRTaWJsaW5nSW5kZXgoaSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvcyA9IHBhZ2UucG9zaXRpb247XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFhbaV0gPSBNYXRoLmFicyhjb250ZW50UG9zLnggKyBwb3MueCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRZW2ldID0gTWF0aC5hYnMoY29udGVudFBvcy55ICsgcG9zLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDliLfmlrAgaW5kaWNhdG9yIOS/oeaBr+S4jueKtuaAgVxyXG4gICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLmluZGljYXRvci5fcmVmcmVzaCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyDliLfmlrDmiYDmnInpobXpnaLnmoTlpKflsI9cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlQWxsUGFnZXNTaXplKCkge1xyXG4gICAgICAgIGxldCB2aWV3VHJhbnMgPSB0aGlzLnZpZXc7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQgfHwgIXZpZXdUcmFucykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2l6ZU1vZGUgIT09IFNpemVNb2RlLlVuaWZpZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsb2NQYWdlcyA9IChFRElUT1IgJiYgIWxlZ2FjeUNDLkdBTUVfVklFVykgPyB0aGlzLmNvbnRlbnQuY2hpbGRyZW4gOiB0aGlzLl9wYWdlcztcclxuICAgICAgICBjb25zdCBzZWxmU2l6ZSA9IHZpZXdUcmFucy5jb250ZW50U2l6ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gbG9jUGFnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgbG9jUGFnZXNbaV0uX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZShzZWxmU2l6ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaGFuZGxlUmVsZWFzZUxvZ2ljKCkge1xyXG4gICAgICAgIHRoaXMuX2F1dG9TY3JvbGxUb1BhZ2UoKTtcclxuICAgICAgICBpZiAodGhpcy5fc2Nyb2xsaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Njcm9sbGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2F1dG9TY3JvbGxpbmcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoRXZlbnQoUGFnZVZpZXcuRXZlbnRUeXBlLlNDUk9MTF9FTkRFRCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRvdWNoQmVnYW4oZXZlbnQ6IEV2ZW50VG91Y2gsIGNhcHR1cmVMaXN0ZW5lcnM6IGFueSkge1xyXG4gICAgICAgIGV2ZW50LnRvdWNoIS5nZXRVSUxvY2F0aW9uKF90ZW1wX3ZlYzIpO1xyXG4gICAgICAgIFZlYzMuc2V0KHRoaXMuX3RvdWNoQmVnYW5Qb3NpdGlvbiwgX3RlbXBfdmVjMi54LCBfdGVtcF92ZWMyLnksIDApO1xyXG4gICAgICAgIHN1cGVyLl9vblRvdWNoQmVnYW4oZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaE1vdmVkKGV2ZW50OiBFdmVudFRvdWNoLCBjYXB0dXJlTGlzdGVuZXJzOiBhbnkpIHtcclxuICAgICAgICBzdXBlci5fb25Ub3VjaE1vdmVkKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVG91Y2hFbmRlZChldmVudDogRXZlbnRUb3VjaCwgY2FwdHVyZUxpc3RlbmVyczogYW55KSB7XHJcbiAgICAgICAgZXZlbnQudG91Y2ghLmdldFVJTG9jYXRpb24oX3RlbXBfdmVjMik7XHJcbiAgICAgICAgVmVjMy5zZXQodGhpcy5fdG91Y2hFbmRQb3NpdGlvbiwgX3RlbXBfdmVjMi54LCBfdGVtcF92ZWMyLnksIDApO1xyXG4gICAgICAgIHN1cGVyLl9vblRvdWNoRW5kZWQoZXZlbnQsIGNhcHR1cmVMaXN0ZW5lcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25Ub3VjaENhbmNlbGxlZChldmVudDogRXZlbnRUb3VjaCwgY2FwdHVyZUxpc3RlbmVyczogYW55KSB7XHJcbiAgICAgICAgZXZlbnQudG91Y2ghLmdldFVJTG9jYXRpb24oX3RlbXBfdmVjMik7XHJcbiAgICAgICAgVmVjMy5zZXQodGhpcy5fdG91Y2hFbmRQb3NpdGlvbiwgX3RlbXBfdmVjMi54LCBfdGVtcF92ZWMyLnksIDApO1xyXG4gICAgICAgIHN1cGVyLl9vblRvdWNoQ2FuY2VsbGVkKGV2ZW50LCBjYXB0dXJlTGlzdGVuZXJzKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uTW91c2VXaGVlbCgpIHsgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfc3luY1Njcm9sbERpcmVjdGlvbigpIHtcclxuICAgICAgICB0aGlzLmhvcml6b250YWwgPSB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWw7XHJcbiAgICAgICAgdGhpcy52ZXJ0aWNhbCA9IHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVmVydGljYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9zeW5jU2l6ZU1vZGUoKSB7XHJcbiAgICAgICAgY29uc3Qgdmlld1RyYW5zID0gdGhpcy52aWV3O1xyXG4gICAgICAgIGlmICghdGhpcy5jb250ZW50IHx8ICF2aWV3VHJhbnMpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgbGF5b3V0ID0gdGhpcy5jb250ZW50LmdldENvbXBvbmVudChMYXlvdXQpO1xyXG4gICAgICAgIGlmIChsYXlvdXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NpemVNb2RlID09PSBTaXplTW9kZS5GcmVlICYmIHRoaXMuX3BhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0UGFnZVRyYW5zID0gdGhpcy5fcGFnZXNbMF0uX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wITtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGxhc3RQYWdlVHJhbnMgPSB0aGlzLl9wYWdlc1t0aGlzLl9wYWdlcy5sZW5ndGggLSAxXS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXAhO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nTGVmdCA9ICh2aWV3VHJhbnMud2lkdGggLSBmaXJzdFBhZ2VUcmFucy53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nUmlnaHQgPSAodmlld1RyYW5zLndpZHRoIC0gbGFzdFBhZ2VUcmFucy53aWR0aCkgLyAyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGxheW91dC5wYWRkaW5nVG9wID0gKHZpZXdUcmFucy5oZWlnaHQgLSBmaXJzdFBhZ2VUcmFucy5oZWlnaHQpIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICBsYXlvdXQucGFkZGluZ0JvdHRvbSA9ICh2aWV3VHJhbnMuaGVpZ2h0IC0gbGFzdFBhZ2VUcmFucy5oZWlnaHQpIC8gMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsYXlvdXQudXBkYXRlTGF5b3V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWIneWni+WMlumhtemdolxyXG4gICAgcHJvdGVjdGVkIF9pbml0UGFnZXMoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRlbnQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5faW5pdENvbnRlbnRQb3MgPSB0aGlzLmNvbnRlbnQucG9zaXRpb247XHJcbiAgICAgICAgY29uc3QgY2hpbGRyZW4gPSB0aGlzLmNvbnRlbnQuY2hpbGRyZW47XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBwYWdlID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9wYWdlcy5pbmRleE9mKHBhZ2UpID49IDApIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgdGhpcy5fcGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3luY1Njcm9sbERpcmVjdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX3N5bmNTaXplTW9kZSgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVBhZ2VWaWV3KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9kaXNwYXRjaFBhZ2VUdXJuaW5nRXZlbnQoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xhc3RQYWdlSWR4ID09PSB0aGlzLl9jdXJQYWdlSWR4KSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX2xhc3RQYWdlSWR4ID0gdGhpcy5fY3VyUGFnZUlkeDtcclxuICAgICAgICBDb21wb25lbnRFdmVudEhhbmRsZXIuZW1pdEV2ZW50cyh0aGlzLnBhZ2VFdmVudHMsIHRoaXMsIEV2ZW50VHlwZS5QQUdFX1RVUk5JTkcpO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KEV2ZW50VHlwZS5QQUdFX1RVUk5JTkcsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOW/q+mAn+a7keWKqFxyXG4gICAgcHJvdGVjdGVkIF9pc1F1aWNrbHlTY3JvbGxhYmxlKHRvdWNoTW92ZVZlbG9jaXR5OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSG9yaXpvbnRhbCkge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModG91Y2hNb3ZlVmVsb2NpdHkueCkgPiB0aGlzLmF1dG9QYWdlVHVybmluZ1RocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xyXG4gICAgICAgICAgICBpZiAoTWF0aC5hYnModG91Y2hNb3ZlVmVsb2NpdHkueSkgPiB0aGlzLmF1dG9QYWdlVHVybmluZ1RocmVzaG9sZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOmAmui/hyBpZHgg6I635Y+W5YGP56e75YC85pWw5YC8XHJcbiAgICBwcm90ZWN0ZWQgX21vdmVPZmZzZXRWYWx1ZShpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IG9mZnNldCA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NpemVNb2RlID09PSBTaXplTW9kZS5GcmVlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldC54ID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WFtpZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uVmVydGljYWwpIHtcclxuICAgICAgICAgICAgICAgIG9mZnNldC55ID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WVtpZHhdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgdmlld1RyYW5zID0gdGhpcy52aWV3O1xyXG4gICAgICAgICAgICBpZiAoIXZpZXdUcmFucykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG9mZnNldDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQueCA9IGlkeCAqIHZpZXdUcmFucy53aWR0aDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLlZlcnRpY2FsKSB7XHJcbiAgICAgICAgICAgICAgICBvZmZzZXQueSA9IGlkeCAqIHZpZXdUcmFucy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9mZnNldDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldERyYWdEaXJlY3Rpb24obW92ZU9mZnNldDogVmVjMykge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5Ib3Jpem9udGFsKSB7XHJcbiAgICAgICAgICAgIGlmIChtb3ZlT2Zmc2V0LnggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKG1vdmVPZmZzZXQueCA+IDAgPyAxIDogLTEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8g55Sx5LqO5rua5YqoIFkg6L2055qE5Y6f54K55Zyo5Zyo5Y+z5LiK6KeS5omA5Lul5bqU6K+l5piv5bCP5LqOIDBcclxuICAgICAgICAgICAgaWYgKG1vdmVPZmZzZXQueSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAobW92ZU9mZnNldC55IDwgMCA/IDEgOiAtMSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOaYr+WQpui2hei/h+iHquWKqOa7muWKqOS4tOeVjOWAvFxyXG4gICAgcHJvdGVjdGVkIF9pc1Njcm9sbGFibGUob2Zmc2V0OiBWZWMzLCBpbmRleDogbnVtYmVyLCBuZXh0SW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaXplTW9kZSA9PT0gU2l6ZU1vZGUuRnJlZSkge1xyXG4gICAgICAgICAgICBsZXQgY3VyUGFnZUNlbnRlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCBuZXh0UGFnZUNlbnRlciA9IDA7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIGN1clBhZ2VDZW50ZXIgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRYW2luZGV4XTtcclxuICAgICAgICAgICAgICAgIG5leHRQYWdlQ2VudGVyID0gdGhpcy5fc2Nyb2xsQ2VudGVyT2Zmc2V0WFtuZXh0SW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC54KSA+PSBNYXRoLmFicyhjdXJQYWdlQ2VudGVyIC0gbmV4dFBhZ2VDZW50ZXIpICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xyXG4gICAgICAgICAgICAgICAgY3VyUGFnZUNlbnRlciA9IHRoaXMuX3Njcm9sbENlbnRlck9mZnNldFlbaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgbmV4dFBhZ2VDZW50ZXIgPSB0aGlzLl9zY3JvbGxDZW50ZXJPZmZzZXRZW25leHRJbmRleF07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5hYnMob2Zmc2V0LnkpID49IE1hdGguYWJzKGN1clBhZ2VDZW50ZXIgLSBuZXh0UGFnZUNlbnRlcikgKiB0aGlzLnNjcm9sbFRocmVzaG9sZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgdmlld1RyYW5zID0gdGhpcy52aWV3O1xyXG4gICAgICAgICAgICBpZiAoIXZpZXdUcmFucykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLkhvcml6b250YWwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmFicyhvZmZzZXQueCkgPj0gdmlld1RyYW5zLndpZHRoICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WZXJ0aWNhbCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguYWJzKG9mZnNldC55KSA+PSB2aWV3VHJhbnMuaGVpZ2h0ICogdGhpcy5zY3JvbGxUaHJlc2hvbGQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hdXRvU2Nyb2xsVG9QYWdlKCkge1xyXG4gICAgICAgIGNvbnN0IGJvdW5jZUJhY2tTdGFydGVkID0gdGhpcy5fc3RhcnRCb3VuY2VCYWNrSWZOZWVkZWQoKTtcclxuICAgICAgICBpZiAoYm91bmNlQmFja1N0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgbGV0IGJvdW5jZUJhY2tBbW91bnQgPSB0aGlzLl9nZXRIb3dNdWNoT3V0T2ZCb3VuZGFyeSgpO1xyXG4gICAgICAgICAgICBib3VuY2VCYWNrQW1vdW50ID0gdGhpcy5fY2xhbXBEZWx0YShib3VuY2VCYWNrQW1vdW50KTtcclxuICAgICAgICAgICAgaWYgKGJvdW5jZUJhY2tBbW91bnQueCA+IDAgfHwgYm91bmNlQmFja0Ftb3VudC55IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY3VyUGFnZUlkeCA9IHRoaXMuX3BhZ2VzLmxlbmd0aCA9PT0gMCA/IDAgOiB0aGlzLl9wYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChib3VuY2VCYWNrQW1vdW50LnggPCAwIHx8IGJvdW5jZUJhY2tBbW91bnQueSA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2N1clBhZ2VJZHggPSAwXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmluZGljYXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRpY2F0b3IuX2NoYW5nZWRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlT2Zmc2V0ID0gbmV3IFZlYzMoKTtcclxuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdChtb3ZlT2Zmc2V0LCB0aGlzLl90b3VjaEJlZ2FuUG9zaXRpb24sIHRoaXMuX3RvdWNoRW5kUG9zaXRpb24pO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2N1clBhZ2VJZHg7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRJbmRleCA9IGluZGV4ICsgdGhpcy5fZ2V0RHJhZ0RpcmVjdGlvbihtb3ZlT2Zmc2V0KTtcclxuICAgICAgICAgICAgY29uc3QgdGltZUluU2Vjb25kID0gdGhpcy5wYWdlVHVybmluZ1NwZWVkICogTWF0aC5hYnMoaW5kZXggLSBuZXh0SW5kZXgpO1xyXG4gICAgICAgICAgICBpZiAobmV4dEluZGV4IDwgdGhpcy5fcGFnZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNTY3JvbGxhYmxlKG1vdmVPZmZzZXQsIGluZGV4LCBuZXh0SW5kZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UobmV4dEluZGV4LCB0aW1lSW5TZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRvdWNoTW92ZVZlbG9jaXR5ID0gdGhpcy5fY2FsY3VsYXRlVG91Y2hNb3ZlVmVsb2NpdHkoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5faXNRdWlja2x5U2Nyb2xsYWJsZSh0b3VjaE1vdmVWZWxvY2l0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxUb1BhZ2UobmV4dEluZGV4LCB0aW1lSW5TZWNvbmQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsVG9QYWdlKGluZGV4LCB0aW1lSW5TZWNvbmQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogTm90ZTogVGhpcyBldmVudCBpcyBlbWl0dGVkIGZyb20gdGhlIG5vZGUgdG8gd2hpY2ggdGhlIGNvbXBvbmVudCBiZWxvbmdzLlxyXG4gKiBAemhcclxuICog5rOo5oSP77ya5q2k5LqL5Lu25piv5LuO6K+l57uE5Lu25omA5bGe55qEIE5vZGUg5LiK6Z2i5rS+5Y+R5Ye65p2l55qE77yM6ZyA6KaB55SoIG5vZGUub24g5p2l55uR5ZCs44CCXHJcbiAqIEBldmVudCBwYWdlLXR1cm5pbmdcclxuICogQHBhcmFtIHtFdmVudC5FdmVudEN1c3RvbX0gZXZlbnRcclxuICogQHBhcmFtIHtQYWdlVmlld30gcGFnZVZpZXcgLSBUaGUgUGFnZVZpZXcgY29tcG9uZW50LlxyXG4gKi9cclxuIl19