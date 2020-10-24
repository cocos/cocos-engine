(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../3d/builtin/init.js", "../../gfx/descriptor-set.js", "../../gfx/buffer.js", "../../gfx/device.js", "../../gfx/pipeline-state.js", "../../pipeline/define.js", "../../pipeline/pass-phase.js", "../../utils/murmurhash2_gc.js", "./program-lib.js", "./sampler-lib.js", "./memory-pools.js", "./pass-utils.js", "../../gfx/define.js", "../../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../3d/builtin/init.js"), require("../../gfx/descriptor-set.js"), require("../../gfx/buffer.js"), require("../../gfx/device.js"), require("../../gfx/pipeline-state.js"), require("../../pipeline/define.js"), require("../../pipeline/pass-phase.js"), require("../../utils/murmurhash2_gc.js"), require("./program-lib.js"), require("./sampler-lib.js"), require("./memory-pools.js"), require("./pass-utils.js"), require("../../gfx/define.js"), require("../../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.init, global.descriptorSet, global.buffer, global.device, global.pipelineState, global.define, global.passPhase, global.murmurhash2_gc, global.programLib, global.samplerLib, global.memoryPools, global.passUtils, global.define, global.index);
    global.pass = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _init, _descriptorSet, _buffer, _device, _pipelineState, _define, _passPhase, _murmurhash2_gc, _programLib, _samplerLib, _memoryPools, _passUtils, _define2, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Pass = _exports.BatchingSchemes = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _bufferInfo = new _buffer.GFXBufferInfo(_define2.GFXBufferUsageBit.UNIFORM | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE);

  var _bufferViewInfo = new _buffer.GFXBufferViewInfo(null);

  var _dsLayoutInfo = new _index.GFXDescriptorSetLayoutInfo();

  var _dsInfo = new _descriptorSet.GFXDescriptorSetInfo(null);

  var BatchingSchemes;
  _exports.BatchingSchemes = BatchingSchemes;

  (function (BatchingSchemes) {
    BatchingSchemes[BatchingSchemes["INSTANCING"] = 1] = "INSTANCING";
    BatchingSchemes[BatchingSchemes["VB_MERGING"] = 2] = "VB_MERGING";
  })(BatchingSchemes || (_exports.BatchingSchemes = BatchingSchemes = {}));

  ; // tslint:disable: no-shadowed-variable

  // tslint:enable: no-shadowed-variable

  /**
   * @zh
   * 渲染 pass，储存实际描述绘制过程的各项资源。
   */
  var Pass = /*#__PURE__*/function () {
    _createClass(Pass, null, [{
      key: "fillPipelineInfo",

      /**
       * @zh
       * 根据 handle 获取 unform 的绑定类型（UBO 或贴图等）。
       */

      /**
       * @zh
       * 根据 handle 获取 UBO member 的具体类型。
       */

      /**
       * @zh
       * 根据 handle 获取 binding。
       */
      value: function fillPipelineInfo(hPass, info) {
        if (info.priority !== undefined) {
          _memoryPools.PassPool.set(hPass, _memoryPools.PassView.PRIORITY, info.priority);
        }

        if (info.primitive !== undefined) {
          _memoryPools.PassPool.set(hPass, _memoryPools.PassView.PRIMITIVE, info.primitive);
        }

        if (info.stage !== undefined) {
          _memoryPools.PassPool.set(hPass, _memoryPools.PassView.STAGE, info.stage);
        }

        if (info.dynamicStates !== undefined) {
          _memoryPools.PassPool.set(hPass, _memoryPools.PassView.DYNAMIC_STATES, info.dynamicStates);
        }

        if (info.phase !== undefined) {
          _memoryPools.PassPool.set(hPass, _memoryPools.PassView.PHASE, (0, _passPhase.getPhaseID)(info.phase));
        }

        var bs = _memoryPools.BlendStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.BLEND_STATE));

        if (info.blendState) {
          var bsInfo = info.blendState;

          if (bsInfo.targets) {
            bsInfo.targets.forEach(function (t, i) {
              if (!bs.targets[i]) bs.setTarget(i, new _pipelineState.GFXBlendTarget());
              Object.assign(bs.targets[i], t);
            });
          }

          if (bsInfo.isA2C !== undefined) {
            bs.isA2C = bsInfo.isA2C;
          }

          if (bsInfo.isIndepend !== undefined) {
            bs.isIndepend = bsInfo.isIndepend;
          }

          if (bsInfo.blendColor !== undefined) {
            Object.assign(bs.blendColor, bsInfo.blendColor);
          }
        }

        Object.assign(_memoryPools.RasterizerStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.RASTERIZER_STATE)), info.rasterizerState);
        Object.assign(_memoryPools.DepthStencilStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DEPTH_STENCIL_STATE)), info.depthStencilState);
      }
      /**
       * @en
       * Get pass hash value by [[Pass]] hash information.
       * @zh
       * 根据 [[Pass]] 的哈希信息获取哈希值。
       *
       * @param hPass Handle of the pass info used to compute hash value.
       */

    }, {
      key: "getPassHash",
      value: function getPassHash(hPass, hShader) {
        var res = hShader + ',' + _memoryPools.PassPool.get(hPass, _memoryPools.PassView.PRIMITIVE) + ',' + _memoryPools.PassPool.get(hPass, _memoryPools.PassView.DYNAMIC_STATES);

        res += serializeBlendState(_memoryPools.BlendStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.BLEND_STATE)));
        res += serializeDepthStencilState(_memoryPools.DepthStencilStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.DEPTH_STENCIL_STATE)));
        res += serializeRasterizerState(_memoryPools.RasterizerStatePool.get(_memoryPools.PassPool.get(hPass, _memoryPools.PassView.RASTERIZER_STATE)));
        return (0, _murmurhash2_gc.murmurhash2_32_gc)(res, 666);
      }
    }]);

    function Pass(root) {
      _classCallCheck(this, Pass);

      this._rootBuffer = null;
      this._rootBufferDirty = false;
      this._buffers = [];
      this._descriptorSet = null;
      this._passIndex = 0;
      this._propertyIndex = 0;
      this._programName = '';
      this._dynamics = {};
      this._propertyHandleMap = {};
      this._rootBlock = null;
      this._blocks = [];
      this._shaderInfo = null;
      this._defines = {};
      this._properties = {};
      this._root = void 0;
      this._device = void 0;
      this._hShaderDefault = _memoryPools.NULL_HANDLE;
      this._handle = _memoryPools.NULL_HANDLE;
      this._root = root;
      this._device = root.device;
    }
    /**
     * @zh
     * 根据指定参数初始化当前 pass，shader 会在这一阶段就尝试编译。
     */


    _createClass(Pass, [{
      key: "initialize",
      value: function initialize(info) {
        this._doInit(info);

        this.resetUBOs();
        this.resetTextures();
        this.tryCompile();
      }
      /**
       * @en
       * Get the handle of a UBO member, or specific channels of it.
       * @zh
       * 获取指定 UBO 成员，或其更具体分量的读写句柄。默认以成员自身的类型为目标读写类型（即读写时必须传入与成员类型相同的变量）。
       * @param name Name of the target UBO member.
       * @param offset Channel offset into the member.
       * @param targetType Target type of the handle, i.e. the type of data when read/write to it.
       * @example
       * ```
       * import { Vec3, GFXType } from 'cc';
       * // say 'pbrParams' is a uniform vec4
       * const hParams = pass.getHandle('pbrParams'); // get the default handle
       * pass.setUniform(hAlbedo, new Vec3(1, 0, 0)); // wrong! pbrParams.w is NaN now
       *
       * // say 'albedoScale' is a uniform vec4, and we only want to modify the w component in the form of a single float
       * const hThreshold = pass.getHandle('albedoScale', 3, GFXType.FLOAT);
       * pass.setUniform(hThreshold, 0.5); // now, albedoScale.w = 0.5
       * ```
       */

    }, {
      key: "getHandle",
      value: function getHandle(name) {
        var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var targetType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _define2.GFXType.UNKNOWN;
        var handle = this._propertyHandleMap[name];

        if (!handle) {
          return 0;
        }

        if (targetType) {
          handle = (0, _passUtils.customizeType)(handle, targetType);
        } else if (offset) {
          handle = (0, _passUtils.customizeType)(handle, (0, _passUtils.getTypeFromHandle)(handle) - offset);
        }

        return handle + offset;
      }
      /**
       * @zh
       * 获取指定 uniform 的 binding。
       * @param name 目标 uniform 名。
       */

    }, {
      key: "getBinding",
      value: function getBinding(name) {
        var handle = this.getHandle(name);

        if (!handle) {
          return -1;
        }

        return Pass.getBindingFromHandle(handle);
      }
      /**
       * @zh
       * 设置指定普通向量类 uniform 的值，如果需要频繁更新请尽量使用此接口。
       * @param handle 目标 uniform 的 handle。
       * @param value 目标值。
       */

    }, {
      key: "setUniform",
      value: function setUniform(handle, value) {
        var binding = Pass.getBindingFromHandle(handle);
        var type = Pass.getTypeFromHandle(handle);
        var ofs = Pass.getOffsetFromHandle(handle);
        var block = this._blocks[binding];

        _passUtils.type2writer[type](block, value, ofs);

        this._rootBufferDirty = true;
      }
      /**
       * @zh
       * 获取指定普通向量类 uniform 的值。
       * @param handle 目标 uniform 的 handle。
       * @param out 输出向量。
       */

    }, {
      key: "getUniform",
      value: function getUniform(handle, out) {
        var binding = Pass.getBindingFromHandle(handle);
        var type = Pass.getTypeFromHandle(handle);
        var ofs = Pass.getOffsetFromHandle(handle);
        var block = this._blocks[binding];
        return _passUtils.type2reader[type](block, out, ofs);
      }
      /**
       * @zh
       * 设置指定数组类 uniform 的值，如果需要频繁更新请尽量使用此接口。
       * @param handle 目标 uniform 的 handle。
       * @param value 目标值。
       */

    }, {
      key: "setUniformArray",
      value: function setUniformArray(handle, value) {
        var binding = Pass.getBindingFromHandle(handle);
        var type = Pass.getTypeFromHandle(handle);
        var stride = (0, _define2.GFXGetTypeSize)(type) >> 2;
        var block = this._blocks[binding];
        var ofs = Pass.getOffsetFromHandle(handle);

        for (var i = 0; i < value.length; i++, ofs += stride) {
          if (value[i] === null) {
            continue;
          }

          _passUtils.type2writer[type](block, value[i], ofs);
        }

        this._rootBufferDirty = true;
      }
      /**
       * @zh
       * 绑定实际 [[GFXTexture]] 到指定 binding。
       * @param binding 目标贴图类 uniform 的 binding。
       * @param value 目标 texture
       */

    }, {
      key: "bindTexture",
      value: function bindTexture(binding, value, index) {
        this._descriptorSet.bindTexture(binding, value, index || 0);
      }
      /**
       * @zh
       * 绑定实际 [[GFXSampler]] 到指定 binding。
       * @param binding 目标贴图类 uniform 的 binding。
       * @param value 目标 sampler。
       */

    }, {
      key: "bindSampler",
      value: function bindSampler(binding, value, index) {
        this._descriptorSet.bindSampler(binding, value, index || 0);
      }
      /**
       * @zh
       * 设置运行时 pass 内可动态更新的管线状态属性。
       * @param state 目标管线状态。
       * @param value 目标值。
       */

    }, {
      key: "setDynamicState",
      value: function setDynamicState(state, value) {
        var ds = this._dynamics[state];

        if (ds && ds.value === value) {
          return;
        }

        ds.value = value;
        ds.dirty = true;
      }
      /**
       * @zh
       * 重载当前所有管线状态。
       * @param original 原始管线状态。
       * @param value 管线状态重载值。
       */

    }, {
      key: "overridePipelineStates",
      value: function overridePipelineStates(original, overrides) {
        console.warn('base pass cannot override states, please use pass instance instead.');
      }
      /**
       * @zh
       * 更新当前 Uniform 数据。
       */

    }, {
      key: "update",
      value: function update() {
        if (this._rootBufferDirty && this._rootBuffer) {
          this._rootBuffer.update(this._rootBlock);

          this._rootBufferDirty = false;
        }

        this._descriptorSet.update();
      }
      /**
       * @zh
       * 销毁当前 pass。
       */

    }, {
      key: "destroy",
      value: function destroy() {
        for (var i = 0; i < this._shaderInfo.blocks.length; i++) {
          var u = this._shaderInfo.blocks[i];

          this._buffers[u.binding].destroy();
        }

        this._buffers = [];

        if (this._rootBuffer) {
          this._rootBuffer.destroy();

          this._rootBlock = null;
        } // textures are reused


        this._descriptorSet = null;

        if (this._handle) {
          _memoryPools.RasterizerStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.RASTERIZER_STATE));

          _memoryPools.DepthStencilStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.DEPTH_STENCIL_STATE));

          _memoryPools.BlendStatePool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.BLEND_STATE));

          _memoryPools.DSPool.free(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.DESCRIPTOR_SET));

          _memoryPools.PassPool.free(this._handle);

          this._handle = _memoryPools.NULL_HANDLE;
        }
      }
      /**
       * @zh
       * 重置指定（非数组） Uniform 为 Effect 默认值。
       */

    }, {
      key: "resetUniform",
      value: function resetUniform(name) {
        var handle = this.getHandle(name);
        if (!handle) return;
        var type = Pass.getTypeFromHandle(handle);
        var binding = Pass.getBindingFromHandle(handle);
        var ofs = Pass.getOffsetFromHandle(handle);
        var block = this._blocks[binding];
        var info = this._properties[name];
        var value = info && info.value || (0, _passUtils.getDefaultFromType)(type);

        _passUtils.type2writer[type](block, value, ofs);

        this._rootBufferDirty = true;
      }
      /**
       * @zh
       * 重置指定贴图为 Effect 默认值。
       */

    }, {
      key: "resetTexture",
      value: function resetTexture(name, index) {
        var handle = this.getHandle(name);
        if (!handle) return;
        var type = Pass.getTypeFromHandle(handle);
        var binding = Pass.getBindingFromHandle(handle);
        var info = this._properties[name];
        var value = info && info.value;
        var texName = value ? value + '-texture' : (0, _passUtils.getDefaultFromType)(type);

        var textureBase = _init.builtinResMgr.get(texName);

        var texture = textureBase && textureBase.getGFXTexture();
        var samplerHash = info && info.samplerHash !== undefined ? info.samplerHash : textureBase.getSamplerHash();

        var sampler = _samplerLib.samplerLib.getSampler(this._device, samplerHash);

        this._descriptorSet.bindSampler(binding, sampler, index);

        this._descriptorSet.bindTexture(binding, texture, index);
      }
      /**
       * @zh
       * 重置所有 UBO 为默认值。
       */

    }, {
      key: "resetUBOs",
      value: function resetUBOs() {
        for (var i = 0; i < this._shaderInfo.blocks.length; i++) {
          var u = this._shaderInfo.blocks[i];
          var block = this._blocks[u.binding];
          var ofs = 0;

          for (var j = 0; j < u.members.length; j++) {
            var cur = u.members[j];
            var info = this._properties[cur.name];
            var givenDefault = info && info.value;
            var value = givenDefault ? givenDefault : (0, _passUtils.getDefaultFromType)(cur.type);
            var size = ((0, _define2.GFXGetTypeSize)(cur.type) >> 2) * cur.count;

            for (var k = 0; k + value.length <= size; k += value.length) {
              block.set(value, ofs + k);
            }

            ofs += size;
          }
        }

        this._rootBufferDirty = true;
      }
      /**
       * @zh
       * 重置所有 texture 和 sampler 为初始默认值。
       */

    }, {
      key: "resetTextures",
      value: function resetTextures() {
        for (var i = 0; i < this._shaderInfo.samplers.length; i++) {
          var u = this._shaderInfo.samplers[i];

          for (var j = 0; j < u.count; j++) {
            this.resetTexture(u.name, j);
          }
        }
      }
      /**
       * @zh
       * 尝试编译 shader 并获取相关资源引用。
       * @param defineOverrides shader 预处理宏定义重载
       */

    }, {
      key: "tryCompile",
      value: function tryCompile() {
        var pipeline = this._root.pipeline;

        if (!pipeline) {
          return null;
        }

        this._syncBatchingScheme();

        this._hShaderDefault = _programLib.programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);

        if (!this._hShaderDefault) {
          console.warn("create shader ".concat(this._programName, " failed"));
          return false;
        }

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.PIPELINE_LAYOUT, _programLib.programLib.getPipelineLayout(this._programName).hPipelineLayout);

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.HASH, Pass.getPassHash(this._handle, this._hShaderDefault));

        return true;
      }
    }, {
      key: "getShaderVariant",
      value: function getShaderVariant() {
        var patches = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (!this._hShaderDefault && !this.tryCompile()) {
          console.warn("pass resources incomplete");
          return _memoryPools.NULL_HANDLE;
        }

        if (!patches) {
          return this._hShaderDefault;
        }

        if (_defaultConstants.EDITOR) {
          for (var i = 0; i < patches.length; i++) {
            if (!patches[i].name.startsWith('CC_')) {
              console.warn('cannot patch non-builtin macros');
              return _memoryPools.NULL_HANDLE;
            }
          }
        }

        var pipeline = this._root.pipeline;

        for (var _i = 0; _i < patches.length; _i++) {
          var patch = patches[_i];
          this._defines[patch.name] = patch.value;
        }

        var hShader = _programLib.programLib.getGFXShader(this._device, this._programName, this._defines, pipeline);

        for (var _i2 = 0; _i2 < patches.length; _i2++) {
          var _patch = patches[_i2];
          delete this._defines[_patch.name];
        }

        return hShader;
      } // internal use

    }, {
      key: "beginChangeStatesSilently",
      value: function beginChangeStatesSilently() {}
    }, {
      key: "endChangeStatesSilently",
      value: function endChangeStatesSilently() {}
    }, {
      key: "_doInit",
      value: function _doInit(info) {
        var copyDefines = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var handle = this._handle = _memoryPools.PassPool.alloc();

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.PRIORITY, _define.RenderPriority.DEFAULT);

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.STAGE, _define.RenderPassStage.DEFAULT);

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.PHASE, (0, _passPhase.getPhaseID)('default'));

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.PRIMITIVE, _define2.GFXPrimitiveMode.TRIANGLE_LIST);

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.RASTERIZER_STATE, _memoryPools.RasterizerStatePool.alloc());

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.DEPTH_STENCIL_STATE, _memoryPools.DepthStencilStatePool.alloc());

        _memoryPools.PassPool.set(handle, _memoryPools.PassView.BLEND_STATE, _memoryPools.BlendStatePool.alloc());

        this._passIndex = info.passIndex;
        this._propertyIndex = info.propertyIndex !== undefined ? info.propertyIndex : info.passIndex;
        this._programName = info.program;
        this._defines = copyDefines ? Object.assign({}, info.defines) : info.defines;
        this._shaderInfo = _programLib.programLib.getTemplate(info.program);
        this._properties = info.properties || this._properties; // pipeline state

        var device = this._device;
        Pass.fillPipelineInfo(handle, info);

        if (info.stateOverrides) {
          Pass.fillPipelineInfo(handle, info.stateOverrides);
        } // init descriptor set


        var setLayouts = _programLib.programLib.getPipelineLayout(info.program).setLayouts;

        if (!setLayouts[_define.SetIndex.MATERIAL]) {
          _dsLayoutInfo.bindings = this._shaderInfo.bindings;
          setLayouts[_define.SetIndex.MATERIAL] = device.createDescriptorSetLayout(_dsLayoutInfo);
        }

        _dsInfo.layout = setLayouts[_define.SetIndex.MATERIAL];

        var dsHandle = _memoryPools.DSPool.alloc(this._device, _dsInfo);

        _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.DESCRIPTOR_SET, dsHandle);

        this._descriptorSet = _memoryPools.DSPool.get(dsHandle); // calculate total size required

        var _this$_shaderInfo = this._shaderInfo,
            blocks = _this$_shaderInfo.blocks,
            blockSizes = _this$_shaderInfo.blockSizes;
        var alignment = device.uboOffsetAlignment;
        var startOffsets = [];
        var lastSize = 0;
        var lastOffset = 0;

        for (var i = 0; i < blocks.length; i++) {
          var size = blockSizes[i];
          startOffsets.push(lastOffset);
          lastOffset += Math.ceil(size / alignment) * alignment;
          lastSize = size;
        } // create gfx buffer resource


        var totalSize = startOffsets[startOffsets.length - 1] + lastSize;

        if (totalSize) {
          // https://bugs.chromium.org/p/chromium/issues/detail?id=988988
          _bufferInfo.size = Math.ceil(totalSize / 16) * 16;
          this._rootBuffer = device.createBuffer(_bufferInfo);
          this._rootBlock = new ArrayBuffer(totalSize);
        } // create buffer views


        for (var _i3 = 0, count = 0; _i3 < blocks.length; _i3++) {
          var binding = blocks[_i3].binding;
          var _size = blockSizes[_i3];
          _bufferViewInfo.buffer = this._rootBuffer;
          _bufferViewInfo.offset = startOffsets[count++];
          _bufferViewInfo.range = _size;
          var bufferView = this._buffers[binding] = device.createBuffer(_bufferViewInfo); // non-builtin UBO data pools, note that the effect compiler
          // guarantees these bindings to be consecutive, starting from 0 and non-array-typed

          this._blocks[binding] = new Float32Array(this._rootBlock, _bufferViewInfo.offset, _size / Float32Array.BYTES_PER_ELEMENT);

          this._descriptorSet.bindBuffer(binding, bufferView);
        } // store handles


        var directHandleMap = this._propertyHandleMap = this._shaderInfo.handleMap;
        var indirectHandleMap = {};

        for (var name in this._properties) {
          var prop = this._properties[name];

          if (!prop.handleInfo) {
            continue;
          }

          indirectHandleMap[name] = this.getHandle.apply(this, prop.handleInfo);
        }

        Object.assign(directHandleMap, indirectHandleMap);
      }
    }, {
      key: "_syncBatchingScheme",
      value: function _syncBatchingScheme() {
        if (this._defines.USE_INSTANCING) {
          if (this._device.hasFeature(_device.GFXFeature.INSTANCED_ARRAYS)) {
            _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BATCHING_SCHEME, BatchingSchemes.INSTANCING);
          } else {
            this._defines.USE_INSTANCING = false;

            _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BATCHING_SCHEME, 0);
          }
        } else if (this._defines.USE_BATCHING) {
          _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BATCHING_SCHEME, BatchingSchemes.VB_MERGING);
        } else {
          _memoryPools.PassPool.set(this._handle, _memoryPools.PassView.BATCHING_SCHEME, 0);
        }
      } // infos

    }, {
      key: "root",
      get: function get() {
        return this._root;
      }
    }, {
      key: "device",
      get: function get() {
        return this._device;
      }
    }, {
      key: "shaderInfo",
      get: function get() {
        return this._shaderInfo;
      }
    }, {
      key: "setLayouts",
      get: function get() {
        return _programLib.programLib.getPipelineLayout(this._programName).setLayouts;
      }
    }, {
      key: "program",
      get: function get() {
        return this._programName;
      }
    }, {
      key: "properties",
      get: function get() {
        return this._properties;
      }
    }, {
      key: "defines",
      get: function get() {
        return this._defines;
      }
    }, {
      key: "passIndex",
      get: function get() {
        return this._passIndex;
      }
    }, {
      key: "propertyIndex",
      get: function get() {
        return this._propertyIndex;
      } // data

    }, {
      key: "dynamics",
      get: function get() {
        return this._dynamics;
      }
    }, {
      key: "blocks",
      get: function get() {
        return this._blocks;
      } // states

    }, {
      key: "handle",
      get: function get() {
        return this._handle;
      }
    }, {
      key: "priority",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.PRIORITY);
      }
    }, {
      key: "primitive",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.PRIMITIVE);
      }
    }, {
      key: "stage",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.STAGE);
      }
    }, {
      key: "phase",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.PHASE);
      }
    }, {
      key: "rasterizerState",
      get: function get() {
        return _memoryPools.RasterizerStatePool.get(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.RASTERIZER_STATE));
      }
    }, {
      key: "depthStencilState",
      get: function get() {
        return _memoryPools.DepthStencilStatePool.get(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.DEPTH_STENCIL_STATE));
      }
    }, {
      key: "blendState",
      get: function get() {
        return _memoryPools.BlendStatePool.get(_memoryPools.PassPool.get(this._handle, _memoryPools.PassView.BLEND_STATE));
      }
    }, {
      key: "dynamicStates",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.DYNAMIC_STATES);
      }
    }, {
      key: "batchingScheme",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.BATCHING_SCHEME);
      }
    }, {
      key: "hash",
      get: function get() {
        return _memoryPools.PassPool.get(this._handle, _memoryPools.PassView.HASH);
      }
    }]);

    return Pass;
  }();

  _exports.Pass = Pass;
  Pass.PropertyType = _passUtils.PropertyType;
  Pass.getPropertyTypeFromHandle = _passUtils.getPropertyTypeFromHandle;
  Pass.getTypeFromHandle = _passUtils.getTypeFromHandle;
  Pass.getBindingFromHandle = _passUtils.getBindingFromHandle;
  Pass.getOffsetFromHandle = _passUtils.getOffsetFromHandle;

  function serializeBlendState(bs) {
    var res = ",bs,".concat(bs.isA2C, ",").concat(bs.blendColor);

    var _iterator = _createForOfIteratorHelper(bs.targets),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var t = _step.value;
        res += ",bt,".concat(t.blend, ",").concat(t.blendEq, ",").concat(t.blendAlphaEq, ",").concat(t.blendColorMask);
        res += ",".concat(t.blendSrc, ",").concat(t.blendDst, ",").concat(t.blendSrcAlpha, ",").concat(t.blendDstAlpha);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return res;
  }

  function serializeRasterizerState(rs) {
    return ',rs,' + rs.cullMode + ',' + rs.depthBias + ',' + rs.isFrontFaceCCW;
  }

  function serializeDepthStencilState(dss) {
    var res = ",dss,".concat(dss.depthTest, ",").concat(dss.depthWrite, ",").concat(dss.depthFunc);
    res += ",".concat(dss.stencilTestFront, ",").concat(dss.stencilFuncFront, ",").concat(dss.stencilRefFront, ",").concat(dss.stencilReadMaskFront);
    res += ",".concat(dss.stencilFailOpFront, ",").concat(dss.stencilZFailOpFront, ",").concat(dss.stencilPassOpFront, ",").concat(dss.stencilWriteMaskFront);
    res += ",".concat(dss.stencilTestBack, ",").concat(dss.stencilFuncBack, ",").concat(dss.stencilRefBack, ",").concat(dss.stencilReadMaskBack);
    res += ",".concat(dss.stencilFailOpBack, ",").concat(dss.stencilZFailOpBack, ",").concat(dss.stencilPassOpBack, ",").concat(dss.stencilWriteMaskBack);
    return res;
  }

  function serializeDynamicState(dynamicStates) {
    var res = ',ds';

    for (var ds in dynamicStates) {
      res += ',' + ds;
    }

    return res;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9wYXNzLnRzIl0sIm5hbWVzIjpbIl9idWZmZXJJbmZvIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVU5JRk9STSIsIlRSQU5TRkVSX0RTVCIsIkdGWE1lbW9yeVVzYWdlQml0IiwiSE9TVCIsIkRFVklDRSIsIl9idWZmZXJWaWV3SW5mbyIsIkdGWEJ1ZmZlclZpZXdJbmZvIiwiX2RzTGF5b3V0SW5mbyIsIkdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvIiwiX2RzSW5mbyIsIkdGWERlc2NyaXB0b3JTZXRJbmZvIiwiQmF0Y2hpbmdTY2hlbWVzIiwiUGFzcyIsImhQYXNzIiwiaW5mbyIsInByaW9yaXR5IiwidW5kZWZpbmVkIiwiUGFzc1Bvb2wiLCJzZXQiLCJQYXNzVmlldyIsIlBSSU9SSVRZIiwicHJpbWl0aXZlIiwiUFJJTUlUSVZFIiwic3RhZ2UiLCJTVEFHRSIsImR5bmFtaWNTdGF0ZXMiLCJEWU5BTUlDX1NUQVRFUyIsInBoYXNlIiwiUEhBU0UiLCJicyIsIkJsZW5kU3RhdGVQb29sIiwiZ2V0IiwiQkxFTkRfU1RBVEUiLCJibGVuZFN0YXRlIiwiYnNJbmZvIiwidGFyZ2V0cyIsImZvckVhY2giLCJ0IiwiaSIsInNldFRhcmdldCIsIkdGWEJsZW5kVGFyZ2V0IiwiT2JqZWN0IiwiYXNzaWduIiwiaXNBMkMiLCJpc0luZGVwZW5kIiwiYmxlbmRDb2xvciIsIlJhc3Rlcml6ZXJTdGF0ZVBvb2wiLCJSQVNURVJJWkVSX1NUQVRFIiwicmFzdGVyaXplclN0YXRlIiwiRGVwdGhTdGVuY2lsU3RhdGVQb29sIiwiREVQVEhfU1RFTkNJTF9TVEFURSIsImRlcHRoU3RlbmNpbFN0YXRlIiwiaFNoYWRlciIsInJlcyIsInNlcmlhbGl6ZUJsZW5kU3RhdGUiLCJzZXJpYWxpemVEZXB0aFN0ZW5jaWxTdGF0ZSIsInNlcmlhbGl6ZVJhc3Rlcml6ZXJTdGF0ZSIsInJvb3QiLCJfcm9vdEJ1ZmZlciIsIl9yb290QnVmZmVyRGlydHkiLCJfYnVmZmVycyIsIl9kZXNjcmlwdG9yU2V0IiwiX3Bhc3NJbmRleCIsIl9wcm9wZXJ0eUluZGV4IiwiX3Byb2dyYW1OYW1lIiwiX2R5bmFtaWNzIiwiX3Byb3BlcnR5SGFuZGxlTWFwIiwiX3Jvb3RCbG9jayIsIl9ibG9ja3MiLCJfc2hhZGVySW5mbyIsIl9kZWZpbmVzIiwiX3Byb3BlcnRpZXMiLCJfcm9vdCIsIl9kZXZpY2UiLCJfaFNoYWRlckRlZmF1bHQiLCJOVUxMX0hBTkRMRSIsIl9oYW5kbGUiLCJkZXZpY2UiLCJfZG9Jbml0IiwicmVzZXRVQk9zIiwicmVzZXRUZXh0dXJlcyIsInRyeUNvbXBpbGUiLCJuYW1lIiwib2Zmc2V0IiwidGFyZ2V0VHlwZSIsIkdGWFR5cGUiLCJVTktOT1dOIiwiaGFuZGxlIiwiZ2V0SGFuZGxlIiwiZ2V0QmluZGluZ0Zyb21IYW5kbGUiLCJ2YWx1ZSIsImJpbmRpbmciLCJ0eXBlIiwiZ2V0VHlwZUZyb21IYW5kbGUiLCJvZnMiLCJnZXRPZmZzZXRGcm9tSGFuZGxlIiwiYmxvY2siLCJ0eXBlMndyaXRlciIsIm91dCIsInR5cGUycmVhZGVyIiwic3RyaWRlIiwibGVuZ3RoIiwiaW5kZXgiLCJiaW5kVGV4dHVyZSIsImJpbmRTYW1wbGVyIiwic3RhdGUiLCJkcyIsImRpcnR5Iiwib3JpZ2luYWwiLCJvdmVycmlkZXMiLCJjb25zb2xlIiwid2FybiIsInVwZGF0ZSIsImJsb2NrcyIsInUiLCJkZXN0cm95IiwiZnJlZSIsIkRTUG9vbCIsIkRFU0NSSVBUT1JfU0VUIiwidGV4TmFtZSIsInRleHR1cmVCYXNlIiwiYnVpbHRpblJlc01nciIsInRleHR1cmUiLCJnZXRHRlhUZXh0dXJlIiwic2FtcGxlckhhc2giLCJnZXRTYW1wbGVySGFzaCIsInNhbXBsZXIiLCJzYW1wbGVyTGliIiwiZ2V0U2FtcGxlciIsImoiLCJtZW1iZXJzIiwiY3VyIiwiZ2l2ZW5EZWZhdWx0Iiwic2l6ZSIsImNvdW50IiwiayIsInNhbXBsZXJzIiwicmVzZXRUZXh0dXJlIiwicGlwZWxpbmUiLCJfc3luY0JhdGNoaW5nU2NoZW1lIiwicHJvZ3JhbUxpYiIsImdldEdGWFNoYWRlciIsIlBJUEVMSU5FX0xBWU9VVCIsImdldFBpcGVsaW5lTGF5b3V0IiwiaFBpcGVsaW5lTGF5b3V0IiwiSEFTSCIsImdldFBhc3NIYXNoIiwicGF0Y2hlcyIsIkVESVRPUiIsInN0YXJ0c1dpdGgiLCJwYXRjaCIsImNvcHlEZWZpbmVzIiwiYWxsb2MiLCJSZW5kZXJQcmlvcml0eSIsIkRFRkFVTFQiLCJSZW5kZXJQYXNzU3RhZ2UiLCJHRlhQcmltaXRpdmVNb2RlIiwiVFJJQU5HTEVfTElTVCIsInBhc3NJbmRleCIsInByb3BlcnR5SW5kZXgiLCJwcm9ncmFtIiwiZGVmaW5lcyIsImdldFRlbXBsYXRlIiwicHJvcGVydGllcyIsImZpbGxQaXBlbGluZUluZm8iLCJzdGF0ZU92ZXJyaWRlcyIsInNldExheW91dHMiLCJTZXRJbmRleCIsIk1BVEVSSUFMIiwiYmluZGluZ3MiLCJjcmVhdGVEZXNjcmlwdG9yU2V0TGF5b3V0IiwibGF5b3V0IiwiZHNIYW5kbGUiLCJibG9ja1NpemVzIiwiYWxpZ25tZW50IiwidWJvT2Zmc2V0QWxpZ25tZW50Iiwic3RhcnRPZmZzZXRzIiwibGFzdFNpemUiLCJsYXN0T2Zmc2V0IiwicHVzaCIsIk1hdGgiLCJjZWlsIiwidG90YWxTaXplIiwiY3JlYXRlQnVmZmVyIiwiQXJyYXlCdWZmZXIiLCJidWZmZXIiLCJyYW5nZSIsImJ1ZmZlclZpZXciLCJGbG9hdDMyQXJyYXkiLCJCWVRFU19QRVJfRUxFTUVOVCIsImJpbmRCdWZmZXIiLCJkaXJlY3RIYW5kbGVNYXAiLCJoYW5kbGVNYXAiLCJpbmRpcmVjdEhhbmRsZU1hcCIsInByb3AiLCJoYW5kbGVJbmZvIiwiYXBwbHkiLCJVU0VfSU5TVEFOQ0lORyIsImhhc0ZlYXR1cmUiLCJHRlhGZWF0dXJlIiwiSU5TVEFOQ0VEX0FSUkFZUyIsIkJBVENISU5HX1NDSEVNRSIsIklOU1RBTkNJTkciLCJVU0VfQkFUQ0hJTkciLCJWQl9NRVJHSU5HIiwiUHJvcGVydHlUeXBlIiwiZ2V0UHJvcGVydHlUeXBlRnJvbUhhbmRsZSIsImJsZW5kIiwiYmxlbmRFcSIsImJsZW5kQWxwaGFFcSIsImJsZW5kQ29sb3JNYXNrIiwiYmxlbmRTcmMiLCJibGVuZERzdCIsImJsZW5kU3JjQWxwaGEiLCJibGVuZERzdEFscGhhIiwicnMiLCJjdWxsTW9kZSIsImRlcHRoQmlhcyIsImlzRnJvbnRGYWNlQ0NXIiwiZHNzIiwiZGVwdGhUZXN0IiwiZGVwdGhXcml0ZSIsImRlcHRoRnVuYyIsInN0ZW5jaWxUZXN0RnJvbnQiLCJzdGVuY2lsRnVuY0Zyb250Iiwic3RlbmNpbFJlZkZyb250Iiwic3RlbmNpbFJlYWRNYXNrRnJvbnQiLCJzdGVuY2lsRmFpbE9wRnJvbnQiLCJzdGVuY2lsWkZhaWxPcEZyb250Iiwic3RlbmNpbFBhc3NPcEZyb250Iiwic3RlbmNpbFdyaXRlTWFza0Zyb250Iiwic3RlbmNpbFRlc3RCYWNrIiwic3RlbmNpbEZ1bmNCYWNrIiwic3RlbmNpbFJlZkJhY2siLCJzdGVuY2lsUmVhZE1hc2tCYWNrIiwic3RlbmNpbEZhaWxPcEJhY2siLCJzdGVuY2lsWkZhaWxPcEJhY2siLCJzdGVuY2lsUGFzc09wQmFjayIsInN0ZW5jaWxXcml0ZU1hc2tCYWNrIiwic2VyaWFsaXplRHluYW1pY1N0YXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlFQSxNQUFNQSxXQUFXLEdBQUcsSUFBSUMscUJBQUosQ0FDaEJDLDJCQUFrQkMsT0FBbEIsR0FBNEJELDJCQUFrQkUsWUFEOUIsRUFFaEJDLDJCQUFrQkMsSUFBbEIsR0FBeUJELDJCQUFrQkUsTUFGM0IsQ0FBcEI7O0FBS0EsTUFBTUMsZUFBZSxHQUFHLElBQUlDLHlCQUFKLENBQXNCLElBQXRCLENBQXhCOztBQUNBLE1BQU1DLGFBQWEsR0FBRyxJQUFJQyxpQ0FBSixFQUF0Qjs7QUFFQSxNQUFN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QUFnQztBQUM1QjRCLE1BQUFBLEdBQUcsSUFBSSxNQUFNcUQsRUFBYjtBQUNIOztBQUNELFdBQU9yRCxHQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE3LTIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuICB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuICB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiAgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IG1hdGVyaWFsXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRURJVE9SIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgYnVpbHRpblJlc01nciB9IGZyb20gJy4uLy4uLzNkL2J1aWx0aW4vaW5pdCc7XHJcbmltcG9ydCB7IElQYXNzSW5mbywgSVBhc3NTdGF0ZXMsIElQcm9wZXJ0eUluZm8gfSBmcm9tICcuLi8uLi9hc3NldHMvZWZmZWN0LWFzc2V0JztcclxuaW1wb3J0IHsgVGV4dHVyZUJhc2UgfSBmcm9tICcuLi8uLi9hc3NldHMvdGV4dHVyZS1iYXNlJztcclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldCwgR0ZYRGVzY3JpcHRvclNldEluZm8gfSBmcm9tICcuLi8uLi9nZngvZGVzY3JpcHRvci1zZXQnO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlckluZm8sIEdGWEJ1ZmZlclZpZXdJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4L2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWEZlYXR1cmUsIEdGWERldmljZSB9IGZyb20gJy4uLy4uL2dmeC9kZXZpY2UnO1xyXG5pbXBvcnQgeyBHRlhCbGVuZFN0YXRlLCBHRlhCbGVuZFRhcmdldCwgR0ZYRGVwdGhTdGVuY2lsU3RhdGUsIEdGWFJhc3Rlcml6ZXJTdGF0ZSB9IGZyb20gJy4uLy4uL2dmeC9waXBlbGluZS1zdGF0ZSc7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIgfSBmcm9tICcuLi8uLi9nZngvc2FtcGxlcic7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuLi8uLi9nZngvdGV4dHVyZSc7XHJcbmltcG9ydCB7IFJlbmRlclBhc3NTdGFnZSwgUmVuZGVyUHJpb3JpdHksIFNldEluZGV4IH0gZnJvbSAnLi4vLi4vcGlwZWxpbmUvZGVmaW5lJztcclxuaW1wb3J0IHsgZ2V0UGhhc2VJRCB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL3Bhc3MtcGhhc2UnO1xyXG5pbXBvcnQgeyBSb290IH0gZnJvbSAnLi4vLi4vcm9vdCc7XHJcbmltcG9ydCB7IG11cm11cmhhc2gyXzMyX2djIH0gZnJvbSAnLi4vLi4vdXRpbHMvbXVybXVyaGFzaDJfZ2MnO1xyXG5pbXBvcnQgeyBJUHJvZ3JhbUluZm8sIHByb2dyYW1MaWIgfSBmcm9tICcuL3Byb2dyYW0tbGliJztcclxuaW1wb3J0IHsgc2FtcGxlckxpYiB9IGZyb20gJy4vc2FtcGxlci1saWInO1xyXG5pbXBvcnQgeyBQYXNzVmlldywgQmxlbmRTdGF0ZVBvb2wsIFJhc3Rlcml6ZXJTdGF0ZVBvb2wsIERlcHRoU3RlbmNpbFN0YXRlUG9vbCxcclxuICAgIFBhc3NQb29sLCBEU1Bvb2wsIFBhc3NIYW5kbGUsIFNoYWRlckhhbmRsZSwgTlVMTF9IQU5ETEUgfSBmcm9tICcuL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IGN1c3RvbWl6ZVR5cGUsIGdldEJpbmRpbmdGcm9tSGFuZGxlLCBnZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlLCBnZXREZWZhdWx0RnJvbVR5cGUsXHJcbiAgICBnZXRPZmZzZXRGcm9tSGFuZGxlLCBnZXRUeXBlRnJvbUhhbmRsZSwgTWFjcm9SZWNvcmQsIE1hdGVyaWFsUHJvcGVydHksIHR5cGUycmVhZGVyLCB0eXBlMndyaXRlciwgUHJvcGVydHlUeXBlIH0gZnJvbSAnLi9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyVXNhZ2VCaXQsIEdGWEdldFR5cGVTaXplLCBHRlhNZW1vcnlVc2FnZUJpdCwgR0ZYUHJpbWl0aXZlTW9kZSxcclxuICAgIEdGWFR5cGUsIEdGWER5bmFtaWNTdGF0ZUZsYWdCaXQsIEdGWER5bmFtaWNTdGF0ZUZsYWdzIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVBhc3NJbmZvRnVsbCBleHRlbmRzIElQYXNzSW5mbyB7XHJcbiAgICAvLyBnZW5lcmF0ZWQgcGFydFxyXG4gICAgcGFzc0luZGV4OiBudW1iZXI7XHJcbiAgICBkZWZpbmVzOiBNYWNyb1JlY29yZDtcclxuICAgIHN0YXRlT3ZlcnJpZGVzPzogUGFzc092ZXJyaWRlcztcclxufVxyXG5leHBvcnQgdHlwZSBQYXNzT3ZlcnJpZGVzID0gUmVjdXJzaXZlUGFydGlhbDxJUGFzc1N0YXRlcz47XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNYWNyb1BhdGNoIHtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIHZhbHVlOiBib29sZWFuIHwgbnVtYmVyIHwgc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVBhc3NEeW5hbWljcyB7XHJcbiAgICBbdHlwZTogbnVtYmVyXToge1xyXG4gICAgICAgIGRpcnR5OiBib29sZWFuLFxyXG4gICAgICAgIHZhbHVlOiBudW1iZXJbXSxcclxuICAgIH07XHJcbn1cclxuXHJcbmNvbnN0IF9idWZmZXJJbmZvID0gbmV3IEdGWEJ1ZmZlckluZm8oXHJcbiAgICBHRlhCdWZmZXJVc2FnZUJpdC5VTklGT1JNIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuKTtcclxuXHJcbmNvbnN0IF9idWZmZXJWaWV3SW5mbyA9IG5ldyBHRlhCdWZmZXJWaWV3SW5mbyhudWxsISk7XHJcbmNvbnN0IF9kc0xheW91dEluZm8gPSBuZXcgR0ZYRGVzY3JpcHRvclNldExheW91dEluZm8oKTtcclxuXHJcbmNvbnN0IF9kc0luZm8gPSBuZXcgR0ZYRGVzY3JpcHRvclNldEluZm8obnVsbCEpO1xyXG5cclxuZXhwb3J0IGVudW0gQmF0Y2hpbmdTY2hlbWVzIHtcclxuICAgIElOU1RBTkNJTkcgPSAxLFxyXG4gICAgVkJfTUVSR0lORyA9IDIsXHJcbn07XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcclxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIFBhc3Mge1xyXG4gICAgZXhwb3J0IHR5cGUgZ2V0UHJvcGVydHlUeXBlRnJvbUhhbmRsZSA9IHR5cGVvZiBnZXRQcm9wZXJ0eVR5cGVGcm9tSGFuZGxlO1xyXG4gICAgZXhwb3J0IHR5cGUgZ2V0VHlwZUZyb21IYW5kbGUgPSB0eXBlb2YgZ2V0VHlwZUZyb21IYW5kbGU7XHJcbiAgICBleHBvcnQgdHlwZSBnZXRCaW5kaW5nRnJvbUhhbmRsZSA9IHR5cGVvZiBnZXRCaW5kaW5nRnJvbUhhbmRsZTtcclxuICAgIGV4cG9ydCB0eXBlIGZpbGxQaXBlbGluZUluZm8gPSB0eXBlb2YgUGFzcy5maWxsUGlwZWxpbmVJbmZvO1xyXG4gICAgZXhwb3J0IHR5cGUgZ2V0UGFzc0hhc2ggPSB0eXBlb2YgUGFzcy5nZXRQYXNzSGFzaDtcclxuICAgIGV4cG9ydCB0eXBlIGdldE9mZnNldEZyb21IYW5kbGUgPSB0eXBlb2YgZ2V0T2Zmc2V0RnJvbUhhbmRsZTtcclxuICAgIGV4cG9ydCB0eXBlIFByb3BlcnR5VHlwZSA9IHR5cGVvZiBQcm9wZXJ0eVR5cGU7XHJcbn1cclxuLy8gdHNsaW50OmVuYWJsZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5riy5p+TIHBhc3PvvIzlgqjlrZjlrp7pmYXmj4/ov7Dnu5jliLbov4fnqIvnmoTlkITpobnotYTmupDjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQYXNzIHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja4gaGFuZGxlIOiOt+WPliB1bmZvcm0g55qE57uR5a6a57G75Z6L77yIVUJPIOaIlui0tOWbvuetie+8ieOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFByb3BlcnR5VHlwZSA9IFByb3BlcnR5VHlwZTtcclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0UHJvcGVydHlUeXBlRnJvbUhhbmRsZSA9IGdldFByb3BlcnR5VHlwZUZyb21IYW5kbGU7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOagueaNriBoYW5kbGUg6I635Y+WIFVCTyBtZW1iZXIg55qE5YW35L2T57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0VHlwZUZyb21IYW5kbGUgPSBnZXRUeXBlRnJvbUhhbmRsZTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2uIGhhbmRsZSDojrflj5YgYmluZGluZ+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGdldEJpbmRpbmdGcm9tSGFuZGxlID0gZ2V0QmluZGluZ0Zyb21IYW5kbGU7XHJcblxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZmlsbFBpcGVsaW5lSW5mbyAoaFBhc3M6IFBhc3NIYW5kbGUsIGluZm86IFBhc3NPdmVycmlkZXMpIHtcclxuICAgICAgICBpZiAoaW5mby5wcmlvcml0eSAhPT0gdW5kZWZpbmVkKSB7IFBhc3NQb29sLnNldChoUGFzcywgUGFzc1ZpZXcuUFJJT1JJVFksIGluZm8ucHJpb3JpdHkpOyB9XHJcbiAgICAgICAgaWYgKGluZm8ucHJpbWl0aXZlICE9PSB1bmRlZmluZWQpIHsgUGFzc1Bvb2wuc2V0KGhQYXNzLCBQYXNzVmlldy5QUklNSVRJVkUsIGluZm8ucHJpbWl0aXZlKTsgfVxyXG4gICAgICAgIGlmIChpbmZvLnN0YWdlICE9PSB1bmRlZmluZWQpIHsgUGFzc1Bvb2wuc2V0KGhQYXNzLCBQYXNzVmlldy5TVEFHRSwgaW5mby5zdGFnZSk7IH1cclxuICAgICAgICBpZiAoaW5mby5keW5hbWljU3RhdGVzICE9PSB1bmRlZmluZWQpIHsgUGFzc1Bvb2wuc2V0KGhQYXNzLCBQYXNzVmlldy5EWU5BTUlDX1NUQVRFUywgaW5mby5keW5hbWljU3RhdGVzKTsgfVxyXG4gICAgICAgIGlmIChpbmZvLnBoYXNlICE9PSB1bmRlZmluZWQpIHsgUGFzc1Bvb2wuc2V0KGhQYXNzLCBQYXNzVmlldy5QSEFTRSwgZ2V0UGhhc2VJRChpbmZvLnBoYXNlKSk7IH1cclxuXHJcbiAgICAgICAgY29uc3QgYnMgPSBCbGVuZFN0YXRlUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5CTEVORF9TVEFURSkpO1xyXG4gICAgICAgIGlmIChpbmZvLmJsZW5kU3RhdGUpIHtcclxuICAgICAgICAgICAgY29uc3QgYnNJbmZvID0gaW5mby5ibGVuZFN0YXRlO1xyXG4gICAgICAgICAgICBpZiAoYnNJbmZvLnRhcmdldHMpIHtcclxuICAgICAgICAgICAgICAgIGJzSW5mby50YXJnZXRzLmZvckVhY2goKHQsIGkpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWJzLnRhcmdldHNbaV0pIGJzLnNldFRhcmdldChpLCBuZXcgR0ZYQmxlbmRUYXJnZXQoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihicy50YXJnZXRzW2ldLCB0KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChic0luZm8uaXNBMkMgIT09IHVuZGVmaW5lZCkgeyBicy5pc0EyQyA9IGJzSW5mby5pc0EyQzsgfVxyXG4gICAgICAgICAgICBpZiAoYnNJbmZvLmlzSW5kZXBlbmQgIT09IHVuZGVmaW5lZCkgeyBicy5pc0luZGVwZW5kID0gYnNJbmZvLmlzSW5kZXBlbmQ7IH1cclxuICAgICAgICAgICAgaWYgKGJzSW5mby5ibGVuZENvbG9yICE9PSB1bmRlZmluZWQpIHsgT2JqZWN0LmFzc2lnbihicy5ibGVuZENvbG9yLCBic0luZm8uYmxlbmRDb2xvcik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihSYXN0ZXJpemVyU3RhdGVQb29sLmdldChQYXNzUG9vbC5nZXQoaFBhc3MsIFBhc3NWaWV3LlJBU1RFUklaRVJfU1RBVEUpKSwgaW5mby5yYXN0ZXJpemVyU3RhdGUpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oRGVwdGhTdGVuY2lsU3RhdGVQb29sLmdldChQYXNzUG9vbC5nZXQoaFBhc3MsIFBhc3NWaWV3LkRFUFRIX1NURU5DSUxfU1RBVEUpKSwgaW5mby5kZXB0aFN0ZW5jaWxTdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCBwYXNzIGhhc2ggdmFsdWUgYnkgW1tQYXNzXV0gaGFzaCBpbmZvcm1hdGlvbi5cclxuICAgICAqIEB6aFxyXG4gICAgICog5qC55o2uIFtbUGFzc11dIOeahOWTiOW4jOS/oeaBr+iOt+WPluWTiOW4jOWAvOOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBoUGFzcyBIYW5kbGUgb2YgdGhlIHBhc3MgaW5mbyB1c2VkIHRvIGNvbXB1dGUgaGFzaCB2YWx1ZS5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBnZXRQYXNzSGFzaCAoaFBhc3M6IFBhc3NIYW5kbGUsIGhTaGFkZXI6IFNoYWRlckhhbmRsZSkge1xyXG4gICAgICAgIGxldCByZXMgPSBoU2hhZGVyICsgJywnICsgUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5QUklNSVRJVkUpICsgJywnICsgUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5EWU5BTUlDX1NUQVRFUyk7XHJcbiAgICAgICAgcmVzICs9IHNlcmlhbGl6ZUJsZW5kU3RhdGUoQmxlbmRTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldChoUGFzcywgUGFzc1ZpZXcuQkxFTkRfU1RBVEUpKSk7XHJcbiAgICAgICAgcmVzICs9IHNlcmlhbGl6ZURlcHRoU3RlbmNpbFN0YXRlKERlcHRoU3RlbmNpbFN0YXRlUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5ERVBUSF9TVEVOQ0lMX1NUQVRFKSkpO1xyXG4gICAgICAgIHJlcyArPSBzZXJpYWxpemVSYXN0ZXJpemVyU3RhdGUoUmFzdGVyaXplclN0YXRlUG9vbC5nZXQoUGFzc1Bvb2wuZ2V0KGhQYXNzLCBQYXNzVmlldy5SQVNURVJJWkVSX1NUQVRFKSkpO1xyXG4gICAgICAgIHJldHVybiBtdXJtdXJoYXNoMl8zMl9nYyhyZXMsIDY2Nik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBnZXRPZmZzZXRGcm9tSGFuZGxlID0gZ2V0T2Zmc2V0RnJvbUhhbmRsZTtcclxuXHJcbiAgICAvLyBpbnRlcm5hbCByZXNvdXJjZXNcclxuICAgIHByb3RlY3RlZCBfcm9vdEJ1ZmZlcjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3Jvb3RCdWZmZXJEaXJ0eSA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9idWZmZXJzOiBHRlhCdWZmZXJbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9kZXNjcmlwdG9yU2V0OiBHRlhEZXNjcmlwdG9yU2V0ID0gbnVsbCE7XHJcbiAgICAvLyBpbnRlcm5hbCBkYXRhXHJcbiAgICBwcm90ZWN0ZWQgX3Bhc3NJbmRleCA9IDA7XHJcbiAgICBwcm90ZWN0ZWQgX3Byb3BlcnR5SW5kZXggPSAwO1xyXG4gICAgcHJvdGVjdGVkIF9wcm9ncmFtTmFtZSA9ICcnO1xyXG4gICAgcHJvdGVjdGVkIF9keW5hbWljczogSVBhc3NEeW5hbWljcyA9IHt9O1xyXG4gICAgcHJvdGVjdGVkIF9wcm9wZXJ0eUhhbmRsZU1hcDogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xyXG4gICAgcHJvdGVjdGVkIF9yb290QmxvY2s6IEFycmF5QnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX2Jsb2NrczogRmxvYXQzMkFycmF5W10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfc2hhZGVySW5mbzogSVByb2dyYW1JbmZvID0gbnVsbCE7XHJcbiAgICBwcm90ZWN0ZWQgX2RlZmluZXM6IE1hY3JvUmVjb3JkID0ge307XHJcbiAgICBwcm90ZWN0ZWQgX3Byb3BlcnRpZXM6IFJlY29yZDxzdHJpbmcsIElQcm9wZXJ0eUluZm8+ID0ge307XHJcbiAgICAvLyBleHRlcm5hbCByZWZlcmVuY2VzXHJcbiAgICBwcm90ZWN0ZWQgX3Jvb3Q6IFJvb3Q7XHJcbiAgICBwcm90ZWN0ZWQgX2RldmljZTogR0ZYRGV2aWNlO1xyXG4gICAgLy8gbmF0aXZlIGRhdGFcclxuICAgIHByb3RlY3RlZCBfaFNoYWRlckRlZmF1bHQ6IFNoYWRlckhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHJvdGVjdGVkIF9oYW5kbGU6IFBhc3NIYW5kbGUgPSBOVUxMX0hBTkRMRTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocm9vdDogUm9vdCkge1xyXG4gICAgICAgIHRoaXMuX3Jvb3QgPSByb290O1xyXG4gICAgICAgIHRoaXMuX2RldmljZSA9IHJvb3QuZGV2aWNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja7mjIflrprlj4LmlbDliJ3lp4vljJblvZPliY0gcGFzc++8jHNoYWRlciDkvJrlnKjov5nkuIDpmLbmrrXlsLHlsJ3or5XnvJbor5HjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGluaXRpYWxpemUgKGluZm86IElQYXNzSW5mb0Z1bGwpIHtcclxuICAgICAgICB0aGlzLl9kb0luaXQoaW5mbyk7XHJcbiAgICAgICAgdGhpcy5yZXNldFVCT3MoKTtcclxuICAgICAgICB0aGlzLnJlc2V0VGV4dHVyZXMoKTtcclxuICAgICAgICB0aGlzLnRyeUNvbXBpbGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0IHRoZSBoYW5kbGUgb2YgYSBVQk8gbWVtYmVyLCBvciBzcGVjaWZpYyBjaGFubmVscyBvZiBpdC5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5oyH5a6aIFVCTyDmiJDlkZjvvIzmiJblhbbmm7TlhbfkvZPliIbph4/nmoTor7vlhpnlj6Xmn4TjgILpu5jorqTku6XmiJDlkZjoh6rouqvnmoTnsbvlnovkuLrnm67moIfor7vlhpnnsbvlnovvvIjljbPor7vlhpnml7blv4XpobvkvKDlhaXkuI7miJDlkZjnsbvlnovnm7jlkIznmoTlj5jph4/vvInjgIJcclxuICAgICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIHRhcmdldCBVQk8gbWVtYmVyLlxyXG4gICAgICogQHBhcmFtIG9mZnNldCBDaGFubmVsIG9mZnNldCBpbnRvIHRoZSBtZW1iZXIuXHJcbiAgICAgKiBAcGFyYW0gdGFyZ2V0VHlwZSBUYXJnZXQgdHlwZSBvZiB0aGUgaGFuZGxlLCBpLmUuIHRoZSB0eXBlIG9mIGRhdGEgd2hlbiByZWFkL3dyaXRlIHRvIGl0LlxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogaW1wb3J0IHsgVmVjMywgR0ZYVHlwZSB9IGZyb20gJ2NjJztcclxuICAgICAqIC8vIHNheSAncGJyUGFyYW1zJyBpcyBhIHVuaWZvcm0gdmVjNFxyXG4gICAgICogY29uc3QgaFBhcmFtcyA9IHBhc3MuZ2V0SGFuZGxlKCdwYnJQYXJhbXMnKTsgLy8gZ2V0IHRoZSBkZWZhdWx0IGhhbmRsZVxyXG4gICAgICogcGFzcy5zZXRVbmlmb3JtKGhBbGJlZG8sIG5ldyBWZWMzKDEsIDAsIDApKTsgLy8gd3JvbmchIHBiclBhcmFtcy53IGlzIE5hTiBub3dcclxuICAgICAqXHJcbiAgICAgKiAvLyBzYXkgJ2FsYmVkb1NjYWxlJyBpcyBhIHVuaWZvcm0gdmVjNCwgYW5kIHdlIG9ubHkgd2FudCB0byBtb2RpZnkgdGhlIHcgY29tcG9uZW50IGluIHRoZSBmb3JtIG9mIGEgc2luZ2xlIGZsb2F0XHJcbiAgICAgKiBjb25zdCBoVGhyZXNob2xkID0gcGFzcy5nZXRIYW5kbGUoJ2FsYmVkb1NjYWxlJywgMywgR0ZYVHlwZS5GTE9BVCk7XHJcbiAgICAgKiBwYXNzLnNldFVuaWZvcm0oaFRocmVzaG9sZCwgMC41KTsgLy8gbm93LCBhbGJlZG9TY2FsZS53ID0gMC41XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEhhbmRsZSAobmFtZTogc3RyaW5nLCBvZmZzZXQgPSAwLCB0YXJnZXRUeXBlID0gR0ZYVHlwZS5VTktOT1dOKSB7XHJcbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuX3Byb3BlcnR5SGFuZGxlTWFwW25hbWVdOyBpZiAoIWhhbmRsZSkgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgIGlmICh0YXJnZXRUeXBlKSB7IGhhbmRsZSA9IGN1c3RvbWl6ZVR5cGUoaGFuZGxlLCB0YXJnZXRUeXBlKTsgfVxyXG4gICAgICAgIGVsc2UgaWYgKG9mZnNldCkgeyBoYW5kbGUgPSBjdXN0b21pemVUeXBlKGhhbmRsZSwgZ2V0VHlwZUZyb21IYW5kbGUoaGFuZGxlKSAtIG9mZnNldCk7IH1cclxuICAgICAgICByZXR1cm4gaGFuZGxlICsgb2Zmc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjIflrpogdW5pZm9ybSDnmoQgYmluZGluZ+OAglxyXG4gICAgICogQHBhcmFtIG5hbWUg55uu5qCHIHVuaWZvcm0g5ZCN44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCaW5kaW5nIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSB0aGlzLmdldEhhbmRsZShuYW1lKTtcclxuICAgICAgICBpZiAoIWhhbmRsZSkgeyByZXR1cm4gLTE7IH1cclxuICAgICAgICByZXR1cm4gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7mjIflrprmma7pgJrlkJHph4/nsbsgdW5pZm9ybSDnmoTlgLzvvIzlpoLmnpzpnIDopoHpopHnuYHmm7TmlrDor7flsL3ph4/kvb/nlKjmraTmjqXlj6PjgIJcclxuICAgICAqIEBwYXJhbSBoYW5kbGUg55uu5qCHIHVuaWZvcm0g55qEIGhhbmRsZeOAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIOebruagh+WAvOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0VW5pZm9ybSAoaGFuZGxlOiBudW1iZXIsIHZhbHVlOiBNYXRlcmlhbFByb3BlcnR5KSB7XHJcbiAgICAgICAgY29uc3QgYmluZGluZyA9IFBhc3MuZ2V0QmluZGluZ0Zyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICBjb25zdCB0eXBlID0gUGFzcy5nZXRUeXBlRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IG9mcyA9IFBhc3MuZ2V0T2Zmc2V0RnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5fYmxvY2tzW2JpbmRpbmddO1xyXG4gICAgICAgIHR5cGUyd3JpdGVyW3R5cGVdKGJsb2NrLCB2YWx1ZSwgb2ZzKTtcclxuICAgICAgICB0aGlzLl9yb290QnVmZmVyRGlydHkgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5bmjIflrprmma7pgJrlkJHph4/nsbsgdW5pZm9ybSDnmoTlgLzjgIJcclxuICAgICAqIEBwYXJhbSBoYW5kbGUg55uu5qCHIHVuaWZvcm0g55qEIGhhbmRsZeOAglxyXG4gICAgICogQHBhcmFtIG91dCDovpPlh7rlkJHph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFVuaWZvcm0gKGhhbmRsZTogbnVtYmVyLCBvdXQ6IE1hdGVyaWFsUHJvcGVydHkpIHtcclxuICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IHR5cGUgPSBQYXNzLmdldFR5cGVGcm9tSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgY29uc3Qgb2ZzID0gUGFzcy5nZXRPZmZzZXRGcm9tSGFuZGxlKGhhbmRsZSk7XHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLl9ibG9ja3NbYmluZGluZ107XHJcbiAgICAgICAgcmV0dXJuIHR5cGUycmVhZGVyW3R5cGVdKGJsb2NrLCBvdXQsIG9mcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruaMh+WumuaVsOe7hOexuyB1bmlmb3JtIOeahOWAvO+8jOWmguaenOmcgOimgemikee5geabtOaWsOivt+WwvemHj+S9v+eUqOatpOaOpeWPo+OAglxyXG4gICAgICogQHBhcmFtIGhhbmRsZSDnm67moIcgdW5pZm9ybSDnmoQgaGFuZGxl44CCXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUg55uu5qCH5YC844CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRVbmlmb3JtQXJyYXkgKGhhbmRsZTogbnVtYmVyLCB2YWx1ZTogTWF0ZXJpYWxQcm9wZXJ0eVtdKSB7XHJcbiAgICAgICAgY29uc3QgYmluZGluZyA9IFBhc3MuZ2V0QmluZGluZ0Zyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICBjb25zdCB0eXBlID0gUGFzcy5nZXRUeXBlRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IHN0cmlkZSA9IEdGWEdldFR5cGVTaXplKHR5cGUpID4+IDI7XHJcbiAgICAgICAgY29uc3QgYmxvY2sgPSB0aGlzLl9ibG9ja3NbYmluZGluZ107XHJcbiAgICAgICAgbGV0IG9mcyA9IFBhc3MuZ2V0T2Zmc2V0RnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyssIG9mcyArPSBzdHJpZGUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlW2ldID09PSBudWxsKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIHR5cGUyd3JpdGVyW3R5cGVdKGJsb2NrLCB2YWx1ZVtpXSwgb2ZzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fcm9vdEJ1ZmZlckRpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog57uR5a6a5a6e6ZmFIFtbR0ZYVGV4dHVyZV1dIOWIsOaMh+WumiBiaW5kaW5n44CCXHJcbiAgICAgKiBAcGFyYW0gYmluZGluZyDnm67moIfotLTlm77nsbsgdW5pZm9ybSDnmoQgYmluZGluZ+OAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIOebruaghyB0ZXh0dXJlXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBiaW5kVGV4dHVyZSAoYmluZGluZzogbnVtYmVyLCB2YWx1ZTogR0ZYVGV4dHVyZSwgaW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKGJpbmRpbmcsIHZhbHVlLCBpbmRleCB8fCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog57uR5a6a5a6e6ZmFIFtbR0ZYU2FtcGxlcl1dIOWIsOaMh+WumiBiaW5kaW5n44CCXHJcbiAgICAgKiBAcGFyYW0gYmluZGluZyDnm67moIfotLTlm77nsbsgdW5pZm9ybSDnmoQgYmluZGluZ+OAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIOebruaghyBzYW1wbGVy44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBiaW5kU2FtcGxlciAoYmluZGluZzogbnVtYmVyLCB2YWx1ZTogR0ZYU2FtcGxlciwgaW5kZXg/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRTYW1wbGVyKGJpbmRpbmcsIHZhbHVlLCBpbmRleCB8fCAwKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6K6+572u6L+Q6KGM5pe2IHBhc3Mg5YaF5Y+v5Yqo5oCB5pu05paw55qE566h57q/54q25oCB5bGe5oCn44CCXHJcbiAgICAgKiBAcGFyYW0gc3RhdGUg55uu5qCH566h57q/54q25oCB44CCXHJcbiAgICAgKiBAcGFyYW0gdmFsdWUg55uu5qCH5YC844CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXREeW5hbWljU3RhdGUgKHN0YXRlOiBHRlhEeW5hbWljU3RhdGVGbGFnQml0LCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgZHMgPSB0aGlzLl9keW5hbWljc1tzdGF0ZV07XHJcbiAgICAgICAgaWYgKGRzICYmIGRzLnZhbHVlID09PSB2YWx1ZSkgeyByZXR1cm47IH1cclxuICAgICAgICBkcy52YWx1ZSA9IHZhbHVlOyBkcy5kaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmHjei9veW9k+WJjeaJgOacieeuoee6v+eKtuaAgeOAglxyXG4gICAgICogQHBhcmFtIG9yaWdpbmFsIOWOn+Wni+euoee6v+eKtuaAgeOAglxyXG4gICAgICogQHBhcmFtIHZhbHVlIOeuoee6v+eKtuaAgemHjei9veWAvOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgb3ZlcnJpZGVQaXBlbGluZVN0YXRlcyAob3JpZ2luYWw6IElQYXNzSW5mbywgb3ZlcnJpZGVzOiBQYXNzT3ZlcnJpZGVzKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKCdiYXNlIHBhc3MgY2Fubm90IG92ZXJyaWRlIHN0YXRlcywgcGxlYXNlIHVzZSBwYXNzIGluc3RhbmNlIGluc3RlYWQuJyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOabtOaWsOW9k+WJjSBVbmlmb3JtIOaVsOaNruOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcm9vdEJ1ZmZlckRpcnR5ICYmIHRoaXMuX3Jvb3RCdWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdEJ1ZmZlci51cGRhdGUodGhpcy5fcm9vdEJsb2NrISk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCdWZmZXJEaXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4HlvZPliY0gcGFzc+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFkZXJJbmZvLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1ID0gdGhpcy5fc2hhZGVySW5mby5ibG9ja3NbaV07XHJcbiAgICAgICAgICAgIHRoaXMuX2J1ZmZlcnNbdS5iaW5kaW5nXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2J1ZmZlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3Jvb3RCdWZmZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdEJ1ZmZlci5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCbG9jayA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyB0ZXh0dXJlcyBhcmUgcmV1c2VkXHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldCA9IG51bGwhO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5faGFuZGxlKSB7XHJcbiAgICAgICAgICAgIFJhc3Rlcml6ZXJTdGF0ZVBvb2wuZnJlZShQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5SQVNURVJJWkVSX1NUQVRFKSk7XHJcbiAgICAgICAgICAgIERlcHRoU3RlbmNpbFN0YXRlUG9vbC5mcmVlKFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkRFUFRIX1NURU5DSUxfU1RBVEUpKTtcclxuICAgICAgICAgICAgQmxlbmRTdGF0ZVBvb2wuZnJlZShQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5CTEVORF9TVEFURSkpO1xyXG4gICAgICAgICAgICBEU1Bvb2wuZnJlZShQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCkpO1xyXG4gICAgICAgICAgICBQYXNzUG9vbC5mcmVlKHRoaXMuX2hhbmRsZSk7IHRoaXMuX2hhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6YeN572u5oyH5a6a77yI6Z2e5pWw57uE77yJIFVuaWZvcm0g5Li6IEVmZmVjdCDpu5jorqTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0VW5pZm9ybSAobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgaGFuZGxlID0gdGhpcy5nZXRIYW5kbGUobmFtZSkhO1xyXG4gICAgICAgIGlmICghaGFuZGxlKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFBhc3MuZ2V0VHlwZUZyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IG9mcyA9IFBhc3MuZ2V0T2Zmc2V0RnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5fYmxvY2tzW2JpbmRpbmddO1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5mbyAmJiBpbmZvLnZhbHVlIHx8IGdldERlZmF1bHRGcm9tVHlwZSh0eXBlKTtcclxuICAgICAgICB0eXBlMndyaXRlclt0eXBlXShibG9jaywgdmFsdWUsIG9mcyk7XHJcbiAgICAgICAgdGhpcy5fcm9vdEJ1ZmZlckRpcnR5ID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6YeN572u5oyH5a6a6LS05Zu+5Li6IEVmZmVjdCDpu5jorqTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0VGV4dHVyZSAobmFtZTogc3RyaW5nLCBpbmRleD86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IHRoaXMuZ2V0SGFuZGxlKG5hbWUpO1xyXG4gICAgICAgIGlmICghaGFuZGxlKSByZXR1cm47XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IFBhc3MuZ2V0VHlwZUZyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9wcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5mbyAmJiBpbmZvLnZhbHVlO1xyXG4gICAgICAgIGNvbnN0IHRleE5hbWUgPSB2YWx1ZSA/IHZhbHVlICsgJy10ZXh0dXJlJyA6IGdldERlZmF1bHRGcm9tVHlwZSh0eXBlKSBhcyBzdHJpbmc7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZUJhc2UgPSBidWlsdGluUmVzTWdyLmdldDxUZXh0dXJlQmFzZT4odGV4TmFtZSk7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IHRleHR1cmVCYXNlICYmIHRleHR1cmVCYXNlLmdldEdGWFRleHR1cmUoKSE7XHJcbiAgICAgICAgY29uc3Qgc2FtcGxlckhhc2ggPSBpbmZvICYmIChpbmZvLnNhbXBsZXJIYXNoICE9PSB1bmRlZmluZWQpID8gaW5mby5zYW1wbGVySGFzaCA6IHRleHR1cmVCYXNlLmdldFNhbXBsZXJIYXNoKCk7XHJcbiAgICAgICAgY29uc3Qgc2FtcGxlciA9IHNhbXBsZXJMaWIuZ2V0U2FtcGxlcih0aGlzLl9kZXZpY2UsIHNhbXBsZXJIYXNoKTtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRTYW1wbGVyKGJpbmRpbmcsIHNhbXBsZXIsIGluZGV4KTtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRUZXh0dXJlKGJpbmRpbmcsIHRleHR1cmUsIGluZGV4KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6YeN572u5omA5pyJIFVCTyDkuLrpu5jorqTlgLzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0VUJPcyAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFkZXJJbmZvLmJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCB1ID0gdGhpcy5fc2hhZGVySW5mby5ibG9ja3NbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGJsb2NrID0gdGhpcy5fYmxvY2tzW3UuYmluZGluZ107XHJcbiAgICAgICAgICAgIGxldCBvZnMgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHUubWVtYmVycy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY3VyID0gdS5tZW1iZXJzW2pdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMuX3Byb3BlcnRpZXNbY3VyLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ2l2ZW5EZWZhdWx0ID0gaW5mbyAmJiBpbmZvLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSAoZ2l2ZW5EZWZhdWx0ID8gZ2l2ZW5EZWZhdWx0IDogZ2V0RGVmYXVsdEZyb21UeXBlKGN1ci50eXBlKSkgYXMgbnVtYmVyW107XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzaXplID0gKEdGWEdldFR5cGVTaXplKGN1ci50eXBlKSA+PiAyKSAqIGN1ci5jb3VudDtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrICsgdmFsdWUubGVuZ3RoIDw9IHNpemU7IGsgKz0gdmFsdWUubGVuZ3RoKSB7IGJsb2NrLnNldCh2YWx1ZSwgb2ZzICsgayk7IH1cclxuICAgICAgICAgICAgICAgIG9mcyArPSBzaXplO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3Jvb3RCdWZmZXJEaXJ0eSA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmHjee9ruaJgOaciSB0ZXh0dXJlIOWSjCBzYW1wbGVyIOS4uuWIneWni+m7mOiupOWAvOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzZXRUZXh0dXJlcyAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zaGFkZXJJbmZvLnNhbXBsZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHUgPSB0aGlzLl9zaGFkZXJJbmZvLnNhbXBsZXJzW2ldO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHUuY291bnQ7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXNldFRleHR1cmUodS5uYW1lLCBqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCd6K+V57yW6K+RIHNoYWRlciDlubbojrflj5bnm7jlhbPotYTmupDlvJXnlKjjgIJcclxuICAgICAqIEBwYXJhbSBkZWZpbmVPdmVycmlkZXMgc2hhZGVyIOmihOWkhOeQhuWuj+WumuS5iemHjei9vVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJ5Q29tcGlsZSAoKSB7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSB0aGlzLl9yb290LnBpcGVsaW5lO1xyXG4gICAgICAgIGlmICghcGlwZWxpbmUpIHsgcmV0dXJuIG51bGw7IH1cclxuICAgICAgICB0aGlzLl9zeW5jQmF0Y2hpbmdTY2hlbWUoKTtcclxuICAgICAgICB0aGlzLl9oU2hhZGVyRGVmYXVsdCA9IHByb2dyYW1MaWIuZ2V0R0ZYU2hhZGVyKHRoaXMuX2RldmljZSwgdGhpcy5fcHJvZ3JhbU5hbWUsIHRoaXMuX2RlZmluZXMsIHBpcGVsaW5lKTtcclxuICAgICAgICBpZiAoIXRoaXMuX2hTaGFkZXJEZWZhdWx0KSB7IGNvbnNvbGUud2FybihgY3JlYXRlIHNoYWRlciAke3RoaXMuX3Byb2dyYW1OYW1lfSBmYWlsZWRgKTsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuUElQRUxJTkVfTEFZT1VULCBwcm9ncmFtTGliLmdldFBpcGVsaW5lTGF5b3V0KHRoaXMuX3Byb2dyYW1OYW1lKS5oUGlwZWxpbmVMYXlvdXQpO1xyXG4gICAgICAgIFBhc3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkhBU0gsIFBhc3MuZ2V0UGFzc0hhc2godGhpcy5faGFuZGxlLCB0aGlzLl9oU2hhZGVyRGVmYXVsdCkpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRTaGFkZXJWYXJpYW50IChwYXRjaGVzOiBJTWFjcm9QYXRjaFtdIHwgbnVsbCA9IG51bGwpOiBTaGFkZXJIYW5kbGUge1xyXG4gICAgICAgIGlmICghdGhpcy5faFNoYWRlckRlZmF1bHQgJiYgIXRoaXMudHJ5Q29tcGlsZSgpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihgcGFzcyByZXNvdXJjZXMgaW5jb21wbGV0ZWApO1xyXG4gICAgICAgICAgICByZXR1cm4gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXBhdGNoZXMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2hTaGFkZXJEZWZhdWx0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKEVESVRPUikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBhdGNoZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghcGF0Y2hlc1tpXS5uYW1lLnN0YXJ0c1dpdGgoJ0NDXycpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCdjYW5ub3QgcGF0Y2ggbm9uLWJ1aWx0aW4gbWFjcm9zJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE5VTExfSEFORExFO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMuX3Jvb3QucGlwZWxpbmUhO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRjaCA9IHBhdGNoZXNbaV07XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmluZXNbcGF0Y2gubmFtZV0gPSBwYXRjaC52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhTaGFkZXIgPSBwcm9ncmFtTGliLmdldEdGWFNoYWRlcih0aGlzLl9kZXZpY2UsIHRoaXMuX3Byb2dyYW1OYW1lLCB0aGlzLl9kZWZpbmVzLCBwaXBlbGluZSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGF0Y2hlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwYXRjaCA9IHBhdGNoZXNbaV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9kZWZpbmVzW3BhdGNoLm5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gaFNoYWRlcjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBpbnRlcm5hbCB1c2VcclxuICAgIHB1YmxpYyBiZWdpbkNoYW5nZVN0YXRlc1NpbGVudGx5ICgpIHt9XHJcbiAgICBwdWJsaWMgZW5kQ2hhbmdlU3RhdGVzU2lsZW50bHkgKCkge31cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2RvSW5pdCAoaW5mbzogSVBhc3NJbmZvRnVsbCwgY29weURlZmluZXMgPSBmYWxzZSkge1xyXG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IHRoaXMuX2hhbmRsZSA9IFBhc3NQb29sLmFsbG9jKCk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KGhhbmRsZSwgUGFzc1ZpZXcuUFJJT1JJVFksIFJlbmRlclByaW9yaXR5LkRFRkFVTFQpO1xyXG4gICAgICAgIFBhc3NQb29sLnNldChoYW5kbGUsIFBhc3NWaWV3LlNUQUdFLCBSZW5kZXJQYXNzU3RhZ2UuREVGQVVMVCk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KGhhbmRsZSwgUGFzc1ZpZXcuUEhBU0UsIGdldFBoYXNlSUQoJ2RlZmF1bHQnKSk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KGhhbmRsZSwgUGFzc1ZpZXcuUFJJTUlUSVZFLCBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0xJU1QpO1xyXG4gICAgICAgIFBhc3NQb29sLnNldChoYW5kbGUsIFBhc3NWaWV3LlJBU1RFUklaRVJfU1RBVEUsIFJhc3Rlcml6ZXJTdGF0ZVBvb2wuYWxsb2MoKSk7XHJcbiAgICAgICAgUGFzc1Bvb2wuc2V0KGhhbmRsZSwgUGFzc1ZpZXcuREVQVEhfU1RFTkNJTF9TVEFURSwgRGVwdGhTdGVuY2lsU3RhdGVQb29sLmFsbG9jKCkpO1xyXG4gICAgICAgIFBhc3NQb29sLnNldChoYW5kbGUsIFBhc3NWaWV3LkJMRU5EX1NUQVRFLCBCbGVuZFN0YXRlUG9vbC5hbGxvYygpKTtcclxuXHJcbiAgICAgICAgdGhpcy5fcGFzc0luZGV4ID0gaW5mby5wYXNzSW5kZXg7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlJbmRleCA9IGluZm8ucHJvcGVydHlJbmRleCAhPT0gdW5kZWZpbmVkID8gaW5mby5wcm9wZXJ0eUluZGV4IDogaW5mby5wYXNzSW5kZXg7XHJcbiAgICAgICAgdGhpcy5fcHJvZ3JhbU5hbWUgPSBpbmZvLnByb2dyYW07XHJcbiAgICAgICAgdGhpcy5fZGVmaW5lcyA9IGNvcHlEZWZpbmVzID8gT2JqZWN0LmFzc2lnbih7fSwgaW5mby5kZWZpbmVzKSA6IGluZm8uZGVmaW5lcztcclxuICAgICAgICB0aGlzLl9zaGFkZXJJbmZvID0gcHJvZ3JhbUxpYi5nZXRUZW1wbGF0ZShpbmZvLnByb2dyYW0pO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnRpZXMgPSBpbmZvLnByb3BlcnRpZXMgfHwgdGhpcy5fcHJvcGVydGllcztcclxuICAgICAgICAvLyBwaXBlbGluZSBzdGF0ZVxyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHRoaXMuX2RldmljZTtcclxuICAgICAgICBQYXNzLmZpbGxQaXBlbGluZUluZm8oaGFuZGxlLCBpbmZvKTtcclxuICAgICAgICBpZiAoaW5mby5zdGF0ZU92ZXJyaWRlcykgeyBQYXNzLmZpbGxQaXBlbGluZUluZm8oaGFuZGxlLCBpbmZvLnN0YXRlT3ZlcnJpZGVzKTsgfVxyXG5cclxuICAgICAgICAvLyBpbml0IGRlc2NyaXB0b3Igc2V0XHJcbiAgICAgICAgY29uc3Qgc2V0TGF5b3V0cyA9IHByb2dyYW1MaWIuZ2V0UGlwZWxpbmVMYXlvdXQoaW5mby5wcm9ncmFtKS5zZXRMYXlvdXRzO1xyXG4gICAgICAgIGlmICghc2V0TGF5b3V0c1tTZXRJbmRleC5NQVRFUklBTF0pIHtcclxuICAgICAgICAgICAgX2RzTGF5b3V0SW5mby5iaW5kaW5ncyA9IHRoaXMuX3NoYWRlckluZm8uYmluZGluZ3M7XHJcbiAgICAgICAgICAgIHNldExheW91dHNbU2V0SW5kZXguTUFURVJJQUxdID0gZGV2aWNlLmNyZWF0ZURlc2NyaXB0b3JTZXRMYXlvdXQoX2RzTGF5b3V0SW5mbyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIF9kc0luZm8ubGF5b3V0ID0gc2V0TGF5b3V0c1tTZXRJbmRleC5NQVRFUklBTF07XHJcbiAgICAgICAgY29uc3QgZHNIYW5kbGUgPSBEU1Bvb2wuYWxsb2ModGhpcy5fZGV2aWNlLCBfZHNJbmZvKTtcclxuICAgICAgICBQYXNzUG9vbC5zZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5ERVNDUklQVE9SX1NFVCwgZHNIYW5kbGUpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQgPSBEU1Bvb2wuZ2V0KGRzSGFuZGxlKTtcclxuXHJcbiAgICAgICAgLy8gY2FsY3VsYXRlIHRvdGFsIHNpemUgcmVxdWlyZWRcclxuICAgICAgICBjb25zdCB7IGJsb2NrcywgYmxvY2tTaXplcyB9ID0gdGhpcy5fc2hhZGVySW5mbztcclxuICAgICAgICBjb25zdCBhbGlnbm1lbnQgPSBkZXZpY2UudWJvT2Zmc2V0QWxpZ25tZW50O1xyXG4gICAgICAgIGNvbnN0IHN0YXJ0T2Zmc2V0czogbnVtYmVyW10gPSBbXTtcclxuICAgICAgICBsZXQgbGFzdFNpemUgPSAwOyBsZXQgbGFzdE9mZnNldCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibG9ja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgc2l6ZSA9IGJsb2NrU2l6ZXNbaV07XHJcbiAgICAgICAgICAgIHN0YXJ0T2Zmc2V0cy5wdXNoKGxhc3RPZmZzZXQpO1xyXG4gICAgICAgICAgICBsYXN0T2Zmc2V0ICs9IE1hdGguY2VpbChzaXplIC8gYWxpZ25tZW50KSAqIGFsaWdubWVudDtcclxuICAgICAgICAgICAgbGFzdFNpemUgPSBzaXplO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgZ2Z4IGJ1ZmZlciByZXNvdXJjZVxyXG4gICAgICAgIGNvbnN0IHRvdGFsU2l6ZSA9IHN0YXJ0T2Zmc2V0c1tzdGFydE9mZnNldHMubGVuZ3RoIC0gMV0gKyBsYXN0U2l6ZTtcclxuICAgICAgICBpZiAodG90YWxTaXplKSB7XHJcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTk4ODk4OFxyXG4gICAgICAgICAgICBfYnVmZmVySW5mby5zaXplID0gTWF0aC5jZWlsKHRvdGFsU2l6ZSAvIDE2KSAqIDE2O1xyXG4gICAgICAgICAgICB0aGlzLl9yb290QnVmZmVyID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihfYnVmZmVySW5mbyk7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3RCbG9jayA9IG5ldyBBcnJheUJ1ZmZlcih0b3RhbFNpemUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjcmVhdGUgYnVmZmVyIHZpZXdzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGNvdW50ID0gMDsgaSA8IGJsb2Nrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gYmxvY2tzW2ldLmJpbmRpbmc7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpemUgPSBibG9ja1NpemVzW2ldO1xyXG4gICAgICAgICAgICBfYnVmZmVyVmlld0luZm8uYnVmZmVyID0gdGhpcy5fcm9vdEJ1ZmZlciE7XHJcbiAgICAgICAgICAgIF9idWZmZXJWaWV3SW5mby5vZmZzZXQgPSBzdGFydE9mZnNldHNbY291bnQrK107XHJcbiAgICAgICAgICAgIF9idWZmZXJWaWV3SW5mby5yYW5nZSA9IHNpemU7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZlclZpZXcgPSB0aGlzLl9idWZmZXJzW2JpbmRpbmddID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihfYnVmZmVyVmlld0luZm8pO1xyXG4gICAgICAgICAgICAvLyBub24tYnVpbHRpbiBVQk8gZGF0YSBwb29scywgbm90ZSB0aGF0IHRoZSBlZmZlY3QgY29tcGlsZXJcclxuICAgICAgICAgICAgLy8gZ3VhcmFudGVlcyB0aGVzZSBiaW5kaW5ncyB0byBiZSBjb25zZWN1dGl2ZSwgc3RhcnRpbmcgZnJvbSAwIGFuZCBub24tYXJyYXktdHlwZWRcclxuICAgICAgICAgICAgdGhpcy5fYmxvY2tzW2JpbmRpbmddID0gbmV3IEZsb2F0MzJBcnJheSh0aGlzLl9yb290QmxvY2shLCBfYnVmZmVyVmlld0luZm8ub2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgc2l6ZSAvIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihiaW5kaW5nLCBidWZmZXJWaWV3KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gc3RvcmUgaGFuZGxlc1xyXG4gICAgICAgIGNvbnN0IGRpcmVjdEhhbmRsZU1hcCA9IHRoaXMuX3Byb3BlcnR5SGFuZGxlTWFwID0gdGhpcy5fc2hhZGVySW5mby5oYW5kbGVNYXA7XHJcbiAgICAgICAgY29uc3QgaW5kaXJlY3RIYW5kbGVNYXA6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcclxuICAgICAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5fcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICBjb25zdCBwcm9wID0gdGhpcy5fcHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wLmhhbmRsZUluZm8pIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgaW5kaXJlY3RIYW5kbGVNYXBbbmFtZV0gPSB0aGlzLmdldEhhbmRsZS5hcHBseSh0aGlzLCBwcm9wLmhhbmRsZUluZm8pITtcclxuICAgICAgICB9XHJcbiAgICAgICAgT2JqZWN0LmFzc2lnbihkaXJlY3RIYW5kbGVNYXAsIGluZGlyZWN0SGFuZGxlTWFwKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3N5bmNCYXRjaGluZ1NjaGVtZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2RlZmluZXMuVVNFX0lOU1RBTkNJTkcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2RldmljZS5oYXNGZWF0dXJlKEdGWEZlYXR1cmUuSU5TVEFOQ0VEX0FSUkFZUykpIHtcclxuICAgICAgICAgICAgICAgIFBhc3NQb29sLnNldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkJBVENISU5HX1NDSEVNRSwgQmF0Y2hpbmdTY2hlbWVzLklOU1RBTkNJTkcpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmaW5lcy5VU0VfSU5TVEFOQ0lORyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuQkFUQ0hJTkdfU0NIRU1FLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGVmaW5lcy5VU0VfQkFUQ0hJTkcpIHtcclxuICAgICAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuQkFUQ0hJTkdfU0NIRU1FLCBCYXRjaGluZ1NjaGVtZXMuVkJfTUVSR0lORyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgUGFzc1Bvb2wuc2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuQkFUQ0hJTkdfU0NIRU1FLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW5mb3NcclxuICAgIGdldCByb290ICgpIHsgcmV0dXJuIHRoaXMuX3Jvb3Q7IH1cclxuICAgIGdldCBkZXZpY2UgKCkgeyByZXR1cm4gdGhpcy5fZGV2aWNlOyB9XHJcbiAgICBnZXQgc2hhZGVySW5mbyAoKSB7IHJldHVybiB0aGlzLl9zaGFkZXJJbmZvOyB9XHJcbiAgICBnZXQgc2V0TGF5b3V0cyAoKSB7IHJldHVybiBwcm9ncmFtTGliLmdldFBpcGVsaW5lTGF5b3V0KHRoaXMuX3Byb2dyYW1OYW1lKS5zZXRMYXlvdXRzOyB9XHJcbiAgICBnZXQgcHJvZ3JhbSAoKSB7IHJldHVybiB0aGlzLl9wcm9ncmFtTmFtZTsgfVxyXG4gICAgZ2V0IHByb3BlcnRpZXMgKCkgeyByZXR1cm4gdGhpcy5fcHJvcGVydGllczsgfVxyXG4gICAgZ2V0IGRlZmluZXMgKCkgeyByZXR1cm4gdGhpcy5fZGVmaW5lczsgfVxyXG4gICAgZ2V0IHBhc3NJbmRleCAoKSB7IHJldHVybiB0aGlzLl9wYXNzSW5kZXg7IH1cclxuICAgIGdldCBwcm9wZXJ0eUluZGV4ICgpIHsgcmV0dXJuIHRoaXMuX3Byb3BlcnR5SW5kZXg7IH1cclxuICAgIC8vIGRhdGFcclxuICAgIGdldCBkeW5hbWljcyAoKSB7IHJldHVybiB0aGlzLl9keW5hbWljczsgfVxyXG4gICAgZ2V0IGJsb2NrcyAoKSB7IHJldHVybiB0aGlzLl9ibG9ja3M7IH1cclxuICAgIC8vIHN0YXRlc1xyXG4gICAgZ2V0IGhhbmRsZSAoKSB7IHJldHVybiB0aGlzLl9oYW5kbGU7IH1cclxuICAgIGdldCBwcmlvcml0eSAoKSB7IHJldHVybiBQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5QUklPUklUWSk7IH1cclxuICAgIGdldCBwcmltaXRpdmUgKCkgeyByZXR1cm4gUGFzc1Bvb2wuZ2V0KHRoaXMuX2hhbmRsZSwgUGFzc1ZpZXcuUFJJTUlUSVZFKTsgfVxyXG4gICAgZ2V0IHN0YWdlICgpIHsgcmV0dXJuIFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LlNUQUdFKTsgfVxyXG4gICAgZ2V0IHBoYXNlICgpIHsgcmV0dXJuIFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LlBIQVNFKTsgfVxyXG4gICAgZ2V0IHJhc3Rlcml6ZXJTdGF0ZSAoKSB7IHJldHVybiBSYXN0ZXJpemVyU3RhdGVQb29sLmdldChQYXNzUG9vbC5nZXQodGhpcy5faGFuZGxlLCBQYXNzVmlldy5SQVNURVJJWkVSX1NUQVRFKSk7IH1cclxuICAgIGdldCBkZXB0aFN0ZW5jaWxTdGF0ZSAoKSB7IHJldHVybiBEZXB0aFN0ZW5jaWxTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkRFUFRIX1NURU5DSUxfU1RBVEUpKTsgfVxyXG4gICAgZ2V0IGJsZW5kU3RhdGUgKCkgeyByZXR1cm4gQmxlbmRTdGF0ZVBvb2wuZ2V0KFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkJMRU5EX1NUQVRFKSk7IH1cclxuICAgIGdldCBkeW5hbWljU3RhdGVzICgpIHsgcmV0dXJuIFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkRZTkFNSUNfU1RBVEVTKTsgfVxyXG4gICAgZ2V0IGJhdGNoaW5nU2NoZW1lICgpIHsgcmV0dXJuIFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkJBVENISU5HX1NDSEVNRSk7IH1cclxuICAgIGdldCBoYXNoICgpIHsgcmV0dXJuIFBhc3NQb29sLmdldCh0aGlzLl9oYW5kbGUsIFBhc3NWaWV3LkhBU0gpOyB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZUJsZW5kU3RhdGUgKGJzOiBHRlhCbGVuZFN0YXRlKSB7XHJcbiAgICBsZXQgcmVzID0gYCxicywke2JzLmlzQTJDfSwke2JzLmJsZW5kQ29sb3J9YDtcclxuICAgIGZvciAoY29uc3QgdCBvZiBicy50YXJnZXRzKSB7XHJcbiAgICAgICAgcmVzICs9IGAsYnQsJHt0LmJsZW5kfSwke3QuYmxlbmRFcX0sJHt0LmJsZW5kQWxwaGFFcX0sJHt0LmJsZW5kQ29sb3JNYXNrfWA7XHJcbiAgICAgICAgcmVzICs9IGAsJHt0LmJsZW5kU3JjfSwke3QuYmxlbmREc3R9LCR7dC5ibGVuZFNyY0FscGhhfSwke3QuYmxlbmREc3RBbHBoYX1gO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZnVuY3Rpb24gc2VyaWFsaXplUmFzdGVyaXplclN0YXRlIChyczogR0ZYUmFzdGVyaXplclN0YXRlKSB7XHJcbiAgICByZXR1cm4gJyxycywnICsgcnMuY3VsbE1vZGUgKyAnLCcgKyBycy5kZXB0aEJpYXMgKyAnLCcgKyBycy5pc0Zyb250RmFjZUNDVztcclxufVxyXG5cclxuZnVuY3Rpb24gc2VyaWFsaXplRGVwdGhTdGVuY2lsU3RhdGUgKGRzczogR0ZYRGVwdGhTdGVuY2lsU3RhdGUpIHtcclxuICAgIGxldCByZXMgPSBgLGRzcywke2Rzcy5kZXB0aFRlc3R9LCR7ZHNzLmRlcHRoV3JpdGV9LCR7ZHNzLmRlcHRoRnVuY31gO1xyXG4gICAgcmVzICs9IGAsJHtkc3Muc3RlbmNpbFRlc3RGcm9udH0sJHtkc3Muc3RlbmNpbEZ1bmNGcm9udH0sJHtkc3Muc3RlbmNpbFJlZkZyb250fSwke2Rzcy5zdGVuY2lsUmVhZE1hc2tGcm9udH1gO1xyXG4gICAgcmVzICs9IGAsJHtkc3Muc3RlbmNpbEZhaWxPcEZyb250fSwke2Rzcy5zdGVuY2lsWkZhaWxPcEZyb250fSwke2Rzcy5zdGVuY2lsUGFzc09wRnJvbnR9LCR7ZHNzLnN0ZW5jaWxXcml0ZU1hc2tGcm9udH1gO1xyXG4gICAgcmVzICs9IGAsJHtkc3Muc3RlbmNpbFRlc3RCYWNrfSwke2Rzcy5zdGVuY2lsRnVuY0JhY2t9LCR7ZHNzLnN0ZW5jaWxSZWZCYWNrfSwke2Rzcy5zdGVuY2lsUmVhZE1hc2tCYWNrfWA7XHJcbiAgICByZXMgKz0gYCwke2Rzcy5zdGVuY2lsRmFpbE9wQmFja30sJHtkc3Muc3RlbmNpbFpGYWlsT3BCYWNrfSwke2Rzcy5zdGVuY2lsUGFzc09wQmFja30sJHtkc3Muc3RlbmNpbFdyaXRlTWFza0JhY2t9YDtcclxuICAgIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlcmlhbGl6ZUR5bmFtaWNTdGF0ZSAoZHluYW1pY1N0YXRlczogR0ZYRHluYW1pY1N0YXRlRmxhZ3NbXSkge1xyXG4gICAgbGV0IHJlcyA9ICcsZHMnO1xyXG4gICAgZm9yIChjb25zdCBkcyBpbiBkeW5hbWljU3RhdGVzKSB7XHJcbiAgICAgICAgcmVzICs9ICcsJyArIGRzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlcztcclxufVxyXG4iXX0=