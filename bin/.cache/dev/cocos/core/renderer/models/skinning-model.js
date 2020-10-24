(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../../gfx/buffer.js", "../../gfx/define.js", "../../math/index.js", "../../pipeline/define.js", "../scene/model.js", "./skeletal-animation-utils.js", "./morph-model.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../../gfx/buffer.js"), require("../../gfx/define.js"), require("../../math/index.js"), require("../../pipeline/define.js"), require("../scene/model.js"), require("./skeletal-animation-utils.js"), require("./morph-model.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.buffer, global.define, global.index, global.define, global.model, global.skeletalAnimationUtils, global.morphModel);
    global.skinningModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _buffer, _define, _index2, _define2, _model, _skeletalAnimationUtils, _morphModel) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.getWorldMatrix = getWorldMatrix;
  _exports.getTransform = getTransform;
  _exports.deleteTransform = deleteTransform;
  _exports.SkinningModel = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var stack = [];
  var pool = new Map();
  var myPatches = [{
    name: 'CC_USE_SKINNING',
    value: true
  }];

  function getWorldMatrix(transform, stamp) {
    var i = 0;
    var res = _index2.Mat4.IDENTITY;

    while (transform) {
      if (transform.stamp === stamp || transform.stamp + 1 === stamp && !transform.node.hasChangedFlags) {
        res = transform.world;
        transform.stamp = stamp;
        break;
      }

      transform.stamp = stamp;
      stack[i++] = transform;
      transform = transform.parent;
    }

    while (i > 0) {
      transform = stack[--i];
      var node = transform.node;

      _index2.Mat4.fromRTS(transform.local, node.rotation, node.position, node.scale);

      res = _index2.Mat4.multiply(transform.world, res, transform.local);
    }

    return res;
  }

  function getTransform(node, root) {
    var joint = null;
    var i = 0;

    while (node !== root) {
      var id = node.uuid;

      if (pool.has(id)) {
        joint = pool.get(id);
        break;
      } else {
        // TODO: object reuse
        joint = {
          node: node,
          local: new _index2.Mat4(),
          world: new _index2.Mat4(),
          stamp: -1,
          parent: null
        };
        pool.set(id, joint);
      }

      stack[i++] = joint;
      node = node.parent;
      joint = null;
    }

    var child;

    while (i > 0) {
      child = stack[--i];
      child.parent = joint;
      joint = child;
    }

    return joint;
  }

  function deleteTransform(node) {
    var transform = pool.get(node.uuid) || null;

    while (transform) {
      pool["delete"](transform.node.uuid);
      transform = transform.parent;
    }
  }

  function getRelevantBuffers(outIndices, outBuffers, jointMaps, targetJoint) {
    for (var i = 0; i < jointMaps.length; i++) {
      var idxMap = jointMaps[i];
      var index = -1;

      for (var j = 0; j < idxMap.length; j++) {
        if (idxMap[j] === targetJoint) {
          index = j;
          break;
        }
      }

      if (index >= 0) {
        outBuffers.push(i);
        outIndices.push(index);
      }
    }
  }

  var v3_min = new _index2.Vec3();
  var v3_max = new _index2.Vec3();
  var v3_1 = new _index2.Vec3();
  var v3_2 = new _index2.Vec3();
  var m4_1 = new _index2.Mat4();
  var ab_1 = new _index.aabb();
  /**
   * @en
   * The skinning model that is using real-time pose calculation.
   * @zh
   * 实时计算动画的蒙皮模型。
   */

  var SkinningModel = /*#__PURE__*/function (_MorphModel) {
    _inherits(SkinningModel, _MorphModel);

    function SkinningModel() {
      var _this;

      _classCallCheck(this, SkinningModel);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SkinningModel).call(this));
      _this.uploadAnimation = null;
      _this._buffers = [];
      _this._dataArray = [];
      _this._joints = [];
      _this._bufferIndices = null;
      _this.type = _model.ModelType.SKINNING;
      return _this;
    }

    _createClass(SkinningModel, [{
      key: "destroy",
      value: function destroy() {
        this.bindSkeleton();

        if (this._buffers.length) {
          for (var i = 0; i < this._buffers.length; i++) {
            this._buffers[i].destroy();
          }

          this._buffers.length = 0;
        }

        _get(_getPrototypeOf(SkinningModel.prototype), "destroy", this).call(this);
      }
    }, {
      key: "bindSkeleton",
      value: function bindSkeleton() {
        var skeleton = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var skinningRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var mesh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

        for (var i = 0; i < this._joints.length; i++) {
          deleteTransform(this._joints[i].target);
        }

        this._bufferIndices = null;
        this._joints.length = 0;

        if (!skeleton || !skinningRoot || !mesh) {
          return;
        }

        this.transform = skinningRoot;
        var boneSpaceBounds = mesh.getBoneSpaceBounds(skeleton);
        var jointMaps = mesh.struct.jointMaps;

        this._ensureEnoughBuffers(jointMaps && jointMaps.length || 1);

        this._bufferIndices = mesh.jointBufferIndices;

        for (var index = 0; index < skeleton.joints.length; index++) {
          var bound = boneSpaceBounds[index];
          var target = skinningRoot.getChildByPath(skeleton.joints[index]);

          if (!bound || !target) {
            continue;
          }

          var transform = getTransform(target, skinningRoot);
          var bindpose = skeleton.bindposes[index];
          var indices = [];
          var buffers = [];

          if (!jointMaps) {
            indices.push(index);
            buffers.push(0);
          } else {
            getRelevantBuffers(indices, buffers, jointMaps, index);
          }

          this._joints.push({
            indices: indices,
            buffers: buffers,
            bound: bound,
            target: target,
            bindpose: bindpose,
            transform: transform
          });
        }
      }
    }, {
      key: "updateTransform",
      value: function updateTransform(stamp) {
        var root = this.transform; // @ts-ignore TS2445

        if (root.hasChangedFlags || root._dirtyFlags) {
          root.updateWorldTransform();
          this._transformUpdated = true;
        } // update bounds


        _index2.Vec3.set(v3_min, Infinity, Infinity, Infinity);

        _index2.Vec3.set(v3_max, -Infinity, -Infinity, -Infinity);

        for (var i = 0; i < this._joints.length; i++) {
          var _this$_joints$i = this._joints[i],
              bound = _this$_joints$i.bound,
              transform = _this$_joints$i.transform;
          var worldMatrix = getWorldMatrix(transform, stamp);

          _index.aabb.transform(ab_1, bound, worldMatrix);

          ab_1.getBoundary(v3_1, v3_2);

          _index2.Vec3.min(v3_min, v3_min, v3_1);

          _index2.Vec3.max(v3_max, v3_max, v3_2);
        }

        if (this._modelBounds && this._worldBounds) {
          _index.aabb.fromPoints(this._modelBounds, v3_min, v3_max); // @ts-ignore TS2445


          this._modelBounds.transform(root._mat, root._pos, root._rot, root._scale, this._worldBounds);
        }
      }
    }, {
      key: "updateUBOs",
      value: function updateUBOs(stamp) {
        _get(_getPrototypeOf(SkinningModel.prototype), "updateUBOs", this).call(this, stamp);

        for (var i = 0; i < this._joints.length; i++) {
          var _this$_joints$i2 = this._joints[i],
              indices = _this$_joints$i2.indices,
              buffers = _this$_joints$i2.buffers,
              transform = _this$_joints$i2.transform,
              bindpose = _this$_joints$i2.bindpose;

          _index2.Mat4.multiply(m4_1, transform.world, bindpose);

          for (var b = 0; b < buffers.length; b++) {
            (0, _skeletalAnimationUtils.uploadJointData)(this._dataArray[buffers[b]], indices[b] * 12, m4_1, i === 0);
          }
        }

        for (var _b = 0; _b < this._buffers.length; _b++) {
          this._buffers[_b].update(this._dataArray[_b]);
        }

        return true;
      }
    }, {
      key: "initSubModel",
      value: function initSubModel(idx, subMeshData, mat) {
        var original = subMeshData.vertexBuffers;
        var iaInfo = subMeshData.iaInfo;
        iaInfo.vertexBuffers = subMeshData.jointMappedBuffers;

        _get(_getPrototypeOf(SkinningModel.prototype), "initSubModel", this).call(this, idx, subMeshData, mat);

        iaInfo.vertexBuffers = original;
      }
    }, {
      key: "getMacroPatches",
      value: function getMacroPatches(subModelIndex) {
        var superMacroPatches = _get(_getPrototypeOf(SkinningModel.prototype), "getMacroPatches", this).call(this, subModelIndex);

        if (superMacroPatches) {
          return myPatches.concat(superMacroPatches);
        } else {
          return myPatches;
        }
      }
    }, {
      key: "_updateLocalDescriptors",
      value: function _updateLocalDescriptors(submodelIdx, descriptorSet) {
        _get(_getPrototypeOf(SkinningModel.prototype), "_updateLocalDescriptors", this).call(this, submodelIdx, descriptorSet);

        var buffer = this._buffers[this._bufferIndices[submodelIdx]];

        if (buffer) {
          descriptorSet.bindBuffer(_define2.UBOSkinning.BINDING, buffer);
        }
      }
    }, {
      key: "_ensureEnoughBuffers",
      value: function _ensureEnoughBuffers(count) {
        for (var i = 0; i < count; i++) {
          if (!this._buffers[i]) {
            this._buffers[i] = this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.UNIFORM | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _define2.UBOSkinning.SIZE, _define2.UBOSkinning.SIZE));
          }

          if (!this._dataArray[i]) {
            this._dataArray[i] = new Float32Array(_define2.UBOSkinning.COUNT);
          }
        }
      }
    }]);

    return SkinningModel;
  }(_morphModel.MorphModel);

  _exports.SkinningModel = SkinningModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvbW9kZWxzL3NraW5uaW5nLW1vZGVsLnRzIl0sIm5hbWVzIjpbInN0YWNrIiwicG9vbCIsIk1hcCIsIm15UGF0Y2hlcyIsIm5hbWUiLCJ2YWx1ZSIsImdldFdvcmxkTWF0cml4IiwidHJhbnNmb3JtIiwic3RhbXAiLCJpIiwicmVzIiwiTWF0NCIsIklERU5USVRZIiwibm9kZSIsImhhc0NoYW5nZWRGbGFncyIsIndvcmxkIiwicGFyZW50IiwiZnJvbVJUUyIsImxvY2FsIiwicm90YXRpb24iLCJwb3NpdGlvbiIsInNjYWxlIiwibXVsdGlwbHkiLCJnZXRUcmFuc2Zvcm0iLCJyb290Iiwiam9pbnQiLCJpZCIsInV1aWQiLCJoYXMiLCJnZXQiLCJzZXQiLCJjaGlsZCIsImRlbGV0ZVRyYW5zZm9ybSIsImdldFJlbGV2YW50QnVmZmVycyIsIm91dEluZGljZXMiLCJvdXRCdWZmZXJzIiwiam9pbnRNYXBzIiwidGFyZ2V0Sm9pbnQiLCJsZW5ndGgiLCJpZHhNYXAiLCJpbmRleCIsImoiLCJwdXNoIiwidjNfbWluIiwiVmVjMyIsInYzX21heCIsInYzXzEiLCJ2M18yIiwibTRfMSIsImFiXzEiLCJhYWJiIiwiU2tpbm5pbmdNb2RlbCIsInVwbG9hZEFuaW1hdGlvbiIsIl9idWZmZXJzIiwiX2RhdGFBcnJheSIsIl9qb2ludHMiLCJfYnVmZmVySW5kaWNlcyIsInR5cGUiLCJNb2RlbFR5cGUiLCJTS0lOTklORyIsImJpbmRTa2VsZXRvbiIsImRlc3Ryb3kiLCJza2VsZXRvbiIsInNraW5uaW5nUm9vdCIsIm1lc2giLCJ0YXJnZXQiLCJib25lU3BhY2VCb3VuZHMiLCJnZXRCb25lU3BhY2VCb3VuZHMiLCJzdHJ1Y3QiLCJfZW5zdXJlRW5vdWdoQnVmZmVycyIsImpvaW50QnVmZmVySW5kaWNlcyIsImpvaW50cyIsImJvdW5kIiwiZ2V0Q2hpbGRCeVBhdGgiLCJiaW5kcG9zZSIsImJpbmRwb3NlcyIsImluZGljZXMiLCJidWZmZXJzIiwiX2RpcnR5RmxhZ3MiLCJ1cGRhdGVXb3JsZFRyYW5zZm9ybSIsIl90cmFuc2Zvcm1VcGRhdGVkIiwiSW5maW5pdHkiLCJ3b3JsZE1hdHJpeCIsImdldEJvdW5kYXJ5IiwibWluIiwibWF4IiwiX21vZGVsQm91bmRzIiwiX3dvcmxkQm91bmRzIiwiZnJvbVBvaW50cyIsIl9tYXQiLCJfcG9zIiwiX3JvdCIsIl9zY2FsZSIsImIiLCJ1cGRhdGUiLCJpZHgiLCJzdWJNZXNoRGF0YSIsIm1hdCIsIm9yaWdpbmFsIiwidmVydGV4QnVmZmVycyIsImlhSW5mbyIsImpvaW50TWFwcGVkQnVmZmVycyIsInN1Yk1vZGVsSW5kZXgiLCJzdXBlck1hY3JvUGF0Y2hlcyIsImNvbmNhdCIsInN1Ym1vZGVsSWR4IiwiZGVzY3JpcHRvclNldCIsImJ1ZmZlciIsImJpbmRCdWZmZXIiLCJVQk9Ta2lubmluZyIsIkJJTkRJTkciLCJjb3VudCIsIl9kZXZpY2UiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJVTklGT1JNIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiU0laRSIsIkZsb2F0MzJBcnJheSIsIkNPVU5UIiwiTW9ycGhNb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURBLE1BQU1BLEtBQXdCLEdBQUcsRUFBakM7QUFDQSxNQUFNQyxJQUFrQyxHQUFHLElBQUlDLEdBQUosRUFBM0M7QUFFQSxNQUFNQyxTQUFTLEdBQUcsQ0FDZDtBQUFFQyxJQUFBQSxJQUFJLEVBQUUsaUJBQVI7QUFBMkJDLElBQUFBLEtBQUssRUFBRTtBQUFsQyxHQURjLENBQWxCOztBQUlPLFdBQVNDLGNBQVQsQ0FBeUJDLFNBQXpCLEVBQTREQyxLQUE1RCxFQUEyRTtBQUM5RSxRQUFJQyxDQUFDLEdBQUcsQ0FBUjtBQUNB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QUUrQnNHLFcsRUFBcUJDLGEsRUFBaUM7QUFDbEYsbUdBQThCRCxXQUE5QixFQUEyQ0MsYUFBM0M7O0FBQ0EsWUFBTUMsTUFBTSxHQUFHLEtBQUt0RCxRQUFMLENBQWMsS0FBS0csY0FBTCxDQUFxQmlELFdBQXJCLENBQWQsQ0FBZjs7QUFDQSxZQUFJRSxNQUFKLEVBQVk7QUFBRUQsVUFBQUEsYUFBYSxDQUFDRSxVQUFkLENBQXlCQyxxQkFBWUMsT0FBckMsRUFBOENILE1BQTlDO0FBQXdEO0FBQ3pFOzs7MkNBRTZCSSxLLEVBQWU7QUFDekMsYUFBSyxJQUFJdEcsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3NHLEtBQXBCLEVBQTJCdEcsQ0FBQyxFQUE1QixFQUFnQztBQUM1QixjQUFJLENBQUMsS0FBSzRDLFFBQUwsQ0FBYzVDLENBQWQsQ0FBTCxFQUF1QjtBQUNuQixpQkFBSzRDLFFBQUwsQ0FBYzVDLENBQWQsSUFBbUIsS0FBS3VHLE9BQUwsQ0FBYUMsWUFBYixDQUEwQixJQUFJQyxxQkFBSixDQUN6Q0MsMEJBQWtCQyxPQUFsQixHQUE0QkQsMEJBQWtCRSxZQURMLEVBRXpDQywwQkFBa0JDLElBQWxCLEdBQXlCRCwwQkFBa0JFLE1BRkYsRUFHekNYLHFCQUFZWSxJQUg2QixFQUl6Q1oscUJBQVlZLElBSjZCLENBQTFCLENBQW5CO0FBTUg7O0FBQ0QsY0FBSSxDQUFDLEtBQUtuRSxVQUFMLENBQWdCN0MsQ0FBaEIsQ0FBTCxFQUF5QjtBQUNyQixpQkFBSzZDLFVBQUwsQ0FBZ0I3QyxDQUFoQixJQUFxQixJQUFJaUgsWUFBSixDQUFpQmIscUJBQVljLEtBQTdCLENBQXJCO0FBQ0g7QUFDSjtBQUNKOzs7O0lBL0g4QkMsc0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGhpZGRlblxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgTWVzaCwgUmVuZGVyaW5nU3ViTWVzaCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgU2tlbGV0b24gfSBmcm9tICcuLi8uLi9hc3NldHMvc2tlbGV0b24nO1xyXG5pbXBvcnQgeyBhYWJiIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlckluZm8gfSBmcm9tICcuLi8uLi9nZngvYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWE1lbW9yeVVzYWdlQml0IH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IE1hdDQsIFZlYzMgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgVUJPU2tpbm5pbmcgfSBmcm9tICcuLi8uLi9waXBlbGluZS9kZWZpbmUnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgvbm9kZSc7XHJcbmltcG9ydCB7IE1vZGVsVHlwZSB9IGZyb20gJy4uL3NjZW5lL21vZGVsJztcclxuaW1wb3J0IHsgdXBsb2FkSm9pbnREYXRhIH0gZnJvbSAnLi9za2VsZXRhbC1hbmltYXRpb24tdXRpbHMnO1xyXG5pbXBvcnQgeyBNb3JwaE1vZGVsIH0gZnJvbSAnLi9tb3JwaC1tb2RlbCc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXQgfSBmcm9tICcuLi8uLi9nZngnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJSm9pbnRUcmFuc2Zvcm0ge1xyXG4gICAgbm9kZTogTm9kZTtcclxuICAgIGxvY2FsOiBNYXQ0O1xyXG4gICAgd29ybGQ6IE1hdDQ7XHJcbiAgICBzdGFtcDogbnVtYmVyO1xyXG4gICAgcGFyZW50OiBJSm9pbnRUcmFuc2Zvcm0gfCBudWxsO1xyXG59XHJcblxyXG5jb25zdCBzdGFjazogSUpvaW50VHJhbnNmb3JtW10gPSBbXTtcclxuY29uc3QgcG9vbDogTWFwPHN0cmluZywgSUpvaW50VHJhbnNmb3JtPiA9IG5ldyBNYXAoKTtcclxuXHJcbmNvbnN0IG15UGF0Y2hlcyA9IFtcclxuICAgIHsgbmFtZTogJ0NDX1VTRV9TS0lOTklORycsIHZhbHVlOiB0cnVlIH0sXHJcbl07XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ybGRNYXRyaXggKHRyYW5zZm9ybTogSUpvaW50VHJhbnNmb3JtIHwgbnVsbCwgc3RhbXA6IG51bWJlcikge1xyXG4gICAgbGV0IGkgPSAwO1xyXG4gICAgbGV0IHJlcyA9IE1hdDQuSURFTlRJVFk7XHJcbiAgICB3aGlsZSAodHJhbnNmb3JtKSB7XHJcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5zdGFtcCA9PT0gc3RhbXAgfHwgdHJhbnNmb3JtLnN0YW1wICsgMSA9PT0gc3RhbXAgJiYgIXRyYW5zZm9ybS5ub2RlLmhhc0NoYW5nZWRGbGFncykge1xyXG4gICAgICAgICAgICByZXMgPSB0cmFuc2Zvcm0ud29ybGQ7XHJcbiAgICAgICAgICAgIHRyYW5zZm9ybS5zdGFtcCA9IHN0YW1wO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJhbnNmb3JtLnN0YW1wID0gc3RhbXA7XHJcbiAgICAgICAgc3RhY2tbaSsrXSA9IHRyYW5zZm9ybTtcclxuICAgICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0ucGFyZW50O1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKGkgPiAwKSB7XHJcbiAgICAgICAgdHJhbnNmb3JtID0gc3RhY2tbLS1pXTtcclxuICAgICAgICBjb25zdCBub2RlID0gdHJhbnNmb3JtLm5vZGU7XHJcbiAgICAgICAgTWF0NC5mcm9tUlRTKHRyYW5zZm9ybS5sb2NhbCwgbm9kZS5yb3RhdGlvbiwgbm9kZS5wb3NpdGlvbiwgbm9kZS5zY2FsZSk7XHJcbiAgICAgICAgcmVzID0gTWF0NC5tdWx0aXBseSh0cmFuc2Zvcm0ud29ybGQsIHJlcywgdHJhbnNmb3JtLmxvY2FsKTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRUcmFuc2Zvcm0gKG5vZGU6IE5vZGUsIHJvb3Q6IE5vZGUpIHtcclxuICAgIGxldCBqb2ludDogSUpvaW50VHJhbnNmb3JtIHwgbnVsbCA9IG51bGw7XHJcbiAgICBsZXQgaSA9IDA7XHJcbiAgICB3aGlsZSAobm9kZSAhPT0gcm9vdCkge1xyXG4gICAgICAgIGNvbnN0IGlkID0gbm9kZS51dWlkO1xyXG4gICAgICAgIGlmIChwb29sLmhhcyhpZCkpIHtcclxuICAgICAgICAgICAgam9pbnQgPSBwb29sLmdldChpZCkhO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9IGVsc2UgeyAvLyBUT0RPOiBvYmplY3QgcmV1c2VcclxuICAgICAgICAgICAgam9pbnQgPSB7IG5vZGUsIGxvY2FsOiBuZXcgTWF0NCgpLCB3b3JsZDogbmV3IE1hdDQoKSwgc3RhbXA6IC0xLCBwYXJlbnQ6IG51bGwgfTtcclxuICAgICAgICAgICAgcG9vbC5zZXQoaWQsIGpvaW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3RhY2tbaSsrXSA9IGpvaW50O1xyXG4gICAgICAgIG5vZGUgPSBub2RlLnBhcmVudCE7XHJcbiAgICAgICAgam9pbnQgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgbGV0IGNoaWxkOiBJSm9pbnRUcmFuc2Zvcm07XHJcbiAgICB3aGlsZSAoaSA+IDApIHtcclxuICAgICAgICBjaGlsZCA9IHN0YWNrWy0taV07XHJcbiAgICAgICAgY2hpbGQucGFyZW50ID0gam9pbnQ7XHJcbiAgICAgICAgam9pbnQgPSBjaGlsZDtcclxuICAgIH1cclxuICAgIHJldHVybiBqb2ludDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZVRyYW5zZm9ybSAobm9kZTogTm9kZSkge1xyXG4gICAgbGV0IHRyYW5zZm9ybSA9IHBvb2wuZ2V0KG5vZGUudXVpZCkgfHwgbnVsbDtcclxuICAgIHdoaWxlICh0cmFuc2Zvcm0pIHtcclxuICAgICAgICBwb29sLmRlbGV0ZSh0cmFuc2Zvcm0ubm9kZS51dWlkKTtcclxuICAgICAgICB0cmFuc2Zvcm0gPSB0cmFuc2Zvcm0ucGFyZW50O1xyXG4gICAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSZWxldmFudEJ1ZmZlcnMgKG91dEluZGljZXM6IG51bWJlcltdLCBvdXRCdWZmZXJzOiBudW1iZXJbXSwgam9pbnRNYXBzOiBudW1iZXJbXVtdLCB0YXJnZXRKb2ludDogbnVtYmVyKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGpvaW50TWFwcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGlkeE1hcCA9IGpvaW50TWFwc1tpXTtcclxuICAgICAgICBsZXQgaW5kZXggPSAtMTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGlkeE1hcC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICBpZiAoaWR4TWFwW2pdID09PSB0YXJnZXRKb2ludCkgeyBpbmRleCA9IGo7IGJyZWFrOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIG91dEJ1ZmZlcnMucHVzaChpKTtcclxuICAgICAgICAgICAgb3V0SW5kaWNlcy5wdXNoKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbmludGVyZmFjZSBJSm9pbnRJbmZvIHtcclxuICAgIGJvdW5kOiBhYWJiO1xyXG4gICAgdGFyZ2V0OiBOb2RlO1xyXG4gICAgYmluZHBvc2U6IE1hdDQ7XHJcbiAgICB0cmFuc2Zvcm06IElKb2ludFRyYW5zZm9ybTtcclxuICAgIGJ1ZmZlcnM6IG51bWJlcltdO1xyXG4gICAgaW5kaWNlczogbnVtYmVyW107XHJcbn1cclxuXHJcbmNvbnN0IHYzX21pbiA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHYzX21heCA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IHYzXzEgPSBuZXcgVmVjMygpO1xyXG5jb25zdCB2M18yID0gbmV3IFZlYzMoKTtcclxuY29uc3QgbTRfMSA9IG5ldyBNYXQ0KCk7XHJcbmNvbnN0IGFiXzEgPSBuZXcgYWFiYigpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgc2tpbm5pbmcgbW9kZWwgdGhhdCBpcyB1c2luZyByZWFsLXRpbWUgcG9zZSBjYWxjdWxhdGlvbi5cclxuICogQHpoXHJcbiAqIOWunuaXtuiuoeeul+WKqOeUu+eahOiSmeearuaooeWei+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFNraW5uaW5nTW9kZWwgZXh0ZW5kcyBNb3JwaE1vZGVsIHtcclxuXHJcbiAgICBwdWJsaWMgdXBsb2FkQW5pbWF0aW9uID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9idWZmZXJzOiBHRlhCdWZmZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfZGF0YUFycmF5OiBGbG9hdDMyQXJyYXlbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfam9pbnRzOiBJSm9pbnRJbmZvW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2J1ZmZlckluZGljZXM6IG51bWJlcltdIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy50eXBlID0gTW9kZWxUeXBlLlNLSU5OSU5HO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICB0aGlzLmJpbmRTa2VsZXRvbigpO1xyXG4gICAgICAgIGlmICh0aGlzLl9idWZmZXJzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2J1ZmZlcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlcnNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlcnMubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBiaW5kU2tlbGV0b24gKHNrZWxldG9uOiBTa2VsZXRvbiB8IG51bGwgPSBudWxsLCBza2lubmluZ1Jvb3Q6IE5vZGUgfCBudWxsID0gbnVsbCwgbWVzaDogTWVzaCB8IG51bGwgPSBudWxsKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9qb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGVsZXRlVHJhbnNmb3JtKHRoaXMuX2pvaW50c1tpXS50YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9idWZmZXJJbmRpY2VzID0gbnVsbDsgdGhpcy5fam9pbnRzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgaWYgKCFza2VsZXRvbiB8fCAhc2tpbm5pbmdSb290IHx8ICFtZXNoKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gc2tpbm5pbmdSb290O1xyXG4gICAgICAgIGNvbnN0IGJvbmVTcGFjZUJvdW5kcyA9IG1lc2guZ2V0Qm9uZVNwYWNlQm91bmRzKHNrZWxldG9uKTtcclxuICAgICAgICBjb25zdCBqb2ludE1hcHMgPSBtZXNoLnN0cnVjdC5qb2ludE1hcHM7XHJcbiAgICAgICAgdGhpcy5fZW5zdXJlRW5vdWdoQnVmZmVycyhqb2ludE1hcHMgJiYgam9pbnRNYXBzLmxlbmd0aCB8fCAxKTtcclxuICAgICAgICB0aGlzLl9idWZmZXJJbmRpY2VzID0gbWVzaC5qb2ludEJ1ZmZlckluZGljZXM7XHJcbiAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHNrZWxldG9uLmpvaW50cy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgY29uc3QgYm91bmQgPSBib25lU3BhY2VCb3VuZHNbaW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCB0YXJnZXQgPSBza2lubmluZ1Jvb3QuZ2V0Q2hpbGRCeVBhdGgoc2tlbGV0b24uam9pbnRzW2luZGV4XSk7XHJcbiAgICAgICAgICAgIGlmICghYm91bmQgfHwgIXRhcmdldCkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBnZXRUcmFuc2Zvcm0odGFyZ2V0LCBza2lubmluZ1Jvb3QpITtcclxuICAgICAgICAgICAgY29uc3QgYmluZHBvc2UgPSBza2VsZXRvbi5iaW5kcG9zZXNbaW5kZXhdO1xyXG4gICAgICAgICAgICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBjb25zdCBidWZmZXJzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIWpvaW50TWFwcykgeyBpbmRpY2VzLnB1c2goaW5kZXgpOyBidWZmZXJzLnB1c2goMCk7IH1cclxuICAgICAgICAgICAgZWxzZSB7IGdldFJlbGV2YW50QnVmZmVycyhpbmRpY2VzLCBidWZmZXJzLCBqb2ludE1hcHMsIGluZGV4KTsgfVxyXG4gICAgICAgICAgICB0aGlzLl9qb2ludHMucHVzaCh7IGluZGljZXMsIGJ1ZmZlcnMsIGJvdW5kLCB0YXJnZXQsIGJpbmRwb3NlLCB0cmFuc2Zvcm0gfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVUcmFuc2Zvcm0gKHN0YW1wOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCByb290ID0gdGhpcy50cmFuc2Zvcm0hO1xyXG4gICAgICAgIC8vIEB0cy1pZ25vcmUgVFMyNDQ1XHJcbiAgICAgICAgaWYgKHJvb3QuaGFzQ2hhbmdlZEZsYWdzIHx8IHJvb3QuX2RpcnR5RmxhZ3MpIHtcclxuICAgICAgICAgICAgcm9vdC51cGRhdGVXb3JsZFRyYW5zZm9ybSgpO1xyXG4gICAgICAgICAgICB0aGlzLl90cmFuc2Zvcm1VcGRhdGVkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdXBkYXRlIGJvdW5kc1xyXG4gICAgICAgIFZlYzMuc2V0KHYzX21pbiwgIEluZmluaXR5LCAgSW5maW5pdHksICBJbmZpbml0eSk7XHJcbiAgICAgICAgVmVjMy5zZXQodjNfbWF4LCAtSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2pvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB7IGJvdW5kLCB0cmFuc2Zvcm0gfSA9IHRoaXMuX2pvaW50c1tpXTtcclxuICAgICAgICAgICAgY29uc3Qgd29ybGRNYXRyaXggPSBnZXRXb3JsZE1hdHJpeCh0cmFuc2Zvcm0sIHN0YW1wKTtcclxuICAgICAgICAgICAgYWFiYi50cmFuc2Zvcm0oYWJfMSwgYm91bmQsIHdvcmxkTWF0cml4KTtcclxuICAgICAgICAgICAgYWJfMS5nZXRCb3VuZGFyeSh2M18xLCB2M18yKTtcclxuICAgICAgICAgICAgVmVjMy5taW4odjNfbWluLCB2M19taW4sIHYzXzEpO1xyXG4gICAgICAgICAgICBWZWMzLm1heCh2M19tYXgsIHYzX21heCwgdjNfMik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbEJvdW5kcyAmJiB0aGlzLl93b3JsZEJvdW5kcykge1xyXG4gICAgICAgICAgICBhYWJiLmZyb21Qb2ludHModGhpcy5fbW9kZWxCb3VuZHMsIHYzX21pbiwgdjNfbWF4KTtcclxuICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBUUzI0NDVcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWxCb3VuZHMudHJhbnNmb3JtKHJvb3QuX21hdCwgcm9vdC5fcG9zLCByb290Ll9yb3QsIHJvb3QuX3NjYWxlLCB0aGlzLl93b3JsZEJvdW5kcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVVQk9zIChzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlVUJPcyhzdGFtcCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9qb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgeyBpbmRpY2VzLCBidWZmZXJzLCB0cmFuc2Zvcm0sIGJpbmRwb3NlIH0gPSB0aGlzLl9qb2ludHNbaV07XHJcbiAgICAgICAgICAgIE1hdDQubXVsdGlwbHkobTRfMSwgdHJhbnNmb3JtLndvcmxkLCBiaW5kcG9zZSk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYnVmZmVycy5sZW5ndGg7IGIrKykge1xyXG4gICAgICAgICAgICAgICAgdXBsb2FkSm9pbnREYXRhKHRoaXMuX2RhdGFBcnJheVtidWZmZXJzW2JdXSwgaW5kaWNlc1tiXSAqIDEyLCBtNF8xLCBpID09PSAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBiID0gMDsgYiA8IHRoaXMuX2J1ZmZlcnMubGVuZ3RoOyBiKyspIHtcclxuICAgICAgICAgICAgdGhpcy5fYnVmZmVyc1tiXS51cGRhdGUodGhpcy5fZGF0YUFycmF5W2JdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRTdWJNb2RlbCAoaWR4OiBudW1iZXIsIHN1Yk1lc2hEYXRhOiBSZW5kZXJpbmdTdWJNZXNoLCBtYXQ6IE1hdGVyaWFsKSB7XHJcbiAgICAgICAgY29uc3Qgb3JpZ2luYWwgPSBzdWJNZXNoRGF0YS52ZXJ0ZXhCdWZmZXJzO1xyXG4gICAgICAgIGNvbnN0IGlhSW5mbyA9IHN1Yk1lc2hEYXRhLmlhSW5mbztcclxuICAgICAgICBpYUluZm8udmVydGV4QnVmZmVycyA9IHN1Yk1lc2hEYXRhLmpvaW50TWFwcGVkQnVmZmVycztcclxuICAgICAgICBzdXBlci5pbml0U3ViTW9kZWwoaWR4LCBzdWJNZXNoRGF0YSwgbWF0KTtcclxuICAgICAgICBpYUluZm8udmVydGV4QnVmZmVycyA9IG9yaWdpbmFsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNYWNyb1BhdGNoZXMgKHN1Yk1vZGVsSW5kZXg6IG51bWJlcikgOiBhbnkge1xyXG4gICAgICAgIGNvbnN0IHN1cGVyTWFjcm9QYXRjaGVzID0gc3VwZXIuZ2V0TWFjcm9QYXRjaGVzKHN1Yk1vZGVsSW5kZXgpO1xyXG4gICAgICAgIGlmIChzdXBlck1hY3JvUGF0Y2hlcykge1xyXG4gICAgICAgICAgICByZXR1cm4gbXlQYXRjaGVzLmNvbmNhdChzdXBlck1hY3JvUGF0Y2hlcyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIG15UGF0Y2hlcztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVMb2NhbERlc2NyaXB0b3JzIChzdWJtb2RlbElkeDogbnVtYmVyLCBkZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0KSB7XHJcbiAgICAgICAgc3VwZXIuX3VwZGF0ZUxvY2FsRGVzY3JpcHRvcnMoc3VibW9kZWxJZHgsIGRlc2NyaXB0b3JTZXQpO1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX2J1ZmZlcnNbdGhpcy5fYnVmZmVySW5kaWNlcyFbc3VibW9kZWxJZHhdXTtcclxuICAgICAgICBpZiAoYnVmZmVyKSB7IGRlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9Ta2lubmluZy5CSU5ESU5HLCBidWZmZXIpOyB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZW5zdXJlRW5vdWdoQnVmZmVycyAoY291bnQ6IG51bWJlcikge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2J1ZmZlcnNbaV0pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1ZmZlcnNbaV0gPSB0aGlzLl9kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlVOSUZPUk0gfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgICAgICAgICBVQk9Ta2lubmluZy5TSVpFLFxyXG4gICAgICAgICAgICAgICAgICAgIFVCT1NraW5uaW5nLlNJWkUsXHJcbiAgICAgICAgICAgICAgICApKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuX2RhdGFBcnJheVtpXSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGF0YUFycmF5W2ldID0gbmV3IEZsb2F0MzJBcnJheShVQk9Ta2lubmluZy5DT1VOVCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19