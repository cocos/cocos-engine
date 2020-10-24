(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/core/gfx/webgl2/webgl2-device.js", "../cocos/core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/core/gfx/webgl2/webgl2-device.js"), require("../cocos/core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webgl2Device, global.globalExports);
    global.gfxWebgl2 = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _webgl2Device, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "WebGL2Device", {
    enumerable: true,
    get: function () {
      return _webgl2Device.WebGL2Device;
    }
  });

  /**
   * @hidden
   */
  _globalExports.legacyCC.WebGL2Device = _webgl2Device.WebGL2Device;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvZ2Z4LXdlYmdsMi50cyJdLCJuYW1lcyI6WyJsZWdhY3lDQyIsIldlYkdMMkRldmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFPQUEsMEJBQVNDLFlBQVQsR0FBd0JBLDBCQUF4QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgV2ViR0wyRGV2aWNlIH0gZnJvbSAnLi4vY29jb3MvY29yZS9nZngvd2ViZ2wyL3dlYmdsMi1kZXZpY2UnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2NvY29zL2NvcmUvZ2xvYmFsLWV4cG9ydHMnO1xyXG5leHBvcnQgeyBXZWJHTDJEZXZpY2UgfTtcclxubGVnYWN5Q0MuV2ViR0wyRGV2aWNlID0gV2ViR0wyRGV2aWNlO1xyXG4iXX0=