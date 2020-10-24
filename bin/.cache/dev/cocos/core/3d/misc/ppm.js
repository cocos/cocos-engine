(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ppm = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.toPPM = toPPM;

  /**
   * save a color buffer to a PPM file
   */
  function toPPM(buffer, w, h) {
    return "P3 ".concat(w, " ").concat(h, " 255\n").concat(buffer.filter(function (e, i) {
      return i % 4 < 3;
    }).toString(), "\n");
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvbWlzYy9wcG0udHMiXSwibmFtZXMiOlsidG9QUE0iLCJidWZmZXIiLCJ3IiwiaCIsImZpbHRlciIsImUiLCJpIiwidG9TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0E7OztBQUdPLFdBQVNBLEtBQVQsQ0FBZ0JDLE1BQWhCLEVBQW9DQyxDQUFwQyxFQUErQ0MsQ0FBL0MsRUFBMEQ7QUFDN0Qsd0JBQWFELENBQWIsY0FBa0JDLENBQWxCLG1CQUE0QkYsTUFBTSxDQUFDRyxNQUFQLENBQWMsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsYUFBVUEsQ0FBQyxHQUFHLENBQUosR0FBUSxDQUFsQjtBQUFBLEtBQWQsRUFBbUNDLFFBQW5DLEVBQTVCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIHNhdmUgYSBjb2xvciBidWZmZXIgdG8gYSBQUE0gZmlsZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHRvUFBNIChidWZmZXI6IFVpbnQ4QXJyYXksIHc6IG51bWJlciwgaDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gYFAzICR7d30gJHtofSAyNTVcXG4ke2J1ZmZlci5maWx0ZXIoKGUsIGkpID0+IGkgJSA0IDwgMykudG9TdHJpbmcoKX1cXG5gO1xyXG59XHJcbiJdfQ==