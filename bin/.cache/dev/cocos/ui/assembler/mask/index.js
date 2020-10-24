(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./mask-assembler.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./mask-assembler.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.maskAssembler);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _maskAssembler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "mask", {
    enumerable: true,
    get: function () {
      return _maskAssembler.maskAssembler;
    }
  });
  Object.defineProperty(_exports, "maskEnd", {
    enumerable: true,
    get: function () {
      return _maskAssembler.maskEndAssembler;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=