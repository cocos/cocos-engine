(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "../default-constants.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("../default-constants.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.defaultConstants, global.globalExports);
    global.find = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _defaultConstants, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.find = find;

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
   * @category scene-graph
   */

  /**
   * @en Finds a node by hierarchy path, the path is case-sensitive.
   * It will traverse the hierarchy by splitting the path using '/' character.
   * This function will still returns the node even if it is inactive.
   * It is recommended to not use this function every frame instead cache the result at startup.
   * @zh 通过路径从节点树中查找节点的方法，路径是大小写敏感的，并且通过 `/` 来分隔节点层级。
   * 即使节点的状态是未启用的也可以找到，建议将结果缓存，而不是每次需要都去查找。
   * @param path The path of the target node
   * @param referenceNode If given, the search will be limited in the sub node tree of the reference node
   */
  function find(path, referenceNode) {
    if (!referenceNode) {
      var scene = _globalExports.legacyCC.director.getScene();

      if (!scene) {
        if (_defaultConstants.DEV) {
          (0, _debug.warnID)(5601);
        }

        return null;
      } else if (_defaultConstants.DEV && !scene.isValid) {
        (0, _debug.warnID)(5602);
        return null;
      }

      referenceNode = scene;
    } else if (_defaultConstants.DEV && !referenceNode.isValid) {
      (0, _debug.warnID)(5603);
      return null;
    }

    return referenceNode.getChildByPath(path);
  }

  _globalExports.legacyCC.find = find;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvZmluZC50cyJdLCJuYW1lcyI6WyJmaW5kIiwicGF0aCIsInJlZmVyZW5jZU5vZGUiLCJzY2VuZSIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJnZXRTY2VuZSIsIkRFViIsImlzVmFsaWQiLCJnZXRDaGlsZEJ5UGF0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7OztBQVNBOzs7Ozs7Ozs7O0FBVU8sV0FBU0EsSUFBVCxDQUFlQyxJQUFmLEVBQTZCQyxhQUE3QixFQUFnRTtBQUNuRSxRQUFJLENBQUNBLGFBQUwsRUFBb0I7QUFDaEIsVUFBTUMsS0FBSyxHQUFHQyx3QkFBU0MsUUFBVCxDQUFrQkMsUUFBbEIsRUFBZDs7QUFDQSxVQUFJLENBQUNILEtBQUwsRUFBWTtBQUNSLFlBQUlJLHFCQUFKLEVBQVM7QUFDTCw2QkFBTyxJQUFQO0FBQ0g7O0FBQ0QsZUFBTyxJQUFQO0FBQ0gsT0FMRCxNQUtPLElBQUlBLHlCQUFPLENBQUNKLEtBQUssQ0FBQ0ssT0FBbEIsRUFBMkI7QUFDOUIsMkJBQU8sSUFBUDtBQUNBLGVBQU8sSUFBUDtBQUNIOztBQUNETixNQUFBQSxhQUFhLEdBQUdDLEtBQWhCO0FBQ0gsS0FaRCxNQVlPLElBQUlJLHlCQUFPLENBQUNMLGFBQWEsQ0FBQ00sT0FBMUIsRUFBbUM7QUFDdEMseUJBQU8sSUFBUDtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUNELFdBQU9OLGFBQWEsQ0FBRU8sY0FBZixDQUE4QlIsSUFBOUIsQ0FBUDtBQUNIOztBQUVERywwQkFBU0osSUFBVCxHQUFnQkEsSUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IHNjZW5lLWdyYXBoXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgd2FybklEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi9ub2RlJztcclxuaW1wb3J0IHsgREVWIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi9nbG9iYWwtZXhwb3J0cyc7XHJcblxyXG4vKipcclxuICogQGVuIEZpbmRzIGEgbm9kZSBieSBoaWVyYXJjaHkgcGF0aCwgdGhlIHBhdGggaXMgY2FzZS1zZW5zaXRpdmUuXHJcbiAqIEl0IHdpbGwgdHJhdmVyc2UgdGhlIGhpZXJhcmNoeSBieSBzcGxpdHRpbmcgdGhlIHBhdGggdXNpbmcgJy8nIGNoYXJhY3Rlci5cclxuICogVGhpcyBmdW5jdGlvbiB3aWxsIHN0aWxsIHJldHVybnMgdGhlIG5vZGUgZXZlbiBpZiBpdCBpcyBpbmFjdGl2ZS5cclxuICogSXQgaXMgcmVjb21tZW5kZWQgdG8gbm90IHVzZSB0aGlzIGZ1bmN0aW9uIGV2ZXJ5IGZyYW1lIGluc3RlYWQgY2FjaGUgdGhlIHJlc3VsdCBhdCBzdGFydHVwLlxyXG4gKiBAemgg6YCa6L+H6Lev5b6E5LuO6IqC54K55qCR5Lit5p+l5om+6IqC54K555qE5pa55rOV77yM6Lev5b6E5piv5aSn5bCP5YaZ5pWP5oSf55qE77yM5bm25LiU6YCa6L+HIGAvYCDmnaXliIbpmpToioLngrnlsYLnuqfjgIJcclxuICog5Y2z5L2/6IqC54K555qE54q25oCB5piv5pyq5ZCv55So55qE5Lmf5Y+v5Lul5om+5Yiw77yM5bu66K6u5bCG57uT5p6c57yT5a2Y77yM6ICM5LiN5piv5q+P5qyh6ZyA6KaB6YO95Y675p+l5om+44CCXHJcbiAqIEBwYXJhbSBwYXRoIFRoZSBwYXRoIG9mIHRoZSB0YXJnZXQgbm9kZVxyXG4gKiBAcGFyYW0gcmVmZXJlbmNlTm9kZSBJZiBnaXZlbiwgdGhlIHNlYXJjaCB3aWxsIGJlIGxpbWl0ZWQgaW4gdGhlIHN1YiBub2RlIHRyZWUgb2YgdGhlIHJlZmVyZW5jZSBub2RlXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZmluZCAocGF0aDogc3RyaW5nLCByZWZlcmVuY2VOb2RlPzogTm9kZSk6IE5vZGUgfCBudWxsIHtcclxuICAgIGlmICghcmVmZXJlbmNlTm9kZSkge1xyXG4gICAgICAgIGNvbnN0IHNjZW5lID0gbGVnYWN5Q0MuZGlyZWN0b3IuZ2V0U2NlbmUoKTtcclxuICAgICAgICBpZiAoIXNjZW5lKSB7XHJcbiAgICAgICAgICAgIGlmIChERVYpIHtcclxuICAgICAgICAgICAgICAgIHdhcm5JRCg1NjAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9IGVsc2UgaWYgKERFViAmJiAhc2NlbmUuaXNWYWxpZCkge1xyXG4gICAgICAgICAgICB3YXJuSUQoNTYwMik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZWZlcmVuY2VOb2RlID0gc2NlbmU7XHJcbiAgICB9IGVsc2UgaWYgKERFViAmJiAhcmVmZXJlbmNlTm9kZS5pc1ZhbGlkKSB7XHJcbiAgICAgICAgd2FybklEKDU2MDMpO1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlZmVyZW5jZU5vZGUhLmdldENoaWxkQnlQYXRoKHBhdGgpO1xyXG59XHJcblxyXG5sZWdhY3lDQy5maW5kID0gZmluZDtcclxuIl19