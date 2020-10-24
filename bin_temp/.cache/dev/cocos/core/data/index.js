(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./class-decorator.js", "../global-exports.js", "./class.js", "./object.js", "./deserialize.js", "./instantiate.js", "./utils/attribute.js", "./utils/compact-value-type-array.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./class-decorator.js"), require("../global-exports.js"), require("./class.js"), require("./object.js"), require("./deserialize.js"), require("./instantiate.js"), require("./utils/attribute.js"), require("./utils/compact-value-type-array.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.classDecorator, global.globalExports, global._class, global.object, global.deserialize, global.instantiate, global.attribute, global.compactValueTypeArray);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _decorator, _globalExports, _class, _object, _deserialize, _instantiate, _attribute, _compactValueTypeArray) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  Object.defineProperty(_exports, "CCClass", {
    enumerable: true,
    get: function () {
      return _class.CCClass;
    }
  });
  Object.defineProperty(_exports, "CCObject", {
    enumerable: true,
    get: function () {
      return _object.CCObject;
    }
  });
  Object.defineProperty(_exports, "isValid", {
    enumerable: true,
    get: function () {
      return _object.isValid;
    }
  });
  Object.defineProperty(_exports, "deserialize", {
    enumerable: true,
    get: function () {
      return _deserialize.deserialize;
    }
  });
  Object.defineProperty(_exports, "instantiate", {
    enumerable: true,
    get: function () {
      return _instantiate.instantiate;
    }
  });
  Object.defineProperty(_exports, "CCInteger", {
    enumerable: true,
    get: function () {
      return _attribute.CCInteger;
    }
  });
  Object.defineProperty(_exports, "CCFloat", {
    enumerable: true,
    get: function () {
      return _attribute.CCFloat;
    }
  });
  Object.defineProperty(_exports, "CCBoolean", {
    enumerable: true,
    get: function () {
      return _attribute.CCBoolean;
    }
  });
  Object.defineProperty(_exports, "CCString", {
    enumerable: true,
    get: function () {
      return _attribute.CCString;
    }
  });
  Object.defineProperty(_exports, "CompactValueTypeArray", {
    enumerable: true,
    get: function () {
      return _compactValueTypeArray.CompactValueTypeArray;
    }
  });
  _exports._decorator = void 0;
  _decorator = _interopRequireWildcard(_decorator);
  _exports._decorator = _decorator;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /*
   Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
  
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
   * @category core/data
   */
  _globalExports.legacyCC._decorator = _decorator;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS9pbmRleC50cyJdLCJuYW1lcyI6WyJsZWdhY3lDQyIsIl9kZWNvcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7OztBQU1BQSwwQkFBU0MsVUFBVCxHQUFzQkEsVUFBdEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL2RhdGFcclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBfZGVjb3JhdG9yIGZyb20gJy4vY2xhc3MtZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmxlZ2FjeUNDLl9kZWNvcmF0b3IgPSBfZGVjb3JhdG9yO1xyXG5leHBvcnQgeyBfZGVjb3JhdG9yIH07XHJcbmV4cG9ydCB7IENDQ2xhc3MgfSBmcm9tICcuL2NsYXNzJztcclxuZXhwb3J0IHsgQ0NPYmplY3QsIGlzVmFsaWQgfSBmcm9tICcuL29iamVjdCc7XHJcbmV4cG9ydCB7IGRlc2VyaWFsaXplIH0gZnJvbSAnLi9kZXNlcmlhbGl6ZSc7XHJcbmV4cG9ydCB7IGluc3RhbnRpYXRlIH0gZnJvbSAnLi9pbnN0YW50aWF0ZSc7XHJcbmV4cG9ydCB7IENDSW50ZWdlciwgQ0NGbG9hdCwgQ0NCb29sZWFuLCBDQ1N0cmluZ30gZnJvbSAnLi91dGlscy9hdHRyaWJ1dGUnO1xyXG5leHBvcnQgeyBDb21wYWN0VmFsdWVUeXBlQXJyYXkgfSBmcm9tICcuL3V0aWxzL2NvbXBhY3QtdmFsdWUtdHlwZS1hcnJheSc7XHJcbiJdfQ==