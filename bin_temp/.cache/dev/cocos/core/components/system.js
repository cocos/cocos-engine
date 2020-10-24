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
    global.system = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /*
   Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.
  
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
  var System = /*#__PURE__*/function () {
    function System() {
      _classCallCheck(this, System);

      this._id = '';
      this._priority = 0;
      this._executeInEditMode = false;
    }

    _createClass(System, [{
      key: "init",
      value: function init() {}
    }, {
      key: "update",
      value: function update(dt) {}
    }, {
      key: "postUpdate",
      value: function postUpdate(dt) {}
    }, {
      key: "priority",
      set: function set(value) {
        this._priority = value;
      },
      get: function get() {
        return this._priority;
      }
    }, {
      key: "id",
      set: function set(id) {
        this._id = id;
      },
      get: function get() {
        return this._id;
      }
    }], [{
      key: "sortByPriority",
      value: function sortByPriority(a, b) {
        if (a._priority < b._priority) {
          return 1;
        } else if (a._priority > b.priority) {
          return -1;
        } else {
          return 0;
        }
      }
    }]);

    return System;
  }();

  _exports.default = System;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvY29tcG9uZW50cy9zeXN0ZW0udHMiXSwibmFtZXMiOlsiU3lzdGVtIiwiX2lkIiwiX3ByaW9yaXR5IiwiX2V4ZWN1dGVJbkVkaXRNb2RlIiwiZHQiLCJ2YWx1ZSIsImlkIiwiYSIsImIiLCJwcmlvcml0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O01BTXFCQSxNOzs7O1dBQ1BDLEcsR0FBTSxFO1dBQ05DLFMsR0FBWSxDO1dBQ1pDLGtCLEdBQXFCLEs7Ozs7OzZCQTRCdkIsQ0FBRTs7OzZCQUNGQyxFLEVBQVksQ0FBRTs7O2lDQUNWQSxFLEVBQVksQ0FBRTs7O3dCQTVCWkMsSyxFQUFjO0FBQ3hCLGFBQUtILFNBQUwsR0FBaUJHLEtBQWpCO0FBQ0gsTzswQkFDc0I7QUFDbkIsZUFBTyxLQUFLSCxTQUFaO0FBQ0g7Ozt3QkFFT0ksRSxFQUFXO0FBQ2YsYUFBS0wsR0FBTCxHQUFXSyxFQUFYO0FBQ0gsTzswQkFDZ0I7QUFDYixlQUFPLEtBQUtMLEdBQVo7QUFDSDs7O3FDQUU2Qk0sQyxFQUFXQyxDLEVBQVc7QUFDaEQsWUFBSUQsQ0FBQyxDQUFDTCxTQUFGLEdBQWNNLENBQUMsQ0FBQ04sU0FBcEIsRUFBK0I7QUFDM0IsaUJBQU8sQ0FBUDtBQUNILFNBRkQsTUFHSyxJQUFJSyxDQUFDLENBQUNMLFNBQUYsR0FBY00sQ0FBQyxDQUFDQyxRQUFwQixFQUE4QjtBQUMvQixpQkFBTyxDQUFDLENBQVI7QUFDSCxTQUZJLE1BR0E7QUFDRCxpQkFBTyxDQUFQO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTkgWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IElTY2hlZHVsYWJsZSB9IGZyb20gXCIuLi9zY2hlZHVsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN5c3RlbSBpbXBsZW1lbnRzIElTY2hlZHVsYWJsZSB7XHJcbiAgICBwcm90ZWN0ZWQgX2lkID0gJyc7XHJcbiAgICBwcm90ZWN0ZWQgX3ByaW9yaXR5ID0gMDtcclxuICAgIHByb3RlY3RlZCBfZXhlY3V0ZUluRWRpdE1vZGUgPSBmYWxzZTtcclxuXHJcbiAgICBzZXQgcHJpb3JpdHkgKHZhbHVlOm51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3ByaW9yaXR5ID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBnZXQgcHJpb3JpdHkgKCk6bnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcHJpb3JpdHk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGlkIChpZDpzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9pZCA9IGlkO1xyXG4gICAgfVxyXG4gICAgZ2V0IGlkICgpOnN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgc29ydEJ5UHJpb3JpdHkgKGE6IFN5c3RlbSwgYjogU3lzdGVtKSB7XHJcbiAgICAgICAgaWYgKGEuX3ByaW9yaXR5IDwgYi5fcHJpb3JpdHkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGEuX3ByaW9yaXR5ID4gYi5wcmlvcml0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdCAoKSB7fVxyXG4gICAgdXBkYXRlIChkdDogbnVtYmVyKSB7fVxyXG4gICAgcG9zdFVwZGF0ZSAoZHQ6IG51bWJlcikge31cclxufSJdfQ==