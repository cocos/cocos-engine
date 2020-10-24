(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./ammo-instantiated.js", "../../core/math/index.js", "./ammo-shared-body.js", "../utils/array-collision-matrix.js", "../utils/tuple-dictionary.js", "./ammo-const.js", "./ammo-util.js", "./ammo-instance.js", "./ammo-enum.js", "./ammo-contact-equation.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./ammo-instantiated.js"), require("../../core/math/index.js"), require("./ammo-shared-body.js"), require("../utils/array-collision-matrix.js"), require("../utils/tuple-dictionary.js"), require("./ammo-const.js"), require("./ammo-util.js"), require("./ammo-instance.js"), require("./ammo-enum.js"), require("./ammo-contact-equation.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.ammoInstantiated, global.index, global.ammoSharedBody, global.arrayCollisionMatrix, global.tupleDictionary, global.ammoConst, global.ammoUtil, global.ammoInstance, global.ammoEnum, global.ammoContactEquation);
    global.ammoWorld = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _ammoInstantiated, _index, _ammoSharedBody, _arrayCollisionMatrix, _tupleDictionary, _ammoConst, _ammoUtil, _ammoInstance, _ammoEnum, _ammoContactEquation) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.AmmoWorld = void 0;
  _ammoInstantiated = _interopRequireDefault(_ammoInstantiated);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var contactsPool = [];
  var v3_0 = _ammoConst.CC_V3_0;
  var v3_1 = _ammoConst.CC_V3_1;

  var AmmoWorld = /*#__PURE__*/function () {
    _createClass(AmmoWorld, [{
      key: "setAllowSleep",
      value: function setAllowSleep(v) {}
    }, {
      key: "setDefaultMaterial",
      value: function setDefaultMaterial(v) {}
    }, {
      key: "setGravity",
      value: function setGravity(gravity) {
        (0, _ammoUtil.cocos2AmmoVec3)(this._btGravity, gravity);

        this._btWorld.setGravity(this._btGravity);
      }
    }, {
      key: "impl",
      get: function get() {
        return this._btWorld;
      }
    }]);

    function AmmoWorld(options) {
      _classCallCheck(this, AmmoWorld);

      this._btWorld = void 0;
      this._btBroadphase = void 0;
      this._btSolver = void 0;
      this._btDispatcher = void 0;
      this._btGravity = void 0;
      this.bodies = [];
      this.ghosts = [];
      this.constraints = [];
      this.triggerArrayMat = new _arrayCollisionMatrix.ArrayCollisionMatrix();
      this.collisionArrayMat = new _arrayCollisionMatrix.ArrayCollisionMatrix();
      this.contactsDic = new _tupleDictionary.TupleDictionary();
      this.oldContactsDic = new _tupleDictionary.TupleDictionary();
      this.closeHitCB = new _ammoInstantiated.default.ClosestRayResultCallback(new _ammoInstantiated.default.btVector3(), new _ammoInstantiated.default.btVector3());
      this.allHitsCB = new _ammoInstantiated.default.AllHitsRayResultCallback(new _ammoInstantiated.default.btVector3(), new _ammoInstantiated.default.btVector3());
      var collisionConfiguration = new _ammoInstantiated.default.btDefaultCollisionConfiguration();
      this._btDispatcher = new _ammoInstantiated.default.btCollisionDispatcher(collisionConfiguration);

      this._btDispatcher.setDispatcherFlags(_ammoEnum.AmmoDispatcherFlags.CD_STATIC_STATIC_REPORTED);

      this._btBroadphase = new _ammoInstantiated.default.btDbvtBroadphase();
      this._btSolver = new _ammoInstantiated.default.btSequentialImpulseConstraintSolver();
      this._btWorld = new _ammoInstantiated.default.btDiscreteDynamicsWorld(this._btDispatcher, this._btBroadphase, this._btSolver, collisionConfiguration);
      this._btGravity = new _ammoInstantiated.default.btVector3(0, -10, 0);

      this._btWorld.setGravity(this._btGravity);
    }

    _createClass(AmmoWorld, [{
      key: "step",
      value: function step(deltaTime, timeSinceLastCalled) {
        var maxSubStep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        if (this.bodies.length == 0 && this.ghosts.length == 0) return;
        if (timeSinceLastCalled == undefined) timeSinceLastCalled = deltaTime;

        this._btWorld.stepSimulation(timeSinceLastCalled, maxSubStep, deltaTime);

        for (var i = 0; i < this.bodies.length; i++) {
          this.bodies[i].syncPhysicsToScene();
        }
      }
    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        for (var i = 0; i < this.ghosts.length; i++) {
          this.ghosts[i].updateDirty();
          this.ghosts[i].syncSceneToGhost();
        }

        for (var _i = 0; _i < this.bodies.length; _i++) {
          this.bodies[_i].updateDirty();

          this.bodies[_i].syncSceneToPhysics();
        }
      }
    }, {
      key: "raycast",
      value: function raycast(worldRay, options, pool, results) {
        var from = (0, _ammoUtil.cocos2AmmoVec3)(this.allHitsCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        var to = (0, _ammoUtil.cocos2AmmoVec3)(this.allHitsCB.m_rayToWorld, v3_0);
        this.allHitsCB.m_collisionFilterGroup = -1;
        this.allHitsCB.m_collisionFilterMask = options.mask;
        this.allHitsCB.m_closestHitFraction = 1;
        this.allHitsCB.m_shapePart = -1;
        this.allHitsCB.m_collisionObject = null;
        this.allHitsCB.m_shapeParts.clear();
        this.allHitsCB.m_hitFractions.clear();
        this.allHitsCB.m_collisionObjects.clear(); // TODO: typing

        var hp = this.allHitsCB.m_hitPointWorld;
        var hn = this.allHitsCB.m_hitNormalWorld;
        hp.clear();
        hn.clear();

        this._btWorld.rayTest(from, to, this.allHitsCB);

        if (this.allHitsCB.hasHit()) {
          for (var i = 0, n = this.allHitsCB.m_collisionObjects.size(); i < n; i++) {
            var btObj = this.allHitsCB.m_collisionObjects.at(i);
            var btCs = btObj.getCollisionShape();
            var shape = void 0;

            if (btCs.isCompound()) {
              var shapeIndex = this.allHitsCB.m_shapeParts.at(i);
              var index = btObj.getUserIndex();
              var shared = _ammoInstance.AmmoInstance.bodyAndGhosts['KEY' + index];
              shape = shared.wrappedShapes[shapeIndex];
            } else {
              shape = btCs['wrapped'];
            }

            (0, _ammoUtil.ammo2CocosVec3)(v3_0, hp.at(i));
            (0, _ammoUtil.ammo2CocosVec3)(v3_1, hn.at(i));

            var distance = _index.Vec3.distance(worldRay.o, v3_0);

            var r = pool.add();

            r._assign(v3_0, distance, shape.collider, v3_1);

            results.push(r);
          }

          return true;
        }

        return false;
      }
      /**
       * Ray cast, and return information of the closest hit.
       * @return True if any body was hit.
       */

    }, {
      key: "raycastClosest",
      value: function raycastClosest(worldRay, options, result) {
        var from = (0, _ammoUtil.cocos2AmmoVec3)(this.closeHitCB.m_rayFromWorld, worldRay.o);
        worldRay.computeHit(v3_0, options.maxDistance);
        var to = (0, _ammoUtil.cocos2AmmoVec3)(this.closeHitCB.m_rayToWorld, v3_0);
        this.closeHitCB.m_collisionFilterGroup = -1;
        this.closeHitCB.m_collisionFilterMask = options.mask;
        this.closeHitCB.m_closestHitFraction = 1;
        this.closeHitCB.m_collisionObject = null;

        this._btWorld.rayTest(from, to, this.closeHitCB);

        if (this.closeHitCB.hasHit()) {
          var btObj = this.closeHitCB.m_collisionObject;
          var btCs = btObj.getCollisionShape();
          var shape;

          if (btCs.isCompound()) {
            var index = btObj.getUserIndex();
            var shared = _ammoInstance.AmmoInstance.bodyAndGhosts['KEY' + index];
            var shapeIndex = this.closeHitCB.m_shapePart;
            shape = shared.wrappedShapes[shapeIndex];
          } else {
            shape = btCs['wrapped'];
          }

          (0, _ammoUtil.ammo2CocosVec3)(v3_0, this.closeHitCB.m_hitPointWorld);
          (0, _ammoUtil.ammo2CocosVec3)(v3_1, this.closeHitCB.m_hitNormalWorld);

          var distance = _index.Vec3.distance(worldRay.o, v3_0);

          result._assign(v3_0, distance, shape.collider, v3_1);

          return true;
        }

        return false;
      }
    }, {
      key: "getSharedBody",
      value: function getSharedBody(node, wrappedBody) {
        return _ammoSharedBody.AmmoSharedBody.getSharedBody(node, this, wrappedBody);
      }
    }, {
      key: "addSharedBody",
      value: function addSharedBody(sharedBody) {
        var i = this.bodies.indexOf(sharedBody);

        if (i < 0) {
          this.bodies.push(sharedBody);

          this._btWorld.addRigidBody(sharedBody.body, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
      }
    }, {
      key: "removeSharedBody",
      value: function removeSharedBody(sharedBody) {
        var i = this.bodies.indexOf(sharedBody);

        if (i >= 0) {
          this.bodies.splice(i, 1);

          this._btWorld.removeRigidBody(sharedBody.body);
        }
      }
    }, {
      key: "addGhostObject",
      value: function addGhostObject(sharedBody) {
        var i = this.ghosts.indexOf(sharedBody);

        if (i < 0) {
          this.ghosts.push(sharedBody);

          this._btWorld.addCollisionObject(sharedBody.ghost, sharedBody.collisionFilterGroup, sharedBody.collisionFilterMask);
        }
      }
    }, {
      key: "removeGhostObject",
      value: function removeGhostObject(sharedBody) {
        var i = this.ghosts.indexOf(sharedBody);

        if (i >= 0) {
          this.ghosts.splice(i, 1);

          this._btWorld.removeCollisionObject(sharedBody.ghost);
        }
      }
    }, {
      key: "addConstraint",
      value: function addConstraint(constraint) {
        var i = this.constraints.indexOf(constraint);

        if (i < 0) {
          this.constraints.push(constraint);

          this._btWorld.addConstraint(constraint.impl, !constraint.constraint.enableCollision);

          constraint.index = i;
        }
      }
    }, {
      key: "removeConstraint",
      value: function removeConstraint(constraint) {
        var i = this.constraints.indexOf(constraint);

        if (i >= 0) {
          this.constraints.splice(i, 1);

          this._btWorld.removeConstraint(constraint.impl);

          constraint.index = -1;
        }
      }
    }, {
      key: "updateCollisionMatrix",
      value: function updateCollisionMatrix(group, mask) {
        for (var i = 0; i < this.ghosts.length; i++) {
          var g = this.ghosts[i];

          if (g.collisionFilterGroup == group) {
            g.collisionFilterMask = mask;
          }
        }

        for (var _i2 = 0; _i2 < this.bodies.length; _i2++) {
          var b = this.bodies[_i2];

          if (b.collisionFilterGroup == group) {
            b.collisionFilterMask = mask;
          }
        }
      }
    }, {
      key: "emitEvents",
      value: function emitEvents() {
        var numManifolds = this._btDispatcher.getNumManifolds();

        for (var i = 0; i < numManifolds; i++) {
          var manifold = this._btDispatcher.getManifoldByIndexInternal(i);

          var body0 = manifold.getBody0();
          var body1 = manifold.getBody1();
          if (!_ammoInstantiated.default['CC_CONFIG']['emitStaticCollision'] && body0.isStaticObject() && body1.isStaticObject()) continue; //TODO: SUPPORT CHARACTER EVENT

          if (body0['useCharacter'] || body1['useCharacter']) continue;
          var isUseCCD = body0['useCCD'] || body1['useCCD'];
          var numContacts = manifold.getNumContacts();

          for (var j = 0; j < numContacts; j++) {
            var manifoldPoint = manifold.getContactPoint(j);
            var d = manifoldPoint.getDistance();

            if (d <= 0) {
              var s0 = manifoldPoint.getShape0();
              var s1 = manifoldPoint.getShape1();
              var shape0 = void 0;
              var shape1 = void 0;

              if (isUseCCD) {
                if (body0['useCCD']) {
                  var asb = body0['wrapped'].sharedBody;
                  if (!asb) continue;
                  shape0 = asb.bodyStruct.wrappedShapes[0];
                } else {
                  var btShape0 = body0.getCollisionShape();

                  if (btShape0.isCompound()) {
                    // TODO: SUPPORT COMPOUND COLLISION WITH CCD
                    continue;
                  } else {
                    shape0 = btShape0.wrapped;
                  }
                }

                if (body1['useCCD']) {
                  var _asb = body1['wrapped'].sharedBody;
                  if (!_asb) continue;
                  shape1 = _asb.bodyStruct.wrappedShapes[0];
                } else {
                  var btShape1 = body1.getCollisionShape();

                  if (btShape1.isCompound()) {
                    // TODO: SUPPORT COMPOUND COLLISION WITH CCD
                    continue;
                  } else {
                    shape1 = btShape1.wrapped;
                  }
                }
              } else {
                if (s0.isCompound()) {
                  var com = _ammoInstantiated.default.castObject(s0, _ammoInstantiated.default.btCompoundShape);

                  shape0 = com.getChildShape(manifoldPoint.m_index0).wrapped;
                } else {
                  shape0 = s0.wrapped;
                }

                if (s1.isCompound()) {
                  var _com = _ammoInstantiated.default.castObject(s1, _ammoInstantiated.default.btCompoundShape);

                  shape1 = _com.getChildShape(manifoldPoint.m_index1).wrapped;
                } else {
                  shape1 = s1.wrapped;
                }
              }

              if (shape0.collider.needTriggerEvent || shape1.collider.needTriggerEvent || shape0.collider.needCollisionEvent || shape1.collider.needCollisionEvent) {
                // current contact
                var item = this.contactsDic.get(shape0.id, shape1.id);

                if (item == null) {
                  item = this.contactsDic.set(shape0.id, shape1.id, {
                    shape0: shape0,
                    shape1: shape1,
                    contacts: [],
                    impl: manifold
                  });
                }

                item.contacts.push(manifoldPoint);
              }
            }
          }
        } // is enter or stay


        var dicL = this.contactsDic.getLength();

        while (dicL--) {
          contactsPool.push.apply(contactsPool, _ammoConst.CollisionEventObject.contacts);
          _ammoConst.CollisionEventObject.contacts.length = 0;
          var key = this.contactsDic.getKeyByIndex(dicL);
          var data = this.contactsDic.getDataByKey(key);
          var _shape = data.shape0;
          var _shape2 = data.shape1;
          this.oldContactsDic.set(_shape.id, _shape2.id, data);
          var collider0 = _shape.collider;
          var collider1 = _shape2.collider;

          if (collider0 && collider1) {
            var isTrigger = collider0.isTrigger || collider1.isTrigger;

            if (isTrigger) {
              if (this.triggerArrayMat.get(_shape.id, _shape2.id)) {
                _ammoConst.TriggerEventObject.type = 'onTriggerStay';
              } else {
                _ammoConst.TriggerEventObject.type = 'onTriggerEnter';
                this.triggerArrayMat.set(_shape.id, _shape2.id, true);
              }

              _ammoConst.TriggerEventObject.impl = data.impl;
              _ammoConst.TriggerEventObject.selfCollider = collider0;
              _ammoConst.TriggerEventObject.otherCollider = collider1;
              collider0.emit(_ammoConst.TriggerEventObject.type, _ammoConst.TriggerEventObject);
              _ammoConst.TriggerEventObject.selfCollider = collider1;
              _ammoConst.TriggerEventObject.otherCollider = collider0;
              collider1.emit(_ammoConst.TriggerEventObject.type, _ammoConst.TriggerEventObject);
            } else {
              var _body = collider0.attachedRigidBody;
              var _body2 = collider1.attachedRigidBody;

              if (_body && _body2) {
                if (_body.isSleeping && _body2.isSleeping) continue;
              } else if (_body == null && _body2) {
                if (_body2.isSleeping) continue;
              } else if (_body2 == null && _body) {
                if (_body.isSleeping) continue;
              }

              if (this.collisionArrayMat.get(_shape.id, _shape2.id)) {
                _ammoConst.CollisionEventObject.type = 'onCollisionStay';
              } else {
                _ammoConst.CollisionEventObject.type = 'onCollisionEnter';
                this.collisionArrayMat.set(_shape.id, _shape2.id, true);
              }

              for (var _i3 = 0; _i3 < data.contacts.length; _i3++) {
                var cq = data.contacts[_i3];

                if (contactsPool.length > 0) {
                  var c = contactsPool.pop();
                  c.impl = cq;

                  _ammoConst.CollisionEventObject.contacts.push(c);
                } else {
                  var _c = new _ammoContactEquation.AmmoContactEquation(_ammoConst.CollisionEventObject);

                  _c.impl = cq;

                  _ammoConst.CollisionEventObject.contacts.push(_c);
                }
              }

              _ammoConst.CollisionEventObject.impl = data.impl;
              _ammoConst.CollisionEventObject.selfCollider = collider0;
              _ammoConst.CollisionEventObject.otherCollider = collider1;
              collider0.emit(_ammoConst.CollisionEventObject.type, _ammoConst.CollisionEventObject);
              _ammoConst.CollisionEventObject.selfCollider = collider1;
              _ammoConst.CollisionEventObject.otherCollider = collider0;
              collider1.emit(_ammoConst.CollisionEventObject.type, _ammoConst.CollisionEventObject);
            }

            if (this.oldContactsDic.get(_shape.id, _shape2.id) == null) {
              this.oldContactsDic.set(_shape.id, _shape2.id, data);
            }
          }
        } // is exit


        var oldDicL = this.oldContactsDic.getLength();

        while (oldDicL--) {
          var _key = this.oldContactsDic.getKeyByIndex(oldDicL);

          var _data = this.oldContactsDic.getDataByKey(_key);

          var _shape3 = _data.shape0;
          var _shape4 = _data.shape1;
          var _collider = _shape3.collider;
          var _collider2 = _shape4.collider;

          if (_collider && _collider2) {
            var _isTrigger = _collider.isTrigger || _collider2.isTrigger;

            if (this.contactsDic.getDataByKey(_key) == null) {
              if (_isTrigger) {
                if (this.triggerArrayMat.get(_shape3.id, _shape4.id)) {
                  _ammoConst.TriggerEventObject.type = 'onTriggerExit';
                  _ammoConst.TriggerEventObject.selfCollider = _collider;
                  _ammoConst.TriggerEventObject.otherCollider = _collider2;

                  _collider.emit(_ammoConst.TriggerEventObject.type, _ammoConst.TriggerEventObject);

                  _ammoConst.TriggerEventObject.selfCollider = _collider2;
                  _ammoConst.TriggerEventObject.otherCollider = _collider;

                  _collider2.emit(_ammoConst.TriggerEventObject.type, _ammoConst.TriggerEventObject);

                  this.triggerArrayMat.set(_shape3.id, _shape4.id, false);
                  this.oldContactsDic.set(_shape3.id, _shape4.id, null);
                }
              } else {
                if (this.collisionArrayMat.get(_shape3.id, _shape4.id)) {
                  contactsPool.push.apply(contactsPool, _ammoConst.CollisionEventObject.contacts);
                  _ammoConst.CollisionEventObject.contacts.length = 0;

                  for (var _i4 = 0; _i4 < _data.contacts.length; _i4++) {
                    var _cq = _data.contacts[_i4];

                    if (contactsPool.length > 0) {
                      var _c2 = contactsPool.pop();

                      _c2.impl = _cq;

                      _ammoConst.CollisionEventObject.contacts.push(_c2);
                    } else {
                      var _c3 = new _ammoContactEquation.AmmoContactEquation(_ammoConst.CollisionEventObject);

                      _c3.impl = _cq;

                      _ammoConst.CollisionEventObject.contacts.push(_c3);
                    }
                  }

                  _ammoConst.CollisionEventObject.type = 'onCollisionExit';
                  _ammoConst.CollisionEventObject.selfCollider = _collider;
                  _ammoConst.CollisionEventObject.otherCollider = _collider2;

                  _collider.emit(_ammoConst.CollisionEventObject.type, _ammoConst.CollisionEventObject);

                  _ammoConst.CollisionEventObject.selfCollider = _collider2;
                  _ammoConst.CollisionEventObject.otherCollider = _collider;

                  _collider2.emit(_ammoConst.CollisionEventObject.type, _ammoConst.CollisionEventObject);

                  this.collisionArrayMat.set(_shape3.id, _shape4.id, false);
                  this.oldContactsDic.set(_shape3.id, _shape4.id, null);
                }
              }
            }
          }
        }

        this.contactsDic.reset();
      }
    }]);

    return AmmoWorld;
  }();

  _exports.AmmoWorld = AmmoWorld;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvYW1tby9hbW1vLXdvcmxkLnRzIl0sIm5hbWVzIjpbImNvbnRhY3RzUG9vbCIsInYzXzAiLCJDQ19WM18wIiwidjNfMSIsIkNDX1YzXzEiLCJBbW1vV29ybGQiLCJ2IiwiZ3Jhdml0eSIsIl9idEdyYXZpdHkiLCJfYnRXb3JsZCIsInNldEdyYXZpdHkiLCJvcHRpb25zIiwiX2J0QnJvYWRwaGFzZSIsIl9idFNvbHZlciIsIl9idERpc3BhdGNoZXIiLCJib2RpZXMiLCJnaG9zdHMiLCJjb25zdHJhaW50cyIsInRyaWdnZXJBcnJheU1hdCIsIkFycmF5Q29sbGlzaW9uTWF0cml4IiwiY29sbGlzaW9uQXJyYXlNYXQiLCJjb250YWN0c0RpYyIsIlR1cGxlRGljdGlvbmFyeSIsIm9sZENvbnRhY3RzRGljIiwiY2xvc2VIaXRDQiIsIkFtbW8iLCJDbG9zZXN0UmF5UmVzdWx0Q2FsbGJhY2siLCJidFZlY3RvcjMiLCJhbGxIaXRzQ0IiLCJBbGxIaXRzUmF5UmVzdWx0Q2FsbGJhY2siLCJjb2xsaXNpb25Db25maWd1cmF0aW9uIiwiYnREZWZhdWx0Q29sbGlzaW9uQ29uZmlndXJhdGlvbiIsImJ0Q29sbGlzaW9uRGlzcGF0Y2hlciIsInNldERpc3BhdGNoZXJGbGFncyIsIkFtbW9EaXNwYXRjaGVyRmxhZ3MiLCJDRF9TVEFUSUNfU1RBVElDX1JFUE9SVEVEIiwiYnREYnZ0QnJvYWRwaGFzZSIsImJ0U2VxdWVudGlhbEltcHVsc2VDb25zdHJhaW50U29sdmVyIiwiYnREaXNjcmV0ZUR5bmFtaWNzV29ybGQiLCJkZWx0YVRpbWUiLCJ0aW1lU2luY2VMYXN0Q2FsbGVkIiwibWF4U3ViU3RlcCIsImxlbmd0aCIsInVuZGVmaW5lZCIsInN0ZXBTaW11bGF0aW9uIiwiaSIsInN5bmNQaHlzaWNzVG9TY2VuZSIsInVwZGF0ZURpcnR5Iiwic3luY1NjZW5lVG9HaG9zdCIsInN5bmNTY2VuZVRvUGh5c2ljcyIsIndvcmxkUmF5IiwicG9vbCIsInJlc3VsdHMiLCJmcm9tIiwibV9yYXlGcm9tV29ybGQiLCJvIiwiY29tcHV0ZUhpdCIsIm1heERpc3RhbmNlIiwidG8iLCJtX3JheVRvV29ybGQiLCJtX2NvbGxpc2lvbkZpbHRlckdyb3VwIiwibV9jb2xsaXNpb25GaWx0ZXJNYXNrIiwibWFzayIsIm1fY2xvc2VzdEhpdEZyYWN0aW9uIiwibV9zaGFwZVBhcnQiLCJtX2NvbGxpc2lvbk9iamVjdCIsIm1fc2hhcGVQYXJ0cyIsImNsZWFyIiwibV9oaXRGcmFjdGlvbnMiLCJtX2NvbGxpc2lvbk9iamVjdHMiLCJocCIsIm1faGl0UG9pbnRXb3JsZCIsImhuIiwibV9oaXROb3JtYWxXb3JsZCIsInJheVRlc3QiLCJoYXNIaXQiLCJuIiwic2l6ZSIsImJ0T2JqIiwiYXQiLCJidENzIiwiZ2V0Q29sbGlzaW9uU2hhcGUiLCJzaGFwZSIsImlzQ29tcG91bmQiLCJzaGFwZUluZGV4IiwiaW5kZXgiLCJnZXRVc2VySW5kZXgiLCJzaGFyZWQiLCJBbW1vSW5zdGFuY2UiLCJib2R5QW5kR2hvc3RzIiwid3JhcHBlZFNoYXBlcyIsImRpc3RhbmNlIiwiVmVjMyIsInIiLCJhZGQiLCJfYXNzaWduIiwiY29sbGlkZXIiLCJwdXNoIiwicmVzdWx0Iiwibm9kZSIsIndyYXBwZWRCb2R5IiwiQW1tb1NoYXJlZEJvZHkiLCJnZXRTaGFyZWRCb2R5Iiwic2hhcmVkQm9keSIsImluZGV4T2YiLCJhZGRSaWdpZEJvZHkiLCJib2R5IiwiY29sbGlzaW9uRmlsdGVyR3JvdXAiLCJjb2xsaXNpb25GaWx0ZXJNYXNrIiwic3BsaWNlIiwicmVtb3ZlUmlnaWRCb2R5IiwiYWRkQ29sbGlzaW9uT2JqZWN0IiwiZ2hvc3QiLCJyZW1vdmVDb2xsaXNpb25PYmplY3QiLCJjb25zdHJhaW50IiwiYWRkQ29uc3RyYWludCIsImltcGwiLCJlbmFibGVDb2xsaXNpb24iLCJyZW1vdmVDb25zdHJhaW50IiwiZ3JvdXAiLCJnIiwiYiIsIm51bU1hbmlmb2xkcyIsImdldE51bU1hbmlmb2xkcyIsIm1hbmlmb2xkIiwiZ2V0TWFuaWZvbGRCeUluZGV4SW50ZXJuYWwiLCJib2R5MCIsImdldEJvZHkwIiwiYm9keTEiLCJnZXRCb2R5MSIsImlzU3RhdGljT2JqZWN0IiwiaXNVc2VDQ0QiLCJudW1Db250YWN0cyIsImdldE51bUNvbnRhY3RzIiwiaiIsIm1hbmlmb2xkUG9pbnQiLCJnZXRDb250YWN0UG9pbnQiLCJkIiwiZ2V0RGlzdGFuY2UiLCJzMCIsImdldFNoYXBlMCIsInMxIiwiZ2V0U2hhcGUxIiwic2hhcGUwIiwic2hhcGUxIiwiYXNiIiwiYm9keVN0cnVjdCIsImJ0U2hhcGUwIiwid3JhcHBlZCIsImJ0U2hhcGUxIiwiY29tIiwiY2FzdE9iamVjdCIsImJ0Q29tcG91bmRTaGFwZSIsImdldENoaWxkU2hhcGUiLCJtX2luZGV4MCIsIm1faW5kZXgxIiwibmVlZFRyaWdnZXJFdmVudCIsIm5lZWRDb2xsaXNpb25FdmVudCIsIml0ZW0iLCJnZXQiLCJpZCIsInNldCIsImNvbnRhY3RzIiwiZGljTCIsImdldExlbmd0aCIsImFwcGx5IiwiQ29sbGlzaW9uRXZlbnRPYmplY3QiLCJrZXkiLCJnZXRLZXlCeUluZGV4IiwiZGF0YSIsImdldERhdGFCeUtleSIsImNvbGxpZGVyMCIsImNvbGxpZGVyMSIsImlzVHJpZ2dlciIsIlRyaWdnZXJFdmVudE9iamVjdCIsInR5cGUiLCJzZWxmQ29sbGlkZXIiLCJvdGhlckNvbGxpZGVyIiwiZW1pdCIsImF0dGFjaGVkUmlnaWRCb2R5IiwiaXNTbGVlcGluZyIsImNxIiwiYyIsInBvcCIsIkFtbW9Db250YWN0RXF1YXRpb24iLCJvbGREaWNMIiwicmVzZXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBLE1BQU1BLFlBQW1DLEdBQUcsRUFBNUM7QUFDQSxNQUFNQyxJQUFJLEdBQUdDLGtCQUFiO0FBQ0EsTUFBTUMsSUFBSSxHQUFHQyxrQkFBYjs7TUFFYUMsUzs7O29DQUVNQyxDLEVBQVksQ0FBRzs7O3lDQUNWQSxDLEVBQW1CLENBQUc7OztpQ0FFOUJDLE8sRUFBb0I7QUFDNUIsc0NBQWUsS0FBS0MsVUFBcEIsRUFBZ0NELE9BQWhDOztBQUNBLGFBQUtFLFFBQUwsQ0FBY0MsVUFBZCxDQUF5QixLQUFLRixVQUE5QjtBQUNIOzs7MEJBRVc7QUFDUixlQUFPLEtBQUtDLFFBQVo7QUFDSDs7O0FBbUJELHVCQUFhRSxPQUFiLEVBQTRCO0FBQUE7O0FBQUEsV0FqQlhGLFFBaUJXO0FBQUEsV0FoQlhHLGFBZ0JXO0FBQUEsV0FmWEMsU0FlVztBQUFBLFdBZFhDLGFBY1c7QUFBQSxXQWJYTixVQWFXO0FBQUEsV0FYbkJPLE1BV21CLEdBWFEsRUFXUjtBQUFBLFdBVm5CQyxNQVVtQixHQVZRLEVBVVI7QUFBQSxXQVRuQkMsV0FTbUIsR0FUYSxFQVNiO0FBQUEsV0FSbkJDLGVBUW1CLEdBUkQsSUFBSUMsMENBQUosRUFRQztBQUFBLFdBUG5CQyxpQkFPbUIsR0FQQyxJQUFJRCwwQ0FBSixFQU9EO0FBQUEsV0FObkJFLFdBTW1CLEdBTkwsSUFBSUMsZ0NBQUosRUFNSztBQUFBLFdBTG5CQyxjQUttQixHQUxGLElBQUlELGdDQUFKLEVBS0U7QUFBQSxXQUhuQkUsVUFHbUIsR0FITixJQUFJQywwQkFBS0Msd0JBQVQsQ0FBa0MsSUFBSUQsMEJBQUtFLFNBQVQsRUFBbEMsRUFBd0QsSUFBSUYsMEJBQUtFLFNBQVQsRUFBeEQsQ0FHTTtBQUFBLFdBRm5CQyxTQUVtQixHQUZQLElBQUlILDBCQUFLSSx3QkFBVCxDQUFrQyxJQUFJSiwwQkFBS0UsU0FBVCxFQUFsQyxFQUF3RCxJQUFJRiwwQkFBS0UsU0FBVCxFQUF4RCxDQUVPO0FBQ3hCLFVBQU1HLHNCQUFzQixHQUFHLElBQUlMLDBCQUFLTSwrQkFBVCxFQUEvQjtBQUNBLFdBQUtqQixhQUFMLEdBQXFCLElBQUlXLDBCQUFLTyxxQkFBVCxDQUErQkYsc0JBQS9CLENBQXJCOztBQUNBLFdBQUtoQixhQUFMLENBQW1CbUIsa0JBQW5CLENBQXNDQyw4QkFBb0JDLHlCQUExRDs7QUFDQSxXQUFLdkIsYUFBTCxHQUFxQixJQUFJYSwwQkFBS1csZ0JBQVQsRUFBckI7QUFDQSxXQUFLdkIsU0FBTCxHQUFpQixJQUFJWSwwQkFBS1ksbUNBQVQsRUFBakI7QUFDQSxXQUFLNUIsUUFBTCxHQUFnQixJQUFJZ0IsMEJBQUthLHVCQUFULENBQWlDLEtBQUt4QixhQUF0QyxFQUFxRCxLQUFLRixhQUExRCxFQUF5RSxLQUFLQyxTQUE5RSxFQUF5RmlCLHNCQUF6RixDQUFoQjtBQUNBLFdBQUt0QixVQUFMLEdBQWtCLElBQUlpQiwwQkFBS0UsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUFDLEVBQXZCLEVBQTJCLENBQTNCLENBQWxCOztBQUNBLFdBQUtsQixRQUFMLENBQWNDLFVBQWQsQ0FBeUIsS0FBS0YsVUFBOUI7QUFDSDs7OzsyQkFFSytCLFMsRUFBbUJDLG1CLEVBQXNEO0FBQUEsWUFBeEJDLFVBQXdCLHVFQUFILENBQUc7QUFDM0UsWUFBSSxLQUFLMUIsTUFBTCxDQUFZMkIsTUFBWixJQUFzQixDQUF0QixJQUEyQixLQUFLMUIsTUFBTCxDQUFZMEIsTUFBWixJQUFzQixDQUFyRCxFQUF3RDtBQUN4RCxZQUFJRixtQkFBbUIsSUFBSUcsU0FBM0IsRUFBc0NILG1CQUFtQixHQUFHRCxTQUF0Qjs7QUFDdEMsYUFBSzlCLFFBQUwsQ0FBY21DLGNBQWQsQ0FBNkJKLG1CQUE3QixFQUFrREMsVUFBbEQsRUFBOERGLFNBQTlEOztBQUVBLGFBQUssSUFBSU0sQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLOUIsTUFBTCxDQUFZMkIsTUFBaEMsRUFBd0NHLENBQUMsRUFBekMsRUFBNkM7QUFDekMsZUFBSzlCLE1BQUwsQ0FBWThCLENBQVosRUFBZUMsa0JBQWY7QUFDSDtBQUNKOzs7MkNBRTJCO0FBQ3hCLGFBQUssSUFBSUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLN0IsTUFBTCxDQUFZMEIsTUFBaEMsRUFBd0NHLENBQUMsRUFBekMsRUFBNkM7QUFDekMsZUFBSzdCLE1BQUwsQ0FBWTZCLENBQVosRUFBZUUsV0FBZjtBQUNBLGVBQUsvQixNQUFMLENBQVk2QixDQUFaLEVBQWVHLGdCQUFmO0FBQ0g7O0FBRUQsYUFBSyxJQUFJSCxFQUFDLEdBQUcsQ0FBYixFQUFnQkEsRUFBQyxHQUFHLEtBQUs5QixNQUFMLENBQVkyQixNQUFoQyxFQUF3Q0csRUFBQyxFQUF6QyxFQUE2QztBQUN6QyxlQUFLOUIsTUFBTCxDQUFZOEIsRUFBWixFQUFlRSxXQUFmOztBQUNBLGVBQUtoQyxNQUFMLENBQVk4QixFQUFaLEVBQWVJLGtCQUFmO0FBQ0g7QUFDSjs7OzhCQUVRQyxRLEVBQWV2QyxPLEVBQTBCd0MsSSxFQUFxQ0MsTyxFQUFzQztBQUN6SCxZQUFJQyxJQUFJLEdBQUcsOEJBQWUsS0FBS3pCLFNBQUwsQ0FBZTBCLGNBQTlCLEVBQThDSixRQUFRLENBQUNLLENBQXZELENBQVg7QUFDQUwsUUFBQUEsUUFBUSxDQUFDTSxVQUFULENBQW9CdkQsSUFBcEIsRUFBMEJVLE9BQU8sQ0FBQzhDLFdBQWxDO0FBQ0EsWUFBSUMsRUFBRSxHQUFHLDhCQUFlLEtBQUs5QixTQUFMLENBQWUrQixZQUE5QixFQUE0QzFELElBQTVDLENBQVQ7QUFFQSxhQUFLMkIsU0FBTCxDQUFlZ0Msc0JBQWYsR0FBd0MsQ0FBQyxDQUF6QztBQUNBLGFBQUtoQyxTQUFMLENBQWVpQyxxQkFBZixHQUF1Q2xELE9BQU8sQ0FBQ21ELElBQS9DO0FBQ0EsYUFBS2xDLFNBQUwsQ0FBZW1DLG9CQUFmLEdBQXNDLENBQXRDO0FBQ0EsYUFBS25DLFNBQUwsQ0FBZW9DLFdBQWYsR0FBNkIsQ0FBQyxDQUE5QjtBQUNDLGFBQUtwQyxTQUFMLENBQWVxQyxpQkFBaEIsR0FBNEMsSUFBNUM7QUFDQSxhQUFLckMsU0FBTCxDQUFlc0MsWUFBZixDQUE0QkMsS0FBNUI7QUFDQSxhQUFLdkMsU0FBTCxDQUFld0MsY0FBZixDQUE4QkQsS0FBOUI7QUFDQSxhQUFLdkMsU0FBTCxDQUFleUMsa0JBQWYsQ0FBa0NGLEtBQWxDLEdBWnlILENBYXpIOztBQUNBLFlBQU1HLEVBQUUsR0FBSSxLQUFLMUMsU0FBTCxDQUFlMkMsZUFBM0I7QUFDQSxZQUFNQyxFQUFFLEdBQUksS0FBSzVDLFNBQUwsQ0FBZTZDLGdCQUEzQjtBQUNBSCxRQUFBQSxFQUFFLENBQUNILEtBQUg7QUFDQUssUUFBQUEsRUFBRSxDQUFDTCxLQUFIOztBQUNBLGFBQUsxRCxRQUFMLENBQWNpRSxPQUFkLENBQXNCckIsSUFBdEIsRUFBNEJLLEVBQTVCLEVBQWdDLEtBQUs5QixTQUFyQzs7QUFDQSxZQUFJLEtBQUtBLFNBQUwsQ0FBZStDLE1BQWYsRUFBSixFQUE2QjtBQUN6QixlQUFLLElBQUk5QixDQUFDLEdBQUcsQ0FBUixFQUFXK0IsQ0FBQyxHQUFHLEtBQUtoRCxTQUFMLENBQWV5QyxrQkFBZixDQUFrQ1EsSUFBbEMsRUFBcEIsRUFBOERoQyxDQUFDLEdBQUcrQixDQUFsRSxFQUFxRS9CLENBQUMsRUFBdEUsRUFBMEU7QUFDdEUsZ0JBQU1pQyxLQUFLLEdBQUcsS0FBS2xELFNBQUwsQ0FBZXlDLGtCQUFmLENBQWtDVSxFQUFsQyxDQUFxQ2xDLENBQXJDLENBQWQ7QUFDQSxnQkFBTW1DLElBQUksR0FBR0YsS0FBSyxDQUFDRyxpQkFBTixFQUFiO0FBQ0EsZ0JBQUlDLEtBQWdCLFNBQXBCOztBQUNBLGdCQUFJRixJQUFJLENBQUNHLFVBQUwsRUFBSixFQUF1QjtBQUNuQixrQkFBTUMsVUFBVSxHQUFHLEtBQUt4RCxTQUFMLENBQWVzQyxZQUFmLENBQTRCYSxFQUE1QixDQUErQmxDLENBQS9CLENBQW5CO0FBQ0Esa0JBQU13QyxLQUFLLEdBQUdQLEtBQUssQ0FBQ1EsWUFBTixFQUFkO0FBQ0Esa0JBQU1DLE1BQU0sR0FBR0MsMkJBQWFDLGFBQWIsQ0FBMkIsUUFBUUosS0FBbkMsQ0FBZjtBQUNBSCxjQUFBQSxLQUFLLEdBQUdLLE1BQU0sQ0FBQ0csYUFBUCxDQUFxQk4sVUFBckIsQ0FBUjtBQUNILGFBTEQsTUFLTztBQUNIRixjQUFBQSxLQUFLLEdBQUdGLElBQUksQ0FBQyxTQUFELENBQVo7QUFDSDs7QUFDRCwwQ0FBZS9FLElBQWYsRUFBcUJxRSxFQUFFLENBQUNTLEVBQUgsQ0FBTWxDLENBQU4sQ0FBckI7QUFDQSwwQ0FBZTFDLElBQWYsRUFBcUJxRSxFQUFFLENBQUNPLEVBQUgsQ0FBTWxDLENBQU4sQ0FBckI7O0FBQ0EsZ0JBQU04QyxRQUFRLEdBQUdDLFlBQUtELFFBQUwsQ0FBY3pDLFFBQVEsQ0FBQ0ssQ0FBdkIsRUFBMEJ0RCxJQUExQixDQUFqQjs7QUFDQSxnQkFBTTRGLENBQUMsR0FBRzFDLElBQUksQ0FBQzJDLEdBQUwsRUFBVjs7QUFDQUQsWUFBQUEsQ0FBQyxDQUFDRSxPQUFGLENBQVU5RixJQUFWLEVBQWdCMEYsUUFBaEIsRUFBMEJULEtBQUssQ0FBQ2MsUUFBaEMsRUFBMEM3RixJQUExQzs7QUFDQWlELFlBQUFBLE9BQU8sQ0FBQzZDLElBQVIsQ0FBYUosQ0FBYjtBQUNIOztBQUNELGlCQUFPLElBQVA7QUFDSDs7QUFDRCxlQUFPLEtBQVA7QUFDSDtBQUVEOzs7Ozs7O3FDQUlnQjNDLFEsRUFBZXZDLE8sRUFBMEJ1RixNLEVBQW1DO0FBQ3hGLFlBQUk3QyxJQUFJLEdBQUcsOEJBQWUsS0FBSzdCLFVBQUwsQ0FBZ0I4QixjQUEvQixFQUErQ0osUUFBUSxDQUFDSyxDQUF4RCxDQUFYO0FBQ0FMLFFBQUFBLFFBQVEsQ0FBQ00sVUFBVCxDQUFvQnZELElBQXBCLEVBQTBCVSxPQUFPLENBQUM4QyxXQUFsQztBQUNBLFlBQUlDLEVBQUUsR0FBRyw4QkFBZSxLQUFLbEMsVUFBTCxDQUFnQm1DLFlBQS9CLEVBQTZDMUQsSUFBN0MsQ0FBVDtBQUVBLGFBQUt1QixVQUFMLENBQWdCb0Msc0JBQWhCLEdBQXlDLENBQUMsQ0FBMUM7QUFDQSxhQUFLcEMsVUFBTCxDQUFnQnFDLHFCQUFoQixHQUF3Q2xELE9BQU8sQ0FBQ21ELElBQWhEO0FBQ0EsYUFBS3RDLFVBQUwsQ0FBZ0J1QyxvQkFBaEIsR0FBdUMsQ0FBdkM7QUFDQyxhQUFLdkMsVUFBTCxDQUFnQnlDLGlCQUFqQixHQUE2QyxJQUE3Qzs7QUFFQSxhQUFLeEQsUUFBTCxDQUFjaUUsT0FBZCxDQUFzQnJCLElBQXRCLEVBQTRCSyxFQUE1QixFQUFnQyxLQUFLbEMsVUFBckM7O0FBQ0EsWUFBSSxLQUFLQSxVQUFMLENBQWdCbUQsTUFBaEIsRUFBSixFQUE4QjtBQUMxQixjQUFNRyxLQUFLLEdBQUcsS0FBS3RELFVBQUwsQ0FBZ0J5QyxpQkFBOUI7QUFDQSxjQUFNZSxJQUFJLEdBQUdGLEtBQUssQ0FBQ0csaUJBQU4sRUFBYjtBQUNBLGNBQUlDLEtBQUo7O0FBQ0EsY0FBSUYsSUFBSSxDQUFDRyxVQUFMLEVBQUosRUFBdUI7QUFDbkIsZ0JBQU1FLEtBQUssR0FBR1AsS0FBSyxDQUFDUSxZQUFOLEVBQWQ7QUFDQSxnQkFBTUMsTUFBTSxHQUFHQywyQkFBYUMsYUFBYixDQUEyQixRQUFRSixLQUFuQyxDQUFmO0FBQ0EsZ0JBQU1ELFVBQVUsR0FBRyxLQUFLNUQsVUFBTCxDQUFnQndDLFdBQW5DO0FBQ0FrQixZQUFBQSxLQUFLLEdBQUdLLE1BQU0sQ0FBQ0csYUFBUCxDQUFxQk4sVUFBckIsQ0FBUjtBQUNILFdBTEQsTUFLTztBQUNIRixZQUFBQSxLQUFLLEdBQUdGLElBQUksQ0FBQyxTQUFELENBQVo7QUFDSDs7QUFDRCx3Q0FBZS9FLElBQWYsRUFBcUIsS0FBS3VCLFVBQUwsQ0FBZ0IrQyxlQUFyQztBQUNBLHdDQUFlcEUsSUFBZixFQUFxQixLQUFLcUIsVUFBTCxDQUFnQmlELGdCQUFyQzs7QUFDQSxjQUFNa0IsUUFBUSxHQUFHQyxZQUFLRCxRQUFMLENBQWN6QyxRQUFRLENBQUNLLENBQXZCLEVBQTBCdEQsSUFBMUIsQ0FBakI7O0FBQ0FpRyxVQUFBQSxNQUFNLENBQUNILE9BQVAsQ0FBZTlGLElBQWYsRUFBcUIwRixRQUFyQixFQUErQlQsS0FBSyxDQUFDYyxRQUFyQyxFQUErQzdGLElBQS9DOztBQUNBLGlCQUFPLElBQVA7QUFDSDs7QUFDRCxlQUFPLEtBQVA7QUFDSDs7O29DQUVjZ0csSSxFQUFZQyxXLEVBQTZCO0FBQ3BELGVBQU9DLCtCQUFlQyxhQUFmLENBQTZCSCxJQUE3QixFQUFtQyxJQUFuQyxFQUF5Q0MsV0FBekMsQ0FBUDtBQUNIOzs7b0NBRWNHLFUsRUFBNEI7QUFDdkMsWUFBTTFELENBQUMsR0FBRyxLQUFLOUIsTUFBTCxDQUFZeUYsT0FBWixDQUFvQkQsVUFBcEIsQ0FBVjs7QUFDQSxZQUFJMUQsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQLGVBQUs5QixNQUFMLENBQVlrRixJQUFaLENBQWlCTSxVQUFqQjs7QUFDQSxlQUFLOUYsUUFBTCxDQUFjZ0csWUFBZCxDQUEyQkYsVUFBVSxDQUFDRyxJQUF0QyxFQUE0Q0gsVUFBVSxDQUFDSSxvQkFBdkQsRUFBNkVKLFVBQVUsQ0FBQ0ssbUJBQXhGO0FBQ0g7QUFDSjs7O3VDQUVpQkwsVSxFQUE0QjtBQUMxQyxZQUFNMUQsQ0FBQyxHQUFHLEtBQUs5QixNQUFMLENBQVl5RixPQUFaLENBQW9CRCxVQUFwQixDQUFWOztBQUNBLFlBQUkxRCxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1IsZUFBSzlCLE1BQUwsQ0FBWThGLE1BQVosQ0FBbUJoRSxDQUFuQixFQUFzQixDQUF0Qjs7QUFDQSxlQUFLcEMsUUFBTCxDQUFjcUcsZUFBZCxDQUE4QlAsVUFBVSxDQUFDRyxJQUF6QztBQUNIO0FBQ0o7OztxQ0FFZUgsVSxFQUE0QjtBQUN4QyxZQUFNMUQsQ0FBQyxHQUFHLEtBQUs3QixNQUFMLENBQVl3RixPQUFaLENBQW9CRCxVQUFwQixDQUFWOztBQUNBLFlBQUkxRCxDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1AsZUFBSzdCLE1BQUwsQ0FBWWlGLElBQVosQ0FBaUJNLFVBQWpCOztBQUNBLGVBQUs5RixRQUFMLENBQWNzRyxrQkFBZCxDQUFpQ1IsVUFBVSxDQUFDUyxLQUE1QyxFQUFtRFQsVUFBVSxDQUFDSSxvQkFBOUQsRUFBb0ZKLFVBQVUsQ0FBQ0ssbUJBQS9GO0FBQ0g7QUFDSjs7O3dDQUVrQkwsVSxFQUE0QjtBQUMzQyxZQUFNMUQsQ0FBQyxHQUFHLEtBQUs3QixNQUFMLENBQVl3RixPQUFaLENBQW9CRCxVQUFwQixDQUFWOztBQUNBLFlBQUkxRCxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1IsZUFBSzdCLE1BQUwsQ0FBWTZGLE1BQVosQ0FBbUJoRSxDQUFuQixFQUFzQixDQUF0Qjs7QUFDQSxlQUFLcEMsUUFBTCxDQUFjd0cscUJBQWQsQ0FBb0NWLFVBQVUsQ0FBQ1MsS0FBL0M7QUFDSDtBQUNKOzs7b0NBRWNFLFUsRUFBNEI7QUFDdkMsWUFBTXJFLENBQUMsR0FBRyxLQUFLNUIsV0FBTCxDQUFpQnVGLE9BQWpCLENBQXlCVSxVQUF6QixDQUFWOztBQUNBLFlBQUlyRSxDQUFDLEdBQUcsQ0FBUixFQUFXO0FBQ1AsZUFBSzVCLFdBQUwsQ0FBaUJnRixJQUFqQixDQUFzQmlCLFVBQXRCOztBQUNBLGVBQUt6RyxRQUFMLENBQWMwRyxhQUFkLENBQTRCRCxVQUFVLENBQUNFLElBQXZDLEVBQTZDLENBQUNGLFVBQVUsQ0FBQ0EsVUFBWCxDQUFzQkcsZUFBcEU7O0FBQ0FILFVBQUFBLFVBQVUsQ0FBQzdCLEtBQVgsR0FBbUJ4QyxDQUFuQjtBQUNIO0FBQ0o7Ozt1Q0FFaUJxRSxVLEVBQTRCO0FBQzFDLFlBQU1yRSxDQUFDLEdBQUcsS0FBSzVCLFdBQUwsQ0FBaUJ1RixPQUFqQixDQUF5QlUsVUFBekIsQ0FBVjs7QUFDQSxZQUFJckUsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNSLGVBQUs1QixXQUFMLENBQWlCNEYsTUFBakIsQ0FBd0JoRSxDQUF4QixFQUEyQixDQUEzQjs7QUFDQSxlQUFLcEMsUUFBTCxDQUFjNkcsZ0JBQWQsQ0FBK0JKLFVBQVUsQ0FBQ0UsSUFBMUM7O0FBQ0FGLFVBQUFBLFVBQVUsQ0FBQzdCLEtBQVgsR0FBbUIsQ0FBQyxDQUFwQjtBQUNIO0FBQ0o7Ozs0Q0FFc0JrQyxLLEVBQWV6RCxJLEVBQWM7QUFDaEQsYUFBSyxJQUFJakIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLN0IsTUFBTCxDQUFZMEIsTUFBaEMsRUFBd0NHLENBQUMsRUFBekMsRUFBNkM7QUFDekMsY0FBTTJFLENBQUMsR0FBRyxLQUFLeEcsTUFBTCxDQUFZNkIsQ0FBWixDQUFWOztBQUNBLGNBQUkyRSxDQUFDLENBQUNiLG9CQUFGLElBQTBCWSxLQUE5QixFQUFxQztBQUNqQ0MsWUFBQUEsQ0FBQyxDQUFDWixtQkFBRixHQUF3QjlDLElBQXhCO0FBQ0g7QUFDSjs7QUFDRCxhQUFLLElBQUlqQixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHLEtBQUs5QixNQUFMLENBQVkyQixNQUFoQyxFQUF3Q0csR0FBQyxFQUF6QyxFQUE2QztBQUN6QyxjQUFNNEUsQ0FBQyxHQUFHLEtBQUsxRyxNQUFMLENBQVk4QixHQUFaLENBQVY7O0FBQ0EsY0FBSTRFLENBQUMsQ0FBQ2Qsb0JBQUYsSUFBMEJZLEtBQTlCLEVBQXFDO0FBQ2pDRSxZQUFBQSxDQUFDLENBQUNiLG1CQUFGLEdBQXdCOUMsSUFBeEI7QUFDSDtBQUNKO0FBQ0o7OzttQ0FFYTtBQUNWLFlBQU00RCxZQUFZLEdBQUcsS0FBSzVHLGFBQUwsQ0FBbUI2RyxlQUFuQixFQUFyQjs7QUFDQSxhQUFLLElBQUk5RSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHNkUsWUFBcEIsRUFBa0M3RSxDQUFDLEVBQW5DLEVBQXVDO0FBQ25DLGNBQU0rRSxRQUFRLEdBQUcsS0FBSzlHLGFBQUwsQ0FBbUIrRywwQkFBbkIsQ0FBOENoRixDQUE5QyxDQUFqQjs7QUFDQSxjQUFNaUYsS0FBSyxHQUFHRixRQUFRLENBQUNHLFFBQVQsRUFBZDtBQUNBLGNBQU1DLEtBQUssR0FBR0osUUFBUSxDQUFDSyxRQUFULEVBQWQ7QUFFQSxjQUFJLENBQUN4RywwQkFBSyxXQUFMLEVBQWtCLHFCQUFsQixDQUFELElBQTZDcUcsS0FBSyxDQUFDSSxjQUFOLEVBQTdDLElBQXVFRixLQUFLLENBQUNFLGNBQU4sRUFBM0UsRUFDSSxTQU4rQixDQVFuQzs7QUFDQSxjQUFJSixLQUFLLENBQUMsY0FBRCxDQUFMLElBQXlCRSxLQUFLLENBQUMsY0FBRCxDQUFsQyxFQUNJO0FBRUosY0FBTUcsUUFBUSxHQUFHTCxLQUFLLENBQUMsUUFBRCxDQUFMLElBQW1CRSxLQUFLLENBQUMsUUFBRCxDQUF6QztBQUNBLGNBQU1JLFdBQVcsR0FBR1IsUUFBUSxDQUFDUyxjQUFULEVBQXBCOztBQUNBLGVBQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsV0FBcEIsRUFBaUNFLENBQUMsRUFBbEMsRUFBc0M7QUFDbEMsZ0JBQU1DLGFBQW1DLEdBQUdYLFFBQVEsQ0FBQ1ksZUFBVCxDQUF5QkYsQ0FBekIsQ0FBNUM7QUFDQSxnQkFBTUcsQ0FBQyxHQUFHRixhQUFhLENBQUNHLFdBQWQsRUFBVjs7QUFDQSxnQkFBSUQsQ0FBQyxJQUFJLENBQVQsRUFBWTtBQUNSLGtCQUFNRSxFQUFFLEdBQUdKLGFBQWEsQ0FBQ0ssU0FBZCxFQUFYO0FBQ0Esa0JBQU1DLEVBQUUsR0FBR04sYUFBYSxDQUFDTyxTQUFkLEVBQVg7QUFDQSxrQkFBSUMsTUFBaUIsU0FBckI7QUFDQSxrQkFBSUMsTUFBaUIsU0FBckI7O0FBQ0Esa0JBQUliLFFBQUosRUFBYztBQUNWLG9CQUFJTCxLQUFLLENBQUMsUUFBRCxDQUFULEVBQXFCO0FBQ2pCLHNCQUFNbUIsR0FBRyxHQUFJbkIsS0FBSyxDQUFDLFNBQUQsQ0FBTixDQUFvQ3ZCLFVBQWhEO0FBQ0Esc0JBQUksQ0FBQzBDLEdBQUwsRUFBVTtBQUNWRixrQkFBQUEsTUFBTSxHQUFHRSxHQUFHLENBQUNDLFVBQUosQ0FBZXhELGFBQWYsQ0FBNkIsQ0FBN0IsQ0FBVDtBQUNILGlCQUpELE1BSU87QUFDSCxzQkFBTXlELFFBQVEsR0FBR3JCLEtBQUssQ0FBQzdDLGlCQUFOLEVBQWpCOztBQUNBLHNCQUFJa0UsUUFBUSxDQUFDaEUsVUFBVCxFQUFKLEVBQTJCO0FBQ3ZCO0FBQ0E7QUFDSCxtQkFIRCxNQUdPO0FBQ0g0RCxvQkFBQUEsTUFBTSxHQUFJSSxRQUFELENBQWtCQyxPQUEzQjtBQUNIO0FBQ0o7O0FBRUQsb0JBQUlwQixLQUFLLENBQUMsUUFBRCxDQUFULEVBQXFCO0FBQ2pCLHNCQUFNaUIsSUFBRyxHQUFJakIsS0FBSyxDQUFDLFNBQUQsQ0FBTixDQUFvQ3pCLFVBQWhEO0FBQ0Esc0JBQUksQ0FBQzBDLElBQUwsRUFBVTtBQUNWRCxrQkFBQUEsTUFBTSxHQUFHQyxJQUFHLENBQUNDLFVBQUosQ0FBZXhELGFBQWYsQ0FBNkIsQ0FBN0IsQ0FBVDtBQUNILGlCQUpELE1BSU87QUFDSCxzQkFBTTJELFFBQVEsR0FBR3JCLEtBQUssQ0FBQy9DLGlCQUFOLEVBQWpCOztBQUNBLHNCQUFJb0UsUUFBUSxDQUFDbEUsVUFBVCxFQUFKLEVBQTJCO0FBQ3ZCO0FBQ0E7QUFDSCxtQkFIRCxNQUdPO0FBQ0g2RCxvQkFBQUEsTUFBTSxHQUFJSyxRQUFELENBQWtCRCxPQUEzQjtBQUNIO0FBQ0o7QUFDSixlQTVCRCxNQTRCTztBQUNILG9CQUFJVCxFQUFFLENBQUN4RCxVQUFILEVBQUosRUFBcUI7QUFDakIsc0JBQU1tRSxHQUFHLEdBQUc3SCwwQkFBSzhILFVBQUwsQ0FBZ0JaLEVBQWhCLEVBQW9CbEgsMEJBQUsrSCxlQUF6QixDQUFaOztBQUNBVCxrQkFBQUEsTUFBTSxHQUFJTyxHQUFHLENBQUNHLGFBQUosQ0FBa0JsQixhQUFhLENBQUNtQixRQUFoQyxDQUFELENBQW1ETixPQUE1RDtBQUNILGlCQUhELE1BR087QUFDSEwsa0JBQUFBLE1BQU0sR0FBSUosRUFBRCxDQUFZUyxPQUFyQjtBQUNIOztBQUVELG9CQUFJUCxFQUFFLENBQUMxRCxVQUFILEVBQUosRUFBcUI7QUFDakIsc0JBQU1tRSxJQUFHLEdBQUc3SCwwQkFBSzhILFVBQUwsQ0FBZ0JWLEVBQWhCLEVBQW9CcEgsMEJBQUsrSCxlQUF6QixDQUFaOztBQUNBUixrQkFBQUEsTUFBTSxHQUFJTSxJQUFHLENBQUNHLGFBQUosQ0FBa0JsQixhQUFhLENBQUNvQixRQUFoQyxDQUFELENBQW1EUCxPQUE1RDtBQUNILGlCQUhELE1BR087QUFDSEosa0JBQUFBLE1BQU0sR0FBSUgsRUFBRCxDQUFZTyxPQUFyQjtBQUNIO0FBQ0o7O0FBRUQsa0JBQUlMLE1BQU0sQ0FBQy9DLFFBQVAsQ0FBZ0I0RCxnQkFBaEIsSUFDQVosTUFBTSxDQUFDaEQsUUFBUCxDQUFnQjRELGdCQURoQixJQUVBYixNQUFNLENBQUMvQyxRQUFQLENBQWdCNkQsa0JBRmhCLElBR0FiLE1BQU0sQ0FBQ2hELFFBQVAsQ0FBZ0I2RCxrQkFIcEIsRUFJRTtBQUNFO0FBQ0Esb0JBQUlDLElBQUksR0FBRyxLQUFLekksV0FBTCxDQUFpQjBJLEdBQWpCLENBQXFCaEIsTUFBTSxDQUFDaUIsRUFBNUIsRUFBZ0NoQixNQUFNLENBQUNnQixFQUF2QyxDQUFYOztBQUNBLG9CQUFJRixJQUFJLElBQUksSUFBWixFQUFrQjtBQUNkQSxrQkFBQUEsSUFBSSxHQUFHLEtBQUt6SSxXQUFMLENBQWlCNEksR0FBakIsQ0FBcUJsQixNQUFNLENBQUNpQixFQUE1QixFQUFnQ2hCLE1BQU0sQ0FBQ2dCLEVBQXZDLEVBQ0g7QUFDSWpCLG9CQUFBQSxNQUFNLEVBQUVBLE1BRFo7QUFFSUMsb0JBQUFBLE1BQU0sRUFBRUEsTUFGWjtBQUdJa0Isb0JBQUFBLFFBQVEsRUFBRSxFQUhkO0FBSUk5QyxvQkFBQUEsSUFBSSxFQUFFUTtBQUpWLG1CQURHLENBQVA7QUFRSDs7QUFDRGtDLGdCQUFBQSxJQUFJLENBQUNJLFFBQUwsQ0FBY2pFLElBQWQsQ0FBbUJzQyxhQUFuQjtBQUNIO0FBQ0o7QUFDSjtBQUNKLFNBekZTLENBMkZWOzs7QUFDQSxZQUFJNEIsSUFBSSxHQUFHLEtBQUs5SSxXQUFMLENBQWlCK0ksU0FBakIsRUFBWDs7QUFDQSxlQUFPRCxJQUFJLEVBQVgsRUFBZTtBQUNYbkssVUFBQUEsWUFBWSxDQUFDaUcsSUFBYixDQUFrQm9FLEtBQWxCLENBQXdCckssWUFBeEIsRUFBc0NzSyxnQ0FBcUJKLFFBQTNEO0FBQ0FJLDBDQUFxQkosUUFBckIsQ0FBOEJ4SCxNQUE5QixHQUF1QyxDQUF2QztBQUVBLGNBQU02SCxHQUFHLEdBQUcsS0FBS2xKLFdBQUwsQ0FBaUJtSixhQUFqQixDQUErQkwsSUFBL0IsQ0FBWjtBQUNBLGNBQU1NLElBQUksR0FBRyxLQUFLcEosV0FBTCxDQUFpQnFKLFlBQWpCLENBQThCSCxHQUE5QixDQUFiO0FBQ0EsY0FBTXhCLE1BQWlCLEdBQUcwQixJQUFJLENBQUMxQixNQUEvQjtBQUNBLGNBQU1DLE9BQWlCLEdBQUd5QixJQUFJLENBQUN6QixNQUEvQjtBQUNBLGVBQUt6SCxjQUFMLENBQW9CMEksR0FBcEIsQ0FBd0JsQixNQUFNLENBQUNpQixFQUEvQixFQUFtQ2hCLE9BQU0sQ0FBQ2dCLEVBQTFDLEVBQThDUyxJQUE5QztBQUNBLGNBQU1FLFNBQVMsR0FBRzVCLE1BQU0sQ0FBQy9DLFFBQXpCO0FBQ0EsY0FBTTRFLFNBQVMsR0FBRzVCLE9BQU0sQ0FBQ2hELFFBQXpCOztBQUNBLGNBQUkyRSxTQUFTLElBQUlDLFNBQWpCLEVBQTRCO0FBQ3hCLGdCQUFNQyxTQUFTLEdBQUdGLFNBQVMsQ0FBQ0UsU0FBVixJQUF1QkQsU0FBUyxDQUFDQyxTQUFuRDs7QUFDQSxnQkFBSUEsU0FBSixFQUFlO0FBQ1gsa0JBQUksS0FBSzNKLGVBQUwsQ0FBcUI2SSxHQUFyQixDQUF5QmhCLE1BQU0sQ0FBQ2lCLEVBQWhDLEVBQW9DaEIsT0FBTSxDQUFDZ0IsRUFBM0MsQ0FBSixFQUFvRDtBQUNoRGMsOENBQW1CQyxJQUFuQixHQUEwQixlQUExQjtBQUNILGVBRkQsTUFFTztBQUNIRCw4Q0FBbUJDLElBQW5CLEdBQTBCLGdCQUExQjtBQUNBLHFCQUFLN0osZUFBTCxDQUFxQitJLEdBQXJCLENBQXlCbEIsTUFBTSxDQUFDaUIsRUFBaEMsRUFBb0NoQixPQUFNLENBQUNnQixFQUEzQyxFQUErQyxJQUEvQztBQUNIOztBQUNEYyw0Q0FBbUIxRCxJQUFuQixHQUEwQnFELElBQUksQ0FBQ3JELElBQS9CO0FBQ0EwRCw0Q0FBbUJFLFlBQW5CLEdBQWtDTCxTQUFsQztBQUNBRyw0Q0FBbUJHLGFBQW5CLEdBQW1DTCxTQUFuQztBQUNBRCxjQUFBQSxTQUFTLENBQUNPLElBQVYsQ0FBZUosOEJBQW1CQyxJQUFsQyxFQUF3Q0QsNkJBQXhDO0FBRUFBLDRDQUFtQkUsWUFBbkIsR0FBa0NKLFNBQWxDO0FBQ0FFLDRDQUFtQkcsYUFBbkIsR0FBbUNOLFNBQW5DO0FBQ0FDLGNBQUFBLFNBQVMsQ0FBQ00sSUFBVixDQUFlSiw4QkFBbUJDLElBQWxDLEVBQXdDRCw2QkFBeEM7QUFDSCxhQWZELE1BZU87QUFDSCxrQkFBTWhELEtBQUssR0FBRzZDLFNBQVMsQ0FBQ1EsaUJBQXhCO0FBQ0Esa0JBQU1uRCxNQUFLLEdBQUc0QyxTQUFTLENBQUNPLGlCQUF4Qjs7QUFDQSxrQkFBSXJELEtBQUssSUFBSUUsTUFBYixFQUFvQjtBQUNoQixvQkFBSUYsS0FBSyxDQUFDc0QsVUFBTixJQUFvQnBELE1BQUssQ0FBQ29ELFVBQTlCLEVBQTBDO0FBQzdDLGVBRkQsTUFFTyxJQUFJdEQsS0FBSyxJQUFJLElBQVQsSUFBaUJFLE1BQXJCLEVBQTRCO0FBQy9CLG9CQUFJQSxNQUFLLENBQUNvRCxVQUFWLEVBQXNCO0FBQ3pCLGVBRk0sTUFFQSxJQUFJcEQsTUFBSyxJQUFJLElBQVQsSUFBaUJGLEtBQXJCLEVBQTRCO0FBQy9CLG9CQUFJQSxLQUFLLENBQUNzRCxVQUFWLEVBQXNCO0FBQ3pCOztBQUNELGtCQUFJLEtBQUtoSyxpQkFBTCxDQUF1QjJJLEdBQXZCLENBQTJCaEIsTUFBTSxDQUFDaUIsRUFBbEMsRUFBc0NoQixPQUFNLENBQUNnQixFQUE3QyxDQUFKLEVBQXNEO0FBQ2xETSxnREFBcUJTLElBQXJCLEdBQTRCLGlCQUE1QjtBQUNILGVBRkQsTUFFTztBQUNIVCxnREFBcUJTLElBQXJCLEdBQTRCLGtCQUE1QjtBQUNBLHFCQUFLM0osaUJBQUwsQ0FBdUI2SSxHQUF2QixDQUEyQmxCLE1BQU0sQ0FBQ2lCLEVBQWxDLEVBQXNDaEIsT0FBTSxDQUFDZ0IsRUFBN0MsRUFBaUQsSUFBakQ7QUFDSDs7QUFFRCxtQkFBSyxJQUFJbkgsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBRzRILElBQUksQ0FBQ1AsUUFBTCxDQUFjeEgsTUFBbEMsRUFBMENHLEdBQUMsRUFBM0MsRUFBK0M7QUFDM0Msb0JBQU13SSxFQUFFLEdBQUdaLElBQUksQ0FBQ1AsUUFBTCxDQUFjckgsR0FBZCxDQUFYOztBQUNBLG9CQUFJN0MsWUFBWSxDQUFDMEMsTUFBYixHQUFzQixDQUExQixFQUE2QjtBQUN6QixzQkFBTTRJLENBQUMsR0FBR3RMLFlBQVksQ0FBQ3VMLEdBQWIsRUFBVjtBQUNBRCxrQkFBQUEsQ0FBQyxDQUFFbEUsSUFBSCxHQUFVaUUsRUFBVjs7QUFDQWYsa0RBQXFCSixRQUFyQixDQUE4QmpFLElBQTlCLENBQW1DcUYsQ0FBbkM7QUFDSCxpQkFKRCxNQUlPO0FBQ0gsc0JBQU1BLEVBQUMsR0FBRyxJQUFJRSx3Q0FBSixDQUF3QmxCLCtCQUF4QixDQUFWOztBQUNBZ0Isa0JBQUFBLEVBQUMsQ0FBQ2xFLElBQUYsR0FBU2lFLEVBQVQ7O0FBQ0FmLGtEQUFxQkosUUFBckIsQ0FBOEJqRSxJQUE5QixDQUFtQ3FGLEVBQW5DO0FBQ0g7QUFDSjs7QUFDRGhCLDhDQUFxQmxELElBQXJCLEdBQTRCcUQsSUFBSSxDQUFDckQsSUFBakM7QUFDQWtELDhDQUFxQlUsWUFBckIsR0FBb0NMLFNBQXBDO0FBQ0FMLDhDQUFxQlcsYUFBckIsR0FBcUNMLFNBQXJDO0FBQ0FELGNBQUFBLFNBQVMsQ0FBQ08sSUFBVixDQUFlWixnQ0FBcUJTLElBQXBDLEVBQTBDVCwrQkFBMUM7QUFFQUEsOENBQXFCVSxZQUFyQixHQUFvQ0osU0FBcEM7QUFDQU4sOENBQXFCVyxhQUFyQixHQUFxQ04sU0FBckM7QUFDQUMsY0FBQUEsU0FBUyxDQUFDTSxJQUFWLENBQWVaLGdDQUFxQlMsSUFBcEMsRUFBMENULCtCQUExQztBQUNIOztBQUVELGdCQUFJLEtBQUsvSSxjQUFMLENBQW9Cd0ksR0FBcEIsQ0FBd0JoQixNQUFNLENBQUNpQixFQUEvQixFQUFtQ2hCLE9BQU0sQ0FBQ2dCLEVBQTFDLEtBQWlELElBQXJELEVBQTJEO0FBQ3ZELG1CQUFLekksY0FBTCxDQUFvQjBJLEdBQXBCLENBQXdCbEIsTUFBTSxDQUFDaUIsRUFBL0IsRUFBbUNoQixPQUFNLENBQUNnQixFQUExQyxFQUE4Q1MsSUFBOUM7QUFDSDtBQUNKO0FBQ0osU0FwS1MsQ0FzS1Y7OztBQUNBLFlBQUlnQixPQUFPLEdBQUcsS0FBS2xLLGNBQUwsQ0FBb0I2SSxTQUFwQixFQUFkOztBQUNBLGVBQU9xQixPQUFPLEVBQWQsRUFBa0I7QUFDZCxjQUFJbEIsSUFBRyxHQUFHLEtBQUtoSixjQUFMLENBQW9CaUosYUFBcEIsQ0FBa0NpQixPQUFsQyxDQUFWOztBQUNBLGNBQUloQixLQUFJLEdBQUcsS0FBS2xKLGNBQUwsQ0FBb0JtSixZQUFwQixDQUFpQ0gsSUFBakMsQ0FBWDs7QUFDQSxjQUFNeEIsT0FBaUIsR0FBRzBCLEtBQUksQ0FBQzFCLE1BQS9CO0FBQ0EsY0FBTUMsT0FBaUIsR0FBR3lCLEtBQUksQ0FBQ3pCLE1BQS9CO0FBQ0EsY0FBTTJCLFNBQVMsR0FBRzVCLE9BQU0sQ0FBQy9DLFFBQXpCO0FBQ0EsY0FBTTRFLFVBQVMsR0FBRzVCLE9BQU0sQ0FBQ2hELFFBQXpCOztBQUNBLGNBQUkyRSxTQUFTLElBQUlDLFVBQWpCLEVBQTRCO0FBQ3hCLGdCQUFNQyxVQUFTLEdBQUdGLFNBQVMsQ0FBQ0UsU0FBVixJQUF1QkQsVUFBUyxDQUFDQyxTQUFuRDs7QUFDQSxnQkFBSSxLQUFLeEosV0FBTCxDQUFpQnFKLFlBQWpCLENBQThCSCxJQUE5QixLQUFzQyxJQUExQyxFQUFnRDtBQUM1QyxrQkFBSU0sVUFBSixFQUFlO0FBQ1gsb0JBQUksS0FBSzNKLGVBQUwsQ0FBcUI2SSxHQUFyQixDQUF5QmhCLE9BQU0sQ0FBQ2lCLEVBQWhDLEVBQW9DaEIsT0FBTSxDQUFDZ0IsRUFBM0MsQ0FBSixFQUFvRDtBQUNoRGMsZ0RBQW1CQyxJQUFuQixHQUEwQixlQUExQjtBQUNBRCxnREFBbUJFLFlBQW5CLEdBQWtDTCxTQUFsQztBQUNBRyxnREFBbUJHLGFBQW5CLEdBQW1DTCxVQUFuQzs7QUFDQUQsa0JBQUFBLFNBQVMsQ0FBQ08sSUFBVixDQUFlSiw4QkFBbUJDLElBQWxDLEVBQXdDRCw2QkFBeEM7O0FBRUFBLGdEQUFtQkUsWUFBbkIsR0FBa0NKLFVBQWxDO0FBQ0FFLGdEQUFtQkcsYUFBbkIsR0FBbUNOLFNBQW5DOztBQUNBQyxrQkFBQUEsVUFBUyxDQUFDTSxJQUFWLENBQWVKLDhCQUFtQkMsSUFBbEMsRUFBd0NELDZCQUF4Qzs7QUFFQSx1QkFBSzVKLGVBQUwsQ0FBcUIrSSxHQUFyQixDQUF5QmxCLE9BQU0sQ0FBQ2lCLEVBQWhDLEVBQW9DaEIsT0FBTSxDQUFDZ0IsRUFBM0MsRUFBK0MsS0FBL0M7QUFDQSx1QkFBS3pJLGNBQUwsQ0FBb0IwSSxHQUFwQixDQUF3QmxCLE9BQU0sQ0FBQ2lCLEVBQS9CLEVBQW1DaEIsT0FBTSxDQUFDZ0IsRUFBMUMsRUFBOEMsSUFBOUM7QUFDSDtBQUNKLGVBZEQsTUFjTztBQUNILG9CQUFJLEtBQUs1SSxpQkFBTCxDQUF1QjJJLEdBQXZCLENBQTJCaEIsT0FBTSxDQUFDaUIsRUFBbEMsRUFBc0NoQixPQUFNLENBQUNnQixFQUE3QyxDQUFKLEVBQXNEO0FBQ2xEaEssa0JBQUFBLFlBQVksQ0FBQ2lHLElBQWIsQ0FBa0JvRSxLQUFsQixDQUF3QnJLLFlBQXhCLEVBQXNDc0ssZ0NBQXFCSixRQUEzRDtBQUNBSSxrREFBcUJKLFFBQXJCLENBQThCeEgsTUFBOUIsR0FBdUMsQ0FBdkM7O0FBRUEsdUJBQUssSUFBSUcsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBRzRILEtBQUksQ0FBQ1AsUUFBTCxDQUFjeEgsTUFBbEMsRUFBMENHLEdBQUMsRUFBM0MsRUFBK0M7QUFDM0Msd0JBQU13SSxHQUFFLEdBQUdaLEtBQUksQ0FBQ1AsUUFBTCxDQUFjckgsR0FBZCxDQUFYOztBQUNBLHdCQUFJN0MsWUFBWSxDQUFDMEMsTUFBYixHQUFzQixDQUExQixFQUE2QjtBQUN6QiwwQkFBTTRJLEdBQUMsR0FBR3RMLFlBQVksQ0FBQ3VMLEdBQWIsRUFBVjs7QUFDQUQsc0JBQUFBLEdBQUMsQ0FBRWxFLElBQUgsR0FBVWlFLEdBQVY7O0FBQ0FmLHNEQUFxQkosUUFBckIsQ0FBOEJqRSxJQUE5QixDQUFtQ3FGLEdBQW5DO0FBQ0gscUJBSkQsTUFJTztBQUNILDBCQUFNQSxHQUFDLEdBQUcsSUFBSUUsd0NBQUosQ0FBd0JsQiwrQkFBeEIsQ0FBVjs7QUFDQWdCLHNCQUFBQSxHQUFDLENBQUNsRSxJQUFGLEdBQVNpRSxHQUFUOztBQUNBZixzREFBcUJKLFFBQXJCLENBQThCakUsSUFBOUIsQ0FBbUNxRixHQUFuQztBQUNIO0FBQ0o7O0FBRURoQixrREFBcUJTLElBQXJCLEdBQTRCLGlCQUE1QjtBQUNBVCxrREFBcUJVLFlBQXJCLEdBQW9DTCxTQUFwQztBQUNBTCxrREFBcUJXLGFBQXJCLEdBQXFDTCxVQUFyQzs7QUFDQUQsa0JBQUFBLFNBQVMsQ0FBQ08sSUFBVixDQUFlWixnQ0FBcUJTLElBQXBDLEVBQTBDVCwrQkFBMUM7O0FBRUFBLGtEQUFxQlUsWUFBckIsR0FBb0NKLFVBQXBDO0FBQ0FOLGtEQUFxQlcsYUFBckIsR0FBcUNOLFNBQXJDOztBQUNBQyxrQkFBQUEsVUFBUyxDQUFDTSxJQUFWLENBQWVaLGdDQUFxQlMsSUFBcEMsRUFBMENULCtCQUExQzs7QUFFQSx1QkFBS2xKLGlCQUFMLENBQXVCNkksR0FBdkIsQ0FBMkJsQixPQUFNLENBQUNpQixFQUFsQyxFQUFzQ2hCLE9BQU0sQ0FBQ2dCLEVBQTdDLEVBQWlELEtBQWpEO0FBQ0EsdUJBQUt6SSxjQUFMLENBQW9CMEksR0FBcEIsQ0FBd0JsQixPQUFNLENBQUNpQixFQUEvQixFQUFtQ2hCLE9BQU0sQ0FBQ2dCLEVBQTFDLEVBQThDLElBQTlDO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFDSjs7QUFFRCxhQUFLM0ksV0FBTCxDQUFpQnFLLEtBQWpCO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQW1tbyBmcm9tICcuL2FtbW8taW5zdGFudGlhdGVkJztcclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gXCIuLi8uLi9jb3JlL21hdGhcIjtcclxuaW1wb3J0IHsgQW1tb1NoYXJlZEJvZHkgfSBmcm9tIFwiLi9hbW1vLXNoYXJlZC1ib2R5XCI7XHJcbmltcG9ydCB7IEFtbW9SaWdpZEJvZHkgfSBmcm9tIFwiLi9hbW1vLXJpZ2lkLWJvZHlcIjtcclxuaW1wb3J0IHsgQW1tb1NoYXBlIH0gZnJvbSAnLi9zaGFwZXMvYW1tby1zaGFwZSc7XHJcbmltcG9ydCB7IEFycmF5Q29sbGlzaW9uTWF0cml4IH0gZnJvbSAnLi4vdXRpbHMvYXJyYXktY29sbGlzaW9uLW1hdHJpeCc7XHJcbmltcG9ydCB7IFR1cGxlRGljdGlvbmFyeSB9IGZyb20gJy4uL3V0aWxzL3R1cGxlLWRpY3Rpb25hcnknO1xyXG5pbXBvcnQgeyBUcmlnZ2VyRXZlbnRPYmplY3QsIENvbGxpc2lvbkV2ZW50T2JqZWN0LCBDQ19WM18wLCBDQ19WM18xIH0gZnJvbSAnLi9hbW1vLWNvbnN0JztcclxuaW1wb3J0IHsgYW1tbzJDb2Nvc1ZlYzMsIGNvY29zMkFtbW9WZWMzLCBjb2NvczJBbW1vUXVhdCB9IGZyb20gJy4vYW1tby11dGlsJztcclxuaW1wb3J0IHsgcmF5IH0gZnJvbSAnLi4vLi4vY29yZS9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IElSYXljYXN0T3B0aW9ucywgSVBoeXNpY3NXb3JsZCB9IGZyb20gJy4uL3NwZWMvaS1waHlzaWNzLXdvcmxkJztcclxuaW1wb3J0IHsgUGh5c2ljc1JheVJlc3VsdCwgUGh5c2ljTWF0ZXJpYWwgfSBmcm9tICcuLi9mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBOb2RlLCBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBBbW1vSW5zdGFuY2UgfSBmcm9tICcuL2FtbW8taW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBBbW1vQ29sbGlzaW9uRmlsdGVyR3JvdXBzLCBBbW1vRGlzcGF0Y2hlckZsYWdzIH0gZnJvbSAnLi9hbW1vLWVudW0nO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgvdHlwZS1kZWZpbmUnO1xyXG5pbXBvcnQgeyBBbW1vQ29udGFjdEVxdWF0aW9uIH0gZnJvbSAnLi9hbW1vLWNvbnRhY3QtZXF1YXRpb24nO1xyXG5pbXBvcnQgeyBBbW1vQ29uc3RyYWludCB9IGZyb20gJy4vY29uc3RyYWludHMvYW1tby1jb25zdHJhaW50JztcclxuXHJcbmNvbnN0IGNvbnRhY3RzUG9vbDogQW1tb0NvbnRhY3RFcXVhdGlvbltdID0gW107XHJcbmNvbnN0IHYzXzAgPSBDQ19WM18wO1xyXG5jb25zdCB2M18xID0gQ0NfVjNfMTtcclxuXHJcbmV4cG9ydCBjbGFzcyBBbW1vV29ybGQgaW1wbGVtZW50cyBJUGh5c2ljc1dvcmxkIHtcclxuXHJcbiAgICBzZXRBbGxvd1NsZWVwICh2OiBib29sZWFuKSB7IH07XHJcbiAgICBzZXREZWZhdWx0TWF0ZXJpYWwgKHY6IFBoeXNpY01hdGVyaWFsKSB7IH07XHJcblxyXG4gICAgc2V0R3Jhdml0eSAoZ3Jhdml0eTogSVZlYzNMaWtlKSB7XHJcbiAgICAgICAgY29jb3MyQW1tb1ZlYzModGhpcy5fYnRHcmF2aXR5LCBncmF2aXR5KTtcclxuICAgICAgICB0aGlzLl9idFdvcmxkLnNldEdyYXZpdHkodGhpcy5fYnRHcmF2aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW1wbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J0V29ybGQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfYnRXb3JsZDogQW1tby5idERpc2NyZXRlRHluYW1pY3NXb3JsZDtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgX2J0QnJvYWRwaGFzZTogQW1tby5idERidnRCcm9hZHBoYXNlO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfYnRTb2x2ZXI6IEFtbW8uYnRTZXF1ZW50aWFsSW1wdWxzZUNvbnN0cmFpbnRTb2x2ZXI7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9idERpc3BhdGNoZXI6IEFtbW8uYnRDb2xsaXNpb25EaXNwYXRjaGVyO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfYnRHcmF2aXR5OiBBbW1vLmJ0VmVjdG9yMztcclxuXHJcbiAgICByZWFkb25seSBib2RpZXM6IEFtbW9TaGFyZWRCb2R5W10gPSBbXTtcclxuICAgIHJlYWRvbmx5IGdob3N0czogQW1tb1NoYXJlZEJvZHlbXSA9IFtdO1xyXG4gICAgcmVhZG9ubHkgY29uc3RyYWludHM6IEFtbW9Db25zdHJhaW50W10gPSBbXTtcclxuICAgIHJlYWRvbmx5IHRyaWdnZXJBcnJheU1hdCA9IG5ldyBBcnJheUNvbGxpc2lvbk1hdHJpeCgpO1xyXG4gICAgcmVhZG9ubHkgY29sbGlzaW9uQXJyYXlNYXQgPSBuZXcgQXJyYXlDb2xsaXNpb25NYXRyaXgoKTtcclxuICAgIHJlYWRvbmx5IGNvbnRhY3RzRGljID0gbmV3IFR1cGxlRGljdGlvbmFyeSgpO1xyXG4gICAgcmVhZG9ubHkgb2xkQ29udGFjdHNEaWMgPSBuZXcgVHVwbGVEaWN0aW9uYXJ5KCk7XHJcblxyXG4gICAgcmVhZG9ubHkgY2xvc2VIaXRDQiA9IG5ldyBBbW1vLkNsb3Nlc3RSYXlSZXN1bHRDYWxsYmFjayhuZXcgQW1tby5idFZlY3RvcjMoKSwgbmV3IEFtbW8uYnRWZWN0b3IzKCkpO1xyXG4gICAgcmVhZG9ubHkgYWxsSGl0c0NCID0gbmV3IEFtbW8uQWxsSGl0c1JheVJlc3VsdENhbGxiYWNrKG5ldyBBbW1vLmJ0VmVjdG9yMygpLCBuZXcgQW1tby5idFZlY3RvcjMoKSk7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKG9wdGlvbnM/OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBjb2xsaXNpb25Db25maWd1cmF0aW9uID0gbmV3IEFtbW8uYnREZWZhdWx0Q29sbGlzaW9uQ29uZmlndXJhdGlvbigpO1xyXG4gICAgICAgIHRoaXMuX2J0RGlzcGF0Y2hlciA9IG5ldyBBbW1vLmJ0Q29sbGlzaW9uRGlzcGF0Y2hlcihjb2xsaXNpb25Db25maWd1cmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9idERpc3BhdGNoZXIuc2V0RGlzcGF0Y2hlckZsYWdzKEFtbW9EaXNwYXRjaGVyRmxhZ3MuQ0RfU1RBVElDX1NUQVRJQ19SRVBPUlRFRCk7XHJcbiAgICAgICAgdGhpcy5fYnRCcm9hZHBoYXNlID0gbmV3IEFtbW8uYnREYnZ0QnJvYWRwaGFzZSgpO1xyXG4gICAgICAgIHRoaXMuX2J0U29sdmVyID0gbmV3IEFtbW8uYnRTZXF1ZW50aWFsSW1wdWxzZUNvbnN0cmFpbnRTb2x2ZXIoKTtcclxuICAgICAgICB0aGlzLl9idFdvcmxkID0gbmV3IEFtbW8uYnREaXNjcmV0ZUR5bmFtaWNzV29ybGQodGhpcy5fYnREaXNwYXRjaGVyLCB0aGlzLl9idEJyb2FkcGhhc2UsIHRoaXMuX2J0U29sdmVyLCBjb2xsaXNpb25Db25maWd1cmF0aW9uKTtcclxuICAgICAgICB0aGlzLl9idEdyYXZpdHkgPSBuZXcgQW1tby5idFZlY3RvcjMoMCwgLTEwLCAwKTtcclxuICAgICAgICB0aGlzLl9idFdvcmxkLnNldEdyYXZpdHkodGhpcy5fYnRHcmF2aXR5KTtcclxuICAgIH1cclxuXHJcbiAgICBzdGVwIChkZWx0YVRpbWU6IG51bWJlciwgdGltZVNpbmNlTGFzdENhbGxlZD86IG51bWJlciwgbWF4U3ViU3RlcDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIGlmICh0aGlzLmJvZGllcy5sZW5ndGggPT0gMCAmJiB0aGlzLmdob3N0cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgIGlmICh0aW1lU2luY2VMYXN0Q2FsbGVkID09IHVuZGVmaW5lZCkgdGltZVNpbmNlTGFzdENhbGxlZCA9IGRlbHRhVGltZTtcclxuICAgICAgICB0aGlzLl9idFdvcmxkLnN0ZXBTaW11bGF0aW9uKHRpbWVTaW5jZUxhc3RDYWxsZWQsIG1heFN1YlN0ZXAsIGRlbHRhVGltZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5ib2RpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5ib2RpZXNbaV0uc3luY1BoeXNpY3NUb1NjZW5lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN5bmNTY2VuZVRvUGh5c2ljcyAoKTogdm9pZCB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmdob3N0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmdob3N0c1tpXS51cGRhdGVEaXJ0eSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdob3N0c1tpXS5zeW5jU2NlbmVUb0dob3N0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnVwZGF0ZURpcnR5KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzW2ldLnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByYXljYXN0ICh3b3JsZFJheTogcmF5LCBvcHRpb25zOiBJUmF5Y2FzdE9wdGlvbnMsIHBvb2w6IFJlY3ljbGVQb29sPFBoeXNpY3NSYXlSZXN1bHQ+LCByZXN1bHRzOiBQaHlzaWNzUmF5UmVzdWx0W10pOiBib29sZWFuIHtcclxuICAgICAgICBsZXQgZnJvbSA9IGNvY29zMkFtbW9WZWMzKHRoaXMuYWxsSGl0c0NCLm1fcmF5RnJvbVdvcmxkLCB3b3JsZFJheS5vKTtcclxuICAgICAgICB3b3JsZFJheS5jb21wdXRlSGl0KHYzXzAsIG9wdGlvbnMubWF4RGlzdGFuY2UpO1xyXG4gICAgICAgIGxldCB0byA9IGNvY29zMkFtbW9WZWMzKHRoaXMuYWxsSGl0c0NCLm1fcmF5VG9Xb3JsZCwgdjNfMCk7XHJcblxyXG4gICAgICAgIHRoaXMuYWxsSGl0c0NCLm1fY29sbGlzaW9uRmlsdGVyR3JvdXAgPSAtMTtcclxuICAgICAgICB0aGlzLmFsbEhpdHNDQi5tX2NvbGxpc2lvbkZpbHRlck1hc2sgPSBvcHRpb25zLm1hc2s7XHJcbiAgICAgICAgdGhpcy5hbGxIaXRzQ0IubV9jbG9zZXN0SGl0RnJhY3Rpb24gPSAxO1xyXG4gICAgICAgIHRoaXMuYWxsSGl0c0NCLm1fc2hhcGVQYXJ0ID0gLTE7XHJcbiAgICAgICAgKHRoaXMuYWxsSGl0c0NCLm1fY29sbGlzaW9uT2JqZWN0IGFzIGFueSkgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuYWxsSGl0c0NCLm1fc2hhcGVQYXJ0cy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuYWxsSGl0c0NCLm1faGl0RnJhY3Rpb25zLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5hbGxIaXRzQ0IubV9jb2xsaXNpb25PYmplY3RzLmNsZWFyKCk7XHJcbiAgICAgICAgLy8gVE9ETzogdHlwaW5nXHJcbiAgICAgICAgY29uc3QgaHAgPSAodGhpcy5hbGxIaXRzQ0IubV9oaXRQb2ludFdvcmxkIGFzIGFueSk7XHJcbiAgICAgICAgY29uc3QgaG4gPSAodGhpcy5hbGxIaXRzQ0IubV9oaXROb3JtYWxXb3JsZCBhcyBhbnkpO1xyXG4gICAgICAgIGhwLmNsZWFyKCk7XHJcbiAgICAgICAgaG4uY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9idFdvcmxkLnJheVRlc3QoZnJvbSwgdG8sIHRoaXMuYWxsSGl0c0NCKTtcclxuICAgICAgICBpZiAodGhpcy5hbGxIaXRzQ0IuaGFzSGl0KCkpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIG4gPSB0aGlzLmFsbEhpdHNDQi5tX2NvbGxpc2lvbk9iamVjdHMuc2l6ZSgpOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBidE9iaiA9IHRoaXMuYWxsSGl0c0NCLm1fY29sbGlzaW9uT2JqZWN0cy5hdChpKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJ0Q3MgPSBidE9iai5nZXRDb2xsaXNpb25TaGFwZSgpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlOiBBbW1vU2hhcGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnRDcy5pc0NvbXBvdW5kKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzaGFwZUluZGV4ID0gdGhpcy5hbGxIaXRzQ0IubV9zaGFwZVBhcnRzLmF0KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYnRPYmouZ2V0VXNlckluZGV4KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2hhcmVkID0gQW1tb0luc3RhbmNlLmJvZHlBbmRHaG9zdHNbJ0tFWScgKyBpbmRleF07XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUgPSBzaGFyZWQud3JhcHBlZFNoYXBlc1tzaGFwZUluZGV4XTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUgPSBidENzWyd3cmFwcGVkJ107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBhbW1vMkNvY29zVmVjMyh2M18wLCBocC5hdChpKSk7XHJcbiAgICAgICAgICAgICAgICBhbW1vMkNvY29zVmVjMyh2M18xLCBobi5hdChpKSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFZlYzMuZGlzdGFuY2Uod29ybGRSYXkubywgdjNfMCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByID0gcG9vbC5hZGQoKTtcclxuICAgICAgICAgICAgICAgIHIuX2Fzc2lnbih2M18wLCBkaXN0YW5jZSwgc2hhcGUuY29sbGlkZXIsIHYzXzEpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKHIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSYXkgY2FzdCwgYW5kIHJldHVybiBpbmZvcm1hdGlvbiBvZiB0aGUgY2xvc2VzdCBoaXQuXHJcbiAgICAgKiBAcmV0dXJuIFRydWUgaWYgYW55IGJvZHkgd2FzIGhpdC5cclxuICAgICAqL1xyXG4gICAgcmF5Y2FzdENsb3Nlc3QgKHdvcmxkUmF5OiByYXksIG9wdGlvbnM6IElSYXljYXN0T3B0aW9ucywgcmVzdWx0OiBQaHlzaWNzUmF5UmVzdWx0KTogYm9vbGVhbiB7XHJcbiAgICAgICAgbGV0IGZyb20gPSBjb2NvczJBbW1vVmVjMyh0aGlzLmNsb3NlSGl0Q0IubV9yYXlGcm9tV29ybGQsIHdvcmxkUmF5Lm8pO1xyXG4gICAgICAgIHdvcmxkUmF5LmNvbXB1dGVIaXQodjNfMCwgb3B0aW9ucy5tYXhEaXN0YW5jZSk7XHJcbiAgICAgICAgbGV0IHRvID0gY29jb3MyQW1tb1ZlYzModGhpcy5jbG9zZUhpdENCLm1fcmF5VG9Xb3JsZCwgdjNfMCk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xvc2VIaXRDQi5tX2NvbGxpc2lvbkZpbHRlckdyb3VwID0gLTE7XHJcbiAgICAgICAgdGhpcy5jbG9zZUhpdENCLm1fY29sbGlzaW9uRmlsdGVyTWFzayA9IG9wdGlvbnMubWFzaztcclxuICAgICAgICB0aGlzLmNsb3NlSGl0Q0IubV9jbG9zZXN0SGl0RnJhY3Rpb24gPSAxO1xyXG4gICAgICAgICh0aGlzLmNsb3NlSGl0Q0IubV9jb2xsaXNpb25PYmplY3QgYXMgYW55KSA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX2J0V29ybGQucmF5VGVzdChmcm9tLCB0bywgdGhpcy5jbG9zZUhpdENCKTtcclxuICAgICAgICBpZiAodGhpcy5jbG9zZUhpdENCLmhhc0hpdCgpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ0T2JqID0gdGhpcy5jbG9zZUhpdENCLm1fY29sbGlzaW9uT2JqZWN0O1xyXG4gICAgICAgICAgICBjb25zdCBidENzID0gYnRPYmouZ2V0Q29sbGlzaW9uU2hhcGUoKTtcclxuICAgICAgICAgICAgbGV0IHNoYXBlOiBBbW1vU2hhcGU7XHJcbiAgICAgICAgICAgIGlmIChidENzLmlzQ29tcG91bmQoKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBidE9iai5nZXRVc2VySW5kZXgoKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNoYXJlZCA9IEFtbW9JbnN0YW5jZS5ib2R5QW5kR2hvc3RzWydLRVknICsgaW5kZXhdO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgc2hhcGVJbmRleCA9IHRoaXMuY2xvc2VIaXRDQi5tX3NoYXBlUGFydDtcclxuICAgICAgICAgICAgICAgIHNoYXBlID0gc2hhcmVkLndyYXBwZWRTaGFwZXNbc2hhcGVJbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzaGFwZSA9IGJ0Q3NbJ3dyYXBwZWQnXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBhbW1vMkNvY29zVmVjMyh2M18wLCB0aGlzLmNsb3NlSGl0Q0IubV9oaXRQb2ludFdvcmxkKTtcclxuICAgICAgICAgICAgYW1tbzJDb2Nvc1ZlYzModjNfMSwgdGhpcy5jbG9zZUhpdENCLm1faGl0Tm9ybWFsV29ybGQpO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IFZlYzMuZGlzdGFuY2Uod29ybGRSYXkubywgdjNfMCk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5fYXNzaWduKHYzXzAsIGRpc3RhbmNlLCBzaGFwZS5jb2xsaWRlciwgdjNfMSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2hhcmVkQm9keSAobm9kZTogTm9kZSwgd3JhcHBlZEJvZHk/OiBBbW1vUmlnaWRCb2R5KSB7XHJcbiAgICAgICAgcmV0dXJuIEFtbW9TaGFyZWRCb2R5LmdldFNoYXJlZEJvZHkobm9kZSwgdGhpcywgd3JhcHBlZEJvZHkpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFNoYXJlZEJvZHkgKHNoYXJlZEJvZHk6IEFtbW9TaGFyZWRCb2R5KSB7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuYm9kaWVzLmluZGV4T2Yoc2hhcmVkQm9keSk7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnB1c2goc2hhcmVkQm9keSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0V29ybGQuYWRkUmlnaWRCb2R5KHNoYXJlZEJvZHkuYm9keSwgc2hhcmVkQm9keS5jb2xsaXNpb25GaWx0ZXJHcm91cCwgc2hhcmVkQm9keS5jb2xsaXNpb25GaWx0ZXJNYXNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlU2hhcmVkQm9keSAoc2hhcmVkQm9keTogQW1tb1NoYXJlZEJvZHkpIHtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5ib2RpZXMuaW5kZXhPZihzaGFyZWRCb2R5KTtcclxuICAgICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYm9kaWVzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgdGhpcy5fYnRXb3JsZC5yZW1vdmVSaWdpZEJvZHkoc2hhcmVkQm9keS5ib2R5KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkR2hvc3RPYmplY3QgKHNoYXJlZEJvZHk6IEFtbW9TaGFyZWRCb2R5KSB7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuZ2hvc3RzLmluZGV4T2Yoc2hhcmVkQm9keSk7XHJcbiAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2hvc3RzLnB1c2goc2hhcmVkQm9keSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0V29ybGQuYWRkQ29sbGlzaW9uT2JqZWN0KHNoYXJlZEJvZHkuZ2hvc3QsIHNoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyR3JvdXAsIHNoYXJlZEJvZHkuY29sbGlzaW9uRmlsdGVyTWFzayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUdob3N0T2JqZWN0IChzaGFyZWRCb2R5OiBBbW1vU2hhcmVkQm9keSkge1xyXG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLmdob3N0cy5pbmRleE9mKHNoYXJlZEJvZHkpO1xyXG4gICAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5naG9zdHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9idFdvcmxkLnJlbW92ZUNvbGxpc2lvbk9iamVjdChzaGFyZWRCb2R5Lmdob3N0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29uc3RyYWludCAoY29uc3RyYWludDogQW1tb0NvbnN0cmFpbnQpIHtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5jb25zdHJhaW50cy5pbmRleE9mKGNvbnN0cmFpbnQpO1xyXG4gICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnN0cmFpbnRzLnB1c2goY29uc3RyYWludCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J0V29ybGQuYWRkQ29uc3RyYWludChjb25zdHJhaW50LmltcGwsICFjb25zdHJhaW50LmNvbnN0cmFpbnQuZW5hYmxlQ29sbGlzaW9uKTtcclxuICAgICAgICAgICAgY29uc3RyYWludC5pbmRleCA9IGk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbnN0cmFpbnQgKGNvbnN0cmFpbnQ6IEFtbW9Db25zdHJhaW50KSB7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuY29uc3RyYWludHMuaW5kZXhPZihjb25zdHJhaW50KTtcclxuICAgICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29uc3RyYWludHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICB0aGlzLl9idFdvcmxkLnJlbW92ZUNvbnN0cmFpbnQoY29uc3RyYWludC5pbXBsKTtcclxuICAgICAgICAgICAgY29uc3RyYWludC5pbmRleCA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVDb2xsaXNpb25NYXRyaXggKGdyb3VwOiBudW1iZXIsIG1hc2s6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5naG9zdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZyA9IHRoaXMuZ2hvc3RzW2ldO1xyXG4gICAgICAgICAgICBpZiAoZy5jb2xsaXNpb25GaWx0ZXJHcm91cCA9PSBncm91cCkge1xyXG4gICAgICAgICAgICAgICAgZy5jb2xsaXNpb25GaWx0ZXJNYXNrID0gbWFzaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuYm9kaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGIgPSB0aGlzLmJvZGllc1tpXTtcclxuICAgICAgICAgICAgaWYgKGIuY29sbGlzaW9uRmlsdGVyR3JvdXAgPT0gZ3JvdXApIHtcclxuICAgICAgICAgICAgICAgIGIuY29sbGlzaW9uRmlsdGVyTWFzayA9IG1hc2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZW1pdEV2ZW50cyAoKSB7XHJcbiAgICAgICAgY29uc3QgbnVtTWFuaWZvbGRzID0gdGhpcy5fYnREaXNwYXRjaGVyLmdldE51bU1hbmlmb2xkcygpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtTWFuaWZvbGRzOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbWFuaWZvbGQgPSB0aGlzLl9idERpc3BhdGNoZXIuZ2V0TWFuaWZvbGRCeUluZGV4SW50ZXJuYWwoaSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJvZHkwID0gbWFuaWZvbGQuZ2V0Qm9keTAoKTtcclxuICAgICAgICAgICAgY29uc3QgYm9keTEgPSBtYW5pZm9sZC5nZXRCb2R5MSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFBbW1vWydDQ19DT05GSUcnXVsnZW1pdFN0YXRpY0NvbGxpc2lvbiddICYmIGJvZHkwLmlzU3RhdGljT2JqZWN0KCkgJiYgYm9keTEuaXNTdGF0aWNPYmplY3QoKSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgLy9UT0RPOiBTVVBQT1JUIENIQVJBQ1RFUiBFVkVOVFxyXG4gICAgICAgICAgICBpZiAoYm9keTBbJ3VzZUNoYXJhY3RlciddIHx8IGJvZHkxWyd1c2VDaGFyYWN0ZXInXSlcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgaXNVc2VDQ0QgPSBib2R5MFsndXNlQ0NEJ10gfHwgYm9keTFbJ3VzZUNDRCddO1xyXG4gICAgICAgICAgICBjb25zdCBudW1Db250YWN0cyA9IG1hbmlmb2xkLmdldE51bUNvbnRhY3RzKCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnVtQ29udGFjdHM7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFuaWZvbGRQb2ludDogQW1tby5idE1hbmlmb2xkUG9pbnQgPSBtYW5pZm9sZC5nZXRDb250YWN0UG9pbnQoaik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gbWFuaWZvbGRQb2ludC5nZXREaXN0YW5jZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGQgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHMwID0gbWFuaWZvbGRQb2ludC5nZXRTaGFwZTAoKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzMSA9IG1hbmlmb2xkUG9pbnQuZ2V0U2hhcGUxKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHNoYXBlMDogQW1tb1NoYXBlO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGFwZTE6IEFtbW9TaGFwZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNVc2VDQ0QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJvZHkwWyd1c2VDQ0QnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNiID0gKGJvZHkwWyd3cmFwcGVkJ10gYXMgQW1tb1JpZ2lkQm9keSkuc2hhcmVkQm9keTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXNiKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMCA9IGFzYi5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidFNoYXBlMCA9IGJvZHkwLmdldENvbGxpc2lvblNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnRTaGFwZTAuaXNDb21wb3VuZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogU1VQUE9SVCBDT01QT1VORCBDT0xMSVNJT04gV0lUSCBDQ0RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUwID0gKGJ0U2hhcGUwIGFzIGFueSkud3JhcHBlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJvZHkxWyd1c2VDQ0QnXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYXNiID0gKGJvZHkxWyd3cmFwcGVkJ10gYXMgQW1tb1JpZ2lkQm9keSkuc2hhcmVkQm9keTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghYXNiKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMSA9IGFzYi5ib2R5U3RydWN0LndyYXBwZWRTaGFwZXNbMF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBidFNoYXBlMSA9IGJvZHkxLmdldENvbGxpc2lvblNoYXBlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYnRTaGFwZTEuaXNDb21wb3VuZCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzogU1VQUE9SVCBDT01QT1VORCBDT0xMSVNJT04gV0lUSCBDQ0RcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUxID0gKGJ0U2hhcGUxIGFzIGFueSkud3JhcHBlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzMC5pc0NvbXBvdW5kKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbSA9IEFtbW8uY2FzdE9iamVjdChzMCwgQW1tby5idENvbXBvdW5kU2hhcGUpIGFzIEFtbW8uYnRDb21wb3VuZFNoYXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUwID0gKGNvbS5nZXRDaGlsZFNoYXBlKG1hbmlmb2xkUG9pbnQubV9pbmRleDApIGFzIGFueSkud3JhcHBlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMCA9IChzMCBhcyBhbnkpLndyYXBwZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzMS5pc0NvbXBvdW5kKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGNvbSA9IEFtbW8uY2FzdE9iamVjdChzMSwgQW1tby5idENvbXBvdW5kU2hhcGUpIGFzIEFtbW8uYnRDb21wb3VuZFNoYXBlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUxID0gKGNvbS5nZXRDaGlsZFNoYXBlKG1hbmlmb2xkUG9pbnQubV9pbmRleDEpIGFzIGFueSkud3JhcHBlZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMSA9IChzMSBhcyBhbnkpLndyYXBwZWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGFwZTAuY29sbGlkZXIubmVlZFRyaWdnZXJFdmVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTEuY29sbGlkZXIubmVlZFRyaWdnZXJFdmVudCB8fFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZTAuY29sbGlkZXIubmVlZENvbGxpc2lvbkV2ZW50IHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMS5jb2xsaWRlci5uZWVkQ29sbGlzaW9uRXZlbnRcclxuICAgICAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY3VycmVudCBjb250YWN0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jb250YWN0c0RpYy5nZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQpIGFzIGFueTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0ZW0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbSA9IHRoaXMuY29udGFjdHNEaWMuc2V0KHNoYXBlMC5pZCwgc2hhcGUxLmlkLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUwOiBzaGFwZTAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYXBlMTogc2hhcGUxLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0czogW10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltcGw6IG1hbmlmb2xkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtLmNvbnRhY3RzLnB1c2gobWFuaWZvbGRQb2ludCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBpcyBlbnRlciBvciBzdGF5XHJcbiAgICAgICAgbGV0IGRpY0wgPSB0aGlzLmNvbnRhY3RzRGljLmdldExlbmd0aCgpO1xyXG4gICAgICAgIHdoaWxlIChkaWNMLS0pIHtcclxuICAgICAgICAgICAgY29udGFjdHNQb29sLnB1c2guYXBwbHkoY29udGFjdHNQb29sLCBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cyBhcyBBbW1vQ29udGFjdEVxdWF0aW9uW10pO1xyXG4gICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gdGhpcy5jb250YWN0c0RpYy5nZXRLZXlCeUluZGV4KGRpY0wpO1xyXG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5jb250YWN0c0RpYy5nZXREYXRhQnlLZXkoa2V5KSBhcyBhbnk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlMDogQW1tb1NoYXBlID0gZGF0YS5zaGFwZTA7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlMTogQW1tb1NoYXBlID0gZGF0YS5zaGFwZTE7XHJcbiAgICAgICAgICAgIHRoaXMub2xkQ29udGFjdHNEaWMuc2V0KHNoYXBlMC5pZCwgc2hhcGUxLmlkLCBkYXRhKTtcclxuICAgICAgICAgICAgY29uc3QgY29sbGlkZXIwID0gc2hhcGUwLmNvbGxpZGVyO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xsaWRlcjEgPSBzaGFwZTEuY29sbGlkZXI7XHJcbiAgICAgICAgICAgIGlmIChjb2xsaWRlcjAgJiYgY29sbGlkZXIxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpc1RyaWdnZXIgPSBjb2xsaWRlcjAuaXNUcmlnZ2VyIHx8IGNvbGxpZGVyMS5pc1RyaWdnZXI7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpZ2dlckFycmF5TWF0LmdldChzaGFwZTAuaWQsIHNoYXBlMS5pZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUgPSAnb25UcmlnZ2VyU3RheSc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVHJpZ2dlckV2ZW50T2JqZWN0LnR5cGUgPSAnb25UcmlnZ2VyRW50ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJBcnJheU1hdC5zZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QuaW1wbCA9IGRhdGEuaW1wbDtcclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gY29sbGlkZXIwO1xyXG4gICAgICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gY29sbGlkZXIxO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMC5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gY29sbGlkZXIxO1xyXG4gICAgICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gY29sbGlkZXIwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMS5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5MCA9IGNvbGxpZGVyMC5hdHRhY2hlZFJpZ2lkQm9keTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBib2R5MSA9IGNvbGxpZGVyMS5hdHRhY2hlZFJpZ2lkQm9keTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYm9keTAgJiYgYm9keTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJvZHkwLmlzU2xlZXBpbmcgJiYgYm9keTEuaXNTbGVlcGluZykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChib2R5MCA9PSBudWxsICYmIGJvZHkxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChib2R5MS5pc1NsZWVwaW5nKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGJvZHkxID09IG51bGwgJiYgYm9keTApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGJvZHkwLmlzU2xlZXBpbmcpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb2xsaXNpb25BcnJheU1hdC5nZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUgPSAnb25Db2xsaXNpb25TdGF5JztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC50eXBlID0gJ29uQ29sbGlzaW9uRW50ZXInO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkFycmF5TWF0LnNldChzaGFwZTAuaWQsIHNoYXBlMS5pZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuY29udGFjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgY3EgPSBkYXRhLmNvbnRhY3RzW2ldIGFzIEFtbW8uYnRNYW5pZm9sZFBvaW50O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY29udGFjdHNQb29sLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBjb250YWN0c1Bvb2wucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjIS5pbXBsID0gY3E7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cy5wdXNoKGMhKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBuZXcgQW1tb0NvbnRhY3RFcXVhdGlvbihDb2xsaXNpb25FdmVudE9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjLmltcGwgPSBjcTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LmNvbnRhY3RzLnB1c2goYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3QuaW1wbCA9IGRhdGEuaW1wbDtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5zZWxmQ29sbGlkZXIgPSBjb2xsaWRlcjA7XHJcbiAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IGNvbGxpZGVyMTtcclxuICAgICAgICAgICAgICAgICAgICBjb2xsaWRlcjAuZW1pdChDb2xsaXNpb25FdmVudE9iamVjdC50eXBlLCBDb2xsaXNpb25FdmVudE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IGNvbGxpZGVyMTtcclxuICAgICAgICAgICAgICAgICAgICBDb2xsaXNpb25FdmVudE9iamVjdC5vdGhlckNvbGxpZGVyID0gY29sbGlkZXIwO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMS5lbWl0KENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUsIENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vbGRDb250YWN0c0RpYy5nZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm9sZENvbnRhY3RzRGljLnNldChzaGFwZTAuaWQsIHNoYXBlMS5pZCwgZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlzIGV4aXRcclxuICAgICAgICBsZXQgb2xkRGljTCA9IHRoaXMub2xkQ29udGFjdHNEaWMuZ2V0TGVuZ3RoKCk7XHJcbiAgICAgICAgd2hpbGUgKG9sZERpY0wtLSkge1xyXG4gICAgICAgICAgICBsZXQga2V5ID0gdGhpcy5vbGRDb250YWN0c0RpYy5nZXRLZXlCeUluZGV4KG9sZERpY0wpO1xyXG4gICAgICAgICAgICBsZXQgZGF0YSA9IHRoaXMub2xkQ29udGFjdHNEaWMuZ2V0RGF0YUJ5S2V5KGtleSkgYXMgYW55O1xyXG4gICAgICAgICAgICBjb25zdCBzaGFwZTA6IEFtbW9TaGFwZSA9IGRhdGEuc2hhcGUwO1xyXG4gICAgICAgICAgICBjb25zdCBzaGFwZTE6IEFtbW9TaGFwZSA9IGRhdGEuc2hhcGUxO1xyXG4gICAgICAgICAgICBjb25zdCBjb2xsaWRlcjAgPSBzaGFwZTAuY29sbGlkZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbGxpZGVyMSA9IHNoYXBlMS5jb2xsaWRlcjtcclxuICAgICAgICAgICAgaWYgKGNvbGxpZGVyMCAmJiBjb2xsaWRlcjEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGlzVHJpZ2dlciA9IGNvbGxpZGVyMC5pc1RyaWdnZXIgfHwgY29sbGlkZXIxLmlzVHJpZ2dlcjtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhY3RzRGljLmdldERhdGFCeUtleShrZXkpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNUcmlnZ2VyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnRyaWdnZXJBcnJheU1hdC5nZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3QudHlwZSA9ICdvblRyaWdnZXJFeGl0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5zZWxmQ29sbGlkZXIgPSBjb2xsaWRlcjA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IGNvbGxpZGVyMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMC5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRyaWdnZXJFdmVudE9iamVjdC5zZWxmQ29sbGlkZXIgPSBjb2xsaWRlcjE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBUcmlnZ2VyRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IGNvbGxpZGVyMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMS5lbWl0KFRyaWdnZXJFdmVudE9iamVjdC50eXBlLCBUcmlnZ2VyRXZlbnRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlckFycmF5TWF0LnNldChzaGFwZTAuaWQsIHNoYXBlMS5pZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGRDb250YWN0c0RpYy5zZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY29sbGlzaW9uQXJyYXlNYXQuZ2V0KHNoYXBlMC5pZCwgc2hhcGUxLmlkKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFjdHNQb29sLnB1c2guYXBwbHkoY29udGFjdHNQb29sLCBDb2xsaXNpb25FdmVudE9iamVjdC5jb250YWN0cyBhcyBBbW1vQ29udGFjdEVxdWF0aW9uW10pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3QuY29udGFjdHMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuY29udGFjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBjcSA9IGRhdGEuY29udGFjdHNbaV0gYXMgQW1tby5idE1hbmlmb2xkUG9pbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbnRhY3RzUG9vbC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGMgPSBjb250YWN0c1Bvb2wucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGMhLmltcGwgPSBjcTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3QuY29udGFjdHMucHVzaChjISk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYyA9IG5ldyBBbW1vQ29udGFjdEVxdWF0aW9uKENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYy5pbXBsID0gY3E7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LmNvbnRhY3RzLnB1c2goYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUgPSAnb25Db2xsaXNpb25FeGl0JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0LnNlbGZDb2xsaWRlciA9IGNvbGxpZGVyMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvbGxpc2lvbkV2ZW50T2JqZWN0Lm90aGVyQ29sbGlkZXIgPSBjb2xsaWRlcjE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xsaWRlcjAuZW1pdChDb2xsaXNpb25FdmVudE9iamVjdC50eXBlLCBDb2xsaXNpb25FdmVudE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3Quc2VsZkNvbGxpZGVyID0gY29sbGlkZXIxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sbGlzaW9uRXZlbnRPYmplY3Qub3RoZXJDb2xsaWRlciA9IGNvbGxpZGVyMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbGxpZGVyMS5lbWl0KENvbGxpc2lvbkV2ZW50T2JqZWN0LnR5cGUsIENvbGxpc2lvbkV2ZW50T2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbGxpc2lvbkFycmF5TWF0LnNldChzaGFwZTAuaWQsIHNoYXBlMS5pZCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vbGRDb250YWN0c0RpYy5zZXQoc2hhcGUwLmlkLCBzaGFwZTEuaWQsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNvbnRhY3RzRGljLnJlc2V0KCk7XHJcbiAgICB9XHJcbn1cclxuIl19