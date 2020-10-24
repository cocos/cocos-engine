(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../3d/builtin/init.js", "../../geometry/index.js", "../../gfx/buffer.js", "../../memop/index.js", "../../scene-graph/layers.js", "./submodel.js", "../../global-exports.js", "../../pipeline/index.js", "../core/pass.js", "../../math/index.js", "../../gfx/device.js", "../core/sampler-lib.js", "../core/memory-pools.js", "../../pipeline/define.js", "../../gfx/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../3d/builtin/init.js"), require("../../geometry/index.js"), require("../../gfx/buffer.js"), require("../../memop/index.js"), require("../../scene-graph/layers.js"), require("./submodel.js"), require("../../global-exports.js"), require("../../pipeline/index.js"), require("../core/pass.js"), require("../../math/index.js"), require("../../gfx/device.js"), require("../core/sampler-lib.js"), require("../core/memory-pools.js"), require("../../pipeline/define.js"), require("../../gfx/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.init, global.index, global.buffer, global.index, global.layers, global.submodel, global.globalExports, global.index, global.pass, global.index, global.device, global.samplerLib, global.memoryPools, global.define, global.define);
    global.model = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _init, _index, _buffer, _index2, _layers, _submodel, _globalExports, _index3, _pass, _index4, _device, _samplerLib, _memoryPools, _define, _define2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Model = _exports.ModelType = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var m4_1 = new _index4.Mat4();

  var _subModelPool = new _index2.Pool(function () {
    return new _submodel.SubModel();
  }, 32);

  var ModelType;
  _exports.ModelType = ModelType;

  (function (ModelType) {
    ModelType[ModelType["DEFAULT"] = 0] = "DEFAULT";
    ModelType[ModelType["SKINNING"] = 1] = "SKINNING";
    ModelType[ModelType["BAKED_SKINNING"] = 2] = "BAKED_SKINNING";
    ModelType[ModelType["UI_BATCH"] = 3] = "UI_BATCH";
    ModelType[ModelType["PARTICLE_BATCH"] = 4] = "PARTICLE_BATCH";
    ModelType[ModelType["LINE"] = 5] = "LINE";
  })(ModelType || (_exports.ModelType = ModelType = {}));

  function uploadMat4AsVec4x3(mat, v1, v2, v3) {
    v1[0] = mat.m00;
    v1[1] = mat.m01;
    v1[2] = mat.m02;
    v1[3] = mat.m12;
    v2[0] = mat.m04;
    v2[1] = mat.m05;
    v2[2] = mat.m06;
    v2[3] = mat.m13;
    v3[0] = mat.m08;
    v3[1] = mat.m09;
    v3[2] = mat.m10;
    v3[3] = mat.m14;
  }

  var lightmapSamplerHash = (0, _samplerLib.genSamplerHash)([_define2.GFXFilter.LINEAR, _define2.GFXFilter.LINEAR, _define2.GFXFilter.NONE, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP]);
  var lightmapSamplerWithMipHash = (0, _samplerLib.genSamplerHash)([_define2.GFXFilter.LINEAR, _define2.GFXFilter.LINEAR, _define2.GFXFilter.LINEAR, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP]);
  /**
   * A representation of a model
   */

  var Model = /*#__PURE__*/function () {
    _createClass(Model, [{
      key: "subModels",
      get: function get() {
        return this._subModels;
      }
    }, {
      key: "inited",
      get: function get() {
        return this._inited;
      }
    }, {
      key: "worldBounds",
      get: function get() {
        return this._worldBounds;
      }
    }, {
      key: "modelBounds",
      get: function get() {
        return this._modelBounds;
      }
    }, {
      key: "localBuffer",
      get: function get() {
        return this._localBuffer;
      }
    }, {
      key: "updateStamp",
      get: function get() {
        return this._updateStamp;
      }
    }, {
      key: "isInstancingEnabled",
      get: function get() {
        return this._instMatWorldIdx >= 0;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._poolHandle;
      }
    }, {
      key: "node",
      get: function get() {
        return this._node;
      },
      set: function set(n) {
        this._node = n;

        _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.NODE, n.handle);
      }
    }, {
      key: "transform",
      get: function get() {
        return this._transform;
      },
      set: function set(n) {
        this._transform = n;

        _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.TRANSFORM, n.handle);
      }
    }, {
      key: "visFlags",
      get: function get() {
        return _memoryPools.ModelPool.get(this._poolHandle, _memoryPools.ModelView.VIS_FLAGS);
      },
      set: function set(val) {
        _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.VIS_FLAGS, val);
      }
    }, {
      key: "enabled",
      get: function get() {
        return _memoryPools.ModelPool.get(this._poolHandle, _memoryPools.ModelView.ENABLED) === 1 ? true : false;
      },
      set: function set(val) {
        _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.ENABLED, val ? 1 : 0);
      }
    }]);

    /**
     * Setup a default empty model
     */
    function Model() {
      _classCallCheck(this, Model);

      this.type = ModelType.DEFAULT;
      this.scene = null;
      this.castShadow = false;
      this.receiveShadow = true;
      this.isDynamicBatching = false;
      this.instancedAttributes = {
        buffer: null,
        list: []
      };
      this._worldBounds = null;
      this._modelBounds = null;
      this._subModels = [];
      this._node = null;
      this._transform = null;
      this._device = void 0;
      this._inited = false;
      this._descriptorSetCount = 1;
      this._updateStamp = -1;
      this._transformUpdated = true;
      this._subModelArrayHandle = _memoryPools.NULL_HANDLE;
      this._poolHandle = _memoryPools.NULL_HANDLE;
      this._worldBoundsHandle = _memoryPools.NULL_HANDLE;
      this._localData = new Float32Array(_define.UBOLocal.COUNT);
      this._localBuffer = null;
      this._instMatWorldIdx = -1;
      this._lightmap = null;
      this._lightmapUVParam = new _index4.Vec4();
      this._device = _globalExports.legacyCC.director.root.device;
    }

    _createClass(Model, [{
      key: "initialize",
      value: function initialize() {
        if (!this._inited) {
          this._poolHandle = _memoryPools.ModelPool.alloc();
          this._subModelArrayHandle = _memoryPools.SubModelArrayPool.alloc();

          _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.SUB_MODEL_ARRAY, this._subModelArrayHandle);

          _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.VIS_FLAGS, _layers.Layers.Enum.NONE);

          _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.ENABLED, 1);

          this._inited = true;
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        var subModels = this._subModels;

        for (var i = 0; i < subModels.length; i++) {
          var subModel = this._subModels[i];
          subModel.destroy();

          _subModelPool.free(subModel);
        }

        if (this._localBuffer) {
          this._localBuffer.destroy();

          this._localBuffer = null;
        }

        this._worldBounds = null;
        this._modelBounds = null;
        this._subModels.length = 0;
        this._inited = false;
        this._transformUpdated = true;
        this.isDynamicBatching = false;

        if (this._poolHandle) {
          _memoryPools.ModelPool.free(this._poolHandle);

          this._poolHandle = _memoryPools.NULL_HANDLE;

          _memoryPools.SubModelArrayPool.free(this._subModelArrayHandle);

          this._subModelArrayHandle = _memoryPools.NULL_HANDLE;
        }

        if (this._worldBoundsHandle) {
          _memoryPools.AABBPool.free(this._worldBoundsHandle);

          this._worldBoundsHandle = _memoryPools.NULL_HANDLE;
        }
      }
    }, {
      key: "attachToScene",
      value: function attachToScene(scene) {
        this.scene = scene;
      }
    }, {
      key: "detachFromScene",
      value: function detachFromScene() {
        this.scene = null;
      }
    }, {
      key: "updateTransform",
      value: function updateTransform(stamp) {
        var node = this.transform; // @ts-ignore TS2445

        if (node.hasChangedFlags || node._dirtyFlags) {
          node.updateWorldTransform();
          this._transformUpdated = true;
          var worldBounds = this._worldBounds;

          if (this._modelBounds && worldBounds) {
            // @ts-ignore TS2445
            this._modelBounds.transform(node._mat, node._pos, node._rot, node._scale, worldBounds);

            _memoryPools.AABBPool.setVec3(this._worldBoundsHandle, _memoryPools.AABBView.CENTER, worldBounds.center);

            _memoryPools.AABBPool.setVec3(this._worldBoundsHandle, _memoryPools.AABBView.HALF_EXTENSION, worldBounds.halfExtents);
          }
        }
      }
    }, {
      key: "updateUBOs",
      value: function updateUBOs(stamp) {
        var subModels = this._subModels;

        for (var i = 0; i < subModels.length; i++) {
          subModels[i].update();
        }

        this._updateStamp = stamp;

        if (!this._transformUpdated) {
          return;
        }

        this._transformUpdated = false; // @ts-ignore

        var worldMatrix = this.transform._mat;
        var idx = this._instMatWorldIdx;

        if (idx >= 0) {
          var attrs = this.instancedAttributes.list;
          uploadMat4AsVec4x3(worldMatrix, attrs[idx].view, attrs[idx + 1].view, attrs[idx + 2].view);
        } else {
          _index4.Mat4.toArray(this._localData, worldMatrix, _define.UBOLocal.MAT_WORLD_OFFSET);

          _index4.Mat4.inverseTranspose(m4_1, worldMatrix);

          _index4.Mat4.toArray(this._localData, m4_1, _define.UBOLocal.MAT_WORLD_IT_OFFSET);

          this._localBuffer.update(this._localData);
        }
      }
      /**
       * Create the bounding shape of this model
       * @param minPos the min position of the model
       * @param maxPos the max position of the model
       */

    }, {
      key: "createBoundingShape",
      value: function createBoundingShape(minPos, maxPos) {
        if (!minPos || !maxPos) {
          return;
        }

        this._modelBounds = _index.aabb.fromPoints(_index.aabb.create(), minPos, maxPos);
        this._worldBounds = _index.aabb.clone(this._modelBounds);

        if (this._worldBoundsHandle === _memoryPools.NULL_HANDLE) {
          this._worldBoundsHandle = _memoryPools.AABBPool.alloc();

          _memoryPools.ModelPool.set(this._poolHandle, _memoryPools.ModelView.WORLD_BOUNDS, this._worldBoundsHandle);
        }

        _memoryPools.AABBPool.setVec3(this._worldBoundsHandle, _memoryPools.AABBView.CENTER, this._worldBounds.center);

        _memoryPools.AABBPool.setVec3(this._worldBoundsHandle, _memoryPools.AABBView.HALF_EXTENSION, this._worldBounds.halfExtents);
      }
    }, {
      key: "initSubModel",
      value: function initSubModel(idx, subMeshData, mat) {
        this.initialize();
        var isNewSubModel = false;

        if (this._subModels[idx] == null) {
          this._subModels[idx] = _subModelPool.alloc();
          isNewSubModel = true;
        } else {
          this._subModels[idx].destroy();
        }

        this._subModels[idx].initialize(subMeshData, mat.passes, this.getMacroPatches(idx));

        this._updateAttributesAndBinding(idx);

        if (isNewSubModel) {
          _memoryPools.SubModelArrayPool.assign(this._subModelArrayHandle, idx, this._subModels[idx].handle);
        }
      }
    }, {
      key: "setSubModelMesh",
      value: function setSubModelMesh(idx, subMesh) {
        if (!this._subModels[idx]) {
          return;
        }

        this._subModels[idx].subMesh = subMesh;
      }
    }, {
      key: "setSubModelMaterial",
      value: function setSubModelMaterial(idx, mat) {
        if (!this._subModels[idx]) {
          return;
        }

        this._subModels[idx].passes = mat.passes;

        this._updateAttributesAndBinding(idx);
      }
    }, {
      key: "onGlobalPipelineStateChanged",
      value: function onGlobalPipelineStateChanged() {
        var subModels = this._subModels;

        for (var i = 0; i < subModels.length; i++) {
          subModels[i].onPipelineStateChanged();
        }
      }
    }, {
      key: "updateLightingmap",
      value: function updateLightingmap(texture, uvParam) {
        _index4.Vec4.toArray(this._localData, uvParam, _define.UBOLocal.LIGHTINGMAP_UVPARAM);

        this._lightmap = texture;
        this._lightmapUVParam = uvParam;

        if (texture === null) {
          texture = _init.builtinResMgr.get('empty-texture');
        }

        var gfxTexture = texture.getGFXTexture();

        if (gfxTexture !== null) {
          var sampler = _samplerLib.samplerLib.getSampler(this._device, texture.mipmaps.length > 1 ? lightmapSamplerWithMipHash : lightmapSamplerHash);

          var subModels = this._subModels;

          for (var i = 0; i < subModels.length; i++) {
            var descriptorSet = subModels[i].descriptorSet;
            descriptorSet.bindTexture(_define.UNIFORM_LIGHTMAP_TEXTURE_BINDING, gfxTexture);
            descriptorSet.bindSampler(_define.UNIFORM_LIGHTMAP_TEXTURE_BINDING, sampler);
            descriptorSet.update();
          }
        }
      }
    }, {
      key: "getMacroPatches",
      value: function getMacroPatches(subModelIndex) {
        return undefined;
      }
    }, {
      key: "_updateAttributesAndBinding",
      value: function _updateAttributesAndBinding(subModelIndex) {
        var subModel = this._subModels[subModelIndex];

        if (!subModel) {
          return;
        }

        this._initLocalDescriptors(subModelIndex);

        this._updateLocalDescriptors(subModelIndex, subModel.descriptorSet);

        var shader = _memoryPools.ShaderPool.get(_memoryPools.SubModelPool.get(subModel.handle, _memoryPools.SubModelView.SHADER_0));

        this._updateInstancedAttributes(shader.attributes, subModel.passes[0]);
      }
    }, {
      key: "_getInstancedAttributeIndex",
      value: function _getInstancedAttributeIndex(name) {
        var list = this.instancedAttributes.list;

        for (var i = 0; i < list.length; i++) {
          if (list[i].name === name) {
            return i;
          }
        }

        return -1;
      } // sub-classes can override the following functions if needed
      // for now no submodel level instancing attributes

    }, {
      key: "_updateInstancedAttributes",
      value: function _updateInstancedAttributes(attributes, pass) {
        if (!pass.device.hasFeature(_device.GFXFeature.INSTANCED_ARRAYS)) {
          return;
        }

        var size = 0;

        for (var j = 0; j < attributes.length; j++) {
          var attribute = attributes[j];

          if (!attribute.isInstanced) {
            continue;
          }

          size += _define2.GFXFormatInfos[attribute.format].size;
        }

        var attrs = this.instancedAttributes;
        attrs.buffer = new Uint8Array(size);
        attrs.list.length = 0;
        var offset = 0;
        var buffer = attrs.buffer.buffer;

        for (var _j = 0; _j < attributes.length; _j++) {
          var _attribute = attributes[_j];

          if (!_attribute.isInstanced) {
            continue;
          }

          var format = _attribute.format;
          var info = _define2.GFXFormatInfos[format];
          var view = new ((0, _define2.getTypedArrayConstructor)(info))(buffer, offset, info.count);
          var isNormalized = _attribute.isNormalized;
          offset += info.size;
          attrs.list.push({
            name: _attribute.name,
            format: format,
            isNormalized: isNormalized,
            view: view
          });
        }

        if (pass.batchingScheme === _pass.BatchingSchemes.INSTANCING) {
          _index3.InstancedBuffer.get(pass).destroy();
        } // instancing IA changed


        this._instMatWorldIdx = this._getInstancedAttributeIndex(_define.INST_MAT_WORLD);
        this._transformUpdated = true;
      }
    }, {
      key: "_initLocalDescriptors",
      value: function _initLocalDescriptors(subModelIndex) {
        if (!this._localBuffer) {
          this._localBuffer = this._device.createBuffer(new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.UNIFORM | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, _define.UBOLocal.SIZE, _define.UBOLocal.SIZE));
        }
      }
    }, {
      key: "_updateLocalDescriptors",
      value: function _updateLocalDescriptors(submodelIdx, descriptorSet) {
        descriptorSet.bindBuffer(_define.UBOLocal.BINDING, this._localBuffer);
      }
    }]);

    return Model;
  }();

  _exports.Model = Model;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvbW9kZWwudHMiXSwibmFtZXMiOlsibTRfMSIsIk1hdDQiLCJfc3ViTW9kZWxQb29sIiwiUG9vbCIsIlN1Yk1vZGVsIiwiTW9kZWxUeXBlIiwidXBsb2FkTWF0NEFzVmVjNHgzIiwibWF0IiwidjEiLCJ2MiIsInYzIiwibTAwIiwibTAxIiwibTAyIiwibTEyIiwibTA0IiwibTA1IiwibTA2IiwibTEzIiwibTA4IiwibTA5IiwibTEwIiwibTE0IiwibGlnaHRtYXBTYW1wbGVySGFzaCIsIkdGWEZpbHRlciIsIkxJTkVBUiIsIk5PTkUiLCJHRlhBZGRyZXNzIiwiQ0xBTVAiLCJsaWdodG1hcFNhbXBsZXJXaXRoTWlwSGFzaCIsIk1vZGVsIiwiX3N1Yk1vZGVscyIsIl9pbml0ZWQiLCJfd29ybGRCb3VuZHMiLCJfbW9kZWxCb3VuZHMiLCJfbG9jYWxCdWZmZXIiLCJfdXBkYXRlU3RhbXAiLCJfaW5zdE1hdFdvcmxkSWR4IiwiX3Bvb2xIYW5kbGUiLCJfbm9kZSIsIm4iLCJNb2RlbFBvb2wiLCJzZXQiLCJNb2RlbFZpZXciLCJOT0RFIiwiaGFuZGxlIiwiX3RyYW5zZm9ybSIsIlRSQU5TRk9STSIsImdldCIsIlZJU19GTEFHUyIsInZhbCIsIkVOQUJMRUQiLCJ0eXBlIiwiREVGQVVMVCIsInNjZW5lIiwiY2FzdFNoYWRvdyIsInJlY2VpdmVTaGFkb3ciLCJpc0R5bmFtaWNCYXRjaGluZyIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJidWZmZXIiLCJsaXN0IiwiX2RldmljZSIsIl9kZXNjcmlwdG9yU2V0Q291bnQiLCJfdHJhbnNmb3JtVXBkYXRlZCIsIl9zdWJNb2RlbEFycmF5SGFuZGxlIiwiTlVMTF9IQU5ETEUiLCJfd29ybGRCb3VuZHNIYW5kbGUiLCJfbG9jYWxEYXRhIiwiRmxvYXQzMkFycmF5IiwiVUJPTG9jYWwiLCJDT1VOVCIsIl9saWdodG1hcCIsIl9saWdodG1hcFVWUGFyYW0iLCJWZWM0IiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkZXZpY2UiLCJhbGxvYyIsIlN1Yk1vZGVsQXJyYXlQb29sIiwiU1VCX01PREVMX0FSUkFZIiwiTGF5ZXJzIiwiRW51bSIsInN1Yk1vZGVscyIsImkiLCJsZW5ndGgiLCJzdWJNb2RlbCIsImRlc3Ryb3kiLCJmcmVlIiwiQUFCQlBvb2wiLCJzdGFtcCIsIm5vZGUiLCJ0cmFuc2Zvcm0iLCJoYXNDaGFuZ2VkRmxhZ3MiLCJfZGlydHlGbGFncyIsInVwZGF0ZVdvcmxkVHJhbnNmb3JtIiwid29ybGRCb3VuZHMiLCJfbWF0IiwiX3BvcyIsIl9yb3QiLCJfc2NhbGUiLCJzZXRWZWMzIiwiQUFCQlZpZXciLCJDRU5URVIiLCJjZW50ZXIiLCJIQUxGX0VYVEVOU0lPTiIsImhhbGZFeHRlbnRzIiwidXBkYXRlIiwid29ybGRNYXRyaXgiLCJpZHgiLCJhdHRycyIsInZpZXciLCJ0b0FycmF5IiwiTUFUX1dPUkxEX09GRlNFVCIsImludmVyc2VUcmFuc3Bvc2UiLCJNQVRfV09STERfSVRfT0ZGU0VUIiwibWluUG9zIiwibWF4UG9zIiwiYWFiYiIsImZyb21Qb2ludHMiLCJjcmVhdGUiLCJjbG9uZSIsIldPUkxEX0JPVU5EUyIsInN1Yk1lc2hEYXRhIiwiaW5pdGlhbGl6ZSIsImlzTmV3U3ViTW9kZWwiLCJwYXNzZXMiLCJnZXRNYWNyb1BhdGNoZXMiLCJfdXBkYXRlQXR0cmlidXRlc0FuZEJpbmRpbmciLCJhc3NpZ24iLCJzdWJNZXNoIiwib25QaXBlbGluZVN0YXRlQ2hhbmdlZCIsInRleHR1cmUiLCJ1dlBhcmFtIiwiTElHSFRJTkdNQVBfVVZQQVJBTSIsImJ1aWx0aW5SZXNNZ3IiLCJnZnhUZXh0dXJlIiwiZ2V0R0ZYVGV4dHVyZSIsInNhbXBsZXIiLCJzYW1wbGVyTGliIiwiZ2V0U2FtcGxlciIsIm1pcG1hcHMiLCJkZXNjcmlwdG9yU2V0IiwiYmluZFRleHR1cmUiLCJVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORyIsImJpbmRTYW1wbGVyIiwic3ViTW9kZWxJbmRleCIsInVuZGVmaW5lZCIsIl9pbml0TG9jYWxEZXNjcmlwdG9ycyIsIl91cGRhdGVMb2NhbERlc2NyaXB0b3JzIiwic2hhZGVyIiwiU2hhZGVyUG9vbCIsIlN1Yk1vZGVsUG9vbCIsIlN1Yk1vZGVsVmlldyIsIlNIQURFUl8wIiwiX3VwZGF0ZUluc3RhbmNlZEF0dHJpYnV0ZXMiLCJhdHRyaWJ1dGVzIiwibmFtZSIsInBhc3MiLCJoYXNGZWF0dXJlIiwiR0ZYRmVhdHVyZSIsIklOU1RBTkNFRF9BUlJBWVMiLCJzaXplIiwiaiIsImF0dHJpYnV0ZSIsImlzSW5zdGFuY2VkIiwiR0ZYRm9ybWF0SW5mb3MiLCJmb3JtYXQiLCJVaW50OEFycmF5Iiwib2Zmc2V0IiwiaW5mbyIsImNvdW50IiwiaXNOb3JtYWxpemVkIiwicHVzaCIsImJhdGNoaW5nU2NoZW1lIiwiQmF0Y2hpbmdTY2hlbWVzIiwiSU5TVEFOQ0lORyIsIkluc3RhbmNlZEJ1ZmZlciIsIl9nZXRJbnN0YW5jZWRBdHRyaWJ1dGVJbmRleCIsIklOU1RfTUFUX1dPUkxEIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVU5JRk9STSIsIlRSQU5TRkVSX0RTVCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiSE9TVCIsIkRFVklDRSIsIlNJWkUiLCJzdWJtb2RlbElkeCIsImJpbmRCdWZmZXIiLCJCSU5ESU5HIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQSxNQUFNQSxJQUFJLEdBQUcsSUFBSUMsWUFBSixFQUFiOztBQUVBLE1BQU1DLGFBQWEsR0FBRyxJQUFJQyxZQUFKLENBQVM7QUFBQSxXQUFNLElBQUlDLGtCQUFKLEVBQU47QUFBQSxHQUFULEVBQStCLEVBQS9CLENBQXRCOztNQWFZQyxTOzs7YUFBQUEsUztBQUFBQSxJQUFBQSxTLENBQUFBLFM7QUFBQUEsSUFBQUEsUyxDQUFBQSxTO0FBQUFBLElBQUFBLFMs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LFlBQVYsRUFBd0I7QUFDcEIsZUFBS0EsWUFBTCxHQUFvQixLQUFLMEIsT0FBTCxDQUFhdUgsWUFBYixDQUEwQixJQUFJQyxxQkFBSixDQUMxQ0MsMkJBQWtCQyxPQUFsQixHQUE0QkQsMkJBQWtCRSxZQURKLEVBRTFDQywyQkFBa0JDLElBQWxCLEdBQXlCRCwyQkFBa0JFLE1BRkQsRUFHMUN0SCxpQkFBU3VILElBSGlDLEVBSTFDdkgsaUJBQVN1SCxJQUppQyxDQUExQixDQUFwQjtBQU1IO0FBQ0o7Ozs4Q0FFa0NDLFcsRUFBcUIvQyxhLEVBQWlDO0FBQ3JGQSxRQUFBQSxhQUFhLENBQUNnRCxVQUFkLENBQXlCekgsaUJBQVMwSCxPQUFsQyxFQUEyQyxLQUFLNUosWUFBaEQ7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vLi4vM2QvYnVpbHRpbi9pbml0JztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBSZW5kZXJpbmdTdWJNZXNoIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21lc2gnO1xyXG5pbXBvcnQgeyBhYWJiIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlckluZm8gfSBmcm9tICcuLi8uLi9nZngvYnVmZmVyJztcclxuaW1wb3J0IHsgUG9vbCB9IGZyb20gJy4uLy4uL21lbW9wJztcclxuaW1wb3J0IHsgTm9kZSB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgTGF5ZXJzIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgvbGF5ZXJzJztcclxuaW1wb3J0IHsgUmVuZGVyU2NlbmUgfSBmcm9tICcuL3JlbmRlci1zY2VuZSc7XHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4uLy4uL2Fzc2V0cy90ZXh0dXJlLTJkJztcclxuaW1wb3J0IHsgU3ViTW9kZWwgfSBmcm9tICcuL3N1Ym1vZGVsJztcclxuaW1wb3J0IHsgUGFzcyB9IGZyb20gJy4uL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBJbnN0YW5jZWRCdWZmZXIgfSBmcm9tICcuLi8uLi9waXBlbGluZSc7XHJcbmltcG9ydCB7IEJhdGNoaW5nU2NoZW1lcyB9IGZyb20gJy4uL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IE1hdDQsIFZlYzMsIFZlYzQgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlLCBHRlhGZWF0dXJlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IGdlblNhbXBsZXJIYXNoLCBzYW1wbGVyTGliIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCB7IFNoYWRlclBvb2wsIFN1Yk1vZGVsUG9vbCwgU3ViTW9kZWxWaWV3LCBNb2RlbEhhbmRsZSwgU3ViTW9kZWxBcnJheVBvb2wsIFN1Yk1vZGVsQXJyYXlIYW5kbGUsIE1vZGVsUG9vbCxcclxuICAgIE1vZGVsVmlldywgQUFCQkhhbmRsZSwgQUFCQlBvb2wsIEFBQkJWaWV3LCBOVUxMX0hBTkRMRSB9IGZyb20gJy4uL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlLCBHRlhEZXNjcmlwdG9yU2V0IH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgSU5TVF9NQVRfV09STEQsIFVCT0xvY2FsLCBVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORyB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IGdldFR5cGVkQXJyYXlDb25zdHJ1Y3RvciwgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWEZvcm1hdCwgR0ZYRm9ybWF0SW5mb3MsIEdGWE1lbW9yeVVzYWdlQml0LCBHRlhGaWx0ZXIsIEdGWEFkZHJlc3MgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuXHJcbmNvbnN0IG00XzEgPSBuZXcgTWF0NCgpO1xyXG5cclxuY29uc3QgX3N1Yk1vZGVsUG9vbCA9IG5ldyBQb29sKCgpID0+IG5ldyBTdWJNb2RlbCgpLCAzMik7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElJbnN0YW5jZWRBdHRyaWJ1dGUge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgZm9ybWF0OiBHRlhGb3JtYXQ7XHJcbiAgICBpc05vcm1hbGl6ZWQ/OiBib29sZWFuO1xyXG4gICAgdmlldzogQXJyYXlCdWZmZXJWaWV3O1xyXG59XHJcbmV4cG9ydCBpbnRlcmZhY2UgSUluc3RhbmNlZEF0dHJpYnV0ZUJsb2NrIHtcclxuICAgIGJ1ZmZlcjogVWludDhBcnJheTtcclxuICAgIGxpc3Q6IElJbnN0YW5jZWRBdHRyaWJ1dGVbXTtcclxufVxyXG5cclxuZXhwb3J0IGVudW0gTW9kZWxUeXBlIHtcclxuICAgIERFRkFVTFQsXHJcbiAgICBTS0lOTklORyxcclxuICAgIEJBS0VEX1NLSU5OSU5HLFxyXG4gICAgVUlfQkFUQ0gsXHJcbiAgICBQQVJUSUNMRV9CQVRDSCxcclxuICAgIExJTkUsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHVwbG9hZE1hdDRBc1ZlYzR4MyAobWF0OiBNYXQ0LCB2MTogQXJyYXlCdWZmZXJWaWV3LCB2MjogQXJyYXlCdWZmZXJWaWV3LCB2MzogQXJyYXlCdWZmZXJWaWV3KSB7XHJcbiAgICB2MVswXSA9IG1hdC5tMDA7IHYxWzFdID0gbWF0Lm0wMTsgdjFbMl0gPSBtYXQubTAyOyB2MVszXSA9IG1hdC5tMTI7XHJcbiAgICB2MlswXSA9IG1hdC5tMDQ7IHYyWzFdID0gbWF0Lm0wNTsgdjJbMl0gPSBtYXQubTA2OyB2MlszXSA9IG1hdC5tMTM7XHJcbiAgICB2M1swXSA9IG1hdC5tMDg7IHYzWzFdID0gbWF0Lm0wOTsgdjNbMl0gPSBtYXQubTEwOyB2M1szXSA9IG1hdC5tMTQ7XHJcbn1cclxuXHJcbmNvbnN0IGxpZ2h0bWFwU2FtcGxlckhhc2ggPSBnZW5TYW1wbGVySGFzaChbXHJcbiAgICBHRlhGaWx0ZXIuTElORUFSLFxyXG4gICAgR0ZYRmlsdGVyLkxJTkVBUixcclxuICAgIEdGWEZpbHRlci5OT05FLFxyXG4gICAgR0ZYQWRkcmVzcy5DTEFNUCxcclxuICAgIEdGWEFkZHJlc3MuQ0xBTVAsXHJcbiAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG5dKTtcclxuXHJcbmNvbnN0IGxpZ2h0bWFwU2FtcGxlcldpdGhNaXBIYXNoID0gZ2VuU2FtcGxlckhhc2goW1xyXG4gICAgR0ZYRmlsdGVyLkxJTkVBUixcclxuICAgIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgICBHRlhGaWx0ZXIuTElORUFSLFxyXG4gICAgR0ZYQWRkcmVzcy5DTEFNUCxcclxuICAgIEdGWEFkZHJlc3MuQ0xBTVAsXHJcbiAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG5dKTtcclxuXHJcbi8qKlxyXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGEgbW9kZWxcclxuICovXHJcbmV4cG9ydCBjbGFzcyBNb2RlbCB7XHJcblxyXG4gICAgZ2V0IHN1Yk1vZGVscyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N1Yk1vZGVscztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaW5pdGVkICgpOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB3b3JsZEJvdW5kcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dvcmxkQm91bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtb2RlbEJvdW5kcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsQm91bmRzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBsb2NhbEJ1ZmZlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsQnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB1cGRhdGVTdGFtcCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3VwZGF0ZVN0YW1wO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0luc3RhbmNpbmdFbmFibGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5zdE1hdFdvcmxkSWR4ID49IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGhhbmRsZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvb2xIYW5kbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vZGUgKCkgOiBOb2RlIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbm9kZSAobjogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuX25vZGUgPSBuO1xyXG4gICAgICAgIE1vZGVsUG9vbC5zZXQodGhpcy5fcG9vbEhhbmRsZSwgTW9kZWxWaWV3Lk5PREUsIG4uaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdHJhbnNmb3JtICgpIDogTm9kZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zZm9ybTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgdHJhbnNmb3JtIChuOiBOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtID0gbjtcclxuICAgICAgICBNb2RlbFBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIE1vZGVsVmlldy5UUkFOU0ZPUk0sIG4uaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdmlzRmxhZ3MgKCkgOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBNb2RlbFBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIE1vZGVsVmlldy5WSVNfRkxBR1MpO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCB2aXNGbGFncyAodmFsOiBudW1iZXIpIHtcclxuICAgICAgICBNb2RlbFBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIE1vZGVsVmlldy5WSVNfRkxBR1MsIHZhbCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGVuYWJsZWQgKCkgOiBib29sZWFuIHtcclxuICAgICAgICByZXR1cm4gTW9kZWxQb29sLmdldCh0aGlzLl9wb29sSGFuZGxlLCBNb2RlbFZpZXcuRU5BQkxFRCkgPT09IDEgPyB0cnVlIDogZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGVuYWJsZWQgKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgIE1vZGVsUG9vbC5zZXQodGhpcy5fcG9vbEhhbmRsZSwgTW9kZWxWaWV3LkVOQUJMRUQsIHZhbCA/IDEgOiAwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdHlwZSA9IE1vZGVsVHlwZS5ERUZBVUxUO1xyXG4gICAgcHVibGljIHNjZW5lOiBSZW5kZXJTY2VuZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIGNhc3RTaGFkb3cgPSBmYWxzZTtcclxuICAgIHB1YmxpYyByZWNlaXZlU2hhZG93ID0gdHJ1ZTtcclxuICAgIHB1YmxpYyBpc0R5bmFtaWNCYXRjaGluZyA9IGZhbHNlO1xyXG4gICAgcHVibGljIGluc3RhbmNlZEF0dHJpYnV0ZXM6IElJbnN0YW5jZWRBdHRyaWJ1dGVCbG9jayA9IHsgYnVmZmVyOiBudWxsISwgbGlzdDogW10gfTtcclxuXHJcbiAgICBwcm90ZWN0ZWQgX3dvcmxkQm91bmRzOiBhYWJiIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX21vZGVsQm91bmRzOiBhYWJiIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3N1Yk1vZGVsczogU3ViTW9kZWxbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9ub2RlOiBOb2RlID0gbnVsbCE7XHJcbiAgICBwcm90ZWN0ZWQgX3RyYW5zZm9ybTogTm9kZSA9IG51bGwhO1xyXG5cclxuICAgIHByb3RlY3RlZCBfZGV2aWNlOiBHRlhEZXZpY2U7XHJcbiAgICBwcm90ZWN0ZWQgX2luaXRlZCA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9kZXNjcmlwdG9yU2V0Q291bnQgPSAxO1xyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVTdGFtcCA9IC0xO1xyXG4gICAgcHJvdGVjdGVkIF90cmFuc2Zvcm1VcGRhdGVkID0gdHJ1ZTtcclxuICAgIHByb3RlY3RlZCBfc3ViTW9kZWxBcnJheUhhbmRsZTogU3ViTW9kZWxBcnJheUhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHJvdGVjdGVkIF9wb29sSGFuZGxlOiBNb2RlbEhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHJvdGVjdGVkIF93b3JsZEJvdW5kc0hhbmRsZTogQUFCQkhhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgIHByaXZhdGUgX2xvY2FsRGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoVUJPTG9jYWwuQ09VTlQpO1xyXG4gICAgcHJpdmF0ZSBfbG9jYWxCdWZmZXI6IEdGWEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfaW5zdE1hdFdvcmxkSWR4ID0gLTE7XHJcbiAgICBwcml2YXRlIF9saWdodG1hcDogVGV4dHVyZTJEIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9saWdodG1hcFVWUGFyYW06IFZlYzQgPSBuZXcgVmVjNCgpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0dXAgYSBkZWZhdWx0IGVtcHR5IG1vZGVsXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRldmljZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9pbml0ZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbEhhbmRsZSA9IE1vZGVsUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJNb2RlbEFycmF5SGFuZGxlID0gU3ViTW9kZWxBcnJheVBvb2wuYWxsb2MoKTtcclxuICAgICAgICAgICAgTW9kZWxQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBNb2RlbFZpZXcuU1VCX01PREVMX0FSUkFZLCB0aGlzLl9zdWJNb2RlbEFycmF5SGFuZGxlKTtcclxuICAgICAgICAgICAgTW9kZWxQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBNb2RlbFZpZXcuVklTX0ZMQUdTLCBMYXllcnMuRW51bS5OT05FKTtcclxuICAgICAgICAgICAgTW9kZWxQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBNb2RlbFZpZXcuRU5BQkxFRCwgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSB0aGlzLl9zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc3ViTW9kZWwgPSB0aGlzLl9zdWJNb2RlbHNbaV07XHJcbiAgICAgICAgICAgIHN1Yk1vZGVsLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgX3N1Yk1vZGVsUG9vbC5mcmVlKHN1Yk1vZGVsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX2xvY2FsQnVmZmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsQnVmZmVyLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fbG9jYWxCdWZmZXIgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93b3JsZEJvdW5kcyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxCb3VuZHMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX2luaXRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuX3RyYW5zZm9ybVVwZGF0ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuaXNEeW5hbWljQmF0Y2hpbmcgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Bvb2xIYW5kbGUpIHtcclxuICAgICAgICAgICAgTW9kZWxQb29sLmZyZWUodGhpcy5fcG9vbEhhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Bvb2xIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuICAgICAgICAgICAgU3ViTW9kZWxBcnJheVBvb2wuZnJlZSh0aGlzLl9zdWJNb2RlbEFycmF5SGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fc3ViTW9kZWxBcnJheUhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fd29ybGRCb3VuZHNIYW5kbGUpIHtcclxuICAgICAgICAgICAgQUFCQlBvb2wuZnJlZSh0aGlzLl93b3JsZEJvdW5kc0hhbmRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3dvcmxkQm91bmRzSGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhdHRhY2hUb1NjZW5lIChzY2VuZTogUmVuZGVyU2NlbmUpIHtcclxuICAgICAgICB0aGlzLnNjZW5lID0gc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRldGFjaEZyb21TY2VuZSAoKSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVRyYW5zZm9ybSAoc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IG5vZGUgPSB0aGlzLnRyYW5zZm9ybTtcclxuICAgICAgICAvLyBAdHMtaWdub3JlIFRTMjQ0NVxyXG4gICAgICAgIGlmIChub2RlLmhhc0NoYW5nZWRGbGFncyB8fCBub2RlLl9kaXJ0eUZsYWdzKSB7XHJcbiAgICAgICAgICAgIG5vZGUudXBkYXRlV29ybGRUcmFuc2Zvcm0oKTtcclxuICAgICAgICAgICAgdGhpcy5fdHJhbnNmb3JtVXBkYXRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHdvcmxkQm91bmRzID0gdGhpcy5fd29ybGRCb3VuZHM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbEJvdW5kcyAmJiB3b3JsZEJvdW5kcykge1xyXG4gICAgICAgICAgICAgICAgLy8gQHRzLWlnbm9yZSBUUzI0NDVcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsQm91bmRzLnRyYW5zZm9ybShub2RlLl9tYXQsIG5vZGUuX3Bvcywgbm9kZS5fcm90LCBub2RlLl9zY2FsZSwgd29ybGRCb3VuZHMpO1xyXG4gICAgICAgICAgICAgICAgQUFCQlBvb2wuc2V0VmVjMyh0aGlzLl93b3JsZEJvdW5kc0hhbmRsZSwgQUFCQlZpZXcuQ0VOVEVSLCB3b3JsZEJvdW5kcy5jZW50ZXIpO1xyXG4gICAgICAgICAgICAgICAgQUFCQlBvb2wuc2V0VmVjMyh0aGlzLl93b3JsZEJvdW5kc0hhbmRsZSwgQUFCQlZpZXcuSEFMRl9FWFRFTlNJT04sIHdvcmxkQm91bmRzLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlVUJPcyAoc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IHRoaXMuX3N1Yk1vZGVscztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBzdWJNb2RlbHNbaV0udXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVN0YW1wID0gc3RhbXA7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fdHJhbnNmb3JtVXBkYXRlZCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl90cmFuc2Zvcm1VcGRhdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBjb25zdCB3b3JsZE1hdHJpeCA9IHRoaXMudHJhbnNmb3JtLl9tYXQ7XHJcbiAgICAgICAgY29uc3QgaWR4ID0gdGhpcy5faW5zdE1hdFdvcmxkSWR4O1xyXG4gICAgICAgIGlmIChpZHggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBhdHRycyA9IHRoaXMuaW5zdGFuY2VkQXR0cmlidXRlcyEubGlzdDtcclxuICAgICAgICAgICAgdXBsb2FkTWF0NEFzVmVjNHgzKHdvcmxkTWF0cml4LCBhdHRyc1tpZHhdLnZpZXcsIGF0dHJzW2lkeCArIDFdLnZpZXcsIGF0dHJzW2lkeCArIDJdLnZpZXcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIE1hdDQudG9BcnJheSh0aGlzLl9sb2NhbERhdGEsIHdvcmxkTWF0cml4LCBVQk9Mb2NhbC5NQVRfV09STERfT0ZGU0VUKTtcclxuICAgICAgICAgICAgTWF0NC5pbnZlcnNlVHJhbnNwb3NlKG00XzEsIHdvcmxkTWF0cml4KTtcclxuICAgICAgICAgICAgTWF0NC50b0FycmF5KHRoaXMuX2xvY2FsRGF0YSwgbTRfMSwgVUJPTG9jYWwuTUFUX1dPUkxEX0lUX09GRlNFVCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvY2FsQnVmZmVyIS51cGRhdGUodGhpcy5fbG9jYWxEYXRhKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgdGhlIGJvdW5kaW5nIHNoYXBlIG9mIHRoaXMgbW9kZWxcclxuICAgICAqIEBwYXJhbSBtaW5Qb3MgdGhlIG1pbiBwb3NpdGlvbiBvZiB0aGUgbW9kZWxcclxuICAgICAqIEBwYXJhbSBtYXhQb3MgdGhlIG1heCBwb3NpdGlvbiBvZiB0aGUgbW9kZWxcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZUJvdW5kaW5nU2hhcGUgKG1pblBvcz86IFZlYzMsIG1heFBvcz86IFZlYzMpIHtcclxuICAgICAgICBpZiAoIW1pblBvcyB8fCAhbWF4UG9zKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX21vZGVsQm91bmRzID0gYWFiYi5mcm9tUG9pbnRzKGFhYmIuY3JlYXRlKCksIG1pblBvcywgbWF4UG9zKTtcclxuICAgICAgICB0aGlzLl93b3JsZEJvdW5kcyA9IGFhYmIuY2xvbmUodGhpcy5fbW9kZWxCb3VuZHMpO1xyXG4gICAgICAgIGlmICh0aGlzLl93b3JsZEJvdW5kc0hhbmRsZSA9PT0gTlVMTF9IQU5ETEUpIHtcclxuICAgICAgICAgICAgdGhpcy5fd29ybGRCb3VuZHNIYW5kbGUgPSBBQUJCUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICBNb2RlbFBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIE1vZGVsVmlldy5XT1JMRF9CT1VORFMsIHRoaXMuX3dvcmxkQm91bmRzSGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgQUFCQlBvb2wuc2V0VmVjMyh0aGlzLl93b3JsZEJvdW5kc0hhbmRsZSwgQUFCQlZpZXcuQ0VOVEVSLCB0aGlzLl93b3JsZEJvdW5kcy5jZW50ZXIpO1xyXG4gICAgICAgIEFBQkJQb29sLnNldFZlYzModGhpcy5fd29ybGRCb3VuZHNIYW5kbGUsIEFBQkJWaWV3LkhBTEZfRVhURU5TSU9OLCB0aGlzLl93b3JsZEJvdW5kcy5oYWxmRXh0ZW50cyk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0U3ViTW9kZWwgKGlkeDogbnVtYmVyLCBzdWJNZXNoRGF0YTogUmVuZGVyaW5nU3ViTWVzaCwgbWF0OiBNYXRlcmlhbCkge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG5cclxuICAgICAgICBsZXQgaXNOZXdTdWJNb2RlbCA9IGZhbHNlO1xyXG4gICAgICAgIGlmICh0aGlzLl9zdWJNb2RlbHNbaWR4XSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3N1Yk1vZGVsc1tpZHhdID0gX3N1Yk1vZGVsUG9vbC5hbGxvYygpO1xyXG4gICAgICAgICAgICBpc05ld1N1Yk1vZGVsID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9zdWJNb2RlbHNbaWR4XS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVsc1tpZHhdLmluaXRpYWxpemUoc3ViTWVzaERhdGEsIG1hdC5wYXNzZXMsIHRoaXMuZ2V0TWFjcm9QYXRjaGVzKGlkeCkpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUF0dHJpYnV0ZXNBbmRCaW5kaW5nKGlkeCk7XHJcbiAgICAgICAgaWYgKGlzTmV3U3ViTW9kZWwpIHtcclxuICAgICAgICAgICAgU3ViTW9kZWxBcnJheVBvb2wuYXNzaWduKHRoaXMuX3N1Yk1vZGVsQXJyYXlIYW5kbGUsIGlkeCwgdGhpcy5fc3ViTW9kZWxzW2lkeF0uaGFuZGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFN1Yk1vZGVsTWVzaCAoaWR4OiBudW1iZXIsIHN1Yk1lc2g6IFJlbmRlcmluZ1N1Yk1lc2gpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3N1Yk1vZGVsc1tpZHhdKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX3N1Yk1vZGVsc1tpZHhdLnN1Yk1lc2ggPSBzdWJNZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRTdWJNb2RlbE1hdGVyaWFsIChpZHg6IG51bWJlciwgbWF0OiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fc3ViTW9kZWxzW2lkeF0pIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fc3ViTW9kZWxzW2lkeF0ucGFzc2VzID0gbWF0LnBhc3NlcztcclxuICAgICAgICB0aGlzLl91cGRhdGVBdHRyaWJ1dGVzQW5kQmluZGluZyhpZHgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkICgpIHtcclxuICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSB0aGlzLl9zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgc3ViTW9kZWxzW2ldLm9uUGlwZWxpbmVTdGF0ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZUxpZ2h0aW5nbWFwICh0ZXh0dXJlOiBUZXh0dXJlMkQgfCBudWxsLCB1dlBhcmFtOiBWZWM0KSB7XHJcbiAgICAgICAgVmVjNC50b0FycmF5KHRoaXMuX2xvY2FsRGF0YSwgdXZQYXJhbSwgVUJPTG9jYWwuTElHSFRJTkdNQVBfVVZQQVJBTSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2xpZ2h0bWFwID0gdGV4dHVyZTtcclxuICAgICAgICB0aGlzLl9saWdodG1hcFVWUGFyYW0gPSB1dlBhcmFtO1xyXG5cclxuICAgICAgICBpZiAodGV4dHVyZSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0ZXh0dXJlID0gYnVpbHRpblJlc01nci5nZXQ8VGV4dHVyZTJEPignZW1wdHktdGV4dHVyZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZ2Z4VGV4dHVyZSA9IHRleHR1cmUuZ2V0R0ZYVGV4dHVyZSgpO1xyXG4gICAgICAgIGlmIChnZnhUZXh0dXJlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIodGhpcy5fZGV2aWNlLCB0ZXh0dXJlLm1pcG1hcHMubGVuZ3RoID4gMSA/IGxpZ2h0bWFwU2FtcGxlcldpdGhNaXBIYXNoIDogbGlnaHRtYXBTYW1wbGVySGFzaCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IHRoaXMuX3N1Yk1vZGVscztcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3JTZXQgPSBzdWJNb2RlbHNbaV0uZGVzY3JpcHRvclNldDtcclxuICAgICAgICAgICAgICAgIGRlc2NyaXB0b3JTZXQuYmluZFRleHR1cmUoVU5JRk9STV9MSUdIVE1BUF9URVhUVVJFX0JJTkRJTkcsIGdmeFRleHR1cmUpO1xyXG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihVTklGT1JNX0xJR0hUTUFQX1RFWFRVUkVfQklORElORywgc2FtcGxlcik7XHJcbiAgICAgICAgICAgICAgICBkZXNjcmlwdG9yU2V0LnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRNYWNyb1BhdGNoZXMgKHN1Yk1vZGVsSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVBdHRyaWJ1dGVzQW5kQmluZGluZyAoc3ViTW9kZWxJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc3ViTW9kZWwgPSB0aGlzLl9zdWJNb2RlbHNbc3ViTW9kZWxJbmRleF07XHJcbiAgICAgICAgaWYgKCFzdWJNb2RlbCkgeyByZXR1cm47IH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5pdExvY2FsRGVzY3JpcHRvcnMoc3ViTW9kZWxJbmRleCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTG9jYWxEZXNjcmlwdG9ycyhzdWJNb2RlbEluZGV4LCBzdWJNb2RlbC5kZXNjcmlwdG9yU2V0KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZGVyID0gU2hhZGVyUG9vbC5nZXQoU3ViTW9kZWxQb29sLmdldChzdWJNb2RlbC5oYW5kbGUsIFN1Yk1vZGVsVmlldy5TSEFERVJfMCkpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUluc3RhbmNlZEF0dHJpYnV0ZXMoc2hhZGVyLmF0dHJpYnV0ZXMsIHN1Yk1vZGVsLnBhc3Nlc1swXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9nZXRJbnN0YW5jZWRBdHRyaWJ1dGVJbmRleCAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuaW5zdGFuY2VkQXR0cmlidXRlcy5saXN0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09PSBuYW1lKSB7IHJldHVybiBpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBzdWItY2xhc3NlcyBjYW4gb3ZlcnJpZGUgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgaWYgbmVlZGVkXHJcblxyXG4gICAgLy8gZm9yIG5vdyBubyBzdWJtb2RlbCBsZXZlbCBpbnN0YW5jaW5nIGF0dHJpYnV0ZXNcclxuICAgIHByb3RlY3RlZCBfdXBkYXRlSW5zdGFuY2VkQXR0cmlidXRlcyAoYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10sIHBhc3M6IFBhc3MpIHtcclxuICAgICAgICBpZiAoIXBhc3MuZGV2aWNlLmhhc0ZlYXR1cmUoR0ZYRmVhdHVyZS5JTlNUQU5DRURfQVJSQVlTKSkgeyByZXR1cm47IH1cclxuICAgICAgICBsZXQgc2l6ZSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBhdHRyaWJ1dGVzLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbal07XHJcbiAgICAgICAgICAgIGlmICghYXR0cmlidXRlLmlzSW5zdGFuY2VkKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIHNpemUgKz0gR0ZYRm9ybWF0SW5mb3NbYXR0cmlidXRlLmZvcm1hdF0uc2l6ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYXR0cnMgPSB0aGlzLmluc3RhbmNlZEF0dHJpYnV0ZXM7XHJcbiAgICAgICAgYXR0cnMuYnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoc2l6ZSk7IGF0dHJzLmxpc3QubGVuZ3RoID0gMDtcclxuICAgICAgICBsZXQgb2Zmc2V0ID0gMDsgY29uc3QgYnVmZmVyID0gYXR0cnMuYnVmZmVyLmJ1ZmZlcjtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGF0dHJpYnV0ZXMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlID0gYXR0cmlidXRlc1tqXTtcclxuICAgICAgICAgICAgaWYgKCFhdHRyaWJ1dGUuaXNJbnN0YW5jZWQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgY29uc3QgZm9ybWF0ID0gYXR0cmlidXRlLmZvcm1hdDtcclxuICAgICAgICAgICAgY29uc3QgaW5mbyA9IEdGWEZvcm1hdEluZm9zW2Zvcm1hdF07XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgKGdldFR5cGVkQXJyYXlDb25zdHJ1Y3RvcihpbmZvKSkoYnVmZmVyLCBvZmZzZXQsIGluZm8uY291bnQpO1xyXG4gICAgICAgICAgICBjb25zdCBpc05vcm1hbGl6ZWQgPSBhdHRyaWJ1dGUuaXNOb3JtYWxpemVkO1xyXG4gICAgICAgICAgICBvZmZzZXQgKz0gaW5mby5zaXplOyBhdHRycy5saXN0LnB1c2goeyBuYW1lOiBhdHRyaWJ1dGUubmFtZSwgZm9ybWF0LCBpc05vcm1hbGl6ZWQsIHZpZXcgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChwYXNzLmJhdGNoaW5nU2NoZW1lID09PSBCYXRjaGluZ1NjaGVtZXMuSU5TVEFOQ0lORykgeyBJbnN0YW5jZWRCdWZmZXIuZ2V0KHBhc3MpLmRlc3Ryb3koKTsgfSAvLyBpbnN0YW5jaW5nIElBIGNoYW5nZWRcclxuICAgICAgICB0aGlzLl9pbnN0TWF0V29ybGRJZHggPSB0aGlzLl9nZXRJbnN0YW5jZWRBdHRyaWJ1dGVJbmRleChJTlNUX01BVF9XT1JMRCk7XHJcbiAgICAgICAgdGhpcy5fdHJhbnNmb3JtVXBkYXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9pbml0TG9jYWxEZXNjcmlwdG9ycyAoc3ViTW9kZWxJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9sb2NhbEJ1ZmZlcikge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NhbEJ1ZmZlciA9IHRoaXMuX2RldmljZS5jcmVhdGVCdWZmZXIobmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICAgICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgICAgIFVCT0xvY2FsLlNJWkUsXHJcbiAgICAgICAgICAgICAgICBVQk9Mb2NhbC5TSVpFLFxyXG4gICAgICAgICAgICApKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVMb2NhbERlc2NyaXB0b3JzIChzdWJtb2RlbElkeDogbnVtYmVyLCBkZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0KSB7XHJcbiAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kQnVmZmVyKFVCT0xvY2FsLkJJTkRJTkcsIHRoaXMuX2xvY2FsQnVmZmVyISk7XHJcbiAgICB9XHJcbn1cclxuIl19