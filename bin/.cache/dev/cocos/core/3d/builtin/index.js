(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./init.js", "./effects.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./init.js"), require("./effects.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.init, global.effects);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _init, _effects) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    effects: true
  };
  Object.defineProperty(_exports, "effects", {
    enumerable: true,
    get: function () {
      return _effects.default;
    }
  });
  Object.keys(_init).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _init[key];
      }
    });
  });
  _effects = _interopRequireDefault(_effects);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvYnVpbHRpbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgKiBmcm9tICcuL2luaXQnO1xyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGVmZmVjdHMgfSBmcm9tICcuL2VmZmVjdHMnO1xyXG4iXX0=