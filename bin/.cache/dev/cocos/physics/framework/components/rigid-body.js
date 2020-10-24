(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../core/data/decorators/index.js", "../../../core/math/index.js", "../../../core/index.js", "../instance.js", "../../../core/default-constants.js", "../physics-enum.js", "../physics-system.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../core/data/decorators/index.js"), require("../../../core/math/index.js"), require("../../../core/index.js"), require("../instance.js"), require("../../../core/default-constants.js"), require("../physics-enum.js"), require("../physics-system.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.instance, global.defaultConstants, global.physicsEnum, global.physicsSystem);
    global.rigidBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _instance, _defaultConstants, _physicsEnum, _physicsSystem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RigidBody = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _class3, _temp;

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

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Rigid body component.
   * @zh
   * 刚体组件。
   */
  var RigidBody = (_dec = (0, _index.ccclass)('cc.RigidBody'), _dec2 = (0, _index.help)('i18n:cc.RigidBody'), _dec3 = (0, _index.menu)('Physics/RigidBody'), _dec4 = (0, _index.executionOrder)(-1), _dec5 = (0, _index.type)(_physicsSystem.PhysicsSystem.PhysicsGroup), _dec6 = (0, _index.displayOrder)(-2), _dec7 = (0, _index.tooltip)('设置分组'), _dec8 = (0, _index.displayOrder)(0), _dec9 = (0, _index.tooltip)('刚体的质量'), _dec10 = (0, _index.displayOrder)(0.5), _dec11 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec12 = (0, _index.tooltip)('是否允许休眠'), _dec13 = (0, _index.displayOrder)(1), _dec14 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec15 = (0, _index.tooltip)('线性阻尼'), _dec16 = (0, _index.displayOrder)(2), _dec17 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec18 = (0, _index.tooltip)('旋转阻尼'), _dec19 = (0, _index.displayOrder)(3), _dec20 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec21 = (0, _index.tooltip)('刚体是否由物理系统控制运动'), _dec22 = (0, _index.displayOrder)(4), _dec23 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec24 = (0, _index.tooltip)('刚体是否使用重力'), _dec25 = (0, _index.displayOrder)(5), _dec26 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec27 = (0, _index.tooltip)('刚体是否固定旋转'), _dec28 = (0, _index.displayOrder)(6), _dec29 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec30 = (0, _index.tooltip)('线性速度的因子，可以用来控制每个轴方向上的速度的缩放'), _dec31 = (0, _index.displayOrder)(7), _dec32 = (0, _index.visible)(function () {
    return this._mass != 0;
  }), _dec33 = (0, _index.tooltip)('旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放'), _dec(_class = _dec2(_class = _dec3(_class = (0, _index.executeInEditMode)(_class = (0, _index.disallowMultiple)(_class = _dec4(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Component) {
    _inherits(RigidBody, _Component);

    function RigidBody() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, RigidBody);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(RigidBody)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._body = null;

      _initializerDefineProperty(_this, "_group", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mass", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_allowSleep", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_linearDamping", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_angularDamping", _descriptor5, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_fixedRotation", _descriptor6, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isKinematic", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_useGravity", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_linearFactor", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_angularFactor", _descriptor10, _assertThisInitialized(_this));

      return _this;
    }

    _createClass(RigidBody, [{
      key: "onLoad",
      /// COMPONENT LIFECYCLE ///
      value: function onLoad() {
        if (!_defaultConstants.EDITOR) {
          this._body = (0, _instance.createRigidBody)();

          this._body.initialize(this);
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._body) {
          this._body.onEnable();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._body) {
          this._body.onDisable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._body) {
          this._body.onDestroy();
        }
      } /// PUBLIC METHOD ///

      /**
       * @en
       * Apply force to a world point. This could, for example, be a point on the Body surface.
       * @zh
       * 在世界空间中，相对于刚体的质心的某点上对刚体施加作用力。
       * @param force - 作用力
       * @param relativePoint - 作用点，相对于刚体的质心
       */

    }, {
      key: "applyForce",
      value: function applyForce(force, relativePoint) {
        if (this._assertOnLoadCalled) {
          this._body.applyForce(force, relativePoint);
        }
      }
      /**
       * @en
       * Apply force to a local point. This could, for example, be a point on the Body surface.
       * @zh
       * 在本地空间中，相对于刚体的质心的某点上对刚体施加作用力。
       * @param force - 作用力
       * @param localPoint - 作用点
       */

    }, {
      key: "applyLocalForce",
      value: function applyLocalForce(force, localPoint) {
        if (this._assertOnLoadCalled) {
          this._body.applyLocalForce(force, localPoint);
        }
      }
      /**
       * @en
       * In world space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
       * @zh
       * 在世界空间中，相对于刚体的质心的某点上对刚体施加冲量。
       * @param impulse - 冲量
       * @param relativePoint - 作用点，相对于刚体的中心点
       */

    }, {
      key: "applyImpulse",
      value: function applyImpulse(impulse, relativePoint) {
        if (this._assertOnLoadCalled) {
          this._body.applyImpulse(impulse, relativePoint);
        }
      }
      /**
       * @en
       * In local space, impulse is applied to the rigid body at some point relative to the center of mass of the rigid body.
       * @zh
       * 在本地空间中，相对于刚体的质心的某点上对刚体施加冲量。
       * @param impulse - 冲量
       * @param localPoint - 作用点
       */

    }, {
      key: "applyLocalImpulse",
      value: function applyLocalImpulse(impulse, localPoint) {
        if (this._assertOnLoadCalled) {
          this._body.applyLocalImpulse(impulse, localPoint);
        }
      }
      /**
       * @en
       * In world space, torque is applied to the rigid body.
       * @zh
       * 在世界空间中，对刚体施加扭矩。
       * @param torque - 扭矩
       */

    }, {
      key: "applyTorque",
      value: function applyTorque(torque) {
        if (this._assertOnLoadCalled) {
          this._body.applyTorque(torque);
        }
      }
      /**
       * @zh
       * 在本地空间中，对刚体施加扭矩。
       * @param torque - 扭矩
       */

    }, {
      key: "applyLocalTorque",
      value: function applyLocalTorque(torque) {
        if (this._assertOnLoadCalled) {
          this._body.applyLocalTorque(torque);
        }
      }
      /**
       * @en
       * Wake up the rigid body.
       * @zh
       * 唤醒刚体。
       */

    }, {
      key: "wakeUp",
      value: function wakeUp() {
        if (this._assertOnLoadCalled) {
          this._body.wakeUp();
        }
      }
      /**
       * @en
       * Dormancy of rigid body.
       * @zh
       * 休眠刚体。
       */

    }, {
      key: "sleep",
      value: function sleep() {
        if (this._assertOnLoadCalled) {
          this._body.sleep();
        }
      }
      /**
       * @en
       * Clear the forces and velocity of the rigid body.
       * @zh
       * 清除刚体受到的力和速度。
       */

    }, {
      key: "clearState",
      value: function clearState() {
        if (this._assertOnLoadCalled) {
          this._body.clearState();
        }
      }
      /**
       * @en
       * Clear the forces of the rigid body.
       * @zh
       * 清除刚体受到的力。
       */

    }, {
      key: "clearForces",
      value: function clearForces() {
        if (this._assertOnLoadCalled) {
          this._body.clearForces();
        }
      }
      /**
       * @en
       * Clear velocity of the rigid body.
       * @zh
       * 清除刚体的速度。
       */

    }, {
      key: "clearVelocity",
      value: function clearVelocity() {
        if (this._assertOnLoadCalled) {
          this._body.clearVelocity();
        }
      }
      /**
       * @en
       * Gets the linear velocity.
       * @zh
       * 获取线性速度。
       * @param out 速度 Vec3
       */

    }, {
      key: "getLinearVelocity",
      value: function getLinearVelocity(out) {
        if (this._assertOnLoadCalled) {
          this._body.getLinearVelocity(out);
        }
      }
      /**
       * @en
       * Sets the linear velocity.
       * @zh
       * 设置线性速度。
       * @param value 速度 Vec3
       */

    }, {
      key: "setLinearVelocity",
      value: function setLinearVelocity(value) {
        if (this._assertOnLoadCalled) {
          this._body.setLinearVelocity(value);
        }
      }
      /**
       * @en
       * Gets the angular velocity.
       * @zh
       * 获取旋转速度。
       * @param out 速度 Vec3
       */

    }, {
      key: "getAngularVelocity",
      value: function getAngularVelocity(out) {
        if (this._assertOnLoadCalled) {
          this._body.getAngularVelocity(out);
        }
      }
      /**
       * @en
       * Sets the angular velocity.
       * @zh
       * 设置旋转速度。
       * @param value 速度 Vec3
       */

    }, {
      key: "setAngularVelocity",
      value: function setAngularVelocity(value) {
        if (this._assertOnLoadCalled) {
          this._body.setAngularVelocity(value);
        }
      } /// GROUP MASK ///

      /**
       * @en
       * Gets the group value.
       * @zh
       * 获取分组值。
       * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "getGroup",
      value: function getGroup() {
        if (this._assertOnLoadCalled) {
          return this._body.getGroup();
        }

        return 0;
      }
      /**
       * @en
       * Sets the group value.
       * @zh
       * 设置分组值。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "setGroup",
      value: function setGroup(v) {
        if (this._assertOnLoadCalled) {
          this.group = v;
        }
      }
      /**
       * @en
       * Add a grouping value to fill in the group you want to join.
       * @zh
       * 添加分组值，可填要加入的 group。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "addGroup",
      value: function addGroup(v) {
        if (this._assertOnLoadCalled && !this._assertUseCollisionMatrix) {
          this._body.addGroup(v);
        }
      }
      /**
       * @en
       * Subtract the grouping value to fill in the group to be removed.
       * @zh
       * 减去分组值，可填要移除的 group。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        if (this._assertOnLoadCalled && !this._assertUseCollisionMatrix) {
          this._body.removeGroup(v);
        }
      }
      /**
       * @en
       * Gets the mask value.
       * @zh
       * 获取掩码值。
       * @returns 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "getMask",
      value: function getMask() {
        if (this._assertOnLoadCalled) {
          return this._body.getMask();
        }

        return 0;
      }
      /**
       * @en
       * Sets the mask value.
       * @zh
       * 设置掩码值。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "setMask",
      value: function setMask(v) {
        if (this._assertOnLoadCalled && !this._assertUseCollisionMatrix) {
          this._body.setMask(v);
        }
      }
      /**
       * @en
       * Add mask values to fill in groups that need to be checked.
       * @zh
       * 添加掩码值，可填入需要检查的 group。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "addMask",
      value: function addMask(v) {
        if (this._assertOnLoadCalled && !this._assertUseCollisionMatrix) {
          this._body.addMask(v);
        }
      }
      /**
       * @en
       * Subtract the mask value to fill in the group that does not need to be checked.
       * @zh
       * 减去掩码值，可填入不需要检查的 group。
       * @param v - 整数，范围为 2 的 0 次方 到 2 的 31 次方
       */

    }, {
      key: "removeMask",
      value: function removeMask(v) {
        if (this._assertOnLoadCalled && !this._assertUseCollisionMatrix) {
          this._body.removeMask(v);
        }
      }
    }, {
      key: "group",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets or sets the group of the rigid body.
       * @zh
       * 获取或设置分组。
       */
      get: function get() {
        return this._group;
      },
      set: function set(v) {
        this._group = v;

        if (this._body) {
          this._body.setGroup(v);
        }
      }
      /**
       * @en
       * Gets or sets the mass of the rigid body.
       * @zh
       * 获取或设置刚体的质量。
       */

    }, {
      key: "mass",
      get: function get() {
        return this._mass;
      },
      set: function set(value) {
        value = value < 0 ? 0 : value;
        this._mass = value;

        if (this._body) {
          this._body.setMass(value);
        }
      }
      /**
       * @en
       * Gets or sets whether hibernation is allowed.
       * @zh
       * 获取或设置是否允许休眠。
       */

    }, {
      key: "allowSleep",
      get: function get() {
        return this._allowSleep;
      },
      set: function set(v) {
        this._allowSleep = v;

        if (this._body) {
          this._body.setAllowSleep(v);
        }
      }
      /**
       * @en
       * Gets or sets linear damping.
       * @zh
       * 获取或设置线性阻尼。
       */

    }, {
      key: "linearDamping",
      get: function get() {
        return this._linearDamping;
      },
      set: function set(value) {
        this._linearDamping = value;

        if (this._body) {
          this._body.setLinearDamping(value);
        }
      }
      /**
       * @en
       * Gets or sets the rotation damping.
       * @zh
       * 获取或设置旋转阻尼。
       */

    }, {
      key: "angularDamping",
      get: function get() {
        return this._angularDamping;
      },
      set: function set(value) {
        this._angularDamping = value;

        if (this._body) {
          this._body.setAngularDamping(value);
        }
      }
      /**
       * @en
       * Gets or sets whether a rigid body is controlled by a physical system.
       * @zh
       * 获取或设置刚体是否由物理系统控制运动。
       */

    }, {
      key: "isKinematic",
      get: function get() {
        return this._isKinematic;
      },
      set: function set(value) {
        this._isKinematic = value;

        if (this._body) {
          this._body.setIsKinematic(value);
        }
      }
      /**
       * @en
       * Gets or sets whether a rigid body uses gravity.
       * @zh
       * 获取或设置刚体是否使用重力。
       */

    }, {
      key: "useGravity",
      get: function get() {
        return this._useGravity;
      },
      set: function set(value) {
        this._useGravity = value;

        if (this._body) {
          this._body.useGravity(value);
        }
      }
      /**
       * @en
       * Gets or sets whether the rigid body is fixed for rotation.
       * @zh
       * 获取或设置刚体是否固定旋转。
       */

    }, {
      key: "fixedRotation",
      get: function get() {
        return this._fixedRotation;
      },
      set: function set(value) {
        this._fixedRotation = value;

        if (this._body) {
          this._body.fixRotation(value);
        }
      }
      /**
       * @en
       * Gets or sets the linear velocity factor that can be used to control the scaling of the velocity in each axis direction.
       * @zh
       * 获取或设置线性速度的因子，可以用来控制每个轴方向上的速度的缩放。
       */

    }, {
      key: "linearFactor",
      get: function get() {
        return this._linearFactor;
      },
      set: function set(value) {
        _index2.Vec3.copy(this._linearFactor, value);

        if (this._body) {
          this._body.setLinearFactor(this._linearFactor);
        }
      }
      /**
       * @en
       * Gets or sets the rotation speed factor that can be used to control the scaling of the rotation speed in each axis direction.
       * @zh
       * 获取或设置旋转速度的因子，可以用来控制每个轴方向上的旋转速度的缩放。
       */

    }, {
      key: "angularFactor",
      get: function get() {
        return this._angularFactor;
      },
      set: function set(value) {
        _index2.Vec3.copy(this._angularFactor, value);

        if (this._body) {
          this._body.setAngularFactor(this._angularFactor);
        }
      }
      /**
       * @en
       * Gets or sets the speed threshold for going to sleep.
       * @zh
       * 获取或设置进入休眠的速度临界值。
       */

    }, {
      key: "sleepThreshold",
      get: function get() {
        if (this._assertOnLoadCalled) {
          return this._body.getSleepThreshold();
        }

        return 0;
      },
      set: function set(v) {
        if (this._assertOnLoadCalled) {
          this._body.setSleepThreshold(v);
        }
      }
      /**
       * @en
       * Gets whether it is the state of awake.
       * @zh
       * 获取是否是唤醒的状态。
       */

    }, {
      key: "isAwake",
      get: function get() {
        if (this._assertOnLoadCalled) {
          return this._body.isAwake;
        }

        return false;
      }
      /**
       * @en
       * Gets whether you can enter a dormant state.
       * @zh
       * 获取是否是可进入休眠的状态。
       */

    }, {
      key: "isSleepy",
      get: function get() {
        if (this._assertOnLoadCalled) {
          return this._body.isSleepy;
        }

        return false;
      }
      /**
       * @en
       * Gets whether the state is dormant.
       * @zh
       * 获取是否是正在休眠的状态。
       */

    }, {
      key: "isSleeping",
      get: function get() {
        if (this._assertOnLoadCalled) {
          return this._body.isSleeping;
        }

        return false;
      }
      /**
       * @en
       * Gets the wrapper object, through which the lowLevel instance can be accessed.
       * @zh
       * 获取封装对象，通过此对象可以访问到底层实例。
       */

    }, {
      key: "body",
      get: function get() {
        return this._body;
      }
    }, {
      key: "_assertOnLoadCalled",
      get: function get() {
        var r = this._isOnLoadCalled == 0;

        if (r) {
          (0, _index3.error)('[Physics]: Please make sure that the node has been added to the scene');
        }

        return !r;
      }
    }, {
      key: "_assertUseCollisionMatrix",
      get: function get() {
        if (_physicsSystem.PhysicsSystem.instance.useCollisionMatrix) {
          (0, _index3.error)('[Physics]: useCollisionMatrix is turn on, using collision matrix instead please.');
        }

        return _physicsSystem.PhysicsSystem.instance.useCollisionMatrix;
      }
    }]);

    return RigidBody;
  }(_index3.Component), _class3.ERigidBodyType = _physicsEnum.ERigidBodyType, _temp), (_applyDecoratedDescriptor(_class2.prototype, "group", [_dec5, _dec6, _dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "group"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "mass", [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "mass"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "allowSleep", [_dec10, _dec11, _dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "allowSleep"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearDamping", [_dec13, _dec14, _dec15], Object.getOwnPropertyDescriptor(_class2.prototype, "linearDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularDamping", [_dec16, _dec17, _dec18], Object.getOwnPropertyDescriptor(_class2.prototype, "angularDamping"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isKinematic", [_dec19, _dec20, _dec21], Object.getOwnPropertyDescriptor(_class2.prototype, "isKinematic"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "useGravity", [_dec22, _dec23, _dec24], Object.getOwnPropertyDescriptor(_class2.prototype, "useGravity"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "fixedRotation", [_dec25, _dec26, _dec27], Object.getOwnPropertyDescriptor(_class2.prototype, "fixedRotation"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "linearFactor", [_dec28, _dec29, _dec30], Object.getOwnPropertyDescriptor(_class2.prototype, "linearFactor"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "angularFactor", [_dec31, _dec32, _dec33], Object.getOwnPropertyDescriptor(_class2.prototype, "angularFactor"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_group", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _physicsSystem.PhysicsSystem.PhysicsGroup.DEFAULT;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_mass", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_allowSleep", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_linearDamping", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_angularDamping", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0.1;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_fixedRotation", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "_isKinematic", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "_useGravity", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "_linearFactor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(1, 1, 1);
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "_angularFactor", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(1, 1, 1);
    }
  })), _class2)) || _class) || _class) || _class) || _class) || _class) || _class);
  _exports.RigidBody = RigidBody;

  (function (_RigidBody) {})(RigidBody || (_exports.RigidBody = RigidBody = {}));
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvcmlnaWQtYm9keS50cyJdLCJuYW1lcyI6WyJSaWdpZEJvZHkiLCJQaHlzaWNzU3lzdGVtIiwiUGh5c2ljc0dyb3VwIiwiX21hc3MiLCJleGVjdXRlSW5FZGl0TW9kZSIsImRpc2FsbG93TXVsdGlwbGUiLCJfYm9keSIsIkVESVRPUiIsImluaXRpYWxpemUiLCJvbkVuYWJsZSIsIm9uRGlzYWJsZSIsIm9uRGVzdHJveSIsImZvcmNlIiwicmVsYXRpdmVQb2ludCIsIl9hc3NlcnRPbkxvYWRDYWxsZWQiLCJhcHBseUZvcmNlIiwibG9jYWxQb2ludCIsImFwcGx5TG9jYWxGb3JjZSIsImltcHVsc2UiLCJhcHBseUltcHVsc2UiLCJhcHBseUxvY2FsSW1wdWxzZSIsInRvcnF1ZSIsImFwcGx5VG9ycXVlIiwiYXBwbHlMb2NhbFRvcnF1ZSIsIndha2VVcCIsInNsZWVwIiwiY2xlYXJTdGF0ZSIsImNsZWFyRm9yY2VzIiwiY2xlYXJWZWxvY2l0eSIsIm91dCIsImdldExpbmVhclZlbG9jaXR5IiwidmFsdWUiLCJzZXRMaW5lYXJWZWxvY2l0eSIsImdldEFuZ3VsYXJWZWxvY2l0eSIsInNldEFuZ3VsYXJWZWxvY2l0eSIsImdldEdyb3VwIiwidiIsImdyb3VwIiwiX2Fzc2VydFVzZUNvbGxpc2lvbk1hdHJpeCIsImFkZEdyb3VwIiwicmVtb3ZlR3JvdXAiLCJnZXRNYXNrIiwic2V0TWFzayIsImFkZE1hc2siLCJyZW1vdmVNYXNrIiwiX2dyb3VwIiwic2V0R3JvdXAiLCJzZXRNYXNzIiwiX2FsbG93U2xlZXAiLCJzZXRBbGxvd1NsZWVwIiwiX2xpbmVhckRhbXBpbmciLCJzZXRMaW5lYXJEYW1waW5nIiwiX2FuZ3VsYXJEYW1waW5nIiwic2V0QW5ndWxhckRhbXBpbmciLCJfaXNLaW5lbWF0aWMiLCJzZXRJc0tpbmVtYXRpYyIsIl91c2VHcmF2aXR5IiwidXNlR3Jhdml0eSIsIl9maXhlZFJvdGF0aW9uIiwiZml4Um90YXRpb24iLCJfbGluZWFyRmFjdG9yIiwiVmVjMyIsImNvcHkiLCJzZXRMaW5lYXJGYWN0b3IiLCJfYW5ndWxhckZhY3RvciIsInNldEFuZ3VsYXJGYWN0b3IiLCJnZXRTbGVlcFRocmVzaG9sZCIsInNldFNsZWVwVGhyZXNob2xkIiwiaXNBd2FrZSIsImlzU2xlZXB5IiwiaXNTbGVlcGluZyIsInIiLCJfaXNPbkxvYWRDYWxsZWQiLCJpbnN0YW5jZSIsInVzZUNvbGxpc2lvbk1hdHJpeCIsIkNvbXBvbmVudCIsIkVSaWdpZEJvZHlUeXBlIiwic2VyaWFsaXphYmxlIiwiREVGQVVMVCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTBCQTs7Ozs7O01BWWFBLFMsV0FOWixvQkFBUSxjQUFSLEMsVUFDQSxpQkFBSyxtQkFBTCxDLFVBQ0EsaUJBQUssbUJBQUwsQyxVQUdBLDJCQUFlLENBQUMsQ0FBaEIsQyxVQWFJLGlCQUFLQyw2QkFBY0MsWUFBbkIsQyxVQUNBLHlCQUFhLENBQUMsQ0FBZCxDLFVBQ0Esb0JBQVEsTUFBUixDLFVBa0JBLHlCQUFhLENBQWIsQyxVQUNBLG9CQUFRLE9BQVIsQyxXQW1CQSx5QkFBYSxHQUFiLEMsV0FDQSxvQkFBUSxZQUEyQjtBQUFFLFdBQU8sS0FBS0MsS0FBTCxJQUFjLENBQXJCO0FBQXlCLEdBQTlELEMsV0FDQSxvQkFBUSxRQUFSLEMsV0FrQkEseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsWUFBMkI7QUFBRSxXQUFPLEtBQUtBLEtBQUwsSUFBYyxDQUFyQjtBQUF5QixHQUE5RCxDLFdBQ0Esb0JBQVEsTUFBUixDLFdBa0JBLHlCQUFhLENBQWIsQyxXQUNBLG9CQUFRLFlBQTJCO0FBQUUsV0FBTyxLQUFLQSxLQUFMLElBQWMsQ0FBckI7QUFBeUIsR0FBOUQsQyxXQUNBLG9CQUFRLE1BQVIsQyxXQWtCQSx5QkFBYSxDQUFiLEMsV0FDQSxvQkFB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Q0g7Ozs7SUEvVDBCQyxpQixXQUVYQyxjLEdBQWlCQSwyQiw0dkRBb1JoQ0MsbUI7Ozs7O2FBQ3dCNUUsNkJBQWNDLFlBQWQsQ0FBMkI0RSxPOzs0RUFFbkRELG1COzs7OzthQUN1QixDOztrRkFFdkJBLG1COzs7OzthQUM4QixJOztxRkFFOUJBLG1COzs7OzthQUNnQyxHOztzRkFFaENBLG1COzs7OzthQUNpQyxHOztxRkFFakNBLG1COzs7OzthQUNpQyxLOzttRkFFakNBLG1COzs7OzthQUMrQixLOztrRkFFL0JBLG1COzs7OzthQUM4QixJOztvRkFFOUJBLG1COzs7OzthQUM2QixJQUFJaEIsWUFBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDOztzRkFFN0JnQixtQjs7Ozs7YUFDOEIsSUFBSWhCLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQzs7Ozs7NkJBMFZsQjdELFMsMEJBQUFBLFMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICog54mp55CG5qih5Z2XXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHtcclxuICAgIGNjY2xhc3MsXHJcbiAgICBoZWxwLFxyXG4gICAgZGlzYWxsb3dNdWx0aXBsZSxcclxuICAgIGV4ZWN1dGVJbkVkaXRNb2RlLFxyXG4gICAgbWVudSxcclxuICAgIGV4ZWN1dGlvbk9yZGVyLFxyXG4gICAgdG9vbHRpcCxcclxuICAgIGRpc3BsYXlPcmRlcixcclxuICAgIHZpc2libGUsXHJcbiAgICB0eXBlLFxyXG4gICAgc2VyaWFsaXphYmxlLFxyXG59IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIGVycm9yIH0gZnJvbSAnLi4vLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IElSaWdpZEJvZHkgfSBmcm9tICcuLi8uLi9zcGVjL2ktcmlnaWQtYm9keSc7XHJcbmltcG9ydCB7IGNyZWF0ZVJpZ2lkQm9keSB9IGZyb20gJy4uL2luc3RhbmNlJztcclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgRVJpZ2lkQm9keVR5cGUgfSBmcm9tICcuLi9waHlzaWNzLWVudW0nO1xyXG5pbXBvcnQgeyBQaHlzaWNzU3lzdGVtIH0gZnJvbSAnLi4vcGh5c2ljcy1zeXN0ZW0nO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBSaWdpZCBib2R5IGNvbXBvbmVudC5cclxuICogQHpoXHJcbiAqIOWImuS9k+e7hOS7tuOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlJpZ2lkQm9keScpXHJcbkBoZWxwKCdpMThuOmNjLlJpZ2lkQm9keScpXHJcbkBtZW51KCdQaHlzaWNzL1JpZ2lkQm9keScpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5AZGlzYWxsb3dNdWx0aXBsZVxyXG5AZXhlY3V0aW9uT3JkZXIoLTEpXHJcbmV4cG9ydCBjbGFzcyBSaWdpZEJvZHkgZXh0ZW5kcyBDb21wb25lbnQge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBFUmlnaWRCb2R5VHlwZSA9IEVSaWdpZEJvZHlUeXBlO1xyXG5cclxuICAgIC8vLyBQVUJMSUMgUFJPUEVSVFkgR0VUVEVSXFxTRVRURVIgLy8vXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgZ3JvdXAgb2YgdGhlIHJpZ2lkIGJvZHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWIhue7hOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShQaHlzaWNzU3lzdGVtLlBoeXNpY3NHcm91cClcclxuICAgIEBkaXNwbGF5T3JkZXIoLTIpXHJcbiAgICBAdG9vbHRpcCgn6K6+572u5YiG57uEJylcclxuICAgIHB1YmxpYyBnZXQgZ3JvdXAgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgZ3JvdXAgKHY6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2dyb3VwID0gdjtcclxuICAgICAgICBpZiAodGhpcy5fYm9keSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5LnNldEdyb3VwKHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBtYXNzIG9mIHRoZSByaWdpZCBib2R5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7liJrkvZPnmoTotKjph4/jgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgQHRvb2x0aXAoJ+WImuS9k+eahOi0qOmHjycpXHJcbiAgICBwdWJsaWMgZ2V0IG1hc3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXNzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgbWFzcyAodmFsdWUpIHtcclxuICAgICAgICB2YWx1ZSA9IHZhbHVlIDwgMCA/IDAgOiB2YWx1ZTtcclxuICAgICAgICB0aGlzLl9tYXNzID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS5zZXRNYXNzKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIGhpYmVybmF0aW9uIGlzIGFsbG93ZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruaYr+WQpuWFgeiuuOS8keecoOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDAuNSlcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBSaWdpZEJvZHkpIHsgcmV0dXJuIHRoaXMuX21hc3MgIT0gMDsgfSlcclxuICAgIEB0b29sdGlwKCfmmK/lkKblhYHorrjkvJHnnKAnKVxyXG4gICAgcHVibGljIGdldCBhbGxvd1NsZWVwICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWxsb3dTbGVlcDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9hbGxvd1NsZWVwID0gdjtcclxuICAgICAgICBpZiAodGhpcy5fYm9keSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5LnNldEFsbG93U2xlZXAodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgbGluZWFyIGRhbXBpbmcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9rue6v+aAp+mYu+WwvOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDEpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogUmlnaWRCb2R5KSB7IHJldHVybiB0aGlzLl9tYXNzICE9IDA7IH0pXHJcbiAgICBAdG9vbHRpcCgn57q/5oCn6Zi75bC8JylcclxuICAgIHB1YmxpYyBnZXQgbGluZWFyRGFtcGluZyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpbmVhckRhbXBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsaW5lYXJEYW1waW5nICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2xpbmVhckRhbXBpbmcgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5fYm9keSkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5LnNldExpbmVhckRhbXBpbmcodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSByb3RhdGlvbiBkYW1waW5nLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7ml4vovazpmLvlsLzjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFJpZ2lkQm9keSkgeyByZXR1cm4gdGhpcy5fbWFzcyAhPSAwOyB9KVxyXG4gICAgQHRvb2x0aXAoJ+aXi+i9rOmYu+WwvCcpXHJcbiAgICBwdWJsaWMgZ2V0IGFuZ3VsYXJEYW1waW5nICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYW5ndWxhckRhbXBpbmc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBhbmd1bGFyRGFtcGluZyAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9hbmd1bGFyRGFtcGluZyA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuc2V0QW5ndWxhckRhbXBpbmcodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgYSByaWdpZCBib2R5IGlzIGNvbnRyb2xsZWQgYnkgYSBwaHlzaWNhbCBzeXN0ZW0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruWImuS9k+aYr+WQpueUseeJqeeQhuezu+e7n+aOp+WItui/kOWKqOOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogUmlnaWRCb2R5KSB7IHJldHVybiB0aGlzLl9tYXNzICE9IDA7IH0pXHJcbiAgICBAdG9vbHRpcCgn5Yia5L2T5piv5ZCm55Sx54mp55CG57O757uf5o6n5Yi26L+Q5YqoJylcclxuICAgIHB1YmxpYyBnZXQgaXNLaW5lbWF0aWMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0tpbmVtYXRpYztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGlzS2luZW1hdGljICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuX2lzS2luZW1hdGljID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS5zZXRJc0tpbmVtYXRpYyh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgd2hldGhlciBhIHJpZ2lkIGJvZHkgdXNlcyBncmF2aXR5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7liJrkvZPmmK/lkKbkvb/nlKjph43lipvjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcig0KVxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IFJpZ2lkQm9keSkgeyByZXR1cm4gdGhpcy5fbWFzcyAhPSAwOyB9KVxyXG4gICAgQHRvb2x0aXAoJ+WImuS9k+aYr+WQpuS9v+eUqOmHjeWKmycpXHJcbiAgICBwdWJsaWMgZ2V0IHVzZUdyYXZpdHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VHcmF2aXR5O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdXNlR3Jhdml0eSAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl91c2VHcmF2aXR5ID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS51c2VHcmF2aXR5KHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB3aGV0aGVyIHRoZSByaWdpZCBib2R5IGlzIGZpeGVkIGZvciByb3RhdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5Yia5L2T5piv5ZCm5Zu65a6a5peL6L2s44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoNSlcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBSaWdpZEJvZHkpIHsgcmV0dXJuIHRoaXMuX21hc3MgIT0gMDsgfSlcclxuICAgIEB0b29sdGlwKCfliJrkvZPmmK/lkKblm7rlrprml4vovawnKVxyXG4gICAgcHVibGljIGdldCBmaXhlZFJvdGF0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRSb3RhdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGZpeGVkUm90YXRpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZml4ZWRSb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuZml4Um90YXRpb24odmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBsaW5lYXIgdmVsb2NpdHkgZmFjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gY29udHJvbCB0aGUgc2NhbGluZyBvZiB0aGUgdmVsb2NpdHkgaW4gZWFjaCBheGlzIGRpcmVjdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u57q/5oCn6YCf5bqm55qE5Zug5a2Q77yM5Y+v5Lul55So5p2l5o6n5Yi25q+P5Liq6L205pa55ZCR5LiK55qE6YCf5bqm55qE57yp5pS+44CCXHJcbiAgICAgKi9cclxuICAgIEBkaXNwbGF5T3JkZXIoNilcclxuICAgIEB2aXNpYmxlKGZ1bmN0aW9uICh0aGlzOiBSaWdpZEJvZHkpIHsgcmV0dXJuIHRoaXMuX21hc3MgIT0gMDsgfSlcclxuICAgIEB0b29sdGlwKCfnur/mgKfpgJ/luqbnmoTlm6DlrZDvvIzlj6/ku6XnlKjmnaXmjqfliLbmr4/kuKrovbTmlrnlkJHkuIrnmoTpgJ/luqbnmoTnvKnmlL4nKVxyXG4gICAgcHVibGljIGdldCBsaW5lYXJGYWN0b3IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9saW5lYXJGYWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBsaW5lYXJGYWN0b3IgKHZhbHVlOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xpbmVhckZhY3RvciwgdmFsdWUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkuc2V0TGluZWFyRmFjdG9yKHRoaXMuX2xpbmVhckZhY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHJvdGF0aW9uIHNwZWVkIGZhY3RvciB0aGF0IGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgdGhlIHNjYWxpbmcgb2YgdGhlIHJvdGF0aW9uIHNwZWVkIGluIGVhY2ggYXhpcyBkaXJlY3Rpb24uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruaXi+i9rOmAn+W6pueahOWboOWtkO+8jOWPr+S7peeUqOadpeaOp+WItuavj+S4qui9tOaWueWQkeS4iueahOaXi+i9rOmAn+W6pueahOe8qeaUvuOAglxyXG4gICAgICovXHJcbiAgICBAZGlzcGxheU9yZGVyKDcpXHJcbiAgICBAdmlzaWJsZShmdW5jdGlvbiAodGhpczogUmlnaWRCb2R5KSB7IHJldHVybiB0aGlzLl9tYXNzICE9IDA7IH0pXHJcbiAgICBAdG9vbHRpcCgn5peL6L2s6YCf5bqm55qE5Zug5a2Q77yM5Y+v5Lul55So5p2l5o6n5Yi25q+P5Liq6L205pa55ZCR5LiK55qE5peL6L2s6YCf5bqm55qE57yp5pS+JylcclxuICAgIHB1YmxpYyBnZXQgYW5ndWxhckZhY3RvciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FuZ3VsYXJGYWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBhbmd1bGFyRmFjdG9yICh2YWx1ZTogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9hbmd1bGFyRmFjdG9yLCB2YWx1ZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS5zZXRBbmd1bGFyRmFjdG9yKHRoaXMuX2FuZ3VsYXJGYWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBzcGVlZCB0aHJlc2hvbGQgZm9yIGdvaW5nIHRvIHNsZWVwLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7ov5vlhaXkvJHnnKDnmoTpgJ/luqbkuLTnlYzlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzbGVlcFRocmVzaG9sZCAoKTogbnVtYmVyIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2R5IS5nZXRTbGVlcFRocmVzaG9sZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHNsZWVwVGhyZXNob2xkICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLnNldFNsZWVwVGhyZXNob2xkKHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB3aGV0aGVyIGl0IGlzIHRoZSBzdGF0ZSBvZiBhd2FrZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5piv5ZCm5piv5ZSk6YaS55qE54q25oCB44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaXNBd2FrZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYm9keSEuaXNBd2FrZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHdoZXRoZXIgeW91IGNhbiBlbnRlciBhIGRvcm1hbnQgc3RhdGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaYr+WQpuaYr+WPr+i/m+WFpeS8keecoOeahOeKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGlzU2xlZXB5ICgpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9ib2R5IS5pc1NsZWVweTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHdoZXRoZXIgdGhlIHN0YXRlIGlzIGRvcm1hbnQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaYr+WQpuaYr+ato+WcqOS8keecoOeahOeKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGlzU2xlZXBpbmcgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkhLmlzU2xlZXBpbmc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgd3JhcHBlciBvYmplY3QsIHRocm91Z2ggd2hpY2ggdGhlIGxvd0xldmVsIGluc3RhbmNlIGNhbiBiZSBhY2Nlc3NlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5bCB6KOF5a+56LGh77yM6YCa6L+H5q2k5a+56LGh5Y+v5Lul6K6/6Zeu5Yiw5bqV5bGC5a6e5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgYm9keSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYm9keTogSVJpZ2lkQm9keSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIC8vLyBQUklWQVRFIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2dyb3VwOiBudW1iZXIgPSBQaHlzaWNzU3lzdGVtLlBoeXNpY3NHcm91cC5ERUZBVUxUO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX21hc3M6IG51bWJlciA9IDE7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfYWxsb3dTbGVlcDogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfbGluZWFyRGFtcGluZzogbnVtYmVyID0gMC4xO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2FuZ3VsYXJEYW1waW5nOiBudW1iZXIgPSAwLjE7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfZml4ZWRSb3RhdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2lzS2luZW1hdGljOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfdXNlR3Jhdml0eTogYm9vbGVhbiA9IHRydWU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfbGluZWFyRmFjdG9yOiBWZWMzID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJpdmF0ZSBfYW5ndWxhckZhY3RvcjogVmVjMyA9IG5ldyBWZWMzKDEsIDEsIDEpO1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgX2Fzc2VydE9uTG9hZENhbGxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgciA9IHRoaXMuX2lzT25Mb2FkQ2FsbGVkID09IDA7XHJcbiAgICAgICAgaWYgKHIpIHsgZXJyb3IoJ1tQaHlzaWNzXTogUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBub2RlIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBzY2VuZScpOyB9XHJcbiAgICAgICAgcmV0dXJuICFyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgX2Fzc2VydFVzZUNvbGxpc2lvbk1hdHJpeCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UudXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGVycm9yKCdbUGh5c2ljc106IHVzZUNvbGxpc2lvbk1hdHJpeCBpcyB0dXJuIG9uLCB1c2luZyBjb2xsaXNpb24gbWF0cml4IGluc3RlYWQgcGxlYXNlLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS51c2VDb2xsaXNpb25NYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIENPTVBPTkVOVCBMSUZFQ1lDTEUgLy8vXHJcblxyXG4gICAgcHJvdGVjdGVkIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgaWYgKCFFRElUT1IpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keSA9IGNyZWF0ZVJpZ2lkQm9keSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5LmluaXRpYWxpemUodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS5vbkVuYWJsZSEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHkpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS5vbkRpc2FibGUhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBvbkRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9ib2R5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkub25EZXN0cm95ISgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy8gUFVCTElDIE1FVEhPRCAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQXBwbHkgZm9yY2UgdG8gYSB3b3JsZCBwb2ludC4gVGhpcyBjb3VsZCwgZm9yIGV4YW1wbGUsIGJlIGEgcG9pbnQgb24gdGhlIEJvZHkgc3VyZmFjZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5LiW55WM56m66Ze05Lit77yM55u45a+55LqO5Yia5L2T55qE6LSo5b+D55qE5p+Q54K55LiK5a+55Yia5L2T5pa95Yqg5L2c55So5Yqb44CCXHJcbiAgICAgKiBAcGFyYW0gZm9yY2UgLSDkvZznlKjliptcclxuICAgICAqIEBwYXJhbSByZWxhdGl2ZVBvaW50IC0g5L2c55So54K577yM55u45a+55LqO5Yia5L2T55qE6LSo5b+DXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBseUZvcmNlIChmb3JjZTogVmVjMywgcmVsYXRpdmVQb2ludD86IFZlYzMpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLmFwcGx5Rm9yY2UoZm9yY2UsIHJlbGF0aXZlUG9pbnQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQXBwbHkgZm9yY2UgdG8gYSBsb2NhbCBwb2ludC4gVGhpcyBjb3VsZCwgZm9yIGV4YW1wbGUsIGJlIGEgcG9pbnQgb24gdGhlIEJvZHkgc3VyZmFjZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5pys5Zyw56m66Ze05Lit77yM55u45a+55LqO5Yia5L2T55qE6LSo5b+D55qE5p+Q54K55LiK5a+55Yia5L2T5pa95Yqg5L2c55So5Yqb44CCXHJcbiAgICAgKiBAcGFyYW0gZm9yY2UgLSDkvZznlKjliptcclxuICAgICAqIEBwYXJhbSBsb2NhbFBvaW50IC0g5L2c55So54K5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBseUxvY2FsRm9yY2UgKGZvcmNlOiBWZWMzLCBsb2NhbFBvaW50PzogVmVjMykge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keSEuYXBwbHlMb2NhbEZvcmNlKGZvcmNlLCBsb2NhbFBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluIHdvcmxkIHNwYWNlLCBpbXB1bHNlIGlzIGFwcGxpZWQgdG8gdGhlIHJpZ2lkIGJvZHkgYXQgc29tZSBwb2ludCByZWxhdGl2ZSB0byB0aGUgY2VudGVyIG9mIG1hc3Mgb2YgdGhlIHJpZ2lkIGJvZHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWcqOS4lueVjOepuumXtOS4re+8jOebuOWvueS6juWImuS9k+eahOi0qOW/g+eahOafkOeCueS4iuWvueWImuS9k+aWveWKoOWGsumHj+OAglxyXG4gICAgICogQHBhcmFtIGltcHVsc2UgLSDlhrLph49cclxuICAgICAqIEBwYXJhbSByZWxhdGl2ZVBvaW50IC0g5L2c55So54K577yM55u45a+55LqO5Yia5L2T55qE5Lit5b+D54K5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBseUltcHVsc2UgKGltcHVsc2U6IFZlYzMsIHJlbGF0aXZlUG9pbnQ/OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5hcHBseUltcHVsc2UoaW1wdWxzZSwgcmVsYXRpdmVQb2ludCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBJbiBsb2NhbCBzcGFjZSwgaW1wdWxzZSBpcyBhcHBsaWVkIHRvIHRoZSByaWdpZCBib2R5IGF0IHNvbWUgcG9pbnQgcmVsYXRpdmUgdG8gdGhlIGNlbnRlciBvZiBtYXNzIG9mIHRoZSByaWdpZCBib2R5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlnKjmnKzlnLDnqbrpl7TkuK3vvIznm7jlr7nkuo7liJrkvZPnmoTotKjlv4PnmoTmn5DngrnkuIrlr7nliJrkvZPmlr3liqDlhrLph4/jgIJcclxuICAgICAqIEBwYXJhbSBpbXB1bHNlIC0g5Yay6YePXHJcbiAgICAgKiBAcGFyYW0gbG9jYWxQb2ludCAtIOS9nOeUqOeCuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYXBwbHlMb2NhbEltcHVsc2UgKGltcHVsc2U6IFZlYzMsIGxvY2FsUG9pbnQ/OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5hcHBseUxvY2FsSW1wdWxzZShpbXB1bHNlLCBsb2NhbFBvaW50KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEluIHdvcmxkIHNwYWNlLCB0b3JxdWUgaXMgYXBwbGllZCB0byB0aGUgcmlnaWQgYm9keS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5LiW55WM56m66Ze05Lit77yM5a+55Yia5L2T5pa95Yqg5omt55+p44CCXHJcbiAgICAgKiBAcGFyYW0gdG9ycXVlIC0g5omt55+pXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBseVRvcnF1ZSAodG9ycXVlOiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5hcHBseVRvcnF1ZSh0b3JxdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5pys5Zyw56m66Ze05Lit77yM5a+55Yia5L2T5pa95Yqg5omt55+p44CCXHJcbiAgICAgKiBAcGFyYW0gdG9ycXVlIC0g5omt55+pXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhcHBseUxvY2FsVG9ycXVlICh0b3JxdWU6IFZlYzMpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLmFwcGx5TG9jYWxUb3JxdWUodG9ycXVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFdha2UgdXAgdGhlIHJpZ2lkIGJvZHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWUpOmGkuWImuS9k+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgd2FrZVVwICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLndha2VVcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRG9ybWFuY3kgb2YgcmlnaWQgYm9keS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5LyR55yg5Yia5L2T44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzbGVlcCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5zbGVlcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2xlYXIgdGhlIGZvcmNlcyBhbmQgdmVsb2NpdHkgb2YgdGhlIHJpZ2lkIGJvZHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa4hemZpOWImuS9k+WPl+WIsOeahOWKm+WSjOmAn+W6puOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJTdGF0ZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5jbGVhclN0YXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDbGVhciB0aGUgZm9yY2VzIG9mIHRoZSByaWdpZCBib2R5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmuIXpmaTliJrkvZPlj5fliLDnmoTlipvjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyRm9yY2VzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLmNsZWFyRm9yY2VzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDbGVhciB2ZWxvY2l0eSBvZiB0aGUgcmlnaWQgYm9keS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5riF6Zmk5Yia5L2T55qE6YCf5bqm44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhclZlbG9jaXR5ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLmNsZWFyVmVsb2NpdHkoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIGxpbmVhciB2ZWxvY2l0eS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W57q/5oCn6YCf5bqm44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOmAn+W6piBWZWMzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMaW5lYXJWZWxvY2l0eSAob3V0OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5nZXRMaW5lYXJWZWxvY2l0eShvdXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgbGluZWFyIHZlbG9jaXR5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7nur/mgKfpgJ/luqbjgIJcclxuICAgICAqIEBwYXJhbSB2YWx1ZSDpgJ/luqYgVmVjM1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TGluZWFyVmVsb2NpdHkgKHZhbHVlOiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5zZXRMaW5lYXJWZWxvY2l0eSh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBhbmd1bGFyIHZlbG9jaXR5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bml4vovazpgJ/luqbjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg6YCf5bqmIFZlYzNcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEFuZ3VsYXJWZWxvY2l0eSAob3V0OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5nZXRBbmd1bGFyVmVsb2NpdHkob3V0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgdGhlIGFuZ3VsYXIgdmVsb2NpdHkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruaXi+i9rOmAn+W6puOAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIOmAn+W6piBWZWMzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRBbmd1bGFyVmVsb2NpdHkgKHZhbHVlOiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5zZXRBbmd1bGFyVmVsb2NpdHkodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLy8gR1JPVVAgTUFTSyAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgZ3JvdXAgdmFsdWUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWIhue7hOWAvOOAglxyXG4gICAgICogQHJldHVybnMg5pW05pWw77yM6IyD5Zu05Li6IDIg55qEIDAg5qyh5pa5IOWIsCAyIOeahCAzMSDmrKHmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEdyb3VwICgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkhLmdldEdyb3VwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBncm91cCB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5YiG57uE5YC844CCXHJcbiAgICAgKiBAcGFyYW0gdiAtIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLmdyb3VwID0gdjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZCBhIGdyb3VwaW5nIHZhbHVlIHRvIGZpbGwgaW4gdGhlIGdyb3VwIHlvdSB3YW50IHRvIGpvaW4uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOWIhue7hOWAvO+8jOWPr+Whq+imgeWKoOWFpeeahCBncm91cOOAglxyXG4gICAgICogQHBhcmFtIHYgLSDmlbTmlbDvvIzojIPlm7TkuLogMiDnmoQgMCDmrKHmlrkg5YiwIDIg55qEIDMxIOasoeaWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkR3JvdXAgKHY6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQgJiYgIXRoaXMuX2Fzc2VydFVzZUNvbGxpc2lvbk1hdHJpeCkge1xyXG4gICAgICAgICAgICB0aGlzLl9ib2R5IS5hZGRHcm91cCh2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN1YnRyYWN0IHRoZSBncm91cGluZyB2YWx1ZSB0byBmaWxsIGluIHRoZSBncm91cCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlh4/ljrvliIbnu4TlgLzvvIzlj6/loavopoHnp7vpmaTnmoQgZ3JvdXDjgIJcclxuICAgICAqIEBwYXJhbSB2IC0g5pW05pWw77yM6IyD5Zu05Li6IDIg55qEIDAg5qyh5pa5IOWIsCAyIOeahCAzMSDmrKHmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUdyb3VwICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkICYmICF0aGlzLl9hc3NlcnRVc2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keSEucmVtb3ZlR3JvdXAodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBtYXNrIHZhbHVlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjqnnoIHlgLzjgIJcclxuICAgICAqIEByZXR1cm5zIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHkhLmdldE1hc2soKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldHMgdGhlIG1hc2sgdmFsdWUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruaOqeeggeWAvOOAglxyXG4gICAgICogQHBhcmFtIHYgLSDmlbTmlbDvvIzojIPlm7TkuLogMiDnmoQgMCDmrKHmlrkg5YiwIDIg55qEIDMxIOasoeaWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TWFzayAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCAmJiAhdGhpcy5fYXNzZXJ0VXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLnNldE1hc2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgbWFzayB2YWx1ZXMgdG8gZmlsbCBpbiBncm91cHMgdGhhdCBuZWVkIHRvIGJlIGNoZWNrZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOaOqeeggeWAvO+8jOWPr+Whq+WFpemcgOimgeajgOafpeeahCBncm91cOOAglxyXG4gICAgICogQHBhcmFtIHYgLSDmlbTmlbDvvIzojIPlm7TkuLogMiDnmoQgMCDmrKHmlrkg5YiwIDIg55qEIDMxIOasoeaWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTWFzayAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCAmJiAhdGhpcy5fYXNzZXJ0VXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2JvZHkhLmFkZE1hc2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTdWJ0cmFjdCB0aGUgbWFzayB2YWx1ZSB0byBmaWxsIGluIHRoZSBncm91cCB0aGF0IGRvZXMgbm90IG5lZWQgdG8gYmUgY2hlY2tlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YeP5Y675o6p56CB5YC877yM5Y+v5aGr5YWl5LiN6ZyA6KaB5qOA5p+l55qEIGdyb3Vw44CCXHJcbiAgICAgKiBAcGFyYW0gdiAtIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVNYXNrICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkICYmICF0aGlzLl9hc3NlcnRVc2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keSEucmVtb3ZlTWFzayh2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIFJpZ2lkQm9keSB7XHJcbiAgICBleHBvcnQgdHlwZSBFUmlnaWRCb2R5VHlwZSA9IEVudW1BbGlhczx0eXBlb2YgRVJpZ2lkQm9keVR5cGU+O1xyXG59XHJcbiJdfQ==