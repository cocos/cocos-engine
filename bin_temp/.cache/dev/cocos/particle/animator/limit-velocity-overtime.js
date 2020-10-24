(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../enum.js", "../particle.js", "./curve-range.js", "../particle-general-function.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../enum.js"), require("../particle.js"), require("./curve-range.js"), require("../particle-general-function.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global._enum, global.particle, global.curveRange, global.particleGeneralFunction);
    global.limitVelocityOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _enum, _particle, _curveRange, _particleGeneralFunction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  // tslint:disable: max-line-length
  var LIMIT_VELOCITY_RAND_OFFSET = _enum.ModuleRandSeed.LIMIT;

  var _temp_v3 = new _index2.Vec3();

  var _temp_v3_1 = new _index2.Vec3();

  var LimitVelocityOvertimeModule = (_dec = (0, _index.ccclass)('cc.LimitVelocityOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.type)(_curveRange.default), _dec4 = (0, _index.range)([-1, 1]), _dec5 = (0, _index.displayOrder)(4), _dec6 = (0, _index.tooltip)('X 轴方向上的速度下限'), _dec7 = (0, _index.type)(_curveRange.default), _dec8 = (0, _index.range)([-1, 1]), _dec9 = (0, _index.displayOrder)(5), _dec10 = (0, _index.tooltip)('Y 轴方向上的速度下限'), _dec11 = (0, _index.type)(_curveRange.default), _dec12 = (0, _index.range)([-1, 1]), _dec13 = (0, _index.displayOrder)(6), _dec14 = (0, _index.tooltip)('Z 轴方向上的速度下限'), _dec15 = (0, _index.type)(_curveRange.default), _dec16 = (0, _index.range)([-1, 1]), _dec17 = (0, _index.displayOrder)(3), _dec18 = (0, _index.tooltip)('速度下限'), _dec19 = (0, _index.displayOrder)(7), _dec20 = (0, _index.tooltip)('当前速度与速度下限的插值'), _dec21 = (0, _index.displayOrder)(2), _dec22 = (0, _index.tooltip)('是否三个轴分开限制'), _dec23 = (0, _index.type)(_enum.Space), _dec24 = (0, _index.displayOrder)(1), _dec25 = (0, _index.tooltip)('计算速度下限时采用的坐标系'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(LimitVelocityOvertimeModule, _ParticleModuleBase);

    _createClass(LimitVelocityOvertimeModule, [{
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
       * @zh X 轴方向上的速度下限。
       */

    }]);

    function LimitVelocityOvertimeModule() {
      var _this;

      _classCallCheck(this, LimitVelocityOvertimeModule);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(LimitVelocityOvertimeModule).call(this));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "limitX", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "limitY", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "limitZ", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "limit", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "dampen", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "separateAxes", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "space", _descriptor8, _assertThisInitialized(_this));

      _this.drag = null;
      _this.multiplyDragByParticleSize = false;
      _this.multiplyDragByParticleVelocity = false;
      _this.name = _particle.PARTICLE_MODULE_NAME.LIMIT;
      _this.rotation = void 0;
      _this.needTransform = void 0;
      _this.rotation = new _index2.Quat();
      _this.needTransform = false;
      _this.needUpdate = true;
      return _this;
    }

    _createClass(LimitVelocityOvertimeModule, [{
      key: "update",
      value: function update(space, worldTransform) {
        this.needTransform = (0, _particleGeneralFunction.calculateTransform)(space, this.space, worldTransform, this.rotation);
      }
    }, {
      key: "animate",
      value: function animate(p, dt) {
        var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        var dampedVel = _temp_v3;

        if (this.separateAxes) {
          _index2.Vec3.set(_temp_v3_1, this.limitX.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.limitY.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.limitZ.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)));

          if (this.needTransform) {
            _index2.Vec3.transformQuat(_temp_v3_1, _temp_v3_1, this.rotation);
          }

          _index2.Vec3.set(dampedVel, dampenBeyondLimit(p.ultimateVelocity.x, _temp_v3_1.x, this.dampen), dampenBeyondLimit(p.ultimateVelocity.y, _temp_v3_1.y, this.dampen), dampenBeyondLimit(p.ultimateVelocity.z, _temp_v3_1.z, this.dampen));
        } else {
          _index2.Vec3.normalize(dampedVel, p.ultimateVelocity);

          _index2.Vec3.multiplyScalar(dampedVel, dampedVel, dampenBeyondLimit(p.ultimateVelocity.length(), this.limit.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + LIMIT_VELOCITY_RAND_OFFSET)), this.dampen));
        }

        _index2.Vec3.copy(p.ultimateVelocity, dampedVel);
      }
    }]);

    return LimitVelocityOvertimeModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "limitX", [_dec3, _index.serializable, _dec4, _dec5, _dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "limitY", [_dec7, _index.serializable, _dec8, _dec9, _dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "limitZ", [_dec11, _index.serializable, _dec12, _dec13, _dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "limit", [_dec15, _index.serializable, _dec16, _dec17, _dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "dampen", [_index.serializable, _dec19, _dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 3;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "separateAxes", [_index.serializable, _dec21, _dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "space", [_dec23, _index.serializable, _dec24, _dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.Local;
    }
  })), _class2)) || _class);
  _exports.default = LimitVelocityOvertimeModule;

  function dampenBeyondLimit(vel, limit, dampen) {
    var sgn = Math.sign(vel);
    var abs = Math.abs(vel);

    if (abs > limit) {
      abs = (0, _index2.lerp)(abs, limit, dampen);
    }

    return abs * sgn;
  } // CCClass.fastDefine('cc.LimitVelocityOvertimeModule', LimitVelocityOvertimeModule, {
  //     enable: false,
  //     limitX: null,
  //     limitY: null,
  //     limitZ: null,
  //     limit: null,
  //     dampen: null,
  //     separateAxes: false,
  //     space: Space.Local,
  //     // TODO:functions related to drag are temporarily not supported
  //     drag: null,
  //     multiplyDragByParticleSize: false,
  //     multiplyDragByParticleVelocity: false
  // });

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2xpbWl0LXZlbG9jaXR5LW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIkxJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUIiwiTW9kdWxlUmFuZFNlZWQiLCJMSU1JVCIsIl90ZW1wX3YzIiwiVmVjMyIsIl90ZW1wX3YzXzEiLCJMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJDdXJ2ZVJhbmdlIiwiU3BhY2UiLCJfZW5hYmxlIiwidmFsIiwidGFyZ2V0IiwiZW5hYmxlTW9kdWxlIiwibmFtZSIsImRyYWciLCJtdWx0aXBseURyYWdCeVBhcnRpY2xlU2l6ZSIsIm11bHRpcGx5RHJhZ0J5UGFydGljbGVWZWxvY2l0eSIsIlBBUlRJQ0xFX01PRFVMRV9OQU1FIiwicm90YXRpb24iLCJuZWVkVHJhbnNmb3JtIiwiUXVhdCIsIm5lZWRVcGRhdGUiLCJzcGFjZSIsIndvcmxkVHJhbnNmb3JtIiwicCIsImR0Iiwibm9ybWFsaXplZFRpbWUiLCJyZW1haW5pbmdMaWZldGltZSIsInN0YXJ0TGlmZXRpbWUiLCJkYW1wZWRWZWwiLCJzZXBhcmF0ZUF4ZXMiLCJzZXQiLCJsaW1pdFgiLCJldmFsdWF0ZSIsInJhbmRvbVNlZWQiLCJsaW1pdFkiLCJsaW1pdFoiLCJ0cmFuc2Zvcm1RdWF0IiwiZGFtcGVuQmV5b25kTGltaXQiLCJ1bHRpbWF0ZVZlbG9jaXR5IiwieCIsImRhbXBlbiIsInkiLCJ6Iiwibm9ybWFsaXplIiwibXVsdGlwbHlTY2FsYXIiLCJsZW5ndGgiLCJsaW1pdCIsImNvcHkiLCJQYXJ0aWNsZU1vZHVsZUJhc2UiLCJzZXJpYWxpemFibGUiLCJMb2NhbCIsInZlbCIsInNnbiIsIk1hdGgiLCJzaWduIiwiYWJzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBWUE7QUFDQSxNQUFNQSwwQkFBMEIsR0FB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STNDLG1CQUFKLEU7O29GQU1mMkMsbUI7Ozs7O2FBSWUsSUFBSTNDLG1CQUFKLEU7O3FGQU1mMkMsbUI7Ozs7O2FBSWUsSUFBSTNDLG1CQUFKLEU7O29GQU1mMkMsbUI7Ozs7O2FBSWMsSUFBSTNDLG1CQUFKLEU7OzZFQUtkMkMsbUI7Ozs7O2FBR2UsQzs7bUZBS2ZBLG1COzs7OzthQUdxQixLOztvRkFNckJBLG1COzs7OzthQUdjMUMsWUFBTTJDLEs7Ozs7O0FBNkN6QixXQUFTYixpQkFBVCxDQUE0QmMsR0FBNUIsRUFBeUNMLEtBQXpDLEVBQXdETixNQUF4RCxFQUF3RTtBQUNwRSxRQUFNWSxHQUFHLEdBQUdDLElBQUksQ0FBQ0MsSUFBTCxDQUFVSCxHQUFWLENBQVo7QUFDQSxRQUFJSSxHQUFHLEdBQUdGLElBQUksQ0FBQ0UsR0FBTCxDQUFTSixHQUFULENBQVY7O0FBQ0EsUUFBSUksR0FBRyxHQUFHVCxLQUFWLEVBQWlCO0FBQ2JTLE1BQUFBLEdBQUcsR0FBRyxrQkFBS0EsR0FBTCxFQUFVVCxLQUFWLEVBQWlCTixNQUFqQixDQUFOO0FBQ0g7O0FBQ0QsV0FBT2UsR0FBRyxHQUFHSCxHQUFiO0FBQ0gsRyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBwYXJ0aWNsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgcmFuZ2UsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IGxlcnAsIHBzZXVkb1JhbmRvbSwgVmVjMywgTWF0NCwgUXVhdCB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IFNwYWNlLCBNb2R1bGVSYW5kU2VlZCB9IGZyb20gJy4uL2VudW0nO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSwgUGFydGljbGVNb2R1bGVCYXNlLCBQQVJUSUNMRV9NT0RVTEVfTkFNRSB9IGZyb20gJy4uL3BhcnRpY2xlJztcclxuaW1wb3J0IEN1cnZlUmFuZ2UgZnJvbSAnLi9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZVRyYW5zZm9ybSB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxyXG5jb25zdCBMSU1JVF9WRUxPQ0lUWV9SQU5EX09GRlNFVCA9IE1vZHVsZVJhbmRTZWVkLkxJTUlUO1xyXG5cclxuY29uc3QgX3RlbXBfdjMgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBfdGVtcF92M18xID0gbmV3IFZlYzMoKTtcclxuXHJcbkBjY2NsYXNzKCdjYy5MaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgZXh0ZW5kcyBQYXJ0aWNsZU1vZHVsZUJhc2Uge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIF9lbmFibGU6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZSA9PT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlID0gdmFsO1xyXG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnRhcmdldC5lbmFibGVNb2R1bGUodGhpcy5uYW1lLCB2YWwsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIFgg6L205pa55ZCR5LiK55qE6YCf5bqm5LiL6ZmQ44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAcmFuZ2UoWy0xLCAxXSlcclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCdYIOi9tOaWueWQkeS4iueahOmAn+W6puS4i+mZkCcpXHJcbiAgICBwdWJsaWMgbGltaXRYID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCBZIOi9tOaWueWQkeS4iueahOmAn+W6puS4i+mZkOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgnWSDovbTmlrnlkJHkuIrnmoTpgJ/luqbkuIvpmZAnKVxyXG4gICAgcHVibGljIGxpbWl0WSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemggWiDovbTmlrnlkJHkuIrnmoTpgJ/luqbkuIvpmZDjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQGRpc3BsYXlPcmRlcig2KVxyXG4gICAgQHRvb2x0aXAoJ1og6L205pa55ZCR5LiK55qE6YCf5bqm5LiL6ZmQJylcclxuICAgIHB1YmxpYyBsaW1pdFogPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAn+W6puS4i+mZkOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdG9vbHRpcCgn6YCf5bqm5LiL6ZmQJylcclxuICAgIHB1YmxpYyBsaW1pdCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5b2T5YmN6YCf5bqm5LiO6YCf5bqm5LiL6ZmQ55qE5o+S5YC844CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCflvZPliY3pgJ/luqbkuI7pgJ/luqbkuIvpmZDnmoTmj5LlgLwnKVxyXG4gICAgcHVibGljIGRhbXBlbiA9IDM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5piv5ZCm5LiJ5Liq6L205YiG5byA6ZmQ5Yi244CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCfmmK/lkKbkuInkuKrovbTliIblvIDpmZDliLYnKVxyXG4gICAgcHVibGljIHNlcGFyYXRlQXhlcyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOiuoeeul+mAn+W6puS4i+mZkOaXtumHh+eUqOeahOWdkOagh+ezuyBbW1NwYWNlXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3BhY2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdG9vbHRpcCgn6K6h566X6YCf5bqm5LiL6ZmQ5pe26YeH55So55qE5Z2Q5qCH57O7JylcclxuICAgIHB1YmxpYyBzcGFjZSA9IFNwYWNlLkxvY2FsO1xyXG5cclxuICAgIC8vIFRPRE86ZnVuY3Rpb25zIHJlbGF0ZWQgdG8gZHJhZyBhcmUgdGVtcG9yYXJpbHkgbm90IHN1cHBvcnRlZFxyXG4gICAgcHVibGljIGRyYWcgPSBudWxsO1xyXG4gICAgcHVibGljIG11bHRpcGx5RHJhZ0J5UGFydGljbGVTaXplID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbXVsdGlwbHlEcmFnQnlQYXJ0aWNsZVZlbG9jaXR5ID0gZmFsc2U7XHJcbiAgICBwdWJsaWMgbmFtZSA9IFBBUlRJQ0xFX01PRFVMRV9OQU1FLkxJTUlUO1xyXG4gICAgcHJpdmF0ZSByb3RhdGlvbjogUXVhdDtcclxuICAgIHByaXZhdGUgbmVlZFRyYW5zZm9ybTogYm9vbGVhbjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFF1YXQoKTtcclxuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5lZWRVcGRhdGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKHNwYWNlOiBudW1iZXIsIHdvcmxkVHJhbnNmb3JtOiBNYXQ0KSB7XHJcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gY2FsY3VsYXRlVHJhbnNmb3JtKHNwYWNlLCB0aGlzLnNwYWNlLCB3b3JsZFRyYW5zZm9ybSwgdGhpcy5yb3RhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFuaW1hdGUgKHA6IFBhcnRpY2xlLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRpbWUgPSAxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZTtcclxuICAgICAgICBjb25zdCBkYW1wZWRWZWwgPSBfdGVtcF92MztcclxuICAgICAgICBpZiAodGhpcy5zZXBhcmF0ZUF4ZXMpIHtcclxuICAgICAgICAgICAgVmVjMy5zZXQoX3RlbXBfdjNfMSwgdGhpcy5saW1pdFguZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBMSU1JVF9WRUxPQ0lUWV9SQU5EX09GRlNFVCkpISxcclxuICAgICAgICAgICAgICAgIHRoaXMubGltaXRZLmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgTElNSVRfVkVMT0NJVFlfUkFORF9PRkZTRVQpKSEsXHJcbiAgICAgICAgICAgICAgICB0aGlzLmxpbWl0Wi5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIExJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUKSkhKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KF90ZW1wX3YzXzEsIF90ZW1wX3YzXzEsIHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KGRhbXBlZFZlbCxcclxuICAgICAgICAgICAgICAgIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS54LCBfdGVtcF92M18xLngsIHRoaXMuZGFtcGVuKSxcclxuICAgICAgICAgICAgICAgIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS55LCBfdGVtcF92M18xLnksIHRoaXMuZGFtcGVuKSxcclxuICAgICAgICAgICAgICAgIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS56LCBfdGVtcF92M18xLnosIHRoaXMuZGFtcGVuKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkYW1wZWRWZWwsIHAudWx0aW1hdGVWZWxvY2l0eSk7XHJcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIoZGFtcGVkVmVsLCBkYW1wZWRWZWwsIGRhbXBlbkJleW9uZExpbWl0KHAudWx0aW1hdGVWZWxvY2l0eS5sZW5ndGgoKSwgdGhpcy5saW1pdC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIExJTUlUX1ZFTE9DSVRZX1JBTkRfT0ZGU0VUKSkhLCB0aGlzLmRhbXBlbikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBWZWMzLmNvcHkocC51bHRpbWF0ZVZlbG9jaXR5LCBkYW1wZWRWZWwpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZnVuY3Rpb24gZGFtcGVuQmV5b25kTGltaXQgKHZlbDogbnVtYmVyLCBsaW1pdDogbnVtYmVyLCBkYW1wZW46IG51bWJlcikge1xyXG4gICAgY29uc3Qgc2duID0gTWF0aC5zaWduKHZlbCk7XHJcbiAgICBsZXQgYWJzID0gTWF0aC5hYnModmVsKTtcclxuICAgIGlmIChhYnMgPiBsaW1pdCkge1xyXG4gICAgICAgIGFicyA9IGxlcnAoYWJzLCBsaW1pdCwgZGFtcGVuKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhYnMgKiBzZ247XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlJywgTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLCB7XHJcbi8vICAgICBlbmFibGU6IGZhbHNlLFxyXG4vLyAgICAgbGltaXRYOiBudWxsLFxyXG4vLyAgICAgbGltaXRZOiBudWxsLFxyXG4vLyAgICAgbGltaXRaOiBudWxsLFxyXG4vLyAgICAgbGltaXQ6IG51bGwsXHJcbi8vICAgICBkYW1wZW46IG51bGwsXHJcbi8vICAgICBzZXBhcmF0ZUF4ZXM6IGZhbHNlLFxyXG4vLyAgICAgc3BhY2U6IFNwYWNlLkxvY2FsLFxyXG4vLyAgICAgLy8gVE9ETzpmdW5jdGlvbnMgcmVsYXRlZCB0byBkcmFnIGFyZSB0ZW1wb3JhcmlseSBub3Qgc3VwcG9ydGVkXHJcbi8vICAgICBkcmFnOiBudWxsLFxyXG4vLyAgICAgbXVsdGlwbHlEcmFnQnlQYXJ0aWNsZVNpemU6IGZhbHNlLFxyXG4vLyAgICAgbXVsdGlwbHlEcmFnQnlQYXJ0aWNsZVZlbG9jaXR5OiBmYWxzZVxyXG4vLyB9KTtcclxuIl19