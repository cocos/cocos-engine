(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./height-field.js", "./terrain.js", "./terrain-asset.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./height-field.js"), require("./terrain.js"), require("./terrain-asset.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.heightField, global.terrain, global.terrainAsset);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _heightField, _terrain, _terrainAsset) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.keys(_heightField).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _heightField[key];
      }
    });
  });
  Object.keys(_terrain).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _terrain[key];
      }
    });
  });
  Object.keys(_terrainAsset).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _terrainAsset[key];
      }
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3RlcnJhaW4vaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2hlaWdodC1maWVsZCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdGVycmFpbic7XHJcbmV4cG9ydCAqIGZyb20gJy4vdGVycmFpbi1hc3NldCc7Il19