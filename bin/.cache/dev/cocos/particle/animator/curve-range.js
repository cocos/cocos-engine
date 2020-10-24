(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/index.js", "../../core/geometry/index.js", "../../core/index.js", "../../core/assets/asset-enum.js", "../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/index.js"), require("../../core/geometry/index.js"), require("../../core/index.js"), require("../../core/assets/asset-enum.js"), require("../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.index, global.assetEnum, global.defaultConstants);
    global.curveRange = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _index5, _assetEnum, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.packCurveRangeZ = packCurveRangeZ;
  _exports.packCurveRangeN = packCurveRangeN;
  _exports.packCurveRangeXY = packCurveRangeXY;
  _exports.packCurveRangeXYZ = packCurveRangeXYZ;
  _exports.packCurveRangeXYZW = packCurveRangeXYZW;
  _exports.default = _exports.Mode = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _class3, _temp;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var SerializableTable = _defaultConstants.EDITOR && [['mode', 'constant', 'multiplier'], ['mode', 'curve', 'multiplier'], ['mode', 'curveMin', 'curveMax', 'multiplier'], ['mode', 'constantMin', 'constantMax', 'multiplier']];
  var Mode = (0, _index3.Enum)({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3
  });
  _exports.Mode = Mode;
  var CurveRange = (_dec = (0, _index.ccclass)('cc.CurveRange'), _dec2 = (0, _index.type)(Mode), _dec3 = (0, _index.type)(_index4.AnimationCurve), _dec4 = (0, _index.type)(_index4.AnimationCurve), _dec5 = (0, _index.type)(_index4.AnimationCurve), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function () {
    /**
     * @zh 曲线类型[[Mode]]。
     */

    /**
     * @zh 当mode为Curve时，使用的曲线。
     */

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     */

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */

    /**
     * @zh 当mode为Constant时，曲线的值。
     */

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */

    /**
     * @zh 应用于曲线插值的系数。
     */
    function CurveRange() {
      _classCallCheck(this, CurveRange);

      _initializerDefineProperty(this, "mode", _descriptor, this);

      _initializerDefineProperty(this, "curve", _descriptor2, this);

      _initializerDefineProperty(this, "curveMin", _descriptor3, this);

      _initializerDefineProperty(this, "curveMax", _descriptor4, this);

      _initializerDefineProperty(this, "constant", _descriptor5, this);

      _initializerDefineProperty(this, "constantMin", _descriptor6, this);

      _initializerDefineProperty(this, "constantMax", _descriptor7, this);

      _initializerDefineProperty(this, "multiplier", _descriptor8, this);
    }

    _createClass(CurveRange, [{
      key: "evaluate",
      value: function evaluate(time, rndRatio) {
        switch (this.mode) {
          case Mode.Constant:
            return this.constant;

          case Mode.Curve:
            return this.curve.evaluate(time) * this.multiplier;

          case Mode.TwoCurves:
            return (0, _index2.lerp)(this.curveMin.evaluate(time), this.curveMax.evaluate(time), rndRatio) * this.multiplier;

          case Mode.TwoConstants:
            return (0, _index2.lerp)(this.constantMin, this.constantMax, rndRatio);
        }
      }
    }, {
      key: "getMax",
      value: function getMax() {
        switch (this.mode) {
          case Mode.Constant:
            return this.constant;

          case Mode.Curve:
            return this.multiplier;

          case Mode.TwoConstants:
            return this.constantMax;

          case Mode.TwoCurves:
            return this.multiplier;
        }

        return 0;
      }
    }, {
      key: "_onBeforeSerialize",
      value: function _onBeforeSerialize(props) {
        return SerializableTable[this.mode];
      }
    }]);

    return CurveRange;
  }(), _class3.Mode = Mode, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Mode.Constant;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "curve", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.AnimationCurve();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "curveMin", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.AnimationCurve();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "curveMax", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index4.AnimationCurve();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "constant", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "constantMin", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "constantMax", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "multiplier", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  })), _class2)) || _class);
  _exports.default = CurveRange;

  function evaluateCurve(cr, time, index) {
    switch (cr.mode) {
      case Mode.Constant:
        return cr.constant;

      case Mode.Curve:
        return cr.curve.evaluate(time) * cr.multiplier;

      case Mode.TwoCurves:
        return index === 0 ? cr.curveMin.evaluate(time) * cr.multiplier : cr.curveMax.evaluate(time) * cr.multiplier;

      case Mode.TwoConstants:
        return index === 0 ? cr.constantMin : cr.constantMax;

      default:
        return 0;
    }
  }

  function evaluateHeight(cr) {
    switch (cr.mode) {
      case Mode.TwoConstants:
        return 2;

      case Mode.TwoCurves:
        return 2;

      default:
        return 1;
    }
  }

  function packTexture(data, width, height) {
    var image = new _index5.ImageAsset({
      width: width,
      height: height,
      _data: data,
      _compressed: false,
      format: _assetEnum.PixelFormat.RGBA32F
    });
    var texture = new _index5.Texture2D();
    texture.setFilters(_assetEnum.Filter.NEAREST, _assetEnum.Filter.NEAREST);
    texture.setMipFilter(_assetEnum.Filter.NONE);
    texture.setWrapMode(_assetEnum.WrapMode.CLAMP_TO_EDGE, _assetEnum.WrapMode.CLAMP_TO_EDGE, _assetEnum.WrapMode.CLAMP_TO_EDGE);
    texture.image = image;
    return texture;
  }

  function packCurveRangeZ(samples, cr, discrete) {
    var height = evaluateHeight(cr);
    var data = new Float32Array(samples * height * 4);
    var interval = 1.0 / (samples - 1);
    var sum = 0;
    var average = 0;
    var offset = 0;

    for (var h = 0; h < height; h++) {
      sum = 0;

      for (var j = 0; j < samples; j++) {
        var value = evaluateCurve(cr, interval * j, h);

        if (discrete) {
          average = value;
        } else {
          sum += value;
          average = sum / (j + 1);
        }

        data[offset + 2] = value;
        offset += 4;
      }
    }

    return packTexture(data, samples, height);
  }

  function packCurveRangeN(samples, cr, discrete) {
    var height = evaluateHeight(cr);
    var data = new Float32Array(samples * height * 4);
    var interval = 1.0 / (samples - 1);
    var sum = 0;
    var average = 0;
    var offset = 0;

    for (var h = 0; h < height; h++) {
      sum = 0;

      for (var j = 0; j < samples; j++) {
        var value = evaluateCurve(cr, interval * j, h);

        if (discrete) {
          average = value;
        } else {
          sum += value;
          average = sum / (j + 1);
        }

        data[offset] = average;
        data[offset + 1] = average;
        data[offset + 2] = average;
        offset += 4;
      }
    }

    return packTexture(data, samples, height);
  }

  function packCurveRangeXY(samples, x, y, discrete) {
    var height = Math.max(evaluateHeight(x), evaluateHeight(y));
    var data = new Float32Array(samples * height * 4);
    var curves = [x, y];
    var interval = 1.0 / (samples - 1);

    for (var h = 0; h < height; h++) {
      for (var i = 0; i < 2; i++) {
        var cr = curves[i];
        var sum = 0;
        var average = 0;

        for (var j = 0; j < samples; j++) {
          var value = evaluateCurve(cr, interval * j, h);

          if (discrete) {
            average = value;
          } else {
            sum += value;
            average = sum / (j + 1);
          }

          data[j * 4 + i] = average;
        }
      }
    }

    return packTexture(data, samples, height);
  }

  function packCurveRangeXYZ(samples, x, y, z, discrete) {
    var height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z));
    var data = new Float32Array(samples * height * 4);
    var curves = [x, y, z];
    var interval = 1.0 / (samples - 1);

    for (var h = 0; h < height; h++) {
      for (var i = 0; i < 3; i++) {
        var cr = curves[i];
        var sum = 0;
        var average = 0;

        for (var j = 0; j < samples; j++) {
          var value = evaluateCurve(cr, interval * j, h);

          if (discrete) {
            average = value;
          } else {
            sum += value;
            average = sum / (j + 1);
          }

          data[j * 4 + i] = average;
        }
      }
    }

    return packTexture(data, samples, height);
  }

  function packCurveRangeXYZW(samples, x, y, z, w, discrete) {
    var height = Math.max(evaluateHeight(x), evaluateHeight(y), evaluateHeight(z), evaluateHeight(w));
    var data = new Float32Array(samples * height * 4);
    var curves = [x, y, z, w];
    var interval = 1.0 / (samples - 1);

    for (var h = 0; h < height; h++) {
      for (var i = 0; i < 4; i++) {
        var cr = curves[i];
        var sum = 0;
        var average = 0;

        for (var j = 0; j < samples; j++) {
          var value = evaluateCurve(cr, interval * j, h);

          if (discrete) {
            average = value;
          } else {
            sum += value;
            average = sum / (j + 1);
          }

          data[j * 4 + i] = average;
        }
      }
    }

    return packTexture(data, samples, height);
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2N1cnZlLXJhbmdlLnRzIl0sIm5hbWVzIjpbIlNlcmlhbGl6YWJsZVRhYmxlIiwiRURJVE9SIiwiTW9kZSIsIkNvbnN0YW50IiwiQ3VydmUiLCJUd29DdXJ2ZXMiLCJUd29Db25zdGFudHMiLCJDdXJ2ZVJhbmdlIiwiQW5pbWF0aW9uQ3VydmUiLCJ0aW1lIiwicm5kUmF0aW8iLCJtb2RlIiwiY29uc3RhbnQiLCJjdXJ2ZSIsImV2YWx1YXRlIiwibXVsdGlwbGllciIsImN1cnZlTWluIiwiY3VydmVNYXgiLCJjb25zdGFudE1pbiIsImNvbnN0YW50TWF4IiwicHJvcHMiLCJzZXJpYWxpemFibGUiLCJlZGl0YWJsZSIsImV2YWx1YXRlQ3VydmUiLCJjciIsImluZGV4IiwiZXZhbHVhdGVIZWlnaHQiLCJwYWNrVGV4dHVyZSIsImRhdGEiLCJ3aWR0aCIsImhlaWdodCIsImltYWdlIiwiSW1hZ2VBc3NldCIsIl9kYXRhIiwiX2NvbXByZXNzZWQiLCJmb3JtYXQiLCJQaXhlbEZvcm1hdCIsIlJHQkEzMkYiLCJ0ZXh0dXJlIiwiVGV4dHVyZTJEIiwic2V0RmlsdGVycyIsIkZpbHRlciIsIk5FQVJFU1QiLCJzZXRNaXBGaWx0ZXIiLCJOT05FIiwic2V0V3JhcE1vZGUiLCJXcmFwTW9kZSIsIkNMQU1QX1RPX0VER0UiLCJwYWNrQ3VydmVSYW5nZVoiLCJzYW1wbGVzIiwiZGlzY3JldGUiLCJGbG9hdDMyQXJyYXkiLCJpbnRlcnZhbCIsInN1bSIsImF2ZXJhZ2UiLCJvZmZzZXQiLCJoIiwiaiIsInZhbHVlIiwicGFja0N1cnZlUmFuZ2VOIiwicGFja0N1cnZlUmFuZ2VYWSIsIngiLCJ5IiwiTWF0aCIsIm1heCIsImN1cnZlcyIsImkiLCJwYWNrQ3VydmVSYW5nZVhZWiIsInoiLCJwYWNrQ3VydmVSYW5nZVhZWlciLCJ3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7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TCxZQUFBQSxHQUFHLElBQUlLLEtBQVA7QUFDQUosWUFBQUEsT0FBTyxHQUFHRCxHQUFHLElBQUlJLENBQUMsR0FBRyxDQUFSLENBQWI7QUFDSDs7QUFDRDdCLFVBQUFBLElBQUksQ0FBQzZCLENBQUMsR0FBRyxDQUFKLEdBQVFTLENBQVQsQ0FBSixHQUFrQlosT0FBbEI7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsV0FBTzNCLFdBQVcsQ0FBQ0MsSUFBRCxFQUFPcUIsT0FBUCxFQUFnQm5CLE1BQWhCLENBQWxCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBsZXJwIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBBbmltYXRpb25DdXJ2ZSB9IGZyb20gJy4uLy4uL2NvcmUvZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBUZXh0dXJlMkQsIEltYWdlQXNzZXQgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgUGl4ZWxGb3JtYXQsIEZpbHRlciwgV3JhcE1vZGUgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9hc3NldC1lbnVtJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuXHJcbmNvbnN0IFNlcmlhbGl6YWJsZVRhYmxlID0gRURJVE9SICYmIFtcclxuICAgIFsgJ21vZGUnLCAnY29uc3RhbnQnLCAnbXVsdGlwbGllcicgXSxcclxuICAgIFsgJ21vZGUnLCAnY3VydmUnLCAnbXVsdGlwbGllcicgXSxcclxuICAgIFsgJ21vZGUnLCAnY3VydmVNaW4nLCAnY3VydmVNYXgnLCAnbXVsdGlwbGllcicgXSxcclxuICAgIFsgJ21vZGUnLCAnY29uc3RhbnRNaW4nLCAnY29uc3RhbnRNYXgnLCAnbXVsdGlwbGllciddXHJcbl07XHJcblxyXG5leHBvcnQgY29uc3QgTW9kZSA9IEVudW0oe1xyXG4gICAgQ29uc3RhbnQ6IDAsXHJcbiAgICBDdXJ2ZTogMSxcclxuICAgIFR3b0N1cnZlczogMixcclxuICAgIFR3b0NvbnN0YW50czogMyxcclxufSk7XHJcblxyXG5AY2NjbGFzcygnY2MuQ3VydmVSYW5nZScpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEN1cnZlUmFuZ2UgIHtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIE1vZGUgPSBNb2RlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOabsue6v+exu+Wei1tbTW9kZV1d44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE1vZGUpXHJcbiAgICBwdWJsaWMgbW9kZSA9IE1vZGUuQ29uc3RhbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ukN1cnZl5pe277yM5L2/55So55qE5puy57q/44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEFuaW1hdGlvbkN1cnZlKVxyXG4gICAgcHVibGljIGN1cnZlID0gbmV3IEFuaW1hdGlvbkN1cnZlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ulR3b0N1cnZlc+aXtu+8jOS9v+eUqOeahOabsue6v+S4i+mZkOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShBbmltYXRpb25DdXJ2ZSlcclxuICAgIHB1YmxpYyBjdXJ2ZU1pbiA9IG5ldyBBbmltYXRpb25DdXJ2ZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k21vZGXkuLpUd29DdXJ2ZXPml7bvvIzkvb/nlKjnmoTmm7Lnur/kuIrpmZDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQW5pbWF0aW9uQ3VydmUpXHJcbiAgICBwdWJsaWMgY3VydmVNYXggPSBuZXcgQW5pbWF0aW9uQ3VydmUoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlvZNtb2Rl5Li6Q29uc3RhbnTml7bvvIzmm7Lnur/nmoTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgY29uc3RhbnQgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k21vZGXkuLpUd29Db25zdGFudHPml7bvvIzmm7Lnur/nmoTkuIrpmZDjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgY29uc3RhbnRNaW4gPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k21vZGXkuLpUd29Db25zdGFudHPml7bvvIzmm7Lnur/nmoTkuIvpmZDjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgY29uc3RhbnRNYXggPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW6lOeUqOS6juabsue6v+aPkuWAvOeahOezu+aVsOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBtdWx0aXBsaWVyID0gMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBldmFsdWF0ZSAodGltZTogbnVtYmVyLCBybmRSYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBNb2RlLkNvbnN0YW50OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RhbnQ7XHJcbiAgICAgICAgICAgIGNhc2UgTW9kZS5DdXJ2ZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnZlLmV2YWx1YXRlKHRpbWUpICogdGhpcy5tdWx0aXBsaWVyO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvQ3VydmVzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlcnAodGhpcy5jdXJ2ZU1pbi5ldmFsdWF0ZSh0aW1lKSwgdGhpcy5jdXJ2ZU1heC5ldmFsdWF0ZSh0aW1lKSwgcm5kUmF0aW8pICogdGhpcy5tdWx0aXBsaWVyO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvQ29uc3RhbnRzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxlcnAodGhpcy5jb25zdGFudE1pbiwgdGhpcy5jb25zdGFudE1heCwgcm5kUmF0aW8pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0TWF4ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Db25zdGFudDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbnN0YW50O1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuQ3VydmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBsaWVyO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvQ29uc3RhbnRzOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29uc3RhbnRNYXg7XHJcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Ud29DdXJ2ZXM6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBsaWVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uQmVmb3JlU2VyaWFsaXplIChwcm9wcykge1xyXG4gICAgICAgIHJldHVybiBTZXJpYWxpemFibGVUYWJsZVt0aGlzLm1vZGVdO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBldmFsdWF0ZUN1cnZlIChjcjogQ3VydmVSYW5nZSwgdGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBzd2l0Y2ggKGNyLm1vZGUpIHtcclxuICAgICAgICBjYXNlIE1vZGUuQ29uc3RhbnQ6XHJcbiAgICAgICAgICAgIHJldHVybiBjci5jb25zdGFudDtcclxuICAgICAgICBjYXNlIE1vZGUuQ3VydmU6XHJcbiAgICAgICAgICAgIHJldHVybiBjci5jdXJ2ZS5ldmFsdWF0ZSh0aW1lKSAqIGNyLm11bHRpcGxpZXI7XHJcbiAgICAgICAgY2FzZSBNb2RlLlR3b0N1cnZlczpcclxuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gY3IuY3VydmVNaW4uZXZhbHVhdGUodGltZSkgKiBjci5tdWx0aXBsaWVyIDogY3IuY3VydmVNYXguZXZhbHVhdGUodGltZSkgKiBjci5tdWx0aXBsaWVyO1xyXG4gICAgICAgIGNhc2UgTW9kZS5Ud29Db25zdGFudHM6XHJcbiAgICAgICAgICAgIHJldHVybiBpbmRleCA9PT0gMCA/IGNyLmNvbnN0YW50TWluIDogY3IuY29uc3RhbnRNYXg7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGV2YWx1YXRlSGVpZ2h0IChjcjogQ3VydmVSYW5nZSkge1xyXG4gICAgc3dpdGNoIChjci5tb2RlKSB7XHJcbiAgICAgICAgY2FzZSBNb2RlLlR3b0NvbnN0YW50czpcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgY2FzZSBNb2RlLlR3b0N1cnZlczpcclxuICAgICAgICAgICAgcmV0dXJuIDI7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBhY2tUZXh0dXJlIChkYXRhLCB3aWR0aCwgaGVpZ2h0KSB7XHJcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZUFzc2V0KHtcclxuICAgICAgICB3aWR0aCxcclxuICAgICAgICBoZWlnaHQsXHJcbiAgICAgICAgX2RhdGE6IGRhdGEsXHJcbiAgICAgICAgX2NvbXByZXNzZWQ6IGZhbHNlLFxyXG4gICAgICAgIGZvcm1hdDogUGl4ZWxGb3JtYXQuUkdCQTMyRixcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgVGV4dHVyZTJEKCk7XHJcbiAgICB0ZXh0dXJlLnNldEZpbHRlcnMoRmlsdGVyLk5FQVJFU1QsIEZpbHRlci5ORUFSRVNUKTtcclxuICAgIHRleHR1cmUuc2V0TWlwRmlsdGVyKEZpbHRlci5OT05FKTtcclxuICAgIHRleHR1cmUuc2V0V3JhcE1vZGUoV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSwgV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSwgV3JhcE1vZGUuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICB0ZXh0dXJlLmltYWdlID0gaW1hZ2U7XHJcblxyXG4gICAgcmV0dXJuIHRleHR1cmU7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWNrQ3VydmVSYW5nZVogKHNhbXBsZXM6bnVtYmVyLCBjcjogQ3VydmVSYW5nZSwgZGlzY3JldGU/OiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBldmFsdWF0ZUhlaWdodChjcik7XHJcbiAgICBjb25zdCBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShzYW1wbGVzICogaGVpZ2h0ICogNCk7XHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IDEuMCAvIChzYW1wbGVzIC0gMSk7XHJcbiAgICBsZXQgc3VtID0gMDtcclxuICAgIGxldCBhdmVyYWdlID0gMDtcclxuICAgIGxldCBvZmZzZXQgPSAwO1xyXG5cclxuICAgIGZvciAobGV0IGggPSAwOyBoIDwgaGVpZ2h0OyBoKyspIHtcclxuICAgICAgICBzdW0gPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2FtcGxlczsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZXZhbHVhdGVDdXJ2ZShjciwgaW50ZXJ2YWwgKiBqLCBoKTtcclxuICAgICAgICAgICAgaWYgKGRpc2NyZXRlKSB7XHJcbiAgICAgICAgICAgICAgICBhdmVyYWdlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzdW0gKz0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICBhdmVyYWdlID0gc3VtIC8gKGogKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkYXRhW29mZnNldCArIDJdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIG9mZnNldCArPSA0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYWNrVGV4dHVyZShkYXRhLCBzYW1wbGVzLCBoZWlnaHQpO1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiBwYWNrQ3VydmVSYW5nZU4gKHNhbXBsZXM6bnVtYmVyLCBjcjogQ3VydmVSYW5nZSwgZGlzY3JldGU/OiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBldmFsdWF0ZUhlaWdodChjcik7XHJcbiAgICBjb25zdCBkYXRhID0gbmV3IEZsb2F0MzJBcnJheShzYW1wbGVzICogaGVpZ2h0ICogNCk7XHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IDEuMCAvIChzYW1wbGVzIC0gMSk7XHJcbiAgICBsZXQgc3VtID0gMDtcclxuICAgIGxldCBhdmVyYWdlID0gMDtcclxuICAgIGxldCBvZmZzZXQgPSAwO1xyXG4gICAgZm9yIChsZXQgaCA9IDA7IGggPCBoZWlnaHQ7IGgrKykge1xyXG4gICAgICAgIHN1bSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzYW1wbGVzOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBldmFsdWF0ZUN1cnZlKGNyLCBpbnRlcnZhbCAqIGosIGgpO1xyXG4gICAgICAgICAgICBpZiAoZGlzY3JldGUpIHtcclxuICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN1bSArPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSBzdW0gLyAoaiArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0XSA9IGF2ZXJhZ2U7XHJcbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICsgMV0gPSBhdmVyYWdlO1xyXG4gICAgICAgICAgICBkYXRhW29mZnNldCArIDJdID0gYXZlcmFnZTtcclxuICAgICAgICAgICAgb2Zmc2V0ICs9IDQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhY2tUZXh0dXJlKGRhdGEsIHNhbXBsZXMsIGhlaWdodCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWNrQ3VydmVSYW5nZVhZIChzYW1wbGVzOiBudW1iZXIsIHg6IEN1cnZlUmFuZ2UsIHk6IEN1cnZlUmFuZ2UsIGRpc2NyZXRlPzogYm9vbGVhbikge1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoZXZhbHVhdGVIZWlnaHQoeCksIGV2YWx1YXRlSGVpZ2h0KHkpKTtcclxuICAgIGNvbnN0IGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHNhbXBsZXMgKiBoZWlnaHQgKiA0KTtcclxuICAgIGNvbnN0IGN1cnZlczogQ3VydmVSYW5nZVtdID0gW3gsIHldO1xyXG4gICAgY29uc3QgaW50ZXJ2YWwgPSAxLjAgLyAoc2FtcGxlcyAtIDEpO1xyXG5cclxuICAgIGZvciAobGV0IGggPSAwOyBoIDwgaGVpZ2h0OyBoKyspIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDI7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjciA9IGN1cnZlc1tpXTtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBhdmVyYWdlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzYW1wbGVzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZXZhbHVhdGVDdXJ2ZShjciwgaW50ZXJ2YWwgKiBqLCBoKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXNjcmV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VtICs9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSBzdW0gLyAoaiArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YVtqICogNCArIGldID0gYXZlcmFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYWNrVGV4dHVyZShkYXRhLCBzYW1wbGVzLCBoZWlnaHQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFja0N1cnZlUmFuZ2VYWVogKHNhbXBsZXM6IG51bWJlciwgeDogQ3VydmVSYW5nZSwgeTogQ3VydmVSYW5nZSwgejogQ3VydmVSYW5nZSwgZGlzY3JldGU/OiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBoZWlnaHQgPSBNYXRoLm1heChldmFsdWF0ZUhlaWdodCh4KSwgZXZhbHVhdGVIZWlnaHQoeSksIGV2YWx1YXRlSGVpZ2h0KHopKTtcclxuICAgIGNvbnN0IGRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHNhbXBsZXMgKiBoZWlnaHQgKiA0KTtcclxuICAgIGNvbnN0IGN1cnZlczogQ3VydmVSYW5nZVtdID0gW3gsIHksIHpdO1xyXG4gICAgY29uc3QgaW50ZXJ2YWwgPSAxLjAgLyAoc2FtcGxlcyAtIDEpO1xyXG5cclxuICAgIGZvciAobGV0IGggPSAwOyBoIDwgaGVpZ2h0OyBoKyspIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBjciA9IGN1cnZlc1tpXTtcclxuICAgICAgICAgICAgbGV0IHN1bSA9IDA7XHJcbiAgICAgICAgICAgIGxldCBhdmVyYWdlID0gMDtcclxuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzYW1wbGVzOyBqKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZXZhbHVhdGVDdXJ2ZShjciwgaW50ZXJ2YWwgKiBqLCBoKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXNjcmV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3VtICs9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGF2ZXJhZ2UgPSBzdW0gLyAoaiArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZGF0YVtqICogNCArIGldID0gYXZlcmFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBwYWNrVGV4dHVyZShkYXRhLCBzYW1wbGVzLCBoZWlnaHQpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFja0N1cnZlUmFuZ2VYWVpXIChzYW1wbGVzOiBudW1iZXIsIHg6IEN1cnZlUmFuZ2UsIHk6IEN1cnZlUmFuZ2UsIHo6IEN1cnZlUmFuZ2UsIHc6IEN1cnZlUmFuZ2UsIGRpc2NyZXRlPzogYm9vbGVhbikge1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gTWF0aC5tYXgoZXZhbHVhdGVIZWlnaHQoeCksIGV2YWx1YXRlSGVpZ2h0KHkpLCBldmFsdWF0ZUhlaWdodCh6KSwgZXZhbHVhdGVIZWlnaHQodykpO1xyXG4gICAgY29uc3QgZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoc2FtcGxlcyAqIGhlaWdodCAqIDQpO1xyXG4gICAgY29uc3QgY3VydmVzOiBDdXJ2ZVJhbmdlW10gPSBbeCwgeSwgeiwgd107XHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IDEuMCAvIChzYW1wbGVzIC0gMSk7XHJcblxyXG4gICAgZm9yIChsZXQgaCA9IDA7IGggPCBoZWlnaHQ7IGgrKykge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNyID0gY3VydmVzW2ldO1xyXG4gICAgICAgICAgICBsZXQgc3VtID0gMDtcclxuICAgICAgICAgICAgbGV0IGF2ZXJhZ2UgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNhbXBsZXM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBldmFsdWF0ZUN1cnZlKGNyLCBpbnRlcnZhbCAqIGosIGgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc2NyZXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXZlcmFnZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzdW0gKz0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgYXZlcmFnZSA9IHN1bSAvIChqICsgMSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBkYXRhW2ogKiA0ICsgaV0gPSBhdmVyYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHBhY2tUZXh0dXJlKGRhdGEsIHNhbXBsZXMsIGhlaWdodCk7XHJcbn1cclxuIl19