(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./bits.js", "./vec2.js", "./vec3.js", "./vec4.js", "./quat.js", "./mat3.js", "./mat4.js", "./affine-transform.js", "./size.js", "./rect.js", "./color.js", "./utils.js", "./type-define.js", "./deprecated.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./bits.js"), require("./vec2.js"), require("./vec3.js"), require("./vec4.js"), require("./quat.js"), require("./mat3.js"), require("./mat4.js"), require("./affine-transform.js"), require("./size.js"), require("./rect.js"), require("./color.js"), require("./utils.js"), require("./type-define.js"), require("./deprecated.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.bits, global.vec2, global.vec3, global.vec4, global.quat, global.mat3, global.mat4, global.affineTransform, global.size, global.rect, global.color, global.utils, global.typeDefine, global.deprecated);
    global.index = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, bits, _vec, _vec2, _vec3, _quat, _mat, _mat2, _affineTransform, _size, _rect, _color, _utils, _typeDefine, _deprecated) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  var _exportNames = {
    bits: true,
    Vec2: true,
    v2: true,
    Vec3: true,
    v3: true,
    Vec4: true,
    v4: true,
    Quat: true,
    quat: true,
    Mat3: true,
    Mat4: true,
    mat4: true,
    AffineTransform: true,
    Size: true,
    size: true,
    Rect: true,
    rect: true,
    Color: true,
    color: true
  };
  Object.defineProperty(_exports, "Vec2", {
    enumerable: true,
    get: function () {
      return _vec.Vec2;
    }
  });
  Object.defineProperty(_exports, "v2", {
    enumerable: true,
    get: function () {
      return _vec.v2;
    }
  });
  Object.defineProperty(_exports, "Vec3", {
    enumerable: true,
    get: function () {
      return _vec2.Vec3;
    }
  });
  Object.defineProperty(_exports, "v3", {
    enumerable: true,
    get: function () {
      return _vec2.v3;
    }
  });
  Object.defineProperty(_exports, "Vec4", {
    enumerable: true,
    get: function () {
      return _vec3.Vec4;
    }
  });
  Object.defineProperty(_exports, "v4", {
    enumerable: true,
    get: function () {
      return _vec3.v4;
    }
  });
  Object.defineProperty(_exports, "Quat", {
    enumerable: true,
    get: function () {
      return _quat.Quat;
    }
  });
  Object.defineProperty(_exports, "quat", {
    enumerable: true,
    get: function () {
      return _quat.quat;
    }
  });
  Object.defineProperty(_exports, "Mat3", {
    enumerable: true,
    get: function () {
      return _mat.Mat3;
    }
  });
  Object.defineProperty(_exports, "Mat4", {
    enumerable: true,
    get: function () {
      return _mat2.Mat4;
    }
  });
  Object.defineProperty(_exports, "mat4", {
    enumerable: true,
    get: function () {
      return _mat2.mat4;
    }
  });
  Object.defineProperty(_exports, "AffineTransform", {
    enumerable: true,
    get: function () {
      return _affineTransform.AffineTransform;
    }
  });
  Object.defineProperty(_exports, "Size", {
    enumerable: true,
    get: function () {
      return _size.Size;
    }
  });
  Object.defineProperty(_exports, "size", {
    enumerable: true,
    get: function () {
      return _size.size;
    }
  });
  Object.defineProperty(_exports, "Rect", {
    enumerable: true,
    get: function () {
      return _rect.Rect;
    }
  });
  Object.defineProperty(_exports, "rect", {
    enumerable: true,
    get: function () {
      return _rect.rect;
    }
  });
  Object.defineProperty(_exports, "Color", {
    enumerable: true,
    get: function () {
      return _color.Color;
    }
  });
  Object.defineProperty(_exports, "color", {
    enumerable: true,
    get: function () {
      return _color.color;
    }
  });
  _exports.bits = void 0;
  bits = _interopRequireWildcard(bits);
  _exports.bits = bits;
  Object.keys(_utils).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _utils[key];
      }
    });
  });
  Object.keys(_typeDefine).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    Object.defineProperty(_exports, key, {
      enumerable: true,
      get: function () {
        return _typeDefine[key];
      }
    });
  });

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE4Q0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgYml0cyBmcm9tICcuL2JpdHMnO1xyXG4vKipcclxuICogRXhwb3J0IG1vZHVsZSBiaXRzLlxyXG4gKi9cclxuXHJcbmV4cG9ydCB7IGJpdHMgfTtcclxuZXhwb3J0IHsgVmVjMiwgdjIgfSBmcm9tICcuL3ZlYzInO1xyXG5leHBvcnQgeyBWZWMzLCB2MyB9IGZyb20gJy4vdmVjMyc7XHJcbmV4cG9ydCB7IFZlYzQsIHY0IH0gZnJvbSAnLi92ZWM0JztcclxuZXhwb3J0IHsgUXVhdCwgcXVhdCB9IGZyb20gJy4vcXVhdCc7XHJcbmV4cG9ydCB7IE1hdDMgfSBmcm9tICcuL21hdDMnO1xyXG5leHBvcnQgeyBNYXQ0LCBtYXQ0IH0gZnJvbSAnLi9tYXQ0JztcclxuZXhwb3J0IHsgQWZmaW5lVHJhbnNmb3JtIH0gZnJvbSAnLi9hZmZpbmUtdHJhbnNmb3JtJztcclxuZXhwb3J0IHsgU2l6ZSwgc2l6ZSB9IGZyb20gJy4vc2l6ZSc7XHJcbmV4cG9ydCB7IFJlY3QsIHJlY3QgfSBmcm9tICcuL3JlY3QnO1xyXG5leHBvcnQgeyBDb2xvciwgY29sb3IgfSBmcm9tICcuL2NvbG9yJztcclxuZXhwb3J0ICogZnJvbSAnLi91dGlscyc7XHJcbmV4cG9ydCAqIGZyb20gJy4vdHlwZS1kZWZpbmUnO1xyXG5cclxuaW1wb3J0ICcuL2RlcHJlY2F0ZWQnO1xyXG4iXX0=