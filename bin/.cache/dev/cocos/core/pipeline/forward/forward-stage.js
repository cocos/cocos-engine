(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../define.js", "../pass-phase.js", "../render-queue.js", "../../gfx/define.js", "../pipeline-funcs.js", "../render-batched-queue.js", "../render-instanced-queue.js", "../render-stage.js", "./enum.js", "../render-additive-light-queue.js", "../instanced-buffer.js", "../batched-buffer.js", "../../renderer/core/pass.js", "../pipeline-serialization.js", "./planar-shadow-queue.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../define.js"), require("../pass-phase.js"), require("../render-queue.js"), require("../../gfx/define.js"), require("../pipeline-funcs.js"), require("../render-batched-queue.js"), require("../render-instanced-queue.js"), require("../render-stage.js"), require("./enum.js"), require("../render-additive-light-queue.js"), require("../instanced-buffer.js"), require("../batched-buffer.js"), require("../../renderer/core/pass.js"), require("../pipeline-serialization.js"), require("./planar-shadow-queue.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.passPhase, global.renderQueue, global.define, global.pipelineFuncs, global.renderBatchedQueue, global.renderInstancedQueue, global.renderStage, global._enum, global.renderAdditiveLightQueue, global.instancedBuffer, global.batchedBuffer, global.pass, global.pipelineSerialization, global.planarShadowQueue);
    global.forwardStage = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _passPhase, _renderQueue, _define2, _pipelineFuncs, _renderBatchedQueue, _renderInstancedQueue, _renderStage, _enum, _renderAdditiveLightQueue, _instancedBuffer, _batchedBuffer, _pass, _pipelineSerialization, _planarShadowQueue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ForwardStage = void 0;

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
   * @en The forward render stage
   * @zh 前向渲染阶段。
   */

  var ForwardStage = (_dec = (0, _index.ccclass)('ForwardStage'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderQueueDesc]), _dec3 = (0, _index.displayOrder)(2), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_RenderStage) {
    _inherits(ForwardStage, _RenderStage);

    function ForwardStage() {
      var _this;

      _classCallCheck(this, ForwardStage);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ForwardStage).call(this));

      _initializerDefineProperty(_this, "renderQueues", _descriptor, _assertThisInitialized(_this));

      _this._renderQueues = [];
      _this._renderArea = new _define2.GFXRect();
      _this._batchedQueue = void 0;
      _this._instancedQueue = void 0;
      _this._phaseID = (0, _passPhase.getPhaseID)('default');
      _this._batchedQueue = new _renderBatchedQueue.RenderBatchedQueue();
      _this._instancedQueue = new _renderInstancedQueue.RenderInstancedQueue();
      return _this;
    }

    _createClass(ForwardStage, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(ForwardStage.prototype), "initialize", this).call(this, info);

        if (info.renderQueues) {
          this.renderQueues = info.renderQueues;
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate(pipeline, flow) {
        _get(_getPrototypeOf(ForwardStage.prototype), "activate", this).call(this, pipeline, flow);

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

        this._additiveLightQueue = new _renderAdditiveLightQueue.RenderAdditiveLightQueue(this._pipeline);
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

        this._additiveLightQueue.gatherLightPasses(view, cmdBuff);

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
        var renderPass = framebuffer.colorTextures[0] ? framebuffer.renderPass : pipeline.getRenderPass(camera.clearFlag);
        cmdBuff.beginRenderPass(renderPass, framebuffer, this._renderArea, colors, camera.clearDepth, camera.clearStencil);
        cmdBuff.bindDescriptorSet(_define.SetIndex.GLOBAL, pipeline.descriptorSet);

        this._renderQueues[0].recordCommandBuffer(device, renderPass, cmdBuff);

        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._additiveLightQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._planarQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._renderQueues[1].recordCommandBuffer(device, renderPass, cmdBuff);

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

    return ForwardStage;
  }(_renderStage.RenderStage), _class3.initInfo = {
    name: 'ForwardStage',
    priority: _enum.ForwardStagePriority.FORWARD,
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
  _exports.ForwardStage = ForwardStage;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZm9yd2FyZC9mb3J3YXJkLXN0YWdlLnRzIl0sIm5hbWVzIjpbImNvbG9ycyIsIkdGWENvbG9yIiwiRm9yd2FyZFN0YWdlIiwiUmVuZGVyUXVldWVEZXNjIiwiX3JlbmRlclF1ZXVlcyIsIl9yZW5kZXJBcmVhIiwiR0ZYUmVjdCIsIl9iYXRjaGVkUXVldWUiLCJfaW5zdGFuY2VkUXVldWUiLCJfcGhhc2VJRCIsIlJlbmRlckJhdGNoZWRRdWV1ZSIsIlJlbmRlckluc3RhbmNlZFF1ZXVlIiwiaW5mbyIsInJlbmRlclF1ZXVlcyIsInBpcGVsaW5lIiwiZmxvdyIsImkiLCJsZW5ndGgiLCJwaGFzZSIsImoiLCJzdGFnZXMiLCJzb3J0RnVuYyIsIm9wYXF1ZUNvbXBhcmVGbiIsInNvcnRNb2RlIiwiUmVuZGVyUXVldWVTb3J0TW9kZSIsIkJBQ0tfVE9fRlJPTlQiLCJ0cmFuc3BhcmVudENvbXBhcmVGbiIsIkZST05UX1RPX0JBQ0siLCJSZW5kZXJRdWV1ZSIsImlzVHJhbnNwYXJlbnQiLCJwaGFzZXMiLCJfYWRkaXRpdmVMaWdodFF1ZXVlIiwiUmVuZGVyQWRkaXRpdmVMaWdodFF1ZXVlIiwiX3BpcGVsaW5lIiwiX3BsYW5hclF1ZXVlIiwiUGxhbmFyU2hhZG93UXVldWUiLCJ2aWV3IiwiY2xlYXIiLCJkZXZpY2UiLCJmb3JFYWNoIiwicmVuZGVyUXVldWVDbGVhckZ1bmMiLCJyZW5kZXJPYmplY3RzIiwibSIsInAiLCJrIiwicm8iLCJzdWJNb2RlbHMiLCJtb2RlbCIsInN1Yk1vZGVsIiwicGFzc2VzIiwicGFzcyIsImJhdGNoaW5nU2NoZW1lIiwiQmF0Y2hpbmdTY2hlbWVzIiwiSU5TVEFOQ0lORyIsImluc3RhbmNlZEJ1ZmZlciIsIkluc3RhbmNlZEJ1ZmZlciIsImdldCIsIm1lcmdlIiwiaW5zdGFuY2VkQXR0cmlidXRlcyIsInF1ZXVlIiwiYWRkIiwiVkJfTUVSR0lORyIsImJhdGNoZWRCdWZmZXIiLCJCYXRjaGVkQnVmZmVyIiwiaW5zZXJ0UmVuZGVyUGFzcyIsImNtZEJ1ZmYiLCJjb21tYW5kQnVmZmVycyIsInJlbmRlclF1ZXVlU29ydEZ1bmMiLCJnYXRoZXJMaWdodFBhc3NlcyIsInVwZGF0ZVNoYWRvd0xpc3QiLCJjYW1lcmEiLCJ2cCIsInZpZXdwb3J0IiwieCIsIndpZHRoIiwieSIsImhlaWdodCIsInNoYWRpbmdTY2FsZSIsImNsZWFyRmxhZyIsIkdGWENsZWFyRmxhZyIsIkNPTE9SIiwiaXNIRFIiLCJjbGVhckNvbG9yIiwic2NhbGUiLCJmcFNjYWxlIiwiZXhwb3N1cmUiLCJ6IiwidyIsImZyYW1lYnVmZmVyIiwid2luZG93IiwicmVuZGVyUGFzcyIsImNvbG9yVGV4dHVyZXMiLCJnZXRSZW5kZXJQYXNzIiwiYmVnaW5SZW5kZXJQYXNzIiwiY2xlYXJEZXB0aCIsImNsZWFyU3RlbmNpbCIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJHTE9CQUwiLCJkZXNjcmlwdG9yU2V0IiwicmVjb3JkQ29tbWFuZEJ1ZmZlciIsImVuZFJlbmRlclBhc3MiLCJycSIsInNvcnQiLCJSZW5kZXJTdGFnZSIsImluaXRJbmZvIiwibmFtZSIsInByaW9yaXR5IiwiRm9yd2FyZFN0YWdlUHJpb3JpdHkiLCJGT1JXQVJEIiwidGFnIiwic2VyaWFsaXphYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxNQUFrQixHQUFHLENBQUUsSUFBSUMsaUJBQUosQ0FBYSxDQUFiLEVBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLENBQXRCLENBQUYsQ0FBM0I7QUFFQTs7Ozs7TUFLYUMsWSxXQURaLG9CQUFRLGNBQVIsQyxVQXNCSSxpQkFBSyxDQUFDQyxzQ0FBRCxDQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEM7OztBQVdELDRCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7O0FBRFc7O0FBQUEs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RUFBRSxjQURpQztBQUV2Q0MsSUFBQUEsUUFBUSxFQUFFQywyQkFBcUJDLE9BRlE7QUFHdkNDLElBQUFBLEdBQUcsRUFBRSxDQUhrQztBQUl2Q2pHLElBQUFBLFlBQVksRUFBRSxDQUNWO0FBQ0lnQixNQUFBQSxhQUFhLEVBQUUsS0FEbkI7QUFFSU4sTUFBQUEsUUFBUSxFQUFFQywyQ0FBb0JHLGFBRmxDO0FBR0lQLE1BQUFBLE1BQU0sRUFBRSxDQUFDLFNBQUQ7QUFIWixLQURVLEVBTVY7QUFDSVMsTUFBQUEsYUFBYSxFQUFFLElBRG5CO0FBRUlOLE1BQUFBLFFBQVEsRUFBRUMsMkNBQW9CQyxhQUZsQztBQUdJTCxNQUFBQSxNQUFNLEVBQUUsQ0FBQyxTQUFELEVBQVksY0FBWjtBQUhaLEtBTlU7QUFKeUIsRyw4RkFvQjFDMkYsbUI7Ozs7O2FBRTJDLEUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IHBpcGVsaW5lXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdmlzaWJsZSwgZGlzcGxheU9yZGVyLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBJUmVuZGVyUGFzcywgU2V0SW5kZXggfSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBnZXRQaGFzZUlEIH0gZnJvbSAnLi4vcGFzcy1waGFzZSc7XHJcbmltcG9ydCB7IG9wYXF1ZUNvbXBhcmVGbiwgUmVuZGVyUXVldWUsIHRyYW5zcGFyZW50Q29tcGFyZUZuIH0gZnJvbSAnLi4vcmVuZGVyLXF1ZXVlJztcclxuaW1wb3J0IHsgR0ZYQ2xlYXJGbGFnLCBHRlhDb2xvciwgR0ZYUmVjdCB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBTUkdCVG9MaW5lYXIgfSBmcm9tICcuLi9waXBlbGluZS1mdW5jcyc7XHJcbmltcG9ydCB7IFJlbmRlckJhdGNoZWRRdWV1ZSB9IGZyb20gJy4uL3JlbmRlci1iYXRjaGVkLXF1ZXVlJztcclxuaW1wb3J0IHsgUmVuZGVySW5zdGFuY2VkUXVldWUgfSBmcm9tICcuLi9yZW5kZXItaW5zdGFuY2VkLXF1ZXVlJztcclxuaW1wb3J0IHsgSVJlbmRlclN0YWdlSW5mbywgUmVuZGVyU3RhZ2UgfSBmcm9tICcuLi9yZW5kZXItc3RhZ2UnO1xyXG5pbXBvcnQgeyBSZW5kZXJWaWV3IH0gZnJvbSAnLi4vcmVuZGVyLXZpZXcnO1xyXG5pbXBvcnQgeyBGb3J3YXJkU3RhZ2VQcmlvcml0eSB9IGZyb20gJy4vZW51bSc7XHJcbmltcG9ydCB7IFJlbmRlckFkZGl0aXZlTGlnaHRRdWV1ZSB9IGZyb20gJy4uL3JlbmRlci1hZGRpdGl2ZS1saWdodC1xdWV1ZSc7XHJcbmltcG9ydCB7IEluc3RhbmNlZEJ1ZmZlciB9IGZyb20gJy4uL2luc3RhbmNlZC1idWZmZXInO1xyXG5pbXBvcnQgeyBCYXRjaGVkQnVmZmVyIH0gZnJvbSAnLi4vYmF0Y2hlZC1idWZmZXInO1xyXG5pbXBvcnQgeyBCYXRjaGluZ1NjaGVtZXMgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9jb3JlL3Bhc3MnO1xyXG5pbXBvcnQgeyBGb3J3YXJkRmxvdyB9IGZyb20gJy4vZm9yd2FyZC1mbG93JztcclxuaW1wb3J0IHsgRm9yd2FyZFBpcGVsaW5lIH0gZnJvbSAnLi9mb3J3YXJkLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgUmVuZGVyUXVldWVEZXNjLCBSZW5kZXJRdWV1ZVNvcnRNb2RlIH0gZnJvbSAnLi4vcGlwZWxpbmUtc2VyaWFsaXphdGlvbic7XHJcbmltcG9ydCB7IFBsYW5hclNoYWRvd1F1ZXVlIH0gZnJvbSAnLi9wbGFuYXItc2hhZG93LXF1ZXVlJztcclxuXHJcbmNvbnN0IGNvbG9yczogR0ZYQ29sb3JbXSA9IFsgbmV3IEdGWENvbG9yKDAsIDAsIDAsIDEpIF07XHJcblxyXG4vKipcclxuICogQGVuIFRoZSBmb3J3YXJkIHJlbmRlciBzdGFnZVxyXG4gKiBAemgg5YmN5ZCR5riy5p+T6Zi25q6144CCXHJcbiAqL1xyXG5AY2NjbGFzcygnRm9yd2FyZFN0YWdlJylcclxuZXhwb3J0IGNsYXNzIEZvcndhcmRTdGFnZSBleHRlbmRzIFJlbmRlclN0YWdlIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRJbmZvOiBJUmVuZGVyU3RhZ2VJbmZvID0ge1xyXG4gICAgICAgIG5hbWU6ICdGb3J3YXJkU3RhZ2UnLFxyXG4gICAgICAgIHByaW9yaXR5OiBGb3J3YXJkU3RhZ2VQcmlvcml0eS5GT1JXQVJELFxyXG4gICAgICAgIHRhZzogMCxcclxuICAgICAgICByZW5kZXJRdWV1ZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXNUcmFuc3BhcmVudDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzb3J0TW9kZTogUmVuZGVyUXVldWVTb3J0TW9kZS5GUk9OVF9UT19CQUNLLFxyXG4gICAgICAgICAgICAgICAgc3RhZ2VzOiBbJ2RlZmF1bHQnXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaXNUcmFuc3BhcmVudDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHNvcnRNb2RlOiBSZW5kZXJRdWV1ZVNvcnRNb2RlLkJBQ0tfVE9fRlJPTlQsXHJcbiAgICAgICAgICAgICAgICBzdGFnZXM6IFsnZGVmYXVsdCcsICdwbGFuYXJTaGFkb3cnXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICBAdHlwZShbUmVuZGVyUXVldWVEZXNjXSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIHByb3RlY3RlZCByZW5kZXJRdWV1ZXM6IFJlbmRlclF1ZXVlRGVzY1tdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3JlbmRlclF1ZXVlczogUmVuZGVyUXVldWVbXSA9IFtdO1xyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlckFyZWEgPSBuZXcgR0ZYUmVjdCgpO1xyXG4gICAgcHJpdmF0ZSBfYmF0Y2hlZFF1ZXVlOiBSZW5kZXJCYXRjaGVkUXVldWU7XHJcbiAgICBwcml2YXRlIF9pbnN0YW5jZWRRdWV1ZTogUmVuZGVySW5zdGFuY2VkUXVldWU7XHJcbiAgICBwcml2YXRlIF9waGFzZUlEID0gZ2V0UGhhc2VJRCgnZGVmYXVsdCcpO1xyXG4gICAgcHJpdmF0ZSBkZWNsYXJlIF9hZGRpdGl2ZUxpZ2h0UXVldWU6IFJlbmRlckFkZGl0aXZlTGlnaHRRdWV1ZTtcclxuICAgIHByaXZhdGUgZGVjbGFyZSBfcGxhbmFyUXVldWU6IFBsYW5hclNoYWRvd1F1ZXVlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZSA9IG5ldyBSZW5kZXJCYXRjaGVkUXVldWUoKTtcclxuICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZSA9IG5ldyBSZW5kZXJJbnN0YW5jZWRRdWV1ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyU3RhZ2VJbmZvKTogYm9vbGVhbiB7XHJcbiAgICAgICAgc3VwZXIuaW5pdGlhbGl6ZShpbmZvKTtcclxuICAgICAgICBpZiAoaW5mby5yZW5kZXJRdWV1ZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXJRdWV1ZXMgPSBpbmZvLnJlbmRlclF1ZXVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjdGl2YXRlIChwaXBlbGluZTogRm9yd2FyZFBpcGVsaW5lLCBmbG93OiBGb3J3YXJkRmxvdykge1xyXG4gICAgICAgIHN1cGVyLmFjdGl2YXRlKHBpcGVsaW5lLCBmbG93KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucmVuZGVyUXVldWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBwaGFzZSA9IDA7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5yZW5kZXJRdWV1ZXNbaV0uc3RhZ2VzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICBwaGFzZSB8PSBnZXRQaGFzZUlEKHRoaXMucmVuZGVyUXVldWVzW2ldLnN0YWdlc1tqXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbGV0IHNvcnRGdW5jOiAoYTogSVJlbmRlclBhc3MsIGI6IElSZW5kZXJQYXNzKSA9PiBudW1iZXIgPSBvcGFxdWVDb21wYXJlRm47XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5yZW5kZXJRdWV1ZXNbaV0uc29ydE1vZGUpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgUmVuZGVyUXVldWVTb3J0TW9kZS5CQUNLX1RPX0ZST05UOlxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRGdW5jID0gdHJhbnNwYXJlbnRDb21wYXJlRm47XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFJlbmRlclF1ZXVlU29ydE1vZGUuRlJPTlRfVE9fQkFDSzpcclxuICAgICAgICAgICAgICAgICAgICBzb3J0RnVuYyA9IG9wYXF1ZUNvbXBhcmVGbjtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzW2ldID0gbmV3IFJlbmRlclF1ZXVlKHtcclxuICAgICAgICAgICAgICAgIGlzVHJhbnNwYXJlbnQ6IHRoaXMucmVuZGVyUXVldWVzW2ldLmlzVHJhbnNwYXJlbnQsXHJcbiAgICAgICAgICAgICAgICBwaGFzZXM6IHBoYXNlLFxyXG4gICAgICAgICAgICAgICAgc29ydEZ1bmMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYWRkaXRpdmVMaWdodFF1ZXVlID0gbmV3IFJlbmRlckFkZGl0aXZlTGlnaHRRdWV1ZSh0aGlzLl9waXBlbGluZSBhcyBGb3J3YXJkUGlwZWxpbmUpO1xyXG4gICAgICAgIHRoaXMuX3BsYW5hclF1ZXVlID0gbmV3IFBsYW5hclNoYWRvd1F1ZXVlKHRoaXMuX3BpcGVsaW5lIGFzIEZvcndhcmRQaXBlbGluZSk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2luc3RhbmNlZFF1ZXVlLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fYmF0Y2hlZFF1ZXVlLmNsZWFyKCk7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSB0aGlzLl9waXBlbGluZSBhcyBGb3J3YXJkUGlwZWxpbmU7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gcGlwZWxpbmUuZGV2aWNlO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlcy5mb3JFYWNoKHRoaXMucmVuZGVyUXVldWVDbGVhckZ1bmMpO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJPYmplY3RzID0gcGlwZWxpbmUucmVuZGVyT2JqZWN0cztcclxuICAgICAgICBsZXQgbSA9IDA7IGxldCBwID0gMDsgbGV0IGsgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVuZGVyT2JqZWN0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBybyA9IHJlbmRlck9iamVjdHNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IHJvLm1vZGVsLnN1Yk1vZGVscztcclxuICAgICAgICAgICAgZm9yIChtID0gMDsgbSA8IHN1Yk1vZGVscy5sZW5ndGg7ICsrbSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc3ViTW9kZWwgPSBzdWJNb2RlbHNbbV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzZXMgPSBzdWJNb2RlbC5wYXNzZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHAgPSAwOyBwIDwgcGFzc2VzLmxlbmd0aDsgKytwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcGFzcyA9IHBhc3Nlc1twXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocGFzcy5waGFzZSAhPT0gdGhpcy5fcGhhc2VJRCkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hpbmdTY2hlbWUgPSBwYXNzLmJhdGNoaW5nU2NoZW1lO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXRjaGluZ1NjaGVtZSA9PT0gQmF0Y2hpbmdTY2hlbWVzLklOU1RBTkNJTkcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zdGFuY2VkQnVmZmVyID0gSW5zdGFuY2VkQnVmZmVyLmdldChwYXNzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2VkQnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCByby5tb2RlbC5pbnN0YW5jZWRBdHRyaWJ1dGVzLCBwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUucXVldWUuYWRkKGluc3RhbmNlZEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChiYXRjaGluZ1NjaGVtZSA9PT0gQmF0Y2hpbmdTY2hlbWVzLlZCX01FUkdJTkcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYmF0Y2hlZEJ1ZmZlciA9IEJhdGNoZWRCdWZmZXIuZ2V0KHBhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaGVkQnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCBwLCBybyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5xdWV1ZS5hZGQoYmF0Y2hlZEJ1ZmZlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChrID0gMDsgayA8IHRoaXMuX3JlbmRlclF1ZXVlcy5sZW5ndGg7IGsrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzW2tdLmluc2VydFJlbmRlclBhc3Mocm8sIG0sIHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGNtZEJ1ZmYgPSBwaXBlbGluZS5jb21tYW5kQnVmZmVyc1swXTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzLmZvckVhY2godGhpcy5yZW5kZXJRdWV1ZVNvcnRGdW5jKTtcclxuICAgICAgICB0aGlzLl9hZGRpdGl2ZUxpZ2h0UXVldWUuZ2F0aGVyTGlnaHRQYXNzZXModmlldywgY21kQnVmZik7XHJcbiAgICAgICAgdGhpcy5fcGxhbmFyUXVldWUudXBkYXRlU2hhZG93TGlzdCh2aWV3KTtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdmlldy5jYW1lcmE7XHJcbiAgICAgICAgY29uc3QgdnAgPSBjYW1lcmEudmlld3BvcnQ7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXJlYSEueCA9IHZwLnggKiBjYW1lcmEud2lkdGg7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXJlYSEueSA9IHZwLnkgKiBjYW1lcmEuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX3JlbmRlckFyZWEhLndpZHRoID0gdnAud2lkdGggKiBjYW1lcmEud2lkdGggKiBwaXBlbGluZS5zaGFkaW5nU2NhbGU7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyQXJlYSEuaGVpZ2h0ID0gdnAuaGVpZ2h0ICogY2FtZXJhLmhlaWdodCAqIHBpcGVsaW5lLnNoYWRpbmdTY2FsZTtcclxuXHJcbiAgICAgICAgaWYgKGNhbWVyYS5jbGVhckZsYWcgJiBHRlhDbGVhckZsYWcuQ09MT1IpIHtcclxuICAgICAgICAgICAgaWYgKHBpcGVsaW5lLmlzSERSKSB7XHJcbiAgICAgICAgICAgICAgICBTUkdCVG9MaW5lYXIoY29sb3JzWzBdLCBjYW1lcmEuY2xlYXJDb2xvcik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzY2FsZSA9IHBpcGVsaW5lLmZwU2NhbGUgLyBjYW1lcmEuZXhwb3N1cmU7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueCAqPSBzY2FsZTtcclxuICAgICAgICAgICAgICAgIGNvbG9yc1swXS55ICo9IHNjYWxlO1xyXG4gICAgICAgICAgICAgICAgY29sb3JzWzBdLnogKj0gc2NhbGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueCA9IGNhbWVyYS5jbGVhckNvbG9yLng7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueSA9IGNhbWVyYS5jbGVhckNvbG9yLnk7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnNbMF0ueiA9IGNhbWVyYS5jbGVhckNvbG9yLno7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbG9yc1swXS53ID0gY2FtZXJhLmNsZWFyQ29sb3IudztcclxuXHJcbiAgICAgICAgY29uc3QgZnJhbWVidWZmZXIgPSB2aWV3LndpbmRvdy5mcmFtZWJ1ZmZlcjtcclxuICAgICAgICBjb25zdCByZW5kZXJQYXNzID0gZnJhbWVidWZmZXIuY29sb3JUZXh0dXJlc1swXSA/IGZyYW1lYnVmZmVyLnJlbmRlclBhc3MgOiBwaXBlbGluZS5nZXRSZW5kZXJQYXNzKGNhbWVyYS5jbGVhckZsYWcpO1xyXG5cclxuICAgICAgICBjbWRCdWZmLmJlZ2luUmVuZGVyUGFzcyhyZW5kZXJQYXNzLCBmcmFtZWJ1ZmZlciwgdGhpcy5fcmVuZGVyQXJlYSEsXHJcbiAgICAgICAgICAgIGNvbG9ycywgY2FtZXJhLmNsZWFyRGVwdGgsIGNhbWVyYS5jbGVhclN0ZW5jaWwpO1xyXG5cclxuICAgICAgICBjbWRCdWZmLmJpbmREZXNjcmlwdG9yU2V0KFNldEluZGV4LkdMT0JBTCwgcGlwZWxpbmUuZGVzY3JpcHRvclNldCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlclF1ZXVlc1swXS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcbiAgICAgICAgdGhpcy5faW5zdGFuY2VkUXVldWUucmVjb3JkQ29tbWFuZEJ1ZmZlcihkZXZpY2UsIHJlbmRlclBhc3MsIGNtZEJ1ZmYpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcbiAgICAgICAgdGhpcy5fYWRkaXRpdmVMaWdodFF1ZXVlLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzLCBjbWRCdWZmKTtcclxuICAgICAgICB0aGlzLl9wbGFuYXJRdWV1ZS5yZWNvcmRDb21tYW5kQnVmZmVyKGRldmljZSwgcmVuZGVyUGFzcywgY21kQnVmZik7XHJcbiAgICAgICAgdGhpcy5fcmVuZGVyUXVldWVzWzFdLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzLCBjbWRCdWZmKTtcclxuXHJcbiAgICAgICAgY21kQnVmZi5lbmRSZW5kZXJQYXNzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2xlYXIgdGhlIGdpdmVuIHJlbmRlciBxdWV1ZVxyXG4gICAgICogQHpoIOa4heepuuaMh+WumueahOa4suafk+mYn+WIl1xyXG4gICAgICogQHBhcmFtIHJxIFRoZSByZW5kZXIgcXVldWVcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlQ2xlYXJGdW5jIChycTogUmVuZGVyUXVldWUpIHtcclxuICAgICAgICBycS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNvcnQgdGhlIGdpdmVuIHJlbmRlciBxdWV1ZVxyXG4gICAgICogQHpoIOWvueaMh+WumueahOa4suafk+mYn+WIl+aJp+ihjOaOkuW6j1xyXG4gICAgICogQHBhcmFtIHJxIFRoZSByZW5kZXIgcXVldWVcclxuICAgICAqL1xyXG4gICAgcHJvdGVjdGVkIHJlbmRlclF1ZXVlU29ydEZ1bmMgKHJxOiBSZW5kZXJRdWV1ZSkge1xyXG4gICAgICAgIHJxLnNvcnQoKTtcclxuICAgIH1cclxufVxyXG4iXX0=