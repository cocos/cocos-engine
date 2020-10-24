(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../../core/value-types/index.js", "../particle.js", "./curve-range.js", "../enum.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../../core/value-types/index.js"), require("../particle.js"), require("./curve-range.js"), require("../enum.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.particle, global.curveRange, global._enum);
    global.textureAnimation = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _particle, _curveRange, _enum) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _temp;

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
  var TEXTURE_ANIMATION_RAND_OFFSET = _enum.ModuleRandSeed.TEXTURE;
  /**
   * 粒子贴图动画类型。
   * @enum textureAnimationModule.Mode
   */

  var Mode = (0, _index3.Enum)({
    /**
     * 网格类型。
     */
    Grid: 0
    /**
     * 精灵类型（暂未支持）。
     */
    // Sprites: 1,

  });
  /**
   * 贴图动画的播放方式。
   * @enum textureAnimationModule.Animation
   */

  var Animation = (0, _index3.Enum)({
    /**
     * 播放贴图中的所有帧。
     */
    WholeSheet: 0,

    /**
     * 播放贴图中的其中一行动画。
     */
    SingleRow: 1
  });
  var TextureAnimationModule = (_dec = (0, _index.ccclass)('cc.TextureAnimationModule'), _dec2 = (0, _index.formerlySerializedAs)('numTilesX'), _dec3 = (0, _index.formerlySerializedAs)('numTilesY'), _dec4 = (0, _index.displayOrder)(0), _dec5 = (0, _index.type)(Mode), _dec6 = (0, _index.type)(Mode), _dec7 = (0, _index.displayOrder)(1), _dec8 = (0, _index.tooltip)('设定粒子贴图动画的类型（暂只支持 Grid 模式）'), _dec9 = (0, _index.displayOrder)(2), _dec10 = (0, _index.tooltip)('X 方向动画帧数'), _dec11 = (0, _index.displayOrder)(3), _dec12 = (0, _index.tooltip)('Y 方向动画帧数'), _dec13 = (0, _index.type)(Animation), _dec14 = (0, _index.displayOrder)(4), _dec15 = (0, _index.tooltip)('动画播放方式'), _dec16 = (0, _index.type)(_curveRange.default), _dec17 = (0, _index.displayOrder)(7), _dec18 = (0, _index.tooltip)('一个周期内动画播放的帧与时间变化曲线'), _dec19 = (0, _index.type)(_curveRange.default), _dec20 = (0, _index.displayOrder)(8), _dec21 = (0, _index.tooltip)('从第几帧开始播放，时间为整个粒子系统的生命周期'), _dec22 = (0, _index.displayOrder)(9), _dec23 = (0, _index.tooltip)('一个生命周期内播放循环的次数'), _dec24 = (0, _index.displayOrder)(5), _dec25 = (0, _index.tooltip)('随机从动画贴图中选择一行以生成动画。\n此选项仅在动画播放方式为 SingleRow 时生效'), _dec26 = (0, _index.displayOrder)(6), _dec27 = (0, _index.tooltip)('从动画贴图中选择特定行以生成动画。\n此选项仅在动画播放方式为 SingleRow 时且禁用 randomRow 时可用'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_ParticleModuleBase) {
    _inherits(TextureAnimationModule, _ParticleModuleBase);

    function TextureAnimationModule() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, TextureAnimationModule);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TextureAnimationModule)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "_enable", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_numTilesX", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_numTilesY", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mode", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "animation", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "frameOverTime", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "startFrame", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "cycleCount", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_flipU", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_flipV", _descriptor10, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_uvChannelMask", _descriptor11, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "randomRow", _descriptor12, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "rowIndex", _descriptor13, _assertThisInitialized(_this));

      _this.name = _particle.PARTICLE_MODULE_NAME.TEXTURE;
      return _this;
    }

    _createClass(TextureAnimationModule, [{
      key: "init",
      value: function init(p) {
        p.startRow = Math.floor(Math.random() * this.numTilesY);
      }
    }, {
      key: "animate",
      value: function animate(p, dt) {
        var normalizedTime = 1 - p.remainingLifetime / p.startLifetime;
        var startFrame = this.startFrame.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) / (this.numTilesX * this.numTilesY);

        if (this.animation === Animation.WholeSheet) {
          p.frameIndex = (0, _index2.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
        } else if (this.animation === Animation.SingleRow) {
          var rowLength = 1 / this.numTilesY;

          if (this.randomRow) {
            var f = (0, _index2.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1);
            var from = p.startRow * rowLength;
            var to = from + rowLength;
            p.frameIndex = (0, _index2.lerp)(from, to, f);
          } else {
            var _from = this.rowIndex * rowLength;

            var _to = _from + rowLength;

            p.frameIndex = (0, _index2.lerp)(_from, _to, (0, _index2.repeat)(this.cycleCount * (this.frameOverTime.evaluate(normalizedTime, (0, _index2.pseudoRandom)(p.randomSeed + TEXTURE_ANIMATION_RAND_OFFSET)) + startFrame), 1));
          }
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
        this.target.updateMaterialParams();
        this.target.enableModule(this.name, val, this);
      }
    }, {
      key: "mode",

      /**
       * @zh 设定粒子贴图动画的类型（暂只支持 Grid 模式）[[Mode]]。
       */
      get: function get() {
        return this._mode;
      },
      set: function set(val) {
        if (val !== Mode.Grid) {
          console.error('particle texture animation\'s sprites is not supported!');
          return;
        }
      }
      /**
       * @zh X 方向动画帧数。
       */

    }, {
      key: "numTilesX",
      get: function get() {
        return this._numTilesX;
      },
      set: function set(val) {
        if (this._numTilesX !== val) {
          this._numTilesX = val;
          this.target.updateMaterialParams();
        }
      }
      /**
       * @zh Y 方向动画帧数。
       */

    }, {
      key: "numTilesY",
      get: function get() {
        return this._numTilesY;
      },
      set: function set(val) {
        if (this._numTilesY !== val) {
          this._numTilesY = val;
          this.target.updateMaterialParams();
        }
      }
      /**
       * @zh 动画播放方式 [[Animation]]。
       */

    }, {
      key: "flipU",

      /**
       * @ignore
       */
      get: function get() {
        return this._flipU;
      },
      set: function set(val) {
        console.error('particle texture animation\'s flipU is not supported!');
      }
    }, {
      key: "flipV",
      get: function get() {
        return this._flipV;
      },
      set: function set(val) {
        console.error('particle texture animation\'s flipV is not supported!');
      }
    }, {
      key: "uvChannelMask",
      get: function get() {
        return this._uvChannelMask;
      },
      set: function set(val) {
        console.error('particle texture animation\'s uvChannelMask is not supported!');
      }
      /**
       * @zh 随机从动画贴图中选择一行以生成动画。<br>
       * 此选项仅在动画播放方式为 SingleRow 时生效。
       */

    }]);

    return TextureAnimationModule;
  }(_particle.ParticleModuleBase), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_numTilesX", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_numTilesY", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_mode", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Mode.Grid;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "mode", [_dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "mode"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "numTilesX", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "numTilesX"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "numTilesY", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "numTilesY"), _class2.prototype), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "animation", [_dec13, _index.serializable, _dec14, _dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return Animation.WholeSheet;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "frameOverTime", [_dec16, _index.serializable, _dec17, _dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "startFrame", [_dec19, _index.serializable, _dec20, _dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "cycleCount", [_index.serializable, _dec22, _dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_flipU", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_flipV", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "_uvChannelMask", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return -1;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "randomRow", [_index.serializable, _dec24, _dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "rowIndex", [_index.serializable, _dec26, _dec27], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class2)) || _class);
  _exports.default = TextureAnimationModule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2FuaW1hdG9yL3RleHR1cmUtYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbIlRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUIiwiTW9kdWxlUmFuZFNlZWQiLCJURVhUVVJFIiwiTW9kZSIsIkdyaWQiLCJBbmltYXRpb24iLCJXaG9sZVNoZWV0IiwiU2luZ2xlUm93IiwiVGV4dHVyZUFuaW1hdGlvbk1vZHVsZSIsIkN1cnZlUmFuZ2UiLCJuYW1lIiwiUEFSVElDTEVfTU9EVUxFX05BTUUiLCJwIiwic3RhcnRSb3ciLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJudW1UaWxlc1kiLCJkdCIsIm5vcm1hbGl6ZWRUaW1lIiwicmVtYWluaW5nTGlmZXRpbWUiLCJzdGFydExpZmV0aW1lIiwic3RhcnRGcmFtZSIsImV2YWx1YXRlIiwicmFuZG9tU2VlZCIsIm51bVRpbGVzWCIsImFuaW1hdGlvbiIsImZyYW1lSW5kZXgiLCJjeWNsZUNvdW50IiwiZnJhbWVPdmVyVGltZSIsInJvd0xlbmd0aCIsInJhbmRvbVJvdyIsImYiLCJmcm9tIiwidG8iLCJyb3dJbmRleCIsIl9lbmFibGUiLCJ2YWwiLCJ0YXJnZXQiLCJ1cGRhdGVNYXRlcmlhbFBhcmFtcyIsImVuYWJsZU1vZHVsZSIsIl9tb2RlIiwiY29uc29sZSIsImVycm9yIiwiX251bVRpbGVzWCIsIl9udW1UaWxlc1kiLCJfZmxpcFUiLCJfZmxpcFYiLCJfdXZDaGFubmVsTWFzayIsIlBhcnRpY2xlTW9kdWxlQmFzZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0EsTUFBTUEsNkJBQTZCLEdBQUdDLHFCQUFlQyxPQUFyRDtBQUVBOzs7OztBQUlBLE1BQU1DLElBQUksR0FBRyxrQkFBSztBQUNkOzs7QUFHQUMsSUFBQUEsSUFBSSxF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ZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgdHlwZSwgZm9ybWVybHlTZXJpYWxpemVkQXMsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IGxlcnAsIHBzZXVkb1JhbmRvbSwgcmVwZWF0IH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUvdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZSwgUGFydGljbGVNb2R1bGVCYXNlLCBQQVJUSUNMRV9NT0RVTEVfTkFNRSB9IGZyb20gJy4uL3BhcnRpY2xlJztcclxuaW1wb3J0IEN1cnZlUmFuZ2UgZnJvbSAnLi9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCB7IE1vZHVsZVJhbmRTZWVkIH0gZnJvbSAnLi4vZW51bSc7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbWF4LWxpbmUtbGVuZ3RoXHJcbmNvbnN0IFRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUID0gTW9kdWxlUmFuZFNlZWQuVEVYVFVSRTtcclxuXHJcbi8qKlxyXG4gKiDnspLlrZDotLTlm77liqjnlLvnsbvlnovjgIJcclxuICogQGVudW0gdGV4dHVyZUFuaW1hdGlvbk1vZHVsZS5Nb2RlXHJcbiAqL1xyXG5jb25zdCBNb2RlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIOe9keagvOexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBHcmlkOiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57K+54G157G75Z6L77yI5pqC5pyq5pSv5oyB77yJ44CCXHJcbiAgICAgKi9cclxuICAgIC8vIFNwcml0ZXM6IDEsXHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIOi0tOWbvuWKqOeUu+eahOaSreaUvuaWueW8j+OAglxyXG4gKiBAZW51bSB0ZXh0dXJlQW5pbWF0aW9uTW9kdWxlLkFuaW1hdGlvblxyXG4gKi9cclxuY29uc3QgQW5pbWF0aW9uID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIOaSreaUvui0tOWbvuS4reeahOaJgOacieW4p+OAglxyXG4gICAgICovXHJcbiAgICBXaG9sZVNoZWV0OiAwLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5pKt5pS+6LS05Zu+5Lit55qE5YW25Lit5LiA6KGM5Yqo55S744CCXHJcbiAgICAgKi9cclxuICAgIFNpbmdsZVJvdzogMSxcclxufSk7XHJcblxyXG5AY2NjbGFzcygnY2MuVGV4dHVyZUFuaW1hdGlvbk1vZHVsZScpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRleHR1cmVBbmltYXRpb25Nb2R1bGUgZXh0ZW5kcyBQYXJ0aWNsZU1vZHVsZUJhc2Uge1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2VuYWJsZSA9IGZhbHNlO1xyXG5cclxuICAgIEBmb3JtZXJseVNlcmlhbGl6ZWRBcygnbnVtVGlsZXNYJylcclxuICAgIHByaXZhdGUgX251bVRpbGVzWCA9IDA7XHJcblxyXG4gICAgQGZvcm1lcmx5U2VyaWFsaXplZEFzKCdudW1UaWxlc1knKVxyXG4gICAgcHJpdmF0ZSBfbnVtVGlsZXNZID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmmK/lkKblkK/nlKjjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgZ2V0IGVuYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZW5hYmxlICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fZW5hYmxlID09PSB2YWwpIHJldHVybjtcclxuICAgICAgICB0aGlzLl9lbmFibGUgPSB2YWw7XHJcbiAgICAgICAgaWYgKCF0aGlzLnRhcmdldCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0LnVwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XHJcbiAgICAgICAgdGhpcy50YXJnZXQuZW5hYmxlTW9kdWxlKHRoaXMubmFtZSwgdmFsLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShNb2RlKVxyXG4gICAgcHJpdmF0ZSBfbW9kZSA9IE1vZGUuR3JpZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDorr7lrprnspLlrZDotLTlm77liqjnlLvnmoTnsbvlnovvvIjmmoLlj6rmlK/mjIEgR3JpZCDmqKHlvI/vvIlbW01vZGVdXeOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShNb2RlKVxyXG4gICAgQGRpc3BsYXlPcmRlcigxKVxyXG4gICAgQHRvb2x0aXAoJ+iuvuWumueykuWtkOi0tOWbvuWKqOeUu+eahOexu+Wei++8iOaaguWPquaUr+aMgSBHcmlkIOaooeW8j++8iScpXHJcbiAgICBnZXQgbW9kZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG1vZGUgKHZhbCkge1xyXG4gICAgICAgIGlmICh2YWwgIT09IE1vZGUuR3JpZCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdwYXJ0aWNsZSB0ZXh0dXJlIGFuaW1hdGlvblxcJ3Mgc3ByaXRlcyBpcyBub3Qgc3VwcG9ydGVkIScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIFgg5pa55ZCR5Yqo55S75bin5pWw44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMilcclxuICAgIEB0b29sdGlwKCdYIOaWueWQkeWKqOeUu+W4p+aVsCcpXHJcbiAgICBnZXQgbnVtVGlsZXNYICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbnVtVGlsZXNYO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBudW1UaWxlc1ggKHZhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9udW1UaWxlc1ggIT09IHZhbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9udW1UaWxlc1ggPSB2YWw7XHJcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0IS51cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCBZIOaWueWQkeWKqOeUu+W4p+aVsOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdG9vbHRpcCgnWSDmlrnlkJHliqjnlLvluKfmlbAnKVxyXG4gICAgZ2V0IG51bVRpbGVzWSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX251bVRpbGVzWTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbnVtVGlsZXNZICh2YWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fbnVtVGlsZXNZICE9PSB2YWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbnVtVGlsZXNZID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLnRhcmdldCEudXBkYXRlTWF0ZXJpYWxQYXJhbXMoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5Yqo55S75pKt5pS+5pa55byPIFtbQW5pbWF0aW9uXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQW5pbWF0aW9uKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcig0KVxyXG4gICAgQHRvb2x0aXAoJ+WKqOeUu+aSreaUvuaWueW8jycpXHJcbiAgICBwdWJsaWMgYW5pbWF0aW9uID0gQW5pbWF0aW9uLldob2xlU2hlZXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LiA5Liq5ZGo5pyf5YaF5Yqo55S75pKt5pS+55qE5bin5LiO5pe26Ze05Y+Y5YyW5puy57q/44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKEN1cnZlUmFuZ2UpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDcpXHJcbiAgICBAdG9vbHRpcCgn5LiA5Liq5ZGo5pyf5YaF5Yqo55S75pKt5pS+55qE5bin5LiO5pe26Ze05Y+Y5YyW5puy57q/JylcclxuICAgIHB1YmxpYyBmcmFtZU92ZXJUaW1lID0gbmV3IEN1cnZlUmFuZ2UoKTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDku47nrKzlh6DluKflvIDlp4vmkq3mlL7vvIzml7bpl7TkuLrmlbTkuKrnspLlrZDns7vnu5/nmoTnlJ/lkb3lkajmnJ/jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoOClcclxuICAgIEB0b29sdGlwKCfku47nrKzlh6DluKflvIDlp4vmkq3mlL7vvIzml7bpl7TkuLrmlbTkuKrnspLlrZDns7vnu5/nmoTnlJ/lkb3lkajmnJ8nKVxyXG4gICAgcHVibGljIHN0YXJ0RnJhbWUgPSBuZXcgQ3VydmVSYW5nZSgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOS4gOS4queUn+WRveWRqOacn+WGheaSreaUvuW+queOr+eahOasoeaVsOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDkpXHJcbiAgICBAdG9vbHRpcCgn5LiA5Liq55Sf5ZG95ZGo5pyf5YaF5pKt5pS+5b6q546v55qE5qyh5pWwJylcclxuICAgIHB1YmxpYyBjeWNsZUNvdW50ID0gMDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9mbGlwVSA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAaWdub3JlXHJcbiAgICAgKi9cclxuICAgIGdldCBmbGlwVSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsaXBVO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmbGlwVSAodmFsKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcigncGFydGljbGUgdGV4dHVyZSBhbmltYXRpb25cXCdzIGZsaXBVIGlzIG5vdCBzdXBwb3J0ZWQhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfZmxpcFYgPSAwO1xyXG5cclxuICAgIGdldCBmbGlwViAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZsaXBWO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmbGlwViAodmFsKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcigncGFydGljbGUgdGV4dHVyZSBhbmltYXRpb25cXCdzIGZsaXBWIGlzIG5vdCBzdXBwb3J0ZWQhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfdXZDaGFubmVsTWFzayA9IC0xO1xyXG5cclxuICAgIGdldCB1dkNoYW5uZWxNYXNrICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXZDaGFubmVsTWFzaztcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdXZDaGFubmVsTWFzayAodmFsKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcigncGFydGljbGUgdGV4dHVyZSBhbmltYXRpb25cXCdzIHV2Q2hhbm5lbE1hc2sgaXMgbm90IHN1cHBvcnRlZCEnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDpmo/mnLrku47liqjnlLvotLTlm77kuK3pgInmi6nkuIDooYzku6XnlJ/miJDliqjnlLvjgII8YnI+XHJcbiAgICAgKiDmraTpgInpobnku4XlnKjliqjnlLvmkq3mlL7mlrnlvI/kuLogU2luZ2xlUm93IOaXtueUn+aViOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgn6ZqP5py65LuO5Yqo55S76LS05Zu+5Lit6YCJ5oup5LiA6KGM5Lul55Sf5oiQ5Yqo55S744CCXFxu5q2k6YCJ6aG55LuF5Zyo5Yqo55S75pKt5pS+5pa55byP5Li6IFNpbmdsZVJvdyDml7bnlJ/mlYgnKVxyXG4gICAgcHVibGljIHJhbmRvbVJvdyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOS7juWKqOeUu+i0tOWbvuS4remAieaLqeeJueWumuihjOS7peeUn+aIkOWKqOeUu+OAgjxicj5cclxuICAgICAqIOatpOmAiemhueS7heWcqOWKqOeUu+aSreaUvuaWueW8j+S4uiBTaW5nbGVSb3cg5pe25LiU56aB55SoIHJhbmRvbVJvdyDml7blj6/nlKjjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcig2KVxyXG4gICAgQHRvb2x0aXAoJ+S7juWKqOeUu+i0tOWbvuS4remAieaLqeeJueWumuihjOS7peeUn+aIkOWKqOeUu+OAglxcbuatpOmAiemhueS7heWcqOWKqOeUu+aSreaUvuaWueW8j+S4uiBTaW5nbGVSb3cg5pe25LiU56aB55SoIHJhbmRvbVJvdyDml7blj6/nlKgnKVxyXG4gICAgcHVibGljIHJvd0luZGV4ID0gMDtcclxuICAgIFxyXG4gICAgcHVibGljIG5hbWUgPSBQQVJUSUNMRV9NT0RVTEVfTkFNRS5URVhUVVJFO1xyXG5cclxuICAgIHB1YmxpYyBpbml0IChwOiBQYXJ0aWNsZSkge1xyXG4gICAgICAgIHAuc3RhcnRSb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLm51bVRpbGVzWSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFuaW1hdGUgKHA6IFBhcnRpY2xlLCBkdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgbm9ybWFsaXplZFRpbWUgPSAxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZTtcclxuICAgICAgICBjb25zdCBzdGFydEZyYW1lID0gdGhpcy5zdGFydEZyYW1lLmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgVEVYVFVSRV9BTklNQVRJT05fUkFORF9PRkZTRVQpKSEgLyAodGhpcy5udW1UaWxlc1ggKiB0aGlzLm51bVRpbGVzWSk7XHJcbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uID09PSBBbmltYXRpb24uV2hvbGVTaGVldCkge1xyXG4gICAgICAgICAgICBwLmZyYW1lSW5kZXggPSByZXBlYXQodGhpcy5jeWNsZUNvdW50ICogKHRoaXMuZnJhbWVPdmVyVGltZS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUKSkhICsgc3RhcnRGcmFtZSksIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0aGlzLmFuaW1hdGlvbiA9PT0gQW5pbWF0aW9uLlNpbmdsZVJvdykge1xyXG4gICAgICAgICAgICBjb25zdCByb3dMZW5ndGggPSAxIC8gdGhpcy5udW1UaWxlc1k7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhbmRvbVJvdykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZiA9IHJlcGVhdCh0aGlzLmN5Y2xlQ291bnQgKiAodGhpcy5mcmFtZU92ZXJUaW1lLmV2YWx1YXRlKG5vcm1hbGl6ZWRUaW1lLCBwc2V1ZG9SYW5kb20ocC5yYW5kb21TZWVkICsgVEVYVFVSRV9BTklNQVRJT05fUkFORF9PRkZTRVQpKSEgKyBzdGFydEZyYW1lKSwgMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmcm9tID0gcC5zdGFydFJvdyAqIHJvd0xlbmd0aDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHRvID0gZnJvbSArIHJvd0xlbmd0aDtcclxuICAgICAgICAgICAgICAgIHAuZnJhbWVJbmRleCA9IGxlcnAoZnJvbSwgdG8sIGYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZnJvbSA9IHRoaXMucm93SW5kZXggKiByb3dMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB0byA9IGZyb20gKyByb3dMZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBwLmZyYW1lSW5kZXggPSBsZXJwKGZyb20sIHRvLCByZXBlYXQodGhpcy5jeWNsZUNvdW50ICogKHRoaXMuZnJhbWVPdmVyVGltZS5ldmFsdWF0ZShub3JtYWxpemVkVGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCArIFRFWFRVUkVfQU5JTUFUSU9OX1JBTkRfT0ZGU0VUKSkhICsgc3RhcnRGcmFtZSksIDEpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iXX0=