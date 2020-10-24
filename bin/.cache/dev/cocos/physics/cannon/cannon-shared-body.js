(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@cocos/cannon", "../../core/math/index.js", "../framework/physics-enum.js", "../framework/util.js", "../../../exports/physics-framework.js", "../../core/scene-graph/node-enum.js", "./cannon-util.js", "./cannon-contact-equation.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@cocos/cannon"), require("../../core/math/index.js"), require("../framework/physics-enum.js"), require("../framework/util.js"), require("../../../exports/physics-framework.js"), require("../../core/scene-graph/node-enum.js"), require("./cannon-util.js"), require("./cannon-contact-equation.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.cannon, global.index, global.physicsEnum, global.util, global.physicsFramework, global.nodeEnum, global.cannonUtil, global.cannonContactEquation);
    global.cannonSharedBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _cannon, _index2, _physicsEnum, _util, _physicsFramework, _nodeEnum, _cannonUtil, _cannonContactEquation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CannonSharedBody = void 0;
  _cannon = _interopRequireDefault(_cannon);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var v3_0 = new _index2.Vec3();
  var quat_0 = new _index2.Quat();
  var contactsPool = [];
  var CollisionEventObject = {
    type: 'onCollisionEnter',
    selfCollider: null,
    otherCollider: null,
    contacts: [],
    impl: null
  };
  /**
   * node : shared-body = 1 : 1
   * static
   */

  var CannonSharedBody = /*#__PURE__*/function () {
    _createClass(CannonSharedBody, [{
      key: "enabled",

      /**
       * add or remove from world \
       * add, if enable \
       * remove, if disable & shapes.length == 0 & wrappedBody disable
       */
      set: function set(v) {
        if (v) {
          if (this.index < 0) {
            this.index = this.wrappedWorld.bodies.length;
            this.wrappedWorld.addSharedBody(this);
            this.syncInitial();
          }
        } else {
          if (this.index >= 0) {
            var isRemove = this.shapes.length == 0 && this.wrappedBody == null || this.shapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled;

            if (isRemove) {
              this.body.sleep(); // clear velocity etc.

              this.index = -1;
              this.wrappedWorld.removeSharedBody(this);
            }
          }
        }
      }
    }, {
      key: "reference",
      set: function set(v) {
        v ? this.ref++ : this.ref--;

        if (this.ref == 0) {
          this.destroy();
        }
      }
    }], [{
      key: "getSharedBody",
      value: function getSharedBody(node, wrappedWorld) {
        var key = node.uuid;

        if (CannonSharedBody.sharedBodesMap.has(key)) {
          return CannonSharedBody.sharedBodesMap.get(key);
        } else {
          var newSB = new CannonSharedBody(node, wrappedWorld);
          CannonSharedBody.sharedBodesMap.set(node.uuid, newSB);
          return newSB;
        }
      }
    }]);

    function CannonSharedBody(node, wrappedWorld) {
      _classCallCheck(this, CannonSharedBody);

      this.node = void 0;
      this.wrappedWorld = void 0;
      this.body = void 0;
      this.shapes = [];
      this.wrappedBody = null;
      this.index = -1;
      this.ref = 0;
      this.onCollidedListener = this.onCollided.bind(this);
      this.wrappedWorld = wrappedWorld;
      this.node = node;
      this.body = new _cannon.default.Body();
      this.body.collisionFilterGroup = _physicsFramework.PhysicsSystem.PhysicsGroup.DEFAULT;
      this.body.sleepSpeedLimit = _physicsFramework.PhysicsSystem.instance.sleepThreshold;
      this.body.material = this.wrappedWorld.impl.defaultMaterial;
      this.body.addEventListener('cc-collide', this.onCollidedListener);
    }

    _createClass(CannonSharedBody, [{
      key: "addShape",
      value: function addShape(v) {
        var index = this.shapes.indexOf(v);

        if (index < 0) {
          var _index = this.body.shapes.length;
          this.body.addShape(v.impl);
          this.shapes.push(v);
          v.setIndex(_index);
          var offset = this.body.shapeOffsets[_index];
          var orient = this.body.shapeOrientations[_index];
          v.setOffsetAndOrient(offset, orient);
          if (this.body.isSleeping()) this.body.wakeUp();
        }
      }
    }, {
      key: "removeShape",
      value: function removeShape(v) {
        var index = this.shapes.indexOf(v);

        if (index >= 0) {
          this.shapes.splice(index, 1);
          this.body.removeShape(v.impl);
          v.setIndex(-1);
          if (this.body.isSleeping()) this.body.wakeUp();
        }
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        if (this.node.hasChangedFlags) {
          if (this.body.isSleeping()) this.body.wakeUp();

          _index2.Vec3.copy(this.body.position, this.node.worldPosition);

          _index2.Quat.copy(this.body.quaternion, this.node.worldRotation);

          this.body.aabbNeedsUpdate = true;

          if (this.node.hasChangedFlags & _nodeEnum.TransformBit.SCALE) {
            for (var i = 0; i < this.shapes.length; i++) {
              this.shapes[i].setScale(this.node.worldScale);
            }

            (0, _cannonUtil.commitShapeUpdates)(this.body);
          }
        }
      }
    }, {
      key: "syncPhysicsToScene",
      value: function syncPhysicsToScene() {
        if (this.body.type != _physicsEnum.ERigidBodyType.STATIC) {
          if (!this.body.isSleeping()) {
            _index2.Vec3.copy(v3_0, this.body.position);

            _index2.Quat.copy(quat_0, this.body.quaternion);

            this.node.worldPosition = v3_0;
            this.node.worldRotation = quat_0;
          }
        }
      }
    }, {
      key: "syncInitial",
      value: function syncInitial() {
        _index2.Vec3.copy(this.body.position, this.node.worldPosition);

        _index2.Quat.copy(this.body.quaternion, this.node.worldRotation);

        this.body.aabbNeedsUpdate = true;

        for (var i = 0; i < this.shapes.length; i++) {
          this.shapes[i].setScale(this.node.worldScale);
        }

        (0, _cannonUtil.commitShapeUpdates)(this.body);
        if (this.body.isSleeping()) this.body.wakeUp();
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.body.removeEventListener('cc-collide', this.onCollidedListener);
        CannonSharedBody.sharedBodesMap["delete"](this.node.uuid);
        delete _cannon.default.World['idToBodyMap'][this.body.id];
        this.node = null;
        this.wrappedWorld = null;
        this.body = null;
        this.shapes = null;
        this.onCollidedListener = null;
      }
    }, {
      key: "onCollided",
      value: function onCollided(event) {
        CollisionEventObject.type = event.event;
        var self = (0, _util.getWrap)(event.selfShape);
        var other = (0, _util.getWrap)(event.otherShape);

        if (self && self.collider.needCollisionEvent) {
          contactsPool.push.apply(contactsPool, CollisionEventObject.contacts);
          CollisionEventObject.contacts.length = 0;
          CollisionEventObject.impl = event;
          CollisionEventObject.selfCollider = self.collider;
          CollisionEventObject.otherCollider = other ? other.collider : null;
          var i = 0;

          for (i = 0; i < event.contacts.length; i++) {
            var cq = event.contacts[i];

            if (contactsPool.length > 0) {
              var c = contactsPool.pop();
              c.impl = cq;
              CollisionEventObject.contacts.push(c);
            } else {
              var _c = new _cannonContactEquation.CannonContactEquation(CollisionEventObject);

              _c.impl = cq;
              CollisionEventObject.contacts.push(_c);
            }
          }

          for (i = 0; i < this.shapes.length; i++) {
            var shape = this.shapes[i];
            shape.collider.emit(CollisionEventObject.type, CollisionEventObject);
          }
        }
      }
    }]);

    return CannonSharedBody;
  }();

  _exports.CannonSharedBody = CannonSharedBody;
  CannonSharedBody.sharedBodesMap = new Map();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvY2Fubm9uL2Nhbm5vbi1zaGFyZWQtYm9keS50cyJdLCJuYW1lcyI6WyJ2M18wIiwiVmVjMyIsInF1YXRfMCIsIlF1YXQiLCJjb250YWN0c1Bvb2wiLCJDb2xsaXNpb25FdmVudE9iamVjdCIsInR5cGUiLCJzZWxmQ29sbGlkZXIiLCJvdGhlckNvbGxpZGVyIiwiY29udGFjdHMiLCJpbXBsIiwiQ2Fubm9uU2hhcmVkQm9keSIsInYiLCJpbmRleCIsIndyYXBwZWRXb3JsZCIsImJvZGllcyIsImxlbmd0aCIsImFkZFNoYXJlZEJvZHkiLCJzeW5jSW5pdGlhbCIsImlzUmVtb3ZlIiwic2hhcGVzIiwid3JhcHBlZEJvZHkiLCJpc0VuYWJsZWQiLCJib2R5Iiwic2xlZXAiLCJyZW1vdmVTaGFyZWRCb2R5IiwicmVmIiwiZGVzdHJveSIsIm5vZGUiLCJrZXkiLCJ1dWlkIiwic2hhcmVkQm9kZXNNYXAiLCJoYXMiLCJnZXQiLCJuZXdTQiIsInNldCIsIm9uQ29sbGlkZWRMaXN0ZW5lciIsIm9uQ29sbGlkZWQiLCJiaW5kIiwiQ0FOTk9OIiwiQm9keSIsImNvbGxpc2lvbkZpbHRlckdyb3VwIiwiUGh5c2ljc1N5c3RlbSIsIlBoeXNpY3NHcm91cCIsIkRFRkFVTFQiLCJzbGVlcFNwZWVkTGltaXQiLCJpbnN0YW5jZSIsInNsZWVwVGhyZXNob2xkIiwibWF0ZXJpYWwiLCJkZWZhdWx0TWF0ZXJpYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiaW5kZXhPZiIsImFkZFNoYXBlIiwicHVzaCIsInNldEluZGV4Iiwib2Zmc2V0Iiwic2hhcGVPZmZzZXRzIiwib3JpZW50Iiwic2hhcGVPcmllbnRhdGlvbnMiLCJzZXRPZmZzZXRBbmRPcmllbnQiLCJpc1NsZWVwaW5nIiwid2FrZVVwIiwic3BsaWNlIiwicmVtb3ZlU2hhcGUiLCJoYXNDaGFuZ2VkRmxhZ3MiLCJjb3B5IiwicG9zaXRpb24iLCJ3b3JsZFBvc2l0aW9uIiwicXVhdGVybmlvbiIsIndvcmxkUm90YXRpb24iLCJhYWJiTmVlZHNVcGRhdGUiLCJUcmFuc2Zvcm1CaXQiLCJTQ0FMRSIsImkiLCJzZXRTY2FsZSIsIndvcmxkU2NhbGUiLCJFUmlnaWRCb2R5VHlwZSIsIlNUQVRJQyIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJXb3JsZCIsImlkIiwiZXZlbnQiLCJzZWxmIiwic2VsZlNoYXBlIiwib3RoZXIiLCJvdGhlclNoYXBlIiwiY29sbGlkZXIiLCJuZWVkQ29sbGlzaW9uRXZlbnQiLCJhcHBseSIsImNxIiwiYyIsInBvcCIsIkNhbm5vbkNvbnRhY3RFcXVhdGlvbiIsInNoYXBlIiwiZW1pdCIsIk1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFjQSxNQUFNQSxJQUFJLEdBQUcsSUFBSUMsWUFBSixFQUFiO0FBQ0EsTUFBTUMsTUFBTSxHQUFHLElBQUlDLFlBQUosRUFBZjtBQUNBLE1BQU1DLFlBQXFDLEdBQUcsRUFBOUM7QUFDQSxNQUFNQyxvQkFBb0IsR0FBRztBQUN6QkMsSUFBQUEsSUFBSSxFQUFFLGtCQURtQjtBQUV6QkMsSUFBQUEsWUFBWSxFQUFFLElBRlc7QUFHekJDLElBQUFBLGFBQWEsRUFBRSxJQUhVO0FBSXpCQyxJQUFBQSxRQUFRLEVBQUUsRUFKZTtBQUt6QkMsSUFBQUEsSUFBSSxFQUFFO0FBTG1CLEdBQTdCO0FBUUE7Ozs7O01BSWFDLGdCOzs7O0FBeUJUOzs7Ozt3QkFLYUMsQyxFQUFZO0FBQ3JCLFlBQUlBLENBQUosRUFBTztBQUNILGNBQUksS0FBS0MsS0FBTCxHQUFhLENBQWpCLEVBQW9CO0FBQ2hCLGlCQUFLQSxLQUFMLEdBQWEsS0FBS0MsWUFBTCxDQUFrQkMsTUFBbEIsQ0FBeUJDLE1BQXRDO0FBQ0EsaUJBQUtGLFlBQUwsQ0FBa0JHLGFBQWxCLENBQWdDLElBQWhDO0FBQ0EsaUJBQUtDLFdBQUw7QUFDSDtBQUNKLFNBTkQsTUFNTztBQUNILGNBQUksS0FBS0wsS0FBTCxJQUFj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Q3FDLEVBQW5DO0FBQ0g7QUFDSjs7QUFFRCxlQUFLakIsQ0FBQyxHQUFHLENBQVQsRUFBWUEsQ0FBQyxHQUFHLEtBQUtyRCxNQUFMLENBQVlKLE1BQTVCLEVBQW9DeUQsQ0FBQyxFQUFyQyxFQUF5QztBQUNyQyxnQkFBTW9CLEtBQUssR0FBRyxLQUFLekUsTUFBTCxDQUFZcUQsQ0FBWixDQUFkO0FBQ0FvQixZQUFBQSxLQUFLLENBQUNQLFFBQU4sQ0FBZVEsSUFBZixDQUFvQnpGLG9CQUFvQixDQUFDQyxJQUF6QyxFQUErQ0Qsb0JBQS9DO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7O0FBM0tRTSxFQUFBQSxnQixDQUVlb0IsYyxHQUFpQixJQUFJZ0UsR0FBSixFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENBTk5PTiBmcm9tICdAY29jb3MvY2Fubm9uJztcclxuaW1wb3J0IHsgUXVhdCwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IEVSaWdpZEJvZHlUeXBlIH0gZnJvbSAnLi4vZnJhbWV3b3JrL3BoeXNpY3MtZW51bSc7XHJcbmltcG9ydCB7IGdldFdyYXAgfSBmcm9tICcuLi9mcmFtZXdvcmsvdXRpbCc7XHJcbmltcG9ydCB7IENhbm5vbldvcmxkIH0gZnJvbSAnLi9jYW5ub24td29ybGQnO1xyXG5pbXBvcnQgeyBDYW5ub25TaGFwZSB9IGZyb20gJy4vc2hhcGVzL2Nhbm5vbi1zaGFwZSc7XHJcbmltcG9ydCB7IENvbGxpZGVyLCBQaHlzaWNzU3lzdGVtIH0gZnJvbSAnLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1lbnVtJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBDb2xsaXNpb25FdmVudFR5cGUsIElDb250YWN0RXF1YXRpb24gfSBmcm9tICcuLi9mcmFtZXdvcmsvcGh5c2ljcy1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDYW5ub25SaWdpZEJvZHkgfSBmcm9tICcuL2Nhbm5vbi1yaWdpZC1ib2R5JztcclxuaW1wb3J0IHsgY29tbWl0U2hhcGVVcGRhdGVzIH0gZnJvbSAnLi9jYW5ub24tdXRpbCc7XHJcbmltcG9ydCB7IENhbm5vbkNvbnRhY3RFcXVhdGlvbiB9IGZyb20gJy4vY2Fubm9uLWNvbnRhY3QtZXF1YXRpb24nO1xyXG5cclxuY29uc3QgdjNfMCA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHF1YXRfMCA9IG5ldyBRdWF0KCk7XHJcbmNvbnN0IGNvbnRhY3RzUG9vbDogQ2Fubm9uQ29udGFjdEVxdWF0aW9uW10gPSBbXSBhcyBhbnk7XHJcbmNvbnN0IENvbGxpc2lvbkV2ZW50T2JqZWN0ID0ge1xyXG4gICAgdHlwZTogJ29uQ29sbGlzaW9uRW50ZXInIGFzIENvbGxpc2lvbkV2ZW50VHlwZSxcclxuICAgIHNlbGZDb2xsaWRlcjogbnVsbCBhcyB1bmtub3duIGFzIENvbGxpZGVyLFxyXG4gICAgb3RoZXJDb2xsaWRlcjogbnVsbCBhcyB1bmtub3duIGFzIENvbGxpZGVyLFxyXG4gICAgY29udGFjdHM6IFtdIGFzIENhbm5vbkNvbnRhY3RFcXVhdGlvbltdLFxyXG4gICAgaW1wbDogbnVsbCBhcyB1bmtub3duIGFzIENBTk5PTi5JQ29sbGlzaW9uRXZlbnQsXHJcbn07XHJcblxyXG4vKipcclxuICogbm9kZSA6IHNoYXJlZC1ib2R5ID0gMSA6IDFcclxuICogc3RhdGljXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2Fubm9uU2hhcmVkQm9keSB7XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgc2hhcmVkQm9kZXNNYXAgPSBuZXcgTWFwPHN0cmluZywgQ2Fubm9uU2hhcmVkQm9keT4oKTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0U2hhcmVkQm9keSAobm9kZTogTm9kZSwgd3JhcHBlZFdvcmxkOiBDYW5ub25Xb3JsZCkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IG5vZGUudXVpZDtcclxuICAgICAgICBpZiAoQ2Fubm9uU2hhcmVkQm9keS5zaGFyZWRCb2Rlc01hcC5oYXMoa2V5KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gQ2Fubm9uU2hhcmVkQm9keS5zaGFyZWRCb2Rlc01hcC5nZXQoa2V5KSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3U0IgPSBuZXcgQ2Fubm9uU2hhcmVkQm9keShub2RlLCB3cmFwcGVkV29ybGQpO1xyXG4gICAgICAgICAgICBDYW5ub25TaGFyZWRCb2R5LnNoYXJlZEJvZGVzTWFwLnNldChub2RlLnV1aWQsIG5ld1NCKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ld1NCO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZWFkb25seSBub2RlOiBOb2RlO1xyXG4gICAgcmVhZG9ubHkgd3JhcHBlZFdvcmxkOiBDYW5ub25Xb3JsZDtcclxuICAgIHJlYWRvbmx5IGJvZHk6IENBTk5PTi5Cb2R5O1xyXG4gICAgcmVhZG9ubHkgc2hhcGVzOiBDYW5ub25TaGFwZVtdID0gW107XHJcbiAgICB3cmFwcGVkQm9keTogQ2Fubm9uUmlnaWRCb2R5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIHJlZjogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgb25Db2xsaWRlZExpc3RlbmVyID0gdGhpcy5vbkNvbGxpZGVkLmJpbmQodGhpcyk7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgb3IgcmVtb3ZlIGZyb20gd29ybGQgXFxcclxuICAgICAqIGFkZCwgaWYgZW5hYmxlIFxcXHJcbiAgICAgKiByZW1vdmUsIGlmIGRpc2FibGUgJiBzaGFwZXMubGVuZ3RoID09IDAgJiB3cmFwcGVkQm9keSBkaXNhYmxlXHJcbiAgICAgKi9cclxuICAgIHNldCBlbmFibGVkICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gdGhpcy53cmFwcGVkV29ybGQuYm9kaWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMud3JhcHBlZFdvcmxkLmFkZFNoYXJlZEJvZHkodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN5bmNJbml0aWFsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlbW92ZSA9ICh0aGlzLnNoYXBlcy5sZW5ndGggPT0gMCAmJiB0aGlzLndyYXBwZWRCb2R5ID09IG51bGwpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuc2hhcGVzLmxlbmd0aCA9PSAwICYmIHRoaXMud3JhcHBlZEJvZHkgIT0gbnVsbCAmJiAhdGhpcy53cmFwcGVkQm9keS5pc0VuYWJsZWQpXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzUmVtb3ZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnNsZWVwKCk7IC8vIGNsZWFyIHZlbG9jaXR5IGV0Yy5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQucmVtb3ZlU2hhcmVkQm9keSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgcmVmZXJlbmNlICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgdiA/IHRoaXMucmVmKysgOiB0aGlzLnJlZi0tO1xyXG4gICAgICAgIGlmICh0aGlzLnJlZiA9PSAwKSB7IHRoaXMuZGVzdHJveSgpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvciAobm9kZTogTm9kZSwgd3JhcHBlZFdvcmxkOiBDYW5ub25Xb3JsZCkge1xyXG4gICAgICAgIHRoaXMud3JhcHBlZFdvcmxkID0gd3JhcHBlZFdvcmxkO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy5ib2R5ID0gbmV3IENBTk5PTi5Cb2R5KCk7XHJcbiAgICAgICAgdGhpcy5ib2R5LmNvbGxpc2lvbkZpbHRlckdyb3VwID0gUGh5c2ljc1N5c3RlbS5QaHlzaWNzR3JvdXAuREVGQVVMVDtcclxuICAgICAgICB0aGlzLmJvZHkuc2xlZXBTcGVlZExpbWl0ID0gUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5zbGVlcFRocmVzaG9sZDtcclxuICAgICAgICB0aGlzLmJvZHkubWF0ZXJpYWwgPSB0aGlzLndyYXBwZWRXb3JsZC5pbXBsLmRlZmF1bHRNYXRlcmlhbDtcclxuICAgICAgICB0aGlzLmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignY2MtY29sbGlkZScsIHRoaXMub25Db2xsaWRlZExpc3RlbmVyKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTaGFwZSAodjogQ2Fubm9uU2hhcGUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hhcGVzLmluZGV4T2Yodik7XHJcbiAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYm9keS5zaGFwZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICB0aGlzLmJvZHkuYWRkU2hhcGUodi5pbXBsKTtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZXMucHVzaCh2KTtcclxuXHJcbiAgICAgICAgICAgIHYuc2V0SW5kZXgoaW5kZXgpO1xyXG4gICAgICAgICAgICBjb25zdCBvZmZzZXQgPSB0aGlzLmJvZHkuc2hhcGVPZmZzZXRzW2luZGV4XTtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZW50ID0gdGhpcy5ib2R5LnNoYXBlT3JpZW50YXRpb25zW2luZGV4XTtcclxuICAgICAgICAgICAgdi5zZXRPZmZzZXRBbmRPcmllbnQob2Zmc2V0LCBvcmllbnQpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2R5LmlzU2xlZXBpbmcoKSkgdGhpcy5ib2R5Lndha2VVcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVTaGFwZSAodjogQ2Fubm9uU2hhcGUpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuc2hhcGVzLmluZGV4T2Yodik7XHJcbiAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zaGFwZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgdGhpcy5ib2R5LnJlbW92ZVNoYXBlKHYuaW1wbCk7XHJcbiAgICAgICAgICAgIHYuc2V0SW5kZXgoLTEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ib2R5LmlzU2xlZXBpbmcoKSkgdGhpcy5ib2R5Lndha2VVcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzeW5jU2NlbmVUb1BoeXNpY3MgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLm5vZGUuaGFzQ2hhbmdlZEZsYWdzKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvZHkuaXNTbGVlcGluZygpKSB0aGlzLmJvZHkud2FrZVVwKCk7XHJcbiAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLmJvZHkucG9zaXRpb24sIHRoaXMubm9kZS53b3JsZFBvc2l0aW9uKTtcclxuICAgICAgICAgICAgUXVhdC5jb3B5KHRoaXMuYm9keS5xdWF0ZXJuaW9uLCB0aGlzLm5vZGUud29ybGRSb3RhdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keS5hYWJiTmVlZHNVcGRhdGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmhhc0NoYW5nZWRGbGFncyAmIFRyYW5zZm9ybUJpdC5TQ0FMRSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNoYXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVzW2ldLnNldFNjYWxlKHRoaXMubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbW1pdFNoYXBlVXBkYXRlcyh0aGlzLmJvZHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN5bmNQaHlzaWNzVG9TY2VuZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYm9keS50eXBlICE9IEVSaWdpZEJvZHlUeXBlLlNUQVRJQykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuYm9keS5pc1NsZWVwaW5nKCkpIHtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weSh2M18wLCB0aGlzLmJvZHkucG9zaXRpb24pO1xyXG4gICAgICAgICAgICAgICAgUXVhdC5jb3B5KHF1YXRfMCwgdGhpcy5ib2R5LnF1YXRlcm5pb24pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLndvcmxkUG9zaXRpb24gPSB2M18wO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ub2RlLndvcmxkUm90YXRpb24gPSBxdWF0XzA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3luY0luaXRpYWwgKCkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLmJvZHkucG9zaXRpb24sIHRoaXMubm9kZS53b3JsZFBvc2l0aW9uKTtcclxuICAgICAgICBRdWF0LmNvcHkodGhpcy5ib2R5LnF1YXRlcm5pb24sIHRoaXMubm9kZS53b3JsZFJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLmJvZHkuYWFiYk5lZWRzVXBkYXRlID0gdHJ1ZTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2hhcGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVzW2ldLnNldFNjYWxlKHRoaXMubm9kZS53b3JsZFNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tbWl0U2hhcGVVcGRhdGVzKHRoaXMuYm9keSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmJvZHkuaXNTbGVlcGluZygpKSB0aGlzLmJvZHkud2FrZVVwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLmJvZHkucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2MtY29sbGlkZScsIHRoaXMub25Db2xsaWRlZExpc3RlbmVyKTtcclxuICAgICAgICBDYW5ub25TaGFyZWRCb2R5LnNoYXJlZEJvZGVzTWFwLmRlbGV0ZSh0aGlzLm5vZGUudXVpZCk7XHJcbiAgICAgICAgZGVsZXRlIENBTk5PTi5Xb3JsZFsnaWRUb0JvZHlNYXAnXVt0aGlzLmJvZHkuaWRdO1xyXG4gICAgICAgICh0aGlzLm5vZGUgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMud3JhcHBlZFdvcmxkIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLmJvZHkgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVzIGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgICh0aGlzLm9uQ29sbGlkZWRMaXN0ZW5lciBhcyBhbnkpID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uQ29sbGlkZWQgKGV2ZW50OiBDQU5OT04uSUNvbGxpc2lvbkV2ZW50KSB7XHJcbiAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3QudHlwZSA9IGV2ZW50LmV2ZW50O1xyXG4gICAgICAgIGNvbnN0IHNlbGYgPSBnZXRXcmFwPENhbm5vblNoYXBlPihldmVudC5zZWxmU2hhcGUpO1xyXG4gICAgICAgIGNvbnN0IG90aGVyID0gZ2V0V3JhcDxDYW5ub25TaGFwZT4oZXZlbnQub3RoZXJTaGFwZSk7XHJcbiAgICAgICAgaWYgKHNlbGYgJiYgc2VsZi5jb2xsaWRlci5uZWVkQ29sbGlzaW9uRXZlbnQpIHtcclxuICAgICAgICAgICAgY29udGFjdHNQb29sLnB1c2guYXBwbHkoY29udGFjdHNQb29sLCBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cyBhcyBDYW5ub25Db250YWN0RXF1YXRpb25bXSk7XHJcbiAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LmNvbnRhY3RzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5pbXBsID0gZXZlbnQ7XHJcbiAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IHNlbGYuY29sbGlkZXI7XHJcbiAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0Lm90aGVyQ29sbGlkZXIgPSBvdGhlciA/IG90aGVyLmNvbGxpZGVyIDogKG51bGwgYXMgYW55KTtcclxuXHJcbiAgICAgICAgICAgIGxldCBpID0gMDtcclxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGV2ZW50LmNvbnRhY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjcSA9IGV2ZW50LmNvbnRhY3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNvbnRhY3RzUG9vbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYyA9IGNvbnRhY3RzUG9vbC5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBjIS5pbXBsID0gY3E7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3QuY29udGFjdHMucHVzaChjISk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBuZXcgQ2Fubm9uQ29udGFjdEVxdWF0aW9uKENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICBjLmltcGwgPSBjcTtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5wdXNoKGMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5zaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5zaGFwZXNbaV07XHJcbiAgICAgICAgICAgICAgICBzaGFwZS5jb2xsaWRlci5lbWl0KENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUsIENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXX0=