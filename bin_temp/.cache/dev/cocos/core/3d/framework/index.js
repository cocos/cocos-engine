(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./skinned-mesh-batch-renderer.js", "./camera-component.js", "./directional-light-component.js", "./light-component.js", "./mesh-renderer.js", "./renderable-component.js", "./skinned-mesh-renderer.js", "./sphere-light-component.js", "./spot-light-component.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./skinned-mesh-batch-renderer.js"), require("./camera-component.js"), require("./directional-light-component.js"), require("./light-component.js"), require("./mesh-renderer.js"), require("./renderable-component.js"), require("./skinned-mesh-renderer.js"), require("./sphere-light-component.js"), require("./spot-light-component.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.skinnedMeshBatchRenderer, global.cameraComponent, global.directionalLightComponent, global.lightComponent, global.meshRenderer, global.renderableComponent, global.skinnedMeshRenderer, global.sphereLightComponent, global.spotLightComponent, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _skinnedMeshBatchRenderer, _cameraComponent, _directionalLightComponent, _lightComponent, _meshRenderer, _renderableComponent, _skinnedMeshRenderer, _sphereLightComponent, _spotLightComponent, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    SkinnedMeshBatchRenderer: true,
    SkinnedMeshUnit: true,
    Camera: true,
    DirectionalLight: true,
    Light: true,
    MeshRenderer: true,
    RenderableComponent: true,
    SkinnedMeshRenderer: true,
    SphereLight: true,
    SpotLight: true
  };
  Object.defineProperty(_exports, "SkinnedMeshBatchRenderer", {
    enumerable: true,
    get: function () {
      return _skinnedMeshBatchRenderer.SkinnedMeshBatchRenderer;
    }
  });
  Object.defineProperty(_exports, "SkinnedMeshUnit", {
    enumerable: true,
    get: function () {
      return _skinnedMeshBatchRenderer.SkinnedMeshUnit;
    }
  });
  Object.defineProperty(_exports, "Camera", {
    enumerable: true,
    get: function () {
      return _cameraComponent.Camera;
    }
  });
  Object.defineProperty(_exports, "DirectionalLight", {
    enumerable: true,
    get: function () {
      return _directionalLightComponent.DirectionalLight;
    }
  });
  Object.defineProperty(_exports, "Light", {
    enumerable: true,
    get: function () {
      return _lightComponent.Light;
    }
  });
  Object.defineProperty(_exports, "MeshRenderer", {
    enumerable: true,
    get: function () {
      return _meshRenderer.MeshRenderer;
    }
  });
  Object.defineProperty(_exports, "RenderableComponent", {
    enumerable: true,
    get: function () {
      return _renderableComponent.RenderableComponent;
    }
  });
  Object.defineProperty(_exports, "SkinnedMeshRenderer", {
    enumerable: true,
    get: function () {
      return _skinnedMeshRenderer.SkinnedMeshRenderer;
    }
  });
  Object.defineProperty(_exports, "SphereLight", {
    enumerable: true,
    get: function () {
      return _sphereLightComponent.SphereLight;
    }
  });
  Object.defineProperty(_exports, "SpotLight", {
    enumerable: true,
    get: function () {
      return _spotLightComponent.SpotLight;
    }
  });
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgU2tpbm5lZE1lc2hCYXRjaFJlbmRlcmVyLCBTa2lubmVkTWVzaFVuaXQgfSBmcm9tICcuL3NraW5uZWQtbWVzaC1iYXRjaC1yZW5kZXJlcic7XHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gJy4vY2FtZXJhLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IERpcmVjdGlvbmFsTGlnaHQgfSBmcm9tICcuL2RpcmVjdGlvbmFsLWxpZ2h0LWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IExpZ2h0IH0gZnJvbSAnLi9saWdodC1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tICcuL21lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBSZW5kZXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi9yZW5kZXJhYmxlLWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNraW5uZWRNZXNoUmVuZGVyZXIgfSBmcm9tICcuL3NraW5uZWQtbWVzaC1yZW5kZXJlcic7XHJcbmltcG9ydCB7IFNwaGVyZUxpZ2h0IH0gZnJvbSAnLi9zcGhlcmUtbGlnaHQtY29tcG9uZW50JztcclxuaW1wb3J0IHsgU3BvdExpZ2h0IH0gZnJvbSAnLi9zcG90LWxpZ2h0LWNvbXBvbmVudCc7XHJcblxyXG5leHBvcnQge1xyXG4gICAgQ2FtZXJhLFxyXG4gICAgTGlnaHQsXHJcbiAgICBNZXNoUmVuZGVyZXIsXHJcbiAgICBTa2lubmVkTWVzaFJlbmRlcmVyLFxyXG4gICAgU2tpbm5lZE1lc2hCYXRjaFJlbmRlcmVyLFxyXG4gICAgU2tpbm5lZE1lc2hVbml0LFxyXG5cclxuICAgIFJlbmRlcmFibGVDb21wb25lbnQsXHJcblxyXG4gICAgRGlyZWN0aW9uYWxMaWdodCxcclxuICAgIFNwaGVyZUxpZ2h0LFxyXG4gICAgU3BvdExpZ2h0LFxyXG59O1xyXG5cclxuLyoqIGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0ICogZnJvbSAnLi9kZXByZWNhdGVkJztcclxuIl19