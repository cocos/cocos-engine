(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "./pass-phase.js", "./pipeline-state-manager.js", "../renderer/core/memory-pools.js", "./render-instanced-queue.js", "../renderer/core/pass.js", "./instanced-buffer.js", "./render-batched-queue.js", "./batched-buffer.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("./pass-phase.js"), require("./pipeline-state-manager.js"), require("../renderer/core/memory-pools.js"), require("./render-instanced-queue.js"), require("../renderer/core/pass.js"), require("./instanced-buffer.js"), require("./render-batched-queue.js"), require("./batched-buffer.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.passPhase, global.pipelineStateManager, global.memoryPools, global.renderInstancedQueue, global.pass, global.instancedBuffer, global.renderBatchedQueue, global.batchedBuffer);
    global.renderShadowMapBatchedQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _passPhase, _pipelineStateManager, _memoryPools, _renderInstancedQueue, _pass, _instancedBuffer, _renderBatchedQueue, _batchedBuffer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderShadowMapBatchedQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @zh
   * 阴影渲染队列
   */
  var RenderShadowMapBatchedQueue = /*#__PURE__*/function () {
    function RenderShadowMapBatchedQueue() {
      _classCallCheck(this, RenderShadowMapBatchedQueue);

      this._subModelsArray = [];
      this._passArray = [];
      this._shaderArray = [];
      this._shadowMapBuffer = null;
      this._phaseID = (0, _passPhase.getPhaseID)('shadow-add');
      this._instancedQueue = new _renderInstancedQueue.RenderInstancedQueue();
      this._batchedQueue = new _renderBatchedQueue.RenderBatchedQueue();
    }

    _createClass(RenderShadowMapBatchedQueue, [{
      key: "clear",

      /**
       * @zh
       * clear ligth-Batched-Queue
       */
      value: function clear(shadowMapBuffer) {
        this._subModelsArray.length = 0;
        this._shaderArray.length = 0;
        this._passArray.length = 0;

        this._instancedQueue.clear();

        this._batchedQueue.clear();

        this._shadowMapBuffer = shadowMapBuffer;
      }
    }, {
      key: "add",
      value: function add(renderObj, subModelIdx, passIdx) {
        var subModel = renderObj.model.subModels[subModelIdx];
        var pass = subModel.passes[passIdx];

        if (pass.phase === this._phaseID) {
          if (this._shadowMapBuffer) {
            if (pass.batchingScheme === _pass.BatchingSchemes.INSTANCING) {
              // instancing
              var buffer = _instancedBuffer.InstancedBuffer.get(pass);

              buffer.merge(subModel, renderObj.model.instancedAttributes, passIdx);

              this._instancedQueue.queue.add(buffer);
            } else if (pass.batchingScheme === _pass.BatchingSchemes.VB_MERGING) {
              // vb-merging
              var _buffer = _batchedBuffer.BatchedBuffer.get(pass);

              _buffer.merge(subModel, passIdx, renderObj);

              this._batchedQueue.queue.add(_buffer);
            } else {
              // standard draw
              var shader = _memoryPools.ShaderPool.get(_memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.SHADER_0 + passIdx));

              this._subModelsArray.push(subModel);

              this._shaderArray.push(shader);

              this._passArray.push(pass.handle);
            }
          } else {
            this._subModelsArray.length = 0;
            this._shaderArray.length = 0;
            this._passArray.length = 0;

            this._instancedQueue.clear();

            this._batchedQueue.clear();
          }
        }
      }
      /**
       * @zh
       * record CommandBuffer
       */

    }, {
      key: "recordCommandBuffer",
      value: function recordCommandBuffer(device, renderPass, cmdBuff) {
        this._instancedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        this._batchedQueue.recordCommandBuffer(device, renderPass, cmdBuff);

        for (var i = 0; i < this._subModelsArray.length; ++i) {
          var subModel = this._subModelsArray[i];
          var shader = this._shaderArray[i];
          var hPass = this._passArray[i];
          var ia = subModel.inputAssembler;

          var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, ia);

          var descriptorSet = _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DESCRIPTOR_SET));

          cmdBuff.bindPipelineState(pso);
          cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, descriptorSet);
          cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, subModel.descriptorSet);
          cmdBuff.bindInputAssembler(ia);
          cmdBuff.draw(ia);
        }
      }
    }]);

    return RenderShadowMapBatchedQueue;
  }();

  _exports.RenderShadowMapBatchedQueue = RenderShadowMapBatchedQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLXNoYWRvd01hcC1iYXRjaGVkLXF1ZXVlLnRzIl0sIm5hbWVzIjpbIlJlbmRlclNoYWRvd01hcEJhdGNoZWRRdWV1ZSIsIl9zdWJNb2RlbHNBcnJheSIsIl9wYXNzQXJyYXkiLCJfc2hhZGVyQXJyYXkiLCJfc2hhZG93TWFwQnVmZmVyIiwiX3BoYXNlSUQiLCJfaW5zdGFuY2VkUXVldWUiLCJSZW5kZXJJbnN0YW5jZWRRdWV1ZSIsIl9iYXRjaGVkUXVldWUiLCJSZW5kZXJCYXRjaGVkUXVldWUiLCJzaGFkb3dNYXBCdWZmZXIiLCJsZW5ndGgiLCJjbGVhciIsInJlbmRlck9iaiIsInN1Yk1vZGVsSWR4IiwicGFzc0lkeCIsInN1Yk1vZGVsIiwibW9kZWwiLCJzdWJNb2RlbHMiLCJwYXNzIiwicGFzc2VzIiwicGhhc2UiLCJiYXRjaGluZ1NjaGVtZSIsIkJhdGNoaW5nU2NoZW1lcyIsIklOU1RBTkNJTkciLCJidWZmZXIiLCJJbnN0YW5jZWRCdWZmZXIiLCJnZXQiLCJtZXJnZSIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJxdWV1ZSIsImFkZCIsIlZCX01FUkdJTkciLCJCYXRjaGVkQnVmZmVyIiwic2hhZGVyIiwiU2hhZGVyUG9vbCIsIlN1Yk1vZGVsUG9vbCIsImhhbmRsZSIsIlN1Yk1vZGVsVmlldyIsIlNIQURFUl8wIiwicHVzaCIsImRldmljZSIsInJlbmRlclBhc3MiLCJjbWRCdWZmIiwicmVjb3JkQ29tbWFuZEJ1ZmZlciIsImkiLCJoUGFzcyIsImlhIiwiaW5wdXRBc3NlbWJsZXIiLCJwc28iLCJQaXBlbGluZVN0YXRlTWFuYWdlciIsImdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZSIsImRlc2NyaXB0b3JTZXQiLCJEU1Bvb2wiLCJQYXNzUG9vbCIsIlBhc3NWaWV3IiwiREVTQ1JJUFRPUl9TRVQiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJNQVRFUklBTCIsIkxPQ0FMIiwiYmluZElucHV0QXNzZW1ibGVyIiwiZHJhdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkE7Ozs7TUFJYUEsMkI7Ozs7V0FDREMsZSxHQUE4QixFO1dBQzlCQyxVLEdBQTJCLEU7V0FDM0JDLFksR0FBNEIsRTtXQUM1QkMsZ0IsR0FBcUMsSTtXQUNyQ0MsUSxHQUFXLDJCQUFXLFlBQVgsQztXQUNYQyxlLEdBQXdDLElBQUlDLDBDQUFKLEU7V0FDeENDLGEsR0FBb0MsSUFBSUMsc0NBQUosRTs7Ozs7O0FBRTVDOzs7OzRCQUljQyxlLEVBQTRCO0FBQ3RDLGFBQUtULGVBQUwsQ0FBcUJVLE1BQXJCLEdBQThCLENBQTlCO0FBQ0EsYUFBS1IsWUFBTCxDQUFrQlEsTUFBbEIsR0FBMkIsQ0FBM0I7QUFDQSxhQUFLVCxVQUFMLENBQWdCUyxNQUFoQixHQUF5QixDQUF6Qjs7QUFDQSxhQUFLTCxlQUFMLENBQXFCTSxLQUFyQjs7QUFDQSxhQUFLSixhQUFMLENBQW1CSSxLQUFuQjs7QUFDQSxhQUFLUixnQkFBTCxHQUF3Qk0sZUFBeEI7QUFDSDs7OzBCQUVXRyxTLEVBQTBCQyxXLEVBQXFCQyxPLEVBQWlCO0FBQ3hFLFlBQU1DLFFBQVEsR0FBR0gsU0FBUyxDQUFDSSxLQUFWLENBQWdCQyxTQUFoQixDQUEwQkosV0FBMUIsQ0FBakI7QUFDQSxZQUFNSyxJQUFJLEdBQUdILFFBQVEsQ0FBQ0ksTUFBVCxDQUFnQkwsT0FBaEIsQ0FBYjs7QUFFQSxZQUFJSSxJQUFJLENBQUNFLEtBQUwsS0FBZSxLQUFLaEIsUUFBeEIsRUFBa0M7QUFDOUIsY0FBSSxLQUFLRCxnQkFBVCxFQUEyQjtBQUN2QixnQkFBSWUsSUFBSSxDQUFDRyxjQUFMLEtBQXdCQyxzQkFBZ0JDLFVBQTVDLEVBQXdEO0FBQVE7QUFDNUQsa0JBQU1DLE1BQU0sR0FBR0MsaUNBQWdCQyxHQUFoQixDQUFvQlIsSUFBcEIsQ0FBZjs7QUFDQU0sY0FBQUEs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QUFSLENBQTJCZixFQUEzQjtBQUNBSixVQUFBQSxPQUFPLENBQUNvQixJQUFSLENBQWFoQixFQUFiO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi4vZ2Z4L2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgU3ViTW9kZWwgfSBmcm9tICcuLi9yZW5kZXJlci9zY2VuZS9zdWJtb2RlbCc7XHJcbmltcG9ydCB7IElSZW5kZXJPYmplY3QsIFNldEluZGV4IH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UsIEdGWFJlbmRlclBhc3MsIEdGWEJ1ZmZlciwgR0ZYU2hhZGVyIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgZ2V0UGhhc2VJRCB9IGZyb20gJy4vcGFzcy1waGFzZSc7XHJcbmltcG9ydCB7IFBpcGVsaW5lU3RhdGVNYW5hZ2VyIH0gZnJvbSAnLi9waXBlbGluZS1zdGF0ZS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgRFNQb29sLCBTaGFkZXJQb29sLCBQYXNzSGFuZGxlLCBQYXNzUG9vbCwgUGFzc1ZpZXcsIFN1Yk1vZGVsUG9vbCwgU3ViTW9kZWxWaWV3LCBTaGFkZXJIYW5kbGUgfSBmcm9tICcuLi9yZW5kZXJlci9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IFJlbmRlckluc3RhbmNlZFF1ZXVlIH0gZnJvbSAnLi9yZW5kZXItaW5zdGFuY2VkLXF1ZXVlJztcclxuaW1wb3J0IHsgQmF0Y2hpbmdTY2hlbWVzIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9wYXNzJztcclxuaW1wb3J0IHsgSW5zdGFuY2VkQnVmZmVyIH0gZnJvbSAnLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgUmVuZGVyQmF0Y2hlZFF1ZXVlIH0gZnJvbSAnLi9yZW5kZXItYmF0Y2hlZC1xdWV1ZSc7XHJcbmltcG9ydCB7IEJhdGNoZWRCdWZmZXIgfSBmcm9tICcuL2JhdGNoZWQtYnVmZmVyJztcclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog6Zi05b2x5riy5p+T6Zif5YiXXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVuZGVyU2hhZG93TWFwQmF0Y2hlZFF1ZXVlIHtcclxuICAgIHByaXZhdGUgX3N1Yk1vZGVsc0FycmF5OiBTdWJNb2RlbFtdID0gW107XHJcbiAgICBwcml2YXRlIF9wYXNzQXJyYXk6IFBhc3NIYW5kbGVbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc2hhZGVyQXJyYXk6IEdGWFNoYWRlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9zaGFkb3dNYXBCdWZmZXI6IEdGWEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGhhc2VJRCA9IGdldFBoYXNlSUQoJ3NoYWRvdy1hZGQnKTtcclxuICAgIHByaXZhdGUgX2luc3RhbmNlZFF1ZXVlOiBSZW5kZXJJbnN0YW5jZWRRdWV1ZSA9IG5ldyBSZW5kZXJJbnN0YW5jZWRRdWV1ZSgpO1xyXG4gICAgcHJpdmF0ZSBfYmF0Y2hlZFF1ZXVlOiBSZW5kZXJCYXRjaGVkUXVldWUgPSBuZXcgUmVuZGVyQmF0Y2hlZFF1ZXVlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIGNsZWFyIGxpZ3RoLUJhdGNoZWQtUXVldWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyIChzaGFkb3dNYXBCdWZmZXI6IEdGWEJ1ZmZlcikge1xyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVsc0FycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fc2hhZGVyQXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9wYXNzQXJyYXkubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX3NoYWRvd01hcEJ1ZmZlciA9IHNoYWRvd01hcEJ1ZmZlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkIChyZW5kZXJPYmo6IElSZW5kZXJPYmplY3QsIHN1Yk1vZGVsSWR4OiBudW1iZXIsIHBhc3NJZHg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHN1Yk1vZGVsID0gcmVuZGVyT2JqLm1vZGVsLnN1Yk1vZGVsc1tzdWJNb2RlbElkeF07XHJcbiAgICAgICAgY29uc3QgcGFzcyA9IHN1Yk1vZGVsLnBhc3Nlc1twYXNzSWR4XTtcclxuXHJcbiAgICAgICAgaWYgKHBhc3MucGhhc2UgPT09IHRoaXMuX3BoYXNlSUQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NoYWRvd01hcEJ1ZmZlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhc3MuYmF0Y2hpbmdTY2hlbWUgPT09IEJhdGNoaW5nU2NoZW1lcy5JTlNUQU5DSU5HKSB7ICAgICAgIC8vIGluc3RhbmNpbmdcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBJbnN0YW5jZWRCdWZmZXIuZ2V0KHBhc3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlci5tZXJnZShzdWJNb2RlbCwgIHJlbmRlck9iai5tb2RlbC5pbnN0YW5jZWRBdHRyaWJ1dGVzLCBwYXNzSWR4KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5xdWV1ZS5hZGQoYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZihwYXNzLmJhdGNoaW5nU2NoZW1lID09PSBCYXRjaGluZ1NjaGVtZXMuVkJfTUVSR0lORykgeyAvLyB2Yi1tZXJnaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyID0gQmF0Y2hlZEJ1ZmZlci5nZXQocGFzcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyLm1lcmdlKHN1Yk1vZGVsLCBwYXNzSWR4LCByZW5kZXJPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2JhdGNoZWRRdWV1ZS5xdWV1ZS5hZGQoYnVmZmVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdGFuZGFyZCBkcmF3XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhZGVyID0gU2hhZGVyUG9vbC5nZXQoU3ViTW9kZWxQb29sLmdldChzdWJNb2RlbC5oYW5kbGUsIFN1Yk1vZGVsVmlldy5TSEFERVJfMCArIHBhc3NJZHgpIGFzIFNoYWRlckhhbmRsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3ViTW9kZWxzQXJyYXkucHVzaChzdWJNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2hhZGVyQXJyYXkucHVzaChzaGFkZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3Bhc3NBcnJheS5wdXNoKHBhc3MuaGFuZGxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3N1Yk1vZGVsc0FycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFkZXJBcnJheS5sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcGFzc0FycmF5Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9pbnN0YW5jZWRRdWV1ZS5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmF0Y2hlZFF1ZXVlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIHJlY29yZCBDb21tYW5kQnVmZmVyXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWNvcmRDb21tYW5kQnVmZmVyIChkZXZpY2U6IEdGWERldmljZSwgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcywgY21kQnVmZjogR0ZYQ29tbWFuZEJ1ZmZlcikge1xyXG4gICAgICAgIHRoaXMuX2luc3RhbmNlZFF1ZXVlLnJlY29yZENvbW1hbmRCdWZmZXIoZGV2aWNlLCByZW5kZXJQYXNzLCBjbWRCdWZmKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVkUXVldWUucmVjb3JkQ29tbWFuZEJ1ZmZlcihkZXZpY2UsIHJlbmRlclBhc3MsIGNtZEJ1ZmYpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3N1Yk1vZGVsc0FycmF5Lmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVsID0gdGhpcy5fc3ViTW9kZWxzQXJyYXlbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYWRlciA9IHRoaXMuX3NoYWRlckFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb25zdCBoUGFzcyA9IHRoaXMuX3Bhc3NBcnJheVtpXTtcclxuICAgICAgICAgICAgY29uc3QgaWEgPSBzdWJNb2RlbC5pbnB1dEFzc2VtYmxlciE7XHJcbiAgICAgICAgICAgIGNvbnN0IHBzbyA9IFBpcGVsaW5lU3RhdGVNYW5hZ2VyLmdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZShkZXZpY2UsIGhQYXNzLCBzaGFkZXIsIHJlbmRlclBhc3MsIGlhKTtcclxuICAgICAgICAgICAgY29uc3QgZGVzY3JpcHRvclNldCA9IERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpO1xyXG5cclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kUGlwZWxpbmVTdGF0ZShwc28pO1xyXG4gICAgICAgICAgICBjbWRCdWZmLmJpbmREZXNjcmlwdG9yU2V0KFNldEluZGV4Lk1BVEVSSUFMLCBkZXNjcmlwdG9yU2V0KTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5MT0NBTCwgc3ViTW9kZWwuZGVzY3JpcHRvclNldCk7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuYmluZElucHV0QXNzZW1ibGVyKGlhKTtcclxuICAgICAgICAgICAgY21kQnVmZi5kcmF3KGlhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19