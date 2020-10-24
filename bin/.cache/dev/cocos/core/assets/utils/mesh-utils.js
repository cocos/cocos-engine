(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.globalExports);
    global.meshUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.postLoadMesh = postLoadMesh;

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
  function postLoadMesh(mesh, callback) {
    if (mesh.loaded) {
      if (callback) {
        callback();
      }

      return;
    }

    if (!mesh.nativeUrl) {
      if (callback) {
        callback();
      }

      return;
    } // load image


    _globalExports.legacyCC.loader.load({
      url: mesh.nativeUrl
    }, function (err, arrayBuffer) {
      if (arrayBuffer) {
        if (!mesh.loaded) {
          mesh._nativeAsset = arrayBuffer;
        }
      }

      if (callback) {
        callback(err);
      }
    });
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYXNzZXRzL3V0aWxzL21lc2gtdXRpbHMudHMiXSwibmFtZXMiOlsicG9zdExvYWRNZXNoIiwibWVzaCIsImNhbGxiYWNrIiwibG9hZGVkIiwibmF0aXZlVXJsIiwibGVnYWN5Q0MiLCJsb2FkZXIiLCJsb2FkIiwidXJsIiwiZXJyIiwiYXJyYXlCdWZmZXIiLCJfbmF0aXZlQXNzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCTyxXQUFTQSxZQUFULENBQXVCQyxJQUF2QixFQUFtQ0MsUUFBbkMsRUFBd0Q7QUFDM0QsUUFBSUQsSUFBSSxDQUFDRSxNQUFULEVBQWlCO0FBQ2IsVUFBSUQsUUFBSixFQUFjO0FBQ1ZBLFFBQUFBLFFBQVE7QUFDWDs7QUFDRDtBQUNIOztBQUNELFFBQUksQ0FBQ0QsSUFBSSxDQUFDRyxTQUFWLEVBQXFCO0FBQ2pCLFVBQUlGLFFBQUosRUFBYztBQUNWQSxRQUFBQSxRQUFRO0FBQ1g7O0FBQ0Q7QUFDSCxLQVowRCxDQWEzRDs7O0FBQ0FHLDRCQUFTQyxNQUFULENBQWdCQyxJQUFoQixDQUFxQjtBQUNqQkMsTUFBQUEsR0FBRyxFQUFFUCxJQUFJLENBQUNHO0FBRE8sS0FBckIsRUFFRyxVQUFDSyxHQUFELEVBQW9CQyxXQUFwQixFQUF3RDtBQUN2RCxVQUFJQSxXQUFKLEVBQWlCO0FBQ2IsWUFBSSxDQUFDVCxJQUFJLENBQUNFLE1BQVYsRUFBa0I7QUFDZEYsVUFBQUEsSUFBSSxDQUFDVSxZQUFMLEdBQW9CRCxXQUFwQjtBQUNIO0FBQ0o7O0FBQ0QsVUFBSVIsUUFBSixFQUFjO0FBQ1ZBLFFBQUFBLFFBQVEsQ0FBQ08sR0FBRCxDQUFSO0FBQ0g7QUFDSixLQVhEO0FBWUgiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi9tZXNoJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmV4cG9ydCBmdW5jdGlvbiBwb3N0TG9hZE1lc2ggKG1lc2g6IE1lc2gsIGNhbGxiYWNrPzogRnVuY3Rpb24pIHtcclxuICAgIGlmIChtZXNoLmxvYWRlZCkge1xyXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAoIW1lc2gubmF0aXZlVXJsKSB7XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIC8vIGxvYWQgaW1hZ2VcclxuICAgIGxlZ2FjeUNDLmxvYWRlci5sb2FkKHtcclxuICAgICAgICB1cmw6IG1lc2gubmF0aXZlVXJsLFxyXG4gICAgfSwgKGVycjogRXJyb3IgfCBudWxsLCBhcnJheUJ1ZmZlcjogQXJyYXlCdWZmZXIgfCBudWxsKSA9PiB7XHJcbiAgICAgICAgaWYgKGFycmF5QnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGlmICghbWVzaC5sb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIG1lc2guX25hdGl2ZUFzc2V0ID0gYXJyYXlCdWZmZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuIl19