(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/physics/ammo/ammo-instantiated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/physics/ammo/ammo-instantiated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated);
    global.waitForAmmoInstantiation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "default", {
    enumerable: true,
    get: function () {
      return _ammoInstantiated.waitForAmmoInstantiation;
    }
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsInNvdXJjZXNDb250ZW50IjpbXX0=