(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js", "./render-pipeline.js", "./render-flow.js", "./render-stage.js", "./render-view.js", "./forward/forward-pipeline.js", "./forward/forward-flow.js", "./forward/forward-stage.js", "./deferred/deferred-pipeline.js", "./deferred/gbuffer-flow.js", "./deferred/gbuffer-stage.js", "./deferred/lighting-flow.js", "./deferred/lighting-stage.js", "./deferred/transparent-stage.js", "./shadow/shadow-flow.js", "./shadow/shadow-stage.js", "./ui/ui-flow.js", "./ui/ui-stage.js", "./instanced-buffer.js", "./pipeline-state-manager.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"), require("./render-pipeline.js"), require("./render-flow.js"), require("./render-stage.js"), require("./render-view.js"), require("./forward/forward-pipeline.js"), require("./forward/forward-flow.js"), require("./forward/forward-stage.js"), require("./deferred/deferred-pipeline.js"), require("./deferred/gbuffer-flow.js"), require("./deferred/gbuffer-stage.js"), require("./deferred/lighting-flow.js"), require("./deferred/lighting-stage.js"), require("./deferred/transparent-stage.js"), require("./shadow/shadow-flow.js"), require("./shadow/shadow-stage.js"), require("./ui/ui-flow.js"), require("./ui/ui-stage.js"), require("./instanced-buffer.js"), require("./pipeline-state-manager.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.renderPipeline, global.renderFlow, global.renderStage, global.renderView, global.forwardPipeline, global.forwardFlow, global.forwardStage, global.deferredPipeline, global.gbufferFlow, global.gbufferStage, global.lightingFlow, global.lightingStage, global.transparentStage, global.shadowFlow, global.shadowStage, global.uiFlow, global.uiStage, global.instancedBuffer, global.pipelineStateManager);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, pipelineDefine, _renderPipeline, _renderFlow, _renderStage, _renderView, _forwardPipeline, _forwardFlow, _forwardStage, _deferredPipeline, _gbufferFlow, _gbufferStage, _lightingFlow, _lightingStage, _transparentStage, _shadowFlow, _shadowStage, _uiFlow, _uiStage, _instancedBuffer, _pipelineStateManager) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "RenderPipeline", {
    enumerable: true,
    get: function () {
      return _renderPipeline.RenderPipeline;
    }
  });
  Object.defineProperty(_exports, "RenderFlow", {
    enumerable: true,
    get: function () {
      return _renderFlow.RenderFlow;
    }
  });
  Object.defineProperty(_exports, "RenderStage", {
    enumerable: true,
    get: function () {
      return _renderStage.RenderStage;
    }
  });
  Object.defineProperty(_exports, "RenderView", {
    enumerable: true,
    get: function () {
      return _renderView.RenderView;
    }
  });
  Object.defineProperty(_exports, "ForwardPipeline", {
    enumerable: true,
    get: function () {
      return _forwardPipeline.ForwardPipeline;
    }
  });
  Object.defineProperty(_exports, "ForwardFlow", {
    enumerable: true,
    get: function () {
      return _forwardFlow.ForwardFlow;
    }
  });
  Object.defineProperty(_exports, "ForwardStage", {
    enumerable: true,
    get: function () {
      return _forwardStage.ForwardStage;
    }
  });
  Object.defineProperty(_exports, "DeferredPipeline", {
    enumerable: true,
    get: function () {
      return _deferredPipeline.DeferredPipeline;
    }
  });
  Object.defineProperty(_exports, "GbufferFlow", {
    enumerable: true,
    get: function () {
      return _gbufferFlow.GbufferFlow;
    }
  });
  Object.defineProperty(_exports, "GbufferStage", {
    enumerable: true,
    get: function () {
      return _gbufferStage.GbufferStage;
    }
  });
  Object.defineProperty(_exports, "LightingFlow", {
    enumerable: true,
    get: function () {
      return _lightingFlow.LightingFlow;
    }
  });
  Object.defineProperty(_exports, "LightingStage", {
    enumerable: true,
    get: function () {
      return _lightingStage.LightingStage;
    }
  });
  Object.defineProperty(_exports, "TransparentStage", {
    enumerable: true,
    get: function () {
      return _transparentStage.TransparentStage;
    }
  });
  Object.defineProperty(_exports, "ShadowFlow", {
    enumerable: true,
    get: function () {
      return _shadowFlow.ShadowFlow;
    }
  });
  Object.defineProperty(_exports, "ShadowStage", {
    enumerable: true,
    get: function () {
      return _shadowStage.ShadowStage;
    }
  });
  Object.defineProperty(_exports, "UIFlow", {
    enumerable: true,
    get: function () {
      return _uiFlow.UIFlow;
    }
  });
  Object.defineProperty(_exports, "UIStage", {
    enumerable: true,
    get: function () {
      return _uiStage.UIStage;
    }
  });
  Object.defineProperty(_exports, "InstancedBuffer", {
    enumerable: true,
    get: function () {
      return _instancedBuffer.InstancedBuffer;
    }
  });
  Object.defineProperty(_exports, "PipelineStateManager", {
    enumerable: true,
    get: function () {
      return _pipelineStateManager.PipelineStateManager;
    }
  });
  _exports.pipeline = void 0;
  pipelineDefine = _interopRequireWildcard(pipelineDefine);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @category pipeline
   */
  var pipeline = pipelineDefine;
  _exports.pipeline = pipeline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvaW5kZXgudHMiXSwibmFtZXMiOlsicGlwZWxpbmUiLCJwaXBlbGluZURlZmluZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFLTyxNQUFNQSxRQUFRLEdBQUdDLGNBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIHBpcGVsaW5lRGVmaW5lIGZyb20gJy4vZGVmaW5lJztcclxuZXhwb3J0IGNvbnN0IHBpcGVsaW5lID0gcGlwZWxpbmVEZWZpbmU7XHJcblxyXG5leHBvcnQgeyBSZW5kZXJQaXBlbGluZSB9IGZyb20gJy4vcmVuZGVyLXBpcGVsaW5lJztcclxuZXhwb3J0IHsgUmVuZGVyRmxvdyB9IGZyb20gJy4vcmVuZGVyLWZsb3cnO1xyXG5leHBvcnQgeyBSZW5kZXJTdGFnZSB9IGZyb20gJy4vcmVuZGVyLXN0YWdlJztcclxuZXhwb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4vcmVuZGVyLXZpZXcnO1xyXG5cclxuZXhwb3J0IHsgRm9yd2FyZFBpcGVsaW5lIH0gZnJvbSAnLi9mb3J3YXJkL2ZvcndhcmQtcGlwZWxpbmUnO1xyXG5leHBvcnQgeyBGb3J3YXJkRmxvdyB9IGZyb20gJy4vZm9yd2FyZC9mb3J3YXJkLWZsb3cnO1xyXG5leHBvcnQgeyBGb3J3YXJkU3RhZ2UgfSBmcm9tICcuL2ZvcndhcmQvZm9yd2FyZC1zdGFnZSc7XHJcbmV4cG9ydCB7IERlZmVycmVkUGlwZWxpbmUgfSBmcm9tICcuL2RlZmVycmVkL2RlZmVycmVkLXBpcGVsaW5lJztcclxuZXhwb3J0IHsgR2J1ZmZlckZsb3cgfSBmcm9tICcuL2RlZmVycmVkL2didWZmZXItZmxvdyc7XHJcbmV4cG9ydCB7IEdidWZmZXJTdGFnZSB9IGZyb20gJy4vZGVmZXJyZWQvZ2J1ZmZlci1zdGFnZSc7XHJcbmV4cG9ydCB7IExpZ2h0aW5nRmxvdyB9IGZyb20gJy4vZGVmZXJyZWQvbGlnaHRpbmctZmxvdyc7XHJcbmV4cG9ydCB7IExpZ2h0aW5nU3RhZ2UgfSBmcm9tICcuL2RlZmVycmVkL2xpZ2h0aW5nLXN0YWdlJztcclxuZXhwb3J0IHsgVHJhbnNwYXJlbnRTdGFnZX0gZnJvbSAnLi9kZWZlcnJlZC90cmFuc3BhcmVudC1zdGFnZSc7XHJcbmV4cG9ydCB7IFNoYWRvd0Zsb3cgfSBmcm9tICcuL3NoYWRvdy9zaGFkb3ctZmxvdyc7XHJcbmV4cG9ydCB7IFNoYWRvd1N0YWdlIH0gZnJvbSAnLi9zaGFkb3cvc2hhZG93LXN0YWdlJztcclxuZXhwb3J0IHsgVUlGbG93IH0gZnJvbSAnLi91aS91aS1mbG93JztcclxuZXhwb3J0IHsgVUlTdGFnZSB9IGZyb20gJy4vdWkvdWktc3RhZ2UnO1xyXG5cclxuZXhwb3J0IHsgSW5zdGFuY2VkQnVmZmVyIH0gZnJvbSAnLi9pbnN0YW5jZWQtYnVmZmVyJztcclxuZXhwb3J0IHsgUGlwZWxpbmVTdGF0ZU1hbmFnZXIgfSBmcm9tICcuL3BpcGVsaW5lLXN0YXRlLW1hbmFnZXInOyJdfQ==