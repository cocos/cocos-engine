(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../memop/index.js", "../memop/cached-array.js", "./define.js", "./pipeline-state-manager.js", "../renderer/core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../memop/index.js"), require("../memop/cached-array.js"), require("./define.js"), require("./pipeline-state-manager.js"), require("../renderer/core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.cachedArray, global.define, global.pipelineStateManager, global.memoryPools);
    global.renderQueue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _cachedArray, _define, _pipelineStateManager, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.opaqueCompareFn = opaqueCompareFn;
  _exports.transparentCompareFn = transparentCompareFn;
  _exports.RenderQueue = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en Comparison sorting function. Opaque objects are sorted by priority -> depth front to back -> shader ID.
   * @zh 比较排序函数。不透明对象按优先级 -> 深度由前向后 -> Shader ID 顺序排序。
   */
  function opaqueCompareFn(a, b) {
    return a.hash - b.hash || a.depth - b.depth || a.shaderId - b.shaderId;
  }
  /**
   * @en Comparison sorting function. Transparent objects are sorted by priority -> depth back to front -> shader ID.
   * @zh 比较排序函数。半透明对象按优先级 -> 深度由后向前 -> Shader ID 顺序排序。
   */


  function transparentCompareFn(a, b) {
    return a.hash - b.hash || b.depth - a.depth || a.shaderId - b.shaderId;
  }
  /**
   * @en The render queue. It manages a [[GFXRenderPass]] queue which will be executed by the [[RenderStage]].
   * @zh 渲染队列。它管理一个 [[GFXRenderPass]] 队列，队列中的渲染过程会被 [[RenderStage]] 所执行。
   */


  var RenderQueue = /*#__PURE__*/function () {
    /**
     * @en A cached array of render passes
     * @zh 基于缓存数组的渲染过程队列。
     */

    /**
     * @en Construct a RenderQueue with render queue descriptor
     * @zh 利用渲染队列描述来构造一个 RenderQueue。
     * @param desc Render queue descriptor
     */
    function RenderQueue(desc) {
      _classCallCheck(this, RenderQueue);

      this.queue = void 0;
      this._passDesc = void 0;
      this._passPool = void 0;
      this._passDesc = desc;
      this._passPool = new _index.RecyclePool(function () {
        return {
          hash: 0,
          depth: 0,
          shaderId: 0,
          subModel: null,
          passIdx: 0
        };
      }, 64);
      this.queue = new _cachedArray.CachedArray(64, this._passDesc.sortFunc);
    }
    /**
     * @en Clear the render queue
     * @zh 清空渲染队列。
     */


    _createClass(RenderQueue, [{
      key: "clear",
      value: function clear() {
        this.queue.clear();

        this._passPool.reset();
      }
      /**
       * @en Insert a render pass into the queue
       * @zh 插入渲染过程。
       * @param renderObj The render object of the pass
       * @param modelIdx The model id
       * @param passIdx The pass id
       * @returns Whether the new render pass is successfully added
       */

    }, {
      key: "insertRenderPass",
      value: function insertRenderPass(renderObj, subModelIdx, passIdx) {
        var subModel = renderObj.model.subModels[subModelIdx];

        var hPass = _memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.PASS_0 + passIdx);

        var isTransparent = _memoryPools.BlendStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.BLEND_STATE)).targets[0].blend;

        var temp_phase = _memoryPools.PassPool.get(hPass, _memoryPools.PassView.PHASE);

        if (isTransparent !== this._passDesc.isTransparent || !(temp_phase & this._passDesc.phases)) {
          return false;
        }

        var hash = 0 << 30 | _memoryPools.PassPool.get(hPass, _memoryPools.PassView.PRIORITY) << 16 | subModel.priority << 8 | passIdx;

        var rp = this._passPool.add();

        rp.hash = hash;
        rp.depth = renderObj.depth || 0;
        rp.shaderId = _memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.SHADER_0 + passIdx);
        rp.subModel = subModel;
        rp.passIdx = passIdx;
        this.queue.push(rp);
        return true;
      }
      /**
       * @en Sort the current queue
       * @zh 排序渲染队列。
       */

    }, {
      key: "sort",
      value: function sort() {
        this.queue.sort();
      }
    }, {
      key: "recordCommandBuffer",
      value: function recordCommandBuffer(device, renderPass, cmdBuff) {
        for (var i = 0; i < this.queue.length; ++i) {
          var _this$queue$array$i = this.queue.array[i],
              subModel = _this$queue$array$i.subModel,
              passIdx = _this$queue$array$i.passIdx;
          var inputAssembler = subModel.inputAssembler,
              hSubModel = subModel.handle;

          var hPass = _memoryPools.SubModelPool.get(hSubModel, _memoryPools.SubModelView.PASS_0 + passIdx);

          var shader = _memoryPools.ShaderPool.get(_memoryPools.SubModelPool.get(hSubModel, _memoryPools.SubModelView.SHADER_0 + passIdx));

          var pso = _pipelineStateManager.PipelineStateManager.getOrCreatePipelineState(device, hPass, shader, renderPass, inputAssembler);

          cmdBuff.bindPipelineState(pso);
          cmdBuff.bindDescriptorSet(_define.SetIndex.MATERIAL, _memoryPools.DSPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DESCRIPTOR_SET)));
          cmdBuff.bindDescriptorSet(_define.SetIndex.LOCAL, _memoryPools.DSPool.get(_memoryPools.SubModelPool.get(hSubModel, _memoryPools.SubModelView.DESCRIPTOR_SET)));
          cmdBuff.bindInputAssembler(inputAssembler);
          cmdBuff.draw(inputAssembler);
        }
      }
    }]);

    return RenderQueue;
  }();

  _exports.RenderQueue = RenderQueue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcmVuZGVyLXF1ZXVlLnRzIl0sIm5hbWVzIjpbIm9wYXF1ZUNvbXBhcmVGbiIsImEiLCJiIiwiaGFzaCIsImRlcHRoIiwic2hhZGVySWQiLCJ0cmFuc3BhcmVudENvbXBhcmVGbiIsIlJlbmRlclF1ZXVlIiwiZGVzYyIsInF1ZXVlIiwiX3Bhc3NEZXNjIiwiX3Bhc3NQb29sIiwiUmVjeWNsZVBvb2wiLCJzdWJNb2RlbCIsInBhc3NJZHgiLCJDYWNoZWRBcnJheSIsInNvcnRGdW5jIiwiY2xlYXIiLCJyZXNldCIsInJlbmRlck9iaiIsInN1Yk1vZGVsSWR4IiwibW9kZWwiLCJzdWJNb2RlbHMiLCJoUGFzcyIsIlN1Yk1vZGVsUG9vbCIsImdldCIsImhhbmRsZSIsIlN1Yk1vZGVsVmlldyIsIlBBU1NfMCIsImlzVHJhbnNwYXJlbnQiLCJCbGVuZFN0YXRlUG9vbCIsIlBhc3NQb29sIiwiUGFzc1ZpZXciLCJCTEVORF9TVEFURSIsInRhcmdldHMiLCJibGVuZCIsInRlbXBfcGhhc2UiLCJQSEFTRSIsInBoYXNlcyIsIlBSSU9SSVRZIiwicHJpb3JpdHkiLCJycCIsImFkZCIsIlNIQURFUl8wIiwicHVzaCIsInNvcnQiLCJkZXZpY2UiLCJyZW5kZXJQYXNzIiwiY21kQnVmZiIsImkiLCJsZW5ndGgiLCJhcnJheSIsImlucHV0QXNzZW1ibGVyIiwiaFN1Yk1vZGVsIiwic2hhZGVyIiwiU2hhZGVyUG9vbCIsInBzbyIsIlBpcGVsaW5lU3RhdGVNYW5hZ2VyIiwiZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlIiwiYmluZFBpcGVsaW5lU3RhdGUiLCJiaW5kRGVzY3JpcHRvclNldCIsIlNldEluZGV4IiwiTUFURVJJQUwiLCJEU1Bvb2wiLCJERVNDUklQVE9SX1NFVCIsIkxPQ0FMIiwiYmluZElucHV0QXNzZW1ibGVyIiwiZHJhdyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7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QUE5QyxFQUFzRHZCLEtBQXRELEVBQTZEK0IsTUFBN0QsRUFBcUVQLFVBQXJFLEVBQWlGSyxjQUFqRixDQUFaOztBQUNBSixVQUFBQSxPQUFPLENBQUNXLGlCQUFSLENBQTBCSCxHQUExQjtBQUNBUixVQUFBQSxPQUFPLENBQUNZLGlCQUFSLENBQTBCQyxpQkFBU0MsUUFBbkMsRUFBNkNDLG9CQUFPdEMsR0FBUCxDQUFXTSxzQkFBU04sR0FBVCxDQUFhRixLQUFiLEVBQW9CUyxzQkFBU2dDLGNBQTdCLENBQVgsQ0FBN0M7QUFDQWhCLFVBQUFBLE9BQU8sQ0FBQ1ksaUJBQVIsQ0FBMEJDLGlCQUFTSSxLQUFuQyxFQUEwQ0Ysb0JBQU90QyxHQUFQLENBQVdELDBCQUFhQyxHQUFiLENBQWlCNEIsU0FBakIsRUFBNEIxQiwwQkFBYXFDLGNBQXpDLENBQVgsQ0FBMUM7QUFDQWhCLFVBQUFBLE9BQU8sQ0FBQ2tCLGtCQUFSLENBQTJCZCxjQUEzQjtBQUNBSixVQUFBQSxPQUFPLENBQUNtQixJQUFSLENBQWFmLGNBQWI7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIgfSBmcm9tICcuLi9nZngvY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgeyBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uL21lbW9wJztcclxuaW1wb3J0IHsgQ2FjaGVkQXJyYXkgfSBmcm9tICcuLi9tZW1vcC9jYWNoZWQtYXJyYXknO1xyXG5pbXBvcnQgeyBJUmVuZGVyT2JqZWN0LCBJUmVuZGVyUGFzcywgSVJlbmRlclF1ZXVlRGVzYywgU2V0SW5kZXggfSBmcm9tICcuL2RlZmluZSc7XHJcbmltcG9ydCB7IFBpcGVsaW5lU3RhdGVNYW5hZ2VyIH0gZnJvbSAnLi9waXBlbGluZS1zdGF0ZS1tYW5hZ2VyJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWFJlbmRlclBhc3MgfSBmcm9tICcuLi9nZngnO1xyXG5pbXBvcnQgeyBCbGVuZFN0YXRlUG9vbCwgUGFzc1Bvb2wsIFBhc3NWaWV3LCBEU1Bvb2wsIFN1Yk1vZGVsVmlldywgU3ViTW9kZWxQb29sLCBTaGFkZXJQb29sLCBQYXNzSGFuZGxlLCBTaGFkZXJIYW5kbGUgfSBmcm9tICcuLi9yZW5kZXJlci9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG4vKipcclxuICogQGVuIENvbXBhcmlzb24gc29ydGluZyBmdW5jdGlvbi4gT3BhcXVlIG9iamVjdHMgYXJlIHNvcnRlZCBieSBwcmlvcml0eSAtPiBkZXB0aCBmcm9udCB0byBiYWNrIC0+IHNoYWRlciBJRC5cclxuICogQHpoIOavlOi+g+aOkuW6j+WHveaVsOOAguS4jemAj+aYjuWvueixoeaMieS8mOWFiOe6pyAtPiDmt7HluqbnlLHliY3lkJHlkI4gLT4gU2hhZGVyIElEIOmhuuW6j+aOkuW6j+OAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIG9wYXF1ZUNvbXBhcmVGbiAoYTogSVJlbmRlclBhc3MsIGI6IElSZW5kZXJQYXNzKSB7XHJcbiAgICByZXR1cm4gKGEuaGFzaCAtIGIuaGFzaCkgfHwgKGEuZGVwdGggLSBiLmRlcHRoKSB8fCAoYS5zaGFkZXJJZCAtIGIuc2hhZGVySWQpO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIENvbXBhcmlzb24gc29ydGluZyBmdW5jdGlvbi4gVHJhbnNwYXJlbnQgb2JqZWN0cyBhcmUgc29ydGVkIGJ5IHByaW9yaXR5IC0+IGRlcHRoIGJhY2sgdG8gZnJvbnQgLT4gc2hhZGVyIElELlxyXG4gKiBAemgg5q+U6L6D5o6S5bqP5Ye95pWw44CC5Y2K6YCP5piO5a+56LGh5oyJ5LyY5YWI57qnIC0+IOa3seW6pueUseWQjuWQkeWJjSAtPiBTaGFkZXIgSUQg6aG65bqP5o6S5bqP44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdHJhbnNwYXJlbnRDb21wYXJlRm4gKGE6IElSZW5kZXJQYXNzLCBiOiBJUmVuZGVyUGFzcykge1xyXG4gICAgcmV0dXJuIChhLmhhc2ggLSBiLmhhc2gpIHx8IChiLmRlcHRoIC0gYS5kZXB0aCkgfHwgKGEuc2hhZGVySWQgLSBiLnNoYWRlcklkKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBUaGUgcmVuZGVyIHF1ZXVlLiBJdCBtYW5hZ2VzIGEgW1tHRlhSZW5kZXJQYXNzXV0gcXVldWUgd2hpY2ggd2lsbCBiZSBleGVjdXRlZCBieSB0aGUgW1tSZW5kZXJTdGFnZV1dLlxyXG4gKiBAemgg5riy5p+T6Zif5YiX44CC5a6D566h55CG5LiA5LiqIFtbR0ZYUmVuZGVyUGFzc11dIOmYn+WIl++8jOmYn+WIl+S4reeahOa4suafk+i/h+eoi+S8muiiqyBbW1JlbmRlclN0YWdlXV0g5omA5omn6KGM44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVuZGVyUXVldWUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEEgY2FjaGVkIGFycmF5IG9mIHJlbmRlciBwYXNzZXNcclxuICAgICAqIEB6aCDln7rkuo7nvJPlrZjmlbDnu4TnmoTmuLLmn5Pov4fnqIvpmJ/liJfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHF1ZXVlOiBDYWNoZWRBcnJheTxJUmVuZGVyUGFzcz47XHJcblxyXG4gICAgcHJpdmF0ZSBfcGFzc0Rlc2M6IElSZW5kZXJRdWV1ZURlc2M7XHJcbiAgICBwcml2YXRlIF9wYXNzUG9vbDogUmVjeWNsZVBvb2w8SVJlbmRlclBhc3M+O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvbnN0cnVjdCBhIFJlbmRlclF1ZXVlIHdpdGggcmVuZGVyIHF1ZXVlIGRlc2NyaXB0b3JcclxuICAgICAqIEB6aCDliKnnlKjmuLLmn5PpmJ/liJfmj4/ov7DmnaXmnoTpgKDkuIDkuKogUmVuZGVyUXVldWXjgIJcclxuICAgICAqIEBwYXJhbSBkZXNjIFJlbmRlciBxdWV1ZSBkZXNjcmlwdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChkZXNjOiBJUmVuZGVyUXVldWVEZXNjKSB7XHJcbiAgICAgICAgdGhpcy5fcGFzc0Rlc2MgPSBkZXNjO1xyXG4gICAgICAgIHRoaXMuX3Bhc3NQb29sID0gbmV3IFJlY3ljbGVQb29sKCgpID0+ICh7XHJcbiAgICAgICAgICAgIGhhc2g6IDAsXHJcbiAgICAgICAgICAgIGRlcHRoOiAwLFxyXG4gICAgICAgICAgICBzaGFkZXJJZDogMCxcclxuICAgICAgICAgICAgc3ViTW9kZWw6IG51bGwhLFxyXG4gICAgICAgICAgICBwYXNzSWR4OiAwLFxyXG4gICAgICAgIH0pLCA2NCk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBDYWNoZWRBcnJheSg2NCwgdGhpcy5fcGFzc0Rlc2Muc29ydEZ1bmMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIENsZWFyIHRoZSByZW5kZXIgcXVldWVcclxuICAgICAqIEB6aCDmuIXnqbrmuLLmn5PpmJ/liJfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLnF1ZXVlLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5fcGFzc1Bvb2wucmVzZXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbnNlcnQgYSByZW5kZXIgcGFzcyBpbnRvIHRoZSBxdWV1ZVxyXG4gICAgICogQHpoIOaPkuWFpea4suafk+i/h+eoi+OAglxyXG4gICAgICogQHBhcmFtIHJlbmRlck9iaiBUaGUgcmVuZGVyIG9iamVjdCBvZiB0aGUgcGFzc1xyXG4gICAgICogQHBhcmFtIG1vZGVsSWR4IFRoZSBtb2RlbCBpZFxyXG4gICAgICogQHBhcmFtIHBhc3NJZHggVGhlIHBhc3MgaWRcclxuICAgICAqIEByZXR1cm5zIFdoZXRoZXIgdGhlIG5ldyByZW5kZXIgcGFzcyBpcyBzdWNjZXNzZnVsbHkgYWRkZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluc2VydFJlbmRlclBhc3MgKHJlbmRlck9iajogSVJlbmRlck9iamVjdCwgc3ViTW9kZWxJZHg6IG51bWJlciwgcGFzc0lkeDogbnVtYmVyKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3Qgc3ViTW9kZWwgPSByZW5kZXJPYmoubW9kZWwuc3ViTW9kZWxzW3N1Yk1vZGVsSWR4XTtcclxuICAgICAgICBjb25zdCBoUGFzcyA9IFN1Yk1vZGVsUG9vbC5nZXQoc3ViTW9kZWwuaGFuZGxlLCBTdWJNb2RlbFZpZXcuUEFTU18wICsgcGFzc0lkeCkgYXMgUGFzc0hhbmRsZTtcclxuICAgICAgICBjb25zdCBpc1RyYW5zcGFyZW50ID0gQmxlbmRTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuQkxFTkRfU1RBVEUpKS50YXJnZXRzWzBdLmJsZW5kO1xyXG4gICAgICAgIGxldCB0ZW1wX3BoYXNlID0gUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5QSEFTRSk7XHJcbiAgICAgICAgaWYgKGlzVHJhbnNwYXJlbnQgIT09IHRoaXMuX3Bhc3NEZXNjLmlzVHJhbnNwYXJlbnQgfHwgISh0ZW1wX3BoYXNlICYgdGhpcy5fcGFzc0Rlc2MucGhhc2VzKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGhhc2ggPSAoMCA8PCAzMCkgfCBQYXNzUG9vbC5nZXQoaFBhc3MsIFBhc3NWaWV3LlBSSU9SSVRZKSA8PCAxNiB8IHN1Yk1vZGVsLnByaW9yaXR5IDw8IDggfCBwYXNzSWR4O1xyXG4gICAgICAgIGNvbnN0IHJwID0gdGhpcy5fcGFzc1Bvb2wuYWRkKCk7XHJcbiAgICAgICAgcnAuaGFzaCA9IGhhc2g7XHJcbiAgICAgICAgcnAuZGVwdGggPSByZW5kZXJPYmouZGVwdGggfHwgMDtcclxuICAgICAgICBycC5zaGFkZXJJZCA9IFN1Yk1vZGVsUG9vbC5nZXQoc3ViTW9kZWwuaGFuZGxlLCBTdWJNb2RlbFZpZXcuU0hBREVSXzAgKyBwYXNzSWR4KSBhcyBudW1iZXI7XHJcbiAgICAgICAgcnAuc3ViTW9kZWwgPSBzdWJNb2RlbDtcclxuICAgICAgICBycC5wYXNzSWR4ID0gcGFzc0lkeDtcclxuICAgICAgICB0aGlzLnF1ZXVlLnB1c2gocnApO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNvcnQgdGhlIGN1cnJlbnQgcXVldWVcclxuICAgICAqIEB6aCDmjpLluo/muLLmn5PpmJ/liJfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNvcnQgKCkge1xyXG4gICAgICAgIHRoaXMucXVldWUuc29ydCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZWNvcmRDb21tYW5kQnVmZmVyIChkZXZpY2U6IEdGWERldmljZSwgcmVuZGVyUGFzczogR0ZYUmVuZGVyUGFzcywgY21kQnVmZjogR0ZYQ29tbWFuZEJ1ZmZlcikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5xdWV1ZS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB7IHN1Yk1vZGVsLCBwYXNzSWR4IH0gPSB0aGlzLnF1ZXVlLmFycmF5W2ldO1xyXG4gICAgICAgICAgICBjb25zdCB7IGlucHV0QXNzZW1ibGVyLCBoYW5kbGU6IGhTdWJNb2RlbCB9ID0gc3ViTW9kZWw7XHJcbiAgICAgICAgICAgIGNvbnN0IGhQYXNzID0gU3ViTW9kZWxQb29sLmdldChoU3ViTW9kZWwsIFN1Yk1vZGVsVmlldy5QQVNTXzAgKyBwYXNzSWR4KSBhcyBQYXNzSGFuZGxlO1xyXG4gICAgICAgICAgICBjb25zdCBzaGFkZXIgPSBTaGFkZXJQb29sLmdldChTdWJNb2RlbFBvb2wuZ2V0KGhTdWJNb2RlbCwgU3ViTW9kZWxWaWV3LlNIQURFUl8wICsgcGFzc0lkeCkgYXMgU2hhZGVySGFuZGxlKTtcclxuICAgICAgICAgICAgY29uc3QgcHNvID0gUGlwZWxpbmVTdGF0ZU1hbmFnZXIuZ2V0T3JDcmVhdGVQaXBlbGluZVN0YXRlKGRldmljZSwgaFBhc3MsIHNoYWRlciwgcmVuZGVyUGFzcywgaW5wdXRBc3NlbWJsZXIpO1xyXG4gICAgICAgICAgICBjbWRCdWZmLmJpbmRQaXBlbGluZVN0YXRlKHBzbyk7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuYmluZERlc2NyaXB0b3JTZXQoU2V0SW5kZXguTUFURVJJQUwsIERTUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpKTtcclxuICAgICAgICAgICAgY21kQnVmZi5iaW5kRGVzY3JpcHRvclNldChTZXRJbmRleC5MT0NBTCwgRFNQb29sLmdldChTdWJNb2RlbFBvb2wuZ2V0KGhTdWJNb2RlbCwgU3ViTW9kZWxWaWV3LkRFU0NSSVBUT1JfU0VUKSkpO1xyXG4gICAgICAgICAgICBjbWRCdWZmLmJpbmRJbnB1dEFzc2VtYmxlcihpbnB1dEFzc2VtYmxlcik7XHJcbiAgICAgICAgICAgIGNtZEJ1ZmYuZHJhdyhpbnB1dEFzc2VtYmxlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==