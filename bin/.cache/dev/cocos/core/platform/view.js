(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/class.js", "../event/event-target.js", "../game.js", "../math/index.js", "./visible-rect.js", "../default-constants.js", "../global-exports.js", "./debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/class.js"), require("../event/event-target.js"), require("../game.js"), require("../math/index.js"), require("./visible-rect.js"), require("../default-constants.js"), require("../global-exports.js"), require("./debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global._class, global.eventTarget, global.game, global.index, global.visibleRect, global.defaultConstants, global.globalExports, global.debug);
    global.view = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _class, _eventTarget, _game, _index, _visibleRect, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.view = _exports.ResolutionPolicy = _exports.View = void 0;
  _visibleRect = _interopRequireDefault(_visibleRect);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BrowserGetter = /*#__PURE__*/function () {
    function BrowserGetter() {
      _classCallCheck(this, BrowserGetter);

      this.html = void 0;
      this.meta = {
        width: 'device-width'
      };
      this.adaptationType = _globalExports.legacyCC.sys.browserType;
    }

    _createClass(BrowserGetter, [{
      key: "init",
      value: function init() {
        if (!_defaultConstants.MINIGAME) {
          this.html = document.getElementsByTagName('html')[0];
        }
      }
    }, {
      key: "availWidth",
      value: function availWidth(frame) {
        if (_globalExports.legacyCC.sys.isMobile || !frame || frame === this.html) {
          return window.innerWidth;
        } else {
          return frame.clientWidth;
        }
      }
    }, {
      key: "availHeight",
      value: function availHeight(frame) {
        if (_globalExports.legacyCC.sys.isMobile || !frame || frame === this.html) {
          return window.innerHeight;
        } else {
          return frame.clientHeight;
        }
      }
    }]);

    return BrowserGetter;
  }();

  var __BrowserGetter = new BrowserGetter();

  if (_globalExports.legacyCC.sys.os === _globalExports.legacyCC.sys.OS_IOS) {
    // All browsers are WebView
    __BrowserGetter.adaptationType = _globalExports.legacyCC.sys.BROWSER_TYPE_SAFARI;
  }

  switch (__BrowserGetter.adaptationType) {
    case _globalExports.legacyCC.sys.BROWSER_TYPE_SAFARI:
      __BrowserGetter.meta['minimal-ui'] = 'true';

    case _globalExports.legacyCC.sys.BROWSER_TYPE_SOUGOU:
    case _globalExports.legacyCC.sys.BROWSER_TYPE_UC:
      __BrowserGetter.availWidth = function (frame) {
        return frame.clientWidth;
      };

      __BrowserGetter.availHeight = function (frame) {
        return frame.clientHeight;
      };

      break;
  }
  /**
   * @en View represents the game window.<br/>
   * It's main task include: <br/>
   *  - Apply the design resolution policy to the UI Canvas<br/>
   *  - Provide interaction with the window, like resize event on web, retina display support, etc...<br/>
   *  - Manage the scale and translation of canvas related to the frame on Web<br/>
   * <br/>
   * With {{view}} as its singleton initialized by the engine, you don't need to call any constructor or create functions,<br/>
   * the standard way to use it is by calling:<br/>
   *  - view.methodName(); <br/>
   * @zh View 代表游戏窗口视图，它的核心功能包括：
   *  - 对所有 UI Canvas 进行设计分辨率适配。
   *  - 提供窗口视图的交互，比如监听 resize 事件，控制 retina 屏幕适配，等等。
   *  - 控制 Canvas 节点相对于外层 DOM 节点的缩放和偏移。
   * 引擎会自动初始化它的单例对象 {{view}}，所以你不需要实例化任何 View，只需要直接使用 `view.methodName();`
   */


  var View = /*#__PURE__*/function (_EventTarget) {
    _inherits(View, _EventTarget);

    function View() {
      var _this;

      _classCallCheck(this, View);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(View).call(this));
      _this._resizeWithBrowserSize = void 0;
      _this._designResolutionSize = void 0;
      _this._originalDesignResolutionSize = void 0;
      _this._frameSize = void 0;
      _this._scaleX = void 0;
      _this._scaleY = void 0;
      _this._viewportRect = void 0;
      _this._visibleRect = void 0;
      _this._autoFullScreen = void 0;
      _this._devicePixelRatio = void 0;
      _this._maxPixelRatio = void 0;
      _this._retinaEnabled = void 0;
      _this._resizeCallback = void 0;
      _this._resizing = void 0;
      _this._orientationChanging = void 0;
      _this._isRotated = void 0;
      _this._orientation = void 0;
      _this._isAdjustViewport = void 0;
      _this._antiAliasEnabled = void 0;
      _this._resolutionPolicy = void 0;
      _this._rpExactFit = void 0;
      _this._rpShowAll = void 0;
      _this._rpNoBorder = void 0;
      _this._rpFixedHeight = void 0;
      _this._rpFixedWidth = void 0;

      var _t = _assertThisInitialized(_this);

      var _strategyer = ContainerStrategy;
      var _strategy = ContentStrategy; // Size of parent node that contains cc.game.container and cc.game.canvas

      _this._frameSize = new _index.Size(0, 0); // resolution size, it is the size appropriate for the app resources.

      _this._designResolutionSize = new _index.Size(0, 0);
      _this._originalDesignResolutionSize = new _index.Size(0, 0);
      _this._scaleX = 1;
      _this._scaleY = 1; // Viewport is the container's rect related to content's coordinates in pixel

      _this._viewportRect = new _index.Rect(0, 0, 0, 0); // The visible rect in content's coordinate in point

      _this._visibleRect = new _index.Rect(0, 0, 0, 0); // Auto full screen disabled by default

      _this._autoFullScreen = false; // The device's pixel ratio (for retina displays)

      _this._devicePixelRatio = 1;

      if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
        _this._maxPixelRatio = 4;
      } else {
        _this._maxPixelRatio = 2;
      } // Retina disabled by default


      _this._retinaEnabled = false; // Custom callback for resize event

      _this._resizeCallback = null;
      _this._resizing = false;
      _this._resizeWithBrowserSize = false;
      _this._orientationChanging = true;
      _this._isRotated = false;
      _this._orientation = _globalExports.legacyCC.macro.ORIENTATION_AUTO;
      _this._isAdjustViewport = true;
      _this._antiAliasEnabled = false; // Setup system default resolution policies

      _this._rpExactFit = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.EXACT_FIT);
      _this._rpShowAll = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.SHOW_ALL);
      _this._rpNoBorder = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.NO_BORDER);
      _this._rpFixedHeight = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_HEIGHT);
      _this._rpFixedWidth = new ResolutionPolicy(_strategyer.EQUAL_TO_FRAME, _strategy.FIXED_WIDTH);
      _this._resolutionPolicy = _this._rpShowAll;

      _globalExports.legacyCC.game.once(_globalExports.legacyCC.Game.EVENT_ENGINE_INITED, _this.init, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(View, [{
      key: "init",
      value: function init() {
        __BrowserGetter.init();

        this._initFrameSize();

        this.enableAntiAlias(true);
        var w = _globalExports.legacyCC.game.canvas.width;
        var h = _globalExports.legacyCC.game.canvas.height;
        this._designResolutionSize.width = w;
        this._designResolutionSize.height = h;
        this._originalDesignResolutionSize.width = w;
        this._originalDesignResolutionSize.height = h;
        this._viewportRect.width = w;
        this._viewportRect.height = h;
        this._visibleRect.width = w;
        this._visibleRect.height = h;
        _globalExports.legacyCC.winSize.width = this._visibleRect.width;
        _globalExports.legacyCC.winSize.height = this._visibleRect.height;

        if (_globalExports.legacyCC.visibleRect) {
          _globalExports.legacyCC.visibleRect.init(this._visibleRect);
        }
      }
      /**
       * @en
       * Sets whether resize canvas automatically when browser's size changed.<br/>
       * Useful only on web.
       * @zh 设置当发现浏览器的尺寸改变时，是否自动调整 canvas 尺寸大小。
       * 仅在 Web 模式下有效。
       * @param enabled - Whether enable automatic resize with browser's resize event
       */

    }, {
      key: "resizeWithBrowserSize",
      value: function resizeWithBrowserSize(enabled) {
        if (enabled) {
          // enable
          if (!this._resizeWithBrowserSize) {
            this._resizeWithBrowserSize = true;
            window.addEventListener('resize', this._resizeEvent);
            window.addEventListener('orientationchange', this._orientationChange);
          }
        } else {
          // disable
          if (this._resizeWithBrowserSize) {
            this._resizeWithBrowserSize = false;
            window.removeEventListener('resize', this._resizeEvent);
            window.removeEventListener('orientationchange', this._orientationChange);
          }
        }
      }
      /**
       * @en
       * Sets the callback function for `view`'s resize action,<br/>
       * this callback will be invoked before applying resolution policy, <br/>
       * so you can do any additional modifications within the callback.<br/>
       * Useful only on web.
       * @zh 设置 `view` 调整视窗尺寸行为的回调函数，
       * 这个回调函数会在应用适配模式之前被调用，
       * 因此你可以在这个回调函数内添加任意附加改变，
       * 仅在 Web 平台下有效。
       * @param callback - The callback function
       */

    }, {
      key: "setResizeCallback",
      value: function setResizeCallback(callback) {
        if (typeof callback === 'function' || callback == null) {
          this._resizeCallback = callback;
        }
      }
      /**
       * @en
       * Sets the orientation of the game, it can be landscape, portrait or auto.
       * When set it to landscape or portrait, and screen w/h ratio doesn't fit,
       * `view` will automatically rotate the game canvas using CSS.
       * Note that this function doesn't have any effect in native,
       * in native, you need to set the application orientation in native project settings
       * @zh 设置游戏屏幕朝向，它能够是横版，竖版或自动。
       * 当设置为横版或竖版，并且屏幕的宽高比例不匹配时，
       * `view` 会自动用 CSS 旋转游戏场景的 canvas，
       * 这个方法不会对 native 部分产生任何影响，对于 native 而言，你需要在应用设置中的设置排版。
       * @param orientation - Possible values: macro.ORIENTATION_LANDSCAPE | macro.ORIENTATION_PORTRAIT | macro.ORIENTATION_AUTO
       */

    }, {
      key: "setOrientation",
      value: function setOrientation(orientation) {
        orientation = orientation & _globalExports.legacyCC.macro.ORIENTATION_AUTO;

        if (orientation && this._orientation !== orientation) {
          this._orientation = orientation;
        }
      }
      /**
       * @en
       * Sets whether the engine modify the "viewport" meta in your web page.<br/>
       * It's enabled by default, we strongly suggest you not to disable it.<br/>
       * And even when it's enabled, you can still set your own "viewport" meta, it won't be overridden<br/>
       * Only useful on web
       * @zh 设置引擎是否调整 viewport meta 来配合屏幕适配。
       * 默认设置为启动，我们强烈建议你不要将它设置为关闭。
       * 即使当它启动时，你仍然能够设置你的 viewport meta，它不会被覆盖。
       * 仅在 Web 模式下有效
       * @param enabled - Enable automatic modification to "viewport" meta
       */

    }, {
      key: "adjustViewportMeta",
      value: function adjustViewportMeta(enabled) {
        this._isAdjustViewport = enabled;
      }
      /**
       * @en
       * Retina support is enabled by default for Apple device but disabled for other devices,<br/>
       * it takes effect only when you called setDesignResolutionPolicy<br/>
       * Only useful on web
       * @zh 对于 Apple 这种支持 Retina 显示的设备上默认进行优化而其他类型设备默认不进行优化，
       * 它仅会在你调用 setDesignResolutionPolicy 方法时有影响。
       * 仅在 Web 模式下有效。
       * @param enabled - Enable or disable retina display
       */

    }, {
      key: "enableRetina",
      value: function enableRetina(enabled) {
        this._retinaEnabled = !!enabled;
      }
      /**
       * @en
       * Check whether retina display is enabled.<br/>
       * Only useful on web
       * @zh 检查是否对 Retina 显示设备进行优化。
       * 仅在 Web 模式下有效。
       */

    }, {
      key: "isRetinaEnabled",
      value: function isRetinaEnabled() {
        return this._retinaEnabled;
      }
      /**
       * @en Whether to Enable on anti-alias
       * @zh 控制抗锯齿是否开启
       * @param enabled - Enable or not anti-alias
       */

    }, {
      key: "enableAntiAlias",
      value: function enableAntiAlias(enabled) {
        if (this._antiAliasEnabled === enabled) {
          return;
        }

        this._antiAliasEnabled = enabled;

        if (_globalExports.legacyCC.game.renderType === _globalExports.legacyCC.Game.RENDER_TYPE_WEBGL) {
          var cache = _globalExports.legacyCC.loader._cache; // tslint:disable-next-line: forin

          for (var key in cache) {
            var item = cache[key];
            var tex = item && item.content instanceof _globalExports.legacyCC.Texture2D ? item.content : null;

            if (tex) {
              var Filter = _globalExports.legacyCC.Texture2D.Filter;

              if (enabled) {
                tex.setFilters(Filter.LINEAR, Filter.LINEAR);
              } else {
                tex.setFilters(Filter.NEAREST, Filter.NEAREST);
              }
            }
          }
        } else if (_globalExports.legacyCC.game.renderType === _globalExports.legacyCC.Game.RENDER_TYPE_CANVAS) {
          var ctx = _globalExports.legacyCC.game.canvas.getContext('2d');

          ctx.imageSmoothingEnabled = enabled;
          ctx.mozImageSmoothingEnabled = enabled;
        }
      }
      /**
       * @en Returns whether the current enable on anti-alias
       * @zh 返回当前是否抗锯齿
       */

    }, {
      key: "isAntiAliasEnabled",
      value: function isAntiAliasEnabled() {
        return this._antiAliasEnabled;
      }
      /**
       * @en
       * If enabled, the application will try automatically to enter full screen mode on mobile devices<br/>
       * You can pass true as parameter to enable it and disable it by passing false.<br/>
       * Only useful on web
       * @zh 启动时，移动端游戏会在移动端自动尝试进入全屏模式。
       * 你能够传入 true 为参数去启动它，用 false 参数来关闭它。
       * @param enabled - Enable or disable auto full screen on mobile devices
       */

    }, {
      key: "enableAutoFullScreen",
      value: function enableAutoFullScreen(enabled) {
        if (enabled && enabled !== this._autoFullScreen && _globalExports.legacyCC.sys.isMobile && _globalExports.legacyCC.sys.browserType !== _globalExports.legacyCC.sys.BROWSER_TYPE_WECHAT) {
          // Automatically full screen when user touches on mobile version
          this._autoFullScreen = true;

          _globalExports.legacyCC.screen.autoFullScreen(_globalExports.legacyCC.game.frame);
        } else {
          this._autoFullScreen = false;
        }
      }
      /**
       * @en
       * Check whether auto full screen is enabled.<br/>
       * Only useful on web
       * @zh 检查自动进入全屏模式是否启动。
       * 仅在 Web 模式下有效。
       * @return Auto full screen enabled or not
       */

    }, {
      key: "isAutoFullScreenEnabled",
      value: function isAutoFullScreenEnabled() {
        return this._autoFullScreen;
      }
      /*
       * Not support on native.<br/>
       * On web, it sets the size of the canvas.
       * @zh 这个方法并不支持 native 平台，在 Web 平台下，可以用来设置 canvas 尺寸。
       * @private
       * @param {Number} width
       * @param {Number} height
       */

    }, {
      key: "setCanvasSize",
      value: function setCanvasSize(width, height) {
        var canvas = _globalExports.legacyCC.game.canvas;
        var container = _globalExports.legacyCC.game.container;
        this._devicePixelRatio = window.devicePixelRatio;
        canvas.width = width * this._devicePixelRatio;
        canvas.height = height * this._devicePixelRatio; // canvas.width = width;
        // canvas.height = height;

        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        container.style.width = width + 'px';
        container.style.height = height + 'px';

        this._resizeEvent();
      }
      /**
       * @en
       * Returns the canvas size of the view.<br/>
       * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
       * On web, it returns the size of the canvas element.
       * @zh 返回视图中 canvas 的尺寸。
       * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
       * 在 Web 平台下，它返回 canvas 元素尺寸。
       */

    }, {
      key: "getCanvasSize",
      value: function getCanvasSize() {
        return new _index.Size(_globalExports.legacyCC.game.canvas.width, _globalExports.legacyCC.game.canvas.height);
      }
      /**
       * @en
       * Returns the frame size of the view.<br/>
       * On native platforms, it returns the screen size since the view is a fullscreen view.<br/>
       * On web, it returns the size of the canvas's outer DOM element.
       * @zh 返回视图中边框尺寸。
       * 在 native 平台下，它返回全屏视图下屏幕的尺寸。
       * 在 web 平台下，它返回 canvas 元素的外层 DOM 元素尺寸。
       */

    }, {
      key: "getFrameSize",
      value: function getFrameSize() {
        return new _index.Size(this._frameSize.width, this._frameSize.height);
      }
      /**
       * @en On native, it sets the frame size of view.<br/>
       * On web, it sets the size of the canvas's outer DOM element.
       * @zh 在 native 平台下，设置视图框架尺寸。
       * 在 web 平台下，设置 canvas 外层 DOM 元素尺寸。
       * @param {Number} width
       * @param {Number} height
       */

    }, {
      key: "setFrameSize",
      value: function setFrameSize(width, height) {
        this._frameSize.width = width;
        this._frameSize.height = height;
        _globalExports.legacyCC.frame.style.width = width + 'px';
        _globalExports.legacyCC.frame.style.height = height + 'px';

        this._resizeEvent();
      }
      /**
       * @en Returns the visible area size of the view port.
       * @zh 返回视图窗口可见区域尺寸。
       */

    }, {
      key: "getVisibleSize",
      value: function getVisibleSize() {
        return new _index.Size(this._visibleRect.width, this._visibleRect.height);
      }
      /**
       * @en Returns the visible area size of the view port.
       * @zh 返回视图窗口可见区域像素尺寸。
       */

    }, {
      key: "getVisibleSizeInPixel",
      value: function getVisibleSizeInPixel() {
        return new _index.Size(this._visibleRect.width * this._scaleX, this._visibleRect.height * this._scaleY);
      }
      /**
       * @en Returns the visible origin of the view port.
       * @zh 返回视图窗口可见区域原点。
       */

    }, {
      key: "getVisibleOrigin",
      value: function getVisibleOrigin() {
        return new _index.Vec2(this._visibleRect.x, this._visibleRect.y);
      }
      /**
       * @en Returns the visible origin of the view port.
       * @zh 返回视图窗口可见区域像素原点。
       */

    }, {
      key: "getVisibleOriginInPixel",
      value: function getVisibleOriginInPixel() {
        return new _index.Vec2(this._visibleRect.x * this._scaleX, this._visibleRect.y * this._scaleY);
      }
      /**
       * @en Returns the current resolution policy
       * @zh 返回当前分辨率方案
       * @see {{ResolutionPolicy}}
       */

    }, {
      key: "getResolutionPolicy",
      value: function getResolutionPolicy() {
        return this._resolutionPolicy;
      }
      /**
       * @en Sets the current resolution policy
       * @zh 设置当前分辨率模式
       * @see {{ResolutionPolicy}}
       */

    }, {
      key: "setResolutionPolicy",
      value: function setResolutionPolicy(resolutionPolicy) {
        var _t = this;

        if (resolutionPolicy instanceof ResolutionPolicy) {
          _t._resolutionPolicy = resolutionPolicy;
        } // Ensure compatibility with JSB
        else {
            var _locPolicy = ResolutionPolicy;

            if (resolutionPolicy === _locPolicy.EXACT_FIT) {
              _t._resolutionPolicy = _t._rpExactFit;
            }

            if (resolutionPolicy === _locPolicy.SHOW_ALL) {
              _t._resolutionPolicy = _t._rpShowAll;
            }

            if (resolutionPolicy === _locPolicy.NO_BORDER) {
              _t._resolutionPolicy = _t._rpNoBorder;
            }

            if (resolutionPolicy === _locPolicy.FIXED_HEIGHT) {
              _t._resolutionPolicy = _t._rpFixedHeight;
            }

            if (resolutionPolicy === _locPolicy.FIXED_WIDTH) {
              _t._resolutionPolicy = _t._rpFixedWidth;
            }
          }
      } // tslint:disable: max-line-length

      /**
       * @en Sets the resolution policy with designed view size in points.<br/>
       * The resolution policy include: <br/>
       * [1] ResolutionExactFit       Fill screen by stretch-to-fit: if the design resolution ratio of width to height is different from the screen resolution ratio, your game view will be stretched.<br/>
       * [2] ResolutionNoBorder       Full screen without black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two areas of your game view will be cut.<br/>
       * [3] ResolutionShowAll        Full screen with black border: if the design resolution ratio of width to height is different from the screen resolution ratio, two black borders will be shown.<br/>
       * [4] ResolutionFixedHeight    Scale the content's height to screen's height and proportionally scale its width<br/>
       * [5] ResolutionFixedWidth     Scale the content's width to screen's width and proportionally scale its height<br/>
       * [ResolutionPolicy]        [Web only feature] Custom resolution policy, constructed by ResolutionPolicy<br/>
       * @zh 通过设置设计分辨率和匹配模式来进行游戏画面的屏幕适配。
       * @param width Design resolution width.
       * @param height Design resolution height.
       * @param resolutionPolicy The resolution policy desired
       */

    }, {
      key: "setDesignResolutionSize",
      value: function setDesignResolutionSize(width, height, resolutionPolicy) {
        // Defensive code
        if (!(width > 0 || height > 0)) {
          (0, _debug.errorID)(2200);
          return;
        }

        this.setResolutionPolicy(resolutionPolicy);
        var policy = this._resolutionPolicy;

        if (policy) {
          policy.preApply(this);
        } // Reinit frame size


        if (_globalExports.legacyCC.sys.isMobile) {
          this._adjustViewportMeta();
        } // Permit to re-detect the orientation of device.


        this._orientationChanging = true; // If resizing, then frame size is already initialized, this logic should be improved

        if (!this._resizing) {
          this._initFrameSize();
        }

        if (!policy) {
          (0, _debug.logID)(2201);
          return;
        }

        this._originalDesignResolutionSize.width = this._designResolutionSize.width = width;
        this._originalDesignResolutionSize.height = this._designResolutionSize.height = height;
        var result = policy.apply(this, this._designResolutionSize);

        if (result.scale && result.scale.length === 2) {
          this._scaleX = result.scale[0];
          this._scaleY = result.scale[1];
        }

        if (result.viewport) {
          var vp = this._viewportRect;
          var vb = this._visibleRect;
          var rv = result.viewport;
          vp.x = rv.x;
          vp.y = rv.y;
          vp.width = rv.width;
          vp.height = rv.height;
          vb.x = 0;
          vb.y = 0;
          vb.width = rv.width / this._scaleX;
          vb.height = rv.height / this._scaleY;
        }

        policy.postApply(this);
        _globalExports.legacyCC.winSize.width = this._visibleRect.width;
        _globalExports.legacyCC.winSize.height = this._visibleRect.height;

        if (_visibleRect.default) {
          _visibleRect.default.init(this._visibleRect);
        }

        this.emit('design-resolution-changed');
      }
      /**
       * @en Returns the designed size for the view.
       * Default resolution size is the same as 'getFrameSize'.
       * @zh 返回视图的设计分辨率。
       * 默认下分辨率尺寸同 `getFrameSize` 方法相同
       */

    }, {
      key: "getDesignResolutionSize",
      value: function getDesignResolutionSize() {
        return new _index.Size(this._designResolutionSize.width, this._designResolutionSize.height);
      }
      /**
       * @en Sets the container to desired pixel resolution and fit the game content to it.
       * This function is very useful for adaptation in mobile browsers.
       * In some HD android devices, the resolution is very high, but its browser performance may not be very good.
       * In this case, enabling retina display is very costy and not suggested, and if retina is disabled, the image may be blurry.
       * But this API can be helpful to set a desired pixel resolution which is in between.
       * This API will do the following:
       *     1. Set viewport's width to the desired width in pixel
       *     2. Set body width to the exact pixel resolution
       *     3. The resolution policy will be reset with designed view size in points.
       * @zh 设置容器（container）需要的像素分辨率并且适配相应分辨率的游戏内容。
       * @param width Design resolution width.
       * @param height Design resolution height.
       * @param resolutionPolicy The resolution policy desired
       */

    }, {
      key: "setRealPixelResolution",
      value: function setRealPixelResolution(width, height, resolutionPolicy) {
        if (!_defaultConstants.JSB && !_defaultConstants.RUNTIME_BASED && !_defaultConstants.MINIGAME) {
          // Set viewport's width
          this._setViewportMeta({
            width: width
          }, true); // Set body width to the exact pixel resolution


          document.documentElement.style.width = width + 'px';
          document.body.style.width = width + 'px';
          document.body.style.left = '0px';
          document.body.style.top = '0px';
        } // Reset the resolution size and policy


        this.setDesignResolutionSize(width, height, resolutionPolicy);
      }
      /**
       * @en Returns the view port rectangle.
       * @zh 返回视窗剪裁区域。
       */

    }, {
      key: "getViewportRect",
      value: function getViewportRect() {
        return this._viewportRect;
      }
      /**
       * @en Returns scale factor of the horizontal direction (X axis).
       * @zh 返回横轴的缩放比，这个缩放比是将画布像素分辨率放到设计分辨率的比例。
       */

    }, {
      key: "getScaleX",
      value: function getScaleX() {
        return this._scaleX;
      }
      /**
       * @en Returns scale factor of the vertical direction (Y axis).
       * @zh 返回纵轴的缩放比，这个缩放比是将画布像素分辨率缩放到设计分辨率的比例。
       */

    }, {
      key: "getScaleY",
      value: function getScaleY() {
        return this._scaleY;
      }
      /**
       * @en Returns device pixel ratio for retina display.
       * @zh 返回设备或浏览器像素比例。
       */

    }, {
      key: "getDevicePixelRatio",
      value: function getDevicePixelRatio() {
        return this._devicePixelRatio;
      }
      /**
       * @en Returns the real location in view for a translation based on a related position
       * @zh 将屏幕坐标转换为游戏视图下的坐标。
       * @param tx - The X axis translation
       * @param ty - The Y axis translation
       * @param relatedPos - The related position object including "left", "top", "width", "height" informations
       * @param out - The out object to save the conversion result
       */

    }, {
      key: "convertToLocationInView",
      value: function convertToLocationInView(tx, ty, relatedPos, out) {
        var result = out || new _index.Vec2();
        var x = this._devicePixelRatio * (tx - relatedPos.left);
        var y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - ty);

        if (this._isRotated) {
          result.x = _globalExports.legacyCC.game.canvas.width - y;
          result.y = x;
        } else {
          result.x = x;
          result.y = y;
        }

        return result;
      } // _convertMouseToLocationInView (in_out_point, relatedPos) {
      //     var viewport = this._viewportRect, _t = this;
      //     in_out_point.x = ((_t._devicePixelRatio * (in_out_point.x - relatedPos.left)) - viewport.x) / _t._scaleX;
      //     in_out_point.y = (_t._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y) - viewport.y) / _t._scaleY;
      // }

    }, {
      key: "_convertPointWithScale",
      value: function _convertPointWithScale(point) {
        var viewport = this._viewportRect;
        point.x = (point.x - viewport.x) / this._scaleX;
        point.y = (point.y - viewport.y) / this._scaleY;
      } // Resize helper functions

    }, {
      key: "_resizeEvent",
      value: function _resizeEvent() {
        var _view = _globalExports.legacyCC.view; // Check frame size changed or not

        var prevFrameW = _view._frameSize.width;
        var prevFrameH = _view._frameSize.height;
        var prevRotated = _view._isRotated;

        if (_globalExports.legacyCC.sys.isMobile) {
          var containerStyle = _globalExports.legacyCC.game.container.style;
          var margin = containerStyle.margin;
          containerStyle.margin = '0';
          containerStyle.display = 'none';

          _view._initFrameSize();

          containerStyle.margin = margin;
          containerStyle.display = 'block';
        } else {
          _view._initFrameSize();
        }

        if (!_defaultConstants.JSB && !_defaultConstants.RUNTIME_BASED && !_view._orientationChanging && _view._isRotated === prevRotated && _view._frameSize.width === prevFrameW && _view._frameSize.height === prevFrameH) {
          return;
        } // Frame size changed, do resize works


        var width = _view._originalDesignResolutionSize.width;
        var height = _view._originalDesignResolutionSize.height;
        _view._resizing = true;

        if (width > 0) {
          _view.setDesignResolutionSize(width, height, _view._resolutionPolicy);
        }

        _view._resizing = false;

        _view.emit('canvas-resize');

        if (_view._resizeCallback) {
          _view._resizeCallback.call();
        }
      }
    }, {
      key: "_orientationChange",
      value: function _orientationChange() {
        _globalExports.legacyCC.view._orientationChanging = true;

        _globalExports.legacyCC.view._resizeEvent();
      }
    }, {
      key: "_initFrameSize",
      value: function _initFrameSize() {
        var locFrameSize = this._frameSize;

        var w = __BrowserGetter.availWidth(_globalExports.legacyCC.game.frame);

        var h = __BrowserGetter.availHeight(_globalExports.legacyCC.game.frame);

        var isLandscape = w >= h;

        if (_defaultConstants.EDITOR || !_globalExports.legacyCC.sys.isMobile || isLandscape && this._orientation & _globalExports.legacyCC.macro.ORIENTATION_LANDSCAPE || !isLandscape && this._orientation & _globalExports.legacyCC.macro.ORIENTATION_PORTRAIT) {
          locFrameSize.width = w;
          locFrameSize.height = h;
          _globalExports.legacyCC.game.container.style['-webkit-transform'] = 'rotate(0deg)';
          _globalExports.legacyCC.game.container.style.transform = 'rotate(0deg)';
          this._isRotated = false;
        } else {
          locFrameSize.width = h;
          locFrameSize.height = w;
          _globalExports.legacyCC.game.container.style['-webkit-transform'] = 'rotate(90deg)';
          _globalExports.legacyCC.game.container.style.transform = 'rotate(90deg)';
          _globalExports.legacyCC.game.container.style['-webkit-transform-origin'] = '0px 0px 0px';
          _globalExports.legacyCC.game.container.style.transformOrigin = '0px 0px 0px';
          this._isRotated = true; // Fix for issue: https://github.com/cocos-creator/fireball/issues/8365
          // Reference: https://www.douban.com/note/343402554/
          // For Chrome, z-index not working after container transform rotate 90deg.
          // Because 'transform' style adds canvas (the top-element of container) to a new stack context.
          // That causes the DOM Input was hidden under canvas.
          // This should be done after container rotated, instead of in style-mobile.css.

          _globalExports.legacyCC.game.canvas.style['-webkit-transform'] = 'translateZ(0px)';
          _globalExports.legacyCC.game.canvas.style.transform = 'translateZ(0px)';
        }

        if (this._orientationChanging) {
          setTimeout(function () {
            _globalExports.legacyCC.view._orientationChanging = false;
          }, 1000);
        }
      } // hack

    }, {
      key: "_adjustSizeKeepCanvasSize",
      value: function _adjustSizeKeepCanvasSize() {
        var designWidth = this._originalDesignResolutionSize.width;
        var designHeight = this._originalDesignResolutionSize.height;

        if (designWidth > 0) {
          this.setDesignResolutionSize(designWidth, designHeight, this._resolutionPolicy);
        }
      }
    }, {
      key: "_setViewportMeta",
      value: function _setViewportMeta(metas, overwrite) {
        var vp = document.getElementById('cocosMetaElement');

        if (vp && overwrite) {
          document.head.removeChild(vp);
        }

        var elems = document.getElementsByName('viewport');
        var currentVP = elems ? elems[0] : null;
        var content;
        var key;
        var pattern;
        content = currentVP ? currentVP.content : '';
        vp = vp || document.createElement('meta');
        vp.id = 'cocosMetaElement';
        vp.name = 'viewport';
        vp.content = '';

        for (key in metas) {
          if (content.indexOf(key) === -1) {
            content += ',' + key + '=' + metas[key];
          } else if (overwrite) {
            pattern = new RegExp(key + '\s*=\s*[^,]+');
            content.replace(pattern, key + '=' + metas[key]);
          }
        }

        if (/^,/.test(content)) {
          content = content.substr(1);
        }

        vp.content = content; // For adopting certain android devices which don't support second viewport

        if (currentVP) {
          currentVP.content = content;
        }

        document.head.appendChild(vp);
      }
    }, {
      key: "_adjustViewportMeta",
      value: function _adjustViewportMeta() {
        if (this._isAdjustViewport && !_defaultConstants.JSB && !_defaultConstants.RUNTIME_BASED && !_defaultConstants.MINIGAME) {
          this._setViewportMeta(__BrowserGetter.meta, false);

          this._isAdjustViewport = false;
        }
      }
    }, {
      key: "_convertMouseToLocation",
      value: function _convertMouseToLocation(in_out_point, relatedPos) {
        in_out_point.x = this._devicePixelRatio * (in_out_point.x - relatedPos.left);
        in_out_point.y = this._devicePixelRatio * (relatedPos.top + relatedPos.height - in_out_point.y);
      }
    }, {
      key: "_convertTouchWidthScale",
      value: function _convertTouchWidthScale(selTouch) {
        var viewport = this._viewportRect;
        var scaleX = this._scaleX;
        var scaleY = this._scaleY;
        selTouch._point.x = (selTouch._point.x - viewport.x) / scaleX;
        selTouch._point.y = (selTouch._point.y - viewport.y) / scaleY;
        selTouch._prevPoint.x = (selTouch._prevPoint.x - viewport.x) / scaleX;
        selTouch._prevPoint.y = (selTouch._prevPoint.y - viewport.y) / scaleY;
      }
    }, {
      key: "_convertTouchesWithScale",
      value: function _convertTouchesWithScale(touches) {
        var viewport = this._viewportRect;
        var scaleX = this._scaleX;
        var scaleY = this._scaleY;
        var selPoint;
        var selPrePoint; // tslint:disable-next-line: prefer-for-of

        for (var i = 0; i < touches.length; i++) {
          var selTouch = touches[i];
          selPoint = selTouch._point;
          selPrePoint = selTouch._prevPoint;
          selPoint.x = (selPoint.x - viewport.x) / scaleX;
          selPoint.y = (selPoint.y - viewport.y) / scaleY;
          selPrePoint.x = (selPrePoint.x - viewport.x) / scaleX;
          selPrePoint.y = (selPrePoint.y - viewport.y) / scaleY;
        }
      }
    }]);

    return View;
  }(_eventTarget.EventTarget);
  /**
   * !en
   * Emit when design resolution changed.
   * !zh
   * 当设计分辨率改变时发送。
   * @event design-resolution-changed
   */


  _exports.View = View;
  View.instance = void 0;

  /** 
   * ContainerStrategy class is the root strategy class of container's scale strategy,
   * it controls the behavior of how to scale the cc.game.container and cc.game.canvas object
   */
  var ContainerStrategy = /*#__PURE__*/function () {
    function ContainerStrategy() {
      _classCallCheck(this, ContainerStrategy);

      this.name = 'ContainerStrategy';
    }

    _createClass(ContainerStrategy, [{
      key: "preApply",

      /**
       * @en Manipulation before appling the strategy
       * @zh 在应用策略之前的操作
       * @param view - The target view
       */
      value: function preApply(_view) {}
      /**
       * @en Function to apply this strategy
       * @zh 策略应用方法
       * @param view
       * @param designedResolution
       */

    }, {
      key: "apply",
      value: function apply(_view, designedResolution) {}
      /**
       * @en
       * Manipulation after applying the strategy
       * @zh 策略调用之后的操作
       * @param view  The target view
       */

    }, {
      key: "postApply",
      value: function postApply(_view) {}
    }, {
      key: "_setupContainer",
      value: function _setupContainer(_view, w, h) {
        var locCanvas = _globalExports.legacyCC.game.canvas;
        var locContainer = _globalExports.legacyCC.game.container;

        if (_globalExports.legacyCC.sys.os === _globalExports.legacyCC.sys.OS_ANDROID) {
          document.body.style.width = (_view._isRotated ? h : w) + 'px';
          document.body.style.height = (_view._isRotated ? w : h) + 'px';
        } // Setup style


        locContainer.style.width = locCanvas.style.width = w + 'px';
        locContainer.style.height = locCanvas.style.height = h + 'px'; // Setup pixel ratio for retina display

        var devicePixelRatio = _view._devicePixelRatio = 1;

        if (_view.isRetinaEnabled()) {
          devicePixelRatio = _view._devicePixelRatio = Math.min(_view._maxPixelRatio, window.devicePixelRatio || 1);
        } // Setup canvas


        locCanvas.width = w * devicePixelRatio;
        locCanvas.height = h * devicePixelRatio;
      }
    }, {
      key: "_fixContainer",
      value: function _fixContainer() {
        // Add container to document body
        document.body.insertBefore(_globalExports.legacyCC.game.container, document.body.firstChild); // Set body's width height to window's size, and forbid overflow, so that game will be centered

        var bs = document.body.style;
        bs.width = window.innerWidth + 'px';
        bs.height = window.innerHeight + 'px';
        bs.overflow = 'hidden'; // Body size solution doesn't work on all mobile browser so this is the aleternative: fixed container

        var contStyle = _globalExports.legacyCC.game.container.style;
        contStyle.position = 'fixed';
        contStyle.left = contStyle.top = '0px'; // Reposition body

        document.body.scrollTop = 0;
      }
    }]);

    return ContainerStrategy;
  }();
  /**
   * @en
   * Emit when canvas resize.
   * @zh
   * 当画布大小改变时发送。
   * @event canvas-resize
   */

  /**
   * ContentStrategy class is the root strategy class of content's scale strategy,
   * it controls the behavior of how to scale the scene and setup the viewport for the game
   *
   * @class ContentStrategy
   */


  ContainerStrategy.EQUAL_TO_FRAME = void 0;
  ContainerStrategy.PROPORTION_TO_FRAME = void 0;

  var ContentStrategy = /*#__PURE__*/function () {
    function ContentStrategy() {
      _classCallCheck(this, ContentStrategy);

      this.name = 'ContentStrategy';
      this._result = void 0;
      this._result = {
        scale: [1, 1],
        viewport: null
      };
    }
    /**
     * @en Manipulation before applying the strategy
     * @zh 策略应用前的操作
     * @param view - The target view
     */


    _createClass(ContentStrategy, [{
      key: "preApply",
      value: function preApply(_view) {}
      /**
       * @en Function to apply this strategy
       * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
       * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
       * @zh 调用策略方法
       * @return The result scale and viewport rect
       */

    }, {
      key: "apply",
      value: function apply(_view, designedResolution) {
        return {
          scale: [1, 1]
        };
      }
      /**
       * @en Manipulation after applying the strategy
       * @zh 策略调用之后的操作
       * @param view - The target view
       */

    }, {
      key: "postApply",
      value: function postApply(_view) {}
    }, {
      key: "_buildResult",
      value: function _buildResult(containerW, containerH, contentW, contentH, scaleX, scaleY) {
        // Makes content fit better the canvas
        if (Math.abs(containerW - contentW) < 2) {
          contentW = containerW;
        }

        if (Math.abs(containerH - contentH) < 2) {
          contentH = containerH;
        }

        var viewport = new _index.Rect(Math.round((containerW - contentW) / 2), Math.round((containerH - contentH) / 2), contentW, contentH);
        this._result.scale = [scaleX, scaleY];
        this._result.viewport = viewport;
        return this._result;
      }
    }]);

    return ContentStrategy;
  }();

  ContentStrategy.EXACT_FIT = void 0;
  ContentStrategy.SHOW_ALL = void 0;
  ContentStrategy.NO_BORDER = void 0;
  ContentStrategy.FIXED_HEIGHT = void 0;
  ContentStrategy.FIXED_WIDTH = void 0;

  (function () {
    // Container scale strategys

    /**
     * @class EqualToFrame
     * @extends ContainerStrategy
     */
    var EqualToFrame = /*#__PURE__*/function (_ContainerStrategy) {
      _inherits(EqualToFrame, _ContainerStrategy);

      function EqualToFrame() {
        var _getPrototypeOf2;

        var _this2;

        _classCallCheck(this, EqualToFrame);

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this2 = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(EqualToFrame)).call.apply(_getPrototypeOf2, [this].concat(args)));
        _this2.name = 'EqualToFrame';
        return _this2;
      }

      _createClass(EqualToFrame, [{
        key: "apply",
        value: function apply(_view) {
          var frameH = _view._frameSize.height;
          var containerStyle = _globalExports.legacyCC.game.container.style;

          this._setupContainer(_view, _view._frameSize.width, _view._frameSize.height); // Setup container's margin and padding


          if (_view._isRotated) {
            containerStyle.margin = '0 0 0 ' + frameH + 'px';
          } else {
            containerStyle.margin = '0px';
          }

          containerStyle.padding = '0px';
        }
      }]);

      return EqualToFrame;
    }(ContainerStrategy);
    /**
     * @class ProportionalToFrame
     * @extends ContainerStrategy
     */


    var ProportionalToFrame = /*#__PURE__*/function (_ContainerStrategy2) {
      _inherits(ProportionalToFrame, _ContainerStrategy2);

      function ProportionalToFrame() {
        var _getPrototypeOf3;

        var _this3;

        _classCallCheck(this, ProportionalToFrame);

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        _this3 = _possibleConstructorReturn(this, (_getPrototypeOf3 = _getPrototypeOf(ProportionalToFrame)).call.apply(_getPrototypeOf3, [this].concat(args)));
        _this3.name = 'ProportionalToFrame';
        return _this3;
      }

      _createClass(ProportionalToFrame, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var frameW = _view._frameSize.width;
          var frameH = _view._frameSize.height;
          var containerStyle = _globalExports.legacyCC.game.container.style;
          var designW = designedResolution.width;
          var designH = designedResolution.height;
          var scaleX = frameW / designW;
          var scaleY = frameH / designH;
          var containerW;
          var containerH;
          scaleX < scaleY ? (containerW = frameW, containerH = designH * scaleX) : (containerW = designW * scaleY, containerH = frameH); // Adjust container size with integer value

          var offx = Math.round((frameW - containerW) / 2);
          var offy = Math.round((frameH - containerH) / 2);
          containerW = frameW - 2 * offx;
          containerH = frameH - 2 * offy;

          this._setupContainer(_view, containerW, containerH);

          if (!_defaultConstants.EDITOR) {
            // Setup container's margin and padding
            if (_view._isRotated) {
              containerStyle.margin = '0 0 0 ' + frameH + 'px';
            } else {
              containerStyle.margin = '0px';
            }

            containerStyle.paddingLeft = offx + 'px';
            containerStyle.paddingRight = offx + 'px';
            containerStyle.paddingTop = offy + 'px';
            containerStyle.paddingBottom = offy + 'px';
          }
        }
      }]);

      return ProportionalToFrame;
    }(ContainerStrategy); // need to adapt prototype before instantiating
    // @ts-ignore


    var _global = typeof window === 'undefined' ? global : window;

    var globalAdapter = _global.__globalAdapter;

    if (globalAdapter) {
      if (globalAdapter.adaptContainerStrategy) {
        globalAdapter.adaptContainerStrategy(ContainerStrategy.prototype);
      }

      if (globalAdapter.adaptView) {
        globalAdapter.adaptView(View.prototype);
      }
    } // Alias: Strategy that makes the container's size equals to the frame's size


    ContainerStrategy.EQUAL_TO_FRAME = new EqualToFrame(); // Alias: Strategy that scale proportionally the container's size to frame's size

    ContainerStrategy.PROPORTION_TO_FRAME = new ProportionalToFrame(); // Content scale strategys

    var ExactFit = /*#__PURE__*/function (_ContentStrategy) {
      _inherits(ExactFit, _ContentStrategy);

      function ExactFit() {
        var _getPrototypeOf4;

        var _this4;

        _classCallCheck(this, ExactFit);

        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        _this4 = _possibleConstructorReturn(this, (_getPrototypeOf4 = _getPrototypeOf(ExactFit)).call.apply(_getPrototypeOf4, [this].concat(args)));
        _this4.name = 'ExactFit';
        return _this4;
      }

      _createClass(ExactFit, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var containerW = _globalExports.legacyCC.game.canvas.width;
          var containerH = _globalExports.legacyCC.game.canvas.height;
          var scaleX = containerW / designedResolution.width;
          var scaleY = containerH / designedResolution.height;
          return this._buildResult(containerW, containerH, containerW, containerH, scaleX, scaleY);
        }
      }]);

      return ExactFit;
    }(ContentStrategy);

    var ShowAll = /*#__PURE__*/function (_ContentStrategy2) {
      _inherits(ShowAll, _ContentStrategy2);

      function ShowAll() {
        var _getPrototypeOf5;

        var _this5;

        _classCallCheck(this, ShowAll);

        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        _this5 = _possibleConstructorReturn(this, (_getPrototypeOf5 = _getPrototypeOf(ShowAll)).call.apply(_getPrototypeOf5, [this].concat(args)));
        _this5.name = 'ShowAll';
        return _this5;
      }

      _createClass(ShowAll, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var containerW = _globalExports.legacyCC.game.canvas.width;
          var containerH = _globalExports.legacyCC.game.canvas.height;
          var designW = designedResolution.width;
          var designH = designedResolution.height;
          var scaleX = containerW / designW;
          var scaleY = containerH / designH;
          var scale = 0;
          var contentW;
          var contentH;
          scaleX < scaleY ? (scale = scaleX, contentW = containerW, contentH = designH * scale) : (scale = scaleY, contentW = designW * scale, contentH = containerH);
          return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
      }]);

      return ShowAll;
    }(ContentStrategy);

    var NoBorder = /*#__PURE__*/function (_ContentStrategy3) {
      _inherits(NoBorder, _ContentStrategy3);

      function NoBorder() {
        var _getPrototypeOf6;

        var _this6;

        _classCallCheck(this, NoBorder);

        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        _this6 = _possibleConstructorReturn(this, (_getPrototypeOf6 = _getPrototypeOf(NoBorder)).call.apply(_getPrototypeOf6, [this].concat(args)));
        _this6.name = 'NoBorder';
        return _this6;
      }

      _createClass(NoBorder, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var containerW = _globalExports.legacyCC.game.canvas.width;
          var containerH = _globalExports.legacyCC.game.canvas.height;
          var designW = designedResolution.width;
          var designH = designedResolution.height;
          var scaleX = containerW / designW;
          var scaleY = containerH / designH;
          var scale;
          var contentW;
          var contentH;
          scaleX < scaleY ? (scale = scaleY, contentW = designW * scale, contentH = containerH) : (scale = scaleX, contentW = containerW, contentH = designH * scale);
          return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
      }]);

      return NoBorder;
    }(ContentStrategy);

    var FixedHeight = /*#__PURE__*/function (_ContentStrategy4) {
      _inherits(FixedHeight, _ContentStrategy4);

      function FixedHeight() {
        var _getPrototypeOf7;

        var _this7;

        _classCallCheck(this, FixedHeight);

        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }

        _this7 = _possibleConstructorReturn(this, (_getPrototypeOf7 = _getPrototypeOf(FixedHeight)).call.apply(_getPrototypeOf7, [this].concat(args)));
        _this7.name = 'FixedHeight';
        return _this7;
      }

      _createClass(FixedHeight, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var containerW = _globalExports.legacyCC.game.canvas.width;
          var containerH = _globalExports.legacyCC.game.canvas.height;
          var designH = designedResolution.height;
          var scale = containerH / designH;
          var contentW = containerW;
          var contentH = containerH;
          return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
      }]);

      return FixedHeight;
    }(ContentStrategy);

    var FixedWidth = /*#__PURE__*/function (_ContentStrategy5) {
      _inherits(FixedWidth, _ContentStrategy5);

      function FixedWidth() {
        var _getPrototypeOf8;

        var _this8;

        _classCallCheck(this, FixedWidth);

        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }

        _this8 = _possibleConstructorReturn(this, (_getPrototypeOf8 = _getPrototypeOf(FixedWidth)).call.apply(_getPrototypeOf8, [this].concat(args)));
        _this8.name = 'FixedWidth';
        return _this8;
      }

      _createClass(FixedWidth, [{
        key: "apply",
        value: function apply(_view, designedResolution) {
          var containerW = _globalExports.legacyCC.game.canvas.width;
          var containerH = _globalExports.legacyCC.game.canvas.height;
          var designW = designedResolution.width;
          var scale = containerW / designW;
          var contentW = containerW;
          var contentH = containerH;
          return this._buildResult(containerW, containerH, contentW, contentH, scale, scale);
        }
      }]);

      return FixedWidth;
    }(ContentStrategy); // Alias: Strategy to scale the content's size to container's size, non proportional


    ContentStrategy.EXACT_FIT = new ExactFit(); // Alias: Strategy to scale the content's size proportionally to maximum size and keeps the whole content area to be visible

    ContentStrategy.SHOW_ALL = new ShowAll(); // Alias: Strategy to scale the content's size proportionally to fill the whole container area

    ContentStrategy.NO_BORDER = new NoBorder(); // Alias: Strategy to scale the content's height to container's height and proportionally scale its width

    ContentStrategy.FIXED_HEIGHT = new FixedHeight(); // Alias: Strategy to scale the content's width to container's width and proportionally scale its height

    ContentStrategy.FIXED_WIDTH = new FixedWidth();
  })();
  /**
   * ResolutionPolicy class is the root strategy class of scale strategy,
   * its main task is to maintain the compatibility with Cocos2d-x</p>
   */


  var ResolutionPolicy = /*#__PURE__*/function () {
    /**
     * The entire application is visible in the specified area without trying to preserve the original aspect ratio.<br/>
     * Distortion can occur, and the application may appear stretched or compressed.
     */

    /**
     * The entire application fills the specified area, without distortion but possibly with some cropping,<br/>
     * while maintaining the original aspect ratio of the application.
     */

    /**
     * The entire application is visible in the specified area without distortion while maintaining the original<br/>
     * aspect ratio of the application. Borders can appear on two sides of the application.
     */

    /**
     * The application takes the height of the design resolution size and modifies the width of the internal<br/>
     * canvas so that it fits the aspect ratio of the device<br/>
     * no distortion will occur however you must make sure your application works on different<br/>
     * aspect ratios
     */

    /**
     * The application takes the width of the design resolution size and modifies the height of the internal<br/>
     * canvas so that it fits the aspect ratio of the device<br/>
     * no distortion will occur however you must make sure your application works on different<br/>
     * aspect ratios
     */

    /**
     * Unknown policy
     */

    /**
     * Constructor of ResolutionPolicy
     * @param containerStg
     * @param contentStg
     */
    function ResolutionPolicy(containerStg, contentStg) {
      _classCallCheck(this, ResolutionPolicy);

      this.name = 'ResolutionPolicy';
      this._containerStrategy = void 0;
      this._contentStrategy = void 0;
      this._containerStrategy = null;
      this._contentStrategy = null;
      this.setContainerStrategy(containerStg);
      this.setContentStrategy(contentStg);
    }

    _createClass(ResolutionPolicy, [{
      key: "preApply",

      /**
       * @en Manipulation before applying the resolution policy
       * @zh 策略应用前的操作
       * @param _view The target view
       */
      value: function preApply(_view) {
        this._containerStrategy.preApply(_view);

        this._contentStrategy.preApply(_view);
      }
      /**
       * @en Function to apply this resolution policy
       * The return value is {scale: [scaleX, scaleY], viewport: {new Rect}},
       * The target view can then apply these value to itself, it's preferred not to modify directly its private variables
       * @zh 调用策略方法
       * @param _view - The target view
       * @param designedResolution - The user defined design resolution
       * @return An object contains the scale X/Y values and the viewport rect
       */

    }, {
      key: "apply",
      value: function apply(_view, designedResolution) {
        this._containerStrategy.apply(_view, designedResolution);

        return this._contentStrategy.apply(_view, designedResolution);
      }
      /**
       * @en Manipulation after appyling the strategy
       * @zh 策略应用之后的操作
       * @param _view - The target view
       */

    }, {
      key: "postApply",
      value: function postApply(_view) {
        this._containerStrategy.postApply(_view);

        this._contentStrategy.postApply(_view);
      }
      /**
       * @en Setup the container's scale strategy
       * @zh 设置容器的适配策略
       * @param containerStg The container strategy
       */

    }, {
      key: "setContainerStrategy",
      value: function setContainerStrategy(containerStg) {
        if (containerStg instanceof ContainerStrategy) {
          this._containerStrategy = containerStg;
        }
      }
      /**
       * @en Setup the content's scale strategy
       * @zh 设置内容的适配策略
       * @param contentStg The content strategy
       */

    }, {
      key: "setContentStrategy",
      value: function setContentStrategy(contentStg) {
        if (contentStg instanceof ContentStrategy) {
          this._contentStrategy = contentStg;
        }
      }
    }, {
      key: "canvasSize",
      get: function get() {
        return _globalExports.legacyCC.v2(_globalExports.legacyCC.game.canvas.width, _globalExports.legacyCC.game.canvas.height);
      }
    }]);

    return ResolutionPolicy;
  }();

  _exports.ResolutionPolicy = ResolutionPolicy;
  ResolutionPolicy.EXACT_FIT = 0;
  ResolutionPolicy.NO_BORDER = 1;
  ResolutionPolicy.SHOW_ALL = 2;
  ResolutionPolicy.FIXED_HEIGHT = 3;
  ResolutionPolicy.FIXED_WIDTH = 4;
  ResolutionPolicy.UNKNOWN = 5;
  ResolutionPolicy.ContainerStrategy = ContainerStrategy;
  ResolutionPolicy.ContentStrategy = ContentStrategy;
  _globalExports.legacyCC.ResolutionPolicy = ResolutionPolicy;
  /**
   * @en view is the singleton view object.
   * @zh view 是全局的视图单例对象。
   */

  var view = View.instance = _globalExports.legacyCC.view = new View();
  /**
   * @en winSize is the alias object for the size of the current game window.
   * @zh winSize 为当前的游戏窗口的大小。
   */

  _exports.view = view;
  _globalExports.legacyCC.winSize = new _index.Size();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGxhdGZvcm0vdmlldy50cyJdLCJuYW1lcyI6WyJCcm93c2VyR2V0dGVyIiwiaHRtbCIsIm1ldGEiLCJ3aWR0aCIsImFkYXB0YXRpb25UeXBlIiwibGVnYWN5Q0MiLCJzeXMiLCJicm93c2VyVHlwZSIsIk1JTklHQU1FIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImZyYW1lIiwiaXNNb2JpbGUiLCJ3aW5kb3ciLCJpbm5lcldpZHRoIiwiY2xpZW50V2lkdGgiLCJpbm5lckhlaWdodCIsImNsaWVudEhlaWdodCIsIl9fQnJvd3NlckdldHRlciIsIm9zIiwiT1NfSU9TIiwiQlJPV1NFUl9UWVBFX1NBRkFSSSIsIkJST1dTRVJfVFlQRV9TT1VHT1UiLCJCUk9XU0VSX1RZUEVfVUMiLCJhdmFpbFdpZHRoIiwiYXZhaWxIZWlnaHQiLCJWaWV3IiwiX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSIsIl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSIsIl9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplIiwiX2ZyYW1lU2l6ZSIsIl9zY2FsZVgiLCJfc2NhbGVZIiwiX3ZpZXdwb3J0UmVjdCIsIl92aXNpYmxlUmVjdCIsIl9hdXRvRnVsbFNjcmVlbiIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiX21heFBpeGVsUmF0aW8iLCJfcmV0aW5hRW5hYmxlZCIsIl9yZXNpemVDYWxsYmFjayIsIl9yZXNpemluZyIsIl9vcmllbnRhdGlvbkNoYW5naW5nIiwiX2lzUm90YXRlZCIsIl9vcmllbnRhdGlvbiIsIl9pc0FkanVzdFZpZXdwb3J0IiwiX2FudGlBbGlhc0VuYWJsZWQiLCJfcmVzb2x1dGlvblBvbGljeSIsIl9ycEV4YWN0Rml0IiwiX3JwU2hvd0FsbCIsIl9ycE5vQm9yZGVyIiwiX3JwRml4ZWRIZWlnaHQiLCJfcnBGaXhlZFdpZHRoIiwiX3QiLCJfc3RyYXRlZ3llciIsIkNvbnRhaW5lclN0cmF0ZWd5IiwiX3N0cmF0ZWd5IiwiQ29udGVudFN0cmF0ZWd5IiwiU2l6ZSIsIlJlY3QiLCJKU0IiLCJSVU5USU1FX0JBU0VEIiwibWFjcm8iLCJPUklFTlRBVElPTl9BVVRPIiwiUmVzb2x1dGlvblBvbGljeSIsIkVRVUFMX1RPX0ZSQU1FIiwiRVhBQ1RfRklUIiwiU0hPV19BTEwiLCJOT19CT1JERVIiLCJGSVhFRF9IRUlHSFQiLCJGSVhFRF9XSURUSCIsImdhbWUiLCJvbmNlIiwiR2FtZSIsIkVWRU5UX0VOR0lORV9JTklURUQiLCJpbml0IiwiX2luaXRGcmFtZVNpemUiLCJlbmFibGVBbnRpQWxpYXMiLCJ3IiwiY2FudmFzIiwiaCIsImhlaWdodCIsIndpblNpemUiLCJ2aXNpYmxlUmVjdCIsImVuYWJsZWQiLCJhZGRFdmVudExpc3RlbmVyIiwiX3Jlc2l6ZUV2ZW50IiwiX29yaWVudGF0aW9uQ2hhbmdlIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImNhbGxiYWNrIiwib3JpZW50YXRpb24iLCJyZW5kZXJUeXBlIiwiUkVOREVSX1RZUEVfV0VCR0wiLCJjYWNoZSIsImxvYWRlciIsIl9jYWNoZSIsImtleSIsIml0ZW0iLCJ0ZXgiLCJjb250ZW50IiwiVGV4dHVyZTJEIiwiRmlsdGVyIiwic2V0RmlsdGVycyIsIkxJTkVBUiIsIk5FQVJFU1QiLCJSRU5ERVJfVFlQRV9DQU5WQVMiLCJjdHgiLCJnZXRDb250ZXh0IiwiaW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwibW96SW1hZ2VTbW9vdGhpbmdFbmFibGVkIiwiQlJPV1NFUl9UWVBFX1dFQ0hBVCIsInNjcmVlbiIsImF1dG9GdWxsU2NyZWVuIiwiY29udGFpbmVyIiwiZGV2aWNlUGl4ZWxSYXRpbyIsInN0eWxlIiwiVmVjMiIsIngiLCJ5IiwicmVzb2x1dGlvblBvbGljeSIsIl9sb2NQb2xpY3kiLCJzZXRSZXNvbHV0aW9uUG9saWN5IiwicG9saWN5IiwicHJlQXBwbHkiLCJfYWRqdXN0Vmlld3BvcnRNZXRhIiwicmVzdWx0IiwiYXBwbHkiLCJzY2FsZSIsImxlbmd0aCIsInZpZXdwb3J0IiwidnAiLCJ2YiIsInJ2IiwicG9zdEFwcGx5IiwiZW1pdCIsIl9zZXRWaWV3cG9ydE1ldGEiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwibGVmdCIsInRvcCIsInNldERlc2lnblJlc29sdXRpb25TaXplIiwidHgiLCJ0eSIsInJlbGF0ZWRQb3MiLCJvdXQiLCJwb2ludCIsIl92aWV3IiwidmlldyIsInByZXZGcmFtZVciLCJwcmV2RnJhbWVIIiwicHJldlJvdGF0ZWQiLCJjb250YWluZXJTdHlsZSIsIm1hcmdpbiIsImRpc3BsYXkiLCJjYWxsIiwibG9jRnJhbWVTaXplIiwiaXNMYW5kc2NhcGUiLCJFRElUT1IiLCJPUklFTlRBVElPTl9MQU5EU0NBUEUiLCJPUklFTlRBVElPTl9QT1JUUkFJVCIsInRyYW5zZm9ybSIsInRyYW5zZm9ybU9yaWdpbiIsInNldFRpbWVvdXQiLCJkZXNpZ25XaWR0aCIsImRlc2lnbkhlaWdodCIsIm1ldGFzIiwib3ZlcndyaXRlIiwiZ2V0RWxlbWVudEJ5SWQiLCJoZWFkIiwicmVtb3ZlQ2hpbGQiLCJlbGVtcyIsImdldEVsZW1lbnRzQnlOYW1lIiwiY3VycmVudFZQIiwicGF0dGVybiIsImNyZWF0ZUVsZW1lbnQiLCJpZCIsIm5hbWUiLCJpbmRleE9mIiwiUmVnRXhwIiwicmVwbGFjZSIsInRlc3QiLCJzdWJzdHIiLCJhcHBlbmRDaGlsZCIsImluX291dF9wb2ludCIsInNlbFRvdWNoIiwic2NhbGVYIiwic2NhbGVZIiwiX3BvaW50IiwiX3ByZXZQb2ludCIsInRvdWNoZXMiLCJzZWxQb2ludCIsInNlbFByZVBvaW50IiwiaSIsIkV2ZW50VGFyZ2V0IiwiaW5zdGFuY2UiLCJkZXNpZ25lZFJlc29sdXRpb24iLCJsb2NDYW52YXMiLCJsb2NDb250YWluZXIiLCJPU19BTkRST0lEIiwiaXNSZXRpbmFFbmFibGVkIiwiTWF0aCIsIm1pbiIsImluc2VydEJlZm9yZSIsImZpcnN0Q2hpbGQiLCJicyIsIm92ZXJmbG93IiwiY29udFN0eWxlIiwicG9zaXRpb24iLCJzY3JvbGxUb3AiLCJQUk9QT1JUSU9OX1RPX0ZSQU1FIiwiX3Jlc3VsdCIsImNvbnRhaW5lclciLCJjb250YWluZXJIIiwiY29udGVudFciLCJjb250ZW50SCIsImFicyIsInJvdW5kIiwiRXF1YWxUb0ZyYW1lIiwiZnJhbWVIIiwiX3NldHVwQ29udGFpbmVyIiwicGFkZGluZyIsIlByb3BvcnRpb25hbFRvRnJhbWUiLCJmcmFtZVciLCJkZXNpZ25XIiwiZGVzaWduSCIsIm9mZngiLCJvZmZ5IiwicGFkZGluZ0xlZnQiLCJwYWRkaW5nUmlnaHQiLCJwYWRkaW5nVG9wIiwicGFkZGluZ0JvdHRvbSIsIl9nbG9iYWwiLCJnbG9iYWwiLCJnbG9iYWxBZGFwdGVyIiwiX19nbG9iYWxBZGFwdGVyIiwiYWRhcHRDb250YWluZXJTdHJhdGVneSIsInByb3RvdHlwZSIsImFkYXB0VmlldyIsIkV4YWN0Rml0IiwiX2J1aWxkUmVzdWx0IiwiU2hvd0FsbCIsIk5vQm9yZGVyIiwiRml4ZWRIZWlnaHQiLCJGaXhlZFdpZHRoIiwiY29udGFpbmVyU3RnIiwiY29udGVudFN0ZyIsIl9jb250YWluZXJTdHJhdGVneSIsIl9jb250ZW50U3RyYXRlZ3kiLCJzZXRDb250YWluZXJTdHJhdGVneSIsInNldENvbnRlbnRTdHJhdGVneSIsInYyIiwiVU5LTk9XTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUF3Q01BLGE7Ozs7V0FFS0MsSTtXQUVBQyxJLEdBQU87QUFDVkMsUUFBQUEsS0FBSyxFQUFFO0FBREcsTztXQUlQQyxjLEdBQXNCQyx3QkFBU0MsR0FBVCxDQUFhQyxXOzs7Ozs2QkFFM0I7QUFDWCxZQUFJLENBQUNDLDBCQUFMLEVBQWU7QUFDWCxlQUFLUCxJQUFMLEdBQVlRLFFBQVEsQ0FBQ0Msb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsQ0FBWjtBQUNIO0FBQ0o7OztpQ0FFa0JDLEssRUFBTztBQUN0QixZQUFJTix3QkFBU0Ms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QUErQztBQUMzQyxlQUFLK0wsa0JBQUwsR0FBMEJGLFlBQTFCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozt5Q0FLMkJDLFUsRUFBNkI7QUFDcEQsWUFBSUEsVUFBVSxZQUFZNUwsZUFBMUIsRUFBMkM7QUFDdkMsZUFBSzhMLGdCQUFMLEdBQXdCRixVQUF4QjtBQUNIO0FBQ0o7OzswQkExRGlCO0FBQ2QsZUFBTy9PLHdCQUFTb1AsRUFBVCxDQUFZcFAsd0JBQVNpRSxJQUFULENBQWNRLE1BQWQsQ0FBcUIzRSxLQUFqQyxFQUF3Q0Usd0JBQVNpRSxJQUFULENBQWNRLE1BQWQsQ0FBcUJFLE1BQTdELENBQVA7QUFDSDs7Ozs7OztBQXhEUWpCLEVBQUFBLGdCLENBS0tFLFMsR0FBb0IsQztBQUx6QkYsRUFBQUEsZ0IsQ0FVS0ksUyxHQUFvQixDO0FBVnpCSixFQUFBQSxnQixDQWVLRyxRLEdBQW1CLEM7QUFmeEJILEVBQUFBLGdCLENBc0JLSyxZLEdBQXVCLEM7QUF0QjVCTCxFQUFBQSxnQixDQTZCS00sVyxHQUFzQixDO0FBN0IzQk4sRUFBQUEsZ0IsQ0FpQ0syTCxPLEdBQWtCLEM7QUFqQ3ZCM0wsRUFBQUEsZ0IsQ0FrQ0tULGlCLEdBQThDQSxpQjtBQWxDbkRTLEVBQUFBLGdCLENBbUNLUCxlLEdBQTBDQSxlO0FBK0U1RG5ELDBCQUFTMEQsZ0JBQVQsR0FBNEJBLGdCQUE1QjtBQUVBOzs7OztBQUlPLE1BQU1tRixJQUFJLEdBQUd4SCxJQUFJLENBQUN1SyxRQUFMLEdBQWdCNUwsd0JBQVM2SSxJQUFULEdBQWdCLElBQUl4SCxJQUFKLEVBQTdDO0FBRVA7Ozs7OztBQUlBckIsMEJBQVM0RSxPQUFULEdBQW1CLElBQUl4QixXQUFKLEVBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAwOC0yMDEwIFJpY2FyZG8gUXVlc2FkYVxyXG4gQ29weXJpZ2h0IChjKSAyMDExLTIwMTIgY29jb3MyZC14Lm9yZ1xyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2NvczJkLXgub3JnXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxyXG4gaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xyXG4gdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxyXG4gY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXHJcbiBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxyXG5cclxuIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXHJcbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29yZVxyXG4gKi9cclxuXHJcbmltcG9ydCAnLi4vZGF0YS9jbGFzcyc7XHJcbmltcG9ydCB7IEV2ZW50VGFyZ2V0IH0gZnJvbSAnLi4vZXZlbnQvZXZlbnQtdGFyZ2V0JztcclxuaW1wb3J0ICcuLi9nYW1lJztcclxuaW1wb3J0IHsgUmVjdCwgU2l6ZSwgVmVjMiB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgdmlzaWJsZVJlY3QgZnJvbSAnLi92aXNpYmxlLXJlY3QnO1xyXG5pbXBvcnQgeyBFRElUT1IsIE1JTklHQU1FLCBKU0IsIFJVTlRJTUVfQkFTRUQgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgbG9nSUQsIGVycm9ySUQgfSBmcm9tICcuL2RlYnVnJztcclxuXHJcbmNsYXNzIEJyb3dzZXJHZXR0ZXIge1xyXG5cclxuICAgIHB1YmxpYyBodG1sOiBIVE1MSHRtbEVsZW1lbnQgfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgcHVibGljIG1ldGEgPSB7XHJcbiAgICAgICAgd2lkdGg6ICdkZXZpY2Utd2lkdGgnLFxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgYWRhcHRhdGlvblR5cGU6IGFueSA9IGxlZ2FjeUNDLnN5cy5icm93c2VyVHlwZTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdCAoKSB7XHJcbiAgICAgICAgaWYgKCFNSU5JR0FNRSkge1xyXG4gICAgICAgICAgICB0aGlzLmh0bWwgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaHRtbCcpWzBdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXZhaWxXaWR0aCAoZnJhbWUpIHtcclxuICAgICAgICBpZiAobGVnYWN5Q0Muc3lzLmlzTW9iaWxlIHx8ICFmcmFtZSB8fCBmcmFtZSA9PT0gdGhpcy5odG1sKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmcmFtZS5jbGllbnRXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGF2YWlsSGVpZ2h0IChmcmFtZSkge1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5zeXMuaXNNb2JpbGUgfHwgIWZyYW1lIHx8IGZyYW1lID09PSB0aGlzLmh0bWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmcmFtZS5jbGllbnRIZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBfX0Jyb3dzZXJHZXR0ZXIgPSBuZXcgQnJvd3NlckdldHRlcigpO1xyXG5cclxuaWYgKGxlZ2FjeUNDLnN5cy5vcyA9PT0gbGVnYWN5Q0Muc3lzLk9TX0lPUykgeyAvLyBBbGwgYnJvd3NlcnMgYXJlIFdlYlZpZXdcclxuICAgIF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSA9IGxlZ2FjeUNDLnN5cy5CUk9XU0VSX1RZUEVfU0FGQVJJO1xyXG59XHJcblxyXG5zd2l0Y2ggKF9fQnJvd3NlckdldHRlci5hZGFwdGF0aW9uVHlwZSkge1xyXG4gICAgY2FzZSBsZWdhY3lDQy5zeXMuQlJPV1NFUl9UWVBFX1NBRkFSSTpcclxuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIubWV0YVsnbWluaW1hbC11aSddID0gJ3RydWUnO1xyXG4gICAgY2FzZSBsZWdhY3lDQy5zeXMuQlJPV1NFUl9UWVBFX1NPVUdPVTpcclxuICAgIGNhc2UgbGVnYWN5Q0Muc3lzLkJST1dTRVJfVFlQRV9VQzpcclxuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxXaWR0aCA9IChmcmFtZSkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gZnJhbWUuY2xpZW50V2lkdGg7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBfX0Jyb3dzZXJHZXR0ZXIuYXZhaWxIZWlnaHQgPSAoZnJhbWUpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyYW1lLmNsaWVudEhlaWdodDtcclxuICAgICAgICB9O1xyXG4gICAgICAgIGJyZWFrO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFZpZXcgcmVwcmVzZW50cyB0aGUgZ2FtZSB3aW5kb3cuPGJyLz5cclxuICogSXQncyBtYWluIHRhc2sgaW5jbHVkZTogPGJyLz5cclxuICogIC0gQXBwbHkgdGhlIGRlc2lnbiByZXNvbHV0aW9uIHBvbGljeSB0byB0aGUgVUkgQ2FudmFzPGJyLz5cclxuICogIC0gUHJvdmlkZSBpbnRlcmFjdGlvbiB3aXRoIHRoZSB3aW5kb3csIGxpa2UgcmVzaXplIGV2ZW50IG9uIHdlYiwgcmV0aW5hIGRpc3BsYXkgc3VwcG9ydCwgZXRjLi4uPGJyLz5cclxuICogIC0gTWFuYWdlIHRoZSBzY2FsZSBhbmQgdHJhbnNsYXRpb24gb2YgY2FudmFzIHJlbGF0ZWQgdG8gdGhlIGZyYW1lIG9uIFdlYjxici8+XHJcbiAqIDxici8+XHJcbiAqIFdpdGgge3t2aWV3fX0gYXMgaXRzIHNpbmdsZXRvbiBpbml0aWFsaXplZCBieSB0aGUgZW5naW5lLCB5b3UgZG9uJ3QgbmVlZCB0byBjYWxsIGFueSBjb25zdHJ1Y3RvciBvciBjcmVhdGUgZnVuY3Rpb25zLDxici8+XHJcbiAqIHRoZSBzdGFuZGFyZCB3YXkgdG8gdXNlIGl0IGlzIGJ5IGNhbGxpbmc6PGJyLz5cclxuICogIC0gdmlldy5tZXRob2ROYW1lKCk7IDxici8+XHJcbiAqIEB6aCBWaWV3IOS7o+ihqOa4uOaIj+eql+WPo+inhuWbvu+8jOWug+eahOaguOW/g+WKn+iDveWMheaLrO+8mlxyXG4gKiAgLSDlr7nmiYDmnIkgVUkgQ2FudmFzIOi/m+ihjOiuvuiuoeWIhui+qOeOh+mAgumFjeOAglxyXG4gKiAgLSDmj5Dkvpvnqpflj6Pop4blm77nmoTkuqTkupLvvIzmr5TlpoLnm5HlkKwgcmVzaXplIOS6i+S7tu+8jOaOp+WItiByZXRpbmEg5bGP5bmV6YCC6YWN77yM562J562J44CCXHJcbiAqICAtIOaOp+WItiBDYW52YXMg6IqC54K555u45a+55LqO5aSW5bGCIERPTSDoioLngrnnmoTnvKnmlL7lkozlgY/np7vjgIJcclxuICog5byV5pOO5Lya6Ieq5Yqo5Yid5aeL5YyW5a6D55qE5Y2V5L6L5a+56LGhIHt7dmlld31977yM5omA5Lul5L2g5LiN6ZyA6KaB5a6e5L6L5YyW5Lu75L2VIFZpZXfvvIzlj6rpnIDopoHnm7TmjqXkvb/nlKggYHZpZXcubWV0aG9kTmFtZSgpO2BcclxuICovXHJcbmV4cG9ydCBjbGFzcyBWaWV3IGV4dGVuZHMgRXZlbnRUYXJnZXQge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U6IFZpZXc7XHJcbiAgICBwdWJsaWMgX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBfZGVzaWduUmVzb2x1dGlvblNpemU6IFNpemU7XHJcbiAgICBwdWJsaWMgX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemU6IFNpemU7XHJcblxyXG4gICAgcHJpdmF0ZSBfZnJhbWVTaXplOiBTaXplO1xyXG4gICAgcHJpdmF0ZSBfc2NhbGVYOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zY2FsZVk6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3ZpZXdwb3J0UmVjdDogUmVjdDtcclxuICAgIHByaXZhdGUgX3Zpc2libGVSZWN0OiBSZWN0O1xyXG4gICAgcHJpdmF0ZSBfYXV0b0Z1bGxTY3JlZW46IGJvb2xlYW47XHJcbiAgICBwcml2YXRlIF9kZXZpY2VQaXhlbFJhdGlvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9tYXhQaXhlbFJhdGlvOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9yZXRpbmFFbmFibGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcmVzaXplQ2FsbGJhY2s6IEZ1bmN0aW9uIHwgbnVsbDtcclxuICAgIHByaXZhdGUgX3Jlc2l6aW5nOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfb3JpZW50YXRpb25DaGFuZ2luZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2lzUm90YXRlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX29yaWVudGF0aW9uOiBhbnk7XHJcbiAgICBwcml2YXRlIF9pc0FkanVzdFZpZXdwb3J0OiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfYW50aUFsaWFzRW5hYmxlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3Jlc29sdXRpb25Qb2xpY3k6IFJlc29sdXRpb25Qb2xpY3k7XHJcbiAgICBwcml2YXRlIF9ycEV4YWN0Rml0OiBSZXNvbHV0aW9uUG9saWN5O1xyXG4gICAgcHJpdmF0ZSBfcnBTaG93QWxsOiBSZXNvbHV0aW9uUG9saWN5O1xyXG4gICAgcHJpdmF0ZSBfcnBOb0JvcmRlcjogUmVzb2x1dGlvblBvbGljeTtcclxuICAgIHByaXZhdGUgX3JwRml4ZWRIZWlnaHQ6IFJlc29sdXRpb25Qb2xpY3k7XHJcbiAgICBwcml2YXRlIF9ycEZpeGVkV2lkdGg6IFJlc29sdXRpb25Qb2xpY3k7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IF90ID0gdGhpcztcclxuICAgICAgICBjb25zdCBfc3RyYXRlZ3llciA9IENvbnRhaW5lclN0cmF0ZWd5O1xyXG4gICAgICAgIGNvbnN0IF9zdHJhdGVneSA9IENvbnRlbnRTdHJhdGVneTtcclxuXHJcbiAgICAgICAgLy8gU2l6ZSBvZiBwYXJlbnQgbm9kZSB0aGF0IGNvbnRhaW5zIGNjLmdhbWUuY29udGFpbmVyIGFuZCBjYy5nYW1lLmNhbnZhc1xyXG4gICAgICAgIHRoaXMuX2ZyYW1lU2l6ZSA9IG5ldyBTaXplKDAsIDApO1xyXG5cclxuICAgICAgICAvLyByZXNvbHV0aW9uIHNpemUsIGl0IGlzIHRoZSBzaXplIGFwcHJvcHJpYXRlIGZvciB0aGUgYXBwIHJlc291cmNlcy5cclxuICAgICAgICB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSA9IG5ldyBTaXplKDAsIDApO1xyXG4gICAgICAgIHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUgPSBuZXcgU2l6ZSgwLCAwKTtcclxuICAgICAgICB0aGlzLl9zY2FsZVggPSAxO1xyXG4gICAgICAgIHRoaXMuX3NjYWxlWSA9IDE7XHJcbiAgICAgICAgLy8gVmlld3BvcnQgaXMgdGhlIGNvbnRhaW5lcidzIHJlY3QgcmVsYXRlZCB0byBjb250ZW50J3MgY29vcmRpbmF0ZXMgaW4gcGl4ZWxcclxuICAgICAgICB0aGlzLl92aWV3cG9ydFJlY3QgPSBuZXcgUmVjdCgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBUaGUgdmlzaWJsZSByZWN0IGluIGNvbnRlbnQncyBjb29yZGluYXRlIGluIHBvaW50XHJcbiAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3QgPSBuZXcgUmVjdCgwLCAwLCAwLCAwKTtcclxuICAgICAgICAvLyBBdXRvIGZ1bGwgc2NyZWVuIGRpc2FibGVkIGJ5IGRlZmF1bHRcclxuICAgICAgICB0aGlzLl9hdXRvRnVsbFNjcmVlbiA9IGZhbHNlO1xyXG4gICAgICAgIC8vIFRoZSBkZXZpY2UncyBwaXhlbCByYXRpbyAoZm9yIHJldGluYSBkaXNwbGF5cylcclxuICAgICAgICB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvID0gMTtcclxuICAgICAgICBpZiAoSlNCIHx8IFJVTlRJTUVfQkFTRUQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF4UGl4ZWxSYXRpbyA9IDQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbWF4UGl4ZWxSYXRpbyA9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFJldGluYSBkaXNhYmxlZCBieSBkZWZhdWx0XHJcbiAgICAgICAgdGhpcy5fcmV0aW5hRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIC8vIEN1c3RvbSBjYWxsYmFjayBmb3IgcmVzaXplIGV2ZW50XHJcbiAgICAgICAgdGhpcy5fcmVzaXplQ2FsbGJhY2sgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3Jlc2l6aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcmVzaXplV2l0aEJyb3dzZXJTaXplID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3JpZW50YXRpb25DaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5faXNSb3RhdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fb3JpZW50YXRpb24gPSBsZWdhY3lDQy5tYWNyby5PUklFTlRBVElPTl9BVVRPO1xyXG4gICAgICAgIHRoaXMuX2lzQWRqdXN0Vmlld3BvcnQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2FudGlBbGlhc0VuYWJsZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gU2V0dXAgc3lzdGVtIGRlZmF1bHQgcmVzb2x1dGlvbiBwb2xpY2llc1xyXG4gICAgICAgIHRoaXMuX3JwRXhhY3RGaXQgPSBuZXcgUmVzb2x1dGlvblBvbGljeShfc3RyYXRlZ3llci5FUVVBTF9UT19GUkFNRSwgX3N0cmF0ZWd5LkVYQUNUX0ZJVCk7XHJcbiAgICAgICAgdGhpcy5fcnBTaG93QWxsID0gbmV3IFJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5TSE9XX0FMTCk7XHJcbiAgICAgICAgdGhpcy5fcnBOb0JvcmRlciA9IG5ldyBSZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuTk9fQk9SREVSKTtcclxuICAgICAgICB0aGlzLl9ycEZpeGVkSGVpZ2h0ID0gbmV3IFJlc29sdXRpb25Qb2xpY3koX3N0cmF0ZWd5ZXIuRVFVQUxfVE9fRlJBTUUsIF9zdHJhdGVneS5GSVhFRF9IRUlHSFQpO1xyXG4gICAgICAgIHRoaXMuX3JwRml4ZWRXaWR0aCA9IG5ldyBSZXNvbHV0aW9uUG9saWN5KF9zdHJhdGVneWVyLkVRVUFMX1RPX0ZSQU1FLCBfc3RyYXRlZ3kuRklYRURfV0lEVEgpO1xyXG4gICAgICAgIHRoaXMuX3Jlc29sdXRpb25Qb2xpY3kgPSB0aGlzLl9ycFNob3dBbGw7XHJcblxyXG4gICAgICAgIGxlZ2FjeUNDLmdhbWUub25jZShsZWdhY3lDQy5HYW1lLkVWRU5UX0VOR0lORV9JTklURUQsIHRoaXMuaW5pdCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXQgKCkge1xyXG4gICAgICAgIF9fQnJvd3NlckdldHRlci5pbml0KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2luaXRGcmFtZVNpemUoKTtcclxuICAgICAgICB0aGlzLmVuYWJsZUFudGlBbGlhcyh0cnVlKTtcclxuXHJcbiAgICAgICAgY29uc3QgdyA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGggPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUud2lkdGggPSB3O1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCA9IGg7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCA9IHc7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgPSBoO1xyXG4gICAgICAgIHRoaXMuX3ZpZXdwb3J0UmVjdC53aWR0aCA9IHc7XHJcbiAgICAgICAgdGhpcy5fdmlld3BvcnRSZWN0LmhlaWdodCA9IGg7XHJcbiAgICAgICAgdGhpcy5fdmlzaWJsZVJlY3Qud2lkdGggPSB3O1xyXG4gICAgICAgIHRoaXMuX3Zpc2libGVSZWN0LmhlaWdodCA9IGg7XHJcblxyXG4gICAgICAgIGxlZ2FjeUNDLndpblNpemUud2lkdGggPSB0aGlzLl92aXNpYmxlUmVjdC53aWR0aDtcclxuICAgICAgICBsZWdhY3lDQy53aW5TaXplLmhlaWdodCA9IHRoaXMuX3Zpc2libGVSZWN0LmhlaWdodDtcclxuICAgICAgICBpZiAobGVnYWN5Q0MudmlzaWJsZVJlY3QpIHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MudmlzaWJsZVJlY3QuaW5pdCh0aGlzLl92aXNpYmxlUmVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHdoZXRoZXIgcmVzaXplIGNhbnZhcyBhdXRvbWF0aWNhbGx5IHdoZW4gYnJvd3NlcidzIHNpemUgY2hhbmdlZC48YnIvPlxyXG4gICAgICogVXNlZnVsIG9ubHkgb24gd2ViLlxyXG4gICAgICogQHpoIOiuvue9ruW9k+WPkeeOsOa1j+iniOWZqOeahOWwuuWvuOaUueWPmOaXtu+8jOaYr+WQpuiHquWKqOiwg+aVtCBjYW52YXMg5bC65a+45aSn5bCP44CCXHJcbiAgICAgKiDku4XlnKggV2ViIOaooeW8j+S4i+acieaViOOAglxyXG4gICAgICogQHBhcmFtIGVuYWJsZWQgLSBXaGV0aGVyIGVuYWJsZSBhdXRvbWF0aWMgcmVzaXplIHdpdGggYnJvd3NlcidzIHJlc2l6ZSBldmVudFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzaXplV2l0aEJyb3dzZXJTaXplIChlbmFibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgICAgICAgLy8gZW5hYmxlXHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcmVzaXplV2l0aEJyb3dzZXJTaXplKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemVXaXRoQnJvd3NlclNpemUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuX3Jlc2l6ZUV2ZW50KTtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMuX29yaWVudGF0aW9uQ2hhbmdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGRpc2FibGVcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Jlc2l6ZVdpdGhCcm93c2VyU2l6ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplV2l0aEJyb3dzZXJTaXplID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5fcmVzaXplRXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29yaWVudGF0aW9uY2hhbmdlJywgdGhpcy5fb3JpZW50YXRpb25DaGFuZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBjYWxsYmFjayBmdW5jdGlvbiBmb3IgYHZpZXdgJ3MgcmVzaXplIGFjdGlvbiw8YnIvPlxyXG4gICAgICogdGhpcyBjYWxsYmFjayB3aWxsIGJlIGludm9rZWQgYmVmb3JlIGFwcGx5aW5nIHJlc29sdXRpb24gcG9saWN5LCA8YnIvPlxyXG4gICAgICogc28geW91IGNhbiBkbyBhbnkgYWRkaXRpb25hbCBtb2RpZmljYXRpb25zIHdpdGhpbiB0aGUgY2FsbGJhY2suPGJyLz5cclxuICAgICAqIFVzZWZ1bCBvbmx5IG9uIHdlYi5cclxuICAgICAqIEB6aCDorr7nva4gYHZpZXdgIOiwg+aVtOinhueql+WwuuWvuOihjOS4uueahOWbnuiwg+WHveaVsO+8jFxyXG4gICAgICog6L+Z5Liq5Zue6LCD5Ye95pWw5Lya5Zyo5bqU55So6YCC6YWN5qih5byP5LmL5YmN6KKr6LCD55So77yMXHJcbiAgICAgKiDlm6DmraTkvaDlj6/ku6XlnKjov5nkuKrlm57osIPlh73mlbDlhoXmt7vliqDku7vmhI/pmYTliqDmlLnlj5jvvIxcclxuICAgICAqIOS7heWcqCBXZWIg5bmz5Y+w5LiL5pyJ5pWI44CCXHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgY2FsbGJhY2sgZnVuY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFJlc2l6ZUNhbGxiYWNrIChjYWxsYmFjazogRnVuY3Rpb24gfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyB8fCBjYWxsYmFjayA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jlc2l6ZUNhbGxiYWNrID0gY2FsbGJhY2s7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgZ2FtZSwgaXQgY2FuIGJlIGxhbmRzY2FwZSwgcG9ydHJhaXQgb3IgYXV0by5cclxuICAgICAqIFdoZW4gc2V0IGl0IHRvIGxhbmRzY2FwZSBvciBwb3J0cmFpdCwgYW5kIHNjcmVlbiB3L2ggcmF0aW8gZG9lc24ndCBmaXQsXHJcbiAgICAgKiBgdmlld2Agd2lsbCBhdXRvbWF0aWNhbGx5IHJvdGF0ZSB0aGUgZ2FtZSBjYW52YXMgdXNpbmcgQ1NTLlxyXG4gICAgICogTm90ZSB0aGF0IHRoaXMgZnVuY3Rpb24gZG9lc24ndCBoYXZlIGFueSBlZmZlY3QgaW4gbmF0aXZlLFxyXG4gICAgICogaW4gbmF0aXZlLCB5b3UgbmVlZCB0byBzZXQgdGhlIGFwcGxpY2F0aW9uIG9yaWVudGF0aW9uIGluIG5hdGl2ZSBwcm9qZWN0IHNldHRpbmdzXHJcbiAgICAgKiBAemgg6K6+572u5ri45oiP5bGP5bmV5pyd5ZCR77yM5a6D6IO95aSf5piv5qiq54mI77yM56uW54mI5oiW6Ieq5Yqo44CCXHJcbiAgICAgKiDlvZPorr7nva7kuLrmqKrniYjmiJbnq5bniYjvvIzlubbkuJTlsY/luZXnmoTlrr3pq5jmr5TkvovkuI3ljLnphY3ml7bvvIxcclxuICAgICAqIGB2aWV3YCDkvJroh6rliqjnlKggQ1NTIOaXi+i9rOa4uOaIj+WcuuaZr+eahCBjYW52YXPvvIxcclxuICAgICAqIOi/meS4quaWueazleS4jeS8muWvuSBuYXRpdmUg6YOo5YiG5Lqn55Sf5Lu75L2V5b2x5ZON77yM5a+55LqOIG5hdGl2ZSDogIzoqIDvvIzkvaDpnIDopoHlnKjlupTnlKjorr7nva7kuK3nmoTorr7nva7mjpLniYjjgIJcclxuICAgICAqIEBwYXJhbSBvcmllbnRhdGlvbiAtIFBvc3NpYmxlIHZhbHVlczogbWFjcm8uT1JJRU5UQVRJT05fTEFORFNDQVBFIHwgbWFjcm8uT1JJRU5UQVRJT05fUE9SVFJBSVQgfCBtYWNyby5PUklFTlRBVElPTl9BVVRPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRPcmllbnRhdGlvbiAob3JpZW50YXRpb246IG51bWJlcikge1xyXG4gICAgICAgIG9yaWVudGF0aW9uID0gb3JpZW50YXRpb24gJiBsZWdhY3lDQy5tYWNyby5PUklFTlRBVElPTl9BVVRPO1xyXG4gICAgICAgIGlmIChvcmllbnRhdGlvbiAmJiB0aGlzLl9vcmllbnRhdGlvbiAhPT0gb3JpZW50YXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fb3JpZW50YXRpb24gPSBvcmllbnRhdGlvbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgd2hldGhlciB0aGUgZW5naW5lIG1vZGlmeSB0aGUgXCJ2aWV3cG9ydFwiIG1ldGEgaW4geW91ciB3ZWIgcGFnZS48YnIvPlxyXG4gICAgICogSXQncyBlbmFibGVkIGJ5IGRlZmF1bHQsIHdlIHN0cm9uZ2x5IHN1Z2dlc3QgeW91IG5vdCB0byBkaXNhYmxlIGl0Ljxici8+XHJcbiAgICAgKiBBbmQgZXZlbiB3aGVuIGl0J3MgZW5hYmxlZCwgeW91IGNhbiBzdGlsbCBzZXQgeW91ciBvd24gXCJ2aWV3cG9ydFwiIG1ldGEsIGl0IHdvbid0IGJlIG92ZXJyaWRkZW48YnIvPlxyXG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXHJcbiAgICAgKiBAemgg6K6+572u5byV5pOO5piv5ZCm6LCD5pW0IHZpZXdwb3J0IG1ldGEg5p2l6YWN5ZCI5bGP5bmV6YCC6YWN44CCXHJcbiAgICAgKiDpu5jorqTorr7nva7kuLrlkK/liqjvvIzmiJHku6zlvLrng4jlu7rorq7kvaDkuI3opoHlsIblroPorr7nva7kuLrlhbPpl63jgIJcclxuICAgICAqIOWNs+S9v+W9k+Wug+WQr+WKqOaXtu+8jOS9oOS7jeeEtuiDveWkn+iuvue9ruS9oOeahCB2aWV3cG9ydCBtZXRh77yM5a6D5LiN5Lya6KKr6KaG55uW44CCXHJcbiAgICAgKiDku4XlnKggV2ViIOaooeW8j+S4i+acieaViFxyXG4gICAgICogQHBhcmFtIGVuYWJsZWQgLSBFbmFibGUgYXV0b21hdGljIG1vZGlmaWNhdGlvbiB0byBcInZpZXdwb3J0XCIgbWV0YVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRqdXN0Vmlld3BvcnRNZXRhIChlbmFibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgdGhpcy5faXNBZGp1c3RWaWV3cG9ydCA9IGVuYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldGluYSBzdXBwb3J0IGlzIGVuYWJsZWQgYnkgZGVmYXVsdCBmb3IgQXBwbGUgZGV2aWNlIGJ1dCBkaXNhYmxlZCBmb3Igb3RoZXIgZGV2aWNlcyw8YnIvPlxyXG4gICAgICogaXQgdGFrZXMgZWZmZWN0IG9ubHkgd2hlbiB5b3UgY2FsbGVkIHNldERlc2lnblJlc29sdXRpb25Qb2xpY3k8YnIvPlxyXG4gICAgICogT25seSB1c2VmdWwgb24gd2ViXHJcbiAgICAgKiBAemgg5a+55LqOIEFwcGxlIOi/meenjeaUr+aMgSBSZXRpbmEg5pi+56S655qE6K6+5aSH5LiK6buY6K6k6L+b6KGM5LyY5YyW6ICM5YW25LuW57G75Z6L6K6+5aSH6buY6K6k5LiN6L+b6KGM5LyY5YyW77yMXHJcbiAgICAgKiDlroPku4XkvJrlnKjkvaDosIPnlKggc2V0RGVzaWduUmVzb2x1dGlvblBvbGljeSDmlrnms5Xml7bmnInlvbHlk43jgIJcclxuICAgICAqIOS7heWcqCBXZWIg5qih5byP5LiL5pyJ5pWI44CCXHJcbiAgICAgKiBAcGFyYW0gZW5hYmxlZCAtIEVuYWJsZSBvciBkaXNhYmxlIHJldGluYSBkaXNwbGF5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmFibGVSZXRpbmEgKGVuYWJsZWQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9yZXRpbmFFbmFibGVkID0gISFlbmFibGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDaGVjayB3aGV0aGVyIHJldGluYSBkaXNwbGF5IGlzIGVuYWJsZWQuPGJyLz5cclxuICAgICAqIE9ubHkgdXNlZnVsIG9uIHdlYlxyXG4gICAgICogQHpoIOajgOafpeaYr+WQpuWvuSBSZXRpbmEg5pi+56S66K6+5aSH6L+b6KGM5LyY5YyW44CCXHJcbiAgICAgKiDku4XlnKggV2ViIOaooeW8j+S4i+acieaViOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNSZXRpbmFFbmFibGVkICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmV0aW5hRW5hYmxlZDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXaGV0aGVyIHRvIEVuYWJsZSBvbiBhbnRpLWFsaWFzXHJcbiAgICAgKiBAemgg5o6n5Yi25oqX6ZSv6b2/5piv5ZCm5byA5ZCvXHJcbiAgICAgKiBAcGFyYW0gZW5hYmxlZCAtIEVuYWJsZSBvciBub3QgYW50aS1hbGlhc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZW5hYmxlQW50aUFsaWFzIChlbmFibGVkOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2FudGlBbGlhc0VuYWJsZWQgPT09IGVuYWJsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hbnRpQWxpYXNFbmFibGVkID0gZW5hYmxlZDtcclxuICAgICAgICBpZiAobGVnYWN5Q0MuZ2FtZS5yZW5kZXJUeXBlID09PSBsZWdhY3lDQy5HYW1lLlJFTkRFUl9UWVBFX1dFQkdMKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gbGVnYWN5Q0MubG9hZGVyLl9jYWNoZTtcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBmb3JpblxyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBjYWNoZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaXRlbSA9IGNhY2hlW2tleV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0ZXggPSBpdGVtICYmIGl0ZW0uY29udGVudCBpbnN0YW5jZW9mIGxlZ2FjeUNDLlRleHR1cmUyRCA/IGl0ZW0uY29udGVudCA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAodGV4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgRmlsdGVyID0gbGVnYWN5Q0MuVGV4dHVyZTJELkZpbHRlcjtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZW5hYmxlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXguc2V0RmlsdGVycyhGaWx0ZXIuTElORUFSLCBGaWx0ZXIuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleC5zZXRGaWx0ZXJzKEZpbHRlci5ORUFSRVNULCBGaWx0ZXIuTkVBUkVTVCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGxlZ2FjeUNDLmdhbWUucmVuZGVyVHlwZSA9PT0gbGVnYWN5Q0MuR2FtZS5SRU5ERVJfVFlQRV9DQU5WQVMpIHtcclxuICAgICAgICAgICAgY29uc3QgY3R4ID0gbGVnYWN5Q0MuZ2FtZS5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICAgICAgY3R4LmltYWdlU21vb3RoaW5nRW5hYmxlZCA9IGVuYWJsZWQ7XHJcbiAgICAgICAgICAgIGN0eC5tb3pJbWFnZVNtb290aGluZ0VuYWJsZWQgPSBlbmFibGVkO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHdoZXRoZXIgdGhlIGN1cnJlbnQgZW5hYmxlIG9uIGFudGktYWxpYXNcclxuICAgICAqIEB6aCDov5Tlm57lvZPliY3mmK/lkKbmipfplK/pvb9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGlzQW50aUFsaWFzRW5hYmxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FudGlBbGlhc0VuYWJsZWQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogSWYgZW5hYmxlZCwgdGhlIGFwcGxpY2F0aW9uIHdpbGwgdHJ5IGF1dG9tYXRpY2FsbHkgdG8gZW50ZXIgZnVsbCBzY3JlZW4gbW9kZSBvbiBtb2JpbGUgZGV2aWNlczxici8+XHJcbiAgICAgKiBZb3UgY2FuIHBhc3MgdHJ1ZSBhcyBwYXJhbWV0ZXIgdG8gZW5hYmxlIGl0IGFuZCBkaXNhYmxlIGl0IGJ5IHBhc3NpbmcgZmFsc2UuPGJyLz5cclxuICAgICAqIE9ubHkgdXNlZnVsIG9uIHdlYlxyXG4gICAgICogQHpoIOWQr+WKqOaXtu+8jOenu+WKqOerr+a4uOaIj+S8muWcqOenu+WKqOerr+iHquWKqOWwneivlei/m+WFpeWFqOWxj+aooeW8j+OAglxyXG4gICAgICog5L2g6IO95aSf5Lyg5YWlIHRydWUg5Li65Y+C5pWw5Y675ZCv5Yqo5a6D77yM55SoIGZhbHNlIOWPguaVsOadpeWFs+mXreWug+OAglxyXG4gICAgICogQHBhcmFtIGVuYWJsZWQgLSBFbmFibGUgb3IgZGlzYWJsZSBhdXRvIGZ1bGwgc2NyZWVuIG9uIG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmFibGVBdXRvRnVsbFNjcmVlbiAoZW5hYmxlZDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChlbmFibGVkICYmXHJcbiAgICAgICAgICAgIGVuYWJsZWQgIT09IHRoaXMuX2F1dG9GdWxsU2NyZWVuICYmXHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLnN5cy5pc01vYmlsZSAmJlxyXG4gICAgICAgICAgICBsZWdhY3lDQy5zeXMuYnJvd3NlclR5cGUgIT09IGxlZ2FjeUNDLnN5cy5CUk9XU0VSX1RZUEVfV0VDSEFUKSB7XHJcbiAgICAgICAgICAgIC8vIEF1dG9tYXRpY2FsbHkgZnVsbCBzY3JlZW4gd2hlbiB1c2VyIHRvdWNoZXMgb24gbW9iaWxlIHZlcnNpb25cclxuICAgICAgICAgICAgdGhpcy5fYXV0b0Z1bGxTY3JlZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5zY3JlZW4uYXV0b0Z1bGxTY3JlZW4obGVnYWN5Q0MuZ2FtZS5mcmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9hdXRvRnVsbFNjcmVlbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2hlY2sgd2hldGhlciBhdXRvIGZ1bGwgc2NyZWVuIGlzIGVuYWJsZWQuPGJyLz5cclxuICAgICAqIE9ubHkgdXNlZnVsIG9uIHdlYlxyXG4gICAgICogQHpoIOajgOafpeiHquWKqOi/m+WFpeWFqOWxj+aooeW8j+aYr+WQpuWQr+WKqOOAglxyXG4gICAgICog5LuF5ZyoIFdlYiDmqKHlvI/kuIvmnInmlYjjgIJcclxuICAgICAqIEByZXR1cm4gQXV0byBmdWxsIHNjcmVlbiBlbmFibGVkIG9yIG5vdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNBdXRvRnVsbFNjcmVlbkVuYWJsZWQgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9hdXRvRnVsbFNjcmVlbjtcclxuICAgIH1cclxuXHJcbiAgICAvKlxyXG4gICAgICogTm90IHN1cHBvcnQgb24gbmF0aXZlLjxici8+XHJcbiAgICAgKiBPbiB3ZWIsIGl0IHNldHMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcy5cclxuICAgICAqIEB6aCDov5nkuKrmlrnms5XlubbkuI3mlK/mjIEgbmF0aXZlIOW5s+WPsO+8jOWcqCBXZWIg5bmz5Y+w5LiL77yM5Y+v5Lul55So5p2l6K6+572uIGNhbnZhcyDlsLrlr7jjgIJcclxuICAgICAqIEBwcml2YXRlXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gd2lkdGhcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBoZWlnaHRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldENhbnZhc1NpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgY2FudmFzID0gbGVnYWN5Q0MuZ2FtZS5jYW52YXM7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gbGVnYWN5Q0MuZ2FtZS5jb250YWluZXI7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIGNhbnZhcy53aWR0aCA9IHdpZHRoICogdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gaGVpZ2h0ICogdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuXHJcbiAgICAgICAgLy8gY2FudmFzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgLy8gY2FudmFzLmhlaWdodCA9IGhlaWdodDtcclxuXHJcbiAgICAgICAgY2FudmFzLnN0eWxlLndpZHRoID0gd2lkdGggKyAncHgnO1xyXG4gICAgICAgIGNhbnZhcy5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgICBjb250YWluZXIuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgICAgICAgY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IGhlaWdodCArICdweCc7XHJcblxyXG4gICAgICAgIHRoaXMuX3Jlc2l6ZUV2ZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJldHVybnMgdGhlIGNhbnZhcyBzaXplIG9mIHRoZSB2aWV3Ljxici8+XHJcbiAgICAgKiBPbiBuYXRpdmUgcGxhdGZvcm1zLCBpdCByZXR1cm5zIHRoZSBzY3JlZW4gc2l6ZSBzaW5jZSB0aGUgdmlldyBpcyBhIGZ1bGxzY3JlZW4gdmlldy48YnIvPlxyXG4gICAgICogT24gd2ViLCBpdCByZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBjYW52YXMgZWxlbWVudC5cclxuICAgICAqIEB6aCDov5Tlm57op4blm77kuK0gY2FudmFzIOeahOWwuuWvuOOAglxyXG4gICAgICog5ZyoIG5hdGl2ZSDlubPlj7DkuIvvvIzlroPov5Tlm57lhajlsY/op4blm77kuIvlsY/luZXnmoTlsLrlr7jjgIJcclxuICAgICAqIOWcqCBXZWIg5bmz5Y+w5LiL77yM5a6D6L+U5ZueIGNhbnZhcyDlhYPntKDlsLrlr7jjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldENhbnZhc1NpemUgKCk6IFNpemUge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2l6ZShsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aCwgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgZnJhbWUgc2l6ZSBvZiB0aGUgdmlldy48YnIvPlxyXG4gICAgICogT24gbmF0aXZlIHBsYXRmb3JtcywgaXQgcmV0dXJucyB0aGUgc2NyZWVuIHNpemUgc2luY2UgdGhlIHZpZXcgaXMgYSBmdWxsc2NyZWVuIHZpZXcuPGJyLz5cclxuICAgICAqIE9uIHdlYiwgaXQgcmV0dXJucyB0aGUgc2l6ZSBvZiB0aGUgY2FudmFzJ3Mgb3V0ZXIgRE9NIGVsZW1lbnQuXHJcbiAgICAgKiBAemgg6L+U5Zue6KeG5Zu+5Lit6L655qGG5bC65a+444CCXHJcbiAgICAgKiDlnKggbmF0aXZlIOW5s+WPsOS4i++8jOWug+i/lOWbnuWFqOWxj+inhuWbvuS4i+Wxj+W5leeahOWwuuWvuOOAglxyXG4gICAgICog5ZyoIHdlYiDlubPlj7DkuIvvvIzlroPov5Tlm54gY2FudmFzIOWFg+e0oOeahOWkluWxgiBET00g5YWD57Sg5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRGcmFtZVNpemUgKCk6IFNpemUge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2l6ZSh0aGlzLl9mcmFtZVNpemUud2lkdGgsIHRoaXMuX2ZyYW1lU2l6ZS5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE9uIG5hdGl2ZSwgaXQgc2V0cyB0aGUgZnJhbWUgc2l6ZSBvZiB2aWV3Ljxici8+XHJcbiAgICAgKiBPbiB3ZWIsIGl0IHNldHMgdGhlIHNpemUgb2YgdGhlIGNhbnZhcydzIG91dGVyIERPTSBlbGVtZW50LlxyXG4gICAgICogQHpoIOWcqCBuYXRpdmUg5bmz5Y+w5LiL77yM6K6+572u6KeG5Zu+5qGG5p625bC65a+444CCXHJcbiAgICAgKiDlnKggd2ViIOW5s+WPsOS4i++8jOiuvue9riBjYW52YXMg5aSW5bGCIERPTSDlhYPntKDlsLrlr7jjgIJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSB3aWR0aFxyXG4gICAgICogQHBhcmFtIHtOdW1iZXJ9IGhlaWdodFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RnJhbWVTaXplICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZyYW1lU2l6ZS53aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2ZyYW1lU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgbGVnYWN5Q0MuZnJhbWUuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgICAgICAgbGVnYWN5Q0MuZnJhbWUuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICB0aGlzLl9yZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHZpc2libGUgYXJlYSBzaXplIG9mIHRoZSB2aWV3IHBvcnQuXHJcbiAgICAgKiBAemgg6L+U5Zue6KeG5Zu+56qX5Y+j5Y+v6KeB5Yy65Z+f5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlU2l6ZSAoKTogU2l6ZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBTaXplKHRoaXMuX3Zpc2libGVSZWN0LndpZHRoLCB0aGlzLl92aXNpYmxlUmVjdC5oZWlnaHQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHZpc2libGUgYXJlYSBzaXplIG9mIHRoZSB2aWV3IHBvcnQuXHJcbiAgICAgKiBAemgg6L+U5Zue6KeG5Zu+56qX5Y+j5Y+v6KeB5Yy65Z+f5YOP57Sg5bC65a+444CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlU2l6ZUluUGl4ZWwgKCk6IFNpemUge1xyXG4gICAgICAgIHJldHVybiBuZXcgU2l6ZSggdGhpcy5fdmlzaWJsZVJlY3Qud2lkdGggKiB0aGlzLl9zY2FsZVgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3Zpc2libGVSZWN0LmhlaWdodCAqIHRoaXMuX3NjYWxlWSApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHZpc2libGUgb3JpZ2luIG9mIHRoZSB2aWV3IHBvcnQuXHJcbiAgICAgKiBAemgg6L+U5Zue6KeG5Zu+56qX5Y+j5Y+v6KeB5Yy65Z+f5Y6f54K544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRWaXNpYmxlT3JpZ2luICgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5fdmlzaWJsZVJlY3QueCwgdGhpcy5fdmlzaWJsZVJlY3QueSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgdmlzaWJsZSBvcmlnaW4gb2YgdGhlIHZpZXcgcG9ydC5cclxuICAgICAqIEB6aCDov5Tlm57op4blm77nqpflj6Plj6/op4HljLrln5/lg4/ntKDljp/ngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFZpc2libGVPcmlnaW5JblBpeGVsICgpOiBWZWMyIHtcclxuICAgICAgICByZXR1cm4gbmV3IFZlYzIodGhpcy5fdmlzaWJsZVJlY3QueCAqIHRoaXMuX3NjYWxlWCxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl92aXNpYmxlUmVjdC55ICogdGhpcy5fc2NhbGVZKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBjdXJyZW50IHJlc29sdXRpb24gcG9saWN5XHJcbiAgICAgKiBAemgg6L+U5Zue5b2T5YmN5YiG6L6o546H5pa55qGIXHJcbiAgICAgKiBAc2VlIHt7UmVzb2x1dGlvblBvbGljeX19XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRSZXNvbHV0aW9uUG9saWN5ICgpOiBSZXNvbHV0aW9uUG9saWN5IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzb2x1dGlvblBvbGljeTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHRoZSBjdXJyZW50IHJlc29sdXRpb24gcG9saWN5XHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN5YiG6L6o546H5qih5byPXHJcbiAgICAgKiBAc2VlIHt7UmVzb2x1dGlvblBvbGljeX19XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRSZXNvbHV0aW9uUG9saWN5IChyZXNvbHV0aW9uUG9saWN5OiBSZXNvbHV0aW9uUG9saWN5fG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IF90ID0gdGhpcztcclxuICAgICAgICBpZiAocmVzb2x1dGlvblBvbGljeSBpbnN0YW5jZW9mIFJlc29sdXRpb25Qb2xpY3kpIHtcclxuICAgICAgICAgICAgX3QuX3Jlc29sdXRpb25Qb2xpY3kgPSByZXNvbHV0aW9uUG9saWN5O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbnN1cmUgY29tcGF0aWJpbGl0eSB3aXRoIEpTQlxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBfbG9jUG9saWN5ID0gUmVzb2x1dGlvblBvbGljeTtcclxuICAgICAgICAgICAgaWYgKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuRVhBQ1RfRklUKSB7XHJcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycEV4YWN0Rml0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LlNIT1dfQUxMKSB7XHJcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycFNob3dBbGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc29sdXRpb25Qb2xpY3kgPT09IF9sb2NQb2xpY3kuTk9fQk9SREVSKSB7XHJcbiAgICAgICAgICAgICAgICBfdC5fcmVzb2x1dGlvblBvbGljeSA9IF90Ll9ycE5vQm9yZGVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXNvbHV0aW9uUG9saWN5ID09PSBfbG9jUG9saWN5LkZJWEVEX0hFSUdIVCkge1xyXG4gICAgICAgICAgICAgICAgX3QuX3Jlc29sdXRpb25Qb2xpY3kgPSBfdC5fcnBGaXhlZEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocmVzb2x1dGlvblBvbGljeSA9PT0gX2xvY1BvbGljeS5GSVhFRF9XSURUSCkge1xyXG4gICAgICAgICAgICAgICAgX3QuX3Jlc29sdXRpb25Qb2xpY3kgPSBfdC5fcnBGaXhlZFdpZHRoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHMgdGhlIHJlc29sdXRpb24gcG9saWN5IHdpdGggZGVzaWduZWQgdmlldyBzaXplIGluIHBvaW50cy48YnIvPlxyXG4gICAgICogVGhlIHJlc29sdXRpb24gcG9saWN5IGluY2x1ZGU6IDxici8+XHJcbiAgICAgKiBbMV0gUmVzb2x1dGlvbkV4YWN0Rml0ICAgICAgIEZpbGwgc2NyZWVuIGJ5IHN0cmV0Y2gtdG8tZml0OiBpZiB0aGUgZGVzaWduIHJlc29sdXRpb24gcmF0aW8gb2Ygd2lkdGggdG8gaGVpZ2h0IGlzIGRpZmZlcmVudCBmcm9tIHRoZSBzY3JlZW4gcmVzb2x1dGlvbiByYXRpbywgeW91ciBnYW1lIHZpZXcgd2lsbCBiZSBzdHJldGNoZWQuPGJyLz5cclxuICAgICAqIFsyXSBSZXNvbHV0aW9uTm9Cb3JkZXIgICAgICAgRnVsbCBzY3JlZW4gd2l0aG91dCBibGFjayBib3JkZXI6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB0d28gYXJlYXMgb2YgeW91ciBnYW1lIHZpZXcgd2lsbCBiZSBjdXQuPGJyLz5cclxuICAgICAqIFszXSBSZXNvbHV0aW9uU2hvd0FsbCAgICAgICAgRnVsbCBzY3JlZW4gd2l0aCBibGFjayBib3JkZXI6IGlmIHRoZSBkZXNpZ24gcmVzb2x1dGlvbiByYXRpbyBvZiB3aWR0aCB0byBoZWlnaHQgaXMgZGlmZmVyZW50IGZyb20gdGhlIHNjcmVlbiByZXNvbHV0aW9uIHJhdGlvLCB0d28gYmxhY2sgYm9yZGVycyB3aWxsIGJlIHNob3duLjxici8+XHJcbiAgICAgKiBbNF0gUmVzb2x1dGlvbkZpeGVkSGVpZ2h0ICAgIFNjYWxlIHRoZSBjb250ZW50J3MgaGVpZ2h0IHRvIHNjcmVlbidzIGhlaWdodCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIHdpZHRoPGJyLz5cclxuICAgICAqIFs1XSBSZXNvbHV0aW9uRml4ZWRXaWR0aCAgICAgU2NhbGUgdGhlIGNvbnRlbnQncyB3aWR0aCB0byBzY3JlZW4ncyB3aWR0aCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIGhlaWdodDxici8+XHJcbiAgICAgKiBbUmVzb2x1dGlvblBvbGljeV0gICAgICAgIFtXZWIgb25seSBmZWF0dXJlXSBDdXN0b20gcmVzb2x1dGlvbiBwb2xpY3ksIGNvbnN0cnVjdGVkIGJ5IFJlc29sdXRpb25Qb2xpY3k8YnIvPlxyXG4gICAgICogQHpoIOmAmui/h+iuvue9ruiuvuiuoeWIhui+qOeOh+WSjOWMuemFjeaooeW8j+adpei/m+ihjOa4uOaIj+eUu+mdoueahOWxj+W5lemAgumFjeOAglxyXG4gICAgICogQHBhcmFtIHdpZHRoIERlc2lnbiByZXNvbHV0aW9uIHdpZHRoLlxyXG4gICAgICogQHBhcmFtIGhlaWdodCBEZXNpZ24gcmVzb2x1dGlvbiBoZWlnaHQuXHJcbiAgICAgKiBAcGFyYW0gcmVzb2x1dGlvblBvbGljeSBUaGUgcmVzb2x1dGlvbiBwb2xpY3kgZGVzaXJlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0RGVzaWduUmVzb2x1dGlvblNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCByZXNvbHV0aW9uUG9saWN5OiBSZXNvbHV0aW9uUG9saWN5fG51bWJlcikge1xyXG4gICAgICAgIC8vIERlZmVuc2l2ZSBjb2RlXHJcbiAgICAgICAgaWYgKCAhKHdpZHRoID4gMCB8fCBoZWlnaHQgPiAwKSApe1xyXG4gICAgICAgICAgICBlcnJvcklEKDIyMDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFJlc29sdXRpb25Qb2xpY3kocmVzb2x1dGlvblBvbGljeSk7XHJcbiAgICAgICAgY29uc3QgcG9saWN5ID0gdGhpcy5fcmVzb2x1dGlvblBvbGljeTtcclxuICAgICAgICBpZiAocG9saWN5KSB7XHJcbiAgICAgICAgICAgIHBvbGljeS5wcmVBcHBseSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFJlaW5pdCBmcmFtZSBzaXplXHJcbiAgICAgICAgaWYgKGxlZ2FjeUNDLnN5cy5pc01vYmlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9hZGp1c3RWaWV3cG9ydE1ldGEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFBlcm1pdCB0byByZS1kZXRlY3QgdGhlIG9yaWVudGF0aW9uIG9mIGRldmljZS5cclxuICAgICAgICB0aGlzLl9vcmllbnRhdGlvbkNoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAvLyBJZiByZXNpemluZywgdGhlbiBmcmFtZSBzaXplIGlzIGFscmVhZHkgaW5pdGlhbGl6ZWQsIHRoaXMgbG9naWMgc2hvdWxkIGJlIGltcHJvdmVkXHJcbiAgICAgICAgaWYgKCF0aGlzLl9yZXNpemluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0RnJhbWVTaXplKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBvbGljeSkge1xyXG4gICAgICAgICAgICBsb2dJRCgyMjAxKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS53aWR0aCA9IHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgPSB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQgPSBoZWlnaHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHBvbGljeS5hcHBseSh0aGlzLCB0aGlzLl9kZXNpZ25SZXNvbHV0aW9uU2l6ZSk7XHJcblxyXG4gICAgICAgIGlmIChyZXN1bHQuc2NhbGUgJiYgcmVzdWx0LnNjYWxlLmxlbmd0aCA9PT0gMil7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjYWxlWCA9IHJlc3VsdC5zY2FsZVswXTtcclxuICAgICAgICAgICAgdGhpcy5fc2NhbGVZID0gcmVzdWx0LnNjYWxlWzFdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlc3VsdC52aWV3cG9ydCl7XHJcbiAgICAgICAgICAgIGNvbnN0IHZwID0gdGhpcy5fdmlld3BvcnRSZWN0O1xyXG4gICAgICAgICAgICBjb25zdCB2YiA9IHRoaXMuX3Zpc2libGVSZWN0O1xyXG4gICAgICAgICAgICBjb25zdCBydiA9IHJlc3VsdC52aWV3cG9ydDtcclxuXHJcbiAgICAgICAgICAgIHZwLnggPSBydi54O1xyXG4gICAgICAgICAgICB2cC55ID0gcnYueTtcclxuICAgICAgICAgICAgdnAud2lkdGggPSBydi53aWR0aDtcclxuICAgICAgICAgICAgdnAuaGVpZ2h0ID0gcnYuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgdmIueCA9IDA7XHJcbiAgICAgICAgICAgIHZiLnkgPSAwO1xyXG4gICAgICAgICAgICB2Yi53aWR0aCA9IHJ2LndpZHRoIC8gdGhpcy5fc2NhbGVYO1xyXG4gICAgICAgICAgICB2Yi5oZWlnaHQgPSBydi5oZWlnaHQgLyB0aGlzLl9zY2FsZVk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwb2xpY3kucG9zdEFwcGx5KHRoaXMpO1xyXG4gICAgICAgIGxlZ2FjeUNDLndpblNpemUud2lkdGggPSB0aGlzLl92aXNpYmxlUmVjdC53aWR0aDtcclxuICAgICAgICBsZWdhY3lDQy53aW5TaXplLmhlaWdodCA9IHRoaXMuX3Zpc2libGVSZWN0LmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYgKHZpc2libGVSZWN0KSB7XHJcbiAgICAgICAgICAgIHZpc2libGVSZWN0LmluaXQodGhpcy5fdmlzaWJsZVJlY3QpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5lbWl0KCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgZGVzaWduZWQgc2l6ZSBmb3IgdGhlIHZpZXcuXHJcbiAgICAgKiBEZWZhdWx0IHJlc29sdXRpb24gc2l6ZSBpcyB0aGUgc2FtZSBhcyAnZ2V0RnJhbWVTaXplJy5cclxuICAgICAqIEB6aCDov5Tlm57op4blm77nmoTorr7orqHliIbovqjnjofjgIJcclxuICAgICAqIOm7mOiupOS4i+WIhui+qOeOh+WwuuWvuOWQjCBgZ2V0RnJhbWVTaXplYCDmlrnms5Xnm7jlkIxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldERlc2lnblJlc29sdXRpb25TaXplICgpOiBTaXplIHtcclxuICAgICAgICByZXR1cm4gbmV3IFNpemUodGhpcy5fZGVzaWduUmVzb2x1dGlvblNpemUud2lkdGgsIHRoaXMuX2Rlc2lnblJlc29sdXRpb25TaXplLmhlaWdodCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0cyB0aGUgY29udGFpbmVyIHRvIGRlc2lyZWQgcGl4ZWwgcmVzb2x1dGlvbiBhbmQgZml0IHRoZSBnYW1lIGNvbnRlbnQgdG8gaXQuXHJcbiAgICAgKiBUaGlzIGZ1bmN0aW9uIGlzIHZlcnkgdXNlZnVsIGZvciBhZGFwdGF0aW9uIGluIG1vYmlsZSBicm93c2Vycy5cclxuICAgICAqIEluIHNvbWUgSEQgYW5kcm9pZCBkZXZpY2VzLCB0aGUgcmVzb2x1dGlvbiBpcyB2ZXJ5IGhpZ2gsIGJ1dCBpdHMgYnJvd3NlciBwZXJmb3JtYW5jZSBtYXkgbm90IGJlIHZlcnkgZ29vZC5cclxuICAgICAqIEluIHRoaXMgY2FzZSwgZW5hYmxpbmcgcmV0aW5hIGRpc3BsYXkgaXMgdmVyeSBjb3N0eSBhbmQgbm90IHN1Z2dlc3RlZCwgYW5kIGlmIHJldGluYSBpcyBkaXNhYmxlZCwgdGhlIGltYWdlIG1heSBiZSBibHVycnkuXHJcbiAgICAgKiBCdXQgdGhpcyBBUEkgY2FuIGJlIGhlbHBmdWwgdG8gc2V0IGEgZGVzaXJlZCBwaXhlbCByZXNvbHV0aW9uIHdoaWNoIGlzIGluIGJldHdlZW4uXHJcbiAgICAgKiBUaGlzIEFQSSB3aWxsIGRvIHRoZSBmb2xsb3dpbmc6XHJcbiAgICAgKiAgICAgMS4gU2V0IHZpZXdwb3J0J3Mgd2lkdGggdG8gdGhlIGRlc2lyZWQgd2lkdGggaW4gcGl4ZWxcclxuICAgICAqICAgICAyLiBTZXQgYm9keSB3aWR0aCB0byB0aGUgZXhhY3QgcGl4ZWwgcmVzb2x1dGlvblxyXG4gICAgICogICAgIDMuIFRoZSByZXNvbHV0aW9uIHBvbGljeSB3aWxsIGJlIHJlc2V0IHdpdGggZGVzaWduZWQgdmlldyBzaXplIGluIHBvaW50cy5cclxuICAgICAqIEB6aCDorr7nva7lrrnlmajvvIhjb250YWluZXLvvInpnIDopoHnmoTlg4/ntKDliIbovqjnjoflubbkuJTpgILphY3nm7jlupTliIbovqjnjofnmoTmuLjmiI/lhoXlrrnjgIJcclxuICAgICAqIEBwYXJhbSB3aWR0aCBEZXNpZ24gcmVzb2x1dGlvbiB3aWR0aC5cclxuICAgICAqIEBwYXJhbSBoZWlnaHQgRGVzaWduIHJlc29sdXRpb24gaGVpZ2h0LlxyXG4gICAgICogQHBhcmFtIHJlc29sdXRpb25Qb2xpY3kgVGhlIHJlc29sdXRpb24gcG9saWN5IGRlc2lyZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFJlYWxQaXhlbFJlc29sdXRpb24gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCByZXNvbHV0aW9uUG9saWN5OiBSZXNvbHV0aW9uUG9saWN5fG51bWJlcikge1xyXG4gICAgICAgIGlmICghSlNCICYmICFSVU5USU1FX0JBU0VEICYmICFNSU5JR0FNRSkge1xyXG4gICAgICAgICAgICAvLyBTZXQgdmlld3BvcnQncyB3aWR0aFxyXG4gICAgICAgICAgICB0aGlzLl9zZXRWaWV3cG9ydE1ldGEoe3dpZHRofSwgdHJ1ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgYm9keSB3aWR0aCB0byB0aGUgZXhhY3QgcGl4ZWwgcmVzb2x1dGlvblxyXG4gICAgICAgICAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuc3R5bGUubGVmdCA9ICcwcHgnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gUmVzZXQgdGhlIHJlc29sdXRpb24gc2l6ZSBhbmQgcG9saWN5XHJcbiAgICAgICAgdGhpcy5zZXREZXNpZ25SZXNvbHV0aW9uU2l6ZSh3aWR0aCwgaGVpZ2h0LCByZXNvbHV0aW9uUG9saWN5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSB2aWV3IHBvcnQgcmVjdGFuZ2xlLlxyXG4gICAgICogQHpoIOi/lOWbnuinhueql+WJquijgeWMuuWfn+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Vmlld3BvcnRSZWN0ICgpOiBSZWN0IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdmlld3BvcnRSZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgc2NhbGUgZmFjdG9yIG9mIHRoZSBob3Jpem9udGFsIGRpcmVjdGlvbiAoWCBheGlzKS5cclxuICAgICAqIEB6aCDov5Tlm57mqKrovbTnmoTnvKnmlL7mr5TvvIzov5nkuKrnvKnmlL7mr5TmmK/lsIbnlLvluIPlg4/ntKDliIbovqjnjofmlL7liLDorr7orqHliIbovqjnjofnmoTmr5TkvovjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjYWxlWCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NhbGVYO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgc2NhbGUgZmFjdG9yIG9mIHRoZSB2ZXJ0aWNhbCBkaXJlY3Rpb24gKFkgYXhpcykuXHJcbiAgICAgKiBAemgg6L+U5Zue57q16L2055qE57yp5pS+5q+U77yM6L+Z5Liq57yp5pS+5q+U5piv5bCG55S75biD5YOP57Sg5YiG6L6o546H57yp5pS+5Yiw6K6+6K6h5YiG6L6o546H55qE5q+U5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTY2FsZVkgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlWTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGRldmljZSBwaXhlbCByYXRpbyBmb3IgcmV0aW5hIGRpc3BsYXkuXHJcbiAgICAgKiBAemgg6L+U5Zue6K6+5aSH5oiW5rWP6KeI5Zmo5YOP57Sg5q+U5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXREZXZpY2VQaXhlbFJhdGlvICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIHJlYWwgbG9jYXRpb24gaW4gdmlldyBmb3IgYSB0cmFuc2xhdGlvbiBiYXNlZCBvbiBhIHJlbGF0ZWQgcG9zaXRpb25cclxuICAgICAqIEB6aCDlsIblsY/luZXlnZDmoIfovazmjaLkuLrmuLjmiI/op4blm77kuIvnmoTlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSB0eCAtIFRoZSBYIGF4aXMgdHJhbnNsYXRpb25cclxuICAgICAqIEBwYXJhbSB0eSAtIFRoZSBZIGF4aXMgdHJhbnNsYXRpb25cclxuICAgICAqIEBwYXJhbSByZWxhdGVkUG9zIC0gVGhlIHJlbGF0ZWQgcG9zaXRpb24gb2JqZWN0IGluY2x1ZGluZyBcImxlZnRcIiwgXCJ0b3BcIiwgXCJ3aWR0aFwiLCBcImhlaWdodFwiIGluZm9ybWF0aW9uc1xyXG4gICAgICogQHBhcmFtIG91dCAtIFRoZSBvdXQgb2JqZWN0IHRvIHNhdmUgdGhlIGNvbnZlcnNpb24gcmVzdWx0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb252ZXJ0VG9Mb2NhdGlvbkluVmlldyAodHg6IG51bWJlciwgdHk6IG51bWJlciwgcmVsYXRlZFBvczogYW55LCBvdXQ6IFZlYzIpOiBWZWMyIHtcclxuICAgICAgICBjb25zdCByZXN1bHQgPSBvdXQgfHwgbmV3IFZlYzIoKTtcclxuICAgICAgICBjb25zdCB4ID0gdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyAqICh0eCAtIHJlbGF0ZWRQb3MubGVmdCk7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuX2RldmljZVBpeGVsUmF0aW8gKiAocmVsYXRlZFBvcy50b3AgKyByZWxhdGVkUG9zLmhlaWdodCAtIHR5KTtcclxuICAgICAgICBpZiAodGhpcy5faXNSb3RhdGVkKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC54ID0gbGVnYWN5Q0MuZ2FtZS5jYW52YXMud2lkdGggLSB5O1xyXG4gICAgICAgICAgICByZXN1bHQueSA9IHg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXN1bHQueCA9IHg7XHJcbiAgICAgICAgICAgIHJlc3VsdC55ID0geTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBfY29udmVydE1vdXNlVG9Mb2NhdGlvbkluVmlldyAoaW5fb3V0X3BvaW50LCByZWxhdGVkUG9zKSB7XHJcbiAgICAvLyAgICAgdmFyIHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0LCBfdCA9IHRoaXM7XHJcbiAgICAvLyAgICAgaW5fb3V0X3BvaW50LnggPSAoKF90Ll9kZXZpY2VQaXhlbFJhdGlvICogKGluX291dF9wb2ludC54IC0gcmVsYXRlZFBvcy5sZWZ0KSkgLSB2aWV3cG9ydC54KSAvIF90Ll9zY2FsZVg7XHJcbiAgICAvLyAgICAgaW5fb3V0X3BvaW50LnkgPSAoX3QuX2RldmljZVBpeGVsUmF0aW8gKiAocmVsYXRlZFBvcy50b3AgKyByZWxhdGVkUG9zLmhlaWdodCAtIGluX291dF9wb2ludC55KSAtIHZpZXdwb3J0LnkpIC8gX3QuX3NjYWxlWTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb252ZXJ0UG9pbnRXaXRoU2NhbGUgKHBvaW50KSB7XHJcbiAgICAgICAgY29uc3Qgdmlld3BvcnQgPSB0aGlzLl92aWV3cG9ydFJlY3Q7XHJcbiAgICAgICAgcG9pbnQueCA9IChwb2ludC54IC0gdmlld3BvcnQueCkgLyB0aGlzLl9zY2FsZVg7XHJcbiAgICAgICAgcG9pbnQueSA9IChwb2ludC55IC0gdmlld3BvcnQueSkgLyB0aGlzLl9zY2FsZVk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVzaXplIGhlbHBlciBmdW5jdGlvbnNcclxuICAgIHByaXZhdGUgX3Jlc2l6ZUV2ZW50ICgpIHtcclxuICAgICAgICBjb25zdCBfdmlldyA9IGxlZ2FjeUNDLnZpZXc7XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGZyYW1lIHNpemUgY2hhbmdlZCBvciBub3RcclxuICAgICAgICBjb25zdCBwcmV2RnJhbWVXID0gX3ZpZXcuX2ZyYW1lU2l6ZS53aWR0aDtcclxuICAgICAgICBjb25zdCBwcmV2RnJhbWVIID0gX3ZpZXcuX2ZyYW1lU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3QgcHJldlJvdGF0ZWQgPSBfdmlldy5faXNSb3RhdGVkO1xyXG4gICAgICAgIGlmIChsZWdhY3lDQy5zeXMuaXNNb2JpbGUpIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyU3R5bGUgPSBsZWdhY3lDQy5nYW1lLmNvbnRhaW5lci5zdHlsZTtcclxuICAgICAgICAgICAgY29uc3QgbWFyZ2luID0gY29udGFpbmVyU3R5bGUubWFyZ2luO1xyXG4gICAgICAgICAgICBjb250YWluZXJTdHlsZS5tYXJnaW4gPSAnMCc7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIF92aWV3Ll9pbml0RnJhbWVTaXplKCk7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9IG1hcmdpbjtcclxuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBfdmlldy5faW5pdEZyYW1lU2l6ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFKU0IgJiYgIVJVTlRJTUVfQkFTRUQgJiYgIV92aWV3Ll9vcmllbnRhdGlvbkNoYW5naW5nICYmIF92aWV3Ll9pc1JvdGF0ZWQgPT09IHByZXZSb3RhdGVkICYmIF92aWV3Ll9mcmFtZVNpemUud2lkdGggPT09IHByZXZGcmFtZVcgJiYgX3ZpZXcuX2ZyYW1lU2l6ZS5oZWlnaHQgPT09IHByZXZGcmFtZUgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRnJhbWUgc2l6ZSBjaGFuZ2VkLCBkbyByZXNpemUgd29ya3NcclxuICAgICAgICBjb25zdCB3aWR0aCA9IF92aWV3Ll9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLndpZHRoO1xyXG4gICAgICAgIGNvbnN0IGhlaWdodCA9IF92aWV3Ll9vcmlnaW5hbERlc2lnblJlc29sdXRpb25TaXplLmhlaWdodDtcclxuXHJcbiAgICAgICAgX3ZpZXcuX3Jlc2l6aW5nID0gdHJ1ZTtcclxuICAgICAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgICAgICAgIF92aWV3LnNldERlc2lnblJlc29sdXRpb25TaXplKHdpZHRoLCBoZWlnaHQsIF92aWV3Ll9yZXNvbHV0aW9uUG9saWN5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgX3ZpZXcuX3Jlc2l6aW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgIF92aWV3LmVtaXQoJ2NhbnZhcy1yZXNpemUnKTtcclxuICAgICAgICBpZiAoX3ZpZXcuX3Jlc2l6ZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIF92aWV3Ll9yZXNpemVDYWxsYmFjay5jYWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX29yaWVudGF0aW9uQ2hhbmdlICgpIHtcclxuICAgICAgICBsZWdhY3lDQy52aWV3Ll9vcmllbnRhdGlvbkNoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICBsZWdhY3lDQy52aWV3Ll9yZXNpemVFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXRGcmFtZVNpemUgKCkge1xyXG4gICAgICAgIGNvbnN0IGxvY0ZyYW1lU2l6ZSA9IHRoaXMuX2ZyYW1lU2l6ZTtcclxuICAgICAgICBjb25zdCB3ID0gX19Ccm93c2VyR2V0dGVyLmF2YWlsV2lkdGgobGVnYWN5Q0MuZ2FtZS5mcmFtZSk7XHJcbiAgICAgICAgY29uc3QgaCA9IF9fQnJvd3NlckdldHRlci5hdmFpbEhlaWdodChsZWdhY3lDQy5nYW1lLmZyYW1lKTtcclxuICAgICAgICBjb25zdCBpc0xhbmRzY2FwZTogQm9vbGVhbiA9IHcgPj0gaDtcclxuXHJcbiAgICAgICAgaWYgKEVESVRPUiB8fCAhbGVnYWN5Q0Muc3lzLmlzTW9iaWxlIHx8XHJcbiAgICAgICAgICAgIChpc0xhbmRzY2FwZSAmJiB0aGlzLl9vcmllbnRhdGlvbiAmIGxlZ2FjeUNDLm1hY3JvLk9SSUVOVEFUSU9OX0xBTkRTQ0FQRSkgfHxcclxuICAgICAgICAgICAgKCFpc0xhbmRzY2FwZSAmJiB0aGlzLl9vcmllbnRhdGlvbiAmIGxlZ2FjeUNDLm1hY3JvLk9SSUVOVEFUSU9OX1BPUlRSQUlUKSkge1xyXG4gICAgICAgICAgICBsb2NGcmFtZVNpemUud2lkdGggPSB3O1xyXG4gICAgICAgICAgICBsb2NGcmFtZVNpemUuaGVpZ2h0ID0gaDtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jb250YWluZXIuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSAncm90YXRlKDBkZWcpJztcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jb250YWluZXIuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUm90YXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbG9jRnJhbWVTaXplLndpZHRoID0gaDtcclxuICAgICAgICAgICAgbG9jRnJhbWVTaXplLmhlaWdodCA9IHc7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuY29udGFpbmVyLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybSddID0gJ3JvdGF0ZSg5MGRlZyknO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLmNvbnRhaW5lci5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKDkwZGVnKSc7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuY29udGFpbmVyLnN0eWxlWyctd2Via2l0LXRyYW5zZm9ybS1vcmlnaW4nXSA9ICcwcHggMHB4IDBweCc7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuY29udGFpbmVyLnN0eWxlLnRyYW5zZm9ybU9yaWdpbiA9ICcwcHggMHB4IDBweCc7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUm90YXRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBGaXggZm9yIGlzc3VlOiBodHRwczovL2dpdGh1Yi5jb20vY29jb3MtY3JlYXRvci9maXJlYmFsbC9pc3N1ZXMvODM2NVxyXG4gICAgICAgICAgICAvLyBSZWZlcmVuY2U6IGh0dHBzOi8vd3d3LmRvdWJhbi5jb20vbm90ZS8zNDM0MDI1NTQvXHJcbiAgICAgICAgICAgIC8vIEZvciBDaHJvbWUsIHotaW5kZXggbm90IHdvcmtpbmcgYWZ0ZXIgY29udGFpbmVyIHRyYW5zZm9ybSByb3RhdGUgOTBkZWcuXHJcbiAgICAgICAgICAgIC8vIEJlY2F1c2UgJ3RyYW5zZm9ybScgc3R5bGUgYWRkcyBjYW52YXMgKHRoZSB0b3AtZWxlbWVudCBvZiBjb250YWluZXIpIHRvIGEgbmV3IHN0YWNrIGNvbnRleHQuXHJcbiAgICAgICAgICAgIC8vIFRoYXQgY2F1c2VzIHRoZSBET00gSW5wdXQgd2FzIGhpZGRlbiB1bmRlciBjYW52YXMuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgc2hvdWxkIGJlIGRvbmUgYWZ0ZXIgY29udGFpbmVyIHJvdGF0ZWQsIGluc3RlYWQgb2YgaW4gc3R5bGUtbW9iaWxlLmNzcy5cclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuc3R5bGVbJy13ZWJraXQtdHJhbnNmb3JtJ10gPSAndHJhbnNsYXRlWigwcHgpJztcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZVooMHB4KSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9vcmllbnRhdGlvbkNoYW5naW5nKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0Mudmlldy5fb3JpZW50YXRpb25DaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaGFja1xyXG4gICAgcHJpdmF0ZSBfYWRqdXN0U2l6ZUtlZXBDYW52YXNTaXplICgpIHtcclxuICAgICAgICBjb25zdCBkZXNpZ25XaWR0aCA9IHRoaXMuX29yaWdpbmFsRGVzaWduUmVzb2x1dGlvblNpemUud2lkdGg7XHJcbiAgICAgICAgY29uc3QgZGVzaWduSGVpZ2h0ID0gdGhpcy5fb3JpZ2luYWxEZXNpZ25SZXNvbHV0aW9uU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgaWYgKGRlc2lnbldpZHRoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERlc2lnblJlc29sdXRpb25TaXplKGRlc2lnbldpZHRoLCBkZXNpZ25IZWlnaHQsIHRoaXMuX3Jlc29sdXRpb25Qb2xpY3kpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zZXRWaWV3cG9ydE1ldGEgKG1ldGFzLCBvdmVyd3JpdGUpIHtcclxuICAgICAgICBsZXQgdnAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29jb3NNZXRhRWxlbWVudCcpO1xyXG4gICAgICAgIGlmICh2cCAmJiBvdmVyd3JpdGUpIHtcclxuICAgICAgICAgICAgZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh2cCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCd2aWV3cG9ydCcpO1xyXG4gICAgICAgIGNvbnN0IGN1cnJlbnRWUCA9IGVsZW1zID8gZWxlbXNbMF0gOiBudWxsO1xyXG4gICAgICAgIGxldCBjb250ZW50O1xyXG4gICAgICAgIGxldCBrZXk7XHJcbiAgICAgICAgbGV0IHBhdHRlcm47XHJcblxyXG4gICAgICAgIGNvbnRlbnQgPSBjdXJyZW50VlAgPyBjdXJyZW50VlAuY29udGVudCA6ICcnO1xyXG4gICAgICAgIHZwID0gdnAgfHwgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbWV0YScpO1xyXG4gICAgICAgIHZwLmlkID0gJ2NvY29zTWV0YUVsZW1lbnQnO1xyXG4gICAgICAgIHZwLm5hbWUgPSAndmlld3BvcnQnO1xyXG4gICAgICAgIHZwLmNvbnRlbnQgPSAnJztcclxuXHJcbiAgICAgICAgZm9yIChrZXkgaW4gbWV0YXMpIHtcclxuICAgICAgICAgICAgaWYgKGNvbnRlbnQuaW5kZXhPZihrZXkpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgY29udGVudCArPSAnLCcgKyBrZXkgKyAnPScgKyBtZXRhc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG92ZXJ3cml0ZSkge1xyXG4gICAgICAgICAgICAgICAgcGF0dGVybiA9IG5ldyBSZWdFeHAoa2V5ICsgJ1xccyo9XFxzKlteLF0rJyk7XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnJlcGxhY2UocGF0dGVybiwga2V5ICsgJz0nICsgbWV0YXNba2V5XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKC9eLC8udGVzdChjb250ZW50KSkge1xyXG4gICAgICAgICAgICBjb250ZW50ID0gY29udGVudC5zdWJzdHIoMSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2cC5jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICAvLyBGb3IgYWRvcHRpbmcgY2VydGFpbiBhbmRyb2lkIGRldmljZXMgd2hpY2ggZG9uJ3Qgc3VwcG9ydCBzZWNvbmQgdmlld3BvcnRcclxuICAgICAgICBpZiAoY3VycmVudFZQKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRWUC5jb250ZW50ID0gY29udGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodnApO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2FkanVzdFZpZXdwb3J0TWV0YSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzQWRqdXN0Vmlld3BvcnQgJiYgIUpTQiAmJiAhUlVOVElNRV9CQVNFRCAmJiAhTUlOSUdBTUUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2V0Vmlld3BvcnRNZXRhKF9fQnJvd3NlckdldHRlci5tZXRhLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzQWRqdXN0Vmlld3BvcnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udmVydE1vdXNlVG9Mb2NhdGlvbiAoaW5fb3V0X3BvaW50LCByZWxhdGVkUG9zKXtcclxuICAgICAgICBpbl9vdXRfcG9pbnQueCA9IHRoaXMuX2RldmljZVBpeGVsUmF0aW8gKiAoaW5fb3V0X3BvaW50LnggLSByZWxhdGVkUG9zLmxlZnQpO1xyXG4gICAgICAgIGluX291dF9wb2ludC55ID0gdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyAqIChyZWxhdGVkUG9zLnRvcCArIHJlbGF0ZWRQb3MuaGVpZ2h0IC0gaW5fb3V0X3BvaW50LnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NvbnZlcnRUb3VjaFdpZHRoU2NhbGUgKHNlbFRvdWNoKXtcclxuICAgICAgICBjb25zdCB2aWV3cG9ydCA9IHRoaXMuX3ZpZXdwb3J0UmVjdDtcclxuICAgICAgICBjb25zdCBzY2FsZVggPSB0aGlzLl9zY2FsZVg7XHJcbiAgICAgICAgY29uc3Qgc2NhbGVZID0gdGhpcy5fc2NhbGVZO1xyXG5cclxuICAgICAgICBzZWxUb3VjaC5fcG9pbnQueCA9IChzZWxUb3VjaC5fcG9pbnQueCAtIHZpZXdwb3J0LngpIC8gc2NhbGVYO1xyXG4gICAgICAgIHNlbFRvdWNoLl9wb2ludC55ID0gKHNlbFRvdWNoLl9wb2ludC55IC0gdmlld3BvcnQueSkgLyBzY2FsZVk7XHJcbiAgICAgICAgc2VsVG91Y2guX3ByZXZQb2ludC54ID0gKHNlbFRvdWNoLl9wcmV2UG9pbnQueCAtIHZpZXdwb3J0LngpIC8gc2NhbGVYO1xyXG4gICAgICAgIHNlbFRvdWNoLl9wcmV2UG9pbnQueSA9IChzZWxUb3VjaC5fcHJldlBvaW50LnkgLSB2aWV3cG9ydC55KSAvIHNjYWxlWTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9jb252ZXJ0VG91Y2hlc1dpdGhTY2FsZSAodG91Y2hlcykge1xyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gdGhpcy5fdmlld3BvcnRSZWN0O1xyXG4gICAgICAgIGNvbnN0IHNjYWxlWCA9IHRoaXMuX3NjYWxlWDtcclxuICAgICAgICBjb25zdCBzY2FsZVkgPSB0aGlzLl9zY2FsZVk7XHJcbiAgICAgICAgbGV0IHNlbFBvaW50O1xyXG4gICAgICAgIGxldCBzZWxQcmVQb2ludDtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdWNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc2VsVG91Y2ggPSB0b3VjaGVzW2ldO1xyXG4gICAgICAgICAgICBzZWxQb2ludCA9IHNlbFRvdWNoLl9wb2ludDtcclxuICAgICAgICAgICAgc2VsUHJlUG9pbnQgPSBzZWxUb3VjaC5fcHJldlBvaW50O1xyXG5cclxuICAgICAgICAgICAgc2VsUG9pbnQueCA9IChzZWxQb2ludC54IC0gdmlld3BvcnQueCkgLyBzY2FsZVg7XHJcbiAgICAgICAgICAgIHNlbFBvaW50LnkgPSAoc2VsUG9pbnQueSAtIHZpZXdwb3J0LnkpIC8gc2NhbGVZO1xyXG4gICAgICAgICAgICBzZWxQcmVQb2ludC54ID0gKHNlbFByZVBvaW50LnggLSB2aWV3cG9ydC54KSAvIHNjYWxlWDtcclxuICAgICAgICAgICAgc2VsUHJlUG9pbnQueSA9IChzZWxQcmVQb2ludC55IC0gdmlld3BvcnQueSkgLyBzY2FsZVk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogIWVuXHJcbiAqIEVtaXQgd2hlbiBkZXNpZ24gcmVzb2x1dGlvbiBjaGFuZ2VkLlxyXG4gKiAhemhcclxuICog5b2T6K6+6K6h5YiG6L6o546H5pS55Y+Y5pe25Y+R6YCB44CCXHJcbiAqIEBldmVudCBkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkXHJcbiAqL1xyXG5cclxuaW50ZXJmYWNlIEFkYXB0UmVzdWx0IHtcclxuICAgIHNjYWxlOiBudW1iZXJbXTtcclxuICAgIHZpZXdwb3J0PzogbnVsbCB8IFJlY3Q7XHJcbn1cclxuXHJcbi8qKiBcclxuICogQ29udGFpbmVyU3RyYXRlZ3kgY2xhc3MgaXMgdGhlIHJvb3Qgc3RyYXRlZ3kgY2xhc3Mgb2YgY29udGFpbmVyJ3Mgc2NhbGUgc3RyYXRlZ3ksXHJcbiAqIGl0IGNvbnRyb2xzIHRoZSBiZWhhdmlvciBvZiBob3cgdG8gc2NhbGUgdGhlIGNjLmdhbWUuY29udGFpbmVyIGFuZCBjYy5nYW1lLmNhbnZhcyBvYmplY3RcclxuICovXHJcbmNsYXNzIENvbnRhaW5lclN0cmF0ZWd5IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgRVFVQUxfVE9fRlJBTUU6IGFueTtcclxuICAgIHB1YmxpYyBzdGF0aWMgUFJPUE9SVElPTl9UT19GUkFNRTogYW55O1xyXG5cclxuICAgIHB1YmxpYyBuYW1lOiBzdHJpbmcgPSAnQ29udGFpbmVyU3RyYXRlZ3knO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIE1hbmlwdWxhdGlvbiBiZWZvcmUgYXBwbGluZyB0aGUgc3RyYXRlZ3lcclxuICAgICAqIEB6aCDlnKjlupTnlKjnrZbnlaXkuYvliY3nmoTmk43kvZxcclxuICAgICAqIEBwYXJhbSB2aWV3IC0gVGhlIHRhcmdldCB2aWV3XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcmVBcHBseSAoX3ZpZXc6IFZpZXcpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGdW5jdGlvbiB0byBhcHBseSB0aGlzIHN0cmF0ZWd5XHJcbiAgICAgKiBAemgg562W55Wl5bqU55So5pa55rOVXHJcbiAgICAgKiBAcGFyYW0gdmlld1xyXG4gICAgICogQHBhcmFtIGRlc2lnbmVkUmVzb2x1dGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwbHkgKF92aWV3OiBWaWV3LCBkZXNpZ25lZFJlc29sdXRpb246IFNpemUpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTWFuaXB1bGF0aW9uIGFmdGVyIGFwcGx5aW5nIHRoZSBzdHJhdGVneVxyXG4gICAgICogQHpoIOetlueVpeiwg+eUqOS5i+WQjueahOaTjeS9nFxyXG4gICAgICogQHBhcmFtIHZpZXcgIFRoZSB0YXJnZXQgdmlld1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcG9zdEFwcGx5IChfdmlldzogVmlldykge1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NldHVwQ29udGFpbmVyIChfdmlldywgdywgaCkge1xyXG4gICAgICAgIGNvbnN0IGxvY0NhbnZhcyA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGxvY0NvbnRhaW5lciA9IGxlZ2FjeUNDLmdhbWUuY29udGFpbmVyO1xyXG5cclxuICAgICAgICBpZiAobGVnYWN5Q0Muc3lzLm9zID09PSBsZWdhY3lDQy5zeXMuT1NfQU5EUk9JRCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLndpZHRoID0gKF92aWV3Ll9pc1JvdGF0ZWQgPyBoIDogdykgKyAncHgnO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnN0eWxlLmhlaWdodCA9IChfdmlldy5faXNSb3RhdGVkID8gdyA6IGgpICsgJ3B4JztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gU2V0dXAgc3R5bGVcclxuICAgICAgICBsb2NDb250YWluZXIuc3R5bGUud2lkdGggPSBsb2NDYW52YXMuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcclxuICAgICAgICBsb2NDb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gbG9jQ2FudmFzLnN0eWxlLmhlaWdodCA9IGggKyAncHgnO1xyXG4gICAgICAgIC8vIFNldHVwIHBpeGVsIHJhdGlvIGZvciByZXRpbmEgZGlzcGxheVxyXG4gICAgICAgIGxldCBkZXZpY2VQaXhlbFJhdGlvID0gX3ZpZXcuX2RldmljZVBpeGVsUmF0aW8gPSAxO1xyXG4gICAgICAgIGlmIChfdmlldy5pc1JldGluYUVuYWJsZWQoKSkge1xyXG4gICAgICAgICAgICBkZXZpY2VQaXhlbFJhdGlvID0gX3ZpZXcuX2RldmljZVBpeGVsUmF0aW8gPSBNYXRoLm1pbihfdmlldy5fbWF4UGl4ZWxSYXRpbywgd2luZG93LmRldmljZVBpeGVsUmF0aW8gfHwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIFNldHVwIGNhbnZhc1xyXG4gICAgICAgIGxvY0NhbnZhcy53aWR0aCA9IHcgKiBkZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgIGxvY0NhbnZhcy5oZWlnaHQgPSBoICogZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ZpeENvbnRhaW5lciAoKSB7XHJcbiAgICAgICAgLy8gQWRkIGNvbnRhaW5lciB0byBkb2N1bWVudCBib2R5XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5pbnNlcnRCZWZvcmUobGVnYWN5Q0MuZ2FtZS5jb250YWluZXIsIGRvY3VtZW50LmJvZHkuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgLy8gU2V0IGJvZHkncyB3aWR0aCBoZWlnaHQgdG8gd2luZG93J3Mgc2l6ZSwgYW5kIGZvcmJpZCBvdmVyZmxvdywgc28gdGhhdCBnYW1lIHdpbGwgYmUgY2VudGVyZWRcclxuICAgICAgICBjb25zdCBicyA9IGRvY3VtZW50LmJvZHkuc3R5bGU7XHJcbiAgICAgICAgYnMud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCArICdweCc7XHJcbiAgICAgICAgYnMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICsgJ3B4JztcclxuICAgICAgICBicy5vdmVyZmxvdyA9ICdoaWRkZW4nO1xyXG4gICAgICAgIC8vIEJvZHkgc2l6ZSBzb2x1dGlvbiBkb2Vzbid0IHdvcmsgb24gYWxsIG1vYmlsZSBicm93c2VyIHNvIHRoaXMgaXMgdGhlIGFsZXRlcm5hdGl2ZTogZml4ZWQgY29udGFpbmVyXHJcbiAgICAgICAgY29uc3QgY29udFN0eWxlID0gbGVnYWN5Q0MuZ2FtZS5jb250YWluZXIuc3R5bGU7XHJcbiAgICAgICAgY29udFN0eWxlLnBvc2l0aW9uID0gJ2ZpeGVkJztcclxuICAgICAgICBjb250U3R5bGUubGVmdCA9IGNvbnRTdHlsZS50b3AgPSAnMHB4JztcclxuICAgICAgICAvLyBSZXBvc2l0aW9uIGJvZHlcclxuICAgICAgICBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCA9IDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogRW1pdCB3aGVuIGNhbnZhcyByZXNpemUuXHJcbiAqIEB6aFxyXG4gKiDlvZPnlLvluIPlpKflsI/mlLnlj5jml7blj5HpgIHjgIJcclxuICogQGV2ZW50IGNhbnZhcy1yZXNpemVcclxuICovXHJcblxyXG4vKipcclxuICogQ29udGVudFN0cmF0ZWd5IGNsYXNzIGlzIHRoZSByb290IHN0cmF0ZWd5IGNsYXNzIG9mIGNvbnRlbnQncyBzY2FsZSBzdHJhdGVneSxcclxuICogaXQgY29udHJvbHMgdGhlIGJlaGF2aW9yIG9mIGhvdyB0byBzY2FsZSB0aGUgc2NlbmUgYW5kIHNldHVwIHRoZSB2aWV3cG9ydCBmb3IgdGhlIGdhbWVcclxuICpcclxuICogQGNsYXNzIENvbnRlbnRTdHJhdGVneVxyXG4gKi9cclxuY2xhc3MgQ29udGVudFN0cmF0ZWd5IHtcclxuICAgIHB1YmxpYyBzdGF0aWMgRVhBQ1RfRklUOiBhbnk7XHJcbiAgICBwdWJsaWMgc3RhdGljIFNIT1dfQUxMOiBhbnk7XHJcbiAgICBwdWJsaWMgc3RhdGljIE5PX0JPUkRFUjogYW55O1xyXG4gICAgcHVibGljIHN0YXRpYyBGSVhFRF9IRUlHSFQ6IGFueTtcclxuICAgIHB1YmxpYyBzdGF0aWMgRklYRURfV0lEVEg6IGFueTtcclxuXHJcbiAgICBwdWJsaWMgbmFtZSA9ICdDb250ZW50U3RyYXRlZ3knO1xyXG4gICAgcHJpdmF0ZSBfcmVzdWx0OiBBZGFwdFJlc3VsdDtcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9yZXN1bHQgPSB7XHJcbiAgICAgICAgICAgIHNjYWxlOiBbMSwgMV0sXHJcbiAgICAgICAgICAgIHZpZXdwb3J0OiBudWxsLFxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWFuaXB1bGF0aW9uIGJlZm9yZSBhcHBseWluZyB0aGUgc3RyYXRlZ3lcclxuICAgICAqIEB6aCDnrZbnlaXlupTnlKjliY3nmoTmk43kvZxcclxuICAgICAqIEBwYXJhbSB2aWV3IC0gVGhlIHRhcmdldCB2aWV3XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwcmVBcHBseSAoX3ZpZXc6IFZpZXcpIHtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGdW5jdGlvbiB0byBhcHBseSB0aGlzIHN0cmF0ZWd5XHJcbiAgICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIHtzY2FsZTogW3NjYWxlWCwgc2NhbGVZXSwgdmlld3BvcnQ6IHtuZXcgUmVjdH19LFxyXG4gICAgICogVGhlIHRhcmdldCB2aWV3IGNhbiB0aGVuIGFwcGx5IHRoZXNlIHZhbHVlIHRvIGl0c2VsZiwgaXQncyBwcmVmZXJyZWQgbm90IHRvIG1vZGlmeSBkaXJlY3RseSBpdHMgcHJpdmF0ZSB2YXJpYWJsZXNcclxuICAgICAqIEB6aCDosIPnlKjnrZbnlaXmlrnms5VcclxuICAgICAqIEByZXR1cm4gVGhlIHJlc3VsdCBzY2FsZSBhbmQgdmlld3BvcnQgcmVjdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwbHkgKF92aWV3OiBWaWV3LCBkZXNpZ25lZFJlc29sdXRpb246IFNpemUpOiBBZGFwdFJlc3VsdCB7XHJcbiAgICAgICAgcmV0dXJuIHtzY2FsZTogWzEsIDFdfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNYW5pcHVsYXRpb24gYWZ0ZXIgYXBwbHlpbmcgdGhlIHN0cmF0ZWd5XHJcbiAgICAgKiBAemgg562W55Wl6LCD55So5LmL5ZCO55qE5pON5L2cXHJcbiAgICAgKiBAcGFyYW0gdmlldyAtIFRoZSB0YXJnZXQgdmlld1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcG9zdEFwcGx5IChfdmlldzogVmlldykge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfYnVpbGRSZXN1bHQgKGNvbnRhaW5lclcsIGNvbnRhaW5lckgsIGNvbnRlbnRXLCBjb250ZW50SCwgc2NhbGVYLCBzY2FsZVkpOiBBZGFwdFJlc3VsdCB7XHJcbiAgICAgICAgLy8gTWFrZXMgY29udGVudCBmaXQgYmV0dGVyIHRoZSBjYW52YXNcclxuICAgICAgICBpZiAoIE1hdGguYWJzKGNvbnRhaW5lclcgLSBjb250ZW50VykgPCAyICkge1xyXG4gICAgICAgICAgICBjb250ZW50VyA9IGNvbnRhaW5lclc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICggTWF0aC5hYnMoY29udGFpbmVySCAtIGNvbnRlbnRIKSA8IDIgKSB7XHJcbiAgICAgICAgICAgIGNvbnRlbnRIID0gY29udGFpbmVySDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXdwb3J0ID0gbmV3IFJlY3QoTWF0aC5yb3VuZCgoY29udGFpbmVyVyAtIGNvbnRlbnRXKSAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTWF0aC5yb3VuZCgoY29udGFpbmVySCAtIGNvbnRlbnRIKSAvIDIpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFcsIGNvbnRlbnRIKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVzdWx0LnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcclxuICAgICAgICB0aGlzLl9yZXN1bHQudmlld3BvcnQgPSB2aWV3cG9ydDtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcmVzdWx0O1xyXG4gICAgfVxyXG59XHJcblxyXG4oKCkgPT4ge1xyXG4vLyBDb250YWluZXIgc2NhbGUgc3RyYXRlZ3lzXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBFcXVhbFRvRnJhbWVcclxuICAgICAqIEBleHRlbmRzIENvbnRhaW5lclN0cmF0ZWd5XHJcbiAgICAgKi9cclxuICAgIGNsYXNzIEVxdWFsVG9GcmFtZSBleHRlbmRzIENvbnRhaW5lclN0cmF0ZWd5IHtcclxuICAgICAgICBwdWJsaWMgbmFtZSA9ICdFcXVhbFRvRnJhbWUnO1xyXG4gICAgICAgIHB1YmxpYyBhcHBseSAoX3ZpZXcpIHtcclxuICAgICAgICAgICAgY29uc3QgZnJhbWVIID0gX3ZpZXcuX2ZyYW1lU2l6ZS5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclN0eWxlID0gbGVnYWN5Q0MuZ2FtZS5jb250YWluZXIuc3R5bGU7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldHVwQ29udGFpbmVyKF92aWV3LCBfdmlldy5fZnJhbWVTaXplLndpZHRoLCBfdmlldy5fZnJhbWVTaXplLmhlaWdodCk7XHJcbiAgICAgICAgICAgIC8vIFNldHVwIGNvbnRhaW5lcidzIG1hcmdpbiBhbmQgcGFkZGluZ1xyXG4gICAgICAgICAgICBpZiAoX3ZpZXcuX2lzUm90YXRlZCkge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUubWFyZ2luID0gJzAgMCAwICcgKyBmcmFtZUggKyAncHgnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZyA9ICcwcHgnO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBjbGFzcyBQcm9wb3J0aW9uYWxUb0ZyYW1lXHJcbiAgICAgKiBAZXh0ZW5kcyBDb250YWluZXJTdHJhdGVneVxyXG4gICAgICovXHJcbiAgICBjbGFzcyBQcm9wb3J0aW9uYWxUb0ZyYW1lIGV4dGVuZHMgQ29udGFpbmVyU3RyYXRlZ3kge1xyXG4gICAgICAgIHB1YmxpYyBuYW1lID0gJ1Byb3BvcnRpb25hbFRvRnJhbWUnO1xyXG4gICAgICAgIHB1YmxpYyBhcHBseSAoX3ZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbikge1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZVcgPSBfdmlldy5fZnJhbWVTaXplLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBmcmFtZUggPSBfdmlldy5fZnJhbWVTaXplLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyU3R5bGUgPSBsZWdhY3lDQy5nYW1lLmNvbnRhaW5lci5zdHlsZTtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduVyA9IGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWCA9IGZyYW1lVyAvIGRlc2lnblc7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWSA9IGZyYW1lSCAvIGRlc2lnbkg7XHJcbiAgICAgICAgICAgIGxldCBjb250YWluZXJXO1xyXG4gICAgICAgICAgICBsZXQgY29udGFpbmVySDtcclxuXHJcbiAgICAgICAgICAgIHNjYWxlWCA8IHNjYWxlWSA/IChjb250YWluZXJXID0gZnJhbWVXLCBjb250YWluZXJIID0gZGVzaWduSCAqIHNjYWxlWCkgOiAoY29udGFpbmVyVyA9IGRlc2lnblcgKiBzY2FsZVksIGNvbnRhaW5lckggPSBmcmFtZUgpO1xyXG5cclxuICAgICAgICAgICAgLy8gQWRqdXN0IGNvbnRhaW5lciBzaXplIHdpdGggaW50ZWdlciB2YWx1ZVxyXG4gICAgICAgICAgICBjb25zdCBvZmZ4ID0gTWF0aC5yb3VuZCgoZnJhbWVXIC0gY29udGFpbmVyVykgLyAyKTtcclxuICAgICAgICAgICAgY29uc3Qgb2ZmeSA9IE1hdGgucm91bmQoKGZyYW1lSCAtIGNvbnRhaW5lckgpIC8gMik7XHJcbiAgICAgICAgICAgIGNvbnRhaW5lclcgPSBmcmFtZVcgLSAyICogb2ZmeDtcclxuICAgICAgICAgICAgY29udGFpbmVySCA9IGZyYW1lSCAtIDIgKiBvZmZ5O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fc2V0dXBDb250YWluZXIoX3ZpZXcsIGNvbnRhaW5lclcsIGNvbnRhaW5lckgpO1xyXG4gICAgICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICAgICAgLy8gU2V0dXAgY29udGFpbmVyJ3MgbWFyZ2luIGFuZCBwYWRkaW5nXHJcbiAgICAgICAgICAgICAgICBpZiAoX3ZpZXcuX2lzUm90YXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwIDAgMCAnICsgZnJhbWVIICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ0xlZnQgPSBvZmZ4ICsgJ3B4JztcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lclN0eWxlLnBhZGRpbmdSaWdodCA9IG9mZnggKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ1RvcCA9IG9mZnkgKyAncHgnO1xyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyU3R5bGUucGFkZGluZ0JvdHRvbSA9IG9mZnkgKyAncHgnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIG5lZWQgdG8gYWRhcHQgcHJvdG90eXBlIGJlZm9yZSBpbnN0YW50aWF0aW5nXHJcbiAgICAvLyBAdHMtaWdub3JlXHJcbiAgICBjb25zdCBfZ2xvYmFsID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgPyBnbG9iYWwgOiB3aW5kb3c7XHJcbiAgICBjb25zdCBnbG9iYWxBZGFwdGVyID0gX2dsb2JhbC5fX2dsb2JhbEFkYXB0ZXI7XHJcbiAgICBpZiAoZ2xvYmFsQWRhcHRlcikge1xyXG4gICAgICAgIGlmIChnbG9iYWxBZGFwdGVyLmFkYXB0Q29udGFpbmVyU3RyYXRlZ3kpIHtcclxuICAgICAgICAgICAgZ2xvYmFsQWRhcHRlci5hZGFwdENvbnRhaW5lclN0cmF0ZWd5KENvbnRhaW5lclN0cmF0ZWd5LnByb3RvdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChnbG9iYWxBZGFwdGVyLmFkYXB0Vmlldykge1xyXG4gICAgICAgICAgICBnbG9iYWxBZGFwdGVyLmFkYXB0VmlldyhWaWV3LnByb3RvdHlwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuLy8gQWxpYXM6IFN0cmF0ZWd5IHRoYXQgbWFrZXMgdGhlIGNvbnRhaW5lcidzIHNpemUgZXF1YWxzIHRvIHRoZSBmcmFtZSdzIHNpemVcclxuICAgIENvbnRhaW5lclN0cmF0ZWd5LkVRVUFMX1RPX0ZSQU1FID0gbmV3IEVxdWFsVG9GcmFtZSgpO1xyXG4vLyBBbGlhczogU3RyYXRlZ3kgdGhhdCBzY2FsZSBwcm9wb3J0aW9uYWxseSB0aGUgY29udGFpbmVyJ3Mgc2l6ZSB0byBmcmFtZSdzIHNpemVcclxuICAgIENvbnRhaW5lclN0cmF0ZWd5LlBST1BPUlRJT05fVE9fRlJBTUUgPSBuZXcgUHJvcG9ydGlvbmFsVG9GcmFtZSgpO1xyXG5cclxuLy8gQ29udGVudCBzY2FsZSBzdHJhdGVneXNcclxuICAgIGNsYXNzIEV4YWN0Rml0IGV4dGVuZHMgQ29udGVudFN0cmF0ZWd5IHtcclxuICAgICAgICBwdWJsaWMgbmFtZSA9ICdFeGFjdEZpdCc7XHJcbiAgICAgICAgcHVibGljIGFwcGx5IChfdmlldzogVmlldywgZGVzaWduZWRSZXNvbHV0aW9uOiBTaXplKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclcgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVySCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3Qgc2NhbGVYID0gY29udGFpbmVyVyAvIGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aDtcclxuICAgICAgICAgICAgY29uc3Qgc2NhbGVZID0gY29udGFpbmVySCAvIGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGFpbmVyVywgY29udGFpbmVySCwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjbGFzcyBTaG93QWxsIGV4dGVuZHMgQ29udGVudFN0cmF0ZWd5IHtcclxuICAgICAgICBwdWJsaWMgbmFtZSA9ICdTaG93QWxsJztcclxuICAgICAgICBwdWJsaWMgYXBwbHkgKF92aWV3LCBkZXNpZ25lZFJlc29sdXRpb24pIHtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVyVyA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBjb250YWluZXJIID0gbGVnYWN5Q0MuZ2FtZS5jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgICAgICBjb25zdCBkZXNpZ25XID0gZGVzaWduZWRSZXNvbHV0aW9uLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBkZXNpZ25IID0gZGVzaWduZWRSZXNvbHV0aW9uLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3Qgc2NhbGVYID0gY29udGFpbmVyVyAvIGRlc2lnblc7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWSA9IGNvbnRhaW5lckggLyBkZXNpZ25IO1xyXG4gICAgICAgICAgICBsZXQgc2NhbGUgPSAwO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudFc7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50SDtcclxuXHJcbiAgICAgICAgICAgIHNjYWxlWCA8IHNjYWxlWSA/IChzY2FsZSA9IHNjYWxlWCwgY29udGVudFcgPSBjb250YWluZXJXLCBjb250ZW50SCA9IGRlc2lnbkggKiBzY2FsZSlcclxuICAgICAgICAgICAgICAgIDogKHNjYWxlID0gc2NhbGVZLCBjb250ZW50VyA9IGRlc2lnblcgKiBzY2FsZSwgY29udGVudEggPSBjb250YWluZXJIKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250ZW50VywgY29udGVudEgsIHNjYWxlLCBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIE5vQm9yZGVyIGV4dGVuZHMgQ29udGVudFN0cmF0ZWd5IHtcclxuICAgICAgICBwdWJsaWMgbmFtZSA9ICdOb0JvcmRlcic7XHJcbiAgICAgICAgcHVibGljIGFwcGx5IChfdmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclcgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVySCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduVyA9IGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWCA9IGNvbnRhaW5lclcgLyBkZXNpZ25XO1xyXG4gICAgICAgICAgICBjb25zdCBzY2FsZVkgPSBjb250YWluZXJIIC8gZGVzaWduSDtcclxuICAgICAgICAgICAgbGV0IHNjYWxlO1xyXG4gICAgICAgICAgICBsZXQgY29udGVudFc7XHJcbiAgICAgICAgICAgIGxldCBjb250ZW50SDtcclxuXHJcbiAgICAgICAgICAgIHNjYWxlWCA8IHNjYWxlWSA/IChzY2FsZSA9IHNjYWxlWSwgY29udGVudFcgPSBkZXNpZ25XICogc2NhbGUsIGNvbnRlbnRIID0gY29udGFpbmVySClcclxuICAgICAgICAgICAgICAgIDogKHNjYWxlID0gc2NhbGVYLCBjb250ZW50VyA9IGNvbnRhaW5lclcsIGNvbnRlbnRIID0gZGVzaWduSCAqIHNjYWxlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9idWlsZFJlc3VsdChjb250YWluZXJXLCBjb250YWluZXJILCBjb250ZW50VywgY29udGVudEgsIHNjYWxlLCBzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNsYXNzIEZpeGVkSGVpZ2h0IGV4dGVuZHMgQ29udGVudFN0cmF0ZWd5IHtcclxuICAgICAgICBwdWJsaWMgbmFtZSA9ICdGaXhlZEhlaWdodCc7XHJcbiAgICAgICAgcHVibGljIGFwcGx5IChfdmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclcgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVySCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduSCA9IGRlc2lnbmVkUmVzb2x1dGlvbi5oZWlnaHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gY29udGFpbmVySCAvIGRlc2lnbkg7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRXID0gY29udGFpbmVyVztcclxuICAgICAgICAgICAgY29uc3QgY29udGVudEggPSBjb250YWluZXJIO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkUmVzdWx0KGNvbnRhaW5lclcsIGNvbnRhaW5lckgsIGNvbnRlbnRXLCBjb250ZW50SCwgc2NhbGUsIHNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY2xhc3MgRml4ZWRXaWR0aCBleHRlbmRzIENvbnRlbnRTdHJhdGVneSB7XHJcbiAgICAgICAgcHVibGljIG5hbWUgPSAnRml4ZWRXaWR0aCc7XHJcbiAgICAgICAgcHVibGljIGFwcGx5IChfdmlldywgZGVzaWduZWRSZXNvbHV0aW9uKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRhaW5lclcgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgY29udGFpbmVySCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLmhlaWdodDtcclxuICAgICAgICAgICAgY29uc3QgZGVzaWduVyA9IGRlc2lnbmVkUmVzb2x1dGlvbi53aWR0aDtcclxuICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBjb250YWluZXJXIC8gZGVzaWduVztcclxuICAgICAgICAgICAgY29uc3QgY29udGVudFcgPSBjb250YWluZXJXO1xyXG4gICAgICAgICAgICBjb25zdCBjb250ZW50SCA9IGNvbnRhaW5lckg7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYnVpbGRSZXN1bHQoY29udGFpbmVyVywgY29udGFpbmVySCwgY29udGVudFcsIGNvbnRlbnRILCBzY2FsZSwgc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIHNpemUgdG8gY29udGFpbmVyJ3Mgc2l6ZSwgbm9uIHByb3BvcnRpb25hbFxyXG4gICAgQ29udGVudFN0cmF0ZWd5LkVYQUNUX0ZJVCA9IG5ldyBFeGFjdEZpdCgpO1xyXG4vLyBBbGlhczogU3RyYXRlZ3kgdG8gc2NhbGUgdGhlIGNvbnRlbnQncyBzaXplIHByb3BvcnRpb25hbGx5IHRvIG1heGltdW0gc2l6ZSBhbmQga2VlcHMgdGhlIHdob2xlIGNvbnRlbnQgYXJlYSB0byBiZSB2aXNpYmxlXHJcbiAgICBDb250ZW50U3RyYXRlZ3kuU0hPV19BTEwgPSBuZXcgU2hvd0FsbCgpO1xyXG4vLyBBbGlhczogU3RyYXRlZ3kgdG8gc2NhbGUgdGhlIGNvbnRlbnQncyBzaXplIHByb3BvcnRpb25hbGx5IHRvIGZpbGwgdGhlIHdob2xlIGNvbnRhaW5lciBhcmVhXHJcbiAgICBDb250ZW50U3RyYXRlZ3kuTk9fQk9SREVSID0gbmV3IE5vQm9yZGVyKCk7XHJcbi8vIEFsaWFzOiBTdHJhdGVneSB0byBzY2FsZSB0aGUgY29udGVudCdzIGhlaWdodCB0byBjb250YWluZXIncyBoZWlnaHQgYW5kIHByb3BvcnRpb25hbGx5IHNjYWxlIGl0cyB3aWR0aFxyXG4gICAgQ29udGVudFN0cmF0ZWd5LkZJWEVEX0hFSUdIVCA9IG5ldyBGaXhlZEhlaWdodCgpO1xyXG4vLyBBbGlhczogU3RyYXRlZ3kgdG8gc2NhbGUgdGhlIGNvbnRlbnQncyB3aWR0aCB0byBjb250YWluZXIncyB3aWR0aCBhbmQgcHJvcG9ydGlvbmFsbHkgc2NhbGUgaXRzIGhlaWdodFxyXG4gICAgQ29udGVudFN0cmF0ZWd5LkZJWEVEX1dJRFRIID0gbmV3IEZpeGVkV2lkdGgoKTtcclxuXHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogUmVzb2x1dGlvblBvbGljeSBjbGFzcyBpcyB0aGUgcm9vdCBzdHJhdGVneSBjbGFzcyBvZiBzY2FsZSBzdHJhdGVneSxcclxuICogaXRzIG1haW4gdGFzayBpcyB0byBtYWludGFpbiB0aGUgY29tcGF0aWJpbGl0eSB3aXRoIENvY29zMmQteDwvcD5cclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZXNvbHV0aW9uUG9saWN5IHtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGVudGlyZSBhcHBsaWNhdGlvbiBpcyB2aXNpYmxlIGluIHRoZSBzcGVjaWZpZWQgYXJlYSB3aXRob3V0IHRyeWluZyB0byBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgYXNwZWN0IHJhdGlvLjxici8+XHJcbiAgICAgKiBEaXN0b3J0aW9uIGNhbiBvY2N1ciwgYW5kIHRoZSBhcHBsaWNhdGlvbiBtYXkgYXBwZWFyIHN0cmV0Y2hlZCBvciBjb21wcmVzc2VkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEVYQUNUX0ZJVDogbnVtYmVyID0gMDtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGVudGlyZSBhcHBsaWNhdGlvbiBmaWxscyB0aGUgc3BlY2lmaWVkIGFyZWEsIHdpdGhvdXQgZGlzdG9ydGlvbiBidXQgcG9zc2libHkgd2l0aCBzb21lIGNyb3BwaW5nLDxici8+XHJcbiAgICAgKiB3aGlsZSBtYWludGFpbmluZyB0aGUgb3JpZ2luYWwgYXNwZWN0IHJhdGlvIG9mIHRoZSBhcHBsaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBOT19CT1JERVI6IG51bWJlciA9IDE7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBlbnRpcmUgYXBwbGljYXRpb24gaXMgdmlzaWJsZSBpbiB0aGUgc3BlY2lmaWVkIGFyZWEgd2l0aG91dCBkaXN0b3J0aW9uIHdoaWxlIG1haW50YWluaW5nIHRoZSBvcmlnaW5hbDxici8+XHJcbiAgICAgKiBhc3BlY3QgcmF0aW8gb2YgdGhlIGFwcGxpY2F0aW9uLiBCb3JkZXJzIGNhbiBhcHBlYXIgb24gdHdvIHNpZGVzIG9mIHRoZSBhcHBsaWNhdGlvbi5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBTSE9XX0FMTDogbnVtYmVyID0gMjtcclxuICAgIC8qKlxyXG4gICAgICogVGhlIGFwcGxpY2F0aW9uIHRha2VzIHRoZSBoZWlnaHQgb2YgdGhlIGRlc2lnbiByZXNvbHV0aW9uIHNpemUgYW5kIG1vZGlmaWVzIHRoZSB3aWR0aCBvZiB0aGUgaW50ZXJuYWw8YnIvPlxyXG4gICAgICogY2FudmFzIHNvIHRoYXQgaXQgZml0cyB0aGUgYXNwZWN0IHJhdGlvIG9mIHRoZSBkZXZpY2U8YnIvPlxyXG4gICAgICogbm8gZGlzdG9ydGlvbiB3aWxsIG9jY3VyIGhvd2V2ZXIgeW91IG11c3QgbWFrZSBzdXJlIHlvdXIgYXBwbGljYXRpb24gd29ya3Mgb24gZGlmZmVyZW50PGJyLz5cclxuICAgICAqIGFzcGVjdCByYXRpb3NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBGSVhFRF9IRUlHSFQ6IG51bWJlciA9IDM7XHJcbiAgICAvKipcclxuICAgICAqIFRoZSBhcHBsaWNhdGlvbiB0YWtlcyB0aGUgd2lkdGggb2YgdGhlIGRlc2lnbiByZXNvbHV0aW9uIHNpemUgYW5kIG1vZGlmaWVzIHRoZSBoZWlnaHQgb2YgdGhlIGludGVybmFsPGJyLz5cclxuICAgICAqIGNhbnZhcyBzbyB0aGF0IGl0IGZpdHMgdGhlIGFzcGVjdCByYXRpbyBvZiB0aGUgZGV2aWNlPGJyLz5cclxuICAgICAqIG5vIGRpc3RvcnRpb24gd2lsbCBvY2N1ciBob3dldmVyIHlvdSBtdXN0IG1ha2Ugc3VyZSB5b3VyIGFwcGxpY2F0aW9uIHdvcmtzIG9uIGRpZmZlcmVudDxici8+XHJcbiAgICAgKiBhc3BlY3QgcmF0aW9zXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgRklYRURfV0lEVEg6IG51bWJlciA9IDQ7XHJcbiAgICAvKipcclxuICAgICAqIFVua25vd24gcG9saWN5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgVU5LTk9XTjogbnVtYmVyID0gNTtcclxuICAgIHB1YmxpYyBzdGF0aWMgQ29udGFpbmVyU3RyYXRlZ3k6IHR5cGVvZiBDb250YWluZXJTdHJhdGVneSA9IENvbnRhaW5lclN0cmF0ZWd5O1xyXG4gICAgcHVibGljIHN0YXRpYyBDb250ZW50U3RyYXRlZ3k6IHR5cGVvZiBDb250ZW50U3RyYXRlZ3kgPSBDb250ZW50U3RyYXRlZ3k7XHJcblxyXG4gICAgcHVibGljIG5hbWUgPSAnUmVzb2x1dGlvblBvbGljeSc7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29udGFpbmVyU3RyYXRlZ3k6IG51bGwgfCBDb250YWluZXJTdHJhdGVneTtcclxuICAgIHByaXZhdGUgX2NvbnRlbnRTdHJhdGVneTogbnVsbCB8IENvbnRlbnRTdHJhdGVneTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yIG9mIFJlc29sdXRpb25Qb2xpY3lcclxuICAgICAqIEBwYXJhbSBjb250YWluZXJTdGdcclxuICAgICAqIEBwYXJhbSBjb250ZW50U3RnXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChjb250YWluZXJTdGc6IENvbnRhaW5lclN0cmF0ZWd5LCBjb250ZW50U3RnOiBDb250ZW50U3RyYXRlZ3kpIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY29udGVudFN0cmF0ZWd5ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnNldENvbnRhaW5lclN0cmF0ZWd5KGNvbnRhaW5lclN0Zyk7XHJcbiAgICAgICAgdGhpcy5zZXRDb250ZW50U3RyYXRlZ3koY29udGVudFN0Zyk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNhbnZhc1NpemUgKCkge1xyXG4gICAgICAgIHJldHVybiBsZWdhY3lDQy52MihsZWdhY3lDQy5nYW1lLmNhbnZhcy53aWR0aCwgbGVnYWN5Q0MuZ2FtZS5jYW52YXMuaGVpZ2h0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBNYW5pcHVsYXRpb24gYmVmb3JlIGFwcGx5aW5nIHRoZSByZXNvbHV0aW9uIHBvbGljeVxyXG4gICAgICogQHpoIOetlueVpeW6lOeUqOWJjeeahOaTjeS9nFxyXG4gICAgICogQHBhcmFtIF92aWV3IFRoZSB0YXJnZXQgdmlld1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJlQXBwbHkgKF92aWV3OiBWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyU3RyYXRlZ3khLnByZUFwcGx5KF92aWV3KTtcclxuICAgICAgICB0aGlzLl9jb250ZW50U3RyYXRlZ3khLnByZUFwcGx5KF92aWV3KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBGdW5jdGlvbiB0byBhcHBseSB0aGlzIHJlc29sdXRpb24gcG9saWN5XHJcbiAgICAgKiBUaGUgcmV0dXJuIHZhbHVlIGlzIHtzY2FsZTogW3NjYWxlWCwgc2NhbGVZXSwgdmlld3BvcnQ6IHtuZXcgUmVjdH19LFxyXG4gICAgICogVGhlIHRhcmdldCB2aWV3IGNhbiB0aGVuIGFwcGx5IHRoZXNlIHZhbHVlIHRvIGl0c2VsZiwgaXQncyBwcmVmZXJyZWQgbm90IHRvIG1vZGlmeSBkaXJlY3RseSBpdHMgcHJpdmF0ZSB2YXJpYWJsZXNcclxuICAgICAqIEB6aCDosIPnlKjnrZbnlaXmlrnms5VcclxuICAgICAqIEBwYXJhbSBfdmlldyAtIFRoZSB0YXJnZXQgdmlld1xyXG4gICAgICogQHBhcmFtIGRlc2lnbmVkUmVzb2x1dGlvbiAtIFRoZSB1c2VyIGRlZmluZWQgZGVzaWduIHJlc29sdXRpb25cclxuICAgICAqIEByZXR1cm4gQW4gb2JqZWN0IGNvbnRhaW5zIHRoZSBzY2FsZSBYL1kgdmFsdWVzIGFuZCB0aGUgdmlld3BvcnQgcmVjdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwbHkgKF92aWV3OiBWaWV3LCBkZXNpZ25lZFJlc29sdXRpb246IFNpemUpIHtcclxuICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneSEuYXBwbHkoX3ZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbik7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbnRlbnRTdHJhdGVneSEuYXBwbHkoX3ZpZXcsIGRlc2lnbmVkUmVzb2x1dGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTWFuaXB1bGF0aW9uIGFmdGVyIGFwcHlsaW5nIHRoZSBzdHJhdGVneVxyXG4gICAgICogQHpoIOetlueVpeW6lOeUqOS5i+WQjueahOaTjeS9nFxyXG4gICAgICogQHBhcmFtIF92aWV3IC0gVGhlIHRhcmdldCB2aWV3XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwb3N0QXBwbHkgKF92aWV3OiBWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fY29udGFpbmVyU3RyYXRlZ3khLnBvc3RBcHBseShfdmlldyk7XHJcbiAgICAgICAgdGhpcy5fY29udGVudFN0cmF0ZWd5IS5wb3N0QXBwbHkoX3ZpZXcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldHVwIHRoZSBjb250YWluZXIncyBzY2FsZSBzdHJhdGVneVxyXG4gICAgICogQHpoIOiuvue9ruWuueWZqOeahOmAgumFjeetlueVpVxyXG4gICAgICogQHBhcmFtIGNvbnRhaW5lclN0ZyBUaGUgY29udGFpbmVyIHN0cmF0ZWd5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRDb250YWluZXJTdHJhdGVneSAoY29udGFpbmVyU3RnOiBDb250YWluZXJTdHJhdGVneSkge1xyXG4gICAgICAgIGlmIChjb250YWluZXJTdGcgaW5zdGFuY2VvZiBDb250YWluZXJTdHJhdGVneSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb250YWluZXJTdHJhdGVneSA9IGNvbnRhaW5lclN0ZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0dXAgdGhlIGNvbnRlbnQncyBzY2FsZSBzdHJhdGVneVxyXG4gICAgICogQHpoIOiuvue9ruWGheWuueeahOmAgumFjeetlueVpVxyXG4gICAgICogQHBhcmFtIGNvbnRlbnRTdGcgVGhlIGNvbnRlbnQgc3RyYXRlZ3lcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldENvbnRlbnRTdHJhdGVneSAoY29udGVudFN0ZzogQ29udGVudFN0cmF0ZWd5KSB7XHJcbiAgICAgICAgaWYgKGNvbnRlbnRTdGcgaW5zdGFuY2VvZiBDb250ZW50U3RyYXRlZ3kpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGVudFN0cmF0ZWd5ID0gY29udGVudFN0ZztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxubGVnYWN5Q0MuUmVzb2x1dGlvblBvbGljeSA9IFJlc29sdXRpb25Qb2xpY3k7XHJcblxyXG4vKipcclxuICogQGVuIHZpZXcgaXMgdGhlIHNpbmdsZXRvbiB2aWV3IG9iamVjdC5cclxuICogQHpoIHZpZXcg5piv5YWo5bGA55qE6KeG5Zu+5Y2V5L6L5a+56LGh44CCXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgdmlldyA9IFZpZXcuaW5zdGFuY2UgPSBsZWdhY3lDQy52aWV3ID0gbmV3IFZpZXcoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gd2luU2l6ZSBpcyB0aGUgYWxpYXMgb2JqZWN0IGZvciB0aGUgc2l6ZSBvZiB0aGUgY3VycmVudCBnYW1lIHdpbmRvdy5cclxuICogQHpoIHdpblNpemUg5Li65b2T5YmN55qE5ri45oiP56qX5Y+j55qE5aSn5bCP44CCXHJcbiAqL1xyXG5sZWdhY3lDQy53aW5TaXplID0gbmV3IFNpemUoKTtcclxuIl19