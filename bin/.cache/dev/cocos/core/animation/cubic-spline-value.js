(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.globalExports);
    global.cubicSplineValue = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CubicSplineNumberValue = _exports.CubicSplineQuatValue = _exports.CubicSplineVec4Value = _exports.CubicSplineVec3Value = _exports.CubicSplineVec2Value = void 0;

  var _dec2, _class4, _class5, _descriptor4, _descriptor5, _descriptor6, _temp2;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function makeCubicSplineValueConstructor(name, constructorX, scaleFx, scaleAndAdd) {
    var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _temp;

    var tempValue = new constructorX();
    var m0 = new constructorX();
    var m1 = new constructorX();
    var CubicSplineValueClass = (_dec = (0, _index.ccclass)(name), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
      function CubicSplineValueClass(dataPoint, inTangent, outTangent) {
        _classCallCheck(this, CubicSplineValueClass);

        _initializerDefineProperty(this, "dataPoint", _descriptor, this);

        _initializerDefineProperty(this, "inTangent", _descriptor2, this);

        _initializerDefineProperty(this, "outTangent", _descriptor3, this);

        this.dataPoint = dataPoint || new constructorX();
        this.inTangent = inTangent || new constructorX();
        this.outTangent = outTangent || new constructorX();
      }

      _createClass(CubicSplineValueClass, [{
        key: "lerp",
        value: function lerp(to, t, dt) {
          var p0 = this.dataPoint;
          var p1 = to.dataPoint; // dt => t_k+1 - t_k

          m0 = scaleFx(m0, this.inTangent, dt);
          m1 = scaleFx(m1, to.outTangent, dt);
          var t_3 = t * t * t;
          var t_2 = t * t;
          var f_0 = 2 * t_3 - 3 * t_2 + 1;
          var f_1 = t_3 - 2 * t_2 + t;
          var f_2 = -2 * t_3 + 3 * t_2;
          var f_3 = t_3 - t_2;
          tempValue = scaleFx(tempValue, p0, f_0);
          tempValue = scaleAndAdd(tempValue, tempValue, m0, f_1);
          tempValue = scaleAndAdd(tempValue, tempValue, p1, f_2);
          tempValue = scaleAndAdd(tempValue, tempValue, m1, f_3);
          return tempValue;
        }
      }, {
        key: "getNoLerp",
        value: function getNoLerp() {
          return this.dataPoint;
        }
      }]);

      return CubicSplineValueClass;
    }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "dataPoint", [_index.serializable], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: function initializer() {
        return new constructorX();
      }
    }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "inTangent", [_index.serializable], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: function initializer() {
        return new constructorX();
      }
    }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "outTangent", [_index.serializable], {
      configurable: true,
      enumerable: true,
      writable: true,
      initializer: function initializer() {
        return new constructorX();
      }
    })), _class2)) || _class); // @ts-ignore TS2367

    if (constructorX === _index2.Quat) {
      var _lerp = CubicSplineValueClass.prototype.lerp;

      CubicSplineValueClass.prototype.lerp = function (to, t, dt) {
        var result = _lerp.call(this, to, t, dt);

        _index2.Quat.normalize(result, result);

        return result;
      };
    }

    return CubicSplineValueClass;
  }

  var CubicSplineVec2Value = makeCubicSplineValueConstructor('cc.CubicSplineVec2Value', _index2.Vec2, _index2.Vec2.multiplyScalar, _index2.Vec2.scaleAndAdd);
  _exports.CubicSplineVec2Value = CubicSplineVec2Value;
  _globalExports.legacyCC.CubicSplineVec2Value = CubicSplineVec2Value;
  var CubicSplineVec3Value = makeCubicSplineValueConstructor('cc.CubicSplineVec3Value', _index2.Vec3, _index2.Vec3.multiplyScalar, _index2.Vec3.scaleAndAdd);
  _exports.CubicSplineVec3Value = CubicSplineVec3Value;
  _globalExports.legacyCC.CubicSplineVec3Value = CubicSplineVec3Value;
  var CubicSplineVec4Value = makeCubicSplineValueConstructor('cc.CubicSplineVec4Value', _index2.Vec4, _index2.Vec4.multiplyScalar, _index2.Vec4.scaleAndAdd);
  _exports.CubicSplineVec4Value = CubicSplineVec4Value;
  _globalExports.legacyCC.CubicSplineVec4Value = CubicSplineVec4Value;
  var CubicSplineQuatValue = makeCubicSplineValueConstructor('cc.CubicSplineQuatValue', _index2.Quat, _index2.Quat.multiplyScalar, _index2.Quat.scaleAndAdd);
  _exports.CubicSplineQuatValue = CubicSplineQuatValue;
  _globalExports.legacyCC.CubicSplineQuatValue = CubicSplineQuatValue;
  var CubicSplineNumberValue = (_dec2 = (0, _index.ccclass)('cc.CubicSplineNumberValue'), _dec2(_class4 = (_class5 = (_temp2 = /*#__PURE__*/function () {
    function CubicSplineNumberValue(dataPoint, inTangent, outTangent) {
      _classCallCheck(this, CubicSplineNumberValue);

      _initializerDefineProperty(this, "dataPoint", _descriptor4, this);

      _initializerDefineProperty(this, "inTangent", _descriptor5, this);

      _initializerDefineProperty(this, "outTangent", _descriptor6, this);

      this.dataPoint = dataPoint;
      this.inTangent = inTangent;
      this.outTangent = outTangent;
    }

    _createClass(CubicSplineNumberValue, [{
      key: "lerp",
      value: function lerp(to, t, dt) {
        var p0 = this.dataPoint;
        var p1 = to.dataPoint; // dt => t_k+1 - t_k

        var m0 = this.outTangent * dt;
        var m1 = to.inTangent * dt;
        var t_3 = t * t * t;
        var t_2 = t * t;
        var f_0 = 2 * t_3 - 3 * t_2 + 1;
        var f_1 = t_3 - 2 * t_2 + t;
        var f_2 = -2 * t_3 + 3 * t_2;
        var f_3 = t_3 - t_2;
        return p0 * f_0 + m0 * f_1 + p1 * f_2 + m1 * f_3;
      }
    }, {
      key: "getNoLerp",
      value: function getNoLerp() {
        return this.dataPoint;
      }
    }]);

    return CubicSplineNumberValue;
  }(), _temp2), (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "dataPoint", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "inTangent", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "outTangent", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class5)) || _class4);
  _exports.CubicSplineNumberValue = CubicSplineNumberValue;
  _globalExports.legacyCC.CubicSplineNumberValue = CubicSplineNumberValue;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvYW5pbWF0aW9uL2N1YmljLXNwbGluZS12YWx1ZS50cyJdLCJuYW1lcyI6WyJtYWtlQ3ViaWNTcGxpbmVWYWx1ZUNvbnN0cnVjdG9yIiwibmFtZSIsImNvbnN0cnVjdG9yWCIsInNjYWxlRngiLCJzY2FsZUFuZEFkZCIsInRlbXBWYWx1ZSIsIm0wIiwibTEiLCJDdWJpY1NwbGluZVZhbHVlQ2xhc3MiLCJkYXRhUG9pbnQiLCJpblRhbmdlbnQiLCJvdXRUYW5nZW50IiwidG8iLCJ0IiwiZHQiLCJwMCIsInAxIiwidF8zIiwidF8yIiwiZl8wIiwiZl8xIiwiZl8yIiwiZl8zIiwic2VyaWFsaXphYmxlIiwiUXVhdCIsImxlcnAiLCJwcm90b3R5cGUiLCJyZXN1bHQiLCJjYWxsIiwibm9ybWFsaXplIiwiQ3ViaWNTcGxpbmVWZWMyVmFsdWUiLCJWZWMyIiwibXVsdGlwbHlTY2FsYXIiLCJsZWdhY3lDQyIsIkN1YmljU3BsaW5lVmVjM1ZhbHVlIiwiVmVjMyIsIkN1YmljU3BsaW5lVmVjNFZhbHVlIiwiVmVjNCIsIkN1YmljU3BsaW5lUXVhdFZhbHVlIiwiQ3ViaWNTcGxpbmVOdW1iZXJWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxXQUFTQSwrQkFBVCxDQUNJQyxJQURKLEVBRUlDLFlBRkosRUFHSUMsT0FISixFQUlJQyxXQUpKLEVBSW1FO0FBQUE7O0FBRS9ELFFBQUlDLFNBQVMsR0FBRyxJQUFJSCxZQUFKLEVBQWhCO0FBQ0EsUUFBSUksRUFBRSxHQUFHLElBQUlKLFlBQUosRUFBVDtBQUNBLFFBQUlLLEVBQUUsR0FBRyxJQUFJTCxZQUFKLEVBQVQ7QUFKK0QsUUFPekRNLHFCQVB5RCxXQU05RCxvQkFBUVAsSUFBUixDQU44RDtBQWlCM0QscUNBQWFRLFNBQWIsRUFBNEJDLFNBQTVCLEVBQTJDQyxVQUEzQyxFQUEyRDtBQUFBOztB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QUwsR0FBa0JHLEVBQTdCO0FBQ0EsWUFBTVAsRUFBRSxHQUFHSyxFQUFFLENBQUNGLFNBQUgsR0FBZUksRUFBMUI7QUFDQSxZQUFNRyxHQUFHLEdBQUdKLENBQUMsR0FBR0EsQ0FBSixHQUFRQSxDQUFwQjtBQUNBLFlBQU1LLEdBQUcsR0FBR0wsQ0FBQyxHQUFHQSxDQUFoQjtBQUNBLFlBQU1NLEdBQUcsR0FBRyxJQUFJRixHQUFKLEdBQVUsSUFBSUMsR0FBZCxHQUFvQixDQUFoQztBQUNBLFlBQU1FLEdBQUcsR0FBR0gsR0FBRyxHQUFHLElBQUlDLEdBQVYsR0FBZ0JMLENBQTVCO0FBQ0EsWUFBTVEsR0FBRyxHQUFHLENBQUMsQ0FBRCxHQUFLSixHQUFMLEdBQVcsSUFBSUMsR0FBM0I7QUFDQSxZQUFNSSxHQUFHLEdBQUdMLEdBQUcsR0FBR0MsR0FBbEI7QUFDQSxlQUFPSCxFQUFFLEdBQUdJLEdBQUwsR0FBV2IsRUFBRSxHQUFHYyxHQUFoQixHQUFzQkosRUFBRSxHQUFHSyxHQUEzQixHQUFpQ2QsRUFBRSxHQUFHZSxHQUE3QztBQUNIOzs7a0NBRW1CO0FBQ2hCLGVBQU8sS0FBS2IsU0FBWjtBQUNIOzs7OzJGQWhDQWMsbUI7Ozs7O2FBQzBCLEM7O2dGQUUxQkEsbUI7Ozs7O2FBQzBCLEM7O2lGQUUxQkEsbUI7Ozs7O2FBQzJCLEM7Ozs7QUEyQmhDVSwwQkFBU00sc0JBQVQsR0FBa0NBLHNCQUFsQyIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IGFuaW1hdGlvblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFF1YXQsIFZlYzIsIFZlYzMsIFZlYzQgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IHsgSUxlcnBhYmxlIH0gZnJvbSAnLi90eXBlcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuaW50ZXJmYWNlIElDdWJpY1NwbGluZVZhbHVlPFQ+IGV4dGVuZHMgSUxlcnBhYmxlIHtcclxuICAgIGRhdGFQb2ludDogVDtcclxuICAgIGluVGFuZ2VudDogVDtcclxuICAgIG91dFRhbmdlbnQ6IFQ7XHJcbiAgICBsZXJwICh0bzogSUN1YmljU3BsaW5lVmFsdWU8VD4sIHQ6IG51bWJlciwgZHQ6IG51bWJlcik6IFQ7XHJcbiAgICBnZXROb0xlcnAgKCk6IFQ7XHJcbn1cclxuXHJcbnR5cGUgQ3ViaWNTcGxpbmVWYWx1ZUNvbnN0cnVjdG9yPFQ+ID0gbmV3IChkYXRhUG9pbnQ6IFQsIGluVGFuZ2VudDogVCwgb3V0VGFuZ2VudDogVCkgPT4gSUN1YmljU3BsaW5lVmFsdWU8VD47XHJcblxyXG50eXBlIFNjYWxlRng8VD4gPSAob3V0OiBULCB2OiBULCBzOiBudW1iZXIpID0+IFQ7XHJcbnR5cGUgU2NhbGVBbmRBZGRGeDxUPiA9IChvdXQ6IFQsIHYxOiBULCB2MjogVCwgczogbnVtYmVyKSA9PiBUO1xyXG5mdW5jdGlvbiBtYWtlQ3ViaWNTcGxpbmVWYWx1ZUNvbnN0cnVjdG9yPFQ+IChcclxuICAgIG5hbWU6IHN0cmluZyxcclxuICAgIGNvbnN0cnVjdG9yWDogbmV3ICgpID0+IFQsXHJcbiAgICBzY2FsZUZ4OiBTY2FsZUZ4PFQ+LFxyXG4gICAgc2NhbGVBbmRBZGQ6IFNjYWxlQW5kQWRkRng8VD4pOiBDdWJpY1NwbGluZVZhbHVlQ29uc3RydWN0b3I8VD4ge1xyXG5cclxuICAgIGxldCB0ZW1wVmFsdWUgPSBuZXcgY29uc3RydWN0b3JYKCk7XHJcbiAgICBsZXQgbTAgPSBuZXcgY29uc3RydWN0b3JYKCk7XHJcbiAgICBsZXQgbTEgPSBuZXcgY29uc3RydWN0b3JYKCk7XHJcblxyXG4gICAgQGNjY2xhc3MobmFtZSlcclxuICAgIGNsYXNzIEN1YmljU3BsaW5lVmFsdWVDbGFzcyBpbXBsZW1lbnRzIElDdWJpY1NwbGluZVZhbHVlPFQ+IHtcclxuICAgICAgICBAc2VyaWFsaXphYmxlXHJcbiAgICAgICAgcHVibGljIGRhdGFQb2ludDogVCA9IG5ldyBjb25zdHJ1Y3RvclgoKTtcclxuXHJcbiAgICAgICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgICAgIHB1YmxpYyBpblRhbmdlbnQ6IFQgPSBuZXcgY29uc3RydWN0b3JYKCk7XHJcblxyXG4gICAgICAgIEBzZXJpYWxpemFibGVcclxuICAgICAgICBwdWJsaWMgb3V0VGFuZ2VudDogVCA9IG5ldyBjb25zdHJ1Y3RvclgoKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IgKGRhdGFQb2ludD86IFQsIGluVGFuZ2VudD86IFQsIG91dFRhbmdlbnQ/OiBUKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YVBvaW50ID0gZGF0YVBvaW50IHx8IG5ldyBjb25zdHJ1Y3RvclgoKTtcclxuICAgICAgICAgICAgdGhpcy5pblRhbmdlbnQgPSBpblRhbmdlbnQgfHwgbmV3IGNvbnN0cnVjdG9yWCgpO1xyXG4gICAgICAgICAgICB0aGlzLm91dFRhbmdlbnQgPSBvdXRUYW5nZW50IHx8IG5ldyBjb25zdHJ1Y3RvclgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBsZXJwICh0bzogQ3ViaWNTcGxpbmVWYWx1ZUNsYXNzLCB0OiBudW1iZXIsIGR0OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgcDAgPSB0aGlzLmRhdGFQb2ludDtcclxuICAgICAgICAgICAgY29uc3QgcDEgPSB0by5kYXRhUG9pbnQ7XHJcbiAgICAgICAgICAgIC8vIGR0ID0+IHRfaysxIC0gdF9rXHJcbiAgICAgICAgICAgIG0wID0gc2NhbGVGeChtMCwgdGhpcy5pblRhbmdlbnQsIGR0KTtcclxuICAgICAgICAgICAgbTEgPSBzY2FsZUZ4KG0xLCB0by5vdXRUYW5nZW50LCBkdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHRfMyA9IHQgKiB0ICogdDtcclxuICAgICAgICAgICAgY29uc3QgdF8yID0gdCAqIHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGZfMCA9IDIgKiB0XzMgLSAzICogdF8yICsgMTtcclxuICAgICAgICAgICAgY29uc3QgZl8xID0gdF8zIC0gMiAqIHRfMiArIHQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGZfMiA9IC0yICogdF8zICsgMyAqIHRfMjtcclxuICAgICAgICAgICAgY29uc3QgZl8zID0gdF8zIC0gdF8yO1xyXG4gICAgICAgICAgICB0ZW1wVmFsdWUgPSBzY2FsZUZ4KHRlbXBWYWx1ZSwgcDAsIGZfMCk7XHJcbiAgICAgICAgICAgIHRlbXBWYWx1ZSA9IHNjYWxlQW5kQWRkKHRlbXBWYWx1ZSwgdGVtcFZhbHVlLCBtMCwgZl8xKTtcclxuICAgICAgICAgICAgdGVtcFZhbHVlID0gc2NhbGVBbmRBZGQodGVtcFZhbHVlLCB0ZW1wVmFsdWUsIHAxLCBmXzIpO1xyXG4gICAgICAgICAgICB0ZW1wVmFsdWUgPSBzY2FsZUFuZEFkZCh0ZW1wVmFsdWUsIHRlbXBWYWx1ZSwgbTEsIGZfMyk7XHJcbiAgICAgICAgICAgIHJldHVybiB0ZW1wVmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0Tm9MZXJwICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVBvaW50O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBAdHMtaWdub3JlIFRTMjM2N1xyXG4gICAgaWYgKGNvbnN0cnVjdG9yWCA9PT0gUXVhdCkge1xyXG4gICAgICAgIGNvbnN0IGxlcnAgPSBDdWJpY1NwbGluZVZhbHVlQ2xhc3MucHJvdG90eXBlLmxlcnA7XHJcbiAgICAgICAgQ3ViaWNTcGxpbmVWYWx1ZUNsYXNzLnByb3RvdHlwZS5sZXJwID0gZnVuY3Rpb24gKHRoaXM6IEN1YmljU3BsaW5lVmFsdWVDbGFzcywgdG86IEN1YmljU3BsaW5lVmFsdWVDbGFzcywgdDogbnVtYmVyLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IGxlcnAuY2FsbCh0aGlzLCB0bywgdCwgZHQpIGFzIFF1YXQ7XHJcbiAgICAgICAgICAgIFF1YXQubm9ybWFsaXplKHJlc3VsdCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBDdWJpY1NwbGluZVZhbHVlQ2xhc3M7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBDdWJpY1NwbGluZVZlYzJWYWx1ZSA9IG1ha2VDdWJpY1NwbGluZVZhbHVlQ29uc3RydWN0b3IoXHJcbiAgICAnY2MuQ3ViaWNTcGxpbmVWZWMyVmFsdWUnLCBWZWMyLCBWZWMyLm11bHRpcGx5U2NhbGFyLCBWZWMyLnNjYWxlQW5kQWRkKTtcclxubGVnYWN5Q0MuQ3ViaWNTcGxpbmVWZWMyVmFsdWUgPSBDdWJpY1NwbGluZVZlYzJWYWx1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBDdWJpY1NwbGluZVZlYzNWYWx1ZSA9IG1ha2VDdWJpY1NwbGluZVZhbHVlQ29uc3RydWN0b3IoXHJcbiAgICAnY2MuQ3ViaWNTcGxpbmVWZWMzVmFsdWUnLCBWZWMzLCBWZWMzLm11bHRpcGx5U2NhbGFyLCBWZWMzLnNjYWxlQW5kQWRkKTtcclxubGVnYWN5Q0MuQ3ViaWNTcGxpbmVWZWMzVmFsdWUgPSBDdWJpY1NwbGluZVZlYzNWYWx1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBDdWJpY1NwbGluZVZlYzRWYWx1ZSA9IG1ha2VDdWJpY1NwbGluZVZhbHVlQ29uc3RydWN0b3IoXHJcbiAgICAnY2MuQ3ViaWNTcGxpbmVWZWM0VmFsdWUnLCBWZWM0LCBWZWM0Lm11bHRpcGx5U2NhbGFyLCBWZWM0LnNjYWxlQW5kQWRkKTtcclxubGVnYWN5Q0MuQ3ViaWNTcGxpbmVWZWM0VmFsdWUgPSBDdWJpY1NwbGluZVZlYzRWYWx1ZTtcclxuXHJcbmV4cG9ydCBjb25zdCBDdWJpY1NwbGluZVF1YXRWYWx1ZSA9IG1ha2VDdWJpY1NwbGluZVZhbHVlQ29uc3RydWN0b3IoXHJcbiAgICAnY2MuQ3ViaWNTcGxpbmVRdWF0VmFsdWUnLCBRdWF0LCBRdWF0Lm11bHRpcGx5U2NhbGFyLCBRdWF0LnNjYWxlQW5kQWRkKTtcclxubGVnYWN5Q0MuQ3ViaWNTcGxpbmVRdWF0VmFsdWUgPSBDdWJpY1NwbGluZVF1YXRWYWx1ZTtcclxuXHJcbkBjY2NsYXNzKCdjYy5DdWJpY1NwbGluZU51bWJlclZhbHVlJylcclxuZXhwb3J0IGNsYXNzIEN1YmljU3BsaW5lTnVtYmVyVmFsdWUgaW1wbGVtZW50cyBJQ3ViaWNTcGxpbmVWYWx1ZTxudW1iZXI+IHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyBkYXRhUG9pbnQ6IG51bWJlciA9IDA7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHVibGljIGluVGFuZ2VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgb3V0VGFuZ2VudDogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoZGF0YVBvaW50OiBudW1iZXIsIGluVGFuZ2VudDogbnVtYmVyLCBvdXRUYW5nZW50OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmRhdGFQb2ludCA9IGRhdGFQb2ludDtcclxuICAgICAgICB0aGlzLmluVGFuZ2VudCA9IGluVGFuZ2VudDtcclxuICAgICAgICB0aGlzLm91dFRhbmdlbnQgPSBvdXRUYW5nZW50O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBsZXJwICh0bzogQ3ViaWNTcGxpbmVOdW1iZXJWYWx1ZSwgdDogbnVtYmVyLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcDAgPSB0aGlzLmRhdGFQb2ludDtcclxuICAgICAgICBjb25zdCBwMSA9IHRvLmRhdGFQb2ludDtcclxuICAgICAgICAvLyBkdCA9PiB0X2srMSAtIHRfa1xyXG4gICAgICAgIGNvbnN0IG0wID0gdGhpcy5vdXRUYW5nZW50ICogZHQ7XHJcbiAgICAgICAgY29uc3QgbTEgPSB0by5pblRhbmdlbnQgKiBkdDtcclxuICAgICAgICBjb25zdCB0XzMgPSB0ICogdCAqIHQ7XHJcbiAgICAgICAgY29uc3QgdF8yID0gdCAqIHQ7XHJcbiAgICAgICAgY29uc3QgZl8wID0gMiAqIHRfMyAtIDMgKiB0XzIgKyAxO1xyXG4gICAgICAgIGNvbnN0IGZfMSA9IHRfMyAtIDIgKiB0XzIgKyB0O1xyXG4gICAgICAgIGNvbnN0IGZfMiA9IC0yICogdF8zICsgMyAqIHRfMjtcclxuICAgICAgICBjb25zdCBmXzMgPSB0XzMgLSB0XzI7XHJcbiAgICAgICAgcmV0dXJuIHAwICogZl8wICsgbTAgKiBmXzEgKyBwMSAqIGZfMiArIG0xICogZl8zO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXROb0xlcnAgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFQb2ludDtcclxuICAgIH1cclxufVxyXG5sZWdhY3lDQy5DdWJpY1NwbGluZU51bWJlclZhbHVlID0gQ3ViaWNTcGxpbmVOdW1iZXJWYWx1ZTtcclxuIl19