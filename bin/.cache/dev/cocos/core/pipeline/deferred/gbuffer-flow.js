(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../render-flow.js", "./enum.js", "./gbuffer-stage.js", "../../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../render-flow.js"), require("./enum.js"), require("./gbuffer-stage.js"), require("../../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderFlow, global._enum, global.gbufferStage, global.index);
    global.gbufferFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderFlow, _enum, _gbufferStage, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GbufferFlow = void 0;

  var _dec, _class, _class2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

  /**
   * @en The gbuffer flow in deferred render pipeline
   * @zh 前向渲染流程。
   */
  var GbufferFlow = (_dec = (0, _index.ccclass)('GbufferFlow'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderFlow) {
    _inherits(GbufferFlow, _RenderFlow);

    function GbufferFlow() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, GbufferFlow);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(GbufferFlow)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._gbufferRenderPass = null;
      _this._gbufferRenderTargets = [];
      _this._gbufferFrameBuffer = null;
      _this._depth = null;
      _this._width = 0;
      _this._height = 0;
      return _this;
    }

    _createClass(GbufferFlow, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(GbufferFlow.prototype), "initialize", this).call(this, info);

        if (this._stages.length === 0) {
          var gbufferStage = new _gbufferStage.GbufferStage();
          gbufferStage.initialize(_gbufferStage.GbufferStage.initInfo);

          this._stages.push(gbufferStage);
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline) {
        _get(_getPrototypeOf(GbufferFlow.prototype), "activate", this).call(this, pipeline);

        var device = pipeline.device;
        this._width = device.width;
        this._height = device.height;

        if (!this._gbufferRenderPass) {
          var colorAttachment0 = new _index2.GFXColorAttachment();
          colorAttachment0.format = _index2.GFXFormat.RGBA32F;
          colorAttachment0.loadOp = _index2.GFXLoadOp.CLEAR; // should clear color attachment

          colorAttachment0.storeOp = _index2.GFXStoreOp.STORE;
          colorAttachment0.sampleCount = 1;
          colorAttachment0.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          colorAttachment0.endLayout = _index2.GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
          var colorAttachment1 = new _index2.GFXColorAttachment();
          colorAttachment1.format = _index2.GFXFormat.RGBA32F;
          colorAttachment1.loadOp = _index2.GFXLoadOp.CLEAR; // should clear color attachment

          colorAttachment1.storeOp = _index2.GFXStoreOp.STORE;
          colorAttachment1.sampleCount = 1;
          colorAttachment1.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          colorAttachment1.endLayout = _index2.GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
          var colorAttachment2 = new _index2.GFXColorAttachment();
          colorAttachment2.format = _index2.GFXFormat.RGBA32F;
          colorAttachment2.loadOp = _index2.GFXLoadOp.CLEAR; // should clear color attachment

          colorAttachment2.storeOp = _index2.GFXStoreOp.STORE;
          colorAttachment2.sampleCount = 1;
          colorAttachment2.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          colorAttachment2.endLayout = _index2.GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
          var colorAttachment3 = new _index2.GFXColorAttachment();
          colorAttachment3.format = _index2.GFXFormat.RGBA32F;
          colorAttachment3.loadOp = _index2.GFXLoadOp.CLEAR; // should clear color attachment

          colorAttachment3.storeOp = _index2.GFXStoreOp.STORE;
          colorAttachment3.sampleCount = 1;
          colorAttachment3.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          colorAttachment3.endLayout = _index2.GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
          var depthStencilAttachment = new _index2.GFXDepthStencilAttachment();
          depthStencilAttachment.format = device.depthStencilFormat;
          depthStencilAttachment.depthLoadOp = _index2.GFXLoadOp.CLEAR;
          depthStencilAttachment.depthStoreOp = _index2.GFXStoreOp.STORE;
          depthStencilAttachment.stencilLoadOp = _index2.GFXLoadOp.CLEAR;
          depthStencilAttachment.stencilStoreOp = _index2.GFXStoreOp.STORE;
          depthStencilAttachment.sampleCount = 1;
          depthStencilAttachment.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          depthStencilAttachment.endLayout = _index2.GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
          var renderPassInfo = new _index2.GFXRenderPassInfo([colorAttachment0, colorAttachment1, colorAttachment2, colorAttachment3], depthStencilAttachment);
          this._gbufferRenderPass = device.createRenderPass(renderPassInfo);
        }

        if (this._gbufferRenderTargets.length < 1) {
          this._gbufferRenderTargets.push(device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.COLOR_ATTACHMENT | _index2.GFXTextureUsageBit.SAMPLED, _index2.GFXFormat.RGBA32F, this._width, this._height)));

          this._gbufferRenderTargets.push(device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.COLOR_ATTACHMENT | _index2.GFXTextureUsageBit.SAMPLED, _index2.GFXFormat.RGBA32F, this._width, this._height)));

          this._gbufferRenderTargets.push(device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.COLOR_ATTACHMENT | _index2.GFXTextureUsageBit.SAMPLED, _index2.GFXFormat.RGBA32F, this._width, this._height)));

          this._gbufferRenderTargets.push(device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.COLOR_ATTACHMENT | _index2.GFXTextureUsageBit.SAMPLED, _index2.GFXFormat.RGBA32F, this._width, this._height)));
        }

        if (!this._depth) {
          this._depth = device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT, device.depthStencilFormat, this._width, this._height));
        }

        if (!this._gbufferFrameBuffer) {
          this._gbufferFrameBuffer = device.createFramebuffer(new _index2.GFXFramebufferInfo(this._gbufferRenderPass, this._gbufferRenderTargets, this._depth));
        }

        for (var i = 0; i < this._stages.length; ++i) {
          this._stages[i].setGbufferFrameBuffer(this._gbufferFrameBuffer);
        }
      }
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        pipeline.updateUBOs(view);

        _get(_getPrototypeOf(GbufferFlow.prototype), "render", this).call(this, view);

        pipeline.descriptorSet.bindTexture(_define.UNIFORM_GBUFFER_ALBEDOMAP_BINDING, this._gbufferFrameBuffer.colorTextures[0]);
        pipeline.descriptorSet.bindTexture(_define.UNIFORM_GBUFFER_POSITIONMAP_BINDING, this._gbufferFrameBuffer.colorTextures[1]);
        pipeline.descriptorSet.bindTexture(_define.UNIFORM_GBUFFER_NORMALMAP_BINDING, this._gbufferFrameBuffer.colorTextures[2]);
        pipeline.descriptorSet.bindTexture(_define.UNIFORM_GBUFFER_EMISSIVEMAP_BINDING, this._gbufferFrameBuffer.colorTextures[3]);
      }
    }]);

    return GbufferFlow;
  }(_renderFlow.RenderFlow), _class2.initInfo = {
    name: _define.PIPELINE_FLOW_GBUFFER,
    priority: _enum.DeferredFlowPriority.GBUFFER,
    stages: []
  }, _temp)) || _class);
  _exports.GbufferFlow = GbufferFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvZ2J1ZmZlci1mbG93LnRzIl0sIm5hbWVzIjpbIkdidWZmZXJGbG93IiwiX2didWZmZXJSZW5kZXJQYXNzIiwiX2didWZmZXJSZW5kZXJUYXJnZXRzIiwiX2didWZmZXJGcmFtZUJ1ZmZlciIsIl9kZXB0aCIsIl93aWR0aCIsIl9oZWlnaHQiLCJpbmZvIiwiX3N0YWdlcyIsImxlbmd0aCIsImdidWZmZXJTdGFnZSIsIkdidWZmZXJTdGFnZSIsImluaXRpYWxpemUiLCJpbml0SW5mbyIsInB1c2giLCJwaXBlbGluZSIsImRldmljZSIsIndpZHRoIiwiaGVpZ2h0IiwiY29sb3JBdHRhY2htZW50MCIsIkdGWENvbG9yQXR0YWNobWVudCIsImZvcm1hdCIsIkdGWEZvcm1hdCIsIlJHQkEzMkYiLCJsb2FkT3AiLCJHRlhMb2FkT3AiLCJDTEVBUiIsInN0b3JlT3AiLCJHRlhTdG9yZU9wIiwiU1RPUkUiLCJzYW1wbGVDb3VudCIsImJlZ2luTGF5b3V0IiwiR0ZYVGV4dHVyZUxheW91dCIsIlVOREVGSU5FRCIsImVuZExheW91dCIsIkNPTE9SX0FUVEFDSE1FTlRfT1BUSU1BTCIsImNvbG9yQXR0YWNobWVudDEiLCJjb2xvckF0dGFjaG1lbnQyIiwiY29sb3JBdHRhY2htZW50MyIsImRlcHRoU3RlbmNpbEF0dGFjaG1lbnQiLCJHRlhEZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiZGVwdGhTdGVuY2lsRm9ybWF0IiwiZGVwdGhMb2FkT3AiLCJkZXB0aFN0b3JlT3AiLCJzdGVuY2lsTG9hZE9wIiwic3RlbmNpbFN0b3JlT3AiLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlRfT1BUSU1BTCIsInJlbmRlclBhc3NJbmZvIiwiR0ZYUmVuZGVyUGFzc0luZm8iLCJjcmVhdGVSZW5kZXJQYXNzIiwiY3JlYXRlVGV4dHVyZSIsIkdGWFRleHR1cmVJbmZvIiwiR0ZYVGV4dHVyZVR5cGUiLCJURVgyRCIsIkdGWFRleHR1cmVVc2FnZUJpdCIsIkNPTE9SX0FUVEFDSE1FTlQiLCJTQU1QTEVEIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UIiwiY3JlYXRlRnJhbWVidWZmZXIiLCJHRlhGcmFtZWJ1ZmZlckluZm8iLCJpIiwic2V0R2J1ZmZlckZyYW1lQnVmZmVyIiwidmlldyIsIl9waXBlbGluZSIsInVwZGF0ZVVCT3MiLCJkZXNjcmlwdG9yU2V0IiwiYmluZFRleHR1cmUiLCJVTklGT1JNX0dCVUZGRVJfQUxCRURPTUFQX0JJTkRJTkciLCJjb2xvclRleHR1cmVzIiwiVU5JRk9STV9HQlVGRkVSX1BPU0lUSU9OTUFQX0JJTkRJTkciLCJVTklGT1JNX0dCVUZGRVJfTk9STUFMTUFQX0JJTkRJTkciLCJVTklGT1JNX0dCVUZGRVJfRU1JU1NJVkVNQVBfQklORElORyIsIlJlbmRlckZsb3ciLCJuYW1lIiwiUElQRUxJTkVfRkxPV19HQlVGRkVSIiwicHJpb3JpdHkiLCJEZWZlcnJlZEZsb3dQcmlvcml0eSIsIkdCVUZGRVIiLCJzdGFnZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBOzs7O01BS2FBLFcsV0FEWixvQkFBUSxhQUFSLEM7Ozs7Ozs7Ozs7Ozs7OztZQWFXQyxrQixHQUF5QyxJO1lBQ3pDQyxxQixHQUFzQyxFO1lBQ3RDQyxtQixHQUEyQyxJO1lBQzNDQyxNLEdBQTBCLEk7WUFDMUJDLE0sR0FBaUIsQztZQUNqQkMsTyxHQUFrQixDOzs7Ozs7aUNBRVBDLEksRUFBZ0M7QUFDL0Msb0ZBQWlCQSxJQUFqQjs7QUFDQSxZQUFJLEtBQUtDLE9BQUwsQ0FBYUMsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUMzQixjQUFNQyxZQUFZLEdBQUcsSUFBSUMsMEJBQUosRUFBckI7QUFDQUQsVUFBQUEsWUFBWSxDQUFDRSxVQUFiLENBQXdCRCwyQkFBYUUsUUFBckM7O0FBQ0EsZUFBS0wsT0FBTCxDQUFhTSxJQUFiLENB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cG9ydCB7IGNjY2xhc3MgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBQSVBFTElORV9GTE9XX0dCVUZGRVIsIFVOSUZPUk1fU0hBRE9XTUFQX0JJTkRJTkcsIFVOSUZPUk1fR0JVRkZFUl9BTEJFRE9NQVBfQklORElORywgXHJcbiAgICBVTklGT1JNX0dCVUZGRVJfUE9TSVRJT05NQVBfQklORElORywgVU5JRk9STV9HQlVGRkVSX05PUk1BTE1BUF9CSU5ESU5HLCBVTklGT1JNX0dCVUZGRVJfRU1JU1NJVkVNQVBfQklORElORyB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IElSZW5kZXJGbG93SW5mbywgUmVuZGVyRmxvdyB9IGZyb20gJy4uL3JlbmRlci1mbG93JztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgRGVmZXJyZWRGbG93UHJpb3JpdHkgfSBmcm9tICcuL2VudW0nO1xyXG5pbXBvcnQgeyBHYnVmZmVyU3RhZ2UgfSBmcm9tICcuL2didWZmZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBEZWZlcnJlZFBpcGVsaW5lIH0gZnJvbSAnLi9kZWZlcnJlZC1waXBlbGluZSc7XHJcbmltcG9ydCB7IFJlbmRlclBpcGVsaW5lIH0gZnJvbSAnLi4vcmVuZGVyLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgR0ZYRnJhbWVidWZmZXIsIEdGWFJlbmRlclBhc3MsIEdGWExvYWRPcCxcclxuICAgIEdGWFN0b3JlT3AsIEdGWFRleHR1cmVMYXlvdXQsIEdGWEZvcm1hdCwgR0ZYVGV4dHVyZSxcclxuICAgIEdGWFRleHR1cmVUeXBlLCBHRlhUZXh0dXJlVXNhZ2VCaXQsIEdGWENvbG9yQXR0YWNobWVudCwgR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCwgR0ZYUmVuZGVyUGFzc0luZm8sIEdGWFRleHR1cmVJbmZvLCBHRlhGcmFtZWJ1ZmZlckluZm8gfSBmcm9tICcuLi8uLi9nZngnO1xyXG4vKipcclxuICogQGVuIFRoZSBnYnVmZmVyIGZsb3cgaW4gZGVmZXJyZWQgcmVuZGVyIHBpcGVsaW5lXHJcbiAqIEB6aCDliY3lkJHmuLLmn5PmtYHnqIvjgIJcclxuICovXHJcbkBjY2NsYXNzKCdHYnVmZmVyRmxvdycpXHJcbmV4cG9ydCBjbGFzcyBHYnVmZmVyRmxvdyBleHRlbmRzIFJlbmRlckZsb3cge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBzaGFyZWQgaW5pdGlhbGl6YXRpb24gaW5mb3JtYXRpb24gb2YgZ2J1ZmZlciByZW5kZXIgZmxvd1xyXG4gICAgICogQHpoIOWFseS6q+eahOWJjeWQkea4suafk+a1geeoi+WIneWni+WMluWPguaVsFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRJbmZvOiBJUmVuZGVyRmxvd0luZm8gPSB7XHJcbiAgICAgICAgbmFtZTogUElQRUxJTkVfRkxPV19HQlVGRkVSLFxyXG4gICAgICAgIHByaW9yaXR5OiBEZWZlcnJlZEZsb3dQcmlvcml0eS5HQlVGRkVSLFxyXG4gICAgICAgIHN0YWdlczogW11cclxuICAgIH07XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2J1ZmZlclJlbmRlclBhc3M6IEdGWFJlbmRlclBhc3N8bnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9nYnVmZmVyUmVuZGVyVGFyZ2V0czogR0ZYVGV4dHVyZVtdID0gW107XHJcbiAgICBwcml2YXRlIF9nYnVmZmVyRnJhbWVCdWZmZXI6IEdGWEZyYW1lYnVmZmVyfG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfZGVwdGg6IEdGWFRleHR1cmV8bnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF93aWR0aDogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2hlaWdodDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlckZsb3dJbmZvKTogYm9vbGVhbiB7XHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZShpbmZvKTtcclxuICAgICAgICBpZiAodGhpcy5fc3RhZ2VzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBnYnVmZmVyU3RhZ2UgPSBuZXcgR2J1ZmZlclN0YWdlKCk7XHJcbiAgICAgICAgICAgIGdidWZmZXJTdGFnZS5pbml0aWFsaXplKEdidWZmZXJTdGFnZS5pbml0SW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YWdlcy5wdXNoKGdidWZmZXJTdGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocGlwZWxpbmU6IFJlbmRlclBpcGVsaW5lKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0aXZhdGUocGlwZWxpbmUpO1xyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSBwaXBlbGluZS5kZXZpY2U7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSBkZXZpY2Uud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gZGV2aWNlLmhlaWdodDtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuX2didWZmZXJSZW5kZXJQYXNzKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2xvckF0dGFjaG1lbnQwID0gbmV3IEdGWENvbG9yQXR0YWNobWVudCgpO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQwLmZvcm1hdCA9IEdGWEZvcm1hdC5SR0JBMzJGO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQwLmxvYWRPcCA9IEdGWExvYWRPcC5DTEVBUjsgLy8gc2hvdWxkIGNsZWFyIGNvbG9yIGF0dGFjaG1lbnRcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50MC5zdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50MC5zYW1wbGVDb3VudCA9IDE7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDAuYmVnaW5MYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlVOREVGSU5FRDtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50MC5lbmRMYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LkNPTE9SX0FUVEFDSE1FTlRfT1BUSU1BTDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yQXR0YWNobWVudDEgPSBuZXcgR0ZYQ29sb3JBdHRhY2htZW50KCk7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDEuZm9ybWF0ID0gR0ZYRm9ybWF0LlJHQkEzMkY7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDEubG9hZE9wID0gR0ZYTG9hZE9wLkNMRUFSOyAvLyBzaG91bGQgY2xlYXIgY29sb3IgYXR0YWNobWVudFxyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQxLnN0b3JlT3AgPSBHRlhTdG9yZU9wLlNUT1JFO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQxLnNhbXBsZUNvdW50ID0gMTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50MS5iZWdpbkxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuVU5ERUZJTkVEO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQxLmVuZExheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuQ09MT1JfQVRUQUNITUVOVF9PUFRJTUFMO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY29sb3JBdHRhY2htZW50MiA9IG5ldyBHRlhDb2xvckF0dGFjaG1lbnQoKTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50Mi5mb3JtYXQgPSBHRlhGb3JtYXQuUkdCQTMyRjtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50Mi5sb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7IC8vIHNob3VsZCBjbGVhciBjb2xvciBhdHRhY2htZW50XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDIuc3RvcmVPcCA9IEdGWFN0b3JlT3AuU1RPUkU7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDIuc2FtcGxlQ291bnQgPSAxO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQyLmJlZ2luTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5VTkRFRklORUQ7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDIuZW5kTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5DT0xPUl9BVFRBQ0hNRU5UX09QVElNQUw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2xvckF0dGFjaG1lbnQzID0gbmV3IEdGWENvbG9yQXR0YWNobWVudCgpO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQzLmZvcm1hdCA9IEdGWEZvcm1hdC5SR0JBMzJGO1xyXG4gICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQzLmxvYWRPcCA9IEdGWExvYWRPcC5DTEVBUjsgLy8gc2hvdWxkIGNsZWFyIGNvbG9yIGF0dGFjaG1lbnRcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50My5zdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50My5zYW1wbGVDb3VudCA9IDE7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudDMuYmVnaW5MYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlVOREVGSU5FRDtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50My5lbmRMYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LkNPTE9SX0FUVEFDSE1FTlRfT1BUSU1BTDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgPSBuZXcgR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCgpO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmZvcm1hdCA9IGRldmljZS5kZXB0aFN0ZW5jaWxGb3JtYXQ7XHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuZGVwdGhMb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7XHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuZGVwdGhTdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5zdGVuY2lsTG9hZE9wID0gR0ZYTG9hZE9wLkNMRUFSO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LnN0ZW5jaWxTdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5zYW1wbGVDb3VudCA9IDE7XHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuYmVnaW5MYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlVOREVGSU5FRDtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5lbmRMYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVF9PUFRJTUFMO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcmVuZGVyUGFzc0luZm8gPSBuZXcgR0ZYUmVuZGVyUGFzc0luZm8oW2NvbG9yQXR0YWNobWVudDAsIGNvbG9yQXR0YWNobWVudDEsIGNvbG9yQXR0YWNobWVudDIsIGNvbG9yQXR0YWNobWVudDNdLCBkZXB0aFN0ZW5jaWxBdHRhY2htZW50KTtcclxuICAgICAgICAgICAgdGhpcy5fZ2J1ZmZlclJlbmRlclBhc3MgPSBkZXZpY2UuY3JlYXRlUmVuZGVyUGFzcyhyZW5kZXJQYXNzSW5mbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLl9nYnVmZmVyUmVuZGVyVGFyZ2V0cy5sZW5ndGggPCAxKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2didWZmZXJSZW5kZXJUYXJnZXRzLnB1c2goZGV2aWNlLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVXNhZ2VCaXQuQ09MT1JfQVRUQUNITUVOVCB8IEdGWFRleHR1cmVVc2FnZUJpdC5TQU1QTEVELFxyXG4gICAgICAgICAgICAgICAgR0ZYRm9ybWF0LlJHQkEzMkYsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlaWdodCxcclxuICAgICAgICAgICAgKSkpO1xyXG4gICAgICAgICAgICB0aGlzLl9nYnVmZmVyUmVuZGVyVGFyZ2V0cy5wdXNoKGRldmljZS5jcmVhdGVUZXh0dXJlKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgICAgIEdGWFRleHR1cmVUeXBlLlRFWDJELFxyXG4gICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LkNPTE9SX0FUVEFDSE1FTlQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuU0FNUExFRCxcclxuICAgICAgICAgICAgICAgIEdGWEZvcm1hdC5SR0JBMzJGLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgICkpKTtcclxuICAgICAgICAgICAgdGhpcy5fZ2J1ZmZlclJlbmRlclRhcmdldHMucHVzaChkZXZpY2UuY3JlYXRlVGV4dHVyZShuZXcgR0ZYVGV4dHVyZUluZm8oXHJcbiAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgICAgIEdGWFRleHR1cmVVc2FnZUJpdC5DT0xPUl9BVFRBQ0hNRU5UIHwgR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQsXHJcbiAgICAgICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTMyRixcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICApKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2didWZmZXJSZW5kZXJUYXJnZXRzLnB1c2goZGV2aWNlLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVXNhZ2VCaXQuQ09MT1JfQVRUQUNITUVOVCB8IEdGWFRleHR1cmVVc2FnZUJpdC5TQU1QTEVELFxyXG4gICAgICAgICAgICAgICAgR0ZYRm9ybWF0LlJHQkEzMkYsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl93aWR0aCxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hlaWdodCxcclxuICAgICAgICAgICAgKSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMuX2RlcHRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlcHRoID0gZGV2aWNlLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVXNhZ2VCaXQuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5ULFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlLmRlcHRoU3RlbmNpbEZvcm1hdCxcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLl9nYnVmZmVyRnJhbWVCdWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2J1ZmZlckZyYW1lQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUZyYW1lYnVmZmVyKG5ldyBHRlhGcmFtZWJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9nYnVmZmVyUmVuZGVyUGFzcyxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2didWZmZXJSZW5kZXJUYXJnZXRzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVwdGgsXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zdGFnZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgKHRoaXMuX3N0YWdlc1tpXSBhcyBHYnVmZmVyU3RhZ2UpLnNldEdidWZmZXJGcmFtZUJ1ZmZlcih0aGlzLl9nYnVmZmVyRnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSB0aGlzLl9waXBlbGluZSBhcyBEZWZlcnJlZFBpcGVsaW5lO1xyXG4gICAgICAgIHBpcGVsaW5lLnVwZGF0ZVVCT3Modmlldyk7XHJcbiAgICAgICAgc3VwZXIucmVuZGVyKHZpZXcpO1xyXG4gICAgICAgIHBpcGVsaW5lLmRlc2NyaXB0b3JTZXQuYmluZFRleHR1cmUoVU5JRk9STV9HQlVGRkVSX0FMQkVET01BUF9CSU5ESU5HLCB0aGlzLl9nYnVmZmVyRnJhbWVCdWZmZXIhLmNvbG9yVGV4dHVyZXNbMF0hKTtcclxuICAgICAgICBwaXBlbGluZS5kZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKFVOSUZPUk1fR0JVRkZFUl9QT1NJVElPTk1BUF9CSU5ESU5HLCB0aGlzLl9nYnVmZmVyRnJhbWVCdWZmZXIhLmNvbG9yVGV4dHVyZXNbMV0hKTtcclxuICAgICAgICBwaXBlbGluZS5kZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKFVOSUZPUk1fR0JVRkZFUl9OT1JNQUxNQVBfQklORElORywgdGhpcy5fZ2J1ZmZlckZyYW1lQnVmZmVyIS5jb2xvclRleHR1cmVzWzJdISk7XHJcbiAgICAgICAgcGlwZWxpbmUuZGVzY3JpcHRvclNldC5iaW5kVGV4dHVyZShVTklGT1JNX0dCVUZGRVJfRU1JU1NJVkVNQVBfQklORElORywgdGhpcy5fZ2J1ZmZlckZyYW1lQnVmZmVyIS5jb2xvclRleHR1cmVzWzNdISk7XHJcblxyXG4gICAgfVxyXG59XHJcbiJdfQ==