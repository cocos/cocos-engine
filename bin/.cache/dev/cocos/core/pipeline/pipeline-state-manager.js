(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../gfx/index.js", "../renderer/core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../gfx/index.js"), require("../renderer/core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.memoryPools);
    global.pipelineStateManager = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PipelineStateManager = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var PipelineStateManager = /*#__PURE__*/function () {
    function PipelineStateManager() {
      _classCallCheck(this, PipelineStateManager);
    }

    _createClass(PipelineStateManager, null, [{
      key: "getOrCreatePipelineState",
      value: function getOrCreatePipelineState(device, hPass, shader, renderPass, ia) {
        var hash1 = _memoryPools.PassPool.get(hPass, _memoryPools.PassView.HASH);

        var hash2 = renderPass.hash;
        var hash3 = ia.attributesHash;
        var hash4 = shader.id;
        var newHash = hash1 ^ hash2 ^ hash3 ^ hash4;

        var pso = this._PSOHashMap.get(newHash);

        if (!pso) {
          var pipelineLayout = _memoryPools.PipelineLayoutPool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.PIPELINE_LAYOUT));

          var inputState = new _index.GFXInputState();
          inputState.attributes = ia.attributes;
          var psoInfo = new _index.GFXPipelineStateInfo(shader, pipelineLayout, renderPass, inputState, _memoryPools.RasterizerStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.RASTERIZER_STATE)), _memoryPools.DepthStencilStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DEPTH_STENCIL_STATE)), _memoryPools.BlendStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.BLEND_STATE)), _memoryPools.PassPool.get(hPass, _memoryPools.PassView.PRIMITIVE), _memoryPools.PassPool.get(hPass, _memoryPools.PassView.DYNAMIC_STATES));
          pso = device.createPipelineState(psoInfo);

          this._PSOHashMap.set(newHash, pso);
        }

        return pso;
      }
    }]);

    return PipelineStateManager;
  }();

  _exports.PipelineStateManager = PipelineStateManager;
  PipelineStateManager._PSOHashMap = new Map();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvcGlwZWxpbmUtc3RhdGUtbWFuYWdlci50cyJdLCJuYW1lcyI6WyJQaXBlbGluZVN0YXRlTWFuYWdlciIsImRldmljZSIsImhQYXNzIiwic2hhZGVyIiwicmVuZGVyUGFzcyIsImlhIiwiaGFzaDEiLCJQYXNzUG9vbCIsImdldCIsIlBhc3NWaWV3IiwiSEFTSCIsImhhc2gyIiwiaGFzaCIsImhhc2gzIiwiYXR0cmlidXRlc0hhc2giLCJoYXNoNCIsImlkIiwibmV3SGFzaCIsInBzbyIsIl9QU09IYXNoTWFwIiwicGlwZWxpbmVMYXlvdXQiLCJQaXBlbGluZUxheW91dFBvb2wiLCJQSVBFTElORV9MQVlPVVQiLCJpbnB1dFN0YXRlIiwiR0ZYSW5wdXRTdGF0ZSIsImF0dHJpYnV0ZXMiLCJwc29JbmZvIiwiR0ZYUGlwZWxpbmVTdGF0ZUluZm8iLCJSYXN0ZXJpemVyU3RhdGVQb29sIiwiUkFTVEVSSVpFUl9TVEFURSIsIkRlcHRoU3RlbmNpbFN0YXRlUG9vbCIsIkRFUFRIX1NURU5DSUxfU1RBVEUiLCJCbGVuZFN0YXRlUG9vbCIsIkJMRU5EX1NUQVRFIiwiUFJJTUlUSVZFIiwiRFlOQU1JQ19TVEFURVMiLCJjcmVhdGVQaXBlbGluZVN0YXRlIiwic2V0IiwiTWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU9hQSxvQjs7Ozs7OzsrQ0FHd0JDLE0sRUFBbUJDLEssRUFBbUJDLE0sRUFBbUJDLFUsRUFBMkJDLEUsRUFBdUI7QUFFeEksWUFBTUMsS0FBSyxHQUFHQyxzQkFBU0MsR0FBVCxDQUFhTixLQUFiLEVBQW9CTyxzQkFBU0MsSUFBN0IsQ0FBZDs7QUFDQSxZQUFNQyxLQUFLLEdBQUdQLFVBQVUsQ0FBQ1EsSUFBekI7QUFDQSxZQUFNQyxLQUFLLEdBQUdSLEVBQUUsQ0FBQ1MsY0FBakI7QUFDQSxZQUFNQyxLQUFLLEdBQUdaLE1BQU0sQ0FBQ2EsRUFBckI7QUFFQSxZQUFNQyxPQUFPLEdBQUdYLEtBQUssR0FBR0ssS0FBUixHQUFnQkUsS0FBaEIsR0FBd0JFLEtBQXhDOztBQUNBLFlBQUlHLEdBQUcsR0FBRyxLQUFLQyxXQUFMLENBQWlCWCxHQUFqQixDQUFxQlMsT0FBckIsQ0FBVjs7QUFDQSxZQUFJLENBQUNDLEdBQUwsRUFBVTtBQUNOLGNBQU1FLGNBQWMsR0FBR0MsZ0NBQW1CYixHQUFuQixDQUF1QkQsc0JBQVNDLEdBQVQsQ0FBYU4sS0FBYixFQUFvQk8sc0JBQVNhLGVBQTdCLENBQXZCLENBQXZCOztBQUNBLGNBQU1DLFVBQVUsR0FBRyxJQUFJQyxvQkFBSixFQUFuQjtBQUNBRCxVQUFBQSxVQUFVLENBQUNFLFVBQVgsR0FBd0JwQixFQUFFLENBQUNvQixVQUEzQjtBQUNBLGNBQU1DLE9BQU8sR0FBRyxJQUFJQywyQkFBSixDQUNaeEIsTUFEWSxFQUNKaUIsY0FESSxFQUNZaEIsVUFEWixFQUN3Qm1CLFVBRHhCLEVBRVpLLGlDQUFvQnBCLEdBQXBCLENBQXdCRCxzQkFBU0MsR0FBVCxDQUFhTixLQUFiLEVBQW9CTyxzQkFBU29CLGdCQUE3QixDQUF4QixDQUZZLEVBR1pDLG1DQUFzQnRCLEdBQXRCLENBQTBCRCxzQkFBU0MsR0FBVCxDQUFhTixLQUFiLEVBQW9CTyxzQkFBU3NCLG1CQUE3QixDQUExQixDQUhZLEVBSVpDLDRCQUFleEIsR0FBZixDQUFtQkQsc0JBQVNDLEdBQVQsQ0FBYU4sS0FBYixFQUFvQk8sc0JBQVN3QixXQUE3QixDQUFuQixDQUpZLEVBS1oxQixzQkFBU0MsR0FBVCxDQUFhTixLQUFiLEVBQW9CTyxzQkFBU3lCLFNBQTdCLENBTFksRUFNWjNCLHNCQUFTQyxHQUFULENBQWFOLEtBQWIsRUFBb0JPLHNCQUFTMEIsY0FBN0IsQ0FOWSxDQUFoQjtBQVFBakIsVUFBQUEsR0FBRyxHQUFHakIsTUFBTSxDQUFDbUMsbUJBQVAsQ0FBMkJWLE9BQTNCLENBQU47O0FBQ0EsZUFBS1AsV0FBTCxDQUFpQmtCLEdBQWpCLENBQXFCcEIsT0FBckIsRUFBOEJDLEdBQTlCO0FBQ0g7O0FBRUQsZUFBT0EsR0FBUDtBQUNIOzs7Ozs7O0FBN0JRbEIsRUFBQUEsb0IsQ0FDTW1CLFcsR0FBNkMsSUFBSW1CLEdBQUosRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgR0ZYU2hhZGVyLCBHRlhSZW5kZXJQYXNzLCBHRlhJbnB1dEFzc2VtYmxlciwgR0ZYRGV2aWNlLCBHRlhQaXBlbGluZVN0YXRlLCBHRlhJbnB1dFN0YXRlLCBHRlhQaXBlbGluZVN0YXRlSW5mbyB9IGZyb20gJy4uL2dmeCc7XHJcbmltcG9ydCB7IFBhc3NQb29sLCBQYXNzVmlldywgUmFzdGVyaXplclN0YXRlUG9vbCwgQmxlbmRTdGF0ZVBvb2wsIERlcHRoU3RlbmNpbFN0YXRlUG9vbCwgUGFzc0hhbmRsZSwgUGlwZWxpbmVMYXlvdXRQb29sIH0gZnJvbSAnLi4vcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFBpcGVsaW5lU3RhdGVNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgc3RhdGljIF9QU09IYXNoTWFwOiBNYXA8bnVtYmVyLCBHRlhQaXBlbGluZVN0YXRlPiA9IG5ldyBNYXA8bnVtYmVyLCBHRlhQaXBlbGluZVN0YXRlPigpO1xyXG5cclxuICAgIHN0YXRpYyBnZXRPckNyZWF0ZVBpcGVsaW5lU3RhdGUgKGRldmljZTogR0ZYRGV2aWNlLCBoUGFzczogUGFzc0hhbmRsZSwgc2hhZGVyOiBHRlhTaGFkZXIsIHJlbmRlclBhc3M6IEdGWFJlbmRlclBhc3MsIGlhOiBHRlhJbnB1dEFzc2VtYmxlcikge1xyXG5cclxuICAgICAgICBjb25zdCBoYXNoMSA9IFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuSEFTSCk7XHJcbiAgICAgICAgY29uc3QgaGFzaDIgPSByZW5kZXJQYXNzLmhhc2g7XHJcbiAgICAgICAgY29uc3QgaGFzaDMgPSBpYS5hdHRyaWJ1dGVzSGFzaDtcclxuICAgICAgICBjb25zdCBoYXNoNCA9IHNoYWRlci5pZDtcclxuXHJcbiAgICAgICAgY29uc3QgbmV3SGFzaCA9IGhhc2gxIF4gaGFzaDIgXiBoYXNoMyBeIGhhc2g0O1xyXG4gICAgICAgIGxldCBwc28gPSB0aGlzLl9QU09IYXNoTWFwLmdldChuZXdIYXNoKTtcclxuICAgICAgICBpZiAoIXBzbykge1xyXG4gICAgICAgICAgICBjb25zdCBwaXBlbGluZUxheW91dCA9IFBpcGVsaW5lTGF5b3V0UG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5QSVBFTElORV9MQVlPVVQpKTtcclxuICAgICAgICAgICAgY29uc3QgaW5wdXRTdGF0ZSA9IG5ldyBHRlhJbnB1dFN0YXRlKCk7XHJcbiAgICAgICAgICAgIGlucHV0U3RhdGUuYXR0cmlidXRlcyA9IGlhLmF0dHJpYnV0ZXM7XHJcbiAgICAgICAgICAgIGNvbnN0IHBzb0luZm8gPSBuZXcgR0ZYUGlwZWxpbmVTdGF0ZUluZm8oXHJcbiAgICAgICAgICAgICAgICBzaGFkZXIsIHBpcGVsaW5lTGF5b3V0LCByZW5kZXJQYXNzLCBpbnB1dFN0YXRlLFxyXG4gICAgICAgICAgICAgICAgUmFzdGVyaXplclN0YXRlUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5SQVNURVJJWkVSX1NUQVRFKSksXHJcbiAgICAgICAgICAgICAgICBEZXB0aFN0ZW5jaWxTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuREVQVEhfU1RFTkNJTF9TVEFURSkpLFxyXG4gICAgICAgICAgICAgICAgQmxlbmRTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuQkxFTkRfU1RBVEUpKSxcclxuICAgICAgICAgICAgICAgIFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuUFJJTUlUSVZFKSxcclxuICAgICAgICAgICAgICAgIFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuRFlOQU1JQ19TVEFURVMpLFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBwc28gPSBkZXZpY2UuY3JlYXRlUGlwZWxpbmVTdGF0ZShwc29JbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fUFNPSGFzaE1hcC5zZXQobmV3SGFzaCwgcHNvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwc287XHJcbiAgICB9XHJcbn1cclxuIl19