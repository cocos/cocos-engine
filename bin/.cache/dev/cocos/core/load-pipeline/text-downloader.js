(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./utils.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./utils.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.utils, global.globalExports);
    global.textDownloader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _utils, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _default;

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
  function _default(item, callback) {
    var url = item.url;
    url = (0, _utils.urlAppendTimestamp)(url);

    var xhr = _globalExports.legacyCC.loader.getXMLHttpRequest(),
        errInfo = 'Load text file failed: ' + url;

    xhr.open('GET', url, true);
    if (xhr.overrideMimeType) xhr.overrideMimeType('text/plain; charset=utf-8');

    xhr.onload = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200 || xhr.status === 0) {
          callback(null, xhr.responseText);
        } else {
          callback({
            status: xhr.status,
            errorMessage: errInfo + '(wrong status)'
          });
        }
      } else {
        callback({
          status: xhr.status,
          errorMessage: errInfo + '(wrong readyState)'
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbG9hZC1waXBlbGluZS90ZXh0LWRvd25sb2FkZXIudHMiXSwibmFtZXMiOlsiaXRlbSIsImNhbGxiYWNrIiwidXJsIiwieGhyIiwibGVnYWN5Q0MiLCJsb2FkZXIiLCJnZXRYTUxIdHRwUmVxdWVzdCIsImVyckluZm8iLCJvcGVuIiwib3ZlcnJpZGVNaW1lVHlwZSIsIm9ubG9hZCIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJlcnJvck1lc3NhZ2UiLCJvbmVycm9yIiwib250aW1lb3V0Iiwic2VuZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBT2Usb0JBQVVBLElBQVYsRUFBZ0JDLFFBQWhCLEVBQTBCO0FBQ3JDLFFBQUlDLEdBQUcsR0FBR0YsSUFBSSxDQUFDRSxHQUFmO0FBQ0FBLElBQUFBLEdBQUcsR0FBRywrQkFBbUJBLEdBQW5CLENBQU47O0FBRUEsUUFBSUMsR0FBRyxHQUFHQyx3QkFBU0MsTUFBVCxDQUFnQkMsaUJBQWhCLEVBQVY7QUFBQSxRQUNJQyxPQUFPLEdBQUcsNEJBQTRCTCxHQUQxQzs7QUFFQUMsSUFBQUEsR0FBRyxDQUFDSyxJQUFKLENBQVMsS0FBVCxFQUFnQk4sR0FBaEIsRUFBcUIsSUFBckI7QUFDQSxRQUFJQyxHQUFHLENBQUNNLGdCQUFSLEVBQTBCTixHQUFHLENBQUNNLGdCQUFKLENBQXFCLDJCQUFyQjs7QUFDMUJOLElBQUFBLEdBQUcsQ0FBQ08sTUFBSixHQUFhLFlBQVk7QUFDckIsVUFBSVAsR0FBRyxDQUFDUSxVQUFKLEtBQW1CLENBQXZCLEVBQTBCO0FBQ3RCLFlBQUlSLEdBQUcsQ0FBQ1MsTUFBSixLQUFlLEdBQWYsSUFBc0JULEdBQUcsQ0FBQ1MsTUFBSixLQUFlLENBQXpDLEVBQTRDO0FBQ3hDWCxVQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPRSxHQUFHLENBQUNVLFlBQVgsQ0FBUjtBQUNILFNBRkQsTUFHSztBQUNEWixVQUFBQSxRQUFRLENBQUM7QUFBQ1csWUFBQUEsTUFBTSxFQUFFVCxHQUFHLENBQUNTLE1BQWI7QUFBcUJFLFlBQUFBLFlBQVksRUFBRVAsT0FBTyxHQUFHO0FBQTdDLFdBQUQsQ0FBUjtBQUNIO0FBQ0osT0FQRCxNQVFLO0FBQ0ROLFFBQUFBLFFBQVEsQ0FBQztBQUFDVyxVQUFBQSxNQUFNLEVBQUVULEdBQUcsQ0FBQ1MsTUFBYjtBQUFxQkUsVUFBQUEsWUFBWSxFQUFFUCxPQUFPLEdBQUc7QUFBN0MsU0FBRCxDQUFSO0FBQ0g7QUFDSixLQVpEOztBQWFBSixJQUFBQSxHQUFHLENBQUNZLE9BQUosR0FBYyxZQUFVO0FBQ3BCZCxNQUFBQSxRQUFRLENBQUM7QUFBQ1csUUFBQUEsTUFBTSxFQUFFVCxHQUFHLENBQUNTLE1BQWI7QUFBcUJFLFFBQUFBLFlBQVksRUFBRVAsT0FBTyxHQUFHO0FBQTdDLE9BQUQsQ0FBUjtBQUNILEtBRkQ7O0FBR0FKLElBQUFBLEdBQUcsQ0FBQ2EsU0FBSixHQUFnQixZQUFVO0FBQ3RCZixNQUFBQSxRQUFRLENBQUM7QUFBQ1csUUFBQUEsTUFBTSxFQUFFVCxHQUFHLENBQUNTLE1BQWI7QUFBcUJFLFFBQUFBLFlBQVksRUFBRVAsT0FBTyxHQUFHO0FBQTdDLE9BQUQsQ0FBUjtBQUNILEtBRkQ7O0FBR0FKLElBQUFBLEdBQUcsQ0FBQ2MsSUFBSixDQUFTLElBQVQ7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHt1cmxBcHBlbmRUaW1lc3RhbXB9IGZyb20gJy4vdXRpbHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChpdGVtLCBjYWxsYmFjaykge1xyXG4gICAgbGV0IHVybCA9IGl0ZW0udXJsO1xyXG4gICAgdXJsID0gdXJsQXBwZW5kVGltZXN0YW1wKHVybCk7XHJcblxyXG4gICAgbGV0IHhociA9IGxlZ2FjeUNDLmxvYWRlci5nZXRYTUxIdHRwUmVxdWVzdCgpLFxyXG4gICAgICAgIGVyckluZm8gPSAnTG9hZCB0ZXh0IGZpbGUgZmFpbGVkOiAnICsgdXJsO1xyXG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XHJcbiAgICBpZiAoeGhyLm92ZXJyaWRlTWltZVR5cGUpIHhoci5vdmVycmlkZU1pbWVUeXBlKCd0ZXh0L3BsYWluOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xyXG4gICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwIHx8IHhoci5zdGF0dXMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHhoci5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soe3N0YXR1czogeGhyLnN0YXR1cywgZXJyb3JNZXNzYWdlOiBlcnJJbmZvICsgJyh3cm9uZyBzdGF0dXMpJ30pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBjYWxsYmFjayh7c3RhdHVzOiB4aHIuc3RhdHVzLCBlcnJvck1lc3NhZ2U6IGVyckluZm8gKyAnKHdyb25nIHJlYWR5U3RhdGUpJ30pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2FsbGJhY2soe3N0YXR1czogeGhyLnN0YXR1cywgZXJyb3JNZXNzYWdlOiBlcnJJbmZvICsgJyhlcnJvciknfSk7XHJcbiAgICB9O1xyXG4gICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgY2FsbGJhY2soe3N0YXR1czogeGhyLnN0YXR1cywgZXJyb3JNZXNzYWdlOiBlcnJJbmZvICsgJyh0aW1lIG91dCknfSk7XHJcbiAgICB9O1xyXG4gICAgeGhyLnNlbmQobnVsbCk7XHJcbn0iXX0=