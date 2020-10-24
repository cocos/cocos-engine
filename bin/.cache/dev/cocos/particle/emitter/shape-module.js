(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/data/decorators/index.js", "../../core/math/index.js", "../animator/curve-range.js", "../enum.js", "../particle-general-function.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/data/decorators/index.js"), require("../../core/math/index.js"), require("../animator/curve-range.js"), require("../enum.js"), require("../particle-general-function.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.curveRange, global._enum, global.particleGeneralFunction);
    global.shapeModule = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _curveRange, _enum, _particleGeneralFunction) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _curveRange = _interopRequireDefault(_curveRange);

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _temp;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  var _intermediVec = new _index2.Vec3(0, 0, 0);

  var _intermediArr = new Array();

  var _unitBoxExtent = new _index2.Vec3(0.5, 0.5, 0.5);

  var ShapeModule = (_dec = (0, _index.ccclass)('cc.ShapeModule'), _dec2 = (0, _index.displayOrder)(13), _dec3 = (0, _index.tooltip)('粒子发射器位置'), _dec4 = (0, _index.displayOrder)(14), _dec5 = (0, _index.tooltip)('粒子发射器旋转角度'), _dec6 = (0, _index.displayOrder)(15), _dec7 = (0, _index.tooltip)('粒子发射器缩放比例'), _dec8 = (0, _index.displayOrder)(6), _dec9 = (0, _index.tooltip)('粒子发射器在一个扇形范围内发射'), _dec10 = (0, _index.displayOrder)(5), _dec11 = (0, _index.tooltip)('圆锥的轴与母线的夹角\n决定圆锥发射器的开合程度'), _dec12 = (0, _index.displayOrder)(0), _dec13 = (0, _index.type)(_enum.ShapeType), _dec14 = (0, _index.formerlySerializedAs)('shapeType'), _dec15 = (0, _index.displayOrder)(1), _dec16 = (0, _index.type)(_enum.ShapeType), _dec17 = (0, _index.tooltip)('粒子发射器类型'), _dec18 = (0, _index.type)(_enum.EmitLocation), _dec19 = (0, _index.displayOrder)(2), _dec20 = (0, _index.tooltip)('粒子从发射器哪个部位发射'), _dec21 = (0, _index.displayOrder)(16), _dec22 = (0, _index.tooltip)('根据粒子的初始方向决定粒子的移动方向'), _dec23 = (0, _index.displayOrder)(17), _dec24 = (0, _index.tooltip)('粒子生成方向随机设定'), _dec25 = (0, _index.displayOrder)(18), _dec26 = (0, _index.tooltip)('表示当前发射方向与当前位置到结点中心连线方向的插值'), _dec27 = (0, _index.displayOrder)(19), _dec28 = (0, _index.tooltip)('粒子生成位置随机设定（设定此值为非 0 会使粒子生成位置超出生成器大小范围）'), _dec29 = (0, _index.displayOrder)(3), _dec30 = (0, _index.tooltip)('粒子发射器半径'), _dec31 = (0, _index.displayOrder)(4), _dec32 = (0, _index.tooltip)('粒子发射器发射位置（对 Box 类型的发射器无效）:\n - 0 表示从表面发射；\n - 1 表示从中心发射；\n - 0 ~ 1 之间表示在中心到表面之间发射。'), _dec33 = (0, _index.type)(_enum.ArcMode), _dec34 = (0, _index.displayOrder)(7), _dec35 = (0, _index.tooltip)('粒子在扇形范围内的发射方式'), _dec36 = (0, _index.displayOrder)(9), _dec37 = (0, _index.tooltip)('控制可能产生粒子的弧周围的离散间隔'), _dec38 = (0, _index.type)(_curveRange.default), _dec39 = (0, _index.displayOrder)(10), _dec40 = (0, _index.tooltip)('粒子沿圆周发射的速度'), _dec41 = (0, _index.displayOrder)(11), _dec42 = (0, _index.tooltip)('圆锥顶部截面距离底部的轴长\n决定圆锥发射器的高度'), _dec43 = (0, _index.displayOrder)(12), _dec44 = (0, _index.tooltip)('粒子发射器发射位置（针对 Box 类型的粒子发射器）'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    _createClass(ShapeModule, [{
      key: "position",

      /**
       * @zh 粒子发射器位置。
       */
      get: function get() {
        return this._position;
      },
      set: function set(val) {
        this._position = val;
        this.constructMat();
      }
      /**
       * @zh 粒子发射器旋转角度。
       */

    }, {
      key: "rotation",
      get: function get() {
        return this._rotation;
      },
      set: function set(val) {
        this._rotation = val;
        this.constructMat();
      }
      /**
       * @zh 粒子发射器缩放比例。
       */

    }, {
      key: "scale",
      get: function get() {
        return this._scale;
      },
      set: function set(val) {
        this._scale = val;
        this.constructMat();
      }
      /**
       * @zh 粒子发射器在一个扇形范围内发射。
       */

    }, {
      key: "arc",
      get: function get() {
        return (0, _index2.toDegree)(this._arc);
      },
      set: function set(val) {
        this._arc = (0, _index2.toRadian)(val);
      }
      /**
       * @zh 圆锥的轴与母线的夹角<bg>。
       * 决定圆锥发射器的开合程度。
       */

    }, {
      key: "angle",
      get: function get() {
        return Math.round((0, _index2.toDegree)(this._angle) * 100) / 100;
      },
      set: function set(val) {
        this._angle = (0, _index2.toRadian)(val);
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
        this._enable = val;
      }
      /**
       * @zh 粒子发射器类型 [[ShapeType]]。
       */

    }, {
      key: "shapeType",
      get: function get() {
        return this._shapeType;
      },
      set: function set(val) {
        this._shapeType = val;

        switch (this._shapeType) {
          case _enum.ShapeType.Box:
            if (this.emitFrom === _enum.EmitLocation.Base) {
              this.emitFrom = _enum.EmitLocation.Volume;
            }

            break;

          case _enum.ShapeType.Cone:
            if (this.emitFrom === _enum.EmitLocation.Edge) {
              this.emitFrom = _enum.EmitLocation.Base;
            }

            break;

          case _enum.ShapeType.Sphere:
          case _enum.ShapeType.Hemisphere:
            if (this.emitFrom === _enum.EmitLocation.Base || this.emitFrom === _enum.EmitLocation.Edge) {
              this.emitFrom = _enum.EmitLocation.Volume;
            }

            break;
        }
      }
      /**
       * @zh 粒子从发射器哪个部位发射 [[EmitLocation]]。
       */

    }]);

    function ShapeModule() {
      _classCallCheck(this, ShapeModule);

      _initializerDefineProperty(this, "_enable", _descriptor, this);

      _initializerDefineProperty(this, "_shapeType", _descriptor2, this);

      _initializerDefineProperty(this, "emitFrom", _descriptor3, this);

      _initializerDefineProperty(this, "alignToDirection", _descriptor4, this);

      _initializerDefineProperty(this, "randomDirectionAmount", _descriptor5, this);

      _initializerDefineProperty(this, "sphericalDirectionAmount", _descriptor6, this);

      _initializerDefineProperty(this, "randomPositionAmount", _descriptor7, this);

      _initializerDefineProperty(this, "radius", _descriptor8, this);

      _initializerDefineProperty(this, "radiusThickness", _descriptor9, this);

      _initializerDefineProperty(this, "arcMode", _descriptor10, this);

      _initializerDefineProperty(this, "arcSpread", _descriptor11, this);

      _initializerDefineProperty(this, "arcSpeed", _descriptor12, this);

      _initializerDefineProperty(this, "length", _descriptor13, this);

      _initializerDefineProperty(this, "boxThickness", _descriptor14, this);

      _initializerDefineProperty(this, "_position", _descriptor15, this);

      _initializerDefineProperty(this, "_rotation", _descriptor16, this);

      _initializerDefineProperty(this, "_scale", _descriptor17, this);

      _initializerDefineProperty(this, "_arc", _descriptor18, this);

      _initializerDefineProperty(this, "_angle", _descriptor19, this);

      this.mat = void 0;
      this.quat = void 0;
      this.particleSystem = void 0;
      this.lastTime = void 0;
      this.totalAngle = void 0;
      this.mat = new _index2.Mat4();
      this.quat = new _index2.Quat();
      this.particleSystem = null;
      this.lastTime = 0;
      this.totalAngle = 0;
    }

    _createClass(ShapeModule, [{
      key: "onInit",
      value: function onInit(ps) {
        this.particleSystem = ps;
        this.constructMat();
        this.lastTime = this.particleSystem._time;
      }
    }, {
      key: "emit",
      value: function emit(p) {
        switch (this.shapeType) {
          case _enum.ShapeType.Box:
            boxEmit(this.emitFrom, this.boxThickness, p.position, p.velocity);
            break;

          case _enum.ShapeType.Circle:
            circleEmit(this.radius, this.radiusThickness, this.generateArcAngle(), p.position, p.velocity);
            break;

          case _enum.ShapeType.Cone:
            coneEmit(this.emitFrom, this.radius, this.radiusThickness, this.generateArcAngle(), this._angle, this.length, p.position, p.velocity);
            break;

          case _enum.ShapeType.Sphere:
            sphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
            break;

          case _enum.ShapeType.Hemisphere:
            hemisphereEmit(this.emitFrom, this.radius, this.radiusThickness, p.position, p.velocity);
            break;

          default:
            console.warn(this.shapeType + ' shapeType is not supported by ShapeModule.');
        }

        if (this.randomPositionAmount > 0) {
          p.position.x += (0, _index2.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
          p.position.y += (0, _index2.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
          p.position.z += (0, _index2.randomRange)(-this.randomPositionAmount, this.randomPositionAmount);
        }

        _index2.Vec3.transformQuat(p.velocity, p.velocity, this.quat);

        _index2.Vec3.transformMat4(p.position, p.position, this.mat);

        if (this.sphericalDirectionAmount > 0) {
          var sphericalVel = _index2.Vec3.normalize(_intermediVec, p.position);

          _index2.Vec3.lerp(p.velocity, p.velocity, sphericalVel, this.sphericalDirectionAmount);
        }

        this.lastTime = this.particleSystem._time;
      }
    }, {
      key: "constructMat",
      value: function constructMat() {
        _index2.Quat.fromEuler(this.quat, this._rotation.x, this._rotation.y, this._rotation.z);

        _index2.Mat4.fromRTS(this.mat, this.quat, this._position, this._scale);
      }
    }, {
      key: "generateArcAngle",
      value: function generateArcAngle() {
        if (this.arcMode === _enum.ArcMode.Random) {
          return (0, _index2.randomRange)(0, this._arc);
        }

        var angle = this.totalAngle + 2 * Math.PI * this.arcSpeed.evaluate(this.particleSystem._time, 1) * (this.particleSystem._time - this.lastTime);
        this.totalAngle = angle;

        if (this.arcSpread !== 0) {
          angle = Math.floor(angle / (this._arc * this.arcSpread)) * this._arc * this.arcSpread;
        }

        switch (this.arcMode) {
          case _enum.ArcMode.Loop:
            return (0, _index2.repeat)(angle, this._arc);

          case _enum.ArcMode.PingPong:
            return (0, _index2.pingPong)(angle, this._arc);
        }
      }
    }]);

    return ShapeModule;
  }(), _temp), (_applyDecoratedDescriptor(_class2.prototype, "position", [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "position"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "rotation", [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "rotation"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "scale", [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "scale"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "arc", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "arc"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angle", [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "angle"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_enable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "enable", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "enable"), _class2.prototype), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_shapeType", [_dec13, _dec14, _dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.ShapeType.Cone;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "shapeType", [_dec16, _dec17], Object.getOwnPropertyDescriptor(_class2.prototype, "shapeType"), _class2.prototype), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "emitFrom", [_dec18, _index.serializable, _dec19, _dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.EmitLocation.Volume;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "alignToDirection", [_index.serializable, _dec21, _dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "randomDirectionAmount", [_index.serializable, _dec23, _dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "sphericalDirectionAmount", [_index.serializable, _dec25, _dec26], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "randomPositionAmount", [_index.serializable, _dec27, _dec28], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "radius", [_index.serializable, _dec29, _dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "radiusThickness", [_index.serializable, _dec31, _dec32], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "arcMode", [_dec33, _index.serializable, _dec34, _dec35], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _enum.ArcMode.Random;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "arcSpread", [_index.serializable, _dec36, _dec37], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "arcSpeed", [_dec38, _index.serializable, _dec39, _dec40], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _curveRange.default();
    }
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "length", [_index.serializable, _dec41, _dec42], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 5;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "boxThickness", [_index.serializable, _dec43, _dec44], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(0, 0, 0);
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "_position", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(0, 0, 0);
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "_rotation", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(0, 0, 0);
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "_scale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(1, 1, 1);
    }
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "_arc", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return (0, _index2.toRadian)(360);
    }
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "_angle", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return (0, _index2.toRadian)(25);
    }
  })), _class2)) || _class);
  _exports.default = ShapeModule;

  function sphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
    switch (emitFrom) {
      case _enum.EmitLocation.Volume:
        (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

        _index2.Vec3.normalize(dir, pos);

        break;

      case _enum.EmitLocation.Shell:
        (0, _particleGeneralFunction.randomUnitVector)(pos);

        _index2.Vec3.multiplyScalar(pos, pos, radius);

        _index2.Vec3.normalize(dir, pos);

        break;

      default:
        console.warn(emitFrom + ' is not supported for sphere emitter.');
    }
  }

  function hemisphereEmit(emitFrom, radius, radiusThickness, pos, dir) {
    switch (emitFrom) {
      case _enum.EmitLocation.Volume:
        (0, _particleGeneralFunction.randomPointBetweenSphere)(pos, radius * (1 - radiusThickness), radius);

        if (pos.z > 0) {
          pos.z *= -1;
        }

        _index2.Vec3.normalize(dir, pos);

        break;

      case _enum.EmitLocation.Shell:
        (0, _particleGeneralFunction.randomUnitVector)(pos);

        _index2.Vec3.multiplyScalar(pos, pos, radius);

        if (pos.z > 0) {
          pos.z *= -1;
        }

        _index2.Vec3.normalize(dir, pos);

        break;

      default:
        console.warn(emitFrom + ' is not supported for hemisphere emitter.');
    }
  }

  function coneEmit(emitFrom, radius, radiusThickness, theta, angle, length, pos, dir) {
    switch (emitFrom) {
      case _enum.EmitLocation.Base:
        (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

        _index2.Vec2.multiplyScalar(dir, pos, Math.sin(angle));

        dir.z = -Math.cos(angle) * radius;

        _index2.Vec3.normalize(dir, dir);

        pos.z = 0;
        break;

      case _enum.EmitLocation.Shell:
        (0, _particleGeneralFunction.fixedAngleUnitVector2)(pos, theta);

        _index2.Vec2.multiplyScalar(dir, pos, Math.sin(angle));

        dir.z = -Math.cos(angle);

        _index2.Vec3.normalize(dir, dir);

        _index2.Vec2.multiplyScalar(pos, pos, radius);

        pos.z = 0;
        break;

      case _enum.EmitLocation.Volume:
        (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

        _index2.Vec2.multiplyScalar(dir, pos, Math.sin(angle));

        dir.z = -Math.cos(angle) * radius;

        _index2.Vec3.normalize(dir, dir);

        pos.z = 0;

        _index2.Vec3.add(pos, pos, _index2.Vec3.multiplyScalar(_intermediVec, dir, length * (0, _index2.random)() / -dir.z));

        break;

      default:
        console.warn(emitFrom + ' is not supported for cone emitter.');
    }
  }

  function boxEmit(emitFrom, boxThickness, pos, dir) {
    switch (emitFrom) {
      case _enum.EmitLocation.Volume:
        (0, _particleGeneralFunction.randomPointInCube)(pos, _unitBoxExtent); // randomPointBetweenCube(pos, vec3.multiply(_intermediVec, _unitBoxExtent, boxThickness), _unitBoxExtent);

        break;

      case _enum.EmitLocation.Shell:
        _intermediArr.splice(0, _intermediArr.length);

        _intermediArr.push((0, _index2.randomRange)(-0.5, 0.5));

        _intermediArr.push((0, _index2.randomRange)(-0.5, 0.5));

        _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

        (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
        applyBoxThickness(_intermediArr, boxThickness);

        _index2.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

        break;

      case _enum.EmitLocation.Edge:
        _intermediArr.splice(0, _intermediArr.length);

        _intermediArr.push((0, _index2.randomRange)(-0.5, 0.5));

        _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

        _intermediArr.push((0, _particleGeneralFunction.randomSign)() * 0.5);

        (0, _particleGeneralFunction.randomSortArray)(_intermediArr);
        applyBoxThickness(_intermediArr, boxThickness);

        _index2.Vec3.set(pos, _intermediArr[0], _intermediArr[1], _intermediArr[2]);

        break;

      default:
        console.warn(emitFrom + ' is not supported for box emitter.');
    }

    _index2.Vec3.copy(dir, _particleGeneralFunction.particleEmitZAxis);
  }

  function circleEmit(radius, radiusThickness, theta, pos, dir) {
    (0, _particleGeneralFunction.randomPointBetweenCircleAtFixedAngle)(pos, radius * (1 - radiusThickness), radius, theta);

    _index2.Vec3.normalize(dir, pos);
  }

  function applyBoxThickness(pos, thickness) {
    if (thickness.x > 0) {
      pos[0] += 0.5 * (0, _index2.randomRange)(-thickness.x, thickness.x);
      pos[0] = (0, _index2.clamp)(pos[0], -0.5, 0.5);
    }

    if (thickness.y > 0) {
      pos[1] += 0.5 * (0, _index2.randomRange)(-thickness.y, thickness.y);
      pos[1] = (0, _index2.clamp)(pos[1], -0.5, 0.5);
    }

    if (thickness.z > 0) {
      pos[2] += 0.5 * (0, _index2.randomRange)(-thickness.z, thickness.z);
      pos[2] = (0, _index2.clamp)(pos[2], -0.5, 0.5);
    }
  } // CCClass.fastDefine('cc.ShapeModule', ShapeModule, {
  //     enable: false,
  //     shapeType: ShapeType.Box,
  //     emitFrom: EmitLocation.Base,
  //     _position: new Vec3(0, 0, 0),
  //     _rotation: new Vec3(0, 0, 0),
  //     _scale: new Vec3(0, 0, 0),
  //     alignToDirection: false,
  //     randomDirectionAmount: 0,
  //     sphericalDirectionAmount: 0,
  //     randomPositionAmount: 0,
  //     radius: 0,
  //     radiusThickness: 1,
  //     arc: 0,
  //     arcMode: ArcMode.Random,
  //     arcSpread: 0,
  //     arcSpeed: null,
  //     angle: 0,
  //     length: 0,
  //     boxThickness: new Vec3(0, 0, 0)
  // });

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL2VtaXR0ZXIvc2hhcGUtbW9kdWxlLnRzIl0sIm5hbWVzIjpbIl9pbnRlcm1lZGlWZWMiLCJWZWMzIiwiX2ludGVybWVkaUFyciIsIkFycmF5IiwiX3VuaXRCb3hFeHRlbnQiLCJTaGFwZU1vZHVsZSIsIlNoYXBlVHlwZSIsIkVtaXRMb2NhdGlvbiIsIkFyY01vZGUiLCJDdXJ2ZVJhbmdlIiwiX3Bvc2l0aW9uIiwidmFsIiwiY29uc3RydWN0TWF0IiwiX3JvdGF0aW9uIiwiX3NjYWxlIiwiX2FyYyIsIk1hdGgiLCJyb3VuZCIsIl9hbmdsZSIsIl9lbmFibGUiLCJfc2hhcGVUeXBlIiwiQm94IiwiZW1pdEZyb20iLCJCYXNlIiwiVm9sdW1lIiwiQ29uZSIsIkVkZ2UiLCJTcGhlcmUiLCJIZW1pc3BoZXJlIiwibWF0IiwicXVhdCIsInBhcnRpY2xlU3lzdGVtIiwibGFzdFRpbWUiLCJ0b3RhbEFuZ2xlIiwiTWF0NCIsIlF1YXQiLCJwcyIsIl90aW1lIiwicCIsInNoYXBlVHlwZSIsImJveEVtaXQiLCJib3hUaGlja25lc3MiLCJwb3NpdGlvbiIsInZlbG9jaXR5IiwiQ2lyY2xlIiwiY2lyY2xlRW1pdCIsInJhZGl1cyIsInJhZGl1c1RoaWNrbmVzcyIsImdlbmVyYXRlQXJjQW5nbGUiLCJjb25lRW1pdCIsImxlbmd0aCIsInNwaGVyZUVtaXQiLCJoZW1pc3BoZXJlRW1pdCIsImNvbnNvbGUiLCJ3YXJuIiwicmFuZG9tUG9zaXRpb25BbW91bnQiLCJ4IiwieSIsInoiLCJ0cmFuc2Zvcm1RdWF0IiwidHJhbnNmb3JtTWF0NCIsInNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCIsInNwaGVyaWNhbFZlbCIsIm5vcm1hbGl6ZSIsImxlcnAiLCJmcm9tRXVsZXIiLCJmcm9tUlRTIiwiYXJjTW9kZSIsIlJhbmRvbSIsImFuZ2xlIiwiUEkiLCJhcmNTcGVlZCIsImV2YWx1YXRlIiwiYXJjU3ByZWFkIiwiZmxvb3IiLCJMb29wIiwiUGluZ1BvbmciLCJzZXJpYWxpemFibGUiLCJwb3MiLCJkaXIiLCJTaGVsbCIsIm11bHRpcGx5U2NhbGFyIiwidGhldGEiLCJWZWMyIiwic2luIiwiY29zIiwiYWRkIiwic3BsaWNlIiwicHVzaCIsImFwcGx5Qm94VGhpY2tuZXNzIiwic2V0IiwiY29weSIsInBhcnRpY2xlRW1pdFpBeGlzIiwidGhpY2tuZXNzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBY0EsTUFBTUEsYUFBYSxHQUFHLElBQUlDLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBdEI7O0FBQ0EsTUFBTUMsYUFBYSxHQUFHLElBQUlDLEtBQUosRUFBdEI7O0FBQ0EsTUFBTUMsY0FBYyxHQUFHLElBQUlILFlBQUosQ0FBUyxHQUFULEVBQWMsR0FBZCxFQUFtQixHQUFuQixDQUF2Qjs7TUFHcUJJLFcsV0FEcEIsb0JBQVEsZ0JBQVIsQyxVQU1JLHlCQUFhLEVBQWIsQyxVQUNBLG9CQUFRLFNBQVIsQyxVQVlBLHlCQUFhLEVBQWIsQyxVQUNBLG9CQUFRLFdBQVIsQyxVQVlBLHlCQUFhLEVBQWIsQyxVQUNBLG9CQUFRLFdBQVIsQyxVQVlBLHlCQUFhLENBQWIsQyxVQUNBLG9CQUFRLGlCQUFSLEMsV0FhQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFBUSwwQkFBUixDLFdBY0EseUJBQWEsQ0FBYixDLFdBWUEsaUJBQUtDLGVBQUwsQyxXQUNBLGlDQUFxQixXQUFyQixDLFdBQ0EseUJBQWEsQ0FBYixDLFdBR0EsaUJBQUtBLGVBQUwsQyxXQUNBLG9CQUFRLFNBQVIsQyxXQThCQSxpQkFBS0Msa0JBQUwsQyxXQUVBLHlCQUFhLENBQWIsQyxXQUNBLG9CQUFRLGNBQVIsQyxXQU9BLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLG9CQUFSLEMsV0FPQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSxZQUFSLEMsV0FPQSx5QkFBYSxFQUFiLEMsV0FDQSxvQkFBUSwyQkFBUixDLFdBT0EseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsd0NBQVIsQyxXQU9BLHlCQUFhLENBQWIsQyxXQUNBLG9CQUFRLFNBQVIsQyxXQVVBLHlCQUFhLENBQWIsQyxXQUNBLG9CQUFRLG9GQUFSLEMsV0FNQSxpQkFBS0MsYUFBTCxDLFdBRUEseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsZUFBUixDLFdBT0EseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsbUJBQVIsQyxXQU1BLGlCQUFLQyxtQkFBTCxDLFdBRUEseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsWUFBUixDLFdBUUEseUJBQWEsRUFBYixDLFdBQ0Esb0JBQVEsMkJBQVIsQyxXQU9BLHlCQUFhLEVBQWIsQyxXQUNBLG9CQUFRLDRCQUFSLEM7Ozs7QUF4TkQ7OzswQkFLZ0I7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSCxPO3dCQUNhQyxHLEVBQUs7QUFDZixhQUFLRCxTQUFMLEdBQWlCQyxHQUFqQjtBQUNBLGFBQUtDLFlBQUw7QUFDSDtBQUVEOzs7Ozs7MEJBS2dCO0FBQ1osZUFBTyxLQUFLQyxTQUFaO0FBQ0gsTzt3QkFDYUYsRyxFQUFLO0FBQ2YsYUFBS0UsU0FBTCxHQUFpQkYsR0FBakI7QUFDQSxhQUFLQyxZQUFMO0FBQ0g7QUFFRDs7Ozs7OzBCQUthO0FBQ1QsZUFBTyxLQUFLRSxNQUFaO0FBQ0gsTzt3QkFDVUgsRyxFQUFLO0FBQ1osYUFBS0csTUFBTCxHQUFjSCxHQUFkO0FBQ0EsYUFBS0MsWUFBTDtBQUNIO0FBRUQ7Ozs7OzswQkFLVztBQUNQLGVBQU8sc0JBQVMsS0FBS0csSUFBZCxDQUFQO0FBQ0gsTzt3QkFFUUosRyxFQUFLO0FBQ1YsYUFBS0ksSUFBTCxHQUFZLHNCQUFTSixHQUFULENBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQU1hO0FBQ1QsZUFBT0ssSUFBSSxDQUFDQyxLQUFMLENBQVcsc0JBQVMsS0FBS0MsTUFBZCxJQUF3QixHQUFuQyxJQUEwQyxHQUFqRDtBQUNILE87d0JBRVVQLEcsRUFBSztBQUNaLGFBQUtPLE1BQUwsR0FBYyxzQkFBU1AsR0FBVCxDQUFkO0FBQ0g7Ozs7QUFJRDs7OzBCQUlxQjtBQUNqQixlQUFPLEtBQUtRLE9BQVo7QUFDSCxPO3dCQUVrQlIsRyxFQUFLO0FBQ3BCLGFBQUtRLE9BQUwsR0FBZVIsR0FBZjtBQUNIO0FBRUQ7Ozs7OzswQkFVd0I7QUFDcEIsZUFBTyxLQUFLUyxVQUFaO0FBQ0gsTzt3QkFFcUJULEcsRUFBSztBQUN2QixhQUFLUyxVQUFMLEdBQWtCVCxHQUFsQjs7QUFDQSxnQkFBUSxLQUFLUyxVQUFiO0FBQ0ksZUFBS2QsZ0JBQVVlLEdBQWY7QUFDSSxnQkFBSSxLQUFLQyxRQUFMLEtBQWtCZixtQkFBYWdCLElBQW5DLEVBQXlDO0FBQ3JDLG1CQUFLRCxRQUFMLEdBQWdCZixtQkFBYWlCLE1BQTdCO0FBQ0g7O0FBQ0Q7O0FBQ0osZUFBS2xCLGdCQUFVbUIsSUFBZjtBQUNJLGdCQUFJLEtBQUtILFFBQUwsS0FBa0JmLG1CQUFhbUIsSUFBbkMsRUFBeUM7QUFDckMsbUJBQUtKLFFBQUwsR0FBZ0JmLG1CQUFhZ0IsSUFBN0I7QUFDSDs7QUFDRDs7QUFDSixlQUFLakIsZ0JBQVVxQixNQUFmO0FBQ0EsZUFBS3JCLGdCQUFVc0IsVUFBZjtBQUNJLGdCQUFJLEtBQUtOLFFBQUwsS0FBa0JmLG1CQUFhZ0IsSUFBL0IsSUFBdUMsS0FBS0QsUUFBTCxLQUFrQmYsbUJBQWFtQixJQUExRSxFQUFnRjtBQUM1RSxtQkFBS0osUUFBTCxHQUFnQmYsbUJBQWFpQixNQUE3QjtBQUNIOztBQUNEO0FBaEJSO0FBa0JIO0FBRUQ7Ozs7OztBQTRIQSwyQkFBZTtBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBOztBQUFBLFdBTlBLLEdBTU87QUFBQSxXQUxQQyxJQUtPO0FBQUEsV0FKUEMsY0FJTztBQUFBLFdBSFBDLFFBR087QUFBQSxXQUZQQyxVQUVPO0FBQ1gsV0FBS0osR0FBTCxHQUFXLElBQUlLLFlBQUosRUFBWDtBQUNBLFdBQUtKLElBQUwsR0FBWSxJQUFJSyxZQUFKLEVBQVo7QUFDQSxXQUFLSixjQUFMLEdBQXNCLElBQXRCO0FBQ0EsV0FBS0MsUUFBTCxHQUFnQixDQUFoQjtBQUNBLFdBQUtDLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSDs7Ozs2QkFFY0csRSxFQUFvQjtBQUMvQixhQUFLTCxjQUFMLEdBQXNCSyxFQUF0QjtBQUNBLGFBQUt4QixZQUFMO0FBQ0EsYUFBS29CLFFBQUwsR0FBZ0IsS0FBS0QsY0FBTCxDQUFvQk0sS0FBcEM7QUFDSDs7OzJCQUVZQyxDLEVBQUc7QUFDWixnQkFBUSxLQUFLQyxTQUFiO0FBQ0ksZUFBS2pDLGdCQUFVZSxHQUFmO0FBQ0ltQixZQUFBQSxPQUFPLENBQUMsS0FBS2xCLFFBQU4sRUFBZ0IsS0FBS21CLFlBQXJCLEVBQW1DSCxDQUFDLENBQUNJLFFBQXJDLEVBQStDSixDQUFDLENBQUNLLFFBQWpELENBQVA7QUFDQTs7QUFDSixlQUFLckMsZ0JBQVVzQyxNQUFmO0FBQ0lDLFlBQUFBLFVBQVUsQ0FBQyxLQUFLQyxNQUFOLEVBQWMsS0FBS0MsZUFBbkIsRUFBb0MsS0FBS0MsZ0JBQUwsRUFBcEMsRUFBNkRWLENBQUMsQ0FBQ0ksUUFBL0QsRUFBeUVKLENBQUMsQ0FBQ0ssUUFBM0UsQ0FBVjtBQUNBOztBQUNKLGVBQUtyQyxnQkFBVW1CLElBQWY7QUFDSXdCLFlBQUFBLFFBQVEsQ0FBQyxLQUFLM0IsUUFBTixFQUFnQixLQUFLd0IsTUFBckIsRUFBNkIsS0FBS0MsZUFBbEMsRUFBbUQsS0FBS0MsZ0JBQUwsRUFBbkQsRUFBNEUsS0FBSzlCLE1BQWpGLEVBQXlGLEtBQUtnQyxNQUE5RixFQUFzR1osQ0FBQyxDQUFDSSxRQUF4RyxFQUFrSEosQ0FBQyxDQUFDSyxRQUFwSCxDQUFSO0FBQ0E7O0FBQ0osZUFBS3JDLGdCQUFVcUIsTUFBZjtBQUNJd0IsWUFBQUEsVUFBVSxDQUFDLEtBQUs3QixRQUFOLEVBQWdCLEtBQUt3QixNQUFyQixFQUE2QixLQUFLQyxlQUFsQyxFQUFtRFQsQ0FBQyxDQUFDSSxRQUFyRCxFQUErREosQ0FBQyxDQUFDSyxRQUFqRSxDQUFWO0FBQ0E7O0FBQ0osZUFBS3JDLGdCQUFVc0IsVUFBZjtBQUNJd0IsWUFBQUEsY0FBYyxDQUFDLEtBQUs5QixRQUFOLEVBQWdCLEtBQUt3QixNQUFyQixFQUE2QixLQUFLQyxlQUFsQyxFQUFtRFQsQ0FBQyxDQUFDSSxRQUFyRCxFQUErREosQ0FBQyxDQUFDSyxRQUFqRSxDQUFkO0FBQ0E7O0FBQ0o7QUFDSVUsWUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsS0FBS2YsU0FBTCxHQUFpQiw2Q0FBOUI7QUFqQlI7O0FBbUJBLFlBQUksS0FBS2dCLG9CQUFMLEdBQTRCLENBQWhDLEVBQW1DO0FBQy9CakIsVUFBQUEsQ0FBQyxDQUFDSSxRQUFGLENBQVdjLENBQVgsSUFBZ0IseUJBQVksQ0FBQyxLQUFLRCxvQkFBbEIsRUFBd0MsS0FBS0Esb0JBQTdDLENBQWhCO0FBQ0FqQixVQUFBQSxDQUFDLENBQUNJLFFBQUYsQ0FBV2UsQ0FBWCxJQUFnQix5QkFBWSxDQUFDLEtBQUtGLG9CQUFsQixFQUF3QyxLQUFLQSxvQkFBN0MsQ0FBaEI7QUFDQWpCLFVBQUFBLENBQUMsQ0FBQ0ksUUFBRixDQUFXZ0IsQ0FBWCxJQUFnQix5QkFBWSxDQUFDLEtBQUtILG9CQUFsQixFQUF3QyxLQUFLQSxvQkFBN0MsQ0FBaEI7QUFDSDs7QUFDRHRELHFCQUFLMEQsYUFBTCxDQUFtQnJCLENBQUMsQ0FBQ0ssUUFBckIsRUFBK0JMLENBQUMsQ0FBQ0ssUUFBakMsRUFBMkMsS0FBS2IsSUFBaEQ7O0FBQ0E3QixxQkFBSzJELGFBQUwsQ0FBbUJ0QixDQUFDLENBQUNJLFFBQXJCLEVBQStCSixDQUFDLENBQUNJLFFBQWpDLEVBQTJDLEtBQUtiLEdBQWhEOztBQUNBLFlBQUksS0FBS2dDLHdCQUFMLEdBQWdDLENBQXBDLEVBQXVDO0FBQ25DLGNBQU1DLFlBQVksR0FBRzdELGFBQUs4RCxTQUFMLENBQWUvRCxhQUFmLEVBQThCc0MsQ0FBQyxDQUFDSSxRQUFoQyxDQUFyQjs7QUFDQXpDLHVCQUFLK0QsSUFBTCxDQUFVMUIsQ0FBQyxDQUFDSyxRQUFaLEVBQXNCTCxDQUFDLENBQUNLLFFBQXhCLEVBQWtDbUIsWUFBbEMsRUFBZ0QsS0FBS0Qsd0JBQXJEO0FBQ0g7O0FBQ0QsYUFBSzdCLFFBQUwsR0FBZ0IsS0FBS0QsY0FBTCxDQUFxQk0sS0FBckM7QUFDSDs7O3FDQUV1QjtBQUNwQkYscUJBQUs4QixTQUFMLENBQWUsS0FBS25DLElBQXBCLEVBQTBCLEtBQUtqQixTQUFMLENBQWUyQyxDQUF6QyxFQUE0QyxLQUFLM0MsU0FBTCxDQUFlNEMsQ0FBM0QsRUFBOEQsS0FBSzVDLFNBQUwsQ0FBZTZDLENBQTdFOztBQUNBeEIscUJBQUtnQyxPQUFMLENBQWEsS0FBS3JDLEdBQWxCLEVBQXVCLEtBQUtDLElBQTVCLEVBQWtDLEtBQUtwQixTQUF2QyxFQUFrRCxLQUFLSSxNQUF2RDtBQUNIOzs7eUNBRTJCO0FBQ3hCLFlBQUksS0FBS3FELE9BQUwsS0FBaUIzRCxjQUFRNEQsTUFBN0IsRUFBcUM7QUFDakMsaUJBQU8seUJBQVksQ0FBWixFQUFlLEtBQUtyRCxJQUFwQixDQUFQO0FBQ0g7O0FBQ0QsWUFBSXNELEtBQUssR0FBRyxLQUFLcEMsVUFBTCxHQUFrQixJQUFJakIsSUFBSSxDQUFDc0QsRUFBVCxHQUFjLEtBQUtDLFFBQUwsQ0FBY0MsUUFBZCxDQUF1QixLQUFLekMsY0FBTCxDQUFxQk0sS0FBNUMsRUFBbUQsQ0FBbkQsQ0FBZCxJQUF3RSxLQUFLTixjQUFMLENBQXFCTSxLQUFyQixHQUE2QixLQUFLTCxRQUExRyxDQUE5QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JvQyxLQUFsQjs7QUFDQSxZQUFJLEtBQUtJLFNBQUwsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDdEJKLFVBQUFBLEtBQUssR0FBR3JELElBQUksQ0FBQzBELEtBQUwsQ0FBV0wsS0FBSyxJQUFJLEtBQUt0RCxJQUFMLEdBQVksS0FBSzBELFNBQXJCLENBQWhCLElBQW1ELEtBQUsxRCxJQUF4RCxHQUErRCxLQUFLMEQsU0FBNUU7QUFDSDs7QUFDRCxnQkFBUSxLQUFLTixPQUFiO0FBQ0ksZUFBSzNELGNBQVFtRSxJQUFiO0FBQ0ksbUJBQU8sb0JBQU9OLEtBQVAsRUFBYyxLQUFLdEQsSUFBbkIsQ0FBUDs7QUFDSixlQUFLUCxjQUFRb0UsUUFBYjtBQUNJLG1CQUFPLHNCQUFTUCxLQUFULEVBQWdCLEtBQUt0RCxJQUFyQixDQUFQO0FBSlI7QUFNSDs7OztvMUJBbFBBOEQsbUI7Ozs7O2FBQ2lCLEs7Ozs7Ozs7YUFtQkV2RSxnQkFBVW1CLEk7O3dQQWtDN0JvRCxtQjs7Ozs7YUFHaUJ0RSxtQkFBYWlCLE07O3VGQUs5QnFELG1COzs7OzthQUd5QixLOzs0RkFLekJBLG1COzs7OzthQUc4QixDOzsrRkFLOUJBLG1COzs7OzthQUdpQyxDOzsyRkFLakNBLG1COzs7OzthQUc2QixDOzs2RUFLN0JBLG1COzs7OzthQUdlLEM7O3NGQVFmQSxtQjs7Ozs7YUFHd0IsQzs7dUZBTXhCQSxtQjs7Ozs7YUFHZ0JyRSxjQUFRNEQsTTs7aUZBS3hCUyxtQjs7Ozs7YUFHa0IsQzs7d0ZBTWxCQSxtQjs7Ozs7YUFHaUIsSUFBSXBFLG1CQUFKLEU7OzhFQU1qQm9FLG1COzs7OzthQUdlLEM7O29GQUtmQSxtQjs7Ozs7YUFHcUIsSUFBSTVFLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQzs7aUZBRXJCNEUsbUI7Ozs7O2FBQ21CLElBQUk1RSxZQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLEM7O2lGQUVuQjRFLG1COzs7OzthQUNtQixJQUFJNUUsWUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDOzs4RUFFbkI0RSxtQjs7Ozs7YUFDZ0IsSUFBSTVFLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQzs7NEVBRWhCNEUsbUI7Ozs7O2FBQ2Msc0JBQVMsR0FBVCxDOzs4RUFFZEEsbUI7Ozs7O2FBQ2dCLHNCQUFTLEVBQVQsQzs7Ozs7QUErRXJCLFdBQVMxQixVQUFULENBQXFCN0IsUUFBckIsRUFBK0J3QixNQUEvQixFQUF1Q0MsZUFBdkMsRUFBd0QrQixHQUF4RCxFQUE2REMsR0FBN0QsRUFBa0U7QUFDOUQsWUFBUXpELFFBQVI7QUFDSSxXQUFLZixtQkFBYWlCLE1BQWxCO0FBQ0ksK0RBQXlCc0QsR0FBekIsRUFBOEJoQyxNQUFNLElBQUksSUFBSUMsZUFBUixDQUFwQyxFQUE4REQsTUFBOUQ7O0FBQ0E3QyxxQkFBSzhELFNBQUwsQ0FBZWdCLEdBQWYsRUFBb0JELEdBQXBCOztBQUNBOztBQUNKLFdBQUt2RSxtQkFBYXlFLEtBQWxCO0FBQ0ksdURBQWlCRixHQUFqQjs7QUFDQTdFLHFCQUFLZ0YsY0FBTCxDQUFvQkgsR0FBcEIsRUFBeUJBLEdBQXpCLEVBQThCaEMsTUFBOUI7O0FBQ0E3QyxxQkFBSzhELFNBQUwsQ0FBZWdCLEdBQWYsRUFBb0JELEdBQXBCOztBQUNBOztBQUNKO0FBQ0l6QixRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYWhDLFFBQVEsR0FBRyx1Q0FBeEI7QUFYUjtBQWFIOztBQUVELFdBQVM4QixjQUFULENBQXlCOUIsUUFBekIsRUFBbUN3QixNQUFuQyxFQUEyQ0MsZUFBM0MsRUFBNEQrQixHQUE1RCxFQUFpRUMsR0FBakUsRUFBc0U7QUFDbEUsWUFBUXpELFFBQVI7QUFDSSxXQUFLZixtQkFBYWlCLE1BQWxCO0FBQ0ksK0RBQXlCc0QsR0FBekIsRUFBOEJoQyxNQUFNLElBQUksSUFBSUMsZUFBUixDQUFwQyxFQUE4REQsTUFBOUQ7O0FBQ0EsWUFBSWdDLEdBQUcsQ0FBQ3BCLENBQUosR0FBUSxDQUFaLEVBQWU7QUFDWG9CLFVBQUFBLEdBQUcsQ0FBQ3BCLENBQUosSUFBUyxDQUFDLENBQVY7QUFDSDs7QUFDRHpELHFCQUFLOEQsU0FBTCxDQUFlZ0IsR0FBZixFQUFvQkQsR0FBcEI7O0FBQ0E7O0FBQ0osV0FBS3ZFLG1CQUFheUUsS0FBbEI7QUFDSSx1REFBaUJGLEdBQWpCOztBQUNBN0UscUJBQUtnRixjQUFMLENBQW9CSCxHQUFwQixFQUF5QkEsR0FBekIsRUFBOEJoQyxNQUE5Qjs7QUFDQSxZQUFJZ0MsR0FBRyxDQUFDcEIsQ0FBSixHQUFRLENBQVosRUFBZTtBQUNYb0IsVUFBQUEsR0FBRyxDQUFDcEIsQ0FBSixJQUFTLENBQUMsQ0FBVjtBQUNIOztBQUNEekQscUJBQUs4RCxTQUFMLENBQWVnQixHQUFmLEVBQW9CRCxHQUFwQjs7QUFDQTs7QUFDSjtBQUNJekIsUUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWFoQyxRQUFRLEdBQUcsMkNBQXhCO0FBakJSO0FBbUJIOztBQUVELFdBQVMyQixRQUFULENBQW1CM0IsUUFBbkIsRUFBNkJ3QixNQUE3QixFQUFxQ0MsZUFBckMsRUFBc0RtQyxLQUF0RCxFQUE2RGIsS0FBN0QsRUFBb0VuQixNQUFwRSxFQUE0RTRCLEdBQTVFLEVBQWlGQyxHQUFqRixFQUFzRjtBQUNsRixZQUFRekQsUUFBUjtBQUNJLFdBQUtmLG1CQUFhZ0IsSUFBbEI7QUFDSSwyRUFBcUN1RCxHQUFyQyxFQUEwQ2hDLE1BQU0sSUFBSSxJQUFJQyxlQUFSLENBQWhELEVBQTBFRCxNQUExRSxFQUFrRm9DLEtBQWxGOztBQUNBQyxxQkFBS0YsY0FBTCxDQUFvQkYsR0FBcEIsRUFBeUJELEdBQXpCLEVBQThCOUQsSUFBSSxDQUFDb0UsR0FBTCxDQUFTZixLQUFULENBQTlCOztBQUNBVSxRQUFBQSxHQUFHLENBQUNyQixDQUFKLEdBQVEsQ0FBQzFDLElBQUksQ0FBQ3FFLEdBQUwsQ0FBU2hCLEtBQVQsQ0FBRCxHQUFtQnZCLE1BQTNCOztBQUNBN0MscUJBQUs4RCxTQUFMLENBQWVnQixHQUFmLEVBQW9CQSxHQUFwQjs7QUFDQUQsUUFBQUEsR0FBRyxDQUFDcEIsQ0FBSixHQUFRLENBQVI7QUFDQTs7QUFDSixXQUFLbkQsbUJBQWF5RSxLQUFsQjtBQUNJLDREQUFzQkYsR0FBdEIsRUFBMkJJLEtBQTNCOztBQUNBQyxxQkFBS0YsY0FBTCxDQUFvQkYsR0FBcEIsRUFBeUJELEdBQXpCLEVBQThCOUQsSUFBSSxDQUFDb0UsR0FBTCxDQUFTZixLQUFULENBQTlCOztBQUNBVSxRQUFBQSxHQUFHLENBQUNyQixDQUFKLEdBQVEsQ0FBQzFDLElBQUksQ0FBQ3FFLEdBQUwsQ0FBU2hCLEtBQVQsQ0FBVDs7QUFDQXBFLHFCQUFLOEQsU0FBTCxDQUFlZ0IsR0FBZixFQUFvQkEsR0FBcEI7O0FBQ0FJLHFCQUFLRixjQUFMLENBQW9CSCxHQUFwQixFQUF5QkEsR0FBekIsRUFBOEJoQyxNQUE5Qjs7QUFDQWdDLFFBQUFBLEdBQUcsQ0FBQ3BCLENBQUosR0FBUSxDQUFSO0FBQ0E7O0FBQ0osV0FBS25ELG1CQUFhaUIsTUFBbEI7QUFDSSwyRUFBcUNzRCxHQUFyQyxFQUEwQ2hDLE1BQU0sSUFBSSxJQUFJQyxlQUFSLENBQWhELEVBQTBFRCxNQUExRSxFQUFrRm9DLEtBQWxGOztBQUNBQyxxQkFBS0YsY0FBTCxDQUFvQkYsR0FBcEIsRUFBeUJELEdBQXpCLEVBQThCOUQsSUFBSSxDQUFDb0UsR0FBTCxDQUFTZixLQUFULENBQTlCOztBQUNBVSxRQUFBQSxHQUFHLENBQUNyQixDQUFKLEdBQVEsQ0FBQzFDLElBQUksQ0FBQ3FFLEdBQUwsQ0FBU2hCLEtBQVQsQ0FBRCxHQUFtQnZCLE1BQTNCOztBQUNBN0MscUJBQUs4RCxTQUFMLENBQWVnQixHQUFmLEVBQW9CQSxHQUFwQjs7QUFDQUQsUUFBQUEsR0FBRyxDQUFDcEIsQ0FBSixHQUFRLENBQVI7O0FBQ0F6RCxxQkFBS3FGLEdBQUwsQ0FBU1IsR0FBVCxFQUFjQSxHQUFkLEVBQW1CN0UsYUFBS2dGLGNBQUwsQ0FBb0JqRixhQUFwQixFQUFtQytFLEdBQW5DLEVBQXdDN0IsTUFBTSxHQUFHLHFCQUFULEdBQW9CLENBQUM2QixHQUFHLENBQUNyQixDQUFqRSxDQUFuQjs7QUFDQTs7QUFDSjtBQUNJTCxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYWhDLFFBQVEsR0FBRyxxQ0FBeEI7QUF6QlI7QUEyQkg7O0FBRUQsV0FBU2tCLE9BQVQsQ0FBa0JsQixRQUFsQixFQUE0Qm1CLFlBQTVCLEVBQTBDcUMsR0FBMUMsRUFBK0NDLEdBQS9DLEVBQW9EO0FBQ2hELFlBQVF6RCxRQUFSO0FBQ0ksV0FBS2YsbUJBQWFpQixNQUFsQjtBQUNJLHdEQUFrQnNELEdBQWxCLEVBQXVCMUUsY0FBdkIsRUFESixDQUVJOztBQUNBOztBQUNKLFdBQUtHLG1CQUFheUUsS0FBbEI7QUFDSTlFLFFBQUFBLGFBQWEsQ0FBQ3FGLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0JyRixhQUFhLENBQUNnRCxNQUF0Qzs7QUFDQWhELFFBQUFBLGFBQWEsQ0FBQ3NGLElBQWQsQ0FBbUIseUJBQVksQ0FBQyxHQUFiLEVBQWtCLEdBQWxCLENBQW5COztBQUNBdEYsUUFBQUEsYUFBYSxDQUFDc0YsSUFBZCxDQUFtQix5QkFBWSxDQUFDLEdBQWIsRUFBa0IsR0FBbEIsQ0FBbkI7O0FBQ0F0RixRQUFBQSxhQUFhLENBQUNzRixJQUFkLENBQW1CLDZDQUFlLEdBQWxDOztBQUNBLHNEQUFnQnRGLGFBQWhCO0FBQ0F1RixRQUFBQSxpQkFBaUIsQ0FBQ3ZGLGFBQUQsRUFBZ0J1QyxZQUFoQixDQUFqQjs7QUFDQXhDLHFCQUFLeUYsR0FBTCxDQUFTWixHQUFULEVBQWM1RSxhQUFhLENBQUMsQ0FBRCxDQUEzQixFQUFnQ0EsYUFBYSxDQUFDLENBQUQsQ0FBN0MsRUFBa0RBLGFBQWEsQ0FBQyxDQUFELENBQS9EOztBQUNBOztBQUNKLFdBQUtLLG1CQUFhbUIsSUFBbEI7QUFDSXhCLFFBQUFBLGFBQWEsQ0FBQ3FGLE1BQWQsQ0FBcUIsQ0FBckIsRUFBd0JyRixhQUFhLENBQUNnRCxNQUF0Qzs7QUFDQWhELFFBQUFBLGFBQWEsQ0FBQ3NGLElBQWQsQ0FBbUIseUJBQVksQ0FBQyxHQUFiLEVBQWtCLEdBQWxCLENBQW5COztBQUNBdEYsUUFBQUEsYUFBYSxDQUFDc0YsSUFBZCxDQUFtQiw2Q0FBZSxHQUFsQzs7QUFDQXRGLFFBQUFBLGFBQWEsQ0FBQ3NGLElBQWQsQ0FBbUIsNkNBQWUsR0FBbEM7O0FBQ0Esc0RBQWdCdEYsYUFBaEI7QUFDQXVGLFFBQUFBLGlCQUFpQixDQUFDdkYsYUFBRCxFQUFnQnVDLFlBQWhCLENBQWpCOztBQUNBeEMscUJBQUt5RixHQUFMLENBQVNaLEdBQVQsRUFBYzVFLGFBQWEsQ0FBQyxDQUFELENBQTNCLEVBQWdDQSxhQUFhLENBQUMsQ0FBRCxDQUE3QyxFQUFrREEsYUFBYSxDQUFDLENBQUQsQ0FBL0Q7O0FBQ0E7O0FBQ0o7QUFDSW1ELFFBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhaEMsUUFBUSxHQUFHLG9DQUF4QjtBQXhCUjs7QUEwQkFyQixpQkFBSzBGLElBQUwsQ0FBVVosR0FBVixFQUFlYSwwQ0FBZjtBQUNIOztBQUVELFdBQVMvQyxVQUFULENBQXFCQyxNQUFyQixFQUE2QkMsZUFBN0IsRUFBOENtQyxLQUE5QyxFQUFxREosR0FBckQsRUFBMERDLEdBQTFELEVBQStEO0FBQzNELHVFQUFxQ0QsR0FBckMsRUFBMENoQyxNQUFNLElBQUksSUFBSUMsZUFBUixDQUFoRCxFQUEwRUQsTUFBMUUsRUFBa0ZvQyxLQUFsRjs7QUFDQWpGLGlCQUFLOEQsU0FBTCxDQUFlZ0IsR0FBZixFQUFvQkQsR0FBcEI7QUFDSDs7QUFFRCxXQUFTVyxpQkFBVCxDQUE0QlgsR0FBNUIsRUFBaUNlLFNBQWpDLEVBQTRDO0FBQ3hDLFFBQUlBLFNBQVMsQ0FBQ3JDLENBQVYsR0FBYyxDQUFsQixFQUFxQjtBQUNqQnNCLE1BQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsSUFBVSxNQUFNLHlCQUFZLENBQUNlLFNBQVMsQ0FBQ3JDLENBQXZCLEVBQTBCcUMsU0FBUyxDQUFDckMsQ0FBcEMsQ0FBaEI7QUFDQXNCLE1BQUFBLEdBQUcsQ0FBQyxDQUFELENBQUgsR0FBUyxtQkFBTUEsR0FBRyxDQUFDLENBQUQsQ0FBVCxFQUFjLENBQUMsR0FBZixFQUFvQixHQUFwQixDQUFUO0FBQ0g7O0FBQ0QsUUFBSWUsU0FBUyxDQUFDcEMsQ0FBVixHQUFjLENBQWxCLEVBQXFCO0FBQ2pCcUIsTUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxJQUFVLE1BQU0seUJBQVksQ0FBQ2UsU0FBUyxDQUFDcEMsQ0FBdkIsRUFBMEJvQyxTQUFTLENBQUNwQyxDQUFwQyxDQUFoQjtBQUNBcUIsTUFBQUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxHQUFTLG1CQUFNQSxHQUFHLENBQUMsQ0FBRCxDQUFULEVBQWMsQ0FBQyxHQUFmLEVBQW9CLEdBQXBCLENBQVQ7QUFDSDs7QUFDRCxRQUFJZSxTQUFTLENBQUNuQyxDQUFWLEdBQWMsQ0FBbEIsRUFBcUI7QUFDakJvQixNQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILElBQVUsTUFBTSx5QkFBWSxDQUFDZSxTQUFTLENBQUNuQyxDQUF2QixFQUEwQm1DLFNBQVMsQ0FBQ25DLENBQXBDLENBQWhCO0FBQ0FvQixNQUFBQSxHQUFHLENBQUMsQ0FBRCxDQUFILEdBQVMsbUJBQU1BLEdBQUcsQ0FBQyxDQUFELENBQVQsRUFBYyxDQUFDLEdBQWYsRUFBb0IsR0FBcEIsQ0FBVDtBQUNIO0FBQ0osRyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IHBhcnRpY2xlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgY2NjbGFzcywgdG9vbHRpcCwgZGlzcGxheU9yZGVyLCB0eXBlLCBmb3JtZXJseVNlcmlhbGl6ZWRBcywgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgTWF0NCwgUXVhdCwgVmVjMiwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGNsYW1wLCBwaW5nUG9uZywgcmFuZG9tLCByYW5kb21SYW5nZSwgcmVwZWF0LCB0b0RlZ3JlZSwgdG9SYWRpYW4gfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgQ3VydmVSYW5nZSBmcm9tICcuLi9hbmltYXRvci9jdXJ2ZS1yYW5nZSc7XHJcbmltcG9ydCB7IEFyY01vZGUsIEVtaXRMb2NhdGlvbiwgU2hhcGVUeXBlIH0gZnJvbSAnLi4vZW51bSc7XHJcbmltcG9ydCB7IGZpeGVkQW5nbGVVbml0VmVjdG9yMiwgcGFydGljbGVFbWl0WkF4aXMsIHJhbmRvbVBvaW50QmV0d2VlbkNpcmNsZUF0Rml4ZWRBbmdsZSwgcmFuZG9tUG9pbnRCZXR3ZWVuU3BoZXJlLFxyXG4gICAgcmFuZG9tUG9pbnRJbkN1YmUsIHJhbmRvbVNpZ24sIHJhbmRvbVNvcnRBcnJheSwgcmFuZG9tVW5pdFZlY3RvciB9IGZyb20gJy4uL3BhcnRpY2xlLWdlbmVyYWwtZnVuY3Rpb24nO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZVN5c3RlbSB9IGZyb20gJy4uL3BhcnRpY2xlLXN5c3RlbSc7XHJcblxyXG5jb25zdCBfaW50ZXJtZWRpVmVjID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbmNvbnN0IF9pbnRlcm1lZGlBcnIgPSBuZXcgQXJyYXkoKTtcclxuY29uc3QgX3VuaXRCb3hFeHRlbnQgPSBuZXcgVmVjMygwLjUsIDAuNSwgMC41KTtcclxuXHJcbkBjY2NsYXNzKCdjYy5TaGFwZU1vZHVsZScpXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNoYXBlTW9kdWxlIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDlj5HlsITlmajkvY3nva7jgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigxMylcclxuICAgIEB0b29sdGlwKCfnspLlrZDlj5HlsITlmajkvY3nva4nKVxyXG4gICAgZ2V0IHBvc2l0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9zaXRpb247XHJcbiAgICB9XHJcbiAgICBzZXQgcG9zaXRpb24gKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3Bvc2l0aW9uID0gdmFsO1xyXG4gICAgICAgIHRoaXMuY29uc3RydWN0TWF0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5Y+R5bCE5Zmo5peL6L2s6KeS5bqm44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoMTQpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Y+R5bCE5Zmo5peL6L2s6KeS5bqmJylcclxuICAgIGdldCByb3RhdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JvdGF0aW9uO1xyXG4gICAgfVxyXG4gICAgc2V0IHJvdGF0aW9uICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9yb3RhdGlvbiA9IHZhbDtcclxuICAgICAgICB0aGlzLmNvbnN0cnVjdE1hdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOWPkeWwhOWZqOe8qeaUvuavlOS+i+OAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDE1KVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOWPkeWwhOWZqOe8qeaUvuavlOS+iycpXHJcbiAgICBnZXQgc2NhbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcclxuICAgIH1cclxuICAgIHNldCBzY2FsZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc2NhbGUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RNYXQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDlj5HlsITlmajlnKjkuIDkuKrmiYflvaLojIPlm7TlhoXlj5HlsITjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig2KVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOWPkeWwhOWZqOWcqOS4gOS4quaJh+W9ouiMg+WbtOWGheWPkeWwhCcpXHJcbiAgICBnZXQgYXJjICgpIHtcclxuICAgICAgICByZXR1cm4gdG9EZWdyZWUodGhpcy5fYXJjKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYXJjICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9hcmMgPSB0b1JhZGlhbih2YWwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWchumUpeeahOi9tOS4juavjee6v+eahOWkueinkjxiZz7jgIJcclxuICAgICAqIOWGs+WumuWchumUpeWPkeWwhOWZqOeahOW8gOWQiOeoi+W6puOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDUpXHJcbiAgICBAdG9vbHRpcCgn5ZyG6ZSl55qE6L205LiO5q+N57q/55qE5aS56KeSXFxu5Yaz5a6a5ZyG6ZSl5Y+R5bCE5Zmo55qE5byA5ZCI56iL5bqmJylcclxuICAgIGdldCBhbmdsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGgucm91bmQodG9EZWdyZWUodGhpcy5fYW5nbGUpICogMTAwKSAvIDEwMDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgYW5nbGUgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2FuZ2xlID0gdG9SYWRpYW4odmFsKTtcclxuICAgIH1cclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9lbmFibGUgPSBmYWxzZTtcclxuICAgIC8qKlxyXG4gICAgICogQHpoIOaYr+WQpuWQr+eUqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDApXHJcbiAgICBwdWJsaWMgZ2V0IGVuYWJsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VuYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGVuYWJsZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOWPkeWwhOWZqOexu+WeiyBbW1NoYXBlVHlwZV1d44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFNoYXBlVHlwZSlcclxuICAgIEBmb3JtZXJseVNlcmlhbGl6ZWRBcygnc2hhcGVUeXBlJylcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIHB1YmxpYyBfc2hhcGVUeXBlID0gU2hhcGVUeXBlLkNvbmU7XHJcblxyXG4gICAgQHR5cGUoU2hhcGVUeXBlKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOWPkeWwhOWZqOexu+WeiycpXHJcbiAgICBwdWJsaWMgZ2V0IHNoYXBlVHlwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlVHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNoYXBlVHlwZSAodmFsKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcGVUeXBlID0gdmFsO1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5fc2hhcGVUeXBlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkJveDpcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVtaXRGcm9tID09PSBFbWl0TG9jYXRpb24uQmFzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW1pdEZyb20gPSBFbWl0TG9jYXRpb24uVm9sdW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU2hhcGVUeXBlLkNvbmU6XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbWl0RnJvbSA9PT0gRW1pdExvY2F0aW9uLkVkZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVtaXRGcm9tID0gRW1pdExvY2F0aW9uLkJhc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuU3BoZXJlOlxyXG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5IZW1pc3BoZXJlOlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW1pdEZyb20gPT09IEVtaXRMb2NhdGlvbi5CYXNlIHx8IHRoaXMuZW1pdEZyb20gPT09IEVtaXRMb2NhdGlvbi5FZGdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbWl0RnJvbSA9IEVtaXRMb2NhdGlvbi5Wb2x1bWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5LuO5Y+R5bCE5Zmo5ZOq5Liq6YOo5L2N5Y+R5bCEIFtbRW1pdExvY2F0aW9uXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRW1pdExvY2F0aW9uKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOS7juWPkeWwhOWZqOWTquS4qumDqOS9jeWPkeWwhCcpXHJcbiAgICBwdWJsaWMgZW1pdEZyb20gPSBFbWl0TG9jYXRpb24uVm9sdW1lO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOagueaNrueykuWtkOeahOWIneWni+aWueWQkeWGs+WumueykuWtkOeahOenu+WKqOaWueWQkeOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDE2KVxyXG4gICAgQHRvb2x0aXAoJ+agueaNrueykuWtkOeahOWIneWni+aWueWQkeWGs+WumueykuWtkOeahOenu+WKqOaWueWQkScpXHJcbiAgICBwdWJsaWMgYWxpZ25Ub0RpcmVjdGlvbiA9IGZhbHNlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOeUn+aIkOaWueWQkemaj+acuuiuvuWumuOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDE3KVxyXG4gICAgQHRvb2x0aXAoJ+eykuWtkOeUn+aIkOaWueWQkemaj+acuuiuvuWumicpXHJcbiAgICBwdWJsaWMgcmFuZG9tRGlyZWN0aW9uQW1vdW50ID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDooajnpLrlvZPliY3lj5HlsITmlrnlkJHkuI7lvZPliY3kvY3nva7liLDnu5PngrnkuK3lv4Pov57nur/mlrnlkJHnmoTmj5LlgLzjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigxOClcclxuICAgIEB0b29sdGlwKCfooajnpLrlvZPliY3lj5HlsITmlrnlkJHkuI7lvZPliY3kvY3nva7liLDnu5PngrnkuK3lv4Pov57nur/mlrnlkJHnmoTmj5LlgLwnKVxyXG4gICAgcHVibGljIHNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q55Sf5oiQ5L2N572u6ZqP5py66K6+5a6a77yI6K6+5a6a5q2k5YC85Li66Z2eIDAg5Lya5L2/57KS5a2Q55Sf5oiQ5L2N572u6LaF5Ye655Sf5oiQ5Zmo5aSn5bCP6IyD5Zu077yJ44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTkpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q55Sf5oiQ5L2N572u6ZqP5py66K6+5a6a77yI6K6+5a6a5q2k5YC85Li66Z2eIDAg5Lya5L2/57KS5a2Q55Sf5oiQ5L2N572u6LaF5Ye655Sf5oiQ5Zmo5aSn5bCP6IyD5Zu077yJJylcclxuICAgIHB1YmxpYyByYW5kb21Qb3NpdGlvbkFtb3VudCA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5Y+R5bCE5Zmo5Y2K5b6E44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMylcclxuICAgIEB0b29sdGlwKCfnspLlrZDlj5HlsITlmajljYrlvoQnKVxyXG4gICAgcHVibGljIHJhZGl1cyA9IDE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg57KS5a2Q5Y+R5bCE5Zmo5Y+R5bCE5L2N572u77yI5a+5IEJveCDnsbvlnovnmoTlj5HlsITlmajml6DmlYjvvInvvJo8Ymc+XHJcbiAgICAgKiAtIDAg6KGo56S65LuO6KGo6Z2i5Y+R5bCE77ybXHJcbiAgICAgKiAtIDEg6KGo56S65LuO5Lit5b+D5Y+R5bCE77ybXHJcbiAgICAgKiAtIDAgfiAxIOS5i+mXtOihqOekuuWcqOS4reW/g+WIsOihqOmdouS5i+mXtOWPkeWwhOOAglxyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDQpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Y+R5bCE5Zmo5Y+R5bCE5L2N572u77yI5a+5IEJveCDnsbvlnovnmoTlj5HlsITlmajml6DmlYjvvIk6XFxuIC0gMCDooajnpLrku47ooajpnaLlj5HlsITvvJtcXG4gLSAxIOihqOekuuS7juS4reW/g+WPkeWwhO+8m1xcbiAtIDAgfiAxIOS5i+mXtOihqOekuuWcqOS4reW/g+WIsOihqOmdouS5i+mXtOWPkeWwhOOAgicpXHJcbiAgICBwdWJsaWMgcmFkaXVzVGhpY2tuZXNzID0gMTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDlnKjmiYflvaLojIPlm7TlhoXnmoTlj5HlsITmlrnlvI8gW1tBcmNNb2RlXV3jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQXJjTW9kZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoNylcclxuICAgIEB0b29sdGlwKCfnspLlrZDlnKjmiYflvaLojIPlm7TlhoXnmoTlj5HlsITmlrnlvI8nKVxyXG4gICAgcHVibGljIGFyY01vZGUgPSBBcmNNb2RlLlJhbmRvbTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmjqfliLblj6/og73kuqfnlJ/nspLlrZDnmoTlvKflkajlm7TnmoTnprvmlaPpl7TpmpTjgIJcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcig5KVxyXG4gICAgQHRvb2x0aXAoJ+aOp+WItuWPr+iDveS6p+eUn+eykuWtkOeahOW8p+WRqOWbtOeahOemu+aVo+mXtOmalCcpXHJcbiAgICBwdWJsaWMgYXJjU3ByZWFkID0gMDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDnspLlrZDmsr/lnIblkajlj5HlsITnmoTpgJ/luqbjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoQ3VydmVSYW5nZSlcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTApXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5rK/5ZyG5ZGo5Y+R5bCE55qE6YCf5bqmJylcclxuICAgIHB1YmxpYyBhcmNTcGVlZCA9IG5ldyBDdXJ2ZVJhbmdlKCk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5ZyG6ZSl6aG26YOo5oiq6Z2i6Led56a75bqV6YOo55qE6L206ZW/PGJnPuOAglxyXG4gICAgICog5Yaz5a6a5ZyG6ZSl5Y+R5bCE5Zmo55qE6auY5bqm44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTEpXHJcbiAgICBAdG9vbHRpcCgn5ZyG6ZSl6aG26YOo5oiq6Z2i6Led56a75bqV6YOo55qE6L206ZW/XFxu5Yaz5a6a5ZyG6ZSl5Y+R5bCE5Zmo55qE6auY5bqmJylcclxuICAgIHB1YmxpYyBsZW5ndGggPSA1O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOeykuWtkOWPkeWwhOWZqOWPkeWwhOS9jee9ru+8iOmSiOWvuSBCb3gg57G75Z6L55qE57KS5a2Q5Y+R5bCE5Zmo77yJ44CCXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNwbGF5T3JkZXIoMTIpXHJcbiAgICBAdG9vbHRpcCgn57KS5a2Q5Y+R5bCE5Zmo5Y+R5bCE5L2N572u77yI6ZKI5a+5IEJveCDnsbvlnovnmoTnspLlrZDlj5HlsITlmajvvIknKVxyXG4gICAgcHVibGljIGJveFRoaWNrbmVzcyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX3Bvc2l0aW9uID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfcm90YXRpb24gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcml2YXRlIF9zY2FsZSA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2FyYyA9IHRvUmFkaWFuKDM2MCk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfYW5nbGUgPSB0b1JhZGlhbigyNSk7XHJcblxyXG4gICAgcHJpdmF0ZSBtYXQ6IE1hdDQ7XHJcbiAgICBwcml2YXRlIHF1YXQ6IFF1YXQ7XHJcbiAgICBwcml2YXRlIHBhcnRpY2xlU3lzdGVtOiBhbnk7XHJcbiAgICBwcml2YXRlIGxhc3RUaW1lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIHRvdGFsQW5nbGU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5tYXQgPSBuZXcgTWF0NCgpO1xyXG4gICAgICAgIHRoaXMucXVhdCA9IG5ldyBRdWF0KCk7XHJcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVN5c3RlbSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IDA7XHJcbiAgICAgICAgdGhpcy50b3RhbEFuZ2xlID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Jbml0IChwczogUGFydGljbGVTeXN0ZW0pIHtcclxuICAgICAgICB0aGlzLnBhcnRpY2xlU3lzdGVtID0gcHM7XHJcbiAgICAgICAgdGhpcy5jb25zdHJ1Y3RNYXQoKTtcclxuICAgICAgICB0aGlzLmxhc3RUaW1lID0gdGhpcy5wYXJ0aWNsZVN5c3RlbS5fdGltZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW1pdCAocCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5zaGFwZVR5cGUpIHtcclxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuQm94OlxyXG4gICAgICAgICAgICAgICAgYm94RW1pdCh0aGlzLmVtaXRGcm9tLCB0aGlzLmJveFRoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuQ2lyY2xlOlxyXG4gICAgICAgICAgICAgICAgY2lyY2xlRW1pdCh0aGlzLnJhZGl1cywgdGhpcy5yYWRpdXNUaGlja25lc3MsIHRoaXMuZ2VuZXJhdGVBcmNBbmdsZSgpLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5Db25lOlxyXG4gICAgICAgICAgICAgICAgY29uZUVtaXQodGhpcy5lbWl0RnJvbSwgdGhpcy5yYWRpdXMsIHRoaXMucmFkaXVzVGhpY2tuZXNzLCB0aGlzLmdlbmVyYXRlQXJjQW5nbGUoKSwgdGhpcy5fYW5nbGUsIHRoaXMubGVuZ3RoLCBwLnBvc2l0aW9uLCBwLnZlbG9jaXR5KTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIFNoYXBlVHlwZS5TcGhlcmU6XHJcbiAgICAgICAgICAgICAgICBzcGhlcmVFbWl0KHRoaXMuZW1pdEZyb20sIHRoaXMucmFkaXVzLCB0aGlzLnJhZGl1c1RoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTaGFwZVR5cGUuSGVtaXNwaGVyZTpcclxuICAgICAgICAgICAgICAgIGhlbWlzcGhlcmVFbWl0KHRoaXMuZW1pdEZyb20sIHRoaXMucmFkaXVzLCB0aGlzLnJhZGl1c1RoaWNrbmVzcywgcC5wb3NpdGlvbiwgcC52ZWxvY2l0eSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUud2Fybih0aGlzLnNoYXBlVHlwZSArICcgc2hhcGVUeXBlIGlzIG5vdCBzdXBwb3J0ZWQgYnkgU2hhcGVNb2R1bGUuJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnJhbmRvbVBvc2l0aW9uQW1vdW50ID4gMCkge1xyXG4gICAgICAgICAgICBwLnBvc2l0aW9uLnggKz0gcmFuZG9tUmFuZ2UoLXRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQsIHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQpO1xyXG4gICAgICAgICAgICBwLnBvc2l0aW9uLnkgKz0gcmFuZG9tUmFuZ2UoLXRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQsIHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQpO1xyXG4gICAgICAgICAgICBwLnBvc2l0aW9uLnogKz0gcmFuZG9tUmFuZ2UoLXRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQsIHRoaXMucmFuZG9tUG9zaXRpb25BbW91bnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQocC52ZWxvY2l0eSwgcC52ZWxvY2l0eSwgdGhpcy5xdWF0KTtcclxuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQocC5wb3NpdGlvbiwgcC5wb3NpdGlvbiwgdGhpcy5tYXQpO1xyXG4gICAgICAgIGlmICh0aGlzLnNwaGVyaWNhbERpcmVjdGlvbkFtb3VudCA+IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc3BoZXJpY2FsVmVsID0gVmVjMy5ub3JtYWxpemUoX2ludGVybWVkaVZlYywgcC5wb3NpdGlvbik7XHJcbiAgICAgICAgICAgIFZlYzMubGVycChwLnZlbG9jaXR5LCBwLnZlbG9jaXR5LCBzcGhlcmljYWxWZWwsIHRoaXMuc3BoZXJpY2FsRGlyZWN0aW9uQW1vdW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5sYXN0VGltZSA9IHRoaXMucGFydGljbGVTeXN0ZW0hLl90aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0TWF0ICgpIHtcclxuICAgICAgICBRdWF0LmZyb21FdWxlcih0aGlzLnF1YXQsIHRoaXMuX3JvdGF0aW9uLngsIHRoaXMuX3JvdGF0aW9uLnksIHRoaXMuX3JvdGF0aW9uLnopO1xyXG4gICAgICAgIE1hdDQuZnJvbVJUUyh0aGlzLm1hdCwgdGhpcy5xdWF0LCB0aGlzLl9wb3NpdGlvbiwgdGhpcy5fc2NhbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2VuZXJhdGVBcmNBbmdsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXJjTW9kZSA9PT0gQXJjTW9kZS5SYW5kb20pIHtcclxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbVJhbmdlKDAsIHRoaXMuX2FyYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBhbmdsZSA9IHRoaXMudG90YWxBbmdsZSArIDIgKiBNYXRoLlBJICogdGhpcy5hcmNTcGVlZC5ldmFsdWF0ZSh0aGlzLnBhcnRpY2xlU3lzdGVtIS5fdGltZSwgMSkhICogKHRoaXMucGFydGljbGVTeXN0ZW0hLl90aW1lIC0gdGhpcy5sYXN0VGltZSk7XHJcbiAgICAgICAgdGhpcy50b3RhbEFuZ2xlID0gYW5nbGU7XHJcbiAgICAgICAgaWYgKHRoaXMuYXJjU3ByZWFkICE9PSAwKSB7XHJcbiAgICAgICAgICAgIGFuZ2xlID0gTWF0aC5mbG9vcihhbmdsZSAvICh0aGlzLl9hcmMgKiB0aGlzLmFyY1NwcmVhZCkpICogdGhpcy5fYXJjICogdGhpcy5hcmNTcHJlYWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN3aXRjaCAodGhpcy5hcmNNb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQXJjTW9kZS5Mb29wOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlcGVhdChhbmdsZSwgdGhpcy5fYXJjKTtcclxuICAgICAgICAgICAgY2FzZSBBcmNNb2RlLlBpbmdQb25nOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBpbmdQb25nKGFuZ2xlLCB0aGlzLl9hcmMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gc3BoZXJlRW1pdCAoZW1pdEZyb20sIHJhZGl1cywgcmFkaXVzVGhpY2tuZXNzLCBwb3MsIGRpcikge1xyXG4gICAgc3dpdGNoIChlbWl0RnJvbSkge1xyXG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlZvbHVtZTpcclxuICAgICAgICAgICAgcmFuZG9tUG9pbnRCZXR3ZWVuU3BoZXJlKHBvcywgcmFkaXVzICogKDEgLSByYWRpdXNUaGlja25lc3MpLCByYWRpdXMpO1xyXG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIHBvcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLlNoZWxsOlxyXG4gICAgICAgICAgICByYW5kb21Vbml0VmVjdG9yKHBvcyk7XHJcbiAgICAgICAgICAgIFZlYzMubXVsdGlwbHlTY2FsYXIocG9zLCBwb3MsIHJhZGl1cyk7XHJcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgcG9zKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBzcGhlcmUgZW1pdHRlci4nKTtcclxuICAgIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGVtaXNwaGVyZUVtaXQgKGVtaXRGcm9tLCByYWRpdXMsIHJhZGl1c1RoaWNrbmVzcywgcG9zLCBkaXIpIHtcclxuICAgIHN3aXRjaCAoZW1pdEZyb20pIHtcclxuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5Wb2x1bWU6XHJcbiAgICAgICAgICAgIHJhbmRvbVBvaW50QmV0d2VlblNwaGVyZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzKTtcclxuICAgICAgICAgICAgaWYgKHBvcy56ID4gMCkge1xyXG4gICAgICAgICAgICAgICAgcG9zLnogKj0gLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoZGlyLCBwb3MpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5TaGVsbDpcclxuICAgICAgICAgICAgcmFuZG9tVW5pdFZlY3Rvcihwb3MpO1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKHBvcywgcG9zLCByYWRpdXMpO1xyXG4gICAgICAgICAgICBpZiAocG9zLnogPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MueiAqPSAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBWZWMzLm5vcm1hbGl6ZShkaXIsIHBvcyk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihlbWl0RnJvbSArICcgaXMgbm90IHN1cHBvcnRlZCBmb3IgaGVtaXNwaGVyZSBlbWl0dGVyLicpO1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjb25lRW1pdCAoZW1pdEZyb20sIHJhZGl1cywgcmFkaXVzVGhpY2tuZXNzLCB0aGV0YSwgYW5nbGUsIGxlbmd0aCwgcG9zLCBkaXIpIHtcclxuICAgIHN3aXRjaCAoZW1pdEZyb20pIHtcclxuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5CYXNlOlxyXG4gICAgICAgICAgICByYW5kb21Qb2ludEJldHdlZW5DaXJjbGVBdEZpeGVkQW5nbGUocG9zLCByYWRpdXMgKiAoMSAtIHJhZGl1c1RoaWNrbmVzcyksIHJhZGl1cywgdGhldGEpO1xyXG4gICAgICAgICAgICBWZWMyLm11bHRpcGx5U2NhbGFyKGRpciwgcG9zLCBNYXRoLnNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICBkaXIueiA9IC1NYXRoLmNvcyhhbmdsZSkgKiByYWRpdXM7XHJcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgZGlyKTtcclxuICAgICAgICAgICAgcG9zLnogPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5TaGVsbDpcclxuICAgICAgICAgICAgZml4ZWRBbmdsZVVuaXRWZWN0b3IyKHBvcywgdGhldGEpO1xyXG4gICAgICAgICAgICBWZWMyLm11bHRpcGx5U2NhbGFyKGRpciwgcG9zLCBNYXRoLnNpbihhbmdsZSkpO1xyXG4gICAgICAgICAgICBkaXIueiA9IC1NYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgICAgIFZlYzMubm9ybWFsaXplKGRpciwgZGlyKTtcclxuICAgICAgICAgICAgVmVjMi5tdWx0aXBseVNjYWxhcihwb3MsIHBvcywgcmFkaXVzKTtcclxuICAgICAgICAgICAgcG9zLnogPSAwO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIEVtaXRMb2NhdGlvbi5Wb2x1bWU6XHJcbiAgICAgICAgICAgIHJhbmRvbVBvaW50QmV0d2VlbkNpcmNsZUF0Rml4ZWRBbmdsZShwb3MsIHJhZGl1cyAqICgxIC0gcmFkaXVzVGhpY2tuZXNzKSwgcmFkaXVzLCB0aGV0YSk7XHJcbiAgICAgICAgICAgIFZlYzIubXVsdGlwbHlTY2FsYXIoZGlyLCBwb3MsIE1hdGguc2luKGFuZ2xlKSk7XHJcbiAgICAgICAgICAgIGRpci56ID0gLU1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cztcclxuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUoZGlyLCBkaXIpO1xyXG4gICAgICAgICAgICBwb3MueiA9IDA7XHJcbiAgICAgICAgICAgIFZlYzMuYWRkKHBvcywgcG9zLCBWZWMzLm11bHRpcGx5U2NhbGFyKF9pbnRlcm1lZGlWZWMsIGRpciwgbGVuZ3RoICogcmFuZG9tKCkgLyAtZGlyLnopKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBjb25lIGVtaXR0ZXIuJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGJveEVtaXQgKGVtaXRGcm9tLCBib3hUaGlja25lc3MsIHBvcywgZGlyKSB7XHJcbiAgICBzd2l0Y2ggKGVtaXRGcm9tKSB7XHJcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uVm9sdW1lOlxyXG4gICAgICAgICAgICByYW5kb21Qb2ludEluQ3ViZShwb3MsIF91bml0Qm94RXh0ZW50KTtcclxuICAgICAgICAgICAgLy8gcmFuZG9tUG9pbnRCZXR3ZWVuQ3ViZShwb3MsIHZlYzMubXVsdGlwbHkoX2ludGVybWVkaVZlYywgX3VuaXRCb3hFeHRlbnQsIGJveFRoaWNrbmVzcyksIF91bml0Qm94RXh0ZW50KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSBFbWl0TG9jYXRpb24uU2hlbGw6XHJcbiAgICAgICAgICAgIF9pbnRlcm1lZGlBcnIuc3BsaWNlKDAsIF9pbnRlcm1lZGlBcnIubGVuZ3RoKTtcclxuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVJhbmdlKC0wLjUsIDAuNSkpO1xyXG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tUmFuZ2UoLTAuNSwgMC41KSk7XHJcbiAgICAgICAgICAgIF9pbnRlcm1lZGlBcnIucHVzaChyYW5kb21TaWduKCkgKiAwLjUpO1xyXG4gICAgICAgICAgICByYW5kb21Tb3J0QXJyYXkoX2ludGVybWVkaUFycik7XHJcbiAgICAgICAgICAgIGFwcGx5Qm94VGhpY2tuZXNzKF9pbnRlcm1lZGlBcnIsIGJveFRoaWNrbmVzcyk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHBvcywgX2ludGVybWVkaUFyclswXSwgX2ludGVybWVkaUFyclsxXSwgX2ludGVybWVkaUFyclsyXSk7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgRW1pdExvY2F0aW9uLkVkZ2U6XHJcbiAgICAgICAgICAgIF9pbnRlcm1lZGlBcnIuc3BsaWNlKDAsIF9pbnRlcm1lZGlBcnIubGVuZ3RoKTtcclxuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVJhbmdlKC0wLjUsIDAuNSkpO1xyXG4gICAgICAgICAgICBfaW50ZXJtZWRpQXJyLnB1c2gocmFuZG9tU2lnbigpICogMC41KTtcclxuICAgICAgICAgICAgX2ludGVybWVkaUFyci5wdXNoKHJhbmRvbVNpZ24oKSAqIDAuNSk7XHJcbiAgICAgICAgICAgIHJhbmRvbVNvcnRBcnJheShfaW50ZXJtZWRpQXJyKTtcclxuICAgICAgICAgICAgYXBwbHlCb3hUaGlja25lc3MoX2ludGVybWVkaUFyciwgYm94VGhpY2tuZXNzKTtcclxuICAgICAgICAgICAgVmVjMy5zZXQocG9zLCBfaW50ZXJtZWRpQXJyWzBdLCBfaW50ZXJtZWRpQXJyWzFdLCBfaW50ZXJtZWRpQXJyWzJdKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVtaXRGcm9tICsgJyBpcyBub3Qgc3VwcG9ydGVkIGZvciBib3ggZW1pdHRlci4nKTtcclxuICAgIH1cclxuICAgIFZlYzMuY29weShkaXIsIHBhcnRpY2xlRW1pdFpBeGlzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2lyY2xlRW1pdCAocmFkaXVzLCByYWRpdXNUaGlja25lc3MsIHRoZXRhLCBwb3MsIGRpcikge1xyXG4gICAgcmFuZG9tUG9pbnRCZXR3ZWVuQ2lyY2xlQXRGaXhlZEFuZ2xlKHBvcywgcmFkaXVzICogKDEgLSByYWRpdXNUaGlja25lc3MpLCByYWRpdXMsIHRoZXRhKTtcclxuICAgIFZlYzMubm9ybWFsaXplKGRpciwgcG9zKTtcclxufVxyXG5cclxuZnVuY3Rpb24gYXBwbHlCb3hUaGlja25lc3MgKHBvcywgdGhpY2tuZXNzKSB7XHJcbiAgICBpZiAodGhpY2tuZXNzLnggPiAwKSB7XHJcbiAgICAgICAgcG9zWzBdICs9IDAuNSAqIHJhbmRvbVJhbmdlKC10aGlja25lc3MueCwgdGhpY2tuZXNzLngpO1xyXG4gICAgICAgIHBvc1swXSA9IGNsYW1wKHBvc1swXSwgLTAuNSwgMC41KTtcclxuICAgIH1cclxuICAgIGlmICh0aGlja25lc3MueSA+IDApIHtcclxuICAgICAgICBwb3NbMV0gKz0gMC41ICogcmFuZG9tUmFuZ2UoLXRoaWNrbmVzcy55LCB0aGlja25lc3MueSk7XHJcbiAgICAgICAgcG9zWzFdID0gY2xhbXAocG9zWzFdLCAtMC41LCAwLjUpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaWNrbmVzcy56ID4gMCkge1xyXG4gICAgICAgIHBvc1syXSArPSAwLjUgKiByYW5kb21SYW5nZSgtdGhpY2tuZXNzLnosIHRoaWNrbmVzcy56KTtcclxuICAgICAgICBwb3NbMl0gPSBjbGFtcChwb3NbMl0sIC0wLjUsIDAuNSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIENDQ2xhc3MuZmFzdERlZmluZSgnY2MuU2hhcGVNb2R1bGUnLCBTaGFwZU1vZHVsZSwge1xyXG4vLyAgICAgZW5hYmxlOiBmYWxzZSxcclxuLy8gICAgIHNoYXBlVHlwZTogU2hhcGVUeXBlLkJveCxcclxuLy8gICAgIGVtaXRGcm9tOiBFbWl0TG9jYXRpb24uQmFzZSxcclxuLy8gICAgIF9wb3NpdGlvbjogbmV3IFZlYzMoMCwgMCwgMCksXHJcbi8vICAgICBfcm90YXRpb246IG5ldyBWZWMzKDAsIDAsIDApLFxyXG4vLyAgICAgX3NjYWxlOiBuZXcgVmVjMygwLCAwLCAwKSxcclxuLy8gICAgIGFsaWduVG9EaXJlY3Rpb246IGZhbHNlLFxyXG4vLyAgICAgcmFuZG9tRGlyZWN0aW9uQW1vdW50OiAwLFxyXG4vLyAgICAgc3BoZXJpY2FsRGlyZWN0aW9uQW1vdW50OiAwLFxyXG4vLyAgICAgcmFuZG9tUG9zaXRpb25BbW91bnQ6IDAsXHJcbi8vICAgICByYWRpdXM6IDAsXHJcbi8vICAgICByYWRpdXNUaGlja25lc3M6IDEsXHJcbi8vICAgICBhcmM6IDAsXHJcbi8vICAgICBhcmNNb2RlOiBBcmNNb2RlLlJhbmRvbSxcclxuLy8gICAgIGFyY1NwcmVhZDogMCxcclxuLy8gICAgIGFyY1NwZWVkOiBudWxsLFxyXG4vLyAgICAgYW5nbGU6IDAsXHJcbi8vICAgICBsZW5ndGg6IDAsXHJcbi8vICAgICBib3hUaGlja25lc3M6IG5ldyBWZWMzKDAsIDAsIDApXHJcbi8vIH0pO1xyXG4iXX0=