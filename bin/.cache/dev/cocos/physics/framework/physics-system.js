(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/index.js", "./instance.js", "../../core/director.js", "../../core/components/index.js", "./assets/physic-material.js", "../../core/index.js", "./physics-ray-result.js", "../../core/default-constants.js", "../../core/global-exports.js", "./physics-selector.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/index.js"), require("./instance.js"), require("../../core/director.js"), require("../../core/components/index.js"), require("./assets/physic-material.js"), require("../../core/index.js"), require("./physics-ray-result.js"), require("../../core/default-constants.js"), require("../../core/global-exports.js"), require("./physics-selector.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.instance, global.director, global.index, global.physicMaterial, global.index, global.physicsRayResult, global.defaultConstants, global.globalExports, global.physicsSelector);
    global.physicsSystem = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _instance, _director, _index2, _physicMaterial, _index3, _physicsRayResult, _defaultConstants, _globalExports, _physicsSelector) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PhysicsSystem = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  var PhysicsGroup;

  (function (PhysicsGroup) {
    PhysicsGroup[PhysicsGroup["DEFAULT"] = 1] = "DEFAULT";
  })(PhysicsGroup || (PhysicsGroup = {}));

  (0, _index3.Enum)(PhysicsGroup);
  _globalExports.legacyCC.internal.PhysicsGroup = PhysicsGroup;

  var CollisionMatrix = function CollisionMatrix() {
    var _this = this;

    _classCallCheck(this, CollisionMatrix);

    this.updateArray = [];

    var _loop = function _loop(i) {
      var key = 1 << i;
      _this["_".concat(key)] = 0;
      Object.defineProperty(_this, key, {
        'get': function get() {
          return this["_".concat(key)];
        },
        'set': function set(v) {
          var self = this;

          if (self["_".concat(key)] != v) {
            self["_".concat(key)] = v;

            if (self.updateArray.indexOf(key) < 0) {
              self.updateArray.push(key);
            }
          }
        }
      });
    };

    for (var i = 0; i < 32; i++) {
      _loop(i);
    }

    this["_1"] = PhysicsGroup.DEFAULT;
  };
  /**
   * @en
   * Physics system.
   * @zh
   * 物理系统。
   */


  var PhysicsSystem = /*#__PURE__*/function (_System) {
    _inherits(PhysicsSystem, _System);

    _createClass(PhysicsSystem, [{
      key: "enable",

      /**
       * @en
       * Gets or sets whether the physical system is enabled, which can be used to pause or continue running the physical system.
       * @zh
       * 获取或设置是否启用物理系统，可以用于暂停或继续运行物理系统。
       */
      get: function get() {
        return this._enable;
      },
      set: function set(value) {
        this._enable = value;
      }
      /**
       * @zh
       * Gets or sets whether the physical system allows automatic sleep, which defaults to true.
       * @zh
       * 获取或设置物理系统是否允许自动休眠，默认为 true。
       */

    }, {
      key: "allowSleep",
      get: function get() {
        return this._allowSleep;
      },
      set: function set(v) {
        this._allowSleep = v;

        if (!_defaultConstants.EDITOR) {
          this.physicsWorld.setAllowSleep(v);
        }
      }
      /**
       * @en
       * Gets or sets the maximum number of simulated substeps per frame.
       * @zh
       * 获取或设置每帧模拟的最大子步数。
       */

    }, {
      key: "maxSubSteps",
      get: function get() {
        return this._maxSubSteps;
      },
      set: function set(value) {
        this._maxSubSteps = value;
      }
      /**
       * @en
       * Gets or sets the fixed delta time consumed by each simulation step.
       * @zh
       * 获取或设置每步模拟消耗的固定时间。
       */

    }, {
      key: "fixedTimeStep",
      get: function get() {
        return this._fixedTimeStep;
      },
      set: function set(value) {
        this._fixedTimeStep = value;
      }
      /**
       * @en
       * Gets or sets the value of gravity in the physical world, which defaults to (0, -10, 0).
       * @zh
       * 获取或设置物理世界的重力数值，默认为 (0, -10, 0)。
       */

    }, {
      key: "gravity",
      get: function get() {
        return this._gravity;
      },
      set: function set(gravity) {
        this._gravity.set(gravity);

        if (!_defaultConstants.EDITOR) {
          this.physicsWorld.setGravity(gravity);
        }
      }
      /**
       * @en
       * Gets or sets the default speed threshold for going to sleep.
       * @zh
       * 获取或设置进入休眠的默认速度临界值。
       */

    }, {
      key: "sleepThreshold",
      get: function get() {
        return this._sleepThreshold;
      },
      set: function set(v) {
        this._sleepThreshold = v;
      }
      /**
       * @en
       * Turn on or off the automatic simulation.
       * @zh
       * 获取或设置是否自动模拟。
       */

    }, {
      key: "autoSimulation",
      get: function get() {
        return this._autoSimulation;
      },
      set: function set(value) {
        this._autoSimulation = value;
      }
      /**
       * @en
       * Gets the global default physical material.
       * @zh
       * 获取全局的默认物理材质。
       */

    }, {
      key: "defaultMaterial",
      get: function get() {
        return this._material;
      }
      /**
       * @en
       * Gets the wrappered object of the physical world through which you can access the actual underlying object.
       * @zh
       * 获取物理世界的封装对象，通过它你可以访问到实际的底层对象。
       */

    }], [{
      key: "PHYSICS_NONE",
      get: function get() {
        return !_physicsSelector.physicsEngineId;
      }
    }, {
      key: "PHYSICS_BUILTIN",
      get: function get() {
        return _physicsSelector.physicsEngineId === 'builtin';
      }
    }, {
      key: "PHYSICS_CANNON",
      get: function get() {
        return _physicsSelector.physicsEngineId === 'cannon.js';
      }
    }, {
      key: "PHYSICS_AMMO",
      get: function get() {
        return _physicsSelector.physicsEngineId === 'ammo.js';
      }
      /**
       * @en
       * Gets the ID of the system.
       * @zh
       * 获取此系统的ID。
       */

    }, {
      key: "PhysicsGroup",

      /**
       * @en
       * Gets the predefined physics groups.
       * @zh
       * 获取预定义的物理分组。
       */
      get: function get() {
        return PhysicsGroup;
      }
      /**
       * @en
       * Gets the physical system instance.
       * @zh
       * 获取物理系统实例。
       */

    }, {
      key: "instance",
      get: function get() {
        if (_defaultConstants.DEBUG && (0, _instance.checkPhysicsModule)(PhysicsSystem._instance)) {
          return null;
        }

        return PhysicsSystem._instance;
      }
    }]);

    function PhysicsSystem() {
      var _this2;

      _classCallCheck(this, PhysicsSystem);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(PhysicsSystem).call(this));
      _this2.physicsWorld = void 0;
      _this2.raycastClosestResult = new _physicsRayResult.PhysicsRayResult();
      _this2.raycastResults = [];
      _this2.collisionMatrix = new CollisionMatrix();
      _this2.useCollisionMatrix = void 0;
      _this2.useNodeChains = void 0;
      _this2._enable = true;
      _this2._allowSleep = true;
      _this2._maxSubSteps = 1;
      _this2._subStepCount = 0;
      _this2._fixedTimeStep = 1.0 / 60.0;
      _this2._autoSimulation = true;
      _this2._accumulator = 0;
      _this2._sleepThreshold = 0.1;
      _this2._gravity = new _index.Vec3(0, -10, 0);
      _this2._material = new _physicMaterial.PhysicMaterial();
      _this2.raycastOptions = {
        'group': -1,
        'mask': -1,
        'queryTrigger': true,
        'maxDistance': 10000000
      };
      _this2.raycastResultPool = new _index3.RecyclePool(function () {
        return new _physicsRayResult.PhysicsRayResult();
      }, 1);
      var config = _index3.game.config ? _index3.game.config.physics : null;

      if (config) {
        _index.Vec3.copy(_this2._gravity, config.gravity);

        _this2._allowSleep = config.allowSleep;
        _this2._fixedTimeStep = config.fixedTimeStep;
        _this2._maxSubSteps = config.maxSubSteps;
        _this2._sleepThreshold = config.sleepThreshold;
        _this2.autoSimulation = config.autoSimulation;
        _this2.useNodeChains = config.useNodeChains;
        _this2.useCollisionMatrix = config.useCollsionMatrix;

        if (config.defaultMaterial) {
          _this2._material.friction = config.defaultMaterial.friction;
          _this2._material.rollingFriction = config.defaultMaterial.rollingFriction;
          _this2._material.spinningFriction = config.defaultMaterial.spinningFriction;
          _this2._material.restitution = config.defaultMaterial.restitution;
        }

        if (config.collisionMatrix) {
          for (var i in config.collisionMatrix) {
            var key = 1 << parseInt(i);
            _this2.collisionMatrix["_".concat(key)] = config.collisionMatrix[i];
          }
        }
      } else {
        _this2.useCollisionMatrix = false;
        _this2.useNodeChains = false;
      }

      _this2._material.on('physics_material_update', _this2._updateMaterial, _assertThisInitialized(_this2));

      _this2.physicsWorld = (0, _instance.createPhysicsWorld)();

      _this2.physicsWorld.setGravity(_this2._gravity);

      _this2.physicsWorld.setAllowSleep(_this2._allowSleep);

      _this2.physicsWorld.setDefaultMaterial(_this2._material);

      return _this2;
    }
    /**
     * @en
     * The lifecycle function is automatically executed after all components `update` and `lateUpadte` are executed.
     * @zh
     * 生命周期函数，在所有组件的`update`和`lateUpadte`执行完成后自动执行。
     * @param deltaTime the time since last frame.
     */


    _createClass(PhysicsSystem, [{
      key: "postUpdate",
      value: function postUpdate(deltaTime) {
        if (_defaultConstants.EDITOR && !this._executeInEditMode) {
          return;
        }

        if (!this._enable) {
          this.physicsWorld.syncSceneToPhysics();
          return;
        }

        if (this._autoSimulation) {
          this._subStepCount = 0;
          this._accumulator += deltaTime;

          _director.director.emit(_director.Director.EVENT_BEFORE_PHYSICS);

          while (this._subStepCount < this._maxSubSteps) {
            if (this._accumulator > this._fixedTimeStep) {
              this.updateCollisionMatrix();
              this.physicsWorld.syncSceneToPhysics();
              this.physicsWorld.step(this._fixedTimeStep);
              this._accumulator -= this._fixedTimeStep;
              this._subStepCount++;
              this.physicsWorld.emitEvents(); // TODO: nesting the dirty flag reset between the syncScenetoPhysics and the simulation to reduce calling syncScenetoPhysics.

              this.physicsWorld.syncSceneToPhysics();
            } else {
              this.physicsWorld.syncSceneToPhysics();
              break;
            }
          }

          _director.director.emit(_director.Director.EVENT_AFTER_PHYSICS);
        }
      }
      /**
       * @en
       * Reset the accumulator of time to given value.
       * @zh
       * 重置时间累积总量为给定值。
       */

    }, {
      key: "resetAccumulator",
      value: function resetAccumulator() {
        var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        this._accumulator = time;
      }
      /**
       * @en
       * Perform simulation steps for the physics world.
       * @zh
       * 执行物理世界的模拟步进。
       * @param fixedTimeStep
       */

    }, {
      key: "step",
      value: function step(fixedTimeStep, deltaTime, maxSubSteps) {
        this.physicsWorld.step(fixedTimeStep, deltaTime, maxSubSteps);
      }
      /**
       * @en
       * Sync the scene world transform changes to the physics world.
       * @zh
       * 同步场景世界的变化信息到物理世界中。
       */

    }, {
      key: "syncSceneToPhysics",
      value: function syncSceneToPhysics() {
        this.physicsWorld.syncSceneToPhysics();
      }
      /**
       * @en
       * Emit trigger and collision events.
       * @zh
       * 触发`trigger`和`collision`事件。
       */

    }, {
      key: "emitEvents",
      value: function emitEvents() {
        this.physicsWorld.emitEvents();
      }
      /**
       * @en
       * Updates the mask corresponding to the collision matrix for the lowLevel rigid-body instance.
       * Automatic execution during automatic simulation.
       * @zh
       * 更新底层实例对应于碰撞矩阵的掩码，开启自动模拟时会自动更新。
       */

    }, {
      key: "updateCollisionMatrix",
      value: function updateCollisionMatrix() {
        if (this.useCollisionMatrix) {
          var ua = this.collisionMatrix.updateArray;

          while (ua.length > 0) {
            var group = ua.pop();
            var mask = this.collisionMatrix[group];
            this.physicsWorld.updateCollisionMatrix(group, mask);
          }
        }
      }
      /**
       * @en
       * Reset the mask corresponding to all groups of the collision matrix to the given value, the default given value is' 0xffffffff '.
       * @zh
       * 重置碰撞矩阵所有分组对应掩码为给定值，默认给定值为`0xffffffff`。
       */

    }, {
      key: "resetCollisionMatrix",
      value: function resetCollisionMatrix() {
        var mask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0xffffffff;

        for (var i = 0; i < 32; i++) {
          var key = 1 << i;
          this.collisionMatrix["".concat(key)] = mask;
        }
      }
      /**
       * @en
       * Are collisions between `group1` and `group2`?
       * @zh
       * 两分组是否会产生碰撞？
       */

    }, {
      key: "isCollisionGroup",
      value: function isCollisionGroup(group1, group2) {
        var cm = this.collisionMatrix;
        var mask1 = cm[group1];
        var mask2 = cm[group2];

        if (_defaultConstants.DEBUG) {
          if (mask1 == undefined || mask2 == undefined) {
            (0, _index3.error)("[PHYSICS]: 'isCollisionGroup', the group do not exist in the collision matrix.");
            return false;
          }
        }

        return group1 & mask2 && group2 & mask1;
      }
      /**
       * @en
       * Sets whether collisions occur between `group1` and `group2`.
       * @zh
       * 设置两分组间是否产生碰撞。
       * @param collision is collision occurs?
       */

    }, {
      key: "setCollisionGroup",
      value: function setCollisionGroup(group1, group2) {
        var collision = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var cm = this.collisionMatrix;

        if (_defaultConstants.DEBUG) {
          if (cm[group1] == undefined || cm[group2] == undefined) {
            (0, _index3.error)("[PHYSICS]: 'setCollisionGroup', the group do not exist in the collision matrix.");
            return;
          }
        }

        if (collision) {
          cm[group1] |= group2;
          cm[group2] |= group1;
        } else {
          cm[group1] &= ~group2;
          cm[group2] &= ~group1;
        }
      }
      /**
       * @en
       * Collision detect all collider, and record all the detected results, through PhysicsSystem.Instance.RaycastResults access to the results.
       * @zh
       * 检测所有的碰撞盒，并记录所有被检测到的结果，通过 PhysicsSystem.instance.raycastResults 访问结果。
       * @param worldRay 世界空间下的一条射线
       * @param mask 掩码，默认为 0xffffffff
       * @param maxDistance 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
       * @param queryTrigger 是否检测触发器
       * @return boolean 表示是否有检测到碰撞盒
       */

    }, {
      key: "raycast",
      value: function raycast(worldRay) {
        var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xffffffff;
        var maxDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000000;
        var queryTrigger = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        this.updateCollisionMatrix();
        this.raycastResultPool.reset();
        this.raycastResults.length = 0;
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycast(worldRay, this.raycastOptions, this.raycastResultPool, this.raycastResults);
      }
      /**
       * @en
       * Collision detect all collider, and record and ray test results with the shortest distance by PhysicsSystem.Instance.RaycastClosestResult access to the results.
       * @zh
       * 检测所有的碰撞盒，并记录与射线距离最短的检测结果，通过 PhysicsSystem.instance.raycastClosestResult 访问结果。
       * @param worldRay 世界空间下的一条射线
       * @param mask 掩码，默认为 0xffffffff
       * @param maxDistance 最大检测距离，默认为 10000000，目前请勿传入 Infinity 或 Number.MAX_VALUE
       * @param queryTrigger 是否检测触发器
       * @return boolean 表示是否有检测到碰撞盒
       */

    }, {
      key: "raycastClosest",
      value: function raycastClosest(worldRay) {
        var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xffffffff;
        var maxDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10000000;
        var queryTrigger = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        this.updateCollisionMatrix();
        this.raycastOptions.mask = mask;
        this.raycastOptions.maxDistance = maxDistance;
        this.raycastOptions.queryTrigger = queryTrigger;
        return this.physicsWorld.raycastClosest(worldRay, this.raycastOptions, this.raycastClosestResult);
      }
    }, {
      key: "_updateMaterial",
      value: function _updateMaterial() {
        this.physicsWorld.setDefaultMaterial(this._material);
      }
    }]);

    return PhysicsSystem;
  }(_index2.System);

  _exports.PhysicsSystem = PhysicsSystem;
  PhysicsSystem.ID = 'PHYSICS';
  PhysicsSystem._instance = void 0;

  _director.director.once(_director.Director.EVENT_INIT, function () {
    initPhysicsSystem();
  });

  function initPhysicsSystem() {
    if (!PhysicsSystem.PHYSICS_NONE && !_defaultConstants.EDITOR) {
      var sys = new _globalExports.legacyCC.PhysicsSystem();
      _globalExports.legacyCC.PhysicsSystem._instance = sys;

      _director.director.registerSystem(PhysicsSystem.ID, sys, 0);
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3Mtc3lzdGVtLnRzIl0sIm5hbWVzIjpbIlBoeXNpY3NHcm91cCIsImxlZ2FjeUNDIiwiaW50ZXJuYWwiLCJDb2xsaXNpb25NYXRyaXgiLCJ1cGRhdGVBcnJheSIsImkiLCJrZXkiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsInYiLCJzZWxmIiwiaW5kZXhPZiIsInB1c2giLCJERUZBVUxUIiwiUGh5c2ljc1N5c3RlbSIsIl9lbmFibGUiLCJ2YWx1ZSIsIl9hbGxvd1NsZWVwIiwiRURJVE9SIiwicGh5c2ljc1dvcmxkIiwic2V0QWxsb3dTbGVlcCIsIl9tYXhTdWJTdGVwcyIsIl9maXhlZFRpbWVTdGVwIiwiX2dyYXZpdHkiLCJncmF2aXR5Iiwic2V0Iiwic2V0R3Jhdml0eSIsIl9zbGVlcFRocmVzaG9sZCIsIl9hdXRvU2ltdWxhdGlvbiIsIl9tYXRlcmlhbCIsInBoeXNpY3NFbmdpbmVJZCIsIkRFQlVHIiwiX2luc3RhbmNlIiwicmF5Y2FzdENsb3Nlc3RSZXN1bHQiLCJQaHlzaWNzUmF5UmVzdWx0IiwicmF5Y2FzdFJlc3VsdHMiLCJjb2xsaXNpb25NYXRyaXgiLCJ1c2VDb2xsaXNpb25NYXRyaXgiLCJ1c2VOb2RlQ2hhaW5zIiwiX3N1YlN0ZXBDb3VudCIsIl9hY2N1bXVsYXRvciIsIlZlYzMiLCJQaHlzaWNNYXRlcmlhbCIsInJheWNhc3RPcHRpb25zIiwicmF5Y2FzdFJlc3VsdFBvb2wiLCJSZWN5Y2xlUG9vbCIsImNvbmZpZyIsImdhbWUiLCJwaHlzaWNzIiwiY29weSIsImFsbG93U2xlZXAiLCJmaXhlZFRpbWVTdGVwIiwibWF4U3ViU3RlcHMiLCJzbGVlcFRocmVzaG9sZCIsImF1dG9TaW11bGF0aW9uIiwidXNlQ29sbHNpb25NYXRyaXgiLCJkZWZhdWx0TWF0ZXJpYWwiLCJmcmljdGlvbiIsInJvbGxpbmdGcmljdGlvbiIsInNwaW5uaW5nRnJpY3Rpb24iLCJyZXN0aXR1dGlvbiIsInBhcnNlSW50Iiwib24iLCJfdXBkYXRlTWF0ZXJpYWwiLCJzZXREZWZhdWx0TWF0ZXJpYWwiLCJkZWx0YVRpbWUiLCJfZXhlY3V0ZUluRWRpdE1vZGUiLCJzeW5jU2NlbmVUb1BoeXNpY3MiLCJkaXJlY3RvciIsImVtaXQiLCJEaXJlY3RvciIsIkVWRU5UX0JFRk9SRV9QSFlTSUNTIiwidXBkYXRlQ29sbGlzaW9uTWF0cml4Iiwic3RlcCIsImVtaXRFdmVudHMiLCJFVkVOVF9BRlRFUl9QSFlTSUNTIiwidGltZSIsInVhIiwibGVuZ3RoIiwiZ3JvdXAiLCJwb3AiLCJtYXNrIiwiZ3JvdXAxIiwiZ3JvdXAyIiwiY20iLCJtYXNrMSIsIm1hc2syIiwidW5kZWZpbmVkIiwiY29sbGlzaW9uIiwid29ybGRSYXkiLCJtYXhEaXN0YW5jZSIsInF1ZXJ5VHJpZ2dlciIsInJlc2V0IiwicmF5Y2FzdCIsInJheWNhc3RDbG9zZXN0IiwiU3lzdGVtIiwiSUQiLCJvbmNlIiwiRVZFTlRfSU5JVCIsImluaXRQaHlzaWNzU3lzdGVtIiwiUEhZU0lDU19OT05FIiwic3lzIiwicmVnaXN0ZXJTeXN0ZW0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BZ0JLQSxZOzthQUFBQSxZO0FBQUFBLElBQUFBLFksQ0FBQUEsWTtLQUFBQSxZLEtBQUFBLFk7O0FBR0wsb0JBQUtBLFlBQUw7QUFDQUMsMEJBQVNDLFFBQVQsQ0FBa0JGLFlBQWxCLEdBQWlDQSxZQUFqQzs7TUFFTUcsZSxHQUVGLDJCQUFlO0FBQUE7O0FBQUE7O0FBQUEsU0FEZkMsV0FDZSxHQURTLEVBQ1Q7O0FBQUEsK0JBQ0ZDLENBREU7QUFFUCxVQUFNQyxHQUFHLEdBQUcsS0FBS0QsQ0FBakI7QUFDQSxNQUFBLEtBQUksWUFBS0MsR0FBTCxFQUFKLEdBQWtCLENBQWxCO0FBQ0FDLE1BQUFBLE1BQU0sQ0FBQ0MsY0FBUCxDQUFzQixLQUF0QixFQUE0QkYsR0FBNUIsRUFBaUM7QUFDN0IsZUFBTyxlQUFZO0FBQUUsaUJBQU8sZ0JBQVNBLEdBQVQsRUFBUDtBQUF3QixTQURoQjtBQUU3QixlQUFPLGFBQVVHLENBQVYsRUFBcUI7QUFDeEIsY0FBTUMsSUFBSSxHQUFHLElBQWI7O0FBQ0EsY0FBSUEsSUFBSSxZQUFLSixHQUFMLEVBQUosSUFBbUJHLENBQXZCLEVBQTBCO0FBQ3RCQyxZQUFBQSxJQUFJLFlBQUtKLEdBQUwsRUFBSixHQUFrQkcsQ0FBbEI7O0FBQ0EsZ0JBQUlDLElBQUksQ0FBQ04sV0FBTCxDQUFpQk8sT0FBakIsQ0FBeUJMLEdBQXpCLElBQWdDLENBQXBDLEVBQXVDO0FBQ25DSSxjQUFBQSxJQUFJLENBQUNOLFdBQUwsQ0FBaUJRLElBQWpCLENBQXNCTixHQUF0QjtBQUNIO0FBQ0o7QUFDSjtBQVY0QixPQUFqQztBQUpPOztBQUNYLFNBQUssSUFBSUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUFBLFlBQXBCQSxDQUFvQjtBQWU1Qjs7QUFDRCxpQkFBYUwsWUFBWSxDQUFDYSxPQUExQjtBQUNILEc7QUFHTDs7Ozs7Ozs7TUFNYUMsYTs7Ozs7O0FBaURUOzs7Ozs7MEJBTXVCO0FBQ25CLGVBQU8sS0FBS0MsT0FBWjtBQUNILE87d0JBRVdDLEssRUFBZ0I7QUFDeEIsYUFBS0QsT0FBTCxHQUFlQyxLQUFmO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU0yQjtBQUN2QixlQUFPLEtBQUtDLFdBQVo7QUFDSCxPO3dCQUVlUixDLEVBQVk7QUFDeEIsYUFBS1EsV0FBTCxHQUFtQlIsQ0FBbkI7O0FBQ0EsWUFBSSxDQUFDUyx3QkFBTCxFQUFhO0FBQ1QsZUFBS0MsWUFBTCxDQUFrQkMsYUFBbEIsQ0FBZ0NYLENBQWhDO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7MEJBTW1CO0FBQ2YsZUFBTyxLQUFLWSxZQUFaO0FBQ0gsTzt3QkFFZ0JMLEssRUFBZTtBQUM1QixhQUFLSyxZQUFMLEdBQW9CTCxLQUFwQjtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNcUI7QUFDakIsZUFBTyxLQUFLTSxjQUFaO0FBQ0gsTzt3QkFFa0JOLEssRUFBZTtBQUM5QixhQUFLTSxjQUFMLEdBQXNCTixLQUF0QjtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNcUI7QUFDakIsZUFBTyxLQUFLTyxRQUFaO0FBQ0gsTzt3QkFFWUMsTyxFQUFlO0FBQ3hCLGFBQUtELFFBQUwsQ0FBY0UsR0FBZCxDQUFrQkQsT0FBbEI7O0FBQ0EsWUFBSSxDQUFDTix3QkFBTCxFQUFhO0FBQ1QsZUFBS0MsWUFBTCxDQUFrQk8sVUFBbEIsQ0FBNkJGLE9BQTdCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7MEJBTThCO0FBQzFCLGVBQU8sS0FBS0csZUFBWjtBQUNILE87d0JBRW1CbEIsQyxFQUFXO0FBQzNCLGFBQUtrQixlQUFMLEdBQXVCbEIsQ0FBdkI7QUFDSDtBQUVEOzs7Ozs7Ozs7MEJBTXNCO0FBQ2xCLGVBQU8sS0FBS21CLGVBQVo7QUFDSCxPO3dCQUVtQlosSyxFQUFnQjtBQUNoQyxhQUFLWSxlQUFMLEdBQXVCWixLQUF2QjtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNdUM7QUFDbkMsZUFBTyxLQUFLYSxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQWpLMkI7QUFDdkIsZUFBTyxDQUFDQyxnQ0FBUjtBQUNIOzs7MEJBRTZCO0FBQzFCLGVBQU9BLHFDQUFvQixTQUEzQjtBQUNIOzs7MEJBRTRCO0FBQ3pCLGVBQU9BLHFDQUFvQixXQUEzQjtBQUNIOzs7MEJBRTBCO0FBQ3ZCLGVBQU9BLHFDQUFvQixTQUEzQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRQTs7Ozs7OzBCQU0yQjtBQUN2QixlQUFPOUIsWUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNc0M7QUFDbEMsWUFBSStCLDJCQUFTLGtDQUFtQmpCLGFBQWEsQ0FBQ2tCLFNBQWpDLENBQWIsRUFBMEQ7QUFBRSxpQkFBTyxJQUFQO0FBQXFCOztBQUNqRixlQUFPbEIsYUFBYSxDQUFDa0IsU0FBckI7QUFDSDs7O0FBc0xELDZCQUF1QjtBQUFBOztBQUFBOztBQUNuQjtBQURtQixhQTFEZGIsWUEwRGM7QUFBQSxhQWxEZGMsb0JBa0RjLEdBbERTLElBQUlDLGtDQUFKLEVBa0RUO0FBQUEsYUExQ2RDLGNBMENjLEdBMUN1QixFQTBDdkI7QUFBQSxhQWxDZEMsZUFrQ2MsR0FsQ3NCLElBQUlqQyxlQUFKLEVBa0N0QjtBQUFBLGFBMUJka0Msa0JBMEJjO0FBQUEsYUF4QmRDLGFBd0JjO0FBQUEsYUF0QmZ2QixPQXNCZSxHQXRCTCxJQXNCSztBQUFBLGFBckJmRSxXQXFCZSxHQXJCRCxJQXFCQztBQUFBLGFBcEJmSSxZQW9CZSxHQXBCQSxDQW9CQTtBQUFBLGFBbkJma0IsYUFtQmUsR0FuQkMsQ0FtQkQ7QUFBQSxhQWxCZmpCLGNBa0JlLEdBbEJFLE1BQU0sSUFrQlI7QUFBQSxhQWpCZk0sZUFpQmUsR0FqQkcsSUFpQkg7QUFBQSxhQWhCZlksWUFnQmUsR0FoQkEsQ0FnQkE7QUFBQSxhQWZmYixlQWVlLEdBZkcsR0FlSDtBQUFBLGFBZE5KLFFBY00sR0FkSyxJQUFJa0IsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFDLEVBQWIsRUFBaUIsQ0FBakIsQ0FjTDtBQUFBLGFBYk5aLFNBYU0sR0FiTSxJQUFJYSw4QkFBSixFQWFOO0FBQUEsYUFYTkMsY0FXTSxHQVg0QjtBQUMvQyxpQkFBUyxDQUFDLENBRHFDO0FBRS9DLGdCQUFRLENBQUMsQ0FGc0M7QUFHL0Msd0JBQWdCLElBSCtCO0FBSS9DLHVCQUFlO0FBSmdDLE9BVzVCO0FBQUEsYUFKTkMsaUJBSU0sR0FKYyxJQUFJQyxtQkFBSixDQUFrQyxZQUFNO0FBQ3pFLGVBQU8sSUFBSVgsa0NBQUosRUFBUDtBQUNILE9BRm9DLEVBRWxDLENBRmtDLENBSWQ7QUFFbkIsVUFBTVksTUFBTSxHQUFHQyxhQUFLRCxNQUFMLEdBQWNDLGFBQUtELE1BQUwsQ0FBWUUsT0FBMUIsR0FBc0QsSUFBckU7O0FBQ0EsVUFBSUYsTUFBSixFQUFZO0FBQ1JMLG9CQUFLUSxJQUFMLENBQVUsT0FBSzFCLFFBQWYsRUFBeUJ1QixNQUFNLENBQUN0QixPQUFoQzs7QUFDQSxlQUFLUCxXQUFMLEdBQW1CNkIsTUFBTSxDQUFDSSxVQUExQjtBQUNBLGVBQUs1QixjQUFMLEdBQXNCd0IsTUFBTSxDQUFDSyxhQUE3QjtBQUNBLGVBQUs5QixZQUFMLEdBQW9CeUIsTUFBTSxDQUFDTSxXQUEzQjtBQUNBLGVBQUt6QixlQUFMLEdBQXVCbUIsTUFBTSxDQUFDTyxjQUE5QjtBQUNBLGVBQUtDLGNBQUwsR0FBc0JSLE1BQU0sQ0FBQ1EsY0FBN0I7QUFDQSxlQUFLaEIsYUFBTCxHQUFxQlEsTUFBTSxDQUFDUixhQUE1QjtBQUNBLGVBQUtELGtCQUFMLEdBQTBCUyxNQUFNLENBQUNTLGlCQUFqQzs7QUFFQSxZQUFJVCxNQUFNLENBQUNVLGVBQVgsRUFBNEI7QUFDeEIsaUJBQUszQixTQUFMLENBQWU0QixRQUFmLEdBQTBCWCxNQUFNLENBQUNVLGVBQVAsQ0FBdUJDLFFBQWpEO0FBQ0EsaUJBQUs1QixTQUFMLENBQWU2QixlQUFmLEdBQWlDWixNQUFNLENBQUNVLGVBQVAsQ0FBdUJFLGVBQXhEO0FBQ0EsaUJBQUs3QixTQUFMLENBQWU4QixnQkFBZixHQUFrQ2IsTUFBTSxDQUFDVSxlQUFQLENBQXVCRyxnQkFBekQ7QUFDQSxpQkFBSzlCLFNBQUwsQ0FBZStCLFdBQWYsR0FBNkJkLE1BQU0sQ0FBQ1UsZUFBUCxDQUF1QkksV0FBcEQ7QUFDSDs7QUFFRCxZQUFJZCxNQUFNLENBQUNWLGVBQVgsRUFBNEI7QUFDeEIsZUFBSyxJQUFNL0IsQ0FBWCxJQUFnQnlDLE1BQU0sQ0FBQ1YsZUFBdkIsRUFBd0M7QUFDcEMsZ0JBQU05QixHQUFHLEdBQUcsS0FBS3VELFFBQVEsQ0FBQ3hELENBQUQsQ0FBekI7QUFDQSxtQkFBSytCLGVBQUwsWUFBeUI5QixHQUF6QixLQUFrQ3dDLE1BQU0sQ0FBQ1YsZUFBUCxDQUF1Qi9CLENBQXZCLENBQWxDO0FBQ0g7QUFDSjtBQUNKLE9BdkJELE1BdUJPO0FBQ0gsZUFBS2dDLGtCQUFMLEdBQTBCLEtBQTFCO0FBQ0EsZUFBS0MsYUFBTCxHQUFxQixLQUFyQjtBQUNIOztBQUNELGFBQUtULFNBQUwsQ0FBZWlDLEVBQWYsQ0FBa0IseUJBQWxCLEVBQTZDLE9BQUtDLGVBQWxEOztBQUVBLGFBQUs1QyxZQUFMLEdBQW9CLG1DQUFwQjs7QUFDQSxhQUFLQSxZQUFMLENBQWtCTyxVQUFsQixDQUE2QixPQUFLSCxRQUFsQzs7QUFDQSxhQUFLSixZQUFMLENBQWtCQyxhQUFsQixDQUFnQyxPQUFLSCxXQUFyQzs7QUFDQSxhQUFLRSxZQUFMLENBQWtCNkMsa0JBQWxCLENBQXFDLE9BQUtuQyxTQUExQzs7QUFuQ21CO0FBb0N0QjtBQUVEOzs7Ozs7Ozs7OztpQ0FPWW9DLFMsRUFBbUI7QUFDM0IsWUFBSS9DLDRCQUFVLENBQUMsS0FBS2dELGtCQUFwQixFQUF3QztBQUNwQztBQUNIOztBQUVELFlBQUksQ0FBQyxLQUFLbkQsT0FBVixFQUFtQjtBQUNmLGVBQUtJLFlBQUwsQ0FBa0JnRCxrQkFBbEI7QUFDQTtBQUNIOztBQUVELFlBQUksS0FBS3ZDLGVBQVQsRUFBMEI7QUFDdEIsZUFBS1csYUFBTCxHQUFxQixDQUFyQjtBQUNBLGVBQUtDLFlBQUwsSUFBcUJ5QixTQUFyQjs7QUFDQUcsNkJBQVNDLElBQVQsQ0FBY0MsbUJBQVNDLG9CQUF2Qjs7QUFDQSxpQkFBTyxLQUFLaEMsYUFBTCxHQUFxQixLQUFLbEIsWUFBakMsRUFBK0M7QUFDM0MsZ0JBQUksS0FBS21CLFlBQUwsR0FBb0IsS0FBS2xCLGNBQTdCLEVBQTZDO0FBQ3pDLG1CQUFLa0QscUJBQUw7QUFDQSxtQkFBS3JELFlBQUwsQ0FBa0JnRCxrQkFBbEI7QUFDQSxtQkFBS2hELFlBQUwsQ0FBa0JzRCxJQUFsQixDQUF1QixLQUFLbkQsY0FBNUI7QUFDQSxtQkFBS2tCLFlBQUwsSUFBcUIsS0FBS2xCLGNBQTFCO0FBQ0EsbUJBQUtpQixhQUFMO0FBQ0EsbUJBQUtwQixZQUFMLENBQWtCdUQsVUFBbEIsR0FOeUMsQ0FPekM7O0FBQ0EsbUJBQUt2RCxZQUFMLENBQWtCZ0Qsa0JBQWxCO0FBQ0gsYUFURCxNQVNPO0FBQ0gsbUJBQUtoRCxZQUFMLENBQWtCZ0Qsa0JBQWxCO0FBQ0E7QUFDSDtBQUNKOztBQUNEQyw2QkFBU0MsSUFBVCxDQUFjQyxtQkFBU0ssbUJBQXZCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7eUNBTTRCO0FBQUEsWUFBVkMsSUFBVSx1RUFBSCxDQUFHO0FBQ3hCLGFBQUtwQyxZQUFMLEdBQW9Cb0MsSUFBcEI7QUFDSDtBQUVEOzs7Ozs7Ozs7OzJCQU9NekIsYSxFQUF1QmMsUyxFQUFvQmIsVyxFQUFzQjtBQUNuRSxhQUFLakMsWUFBTCxDQUFrQnNELElBQWxCLENBQXVCdEIsYUFBdkIsRUFBc0NjLFNBQXRDLEVBQWlEYixXQUFqRDtBQUNIO0FBRUQ7Ozs7Ozs7OzsyQ0FNc0I7QUFDbEIsYUFBS2pDLFlBQUwsQ0FBa0JnRCxrQkFBbEI7QUFDSDtBQUVEOzs7Ozs7Ozs7bUNBTWM7QUFDVixhQUFLaEQsWUFBTCxDQUFrQnVELFVBQWxCO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs4Q0FPeUI7QUFDckIsWUFBSSxLQUFLckMsa0JBQVQsRUFBNkI7QUFDekIsY0FBTXdDLEVBQUUsR0FBSSxLQUFLekMsZUFBTixDQUFxRGhDLFdBQWhFOztBQUNBLGlCQUFPeUUsRUFBRSxDQUFDQyxNQUFILEdBQVksQ0FBbkIsRUFBc0I7QUFDbEIsZ0JBQU1DLEtBQUssR0FBR0YsRUFBRSxDQUFDRyxHQUFILEVBQWQ7QUFDQSxnQkFBTUMsSUFBSSxHQUFHLEtBQUs3QyxlQUFMLENBQXFCMkMsS0FBckIsQ0FBYjtBQUNBLGlCQUFLNUQsWUFBTCxDQUFrQnFELHFCQUFsQixDQUF3Q08sS0FBeEMsRUFBK0NFLElBQS9DO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7Ozs7Ozs7Ozs2Q0FNeUM7QUFBQSxZQUFuQkEsSUFBbUIsdUVBQVosVUFBWTs7QUFDckMsYUFBSyxJQUFJNUUsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxFQUFwQixFQUF3QkEsQ0FBQyxFQUF6QixFQUE2QjtBQUN6QixjQUFNQyxHQUFHLEdBQUcsS0FBS0QsQ0FBakI7QUFDQSxlQUFLK0IsZUFBTCxXQUF3QjlCLEdBQXhCLEtBQWlDMkUsSUFBakM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozt1Q0FNa0JDLE0sRUFBZ0JDLE0sRUFBZ0I7QUFDOUMsWUFBTUMsRUFBRSxHQUFHLEtBQUtoRCxlQUFoQjtBQUNBLFlBQU1pRCxLQUFLLEdBQUdELEVBQUUsQ0FBQ0YsTUFBRCxDQUFoQjtBQUNBLFlBQU1JLEtBQUssR0FBR0YsRUFBRSxDQUFDRCxNQUFELENBQWhCOztBQUNBLFlBQUlwRCx1QkFBSixFQUFXO0FBQ1AsY0FBSXNELEtBQUssSUFBSUUsU0FBVCxJQUFzQkQsS0FBSyxJQUFJQyxTQUFuQyxFQUE4QztBQUMxQywrQkFBTSxnRkFBTjtBQUNBLG1CQUFPLEtBQVA7QUFDSDtBQUNKOztBQUNELGVBQVFMLE1BQU0sR0FBR0ksS0FBVixJQUFxQkgsTUFBTSxHQUFHRSxLQUFyQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7d0NBT21CSCxNLEVBQWdCQyxNLEVBQTJDO0FBQUEsWUFBM0JLLFNBQTJCLHVFQUFOLElBQU07QUFDMUUsWUFBTUosRUFBRSxHQUFHLEtBQUtoRCxlQUFoQjs7QUFDQSxZQUFJTCx1QkFBSixFQUFXO0FBQ1AsY0FBSXFELEVBQUUsQ0FBQ0YsTUFBRCxDQUFGLElBQWNLLFNBQWQsSUFBMkJILEVBQUUsQ0FBQ0QsTUFBRCxDQUFGLElBQWNJLFNBQTdDLEVBQXdEO0FBQ3BELCtCQUFNLGlGQUFOO0FBQ0E7QUFDSDtBQUNKOztBQUNELFlBQUlDLFNBQUosRUFBZTtBQUNYSixVQUFBQSxFQUFFLENBQUNGLE1BQUQsQ0FBRixJQUFjQyxNQUFkO0FBQ0FDLFVBQUFBLEVBQUUsQ0FBQ0QsTUFBRCxDQUFGLElBQWNELE1BQWQ7QUFDSCxTQUhELE1BR087QUFDSEUsVUFBQUEsRUFBRSxDQUFDRixNQUFELENBQUYsSUFBYyxDQUFDQyxNQUFmO0FBQ0FDLFVBQUFBLEVBQUUsQ0FBQ0QsTUFBRCxDQUFGLElBQWMsQ0FBQ0QsTUFBZjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7Ozs7Ozs7OEJBV1NPLFEsRUFBZ0c7QUFBQSxZQUFqRlIsSUFBaUYsdUVBQWxFLFVBQWtFO0FBQUEsWUFBdERTLFdBQXNELHVFQUF4QyxRQUF3QztBQUFBLFlBQTlCQyxZQUE4Qix1RUFBZixJQUFlO0FBQ3JHLGFBQUtuQixxQkFBTDtBQUNBLGFBQUs1QixpQkFBTCxDQUF1QmdELEtBQXZCO0FBQ0EsYUFBS3pELGNBQUwsQ0FBb0IyQyxNQUFwQixHQUE2QixDQUE3QjtBQUNBLGFBQUtuQyxjQUFMLENBQW9Cc0MsSUFBcEIsR0FBMkJBLElBQTNCO0FBQ0EsYUFBS3RDLGNBQUwsQ0FBb0IrQyxXQUFwQixHQUFrQ0EsV0FBbEM7QUFDQSxhQUFLL0MsY0FBTCxDQUFvQmdELFlBQXBCLEdBQW1DQSxZQUFuQztBQUNBLGVBQU8sS0FBS3hFLFlBQUwsQ0FBa0IwRSxPQUFsQixDQUEwQkosUUFBMUIsRUFBb0MsS0FBSzlDLGNBQXpDLEVBQXlELEtBQUtDLGlCQUE5RCxFQUFpRixLQUFLVCxjQUF0RixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7cUNBV2dCc0QsUSxFQUFnRztBQUFBLFlBQWpGUixJQUFpRix1RUFBbEUsVUFBa0U7QUFBQSxZQUF0RFMsV0FBc0QsdUVBQXhDLFFBQXdDO0FBQUEsWUFBOUJDLFlBQThCLHVFQUFmLElBQWU7QUFDNUcsYUFBS25CLHFCQUFMO0FBQ0EsYUFBSzdCLGNBQUwsQ0FBb0JzQyxJQUFwQixHQUEyQkEsSUFBM0I7QUFDQSxhQUFLdEMsY0FBTCxDQUFvQitDLFdBQXBCLEdBQWtDQSxXQUFsQztBQUNBLGFBQUsvQyxjQUFMLENBQW9CZ0QsWUFBcEIsR0FBbUNBLFlBQW5DO0FBQ0EsZUFBTyxLQUFLeEUsWUFBTCxDQUFrQjJFLGNBQWxCLENBQWlDTCxRQUFqQyxFQUEyQyxLQUFLOUMsY0FBaEQsRUFBZ0UsS0FBS1Ysb0JBQXJFLENBQVA7QUFDSDs7O3dDQUUwQjtBQUN2QixhQUFLZCxZQUFMLENBQWtCNkMsa0JBQWxCLENBQXFDLEtBQUtuQyxTQUExQztBQUNIOzs7O0lBOWM4QmtFLGM7OztBQUF0QmpGLEVBQUFBLGEsQ0F3Qk9rRixFLEdBQUssUztBQXhCWmxGLEVBQUFBLGEsQ0ErQ2VrQixTOztBQXFhNUJvQyxxQkFBUzZCLElBQVQsQ0FBYzNCLG1CQUFTNEIsVUFBdkIsRUFBbUMsWUFBWTtBQUMzQ0MsSUFBQUEsaUJBQWlCO0FBQ3BCLEdBRkQ7O0FBSUEsV0FBU0EsaUJBQVQsR0FBOEI7QUFDMUIsUUFBSSxDQUFDckYsYUFBYSxDQUFDc0YsWUFBZixJQUErQixDQUFDbEYsd0JBQXBDLEVBQTRDO0FBQ3hDLFVBQU1tRixHQUFHLEdBQUcsSUFBSXBHLHdCQUFTYSxhQUFiLEVBQVo7QUFDQWIsOEJBQVNhLGFBQVQsQ0FBdUJrQixTQUF2QixHQUFtQ3FFLEdBQW5DOztBQUNBakMseUJBQVNrQyxjQUFULENBQXdCeEYsYUFBYSxDQUFDa0YsRUFBdEMsRUFBMENLLEdBQTFDLEVBQStDLENBQS9DO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGh5c2ljc1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBJUGh5c2ljc1dvcmxkLCBJUmF5Y2FzdE9wdGlvbnMgfSBmcm9tICcuLi9zcGVjL2ktcGh5c2ljcy13b3JsZCc7XHJcbmltcG9ydCB7IGNyZWF0ZVBoeXNpY3NXb3JsZCwgY2hlY2tQaHlzaWNzTW9kdWxlIH0gZnJvbSAnLi9pbnN0YW5jZSc7XHJcbmltcG9ydCB7IGRpcmVjdG9yLCBEaXJlY3RvciB9IGZyb20gJy4uLy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBQaHlzaWNNYXRlcmlhbCB9IGZyb20gJy4vYXNzZXRzL3BoeXNpYy1tYXRlcmlhbCc7XHJcbmltcG9ydCB7IFJlY3ljbGVQb29sLCBlcnJvciwgZ2FtZSwgRW51bSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyByYXkgfSBmcm9tICcuLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgUGh5c2ljc1JheVJlc3VsdCB9IGZyb20gJy4vcGh5c2ljcy1yYXktcmVzdWx0JztcclxuaW1wb3J0IHsgRURJVE9SLCBERUJVRyB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IElQaHlzaWNzQ29uZmlnLCBJQ29sbGlzaW9uTWF0cml4IH0gZnJvbSAnLi9waHlzaWNzLWNvbmZpZyc7XHJcblxyXG5lbnVtIFBoeXNpY3NHcm91cCB7XHJcbiAgICBERUZBVUxUID0gMSxcclxufVxyXG5FbnVtKFBoeXNpY3NHcm91cCk7XHJcbmxlZ2FjeUNDLmludGVybmFsLlBoeXNpY3NHcm91cCA9IFBoeXNpY3NHcm91cDtcclxuXHJcbmNsYXNzIENvbGxpc2lvbk1hdHJpeCB7XHJcbiAgICB1cGRhdGVBcnJheTogbnVtYmVyW10gPSBbXTtcclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDMyOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gMSA8PCBpO1xyXG4gICAgICAgICAgICB0aGlzW2BfJHtrZXl9YF0gPSAwO1xyXG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XHJcbiAgICAgICAgICAgICAgICAnZ2V0JzogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpc1tgXyR7a2V5fWBdIH0sXHJcbiAgICAgICAgICAgICAgICAnc2V0JzogZnVuY3Rpb24gKHY6IG51bWJlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGYgPSB0aGlzIGFzIENvbGxpc2lvbk1hdHJpeDtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZltgXyR7a2V5fWBdICE9IHYpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZltgXyR7a2V5fWBdID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYudXBkYXRlQXJyYXkuaW5kZXhPZihrZXkpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVBcnJheS5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXNbYF8xYF0gPSBQaHlzaWNzR3JvdXAuREVGQVVMVDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBQaHlzaWNzIHN5c3RlbS5cclxuICogQHpoXHJcbiAqIOeJqeeQhuezu+e7n+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFBoeXNpY3NTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xyXG5cclxuICAgIHN0YXRpYyBnZXQgUEhZU0lDU19OT05FICgpIHtcclxuICAgICAgICByZXR1cm4gIXBoeXNpY3NFbmdpbmVJZDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0IFBIWVNJQ1NfQlVJTFRJTiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHBoeXNpY3NFbmdpbmVJZCA9PT0gJ2J1aWx0aW4nO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgUEhZU0lDU19DQU5OT04gKCkge1xyXG4gICAgICAgIHJldHVybiBwaHlzaWNzRW5naW5lSWQgPT09ICdjYW5ub24uanMnO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXQgUEhZU0lDU19BTU1PICgpIHtcclxuICAgICAgICByZXR1cm4gcGh5c2ljc0VuZ2luZUlkID09PSAnYW1tby5qcyc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIElEIG9mIHRoZSBzeXN0ZW0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluatpOezu+e7n+eahElE44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByZWFkb25seSBJRCA9ICdQSFlTSUNTJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgcHJlZGVmaW5lZCBwaHlzaWNzIGdyb3Vwcy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W6aKE5a6a5LmJ55qE54mp55CG5YiG57uE44CCXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgUGh5c2ljc0dyb3VwICgpIHtcclxuICAgICAgICByZXR1cm4gUGh5c2ljc0dyb3VwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBwaHlzaWNhbCBzeXN0ZW0gaW5zdGFuY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPlueJqeeQhuezu+e7n+WunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IGluc3RhbmNlICgpOiBQaHlzaWNzU3lzdGVtIHtcclxuICAgICAgICBpZiAoREVCVUcgJiYgY2hlY2tQaHlzaWNzTW9kdWxlKFBoeXNpY3NTeXN0ZW0uX2luc3RhbmNlKSkgeyByZXR1cm4gbnVsbCBhcyBhbnk7IH1cclxuICAgICAgICByZXR1cm4gUGh5c2ljc1N5c3RlbS5faW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgX2luc3RhbmNlOiBQaHlzaWNzU3lzdGVtO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgd2hldGhlciB0aGUgcGh5c2ljYWwgc3lzdGVtIGlzIGVuYWJsZWQsIHdoaWNoIGNhbiBiZSB1c2VkIHRvIHBhdXNlIG9yIGNvbnRpbnVlIHJ1bm5pbmcgdGhlIHBoeXNpY2FsIHN5c3RlbS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5piv5ZCm5ZCv55So54mp55CG57O757uf77yM5Y+v5Lul55So5LqO5pqC5YGc5oiW57un57ut6L+Q6KGM54mp55CG57O757uf44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBlbmFibGUgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGVuYWJsZSAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9lbmFibGUgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgdGhlIHBoeXNpY2FsIHN5c3RlbSBhbGxvd3MgYXV0b21hdGljIHNsZWVwLCB3aGljaCBkZWZhdWx0cyB0byB0cnVlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7niannkIbns7vnu5/mmK/lkKblhYHorrjoh6rliqjkvJHnnKDvvIzpu5jorqTkuLogdHJ1ZeOAglxyXG4gICAgICovXHJcbiAgICBnZXQgYWxsb3dTbGVlcCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FsbG93U2xlZXA7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGFsbG93U2xlZXAgKHY6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9hbGxvd1NsZWVwID0gdjtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zZXRBbGxvd1NsZWVwKHYpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBtYXhpbXVtIG51bWJlciBvZiBzaW11bGF0ZWQgc3Vic3RlcHMgcGVyIGZyYW1lLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7mr4/luKfmqKHmi5/nmoTmnIDlpKflrZDmraXmlbDjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IG1heFN1YlN0ZXBzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF4U3ViU3RlcHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IG1heFN1YlN0ZXBzICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbWF4U3ViU3RlcHMgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHRoZSBmaXhlZCBkZWx0YSB0aW1lIGNvbnN1bWVkIGJ5IGVhY2ggc2ltdWxhdGlvbiBzdGVwLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7mr4/mraXmqKHmi5/mtojogJfnmoTlm7rlrprml7bpl7TjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IGZpeGVkVGltZVN0ZXAgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maXhlZFRpbWVTdGVwO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBmaXhlZFRpbWVTdGVwICh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fZml4ZWRUaW1lU3RlcCA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIHZhbHVlIG9mIGdyYXZpdHkgaW4gdGhlIHBoeXNpY2FsIHdvcmxkLCB3aGljaCBkZWZhdWx0cyB0byAoMCwgLTEwLCAwKS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u54mp55CG5LiW55WM55qE6YeN5Yqb5pWw5YC877yM6buY6K6k5Li6ICgwLCAtMTAsIDAp44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBncmF2aXR5ICgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ3Jhdml0eTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZ3Jhdml0eSAoZ3Jhdml0eTogVmVjMykge1xyXG4gICAgICAgIHRoaXMuX2dyYXZpdHkuc2V0KGdyYXZpdHkpO1xyXG4gICAgICAgIGlmICghRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnNldEdyYXZpdHkoZ3Jhdml0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIGRlZmF1bHQgc3BlZWQgdGhyZXNob2xkIGZvciBnb2luZyB0byBzbGVlcC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u6L+b5YWl5LyR55yg55qE6buY6K6k6YCf5bqm5Li055WM5YC844CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzbGVlcFRocmVzaG9sZCAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2xlZXBUaHJlc2hvbGQ7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHNsZWVwVGhyZXNob2xkICh2OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9zbGVlcFRocmVzaG9sZCA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFR1cm4gb24gb3Igb2ZmIHRoZSBhdXRvbWF0aWMgc2ltdWxhdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5piv5ZCm6Ieq5Yqo5qih5ouf44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBhdXRvU2ltdWxhdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2F1dG9TaW11bGF0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBhdXRvU2ltdWxhdGlvbiAodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9hdXRvU2ltdWxhdGlvbiA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBnbG9iYWwgZGVmYXVsdCBwaHlzaWNhbCBtYXRlcmlhbC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5YWo5bGA55qE6buY6K6k54mp55CG5p2Q6LSo44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBkZWZhdWx0TWF0ZXJpYWwgKCk6IFBoeXNpY01hdGVyaWFsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXJlZCBvYmplY3Qgb2YgdGhlIHBoeXNpY2FsIHdvcmxkIHRocm91Z2ggd2hpY2ggeW91IGNhbiBhY2Nlc3MgdGhlIGFjdHVhbCB1bmRlcmx5aW5nIG9iamVjdC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W54mp55CG5LiW55WM55qE5bCB6KOF5a+56LGh77yM6YCa6L+H5a6D5L2g5Y+v5Lul6K6/6Zeu5Yiw5a6e6ZmF55qE5bqV5bGC5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IHBoeXNpY3NXb3JsZDogSVBoeXNpY3NXb3JsZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgcmF5Y2FzdENsb3Nlc3QgdGVzdCByZXN1bHQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPliByYXljYXN0Q2xvc2VzdCDnmoTmo4DmtYvnu5PmnpzjgIJcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgcmF5Y2FzdENsb3Nlc3RSZXN1bHQgPSBuZXcgUGh5c2ljc1JheVJlc3VsdCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSByYXljYXN0IHRlc3QgcmVzdWx0cy5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+WIHJheWNhc3Qg55qE5qOA5rWL57uT5p6c44CCXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IHJheWNhc3RSZXN1bHRzOiBQaHlzaWNzUmF5UmVzdWx0W10gPSBbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgY29sbGlzaW9uIG1hdHJpeOOAglxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bnorDmkp7nn6npmLXjgIJcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgY29sbGlzaW9uTWF0cml4OiBJQ29sbGlzaW9uTWF0cml4ID0gbmV3IENvbGxpc2lvbk1hdHJpeCgpIGFzIHVua25vd24gYXMgSUNvbGxpc2lvbk1hdHJpeDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyBvciBzZXRzIHdoZXRoZXIgdG8gdXNlIGEgY29sbGlzaW9uIG1hdHJpeC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oiW6K6+572u5piv5ZCm5byA5ZCv56Kw5pKe55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHJlYWRvbmx5IHVzZUNvbGxpc2lvbk1hdHJpeDogYm9vbGVhbjtcclxuXHJcbiAgICByZWFkb25seSB1c2VOb2RlQ2hhaW5zOiBib29sZWFuO1xyXG5cclxuICAgIHByaXZhdGUgX2VuYWJsZSA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9hbGxvd1NsZWVwID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX21heFN1YlN0ZXBzID0gMTtcclxuICAgIHByaXZhdGUgX3N1YlN0ZXBDb3VudCA9IDA7XHJcbiAgICBwcml2YXRlIF9maXhlZFRpbWVTdGVwID0gMS4wIC8gNjAuMDtcclxuICAgIHByaXZhdGUgX2F1dG9TaW11bGF0aW9uID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX2FjY3VtdWxhdG9yID0gMDtcclxuICAgIHByaXZhdGUgX3NsZWVwVGhyZXNob2xkID0gMC4xO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBfZ3Jhdml0eSA9IG5ldyBWZWMzKDAsIC0xMCwgMCk7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF9tYXRlcmlhbCA9IG5ldyBQaHlzaWNNYXRlcmlhbCgpO1xyXG5cclxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmF5Y2FzdE9wdGlvbnM6IElSYXljYXN0T3B0aW9ucyA9IHtcclxuICAgICAgICAnZ3JvdXAnOiAtMSxcclxuICAgICAgICAnbWFzayc6IC0xLFxyXG4gICAgICAgICdxdWVyeVRyaWdnZXInOiB0cnVlLFxyXG4gICAgICAgICdtYXhEaXN0YW5jZSc6IDEwMDAwMDAwXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSByZWFkb25seSByYXljYXN0UmVzdWx0UG9vbCA9IG5ldyBSZWN5Y2xlUG9vbDxQaHlzaWNzUmF5UmVzdWx0PigoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQaHlzaWNzUmF5UmVzdWx0KCk7XHJcbiAgICB9LCAxKTtcclxuXHJcbiAgICBwcml2YXRlIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IGdhbWUuY29uZmlnID8gZ2FtZS5jb25maWcucGh5c2ljcyBhcyBJUGh5c2ljc0NvbmZpZyA6IG51bGw7XHJcbiAgICAgICAgaWYgKGNvbmZpZykge1xyXG4gICAgICAgICAgICBWZWMzLmNvcHkodGhpcy5fZ3Jhdml0eSwgY29uZmlnLmdyYXZpdHkpO1xyXG4gICAgICAgICAgICB0aGlzLl9hbGxvd1NsZWVwID0gY29uZmlnLmFsbG93U2xlZXA7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpeGVkVGltZVN0ZXAgPSBjb25maWcuZml4ZWRUaW1lU3RlcDtcclxuICAgICAgICAgICAgdGhpcy5fbWF4U3ViU3RlcHMgPSBjb25maWcubWF4U3ViU3RlcHM7XHJcbiAgICAgICAgICAgIHRoaXMuX3NsZWVwVGhyZXNob2xkID0gY29uZmlnLnNsZWVwVGhyZXNob2xkO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9TaW11bGF0aW9uID0gY29uZmlnLmF1dG9TaW11bGF0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLnVzZU5vZGVDaGFpbnMgPSBjb25maWcudXNlTm9kZUNoYWlucztcclxuICAgICAgICAgICAgdGhpcy51c2VDb2xsaXNpb25NYXRyaXggPSBjb25maWcudXNlQ29sbHNpb25NYXRyaXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmRlZmF1bHRNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwuZnJpY3Rpb24gPSBjb25maWcuZGVmYXVsdE1hdGVyaWFsLmZyaWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwucm9sbGluZ0ZyaWN0aW9uID0gY29uZmlnLmRlZmF1bHRNYXRlcmlhbC5yb2xsaW5nRnJpY3Rpb247XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5zcGlubmluZ0ZyaWN0aW9uID0gY29uZmlnLmRlZmF1bHRNYXRlcmlhbC5zcGlubmluZ0ZyaWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwucmVzdGl0dXRpb24gPSBjb25maWcuZGVmYXVsdE1hdGVyaWFsLnJlc3RpdHV0aW9uO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoY29uZmlnLmNvbGxpc2lvbk1hdHJpeCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGNvbmZpZy5jb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSAxIDw8IHBhcnNlSW50KGkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29sbGlzaW9uTWF0cml4W2BfJHtrZXl9YF0gPSBjb25maWcuY29sbGlzaW9uTWF0cml4W2ldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy51c2VDb2xsaXNpb25NYXRyaXggPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy51c2VOb2RlQ2hhaW5zID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21hdGVyaWFsLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQgPSBjcmVhdGVQaHlzaWNzV29ybGQoKTtcclxuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zZXRHcmF2aXR5KHRoaXMuX2dyYXZpdHkpO1xyXG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnNldEFsbG93U2xlZXAodGhpcy5fYWxsb3dTbGVlcCk7XHJcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuc2V0RGVmYXVsdE1hdGVyaWFsKHRoaXMuX21hdGVyaWFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGxpZmVjeWNsZSBmdW5jdGlvbiBpcyBhdXRvbWF0aWNhbGx5IGV4ZWN1dGVkIGFmdGVyIGFsbCBjb21wb25lbnRzIGB1cGRhdGVgIGFuZCBgbGF0ZVVwYWR0ZWAgYXJlIGV4ZWN1dGVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlJ/lkb3lkajmnJ/lh73mlbDvvIzlnKjmiYDmnInnu4Tku7bnmoRgdXBkYXRlYOWSjGBsYXRlVXBhZHRlYOaJp+ihjOWujOaIkOWQjuiHquWKqOaJp+ihjOOAglxyXG4gICAgICogQHBhcmFtIGRlbHRhVGltZSB0aGUgdGltZSBzaW5jZSBsYXN0IGZyYW1lLlxyXG4gICAgICovXHJcbiAgICBwb3N0VXBkYXRlIChkZWx0YVRpbWU6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChFRElUT1IgJiYgIXRoaXMuX2V4ZWN1dGVJbkVkaXRNb2RlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fYXV0b1NpbXVsYXRpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5fc3ViU3RlcENvdW50ID0gMDtcclxuICAgICAgICAgICAgdGhpcy5fYWNjdW11bGF0b3IgKz0gZGVsdGFUaW1lO1xyXG4gICAgICAgICAgICBkaXJlY3Rvci5lbWl0KERpcmVjdG9yLkVWRU5UX0JFRk9SRV9QSFlTSUNTKTtcclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuX3N1YlN0ZXBDb3VudCA8IHRoaXMuX21heFN1YlN0ZXBzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWNjdW11bGF0b3IgPiB0aGlzLl9maXhlZFRpbWVTdGVwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVDb2xsaXNpb25NYXRyaXgoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zdGVwKHRoaXMuX2ZpeGVkVGltZVN0ZXApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2FjY3VtdWxhdG9yIC09IHRoaXMuX2ZpeGVkVGltZVN0ZXA7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3ViU3RlcENvdW50Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuZW1pdEV2ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IG5lc3RpbmcgdGhlIGRpcnR5IGZsYWcgcmVzZXQgYmV0d2VlbiB0aGUgc3luY1NjZW5ldG9QaHlzaWNzIGFuZCB0aGUgc2ltdWxhdGlvbiB0byByZWR1Y2UgY2FsbGluZyBzeW5jU2NlbmV0b1BoeXNpY3MuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuc3luY1NjZW5lVG9QaHlzaWNzKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnN5bmNTY2VuZVRvUGh5c2ljcygpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLmVtaXQoRGlyZWN0b3IuRVZFTlRfQUZURVJfUEhZU0lDUyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXNldCB0aGUgYWNjdW11bGF0b3Igb2YgdGltZSB0byBnaXZlbiB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6YeN572u5pe26Ze057Sv56ev5oC76YeP5Li657uZ5a6a5YC844CCXHJcbiAgICAgKi9cclxuICAgIHJlc2V0QWNjdW11bGF0b3IgKHRpbWUgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5fYWNjdW11bGF0b3IgPSB0aW1lO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQZXJmb3JtIHNpbXVsYXRpb24gc3RlcHMgZm9yIHRoZSBwaHlzaWNzIHdvcmxkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmiafooYzniannkIbkuJbnlYznmoTmqKHmi5/mraXov5vjgIJcclxuICAgICAqIEBwYXJhbSBmaXhlZFRpbWVTdGVwXHJcbiAgICAgKi9cclxuICAgIHN0ZXAgKGZpeGVkVGltZVN0ZXA6IG51bWJlciwgZGVsdGFUaW1lPzogbnVtYmVyLCBtYXhTdWJTdGVwcz86IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnN0ZXAoZml4ZWRUaW1lU3RlcCwgZGVsdGFUaW1lLCBtYXhTdWJTdGVwcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN5bmMgdGhlIHNjZW5lIHdvcmxkIHRyYW5zZm9ybSBjaGFuZ2VzIHRvIHRoZSBwaHlzaWNzIHdvcmxkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlkIzmraXlnLrmma/kuJbnlYznmoTlj5jljJbkv6Hmga/liLDniannkIbkuJbnlYzkuK3jgIJcclxuICAgICAqL1xyXG4gICAgc3luY1NjZW5lVG9QaHlzaWNzICgpIHtcclxuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5zeW5jU2NlbmVUb1BoeXNpY3MoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRW1pdCB0cmlnZ2VyIGFuZCBjb2xsaXNpb24gZXZlbnRzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDop6blj5FgdHJpZ2dlcmDlkoxgY29sbGlzaW9uYOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBlbWl0RXZlbnRzICgpIHtcclxuICAgICAgICB0aGlzLnBoeXNpY3NXb3JsZC5lbWl0RXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFVwZGF0ZXMgdGhlIG1hc2sgY29ycmVzcG9uZGluZyB0byB0aGUgY29sbGlzaW9uIG1hdHJpeCBmb3IgdGhlIGxvd0xldmVsIHJpZ2lkLWJvZHkgaW5zdGFuY2UuXHJcbiAgICAgKiBBdXRvbWF0aWMgZXhlY3V0aW9uIGR1cmluZyBhdXRvbWF0aWMgc2ltdWxhdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pu05paw5bqV5bGC5a6e5L6L5a+55bqU5LqO56Kw5pKe55+p6Zi155qE5o6p56CB77yM5byA5ZCv6Ieq5Yqo5qih5ouf5pe25Lya6Ieq5Yqo5pu05paw44CCXHJcbiAgICAgKi9cclxuICAgIHVwZGF0ZUNvbGxpc2lvbk1hdHJpeCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVhID0gKHRoaXMuY29sbGlzaW9uTWF0cml4IGFzIHVua25vd24gYXMgQ29sbGlzaW9uTWF0cml4KS51cGRhdGVBcnJheTtcclxuICAgICAgICAgICAgd2hpbGUgKHVhLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGdyb3VwID0gdWEucG9wKCkhO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWFzayA9IHRoaXMuY29sbGlzaW9uTWF0cml4W2dyb3VwXTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGh5c2ljc1dvcmxkLnVwZGF0ZUNvbGxpc2lvbk1hdHJpeChncm91cCwgbWFzayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlc2V0IHRoZSBtYXNrIGNvcnJlc3BvbmRpbmcgdG8gYWxsIGdyb3VwcyBvZiB0aGUgY29sbGlzaW9uIG1hdHJpeCB0byB0aGUgZ2l2ZW4gdmFsdWUsIHRoZSBkZWZhdWx0IGdpdmVuIHZhbHVlIGlzJyAweGZmZmZmZmZmICcuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmHjee9rueisOaSnuefqemYteaJgOacieWIhue7hOWvueW6lOaOqeeggeS4uue7meWumuWAvO+8jOm7mOiupOe7meWumuWAvOS4umAweGZmZmZmZmZmYOOAglxyXG4gICAgICovXHJcbiAgICByZXNldENvbGxpc2lvbk1hdHJpeCAobWFzayA9IDB4ZmZmZmZmZmYpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDMyOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qga2V5ID0gMSA8PCBpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeFtgJHtrZXl9YF0gPSBtYXNrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQXJlIGNvbGxpc2lvbnMgYmV0d2VlbiBgZ3JvdXAxYCBhbmQgYGdyb3VwMmA/XHJcbiAgICAgKiBAemhcclxuICAgICAqIOS4pOWIhue7hOaYr+WQpuS8muS6p+eUn+eisOaSnu+8n1xyXG4gICAgICovXHJcbiAgICBpc0NvbGxpc2lvbkdyb3VwIChncm91cDE6IG51bWJlciwgZ3JvdXAyOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjbSA9IHRoaXMuY29sbGlzaW9uTWF0cml4O1xyXG4gICAgICAgIGNvbnN0IG1hc2sxID0gY21bZ3JvdXAxXTtcclxuICAgICAgICBjb25zdCBtYXNrMiA9IGNtW2dyb3VwMl07XHJcbiAgICAgICAgaWYgKERFQlVHKSB7XHJcbiAgICAgICAgICAgIGlmIChtYXNrMSA9PSB1bmRlZmluZWQgfHwgbWFzazIgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvcihcIltQSFlTSUNTXTogJ2lzQ29sbGlzaW9uR3JvdXAnLCB0aGUgZ3JvdXAgZG8gbm90IGV4aXN0IGluIHRoZSBjb2xsaXNpb24gbWF0cml4LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKGdyb3VwMSAmIG1hc2syKSAmJiAoZ3JvdXAyICYgbWFzazEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHdoZXRoZXIgY29sbGlzaW9ucyBvY2N1ciBiZXR3ZWVuIGBncm91cDFgIGFuZCBgZ3JvdXAyYC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5Lik5YiG57uE6Ze05piv5ZCm5Lqn55Sf56Kw5pKe44CCXHJcbiAgICAgKiBAcGFyYW0gY29sbGlzaW9uIGlzIGNvbGxpc2lvbiBvY2N1cnM/XHJcbiAgICAgKi9cclxuICAgIHNldENvbGxpc2lvbkdyb3VwIChncm91cDE6IG51bWJlciwgZ3JvdXAyOiBudW1iZXIsIGNvbGxpc2lvbjogYm9vbGVhbiA9IHRydWUpIHtcclxuICAgICAgICBjb25zdCBjbSA9IHRoaXMuY29sbGlzaW9uTWF0cml4O1xyXG4gICAgICAgIGlmIChERUJVRykge1xyXG4gICAgICAgICAgICBpZiAoY21bZ3JvdXAxXSA9PSB1bmRlZmluZWQgfHwgY21bZ3JvdXAyXSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yKFwiW1BIWVNJQ1NdOiAnc2V0Q29sbGlzaW9uR3JvdXAnLCB0aGUgZ3JvdXAgZG8gbm90IGV4aXN0IGluIHRoZSBjb2xsaXNpb24gbWF0cml4LlwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29sbGlzaW9uKSB7XHJcbiAgICAgICAgICAgIGNtW2dyb3VwMV0gfD0gZ3JvdXAyO1xyXG4gICAgICAgICAgICBjbVtncm91cDJdIHw9IGdyb3VwMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjbVtncm91cDFdICY9IH5ncm91cDI7XHJcbiAgICAgICAgICAgIGNtW2dyb3VwMl0gJj0gfmdyb3VwMTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbGxpc2lvbiBkZXRlY3QgYWxsIGNvbGxpZGVyLCBhbmQgcmVjb3JkIGFsbCB0aGUgZGV0ZWN0ZWQgcmVzdWx0cywgdGhyb3VnaCBQaHlzaWNzU3lzdGVtLkluc3RhbmNlLlJheWNhc3RSZXN1bHRzIGFjY2VzcyB0byB0aGUgcmVzdWx0cy5cclxuICAgICAqIEB6aFxyXG4gICAgICog5qOA5rWL5omA5pyJ55qE56Kw5pKe55uS77yM5bm26K6w5b2V5omA5pyJ6KKr5qOA5rWL5Yiw55qE57uT5p6c77yM6YCa6L+HIFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UucmF5Y2FzdFJlc3VsdHMg6K6/6Zeu57uT5p6c44CCXHJcbiAgICAgKiBAcGFyYW0gd29ybGRSYXkg5LiW55WM56m66Ze05LiL55qE5LiA5p2h5bCE57q/XHJcbiAgICAgKiBAcGFyYW0gbWFzayDmjqnnoIHvvIzpu5jorqTkuLogMHhmZmZmZmZmZlxyXG4gICAgICogQHBhcmFtIG1heERpc3RhbmNlIOacgOWkp+ajgOa1i+i3neemu++8jOm7mOiupOS4uiAxMDAwMDAwMO+8jOebruWJjeivt+WLv+S8oOWFpSBJbmZpbml0eSDmiJYgTnVtYmVyLk1BWF9WQUxVRVxyXG4gICAgICogQHBhcmFtIHF1ZXJ5VHJpZ2dlciDmmK/lkKbmo4DmtYvop6blj5HlmahcclxuICAgICAqIEByZXR1cm4gYm9vbGVhbiDooajnpLrmmK/lkKbmnInmo4DmtYvliLDnorDmkp7nm5JcclxuICAgICAqL1xyXG4gICAgcmF5Y2FzdCAod29ybGRSYXk6IHJheSwgbWFzazogbnVtYmVyID0gMHhmZmZmZmZmZiwgbWF4RGlzdGFuY2UgPSAxMDAwMDAwMCwgcXVlcnlUcmlnZ2VyID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29sbGlzaW9uTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5yYXljYXN0UmVzdWx0UG9vbC5yZXNldCgpO1xyXG4gICAgICAgIHRoaXMucmF5Y2FzdFJlc3VsdHMubGVuZ3RoID0gMDtcclxuICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLm1hc2sgPSBtYXNrO1xyXG4gICAgICAgIHRoaXMucmF5Y2FzdE9wdGlvbnMubWF4RGlzdGFuY2UgPSBtYXhEaXN0YW5jZTtcclxuICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLnF1ZXJ5VHJpZ2dlciA9IHF1ZXJ5VHJpZ2dlcjtcclxuICAgICAgICByZXR1cm4gdGhpcy5waHlzaWNzV29ybGQucmF5Y2FzdCh3b3JsZFJheSwgdGhpcy5yYXljYXN0T3B0aW9ucywgdGhpcy5yYXljYXN0UmVzdWx0UG9vbCwgdGhpcy5yYXljYXN0UmVzdWx0cyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbGxpc2lvbiBkZXRlY3QgYWxsIGNvbGxpZGVyLCBhbmQgcmVjb3JkIGFuZCByYXkgdGVzdCByZXN1bHRzIHdpdGggdGhlIHNob3J0ZXN0IGRpc3RhbmNlIGJ5IFBoeXNpY3NTeXN0ZW0uSW5zdGFuY2UuUmF5Y2FzdENsb3Nlc3RSZXN1bHQgYWNjZXNzIHRvIHRoZSByZXN1bHRzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmo4DmtYvmiYDmnInnmoTnorDmkp7nm5LvvIzlubborrDlvZXkuI7lsITnur/ot53nprvmnIDnn63nmoTmo4DmtYvnu5PmnpzvvIzpgJrov4cgUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5yYXljYXN0Q2xvc2VzdFJlc3VsdCDorr/pl67nu5PmnpzjgIJcclxuICAgICAqIEBwYXJhbSB3b3JsZFJheSDkuJbnlYznqbrpl7TkuIvnmoTkuIDmnaHlsITnur9cclxuICAgICAqIEBwYXJhbSBtYXNrIOaOqeegge+8jOm7mOiupOS4uiAweGZmZmZmZmZmXHJcbiAgICAgKiBAcGFyYW0gbWF4RGlzdGFuY2Ug5pyA5aSn5qOA5rWL6Led56a777yM6buY6K6k5Li6IDEwMDAwMDAw77yM55uu5YmN6K+35Yu/5Lyg5YWlIEluZmluaXR5IOaIliBOdW1iZXIuTUFYX1ZBTFVFXHJcbiAgICAgKiBAcGFyYW0gcXVlcnlUcmlnZ2VyIOaYr+WQpuajgOa1i+inpuWPkeWZqFxyXG4gICAgICogQHJldHVybiBib29sZWFuIOihqOekuuaYr+WQpuacieajgOa1i+WIsOeisOaSnuebklxyXG4gICAgICovXHJcbiAgICByYXljYXN0Q2xvc2VzdCAod29ybGRSYXk6IHJheSwgbWFzazogbnVtYmVyID0gMHhmZmZmZmZmZiwgbWF4RGlzdGFuY2UgPSAxMDAwMDAwMCwgcXVlcnlUcmlnZ2VyID0gdHJ1ZSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlQ29sbGlzaW9uTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5tYXNrID0gbWFzaztcclxuICAgICAgICB0aGlzLnJheWNhc3RPcHRpb25zLm1heERpc3RhbmNlID0gbWF4RGlzdGFuY2U7XHJcbiAgICAgICAgdGhpcy5yYXljYXN0T3B0aW9ucy5xdWVyeVRyaWdnZXIgPSBxdWVyeVRyaWdnZXI7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGh5c2ljc1dvcmxkLnJheWNhc3RDbG9zZXN0KHdvcmxkUmF5LCB0aGlzLnJheWNhc3RPcHRpb25zLCB0aGlzLnJheWNhc3RDbG9zZXN0UmVzdWx0KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVNYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgdGhpcy5waHlzaWNzV29ybGQuc2V0RGVmYXVsdE1hdGVyaWFsKHRoaXMuX21hdGVyaWFsKTtcclxuICAgIH1cclxufVxyXG5cclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9jb3JlL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgcGh5c2ljc0VuZ2luZUlkIH0gZnJvbSAnLi9waHlzaWNzLXNlbGVjdG9yJztcclxuXHJcbmRpcmVjdG9yLm9uY2UoRGlyZWN0b3IuRVZFTlRfSU5JVCwgZnVuY3Rpb24gKCkge1xyXG4gICAgaW5pdFBoeXNpY3NTeXN0ZW0oKTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiBpbml0UGh5c2ljc1N5c3RlbSAoKSB7XHJcbiAgICBpZiAoIVBoeXNpY3NTeXN0ZW0uUEhZU0lDU19OT05FICYmICFFRElUT1IpIHtcclxuICAgICAgICBjb25zdCBzeXMgPSBuZXcgbGVnYWN5Q0MuUGh5c2ljc1N5c3RlbSgpO1xyXG4gICAgICAgIGxlZ2FjeUNDLlBoeXNpY3NTeXN0ZW0uX2luc3RhbmNlID0gc3lzO1xyXG4gICAgICAgIGRpcmVjdG9yLnJlZ2lzdGVyU3lzdGVtKFBoeXNpY3NTeXN0ZW0uSUQsIHN5cywgMCk7XHJcbiAgICB9XHJcbn1cclxuIl19