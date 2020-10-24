(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../data/decorators/index.js", "../math/index.js", "../platform/event-manager/event-enum.js", "../platform/event-manager/event-manager.js", "./base-node.js", "./layers.js", "./node-enum.js", "./node-ui-properties.js", "../global-exports.js", "../renderer/core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../data/decorators/index.js"), require("../math/index.js"), require("../platform/event-manager/event-enum.js"), require("../platform/event-manager/event-manager.js"), require("./base-node.js"), require("./layers.js"), require("./node-enum.js"), require("./node-ui-properties.js"), require("../global-exports.js"), require("../renderer/core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.eventEnum, global.eventManager, global.baseNode, global.layers, global.nodeEnum, global.nodeUiProperties, global.globalExports, global.memoryPools);
    global.node = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _eventEnum, _eventManager, _baseNode, _layers, _nodeEnum, _nodeUiProperties, _globalExports, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Node = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _class3, _temp;

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var v3_a = new _index2.Vec3();
  var q_a = new _index2.Quat();
  var q_b = new _index2.Quat();
  var array_a = new Array(10);
  var qt_1 = new _index2.Quat();
  var m3_1 = new _index2.Mat3();
  var m3_scaling = new _index2.Mat3();
  var m4_1 = new _index2.Mat4();
  var bookOfChange = new Map();
  /**
   * @zh
   * 场景树中的基本节点，基本特性有：
   * * 具有层级关系
   * * 持有各类组件
   * * 维护空间变换（坐标、旋转、缩放）信息
   */

  /**
   * !#en
   * Class of all entities in Cocos Creator scenes.
   * Basic functionalities include:
   * * Hierarchy management with parent and children
   * * Components management
   * * Coordinate system with position, scale, rotation in 3d space
   * !#zh
   * Cocos Creator 场景中的所有节点类。
   * 基本特性有：
   * * 具有层级关系
   * * 持有各类组件
   * * 维护 3D 空间左边变换（坐标、旋转、缩放）信息
   */

  var Node = (_dec = (0, _index.ccclass)('cc.Node'), _dec2 = (0, _index.type)(_index2.Vec3), _dec(_class = (_class2 = (_temp = _class3 = /*#__PURE__*/function (_BaseNode) {
    _inherits(Node, _BaseNode);

    _createClass(Node, null, [{
      key: "isNode",

      /**
       * @en Event types emitted by Node
       * @zh 节点可能发出的事件类型
       */

      /**
       * @en Coordinates space
       * @zh 空间变换操作的坐标系
       */

      /**
       * @en Bit masks for Node transformation parts
       * @zh 节点变换更新的具体部分
       * @deprecated please use [[Node.TransformBit]]
       */

      /**
       * @en Bit masks for Node transformation parts, can be used to determine which part changed in [[SystemEventType.TRANSFORM_CHANGED]] event
       * @zh 节点变换更新的具体部分，可用于判断 [[SystemEventType.TRANSFORM_CHANGED]] 事件的具体类型
       */

      /**
       * @en Determine whether the given object is a normal Node. Will return false if [[Scene]] given.
       * @zh 指定对象是否是普通的节点？如果传入 [[Scene]] 会返回 false。
       */
      value: function isNode(obj) {
        return obj instanceof Node && (obj.constructor === Node || !(obj instanceof _globalExports.legacyCC.Scene));
      } // UI 部分的脏数据

    }]);

    function Node(name) {
      var _this;

      _classCallCheck(this, Node);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Node).call(this, name));
      _this._uiProps = new _nodeUiProperties.NodeUIProperties(_assertThisInitialized(_this));
      _this._static = false;
      _this._pos = new _index2.Vec3();
      _this._rot = new _index2.Quat();
      _this._scale = new _index2.Vec3(1, 1, 1);
      _this._mat = new _index2.Mat4();

      _initializerDefineProperty(_this, "_lpos", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lrot", _descriptor2, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_lscale", _descriptor3, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_layer", _descriptor4, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_euler", _descriptor5, _assertThisInitialized(_this));

      _this._dirtyFlags = _nodeEnum.TransformBit.NONE;
      _this._eulerDirty = false;
      _this._poolHandle = _memoryPools.NULL_HANDLE;
      _this._poolHandle = _memoryPools.NodePool.alloc();

      _memoryPools.NodePool.set(_this._poolHandle, _memoryPools.NodeView.LAYER, _this._layer);

      _memoryPools.NodePool.setVec3(_this._poolHandle, _memoryPools.NodeView.WORLD_SCALE, _this._scale);

      return _this;
    }

    _createClass(Node, [{
      key: "destroy",
      value: function destroy() {
        if (this._poolHandle) {
          _memoryPools.NodePool.free(this._poolHandle);

          this._poolHandle = _memoryPools.NULL_HANDLE;
        }

        return _get(_getPrototypeOf(Node.prototype), "destroy", this).call(this);
      }
    }, {
      key: "setParent",
      // ===============================
      // hierarchy
      // ===============================

      /**
       * @en Set parent of the node.
       * @zh 设置该节点的父节点。
       * @param value Parent node
       * @param keepWorldTransform Whether keep node's current world transform unchanged after this operation
       */
      value: function setParent(value) {
        var keepWorldTransform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (keepWorldTransform) {
          this.updateWorldTransform();
        }

        _get(_getPrototypeOf(Node.prototype), "setParent", this).call(this, value, keepWorldTransform);
      }
    }, {
      key: "_onSetParent",
      value: function _onSetParent(oldParent, keepWorldTransform) {
        _get(_getPrototypeOf(Node.prototype), "_onSetParent", this).call(this, oldParent, keepWorldTransform);

        if (keepWorldTransform) {
          var parent = this._parent;

          if (parent) {
            parent.updateWorldTransform();

            _index2.Mat4.multiply(m4_1, _index2.Mat4.invert(m4_1, parent._mat), this._mat);

            _index2.Mat4.toRTS(m4_1, this._lrot, this._lpos, this._lscale);
          } else {
            _index2.Vec3.copy(this._lpos, this._pos);

            _index2.Quat.copy(this._lrot, this._rot);

            _index2.Vec3.copy(this._lscale, this._scale);
          }

          this._eulerDirty = true;
        }

        this.invalidateChildren(_nodeEnum.TransformBit.TRS);
      }
    }, {
      key: "_onBatchCreated",
      value: function _onBatchCreated() {
        _get(_getPrototypeOf(Node.prototype), "_onBatchCreated", this).call(this);

        bookOfChange.set(this._id, _nodeEnum.TransformBit.TRS);
        this._dirtyFlags = _nodeEnum.TransformBit.TRS;
        var len = this._children.length;

        for (var i = 0; i < len; ++i) {
          this._children[i]._onBatchCreated();
        }
      }
    }, {
      key: "_onBatchRestored",
      value: function _onBatchRestored() {
        this._onBatchCreated();
      }
    }, {
      key: "_onBeforeSerialize",
      value: function _onBeforeSerialize() {
        // tslint:disable-next-line: no-unused-expression
        this.eulerAngles; // make sure we save the correct eulerAngles
      }
    }, {
      key: "_onPostActivated",
      value: function _onPostActivated(active) {
        if (active) {
          // activated
          _eventManager.eventManager.resumeTarget(this);

          this.eventProcessor.reattach(); // in case transform updated during deactivated period

          this.invalidateChildren(_nodeEnum.TransformBit.TRS);
        } else {
          // deactivated
          _eventManager.eventManager.pauseTarget(this);
        }
      } // ===============================
      // transform helper, convenient but not the most efficient
      // ===============================

      /**
       * @en Perform a translation on the node
       * @zh 移动节点
       * @param trans The increment on position
       * @param ns The operation coordinate space
       */

    }, {
      key: "translate",
      value: function translate(trans, ns) {
        var space = ns || _nodeEnum.NodeSpace.LOCAL;

        if (space === _nodeEnum.NodeSpace.LOCAL) {
          _index2.Vec3.transformQuat(v3_a, trans, this._lrot);

          this._lpos.x += v3_a.x;
          this._lpos.y += v3_a.y;
          this._lpos.z += v3_a.z;
        } else if (space === _nodeEnum.NodeSpace.WORLD) {
          if (this._parent) {
            _index2.Quat.invert(q_a, this._parent.worldRotation);

            _index2.Vec3.transformQuat(v3_a, trans, q_a);

            var _scale = this.worldScale;
            this._lpos.x += v3_a.x / _scale.x;
            this._lpos.y += v3_a.y / _scale.y;
            this._lpos.z += v3_a.z / _scale.z;
          } else {
            this._lpos.x += trans.x;
            this._lpos.y += trans.y;
            this._lpos.z += trans.z;
          }
        }

        this.invalidateChildren(_nodeEnum.TransformBit.POSITION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.POSITION);
        }
      }
      /**
       * @en Perform a rotation on the node
       * @zh 旋转节点
       * @param trans The increment on position
       * @param ns The operation coordinate space
       */

    }, {
      key: "rotate",
      value: function rotate(rot, ns) {
        var space = ns || _nodeEnum.NodeSpace.LOCAL;

        _index2.Quat.normalize(q_a, rot);

        if (space === _nodeEnum.NodeSpace.LOCAL) {
          _index2.Quat.multiply(this._lrot, this._lrot, q_a);
        } else if (space === _nodeEnum.NodeSpace.WORLD) {
          var worldRot = this.worldRotation;

          _index2.Quat.multiply(q_b, q_a, worldRot);

          _index2.Quat.invert(q_a, worldRot);

          _index2.Quat.multiply(q_b, q_a, q_b);

          _index2.Quat.multiply(this._lrot, this._lrot, q_b);
        }

        this._eulerDirty = true;
        this.invalidateChildren(_nodeEnum.TransformBit.ROTATION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.ROTATION);
        }
      }
      /**
       * @en Set the orientation of the node to face the target position, the node is facing minus z direction by default
       * @zh 设置当前节点旋转为面向目标位置，默认前方为 -z 方向
       * @param pos Target position
       * @param up Up direction
       */

    }, {
      key: "lookAt",
      value: function lookAt(pos, up) {
        this.getWorldPosition(v3_a);

        _index2.Vec3.subtract(v3_a, v3_a, pos);

        _index2.Vec3.normalize(v3_a, v3_a);

        _index2.Quat.fromViewUp(q_a, v3_a, up);

        this.setWorldRotation(q_a);
      } // ===============================
      // transform maintainer
      // ===============================

      /**
       * @en Invalidate the world transform information
       * for this node and all its children recursively
       * @zh 递归标记节点世界变换为 dirty
       * @param dirtyBit The dirty bits to setup to children, can be composed with multiple dirty bits
       */

    }, {
      key: "invalidateChildren",
      value: function invalidateChildren(dirtyBit) {
        if ((this._dirtyFlags & this.hasChangedFlags & dirtyBit) === dirtyBit) {
          return;
        }

        this._dirtyFlags |= dirtyBit;
        bookOfChange.set(this._id, this.hasChangedFlags | dirtyBit);
        dirtyBit |= _nodeEnum.TransformBit.POSITION;
        var len = this._children.length;

        for (var i = 0; i < len; ++i) {
          var child = this._children[i];

          if (child.isValid) {
            child.invalidateChildren(dirtyBit);
          }
        }
      }
      /**
       * @en Update the world transform information if outdated
       * @zh 更新节点的世界变换信息
       */

    }, {
      key: "updateWorldTransform",
      value: function updateWorldTransform() {
        if (!this._dirtyFlags) {
          return;
        }

        var cur = this;
        var i = 0;

        while (cur && cur._dirtyFlags) {
          // top level node
          array_a[i++] = cur;
          cur = cur._parent;
        }

        var child;
        var dirtyBits = 0;

        while (i) {
          child = array_a[--i];
          dirtyBits |= child._dirtyFlags;

          if (cur) {
            if (dirtyBits & _nodeEnum.TransformBit.POSITION) {
              _index2.Vec3.transformMat4(child._pos, child._lpos, cur._mat);

              child._mat.m12 = child._pos.x;
              child._mat.m13 = child._pos.y;
              child._mat.m14 = child._pos.z;

              _memoryPools.NodePool.setVec3(child._poolHandle, _memoryPools.NodeView.WORLD_POSITION, child._pos);
            }

            if (dirtyBits & _nodeEnum.TransformBit.RS) {
              _index2.Mat4.fromRTS(child._mat, child._lrot, child._lpos, child._lscale);

              _index2.Mat4.multiply(child._mat, cur._mat, child._mat);

              if (dirtyBits & _nodeEnum.TransformBit.ROTATION) {
                _index2.Quat.multiply(child._rot, cur._rot, child._lrot);

                _memoryPools.NodePool.setVec4(child._poolHandle, _memoryPools.NodeView.WORLD_ROTATION, child._rot);
              }

              _index2.Mat3.fromQuat(m3_1, _index2.Quat.conjugate(qt_1, child._rot));

              _index2.Mat3.multiplyMat4(m3_1, m3_1, child._mat);

              child._scale.x = m3_1.m00;
              child._scale.y = m3_1.m04;
              child._scale.z = m3_1.m08;

              _memoryPools.NodePool.setVec3(child._poolHandle, _memoryPools.NodeView.WORLD_SCALE, child._scale);
            }
          } else {
            if (dirtyBits & _nodeEnum.TransformBit.POSITION) {
              _index2.Vec3.copy(child._pos, child._lpos);

              child._mat.m12 = child._pos.x;
              child._mat.m13 = child._pos.y;
              child._mat.m14 = child._pos.z;

              _memoryPools.NodePool.setVec3(child._poolHandle, _memoryPools.NodeView.WORLD_POSITION, child._pos);
            }

            if (dirtyBits & _nodeEnum.TransformBit.RS) {
              if (dirtyBits & _nodeEnum.TransformBit.ROTATION) {
                _index2.Quat.copy(child._rot, child._lrot);

                _memoryPools.NodePool.setVec4(child._poolHandle, _memoryPools.NodeView.WORLD_ROTATION, child._rot);
              }

              if (dirtyBits & _nodeEnum.TransformBit.SCALE) {
                _index2.Vec3.copy(child._scale, child._lscale);

                _memoryPools.NodePool.setVec3(child._poolHandle, _memoryPools.NodeView.WORLD_SCALE, child._scale);

                _index2.Mat4.fromRTS(child._mat, child._rot, child._pos, child._scale);
              }
            }
          }

          if (dirtyBits !== _nodeEnum.TransformBit.NONE) {
            _memoryPools.NodePool.setMat4(child._poolHandle, _memoryPools.NodeView.WORLD_MATRIX, child._mat);
          }

          child._dirtyFlags = _nodeEnum.TransformBit.NONE;
          cur = child;
        }
      } // ===============================
      // transform
      // ===============================

      /**
       * @en Set position in local coordinate system
       * @zh 设置本地坐标
       * @param position Target position
       */

    }, {
      key: "setPosition",
      value: function setPosition(val, y, z) {
        if (y === undefined || z === undefined) {
          _index2.Vec3.copy(this._lpos, val);
        } else {
          _index2.Vec3.set(this._lpos, val, y, z);
        }

        this.invalidateChildren(_nodeEnum.TransformBit.POSITION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.POSITION);
        }
      }
      /**
       * @en Get position in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
       * @zh 获取本地坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
       * @param out Set the result to out vector
       * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
       */

    }, {
      key: "getPosition",
      value: function getPosition(out) {
        if (out) {
          return _index2.Vec3.set(out, this._lpos.x, this._lpos.y, this._lpos.z);
        } else {
          return _index2.Vec3.copy(new _index2.Vec3(), this._lpos);
        }
      }
      /**
       * @en Set rotation in local coordinate system with a quaternion representing the rotation
       * @zh 用四元数设置本地旋转
       * @param rotation Rotation in quaternion
       */

    }, {
      key: "setRotation",
      value: function setRotation(val, y, z, w) {
        if (y === undefined || z === undefined || w === undefined) {
          _index2.Quat.copy(this._lrot, val);
        } else {
          _index2.Quat.set(this._lrot, val, y, z, w);
        }

        this._eulerDirty = true;
        this.invalidateChildren(_nodeEnum.TransformBit.ROTATION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.ROTATION);
        }
      }
      /**
       * @en Set rotation in local coordinate system with euler angles
       * @zh 用欧拉角设置本地旋转
       * @param x X axis rotation
       * @param y Y axis rotation
       * @param z Z axis rotation
       */

    }, {
      key: "setRotationFromEuler",
      value: function setRotationFromEuler(x, y, z) {
        _index2.Vec3.set(this._euler, x, y, z);

        _index2.Quat.fromEuler(this._lrot, x, y, z);

        this._eulerDirty = false;
        this.invalidateChildren(_nodeEnum.TransformBit.ROTATION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.ROTATION);
        }
      }
      /**
       * @en Get rotation as quaternion in local coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
       * @zh 获取本地旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
       * @param out Set the result to out quaternion
       * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
       */

    }, {
      key: "getRotation",
      value: function getRotation(out) {
        if (out) {
          return _index2.Quat.set(out, this._lrot.x, this._lrot.y, this._lrot.z, this._lrot.w);
        } else {
          return _index2.Quat.copy(new _index2.Quat(), this._lrot);
        }
      }
      /**
       * @en Set scale in local coordinate system
       * @zh 设置本地缩放
       * @param scale Target scale
       */

    }, {
      key: "setScale",
      value: function setScale(val, y, z) {
        if (y === undefined || z === undefined) {
          _index2.Vec3.copy(this._lscale, val);
        } else {
          _index2.Vec3.set(this._lscale, val, y, z);
        }

        this.invalidateChildren(_nodeEnum.TransformBit.SCALE);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.SCALE);
        }
      }
      /**
       * @en Get scale in local coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
       * @zh 获取本地缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
       * @param out Set the result to out vector
       * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
       */

    }, {
      key: "getScale",
      value: function getScale(out) {
        if (out) {
          return _index2.Vec3.set(out, this._lscale.x, this._lscale.y, this._lscale.z);
        } else {
          return _index2.Vec3.copy(new _index2.Vec3(), this._lscale);
        }
      }
      /**
       * @en Inversely transform a point from world coordinate system to local coordinate system.
       * @zh 逆向变换一个空间点，一般用于将世界坐标转换到本地坐标系中。
       * @param out The result point in local coordinate system will be stored in this vector
       * @param p A position in world coordinate system
       */

    }, {
      key: "inverseTransformPoint",
      value: function inverseTransformPoint(out, p) {
        _index2.Vec3.copy(out, p);

        var cur = this;
        var i = 0;

        while (cur._parent) {
          array_a[i++] = cur;
          cur = cur._parent;
        }

        while (i >= 0) {
          _index2.Vec3.transformInverseRTS(out, out, cur._lrot, cur._lpos, cur._lscale);

          cur = array_a[--i];
        }

        return out;
      }
      /**
       * @en Set position in world coordinate system
       * @zh 设置世界坐标
       * @param position Target position
       */

    }, {
      key: "setWorldPosition",
      value: function setWorldPosition(val, y, z) {
        if (y === undefined || z === undefined) {
          _index2.Vec3.copy(this._pos, val);
        } else {
          _index2.Vec3.set(this._pos, val, y, z);
        }

        _memoryPools.NodePool.setVec3(this._poolHandle, _memoryPools.NodeView.WORLD_POSITION, this._pos);

        var parent = this._parent;
        var local = this._lpos;

        if (parent) {
          // TODO: benchmark these approaches

          /* */
          parent.updateWorldTransform();

          _index2.Vec3.transformMat4(local, this._pos, _index2.Mat4.invert(m4_1, parent._mat));
          /* *
          parent.inverseTransformPoint(local, this._pos);
          /* */

        } else {
          _index2.Vec3.copy(local, this._pos);
        }

        this.invalidateChildren(_nodeEnum.TransformBit.POSITION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.POSITION);
        }
      }
      /**
       * @en Get position in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
       * @zh 获取世界坐标，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
       * @param out Set the result to out vector
       * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
       */

    }, {
      key: "getWorldPosition",
      value: function getWorldPosition(out) {
        this.updateWorldTransform();

        if (out) {
          return _index2.Vec3.copy(out, this._pos);
        } else {
          return _index2.Vec3.copy(new _index2.Vec3(), this._pos);
        }
      }
      /**
       * @en Set rotation in world coordinate system with a quaternion representing the rotation
       * @zh 用四元数设置世界坐标系下的旋转
       * @param rotation Rotation in quaternion
       */

    }, {
      key: "setWorldRotation",
      value: function setWorldRotation(val, y, z, w) {
        if (y === undefined || z === undefined || w === undefined) {
          _index2.Quat.copy(this._rot, val);
        } else {
          _index2.Quat.set(this._rot, val, y, z, w);
        }

        _memoryPools.NodePool.setVec4(this._poolHandle, _memoryPools.NodeView.WORLD_ROTATION, this._rot);

        if (this._parent) {
          this._parent.updateWorldTransform();

          _index2.Quat.multiply(this._lrot, _index2.Quat.conjugate(this._lrot, this._parent._rot), this._rot);
        } else {
          _index2.Quat.copy(this._lrot, this._rot);
        }

        this._eulerDirty = true;
        this.invalidateChildren(_nodeEnum.TransformBit.ROTATION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.ROTATION);
        }
      }
      /**
       * @en Set rotation in world coordinate system with euler angles
       * @zh 用欧拉角设置世界坐标系下的旋转
       * @param x X axis rotation
       * @param y Y axis rotation
       * @param z Z axis rotation
       */

    }, {
      key: "setWorldRotationFromEuler",
      value: function setWorldRotationFromEuler(x, y, z) {
        _index2.Quat.fromEuler(this._rot, x, y, z);

        if (this._parent) {
          this._parent.updateWorldTransform();

          _index2.Quat.multiply(this._lrot, _index2.Quat.conjugate(this._lrot, this._parent._rot), this._rot);
        } else {
          _index2.Quat.copy(this._lrot, this._rot);
        }

        this._eulerDirty = true;
        this.invalidateChildren(_nodeEnum.TransformBit.ROTATION);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.ROTATION);
        }
      }
      /**
       * @en Get rotation as quaternion in world coordinate system, please try to pass `out` quaternion and reuse it to avoid garbage.
       * @zh 获取世界坐标系下的旋转，注意，尽可能传递复用的 [[Quat]] 以避免产生垃圾。
       * @param out Set the result to out quaternion
       * @return If `out` given, the return value equals to `out`, otherwise a new quaternion will be generated and return
       */

    }, {
      key: "getWorldRotation",
      value: function getWorldRotation(out) {
        this.updateWorldTransform();

        if (out) {
          return _index2.Quat.copy(out, this._rot);
        } else {
          return _index2.Quat.copy(new _index2.Quat(), this._rot);
        }
      }
      /**
       * @en Set scale in world coordinate system
       * @zh 设置世界坐标系下的缩放
       * @param scale Target scale
       */

    }, {
      key: "setWorldScale",
      value: function setWorldScale(val, y, z) {
        if (y === undefined || z === undefined) {
          _index2.Vec3.copy(this._scale, val);
        } else {
          _index2.Vec3.set(this._scale, val, y, z);
        }

        _memoryPools.NodePool.setVec3(this._poolHandle, _memoryPools.NodeView.WORLD_SCALE, this._scale);

        var parent = this._parent;

        if (parent) {
          parent.updateWorldTransform();

          _index2.Mat3.fromQuat(m3_1, _index2.Quat.conjugate(qt_1, parent._rot));

          _index2.Mat3.multiplyMat4(m3_1, m3_1, parent._mat);

          m3_scaling.m00 = this._scale.x;
          m3_scaling.m04 = this._scale.y;
          m3_scaling.m08 = this._scale.z;

          _index2.Mat3.multiply(m3_1, m3_scaling, _index2.Mat3.invert(m3_1, m3_1));

          this._lscale.x = _index2.Vec3.set(v3_a, m3_1.m00, m3_1.m01, m3_1.m02).length();
          this._lscale.y = _index2.Vec3.set(v3_a, m3_1.m03, m3_1.m04, m3_1.m05).length();
          this._lscale.z = _index2.Vec3.set(v3_a, m3_1.m06, m3_1.m07, m3_1.m08).length();
        } else {
          _index2.Vec3.copy(this._lscale, this._scale);
        }

        this.invalidateChildren(_nodeEnum.TransformBit.SCALE);

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.SCALE);
        }
      }
      /**
       * @en Get scale in world coordinate system, please try to pass `out` vector and reuse it to avoid garbage.
       * @zh 获取世界缩放，注意，尽可能传递复用的 [[Vec3]] 以避免产生垃圾。
       * @param out Set the result to out vector
       * @return If `out` given, the return value equals to `out`, otherwise a new vector will be generated and return
       */

    }, {
      key: "getWorldScale",
      value: function getWorldScale(out) {
        this.updateWorldTransform();

        if (out) {
          return _index2.Vec3.copy(out, this._scale);
        } else {
          return _index2.Vec3.copy(new _index2.Vec3(), this._scale);
        }
      }
      /**
       * @en Get a world transform matrix
       * @zh 获取世界变换矩阵
       * @param out Set the result to out matrix
       * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
       */

    }, {
      key: "getWorldMatrix",
      value: function getWorldMatrix(out) {
        this.updateWorldTransform();

        if (!out) {
          out = new _index2.Mat4();
        }

        return _index2.Mat4.copy(out, this._mat);
      }
      /**
       * @en Get a world transform matrix with only rotation and scale
       * @zh 获取只包含旋转和缩放的世界变换矩阵
       * @param out Set the result to out matrix
       * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
       */

    }, {
      key: "getWorldRS",
      value: function getWorldRS(out) {
        this.updateWorldTransform();

        if (!out) {
          out = new _index2.Mat4();
        }

        _index2.Mat4.copy(out, this._mat);

        out.m12 = 0;
        out.m13 = 0;
        out.m14 = 0;
        return out;
      }
      /**
       * @en Get a world transform matrix with only rotation and translation
       * @zh 获取只包含旋转和位移的世界变换矩阵
       * @param out Set the result to out matrix
       * @return If `out` given, the return value equals to `out`, otherwise a new matrix will be generated and return
       */

    }, {
      key: "getWorldRT",
      value: function getWorldRT(out) {
        this.updateWorldTransform();

        if (!out) {
          out = new _index2.Mat4();
        }

        return _index2.Mat4.fromRT(out, this._rot, this._pos);
      }
      /**
       * @en Set local transformation with rotation, position and scale separately.
       * @zh 一次性设置所有局部变换（平移、旋转、缩放）信息
       * @param rot The rotation
       * @param pos The position
       * @param scale The scale
       */

    }, {
      key: "setRTS",
      value: function setRTS(rot, pos, scale) {
        var dirtyBit = 0;

        if (rot) {
          dirtyBit |= _nodeEnum.TransformBit.ROTATION;

          if (rot.w !== undefined) {
            _index2.Quat.copy(this._lrot, rot);

            this._eulerDirty = true;
          } else {
            _index2.Vec3.copy(this._euler, rot);

            _index2.Quat.fromEuler(this._lrot, rot.x, rot.y, rot.z);

            this._eulerDirty = false;
          }
        }

        if (pos) {
          _index2.Vec3.copy(this._lpos, pos);

          dirtyBit |= _nodeEnum.TransformBit.POSITION;
        }

        if (scale) {
          _index2.Vec3.copy(this._lscale, scale);

          dirtyBit |= _nodeEnum.TransformBit.SCALE;
        }

        if (dirtyBit) {
          this.invalidateChildren(dirtyBit);

          if (this._eventMask & _baseNode.TRANSFORM_ON) {
            this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, dirtyBit);
          }
        }
      }
      /**
       * @en
       * Pause all system events which is dispatched by [[SystemEvent]].
       * If recursive is set to true, then this API will pause the node system events for the node and all nodes in its sub node tree.
       * @zh
       * 暂停所有 [[SystemEvent]] 派发的系统事件。
       * 如果传递 recursive 为 true，那么这个 API 将暂停本节点和它的子树上所有节点的节点系统事件。
       *
       * @param recursive Whether pause system events recursively for the child node tree
       */

    }, {
      key: "pauseSystemEvents",
      value: function pauseSystemEvents(recursive) {
        // @ts-ignore
        _eventManager.eventManager.pauseTarget(this, recursive);
      }
      /**
       * @en
       * Resume all paused system events which is dispatched by [[SystemEvent]].
       * If recursive is set to true, then this API will resume the node system events for the node and all nodes in its sub node tree.
       *
       * @zh
       * 恢复所有 [[SystemEvent]] 派发的系统事件。
       * 如果传递 recursive 为 true，那么这个 API 将恢复本节点和它的子树上所有节点的节点系统事件。
       *
       * @param recursive Whether resume system events recursively for the child node tree
       */

    }, {
      key: "resumeSystemEvents",
      value: function resumeSystemEvents(recursive) {
        // @ts-ignore
        _eventManager.eventManager.resumeTarget(this, recursive);
      }
    }, {
      key: "handle",
      get: function get() {
        return this._poolHandle;
      }
      /**
       * @en Position in local coordinate system
       * @zh 本地坐标系下的坐标
       */
      // @constget

    }, {
      key: "position",
      get: function get() {
        return this._lpos;
      },
      set: function set(val) {
        this.setPosition(val);
      }
      /**
       * @en Position in world coordinate system
       * @zh 世界坐标系下的坐标
       */
      // @constget

    }, {
      key: "worldPosition",
      get: function get() {
        this.updateWorldTransform();
        return this._pos;
      },
      set: function set(val) {
        this.setWorldPosition(val);

        _memoryPools.NodePool.setVec3(this._poolHandle, _memoryPools.NodeView.WORLD_POSITION, val);
      }
      /**
       * @en Rotation in local coordinate system, represented by a quaternion
       * @zh 本地坐标系下的旋转，用四元数表示
       */
      // @constget

    }, {
      key: "rotation",
      get: function get() {
        return this._lrot;
      },
      set: function set(val) {
        this.setRotation(val);
      }
      /**
       * @en Rotation in local coordinate system, represented by euler angles
       * @zh 本地坐标系下的旋转，用欧拉角表示
       */

    }, {
      key: "eulerAngles",
      set: function set(val) {
        this.setRotationFromEuler(val.x, val.y, val.z);
      },
      get: function get() {
        if (this._eulerDirty) {
          _index2.Quat.toEuler(this._euler, this._lrot);

          this._eulerDirty = false;
        }

        return this._euler;
      }
      /**
       * @en Rotation in world coordinate system, represented by a quaternion
       * @zh 世界坐标系下的旋转，用四元数表示
       */
      // @constget

    }, {
      key: "worldRotation",
      get: function get() {
        this.updateWorldTransform();
        return this._rot;
      },
      set: function set(val) {
        this.setWorldRotation(val);
      }
      /**
       * @en Scale in local coordinate system
       * @zh 本地坐标系下的缩放
       */
      // @constget

    }, {
      key: "scale",
      get: function get() {
        return this._lscale;
      },
      set: function set(val) {
        this.setScale(val);
      }
      /**
       * @en Scale in world coordinate system
       * @zh 世界坐标系下的缩放
       */
      // @constget

    }, {
      key: "worldScale",
      get: function get() {
        this.updateWorldTransform();
        return this._scale;
      },
      set: function set(val) {
        this.setWorldScale(val);

        _memoryPools.NodePool.setVec3(this._poolHandle, _memoryPools.NodeView.WORLD_SCALE, val);
      }
      /**
       * @en Local transformation matrix
       * @zh 本地坐标系变换矩阵
       */

    }, {
      key: "matrix",
      set: function set(val) {
        _index2.Mat4.toRTS(val, this._lrot, this._lpos, this._lscale);

        this.invalidateChildren(_nodeEnum.TransformBit.TRS);
        this._eulerDirty = true;

        if (this._eventMask & _baseNode.TRANSFORM_ON) {
          this.emit(_eventEnum.SystemEventType.TRANSFORM_CHANGED, _nodeEnum.TransformBit.TRS);
        }
      }
      /**
       * @en World transformation matrix
       * @zh 世界坐标系变换矩阵
       */
      // @constget

    }, {
      key: "worldMatrix",
      get: function get() {
        this.updateWorldTransform();
        return this._mat;
      }
      /**
       * @en The vector representing forward direction in local coordinate system, it's the minus z direction by default
       * @zh 当前节点面向的前方方向，默认前方为 -z 方向
       */

    }, {
      key: "forward",
      get: function get() {
        return _index2.Vec3.transformQuat(new _index2.Vec3(), _index2.Vec3.FORWARD, this.worldRotation);
      },
      set: function set(dir) {
        var len = dir.length();

        _index2.Vec3.multiplyScalar(v3_a, dir, -1 / len);

        _index2.Quat.fromViewUp(q_a, v3_a);

        this.setWorldRotation(q_a);
      }
      /**
       * @en Layer of the current Node, it affects raycast, physics etc, refer to [[Layers]]
       * @zh 节点所属层，主要影响射线检测、物理碰撞等，参考 [[Layers]]
       */

    }, {
      key: "layer",
      set: function set(l) {
        this._layer = l;

        _memoryPools.NodePool.set(this._poolHandle, _memoryPools.NodeView.LAYER, this._layer);
      },
      get: function get() {
        return this._layer;
      }
      /**
       * @en Whether the node's transformation have changed during the current frame.
       * @zh 这个节点的空间变换信息在当前帧内是否有变过？
       */

    }, {
      key: "hasChangedFlags",
      get: function get() {
        return bookOfChange.get(this._id) || 0;
      },
      set: function set(val) {
        bookOfChange.set(this._id, val);
      }
    }]);

    return Node;
  }(_baseNode.BaseNode), _class3.bookOfChange = bookOfChange, _class3.EventType = _eventEnum.SystemEventType, _class3.NodeSpace = _nodeEnum.NodeSpace, _class3.TransformDirtyBit = _nodeEnum.TransformBit, _class3.TransformBit = _nodeEnum.TransformBit, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "_lpos", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "_lrot", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Quat();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_lscale", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3(1, 1, 1);
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_layer", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return _layers.Layers.Enum.DEFAULT;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_euler", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec3();
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "eulerAngles", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "eulerAngles"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "layer", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "layer"), _class2.prototype)), _class2)) || _class);
  _exports.Node = Node;
  _globalExports.legacyCC.Node = Node;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvc2NlbmUtZ3JhcGgvbm9kZS50cyJdLCJuYW1lcyI6WyJ2M19hIiwiVmVjMyIsInFfYSIsIlF1YXQiLCJxX2IiLCJhcnJheV9hIiwiQXJyYXkiLCJxdF8xIiwibTNfMSIsIk1hdDMiLCJtM19zY2FsaW5nIiwibTRfMSIsIk1hdDQiLCJib29rT2ZDaGFuZ2UiLCJNYXAiLCJOb2RlIiwib2JqIiwiY29uc3RydWN0b3IiLCJsZWdhY3lDQyIsIlNjZW5lIiwibmFtZSIsIl91aVByb3BzIiwiTm9kZVVJUHJvcGVydGllcyIsIl9zdGF0aWMiLCJfcG9zIiwiX3JvdCIsIl9zY2FsZSIsIl9tYXQiLCJfZGlydHlGbGFncyIsIlRyYW5zZm9ybUJpdCIsIk5PTkUiLCJfZXVsZXJEaXJ0eSIsIl9wb29sSGFuZGxlIiwiTlVMTF9IQU5ETEUiLCJOb2RlUG9vbCIsImFsbG9jIiwic2V0IiwiTm9kZVZpZXciLCJMQVlFUiIsIl9sYXllciIsInNldFZlYzMiLCJXT1JMRF9TQ0FMRSIsImZyZWUiLCJ2YWx1ZSIsImtlZXBXb3JsZFRyYW5zZm9ybSIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwib2xkUGFyZW50IiwicGFyZW50IiwiX3BhcmVudCIsIm11bHRpcGx5IiwiaW52ZXJ0IiwidG9SVFMiLCJfbHJvdCIsIl9scG9zIiwiX2xzY2FsZSIsImNvcHkiLCJpbnZhbGlkYXRlQ2hpbGRyZW4iLCJUUlMiLCJfaWQiLCJsZW4iLCJfY2hpbGRyZW4iLCJsZW5ndGgiLCJpIiwiX29uQmF0Y2hDcmVhdGVkIiwiZXVsZXJBbmdsZXMiLCJhY3RpdmUiLCJldmVudE1hbmFnZXIiLCJyZXN1bWVUYXJnZXQiLCJldmVudFByb2Nlc3NvciIsInJlYXR0YWNoIiwicGF1c2VUYXJnZXQiLCJ0cmFucyIsIm5zIiwic3BhY2UiLCJOb2RlU3BhY2UiLCJMT0NBTCIsInRyYW5zZm9ybVF1YXQiLCJ4IiwieSIsInoiLCJXT1JMRCIsIndvcmxkUm90YXRpb24iLCJzY2FsZSIsIndvcmxkU2NhbGUiLCJQT1NJVElPTiIsIl9ldmVudE1hc2siLCJUUkFOU0ZPUk1fT04iLCJlbWl0IiwiU3lzdGVtRXZlbnRUeXBlIiwiVFJBTlNGT1JNX0NIQU5HRUQiLCJyb3QiLCJub3JtYWxpemUiLCJ3b3JsZFJvdCIsIlJPVEFUSU9OIiwicG9zIiwidXAiLCJnZXRXb3JsZFBvc2l0aW9uIiwic3VidHJhY3QiLCJmcm9tVmlld1VwIiwic2V0V29ybGRSb3RhdGlvbiIsImRpcnR5Qml0IiwiaGFzQ2hhbmdlZEZsYWdzIiwiY2hpbGQiLCJpc1ZhbGlkIiwiY3VyIiwiZGlydHlCaXRzIiwidHJhbnNmb3JtTWF0NCIsIm0xMiIsIm0xMyIsIm0xNCIsIldPUkxEX1BPU0lUSU9OIiwiUlMiLCJmcm9tUlRTIiwic2V0VmVjNCIsIldPUkxEX1JPVEFUSU9OIiwiZnJvbVF1YXQiLCJjb25qdWdhdGUiLCJtdWx0aXBseU1hdDQiLCJtMDAiLCJtMDQiLCJtMDgiLCJTQ0FMRSIsInNldE1hdDQiLCJXT1JMRF9NQVRSSVgiLCJ2YWwiLCJ1bmRlZmluZWQiLCJvdXQiLCJ3IiwiX2V1bGVyIiwiZnJvbUV1bGVyIiwicCIsInRyYW5zZm9ybUludmVyc2VSVFMiLCJsb2NhbCIsIm0wMSIsIm0wMiIsIm0wMyIsIm0wNSIsIm0wNiIsIm0wNyIsImZyb21SVCIsInJlY3Vyc2l2ZSIsInNldFBvc2l0aW9uIiwic2V0V29ybGRQb3NpdGlvbiIsInNldFJvdGF0aW9uIiwic2V0Um90YXRpb25Gcm9tRXVsZXIiLCJ0b0V1bGVyIiwic2V0U2NhbGUiLCJzZXRXb3JsZFNjYWxlIiwiRk9SV0FSRCIsImRpciIsIm11bHRpcGx5U2NhbGFyIiwibCIsImdldCIsIkJhc2VOb2RlIiwiRXZlbnRUeXBlIiwiVHJhbnNmb3JtRGlydHlCaXQiLCJzZXJpYWxpemFibGUiLCJMYXllcnMiLCJFbnVtIiwiREVGQVVMVCIsImVkaXRhYmxlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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RTs7eU5BK0psQitKLGU7O0FBd3RCTDlJLDBCQUFTSCxJQUFULEdBQWdCQSxJQUFoQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOSBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAY2F0ZWdvcnkgc2NlbmUtZ3JhcGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCB0eXBlLCBzZXJpYWxpemFibGUsIGVkaXRhYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgTWF0MywgTWF0NCwgUXVhdCwgVmVjMyB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBTeXN0ZW1FdmVudFR5cGUgfSBmcm9tICcuLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LWVudW0nO1xyXG5pbXBvcnQgeyBldmVudE1hbmFnZXIgfSBmcm9tICcuLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LW1hbmFnZXInO1xyXG5pbXBvcnQgeyBCYXNlTm9kZSwgVFJBTlNGT1JNX09OIH0gZnJvbSAnLi9iYXNlLW5vZGUnO1xyXG5pbXBvcnQgeyBMYXllcnMgfSBmcm9tICcuL2xheWVycyc7XHJcbmltcG9ydCB7IE5vZGVTcGFjZSwgVHJhbnNmb3JtQml0IH0gZnJvbSAnLi9ub2RlLWVudW0nO1xyXG5pbXBvcnQgeyBOb2RlVUlQcm9wZXJ0aWVzIH0gZnJvbSAnLi9ub2RlLXVpLXByb3BlcnRpZXMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgTm9kZUhhbmRsZSwgTm9kZVBvb2wsIE5vZGVWaWV3LCBOVUxMX0hBTkRMRSB9IGZyb20gJy4uL3JlbmRlcmVyL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuXHJcbmNvbnN0IHYzX2EgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBxX2EgPSBuZXcgUXVhdCgpO1xyXG5jb25zdCBxX2IgPSBuZXcgUXVhdCgpO1xyXG5jb25zdCBhcnJheV9hID0gbmV3IEFycmF5KDEwKTtcclxuY29uc3QgcXRfMSA9IG5ldyBRdWF0KCk7XHJcbmNvbnN0IG0zXzEgPSBuZXcgTWF0MygpO1xyXG5jb25zdCBtM19zY2FsaW5nID0gbmV3IE1hdDMoKTtcclxuY29uc3QgbTRfMSA9IG5ldyBNYXQ0KCk7XHJcbmNvbnN0IGJvb2tPZkNoYW5nZSA9IG5ldyBNYXA8c3RyaW5nLCBudW1iZXI+KCk7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOWcuuaZr+agkeS4reeahOWfuuacrOiKgueCue+8jOWfuuacrOeJueaAp+acie+8mlxyXG4gKiAqIOWFt+acieWxgue6p+WFs+ezu1xyXG4gKiAqIOaMgeacieWQhOexu+e7hOS7tlxyXG4gKiAqIOe7tOaKpOepuumXtOWPmOaNou+8iOWdkOagh+OAgeaXi+i9rOOAgee8qeaUvu+8ieS/oeaBr1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiAhI2VuXHJcbiAqIENsYXNzIG9mIGFsbCBlbnRpdGllcyBpbiBDb2NvcyBDcmVhdG9yIHNjZW5lcy5cclxuICogQmFzaWMgZnVuY3Rpb25hbGl0aWVzIGluY2x1ZGU6XHJcbiAqICogSGllcmFyY2h5IG1hbmFnZW1lbnQgd2l0aCBwYXJlbnQgYW5kIGNoaWxkcmVuXHJcbiAqICogQ29tcG9uZW50cyBtYW5hZ2VtZW50XHJcbiAqICogQ29vcmRpbmF0ZSBzeXN0ZW0gd2l0aCBwb3NpdGlvbiwgc2NhbGUsIHJvdGF0aW9uIGluIDNkIHNwYWNlXHJcbiAqICEjemhcclxuICogQ29jb3MgQ3JlYXRvciDlnLrmma/kuK3nmoTmiYDmnInoioLngrnnsbvjgIJcclxuICog5Z+65pys54m55oCn5pyJ77yaXHJcbiAqICog5YW35pyJ5bGC57qn5YWz57O7XHJcbiAqICog5oyB5pyJ5ZCE57G757uE5Lu2XHJcbiAqICog57u05oqkIDNEIOepuumXtOW3pui+ueWPmOaNou+8iOWdkOagh+OAgeaXi+i9rOOAgee8qeaUvu+8ieS/oeaBr1xyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLk5vZGUnKVxyXG5leHBvcnQgY2xhc3MgTm9kZSBleHRlbmRzIEJhc2VOb2RlIHtcclxuICAgIHB1YmxpYyBzdGF0aWMgYm9va09mQ2hhbmdlID0gYm9va09mQ2hhbmdlO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEV2ZW50IHR5cGVzIGVtaXR0ZWQgYnkgTm9kZVxyXG4gICAgICogQHpoIOiKgueCueWPr+iDveWPkeWHuueahOS6i+S7tuexu+Wei1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEV2ZW50VHlwZSA9IFN5c3RlbUV2ZW50VHlwZTtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIENvb3JkaW5hdGVzIHNwYWNlXHJcbiAgICAgKiBAemgg56m66Ze05Y+Y5o2i5pON5L2c55qE5Z2Q5qCH57O7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgTm9kZVNwYWNlID0gTm9kZVNwYWNlO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQml0IG1hc2tzIGZvciBOb2RlIHRyYW5zZm9ybWF0aW9uIHBhcnRzXHJcbiAgICAgKiBAemgg6IqC54K55Y+Y5o2i5pu05paw55qE5YW35L2T6YOo5YiGXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBwbGVhc2UgdXNlIFtbTm9kZS5UcmFuc2Zvcm1CaXRdXVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFRyYW5zZm9ybURpcnR5Qml0ID0gVHJhbnNmb3JtQml0O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQml0IG1hc2tzIGZvciBOb2RlIHRyYW5zZm9ybWF0aW9uIHBhcnRzLCBjYW4gYmUgdXNlZCB0byBkZXRlcm1pbmUgd2hpY2ggcGFydCBjaGFuZ2VkIGluIFtbU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VEXV0gZXZlbnRcclxuICAgICAqIEB6aCDoioLngrnlj5jmjaLmm7TmlrDnmoTlhbfkvZPpg6jliIbvvIzlj6/nlKjkuo7liKTmlq0gW1tTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRURdXSDkuovku7bnmoTlhbfkvZPnsbvlnotcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBUcmFuc2Zvcm1CaXQgPSBUcmFuc2Zvcm1CaXQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRGV0ZXJtaW5lIHdoZXRoZXIgdGhlIGdpdmVuIG9iamVjdCBpcyBhIG5vcm1hbCBOb2RlLiBXaWxsIHJldHVybiBmYWxzZSBpZiBbW1NjZW5lXV0gZ2l2ZW4uXHJcbiAgICAgKiBAemgg5oyH5a6a5a+56LGh5piv5ZCm5piv5pmu6YCa55qE6IqC54K577yf5aaC5p6c5Lyg5YWlIFtbU2NlbmVdXSDkvJrov5Tlm54gZmFsc2XjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBpc05vZGUgKG9iajogb2JqZWN0IHwgbnVsbCk6IG9iaiBpcyBOb2RlIHtcclxuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgTm9kZSAmJiAob2JqLmNvbnN0cnVjdG9yID09PSBOb2RlIHx8ICEob2JqIGluc3RhbmNlb2YgbGVnYWN5Q0MuU2NlbmUpKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBVSSDpg6jliIbnmoTohI/mlbDmja5cclxuICAgIHB1YmxpYyBfdWlQcm9wcyA9IG5ldyBOb2RlVUlQcm9wZXJ0aWVzKHRoaXMpO1xyXG4gICAgcHVibGljIF9zdGF0aWMgPSBmYWxzZTtcclxuXHJcbiAgICAvLyB3b3JsZCB0cmFuc2Zvcm0sIGRvbid0IGFjY2VzcyB0aGlzIGRpcmVjdGx5XHJcbiAgICBwcm90ZWN0ZWQgX3BvcyA9IG5ldyBWZWMzKCk7XHJcbiAgICBwcm90ZWN0ZWQgX3JvdCA9IG5ldyBRdWF0KCk7XHJcbiAgICBwcm90ZWN0ZWQgX3NjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcbiAgICBwcm90ZWN0ZWQgX21hdCA9IG5ldyBNYXQ0KCk7XHJcblxyXG4gICAgLy8gbG9jYWwgdHJhbnNmb3JtXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2xwb3MgPSBuZXcgVmVjMygpO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9scm90ID0gbmV3IFF1YXQoKTtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByb3RlY3RlZCBfbHNjYWxlID0gbmV3IFZlYzMoMSwgMSwgMSk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2xheWVyID0gTGF5ZXJzLkVudW0uREVGQVVMVDsgLy8gdGhlIGxheWVyIHRoaXMgbm9kZSBiZWxvbmdzIHRvXHJcblxyXG4gICAgLy8gbG9jYWwgcm90YXRpb24gaW4gZXVsZXIgYW5nbGVzLCBtYWludGFpbmVkIGhlcmUgc28gdGhhdCByb3RhdGlvbiBhbmdsZXMgY291bGQgYmUgZ3JlYXRlciB0aGFuIDM2MCBkZWdyZWUuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2V1bGVyID0gbmV3IFZlYzMoKTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RpcnR5RmxhZ3MgPSBUcmFuc2Zvcm1CaXQuTk9ORTsgLy8gZG9lcyB0aGUgd29ybGQgdHJhbnNmb3JtIG5lZWQgdG8gdXBkYXRlP1xyXG4gICAgcHJvdGVjdGVkIF9ldWxlckRpcnR5ID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX3Bvb2xIYW5kbGU6IE5vZGVIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAobmFtZT86IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIHRoaXMuX3Bvb2xIYW5kbGUgPSBOb2RlUG9vbC5hbGxvYygpO1xyXG4gICAgICAgIE5vZGVQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBOb2RlVmlldy5MQVlFUiwgdGhpcy5fbGF5ZXIpO1xyXG4gICAgICAgIE5vZGVQb29sLnNldFZlYzModGhpcy5fcG9vbEhhbmRsZSwgTm9kZVZpZXcuV09STERfU0NBTEUsIHRoaXMuX3NjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2xIYW5kbGUpIHtcclxuICAgICAgICAgICAgTm9kZVBvb2wuZnJlZSh0aGlzLl9wb29sSGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbEhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBoYW5kbGUgKCkgOiBOb2RlSGFuZGxlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcG9vbEhhbmRsZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQb3NpdGlvbiBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHpoIOacrOWcsOWdkOagh+ezu+S4i+eahOWdkOagh1xyXG4gICAgICovXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIHB1YmxpYyBnZXQgcG9zaXRpb24gKCk6IFJlYWRvbmx5PFZlYzM+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbHBvcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgcG9zaXRpb24gKHZhbDogUmVhZG9ubHk8VmVjMz4pIHtcclxuICAgICAgICB0aGlzLnNldFBvc2l0aW9uKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEB6aCDkuJbnlYzlnZDmoIfns7vkuIvnmoTlnZDmoIdcclxuICAgICAqL1xyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkUG9zaXRpb24gKCk6IFJlYWRvbmx5PFZlYzM+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BvcztcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgd29ybGRQb3NpdGlvbiAodmFsOiBSZWFkb25seTxWZWMzPikge1xyXG4gICAgICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbih2YWwpO1xyXG4gICAgICAgIE5vZGVQb29sLnNldFZlYzModGhpcy5fcG9vbEhhbmRsZSwgTm9kZVZpZXcuV09STERfUE9TSVRJT04sIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUm90YXRpb24gaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHJlcHJlc2VudGVkIGJ5IGEgcXVhdGVybmlvblxyXG4gICAgICogQHpoIOacrOWcsOWdkOagh+ezu+S4i+eahOaXi+i9rO+8jOeUqOWbm+WFg+aVsOihqOekulxyXG4gICAgICovXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIHB1YmxpYyBnZXQgcm90YXRpb24gKCk6IFJlYWRvbmx5PFF1YXQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbHJvdDtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgcm90YXRpb24gKHZhbDogUmVhZG9ubHk8UXVhdD4pIHtcclxuICAgICAgICB0aGlzLnNldFJvdGF0aW9uKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUm90YXRpb24gaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHJlcHJlc2VudGVkIGJ5IGV1bGVyIGFuZ2xlc1xyXG4gICAgICogQHpoIOacrOWcsOWdkOagh+ezu+S4i+eahOaXi+i9rO+8jOeUqOasp+aLieinkuihqOekulxyXG4gICAgICovXHJcbiAgICBAdHlwZShWZWMzKVxyXG4gICAgc2V0IGV1bGVyQW5nbGVzICh2YWw6IFJlYWRvbmx5PFZlYzM+KSB7XHJcbiAgICAgICAgdGhpcy5zZXRSb3RhdGlvbkZyb21FdWxlcih2YWwueCwgdmFsLnksIHZhbC56KTtcclxuICAgIH1cclxuICAgIGdldCBldWxlckFuZ2xlcyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V1bGVyRGlydHkpIHtcclxuICAgICAgICAgICAgUXVhdC50b0V1bGVyKHRoaXMuX2V1bGVyLCB0aGlzLl9scm90KTtcclxuICAgICAgICAgICAgdGhpcy5fZXVsZXJEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fZXVsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUm90YXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW0sIHJlcHJlc2VudGVkIGJ5IGEgcXVhdGVybmlvblxyXG4gICAgICogQHpoIOS4lueVjOWdkOagh+ezu+S4i+eahOaXi+i9rO+8jOeUqOWbm+WFg+aVsOihqOekulxyXG4gICAgICovXHJcbiAgICAvLyBAY29uc3RnZXRcclxuICAgIHB1YmxpYyBnZXQgd29ybGRSb3RhdGlvbiAoKTogUmVhZG9ubHk8UXVhdD4ge1xyXG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm90O1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB3b3JsZFJvdGF0aW9uICh2YWw6IFJlYWRvbmx5PFF1YXQ+KSB7XHJcbiAgICAgICAgdGhpcy5zZXRXb3JsZFJvdGF0aW9uKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2NhbGUgaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEB6aCDmnKzlnLDlnZDmoIfns7vkuIvnmoTnvKnmlL5cclxuICAgICAqL1xyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBwdWJsaWMgZ2V0IHNjYWxlICgpOiBSZWFkb25seTxWZWMzPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xzY2FsZTtcclxuICAgIH1cclxuICAgIHB1YmxpYyBzZXQgc2NhbGUgKHZhbDogUmVhZG9ubHk8VmVjMz4pIHtcclxuICAgICAgICB0aGlzLnNldFNjYWxlKHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2NhbGUgaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEB6aCDkuJbnlYzlnZDmoIfns7vkuIvnmoTnvKnmlL5cclxuICAgICAqL1xyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkU2NhbGUgKCk6IFJlYWRvbmx5PFZlYzM+IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjYWxlO1xyXG4gICAgfVxyXG4gICAgcHVibGljIHNldCB3b3JsZFNjYWxlICh2YWw6IFJlYWRvbmx5PFZlYzM+KSB7XHJcbiAgICAgICAgdGhpcy5zZXRXb3JsZFNjYWxlKHZhbCk7XHJcbiAgICAgICAgTm9kZVBvb2wuc2V0VmVjMyh0aGlzLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9TQ0FMRSwgdmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBMb2NhbCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcclxuICAgICAqIEB6aCDmnKzlnLDlnZDmoIfns7vlj5jmjaLnn6npmLVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBtYXRyaXggKHZhbDogUmVhZG9ubHk8TWF0ND4pIHtcclxuICAgICAgICBNYXQ0LnRvUlRTKHZhbCwgdGhpcy5fbHJvdCwgdGhpcy5fbHBvcywgdGhpcy5fbHNjYWxlKTtcclxuICAgICAgICB0aGlzLmludmFsaWRhdGVDaGlsZHJlbihUcmFuc2Zvcm1CaXQuVFJTKTtcclxuICAgICAgICB0aGlzLl9ldWxlckRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgVFJBTlNGT1JNX09OKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQsIFRyYW5zZm9ybUJpdC5UUlMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXb3JsZCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcclxuICAgICAqIEB6aCDkuJbnlYzlnZDmoIfns7vlj5jmjaLnn6npmLVcclxuICAgICAqL1xyXG4gICAgLy8gQGNvbnN0Z2V0XHJcbiAgICBwdWJsaWMgZ2V0IHdvcmxkTWF0cml4ICgpOiBSZWFkb25seTxNYXQ0PiB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHZlY3RvciByZXByZXNlbnRpbmcgZm9yd2FyZCBkaXJlY3Rpb24gaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIGl0J3MgdGhlIG1pbnVzIHogZGlyZWN0aW9uIGJ5IGRlZmF1bHRcclxuICAgICAqIEB6aCDlvZPliY3oioLngrnpnaLlkJHnmoTliY3mlrnmlrnlkJHvvIzpu5jorqTliY3mlrnkuLogLXog5pa55ZCRXHJcbiAgICAgKi9cclxuICAgIGdldCBmb3J3YXJkICgpOiBWZWMzIHtcclxuICAgICAgICByZXR1cm4gVmVjMy50cmFuc2Zvcm1RdWF0KG5ldyBWZWMzKCksIFZlYzMuRk9SV0FSRCwgdGhpcy53b3JsZFJvdGF0aW9uKTtcclxuICAgIH1cclxuICAgIHNldCBmb3J3YXJkIChkaXI6IFZlYzMpIHtcclxuICAgICAgICBjb25zdCBsZW4gPSBkaXIubGVuZ3RoKCk7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcih2M19hLCBkaXIsIC0xIC8gbGVuKTtcclxuICAgICAgICBRdWF0LmZyb21WaWV3VXAocV9hLCB2M19hKTtcclxuICAgICAgICB0aGlzLnNldFdvcmxkUm90YXRpb24ocV9hKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBMYXllciBvZiB0aGUgY3VycmVudCBOb2RlLCBpdCBhZmZlY3RzIHJheWNhc3QsIHBoeXNpY3MgZXRjLCByZWZlciB0byBbW0xheWVyc11dXHJcbiAgICAgKiBAemgg6IqC54K55omA5bGe5bGC77yM5Li76KaB5b2x5ZON5bCE57q/5qOA5rWL44CB54mp55CG56Kw5pKe562J77yM5Y+C6ICDIFtbTGF5ZXJzXV1cclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBzZXQgbGF5ZXIgKGwpIHtcclxuICAgICAgICB0aGlzLl9sYXllciA9IGw7XHJcbiAgICAgICAgTm9kZVBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIE5vZGVWaWV3LkxBWUVSLCB0aGlzLl9sYXllcilcclxuICAgIH1cclxuICAgIGdldCBsYXllciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xheWVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFdoZXRoZXIgdGhlIG5vZGUncyB0cmFuc2Zvcm1hdGlvbiBoYXZlIGNoYW5nZWQgZHVyaW5nIHRoZSBjdXJyZW50IGZyYW1lLlxyXG4gICAgICogQHpoIOi/meS4quiKgueCueeahOepuumXtOWPmOaNouS/oeaBr+WcqOW9k+WJjeW4p+WGheaYr+WQpuacieWPmOi/h++8n1xyXG4gICAgICovXHJcbiAgICBnZXQgaGFzQ2hhbmdlZEZsYWdzICgpIHtcclxuICAgICAgICByZXR1cm4gYm9va09mQ2hhbmdlLmdldCh0aGlzLl9pZCkgfHwgMDtcclxuICAgIH1cclxuICAgIHNldCBoYXNDaGFuZ2VkRmxhZ3MgKHZhbDogbnVtYmVyKSB7XHJcbiAgICAgICAgYm9va09mQ2hhbmdlLnNldCh0aGlzLl9pZCwgdmFsKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBoaWVyYXJjaHlcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgcGFyZW50IG9mIHRoZSBub2RlLlxyXG4gICAgICogQHpoIOiuvue9ruivpeiKgueCueeahOeItuiKgueCueOAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIFBhcmVudCBub2RlXHJcbiAgICAgKiBAcGFyYW0ga2VlcFdvcmxkVHJhbnNmb3JtIFdoZXRoZXIga2VlcCBub2RlJ3MgY3VycmVudCB3b3JsZCB0cmFuc2Zvcm0gdW5jaGFuZ2VkIGFmdGVyIHRoaXMgb3BlcmF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRQYXJlbnQgKHZhbHVlOiB0aGlzIHwgbnVsbCwga2VlcFdvcmxkVHJhbnNmb3JtOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoa2VlcFdvcmxkVHJhbnNmb3JtKSB7IHRoaXMudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTsgfVxyXG4gICAgICAgIHN1cGVyLnNldFBhcmVudCh2YWx1ZSwga2VlcFdvcmxkVHJhbnNmb3JtKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uU2V0UGFyZW50IChvbGRQYXJlbnQ6IHRoaXMgfCBudWxsLCBrZWVwV29ybGRUcmFuc2Zvcm06IGJvb2xlYW4pIHtcclxuICAgICAgICBzdXBlci5fb25TZXRQYXJlbnQob2xkUGFyZW50LCBrZWVwV29ybGRUcmFuc2Zvcm0pO1xyXG4gICAgICAgIGlmIChrZWVwV29ybGRUcmFuc2Zvcm0pIHtcclxuICAgICAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xyXG4gICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnQudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgICAgIE1hdDQubXVsdGlwbHkobTRfMSwgTWF0NC5pbnZlcnQobTRfMSwgcGFyZW50Ll9tYXQpLCB0aGlzLl9tYXQpO1xyXG4gICAgICAgICAgICAgICAgTWF0NC50b1JUUyhtNF8xLCB0aGlzLl9scm90LCB0aGlzLl9scG9zLCB0aGlzLl9sc2NhbGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xwb3MsIHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgICAgICAgICBRdWF0LmNvcHkodGhpcy5fbHJvdCwgdGhpcy5fcm90KTtcclxuICAgICAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9sc2NhbGUsIHRoaXMuX3NjYWxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9ldWxlckRpcnR5ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKFRyYW5zZm9ybUJpdC5UUlMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfb25CYXRjaENyZWF0ZWQgKCkge1xyXG4gICAgICAgIHN1cGVyLl9vbkJhdGNoQ3JlYXRlZCgpO1xyXG4gICAgICAgIGJvb2tPZkNoYW5nZS5zZXQodGhpcy5faWQsIFRyYW5zZm9ybUJpdC5UUlMpO1xyXG4gICAgICAgIHRoaXMuX2RpcnR5RmxhZ3MgPSBUcmFuc2Zvcm1CaXQuVFJTO1xyXG4gICAgICAgIGNvbnN0IGxlbiA9IHRoaXMuX2NoaWxkcmVuLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuW2ldLl9vbkJhdGNoQ3JlYXRlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uQmF0Y2hSZXN0b3JlZCAoKSB7XHJcbiAgICAgICAgdGhpcy5fb25CYXRjaENyZWF0ZWQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uQmVmb3JlU2VyaWFsaXplICgpIHtcclxuICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG5vLXVudXNlZC1leHByZXNzaW9uXHJcbiAgICAgICAgdGhpcy5ldWxlckFuZ2xlczsgLy8gbWFrZSBzdXJlIHdlIHNhdmUgdGhlIGNvcnJlY3QgZXVsZXJBbmdsZXNcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uUG9zdEFjdGl2YXRlZCAoYWN0aXZlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKGFjdGl2ZSkgeyAvLyBhY3RpdmF0ZWRcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzKTtcclxuICAgICAgICAgICAgdGhpcy5ldmVudFByb2Nlc3Nvci5yZWF0dGFjaCgpO1xyXG4gICAgICAgICAgICAvLyBpbiBjYXNlIHRyYW5zZm9ybSB1cGRhdGVkIGR1cmluZyBkZWFjdGl2YXRlZCBwZXJpb2RcclxuICAgICAgICAgICAgdGhpcy5pbnZhbGlkYXRlQ2hpbGRyZW4oVHJhbnNmb3JtQml0LlRSUyk7XHJcbiAgICAgICAgfSBlbHNlIHsgLy8gZGVhY3RpdmF0ZWRcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnBhdXNlVGFyZ2V0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyB0cmFuc2Zvcm0gaGVscGVyLCBjb252ZW5pZW50IGJ1dCBub3QgdGhlIG1vc3QgZWZmaWNpZW50XHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGVyZm9ybSBhIHRyYW5zbGF0aW9uIG9uIHRoZSBub2RlXHJcbiAgICAgKiBAemgg56e75Yqo6IqC54K5XHJcbiAgICAgKiBAcGFyYW0gdHJhbnMgVGhlIGluY3JlbWVudCBvbiBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIG5zIFRoZSBvcGVyYXRpb24gY29vcmRpbmF0ZSBzcGFjZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJhbnNsYXRlICh0cmFuczogVmVjMywgbnM/OiBOb2RlU3BhY2UpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBzcGFjZSA9IG5zIHx8IE5vZGVTcGFjZS5MT0NBTDtcclxuICAgICAgICBpZiAoc3BhY2UgPT09IE5vZGVTcGFjZS5MT0NBTCkge1xyXG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybVF1YXQodjNfYSwgdHJhbnMsIHRoaXMuX2xyb3QpO1xyXG4gICAgICAgICAgICB0aGlzLl9scG9zLnggKz0gdjNfYS54O1xyXG4gICAgICAgICAgICB0aGlzLl9scG9zLnkgKz0gdjNfYS55O1xyXG4gICAgICAgICAgICB0aGlzLl9scG9zLnogKz0gdjNfYS56O1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc3BhY2UgPT09IE5vZGVTcGFjZS5XT1JMRCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICBRdWF0LmludmVydChxX2EsIHRoaXMuX3BhcmVudC53b3JsZFJvdGF0aW9uKTtcclxuICAgICAgICAgICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdCh2M19hLCB0cmFucywgcV9hKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHNjYWxlID0gdGhpcy53b3JsZFNjYWxlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbHBvcy54ICs9IHYzX2EueCAvIHNjYWxlLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9scG9zLnkgKz0gdjNfYS55IC8gc2NhbGUueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xwb3MueiArPSB2M19hLnogLyBzY2FsZS56O1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbHBvcy54ICs9IHRyYW5zLng7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9scG9zLnkgKz0gdHJhbnMueTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xwb3MueiArPSB0cmFucy56O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmludmFsaWRhdGVDaGlsZHJlbihUcmFuc2Zvcm1CaXQuUE9TSVRJT04pO1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBUUkFOU0ZPUk1fT04pIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgVHJhbnNmb3JtQml0LlBPU0lUSU9OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUGVyZm9ybSBhIHJvdGF0aW9uIG9uIHRoZSBub2RlXHJcbiAgICAgKiBAemgg5peL6L2s6IqC54K5XHJcbiAgICAgKiBAcGFyYW0gdHJhbnMgVGhlIGluY3JlbWVudCBvbiBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIG5zIFRoZSBvcGVyYXRpb24gY29vcmRpbmF0ZSBzcGFjZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcm90YXRlIChyb3Q6IFF1YXQsIG5zPzogTm9kZVNwYWNlKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc3BhY2UgPSBucyB8fCBOb2RlU3BhY2UuTE9DQUw7XHJcbiAgICAgICAgUXVhdC5ub3JtYWxpemUocV9hLCByb3QpO1xyXG5cclxuICAgICAgICBpZiAoc3BhY2UgPT09IE5vZGVTcGFjZS5MT0NBTCkge1xyXG4gICAgICAgICAgICBRdWF0Lm11bHRpcGx5KHRoaXMuX2xyb3QsIHRoaXMuX2xyb3QsIHFfYSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChzcGFjZSA9PT0gTm9kZVNwYWNlLldPUkxEKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkUm90ID0gdGhpcy53b3JsZFJvdGF0aW9uO1xyXG4gICAgICAgICAgICBRdWF0Lm11bHRpcGx5KHFfYiwgcV9hLCB3b3JsZFJvdCk7XHJcbiAgICAgICAgICAgIFF1YXQuaW52ZXJ0KHFfYSwgd29ybGRSb3QpO1xyXG4gICAgICAgICAgICBRdWF0Lm11bHRpcGx5KHFfYiwgcV9hLCBxX2IpO1xyXG4gICAgICAgICAgICBRdWF0Lm11bHRpcGx5KHRoaXMuX2xyb3QsIHRoaXMuX2xyb3QsIHFfYik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V1bGVyRGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmludmFsaWRhdGVDaGlsZHJlbihUcmFuc2Zvcm1CaXQuUk9UQVRJT04pO1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBUUkFOU0ZPUk1fT04pIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgVHJhbnNmb3JtQml0LlJPVEFUSU9OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgbm9kZSB0byBmYWNlIHRoZSB0YXJnZXQgcG9zaXRpb24sIHRoZSBub2RlIGlzIGZhY2luZyBtaW51cyB6IGRpcmVjdGlvbiBieSBkZWZhdWx0XHJcbiAgICAgKiBAemgg6K6+572u5b2T5YmN6IqC54K55peL6L2s5Li66Z2i5ZCR55uu5qCH5L2N572u77yM6buY6K6k5YmN5pa55Li6IC16IOaWueWQkVxyXG4gICAgICogQHBhcmFtIHBvcyBUYXJnZXQgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB1cCBVcCBkaXJlY3Rpb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIGxvb2tBdCAocG9zOiBWZWMzLCB1cD86IFZlYzMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmdldFdvcmxkUG9zaXRpb24odjNfYSk7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh2M19hLCB2M19hLCBwb3MpO1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKHYzX2EsIHYzX2EpO1xyXG4gICAgICAgIFF1YXQuZnJvbVZpZXdVcChxX2EsIHYzX2EsIHVwKTtcclxuICAgICAgICB0aGlzLnNldFdvcmxkUm90YXRpb24ocV9hKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyB0cmFuc2Zvcm0gbWFpbnRhaW5lclxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEludmFsaWRhdGUgdGhlIHdvcmxkIHRyYW5zZm9ybSBpbmZvcm1hdGlvblxyXG4gICAgICogZm9yIHRoaXMgbm9kZSBhbmQgYWxsIGl0cyBjaGlsZHJlbiByZWN1cnNpdmVseVxyXG4gICAgICogQHpoIOmAkuW9kuagh+iusOiKgueCueS4lueVjOWPmOaNouS4uiBkaXJ0eVxyXG4gICAgICogQHBhcmFtIGRpcnR5Qml0IFRoZSBkaXJ0eSBiaXRzIHRvIHNldHVwIHRvIGNoaWxkcmVuLCBjYW4gYmUgY29tcG9zZWQgd2l0aCBtdWx0aXBsZSBkaXJ0eSBiaXRzXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbnZhbGlkYXRlQ2hpbGRyZW4gKGRpcnR5Qml0OiBUcmFuc2Zvcm1CaXQpIHtcclxuICAgICAgICBpZiAoKHRoaXMuX2RpcnR5RmxhZ3MgJiB0aGlzLmhhc0NoYW5nZWRGbGFncyAmIGRpcnR5Qml0KSA9PT0gZGlydHlCaXQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fZGlydHlGbGFncyB8PSBkaXJ0eUJpdDtcclxuICAgICAgICBib29rT2ZDaGFuZ2Uuc2V0KHRoaXMuX2lkLCB0aGlzLmhhc0NoYW5nZWRGbGFncyB8IGRpcnR5Qml0KTtcclxuICAgICAgICBkaXJ0eUJpdCB8PSBUcmFuc2Zvcm1CaXQuUE9TSVRJT047XHJcbiAgICAgICAgY29uc3QgbGVuID0gdGhpcy5fY2hpbGRyZW4ubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSB0aGlzLl9jaGlsZHJlbltpXTtcclxuICAgICAgICAgICAgaWYgKGNoaWxkLmlzVmFsaWQpIHsgY2hpbGQuaW52YWxpZGF0ZUNoaWxkcmVuKGRpcnR5Qml0KTsgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVcGRhdGUgdGhlIHdvcmxkIHRyYW5zZm9ybSBpbmZvcm1hdGlvbiBpZiBvdXRkYXRlZFxyXG4gICAgICogQHpoIOabtOaWsOiKgueCueeahOS4lueVjOWPmOaNouS/oeaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlV29ybGRUcmFuc2Zvcm0gKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fZGlydHlGbGFncykgeyByZXR1cm47IH1cclxuICAgICAgICBsZXQgY3VyOiB0aGlzIHwgbnVsbCA9IHRoaXM7XHJcbiAgICAgICAgbGV0IGkgPSAwO1xyXG4gICAgICAgIHdoaWxlIChjdXIgJiYgY3VyLl9kaXJ0eUZsYWdzKSB7XHJcbiAgICAgICAgICAgIC8vIHRvcCBsZXZlbCBub2RlXHJcbiAgICAgICAgICAgIGFycmF5X2FbaSsrXSA9IGN1cjtcclxuICAgICAgICAgICAgY3VyID0gY3VyLl9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBjaGlsZDogdGhpczsgbGV0IGRpcnR5Qml0cyA9IDA7XHJcblxyXG4gICAgICAgIHdoaWxlIChpKSB7XHJcbiAgICAgICAgICAgIGNoaWxkID0gYXJyYXlfYVstLWldO1xyXG4gICAgICAgICAgICBkaXJ0eUJpdHMgfD0gY2hpbGQuX2RpcnR5RmxhZ3M7XHJcbiAgICAgICAgICAgIGlmIChjdXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkaXJ0eUJpdHMgJiBUcmFuc2Zvcm1CaXQuUE9TSVRJT04pIHtcclxuICAgICAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQoY2hpbGQuX3BvcywgY2hpbGQuX2xwb3MsIGN1ci5fbWF0KTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xMiA9IGNoaWxkLl9wb3MueDtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xMyA9IGNoaWxkLl9wb3MueTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xNCA9IGNoaWxkLl9wb3MuejtcclxuICAgICAgICAgICAgICAgICAgICBOb2RlUG9vbC5zZXRWZWMzKGNoaWxkLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9QT1NJVElPTiwgY2hpbGQuX3Bvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlydHlCaXRzICYgVHJhbnNmb3JtQml0LlJTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5mcm9tUlRTKGNoaWxkLl9tYXQsIGNoaWxkLl9scm90LCBjaGlsZC5fbHBvcywgY2hpbGQuX2xzY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0NC5tdWx0aXBseShjaGlsZC5fbWF0LCBjdXIuX21hdCwgY2hpbGQuX21hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcnR5Qml0cyAmIFRyYW5zZm9ybUJpdC5ST1RBVElPTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBRdWF0Lm11bHRpcGx5KGNoaWxkLl9yb3QsIGN1ci5fcm90LCBjaGlsZC5fbHJvdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVQb29sLnNldFZlYzQoY2hpbGQuX3Bvb2xIYW5kbGUsIE5vZGVWaWV3LldPUkxEX1JPVEFUSU9OLCBjaGlsZC5fcm90KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0My5mcm9tUXVhdChtM18xLCBRdWF0LmNvbmp1Z2F0ZShxdF8xLCBjaGlsZC5fcm90KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgTWF0My5tdWx0aXBseU1hdDQobTNfMSwgbTNfMSwgY2hpbGQuX21hdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2hpbGQuX3NjYWxlLnggPSBtM18xLm0wMDtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fc2NhbGUueSA9IG0zXzEubTA0O1xyXG4gICAgICAgICAgICAgICAgICAgIGNoaWxkLl9zY2FsZS56ID0gbTNfMS5tMDg7XHJcbiAgICAgICAgICAgICAgICAgICAgTm9kZVBvb2wuc2V0VmVjMyhjaGlsZC5fcG9vbEhhbmRsZSwgTm9kZVZpZXcuV09STERfU0NBTEUsIGNoaWxkLl9zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlydHlCaXRzICYgVHJhbnNmb3JtQml0LlBPU0lUSU9OKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmVjMy5jb3B5KGNoaWxkLl9wb3MsIGNoaWxkLl9scG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xMiA9IGNoaWxkLl9wb3MueDtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xMyA9IGNoaWxkLl9wb3MueTtcclxuICAgICAgICAgICAgICAgICAgICBjaGlsZC5fbWF0Lm0xNCA9IGNoaWxkLl9wb3MuejtcclxuICAgICAgICAgICAgICAgICAgICBOb2RlUG9vbC5zZXRWZWMzKGNoaWxkLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9QT1NJVElPTiwgY2hpbGQuX3Bvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZGlydHlCaXRzICYgVHJhbnNmb3JtQml0LlJTKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRpcnR5Qml0cyAmIFRyYW5zZm9ybUJpdC5ST1RBVElPTikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBRdWF0LmNvcHkoY2hpbGQuX3JvdCwgY2hpbGQuX2xyb3QpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOb2RlUG9vbC5zZXRWZWM0KGNoaWxkLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9ST1RBVElPTiwgY2hpbGQuX3JvdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkaXJ0eUJpdHMgJiBUcmFuc2Zvcm1CaXQuU0NBTEUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgVmVjMy5jb3B5KGNoaWxkLl9zY2FsZSwgY2hpbGQuX2xzY2FsZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIE5vZGVQb29sLnNldFZlYzMoY2hpbGQuX3Bvb2xIYW5kbGUsIE5vZGVWaWV3LldPUkxEX1NDQUxFLCBjaGlsZC5fc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBNYXQ0LmZyb21SVFMoY2hpbGQuX21hdCwgY2hpbGQuX3JvdCwgY2hpbGQuX3BvcywgY2hpbGQuX3NjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChkaXJ0eUJpdHMgIT09IFRyYW5zZm9ybUJpdC5OT05FKSB7XHJcbiAgICAgICAgICAgICAgICBOb2RlUG9vbC5zZXRNYXQ0KGNoaWxkLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9NQVRSSVgsIGNoaWxkLl9tYXQpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjaGlsZC5fZGlydHlGbGFncyA9IFRyYW5zZm9ybUJpdC5OT05FO1xyXG4gICAgICAgICAgICBjdXIgPSBjaGlsZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gdHJhbnNmb3JtXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHBvc2l0aW9uIGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtXHJcbiAgICAgKiBAemgg6K6+572u5pys5Zyw5Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gVGFyZ2V0IHBvc2l0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRQb3NpdGlvbiAocG9zaXRpb246IFZlYzMpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBwb3NpdGlvbiBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHpoIOiuvue9ruacrOWcsOWdkOagh1xyXG4gICAgICogQHBhcmFtIHggWCBheGlzIHBvc2l0aW9uXHJcbiAgICAgKiBAcGFyYW0geSBZIGF4aXMgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB6IFogYXhpcyBwb3NpdGlvblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0UG9zaXRpb24gKHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRQb3NpdGlvbiAodmFsOiBWZWMzIHwgbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCB8fCB6ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xwb3MsIHZhbCBhcyBWZWMzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBWZWMzLnNldCh0aGlzLl9scG9zLCB2YWwgYXMgbnVtYmVyLCB5LCB6KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKFRyYW5zZm9ybUJpdC5QT1NJVElPTik7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFRSQU5TRk9STV9PTikge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCBUcmFuc2Zvcm1CaXQuUE9TSVRJT04pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgcG9zaXRpb24gaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW0sIHBsZWFzZSB0cnkgdG8gcGFzcyBgb3V0YCB2ZWN0b3IgYW5kIHJldXNlIGl0IHRvIGF2b2lkIGdhcmJhZ2UuXHJcbiAgICAgKiBAemgg6I635Y+W5pys5Zyw5Z2Q5qCH77yM5rOo5oSP77yM5bC95Y+v6IO95Lyg6YCS5aSN55So55qEIFtbVmVjM11dIOS7pemBv+WFjeS6p+eUn+Weg+WcvuOAglxyXG4gICAgICogQHBhcmFtIG91dCBTZXQgdGhlIHJlc3VsdCB0byBvdXQgdmVjdG9yXHJcbiAgICAgKiBAcmV0dXJuIElmIGBvdXRgIGdpdmVuLCB0aGUgcmV0dXJuIHZhbHVlIGVxdWFscyB0byBgb3V0YCwgb3RoZXJ3aXNlIGEgbmV3IHZlY3RvciB3aWxsIGJlIGdlbmVyYXRlZCBhbmQgcmV0dXJuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbiAob3V0PzogVmVjMyk6IFZlYzMge1xyXG4gICAgICAgIGlmIChvdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFZlYzMuc2V0KG91dCwgdGhpcy5fbHBvcy54LCB0aGlzLl9scG9zLnksIHRoaXMuX2xwb3Mueik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFZlYzMuY29weShuZXcgVmVjMygpLCB0aGlzLl9scG9zKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHJvdGF0aW9uIGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIHdpdGggYSBxdWF0ZXJuaW9uIHJlcHJlc2VudGluZyB0aGUgcm90YXRpb25cclxuICAgICAqIEB6aCDnlKjlm5vlhYPmlbDorr7nva7mnKzlnLDml4vovaxcclxuICAgICAqIEBwYXJhbSByb3RhdGlvbiBSb3RhdGlvbiBpbiBxdWF0ZXJuaW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRSb3RhdGlvbiAocm90YXRpb246IFF1YXQpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCByb3RhdGlvbiBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbSB3aXRoIGEgcXVhdGVybmlvbiByZXByZXNlbnRpbmcgdGhlIHJvdGF0aW9uXHJcbiAgICAgKiBAemgg55So5Zub5YWD5pWw6K6+572u5pys5Zyw5peL6L2sXHJcbiAgICAgKiBAcGFyYW0geCBYIHZhbHVlIGluIHF1YXRlcm5pb25cclxuICAgICAqIEBwYXJhbSB5IFkgdmFsdWUgaW4gcXVhdGVybmlvblxyXG4gICAgICogQHBhcmFtIHogWiB2YWx1ZSBpbiBxdWF0ZXJuaW9uXHJcbiAgICAgKiBAcGFyYW0gdyBXIHZhbHVlIGluIHF1YXRlcm5pb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFJvdGF0aW9uICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRSb3RhdGlvbiAodmFsOiBRdWF0IHwgbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyLCB3PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCB8fCB6ID09PSB1bmRlZmluZWQgfHwgdyA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIFF1YXQuY29weSh0aGlzLl9scm90LCB2YWwgYXMgUXVhdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgUXVhdC5zZXQodGhpcy5fbHJvdCwgdmFsIGFzIG51bWJlciwgeSwgeiwgdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V1bGVyRGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmludmFsaWRhdGVDaGlsZHJlbihUcmFuc2Zvcm1CaXQuUk9UQVRJT04pO1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBUUkFOU0ZPUk1fT04pIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgVHJhbnNmb3JtQml0LlJPVEFUSU9OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHJvdGF0aW9uIGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIHdpdGggZXVsZXIgYW5nbGVzXHJcbiAgICAgKiBAemgg55So5qyn5ouJ6KeS6K6+572u5pys5Zyw5peL6L2sXHJcbiAgICAgKiBAcGFyYW0geCBYIGF4aXMgcm90YXRpb25cclxuICAgICAqIEBwYXJhbSB5IFkgYXhpcyByb3RhdGlvblxyXG4gICAgICogQHBhcmFtIHogWiBheGlzIHJvdGF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRSb3RhdGlvbkZyb21FdWxlciAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIFZlYzMuc2V0KHRoaXMuX2V1bGVyLCB4LCB5LCB6KTtcclxuICAgICAgICBRdWF0LmZyb21FdWxlcih0aGlzLl9scm90LCB4LCB5LCB6KTtcclxuICAgICAgICB0aGlzLl9ldWxlckRpcnR5ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKFRyYW5zZm9ybUJpdC5ST1RBVElPTik7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFRSQU5TRk9STV9PTikge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCBUcmFuc2Zvcm1CaXQuUk9UQVRJT04pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgcm90YXRpb24gYXMgcXVhdGVybmlvbiBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbSwgcGxlYXNlIHRyeSB0byBwYXNzIGBvdXRgIHF1YXRlcm5pb24gYW5kIHJldXNlIGl0IHRvIGF2b2lkIGdhcmJhZ2UuXHJcbiAgICAgKiBAemgg6I635Y+W5pys5Zyw5peL6L2s77yM5rOo5oSP77yM5bC95Y+v6IO95Lyg6YCS5aSN55So55qEIFtbUXVhdF1dIOS7pemBv+WFjeS6p+eUn+Weg+WcvuOAglxyXG4gICAgICogQHBhcmFtIG91dCBTZXQgdGhlIHJlc3VsdCB0byBvdXQgcXVhdGVybmlvblxyXG4gICAgICogQHJldHVybiBJZiBgb3V0YCBnaXZlbiwgdGhlIHJldHVybiB2YWx1ZSBlcXVhbHMgdG8gYG91dGAsIG90aGVyd2lzZSBhIG5ldyBxdWF0ZXJuaW9uIHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFJvdGF0aW9uIChvdXQ/OiBRdWF0KTogUXVhdCB7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUXVhdC5zZXQob3V0LCB0aGlzLl9scm90LngsIHRoaXMuX2xyb3QueSwgdGhpcy5fbHJvdC56LCB0aGlzLl9scm90LncpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBRdWF0LmNvcHkobmV3IFF1YXQoKSwgdGhpcy5fbHJvdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBzY2FsZSBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHpoIOiuvue9ruacrOWcsOe8qeaUvlxyXG4gICAgICogQHBhcmFtIHNjYWxlIFRhcmdldCBzY2FsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0U2NhbGUgKHNjYWxlOiBWZWMzKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgc2NhbGUgaW4gbG9jYWwgY29vcmRpbmF0ZSBzeXN0ZW1cclxuICAgICAqIEB6aCDorr7nva7mnKzlnLDnvKnmlL5cclxuICAgICAqIEBwYXJhbSB4IFggYXhpcyBzY2FsZVxyXG4gICAgICogQHBhcmFtIHkgWSBheGlzIHNjYWxlXHJcbiAgICAgKiBAcGFyYW0geiBaIGF4aXMgc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFNjYWxlICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgc2V0U2NhbGUgKHZhbDogVmVjMyB8IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh5ID09PSB1bmRlZmluZWQgfHwgeiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9sc2NhbGUsIHZhbCBhcyBWZWMzKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBWZWMzLnNldCh0aGlzLl9sc2NhbGUsIHZhbCBhcyBudW1iZXIsIHksIHopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnZhbGlkYXRlQ2hpbGRyZW4oVHJhbnNmb3JtQml0LlNDQUxFKTtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgVFJBTlNGT1JNX09OKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQsIFRyYW5zZm9ybUJpdC5TQ0FMRSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzY2FsZSBpbiBsb2NhbCBjb29yZGluYXRlIHN5c3RlbSwgcGxlYXNlIHRyeSB0byBwYXNzIGBvdXRgIHZlY3RvciBhbmQgcmV1c2UgaXQgdG8gYXZvaWQgZ2FyYmFnZS5cclxuICAgICAqIEB6aCDojrflj5bmnKzlnLDnvKnmlL7vvIzms6jmhI/vvIzlsL3lj6/og73kvKDpgJLlpI3nlKjnmoQgW1tWZWMzXV0g5Lul6YG/5YWN5Lqn55Sf5Z6D5Zy+44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IFNldCB0aGUgcmVzdWx0IHRvIG91dCB2ZWN0b3JcclxuICAgICAqIEByZXR1cm4gSWYgYG91dGAgZ2l2ZW4sIHRoZSByZXR1cm4gdmFsdWUgZXF1YWxzIHRvIGBvdXRgLCBvdGhlcndpc2UgYSBuZXcgdmVjdG9yIHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjYWxlIChvdXQ/OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVmVjMy5zZXQob3V0LCB0aGlzLl9sc2NhbGUueCwgdGhpcy5fbHNjYWxlLnksIHRoaXMuX2xzY2FsZS56KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gVmVjMy5jb3B5KG5ldyBWZWMzKCksIHRoaXMuX2xzY2FsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEludmVyc2VseSB0cmFuc2Zvcm0gYSBwb2ludCBmcm9tIHdvcmxkIGNvb3JkaW5hdGUgc3lzdGVtIHRvIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtLlxyXG4gICAgICogQHpoIOmAhuWQkeWPmOaNouS4gOS4quepuumXtOeCue+8jOS4gOiIrOeUqOS6juWwhuS4lueVjOWdkOagh+i9rOaNouWIsOacrOWcsOWdkOagh+ezu+S4reOAglxyXG4gICAgICogQHBhcmFtIG91dCBUaGUgcmVzdWx0IHBvaW50IGluIGxvY2FsIGNvb3JkaW5hdGUgc3lzdGVtIHdpbGwgYmUgc3RvcmVkIGluIHRoaXMgdmVjdG9yXHJcbiAgICAgKiBAcGFyYW0gcCBBIHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGUgc3lzdGVtXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbnZlcnNlVHJhbnNmb3JtUG9pbnQgKG91dDogVmVjMywgcDogVmVjMykge1xyXG4gICAgICAgIFZlYzMuY29weShvdXQsIHApO1xyXG4gICAgICAgIGxldCBjdXIgPSB0aGlzOyBsZXQgaSA9IDA7XHJcbiAgICAgICAgd2hpbGUgKGN1ci5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgIGFycmF5X2FbaSsrXSA9IGN1cjtcclxuICAgICAgICAgICAgY3VyID0gY3VyLl9wYXJlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdoaWxlIChpID49IDApIHtcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1JbnZlcnNlUlRTKG91dCwgb3V0LCBjdXIuX2xyb3QsIGN1ci5fbHBvcywgY3VyLl9sc2NhbGUpO1xyXG4gICAgICAgICAgICBjdXIgPSBhcnJheV9hWy0taV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGUgc3lzdGVtXHJcbiAgICAgKiBAemgg6K6+572u5LiW55WM5Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0gcG9zaXRpb24gVGFyZ2V0IHBvc2l0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRXb3JsZFBvc2l0aW9uIChwb3NpdGlvbjogVmVjMyk6IHZvaWQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHBvc2l0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGUgc3lzdGVtXHJcbiAgICAgKiBAemgg6K6+572u5LiW55WM5Z2Q5qCHXHJcbiAgICAgKiBAcGFyYW0geCBYIGF4aXMgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSB5IFkgYXhpcyBwb3NpdGlvblxyXG4gICAgICogQHBhcmFtIHogWiBheGlzIHBvc2l0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRXb3JsZFBvc2l0aW9uICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgc2V0V29ybGRQb3NpdGlvbiAodmFsOiBWZWMzIHwgbnVtYmVyLCB5PzogbnVtYmVyLCB6PzogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHkgPT09IHVuZGVmaW5lZCB8fCB6ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX3BvcywgdmFsIGFzIFZlYzMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRoaXMuX3BvcywgdmFsIGFzIG51bWJlciwgeSwgeik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE5vZGVQb29sLnNldFZlYzModGhpcy5fcG9vbEhhbmRsZSwgTm9kZVZpZXcuV09STERfUE9TSVRJT04sIHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgY29uc3QgcGFyZW50ID0gdGhpcy5fcGFyZW50O1xyXG4gICAgICAgIGNvbnN0IGxvY2FsID0gdGhpcy5fbHBvcztcclxuICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIC8vIFRPRE86IGJlbmNobWFyayB0aGVzZSBhcHByb2FjaGVzXHJcbiAgICAgICAgICAgIC8qICovXHJcbiAgICAgICAgICAgIHBhcmVudC51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQobG9jYWwsIHRoaXMuX3BvcywgTWF0NC5pbnZlcnQobTRfMSwgcGFyZW50Ll9tYXQpKTtcclxuICAgICAgICAgICAgLyogKlxyXG4gICAgICAgICAgICBwYXJlbnQuaW52ZXJzZVRyYW5zZm9ybVBvaW50KGxvY2FsLCB0aGlzLl9wb3MpO1xyXG4gICAgICAgICAgICAvKiAqL1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuY29weShsb2NhbCwgdGhpcy5fcG9zKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKFRyYW5zZm9ybUJpdC5QT1NJVElPTik7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFRSQU5TRk9STV9PTikge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCBUcmFuc2Zvcm1CaXQuUE9TSVRJT04pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgcG9zaXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW0sIHBsZWFzZSB0cnkgdG8gcGFzcyBgb3V0YCB2ZWN0b3IgYW5kIHJldXNlIGl0IHRvIGF2b2lkIGdhcmJhZ2UuXHJcbiAgICAgKiBAemgg6I635Y+W5LiW55WM5Z2Q5qCH77yM5rOo5oSP77yM5bC95Y+v6IO95Lyg6YCS5aSN55So55qEIFtbVmVjM11dIOS7pemBv+WFjeS6p+eUn+Weg+WcvuOAglxyXG4gICAgICogQHBhcmFtIG91dCBTZXQgdGhlIHJlc3VsdCB0byBvdXQgdmVjdG9yXHJcbiAgICAgKiBAcmV0dXJuIElmIGBvdXRgIGdpdmVuLCB0aGUgcmV0dXJuIHZhbHVlIGVxdWFscyB0byBgb3V0YCwgb3RoZXJ3aXNlIGEgbmV3IHZlY3RvciB3aWxsIGJlIGdlbmVyYXRlZCBhbmQgcmV0dXJuXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRXb3JsZFBvc2l0aW9uIChvdXQ/OiBWZWMzKTogVmVjMyB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIGlmIChvdXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFZlYzMuY29weShvdXQsIHRoaXMuX3Bvcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIFZlYzMuY29weShuZXcgVmVjMygpLCB0aGlzLl9wb3MpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgcm90YXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW0gd2l0aCBhIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvblxyXG4gICAgICogQHpoIOeUqOWbm+WFg+aVsOiuvue9ruS4lueVjOWdkOagh+ezu+S4i+eahOaXi+i9rFxyXG4gICAgICogQHBhcmFtIHJvdGF0aW9uIFJvdGF0aW9uIGluIHF1YXRlcm5pb25cclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFdvcmxkUm90YXRpb24gKHJvdGF0aW9uOiBRdWF0KTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgcm90YXRpb24gaW4gd29ybGQgY29vcmRpbmF0ZSBzeXN0ZW0gd2l0aCBhIHF1YXRlcm5pb24gcmVwcmVzZW50aW5nIHRoZSByb3RhdGlvblxyXG4gICAgICogQHpoIOeUqOWbm+WFg+aVsOiuvue9ruS4lueVjOWdkOagh+ezu+S4i+eahOaXi+i9rFxyXG4gICAgICogQHBhcmFtIHggWCB2YWx1ZSBpbiBxdWF0ZXJuaW9uXHJcbiAgICAgKiBAcGFyYW0geSBZIHZhbHVlIGluIHF1YXRlcm5pb25cclxuICAgICAqIEBwYXJhbSB6IFogdmFsdWUgaW4gcXVhdGVybmlvblxyXG4gICAgICogQHBhcmFtIHcgVyB2YWx1ZSBpbiBxdWF0ZXJuaW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRXb3JsZFJvdGF0aW9uICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyLCB3OiBudW1iZXIpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBzZXRXb3JsZFJvdGF0aW9uICh2YWw6IFF1YXQgfCBudW1iZXIsIHk/OiBudW1iZXIsIHo/OiBudW1iZXIsIHc/OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoeSA9PT0gdW5kZWZpbmVkIHx8IHogPT09IHVuZGVmaW5lZCB8fCB3ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgUXVhdC5jb3B5KHRoaXMuX3JvdCwgdmFsIGFzIFF1YXQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFF1YXQuc2V0KHRoaXMuX3JvdCwgdmFsIGFzIG51bWJlciwgeSwgeiwgdyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIE5vZGVQb29sLnNldFZlYzQodGhpcy5fcG9vbEhhbmRsZSwgTm9kZVZpZXcuV09STERfUk9UQVRJT04sIHRoaXMuX3JvdCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcmVudCkge1xyXG4gICAgICAgICAgICB0aGlzLl9wYXJlbnQudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgUXVhdC5tdWx0aXBseSh0aGlzLl9scm90LCBRdWF0LmNvbmp1Z2F0ZSh0aGlzLl9scm90LCB0aGlzLl9wYXJlbnQuX3JvdCksIHRoaXMuX3JvdCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgUXVhdC5jb3B5KHRoaXMuX2xyb3QsIHRoaXMuX3JvdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2V1bGVyRGlydHkgPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLmludmFsaWRhdGVDaGlsZHJlbihUcmFuc2Zvcm1CaXQuUk9UQVRJT04pO1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudE1hc2sgJiBUUkFOU0ZPUk1fT04pIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgVHJhbnNmb3JtQml0LlJPVEFUSU9OKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IHJvdGF0aW9uIGluIHdvcmxkIGNvb3JkaW5hdGUgc3lzdGVtIHdpdGggZXVsZXIgYW5nbGVzXHJcbiAgICAgKiBAemgg55So5qyn5ouJ6KeS6K6+572u5LiW55WM5Z2Q5qCH57O75LiL55qE5peL6L2sXHJcbiAgICAgKiBAcGFyYW0geCBYIGF4aXMgcm90YXRpb25cclxuICAgICAqIEBwYXJhbSB5IFkgYXhpcyByb3RhdGlvblxyXG4gICAgICogQHBhcmFtIHogWiBheGlzIHJvdGF0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRXb3JsZFJvdGF0aW9uRnJvbUV1bGVyICh4OiBudW1iZXIsIHk6IG51bWJlciwgejogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgUXVhdC5mcm9tRXVsZXIodGhpcy5fcm90LCB4LCB5LCB6KTtcclxuICAgICAgICBpZiAodGhpcy5fcGFyZW50KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBRdWF0Lm11bHRpcGx5KHRoaXMuX2xyb3QsIFF1YXQuY29uanVnYXRlKHRoaXMuX2xyb3QsIHRoaXMuX3BhcmVudC5fcm90KSwgdGhpcy5fcm90KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBRdWF0LmNvcHkodGhpcy5fbHJvdCwgdGhpcy5fcm90KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXVsZXJEaXJ0eSA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKFRyYW5zZm9ybUJpdC5ST1RBVElPTik7XHJcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFRSQU5TRk9STV9PTikge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoU3lzdGVtRXZlbnRUeXBlLlRSQU5TRk9STV9DSEFOR0VELCBUcmFuc2Zvcm1CaXQuUk9UQVRJT04pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgcm90YXRpb24gYXMgcXVhdGVybmlvbiBpbiB3b3JsZCBjb29yZGluYXRlIHN5c3RlbSwgcGxlYXNlIHRyeSB0byBwYXNzIGBvdXRgIHF1YXRlcm5pb24gYW5kIHJldXNlIGl0IHRvIGF2b2lkIGdhcmJhZ2UuXHJcbiAgICAgKiBAemgg6I635Y+W5LiW55WM5Z2Q5qCH57O75LiL55qE5peL6L2s77yM5rOo5oSP77yM5bC95Y+v6IO95Lyg6YCS5aSN55So55qEIFtbUXVhdF1dIOS7pemBv+WFjeS6p+eUn+Weg+WcvuOAglxyXG4gICAgICogQHBhcmFtIG91dCBTZXQgdGhlIHJlc3VsdCB0byBvdXQgcXVhdGVybmlvblxyXG4gICAgICogQHJldHVybiBJZiBgb3V0YCBnaXZlbiwgdGhlIHJldHVybiB2YWx1ZSBlcXVhbHMgdG8gYG91dGAsIG90aGVyd2lzZSBhIG5ldyBxdWF0ZXJuaW9uIHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkUm90YXRpb24gKG91dD86IFF1YXQpOiBRdWF0IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUXVhdC5jb3B5KG91dCwgdGhpcy5fcm90KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gUXVhdC5jb3B5KG5ldyBRdWF0KCksIHRoaXMuX3JvdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBzY2FsZSBpbiB3b3JsZCBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHpoIOiuvue9ruS4lueVjOWdkOagh+ezu+S4i+eahOe8qeaUvlxyXG4gICAgICogQHBhcmFtIHNjYWxlIFRhcmdldCBzY2FsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0V29ybGRTY2FsZSAoc2NhbGU6IFZlYzMpOiB2b2lkO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNldCBzY2FsZSBpbiB3b3JsZCBjb29yZGluYXRlIHN5c3RlbVxyXG4gICAgICogQHpoIOiuvue9ruS4lueVjOWdkOagh+ezu+S4i+eahOe8qeaUvlxyXG4gICAgICogQHBhcmFtIHggWCBheGlzIHNjYWxlXHJcbiAgICAgKiBAcGFyYW0geSBZIGF4aXMgc2NhbGVcclxuICAgICAqIEBwYXJhbSB6IFogYXhpcyBzY2FsZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0V29ybGRTY2FsZSAoeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcik6IHZvaWQ7XHJcblxyXG4gICAgcHVibGljIHNldFdvcmxkU2NhbGUgKHZhbDogVmVjMyB8IG51bWJlciwgeT86IG51bWJlciwgej86IG51bWJlcikge1xyXG4gICAgICAgIGlmICh5ID09PSB1bmRlZmluZWQgfHwgeiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9zY2FsZSwgdmFsIGFzIFZlYzMpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRoaXMuX3NjYWxlLCB2YWwgYXMgbnVtYmVyLCB5LCB6KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgTm9kZVBvb2wuc2V0VmVjMyh0aGlzLl9wb29sSGFuZGxlLCBOb2RlVmlldy5XT1JMRF9TQ0FMRSwgdGhpcy5fc2NhbGUpO1xyXG4gICAgICAgIGNvbnN0IHBhcmVudCA9IHRoaXMuX3BhcmVudDtcclxuICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgIHBhcmVudC51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICBNYXQzLmZyb21RdWF0KG0zXzEsIFF1YXQuY29uanVnYXRlKHF0XzEsIHBhcmVudC5fcm90KSk7XHJcbiAgICAgICAgICAgIE1hdDMubXVsdGlwbHlNYXQ0KG0zXzEsIG0zXzEsIHBhcmVudC5fbWF0KTtcclxuICAgICAgICAgICAgbTNfc2NhbGluZy5tMDAgPSB0aGlzLl9zY2FsZS54O1xyXG4gICAgICAgICAgICBtM19zY2FsaW5nLm0wNCA9IHRoaXMuX3NjYWxlLnk7XHJcbiAgICAgICAgICAgIG0zX3NjYWxpbmcubTA4ID0gdGhpcy5fc2NhbGUuejtcclxuICAgICAgICAgICAgTWF0My5tdWx0aXBseShtM18xLCBtM19zY2FsaW5nLCBNYXQzLmludmVydChtM18xLCBtM18xKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xzY2FsZS54ID0gVmVjMy5zZXQodjNfYSwgbTNfMS5tMDAsIG0zXzEubTAxLCBtM18xLm0wMikubGVuZ3RoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xzY2FsZS55ID0gVmVjMy5zZXQodjNfYSwgbTNfMS5tMDMsIG0zXzEubTA0LCBtM18xLm0wNSkubGVuZ3RoKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xzY2FsZS56ID0gVmVjMy5zZXQodjNfYSwgbTNfMS5tMDYsIG0zXzEubTA3LCBtM18xLm0wOCkubGVuZ3RoKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVmVjMy5jb3B5KHRoaXMuX2xzY2FsZSwgdGhpcy5fc2NhbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbnZhbGlkYXRlQ2hpbGRyZW4oVHJhbnNmb3JtQml0LlNDQUxFKTtcclxuICAgICAgICBpZiAodGhpcy5fZXZlbnRNYXNrICYgVFJBTlNGT1JNX09OKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChTeXN0ZW1FdmVudFR5cGUuVFJBTlNGT1JNX0NIQU5HRUQsIFRyYW5zZm9ybUJpdC5TQ0FMRSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzY2FsZSBpbiB3b3JsZCBjb29yZGluYXRlIHN5c3RlbSwgcGxlYXNlIHRyeSB0byBwYXNzIGBvdXRgIHZlY3RvciBhbmQgcmV1c2UgaXQgdG8gYXZvaWQgZ2FyYmFnZS5cclxuICAgICAqIEB6aCDojrflj5bkuJbnlYznvKnmlL7vvIzms6jmhI/vvIzlsL3lj6/og73kvKDpgJLlpI3nlKjnmoQgW1tWZWMzXV0g5Lul6YG/5YWN5Lqn55Sf5Z6D5Zy+44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IFNldCB0aGUgcmVzdWx0IHRvIG91dCB2ZWN0b3JcclxuICAgICAqIEByZXR1cm4gSWYgYG91dGAgZ2l2ZW4sIHRoZSByZXR1cm4gdmFsdWUgZXF1YWxzIHRvIGBvdXRgLCBvdGhlcndpc2UgYSBuZXcgdmVjdG9yIHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkU2NhbGUgKG91dD86IFZlYzMpOiBWZWMzIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgaWYgKG91dCkge1xyXG4gICAgICAgICAgICByZXR1cm4gVmVjMy5jb3B5KG91dCwgdGhpcy5fc2NhbGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBWZWMzLmNvcHkobmV3IFZlYzMoKSwgdGhpcy5fc2NhbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgYSB3b3JsZCB0cmFuc2Zvcm0gbWF0cml4XHJcbiAgICAgKiBAemgg6I635Y+W5LiW55WM5Y+Y5o2i55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gb3V0IFNldCB0aGUgcmVzdWx0IHRvIG91dCBtYXRyaXhcclxuICAgICAqIEByZXR1cm4gSWYgYG91dGAgZ2l2ZW4sIHRoZSByZXR1cm4gdmFsdWUgZXF1YWxzIHRvIGBvdXRgLCBvdGhlcndpc2UgYSBuZXcgbWF0cml4IHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkTWF0cml4IChvdXQ/OiBNYXQ0KTogTWF0NCB7XHJcbiAgICAgICAgdGhpcy51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgIGlmICghb3V0KSB7IG91dCA9IG5ldyBNYXQ0KCk7IH1cclxuICAgICAgICByZXR1cm4gTWF0NC5jb3B5KG91dCwgdGhpcy5fbWF0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBHZXQgYSB3b3JsZCB0cmFuc2Zvcm0gbWF0cml4IHdpdGggb25seSByb3RhdGlvbiBhbmQgc2NhbGVcclxuICAgICAqIEB6aCDojrflj5blj6rljIXlkKvml4vovazlkoznvKnmlL7nmoTkuJbnlYzlj5jmjaLnn6npmLVcclxuICAgICAqIEBwYXJhbSBvdXQgU2V0IHRoZSByZXN1bHQgdG8gb3V0IG1hdHJpeFxyXG4gICAgICogQHJldHVybiBJZiBgb3V0YCBnaXZlbiwgdGhlIHJldHVybiB2YWx1ZSBlcXVhbHMgdG8gYG91dGAsIG90aGVyd2lzZSBhIG5ldyBtYXRyaXggd2lsbCBiZSBnZW5lcmF0ZWQgYW5kIHJldHVyblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0V29ybGRSUyAob3V0PzogTWF0NCk6IE1hdDQge1xyXG4gICAgICAgIHRoaXMudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICBpZiAoIW91dCkgeyBvdXQgPSBuZXcgTWF0NCgpOyB9XHJcbiAgICAgICAgTWF0NC5jb3B5KG91dCwgdGhpcy5fbWF0KTtcclxuICAgICAgICBvdXQubTEyID0gMDsgb3V0Lm0xMyA9IDA7IG91dC5tMTQgPSAwO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IGEgd29ybGQgdHJhbnNmb3JtIG1hdHJpeCB3aXRoIG9ubHkgcm90YXRpb24gYW5kIHRyYW5zbGF0aW9uXHJcbiAgICAgKiBAemgg6I635Y+W5Y+q5YyF5ZCr5peL6L2s5ZKM5L2N56e755qE5LiW55WM5Y+Y5o2i55+p6Zi1XHJcbiAgICAgKiBAcGFyYW0gb3V0IFNldCB0aGUgcmVzdWx0IHRvIG91dCBtYXRyaXhcclxuICAgICAqIEByZXR1cm4gSWYgYG91dGAgZ2l2ZW4sIHRoZSByZXR1cm4gdmFsdWUgZXF1YWxzIHRvIGBvdXRgLCBvdGhlcndpc2UgYSBuZXcgbWF0cml4IHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdvcmxkUlQgKG91dD86IE1hdDQpOiBNYXQ0IHtcclxuICAgICAgICB0aGlzLnVwZGF0ZVdvcmxkVHJhbnNmb3JtKCk7XHJcbiAgICAgICAgaWYgKCFvdXQpIHsgb3V0ID0gbmV3IE1hdDQoKTsgfVxyXG4gICAgICAgIHJldHVybiBNYXQ0LmZyb21SVChvdXQsIHRoaXMuX3JvdCwgdGhpcy5fcG9zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXQgbG9jYWwgdHJhbnNmb3JtYXRpb24gd2l0aCByb3RhdGlvbiwgcG9zaXRpb24gYW5kIHNjYWxlIHNlcGFyYXRlbHkuXHJcbiAgICAgKiBAemgg5LiA5qyh5oCn6K6+572u5omA5pyJ5bGA6YOo5Y+Y5o2i77yI5bmz56e744CB5peL6L2s44CB57yp5pS+77yJ5L+h5oGvXHJcbiAgICAgKiBAcGFyYW0gcm90IFRoZSByb3RhdGlvblxyXG4gICAgICogQHBhcmFtIHBvcyBUaGUgcG9zaXRpb25cclxuICAgICAqIEBwYXJhbSBzY2FsZSBUaGUgc2NhbGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldFJUUyAocm90PzogUXVhdCB8IFZlYzMsIHBvcz86IFZlYzMsIHNjYWxlPzogVmVjMykge1xyXG4gICAgICAgIGxldCBkaXJ0eUJpdDogVHJhbnNmb3JtQml0ID0gMDtcclxuICAgICAgICBpZiAocm90KSB7XHJcbiAgICAgICAgICAgIGRpcnR5Qml0IHw9IFRyYW5zZm9ybUJpdC5ST1RBVElPTjtcclxuICAgICAgICAgICAgaWYgKChyb3QgYXMgUXVhdCkudyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBRdWF0LmNvcHkodGhpcy5fbHJvdCwgcm90IGFzIFF1YXQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZXVsZXJEaXJ0eSA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBWZWMzLmNvcHkodGhpcy5fZXVsZXIsIHJvdCk7XHJcbiAgICAgICAgICAgICAgICBRdWF0LmZyb21FdWxlcih0aGlzLl9scm90LCByb3QueCwgcm90LnksIHJvdC56KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2V1bGVyRGlydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocG9zKSB7XHJcbiAgICAgICAgICAgIFZlYzMuY29weSh0aGlzLl9scG9zLCBwb3MpO1xyXG4gICAgICAgICAgICBkaXJ0eUJpdCB8PSBUcmFuc2Zvcm1CaXQuUE9TSVRJT047XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzY2FsZSkge1xyXG4gICAgICAgICAgICBWZWMzLmNvcHkodGhpcy5fbHNjYWxlLCBzY2FsZSk7XHJcbiAgICAgICAgICAgIGRpcnR5Qml0IHw9IFRyYW5zZm9ybUJpdC5TQ0FMRTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGRpcnR5Qml0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaW52YWxpZGF0ZUNoaWxkcmVuKGRpcnR5Qml0KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2V2ZW50TWFzayAmIFRSQU5TRk9STV9PTikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0KFN5c3RlbUV2ZW50VHlwZS5UUkFOU0ZPUk1fQ0hBTkdFRCwgZGlydHlCaXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQYXVzZSBhbGwgc3lzdGVtIGV2ZW50cyB3aGljaCBpcyBkaXNwYXRjaGVkIGJ5IFtbU3lzdGVtRXZlbnRdXS5cclxuICAgICAqIElmIHJlY3Vyc2l2ZSBpcyBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGlzIEFQSSB3aWxsIHBhdXNlIHRoZSBub2RlIHN5c3RlbSBldmVudHMgZm9yIHRoZSBub2RlIGFuZCBhbGwgbm9kZXMgaW4gaXRzIHN1YiBub2RlIHRyZWUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaaguWBnOaJgOaciSBbW1N5c3RlbUV2ZW50XV0g5rS+5Y+R55qE57O757uf5LqL5Lu244CCXHJcbiAgICAgKiDlpoLmnpzkvKDpgJIgcmVjdXJzaXZlIOS4uiB0cnVl77yM6YKj5LmI6L+Z5LiqIEFQSSDlsIbmmoLlgZzmnKzoioLngrnlkozlroPnmoTlrZDmoJHkuIrmiYDmnInoioLngrnnmoToioLngrnns7vnu5/kuovku7bjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcmVjdXJzaXZlIFdoZXRoZXIgcGF1c2Ugc3lzdGVtIGV2ZW50cyByZWN1cnNpdmVseSBmb3IgdGhlIGNoaWxkIG5vZGUgdHJlZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF1c2VTeXN0ZW1FdmVudHMgKHJlY3Vyc2l2ZTogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBldmVudE1hbmFnZXIucGF1c2VUYXJnZXQodGhpcywgcmVjdXJzaXZlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVzdW1lIGFsbCBwYXVzZWQgc3lzdGVtIGV2ZW50cyB3aGljaCBpcyBkaXNwYXRjaGVkIGJ5IFtbU3lzdGVtRXZlbnRdXS5cclxuICAgICAqIElmIHJlY3Vyc2l2ZSBpcyBzZXQgdG8gdHJ1ZSwgdGhlbiB0aGlzIEFQSSB3aWxsIHJlc3VtZSB0aGUgbm9kZSBzeXN0ZW0gZXZlbnRzIGZvciB0aGUgbm9kZSBhbmQgYWxsIG5vZGVzIGluIGl0cyBzdWIgbm9kZSB0cmVlLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5oGi5aSN5omA5pyJIFtbU3lzdGVtRXZlbnRdXSDmtL7lj5HnmoTns7vnu5/kuovku7bjgIJcclxuICAgICAqIOWmguaenOS8oOmAkiByZWN1cnNpdmUg5Li6IHRydWXvvIzpgqPkuYjov5nkuKogQVBJIOWwhuaBouWkjeacrOiKgueCueWSjOWug+eahOWtkOagkeS4iuaJgOacieiKgueCueeahOiKgueCueezu+e7n+S6i+S7tuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByZWN1cnNpdmUgV2hldGhlciByZXN1bWUgc3lzdGVtIGV2ZW50cyByZWN1cnNpdmVseSBmb3IgdGhlIGNoaWxkIG5vZGUgdHJlZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdW1lU3lzdGVtRXZlbnRzIChyZWN1cnNpdmU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgZXZlbnRNYW5hZ2VyLnJlc3VtZVRhcmdldCh0aGlzLCByZWN1cnNpdmUpO1xyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5Ob2RlID0gTm9kZTtcclxuIl19