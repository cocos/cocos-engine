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
    global.renderBatchedQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pipelineStateManager, _memoryPools, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderBatchedQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en The render queue for dynamic batching
   * @zh 渲染合批队列。
   */
  var RenderBatchedQueue = /*#__PURE__*/function () {
    function RenderBatchedQueue() {
      _classCallCheck(this, RenderBatchedQueue);

      this.queue = new Set();
    }

    _createClass(RenderBatchedQueue, [{
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
          for (var b = 0; b < res.value.batches.length; ++b) {
            var batch = res.value.batches[b];

            if (!batch.mergeCount) {
              continue;
            }

            for (var v = 0; v < batch.vbs.length; ++v) {
              batch.vbs[v].update(batch.vbDatas[v]);
            }

            batch.vbIdx.update(batch.vbIdxData.buffer);
            batch.ubo.update(batch.uboData);
          }

          res = it.next();
        } // draw


        it = this.queue.values();
        res = it.next();

        while (!res.done) {
          var boundPSO = false;

          for (var _b = 0; _b < res.value.batches.length; ++_b) {
            var _batch = res.value.batches[_b];

            if (!_batch.mergeCount) {
              continue;
            }

            if (!boundPSO) {
              var shader = _memoryPools.ShaderPool.get(_batch.hShader);

              var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, _batch.hPass, shader, renderPass, _batch.ia);

              cmdBuff.bindPipelineState(pso);
              cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, _memoryPools.DSPool.get(_memoryPools.PassPool.get(_batch.hPass, _memoryPools.PassView.DESCRIPTOR_SET)));
              boundPSO = true;
            }

            cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, _batch.descriptorSet, res.value.dynamicOffsets);
            cmdBuff.bindInputAssembler(_batch.ia);
            cmdBuff.draw(_batch.ia);
          }

          res = it.next();
        }
      }
    }]);

    return RenderBatchedQueue;
  }();

  _exports.RenderBatchedQueue = RenderBatchedQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLWJhdGNoZWQtcXVldWUudHMiXSwibmFtZXMiOlsiUmVuZGVyQmF0Y2hlZFF1ZXVlIiwicXVldWUiLCJTZXQiLCJpdCIsInZhbHVlcyIsInJlcyIsIm5leHQiLCJkb25lIiwidmFsdWUiLCJjbGVhciIsImRldmljZSIsInJlbmRlclBhc3MiLCJjbWRCdWZmIiwiYiIsImJhdGNoZXMiLCJsZW5ndGgiLCJiYXRjaCIsIm1lcmdlQ291bnQiLCJ2IiwidmJzIiwidXBkYXRlIiwidmJEYXRhcyIsInZiSWR4IiwidmJJZHhEYXRhIiwiYnVmZmVyIiwidWJvIiwidWJvRGF0YSIsImJvdW5kUFNPIiwic2hhZGVyIiwiU2hhZGVyUG9vbCIsImdldCIsImhTaGFkZXIiLCJwc28iLCJQaXBlbGluZVN0YXRlTWFuYWdlciIsImdldE9yQ3JlYXRlUGlwZWxpbmVTdGF0ZSIsImhQYXNzIiwiaWEiLCJiaW5kUGlwZWxpbmVTdGF0ZSIsImJpbmREZXNjcmlwdG9yU2V0IiwiU2V0SW5kZXgiLCJNQVRFUklBTCIsIkRTUG9vbCIsIlBhc3NQb29sIiwiUGFzc1ZpZXciLCJERVNDUklQVE9SX1NFVCIsIkxPQ0FMIiwiZGVzY3JpcHRvclNldCIsImR5bmFtaWNPZmZzZXRzIiwiYmluZElucHV0QXNzZW1ibGVyIiwiZHJhdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQTs7OztNQUlhQSxrQjs7OztXQU1GQyxLLEdBQVEsSUFBSUMsR0FBSixFOzs7Ozs7QUFFZjs7Ozs4QkFJZ0I7QUFDWixZQUFNQyxFQUFFLEdBQUcsS0FBS0YsS0FBTCxDQUFXRyxNQUFYLEVBQVg7QUFBZ0MsWUFBSUMsR0FBRyxHQUFHRixFQUFFLENBQUNHLElBQUgsRUFBVjs7QUFDaEMsZUFBTyxDQUFDRCxHQUFHLENBQUNFLElBQVosRUFBa0I7QUFDZEYsVUFBQUEsR0FBRyxDQUFDRyxL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QyxpQkFBU00sS0FBbkMsRUFBMEM3QixNQUFLLENBQUM4QixhQUFoRCxFQUErRHpDLEdBQUcsQ0FBQ0csS0FBSixDQUFVdUMsY0FBekU7QUFDQW5DLFlBQUFBLE9BQU8sQ0FBQ29DLGtCQUFSLENBQTJCaEMsTUFBSyxDQUFDb0IsRUFBakM7QUFDQXhCLFlBQUFBLE9BQU8sQ0FBQ3FDLElBQVIsQ0FBYWpDLE1BQUssQ0FBQ29CLEVBQW5CO0FBQ0g7O0FBQ0QvQixVQUFBQSxHQUFHLEdBQUdGLEVBQUUsQ0FBQ0csSUFBSCxFQUFOO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi4vZ2Z4L2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgQmF0Y2hlZEJ1ZmZlciB9IGZyb20gJy4vYmF0Y2hlZC1idWZmZXInO1xyXG5pbXBvcnQgeyBQaXBlbGluZVN0YXRlTWFuYWdlciB9IGZyb20gJy4vcGlwZWxpbmUtc3RhdGUtbWFuYWdlcic7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgRFNQb29sLCBTaGFkZXJQb29sLCBQYXNzUG9vbCwgUGFzc1ZpZXcgfSBmcm9tICcuLi9yZW5kZXJlci9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IFNldEluZGV4IH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgcmVuZGVyIHF1ZXVlIGZvciBkeW5hbWljIGJhdGNoaW5nXHJcbiAqIEB6aCDmuLLmn5PlkIjmibnpmJ/liJfjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSZW5kZXJCYXRjaGVkUXVldWUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEEgc2V0IG9mIGR5bmFtaWMgYmF0Y2hlZCBidWZmZXJcclxuICAgICAqIEB6aCDliqjmgIHlkIjmibnnvJPlrZjpm4blkIjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHF1ZXVlID0gbmV3IFNldDxCYXRjaGVkQnVmZmVyPigpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyIHRoZSByZW5kZXIgcXVldWVcclxuICAgICAqIEB6aCDmuIXnqbrmuLLmn5PpmJ/liJfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICBjb25zdCBpdCA9IHRoaXMucXVldWUudmFsdWVzKCk7IGxldCByZXMgPSBpdC5uZXh0KCk7XHJcbiAgICAgICAgd2hpbGUgKCFyZXMuZG9uZSkge1xyXG4gICAgICAgICAgICByZXMudmFsdWUuY2xlYXIoKTtcclxuICAgICAgICAgICAgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnF1ZXVlLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVjb3JkIGNvbW1hbmQgYnVmZmVyIGZvciB0aGUgY3VycmVudCBxdWV1ZVxyXG4gICAgICogQHpoIOiusOW9leWRveS7pOe8k+WGsuOAglxyXG4gICAgICogQHBhcmFtIGNtZEJ1ZmYgVGhlIGNvbW1hbmQgYnVmZmVyIHRvIHN0b3JlIHRoZSByZXN1bHRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlY29yZENvbW1hbmRCdWZmZXIgKGRldmljZTogR0ZYRGV2aWNlLCByZW5kZXJQYXNzOiBHRlhSZW5kZXJQYXNzLCBjbWRCdWZmOiBHRlhDb21tYW5kQnVmZmVyKSB7XHJcbiAgICAgICAgLy8gdXBsb2FkIGJ1ZmZlcnNcclxuICAgICAgICBsZXQgaXQgPSB0aGlzLnF1ZXVlLnZhbHVlcygpOyBsZXQgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIHdoaWxlICghcmVzLmRvbmUpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgYiA9IDA7IGIgPCByZXMudmFsdWUuYmF0Y2hlcy5sZW5ndGg7ICsrYikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmF0Y2ggPSByZXMudmFsdWUuYmF0Y2hlc1tiXTtcclxuICAgICAgICAgICAgICAgIGlmICghYmF0Y2gubWVyZ2VDb3VudCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgdiA9IDA7IHYgPCBiYXRjaC52YnMubGVuZ3RoOyArK3YpIHtcclxuICAgICAgICAgICAgICAgICAgICBiYXRjaC52YnNbdl0udXBkYXRlKGJhdGNoLnZiRGF0YXNbdl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYmF0Y2gudmJJZHgudXBkYXRlKGJhdGNoLnZiSWR4RGF0YS5idWZmZXIpO1xyXG4gICAgICAgICAgICAgICAgYmF0Y2gudWJvLnVwZGF0ZShiYXRjaC51Ym9EYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXMgPSBpdC5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGRyYXdcclxuICAgICAgICBpdCA9IHRoaXMucXVldWUudmFsdWVzKCk7IHJlcyA9IGl0Lm5leHQoKTtcclxuICAgICAgICB3aGlsZSAoIXJlcy5kb25lKSB7XHJcbiAgICAgICAgICAgIGxldCBib3VuZFBTTyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IHJlcy52YWx1ZS5iYXRjaGVzLmxlbmd0aDsgKytiKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYXRjaCA9IHJlcy52YWx1ZS5iYXRjaGVzW2JdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFiYXRjaC5tZXJnZUNvdW50KSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoIWJvdW5kUFNPKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhZGVyID0gU2hhZGVyUG9vbC5nZXQoYmF0Y2guaFNoYWRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgYmF0Y2guaFBhc3MsIHNoYWRlciwgcmVuZGVyUGFzcywgYmF0Y2guaWEpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZFBpcGVsaW5lU3RhdGUocHNvKTtcclxuICAgICAgICAgICAgICAgICAgICBjbWRCdWZmLmJpbmREZXNjcmlwdG9yU2V0KFNldEluZGV4Lk1BVEVSSUFMLCBEU1Bvb2wuZ2V0KFBhc3NQb29sLmdldChiYXRjaC5oUGFzcywgUGFzc1ZpZXcuREVTQ1JJUFRPUl9TRVQpKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgYm91bmRQU08gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5MT0NBTCwgYmF0Y2guZGVzY3JpcHRvclNldCwgcmVzLnZhbHVlLmR5bmFtaWNPZmZzZXRzKTtcclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuYmluZElucHV0QXNzZW1ibGVyKGJhdGNoLmlhKTtcclxuICAgICAgICAgICAgICAgIGNtZEJ1ZmYuZHJhdyhiYXRjaC5pYSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzID0gaXQubmV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=