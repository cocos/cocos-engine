(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./pipeline-state-manager.js", "../renderer/core/memory-pools.js", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./pipeline-state-manager.js"), require("../renderer/core/memory-pools.js"), require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pipelineStateManager, global.memoryPools, global.define);
    global.renderInstancedQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipelineStateManager, _memoryPools, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderInstancedQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en Render queue for instanced batching
   * @zh 渲染合批队列。
   */
  var RenderInstancedQueue = /*#__PURE__*/function () {
    function RenderInstancedQueue() {
      _classCallCheck(this, RenderInstancedQueue);

      this.queue = new Set();
    }

    _createClass(RenderInstancedQueue, [{
      key: "clear",

      /**
       * @en Clear the render queue
       * @zh 清空渲染队列。
       */
      value: function clear() {
        var it = this.queue.values();
        var res = it.next();

        while (!res.done) {
          res.value.clear();
          res = it.next();
        }

        this.queue.clear();
      }
      /**
       * @en Record command buffer for the current queue
       * @zh 记录命令缓冲。
       * @param cmdBuff The command buffer to store the result
       */

    }, {
      key: "recordCommandBuffer",
      value: function recordCommandBuffer(device, renderPass, cmdBuff) {
        // upload buffers
        var it = this.queue.values();
        var res = it.next();

        while (!res.done) {
          if (res.value.hasPendingModels) res.value.uploadBuffers();
          res = it.next();
        } // draw


        it = this.queue.values();
        res = it.next();

        while (!res.done) {
          var _res$value = res.value,
              instances = _res$value.instances,
              hPass = _res$value.hPass,
              hasPendingModels = _res$value.hasPendingModels;

          if (hasPendingModels) {
            cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DESCRIPTOR_SET)));
            var lastPSO = null;

            for (var b = 0; b < instances.length; ++b) {
              var instance = instances[b];

              if (!instance.count) {
                continue;
              }

              var shader = _memoryPools.ShaderPool.get(instance.hShader);

              var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, instance.ia);

              if (lastPSO !== pso) {
                cmdBuff.bindPipelineState(pso);
                lastPSO = pso;
              }

              cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, _memoryPools.DSPool.get(instance.hDescriptorSet), res.value.dynamicOffsets);
              cmdBuff.bindInputAssembler(instance.ia);
              cmdBuff.draw(instance.ia);
            }
          }

          res = it.next();
        }
      }
    }]);

    return RenderInstancedQueue;
  }();

  _exports.RenderInstancedQueue = RenderInstancedQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLWluc3RhbmNlZC1xdWV1ZS50cyJdLCJuYW1lcyI6WyJSZW5kZXJJbnN0YW5jZWRRdWV1ZSIsInF1ZXVlIiwiU2V0IiwiaXQiLCJ2YWx1ZXMiLCJyZXMiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwiY2xlYXIiLCJkZXZpY2UiLCJyZW5kZXJQYXNzIiwiY21kQnVmZiIsImhhc1BlbmRpbmdNb2RlbHMiLCJ1cGxvYWRCdWZmZXJzIiwiaW5zdGFuY2VzIiwiaFBhc3MiLCJiaW5kRGVzY3JpcHRvclNldCIsIlNldEluZGV4IiwiTUFURVJJQUwiLCJEU1Bvb2wiLCJnZXQiLCJQYXNzUG9vbCIsIlBhc3NWaWV3IiwiREVTQ1JJUFRPUl9TRVQiLCJsYXN0UFNPIiwiYiIsImxlbmd0aCIsImluc3RhbmNlIiwiY291bnQiLCJzaGFkZXIiLCJTaGFkZXJQb29sIiwiaFNoYWRlciIsInBzbyIsIlBpcGVsaW5lU3RhdGVNYW5hZ2VyIiwiZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlIiwiaWEiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsIkxPQ0FMIiwiaERlc2NyaXB0b3JTZXQiLCJkeW5hbWljT2Zmc2V0cyIsImJpbmRJbnB1dEFzc2VtYmxlciIsImRyYXciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV0E7Ozs7TUFJYUEsb0I7Ozs7V0FNRkMsSyxHQUFRLElBQUlDLEdBQUosRTs7Ozs7O0FBRWY7Ozs7OEJBSWdCO0FBQ1osWUFBTUMsRUFBRSxHQUFHLEtBQUtGLEtBQUwsQ0FBV0csTUFBWCxFQUFYO0FBQWdDLFlBQUlDLEdBQUcsR0FBR0YsRUFBRSxDQUFDRyxJQUFILEVBQVY7O0FBQ2hDLGVBQU8sQ0FBQ0QsR0FBRyxDQUFDRSxJQUFaLEVBQWtCO0FBQ2RGLFVBQUFBLEdBQUcsQ0FBQ0csS0FBSixDQUFVQyxLQUFWO0FBQ0FKLFVBQUFBLEdBQUcsR0FBR0YsRUFBRSxDQUFDRyxJQUFILEVBQU47QUFDSDs7QUFDRCxhQUFLTCxLQUFMLENBQVdRLEtBQVg7QUFDSDtBQUVEOzs7Ozs7OzswQ0FLNEJDLE0sRUFBbUJDLFUsRUFBMkJDLE8sRUFBMkI7QUFDakc7QUFDQSxZQUFJVCxFQUFFLEdBQUcsS0FBS0YsS0FBTCxDQUFXRyxNQUFYLEVBQVQ7QUFBOEIsWUFBSUMsR0FBRyxHQUFHRixFQUFFLENBQUNHLElBQUgsRUFBVjs7QUFDOUIsZUFBTyxDQUFDRCxHQUFHLENBQUNFLElBQVosRUFBa0I7QUFDZCxjQUFJRixHQUFHLENBQUNHLEtBQUosQ0FBVUssZ0JBQWQsRUFBZ0NSLEdBQUcsQ0FBQ0csS0FBSixDQUFVTSxhQUFWO0FBQ2hDVCxVQUFBQSxHQUFHLEdBQUdGLEVBQUUsQ0FBQ0csSUFBSCxFQUFOO0FBQ0gsU0FOZ0csQ0FPakc7OztBQUNBSCxRQUFBQSxFQUFFLEdBQUcsS0FBS0YsS0FBTCxDQUFXRyxNQUFYLEVBQUw7QUFBMEJDLFFBQUFBLEdBQUcsR0FBR0YsRUFBRSxDQUFDRyxJQUFILEVBQU47O0FBQzFCLGVBQU8sQ0FBQ0QsR0FBRyxDQUFDRSxJQUFaLEVBQWtCO0FBQUEsMkJBQ2lDRixHQUFHLENBQUNHLEtBRHJDO0FBQUEsY0FDTk8sU0FETSxjQUNOQSxTQURNO0FBQUEsY0FDS0MsS0FETCxjQUNLQSxLQURMO0FBQUEsY0FDWUgsZ0JBRFosY0FDWUEsZ0JBRFo7O0FBRWQsY0FBSUEsZ0JBQUosRUFBc0I7QUFDbEJELFlBQUFBLE9BQU8sQ0FBQ0ssaUJBQVIsQ0FBMEJDLGlCQUFTQyxRQUFuQyxFQUE2Q0Msb0JBQU9DLEdBQVAsQ0FBV0Msc0JBQVNELEdBQVQsQ0FBYUwsS0FBYixFQUFvQk8sc0JBQVNDLGNBQTdCLENBQVgsQ0FBN0M7QUFDQSxnQkFBSUMsT0FBZ0MsR0FBRyxJQUF2Qzs7QUFDQSxpQkFBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHWCxTQUFTLENBQUNZLE1BQTlCLEVBQXNDLEVBQUVELENBQXhDLEVBQTJDO0FBQ3ZDLGtCQUFNRSxRQUFRLEdBQUdiLFNBQVMsQ0FBQ1csQ0FBRCxDQUExQjs7QUFDQSxrQkFBSSxDQUFDRSxRQUFRLENBQUNDLEtBQWQsRUFBcUI7QUFBRTtBQUFXOztBQUNsQyxrQkFBTUMsTUFBTSxHQUFHQyx3QkFBV1YsR0FBWCxDQUFlTyxRQUFRLENBQUNJLE9BQXhCLENBQWY7O0FBQ0Esa0JBQU1DLEdBQUcsR0FBR0MsMkNBQXFCQyx3QkFBckIsQ0FBOEN6QixNQUE5QyxFQUFzRE0sS0FBdEQsRUFBNkRjLE1BQTdELEVBQXFFbkIsVUFBckUsRUFBaUZpQixRQUFRLENBQUNRLEVBQTFGLENBQVo7O0FBQ0Esa0JBQUlYLE9BQU8sS0FBS1EsR0FBaEIsRUFBcUI7QUFDakJyQixnQkFBQUEsT0FBTyxDQUFDeUIsaUJBQVIsQ0FBMEJKLEdBQTFCO0FBQ0FSLGdCQUFBQSxPQUFPLEdBQUdRLEdBQVY7QUFDSDs7QUFDRHJCLGNBQUFBLE9BQU8sQ0FBQ0ssaUJBQVIsQ0FBMEJDLGlCQUFTb0IsS0FBbkMsRUFBMENsQixvQkFBT0MsR0FBUCxDQUFXTyxRQUFRLENBQUNXLGNBQXBCLENBQTFDLEVBQStFbEMsR0FBRyxDQUFDRyxLQUFKLENBQVVnQyxjQUF6RjtBQUNBNUIsY0FBQUEsT0FBTyxDQUFDNkIsa0JBQVIsQ0FBMkJiLFFBQVEsQ0FBQ1EsRUFBcEM7QUFDQXhCLGNBQUFBLE9BQU8sQ0FBQzhCLElBQVIsQ0FBYWQsUUFBUSxDQUFDUSxFQUF0QjtBQUNIO0FBQ0o7O0FBQ0QvQixVQUFBQSxHQUFHLEdBQUdGLEVBQUUsQ0FBQ0csSUFBSCxFQUFOO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi4vZ2Z4L2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgSW5zdGFuY2VkQnVmZmVyIH0gZnJvbSAnLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlLCBHRlhSZW5kZXJQYXNzLCBHRlhQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgUGlwZWxpbmVTdGF0ZU1hbmFnZXIgfSBmcm9tICcuL3BpcGVsaW5lLXN0YXRlLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBEU1Bvb2wsIFNoYWRlclBvb2wsIFBhc3NQb29sLCBQYXNzVmlldyB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuaW1wb3J0IHsgU2V0SW5kZXggfSBmcm9tICcuL2RlZmluZSc7XHJcblxyXG4vKipcclxuICogQGVuIFJlbmRlciBxdWV1ZSBmb3IgaW5zdGFuY2VkIGJhdGNoaW5nXHJcbiAqIEB6aCDmuLLmn5PlkIjmibnpmJ/liJfjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJJbnN0YW5jZWRRdWV1ZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQSBzZXQgb2YgaW5zdGFuY2VkIGJ1ZmZlclxyXG4gICAgICogQHpoIEluc3RhbmNlIOWQiOaJuee8k+WtmOmbhuWQiOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcXVldWUgPSBuZXcgU2V0PEluc3RhbmNlZEJ1ZmZlcj4oKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDbGVhciB0aGUgcmVuZGVyIHF1ZXVlXHJcbiAgICAgKiBAemgg5riF56m65riy5p+T6Zif5YiX44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgY29uc3QgaXQgPSB0aGlzLnF1ZXVlLnZhbHVlcygpOyBsZXQgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIHdoaWxlICghcmVzLmRvbmUpIHtcclxuICAgICAgICAgICAgcmVzLnZhbHVlLmNsZWFyKCk7XHJcbiAgICAgICAgICAgIHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5xdWV1ZS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlY29yZCBjb21tYW5kIGJ1ZmZlciBmb3IgdGhlIGN1cnJlbnQgcXVldWVcclxuICAgICAqIEB6aCDorrDlvZXlkb3ku6TnvJPlhrLjgIJcclxuICAgICAqIEBwYXJhbSBjbWRCdWZmIFRoZSBjb21tYW5kIGJ1ZmZlciB0byBzdG9yZSB0aGUgcmVzdWx0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZWNvcmRDb21tYW5kQnVmZmVyIChkZXZpY2U6IEdGWERldmljZSwgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcywgY21kQnVmZjogR0ZYQ29tbWFuZEJ1ZmZlcikge1xyXG4gICAgICAgIC8vIHVwbG9hZCBidWZmZXJzXHJcbiAgICAgICAgbGV0IGl0ID0gdGhpcy5xdWV1ZS52YWx1ZXMoKTsgbGV0IHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB3aGlsZSAoIXJlcy5kb25lKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXMudmFsdWUuaGFzUGVuZGluZ01vZGVscykgcmVzLnZhbHVlLnVwbG9hZEJ1ZmZlcnMoKTtcclxuICAgICAgICAgICAgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBkcmF3XHJcbiAgICAgICAgaXQgPSB0aGlzLnF1ZXVlLnZhbHVlcygpOyByZXMgPSBpdC5uZXh0KCk7XHJcbiAgICAgICAgd2hpbGUgKCFyZXMuZG9uZSkge1xyXG4gICAgICAgICAgICBjb25zdCB7IGluc3RhbmNlcywgaFBhc3MsIGhhc1BlbmRpbmdNb2RlbHMgfSA9IHJlcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKGhhc1BlbmRpbmdNb2RlbHMpIHtcclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTUFURVJJQUwsIERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpKTtcclxuICAgICAgICAgICAgICAgIGxldCBsYXN0UFNPOiBHRlhQaXBlbGluZVN0YXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IGluc3RhbmNlcy5sZW5ndGg7ICsrYikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc3RhbmNlID0gaW5zdGFuY2VzW2JdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghaW5zdGFuY2UuY291bnQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFkZXIgPSBTaGFkZXJQb29sLmdldChpbnN0YW5jZS5oU2hhZGVyKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwc28gPSBQaXBlbGluZVN0YXRlTWFuYWdlci5nZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUoZGV2aWNlLCBoUGFzcywgc2hhZGVyLCByZW5kZXJQYXNzLCBpbnN0YW5jZS5pYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RQU08gIT09IHBzbykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmRQaXBlbGluZVN0YXRlKHBzbyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhc3RQU08gPSBwc287XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTE9DQUwsIERTUG9vbC5nZXQoaW5zdGFuY2UuaERlc2NyaXB0b3JTZXQpLCByZXMudmFsdWUuZHluYW1pY09mZnNldHMpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZElucHV0QXNzZW1ibGVyKGluc3RhbmNlLmlhKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmRyYXcoaW5zdGFuY2UuaWEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19