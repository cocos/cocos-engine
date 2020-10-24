(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js", "../assets/asset.js", "../data/decorators/index.js", "./render-flow.js", "../gfx/index.js", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"), require("../assets/asset.js"), require("../data/decorators/index.js"), require("./render-flow.js"), require("../gfx/index.js"), require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.asset, global.index, global.renderFlow, global.index, global.define);
    global.renderPipeline = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, _asset, _index, _renderFlow, _index2, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderPipeline = void 0;

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en Render pipeline describes how we handle the rendering process for all render objects in the related render scene root.
   * It contains some general pipeline configurations, necessary rendering resources and some [[RenderFlow]]s.
   * The rendering process function [[render]] is invoked by [[Root]] for all [[RenderView]]s.
   * @zh 渲染管线对象决定了引擎对相关渲染场景下的所有渲染对象实施的完整渲染流程。
   * 这个类主要包含一些通用的管线配置，必要的渲染资源和一些 [[RenderFlow]]。
   * 渲染流程函数 [[render]] 会由 [[Root]] 发起调用并对所有 [[RenderView]] 执行预设的渲染流程。
   */
  var RenderPipeline = (_dec = (0, _index.ccclass)('cc.RenderPipeline'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.displayOrder)(1), _dec4 = (0, _index.type)([_renderFlow.RenderFlow]), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_Asset) {
    _inherits(RenderPipeline, _Asset);

    function RenderPipeline() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RenderPipeline);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RenderPipeline)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_tag", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_flows", _descriptor2, _assertThisInitialized(_this));

      _this._macros = {};
      _this._commandBuffers = [];
      return _this;
    }

    _createClass(RenderPipeline, [{
      key: "initialize",

      /**
       * @en The initialization process, user shouldn't use it in most case, only useful when need to generate render pipeline programmatically.
       * @zh 初始化函数，正常情况下不会用到，仅用于程序化生成渲染管线的情况。
       * @param info The render pipeline information
       */
      value: function initialize(info) {
        this._flows = info.flows;

        if (info.tag) {
          this._tag = info.tag;
        }

        return true;
      }
      /**
       * @en Activate the render pipeline after loaded, it mainly activate the flows
       * @zh 当渲染管线资源加载完成后，启用管线，主要是启用管线内的 flow
       */

    }, {
      key: "activate",
      value: function activate() {
        this._device = _globalExports.legacyCC.director.root.device;
        var layoutInfo = new _index2.GFXDescriptorSetLayoutInfo(_define.globalDescriptorSetLayout.bindings);
        this._descriptorSetLayout = this._device.createDescriptorSetLayout(layoutInfo);
        this._descriptorSet = this._device.createDescriptorSet(new _index2.GFXDescriptorSetInfo(this._descriptorSetLayout));

        for (var i = 0; i < this._flows.length; i++) {
          this._flows[i].activate(this);
        }

        return true;
      }
      /**
       * @en Render function, it basically run the render process of all flows in sequence for the given view.
       * @zh 渲染函数，对指定的渲染视图按顺序执行所有渲染流程。
       * @param view Render view。
       */

    }, {
      key: "render",
      value: function render(views) {
        for (var i = 0; i < views.length; i++) {
          var view = views[i];

          for (var j = 0; j < view.flows.length; j++) {
            view.flows[j].render(view);
          }
        }
      }
      /**
       * @en Internal destroy function
       * @zh 内部销毁函数。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        for (var i = 0; i < this._flows.length; i++) {
          this._flows[i].destroy();
        }

        this._flows.length = 0;

        if (this._descriptorSet) {
          this._descriptorSet.destroy();

          this._descriptorSet = null;
        }

        for (var _i = 0; _i < this._commandBuffers.length; _i++) {
          this._commandBuffers[_i].destroy();
        }

        this._commandBuffers.length = 0;
        return _get(_getPrototypeOf(RenderPipeline.prototype), "destroy", this).call(this);
      }
    }, {
      key: "macros",

      /**
       * @en The macros for this pipeline.
       * @zh 管线宏定义。
       * @readonly
       */
      get: function get() {
        return this._macros;
      }
      /**
       * @en The tag of pipeline.
       * @zh 管线的渲染流程列表。
       * @readonly
       */

    }, {
      key: "tag",
      get: function get() {
        return this._tag;
      }
      /**
       * @en The flows of pipeline.
       * @zh 管线的标签。
       * @readonly
       */

    }, {
      key: "flows",
      get: function get() {
        return this._flows;
      }
      /**
       * @en Tag
       * @zh 标签
       * @readonly
       */

    }, {
      key: "device",
      get: function get() {
        return this._device;
      }
    }, {
      key: "descriptorSetLayout",
      get: function get() {
        return this._descriptorSetLayout;
      }
    }, {
      key: "descriptorSet",
      get: function get() {
        return this._descriptorSet;
      }
    }, {
      key: "commandBuffers",
      get: function get() {
        return this._commandBuffers;
      }
    }]);

    return RenderPipeline;
  }(_asset.Asset), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_tag", [_dec2, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_flows", [_dec3, _dec4, _index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.RenderPipeline = RenderPipeline;
  _globalExports.legacyCC.RenderPipeline = RenderPipeline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLXBpcGVsaW5lLnRzIl0sIm5hbWVzIjpbIlJlbmRlclBpcGVsaW5lIiwiUmVuZGVyRmxvdyIsIl9tYWNyb3MiLCJfY29tbWFuZEJ1ZmZlcnMiLCJpbmZvIiwiX2Zsb3dzIiwiZmxvd3MiLCJ0YWciLCJfdGFnIiwiX2RldmljZSIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJyb290IiwiZGV2aWNlIiwibGF5b3V0SW5mbyIsIkdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvIiwiZ2xvYmFsRGVzY3JpcHRvclNldExheW91dCIsImJpbmRpbmdzIiwiX2Rlc2NyaXB0b3JTZXRMYXlvdXQiLCJjcmVhdGVEZXNjcmlwdG9yU2V0TGF5b3V0IiwiX2Rlc2NyaXB0b3JTZXQiLCJjcmVhdGVEZXNjcmlwdG9yU2V0IiwiR0ZYRGVzY3JpcHRvclNldEluZm8iLCJpIiwibGVuZ3RoIiwiYWN0aXZhdGUiLCJ2aWV3cyIsInZpZXciLCJqIiwicmVuZGVyIiwiZGVzdHJveSIsIkFzc2V0Iiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQTs7Ozs7Ozs7TUFTc0JBLGMsV0FEckIsb0JBQVEsbUJBQVIsQyxVQW1DSSx5QkFBYSxDQUFiLEMsVUFTQSx5QkFBYSxDQUFiLEMsVUFDQSxpQkFBSyxDQUFDQyxzQkFBRCxDQUFMLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBSVNDLE8sR0FBdUIsRTtZQXFCdkJDLGUsR0FBc0MsRTs7Ozs7OztBQUVoRDs7Ozs7aUNBS21CQyxJLEVBQW9DO0FBQ25ELGFBQUtDLE1BQUwsR0FBY0QsSUFBSSxDQUFDRSxLQUFuQjs7QUFDQSxZQUFJRixJQUFJLENBQUNHLEdBQVQsRUFBYztBQUFFLGVBQUtDLElBQUwsR0FBWUosSUFBSSxDQUFDRyxHQUFqQjtBQUF1Qjs7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bXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgQXNzZXQgfSBmcm9tICcuLi9hc3NldHMvYXNzZXQnO1xyXG5pbXBvcnQgeyBjY2NsYXNzLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFJlbmRlckZsb3cgfSBmcm9tICcuL3JlbmRlci1mbG93JztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBNYWNyb1JlY29yZCB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvcGFzcy11dGlscyc7XHJcbmltcG9ydCB7IEdGWERldmljZSwgR0ZYRGVzY3JpcHRvclNldCwgR0ZYQ29tbWFuZEJ1ZmZlciwgR0ZYRGVzY3JpcHRvclNldExheW91dCwgR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8sIEdGWERlc2NyaXB0b3JTZXRJbmZvIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgZ2xvYmFsRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vZGVmaW5lJztcclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVuZGVyIHBpcGVsaW5lIGluZm9ybWF0aW9uIGRlc2NyaXB0b3JcclxuICogQHpoIOa4suafk+euoee6v+aPj+i/sOS/oeaBr+OAglxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJUmVuZGVyUGlwZWxpbmVJbmZvIHtcclxuICAgIGZsb3dzOiBSZW5kZXJGbG93W107XHJcbiAgICB0YWc/OiBudW1iZXI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gUmVuZGVyIHBpcGVsaW5lIGRlc2NyaWJlcyBob3cgd2UgaGFuZGxlIHRoZSByZW5kZXJpbmcgcHJvY2VzcyBmb3IgYWxsIHJlbmRlciBvYmplY3RzIGluIHRoZSByZWxhdGVkIHJlbmRlciBzY2VuZSByb290LlxyXG4gKiBJdCBjb250YWlucyBzb21lIGdlbmVyYWwgcGlwZWxpbmUgY29uZmlndXJhdGlvbnMsIG5lY2Vzc2FyeSByZW5kZXJpbmcgcmVzb3VyY2VzIGFuZCBzb21lIFtbUmVuZGVyRmxvd11dcy5cclxuICogVGhlIHJlbmRlcmluZyBwcm9jZXNzIGZ1bmN0aW9uIFtbcmVuZGVyXV0gaXMgaW52b2tlZCBieSBbW1Jvb3RdXSBmb3IgYWxsIFtbUmVuZGVyVmlld11dcy5cclxuICogQHpoIOa4suafk+euoee6v+WvueixoeWGs+WumuS6huW8leaTjuWvueebuOWFs+a4suafk+WcuuaZr+S4i+eahOaJgOaciea4suafk+WvueixoeWunuaWveeahOWujOaVtOa4suafk+a1geeoi+OAglxyXG4gKiDov5nkuKrnsbvkuLvopoHljIXlkKvkuIDkupvpgJrnlKjnmoTnrqHnur/phY3nva7vvIzlv4XopoHnmoTmuLLmn5PotYTmupDlkozkuIDkupsgW1tSZW5kZXJGbG93XV3jgIJcclxuICog5riy5p+T5rWB56iL5Ye95pWwIFtbcmVuZGVyXV0g5Lya55SxIFtbUm9vdF1dIOWPkei1t+iwg+eUqOW5tuWvueaJgOaciSBbW1JlbmRlclZpZXddXSDmiafooYzpooTorr7nmoTmuLLmn5PmtYHnqIvjgIJcclxuICovXHJcbkBjY2NsYXNzKCdjYy5SZW5kZXJQaXBlbGluZScpXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZW5kZXJQaXBlbGluZSBleHRlbmRzIEFzc2V0IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgbWFjcm9zIGZvciB0aGlzIHBpcGVsaW5lLlxyXG4gICAgICogQHpoIOeuoee6v+Wuj+WumuS5ieOAglxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIGdldCBtYWNyb3MgKCk6IE1hY3JvUmVjb3JkIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFjcm9zO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSB0YWcgb2YgcGlwZWxpbmUuXHJcbiAgICAgKiBAemgg566h57q/55qE5riy5p+T5rWB56iL5YiX6KGo44CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgZ2V0IHRhZyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdGFnO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBmbG93cyBvZiBwaXBlbGluZS5cclxuICAgICAqIEB6aCDnrqHnur/nmoTmoIfnrb7jgIJcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBnZXQgZmxvd3MgKCk6IFJlbmRlckZsb3dbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zsb3dzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRhZ1xyXG4gICAgICogQHpoIOagh+etvlxyXG4gICAgICogQHJlYWRvbmx5XHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfdGFnOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEZsb3dzXHJcbiAgICAgKiBAemgg5riy5p+T5rWB56iL5YiX6KGoXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHR5cGUoW1JlbmRlckZsb3ddKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9mbG93czogUmVuZGVyRmxvd1tdID0gW107XHJcblxyXG4gICAgcHJvdGVjdGVkIF9tYWNyb3M6IE1hY3JvUmVjb3JkID0ge307XHJcblxyXG4gICAgZ2V0IGRldmljZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgZGVzY3JpcHRvclNldExheW91dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2NyaXB0b3JTZXRMYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlc2NyaXB0b3JTZXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXNjcmlwdG9yU2V0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb21tYW5kQnVmZmVycyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRCdWZmZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGV2aWNlITogR0ZYRGV2aWNlO1xyXG4gICAgcHJvdGVjdGVkIF9kZXNjcmlwdG9yU2V0TGF5b3V0ITogR0ZYRGVzY3JpcHRvclNldExheW91dDtcclxuICAgIHByb3RlY3RlZCBfZGVzY3JpcHRvclNldCE6IEdGWERlc2NyaXB0b3JTZXQ7XHJcbiAgICBwcm90ZWN0ZWQgX2NvbW1hbmRCdWZmZXJzOiBHRlhDb21tYW5kQnVmZmVyW10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgaW5pdGlhbGl6YXRpb24gcHJvY2VzcywgdXNlciBzaG91bGRuJ3QgdXNlIGl0IGluIG1vc3QgY2FzZSwgb25seSB1c2VmdWwgd2hlbiBuZWVkIHRvIGdlbmVyYXRlIHJlbmRlciBwaXBlbGluZSBwcm9ncmFtbWF0aWNhbGx5LlxyXG4gICAgICogQHpoIOWIneWni+WMluWHveaVsO+8jOato+W4uOaDheWGteS4i+S4jeS8mueUqOWIsO+8jOS7heeUqOS6jueoi+W6j+WMlueUn+aIkOa4suafk+euoee6v+eahOaDheWGteOAglxyXG4gICAgICogQHBhcmFtIGluZm8gVGhlIHJlbmRlciBwaXBlbGluZSBpbmZvcm1hdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclBpcGVsaW5lSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuX2Zsb3dzID0gaW5mby5mbG93cztcclxuICAgICAgICBpZiAoaW5mby50YWcpIHsgdGhpcy5fdGFnID0gaW5mby50YWc7IH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBBY3RpdmF0ZSB0aGUgcmVuZGVyIHBpcGVsaW5lIGFmdGVyIGxvYWRlZCwgaXQgbWFpbmx5IGFjdGl2YXRlIHRoZSBmbG93c1xyXG4gICAgICogQHpoIOW9k+a4suafk+euoee6v+i1hOa6kOWKoOi9veWujOaIkOWQju+8jOWQr+eUqOeuoee6v++8jOS4u+imgeaYr+WQr+eUqOeuoee6v+WGheeahCBmbG93XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kZXZpY2U7XHJcblxyXG4gICAgICAgIGNvbnN0IGxheW91dEluZm8gPSBuZXcgR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8oZ2xvYmFsRGVzY3JpcHRvclNldExheW91dC5iaW5kaW5ncyk7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldExheW91dCA9IHRoaXMuX2RldmljZS5jcmVhdGVEZXNjcmlwdG9yU2V0TGF5b3V0KGxheW91dEluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0ID0gdGhpcy5fZGV2aWNlLmNyZWF0ZURlc2NyaXB0b3JTZXQobmV3IEdGWERlc2NyaXB0b3JTZXRJbmZvKHRoaXMuX2Rlc2NyaXB0b3JTZXRMYXlvdXQpKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9mbG93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9mbG93c1tpXS5hY3RpdmF0ZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbmRlciBmdW5jdGlvbiwgaXQgYmFzaWNhbGx5IHJ1biB0aGUgcmVuZGVyIHByb2Nlc3Mgb2YgYWxsIGZsb3dzIGluIHNlcXVlbmNlIGZvciB0aGUgZ2l2ZW4gdmlldy5cclxuICAgICAqIEB6aCDmuLLmn5Plh73mlbDvvIzlr7nmjIflrprnmoTmuLLmn5Pop4blm77mjInpobrluo/miafooYzmiYDmnInmuLLmn5PmtYHnqIvjgIJcclxuICAgICAqIEBwYXJhbSB2aWV3IFJlbmRlciB2aWV344CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXdzOiBSZW5kZXJWaWV3W10pIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB2aWV3LmZsb3dzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3LmZsb3dzW2pdLnJlbmRlcih2aWV3KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbnRlcm5hbCBkZXN0cm95IGZ1bmN0aW9uXHJcbiAgICAgKiBAemgg5YaF6YOo6ZSA5q+B5Ye95pWw44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpOiBib29sZWFuIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Zsb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Zsb3dzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZmxvd3MubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JTZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQgPSBudWxsITtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fY29tbWFuZEJ1ZmZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fY29tbWFuZEJ1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVycy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5SZW5kZXJQaXBlbGluZSA9IFJlbmRlclBpcGVsaW5lO1xyXG4iXX0=