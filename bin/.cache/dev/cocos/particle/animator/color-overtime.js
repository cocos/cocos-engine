(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../particle.js", "./gradient-range.js", "../enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../particle.js"), require("./gradient-range.js"), require("../enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.particle, global.gradientRange, global._enum);
    global.colorOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _particle, _gradientRange, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _gradientRange = _interopRequireDefault(_gradientRange);

  var _dec, _dec2, _dec3, _dec4, _class, _class2, _descriptor, _descriptor2, _temp;

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
  var COLOR_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.COLOR;
  var ColorOvertimeModule = (_dec = (0, _index.ccclass)('cc.ColorOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.type)(_gradientRange.default), _dec4 = (0, _index.displayOrder)(1), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(ColorOvertimeModule, _ParticleModuleBase);

    function ColorOvertimeModule() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ColorOvertimeModule);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ColorOvertimeModule)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "color", _descriptor2, _assertThisInitialized(_this));

      _this.name = _particle.PARTICLE_MODULE_NAME.COLOR;
      return _this;
    }

    _createClass(ColorOvertimeModule, [{
      key: "animate",
      value: function animate(particle) {
        particle.color.set(particle.startColor);
        particle.color.multiply(this.color.evaluate(1.0 - particle.remainingLifetime / particle.startLifetime, (0, _index2.pseudoRandom)(particle.randomSeed + COLOR_OVERTIME_RAND_OFFSET)));
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
       * @zh 颜色随时间变化的参数，各个 key 之间线性差值变化。
       */

    }]);

    return ColorOvertimeModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "color", [_dec3, _index.serializable, _dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradientRange.default();
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.ColorOvertimeModule', ColorOvertimeModule, {
  //     enable: false,
  //     color: null
  // });

  _exports.default = ColorOvertimeModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2NvbG9yLW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIkNPTE9SX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiTW9kdWxlUmFuZFNlZWQiLCJDT0xPUiIsIkNvbG9yT3ZlcnRpbWVNb2R1bGUiLCJHcmFkaWVudFJhbmdlIiwibmFtZSIsIlBBUlRJQ0xFX01PRFVMRV9OQU1FIiwicGFydGljbGUiLCJjb2xvciIsInNldCIsInN0YXJ0Q29sb3IiLCJtdWx0aXBseSIsImV2YWx1YXRlIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwicmFuZG9tU2VlZCIsIl9lbmFibGUiLCJ2YWwiLCJ0YXJnZXQiLCJlbmFibGVNb2R1bGUiLCJQYXJ0aWNsZU1vZHVsZUJhc2UiLCJzZXJpYWxpemFibGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQTtBQUVBLE1BQU1BLDBCQUEwQixHQUFHQyxxQkFBZUMsS0FBbEQ7TUFHcUJDLG1CLFdBRHBCLG9CQUFRLHdCQUFSLEMsVUFPSSx5QkFBYSxDQUFiLEMsVUFlQSxpQkFBS0Msc0JBQUwsQyxVQUVBLHlCQUFhLENBQWIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFFTUMsSSxHQUFPQywrQkFBcUJKLEs7Ozs7Ozs4QkFFbkJLLFEsRUFBb0I7QUFDaENBLFFBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlQyxHQUFmLENBQW1CRixRQUFRLENBQUNHLFVBQTVCO0FBQ0FILFFBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlRyxRQUFmLENBQXdCLEtBQUtILEtBQUwsQ0FBV0ksUUFBWCxDQUFvQixNQUFNTCxRQUFRLENBQUNNLGlCQUFULEdBQTZCTixRQUFRLENBQUNPLGFBQWhFLEVBQStFLDBCQUFhUCxRQUFRLENBQUNRLFVBQVQsR0FBc0JmLDBCQUFuQyxDQUEvRSxDQUF4QjtBQUNIOzs7O0FBM0JEOzs7MEJBSXFCO0FBQ2pCLGVBQU8sS0FBS2dCLE9BQVo7QUFDSCxPO3dCQUVrQkMsRyxFQUFLO0FBQ3BCLFlBQUksS0FBS0QsT0FBTCxLQUFpQkMsR0FBckIsRUFBMEI7QUFDMUIsYUFBS0QsT0FBTCxHQUFlQyxHQUFmO0FBQ0EsWUFBSSxDQUFDLEtBQUtDLE1BQVYsRUFBa0I7QUFDbEIsYUFBS0EsTUFBTCxDQUFZQyxZQUFaLENBQXlCLEtBQUtkLElBQTlCLEVBQW9DWSxHQUFwQyxFQUF5QyxJQUF6QztBQUNIO0FBRUQ7Ozs7Ozs7SUFsQjZDRyw0QixtRkFDNUNDLG1COzs7OzthQUNTLEs7O3FPQW9CVEEsbUI7Ozs7O2FBRWMsSUFBSWpCLHNCQUFKLEU7OzZCQVNuQjtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IHBhcnRpY2xlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgZGlzcGxheU9yZGVyLCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBwc2V1ZG9SYW5kb20gfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSwgUEFSVElDTEVfTU9EVUxFX05BTUUgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCBHcmFkaWVudFJhbmdlIGZyb20gJy4vZ3JhZGllbnQtcmFuZ2UnO1xyXG5pbXBvcnQgeyBNb2R1bGVSYW5kU2VlZCB9IGZyb20gJy4uL2VudW0nO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZU1vZHVsZUJhc2UgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXHJcblxyXG5jb25zdCBDT0xPUl9PVkVSVElNRV9SQU5EX09GRlNFVCA9IE1vZHVsZVJhbmRTZWVkLkNPTE9SO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkNvbG9yT3ZlcnRpbWVNb2R1bGUnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvck92ZXJ0aW1lTW9kdWxlIGV4dGVuZHMgUGFydGljbGVNb2R1bGVCYXNlIHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIF9lbmFibGUgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZSA9PT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlID0gdmFsO1xyXG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnRhcmdldC5lbmFibGVNb2R1bGUodGhpcy5uYW1lLCB2YWwsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOminOiJsumaj+aXtumXtOWPmOWMlueahOWPguaVsO+8jOWQhOS4qiBrZXkg5LmL6Ze057q/5oCn5beu5YC85Y+Y5YyW44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBwdWJsaWMgY29sb3IgPSBuZXcgR3JhZGllbnRSYW5nZSgpO1xyXG4gICAgcHVibGljIG5hbWUgPSBQQVJUSUNMRV9NT0RVTEVfTkFNRS5DT0xPUjtcclxuXHJcbiAgICBwdWJsaWMgYW5pbWF0ZSAocGFydGljbGU6IFBhcnRpY2xlKSB7XHJcbiAgICAgICAgcGFydGljbGUuY29sb3Iuc2V0KHBhcnRpY2xlLnN0YXJ0Q29sb3IpO1xyXG4gICAgICAgIHBhcnRpY2xlLmNvbG9yLm11bHRpcGx5KHRoaXMuY29sb3IuZXZhbHVhdGUoMS4wIC0gcGFydGljbGUucmVtYWluaW5nTGlmZXRpbWUgLyBwYXJ0aWNsZS5zdGFydExpZmV0aW1lLCBwc2V1ZG9SYW5kb20ocGFydGljbGUucmFuZG9tU2VlZCArIENPTE9SX09WRVJUSU1FX1JBTkRfT0ZGU0VUKSkpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBDQ0NsYXNzLmZhc3REZWZpbmUoJ2NjLkNvbG9yT3ZlcnRpbWVNb2R1bGUnLCBDb2xvck92ZXJ0aW1lTW9kdWxlLCB7XHJcbi8vICAgICBlbmFibGU6IGZhbHNlLFxyXG4vLyAgICAgY29sb3I6IG51bGxcclxuLy8gfSk7XHJcbiJdfQ==