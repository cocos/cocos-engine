(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../enum.js", "../particle-general-function.js", "./curve-range.js", "../particle.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../enum.js"), require("../particle-general-function.js"), require("./curve-range.js"), require("../particle.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global._enum, global.particleGeneralFunction, global.curveRange, global.particle);
    global.forceOvertime = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _enum, _particleGeneralFunction, _curveRange, _particle) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _temp;

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
  var FORCE_OVERTIME_RAND_OFFSET = _enum.ModuleRandSeed.FORCE;

  var _temp_v3 = new _index2.Vec3();

  var ForceOvertimeModule = (_dec = (0, _index.ccclass)('cc.ForceOvertimeModule'), _dec2 = (0, _index.displayOrder)(0), _dec3 = (0, _index.type)(_curveRange.default), _dec4 = (0, _index.range)([-1, 1]), _dec5 = (0, _index.displayOrder)(2), _dec6 = (0, _index.tooltip)('X 轴方向上的加速度分量'), _dec7 = (0, _index.type)(_curveRange.default), _dec8 = (0, _index.range)([-1, 1]), _dec9 = (0, _index.displayOrder)(3), _dec10 = (0, _index.tooltip)('Y 轴方向上的加速度分量'), _dec11 = (0, _index.type)(_curveRange.default), _dec12 = (0, _index.range)([-1, 1]), _dec13 = (0, _index.displayOrder)(4), _dec14 = (0, _index.tooltip)('Z 轴方向上的加速度分量'), _dec15 = (0, _index.type)(_enum.Space), _dec16 = (0, _index.displayOrder)(1), _dec17 = (0, _index.tooltip)('加速度计算时采用的坐标'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(ForceOvertimeModule, _ParticleModuleBase);

    _createClass(ForceOvertimeModule, [{
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
       * @zh X 轴方向上的加速度分量。
       */

    }]);

    function ForceOvertimeModule() {
      var _this;

      _classCallCheck(this, ForceOvertimeModule);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ForceOvertimeModule).call(this));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "x", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "y", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "z", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "space", _descriptor5, _assertThisInitialized(_this));

      _this.randomized = false;
      _this.rotation = void 0;
      _this.needTransform = void 0;
      _this.name = _particle.PARTICLE_MODULE_NAME.FORCE;
      _this.rotation = new _index2.Quat();
      _this.needTransform = false;
      _this.needUpdate = true;
      return _this;
    }

    _createClass(ForceOvertimeModule, [{
      key: "update",
      value: function update(space, worldTransform) {
        this.needTransform = (0, _particleGeneralFunction.calculateTransform)(space, this.space, worldTransform, this.rotation);
      }
    }, {
      key: "animate",
      value: function animate(p, dt) {
        var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;

        var force = _index2.Vec3.set(_temp_v3, this.x.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.y.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)), this.z.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + FORCE_OVERTIME_RAND_OFFSET)));

        if (this.needTransform) {
          _index2.Vec3.transformQuat(force, force, this.rotation);
        }

        _index2.Vec3.scaleAndAdd(p.velocity, p.velocity, force, dt);

        _index2.Vec3.copy(p.ultimateVelocity, p.velocity);
      }
    }]);

    return ForceOvertimeModule;
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
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "space", [_dec15, _index.serializable, _dec16, _dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.Local;
    }
  })), _class2)) || _class); // CCClass.fastDefine('cc.ForceOvertimeModule',ForceOvertimeModule,{
  //     enable : false,
  //     x : new CurveRange(),
  //     y : new CurveRange(),
  //     z : new CurveRange(),
  //     space : Space.Local,
  //     randomized : false
  // });

  _exports.default = ForceOvertimeModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL2ZvcmNlLW92ZXJ0aW1lLnRzIl0sIm5hbWVzIjpbIkZPUkNFX09WRVJUSU1FX1JBTkRfT0ZGU0VUIiwiTW9kdWxlUmFuZFNlZWQiLCJGT1JDRSIsIl90ZW1wX3YzIiwiVmVjMyIsIkZvcmNlT3ZlcnRpbWVNb2R1bGUiLCJDdXJ2ZVJhbmdlIiwiU3BhY2UiLCJfZW5hYmxlIiwidmFsIiwidGFyZ2V0IiwiZW5hYmxlTW9kdWxlIiwibmFtZSIsInJhbmRvbWl6ZWQiLCJyb3RhdGlvbiIsIm5lZWRUcmFuc2Zvcm0iLCJQQVJUSUNMRV9NT0RVTEVfTkFNRSIsIlF1YXQiLCJuZWVkVXBkYXRlIiwic3BhY2UiLCJ3b3JsZFRyYW5zZm9ybSIsInAiLCJkdCIsIm5vcm1hbGl6ZWRUaW1lIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwiZm9yY2UiLCJzZXQiLCJ4IiwiZXZhbHVhdGUiLCJyYW5kb21TZWVkIiwieSIsInoiLCJ0cmFuc2Zvcm1RdWF0Iiwic2NhbGVBbmRBZGQiLCJ2ZWxvY2l0eSIsImNvcHkiLCJ1bHRpbWF0ZVZlbG9jaXR5IiwiUGFydGljbGVNb2R1bGVCYXNlIiwic2VyaWFsaXphYmxlIiwiTG9jYWwiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFhQTtBQUNBLE1BQU1BLDBCQUEwQixHQUFHQyxxQkFBZUMsS0FBbEQ7O0FBRUEsTUFBTUMsUUFBUSxHQUFHLElBQUlDLFlBQUosRUFBakI7O01BR3FCQyxtQixXQURwQixvQkFBUSx3QkFBUixDLFVBT0kseUJBQWEsQ0FBYixDLFVBZUEsaUJBQUtDLG1CQUFMLEMsVUFFQSxrQkFBTSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FBTixDLFVBQ0EseUJBQWEsQ0FBYixDLFVBQ0Esb0JBQVEsY0FBUixDLFVBTUEsaUJBQUtB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LCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBwYXJ0aWNsZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgcmFuZ2UsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IHBzZXVkb1JhbmRvbSwgUXVhdCwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IFNwYWNlIH0gZnJvbSAnLi4vZW51bSc7XHJcbmltcG9ydCB7IGNhbGN1bGF0ZVRyYW5zZm9ybSB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xyXG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuL2N1cnZlLXJhbmdlJztcclxuaW1wb3J0IHsgTW9kdWxlUmFuZFNlZWQgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgUGFydGljbGVNb2R1bGVCYXNlLCBQQVJUSUNMRV9NT0RVTEVfTkFNRX0gZnJvbSAnLi4vcGFydGljbGUnO1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGU6IG1heC1saW5lLWxlbmd0aFxyXG5jb25zdCBGT1JDRV9PVkVSVElNRV9SQU5EX09GRlNFVCA9IE1vZHVsZVJhbmRTZWVkLkZPUkNFO1xyXG5cclxuY29uc3QgX3RlbXBfdjMgPSBuZXcgVmVjMygpO1xyXG5cclxuQGNjY2xhc3MoJ2NjLkZvcmNlT3ZlcnRpbWVNb2R1bGUnKVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGb3JjZU92ZXJ0aW1lTW9kdWxlIGV4dGVuZHMgUGFydGljbGVNb2R1bGVCYXNlIHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIF9lbmFibGU6IEJvb2xlYW4gPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2VuYWJsZSA9PT0gdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlID0gdmFsO1xyXG4gICAgICAgIGlmICghdGhpcy50YXJnZXQpIHJldHVybjtcclxuICAgICAgICB0aGlzLnRhcmdldC5lbmFibGVNb2R1bGUodGhpcy5uYW1lLCB2YWwsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIFgg6L205pa55ZCR5LiK55qE5Yqg6YCf5bqm5YiG6YeP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAcmFuZ2UoWy0xLCAxXSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCdYIOi9tOaWueWQkeS4iueahOWKoOmAn+W6puWIhumHjycpXHJcbiAgICBwdWJsaWMgeCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemggWSDovbTmlrnlkJHkuIrnmoTliqDpgJ/luqbliIbph4/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgQHRvb2x0aXAoJ1kg6L205pa55ZCR5LiK55qE5Yqg6YCf5bqm5YiG6YePJylcclxuICAgIHB1YmxpYyB5ID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCBaIOi9tOaWueWQkeS4iueahOWKoOmAn+W6puWIhumHj+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgnWiDovbTmlrnlkJHkuIrnmoTliqDpgJ/luqbliIbph48nKVxyXG4gICAgcHVibGljIHogPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWKoOmAn+W6puiuoeeul+aXtumHh+eUqOeahOWdkOagh+ezuyBbW1NwYWNlXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoU3BhY2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdG9vbHRpcCgn5Yqg6YCf5bqm6K6h566X5pe26YeH55So55qE5Z2Q5qCHJylcclxuICAgIHB1YmxpYyBzcGFjZSA9IFNwYWNlLkxvY2FsO1xyXG5cclxuICAgIC8vIFRPRE86Y3VycmVudGx5IG5vdCBzdXBwb3J0ZWRcclxuICAgIHB1YmxpYyByYW5kb21pemVkID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSByb3RhdGlvbjogUXVhdDtcclxuICAgIHByaXZhdGUgbmVlZFRyYW5zZm9ybTogYm9vbGVhbjtcclxuICAgIHB1YmxpYyBuYW1lID0gUEFSVElDTEVfTU9EVUxFX05BTUUuRk9SQ0U7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBRdWF0KCk7XHJcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5uZWVkVXBkYXRlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlIChzcGFjZSwgd29ybGRUcmFuc2Zvcm0pIHtcclxuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBjYWxjdWxhdGVUcmFuc2Zvcm0oc3BhY2UsIHRoaXMuc3BhY2UsIHdvcmxkVHJhbnNmb3JtLCB0aGlzLnJvdGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYW5pbWF0ZSAocCwgZHQpIHtcclxuICAgICAgICBjb25zdCBub3JtYWxpemVkVGltZSA9IDEgLSBwLnJlbWFpbmluZ0xpZmV0aW1lIC8gcC5zdGFydExpZmV0aW1lO1xyXG4gICAgICAgIGNvbnN0IGZvcmNlID0gVmVjMy5zZXQoX3RlbXBfdjMsIHRoaXMueC5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIEZPUkNFX09WRVJUSU1FX1JBTkRfT0ZGU0VUKSkhLCB0aGlzLnkuZXZhbHVhdGUobm9ybWFsaXplZFRpbWUsIHBzZXVkb1JhbmRvbShwLnJhbmRvbVNlZWQgKyBGT1JDRV9PVkVSVElNRV9SQU5EX09GRlNFVCkpISwgdGhpcy56LmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgRk9SQ0VfT1ZFUlRJTUVfUkFORF9PRkZTRVQpKSEpO1xyXG4gICAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KGZvcmNlLCBmb3JjZSwgdGhpcy5yb3RhdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFZlYzMuc2NhbGVBbmRBZGQocC52ZWxvY2l0eSwgcC52ZWxvY2l0eSwgZm9yY2UsIGR0KTtcclxuICAgICAgICBWZWMzLmNvcHkocC51bHRpbWF0ZVZlbG9jaXR5LCBwLnZlbG9jaXR5KTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gQ0NDbGFzcy5mYXN0RGVmaW5lKCdjYy5Gb3JjZU92ZXJ0aW1lTW9kdWxlJyxGb3JjZU92ZXJ0aW1lTW9kdWxlLHtcclxuLy8gICAgIGVuYWJsZSA6IGZhbHNlLFxyXG4vLyAgICAgeCA6IG5ldyBDdXJ2ZVJhbmdlKCksXHJcbi8vICAgICB5IDogbmV3IEN1cnZlUmFuZ2UoKSxcclxuLy8gICAgIHogOiBuZXcgQ3VydmVSYW5nZSgpLFxyXG4vLyAgICAgc3BhY2UgOiBTcGFjZS5Mb2NhbCxcclxuLy8gICAgIHJhbmRvbWl6ZWQgOiBmYWxzZVxyXG4vLyB9KTtcclxuIl19