(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/assets/index.js", "../../core/components/index.js", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/enum.js", "../../core/scene-graph/index.js", "./layout.js", "./sprite.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/assets/index.js"), require("../../core/components/index.js"), require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/enum.js"), require("../../core/scene-graph/index.js"), require("./layout.js"), require("./sprite.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global._enum, global.index, global.layout, global.sprite);
    global.pageViewIndicator = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _enum, _index5, _layout, _sprite) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PageViewIndicator = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _class3, _temp;

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _color = new _index4.Color();
  /**
   * @en Enum for PageView Indicator direction.
   *
   * @zh 页面视图指示器的摆放方向
   *
   * @enum PageViewIndicator.Direction
   */


  var Direction;

  (function (Direction) {
    Direction[Direction["HORIZONTAL"] = 0] = "HORIZONTAL";
    Direction[Direction["VERTICAL"] = 1] = "VERTICAL";
  })(Direction || (Direction = {}));

  (0, _enum.ccenum)(Direction);
  /**
   * @en
   * The Page View Indicator Component.
   *
   * @zh
   * 页面视图每页标记组件
   */

  var PageViewIndicator = (_dec = (0, _index3.ccclass)('cc.PageViewIndicator'), _dec2 = (0, _index3.help)('i18n:cc.PageViewIndicator'), _dec3 = (0, _index3.executionOrder)(110), _dec4 = (0, _index3.menu)('UI/PageViewIndicator'), _dec5 = (0, _index3.type)(_index.SpriteFrame), _dec6 = (0, _index3.tooltip)('每个页面标记显示的图片'), _dec7 = (0, _index3.type)(Direction), _dec8 = (0, _index3.tooltip)('页面标记摆放方向'), _dec9 = (0, _index3.type)(_index4.Size), _dec10 = (0, _index3.tooltip)('每个页面标记的大小'), _dec11 = (0, _index3.tooltip)('每个页面标记之间的边距'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(PageViewIndicator, _Component);

    function PageViewIndicator() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, PageViewIndicator);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PageViewIndicator)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "spacing", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_spriteFrame", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_direction", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_cellSize", _descriptor4, _assertThisInitialized(_this));

      _this._layout = null;
      _this._pageView = null;
      _this._indicators = [];
      return _this;
    }

    _createClass(PageViewIndicator, [{
      key: "onLoad",
      value: function onLoad() {
        this._updateLayout();
      }
      /**
       * @en
       * Set Page View.
       *
       * @zh
       * 设置页面视图
       *
       * @param target 页面视图对象
       */

    }, {
      key: "setPageView",
      value: function setPageView(target) {
        this._pageView = target;

        this._refresh();
      }
    }, {
      key: "_updateLayout",
      value: function _updateLayout() {
        this._layout = this.getComponent(_layout.Layout);

        if (!this._layout) {
          this._layout = this.addComponent(_layout.Layout);
        }

        var layout = this._layout;

        if (this.direction === Direction.HORIZONTAL) {
          layout.type = _layout.Layout.Type.HORIZONTAL;
          layout.spacingX = this.spacing;
        } else if (this.direction === Direction.VERTICAL) {
          layout.type = _layout.Layout.Type.VERTICAL;
          layout.spacingY = this.spacing;
        }

        layout.resizeMode = _layout.Layout.ResizeMode.CONTAINER;
      }
    }, {
      key: "_createIndicator",
      value: function _createIndicator() {
        var node = new _index5.Node();
        var sprite = node.addComponent(_sprite.Sprite);
        sprite.spriteFrame = this.spriteFrame;
        sprite.sizeMode = _sprite.Sprite.SizeMode.CUSTOM;
        node.parent = this.node;

        node._uiProps.uiTransformComp.setContentSize(this._cellSize);

        return node;
      }
    }, {
      key: "_changedState",
      value: function _changedState() {
        var indicators = this._indicators;

        if (indicators.length === 0 || !this._pageView) {
          return;
        }

        var idx = this._pageView.curPageIdx;

        if (idx >= indicators.length) {
          return;
        }

        for (var i = 0; i < indicators.length; ++i) {
          var node = indicators[i];

          if (!node._uiProps.uiComp) {
            continue;
          }

          var uiComp = node._uiProps.uiComp;

          _color.set(uiComp.color);

          _color.a = 255 / 2;
          uiComp.color = _color;
        }

        if (indicators[idx]._uiProps.uiComp) {
          var comp = indicators[idx]._uiProps.uiComp;

          _color.set(comp.color);

          _color.a = 255;
          comp.color = _color;
        }
      }
    }, {
      key: "_refresh",
      value: function _refresh() {
        if (!this._pageView) {
          return;
        }

        var indicators = this._indicators;

        var pages = this._pageView.getPages();

        if (pages.length === indicators.length) {
          return;
        }

        var i = 0;

        if (pages.length > indicators.length) {
          for (i = 0; i < pages.length; ++i) {
            if (!indicators[i]) {
              indicators[i] = this._createIndicator();
            }
          }
        } else {
          var count = indicators.length - pages.length;

          for (i = count; i > 0; --i) {
            var node = indicators[i - 1];
            this.node.removeChild(node);
            indicators.splice(i - 1, 1);
          }
        }

        if (this._layout && this._layout.enabledInHierarchy) {
          this._layout.updateLayout();
        }

        this._changedState();
      }
    }, {
      key: "spriteFrame",

      /**
       * @en
       * The spriteFrame for each element.
       *
       * @zh
       * 每个页面标记显示的图片
       */
      get: function get() {
        return this._spriteFrame;
      },
      set: function set(value) {
        if (this._spriteFrame === value) {
          return;
        }

        this._spriteFrame = value;
      }
      /**
       * @en
       * The location direction of PageViewIndicator.
       *
       * @zh
       * 页面标记摆放方向
       *
       * @param direction 摆放方向
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
      }
      /**
       * @en
       * The cellSize for each element.
       *
       * @zh
       * 每个页面标记的大小
       */

    }, {
      key: "cellSize",
      get: function get() {
        return this._cellSize;
      },
      set: function set(value) {
        if (this._cellSize === value) {
          return;
        }

        this._cellSize = value;
      }
    }]);

    return PageViewIndicator;
  }(_index2.Component), _class3.Direction = Direction, _temp), (_applyDecoratedDescriptor(_class2.prototype, "spriteFrame", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "spriteFrame"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "direction", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "direction"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "cellSize", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "cellSize"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "spacing", [_index3.serializable, _dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_spriteFrame", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_direction", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Direction.HORIZONTAL;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_cellSize", [_index3.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.Size(20, 20);
    }
  })), _class2)) || _class) || _class) || _class) || _class);
  _exports.PageViewIndicator = PageViewIndicator;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3VpL2NvbXBvbmVudHMvcGFnZS12aWV3LWluZGljYXRvci50cyJdLCJuYW1lcyI6WyJfY29sb3IiLCJDb2xvciIsIkRpcmVjdGlvbiIsIlBhZ2VWaWV3SW5kaWNhdG9yIiwiU3ByaXRlRnJhbWUiLCJTaXplIiwiX2xheW91dCIsIl9wYWdlVmlldyIsIl9pbmRpY2F0b3JzIiwiX3VwZGF0ZUxheW91dCIsInRhcmdldCIsIl9yZWZyZXNoIiwiZ2V0Q29tcG9uZW50IiwiTGF5b3V0IiwiYWRkQ29tcG9uZW50IiwibGF5b3V0IiwiZGlyZWN0aW9uIiwiSE9SSVpPTlRBTCIsInR5cGUiLCJUeXBlIiwic3BhY2luZ1giLCJzcGFjaW5nIiwiVkVSVElDQUwiLCJzcGFjaW5nWSIsInJlc2l6ZU1vZGUiLCJSZXNpemVNb2RlIiwiQ09OVEFJTkVSIiwibm9kZSIsIk5vZGUiLCJzcHJpdGUiLCJTcHJpdGUiLCJzcHJpdGVGcmFtZSIsInNpemVNb2RlIiwiU2l6ZU1vZGUiLCJDVVNUT00iLCJwYXJlbnQiLCJfdWlQcm9wcyIsInVpVHJhbnNmb3JtQ29tcCIsInNldENvbnRlbnRTaXplIiwiX2NlbGxTaXplIiwiaW5kaWNhdG9ycyIsImxlbmd0aCIsImlkeCIsImN1clBhZ2VJZHgiLCJpIiwidWlDb21wIiwic2V0IiwiY29sb3IiLCJhIiwiY29tcCIsInBhZ2VzIiwiZ2V0UGFnZXMiLCJfY3JlYXRlSW5kaWNhdG9yIiwiY291bnQiLCJyZW1vdmVDaGlsZCIsInNwbGljZSIsImVuYWJsZWRJbkhpZXJhcmNoeSIsInVwZGF0ZUxheW91dCIsIl9jaGFuZ2VkU3RhdGUiLCJfc3ByaXRlRnJhbWUiLCJ2YWx1ZSIsIl9kaXJlY3Rpb24iLCJDb21wb25lbnQiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQ0EsTUFBTUEsTUFBTSxH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a0JELEtBQWxCO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFTZ0I7QUFDWixlQUFPLEtBQUtyQixTQUFaO0FBQ0gsTzt3QkFFYXFCLEssRUFBTztBQUNqQixZQUFJLEtBQUtyQixTQUFMLEtBQW1CcUIsS0FBdkIsRUFBOEI7QUFDMUI7QUFDSDs7QUFDRCxhQUFLckIsU0FBTCxHQUFpQnFCLEtBQWpCO0FBQ0g7Ozs7SUE3RGtDRSxpQixXQStEckI1RCxTLEdBQVlBLFMsa2pCQVN6QjZELG9COzs7OzthQUVnQixDOzttRkFDaEJBLG9COzs7OzthQUM0QyxJOztpRkFDNUNBLG9COzs7OzthQUNpQzdELFNBQVMsQ0FBQ2UsVTs7Z0ZBQzNDOEMsb0I7Ozs7O2FBQ3FCLElBQUkxRCxZQUFKLENBQVMsRUFBVCxFQUFhLEVBQWIsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwczovL3d3dy5jb2Nvcy5jb20vXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHVpXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgU3ByaXRlRnJhbWUgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvcmUvY29tcG9uZW50cyc7XHJcbmltcG9ydCB7IGNjY2xhc3MsIGhlbHAsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCB0b29sdGlwLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xvciwgU2l6ZSB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNjZW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMvZW51bSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9jb3JlL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgTGF5b3V0IH0gZnJvbSAnLi9sYXlvdXQnO1xyXG5pbXBvcnQgeyBQYWdlVmlldyB9IGZyb20gJy4vcGFnZS12aWV3JztcclxuaW1wb3J0IHsgU3ByaXRlIH0gZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgeyBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMvdWktYmFzZS91aS1yZW5kZXJhYmxlJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmNvbnN0IF9jb2xvciA9IG5ldyBDb2xvcigpO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBFbnVtIGZvciBQYWdlVmlldyBJbmRpY2F0b3IgZGlyZWN0aW9uLlxyXG4gKlxyXG4gKiBAemgg6aG16Z2i6KeG5Zu+5oyH56S65Zmo55qE5pGG5pS+5pa55ZCRXHJcbiAqXHJcbiAqIEBlbnVtIFBhZ2VWaWV3SW5kaWNhdG9yLkRpcmVjdGlvblxyXG4gKi9cclxuZW51bSBEaXJlY3Rpb24ge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGhvcml6b250YWwgZGlyZWN0aW9uLlxyXG4gICAgICpcclxuICAgICAqIEB6aCDmsLTlubPmlrnlkJFcclxuICAgICAqL1xyXG4gICAgSE9SSVpPTlRBTCA9IDAsXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHZlcnRpY2FsIGRpcmVjdGlvbi5cclxuICAgICAqXHJcbiAgICAgKiBAemgg5Z6C55u05pa55ZCRXHJcbiAgICAgKi9cclxuICAgIFZFUlRJQ0FMID0gMSxcclxufVxyXG5jY2VudW0oRGlyZWN0aW9uKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIFBhZ2UgVmlldyBJbmRpY2F0b3IgQ29tcG9uZW50LlxyXG4gKlxyXG4gKiBAemhcclxuICog6aG16Z2i6KeG5Zu+5q+P6aG15qCH6K6w57uE5Lu2XHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuUGFnZVZpZXdJbmRpY2F0b3InKVxyXG5AaGVscCgnaTE4bjpjYy5QYWdlVmlld0luZGljYXRvcicpXHJcbkBleGVjdXRpb25PcmRlcigxMTApXHJcbkBtZW51KCdVSS9QYWdlVmlld0luZGljYXRvcicpXHJcbmV4cG9ydCBjbGFzcyBQYWdlVmlld0luZGljYXRvciBleHRlbmRzIENvbXBvbmVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHNwcml0ZUZyYW1lIGZvciBlYWNoIGVsZW1lbnQuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmr4/kuKrpobXpnaLmoIforrDmmL7npLrnmoTlm77niYdcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3ByaXRlRnJhbWUpXHJcbiAgICBAdG9vbHRpcCgn5q+P5Liq6aG16Z2i5qCH6K6w5pi+56S655qE5Zu+54mHJylcclxuICAgIGdldCBzcHJpdGVGcmFtZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Nwcml0ZUZyYW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzcHJpdGVGcmFtZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fc3ByaXRlRnJhbWUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3ByaXRlRnJhbWUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGxvY2F0aW9uIGRpcmVjdGlvbiBvZiBQYWdlVmlld0luZGljYXRvci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmhtemdouagh+iusOaRhuaUvuaWueWQkVxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBkaXJlY3Rpb24g5pGG5pS+5pa55ZCRXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKERpcmVjdGlvbilcclxuICAgIEB0b29sdGlwKCfpobXpnaLmoIforrDmkYbmlL7mlrnlkJEnKVxyXG4gICAgZ2V0IGRpcmVjdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RpcmVjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZGlyZWN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24gPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBjZWxsU2l6ZSBmb3IgZWFjaCBlbGVtZW50LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5q+P5Liq6aG16Z2i5qCH6K6w55qE5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNpemUpXHJcbiAgICBAdG9vbHRpcCgn5q+P5Liq6aG16Z2i5qCH6K6w55qE5aSn5bCPJylcclxuICAgIGdldCBjZWxsU2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbGxTaXplO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjZWxsU2l6ZSAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fY2VsbFNpemUgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2VsbFNpemUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIERpcmVjdGlvbiA9IERpcmVjdGlvbjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGRpc3RhbmNlIGJldHdlZW4gZWFjaCBlbGVtZW50LlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5q+P5Liq6aG16Z2i5qCH6K6w5LmL6Ze055qE6L656LedXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEB0b29sdGlwKCfmr4/kuKrpobXpnaLmoIforrDkuYvpl7TnmoTovrnot50nKVxyXG4gICAgcHVibGljIHNwYWNpbmcgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zcHJpdGVGcmFtZTogU3ByaXRlRnJhbWUgfCBudWxsID0gbnVsbDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfZGlyZWN0aW9uOiBEaXJlY3Rpb24gPSBEaXJlY3Rpb24uSE9SSVpPTlRBTDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfY2VsbFNpemUgPSBuZXcgU2l6ZSgyMCwgMjApO1xyXG4gICAgcHJvdGVjdGVkIF9sYXlvdXQ6IExheW91dCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9wYWdlVmlldzogUGFnZVZpZXcgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfaW5kaWNhdG9yczogTm9kZVtdID0gW107XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTGF5b3V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCBQYWdlIFZpZXcuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7pobXpnaLop4blm75cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IOmhtemdouinhuWbvuWvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UGFnZVZpZXcgKHRhcmdldDogUGFnZVZpZXcpIHtcclxuICAgICAgICB0aGlzLl9wYWdlVmlldyA9IHRhcmdldDtcclxuICAgICAgICB0aGlzLl9yZWZyZXNoKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVMYXlvdXQgKCkge1xyXG4gICAgICAgIHRoaXMuX2xheW91dCA9IHRoaXMuZ2V0Q29tcG9uZW50KExheW91dCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9sYXlvdXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGF5b3V0ID0gdGhpcy5hZGRDb21wb25lbnQoTGF5b3V0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGxheW91dCA9IHRoaXMuX2xheW91dCE7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24uSE9SSVpPTlRBTCkge1xyXG4gICAgICAgICAgICBsYXlvdXQudHlwZSA9IExheW91dC5UeXBlLkhPUklaT05UQUw7XHJcbiAgICAgICAgICAgIGxheW91dC5zcGFjaW5nWCA9IHRoaXMuc3BhY2luZztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5kaXJlY3Rpb24gPT09IERpcmVjdGlvbi5WRVJUSUNBTCkge1xyXG4gICAgICAgICAgICBsYXlvdXQudHlwZSA9IExheW91dC5UeXBlLlZFUlRJQ0FMO1xyXG4gICAgICAgICAgICBsYXlvdXQuc3BhY2luZ1kgPSB0aGlzLnNwYWNpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxheW91dC5yZXNpemVNb2RlID0gTGF5b3V0LlJlc2l6ZU1vZGUuQ09OVEFJTkVSO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfY3JlYXRlSW5kaWNhdG9yICgpIHtcclxuICAgICAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoKTtcclxuICAgICAgICBjb25zdCBzcHJpdGUgPSBub2RlLmFkZENvbXBvbmVudChTcHJpdGUpO1xyXG4gICAgICAgIHNwcml0ZSEuc3ByaXRlRnJhbWUgPSB0aGlzLnNwcml0ZUZyYW1lO1xyXG4gICAgICAgIHNwcml0ZSEuc2l6ZU1vZGUgPSBTcHJpdGUuU2l6ZU1vZGUuQ1VTVE9NO1xyXG4gICAgICAgIG5vZGUucGFyZW50ID0gdGhpcy5ub2RlO1xyXG4gICAgICAgIG5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wIS5zZXRDb250ZW50U2l6ZSh0aGlzLl9jZWxsU2l6ZSk7XHJcbiAgICAgICAgcmV0dXJuIG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jaGFuZ2VkU3RhdGUgKCkge1xyXG4gICAgICAgIGNvbnN0IGluZGljYXRvcnMgPSB0aGlzLl9pbmRpY2F0b3JzO1xyXG4gICAgICAgIGlmIChpbmRpY2F0b3JzLmxlbmd0aCA9PT0gMCB8fCAhdGhpcy5fcGFnZVZpZXcpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5fcGFnZVZpZXcuY3VyUGFnZUlkeDtcclxuICAgICAgICBpZiAoaWR4ID49IGluZGljYXRvcnMubGVuZ3RoKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNhdG9ycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBub2RlID0gaW5kaWNhdG9yc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFub2RlLl91aVByb3BzLnVpQ29tcCkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVpQ29tcCA9IG5vZGUuX3VpUHJvcHMudWlDb21wIGFzIFVJUmVuZGVyYWJsZTtcclxuICAgICAgICAgICAgX2NvbG9yLnNldCh1aUNvbXAuY29sb3IpO1xyXG4gICAgICAgICAgICBfY29sb3IuYSA9IDI1NSAvIDI7XHJcbiAgICAgICAgICAgIHVpQ29tcC5jb2xvciA9IF9jb2xvcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpbmRpY2F0b3JzW2lkeF0uX3VpUHJvcHMudWlDb21wKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbXAgPSBpbmRpY2F0b3JzW2lkeF0uX3VpUHJvcHMudWlDb21wIGFzIFVJUmVuZGVyYWJsZTtcclxuICAgICAgICAgICAgX2NvbG9yLnNldChjb21wLmNvbG9yKTtcclxuICAgICAgICAgICAgX2NvbG9yLmEgPSAyNTU7XHJcbiAgICAgICAgICAgIGNvbXAuY29sb3IgPSBfY29sb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfcmVmcmVzaCAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYWdlVmlldykgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBpbmRpY2F0b3JzID0gdGhpcy5faW5kaWNhdG9ycztcclxuICAgICAgICBjb25zdCBwYWdlcyA9IHRoaXMuX3BhZ2VWaWV3LmdldFBhZ2VzKCk7XHJcbiAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA9PT0gaW5kaWNhdG9ycy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgaWYgKHBhZ2VzLmxlbmd0aCA+IGluZGljYXRvcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpbmRpY2F0b3JzW2ldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNhdG9yc1tpXSA9IHRoaXMuX2NyZWF0ZUluZGljYXRvcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjb3VudCA9IGluZGljYXRvcnMubGVuZ3RoIC0gcGFnZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGkgPSBjb3VudDsgaSA+IDA7IC0taSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgbm9kZSA9IGluZGljYXRvcnNbaSAtIDFdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLnJlbW92ZUNoaWxkKG5vZGUpO1xyXG4gICAgICAgICAgICAgICAgaW5kaWNhdG9ycy5zcGxpY2UoaSAtIDEsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9sYXlvdXQgJiYgdGhpcy5fbGF5b3V0LmVuYWJsZWRJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXlvdXQudXBkYXRlTGF5b3V0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NoYW5nZWRTdGF0ZSgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==