(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../cocos/core/gfx/webgl/webgl-device.js", "../cocos/core/global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../cocos/core/gfx/webgl/webgl-device.js"), require("../cocos/core/global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.webglDevice, global.globalExports);
    global.gfxWebgl = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _webglDevice, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "WebGLDevice", {
    enumerable: true,
    get: function () {
      return _webglDevice.WebGLDevice;
    }
  });

  /**
   * @hidden
   */
  _globalExports.legacyCC.WebGLDevice = _webglDevice.WebGLDevice;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2V4cG9ydHMvZ2Z4LXdlYmdsLnRzIl0sIm5hbWVzIjpbImxlZ2FjeUNDIiwiV2ViR0xEZXZpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBT0FBLDBCQUFTQyxXQUFULEdBQXVCQSx3QkFBdkIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFdlYkdMRGV2aWNlIH0gZnJvbSAnLi4vY29jb3MvY29yZS9nZngvd2ViZ2wvd2ViZ2wtZGV2aWNlJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9jb2Nvcy9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuZXhwb3J0IHsgV2ViR0xEZXZpY2UgfTtcclxubGVnYWN5Q0MuV2ViR0xEZXZpY2UgPSBXZWJHTERldmljZTtcclxuIl19