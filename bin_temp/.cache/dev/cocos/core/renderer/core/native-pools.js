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
    global.nativePools = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.NativeArrayPool = _exports.NativeObjectPool = _exports.NativeBufferPool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /*
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
   * @hidden
   */
  var NativeBufferPool = /*#__PURE__*/function () {
    function NativeBufferPool(dataType, entryBits, stride) {
      _classCallCheck(this, NativeBufferPool);

      this._arrayBuffers = [];
      this._chunkSize = void 0;
      this._chunkSize = stride * (1 << entryBits);
    }

    _createClass(NativeBufferPool, [{
      key: "allocateNewChunk",
      value: function allocateNewChunk() {
        return new ArrayBuffer(this._chunkSize);
      }
    }]);

    return NativeBufferPool;
  }();

  _exports.NativeBufferPool = NativeBufferPool;

  var NativeObjectPool = function NativeObjectPool(dataType, array) {
    _classCallCheck(this, NativeObjectPool);
  };

  _exports.NativeObjectPool = NativeObjectPool;

  var NativeArrayPool = /*#__PURE__*/function () {
    function NativeArrayPool(poolType, size) {
      _classCallCheck(this, NativeArrayPool);

      this._size = void 0;
      this._size = size;
    }

    _createClass(NativeArrayPool, [{
      key: "alloc",
      value: function alloc(index) {
        return new Uint32Array(this._size);
      }
    }, {
      key: "resize",
      value: function resize(origin, size, handle) {
        var array = new Uint32Array(size);
        array.set(origin);
        return array;
      }
    }]);

    return NativeArrayPool;
  }();

  _exports.NativeArrayPool = NativeArrayPool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9uYXRpdmUtcG9vbHMudHMiXSwibmFtZXMiOlsiTmF0aXZlQnVmZmVyUG9vbCIsImRhdGFUeXBlIiwiZW50cnlCaXRzIiwic3RyaWRlIiwiX2FycmF5QnVmZmVycyIsIl9jaHVua1NpemUiLCJBcnJheUJ1ZmZlciIsIk5hdGl2ZU9iamVjdFBvb2wiLCJhcnJheSIsIk5hdGl2ZUFycmF5UG9vbCIsInBvb2xUeXBlIiwic2l6ZSIsIl9zaXplIiwiaW5kZXgiLCJVaW50MzJBcnJheSIsIm9yaWdpbiIsImhhbmRsZSIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O01BSWFBLGdCO0FBR1QsOEJBQWFDLFFBQWIsRUFBK0JDLFNBQS9CLEVBQWtEQyxNQUFsRCxFQUFrRTtBQUFBOztBQUFBLFdBRjFEQyxhQUUwRCxHQUYzQixFQUUyQjtBQUFBLFdBRDFEQyxVQUMwRDtBQUM5RCxXQUFLQSxVQUFMLEdBQWtCRixNQUFNLElBQUksS0FBS0QsU0FBVCxDQUF4QjtBQUNIOzs7O3lDQUMwQjtBQUFFLGVBQU8sSUFBSUksV0FBSixDQUFnQixLQUFLRCxVQUFyQixDQUFQO0FBQTBDOzs7Ozs7OztNQUc5REUsZ0IsR0FDVCwwQkFBYU4sUUFBYixFQUErQk8sS0FBL0IsRUFBMkM7QUFBQTtBQUFFLEc7Ozs7TUFHcENDLGU7QUFFVCw2QkFBYUMsUUFBYixFQUErQkMsSUFBL0IsRUFBNkM7QUFBQTs7QUFBQSxXQURyQ0MsS0FDcUM7QUFDekMsV0FBS0EsS0FBTCxHQUFhRCxJQUFiO0FBQ0g7Ozs7NEJBRWFFLEssRUFBNkI7QUFDdkMsZUFBTyxJQUFJQyxXQUFKLENBQWdCLEtBQUtGLEtBQXJCLENBQVA7QUFDSDs7OzZCQUVjRyxNLEVBQXFCSixJLEVBQWNLLE0sRUFBOEI7QUFDNUUsWUFBSVIsS0FBSyxHQUFHLElBQUlNLFdBQUosQ0FBZ0JILElBQWhCLENBQVo7QUFDQUgsUUFBQUEsS0FBSyxDQUFDUyxHQUFOLENBQVVGLE1BQVY7QUFDQSxlQUFPUCxLQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVCdWZmZXJQb29sIHtcclxuICAgIHByaXZhdGUgX2FycmF5QnVmZmVyczogQXJyYXlCdWZmZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfY2h1bmtTaXplOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3RvciAoZGF0YVR5cGU6IG51bWJlciwgZW50cnlCaXRzOiBudW1iZXIsIHN0cmlkZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY2h1bmtTaXplID0gc3RyaWRlICogKDEgPDwgZW50cnlCaXRzKTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBhbGxvY2F0ZU5ld0NodW5rICgpIHsgcmV0dXJuIG5ldyBBcnJheUJ1ZmZlcih0aGlzLl9jaHVua1NpemUpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBOYXRpdmVPYmplY3RQb29sPFQ+IHtcclxuICAgIGNvbnN0cnVjdG9yIChkYXRhVHlwZTogbnVtYmVyLCBhcnJheTogVFtdKSB7fVxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTmF0aXZlQXJyYXlQb29sIHtcclxuICAgIHByaXZhdGUgX3NpemU6IG51bWJlcjtcclxuICAgIGNvbnN0cnVjdG9yIChwb29sVHlwZTogbnVtYmVyLCBzaXplOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWxsb2MgKGluZGV4OiBudW1iZXIpIDogVWludDMyQXJyYXkge1xyXG4gICAgICAgIHJldHVybiBuZXcgVWludDMyQXJyYXkodGhpcy5fc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSAob3JpZ2luOiBVaW50MzJBcnJheSwgc2l6ZTogbnVtYmVyLCBoYW5kbGU6IG51bWJlcikgOiBVaW50MzJBcnJheSB7XHJcbiAgICAgICAgbGV0IGFycmF5ID0gbmV3IFVpbnQzMkFycmF5KHNpemUpO1xyXG4gICAgICAgIGFycmF5LnNldChvcmlnaW4pO1xyXG4gICAgICAgIHJldHVybiBhcnJheTtcclxuICAgIH1cclxufVxyXG4iXX0=