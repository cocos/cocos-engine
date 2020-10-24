(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.binaryDownloader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = downloadBinary;

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
   * @hidden
   */
  function downloadBinary(item, callback) {
    var url = item.url;

    var xhr = _globalExports.legacyCC.loader.getXMLHttpRequest(),
        errInfo = 'Load binary data failed: ' + url + '';

    xhr.open('GET', url, true);
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      var arrayBuffer = xhr.response;

      if (arrayBuffer) {
        // var result = new Uint8Array(arrayBuffer);
        callback(null, arrayBuffer);
      } else {
        callback({
          status: xhr.status,
          errorMessage: errInfo + '(no response)'
        });
      }
    };

    xhr.onerror = function () {
      callback({
        status: xhr.status,
        errorMessage: errInfo + '(error)'
      });
    };

    xhr.ontimeout = function () {
      callback({
        status: xhr.status,
        errorMessage: errInfo + '(time out)'
      });
    };

    xhr.send(null);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS9iaW5hcnktZG93bmxvYWRlci50cyJdLCJuYW1lcyI6WyJkb3dubG9hZEJpbmFyeSIsIml0ZW0iLCJjYWxsYmFjayIsInVybCIsInhociIsImxlZ2FjeUNDIiwibG9hZGVyIiwiZ2V0WE1MSHR0cFJlcXVlc3QiLCJlcnJJbmZvIiwib3BlbiIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsImFycmF5QnVmZmVyIiwicmVzcG9uc2UiLCJzdGF0dXMiLCJlcnJvck1lc3NhZ2UiLCJvbmVycm9yIiwib250aW1lb3V0Iiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkE7OztBQU1lLFdBQVNBLGNBQVQsQ0FBeUJDLElBQXpCLEVBQStCQyxRQUEvQixFQUF5QztBQUNwRCxRQUFJQyxHQUFHLEdBQUdGLElBQUksQ0FBQ0UsR0FBZjs7QUFDQSxRQUFJQyxHQUFHLEdBQUdDLHdCQUFTQyxNQUFULENBQWdCQyxpQkFBaEIsRUFBVjtBQUFBLFFBQ0lDLE9BQU8sR0FBRyw4QkFBOEJMLEdBQTlCLEdBQW9DLEVBRGxEOztBQUVBQyxJQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBUyxLQUFULEVBQWdCTixHQUFoQixFQUFxQixJQUFyQjtBQUNBQyxJQUFBQSxHQUFHLENBQUNNLFlBQUosR0FBbUIsYUFBbkI7O0FBQ0FOLElBQUFBLEdBQUcsQ0FBQ08sTUFBSixHQUFhLFlBQVk7QUFDckIsVUFBSUMsV0FBVyxHQUFHUixHQUFHLENBQUNTLFFBQXRCOztBQUNBLFVBQUlELFdBQUosRUFBaUI7QUFDYjtBQUNBVixRQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPVSxXQUFQLENBQVI7QUFDSCxPQUhELE1BSUs7QUFDRFYsUUFBQUEsUUFBUSxDQUFDO0FBQUNZLFVBQUFBLE1BQU0sRUFBRVYsR0FBRyxDQUFDVSxNQUFiO0FBQXFCQyxVQUFBQSxZQUFZLEVBQUVQLE9BQU8sR0FBRztBQUE3QyxTQUFELENBQVI7QUFDSDtBQUNKLEtBVEQ7O0FBVUFKLElBQUFBLEdBQUcsQ0FBQ1ksT0FBSixHQUFjLFlBQVU7QUFDcEJkLE1BQUFBLFFBQVEsQ0FBQztBQUFDWSxRQUFBQSxNQUFNLEVBQUVWLEdBQUcsQ0FBQ1UsTUFBYjtBQUFxQkMsUUFBQUEsWUFBWSxFQUFFUCxPQUFPLEdBQUc7QUFBN0MsT0FBRCxDQUFSO0FBQ0gsS0FGRDs7QUFHQUosSUFBQUEsR0FBRyxDQUFDYSxTQUFKLEdBQWdCLFlBQVU7QUFDdEJmLE1BQUFBLFFBQVEsQ0FBQztBQUFDWSxRQUFBQSxNQUFNLEVBQUVWLEdBQUcsQ0FBQ1UsTUFBYjtBQUFxQkMsUUFBQUEsWUFBWSxFQUFFUCxPQUFPLEdBQUc7QUFBN0MsT0FBRCxDQUFSO0FBQ0gsS0FGRDs7QUFHQUosSUFBQUEsR0FBRyxDQUFDYyxJQUFKLENBQVMsSUFBVDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGRvd25sb2FkQmluYXJ5IChpdGVtLCBjYWxsYmFjaykge1xyXG4gICAgdmFyIHVybCA9IGl0ZW0udXJsO1xyXG4gICAgdmFyIHhociA9IGxlZ2FjeUNDLmxvYWRlci5nZXRYTUxIdHRwUmVxdWVzdCgpLFxyXG4gICAgICAgIGVyckluZm8gPSAnTG9hZCBiaW5hcnkgZGF0YSBmYWlsZWQ6ICcgKyB1cmwgKyAnJztcclxuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xyXG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IFwiYXJyYXlidWZmZXJcIjtcclxuICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIGFycmF5QnVmZmVyID0geGhyLnJlc3BvbnNlO1xyXG4gICAgICAgIGlmIChhcnJheUJ1ZmZlcikge1xyXG4gICAgICAgICAgICAvLyB2YXIgcmVzdWx0ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsLCBhcnJheUJ1ZmZlcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayh7c3RhdHVzOiB4aHIuc3RhdHVzLCBlcnJvck1lc3NhZ2U6IGVyckluZm8gKyAnKG5vIHJlc3BvbnNlKSd9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNhbGxiYWNrKHtzdGF0dXM6IHhoci5zdGF0dXMsIGVycm9yTWVzc2FnZTogZXJySW5mbyArICcoZXJyb3IpJ30pO1xyXG4gICAgfTtcclxuICAgIHhoci5vbnRpbWVvdXQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgIGNhbGxiYWNrKHtzdGF0dXM6IHhoci5zdGF0dXMsIGVycm9yTWVzc2FnZTogZXJySW5mbyArICcodGltZSBvdXQpJ30pO1xyXG4gICAgfTtcclxuICAgIHhoci5zZW5kKG51bGwpO1xyXG59Il19