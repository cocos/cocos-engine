(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../pass-phase.js", "../render-queue.js", "../../gfx/define.js", "../pipeline-funcs.js", "../render-batched-queue.js", "../render-instanced-queue.js", "../render-stage.js", "./enum.js", "../instanced-buffer.js", "../batched-buffer.js", "../../renderer/core/pass.js", "../pipeline-serialization.js", "./planar-shadow-queue.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../pass-phase.js"), require("../render-queue.js"), require("../../gfx/define.js"), require("../pipeline-funcs.js"), require("../render-batched-queue.js"), require("../render-instanced-queue.js"), require("../render-stage.js"), require("./enum.js"), require("../instanced-buffer.js"), require("../batched-buffer.js"), require("../../renderer/core/pass.js"), require("../pipeline-serialization.js"), require("./planar-shadow-queue.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.passPhase, global.renderQueue, global.define, global.pipelineFuncs, global.renderBatchedQueue, global.renderInstancedQueue, global.renderStage, global._enum, global.instancedBuffer, global.batchedBuffer, global.pass, global.pipelineSerialization, global.planarShadowQueue);
    global.transparentStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _passPhase, _renderQueue, _define2, _pipelineFuncs, _renderBatchedQueue, _renderInstancedQueue, _renderStage, _enum, _instancedBuffer, _batchedBuffer, _pass, _pipelineSerialization, _planarShadowQueue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TransparentStage = void 0;

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _class3, _temp;

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

  var colors = [new _define2.GFXColor(0, 0, 0, 1)];
  /**
   * @en The tranparent render stage
   * @zh 前向渲染阶段。
   */

  var TransparentStage = (_dec = (0, _index.ccclass)('TransparentStage'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderQueueDesc]), _dec3 = (0, _index.displayOrder)(2), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderStage) {
    _inherits(TransparentStage, _RenderStage);

    function TransparentStage() {
      var _this;

      _classCallCheck(this, TransparentStage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(TransparentStage).call(this));

      _initializerDefineProperty(_this, "renderQueues", _descriptor, _assertThisInitialized(_this));

      _this._renderQueues = [];
      _this._renderArea = new _define2.GFXRect();
      _this._batchedQueue = void 0;
      _this._instancedQueue = void 0;
      _this._phaseID = (0, _passPhase.getPhaseID)('deferred-transparent');
      _this._batchedQueue = new _renderBatchedQueue.RenderBatchedQueue();
      _this._instancedQueue = new _renderInstancedQueue.RenderInstancedQueue();
      return _this;
    }

    _createClass(TransparentStage, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(TransparentStage.prototype), "initialize", this).call(this, info);

        if (info.renderQueues) {
          this.renderQueues = info.renderQueues;
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        _get(_getPrototypeOf(TransparentStage.prototype), "activate", this).call(this, pipeline, flow);

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
        } //this._additiveLightQueue = new RenderAdditiveLightQueue(this._pipeline as DeferredPipeline);


        this._planarQueue = new _planarShadowQueue.PlanarShadowQueue(this._pipeline);
      }
    }, {
      key: "destroy",
      value: function destroy() {}
    }, {
      key: "render",
      value: function render(view) {
        this._instancedQueue.clear();

        this._batchedQueue.clear();

        var pipeline = this._pipeline;
        var device = pipeline.device;

        this._renderQueues.forEach(this.renderQueueClearFunc);

        var renderObjects = pipeline.renderObjects;
        var m = 0;
        var p = 0;
        var k = 0;

        for (var i = 0; i < renderObjects.length; ++i) {
          var ro = renderObjects[i];
          var subModels = ro.model.subModels;

          for (m = 0; m < subModels.length; ++m) {
            var subModel = subModels[m];
            var passes = subModel.passes;

            for (p = 0; p < passes.length; ++p) {
              var pass = passes[p];
              if (pass.phase !== this._phaseID) continue;
              var batchingScheme = pass.batchingScheme;

              if (batchingScheme === _pass.BatchingSchemes.INSTANCING) {
                var instancedBuffer = _instancedBuffer.InstancedBuffer.get(pass);

                instancedBuffer.merge(subModel, ro.model.instancedAttributes, p);

                this._instancedQueue.queue.add(instancedBuffer);
              } else if (batchingScheme === _pass.BatchingSchemes.VB_MERGING) {
                var batchedBuffer = _batchedBuffer.BatchedBuffer.get(pass);

                batchedBuffer.merge(subModel, p, ro);

                this._batchedQueue.queue.add(batchedBuffer);
              } else {
                for (k = 0; k < this._renderQueues.length; k++) {
                  this._renderQueues[k].insertRenderPass(ro, m, p);
                }
              }
            }
          }
        }

        var cmdBuff = pipeline.commandBuffers[0];

        this._renderQueues.forEach(this.renderQueueSortFunc); //this._additiveLightQueue.gatherLightPasses(view, cmdBuff);


        this._planarQueue.updateShadowList(view);

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
        var renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag); //FIXEME: ugly code

        var renderPass_temp = renderPass;
        renderPass_temp.colorAttachments[0].loadOp = _define2.GFXLoadOp.LOAD;
        cmdBuff.beginRenderPass(renderPass_temp, framebuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define.SetIndex.GLOBAL, pipeline.descriptorSet);

        for (var _i = 0; _i < this.renderQueues.length; _i++) {
          this._renderQueues[_i].recordCommandBuffer(device, renderPass_temp, cmdBuff);
        }

        this._instancedQueue.recordCommandBuffer(device, renderPass_temp, cmdBuff);

        this._batchedQueue.recordCommandBuffer(device, renderPass_temp, cmdBuff); //this._additiveLightQueue.recordCommandBuffer(device, renderPass_temp, cmdBuff);


        this._planarQueue.recordCommandBuffer(device, renderPass_temp, cmdBuff);

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

    return TransparentStage;
  }(_renderStage.RenderStage), _class3.initInfo = {
    name: 'TransparentStage',
    priority: _enum.DeferredStagePriority.TRANSPARENT,
    tag: 0,
    renderQueues: [{
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
  })), _class2)) || _class);
  _exports.TransparentStage = TransparentStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvdHJhbnNwYXJlbnQtc3RhZ2UudHMiXSwibmFtZXMiOlsiY29sb3JzIiwiR0ZYQ29sb3IiLCJUcmFuc3BhcmVudFN0YWdlIiwiUmVuZGVyUXVldWVEZXNjIiwiX3JlbmRlclF1ZXVlcyIsIl9yZW5kZXJBcmVhIiwiR0ZYUmVjdCIsIl9iYXRjaGVkUXVldWUiLCJfaW5zdGFuY2VkUXVldWUiLCJfcGhhc2VJRCIsIlJlbmRlckJhdGNoZWRRdWV1ZSIsIlJlbmRlckluc3RhbmNlZFF1ZXVlIiwiaW5mbyIsInJlbmRlclF1ZXVlcyIsInBpcGVsaW5lIiwiZmxvdyIsImkiLCJsZW5ndGgiLCJwaGFzZSIsImoiLCJzdGFnZXMiLCJzb3J0RnVuYyIsIm9wYXF1ZUNvbXBhcmVGbiIsInNvcnRNb2RlIiwiUmVuZGVyUXVldWVTb3J0TW9kZSIsIkJBQ0tfVE9fRlJPTlQiLCJ0cmFuc3BhcmVudENvbXBhcmVGbiIsIkZST05UX1RPX0JBQ0siLCJSZW5kZXJRdWV1ZSIsImlzVHJhbnNwYXJlbnQiLCJwaGFzZXMiLCJfcGxhbmFyUXVldWUiLCJQbGFuYXJTaGFkb3dRdWV1ZSIsIl9waXBlbGluZSIsInZpZXciLCJjbGVhciIsImRldmljZSIsImZvckVhY2giLCJyZW5kZXJRdWV1ZUNsZWFyRnVuYyIsInJlbmRlck9iamVjdHMiLCJtIiwicCIsImsiLCJybyIsInN1Yk1vZGVscyIsIm1vZGVsIiwic3ViTW9kZWwiLCJwYXNzZXMiLCJwYXNzIiwiYmF0Y2hpbmdTY2hlbWUiLCJCYXRjaGluZ1NjaGVtZXMiLCJJTlNUQU5DSU5HIiwiaW5zdGFuY2VkQnVmZmVyIiwiSW5zdGFuY2VkQnVmZmVyIiwiZ2V0IiwibWVyZ2UiLCJpbnN0YW5jZWRBdHRyaWJ1dGVzIiwicXVldWUiLCJhZGQiLCJWQl9NRVJHSU5HIiwiYmF0Y2hlZEJ1ZmZlciIsIkJhdGNoZWRCdWZmZXIiLCJpbnNlcnRSZW5kZXJQYXNzIiwiY21kQnVmZiIsImNvbW1hbmRCdWZmZXJzIiwicmVuZGVyUXVldWVTb3J0RnVuYyIsInVwZGF0ZVNoYWRvd0xpc3QiLCJjYW1lcmEiLCJ2cCIsInZpZXdwb3J0IiwieCIsIndpZHRoIiwieSIsImhlaWdodCIsInNoYWRpbmdTY2FsZSIsImNsZWFyRmxhZyIsIkdGWENsZWFyRmxhZyIsIkNPTE9SIiwiaXNIRFIiLCJjbGVhckNvbG9yIiwic2NhbGUiLCJmcFNjYWxlIiwiZXhwb3N1cmUiLCJ6IiwidyIsImZyYW1lYnVmZmVyIiwid2luZG93IiwicmVuZGVyUGFzcyIsImNvbG9yVGV4dHVyZXMiLCJnZXRSZW5kZXJQYXNzIiwicmVuZGVyUGFzc190ZW1wIiwiY29sb3JBdHRhY2htZW50cyIsImxvYWRPcCIsIkdGWExvYWRPcCIsIkxPQUQiLCJiZWdpblJlbmRlclBhc3MiLCJjbGVhckRlcHRoIiwiY2xlYXJTdGVuY2lsIiwiYmluZERlc2NyaXB0b3JTZXQiLCJTZXRJbmRleCIsIkdMT0JBTCIsImRlc2NyaXB0b3JTZXQiLCJyZWNvcmRDb21tYW5kQnVmZmVyIiwiZW5kUmVuZGVyUGFzcyIsInJxIiwic29ydCIsIlJlbmRlclN0YWdlIiwiaW5pdEluZm8iLCJuYW1lIiwicHJpb3JpdHkiLCJEZWZlcnJlZFN0YWdlUHJpb3JpdHkiLCJUUkFOU1BBUkVOVCIsInRhZyIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsTUFBTUEsTUFBa0IsR0FBRyxDQUFFLElBQUlDLGlCQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFGLENBQTNCO0FBRUE7Ozs7O01BS2FDLGdCLFdBRFosb0JBQVEsa0JBQVIsQyxVQWlCSSxpQkFBSyxDQUFDQyxzQ0FBRCxDQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEM7OztBQVdELGdDQUFlO0FBQUE7O0FBQUE7O0FBQ1g7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LGtCQURpQztBQUV2Q0MsSUFBQUEsUUFBUSxFQUFFQyw0QkFBc0JDLFdBRk87QUFHdkNDLElBQUFBLEdBQUcsRUFBRSxDQUhrQztBQUl2Q25HLElBQUFBLFlBQVksRUFBRSxDQUNWO0FBQ0lnQixNQUFBQSxhQUFhLEVBQUUsSUFEbkI7QUFFSU4sTUFBQUEsUUFBUSxFQUFFQywyQ0FBb0JDLGFBRmxDO0FBR0lMLE1BQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQsRUFBWSxjQUFaO0FBSFosS0FEVTtBQUp5QixHLDhGQWUxQzZGLG1COzs7OzthQUUyQyxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgSVJlbmRlclBhc3MsIFNldEluZGV4IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgZ2V0UGhhc2VJRCB9IGZyb20gJy4uL3Bhc3MtcGhhc2UnO1xyXG5pbXBvcnQgeyBvcGFxdWVDb21wYXJlRm4sIFJlbmRlclF1ZXVlLCB0cmFuc3BhcmVudENvbXBhcmVGbiB9IGZyb20gJy4uL3JlbmRlci1xdWV1ZSc7XHJcbmltcG9ydCB7IEdGWENsZWFyRmxhZywgR0ZYQ29sb3IsIEdGWFJlY3QgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgU1JHQlRvTGluZWFyIH0gZnJvbSAnLi4vcGlwZWxpbmUtZnVuY3MnO1xyXG5pbXBvcnQgeyBSZW5kZXJCYXRjaGVkUXVldWUgfSBmcm9tICcuLi9yZW5kZXItYmF0Y2hlZC1xdWV1ZSc7XHJcbmltcG9ydCB7IFJlbmRlckluc3RhbmNlZFF1ZXVlIH0gZnJvbSAnLi4vcmVuZGVyLWluc3RhbmNlZC1xdWV1ZSc7XHJcbmltcG9ydCB7IElSZW5kZXJTdGFnZUluZm8sIFJlbmRlclN0YWdlIH0gZnJvbSAnLi4vcmVuZGVyLXN0YWdlJztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgRGVmZXJyZWRTdGFnZVByaW9yaXR5IH0gZnJvbSAnLi9lbnVtJztcclxuaW1wb3J0IHsgUmVuZGVyQWRkaXRpdmVMaWdodFF1ZXVlIH0gZnJvbSAnLi4vcmVuZGVyLWFkZGl0aXZlLWxpZ2h0LXF1ZXVlJztcclxuaW1wb3J0IHsgSW5zdGFuY2VkQnVmZmVyIH0gZnJvbSAnLi4vaW5zdGFuY2VkLWJ1ZmZlcic7XHJcbmltcG9ydCB7IEJhdGNoZWRCdWZmZXIgfSBmcm9tICcuLi9iYXRjaGVkLWJ1ZmZlcic7XHJcbmltcG9ydCB7IEJhdGNoaW5nU2NoZW1lcyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IExpZ2h0aW5nRmxvdyB9IGZyb20gJy4vbGlnaHRpbmctZmxvdyc7XHJcbmltcG9ydCB7IERlZmVycmVkUGlwZWxpbmUgfSBmcm9tICcuL2RlZmVycmVkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyUXVldWVEZXNjLCBSZW5kZXJRdWV1ZVNvcnRNb2RlIH0gZnJvbSAnLi4vcGlwZWxpbmUtc2VyaWFsaXphdGlvbic7XHJcbmltcG9ydCB7IFBsYW5hclNoYWRvd1F1ZXVlIH0gZnJvbSAnLi9wbGFuYXItc2hhZG93LXF1ZXVlJztcclxuaW1wb3J0IHsgR0ZYTG9hZE9wIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcblxyXG5jb25zdCBjb2xvcnM6IEdGWENvbG9yW10gPSBbIG5ldyBHRlhDb2xvcigwLCAwLCAwLCAxKSBdO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgdHJhbnBhcmVudCByZW5kZXIgc3RhZ2VcclxuICogQHpoIOWJjeWQkea4suafk+mYtuauteOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ1RyYW5zcGFyZW50U3RhZ2UnKVxyXG5leHBvcnQgY2xhc3MgVHJhbnNwYXJlbnRTdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRJbmZvOiBJUmVuZGVyU3RhZ2VJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6ICdUcmFuc3BhcmVudFN0YWdlJyxcclxuICAgICAgICBwcmlvcml0eTogRGVmZXJyZWRTdGFnZVByaW9yaXR5LlRSQU5TUEFSRU5ULFxyXG4gICAgICAgIHRhZzogMCxcclxuICAgICAgICByZW5kZXJRdWV1ZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXNUcmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNvcnRNb2RlOiBSZW5kZXJRdWV1ZVNvcnRNb2RlLkJBQ0tfVE9fRlJPTlQsXHJcbiAgICAgICAgICAgICAgICBzdGFnZXM6IFsnZGVmYXVsdCcsICdwbGFuYXJTaGFkb3cnXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBAdHlwZShbUmVuZGVyUXVldWVEZXNjXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIHByb3RlY3RlZCByZW5kZXJRdWV1ZXM6IFJlbmRlclF1ZXVlRGVzY1tdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3JlbmRlclF1ZXVlczogUmVuZGVyUXVldWVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckFyZWEgPSBuZXcgR0ZYUmVjdCgpO1xyXG4gICAgcHJpdmF0ZSBfYmF0Y2hlZFF1ZXVlOiBSZW5kZXJCYXRjaGVkUXVldWU7XHJcbiAgICBwcml2YXRlIF9pbnN0YW5jZWRRdWV1ZTogUmVuZGVySW5zdGFuY2VkUXVldWU7XHJcbiAgICBwcml2YXRlIF9waGFzZUlEID0gZ2V0UGhhc2VJRCgnZGVmZXJyZWQtdHJhbnNwYXJlbnQnKTtcclxuICAgIHByaXZhdGUgZGVjbGFyZSBfYWRkaXRpdmVMaWdodFF1ZXVlOiBSZW5kZXJBZGRpdGl2ZUxpZ2h0UXVldWU7XHJcbiAgICBwcml2YXRlIGRlY2xhcmUgX3BsYW5hclF1ZXVlOiBQbGFuYXJTaGFkb3dRdWV1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVkUXVldWUgPSBuZXcgUmVuZGVyQmF0Y2hlZFF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUgPSBuZXcgUmVuZGVySW5zdGFuY2VkUXVldWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclN0YWdlSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgaWYgKGluZm8ucmVuZGVyUXVldWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVldWVzID0gaW5mby5yZW5kZXJRdWV1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocGlwZWxpbmU6IERlZmVycmVkUGlwZWxpbmUsIGZsb3c6IExpZ2h0aW5nRmxvdykge1xyXG4gICAgICAgIHN1cGVyLmFjdGl2YXRlKHBpcGVsaW5lLCBmbG93KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVuZGVyUXVldWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwaGFzZSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yZW5kZXJRdWV1ZXNbaV0uc3RhZ2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZSB8PSBnZXRQaGFzZUlEKHRoaXMucmVuZGVyUXVldWVzW2ldLnN0YWdlc1tqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHNvcnRGdW5jOiAoYTogSVJlbmRlclBhc3MsIGI6IElSZW5kZXJQYXNzKSA9PiBudW1iZXIgPSBvcGFxdWVDb21wYXJlRm47XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5yZW5kZXJRdWV1ZXNbaV0uc29ydE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUmVuZGVyUXVldWVTb3J0TW9kZS5CQUNLX1RPX0ZST05UOlxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRGdW5jID0gdHJhbnNwYXJlbnRDb21wYXJlRm47XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJlbmRlclF1ZXVlU29ydE1vZGUuRlJPTlRfVE9fQkFDSzpcclxuICAgICAgICAgICAgICAgICAgICBzb3J0RnVuYyA9IG9wYXF1ZUNvbXBhcmVGbjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzW2ldID0gbmV3IFJlbmRlclF1ZXVlKHtcclxuICAgICAgICAgICAgICAgIGlzVHJhbnNwYXJlbnQ6IHRoaXMucmVuZGVyUXVldWVzW2ldLmlzVHJhbnNwYXJlbnQsXHJcbiAgICAgICAgICAgICAgICBwaGFzZXM6IHBoYXNlLFxyXG4gICAgICAgICAgICAgICAgc29ydEZ1bmMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy90aGlzLl9hZGRpdGl2ZUxpZ2h0UXVldWUgPSBuZXcgUmVuZGVyQWRkaXRpdmVMaWdodFF1ZXVlKHRoaXMuX3BpcGVsaW5lIGFzIERlZmVycmVkUGlwZWxpbmUpO1xyXG4gICAgICAgIHRoaXMuX3BsYW5hclF1ZXVlID0gbmV3IFBsYW5hclNoYWRvd1F1ZXVlKHRoaXMuX3BpcGVsaW5lIGFzIERlZmVycmVkUGlwZWxpbmUpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlldzogUmVuZGVyVmlldykge1xyXG5cclxuICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5jbGVhcigpO1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lID0gdGhpcy5fcGlwZWxpbmUgYXMgRGVmZXJyZWRQaXBlbGluZTtcclxuICAgICAgICBjb25zdCBkZXZpY2UgPSBwaXBlbGluZS5kZXZpY2U7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzLmZvckVhY2godGhpcy5yZW5kZXJRdWV1ZUNsZWFyRnVuYyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlck9iamVjdHMgPSBwaXBlbGluZS5yZW5kZXJPYmplY3RzO1xyXG4gICAgICAgIGxldCBtID0gMDsgbGV0IHAgPSAwOyBsZXQgayA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW5kZXJPYmplY3RzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJvID0gcmVuZGVyT2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgY29uc3Qgc3ViTW9kZWxzID0gcm8ubW9kZWwuc3ViTW9kZWxzO1xyXG4gICAgICAgICAgICBmb3IgKG0gPSAwOyBtIDwgc3ViTW9kZWxzLmxlbmd0aDsgKyttKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNb2RlbCA9IHN1Yk1vZGVsc1ttXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NlcyA9IHN1Yk1vZGVsLnBhc3NlcztcclxuICAgICAgICAgICAgICAgIGZvciAocCA9IDA7IHAgPCBwYXNzZXMubGVuZ3RoOyArK3ApIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXNzID0gcGFzc2VzW3BdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXNzLnBoYXNlICE9PSB0aGlzLl9waGFzZUlEKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXRjaGluZ1NjaGVtZSA9IHBhc3MuYmF0Y2hpbmdTY2hlbWU7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhdGNoaW5nU2NoZW1lID09PSBCYXRjaGluZ1NjaGVtZXMuSU5TVEFOQ0lORykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBpbnN0YW5jZWRCdWZmZXIgPSBJbnN0YW5jZWRCdWZmZXIuZ2V0KHBhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZWRCdWZmZXIubWVyZ2Uoc3ViTW9kZWwsIHJvLm1vZGVsLmluc3RhbmNlZEF0dHJpYnV0ZXMsIHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5xdWV1ZS5hZGQoaW5zdGFuY2VkQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJhdGNoaW5nU2NoZW1lID09PSBCYXRjaGluZ1NjaGVtZXMuVkJfTUVSR0lORykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBiYXRjaGVkQnVmZmVyID0gQmF0Y2hlZEJ1ZmZlci5nZXQocGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhdGNoZWRCdWZmZXIubWVyZ2Uoc3ViTW9kZWwsIHAsIHJvKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmF0Y2hlZFF1ZXVlLnF1ZXVlLmFkZChiYXRjaGVkQnVmZmVyKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgdGhpcy5fcmVuZGVyUXVldWVzLmxlbmd0aDsgaysrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXNba10uaW5zZXJ0UmVuZGVyUGFzcyhybywgbSwgcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgY21kQnVmZiA9IHBpcGVsaW5lLmNvbW1hbmRCdWZmZXJzWzBdO1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXMuZm9yRWFjaCh0aGlzLnJlbmRlclF1ZXVlU29ydEZ1bmMpO1xyXG4gICAgICAgIC8vdGhpcy5fYWRkaXRpdmVMaWdodFF1ZXVlLmdhdGhlckxpZ2h0UGFzc2VzKHZpZXcsIGNtZEJ1ZmYpO1xyXG4gICAgICAgIHRoaXMuX3BsYW5hclF1ZXVlLnVwZGF0ZVNoYWRvd0xpc3Qodmlldyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHZpZXcuY2FtZXJhO1xyXG4gICAgICAgIGNvbnN0IHZwID0gY2FtZXJhLnZpZXdwb3J0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnggPSB2cC54ICogY2FtZXJhLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLnkgPSB2cC55ICogY2FtZXJhLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS53aWR0aCA9IHZwLndpZHRoICogY2FtZXJhLndpZHRoICogcGlwZWxpbmUuc2hhZGluZ1NjYWxlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLmhlaWdodCA9IHZwLmhlaWdodCAqIGNhbWVyYS5oZWlnaHQgKiBwaXBlbGluZS5zaGFkaW5nU2NhbGU7XHJcblxyXG4gICAgICAgIGlmIChjYW1lcmEuY2xlYXJGbGFnICYgR0ZYQ2xlYXJGbGFnLkNPTE9SKSB7XHJcbiAgICAgICAgICAgIGlmIChwaXBlbGluZS5pc0hEUikge1xyXG4gICAgICAgICAgICAgICAgU1JHQlRvTGluZWFyKGNvbG9yc1swXSwgY2FtZXJhLmNsZWFyQ29sb3IpO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2NhbGUgPSBwaXBlbGluZS5mcFNjYWxlIC8gY2FtZXJhLmV4cG9zdXJlO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnggKj0gc2NhbGU7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueSAqPSBzY2FsZTtcclxuICAgICAgICAgICAgICAgIGNvbG9yc1swXS56ICo9IHNjYWxlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnggPSBjYW1lcmEuY2xlYXJDb2xvci54O1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnkgPSBjYW1lcmEuY2xlYXJDb2xvci55O1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnogPSBjYW1lcmEuY2xlYXJDb2xvci56O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb2xvcnNbMF0udyA9IGNhbWVyYS5jbGVhckNvbG9yLnc7XHJcblxyXG4gICAgICAgIGNvbnN0IGZyYW1lYnVmZmVyID0gdmlldy53aW5kb3cuZnJhbWVidWZmZXI7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzcyA9IGZyYW1lYnVmZmVyLmNvbG9yVGV4dHVyZXNbMF0gPyBmcmFtZWJ1ZmZlci5yZW5kZXJQYXNzIDogcGlwZWxpbmUuZ2V0UmVuZGVyUGFzcyhjYW1lcmEuY2xlYXJGbGFnKTtcclxuXHJcbiAgICAgICAgLy9GSVhFTUU6IHVnbHkgY29kZVxyXG4gICAgICAgIGxldCByZW5kZXJQYXNzX3RlbXAgPSByZW5kZXJQYXNzO1xyXG4gICAgICAgIHJlbmRlclBhc3NfdGVtcC5jb2xvckF0dGFjaG1lbnRzWzBdLmxvYWRPcCA9IEdGWExvYWRPcC5MT0FEO1xyXG5cclxuICAgICAgICBjbWRCdWZmLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzX3RlbXAsIGZyYW1lYnVmZmVyLCB0aGlzLl9yZW5kZXJBcmVhISxcclxuICAgICAgICAgICAgY29sb3JzLCBjYW1lcmEuY2xlYXJEZXB0aCwgY2FtZXJhLmNsZWFyU3RlbmNpbCk7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguR0xPQkFMLCBwaXBlbGluZS5kZXNjcmlwdG9yU2V0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlbmRlclF1ZXVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXNbaV0ucmVjb3JkQ29tbWFuZEJ1ZmZlcihkZXZpY2UsIHJlbmRlclBhc3NfdGVtcCwgY21kQnVmZik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2luc3RhbmNlZFF1ZXVlLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzX3RlbXAsIGNtZEJ1ZmYpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzc190ZW1wLCBjbWRCdWZmKTtcclxuICAgICAgICAvL3RoaXMuX2FkZGl0aXZlTGlnaHRRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzc190ZW1wLCBjbWRCdWZmKTtcclxuICAgICAgICB0aGlzLl9wbGFuYXJRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzc190ZW1wLCBjbWRCdWZmKTtcclxuXHJcbiAgICAgICAgY21kQnVmZi5lbmRSZW5kZXJQYXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2xlYXIgdGhlIGdpdmVuIHJlbmRlciBxdWV1ZVxyXG4gICAgICogQHpoIOa4heepuuaMh+WumueahOa4suafk+mYn+WIl1xyXG4gICAgICogQHBhcmFtIHJxIFRoZSByZW5kZXIgcXVldWVcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlQ2xlYXJGdW5jIChycTogUmVuZGVyUXVldWUpIHtcclxuICAgICAgICBycS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNvcnQgdGhlIGdpdmVuIHJlbmRlciBxdWV1ZVxyXG4gICAgICogQHpoIOWvueaMh+WumueahOa4suafk+mYn+WIl+aJp+ihjOaOkuW6j1xyXG4gICAgICogQHBhcmFtIHJxIFRoZSByZW5kZXIgcXVldWVcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlU29ydEZ1bmMgKHJxOiBSZW5kZXJRdWV1ZSkge1xyXG4gICAgICAgIHJxLnNvcnQoKTtcclxuICAgIH1cclxufVxyXG4iXX0=