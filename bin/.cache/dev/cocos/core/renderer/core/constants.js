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
    global.constants = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PassStage = _exports.RenderQueue = void 0;

  /**
   * @hidden
   */
  var RenderQueue;
  _exports.RenderQueue = RenderQueue;

  (function (RenderQueue) {
    RenderQueue[RenderQueue["OPAQUE"] = 0] = "OPAQUE";
    RenderQueue[RenderQueue["TRANSPARENT"] = 1] = "TRANSPARENT";
    RenderQueue[RenderQueue["OVERLAY"] = 2] = "OVERLAY";
  })(RenderQueue || (_exports.RenderQueue = RenderQueue = {}));

  var PassStage;
  _exports.PassStage = PassStage;

  (function (PassStage) {
    PassStage[PassStage["DEFAULT"] = 1] = "DEFAULT";
    PassStage[PassStage["FORWARD"] = 2] = "FORWARD";
    PassStage[PassStage["SHADOWCAST"] = 4] = "SHADOWCAST";
  })(PassStage || (_exports.PassStage = PassStage = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9jb25zdGFudHMudHMiXSwibmFtZXMiOlsiUmVuZGVyUXVldWUiLCJQYXNzU3RhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7OztNQUlZQSxXOzs7YUFBQUEsVztBQUFBQSxJQUFBQSxXLENBQUFBLFc7QUFBQUEsSUFBQUEsVyxDQUFBQSxXO0FBQUFBLElBQUFBLFcsQ0FBQUEsVztLQUFBQSxXLDRCQUFBQSxXOztNQU1BQyxTOzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztLQUFBQSxTLDBCQUFBQSxTIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5leHBvcnQgZW51bSBSZW5kZXJRdWV1ZSB7XHJcbiAgICBPUEFRVUUgPSAwLFxyXG4gICAgVFJBTlNQQVJFTlQgPSAxLFxyXG4gICAgT1ZFUkxBWSA9IDIsXHJcbn1cclxuXHJcbmV4cG9ydCBlbnVtIFBhc3NTdGFnZSB7XHJcbiAgICBERUZBVUxUID0gMSxcclxuICAgIEZPUldBUkQgPSAyLFxyXG4gICAgU0hBRE9XQ0FTVCA9IDQsXHJcbn1cclxuIl19