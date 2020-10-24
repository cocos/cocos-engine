(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "../../math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("../../math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.index);
    global.passUtils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getDefaultFromType = getDefaultFromType;
  _exports.overrideMacros = overrideMacros;
  _exports.type2writer = _exports.type2reader = _exports.customizeType = _exports.getOffsetFromHandle = _exports.getBindingFromHandle = _exports.getSetIndexFromHandle = _exports.getTypeFromHandle = _exports.getPropertyTypeFromHandle = _exports.genHandle = _exports.PropertyType = void 0;

  var _type2reader, _type2writer;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var dtMask = 0xf0000000; //  4 bits => 16 property types

  var typeMask = 0x0fc00000; //  6 bits => 64 types

  var setMask = 0x00300000; //  2 bits => 4 sets

  var bindingMask = 0x000fc000; //  6 bits => 64 bindings

  var offsetMask = 0x00003fff; // 14 bits => 4096 vectors

  var PropertyType;
  _exports.PropertyType = PropertyType;

  (function (PropertyType) {
    PropertyType[PropertyType["UBO"] = 0] = "UBO";
    PropertyType[PropertyType["SAMPLER"] = 1] = "SAMPLER";
  })(PropertyType || (_exports.PropertyType = PropertyType = {}));

  var genHandle = function genHandle(pt, set, binding, type) {
    var offset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    return pt << 28 & dtMask | type << 22 & typeMask | set << 20 & setMask | binding << 14 & bindingMask | offset & offsetMask;
  };

  _exports.genHandle = genHandle;

  var getPropertyTypeFromHandle = function getPropertyTypeFromHandle(handle) {
    return (handle & dtMask) >>> 28;
  };

  _exports.getPropertyTypeFromHandle = getPropertyTypeFromHandle;

  var getTypeFromHandle = function getTypeFromHandle(handle) {
    return (handle & typeMask) >>> 22;
  };

  _exports.getTypeFromHandle = getTypeFromHandle;

  var getSetIndexFromHandle = function getSetIndexFromHandle(handle) {
    return (handle & setMask) >>> 20;
  };

  _exports.getSetIndexFromHandle = getSetIndexFromHandle;

  var getBindingFromHandle = function getBindingFromHandle(handle) {
    return (handle & bindingMask) >>> 14;
  };

  _exports.getBindingFromHandle = getBindingFromHandle;

  var getOffsetFromHandle = function getOffsetFromHandle(handle) {
    return handle & offsetMask;
  };

  _exports.getOffsetFromHandle = getOffsetFromHandle;

  var customizeType = function customizeType(handle, type) {
    return handle & ~typeMask | type << 22 & typeMask;
  };

  _exports.customizeType = customizeType;
  var type2reader = (_type2reader = {}, _defineProperty(_type2reader, _define.GFXType.UNKNOWN, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return console.warn('illegal uniform handle');
  }), _defineProperty(_type2reader, _define.GFXType.INT, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return a[idx];
  }), _defineProperty(_type2reader, _define.GFXType.INT2, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec2.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.INT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec3.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.INT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec4.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.FLOAT, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return a[idx];
  }), _defineProperty(_type2reader, _define.GFXType.FLOAT2, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec2.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.FLOAT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec3.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.FLOAT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec4.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.MAT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Mat3.fromArray(v, a, idx);
  }), _defineProperty(_type2reader, _define.GFXType.MAT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Mat4.fromArray(v, a, idx);
  }), _type2reader);
  _exports.type2reader = type2reader;
  var type2writer = (_type2writer = {}, _defineProperty(_type2writer, _define.GFXType.UNKNOWN, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return console.warn('illegal uniform handle');
  }), _defineProperty(_type2writer, _define.GFXType.INT, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return a[idx] = v;
  }), _defineProperty(_type2writer, _define.GFXType.INT2, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec2.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.INT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec3.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.INT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec4.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.FLOAT, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return a[idx] = v;
  }), _defineProperty(_type2writer, _define.GFXType.FLOAT2, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec2.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.FLOAT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec3.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.FLOAT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Vec4.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.MAT3, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Mat3.toArray(a, v, idx);
  }), _defineProperty(_type2writer, _define.GFXType.MAT4, function (a, v) {
    var idx = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return _index.Mat4.toArray(a, v, idx);
  }), _type2writer);
  _exports.type2writer = type2writer;
  var defaultValues = [Object.freeze([0]), Object.freeze([0, 0]), Object.freeze([0, 0, 0, 0]), Object.freeze([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])];

  function getDefaultFromType(type) {
    switch (type) {
      case _define.GFXType.BOOL:
      case _define.GFXType.INT:
      case _define.GFXType.UINT:
      case _define.GFXType.FLOAT:
        return defaultValues[0];

      case _define.GFXType.BOOL2:
      case _define.GFXType.INT2:
      case _define.GFXType.UINT2:
      case _define.GFXType.FLOAT2:
        return defaultValues[1];

      case _define.GFXType.BOOL4:
      case _define.GFXType.INT4:
      case _define.GFXType.UINT4:
      case _define.GFXType.FLOAT4:
        return defaultValues[2];

      case _define.GFXType.MAT4:
        return defaultValues[3];

      case _define.GFXType.SAMPLER2D:
        return 'default-texture';

      case _define.GFXType.SAMPLER_CUBE:
        return 'default-cube-texture';
    }

    return defaultValues[0];
  }

  function overrideMacros(target, source) {
    var entries = Object.entries(source);
    var isDifferent = false;

    for (var i = 0; i < entries.length; i++) {
      if (target[entries[i][0]] !== entries[i][1]) {
        target[entries[i][0]] = entries[i][1];
        isDifferent = true;
      }
    }

    return isDifferent;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9wYXNzLXV0aWxzLnRzIl0sIm5hbWVzIjpbImR0TWFzayIsInR5cGVNYXNrIiwic2V0TWFzayIsImJpbmRpbmdNYXNrIiwib2Zmc2V0TWFzayIsIlByb3BlcnR5VHlwZSIsImdlbkhhbmRsZSIsInB0Iiwic2V0IiwiYmluZGluZyIsInR5cGUiLCJvZmZzZXQiLCJnZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlIiwiaGFuZGxlIiwiZ2V0VHlwZUZyb21IYW5kbGUiLCJnZXRTZXRJbmRleEZyb21IYW5kbGUiLCJnZXRCaW5kaW5nRnJvbUhhbmRsZSIsImdldE9mZnNldEZyb21IYW5kbGUiLCJjdXN0b21pemVUeXBlIiwidHlwZTJyZWFkZXIiLCJHRlhUeXBlIiwiVU5LTk9XTiIsImEiLCJ2IiwiaWR4IiwiY29uc29sZSIsIndhcm4iLCJJTlQiLCJJTlQyIiwiVmVjMiIsImZyb21BcnJheSIsIklOVDMiLCJWZWMzIiwiSU5UNCIsIlZlYzQiLCJGTE9BVCIsIkZMT0FUMiIsIkZMT0FUMyIsIkZMT0FUNCIsIk1BVDMiLCJNYXQzIiwiTUFUNCIsIk1hdDQiLCJ0eXBlMndyaXRlciIsInRvQXJyYXkiLCJkZWZhdWx0VmFsdWVzIiwiT2JqZWN0IiwiZnJlZXplIiwiZ2V0RGVmYXVsdEZyb21UeXBlIiwiQk9PTCIsIlVJTlQiLCJCT09MMiIsIlVJTlQyIiwiQk9PTDQiLCJVSU5UNCIsIlNBTVBMRVIyRCIsIlNBTVBMRVJfQ1VCRSIsIm92ZXJyaWRlTWFjcm9zIiwidGFyZ2V0Iiwic291cmNlIiwiZW50cmllcyIsImlzRGlmZmVyZW50IiwiaSIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0EsTUFBTUEsTUFBTSxHQUFRLFVBQXBCLEMsQ0FBZ0M7O0FBQ2hDLE1BQU1DLFFBQVEsR0FBTSxVQUFwQixDLENBQWdDOztBQUNoQyxNQUFN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O0FBQ0ksZUFBT0ksYUFBYSxDQUFDLENBQUQsQ0FBcEI7O0FBQ0osV0FBS3pCLGdCQUFRbUMsU0FBYjtBQUNJLGVBQU8saUJBQVA7O0FBQ0osV0FBS25DLGdCQUFRb0MsWUFBYjtBQUNJLGVBQU8sc0JBQVA7QUFyQlI7O0FBdUJBLFdBQU9YLGFBQWEsQ0FBQyxDQUFELENBQXBCO0FBQ0g7O0FBSU0sV0FBU1ksY0FBVCxDQUF5QkMsTUFBekIsRUFBOENDLE1BQTlDLEVBQTRFO0FBQy9FLFFBQU1DLE9BQU8sR0FBR2QsTUFBTSxDQUFDYyxPQUFQLENBQWVELE1BQWYsQ0FBaEI7QUFDQSxRQUFJRSxXQUFvQixHQUFHLEtBQTNCOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBTyxDQUFDRyxNQUE1QixFQUFvQ0QsQ0FBQyxFQUFyQyxFQUF5QztBQUNyQyxVQUFJSixNQUFNLENBQUNFLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFQLENBQVcsQ0FBWCxDQUFELENBQU4sS0FBMEJGLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFQLENBQVcsQ0FBWCxDQUE5QixFQUE2QztBQUN6Q0osUUFBQUEsTUFBTSxDQUFDRSxPQUFPLENBQUNFLENBQUQsQ0FBUCxDQUFXLENBQVgsQ0FBRCxDQUFOLEdBQXdCRixPQUFPLENBQUNFLENBQUQsQ0FBUCxDQUFXLENBQVgsQ0FBeEI7QUFDQUQsUUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFDSDtBQUNKOztBQUNELFdBQU9BLFdBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgbWF0ZXJpYWxcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhUeXBlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IENvbG9yLCBNYXQzLCBNYXQ0LCBWZWMyLCBWZWMzLCBWZWM0LCBRdWF0IH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcblxyXG5jb25zdCBkdE1hc2sgICAgICA9IDB4ZjAwMDAwMDA7IC8vICA0IGJpdHMgPT4gMTYgcHJvcGVydHkgdHlwZXNcclxuY29uc3QgdHlwZU1hc2sgICAgPSAweDBmYzAwMDAwOyAvLyAgNiBiaXRzID0+IDY0IHR5cGVzXHJcbmNvbnN0IHNldE1hc2sgICAgID0gMHgwMDMwMDAwMDsgLy8gIDIgYml0cyA9PiA0IHNldHNcclxuY29uc3QgYmluZGluZ01hc2sgPSAweDAwMGZjMDAwOyAvLyAgNiBiaXRzID0+IDY0IGJpbmRpbmdzXHJcbmNvbnN0IG9mZnNldE1hc2sgID0gMHgwMDAwM2ZmZjsgLy8gMTQgYml0cyA9PiA0MDk2IHZlY3RvcnNcclxuXHJcbmV4cG9ydCBlbnVtIFByb3BlcnR5VHlwZSB7XHJcbiAgICBVQk8sXHJcbiAgICBTQU1QTEVSLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2VuSGFuZGxlID0gKHB0OiBQcm9wZXJ0eVR5cGUsIHNldDogbnVtYmVyLCBiaW5kaW5nOiBudW1iZXIsIHR5cGU6IEdGWFR5cGUsIG9mZnNldDogbnVtYmVyID0gMCkgPT5cclxuICAgICgocHQgPDwgMjgpICYgZHRNYXNrKSB8ICgodHlwZSA8PCAyMikgJiB0eXBlTWFzaykgfCAoKHNldCA8PCAyMCkgJiBzZXRNYXNrKSB8ICgoYmluZGluZyA8PCAxNCkgJiBiaW5kaW5nTWFzaykgfCAob2Zmc2V0ICYgb2Zmc2V0TWFzayk7XHJcbmV4cG9ydCBjb25zdCBnZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlID0gKGhhbmRsZTogbnVtYmVyKSA9PiAoaGFuZGxlICYgZHRNYXNrKSA+Pj4gMjg7XHJcbmV4cG9ydCBjb25zdCBnZXRUeXBlRnJvbUhhbmRsZSA9IChoYW5kbGU6IG51bWJlcikgPT4gKGhhbmRsZSAmIHR5cGVNYXNrKSA+Pj4gMjI7XHJcbmV4cG9ydCBjb25zdCBnZXRTZXRJbmRleEZyb21IYW5kbGUgPSAoaGFuZGxlOiBudW1iZXIpID0+IChoYW5kbGUgJiBzZXRNYXNrKSA+Pj4gMjA7XHJcbmV4cG9ydCBjb25zdCBnZXRCaW5kaW5nRnJvbUhhbmRsZSA9IChoYW5kbGU6IG51bWJlcikgPT4gKGhhbmRsZSAmIGJpbmRpbmdNYXNrKSA+Pj4gMTQ7XHJcbmV4cG9ydCBjb25zdCBnZXRPZmZzZXRGcm9tSGFuZGxlID0gKGhhbmRsZTogbnVtYmVyKSA9PiAoaGFuZGxlICYgb2Zmc2V0TWFzayk7XHJcbmV4cG9ydCBjb25zdCBjdXN0b21pemVUeXBlID0gKGhhbmRsZTogbnVtYmVyLCB0eXBlOiBHRlhUeXBlKSA9PiAoaGFuZGxlICYgfnR5cGVNYXNrKSB8ICgodHlwZSA8PCAyMikgJiB0eXBlTWFzayk7XHJcblxyXG5leHBvcnQgdHlwZSBNYXRlcmlhbFByb3BlcnR5ID0gbnVtYmVyIHwgVmVjMiB8IFZlYzMgfCBWZWM0IHwgQ29sb3IgfCBNYXQzIHwgTWF0NCB8IFF1YXQ7XHJcblxyXG5leHBvcnQgY29uc3QgdHlwZTJyZWFkZXIgPSB7XHJcbiAgICBbR0ZYVHlwZS5VTktOT1dOXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IGNvbnNvbGUud2FybignaWxsZWdhbCB1bmlmb3JtIGhhbmRsZScpLFxyXG4gICAgW0dGWFR5cGUuSU5UXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IGFbaWR4XSxcclxuICAgIFtHRlhUeXBlLklOVDJdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjMi5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxuICAgIFtHRlhUeXBlLklOVDNdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjMy5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxuICAgIFtHRlhUeXBlLklOVDRdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjNC5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxuICAgIFtHRlhUeXBlLkZMT0FUXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IGFbaWR4XSxcclxuICAgIFtHRlhUeXBlLkZMT0FUMl06IChhOiBGbG9hdDMyQXJyYXksIHY6IGFueSwgaWR4OiBudW1iZXIgPSAwKSA9PiBWZWMyLmZyb21BcnJheSh2LCBhLCBpZHgpLFxyXG4gICAgW0dGWFR5cGUuRkxPQVQzXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IFZlYzMuZnJvbUFycmF5KHYsIGEsIGlkeCksXHJcbiAgICBbR0ZYVHlwZS5GTE9BVDRdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjNC5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxuICAgIFtHRlhUeXBlLk1BVDNdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gTWF0My5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxuICAgIFtHRlhUeXBlLk1BVDRdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gTWF0NC5mcm9tQXJyYXkodiwgYSwgaWR4KSxcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB0eXBlMndyaXRlciA9IHtcclxuICAgIFtHRlhUeXBlLlVOS05PV05dOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gY29uc29sZS53YXJuKCdpbGxlZ2FsIHVuaWZvcm0gaGFuZGxlJyksXHJcbiAgICBbR0ZYVHlwZS5JTlRdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gYVtpZHhdID0gdixcclxuICAgIFtHRlhUeXBlLklOVDJdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjMi50b0FycmF5KGEsIHYsIGlkeCksXHJcbiAgICBbR0ZYVHlwZS5JTlQzXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IFZlYzMudG9BcnJheShhLCB2LCBpZHgpLFxyXG4gICAgW0dGWFR5cGUuSU5UNF06IChhOiBGbG9hdDMyQXJyYXksIHY6IGFueSwgaWR4OiBudW1iZXIgPSAwKSA9PiBWZWM0LnRvQXJyYXkoYSwgdiwgaWR4KSxcclxuICAgIFtHRlhUeXBlLkZMT0FUXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IGFbaWR4XSA9IHYsXHJcbiAgICBbR0ZYVHlwZS5GTE9BVDJdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjMi50b0FycmF5KGEsIHYsIGlkeCksXHJcbiAgICBbR0ZYVHlwZS5GTE9BVDNdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjMy50b0FycmF5KGEsIHYsIGlkeCksXHJcbiAgICBbR0ZYVHlwZS5GTE9BVDRdOiAoYTogRmxvYXQzMkFycmF5LCB2OiBhbnksIGlkeDogbnVtYmVyID0gMCkgPT4gVmVjNC50b0FycmF5KGEsIHYsIGlkeCksXHJcbiAgICBbR0ZYVHlwZS5NQVQzXTogKGE6IEZsb2F0MzJBcnJheSwgdjogYW55LCBpZHg6IG51bWJlciA9IDApID0+IE1hdDMudG9BcnJheShhLCB2LCBpZHgpLFxyXG4gICAgW0dGWFR5cGUuTUFUNF06IChhOiBGbG9hdDMyQXJyYXksIHY6IGFueSwgaWR4OiBudW1iZXIgPSAwKSA9PiBNYXQ0LnRvQXJyYXkoYSwgdiwgaWR4KSxcclxufTtcclxuXHJcbmNvbnN0IGRlZmF1bHRWYWx1ZXMgPSBbXHJcbiAgICBPYmplY3QuZnJlZXplKFswXSksXHJcbiAgICBPYmplY3QuZnJlZXplKFswLCAwXSksXHJcbiAgICBPYmplY3QuZnJlZXplKFswLCAwLCAwLCAwXSksXHJcbiAgICBPYmplY3QuZnJlZXplKFsxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxLCAwLCAwLCAwLCAwLCAxXSksXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGVmYXVsdEZyb21UeXBlICh0eXBlOiBHRlhUeXBlKSB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDpcclxuICAgICAgICBjYXNlIEdGWFR5cGUuSU5UOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5VSU5UOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDpcclxuICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZXNbMF07XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLkJPT0wyOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5JTlQyOlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5VSU5UMjpcclxuICAgICAgICBjYXNlIEdGWFR5cGUuRkxPQVQyOlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlc1sxXTtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuQk9PTDQ6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLklOVDQ6XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLlVJTlQ0OlxyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5GTE9BVDQ6XHJcbiAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVzWzJdO1xyXG4gICAgICAgIGNhc2UgR0ZYVHlwZS5NQVQ0OlxyXG4gICAgICAgICAgICByZXR1cm4gZGVmYXVsdFZhbHVlc1szXTtcclxuICAgICAgICBjYXNlIEdGWFR5cGUuU0FNUExFUjJEOlxyXG4gICAgICAgICAgICByZXR1cm4gJ2RlZmF1bHQtdGV4dHVyZSc7XHJcbiAgICAgICAgY2FzZSBHRlhUeXBlLlNBTVBMRVJfQ1VCRTpcclxuICAgICAgICAgICAgcmV0dXJuICdkZWZhdWx0LWN1YmUtdGV4dHVyZSc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGVmYXVsdFZhbHVlc1swXTtcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgTWFjcm9SZWNvcmQgPSBSZWNvcmQ8c3RyaW5nLCBudW1iZXIgfCBib29sZWFuIHwgc3RyaW5nPjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBvdmVycmlkZU1hY3JvcyAodGFyZ2V0OiBNYWNyb1JlY29yZCwgc291cmNlOiBNYWNyb1JlY29yZCk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgZW50cmllcyA9IE9iamVjdC5lbnRyaWVzKHNvdXJjZSk7XHJcbiAgICBsZXQgaXNEaWZmZXJlbnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50cmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGlmICh0YXJnZXRbZW50cmllc1tpXVswXV0gIT09IGVudHJpZXNbaV1bMV0pIHtcclxuICAgICAgICAgICAgdGFyZ2V0W2VudHJpZXNbaV1bMF1dID0gZW50cmllc1tpXVsxXTtcclxuICAgICAgICAgICAgaXNEaWZmZXJlbnQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBpc0RpZmZlcmVudDtcclxufVxyXG4iXX0=