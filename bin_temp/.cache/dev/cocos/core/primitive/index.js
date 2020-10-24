(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils.js", "./define.js", "./box.js", "./cone.js", "./cylinder.js", "./plane.js", "./quad.js", "./sphere.js", "./torus.js", "./capsule.js", "./circle.js", "./transform.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils.js"), require("./define.js"), require("./box.js"), require("./cone.js"), require("./cylinder.js"), require("./plane.js"), require("./quad.js"), require("./sphere.js"), require("./torus.js"), require("./capsule.js"), require("./circle.js"), require("./transform.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.define, global.box, global.cone, global.cylinder, global.plane, global.quad, global.sphere, global.torus, global.capsule, global.circle, global.transform);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _define, _box, _cone, _cylinder, _plane, _quad, _sphere, _torus, _capsule, _circle, _transform) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    box: true,
    cone: true,
    cylinder: true,
    plane: true,
    quad: true,
    sphere: true,
    torus: true,
    capsule: true,
    circle: true,
    translate: true,
    scale: true,
    wireframed: true
  };
  Object.defineProperty(_exports, "box", {
    enumerable: true,
    get: function () {
      return _box.default;
    }
  });
  Object.defineProperty(_exports, "cone", {
    enumerable: true,
    get: function () {
      return _cone.default;
    }
  });
  Object.defineProperty(_exports, "cylinder", {
    enumerable: true,
    get: function () {
      return _cylinder.default;
    }
  });
  Object.defineProperty(_exports, "plane", {
    enumerable: true,
    get: function () {
      return _plane.default;
    }
  });
  Object.defineProperty(_exports, "quad", {
    enumerable: true,
    get: function () {
      return _quad.default;
    }
  });
  Object.defineProperty(_exports, "sphere", {
    enumerable: true,
    get: function () {
      return _sphere.default;
    }
  });
  Object.defineProperty(_exports, "torus", {
    enumerable: true,
    get: function () {
      return _torus.default;
    }
  });
  Object.defineProperty(_exports, "capsule", {
    enumerable: true,
    get: function () {
      return _capsule.default;
    }
  });
  Object.defineProperty(_exports, "circle", {
    enumerable: true,
    get: function () {
      return _circle.default;
    }
  });
  Object.defineProperty(_exports, "translate", {
    enumerable: true,
    get: function () {
      return _transform.translate;
    }
  });
  Object.defineProperty(_exports, "scale", {
    enumerable: true,
    get: function () {
      return _transform.scale;
    }
  });
  Object.defineProperty(_exports, "wireframed", {
    enumerable: true,
    get: function () {
      return _transform.wireframed;
    }
  });
  Object.keys(_utils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _utils[key];
      }
    });
  });
  Object.keys(_define).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _define[key];
      }
    });
  });
  _box = _interopRequireDefault(_box);
  _cone = _interopRequireDefault(_cone);
  _cylinder = _interopRequireDefault(_cylinder);
  _plane = _interopRequireDefault(_plane);
  _quad = _interopRequireDefault(_quad);
  _sphere = _interopRequireDefault(_sphere);
  _torus = _interopRequireDefault(_torus);
  _capsule = _interopRequireDefault(_capsule);
  _circle = _interopRequireDefault(_circle);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgM2QvcHJpbWl0aXZlXHJcbiAqL1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi91dGlscyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZGVmaW5lJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBib3ggfSBmcm9tICcuL2JveCc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY29uZSB9IGZyb20gJy4vY29uZSc7XHJcbmV4cG9ydCB7IGRlZmF1bHQgYXMgY3lsaW5kZXIgfSBmcm9tICcuL2N5bGluZGVyJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyBwbGFuZSB9IGZyb20gJy4vcGxhbmUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIHF1YWQgfSBmcm9tICcuL3F1YWQnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIHNwaGVyZSB9IGZyb20gJy4vc3BoZXJlJztcclxuZXhwb3J0IHsgZGVmYXVsdCBhcyB0b3J1cyB9IGZyb20gJy4vdG9ydXMnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNhcHN1bGUgfSBmcm9tICcuL2NhcHN1bGUnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNpcmNsZSB9IGZyb20gJy4vY2lyY2xlJztcclxuZXhwb3J0IHsgdHJhbnNsYXRlLCBzY2FsZSwgd2lyZWZyYW1lZCB9IGZyb20gJy4vdHJhbnNmb3JtJztcclxuIl19