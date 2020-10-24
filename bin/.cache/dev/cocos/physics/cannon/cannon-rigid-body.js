(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../core/math/index.js", "../framework/physics-system.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../core/math/index.js"), require("../framework/physics-system.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.physicsSystem);
    global.cannonRigidBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _physicsSystem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonRigidBody = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var v3_cannon0 = new _cannon.default.Vec3();
  var v3_cannon1 = new _cannon.default.Vec3();
  /**
   * wrapped shared body
   * dynamic
   * kinematic
   */

  var CannonRigidBody = /*#__PURE__*/function () {
    function CannonRigidBody() {
      _classCallCheck(this, CannonRigidBody);

      this._isEnabled = false;
    }

    _createClass(CannonRigidBody, [{
      key: "setAllowSleep",
      value: function setAllowSleep(v) {
        this.impl.allowSleep = v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "setMass",
      value: function setMass(value) {
        this.impl.mass = value;

        if (this.impl.mass == 0) {
          this.impl.type = _cannon.default.Body.STATIC;
        } else {
          this.impl.type = this._rigidBody.isKinematic ? _cannon.default.Body.KINEMATIC : _cannon.default.Body.DYNAMIC;
        }

        this.impl.updateMassProperties();

        this._wakeUpIfSleep();
      }
    }, {
      key: "setIsKinematic",
      value: function setIsKinematic(value) {
        if (this.impl.mass == 0) {
          this.impl.type = _cannon.default.Body.STATIC;
        } else {
          if (value) {
            this.impl.type = _cannon.default.Body.KINEMATIC;
          } else {
            this.impl.type = _cannon.default.Body.DYNAMIC;
          }
        }
      }
    }, {
      key: "fixRotation",
      value: function fixRotation(value) {
        this.impl.fixedRotation = value;
        this.impl.updateMassProperties();

        this._wakeUpIfSleep();
      }
    }, {
      key: "setLinearDamping",
      value: function setLinearDamping(value) {
        this.impl.linearDamping = value;
      }
    }, {
      key: "setAngularDamping",
      value: function setAngularDamping(value) {
        this.impl.angularDamping = value;
      }
    }, {
      key: "useGravity",
      value: function useGravity(value) {
        this.impl.useGravity = value;

        this._wakeUpIfSleep();
      }
    }, {
      key: "setLinearFactor",
      value: function setLinearFactor(value) {
        _index.Vec3.copy(this.impl.linearFactor, value);

        this._wakeUpIfSleep();
      }
    }, {
      key: "setAngularFactor",
      value: function setAngularFactor(value) {
        _index.Vec3.copy(this.impl.angularFactor, value);

        this._wakeUpIfSleep();
      }
    }, {
      key: "initialize",

      /** LIFECYCLE */
      value: function initialize(com) {
        this._rigidBody = com;
        this._sharedBody = _physicsSystem.PhysicsSystem.instance.physicsWorld.getSharedBody(this._rigidBody.node);
        this._sharedBody.reference = true;
        this._sharedBody.wrappedBody = this;
      }
    }, {
      key: "onLoad",
      value: function onLoad() {}
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._isEnabled = true; // TODO: overwrite collider setGroup if runtime add.

        this.setGroup(this._rigidBody.group);

        if (_physicsSystem.PhysicsSystem.instance.useCollisionMatrix) {
          this.setMask(_physicsSystem.PhysicsSystem.instance.collisionMatrix[this._rigidBody.group]);
        }

        this.setMass(this._rigidBody.mass);
        this.setAllowSleep(this._rigidBody.allowSleep);
        this.setLinearDamping(this._rigidBody.linearDamping);
        this.setAngularDamping(this._rigidBody.angularDamping);
        this.useGravity(this._rigidBody.useGravity);
        this.setIsKinematic(this._rigidBody.isKinematic);
        this.fixRotation(this._rigidBody.fixedRotation);
        this.setLinearFactor(this._rigidBody.linearFactor);
        this.setAngularFactor(this._rigidBody.angularFactor);
        this._sharedBody.enabled = true;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._isEnabled = false;
        this._sharedBody.enabled = false;
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
      key: "clearVelocity",
      value: function clearVelocity() {
        this.impl.velocity.setZero();
        this.impl.angularVelocity.setZero();
      }
    }, {
      key: "clearForces",
      value: function clearForces() {
        this.impl.force.setZero();
        this.impl.torque.setZero();
      }
    }, {
      key: "clearState",
      value: function clearState() {
        this.clearVelocity();
        this.clearForces();
      }
    }, {
      key: "wakeUp",
      value: function wakeUp() {
        return this.impl.wakeUp();
      }
    }, {
      key: "sleep",
      value: function sleep() {
        return this.impl.sleep();
      }
    }, {
      key: "setSleepThreshold",
      value: function setSleepThreshold(v) {
        this.impl.sleepSpeedLimit = v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "getSleepThreshold",
      value: function getSleepThreshold() {
        return this.impl.sleepSpeedLimit;
      }
    }, {
      key: "getLinearVelocity",
      value: function getLinearVelocity(out) {
        _index.Vec3.copy(out, this.impl.velocity);

        return out;
      }
    }, {
      key: "setLinearVelocity",
      value: function setLinearVelocity(value) {
        this._wakeUpIfSleep();

        _index.Vec3.copy(this.impl.velocity, value);
      }
    }, {
      key: "getAngularVelocity",
      value: function getAngularVelocity(out) {
        _index.Vec3.copy(out, this.impl.angularVelocity);

        return out;
      }
    }, {
      key: "setAngularVelocity",
      value: function setAngularVelocity(value) {
        this._wakeUpIfSleep();

        _index.Vec3.copy(this.impl.angularVelocity, value);
      }
    }, {
      key: "applyForce",
      value: function applyForce(force, worldPoint) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        if (worldPoint == null) worldPoint = _index.Vec3.ZERO;
        this.impl.applyForce(_index.Vec3.copy(v3_cannon0, force), _index.Vec3.copy(v3_cannon1, worldPoint));
      }
    }, {
      key: "applyImpulse",
      value: function applyImpulse(impulse, worldPoint) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        if (worldPoint == null) worldPoint = _index.Vec3.ZERO;
        this.impl.applyImpulse(_index.Vec3.copy(v3_cannon0, impulse), _index.Vec3.copy(v3_cannon1, worldPoint));
      }
    }, {
      key: "applyLocalForce",
      value: function applyLocalForce(force, localPoint) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        if (localPoint == null) localPoint = _index.Vec3.ZERO;
        this.impl.applyLocalForce(_index.Vec3.copy(v3_cannon0, force), _index.Vec3.copy(v3_cannon1, localPoint));
      }
    }, {
      key: "applyLocalImpulse",
      value: function applyLocalImpulse(impulse, localPoint) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        if (localPoint == null) localPoint = _index.Vec3.ZERO;
        this.impl.applyLocalImpulse(_index.Vec3.copy(v3_cannon0, impulse), _index.Vec3.copy(v3_cannon1, localPoint));
      }
    }, {
      key: "applyTorque",
      value: function applyTorque(torque) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        _index.Vec3.add(this.impl.torque, this.impl.torque, torque);
      }
    }, {
      key: "applyLocalTorque",
      value: function applyLocalTorque(torque) {
        this._sharedBody.syncSceneToPhysics();

        this._wakeUpIfSleep();

        _index.Vec3.copy(v3_cannon0, torque);

        this.impl.vectorToWorldFrame(v3_cannon0, v3_cannon0);

        _index.Vec3.add(this.impl.torque, this.impl.torque, v3_cannon0);
      }
      /** group */

    }, {
      key: "getGroup",
      value: function getGroup() {
        return this.impl.collisionFilterGroup;
      }
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this.impl.collisionFilterGroup = v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this.impl.collisionFilterGroup |= v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this.impl.collisionFilterGroup &= ~v;

        this._wakeUpIfSleep();
      }
      /** mask */

    }, {
      key: "getMask",
      value: function getMask() {
        return this.impl.collisionFilterMask;
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this.impl.collisionFilterMask = v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this.impl.collisionFilterMask |= v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this.impl.collisionFilterMask &= ~v;

        this._wakeUpIfSleep();
      }
    }, {
      key: "_wakeUpIfSleep",
      value: function _wakeUpIfSleep() {
        if (!this.impl.isAwake()) this.impl.wakeUp();
      }
    }, {
      key: "isAwake",
      get: function get() {
        return this.impl.isAwake();
      }
    }, {
      key: "isSleepy",
      get: function get() {
        return this.impl.isSleepy();
      }
    }, {
      key: "isSleeping",
      get: function get() {
        return this.impl.isSleeping();
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
    }, {
      key: "isEnabled",
      get: function get() {
        return this._isEnabled;
      }
    }]);

    return CannonRigidBody;
  }();

  _exports.CannonRigidBody = CannonRigidBody;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi1yaWdpZC1ib2R5LnRzIl0sIm5hbWVzIjpbInYzX2Nhbm5vbjAiLCJDQU5OT04iLCJWZWMzIiwidjNfY2Fubm9uMSIsIkNhbm5vblJpZ2lkQm9keSIsIl9pc0VuYWJsZWQiLCJ2IiwiaW1wbCIsImFsbG93U2xlZXAiLCJfd2FrZVVwSWZTbGVlcCIsInZhbHVlIiwibWFzcyIsInR5cGUiLCJCb2R5IiwiU1RBVElDIiwiX3JpZ2lkQm9keSIsImlzS2luZW1hdGljIiwiS0lORU1BVElDIiwiRFlOQU1JQyIsInVwZGF0ZU1hc3NQcm9wZXJ0aWVzIiwiZml4ZWRSb3RhdGlvbiIsImxpbmVhckRhbXBpbmciLCJhbmd1bGFyRGFtcGluZyIsInVzZUdyYXZpdHkiLCJjb3B5IiwibGluZWFyRmFjdG9yIiwiYW5ndWxhckZhY3RvciIsImNvbSIsIl9zaGFyZWRCb2R5IiwiUGh5c2ljc1N5c3RlbSIsImluc3RhbmNlIiwicGh5c2ljc1dvcmxkIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJyZWZlcmVuY2UiLCJ3cmFwcGVkQm9keSIsInNldEdyb3VwIiwiZ3JvdXAiLCJ1c2VDb2xsaXNpb25NYXRyaXgiLCJzZXRNYXNrIiwiY29sbGlzaW9uTWF0cml4Iiwic2V0TWFzcyIsInNldEFsbG93U2xlZXAiLCJzZXRMaW5lYXJEYW1waW5nIiwic2V0QW5ndWxhckRhbXBpbmciLCJzZXRJc0tpbmVtYXRpYyIsImZpeFJvdGF0aW9uIiwic2V0TGluZWFyRmFjdG9yIiwic2V0QW5ndWxhckZhY3RvciIsImVuYWJsZWQiLCJ2ZWxvY2l0eSIsInNldFplcm8iLCJhbmd1bGFyVmVsb2NpdHkiLCJmb3JjZSIsInRvcnF1ZSIsImNsZWFyVmVsb2NpdHkiLCJjbGVhckZvcmNlcyIsIndha2VVcCIsInNsZWVwIiwic2xlZXBTcGVlZExpbWl0Iiwib3V0Iiwid29ybGRQb2ludCIsInN5bmNTY2VuZVRvUGh5c2ljcyIsIlpFUk8iLCJhcHBseUZvcmNlIiwiaW1wdWxzZSIsImFwcGx5SW1wdWxzZSIsImxvY2FsUG9pbnQiLCJhcHBseUxvY2FsRm9yY2UiLCJhcHBseUxvY2FsSW1wdWxzZSIsImFkZCIsInZlY3RvclRvV29ybGRGcmFtZSIsImNvbGxpc2lvbkZpbHRlckdyb3VwIiwiY29sbGlzaW9uRmlsdGVyTWFzayIsImlzQXdha2UiLCJpc1NsZWVweSIsImlzU2xlZXBpbmciLCJib2R5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVVBLE1BQU1BLFVBQVUsR0FBRyxJQUFJQyxnQkFBT0MsSUFBWCxFQUFuQjtBQUNBLE1BQU1DLFVBQVUsR0FBRyxJQUFJRixnQkFBT0MsSUFBWCxFQUFuQjtBQUVBOzs7Ozs7TUFLYUUsZTs7OztXQTRGREMsVSxHQUFhLEs7Ozs7O29DQTlFTkMsQyxFQUFZO0FBQ3ZCLGFBQUtDLElBQUwsQ0FBVUMsVUFBVixHQUF1QkYsQ0FBdkI7O0FBQ0EsYUFBS0csY0FBTDtBQUNIOzs7OEJBRVFDLEssRUFBZTtBQUNwQixhQUFLSCxJQUFMLENBQVVJLElBQVYsR0FBaUJELEtBQWpCOztBQUNBLFlBQUksS0FBS0gsSUFBTCxDQUFVSSxJQUFWLElBQWtCLENBQXRCLEVBQXlCO0FBQ3JCLGVBQUtKLElBQUwsQ0FBVUssSUFBVixHQUFpQlgsZ0JBQU9ZLElBQVAsQ0FBWUMsTUFBN0I7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFLUCxJQUFMLENBQVVLLElBQVYsR0FBaUIsS0FBS0csVUFBTCxDQUFnQkMsV0FBaEIsR0FBOEJmLGdCQUFPWSxJQUFQLENBQVlJLFNBQTFDLEdBQXNEaEIsZ0JBQU9ZLElBQVAsQ0FBWUssT0FBbkY7QUFDSDs7QUFFRCxhQUFLWCxJQUFMLENBQVVZLG9CQUFWOztBQUNBLGFBQUtWLGNBQUw7QUFDSDs7O3FDQUVlQyxLLEVBQWdCO0FBQzVCLFlBQUksS0FBS0gsSUFBTCxDQUFVSSxJQUFWLElBQWtCLENBQXRCLEVBQXlCO0FB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QUFDSCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBDQU5OT04gZnJvbSAnQGNvY29zL2Nhbm5vbic7XHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBJUmlnaWRCb2R5IH0gZnJvbSAnLi4vc3BlYy9pLXJpZ2lkLWJvZHknO1xyXG5pbXBvcnQgeyBDYW5ub25TaGFyZWRCb2R5IH0gZnJvbSAnLi9jYW5ub24tc2hhcmVkLWJvZHknO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vY29yZSc7XHJcbmltcG9ydCB7IENhbm5vbldvcmxkIH0gZnJvbSAnLi9jYW5ub24td29ybGQnO1xyXG5pbXBvcnQgeyBQaHlzaWNzU3lzdGVtIH0gZnJvbSAnLi4vZnJhbWV3b3JrL3BoeXNpY3Mtc3lzdGVtJztcclxuaW1wb3J0IHsgUmlnaWRCb2R5IH0gZnJvbSAnLi4vZnJhbWV3b3JrJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuXHJcbmNvbnN0IHYzX2Nhbm5vbjAgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuY29uc3QgdjNfY2Fubm9uMSA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG5cclxuLyoqXHJcbiAqIHdyYXBwZWQgc2hhcmVkIGJvZHlcclxuICogZHluYW1pY1xyXG4gKiBraW5lbWF0aWNcclxuICovXHJcbmV4cG9ydCBjbGFzcyBDYW5ub25SaWdpZEJvZHkgaW1wbGVtZW50cyBJUmlnaWRCb2R5IHtcclxuXHJcbiAgICBnZXQgaXNBd2FrZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuaW1wbC5pc0F3YWtlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzU2xlZXB5ICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsLmlzU2xlZXB5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGlzU2xlZXBpbmcgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwuaXNTbGVlcGluZygpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmltcGwuYWxsb3dTbGVlcCA9IHY7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWFzcyAodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuaW1wbC5tYXNzID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbC5tYXNzID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnR5cGUgPSBDQU5OT04uQm9keS5TVEFUSUM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnR5cGUgPSB0aGlzLl9yaWdpZEJvZHkuaXNLaW5lbWF0aWMgPyBDQU5OT04uQm9keS5LSU5FTUFUSUMgOiBDQU5OT04uQm9keS5EWU5BTUlDO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbXBsLnVwZGF0ZU1hc3NQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICB9XHJcblxyXG4gICAgc2V0SXNLaW5lbWF0aWMgKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaW1wbC5tYXNzID09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5pbXBsLnR5cGUgPSBDQU5OT04uQm9keS5TVEFUSUM7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmltcGwudHlwZSA9IENBTk5PTi5Cb2R5LktJTkVNQVRJQztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW1wbC50eXBlID0gQ0FOTk9OLkJvZHkuRFlOQU1JQztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmaXhSb3RhdGlvbiAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmltcGwuZml4ZWRSb3RhdGlvbiA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuaW1wbC51cGRhdGVNYXNzUHJvcGVydGllcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVhckRhbXBpbmcgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmltcGwubGluZWFyRGFtcGluZyA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEFuZ3VsYXJEYW1waW5nICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmFuZ3VsYXJEYW1waW5nID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgdXNlR3Jhdml0eSAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLmltcGwudXNlR3Jhdml0eSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVhckZhY3RvciAodmFsdWU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLmltcGwubGluZWFyRmFjdG9yLCB2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5ndWxhckZhY3RvciAodmFsdWU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLmltcGwuYW5ndWxhckZhY3RvciwgdmFsdWUpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkQm9keS5ib2R5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByaWdpZEJvZHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yaWdpZEJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNoYXJlZEJvZHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0VuYWJsZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0VuYWJsZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmlnaWRCb2R5ITogUmlnaWRCb2R5O1xyXG4gICAgcHJpdmF0ZSBfc2hhcmVkQm9keSE6IENhbm5vblNoYXJlZEJvZHk7XHJcblxyXG5cclxuICAgIHByaXZhdGUgX2lzRW5hYmxlZCA9IGZhbHNlO1xyXG5cclxuICAgIC8qKiBMSUZFQ1lDTEUgKi9cclxuXHJcbiAgICBpbml0aWFsaXplIChjb206IFJpZ2lkQm9keSkge1xyXG4gICAgICAgIHRoaXMuX3JpZ2lkQm9keSA9IGNvbTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5ID0gKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UucGh5c2ljc1dvcmxkIGFzIENhbm5vbldvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX3JpZ2lkQm9keS5ub2RlIGFzIE5vZGUpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5ID0gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vIFRPRE86IG92ZXJ3cml0ZSBjb2xsaWRlciBzZXRHcm91cCBpZiBydW50aW1lIGFkZC5cclxuICAgICAgICB0aGlzLnNldEdyb3VwKHRoaXMuX3JpZ2lkQm9keS5ncm91cCk7XHJcbiAgICAgICAgaWYgKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UudXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TWFzayhQaHlzaWNzU3lzdGVtLmluc3RhbmNlLmNvbGxpc2lvbk1hdHJpeFt0aGlzLl9yaWdpZEJvZHkuZ3JvdXBdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXRNYXNzKHRoaXMuX3JpZ2lkQm9keS5tYXNzKTtcclxuICAgICAgICB0aGlzLnNldEFsbG93U2xlZXAodGhpcy5fcmlnaWRCb2R5LmFsbG93U2xlZXApO1xyXG4gICAgICAgIHRoaXMuc2V0TGluZWFyRGFtcGluZyh0aGlzLl9yaWdpZEJvZHkubGluZWFyRGFtcGluZyk7XHJcbiAgICAgICAgdGhpcy5zZXRBbmd1bGFyRGFtcGluZyh0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckRhbXBpbmcpO1xyXG4gICAgICAgIHRoaXMudXNlR3Jhdml0eSh0aGlzLl9yaWdpZEJvZHkudXNlR3Jhdml0eSk7XHJcbiAgICAgICAgdGhpcy5zZXRJc0tpbmVtYXRpYyh0aGlzLl9yaWdpZEJvZHkuaXNLaW5lbWF0aWMpO1xyXG4gICAgICAgIHRoaXMuZml4Um90YXRpb24odGhpcy5fcmlnaWRCb2R5LmZpeGVkUm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuc2V0TGluZWFyRmFjdG9yKHRoaXMuX3JpZ2lkQm9keS5saW5lYXJGYWN0b3IpO1xyXG4gICAgICAgIHRoaXMuc2V0QW5ndWxhckZhY3Rvcih0aGlzLl9yaWdpZEJvZHkuYW5ndWxhckZhY3Rvcik7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIHRoaXMuX2lzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSBmYWxzZTtcclxuICAgICAgICAodGhpcy5fcmlnaWRCb2R5IGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLl9zaGFyZWRCb2R5IGFzIGFueSkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJTlRFUkZBQ0UgKi9cclxuXHJcbiAgICBjbGVhclZlbG9jaXR5ICgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwudmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgICAgIHRoaXMuaW1wbC5hbmd1bGFyVmVsb2NpdHkuc2V0WmVybygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyRm9yY2VzICgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwuZm9yY2Uuc2V0WmVybygpO1xyXG4gICAgICAgIHRoaXMuaW1wbC50b3JxdWUuc2V0WmVybygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyU3RhdGUgKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY2xlYXJWZWxvY2l0eSgpO1xyXG4gICAgICAgIHRoaXMuY2xlYXJGb3JjZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICB3YWtlVXAgKCk6IHZvaWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwud2FrZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2xlZXAgKCk6IHZvaWQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwuc2xlZXAoKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRTbGVlcFRocmVzaG9sZCAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5pbXBsLnNsZWVwU3BlZWRMaW1pdCA9IHY7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNsZWVwVGhyZXNob2xkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsLnNsZWVwU3BlZWRMaW1pdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRMaW5lYXJWZWxvY2l0eSAob3V0OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dCwgdGhpcy5pbXBsLnZlbG9jaXR5KTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIHNldExpbmVhclZlbG9jaXR5ICh2YWx1ZTogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLmltcGwudmVsb2NpdHksIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBbmd1bGFyVmVsb2NpdHkgKG91dDogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIFZlYzMuY29weShvdXQsIHRoaXMuaW1wbC5hbmd1bGFyVmVsb2NpdHkpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QW5ndWxhclZlbG9jaXR5ICh2YWx1ZTogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLmltcGwuYW5ndWxhclZlbG9jaXR5LCB2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlGb3JjZSAoZm9yY2U6IFZlYzMsIHdvcmxkUG9pbnQ/OiBWZWMzKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKClcclxuICAgICAgICBpZiAod29ybGRQb2ludCA9PSBudWxsKSB3b3JsZFBvaW50ID0gVmVjMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuaW1wbC5hcHBseUZvcmNlKFZlYzMuY29weSh2M19jYW5ub24wLCBmb3JjZSksIFZlYzMuY29weSh2M19jYW5ub24xLCB3b3JsZFBvaW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlJbXB1bHNlIChpbXB1bHNlOiBWZWMzLCB3b3JsZFBvaW50PzogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuc3luY1NjZW5lVG9QaHlzaWNzKCk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICAgICAgaWYgKHdvcmxkUG9pbnQgPT0gbnVsbCkgd29ybGRQb2ludCA9IFZlYzMuWkVSTztcclxuICAgICAgICB0aGlzLmltcGwuYXBwbHlJbXB1bHNlKFZlYzMuY29weSh2M19jYW5ub24wLCBpbXB1bHNlKSwgVmVjMy5jb3B5KHYzX2Nhbm5vbjEsIHdvcmxkUG9pbnQpKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUxvY2FsRm9yY2UgKGZvcmNlOiBWZWMzLCBsb2NhbFBvaW50PzogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuc3luY1NjZW5lVG9QaHlzaWNzKCk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICAgICAgaWYgKGxvY2FsUG9pbnQgPT0gbnVsbCkgbG9jYWxQb2ludCA9IFZlYzMuWkVSTztcclxuICAgICAgICB0aGlzLmltcGwuYXBwbHlMb2NhbEZvcmNlKFZlYzMuY29weSh2M19jYW5ub24wLCBmb3JjZSksIFZlYzMuY29weSh2M19jYW5ub24xLCBsb2NhbFBvaW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlMb2NhbEltcHVsc2UgKGltcHVsc2U6IFZlYzMsIGxvY2FsUG9pbnQ/OiBWZWMzKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKClcclxuICAgICAgICBpZiAobG9jYWxQb2ludCA9PSBudWxsKSBsb2NhbFBvaW50ID0gVmVjMy5aRVJPO1xyXG4gICAgICAgIHRoaXMuaW1wbC5hcHBseUxvY2FsSW1wdWxzZShWZWMzLmNvcHkodjNfY2Fubm9uMCwgaW1wdWxzZSksIFZlYzMuY29weSh2M19jYW5ub24xLCBsb2NhbFBvaW50KSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXBwbHlUb3JxdWUgKHRvcnF1ZTogVmVjMyk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuc3luY1NjZW5lVG9QaHlzaWNzKCk7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICAgICAgVmVjMy5hZGQodGhpcy5pbXBsLnRvcnF1ZSwgdGhpcy5pbXBsLnRvcnF1ZSwgdG9ycXVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUxvY2FsVG9ycXVlICh0b3JxdWU6IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgICAgIFZlYzMuY29weSh2M19jYW5ub24wLCB0b3JxdWUpO1xyXG4gICAgICAgIHRoaXMuaW1wbC52ZWN0b3JUb1dvcmxkRnJhbWUodjNfY2Fubm9uMCwgdjNfY2Fubm9uMCk7XHJcbiAgICAgICAgVmVjMy5hZGQodGhpcy5pbXBsLnRvcnF1ZSwgdGhpcy5pbXBsLnRvcnF1ZSwgdjNfY2Fubm9uMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdyb3VwICovXHJcbiAgICBnZXRHcm91cCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbXBsLmNvbGxpc2lvbkZpbHRlckdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwuY29sbGlzaW9uRmlsdGVyR3JvdXAgPSB2O1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIGFkZEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwuY29sbGlzaW9uRmlsdGVyR3JvdXAgfD0gdjtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKClcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNvbGxpc2lvbkZpbHRlckdyb3VwICY9IH52O1xyXG4gICAgICAgIHRoaXMuX3dha2VVcElmU2xlZXAoKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKiBtYXNrICovXHJcbiAgICBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmltcGwuY29sbGlzaW9uRmlsdGVyTWFzaztcclxuICAgIH1cclxuXHJcbiAgICBzZXRNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwuY29sbGlzaW9uRmlsdGVyTWFzayA9IHY7XHJcbiAgICAgICAgdGhpcy5fd2FrZVVwSWZTbGVlcCgpXHJcbiAgICB9XHJcblxyXG4gICAgYWRkTWFzayAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5pbXBsLmNvbGxpc2lvbkZpbHRlck1hc2sgfD0gdjtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKClcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmltcGwuY29sbGlzaW9uRmlsdGVyTWFzayAmPSB+djtcclxuICAgICAgICB0aGlzLl93YWtlVXBJZlNsZWVwKClcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3dha2VVcElmU2xlZXAgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pbXBsLmlzQXdha2UoKSkgdGhpcy5pbXBsLndha2VVcCgpO1xyXG4gICAgfVxyXG59Il19