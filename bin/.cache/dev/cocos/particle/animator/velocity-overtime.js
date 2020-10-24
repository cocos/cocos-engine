(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../enum.js", "../particle.js", "../particle-general-function.js", "./curve-range.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../enum.js"), require("../particle.js"), require("../particle-general-function.js"), require("./curve-range.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global._enum, global.particle, global.particleGeneralFunction, global.curveRange);
    global.velocityOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _enum, _particle, _particleGeneralFunction, _curveRange) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp;

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
  var VELOCITY_X_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.VELOCITY_X;
  var VELOCITY_Y_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.VELOCITY_Y;
  var VELOCITY_Z_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.VELOCITY_Z;

  var _temp_v3 = new _index2.Vec3();

  var VelocityOvertimeModule = (_dec = (0, _index.ccclass)('cc.VelocityOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.type)(_curveRange.default), _dec4 = (0, _index.range)([-1, 1]), _dec5 = (0, _index.displayOrder)(2), _dec6 = (0, _index.tooltip)('X 轴方向上的速度分量'), _dec7 = (0, _index.type)(_curveRange.default), _dec8 = (0, _index.range)([-1, 1]), _dec9 = (0, _index.displayOrder)(3), _dec10 = (0, _index.tooltip)('Y 轴方向上的速度分量'), _dec11 = (0, _index.type)(_curveRange.default), _dec12 = (0, _index.range)([-1, 1]), _dec13 = (0, _index.displayOrder)(4), _dec14 = (0, _index.tooltip)('Z 轴方向上的速度分量'), _dec15 = (0, _index.type)(_curveRange.default), _dec16 = (0, _index.range)([-1, 1]), _dec17 = (0, _index.displayOrder)(5), _dec18 = (0, _index.tooltip)('速度修正系数（只支持 CPU 粒子）'), _dec19 = (0, _index.type)(_enum.Space), _dec20 = (0, _index.displayOrder)(1), _dec21 = (0, _index.tooltip)('速度计算时采用的坐标系'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(VelocityOvertimeModule, _ParticleModuleBase);

    _createClass(VelocityOvertimeModule, [{
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
       * @zh X 轴方向上的速度分量。
       */

    }]);

    function VelocityOvertimeModule() {
      var _this;

      _classCallCheck(this, VelocityOvertimeModule);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(VelocityOvertimeModule).call(this));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "x", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "y", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "z", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "speedModifier", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "space", _descriptor6, _assertThisInitialized(_this));

      _this.rotation = void 0;
      _this.needTransform = void 0;
      _this.name = _particle.PARTICLE_MODULE_NAME.VELOCITY;
      _this.rotation = new _index2.Quat();
      _this.speedModifier.constant = 1;
      _this.needTransform = false;
      _this.needUpdate = true;
      return _this;
    }

    _createClass(VelocityOvertimeModule, [{
      key: "update",
      value: function update(space, worldTransform) {
        this.needTransform = (0, _particleGeneralFunction.calculateTransform)(space, this.space, worldTransform, this.rotation);
      }
    }, {
      key: "animate",
      value: function animate(p, dt) {
        var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

        var vel = _index2.Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed ^ VELOCITY_X_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed ^ VELOCITY_Y_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed ^ VELOCITY_Z_OVERTIME_RAND_OFFSET)));

        if (this.needTransform) {
          _index2.Vec3.transformQuat(vel, vel, this.rotation);
        }

        _index2.Vec3.add(p.animatedVelocity, p.animatedVelocity, vel);

        _index2.Vec3.add(p.ultimateVelocity, p.velocity, p.animatedVelocity);

        _index2.Vec3.multiplyScalar(p.ultimateVelocity, p.ultimateVelocity, this.speedModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, (0, _index2.pseudoRandom)(p.randomSeed + VELOCITY_X_OVERTIME_RAND_OFFSET)));
      }
    }]);

    return VelocityOvertimeModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "x", [_dec3, _index.serializable, _dec4, _dec5, _dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "y", [_dec7, _index.serializable, _dec8, _dec9, _dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "z", [_dec11, _index.serializable, _dec12, _dec13, _dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "speedModifier", [_dec15, _index.serializable, _dec16, _dec17, _dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "space", [_dec19, _index.serializable, _dec20, _dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.Local;
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.VelocityOvertimeModule', VelocityOvertimeModule, {
  //     enable: false,
  //     x: new CurveRange(),
  //     y: new CurveRange(),
  //     z: new CurveRange(),
  //     speedModifier: new CurveRange(),
  //     space: Space.Local
  // });

  _exports.default = VelocityOvertimeModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL3ZlbG9jaXR5LW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIlZFTE9DSVRZX1hfT1ZFUlRJTUVfUkFORF9PRkZTRVQiLCJNb2R1bGVSYW5kU2VlZCIsIlZFTE9DSVRZX1giLCJWRUxPQ0lUWV9ZX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiVkVMT0NJVFlfWSIsIlZFTE9DSVRZX1pfT1ZFUlRJTUVfUkFORF9PRkZTRVQiLCJWRUxPQ0lUWV9aIiwiX3RlbXBfdjMiLCJWZWMzIiwiVmVsb2NpdHlPdmVydGltZU1vZHVsZSIsIkN1cnZlUmFuZ2UiLCJTcGFjZSIsIl9lbmFibGUiLCJ2YWwiLCJ0YXJnZXQiLCJlbmFibGVNb2R1bGUiLCJuYW1lIiwicm90YXRpb24iLCJuZWVkVHJhbnNmb3JtIiwiUEFSVElDTEVfTU9EVUxFX05BTUUiLCJWRUxPQ0lUWSIsIlF1YXQiLCJzcGVlZE1vZGlmaWVyIiwiY29uc3RhbnQiLCJuZWVkVXBkYXRlIiwic3BhY2UiLCJ3b3JsZFRyYW5zZm9ybSIsInAiLCJkdCIsIm5vcm1hbGl6ZWRUaW1lIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwidmVsIiwic2V0IiwieCIsImV2YWx1YXRlIiwicmFuZG9tU2VlZCIsInkiLCJ6IiwidHJhbnNmb3JtUXVhdCIsImFkZCIsImFuaW1hdGVkVmVsb2NpdHkiLCJ1bHRpbWF0ZVZlbG9jaXR5IiwidmVsb2NpdHkiLCJtdWx0aXBseVNjYWxhciIsIlBhcnRpY2xlTW9kdWxlQmFzZSIsInNlcmlhbGl6YWJsZSIsIkxvY2FsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBYUE7QUFDQSxNQUFNQSwrQkFBK0IsR0FBR0MscUJBQWVDLFVBQXZEO0FBQ0EsTUFBTUMsK0JBQStCLEdBQUdGLHFCQUFlRyxVQUF2RDtBQUNBLE1B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LEVBQTZCZCxDQUFDLENBQUNjLGdCQUEvQixFQUFpRFQsR0FBakQ7O0FBQ0F4QixxQkFBS2dDLEdBQUwsQ0FBU2IsQ0FBQyxDQUFDZSxnQkFBWCxFQUE2QmYsQ0FBQyxDQUFDZ0IsUUFBL0IsRUFBeUNoQixDQUFDLENBQUNjLGdCQUEzQzs7QUFDQWpDLHFCQUFLb0MsY0FBTCxDQUFvQmpCLENBQUMsQ0FBQ2UsZ0JBQXRCLEVBQXdDZixDQUFDLENBQUNlLGdCQUExQyxFQUE0RCxLQUFLcEIsYUFBTCxDQUFtQmEsUUFBbkIsQ0FBNEIsSUFBSVIsQ0FBQyxDQUFDRyxpQkFBRixHQUFzQkgsQ0FBQyxDQUFDSSxhQUF4RCxFQUF1RSwwQkFBYUosQ0FBQyxDQUFDUyxVQUFGLEdBQWVwQywrQkFBNUIsQ0FBdkUsQ0FBNUQ7QUFDSDs7OztJQTVGK0M2Qyw0QixtRkFDL0NDLG1COzs7OzthQUNrQixLOztpT0FvQmxCQSxtQjs7Ozs7YUFJVSxJQUFJcEMsbUJBQUosRTs7K0VBTVZvQyxtQjs7Ozs7YUFJVSxJQUFJcEMsbUJBQUosRTs7Z0ZBTVZvQyxtQjs7Ozs7YUFJVSxJQUFJcEMsbUJBQUosRTs7NEZBTVZvQyxtQjs7Ozs7YUFJc0IsSUFBSXBDLG1CQUFKLEU7O29GQU10Qm9DLG1COzs7OzthQUdjbkMsWUFBTW9DLEs7OzZCQThCekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IHBhcnRpY2xlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdG9vbHRpcCwgZGlzcGxheU9yZGVyLCByYW5nZSwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgTWF0NCwgcHNldWRvUmFuZG9tLCBRdWF0LCBWZWMzIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgU3BhY2UgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgUGFydGljbGUsIFBhcnRpY2xlTW9kdWxlQmFzZSwgUEFSVElDTEVfTU9EVUxFX05BTUUgfSBmcm9tICcuLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZVRyYW5zZm9ybSB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xyXG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcclxuaW1wb3J0IHsgTW9kdWxlUmFuZFNlZWQgfSBmcm9tICcuLi9lbnVtJztcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlOiBtYXgtbGluZS1sZW5ndGhcclxuY29uc3QgVkVMT0NJVFlfWF9PVkVSVElNRV9SQU5EX09GRlNFVCA9IE1vZHVsZVJhbmRTZWVkLlZFTE9DSVRZX1g7XHJcbmNvbnN0IFZFTE9DSVRZX1lfT1ZFUlRJTUVfUkFORF9PRkZTRVQgPSBNb2R1bGVSYW5kU2VlZC5WRUxPQ0lUWV9ZO1xyXG5jb25zdCBWRUxPQ0lUWV9aX09WRVJUSU1FX1JBTkRfT0ZGU0VUID0gTW9kdWxlUmFuZFNlZWQuVkVMT0NJVFlfWjtcclxuXHJcbmNvbnN0IF90ZW1wX3YzID0gbmV3IFZlYzMoKTtcclxuXHJcbkBjY2NsYXNzKCdjYy5WZWxvY2l0eU92ZXJ0aW1lTW9kdWxlJylcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVsb2NpdHlPdmVydGltZU1vZHVsZSBleHRlbmRzIFBhcnRpY2xlTW9kdWxlQmFzZSB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBfZW5hYmxlOiBCb29sZWFuID0gZmFsc2U7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgcHVibGljIGdldCBlbmFibGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBlbmFibGUgKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbmFibGUgPT09IHZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2VuYWJsZSA9IHZhbDtcclxuICAgICAgICBpZiAoIXRoaXMudGFyZ2V0KSByZXR1cm47XHJcbiAgICAgICAgdGhpcy50YXJnZXQuZW5hYmxlTW9kdWxlKHRoaXMubmFtZSwgdmFsLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCBYIOi9tOaWueWQkeS4iueahOmAn+W6puWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBAdG9vbHRpcCgnWCDovbTmlrnlkJHkuIrnmoTpgJ/luqbliIbph48nKVxyXG4gICAgcHVibGljIHggPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIFkg6L205pa55ZCR5LiK55qE6YCf5bqm5YiG6YeP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAcmFuZ2UoWy0xLCAxXSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCdZIOi9tOaWueWQkeS4iueahOmAn+W6puWIhumHjycpXHJcbiAgICBwdWJsaWMgeSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemggWiDovbTmlrnlkJHkuIrnmoTpgJ/luqbliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQGRpc3BsYXlPcmRlcig0KVxyXG4gICAgQHRvb2x0aXAoJ1og6L205pa55ZCR5LiK55qE6YCf5bqm5YiG6YePJylcclxuICAgIHB1YmxpYyB6ID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpgJ/luqbkv67mraPns7vmlbDvvIjlj6rmlK/mjIEgQ1BVIOeykuWtkO+8ieOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgn6YCf5bqm5L+u5q2j57O75pWw77yI5Y+q5pSv5oyBIENQVSDnspLlrZDvvIknKVxyXG4gICAgcHVibGljIHNwZWVkTW9kaWZpZXIgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmAn+W6puiuoeeul+aXtumHh+eUqOeahOWdkOagh+ezu1tbU3BhY2VdXeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcGFjZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCfpgJ/luqborqHnrpfml7bph4fnlKjnmoTlnZDmoIfns7snKVxyXG4gICAgcHVibGljIHNwYWNlID0gU3BhY2UuTG9jYWw7XHJcblxyXG4gICAgcHJpdmF0ZSByb3RhdGlvbjogUXVhdDtcclxuICAgIHByaXZhdGUgbmVlZFRyYW5zZm9ybTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBuYW1lID0gUEFSVElDTEVfTU9EVUxFX05BTUUuVkVMT0NJVFk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBRdWF0KCk7XHJcbiAgICAgICAgdGhpcy5zcGVlZE1vZGlmaWVyLmNvbnN0YW50ID0gMTtcclxuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm5lZWRVcGRhdGUgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKHNwYWNlOiBudW1iZXIsIHdvcmxkVHJhbnNmb3JtOiBNYXQ0KSB7XHJcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gY2FsY3VsYXRlVHJhbnNmb3JtKHNwYWNlLCB0aGlzLnNwYWNlLCB3b3JsZFRyYW5zZm9ybSwgdGhpcy5yb3RhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFuaW1hdGUgKHA6IFBhcnRpY2xlLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRpbWUgPSAxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZTtcclxuICAgICAgICBjb25zdCB2ZWwgPSBWZWMzLnNldChfdGVtcF92MywgdGhpcy54LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkIF4gVkVMT0NJVFlfWF9PVkVSVElNRV9SQU5EX09GRlNFVCkpISwgdGhpcy55LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkIF4gVkVMT0NJVFlfWV9PVkVSVElNRV9SQU5EX09GRlNFVCkpISwgdGhpcy56LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkIF4gVkVMT0NJVFlfWl9PVkVSVElNRV9SQU5EX09GRlNFVCkpISk7XHJcbiAgICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xyXG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQodmVsLCB2ZWwsIHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBWZWMzLmFkZChwLmFuaW1hdGVkVmVsb2NpdHksIHAuYW5pbWF0ZWRWZWxvY2l0eSwgdmVsKTtcclxuICAgICAgICBWZWMzLmFkZChwLnVsdGltYXRlVmVsb2NpdHksIHAudmVsb2NpdHksIHAuYW5pbWF0ZWRWZWxvY2l0eSk7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihwLnVsdGltYXRlVmVsb2NpdHksIHAudWx0aW1hdGVWZWxvY2l0eSwgdGhpcy5zcGVlZE1vZGlmaWVyLmV2YWx1YXRlKDEgLSBwLnJlbWFpbmluZ0xpZmV0aW1lIC8gcC5zdGFydExpZmV0aW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgVkVMT0NJVFlfWF9PVkVSVElNRV9SQU5EX09GRlNFVCkpISk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuVmVsb2NpdHlPdmVydGltZU1vZHVsZScsIFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUsIHtcclxuLy8gICAgIGVuYWJsZTogZmFsc2UsXHJcbi8vICAgICB4OiBuZXcgQ3VydmVSYW5nZSgpLFxyXG4vLyAgICAgeTogbmV3IEN1cnZlUmFuZ2UoKSxcclxuLy8gICAgIHo6IG5ldyBDdXJ2ZVJhbmdlKCksXHJcbi8vICAgICBzcGVlZE1vZGlmaWVyOiBuZXcgQ3VydmVSYW5nZSgpLFxyXG4vLyAgICAgc3BhY2U6IFNwYWNlLkxvY2FsXHJcbi8vIH0pO1xyXG4iXX0=