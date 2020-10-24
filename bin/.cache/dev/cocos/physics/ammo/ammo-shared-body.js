(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ammo-instantiated.js", "../../core/scene-graph/node-enum.js", "./ammo-util.js", "./ammo-enum.js", "./ammo-instance.js", "./ammo-const.js", "../framework/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ammo-instantiated.js"), require("../../core/scene-graph/node-enum.js"), require("./ammo-util.js"), require("./ammo-enum.js"), require("./ammo-instance.js"), require("./ammo-const.js"), require("../framework/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.nodeEnum, global.ammoUtil, global.ammoEnum, global.ammoInstance, global.ammoConst, global.index);
    global.ammoSharedBody = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _nodeEnum, _ammoUtil, _ammoEnum, _ammoInstance, _ammoConst, _index3) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoSharedBody = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var v3_0 = _ammoConst.CC_V3_0;
  var quat_0 = _ammoConst.CC_QUAT_0;
  var sharedIDCounter = 0;
  /**
   * shared object, node : shared = 1 : 1
   * body for static \ dynamic \ kinematic (collider)
   * ghost for trigger
   */

  var AmmoSharedBody = /*#__PURE__*/function () {
    _createClass(AmmoSharedBody, [{
      key: "wrappedBody",
      get: function get() {
        return this._wrappedBody;
      }
    }, {
      key: "bodyCompoundShape",
      get: function get() {
        return this.bodyStruct.shape;
      }
    }, {
      key: "ghostCompoundShape",
      get: function get() {
        return this.ghostStruct.shape;
      }
    }, {
      key: "body",
      get: function get() {
        return this.bodyStruct.body;
      }
    }, {
      key: "ghost",
      get: function get() {
        return this.ghostStruct.ghost;
      }
    }, {
      key: "collisionFilterGroup",
      get: function get() {
        return this._collisionFilterGroup;
      },
      set: function set(v) {
        if (v != this._collisionFilterGroup) {
          this._collisionFilterGroup = v;
          this.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
          this.dirty |= _ammoEnum.EAmmoSharedBodyDirty.GHOST_RE_ADD;
        }
      }
    }, {
      key: "collisionFilterMask",
      get: function get() {
        return this._collisionFilterMask;
      },
      set: function set(v) {
        if (v != this._collisionFilterMask) {
          this._collisionFilterMask = v;
          this.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
          this.dirty |= _ammoEnum.EAmmoSharedBodyDirty.GHOST_RE_ADD;
        }
      }
    }, {
      key: "bodyStruct",
      get: function get() {
        this._instantiateBodyStruct();

        return this._bodyStruct;
      }
    }, {
      key: "ghostStruct",
      get: function get() {
        this._instantiateGhostStruct();

        return this._ghostStruct;
      }
    }, {
      key: "bodyEnabled",

      /**
       * add or remove from world \
       * add, if enable \
       * remove, if disable & shapes.length == 0 & wrappedBody disable
       */
      set: function set(v) {
        if (v) {
          if (this.bodyIndex < 0) {
            this.bodyIndex = this.wrappedWorld.bodies.length;
            this.body.clearState();
            this.wrappedWorld.addSharedBody(this);
            this.syncInitialBody();
          }
        } else {
          if (this.bodyIndex >= 0) {
            var isRemoveBody = this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody == null || this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.isEnabled || this.bodyStruct.wrappedShapes.length == 0 && this.wrappedBody != null && !this.wrappedBody.rigidBody.enabledInHierarchy;

            if (isRemoveBody) {
              this.body.clearState(); // clear velocity etc.

              this.bodyIndex = -1;
              this.wrappedWorld.removeSharedBody(this);
            }
          }
        }
      }
    }, {
      key: "ghostEnabled",
      set: function set(v) {
        if (v) {
          if (this.ghostIndex < 0 && this.ghostStruct.wrappedShapes.length > 0) {
            this.ghostIndex = 1;
            this.wrappedWorld.addGhostObject(this);
            this.syncInitialGhost();
          }
        } else {
          if (this.ghostIndex >= 0) {
            /** remove trigger */
            var isRemoveGhost = this.ghostStruct.wrappedShapes.length == 0 && this.ghost;

            if (isRemoveGhost) {
              this.ghostIndex = -1;
              this.wrappedWorld.removeGhostObject(this);
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
      value: function getSharedBody(node, wrappedWorld, wrappedBody) {
        var key = node.uuid;
        var newSB;

        if (AmmoSharedBody.sharedBodesMap.has(key)) {
          newSB = AmmoSharedBody.sharedBodesMap.get(key);
        } else {
          newSB = new AmmoSharedBody(node, wrappedWorld);
          AmmoSharedBody.sharedBodesMap.set(node.uuid, newSB);
        }

        if (wrappedBody) {
          newSB._wrappedBody = wrappedBody;
        }

        return newSB;
      }
    }]);

    function AmmoSharedBody(node, wrappedWorld) {
      _classCallCheck(this, AmmoSharedBody);

      this.id = void 0;
      this.node = void 0;
      this.wrappedWorld = void 0;
      this.dirty = 0;
      this._collisionFilterGroup = _index3.PhysicsSystem.PhysicsGroup.DEFAULT;
      this._collisionFilterMask = -1;
      this.ref = 0;
      this.bodyIndex = -1;
      this.ghostIndex = -1;
      this._wrappedBody = null;
      this.id = AmmoSharedBody.idCounter++;
      this.wrappedWorld = wrappedWorld;
      this.node = node;
    }

    _createClass(AmmoSharedBody, [{
      key: "_instantiateBodyStruct",
      value: function _instantiateBodyStruct() {
        if (this._bodyStruct) return;
        /** body struct */

        var st = new _ammoInstantiated.default.btTransform();
        st.setIdentity();
        (0, _ammoUtil.cocos2AmmoVec3)(st.getOrigin(), this.node.worldPosition);
        var bodyQuat = new _ammoInstantiated.default.btQuaternion();
        (0, _ammoUtil.cocos2AmmoQuat)(bodyQuat, this.node.worldRotation);
        st.setRotation(bodyQuat);
        var motionState = new _ammoInstantiated.default.btDefaultMotionState(st);
        var localInertia = new _ammoInstantiated.default.btVector3(1.6666666269302368, 1.6666666269302368, 1.6666666269302368);
        var bodyShape = new _ammoInstantiated.default.btCompoundShape();
        var rbInfo = new _ammoInstantiated.default.btRigidBodyConstructionInfo(0, motionState, _ammoConst.AmmoConstant.instance.EMPTY_SHAPE, localInertia);
        var body = new _ammoInstantiated.default.btRigidBody(rbInfo);
        var sleepTd = _index3.PhysicsSystem.instance.sleepThreshold;
        body.setSleepingThresholds(sleepTd, sleepTd);
        this._bodyStruct = {
          'id': sharedIDCounter++,
          'body': body,
          'localInertia': localInertia,
          'motionState': motionState,
          'startTransform': st,
          'shape': bodyShape,
          'rbInfo': rbInfo,
          'worldQuat': bodyQuat,
          'wrappedShapes': [],
          'useCompound': false
        };
        _ammoInstance.AmmoInstance.bodyStructs['KEY' + this._bodyStruct.id] = this._bodyStruct;
        this.body.setUserIndex(this._bodyStruct.id);
        this.body.setActivationState(_ammoEnum.AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        if (_ammoInstantiated.default['CC_CONFIG']['ignoreSelfBody'] && this._ghostStruct) this.ghost.setIgnoreCollisionCheck(this.body, true);
      }
    }, {
      key: "_instantiateGhostStruct",
      value: function _instantiateGhostStruct() {
        if (this._ghostStruct) return;
        /** ghost struct */

        var ghost = new _ammoInstantiated.default.btCollisionObject();
        var ghostShape = new _ammoInstantiated.default.btCompoundShape();
        ghost.setCollisionShape(ghostShape);
        ghost.setCollisionFlags(_ammoEnum.AmmoCollisionFlags.CF_NO_CONTACT_RESPONSE);
        this._ghostStruct = {
          'id': sharedIDCounter++,
          'ghost': ghost,
          'shape': ghostShape,
          'worldQuat': new _ammoInstantiated.default.btQuaternion(),
          'wrappedShapes': []
        };
        _ammoInstance.AmmoInstance.ghostStructs['KEY' + this._ghostStruct.id] = this._ghostStruct;
        this.ghost.setUserIndex(this._ghostStruct.id);
        this.ghost.setActivationState(_ammoEnum.AmmoCollisionObjectStates.DISABLE_DEACTIVATION);
        if (_ammoInstantiated.default['CC_CONFIG']['ignoreSelfBody'] && this._bodyStruct) this.ghost.setIgnoreCollisionCheck(this.body, true);
      }
    }, {
      key: "addShape",
      value: function addShape(v, isTrigger) {
        function switchShape(that, shape) {
          that.body.setCollisionShape(shape);
          that.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;

          if (that._wrappedBody && that._wrappedBody.isEnabled) {
            that._wrappedBody.setMass(that._wrappedBody.rigidBody.mass);
          }
        }

        if (isTrigger) {
          var index = this.ghostStruct.wrappedShapes.indexOf(v);

          if (index < 0) {
            this.ghostStruct.wrappedShapes.push(v);
            v.setCompound(this.ghostCompoundShape);
            this.ghostEnabled = true;
          }
        } else {
          var _index = this.bodyStruct.wrappedShapes.indexOf(v);

          if (_index < 0) {
            this.bodyStruct.wrappedShapes.push(v);

            if (this.bodyStruct.useCompound) {
              v.setCompound(this.bodyCompoundShape);
            } else {
              var l = this.bodyStruct.wrappedShapes.length;

              if (l == 1 && !v.needCompound()) {
                switchShape(this, v.impl);
              } else {
                this.bodyStruct.useCompound = true;

                for (var i = 0; i < l; i++) {
                  var childShape = this.bodyStruct.wrappedShapes[i];
                  childShape.setCompound(this.bodyCompoundShape);
                }

                switchShape(this, this.bodyStruct.shape);
              }
            }

            this.bodyEnabled = true;
          }
        }
      }
    }, {
      key: "removeShape",
      value: function removeShape(v, isTrigger) {
        if (isTrigger) {
          var index = this.ghostStruct.wrappedShapes.indexOf(v);

          if (index >= 0) {
            this.ghostStruct.wrappedShapes.splice(index, 1);
            v.setCompound(null);
            this.ghostEnabled = false;
          }
        } else {
          var _index2 = this.bodyStruct.wrappedShapes.indexOf(v);

          if (_index2 >= 0) {
            if (this.bodyStruct.useCompound) {
              v.setCompound(null);
            } else {
              this.body.setCollisionShape(_ammoConst.AmmoConstant.instance.EMPTY_SHAPE);
            }

            this.body.activate(true);
            this.dirty |= _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD;
            this.bodyStruct.wrappedShapes.splice(_index2, 1);
            this.bodyEnabled = false;
          }
        }
      }
    }, {
      key: "updateDirty",
      value: function updateDirty() {
        if (this.dirty) {
          if (this.bodyIndex >= 0 && this.dirty & _ammoEnum.EAmmoSharedBodyDirty.BODY_RE_ADD) this.updateBodyByReAdd();
          if (this.ghostIndex >= 0 && this.dirty & _ammoEnum.EAmmoSharedBodyDirty.GHOST_RE_ADD) this.updateGhostByReAdd();
          this.dirty = 0;
        }
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        if (this.node.hasChangedFlags) {
          var wt = this.body.getWorldTransform();
          (0, _ammoUtil.cocos2AmmoVec3)(wt.getOrigin(), this.node.worldPosition);
          (0, _ammoUtil.cocos2AmmoQuat)(this.bodyStruct.worldQuat, this.node.worldRotation);
          wt.setRotation(this.bodyStruct.worldQuat);
          if (this.isBodySleeping()) this.body.activate();

          if (this.node.hasChangedFlags & _nodeEnum.TransformBit.SCALE) {
            for (var i = 0; i < this.bodyStruct.wrappedShapes.length; i++) {
              this.bodyStruct.wrappedShapes[i].setScale();
            }
          }
        }
      }
      /**
       * TODO: use motion state
       */

    }, {
      key: "syncPhysicsToScene",
      value: function syncPhysicsToScene() {
        if (this.body.isStaticObject() || this.isBodySleeping()) {
          return;
        } // let transform = new Ammo.btTransform();
        // this.body.getMotionState().getWorldTransform(transform);


        var wt0 = this.body.getWorldTransform();
        this.node.worldPosition = (0, _ammoUtil.ammo2CocosVec3)(v3_0, wt0.getOrigin());
        wt0.getBasis().getRotation(this.bodyStruct.worldQuat);
        this.node.worldRotation = (0, _ammoUtil.ammo2CocosQuat)(quat_0, this.bodyStruct.worldQuat);
        var wt1 = this.ghost.getWorldTransform();
        (0, _ammoUtil.cocos2AmmoVec3)(wt1.getOrigin(), this.node.worldPosition);
        (0, _ammoUtil.cocos2AmmoQuat)(this.ghostStruct.worldQuat, this.node.worldRotation);
        wt1.setRotation(this.ghostStruct.worldQuat);
      }
    }, {
      key: "syncSceneToGhost",
      value: function syncSceneToGhost() {
        if (this.node.hasChangedFlags) {
          var wt1 = this.ghost.getWorldTransform();
          (0, _ammoUtil.cocos2AmmoVec3)(wt1.getOrigin(), this.node.worldPosition);
          (0, _ammoUtil.cocos2AmmoQuat)(this.ghostStruct.worldQuat, this.node.worldRotation);
          wt1.setRotation(this.ghostStruct.worldQuat);
          this.ghost.activate();

          if (this.node.hasChangedFlags & _nodeEnum.TransformBit.SCALE) {
            for (var i = 0; i < this.ghostStruct.wrappedShapes.length; i++) {
              this.ghostStruct.wrappedShapes[i].setScale();
            }
          }
        }
      }
    }, {
      key: "syncInitialBody",
      value: function syncInitialBody() {
        var wt = this.body.getWorldTransform();
        (0, _ammoUtil.cocos2AmmoVec3)(wt.getOrigin(), this.node.worldPosition);
        (0, _ammoUtil.cocos2AmmoQuat)(this.bodyStruct.worldQuat, this.node.worldRotation);
        wt.setRotation(this.bodyStruct.worldQuat);

        for (var i = 0; i < this.bodyStruct.wrappedShapes.length; i++) {
          this.bodyStruct.wrappedShapes[i].setScale();
        }

        this.body.activate();
      }
    }, {
      key: "syncInitialGhost",
      value: function syncInitialGhost() {
        var wt1 = this.ghost.getWorldTransform();
        (0, _ammoUtil.cocos2AmmoVec3)(wt1.getOrigin(), this.node.worldPosition);
        (0, _ammoUtil.cocos2AmmoQuat)(this.ghostStruct.worldQuat, this.node.worldRotation);
        wt1.setRotation(this.ghostStruct.worldQuat);

        for (var i = 0; i < this.ghostStruct.wrappedShapes.length; i++) {
          this.ghostStruct.wrappedShapes[i].setScale();
        }

        this.ghost.activate();
      }
      /**
       * see: https://pybullet.org/Bullet/phpBB3/viewtopic.php?f=9&t=5312&p=19094&hilit=how+to+change+group+mask#p19097
       */

    }, {
      key: "updateBodyByReAdd",
      value: function updateBodyByReAdd() {
        if (this.bodyIndex >= 0) {
          this.wrappedWorld.removeSharedBody(this);
          this.bodyIndex = this.wrappedWorld.bodies.length;
          this.wrappedWorld.addSharedBody(this);
        }
      }
    }, {
      key: "updateGhostByReAdd",
      value: function updateGhostByReAdd() {
        if (this.ghostIndex >= 0) {
          this.wrappedWorld.removeGhostObject(this);
          this.ghostIndex = this.wrappedWorld.ghosts.length;
          this.wrappedWorld.addGhostObject(this);
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        AmmoSharedBody.sharedBodesMap["delete"](this.node.uuid);
        this.node = null;
        this.wrappedWorld = null;

        if (this._bodyStruct) {
          var bodyStruct = this._bodyStruct;

          _ammoInstantiated.default.destroy(bodyStruct.localInertia);

          _ammoInstantiated.default.destroy(bodyStruct.worldQuat);

          _ammoInstantiated.default.destroy(bodyStruct.startTransform);

          _ammoInstantiated.default.destroy(bodyStruct.motionState);

          _ammoInstantiated.default.destroy(bodyStruct.rbInfo);

          _ammoInstantiated.default.destroy(bodyStruct.shape);

          (0, _ammoUtil.ammoDeletePtr)(bodyStruct.shape, _ammoInstantiated.default.btCollisionShape);

          var body = _ammoInstantiated.default.castObject(bodyStruct.body, _ammoInstantiated.default.btRigidBody);

          body['wrapped'] = null; // Ammo.destroy(bodyStruct.body);

          (0, _ammoUtil.ammoDeletePtr)(bodyStruct.body, _ammoInstantiated.default.btRigidBody);
          (0, _ammoUtil.ammoDeletePtr)(bodyStruct.body, _ammoInstantiated.default.btCollisionObject);
          var key0 = 'KEY' + bodyStruct.id;
          delete _ammoInstance.AmmoInstance.bodyStructs[key0];
          this._bodyStruct = null;
        }

        if (this._ghostStruct) {
          var ghostStruct = this._ghostStruct;

          _ammoInstantiated.default.destroy(ghostStruct.worldQuat);

          _ammoInstantiated.default.destroy(ghostStruct.shape);

          (0, _ammoUtil.ammoDeletePtr)(ghostStruct.shape, _ammoInstantiated.default.btCollisionShape);

          _ammoInstantiated.default.destroy(ghostStruct.ghost);

          var key1 = 'KEY' + ghostStruct.id;
          delete _ammoInstance.AmmoInstance.bodyStructs[key1];
          this._ghostStruct = null;
        }
      }
    }, {
      key: "isBodySleeping",
      value: function isBodySleeping() {
        var state = this.body.getActivationState();
        return state == _ammoEnum.AmmoCollisionObjectStates.ISLAND_SLEEPING;
      }
    }]);

    return AmmoSharedBody;
  }();

  _exports.AmmoSharedBody = AmmoSharedBody;
  AmmoSharedBody.idCounter = 0;
  AmmoSharedBody.sharedBodesMap = new Map();
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLXNoYXJlZC1ib2R5LnRzIl0sIm5hbWVzIjpbInYzXzAiLCJDQ19WM18wIiwicXVhdF8wIiwiQ0NfUVVBVF8wIiwic2hhcmVkSURDb3VudGVyIiwiQW1tb1NoYXJlZEJvZHkiLCJfd3JhcHBlZEJvZHkiLCJib2R5U3RydWN0Iiwic2hhcGUiLCJnaG9zdFN0cnVjdCIsImJvZHkiLCJnaG9zdCIsIl9jb2xsaXNpb25GaWx0ZXJHcm91cCIsInYiLCJkaXJ0eSIsIkVBbW1vU2hhcmVkQm9keURpcnR5IiwiQk9EWV9SRV9BREQiLCJHSE9TVF9SRV9BREQiLCJfY29sbGlzaW9uRmlsdGVyTWFzayIsIl9pbnN0YW50aWF0ZUJvZHlTdHJ1Y3QiLCJfYm9keVN0cnVjdCIsIl9pbnN0YW50aWF0ZUdob3N0U3RydWN0IiwiX2dob3N0U3RydWN0IiwiYm9keUluZGV4Iiwid3JhcHBlZFdvcmxkIiwiYm9kaWVzIiwibGVuZ3RoIiwiY2xlYXJTdGF0ZSIsImFkZFNoYXJlZEJvZHkiLCJzeW5jSW5pdGlhbEJvZHkiLCJpc1JlbW92ZUJvZHkiLCJ3cmFwcGVkU2hhcGVzIiwid3JhcHBlZEJvZHkiLCJpc0VuYWJsZWQiLCJyaWdpZEJvZHkiLCJlbmFibGVkSW5IaWVyYXJjaHkiLCJyZW1vdmVTaGFyZWRCb2R5IiwiZ2hvc3RJbmRleCIsImFkZEdob3N0T2JqZWN0Iiwic3luY0luaXRpYWxHaG9zdCIsImlzUmVtb3ZlR2hvc3QiLCJyZW1vdmVHaG9zdE9iamVjdCIsInJlZiIsImRlc3Ryb3kiLCJub2RlIiwia2V5IiwidXVpZCIsIm5ld1NCIiwic2hhcmVkQm9kZXNNYXAiLCJoYXMiLCJnZXQiLCJzZXQiLCJpZCIsIlBoeXNpY3NTeXN0ZW0iLCJQaHlzaWNzR3JvdXAiLCJERUZBVUxUIiwiaWRDb3VudGVyIiwic3QiLCJBbW1vIiwiYnRUcmFuc2Zvcm0iLCJzZXRJZGVudGl0eSIsImdldE9yaWdpbiIsIndvcmxkUG9zaXRpb24iLCJib2R5UXVhdCIsImJ0UXVhdGVybmlvbiIsIndvcmxkUm90YXRpb24iLCJzZXRSb3RhdGlvbiIsIm1vdGlvblN0YXRlIiwiYnREZWZhdWx0TW90aW9uU3RhdGUiLCJsb2NhbEluZXJ0aWEiLCJidFZlY3RvcjMiLCJib2R5U2hhcGUiLCJidENvbXBvdW5kU2hhcGUiLCJyYkluZm8iLCJidFJpZ2lkQm9keUNvbnN0cnVjdGlvbkluZm8iLCJBbW1vQ29uc3RhbnQiLCJpbnN0YW5jZSIsIkVNUFRZX1NIQVBFIiwiYnRSaWdpZEJvZHkiLCJzbGVlcFRkIiwic2xlZXBUaHJlc2hvbGQiLCJzZXRTbGVlcGluZ1RocmVzaG9sZHMiLCJBbW1vSW5zdGFuY2UiLCJib2R5U3RydWN0cyIsInNldFVzZXJJbmRleCIsInNldEFjdGl2YXRpb25TdGF0ZSIsIkFtbW9Db2xsaXNpb25PYmplY3RTdGF0ZXMiLCJESVNBQkxFX0RFQUNUSVZBVElPTiIsInNldElnbm9yZUNvbGxpc2lvbkNoZWNrIiwiYnRDb2xsaXNpb25PYmplY3QiLCJnaG9zdFNoYXBlIiwic2V0Q29sbGlzaW9uU2hhcGUiLCJzZXRDb2xsaXNpb25GbGFncyIsIkFtbW9Db2xsaXNpb25GbGFncyIsIkNGX05PX0NPTlRBQ1RfUkVTUE9OU0UiLCJnaG9zdFN0cnVjdHMiLCJpc1RyaWdnZXIiLCJzd2l0Y2hTaGFwZSIsInRoYXQiLCJzZXRNYXNzIiwibWFzcyIsImluZGV4IiwiaW5kZXhPZiIsInB1c2giLCJzZXRDb21wb3VuZCIsImdob3N0Q29tcG91bmRTaGFwZSIsImdob3N0RW5hYmxlZCIsInVzZUNvbXBvdW5kIiwiYm9keUNvbXBvdW5kU2hhcGUiLCJsIiwibmVlZENvbXBvdW5kIiwiaW1wbCIsImkiLCJjaGlsZFNoYXBlIiwiYm9keUVuYWJsZWQiLCJzcGxpY2UiLCJhY3RpdmF0ZSIsInVwZGF0ZUJvZHlCeVJlQWRkIiwidXBkYXRlR2hvc3RCeVJlQWRkIiwiaGFzQ2hhbmdlZEZsYWdzIiwid3QiLCJnZXRXb3JsZFRyYW5zZm9ybSIsIndvcmxkUXVhdCIsImlzQm9keVNsZWVwaW5nIiwiVHJhbnNmb3JtQml0IiwiU0NBTEUiLCJzZXRTY2FsZSIsImlzU3RhdGljT2JqZWN0Iiwid3QwIiwiZ2V0QmFzaXMiLCJnZXRSb3RhdGlvbiIsInd0MSIsImdob3N0cyIsInN0YXJ0VHJhbnNmb3JtIiwiYnRDb2xsaXNpb25TaGFwZSIsImNhc3RPYmplY3QiLCJrZXkwIiwia2V5MSIsInN0YXRlIiwiZ2V0QWN0aXZhdGlvblN0YXRlIiwiSVNMQU5EX1NMRUVQSU5HIiwiTWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWFBLE1BQU1BLElBQUksR0FBR0Msa0JBQWI7QUFDQSxNQUFNQyxNQUFNLEdBQUdDLG9CQUFmO0FBQ0EsTUFBSUMsZUFBZSxHQUFHLENBQXRCO0FBRUE7Ozs7OztNQUthQyxjOzs7MEJBa0JVO0FBQ2YsZUFBTyxLQUFLQyxZQUFaO0FBQ0g7OzswQkFFd0I7QUFDckIsZUFBTyxLQUFLQyxVQUFMLENBQWdCQyxLQUF2QjtBQUNIOzs7MEJBRXlCO0FBQ3RCLGVBQU8sS0FBS0MsV0FBTCxDQUFpQkQsS0FBeEI7QUFDSDs7OzBCQUVXO0FBQ1IsZUFBTyxLQUFLRCxVQUFMLENBQWdCRyxJQUF2QjtBQUNIOzs7MEJBRVk7QUFDVCxlQUFPLEtBQUtELFdBQUwsQ0FBaUJFLEtBQXhCO0FBQ0g7OzswQkFFMkI7QUFBRSxlQUFPLEtBQUtDLHFCQUFaO0FBQW9DLE87d0JBQ3hDQyxDLEVBQVc7QUFDakMsWUFBSUEsQ0FBQyxJQUFJLEtBQUtELHFCQUFkLEVBQXFDO0FBQ2pDLGVBQUtBLHFCQUFMLEdBQTZCQyxDQUE3QjtBQUNBLGVBQUtDLEtBQUwsSUFBY0MsK0JBQXFCQyxXQUFuQztBQUNBLGVBQUtGLEtBQUwsSUFBY0MsK0JBQXFCRSxZQUFuQztBQUNIO0FBQ0o7OzswQkFFMEI7QUFBRSxlQUFPLEtBQUtDLG9CQUFaO0FBQW1DLE87d0JBQ3ZDTCxDLEVBQVc7QUFDaEMsWUFBSUEsQ0FB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LElBQTdCO0FBQ0g7QUFDSjs7O3VDQUV5QjtBQUN0QixZQUFNb0gsS0FBSyxHQUFHLEtBQUtoSSxJQUFMLENBQVVpSSxrQkFBVixFQUFkO0FBQ0EsZUFBT0QsS0FBSyxJQUFJcEQsb0NBQTBCc0QsZUFBMUM7QUFDSDs7Ozs7OztBQS9ZUXZJLEVBQUFBLGMsQ0FFTW1ELFMsR0FBWSxDO0FBRmxCbkQsRUFBQUEsYyxDQUdlMkMsYyxHQUFpQixJQUFJNkYsR0FBSixFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEFtbW8gZnJvbSAnLi9hbW1vLWluc3RhbnRpYXRlZCc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS1lbnVtJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBBbW1vV29ybGQgfSBmcm9tICcuL2FtbW8td29ybGQnO1xyXG5pbXBvcnQgeyBBbW1vUmlnaWRCb2R5IH0gZnJvbSAnLi9hbW1vLXJpZ2lkLWJvZHknO1xyXG5pbXBvcnQgeyBBbW1vU2hhcGUgfSBmcm9tICcuL3NoYXBlcy9hbW1vLXNoYXBlJztcclxuaW1wb3J0IHsgY29jb3MyQW1tb1ZlYzMsIGNvY29zMkFtbW9RdWF0LCBhbW1vMkNvY29zVmVjMywgYW1tbzJDb2Nvc1F1YXQsIGFtbW9EZWxldGVQdHIgfSBmcm9tICcuL2FtbW8tdXRpbCc7XHJcbmltcG9ydCB7IEFtbW9Db2xsaXNpb25GbGFncywgQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcywgRUFtbW9TaGFyZWRCb2R5RGlydHkgfSBmcm9tICcuL2FtbW8tZW51bSc7XHJcbmltcG9ydCB7IEFtbW9JbnN0YW5jZSB9IGZyb20gJy4vYW1tby1pbnN0YW5jZSc7XHJcbmltcG9ydCB7IElBbW1vQm9keVN0cnVjdCwgSUFtbW9HaG9zdFN0cnVjdCB9IGZyb20gJy4vYW1tby1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBDQ19WM18wLCBDQ19RVUFUXzAsIEFtbW9Db25zdGFudCB9IGZyb20gJy4vYW1tby1jb25zdCc7XHJcbmltcG9ydCB7IFBoeXNpY3NTeXN0ZW0gfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xyXG5cclxuY29uc3QgdjNfMCA9IENDX1YzXzA7XHJcbmNvbnN0IHF1YXRfMCA9IENDX1FVQVRfMDtcclxubGV0IHNoYXJlZElEQ291bnRlciA9IDA7XHJcblxyXG4vKipcclxuICogc2hhcmVkIG9iamVjdCwgbm9kZSA6IHNoYXJlZCA9IDEgOiAxXHJcbiAqIGJvZHkgZm9yIHN0YXRpYyBcXCBkeW5hbWljIFxcIGtpbmVtYXRpYyAoY29sbGlkZXIpXHJcbiAqIGdob3N0IGZvciB0cmlnZ2VyXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQW1tb1NoYXJlZEJvZHkge1xyXG5cclxuICAgIHByaXZhdGUgc3RhdGljIGlkQ291bnRlciA9IDA7XHJcbiAgICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBzaGFyZWRCb2Rlc01hcCA9IG5ldyBNYXA8c3RyaW5nLCBBbW1vU2hhcmVkQm9keT4oKTtcclxuXHJcbiAgICBzdGF0aWMgZ2V0U2hhcmVkQm9keSAobm9kZTogTm9kZSwgd3JhcHBlZFdvcmxkOiBBbW1vV29ybGQsIHdyYXBwZWRCb2R5PzogQW1tb1JpZ2lkQm9keSkge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IG5vZGUudXVpZDtcclxuICAgICAgICBsZXQgbmV3U0IhOiBBbW1vU2hhcmVkQm9keTtcclxuICAgICAgICBpZiAoQW1tb1NoYXJlZEJvZHkuc2hhcmVkQm9kZXNNYXAuaGFzKGtleSkpIHtcclxuICAgICAgICAgICAgbmV3U0IgPSBBbW1vU2hhcmVkQm9keS5zaGFyZWRCb2Rlc01hcC5nZXQoa2V5KSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbmV3U0IgPSBuZXcgQW1tb1NoYXJlZEJvZHkobm9kZSwgd3JhcHBlZFdvcmxkKTtcclxuICAgICAgICAgICAgQW1tb1NoYXJlZEJvZHkuc2hhcmVkQm9kZXNNYXAuc2V0KG5vZGUudXVpZCwgbmV3U0IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAod3JhcHBlZEJvZHkpIHsgbmV3U0IuX3dyYXBwZWRCb2R5ID0gd3JhcHBlZEJvZHk7IH1cclxuICAgICAgICByZXR1cm4gbmV3U0I7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdyYXBwZWRCb2R5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd3JhcHBlZEJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGJvZHlDb21wb3VuZFNoYXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib2R5U3RydWN0LnNoYXBlIGFzIEFtbW8uYnRDb21wb3VuZFNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBnaG9zdENvbXBvdW5kU2hhcGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdob3N0U3RydWN0LnNoYXBlIGFzIEFtbW8uYnRDb21wb3VuZFNoYXBlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBib2R5ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ib2R5U3RydWN0LmJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdob3N0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5naG9zdFN0cnVjdC5naG9zdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29sbGlzaW9uRmlsdGVyR3JvdXAgKCkgeyByZXR1cm4gdGhpcy5fY29sbGlzaW9uRmlsdGVyR3JvdXA7IH1cclxuICAgIHNldCBjb2xsaXNpb25GaWx0ZXJHcm91cCAodjogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHYgIT0gdGhpcy5fY29sbGlzaW9uRmlsdGVyR3JvdXApIHtcclxuICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uRmlsdGVyR3JvdXAgPSB2O1xyXG4gICAgICAgICAgICB0aGlzLmRpcnR5IHw9IEVBbW1vU2hhcmVkQm9keURpcnR5LkJPRFlfUkVfQUREO1xyXG4gICAgICAgICAgICB0aGlzLmRpcnR5IHw9IEVBbW1vU2hhcmVkQm9keURpcnR5LkdIT1NUX1JFX0FERDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGNvbGxpc2lvbkZpbHRlck1hc2sgKCkgeyByZXR1cm4gdGhpcy5fY29sbGlzaW9uRmlsdGVyTWFzazsgfVxyXG4gICAgc2V0IGNvbGxpc2lvbkZpbHRlck1hc2sgKHY6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh2ICE9IHRoaXMuX2NvbGxpc2lvbkZpbHRlck1hc2spIHtcclxuICAgICAgICAgICAgdGhpcy5fY29sbGlzaW9uRmlsdGVyTWFzayA9IHY7XHJcbiAgICAgICAgICAgIHRoaXMuZGlydHkgfD0gRUFtbW9TaGFyZWRCb2R5RGlydHkuQk9EWV9SRV9BREQ7XHJcbiAgICAgICAgICAgIHRoaXMuZGlydHkgfD0gRUFtbW9TaGFyZWRCb2R5RGlydHkuR0hPU1RfUkVfQUREO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgYm9keVN0cnVjdCAoKSB7XHJcbiAgICAgICAgdGhpcy5faW5zdGFudGlhdGVCb2R5U3RydWN0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvZHlTdHJ1Y3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGdob3N0U3RydWN0ICgpIHtcclxuICAgICAgICB0aGlzLl9pbnN0YW50aWF0ZUdob3N0U3RydWN0KCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dob3N0U3RydWN0O1xyXG4gICAgfVxyXG5cclxuICAgIHJlYWRvbmx5IGlkOiBudW1iZXI7XHJcbiAgICByZWFkb25seSBub2RlOiBOb2RlO1xyXG4gICAgcmVhZG9ubHkgd3JhcHBlZFdvcmxkOiBBbW1vV29ybGQ7XHJcbiAgICBkaXJ0eTogRUFtbW9TaGFyZWRCb2R5RGlydHkgPSAwO1xyXG5cclxuICAgIHByaXZhdGUgX2NvbGxpc2lvbkZpbHRlckdyb3VwOiBudW1iZXIgPSBQaHlzaWNzU3lzdGVtLlBoeXNpY3NHcm91cC5ERUZBVUxUO1xyXG4gICAgcHJpdmF0ZSBfY29sbGlzaW9uRmlsdGVyTWFzazogbnVtYmVyID0gLTE7XHJcblxyXG4gICAgcHJpdmF0ZSByZWY6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIGJvZHlJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICBwcml2YXRlIGdob3N0SW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgcHJpdmF0ZSBfYm9keVN0cnVjdCE6IElBbW1vQm9keVN0cnVjdDtcclxuICAgIHByaXZhdGUgX2dob3N0U3RydWN0ITogSUFtbW9HaG9zdFN0cnVjdDtcclxuICAgIHByaXZhdGUgX3dyYXBwZWRCb2R5OiBBbW1vUmlnaWRCb2R5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgb3IgcmVtb3ZlIGZyb20gd29ybGQgXFxcclxuICAgICAqIGFkZCwgaWYgZW5hYmxlIFxcXHJcbiAgICAgKiByZW1vdmUsIGlmIGRpc2FibGUgJiBzaGFwZXMubGVuZ3RoID09IDAgJiB3cmFwcGVkQm9keSBkaXNhYmxlXHJcbiAgICAgKi9cclxuICAgIHNldCBib2R5RW5hYmxlZCAodjogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh2KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvZHlJbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keUluZGV4ID0gdGhpcy53cmFwcGVkV29ybGQuYm9kaWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keS5jbGVhclN0YXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZWRXb3JsZC5hZGRTaGFyZWRCb2R5KHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zeW5jSW5pdGlhbEJvZHkoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmJvZHlJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1JlbW92ZUJvZHkgPSAodGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMubGVuZ3RoID09IDAgJiYgdGhpcy53cmFwcGVkQm9keSA9PSBudWxsKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvZHlTdHJ1Y3Qud3JhcHBlZFNoYXBlcy5sZW5ndGggPT0gMCAmJiB0aGlzLndyYXBwZWRCb2R5ICE9IG51bGwgJiYgIXRoaXMud3JhcHBlZEJvZHkuaXNFbmFibGVkKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmJvZHlTdHJ1Y3Qud3JhcHBlZFNoYXBlcy5sZW5ndGggPT0gMCAmJiB0aGlzLndyYXBwZWRCb2R5ICE9IG51bGwgJiYgIXRoaXMud3JhcHBlZEJvZHkucmlnaWRCb2R5LmVuYWJsZWRJbkhpZXJhcmNoeSlcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNSZW1vdmVCb2R5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LmNsZWFyU3RhdGUoKTsgLy8gY2xlYXIgdmVsb2NpdHkgZXRjLlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYm9keUluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQucmVtb3ZlU2hhcmVkQm9keSh0aGlzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXQgZ2hvc3RFbmFibGVkICh2OiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKHYpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2hvc3RJbmRleCA8IDAgJiYgdGhpcy5naG9zdFN0cnVjdC53cmFwcGVkU2hhcGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RJbmRleCA9IDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndyYXBwZWRXb3JsZC5hZGRHaG9zdE9iamVjdCh0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3luY0luaXRpYWxHaG9zdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZ2hvc3RJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvKiogcmVtb3ZlIHRyaWdnZXIgKi9cclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzUmVtb3ZlR2hvc3QgPSAodGhpcy5naG9zdFN0cnVjdC53cmFwcGVkU2hhcGVzLmxlbmd0aCA9PSAwICYmIHRoaXMuZ2hvc3QpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChpc1JlbW92ZUdob3N0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5naG9zdEluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQucmVtb3ZlR2hvc3RPYmplY3QodGhpcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlZmVyZW5jZSAodjogYm9vbGVhbikge1xyXG4gICAgICAgIHYgPyB0aGlzLnJlZisrIDogdGhpcy5yZWYtLTtcclxuICAgICAgICBpZiAodGhpcy5yZWYgPT0gMCkgeyB0aGlzLmRlc3Ryb3koKTsgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY29uc3RydWN0b3IgKG5vZGU6IE5vZGUsIHdyYXBwZWRXb3JsZDogQW1tb1dvcmxkKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IEFtbW9TaGFyZWRCb2R5LmlkQ291bnRlcisrO1xyXG4gICAgICAgIHRoaXMud3JhcHBlZFdvcmxkID0gd3JhcHBlZFdvcmxkO1xyXG4gICAgICAgIHRoaXMubm9kZSA9IG5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5zdGFudGlhdGVCb2R5U3RydWN0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYm9keVN0cnVjdCkgcmV0dXJuO1xyXG4gICAgICAgIC8qKiBib2R5IHN0cnVjdCAqL1xyXG4gICAgICAgIGNvbnN0IHN0ID0gbmV3IEFtbW8uYnRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBzdC5zZXRJZGVudGl0eSgpO1xyXG4gICAgICAgIGNvY29zMkFtbW9WZWMzKHN0LmdldE9yaWdpbigpLCB0aGlzLm5vZGUud29ybGRQb3NpdGlvbilcclxuICAgICAgICBjb25zdCBib2R5UXVhdCA9IG5ldyBBbW1vLmJ0UXVhdGVybmlvbigpO1xyXG4gICAgICAgIGNvY29zMkFtbW9RdWF0KGJvZHlRdWF0LCB0aGlzLm5vZGUud29ybGRSb3RhdGlvbik7XHJcbiAgICAgICAgc3Quc2V0Um90YXRpb24oYm9keVF1YXQpO1xyXG4gICAgICAgIGNvbnN0IG1vdGlvblN0YXRlID0gbmV3IEFtbW8uYnREZWZhdWx0TW90aW9uU3RhdGUoc3QpO1xyXG4gICAgICAgIGNvbnN0IGxvY2FsSW5lcnRpYSA9IG5ldyBBbW1vLmJ0VmVjdG9yMygxLjY2NjY2NjYyNjkzMDIzNjgsIDEuNjY2NjY2NjI2OTMwMjM2OCwgMS42NjY2NjY2MjY5MzAyMzY4KTtcclxuICAgICAgICBjb25zdCBib2R5U2hhcGUgPSBuZXcgQW1tby5idENvbXBvdW5kU2hhcGUoKTtcclxuICAgICAgICBjb25zdCByYkluZm8gPSBuZXcgQW1tby5idFJpZ2lkQm9keUNvbnN0cnVjdGlvbkluZm8oMCwgbW90aW9uU3RhdGUsIEFtbW9Db25zdGFudC5pbnN0YW5jZS5FTVBUWV9TSEFQRSwgbG9jYWxJbmVydGlhKTtcclxuICAgICAgICBjb25zdCBib2R5ID0gbmV3IEFtbW8uYnRSaWdpZEJvZHkocmJJbmZvKTtcclxuICAgICAgICBjb25zdCBzbGVlcFRkID0gUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5zbGVlcFRocmVzaG9sZDtcclxuICAgICAgICBib2R5LnNldFNsZWVwaW5nVGhyZXNob2xkcyhzbGVlcFRkLCBzbGVlcFRkKTtcclxuICAgICAgICB0aGlzLl9ib2R5U3RydWN0ID0ge1xyXG4gICAgICAgICAgICAnaWQnOiBzaGFyZWRJRENvdW50ZXIrKyxcclxuICAgICAgICAgICAgJ2JvZHknOiBib2R5LFxyXG4gICAgICAgICAgICAnbG9jYWxJbmVydGlhJzogbG9jYWxJbmVydGlhLFxyXG4gICAgICAgICAgICAnbW90aW9uU3RhdGUnOiBtb3Rpb25TdGF0ZSxcclxuICAgICAgICAgICAgJ3N0YXJ0VHJhbnNmb3JtJzogc3QsXHJcbiAgICAgICAgICAgICdzaGFwZSc6IGJvZHlTaGFwZSxcclxuICAgICAgICAgICAgJ3JiSW5mbyc6IHJiSW5mbyxcclxuICAgICAgICAgICAgJ3dvcmxkUXVhdCc6IGJvZHlRdWF0LFxyXG4gICAgICAgICAgICAnd3JhcHBlZFNoYXBlcyc6IFtdLFxyXG4gICAgICAgICAgICAndXNlQ29tcG91bmQnOiBmYWxzZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgQW1tb0luc3RhbmNlLmJvZHlTdHJ1Y3RzWydLRVknICsgdGhpcy5fYm9keVN0cnVjdC5pZF0gPSB0aGlzLl9ib2R5U3RydWN0O1xyXG4gICAgICAgIHRoaXMuYm9keS5zZXRVc2VySW5kZXgodGhpcy5fYm9keVN0cnVjdC5pZCk7XHJcbiAgICAgICAgdGhpcy5ib2R5LnNldEFjdGl2YXRpb25TdGF0ZShBbW1vQ29sbGlzaW9uT2JqZWN0U3RhdGVzLkRJU0FCTEVfREVBQ1RJVkFUSU9OKTtcclxuICAgICAgICBpZiAoQW1tb1snQ0NfQ09ORklHJ11bJ2lnbm9yZVNlbGZCb2R5J10gJiYgdGhpcy5fZ2hvc3RTdHJ1Y3QpIHRoaXMuZ2hvc3Quc2V0SWdub3JlQ29sbGlzaW9uQ2hlY2sodGhpcy5ib2R5LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbnN0YW50aWF0ZUdob3N0U3RydWN0ICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZ2hvc3RTdHJ1Y3QpIHJldHVybjtcclxuICAgICAgICAvKiogZ2hvc3Qgc3RydWN0ICovXHJcbiAgICAgICAgY29uc3QgZ2hvc3QgPSBuZXcgQW1tby5idENvbGxpc2lvbk9iamVjdCgpO1xyXG4gICAgICAgIGNvbnN0IGdob3N0U2hhcGUgPSBuZXcgQW1tby5idENvbXBvdW5kU2hhcGUoKTtcclxuICAgICAgICBnaG9zdC5zZXRDb2xsaXNpb25TaGFwZShnaG9zdFNoYXBlKTtcclxuICAgICAgICBnaG9zdC5zZXRDb2xsaXNpb25GbGFncyhBbW1vQ29sbGlzaW9uRmxhZ3MuQ0ZfTk9fQ09OVEFDVF9SRVNQT05TRSk7XHJcbiAgICAgICAgdGhpcy5fZ2hvc3RTdHJ1Y3QgPSB7XHJcbiAgICAgICAgICAgICdpZCc6IHNoYXJlZElEQ291bnRlcisrLFxyXG4gICAgICAgICAgICAnZ2hvc3QnOiBnaG9zdCxcclxuICAgICAgICAgICAgJ3NoYXBlJzogZ2hvc3RTaGFwZSxcclxuICAgICAgICAgICAgJ3dvcmxkUXVhdCc6IG5ldyBBbW1vLmJ0UXVhdGVybmlvbigpLFxyXG4gICAgICAgICAgICAnd3JhcHBlZFNoYXBlcyc6IFtdXHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFtbW9JbnN0YW5jZS5naG9zdFN0cnVjdHNbJ0tFWScgKyB0aGlzLl9naG9zdFN0cnVjdC5pZF0gPSB0aGlzLl9naG9zdFN0cnVjdDtcclxuICAgICAgICB0aGlzLmdob3N0LnNldFVzZXJJbmRleCh0aGlzLl9naG9zdFN0cnVjdC5pZCk7XHJcbiAgICAgICAgdGhpcy5naG9zdC5zZXRBY3RpdmF0aW9uU3RhdGUoQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcy5ESVNBQkxFX0RFQUNUSVZBVElPTik7XHJcbiAgICAgICAgaWYgKEFtbW9bJ0NDX0NPTkZJRyddWydpZ25vcmVTZWxmQm9keSddICYmIHRoaXMuX2JvZHlTdHJ1Y3QpIHRoaXMuZ2hvc3Quc2V0SWdub3JlQ29sbGlzaW9uQ2hlY2sodGhpcy5ib2R5LCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRTaGFwZSAodjogQW1tb1NoYXBlLCBpc1RyaWdnZXI6IGJvb2xlYW4pIHtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3dpdGNoU2hhcGUgKHRoYXQ6IEFtbW9TaGFyZWRCb2R5LCBzaGFwZTogQW1tby5idENvbGxpc2lvblNoYXBlKSB7XHJcbiAgICAgICAgICAgIHRoYXQuYm9keS5zZXRDb2xsaXNpb25TaGFwZShzaGFwZSk7XHJcbiAgICAgICAgICAgIHRoYXQuZGlydHkgfD0gRUFtbW9TaGFyZWRCb2R5RGlydHkuQk9EWV9SRV9BREQ7XHJcbiAgICAgICAgICAgIGlmICh0aGF0Ll93cmFwcGVkQm9keSAmJiB0aGF0Ll93cmFwcGVkQm9keS5pc0VuYWJsZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoYXQuX3dyYXBwZWRCb2R5LnNldE1hc3ModGhhdC5fd3JhcHBlZEJvZHkucmlnaWRCb2R5Lm1hc3MpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChpc1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdob3N0U3RydWN0LndyYXBwZWRTaGFwZXMuaW5kZXhPZih2KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5naG9zdFN0cnVjdC53cmFwcGVkU2hhcGVzLnB1c2godik7XHJcbiAgICAgICAgICAgICAgICB2LnNldENvbXBvdW5kKHRoaXMuZ2hvc3RDb21wb3VuZFNoYXBlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbmFibGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMuaW5kZXhPZih2KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMucHVzaCh2KTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvZHlTdHJ1Y3QudXNlQ29tcG91bmQpIHtcclxuICAgICAgICAgICAgICAgICAgICB2LnNldENvbXBvdW5kKHRoaXMuYm9keUNvbXBvdW5kU2hhcGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsID0gdGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChsID09IDEgJiYgIXYubmVlZENvbXBvdW5kKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoU2hhcGUodGhpcywgdi5pbXBsKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTdHJ1Y3QudXNlQ29tcG91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY2hpbGRTaGFwZSA9IHRoaXMuYm9keVN0cnVjdC53cmFwcGVkU2hhcGVzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRTaGFwZS5zZXRDb21wb3VuZCh0aGlzLmJvZHlDb21wb3VuZFNoYXBlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzd2l0Y2hTaGFwZSh0aGlzLCB0aGlzLmJvZHlTdHJ1Y3Quc2hhcGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keUVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZVNoYXBlICh2OiBBbW1vU2hhcGUsIGlzVHJpZ2dlcjogYm9vbGVhbikge1xyXG4gICAgICAgIGlmIChpc1RyaWdnZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmdob3N0U3RydWN0LndyYXBwZWRTaGFwZXMuaW5kZXhPZih2KTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RTdHJ1Y3Qud3JhcHBlZFNoYXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgdi5zZXRDb21wb3VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2hvc3RFbmFibGVkID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuYm9keVN0cnVjdC53cmFwcGVkU2hhcGVzLmluZGV4T2Yodik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5ib2R5U3RydWN0LnVzZUNvbXBvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdi5zZXRDb21wb3VuZChudWxsKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib2R5LnNldENvbGxpc2lvblNoYXBlKEFtbW9Db25zdGFudC5pbnN0YW5jZS5FTVBUWV9TSEFQRSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvZHkuYWN0aXZhdGUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpcnR5IHw9IEVBbW1vU2hhcmVkQm9keURpcnR5LkJPRFlfUkVfQUREO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9keUVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVEaXJ0eSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlydHkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYm9keUluZGV4ID49IDAgJiYgdGhpcy5kaXJ0eSAmIEVBbW1vU2hhcmVkQm9keURpcnR5LkJPRFlfUkVfQUREKSB0aGlzLnVwZGF0ZUJvZHlCeVJlQWRkKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmdob3N0SW5kZXggPj0gMCAmJiB0aGlzLmRpcnR5ICYgRUFtbW9TaGFyZWRCb2R5RGlydHkuR0hPU1RfUkVfQUREKSB0aGlzLnVwZGF0ZUdob3N0QnlSZUFkZCgpO1xyXG4gICAgICAgICAgICB0aGlzLmRpcnR5ID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3luY1NjZW5lVG9QaHlzaWNzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5ub2RlLmhhc0NoYW5nZWRGbGFncykge1xyXG4gICAgICAgICAgICBjb25zdCB3dCA9IHRoaXMuYm9keS5nZXRXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyh3dC5nZXRPcmlnaW4oKSwgdGhpcy5ub2RlLndvcmxkUG9zaXRpb24pXHJcbiAgICAgICAgICAgIGNvY29zMkFtbW9RdWF0KHRoaXMuYm9keVN0cnVjdC53b3JsZFF1YXQsIHRoaXMubm9kZS53b3JsZFJvdGF0aW9uKTtcclxuICAgICAgICAgICAgd3Quc2V0Um90YXRpb24odGhpcy5ib2R5U3RydWN0LndvcmxkUXVhdCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQm9keVNsZWVwaW5nKCkpIHRoaXMuYm9keS5hY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubm9kZS5oYXNDaGFuZ2VkRmxhZ3MgJiBUcmFuc2Zvcm1CaXQuU0NBTEUpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvZHlTdHJ1Y3Qud3JhcHBlZFNoYXBlc1tpXS5zZXRTY2FsZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVE9ETzogdXNlIG1vdGlvbiBzdGF0ZVxyXG4gICAgICovXHJcbiAgICBzeW5jUGh5c2ljc1RvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmJvZHkuaXNTdGF0aWNPYmplY3QoKSB8fCB0aGlzLmlzQm9keVNsZWVwaW5nKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gbGV0IHRyYW5zZm9ybSA9IG5ldyBBbW1vLmJ0VHJhbnNmb3JtKCk7XHJcbiAgICAgICAgLy8gdGhpcy5ib2R5LmdldE1vdGlvblN0YXRlKCkuZ2V0V29ybGRUcmFuc2Zvcm0odHJhbnNmb3JtKTtcclxuICAgICAgICBjb25zdCB3dDAgPSB0aGlzLmJvZHkuZ2V0V29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICB0aGlzLm5vZGUud29ybGRQb3NpdGlvbiA9IGFtbW8yQ29jb3NWZWMzKHYzXzAsIHd0MC5nZXRPcmlnaW4oKSk7XHJcbiAgICAgICAgd3QwLmdldEJhc2lzKCkuZ2V0Um90YXRpb24odGhpcy5ib2R5U3RydWN0LndvcmxkUXVhdCk7XHJcbiAgICAgICAgdGhpcy5ub2RlLndvcmxkUm90YXRpb24gPSBhbW1vMkNvY29zUXVhdChxdWF0XzAsIHRoaXMuYm9keVN0cnVjdC53b3JsZFF1YXQpO1xyXG5cclxuICAgICAgICBjb25zdCB3dDEgPSB0aGlzLmdob3N0LmdldFdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzMod3QxLmdldE9yaWdpbigpLCB0aGlzLm5vZGUud29ybGRQb3NpdGlvbilcclxuICAgICAgICBjb2NvczJBbW1vUXVhdCh0aGlzLmdob3N0U3RydWN0LndvcmxkUXVhdCwgdGhpcy5ub2RlLndvcmxkUm90YXRpb24pO1xyXG4gICAgICAgIHd0MS5zZXRSb3RhdGlvbih0aGlzLmdob3N0U3RydWN0LndvcmxkUXVhdCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3luY1NjZW5lVG9HaG9zdCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubm9kZS5oYXNDaGFuZ2VkRmxhZ3MpIHtcclxuICAgICAgICAgICAgY29uc3Qgd3QxID0gdGhpcy5naG9zdC5nZXRXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBjb2NvczJBbW1vVmVjMyh3dDEuZ2V0T3JpZ2luKCksIHRoaXMubm9kZS53b3JsZFBvc2l0aW9uKVxyXG4gICAgICAgICAgICBjb2NvczJBbW1vUXVhdCh0aGlzLmdob3N0U3RydWN0LndvcmxkUXVhdCwgdGhpcy5ub2RlLndvcmxkUm90YXRpb24pO1xyXG4gICAgICAgICAgICB3dDEuc2V0Um90YXRpb24odGhpcy5naG9zdFN0cnVjdC53b3JsZFF1YXQpO1xyXG4gICAgICAgICAgICB0aGlzLmdob3N0LmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5ub2RlLmhhc0NoYW5nZWRGbGFncyAmIFRyYW5zZm9ybUJpdC5TQ0FMRSkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdob3N0U3RydWN0LndyYXBwZWRTaGFwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmdob3N0U3RydWN0LndyYXBwZWRTaGFwZXNbaV0uc2V0U2NhbGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzeW5jSW5pdGlhbEJvZHkgKCkge1xyXG4gICAgICAgIGNvbnN0IHd0ID0gdGhpcy5ib2R5LmdldFdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzMod3QuZ2V0T3JpZ2luKCksIHRoaXMubm9kZS53b3JsZFBvc2l0aW9uKVxyXG4gICAgICAgIGNvY29zMkFtbW9RdWF0KHRoaXMuYm9keVN0cnVjdC53b3JsZFF1YXQsIHRoaXMubm9kZS53b3JsZFJvdGF0aW9uKTtcclxuICAgICAgICB3dC5zZXRSb3RhdGlvbih0aGlzLmJvZHlTdHJ1Y3Qud29ybGRRdWF0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9keVN0cnVjdC53cmFwcGVkU2hhcGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keVN0cnVjdC53cmFwcGVkU2hhcGVzW2ldLnNldFNjYWxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYm9keS5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHN5bmNJbml0aWFsR2hvc3QgKCkge1xyXG4gICAgICAgIGNvbnN0IHd0MSA9IHRoaXMuZ2hvc3QuZ2V0V29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBjb2NvczJBbW1vVmVjMyh3dDEuZ2V0T3JpZ2luKCksIHRoaXMubm9kZS53b3JsZFBvc2l0aW9uKVxyXG4gICAgICAgIGNvY29zMkFtbW9RdWF0KHRoaXMuZ2hvc3RTdHJ1Y3Qud29ybGRRdWF0LCB0aGlzLm5vZGUud29ybGRSb3RhdGlvbik7XHJcbiAgICAgICAgd3QxLnNldFJvdGF0aW9uKHRoaXMuZ2hvc3RTdHJ1Y3Qud29ybGRRdWF0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZ2hvc3RTdHJ1Y3Qud3JhcHBlZFNoYXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmdob3N0U3RydWN0LndyYXBwZWRTaGFwZXNbaV0uc2V0U2NhbGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5naG9zdC5hY3RpdmF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2VlOiBodHRwczovL3B5YnVsbGV0Lm9yZy9CdWxsZXQvcGhwQkIzL3ZpZXd0b3BpYy5waHA/Zj05JnQ9NTMxMiZwPTE5MDk0JmhpbGl0PWhvdyt0bytjaGFuZ2UrZ3JvdXArbWFzayNwMTkwOTdcclxuICAgICAqL1xyXG4gICAgdXBkYXRlQm9keUJ5UmVBZGQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmJvZHlJbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMud3JhcHBlZFdvcmxkLnJlbW92ZVNoYXJlZEJvZHkodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9keUluZGV4ID0gdGhpcy53cmFwcGVkV29ybGQuYm9kaWVzLmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQuYWRkU2hhcmVkQm9keSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlR2hvc3RCeVJlQWRkICgpIHtcclxuICAgICAgICBpZiAodGhpcy5naG9zdEluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy53cmFwcGVkV29ybGQucmVtb3ZlR2hvc3RPYmplY3QodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RJbmRleCA9IHRoaXMud3JhcHBlZFdvcmxkLmdob3N0cy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMud3JhcHBlZFdvcmxkLmFkZEdob3N0T2JqZWN0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIEFtbW9TaGFyZWRCb2R5LnNoYXJlZEJvZGVzTWFwLmRlbGV0ZSh0aGlzLm5vZGUudXVpZCk7XHJcbiAgICAgICAgKHRoaXMubm9kZSBhcyBhbnkpID0gbnVsbDtcclxuICAgICAgICAodGhpcy53cmFwcGVkV29ybGQgYXMgYW55KSA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlTdHJ1Y3QpIHtcclxuICAgICAgICAgICAgY29uc3QgYm9keVN0cnVjdCA9IHRoaXMuX2JvZHlTdHJ1Y3Q7XHJcbiAgICAgICAgICAgIEFtbW8uZGVzdHJveShib2R5U3RydWN0LmxvY2FsSW5lcnRpYSk7XHJcbiAgICAgICAgICAgIEFtbW8uZGVzdHJveShib2R5U3RydWN0LndvcmxkUXVhdCk7XHJcbiAgICAgICAgICAgIEFtbW8uZGVzdHJveShib2R5U3RydWN0LnN0YXJ0VHJhbnNmb3JtKTtcclxuICAgICAgICAgICAgQW1tby5kZXN0cm95KGJvZHlTdHJ1Y3QubW90aW9uU3RhdGUpO1xyXG4gICAgICAgICAgICBBbW1vLmRlc3Ryb3koYm9keVN0cnVjdC5yYkluZm8pO1xyXG4gICAgICAgICAgICBBbW1vLmRlc3Ryb3koYm9keVN0cnVjdC5zaGFwZSk7XHJcbiAgICAgICAgICAgIGFtbW9EZWxldGVQdHIoYm9keVN0cnVjdC5zaGFwZSwgQW1tby5idENvbGxpc2lvblNoYXBlKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keSA9IEFtbW8uY2FzdE9iamVjdChib2R5U3RydWN0LmJvZHksIEFtbW8uYnRSaWdpZEJvZHkpO1xyXG4gICAgICAgICAgICBib2R5Wyd3cmFwcGVkJ10gPSBudWxsO1xyXG4gICAgICAgICAgICAvLyBBbW1vLmRlc3Ryb3koYm9keVN0cnVjdC5ib2R5KTtcclxuICAgICAgICAgICAgYW1tb0RlbGV0ZVB0cihib2R5U3RydWN0LmJvZHksIEFtbW8uYnRSaWdpZEJvZHkpO1xyXG4gICAgICAgICAgICBhbW1vRGVsZXRlUHRyKGJvZHlTdHJ1Y3QuYm9keSwgQW1tby5idENvbGxpc2lvbk9iamVjdCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGtleTAgPSAnS0VZJyArIGJvZHlTdHJ1Y3QuaWQ7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBBbW1vSW5zdGFuY2UuYm9keVN0cnVjdHNba2V5MF07XHJcbiAgICAgICAgICAgICh0aGlzLl9ib2R5U3RydWN0IGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2dob3N0U3RydWN0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGdob3N0U3RydWN0ID0gdGhpcy5fZ2hvc3RTdHJ1Y3Q7XHJcbiAgICAgICAgICAgIEFtbW8uZGVzdHJveShnaG9zdFN0cnVjdC53b3JsZFF1YXQpO1xyXG4gICAgICAgICAgICBBbW1vLmRlc3Ryb3koZ2hvc3RTdHJ1Y3Quc2hhcGUpO1xyXG4gICAgICAgICAgICBhbW1vRGVsZXRlUHRyKGdob3N0U3RydWN0LnNoYXBlLCBBbW1vLmJ0Q29sbGlzaW9uU2hhcGUpO1xyXG4gICAgICAgICAgICBBbW1vLmRlc3Ryb3koZ2hvc3RTdHJ1Y3QuZ2hvc3QpO1xyXG4gICAgICAgICAgICBjb25zdCBrZXkxID0gJ0tFWScgKyBnaG9zdFN0cnVjdC5pZDtcclxuICAgICAgICAgICAgZGVsZXRlIEFtbW9JbnN0YW5jZS5ib2R5U3RydWN0c1trZXkxXTtcclxuICAgICAgICAgICAgKHRoaXMuX2dob3N0U3RydWN0IGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGlzQm9keVNsZWVwaW5nICgpIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuYm9keS5nZXRBY3RpdmF0aW9uU3RhdGUoKTtcclxuICAgICAgICByZXR1cm4gc3RhdGUgPT0gQW1tb0NvbGxpc2lvbk9iamVjdFN0YXRlcy5JU0xBTkRfU0xFRVBJTkc7XHJcbiAgICB9XHJcbn1cclxuIl19