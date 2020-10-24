(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../ammo-instantiated.js", "../../../core/math/index.js", "../../../../exports/physics-framework.js", "../ammo-enum.js", "../ammo-util.js", "../ammo-const.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../ammo-instantiated.js"), require("../../../core/math/index.js"), require("../../../../exports/physics-framework.js"), require("../ammo-enum.js"), require("../ammo-util.js"), require("../ammo-const.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.index, global.physicsFramework, global.ammoEnum, global.ammoUtil, global.ammoConst);
    global.ammoShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _index, _physicsFramework, _ammoEnum, _ammoUtil, _ammoConst) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoShape = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var v3_0 = _ammoConst.CC_V3_0;

  var AmmoShape = /*#__PURE__*/function () {
    _createClass(AmmoShape, [{
      key: "setMaterial",
      value: function setMaterial(v) {
        if (!this._isTrigger && this._isEnabled && v) {
          if (this._btCompound) {
            this._btCompound.setMaterial(this._index, v.friction, v.restitution, v.rollingFriction, v.spinningFriction);
          } else {
            this._sharedBody.body.setFriction(v.friction);

            this._sharedBody.body.setRestitution(v.restitution);

            this._sharedBody.body.setRollingFriction(v.rollingFriction);

            this._sharedBody.body.setSpinningFriction(v.spinningFriction);
          }
        }
      }
    }, {
      key: "setCenter",
      value: function setCenter(v) {
        _index.Vec3.copy(v3_0, v);

        v3_0.multiply(this._collider.node.worldScale);
        (0, _ammoUtil.cocos2AmmoVec3)(this.transform.getOrigin(), v3_0);
        this.updateCompoundTransform();
      }
    }, {
      key: "setAsTrigger",
      value: function setAsTrigger(v) {
        if (this._isTrigger == v) return;

        if (this._isEnabled) {
          this._sharedBody.removeShape(this, !v);

          this._sharedBody.addShape(this, v);
        }

        this._isTrigger = v;
      }
    }, {
      key: "attachedRigidBody",
      get: function get() {
        if (this._sharedBody.wrappedBody) {
          return this._sharedBody.wrappedBody.rigidBody;
        }

        return null;
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btShape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
    }, {
      key: "sharedBody",
      get: function get() {
        return this._sharedBody;
      }
    }, {
      key: "index",
      get: function get() {
        return this._index;
      }
    }]);

    function AmmoShape(type) {
      _classCallCheck(this, AmmoShape);

      this.id = void 0;
      this.type = void 0;
      this._index = -1;
      this._isEnabled = false;
      this._isBinding = false;
      this._isTrigger = false;
      this._btCompound = null;
      this.transform = void 0;
      this.pos = void 0;
      this.quat = void 0;
      this.scale = void 0;
      this.type = type;
      this.id = AmmoShape.idCounter++;
      this.pos = new _ammoInstantiated.default.btVector3();
      this.quat = new _ammoInstantiated.default.btQuaternion();
      this.transform = new _ammoInstantiated.default.btTransform(this.quat, this.pos);
      this.transform.setIdentity();
      this.scale = new _ammoInstantiated.default.btVector3(1, 1, 1);
    }

    _createClass(AmmoShape, [{
      key: "getAABB",
      value: function getAABB(v) {
        var TRANS = _ammoConst.AmmoConstant.instance.TRANSFORM;
        TRANS.setIdentity();
        TRANS.setRotation((0, _ammoUtil.cocos2AmmoQuat)(_ammoConst.AmmoConstant.instance.QUAT_0, this._collider.node.worldRotation));
        var MIN = _ammoConst.AmmoConstant.instance.VECTOR3_0;
        var MAX = _ammoConst.AmmoConstant.instance.VECTOR3_1;

        this._btShape.getAabb(TRANS, MIN, MAX);

        v.halfExtents.set((MAX.x() - MIN.x()) / 2, (MAX.y() - MIN.y()) / 2, (MAX.z() - MIN.z()) / 2);

        _index.Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
      }
    }, {
      key: "getBoundingSphere",
      value: function getBoundingSphere(v) {
        v.radius = this._btShape.getLocalBoundingSphere();

        _index.Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
      }
    }, {
      key: "initialize",
      value: function initialize(com) {
        this._collider = com;
        this._isBinding = true;
        this.onComponentSet();
        this.setWrapper();
        this._sharedBody = _physicsFramework.PhysicsSystem.instance.physicsWorld.getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
      } // virtual

    }, {
      key: "onComponentSet",
      value: function onComponentSet() {}
    }, {
      key: "onLoad",
      value: function onLoad() {
        this.setCenter(this._collider.center);
        this.setAsTrigger(this._collider.isTrigger);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._isEnabled = true;

        this._sharedBody.addShape(this, this._isTrigger);

        this.setMaterial(this.collider.sharedMaterial);
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._isEnabled = false;

        this._sharedBody.removeShape(this, this._isTrigger);
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._sharedBody.reference = false;
        this._btCompound = null;
        this._collider = null;

        var shape = _ammoInstantiated.default.castObject(this._btShape, _ammoInstantiated.default.btCollisionShape);

        shape['wrapped'] = null;

        _ammoInstantiated.default.destroy(this.pos);

        _ammoInstantiated.default.destroy(this.quat);

        _ammoInstantiated.default.destroy(this.scale);

        _ammoInstantiated.default.destroy(this.transform);

        _ammoInstantiated.default.destroy(this._btShape);

        (0, _ammoUtil.ammoDeletePtr)(this._btShape, _ammoInstantiated.default.btCollisionShape);
        this._btShape = null;
        this.transform = null;
        this.pos = null;
        this.quat = null;
        this.scale = null;
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
      key: "setCompound",
      value: function setCompound(compound) {
        if (this._btCompound) {
          this._btCompound.removeChildShape(this._btShape);

          this._index = -1;
        }

        if (compound) {
          this._index = compound.getNumChildShapes();
          compound.addChildShape(this.transform, this._btShape);
        }

        this._btCompound = compound;
      }
    }, {
      key: "setWrapper",
      value: function setWrapper() {
        var shape = _ammoInstantiated.default.castObject(this._btShape, _ammoInstantiated.default.btCollisionShape);

        shape['wrapped'] = this;
      }
    }, {
      key: "setScale",
      value: function setScale() {
        this.setCenter(this._collider.center);
      }
    }, {
      key: "updateCompoundTransform",
      value: function updateCompoundTransform() {
        if (this._btCompound) {
          this._btCompound.updateChildTransform(this.index, this.transform, true);
        } else if (this._isEnabled && !this._isTrigger) {
          if (this._sharedBody && !this._sharedBody.bodyStruct.useCompound) {
            this._sharedBody.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
          }
        }
      }
    }, {
      key: "needCompound",
      value: function needCompound() {
        if (this.type == _ammoEnum.AmmoBroadphaseNativeTypes.TERRAIN_SHAPE_PROXYTYPE) return true;
        if (this._collider.center.equals(_index.Vec3.ZERO)) return false;
        return true;
      }
      /**DEBUG */

    }, {
      key: "debugTransform",
      value: function debugTransform(n) {
        if (AmmoShape._debugTransform == null) {
          AmmoShape._debugTransform = new _ammoInstantiated.default.btTransform();
        }

        var wt;

        if (this._isTrigger) {
          wt = this._sharedBody.ghost.getWorldTransform();
        } else {
          wt = this._sharedBody.body.getWorldTransform();
        }

        var lt = this.transform;

        AmmoShape._debugTransform.setIdentity();

        AmmoShape._debugTransform.op_mul(wt).op_mul(lt);

        var origin = AmmoShape._debugTransform.getOrigin();

        n.worldPosition = new _index.Vec3(origin.x(), origin.y(), origin.z());

        var rotation = AmmoShape._debugTransform.getRotation();

        n.worldRotation = new _index.Quat(rotation.x(), rotation.y(), rotation.z(), rotation.w());
        var scale = this.impl.getLocalScaling();
        n.scale = new _index.Vec3(scale.x(), scale.y(), scale.z());
      }
    }]);

    return AmmoShape;
  }();

  _exports.AmmoShape = AmmoShape;
  AmmoShape.idCounter = 0;
  AmmoShape._debugTransform = void 0;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9zaGFwZXMvYW1tby1zaGFwZS50cyJdLCJuYW1lcyI6WyJ2M18wIiwiQ0NfVjNfMCIsIkFtbW9TaGFwZSIsInYiLCJfaXNUcmlnZ2VyIiwiX2lzRW5hYmxlZCIsIl9idENvbXBvdW5kIiwic2V0TWF0ZXJpYWwiLCJfaW5kZXgiLCJmcmljdGlvbiIsInJlc3RpdHV0aW9uIiwicm9sbGluZ0ZyaWN0aW9uIiwic3Bpbm5pbmdGcmljdGlvbiIsIl9zaGFyZWRCb2R5IiwiYm9keSIsInNldEZyaWN0aW9uIiwic2V0UmVzdGl0dXRpb24iLCJzZXRSb2xsaW5nRnJpY3Rpb24iLCJzZXRTcGlubmluZ0ZyaWN0aW9uIiwiVmVjMyIsImNvcHkiLCJtdWx0aXBseSIsIl9jb2xsaWRlciIsIm5vZGUiLCJ3b3JsZFNjYWxlIiwidHJhbnNmb3JtIiwiZ2V0T3JpZ2luIiwidXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0iLCJyZW1vdmVTaGFwZSIsImFkZFNoYXBlIiwid3JhcHBlZEJvZHkiLCJyaWdpZEJvZHkiLCJfYnRTaGFwZSIsInR5cGUiLCJpZCIsIl9pc0JpbmRpbmciLCJwb3MiLCJxdWF0Iiwic2NhbGUiLCJpZENvdW50ZXIiLCJBbW1vIiwiYnRWZWN0b3IzIiwiYnRRdWF0ZXJuaW9uIiwiYnRUcmFuc2Zvcm0iLCJzZXRJZGVudGl0eSIsIlRSQU5TIiwiQW1tb0NvbnN0YW50IiwiaW5zdGFuY2UiLCJUUkFOU0ZPUk0iLCJzZXRSb3RhdGlvbiIsIlFVQVRfMCIsIndvcmxkUm90YXRpb24iLCJNSU4iLCJWRUNUT1IzXzAiLCJNQVgiLCJWRUNUT1IzXzEiLCJnZXRBYWJiIiwiaGFsZkV4dGVudHMiLCJzZXQiLCJ4IiwieSIsInoiLCJhZGQiLCJjZW50ZXIiLCJ3b3JsZFBvc2l0aW9uIiwicmFkaXVzIiwiZ2V0TG9jYWxCb3VuZGluZ1NwaGVyZSIsImNvbSIsIm9uQ29tcG9uZW50U2V0Iiwic2V0V3JhcHBlciIsIlBoeXNpY3NTeXN0ZW0iLCJwaHlzaWNzV29ybGQiLCJnZXRTaGFyZWRCb2R5IiwicmVmZXJlbmNlIiwic2V0Q2VudGVyIiwic2V0QXNUcmlnZ2VyIiwiaXNUcmlnZ2VyIiwiY29sbGlkZXIiLCJzaGFyZWRNYXRlcmlhbCIsInNoYXBlIiwiY2FzdE9iamVjdCIsImJ0Q29sbGlzaW9uU2hhcGUiLCJkZXN0cm95IiwiY29sbGlzaW9uRmlsdGVyR3JvdXAiLCJjb2xsaXNpb25GaWx0ZXJNYXNrIiwiY29tcG91bmQiLCJyZW1vdmVDaGlsZFNoYXBlIiwiZ2V0TnVtQ2hpbGRTaGFwZXMiLCJhZGRDaGlsZFNoYXBlIiwidXBkYXRlQ2hpbGRUcmFuc2Zvcm0iLCJpbmRleCIsImJvZHlTdHJ1Y3QiLCJ1c2VDb21wb3VuZCIsImRpcnR5IiwiRUFtbW9TaGFyZWRCb2R5RGlydHkiLCJCT0RZX1JFX0FERCIsIkFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMiLCJURVJSQUlOX1NIQVBFX1BST1hZVFlQRSIsImVxdWFscyIsIlpFUk8iLCJuIiwiX2RlYnVnVHJhbnNmb3JtIiwid3QiLCJnaG9zdCIsImdldFdvcmxkVHJhbnNmb3JtIiwibHQiLCJvcF9tdWwiLCJvcmlnaW4iLCJyb3RhdGlvbiIsImdldFJvdGF0aW9uIiwiUXVhdCIsInciLCJpbXBsIiwiZ2V0TG9jYWxTY2FsaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWFBLE1BQU1BLElBQUksR0FBR0Msa0JBQWI7O01BRWFDLFM7OztrQ0FFSUMsQyxFQUEwQjtBQUNuQyxZQUFJLENBQUMsS0FBS0MsVUFBTixJQUFvQixLQUFLQyxVQUF6QixJQUF1Q0YsQ0FBM0MsRUFBOEM7QUFDMUMsY0FBSSxLQUFLRyxXQUFULEVBQXNCO0FBQ2xCLGlCQUFLQSxXQUFMLENBQWlCQyxXQUFqQixDQUE2QixLQUFLQyxNQUFsQyxFQUEwQ0wsQ0FBQyxDQUFDTSxRQUE1QyxFQUFzRE4sQ0FBQyxDQUFDTyxXQUF4RCxFQUFxRVAs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QVEsQ0FBQ2pELENBQVQsRUFBVCxFQUF1QmlELFFBQVEsQ0FBQ2hELENBQVQsRUFBdkIsRUFBcUNnRCxRQUFRLENBQUMvQyxDQUFULEVBQXJDLEVBQW1EK0MsUUFBUSxDQUFDRyxDQUFULEVBQW5ELENBQWxCO0FBQ0EsWUFBSXpFLEtBQUssR0FBRyxLQUFLMEUsSUFBTCxDQUFVQyxlQUFWLEVBQVo7QUFDQWIsUUFBQUEsQ0FBQyxDQUFDOUQsS0FBRixHQUFVLElBQUluQixXQUFKLENBQVNtQixLQUFLLENBQUNxQixDQUFOLEVBQVQsRUFBb0JyQixLQUFLLENBQUNzQixDQUFOLEVBQXBCLEVBQStCdEIsS0FBSyxDQUFDdUIsQ0FBTixFQUEvQixDQUFWO0FBQ0g7Ozs7Ozs7QUF4T1EzRCxFQUFBQSxTLENBMkNNcUMsUyxHQUFZLEM7QUEzQ2xCckMsRUFBQUEsUyxDQW9OTW1HLGUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuLi9hbW1vLWluc3RhbnRpYXRlZCc7XHJcbmltcG9ydCB7IFZlYzMsIFF1YXQgfSBmcm9tIFwiLi4vLi4vLi4vY29yZS9tYXRoXCI7XHJcbmltcG9ydCB7IENvbGxpZGVyLCBQaHlzaWNNYXRlcmlhbCwgUGh5c2ljc1N5c3RlbSB9IGZyb20gXCIuLi8uLi8uLi8uLi9leHBvcnRzL3BoeXNpY3MtZnJhbWV3b3JrXCI7XHJcbmltcG9ydCB7IEFtbW9Xb3JsZCB9IGZyb20gJy4uL2FtbW8td29ybGQnO1xyXG5pbXBvcnQgeyBBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzLCBFQW1tb1NoYXJlZEJvZHlEaXJ0eSB9IGZyb20gJy4uL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IGNvY29zMkFtbW9WZWMzLCBhbW1vRGVsZXRlUHRyLCBjb2NvczJBbW1vUXVhdCB9IGZyb20gJy4uL2FtbW8tdXRpbCc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi8uLi9jb3JlJztcclxuaW1wb3J0IHsgSUJhc2VTaGFwZSB9IGZyb20gJy4uLy4uL3NwZWMvaS1waHlzaWNzLXNoYXBlJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9tYXRoL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgQW1tb1NoYXJlZEJvZHkgfSBmcm9tICcuLi9hbW1vLXNoYXJlZC1ib2R5JztcclxuaW1wb3J0IHsgYWFiYiwgc3BoZXJlIH0gZnJvbSAnLi4vLi4vLi4vY29yZS9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEFtbW9Db25zdGFudCwgQ0NfVjNfMCB9IGZyb20gJy4uL2FtbW8tY29uc3QnO1xyXG5cclxuY29uc3QgdjNfMCA9IENDX1YzXzA7XHJcblxyXG5leHBvcnQgY2xhc3MgQW1tb1NoYXBlIGltcGxlbWVudHMgSUJhc2VTaGFwZSB7XHJcblxyXG4gICAgc2V0TWF0ZXJpYWwgKHY6IFBoeXNpY01hdGVyaWFsIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faXNUcmlnZ2VyICYmIHRoaXMuX2lzRW5hYmxlZCAmJiB2KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9idENvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9idENvbXBvdW5kLnNldE1hdGVyaWFsKHRoaXMuX2luZGV4LCB2LmZyaWN0aW9uLCB2LnJlc3RpdHV0aW9uLCB2LnJvbGxpbmdGcmljdGlvbiwgdi5zcGlubmluZ0ZyaWN0aW9uKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5zZXRGcmljdGlvbih2LmZyaWN0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5zZXRSZXN0aXR1dGlvbih2LnJlc3RpdHV0aW9uKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuYm9keS5zZXRSb2xsaW5nRnJpY3Rpb24odi5yb2xsaW5nRnJpY3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5ib2R5LnNldFNwaW5uaW5nRnJpY3Rpb24odi5zcGlubmluZ0ZyaWN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRDZW50ZXIgKHY6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh2M18wLCB2KTtcclxuICAgICAgICB2M18wLm11bHRpcGx5KHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy50cmFuc2Zvcm0uZ2V0T3JpZ2luKCksIHYzXzApO1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG91bmRUcmFuc2Zvcm0oKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRBc1RyaWdnZXIgKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAodGhpcy5faXNUcmlnZ2VyID09IHYpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2lzRW5hYmxlZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlbW92ZVNoYXBlKHRoaXMsICF2KTtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5hZGRTaGFwZSh0aGlzLCB2KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5faXNUcmlnZ2VyID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYXR0YWNoZWRSaWdpZEJvZHkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5KSB7IHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5LnJpZ2lkQm9keTsgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpbXBsICgpIHsgcmV0dXJuIHRoaXMuX2J0U2hhcGUhOyB9XHJcbiAgICBnZXQgY29sbGlkZXIgKCk6IENvbGxpZGVyIHsgcmV0dXJuIHRoaXMuX2NvbGxpZGVyOyB9XHJcbiAgICBnZXQgc2hhcmVkQm9keSAoKTogQW1tb1NoYXJlZEJvZHkgeyByZXR1cm4gdGhpcy5fc2hhcmVkQm9keTsgfVxyXG4gICAgZ2V0IGluZGV4ICgpIHsgcmV0dXJuIHRoaXMuX2luZGV4OyB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgaWRDb3VudGVyID0gMDtcclxuICAgIHJlYWRvbmx5IGlkOiBudW1iZXI7XHJcbiAgICByZWFkb25seSB0eXBlOiBBbW1vQnJvYWRwaGFzZU5hdGl2ZVR5cGVzO1xyXG5cclxuICAgIHByb3RlY3RlZCBfaW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF9pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgIHByb3RlY3RlZCBfaXNCaW5kaW5nID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX2lzVHJpZ2dlciA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFyZWRCb2R5ITogQW1tb1NoYXJlZEJvZHk7XHJcbiAgICBwcm90ZWN0ZWQgX2J0U2hhcGUhOiBBbW1vLmJ0Q29sbGlzaW9uU2hhcGU7XHJcbiAgICBwcm90ZWN0ZWQgX2J0Q29tcG91bmQ6IEFtbW8uYnRDb21wb3VuZFNoYXBlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2NvbGxpZGVyITogQ29sbGlkZXI7XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHRyYW5zZm9ybTogQW1tby5idFRyYW5zZm9ybTtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwb3M6IEFtbW8uYnRWZWN0b3IzO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHF1YXQ6IEFtbW8uYnRRdWF0ZXJuaW9uO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHNjYWxlOiBBbW1vLmJ0VmVjdG9yMztcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAodHlwZTogQW1tb0Jyb2FkcGhhc2VOYXRpdmVUeXBlcykge1xyXG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XHJcbiAgICAgICAgdGhpcy5pZCA9IEFtbW9TaGFwZS5pZENvdW50ZXIrKztcclxuXHJcbiAgICAgICAgdGhpcy5wb3MgPSBuZXcgQW1tby5idFZlY3RvcjMoKTtcclxuICAgICAgICB0aGlzLnF1YXQgPSBuZXcgQW1tby5idFF1YXRlcm5pb24oKTtcclxuICAgICAgICB0aGlzLnRyYW5zZm9ybSA9IG5ldyBBbW1vLmJ0VHJhbnNmb3JtKHRoaXMucXVhdCwgdGhpcy5wb3MpO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtLnNldElkZW50aXR5KCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBuZXcgQW1tby5idFZlY3RvcjMoMSwgMSwgMSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QUFCQiAodjogYWFiYikge1xyXG4gICAgICAgIGNvbnN0IFRSQU5TID0gQW1tb0NvbnN0YW50Lmluc3RhbmNlLlRSQU5TRk9STTtcclxuICAgICAgICBUUkFOUy5zZXRJZGVudGl0eSgpO1xyXG4gICAgICAgIFRSQU5TLnNldFJvdGF0aW9uKGNvY29zMkFtbW9RdWF0KEFtbW9Db25zdGFudC5pbnN0YW5jZS5RVUFUXzAsIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRSb3RhdGlvbikpO1xyXG4gICAgICAgIGNvbnN0IE1JTiA9IEFtbW9Db25zdGFudC5pbnN0YW5jZS5WRUNUT1IzXzA7XHJcbiAgICAgICAgY29uc3QgTUFYID0gQW1tb0NvbnN0YW50Lmluc3RhbmNlLlZFQ1RPUjNfMTtcclxuICAgICAgICB0aGlzLl9idFNoYXBlLmdldEFhYmIoVFJBTlMsIE1JTiwgTUFYKTtcclxuICAgICAgICB2LmhhbGZFeHRlbnRzLnNldCgoTUFYLngoKSAtIE1JTi54KCkpIC8gMiwgKE1BWC55KCkgLSBNSU4ueSgpKSAvIDIsIChNQVgueigpIC0gTUlOLnooKSkgLyAyKTtcclxuICAgICAgICBWZWMzLmFkZCh2LmNlbnRlciwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFBvc2l0aW9uLCB0aGlzLl9jb2xsaWRlci5jZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEJvdW5kaW5nU3BoZXJlICh2OiBzcGhlcmUpIHtcclxuICAgICAgICB2LnJhZGl1cyA9IHRoaXMuX2J0U2hhcGUuZ2V0TG9jYWxCb3VuZGluZ1NwaGVyZSgpO1xyXG4gICAgICAgIFZlYzMuYWRkKHYuY2VudGVyLCB0aGlzLl9jb2xsaWRlci5ub2RlLndvcmxkUG9zaXRpb24sIHRoaXMuX2NvbGxpZGVyLmNlbnRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZSAoY29tOiBDb2xsaWRlcikge1xyXG4gICAgICAgIHRoaXMuX2NvbGxpZGVyID0gY29tO1xyXG4gICAgICAgIHRoaXMuX2lzQmluZGluZyA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5vbkNvbXBvbmVudFNldCgpO1xyXG4gICAgICAgIHRoaXMuc2V0V3JhcHBlcigpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5waHlzaWNzV29ybGQgYXMgQW1tb1dvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX2NvbGxpZGVyLm5vZGUgYXMgTm9kZSk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHZpcnR1YWxcclxuICAgIHByb3RlY3RlZCBvbkNvbXBvbmVudFNldCAoKSB7IH1cclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuc2V0Q2VudGVyKHRoaXMuX2NvbGxpZGVyLmNlbnRlcik7XHJcbiAgICAgICAgdGhpcy5zZXRBc1RyaWdnZXIodGhpcy5fY29sbGlkZXIuaXNUcmlnZ2VyKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgdGhpcy5faXNFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZFNoYXBlKHRoaXMsIHRoaXMuX2lzVHJpZ2dlcik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TWF0ZXJpYWwodGhpcy5jb2xsaWRlci5zaGFyZWRNYXRlcmlhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlbW92ZVNoYXBlKHRoaXMsIHRoaXMuX2lzVHJpZ2dlcik7XHJcbiAgICB9XHJcblxyXG4gICAgb25EZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX2J0Q29tcG91bmQgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLl9jb2xsaWRlciBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICBjb25zdCBzaGFwZSA9IEFtbW8uY2FzdE9iamVjdCh0aGlzLl9idFNoYXBlLCBBbW1vLmJ0Q29sbGlzaW9uU2hhcGUpO1xyXG4gICAgICAgIHNoYXBlWyd3cmFwcGVkJ10gPSBudWxsO1xyXG4gICAgICAgIEFtbW8uZGVzdHJveSh0aGlzLnBvcyk7XHJcbiAgICAgICAgQW1tby5kZXN0cm95KHRoaXMucXVhdCk7XHJcbiAgICAgICAgQW1tby5kZXN0cm95KHRoaXMuc2NhbGUpO1xyXG4gICAgICAgIEFtbW8uZGVzdHJveSh0aGlzLnRyYW5zZm9ybSk7XHJcbiAgICAgICAgQW1tby5kZXN0cm95KHRoaXMuX2J0U2hhcGUpO1xyXG4gICAgICAgIGFtbW9EZWxldGVQdHIodGhpcy5fYnRTaGFwZSwgQW1tby5idENvbGxpc2lvblNoYXBlKTtcclxuICAgICAgICAodGhpcy5fYnRTaGFwZSBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy50cmFuc2Zvcm0gYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMucG9zIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLnF1YXQgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuc2NhbGUgYXMgYW55KSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqIGdyb3VwIG1hc2sgKi9cclxuICAgIGdldEdyb3VwICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBhZGRHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5jb2xsaXNpb25GaWx0ZXJHcm91cCB8PSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwICY9IH52O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE1hc2sgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzaztcclxuICAgIH1cclxuXHJcbiAgICBzZXRNYXNrICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmNvbGxpc2lvbkZpbHRlck1hc2sgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzayB8PSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZU1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzayAmPSB+djtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDb21wb3VuZCAoY29tcG91bmQ6IEFtbW8uYnRDb21wb3VuZFNoYXBlIHwgbnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9idENvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0Q29tcG91bmQucmVtb3ZlQ2hpbGRTaGFwZSh0aGlzLl9idFNoYXBlKTtcclxuICAgICAgICAgICAgdGhpcy5faW5kZXggPSAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ID0gY29tcG91bmQuZ2V0TnVtQ2hpbGRTaGFwZXMoKTtcclxuICAgICAgICAgICAgY29tcG91bmQuYWRkQ2hpbGRTaGFwZSh0aGlzLnRyYW5zZm9ybSwgdGhpcy5fYnRTaGFwZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2J0Q29tcG91bmQgPSBjb21wb3VuZDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRXcmFwcGVyICgpIHtcclxuICAgICAgICBjb25zdCBzaGFwZSA9IEFtbW8uY2FzdE9iamVjdCh0aGlzLl9idFNoYXBlLCBBbW1vLmJ0Q29sbGlzaW9uU2hhcGUpO1xyXG4gICAgICAgIHNoYXBlWyd3cmFwcGVkJ10gPSB0aGlzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFNjYWxlICgpIHtcclxuICAgICAgICB0aGlzLnNldENlbnRlcih0aGlzLl9jb2xsaWRlci5jZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNvbXBvdW5kVHJhbnNmb3JtICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYnRDb21wb3VuZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9idENvbXBvdW5kLnVwZGF0ZUNoaWxkVHJhbnNmb3JtKHRoaXMuaW5kZXgsIHRoaXMudHJhbnNmb3JtLCB0cnVlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2lzRW5hYmxlZCAmJiAhdGhpcy5faXNUcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5ICYmICF0aGlzLl9zaGFyZWRCb2R5LmJvZHlTdHJ1Y3QudXNlQ29tcG91bmQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZGlydHkgfD0gRUFtbW9TaGFyZWRCb2R5RGlydHkuQk9EWV9SRV9BREQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmVlZENvbXBvdW5kICgpIHtcclxuICAgICAgICBpZiAodGhpcy50eXBlID09IEFtbW9Ccm9hZHBoYXNlTmF0aXZlVHlwZXMuVEVSUkFJTl9TSEFQRV9QUk9YWVRZUEUpXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fY29sbGlkZXIuY2VudGVyLmVxdWFscyhWZWMzLlpFUk8pKVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKkRFQlVHICovXHJcbiAgICBwcml2YXRlIHN0YXRpYyBfZGVidWdUcmFuc2Zvcm06IEFtbW8uYnRUcmFuc2Zvcm0gfCBudWxsO1xyXG4gICAgZGVidWdUcmFuc2Zvcm0gKG46IE5vZGUpIHtcclxuICAgICAgICBpZiAoQW1tb1NoYXBlLl9kZWJ1Z1RyYW5zZm9ybSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIEFtbW9TaGFwZS5fZGVidWdUcmFuc2Zvcm0gPSBuZXcgQW1tby5idFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgd3Q6IEFtbW8uYnRUcmFuc2Zvcm07XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzVHJpZ2dlcikge1xyXG4gICAgICAgICAgICB3dCA9IHRoaXMuX3NoYXJlZEJvZHkuZ2hvc3QuZ2V0V29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB3dCA9IHRoaXMuX3NoYXJlZEJvZHkuYm9keS5nZXRXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsdCA9IHRoaXMudHJhbnNmb3JtO1xyXG4gICAgICAgIEFtbW9TaGFwZS5fZGVidWdUcmFuc2Zvcm0uc2V0SWRlbnRpdHkoKTtcclxuICAgICAgICBBbW1vU2hhcGUuX2RlYnVnVHJhbnNmb3JtLm9wX211bCh3dCkub3BfbXVsKGx0KTtcclxuICAgICAgICBsZXQgb3JpZ2luID0gQW1tb1NoYXBlLl9kZWJ1Z1RyYW5zZm9ybS5nZXRPcmlnaW4oKTtcclxuICAgICAgICBuLndvcmxkUG9zaXRpb24gPSBuZXcgVmVjMyhvcmlnaW4ueCgpLCBvcmlnaW4ueSgpLCBvcmlnaW4ueigpKTtcclxuICAgICAgICBsZXQgcm90YXRpb24gPSBBbW1vU2hhcGUuX2RlYnVnVHJhbnNmb3JtLmdldFJvdGF0aW9uKCk7XHJcbiAgICAgICAgbi53b3JsZFJvdGF0aW9uID0gbmV3IFF1YXQocm90YXRpb24ueCgpLCByb3RhdGlvbi55KCksIHJvdGF0aW9uLnooKSwgcm90YXRpb24udygpKTtcclxuICAgICAgICBsZXQgc2NhbGUgPSB0aGlzLmltcGwuZ2V0TG9jYWxTY2FsaW5nKCk7XHJcbiAgICAgICAgbi5zY2FsZSA9IG5ldyBWZWMzKHNjYWxlLngoKSwgc2NhbGUueSgpLCBzY2FsZS56KCkpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==