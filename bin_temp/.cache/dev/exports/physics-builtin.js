(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/physics/cocos/instantiate.js", "../cocos/physics/framework/physics-interface.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/physics/cocos/instantiate.js"), require("../cocos/physics/framework/physics-interface.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.instantiate, global.physicsInterface);
    global.physicsBuiltin = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _instantiate, _physicsInterface) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_physicsInterface).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _physicsInterface[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvcGh5c2ljcy1idWlsdGluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICcuLi9jb2Nvcy9waHlzaWNzL2NvY29zL2luc3RhbnRpYXRlJztcclxuZXhwb3J0ICogZnJvbSAnLi4vY29jb3MvcGh5c2ljcy9mcmFtZXdvcmsvcGh5c2ljcy1pbnRlcmZhY2UnO1xyXG4iXX0=