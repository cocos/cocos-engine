(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/index.js", "./gradient.js", "../../core/default-constants.js", "../../core/index.js", "../../core/assets/asset-enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/index.js"), require("./gradient.js"), require("../../core/default-constants.js"), require("../../core/index.js"), require("../../core/assets/asset-enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.gradient, global.defaultConstants, global.index, global.assetEnum);
    global.gradientRange = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _gradient, _defaultConstants, _index4, _assetEnum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.packGradientRange = packGradientRange;
  _exports.default = void 0;
  _gradient = _interopRequireWildcard(_gradient);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _class3, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  // tslint:disable: max-line-length
  var SerializableTable = _defaultConstants.EDITOR && [['_mode', 'color'], ['_mode', 'gradient'], ['_mode', 'colorMin', 'colorMax'], ['_mode', 'gradientMin', 'gradientMax'], ['_mode', 'gradient']];
  var Mode = (0, _index3.Enum)({
    Color: 0,
    Gradient: 1,
    TwoColors: 2,
    TwoGradients: 3,
    RandomColor: 4
  });
  var GradientRange = (_dec = (0, _index.ccclass)('cc.GradientRange'), _dec2 = (0, _index.type)(Mode), _dec3 = (0, _index.type)(_gradient.default), _dec4 = (0, _index.type)(_gradient.default), _dec5 = (0, _index.type)(_gradient.default), _dec6 = (0, _index.type)(Mode), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function () {
    function GradientRange() {
      _classCallCheck(this, GradientRange);

      _initializerDefineProperty(this, "color", _descriptor, this);

      _initializerDefineProperty(this, "colorMin", _descriptor2, this);

      _initializerDefineProperty(this, "colorMax", _descriptor3, this);

      _initializerDefineProperty(this, "gradient", _descriptor4, this);

      _initializerDefineProperty(this, "gradientMin", _descriptor5, this);

      _initializerDefineProperty(this, "gradientMax", _descriptor6, this);

      _initializerDefineProperty(this, "_mode", _descriptor7, this);

      this._color = _index2.Color.WHITE.clone();
    }

    _createClass(GradientRange, [{
      key: "evaluate",
      value: function evaluate(time, rndRatio) {
        switch (this._mode) {
          case Mode.Color:
            return this.color;

          case Mode.TwoColors:
            _index2.Color.lerp(this._color, this.colorMin, this.colorMax, rndRatio);

            return this._color;

          case Mode.RandomColor:
            return this.gradient.randomColor();

          case Mode.Gradient:
            return this.gradient.evaluate(time);

          case Mode.TwoGradients:
            _index2.Color.lerp(this._color, this.gradientMin.evaluate(time), this.gradientMax.evaluate(time), rndRatio);

            return this._color;

          default:
            return this.color;
        }
      }
    }, {
      key: "_onBeforeSerialize",
      value: function _onBeforeSerialize(props) {
        return SerializableTable[this._mode];
      }
    }, {
      key: "mode",

      /**
       * @zh 渐变色类型 [[Mode]]。
       */
      get: function get() {
        return this._mode;
      },
      set: function set(m) {
        if (_defaultConstants.EDITOR) {
          if (m === Mode.RandomColor) {
            if (this.gradient.colorKeys.length === 0) {
              this.gradient.colorKeys.push(new _gradient.ColorKey());
            }

            if (this.gradient.alphaKeys.length === 0) {
              this.gradient.alphaKeys.push(new _gradient.AlphaKey());
            }
          }
        }

        this._mode = m;
      }
    }]);

    return GradientRange;
  }(), _class3.Mode = Mode, _temp), (_applyDecoratedDescriptor(_class2.prototype, "mode", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "color", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "colorMin", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "colorMax", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _index2.Color.WHITE.clone();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gradient", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradient.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "gradientMin", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradient.default();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "gradientMax", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradient.default();
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Mode.Color;
    }
  })), _class2)) || _class);
  _exports.default = GradientRange;

  // CCClass.fastDefine('cc.GradientRange', GradientRange, {
  //     mode: Mode.Color,
  //     color: cc.Color.WHITE.clone(),
  //     colorMin: cc.Color.WHITE.clone(),
  //     colorMax: cc.Color.WHITE.clone(),
  //     gradient: new Gradient(),
  //     gradientMin: null,
  //     gradientMax: null
  // });
  function evaluateGradient(gr, time, index) {
    switch (gr.mode) {
      case Mode.Color:
        return gr.color;

      case Mode.TwoColors:
        return index === 0 ? gr.colorMin : gr.colorMax;

      case Mode.RandomColor:
        return gr.gradient.randomColor();

      case Mode.Gradient:
        return gr.gradient.evaluate(time);

      case Mode.TwoGradients:
        return index === 0 ? gr.gradientMin.evaluate(time) : gr.gradientMax.evaluate(time);

      default:
        return gr.color;
    }
  }

  function evaluateHeight(gr) {
    switch (gr.mode) {
      case Mode.TwoColors:
        return 2;

      case Mode.TwoGradients:
        return 2;

      default:
        return 1;
    }
  }

  function packGradientRange(samples, gr) {
    var height = evaluateHeight(gr);
    var data = new Uint8Array(samples * height * 4);
    var interval = 1.0 / (samples - 1);
    var offset = 0;

    for (var h = 0; h < height; h++) {
      for (var j = 0; j < samples; j++) {
        var color = evaluateGradient(gr, interval * j, h);
        data[offset] = color.r;
        data[offset + 1] = color.g;
        data[offset + 2] = color.b;
        data[offset + 3] = color.a;
        offset += 4;
      }
    }

    var texture = new _index4.Texture2D();
    texture.create(samples, height, _assetEnum.PixelFormat.RGBA8888);
    texture.setFilters(_assetEnum.Filter.LINEAR, _assetEnum.Filter.LINEAR);
    texture.setWrapMode(_assetEnum.WrapMode.CLAMP_TO_EDGE, _assetEnum.WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);
    return texture;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2dyYWRpZW50LXJhbmdlLnRzIl0sIm5hbWVzIjpbIlNlcmlhbGl6YWJsZVRhYmxlIiwiRURJVE9SIiwiTW9kZSIsIkNvbG9yIiwiR3JhZGllbnQiLCJUd29Db2xvcnMiLCJUd29HcmFkaWVudHMiLCJSYW5kb21Db2xvciIsIkdyYWRpZW50UmFuZ2UiLCJfY29sb3IiLCJXSElURSIsImNsb25lIiwidGltZSIsInJuZFJhdGlvIiwiX21vZGUiLCJjb2xvciIsImxlcnAiLCJjb2xvck1pbiIsImNvbG9yTWF4IiwiZ3JhZGllbnQiLCJyYW5kb21Db2xvciIsImV2YWx1YXRlIiwiZ3JhZGllbnRNaW4iLCJncmFkaWVudE1heCIsInByb3BzIiwibSIsImNvbG9yS2V5cyIsImxlbmd0aCIsInB1c2giLCJDb2xvcktleSIsImFscGhhS2V5cyIsIkFscGhhS2V5Iiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJldmFsdWF0ZUdyYWRpZW50IiwiZ3IiLCJpbmRleCIsIm1vZGUiLCJldmFsdWF0ZUhlaWdodCIsInBhY2tHcmFkaWVudFJhbmdlIiwic2FtcGxlcyIsImhlaWdodCIsImRhdGEiLCJVaW50OEFycmF5IiwiaW50ZXJ2YWwiLCJvZmZzZXQiLCJoIiwiaiIsInIiLCJnIiwiYiIsImEiLCJ0ZXh0dXJlIiwiVGV4dHVyZTJEIiwiY3JlYXRlIiwiUGl4ZWxGb3JtYXQiLCJSR0JBODg4OCIsInNldEZpbHRlcnMiLCJGaWx0ZXIiLCJMSU5FQVIiLCJzZXRXcmFwTW9kZSIsIldyYXBNb2RlIiwiQ0xBTVBfVE9fRURHRSIsInVwbG9hZERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQTtBQUNBLE1BQU1BLGlCQUFpQixHQUFHQyw0QkFBVSxDQUNoQyxDQUFFLE9BQUYsRUFBVyxPQUFYLENBRGdDLEVBRWhDLENBQUUs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Q0FELElBQUFBLE9BQU8sQ0FBQ0UsTUFBUixDQUFlZCxPQUFmLEVBQXdCQyxNQUF4QixFQUFnQ2MsdUJBQVlDLFFBQTVDO0FBQ0FKLElBQUFBLE9BQU8sQ0FBQ0ssVUFBUixDQUFtQkMsa0JBQU9DLE1BQTFCLEVBQWtDRCxrQkFBT0MsTUFBekM7QUFDQVAsSUFBQUEsT0FBTyxDQUFDUSxXQUFSLENBQW9CQyxvQkFBU0MsYUFBN0IsRUFBNENELG9CQUFTQyxhQUFyRDtBQUNBVixJQUFBQSxPQUFPLENBQUNXLFVBQVIsQ0FBbUJyQixJQUFuQjtBQUVBLFdBQU9VLE9BQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBDb2xvciB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IEVudW0gfSBmcm9tICcuLi8uLi9jb3JlL3ZhbHVlLXR5cGVzJztcclxuaW1wb3J0IEdyYWRpZW50LCB7IEFscGhhS2V5LCBDb2xvcktleSB9IGZyb20gJy4vZ3JhZGllbnQnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBUZXh0dXJlMkQgfSBmcm9tICcuLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgUGl4ZWxGb3JtYXQsIEZpbHRlciwgV3JhcE1vZGUgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cy9hc3NldC1lbnVtJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuY29uc3QgU2VyaWFsaXphYmxlVGFibGUgPSBFRElUT1IgJiYgW1xyXG4gICAgWyAnX21vZGUnLCAnY29sb3InIF0sXHJcbiAgICBbICdfbW9kZScsICdncmFkaWVudCcgXSxcclxuICAgIFsgJ19tb2RlJywgJ2NvbG9yTWluJywgJ2NvbG9yTWF4JyBdLFxyXG4gICAgWyAnX21vZGUnLCAnZ3JhZGllbnRNaW4nLCAnZ3JhZGllbnRNYXgnXSxcclxuICAgIFsgJ19tb2RlJywgJ2dyYWRpZW50JyBdXHJcbl07XHJcblxyXG5jb25zdCBNb2RlID0gRW51bSh7XHJcbiAgICBDb2xvcjogMCxcclxuICAgIEdyYWRpZW50OiAxLFxyXG4gICAgVHdvQ29sb3JzOiAyLFxyXG4gICAgVHdvR3JhZGllbnRzOiAzLFxyXG4gICAgUmFuZG9tQ29sb3I6IDQsXHJcbn0pO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkdyYWRpZW50UmFuZ2UnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFkaWVudFJhbmdlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmuJDlj5joibLnsbvlnosgW1tNb2RlXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTW9kZSlcclxuICAgIGdldCBtb2RlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbW9kZSAobSkge1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgaWYgKG0gPT09IE1vZGUuUmFuZG9tQ29sb3IpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWRpZW50LmNvbG9yS2V5cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWRpZW50LmNvbG9yS2V5cy5wdXNoKG5ldyBDb2xvcktleSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyYWRpZW50LmFscGhhS2V5cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdyYWRpZW50LmFscGhhS2V5cy5wdXNoKG5ldyBBbHBoYUtleSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tb2RlID0gbTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIE1vZGUgPSBNb2RlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k21vZGXkuLpDb2xvcuaXtueahOminOiJsuOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb2xvciA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ulR3b0NvbG9yc+aXtueahOminOiJsuS4i+mZkOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb2xvck1pbiA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ulR3b0NvbG9yc+aXtueahOminOiJsuS4iumZkOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBjb2xvck1heCA9IENvbG9yLldISVRFLmNsb25lKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ukdyYWRpZW505pe255qE6aKc6Imy5riQ5Y+Y44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEdyYWRpZW50KVxyXG4gICAgcHVibGljIGdyYWRpZW50ID0gbmV3IEdyYWRpZW50KCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2TbW9kZeS4ulR3b0dyYWRpZW50c+aXtueahOminOiJsua4kOWPmOS4i+mZkOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShHcmFkaWVudClcclxuICAgIHB1YmxpYyBncmFkaWVudE1pbiA9IG5ldyBHcmFkaWVudCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOW9k21vZGXkuLpUd29HcmFkaWVudHPml7bnmoTpopzoibLmuJDlj5jkuIrpmZDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoR3JhZGllbnQpXHJcbiAgICBwdWJsaWMgZ3JhZGllbnRNYXggPSBuZXcgR3JhZGllbnQoKTtcclxuXHJcbiAgICBAdHlwZShNb2RlKVxyXG4gICAgcHJpdmF0ZSBfbW9kZSA9IE1vZGUuQ29sb3I7XHJcblxyXG4gICAgcHJpdmF0ZSBfY29sb3IgPSBDb2xvci5XSElURS5jbG9uZSgpO1xyXG5cclxuICAgIHB1YmxpYyBldmFsdWF0ZSAodGltZTogbnVtYmVyLCBybmRSYXRpbzogbnVtYmVyKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLl9tb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgTW9kZS5Db2xvcjpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuVHdvQ29sb3JzOlxyXG4gICAgICAgICAgICAgICAgQ29sb3IubGVycCh0aGlzLl9jb2xvciwgdGhpcy5jb2xvck1pbiwgdGhpcy5jb2xvck1heCwgcm5kUmF0aW8pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbG9yO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuUmFuZG9tQ29sb3I6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncmFkaWVudC5yYW5kb21Db2xvcigpO1xyXG4gICAgICAgICAgICBjYXNlIE1vZGUuR3JhZGllbnQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5ncmFkaWVudC5ldmFsdWF0ZSh0aW1lKTtcclxuICAgICAgICAgICAgY2FzZSBNb2RlLlR3b0dyYWRpZW50czpcclxuICAgICAgICAgICAgICAgIENvbG9yLmxlcnAodGhpcy5fY29sb3IsIHRoaXMuZ3JhZGllbnRNaW4uZXZhbHVhdGUodGltZSksIHRoaXMuZ3JhZGllbnRNYXguZXZhbHVhdGUodGltZSksIHJuZFJhdGlvKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jb2xvcjtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNvbG9yO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uQmVmb3JlU2VyaWFsaXplIChwcm9wczogYW55KTogYW55IHtcclxuICAgICAgICByZXR1cm4gU2VyaWFsaXphYmxlVGFibGVbdGhpcy5fbW9kZV07XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuR3JhZGllbnRSYW5nZScsIEdyYWRpZW50UmFuZ2UsIHtcclxuLy8gICAgIG1vZGU6IE1vZGUuQ29sb3IsXHJcbi8vICAgICBjb2xvcjogY2MuQ29sb3IuV0hJVEUuY2xvbmUoKSxcclxuLy8gICAgIGNvbG9yTWluOiBjYy5Db2xvci5XSElURS5jbG9uZSgpLFxyXG4vLyAgICAgY29sb3JNYXg6IGNjLkNvbG9yLldISVRFLmNsb25lKCksXHJcbi8vICAgICBncmFkaWVudDogbmV3IEdyYWRpZW50KCksXHJcbi8vICAgICBncmFkaWVudE1pbjogbnVsbCxcclxuLy8gICAgIGdyYWRpZW50TWF4OiBudWxsXHJcbi8vIH0pO1xyXG5mdW5jdGlvbiBldmFsdWF0ZUdyYWRpZW50IChncjogR3JhZGllbnRSYW5nZSwgdGltZTogbnVtYmVyLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBzd2l0Y2ggKGdyLm1vZGUpIHtcclxuICAgICAgICBjYXNlIE1vZGUuQ29sb3I6XHJcbiAgICAgICAgICAgIHJldHVybiBnci5jb2xvcjtcclxuICAgICAgICBjYXNlIE1vZGUuVHdvQ29sb3JzOlxyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXggPT09IDAgPyBnci5jb2xvck1pbiA6IGdyLmNvbG9yTWF4O1xyXG4gICAgICAgIGNhc2UgTW9kZS5SYW5kb21Db2xvcjpcclxuICAgICAgICAgICAgcmV0dXJuIGdyLmdyYWRpZW50LnJhbmRvbUNvbG9yKCk7XHJcbiAgICAgICAgY2FzZSBNb2RlLkdyYWRpZW50OlxyXG4gICAgICAgICAgICByZXR1cm4gZ3IuZ3JhZGllbnQuZXZhbHVhdGUodGltZSk7XHJcbiAgICAgICAgY2FzZSBNb2RlLlR3b0dyYWRpZW50czpcclxuICAgICAgICAgICAgcmV0dXJuIGluZGV4ID09PSAwID8gZ3IuZ3JhZGllbnRNaW4uZXZhbHVhdGUodGltZSkgOiBnci5ncmFkaWVudE1heC5ldmFsdWF0ZSh0aW1lKTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gZ3IuY29sb3I7XHJcbiAgICB9XHJcbn1cclxuZnVuY3Rpb24gZXZhbHVhdGVIZWlnaHQgKGdyOiBHcmFkaWVudFJhbmdlKSB7XHJcbiAgICBzd2l0Y2ggKGdyLm1vZGUpIHtcclxuICAgICAgICBjYXNlIE1vZGUuVHdvQ29sb3JzOlxyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICBjYXNlIE1vZGUuVHdvR3JhZGllbnRzOlxyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gcGFja0dyYWRpZW50UmFuZ2UgKHNhbXBsZXM6IG51bWJlciwgZ3I6IEdyYWRpZW50UmFuZ2UpIHtcclxuICAgIGNvbnN0IGhlaWdodCA9IGV2YWx1YXRlSGVpZ2h0KGdyKTtcclxuICAgIGNvbnN0IGRhdGEgPSBuZXcgVWludDhBcnJheShzYW1wbGVzICogaGVpZ2h0ICogNCk7XHJcbiAgICBjb25zdCBpbnRlcnZhbCA9IDEuMCAvIChzYW1wbGVzIC0gMSk7XHJcbiAgICBsZXQgb2Zmc2V0ID0gMDtcclxuXHJcbiAgICBmb3IgKGxldCBoID0gMDsgaCA8IGhlaWdodDsgaCsrKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBzYW1wbGVzOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBldmFsdWF0ZUdyYWRpZW50KGdyLCBpbnRlcnZhbCAqIGosIGgpO1xyXG4gICAgICAgICAgICBkYXRhW29mZnNldF0gPSBjb2xvci5yO1xyXG4gICAgICAgICAgICBkYXRhW29mZnNldCArIDFdID0gY29sb3IuZztcclxuICAgICAgICAgICAgZGF0YVtvZmZzZXQgKyAyXSA9IGNvbG9yLmI7XHJcbiAgICAgICAgICAgIGRhdGFbb2Zmc2V0ICsgM10gPSBjb2xvci5hO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gNDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdGV4dHVyZSA9IG5ldyBUZXh0dXJlMkQoKTtcclxuICAgIHRleHR1cmUuY3JlYXRlKHNhbXBsZXMsIGhlaWdodCwgUGl4ZWxGb3JtYXQuUkdCQTg4ODgpO1xyXG4gICAgdGV4dHVyZS5zZXRGaWx0ZXJzKEZpbHRlci5MSU5FQVIsIEZpbHRlci5MSU5FQVIpO1xyXG4gICAgdGV4dHVyZS5zZXRXcmFwTW9kZShXcmFwTW9kZS5DTEFNUF9UT19FREdFLCBXcmFwTW9kZS5DTEFNUF9UT19FREdFKTtcclxuICAgIHRleHR1cmUudXBsb2FkRGF0YShkYXRhKTtcclxuXHJcbiAgICByZXR1cm4gdGV4dHVyZTtcclxufSJdfQ==