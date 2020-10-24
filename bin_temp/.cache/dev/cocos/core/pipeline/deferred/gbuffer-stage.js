(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../pass-phase.js", "../render-queue.js", "../../gfx/define.js", "../render-batched-queue.js", "../render-instanced-queue.js", "../render-stage.js", "./enum.js", "../instanced-buffer.js", "../batched-buffer.js", "../../renderer/core/pass.js", "../pipeline-serialization.js", "./planar-shadow-queue.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../pass-phase.js"), require("../render-queue.js"), require("../../gfx/define.js"), require("../render-batched-queue.js"), require("../render-instanced-queue.js"), require("../render-stage.js"), require("./enum.js"), require("../instanced-buffer.js"), require("../batched-buffer.js"), require("../../renderer/core/pass.js"), require("../pipeline-serialization.js"), require("./planar-shadow-queue.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.passPhase, global.renderQueue, global.define, global.renderBatchedQueue, global.renderInstancedQueue, global.renderStage, global._enum, global.instancedBuffer, global.batchedBuffer, global.pass, global.pipelineSerialization, global.planarShadowQueue);
    global.gbufferStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _passPhase, _renderQueue, _define2, _renderBatchedQueue, _renderInstancedQueue, _renderStage, _enum, _instancedBuffer, _batchedBuffer, _pass, _pipelineSerialization, _planarShadowQueue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.GbufferStage = void 0;

  var _dec, _dec2, _dec3, _class, _class2, _descriptor, _class3, _temp;

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

  var colors = [new _define2.GFXColor(0, 0, 0, 0), new _define2.GFXColor(0, 0, 0, 0), new _define2.GFXColor(0, 0, 0, 0), new _define2.GFXColor(0, 0, 0, 0)];
  /**
   * @en The gbuffer render stage
   * @zh 前向渲染阶段。
   */

  var GbufferStage = (_dec = (0, _index.ccclass)('GbufferStage'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderQueueDesc]), _dec3 = (0, _index.displayOrder)(2), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderStage) {
    _inherits(GbufferStage, _RenderStage);

    _createClass(GbufferStage, [{
      key: "setGbufferFrameBuffer",
      value: function setGbufferFrameBuffer(gbufferFrameBuffer) {
        this._gbufferFrameBuffer = gbufferFrameBuffer;
      }
    }]);

    function GbufferStage() {
      var _this;

      _classCallCheck(this, GbufferStage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GbufferStage).call(this));

      _initializerDefineProperty(_this, "renderQueues", _descriptor, _assertThisInitialized(_this));

      _this._renderQueues = [];
      _this._gbufferFrameBuffer = null;
      _this._renderArea = new _define2.GFXRect();
      _this._batchedQueue = void 0;
      _this._instancedQueue = void 0;
      _this._phaseID = (0, _passPhase.getPhaseID)('deferred-gbuffer');
      _this._batchedQueue = new _renderBatchedQueue.RenderBatchedQueue();
      _this._instancedQueue = new _renderInstancedQueue.RenderInstancedQueue();
      return _this;
    }

    _createClass(GbufferStage, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(GbufferStage.prototype), "initialize", this).call(this, info);

        if (info.renderQueues) {
          this.renderQueues = info.renderQueues;
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        _get(_getPrototypeOf(GbufferStage.prototype), "activate", this).call(this, pipeline, flow);

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

        this._renderQueues.forEach(this.renderQueueSortFunc);

        this._planarQueue.updateShadowList(view);

        var camera = view.camera;
        var vp = camera.viewport;
        this._renderArea.x = vp.x * camera.width;
        this._renderArea.y = vp.y * camera.height;
        this._renderArea.width = vp.width * camera.width * pipeline.shadingScale;
        this._renderArea.height = vp.height * camera.height * pipeline.shadingScale;
        var framebuffer = this._gbufferFrameBuffer;
        var renderPass = framebuffer.renderPass;
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define.SetIndex.GLOBAL, pipeline.descriptorSet);

        for (var _i = 0; _i < this.renderQueues.length; _i++) {
          this._renderQueues[_i].recordCommandBuffer(device, renderPass, cmdBuff);
        }

        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);

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

    return GbufferStage;
  }(_renderStage.RenderStage), _class3.initInfo = {
    name: 'GbufferStage',
    priority: _enum.DeferredStagePriority.GBUFFER,
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
  })), _class2)) || _class);
  _exports.GbufferStage = GbufferStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvZ2J1ZmZlci1zdGFnZS50cyJdLCJuYW1lcyI6WyJjb2xvcnMiLCJHRlhDb2xvciIsIkdidWZmZXJTdGFnZSIsIlJlbmRlclF1ZXVlRGVzYyIsImdidWZmZXJGcmFtZUJ1ZmZlciIsIl9nYnVmZmVyRnJhbWVCdWZmZXIiLCJfcmVuZGVyUXVldWVzIiwiX3JlbmRlckFyZWEiLCJHRlhSZWN0IiwiX2JhdGNoZWRRdWV1ZSIsIl9pbnN0YW5jZWRRdWV1ZSIsIl9waGFzZUlEIiwiUmVuZGVyQmF0Y2hlZFF1ZXVlIiwiUmVuZGVySW5zdGFuY2VkUXVldWUiLCJpbmZvIiwicmVuZGVyUXVldWVzIiwicGlwZWxpbmUiLCJmbG93IiwiaSIsImxlbmd0aCIsInBoYXNlIiwiaiIsInN0YWdlcyIsInNvcnRGdW5jIiwib3BhcXVlQ29tcGFyZUZuIiwic29ydE1vZGUiLCJSZW5kZXJRdWV1ZVNvcnRNb2RlIiwiQkFDS19UT19GUk9OVCIsInRyYW5zcGFyZW50Q29tcGFyZUZuIiwiRlJPTlRfVE9fQkFDSyIsIlJlbmRlclF1ZXVlIiwiaXNUcmFuc3BhcmVudCIsInBoYXNlcyIsIl9wbGFuYXJRdWV1ZSIsIlBsYW5hclNoYWRvd1F1ZXVlIiwiX3BpcGVsaW5lIiwidmlldyIsImNsZWFyIiwiZGV2aWNlIiwiZm9yRWFjaCIsInJlbmRlclF1ZXVlQ2xlYXJGdW5jIiwicmVuZGVyT2JqZWN0cyIsIm0iLCJwIiwiayIsInJvIiwic3ViTW9kZWxzIiwibW9kZWwiLCJzdWJNb2RlbCIsInBhc3NlcyIsInBhc3MiLCJiYXRjaGluZ1NjaGVtZSIsIkJhdGNoaW5nU2NoZW1lcyIsIklOU1RBTkNJTkciLCJpbnN0YW5jZWRCdWZmZXIiLCJJbnN0YW5jZWRCdWZmZXIiLCJnZXQiLCJtZXJnZSIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJxdWV1ZSIsImFkZCIsIlZCX01FUkdJTkciLCJiYXRjaGVkQnVmZmVyIiwiQmF0Y2hlZEJ1ZmZlciIsImluc2VydFJlbmRlclBhc3MiLCJjbWRCdWZmIiwiY29tbWFuZEJ1ZmZlcnMiLCJyZW5kZXJRdWV1ZVNvcnRGdW5jIiwidXBkYXRlU2hhZG93TGlzdCIsImNhbWVyYSIsInZwIiwidmlld3BvcnQiLCJ4Iiwid2lkdGgiLCJ5IiwiaGVpZ2h0Iiwic2hhZGluZ1NjYWxlIiwiZnJhbWVidWZmZXIiLCJyZW5kZXJQYXNzIiwiYmVnaW5SZW5kZXJQYXNzIiwiY2xlYXJEZXB0aCIsImNsZWFyU3RlbmNpbCIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJHTE9CQUwiLCJkZXNjcmlwdG9yU2V0IiwicmVjb3JkQ29tbWFuZEJ1ZmZlciIsImVuZFJlbmRlclBhc3MiLCJycSIsInNvcnQiLCJSZW5kZXJTdGFnZSIsImluaXRJbmZvIiwibmFtZSIsInByaW9yaXR5IiwiRGVmZXJyZWRTdGFnZVByaW9yaXR5IiwiR0JVRkZFUiIsInRhZyIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsTUFBTUEsTUFBa0IsR0FBRyxDQUFFLElBQUlDLGlCQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUFGLEVBQTRCLElBQUlBLGlCQUFKLENBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQixDQUF0QixDQUE1QixFQUFzRCxJQUFJQSxpQkFBSixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBdEQsRUFBZ0YsSUFBSUEsaUJBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQWhGLENBQTNCO0FBRUE7Ozs7O01BS2FDLFksV0FEWixvQkFBUSxjQUFSLEMsVUF5QkksaUJBQUssQ0FBQ0Msc0NBQUQsQ0FBTCxDLFVBRUEseUJB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QyxJQUFBQSxJQUFJLEVBQUUsY0FEaUM7QUFFdkNDLElBQUFBLFFBQVEsRUFBRUMsNEJBQXNCQyxPQUZPO0FBR3ZDQyxJQUFBQSxHQUFHLEVBQUUsQ0FIa0M7QUFJdkNqRixJQUFBQSxZQUFZLEVBQUUsQ0FDVjtBQUNJZ0IsTUFBQUEsYUFBYSxFQUFFLEtBRG5CO0FBRUlOLE1BQUFBLFFBQVEsRUFBRUMsMkNBQW9CRyxhQUZsQztBQUdJUCxNQUFBQSxNQUFNLEVBQUUsQ0FBQyxTQUFEO0FBSFosS0FEVSxFQU1WO0FBQ0lTLE1BQUFBLGFBQWEsRUFBRSxJQURuQjtBQUVJTixNQUFBQSxRQUFRLEVBQUVDLDJDQUFvQkMsYUFGbEM7QUFHSUwsTUFBQUEsTUFBTSxFQUFFLENBQUMsU0FBRCxFQUFZLGNBQVo7QUFIWixLQU5VO0FBSnlCLEcsOEZBdUIxQzJFLG1COzs7OzthQUUyQyxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgSVJlbmRlclBhc3MsIFNldEluZGV4IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgZ2V0UGhhc2VJRCB9IGZyb20gJy4uL3Bhc3MtcGhhc2UnO1xyXG5pbXBvcnQgeyBvcGFxdWVDb21wYXJlRm4sIFJlbmRlclF1ZXVlLCB0cmFuc3BhcmVudENvbXBhcmVGbiB9IGZyb20gJy4uL3JlbmRlci1xdWV1ZSc7XHJcbmltcG9ydCB7IEdGWENvbG9yLCBHRlhSZWN0IH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IFJlbmRlckJhdGNoZWRRdWV1ZSB9IGZyb20gJy4uL3JlbmRlci1iYXRjaGVkLXF1ZXVlJztcclxuaW1wb3J0IHsgUmVuZGVySW5zdGFuY2VkUXVldWUgfSBmcm9tICcuLi9yZW5kZXItaW5zdGFuY2VkLXF1ZXVlJztcclxuaW1wb3J0IHsgSVJlbmRlclN0YWdlSW5mbywgUmVuZGVyU3RhZ2UgfSBmcm9tICcuLi9yZW5kZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBEZWZlcnJlZFN0YWdlUHJpb3JpdHkgfSBmcm9tICcuL2VudW0nO1xyXG5pbXBvcnQgeyBSZW5kZXJBZGRpdGl2ZUxpZ2h0UXVldWUgfSBmcm9tICcuLi9yZW5kZXItYWRkaXRpdmUtbGlnaHQtcXVldWUnO1xyXG5pbXBvcnQgeyBJbnN0YW5jZWRCdWZmZXIgfSBmcm9tICcuLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgQmF0Y2hlZEJ1ZmZlciB9IGZyb20gJy4uL2JhdGNoZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgQmF0Y2hpbmdTY2hlbWVzIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9wYXNzJztcclxuaW1wb3J0IHsgR2J1ZmZlckZsb3cgfSBmcm9tICcuL2didWZmZXItZmxvdyc7XHJcbmltcG9ydCB7IERlZmVycmVkUGlwZWxpbmUgfSBmcm9tICcuL2RlZmVycmVkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyUXVldWVEZXNjLCBSZW5kZXJRdWV1ZVNvcnRNb2RlIH0gZnJvbSAnLi4vcGlwZWxpbmUtc2VyaWFsaXphdGlvbic7XHJcbmltcG9ydCB7IFBsYW5hclNoYWRvd1F1ZXVlIH0gZnJvbSAnLi9wbGFuYXItc2hhZG93LXF1ZXVlJztcclxuaW1wb3J0IHsgR0ZYRnJhbWVidWZmZXIgfSBmcm9tICcuLi8uLi9nZngnO1xyXG5cclxuXHJcbmNvbnN0IGNvbG9yczogR0ZYQ29sb3JbXSA9IFsgbmV3IEdGWENvbG9yKDAsIDAsIDAsIDApLCBuZXcgR0ZYQ29sb3IoMCwgMCwgMCwgMCksIG5ldyBHRlhDb2xvcigwLCAwLCAwLCAwKSwgbmV3IEdGWENvbG9yKDAsIDAsIDAsIDApIF07XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBnYnVmZmVyIHJlbmRlciBzdGFnZVxyXG4gKiBAemgg5YmN5ZCR5riy5p+T6Zi25q6144CCXHJcbiAqL1xyXG5AY2NjbGFzcygnR2J1ZmZlclN0YWdlJylcclxuZXhwb3J0IGNsYXNzIEdidWZmZXJTdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRJbmZvOiBJUmVuZGVyU3RhZ2VJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6ICdHYnVmZmVyU3RhZ2UnLFxyXG4gICAgICAgIHByaW9yaXR5OiBEZWZlcnJlZFN0YWdlUHJpb3JpdHkuR0JVRkZFUixcclxuICAgICAgICB0YWc6IDAsXHJcbiAgICAgICAgcmVuZGVyUXVldWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlzVHJhbnNwYXJlbnQ6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc29ydE1vZGU6IFJlbmRlclF1ZXVlU29ydE1vZGUuRlJPTlRfVE9fQkFDSyxcclxuICAgICAgICAgICAgICAgIHN0YWdlczogWydkZWZhdWx0J10sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGlzVHJhbnNwYXJlbnQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzb3J0TW9kZTogUmVuZGVyUXVldWVTb3J0TW9kZS5CQUNLX1RPX0ZST05ULFxyXG4gICAgICAgICAgICAgICAgc3RhZ2VzOiBbJ2RlZmF1bHQnLCAncGxhbmFyU2hhZG93J10sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXVxyXG4gICAgfTtcclxuXHJcbiAgICBwdWJsaWMgc2V0R2J1ZmZlckZyYW1lQnVmZmVyIChnYnVmZmVyRnJhbWVCdWZmZXI6IEdGWEZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZ2J1ZmZlckZyYW1lQnVmZmVyID0gZ2J1ZmZlckZyYW1lQnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIEB0eXBlKFtSZW5kZXJRdWV1ZURlc2NdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlczogUmVuZGVyUXVldWVEZXNjW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfcmVuZGVyUXVldWVzOiBSZW5kZXJRdWV1ZVtdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2J1ZmZlckZyYW1lQnVmZmVyOiBHRlhGcmFtZWJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcmVuZGVyQXJlYSA9IG5ldyBHRlhSZWN0KCk7XHJcbiAgICBwcml2YXRlIF9iYXRjaGVkUXVldWU6IFJlbmRlckJhdGNoZWRRdWV1ZTtcclxuICAgIHByaXZhdGUgX2luc3RhbmNlZFF1ZXVlOiBSZW5kZXJJbnN0YW5jZWRRdWV1ZTtcclxuICAgIHByaXZhdGUgX3BoYXNlSUQgPSBnZXRQaGFzZUlEKCdkZWZlcnJlZC1nYnVmZmVyJyk7XHJcbiAgICBwcml2YXRlIGRlY2xhcmUgX3BsYW5hclF1ZXVlOiBQbGFuYXJTaGFkb3dRdWV1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVkUXVldWUgPSBuZXcgUmVuZGVyQmF0Y2hlZFF1ZXVlKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUgPSBuZXcgUmVuZGVySW5zdGFuY2VkUXVldWUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclN0YWdlSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgaWYgKGluZm8ucmVuZGVyUXVldWVzKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyUXVldWVzID0gaW5mby5yZW5kZXJRdWV1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAocGlwZWxpbmU6IERlZmVycmVkUGlwZWxpbmUsIGZsb3c6IEdidWZmZXJGbG93KSB7XHJcbiAgICAgICAgc3VwZXIuYWN0aXZhdGUocGlwZWxpbmUsIGZsb3cpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yZW5kZXJRdWV1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgbGV0IHBoYXNlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLnJlbmRlclF1ZXVlc1tpXS5zdGFnZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIHBoYXNlIHw9IGdldFBoYXNlSUQodGhpcy5yZW5kZXJRdWV1ZXNbaV0uc3RhZ2VzW2pdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgc29ydEZ1bmM6IChhOiBJUmVuZGVyUGFzcywgYjogSVJlbmRlclBhc3MpID0+IG51bWJlciA9IG9wYXF1ZUNvbXBhcmVGbjtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLnJlbmRlclF1ZXVlc1tpXS5zb3J0TW9kZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBSZW5kZXJRdWV1ZVNvcnRNb2RlLkJBQ0tfVE9fRlJPTlQ6XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEZ1bmMgPSB0cmFuc3BhcmVudENvbXBhcmVGbjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgUmVuZGVyUXVldWVTb3J0TW9kZS5GUk9OVF9UT19CQUNLOlxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRGdW5jID0gb3BhcXVlQ29tcGFyZUZuO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXNbaV0gPSBuZXcgUmVuZGVyUXVldWUoe1xyXG4gICAgICAgICAgICAgICAgaXNUcmFuc3BhcmVudDogdGhpcy5yZW5kZXJRdWV1ZXNbaV0uaXNUcmFuc3BhcmVudCxcclxuICAgICAgICAgICAgICAgIHBoYXNlczogcGhhc2UsXHJcbiAgICAgICAgICAgICAgICBzb3J0RnVuYyxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9wbGFuYXJRdWV1ZSA9IG5ldyBQbGFuYXJTaGFkb3dRdWV1ZSh0aGlzLl9waXBlbGluZSBhcyBEZWZlcnJlZFBpcGVsaW5lKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIgKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuXHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVkUXVldWUuY2xlYXIoKTtcclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuX3BpcGVsaW5lIGFzIERlZmVycmVkUGlwZWxpbmU7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gcGlwZWxpbmUuZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlcy5mb3JFYWNoKHRoaXMucmVuZGVyUXVldWVDbGVhckZ1bmMpO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJPYmplY3RzID0gcGlwZWxpbmUucmVuZGVyT2JqZWN0cztcclxuICAgICAgICBsZXQgbSA9IDA7IGxldCBwID0gMDsgbGV0IGsgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyT2JqZWN0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IHJlbmRlck9iamVjdHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IHJvLm1vZGVsLnN1Yk1vZGVscztcclxuICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHN1Yk1vZGVscy5sZW5ndGg7ICsrbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViTW9kZWwgPSBzdWJNb2RlbHNbbV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzZXMgPSBzdWJNb2RlbC5wYXNzZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcGFzc2VzLmxlbmd0aDsgKytwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzcyA9IHBhc3Nlc1twXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFzcy5waGFzZSAhPT0gdGhpcy5fcGhhc2VJRCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hpbmdTY2hlbWUgPSBwYXNzLmJhdGNoaW5nU2NoZW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXRjaGluZ1NjaGVtZSA9PT0gQmF0Y2hpbmdTY2hlbWVzLklOU1RBTkNJTkcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VkQnVmZmVyID0gSW5zdGFuY2VkQnVmZmVyLmdldChwYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VkQnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCByby5tb2RlbC5pbnN0YW5jZWRBdHRyaWJ1dGVzLCBwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUucXVldWUuYWRkKGluc3RhbmNlZEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiYXRjaGluZ1NjaGVtZSA9PT0gQmF0Y2hpbmdTY2hlbWVzLlZCX01FUkdJTkcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hlZEJ1ZmZlciA9IEJhdGNoZWRCdWZmZXIuZ2V0KHBhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaGVkQnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCBwLCBybyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5xdWV1ZS5hZGQoYmF0Y2hlZEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHRoaXMuX3JlbmRlclF1ZXVlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzW2tdLmluc2VydFJlbmRlclBhc3Mocm8sIG0sIHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNtZEJ1ZmYgPSBwaXBlbGluZS5jb21tYW5kQnVmZmVyc1swXTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzLmZvckVhY2godGhpcy5yZW5kZXJRdWV1ZVNvcnRGdW5jKTtcclxuICAgICAgICB0aGlzLl9wbGFuYXJRdWV1ZS51cGRhdGVTaGFkb3dMaXN0KHZpZXcpO1xyXG5cclxuICAgICAgICBjb25zdCBjYW1lcmEgPSB2aWV3LmNhbWVyYTtcclxuICAgICAgICBjb25zdCB2cCA9IGNhbWVyYS52aWV3cG9ydDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS54ID0gdnAueCAqIGNhbWVyYS53aWR0aDtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS55ID0gdnAueSAqIGNhbWVyYS5oZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXJlYSEud2lkdGggPSB2cC53aWR0aCAqIGNhbWVyYS53aWR0aCAqIHBpcGVsaW5lLnNoYWRpbmdTY2FsZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJBcmVhIS5oZWlnaHQgPSB2cC5oZWlnaHQgKiBjYW1lcmEuaGVpZ2h0ICogcGlwZWxpbmUuc2hhZGluZ1NjYWxlO1xyXG5cclxuICAgICAgICBjb25zdCBmcmFtZWJ1ZmZlciA9IHRoaXMuX2didWZmZXJGcmFtZUJ1ZmZlciE7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzcyA9IGZyYW1lYnVmZmVyLnJlbmRlclBhc3M7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmVnaW5SZW5kZXJQYXNzKHJlbmRlclBhc3MsIGZyYW1lYnVmZmVyLCB0aGlzLl9yZW5kZXJBcmVhISxcclxuICAgICAgICAgICAgY29sb3JzLCBjYW1lcmEuY2xlYXJEZXB0aCwgY2FtZXJhLmNsZWFyU3RlbmNpbCk7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguR0xPQkFMLCBwaXBlbGluZS5kZXNjcmlwdG9yU2V0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnJlbmRlclF1ZXVlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJRdWV1ZXNbaV0ucmVjb3JkQ29tbWFuZEJ1ZmZlcihkZXZpY2UsIHJlbmRlclBhc3MsIGNtZEJ1ZmYpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcbiAgICAgICAgdGhpcy5fYmF0Y2hlZFF1ZXVlLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzLCBjbWRCdWZmKTtcclxuICAgICAgICB0aGlzLl9wbGFuYXJRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcblxyXG4gICAgICAgIGNtZEJ1ZmYuZW5kUmVuZGVyUGFzcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyIHRoZSBnaXZlbiByZW5kZXIgcXVldWVcclxuICAgICAqIEB6aCDmuIXnqbrmjIflrprnmoTmuLLmn5PpmJ/liJdcclxuICAgICAqIEBwYXJhbSBycSBUaGUgcmVuZGVyIHF1ZXVlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCByZW5kZXJRdWV1ZUNsZWFyRnVuYyAocnE6IFJlbmRlclF1ZXVlKSB7XHJcbiAgICAgICAgcnEuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTb3J0IHRoZSBnaXZlbiByZW5kZXIgcXVldWVcclxuICAgICAqIEB6aCDlr7nmjIflrprnmoTmuLLmn5PpmJ/liJfmiafooYzmjpLluo9cclxuICAgICAqIEBwYXJhbSBycSBUaGUgcmVuZGVyIHF1ZXVlXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCByZW5kZXJRdWV1ZVNvcnRGdW5jIChycTogUmVuZGVyUXVldWUpIHtcclxuICAgICAgICBycS5zb3J0KCk7XHJcbiAgICB9XHJcbn1cclxuIl19