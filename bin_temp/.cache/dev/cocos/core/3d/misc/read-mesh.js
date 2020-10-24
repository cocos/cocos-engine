(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../gfx/define.js", "./buffer.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../gfx/define.js"), require("./buffer.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.buffer);
    global.readMesh = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _buffer) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.readMesh = readMesh;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  var _keyMap;

  (function (_keyMap) {
    _keyMap[_keyMap["positions"] = _define.GFXAttributeName.ATTR_POSITION] = "positions";
    _keyMap[_keyMap["normals"] = _define.GFXAttributeName.ATTR_NORMAL] = "normals";
    _keyMap[_keyMap["uvs"] = _define.GFXAttributeName.ATTR_TEX_COORD] = "uvs";
    _keyMap[_keyMap["colors"] = _define.GFXAttributeName.ATTR_COLOR] = "colors";
  })(_keyMap || (_keyMap = {}));

  function readMesh(mesh) {
    var iPrimitive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var out = {
      positions: []
    };
    var dataView = new DataView(mesh.data.buffer, mesh.data.byteOffset, mesh.data.byteLength);
    var struct = mesh.struct;
    var primitive = struct.primitives[iPrimitive];

    var _iterator = _createForOfIteratorHelper(primitive.vertexBundelIndices),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var idx = _step.value;
        var bundle = struct.vertexBundles[idx];
        var offset = bundle.view.offset;
        var _bundle$view = bundle.view,
            length = _bundle$view.length,
            stride = _bundle$view.stride;

        var _iterator2 = _createForOfIteratorHelper(bundle.attributes),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var attr = _step2.value;
            var name = _keyMap[attr.name];

            if (name) {
              out[name] = (out[name] || []).concat((0, _buffer.readBuffer)(dataView, attr.format, offset, length, stride));
            }

            offset += _define.GFXFormatInfos[attr.format].size;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    var view = primitive.indexView;
    out.indices = (0, _buffer.readBuffer)(dataView, _define.GFXFormat["R".concat(view.stride * 8, "UI")], view.offset, view.length);
    return out;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvbWlzYy9yZWFkLW1lc2gudHMiXSwibmFtZXMiOlsiX2tleU1hcCIsIkdGWEF0dHJpYnV0ZU5hbWUiLCJBVFRSX1BPU0lUSU9OIiwiQVRUUl9OT1JNQUwiLCJBVFRSX1RFWF9DT09SRCIsIkFUVFJfQ09MT1IiLCJyZWFkTWVzaCIsIm1lc2giLCJpUHJpbWl0aXZlIiwib3V0IiwicG9zaXRpb25zIiwiZGF0YVZpZXciLCJEYXRhVmlldyIsImRhdGEiLCJidWZmZXIiLCJieXRlT2Zmc2V0IiwiYnl0ZUxlbmd0aCIsInN0cnVjdCIsInByaW1pdGl2ZSIsInByaW1pdGl2ZXMiLCJ2ZXJ0ZXhCdW5kZWxJbmRpY2VzIiwiaWR4IiwiYnVuZGxlIiwidmVydGV4QnVuZGxlcyIsIm9mZnNldCIsInZpZXciLCJsZW5ndGgiLCJzdHJpZGUiLCJhdHRyaWJ1dGVzIiwiYXR0ciIsIm5hbWUiLCJjb25jYXQiLCJmb3JtYXQiLCJHRlhGb3JtYXRJbmZvcyIsInNpemUiLCJpbmRleFZpZXciLCJpbmRpY2VzIiwiR0ZYRm9ybWF0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQU1LQSxPOzthQUFBQSxPO0FBQUFBLElBQUFBLE8sQ0FBQUEsTyxnQkFDV0MseUJBQWlCQyxhO0FBRDVCRixJQUFBQSxPLENBQUFBLE8sY0FFU0MseUJBQWlCRSxXO0FBRjFCSCxJQUFBQSxPLENBQUFBLE8sVUFHS0MseUJBQWlCRyxjO0FBSHRCSixJQUFBQSxPLENBQUFBLE8sYUFJUUMseUJBQWlCSSxVO0tBSnpCTCxPLEtBQUFBLE87O0FBT0UsV0FBU00sUUFBVCxDQUFtQkMsSUFBbkIsRUFBdUQ7QUFBQSxRQUF4QkMsVUFBd0IsdUVBQUgsQ0FBRztBQUMxRCxRQUFNQyxHQUFjLEdBQUc7QUFBRUMsTUFBQUEsU0FBUyxFQUFFO0FBQWIsS0FBdkI7QUFDQSxRQUFNQyxRQUFRLEdBQUcsSUFBSUMsUUFBSixDQUFhTCxJQUFJLENBQUNNLElBQUwsQ0FBVUMsTUFBdkIsRUFBK0JQLElBQUksQ0FBQ00sSUFBTCxDQUFVRSxVQUF6QyxFQUFxRFIsSUFBSSxDQUFDTSxJQUFMLENBQVVHLFVBQS9ELENBQWpCO0FBQ0EsUUFBTUMsTUFBTSxHQUFHVixJQUFJLENBQUNVLE1BQXBCO0FBQ0EsUUFBTUMsU0FBUyxHQUFHRCxNQUFNLENBQUNFLFVBQVAsQ0FBa0JYLFVBQWxCLENBQWxCOztBQUowRCwrQ0FLeENVLFNBQVMsQ0FBQ0UsbUJBTDhCO0FBQUE7O0FBQUE7QUFLMUQsMERBQWlEO0FBQUEsWUFBdENDLEdBQXNDO0FBQzdDLFlBQU1DLE1BQU0sR0FBR0wsTUFBTSxDQUFDTSxhQUFQLENBQXFCRixHQUFyQixDQUFmO0FBQ0EsWUFBSUcsTUFBTSxHQUFHRixNQUFNLENBQUNHLElBQVAsQ0FBWUQsTUFBekI7QUFGNkMsMkJBR2xCRixNQUFNLENBQUNHLElBSFc7QUFBQSxZQUdyQ0MsTUFIcUMsZ0JBR3JDQSxNQUhxQztBQUFBLFlBRzdCQyxNQUg2QixnQkFHN0JBLE1BSDZCOztBQUFBLG9EQUkxQkwsTUFBTSxDQUFDTSxVQUptQjtBQUFBOztBQUFBO0FBSTdDLGlFQUFzQztBQUFBLGdCQUEzQkMsSUFBMkI7QUFDbEMsZ0JBQU1DLElBQXNCLEdBQUc5QixPQUFPLENBQUM2QixJQUFJLENBQUNDLElBQU4sQ0FBdEM7O0FBQ0EsZ0JBQUlBLElBQUosRUFBVTtBQUFFckIsY0FBQUEsR0FBRyxDQUFDcUIsSUFBRCxDQUFILEdBQVksQ0FBQ3JCLEdBQUcsQ0FBQ3FCLElBQUQsQ0FBSCxJQUFhLEVBQWQsRUFBa0JDLE1BQWxCLENBQXlCLHdCQUFXcEIsUUFBWCxFQUFxQmtCLElBQUksQ0FBQ0csTUFBMUIsRUFBa0NSLE1BQWxDLEVBQTBDRSxNQUExQyxFQUFrREMsTUFBbEQsQ0FBekIsQ0FBWjtBQUFrRzs7QUFDOUdILFlBQUFBLE1BQU0sSUFBSVMsdUJBQWVKLElBQUksQ0FBQ0csTUFBcEIsRUFBNEJFLElBQXRDO0FBQ0g7QUFSNEM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQVNoRDtBQWR5RDtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQWUxRCxRQUFNVCxJQUFJLEdBQUdQLFNBQVMsQ0FBQ2lCLFNBQXZCO0FBQ0ExQixJQUFBQSxHQUFHLENBQUMyQixPQUFKLEdBQWMsd0JBQVd6QixRQUFYLEVBQXFCMEIsNkJBQWNaLElBQUksQ0FBQ0UsTUFBTCxHQUFjLENBQTVCLFFBQXJCLEVBQXlERixJQUFJLENBQUNELE1BQTlELEVBQXNFQyxJQUFJLENBQUNDLE1BQTNFLENBQWQ7QUFDQSxXQUFPakIsR0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi8uLi9hc3NldHMvbWVzaCc7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZU5hbWUsIEdGWEZvcm1hdCwgR0ZYRm9ybWF0SW5mb3MgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgSUdlb21ldHJ5IH0gZnJvbSAnLi4vLi4vcHJpbWl0aXZlL2RlZmluZSc7XHJcbmltcG9ydCB7IHJlYWRCdWZmZXIgfSBmcm9tICcuL2J1ZmZlcic7XHJcblxyXG5lbnVtIF9rZXlNYXAge1xyXG4gICAgcG9zaXRpb25zID0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1BPU0lUSU9OLFxyXG4gICAgbm9ybWFscyA9IEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwsXHJcbiAgICB1dnMgPSBHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELFxyXG4gICAgY29sb3JzID0gR0ZYQXR0cmlidXRlTmFtZS5BVFRSX0NPTE9SLFxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVhZE1lc2ggKG1lc2g6IE1lc2gsIGlQcmltaXRpdmU6IG51bWJlciA9IDApIHtcclxuICAgIGNvbnN0IG91dDogSUdlb21ldHJ5ID0geyBwb3NpdGlvbnM6IFtdIH07XHJcbiAgICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhtZXNoLmRhdGEuYnVmZmVyLCBtZXNoLmRhdGEuYnl0ZU9mZnNldCwgbWVzaC5kYXRhLmJ5dGVMZW5ndGgpO1xyXG4gICAgY29uc3Qgc3RydWN0ID0gbWVzaC5zdHJ1Y3Q7XHJcbiAgICBjb25zdCBwcmltaXRpdmUgPSBzdHJ1Y3QucHJpbWl0aXZlc1tpUHJpbWl0aXZlXTtcclxuICAgIGZvciAoY29uc3QgaWR4IG9mIHByaW1pdGl2ZS52ZXJ0ZXhCdW5kZWxJbmRpY2VzKSB7XHJcbiAgICAgICAgY29uc3QgYnVuZGxlID0gc3RydWN0LnZlcnRleEJ1bmRsZXNbaWR4XTtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gYnVuZGxlLnZpZXcub2Zmc2V0O1xyXG4gICAgICAgIGNvbnN0IHsgbGVuZ3RoLCBzdHJpZGUgfSA9IGJ1bmRsZS52aWV3O1xyXG4gICAgICAgIGZvciAoY29uc3QgYXR0ciBvZiBidW5kbGUuYXR0cmlidXRlcykge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lOiBHRlhBdHRyaWJ1dGVOYW1lID0gX2tleU1hcFthdHRyLm5hbWVdO1xyXG4gICAgICAgICAgICBpZiAobmFtZSkgeyBvdXRbbmFtZV0gPSAob3V0W25hbWVdIHx8IFtdKS5jb25jYXQocmVhZEJ1ZmZlcihkYXRhVmlldywgYXR0ci5mb3JtYXQsIG9mZnNldCwgbGVuZ3RoLCBzdHJpZGUpKTsgfVxyXG4gICAgICAgICAgICBvZmZzZXQgKz0gR0ZYRm9ybWF0SW5mb3NbYXR0ci5mb3JtYXRdLnNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3QgdmlldyA9IHByaW1pdGl2ZS5pbmRleFZpZXchO1xyXG4gICAgb3V0LmluZGljZXMgPSByZWFkQnVmZmVyKGRhdGFWaWV3LCBHRlhGb3JtYXRbYFIke3ZpZXcuc3RyaWRlICogOH1VSWBdLCB2aWV3Lm9mZnNldCwgdmlldy5sZW5ndGgpO1xyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG4iXX0=