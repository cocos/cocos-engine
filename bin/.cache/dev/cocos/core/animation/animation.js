(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./target-path.js", "./value-proxy.js", "./value-proxy-factories/uniform.js", "./value-proxy-factories/morph-weights.js", "./cubic-spline-value.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./target-path.js"), require("./value-proxy.js"), require("./value-proxy-factories/uniform.js"), require("./value-proxy-factories/morph-weights.js"), require("./cubic-spline-value.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.targetPath, global.valueProxy, global.uniform, global.morphWeights, global.cubicSplineValue);
    global.animation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _targetPath, _valueProxy, _uniform, _morphWeights, _cubicSplineValue) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    UniformProxyFactory: true,
    MorphWeightsValueProxy: true,
    MorphWeightsAllValueProxy: true
  };
  Object.defineProperty(_exports, "UniformProxyFactory", {
    enumerable: true,
    get: function () {
      return _uniform.UniformProxyFactory;
    }
  });
  Object.defineProperty(_exports, "MorphWeightsValueProxy", {
    enumerable: true,
    get: function () {
      return _morphWeights.MorphWeightsValueProxy;
    }
  });
  Object.defineProperty(_exports, "MorphWeightsAllValueProxy", {
    enumerable: true,
    get: function () {
      return _morphWeights.MorphWeightsAllValueProxy;
    }
  });
  Object.keys(_targetPath).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _targetPath[key];
      }
    });
  });
  Object.keys(_valueProxy).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _valueProxy[key];
      }
    });
  });
  Object.keys(_cubicSplineValue).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _cubicSplineValue[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2FuaW1hdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUlBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi90YXJnZXQtcGF0aCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdmFsdWUtcHJveHknO1xyXG5leHBvcnQgeyBVbmlmb3JtUHJveHlGYWN0b3J5IH0gZnJvbSAnLi92YWx1ZS1wcm94eS1mYWN0b3JpZXMvdW5pZm9ybSc7XHJcbmV4cG9ydCB7IE1vcnBoV2VpZ2h0c1ZhbHVlUHJveHksIE1vcnBoV2VpZ2h0c0FsbFZhbHVlUHJveHkgfSBmcm9tICcuL3ZhbHVlLXByb3h5LWZhY3Rvcmllcy9tb3JwaC13ZWlnaHRzJztcclxuZXhwb3J0ICogZnJvbSAnLi9jdWJpYy1zcGxpbmUtdmFsdWUnOyJdfQ==