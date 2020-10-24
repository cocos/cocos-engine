(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./bitmask.js", "./enum.js", "./value-type.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./bitmask.js"), require("./enum.js"), require("./value-type.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.bitmask, global._enum, global.valueType);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _bitmask, _enum, _valueType) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "BitMask", {
    enumerable: true,
    get: function () {
      return _bitmask.BitMask;
    }
  });
  Object.defineProperty(_exports, "Enum", {
    enumerable: true,
    get: function () {
      return _enum.Enum;
    }
  });
  Object.defineProperty(_exports, "ccenum", {
    enumerable: true,
    get: function () {
      return _enum.ccenum;
    }
  });
  Object.defineProperty(_exports, "ValueType", {
    enumerable: true,
    get: function () {
      return _valueType.ValueType;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=