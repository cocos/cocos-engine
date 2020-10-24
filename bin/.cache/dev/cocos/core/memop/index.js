(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./pool.js", "./recycle-pool.js", "./cached-array.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./pool.js"), require("./recycle-pool.js"), require("./cached-array.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.pool, global.recyclePool, global.cachedArray);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _pool, _recyclePool, _cachedArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_pool).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _pool[key];
      }
    });
  });
  Object.keys(_recyclePool).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _recyclePool[key];
      }
    });
  });
  Object.keys(_cachedArray).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _cachedArray[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWVtb3AvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5leHBvcnQgKiBmcm9tICcuL3Bvb2wnO1xyXG5leHBvcnQgKiBmcm9tICcuL3JlY3ljbGUtcG9vbCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY2FjaGVkLWFycmF5JztcclxuIl19