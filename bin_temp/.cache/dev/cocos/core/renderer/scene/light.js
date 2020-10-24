(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../math/index.js", "../../scene-graph/node-enum.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../math/index.js"), require("../../scene-graph/node-enum.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.nodeEnum, global.memoryPools);
    global.light = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _nodeEnum, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ColorTemperatureToRGB = ColorTemperatureToRGB;
  _exports.Light = _exports.nt2lm = _exports.LightType = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  // Color temperature (in Kelvin) to RGB
  function ColorTemperatureToRGB(rgb, kelvin) {
    if (kelvin < 1000.0) {
      kelvin = 1000.0;
    } else if (kelvin > 15000.0) {
      kelvin = 15000.0;
    } // Approximate Planckian locus in CIE 1960 UCS


    var kSqr = kelvin * kelvin;
    var u = (0.860117757 + 1.54118254e-4 * kelvin + 1.28641212e-7 * kSqr) / (1.0 + 8.42420235e-4 * kelvin + 7.08145163e-7 * kSqr);
    var v = (0.317398726 + 4.22806245e-5 * kelvin + 4.20481691e-8 * kSqr) / (1.0 - 2.89741816e-5 * kelvin + 1.61456053e-7 * kSqr);
    var d = 2.0 * u - 8.0 * v + 4.0;
    var x = 3.0 * u / d;
    var y = 2.0 * v / d;
    var z = 1.0 - x - y;
    var X = 1.0 / y * x;
    var Z = 1.0 / y * z; // XYZ to RGB with BT.709 primaries

    rgb.x = 3.2404542 * X + -1.5371385 + -0.4985314 * Z;
    rgb.y = -0.9692660 * X + 1.8760108 + 0.0415560 * Z;
    rgb.z = 0.0556434 * X + -0.2040259 + 1.0572252 * Z;
  }

  var LightType;
  _exports.LightType = LightType;

  (function (LightType) {
    LightType[LightType["DIRECTIONAL"] = 0] = "DIRECTIONAL";
    LightType[LightType["SPHERE"] = 1] = "SPHERE";
    LightType[LightType["SPOT"] = 2] = "SPOT";
    LightType[LightType["UNKNOWN"] = 3] = "UNKNOWN";
  })(LightType || (_exports.LightType = LightType = {}));

  var nt2lm = function nt2lm(size) {
    return 4 * Math.PI * Math.PI * size * size;
  };

  _exports.nt2lm = nt2lm;

  var Light = /*#__PURE__*/function () {
    _createClass(Light, [{
      key: "color",
      set: function set(color) {
        this._color.set(color);

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.COLOR, color);
      },
      get: function get() {
        return this._color;
      }
    }, {
      key: "useColorTemperature",
      set: function set(enable) {
        _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.USE_COLOR_TEMPERATURE, enable ? 1 : 0);
      },
      get: function get() {
        return _memoryPools.LightPool.get(this._handle, _memoryPools.LightView.USE_COLOR_TEMPERATURE) === 1 ? true : false;
      }
    }, {
      key: "colorTemperature",
      set: function set(val) {
        this._colorTemp = val;
        ColorTemperatureToRGB(this._colorTempRGB, this._colorTemp);

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.COLOR_TEMPERATURE_RGB, this._colorTempRGB);
      },
      get: function get() {
        return this._colorTemp;
      }
    }, {
      key: "colorTemperatureRGB",
      get: function get() {
        return this._colorTempRGB;
      }
    }, {
      key: "node",
      set: function set(n) {
        this._node = n;

        if (this._node) {
          this._node.hasChangedFlags |= _nodeEnum.TransformBit.ROTATION;

          _memoryPools.LightPool.set(this._handle, _memoryPools.LightView.NODE, this._node.handle);
        }
      },
      get: function get() {
        return this._node;
      }
    }, {
      key: "type",
      get: function get() {
        return this._type;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      },
      set: function set(n) {
        this._name = n;
      }
    }, {
      key: "scene",
      get: function get() {
        return this._scene;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }]);

    function Light() {
      _classCallCheck(this, Light);

      this._color = new _index.Vec3(1, 1, 1);
      this._colorTemp = 6550.0;
      this._colorTempRGB = new _index.Vec3(1, 1, 1);
      this._scene = null;
      this._node = null;
      this._type = void 0;
      this._name = null;
      this._handle = _memoryPools.NULL_HANDLE;
      this._type = LightType.UNKNOWN;
    }

    _createClass(Light, [{
      key: "initialize",
      value: function initialize() {
        this._handle = _memoryPools.LightPool.alloc();

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.COLOR, this._color);

        _memoryPools.LightPool.setVec3(this._handle, _memoryPools.LightView.COLOR_TEMPERATURE_RGB, this._colorTempRGB);
      }
    }, {
      key: "attachToScene",
      value: function attachToScene(scene) {
        this._scene = scene;
      }
    }, {
      key: "detachFromScene",
      value: function detachFromScene() {
        this._scene = null;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._name = null;
        this._type = LightType.UNKNOWN;
        this._node = null;

        if (this._handle) {
          _memoryPools.LightPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
    }, {
      key: "update",
      value: function update() {}
    }]);

    return Light;
  }();

  _exports.Light = Light;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvbGlnaHQudHMiXSwibmFtZXMiOlsiQ29sb3JUZW1wZXJhdHVyZVRvUkdCIiwicmdiIiwia2VsdmluIiwia1NxciIsInUiLCJ2IiwiZCIsIngiLCJ5IiwieiIsIlgiLCJaIiwiTGlnaHRUeXBlIiwibnQybG0iLCJzaXplIiwiTWF0aCIsIlBJIiwiTGlnaHQiLCJjb2xvciIsIl9jb2xvciIsInNldCIsIkxpZ2h0UG9vbCIsInNldFZlYzMiLCJfaGFuZGxlIiwiTGlnaHRWaWV3IiwiQ09MT1IiLCJlbmFibGUiLCJVU0VfQ09MT1JfVEVNUEVSQVRVUkUiLCJnZXQiLCJ2YWwiLCJfY29sb3JUZW1wIiwiX2NvbG9yVGVtcFJHQiIsIkNPTE9SX1RFTVBFUkFUVVJFX1JHQiIsIm4iLCJfbm9kZSIsImhhc0NoYW5nZWRGbGFncyIsIlRyYW5zZm9ybUJpdCIsIlJPVEFUSU9OIiwiTk9ERSIsImhhbmRsZSIsIl90eXBlIiwiX25hbWUiLCJfc2NlbmUiLCJWZWMzIiwiTlVMTF9IQU5ETEUiLCJVTktOT1dOIiwiYWxsb2MiLCJzY2VuZSIsImZyZWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU1BO0FBQ08sV0FBU0EscUJBQVQsQ0FBZ0NDLEdBQWhDLEVBQTJDQyxNQUEzQyxFQUEyRDtBQUM5RCxRQUFJQSxNQUFNLEdBQUcsTUFBYixFQUFxQjtBQUNqQkEsTUFBQUEsTUFBTSxHQUFHLE1BQVQ7QUFDSCxLQUZELE1BRU8sSUFBSUEsTUFBTSxHQUFHLE9BQWIsRUFBc0I7QUFDekJBLE1BQUFBLE1BQU0sR0FBRyxPQUFUO0FBQ0gsS0FMNkQsQ0FPOUQ7OztBQUNBLFFBQU1DLElBQUksR0FBR0QsTUFBTSxHQUFHQSxNQUF0QjtBQUNBLFFBQU1FLENBQUMsR0FBRyxDQUFDLGNBQWMsZ0JBQWdCRixNQUE5QixHQUF1QyxnQkFBZ0JDLElBQXhELEtBQWtFLE1BQU0sZ0JBQWdCRCxNQUF0QixHQUErQixnQkFBZ0JDLElBQWpILENBQVY7QUFDQSxRQUFNRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLGdCQUFnQkgsTUFBOUIsR0FBdUMsZ0JBQWdCQyxJQUF4RCxLQUFrRSxNQUFNLGdCQUFnQkQsTUFBdEIsR0FBK0IsZ0JBQWdCQyxJQUFqSCxDQUFWO0FBRUEsUUFBTUcsQ0FBQyxHQUFJLE1BQU1GLENBQU4sR0FBVSxNQUFNQyxDQUFoQixHQUFvQixHQUEvQjtBQUNBLFFBQU1FLENBQUMsR0FBRyxNQUFNSCxDQUFOLEdBQVVFLENBQXBCO0FBQ0EsUUFBTUUsQ0FBQyxHQUFHLE1BQU1ILENBQU4sR0FBVUMsQ0FBcEI7QUFDQSxRQUFNRyxDQUFDLEdBQUcsTUFBTUYsQ0FBTixHQUFVQyxDQUFwQjtBQUVBLFFBQU1FLENBQUMsR0FBRyxNQUFNRixDQUFOLEdBQVVELENBQXBCO0FBQ0EsUUFBTUksQ0FBQyxHQUFHLE1BQU1ILENBQU4sR0FBVUMsQ0FBcEIsQ0FsQjhELENBb0I5RDs7QUFDQVIsSUFBQUEsR0FBRyxDQUFDTSxDQUFKLEdBQVMsWUFBWUcsQ0FBWixHQUFnQixDQUFDLFNBQWpCLEdBQTZCLENBQUMsU0FBRCxHQUFhQyxDQUFuRDtBQUNBVixJQUFBQSxHQUFHLENBQUNPLENBQUosR0FBUSxDQUFDLFNBQUQsR0FBYUUsQ0FBYixHQUFrQixTQUFsQixHQUErQixZQUFZQyxDQUFuRDtBQUNBVixJQUFBQSxHQUFHLENBQUNRLENBQUosR0FBUyxZQUFZQyxDQUFaLEdBQWdCLENBQUMsU0FBakIsR0FBOEIsWUFBWUMsQ0FBbkQ7QUFDSDs7TUFFV0MsUzs7O2FBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMsQ0FBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0tBQUFBLFMsMEJBQUFBLFM7O0FBT0wsTUFBTUMsS0FBSyxHQUFHLFNBQVJBLEtBQVEsQ0FBQ0MsSUFBRDtBQUFBLFdBQWtCLElBQUlDLElBQUksQ0FBQ0MsRUFBVCxHQUFjRCxJQUFJLENBQUNDLEVBQW5CLEdBQXdCRixJQUF4QixHQUErQkEsSUFBakQ7QUFBQSxHQUFkOzs7O01BRU1HLEs7Ozt3QkFFRUMsSyxFQUFhO0FBQ3BCLGFBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQkYsS0FBaEI7O0FBQ0FHLCtCQUFVQyxPQUFWLENBQWtCLEtBQUtDLE9BQXZCLEVBQWdDQyx1QkFBVUMsS0FBMUMsRUFBaURQLEtBQWpEO0FBQ0gsTzswQkFFa0I7QUFDZixlQUFPLEtBQUtDLE1BQVo7QUFDSDs7O3dCQUV3Qk8sTSxFQUFpQjtBQUN0Q0wsK0JBQVVELEdBQVYsQ0FBYyxLQUFLRyxPQUFuQixFQUE0QkMsdUJBQVVHLHFCQUF0QyxFQUE2REQsTUFBTSxHQUFHLENBQUgsR0FBTyxDQUExRTtBQUNILE87MEJBRW1DO0FBQ2hDLGVBQU9MLHVCQUFVTyxHQUFWLENBQWMsS0FBS0wsT0FBbkIsRUFBNEJDLHVCQUFVRyxxQkFBdEMsTUFBaUUsQ0FBakUsR0FBcUUsSUFBckUsR0FBNEUsS0FBbkY7QUFDSDs7O3dCQUVxQkUsRyxFQUFhO0FBQy9CLGFBQUtDLFVBQUwsR0FBa0JELEdBQWxCO0FBQ0E3QixRQUFBQSxxQkFBcUIsQ0FBQyxLQUFLK0IsYUFBTixFQUFxQixLQUFLRCxVQUExQixDQUFyQjs7QUFDQVQsK0JBQVVDLE9BQVYsQ0FBa0IsS0FBS0MsT0FBdkIsRUFBZ0NDLHVCQUFVUSxxQkFBMUMsRUFBaUUsS0FBS0QsYUFBdEU7QUFDSCxPOzBCQUUrQjtBQUM1QixlQUFPLEtBQUtELFVBQVo7QUFDSDs7OzBCQUVnQztBQUM3QixlQUFPLEtBQUtDLGFBQVo7QUFDSDs7O3dCQUVTRSxDLEVBQUc7QUFDVCxhQUFLQyxLQUFMLEdBQWFELENBQWI7O0FBQ0EsWUFBSSxLQUFLQyxLQUFULEVBQWdCO0FBQ1osZUFBS0EsS0FBTCxDQUFXQyxlQUFYLElBQThCQyx1QkFBYUMsUUFBM0M7O0FBQ0FoQixpQ0FBVUQsR0FBVixDQUFjLEtBQUtHLE9BQW5CLEVBQTRCQyx1QkFBVWMsSUFBdEMsRUFBNEMsS0FBS0osS0FBTCxDQUFXSyxNQUF2RDtBQUNIO0FBQ0osTzswQkFFVztBQUNSLGVBQU8sS0FBS0wsS0FBWjtBQUNIOzs7MEJBRVc7QUFDUixlQUFPLEtBQUtNLEtBQVo7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLQyxLQUFaO0FBQ0gsTzt3QkFFU1IsQyxFQUFHO0FBQ1QsYUFBS1EsS0FBTCxHQUFhUixDQUFiO0FBQ0g7OzswQkFFWTtBQUNULGVBQU8sS0FBS1MsTUFBWjtBQUNIOzs7MEJBRWE7QUFDVixlQUFPLEtBQUtuQixPQUFaO0FBQ0g7OztBQVdELHFCQUFlO0FBQUE7O0FBQUEsV0FUTEosTUFTSyxHQVRVLElBQUl3QixXQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBU1Y7QUFBQSxXQVJMYixVQVFLLEdBUmdCLE1BUWhCO0FBQUEsV0FQTEMsYUFPSyxHQVBpQixJQUFJWSxXQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBT2pCO0FBQUEsV0FOTEQsTUFNSyxHQU53QixJQU14QjtBQUFBLFdBTExSLEtBS0ssR0FMZ0IsSUFLaEI7QUFBQSxXQUpMTSxLQUlLO0FBQUEsV0FITEMsS0FHSyxHQUhrQixJQUdsQjtBQUFBLFdBRkxsQixPQUVLLEdBRmtCcUIsd0JBRWxCO0FBQ1gsV0FBS0osS0FBTCxHQUFhNUIsU0FBUyxDQUFDaUMsT0FBdkI7QUFDSDs7OzttQ0FFb0I7QUFDakIsYUFBS3RCLE9BQUwsR0FBZUYsdUJBQVV5QixLQUFWLEVBQWY7O0FBQ0F6QiwrQkFBVUMsT0FBVixDQUFrQixLQUFLQyxPQUF2QixFQUFnQ0MsdUJBQVVDLEtBQTFDLEVBQWlELEtBQUtOLE1BQXREOztBQUNBRSwrQkFBVUMsT0FBVixDQUFrQixLQUFLQyxPQUF2QixFQUFnQ0MsdUJBQVVRLHFCQUExQyxFQUFpRSxLQUFLRCxhQUF0RTtBQUNIOzs7b0NBRXFCZ0IsSyxFQUFvQjtBQUN0QyxhQUFLTCxNQUFMLEdBQWNLLEtBQWQ7QUFDSDs7O3dDQUV5QjtBQUN0QixhQUFLTCxNQUFMLEdBQWMsSUFBZDtBQUNIOzs7Z0NBRWlCO0FBQ2QsYUFBS0QsS0FBTCxHQUFhLElBQWI7QUFDQSxhQUFLRCxLQUFMLEdBQWE1QixTQUFTLENBQUNpQyxPQUF2QjtBQUNBLGFBQUtYLEtBQUwsR0FBYSxJQUFiOztBQUNBLFlBQUksS0FBS1gsT0FBVCxFQUFrQjtBQUNkRixpQ0FBVTJCLElBQVYsQ0FBZSxLQUFLekIsT0FBcEI7O0FBQ0EsZUFBS0EsT0FBTCxHQUFlcUIsd0JBQWY7QUFDSDtBQUNKOzs7K0JBRWdCLENBQUUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL25vZGUtZW51bSc7XHJcbmltcG9ydCB7IFJlbmRlclNjZW5lIH0gZnJvbSAnLi9yZW5kZXItc2NlbmUnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBMaWdodEhhbmRsZSwgTlVMTF9IQU5ETEUsIExpZ2h0UG9vbCwgTGlnaHRWaWV3IH0gZnJvbSAnLi4vY29yZS9tZW1vcnktcG9vbHMnO1xyXG5cclxuLy8gQ29sb3IgdGVtcGVyYXR1cmUgKGluIEtlbHZpbikgdG8gUkdCXHJcbmV4cG9ydCBmdW5jdGlvbiBDb2xvclRlbXBlcmF0dXJlVG9SR0IgKHJnYjogVmVjMywga2VsdmluOiBudW1iZXIpIHtcclxuICAgIGlmIChrZWx2aW4gPCAxMDAwLjApIHtcclxuICAgICAgICBrZWx2aW4gPSAxMDAwLjA7XHJcbiAgICB9IGVsc2UgaWYgKGtlbHZpbiA+IDE1MDAwLjApIHtcclxuICAgICAgICBrZWx2aW4gPSAxNTAwMC4wO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFwcHJveGltYXRlIFBsYW5ja2lhbiBsb2N1cyBpbiBDSUUgMTk2MCBVQ1NcclxuICAgIGNvbnN0IGtTcXIgPSBrZWx2aW4gKiBrZWx2aW47XHJcbiAgICBjb25zdCB1ID0gKDAuODYwMTE3NzU3ICsgMS41NDExODI1NGUtNCAqIGtlbHZpbiArIDEuMjg2NDEyMTJlLTcgKiBrU3FyKSAvICggMS4wICsgOC40MjQyMDIzNWUtNCAqIGtlbHZpbiArIDcuMDgxNDUxNjNlLTcgKiBrU3FyKTtcclxuICAgIGNvbnN0IHYgPSAoMC4zMTczOTg3MjYgKyA0LjIyODA2MjQ1ZS01ICoga2VsdmluICsgNC4yMDQ4MTY5MWUtOCAqIGtTcXIpIC8gKCAxLjAgLSAyLjg5NzQxODE2ZS01ICoga2VsdmluICsgMS42MTQ1NjA1M2UtNyAqIGtTcXIpO1xyXG5cclxuICAgIGNvbnN0IGQgPSAoMi4wICogdSAtIDguMCAqIHYgKyA0LjApO1xyXG4gICAgY29uc3QgeCA9IDMuMCAqIHUgLyBkO1xyXG4gICAgY29uc3QgeSA9IDIuMCAqIHYgLyBkO1xyXG4gICAgY29uc3QgeiA9IDEuMCAtIHggLSB5O1xyXG5cclxuICAgIGNvbnN0IFggPSAxLjAgLyB5ICogeDtcclxuICAgIGNvbnN0IFogPSAxLjAgLyB5ICogejtcclxuXHJcbiAgICAvLyBYWVogdG8gUkdCIHdpdGggQlQuNzA5IHByaW1hcmllc1xyXG4gICAgcmdiLnggPSAgMy4yNDA0NTQyICogWCArIC0xLjUzNzEzODUgKyAtMC40OTg1MzE0ICogWjtcclxuICAgIHJnYi55ID0gLTAuOTY5MjY2MCAqIFggKyAgMS44NzYwMTA4ICsgIDAuMDQxNTU2MCAqIFo7XHJcbiAgICByZ2IueiA9ICAwLjA1NTY0MzQgKiBYICsgLTAuMjA0MDI1OSArICAxLjA1NzIyNTIgKiBaO1xyXG59XHJcblxyXG5leHBvcnQgZW51bSBMaWdodFR5cGUge1xyXG4gICAgRElSRUNUSU9OQUwsXHJcbiAgICBTUEhFUkUsXHJcbiAgICBTUE9ULFxyXG4gICAgVU5LTk9XTixcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG50MmxtID0gKHNpemU6IG51bWJlcikgPT4gNCAqIE1hdGguUEkgKiBNYXRoLlBJICogc2l6ZSAqIHNpemU7XHJcblxyXG5leHBvcnQgY2xhc3MgTGlnaHQge1xyXG5cclxuICAgIHNldCBjb2xvciAoY29sb3I6IFZlYzMpIHtcclxuICAgICAgICB0aGlzLl9jb2xvci5zZXQoY29sb3IpO1xyXG4gICAgICAgIExpZ2h0UG9vbC5zZXRWZWMzKHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LkNPTE9SLCBjb2xvcik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbG9yICgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sb3I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHVzZUNvbG9yVGVtcGVyYXR1cmUgKGVuYWJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIExpZ2h0UG9vbC5zZXQodGhpcy5faGFuZGxlLCBMaWdodFZpZXcuVVNFX0NPTE9SX1RFTVBFUkFUVVJFLCBlbmFibGUgPyAxIDogMCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHVzZUNvbG9yVGVtcGVyYXR1cmUgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiBMaWdodFBvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LlVTRV9DT0xPUl9URU1QRVJBVFVSRSkgPT09IDEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNvbG9yVGVtcGVyYXR1cmUgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fY29sb3JUZW1wID0gdmFsO1xyXG4gICAgICAgIENvbG9yVGVtcGVyYXR1cmVUb1JHQih0aGlzLl9jb2xvclRlbXBSR0IsIHRoaXMuX2NvbG9yVGVtcCk7XHJcbiAgICAgICAgTGlnaHRQb29sLnNldFZlYzModGhpcy5faGFuZGxlLCBMaWdodFZpZXcuQ09MT1JfVEVNUEVSQVRVUkVfUkdCLCB0aGlzLl9jb2xvclRlbXBSR0IpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb2xvclRlbXBlcmF0dXJlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvclRlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbG9yVGVtcGVyYXR1cmVSR0IgKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvclRlbXBSR0I7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG5vZGUgKG4pIHtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbjtcclxuICAgICAgICBpZiAodGhpcy5fbm9kZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ub2RlLmhhc0NoYW5nZWRGbGFncyB8PSBUcmFuc2Zvcm1CaXQuUk9UQVRJT047XHJcbiAgICAgICAgICAgIExpZ2h0UG9vbC5zZXQodGhpcy5faGFuZGxlLCBMaWdodFZpZXcuTk9ERSwgdGhpcy5fbm9kZS5oYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgbm9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBuYW1lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbmFtZSAobikge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBuO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzY2VuZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoYW5kbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oYW5kbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jb2xvcjogVmVjMyA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG4gICAgcHJvdGVjdGVkIF9jb2xvclRlbXA6IG51bWJlciA9IDY1NTAuMDtcclxuICAgIHByb3RlY3RlZCBfY29sb3JUZW1wUkdCOiBWZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcbiAgICBwcm90ZWN0ZWQgX3NjZW5lOiBSZW5kZXJTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9ub2RlOiBOb2RlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3R5cGU6IExpZ2h0VHlwZTtcclxuICAgIHByb3RlY3RlZCBfbmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2hhbmRsZTogTGlnaHRIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IExpZ2h0VHlwZS5VTktOT1dOO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplICgpIHtcclxuICAgICAgICB0aGlzLl9oYW5kbGUgPSBMaWdodFBvb2wuYWxsb2MoKTtcclxuICAgICAgICBMaWdodFBvb2wuc2V0VmVjMyh0aGlzLl9oYW5kbGUsIExpZ2h0Vmlldy5DT0xPUiwgdGhpcy5fY29sb3IpO1xyXG4gICAgICAgIExpZ2h0UG9vbC5zZXRWZWMzKHRoaXMuX2hhbmRsZSwgTGlnaHRWaWV3LkNPTE9SX1RFTVBFUkFUVVJFX1JHQiwgdGhpcy5fY29sb3JUZW1wUkdCKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXR0YWNoVG9TY2VuZSAoc2NlbmU6IFJlbmRlclNjZW5lKSB7XHJcbiAgICAgICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGV0YWNoRnJvbVNjZW5lICgpIHtcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuX25hbWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBMaWdodFR5cGUuVU5LTk9XTjtcclxuICAgICAgICB0aGlzLl9ub2RlID0gbnVsbDtcclxuICAgICAgICBpZiAodGhpcy5faGFuZGxlKSB7XHJcbiAgICAgICAgICAgIExpZ2h0UG9vbC5mcmVlKHRoaXMuX2hhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHt9XHJcbn1cclxuIl19