(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/data/decorators/index.js", "../core/default-constants.js", "../core/components/ui-base/index.js", "../core/components/index.js", "./webview-impl-web.js", "./webview-enums.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/data/decorators/index.js"), require("../core/default-constants.js"), require("../core/components/ui-base/index.js"), require("../core/components/index.js"), require("./webview-impl-web.js"), require("./webview-enums.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.defaultConstants, global.index, global.index, global.webviewImplWeb, global.webviewEnums);
    global.webview = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _defaultConstants, _index2, _index3, _webviewImplWeb, _webviewEnums) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebView = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  /**
   * @en
   * WebView is a component for display web pages in the game.
   * Because different platforms have different authorization,
   * API and control methods for WebView component.
   * And have not yet formed a unified standard, only Web, iOS, and Android platforms are currently supported.
   * @zh
   * WebView 组件，用于在游戏中显示网页。
   * 由于不同平台对于 WebView 组件的授权、API、控制方式都不同，还没有形成统一的标准，所以目前只支持 Web、iOS 和 Android 平台。
   */
  var WebView = (_dec = (0, _index.ccclass)('cc.WebView'), _dec2 = (0, _index.help)('i18n:cc.WebView'), _dec3 = (0, _index.menu)('Components/WebView'), _dec4 = (0, _index.requireComponent)(_index2.UITransform), _dec5 = (0, _index.tooltip)('i18n:videoplayer.url'), _dec6 = (0, _index.type)([_index3.EventHandler]), _dec7 = (0, _index.displayOrder)(20), _dec8 = (0, _index.tooltip)('i18n:videoplayer.webviewEvents'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(WebView, _Component);

    function WebView() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebView);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebView)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_url", _descriptor, _assertThisInitialized(_this));

      _this._impl = null;

      _initializerDefineProperty(_this, "webviewEvents", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(WebView, [{
      key: "setJavascriptInterfaceScheme",

      /**
       * !#en
       * Set javascript interface scheme (see also setOnJSCallback). <br/>
       * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
       * Please refer to the official documentation for more details.
       * !#zh
       * 设置 JavaScript 接口方案（与 'setOnJSCallback' 配套使用）。<br/>
       * 注意：只支持 Android 和 iOS ，Web 端用法请前往官方文档查看。<br/>
       * 详情请参阅官方文档
       * @method setJavascriptInterfaceScheme
       * @param {String} scheme
       */
      value: function setJavascriptInterfaceScheme(scheme) {
        if (this._impl) {
          this._impl.setJavascriptInterfaceScheme(scheme);
        }
      }
      /**
       * !#en
       * This callback called when load URL that start with javascript
       * interface scheme (see also setJavascriptInterfaceScheme). <br/>
       * Note: Supports only on the Android and iOS. For HTML5, please refer to the official documentation.<br/>
       * Please refer to the official documentation for more details.
       * !#zh
       * 当加载 URL 以 JavaScript 接口方案开始时调用这个回调函数。<br/>
       * 注意：只支持 Android 和 iOS，Web 端用法请前往官方文档查看。
       * 详情请参阅官方文档
       * @method setOnJSCallback
       * @param {Function} callback
       */

    }, {
      key: "setOnJSCallback",
      value: function setOnJSCallback(callback) {
        if (this._impl) {
          this._impl.setOnJSCallback(callback);
        }
      }
      /**
       * !#en
       * Evaluates JavaScript in the context of the currently displayed page. <br/>
       * Please refer to the official document for more details <br/>
       * Note: Cross domain issues need to be resolved by yourself <br/>
       * !#zh
       * 执行 WebView 内部页面脚本（详情请参阅官方文档） <br/>
       * 注意：需要自行解决跨域问题
       * @method evaluateJS
       * @param {String} str
       */

    }, {
      key: "evaluateJS",
      value: function evaluateJS(str) {
        if (this._impl) {
          this._impl.evaluateJS(str);
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        if (_defaultConstants.EDITOR) {
          return;
        }

        this._impl = new _webviewImplWeb.WebViewImpl(this);

        this._impl.loadURL(this._url);

        this._impl.eventList.set(_webviewEnums.EventType.LOADING, this.onLoading.bind(this));

        this._impl.eventList.set(_webviewEnums.EventType.LOADED, this.onLoaded.bind(this));

        this._impl.eventList.set(_webviewEnums.EventType.ERROR, this.onError.bind(this));
      }
    }, {
      key: "onLoading",
      value: function onLoading() {
        _index3.EventHandler.emitEvents(this.webviewEvents, this, _webviewEnums.EventType.LOADING);

        this.node.emit('loading', this);
      }
    }, {
      key: "onLoaded",
      value: function onLoaded() {
        _index3.EventHandler.emitEvents(this.webviewEvents, this, _webviewEnums.EventType.LOADED);

        this.node.emit('loaded', this);
      }
    }, {
      key: "onError",
      value: function onError() {
        _index3.EventHandler.emitEvents(this.webviewEvents, this, _webviewEnums.EventType.ERROR);

        this.node.emit('error', this);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._impl) {
          this._impl.enable();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._impl) {
          this._impl.disable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._impl) {
          this._impl.destroy();

          this._impl = null;
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        if (this._impl) {
          this._impl.syncMatrix();
        }
      }
    }, {
      key: "url",

      /**
       * @en
       * A given URL to be loaded by the WebView, it should have a http or https prefix.
       * @zh
       * 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串
       */
      get: function get() {
        return this._url;
      },
      set: function set(val) {
        this._url = val;

        if (this._impl) {
          this._impl.loadURL(val);
        }
      }
      /**
       * @en
       * The webview's event callback , it will be triggered when certain webview event occurs.
       * @zh
       * WebView 的回调事件，当网页加载过程中，加载完成后或者加载出错时都会回调此函数
       */

    }, {
      key: "nativeWebView",

      /**
       * @en
       * Raw webview objects for user customization
       * @zh
       * 原始网页对象，用于用户定制
       */
      get: function get() {
        return this._impl && this._impl.webview || null;
      }
      /**
       * @en
       * Get current audio state.
       * @zh
       * 获取当前视频状态。
       */

    }, {
      key: "state",
      get: function get() {
        if (!this._impl) {
          return _webviewEnums.EventType.NONE;
        }

        return this._impl.state;
      }
    }]);

    return WebView;
  }(_index3.Component), _class3.EventType = _webviewEnums.EventType, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_url", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 'https://cocos.com';
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "url", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "url"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "webviewEvents", [_dec6, _dec7, _dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.WebView = WebView;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3dlYnZpZXcvd2Vidmlldy50cyJdLCJuYW1lcyI6WyJXZWJWaWV3IiwiVUlUcmFuc2Zvcm0iLCJDb21wb25lbnRFdmVudEhhbmRsZXIiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9pbXBsIiwic2NoZW1lIiwic2V0SmF2YXNjcmlwdEludGVyZmFjZVNjaGVtZSIsImNhbGxiYWNrIiwic2V0T25KU0NhbGxiYWNrIiwic3RyIiwiZXZhbHVhdGVKUyIsIkVESVRPUiIsIldlYlZpZXdJbXBsIiwibG9hZFVSTCIsIl91cmwiLCJldmVudExpc3QiLCJzZXQiLCJFdmVudFR5cGUiLCJMT0FESU5HIiwib25Mb2FkaW5nIiwiYmluZCIsIkxPQURFRCIsIm9uTG9hZGVkIiwiRVJST1IiLCJvbkVycm9yIiwiZW1pdEV2ZW50cyIsIndlYnZpZXdFdmVudHMiLCJub2RlIiwiZW1pdCIsImVuYWJsZSIsImRpc2FibGUiLCJkZXN0cm95IiwiZHQiLCJzeW5jTWF0cml4IiwidmFsIiwid2VidmlldyIsIk5PTkUiLCJzdGF0ZSIsIkNvbXBvbmVudCIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DQTs7Ozs7Ozs7OztNQWVhQSxPLFdBTFosb0JBQVEsWUFBUixDLFVBQ0EsaUJBQUssaUJBQUwsQyxVQUNBLGlCQUFLLG9CQUFMLEMsVUFDQSw2QkFBaUJDLG1CQUFqQixDLFVBb0JJLG9CQUFRLHNCQUFSLEMsVUFpQkEsaUJBQUssQ0FBQ0Msb0JBQUQsQ0FBTCxDLFVBQ0EseUJBQWEsRUFBYixDLFVBQ0Esb0JBQVEsZ0NBQVIsQyxpRUF0Q0pDLHdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFLYUMsSyxHQUE0QixJOzs7Ozs7Ozs7O0FBeUR0Qzs7Ozs7Ozs7Ozs7O21EQVlxQ0MsTSxFQUFnQjtBQUNqRCxZQUFJLEtBQUtELEtBQVQsRUFBZ0I7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LEtBQVYsRUFBaUI7QUFBRSxpQkFBT2Esd0JBQVVtQixJQUFqQjtBQUF3Qjs7QUFDM0MsZUFBTyxLQUFLaEMsS0FBTCxDQUFXaUMsS0FBbEI7QUFDSDs7OztJQTNEd0JDLGlCLFdBVVhyQixTLEdBQVlBLHVCLCtFQVR6QnNCLG1COzs7OzthQUNnQixtQjs7Ozs7OzthQW9DK0IsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvbXBvbmVudC93ZWJ2aWV3XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIG1lbnUsIHRvb2x0aXAsIHR5cGUsIGRpc3BsYXlPcmRlciwgc2VyaWFsaXphYmxlLCByZXF1aXJlQ29tcG9uZW50IH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgVUlUcmFuc2Zvcm0gfSBmcm9tICcuLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZSc7XHJcbmltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRIYW5kbGVyIGFzIENvbXBvbmVudEV2ZW50SGFuZGxlciB9IGZyb20gJy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IFdlYlZpZXdJbXBsIH0gZnJvbSAnLi93ZWJ2aWV3LWltcGwtd2ViJztcclxuaW1wb3J0IHsgRXZlbnRUeXBlIH0gZnJvbSAnLi93ZWJ2aWV3LWVudW1zJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogV2ViVmlldyBpcyBhIGNvbXBvbmVudCBmb3IgZGlzcGxheSB3ZWIgcGFnZXMgaW4gdGhlIGdhbWUuXHJcbiAqIEJlY2F1c2UgZGlmZmVyZW50IHBsYXRmb3JtcyBoYXZlIGRpZmZlcmVudCBhdXRob3JpemF0aW9uLFxyXG4gKiBBUEkgYW5kIGNvbnRyb2wgbWV0aG9kcyBmb3IgV2ViVmlldyBjb21wb25lbnQuXHJcbiAqIEFuZCBoYXZlIG5vdCB5ZXQgZm9ybWVkIGEgdW5pZmllZCBzdGFuZGFyZCwgb25seSBXZWIsIGlPUywgYW5kIEFuZHJvaWQgcGxhdGZvcm1zIGFyZSBjdXJyZW50bHkgc3VwcG9ydGVkLlxyXG4gKiBAemhcclxuICogV2ViVmlldyDnu4Tku7bvvIznlKjkuo7lnKjmuLjmiI/kuK3mmL7npLrnvZHpobXjgIJcclxuICog55Sx5LqO5LiN5ZCM5bmz5Y+w5a+55LqOIFdlYlZpZXcg57uE5Lu255qE5o6I5p2D44CBQVBJ44CB5o6n5Yi25pa55byP6YO95LiN5ZCM77yM6L+Y5rKh5pyJ5b2i5oiQ57uf5LiA55qE5qCH5YeG77yM5omA5Lul55uu5YmN5Y+q5pSv5oyBIFdlYuOAgWlPUyDlkowgQW5kcm9pZCDlubPlj7DjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5XZWJWaWV3JylcclxuQGhlbHAoJ2kxOG46Y2MuV2ViVmlldycpXHJcbkBtZW51KCdDb21wb25lbnRzL1dlYlZpZXcnKVxyXG5AcmVxdWlyZUNvbXBvbmVudChVSVRyYW5zZm9ybSlcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbmV4cG9ydCBjbGFzcyBXZWJWaWV3IGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdXJsID0gJ2h0dHBzOi8vY29jb3MuY29tJztcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2ltcGw6IFdlYlZpZXdJbXBsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gV2ViVmlldyBldmVudCB0eXBlXHJcbiAgICAgKiBAemgg572R6aG16KeG5Zu+5LqL5Lu257G75Z6LXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgRXZlbnRUeXBlID0gRXZlbnRUeXBlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBIGdpdmVuIFVSTCB0byBiZSBsb2FkZWQgYnkgdGhlIFdlYlZpZXcsIGl0IHNob3VsZCBoYXZlIGEgaHR0cCBvciBodHRwcyBwcmVmaXguXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaMh+WumiBXZWJWaWV3IOWKoOi9veeahOe9keWdgO+8jOWug+W6lOivpeaYr+S4gOS4qiBodHRwIOaIluiAhSBodHRwcyDlvIDlpLTnmoTlrZfnrKbkuLJcclxuICAgICAqL1xyXG4gICAgQHRvb2x0aXAoJ2kxOG46dmlkZW9wbGF5ZXIudXJsJylcclxuICAgIGdldCB1cmwgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91cmw7XHJcbiAgICB9XHJcbiAgICBzZXQgdXJsICh2YWw6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuX3VybCA9IHZhbDtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLmxvYWRVUkwodmFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSB3ZWJ2aWV3J3MgZXZlbnQgY2FsbGJhY2sgLCBpdCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIGNlcnRhaW4gd2VidmlldyBldmVudCBvY2N1cnMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIFdlYlZpZXcg55qE5Zue6LCD5LqL5Lu277yM5b2T572R6aG15Yqg6L296L+H56iL5Lit77yM5Yqg6L295a6M5oiQ5ZCO5oiW6ICF5Yqg6L295Ye66ZSZ5pe26YO95Lya5Zue6LCD5q2k5Ye95pWwXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFtDb21wb25lbnRFdmVudEhhbmRsZXJdKVxyXG4gICAgQGRpc3BsYXlPcmRlcigyMClcclxuICAgIEB0b29sdGlwKCdpMThuOnZpZGVvcGxheWVyLndlYnZpZXdFdmVudHMnKVxyXG4gICAgcHVibGljIHdlYnZpZXdFdmVudHM6IENvbXBvbmVudEV2ZW50SGFuZGxlcltdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJhdyB3ZWJ2aWV3IG9iamVjdHMgZm9yIHVzZXIgY3VzdG9taXphdGlvblxyXG4gICAgICogQHpoXHJcbiAgICAgKiDljp/lp4vnvZHpobXlr7nosaHvvIznlKjkuo7nlKjmiLflrprliLZcclxuICAgICAqL1xyXG4gICAgZ2V0IG5hdGl2ZVdlYlZpZXcgKCkge1xyXG4gICAgICAgIHJldHVybiAodGhpcy5faW1wbCAmJiB0aGlzLl9pbXBsLndlYnZpZXcpIHx8IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCBjdXJyZW50IGF1ZGlvIHN0YXRlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvZPliY3op4bpopHnirbmgIHjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHN0YXRlICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2ltcGwpIHsgcmV0dXJuIEV2ZW50VHlwZS5OT05FOyB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ltcGwuc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuXHJcbiAgICAgKiBTZXQgamF2YXNjcmlwdCBpbnRlcmZhY2Ugc2NoZW1lIChzZWUgYWxzbyBzZXRPbkpTQ2FsbGJhY2spLiA8YnIvPlxyXG4gICAgICogTm90ZTogU3VwcG9ydHMgb25seSBvbiB0aGUgQW5kcm9pZCBhbmQgaU9TLiBGb3IgSFRNTDUsIHBsZWFzZSByZWZlciB0byB0aGUgb2ZmaWNpYWwgZG9jdW1lbnRhdGlvbi48YnIvPlxyXG4gICAgICogUGxlYXNlIHJlZmVyIHRvIHRoZSBvZmZpY2lhbCBkb2N1bWVudGF0aW9uIGZvciBtb3JlIGRldGFpbHMuXHJcbiAgICAgKiAhI3poXHJcbiAgICAgKiDorr7nva4gSmF2YVNjcmlwdCDmjqXlj6PmlrnmoYjvvIjkuI4gJ3NldE9uSlNDYWxsYmFjaycg6YWN5aWX5L2/55So77yJ44CCPGJyLz5cclxuICAgICAqIOazqOaEj++8muWPquaUr+aMgSBBbmRyb2lkIOWSjCBpT1Mg77yMV2ViIOerr+eUqOazleivt+WJjeW+gOWumOaWueaWh+aho+afpeeci+OAgjxici8+XHJcbiAgICAgKiDor6bmg4Xor7flj4LpmIXlrpjmlrnmlofmoaNcclxuICAgICAqIEBtZXRob2Qgc2V0SmF2YXNjcmlwdEludGVyZmFjZVNjaGVtZVxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjaGVtZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0SmF2YXNjcmlwdEludGVyZmFjZVNjaGVtZSAoc2NoZW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5faW1wbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsLnNldEphdmFzY3JpcHRJbnRlcmZhY2VTY2hlbWUoc2NoZW1lKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuXHJcbiAgICAgKiBUaGlzIGNhbGxiYWNrIGNhbGxlZCB3aGVuIGxvYWQgVVJMIHRoYXQgc3RhcnQgd2l0aCBqYXZhc2NyaXB0XHJcbiAgICAgKiBpbnRlcmZhY2Ugc2NoZW1lIChzZWUgYWxzbyBzZXRKYXZhc2NyaXB0SW50ZXJmYWNlU2NoZW1lKS4gPGJyLz5cclxuICAgICAqIE5vdGU6IFN1cHBvcnRzIG9ubHkgb24gdGhlIEFuZHJvaWQgYW5kIGlPUy4gRm9yIEhUTUw1LCBwbGVhc2UgcmVmZXIgdG8gdGhlIG9mZmljaWFsIGRvY3VtZW50YXRpb24uPGJyLz5cclxuICAgICAqIFBsZWFzZSByZWZlciB0byB0aGUgb2ZmaWNpYWwgZG9jdW1lbnRhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLlxyXG4gICAgICogISN6aFxyXG4gICAgICog5b2T5Yqg6L29IFVSTCDku6UgSmF2YVNjcmlwdCDmjqXlj6PmlrnmoYjlvIDlp4vml7bosIPnlKjov5nkuKrlm57osIPlh73mlbDjgII8YnIvPlxyXG4gICAgICog5rOo5oSP77ya5Y+q5pSv5oyBIEFuZHJvaWQg5ZKMIGlPU++8jFdlYiDnq6/nlKjms5Xor7fliY3lvoDlrpjmlrnmlofmoaPmn6XnnIvjgIJcclxuICAgICAqIOivpuaDheivt+WPgumYheWumOaWueaWh+aho1xyXG4gICAgICogQG1ldGhvZCBzZXRPbkpTQ2FsbGJhY2tcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRPbkpTQ2FsbGJhY2sgKGNhbGxiYWNrOiBGdW5jdGlvbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc2V0T25KU0NhbGxiYWNrKGNhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiAhI2VuXHJcbiAgICAgKiBFdmFsdWF0ZXMgSmF2YVNjcmlwdCBpbiB0aGUgY29udGV4dCBvZiB0aGUgY3VycmVudGx5IGRpc3BsYXllZCBwYWdlLiA8YnIvPlxyXG4gICAgICogUGxlYXNlIHJlZmVyIHRvIHRoZSBvZmZpY2lhbCBkb2N1bWVudCBmb3IgbW9yZSBkZXRhaWxzIDxici8+XHJcbiAgICAgKiBOb3RlOiBDcm9zcyBkb21haW4gaXNzdWVzIG5lZWQgdG8gYmUgcmVzb2x2ZWQgYnkgeW91cnNlbGYgPGJyLz5cclxuICAgICAqICEjemhcclxuICAgICAqIOaJp+ihjCBXZWJWaWV3IOWGhemDqOmhtemdouiEmuacrO+8iOivpuaDheivt+WPgumYheWumOaWueaWh+aho++8iSA8YnIvPlxyXG4gICAgICog5rOo5oSP77ya6ZyA6KaB6Ieq6KGM6Kej5Yaz6Leo5Z+f6Zeu6aKYXHJcbiAgICAgKiBAbWV0aG9kIGV2YWx1YXRlSlNcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGV2YWx1YXRlSlMgKHN0cjogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5ldmFsdWF0ZUpTKHN0cik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQgKCkge1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbXBsID0gbmV3IFdlYlZpZXdJbXBsKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2ltcGwubG9hZFVSTCh0aGlzLl91cmwpO1xyXG4gICAgICAgIHRoaXMuX2ltcGwuZXZlbnRMaXN0LnNldChFdmVudFR5cGUuTE9BRElORywgdGhpcy5vbkxvYWRpbmcuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5faW1wbC5ldmVudExpc3Quc2V0KEV2ZW50VHlwZS5MT0FERUQsIHRoaXMub25Mb2FkZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgdGhpcy5faW1wbC5ldmVudExpc3Quc2V0KEV2ZW50VHlwZS5FUlJPUiwgdGhpcy5vbkVycm9yLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uTG9hZGluZyAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy53ZWJ2aWV3RXZlbnRzLCB0aGlzLCBFdmVudFR5cGUuTE9BRElORyk7XHJcbiAgICAgICAgdGhpcy5ub2RlLmVtaXQoJ2xvYWRpbmcnLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWRlZCAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy53ZWJ2aWV3RXZlbnRzLCB0aGlzLCBFdmVudFR5cGUuTE9BREVEKTtcclxuICAgICAgICB0aGlzLm5vZGUuZW1pdCgnbG9hZGVkJywgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgb25FcnJvciAoKSB7XHJcbiAgICAgICAgQ29tcG9uZW50RXZlbnRIYW5kbGVyLmVtaXRFdmVudHModGhpcy53ZWJ2aWV3RXZlbnRzLCB0aGlzLCBFdmVudFR5cGUuRVJST1IpO1xyXG4gICAgICAgIHRoaXMubm9kZS5lbWl0KCdlcnJvcicsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5lbmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ltcGwpIHtcclxuICAgICAgICAgICAgdGhpcy5faW1wbC5kaXNhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9pbXBsID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9pbXBsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ltcGwuc3luY01hdHJpeCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=