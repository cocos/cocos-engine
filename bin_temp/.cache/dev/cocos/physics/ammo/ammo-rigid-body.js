(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/index.js", "./ammo-util.js", "../../../exports/physics-framework.js", "./ammo-enum.js", "../framework/physics-enum.js", "./ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/index.js"), require("./ammo-util.js"), require("../../../exports/physics-framework.js"), require("./ammo-enum.js"), require("../framework/physics-enum.js"), require("./ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.ammoUtil, global.physicsFramework, global.ammoEnum, global.physicsEnum, global.ammoConst);
    global.ammoRigidBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _ammoUtil, _physicsFramework, _ammoEnum, _physicsEnum, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoRigidBody = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var v3_0 = _ammoConst.CC_V3_0;
  var v3_1 = _ammoConst.CC_V3_1;

  var AmmoRigidBody = /*#__PURE__*/function () {
    _createClass(AmmoRigidBody, [{
      key: "setMass",
      value: function setMass(value) {
        // See https://studiofreya.com/game-maker/bullet-physics/bullet-physics-how-to-change-body-mass/
        var localInertia = _ammoConst.AmmoConstant.instance.VECTOR3_0; // const localInertia = this._sharedBody.bodyStruct.localInertia;

        localInertia.setValue(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        var shape = this.impl.getCollisionShape();

        if (shape.isCompound()) {
          if (this._sharedBody.bodyCompoundShape.getNumChildShapes() > 0) {
            shape.calculateLocalInertia(this._rigidBody.mass, localInertia);
          }
        } else {
          shape.calculateLocalInertia(this._rigidBody.mass, localInertia);
        }

        this.impl.setMassProps(value, localInertia);

        this._wakeUpIfSleep();

        this._sharedBody.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
      }
    }, {
      key: "setLinearDamping",
      value: function setLinearDamping(value) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
      }
    }, {
      key: "setAngularDamping",
      value: function setAngularDamping(value) {
        this.impl.setDamping(this._rigidBody.linearDamping, this._rigidBody.angularDamping);
      }
    }, {
      key: "setIsKinematic",
      value: function setIsKinematic(value) {
        var m_collisionFlags = this.impl.getCollisionFlags();

        if (value) {
          m_collisionFlags |= _ammoEnum.AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
        } else {
          m_collisionFlags &= ~_ammoEnum.AmmoCollisionFlags.CF_KINEMATIC_OBJECT;
        }

        this.impl.setCollisionFlags(m_collisionFlags);
      }
    }, {
      key: "useGravity",
      value: function useGravity(value) {
        var m_rigidBodyFlag = this.impl.getFlags();

        if (value) {
          m_rigidBodyFlag &= ~_ammoEnum.AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        } else {
          this.impl.setGravity((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, _index.Vec3.ZERO));
          m_rigidBodyFlag |= _ammoEnum.AmmoRigidBodyFlags.BT_DISABLE_WORLD_GRAVITY;
        }

        this.impl.setFlags(m_rigidBodyFlag);

        this._wakeUpIfSleep();

        this._sharedBody.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
      }
    }, {
      key: "fixRotation",
      value: function fixRotation(value) {
        if (value) {
          /** TODO : should i reset angular velocity & torque ? */
          this.impl.setAngularFactor((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, _index.Vec3.ZERO));
        } else {
          this.impl.setAngularFactor((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, this._rigidBody.angularFactor));
        }

        this._wakeUpIfSleep();
      }
    }, {
      key: "setLinearFactor",
      value: function setLinearFactor(value) {
        this.impl.setLinearFactor((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, value));

        this._wakeUpIfSleep();
      }
    }, {
      key: "setAngularFactor",
      value: function setAngularFactor(value) {
        if (!this._rigidBody.fixedRotation) {
          this.impl.setAngularFactor((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, value));
        }

        this._wakeUpIfSleep();
      }
    }, {
      key: "setAllowSleep",
      value: function setAllowSleep(v) {
        if (v) {
          this.impl.forceActivationState(_ammoEnum.AmmoCollisionObjectStates.ACTIVE_TAG);
        } else {
          this.impl.forceActivationState(_ammoEnum.AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        }

        this._wakeUpIfSleep();
      }
    }, {
      key: "isAwake",
      get: function get() {
        var state = this.impl.getActivationState();
        return state == _ammoEnum.AmmoCollisionObjectStates.ACTIVE_TAG || state == _ammoEnum.AmmoCollisionObjectStates.DISABLE_DEACTIVATION;
      }
    }, {
      key: "isSleepy",
      get: function get() {
        var state = this.impl.getActivationState();
        return state == _ammoEnum.AmmoCollisionObjectStates.WANTS_DEACTIVATION;
      }
    }, {
      key: "isSleeping",
      get: function get() {
        var state = this.impl.getActivationState();
        return state == _ammoEnum.AmmoCollisionObjectStates.ISLAND_SLEEPING;
      }
    }, {
      key: "isEnabled",
      get: function get() {
        return this._isEnabled;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._sharedBody.body;
      }
    }, {
      key: "rigidBody",
      get: function get() {
        return this._rigidBody;
      }
    }, {
      key: "sharedBody",
      get: function get() {
        return this._sharedBody;
      }
    }]);

    function AmmoRigidBody() {
      _classCallCheck(this, AmmoRigidBody);

      this.id = void 0;
      this._isEnabled = false;
      this.id = AmmoRigidBody.idCounter++;
    }

    _createClass(AmmoRigidBody, [{
      key: "clearState",
      value: function clearState() {
        this.impl.clearState();
      }
    }, {
      key: "clearVelocity",
      value: function clearVelocity() {
        this.setLinearVelocity(_index.Vec3.ZERO);
        this.setAngularVelocity(_index.Vec3.ZERO);
      }
    }, {
      key: "clearForces",
      value: function clearForces() {
        this.impl.clearForces();
      }
      /** LIFECYCLE */

    }, {
      key: "initialize",
      value: function initialize(com) {
        this._rigidBody = com;
        this._sharedBody = _physicsFramework.PhysicsSystem.instance.physicsWorld.getSharedBody(this._rigidBody.node, this);
        this._sharedBody.reference = true;
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._isEnabled = true;
        this.setGroup(this._rigidBody.group);

        if (_physicsFramework.PhysicsSystem.instance.useCollisionMatrix) {
          this.setMask(_physicsFramework.PhysicsSystem.instance.collisionMatrix[this._rigidBody.group]);
        }

        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.setIsKinematic(this._rigidBody.isKinematic);
        this.fixRotation(this._rigidBody.fixedRotation);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this.useGravity(this._rigidBody.useGravity);
        this._sharedBody.bodyEnabled = true;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._isEnabled = false;
        this._sharedBody.bodyEnabled = false;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._sharedBody.reference = false;
        this._rigidBody = null;
        this._sharedBody = null;
      }
      /** INTERFACE */

    }, {
      key: "wakeUp",
      value: function wakeUp() {
        var force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
        this.impl.activate(force);
      }
    }, {
      key: "sleep",
      value: function sleep() {
        return this.impl.wantsSleeping();
      }
    }, {
      key: "setSleepThreshold",
      value: function setSleepThreshold(v) {
        this._wakeUpIfSleep();

        this.impl.setSleepingThresholds(v, v);
      }
    }, {
      key: "getSleepThreshold",
      value: function getSleepThreshold() {
        return this.impl['getLinearSleepingThreshold']();
      }
      /** type */

    }, {
      key: "getType",
      value: function getType() {
        if (this.impl.isStaticOrKinematicObject()) {
          if (this.impl.isKinematicObject()) {
            return _physicsEnum.ERigidBodyType.KINEMATIC;
          } else {
            return _physicsEnum.ERigidBodyType.STATIC;
          }
        } else {
          return _physicsEnum.ERigidBodyType.DYNAMIC;
        }
      }
      /** kinematic */

    }, {
      key: "getLinearVelocity",
      value: function getLinearVelocity(out) {
        return (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.getLinearVelocity());
      }
    }, {
      key: "setLinearVelocity",
      value: function setLinearVelocity(value) {
        this._wakeUpIfSleep();

        (0, _ammoUtil.cocos2AmmoVec3)(this.impl.getLinearVelocity(), value);
      }
    }, {
      key: "getAngularVelocity",
      value: function getAngularVelocity(out) {
        return (0, _ammoUtil.ammo2CocosVec3)(out, this.impl.getAngularVelocity());
      }
    }, {
      key: "setAngularVelocity",
      value: function setAngularVelocity(value) {
        this._wakeUpIfSleep();

        (0, _ammoUtil.cocos2AmmoVec3)(this.impl.getAngularVelocity(), value);
      }
      /** dynamic */

    }, {
      key: "applyLocalForce",
      value: function applyLocalForce(force, rel_pos) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        var quat = this._sharedBody.node.worldRotation;

        var v = _index.Vec3.transformQuat(v3_0, force, quat);

        var rp = rel_pos ? _index.Vec3.transformQuat(v3_1, rel_pos, quat) : _index.Vec3.ZERO;
        this.impl.applyForce((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, v), (0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_1, rp));
      }
    }, {
      key: "applyLocalTorque",
      value: function applyLocalTorque(torque) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        _index.Vec3.transformQuat(v3_0, torque, this._sharedBody.node.worldRotation);

        this.impl.applyTorque((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, v3_0));
      }
    }, {
      key: "applyLocalImpulse",
      value: function applyLocalImpulse(impulse, rel_pos) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        var quat = this._sharedBody.node.worldRotation;

        var v = _index.Vec3.transformQuat(v3_0, impulse, quat);

        var rp = rel_pos ? _index.Vec3.transformQuat(v3_1, rel_pos, quat) : _index.Vec3.ZERO;
        this.impl.applyImpulse((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, v), (0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_1, rp));
      }
    }, {
      key: "applyForce",
      value: function applyForce(force, rel_pos) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        var rp = rel_pos ? rel_pos : _index.Vec3.ZERO;
        this.impl.applyForce((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, force), (0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_1, rp));
      }
    }, {
      key: "applyTorque",
      value: function applyTorque(torque) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        this.impl.applyTorque((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, torque));
      }
    }, {
      key: "applyImpulse",
      value: function applyImpulse(impulse, rel_pos) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        var rp = rel_pos ? rel_pos : _index.Vec3.ZERO;
        this.impl.applyImpulse((0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_0, impulse), (0, _ammoUtil.cocos2AmmoVec3)(_ammoConst.AmmoConstant.instance.VECTOR3_1, rp));
      }
      /** group mask */

    }, {
      key: "getGroup",
      value: function getGroup() {
        return this._sharedBody.collisionFilterGroup;
      }
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this._sharedBody.collisionFilterGroup = v;
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this._sharedBody.collisionFilterGroup |= v;
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this._sharedBody.collisionFilterGroup &= ~v;
      }
    }, {
      key: "getMask",
      value: function getMask() {
        return this._sharedBody.collisionFilterMask;
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this._sharedBody.collisionFilterMask = v;
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this._sharedBody.collisionFilterMask |= v;
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this._sharedBody.collisionFilterMask &= ~v;
      }
    }, {
      key: "_wakeUpIfSleep",
      value: function _wakeUpIfSleep() {
        if (!this.isAwake) this.impl.activate(true);
      }
    }]);

    return AmmoRigidBody;
  }();

  _exports.AmmoRigidBody = AmmoRigidBody;
  AmmoRigidBody.idCounter = 0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLXJpZ2lkLWJvZHkudHMiXSwibmFtZXMiOlsidjNfMCIsIkNDX1YzXzAiLCJ2M18xIiwiQ0NfVjNfMSIsIkFtbW9SaWdpZEJvZHkiLCJ2YWx1ZSIsImxvY2FsSW5lcnRpYSIsIkFtbW9Db25zdGFudCIsImluc3RhbmNlIiwiVkVDVE9SM18wIiwic2V0VmFsdWUiLCJzaGFwZSIsImltcGwiLCJnZXRDb2xsaXNpb25TaGFwZSIsImlzQ29tcG91bmQiLCJfc2hhcmVkQm9keSIsImJvZHlDb21wb3VuZFNoYXBlIiwiZ2V0TnVtQ2hpbGRTaGFwZXMiLCJjYWxjdWxhdGVMb2NhbEluZXJ0aWEiLCJfcmlnaWRCb2R5IiwibWFzcyIsInNldE1hc3NQcm9wcyIsIl93YWtlVXBJZlNsZWVwIiwiZGlydHkiLCJFQW1tb1NoYXJlZEJvZHlEaXJ0eSIsIkJPRFlfUkVfQUREIiwic2V0RGFtcGluZyIsImxpbmVhckRhbXBpbmciLCJhbmd1bGFyRGFtcGluZyIsIm1fY29sbGlzaW9uRmxhZ3MiLCJnZXRDb2xsaXNpb25GbGFncyIsIkFtbW9Db2xsaXNpb25GbGFncyIsIkNGX0tJTkVNQVRJQ19PQkpFQ1QiLCJzZXRDb2xsaXNpb25GbGFncyIsIm1fcmlnaWRCb2R5RmxhZyIsImdldEZsYWdzIiwiQW1tb1JpZ2lkQm9keUZsYWdzIiwiQlRfRElTQUJMRV9XT1JMRF9HUkFWSVRZIiwic2V0R3Jhdml0eSIsIlZlYzMiLCJaRVJPIiwic2V0RmxhZ3MiLCJzZXRBbmd1bGFyRmFjdG9yIiwiYW5ndWxhckZhY3RvciIsInNldExpbmVhckZhY3RvciIsImZpeGVkUm90YXRpb24iLCJ2IiwiZm9yY2VBY3RpdmF0aW9uU3RhdGUiLCJBbW1vQ29sbGlzaW9uT2JqZWN0U3RhdGVzIiwiQUNUSVZFX1RBRyIsIkRJU0FCTEVfREVBQ1RJVkFUSU9OIiwic3RhdGUiLCJnZXRBY3RpdmF0aW9uU3RhdGUiLCJXQU5UU19ERUFDVElWQVRJT04iLCJJU0xBTkRfU0xFRVBJTkciLCJfaXNFbmFibGVkIiwiYm9keSIsImlkIiwiaWRDb3VudGVyIiwiY2xlYXJTdGF0ZSIsInNldExpbmVhclZlbG9jaXR5Iiwic2V0QW5ndWxhclZlbG9jaXR5IiwiY2xlYXJGb3JjZXMiLCJjb20iLCJQaHlzaWNzU3lzdGVtIiwicGh5c2ljc1dvcmxkIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJyZWZlcmVuY2UiLCJzZXRHcm91cCIsImdyb3VwIiwidXNlQ29sbGlzaW9uTWF0cml4Iiwic2V0TWFzayIsImNvbGxpc2lvbk1hdHJpeCIsInNldE1hc3MiLCJzZXRBbGxvd1NsZWVwIiwiYWxsb3dTbGVlcCIsInNldExpbmVhckRhbXBpbmciLCJzZXRBbmd1bGFyRGFtcGluZyIsInNldElzS2luZW1hdGljIiwiaXNLaW5lbWF0aWMiLCJmaXhSb3RhdGlvbiIsImxpbmVhckZhY3RvciIsInVzZUdyYXZpdHkiLCJib2R5RW5hYmxlZCIsImZvcmNlIiwiYWN0aXZhdGUiLCJ3YW50c1NsZWVwaW5nIiwic2V0U2xlZXBpbmdUaHJlc2hvbGRzIiwiaXNTdGF0aWNPcktpbmVtYXRpY09iamVjdCIsImlzS2luZW1hdGljT2JqZWN0IiwiRVJpZ2lkQm9keVR5cGUiLCJLSU5FTUFUSUMiLCJTVEFUSUMiLCJEWU5BTUlDIiwib3V0IiwiZ2V0TGluZWFyVmVsb2NpdHkiLCJnZXRBbmd1bGFyVmVsb2NpdHkiLCJyZWxfcG9zIiwic3luY1NjZW5lVG9QaHlzaWNzIiwicXVhdCIsIndvcmxkUm90YXRpb24iLCJ0cmFuc2Zvcm1RdWF0IiwicnAiLCJhcHBseUZvcmNlIiwiVkVDVE9SM18xIiwidG9ycXVlIiwiYXBwbHlUb3JxdWUiLCJpbXB1bHNlIiwiYXBwbHlJbXB1bHNlIiwiY29sbGlzaW9uRmlsdGVyR3JvdXAiLCJjb2xsaXNpb25GaWx0ZXJNYXNrIiwiaXNBd2FrZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFZQSxNQUFN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QUFpQitGLG9CQUFqQixHQUF3Q2hFLENBQXhDO0FBQ0g7OzsrQkFFU0EsQyxFQUFpQjtBQUN2QixhQUFLL0IsV0FBTCxDQUFpQitGLG9CQUFqQixJQUF5Q2hFLENBQXpDO0FBQ0g7OztrQ0FFWUEsQyxFQUFpQjtBQUMxQixhQUFLL0IsV0FBTCxDQUFpQitGLG9CQUFqQixJQUF5QyxDQUFDaEUsQ0FBMUM7QUFDSDs7O2dDQUVrQjtBQUNmLGVBQU8sS0FBSy9CLFdBQUwsQ0FBaUJnRyxtQkFBeEI7QUFDSDs7OzhCQUVRakUsQyxFQUFpQjtBQUN0QixhQUFLL0IsV0FBTCxDQUFpQmdHLG1CQUFqQixHQUF1Q2pFLENBQXZDO0FBQ0g7Ozs4QkFFUUEsQyxFQUFpQjtBQUN0QixhQUFLL0IsV0FBTCxDQUFpQmdHLG1CQUFqQixJQUF3Q2pFLENBQXhDO0FBQ0g7OztpQ0FFV0EsQyxFQUFpQjtBQUN6QixhQUFLL0IsV0FBTCxDQUFpQmdHLG1CQUFqQixJQUF3QyxDQUFDakUsQ0FBekM7QUFDSDs7O3VDQUUyQjtBQUN4QixZQUFJLENBQUMsS0FBS2tFLE9BQVYsRUFBbUIsS0FBS3BHLElBQUwsQ0FBVTBFLFFBQVYsQ0FBbUIsSUFBbkI7QUFDdEI7Ozs7Ozs7QUF2VFFsRixFQUFBQSxhLENBdUdNc0QsUyxHQUFZLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgVmVjMywgTm9kZSB9IGZyb20gXCIuLi8uLi9jb3JlXCI7XHJcbmltcG9ydCB7IEFtbW9Xb3JsZCB9IGZyb20gXCIuL2FtbW8td29ybGRcIjtcclxuaW1wb3J0IHsgY29jb3MyQW1tb1ZlYzMsIGFtbW8yQ29jb3NWZWMzIH0gZnJvbSBcIi4vYW1tby11dGlsXCI7XHJcbmltcG9ydCB7IFJpZ2lkQm9keSwgUGh5c2ljc1N5c3RlbSB9IGZyb20gJy4uLy4uLy4uL2V4cG9ydHMvcGh5c2ljcy1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBBbW1vQ29sbGlzaW9uRmxhZ3MsIEFtbW9SaWdpZEJvZHlGbGFncywgQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcywgRUFtbW9TaGFyZWRCb2R5RGlydHkgfSBmcm9tICcuL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IElSaWdpZEJvZHkgfSBmcm9tICcuLi9zcGVjL2ktcmlnaWQtYm9keSc7XHJcbmltcG9ydCB7IEVSaWdpZEJvZHlUeXBlIH0gZnJvbSAnLi4vZnJhbWV3b3JrL3BoeXNpY3MtZW51bSc7XHJcbmltcG9ydCB7IEFtbW9TaGFyZWRCb2R5IH0gZnJvbSAnLi9hbW1vLXNoYXJlZC1ib2R5JztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgQW1tb0NvbnN0YW50LCBDQ19WM18wLCBDQ19WM18xIH0gZnJvbSAnLi9hbW1vLWNvbnN0JztcclxuXHJcbmNvbnN0IHYzXzAgPSBDQ19WM18wO1xyXG5jb25zdCB2M18xID0gQ0NfVjNfMTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vUmlnaWRCb2R5IGltcGxlbWVudHMgSVJpZ2lkQm9keSB7XHJcblxyXG4gICAgZ2V0IGlzQXdha2UgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5pbXBsLmdldEFjdGl2YXRpb25TdGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBBbW1vQ29sbGlzaW9uT2JqZWN0U3RhdGVzLkFDVElWRV9UQUcgfHxcclxuICAgICAgICAgICAgc3RhdGUgPT0gQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcy5ESVNBQkxFX0RFQUNUSVZBVElPTjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNTbGVlcHkgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5pbXBsLmdldEFjdGl2YXRpb25TdGF0ZSgpO1xyXG4gICAgICAgIHJldHVybiBzdGF0ZSA9PSBBbW1vQ29sbGlzaW9uT2JqZWN0U3RhdGVzLldBTlRTX0RFQUNUSVZBVElPTjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNTbGVlcGluZyAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmltcGwuZ2V0QWN0aXZhdGlvblN0YXRlKCk7XHJcbiAgICAgICAgcmV0dXJuIHN0YXRlID09IEFtbW9Db2xsaXNpb25PYmplY3RTdGF0ZXMuSVNMQU5EX1NMRUVQSU5HO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE1hc3MgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9zdHVkaW9mcmV5YS5jb20vZ2FtZS1tYWtlci9idWxsZXQtcGh5c2ljcy9idWxsZXQtcGh5c2ljcy1ob3ctdG8tY2hhbmdlLWJvZHktbWFzcy9cclxuICAgICAgICBjb25zdCBsb2NhbEluZXJ0aWEgPSBBbW1vQ29uc3RhbnQuaW5zdGFuY2UuVkVDVE9SM18wO1xyXG4gICAgICAgIC8vIGNvbnN0IGxvY2FsSW5lcnRpYSA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keVN0cnVjdC5sb2NhbEluZXJ0aWE7XHJcbiAgICAgICAgbG9jYWxJbmVydGlhLnNldFZhbHVlKDEuNjY2NjY2NjI2OTMwMjM2OCwgMS42NjY2NjY2MjY5MzAyMzY4LCAxLjY2NjY2NjYyNjkzMDIzNjgpO1xyXG4gICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5pbXBsLmdldENvbGxpc2lvblNoYXBlKCk7XHJcbiAgICAgICAgaWYgKHNoYXBlLmlzQ29tcG91bmQoKSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc2hhcmVkQm9keS5ib2R5Q29tcG91bmRTaGFwZS5nZXROdW1DaGlsZFNoYXBlcygpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgc2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKHRoaXMuX3JpZ2lkQm9keS5tYXNzLCBsb2NhbEluZXJ0aWEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2hhcGUuY2FsY3VsYXRlTG9jYWxJbmVydGlhKHRoaXMuX3JpZ2lkQm9keS5tYXNzLCBsb2NhbEluZXJ0aWEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmltcGwuc2V0TWFzc1Byb3BzKHZhbHVlLCBsb2NhbEluZXJ0aWEpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmRpcnR5IHw9IEVBbW1vU2hhcmVkQm9keURpcnR5LkJPRFlfUkVfQUREO1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVhckRhbXBpbmcgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmltcGwuc2V0RGFtcGluZyh0aGlzLl9yaWdpZEJvZHkubGluZWFyRGFtcGluZywgdGhpcy5fcmlnaWRCb2R5LmFuZ3VsYXJEYW1waW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBbmd1bGFyRGFtcGluZyAodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW1wbC5zZXREYW1waW5nKHRoaXMuX3JpZ2lkQm9keS5saW5lYXJEYW1waW5nLCB0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckRhbXBpbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldElzS2luZW1hdGljICh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgIGxldCBtX2NvbGxpc2lvbkZsYWdzID0gdGhpcy5pbXBsLmdldENvbGxpc2lvbkZsYWdzKCk7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1fY29sbGlzaW9uRmxhZ3MgfD0gQW1tb0NvbGxpc2lvbkZsYWdzLkNGX0tJTkVNQVRJQ19PQkpFQ1Q7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbV9jb2xsaXNpb25GbGFncyAmPSAofkFtbW9Db2xsaXNpb25GbGFncy5DRl9LSU5FTUFUSUNfT0JKRUNUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldENvbGxpc2lvbkZsYWdzKG1fY29sbGlzaW9uRmxhZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIHVzZUdyYXZpdHkgKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgbGV0IG1fcmlnaWRCb2R5RmxhZyA9IHRoaXMuaW1wbC5nZXRGbGFncygpXHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIG1fcmlnaWRCb2R5RmxhZyAmPSAofkFtbW9SaWdpZEJvZHlGbGFncy5CVF9ESVNBQkxFX1dPUkxEX0dSQVZJVFkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRHcmF2aXR5KGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIFZlYzMuWkVSTykpO1xyXG4gICAgICAgICAgICBtX3JpZ2lkQm9keUZsYWcgfD0gQW1tb1JpZ2lkQm9keUZsYWdzLkJUX0RJU0FCTEVfV09STERfR1JBVklUWTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldEZsYWdzKG1fcmlnaWRCb2R5RmxhZyk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZGlydHkgfD0gRUFtbW9TaGFyZWRCb2R5RGlydHkuQk9EWV9SRV9BREQ7XHJcbiAgICB9XHJcblxyXG4gICAgZml4Um90YXRpb24gKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIC8qKiBUT0RPIDogc2hvdWxkIGkgcmVzZXQgYW5ndWxhciB2ZWxvY2l0eSAmIHRvcnF1ZSA/ICovXHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRBbmd1bGFyRmFjdG9yKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIFZlYzMuWkVSTykpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRBbmd1bGFyRmFjdG9yKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIHRoaXMuX3JpZ2lkQm9keS5hbmd1bGFyRmFjdG9yKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaW5lYXJGYWN0b3IgKHZhbHVlOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICB0aGlzLmltcGwuc2V0TGluZWFyRmFjdG9yKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIHZhbHVlKSk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFuZ3VsYXJGYWN0b3IgKHZhbHVlOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3JpZ2lkQm9keS5maXhlZFJvdGF0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW1wbC5zZXRBbmd1bGFyRmFjdG9yKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIHZhbHVlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBbGxvd1NsZWVwICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLmZvcmNlQWN0aXZhdGlvblN0YXRlKEFtbW9Db2xsaXNpb25PYmplY3RTdGF0ZXMuQUNUSVZFX1RBRyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLmZvcmNlQWN0aXZhdGlvblN0YXRlKEFtbW9Db2xsaXNpb25PYmplY3RTdGF0ZXMuRElTQUJMRV9ERUFDVElWQVRJT04pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzRW5hYmxlZCAoKSB7IHJldHVybiB0aGlzLl9pc0VuYWJsZWQ7IH1cclxuICAgIGdldCBpbXBsICgpIHsgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keTsgfVxyXG4gICAgZ2V0IHJpZ2lkQm9keSAoKSB7IHJldHVybiB0aGlzLl9yaWdpZEJvZHk7IH1cclxuICAgIGdldCBzaGFyZWRCb2R5ICgpIHsgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHk7IH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBpZENvdW50ZXIgPSAwO1xyXG4gICAgcmVhZG9ubHkgaWQ6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIF9pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIHByaXZhdGUgX3NoYXJlZEJvZHkhOiBBbW1vU2hhcmVkQm9keTtcclxuICAgIHByaXZhdGUgX3JpZ2lkQm9keSE6IFJpZ2lkQm9keTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IEFtbW9SaWdpZEJvZHkuaWRDb3VudGVyKys7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXJTdGF0ZSAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNsZWFyU3RhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhclZlbG9jaXR5ICgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLnNldExpbmVhclZlbG9jaXR5KFZlYzMuWkVSTyk7XHJcbiAgICAgICAgdGhpcy5zZXRBbmd1bGFyVmVsb2NpdHkoVmVjMy5aRVJPKTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhckZvcmNlcyAoKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNsZWFyRm9yY2VzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIExJRkVDWUNMRSAqL1xyXG5cclxuICAgIGluaXRpYWxpemUgKGNvbTogUmlnaWRCb2R5KSB7XHJcbiAgICAgICAgdGhpcy5fcmlnaWRCb2R5ID0gY29tO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5waHlzaWNzV29ybGQgYXMgQW1tb1dvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX3JpZ2lkQm9keS5ub2RlIGFzIE5vZGUsIHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNldEdyb3VwKHRoaXMuX3JpZ2lkQm9keS5ncm91cCk7XHJcbiAgICAgICAgaWYgKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UudXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TWFzayhQaHlzaWNzU3lzdGVtLmluc3RhbmNlLmNvbGxpc2lvbk1hdHJpeFt0aGlzLl9yaWdpZEJvZHkuZ3JvdXBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRNYXNzKHRoaXMuX3JpZ2lkQm9keS5tYXNzKTtcclxuICAgICAgICB0aGlzLnNldEFsbG93U2xlZXAodGhpcy5fcmlnaWRCb2R5LmFsbG93U2xlZXApO1xyXG4gICAgICAgIHRoaXMuc2V0TGluZWFyRGFtcGluZyh0aGlzLl9yaWdpZEJvZHkubGluZWFyRGFtcGluZyk7XHJcbiAgICAgICAgdGhpcy5zZXRBbmd1bGFyRGFtcGluZyh0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckRhbXBpbmcpO1xyXG4gICAgICAgIHRoaXMuc2V0SXNLaW5lbWF0aWModGhpcy5fcmlnaWRCb2R5LmlzS2luZW1hdGljKTtcclxuICAgICAgICB0aGlzLmZpeFJvdGF0aW9uKHRoaXMuX3JpZ2lkQm9keS5maXhlZFJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnNldExpbmVhckZhY3Rvcih0aGlzLl9yaWdpZEJvZHkubGluZWFyRmFjdG9yKTtcclxuICAgICAgICB0aGlzLnNldEFuZ3VsYXJGYWN0b3IodGhpcy5fcmlnaWRCb2R5LmFuZ3VsYXJGYWN0b3IpO1xyXG4gICAgICAgIHRoaXMudXNlR3Jhdml0eSh0aGlzLl9yaWdpZEJvZHkudXNlR3Jhdml0eSk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ib2R5RW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmJvZHlFbmFibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xyXG4gICAgICAgICh0aGlzLl9yaWdpZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX3NoYXJlZEJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIElOVEVSRkFDRSAqL1xyXG5cclxuICAgIHdha2VVcCAoZm9yY2UgPSB0cnVlKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmFjdGl2YXRlKGZvcmNlKTtcclxuICAgIH1cclxuXHJcbiAgICBzbGVlcCAoKTogdm9pZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1wbC53YW50c1NsZWVwaW5nKCkgYXMgYW55O1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNsZWVwVGhyZXNob2xkICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNldFNsZWVwaW5nVGhyZXNob2xkcyh2LCB2KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTbGVlcFRocmVzaG9sZCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsWydnZXRMaW5lYXJTbGVlcGluZ1RocmVzaG9sZCddKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIHR5cGUgKi9cclxuXHJcbiAgICBnZXRUeXBlICgpOiBFUmlnaWRCb2R5VHlwZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbC5pc1N0YXRpY09yS2luZW1hdGljT2JqZWN0KCkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW1wbC5pc0tpbmVtYXRpY09iamVjdCgpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRVJpZ2lkQm9keVR5cGUuS0lORU1BVElDXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gRVJpZ2lkQm9keVR5cGUuU1RBVElDXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gRVJpZ2lkQm9keVR5cGUuRFlOQU1JQ1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKioga2luZW1hdGljICovXHJcblxyXG4gICAgZ2V0TGluZWFyVmVsb2NpdHkgKG91dDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBhbW1vMkNvY29zVmVjMyhvdXQsIHRoaXMuaW1wbC5nZXRMaW5lYXJWZWxvY2l0eSgpKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRMaW5lYXJWZWxvY2l0eSAodmFsdWU6IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKCk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5pbXBsLmdldExpbmVhclZlbG9jaXR5KCksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBbmd1bGFyVmVsb2NpdHkgKG91dDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiBhbW1vMkNvY29zVmVjMyhvdXQsIHRoaXMuaW1wbC5nZXRBbmd1bGFyVmVsb2NpdHkoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5ndWxhclZlbG9jaXR5ICh2YWx1ZTogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh0aGlzLmltcGwuZ2V0QW5ndWxhclZlbG9jaXR5KCksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKiogZHluYW1pYyAqL1xyXG5cclxuICAgIGFwcGx5TG9jYWxGb3JjZSAoZm9yY2U6IFZlYzMsIHJlbF9wb3M/OiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKCk7XHJcbiAgICAgICAgY29uc3QgcXVhdCA9IHRoaXMuX3NoYXJlZEJvZHkubm9kZS53b3JsZFJvdGF0aW9uO1xyXG4gICAgICAgIGNvbnN0IHYgPSBWZWMzLnRyYW5zZm9ybVF1YXQodjNfMCwgZm9yY2UsIHF1YXQpO1xyXG4gICAgICAgIGNvbnN0IHJwID0gcmVsX3BvcyA/IFZlYzMudHJhbnNmb3JtUXVhdCh2M18xLCByZWxfcG9zLCBxdWF0KSA6IFZlYzMuWkVSTztcclxuICAgICAgICB0aGlzLmltcGwuYXBwbHlGb3JjZShcclxuICAgICAgICAgICAgY29jb3MyQW1tb1ZlYzMoQW1tb0NvbnN0YW50Lmluc3RhbmNlLlZFQ1RPUjNfMCwgdiksXHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzEsIHJwKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUxvY2FsVG9ycXVlICh0b3JxdWU6IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQodjNfMCwgdG9ycXVlLCB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5pbXBsLmFwcGx5VG9ycXVlKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIHYzXzApKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUxvY2FsSW1wdWxzZSAoaW1wdWxzZTogVmVjMywgcmVsX3Bvcz86IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICBjb25zdCBxdWF0ID0gdGhpcy5fc2hhcmVkQm9keS5ub2RlLndvcmxkUm90YXRpb247XHJcbiAgICAgICAgY29uc3QgdiA9IFZlYzMudHJhbnNmb3JtUXVhdCh2M18wLCBpbXB1bHNlLCBxdWF0KTtcclxuICAgICAgICBjb25zdCBycCA9IHJlbF9wb3MgPyBWZWMzLnRyYW5zZm9ybVF1YXQodjNfMSwgcmVsX3BvcywgcXVhdCkgOiBWZWMzLlpFUk87XHJcbiAgICAgICAgdGhpcy5pbXBsLmFwcGx5SW1wdWxzZShcclxuICAgICAgICAgICAgY29jb3MyQW1tb1ZlYzMoQW1tb0NvbnN0YW50Lmluc3RhbmNlLlZFQ1RPUjNfMCwgdiksXHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzEsIHJwKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUZvcmNlIChmb3JjZTogVmVjMywgcmVsX3Bvcz86IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICBjb25zdCBycCA9IHJlbF9wb3MgPyByZWxfcG9zIDogVmVjMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuaW1wbC5hcHBseUZvcmNlKFxyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyhBbW1vQ29uc3RhbnQuaW5zdGFuY2UuVkVDVE9SM18wLCBmb3JjZSksXHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzEsIHJwKVxyXG4gICAgICAgIClcclxuICAgIH1cclxuXHJcbiAgICBhcHBseVRvcnF1ZSAodG9ycXVlOiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKCk7XHJcbiAgICAgICAgdGhpcy5pbXBsLmFwcGx5VG9ycXVlKGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIHRvcnF1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFwcGx5SW1wdWxzZSAoaW1wdWxzZTogVmVjMywgcmVsX3Bvcz86IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKTtcclxuICAgICAgICBjb25zdCBycCA9IHJlbF9wb3MgPyByZWxfcG9zIDogVmVjMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuaW1wbC5hcHBseUltcHVsc2UoXHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9WZWMzKEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzAsIGltcHVsc2UpLFxyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyhBbW1vQ29uc3RhbnQuaW5zdGFuY2UuVkVDVE9SM18xLCBycClcclxuICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdyb3VwIG1hc2sgKi9cclxuICAgIGdldEdyb3VwICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5jb2xsaXNpb25GaWx0ZXJHcm91cCB8PSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwICY9IH52O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1hc2sgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzaztcclxuICAgIH1cclxuXHJcbiAgICBzZXRNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlck1hc2sgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzayB8PSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzayAmPSB+djtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3dha2VVcElmU2xlZXAgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc0F3YWtlKSB0aGlzLmltcGwuYWN0aXZhdGUodHJ1ZSk7XHJcbiAgICB9XHJcbn1cclxuIl19