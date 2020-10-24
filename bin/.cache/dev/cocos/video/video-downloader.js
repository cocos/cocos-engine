(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/platform/debug.js", "../core/platform/sys.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/platform/debug.js"), require("../core/platform/sys.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.sys);
    global.videoDownloader = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _sys) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.downloadVideo = downloadVideo;

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
   * @category loader
   */
  var __videoSupport = _sys.sys.__videoSupport;
  var formatSupport = __videoSupport && __videoSupport.format;

  function downloadVideo(item, callback) {
    if (!formatSupport || formatSupport.length === 0) {
      return new Error((0, _debug.getError)(7703));
    }

    var video = document.createElement('video');
    var source = document.createElement('source');
    video.appendChild(source);
    var req = new XMLHttpRequest();
    req.open('GET', item.url, true);
    req.responseType = 'blob';

    req.onload = function () {
      if (this.status === 200) {
        source.src = URL.createObjectURL(this.response);
        callback(null, video);
      }
    };

    req.onerror = function () {
      var message = 'load video failure - ' + item.url;
      (0, _debug.log)(message);
      callback(message);
    };

    req.send();
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3ZpZGVvL3ZpZGVvLWRvd25sb2FkZXIudHMiXSwibmFtZXMiOlsiX192aWRlb1N1cHBvcnQiLCJzeXMiLCJmb3JtYXRTdXBwb3J0IiwiZm9ybWF0IiwiZG93bmxvYWRWaWRlbyIsIml0ZW0iLCJjYWxsYmFjayIsImxlbmd0aCIsIkVycm9yIiwidmlkZW8iLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJzb3VyY2UiLCJhcHBlbmRDaGlsZCIsInJlcSIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInVybCIsInJlc3BvbnNlVHlwZSIsIm9ubG9hZCIsInN0YXR1cyIsInNyYyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsInJlc3BvbnNlIiwib25lcnJvciIsIm1lc3NhZ2UiLCJzZW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBT0EsTUFBTUEsY0FBYyxHQUFHQyxTQUFJRCxjQUEzQjtBQUNBLE1BQU1FLGFBQWEsR0FBR0YsY0FBYyxJQUFJQSxjQUFjLENBQUNHLE1BQXZEOztBQUVPLFdBQVNDLGFBQVQsQ0FBd0JDLElBQXhCLEVBQThCQyxRQUE5QixFQUF3QztBQUMzQyxRQUFJLENBQUNKLGFBQUQsSUFBa0JBLGFBQWEsQ0FBQ0ssTUFBZCxLQUF5QixDQUEvQyxFQUFrRDtBQUM5QyxhQUFPLElBQUlDLEtBQUosQ0FBVSxxQkFBUyxJQUFULENBQVYsQ0FBUDtBQUNIOztBQUNELFFBQU1DLEtBQUssR0FBR0MsUUFBUSxDQUFDQyxhQUFULENBQXVCLE9BQXZCLENBQWQ7QUFDQSxRQUFNQyxNQUFNLEdBQUdGLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFmO0FBQ0FGLElBQUFBLEtBQUssQ0FBQ0ksV0FBTixDQUFrQkQsTUFBbEI7QUFFQSxRQUFNRSxHQUFHLEdBQUcsSUFBSUMsY0FBSixFQUFaO0FBQ0FELElBQUFBLEdBQUcsQ0FBQ0UsSUFBSixDQUFTLEtBQVQsRUFBZ0JYLElBQUksQ0FBQ1ksR0FBckIsRUFBMEIsSUFBMUI7QUFDQUgsSUFBQUEsR0FBRyxDQUFDSSxZQUFKLEdBQW1CLE1BQW5COztBQUNBSixJQUFBQSxHQUFHLENBQUNLLE1BQUosR0FBYSxZQUFZO0FBQ3JCLFVBQUksS0FBS0MsTUFBTCxLQUFnQixHQUFwQixFQUF5QjtBQUNyQlIsUUFBQUEsTUFBTSxDQUFDUyxHQUFQLEdBQWFDLEdBQUcsQ0FBQ0MsZUFBSixDQUFvQixLQUFLQyxRQUF6QixDQUFiO0FBQ0FsQixRQUFBQSxRQUFRLENBQUMsSUFBRCxFQUFPRyxLQUFQLENBQVI7QUFDSDtBQUNKLEtBTEQ7O0FBTUFLLElBQUFBLEdBQUcsQ0FBQ1csT0FBSixHQUFjLFlBQVk7QUFDdEIsVUFBTUMsT0FBTyxHQUFHLDBCQUEwQnJCLElBQUksQ0FBQ1ksR0FBL0M7QUFDQSxzQkFBSVMsT0FBSjtBQUNBcEIsTUFBQUEsUUFBUSxDQUFDb0IsT0FBRCxDQUFSO0FBQ0gsS0FKRDs7QUFLQVosSUFBQUEsR0FBRyxDQUFDYSxJQUFKO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDEzLTIwMTYgQ2h1a29uZyBUZWNobm9sb2dpZXMgSW5jLlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiAqL1xyXG4vKipcclxuICogQGNhdGVnb3J5IGxvYWRlclxyXG4gKi9cclxuXHJcbmltcG9ydCB7Z2V0RXJyb3IsIGxvZ30gZnJvbSAnLi4vY29yZS9wbGF0Zm9ybS9kZWJ1Zyc7XHJcbmltcG9ydCB7IHN5cyB9IGZyb20gJy4uL2NvcmUvcGxhdGZvcm0vc3lzJztcclxuXHJcbmNvbnN0IF9fdmlkZW9TdXBwb3J0ID0gc3lzLl9fdmlkZW9TdXBwb3J0O1xyXG5jb25zdCBmb3JtYXRTdXBwb3J0ID0gX192aWRlb1N1cHBvcnQgJiYgX192aWRlb1N1cHBvcnQuZm9ybWF0O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRvd25sb2FkVmlkZW8gKGl0ZW0sIGNhbGxiYWNrKSB7XHJcbiAgICBpZiAoIWZvcm1hdFN1cHBvcnQgfHwgZm9ybWF0U3VwcG9ydC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICByZXR1cm4gbmV3IEVycm9yKGdldEVycm9yKDc3MDMpKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHZpZGVvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKTtcclxuICAgIGNvbnN0IHNvdXJjZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NvdXJjZScpO1xyXG4gICAgdmlkZW8uYXBwZW5kQ2hpbGQoc291cmNlKTtcclxuXHJcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgIHJlcS5vcGVuKCdHRVQnLCBpdGVtLnVybCwgdHJ1ZSk7XHJcbiAgICByZXEucmVzcG9uc2VUeXBlID0gJ2Jsb2InO1xyXG4gICAgcmVxLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0dXMgPT09IDIwMCkge1xyXG4gICAgICAgICAgICBzb3VyY2Uuc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTCh0aGlzLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCwgdmlkZW8pO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICByZXEub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zdCBtZXNzYWdlID0gJ2xvYWQgdmlkZW8gZmFpbHVyZSAtICcgKyBpdGVtLnVybDtcclxuICAgICAgICBsb2cobWVzc2FnZSk7XHJcbiAgICAgICAgY2FsbGJhY2sobWVzc2FnZSk7XHJcbiAgICB9O1xyXG4gICAgcmVxLnNlbmQoKTtcclxufVxyXG4iXX0=