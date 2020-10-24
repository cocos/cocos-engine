(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../utils/deprecated.js", "./render-scene.js", "../../scene-graph/layers.js", "../../global-exports.js", "../core/pass.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../utils/deprecated.js"), require("./render-scene.js"), require("../../scene-graph/layers.js"), require("../../global-exports.js"), require("../core/pass.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.deprecated, global.renderScene, global.layers, global.globalExports, global.pass);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _deprecated, _renderScene, _layers, _globalExports, _pass) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.VisibilityFlags = _exports.CameraVisFlags = void 0;
  (0, _deprecated.replaceProperty)(_renderScene.RenderScene.prototype, 'RenderScene.prototype', [{
    'name': 'raycastUI',
    'newName': 'raycastAllCanvas'
  }, {
    'name': 'raycastUI2D',
    'newName': 'raycastAllCanvas'
  }, {
    'name': 'raycast',
    'newName': 'raycastAllModels'
  }, {
    'name': 'raycastModels',
    'newName': 'raycastAllModels'
  }, {
    'name': 'raycastModel',
    'newName': 'raycastSingleModel'
  }]);
  (0, _deprecated.removeProperty)(_renderScene.RenderScene.prototype, 'RenderScene.prototype', [{
    'name': 'raycastUI2DNode'
  }, {
    'name': 'raycastUINode'
  }]);
  (0, _deprecated.markAsWarning)(_renderScene.RenderScene.prototype, 'RenderScene.prototype', [{
    'name': 'raycastAll',
    'suggest': 'using intersect in geometry'
  }, {
    'name': 'raycastAllModels',
    'suggest': 'using intersect in geometry'
  }, {
    'name': 'raycastSingleModel',
    'suggest': 'using intersect in geometry'
  }, {
    'name': 'raycastAllCanvas',
    'suggest': 'using intersect in geometry'
  }, {
    'name': 'rayResultCanvas'
  }, {
    'name': 'rayResultModels'
  }, {
    'name': 'rayResultAll'
  }, {
    'name': 'rayResultSingleModel'
  }]);
  var CameraVisFlags = {};
  _exports.CameraVisFlags = CameraVisFlags;
  (0, _deprecated.removeProperty)(CameraVisFlags, 'CameraVisFlags', [{
    name: 'GENERAL'
  }]);
  (0, _deprecated.replaceProperty)(CameraVisFlags, 'CameraVisFlags', [{
    name: 'PROFILER',
    newName: 'PROFILER',
    target: _layers.Layers.BitMask,
    targetName: 'PROFILER'
  }, {
    name: 'GIZMOS',
    newName: 'GIZMOS',
    target: _layers.Layers.BitMask,
    targetName: 'GIZMOS'
  }, {
    name: 'EDITOR',
    newName: 'EDITOR',
    target: _layers.Layers.BitMask,
    targetName: 'EDITOR'
  }, {
    name: 'UI',
    newName: 'UI',
    target: _layers.Layers.BitMask,
    targetName: 'UI_3D'
  }, {
    name: 'UI2D',
    newName: 'UI2D',
    target: _layers.Layers.BitMask,
    targetName: 'UI_2D'
  }]);
  _globalExports.legacyCC.CameraVisFlags = CameraVisFlags;
  var VisibilityFlags = {};
  _exports.VisibilityFlags = VisibilityFlags;
  (0, _deprecated.removeProperty)(VisibilityFlags, 'VisibilityFlags', [{
    name: 'GENERAL'
  }]);
  (0, _deprecated.replaceProperty)(VisibilityFlags, 'VisibilityFlags', [{
    name: 'ALWALS',
    newName: 'ALWALS',
    target: _layers.Layers.Enum,
    targetName: 'ALWALS'
  }, {
    name: 'PROFILER',
    newName: 'PROFILER',
    target: _layers.Layers.Enum,
    targetName: 'PROFILER'
  }, {
    name: 'GIZMOS',
    newName: 'GIZMOS',
    target: _layers.Layers.Enum,
    targetName: 'GIZMOS'
  }, {
    name: 'EDITOR',
    newName: 'EDITOR',
    target: _layers.Layers.Enum,
    targetName: 'EDITOR'
  }, {
    name: 'UI',
    newName: 'UI',
    target: _layers.Layers.Enum,
    targetName: 'UI_3D'
  }, {
    name: 'UI2D',
    newName: 'UI2D',
    target: _layers.Layers.Enum,
    targetName: 'UI_2D'
  }]);
  _globalExports.legacyCC.VisibilityFlags = VisibilityFlags;
  (0, _deprecated.replaceProperty)(_pass.Pass.prototype, 'Pass.prototype', [{
    name: 'getBindingTypeFromHandle',
    newName: 'getDescriptorTypeFromHandle'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvZGVwcmVjYXRlZC50cyJdLCJuYW1lcyI6WyJSZW5kZXJTY2VuZSIsInByb3RvdHlwZSIsIkNhbWVyYVZpc0ZsYWdzIiwibmFtZSIsIm5ld05hbWUiLCJ0YXJnZXQiLCJMYXllcnMiLCJCaXRNYXNrIiwidGFyZ2V0TmFtZSIsImxlZ2FjeUNDIiwiVmlzaWJpbGl0eUZsYWdzIiwiRW51bSIsIlBhc3MiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFNQSxtQ0FBZ0JBLHlCQUFZQyxTQUE1QixFQUF1Qyx1QkFBdkMsRUFBZ0UsQ0FDNUQ7QUFDSSxZQUFRLFdBRFo7QUFFSSxlQUFXO0FBRmYsR0FENEQsRUFLNUQ7QUFDSSxZQUFRLGFBRFo7QUFFSSxlQUFXO0FBRmYsR0FMNEQsRUFTNUQ7QUFDSSxZQUFRLFNBRFo7QUFFSSxlQUFXO0FBRmYsR0FUNEQsRUFhNUQ7QUFDSSxZQUFRLGVBRFo7QUFFSSxlQUFXO0FBRmYsR0FiNEQsRUFpQjVEO0FBQ0ksWUFBUSxjQURaO0FBRUksZUFBVztBQUZmLEdBakI0RCxDQUFoRTtBQXVCQSxrQ0FBZUQseUJBQVlDLFNBQTNCLEVBQXNDLHVCQUF0QyxFQUErRCxDQUMzRDtBQUNJLFlBQVE7QUFEWixHQUQyRCxFQUkzRDtBQUNJLFlBQVE7QUFEWixHQUoyRCxDQUEvRDtBQVNBLGlDQUFjRCx5QkFBWUMsU0FBMUIsRUFBcUMsdUJBQXJDLEVBQThELENBQzFEO0FBQUUsWUFBUSxZQUFWO0FBQXdCLGVBQVc7QUFBbkMsR0FEMEQsRUFFMUQ7QUFBRSxZQUFRLGtCQUFWO0FBQThCLGVBQVc7QUFBekMsR0FGMEQsRUFHMUQ7QUFBRSxZQUFRLG9CQUFWO0FBQWdDLGVBQVc7QUFBM0MsR0FIMEQsRUFJMUQ7QUFBRSxZQUFRLGtCQUFWO0FBQThCLGVBQVc7QUFBekMsR0FKMEQsRUFLMUQ7QUFBRSxZQUFRO0FBQVYsR0FMMEQsRUFN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QU9LLElBSG5CO0FBSUlILElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQS9CZ0QsQ0FBcEQ7QUF1Q0FDLDBCQUFTQyxlQUFULEdBQTJCQSxlQUEzQjtBQUlBLG1DQUFnQkUsV0FBS1gsU0FBckIsRUFBZ0MsZ0JBQWhDLEVBQWtELENBQzlDO0FBQ0lFLElBQUFBLElBQUksRUFBRSwwQkFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUU7QUFGYixHQUQ4QyxDQUFsRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSwgcmVtb3ZlUHJvcGVydHksIG1hcmtBc1dhcm5pbmcgfSBmcm9tICcuLi8uLi91dGlscy9kZXByZWNhdGVkJztcclxuaW1wb3J0IHsgUmVuZGVyU2NlbmUgfSBmcm9tICcuL3JlbmRlci1zY2VuZSc7XHJcbmltcG9ydCB7IExheWVycyB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL2xheWVycyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBQYXNzIH0gZnJvbSAnLi4vY29yZS9wYXNzJztcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShSZW5kZXJTY2VuZS5wcm90b3R5cGUsICdSZW5kZXJTY2VuZS5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAncmF5Y2FzdFVJJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdyYXljYXN0QWxsQ2FudmFzJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdyYXljYXN0VUkyRCcsXHJcbiAgICAgICAgJ25ld05hbWUnOiAncmF5Y2FzdEFsbENhbnZhcydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAncmF5Y2FzdCcsXHJcbiAgICAgICAgJ25ld05hbWUnOiAncmF5Y2FzdEFsbE1vZGVscydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAncmF5Y2FzdE1vZGVscycsXHJcbiAgICAgICAgJ25ld05hbWUnOiAncmF5Y2FzdEFsbE1vZGVscydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgJ25hbWUnOiAncmF5Y2FzdE1vZGVsJyxcclxuICAgICAgICAnbmV3TmFtZSc6ICdyYXljYXN0U2luZ2xlTW9kZWwnXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbnJlbW92ZVByb3BlcnR5KFJlbmRlclNjZW5lLnByb3RvdHlwZSwgJ1JlbmRlclNjZW5lLnByb3RvdHlwZScsIFtcclxuICAgIHtcclxuICAgICAgICAnbmFtZSc6ICdyYXljYXN0VUkyRE5vZGUnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgICduYW1lJzogJ3JheWNhc3RVSU5vZGUnLFxyXG4gICAgfVxyXG5dKTtcclxuXHJcbm1hcmtBc1dhcm5pbmcoUmVuZGVyU2NlbmUucHJvdG90eXBlLCAnUmVuZGVyU2NlbmUucHJvdG90eXBlJywgW1xyXG4gICAgeyAnbmFtZSc6ICdyYXljYXN0QWxsJywgJ3N1Z2dlc3QnOiAndXNpbmcgaW50ZXJzZWN0IGluIGdlb21ldHJ5JyB9LFxyXG4gICAgeyAnbmFtZSc6ICdyYXljYXN0QWxsTW9kZWxzJywgJ3N1Z2dlc3QnOiAndXNpbmcgaW50ZXJzZWN0IGluIGdlb21ldHJ5JyB9LFxyXG4gICAgeyAnbmFtZSc6ICdyYXljYXN0U2luZ2xlTW9kZWwnLCAnc3VnZ2VzdCc6ICd1c2luZyBpbnRlcnNlY3QgaW4gZ2VvbWV0cnknIH0sXHJcbiAgICB7ICduYW1lJzogJ3JheWNhc3RBbGxDYW52YXMnLCAnc3VnZ2VzdCc6ICd1c2luZyBpbnRlcnNlY3QgaW4gZ2VvbWV0cnknIH0sXHJcbiAgICB7ICduYW1lJzogJ3JheVJlc3VsdENhbnZhcycgfSxcclxuICAgIHsgJ25hbWUnOiAncmF5UmVzdWx0TW9kZWxzJyB9LFxyXG4gICAgeyAnbmFtZSc6ICdyYXlSZXN1bHRBbGwnIH0sXHJcbiAgICB7ICduYW1lJzogJ3JheVJlc3VsdFNpbmdsZU1vZGVsJyB9LFxyXG5dKTtcclxuXHJcbmNvbnN0IENhbWVyYVZpc0ZsYWdzID0ge307XHJcblxyXG5yZW1vdmVQcm9wZXJ0eShDYW1lcmFWaXNGbGFncywgJ0NhbWVyYVZpc0ZsYWdzJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdHRU5FUkFMJyxcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkoQ2FtZXJhVmlzRmxhZ3MsICdDYW1lcmFWaXNGbGFncycsIFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnUFJPRklMRVInLFxyXG4gICAgICAgIG5ld05hbWU6ICdQUk9GSUxFUicsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuQml0TWFzayxcclxuICAgICAgICB0YXJnZXROYW1lOiAnUFJPRklMRVInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdHSVpNT1MnLFxyXG4gICAgICAgIG5ld05hbWU6ICdHSVpNT1MnLFxyXG4gICAgICAgIHRhcmdldDogTGF5ZXJzLkJpdE1hc2ssXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0dJWk1PUydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0VESVRPUicsXHJcbiAgICAgICAgbmV3TmFtZTogJ0VESVRPUicsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuQml0TWFzayxcclxuICAgICAgICB0YXJnZXROYW1lOiAnRURJVE9SJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnVUknLFxyXG4gICAgICAgIG5ld05hbWU6ICdVSScsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuQml0TWFzayxcclxuICAgICAgICB0YXJnZXROYW1lOiAnVUlfM0QnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdVSTJEJyxcclxuICAgICAgICBuZXdOYW1lOiAnVUkyRCcsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuQml0TWFzayxcclxuICAgICAgICB0YXJnZXROYW1lOiAnVUlfMkQnXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbmxlZ2FjeUNDLkNhbWVyYVZpc0ZsYWdzID0gQ2FtZXJhVmlzRmxhZ3M7XHJcblxyXG5leHBvcnQgeyBDYW1lcmFWaXNGbGFncyB9O1xyXG5cclxuY29uc3QgVmlzaWJpbGl0eUZsYWdzID0ge307XHJcblxyXG5yZW1vdmVQcm9wZXJ0eShWaXNpYmlsaXR5RmxhZ3MsICdWaXNpYmlsaXR5RmxhZ3MnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0dFTkVSQUwnLFxyXG4gICAgfVxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShWaXNpYmlsaXR5RmxhZ3MsICdWaXNpYmlsaXR5RmxhZ3MnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0FMV0FMUycsXHJcbiAgICAgICAgbmV3TmFtZTogJ0FMV0FMUycsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnQUxXQUxTJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnUFJPRklMRVInLFxyXG4gICAgICAgIG5ld05hbWU6ICdQUk9GSUxFUicsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnUFJPRklMRVInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdHSVpNT1MnLFxyXG4gICAgICAgIG5ld05hbWU6ICdHSVpNT1MnLFxyXG4gICAgICAgIHRhcmdldDogTGF5ZXJzLkVudW0sXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ0dJWk1PUydcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0VESVRPUicsXHJcbiAgICAgICAgbmV3TmFtZTogJ0VESVRPUicsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnRURJVE9SJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnVUknLFxyXG4gICAgICAgIG5ld05hbWU6ICdVSScsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnVUlfM0QnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdVSTJEJyxcclxuICAgICAgICBuZXdOYW1lOiAnVUkyRCcsXHJcbiAgICAgICAgdGFyZ2V0OiBMYXllcnMuRW51bSxcclxuICAgICAgICB0YXJnZXROYW1lOiAnVUlfMkQnXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbmxlZ2FjeUNDLlZpc2liaWxpdHlGbGFncyA9IFZpc2liaWxpdHlGbGFncztcclxuXHJcbmV4cG9ydCB7IFZpc2liaWxpdHlGbGFncyB9O1xyXG5cclxucmVwbGFjZVByb3BlcnR5KFBhc3MucHJvdG90eXBlLCAnUGFzcy5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2dldEJpbmRpbmdUeXBlRnJvbUhhbmRsZScsXHJcbiAgICAgICAgbmV3TmFtZTogJ2dldERlc2NyaXB0b3JUeXBlRnJvbUhhbmRsZScsXHJcbiAgICB9LFxyXG5dKTtcclxuIl19