(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils/deprecated.js", "./math/index.js", "./scheduler.js", "./platform/event-manager/events.js", "./global-exports.js", "./renderer/scene/submodel.js", "./gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils/deprecated.js"), require("./math/index.js"), require("./scheduler.js"), require("./platform/event-manager/events.js"), require("./global-exports.js"), require("./renderer/scene/submodel.js"), require("./gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.deprecated, global.index, global.scheduler, global.events, global.globalExports, global.submodel, global.index);
    global.deprecated = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _deprecated, math, _scheduler, _events, _globalExports, _submodel, _index2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.vmath = void 0;
  math = _interopRequireWildcard(math);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * @hidden
   */
  // VMATH
  var vmath = {};
  _exports.vmath = vmath;
  (0, _deprecated.replaceProperty)(vmath, 'vmath', [{
    name: 'vec2',
    newName: 'Vec2',
    target: math,
    targetName: 'math'
  }, {
    name: 'vec3',
    newName: 'Vec3',
    target: math,
    targetName: 'math'
  }, {
    name: 'vec4',
    newName: 'Vec4',
    target: math,
    targetName: 'math'
  }, {
    name: 'quat',
    newName: 'Quat',
    target: math,
    targetName: 'math'
  }, {
    name: 'mat3',
    newName: 'Mat3',
    target: math,
    targetName: 'math'
  }, {
    name: 'mat4',
    newName: 'Mat4',
    target: math,
    targetName: 'math'
  }, {
    name: 'color4',
    newName: 'Color',
    target: math,
    targetName: 'math'
  }, {
    name: 'rect',
    newName: 'Rect',
    target: math,
    targetName: 'math'
  }, {
    name: 'approx',
    newName: 'approx',
    target: math,
    targetName: 'math'
  }, {
    name: 'EPSILON',
    newName: 'EPSILON',
    target: math,
    targetName: 'math'
  }, {
    name: 'equals',
    newName: 'equals',
    target: math,
    targetName: 'math'
  }, {
    name: 'clamp',
    newName: 'clamp',
    target: math,
    targetName: 'math'
  }, {
    name: 'clamp01',
    newName: 'clamp01',
    target: math,
    targetName: 'math'
  }, {
    name: 'lerp',
    newName: 'lerp',
    target: math,
    targetName: 'math'
  }, {
    name: 'toRadian',
    newName: 'toRadian',
    target: math,
    targetName: 'math'
  }, {
    name: 'toDegree',
    newName: 'toDegree',
    target: math,
    targetName: 'math'
  }, {
    name: 'random',
    newName: 'random',
    target: math,
    targetName: 'math'
  }, {
    name: 'randomRange',
    newName: 'randomRange',
    target: math,
    targetName: 'math'
  }, {
    name: 'randomRangeInt',
    newName: 'randomRangeInt',
    target: math,
    targetName: 'math'
  }, {
    name: 'pseudoRandom',
    newName: 'pseudoRandom',
    target: math,
    targetName: 'math'
  }, {
    name: 'pseudoRandomRangeInt',
    newName: 'pseudoRandomRangeInt',
    target: math,
    targetName: 'math'
  }, {
    name: 'nextPow2',
    newName: 'nextPow2',
    target: math,
    targetName: 'math'
  }, {
    name: 'repeat',
    newName: 'repeat',
    target: math,
    targetName: 'math'
  }, {
    name: 'pingPong',
    newName: 'pingPong',
    target: math,
    targetName: 'math'
  }, {
    name: 'inverseLerp',
    newName: 'inverseLerp',
    target: math,
    targetName: 'math'
  }]);
  _globalExports.legacyCC.vmath = vmath;
  // Scheduler
  (0, _deprecated.replaceProperty)(_scheduler.Scheduler.prototype, 'Scheduler.prototype', [{
    name: 'enableForTarget',
    newName: 'enableForTarget',
    target: _scheduler.Scheduler,
    targetName: 'Scheduler'
  }]); // Events

  (0, _deprecated.replaceProperty)(_events.EventTouch.prototype, 'EventTouch.prototype', [{
    name: 'getUILocationInView',
    newName: 'getLocationInView',
    target: _events.EventTouch,
    targetName: 'EventTouch'
  }]);
  (0, _deprecated.replaceProperty)(_globalExports.legacyCC, 'cc', [{
    name: 'GFXDynamicState',
    newName: 'GFXDynamicStateFlagBit'
  }, {
    name: 'GFXBindingType',
    newName: 'GFXDescriptorType'
  }, {
    name: 'GFXBindingLayout',
    newName: 'GFXDescriptorSet'
  }]);
  (0, _deprecated.removeProperty)(_index2.GFXCommandBuffer.prototype, 'GFXCommandBuffer.prototype', [{
    name: 'bindBindingLayout',
    suggest: 'Use `bindDescriptorSet` instead'
  }]);
  (0, _deprecated.replaceProperty)(_submodel.SubModel.prototype, 'SubModel.prototype', [{
    name: 'subMeshData',
    newName: 'subMesh'
  }]);
  (0, _deprecated.removeProperty)(_submodel.SubModel.prototype, 'SubModel.prototype', [{
    name: 'getSubModel',
    suggest: 'Use `subModels[i]` instead'
  }, {
    name: 'subModelNum',
    suggest: 'Use `subModels.length` instead'
  }]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGVwcmVjYXRlZC50cyJdLCJuYW1lcyI6WyJ2bWF0aCIsIm5hbWUiLCJuZXdOYW1lIiwidGFyZ2V0IiwibWF0aCIsInRhcmdldE5hbWUiLCJsZWdhY3lDQyIsIlNjaGVkdWxlciIsInByb3RvdHlwZSIsIkV2ZW50VG91Y2giLCJHRlhDb21tYW5kQnVmZmVyIiwic3VnZ2VzdCIsIlN1Yk1vZGVsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztBQVlBO0FBRUEsTUFBTUEsS0FBSyxHQUFHLEVBQWQ7O0FBQ0EsbUNBQWdCQSxLQUFoQixFQUF1QixPQUF2QixFQUFnQyxDQUM1QjtBQUNJQyxJQUFBQSxJQUFJLEVBQUUsTUFEVjtBQUVJQyxJQUFBQSxPQUFPLEVBQUUsTUFGYjtBQUdJQyxJQUFBQSxNQUFNLEVBQUVDLElBSFo7QUFJSUMsSUFBQUEsVUFBVSxFQUFFO0FBSmhCLEdBRDRCLEVBTzVCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxNQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxNQUZiO0FBR0lDLElBQUFBLE1BQU0sRUFBRUMsSUFIWjtBQUlJQyxJQUFBQSxVQUFVLEVBQUU7QUFKaEIsR0FQNEIsRUFhNUI7QUFDSUosSUFBQUEsSUFBSSxFQUFFLE1BRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFLE1BRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFQyxJQUhaO0FBSUlDLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQWI0QixFQW1CNUI7QUFDSUosSUFBQUEsSUFBSSxFQUFFLE1BRFY7QUFFSUMsSUFBQUEsT0FBTyxFQUFFLE1BRmI7QUFHSUMsSUFBQUEsTUFBTSxFQUFFQyxJQUhaO0FBSUlDLElBQUFBLFVBQVUsRUFBRTtBQUpoQixHQW5CNEIsRUF5QjVCO0FBQ0lKLElBQUFBLElBQUksRUFBRSxNQURWO0FBRUlDLElBQUFBLE9BQU8sRUFBRSxNQUZiO0FBR0lD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Q0FBekQiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IHJlcGxhY2VQcm9wZXJ0eSwgcmVtb3ZlUHJvcGVydHkgfSBmcm9tICcuL3V0aWxzL2RlcHJlY2F0ZWQnO1xyXG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4vbWF0aCc7XHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vc2NoZWR1bGVyJztcclxuaW1wb3J0IHsgRXZlbnRUb3VjaCB9IGZyb20gJy4vcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9ldmVudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBTdWJNb2RlbCB9IGZyb20gJy4vcmVuZGVyZXIvc2NlbmUvc3VibW9kZWwnO1xyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi9nZngnO1xyXG5cclxuLy8gVk1BVEhcclxuXHJcbmNvbnN0IHZtYXRoID0ge307XHJcbnJlcGxhY2VQcm9wZXJ0eSh2bWF0aCwgJ3ZtYXRoJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICd2ZWMyJyxcclxuICAgICAgICBuZXdOYW1lOiAnVmVjMicsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAndmVjMycsXHJcbiAgICAgICAgbmV3TmFtZTogJ1ZlYzMnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3ZlYzQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdWZWM0JyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdxdWF0JyxcclxuICAgICAgICBuZXdOYW1lOiAnUXVhdCcsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnbWF0MycsXHJcbiAgICAgICAgbmV3TmFtZTogJ01hdDMnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sICAgIHtcclxuICAgICAgICBuYW1lOiAnbWF0NCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ01hdDQnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2NvbG9yNCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ0NvbG9yJyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdyZWN0JyxcclxuICAgICAgICBuZXdOYW1lOiAnUmVjdCcsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnYXBwcm94JyxcclxuICAgICAgICBuZXdOYW1lOiAnYXBwcm94JyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdFUFNJTE9OJyxcclxuICAgICAgICBuZXdOYW1lOiAnRVBTSUxPTicsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnZXF1YWxzJyxcclxuICAgICAgICBuZXdOYW1lOiAnZXF1YWxzJyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjbGFtcCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ2NsYW1wJyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdjbGFtcDAxJyxcclxuICAgICAgICBuZXdOYW1lOiAnY2xhbXAwMScsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnbGVycCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ2xlcnAnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3RvUmFkaWFuJyxcclxuICAgICAgICBuZXdOYW1lOiAndG9SYWRpYW4nLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3RvRGVncmVlJyxcclxuICAgICAgICBuZXdOYW1lOiAndG9EZWdyZWUnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdyYW5kb20nLFxyXG4gICAgICAgIG5ld05hbWU6ICdyYW5kb20nLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JhbmRvbVJhbmdlJyxcclxuICAgICAgICBuZXdOYW1lOiAncmFuZG9tUmFuZ2UnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3JhbmRvbVJhbmdlSW50JyxcclxuICAgICAgICBuZXdOYW1lOiAncmFuZG9tUmFuZ2VJbnQnLFxyXG4gICAgICAgIHRhcmdldDogbWF0aCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnbWF0aCdcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3BzZXVkb1JhbmRvbScsXHJcbiAgICAgICAgbmV3TmFtZTogJ3BzZXVkb1JhbmRvbScsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAncHNldWRvUmFuZG9tUmFuZ2VJbnQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdwc2V1ZG9SYW5kb21SYW5nZUludCcsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnbmV4dFBvdzInLFxyXG4gICAgICAgIG5ld05hbWU6ICduZXh0UG93MicsXHJcbiAgICAgICAgdGFyZ2V0OiBtYXRoLFxyXG4gICAgICAgIHRhcmdldE5hbWU6ICdtYXRoJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAncmVwZWF0JyxcclxuICAgICAgICBuZXdOYW1lOiAncmVwZWF0JyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdwaW5nUG9uZycsXHJcbiAgICAgICAgbmV3TmFtZTogJ3BpbmdQb25nJyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdpbnZlcnNlTGVycCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ2ludmVyc2VMZXJwJyxcclxuICAgICAgICB0YXJnZXQ6IG1hdGgsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ21hdGgnXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbmxlZ2FjeUNDLnZtYXRoID0gdm1hdGg7XHJcblxyXG5leHBvcnQgeyB2bWF0aCB9O1xyXG5cclxuLy8gU2NoZWR1bGVyXHJcblxyXG5yZXBsYWNlUHJvcGVydHkoU2NoZWR1bGVyLnByb3RvdHlwZSwgJ1NjaGVkdWxlci5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2VuYWJsZUZvclRhcmdldCcsXHJcbiAgICAgICAgbmV3TmFtZTogJ2VuYWJsZUZvclRhcmdldCcsXHJcbiAgICAgICAgdGFyZ2V0OiBTY2hlZHVsZXIsXHJcbiAgICAgICAgdGFyZ2V0TmFtZTogJ1NjaGVkdWxlcidcclxuICAgIH1cclxuXSk7XHJcblxyXG4vLyBFdmVudHNcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShFdmVudFRvdWNoLnByb3RvdHlwZSwgJ0V2ZW50VG91Y2gucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdnZXRVSUxvY2F0aW9uSW5WaWV3JyxcclxuICAgICAgICBuZXdOYW1lOiAnZ2V0TG9jYXRpb25JblZpZXcnLFxyXG4gICAgICAgIHRhcmdldDogRXZlbnRUb3VjaCxcclxuICAgICAgICB0YXJnZXROYW1lOiAnRXZlbnRUb3VjaCdcclxuICAgIH1cclxuXSk7XHJcblxyXG5yZXBsYWNlUHJvcGVydHkobGVnYWN5Q0MsICdjYycsIFtcclxuICAgIHtcclxuICAgICAgICBuYW1lOiAnR0ZYRHluYW1pY1N0YXRlJyxcclxuICAgICAgICBuZXdOYW1lOiAnR0ZYRHluYW1pY1N0YXRlRmxhZ0JpdCcsXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdHRlhCaW5kaW5nVHlwZScsXHJcbiAgICAgICAgbmV3TmFtZTogJ0dGWERlc2NyaXB0b3JUeXBlJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ0dGWEJpbmRpbmdMYXlvdXQnLFxyXG4gICAgICAgIG5ld05hbWU6ICdHRlhEZXNjcmlwdG9yU2V0JyxcclxuICAgIH0sXHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoR0ZYQ29tbWFuZEJ1ZmZlci5wcm90b3R5cGUsICAnR0ZYQ29tbWFuZEJ1ZmZlci5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ2JpbmRCaW5kaW5nTGF5b3V0JyxcclxuICAgICAgICBzdWdnZXN0OiAnVXNlIGBiaW5kRGVzY3JpcHRvclNldGAgaW5zdGVhZCcsXHJcbiAgICB9LFxyXG5dKTtcclxuXHJcbnJlcGxhY2VQcm9wZXJ0eShTdWJNb2RlbC5wcm90b3R5cGUsICdTdWJNb2RlbC5wcm90b3R5cGUnLCBbXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3N1Yk1lc2hEYXRhJyxcclxuICAgICAgICBuZXdOYW1lOiAnc3ViTWVzaCcsXHJcbiAgICB9XHJcbl0pO1xyXG5cclxucmVtb3ZlUHJvcGVydHkoU3ViTW9kZWwucHJvdG90eXBlLCAnU3ViTW9kZWwucHJvdG90eXBlJywgW1xyXG4gICAge1xyXG4gICAgICAgIG5hbWU6ICdnZXRTdWJNb2RlbCcsXHJcbiAgICAgICAgc3VnZ2VzdDogJ1VzZSBgc3ViTW9kZWxzW2ldYCBpbnN0ZWFkJyxcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgbmFtZTogJ3N1Yk1vZGVsTnVtJyxcclxuICAgICAgICBzdWdnZXN0OiAnVXNlIGBzdWJNb2RlbHMubGVuZ3RoYCBpbnN0ZWFkJyxcclxuICAgIH0sXHJcbl0pO1xyXG4iXX0=