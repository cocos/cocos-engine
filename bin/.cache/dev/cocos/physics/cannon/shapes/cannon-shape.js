(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../../core/math/index.js", "../../framework/util.js", "../cannon-util.js", "../../framework/physics-system.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../../core/math/index.js"), require("../../framework/util.js"), require("../cannon-util.js"), require("../../framework/physics-system.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.util, global.cannonUtil, global.physicsSystem);
    global.cannonShape = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index, _util, _cannonUtil, _physicsSystem) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonShape = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var TriggerEventObject = {
    type: 'onTriggerEnter',
    selfCollider: null,
    otherCollider: null,
    impl: null
  };
  var cannonQuat_0 = new _cannon.default.Quaternion();
  var cannonVec3_0 = new _cannon.default.Vec3();
  var cannonVec3_1 = new _cannon.default.Vec3();

  var CannonShape = /*#__PURE__*/function () {
    function CannonShape() {
      _classCallCheck(this, CannonShape);

      this._offset = new _cannon.default.Vec3();
      this._orient = new _cannon.default.Quaternion();
      this._index = -1;
      this.onTriggerListener = this._onTrigger.bind(this);
      this._isBinding = false;
    }

    _createClass(CannonShape, [{
      key: "setMaterial",
      value: function setMaterial(mat) {
        if (mat == null) {
          this._shape.material = null;
        } else {
          if (CannonShape.idToMaterial[mat._uuid] == null) {
            CannonShape.idToMaterial[mat._uuid] = new _cannon.default.Material(mat._uuid);
          }

          this._shape.material = CannonShape.idToMaterial[mat._uuid];
          this._shape.material.friction = mat.friction;
          this._shape.material.restitution = mat.restitution;
        }
      }
    }, {
      key: "setAsTrigger",
      value: function setAsTrigger(v) {
        this._shape.collisionResponse = !v;

        if (this._index >= 0) {
          this._body.updateHasTrigger();
        }
      }
    }, {
      key: "setCenter",
      value: function setCenter(v) {
        this._setCenter(v);

        if (this._index >= 0) {
          (0, _cannonUtil.commitShapeUpdates)(this._body);
        }
      }
    }, {
      key: "setAttachedBody",
      value: function setAttachedBody(v) {
        if (v) {
          if (this._sharedBody) {
            if (this._sharedBody.wrappedBody == v.body) return;
            this._sharedBody.reference = false;
          }

          this._sharedBody = _physicsSystem.PhysicsSystem.instance.physicsWorld.getSharedBody(v.node);
          this._sharedBody.reference = true;
        } else {
          if (this._sharedBody) {
            this._sharedBody.reference = false;
          }

          this._sharedBody = _physicsSystem.PhysicsSystem.instance.physicsWorld.getSharedBody(this._collider.node);
          this._sharedBody.reference = true;
        }
      }
    }, {
      key: "getAABB",
      value: function getAABB(v) {
        _index.Quat.copy(cannonQuat_0, this._collider.node.worldRotation); // TODO: typing


        this._shape.calculateWorldAABB(_cannon.default.Vec3.ZERO, cannonQuat_0, cannonVec3_0, cannonVec3_1);

        _index.Vec3.subtract(v.halfExtents, cannonVec3_1, cannonVec3_0);

        _index.Vec3.multiplyScalar(v.halfExtents, v.halfExtents, 0.5);

        _index.Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
      }
    }, {
      key: "getBoundingSphere",
      value: function getBoundingSphere(v) {
        v.radius = this._shape.boundingSphereRadius;

        _index.Vec3.add(v.center, this._collider.node.worldPosition, this._collider.center);
      }
    }, {
      key: "initialize",

      /** LIFECYCLE */
      value: function initialize(comp) {
        this._collider = comp;
        this._isBinding = true;
        this.onComponentSet();
        (0, _util.setWrap)(this._shape, this);

        this._shape.addEventListener('cc-trigger', this.onTriggerListener);

        this._sharedBody = _physicsSystem.PhysicsSystem.instance.physicsWorld.getSharedBody(this._collider.node);
        this._sharedBody.reference = true;
      } // virtual

    }, {
      key: "onComponentSet",
      value: function onComponentSet() {}
    }, {
      key: "onLoad",
      value: function onLoad() {
        this.setMaterial(this._collider.sharedMaterial);
        this.setCenter(this._collider.center);
        this.setAsTrigger(this._collider.isTrigger);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        this._sharedBody.addShape(this);

        this._sharedBody.enabled = true;
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        this._sharedBody.removeShape(this);

        this._sharedBody.enabled = false;
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        this._sharedBody.reference = false;

        this._shape.removeEventListener('cc-trigger', this.onTriggerListener);

        delete _cannon.default.World['idToShapeMap'][this._shape.id];
        this._sharedBody = null;
        (0, _util.setWrap)(this._shape, null);
        this._offset = null;
        this._orient = null;
        this._shape = null;
        this._collider = null;
        this.onTriggerListener = null;
      }
      /** INTERFACE */

      /** group */

    }, {
      key: "getGroup",
      value: function getGroup() {
        return this._body.collisionFilterGroup;
      }
    }, {
      key: "setGroup",
      value: function setGroup(v) {
        this._body.collisionFilterGroup = v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
    }, {
      key: "addGroup",
      value: function addGroup(v) {
        this._body.collisionFilterGroup |= v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(v) {
        this._body.collisionFilterGroup &= ~v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
      /** mask */

    }, {
      key: "getMask",
      value: function getMask() {
        return this._body.collisionFilterMask;
      }
    }, {
      key: "setMask",
      value: function setMask(v) {
        this._body.collisionFilterMask = v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
    }, {
      key: "addMask",
      value: function addMask(v) {
        this._body.collisionFilterMask |= v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
    }, {
      key: "removeMask",
      value: function removeMask(v) {
        this._body.collisionFilterMask &= ~v;
        if (!this._body.isAwake()) this._body.wakeUp();
      }
      /**
       * change scale will recalculate center & size \
       * size handle by child class
       * @param scale 
       */

    }, {
      key: "setScale",
      value: function setScale(scale) {
        this._setCenter(this._collider.center);
      }
    }, {
      key: "setIndex",
      value: function setIndex(index) {
        this._index = index;
      }
    }, {
      key: "setOffsetAndOrient",
      value: function setOffsetAndOrient(offset, orient) {
        _index.Vec3.copy(offset, this._offset);

        _index.Quat.copy(orient, this._orient);

        this._offset = offset;
        this._orient = orient;
      }
    }, {
      key: "_setCenter",
      value: function _setCenter(v) {
        var lpos = this._offset;

        _index.Vec3.subtract(lpos, this._sharedBody.node.worldPosition, this._collider.node.worldPosition);

        _index.Vec3.add(lpos, lpos, v);

        _index.Vec3.multiply(lpos, lpos, this._collider.node.worldScale);
      }
    }, {
      key: "_onTrigger",
      value: function _onTrigger(event) {
        TriggerEventObject.type = event.event;
        var self = (0, _util.getWrap)(event.selfShape);
        var other = (0, _util.getWrap)(event.otherShape);

        if (self && self.collider.needTriggerEvent) {
          TriggerEventObject.selfCollider = self.collider;
          TriggerEventObject.otherCollider = other ? other.collider : null;
          TriggerEventObject.impl = event;

          this._collider.emit(TriggerEventObject.type, TriggerEventObject);
        }
      }
    }, {
      key: "impl",
      get: function get() {
        return this._shape;
      }
    }, {
      key: "collider",
      get: function get() {
        return this._collider;
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
      key: "sharedBody",
      get: function get() {
        return this._sharedBody;
      }
    }, {
      key: "_body",
      get: function get() {
        return this._sharedBody.body;
      }
    }]);

    return CannonShape;
  }();

  _exports.CannonShape = CannonShape;
  CannonShape.idToMaterial = {};
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL3NoYXBlcy9jYW5ub24tc2hhcGUudHMiXSwibmFtZXMiOlsiVHJpZ2dlckV2ZW50T2JqZWN0IiwidHlwZSIsInNlbGZDb2xsaWRlciIsIm90aGVyQ29sbGlkZXIiLCJpbXBsIiwiY2Fubm9uUXVhdF8wIiwiQ0FOTk9OIiwiUXVhdGVybmlvbiIsImNhbm5vblZlYzNfMCIsIlZlYzMiLCJjYW5ub25WZWMzXzEiLCJDYW5ub25TaGFwZSIsIl9vZmZzZXQiLCJfb3JpZW50IiwiX2luZGV4Iiwib25UcmlnZ2VyTGlzdGVuZXIiLCJfb25UcmlnZ2VyIiwiYmluZCIsIl9pc0JpbmRpbmciLCJtYXQiLCJfc2hhcGUiLCJtYXRlcmlhbCIsImlkVG9NYXRlcmlhbCIsIl91dWlkIiwiTWF0ZXJpYWwiLCJmcmljdGlvbiIsInJlc3RpdHV0aW9uIiwidiIsImNvbGxpc2lvblJlc3BvbnNlIiwiX2JvZHkiLCJ1cGRhdGVIYXNUcmlnZ2VyIiwiX3NldENlbnRlciIsIl9zaGFyZWRCb2R5Iiwid3JhcHBlZEJvZHkiLCJib2R5IiwicmVmZXJlbmNlIiwiUGh5c2ljc1N5c3RlbSIsImluc3RhbmNlIiwicGh5c2ljc1dvcmxkIiwiZ2V0U2hhcmVkQm9keSIsIm5vZGUiLCJfY29sbGlkZXIiLCJRdWF0IiwiY29weSIsIndvcmxkUm90YXRpb24iLCJjYWxjdWxhdGVXb3JsZEFBQkIiLCJaRVJPIiwic3VidHJhY3QiLCJoYWxmRXh0ZW50cyIsIm11bHRpcGx5U2NhbGFyIiwiYWRkIiwiY2VudGVyIiwid29ybGRQb3NpdGlvbiIsInJhZGl1cyIsImJvdW5kaW5nU3BoZXJlUmFkaXVzIiwiY29tcCIsIm9uQ29tcG9uZW50U2V0IiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldE1hdGVyaWFsIiwic2hhcmVkTWF0ZXJpYWwiLCJzZXRDZW50ZXIiLCJzZXRBc1RyaWdnZXIiLCJpc1RyaWdnZXIiLCJhZGRTaGFwZSIsImVuYWJsZWQiLCJyZW1vdmVTaGFwZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJXb3JsZCIsImlkIiwiY29sbGlzaW9uRmlsdGVyR3JvdXAiLCJpc0F3YWtlIiwid2FrZVVwIiwiY29sbGlzaW9uRmlsdGVyTWFzayIsInNjYWxlIiwiaW5kZXgiLCJvZmZzZXQiLCJvcmllbnQiLCJscG9zIiwibXVsdGlwbHkiLCJ3b3JsZFNjYWxlIiwiZXZlbnQiLCJzZWxmIiwic2VsZlNoYXBlIiwib3RoZXIiLCJvdGhlclNoYXBlIiwiY29sbGlkZXIiLCJuZWVkVHJpZ2dlckV2ZW50IiwiZW1pdCIsInJpZ2lkQm9keSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFNQSxrQkFBa0IsR0FBRztBQUN2QkMsSUFBQUEsSUFBSSxFQUFFLGdCQURpQjtBQUV2QkMsSUFBQUEsWUFBWSxFQUFFLElBRlM7QUFHdkJDLElBQUFBLGFBQWEsRUFBRSxJQUhRO0FBSXZCQyxJQUFBQSxJQUFJLEVBQUU7QUFKaUIsR0FBM0I7QUFNQSxNQUFNQyxZQUFZLEdBQUcsSUFBSUMsZ0JBQU9DLFVBQVgsRUFBckI7QUFDQSxNQUFNQyxZQUFZLEdBQUcsSUFBSUYsZ0JBQU9HLElBQVgsRUFBckI7QUFDQSxNQUFNQyxZQUFZLEdBQUcsSUFBSUosZ0JBQU9HLElBQVgsRUFBckI7O01BQ2FFLFc7Ozs7V0ErRUNDLE8sR0FBVSxJQUFJTixnQkFBT0csSUFBWCxFO1dBQ1ZJLE8sR0FBVSxJQUFJUCxnQkFBT0MsVUFBWCxFO1dBQ1ZPLE0sR0FBaUIsQ0FBQyxDO1dBR2xCQyxpQixHQUFvQixLQUFLQyxVQUFMLENBQWdCQyxJQUFoQixDQUFxQixJQUFyQixDO1dBQ3BCQyxVLEdBQWEsSzs7Ozs7a0NBdEVWQyxHLEVBQTRCO0FBQ3JDLFlBQUlBLEdBQUcsSUFBSSxJQUFYLEVBQWlCO0FBQ1osZUFBS0MsTUFBTCxDQUFhQyxRQUFkLEdBQXFDLElBQXJDO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsY0FBSVYsV0FB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Ozs7OztBQW5GNUR2QixFQUFBQSxXLENBRU9XLFksR0FBZSxFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgVmVjMywgUXVhdCB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IGdldFdyYXAsIHNldFdyYXAgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvdXRpbCc7XHJcbmltcG9ydCB7IGNvbW1pdFNoYXBlVXBkYXRlcyB9IGZyb20gJy4uL2Nhbm5vbi11dGlsJztcclxuaW1wb3J0IHsgUGh5c2ljTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvYXNzZXRzL3BoeXNpYy1tYXRlcmlhbCc7XHJcbmltcG9ydCB7IElCYXNlU2hhcGUgfSBmcm9tICcuLi8uLi9zcGVjL2ktcGh5c2ljcy1zaGFwZSc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcbmltcG9ydCB7IENhbm5vblNoYXJlZEJvZHkgfSBmcm9tICcuLi9jYW5ub24tc2hhcmVkLWJvZHknO1xyXG5pbXBvcnQgeyBDYW5ub25Xb3JsZCB9IGZyb20gJy4uL2Nhbm5vbi13b3JsZCc7XHJcbmltcG9ydCB7IFRyaWdnZXJFdmVudFR5cGUgfSBmcm9tICcuLi8uLi9mcmFtZXdvcmsvcGh5c2ljcy1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBQaHlzaWNzU3lzdGVtIH0gZnJvbSAnLi4vLi4vZnJhbWV3b3JrL3BoeXNpY3Mtc3lzdGVtJztcclxuaW1wb3J0IHsgQ29sbGlkZXIsIFJpZ2lkQm9keSB9IGZyb20gJy4uLy4uL2ZyYW1ld29yayc7XHJcbmltcG9ydCB7IGFhYmIsIHNwaGVyZSB9IGZyb20gJy4uLy4uLy4uL2NvcmUvZ2VvbWV0cnknO1xyXG5cclxuY29uc3QgVHJpZ2dlckV2ZW50T2JqZWN0ID0ge1xyXG4gICAgdHlwZTogJ29uVHJpZ2dlckVudGVyJyBhcyBUcmlnZ2VyRXZlbnRUeXBlLFxyXG4gICAgc2VsZkNvbGxpZGVyOiBudWxsIGFzIENvbGxpZGVyIHwgbnVsbCxcclxuICAgIG90aGVyQ29sbGlkZXI6IG51bGwgYXMgQ29sbGlkZXIgfCBudWxsLFxyXG4gICAgaW1wbDogbnVsbCBhcyB1bmtub3duIGFzIENBTk5PTi5JVHJpZ2dlcmVkRXZlbnQsXHJcbn07XHJcbmNvbnN0IGNhbm5vblF1YXRfMCA9IG5ldyBDQU5OT04uUXVhdGVybmlvbigpO1xyXG5jb25zdCBjYW5ub25WZWMzXzAgPSBuZXcgQ0FOTk9OLlZlYzMoKTtcclxuY29uc3QgY2Fubm9uVmVjM18xID0gbmV3IENBTk5PTi5WZWMzKCk7XHJcbmV4cG9ydCBjbGFzcyBDYW5ub25TaGFwZSBpbXBsZW1lbnRzIElCYXNlU2hhcGUge1xyXG5cclxuICAgIHN0YXRpYyByZWFkb25seSBpZFRvTWF0ZXJpYWwgPSB7fTtcclxuXHJcbiAgICBnZXQgaW1wbCAoKSB7IHJldHVybiB0aGlzLl9zaGFwZSE7IH1cclxuXHJcbiAgICBnZXQgY29sbGlkZXIgKCkgeyByZXR1cm4gdGhpcy5fY29sbGlkZXI7IH1cclxuXHJcbiAgICBnZXQgYXR0YWNoZWRSaWdpZEJvZHkgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5KSB7IHJldHVybiB0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5LnJpZ2lkQm9keTsgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzaGFyZWRCb2R5ICgpOiBDYW5ub25TaGFyZWRCb2R5IHsgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHk7IH1cclxuXHJcbiAgICBzZXRNYXRlcmlhbCAobWF0OiBQaHlzaWNNYXRlcmlhbCB8IG51bGwpIHtcclxuICAgICAgICBpZiAobWF0ID09IG51bGwpIHtcclxuICAgICAgICAgICAgKHRoaXMuX3NoYXBlIS5tYXRlcmlhbCBhcyB1bmtub3duKSA9IG51bGw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdID0gbmV3IENBTk5PTi5NYXRlcmlhbChtYXQuX3V1aWQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5tYXRlcmlhbCA9IENhbm5vblNoYXBlLmlkVG9NYXRlcmlhbFttYXQuX3V1aWRdO1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5tYXRlcmlhbC5mcmljdGlvbiA9IG1hdC5mcmljdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUubWF0ZXJpYWwucmVzdGl0dXRpb24gPSBtYXQucmVzdGl0dXRpb247XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEFzVHJpZ2dlciAodjogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlLmNvbGxpc2lvblJlc3BvbnNlID0gIXY7XHJcbiAgICAgICAgaWYgKHRoaXMuX2luZGV4ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fYm9keS51cGRhdGVIYXNUcmlnZ2VyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldENlbnRlciAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0Q2VudGVyKHYpO1xyXG4gICAgICAgIGlmICh0aGlzLl9pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLl9ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0QXR0YWNoZWRCb2R5ICh2OiBSaWdpZEJvZHkgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NoYXJlZEJvZHkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5LndyYXBwZWRCb2R5ID09IHYuYm9keSkgcmV0dXJuO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkucmVmZXJlbmNlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXJlZEJvZHkgPSAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5waHlzaWNzV29ybGQgYXMgQ2Fubm9uV29ybGQpLmdldFNoYXJlZEJvZHkodi5ub2RlKTtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zaGFyZWRCb2R5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5ID0gKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UucGh5c2ljc1dvcmxkIGFzIENhbm5vbldvcmxkKS5nZXRTaGFyZWRCb2R5KHRoaXMuX2NvbGxpZGVyLm5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldEFBQkIgKHY6IGFhYmIpIHtcclxuICAgICAgICBRdWF0LmNvcHkoY2Fubm9uUXVhdF8wLCB0aGlzLl9jb2xsaWRlci5ub2RlLndvcmxkUm90YXRpb24pO1xyXG4gICAgICAgIC8vIFRPRE86IHR5cGluZ1xyXG4gICAgICAgICh0aGlzLl9zaGFwZSBhcyBhbnkpLmNhbGN1bGF0ZVdvcmxkQUFCQihDQU5OT04uVmVjMy5aRVJPLCBjYW5ub25RdWF0XzAsIGNhbm5vblZlYzNfMCwgY2Fubm9uVmVjM18xKTtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KHYuaGFsZkV4dGVudHMsIGNhbm5vblZlYzNfMSwgY2Fubm9uVmVjM18wKTtcclxuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKHYuaGFsZkV4dGVudHMsIHYuaGFsZkV4dGVudHMsIDAuNSk7XHJcbiAgICAgICAgVmVjMy5hZGQodi5jZW50ZXIsIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRQb3NpdGlvbiwgdGhpcy5fY29sbGlkZXIuY2VudGVyKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRCb3VuZGluZ1NwaGVyZSAodjogc3BoZXJlKSB7XHJcbiAgICAgICAgdi5yYWRpdXMgPSB0aGlzLl9zaGFwZS5ib3VuZGluZ1NwaGVyZVJhZGl1cztcclxuICAgICAgICBWZWMzLmFkZCh2LmNlbnRlciwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFBvc2l0aW9uLCB0aGlzLl9jb2xsaWRlci5jZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfY29sbGlkZXIhOiBDb2xsaWRlcjtcclxuICAgIHByb3RlY3RlZCBfc2hhcGUhOiBDQU5OT04uU2hhcGU7XHJcbiAgICBwcm90ZWN0ZWQgX29mZnNldCA9IG5ldyBDQU5OT04uVmVjMygpO1xyXG4gICAgcHJvdGVjdGVkIF9vcmllbnQgPSBuZXcgQ0FOTk9OLlF1YXRlcm5pb24oKTtcclxuICAgIHByb3RlY3RlZCBfaW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFyZWRCb2R5ITogQ2Fubm9uU2hhcmVkQm9keTtcclxuICAgIHByb3RlY3RlZCBnZXQgX2JvZHkgKCk6IENBTk5PTi5Cb2R5IHsgcmV0dXJuIHRoaXMuX3NoYXJlZEJvZHkuYm9keTsgfVxyXG4gICAgcHJvdGVjdGVkIG9uVHJpZ2dlckxpc3RlbmVyID0gdGhpcy5fb25UcmlnZ2VyLmJpbmQodGhpcyk7XHJcbiAgICBwcm90ZWN0ZWQgX2lzQmluZGluZyA9IGZhbHNlO1xyXG5cclxuICAgIC8qKiBMSUZFQ1lDTEUgKi9cclxuXHJcbiAgICBpbml0aWFsaXplIChjb21wOiBDb2xsaWRlcikge1xyXG4gICAgICAgIHRoaXMuX2NvbGxpZGVyID0gY29tcDtcclxuICAgICAgICB0aGlzLl9pc0JpbmRpbmcgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMub25Db21wb25lbnRTZXQoKTtcclxuICAgICAgICBzZXRXcmFwKHRoaXMuX3NoYXBlLCB0aGlzKTtcclxuICAgICAgICB0aGlzLl9zaGFwZS5hZGRFdmVudExpc3RlbmVyKCdjYy10cmlnZ2VyJywgdGhpcy5vblRyaWdnZXJMaXN0ZW5lcik7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keSA9IChQaHlzaWNzU3lzdGVtLmluc3RhbmNlLnBoeXNpY3NXb3JsZCBhcyBDYW5ub25Xb3JsZCkuZ2V0U2hhcmVkQm9keSh0aGlzLl9jb2xsaWRlci5ub2RlKTtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlZmVyZW5jZSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdmlydHVhbFxyXG4gICAgcHJvdGVjdGVkIG9uQ29tcG9uZW50U2V0ICgpIHsgfVxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRNYXRlcmlhbCh0aGlzLl9jb2xsaWRlci5zaGFyZWRNYXRlcmlhbCk7XHJcbiAgICAgICAgdGhpcy5zZXRDZW50ZXIodGhpcy5fY29sbGlkZXIuY2VudGVyKTtcclxuICAgICAgICB0aGlzLnNldEFzVHJpZ2dlcih0aGlzLl9jb2xsaWRlci5pc1RyaWdnZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRW5hYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LmFkZFNoYXBlKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgb25EaXNhYmxlICgpIHtcclxuICAgICAgICB0aGlzLl9zaGFyZWRCb2R5LnJlbW92ZVNoYXBlKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3NoYXJlZEJvZHkuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkQm9keS5yZWZlcmVuY2UgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9zaGFwZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjYy10cmlnZ2VyJywgdGhpcy5vblRyaWdnZXJMaXN0ZW5lcik7XHJcbiAgICAgICAgZGVsZXRlIENBTk5PTi5Xb3JsZFsnaWRUb1NoYXBlTWFwJ11bdGhpcy5fc2hhcGUuaWRdO1xyXG4gICAgICAgICh0aGlzLl9zaGFyZWRCb2R5IGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgIHNldFdyYXAodGhpcy5fc2hhcGUsIG51bGwpO1xyXG4gICAgICAgICh0aGlzLl9vZmZzZXQgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX29yaWVudCBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy5fc2hhcGUgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuX2NvbGxpZGVyIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLm9uVHJpZ2dlckxpc3RlbmVyIGFzIGFueSkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBJTlRFUkZBQ0UgKi9cclxuXHJcbiAgICAvKiogZ3JvdXAgKi9cclxuICAgIGdldEdyb3VwICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9ib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwID0gdjtcclxuICAgICAgICBpZiAoIXRoaXMuX2JvZHkuaXNBd2FrZSgpKSB0aGlzLl9ib2R5Lndha2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEdyb3VwICh2OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9ib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwIHw9IHY7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9ib2R5LmlzQXdha2UoKSkgdGhpcy5fYm9keS53YWtlVXAoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fYm9keS5jb2xsaXNpb25GaWx0ZXJHcm91cCAmPSB+djtcclxuICAgICAgICBpZiAoIXRoaXMuX2JvZHkuaXNBd2FrZSgpKSB0aGlzLl9ib2R5Lndha2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKiBtYXNrICovXHJcbiAgICBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ib2R5LmNvbGxpc2lvbkZpbHRlck1hc2s7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0TWFzayAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fYm9keS5jb2xsaXNpb25GaWx0ZXJNYXNrID0gdjtcclxuICAgICAgICBpZiAoIXRoaXMuX2JvZHkuaXNBd2FrZSgpKSB0aGlzLl9ib2R5Lndha2VVcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE1hc2sgKHY6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX2JvZHkuY29sbGlzaW9uRmlsdGVyTWFzayB8PSB2O1xyXG4gICAgICAgIGlmICghdGhpcy5fYm9keS5pc0F3YWtlKCkpIHRoaXMuX2JvZHkud2FrZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlTWFzayAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5fYm9keS5jb2xsaXNpb25GaWx0ZXJNYXNrICY9IH52O1xyXG4gICAgICAgIGlmICghdGhpcy5fYm9keS5pc0F3YWtlKCkpIHRoaXMuX2JvZHkud2FrZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBjaGFuZ2Ugc2NhbGUgd2lsbCByZWNhbGN1bGF0ZSBjZW50ZXIgJiBzaXplIFxcXHJcbiAgICAgKiBzaXplIGhhbmRsZSBieSBjaGlsZCBjbGFzc1xyXG4gICAgICogQHBhcmFtIHNjYWxlIFxyXG4gICAgICovXHJcbiAgICBzZXRTY2FsZSAoc2NhbGU6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIHRoaXMuX3NldENlbnRlcih0aGlzLl9jb2xsaWRlci5jZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldEluZGV4IChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5faW5kZXggPSBpbmRleDtcclxuICAgIH1cclxuXHJcbiAgICBzZXRPZmZzZXRBbmRPcmllbnQgKG9mZnNldDogQ0FOTk9OLlZlYzMsIG9yaWVudDogQ0FOTk9OLlF1YXRlcm5pb24pIHtcclxuICAgICAgICBWZWMzLmNvcHkob2Zmc2V0LCB0aGlzLl9vZmZzZXQpO1xyXG4gICAgICAgIFF1YXQuY29weShvcmllbnQsIHRoaXMuX29yaWVudCk7XHJcbiAgICAgICAgdGhpcy5fb2Zmc2V0ID0gb2Zmc2V0O1xyXG4gICAgICAgIHRoaXMuX29yaWVudCA9IG9yaWVudDtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3NldENlbnRlciAodjogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29uc3QgbHBvcyA9IHRoaXMuX29mZnNldCBhcyBJVmVjM0xpa2U7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChscG9zLCB0aGlzLl9zaGFyZWRCb2R5Lm5vZGUud29ybGRQb3NpdGlvbiwgdGhpcy5fY29sbGlkZXIubm9kZS53b3JsZFBvc2l0aW9uKTtcclxuICAgICAgICBWZWMzLmFkZChscG9zLCBscG9zLCB2KTtcclxuICAgICAgICBWZWMzLm11bHRpcGx5KGxwb3MsIGxwb3MsIHRoaXMuX2NvbGxpZGVyLm5vZGUud29ybGRTY2FsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vblRyaWdnZXIgKGV2ZW50OiBDQU5OT04uSVRyaWdnZXJlZEV2ZW50KSB7XHJcbiAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUgPSBldmVudC5ldmVudDtcclxuICAgICAgICBjb25zdCBzZWxmID0gZ2V0V3JhcDxDYW5ub25TaGFwZT4oZXZlbnQuc2VsZlNoYXBlKTtcclxuICAgICAgICBjb25zdCBvdGhlciA9IGdldFdyYXA8Q2Fubm9uU2hhcGU+KGV2ZW50Lm90aGVyU2hhcGUpO1xyXG5cclxuICAgICAgICBpZiAoc2VsZiAmJiBzZWxmLmNvbGxpZGVyLm5lZWRUcmlnZ2VyRXZlbnQpIHtcclxuICAgICAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IHNlbGYuY29sbGlkZXI7XHJcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gb3RoZXIgPyBvdGhlci5jb2xsaWRlciA6IG51bGw7XHJcbiAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5pbXBsID0gZXZlbnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbGxpZGVyLmVtaXQoVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUsIFRyaWdnZXJFdmVudE9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==