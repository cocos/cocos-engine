(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../render-flow.js", "../forward/enum.js", "./shadow-stage.js", "../../gfx/index.js", "../pipeline-serialization.js", "../../renderer/scene/shadows.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../render-flow.js"), require("../forward/enum.js"), require("./shadow-stage.js"), require("../../gfx/index.js"), require("../pipeline-serialization.js"), require("../../renderer/scene/shadows.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.renderFlow, global._enum, global.shadowStage, global.index, global.pipelineSerialization, global.shadows);
    global.shadowFlow = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _renderFlow, _enum, _shadowStage, _index2, _pipelineSerialization, _shadows) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ShadowFlow = void 0;

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
   * @zh 阴影贴图绘制流程
   */
  var ShadowFlow = (_dec = (0, _index.ccclass)('ShadowFlow'), _dec(_class = (_temp = _class2 = /*#__PURE__*/function (_RenderFlow) {
    _inherits(ShadowFlow, _RenderFlow);

    function ShadowFlow() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ShadowFlow);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ShadowFlow)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._shadowRenderPass = null;
      _this._shadowRenderTargets = [];
      _this._shadowFrameBuffer = null;
      _this._depth = null;
      _this._width = 0;
      _this._height = 0;
      return _this;
    }

    _createClass(ShadowFlow, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(ShadowFlow.prototype), "initialize", this).call(this, info);

        if (this._stages.length === 0) {
          // add shadowMap-stages
          var shadowMapStage = new _shadowStage.ShadowStage();
          shadowMapStage.initialize(_shadowStage.ShadowStage.initInfo);

          this._stages.push(shadowMapStage);
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline) {
        _get(_getPrototypeOf(ShadowFlow.prototype), "activate", this).call(this, pipeline);

        var device = pipeline.device;
        var shadowMapSize = pipeline.shadows.size;
        this._width = shadowMapSize.x;
        this._height = shadowMapSize.y;

        if (!this._shadowRenderPass) {
          var colorAttachment = new _index2.GFXColorAttachment();
          colorAttachment.format = _index2.GFXFormat.RGBA8;
          colorAttachment.loadOp = _index2.GFXLoadOp.CLEAR; // should clear color attachment

          colorAttachment.storeOp = _index2.GFXStoreOp.STORE;
          colorAttachment.sampleCount = 1;
          colorAttachment.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          colorAttachment.endLayout = _index2.GFXTextureLayout.PRESENT_SRC;
          var depthStencilAttachment = new _index2.GFXDepthStencilAttachment();
          depthStencilAttachment.format = device.depthStencilFormat;
          depthStencilAttachment.depthLoadOp = _index2.GFXLoadOp.CLEAR;
          depthStencilAttachment.depthStoreOp = _index2.GFXStoreOp.STORE;
          depthStencilAttachment.stencilLoadOp = _index2.GFXLoadOp.CLEAR;
          depthStencilAttachment.stencilStoreOp = _index2.GFXStoreOp.STORE;
          depthStencilAttachment.sampleCount = 1;
          depthStencilAttachment.beginLayout = _index2.GFXTextureLayout.UNDEFINED;
          depthStencilAttachment.endLayout = _index2.GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
          var renderPassInfo = new _index2.GFXRenderPassInfo([colorAttachment], depthStencilAttachment);
          this._shadowRenderPass = device.createRenderPass(renderPassInfo);
        }

        if (this._shadowRenderTargets.length < 1) {
          this._shadowRenderTargets.push(device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.COLOR_ATTACHMENT | _index2.GFXTextureUsageBit.SAMPLED, _index2.GFXFormat.RGBA8, this._width, this._height)));
        }

        if (!this._depth) {
          this._depth = device.createTexture(new _index2.GFXTextureInfo(_index2.GFXTextureType.TEX2D, _index2.GFXTextureUsageBit.DEPTH_STENCIL_ATTACHMENT, device.depthStencilFormat, this._width, this._height));
        }

        if (!this._shadowFrameBuffer) {
          this._shadowFrameBuffer = device.createFramebuffer(new _index2.GFXFramebufferInfo(this._shadowRenderPass, this._shadowRenderTargets, this._depth));
        }

        for (var i = 0; i < this._stages.length; ++i) {
          this._stages[i].setShadowFrameBuffer(this._shadowFrameBuffer);
        }
      }
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        var shadowInfo = pipeline.shadows;

        if (shadowInfo.type !== _shadows.ShadowType.ShadowMap) {
          return;
        }

        var shadowMapSize = shadowInfo.size;

        if (this._width !== shadowMapSize.x || this._height !== shadowMapSize.y) {
          this.resizeShadowMap(shadowMapSize.x, shadowMapSize.y);
          this._width = shadowMapSize.x;
          this._height = shadowMapSize.y;
        }

        pipeline.updateUBOs(view);

        _get(_getPrototypeOf(ShadowFlow.prototype), "render", this).call(this, view);

        pipeline.descriptorSet.bindTexture(_define.UNIFORM_SHADOWMAP_BINDING, this._shadowFrameBuffer.colorTextures[0]);
      }
    }, {
      key: "resizeShadowMap",
      value: function resizeShadowMap(width, height) {
        if (this._depth) {
          this._depth.resize(width, height);
        }

        if (this._shadowRenderTargets.length > 0) {
          for (var i = 0; i < this._shadowRenderTargets.length; i++) {
            var renderTarget = this._shadowRenderTargets[i];

            if (renderTarget) {
              renderTarget.resize(width, height);
            }
          }
        }

        if (this._shadowFrameBuffer) {
          this._shadowFrameBuffer.destroy();

          this._shadowFrameBuffer.initialize(new _index2.GFXFramebufferInfo(this._shadowRenderPass, this._shadowRenderTargets, this._depth));
        }
      }
    }, {
      key: "shadowFrameBuffer",
      get: function get() {
        return this._shadowFrameBuffer;
      }
    }]);

    return ShadowFlow;
  }(_renderFlow.RenderFlow), _class2.initInfo = {
    name: _define.PIPELINE_FLOW_SHADOW,
    priority: _enum.ForwardFlowPriority.SHADOW,
    tag: _pipelineSerialization.RenderFlowTag.SCENE,
    stages: []
  }, _temp)) || _class);
  _exports.ShadowFlow = ShadowFlow;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvc2hhZG93L3NoYWRvdy1mbG93LnRzIl0sIm5hbWVzIjpbIlNoYWRvd0Zsb3ciLCJfc2hhZG93UmVuZGVyUGFzcyIsIl9zaGFkb3dSZW5kZXJUYXJnZXRzIiwiX3NoYWRvd0ZyYW1lQnVmZmVyIiwiX2RlcHRoIiwiX3dpZHRoIiwiX2hlaWdodCIsImluZm8iLCJfc3RhZ2VzIiwibGVuZ3RoIiwic2hhZG93TWFwU3RhZ2UiLCJTaGFkb3dTdGFnZSIsImluaXRpYWxpemUiLCJpbml0SW5mbyIsInB1c2giLCJwaXBlbGluZSIsImRldmljZSIsInNoYWRvd01hcFNpemUiLCJzaGFkb3dzIiwic2l6ZSIsIngiLCJ5IiwiY29sb3JBdHRhY2htZW50IiwiR0ZYQ29sb3JBdHRhY2htZW50IiwiZm9ybWF0IiwiR0ZYRm9ybWF0IiwiUkdCQTgiLCJsb2FkT3AiLCJHRlhMb2FkT3AiLCJDTEVBUiIsInN0b3JlT3AiLCJHRlhTdG9yZU9wIiwiU1RPUkUiLCJzYW1wbGVDb3VudCIsImJlZ2luTGF5b3V0IiwiR0ZYVGV4dHVyZUxheW91dCIsIlVOREVGSU5FRCIsImVuZExheW91dCIsIlBSRVNFTlRfU1JDIiwiZGVwdGhTdGVuY2lsQXR0YWNobWVudCIsIkdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQiLCJkZXB0aFN0ZW5jaWxGb3JtYXQiLCJkZXB0aExvYWRPcCIsImRlcHRoU3RvcmVPcCIsInN0ZW5jaWxMb2FkT3AiLCJzdGVuY2lsU3RvcmVPcCIsIkRFUFRIX1NURU5DSUxfQVRUQUNITUVOVF9PUFRJTUFMIiwicmVuZGVyUGFzc0luZm8iLCJHRlhSZW5kZXJQYXNzSW5mbyIsImNyZWF0ZVJlbmRlclBhc3MiLCJjcmVhdGVUZXh0dXJlIiwiR0ZYVGV4dHVyZUluZm8iLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiR0ZYVGV4dHVyZVVzYWdlQml0IiwiQ09MT1JfQVRUQUNITUVOVCIsIlNBTVBMRUQiLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsIkdGWEZyYW1lYnVmZmVySW5mbyIsImkiLCJzZXRTaGFkb3dGcmFtZUJ1ZmZlciIsInZpZXciLCJfcGlwZWxpbmUiLCJzaGFkb3dJbmZvIiwidHlwZSIsIlNoYWRvd1R5cGUiLCJTaGFkb3dNYXAiLCJyZXNpemVTaGFkb3dNYXAiLCJ1cGRhdGVVQk9zIiwiZGVzY3JpcHRvclNldCIsImJpbmRUZXh0dXJlIiwiVU5JRk9STV9TSEFET1dNQVBfQklORElORyIsImNvbG9yVGV4dHVyZXMiLCJ3aWR0aCIsImhlaWdodCIsInJlc2l6ZSIsInJlbmRlclRhcmdldCIsImRlc3Ryb3kiLCJSZW5kZXJGbG93IiwibmFtZSIsIlBJUEVMSU5FX0ZMT1dfU0hBRE9XIiwicHJpb3JpdHkiLCJGb3J3YXJkRmxvd1ByaW9yaXR5IiwiU0hBRE9XIiwidGFnIiwiUmVuZGVyRmxvd1RhZyIsIlNDRU5FIiwic3RhZ2VzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlCQTs7O01BSWFBLFUsV0FEWixvQkFBUSxZQUFSLEM7Ozs7Ozs7Ozs7Ozs7OztZQWNXQyxpQixHQUF3QyxJO1lBQ3hDQyxvQixHQUFxQyxFO1lBQ3JDQyxrQixHQUEwQyxJO1lBQzFDQyxNLEdBQTBCLEk7WUFDMUJDLE0sR0FBaUIsQztZQUNqQkMsTyxHQUFrQixDOzs7Ozs7aUNBRVBDLEksRUFBK0I7QUFDOUMsbUZBQWlCQSxJQUFqQjs7QUFDQSxZQUFJLEtBQUtDLE9BQUwsQ0FBYUMsTUFBYixLQUF3QixDQUE1QixFQUErQjtBQUMzQjtBQUNBLGNBQU1DLGNBQWMsR0FBRyxJQUFJQyx3QkFBSixFQUF2QjtBQUNBRCxVQUFBQSxjQUFjLENBQUNFLFVBQWYsQ0FBMEJELHlCQUFZRSxRQUF0Qzs7QUFDQSxlQUFLTCxPQUFMLENBQWFNLElBQWIsQ0FBa0JKLGNBQWxCO0FBQ0g7O0FBQ0QsZUFBTyxJQUFQ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LENBQVl3RSxNQUFaLENBQW1CRixLQUFuQixFQUEwQkMsTUFBMUI7QUFDSDs7QUFFRCxZQUFJLEtBQUt6RSxvQkFBTCxDQUEwQk8sTUFBMUIsR0FBbUMsQ0FBdkMsRUFBMEM7QUFDdEMsZUFBSyxJQUFJbUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRSxLQUFLMUQsb0JBQUwsQ0FBMEJPLE1BQTdDLEVBQXFEbUQsQ0FBQyxFQUF0RCxFQUEwRDtBQUN0RCxnQkFBTWlCLFlBQVksR0FBRyxLQUFLM0Usb0JBQUwsQ0FBMEIwRCxDQUExQixDQUFyQjs7QUFDQSxnQkFBSWlCLFlBQUosRUFBa0I7QUFBRUEsY0FBQUEsWUFBWSxDQUFDRCxNQUFiLENBQW9CRixLQUFwQixFQUEyQkMsTUFBM0I7QUFBcUM7QUFDNUQ7QUFDSjs7QUFFRCxZQUFHLEtBQUt4RSxrQkFBUixFQUE0QjtBQUN4QixlQUFLQSxrQkFBTCxDQUF3QjJFLE9BQXhCOztBQUNBLGVBQUszRSxrQkFBTCxDQUF3QlMsVUFBeEIsQ0FBbUMsSUFBSStDLDBCQUFKLENBQy9CLEtBQUsxRCxpQkFEMEIsRUFFL0IsS0FBS0Msb0JBRjBCLEVBRy9CLEtBQUtFLE1BSDBCLENBQW5DO0FBS0g7QUFDSjs7OzBCQW5JK0I7QUFDNUIsZUFBTyxLQUFLRCxrQkFBWjtBQUNIOzs7O0lBSjJCNEUsc0IsV0FNZGxFLFEsR0FBNEI7QUFDdENtRSxJQUFBQSxJQUFJLEVBQUVDLDRCQURnQztBQUV0Q0MsSUFBQUEsUUFBUSxFQUFFQywwQkFBb0JDLE1BRlE7QUFHdENDLElBQUFBLEdBQUcsRUFBRUMscUNBQWNDLEtBSG1CO0FBSXRDQyxJQUFBQSxNQUFNLEVBQUU7QUFKOEIsRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmUuZm9yd2FyZFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBQSVBFTElORV9GTE9XX1NIQURPVywgVU5JRk9STV9TSEFET1dNQVBfQklORElORyB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IElSZW5kZXJGbG93SW5mbywgUmVuZGVyRmxvdyB9IGZyb20gJy4uL3JlbmRlci1mbG93JztcclxuaW1wb3J0IHsgRm9yd2FyZEZsb3dQcmlvcml0eSB9IGZyb20gJy4uL2ZvcndhcmQvZW51bSc7XHJcbmltcG9ydCB7IFNoYWRvd1N0YWdlIH0gZnJvbSAnLi9zaGFkb3ctc3RhZ2UnO1xyXG5pbXBvcnQgeyBHRlhGcmFtZWJ1ZmZlciwgR0ZYUmVuZGVyUGFzcywgR0ZYTG9hZE9wLFxyXG4gICAgR0ZYU3RvcmVPcCwgR0ZYVGV4dHVyZUxheW91dCwgR0ZYRm9ybWF0LCBHRlhUZXh0dXJlLFxyXG4gICAgR0ZYVGV4dHVyZVR5cGUsIEdGWFRleHR1cmVVc2FnZUJpdCwgR0ZYQ29sb3JBdHRhY2htZW50LCBHRlhEZXB0aFN0ZW5jaWxBdHRhY2htZW50LCBHRlhSZW5kZXJQYXNzSW5mbywgR0ZYVGV4dHVyZUluZm8sIEdGWEZyYW1lYnVmZmVySW5mbyB9IGZyb20gJy4uLy4uL2dmeCc7XHJcbmltcG9ydCB7IFJlbmRlckZsb3dUYWcgfSBmcm9tICcuLi9waXBlbGluZS1zZXJpYWxpemF0aW9uJztcclxuaW1wb3J0IHsgRm9yd2FyZFBpcGVsaW5lIH0gZnJvbSAnLi4vZm9yd2FyZC9mb3J3YXJkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgU2hhZG93VHlwZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3NjZW5lL3NoYWRvd3MnO1xyXG5cclxuLyoqXHJcbiAqIEB6aCDpmLTlvbHotLTlm77nu5jliLbmtYHnqItcclxuICovXHJcbkBjY2NsYXNzKCdTaGFkb3dGbG93JylcclxuZXhwb3J0IGNsYXNzIFNoYWRvd0Zsb3cgZXh0ZW5kcyBSZW5kZXJGbG93IHtcclxuXHJcbiAgICBwdWJsaWMgZ2V0IHNoYWRvd0ZyYW1lQnVmZmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhZG93RnJhbWVCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0SW5mbzogSVJlbmRlckZsb3dJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6IFBJUEVMSU5FX0ZMT1dfU0hBRE9XLFxyXG4gICAgICAgIHByaW9yaXR5OiBGb3J3YXJkRmxvd1ByaW9yaXR5LlNIQURPVyxcclxuICAgICAgICB0YWc6IFJlbmRlckZsb3dUYWcuU0NFTkUsXHJcbiAgICAgICAgc3RhZ2VzOiBbXVxyXG4gICAgfTtcclxuXHJcbiAgICBwcml2YXRlIF9zaGFkb3dSZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzfG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfc2hhZG93UmVuZGVyVGFyZ2V0czogR0ZYVGV4dHVyZVtdID0gW107XHJcbiAgICBwcml2YXRlIF9zaGFkb3dGcmFtZUJ1ZmZlcjogR0ZYRnJhbWVidWZmZXJ8bnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9kZXB0aDogR0ZYVGV4dHVyZXxudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyRmxvd0luZm8pOiBib29sZWFue1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3N0YWdlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gYWRkIHNoYWRvd01hcC1zdGFnZXNcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93TWFwU3RhZ2UgPSBuZXcgU2hhZG93U3RhZ2UoKTtcclxuICAgICAgICAgICAgc2hhZG93TWFwU3RhZ2UuaW5pdGlhbGl6ZShTaGFkb3dTdGFnZS5pbml0SW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3N0YWdlcy5wdXNoKHNoYWRvd01hcFN0YWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlIChwaXBlbGluZTogRm9yd2FyZFBpcGVsaW5lKSB7XHJcbiAgICAgICAgc3VwZXIuYWN0aXZhdGUocGlwZWxpbmUpO1xyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSBwaXBlbGluZS5kZXZpY2U7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93TWFwU2l6ZSA9IHBpcGVsaW5lLnNoYWRvd3Muc2l6ZTtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHNoYWRvd01hcFNpemUueDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSBzaGFkb3dNYXBTaXplLnk7XHJcblxyXG4gICAgICAgIGlmKCF0aGlzLl9zaGFkb3dSZW5kZXJQYXNzKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBjb2xvckF0dGFjaG1lbnQgPSBuZXcgR0ZYQ29sb3JBdHRhY2htZW50KCk7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudC5mb3JtYXQgPSBHRlhGb3JtYXQuUkdCQTg7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudC5sb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7IC8vIHNob3VsZCBjbGVhciBjb2xvciBhdHRhY2htZW50XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudC5zdG9yZU9wID0gR0ZYU3RvcmVPcC5TVE9SRTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50LnNhbXBsZUNvdW50ID0gMTtcclxuICAgICAgICAgICAgY29sb3JBdHRhY2htZW50LmJlZ2luTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5VTkRFRklORUQ7XHJcbiAgICAgICAgICAgIGNvbG9yQXR0YWNobWVudC5lbmRMYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlBSRVNFTlRfU1JDO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IG5ldyBHRlhEZXB0aFN0ZW5jaWxBdHRhY2htZW50KCk7XHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuZm9ybWF0ID0gZGV2aWNlLmRlcHRoU3RlbmNpbEZvcm1hdDtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5kZXB0aExvYWRPcCA9IEdGWExvYWRPcC5DTEVBUjtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5kZXB0aFN0b3JlT3AgPSBHRlhTdG9yZU9wLlNUT1JFO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LnN0ZW5jaWxMb2FkT3AgPSBHRlhMb2FkT3AuQ0xFQVI7XHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuc3RlbmNpbFN0b3JlT3AgPSBHRlhTdG9yZU9wLlNUT1JFO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LnNhbXBsZUNvdW50ID0gMTtcclxuICAgICAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5iZWdpbkxheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuVU5ERUZJTkVEO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmVuZExheW91dCA9IEdGWFRleHR1cmVMYXlvdXQuREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUw7XHJcblxyXG4gICAgICAgICAgICBjb25zdCByZW5kZXJQYXNzSW5mbyA9IG5ldyBHRlhSZW5kZXJQYXNzSW5mbyhbY29sb3JBdHRhY2htZW50XSwgZGVwdGhTdGVuY2lsQXR0YWNobWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvd1JlbmRlclBhc3MgPSBkZXZpY2UuY3JlYXRlUmVuZGVyUGFzcyhyZW5kZXJQYXNzSW5mbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLl9zaGFkb3dSZW5kZXJUYXJnZXRzLmxlbmd0aCA8IDEpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhZG93UmVuZGVyVGFyZ2V0cy5wdXNoKGRldmljZS5jcmVhdGVUZXh0dXJlKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgICAgIEdGWFRleHR1cmVUeXBlLlRFWDJELFxyXG4gICAgICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LkNPTE9SX0FUVEFDSE1FTlQgfCBHRlhUZXh0dXJlVXNhZ2VCaXQuU0FNUExFRCxcclxuICAgICAgICAgICAgICAgIEdGWEZvcm1hdC5SR0JBOCxcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpZHRoLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5faGVpZ2h0LFxyXG4gICAgICAgICAgICApKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighdGhpcy5fZGVwdGgpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVwdGggPSBkZXZpY2UuY3JlYXRlVGV4dHVyZShuZXcgR0ZYVGV4dHVyZUluZm8oXHJcbiAgICAgICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgICAgIEdGWFRleHR1cmVVc2FnZUJpdC5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQsXHJcbiAgICAgICAgICAgICAgICBkZXZpY2UuZGVwdGhTdGVuY2lsRm9ybWF0LFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2lkdGgsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHQsXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoIXRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyID0gZGV2aWNlLmNyZWF0ZUZyYW1lYnVmZmVyKG5ldyBHRlhGcmFtZWJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkb3dSZW5kZXJQYXNzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93UmVuZGVyVGFyZ2V0cyxcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3RhZ2VzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICh0aGlzLl9zdGFnZXNbaV0gYXMgU2hhZG93U3RhZ2UpLnNldFNoYWRvd0ZyYW1lQnVmZmVyKHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlldzogUmVuZGVyVmlldykge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5fcGlwZWxpbmUgYXMgRm9yd2FyZFBpcGVsaW5lO1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd0luZm8gPSBwaXBlbGluZS5zaGFkb3dzO1xyXG4gICAgICAgIGlmIChzaGFkb3dJbmZvLnR5cGUgIT09IFNoYWRvd1R5cGUuU2hhZG93TWFwKSB7IHJldHVybjsgfVxyXG5cclxuICAgICAgICBjb25zdCBzaGFkb3dNYXBTaXplID0gc2hhZG93SW5mby5zaXplO1xyXG4gICAgICAgIGlmICh0aGlzLl93aWR0aCAhPT0gc2hhZG93TWFwU2l6ZS54IHx8IHRoaXMuX2hlaWdodCAhPT0gc2hhZG93TWFwU2l6ZS55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplU2hhZG93TWFwKHNoYWRvd01hcFNpemUueCxzaGFkb3dNYXBTaXplLnkpO1xyXG4gICAgICAgICAgICB0aGlzLl93aWR0aCA9IHNoYWRvd01hcFNpemUueDtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0ID0gc2hhZG93TWFwU2l6ZS55O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcGlwZWxpbmUudXBkYXRlVUJPcyh2aWV3KTtcclxuICAgICAgICBzdXBlci5yZW5kZXIodmlldyk7XHJcbiAgICAgICAgcGlwZWxpbmUuZGVzY3JpcHRvclNldC5iaW5kVGV4dHVyZShVTklGT1JNX1NIQURPV01BUF9CSU5ESU5HLCB0aGlzLl9zaGFkb3dGcmFtZUJ1ZmZlciEuY29sb3JUZXh0dXJlc1swXSEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgcmVzaXplU2hhZG93TWFwICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9kZXB0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXB0aC5yZXNpemUod2lkdGgsIGhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fc2hhZG93UmVuZGVyVGFyZ2V0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpPCB0aGlzLl9zaGFkb3dSZW5kZXJUYXJnZXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZW5kZXJUYXJnZXQgPSB0aGlzLl9zaGFkb3dSZW5kZXJUYXJnZXRzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlbmRlclRhcmdldCkgeyByZW5kZXJUYXJnZXQucmVzaXplKHdpZHRoLCBoZWlnaHQpOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYWRvd0ZyYW1lQnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fc2hhZG93RnJhbWVCdWZmZXIuaW5pdGlhbGl6ZShuZXcgR0ZYRnJhbWVidWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhZG93UmVuZGVyUGFzcyEsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkb3dSZW5kZXJUYXJnZXRzLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVwdGgsXHJcbiAgICAgICAgICAgICkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=