(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./enums.js", "./distance.js", "./intersect.js", "./line.js", "./plane.js", "./ray.js", "./triangle.js", "./sphere.js", "./aabb.js", "./obb.js", "./capsule.js", "./frustum.js", "./curve.js", "./spec.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./enums.js"), require("./distance.js"), require("./intersect.js"), require("./line.js"), require("./plane.js"), require("./ray.js"), require("./triangle.js"), require("./sphere.js"), require("./aabb.js"), require("./obb.js"), require("./capsule.js"), require("./frustum.js"), require("./curve.js"), require("./spec.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.enums, global.distance, global.intersect, global.line, global.plane, global.ray, global.triangle, global.sphere, global.aabb, global.obb, global.capsule, global.frustum, global.curve, global.spec, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _enums, distance, _intersect, _line, _plane, _ray, _triangle, _sphere, _aabb, _obb, _capsule, _frustum, _curve, _spec, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    enums: true,
    distance: true,
    intersect: true,
    line: true,
    plane: true,
    ray: true,
    triangle: true,
    sphere: true,
    aabb: true,
    obb: true,
    capsule: true,
    frustum: true,
    Keyframe: true,
    AnimationCurve: true
  };
  Object.defineProperty(_exports, "enums", {
    enumerable: true,
    get: function () {
      return _enums.default;
    }
  });
  Object.defineProperty(_exports, "intersect", {
    enumerable: true,
    get: function () {
      return _intersect.default;
    }
  });
  Object.defineProperty(_exports, "line", {
    enumerable: true,
    get: function () {
      return _line.default;
    }
  });
  Object.defineProperty(_exports, "plane", {
    enumerable: true,
    get: function () {
      return _plane.default;
    }
  });
  Object.defineProperty(_exports, "ray", {
    enumerable: true,
    get: function () {
      return _ray.default;
    }
  });
  Object.defineProperty(_exports, "triangle", {
    enumerable: true,
    get: function () {
      return _triangle.default;
    }
  });
  Object.defineProperty(_exports, "sphere", {
    enumerable: true,
    get: function () {
      return _sphere.default;
    }
  });
  Object.defineProperty(_exports, "aabb", {
    enumerable: true,
    get: function () {
      return _aabb.default;
    }
  });
  Object.defineProperty(_exports, "obb", {
    enumerable: true,
    get: function () {
      return _obb.default;
    }
  });
  Object.defineProperty(_exports, "capsule", {
    enumerable: true,
    get: function () {
      return _capsule.capsule;
    }
  });
  Object.defineProperty(_exports, "frustum", {
    enumerable: true,
    get: function () {
      return _frustum.frustum;
    }
  });
  Object.defineProperty(_exports, "Keyframe", {
    enumerable: true,
    get: function () {
      return _curve.Keyframe;
    }
  });
  Object.defineProperty(_exports, "AnimationCurve", {
    enumerable: true,
    get: function () {
      return _curve.AnimationCurve;
    }
  });
  _exports.distance = void 0;
  _enums = _interopRequireDefault(_enums);
  distance = _interopRequireWildcard(distance);
  _exports.distance = distance;
  _intersect = _interopRequireDefault(_intersect);
  _line = _interopRequireDefault(_line);
  _plane = _interopRequireDefault(_plane);
  _ray = _interopRequireDefault(_ray);
  _triangle = _interopRequireDefault(_triangle);
  _sphere = _interopRequireDefault(_sphere);
  _aabb = _interopRequireDefault(_aabb);
  _obb = _interopRequireDefault(_obb);
  Object.keys(_spec).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _spec[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2VvbWV0cnlcclxuICovXHJcblxyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGVudW1zIH0gZnJvbSAnLi9lbnVtcyc7XHJcbmltcG9ydCAqIGFzIGRpc3RhbmNlIGZyb20gJy4vZGlzdGFuY2UnO1xyXG5leHBvcnQgeyBkaXN0YW5jZSB9O1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGludGVyc2VjdCB9IGZyb20gJy4vaW50ZXJzZWN0JztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBsaW5lIH0gZnJvbSAnLi9saW5lJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBwbGFuZSB9IGZyb20gJy4vcGxhbmUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIHJheSB9IGZyb20gJy4vcmF5JztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyB0cmlhbmdsZSB9IGZyb20gJy4vdHJpYW5nbGUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIHNwaGVyZSB9IGZyb20gJy4vc3BoZXJlJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBhYWJiIH0gZnJvbSAnLi9hYWJiJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBvYmIgfSBmcm9tICcuL29iYic7XHJcbmV4cG9ydCB7IGNhcHN1bGUgfSBmcm9tICcuL2NhcHN1bGUnO1xyXG5leHBvcnQgeyBmcnVzdHVtIH0gZnJvbSAnLi9mcnVzdHVtJztcclxuZXhwb3J0IHsgS2V5ZnJhbWUsIEFuaW1hdGlvbkN1cnZlIH0gZnJvbSAnLi9jdXJ2ZSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vc3BlYyc7XHJcblxyXG5pbXBvcnQgJy4vZGVwcmVjYXRlZCc7XHJcbiJdfQ==