(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../../../core/data/decorators/index.js", "../../../../core/event/index.js", "../../../../core/math/index.js", "../rigid-body.js", "../../assets/physic-material.js", "../../physics-system.js", "../../../../core/index.js", "../../../../core/default-constants.js", "../../../../core/geometry/index.js", "../../physics-enum.js", "../../instance.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../../../core/data/decorators/index.js"), require("../../../../core/event/index.js"), require("../../../../core/math/index.js"), require("../rigid-body.js"), require("../../assets/physic-material.js"), require("../../physics-system.js"), require("../../../../core/index.js"), require("../../../../core/default-constants.js"), require("../../../../core/geometry/index.js"), require("../../physics-enum.js"), require("../../instance.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.rigidBody, global.physicMaterial, global.physicsSystem, global.index, global.defaultConstants, global.index, global.physicsEnum, global.instance);
    global.collider = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _rigidBody, _physicMaterial, _physicsSystem, _index4, _defaultConstants, _index5, _physicsEnum, _instance) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Collider = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _class, _class2, _descriptor, _descriptor2, _descriptor3, _class3, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  /**
   * @en
   * Base class of collider.
   * @zh
   * 碰撞器的基类。
   */
  var Collider = (_dec = (0, _index.ccclass)('cc.Collider'), _dec2 = (0, _index.type)(_rigidBody.RigidBody), _dec3 = (0, _index.displayName)('Attached'), _dec4 = (0, _index.displayOrder)(-2), _dec5 = (0, _index.type)(_physicMaterial.PhysicMaterial), _dec6 = (0, _index.displayName)('Material'), _dec7 = (0, _index.displayOrder)(-1), _dec8 = (0, _index.tooltip)('源材质'), _dec9 = (0, _index.displayOrder)(0), _dec10 = (0, _index.tooltip)('是否与其它碰撞器产生碰撞，并产生物理行为'), _dec11 = (0, _index.type)(_index3.Vec3), _dec12 = (0, _index.displayOrder)(1), _dec13 = (0, _index.tooltip)('形状的中心点（与所在 Node 中心点的相对位置）'), _dec14 = (0, _index.type)(_physicMaterial.PhysicMaterial), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_Eventify) {
    _inherits(Collider, _Eventify);

    _createClass(Collider, [{
      key: "attachedRigidBody",
      /// PUBLIC PROPERTY GETTER\SETTER ///

      /**
       * @en
       * Gets the collider attached rigid-body, this may be null.
       * @zh
       * 获取碰撞器所绑定的刚体组件，可能为 null 。
       */
      get: function get() {
        return findAttachedBody(this.node); // return this._attachedRigidBody;
      }
      /**
       * @en
       * Gets or sets the physical material for this collider.
       * @zh
       * 获取或设置此碰撞器的物理材质。
       */

    }, {
      key: "sharedMaterial",
      get: function get() {
        return this._material;
      },
      set: function set(value) {
        if (_defaultConstants.EDITOR) {
          this._material = value;
        } else {
          this.material = value;
        }
      }
      /**
       * @en
       * Gets or sets the physics material for this collider, which in Shared state will generate a new instance.
       * @zh
       * 获取或设置此碰撞器的物理材质，共享状态下获取将会生成新的实例。
       */

    }, {
      key: "material",
      get: function get() {
        if (this._isSharedMaterial && this._material != null) {
          this._material.off('physics_material_update', this._updateMaterial, this);

          this._material = this._material.clone();

          this._material.on('physics_material_update', this._updateMaterial, this);

          this._isSharedMaterial = false;
        }

        return this._material;
      },
      set: function set(value) {
        if (this._shape) {
          if (value != null && this._material != null) {
            if (this._material._uuid != value._uuid) {
              this._material.off('physics_material_update', this._updateMaterial, this);

              value.on('physics_material_update', this._updateMaterial, this);
              this._isSharedMaterial = false;
              this._material = value;
            }
          } else if (value != null && this._material == null) {
            value.on('physics_material_update', this._updateMaterial, this);
            this._material = value;
          } else if (value == null && this._material != null) {
            this._material.off('physics_material_update', this._updateMaterial, this);

            this._material = value;
          }

          this._updateMaterial();
        }
      }
      /**
       * @en
       * Gets or sets the collider is trigger, this will be always trigger if using builtin.
       * @zh
       * 获取或设置碰撞器是否为触发器，若使用 builtin ，属性值无论真假 ，此碰撞器都为触发器。
       */

    }, {
      key: "isTrigger",
      get: function get() {
        return this._isTrigger;
      },
      set: function set(value) {
        this._isTrigger = value;

        if (this._shape) {
          this._shape.setAsTrigger(this._isTrigger);
        }
      }
      /**
       * @en
       * Gets or sets the center of the collider, in local space.
       * @zh
       * 获取或设置碰撞器的中心点。
       */

    }, {
      key: "center",
      get: function get() {
        return this._center;
      },
      set: function set(value) {
        _index3.Vec3.copy(this._center, value);

        if (this._shape) {
          this._shape.setCenter(this._center);
        }
      }
      /**
       * @en
       * Gets the wrapper object, through which the lowLevel instance can be accessed.
       * @zh
       * 获取封装对象，通过此对象可以访问到底层实例。
       */

    }, {
      key: "shape",
      get: function get() {
        return this._shape;
      }
    }, {
      key: "worldBounds",
      get: function get() {
        if (this._aabb == null) this._aabb = new _index5.aabb();
        if (this._shape) this._shape.getAABB(this._aabb);
        return this._aabb;
      }
    }, {
      key: "boundingSphere",
      get: function get() {
        if (this._boundingSphere == null) this._boundingSphere = new _index5.sphere();
        if (this._shape) this._shape.getBoundingSphere(this._boundingSphere);
        return this._boundingSphere;
      }
    }, {
      key: "needTriggerEvent",
      get: function get() {
        return this._needTriggerEvent;
      }
    }, {
      key: "needCollisionEvent",
      get: function get() {
        return this._needCollisionEvent;
      }
    }, {
      key: "_assertOnLoadCalled",
      get: function get() {
        var r = this._isOnLoadCalled == 0;

        if (r) {
          (0, _index4.error)('[Physics]: Please make sure that the node has been added to the scene');
        }

        return !r;
      }
    }, {
      key: "_assertUseCollisionMatrix",
      get: function get() {
        if (_physicsSystem.PhysicsSystem.instance.useCollisionMatrix) {
          (0, _index4.error)('[Physics]: useCollisionMatrix is turn on, using collision matrix instead please.');
        }

        return _physicsSystem.PhysicsSystem.instance.useCollisionMatrix;
      }
    }]);

    function Collider(type) {
      var _this;

      _classCallCheck(this, Collider);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Collider).call(this));
      _this.TYPE = void 0;
      _this._shape = null;
      _this._aabb = null;
      _this._boundingSphere = null;
      _this._isSharedMaterial = true;
      _this._needTriggerEvent = false;
      _this._needCollisionEvent = false;

      _initializerDefineProperty(_this, "_material", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_isTrigger", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_center", _descriptor3, _assertThisInitialized(_this));

      _this.TYPE = type;
      return _this;
    } /// EVENT INTERFACE ///

    /**
     * @en
     * Registers callbacks associated with triggered or collision events.
     * @zh
     * 注册触发或碰撞事件相关的回调。
     * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
     * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
     * @param target - The event callback target.
     */


    _createClass(Collider, [{
      key: "on",
      value: function on(type, callback, target, once) {
        var ret = _get(_getPrototypeOf(Collider.prototype), "on", this).call(this, type, callback, target, once);

        this._updateNeedEvent(type);

        return ret;
      }
      /**
       * @en
       * Unregisters callbacks associated with trigger or collision events that have been registered.
       * @zh
       * 取消已经注册的触发或碰撞事件相关的回调。
       * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
       * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
       * @param target - The event callback target.
       */

    }, {
      key: "off",
      value: function off(type, callback, target) {
        _get(_getPrototypeOf(Collider.prototype), "off", this).call(this, type, callback, target);

        this._updateNeedEvent();
      }
      /**
       * @en
       * Registers a callback associated with a trigger or collision event, which is automatically unregistered once executed.
       * @zh
       * 注册触发或碰撞事件相关的回调，执行一次后会自动取消注册。
       * @param type - The event type, onTriggerEnter|onTriggerStay|onTriggerExit|onCollisionEnter|onCollisionStay|onCollisionExit;
       * @param callback - The event callback, signature:`(event?:ICollisionEvent|ITriggerEvent)=>void`.
       * @param target - The event callback target.
       */

    }, {
      key: "once",
      value: function once(type, callback, target) {
        //TODO: callback invoker now is a entity, after `once` will not calling the upper `off`.
        var ret = _get(_getPrototypeOf(Collider.prototype), "once", this).call(this, type, callback, target);

        this._updateNeedEvent(type);

        return ret;
      }
      /**
       * @en
       * Removes all registered events of the specified target or type.
       * @zh
       * 移除所有指定目标或类型的注册事件。
       * @param typeOrTarget - The event type or target.
       */

    }, {
      key: "removeAll",
      value: function removeAll(typeOrTarget) {
        _get(_getPrototypeOf(Collider.prototype), "removeAll", this).call(this, typeOrTarget);

        this._updateNeedEvent();
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
          return this._shape.getGroup();
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
          if (_physicsSystem.PhysicsSystem.instance.useCollisionMatrix) {
            var body = this._shape.attachedRigidBody;

            if (body) {
              body.group = v;
            } else {
              this._shape.setGroup(v);

              this._updateMask();
            }
          } else {
            this._shape.setGroup(v);
          }
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
        if (this._assertOnLoadCalled) {
          if (!this._assertUseCollisionMatrix) {
            this._shape.addGroup(v);
          } else {
            var body = this._shape.attachedRigidBody;

            if (body) {
              body.group |= v;
            } else {
              this._shape.addGroup(v);

              this._updateMask();
            }
          }
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
        if (this._assertOnLoadCalled) {
          if (!this._assertUseCollisionMatrix) {
            this._shape.removeGroup(v);
          } else {
            var body = this._shape.attachedRigidBody;

            if (body) {
              body.group &= ~v;
            } else {
              this._shape.removeGroup(v);

              this._updateMask();
            }
          }
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
          return this._shape.getMask();
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
          this._shape.setMask(v);
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
          this._shape.addMask(v);
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
          this._shape.removeMask(v);
        }
      } /// COMPONENT LIFECYCLE ///

    }, {
      key: "onLoad",
      value: function onLoad() {
        if (!_defaultConstants.EDITOR) {
          this._shape = (0, _instance.createShape)(this.TYPE);

          this._shape.initialize(this);

          this.sharedMaterial = this._material == null ? _physicsSystem.PhysicsSystem.instance.defaultMaterial : this._material;

          this._shape.onLoad();
        }
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._shape) {
          this._shape.onEnable();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._shape) {
          this._shape.onDisable();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._shape) {
          if (this._material) {
            this._material.off('physics_material_update', this._updateMaterial, this);
          }

          this._shape.onDestroy();
        }
      }
    }, {
      key: "_updateMaterial",
      value: function _updateMaterial() {
        if (this._shape) {
          this._shape.setMaterial(this._material);
        }
      }
    }, {
      key: "_updateNeedEvent",
      value: function _updateNeedEvent(type) {
        if (this.isValid) {
          if (type !== undefined) {
            if (type == 'onCollisionEnter' || type == 'onCollisionStay' || type == 'onCollisionExit') {
              this._needCollisionEvent = true;
            } else if (type == 'onTriggerEnter' || type == 'onTriggerStay' || type == 'onTriggerExit') {
              this._needTriggerEvent = true;
            }
          } else {
            if (!(this.hasEventListener('onTriggerEnter') || this.hasEventListener('onTriggerStay') || this.hasEventListener('onTriggerExit'))) {
              this._needTriggerEvent = false;
            } else if (!(this.hasEventListener('onCollisionEnter') || this.hasEventListener('onCollisionStay') || this.hasEventListener('onCollisionExit'))) {
              this._needCollisionEvent = false;
            }
          }
        }
      }
    }, {
      key: "_updateMask",
      value: function _updateMask() {
        this._shape.setMask(_physicsSystem.PhysicsSystem.instance.collisionMatrix[this._shape.getGroup()]);
      }
    }]);

    return Collider;
  }((0, _index2.Eventify)(_index4.Component)), _class3.EColliderType = _physicsEnum.EColliderType, _class3.EAxisDirection = _physicsEnum.EAxisDirection, _temp), (_applyDecoratedDescriptor(_class2.prototype, "attachedRigidBody", [_dec2, _index.readOnly, _dec3, _dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "attachedRigidBody"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "sharedMaterial", [_dec5, _dec6, _dec7, _dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "sharedMaterial"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "isTrigger", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "isTrigger"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "center", [_dec11, _dec12, _dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "center"), _class2.prototype), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "_material", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_isTrigger", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_center", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index3.Vec3();
    }
  })), _class2)) || _class);
  _exports.Collider = Collider;

  (function (_Collider) {})(Collider || (_exports.Collider = Collider = {}));

  function findAttachedBody(node) {
    var rb = node.getComponent(_rigidBody.RigidBody);

    if (rb && rb.isValid) {
      return rb;
    } else {
      if (node.parent == null || node.parent == node.scene) return null;
      return findAttachedBody(node.parent);
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL2NvbXBvbmVudHMvY29sbGlkZXJzL2NvbGxpZGVyLnRzIl0sIm5hbWVzIjpbIkNvbGxpZGVyIiwiUmlnaWRCb2R5IiwiUGh5c2ljTWF0ZXJpYWwiLCJWZWMzIiwiZmluZEF0dGFjaGVkQm9keSIsIm5vZGUiLCJfbWF0ZXJpYWwiLCJ2YWx1ZSIsIkVESVRPUiIsIm1hdGVyaWFsIiwiX2lzU2hhcmVkTWF0ZXJpYWwiLCJvZmYiLCJfdXBkYXRlTWF0ZXJpYWwiLCJjbG9uZSIsIm9uIiwiX3NoYXBlIiwiX3V1aWQiLCJfaXNUcmlnZ2VyIiwic2V0QXNUcmlnZ2VyIiwiX2NlbnRlciIsImNvcHkiLCJzZXRDZW50ZXIiLCJfYWFiYiIsImFhYmIiLCJnZXRBQUJCIiwiX2JvdW5kaW5nU3BoZXJlIiwic3BoZXJlIiwiZ2V0Qm91bmRpbmdTcGhlcmUiLCJfbmVlZFRyaWdnZXJFdmVudCIsIl9uZWVkQ29sbGlzaW9uRXZlbnQiLCJyIiwiX2lzT25Mb2FkQ2FsbGVkIiwiUGh5c2ljc1N5c3RlbSIsImluc3RhbmNlIiwidXNlQ29sbGlzaW9uTWF0cml4IiwidHlwZSIsIlRZUEUiLCJjYWxsYmFjayIsInRhcmdldCIsIm9uY2UiLCJyZXQiLCJfdXBkYXRlTmVlZEV2ZW50IiwidHlwZU9yVGFyZ2V0IiwiX2Fzc2VydE9uTG9hZENhbGxlZCIsImdldEdyb3VwIiwidiIsImJvZHkiLCJhdHRhY2hlZFJpZ2lkQm9keSIsImdyb3VwIiwic2V0R3JvdXAiLCJfdXBkYXRlTWFzayIsIl9hc3NlcnRVc2VDb2xsaXNpb25NYXRyaXgiLCJhZGRHcm91cCIsInJlbW92ZUdyb3VwIiwiZ2V0TWFzayIsInNldE1hc2siLCJhZGRNYXNrIiwicmVtb3ZlTWFzayIsImluaXRpYWxpemUiLCJzaGFyZWRNYXRlcmlhbCIsImRlZmF1bHRNYXRlcmlhbCIsIm9uTG9hZCIsIm9uRW5hYmxlIiwib25EaXNhYmxlIiwib25EZXN0cm95Iiwic2V0TWF0ZXJpYWwiLCJpc1ZhbGlkIiwidW5kZWZpbmVkIiwiaGFzRXZlbnRMaXN0ZW5lciIsImNvbGxpc2lvbk1hdHJpeCIsIkNvbXBvbmVudCIsIkVDb2xsaWRlclR5cGUiLCJFQXhpc0RpcmVjdGlvbiIsInJlYWRPbmx5Iiwic2VyaWFsaXphYmxlIiwicmIiLCJnZXRDb21wb25lbnQiLCJwYXJlbnQiLCJzY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQkE7Ozs7OztNQU9hQSxRLFdBRFosb0JBQVEsYUFBUixDLFVBY0ksaUJBQUtDLG9CQUFMLEMsVUFFQSx3QkFBWSxVQUFaLEMsVUFDQSx5QkFBYSxDQUFDLENBQWQsQyxVQVlBLGlCQUFLQyw4QkFBTCxDLFVBQ0Esd0JBQVksVUFBWixDLFVBQ0EseUJBQWEsQ0FBQyxDQUFkLEMsVUFDQSxvQkFBUSxLQUFSLEMsVUF1REEseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsc0JBQVIsQyxXQWtCQSxpQkFBS0MsWUFBTCxDLFdBQ0EseUJBQWEsQ0FBYixDLFdBQ0Esb0JBQVEsMkJBQVIsQyxXQXNEQSxpQkFBS0QsOEJBQUwsQzs7Ozs7QUE1SkQ7O0FBRUE7Ozs7OzswQkFVa0Q7QUFDOUMsZUFBT0UsZ0JBQWdCLENBQUMsS0FBS0MsSUFBTixDQUF2QixDQUQ4QyxDQUU5QztBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFVNkI7QUFDekIsZUFBTyxLQUFLQyxTQUFaO0FBQ0gsTzt3QkFFMEJDLEssRUFBTztBQUM5QixZQUFJQyx3QkFBSixFQUFZO0FBQ1IsZUFBS0YsU0FBTCxHQUFpQkMsS0FBakI7QUFDSCxTQUZELE1BRU87QUFDSCxlQUFLRSxRQUFMLEdBQWdCRixLQUFoQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQU11QjtBQUNuQixZQUFJLEtBQUtHLGlCQUFMLElBQTBCLEtBQUtKLFNBQUwsSUFBa0IsSUFBaEQsRUFBc0Q7QUFDbEQsZUFBS0EsU0FBTCxDQUFlSyxHQUFmLENBQW1CLHlCQUFuQixFQUE4QyxLQUFLQyxlQUFuRCxFQUFvRSxJQUFwRTs7QUFDQSxlQUFLTixTQUFMLEdBQWlCLEtBQUtBLFNBQUwsQ0FBZU8sS0FBZixFQUFqQjs7QUFDQSxlQUFLUCxTQUFMLENBQWVRLEVBQWYsQ0FBa0IseUJBQWxCLEVBQTZDLEtBQUtGLGVBQWxELEVBQW1FLElBQW5FOztBQUNBLGVBQUtGLGlCQUFMLEdBQXlCLEtBQXpCO0FBQ0g7O0FBQ0QsZUFBTyxLQUFLSixTQUFaO0FBQ0gsTzt3QkFFb0JDLEssRUFBTztBQUN4QixZQUFJLEtBQUtRLE1BQVQsRUFBaUI7QUFDYixjQUFJUixLQUFLLElBQUksSUFBVCxJQUFpQixLQUFLRCxTQUFMLElBQWtCLElBQXZDLEVBQTZDO0FBQ3pDLGdCQUFJLEtBQUtBLFNBQUwsQ0FBZVUsS0FBZixJQUF3QlQsS0FBSyxDQUFDUyxLQUFsQyxFQUF5QztBQUNyQyxtQkFBS1YsU0FBTCxDQUFlSyxHQUFmLENBQW1CLHlCQUFuQixFQUE4QyxLQUFLQyxlQUFuRCxFQUFvRSxJQUFwRTs7QUFDQUwsY0FBQUEsS0FBSyxDQUFDTyxFQUFOLENBQVMseUJBQVQsRUFBb0MsS0FBS0YsZUFBekMsRUFBMEQsSUFBMUQ7QUFDQSxtQkFBS0YsaUJBQUwsR0FBeUIsS0FBekI7QUFDQSxtQkFBS0osU0FBTCxHQUFpQkMsS0FBakI7QUFDSDtBQUNKLFdBUEQsTUFPTyxJQUFJQSxLQUFLLElBQUksSUFBVCxJQUFpQixLQUFLRCxTQUFMLElBQWtCLElBQXZDLEVBQTZDO0FBQ2hEQyxZQUFBQSxLQUFLLENBQUNPLEVBQU4sQ0FBUyx5QkFBVCxFQUFvQyxLQUFLRixlQUF6QyxFQUEwRCxJQUExRDtBQUNBLGlCQUFLTixTQUFMLEdBQWlCQyxLQUFqQjtBQUNILFdBSE0sTUFHQSxJQUFJQSxLQUFLLElBQUksSUFBVCxJQUFpQixLQUFLRCxTQUFMLElBQWtCLElBQXZDLEVBQTZDO0FBQ2hELGlCQUFLQSxTQUFMLENBQWdCSyxHQUFoQixDQUFvQix5QkFBcEIsRUFBK0MsS0FBS0MsZUFBcEQsRUFBcUUsSUFBckU7O0FBQ0EsaUJBQUtOLFNBQUwsR0FBaUJDLEtBQWpCO0FBQ0g7O0FBQ0QsZUFBS0ssZUFBTDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQVF3QjtBQUNwQixlQUFPLEtBQUtLLFVBQVo7QUFDSCxPO3dCQUVxQlYsSyxFQUFPO0FBQ3pCLGFBQUtVLFVBQUwsR0FBa0JWLEtBQWxCOztBQUNBLFlBQUksS0FBS1EsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWUcsWUFBWixDQUF5QixLQUFLRCxVQUE5QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzBCQVNxQjtBQUNqQixlQUFPLEtBQUtFLE9BQVo7QUFDSCxPO3dCQUVrQlosSyxFQUFhO0FBQzVCSixxQkFBS2lCLElBQUwsQ0FBVSxLQUFLRCxPQUFmLEVBQXdCWixLQUF4Qjs7QUFDQSxZQUFJLEtBQUtRLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVlNLFNBQVosQ0FBc0IsS0FBS0YsT0FBM0I7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7OzswQkFNb0I7QUFDaEIsZUFBTyxLQUFLSixNQUFaO0FBQ0g7OzswQkFFeUM7QUFDdEMsWUFBSSxLQUFLTyxLQUFMLElBQWMsSUFBbEIsRUFBd0IsS0FBS0EsS0FBTCxHQUFhLElBQUlDLFlBQUosRUFBYjtBQUN4QixZQUFJLEtBQUtSLE1BQVQsRUFBaUIsS0FBS0EsTUFBTCxDQUFZUyxPQUFaLENBQW9CLEtBQUtGLEtBQXpCO0FBQ2pCLGVBQU8sS0FBS0EsS0FBWjtBQUNIOzs7MEJBRThDO0FBQzNDLFlBQUksS0FBS0csZUFBTCxJQUF3QixJQUE1QixFQUFrQyxLQUFLQSxlQUFMLEdBQXVCLElBQUlDLGNBQUosRUFBdkI7QUFDbEMsWUFBSSxLQUFLWCxNQUFULEVBQWlCLEtBQUtBLE1BQUwsQ0FBWVksaUJBQVosQ0FBOEIsS0FBS0YsZUFBbkM7QUFDakIsZUFBTyxLQUFLQSxlQUFaO0FBQ0g7OzswQkFFOEI7QUFDM0IsZUFBTyxLQUFLRyxpQkFBWjtBQUNIOzs7MEJBRWdDO0FBQzdCLGVBQU8sS0FBS0MsbUJBQVo7QUFDSDs7OzBCQXVCNkM7QUFDMUMsWUFBTUMsQ0FBQyxHQUFHLEtBQUtDLGVBQUwsSUFBd0IsQ0FBbEM7O0FBQ0EsWUFBSUQsQ0FBSixFQUFPO0FBQUUsNkJBQU0sdUVBQU47QUFBaUY7O0FBQzFGLGVBQU8sQ0FBQ0EsQ0FBUjtBQUNIOzs7MEJBRW1EO0FBQ2hELFlBQUlFLDZCQUFjQyxRQUFkLENBQXVCQyxrQkFBM0IsRUFBK0M7QUFDM0MsNkJBQU0sa0ZBQU47QUFDSDs7QUFDRCxlQUFPRiw2QkFBY0MsUUFBZCxDQUF1QkMsa0JBQTlCO0FBQ0g7OztBQUVELHNCQUFhQyxJQUFiLEVBQWtDO0FBQUE7O0FBQUE7O0FBQzlCO0FBRDhCLFlBbEN6QkMsSUFrQ3lCO0FBQUEsWUE5QnhCckIsTUE4QndCLEdBOUJJLElBOEJKO0FBQUEsWUE3QnhCTyxLQTZCd0IsR0E3QkgsSUE2Qkc7QUFBQSxZQTVCeEJHLGVBNEJ3QixHQTVCUyxJQTRCVDtBQUFBLFlBM0J4QmYsaUJBMkJ3QixHQTNCSyxJQTJCTDtBQUFBLFlBMUJ4QmtCLGlCQTBCd0IsR0ExQkssS0EwQkw7QUFBQSxZQXpCeEJDLG1CQXlCd0IsR0F6Qk8sS0F5QlA7O0FBQUE7O0FBQUE7O0FBQUE7O0FBRTlCLFlBQUtPLElBQUwsR0FBWUQsSUFBWjtBQUY4QjtBQUdqQyxLLENBRUQ7O0FBRUE7Ozs7Ozs7Ozs7Ozs7eUJBU1dBLEksRUFBNkNFLFEsRUFBb0JDLE0sRUFBaUJDLEksRUFBcUI7QUFDOUcsWUFBTUMsR0FBRyxvRUFBWUwsSUFBWixFQUFrQkUsUUFBbEIsRUFBNEJDLE1BQTVCLEVBQW9DQyxJQUFwQyxDQUFUOztBQUNBLGFBQUtFLGdCQUFMLENBQXNCTixJQUF0Qjs7QUFDQSxlQUFPSyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OzBCQVNZTCxJLEVBQTZDRSxRLEVBQXFCQyxNLEVBQWlCO0FBQzNGLDBFQUFVSCxJQUFWLEVBQWdCRSxRQUFoQixFQUEwQkMsTUFBMUI7O0FBQ0EsYUFBS0csZ0JBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7MkJBU2FOLEksRUFBNkNFLFEsRUFBb0JDLE0sRUFBc0I7QUFDaEc7QUFDQSxZQUFNRSxHQUFHLHNFQUFjTCxJQUFkLEVBQW9CRSxRQUFwQixFQUE4QkMsTUFBOUIsQ0FBVDs7QUFDQSxhQUFLRyxnQkFBTCxDQUFzQk4sSUFBdEI7O0FBQ0EsZUFBT0ssR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Z0NBT2tCRSxZLEVBQTBEO0FBQ3hFLGdGQUFnQkEsWUFBaEI7O0FBQ0EsYUFBS0QsZ0JBQUw7QUFDSCxPLENBRUQ7O0FBRUE7Ozs7Ozs7Ozs7aUNBTzJCO0FBQ3ZCLFlBQUksS0FBS0UsbUJBQVQsRUFBOEI7QUFDMUIsaUJBQU8sS0FBSzVCLE1BQUwsQ0FBYTZCLFFBQWIsRUFBUDtBQUNIOztBQUNELGVBQU8sQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7K0JBT2lCQyxDLEVBQWlCO0FBQzlCLFlBQUksS0FBS0YsbUJBQVQsRUFBOEI7QUFDMUIsY0FBSVgsNkJBQWNDLFFBQWQsQ0FBdUJDLGtCQUEzQixFQUErQztBQUMzQyxnQkFBTVksSUFBSSxHQUFHLEtBQUsvQixNQUFMLENBQWFnQyxpQkFBMUI7O0FBQ0EsZ0JBQUlELElBQUosRUFBVTtBQUNOQSxjQUFBQSxJQUFJLENBQUNFLEtBQUwsR0FBYUgsQ0FBYjtBQUNILGFBRkQsTUFFTztBQUNILG1CQUFLOUIsTUFBTCxDQUFha0MsUUFBYixDQUFzQkosQ0FBdEI7O0FBQ0EsbUJBQUtLLFdBQUw7QUFDSDtBQUNKLFdBUkQsTUFRTztBQUNILGlCQUFLbkMsTUFBTCxDQUFha0MsUUFBYixDQUFzQkosQ0FBdEI7QUFDSDtBQUNKO0FBQ0o7QUFFRDs7Ozs7Ozs7OzsrQkFPaUJBLEMsRUFBVztBQUN4QixZQUFJLEtBQUtGLG1CQUFULEVBQThCO0FBQzFCLGNBQUksQ0FBQyxLQUFLUSx5QkFBVixFQUFxQztBQUNqQyxpQkFBS3BDLE1BQUwsQ0FBYXFDLFFBQWIsQ0FBc0JQLENBQXRCO0FBQ0gsV0FGRCxNQUVPO0FBQ0gsZ0JBQU1DLElBQUksR0FBRyxLQUFLL0IsTUFBTCxDQUFhZ0MsaUJBQTFCOztBQUNBLGdCQUFJRCxJQUFKLEVBQVU7QUFDTkEsY0FBQUEsSUFBSSxDQUFDRSxLQUFMLElBQWNILENBQWQ7QUFDSCxhQUZELE1BRU87QUFDSCxtQkFBSzlCLE1BQUwsQ0FBYXFDLFFBQWIsQ0FBc0JQLENBQXRCOztBQUNBLG1CQUFLSyxXQUFMO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7QUFFRDs7Ozs7Ozs7OztrQ0FPb0JMLEMsRUFBVztBQUMzQixZQUFJLEtBQUtGLG1CQUFULEVBQThCO0FBQzFCLGNBQUksQ0FBQyxLQUFLUSx5QkFBVixFQUFxQztBQUNqQyxpQkFBS3BDLE1BQUwsQ0FBYXNDLFdBQWIsQ0FBeUJSLENBQXpCO0FBQ0gsV0FGRCxNQUVPO0FBQ0gsZ0JBQU1DLElBQUksR0FBRyxLQUFLL0IsTUFBTCxDQUFhZ0MsaUJBQTFCOztBQUNBLGdCQUFJRCxJQUFKLEVBQVU7QUFDTkEsY0FBQUEsSUFBSSxDQUFDRSxLQUFMLElBQWMsQ0FBQ0gsQ0FBZjtBQUNILGFBRkQsTUFFTztBQUNILG1CQUFLOUIsTUFBTCxDQUFhc0MsV0FBYixDQUF5QlIsQ0FBekI7O0FBQ0EsbUJBQUtLLFdBQUw7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7Ozs7O2dDQU8wQjtBQUN0QixZQUFJLEtBQUtQLG1CQUFULEVBQThCO0FBQzFCLGlCQUFPLEtBQUs1QixNQUFMLENBQWF1QyxPQUFiLEVBQVA7QUFDSDs7QUFDRCxlQUFPLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OzhCQU9nQlQsQyxFQUFXO0FBQ3ZCLFlBQUksS0FBS0YsbUJBQUwsSUFBNEIsQ0FBQyxLQUFLUSx5QkFBdEMsRUFBaUU7QUFDN0QsZUFBS3BDLE1BQUwsQ0FBYXdDLE9BQWIsQ0FBcUJWLENBQXJCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7OzhCQU9nQkEsQyxFQUFXO0FBQ3ZCLFlBQUksS0FBS0YsbUJBQUwsSUFBNEIsQ0FBQyxLQUFLUSx5QkFBdEMsRUFBaUU7QUFDN0QsZUFBS3BDLE1BQUwsQ0FBYXlDLE9BQWIsQ0FBcUJYLENBQXJCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7O2lDQU9tQkEsQyxFQUFXO0FBQzFCLFlBQUksS0FBS0YsbUJBQUwsSUFBNEIsQ0FBQyxLQUFLUSx5QkFBdEMsRUFBaUU7QUFDN0QsZUFBS3BDLE1BQUwsQ0FBYTBDLFVBQWIsQ0FBd0JaLENBQXhCO0FBQ0g7QUFDSixPLENBR0Q7Ozs7K0JBRW9CO0FBQ2hCLFlBQUksQ0FBQ3JDLHdCQUFMLEVBQWE7QUFDVCxlQUFLTyxNQUFMLEdBQWMsMkJBQVksS0FBS3FCLElBQWpCLENBQWQ7O0FBQ0EsZUFBS3JCLE1BQUwsQ0FBWTJDLFVBQVosQ0FBdUIsSUFBdkI7O0FBQ0EsZUFBS0MsY0FBTCxHQUFzQixLQUFLckQsU0FBTCxJQUFrQixJQUFsQixHQUF5QjBCLDZCQUFjQyxRQUFkLENBQXVCMkIsZUFBaEQsR0FBa0UsS0FBS3RELFNBQTdGOztBQUNBLGVBQUtTLE1BQUwsQ0FBWThDLE1BQVo7QUFDSDtBQUNKOzs7aUNBRXFCO0FBQ2xCLFlBQUksS0FBSzlDLE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVkrQyxRQUFaO0FBQ0g7QUFDSjs7O2tDQUVzQjtBQUNuQixZQUFJLEtBQUsvQyxNQUFULEVBQWlCO0FBQ2IsZUFBS0EsTUFBTCxDQUFZZ0QsU0FBWjtBQUNIO0FBQ0o7OztrQ0FFc0I7QUFDbkIsWUFBSSxLQUFLaEQsTUFBVCxFQUFpQjtBQUNiLGNBQUksS0FBS1QsU0FBVCxFQUFvQjtBQUNoQixpQkFBS0EsU0FBTCxDQUFlSyxHQUFmLENBQW1CLHlCQUFuQixFQUE4QyxLQUFLQyxlQUFuRCxFQUFvRSxJQUFwRTtBQUNIOztBQUNELGVBQUtHLE1BQUwsQ0FBWWlELFNBQVo7QUFDSDtBQUNKOzs7d0NBRTBCO0FBQ3ZCLFlBQUksS0FBS2pELE1BQVQsRUFBaUI7QUFDYixlQUFLQSxNQUFMLENBQVlrRCxXQUFaLENBQXdCLEtBQUszRCxTQUE3QjtBQUNIO0FBQ0o7Ozt1Q0FFeUI2QixJLEVBQWU7QUFDckMsWUFBSSxLQUFLK0IsT0FBVCxFQUFrQjtBQUNkLGNBQUkvQixJQUFJLEtBQUtnQyxTQUFiLEVBQXdCO0FBQ3BCLGdCQUFJaEMsSUFBSSxJQUFJLGtCQUFSLElBQThCQSxJQUFJLElBQUksaUJBQXRDLElBQTJEQSxJQUFJLElBQUksaUJBQXZFLEVBQTBGO0FBQ3RGLG1CQUFLTixtQkFBTCxHQUEyQixJQUEzQjtBQUNILGFBRkQsTUFFTyxJQUFJTSxJQUFJLElBQUksZ0JBQVIsSUFBNEJBLElBQUksSUFBSSxlQUFwQyxJQUF1REEsSUFBSSxJQUFJLGVBQW5FLEVBQW9GO0FBQ3ZGLG1CQUFLUCxpQkFBTCxHQUF5QixJQUF6QjtBQUNIO0FBQ0osV0FORCxNQU1PO0FBQ0gsZ0JBQUksRUFBRSxLQUFLd0MsZ0JBQUwsQ0FBc0IsZ0JBQXRCLEtBQTJDLEtBQUtBLGdCQUFMLENBQXNCLGVBQXRCLENBQTNDLElBQXFGLEtBQUtBLGdCQUFMLENBQXNCLGVBQXRCLENBQXZGLENBQUosRUFBb0k7QUFDaEksbUJBQUt4QyxpQkFBTCxHQUF5QixLQUF6QjtBQUNILGFBRkQsTUFFTyxJQUFJLEVBQUUsS0FBS3dDLGdCQUFMLENBQXNCLGtCQUF0QixLQUE2QyxLQUFLQSxnQkFBTCxDQUFzQixpQkFBdEIsQ0FBN0MsSUFBeUYsS0FBS0EsZ0JBQUwsQ0FBc0IsaUJBQXRCLENBQTNGLENBQUosRUFBMEk7QUFDN0ksbUJBQUt2QyxtQkFBTCxHQUEyQixLQUEzQjtBQUNIO0FBQ0o7QUFDSjtBQUNKOzs7b0NBRXNCO0FBQ25CLGFBQUtkLE1BQUwsQ0FBYXdDLE9BQWIsQ0FBcUJ2Qiw2QkFBY0MsUUFBZCxDQUF1Qm9DLGVBQXZCLENBQXVDLEtBQUt0RCxNQUFMLENBQWE2QixRQUFiLEVBQXZDLENBQXJCO0FBQ0g7Ozs7SUE1YnlCLHNCQUFTMEIsaUJBQVQsQyxXQUVWQyxhLEdBQWdCQSwwQixVQUNoQkMsYyxHQUFpQkEsMkIscUZBV2hDQyxlOzs7OzthQW9KNEMsSTs7aUZBRTVDQyxtQjs7Ozs7YUFDK0IsSzs7OEVBRS9CQSxtQjs7Ozs7YUFDa0MsSUFBSXZFLFlBQUosRTs7Ozs7NEJBdVJ0QkgsUSx5QkFBQUEsUTs7QUFLakIsV0FBU0ksZ0JBQVQsQ0FBMkJDLElBQTNCLEVBQXlEO0FBQ3JELFFBQU1zRSxFQUFFLEdBQUd0RSxJQUFJLENBQUN1RSxZQUFMLENBQWtCM0Usb0JBQWxCLENBQVg7O0FBQ0EsUUFBSTBFLEVBQUUsSUFBSUEsRUFBRSxDQUFDVCxPQUFiLEVBQXNCO0FBQ2xCLGFBQU9TLEVBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxVQUFJdEUsSUFBSSxDQUFDd0UsTUFBTCxJQUFlLElBQWYsSUFBdUJ4RSxJQUFJLENBQUN3RSxNQUFMLElBQWV4RSxJQUFJLENBQUN5RSxLQUEvQyxFQUFzRCxPQUFPLElBQVA7QUFDdEQsYUFBTzFFLGdCQUFnQixDQUFDQyxJQUFJLENBQUN3RSxNQUFOLENBQXZCO0FBQ0g7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGh5c2ljc1xyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIHRvb2x0aXAsIGRpc3BsYXlPcmRlciwgZGlzcGxheU5hbWUsIHJlYWRPbmx5LCB0eXBlLCBzZXJpYWxpemFibGUgfSBmcm9tICdjYy5kZWNvcmF0b3InO1xyXG5pbXBvcnQgeyBFdmVudGlmeSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUvZXZlbnQnO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vLi4vLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgQ29sbGlzaW9uRXZlbnRUeXBlLCBUcmlnZ2VyRXZlbnRUeXBlIH0gZnJvbSAnLi4vLi4vcGh5c2ljcy1pbnRlcmZhY2UnO1xyXG5pbXBvcnQgeyBSaWdpZEJvZHkgfSBmcm9tICcuLi9yaWdpZC1ib2R5JztcclxuaW1wb3J0IHsgUGh5c2ljTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvcGh5c2ljLW1hdGVyaWFsJztcclxuaW1wb3J0IHsgUGh5c2ljc1N5c3RlbSB9IGZyb20gJy4uLy4uL3BoeXNpY3Mtc3lzdGVtJztcclxuaW1wb3J0IHsgQ29tcG9uZW50LCBlcnJvciwgTm9kZSB9IGZyb20gJy4uLy4uLy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBJQmFzZVNoYXBlIH0gZnJvbSAnLi4vLi4vLi4vc3BlYy9pLXBoeXNpY3Mtc2hhcGUnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBhYWJiLCBzcGhlcmUgfSBmcm9tICcuLi8uLi8uLi8uLi9jb3JlL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgRUNvbGxpZGVyVHlwZSwgRUF4aXNEaXJlY3Rpb24gfSBmcm9tICcuLi8uLi9waHlzaWNzLWVudW0nO1xyXG5pbXBvcnQgeyBjcmVhdGVTaGFwZSB9IGZyb20gJy4uLy4uL2luc3RhbmNlJztcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQmFzZSBjbGFzcyBvZiBjb2xsaWRlci5cclxuICogQHpoXHJcbiAqIOeisOaSnuWZqOeahOWfuuexu+OAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLkNvbGxpZGVyJylcclxuZXhwb3J0IGNsYXNzIENvbGxpZGVyIGV4dGVuZHMgRXZlbnRpZnkoQ29tcG9uZW50KSB7XHJcblxyXG4gICAgc3RhdGljIHJlYWRvbmx5IEVDb2xsaWRlclR5cGUgPSBFQ29sbGlkZXJUeXBlO1xyXG4gICAgc3RhdGljIHJlYWRvbmx5IEVBeGlzRGlyZWN0aW9uID0gRUF4aXNEaXJlY3Rpb247XHJcblxyXG4gICAgLy8vIFBVQkxJQyBQUk9QRVJUWSBHRVRURVJcXFNFVFRFUiAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgY29sbGlkZXIgYXR0YWNoZWQgcmlnaWQtYm9keSwgdGhpcyBtYXkgYmUgbnVsbC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W56Kw5pKe5Zmo5omA57uR5a6a55qE5Yia5L2T57uE5Lu277yM5Y+v6IO95Li6IG51bGwg44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKFJpZ2lkQm9keSlcclxuICAgIEByZWFkT25seVxyXG4gICAgQGRpc3BsYXlOYW1lKCdBdHRhY2hlZCcpXHJcbiAgICBAZGlzcGxheU9yZGVyKC0yKVxyXG4gICAgcHVibGljIGdldCBhdHRhY2hlZFJpZ2lkQm9keSAoKTogUmlnaWRCb2R5IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRBdHRhY2hlZEJvZHkodGhpcy5ub2RlKTtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5fYXR0YWNoZWRSaWdpZEJvZHk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgcGh5c2ljYWwgbWF0ZXJpYWwgZm9yIHRoaXMgY29sbGlkZXIuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruatpOeisOaSnuWZqOeahOeJqeeQhuadkOi0qOOAglxyXG4gICAgICovXHJcbiAgICBAdHlwZShQaHlzaWNNYXRlcmlhbClcclxuICAgIEBkaXNwbGF5TmFtZSgnTWF0ZXJpYWwnKVxyXG4gICAgQGRpc3BsYXlPcmRlcigtMSlcclxuICAgIEB0b29sdGlwKCfmupDmnZDotKgnKVxyXG4gICAgcHVibGljIGdldCBzaGFyZWRNYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21hdGVyaWFsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgc2hhcmVkTWF0ZXJpYWwgKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCA9IHZhbHVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0ZXJpYWwgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgcGh5c2ljcyBtYXRlcmlhbCBmb3IgdGhpcyBjb2xsaWRlciwgd2hpY2ggaW4gU2hhcmVkIHN0YXRlIHdpbGwgZ2VuZXJhdGUgYSBuZXcgaW5zdGFuY2UuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9ruatpOeisOaSnuWZqOeahOeJqeeQhuadkOi0qO+8jOWFseS6q+eKtuaAgeS4i+iOt+WPluWwhuS8mueUn+aIkOaWsOeahOWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IG1hdGVyaWFsICgpIHtcclxuICAgICAgICBpZiAodGhpcy5faXNTaGFyZWRNYXRlcmlhbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsLm9mZigncGh5c2ljc19tYXRlcmlhbF91cGRhdGUnLCB0aGlzLl91cGRhdGVNYXRlcmlhbCwgdGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdGhpcy5fbWF0ZXJpYWwuY2xvbmUoKTtcclxuICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwub24oJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9pc1NoYXJlZE1hdGVyaWFsID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IG1hdGVyaWFsICh2YWx1ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFwZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbWF0ZXJpYWwuX3V1aWQgIT0gdmFsdWUuX3V1aWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbC5vZmYoJ3BoeXNpY3NfbWF0ZXJpYWxfdXBkYXRlJywgdGhpcy5fdXBkYXRlTWF0ZXJpYWwsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9pc1NoYXJlZE1hdGVyaWFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSAhPSBudWxsICYmIHRoaXMuX21hdGVyaWFsID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLm9uKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT0gbnVsbCAmJiB0aGlzLl9tYXRlcmlhbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXRlcmlhbCEub2ZmKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21hdGVyaWFsID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgb3Igc2V0cyB0aGUgY29sbGlkZXIgaXMgdHJpZ2dlciwgdGhpcyB3aWxsIGJlIGFsd2F5cyB0cmlnZ2VyIGlmIHVzaW5nIGJ1aWx0aW4uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluaIluiuvue9rueisOaSnuWZqOaYr+WQpuS4uuinpuWPkeWZqO+8jOiLpeS9v+eUqCBidWlsdGluIO+8jOWxnuaAp+WAvOaXoOiuuuecn+WBhyDvvIzmraTnorDmkp7lmajpg73kuLrop6blj5HlmajjgIJcclxuICAgICAqL1xyXG4gICAgQGRpc3BsYXlPcmRlcigwKVxyXG4gICAgQHRvb2x0aXAoJ+aYr+WQpuS4juWFtuWug+eisOaSnuWZqOS6p+eUn+eisOaSnu+8jOW5tuS6p+eUn+eJqeeQhuihjOS4uicpXHJcbiAgICBwdWJsaWMgZ2V0IGlzVHJpZ2dlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzVHJpZ2dlcjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IGlzVHJpZ2dlciAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9pc1RyaWdnZXIgPSB2YWx1ZTtcclxuICAgICAgICBpZiAodGhpcy5fc2hhcGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUuc2V0QXNUcmlnZ2VyKHRoaXMuX2lzVHJpZ2dlcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIG9yIHNldHMgdGhlIGNlbnRlciBvZiB0aGUgY29sbGlkZXIsIGluIGxvY2FsIHNwYWNlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmiJborr7nva7norDmkp7lmajnmoTkuK3lv4PngrnjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoVmVjMylcclxuICAgIEBkaXNwbGF5T3JkZXIoMSlcclxuICAgIEB0b29sdGlwKCflvaLnirbnmoTkuK3lv4PngrnvvIjkuI7miYDlnKggTm9kZSDkuK3lv4PngrnnmoTnm7jlr7nkvY3nva7vvIknKVxyXG4gICAgcHVibGljIGdldCBjZW50ZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jZW50ZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldCBjZW50ZXIgKHZhbHVlOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2NlbnRlciwgdmFsdWUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFwZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5zZXRDZW50ZXIodGhpcy5fY2VudGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHdyYXBwZXIgb2JqZWN0LCB0aHJvdWdoIHdoaWNoIHRoZSBsb3dMZXZlbCBpbnN0YW5jZSBjYW4gYmUgYWNjZXNzZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluWwgeijheWvueixoe+8jOmAmui/h+atpOWvueixoeWPr+S7peiuv+mXruWIsOW6leWxguWunuS+i+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHNoYXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCB3b3JsZEJvdW5kcyAoKTogUmVhZG9ubHk8YWFiYj4ge1xyXG4gICAgICAgIGlmICh0aGlzLl9hYWJiID09IG51bGwpIHRoaXMuX2FhYmIgPSBuZXcgYWFiYigpO1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFwZSkgdGhpcy5fc2hhcGUuZ2V0QUFCQih0aGlzLl9hYWJiKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYWFiYjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGJvdW5kaW5nU3BoZXJlICgpOiBSZWFkb25seTxzcGhlcmU+IHtcclxuICAgICAgICBpZiAodGhpcy5fYm91bmRpbmdTcGhlcmUgPT0gbnVsbCkgdGhpcy5fYm91bmRpbmdTcGhlcmUgPSBuZXcgc3BoZXJlKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NoYXBlKSB0aGlzLl9zaGFwZS5nZXRCb3VuZGluZ1NwaGVyZSh0aGlzLl9ib3VuZGluZ1NwaGVyZSk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kaW5nU3BoZXJlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgbmVlZFRyaWdnZXJFdmVudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lZWRUcmlnZ2VyRXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBuZWVkQ29sbGlzaW9uRXZlbnQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9uZWVkQ29sbGlzaW9uRXZlbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmVhZG9ubHkgVFlQRTogRUNvbGxpZGVyVHlwZTtcclxuXHJcbiAgICAvLy8gUFJPVEVDVEVEIFBST1BFUlRZIC8vL1xyXG5cclxuICAgIHByb3RlY3RlZCBfc2hhcGU6IElCYXNlU2hhcGUgfCBudWxsID0gbnVsbDtcclxuICAgIHByb3RlY3RlZCBfYWFiYjogYWFiYiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJvdGVjdGVkIF9ib3VuZGluZ1NwaGVyZTogc3BoZXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2lzU2hhcmVkTWF0ZXJpYWw6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJvdGVjdGVkIF9uZWVkVHJpZ2dlckV2ZW50OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX25lZWRDb2xsaXNpb25FdmVudDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgLy8gcHJvdGVjdGVkIF9hdHRhY2hlZFJpZ2lkQm9keTogUmlnaWRCb2R5IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgQHR5cGUoUGh5c2ljTWF0ZXJpYWwpXHJcbiAgICBwcm90ZWN0ZWQgX21hdGVyaWFsOiBQaHlzaWNNYXRlcmlhbCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfaXNUcmlnZ2VyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IF9jZW50ZXI6IFZlYzMgPSBuZXcgVmVjMygpO1xyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgX2Fzc2VydE9uTG9hZENhbGxlZCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgY29uc3QgciA9IHRoaXMuX2lzT25Mb2FkQ2FsbGVkID09IDA7XHJcbiAgICAgICAgaWYgKHIpIHsgZXJyb3IoJ1tQaHlzaWNzXTogUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHRoZSBub2RlIGhhcyBiZWVuIGFkZGVkIHRvIHRoZSBzY2VuZScpOyB9XHJcbiAgICAgICAgcmV0dXJuICFyO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBnZXQgX2Fzc2VydFVzZUNvbGxpc2lvbk1hdHJpeCAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgaWYgKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UudXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgIGVycm9yKCdbUGh5c2ljc106IHVzZUNvbGxpc2lvbk1hdHJpeCBpcyB0dXJuIG9uLCB1c2luZyBjb2xsaXNpb24gbWF0cml4IGluc3RlYWQgcGxlYXNlLicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS51c2VDb2xsaXNpb25NYXRyaXg7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHR5cGU6IEVDb2xsaWRlclR5cGUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuVFlQRSA9IHR5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8vIEVWRU5UIElOVEVSRkFDRSAvLy9cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBhc3NvY2lhdGVkIHdpdGggdHJpZ2dlcmVkIG9yIGNvbGxpc2lvbiBldmVudHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOazqOWGjOinpuWPkeaIlueisOaSnuS6i+S7tuebuOWFs+eahOWbnuiwg+OAglxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgZXZlbnQgdHlwZSwgb25UcmlnZ2VyRW50ZXJ8b25UcmlnZ2VyU3RheXxvblRyaWdnZXJFeGl0fG9uQ29sbGlzaW9uRW50ZXJ8b25Db2xsaXNpb25TdGF5fG9uQ29sbGlzaW9uRXhpdDtcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBldmVudCBjYWxsYmFjaywgc2lnbmF0dXJlOmAoZXZlbnQ/OklDb2xsaXNpb25FdmVudHxJVHJpZ2dlckV2ZW50KT0+dm9pZGAuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIGV2ZW50IGNhbGxiYWNrIHRhcmdldC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uICh0eXBlOiBUcmlnZ2VyRXZlbnRUeXBlIHwgQ29sbGlzaW9uRXZlbnRUeXBlLCBjYWxsYmFjazogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCwgb25jZT86IGJvb2xlYW4pOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHJldCA9IHN1cGVyLm9uKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQsIG9uY2UpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU5lZWRFdmVudCh0eXBlKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBVbnJlZ2lzdGVycyBjYWxsYmFja3MgYXNzb2NpYXRlZCB3aXRoIHRyaWdnZXIgb3IgY29sbGlzaW9uIGV2ZW50cyB0aGF0IGhhdmUgYmVlbiByZWdpc3RlcmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlj5bmtojlt7Lnu4/ms6jlhoznmoTop6blj5HmiJbnorDmkp7kuovku7bnm7jlhbPnmoTlm57osIPjgIJcclxuICAgICAqIEBwYXJhbSB0eXBlIC0gVGhlIGV2ZW50IHR5cGUsIG9uVHJpZ2dlckVudGVyfG9uVHJpZ2dlclN0YXl8b25UcmlnZ2VyRXhpdHxvbkNvbGxpc2lvbkVudGVyfG9uQ29sbGlzaW9uU3RheXxvbkNvbGxpc2lvbkV4aXQ7XHJcbiAgICAgKiBAcGFyYW0gY2FsbGJhY2sgLSBUaGUgZXZlbnQgY2FsbGJhY2ssIHNpZ25hdHVyZTpgKGV2ZW50PzpJQ29sbGlzaW9uRXZlbnR8SVRyaWdnZXJFdmVudCk9PnZvaWRgLlxyXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSBldmVudCBjYWxsYmFjayB0YXJnZXQuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvZmYgKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrPzogRnVuY3Rpb24sIHRhcmdldD86IE9iamVjdCkge1xyXG4gICAgICAgIHN1cGVyLm9mZih0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl91cGRhdGVOZWVkRXZlbnQoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgYXNzb2NpYXRlZCB3aXRoIGEgdHJpZ2dlciBvciBjb2xsaXNpb24gZXZlbnQsIHdoaWNoIGlzIGF1dG9tYXRpY2FsbHkgdW5yZWdpc3RlcmVkIG9uY2UgZXhlY3V0ZWQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOazqOWGjOinpuWPkeaIlueisOaSnuS6i+S7tuebuOWFs+eahOWbnuiwg++8jOaJp+ihjOS4gOasoeWQjuS8muiHquWKqOWPlua2iOazqOWGjOOAglxyXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgZXZlbnQgdHlwZSwgb25UcmlnZ2VyRW50ZXJ8b25UcmlnZ2VyU3RheXxvblRyaWdnZXJFeGl0fG9uQ29sbGlzaW9uRW50ZXJ8b25Db2xsaXNpb25TdGF5fG9uQ29sbGlzaW9uRXhpdDtcclxuICAgICAqIEBwYXJhbSBjYWxsYmFjayAtIFRoZSBldmVudCBjYWxsYmFjaywgc2lnbmF0dXJlOmAoZXZlbnQ/OklDb2xsaXNpb25FdmVudHxJVHJpZ2dlckV2ZW50KT0+dm9pZGAuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIGV2ZW50IGNhbGxiYWNrIHRhcmdldC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uY2UgKHR5cGU6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUsIGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0PzogT2JqZWN0KTogYW55IHtcclxuICAgICAgICAvL1RPRE86IGNhbGxiYWNrIGludm9rZXIgbm93IGlzIGEgZW50aXR5LCBhZnRlciBgb25jZWAgd2lsbCBub3QgY2FsbGluZyB0aGUgdXBwZXIgYG9mZmAuXHJcbiAgICAgICAgY29uc3QgcmV0ID0gc3VwZXIub25jZSh0eXBlLCBjYWxsYmFjaywgdGFyZ2V0KTtcclxuICAgICAgICB0aGlzLl91cGRhdGVOZWVkRXZlbnQodHlwZSk7XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVtb3ZlcyBhbGwgcmVnaXN0ZXJlZCBldmVudHMgb2YgdGhlIHNwZWNpZmllZCB0YXJnZXQgb3IgdHlwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog56e76Zmk5omA5pyJ5oyH5a6a55uu5qCH5oiW57G75Z6L55qE5rOo5YaM5LqL5Lu244CCXHJcbiAgICAgKiBAcGFyYW0gdHlwZU9yVGFyZ2V0IC0gVGhlIGV2ZW50IHR5cGUgb3IgdGFyZ2V0LlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVtb3ZlQWxsICh0eXBlT3JUYXJnZXQ6IFRyaWdnZXJFdmVudFR5cGUgfCBDb2xsaXNpb25FdmVudFR5cGUgfCB7fSkge1xyXG4gICAgICAgIHN1cGVyLnJlbW92ZUFsbCh0eXBlT3JUYXJnZXQpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU5lZWRFdmVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vLyBHUk9VUCBNQVNLIC8vL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBncm91cCB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5YiG57uE5YC844CCXHJcbiAgICAgKiBAcmV0dXJucyDmlbTmlbDvvIzojIPlm7TkuLogMiDnmoQgMCDmrKHmlrkg5YiwIDIg55qEIDMxIOasoeaWuVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0R3JvdXAgKCk6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGUhLmdldEdyb3VwKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBncm91cCB2YWx1ZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u5YiG57uE5YC844CCXHJcbiAgICAgKiBAcGFyYW0gdiAtIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRHcm91cCAodjogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Fzc2VydE9uTG9hZENhbGxlZCkge1xyXG4gICAgICAgICAgICBpZiAoUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS51c2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvZHkgPSB0aGlzLl9zaGFwZSEuYXR0YWNoZWRSaWdpZEJvZHk7XHJcbiAgICAgICAgICAgICAgICBpZiAoYm9keSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHkuZ3JvdXAgPSB2O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFwZSEuc2V0R3JvdXAodik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWFzaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2hhcGUhLnNldEdyb3VwKHYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYSBncm91cGluZyB2YWx1ZSB0byBmaWxsIGluIHRoZSBncm91cCB5b3Ugd2FudCB0byBqb2luLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmt7vliqDliIbnu4TlgLzvvIzlj6/loavopoHliqDlhaXnmoQgZ3JvdXDjgIJcclxuICAgICAqIEBwYXJhbSB2IC0g5pW05pWw77yM6IyD5Zu05Li6IDIg55qEIDAg5qyh5pa5IOWIsCAyIOeahCAzMSDmrKHmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZEdyb3VwICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fYXNzZXJ0VXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFwZSEuYWRkR3JvdXAodik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy5fc2hhcGUhLmF0dGFjaGVkUmlnaWRCb2R5O1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5Lmdyb3VwIHw9IHY7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3NoYXBlIS5hZGRHcm91cCh2KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVNYXNrKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN1YnRyYWN0IHRoZSBncm91cGluZyB2YWx1ZSB0byBmaWxsIGluIHRoZSBncm91cCB0byBiZSByZW1vdmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlh4/ljrvliIbnu4TlgLzvvIzlj6/loavopoHnp7vpmaTnmoQgZ3JvdXDjgIJcclxuICAgICAqIEBwYXJhbSB2IC0g5pW05pWw77yM6IyD5Zu05Li6IDIg55qEIDAg5qyh5pa5IOWIsCAyIOeahCAzMSDmrKHmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUdyb3VwICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5fYXNzZXJ0VXNlQ29sbGlzaW9uTWF0cml4KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaGFwZSEucmVtb3ZlR3JvdXAodik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib2R5ID0gdGhpcy5fc2hhcGUhLmF0dGFjaGVkUmlnaWRCb2R5O1xyXG4gICAgICAgICAgICAgICAgaWYgKGJvZHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBib2R5Lmdyb3VwICY9IH52O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9zaGFwZSEucmVtb3ZlR3JvdXAodik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fdXBkYXRlTWFzaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSBtYXNrIHZhbHVlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjqnnoIHlgLzjgIJcclxuICAgICAqIEByZXR1cm5zIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRNYXNrICgpOiBudW1iZXIge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlIS5nZXRNYXNrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBtYXNrIHZhbHVlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7mjqnnoIHlgLzjgIJcclxuICAgICAqIEBwYXJhbSB2IC0g5pW05pWw77yM6IyD5Zu05Li6IDIg55qEIDAg5qyh5pa5IOWIsCAyIOeahCAzMSDmrKHmlrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldE1hc2sgKHY6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9hc3NlcnRPbkxvYWRDYWxsZWQgJiYgIXRoaXMuX2Fzc2VydFVzZUNvbGxpc2lvbk1hdHJpeCkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZSEuc2V0TWFzayh2KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEFkZCBtYXNrIHZhbHVlcyB0byBmaWxsIGluIGdyb3VwcyB0aGF0IG5lZWQgdG8gYmUgY2hlY2tlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5re75Yqg5o6p56CB5YC877yM5Y+v5aGr5YWl6ZyA6KaB5qOA5p+l55qEIGdyb3Vw44CCXHJcbiAgICAgKiBAcGFyYW0gdiAtIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRNYXNrICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkICYmICF0aGlzLl9hc3NlcnRVc2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUhLmFkZE1hc2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTdWJ0cmFjdCB0aGUgbWFzayB2YWx1ZSB0byBmaWxsIGluIHRoZSBncm91cCB0aGF0IGRvZXMgbm90IG5lZWQgdG8gYmUgY2hlY2tlZC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YeP5Y675o6p56CB5YC877yM5Y+v5aGr5YWl5LiN6ZyA6KaB5qOA5p+l55qEIGdyb3Vw44CCXHJcbiAgICAgKiBAcGFyYW0gdiAtIOaVtOaVsO+8jOiMg+WbtOS4uiAyIOeahCAwIOasoeaWuSDliLAgMiDnmoQgMzEg5qyh5pa5XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVNYXNrICh2OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fYXNzZXJ0T25Mb2FkQ2FsbGVkICYmICF0aGlzLl9hc3NlcnRVc2VDb2xsaXNpb25NYXRyaXgpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUhLnJlbW92ZU1hc2sodik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLy8gQ09NUE9ORU5UIExJRkVDWUNMRSAvLy9cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25Mb2FkICgpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZSA9IGNyZWF0ZVNoYXBlKHRoaXMuVFlQRSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLmluaXRpYWxpemUodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcmVkTWF0ZXJpYWwgPSB0aGlzLl9tYXRlcmlhbCA9PSBudWxsID8gUGh5c2ljc1N5c3RlbS5pbnN0YW5jZS5kZWZhdWx0TWF0ZXJpYWwgOiB0aGlzLl9tYXRlcmlhbDtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUub25Mb2FkISgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgb25FbmFibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9zaGFwZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5vbkVuYWJsZSEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uRGlzYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NoYXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NoYXBlLm9uRGlzYWJsZSEoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NoYXBlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tYXRlcmlhbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWF0ZXJpYWwub2ZmKCdwaHlzaWNzX21hdGVyaWFsX3VwZGF0ZScsIHRoaXMuX3VwZGF0ZU1hdGVyaWFsLCB0aGlzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9zaGFwZS5vbkRlc3Ryb3khKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZU1hdGVyaWFsICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fc2hhcGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcGUuc2V0TWF0ZXJpYWwodGhpcy5fbWF0ZXJpYWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVOZWVkRXZlbnQgKHR5cGU/OiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAodGhpcy5pc1ZhbGlkKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlID09ICdvbkNvbGxpc2lvbkVudGVyJyB8fCB0eXBlID09ICdvbkNvbGxpc2lvblN0YXknIHx8IHR5cGUgPT0gJ29uQ29sbGlzaW9uRXhpdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZWVkQ29sbGlzaW9uRXZlbnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdvblRyaWdnZXJFbnRlcicgfHwgdHlwZSA9PSAnb25UcmlnZ2VyU3RheScgfHwgdHlwZSA9PSAnb25UcmlnZ2VyRXhpdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZWVkVHJpZ2dlckV2ZW50ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICghKHRoaXMuaGFzRXZlbnRMaXN0ZW5lcignb25UcmlnZ2VyRW50ZXInKSB8fCB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoJ29uVHJpZ2dlclN0YXknKSB8fCB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoJ29uVHJpZ2dlckV4aXQnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9uZWVkVHJpZ2dlckV2ZW50ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCEodGhpcy5oYXNFdmVudExpc3RlbmVyKCdvbkNvbGxpc2lvbkVudGVyJykgfHwgdGhpcy5oYXNFdmVudExpc3RlbmVyKCdvbkNvbGxpc2lvblN0YXknKSB8fCB0aGlzLmhhc0V2ZW50TGlzdGVuZXIoJ29uQ29sbGlzaW9uRXhpdCcpKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX25lZWRDb2xsaXNpb25FdmVudCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZU1hc2sgKCkge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlIS5zZXRNYXNrKFBoeXNpY3NTeXN0ZW0uaW5zdGFuY2UuY29sbGlzaW9uTWF0cml4W3RoaXMuX3NoYXBlIS5nZXRHcm91cCgpXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgQ29sbGlkZXIge1xyXG4gICAgZXhwb3J0IHR5cGUgRUNvbGxpZGVyVHlwZSA9IEVudW1BbGlhczx0eXBlb2YgRUNvbGxpZGVyVHlwZT47XHJcbiAgICBleHBvcnQgdHlwZSBFQXhpc0RpcmVjdGlvbiA9IEVudW1BbGlhczx0eXBlb2YgRUF4aXNEaXJlY3Rpb24+O1xyXG59XHJcblxyXG5mdW5jdGlvbiBmaW5kQXR0YWNoZWRCb2R5IChub2RlOiBOb2RlKTogUmlnaWRCb2R5IHwgbnVsbCB7XHJcbiAgICBjb25zdCByYiA9IG5vZGUuZ2V0Q29tcG9uZW50KFJpZ2lkQm9keSk7XHJcbiAgICBpZiAocmIgJiYgcmIuaXNWYWxpZCkge1xyXG4gICAgICAgIHJldHVybiByYjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKG5vZGUucGFyZW50ID09IG51bGwgfHwgbm9kZS5wYXJlbnQgPT0gbm9kZS5zY2VuZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGZpbmRBdHRhY2hlZEJvZHkobm9kZS5wYXJlbnQpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==