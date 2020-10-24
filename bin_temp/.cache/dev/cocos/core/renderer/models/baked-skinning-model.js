(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../../gfx/buffer.js", "../../gfx/define.js", "../../pipeline/define.js", "../core/sampler-lib.js", "../scene/model.js", "./skeletal-animation-utils.js", "./morph-model.js", "../../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../../gfx/buffer.js"), require("../../gfx/define.js"), require("../../pipeline/define.js"), require("../core/sampler-lib.js"), require("../scene/model.js"), require("./skeletal-animation-utils.js"), require("./morph-model.js"), require("../../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.buffer, global.define, global.define, global.samplerLib, global.model, global.skeletalAnimationUtils, global.morphModel, global.globalExports);
    global.bakedSkinningModel = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _buffer, _define, _define2, _samplerLib, _model, _skeletalAnimationUtils, _morphModel, _globalExports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.BakedSkinningModel = void 0;

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

  var myPatches = [{
    name: 'CC_USE_SKINNING',
    value: true
  }, {
    name: 'CC_USE_BAKED_ANIMATION',
    value: true
  }];
  /**
   * @en
   * The skinning model that is using baked animation.
   * @zh
   * 预烘焙动画的蒙皮模型。
   */

  var BakedSkinningModel = /*#__PURE__*/function (_MorphModel) {
    _inherits(BakedSkinningModel, _MorphModel);

    // uninitialized
    function BakedSkinningModel() {
      var _this;

      _classCallCheck(this, BakedSkinningModel);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BakedSkinningModel).call(this));
      _this.uploadedAnim = undefined;
      _this._jointsMedium = void 0;
      _this._skeleton = null;
      _this._mesh = null;
      _this._dataPoolManager = void 0;
      _this._instAnimInfoIdx = -1;
      _this.type = _model.ModelType.BAKED_SKINNING;
      _this._dataPoolManager = _globalExports.legacyCC.director.root.dataPoolManager;
      var jointTextureInfo = new Float32Array(4);

      var animInfo = _this._dataPoolManager.jointAnimationInfo.getData();

      _this._jointsMedium = {
        buffer: null,
        jointTextureInfo: jointTextureInfo,
        animInfo: animInfo,
        texture: null,
        boundsInfo: null
      };
      return _this;
    }

    _createClass(BakedSkinningModel, [{
      key: "destroy",
      value: function destroy() {
        this.uploadedAnim = undefined; // uninitialized

        this._jointsMedium.boundsInfo = null;

        if (this._jointsMedium.buffer) {
          this._jointsMedium.buffer.destroy();

          this._jointsMedium.buffer = null;
        }

        this._applyJointTexture();

        _get(_getPrototypeOf(BakedSkinningModel.prototype), "destroy", this).call(this);
      }
    }, {
      key: "bindSkeleton",
      value: function bindSkeleton() {
        var skeleton = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var skinningRoot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var mesh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        this._skeleton = skeleton;
        this._mesh = mesh;

        if (!skeleton || !skinningRoot || !mesh) {
          return;
        }

        this.transform = skinningRoot;
        var resMgr = this._dataPoolManager;
        this._jointsMedium.animInfo = resMgr.jointAnimationInfo.getData(skinningRoot.uuid);

        if (!this._jointsMedium.buffer) {
          this._jointsMedium.buffer = this._device.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.UNIFORM | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _define2.UBOSkinningTexture.SIZE, _define2.UBOSkinningTexture.SIZE));
        }
      }
    }, {
      key: "updateTransform",
      value: function updateTransform(stamp) {
        _get(_getPrototypeOf(BakedSkinningModel.prototype), "updateTransform", this).call(this, stamp);

        if (!this.uploadedAnim) {
          return;
        }

        var _this$_jointsMedium = this._jointsMedium,
            animInfo = _this$_jointsMedium.animInfo,
            boundsInfo = _this$_jointsMedium.boundsInfo;
        var skelBound = boundsInfo[animInfo.data[0]];
        var node = this.transform;

        if (this._worldBounds && skelBound) {
          // @ts-ignore TS2339
          skelBound.transform(node._mat, node._pos, node._rot, node._scale, this._worldBounds);
        }
      } // update fid buffer only when visible

    }, {
      key: "updateUBOs",
      value: function updateUBOs(stamp) {
        _get(_getPrototypeOf(BakedSkinningModel.prototype), "updateUBOs", this).call(this, stamp);

        var info = this._jointsMedium.animInfo;
        var idx = this._instAnimInfoIdx;

        if (idx >= 0) {
          var view = this.instancedAttributes.list[idx].view;
          view[0] = info.data[0];
        } else if (info.dirty) {
          info.buffer.update(info.data);
          info.dirty = false;
        }

        return true;
      }
    }, {
      key: "createBoundingShape",
      value: function createBoundingShape(minPos, maxPos) {
        if (!minPos || !maxPos) {
          return;
        }

        this._worldBounds = new _index.aabb();
      }
    }, {
      key: "uploadAnimation",
      value: function uploadAnimation(anim) {
        if (!this._skeleton || !this._mesh || this.uploadedAnim === anim) {
          return;
        }

        this.uploadedAnim = anim;
        var resMgr = this._dataPoolManager;
        var texture = null;

        if (anim) {
          texture = resMgr.jointTexturePool.getSequencePoseTexture(this._skeleton, anim, this._mesh, this.transform);
          this._jointsMedium.boundsInfo = texture && texture.bounds.get(this._mesh.hash);
          this._modelBounds = null; // don't calc bounds again in Model
        } else {
          texture = resMgr.jointTexturePool.getDefaultPoseTexture(this._skeleton, this._mesh, this.transform);
          this._jointsMedium.boundsInfo = null;
          this._modelBounds = texture && texture.bounds.get(this._mesh.hash)[0];
        }

        this._applyJointTexture(texture);
      }
    }, {
      key: "_applyJointTexture",
      value: function _applyJointTexture() {
        var texture = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var oldTex = this._jointsMedium.texture;

        if (oldTex && oldTex !== texture) {
          this._dataPoolManager.jointTexturePool.releaseHandle(oldTex);
        }

        this._jointsMedium.texture = texture;

        if (!texture) {
          return;
        }

        var _this$_jointsMedium2 = this._jointsMedium,
            buffer = _this$_jointsMedium2.buffer,
            jointTextureInfo = _this$_jointsMedium2.jointTextureInfo;
        jointTextureInfo[0] = texture.handle.texture.width;
        jointTextureInfo[1] = this._skeleton.joints.length;
        jointTextureInfo[2] = texture.pixelOffset + 0.1; // guard against floor() underflow

        jointTextureInfo[3] = 1 / jointTextureInfo[0];
        this.updateInstancedJointTextureInfo();

        if (buffer) {
          buffer.update(jointTextureInfo);
        }

        var tex = texture.handle.texture;

        for (var i = 0; i < this._subModels.length; ++i) {
          var descriptorSet = this._subModels[i].descriptorSet;
          descriptorSet.bindTexture(_define2.UNIFORM_JOINT_TEXTURE_BINDING, tex);
        }
      }
    }, {
      key: "getMacroPatches",
      value: function getMacroPatches(subModelIndex) {
        var patches = _get(_getPrototypeOf(BakedSkinningModel.prototype), "getMacroPatches", this).call(this, subModelIndex);

        return patches ? patches.concat(myPatches) : myPatches;
      }
    }, {
      key: "_updateLocalDescriptors",
      value: function _updateLocalDescriptors(submodelIdx, descriptorSet) {
        _get(_getPrototypeOf(BakedSkinningModel.prototype), "_updateLocalDescriptors", this).call(this, submodelIdx, descriptorSet);

        var _this$_jointsMedium3 = this._jointsMedium,
            buffer = _this$_jointsMedium3.buffer,
            texture = _this$_jointsMedium3.texture,
            animInfo = _this$_jointsMedium3.animInfo;
        descriptorSet.bindBuffer(_define2.UBOSkinningTexture.BINDING, buffer);
        descriptorSet.bindBuffer(_define2.UBOSkinningAnimation.BINDING, animInfo.buffer);

        if (texture) {
          var sampler = _samplerLib.samplerLib.getSampler(this._device, _skeletalAnimationUtils.jointTextureSamplerHash);

          descriptorSet.bindTexture(_define2.UNIFORM_JOINT_TEXTURE_BINDING, texture.handle.texture);
          descriptorSet.bindSampler(_define2.UNIFORM_JOINT_TEXTURE_BINDING, sampler);
        }
      }
    }, {
      key: "_updateInstancedAttributes",
      value: function _updateInstancedAttributes(attributes, pass) {
        _get(_getPrototypeOf(BakedSkinningModel.prototype), "_updateInstancedAttributes", this).call(this, attributes, pass);

        this._instAnimInfoIdx = this._getInstancedAttributeIndex(_define2.INST_JOINT_ANIM_INFO);
        this.updateInstancedJointTextureInfo();
      }
    }, {
      key: "updateInstancedJointTextureInfo",
      value: function updateInstancedJointTextureInfo() {
        var _this$_jointsMedium4 = this._jointsMedium,
            jointTextureInfo = _this$_jointsMedium4.jointTextureInfo,
            animInfo = _this$_jointsMedium4.animInfo;
        var idx = this._instAnimInfoIdx;

        if (idx >= 0) {
          // update instancing data too
          var view = this.instancedAttributes.list[idx].view;
          view[0] = animInfo.data[0];
          view[1] = jointTextureInfo[1];
          view[2] = jointTextureInfo[2];
        }
      }
    }]);

    return BakedSkinningModel;
  }(_morphModel.MorphModel);

  _exports.BakedSkinningModel = BakedSkinningModel;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvbW9kZWxzL2Jha2VkLXNraW5uaW5nLW1vZGVsLnRzIl0sIm5hbWVzIjpbIm15UGF0Y2hlcyIsIm5hbWUiLCJ2YWx1ZSIsIkJha2VkU2tpbm5pbmdNb2RlbCIsInVwbG9hZGVkQW5pbSIsInVuZGVmaW5lZCIsIl9qb2ludHNNZWRpdW0iLCJfc2tlbGV0b24iLCJfbWVzaCIsIl9kYXRhUG9vbE1hbmFnZXIiLCJfaW5zdEFuaW1JbmZvSWR4IiwidHlwZSIsIk1vZGVsVHlwZSIsIkJBS0VEX1NLSU5OSU5HIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkYXRhUG9vbE1hbmFnZXIiLCJqb2ludFRleHR1cmVJbmZvIiwiRmxvYXQzMkFycmF5IiwiYW5pbUluZm8iLCJqb2ludEFuaW1hdGlvbkluZm8iLCJnZXREYXRhIiwiYnVmZmVyIiwidGV4dHVyZSIsImJvdW5kc0luZm8iLCJkZXN0cm95IiwiX2FwcGx5Sm9pbnRUZXh0dXJlIiwic2tlbGV0b24iLCJza2lubmluZ1Jvb3QiLCJtZXNoIiwidHJhbnNmb3JtIiwicmVzTWdyIiwidXVpZCIsIl9kZXZpY2UiLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJVTklGT1JNIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiVUJPU2tpbm5pbmdUZXh0dXJlIiwiU0laRSIsInN0YW1wIiwic2tlbEJvdW5kIiwiZGF0YSIsIm5vZGUiLCJfd29ybGRCb3VuZHMiLCJfbWF0IiwiX3BvcyIsIl9yb3QiLCJfc2NhbGUiLCJpbmZvIiwiaWR4IiwidmlldyIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJsaXN0IiwiZGlydHkiLCJ1cGRhdGUiLCJtaW5Qb3MiLCJtYXhQb3MiLCJhYWJiIiwiYW5pbSIsImpvaW50VGV4dHVyZVBvb2wiLCJnZXRTZXF1ZW5jZVBvc2VUZXh0dXJlIiwiYm91bmRzIiwiZ2V0IiwiaGFzaCIsIl9tb2RlbEJvdW5kcyIsImdldERlZmF1bHRQb3NlVGV4dHVyZSIsIm9sZFRleCIsInJlbGVhc2VIYW5kbGUiLCJoYW5kbGUiLCJ3aWR0aCIsImpvaW50cyIsImxlbmd0aCIsInBpeGVsT2Zmc2V0IiwidXBkYXRlSW5zdGFuY2VkSm9pbnRUZXh0dXJlSW5mbyIsInRleCIsImkiLCJfc3ViTW9kZWxzIiwiZGVzY3JpcHRvclNldCIsImJpbmRUZXh0dXJlIiwiVU5JRk9STV9KT0lOVF9URVhUVVJFX0JJTkRJTkciLCJzdWJNb2RlbEluZGV4IiwicGF0Y2hlcyIsImNvbmNhdCIsInN1Ym1vZGVsSWR4IiwiYmluZEJ1ZmZlciIsIkJJTkRJTkciLCJVQk9Ta2lubmluZ0FuaW1hdGlvbiIsInNhbXBsZXIiLCJzYW1wbGVyTGliIiwiZ2V0U2FtcGxlciIsImpvaW50VGV4dHVyZVNhbXBsZXJIYXNoIiwiYmluZFNhbXBsZXIiLCJhdHRyaWJ1dGVzIiwicGFzcyIsIl9nZXRJbnN0YW5jZWRBdHRyaWJ1dGVJbmRleCIsIklOU1RfSk9JTlRfQU5JTV9JTkZPIiwiTW9ycGhNb2RlbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdURBLE1BQU1BLFNBQVMsR0FBRyxDQUNkO0FBQUVDLElBQUFBLElBQUksRUFBRSxpQkFBUjtBQUEyQkMsSUFBQUEsS0FBSyxFQUFFO0FBQWxDLEdBRGMsRUFFZDtBQUFFRCxJQUFBQSxJQUFJLEVBQUUsd0JBQVI7QUFBa0NDLElBQUFBLEtBQUssRUFBRTtBQUF6QyxHQUZjLENBQWxCO0FBS0E7Ozs7Ozs7TUFNYUMsa0I7OztBQUUwRDtBQVNuRSxrQ0FBZTtBQUFBOztBQUFBOztBQUNYO0FBRFcsWUFUUkMsWUFTUSxHQVR5Q0MsU0FTekM7QUFBQSxZQVBQQyxhQU9PO0FBQUEsWUFMUEMsU0FLTyxHQUxzQixJQUt0QjtBQUFBLFlBSlBDLEtBSU8sR0FKYyxJQUlkO0FBQUEsWUFIUEMsZ0JBR087QUFBQSxZQUZQQyxnQkFFTyxHQUZZLENBQUMsQ0FFYjtBQUVYLFlBQUtDLElBQUwsR0FBWUMsaUJBQVVDLGNBQXRCO0FBQ0EsWUFBS0osZ0JBQUwsR0FBd0JLLHdCQUFTQyxRQUFULENBQWtCQyxJQUFsQixDQUF1QkMsZUFBL0M7QUFDQSxVQUFNQyxnQkFBZ0IsR0FBRyxJQUFJQyxZQUFKLENBQWlCLENBQWpCLENBQXpCOztBQUNBLFVBQU1DLFFBQVEsR0FBRyxNQUFLWCxnQkFBTCxDQUFzQlksa0JBQXRCLENBQXlDQyxPQUF6QyxFQUFqQjs7QUFDQSxZQUFLaEIsYUFBTCxHQUFxQjtBQUFFaUIsUUFBQUEsTUFBTSxFQUFFLElBQVY7QUFBZ0JMLFFBQUFBLGdCQUFnQixFQUFoQkEsZ0JBQWhCO0FBQWtDRSxRQUFBQSxRQUFRLEVBQVJBLFFBQWxDO0FBQTRDSSxRQUFBQSxPQUFPLEVBQUUsSUFBckQ7QUFBMkRDLFFBQUFBLFVBQVUsRUFBRTtBQUF2RSxPQUFyQjtBQU5XO0FBT2Q7Ozs7Z0NBRWlCO0FBQ2QsYUFBS3JCLFlBQUwsR0FBb0JDLFNBQXBCLENBRGMsQ0FDaUI7O0FBQy9CLGFBQUtDLGFBQUwsQ0FBbUJtQixVQUFuQixHQUFnQyxJQUFoQzs7QUFDQSxZQUFJLEtBQUtuQixhQUFMLENBQW1CaUIsTUFBdkIsRUFBK0I7QUFDM0IsZUFBS2pCLGFBQUwsQ0FBbUJpQixNQUFuQixDQUEwQkcsT0FBMUI7O0FBQ0EsZUFBS3BCLGFBQUwsQ0FBbUJpQixNQUFuQixHQUE0QixJQUE1QjtBQUNIOztBQUNELGFBQUtJLGtCQUFMOztBQUNBO0FBQ0g7OztxQ0FFa0g7QUFBQSxZQUE5RkMsUUFBOEYsdUVBQWxFLElBQWtFO0FBQUEsWUFBNURDLFlBQTRELHVFQUFoQyxJQUFnQztBQUFBLFlBQTFCQyxJQUEwQix1RUFBTixJQUFNO0FBQy9HLGFBQUt2QixTQUFMLEdBQWlCcUIsUUFBakI7QUFDQSxhQUFLcEIsS0FBTCxHQUFhc0IsSUFBYjs7QUFDQSxZQUFJLENBQUNGLFFBQUQsSUFBYSxDQUFDQyxZQUFkLElBQThCLENBQUNDLElBQW5DLEVBQXlDO0FBQUU7QUFBUzs7QUFDcEQsYUFBS0MsU0FBTCxHQUFpQkYsWUFBakI7QUFDQSxZQUFNRyxNQUFNLEdBQUcsS0FBS3ZCLGdCQUFwQjtBQUNBLGFBQUtILGFBQUwsQ0FBbUJjLFFBQW5CLEdBQThCWSxNQUFNLENBQUNYLGtCQUFQLENBQTBCQyxPQUExQixDQUFrQ08sWUFBWSxDQUFDSSxJQUEvQyxDQUE5Qjs7QUFDQSxZQUFJLENBQUMsS0FBSzNCLGFBQUwsQ0FBbUJpQixNQUF4QixFQUFnQztBQUM1QixlQUFLakIsYUFBTCxDQUFtQmlCLE1BQW5CLEdBQTRCLEtBQUtXLE9BQUwsQ0FBYUMsWUFBYixDQUEwQixJQUFJQyxxQkFBSixDQUNsREMsMEJBQWtCQyxPQUFsQixHQUE0QkQsMEJBQWtCRSxZQURJLEVBRWxEQywwQkFBa0JDLElBQWxCLEdBQXlCRCwwQkFBa0JFLE1BRk8sRUFHbERDLDRCQUFtQkMsSUFIK0IsRUFJbERELDRCQUFtQkMsSUFKK0IsQ0FBMUIsQ0FBNUI7QUFNSDtBQUNKOzs7c0NBRXVCQyxLLEVBQWU7QUFDbkMsZ0dBQXNCQSxLQUF0Qjs7QUFDQSxZQUFJLENBQUMsS0FBS3pDLFlBQVYsRUFBd0I7QUFBRTtBQUFTOztBQUZBLGtDQUdGLEtBQUtFLGFBSEg7QUFBQSxZQUczQmMsUUFIMkIsdUJBRzNCQSxRQUgyQjtBQUFBLFlBR2pCSyxVQUhpQix1QkFHakJBLFVBSGlCO0FBSW5DLFlBQU1xQixTQUFTLEdBQUdyQixVQUFVLENBQUVMLFFBQVEsQ0FBQzJCLElBQVQsQ0FBYyxDQUFkLENBQUYsQ0FBNUI7QUFDQSxZQUFNQyxJQUFJLEdBQUcsS0FBS2pCLFNBQWxCOztBQUNBLFlBQUksS0FBS2tCLFlBQUwsSUFBcUJILFNBQXpCLEVBQW9DO0FBQ2hDO0FBQ0FBLFVBQUFBLFNBQVMsQ0FBQ2YsU0FBVixDQUFvQmlCLElBQUksQ0FBQ0UsSUFBekIsRUFBK0JGLElBQUksQ0FBQ0csSUFBcEMsRUFBMENILElBQUksQ0FBQ0ksSUFBL0MsRUFBcURKLElBQUksQ0FBQ0ssTUFBMUQsRUFBa0UsS0FBS0osWUFBdkU7QUFDSDtBQUNKLE8sQ0FFRDs7OztpQ0FDbUJKLEssRUFBZTtBQUM5QiwyRkFBaUJBLEtBQWpCOztBQUNBLFlBQU1TLElBQUksR0FBRyxLQUFLaEQsYUFBTCxDQUFtQmMsUUFBaEM7QUFDQSxZQUFNbUMsR0FBRyxHQUFHLEtBQUs3QyxnQkFBakI7O0FBQ0EsWUFBSTZDLEdBQUcsSUFBSSxDQUFYLEVBQWM7QUFDVixjQUFNQyxJQUFJLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUJDLElBQXpCLENBQThCSCxHQUE5QixFQUFtQ0MsSUFBaEQ7QUFDQUEsVUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVRixJQUFJLENBQUNQLElBQUwsQ0FBVSxDQUFWLENBQVY7QUFDSCxTQUhELE1BR08sSUFBSU8sSUFBSSxDQUFDSyxLQUFULEVBQWdCO0FBQ25CTCxVQUFBQSxJQUFJLENBQUMvQixNQUFMLENBQVlxQyxNQUFaLENBQW1CTixJQUFJLENBQUNQLElBQXhCO0FBQ0FPLFVBQUFBLElBQUksQ0FBQ0ssS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDs7OzBDQUUyQkUsTSxFQUFlQyxNLEVBQWU7QUFDdEQsWUFBSSxDQUFDRCxNQUFELElBQVcsQ0FBQ0MsTUFBaEIsRUFBd0I7QUFBRTtBQUFTOztBQUNuQyxhQUFLYixZQUFMLEdBQW9CLElBQUljLFdBQUosRUFBcEI7QUFDSDs7O3NDQUV1QkMsSSxFQUE0QjtBQUNoRCxZQUFJLENBQUMsS0FBS3pELFNBQU4sSUFBbUIsQ0FBQyxLQUFLQyxLQUF6QixJQUFrQyxLQUFLSixZQUFMLEtBQXNCNEQsSUFBNUQsRUFBa0U7QUFBRTtBQUFTOztBQUM3RSxhQUFLNUQsWUFBTCxHQUFvQjRELElBQXBCO0FBQ0EsWUFBTWhDLE1BQU0sR0FBRyxLQUFLdkIsZ0JBQXBCO0FBQ0EsWUFBSWUsT0FBbUMsR0FBRyxJQUExQzs7QUFDQSxZQUFJd0MsSUFBSixFQUFVO0FBQ054QyxVQUFBQSxPQUFPLEdBQUdRLE1BQU0sQ0FBQ2lDLGdCQUFQLENBQXdCQyxzQkFBeEIsQ0FBK0MsS0FBSzNELFNBQXBELEVBQStEeUQsSUFBL0QsRUFBcUUsS0FBS3hELEtBQTFFLEVBQWlGLEtBQUt1QixTQUF0RixDQUFWO0FBQ0EsZUFBS3pCLGFBQUwsQ0FBbUJtQixVQUFuQixHQUFnQ0QsT0FBTyxJQUFJQSxPQUFPLENBQUMyQyxNQUFSLENBQWVDLEdBQWYsQ0FBbUIsS0FBSzVELEtBQUwsQ0FBVzZELElBQTlCLENBQTNDO0FBQ0EsZUFBS0MsWUFBTCxHQUFvQixJQUFwQixDQUhNLENBR29CO0FBQzdCLFNBSkQsTUFJTztBQUNIOUMsVUFBQUEsT0FBTyxHQUFHUSxNQUFNLENBQUNpQyxnQkFBUCxDQUF3Qk0scUJBQXhCLENBQThDLEtBQUtoRSxTQUFuRCxFQUE4RCxLQUFLQyxLQUFuRSxFQUEwRSxLQUFLdUIsU0FBL0UsQ0FBVjtBQUNBLGVBQUt6QixhQUFMLENBQW1CbUIsVUFBbkIsR0FBZ0MsSUFBaEM7QUFDQSxlQUFLNkMsWUFBTCxHQUFvQjlDLE9BQU8sSUFBSUEsT0FBTyxDQUFDMkMsTUFBUixDQUFlQyxHQUFmLENBQW1CLEtBQUs1RCxLQUFMLENBQVc2RCxJQUE5QixFQUFxQyxDQUFyQyxDQUEvQjtBQUNIOztBQUNELGFBQUsxQyxrQkFBTCxDQUF3QkgsT0FBeEI7QUFDSDs7OzJDQUV5RTtBQUFBLFlBQTVDQSxPQUE0Qyx1RUFBTixJQUFNO0FBQ3RFLFlBQU1nRCxNQUFNLEdBQUcsS0FBS2xFLGFBQUwsQ0FBbUJrQixPQUFsQzs7QUFDQSxZQUFJZ0QsTUFBTSxJQUFJQSxNQUFNLEtBQUtoRCxPQUF6QixFQUFrQztBQUFFLGVBQUtmLGdCQUFMLENBQXNCd0QsZ0JBQXRCLENBQXVDUSxhQUF2QyxDQUFxREQsTUFBckQ7QUFBK0Q7O0FBQ25HLGFBQUtsRSxhQUFMLENBQW1Ca0IsT0FBbkIsR0FBNkJBLE9BQTdCOztBQUNBLFlBQUksQ0FBQ0EsT0FBTCxFQUFjO0FBQUU7QUFBUzs7QUFKNkMsbUNBS2pDLEtBQUtsQixhQUw0QjtBQUFBLFlBSzlEaUIsTUFMOEQsd0JBSzlEQSxNQUw4RDtBQUFBLFlBS3RETCxnQkFMc0Qsd0JBS3REQSxnQkFMc0Q7QUFNdEVBLFFBQUFBLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsR0FBc0JNLE9BQU8sQ0FBQ2tELE1BQVIsQ0FBZWxELE9BQWYsQ0FBdUJtRCxLQUE3QztBQUNBekQsUUFBQUEsZ0JBQWdCLENBQUMsQ0FBRCxDQUFoQixHQUFzQixLQUFLWCxTQUFMLENBQWdCcUUsTUFBaEIsQ0FBdUJDLE1BQTdDO0FBQ0EzRCxRQUFBQSxnQkFBZ0IsQ0FBQyxDQUFELENBQWhCLEdBQXNCTSxPQUFPLENBQUNzRCxXQUFSLEdBQXNCLEdBQTVDLENBUnNFLENBUXJCOztBQUNqRDVELFFBQUFBLGdCQUFnQixDQUFDLENBQUQsQ0FBaEIsR0FBc0IsSUFBSUEsZ0JBQWdCLENBQUMsQ0FBRCxDQUExQztBQUNBLGFBQUs2RCwrQkFBTDs7QUFDQSxZQUFJeEQsTUFBSixFQUFZO0FBQUVBLFVBQUFBLE1BQU0sQ0FBQ3FDLE1BQVAsQ0FBYzFDLGdCQUFkO0FBQWtDOztBQUNoRCxZQUFNOEQsR0FBRyxHQUFHeEQsT0FBTyxDQUFDa0QsTUFBUixDQUFlbEQsT0FBM0I7O0FBRUEsYUFBSyxJQUFJeUQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLQyxVQUFMLENBQWdCTCxNQUFwQyxFQUE0QyxFQUFFSSxDQUE5QyxFQUFpRDtBQUM3QyxjQUFNRSxhQUFhLEdBQUcsS0FBS0QsVUFBTCxDQUFnQkQsQ0FBaEIsRUFBbUJFLGFBQXpDO0FBQ0FBLFVBQUFBLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQkMsc0NBQTFCLEVBQXlETCxHQUF6RDtBQUNIO0FBQ0o7OztzQ0FFdUJNLGEsRUFBdUI7QUFDM0MsWUFBTUMsT0FBTywyRkFBeUJELGFBQXpCLENBQWI7O0FBQ0EsZUFBT0MsT0FBTyxHQUFHQSxPQUFPLENBQUNDLE1BQVIsQ0FBZXhGLFNBQWYsQ0FBSCxHQUErQkEsU0FBN0M7QUFDSDs7OzhDQUVrQ3lGLFcsRUFBcUJOLGEsRUFBaUM7QUFDckYsd0dBQThCTSxXQUE5QixFQUEyQ04sYUFBM0M7O0FBRHFGLG1DQUUvQyxLQUFLN0UsYUFGMEM7QUFBQSxZQUU3RWlCLE1BRjZFLHdCQUU3RUEsTUFGNkU7QUFBQSxZQUVyRUMsT0FGcUUsd0JBRXJFQSxPQUZxRTtBQUFBLFlBRTVESixRQUY0RCx3QkFFNURBLFFBRjREO0FBR3JGK0QsUUFBQUEsYUFBYSxDQUFDTyxVQUFkLENBQXlCL0MsNEJBQW1CZ0QsT0FBNUMsRUFBcURwRSxNQUFyRDtBQUNBNEQsUUFBQUEsYUFBYSxDQUFDTyxVQUFkLENBQXlCRSw4QkFBcUJELE9BQTlDLEVBQXVEdkUsUUFBUSxDQUFDRyxNQUFoRTs7QUFDQSxZQUFJQyxPQUFKLEVBQWE7QUFDVCxjQUFNcUUsT0FBTyxHQUFHQyx1QkFBV0MsVUFBWCxDQUFzQixLQUFLN0QsT0FBM0IsRUFBb0M4RCwrQ0FBcEMsQ0FBaEI7O0FBQ0FiLFVBQUFBLGFBQWEsQ0FBQ0MsV0FBZCxDQUEwQkMsc0NBQTFCLEVBQXlEN0QsT0FBTyxDQUFDa0QsTUFBUixDQUFlbEQsT0FBeEU7QUFDQTJELFVBQUFBLGFBQWEsQ0FBQ2MsV0FBZCxDQUEwQlosc0NBQTFCLEVBQXlEUSxPQUF6RDtBQUNIO0FBQ0o7OztpREFFcUNLLFUsRUFBNEJDLEksRUFBWTtBQUMxRSwyR0FBaUNELFVBQWpDLEVBQTZDQyxJQUE3Qzs7QUFDQSxhQUFLekYsZ0JBQUwsR0FBd0IsS0FBSzBGLDJCQUFMLENBQWlDQyw2QkFBakMsQ0FBeEI7QUFDQSxhQUFLdEIsK0JBQUw7QUFDSDs7O3dEQUUwQztBQUFBLG1DQUNBLEtBQUt6RSxhQURMO0FBQUEsWUFDL0JZLGdCQUQrQix3QkFDL0JBLGdCQUQrQjtBQUFBLFlBQ2JFLFFBRGEsd0JBQ2JBLFFBRGE7QUFFdkMsWUFBTW1DLEdBQUcsR0FBRyxLQUFLN0MsZ0JBQWpCOztBQUNBLFlBQUk2QyxHQUFHLElBQUksQ0FBWCxFQUFjO0FBQUU7QUFDWixjQUFNQyxJQUFJLEdBQUcsS0FBS0MsbUJBQUwsQ0FBeUJDLElBQXpCLENBQThCSCxHQUE5QixFQUFtQ0MsSUFBaEQ7QUFDQUEsVUFBQUEsSUFBSSxDQUFDLENBQUQsQ0FBSixHQUFVcEMsUUFBUSxDQUFDMkIsSUFBVCxDQUFjLENBQWQsQ0FBVjtBQUNBUyxVQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVV0QyxnQkFBZ0IsQ0FBQyxDQUFELENBQTFCO0FBQ0FzQyxVQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVV0QyxnQkFBZ0IsQ0FBQyxDQUFELENBQTFCO0FBQ0g7QUFDSjs7OztJQXJKbUNvRixzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiAgbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuICBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgQW5pbWF0aW9uQ2xpcCB9IGZyb20gJy4uLy4uL2FuaW1hdGlvbi9hbmltYXRpb24tY2xpcCc7XHJcbmltcG9ydCB7IE1lc2ggfSBmcm9tICcuLi8uLi9hc3NldHMvbWVzaCc7XHJcbmltcG9ydCB7IFNrZWxldG9uIH0gZnJvbSAnLi4vLi4vYXNzZXRzL3NrZWxldG9uJztcclxuaW1wb3J0IHsgYWFiYiB9IGZyb20gJy4uLy4uL2dlb21ldHJ5JztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyLCBHRlhCdWZmZXJJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4L2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhNZW1vcnlVc2FnZUJpdCB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IElOU1RfSk9JTlRfQU5JTV9JTkZPLCBVQk9Ta2lubmluZ0FuaW1hdGlvbiwgVUJPU2tpbm5pbmdUZXh0dXJlLCBVTklGT1JNX0pPSU5UX1RFWFRVUkVfQklORElORyB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IE5vZGUgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaCc7XHJcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi9jb3JlL3Bhc3MnO1xyXG5pbXBvcnQgeyBzYW1wbGVyTGliIH0gZnJvbSAnLi4vY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCB7IERhdGFQb29sTWFuYWdlciB9IGZyb20gJy4uL2RhdGEtcG9vbC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgTW9kZWxUeXBlIH0gZnJvbSAnLi4vc2NlbmUvbW9kZWwnO1xyXG5pbXBvcnQgeyBJQW5pbUluZm8sIElKb2ludFRleHR1cmVIYW5kbGUsIGpvaW50VGV4dHVyZVNhbXBsZXJIYXNoIH0gZnJvbSAnLi9za2VsZXRhbC1hbmltYXRpb24tdXRpbHMnO1xyXG5pbXBvcnQgeyBNb3JwaE1vZGVsIH0gZnJvbSAnLi9tb3JwaC1tb2RlbCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUsIEdGWERlc2NyaXB0b3JTZXQgfSBmcm9tICcuLi8uLi9nZngnO1xyXG5cclxuaW50ZXJmYWNlIElKb2ludHNJbmZvIHtcclxuICAgIGJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbDtcclxuICAgIGpvaW50VGV4dHVyZUluZm86IEZsb2F0MzJBcnJheTtcclxuICAgIHRleHR1cmU6IElKb2ludFRleHR1cmVIYW5kbGUgfCBudWxsO1xyXG4gICAgYW5pbUluZm86IElBbmltSW5mbztcclxuICAgIGJvdW5kc0luZm86IGFhYmJbXSB8IG51bGw7XHJcbn1cclxuXHJcbmNvbnN0IG15UGF0Y2hlcyA9IFtcclxuICAgIHsgbmFtZTogJ0NDX1VTRV9TS0lOTklORycsIHZhbHVlOiB0cnVlIH0sXHJcbiAgICB7IG5hbWU6ICdDQ19VU0VfQkFLRURfQU5JTUFUSU9OJywgdmFsdWU6IHRydWUgfSxcclxuXTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhlIHNraW5uaW5nIG1vZGVsIHRoYXQgaXMgdXNpbmcgYmFrZWQgYW5pbWF0aW9uLlxyXG4gKiBAemhcclxuICog6aKE54OY54SZ5Yqo55S755qE6JKZ55qu5qih5Z6L44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQmFrZWRTa2lubmluZ01vZGVsIGV4dGVuZHMgTW9ycGhNb2RlbCB7XHJcblxyXG4gICAgcHVibGljIHVwbG9hZGVkQW5pbTogQW5pbWF0aW9uQ2xpcCB8IG51bGwgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7IC8vIHVuaW5pdGlhbGl6ZWRcclxuXHJcbiAgICBwcml2YXRlIF9qb2ludHNNZWRpdW06IElKb2ludHNJbmZvO1xyXG5cclxuICAgIHByaXZhdGUgX3NrZWxldG9uOiBTa2VsZXRvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfbWVzaDogTWVzaCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfZGF0YVBvb2xNYW5hZ2VyOiBEYXRhUG9vbE1hbmFnZXI7XHJcbiAgICBwcml2YXRlIF9pbnN0QW5pbUluZm9JZHggPSAtMTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnR5cGUgPSBNb2RlbFR5cGUuQkFLRURfU0tJTk5JTkc7XHJcbiAgICAgICAgdGhpcy5fZGF0YVBvb2xNYW5hZ2VyID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kYXRhUG9vbE1hbmFnZXI7XHJcbiAgICAgICAgY29uc3Qgam9pbnRUZXh0dXJlSW5mbyA9IG5ldyBGbG9hdDMyQXJyYXkoNCk7XHJcbiAgICAgICAgY29uc3QgYW5pbUluZm8gPSB0aGlzLl9kYXRhUG9vbE1hbmFnZXIuam9pbnRBbmltYXRpb25JbmZvLmdldERhdGEoKTtcclxuICAgICAgICB0aGlzLl9qb2ludHNNZWRpdW0gPSB7IGJ1ZmZlcjogbnVsbCwgam9pbnRUZXh0dXJlSW5mbywgYW5pbUluZm8sIHRleHR1cmU6IG51bGwsIGJvdW5kc0luZm86IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy51cGxvYWRlZEFuaW0gPSB1bmRlZmluZWQ7IC8vIHVuaW5pdGlhbGl6ZWRcclxuICAgICAgICB0aGlzLl9qb2ludHNNZWRpdW0uYm91bmRzSW5mbyA9IG51bGw7XHJcbiAgICAgICAgaWYgKHRoaXMuX2pvaW50c01lZGl1bS5idWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fam9pbnRzTWVkaXVtLmJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2pvaW50c01lZGl1bS5idWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9hcHBseUpvaW50VGV4dHVyZSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmluZFNrZWxldG9uIChza2VsZXRvbjogU2tlbGV0b24gfCBudWxsID0gbnVsbCwgc2tpbm5pbmdSb290OiBOb2RlIHwgbnVsbCA9IG51bGwsIG1lc2g6IE1lc2ggfCBudWxsID0gbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX3NrZWxldG9uID0gc2tlbGV0b247XHJcbiAgICAgICAgdGhpcy5fbWVzaCA9IG1lc2g7XHJcbiAgICAgICAgaWYgKCFza2VsZXRvbiB8fCAhc2tpbm5pbmdSb290IHx8ICFtZXNoKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtID0gc2tpbm5pbmdSb290O1xyXG4gICAgICAgIGNvbnN0IHJlc01nciA9IHRoaXMuX2RhdGFQb29sTWFuYWdlcjtcclxuICAgICAgICB0aGlzLl9qb2ludHNNZWRpdW0uYW5pbUluZm8gPSByZXNNZ3Iuam9pbnRBbmltYXRpb25JbmZvLmdldERhdGEoc2tpbm5pbmdSb290LnV1aWQpO1xyXG4gICAgICAgIGlmICghdGhpcy5fam9pbnRzTWVkaXVtLmJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9qb2ludHNNZWRpdW0uYnVmZmVyID0gdGhpcy5fZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgICAgIEdGWEJ1ZmZlclVzYWdlQml0LlVOSUZPUk0gfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICAgICAgVUJPU2tpbm5pbmdUZXh0dXJlLlNJWkUsXHJcbiAgICAgICAgICAgICAgICBVQk9Ta2lubmluZ1RleHR1cmUuU0laRSxcclxuICAgICAgICAgICAgKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVUcmFuc2Zvcm0gKHN0YW1wOiBudW1iZXIpIHtcclxuICAgICAgICBzdXBlci51cGRhdGVUcmFuc2Zvcm0oc3RhbXApO1xyXG4gICAgICAgIGlmICghdGhpcy51cGxvYWRlZEFuaW0pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgeyBhbmltSW5mbywgYm91bmRzSW5mbyB9ID0gdGhpcy5fam9pbnRzTWVkaXVtO1xyXG4gICAgICAgIGNvbnN0IHNrZWxCb3VuZCA9IGJvdW5kc0luZm8hW2FuaW1JbmZvLmRhdGFbMF1dO1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyYW5zZm9ybTtcclxuICAgICAgICBpZiAodGhpcy5fd29ybGRCb3VuZHMgJiYgc2tlbEJvdW5kKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmUgVFMyMzM5XHJcbiAgICAgICAgICAgIHNrZWxCb3VuZC50cmFuc2Zvcm0obm9kZS5fbWF0LCBub2RlLl9wb3MsIG5vZGUuX3JvdCwgbm9kZS5fc2NhbGUsIHRoaXMuX3dvcmxkQm91bmRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGZpZCBidWZmZXIgb25seSB3aGVuIHZpc2libGVcclxuICAgIHB1YmxpYyB1cGRhdGVVQk9zIChzdGFtcDogbnVtYmVyKSB7XHJcbiAgICAgICAgc3VwZXIudXBkYXRlVUJPcyhzdGFtcCk7XHJcbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuX2pvaW50c01lZGl1bS5hbmltSW5mbztcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9pbnN0QW5pbUluZm9JZHg7XHJcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmluc3RhbmNlZEF0dHJpYnV0ZXMubGlzdFtpZHhdLnZpZXc7XHJcbiAgICAgICAgICAgIHZpZXdbMF0gPSBpbmZvLmRhdGFbMF07XHJcbiAgICAgICAgfSBlbHNlIGlmIChpbmZvLmRpcnR5KSB7XHJcbiAgICAgICAgICAgIGluZm8uYnVmZmVyLnVwZGF0ZShpbmZvLmRhdGEpO1xyXG4gICAgICAgICAgICBpbmZvLmRpcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVCb3VuZGluZ1NoYXBlIChtaW5Qb3M/OiBWZWMzLCBtYXhQb3M/OiBWZWMzKSB7XHJcbiAgICAgICAgaWYgKCFtaW5Qb3MgfHwgIW1heFBvcykgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl93b3JsZEJvdW5kcyA9IG5ldyBhYWJiKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwbG9hZEFuaW1hdGlvbiAoYW5pbTogQW5pbWF0aW9uQ2xpcCB8IG51bGwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3NrZWxldG9uIHx8ICF0aGlzLl9tZXNoIHx8IHRoaXMudXBsb2FkZWRBbmltID09PSBhbmltKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMudXBsb2FkZWRBbmltID0gYW5pbTtcclxuICAgICAgICBjb25zdCByZXNNZ3IgPSB0aGlzLl9kYXRhUG9vbE1hbmFnZXI7XHJcbiAgICAgICAgbGV0IHRleHR1cmU6IElKb2ludFRleHR1cmVIYW5kbGUgfCBudWxsID0gbnVsbDtcclxuICAgICAgICBpZiAoYW5pbSkge1xyXG4gICAgICAgICAgICB0ZXh0dXJlID0gcmVzTWdyLmpvaW50VGV4dHVyZVBvb2wuZ2V0U2VxdWVuY2VQb3NlVGV4dHVyZSh0aGlzLl9za2VsZXRvbiwgYW5pbSwgdGhpcy5fbWVzaCwgdGhpcy50cmFuc2Zvcm0hKTtcclxuICAgICAgICAgICAgdGhpcy5fam9pbnRzTWVkaXVtLmJvdW5kc0luZm8gPSB0ZXh0dXJlICYmIHRleHR1cmUuYm91bmRzLmdldCh0aGlzLl9tZXNoLmhhc2gpITtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWxCb3VuZHMgPSBudWxsOyAvLyBkb24ndCBjYWxjIGJvdW5kcyBhZ2FpbiBpbiBNb2RlbFxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRleHR1cmUgPSByZXNNZ3Iuam9pbnRUZXh0dXJlUG9vbC5nZXREZWZhdWx0UG9zZVRleHR1cmUodGhpcy5fc2tlbGV0b24sIHRoaXMuX21lc2gsIHRoaXMudHJhbnNmb3JtISk7XHJcbiAgICAgICAgICAgIHRoaXMuX2pvaW50c01lZGl1bS5ib3VuZHNJbmZvID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWxCb3VuZHMgPSB0ZXh0dXJlICYmIHRleHR1cmUuYm91bmRzLmdldCh0aGlzLl9tZXNoLmhhc2gpIVswXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXBwbHlKb2ludFRleHR1cmUodGV4dHVyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9hcHBseUpvaW50VGV4dHVyZSAodGV4dHVyZTogSUpvaW50VGV4dHVyZUhhbmRsZSB8IG51bGwgPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3Qgb2xkVGV4ID0gdGhpcy5fam9pbnRzTWVkaXVtLnRleHR1cmU7XHJcbiAgICAgICAgaWYgKG9sZFRleCAmJiBvbGRUZXggIT09IHRleHR1cmUpIHsgdGhpcy5fZGF0YVBvb2xNYW5hZ2VyLmpvaW50VGV4dHVyZVBvb2wucmVsZWFzZUhhbmRsZShvbGRUZXgpOyB9XHJcbiAgICAgICAgdGhpcy5fam9pbnRzTWVkaXVtLnRleHR1cmUgPSB0ZXh0dXJlO1xyXG4gICAgICAgIGlmICghdGV4dHVyZSkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCB7IGJ1ZmZlciwgam9pbnRUZXh0dXJlSW5mbyB9ID0gdGhpcy5fam9pbnRzTWVkaXVtO1xyXG4gICAgICAgIGpvaW50VGV4dHVyZUluZm9bMF0gPSB0ZXh0dXJlLmhhbmRsZS50ZXh0dXJlLndpZHRoO1xyXG4gICAgICAgIGpvaW50VGV4dHVyZUluZm9bMV0gPSB0aGlzLl9za2VsZXRvbiEuam9pbnRzLmxlbmd0aDtcclxuICAgICAgICBqb2ludFRleHR1cmVJbmZvWzJdID0gdGV4dHVyZS5waXhlbE9mZnNldCArIDAuMTsgLy8gZ3VhcmQgYWdhaW5zdCBmbG9vcigpIHVuZGVyZmxvd1xyXG4gICAgICAgIGpvaW50VGV4dHVyZUluZm9bM10gPSAxIC8gam9pbnRUZXh0dXJlSW5mb1swXTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUluc3RhbmNlZEpvaW50VGV4dHVyZUluZm8oKTtcclxuICAgICAgICBpZiAoYnVmZmVyKSB7IGJ1ZmZlci51cGRhdGUoam9pbnRUZXh0dXJlSW5mbyk7IH1cclxuICAgICAgICBjb25zdCB0ZXggPSB0ZXh0dXJlLmhhbmRsZS50ZXh0dXJlO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3N1Yk1vZGVscy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yU2V0ID0gdGhpcy5fc3ViTW9kZWxzW2ldLmRlc2NyaXB0b3JTZXQ7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZFRleHR1cmUoVU5JRk9STV9KT0lOVF9URVhUVVJFX0JJTkRJTkcsIHRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNYWNyb1BhdGNoZXMgKHN1Yk1vZGVsSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBhdGNoZXMgPSBzdXBlci5nZXRNYWNyb1BhdGNoZXMoc3ViTW9kZWxJbmRleCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGNoZXMgPyBwYXRjaGVzLmNvbmNhdChteVBhdGNoZXMpIDogbXlQYXRjaGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlTG9jYWxEZXNjcmlwdG9ycyAoc3VibW9kZWxJZHg6IG51bWJlciwgZGVzY3JpcHRvclNldDogR0ZYRGVzY3JpcHRvclNldCkge1xyXG4gICAgICAgIHN1cGVyLl91cGRhdGVMb2NhbERlc2NyaXB0b3JzKHN1Ym1vZGVsSWR4LCBkZXNjcmlwdG9yU2V0KTtcclxuICAgICAgICBjb25zdCB7IGJ1ZmZlciwgdGV4dHVyZSwgYW5pbUluZm8gfSA9IHRoaXMuX2pvaW50c01lZGl1bTtcclxuICAgICAgICBkZXNjcmlwdG9yU2V0LmJpbmRCdWZmZXIoVUJPU2tpbm5pbmdUZXh0dXJlLkJJTkRJTkcsIGJ1ZmZlciEpO1xyXG4gICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9Ta2lubmluZ0FuaW1hdGlvbi5CSU5ESU5HLCBhbmltSW5mby5idWZmZXIpO1xyXG4gICAgICAgIGlmICh0ZXh0dXJlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIodGhpcy5fZGV2aWNlLCBqb2ludFRleHR1cmVTYW1wbGVySGFzaCk7XHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZFRleHR1cmUoVU5JRk9STV9KT0lOVF9URVhUVVJFX0JJTkRJTkcsIHRleHR1cmUuaGFuZGxlLnRleHR1cmUpO1xyXG4gICAgICAgICAgICBkZXNjcmlwdG9yU2V0LmJpbmRTYW1wbGVyKFVOSUZPUk1fSk9JTlRfVEVYVFVSRV9CSU5ESU5HLCBzYW1wbGVyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVJbnN0YW5jZWRBdHRyaWJ1dGVzIChhdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSwgcGFzczogUGFzcykge1xyXG4gICAgICAgIHN1cGVyLl91cGRhdGVJbnN0YW5jZWRBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIHBhc3MpO1xyXG4gICAgICAgIHRoaXMuX2luc3RBbmltSW5mb0lkeCA9IHRoaXMuX2dldEluc3RhbmNlZEF0dHJpYnV0ZUluZGV4KElOU1RfSk9JTlRfQU5JTV9JTkZPKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUluc3RhbmNlZEpvaW50VGV4dHVyZUluZm8oKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUluc3RhbmNlZEpvaW50VGV4dHVyZUluZm8gKCkge1xyXG4gICAgICAgIGNvbnN0IHsgam9pbnRUZXh0dXJlSW5mbywgYW5pbUluZm8gfSA9IHRoaXMuX2pvaW50c01lZGl1bTtcclxuICAgICAgICBjb25zdCBpZHggPSB0aGlzLl9pbnN0QW5pbUluZm9JZHg7XHJcbiAgICAgICAgaWYgKGlkeCA+PSAwKSB7IC8vIHVwZGF0ZSBpbnN0YW5jaW5nIGRhdGEgdG9vXHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmluc3RhbmNlZEF0dHJpYnV0ZXMubGlzdFtpZHhdLnZpZXc7XHJcbiAgICAgICAgICAgIHZpZXdbMF0gPSBhbmltSW5mby5kYXRhWzBdO1xyXG4gICAgICAgICAgICB2aWV3WzFdID0gam9pbnRUZXh0dXJlSW5mb1sxXTtcclxuICAgICAgICAgICAgdmlld1syXSA9IGpvaW50VGV4dHVyZUluZm9bMl07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==