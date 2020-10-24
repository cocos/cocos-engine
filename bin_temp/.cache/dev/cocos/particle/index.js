(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./billboard.js", "./line.js", "./particle-system.js", "./particle-utils.js", "./animator/curve-range.js", "../core/global-exports.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./billboard.js"), require("./line.js"), require("./particle-system.js"), require("./particle-utils.js"), require("./animator/curve-range.js"), require("../core/global-exports.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.billboard, global.line, global.particleSystem, global.particleUtils, global.curveRange, global.globalExports, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _billboard, _line, _particleSystem, _particleUtils, _curveRange, _globalExports, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    Billboard: true,
    Line: true,
    ParticleSystem: true,
    ParticleUtils: true,
    CurveRange: true
  };
  Object.defineProperty(_exports, "Billboard", {
    enumerable: true,
    get: function () {
      return _billboard.Billboard;
    }
  });
  Object.defineProperty(_exports, "Line", {
    enumerable: true,
    get: function () {
      return _line.Line;
    }
  });
  Object.defineProperty(_exports, "ParticleSystem", {
    enumerable: true,
    get: function () {
      return _particleSystem.ParticleSystem;
    }
  });
  Object.defineProperty(_exports, "ParticleUtils", {
    enumerable: true,
    get: function () {
      return _particleUtils.ParticleUtils;
    }
  });
  Object.defineProperty(_exports, "CurveRange", {
    enumerable: true,
    get: function () {
      return _curveRange.default;
    }
  });
  _curveRange = _interopRequireDefault(_curveRange);
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

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  /**
   * @hidden
   */
  _globalExports.legacyCC.ParticleUtils = _particleUtils.ParticleUtils;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2luZGV4LnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiUGFydGljbGVVdGlscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7QUFuQkE7OztBQXFCQUEsMEJBQVNDLGFBQVQsR0FBeUJBLDRCQUF6QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQmlsbGJvYXJkIH0gZnJvbSAnLi9iaWxsYm9hcmQnO1xyXG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi9saW5lJztcclxuaW1wb3J0IHsgUGFydGljbGVTeXN0ZW0gfSBmcm9tICcuL3BhcnRpY2xlLXN5c3RlbSc7XHJcbmltcG9ydCB7IFBhcnRpY2xlVXRpbHMgfSBmcm9tICcuL3BhcnRpY2xlLXV0aWxzJztcclxuaW1wb3J0IEN1cnZlUmFuZ2UgZnJvbSAnLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG5leHBvcnQge1xyXG4gICAgQmlsbGJvYXJkLFxyXG4gICAgTGluZSxcclxuICAgIFBhcnRpY2xlU3lzdGVtLFxyXG4gICAgUGFydGljbGVVdGlscyxcclxuICAgIEN1cnZlUmFuZ2VcclxufTtcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vZGVwcmVjYXRlZCc7XHJcblxyXG5sZWdhY3lDQy5QYXJ0aWNsZVV0aWxzID0gUGFydGljbGVVdGlscztcclxuIl19