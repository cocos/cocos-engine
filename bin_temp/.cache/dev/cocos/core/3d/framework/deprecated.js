(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/index.js", "./mesh-renderer.js", "./camera-component.js", "./light-component.js", "./spot-light-component.js", "./sphere-light-component.js", "./directional-light-component.js", "./skinned-mesh-renderer.js", "./skinned-mesh-batch-renderer.js", "../../utils/js.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/index.js"), require("./mesh-renderer.js"), require("./camera-component.js"), require("./light-component.js"), require("./spot-light-component.js"), require("./sphere-light-component.js"), require("./directional-light-component.js"), require("./skinned-mesh-renderer.js"), require("./skinned-mesh-batch-renderer.js"), require("../../utils/js.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.meshRenderer, global.cameraComponent, global.lightComponent, global.spotLightComponent, global.sphereLightComponent, global.directionalLightComponent, global.skinnedMeshRenderer, global.skinnedMeshBatchRenderer, global.js, global.globalExports);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _meshRenderer, _cameraComponent, _lightComponent, _spotLightComponent, _sphereLightComponent, _directionalLightComponent, _skinnedMeshRenderer, _skinnedMeshBatchRenderer, _js, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "ModelComponent", {
    enumerable: true,
    get: function () {
      return _meshRenderer.MeshRenderer;
    }
  });
  Object.defineProperty(_exports, "CameraComponent", {
    enumerable: true,
    get: function () {
      return _cameraComponent.Camera;
    }
  });
  Object.defineProperty(_exports, "LightComponent", {
    enumerable: true,
    get: function () {
      return _lightComponent.Light;
    }
  });
  Object.defineProperty(_exports, "SpotLightComponent", {
    enumerable: true,
    get: function () {
      return _spotLightComponent.SpotLight;
    }
  });
  Object.defineProperty(_exports, "SphereLightComponent", {
    enumerable: true,
    get: function () {
      return _sphereLightComponent.SphereLight;
    }
  });
  Object.defineProperty(_exports, "DirectionalLightComponent", {
    enumerable: true,
    get: function () {
      return _directionalLightComponent.DirectionalLight;
    }
  });
  Object.defineProperty(_exports, "SkinningModelComponent", {
    enumerable: true,
    get: function () {
      return _skinnedMeshRenderer.SkinnedMeshRenderer;
    }
  });
  Object.defineProperty(_exports, "BatchedSkinningModelComponent", {
    enumerable: true,
    get: function () {
      return _skinnedMeshBatchRenderer.SkinnedMeshBatchRenderer;
    }
  });
  Object.defineProperty(_exports, "SkinningModelUnit", {
    enumerable: true,
    get: function () {
      return _skinnedMeshBatchRenderer.SkinnedMeshUnit;
    }
  });

  /**
   * @category component
   */
  (0, _index.removeProperty)(_meshRenderer.MeshRenderer.prototype, 'MeshRenderer.prototype', [{
    name: 'enableDynamicBatching'
  }, {
    name: 'recieveShadows'
  }]);
  (0, _index.replaceProperty)(_cameraComponent.Camera, 'Camera', [{
    name: 'CameraClearFlag',
    newName: 'ClearFlag'
  }]);
  (0, _index.replaceProperty)(_cameraComponent.Camera.prototype, 'Camera.prototype', [{
    name: 'color',
    newName: 'clearColor'
  }, {
    name: 'depth',
    newName: 'clearDepth'
  }, {
    name: 'stencil',
    newName: 'clearStencil'
  }]);
  /**
   * Alias of [[Camera]]
   * @deprecated Since v1.2
   */

  _globalExports.legacyCC.CameraComponent = _cameraComponent.Camera;

  _js.js.setClassAlias(_cameraComponent.Camera, 'cc.CameraComponent');
  /**
   * Alias of [[Light]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.LightComponent = _lightComponent.Light;

  _js.js.setClassAlias(_lightComponent.Light, 'cc.LightComponent');
  /**
   * Alias of [[DirectionalLight]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.DirectionalLightComponent = _directionalLightComponent.DirectionalLight;

  _js.js.setClassAlias(_directionalLightComponent.DirectionalLight, 'cc.DirectionalLightComponent');
  /**
   * Alias of [[SphereLight]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SphereLightComponent = _sphereLightComponent.SphereLight;

  _js.js.setClassAlias(_sphereLightComponent.SphereLight, 'cc.SphereLightComponent');
  /**
   * Alias of [[SpotLight]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SpotLightComponent = _spotLightComponent.SpotLight;

  _js.js.setClassAlias(_spotLightComponent.SpotLight, 'cc.SpotLightComponent');
  /**
   * Alias of [[MeshRenderer]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.ModelComponent = _meshRenderer.MeshRenderer;

  _js.js.setClassAlias(_meshRenderer.MeshRenderer, 'cc.ModelComponent');
  /**
   * Alias of [[SkinnedMeshRenderer]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SkinningModelComponent = _skinnedMeshRenderer.SkinnedMeshRenderer;

  _js.js.setClassAlias(_skinnedMeshRenderer.SkinnedMeshRenderer, 'cc.SkinningModelComponent');
  /**
   * Alias of [[SkinnedMeshUnit]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.SkinningModelUnit = _skinnedMeshBatchRenderer.SkinnedMeshUnit;

  _js.js.setClassAlias(_skinnedMeshBatchRenderer.SkinnedMeshUnit, 'cc.SkinningModelUnit');
  /**
   * Alias of [[SkinnedMeshBatchRenderer]]
   * @deprecated Since v1.2
   */


  _globalExports.legacyCC.BatchedSkinningModelComponent = _skinnedMeshBatchRenderer.SkinnedMeshBatchRenderer;

  _js.js.setClassAlias(_skinnedMeshBatchRenderer.SkinnedMeshBatchRenderer, 'cc.BatchedSkinningModelComponent');
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL2RlcHJlY2F0ZWQudHMiXSwibmFtZXMiOlsiTWVzaFJlbmRlcmVyIiwicHJvdG90eXBlIiwibmFtZSIsIkNhbWVyYSIsIm5ld05hbWUiLCJsZWdhY3lDQyIsIkNhbWVyYUNvbXBvbmVudCIsImpzIiwic2V0Q2xhc3NBbGlhcyIsIkxpZ2h0Q29tcG9uZW50IiwiTGlnaHQiLCJEaXJlY3Rpb25hbExpZ2h0Q29tcG9uZW50IiwiRGlyZWN0aW9uYWxMaWdodCIsIlNwaGVyZUxpZ2h0Q29tcG9uZW50IiwiU3BoZXJlTGlnaHQiLCJTcG90TGlnaHRDb21wb25lbnQiLCJTcG90TGlnaHQiLCJNb2RlbENvbXBvbmVudCIsIlNraW5uaW5nTW9kZWxDb21wb25lbnQiLCJTa2lubmVkTWVzaFJlbmRlcmVyIiwiU2tpbm5pbmdNb2RlbFVuaXQiLCJTa2lubmVkTWVzaFVuaXQiLCJCYXRjaGVkU2tpbm5pbmdNb2RlbENvbXBvbmVudCIsIlNraW5uZWRNZXNoQmF0Y2hSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7QUFnQkEsNkJBQWVBLDJCQUFhQyxTQUE1QixFQUF1Qyx3QkFBdkMsRUFBaUUsQ0FDN0Q7QUFDSUMsSUFBQUEsSUFBSSxFQUFFO0FBRFYsR0FENkQsRUFJN0Q7QUFDSUEsSUFBQUEsSUFBSSxFQUFFO0FBRFYsR0FKNkQsQ0FBakU7QUFTQSw4QkFBZ0JDLHVCQUFoQixFQUF3QixRQUF4QixFQUFrQyxDQUM5QjtBQUNJRCxJQUFBQSxJQUFJLEVBQUUsaUJBRFY7QUFFSUUsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FEOEIsQ0FBbEM7QUFPQSw4QkFBZ0JELHdCQUFPRixTQUF2QixFQUFrQyxrQkFBbEMsRUFBc0QsQ0FDbEQ7QUFDSUMsSUFBQUEsSUFBSSxFQUFFLE9BRFY7QUFFSUUsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FEa0QsRUFLbEQ7QUFDSUYsSUFBQUEsSUFBSSxFQUFFLE9BRFY7QUFFSUUsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FMa0QsRUFTbEQ7QUFDSUYsSUFBQUEsSUFBSSxFQUFFLFNBRFY7QUFFSUUsSUFBQUEsT0FBTyxFQUFFO0FBRmIsR0FUa0QsQ0FBdEQ7QUFlQTs7Ozs7QUFLQUMsMEJBQVNDLGVBQVQsR0FBMkJILHVCQUEzQjs7QUFDQUksU0FBR0MsYUFBSCxDQUFpQkwsdUJBQWpCLEVBQXlCLG9CQUF6QjtBQUNBOzs7Ozs7QUFLQUUsMEJBQVNJLGNBQVQsR0FBMEJDLHFCQUExQjs7QUFDQUgsU0FBR0MsYUFBSCxDQUFpQkUscUJBQWpCLEVBQXdCLG1CQUF4QjtBQUNBOzs7Ozs7QUFLQUwsMEJBQVNNLHlCQUFULEdBQXFDQywyQ0FBckM7O0FBQ0FMLFNBQUdDLGFBQUgsQ0FBaUJJLDJDQUFqQixFQUFtQyw4QkFBbkM7QUFDQTs7Ozs7O0FBS0FQLDBCQUFTUSxvQkFBVCxHQUFnQ0MsaUNBQWhDOztBQUNBUCxTQUFHQyxhQUFILENBQWlCTSxpQ0FBakIsRUFBOEIseUJBQTlCO0FBQ0E7Ozs7OztBQUtBVCwwQkFBU1Usa0JBQVQsR0FBOEJDLDZCQUE5Qjs7QUFDQVQsU0FBR0MsYUFBSCxDQUFpQlEsNkJBQWpCLEVBQTRCLHVCQUE1QjtBQUNBOzs7Ozs7QUFLQVgsMEJBQVNZLGNBQVQsR0FBMEJqQiwwQkFBMUI7O0FBQ0FPLFNBQUdDLGFBQUgsQ0FBaUJSLDBCQUFqQixFQUErQixtQkFBL0I7QUFDQTs7Ozs7O0FBS0FLLDBCQUFTYSxzQkFBVCxHQUFrQ0Msd0NBQWxDOztBQUNBWixTQUFHQyxhQUFILENBQWlCVyx3Q0FBakIsRUFBc0MsMkJBQXRDO0FBQ0E7Ozs7OztBQUtBZCwwQkFBU2UsaUJBQVQsR0FBNkJDLHlDQUE3Qjs7QUFDQWQsU0FBR0MsYUFBSCxDQUFpQmEseUNBQWpCLEVBQWtDLHNCQUFsQztBQUNBOzs7Ozs7QUFLQWhCLDBCQUFTaUIsNkJBQVQsR0FBeUNDLGtEQUF6Qzs7QUFDQWhCLFNBQUdDLGFBQUgsQ0FBaUJlLGtEQUFqQixFQUEyQyxrQ0FBM0MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb21wb25lbnRcclxuICovXHJcblxyXG5pbXBvcnQgeyByZW1vdmVQcm9wZXJ0eSwgcmVwbGFjZVByb3BlcnR5IH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBNZXNoUmVuZGVyZXIgfSBmcm9tICcuL21lc2gtcmVuZGVyZXInO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tICcuL2NhbWVyYS1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBMaWdodCB9IGZyb20gJy4vbGlnaHQtY29tcG9uZW50JztcclxuaW1wb3J0IHsgU3BvdExpZ2h0IH0gZnJvbSAnLi9zcG90LWxpZ2h0LWNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFNwaGVyZUxpZ2h0IH0gZnJvbSAnLi9zcGhlcmUtbGlnaHQtY29tcG9uZW50JztcclxuaW1wb3J0IHsgRGlyZWN0aW9uYWxMaWdodCB9IGZyb20gJy4vZGlyZWN0aW9uYWwtbGlnaHQtY29tcG9uZW50JztcclxuaW1wb3J0IHsgU2tpbm5lZE1lc2hSZW5kZXJlciB9IGZyb20gJy4vc2tpbm5lZC1tZXNoLXJlbmRlcmVyJztcclxuaW1wb3J0IHsgU2tpbm5lZE1lc2hCYXRjaFJlbmRlcmVyLCBTa2lubmVkTWVzaFVuaXQgfSBmcm9tICcuL3NraW5uZWQtbWVzaC1iYXRjaC1yZW5kZXJlcic7XHJcbmltcG9ydCB7IGpzIH0gZnJvbSAnLi4vLi4vdXRpbHMvanMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbnJlbW92ZVByb3BlcnR5KE1lc2hSZW5kZXJlci5wcm90b3R5cGUsICdNZXNoUmVuZGVyZXIucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdlbmFibGVEeW5hbWljQmF0Y2hpbmcnLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAncmVjaWV2ZVNoYWRvd3MnLFxyXG4gICAgfSxcclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoQ2FtZXJhLCAnQ2FtZXJhJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdDYW1lcmFDbGVhckZsYWcnLFxyXG4gICAgICAgIG5ld05hbWU6ICdDbGVhckZsYWcnXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVwbGFjZVByb3BlcnR5KENhbWVyYS5wcm90b3R5cGUsICdDYW1lcmEucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjb2xvcicsXHJcbiAgICAgICAgbmV3TmFtZTogJ2NsZWFyQ29sb3InLFxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnZGVwdGgnLFxyXG4gICAgICAgIG5ld05hbWU6ICdjbGVhckRlcHRoJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3N0ZW5jaWwnLFxyXG4gICAgICAgIG5ld05hbWU6ICdjbGVhclN0ZW5jaWwnLFxyXG4gICAgfSxcclxuXSk7XHJcblxyXG4vKipcclxuICogQWxpYXMgb2YgW1tDYW1lcmFdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBDYW1lcmEgYXMgQ2FtZXJhQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLkNhbWVyYUNvbXBvbmVudCA9IENhbWVyYTtcclxuanMuc2V0Q2xhc3NBbGlhcyhDYW1lcmEsICdjYy5DYW1lcmFDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbTGlnaHRdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBMaWdodCBhcyBMaWdodENvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5MaWdodENvbXBvbmVudCA9IExpZ2h0O1xyXG5qcy5zZXRDbGFzc0FsaWFzKExpZ2h0LCAnY2MuTGlnaHRDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbRGlyZWN0aW9uYWxMaWdodF1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IERpcmVjdGlvbmFsTGlnaHQgYXMgRGlyZWN0aW9uYWxMaWdodENvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5EaXJlY3Rpb25hbExpZ2h0Q29tcG9uZW50ID0gRGlyZWN0aW9uYWxMaWdodDtcclxuanMuc2V0Q2xhc3NBbGlhcyhEaXJlY3Rpb25hbExpZ2h0LCAnY2MuRGlyZWN0aW9uYWxMaWdodENvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tTcGhlcmVMaWdodF1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFNwaGVyZUxpZ2h0IGFzIFNwaGVyZUxpZ2h0Q29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlNwaGVyZUxpZ2h0Q29tcG9uZW50ID0gU3BoZXJlTGlnaHQ7XHJcbmpzLnNldENsYXNzQWxpYXMoU3BoZXJlTGlnaHQsICdjYy5TcGhlcmVMaWdodENvbXBvbmVudCcpO1xyXG4vKipcclxuICogQWxpYXMgb2YgW1tTcG90TGlnaHRdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBTcG90TGlnaHQgYXMgU3BvdExpZ2h0Q29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLlNwb3RMaWdodENvbXBvbmVudCA9IFNwb3RMaWdodDtcclxuanMuc2V0Q2xhc3NBbGlhcyhTcG90TGlnaHQsICdjYy5TcG90TGlnaHRDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbTWVzaFJlbmRlcmVyXV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgTWVzaFJlbmRlcmVyIGFzIE1vZGVsQ29tcG9uZW50IH07XHJcbmxlZ2FjeUNDLk1vZGVsQ29tcG9uZW50ID0gTWVzaFJlbmRlcmVyO1xyXG5qcy5zZXRDbGFzc0FsaWFzKE1lc2hSZW5kZXJlciwgJ2NjLk1vZGVsQ29tcG9uZW50Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1NraW5uZWRNZXNoUmVuZGVyZXJdXVxyXG4gKiBAZGVwcmVjYXRlZCBTaW5jZSB2MS4yXHJcbiAqL1xyXG5leHBvcnQgeyBTa2lubmVkTWVzaFJlbmRlcmVyIGFzIFNraW5uaW5nTW9kZWxDb21wb25lbnQgfTtcclxubGVnYWN5Q0MuU2tpbm5pbmdNb2RlbENvbXBvbmVudCA9IFNraW5uZWRNZXNoUmVuZGVyZXI7XHJcbmpzLnNldENsYXNzQWxpYXMoU2tpbm5lZE1lc2hSZW5kZXJlciwgJ2NjLlNraW5uaW5nTW9kZWxDb21wb25lbnQnKTtcclxuLyoqXHJcbiAqIEFsaWFzIG9mIFtbU2tpbm5lZE1lc2hVbml0XV1cclxuICogQGRlcHJlY2F0ZWQgU2luY2UgdjEuMlxyXG4gKi9cclxuZXhwb3J0IHsgU2tpbm5lZE1lc2hVbml0IGFzIFNraW5uaW5nTW9kZWxVbml0IH07XHJcbmxlZ2FjeUNDLlNraW5uaW5nTW9kZWxVbml0ID0gU2tpbm5lZE1lc2hVbml0O1xyXG5qcy5zZXRDbGFzc0FsaWFzKFNraW5uZWRNZXNoVW5pdCwgJ2NjLlNraW5uaW5nTW9kZWxVbml0Jyk7XHJcbi8qKlxyXG4gKiBBbGlhcyBvZiBbW1NraW5uZWRNZXNoQmF0Y2hSZW5kZXJlcl1dXHJcbiAqIEBkZXByZWNhdGVkIFNpbmNlIHYxLjJcclxuICovXHJcbmV4cG9ydCB7IFNraW5uZWRNZXNoQmF0Y2hSZW5kZXJlciBhcyBCYXRjaGVkU2tpbm5pbmdNb2RlbENvbXBvbmVudCB9O1xyXG5sZWdhY3lDQy5CYXRjaGVkU2tpbm5pbmdNb2RlbENvbXBvbmVudCA9IFNraW5uZWRNZXNoQmF0Y2hSZW5kZXJlcjtcclxuanMuc2V0Q2xhc3NBbGlhcyhTa2lubmVkTWVzaEJhdGNoUmVuZGVyZXIsICdjYy5CYXRjaGVkU2tpbm5pbmdNb2RlbENvbXBvbmVudCcpO1xyXG4iXX0=