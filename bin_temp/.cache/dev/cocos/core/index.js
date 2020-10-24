(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./global-exports.js", "./geometry/index.js", "./math/index.js", "./memop/index.js", "./value-types/index.js", "./utils/index.js", "./data/index.js", "./event/index.js", "./assets/index.js", "./platform/index.js", "./game.js", "./scheduler.js", "./director.js", "./gfx/index.js", "./pipeline/index.js", "./load-pipeline/index.js", "./scene-graph/index.js", "./components/index.js", "./3d/index.js", "./animation/index.js", "./primitive/index.js", "./utils/profiler/profiler.js", "./splash-screen.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./global-exports.js"), require("./geometry/index.js"), require("./math/index.js"), require("./memop/index.js"), require("./value-types/index.js"), require("./utils/index.js"), require("./data/index.js"), require("./event/index.js"), require("./assets/index.js"), require("./platform/index.js"), require("./game.js"), require("./scheduler.js"), require("./director.js"), require("./gfx/index.js"), require("./pipeline/index.js"), require("./load-pipeline/index.js"), require("./scene-graph/index.js"), require("./components/index.js"), require("./3d/index.js"), require("./animation/index.js"), require("./primitive/index.js"), require("./utils/profiler/profiler.js"), require("./splash-screen.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.game, global.scheduler, global.director, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.index, global.profiler, global.splashScreen, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports, geometry, math, memop, _index4, _index5, _index6, _index7, _index8, _index9, _game, _scheduler, _director, _index10, _index11, _index12, _index13, _index14, _index15, _index16, _index17, _profiler, _splashScreen, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    geometry: true,
    math: true,
    memop: true
  };
  _exports.memop = _exports.math = _exports.geometry = void 0;
  geometry = _interopRequireWildcard(geometry);
  _exports.geometry = geometry;
  math = _interopRequireWildcard(math);
  _exports.math = math;
  Object.keys(math).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return math[key];
      }
    });
  });
  memop = _interopRequireWildcard(memop);
  _exports.memop = memop;
  Object.keys(memop).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return memop[key];
      }
    });
  });
  Object.keys(_index4).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index4[key];
      }
    });
  });
  Object.keys(_index5).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index5[key];
      }
    });
  });
  Object.keys(_index6).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index6[key];
      }
    });
  });
  Object.keys(_index7).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index7[key];
      }
    });
  });
  Object.keys(_index8).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index8[key];
      }
    });
  });
  Object.keys(_index9).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index9[key];
      }
    });
  });
  Object.keys(_game).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _game[key];
      }
    });
  });
  Object.keys(_scheduler).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _scheduler[key];
      }
    });
  });
  Object.keys(_director).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _director[key];
      }
    });
  });
  Object.keys(_index10).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index10[key];
      }
    });
  });
  Object.keys(_index11).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index11[key];
      }
    });
  });
  Object.keys(_index12).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index12[key];
      }
    });
  });
  Object.keys(_index13).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index13[key];
      }
    });
  });
  Object.keys(_index14).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index14[key];
      }
    });
  });
  Object.keys(_index15).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index15[key];
      }
    });
  });
  Object.keys(_index16).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _index16[key];
      }
    });
  });
  Object.keys(_profiler).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _profiler[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /*
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated engine source code (the "Software"), a limited,
    worldwide, royalty-free, non-assignable, revocable and non-exclusive license
   to use Cocos Creator solely to develop games on your target platforms. You shall
    not use Cocos Creator software for developing other software or tools that's
    used for developing games. You are not granted to publish, distribute,
    sublicense, and/or sell copies of Cocos Creator.
  
   The software or tools in this License Agreement are licensed, not sold.
   Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
  */

  /**
   * @category core
   */
  _globalExports.legacyCC.math = math;
  _globalExports.legacyCC.geometry = geometry;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvaW5kZXgudHMiXSwibmFtZXMiOlsibGVnYWN5Q0MiLCJtYXRoIiwiZ2VvbWV0cnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7OztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFHQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7O0FBNURBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBU0FBLDBCQUFTQyxJQUFULEdBQWdCQSxJQUFoQjtBQUNBRCwwQkFBU0UsUUFBVCxHQUFvQkEsUUFBcEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgY29yZVxyXG4gKi9cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmltcG9ydCAqIGFzIGdlb21ldHJ5IGZyb20gJy4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgKiBhcyBtYXRoIGZyb20gJy4vbWF0aCc7XHJcbmltcG9ydCAqIGFzIG1lbW9wIGZyb20gJy4vbWVtb3AnO1xyXG5cclxubGVnYWN5Q0MubWF0aCA9IG1hdGg7XHJcbmxlZ2FjeUNDLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XHJcblxyXG5leHBvcnQgeyBtYXRoLCBtZW1vcCwgZ2VvbWV0cnkgfTtcclxuXHJcbmV4cG9ydCAqIGZyb20gJy4vbWF0aCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vbWVtb3AnO1xyXG5leHBvcnQgKiBmcm9tICcuL3ZhbHVlLXR5cGVzJztcclxuZXhwb3J0ICogZnJvbSAnLi91dGlscyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZGF0YSc7XHJcbmV4cG9ydCAqIGZyb20gJy4vZXZlbnQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2Fzc2V0cyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vcGxhdGZvcm0nO1xyXG5leHBvcnQgKiBmcm9tICcuL2dhbWUnO1xyXG5leHBvcnQgKiBmcm9tICcuL3NjaGVkdWxlcic7XHJcbmV4cG9ydCAqIGZyb20gJy4vZGlyZWN0b3InO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi9nZngnO1xyXG5leHBvcnQgKiBmcm9tICcuL3BpcGVsaW5lJztcclxuZXhwb3J0ICogZnJvbSAnLi9sb2FkLXBpcGVsaW5lJztcclxuZXhwb3J0ICogZnJvbSAnLi9zY2VuZS1ncmFwaCc7XHJcbmV4cG9ydCAqIGZyb20gJy4vY29tcG9uZW50cyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vM2QnO1xyXG5leHBvcnQgKiBmcm9tICcuL2FuaW1hdGlvbic7XHJcbmltcG9ydCAnLi9wcmltaXRpdmUnO1xyXG5cclxuZXhwb3J0ICogZnJvbSAnLi91dGlscy9wcm9maWxlci9wcm9maWxlcic7XHJcblxyXG5pbXBvcnQgJy4vc3BsYXNoLXNjcmVlbic7XHJcbmltcG9ydCAnLi9kZXByZWNhdGVkJztcclxuIl19