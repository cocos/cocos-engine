(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/3d/framework/renderable-component.js", "../core/assets/material.js", "../core/data/decorators/index.js", "../core/math/index.js", "../core/math/bits.js", "./animator/color-overtime.js", "./animator/curve-range.js", "./animator/force-overtime.js", "./animator/gradient-range.js", "./animator/limit-velocity-overtime.js", "./animator/rotation-overtime.js", "./animator/size-overtime.js", "./animator/texture-animation.js", "./animator/velocity-overtime.js", "./burst.js", "./emitter/shape-module.js", "./enum.js", "./particle-general-function.js", "./renderer/particle-system-renderer-data.js", "./renderer/trail.js", "./particle.js", "../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/3d/framework/renderable-component.js"), require("../core/assets/material.js"), require("../core/data/decorators/index.js"), require("../core/math/index.js"), require("../core/math/bits.js"), require("./animator/color-overtime.js"), require("./animator/curve-range.js"), require("./animator/force-overtime.js"), require("./animator/gradient-range.js"), require("./animator/limit-velocity-overtime.js"), require("./animator/rotation-overtime.js"), require("./animator/size-overtime.js"), require("./animator/texture-animation.js"), require("./animator/velocity-overtime.js"), require("./burst.js"), require("./emitter/shape-module.js"), require("./enum.js"), require("./particle-general-function.js"), require("./renderer/particle-system-renderer-data.js"), require("./renderer/trail.js"), require("./particle.js"), require("../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.renderableComponent, global.material, global.index, global.index, global.bits, global.colorOvertime, global.curveRange, global.forceOvertime, global.gradientRange, global.limitVelocityOvertime, global.rotationOvertime, global.sizeOvertime, global.textureAnimation, global.velocityOvertime, global.burst, global.shapeModule, global._enum, global.particleGeneralFunction, global.particleSystemRendererData, global.trail, global.particle, global.defaultConstants);
    global.particleSystem = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _renderableComponent, _material, _index, _index2, _bits, _colorOvertime, _curveRange, _forceOvertime, _gradientRange, _limitVelocityOvertime, _rotationOvertime, _sizeOvertime, _textureAnimation, _velocityOvertime, _burst, _shapeModule, _enum, _particleGeneralFunction, _particleSystemRendererData, _trail, _particle, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ParticleSystem = void 0;
  _colorOvertime = _interopRequireDefault(_colorOvertime);
  _curveRange = _interopRequireWildcard(_curveRange);
  _forceOvertime = _interopRequireDefault(_forceOvertime);
  _gradientRange = _interopRequireDefault(_gradientRange);
  _limitVelocityOvertime = _interopRequireDefault(_limitVelocityOvertime);
  _rotationOvertime = _interopRequireDefault(_rotationOvertime);
  _sizeOvertime = _interopRequireDefault(_sizeOvertime);
  _textureAnimation = _interopRequireDefault(_textureAnimation);
  _velocityOvertime = _interopRequireDefault(_velocityOvertime);
  _burst = _interopRequireDefault(_burst);
  _shapeModule = _interopRequireDefault(_shapeModule);
  _particleSystemRendererData = _interopRequireDefault(_particleSystemRendererData);
  _trail = _interopRequireDefault(_trail);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _dec49, _dec50, _dec51, _dec52, _dec53, _dec54, _dec55, _dec56, _dec57, _dec58, _dec59, _dec60, _dec61, _dec62, _dec63, _dec64, _dec65, _dec66, _dec67, _dec68, _dec69, _dec70, _dec71, _dec72, _dec73, _dec74, _dec75, _dec76, _dec77, _dec78, _dec79, _dec80, _dec81, _dec82, _dec83, _dec84, _dec85, _dec86, _dec87, _dec88, _dec89, _dec90, _dec91, _dec92, _dec93, _dec94, _dec95, _dec96, _dec97, _dec98, _dec99, _dec100, _dec101, _dec102, _dec103, _dec104, _dec105, _dec106, _dec107, _dec108, _dec109, _dec110, _dec111, _dec112, _dec113, _dec114, _dec115, _dec116, _dec117, _dec118, _dec119, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _temp;

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

  function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _world_mat = new _index2.Mat4();

  var _world_rol = new _index2.Quat();

  var ParticleSystem = (_dec = (0, _index.ccclass)('cc.ParticleSystem'), _dec2 = (0, _index.help)('i18n:cc.ParticleSystem'), _dec3 = (0, _index.menu)('Components/ParticleSystem'), _dec4 = (0, _index.executionOrder)(99), _dec5 = (0, _index.displayOrder)(1), _dec6 = (0, _index.tooltip)('粒子系统能生成的最大粒子数量'), _dec7 = (0, _index.type)(_gradientRange.default), _dec8 = (0, _index.displayOrder)(8), _dec9 = (0, _index.tooltip)('粒子初始颜色'), _dec10 = (0, _index.type)(_enum.Space), _dec11 = (0, _index.displayOrder)(9), _dec12 = (0, _index.tooltip)('选择缩放坐标系'), _dec13 = (0, _index.displayOrder)(10), _dec14 = (0, _index.tooltip)('粒子初始大小'), _dec15 = (0, _index.formerlySerializedAs)('startSize'), _dec16 = (0, _index.type)(_curveRange.default), _dec17 = (0, _index.displayOrder)(10), _dec18 = (0, _index.tooltip)('粒子初始大小'), _dec19 = (0, _index.type)(_curveRange.default), _dec20 = (0, _index.displayOrder)(10), _dec21 = (0, _index.tooltip)('粒子初始大小'), _dec22 = (0, _index.type)(_curveRange.default), _dec23 = (0, _index.displayOrder)(10), _dec24 = (0, _index.tooltip)('粒子初始大小'), _dec25 = (0, _index.type)(_curveRange.default), _dec26 = (0, _index.range)([-1, 1]), _dec27 = (0, _index.displayOrder)(11), _dec28 = (0, _index.tooltip)('粒子初始速度'), _dec29 = (0, _index.displayOrder)(12), _dec30 = (0, _index.tooltip)('粒子初始旋转角度'), _dec31 = (0, _index.type)(_curveRange.default), _dec32 = (0, _index.range)([-1, 1]), _dec33 = (0, _index.displayOrder)(12), _dec34 = (0, _index.tooltip)('粒子初始旋转角度'), _dec35 = (0, _index.type)(_curveRange.default), _dec36 = (0, _index.range)([-1, 1]), _dec37 = (0, _index.displayOrder)(12), _dec38 = (0, _index.tooltip)('粒子初始旋转角度'), _dec39 = (0, _index.type)(_curveRange.default), _dec40 = (0, _index.formerlySerializedAs)('startRotation'), _dec41 = (0, _index.range)([-1, 1]), _dec42 = (0, _index.displayOrder)(12), _dec43 = (0, _index.tooltip)('粒子初始旋转角度'), _dec44 = (0, _index.type)(_curveRange.default), _dec45 = (0, _index.displayOrder)(6), _dec46 = (0, _index.tooltip)('粒子系统开始运行后，延迟粒子发射的时间'), _dec47 = (0, _index.type)(_curveRange.default), _dec48 = (0, _index.displayOrder)(7), _dec49 = (0, _index.tooltip)('粒子生命周期'), _dec50 = (0, _index.displayOrder)(0), _dec51 = (0, _index.tooltip)('粒子系统运行时间'), _dec52 = (0, _index.displayOrder)(2), _dec53 = (0, _index.tooltip)('粒子系统是否循环播放'), _dec54 = (0, _index.displayOrder)(3), _dec55 = (0, _index.tooltip)('选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）'), _dec56 = (0, _index.type)(_enum.Space), _dec57 = (0, _index.displayOrder)(4), _dec58 = (0, _index.tooltip)('控制粒子坐标计算所在的坐标系'), _dec59 = (0, _index.displayOrder)(5), _dec60 = (0, _index.tooltip)('控制整个粒子系统的更新速度'), _dec61 = (0, _index.displayOrder)(2), _dec62 = (0, _index.tooltip)('粒子系统加载后是否自动开始播放'), _dec63 = (0, _index.type)(_curveRange.default), _dec64 = (0, _index.range)([-1, 1]), _dec65 = (0, _index.displayOrder)(13), _dec66 = (0, _index.tooltip)('粒子受重力影响的重力系数'), _dec67 = (0, _index.type)(_curveRange.default), _dec68 = (0, _index.displayOrder)(14), _dec69 = (0, _index.tooltip)('每秒发射的粒子数'), _dec70 = (0, _index.type)(_curveRange.default), _dec71 = (0, _index.displayOrder)(15), _dec72 = (0, _index.tooltip)('每移动单位距离发射的粒子数'), _dec73 = (0, _index.type)([_burst.default]), _dec74 = (0, _index.displayOrder)(16), _dec75 = (0, _index.tooltip)('在某个时间点发射给定数量的粒子'), _dec76 = (0, _index.type)(_material.Material), _dec77 = (0, _index.displayName)('Materials'), _dec78 = (0, _index.visible)(false), _dec79 = (0, _index.type)(_colorOvertime.default), _dec80 = (0, _index.type)(_colorOvertime.default), _dec81 = (0, _index.displayOrder)(23), _dec82 = (0, _index.tooltip)('颜色模块'), _dec83 = (0, _index.type)(_shapeModule.default), _dec84 = (0, _index.type)(_shapeModule.default), _dec85 = (0, _index.displayOrder)(17), _dec86 = (0, _index.tooltip)('发射器模块'), _dec87 = (0, _index.type)(_sizeOvertime.default), _dec88 = (0, _index.type)(_sizeOvertime.default), _dec89 = (0, _index.displayOrder)(21), _dec90 = (0, _index.tooltip)('大小模块'), _dec91 = (0, _index.type)(_velocityOvertime.default), _dec92 = (0, _index.type)(_velocityOvertime.default), _dec93 = (0, _index.displayOrder)(18), _dec94 = (0, _index.tooltip)('速度模块'), _dec95 = (0, _index.type)(_forceOvertime.default), _dec96 = (0, _index.type)(_forceOvertime.default), _dec97 = (0, _index.displayOrder)(19), _dec98 = (0, _index.tooltip)('加速度模块'), _dec99 = (0, _index.type)(_limitVelocityOvertime.default), _dec100 = (0, _index.type)(_limitVelocityOvertime.default), _dec101 = (0, _index.displayOrder)(20), _dec102 = (0, _index.tooltip)('限速模块'), _dec103 = (0, _index.type)(_rotationOvertime.default), _dec104 = (0, _index.type)(_rotationOvertime.default), _dec105 = (0, _index.displayOrder)(22), _dec106 = (0, _index.tooltip)('旋转模块'), _dec107 = (0, _index.type)(_textureAnimation.default), _dec108 = (0, _index.type)(_textureAnimation.default), _dec109 = (0, _index.displayOrder)(24), _dec110 = (0, _index.tooltip)('贴图动画模块'), _dec111 = (0, _index.type)(_trail.default), _dec112 = (0, _index.type)(_trail.default), _dec113 = (0, _index.displayOrder)(25), _dec114 = (0, _index.tooltip)('拖尾模块'), _dec115 = (0, _index.type)(_particleSystemRendererData.default), _dec116 = (0, _index.displayOrder)(26), _dec117 = (0, _index.tooltip)('渲染模块'), _dec118 = (0, _index.displayOrder)(27), _dec119 = (0, _index.tooltip)('是否剔除非 enable 的模块数据'), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = (0, _index.executeInEditMode)(_class = (_class2 = (_temp = /*#__PURE__*/function (_RenderableComponent) {
    _inherits(ParticleSystem, _RenderableComponent);

    _createClass(ParticleSystem, [{
      key: "capacity",

      /**
       * @zh 粒子系统能生成的最大粒子数量。
       */
      get: function get() {
        return this._capacity;
      },
      set: function set(val) {
        this._capacity = Math.floor(val); // @ts-ignore

        if (this.processor && this.processor._model) {
          // @ts-ignore
          this.processor._model.setCapacity(this._capacity);
        }
      }
      /**
       * @zh 粒子初始颜色。
       */

    }, {
      key: "prewarm",

      /**
       * @zh 选中之后，粒子系统会以已播放完一轮之后的状态开始播放（仅当循环播放启用时有效）。
       */
      get: function get() {
        return this._prewarm;
      },
      set: function set(val) {
        if (val === true && this.loop === false) {// console.warn('prewarm only works if loop is also enabled.');
        }

        this._prewarm = val;
      }
      /**
       * @zh 选择粒子系统所在的坐标系[[Space]]。<br>
       */

    }, {
      key: "simulationSpace",
      get: function get() {
        return this._simulationSpace;
      },
      set: function set(val) {
        if (val !== this._simulationSpace) {
          this._simulationSpace = val;

          if (this.processor) {
            this.processor.updateMaterialParams();
            this.processor.updateTrailMaterial();
          }
        }
      }
      /**
       * @zh 控制整个粒子系统的更新速度。
       */

    }, {
      key: "sharedMaterials",
      get: function get() {
        // if we don't create an array copy, the editor will modify the original array directly.
        // @ts-ignore
        return _get(_getPrototypeOf(ParticleSystem.prototype), "sharedMaterials", this);
      },
      set: function set(val) {
        // @ts-ignore
        _set(_getPrototypeOf(ParticleSystem.prototype), "sharedMaterials", val, this, true);
      } // color over lifetime module

    }, {
      key: "colorOverLifetimeModule",

      /**
       * @zh 颜色控制模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._colorOverLifetimeModule) {
            this._colorOverLifetimeModule = new _colorOvertime.default();

            this._colorOverLifetimeModule.bindTarget(this.processor);
          }
        }

        return this._colorOverLifetimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._colorOverLifetimeModule = val;
      } // shape module

    }, {
      key: "shapeModule",

      /**
       * @zh 粒子发射器模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._shapeModule) {
            this._shapeModule = new _shapeModule.default();

            this._shapeModule.onInit(this);
          }
        }

        return this._shapeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._shapeModule = val;
      } // size over lifetime module

    }, {
      key: "sizeOvertimeModule",

      /**
       * @zh 粒子大小模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._sizeOvertimeModule) {
            this._sizeOvertimeModule = new _sizeOvertime.default();

            this._sizeOvertimeModule.bindTarget(this.processor);
          }
        }

        return this._sizeOvertimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._sizeOvertimeModule = val;
      } // velocity overtime module

    }, {
      key: "velocityOvertimeModule",

      /**
       * @zh 粒子速度模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._velocityOvertimeModule) {
            this._velocityOvertimeModule = new _velocityOvertime.default();

            this._velocityOvertimeModule.bindTarget(this.processor);
          }
        }

        return this._velocityOvertimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._velocityOvertimeModule = val;
      } // force overTime module

    }, {
      key: "forceOvertimeModule",

      /**
       * @zh 粒子加速度模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._forceOvertimeModule) {
            this._forceOvertimeModule = new _forceOvertime.default();

            this._forceOvertimeModule.bindTarget(this.processor);
          }
        }

        return this._forceOvertimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._forceOvertimeModule = val;
      } // limit velocity overtime module

    }, {
      key: "limitVelocityOvertimeModule",

      /**
       * @zh 粒子限制速度模块（只支持 CPU 粒子）。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._limitVelocityOvertimeModule) {
            this._limitVelocityOvertimeModule = new _limitVelocityOvertime.default();

            this._limitVelocityOvertimeModule.bindTarget(this.processor);
          }
        }

        return this._limitVelocityOvertimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._limitVelocityOvertimeModule = val;
      } // rotation overtime module

    }, {
      key: "rotationOvertimeModule",

      /**
       * @zh 粒子旋转模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._rotationOvertimeModule) {
            this._rotationOvertimeModule = new _rotationOvertime.default();

            this._rotationOvertimeModule.bindTarget(this.processor);
          }
        }

        return this._rotationOvertimeModule;
      },
      set: function set(val) {
        if (!val) return;
        this._rotationOvertimeModule = val;
      } // texture animation module

    }, {
      key: "textureAnimationModule",

      /**
       * @zh 贴图动画模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._textureAnimationModule) {
            this._textureAnimationModule = new _textureAnimation.default();

            this._textureAnimationModule.bindTarget(this.processor);
          }
        }

        return this._textureAnimationModule;
      },
      set: function set(val) {
        if (!val) return;
        this._textureAnimationModule = val;
      } // trail module

    }, {
      key: "trailModule",

      /**
       * @zh 粒子轨迹模块。
       */
      get: function get() {
        if (_defaultConstants.EDITOR) {
          if (!this._trailModule) {
            this._trailModule = new _trail.default();

            this._trailModule.onInit(this);

            this._trailModule.onEnable();
          }
        }

        return this._trailModule;
      },
      set: function set(val) {
        if (!val) return;
        this._trailModule = val;
      } // particle system renderer

    }]);

    function ParticleSystem() {
      var _this;

      _classCallCheck(this, ParticleSystem);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ParticleSystem).call(this));

      _initializerDefineProperty(_this, "startColor", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "scaleSpace", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startSize3D", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startSizeX", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startSizeY", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startSizeZ", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startSpeed", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startRotation3D", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startRotationX", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startRotationY", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startRotationZ", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startDelay", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startLifetime", _descriptor13, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "duration", _descriptor14, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "loop", _descriptor15, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "simulationSpeed", _descriptor16, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "playOnAwake", _descriptor17, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "gravityModifier", _descriptor18, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "rateOverTime", _descriptor19, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "rateOverDistance", _descriptor20, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "bursts", _descriptor21, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_colorOverLifetimeModule", _descriptor22, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_shapeModule", _descriptor23, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_sizeOvertimeModule", _descriptor24, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_velocityOvertimeModule", _descriptor25, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_forceOvertimeModule", _descriptor26, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_limitVelocityOvertimeModule", _descriptor27, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_rotationOvertimeModule", _descriptor28, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_textureAnimationModule", _descriptor29, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_trailModule", _descriptor30, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "renderer", _descriptor31, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "enableCulling", _descriptor32, _assertThisInitialized(_this));

      _this._isPlaying = void 0;
      _this._isPaused = void 0;
      _this._isStopped = void 0;
      _this._isEmitting = void 0;
      _this._time = void 0;
      _this._emitRateTimeCounter = void 0;
      _this._emitRateDistanceCounter = void 0;
      _this._oldWPos = void 0;
      _this._curWPos = void 0;
      _this._customData1 = void 0;
      _this._customData2 = void 0;
      _this._subEmitters = void 0;

      _initializerDefineProperty(_this, "_prewarm", _descriptor33, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_capacity", _descriptor34, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_simulationSpace", _descriptor35, _assertThisInitialized(_this));

      _this.processor = null;
      _this.rateOverTime.constant = 10;
      _this.startLifetime.constant = 5;
      _this.startSizeX.constant = 1;
      _this.startSpeed.constant = 5; // internal status

      _this._isPlaying = false;
      _this._isPaused = false;
      _this._isStopped = true;
      _this._isEmitting = false;
      _this._time = 0.0; // playback position in seconds.

      _this._emitRateTimeCounter = 0.0;
      _this._emitRateDistanceCounter = 0.0;
      _this._oldWPos = new _index2.Vec3();
      _this._curWPos = new _index2.Vec3();
      _this._customData1 = new _index2.Vec2();
      _this._customData2 = new _index2.Vec2();
      _this._subEmitters = []; // array of { emitter: ParticleSystem, type: 'birth', 'collision' or 'death'}

      return _this;
    }

    _createClass(ParticleSystem, [{
      key: "onLoad",
      value: function onLoad() {
        // HACK, TODO
        this.renderer.onInit(this);
        if (this._shapeModule) this._shapeModule.onInit(this);
        if (this._trailModule) this._trailModule.onInit(this);
        this.bindModule();

        this._resetPosition(); // this._system.add(this);

      }
    }, {
      key: "_onMaterialModified",
      value: function _onMaterialModified(index, material) {
        this.processor.onMaterialModified(index, material);
      }
    }, {
      key: "_onRebuildPSO",
      value: function _onRebuildPSO(index, material) {
        this.processor.onRebuildPSO(index, material);
      }
    }, {
      key: "_collectModels",
      value: function _collectModels() {
        this._models.length = 0;

        this._models.push(this.processor._model);

        if (this._trailModule && this._trailModule.enable && this._trailModule._trailModel) {
          this._models.push(this._trailModule._trailModel);
        }

        return this._models;
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        this.processor.attachToScene();

        if (this._trailModule && this._trailModule.enable) {
          this._trailModule._attachToScene();
        }
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        this.processor.detachFromScene();

        if (this._trailModule && this._trailModule.enable) {
          this._trailModule._detachFromScene();
        }
      }
    }, {
      key: "bindModule",
      value: function bindModule() {
        if (this._colorOverLifetimeModule) this._colorOverLifetimeModule.bindTarget(this.processor);
        if (this._sizeOvertimeModule) this._sizeOvertimeModule.bindTarget(this.processor);
        if (this._rotationOvertimeModule) this._rotationOvertimeModule.bindTarget(this.processor);
        if (this._forceOvertimeModule) this._forceOvertimeModule.bindTarget(this.processor);
        if (this._limitVelocityOvertimeModule) this._limitVelocityOvertimeModule.bindTarget(this.processor);
        if (this._velocityOvertimeModule) this._velocityOvertimeModule.bindTarget(this.processor);
        if (this._textureAnimationModule) this._textureAnimationModule.bindTarget(this.processor);
      } // TODO: Fast forward current particle system by simulating particles over given period of time, then pause it.
      // simulate(time, withChildren, restart, fixedTimeStep) {
      // }

      /**
       * 播放粒子效果。
       */

    }, {
      key: "play",
      value: function play() {
        if (this._isPaused) {
          this._isPaused = false;
        }

        if (this._isStopped) {
          this._isStopped = false;
        }

        this._isPlaying = true;
        this._isEmitting = true;

        this._resetPosition(); // prewarm


        if (this._prewarm) {
          this._prewarmSystem();
        }
      }
      /**
       * 暂停播放粒子效果。
       */

    }, {
      key: "pause",
      value: function pause() {
        if (this._isStopped) {
          console.warn('pause(): particle system is already stopped.');
          return;
        }

        if (this._isPlaying) {
          this._isPlaying = false;
        }

        this._isPaused = true;
      }
      /**
       * 停止播放粒子。
       */

    }, {
      key: "stop",
      value: function stop() {
        if (this._isPlaying || this._isPaused) {
          this.clear();
        }

        if (this._isPlaying) {
          this._isPlaying = false;
        }

        if (this._isPaused) {
          this._isPaused = false;
        }

        this._time = 0.0;
        this._emitRateTimeCounter = 0.0;
        this._emitRateDistanceCounter = 0.0;
        this._isStopped = true;
      } // remove all particles from current particle system.

      /**
       * 将所有粒子从粒子系统中清除。
       */

    }, {
      key: "clear",
      value: function clear() {
        if (this.enabledInHierarchy) {
          this.processor.clear();
          if (this._trailModule) this._trailModule.clear();
        }
      }
      /**
       * @zh 获取当前粒子数量
       */

    }, {
      key: "getParticleCount",
      value: function getParticleCount() {
        return this.processor.getParticleCount();
      }
      /**
       * @ignore
       */

    }, {
      key: "setCustomData1",
      value: function setCustomData1(x, y) {
        _index2.Vec2.set(this._customData1, x, y);
      }
    }, {
      key: "setCustomData2",
      value: function setCustomData2(x, y) {
        _index2.Vec2.set(this._customData2, x, y);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        // this._system.remove(this);
        this.processor.onDestroy();
        if (this._trailModule) this._trailModule.destroy();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this.playOnAwake) {
          this.play();
        }

        this.processor.onEnable();
        if (this._trailModule) this._trailModule.onEnable();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this.processor.onDisable();
        if (this._trailModule) this._trailModule.onDisable();
      }
    }, {
      key: "update",
      value: function update(dt) {
        var scaledDeltaTime = dt * this.simulationSpeed;

        if (this._isPlaying) {
          this._time += scaledDeltaTime; // Execute emission

          this._emit(scaledDeltaTime); // simulation, update particles.


          if (this.processor.updateParticles(scaledDeltaTime) === 0 && !this._isEmitting) {
            this.stop();
          } // update render data


          this.processor.updateRenderData(); // update trail

          if (this._trailModule && this._trailModule.enable) {
            this._trailModule.updateRenderData();
          }
        }
      }
    }, {
      key: "_onVisibilityChange",
      value: function _onVisibilityChange(val) {
        // @ts-ignore
        if (this.processor._model) {
          // @ts-ignore
          this.processor._model.visFlags = val;
        }
      }
    }, {
      key: "emit",
      value: function emit(count, dt) {
        var delta = this._time / this.duration;

        if (this._simulationSpace === _enum.Space.World) {
          this.node.getWorldMatrix(_world_mat);
          this.node.getWorldRotation(_world_rol);
        }

        for (var i = 0; i < count; ++i) {
          var particle = this.processor.getFreeParticle();

          if (particle === null) {
            return;
          }

          var rand = (0, _index2.pseudoRandom)((0, _index2.randomRangeInt)(0, _bits.INT_MAX));

          if (this._shapeModule && this._shapeModule.enable) {
            this._shapeModule.emit(particle);
          } else {
            _index2.Vec3.set(particle.position, 0, 0, 0);

            _index2.Vec3.copy(particle.velocity, _particleGeneralFunction.particleEmitZAxis);
          }

          if (this._textureAnimationModule && this._textureAnimationModule.enable) {
            this._textureAnimationModule.init(particle);
          }

          _index2.Vec3.multiplyScalar(particle.velocity, particle.velocity, this.startSpeed.evaluate(delta, rand));

          if (this._simulationSpace === _enum.Space.World) {
            _index2.Vec3.transformMat4(particle.position, particle.position, _world_mat);

            _index2.Vec3.transformQuat(particle.velocity, particle.velocity, _world_rol);
          }

          _index2.Vec3.copy(particle.ultimateVelocity, particle.velocity); // apply startRotation.


          if (this.startRotation3D) {
            _index2.Vec3.set(particle.rotation, this.startRotationX.evaluate(delta, rand), this.startRotationY.evaluate(delta, rand), this.startRotationZ.evaluate(delta, rand));
          } else {
            _index2.Vec3.set(particle.rotation, 0, 0, this.startRotationZ.evaluate(delta, rand));
          } // apply startSize.


          if (this.startSize3D) {
            _index2.Vec3.set(particle.startSize, this.startSizeX.evaluate(delta, rand), this.startSizeY.evaluate(delta, rand), this.startSizeZ.evaluate(delta, rand));
          } else {
            _index2.Vec3.set(particle.startSize, this.startSizeX.evaluate(delta, rand), 1, 1);

            particle.startSize.y = particle.startSize.x;
          }

          _index2.Vec3.copy(particle.size, particle.startSize); // apply startColor.


          particle.startColor.set(this.startColor.evaluate(delta, rand));
          particle.color.set(particle.startColor); // apply startLifetime.

          particle.startLifetime = this.startLifetime.evaluate(delta, rand) + dt;
          particle.remainingLifetime = particle.startLifetime;
          particle.randomSeed = (0, _index2.randomRangeInt)(0, 233280);
          this.processor.setNewParticle(particle);
        } // end of particles forLoop.

      } // initialize particle system as though it had already completed a full cycle.

    }, {
      key: "_prewarmSystem",
      value: function _prewarmSystem() {
        this.startDelay.mode = _curveRange.Mode.Constant; // clear startDelay.

        this.startDelay.constant = 0;
        var dt = 1.0; // should use varying value?

        var cnt = this.duration / dt;

        for (var i = 0; i < cnt; ++i) {
          this._time += dt;

          this._emit(dt);

          this.processor.updateParticles(dt);
        }
      } // internal function

    }, {
      key: "_emit",
      value: function _emit(dt) {
        // emit particles.
        var startDelay = this.startDelay.evaluate(0, 1);

        if (this._time > startDelay) {
          if (this._time > this.duration + startDelay) {
            // this._time = startDelay; // delay will not be applied from the second loop.(Unity)
            // this._emitRateTimeCounter = 0.0;
            // this._emitRateDistanceCounter = 0.0;
            if (!this.loop) {
              this._isEmitting = false;
              return;
            }
          } // emit by rateOverTime


          this._emitRateTimeCounter += this.rateOverTime.evaluate(this._time / this.duration, 1) * dt;

          if (this._emitRateTimeCounter > 1 && this._isEmitting) {
            var emitNum = Math.floor(this._emitRateTimeCounter);
            this._emitRateTimeCounter -= emitNum;
            this.emit(emitNum, dt);
          } // emit by rateOverDistance


          this.node.getWorldPosition(this._curWPos);

          var distance = _index2.Vec3.distance(this._curWPos, this._oldWPos);

          _index2.Vec3.copy(this._oldWPos, this._curWPos);

          this._emitRateDistanceCounter += distance * this.rateOverDistance.evaluate(this._time / this.duration, 1);

          if (this._emitRateDistanceCounter > 1 && this._isEmitting) {
            var _emitNum = Math.floor(this._emitRateDistanceCounter);

            this._emitRateDistanceCounter -= _emitNum;
            this.emit(_emitNum, dt);
          } // bursts


          var _iterator = _createForOfIteratorHelper(this.bursts),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var burst = _step.value;
              burst.update(this, dt);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }, {
      key: "_resetPosition",
      value: function _resetPosition() {
        this.node.getWorldPosition(this._oldWPos);

        _index2.Vec3.copy(this._curWPos, this._oldWPos);
      }
    }, {
      key: "addSubEmitter",
      value: function addSubEmitter(subEmitter) {
        this._subEmitters.push(subEmitter);
      }
    }, {
      key: "removeSubEmitter",
      value: function removeSubEmitter(idx) {
        this._subEmitters.splice(this._subEmitters.indexOf(idx), 1);
      }
    }, {
      key: "addBurst",
      value: function addBurst(burst) {
        this.bursts.push(burst);
      }
    }, {
      key: "removeBurst",
      value: function removeBurst(idx) {
        this.bursts.splice(this.bursts.indexOf(idx), 1);
      }
      /**
       * @ignore
       */

    }, {
      key: "_onBeforeSerialize",
      value: function _onBeforeSerialize(props) {
        var _this2 = this;

        return this.enableCulling ? props.filter(function (p) {
          return !_particle.PARTICLE_MODULE_PROPERTY.includes(p) || _this2[p] && _this2[p].enable;
        }) : props;
      }
    }, {
      key: "isPlaying",
      get: function get() {
        return this._isPlaying;
      }
    }, {
      key: "isPaused",
      get: function get() {
        return this._isPaused;
      }
    }, {
      key: "isStopped",
      get: function get() {
        return this._isStopped;
      }
    }, {
      key: "isEmitting",
      get: function get() {
        return this._isEmitting;
      }
    }, {
      key: "time",
      get: function get() {
        return this._time;
      }
    }]);

    return ParticleSystem;
  }(_renderableComponent.RenderableComponent), _temp), (_applyDecoratedDescriptor(_class2.prototype, "capacity", [_dec5, _dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "capacity"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "startColor", [_dec7, _index.serializable, _dec8, _dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _gradientRange.default();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "scaleSpace", [_dec10, _index.serializable, _dec11, _dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.Local;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "startSize3D", [_index.serializable, _dec13, _dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "startSizeX", [_dec15, _dec16, _dec17, _dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "startSizeY", [_dec19, _index.serializable, _dec20, _dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "startSizeZ", [_dec22, _index.serializable, _dec23, _dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "startSpeed", [_dec25, _index.serializable, _dec26, _dec27, _dec28], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "startRotation3D", [_index.serializable, _dec29, _dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "startRotationX", [_dec31, _index.serializable, _dec32, _index.radian, _dec33, _dec34], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "startRotationY", [_dec35, _index.serializable, _dec36, _index.radian, _dec37, _dec38], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "startRotationZ", [_dec39, _dec40, _dec41, _index.radian, _dec42, _dec43], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "startDelay", [_dec44, _index.serializable, _dec45, _dec46], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "startLifetime", [_dec47, _index.serializable, _dec48, _dec49], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "duration", [_index.serializable, _dec50, _dec51], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 5.0;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "loop", [_index.serializable, _dec52, _dec53], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "prewarm", [_dec54, _dec55], Object.getOwnPropertyDescriptor(_class2.prototype, "prewarm"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "simulationSpace", [_dec56, _index.serializable, _dec57, _dec58], Object.getOwnPropertyDescriptor(_class2.prototype, "simulationSpace"), _class2.prototype), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "simulationSpeed", [_index.serializable, _dec59, _dec60], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1.0;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "playOnAwake", [_index.serializable, _dec61, _dec62], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "gravityModifier", [_dec63, _index.serializable, _dec64, _dec65, _dec66], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "rateOverTime", [_dec67, _index.serializable, _dec68, _dec69], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "rateOverDistance", [_dec70, _index.serializable, _dec71, _dec72], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "bursts", [_dec73, _index.serializable, _dec74, _dec75], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterials", [_index.override, _dec76, _index.serializable, _dec77, _dec78], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterials"), _class2.prototype), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "_colorOverLifetimeModule", [_dec79], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "colorOverLifetimeModule", [_dec80, _dec81, _dec82], Object.getOwnPropertyDescriptor(_class2.prototype, "colorOverLifetimeModule"), _class2.prototype), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "_shapeModule", [_dec83], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "shapeModule", [_dec84, _dec85, _dec86], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeModule"), _class2.prototype), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "_sizeOvertimeModule", [_dec87], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "sizeOvertimeModule", [_dec88, _dec89, _dec90], Object.getOwnPropertyDescriptor(_class2.prototype, "sizeOvertimeModule"), _class2.prototype), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "_velocityOvertimeModule", [_dec91], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "velocityOvertimeModule", [_dec92, _dec93, _dec94], Object.getOwnPropertyDescriptor(_class2.prototype, "velocityOvertimeModule"), _class2.prototype), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "_forceOvertimeModule", [_dec95], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "forceOvertimeModule", [_dec96, _dec97, _dec98], Object.getOwnPropertyDescriptor(_class2.prototype, "forceOvertimeModule"), _class2.prototype), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "_limitVelocityOvertimeModule", [_dec99], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "limitVelocityOvertimeModule", [_dec100, _dec101, _dec102], Object.getOwnPropertyDescriptor(_class2.prototype, "limitVelocityOvertimeModule"), _class2.prototype), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "_rotationOvertimeModule", [_dec103], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "rotationOvertimeModule", [_dec104, _dec105, _dec106], Object.getOwnPropertyDescriptor(_class2.prototype, "rotationOvertimeModule"), _class2.prototype), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "_textureAnimationModule", [_dec107], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "textureAnimationModule", [_dec108, _dec109, _dec110], Object.getOwnPropertyDescriptor(_class2.prototype, "textureAnimationModule"), _class2.prototype), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "_trailModule", [_dec111], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "trailModule", [_dec112, _dec113, _dec114], Object.getOwnPropertyDescriptor(_class2.prototype, "trailModule"), _class2.prototype), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "renderer", [_dec115, _index.serializable, _dec116, _dec117], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _particleSystemRendererData.default();
    }
  }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "enableCulling", [_index.serializable, _dec118, _dec119], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "_prewarm", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "_capacity", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 100;
    }
  }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "_simulationSpace", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.Space.Local;
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class);
  _exports.ParticleSystem = ParticleSystem;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3BhcnRpY2xlLXN5c3RlbS50cyJdLCJuYW1lcyI6WyJfd29ybGRfbWF0IiwiTWF0NCIsIl93b3JsZF9yb2wiLCJRdWF0IiwiUGFydGljbGVTeXN0ZW0iLCJHcmFkaWVudFJhbmdlIiwiU3BhY2UiLCJDdXJ2ZVJhbmdlIiwiQnVyc3QiLCJNYXRlcmlhbCIsIkNvbG9yT3ZlckxpZmV0aW1lTW9kdWxlIiwiU2hhcGVNb2R1bGUiLCJTaXplT3ZlcnRpbWVNb2R1bGUiLCJWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIiwiRm9yY2VPdmVydGltZU1vZHVsZSIsIkxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSIsIlJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUiLCJUZXh0dXJlQW5pbWF0aW9uTW9kdWxlIiwiVHJhaWxNb2R1bGUiLCJQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyIiwiZXhlY3V0ZUluRWRpdE1vZGUiLCJfY2FwYWNpdHkiLCJ2YWwiLCJNYXRoIiwiZmxvb3IiLCJwcm9jZXNzb3IiLCJfbW9kZWwiLCJzZXRDYXBhY2l0eSIsIl9wcmV3YXJtIiwibG9vcCIsIl9zaW11bGF0aW9uU3BhY2UiLCJ1cGRhdGVNYXRlcmlhbFBhcmFtcyIsInVwZGF0ZVRyYWlsTWF0ZXJpYWwiLCJFRElUT1IiLCJfY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUiLCJiaW5kVGFyZ2V0IiwiX3NoYXBlTW9kdWxlIiwib25Jbml0IiwiX3NpemVPdmVydGltZU1vZHVsZSIsIl92ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIiwiX2ZvcmNlT3ZlcnRpbWVNb2R1bGUiLCJfbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIiwiX3JvdGF0aW9uT3ZlcnRpbWVNb2R1bGUiLCJfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZSIsIl90cmFpbE1vZHVsZSIsIm9uRW5hYmxlIiwiX2lzUGxheWluZyIsIl9pc1BhdXNlZCIsIl9pc1N0b3BwZWQiLCJfaXNFbWl0dGluZyIsIl90aW1lIiwiX2VtaXRSYXRlVGltZUNvdW50ZXIiLCJfZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIiLCJfb2xkV1BvcyIsIl9jdXJXUG9zIiwiX2N1c3RvbURhdGExIiwiX2N1c3RvbURhdGEyIiwiX3N1YkVtaXR0ZXJzIiwicmF0ZU92ZXJUaW1lIiwiY29uc3RhbnQiLCJzdGFydExpZmV0aW1lIiwic3RhcnRTaXplWCIsInN0YXJ0U3BlZWQiLCJWZWMzIiwiVmVjMiIsInJlbmRlcmVyIiwiYmluZE1vZHVsZSIsIl9yZXNldFBvc2l0aW9uIiwiaW5kZXgiLCJtYXRlcmlhbCIsIm9uTWF0ZXJpYWxNb2RpZmllZCIsIm9uUmVidWlsZFBTTyIsIl9tb2RlbHMiLCJsZW5ndGgiLCJwdXNoIiwiZW5hYmxlIiwiX3RyYWlsTW9kZWwiLCJhdHRhY2hUb1NjZW5lIiwiX2F0dGFjaFRvU2NlbmUiLCJkZXRhY2hGcm9tU2NlbmUiLCJfZGV0YWNoRnJvbVNjZW5lIiwiX3ByZXdhcm1TeXN0ZW0iLCJjb25zb2xlIiwid2FybiIsImNsZWFyIiwiZW5hYmxlZEluSGllcmFyY2h5IiwiZ2V0UGFydGljbGVDb3VudCIsIngiLCJ5Iiwic2V0Iiwib25EZXN0cm95IiwiZGVzdHJveSIsInBsYXlPbkF3YWtlIiwicGxheSIsIm9uRGlzYWJsZSIsImR0Iiwic2NhbGVkRGVsdGFUaW1lIiwic2ltdWxhdGlvblNwZWVkIiwiX2VtaXQiLCJ1cGRhdGVQYXJ0aWNsZXMiLCJzdG9wIiwidXBkYXRlUmVuZGVyRGF0YSIsInZpc0ZsYWdzIiwiY291bnQiLCJkZWx0YSIsImR1cmF0aW9uIiwiV29ybGQiLCJub2RlIiwiZ2V0V29ybGRNYXRyaXgiLCJnZXRXb3JsZFJvdGF0aW9uIiwiaSIsInBhcnRpY2xlIiwiZ2V0RnJlZVBhcnRpY2xlIiwicmFuZCIsIklOVF9NQVgiLCJlbWl0IiwicG9zaXRpb24iLCJjb3B5IiwidmVsb2NpdHkiLCJwYXJ0aWNsZUVtaXRaQXhpcyIsImluaXQiLCJtdWx0aXBseVNjYWxhciIsImV2YWx1YXRlIiwidHJhbnNmb3JtTWF0NCIsInRyYW5zZm9ybVF1YXQiLCJ1bHRpbWF0ZVZlbG9jaXR5Iiwic3RhcnRSb3RhdGlvbjNEIiwicm90YXRpb24iLCJzdGFydFJvdGF0aW9uWCIsInN0YXJ0Um90YXRpb25ZIiwic3RhcnRSb3RhdGlvbloiLCJzdGFydFNpemUzRCIsInN0YXJ0U2l6ZSIsInN0YXJ0U2l6ZVkiLCJzdGFydFNpemVaIiwic2l6ZSIsInN0YXJ0Q29sb3IiLCJjb2xvciIsInJlbWFpbmluZ0xpZmV0aW1lIiwicmFuZG9tU2VlZCIsInNldE5ld1BhcnRpY2xlIiwic3RhcnREZWxheSIsIm1vZGUiLCJNb2RlIiwiQ29uc3RhbnQiLCJjbnQiLCJlbWl0TnVtIiwiZ2V0V29ybGRQb3NpdGlvbiIsImRpc3RhbmNlIiwicmF0ZU92ZXJEaXN0YW5jZSIsImJ1cnN0cyIsImJ1cnN0IiwidXBkYXRlIiwic3ViRW1pdHRlciIsImlkeCIsInNwbGljZSIsImluZGV4T2YiLCJwcm9wcyIsImVuYWJsZUN1bGxpbmciLCJmaWx0ZXIiLCJwIiwiUEFSVElDTEVfTU9EVUxFX1BST1BFUlRZIiwiaW5jbHVkZXMiLCJSZW5kZXJhYmxlQ29tcG9uZW50Iiwic2VyaWFsaXphYmxlIiwiTG9jYWwiLCJyYWRpYW4iLCJvdmVycmlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUNBLE1BQU1BLFVBQVUsR0FBRyxJQUFJQyxZQUFKLEVBQW5COztBQUNBLE1BQU1DLFVBQVUsR0FBRyxJQUFJQyxZQUFKLEVBQW5COztNQU9hQyxjLFdBTFosb0JBQVEsbUJBQVIsQyxVQUNBLGlCQUFLLHdCQUFMLEMsVUFDQSxpQkFBSywyQkFBTCxDLFVBQ0EsMkJBQWUsRUFBZixDLFVBT0kseUJBQWEsQ0FBYixDLFVBQ0Esb0JBQVEsZ0JBQVIsQyxVQWlCQSxpQkFBS0Msc0JBQUwsQyxVQUVBLHlCQUFhLENBQWIsQyxVQUNBLG9CQUFRLFFBQVIsQyxXQUdBLGlCQUFLQyxXQUFMLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxTQUFSLEMsV0FJQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxRQUFSLEMsV0FNQSxpQ0FBcUIsV0FBckIsQyxXQUNBLGlCQUFLQyxtQkFBTCxDLFdBQ0EseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsUUFBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxRQUFSLEMsV0FNQSxpQkFBS0EsbUJBQUwsQyxXQUVBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLFFBQVIsQyxXQU1BLGlCQUFLQSxtQkFBTCxDLFdBRUEsa0JBQU0sQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBQU4sQyxXQUNBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLFFBQVIsQyxXQUlBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLFVBQVIsQyxXQU1BLGlCQUFLQSxtQkFBTCxDLFdBRUEsa0JBQU0sQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBQU4sQyxXQUVBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLFVBQVIsQyxXQU1BLGlCQUFLQSxtQkFBTCxDLFdBRUEsa0JBQU0sQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBQU4sQyxXQUVBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLFVBQVIsQyxXQU1BLGlCQUFLQSxtQkFBTCxDLFdBQ0EsaUNBQXFCLGVBQXJCLEMsV0FDQSxrQkFBTSxDQUFDLENBQUMsQ0FBRixFQUFLLENBQUwsQ0FBTixDLFdBRUEseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsVUFBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxxQkFBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxRQUFSLEMsV0FPQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxVQUFSLEMsV0FPQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSxZQUFSLEMsV0FNQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSx5Q0FBUixDLFdBZUEsaUJBQUtELFdBQUwsQyxXQUVBLHlCQUFhLENBQWIsQyxXQUNBLG9CQUFRLGdCQUFSLEMsV0FtQkEseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsZUFBUixDLFdBT0EseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsaUJBQVIsQyxXQU1BLGlCQUFLQyxtQkFBTCxDLFdBRUEsa0JBQU0sQ0FBQyxDQUFDLENBQUYsRUFBSyxDQUFMLENBQU4sQyxXQUNBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLGNBQVIsQyxXQU9BLGlCQUFLQSxtQkFBTCxDLFdBRUEseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsVUFBUixDLFdBTUEsaUJBQUtBLG1CQUFMLEMsV0FFQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxlQUFSLEMsV0FNQSxpQkFBSyxDQUFDQyxjQUFELENBQUwsQyxXQUVBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLGlCQUFSLEMsV0FJQSxpQkFBS0Msa0JBQUwsQyxXQUVBLHdCQUFZLFdBQVosQyxXQUNBLG9CQUFRLEtBQVIsQyxXQWFBLGlCQUFLQyxzQkFBTCxDLFdBS0EsaUJBQUtBLHNCQUFMLEMsV0FDQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxNQUFSLEMsV0FpQkEsaUJBQUtDLG9CQUFMLEMsV0FLQSxpQkFBS0Esb0JBQUwsQyxXQUNBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLE9BQVIsQyxXQWlCQSxpQkFBS0MscUJBQUwsQyxXQUtBLGlCQUFLQSxxQkFBTCxDLFdBQ0EseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsTUFBUixDLFdBaUJBLGlCQUFLQyx5QkFBTCxDLFdBS0EsaUJBQUtBLHlCQUFMLEMsV0FDQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxNQUFSLEMsV0FpQkEsaUJBQUtDLHNCQUFMLEMsV0FLQSxpQkFBS0Esc0JBQUwsQyxXQUNBLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLE9BQVIsQyxXQWlCQSxpQkFBS0MsOEJBQUwsQyxZQU1BLGlCQUFLQSw4QkFBTCxDLFlBQ0EseUJBQWEsRUFBYixDLFlBQ0Esb0JBQVEsTUFBUixDLFlBaUJBLGlCQUFLQyx5QkFBTCxDLFlBS0EsaUJBQUtBLHlCQUFMLEMsWUFDQSx5QkFBYSxFQUFiLEMsWUFDQSxvQkFBUSxNQUFSLEMsWUFpQkEsaUJBQUtDLHlCQUFMLEMsWUFLQSxpQkFBS0EseUJBQUwsQyxZQUNBLHlCQUFhLEVBQWIsQyxZQUNBLG9CQUFRLFFBQVIsQyxZQWlCQSxpQkFBS0MsY0FBTCxDLFlBS0EsaUJBQUtBLGNBQUwsQyxZQUNBLHlCQUFhLEVBQWIsQyxZQUNBLG9CQUFRLE1BQVIsQyxZQWtCQSxpQkFBS0MsbUNBQUwsQyxZQUVBLHlCQUFhLEVBQWIsQyxZQUNBLG9CQUFRLE1BQVIsQyxZQUtBLHlCQUFhLEVBQWIsQyxZQUNBLG9CQUFRLG9CQUFSLEMsaUVBcmVKQyx3Qjs7Ozs7O0FBR0c7OzswQkFLdUI7QUFDbkIsZUFBTyxLQUFLQyxTQUFaO0FBQ0gsTzt3QkFFb0JDLEcsRUFBSztBQUN0QixhQUFLRCxTQUFMLEdBQWlCRSxJQUFJLENBQUNDLEtBQUwsQ0FBV0YsR0FBWCxDQUFqQixDQURzQixDQUV0Qjs7QUFDQSxZQUFJLEtBQUtHLFNBQUwsSUFBa0IsS0FBS0EsU0FBTCxDQUFlQyxNQUFyQyxFQUE2QztBQUN6QztBQUNBLGVBQUtELFNBQUwsQ0FBZUMsTUFBZixDQUFzQkMsV0FBdEIsQ0FBa0MsS0FBS04sU0FBdkM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7QUFpSUE7OzswQkFLZTtBQUNYLGVBQU8sS0FBS08sUUFBWjtBQUNILE87d0JBRVlOLEcsRUFBSztBQUNkLFlBQUlBLEdBQUcsS0FBSyxJQUFSLElBQWdCLEtBQUtPLElBQUwsS0FBYyxLQUFsQyxFQUF5QyxDQUNyQztBQUNIOztBQUNELGFBQUtELFFBQUwsR0FBZ0JOLEdBQWhCO0FBQ0g7QUFFRDs7Ozs7OzBCQU91QjtBQUNuQixlQUFPLEtBQUtRLGdCQUFaO0FBQ0gsTzt3QkFFb0JSLEcsRUFBSztBQUN0QixZQUFJQSxHQUFHLEtBQUssS0FBS1EsZ0JBQWpCLEVBQW1DO0FBQy9CLGVBQUtBLGdCQUFMLEdBQXdCUixHQUF4Qjs7QUFDQSxjQUFJLEtBQUtHLFNBQVQsRUFBb0I7QUFDaEIsaUJBQUtBLFNBQUwsQ0FBZU0sb0JBQWY7QUFDQSxpQkFBS04sU0FBTCxDQUFlTyxtQkFBZjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7MEJBMkR1QjtBQUNuQjtBQUNBO0FBQ0E7QUFDSCxPO3dCQUVvQlYsRyxFQUFLO0FBQ3RCO0FBQ0EsMkVBQXdCQSxHQUF4QjtBQUNILE8sQ0FFRDs7Ozs7QUFHQTs7OzBCQU1zQztBQUNsQyxZQUFJVyx3QkFBSixFQUFZO0FBQ1IsY0FBSSxDQUFDLEtBQUtDLHdCQUFWLEVBQW9DO0FBQ2hDLGlCQUFLQSx3QkFBTCxHQUFnQyxJQUFJeEIsc0JBQUosRUFBaEM7O0FBQ0EsaUJBQUt3Qix3QkFBTCxDQUE4QkMsVUFBOUIsQ0FBeUMsS0FBS1YsU0FBOUM7QUFDSDtBQUNKOztBQUNELGVBQU8sS0FBS1Msd0JBQVo7QUFDSCxPO3dCQUVtQ1osRyxFQUFLO0FBQ3JDLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ1YsYUFBS1ksd0JBQUwsR0FBZ0NaLEdBQWhDO0FBQ0gsTyxDQUVEOzs7OztBQUdBOzs7MEJBTTBCO0FBQ3RCLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS0csWUFBVixFQUF3QjtBQUNwQixpQkFBS0EsWUFBTCxHQUFvQixJQUFJekIsb0JBQUosRUFBcEI7O0FBQ0EsaUJBQUt5QixZQUFMLENBQWtCQyxNQUFsQixDQUF5QixJQUF6QjtBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLRCxZQUFaO0FBQ0gsTzt3QkFFdUJkLEcsRUFBSztBQUN6QixZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNWLGFBQUtjLFlBQUwsR0FBb0JkLEdBQXBCO0FBQ0gsTyxDQUVEOzs7OztBQUdBOzs7MEJBTWlDO0FBQzdCLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS0ssbUJBQVYsRUFBK0I7QUFDM0IsaUJBQUtBLG1CQUFMLEdBQTJCLElBQUkxQixxQkFBSixFQUEzQjs7QUFDQSxpQkFBSzBCLG1CQUFMLENBQXlCSCxVQUF6QixDQUFvQyxLQUFLVixTQUF6QztBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLYSxtQkFBWjtBQUNILE87d0JBRThCaEIsRyxFQUFLO0FBQ2hDLFlBQUksQ0FBQ0EsR0FBTCxFQUFVO0FBQ1YsYUFBS2dCLG1CQUFMLEdBQTJCaEIsR0FBM0I7QUFDSCxPLENBRUQ7Ozs7O0FBR0E7OzswQkFNcUM7QUFDakMsWUFBSVcsd0JBQUosRUFBWTtBQUNSLGNBQUksQ0FBQyxLQUFLTSx1QkFBVixFQUFtQztBQUMvQixpQkFBS0EsdUJBQUwsR0FBK0IsSUFBSTFCLHlCQUFKLEVBQS9COztBQUNBLGlCQUFLMEIsdUJBQUwsQ0FBNkJKLFVBQTdCLENBQXdDLEtBQUtWLFNBQTdDO0FBQ0g7QUFDSjs7QUFDRCxlQUFPLEtBQUtjLHVCQUFaO0FBQ0gsTzt3QkFFa0NqQixHLEVBQUs7QUFDcEMsWUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDVixhQUFLaUIsdUJBQUwsR0FBK0JqQixHQUEvQjtBQUNILE8sQ0FFRDs7Ozs7QUFHQTs7OzBCQU1rQztBQUM5QixZQUFJVyx3QkFBSixFQUFZO0FBQ1IsY0FBSSxDQUFDLEtBQUtPLG9CQUFWLEVBQWdDO0FBQzVCLGlCQUFLQSxvQkFBTCxHQUE0QixJQUFJMUIsc0JBQUosRUFBNUI7O0FBQ0EsaUJBQUswQixvQkFBTCxDQUEwQkwsVUFBMUIsQ0FBcUMsS0FBS1YsU0FBMUM7QUFDSDtBQUNKOztBQUNELGVBQU8sS0FBS2Usb0JBQVo7QUFDSCxPO3dCQUUrQmxCLEcsRUFBSztBQUNqQyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNWLGFBQUtrQixvQkFBTCxHQUE0QmxCLEdBQTVCO0FBQ0gsTyxDQUVEOzs7OztBQUlBOzs7MEJBTTBDO0FBQ3RDLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS1EsNEJBQVYsRUFBd0M7QUFDcEMsaUJBQUtBLDRCQUFMLEdBQW9DLElBQUkxQiw4QkFBSixFQUFwQzs7QUFDQSxpQkFBSzBCLDRCQUFMLENBQWtDTixVQUFsQyxDQUE2QyxLQUFLVixTQUFsRDtBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLZ0IsNEJBQVo7QUFDSCxPO3dCQUV1Q25CLEcsRUFBSztBQUN6QyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNWLGFBQUttQiw0QkFBTCxHQUFvQ25CLEdBQXBDO0FBQ0gsTyxDQUVEOzs7OztBQUdBOzs7MEJBTXFDO0FBQ2pDLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS1MsdUJBQVYsRUFBbUM7QUFDL0IsaUJBQUtBLHVCQUFMLEdBQStCLElBQUkxQix5QkFBSixFQUEvQjs7QUFDQSxpQkFBSzBCLHVCQUFMLENBQTZCUCxVQUE3QixDQUF3QyxLQUFLVixTQUE3QztBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLaUIsdUJBQVo7QUFDSCxPO3dCQUVrQ3BCLEcsRUFBSztBQUNwQyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNWLGFBQUtvQix1QkFBTCxHQUErQnBCLEdBQS9CO0FBQ0gsTyxDQUVEOzs7OztBQUdBOzs7MEJBTXFDO0FBQ2pDLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS1UsdUJBQVYsRUFBbUM7QUFDL0IsaUJBQUtBLHVCQUFMLEdBQStCLElBQUkxQix5QkFBSixFQUEvQjs7QUFDQSxpQkFBSzBCLHVCQUFMLENBQTZCUixVQUE3QixDQUF3QyxLQUFLVixTQUE3QztBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLa0IsdUJBQVo7QUFDSCxPO3dCQUVrQ3JCLEcsRUFBSztBQUNwQyxZQUFJLENBQUNBLEdBQUwsRUFBVTtBQUNWLGFBQUtxQix1QkFBTCxHQUErQnJCLEdBQS9CO0FBQ0gsTyxDQUVEOzs7OztBQUdBOzs7MEJBTTBCO0FBQ3RCLFlBQUlXLHdCQUFKLEVBQVk7QUFDUixjQUFJLENBQUMsS0FBS1csWUFBVixFQUF3QjtBQUNwQixpQkFBS0EsWUFBTCxHQUFvQixJQUFJMUIsY0FBSixFQUFwQjs7QUFDQSxpQkFBSzBCLFlBQUwsQ0FBa0JQLE1BQWxCLENBQXlCLElBQXpCOztBQUNBLGlCQUFLTyxZQUFMLENBQWtCQyxRQUFsQjtBQUNIO0FBQ0o7O0FBQ0QsZUFBTyxLQUFLRCxZQUFaO0FBQ0gsTzt3QkFFdUJ0QixHLEVBQUs7QUFDekIsWUFBSSxDQUFDQSxHQUFMLEVBQVU7QUFDVixhQUFLc0IsWUFBTCxHQUFvQnRCLEdBQXBCO0FBQ0gsTyxDQUVEOzs7O0FBMkNBLDhCQUFlO0FBQUE7O0FBQUE7O0FBQ1g7O0FBRFc7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsWUEzQlB3QixVQTJCTztBQUFBLFlBMUJQQyxTQTBCTztBQUFBLFlBekJQQyxVQXlCTztBQUFBLFlBeEJQQyxXQXdCTztBQUFBLFlBdEJQQyxLQXNCTztBQUFBLFlBckJQQyxvQkFxQk87QUFBQSxZQXBCUEMsd0JBb0JPO0FBQUEsWUFuQlBDLFFBbUJPO0FBQUEsWUFsQlBDLFFBa0JPO0FBQUEsWUFoQlBDLFlBZ0JPO0FBQUEsWUFmUEMsWUFlTztBQUFBLFlBYlBDLFlBYU87O0FBQUE7O0FBQUE7O0FBQUE7O0FBQUEsWUFGUmhDLFNBRVEsR0FGNkIsSUFFN0I7QUFHWCxZQUFLaUMsWUFBTCxDQUFrQkMsUUFBbEIsR0FBNkIsRUFBN0I7QUFDQSxZQUFLQyxhQUFMLENBQW1CRCxRQUFuQixHQUE4QixDQUE5QjtBQUNBLFlBQUtFLFVBQUwsQ0FBZ0JGLFFBQWhCLEdBQTJCLENBQTNCO0FBQ0EsWUFBS0csVUFBTCxDQUFnQkgsUUFBaEIsR0FBMkIsQ0FBM0IsQ0FOVyxDQVFYOztBQUNBLFlBQUtiLFVBQUwsR0FBa0IsS0FBbEI7QUFDQSxZQUFLQyxTQUFMLEdBQWlCLEtBQWpCO0FBQ0EsWUFBS0MsVUFBTCxHQUFrQixJQUFsQjtBQUNBLFlBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFFQSxZQUFLQyxLQUFMLEdBQWEsR0FBYixDQWRXLENBY1E7O0FBQ25CLFlBQUtDLG9CQUFMLEdBQTRCLEdBQTVCO0FBQ0EsWUFBS0Msd0JBQUwsR0FBZ0MsR0FBaEM7QUFDQSxZQUFLQyxRQUFMLEdBQWdCLElBQUlVLFlBQUosRUFBaEI7QUFDQSxZQUFLVCxRQUFMLEdBQWdCLElBQUlTLFlBQUosRUFBaEI7QUFFQSxZQUFLUixZQUFMLEdBQW9CLElBQUlTLFlBQUosRUFBcEI7QUFDQSxZQUFLUixZQUFMLEdBQW9CLElBQUlRLFlBQUosRUFBcEI7QUFFQSxZQUFLUCxZQUFMLEdBQW9CLEVBQXBCLENBdkJXLENBdUJhOztBQXZCYjtBQXdCZDs7OzsrQkFFZ0I7QUFDYjtBQUNBLGFBQUtRLFFBQUwsQ0FBYzVCLE1BQWQsQ0FBcUIsSUFBckI7QUFDQSxZQUFJLEtBQUtELFlBQVQsRUFBdUIsS0FBS0EsWUFBTCxDQUFrQkMsTUFBbEIsQ0FBeUIsSUFBekI7QUFDdkIsWUFBSSxLQUFLTyxZQUFULEVBQXVCLEtBQUtBLFlBQUwsQ0FBa0JQLE1BQWxCLENBQXlCLElBQXpCO0FBQ3ZCLGFBQUs2QixVQUFMOztBQUNBLGFBQUtDLGNBQUwsR0FOYSxDQVFiOztBQUNIOzs7MENBRTJCQyxLLEVBQWVDLFEsRUFBb0I7QUFDM0QsYUFBSzVDLFNBQUwsQ0FBZ0I2QyxrQkFBaEIsQ0FBbUNGLEtBQW5DLEVBQTBDQyxRQUExQztBQUNIOzs7b0NBRXFCRCxLLEVBQWVDLFEsRUFBb0I7QUFDckQsYUFBSzVDLFNBQUwsQ0FBZ0I4QyxZQUFoQixDQUE2QkgsS0FBN0IsRUFBb0NDLFFBQXBDO0FBQ0g7Ozt1Q0FFdUM7QUFDcEMsYUFBS0csT0FBTCxDQUFhQyxNQUFiLEdBQXNCLENBQXRCOztBQUNBLGFBQUtELE9BQUwsQ0FBYUUsSUFBYixDQUFtQixLQUFLakQsU0FBTixDQUF3QkMsTUFBMUM7O0FBQ0EsWUFBSSxLQUFLa0IsWUFBTCxJQUFxQixLQUFLQSxZQUFMLENBQWtCK0IsTUFBdkMsSUFBa0QsS0FBSy9CLFlBQU4sQ0FBMkJnQyxXQUFoRixFQUE2RjtBQUN6RixlQUFLSixPQUFMLENBQWFFLElBQWIsQ0FBbUIsS0FBSzlCLFlBQU4sQ0FBMkJnQyxXQUE3QztBQUNIOztBQUNELGVBQU8sS0FBS0osT0FBWjtBQUNIOzs7dUNBRTJCO0FBQ3hCLGFBQUsvQyxTQUFMLENBQWdCb0QsYUFBaEI7O0FBQ0EsWUFBSSxLQUFLakMsWUFBTCxJQUFxQixLQUFLQSxZQUFMLENBQWtCK0IsTUFBM0MsRUFBbUQ7QUFDL0MsZUFBSy9CLFlBQUwsQ0FBa0JrQyxjQUFsQjtBQUNIO0FBQ0o7Ozt5Q0FFNkI7QUFDMUIsYUFBS3JELFNBQUwsQ0FBZ0JzRCxlQUFoQjs7QUFDQSxZQUFJLEtBQUtuQyxZQUFMLElBQXFCLEtBQUtBLFlBQUwsQ0FBa0IrQixNQUEzQyxFQUFtRDtBQUMvQyxlQUFLL0IsWUFBTCxDQUFrQm9DLGdCQUFsQjtBQUNIO0FBQ0o7OzttQ0FFb0I7QUFDakIsWUFBSSxLQUFLOUMsd0JBQVQsRUFBbUMsS0FBS0Esd0JBQUwsQ0FBOEJDLFVBQTlCLENBQXlDLEtBQUtWLFNBQTlDO0FBQ25DLFlBQUksS0FBS2EsbUJBQVQsRUFBOEIsS0FBS0EsbUJBQUwsQ0FBeUJILFVBQXpCLENBQW9DLEtBQUtWLFNBQXpDO0FBQzlCLFlBQUksS0FBS2lCLHVCQUFULEVBQWtDLEtBQUtBLHVCQUFMLENBQTZCUCxVQUE3QixDQUF3QyxLQUFLVixTQUE3QztBQUNsQyxZQUFJLEtBQUtlLG9CQUFULEVBQStCLEtBQUtBLG9CQUFMLENBQTBCTCxVQUExQixDQUFxQyxLQUFLVixTQUExQztBQUMvQixZQUFJLEtBQUtnQiw0QkFBVCxFQUF1QyxLQUFLQSw0QkFBTCxDQUFrQ04sVUFBbEMsQ0FBNkMsS0FBS1YsU0FBbEQ7QUFDdkMsWUFBSSxLQUFLYyx1QkFBVCxFQUFrQyxLQUFLQSx1QkFBTCxDQUE2QkosVUFBN0IsQ0FBd0MsS0FBS1YsU0FBN0M7QUFDbEMsWUFBSSxLQUFLa0IsdUJBQVQsRUFBa0MsS0FBS0EsdUJBQUwsQ0FBNkJSLFVBQTdCLENBQXdDLEtBQUtWLFNBQTdDO0FBQ3JDLE8sQ0FFRDtBQUNBO0FBRUE7O0FBRUE7Ozs7Ozs2QkFHZTtBQUNYLFlBQUksS0FBS3NCLFNBQVQsRUFBb0I7QUFDaEIsZUFBS0EsU0FBTCxHQUFpQixLQUFqQjtBQUNIOztBQUNELFlBQUksS0FBS0MsVUFBVCxFQUFxQjtBQUNqQixlQUFLQSxVQUFMLEdBQWtCLEtBQWxCO0FBQ0g7O0FBRUQsYUFBS0YsVUFBTCxHQUFrQixJQUFsQjtBQUNBLGFBQUtHLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUEsYUFBS2tCLGNBQUwsR0FYVyxDQWFYOzs7QUFDQSxZQUFJLEtBQUt2QyxRQUFULEVBQW1CO0FBQ2YsZUFBS3FELGNBQUw7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs4QkFHZ0I7QUFDWixZQUFJLEtBQUtqQyxVQUFULEVBQXFCO0FBQ2pCa0MsVUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsOENBQWI7QUFDQTtBQUNIOztBQUNELFlBQUksS0FBS3JDLFVBQVQsRUFBcUI7QUFDakIsZUFBS0EsVUFBTCxHQUFrQixLQUFsQjtBQUNIOztBQUVELGFBQUtDLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUVEOzs7Ozs7NkJBR2U7QUFDWCxZQUFJLEtBQUtELFVBQUwsSUFBbUIsS0FBS0MsU0FBNUIsRUFBdUM7QUFDbkMsZUFBS3FDLEtBQUw7QUFDSDs7QUFDRCxZQUFJLEtBQUt0QyxVQUFULEVBQXFCO0FBQ2pCLGVBQUtBLFVBQUwsR0FBa0IsS0FBbEI7QUFDSDs7QUFDRCxZQUFJLEtBQUtDLFNBQVQsRUFBb0I7QUFDaEIsZUFBS0EsU0FBTCxHQUFpQixLQUFqQjtBQUNIOztBQUVELGFBQUtHLEtBQUwsR0FBYSxHQUFiO0FBQ0EsYUFBS0Msb0JBQUwsR0FBNEIsR0FBNUI7QUFDQSxhQUFLQyx3QkFBTCxHQUFnQyxHQUFoQztBQUVBLGFBQUtKLFVBQUwsR0FBa0IsSUFBbEI7QUFDSCxPLENBRUQ7O0FBQ0E7Ozs7Ozs4QkFHZ0I7QUFDWixZQUFJLEtBQUtxQyxrQkFBVCxFQUE2QjtBQUN6QixlQUFLNUQsU0FBTCxDQUFnQjJELEtBQWhCO0FBQ0EsY0FBSSxLQUFLeEMsWUFBVCxFQUF1QixLQUFLQSxZQUFMLENBQWtCd0MsS0FBbEI7QUFDMUI7QUFDSjtBQUVEOzs7Ozs7eUNBRzJCO0FBQ3ZCLGVBQU8sS0FBSzNELFNBQUwsQ0FBZ0I2RCxnQkFBaEIsRUFBUDtBQUNIO0FBRUQ7Ozs7OztxQ0FHdUJDLEMsRUFBR0MsQyxFQUFHO0FBQ3pCeEIscUJBQUt5QixHQUFMLENBQVMsS0FBS2xDLFlBQWQsRUFBNEJnQyxDQUE1QixFQUErQkMsQ0FBL0I7QUFDSDs7O3FDQUVzQkQsQyxFQUFHQyxDLEVBQUc7QUFDekJ4QixxQkFBS3lCLEdBQUwsQ0FBUyxLQUFLakMsWUFBZCxFQUE0QitCLENBQTVCLEVBQStCQyxDQUEvQjtBQUNIOzs7a0NBRXNCO0FBQ25CO0FBQ0EsYUFBSy9ELFNBQUwsQ0FBZ0JpRSxTQUFoQjtBQUNBLFlBQUksS0FBSzlDLFlBQVQsRUFBdUIsS0FBS0EsWUFBTCxDQUFrQitDLE9BQWxCO0FBQzFCOzs7aUNBRXFCO0FBQ2xCLFlBQUksS0FBS0MsV0FBVCxFQUFzQjtBQUNsQixlQUFLQyxJQUFMO0FBQ0g7O0FBQ0QsYUFBS3BFLFNBQUwsQ0FBZ0JvQixRQUFoQjtBQUNBLFlBQUksS0FBS0QsWUFBVCxFQUF1QixLQUFLQSxZQUFMLENBQWtCQyxRQUFsQjtBQUMxQjs7O2tDQUNzQjtBQUNuQixhQUFLcEIsU0FBTCxDQUFnQnFFLFNBQWhCO0FBQ0EsWUFBSSxLQUFLbEQsWUFBVCxFQUF1QixLQUFLQSxZQUFMLENBQWtCa0QsU0FBbEI7QUFDMUI7Ozs2QkFDaUJDLEUsRUFBWTtBQUMxQixZQUFNQyxlQUFlLEdBQUdELEVBQUUsR0FBRyxLQUFLRSxlQUFsQzs7QUFDQSxZQUFJLEtBQUtuRCxVQUFULEVBQXFCO0FBQ2pCLGVBQUtJLEtBQUwsSUFBYzhDLGVBQWQsQ0FEaUIsQ0FHakI7O0FBQ0EsZUFBS0UsS0FBTCxDQUFXRixlQUFYLEVBSmlCLENBTWpCOzs7QUFDQSxjQUFJLEtBQUt2RSxTQUFMLENBQWdCMEUsZUFBaEIsQ0FBZ0NILGVBQWhDLE1BQXFELENBQXJELElBQTBELENBQUMsS0FBSy9DLFdBQXBFLEVBQWlGO0FBQzdFLGlCQUFLbUQsSUFBTDtBQUNILFdBVGdCLENBV2pCOzs7QUFDQSxlQUFLM0UsU0FBTCxDQUFnQjRFLGdCQUFoQixHQVppQixDQWNqQjs7QUFDQSxjQUFJLEtBQUt6RCxZQUFMLElBQXFCLEtBQUtBLFlBQUwsQ0FBa0IrQixNQUEzQyxFQUFtRDtBQUMvQyxpQkFBSy9CLFlBQUwsQ0FBa0J5RCxnQkFBbEI7QUFDSDtBQUNKO0FBQ0o7OzswQ0FFOEIvRSxHLEVBQUs7QUFDaEM7QUFDQSxZQUFJLEtBQUtHLFNBQUwsQ0FBZUMsTUFBbkIsRUFBMkI7QUFDdkI7QUFDQSxlQUFLRCxTQUFMLENBQWVDLE1BQWYsQ0FBc0I0RSxRQUF0QixHQUFpQ2hGLEdBQWpDO0FBQ0g7QUFDSjs7OzJCQUVhaUYsSyxFQUFPUixFLEVBQUk7QUFDckIsWUFBTVMsS0FBSyxHQUFHLEtBQUt0RCxLQUFMLEdBQWEsS0FBS3VELFFBQWhDOztBQUVBLFlBQUksS0FBSzNFLGdCQUFMLEtBQTBCeEIsWUFBTW9HLEtBQXBDLEVBQTJDO0FBQ3ZDLGVBQUtDLElBQUwsQ0FBVUMsY0FBVixDQUF5QjVHLFVBQXpCO0FBQ0EsZUFBSzJHLElBQUwsQ0FBVUUsZ0JBQVYsQ0FBMkIzRyxVQUEzQjtBQUNIOztBQUVELGFBQUssSUFBSTRHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdQLEtBQXBCLEVBQTJCLEVBQUVPLENBQTdCLEVBQWdDO0FBQzVCLGNBQU1DLFFBQVEsR0FBRyxLQUFLdEYsU0FBTCxDQUFnQnVGLGVBQWhCLEVBQWpCOztBQUNBLGNBQUlELFFBQVEsS0FBSyxJQUFqQixFQUF1QjtBQUNuQjtBQUNIOztBQUNELGNBQU1FLElBQUksR0FBRywwQkFBYSw0QkFBZSxDQUFmLEVBQWtCQyxhQUFsQixDQUFiLENBQWI7O0FBRUEsY0FBSSxLQUFLOUUsWUFBTCxJQUFxQixLQUFLQSxZQUFMLENBQWtCdUMsTUFBM0MsRUFBbUQ7QUFDL0MsaUJBQUt2QyxZQUFMLENBQWtCK0UsSUFBbEIsQ0FBdUJKLFFBQXZCO0FBQ0gsV0FGRCxNQUVPO0FBQ0hoRCx5QkFBSzBCLEdBQUwsQ0FBU3NCLFFBQVEsQ0FBQ0ssUUFBbEIsRUFBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsQ0FBbEM7O0FBQ0FyRCx5QkFBS3NELElBQUwsQ0FBVU4sUUFBUSxDQUFDTyxRQUFuQixFQUE2QkMsMENBQTdCO0FBQ0g7O0FBRUQsY0FBSSxLQUFLNUUsdUJBQUwsSUFBZ0MsS0FBS0EsdUJBQUwsQ0FBNkJnQyxNQUFqRSxFQUF5RTtBQUNyRSxpQkFBS2hDLHVCQUFMLENBQTZCNkUsSUFBN0IsQ0FBa0NULFFBQWxDO0FBQ0g7O0FBRURoRCx1QkFBSzBELGNBQUwsQ0FBb0JWLFFBQVEsQ0FBQ08sUUFBN0IsRUFBdUNQLFFBQVEsQ0FBQ08sUUFBaEQsRUFBMEQsS0FBS3hELFVBQUwsQ0FBZ0I0RCxRQUFoQixDQUF5QmxCLEtBQXpCLEVBQWdDUyxJQUFoQyxDQUExRDs7QUFFQSxjQUFJLEtBQUtuRixnQkFBTCxLQUEwQnhCLFlBQU1vRyxLQUFwQyxFQUEyQztBQUN2QzNDLHlCQUFLNEQsYUFBTCxDQUFtQlosUUFBUSxDQUFDSyxRQUE1QixFQUFzQ0wsUUFBUSxDQUFDSyxRQUEvQyxFQUF5RHBILFVBQXpEOztBQUNBK0QseUJBQUs2RCxhQUFMLENBQW1CYixRQUFRLENBQUNPLFFBQTVCLEVBQXNDUCxRQUFRLENBQUNPLFFBQS9DLEVBQXlEcEgsVUFBekQ7QUFDSDs7QUFFRDZELHVCQUFLc0QsSUFBTCxDQUFVTixRQUFRLENBQUNjLGdCQUFuQixFQUFxQ2QsUUFBUSxDQUFDTyxRQUE5QyxFQXpCNEIsQ0EwQjVCOzs7QUFDQSxjQUFJLEtBQUtRLGVBQVQsRUFBMEI7QUFDdEIvRCx5QkFBSzBCLEdBQUwsQ0FBU3NCLFFBQVEsQ0FBQ2dCLFFBQWxCLEVBQTRCLEtBQUtDLGNBQUwsQ0FBb0JOLFFBQXBCLENBQTZCbEIsS0FBN0IsRUFBb0NTLElBQXBDLENBQTVCLEVBQ0ksS0FBS2dCLGNBQUwsQ0FBb0JQLFFBQXBCLENBQTZCbEIsS0FBN0IsRUFBb0NTLElBQXBDLENBREosRUFFSSxLQUFLaUIsY0FBTCxDQUFvQlIsUUFBcEIsQ0FBNkJsQixLQUE3QixFQUFvQ1MsSUFBcEMsQ0FGSjtBQUdILFdBSkQsTUFJTztBQUNIbEQseUJBQUswQixHQUFMLENBQVNzQixRQUFRLENBQUNnQixRQUFsQixFQUE0QixDQUE1QixFQUErQixDQUEvQixFQUFrQyxLQUFLRyxjQUFMLENBQW9CUixRQUFwQixDQUE2QmxCLEtBQTdCLEVBQW9DUyxJQUFwQyxDQUFsQztBQUNILFdBakMyQixDQW1DNUI7OztBQUNBLGNBQUksS0FBS2tCLFdBQVQsRUFBc0I7QUFDbEJwRSx5QkFBSzBCLEdBQUwsQ0FBU3NCLFFBQVEsQ0FBQ3FCLFNBQWxCLEVBQTZCLEtBQUt2RSxVQUFMLENBQWdCNkQsUUFBaEIsQ0FBeUJsQixLQUF6QixFQUFnQ1MsSUFBaEMsQ0FBN0IsRUFDSSxLQUFLb0IsVUFBTCxDQUFnQlgsUUFBaEIsQ0FBeUJsQixLQUF6QixFQUFnQ1MsSUFBaEMsQ0FESixFQUVJLEtBQUtxQixVQUFMLENBQWdCWixRQUFoQixDQUF5QmxCLEtBQXpCLEVBQWdDUyxJQUFoQyxDQUZKO0FBR0gsV0FKRCxNQUlPO0FBQ0hsRCx5QkFBSzBCLEdBQUwsQ0FBU3NCLFFBQVEsQ0FBQ3FCLFNBQWxCLEVBQTZCLEtBQUt2RSxVQUFMLENBQWdCNkQsUUFBaEIsQ0FBeUJsQixLQUF6QixFQUFnQ1MsSUFBaEMsQ0FBN0IsRUFBcUUsQ0FBckUsRUFBd0UsQ0FBeEU7O0FBQ0FGLFlBQUFBLFFBQVEsQ0FBQ3FCLFNBQVQsQ0FBbUI1QyxDQUFuQixHQUF1QnVCLFFBQVEsQ0FBQ3FCLFNBQVQsQ0FBbUI3QyxDQUExQztBQUNIOztBQUNEeEIsdUJBQUtzRCxJQUFMLENBQVVOLFFBQVEsQ0FBQ3dCLElBQW5CLEVBQXlCeEIsUUFBUSxDQUFDcUIsU0FBbEMsRUE1QzRCLENBOEM1Qjs7O0FBQ0FyQixVQUFBQSxRQUFRLENBQUN5QixVQUFULENBQW9CL0MsR0FBcEIsQ0FBd0IsS0FBSytDLFVBQUwsQ0FBZ0JkLFFBQWhCLENBQXlCbEIsS0FBekIsRUFBZ0NTLElBQWhDLENBQXhCO0FBQ0FGLFVBQUFBLFFBQVEsQ0FBQzBCLEtBQVQsQ0FBZWhELEdBQWYsQ0FBbUJzQixRQUFRLENBQUN5QixVQUE1QixFQWhENEIsQ0FrRDVCOztBQUNBekIsVUFBQUEsUUFBUSxDQUFDbkQsYUFBVCxHQUF5QixLQUFLQSxhQUFMLENBQW1COEQsUUFBbkIsQ0FBNEJsQixLQUE1QixFQUFtQ1MsSUFBbkMsSUFBNENsQixFQUFyRTtBQUNBZ0IsVUFBQUEsUUFBUSxDQUFDMkIsaUJBQVQsR0FBNkIzQixRQUFRLENBQUNuRCxhQUF0QztBQUVBbUQsVUFBQUEsUUFBUSxDQUFDNEIsVUFBVCxHQUFzQiw0QkFBZSxDQUFmLEVBQWtCLE1BQWxCLENBQXRCO0FBRUEsZUFBS2xILFNBQUwsQ0FBZ0JtSCxjQUFoQixDQUErQjdCLFFBQS9CO0FBRUgsU0FsRW9CLENBa0VuQjs7QUFDTCxPLENBRUQ7Ozs7dUNBQzBCO0FBQ3RCLGFBQUs4QixVQUFMLENBQWdCQyxJQUFoQixHQUF1QkMsaUJBQUtDLFFBQTVCLENBRHNCLENBQ2dCOztBQUN0QyxhQUFLSCxVQUFMLENBQWdCbEYsUUFBaEIsR0FBMkIsQ0FBM0I7QUFDQSxZQUFNb0MsRUFBRSxHQUFHLEdBQVgsQ0FIc0IsQ0FHTjs7QUFDaEIsWUFBTWtELEdBQUcsR0FBRyxLQUFLeEMsUUFBTCxHQUFnQlYsRUFBNUI7O0FBQ0EsYUFBSyxJQUFJZSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHbUMsR0FBcEIsRUFBeUIsRUFBRW5DLENBQTNCLEVBQThCO0FBQzFCLGVBQUs1RCxLQUFMLElBQWM2QyxFQUFkOztBQUNBLGVBQUtHLEtBQUwsQ0FBV0gsRUFBWDs7QUFDQSxlQUFLdEUsU0FBTCxDQUFnQjBFLGVBQWhCLENBQWdDSixFQUFoQztBQUNIO0FBQ0osTyxDQUVEOzs7OzRCQUNlQSxFLEVBQUk7QUFDZjtBQUNBLFlBQU04QyxVQUFVLEdBQUcsS0FBS0EsVUFBTCxDQUFnQm5CLFFBQWhCLENBQXlCLENBQXpCLEVBQTRCLENBQTVCLENBQW5COztBQUNBLFlBQUksS0FBS3hFLEtBQUwsR0FBYTJGLFVBQWpCLEVBQTZCO0FBQ3pCLGNBQUksS0FBSzNGLEtBQUwsR0FBYyxLQUFLdUQsUUFBTCxHQUFnQm9DLFVBQWxDLEVBQStDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBLGdCQUFJLENBQUMsS0FBS2hILElBQVYsRUFBZ0I7QUFDWixtQkFBS29CLFdBQUwsR0FBbUIsS0FBbkI7QUFDQTtBQUNIO0FBQ0osV0FUd0IsQ0FXekI7OztBQUNBLGVBQUtFLG9CQUFMLElBQTZCLEtBQUtPLFlBQUwsQ0FBa0JnRSxRQUFsQixDQUEyQixLQUFLeEUsS0FBTCxHQUFhLEtBQUt1RCxRQUE3QyxFQUF1RCxDQUF2RCxJQUE2RFYsRUFBMUY7O0FBQ0EsY0FBSSxLQUFLNUMsb0JBQUwsR0FBNEIsQ0FBNUIsSUFBaUMsS0FBS0YsV0FBMUMsRUFBdUQ7QUFDbkQsZ0JBQU1pRyxPQUFPLEdBQUczSCxJQUFJLENBQUNDLEtBQUwsQ0FBVyxLQUFLMkIsb0JBQWhCLENBQWhCO0FBQ0EsaUJBQUtBLG9CQUFMLElBQTZCK0YsT0FBN0I7QUFDQSxpQkFBSy9CLElBQUwsQ0FBVStCLE9BQVYsRUFBbUJuRCxFQUFuQjtBQUNILFdBakJ3QixDQWtCekI7OztBQUNBLGVBQUtZLElBQUwsQ0FBVXdDLGdCQUFWLENBQTJCLEtBQUs3RixRQUFoQzs7QUFDQSxjQUFNOEYsUUFBUSxHQUFHckYsYUFBS3FGLFFBQUwsQ0FBYyxLQUFLOUYsUUFBbkIsRUFBNkIsS0FBS0QsUUFBbEMsQ0FBakI7O0FBQ0FVLHVCQUFLc0QsSUFBTCxDQUFVLEtBQUtoRSxRQUFmLEVBQXlCLEtBQUtDLFFBQTlCOztBQUNBLGVBQUtGLHdCQUFMLElBQWlDZ0csUUFBUSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCM0IsUUFBdEIsQ0FBK0IsS0FBS3hFLEtBQUwsR0FBYSxLQUFLdUQsUUFBakQsRUFBMkQsQ0FBM0QsQ0FBNUM7O0FBQ0EsY0FBSSxLQUFLckQsd0JBQUwsR0FBZ0MsQ0FBaEMsSUFBcUMsS0FBS0gsV0FBOUMsRUFBMkQ7QUFDdkQsZ0JBQU1pRyxRQUFPLEdBQUczSCxJQUFJLENBQUNDLEtBQUwsQ0FBVyxLQUFLNEIsd0JBQWhCLENBQWhCOztBQUNBLGlCQUFLQSx3QkFBTCxJQUFpQzhGLFFBQWpDO0FBQ0EsaUJBQUsvQixJQUFMLENBQVUrQixRQUFWLEVBQW1CbkQsRUFBbkI7QUFDSCxXQTNCd0IsQ0E2QnpCOzs7QUE3QnlCLHFEQThCTCxLQUFLdUQsTUE5QkE7QUFBQTs7QUFBQTtBQThCekIsZ0VBQWlDO0FBQUEsa0JBQXRCQyxLQUFzQjtBQUM3QkEsY0FBQUEsS0FBSyxDQUFDQyxNQUFOLENBQWEsSUFBYixFQUFtQnpELEVBQW5CO0FBQ0g7QUFoQ3dCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFpQzVCO0FBQ0o7Ozt1Q0FFeUI7QUFDdEIsYUFBS1ksSUFBTCxDQUFVd0MsZ0JBQVYsQ0FBMkIsS0FBSzlGLFFBQWhDOztBQUNBVSxxQkFBS3NELElBQUwsQ0FBVSxLQUFLL0QsUUFBZixFQUF5QixLQUFLRCxRQUE5QjtBQUNIOzs7b0NBRXNCb0csVSxFQUFZO0FBQy9CLGFBQUtoRyxZQUFMLENBQWtCaUIsSUFBbEIsQ0FBdUIrRSxVQUF2QjtBQUNIOzs7dUNBRXlCQyxHLEVBQUs7QUFDM0IsYUFBS2pHLFlBQUwsQ0FBa0JrRyxNQUFsQixDQUF5QixLQUFLbEcsWUFBTCxDQUFrQm1HLE9BQWxCLENBQTBCRixHQUExQixDQUF6QixFQUF5RCxDQUF6RDtBQUNIOzs7K0JBRWlCSCxLLEVBQU87QUFDckIsYUFBS0QsTUFBTCxDQUFZNUUsSUFBWixDQUFpQjZFLEtBQWpCO0FBQ0g7OztrQ0FFb0JHLEcsRUFBSztBQUN0QixhQUFLSixNQUFMLENBQVlLLE1BQVosQ0FBbUIsS0FBS0wsTUFBTCxDQUFZTSxPQUFaLENBQW9CRixHQUFwQixDQUFuQixFQUE2QyxDQUE3QztBQUNIO0FBRUQ7Ozs7Ozt5Q0F1QjJCRyxLLEVBQU87QUFBQTs7QUFDOUIsZUFBTyxLQUFLQyxhQUFMLEdBQXFCRCxLQUFLLENBQUNFLE1BQU4sQ0FBYSxVQUFBQyxDQUFDO0FBQUEsaUJBQUksQ0FBQ0MsbUNBQXlCQyxRQUF6QixDQUFrQ0YsQ0FBbEMsQ0FBRCxJQUEwQyxNQUFJLENBQUNBLENBQUQsQ0FBSixJQUFXLE1BQUksQ0FBQ0EsQ0FBRCxDQUFKLENBQVFyRixNQUFqRTtBQUFBLFNBQWQsQ0FBckIsR0FBK0drRixLQUF0SDtBQUNIOzs7MEJBdEJnQjtBQUNiLGVBQU8sS0FBSy9HLFVBQVo7QUFDSDs7OzBCQUVlO0FBQ1osZUFBTyxLQUFLQyxTQUFaO0FBQ0g7OzswQkFFZ0I7QUFDYixlQUFPLEtBQUtDLFVBQVo7QUFDSDs7OzBCQUVpQjtBQUNkLGVBQU8sS0FBS0MsV0FBWjtBQUNIOzs7MEJBRVc7QUFDUixlQUFPLEtBQUtDLEtBQVo7QUFDSDs7OztJQW40QitCaUgsd0MsMFBBd0IvQkMsbUI7Ozs7O2FBR21CLElBQUkvSixzQkFBSixFOzt5RkFHbkIrSixtQjs7Ozs7YUFHbUI5SixZQUFNK0osSzs7a0ZBRXpCRCxtQjs7Ozs7YUFHb0IsSzs7Ozs7OzthQVNELElBQUk3SixtQkFBSixFOzt5RkFNbkI2SixtQjs7Ozs7YUFHbUIsSUFBSTdKLG1CQUFKLEU7O3lGQU1uQjZKLG1COzs7OzthQUdtQixJQUFJN0osbUJBQUosRTs7eUZBTW5CNkosbUI7Ozs7O2FBSW1CLElBQUk3SixtQkFBSixFOztzRkFFbkI2SixtQjs7Ozs7YUFHd0IsSzs7NkZBTXhCQSxtQixVQUVBRSxhOzs7OzthQUd1QixJQUFJL0osbUJBQUosRTs7OEZBTXZCNkosbUIsVUFFQUUsYTs7Ozs7YUFHdUIsSUFBSS9KLG1CQUFKLEU7OzhHQVF2QitKLGE7Ozs7O2FBR3VCLElBQUkvSixtQkFBSixFOzswRkFNdkI2SixtQjs7Ozs7YUFHbUIsSUFBSTdKLG1CQUFKLEU7OzZGQU1uQjZKLG1COzs7OzthQUdzQixJQUFJN0osbUJBQUosRTs7Z0ZBS3RCNkosbUI7Ozs7O2FBR2lCLEc7OzRFQUtqQkEsbUI7Ozs7O2FBR2EsSTs7NE9Bc0JiQSxtQiwrTEFvQkFBLG1COzs7OzthQUd3QixHOzttRkFLeEJBLG1COzs7OzthQUdvQixJOzsrRkFNcEJBLG1COzs7OzthQUl3QixJQUFJN0osbUJBQUosRTs7NEZBT3hCNkosbUI7Ozs7O2FBR3FCLElBQUk3SixtQkFBSixFOztnR0FNckI2SixtQjs7Ozs7YUFHeUIsSUFBSTdKLG1CQUFKLEU7O3NGQU16QjZKLG1COzs7OzthQUd3QixFOzt1RUFFeEJHLGUsVUFFQUgsbUI7Ozs7O2FBZ0J5RCxJOzs7Ozs7O2FBd0J4QixJOzs7Ozs7O2FBd0JjLEk7Ozs7Ozs7YUF3QlEsSTs7Ozs7OzthQXdCTixJOzs7Ozs7O2FBd0JnQixJOzs7Ozs7O2FBeUJWLEk7Ozs7Ozs7YUF3QkEsSTs7Ozs7OzthQXdCdEIsSTs7eVFBeUJqQ0EsbUI7Ozs7O2FBR3lDLElBQUlqSixtQ0FBSixFOztxRkFHekNpSixtQjs7Ozs7YUFHK0IsSzs7Z0ZBcUIvQkEsbUI7Ozs7O2FBQ2tCLEs7O2lGQUVsQkEsbUI7Ozs7O2FBQ21CLEc7O3dGQUVuQkEsbUI7Ozs7O2FBQzBCOUosWUFBTStKLEsiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGFydGljbGVcclxuICovXHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXHJcblxyXG5pbXBvcnQgeyBSZW5kZXJhYmxlQ29tcG9uZW50IH0gZnJvbSAnLi4vY29yZS8zZC9mcmFtZXdvcmsvcmVuZGVyYWJsZS1jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbCB9IGZyb20gJy4uL2NvcmUvYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCB0b29sdGlwLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHJhbmdlLCBkaXNwbGF5TmFtZSwgdmlzaWJsZSwgZm9ybWVybHlTZXJpYWxpemVkQXMsIG92ZXJyaWRlLCByYWRpYW4sIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IE1hdDQsIHBzZXVkb1JhbmRvbSwgUXVhdCwgcmFuZG9tUmFuZ2VJbnQsIFZlYzIsIFZlYzMgfSBmcm9tICcuLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBJTlRfTUFYIH0gZnJvbSAnLi4vY29yZS9tYXRoL2JpdHMnO1xyXG5pbXBvcnQgeyBzY2VuZSB9IGZyb20gJy4uL2NvcmUvcmVuZGVyZXInO1xyXG5pbXBvcnQgQ29sb3JPdmVyTGlmZXRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9jb2xvci1vdmVydGltZSc7XHJcbmltcG9ydCBDdXJ2ZVJhbmdlLCB7IE1vZGUgfSBmcm9tICcuL2FuaW1hdG9yL2N1cnZlLXJhbmdlJztcclxuaW1wb3J0IEZvcmNlT3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci9mb3JjZS1vdmVydGltZSc7XHJcbmltcG9ydCBHcmFkaWVudFJhbmdlIGZyb20gJy4vYW5pbWF0b3IvZ3JhZGllbnQtcmFuZ2UnO1xyXG5pbXBvcnQgTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlIGZyb20gJy4vYW5pbWF0b3IvbGltaXQtdmVsb2NpdHktb3ZlcnRpbWUnO1xyXG5pbXBvcnQgUm90YXRpb25PdmVydGltZU1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL3JvdGF0aW9uLW92ZXJ0aW1lJztcclxuaW1wb3J0IFNpemVPdmVydGltZU1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL3NpemUtb3ZlcnRpbWUnO1xyXG5pbXBvcnQgVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSBmcm9tICcuL2FuaW1hdG9yL3RleHR1cmUtYW5pbWF0aW9uJztcclxuaW1wb3J0IFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgZnJvbSAnLi9hbmltYXRvci92ZWxvY2l0eS1vdmVydGltZSc7XHJcbmltcG9ydCBCdXJzdCBmcm9tICcuL2J1cnN0JztcclxuaW1wb3J0IFNoYXBlTW9kdWxlIGZyb20gJy4vZW1pdHRlci9zaGFwZS1tb2R1bGUnO1xyXG5pbXBvcnQgeyBTcGFjZSB9IGZyb20gJy4vZW51bSc7XHJcbmltcG9ydCB7IHBhcnRpY2xlRW1pdFpBeGlzIH0gZnJvbSAnLi9wYXJ0aWNsZS1nZW5lcmFsLWZ1bmN0aW9uJztcclxuaW1wb3J0IFBhcnRpY2xlU3lzdGVtUmVuZGVyZXIgZnJvbSAnLi9yZW5kZXJlci9wYXJ0aWNsZS1zeXN0ZW0tcmVuZGVyZXItZGF0YSc7XHJcbmltcG9ydCBUcmFpbE1vZHVsZSBmcm9tICcuL3JlbmRlcmVyL3RyYWlsJztcclxuaW1wb3J0IHsgSVBhcnRpY2xlU3lzdGVtUmVuZGVyZXIgfSBmcm9tICcuL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1iYXNlJztcclxuaW1wb3J0IHsgUEFSVElDTEVfTU9EVUxFX1BST1BFUlRZIH0gZnJvbSAnLi9wYXJ0aWNsZSc7XHJcbmltcG9ydCB7IEVESVRPUiB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcblxyXG5jb25zdCBfd29ybGRfbWF0ID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX3dvcmxkX3JvbCA9IG5ldyBRdWF0KCk7XHJcblxyXG5AY2NjbGFzcygnY2MuUGFydGljbGVTeXN0ZW0nKVxyXG5AaGVscCgnaTE4bjpjYy5QYXJ0aWNsZVN5c3RlbScpXHJcbkBtZW51KCdDb21wb25lbnRzL1BhcnRpY2xlU3lzdGVtJylcclxuQGV4ZWN1dGlvbk9yZGVyKDk5KVxyXG5AZXhlY3V0ZUluRWRpdE1vZGVcclxuZXhwb3J0IGNsYXNzIFBhcnRpY2xlU3lzdGVtIGV4dGVuZHMgUmVuZGVyYWJsZUNvbXBvbmVudCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q57O757uf6IO955Sf5oiQ55qE5pyA5aSn57KS5a2Q5pWw6YeP44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCfnspLlrZDns7vnu5/og73nlJ/miJDnmoTmnIDlpKfnspLlrZDmlbDph48nKVxyXG4gICAgcHVibGljIGdldCBjYXBhY2l0eSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhcGFjaXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgY2FwYWNpdHkgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2NhcGFjaXR5ID0gTWF0aC5mbG9vcih2YWwpO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBpZiAodGhpcy5wcm9jZXNzb3IgJiYgdGhpcy5wcm9jZXNzb3IuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzb3IuX21vZGVsLnNldENhcGFjaXR5KHRoaXMuX2NhcGFjaXR5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5Yid5aeL6aKc6Imy44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEdyYWRpZW50UmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDgpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL6aKc6ImyJylcclxuICAgIHB1YmxpYyBzdGFydENvbG9yID0gbmV3IEdyYWRpZW50UmFuZ2UoKTtcclxuXHJcbiAgICBAdHlwZShTcGFjZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoOSlcclxuICAgIEB0b29sdGlwKCfpgInmi6nnvKnmlL7lnZDmoIfns7snKVxyXG4gICAgcHVibGljIHNjYWxlU3BhY2UgPSBTcGFjZS5Mb2NhbDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDEwKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOWIneWni+Wkp+WwjycpXHJcbiAgICBwdWJsaWMgc3RhcnRTaXplM0QgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQGZvcm1lcmx5U2VyaWFsaXplZEFzKCdzdGFydFNpemUnKVxyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMTApXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL5aSn5bCPJylcclxuICAgIHB1YmxpYyBzdGFydFNpemVYID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTApXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL5aSn5bCPJylcclxuICAgIHB1YmxpYyBzdGFydFNpemVZID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTApXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL5aSn5bCPJylcclxuICAgIHB1YmxpYyBzdGFydFNpemVaID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vpgJ/luqbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQGRpc3BsYXlPcmRlcigxMSlcclxuICAgIEB0b29sdGlwKCfnspLlrZDliJ3lp4vpgJ/luqYnKVxyXG4gICAgcHVibGljIHN0YXJ0U3BlZWQgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTIpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL5peL6L2s6KeS5bqmJylcclxuICAgIHB1YmxpYyBzdGFydFJvdGF0aW9uM0QgPSBmYWxzZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vml4vovazop5LluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQHJhZGlhblxyXG4gICAgQGRpc3BsYXlPcmRlcigxMilcclxuICAgIEB0b29sdGlwKCfnspLlrZDliJ3lp4vml4vovazop5LluqYnKVxyXG4gICAgcHVibGljIHN0YXJ0Um90YXRpb25YID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vml4vovazop5LluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEByYW5nZShbLTEsIDFdKVxyXG4gICAgQHJhZGlhblxyXG4gICAgQGRpc3BsYXlPcmRlcigxMilcclxuICAgIEB0b29sdGlwKCfnspLlrZDliJ3lp4vml4vovazop5LluqYnKVxyXG4gICAgcHVibGljIHN0YXJ0Um90YXRpb25ZID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliJ3lp4vml4vovazop5LluqbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBmb3JtZXJseVNlcmlhbGl6ZWRBcygnc3RhcnRSb3RhdGlvbicpXHJcbiAgICBAcmFuZ2UoWy0xLCAxXSlcclxuICAgIEByYWRpYW5cclxuICAgIEBkaXNwbGF5T3JkZXIoMTIpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Yid5aeL5peL6L2s6KeS5bqmJylcclxuICAgIHB1YmxpYyBzdGFydFJvdGF0aW9uWiA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q57O757uf5byA5aeL6L+Q6KGM5ZCO77yM5bu26L+f57KS5a2Q5Y+R5bCE55qE5pe26Ze044CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDYpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q57O757uf5byA5aeL6L+Q6KGM5ZCO77yM5bu26L+f57KS5a2Q5Y+R5bCE55qE5pe26Ze0JylcclxuICAgIHB1YmxpYyBzdGFydERlbGF5ID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDnlJ/lkb3lkajmnJ/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCfnspLlrZDnlJ/lkb3lkajmnJ8nKVxyXG4gICAgcHVibGljIHN0YXJ0TGlmZXRpbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOezu+e7n+i/kOihjOaXtumXtOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q57O757uf6L+Q6KGM5pe26Ze0JylcclxuICAgIHB1YmxpYyBkdXJhdGlvbiA9IDUuMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDns7vnu5/mmK/lkKblvqrnjq/mkq3mlL7jgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOezu+e7n+aYr+WQpuW+queOr+aSreaUvicpXHJcbiAgICBwdWJsaWMgbG9vcCA9IHRydWU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCJ5Lit5LmL5ZCO77yM57KS5a2Q57O757uf5Lya5Lul5bey5pKt5pS+5a6M5LiA6L2u5LmL5ZCO55qE54q25oCB5byA5aeL5pKt5pS+77yI5LuF5b2T5b6q546v5pKt5pS+5ZCv55So5pe25pyJ5pWI77yJ44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCfpgInkuK3kuYvlkI7vvIznspLlrZDns7vnu5/kvJrku6Xlt7Lmkq3mlL7lrozkuIDova7kuYvlkI7nmoTnirbmgIHlvIDlp4vmkq3mlL7vvIjku4XlvZPlvqrnjq/mkq3mlL7lkK/nlKjml7bmnInmlYjvvIknKVxyXG4gICAgZ2V0IHByZXdhcm0gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcmV3YXJtO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBwcmV3YXJtICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsID09PSB0cnVlICYmIHRoaXMubG9vcCA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS53YXJuKCdwcmV3YXJtIG9ubHkgd29ya3MgaWYgbG9vcCBpcyBhbHNvIGVuYWJsZWQuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3ByZXdhcm0gPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6YCJ5oup57KS5a2Q57O757uf5omA5Zyo55qE5Z2Q5qCH57O7W1tTcGFjZV1d44CCPGJyPlxyXG4gICAgICovXHJcbiAgICBAdHlwZShTcGFjZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNClcclxuICAgIEB0b29sdGlwKCfmjqfliLbnspLlrZDlnZDmoIforqHnrpfmiYDlnKjnmoTlnZDmoIfns7snKVxyXG4gICAgZ2V0IHNpbXVsYXRpb25TcGFjZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NpbXVsYXRpb25TcGFjZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2ltdWxhdGlvblNwYWNlICh2YWwpIHtcclxuICAgICAgICBpZiAodmFsICE9PSB0aGlzLl9zaW11bGF0aW9uU3BhY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2ltdWxhdGlvblNwYWNlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wcm9jZXNzb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucHJvY2Vzc29yLnVwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3Nvci51cGRhdGVUcmFpbE1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5o6n5Yi25pW05Liq57KS5a2Q57O757uf55qE5pu05paw6YCf5bqm44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNSlcclxuICAgIEB0b29sdGlwKCfmjqfliLbmlbTkuKrnspLlrZDns7vnu5/nmoTmm7TmlrDpgJ/luqYnKVxyXG4gICAgcHVibGljIHNpbXVsYXRpb25TcGVlZCA9IDEuMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDns7vnu5/liqDovb3lkI7mmK/lkKboh6rliqjlvIDlp4vmkq3mlL7jgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOezu+e7n+WKoOi9veWQjuaYr+WQpuiHquWKqOW8gOWni+aSreaUvicpXHJcbiAgICBwdWJsaWMgcGxheU9uQXdha2UgPSB0cnVlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOWPl+mHjeWKm+W9seWTjeeahOmHjeWKm+ezu+aVsOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQHJhbmdlKFstMSwgMV0pXHJcbiAgICBAZGlzcGxheU9yZGVyKDEzKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOWPl+mHjeWKm+W9seWTjeeahOmHjeWKm+ezu+aVsCcpXHJcbiAgICBwdWJsaWMgZ3Jhdml0eU1vZGlmaWVyID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvLyBlbWlzc2lvbiBtb2R1bGVcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOavj+enkuWPkeWwhOeahOeykuWtkOaVsOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShDdXJ2ZVJhbmdlKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxNClcclxuICAgIEB0b29sdGlwKCfmr4/np5Llj5HlsITnmoTnspLlrZDmlbAnKVxyXG4gICAgcHVibGljIHJhdGVPdmVyVGltZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5q+P56e75Yqo5Y2V5L2N6Led56a75Y+R5bCE55qE57KS5a2Q5pWw44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDE1KVxyXG4gICAgQHRvb2x0aXAoJ+avj+enu+WKqOWNleS9jei3neemu+WPkeWwhOeahOeykuWtkOaVsCcpXHJcbiAgICBwdWJsaWMgcmF0ZU92ZXJEaXN0YW5jZSA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+5a6a5Zyo5oyH5a6a5pe26Ze05Y+R5bCE5oyH5a6a5pWw6YeP55qE57KS5a2Q55qEIGJ1cnN0IOeahOaVsOmHj+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShbQnVyc3RdKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxNilcclxuICAgIEB0b29sdGlwKCflnKjmn5DkuKrml7bpl7Tngrnlj5HlsITnu5nlrprmlbDph4/nmoTnspLlrZAnKVxyXG4gICAgcHVibGljIGJ1cnN0czogQnVyc3RbXSA9IFtdO1xyXG5cclxuICAgIEBvdmVycmlkZVxyXG4gICAgQHR5cGUoTWF0ZXJpYWwpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU5hbWUoJ01hdGVyaWFscycpXHJcbiAgICBAdmlzaWJsZShmYWxzZSlcclxuICAgIGdldCBzaGFyZWRNYXRlcmlhbHMgKCkge1xyXG4gICAgICAgIC8vIGlmIHdlIGRvbid0IGNyZWF0ZSBhbiBhcnJheSBjb3B5LCB0aGUgZWRpdG9yIHdpbGwgbW9kaWZ5IHRoZSBvcmlnaW5hbCBhcnJheSBkaXJlY3RseS5cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNoYXJlZE1hdGVyaWFscztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2hhcmVkTWF0ZXJpYWxzICh2YWwpIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgc3VwZXIuc2hhcmVkTWF0ZXJpYWxzID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbG9yIG92ZXIgbGlmZXRpbWUgbW9kdWxlXHJcbiAgICBAdHlwZShDb2xvck92ZXJMaWZldGltZU1vZHVsZSlcclxuICAgIF9jb2xvck92ZXJMaWZldGltZU1vZHVsZTpDb2xvck92ZXJMaWZldGltZU1vZHVsZSB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6aKc6Imy5o6n5Yi25qih5Z2X44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKENvbG9yT3ZlckxpZmV0aW1lTW9kdWxlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigyMylcclxuICAgIEB0b29sdGlwKCfpopzoibLmqKHlnZcnKVxyXG4gICAgcHVibGljIGdldCBjb2xvck92ZXJMaWZldGltZU1vZHVsZSAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2NvbG9yT3ZlckxpZmV0aW1lTW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2xvck92ZXJMaWZldGltZU1vZHVsZSA9IG5ldyBDb2xvck92ZXJMaWZldGltZU1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUuYmluZFRhcmdldCh0aGlzLnByb2Nlc3NvciEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2xvck92ZXJMaWZldGltZU1vZHVsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGNvbG9yT3ZlckxpZmV0aW1lTW9kdWxlICh2YWwpIHtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2NvbG9yT3ZlckxpZmV0aW1lTW9kdWxlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNoYXBlIG1vZHVsZVxyXG4gICAgQHR5cGUoU2hhcGVNb2R1bGUpXHJcbiAgICBfc2hhcGVNb2R1bGU6U2hhcGVNb2R1bGUgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOWPkeWwhOWZqOaooeWdl+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShTaGFwZU1vZHVsZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMTcpXHJcbiAgICBAdG9vbHRpcCgn5Y+R5bCE5Zmo5qih5Z2XJylcclxuICAgIHB1YmxpYyBnZXQgc2hhcGVNb2R1bGUgKCkge1xyXG4gICAgICAgIGlmIChFRElUT1IpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9zaGFwZU1vZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcGVNb2R1bGUgPSBuZXcgU2hhcGVNb2R1bGUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXBlTW9kdWxlLm9uSW5pdCh0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVNb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzaGFwZU1vZHVsZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9zaGFwZU1vZHVsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzaXplIG92ZXIgbGlmZXRpbWUgbW9kdWxlXHJcbiAgICBAdHlwZShTaXplT3ZlcnRpbWVNb2R1bGUpXHJcbiAgICBfc2l6ZU92ZXJ0aW1lTW9kdWxlOlNpemVPdmVydGltZU1vZHVsZSB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5aSn5bCP5qih5Z2X44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNpemVPdmVydGltZU1vZHVsZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMjEpXHJcbiAgICBAdG9vbHRpcCgn5aSn5bCP5qih5Z2XJylcclxuICAgIHB1YmxpYyBnZXQgc2l6ZU92ZXJ0aW1lTW9kdWxlICgpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fc2l6ZU92ZXJ0aW1lTW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplT3ZlcnRpbWVNb2R1bGUgPSBuZXcgU2l6ZU92ZXJ0aW1lTW9kdWxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplT3ZlcnRpbWVNb2R1bGUuYmluZFRhcmdldCh0aGlzLnByb2Nlc3NvciEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaXplT3ZlcnRpbWVNb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBzaXplT3ZlcnRpbWVNb2R1bGUgKHZhbCkge1xyXG4gICAgICAgIGlmICghdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fc2l6ZU92ZXJ0aW1lTW9kdWxlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZlbG9jaXR5IG92ZXJ0aW1lIG1vZHVsZVxyXG4gICAgQHR5cGUoVmVsb2NpdHlPdmVydGltZU1vZHVsZSlcclxuICAgIF92ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlOlZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOmAn+W6puaooeWdl+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigxOClcclxuICAgIEB0b29sdGlwKCfpgJ/luqbmqKHlnZcnKVxyXG4gICAgcHVibGljIGdldCB2ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlICgpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fdmVsb2NpdHlPdmVydGltZU1vZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IG5ldyBWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZWxvY2l0eU92ZXJ0aW1lTW9kdWxlLmJpbmRUYXJnZXQodGhpcy5wcm9jZXNzb3IhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdmVsb2NpdHlPdmVydGltZU1vZHVsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgKHZhbCkge1xyXG4gICAgICAgIGlmICghdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fdmVsb2NpdHlPdmVydGltZU1vZHVsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBmb3JjZSBvdmVyVGltZSBtb2R1bGVcclxuICAgIEB0eXBlKEZvcmNlT3ZlcnRpbWVNb2R1bGUpXHJcbiAgICBfZm9yY2VPdmVydGltZU1vZHVsZTpGb3JjZU92ZXJ0aW1lTW9kdWxlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDliqDpgJ/luqbmqKHlnZfjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRm9yY2VPdmVydGltZU1vZHVsZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMTkpXHJcbiAgICBAdG9vbHRpcCgn5Yqg6YCf5bqm5qih5Z2XJylcclxuICAgIHB1YmxpYyBnZXQgZm9yY2VPdmVydGltZU1vZHVsZSAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUgPSBuZXcgRm9yY2VPdmVydGltZU1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZm9yY2VPdmVydGltZU1vZHVsZS5iaW5kVGFyZ2V0KHRoaXMucHJvY2Vzc29yISk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBmb3JjZU92ZXJ0aW1lTW9kdWxlICh2YWwpIHtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gbGltaXQgdmVsb2NpdHkgb3ZlcnRpbWUgbW9kdWxlXHJcbiAgICBAdHlwZShMaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUpXHJcbiAgICBfbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlOkxpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOmZkOWItumAn+W6puaooeWdl++8iOWPquaUr+aMgSBDUFUg57KS5a2Q77yJ44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKExpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMjApXHJcbiAgICBAdG9vbHRpcCgn6ZmQ6YCf5qih5Z2XJylcclxuICAgIHB1YmxpYyBnZXQgbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlICgpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgPSBuZXcgTGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUuYmluZFRhcmdldCh0aGlzLnByb2Nlc3NvciEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsaW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUgKHZhbCkge1xyXG4gICAgICAgIGlmICghdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fbGltaXRWZWxvY2l0eU92ZXJ0aW1lTW9kdWxlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJvdGF0aW9uIG92ZXJ0aW1lIG1vZHVsZVxyXG4gICAgQHR5cGUoUm90YXRpb25PdmVydGltZU1vZHVsZSlcclxuICAgIF9yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlOlJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOaXi+i9rOaooeWdl+OAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigyMilcclxuICAgIEB0b29sdGlwKCfml4vovazmqKHlnZcnKVxyXG4gICAgcHVibGljIGdldCByb3RhdGlvbk92ZXJ0aW1lTW9kdWxlICgpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZSA9IG5ldyBSb3RhdGlvbk92ZXJ0aW1lTW9kdWxlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlLmJpbmRUYXJnZXQodGhpcy5wcm9jZXNzb3IhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHJvdGF0aW9uT3ZlcnRpbWVNb2R1bGUgKHZhbCkge1xyXG4gICAgICAgIGlmICghdmFsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyB0ZXh0dXJlIGFuaW1hdGlvbiBtb2R1bGVcclxuICAgIEB0eXBlKFRleHR1cmVBbmltYXRpb25Nb2R1bGUpXHJcbiAgICBfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZTpUZXh0dXJlQW5pbWF0aW9uTW9kdWxlIHwgbnVsbCA9IG51bGw7XHJcbiAgICAvKipcclxuICAgICAqIEB6aCDotLTlm77liqjnlLvmqKHlnZfjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSlcclxuICAgIEBkaXNwbGF5T3JkZXIoMjQpXHJcbiAgICBAdG9vbHRpcCgn6LS05Zu+5Yqo55S75qih5Z2XJylcclxuICAgIHB1YmxpYyBnZXQgdGV4dHVyZUFuaW1hdGlvbk1vZHVsZSAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGUgPSBuZXcgVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5iaW5kVGFyZ2V0KHRoaXMucHJvY2Vzc29yISk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0ZXh0dXJlQW5pbWF0aW9uTW9kdWxlICh2YWwpIHtcclxuICAgICAgICBpZiAoIXZhbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdHJhaWwgbW9kdWxlXHJcbiAgICBAdHlwZShUcmFpbE1vZHVsZSlcclxuICAgIF90cmFpbE1vZHVsZTpUcmFpbE1vZHVsZSB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q6L2o6L+55qih5Z2X44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFRyYWlsTW9kdWxlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigyNSlcclxuICAgIEB0b29sdGlwKCfmi5blsL7mqKHlnZcnKVxyXG4gICAgcHVibGljIGdldCB0cmFpbE1vZHVsZSAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX3RyYWlsTW9kdWxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl90cmFpbE1vZHVsZSA9IG5ldyBUcmFpbE1vZHVsZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhaWxNb2R1bGUub25Jbml0KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhaWxNb2R1bGUub25FbmFibGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fdHJhaWxNb2R1bGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCB0cmFpbE1vZHVsZSAodmFsKSB7XHJcbiAgICAgICAgaWYgKCF2YWwpIHJldHVybjtcclxuICAgICAgICB0aGlzLl90cmFpbE1vZHVsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBwYXJ0aWNsZSBzeXN0ZW0gcmVuZGVyZXJcclxuICAgIEB0eXBlKFBhcnRpY2xlU3lzdGVtUmVuZGVyZXIpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDI2KVxyXG4gICAgQHRvb2x0aXAoJ+a4suafk+aooeWdlycpXHJcbiAgICBwdWJsaWMgcmVuZGVyZXI6IFBhcnRpY2xlU3lzdGVtUmVuZGVyZXIgPSBuZXcgUGFydGljbGVTeXN0ZW1SZW5kZXJlcigpO1xyXG5cclxuICAgIC8vIHNlcmlsaXplZCBjdWxsaW5nXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDI3KVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuWJlOmZpOmdniBlbmFibGUg55qE5qih5Z2X5pWw5o2uJylcclxuICAgIHB1YmxpYyBlbmFibGVDdWxsaW5nOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKi9cclxuICAgIHByaXZhdGUgX2lzUGxheWluZzogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX2lzUGF1c2VkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfaXNTdG9wcGVkOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfaXNFbWl0dGluZzogYm9vbGVhbjtcclxuXHJcbiAgICBwcml2YXRlIF90aW1lOiBudW1iZXI7ICAvLyBwbGF5YmFjayBwb3NpdGlvbiBpbiBzZWNvbmRzLlxyXG4gICAgcHJpdmF0ZSBfZW1pdFJhdGVUaW1lQ291bnRlcjogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXI6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX29sZFdQb3M6IFZlYzM7XHJcbiAgICBwcml2YXRlIF9jdXJXUG9zOiBWZWMzO1xyXG5cclxuICAgIHByaXZhdGUgX2N1c3RvbURhdGExOiBWZWMyO1xyXG4gICAgcHJpdmF0ZSBfY3VzdG9tRGF0YTI6IFZlYzI7XHJcblxyXG4gICAgcHJpdmF0ZSBfc3ViRW1pdHRlcnM6IGFueVtdOyAvLyBhcnJheSBvZiB7IGVtaXR0ZXI6IFBhcnRpY2xlU3lzdGVtLCB0eXBlOiAnYmlydGgnLCAnY29sbGlzaW9uJyBvciAnZGVhdGgnfVxyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3ByZXdhcm0gPSBmYWxzZTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9jYXBhY2l0eSA9IDEwMDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9zaW11bGF0aW9uU3BhY2UgPSBTcGFjZS5Mb2NhbDtcclxuXHJcbiAgICBwdWJsaWMgcHJvY2Vzc29yOiBJUGFydGljbGVTeXN0ZW1SZW5kZXJlciA9IG51bGwhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLnJhdGVPdmVyVGltZS5jb25zdGFudCA9IDEwO1xyXG4gICAgICAgIHRoaXMuc3RhcnRMaWZldGltZS5jb25zdGFudCA9IDU7XHJcbiAgICAgICAgdGhpcy5zdGFydFNpemVYLmNvbnN0YW50ID0gMTtcclxuICAgICAgICB0aGlzLnN0YXJ0U3BlZWQuY29uc3RhbnQgPSA1O1xyXG5cclxuICAgICAgICAvLyBpbnRlcm5hbCBzdGF0dXNcclxuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2lzU3RvcHBlZCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5faXNFbWl0dGluZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICB0aGlzLl90aW1lID0gMC4wOyAgLy8gcGxheWJhY2sgcG9zaXRpb24gaW4gc2Vjb25kcy5cclxuICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyID0gMC4wO1xyXG4gICAgICAgIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyID0gMC4wO1xyXG4gICAgICAgIHRoaXMuX29sZFdQb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIHRoaXMuX2N1cldQb3MgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXN0b21EYXRhMSA9IG5ldyBWZWMyKCk7XHJcbiAgICAgICAgdGhpcy5fY3VzdG9tRGF0YTIgPSBuZXcgVmVjMigpO1xyXG5cclxuICAgICAgICB0aGlzLl9zdWJFbWl0dGVycyA9IFtdOyAvLyBhcnJheSBvZiB7IGVtaXR0ZXI6IFBhcnRpY2xlU3lzdGVtLCB0eXBlOiAnYmlydGgnLCAnY29sbGlzaW9uJyBvciAnZGVhdGgnfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkxvYWQgKCkge1xyXG4gICAgICAgIC8vIEhBQ0ssIFRPRE9cclxuICAgICAgICB0aGlzLnJlbmRlcmVyLm9uSW5pdCh0aGlzKTtcclxuICAgICAgICBpZiAodGhpcy5fc2hhcGVNb2R1bGUpIHRoaXMuX3NoYXBlTW9kdWxlLm9uSW5pdCh0aGlzKTtcclxuICAgICAgICBpZiAodGhpcy5fdHJhaWxNb2R1bGUpIHRoaXMuX3RyYWlsTW9kdWxlLm9uSW5pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLmJpbmRNb2R1bGUoKTtcclxuICAgICAgICB0aGlzLl9yZXNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuX3N5c3RlbS5hZGQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9vbk1hdGVyaWFsTW9kaWZpZWQgKGluZGV4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc29yIS5vbk1hdGVyaWFsTW9kaWZpZWQoaW5kZXgsIG1hdGVyaWFsKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uUmVidWlsZFBTTyAoaW5kZXg6IG51bWJlciwgbWF0ZXJpYWw6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzb3IhLm9uUmVidWlsZFBTTyhpbmRleCwgbWF0ZXJpYWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfY29sbGVjdE1vZGVscyAoKTogc2NlbmUuTW9kZWxbXSB7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxzLnB1c2goKHRoaXMucHJvY2Vzc29yIGFzIGFueSkuX21vZGVsKTtcclxuICAgICAgICBpZiAodGhpcy5fdHJhaWxNb2R1bGUgJiYgdGhpcy5fdHJhaWxNb2R1bGUuZW5hYmxlICYmICh0aGlzLl90cmFpbE1vZHVsZSBhcyBhbnkpLl90cmFpbE1vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVscy5wdXNoKCh0aGlzLl90cmFpbE1vZHVsZSBhcyBhbnkpLl90cmFpbE1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVscztcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2F0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc29yIS5hdHRhY2hUb1NjZW5lKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RyYWlsTW9kdWxlICYmIHRoaXMuX3RyYWlsTW9kdWxlLmVuYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl90cmFpbE1vZHVsZS5fYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzb3IhLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFpbE1vZHVsZSAmJiB0aGlzLl90cmFpbE1vZHVsZS5lbmFibGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fdHJhaWxNb2R1bGUuX2RldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZE1vZHVsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvbG9yT3ZlckxpZmV0aW1lTW9kdWxlKSB0aGlzLl9jb2xvck92ZXJMaWZldGltZU1vZHVsZS5iaW5kVGFyZ2V0KHRoaXMucHJvY2Vzc29yISk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NpemVPdmVydGltZU1vZHVsZSkgdGhpcy5fc2l6ZU92ZXJ0aW1lTW9kdWxlLmJpbmRUYXJnZXQodGhpcy5wcm9jZXNzb3IhKTtcclxuICAgICAgICBpZiAodGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZSkgdGhpcy5fcm90YXRpb25PdmVydGltZU1vZHVsZS5iaW5kVGFyZ2V0KHRoaXMucHJvY2Vzc29yISk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUpIHRoaXMuX2ZvcmNlT3ZlcnRpbWVNb2R1bGUuYmluZFRhcmdldCh0aGlzLnByb2Nlc3NvciEpO1xyXG4gICAgICAgIGlmICh0aGlzLl9saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUpIHRoaXMuX2xpbWl0VmVsb2NpdHlPdmVydGltZU1vZHVsZS5iaW5kVGFyZ2V0KHRoaXMucHJvY2Vzc29yISk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUpIHRoaXMuX3ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUuYmluZFRhcmdldCh0aGlzLnByb2Nlc3NvciEpO1xyXG4gICAgICAgIGlmICh0aGlzLl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlKSB0aGlzLl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLmJpbmRUYXJnZXQodGhpcy5wcm9jZXNzb3IhKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPOiBGYXN0IGZvcndhcmQgY3VycmVudCBwYXJ0aWNsZSBzeXN0ZW0gYnkgc2ltdWxhdGluZyBwYXJ0aWNsZXMgb3ZlciBnaXZlbiBwZXJpb2Qgb2YgdGltZSwgdGhlbiBwYXVzZSBpdC5cclxuICAgIC8vIHNpbXVsYXRlKHRpbWUsIHdpdGhDaGlsZHJlbiwgcmVzdGFydCwgZml4ZWRUaW1lU3RlcCkge1xyXG5cclxuICAgIC8vIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOaSreaUvueykuWtkOaViOaenOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGxheSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUGF1c2VkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2lzUGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pc1N0b3BwZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNTdG9wcGVkID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2lzRW1pdHRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9yZXNldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIHByZXdhcm1cclxuICAgICAgICBpZiAodGhpcy5fcHJld2FybSkge1xyXG4gICAgICAgICAgICB0aGlzLl9wcmV3YXJtU3lzdGVtKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pqC5YGc5pKt5pS+57KS5a2Q5pWI5p6c44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzU3RvcHBlZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ3BhdXNlKCk6IHBhcnRpY2xlIHN5c3RlbSBpcyBhbHJlYWR5IHN0b3BwZWQuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZykge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1BsYXlpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2lzUGF1c2VkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWBnOatouaSreaUvueykuWtkOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RvcCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZyB8fCB0aGlzLl9pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pc1BsYXlpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5faXNQbGF5aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9pc1BhdXNlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9pc1BhdXNlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdGltZSA9IDAuMDtcclxuICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyID0gMC4wO1xyXG4gICAgICAgIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyID0gMC4wO1xyXG5cclxuICAgICAgICB0aGlzLl9pc1N0b3BwZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJlbW92ZSBhbGwgcGFydGljbGVzIGZyb20gY3VycmVudCBwYXJ0aWNsZSBzeXN0ZW0uXHJcbiAgICAvKipcclxuICAgICAqIOWwhuaJgOacieeykuWtkOS7jueykuWtkOezu+e7n+S4rea4hemZpOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXIgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWRJbkhpZXJhcmNoeSkge1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NvciEuY2xlYXIoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3RyYWlsTW9kdWxlKSB0aGlzLl90cmFpbE1vZHVsZS5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDojrflj5blvZPliY3nspLlrZDmlbDph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFBhcnRpY2xlQ291bnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb2Nlc3NvciEuZ2V0UGFydGljbGVDb3VudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGlnbm9yZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0Q3VzdG9tRGF0YTEgKHgsIHkpIHtcclxuICAgICAgICBWZWMyLnNldCh0aGlzLl9jdXN0b21EYXRhMSwgeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEN1c3RvbURhdGEyICh4LCB5KSB7XHJcbiAgICAgICAgVmVjMi5zZXQodGhpcy5fY3VzdG9tRGF0YTIsIHgsIHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIC8vIHRoaXMuX3N5c3RlbS5yZW1vdmUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzb3IhLm9uRGVzdHJveSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFpbE1vZHVsZSkgdGhpcy5fdHJhaWxNb2R1bGUuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheU9uQXdha2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wbGF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucHJvY2Vzc29yIS5vbkVuYWJsZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl90cmFpbE1vZHVsZSkgdGhpcy5fdHJhaWxNb2R1bGUub25FbmFibGUoKTtcclxuICAgIH1cclxuICAgIHByb3RlY3RlZCBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc29yIS5vbkRpc2FibGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fdHJhaWxNb2R1bGUpIHRoaXMuX3RyYWlsTW9kdWxlLm9uRGlzYWJsZSgpO1xyXG4gICAgfVxyXG4gICAgcHJvdGVjdGVkIHVwZGF0ZSAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHNjYWxlZERlbHRhVGltZSA9IGR0ICogdGhpcy5zaW11bGF0aW9uU3BlZWQ7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzUGxheWluZykge1xyXG4gICAgICAgICAgICB0aGlzLl90aW1lICs9IHNjYWxlZERlbHRhVGltZTtcclxuXHJcbiAgICAgICAgICAgIC8vIEV4ZWN1dGUgZW1pc3Npb25cclxuICAgICAgICAgICAgdGhpcy5fZW1pdChzY2FsZWREZWx0YVRpbWUpO1xyXG5cclxuICAgICAgICAgICAgLy8gc2ltdWxhdGlvbiwgdXBkYXRlIHBhcnRpY2xlcy5cclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvY2Vzc29yIS51cGRhdGVQYXJ0aWNsZXMoc2NhbGVkRGVsdGFUaW1lKSA9PT0gMCAmJiAhdGhpcy5faXNFbWl0dGluZykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZSByZW5kZXIgZGF0YVxyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NvciEudXBkYXRlUmVuZGVyRGF0YSgpO1xyXG5cclxuICAgICAgICAgICAgLy8gdXBkYXRlIHRyYWlsXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90cmFpbE1vZHVsZSAmJiB0aGlzLl90cmFpbE1vZHVsZS5lbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3RyYWlsTW9kdWxlLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uVmlzaWJpbGl0eUNoYW5nZSAodmFsKSB7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3Nvci5fbW9kZWwpIHtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3Nvci5fbW9kZWwudmlzRmxhZ3MgPSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZW1pdCAoY291bnQsIGR0KSB7XHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSB0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NpbXVsYXRpb25TcGFjZSA9PT0gU3BhY2UuV29ybGQpIHtcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkTWF0cml4KF93b3JsZF9tYXQpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRSb3RhdGlvbihfd29ybGRfcm9sKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXJ0aWNsZSA9IHRoaXMucHJvY2Vzc29yIS5nZXRGcmVlUGFydGljbGUoKTtcclxuICAgICAgICAgICAgaWYgKHBhcnRpY2xlID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY29uc3QgcmFuZCA9IHBzZXVkb1JhbmRvbShyYW5kb21SYW5nZUludCgwLCBJTlRfTUFYKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hhcGVNb2R1bGUgJiYgdGhpcy5fc2hhcGVNb2R1bGUuZW5hYmxlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFwZU1vZHVsZS5lbWl0KHBhcnRpY2xlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHBhcnRpY2xlLnBvc2l0aW9uLCAwLCAwLCAwKTtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weShwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGVFbWl0WkF4aXMpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5fdGV4dHVyZUFuaW1hdGlvbk1vZHVsZSAmJiB0aGlzLl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLmVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5pbml0KHBhcnRpY2xlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHksIHRoaXMuc3RhcnRTcGVlZC5ldmFsdWF0ZShkZWx0YSwgcmFuZCkhKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaW11bGF0aW9uU3BhY2UgPT09IFNwYWNlLldvcmxkKSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQocGFydGljbGUucG9zaXRpb24sIHBhcnRpY2xlLnBvc2l0aW9uLCBfd29ybGRfbWF0KTtcclxuICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdChwYXJ0aWNsZS52ZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHksIF93b3JsZF9yb2wpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBWZWMzLmNvcHkocGFydGljbGUudWx0aW1hdGVWZWxvY2l0eSwgcGFydGljbGUudmVsb2NpdHkpO1xyXG4gICAgICAgICAgICAvLyBhcHBseSBzdGFydFJvdGF0aW9uLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydFJvdGF0aW9uM0QpIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHBhcnRpY2xlLnJvdGF0aW9uLCB0aGlzLnN0YXJ0Um90YXRpb25YLmV2YWx1YXRlKGRlbHRhLCByYW5kKSEsXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFJvdGF0aW9uWS5ldmFsdWF0ZShkZWx0YSwgcmFuZCkhLFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3RhcnRSb3RhdGlvblouZXZhbHVhdGUoZGVsdGEsIHJhbmQpISk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnNldChwYXJ0aWNsZS5yb3RhdGlvbiwgMCwgMCwgdGhpcy5zdGFydFJvdGF0aW9uWi5ldmFsdWF0ZShkZWx0YSwgcmFuZCkhKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXBwbHkgc3RhcnRTaXplLlxyXG4gICAgICAgICAgICBpZiAodGhpcy5zdGFydFNpemUzRCkge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQocGFydGljbGUuc3RhcnRTaXplLCB0aGlzLnN0YXJ0U2l6ZVguZXZhbHVhdGUoZGVsdGEsIHJhbmQpISxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0U2l6ZVkuZXZhbHVhdGUoZGVsdGEsIHJhbmQpISxcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0U2l6ZVouZXZhbHVhdGUoZGVsdGEsIHJhbmQpISk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnNldChwYXJ0aWNsZS5zdGFydFNpemUsIHRoaXMuc3RhcnRTaXplWC5ldmFsdWF0ZShkZWx0YSwgcmFuZCkhLCAxLCAxKTtcclxuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnN0YXJ0U2l6ZS55ID0gcGFydGljbGUuc3RhcnRTaXplLng7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVmVjMy5jb3B5KHBhcnRpY2xlLnNpemUsIHBhcnRpY2xlLnN0YXJ0U2l6ZSk7XHJcblxyXG4gICAgICAgICAgICAvLyBhcHBseSBzdGFydENvbG9yLlxyXG4gICAgICAgICAgICBwYXJ0aWNsZS5zdGFydENvbG9yLnNldCh0aGlzLnN0YXJ0Q29sb3IuZXZhbHVhdGUoZGVsdGEsIHJhbmQpKTtcclxuICAgICAgICAgICAgcGFydGljbGUuY29sb3Iuc2V0KHBhcnRpY2xlLnN0YXJ0Q29sb3IpO1xyXG5cclxuICAgICAgICAgICAgLy8gYXBwbHkgc3RhcnRMaWZldGltZS5cclxuICAgICAgICAgICAgcGFydGljbGUuc3RhcnRMaWZldGltZSA9IHRoaXMuc3RhcnRMaWZldGltZS5ldmFsdWF0ZShkZWx0YSwgcmFuZCkhICsgZHQ7XHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJlbWFpbmluZ0xpZmV0aW1lID0gcGFydGljbGUuc3RhcnRMaWZldGltZTtcclxuXHJcbiAgICAgICAgICAgIHBhcnRpY2xlLnJhbmRvbVNlZWQgPSByYW5kb21SYW5nZUludCgwLCAyMzMyODApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzb3IhLnNldE5ld1BhcnRpY2xlKHBhcnRpY2xlKTtcclxuXHJcbiAgICAgICAgfSAvLyBlbmQgb2YgcGFydGljbGVzIGZvckxvb3AuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5pdGlhbGl6ZSBwYXJ0aWNsZSBzeXN0ZW0gYXMgdGhvdWdoIGl0IGhhZCBhbHJlYWR5IGNvbXBsZXRlZCBhIGZ1bGwgY3ljbGUuXHJcbiAgICBwcml2YXRlIF9wcmV3YXJtU3lzdGVtICgpIHtcclxuICAgICAgICB0aGlzLnN0YXJ0RGVsYXkubW9kZSA9IE1vZGUuQ29uc3RhbnQ7IC8vIGNsZWFyIHN0YXJ0RGVsYXkuXHJcbiAgICAgICAgdGhpcy5zdGFydERlbGF5LmNvbnN0YW50ID0gMDtcclxuICAgICAgICBjb25zdCBkdCA9IDEuMDsgLy8gc2hvdWxkIHVzZSB2YXJ5aW5nIHZhbHVlP1xyXG4gICAgICAgIGNvbnN0IGNudCA9IHRoaXMuZHVyYXRpb24gLyBkdDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNudDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3RpbWUgKz0gZHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2VtaXQoZHQpO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NvciEudXBkYXRlUGFydGljbGVzKGR0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW50ZXJuYWwgZnVuY3Rpb25cclxuICAgIHByaXZhdGUgX2VtaXQgKGR0KSB7XHJcbiAgICAgICAgLy8gZW1pdCBwYXJ0aWNsZXMuXHJcbiAgICAgICAgY29uc3Qgc3RhcnREZWxheSA9IHRoaXMuc3RhcnREZWxheS5ldmFsdWF0ZSgwLCAxKSE7XHJcbiAgICAgICAgaWYgKHRoaXMuX3RpbWUgPiBzdGFydERlbGF5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl90aW1lID4gKHRoaXMuZHVyYXRpb24gKyBzdGFydERlbGF5KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fdGltZSA9IHN0YXJ0RGVsYXk7IC8vIGRlbGF5IHdpbGwgbm90IGJlIGFwcGxpZWQgZnJvbSB0aGUgc2Vjb25kIGxvb3AuKFVuaXR5KVxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciA9IDAuMDtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxvb3ApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc0VtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBlbWl0IGJ5IHJhdGVPdmVyVGltZVxyXG4gICAgICAgICAgICB0aGlzLl9lbWl0UmF0ZVRpbWVDb3VudGVyICs9IHRoaXMucmF0ZU92ZXJUaW1lLmV2YWx1YXRlKHRoaXMuX3RpbWUgLyB0aGlzLmR1cmF0aW9uLCAxKSEgKiBkdDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2VtaXRSYXRlVGltZUNvdW50ZXIgPiAxICYmIHRoaXMuX2lzRW1pdHRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtaXROdW0gPSBNYXRoLmZsb29yKHRoaXMuX2VtaXRSYXRlVGltZUNvdW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZW1pdFJhdGVUaW1lQ291bnRlciAtPSBlbWl0TnVtO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KGVtaXROdW0sIGR0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBlbWl0IGJ5IHJhdGVPdmVyRGlzdGFuY2VcclxuICAgICAgICAgICAgdGhpcy5ub2RlLmdldFdvcmxkUG9zaXRpb24odGhpcy5fY3VyV1Bvcyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlID0gVmVjMy5kaXN0YW5jZSh0aGlzLl9jdXJXUG9zLCB0aGlzLl9vbGRXUG9zKTtcclxuICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX29sZFdQb3MsIHRoaXMuX2N1cldQb3MpO1xyXG4gICAgICAgICAgICB0aGlzLl9lbWl0UmF0ZURpc3RhbmNlQ291bnRlciArPSBkaXN0YW5jZSAqIHRoaXMucmF0ZU92ZXJEaXN0YW5jZS5ldmFsdWF0ZSh0aGlzLl90aW1lIC8gdGhpcy5kdXJhdGlvbiwgMSkhO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZW1pdFJhdGVEaXN0YW5jZUNvdW50ZXIgPiAxICYmIHRoaXMuX2lzRW1pdHRpbmcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGVtaXROdW0gPSBNYXRoLmZsb29yKHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VtaXRSYXRlRGlzdGFuY2VDb3VudGVyIC09IGVtaXROdW07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoZW1pdE51bSwgZHQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBidXJzdHNcclxuICAgICAgICAgICAgZm9yIChjb25zdCBidXJzdCBvZiB0aGlzLmJ1cnN0cykge1xyXG4gICAgICAgICAgICAgICAgYnVyc3QudXBkYXRlKHRoaXMsIGR0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNldFBvc2l0aW9uICgpIHtcclxuICAgICAgICB0aGlzLm5vZGUuZ2V0V29ybGRQb3NpdGlvbih0aGlzLl9vbGRXUG9zKTtcclxuICAgICAgICBWZWMzLmNvcHkodGhpcy5fY3VyV1BvcywgdGhpcy5fb2xkV1Bvcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBhZGRTdWJFbWl0dGVyIChzdWJFbWl0dGVyKSB7XHJcbiAgICAgICAgdGhpcy5fc3ViRW1pdHRlcnMucHVzaChzdWJFbWl0dGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlbW92ZVN1YkVtaXR0ZXIgKGlkeCkge1xyXG4gICAgICAgIHRoaXMuX3N1YkVtaXR0ZXJzLnNwbGljZSh0aGlzLl9zdWJFbWl0dGVycy5pbmRleE9mKGlkeCksIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgYWRkQnVyc3QgKGJ1cnN0KSB7XHJcbiAgICAgICAgdGhpcy5idXJzdHMucHVzaChidXJzdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZW1vdmVCdXJzdCAoaWR4KSB7XHJcbiAgICAgICAgdGhpcy5idXJzdHMuc3BsaWNlKHRoaXMuYnVyc3RzLmluZGV4T2YoaWR4KSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKi9cclxuICAgIGdldCBpc1BsYXlpbmcgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1BsYXlpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzUGF1c2VkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faXNQYXVzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzU3RvcHBlZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzU3RvcHBlZDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNFbWl0dGluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzRW1pdHRpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHRpbWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfb25CZWZvcmVTZXJpYWxpemUgKHByb3BzKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZW5hYmxlQ3VsbGluZyA/IHByb3BzLmZpbHRlcihwID0+ICFQQVJUSUNMRV9NT0RVTEVfUFJPUEVSVFkuaW5jbHVkZXMocCkgfHwgKHRoaXNbcF0gJiYgdGhpc1twXS5lbmFibGUpKSA6IHByb3BzO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==