(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./js.js", "./misc.js", "./path.js", "./deprecated.js", "./text-utils.js", "./html-text-parser.js", "./prefab-helper.js", "./batch-utils.js", "./murmurhash2_gc.js", "./coordinates-converts-utils.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./js.js"), require("./misc.js"), require("./path.js"), require("./deprecated.js"), require("./text-utils.js"), require("./html-text-parser.js"), require("./prefab-helper.js"), require("./batch-utils.js"), require("./murmurhash2_gc.js"), require("./coordinates-converts-utils.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.js, global.misc, global.path, global.deprecated, global.textUtils, global.htmlTextParser, global.prefabHelper, global.batchUtils, global.murmurhash2_gc, global.coordinatesConvertsUtils);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, js, misc, path, _deprecated, _textUtils, _htmlTextParser, _prefabHelper, _batchUtils, _murmurhash2_gc, _coordinatesConvertsUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    js: true,
    misc: true,
    path: true
  };
  _exports.path = _exports.misc = _exports.js = void 0;
  js = _interopRequireWildcard(js);
  _exports.js = js;
  misc = _interopRequireWildcard(misc);
  _exports.misc = misc;
  path = _interopRequireWildcard(path);
  _exports.path = path;
  Object.keys(_deprecated).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _deprecated[key];
      }
    });
  });
  Object.keys(_textUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _textUtils[key];
      }
    });
  });
  Object.keys(_htmlTextParser).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _htmlTextParser[key];
      }
    });
  });
  Object.keys(_prefabHelper).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _prefabHelper[key];
      }
    });
  });
  Object.keys(_batchUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _batchUtils[key];
      }
    });
  });
  Object.keys(_murmurhash2_gc).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _murmurhash2_gc[key];
      }
    });
  });
  Object.keys(_coordinatesConvertsUtils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _coordinatesConvertsUtils[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuaW1wb3J0ICogYXMganMgZnJvbSAnLi9qcyc7XHJcblxyXG4vKipcclxuICog5p2C6aG55bel5YW35Ye95pWwXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBtaXNjIGZyb20gJy4vbWlzYyc7XHJcblxyXG4vKipcclxuICog55So5LqO5aSE55CG5paH5Lu25LiO55uu5b2V55qE6Lev5b6E55qE5qih5Z2XXHJcbiAqL1xyXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJy4vcGF0aCc7XHJcblxyXG5leHBvcnQgKiBmcm9tICcuL2RlcHJlY2F0ZWQnO1xyXG5leHBvcnQgKiBmcm9tICcuL3RleHQtdXRpbHMnO1xyXG5leHBvcnQgKiBmcm9tICcuL2h0bWwtdGV4dC1wYXJzZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL3ByZWZhYi1oZWxwZXInO1xyXG5leHBvcnQgKiBmcm9tICcuL2JhdGNoLXV0aWxzJztcclxuZXhwb3J0ICogZnJvbSAnLi9tdXJtdXJoYXNoMl9nYyc7XHJcblxyXG5leHBvcnQge1xyXG4gICAganMsXHJcbiAgICBtaXNjLFxyXG4gICAgcGF0aCxcclxufTtcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vY29vcmRpbmF0ZXMtY29udmVydHMtdXRpbHMnO1xyXG5cclxuLy8gZXhwb3J0IGNvbnN0IGpzID0gY2MuanM7XHJcbi8vIGV4cG9ydCBjb25zdCBwYXRoID0gY2MucGF0aDtcclxuIl19