(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.transformUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getPathFromRoot = getPathFromRoot;
  _exports.getWorldTransformUntilRoot = getWorldTransformUntilRoot;

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
   * @category animation
   */
  var m4_1 = new _index.Mat4();

  function getPathFromRoot(target, root) {
    var node = target;
    var path = '';

    while (node !== null && node !== root) {
      path = "".concat(node.name, "/").concat(path);
      node = node.parent;
    }

    return path.slice(0, -1);
  }

  function getWorldTransformUntilRoot(target, root, outMatrix) {
    _index.Mat4.identity(outMatrix);

    while (target !== root) {
      _index.Mat4.fromRTS(m4_1, target.rotation, target.position, target.scale);

      _index.Mat4.multiply(outMatrix, m4_1, outMatrix);

      target = target.parent;
    }

    return outMatrix;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL3RyYW5zZm9ybS11dGlscy50cyJdLCJuYW1lcyI6WyJtNF8xIiwiTWF0NCIsImdldFBhdGhGcm9tUm9vdCIsInRhcmdldCIsInJvb3QiLCJub2RlIiwicGF0aCIsIm5hbWUiLCJwYXJlbnQiLCJzbGljZSIsImdldFdvcmxkVHJhbnNmb3JtVW50aWxSb290Iiwib3V0TWF0cml4IiwiaWRlbnRpdHkiLCJmcm9tUlRTIiwicm90YXRpb24iLCJwb3NpdGlvbiIsInNjYWxlIiwibXVsdGlwbHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBOzs7QUFPQSxNQUFNQSxJQUFJLEdBQUcsSUFBSUMsV0FBSixFQUFiOztBQUVPLFdBQVNDLGVBQVQsQ0FBMEJDLE1BQTFCLEVBQStDQyxJQUEvQyxFQUEyRDtBQUM5RCxRQUFJQyxJQUFpQixHQUFHRixNQUF4QjtBQUNBLFFBQUlHLElBQUksR0FBRyxFQUFYOztBQUNBLFdBQU9ELElBQUksS0FBSyxJQUFULElBQWlCQSxJQUFJLEtBQUtELElBQWpDLEVBQXVDO0FBQ25DRSxNQUFBQSxJQUFJLGFBQU1ELElBQUksQ0FBQ0UsSUFBWCxjQUFtQkQsSUFBbkIsQ0FBSjtBQUNBRCxNQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ0csTUFBWjtBQUNIOztBQUNELFdBQU9GLElBQUksQ0FBQ0csS0FBTCxDQUFXLENBQVgsRUFBYyxDQUFDLENBQWYsQ0FBUDtBQUNIOztBQUVNLFdBQVNDLDBCQUFULENBQXFDUCxNQUFyQyxFQUFtREMsSUFBbkQsRUFBK0RPLFNBQS9ELEVBQWdGO0FBQ25GVixnQkFBS1csUUFBTCxDQUFjRCxTQUFkOztBQUNBLFdBQU9SLE1BQU0sS0FBS0MsSUFBbEIsRUFBd0I7QUFDcEJILGtCQUFLWSxPQUFMLENBQWFiLElBQWIsRUFBbUJHLE1BQU0sQ0FBQ1csUUFBMUIsRUFBb0NYLE1BQU0sQ0FBQ1ksUUFBM0MsRUFBcURaLE1BQU0sQ0FBQ2EsS0FBNUQ7O0FBQ0FmLGtCQUFLZ0IsUUFBTCxDQUFjTixTQUFkLEVBQXlCWCxJQUF6QixFQUErQlcsU0FBL0I7O0FBQ0FSLE1BQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDSyxNQUFoQjtBQUNIOztBQUNELFdBQU9HLFNBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgYW5pbWF0aW9uXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0NCB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vc2NlbmUtZ3JhcGgnO1xyXG5cclxuY29uc3QgbTRfMSA9IG5ldyBNYXQ0KCk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aEZyb21Sb290ICh0YXJnZXQ6IE5vZGUgfCBudWxsLCByb290OiBOb2RlKSB7XHJcbiAgICBsZXQgbm9kZTogTm9kZSB8IG51bGwgPSB0YXJnZXQ7XHJcbiAgICBsZXQgcGF0aCA9ICcnO1xyXG4gICAgd2hpbGUgKG5vZGUgIT09IG51bGwgJiYgbm9kZSAhPT0gcm9vdCkge1xyXG4gICAgICAgIHBhdGggPSBgJHtub2RlLm5hbWV9LyR7cGF0aH1gO1xyXG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudDtcclxuICAgIH1cclxuICAgIHJldHVybiBwYXRoLnNsaWNlKDAsIC0xKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmxkVHJhbnNmb3JtVW50aWxSb290ICh0YXJnZXQ6IE5vZGUsIHJvb3Q6IE5vZGUsIG91dE1hdHJpeDogTWF0NCkge1xyXG4gICAgTWF0NC5pZGVudGl0eShvdXRNYXRyaXgpO1xyXG4gICAgd2hpbGUgKHRhcmdldCAhPT0gcm9vdCkge1xyXG4gICAgICAgIE1hdDQuZnJvbVJUUyhtNF8xLCB0YXJnZXQucm90YXRpb24sIHRhcmdldC5wb3NpdGlvbiwgdGFyZ2V0LnNjYWxlKTtcclxuICAgICAgICBNYXQ0Lm11bHRpcGx5KG91dE1hdHJpeCwgbTRfMSwgb3V0TWF0cml4KTtcclxuICAgICAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50ITtcclxuICAgIH1cclxuICAgIHJldHVybiBvdXRNYXRyaXg7XHJcbn1cclxuIl19