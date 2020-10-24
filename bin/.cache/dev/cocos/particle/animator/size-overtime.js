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
    global.sizeOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _particle, _curveRange, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

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
  var SIZE_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.SIZE;
  var SizeOvertimeModule = (_dec = (0, _index.ccclass)('cc.SizeOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.displayOrder)(1), _dec4 = (0, _index.tooltip)('决定是否在每个轴上独立控制粒子大小'), _dec5 = (0, _index.type)(_curveRange.default), _dec6 = (0, _index.displayOrder)(2), _dec7 = (0, _index.tooltip)('定义一条曲线来决定粒子在其生命周期中的大小变化'), _dec8 = (0, _index.type)(_curveRange.default), _dec9 = (0, _index.displayOrder)(3), _dec10 = (0, _index.tooltip)('定义一条曲线来决定粒子在其生命周期中 X 轴方向上的大小变化'), _dec11 = (0, _index.type)(_curveRange.default), _dec12 = (0, _index.displayOrder)(4), _dec13 = (0, _index.tooltip)('定义一条曲线来决定粒子在其生命周期中 Y 轴方向上的大小变化'), _dec14 = (0, _index.type)(_curveRange.default), _dec15 = (0, _index.displayOrder)(5), _dec16 = (0, _index.tooltip)('定义一条曲线来决定粒子在其生命周期中 Z 轴方向上的大小变化'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(SizeOvertimeModule, _ParticleModuleBase);

    function SizeOvertimeModule() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, SizeOvertimeModule);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(SizeOvertimeModule)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "separateAxes", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "size", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "x", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "y", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "z", _descriptor6, _assertThisInitialized(_this));

      _this.name = _particle.PARTICLE_MODULE_NAME.SIZE;
      return _this;
    }

    _createClass(SizeOvertimeModule, [{
      key: "animate",
      value: function animate(particle, dt) {
        if (!this.separateAxes) {
          _index2.Vec3.multiplyScalar(particle.size, particle.startSize, this.size.evaluate(1 - particle.remainingLifetime / particle.startLifetime, (0, _index2.pseudoRandom)(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET)));
        } else {
          var currLifetime = 1 - particle.remainingLifetime / particle.startLifetime;
          var sizeRand = (0, _index2.pseudoRandom)(particle.randomSeed + SIZE_OVERTIME_RAND_OFFSET);
          particle.size.x = particle.startSize.x * this.x.evaluate(currLifetime, sizeRand);
          particle.size.y = particle.startSize.y * this.y.evaluate(currLifetime, sizeRand);
          particle.size.z = particle.startSize.z * this.z.evaluate(currLifetime, sizeRand);
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
      /**
       * @zh 决定是否在每个轴上独立控制粒子大小。
       */

    }]);

    return SizeOvertimeModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_index.serializable, _dec3, _dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "size", [_dec5, _index.serializable, _dec6, _dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec8, _index.serializable, _dec9, _dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec11, _index.serializable, _dec12, _dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec14, _index.serializable, _dec15, _dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.SizeOvertimeModule', SizeOvertimeModule, {
  //     enable: false,
  //     separateAxes: false,
  //     size: new CurveRange(),
  //     x: new CurveRange(),
  //     y: new CurveRange(),
  //     z: new CurveRange()
  // });

  _exports.default = SizeOvertimeModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL3NpemUtb3ZlcnRpbWUudHMiXSwibmFtZXMiOlsiU0laRV9PVkVSVElNRV9SQU5EX09GRlNFVCIsIk1vZHVsZVJhbmRTZWVkIiwiU0laRSIsIlNpemVPdmVydGltZU1vZHVsZSIsIkN1cnZlUmFuZ2UiLCJuYW1lIiwiUEFSVElDTEVfTU9EVUxFX05BTUUiLCJwYXJ0aWNsZSIsImR0Iiwic2VwYXJhdGVBeGVzIiwiVmVjMyIsIm11bHRpcGx5U2NhbGFyIiwic2l6ZSIsInN0YXJ0U2l6ZSIsImV2YWx1YXRlIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwicmFuZG9tU2VlZCIsImN1cnJMaWZldGltZSIsInNpemVSYW5kIiwieCIsInkiLCJ6IiwiX2VuYWJsZSIsInZhbCIsInRhcmdldCIsImVuYWJsZU1vZHVsZSIsIlBhcnRpY2xlTW9kdWxlQmFzZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVdBO0FBQ0EsTUFBTUEseUJBQXlCLEdBQUdDLHFCQUFlQyxJQUFqRDtNQUdxQkMsa0IsV0FEcEIsb0JBQVEsdUJBQVIsQyxVQU9JLHlCQUFhLENBQWIsQyxVQWdCQSx5QkFBYSxDQUFiLEMsVUFDQSxvQkFBUSxtQkFBUixDLFVBTUEsaUJBQUtDLG1CQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEMsVUFDQSxvQkFBUSx5QkFBUixDLFVBTUEsaUJBQUtBLG1CQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxnQ0FBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxnQ0FBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxnQ0FBUixDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR01DLEksR0FBT0MsK0JBQXFCSixJOzs7Ozs7OEJBRW5CSyxRLEVBQW9CQyxFLEVBQVk7QUFDNUMsWUFBSSxDQUFDLEtBQUtDLFlBQVYsRUFBd0I7QUFDcEJDLHVCQUFLQyxjQUFMLENBQW9CSixRQUFRLENBQUNLLElBQTdCLEVBQW1DTCxRQUFRLENBQUNNLFNBQTVDLEVBQXVELEtBQUtELElBQUwsQ0FBVUUsUUFBVixDQUFtQixJQUFJUCxRQUFRLENBQUNRLGlCQUFULEdBQTZCUixRQUFRLENBQUNTLGFBQTdELEVBQTRFLDBCQUFhVCxRQUFRLENBQUNVLFVBQVQsR0FBc0JqQix5QkFBbkMsQ0FBNUUsQ0FBdkQ7QUFDSCxTQUZELE1BRU87QUFDSCxjQUFNa0IsWUFBWSxHQUFHLElBQUlYLFFBQVEsQ0FBQ1EsaUJBQVQsR0FBNkJSLFFBQVEsQ0FBQ1MsYUFBL0Q7QUFDQSxjQUFNRyxRQUFRLEdBQUcsMEJBQWFaLFFBQVEsQ0FBQ1UsVUFBVCxHQUFzQmpCLHlCQUFuQyxDQUFqQjtBQUNBTyxVQUFBQSxRQUFRLENBQUNLLElBQVQsQ0FBY1EsQ0FBZCxHQUFrQmIsUUFBUSxDQUFDTSxTQUFULENBQW1CTyxDQUFuQixHQUF1QixLQUFLQSxDQUFMLENBQU9OLFFBQVAsQ0FBZ0JJLFlBQWhCLEVBQThCQyxRQUE5QixDQUF6QztBQUNBWixVQUFBQSxRQUFRLENBQUNLLElBQVQsQ0FBY1MsQ0FBZCxHQUFrQmQsUUFBUSxDQUFDTSxTQUFULENBQW1CUSxDQUFuQixHQUF1QixLQUFLQSxDQUFMLENBQU9QLFFBQVAsQ0FBZ0JJLFlBQWhCLEVBQThCQyxRQUE5QixDQUF6QztBQUNBWixVQUFBQSxRQUFRLENBQUNLLElBQVQsQ0FBY1UsQ0FBZCxHQUFrQmYsUUFBUSxDQUFDTSxTQUFULENBQW1CUyxDQUFuQixHQUF1QixLQUFLQSxDQUFMLENBQU9SLFFBQVAsQ0FBZ0JJLFlBQWhCLEVBQThCQyxRQUE5QixDQUF6QztBQUNIO0FBQ0o7Ozs7QUF2RUQ7OzswQkFJcUI7QUFDakIsZUFBTyxLQUFLSSxPQUFaO0FBQ0gsTzt3QkFFa0JDLEcsRUFBSztBQUNwQixZQUFJLEtBQUtELE9BQUwsS0FBaUJDLEdBQXJCLEVBQTBCO0FBQzFCLGFBQUtELE9BQUwsR0FBZUMsR0FBZjtBQUNBLFlBQUksQ0FBQyxLQUFLQyxNQUFWLEVBQWtCO0FBQ2xCLGFBQUtBLE1BQUwsQ0FBWUMsWUFBWixDQUF5QixLQUFLckIsSUFBOUIsRUFBb0NtQixHQUFwQyxFQUF5QyxJQUF6QztBQUNIO0FBRUQ7Ozs7Ozs7SUFsQjRDRyw0QixtRkFDM0NDLG1COzs7OzthQUNrQixLOztxT0FtQmxCQSxtQjs7Ozs7YUFHcUIsSzs7a0ZBTXJCQSxtQjs7Ozs7YUFHYSxJQUFJeEIsbUJBQUosRTs7K0VBTWJ3QixtQjs7Ozs7YUFHVSxJQUFJeEIsbUJBQUosRTs7Z0ZBTVZ3QixtQjs7Ozs7YUFHVSxJQUFJeEIsbUJBQUosRTs7Z0ZBTVZ3QixtQjs7Ozs7YUFHVSxJQUFJeEIsbUJBQUosRTs7NkJBaUJmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBwYXJ0aWNsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgcHNldWRvUmFuZG9tLCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgUGFydGljbGUsIFBhcnRpY2xlTW9kdWxlQmFzZSwgUEFSVElDTEVfTU9EVUxFX05BTUUgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCBDdXJ2ZVJhbmdlIGZyb20gJy4vY3VydmUtcmFuZ2UnO1xyXG5pbXBvcnQgeyBNb2R1bGVSYW5kU2VlZCB9IGZyb20gJy4uL2VudW0nO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxyXG5jb25zdCBTSVpFX09WRVJUSU1FX1JBTkRfT0ZGU0VUID0gTW9kdWxlUmFuZFNlZWQuU0laRTtcclxuXHJcbkBjY2NsYXNzKCdjYy5TaXplT3ZlcnRpbWVNb2R1bGUnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaXplT3ZlcnRpbWVNb2R1bGUgZXh0ZW5kcyBQYXJ0aWNsZU1vZHVsZUJhc2Uge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgX2VuYWJsZTogQm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5piv5ZCm5ZCv55So44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMClcclxuICAgIHB1YmxpYyBnZXQgZW5hYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZW5hYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZW5hYmxlICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlID09PSB2YWwpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9lbmFibGUgPSB2YWw7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LmVuYWJsZU1vZHVsZSh0aGlzLm5hbWUsIHZhbCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yaz5a6a5piv5ZCm5Zyo5q+P5Liq6L205LiK54us56uL5o6n5Yi257KS5a2Q5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCflhrPlrprmmK/lkKblnKjmr4/kuKrovbTkuIrni6znq4vmjqfliLbnspLlrZDlpKflsI8nKVxyXG4gICAgcHVibGljIHNlcGFyYXRlQXhlcyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWumuS5ieS4gOadoeabsue6v+adpeWGs+WumueykuWtkOWcqOWFtueUn+WRveWRqOacn+S4reeahOWkp+Wwj+WPmOWMluOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+WumuS5ieS4gOadoeabsue6v+adpeWGs+WumueykuWtkOWcqOWFtueUn+WRveWRqOacn+S4reeahOWkp+Wwj+WPmOWMlicpXHJcbiAgICBwdWJsaWMgc2l6ZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5a6a5LmJ5LiA5p2h5puy57q/5p2l5Yaz5a6a57KS5a2Q5Zyo5YW255Sf5ZG95ZGo5pyf5LitIFgg6L205pa55ZCR5LiK55qE5aSn5bCP5Y+Y5YyW44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdG9vbHRpcCgn5a6a5LmJ5LiA5p2h5puy57q/5p2l5Yaz5a6a57KS5a2Q5Zyo5YW255Sf5ZG95ZGo5pyf5LitIFgg6L205pa55ZCR5LiK55qE5aSn5bCP5Y+Y5YyWJylcclxuICAgIHB1YmxpYyB4ID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlrprkuYnkuIDmnaHmm7Lnur/mnaXlhrPlrprnspLlrZDlnKjlhbbnlJ/lkb3lkajmnJ/kuK0gWSDovbTmlrnlkJHkuIrnmoTlpKflsI/lj5jljJbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCflrprkuYnkuIDmnaHmm7Lnur/mnaXlhrPlrprnspLlrZDlnKjlhbbnlJ/lkb3lkajmnJ/kuK0gWSDovbTmlrnlkJHkuIrnmoTlpKflsI/lj5jljJYnKVxyXG4gICAgcHVibGljIHkgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWumuS5ieS4gOadoeabsue6v+adpeWGs+WumueykuWtkOWcqOWFtueUn+WRveWRqOacn+S4rSBaIOi9tOaWueWQkeS4iueahOWkp+Wwj+WPmOWMluOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcig1KVxyXG4gICAgQHRvb2x0aXAoJ+WumuS5ieS4gOadoeabsue6v+adpeWGs+WumueykuWtkOWcqOWFtueUn+WRveWRqOacn+S4rSBaIOi9tOaWueWQkeS4iueahOWkp+Wwj+WPmOWMlicpXHJcbiAgICBwdWJsaWMgeiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgcHVibGljIG5hbWUgPSBQQVJUSUNMRV9NT0RVTEVfTkFNRS5TSVpFO1xyXG5cclxuICAgIHB1YmxpYyBhbmltYXRlIChwYXJ0aWNsZTogUGFydGljbGUsIGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc2VwYXJhdGVBeGVzKSB7XHJcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIocGFydGljbGUuc2l6ZSwgcGFydGljbGUuc3RhcnRTaXplLCB0aGlzLnNpemUuZXZhbHVhdGUoMSAtIHBhcnRpY2xlLnJlbWFpbmluZ0xpZmV0aW1lIC8gcGFydGljbGUuc3RhcnRMaWZldGltZSwgcHNldWRvUmFuZG9tKHBhcnRpY2xlLnJhbmRvbVNlZWQgKyBTSVpFX09WRVJUSU1FX1JBTkRfT0ZGU0VUKSkhKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBjdXJyTGlmZXRpbWUgPSAxIC0gcGFydGljbGUucmVtYWluaW5nTGlmZXRpbWUgLyBwYXJ0aWNsZS5zdGFydExpZmV0aW1lO1xyXG4gICAgICAgICAgICBjb25zdCBzaXplUmFuZCA9IHBzZXVkb1JhbmRvbShwYXJ0aWNsZS5yYW5kb21TZWVkICsgU0laRV9PVkVSVElNRV9SQU5EX09GRlNFVCk7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnNpemUueCA9IHBhcnRpY2xlLnN0YXJ0U2l6ZS54ICogdGhpcy54LmV2YWx1YXRlKGN1cnJMaWZldGltZSwgc2l6ZVJhbmQpITtcclxuICAgICAgICAgICAgcGFydGljbGUuc2l6ZS55ID0gcGFydGljbGUuc3RhcnRTaXplLnkgKiB0aGlzLnkuZXZhbHVhdGUoY3VyckxpZmV0aW1lLCBzaXplUmFuZCkhO1xyXG4gICAgICAgICAgICBwYXJ0aWNsZS5zaXplLnogPSBwYXJ0aWNsZS5zdGFydFNpemUueiAqIHRoaXMuei5ldmFsdWF0ZShjdXJyTGlmZXRpbWUsIHNpemVSYW5kKSE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vLyBDQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLlNpemVPdmVydGltZU1vZHVsZScsIFNpemVPdmVydGltZU1vZHVsZSwge1xyXG4vLyAgICAgZW5hYmxlOiBmYWxzZSxcclxuLy8gICAgIHNlcGFyYXRlQXhlczogZmFsc2UsXHJcbi8vICAgICBzaXplOiBuZXcgQ3VydmVSYW5nZSgpLFxyXG4vLyAgICAgeDogbmV3IEN1cnZlUmFuZ2UoKSxcclxuLy8gICAgIHk6IG5ldyBDdXJ2ZVJhbmdlKCksXHJcbi8vICAgICB6OiBuZXcgQ3VydmVSYW5nZSgpXHJcbi8vIH0pO1xyXG4iXX0=