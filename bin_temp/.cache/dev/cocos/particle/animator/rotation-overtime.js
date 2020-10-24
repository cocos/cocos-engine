(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../particle.js", "./curve-range.js", "../enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../particle.js"), require("./curve-range.js"), require("../enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.particle, global.curveRange, global._enum);
    global.rotationOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _particle, _curveRange, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  // tslint:disable: max-line-length
  var ROTATION_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.ROTATION;
  var RotationOvertimeModule = (_dec = (0, _index.ccclass)('cc.RotationOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.displayOrder)(1), _dec4 = (0, _index.tooltip)('是否三个轴分开设定旋转（暂不支持）'), _dec5 = (0, _index.type)(_curveRange.default), _dec6 = (0, _index.range)([-1, 1]), _dec7 = (0, _index.displayOrder)(2), _dec8 = (0, _index.tooltip)('绕 X 轴设定旋转'), _dec9 = (0, _index.type)(_curveRange.default), _dec10 = (0, _index.range)([-1, 1]), _dec11 = (0, _index.displayOrder)(3), _dec12 = (0, _index.tooltip)('绕 Y 轴设定旋转'), _dec13 = (0, _index.type)(_curveRange.default), _dec14 = (0, _index.range)([-1, 1]), _dec15 = (0, _index.displayOrder)(4), _dec16 = (0, _index.tooltip)('绕 Z 轴设定旋转'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(RotationOvertimeModule, _ParticleModuleBase);

    function RotationOvertimeModule() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RotationOvertimeModule);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RotationOvertimeModule)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_separateAxes", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "x", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "y", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "z", _descriptor5, _assertThisInitialized(_this));

      _this.name = _particle.PARTICLE_MODULE_NAME.ROTATION;
      return _this;
    }

    _createClass(RotationOvertimeModule, [{
      key: "animate",
      value: function animate(p, dt) {
        var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

        if (!this._separateAxes) {
          p.rotation.z += this.z.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET)) * dt;
        } else {
          // TODO: separateAxes is temporarily not supported!
          var rotationRand = (0, _index2.pseudoRandom)(p.randomSeed + ROTATION_OVERTIME_RAND_OFFSET);
          p.rotation.x += this.x.evaluate(normalizedTime, rotationRand) * dt;
          p.rotation.y += this.y.evaluate(normalizedTime, rotationRand) * dt;
          p.rotation.z += this.z.evaluate(normalizedTime, rotationRand) * dt;
        }
      }
    }, {
      key: "enable",

      /**
       * @zh 是否启用。
       */
      get: function get() {
        return this._enable;
      },
      set: function set(val) {
        if (this._enable === val) return;
        this._enable = val;
        if (!this.target) return;
        this.target.enableModule(this.name, val, this);
      }
    }, {
      key: "separateAxes",

      /**
       * @zh 是否三个轴分开设定旋转（暂不支持）。
       */
      get: function get() {
        return this._separateAxes;
      },
      set: function set(val) {
        this._separateAxes = val;
      }
      /**
       * @zh 绕 X 轴设定旋转。
       */

    }]);

    return RotationOvertimeModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_separateAxes", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "separateAxes"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec5, _index.serializable, _dec6, _index.radian, _dec7, _dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec9, _index.serializable, _dec10, _index.radian, _dec11, _dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec13, _index.serializable, _dec14, _index.radian, _dec15, _dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.RotationOvertimeModule', RotationOvertimeModule, {
  //     enable: false,
  //     _separateAxes: false,
  //     x: new CurveRange(),
  //     y: new CurveRange(),
  //     z: new CurveRange()
  // });

  _exports.default = RotationOvertimeModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL3JvdGF0aW9uLW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIlJPVEFUSU9OX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiTW9kdWxlUmFuZFNlZWQiLCJST1RBVElPTiIsIlJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUiLCJDdXJ2ZVJhbmdlIiwibmFtZSIsIlBBUlRJQ0xFX01PRFVMRV9OQU1FIiwicCIsImR0Iiwibm9ybWFsaXplZFRpbWUiLCJyZW1haW5pbmdMaWZldGltZSIsInN0YXJ0TGlmZXRpbWUiLCJfc2VwYXJhdGVBeGVzIiwicm90YXRpb24iLCJ6IiwiZXZhbHVhdGUiLCJyYW5kb21TZWVkIiwicm90YXRpb25SYW5kIiwieCIsInkiLCJfZW5hYmxlIiwidmFsIiwidGFyZ2V0IiwiZW5hYmxlTW9kdWxlIiwiUGFydGljbGVNb2R1bGVCYXNlIiwic2VyaWFsaXphYmxlIiwicmFkaWFuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBV0E7QUFDQSxNQUFNQSw2QkFBNkIsR0FBR0MscUJBQWVDLFFBQXJEO01BR3FCQyxzQixXQURwQixvQkFBUSwyQkFBUixDLFVBT0kseUJBQWEsQ0FBYixDLFVBa0JBLHlCQUFhLENBQWIsQyxVQUNBLG9CQUFRLG1CQUFSLEMsVUFZQSxpQkFBS0MsbUJBQUwsQyxVQUVBLGtCQUFNLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUFOLEMsVUFFQSx5QkFBYSxDQUFiLEMsVUFDQSxvQkFBUSxXQUFSLEMsVUFNQSxpQkFBS0EsbUJBQUwsQyxXQUVBLGtCQUFNLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUFOLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxXQUFSLEMsV0FNQSxpQkFBS0EsbUJBQUwsQyxXQUVBLGtCQUFNLENBQUMsQ0FBQyxDQUFGLEVBQUssQ0FBTCxDQUFOLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxXQUFSLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR01DLEksR0FBT0MsK0JBQXFCSixROzs7Ozs7OEJBRW5CSyxDLEVBQWFDLEUsRUFBWTtBQUNyQyxZQUFNQyxjQUFjLEdBQUcsSUFBSUYsQ0FBQyxDQUFDRyxpQkFBRixHQUFzQkgsQ0FBQyxDQUFDSSxhQUFuRDs7QUFDQSxZQUFJLENBQUMsS0FBS0MsYUFBVixFQUF5QjtBQUNyQkwsVUFBQUEsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLENBQVgsSUFBZ0IsS0FBS0EsQ0FBTCxDQUFPQyxRQUFQLENBQWdCTixjQUFoQixFQUFnQywwQkFBYUYsQ0FBQyxDQUFDUyxVQUFGLEdBQWVoQiw2QkFBNUIsQ0FBaEMsSUFBK0ZRLEVBQS9HO0FBQ0gsU0FGRCxNQUdLO0FBQ0Q7QUFDQSxjQUFNUyxZQUFZLEdBQUcsMEJBQWFWLENBQUMsQ0FBQ1MsVUFBRixHQUFlaEIsNkJBQTVCLENBQXJCO0FBQ0FPLFVBQUFBLENBQUMsQ0FBQ00sUUFBRixDQUFXSyxDQUFYLElBQWdCLEtBQUtBLENBQUwsQ0FBT0gsUUFBUCxDQUFnQk4sY0FBaEIsRUFBZ0NRLFlBQWhDLElBQWlEVCxFQUFqRTtBQUNBRCxVQUFBQSxDQUFDLENBQUNNLFFBQUYsQ0FBV00sQ0FBWCxJQUFnQixLQUFLQSxDQUFMLENBQU9KLFFBQVAsQ0FBZ0JOLGNBQWhCLEVBQWdDUSxZQUFoQyxJQUFpRFQsRUFBakU7QUFDQUQsVUFBQUEsQ0FBQyxDQUFDTSxRQUFGLENBQVdDLENBQVgsSUFBZ0IsS0FBS0EsQ0FBTCxDQUFPQyxRQUFQLENBQWdCTixjQUFoQixFQUFnQ1EsWUFBaEMsSUFBaURULEVBQWpFO0FBQ0g7QUFDSjs7OztBQTlFRDs7OzBCQUlxQjtBQUNqQixlQUFPLEtBQUtZLE9BQVo7QUFDSCxPO3dCQUVrQkMsRyxFQUFLO0FBQ3BCLFlBQUksS0FBS0QsT0FBTCxLQUFpQkMsR0FBckIsRUFBMEI7QUFDMUIsYUFBS0QsT0FBTCxHQUFlQyxHQUFmO0FBQ0EsWUFBSSxDQUFDLEtBQUtDLE1BQVYsRUFBa0I7QUFDbEIsYUFBS0EsTUFBTCxDQUFZQyxZQUFaLENBQXlCLEtBQUtsQixJQUE5QixFQUFvQ2dCLEdBQXBDLEVBQXlDLElBQXpDO0FBQ0g7Ozs7QUFLRDs7OzBCQUtvQjtBQUNoQixlQUFPLEtBQUtULGFBQVo7QUFDSCxPO3dCQUVpQlMsRyxFQUFLO0FBQ25CLGFBQUtULGFBQUwsR0FBcUJTLEdBQXJCO0FBQ0g7QUFFRDs7Ozs7OztJQWxDZ0RHLDRCLG1GQUMvQ0MsbUI7Ozs7O2FBQ2tCLEs7O3NPQWdCbEJBLG1COzs7OzthQUN1QixLOztvUEFtQnZCQSxtQixTQUVBQyxhOzs7OzthQUdVLElBQUl0QixtQkFBSixFOzsrRUFNVnFCLG1CLFVBRUFDLGE7Ozs7O2FBR1UsSUFBSXRCLG1CQUFKLEU7O2dGQU1WcUIsbUIsVUFFQUMsYTs7Ozs7YUFHVSxJQUFJdEIsbUJBQUosRTs7NkJBbUJmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGFydGljbGVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHJhbmdlLCB0eXBlLCByYWRpYW4sIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IHBzZXVkb1JhbmRvbSB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IFBhcnRpY2xlLCBQYXJ0aWNsZU1vZHVsZUJhc2UsIFBBUlRJQ0xFX01PRFVMRV9OQU1FIH0gZnJvbSAnLi4vcGFydGljbGUnO1xyXG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcclxuaW1wb3J0IHsgTW9kdWxlUmFuZFNlZWQgfSBmcm9tICcuLi9lbnVtJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuY29uc3QgUk9UQVRJT05fT1ZFUlRJTUVfUkFORF9PRkZTRVQgPSBNb2R1bGVSYW5kU2VlZC5ST1RBVElPTjtcclxuXHJcbkBjY2NsYXNzKCdjYy5Sb3RhdGlvbk92ZXJ0aW1lTW9kdWxlJylcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm90YXRpb25PdmVydGltZU1vZHVsZSBleHRlbmRzIFBhcnRpY2xlTW9kdWxlQmFzZSB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBfZW5hYmxlOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgcHVibGljIGdldCBlbmFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBlbmFibGUgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbmFibGUgPT09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZSA9IHZhbDtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy50YXJnZXQuZW5hYmxlTW9kdWxlKHRoaXMubmFtZSwgdmFsLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9zZXBhcmF0ZUF4ZXMgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmmK/lkKbkuInkuKrovbTliIblvIDorr7lrprml4vovazvvIjmmoLkuI3mlK/mjIHvvInjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuS4ieS4qui9tOWIhuW8gOiuvuWumuaXi+i9rO+8iOaaguS4jeaUr+aMge+8iScpXHJcbiAgICBnZXQgc2VwYXJhdGVBeGVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2VwYXJhdGVBeGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBzZXBhcmF0ZUF4ZXMgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3NlcGFyYXRlQXhlcyA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnu5UgWCDovbTorr7lrprml4vovazjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQHJhZGlhblxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+e7lSBYIOi9tOiuvuWumuaXi+i9rCcpXHJcbiAgICBwdWJsaWMgeCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57uVIFkg6L206K6+5a6a5peL6L2s44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAcmFuZ2UoWy0xLCAxXSlcclxuICAgIEByYWRpYW5cclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCfnu5UgWSDovbTorr7lrprml4vovawnKVxyXG4gICAgcHVibGljIHkgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOe7lSBaIOi9tOiuvuWumuaXi+i9rOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAcmFkaWFuXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgn57uVIFog6L206K6+5a6a5peL6L2sJylcclxuICAgIHB1YmxpYyB6ID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICBwdWJsaWMgbmFtZSA9IFBBUlRJQ0xFX01PRFVMRV9OQU1FLlJPVEFUSU9OO1xyXG5cclxuICAgIHB1YmxpYyBhbmltYXRlIChwOiBQYXJ0aWNsZSwgZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWRUaW1lID0gMSAtIHAucmVtYWluaW5nTGlmZXRpbWUgLyBwLnN0YXJ0TGlmZXRpbWU7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9zZXBhcmF0ZUF4ZXMpIHtcclxuICAgICAgICAgICAgcC5yb3RhdGlvbi56ICs9IHRoaXMuei5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFJPVEFUSU9OX09WRVJUSU1FX1JBTkRfT0ZGU0VUKSkhICogZHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBzZXBhcmF0ZUF4ZXMgaXMgdGVtcG9yYXJpbHkgbm90IHN1cHBvcnRlZCFcclxuICAgICAgICAgICAgY29uc3Qgcm90YXRpb25SYW5kID0gcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFJPVEFUSU9OX09WRVJUSU1FX1JBTkRfT0ZGU0VUKTtcclxuICAgICAgICAgICAgcC5yb3RhdGlvbi54ICs9IHRoaXMueC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSEgKiBkdDtcclxuICAgICAgICAgICAgcC5yb3RhdGlvbi55ICs9IHRoaXMueS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSEgKiBkdDtcclxuICAgICAgICAgICAgcC5yb3RhdGlvbi56ICs9IHRoaXMuei5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcm90YXRpb25SYW5kKSEgKiBkdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuUm90YXRpb25PdmVydGltZU1vZHVsZScsIFJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUsIHtcclxuLy8gICAgIGVuYWJsZTogZmFsc2UsXHJcbi8vICAgICBfc2VwYXJhdGVBeGVzOiBmYWxzZSxcclxuLy8gICAgIHg6IG5ldyBDdXJ2ZVJhbmdlKCksXHJcbi8vICAgICB5OiBuZXcgQ3VydmVSYW5nZSgpLFxyXG4vLyAgICAgejogbmV3IEN1cnZlUmFuZ2UoKVxyXG4vLyB9KTtcclxuIl19