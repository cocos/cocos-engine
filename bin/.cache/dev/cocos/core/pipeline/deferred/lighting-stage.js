(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../pass-phase.js", "../render-queue.js", "../../gfx/define.js", "../pipeline-funcs.js", "../render-stage.js", "./enum.js", "../pipeline-serialization.js", "./planar-shadow-queue.js", "../../assets/material.js", "../../renderer/core/memory-pools.js", "../pipeline-state-manager.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../pass-phase.js"), require("../render-queue.js"), require("../../gfx/define.js"), require("../pipeline-funcs.js"), require("../render-stage.js"), require("./enum.js"), require("../pipeline-serialization.js"), require("./planar-shadow-queue.js"), require("../../assets/material.js"), require("../../renderer/core/memory-pools.js"), require("../pipeline-state-manager.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.passPhase, global.renderQueue, global.define, global.pipelineFuncs, global.renderStage, global._enum, global.pipelineSerialization, global.planarShadowQueue, global.material, global.memoryPools, global.pipelineStateManager);
    global.lightingStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _passPhase, _renderQueue, _define2, _pipelineFuncs, _renderStage, _enum, _pipelineSerialization, _planarShadowQueue, _material, _memoryPools, _pipelineStateManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LightingStage = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var colors = [new _define2.GFXColor(0, 0, 0, 1)];
  var LIGHTINGPASS_INDEX = 1;
  /**
   * @en The lighting render stage
   * @zh 前向渲染阶段。
   */

  var LightingStage = (_dec = (0, _index.ccclass)('LightingStage'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderQueueDesc]), _dec3 = (0, _index.displayOrder)(2), _dec4 = (0, _index.type)(_material.Material), _dec5 = (0, _index.displayOrder)(3), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderStage) {
    _inherits(LightingStage, _RenderStage);

    _createClass(LightingStage, [{
      key: "material",
      set: function set(val) {
        if (this._deferredMaterial === val) {
          return;
        }

        this._deferredMaterial = val;
      }
    }]);

    function LightingStage() {
      var _this;

      _classCallCheck(this, LightingStage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LightingStage).call(this));

      _initializerDefineProperty(_this, "renderQueues", _descriptor, _assertThisInitialized(_this));

      _this._renderQueues = [];
      _this._renderArea = new _define2.GFXRect();

      _initializerDefineProperty(_this, "_deferredMaterial", _descriptor2, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(LightingStage, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(LightingStage.prototype), "initialize", this).call(this, info);

        if (info.renderQueues) {
          this.renderQueues = info.renderQueues;
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        _get(_getPrototypeOf(LightingStage.prototype), "activate", this).call(this, pipeline, flow);

        for (var i = 0; i < this.renderQueues.length; i++) {
          var phase = 0;

          for (var j = 0; j < this.renderQueues[i].stages.length; j++) {
            phase |= (0, _passPhase.getPhaseID)(this.renderQueues[i].stages[j]);
          }

          var sortFunc = _renderQueue.opaqueCompareFn;

          switch (this.renderQueues[i].sortMode) {
            case _pipelineSerialization.RenderQueueSortMode.BACK_TO_FRONT:
              sortFunc = _renderQueue.transparentCompareFn;
              break;

            case _pipelineSerialization.RenderQueueSortMode.FRONT_TO_BACK:
              sortFunc = _renderQueue.opaqueCompareFn;
              break;
          }

          this._renderQueues[i] = new _renderQueue.RenderQueue({
            isTransparent: this.renderQueues[i].isTransparent,
            phases: phase,
            sortFunc: sortFunc
          });
        }

        this._planarQueue = new _planarShadowQueue.PlanarShadowQueue(this._pipeline);
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "render",
      value: function render(view) {
        var pipeline = this._pipeline;
        var device = pipeline.device;
        var cmdBuff = pipeline.commandBuffers[0];
        var camera = view.camera;
        var vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width * pipeline.shadingScale;
        this._renderArea.height = vp.height * camera.height * pipeline.shadingScale;

        if (camera.clearFlag & _define2.GFXClearFlag.COLOR) {
          if (pipeline.isHDR) {
            (0, _pipelineFuncs.SRGBToLinear)(colors[0], camera.clearColor);
            var scale = pipeline.fpScale / camera.exposure;
            colors[0].x *= scale;
            colors[0].y *= scale;
            colors[0].z *= scale;
          } else {
            colors[0].x = camera.clearColor.x;
            colors[0].y = camera.clearColor.y;
            colors[0].z = camera.clearColor.z;
          }
        }

        colors[0].w = camera.clearColor.w;
        var framebuffer = view.window.framebuffer;
        var renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define.SetIndex.GLOBAL, pipeline.descriptorSet);
        var hPass = this._deferredMaterial.passes[LIGHTINGPASS_INDEX].handle;

        var shader = _memoryPools.ShaderPool.get(this._deferredMaterial.passes[LIGHTINGPASS_INDEX].getShaderVariant());

        var inputAssembler = pipeline.quadIA;
        var pso = null;

        if (hPass != null && shader != null && inputAssembler != null) {
          pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, inputAssembler);
        }

        if (pso != null) {
          cmdBuff.bindPipelineState(pso);
          cmdBuff.bindInputAssembler(inputAssembler);
          cmdBuff.draw(inputAssembler);
        }

        cmdBuff.endRenderPass();
      }
      /**
       * @en Clear the given render queue
       * @zh 清空指定的渲染队列
       * @param rq The render queue
       */

    }, {
      key: "renderQueueClearFunc",
      value: function renderQueueClearFunc(rq) {
        rq.clear();
      }
      /**
       * @en Sort the given render queue
       * @zh 对指定的渲染队列执行排序
       * @param rq The render queue
       */

    }, {
      key: "renderQueueSortFunc",
      value: function renderQueueSortFunc(rq) {
        rq.sort();
      }
    }]);

    return LightingStage;
  }(_renderStage.RenderStage), _class3.initInfo = {
    name: 'LightingStage',
    priority: _enum.DeferredStagePriority.LIGHTING,
    tag: 0,
    renderQueues: [{
      isTransparent: false,
      sortMode: _pipelineSerialization.RenderQueueSortMode.FRONT_TO_BACK,
      stages: ['default']
    }, {
      isTransparent: true,
      sortMode: _pipelineSerialization.RenderQueueSortMode.BACK_TO_FRONT,
      stages: ['default', 'planarShadow']
    }]
  }, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderQueues", [_dec2, _index.serializable, _dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_deferredMaterial", [_dec4, _index.serializable, _dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  })), _class2)) || _class);
  _exports.LightingStage = LightingStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvbGlnaHRpbmctc3RhZ2UudHMiXSwibmFtZXMiOlsiY29sb3JzIiwiR0ZYQ29sb3IiLCJMSUdIVElOR1BBU1NfSU5ERVgiLCJMaWdodGluZ1N0YWdlIiwiUmVuZGVyUXVldWVEZXNjIiwiTWF0ZXJpYWwiLCJ2YWwiLCJfZGVmZXJyZWRNYXRlcmlhbCIsIl9yZW5kZXJRdWV1ZXMiLCJfcmVuZGVyQXJlYSIsIkdGWFJlY3QiLCJpbmZvIiwicmVuZGVyUXVldWVzIiwicGlwZWxpbmUiLCJmbG93IiwiaSIsImxlbmd0aCIsInBoYXNlIiwiaiIsInN0YWdlcyIsInNvcnRGdW5jIiwib3BhcXVlQ29tcGFyZUZuIiwic29ydE1vZGUiLCJSZW5kZXJRdWV1ZVNvcnRNb2RlIiwiQkFDS19UT19GUk9OVCIsInRyYW5zcGFyZW50Q29tcGFyZUZuIiwiRlJPTlRfVE9fQkFDSyIsIlJlbmRlclF1ZXVlIiwiaXNUcmFuc3BhcmVudCIsInBoYXNlcyIsIl9wbGFuYXJRdWV1ZSIsIlBsYW5hclNoYWRvd1F1ZXVlIiwiX3BpcGVsaW5lIiwidmlldyIsImRldmljZSIsImNtZEJ1ZmYiLCJjb21tYW5kQnVmZmVycyIsImNhbWVyYSIsInZwIiwidmlld3BvcnQiLCJ4Iiwid2lkdGgiLCJ5IiwiaGVpZ2h0Iiwic2hhZGluZ1NjYWxlIiwiY2xlYXJGbGFnIiwiR0ZYQ2xlYXJGbGFnIiwiQ09MT1IiLCJpc0hEUiIsImNsZWFyQ29sb3IiLCJzY2FsZSIsImZwU2NhbGUiLCJleHBvc3VyZSIsInoiLCJ3IiwiZnJhbWVidWZmZXIiLCJ3aW5kb3ciLCJyZW5kZXJQYXNzIiwiY29sb3JUZXh0dXJlcyIsImdldFJlbmRlclBhc3MiLCJiZWdpblJlbmRlclBhc3MiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwiYmluZERlc2NyaXB0b3JTZXQiLCJTZXRJbmRleCIsIkdMT0JBTCIsImRlc2NyaXB0b3JTZXQiLCJoUGFzcyIsInBhc3NlcyIsImhhbmRsZSIsInNoYWRlciIsIlNoYWRlclBvb2wiLCJnZXQiLCJnZXRTaGFkZXJWYXJpYW50IiwiaW5wdXRBc3NlbWJsZXIiLCJxdWFkSUEiLCJwc28iLCJQaXBlbGluZVN0YXRlTWFuYWdlciIsImdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZSIsImJpbmRQaXBlbGluZVN0YXRlIiwiYmluZElucHV0QXNzZW1ibGVyIiwiZHJhdyIsImVuZFJlbmRlclBhc3MiLCJycSIsImNsZWFyIiwic29ydCIsIlJlbmRlclN0YWdlIiwiaW5pdEluZm8iLCJuYW1lIiwicHJpb3JpdHkiLCJEZWZlcnJlZFN0YWdlUHJpb3JpdHkiLCJMSUdIVElORyIsInRhZyIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF3QkEsTUFBTUEsTUFBa0IsR0FBRyxDQUFFLElBQUlDLGlCQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFGLENBQTNCO0FBQ0EsTUFBTUMsa0JBQWtCLEdBQUcsQ0FBM0I7QUFFQTs7Ozs7TUFLYUMsYSxXQURaLG9CQUFRLGVBQVIsQyxVQXNCSSxpQkFBSyxDQUFDQyxzQ0FBRCxDQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEMsVUFRQSxpQkFBS0Msa0JBQUwsQyxVQUVBLHlCQUFhLENBQWIsQzs7Ozs7d0JBR2FDLEcsRUFBSztBQUNmLFlBQUksS0FBS0MsaUJBQUwsS0FBMkJELEdBQS9CLEVBQW9DO0FBQ2hDO0FBQ0g7O0FBRUQsYUFBS0MsaUJBQUwsR0FBeUJELEdBQXpCO0FBQ0g7OztBQUVELDZCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7O0FBRFc7O0FBQUEsWUFuQkxFLGFBbUJLLEdBbkIwQixFQW1CMUI7QUFBQSxZQWpCUEMsV0FpQk8sR0FqQk8sSUFBSUMsZ0JBQUosRUFpQlA7O0FBQUE7O0FBQUE7QUFFZDs7OztpQ0FF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SUFBQUEsR0FBRyxFQUFFLENBSGtDO0FBSXZDaEYsSUFBQUEsWUFBWSxFQUFFLENBQ1Y7QUFDSWdCLE1BQUFBLGFBQWEsRUFBRSxLQURuQjtBQUVJTixNQUFBQSxRQUFRLEVBQUVDLDJDQUFvQkcsYUFGbEM7QUFHSVAsTUFBQUEsTUFBTSxFQUFFLENBQUMsU0FBRDtBQUhaLEtBRFUsRUFNVjtBQUNJUyxNQUFBQSxhQUFhLEVBQUUsSUFEbkI7QUFFSU4sTUFBQUEsUUFBUSxFQUFFQywyQ0FBb0JDLGFBRmxDO0FBR0lMLE1BQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsRUFBWSxjQUFaO0FBSFosS0FOVTtBQUp5QixHLDhGQW9CMUMwRSxtQjs7Ozs7YUFFMkMsRTs7K0ZBUTNDQSxtQjs7Ozs7YUFFNEMsSSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IElSZW5kZXJQYXNzLCBTZXRJbmRleCB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IGdldFBoYXNlSUQgfSBmcm9tICcuLi9wYXNzLXBoYXNlJztcclxuaW1wb3J0IHsgb3BhcXVlQ29tcGFyZUZuLCBSZW5kZXJRdWV1ZSwgdHJhbnNwYXJlbnRDb21wYXJlRm4gfSBmcm9tICcuLi9yZW5kZXItcXVldWUnO1xyXG5pbXBvcnQgeyBHRlhDbGVhckZsYWcsIEdGWENvbG9yLCBHRlhSZWN0IH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IFNSR0JUb0xpbmVhciB9IGZyb20gJy4uL3BpcGVsaW5lLWZ1bmNzJztcclxuaW1wb3J0IHsgSVJlbmRlclN0YWdlSW5mbywgUmVuZGVyU3RhZ2UgfSBmcm9tICcuLi9yZW5kZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBEZWZlcnJlZFN0YWdlUHJpb3JpdHkgfSBmcm9tICcuL2VudW0nO1xyXG5pbXBvcnQgeyBSZW5kZXJBZGRpdGl2ZUxpZ2h0UXVldWUgfSBmcm9tICcuLi9yZW5kZXItYWRkaXRpdmUtbGlnaHQtcXVldWUnO1xyXG5pbXBvcnQgeyBMaWdodGluZ0Zsb3cgfSBmcm9tICcuL2xpZ2h0aW5nLWZsb3cnO1xyXG5pbXBvcnQgeyBEZWZlcnJlZFBpcGVsaW5lIH0gZnJvbSAnLi9kZWZlcnJlZC1waXBlbGluZSc7XHJcbmltcG9ydCB7IFJlbmRlclF1ZXVlRGVzYywgUmVuZGVyUXVldWVTb3J0TW9kZSB9IGZyb20gJy4uL3BpcGVsaW5lLXNlcmlhbGl6YXRpb24nO1xyXG5pbXBvcnQgeyBQbGFuYXJTaGFkb3dRdWV1ZSB9IGZyb20gJy4vcGxhbmFyLXNoYWRvdy1xdWV1ZSc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgU2hhZGVyUG9vbCB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuaW1wb3J0IHsgUGlwZWxpbmVTdGF0ZU1hbmFnZXIgfSBmcm9tICcuLi9waXBlbGluZS1zdGF0ZS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgR0ZYUGlwZWxpbmVTdGF0ZSB9IGZyb20gJy4uLy4uL2dmeC9waXBlbGluZS1zdGF0ZSc7XHJcblxyXG5cclxuY29uc3QgY29sb3JzOiBHRlhDb2xvcltdID0gWyBuZXcgR0ZYQ29sb3IoMCwgMCwgMCwgMSkgXTtcclxuY29uc3QgTElHSFRJTkdQQVNTX0lOREVYID0gMTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGxpZ2h0aW5nIHJlbmRlciBzdGFnZVxyXG4gKiBAemgg5YmN5ZCR5riy5p+T6Zi25q6144CCXHJcbiAqL1xyXG5AY2NjbGFzcygnTGlnaHRpbmdTdGFnZScpXHJcbmV4cG9ydCBjbGFzcyBMaWdodGluZ1N0YWdlIGV4dGVuZHMgUmVuZGVyU3RhZ2Uge1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdEluZm86IElSZW5kZXJTdGFnZUluZm8gPSB7XHJcbiAgICAgICAgbmFtZTogJ0xpZ2h0aW5nU3RhZ2UnLFxyXG4gICAgICAgIHByaW9yaXR5OiBEZWZlcnJlZFN0YWdlUHJpb3JpdHkuTElHSFRJTkcsXHJcbiAgICAgICAgdGFnOiAwLFxyXG4gICAgICAgIHJlbmRlclF1ZXVlczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpc1RyYW5zcGFyZW50OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNvcnRNb2RlOiBSZW5kZXJRdWV1ZVNvcnRNb2RlLkZST05UX1RPX0JBQ0ssXHJcbiAgICAgICAgICAgICAgICBzdGFnZXM6IFsnZGVmYXVsdCddLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpc1RyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc29ydE1vZGU6IFJlbmRlclF1ZXVlU29ydE1vZGUuQkFDS19UT19GUk9OVCxcclxuICAgICAgICAgICAgICAgIHN0YWdlczogWydkZWZhdWx0JywgJ3BsYW5hclNoYWRvdyddLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF1cclxuICAgIH07XHJcblxyXG5cclxuICAgIEB0eXBlKFtSZW5kZXJRdWV1ZURlc2NdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlczogUmVuZGVyUXVldWVEZXNjW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyUXVldWVzOiBSZW5kZXJRdWV1ZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVuZGVyQXJlYSA9IG5ldyBHRlhSZWN0KCk7XHJcbiAgICBwcml2YXRlIGRlY2xhcmUgX2FkZGl0aXZlTGlnaHRRdWV1ZTogUmVuZGVyQWRkaXRpdmVMaWdodFF1ZXVlO1xyXG4gICAgcHJpdmF0ZSBkZWNsYXJlIF9wbGFuYXJRdWV1ZTogUGxhbmFyU2hhZG93UXVldWU7XHJcblxyXG4gICAgQHR5cGUoTWF0ZXJpYWwpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBwcml2YXRlIF9kZWZlcnJlZE1hdGVyaWFsOiBNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHNldCBtYXRlcmlhbCAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RlZmVycmVkTWF0ZXJpYWwgPT09IHZhbCkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2RlZmVycmVkTWF0ZXJpYWwgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IElSZW5kZXJTdGFnZUluZm8pOiBib29sZWFuIHtcclxuICAgICAgICBzdXBlci5pbml0aWFsaXplKGluZm8pO1xyXG4gICAgICAgIGlmIChpbmZvLnJlbmRlclF1ZXVlcykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclF1ZXVlcyA9IGluZm8ucmVuZGVyUXVldWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUgKHBpcGVsaW5lOiBEZWZlcnJlZFBpcGVsaW5lLCBmbG93OiBMaWdodGluZ0Zsb3cpIHtcclxuICAgICAgICBzdXBlci5hY3RpdmF0ZShwaXBlbGluZSwgZmxvdyk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlbmRlclF1ZXVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBsZXQgcGhhc2UgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMucmVuZGVyUXVldWVzW2ldLnN0YWdlcy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgcGhhc2UgfD0gZ2V0UGhhc2VJRCh0aGlzLnJlbmRlclF1ZXVlc1tpXS5zdGFnZXNbal0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGxldCBzb3J0RnVuYzogKGE6IElSZW5kZXJQYXNzLCBiOiBJUmVuZGVyUGFzcykgPT4gbnVtYmVyID0gb3BhcXVlQ29tcGFyZUZuO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMucmVuZGVyUXVldWVzW2ldLnNvcnRNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJlbmRlclF1ZXVlU29ydE1vZGUuQkFDS19UT19GUk9OVDpcclxuICAgICAgICAgICAgICAgICAgICBzb3J0RnVuYyA9IHRyYW5zcGFyZW50Q29tcGFyZUZuO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSZW5kZXJRdWV1ZVNvcnRNb2RlLkZST05UX1RPX0JBQ0s6XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEZ1bmMgPSBvcGFxdWVDb21wYXJlRm47XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlc1tpXSA9IG5ldyBSZW5kZXJRdWV1ZSh7XHJcbiAgICAgICAgICAgICAgICBpc1RyYW5zcGFyZW50OiB0aGlzLnJlbmRlclF1ZXVlc1tpXS5pc1RyYW5zcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgcGhhc2VzOiBwaGFzZSxcclxuICAgICAgICAgICAgICAgIHNvcnRGdW5jLFxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3BsYW5hclF1ZXVlID0gbmV3IFBsYW5hclNoYWRvd1F1ZXVlKHRoaXMuX3BpcGVsaW5lIGFzIERlZmVycmVkUGlwZWxpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlldzogUmVuZGVyVmlldykge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5fcGlwZWxpbmUgYXMgRGVmZXJyZWRQaXBlbGluZTtcclxuICAgICAgICBjb25zdCBkZXZpY2UgPSBwaXBlbGluZS5kZXZpY2U7XHJcbiAgICAgICBcclxuICAgICAgICBjb25zdCBjbWRCdWZmID0gcGlwZWxpbmUuY29tbWFuZEJ1ZmZlcnNbMF07XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHZpZXcuY2FtZXJhO1xyXG4gICAgICAgIGNvbnN0IHZwID0gY2FtZXJhLnZpZXdwb3J0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnggPSB2cC54ICogY2FtZXJhLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnkgPSB2cC55ICogY2FtZXJhLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS53aWR0aCA9IHZwLndpZHRoICogY2FtZXJhLndpZHRoICogcGlwZWxpbmUuc2hhZGluZ1NjYWxlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLmhlaWdodCA9IHZwLmhlaWdodCAqIGNhbWVyYS5oZWlnaHQgKiBwaXBlbGluZS5zaGFkaW5nU2NhbGU7XHJcblxyXG4gICAgICAgIGlmIChjYW1lcmEuY2xlYXJGbGFnICYgR0ZYQ2xlYXJGbGFnLkNPTE9SKSB7XHJcbiAgICAgICAgICAgIGlmIChwaXBlbGluZS5pc0hEUikge1xyXG4gICAgICAgICAgICAgICAgU1JHQlRvTGluZWFyKGNvbG9yc1swXSwgY2FtZXJhLmNsZWFyQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBwaXBlbGluZS5mcFNjYWxlIC8gY2FtZXJhLmV4cG9zdXJlO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnggKj0gc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueSAqPSBzY2FsZTtcclxuICAgICAgICAgICAgICAgIGNvbG9yc1swXS56ICo9IHNjYWxlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnggPSBjYW1lcmEuY2xlYXJDb2xvci54O1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnkgPSBjYW1lcmEuY2xlYXJDb2xvci55O1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnogPSBjYW1lcmEuY2xlYXJDb2xvci56O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb2xvcnNbMF0udyA9IGNhbWVyYS5jbGVhckNvbG9yLnc7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYW1lYnVmZmVyID0gdmlldy53aW5kb3cuZnJhbWVidWZmZXI7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzcyA9IGZyYW1lYnVmZmVyLmNvbG9yVGV4dHVyZXNbMF0gPyBmcmFtZWJ1ZmZlci5yZW5kZXJQYXNzIDogcGlwZWxpbmUuZ2V0UmVuZGVyUGFzcyhjYW1lcmEuY2xlYXJGbGFnKTtcclxuXHJcbiAgICAgICAgY21kQnVmZi5iZWdpblJlbmRlclBhc3MocmVuZGVyUGFzcywgZnJhbWVidWZmZXIsIHRoaXMuX3JlbmRlckFyZWEhLFxyXG4gICAgICAgICAgICBjb2xvcnMsIGNhbWVyYS5jbGVhckRlcHRoLCBjYW1lcmEuY2xlYXJTdGVuY2lsKTtcclxuXHJcbiAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5HTE9CQUwsIHBpcGVsaW5lLmRlc2NyaXB0b3JTZXQpO1xyXG5cclxuICAgICAgICBjb25zdCBoUGFzcyA9IHRoaXMuX2RlZmVycmVkTWF0ZXJpYWwhLnBhc3Nlc1tMSUdIVElOR1BBU1NfSU5ERVhdLmhhbmRsZTtcclxuICAgICAgICBjb25zdCBzaGFkZXIgPSBTaGFkZXJQb29sLmdldCh0aGlzLl9kZWZlcnJlZE1hdGVyaWFsIS5wYXNzZXNbTElHSFRJTkdQQVNTX0lOREVYXS5nZXRTaGFkZXJWYXJpYW50KCkpO1xyXG5cclxuICAgICAgICBjb25zdCBpbnB1dEFzc2VtYmxlciA9IHBpcGVsaW5lLnF1YWRJQTtcclxuICAgICAgICB2YXIgcHNvOkdGWFBpcGVsaW5lU3RhdGV8bnVsbCA9IG51bGw7XHJcbiAgICAgICAgaWYgKGhQYXNzICE9IG51bGwgJiYgc2hhZGVyICE9IG51bGwgJiYgaW5wdXRBc3NlbWJsZXIgIT0gbnVsbClcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIHBzbyA9IFBpcGVsaW5lU3RhdGVNYW5hZ2VyLmdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZShkZXZpY2UsIGhQYXNzLCBzaGFkZXIsIHJlbmRlclBhc3MsIGlucHV0QXNzZW1ibGVyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBzbyAhPSBudWxsKVxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kUGlwZWxpbmVTdGF0ZShwc28pO1xyXG4gICAgICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcihpbnB1dEFzc2VtYmxlcik7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuZHJhdyhpbnB1dEFzc2VtYmxlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjbWRCdWZmLmVuZFJlbmRlclBhc3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDbGVhciB0aGUgZ2l2ZW4gcmVuZGVyIHF1ZXVlXHJcbiAgICAgKiBAemgg5riF56m65oyH5a6a55qE5riy5p+T6Zif5YiXXHJcbiAgICAgKiBAcGFyYW0gcnEgVGhlIHJlbmRlciBxdWV1ZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUXVldWVDbGVhckZ1bmMgKHJxOiBSZW5kZXJRdWV1ZSkge1xyXG4gICAgICAgIHJxLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU29ydCB0aGUgZ2l2ZW4gcmVuZGVyIHF1ZXVlXHJcbiAgICAgKiBAemgg5a+55oyH5a6a55qE5riy5p+T6Zif5YiX5omn6KGM5o6S5bqPXHJcbiAgICAgKiBAcGFyYW0gcnEgVGhlIHJlbmRlciBxdWV1ZVxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyUXVldWVTb3J0RnVuYyAocnE6IFJlbmRlclF1ZXVlKSB7XHJcbiAgICAgICAgcnEuc29ydCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==