(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "./native-pools.js", "../../gfx/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("./native-pools.js"), require("../../gfx/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.nativePools, global.index);
    global.memoryPools = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _nativePools, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.LightPool = _exports.LightView = _exports.ShadowsPool = _exports.ShadowsView = _exports.FogPool = _exports.FogView = _exports.SkyboxPool = _exports.SkyboxView = _exports.AmbientPool = _exports.AmbientView = _exports.FrustumPool = _exports.FrustumView = _exports.RenderWindowPool = _exports.RenderWindowView = _exports.RootPool = _exports.RootView = _exports.NodePool = _exports.NodeView = _exports.CameraPool = _exports.CameraView = _exports.ScenePool = _exports.SceneView = _exports.AABBPool = _exports.AABBView = _exports.ModelPool = _exports.ModelView = _exports.SubModelPool = _exports.SubModelView = _exports.PassPool = _exports.PassView = _exports.ModelArrayPool = _exports.SubModelArrayPool = _exports.FramebufferPool = _exports.PipelineLayoutPool = _exports.IAPool = _exports.DSPool = _exports.ShaderPool = _exports.BlendStatePool = _exports.DepthStencilStatePool = _exports.RasterizerStatePool = _exports.NULL_HANDLE = _exports.ArrayPool = void 0;

  var _passViewDataType, _subModelViewDataType, _modelViewDataType, _aabbViewDataType, _sceneViewDataType, _cameraViewDataType, _nodeViewDataType, _rootViewDataType, _renderWindowDataType, _frustumViewDataType, _ambientViewDataType, _skyboxDataType, _fogViewDataType, _shadowsViewDataType, _lightViewDataType;

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var BufferDataType;

  (function (BufferDataType) {
    BufferDataType[BufferDataType["UINT32"] = 0] = "UINT32";
    BufferDataType[BufferDataType["FLOAT32"] = 1] = "FLOAT32";
    BufferDataType[BufferDataType["NEVER"] = 2] = "NEVER";
  })(BufferDataType || (BufferDataType = {}));

  var BufferPool = /*#__PURE__*/function () {
    // naming convension:
    // this._bufferViews[chunk][entry][element]
    function BufferPool(poolType, dataType, enumType) {
      var entryBits = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 8;

      _classCallCheck(this, BufferPool);

      this._dataType = void 0;
      this._elementCount = void 0;
      this._entryBits = void 0;
      this._stride = void 0;
      this._entriesPerChunk = void 0;
      this._entryMask = void 0;
      this._chunkMask = void 0;
      this._poolFlag = void 0;
      this._arrayBuffers = [];
      this._freelists = [];
      this._uint32BufferViews = [];
      this._float32BufferViews = [];
      this._hasUint32 = false;
      this._hasFloat32 = false;
      this._nativePool = void 0;
      this._elementCount = enumType.COUNT;
      this._entryBits = entryBits;
      this._dataType = dataType;
      var bytesPerElement = 4;
      this._stride = bytesPerElement * this._elementCount;
      this._entriesPerChunk = 1 << entryBits;
      this._entryMask = this._entriesPerChunk - 1;
      this._poolFlag = 1 << 30;
      this._chunkMask = ~(this._entryMask | this._poolFlag);
      this._nativePool = new _nativePools.NativeBufferPool(poolType, entryBits, this._stride);
      var type = BufferDataType.NEVER;
      var hasFloat32 = false;
      var hasUint32 = false;

      for (var e in dataType) {
        hasFloat32 = this._hasFloat32;
        hasUint32 = this._hasUint32;

        if (hasUint32 && hasFloat32) {
          break;
        }

        type = dataType[e];

        if (!hasFloat32 && type === BufferDataType.FLOAT32) {
          this._hasFloat32 = true;
        } else if (!hasUint32 && type === BufferDataType.UINT32) {
          this._hasUint32 = true;
        }
      }
    }

    _createClass(BufferPool, [{
      key: "alloc",
      value: function alloc() {
        var i = 0;

        for (; i < this._freelists.length; i++) {
          var list = this._freelists[i];

          if (list.length) {
            var j = list[list.length - 1];
            list.length--;
            return (i << this._entryBits) + j + this._poolFlag;
          }
        } // add a new chunk


        var buffer = this._nativePool.allocateNewChunk();

        var float32BufferViews = [];
        var uint32BufferViews = [];
        var freelist = [];
        var hasFloat32 = this._hasFloat32;
        var hasUint32 = this._hasUint32;

        for (var _j = 0; _j < this._entriesPerChunk; _j++) {
          if (hasFloat32) {
            float32BufferViews.push(new Float32Array(buffer, this._stride * _j, this._elementCount));
          }

          if (hasUint32) {
            uint32BufferViews.push(new Uint32Array(buffer, this._stride * _j, this._elementCount));
          }

          if (_j) {
            freelist.push(_j);
          }
        }

        this._arrayBuffers.push(buffer);

        if (hasUint32) this._uint32BufferViews.push(uint32BufferViews);
        if (hasFloat32) this._float32BufferViews.push(float32BufferViews);

        this._freelists.push(freelist);

        return (i << this._entryBits) + this._poolFlag; // guarantees the handle is always not zero
      }
      /**
       * Get the specified element out from buffer pool.
       *
       * Note the type inference does not work when `element` is not directly
       * an pre-declared enum value: (e.g. when doing arithmetic operations)
       * ```ts
       * SubModelPool.get(handle, SubModelView.SHADER_0 + passIndex); // the return value will have type GeneralBufferElement
       * ```
       *
       * To properly declare the variable type, you have two options:
       * ```ts
       * const hShader = SubModelPool.get(handle, SubModelView.SHADER_0 + passIndex) as ShaderHandle; // option #1
       * const hShader = SubModelPool.get<SubModelView.SHADER_0>(handle, SubModelView.SHADER_0 + passIndex); // option #2
       * ```
       */

    }, {
      key: "get",
      value: function get(handle, element) {
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return 0;
        }

        return bufferViews[chunk][entry][element];
      }
    }, {
      key: "set",
      value: function set(handle, element, value) {
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        bufferViews[chunk][entry][element] = value;
      }
    }, {
      key: "setVec2",
      value: function setVec2(handle, element, vec2) {
        // Web engine has Vec2 property, don't record it in shared memory.
        if (!_defaultConstants.JSB) return;
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        var index = element;
        var view = bufferViews[chunk][entry];
        view[index++] = vec2.x;
        view[index++] = vec2.y;
      }
    }, {
      key: "setVec3",
      value: function setVec3(handle, element, vec3) {
        // Web engine has Vec3 property, don't record it in shared memory.
        if (!_defaultConstants.JSB) return;
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        var index = element;
        var view = bufferViews[chunk][entry];
        view[index++] = vec3.x;
        view[index++] = vec3.y;
        view[index] = vec3.z;
      }
    }, {
      key: "setVec4",
      value: function setVec4(handle, element, vec4) {
        // Web engine has Vec4 property, don't record it in shared memory.
        if (!_defaultConstants.JSB) return;
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        var index = element;
        var view = bufferViews[chunk][entry];
        view[index++] = vec4.x;
        view[index++] = vec4.y;
        view[index++] = vec4.z;
        view[index] = vec4.w;
      }
    }, {
      key: "setMat4",
      value: function setMat4(handle, element, mat4) {
        // Web engine has mat4 property, don't record it in shared memory.
        if (!_defaultConstants.JSB) return;
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;
        var bufferViews = this._dataType[element] === BufferDataType.UINT32 ? this._uint32BufferViews : this._float32BufferViews;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= bufferViews.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        var index = element;
        var view = bufferViews[chunk][entry];
        view[index++] = mat4.m00;
        view[index++] = mat4.m01;
        view[index++] = mat4.m02;
        view[index++] = mat4.m03;
        view[index++] = mat4.m04;
        view[index++] = mat4.m05;
        view[index++] = mat4.m06;
        view[index++] = mat4.m07;
        view[index++] = mat4.m08;
        view[index++] = mat4.m09;
        view[index++] = mat4.m10;
        view[index++] = mat4.m11;
        view[index++] = mat4.m12;
        view[index++] = mat4.m13;
        view[index++] = mat4.m14;
        view[index] = mat4.m15;
      }
    }, {
      key: "free",
      value: function free(handle) {
        var chunk = (this._chunkMask & handle) >> this._entryBits;
        var entry = this._entryMask & handle;

        if (_defaultConstants.DEBUG && (!handle || chunk < 0 || chunk >= this._freelists.length || entry < 0 || entry >= this._entriesPerChunk || this._freelists[chunk].find(function (n) {
          return n === entry;
        }))) {
          console.warn('invalid buffer pool handle');
          return;
        }

        var bufferViews = this._hasUint32 ? this._uint32BufferViews : this._float32BufferViews;
        bufferViews[chunk][entry].fill(0);

        this._freelists[chunk].push(entry);
      }
    }]);

    return BufferPool;
  }();

  var ObjectPool = /*#__PURE__*/function () {
    function ObjectPool(poolType, ctor, dtor) {
      _classCallCheck(this, ObjectPool);

      this._ctor = void 0;
      this._dtor = void 0;
      this._indexMask = void 0;
      this._poolFlag = void 0;
      this._array = [];
      this._freelist = [];
      this._nativePool = void 0;
      this._ctor = ctor;

      if (dtor) {
        this._dtor = dtor;
      }

      this._poolFlag = 1 << 29;
      this._indexMask = ~this._poolFlag;
      this._nativePool = new _nativePools.NativeObjectPool(poolType, this._array);
    }

    _createClass(ObjectPool, [{
      key: "alloc",
      value: function alloc() {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var freelist = this._freelist;
        var i = -1;

        if (freelist.length) {
          i = freelist[freelist.length - 1];
          freelist.length--;
          this._array[i] = this._ctor(arguments, this._array[i]);
        }

        if (i < 0) {
          i = this._array.length;

          var _obj = this._ctor(arguments);

          if (!_obj) {
            return 0;
          }

          this._array.push(_obj);
        }

        return i + this._poolFlag; // guarantees the handle is always not zero
      }
    }, {
      key: "get",
      value: function get(handle) {
        var index = this._indexMask & handle;

        if (_defaultConstants.DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find(function (n) {
          return n === index;
        }))) {
          console.warn('invalid object pool handle');
          return null;
        }

        return this._array[index];
      }
    }, {
      key: "free",
      value: function free(handle) {
        var index = this._indexMask & handle;

        if (_defaultConstants.DEBUG && (!handle || index < 0 || index >= this._array.length || this._freelist.find(function (n) {
          return n === index;
        }))) {
          console.warn('invalid object pool handle');
          return;
        }

        if (this._dtor) {
          this._dtor(this._array[index]);
        }

        this._freelist.push(index);
      }
    }]);

    return ObjectPool;
  }();
  /**
   * P: pool type
   * D: pool data type
   */


  var ArrayPool = /*#__PURE__*/function () {
    /**
     * Constructor.
     * @param size The size of the array
     * @param step The step size to extend the array when exceeding the array size.
     * It is the same as size if it is not set.
     */
    function ArrayPool(arrayType, size, step) {
      _classCallCheck(this, ArrayPool);

      this._nativeArrayPool = void 0;
      this._arrayMap = new Map();
      this._curArrayHandle = 0;
      this._arrayHandleFlag = void 0;
      this._arrayHandleMask = void 0;
      this._size = 0;
      this._step = 0;
      this._arrayHandleFlag = 1 << 30;
      this._arrayHandleMask = ~this._arrayHandleFlag;
      this._size = size + 1;
      this._step = step || size;
      this._nativeArrayPool = new _nativePools.NativeArrayPool(arrayType, this._size);
    }
    /**
     * Allocate a new array.
     * @param size The size of the array
     * @param step The step size to extend the array when exceeding the array size.
     * It is the same as size if it is not set.
     */


    _createClass(ArrayPool, [{
      key: "alloc",
      value: function alloc() {
        var handle = this._curArrayHandle++;

        var array = this._nativeArrayPool.alloc(handle);

        this._arrayMap.set(handle, array);

        return handle | this._arrayHandleFlag;
      }
    }, {
      key: "free",
      value: function free(handle) {
        var arrayHandle = this._arrayHandleMask & handle;

        if (this._arrayMap.get(arrayHandle) === undefined) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool handle');
          return;
        }

        this._arrayMap["delete"](arrayHandle);
      }
    }, {
      key: "assign",
      value: function assign(handle, index, value) {
        var arrayHandle = this._arrayHandleMask & handle;

        var array = this._arrayMap.get(arrayHandle);

        if (array === undefined) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool handle');
          return;
        } // First element is the length of array.


        index = index + 1;

        if (index >= array.length) {
          var _length = array.length;

          while (index >= _length) {
            _length += this._step;
          }

          array = this._nativeArrayPool.resize(array, _length, arrayHandle);

          this._arrayMap.set(arrayHandle, array);
        }

        array[index] = value; // There may be holes in the array.

        var len = array[0];
        array[0] = index > len ? index : len;
      }
    }, {
      key: "erase",
      value: function erase(handle, index) {
        var array = this._arrayMap.get(this._arrayHandleMask & handle);

        if (array === undefined || index > array[0]) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool index or invalid array handle');
          return;
        }

        for (var i = index + 1; i < array[0]; ++i) {
          array[i] = array[i + 1];
        }

        --array[0];
      }
    }, {
      key: "push",
      value: function push(handle, value) {
        var array = this._arrayMap.get(this._arrayHandleMask & handle);

        if (array === undefined) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool handle');
          return;
        }

        this.assign(handle, array[0], value);
      }
    }, {
      key: "pop",
      value: function pop(handle) {
        var array = this._arrayMap.get(this._arrayHandleMask & handle);

        if (array === undefined) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool handle');
          return;
        }

        if (array[0] === 0) {
          return;
        } else {
          --array[0];
        }
      }
      /**
       * Clear the contents of array.
       * @param handle Handle to be clear.
       */

    }, {
      key: "clear",
      value: function clear(handle) {
        var array = this._arrayMap.get(this._arrayHandleMask & handle);

        if (array === undefined) {
          if (_defaultConstants.DEBUG) console.warn('invalid array pool handle');
          return;
        }

        array[0] = 0;
      }
    }]);

    return ArrayPool;
  }();

  _exports.ArrayPool = ArrayPool;
  ;
  var PoolType;

  (function (PoolType) {
    PoolType[PoolType["RASTERIZER_STATE"] = 0] = "RASTERIZER_STATE";
    PoolType[PoolType["DEPTH_STENCIL_STATE"] = 1] = "DEPTH_STENCIL_STATE";
    PoolType[PoolType["BLEND_STATE"] = 2] = "BLEND_STATE";
    PoolType[PoolType["DESCRIPTOR_SETS"] = 3] = "DESCRIPTOR_SETS";
    PoolType[PoolType["SHADER"] = 4] = "SHADER";
    PoolType[PoolType["INPUT_ASSEMBLER"] = 5] = "INPUT_ASSEMBLER";
    PoolType[PoolType["PIPELINE_LAYOUT"] = 6] = "PIPELINE_LAYOUT";
    PoolType[PoolType["FRAMEBUFFER"] = 7] = "FRAMEBUFFER";
    PoolType[PoolType["PASS"] = 100] = "PASS";
    PoolType[PoolType["SUB_MODEL"] = 101] = "SUB_MODEL";
    PoolType[PoolType["MODEL"] = 102] = "MODEL";
    PoolType[PoolType["SCENE"] = 103] = "SCENE";
    PoolType[PoolType["CAMERA"] = 104] = "CAMERA";
    PoolType[PoolType["NODE"] = 105] = "NODE";
    PoolType[PoolType["ROOT"] = 106] = "ROOT";
    PoolType[PoolType["AABB"] = 107] = "AABB";
    PoolType[PoolType["RENDER_WINDOW"] = 108] = "RENDER_WINDOW";
    PoolType[PoolType["FRUSTUM"] = 109] = "FRUSTUM";
    PoolType[PoolType["AMBIENT"] = 110] = "AMBIENT";
    PoolType[PoolType["FOG"] = 111] = "FOG";
    PoolType[PoolType["SKYBOX"] = 112] = "SKYBOX";
    PoolType[PoolType["SHADOW"] = 113] = "SHADOW";
    PoolType[PoolType["LIGHT"] = 114] = "LIGHT";
    PoolType[PoolType["SUB_MODEL_ARRAY"] = 200] = "SUB_MODEL_ARRAY";
    PoolType[PoolType["MODEL_ARRAY"] = 201] = "MODEL_ARRAY";
  })(PoolType || (PoolType = {}));

  var NULL_HANDLE = 0;
  _exports.NULL_HANDLE = NULL_HANDLE;
  // don't reuse any of these data-only structs, for GFX objects may directly reference them
  var RasterizerStatePool = new ObjectPool(PoolType.RASTERIZER_STATE, function () {
    return new _index.GFXRasterizerState();
  });
  _exports.RasterizerStatePool = RasterizerStatePool;
  var DepthStencilStatePool = new ObjectPool(PoolType.DEPTH_STENCIL_STATE, function () {
    return new _index.GFXDepthStencilState();
  });
  _exports.DepthStencilStatePool = DepthStencilStatePool;
  var BlendStatePool = new ObjectPool(PoolType.BLEND_STATE, function () {
    return new _index.GFXBlendState();
  }); // TODO: could use Labeled Tuple Element feature here after next babel update (required TS4.0+ support)

  _exports.BlendStatePool = BlendStatePool;
  var ShaderPool = new ObjectPool(PoolType.SHADER, function (args, obj) {
    return obj ? (obj.initialize(args[1]), obj) : args[0].createShader(args[1]);
  }, function (obj) {
    return obj && obj.destroy();
  });
  _exports.ShaderPool = ShaderPool;
  var DSPool = new ObjectPool(PoolType.DESCRIPTOR_SETS, function (args, obj) {
    return obj ? (obj.initialize(args[1]), obj) : args[0].createDescriptorSet(args[1]);
  }, function (obj) {
    return obj && obj.destroy();
  });
  _exports.DSPool = DSPool;
  var IAPool = new ObjectPool(PoolType.INPUT_ASSEMBLER, function (args, obj) {
    return obj ? (obj.initialize(args[1]), obj) : args[0].createInputAssembler(args[1]);
  }, function (obj) {
    return obj && obj.destroy();
  });
  _exports.IAPool = IAPool;
  var PipelineLayoutPool = new ObjectPool(PoolType.PIPELINE_LAYOUT, function (args, obj) {
    return obj ? (obj.initialize(args[1]), obj) : args[0].createPipelineLayout(args[1]);
  }, function (obj) {
    return obj && obj.destroy();
  });
  _exports.PipelineLayoutPool = PipelineLayoutPool;
  var FramebufferPool = new ObjectPool(PoolType.FRAMEBUFFER, function (args, obj) {
    return obj ? (obj.initialize(args[1]), obj) : args[0].createFramebuffer(args[1]);
  }, function (obj) {
    return obj && obj.destroy();
  });
  _exports.FramebufferPool = FramebufferPool;
  var SubModelArrayPool = new ArrayPool(PoolType.SUB_MODEL_ARRAY, 10);
  _exports.SubModelArrayPool = SubModelArrayPool;
  var ModelArrayPool = new ArrayPool(PoolType.MODEL_ARRAY, 50, 10);
  _exports.ModelArrayPool = ModelArrayPool;
  var PassView;
  _exports.PassView = PassView;

  (function (PassView) {
    PassView[PassView["PRIORITY"] = 0] = "PRIORITY";
    PassView[PassView["STAGE"] = 1] = "STAGE";
    PassView[PassView["PHASE"] = 2] = "PHASE";
    PassView[PassView["BATCHING_SCHEME"] = 3] = "BATCHING_SCHEME";
    PassView[PassView["PRIMITIVE"] = 4] = "PRIMITIVE";
    PassView[PassView["DYNAMIC_STATES"] = 5] = "DYNAMIC_STATES";
    PassView[PassView["HASH"] = 6] = "HASH";
    PassView[PassView["RASTERIZER_STATE"] = 7] = "RASTERIZER_STATE";
    PassView[PassView["DEPTH_STENCIL_STATE"] = 8] = "DEPTH_STENCIL_STATE";
    PassView[PassView["BLEND_STATE"] = 9] = "BLEND_STATE";
    PassView[PassView["DESCRIPTOR_SET"] = 10] = "DESCRIPTOR_SET";
    PassView[PassView["PIPELINE_LAYOUT"] = 11] = "PIPELINE_LAYOUT";
    PassView[PassView["COUNT"] = 12] = "COUNT";
  })(PassView || (_exports.PassView = PassView = {}));

  var passViewDataType = (_passViewDataType = {}, _defineProperty(_passViewDataType, PassView.PRIORITY, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.STAGE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.PHASE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.BATCHING_SCHEME, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.PRIMITIVE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.DYNAMIC_STATES, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.HASH, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.RASTERIZER_STATE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.DEPTH_STENCIL_STATE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.BLEND_STATE, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.DESCRIPTOR_SET, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.PIPELINE_LAYOUT, BufferDataType.UINT32), _defineProperty(_passViewDataType, PassView.COUNT, BufferDataType.NEVER), _passViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var PassPool = new BufferPool(PoolType.PASS, passViewDataType, PassView);
  _exports.PassPool = PassPool;
  var SubModelView;
  _exports.SubModelView = SubModelView;

  (function (SubModelView) {
    SubModelView[SubModelView["PRIORITY"] = 0] = "PRIORITY";
    SubModelView[SubModelView["PASS_COUNT"] = 1] = "PASS_COUNT";
    SubModelView[SubModelView["PASS_0"] = 2] = "PASS_0";
    SubModelView[SubModelView["PASS_1"] = 3] = "PASS_1";
    SubModelView[SubModelView["PASS_2"] = 4] = "PASS_2";
    SubModelView[SubModelView["PASS_3"] = 5] = "PASS_3";
    SubModelView[SubModelView["SHADER_0"] = 6] = "SHADER_0";
    SubModelView[SubModelView["SHADER_1"] = 7] = "SHADER_1";
    SubModelView[SubModelView["SHADER_2"] = 8] = "SHADER_2";
    SubModelView[SubModelView["SHADER_3"] = 9] = "SHADER_3";
    SubModelView[SubModelView["DESCRIPTOR_SET"] = 10] = "DESCRIPTOR_SET";
    SubModelView[SubModelView["INPUT_ASSEMBLER"] = 11] = "INPUT_ASSEMBLER";
    SubModelView[SubModelView["COUNT"] = 12] = "COUNT";
  })(SubModelView || (_exports.SubModelView = SubModelView = {}));

  var subModelViewDataType = (_subModelViewDataType = {}, _defineProperty(_subModelViewDataType, SubModelView.PRIORITY, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.PASS_COUNT, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.PASS_0, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.PASS_1, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.PASS_2, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.PASS_3, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.SHADER_0, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.SHADER_1, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.SHADER_2, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.SHADER_3, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.DESCRIPTOR_SET, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.INPUT_ASSEMBLER, BufferDataType.UINT32), _defineProperty(_subModelViewDataType, SubModelView.COUNT, BufferDataType.NEVER), _subModelViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var SubModelPool = new BufferPool(PoolType.SUB_MODEL, subModelViewDataType, SubModelView);
  _exports.SubModelPool = SubModelPool;
  var ModelView;
  _exports.ModelView = ModelView;

  (function (ModelView) {
    ModelView[ModelView["ENABLED"] = 0] = "ENABLED";
    ModelView[ModelView["VIS_FLAGS"] = 1] = "VIS_FLAGS";
    ModelView[ModelView["CAST_SHADOW"] = 2] = "CAST_SHADOW";
    ModelView[ModelView["WORLD_BOUNDS"] = 3] = "WORLD_BOUNDS";
    ModelView[ModelView["NODE"] = 4] = "NODE";
    ModelView[ModelView["TRANSFORM"] = 5] = "TRANSFORM";
    ModelView[ModelView["SUB_MODEL_ARRAY"] = 6] = "SUB_MODEL_ARRAY";
    ModelView[ModelView["COUNT"] = 7] = "COUNT";
  })(ModelView || (_exports.ModelView = ModelView = {}));

  var modelViewDataType = (_modelViewDataType = {}, _defineProperty(_modelViewDataType, ModelView.ENABLED, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.VIS_FLAGS, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.CAST_SHADOW, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.WORLD_BOUNDS, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.NODE, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.TRANSFORM, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.SUB_MODEL_ARRAY, BufferDataType.UINT32), _defineProperty(_modelViewDataType, ModelView.COUNT, BufferDataType.NEVER), _modelViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var ModelPool = new BufferPool(PoolType.MODEL, modelViewDataType, ModelView);
  _exports.ModelPool = ModelPool;
  var AABBView;
  _exports.AABBView = AABBView;

  (function (AABBView) {
    AABBView[AABBView["CENTER"] = 0] = "CENTER";
    AABBView[AABBView["HALF_EXTENSION"] = 3] = "HALF_EXTENSION";
    AABBView[AABBView["COUNT"] = 6] = "COUNT";
  })(AABBView || (_exports.AABBView = AABBView = {}));

  var aabbViewDataType = (_aabbViewDataType = {}, _defineProperty(_aabbViewDataType, AABBView.CENTER, BufferDataType.FLOAT32), _defineProperty(_aabbViewDataType, AABBView.HALF_EXTENSION, BufferDataType.FLOAT32), _defineProperty(_aabbViewDataType, AABBView.COUNT, BufferDataType.NEVER), _aabbViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var AABBPool = new BufferPool(PoolType.AABB, aabbViewDataType, AABBView);
  _exports.AABBPool = AABBPool;
  var SceneView;
  _exports.SceneView = SceneView;

  (function (SceneView) {
    SceneView[SceneView["MAIN_LIGHT"] = 0] = "MAIN_LIGHT";
    SceneView[SceneView["MODEL_ARRAY"] = 1] = "MODEL_ARRAY";
    SceneView[SceneView["COUNT"] = 2] = "COUNT";
  })(SceneView || (_exports.SceneView = SceneView = {}));

  var sceneViewDataType = (_sceneViewDataType = {}, _defineProperty(_sceneViewDataType, SceneView.MAIN_LIGHT, BufferDataType.UINT32), _defineProperty(_sceneViewDataType, SceneView.MODEL_ARRAY, BufferDataType.UINT32), _defineProperty(_sceneViewDataType, SceneView.COUNT, BufferDataType.NEVER), _sceneViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var ScenePool = new BufferPool(PoolType.SCENE, sceneViewDataType, SceneView);
  _exports.ScenePool = ScenePool;
  var CameraView;
  _exports.CameraView = CameraView;

  (function (CameraView) {
    CameraView[CameraView["WIDTH"] = 0] = "WIDTH";
    CameraView[CameraView["HEIGHT"] = 1] = "HEIGHT";
    CameraView[CameraView["EXPOSURE"] = 2] = "EXPOSURE";
    CameraView[CameraView["CLEAR_FLAG"] = 3] = "CLEAR_FLAG";
    CameraView[CameraView["CLEAR_DEPTH"] = 4] = "CLEAR_DEPTH";
    CameraView[CameraView["CLEAR_STENCIL"] = 5] = "CLEAR_STENCIL";
    CameraView[CameraView["NODE"] = 6] = "NODE";
    CameraView[CameraView["SCENE"] = 7] = "SCENE";
    CameraView[CameraView["FRUSTUM"] = 8] = "FRUSTUM";
    CameraView[CameraView["FORWARD"] = 9] = "FORWARD";
    CameraView[CameraView["POSITION"] = 12] = "POSITION";
    CameraView[CameraView["VIEW_PORT"] = 15] = "VIEW_PORT";
    CameraView[CameraView["CLEAR_COLOR"] = 19] = "CLEAR_COLOR";
    CameraView[CameraView["MAT_VIEW"] = 23] = "MAT_VIEW";
    CameraView[CameraView["MAT_VIEW_PROJ"] = 39] = "MAT_VIEW_PROJ";
    CameraView[CameraView["MAT_VIEW_PROJ_INV"] = 55] = "MAT_VIEW_PROJ_INV";
    CameraView[CameraView["MAT_PROJ"] = 71] = "MAT_PROJ";
    CameraView[CameraView["MAT_PROJ_INV"] = 87] = "MAT_PROJ_INV";
    CameraView[CameraView["COUNT"] = 103] = "COUNT";
  })(CameraView || (_exports.CameraView = CameraView = {}));

  var cameraViewDataType = (_cameraViewDataType = {}, _defineProperty(_cameraViewDataType, CameraView.WIDTH, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.HEIGHT, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.EXPOSURE, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.CLEAR_FLAG, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.CLEAR_DEPTH, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.CLEAR_STENCIL, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.NODE, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.SCENE, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.FRUSTUM, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.FORWARD, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.POSITION, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.VIEW_PORT, BufferDataType.UINT32), _defineProperty(_cameraViewDataType, CameraView.CLEAR_COLOR, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.MAT_VIEW, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.MAT_VIEW_PROJ, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.MAT_VIEW_PROJ_INV, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.MAT_PROJ, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.MAT_PROJ_INV, BufferDataType.FLOAT32), _defineProperty(_cameraViewDataType, CameraView.COUNT, BufferDataType.NEVER), _cameraViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var CameraPool = new BufferPool(PoolType.CAMERA, cameraViewDataType, CameraView);
  _exports.CameraPool = CameraPool;
  var NodeView;
  _exports.NodeView = NodeView;

  (function (NodeView) {
    NodeView[NodeView["LAYER"] = 0] = "LAYER";
    NodeView[NodeView["WORLD_SCALE"] = 1] = "WORLD_SCALE";
    NodeView[NodeView["WORLD_POSITION"] = 4] = "WORLD_POSITION";
    NodeView[NodeView["WORLD_ROTATION"] = 7] = "WORLD_ROTATION";
    NodeView[NodeView["WORLD_MATRIX"] = 11] = "WORLD_MATRIX";
    NodeView[NodeView["COUNT"] = 27] = "COUNT";
  })(NodeView || (_exports.NodeView = NodeView = {}));

  var nodeViewDataType = (_nodeViewDataType = {}, _defineProperty(_nodeViewDataType, NodeView.LAYER, BufferDataType.UINT32), _defineProperty(_nodeViewDataType, NodeView.WORLD_SCALE, BufferDataType.FLOAT32), _defineProperty(_nodeViewDataType, NodeView.WORLD_POSITION, BufferDataType.FLOAT32), _defineProperty(_nodeViewDataType, NodeView.WORLD_ROTATION, BufferDataType.FLOAT32), _defineProperty(_nodeViewDataType, NodeView.WORLD_MATRIX, BufferDataType.FLOAT32), _defineProperty(_nodeViewDataType, NodeView.COUNT, BufferDataType.NEVER), _nodeViewDataType); // @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.

  if (!_defaultConstants.JSB) {
    delete NodeView[NodeView.COUNT];
    NodeView[NodeView.COUNT = NodeView.LAYER + 1] = 'COUNT';
  } // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.


  var NodePool = new BufferPool(PoolType.NODE, nodeViewDataType, NodeView);
  _exports.NodePool = NodePool;
  var RootView;
  _exports.RootView = RootView;

  (function (RootView) {
    RootView[RootView["CUMULATIVE_TIME"] = 0] = "CUMULATIVE_TIME";
    RootView[RootView["FRAME_TIME"] = 1] = "FRAME_TIME";
    RootView[RootView["COUNT"] = 2] = "COUNT";
  })(RootView || (_exports.RootView = RootView = {}));

  var rootViewDataType = (_rootViewDataType = {}, _defineProperty(_rootViewDataType, RootView.CUMULATIVE_TIME, BufferDataType.FLOAT32), _defineProperty(_rootViewDataType, RootView.FRAME_TIME, BufferDataType.FLOAT32), _defineProperty(_rootViewDataType, RootView.COUNT, BufferDataType.NEVER), _rootViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var RootPool = new BufferPool(PoolType.ROOT, rootViewDataType, RootView, 1);
  _exports.RootPool = RootPool;
  var RenderWindowView;
  _exports.RenderWindowView = RenderWindowView;

  (function (RenderWindowView) {
    RenderWindowView[RenderWindowView["HAS_ON_SCREEN_ATTACHMENTS"] = 0] = "HAS_ON_SCREEN_ATTACHMENTS";
    RenderWindowView[RenderWindowView["HAS_OFF_SCREEN_ATTACHMENTS"] = 1] = "HAS_OFF_SCREEN_ATTACHMENTS";
    RenderWindowView[RenderWindowView["FRAMEBUFFER"] = 2] = "FRAMEBUFFER";
    RenderWindowView[RenderWindowView["COUNT"] = 3] = "COUNT";
  })(RenderWindowView || (_exports.RenderWindowView = RenderWindowView = {}));

  var renderWindowDataType = (_renderWindowDataType = {}, _defineProperty(_renderWindowDataType, RenderWindowView.HAS_ON_SCREEN_ATTACHMENTS, BufferDataType.UINT32), _defineProperty(_renderWindowDataType, RenderWindowView.HAS_OFF_SCREEN_ATTACHMENTS, BufferDataType.UINT32), _defineProperty(_renderWindowDataType, RenderWindowView.FRAMEBUFFER, BufferDataType.UINT32), _defineProperty(_renderWindowDataType, RenderWindowView.COUNT, BufferDataType.NEVER), _renderWindowDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var RenderWindowPool = new BufferPool(PoolType.RENDER_WINDOW, renderWindowDataType, RenderWindowView, 2);
  _exports.RenderWindowPool = RenderWindowPool;
  var FrustumView;
  _exports.FrustumView = FrustumView;

  (function (FrustumView) {
    FrustumView[FrustumView["VERTICES"] = 0] = "VERTICES";
    FrustumView[FrustumView["PLANES"] = 24] = "PLANES";
    FrustumView[FrustumView["COUNT"] = 48] = "COUNT";
  })(FrustumView || (_exports.FrustumView = FrustumView = {}));

  var frustumViewDataType = (_frustumViewDataType = {}, _defineProperty(_frustumViewDataType, FrustumView.VERTICES, BufferDataType.FLOAT32), _defineProperty(_frustumViewDataType, FrustumView.PLANES, BufferDataType.FLOAT32), _defineProperty(_frustumViewDataType, FrustumView.COUNT, BufferDataType.NEVER), _frustumViewDataType); // Theoretically we only have to declare the type view here while all the other arguments can be inferred.
  // but before the official support of Partial Type Argument Inference releases, (microsoft/TypeScript#26349)
  // we'll have to explicitly declare all these types.

  var FrustumPool = new BufferPool(PoolType.FRUSTUM, frustumViewDataType, FrustumView);
  _exports.FrustumPool = FrustumPool;
  var AmbientView;
  _exports.AmbientView = AmbientView;

  (function (AmbientView) {
    AmbientView[AmbientView["ENABLE"] = 0] = "ENABLE";
    AmbientView[AmbientView["ILLUM"] = 1] = "ILLUM";
    AmbientView[AmbientView["SKY_COLOR"] = 2] = "SKY_COLOR";
    AmbientView[AmbientView["GROUND_ALBEDO"] = 6] = "GROUND_ALBEDO";
    AmbientView[AmbientView["COUNT"] = 10] = "COUNT";
  })(AmbientView || (_exports.AmbientView = AmbientView = {}));

  var ambientViewDataType = (_ambientViewDataType = {}, _defineProperty(_ambientViewDataType, AmbientView.ENABLE, BufferDataType.UINT32), _defineProperty(_ambientViewDataType, AmbientView.ILLUM, BufferDataType.FLOAT32), _defineProperty(_ambientViewDataType, AmbientView.SKY_COLOR, BufferDataType.FLOAT32), _defineProperty(_ambientViewDataType, AmbientView.GROUND_ALBEDO, BufferDataType.FLOAT32), _defineProperty(_ambientViewDataType, AmbientView.COUNT, BufferDataType.NEVER), _ambientViewDataType); // @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.

  if (!_defaultConstants.JSB) {
    delete AmbientView[AmbientView.COUNT];
    AmbientView[AmbientView.COUNT = AmbientView.ILLUM + 1] = 'COUNT';
  }

  var AmbientPool = new BufferPool(PoolType.AMBIENT, ambientViewDataType, AmbientView, 1);
  _exports.AmbientPool = AmbientPool;
  var SkyboxView;
  _exports.SkyboxView = SkyboxView;

  (function (SkyboxView) {
    SkyboxView[SkyboxView["ENABLE"] = 0] = "ENABLE";
    SkyboxView[SkyboxView["IS_RGBE"] = 1] = "IS_RGBE";
    SkyboxView[SkyboxView["USE_IBL"] = 2] = "USE_IBL";
    SkyboxView[SkyboxView["MODEL"] = 3] = "MODEL";
    SkyboxView[SkyboxView["COUNT"] = 4] = "COUNT";
  })(SkyboxView || (_exports.SkyboxView = SkyboxView = {}));

  var skyboxDataType = (_skyboxDataType = {}, _defineProperty(_skyboxDataType, SkyboxView.ENABLE, BufferDataType.UINT32), _defineProperty(_skyboxDataType, SkyboxView.IS_RGBE, BufferDataType.UINT32), _defineProperty(_skyboxDataType, SkyboxView.USE_IBL, BufferDataType.UINT32), _defineProperty(_skyboxDataType, SkyboxView.MODEL, BufferDataType.UINT32), _defineProperty(_skyboxDataType, SkyboxView.COUNT, BufferDataType.NEVER), _skyboxDataType);
  var SkyboxPool = new BufferPool(PoolType.SKYBOX, skyboxDataType, SkyboxView, 1);
  _exports.SkyboxPool = SkyboxPool;
  var FogView;
  _exports.FogView = FogView;

  (function (FogView) {
    FogView[FogView["ENABLE"] = 0] = "ENABLE";
    FogView[FogView["TYPE"] = 1] = "TYPE";
    FogView[FogView["DENSITY"] = 2] = "DENSITY";
    FogView[FogView["START"] = 3] = "START";
    FogView[FogView["END"] = 4] = "END";
    FogView[FogView["ATTEN"] = 5] = "ATTEN";
    FogView[FogView["TOP"] = 6] = "TOP";
    FogView[FogView["RANGE"] = 7] = "RANGE";
    FogView[FogView["COLOR"] = 8] = "COLOR";
    FogView[FogView["COUNT"] = 12] = "COUNT";
  })(FogView || (_exports.FogView = FogView = {}));

  var fogViewDataType = (_fogViewDataType = {}, _defineProperty(_fogViewDataType, FogView.ENABLE, BufferDataType.UINT32), _defineProperty(_fogViewDataType, FogView.TYPE, BufferDataType.UINT32), _defineProperty(_fogViewDataType, FogView.DENSITY, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.START, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.END, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.ATTEN, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.TOP, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.RANGE, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.COLOR, BufferDataType.FLOAT32), _defineProperty(_fogViewDataType, FogView.COUNT, BufferDataType.NEVER), _fogViewDataType); // @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.

  if (!_defaultConstants.JSB) {
    delete FogView[FogView.COUNT];
    FogView[FogView.COUNT = FogView.RANGE + 1] = 'COUNT';
  }

  var FogPool = new BufferPool(PoolType.FOG, fogViewDataType, FogView);
  _exports.FogPool = FogPool;
  var ShadowsView;
  _exports.ShadowsView = ShadowsView;

  (function (ShadowsView) {
    ShadowsView[ShadowsView["ENABLE"] = 0] = "ENABLE";
    ShadowsView[ShadowsView["DIRTY"] = 1] = "DIRTY";
    ShadowsView[ShadowsView["TYPE"] = 2] = "TYPE";
    ShadowsView[ShadowsView["DISTANCE"] = 3] = "DISTANCE";
    ShadowsView[ShadowsView["INSTANCE_PASS"] = 4] = "INSTANCE_PASS";
    ShadowsView[ShadowsView["PLANAR_PASS"] = 5] = "PLANAR_PASS";
    ShadowsView[ShadowsView["NEAR"] = 6] = "NEAR";
    ShadowsView[ShadowsView["FAR"] = 7] = "FAR";
    ShadowsView[ShadowsView["ASPECT"] = 8] = "ASPECT";
    ShadowsView[ShadowsView["PCF_TYPE"] = 9] = "PCF_TYPE";
    ShadowsView[ShadowsView["ORTHO_SIZE"] = 10] = "ORTHO_SIZE";
    ShadowsView[ShadowsView["SIZE"] = 11] = "SIZE";
    ShadowsView[ShadowsView["NORMAL"] = 13] = "NORMAL";
    ShadowsView[ShadowsView["COLOR"] = 16] = "COLOR";
    ShadowsView[ShadowsView["SPHERE"] = 20] = "SPHERE";
    ShadowsView[ShadowsView["COUNT"] = 24] = "COUNT";
  })(ShadowsView || (_exports.ShadowsView = ShadowsView = {}));

  var shadowsViewDataType = (_shadowsViewDataType = {}, _defineProperty(_shadowsViewDataType, ShadowsView.ENABLE, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.TYPE, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.DISTANCE, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.INSTANCE_PASS, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.PLANAR_PASS, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.NEAR, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.FAR, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.ASPECT, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.PCF_TYPE, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.DIRTY, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.ORTHO_SIZE, BufferDataType.UINT32), _defineProperty(_shadowsViewDataType, ShadowsView.SIZE, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.NORMAL, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.COLOR, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.SPHERE, BufferDataType.FLOAT32), _defineProperty(_shadowsViewDataType, ShadowsView.COUNT, BufferDataType.NEVER), _shadowsViewDataType); // @ts-ignore Don't alloc memory for Vec3, Quat, Mat4 on web, as they are accessed by class member variable.

  if (!_defaultConstants.JSB) {
    delete ShadowsView[FogView.COUNT];
    ShadowsView[ShadowsView.COUNT = ShadowsView.ORTHO_SIZE + 1] = 'COUNT';
  }

  var ShadowsPool = new BufferPool(PoolType.SHADOW, shadowsViewDataType, ShadowsView, 1);
  _exports.ShadowsPool = ShadowsPool;
  var LightView;
  _exports.LightView = LightView;

  (function (LightView) {
    LightView[LightView["USE_COLOR_TEMPERATURE"] = 0] = "USE_COLOR_TEMPERATURE";
    LightView[LightView["ILLUMINANCE"] = 1] = "ILLUMINANCE";
    LightView[LightView["NODE"] = 2] = "NODE";
    LightView[LightView["DIRECTION"] = 3] = "DIRECTION";
    LightView[LightView["COLOR"] = 6] = "COLOR";
    LightView[LightView["COLOR_TEMPERATURE_RGB"] = 9] = "COLOR_TEMPERATURE_RGB";
    LightView[LightView["COUNT"] = 12] = "COUNT";
  })(LightView || (_exports.LightView = LightView = {}));

  var lightViewDataType = (_lightViewDataType = {}, _defineProperty(_lightViewDataType, LightView.USE_COLOR_TEMPERATURE, BufferDataType.UINT32), _defineProperty(_lightViewDataType, LightView.ILLUMINANCE, BufferDataType.FLOAT32), _defineProperty(_lightViewDataType, LightView.NODE, BufferDataType.UINT32), _defineProperty(_lightViewDataType, LightView.DIRECTION, BufferDataType.FLOAT32), _defineProperty(_lightViewDataType, LightView.COLOR, BufferDataType.FLOAT32), _defineProperty(_lightViewDataType, LightView.COLOR_TEMPERATURE_RGB, BufferDataType.FLOAT32), _defineProperty(_lightViewDataType, LightView.COUNT, BufferDataType.NEVER), _lightViewDataType);
  var LightPool = new BufferPool(PoolType.LIGHT, lightViewDataType, LightView, 3);
  _exports.LightPool = LightPool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvY29yZS9tZW1vcnktcG9vbHMudHMiXSwibmFtZXMiOlsiQnVmZmVyRGF0YVR5cGUiLCJCdWZmZXJQb29sIiwicG9vbFR5cGUiLCJkYXRhVHlwZSIsImVudW1UeXBlIiwiZW50cnlCaXRzIiwiX2RhdGFUeXBlIiwiX2VsZW1lbnRDb3VudCIsIl9lbnRyeUJpdHMiLCJfc3RyaWRlIiwiX2VudHJpZXNQZXJDaHVuayIsIl9lbnRyeU1hc2siLCJfY2h1bmtNYXNrIiwiX3Bvb2xGbGFnIiwiX2FycmF5QnVmZmVycyIsIl9mcmVlbGlzdHMiLCJfdWludDMyQnVmZmVyVmlld3MiLCJfZmxvYXQzMkJ1ZmZlclZpZXdzIiwiX2hhc1VpbnQzMiIsIl9oYXNGbG9hdDMyIiwiX25hdGl2ZVBvb2wiLCJDT1VOVCIsImJ5dGVzUGVyRWxlbWVudCIsIk5hdGl2ZUJ1ZmZlclBvb2wiLCJ0eXBlIiwiTkVWRVIiLCJoYXNGbG9hdDMyIiwiaGFzVWludDMyIiwiZSIsIkZMT0FUMzIiLCJVSU5UMzIiLCJpIiwibGVuZ3RoIiwibGlzdCIsImoiLCJidWZmZXIiLCJhbGxvY2F0ZU5ld0NodW5rIiwiZmxvYXQzMkJ1ZmZlclZpZXdzIiwidWludDMyQnVmZmVyVmlld3MiLCJmcmVlbGlzdCIsInB1c2giLCJGbG9hdDMyQXJyYXkiLCJVaW50MzJBcnJheSIsImhhbmRsZSIsImVsZW1lbnQiLCJjaHVuayIsImVudHJ5IiwiYnVmZmVyVmlld3MiLCJERUJVRyIsImZpbmQiLCJuIiwiY29uc29sZSIsIndhcm4iLCJ2YWx1ZSIsInZlYzIiLCJKU0IiLCJpbmRleCIsInZpZXciLCJ4IiwieSIsInZlYzMiLCJ6IiwidmVjNCIsInciLCJtYXQ0IiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTA0IiwibTA1IiwibTA2IiwibTA3IiwibTA4IiwibTA5IiwibTEwIiwibTExIiwibTEyIiwibTEzIiwibTE0IiwibTE1IiwiZmlsbCIsIk9iamVjdFBvb2wiLCJjdG9yIiwiZHRvciIsIl9jdG9yIiwiX2R0b3IiLCJfaW5kZXhNYXNrIiwiX2FycmF5IiwiX2ZyZWVsaXN0IiwiTmF0aXZlT2JqZWN0UG9vbCIsImFyZ3MiLCJhcmd1bWVudHMiLCJvYmoiLCJBcnJheVBvb2wiLCJhcnJheVR5cGUiLCJzaXplIiwic3RlcCIsIl9uYXRpdmVBcnJheVBvb2wiLCJfYXJyYXlNYXAiLCJNYXAiLCJfY3VyQXJyYXlIYW5kbGUiLCJfYXJyYXlIYW5kbGVGbGFnIiwiX2FycmF5SGFuZGxlTWFzayIsIl9zaXplIiwiX3N0ZXAiLCJOYXRpdmVBcnJheVBvb2wiLCJhcnJheSIsImFsbG9jIiwic2V0IiwiYXJyYXlIYW5kbGUiLCJnZXQiLCJ1bmRlZmluZWQiLCJyZXNpemUiLCJsZW4iLCJhc3NpZ24iLCJQb29sVHlwZSIsIk5VTExfSEFORExFIiwiUmFzdGVyaXplclN0YXRlUG9vbCIsIlJBU1RFUklaRVJfU1RBVEUiLCJHRlhSYXN0ZXJpemVyU3RhdGUiLCJEZXB0aFN0ZW5jaWxTdGF0ZVBvb2wiLCJERVBUSF9TVEVOQ0lMX1NUQVRFIiwiR0ZYRGVwdGhTdGVuY2lsU3RhdGUiLCJCbGVuZFN0YXRlUG9vbCIsIkJMRU5EX1NUQVRFIiwiR0ZYQmxlbmRTdGF0ZSIsIlNoYWRlclBvb2wiLCJTSEFERVIiLCJpbml0aWFsaXplIiwiY3JlYXRlU2hhZGVyIiwiZGVzdHJveSIsIkRTUG9vbCIsIkRFU0NSSVBUT1JfU0VUUyIsImNyZWF0ZURlc2NyaXB0b3JTZXQiLCJJQVBvb2wiLCJJTlBVVF9BU1NFTUJMRVIiLCJjcmVhdGVJbnB1dEFzc2VtYmxlciIsIlBpcGVsaW5lTGF5b3V0UG9vbCIsIlBJUEVMSU5FX0xBWU9VVCIsImNyZWF0ZVBpcGVsaW5lTGF5b3V0IiwiRnJhbWVidWZmZXJQb29sIiwiRlJBTUVCVUZGRVIiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsIlN1Yk1vZGVsQXJyYXlQb29sIiwiU1VCX01PREVMX0FSUkFZIiwiTW9kZWxBcnJheVBvb2wiLCJNT0RFTF9BUlJBWSIsIlBhc3NWaWV3IiwicGFzc1ZpZXdEYXRhVHlwZSIsIlBSSU9SSVRZIiwiU1RBR0UiLCJQSEFTRSIsIkJBVENISU5HX1NDSEVNRSIsIlBSSU1JVElWRSIsIkRZTkFNSUNfU1RBVEVTIiwiSEFTSCIsIkRFU0NSSVBUT1JfU0VUIiwiUGFzc1Bvb2wiLCJQQVNTIiwiU3ViTW9kZWxWaWV3Iiwic3ViTW9kZWxWaWV3RGF0YVR5cGUiLCJQQVNTX0NPVU5UIiwiUEFTU18wIiwiUEFTU18xIiwiUEFTU18yIiwiUEFTU18zIiwiU0hBREVSXzAiLCJTSEFERVJfMSIsIlNIQURFUl8yIiwiU0hBREVSXzMiLCJTdWJNb2RlbFBvb2wiLCJTVUJfTU9ERUwiLCJNb2RlbFZpZXciLCJtb2RlbFZpZXdEYXRhVHlwZSIsIkVOQUJMRUQiLCJWSVNfRkxBR1MiLCJDQVNUX1NIQURPVyIsIldPUkxEX0JPVU5EUyIsIk5PREUiLCJUUkFOU0ZPUk0iLCJNb2RlbFBvb2wiLCJNT0RFTCIsIkFBQkJWaWV3IiwiYWFiYlZpZXdEYXRhVHlwZSIsIkNFTlRFUiIsIkhBTEZfRVhURU5TSU9OIiwiQUFCQlBvb2wiLCJBQUJCIiwiU2NlbmVWaWV3Iiwic2NlbmVWaWV3RGF0YVR5cGUiLCJNQUlOX0xJR0hUIiwiU2NlbmVQb29sIiwiU0NFTkUiLCJDYW1lcmFWaWV3IiwiY2FtZXJhVmlld0RhdGFUeXBlIiwiV0lEVEgiLCJIRUlHSFQiLCJFWFBPU1VSRSIsIkNMRUFSX0ZMQUciLCJDTEVBUl9ERVBUSCIsIkNMRUFSX1NURU5DSUwiLCJGUlVTVFVNIiwiRk9SV0FSRCIsIlBPU0lUSU9OIiwiVklFV19QT1JUIiwiQ0xFQVJfQ09MT1IiLCJNQVRfVklFVyIsIk1BVF9WSUVXX1BST0oiLCJNQVRfVklFV19QUk9KX0lOViIsIk1BVF9QUk9KIiwiTUFUX1BST0pfSU5WIiwiQ2FtZXJhUG9vbCIsIkNBTUVSQSIsIk5vZGVWaWV3Iiwibm9kZVZpZXdEYXRhVHlwZSIsIkxBWUVSIiwiV09STERfU0NBTEUiLCJXT1JMRF9QT1NJVElPTiIsIldPUkxEX1JPVEFUSU9OIiwiV09STERfTUFUUklYIiwiTm9kZVBvb2wiLCJSb290VmlldyIsInJvb3RWaWV3RGF0YVR5cGUiLCJDVU1VTEFUSVZFX1RJTUUiLCJGUkFNRV9USU1FIiwiUm9vdFBvb2wiLCJST09UIiwiUmVuZGVyV2luZG93VmlldyIsInJlbmRlcldpbmRvd0RhdGFUeXBlIiwiSEFTX09OX1NDUkVFTl9BVFRBQ0hNRU5UUyIsIkhBU19PRkZfU0NSRUVOX0FUVEFDSE1FTlRTIiwiUmVuZGVyV2luZG93UG9vbCIsIlJFTkRFUl9XSU5ET1ciLCJGcnVzdHVtVmlldyIsImZydXN0dW1WaWV3RGF0YVR5cGUiLCJWRVJUSUNFUyIsIlBMQU5FUyIsIkZydXN0dW1Qb29sIiwiQW1iaWVudFZpZXciLCJhbWJpZW50Vmlld0RhdGFUeXBlIiwiRU5BQkxFIiwiSUxMVU0iLCJTS1lfQ09MT1IiLCJHUk9VTkRfQUxCRURPIiwiQW1iaWVudFBvb2wiLCJBTUJJRU5UIiwiU2t5Ym94VmlldyIsInNreWJveERhdGFUeXBlIiwiSVNfUkdCRSIsIlVTRV9JQkwiLCJTa3lib3hQb29sIiwiU0tZQk9YIiwiRm9nVmlldyIsImZvZ1ZpZXdEYXRhVHlwZSIsIlRZUEUiLCJERU5TSVRZIiwiU1RBUlQiLCJFTkQiLCJBVFRFTiIsIlRPUCIsIlJBTkdFIiwiQ09MT1IiLCJGb2dQb29sIiwiRk9HIiwiU2hhZG93c1ZpZXciLCJzaGFkb3dzVmlld0RhdGFUeXBlIiwiRElTVEFOQ0UiLCJJTlNUQU5DRV9QQVNTIiwiUExBTkFSX1BBU1MiLCJORUFSIiwiRkFSIiwiQVNQRUNUIiwiUENGX1RZUEUiLCJESVJUWSIsIk9SVEhPX1NJWkUiLCJTSVpFIiwiTk9STUFMIiwiU1BIRVJFIiwiU2hhZG93c1Bvb2wiLCJTSEFET1ciLCJMaWdodFZpZXciLCJsaWdodFZpZXdEYXRhVHlwZSIsIlVTRV9DT0xPUl9URU1QRVJBVFVSRSIsIklMTFVNSU5BTkNFIiwiRElSRUNUSU9OIiwiQ09MT1JfVEVNUEVSQVRVUkVfUkdC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Q3RHLElBSGtELEVBRzNDbkwsY0FBYyxDQUFDOEIsTUFINEIsdUNBSTVEMlAsU0FBUyxDQUFDSSxTQUprRCxFQUl0QzdSLGNBQWMsQ0FBQzZCLE9BSnVCLHVDQUs1RDRQLFNBQVMsQ0FBQ25CLEtBTGtELEVBSzFDdFEsY0FBYyxDQUFDNkIsT0FMMkIsdUNBTTVENFAsU0FBUyxDQUFDSyxxQkFOa0QsRUFNMUI5UixjQUFjLENBQUM2QixPQU5XLHVDQU81RDRQLFNBQVMsQ0FBQ3BRLEtBUGtELEVBTzFDckIsY0FBYyxDQUFDeUIsS0FQMkIsc0JBQWpFO0FBU08sTUFBTXNRLFNBQVMsR0FBRyxJQUFJOVIsVUFBSixDQUFpRW1ILFFBQVEsQ0FBQzRLLEtBQTFFLEVBQWlGTixpQkFBakYsRUFBb0dELFNBQXBHLEVBQStHLENBQS9HLENBQWxCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBoaWRkZW5cclxuICovXHJcblxyXG5pbXBvcnQgeyBERUJVRywgSlNCIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IHsgTmF0aXZlQnVmZmVyUG9vbCwgTmF0aXZlT2JqZWN0UG9vbCwgTmF0aXZlQXJyYXlQb29sIH0gZnJvbSAnLi9uYXRpdmUtcG9vbHMnO1xyXG5pbXBvcnQgeyBHRlhSYXN0ZXJpemVyU3RhdGUsIEdGWERlcHRoU3RlbmNpbFN0YXRlLCBHRlhCbGVuZFN0YXRlLCBHRlhEZXNjcmlwdG9yU2V0SW5mbyxcclxuICAgIEdGWERldmljZSwgR0ZYRGVzY3JpcHRvclNldCwgR0ZYU2hhZGVySW5mbywgR0ZYU2hhZGVyLCBHRlhJbnB1dEFzc2VtYmxlckluZm8sIEdGWElucHV0QXNzZW1ibGVyLFxyXG4gICAgR0ZYUGlwZWxpbmVMYXlvdXRJbmZvLCBHRlhQaXBlbGluZUxheW91dCwgR0ZYRnJhbWVidWZmZXIsIEdGWEZyYW1lYnVmZmVySW5mbywgR0ZYUHJpbWl0aXZlTW9kZSwgR0ZYRHluYW1pY1N0YXRlRmxhZ3MsIEdGWENsZWFyRmxhZywgR0ZYQ29sb3IgfSBmcm9tICcuLi8uLi9nZngnO1xyXG5pbXBvcnQgeyBSZW5kZXJQYXNzU3RhZ2UgfSBmcm9tICcuLi8uLi9waXBlbGluZS9kZWZpbmUnO1xyXG5pbXBvcnQgeyBCYXRjaGluZ1NjaGVtZXMgfSBmcm9tICcuL3Bhc3MnO1xyXG5pbXBvcnQgeyBMYXllcnMgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9sYXllcnMnO1xyXG5pbXBvcnQgeyBWZWMyLCBWZWMzLCBWZWM0LCBRdWF0LCBDb2xvciwgUmVjdCwgTWF0NCwgSVZlYzJMaWtlLCBJVmVjM0xpa2UsIElWZWM0TGlrZSwgSU1hdDRMaWtlIH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IHBsYW5lIH0gZnJvbSAnLi4vLi4vZ2VvbWV0cnknO1xyXG5cclxuaW50ZXJmYWNlIElUeXBlZEFycmF5Q29uc3RydWN0b3I8VD4ge1xyXG4gICAgbmV3KGJ1ZmZlcjogQXJyYXlCdWZmZXJMaWtlLCBieXRlT2Zmc2V0OiBudW1iZXIsIGxlbmd0aD86IG51bWJlcik6IFQ7XHJcbiAgICByZWFkb25seSBCWVRFU19QRVJfRUxFTUVOVDogbnVtYmVyO1xyXG59XHJcblxyXG4vLyBhIGxpdHRsZSBoYWNreSwgYnV0IHdvcmtzIChkaWZmZXJlbnQgc3BlY2lhbGl6YXRpb25zIHNob3VsZCBub3QgYmUgYXNzaWduYWJsZSB0byBlYWNoIG90aGVyKVxyXG5pbnRlcmZhY2UgSUhhbmRsZTxUIGV4dGVuZHMgUG9vbFR5cGU+IGV4dGVuZHMgTnVtYmVyIHtcclxuICAgIC8vIHdlIG1ha2UgdGhpcyBub24tb3B0aW9uYWwgc28gdGhhdCBldmVuIHBsYWluIG51bWJlcnMgd291bGQgbm90IGJlIGRpcmVjdGx5IGFzc2lnbmFibGUgdG8gaGFuZGxlcy5cclxuICAgIC8vIHRoaXMgc3RyaWN0bmVzcyB3aWxsIGludHJvZHVjZSBzb21lIGNhc3RpbmcgaGFzc2xlIGluIHRoZSBwb29sIGltcGxlbWVudGF0aW9uIGl0c2VsZlxyXG4gICAgLy8gYnV0IGJlY29tZXMgZ2VuZXJhbGx5IG1vcmUgdXNlZnVsIGZvciBjbGllbnQgY29kZSB0eXBlIGNoZWNraW5nLlxyXG4gICAgXzogVDtcclxufVxyXG5cclxuZW51bSBCdWZmZXJEYXRhVHlwZSB7XHJcbiAgICBVSU5UMzIsXHJcbiAgICBGTE9BVDMyLFxyXG4gICAgTkVWRVIsXHJcbn1cclxuXHJcbnR5cGUgQnVmZmVyTWFuaWZlc3QgPSB7IFtrZXk6IHN0cmluZ106IG51bWJlciB8IHN0cmluZzsgQ09VTlQ6IG51bWJlcjsgfTtcclxudHlwZSBTdGFuZGFyZEJ1ZmZlckVsZW1lbnQgPSBudW1iZXIgfCBJSGFuZGxlPGFueT47XHJcbnR5cGUgR2VuZXJhbEJ1ZmZlckVsZW1lbnQgPSBTdGFuZGFyZEJ1ZmZlckVsZW1lbnQgfCBJVmVjMkxpa2UgfCBJVmVjM0xpa2UgfCBJVmVjNExpa2UgfCBJTWF0NExpa2U7XHJcbnR5cGUgQnVmZmVyVHlwZU1hbmlmZXN0PEUgZXh0ZW5kcyBCdWZmZXJNYW5pZmVzdD4gPSB7IFtrZXkgaW4gRVtrZXlvZiBFXV06IEdlbmVyYWxCdWZmZXJFbGVtZW50IH07XHJcbnR5cGUgQnVmZmVyRGF0YVR5cGVNYW5pZmVzdDxFIGV4dGVuZHMgQnVmZmVyTWFuaWZlc3Q+ID0geyBba2V5IGluIEVba2V5b2YgRV1dOiBCdWZmZXJEYXRhVHlwZSB9O1xyXG5cclxudHlwZSBDb25kaXRpb25hbDxWLCBUPiA9IFQgZXh0ZW5kcyBWID8gVCA6IG5ldmVyO1xyXG5cclxuY2xhc3MgQnVmZmVyUG9vbDxQIGV4dGVuZHMgUG9vbFR5cGUsIEUgZXh0ZW5kcyBCdWZmZXJNYW5pZmVzdCwgTSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDxFPj4ge1xyXG5cclxuICAgIC8vIG5hbWluZyBjb252ZW5zaW9uOlxyXG4gICAgLy8gdGhpcy5fYnVmZmVyVmlld3NbY2h1bmtdW2VudHJ5XVtlbGVtZW50XVxyXG5cclxuICAgIHByaXZhdGUgX2RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PEU+O1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudENvdW50OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9lbnRyeUJpdHM6IG51bWJlcjtcclxuXHJcbiAgICBwcml2YXRlIF9zdHJpZGU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2VudHJpZXNQZXJDaHVuazogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZW50cnlNYXNrOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9jaHVua01hc2s6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3Bvb2xGbGFnOiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfYXJyYXlCdWZmZXJzOiBBcnJheUJ1ZmZlcltdID0gW107XHJcbiAgICBwcml2YXRlIF9mcmVlbGlzdHM6IG51bWJlcltdW10gPSBbXTtcclxuICAgIHByaXZhdGUgX3VpbnQzMkJ1ZmZlclZpZXdzOiBVaW50MzJBcnJheVtdW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2Zsb2F0MzJCdWZmZXJWaWV3czogRmxvYXQzMkFycmF5W11bXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfaGFzVWludDMyOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9oYXNGbG9hdDMyOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgcHJpdmF0ZSBfbmF0aXZlUG9vbDogTmF0aXZlQnVmZmVyUG9vbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocG9vbFR5cGU6IFAsIGRhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PEU+LCBlbnVtVHlwZTogRSwgZW50cnlCaXRzID0gOCkge1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRDb3VudCA9IGVudW1UeXBlLkNPVU5UO1xyXG4gICAgICAgIHRoaXMuX2VudHJ5Qml0cyA9IGVudHJ5Qml0cztcclxuICAgICAgICB0aGlzLl9kYXRhVHlwZSA9IGRhdGFUeXBlO1xyXG5cclxuICAgICAgICBjb25zdCBieXRlc1BlckVsZW1lbnQgPSA0O1xyXG4gICAgICAgIHRoaXMuX3N0cmlkZSA9IGJ5dGVzUGVyRWxlbWVudCAqIHRoaXMuX2VsZW1lbnRDb3VudDtcclxuICAgICAgICB0aGlzLl9lbnRyaWVzUGVyQ2h1bmsgPSAxIDw8IGVudHJ5Qml0cztcclxuICAgICAgICB0aGlzLl9lbnRyeU1hc2sgPSB0aGlzLl9lbnRyaWVzUGVyQ2h1bmsgLSAxO1xyXG4gICAgICAgIHRoaXMuX3Bvb2xGbGFnID0gMSA8PCAzMDtcclxuICAgICAgICB0aGlzLl9jaHVua01hc2sgPSB+KHRoaXMuX2VudHJ5TWFzayB8IHRoaXMuX3Bvb2xGbGFnKTtcclxuICAgICAgICB0aGlzLl9uYXRpdmVQb29sID0gbmV3IE5hdGl2ZUJ1ZmZlclBvb2wocG9vbFR5cGUsIGVudHJ5Qml0cywgdGhpcy5fc3RyaWRlKTtcclxuXHJcbiAgICAgICAgbGV0IHR5cGU6IEJ1ZmZlckRhdGFUeXBlID0gQnVmZmVyRGF0YVR5cGUuTkVWRVI7XHJcbiAgICAgICAgbGV0IGhhc0Zsb2F0MzIgPSBmYWxzZTsgbGV0IGhhc1VpbnQzMiA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAoY29uc3QgZSBpbiBkYXRhVHlwZSkge1xyXG4gICAgICAgICAgICBoYXNGbG9hdDMyID0gdGhpcy5faGFzRmxvYXQzMjtcclxuICAgICAgICAgICAgaGFzVWludDMyID0gdGhpcy5faGFzVWludDMyO1xyXG4gICAgICAgICAgICBpZiAoaGFzVWludDMyICYmIGhhc0Zsb2F0MzIpIHtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0eXBlID0gZGF0YVR5cGVbZV07XHJcbiAgICAgICAgICAgIGlmICghaGFzRmxvYXQzMiAmJiAgdHlwZSA9PT0gQnVmZmVyRGF0YVR5cGUuRkxPQVQzMikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faGFzRmxvYXQzMiA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWhhc1VpbnQzMiAmJiB0eXBlID09PSBCdWZmZXJEYXRhVHlwZS5VSU5UMzIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2hhc1VpbnQzMiA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFsbG9jICgpOiBJSGFuZGxlPFA+IHtcclxuICAgICAgICBsZXQgaSA9IDA7XHJcbiAgICAgICAgZm9yICg7IGkgPCB0aGlzLl9mcmVlbGlzdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuX2ZyZWVsaXN0c1tpXTtcclxuICAgICAgICAgICAgaWYgKGxpc3QubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBqID0gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdOyBsaXN0Lmxlbmd0aC0tO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChpIDw8IHRoaXMuX2VudHJ5Qml0cykgKyBqICsgdGhpcy5fcG9vbEZsYWcgYXMgdW5rbm93biBhcyBJSGFuZGxlPFA+O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGFkZCBhIG5ldyBjaHVua1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuX25hdGl2ZVBvb2wuYWxsb2NhdGVOZXdDaHVuaygpO1xyXG4gICAgICAgIGNvbnN0IGZsb2F0MzJCdWZmZXJWaWV3czogRmxvYXQzMkFycmF5W10gPSBbXTtcclxuICAgICAgICBjb25zdCB1aW50MzJCdWZmZXJWaWV3czogVWludDMyQXJyYXlbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGZyZWVsaXN0OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0IGhhc0Zsb2F0MzIgPSB0aGlzLl9oYXNGbG9hdDMyO1xyXG4gICAgICAgIGNvbnN0IGhhc1VpbnQzMiA9IHRoaXMuX2hhc1VpbnQzMjtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2VudHJpZXNQZXJDaHVuazsgaisrKSB7XHJcbiAgICAgICAgICAgIGlmIChoYXNGbG9hdDMyKSB7XHJcbiAgICAgICAgICAgICAgICBmbG9hdDMyQnVmZmVyVmlld3MucHVzaChuZXcgRmxvYXQzMkFycmF5KGJ1ZmZlciwgdGhpcy5fc3RyaWRlICogaiwgdGhpcy5fZWxlbWVudENvdW50KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhhc1VpbnQzMikge1xyXG4gICAgICAgICAgICAgICAgdWludDMyQnVmZmVyVmlld3MucHVzaChuZXcgVWludDMyQXJyYXkoYnVmZmVyLCB0aGlzLl9zdHJpZGUgKiBqLCB0aGlzLl9lbGVtZW50Q291bnQpKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChqKSB7IGZyZWVsaXN0LnB1c2goaik7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXJyYXlCdWZmZXJzLnB1c2goYnVmZmVyKTtcclxuICAgICAgICBpZiAoaGFzVWludDMyKSB0aGlzLl91aW50MzJCdWZmZXJWaWV3cy5wdXNoKHVpbnQzMkJ1ZmZlclZpZXdzKTtcclxuICAgICAgICBpZiAoaGFzRmxvYXQzMikgdGhpcy5fZmxvYXQzMkJ1ZmZlclZpZXdzLnB1c2goZmxvYXQzMkJ1ZmZlclZpZXdzKTtcclxuICAgICAgICB0aGlzLl9mcmVlbGlzdHMucHVzaChmcmVlbGlzdCk7XHJcbiAgICAgICAgcmV0dXJuIChpIDw8IHRoaXMuX2VudHJ5Qml0cykgKyB0aGlzLl9wb29sRmxhZyBhcyB1bmtub3duIGFzIElIYW5kbGU8UD47IC8vIGd1YXJhbnRlZXMgdGhlIGhhbmRsZSBpcyBhbHdheXMgbm90IHplcm9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgb3V0IGZyb20gYnVmZmVyIHBvb2wuXHJcbiAgICAgKlxyXG4gICAgICogTm90ZSB0aGUgdHlwZSBpbmZlcmVuY2UgZG9lcyBub3Qgd29yayB3aGVuIGBlbGVtZW50YCBpcyBub3QgZGlyZWN0bHlcclxuICAgICAqIGFuIHByZS1kZWNsYXJlZCBlbnVtIHZhbHVlOiAoZS5nLiB3aGVuIGRvaW5nIGFyaXRobWV0aWMgb3BlcmF0aW9ucylcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBTdWJNb2RlbFBvb2wuZ2V0KGhhbmRsZSwgU3ViTW9kZWxWaWV3LlNIQURFUl8wICsgcGFzc0luZGV4KTsgLy8gdGhlIHJldHVybiB2YWx1ZSB3aWxsIGhhdmUgdHlwZSBHZW5lcmFsQnVmZmVyRWxlbWVudFxyXG4gICAgICogYGBgXHJcbiAgICAgKlxyXG4gICAgICogVG8gcHJvcGVybHkgZGVjbGFyZSB0aGUgdmFyaWFibGUgdHlwZSwgeW91IGhhdmUgdHdvIG9wdGlvbnM6XHJcbiAgICAgKiBgYGB0c1xyXG4gICAgICogY29uc3QgaFNoYWRlciA9IFN1Yk1vZGVsUG9vbC5nZXQoaGFuZGxlLCBTdWJNb2RlbFZpZXcuU0hBREVSXzAgKyBwYXNzSW5kZXgpIGFzIFNoYWRlckhhbmRsZTsgLy8gb3B0aW9uICMxXHJcbiAgICAgKiBjb25zdCBoU2hhZGVyID0gU3ViTW9kZWxQb29sLmdldDxTdWJNb2RlbFZpZXcuU0hBREVSXzA+KGhhbmRsZSwgU3ViTW9kZWxWaWV3LlNIQURFUl8wICsgcGFzc0luZGV4KTsgLy8gb3B0aW9uICMyXHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldDxLIGV4dGVuZHMgRVtrZXlvZiBFXT4gKGhhbmRsZTogSUhhbmRsZTxQPiwgZWxlbWVudDogSyk6IENvbmRpdGlvbmFsPFN0YW5kYXJkQnVmZmVyRWxlbWVudCwgTVtLXT4ge1xyXG4gICAgICAgIGNvbnN0IGNodW5rID0gKHRoaXMuX2NodW5rTWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcikgPj4gdGhpcy5fZW50cnlCaXRzO1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fZW50cnlNYXNrICYgaGFuZGxlIGFzIHVua25vd24gYXMgbnVtYmVyO1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlclZpZXdzID0gdGhpcy5fZGF0YVR5cGVbZWxlbWVudF0gPT09IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMiA/IHRoaXMuX3VpbnQzMkJ1ZmZlclZpZXdzIDogdGhpcy5fZmxvYXQzMkJ1ZmZlclZpZXdzO1xyXG4gICAgICAgIGlmIChERUJVRyAmJiAoIWhhbmRsZSB8fCBjaHVuayA8IDAgfHwgY2h1bmsgPj0gYnVmZmVyVmlld3MubGVuZ3RoIHx8XHJcbiAgICAgICAgICAgIGVudHJ5IDwgMCB8fCBlbnRyeSA+PSB0aGlzLl9lbnRyaWVzUGVyQ2h1bmsgfHwgdGhpcy5fZnJlZWxpc3RzW2NodW5rXS5maW5kKChuKSA9PiBuID09PSBlbnRyeSkpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignaW52YWxpZCBidWZmZXIgcG9vbCBoYW5kbGUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIDAgYXMgQ29uZGl0aW9uYWw8U3RhbmRhcmRCdWZmZXJFbGVtZW50LCBNW0tdPjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGJ1ZmZlclZpZXdzW2NodW5rXVtlbnRyeV1bZWxlbWVudCBhcyBudW1iZXJdIGFzIENvbmRpdGlvbmFsPFN0YW5kYXJkQnVmZmVyRWxlbWVudCwgTVtLXT47XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldDxLIGV4dGVuZHMgRVtrZXlvZiBFXT4gKGhhbmRsZTogSUhhbmRsZTxQPiwgZWxlbWVudDogSywgdmFsdWU6IENvbmRpdGlvbmFsPFN0YW5kYXJkQnVmZmVyRWxlbWVudCwgTVtLXT4pIHtcclxuICAgICAgICBjb25zdCBjaHVuayA9ICh0aGlzLl9jaHVua01hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpID4+IHRoaXMuX2VudHJ5Qml0cztcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX2VudHJ5TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3cyA9IHRoaXMuX2RhdGFUeXBlW2VsZW1lbnRdID09PSBCdWZmZXJEYXRhVHlwZS5VSU5UMzIgPyB0aGlzLl91aW50MzJCdWZmZXJWaWV3cyA6IHRoaXMuX2Zsb2F0MzJCdWZmZXJWaWV3cztcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgY2h1bmsgPCAwIHx8IGNodW5rID49IGJ1ZmZlclZpZXdzLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICBlbnRyeSA8IDAgfHwgZW50cnkgPj0gdGhpcy5fZW50cmllc1BlckNodW5rIHx8IHRoaXMuX2ZyZWVsaXN0c1tjaHVua10uZmluZCgobikgPT4gbiA9PT0gZW50cnkpKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgYnVmZmVyIHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnVmZmVyVmlld3NbY2h1bmtdW2VudHJ5XVtlbGVtZW50IGFzIG51bWJlcl0gPSB2YWx1ZSBhcyBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZlYzI8SyBleHRlbmRzIEVba2V5b2YgRV0+IChoYW5kbGU6IElIYW5kbGU8UD4sIGVsZW1lbnQ6IEssIHZlYzI6IENvbmRpdGlvbmFsPElWZWMyTGlrZSwgTVtLXT4pIHtcclxuICAgICAgICAvLyBXZWIgZW5naW5lIGhhcyBWZWMyIHByb3BlcnR5LCBkb24ndCByZWNvcmQgaXQgaW4gc2hhcmVkIG1lbW9yeS5cclxuICAgICAgICBpZiAoIUpTQikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBjaHVuayA9ICh0aGlzLl9jaHVua01hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpID4+IHRoaXMuX2VudHJ5Qml0cztcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX2VudHJ5TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3cyA9IHRoaXMuX2RhdGFUeXBlW2VsZW1lbnRdID09PSBCdWZmZXJEYXRhVHlwZS5VSU5UMzIgPyB0aGlzLl91aW50MzJCdWZmZXJWaWV3cyA6IHRoaXMuX2Zsb2F0MzJCdWZmZXJWaWV3cztcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgY2h1bmsgPCAwIHx8IGNodW5rID49IGJ1ZmZlclZpZXdzLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICBlbnRyeSA8IDAgfHwgZW50cnkgPj0gdGhpcy5fZW50cmllc1BlckNodW5rIHx8IHRoaXMuX2ZyZWVsaXN0c1tjaHVua10uZmluZCgobikgPT4gbiA9PT0gZW50cnkpKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgYnVmZmVyIHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZWxlbWVudCBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCB2aWV3ID0gYnVmZmVyVmlld3NbY2h1bmtdW2VudHJ5XTtcclxuICAgICAgICB2aWV3W2luZGV4KytdID0gdmVjMi54OyB2aWV3W2luZGV4KytdID0gdmVjMi55O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWZWMzPEsgZXh0ZW5kcyBFW2tleW9mIEVdPiAoaGFuZGxlOiBJSGFuZGxlPFA+LCBlbGVtZW50OiBLLCB2ZWMzOiBDb25kaXRpb25hbDxJVmVjM0xpa2UsIE1bS10+KSB7XHJcbiAgICAgICAgLy8gV2ViIGVuZ2luZSBoYXMgVmVjMyBwcm9wZXJ0eSwgZG9uJ3QgcmVjb3JkIGl0IGluIHNoYXJlZCBtZW1vcnkuXHJcbiAgICAgICAgaWYgKCFKU0IpIHJldHVybjtcclxuXHJcbiAgICAgICAgY29uc3QgY2h1bmsgPSAodGhpcy5fY2h1bmtNYXNrICYgaGFuZGxlIGFzIHVua25vd24gYXMgbnVtYmVyKSA+PiB0aGlzLl9lbnRyeUJpdHM7XHJcbiAgICAgICAgY29uc3QgZW50cnkgPSB0aGlzLl9lbnRyeU1hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXI7XHJcbiAgICAgICAgY29uc3QgYnVmZmVyVmlld3MgPSB0aGlzLl9kYXRhVHlwZVtlbGVtZW50XSA9PT0gQnVmZmVyRGF0YVR5cGUuVUlOVDMyID8gdGhpcy5fdWludDMyQnVmZmVyVmlld3MgOiB0aGlzLl9mbG9hdDMyQnVmZmVyVmlld3M7XHJcbiAgICAgICAgaWYgKERFQlVHICYmICghaGFuZGxlIHx8IGNodW5rIDwgMCB8fCBjaHVuayA+PSBidWZmZXJWaWV3cy5sZW5ndGggfHxcclxuICAgICAgICAgICAgZW50cnkgPCAwIHx8IGVudHJ5ID49IHRoaXMuX2VudHJpZXNQZXJDaHVuayB8fCB0aGlzLl9mcmVlbGlzdHNbY2h1bmtdLmZpbmQoKG4pID0+IG4gPT09IGVudHJ5KSkpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdpbnZhbGlkIGJ1ZmZlciBwb29sIGhhbmRsZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbmRleCA9IGVsZW1lbnQgYXMgdW5rbm93biBhcyBudW1iZXI7XHJcbiAgICAgICAgY29uc3QgdmlldyA9IGJ1ZmZlclZpZXdzW2NodW5rXVtlbnRyeV07XHJcbiAgICAgICAgdmlld1tpbmRleCsrXSA9IHZlYzMueDsgdmlld1tpbmRleCsrXSA9IHZlYzMueTsgdmlld1tpbmRleF0gPSB2ZWMzLno7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFZlYzQ8SyBleHRlbmRzIEVba2V5b2YgRV0+IChoYW5kbGU6IElIYW5kbGU8UD4sIGVsZW1lbnQ6IEssIHZlYzQ6IENvbmRpdGlvbmFsPElWZWM0TGlrZSwgTVtLXT4pIHtcclxuICAgICAgICAvLyBXZWIgZW5naW5lIGhhcyBWZWM0IHByb3BlcnR5LCBkb24ndCByZWNvcmQgaXQgaW4gc2hhcmVkIG1lbW9yeS5cclxuICAgICAgICBpZiAoIUpTQikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBjaHVuayA9ICh0aGlzLl9jaHVua01hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpID4+IHRoaXMuX2VudHJ5Qml0cztcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX2VudHJ5TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3cyA9IHRoaXMuX2RhdGFUeXBlW2VsZW1lbnRdID09PSBCdWZmZXJEYXRhVHlwZS5VSU5UMzIgPyB0aGlzLl91aW50MzJCdWZmZXJWaWV3cyA6IHRoaXMuX2Zsb2F0MzJCdWZmZXJWaWV3cztcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgY2h1bmsgPCAwIHx8IGNodW5rID49IGJ1ZmZlclZpZXdzLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICBlbnRyeSA8IDAgfHwgZW50cnkgPj0gdGhpcy5fZW50cmllc1BlckNodW5rIHx8IHRoaXMuX2ZyZWVsaXN0c1tjaHVua10uZmluZCgobikgPT4gbiA9PT0gZW50cnkpKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgYnVmZmVyIHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZWxlbWVudCBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCB2aWV3ID0gYnVmZmVyVmlld3NbY2h1bmtdW2VudHJ5XTtcclxuICAgICAgICB2aWV3W2luZGV4KytdID0gdmVjNC54OyB2aWV3W2luZGV4KytdID0gdmVjNC55O1xyXG4gICAgICAgIHZpZXdbaW5kZXgrK10gPSB2ZWM0Lno7IHZpZXdbaW5kZXhdICAgPSB2ZWM0Lnc7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1hdDQ8SyBleHRlbmRzIEVba2V5b2YgRV0+IChoYW5kbGU6IElIYW5kbGU8UD4sIGVsZW1lbnQ6IEssIG1hdDQ6IENvbmRpdGlvbmFsPElNYXQ0TGlrZSwgTVtLXT4pIHtcclxuICAgICAgICAvLyBXZWIgZW5naW5lIGhhcyBtYXQ0IHByb3BlcnR5LCBkb24ndCByZWNvcmQgaXQgaW4gc2hhcmVkIG1lbW9yeS5cclxuICAgICAgICBpZiAoIUpTQikgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBjaHVuayA9ICh0aGlzLl9jaHVua01hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpID4+IHRoaXMuX2VudHJ5Qml0cztcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX2VudHJ5TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCBidWZmZXJWaWV3cyA9IHRoaXMuX2RhdGFUeXBlW2VsZW1lbnRdID09PSBCdWZmZXJEYXRhVHlwZS5VSU5UMzIgPyB0aGlzLl91aW50MzJCdWZmZXJWaWV3cyA6IHRoaXMuX2Zsb2F0MzJCdWZmZXJWaWV3cztcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgY2h1bmsgPCAwIHx8IGNodW5rID49IGJ1ZmZlclZpZXdzLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICBlbnRyeSA8IDAgfHwgZW50cnkgPj0gdGhpcy5fZW50cmllc1BlckNodW5rIHx8IHRoaXMuX2ZyZWVsaXN0c1tjaHVua10uZmluZCgobikgPT4gbiA9PT0gZW50cnkpKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgYnVmZmVyIHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGluZGV4ID0gZWxlbWVudCBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBjb25zdCB2aWV3ID0gYnVmZmVyVmlld3NbY2h1bmtdW2VudHJ5XTtcclxuICAgICAgICB2aWV3W2luZGV4KytdID0gbWF0NC5tMDA7IHZpZXdbaW5kZXgrK10gPSBtYXQ0Lm0wMTsgdmlld1tpbmRleCsrXSA9IG1hdDQubTAyOyB2aWV3W2luZGV4KytdID0gbWF0NC5tMDM7XHJcbiAgICAgICAgdmlld1tpbmRleCsrXSA9IG1hdDQubTA0OyB2aWV3W2luZGV4KytdID0gbWF0NC5tMDU7IHZpZXdbaW5kZXgrK10gPSBtYXQ0Lm0wNjsgdmlld1tpbmRleCsrXSA9IG1hdDQubTA3O1xyXG4gICAgICAgIHZpZXdbaW5kZXgrK10gPSBtYXQ0Lm0wODsgdmlld1tpbmRleCsrXSA9IG1hdDQubTA5OyB2aWV3W2luZGV4KytdID0gbWF0NC5tMTA7IHZpZXdbaW5kZXgrK10gPSBtYXQ0Lm0xMTtcclxuICAgICAgICB2aWV3W2luZGV4KytdID0gbWF0NC5tMTI7IHZpZXdbaW5kZXgrK10gPSBtYXQ0Lm0xMzsgdmlld1tpbmRleCsrXSA9IG1hdDQubTE0OyB2aWV3W2luZGV4XSAgID0gbWF0NC5tMTU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZyZWUgKGhhbmRsZTogSUhhbmRsZTxQPikge1xyXG4gICAgICAgIGNvbnN0IGNodW5rID0gKHRoaXMuX2NodW5rTWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcikgPj4gdGhpcy5fZW50cnlCaXRzO1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fZW50cnlNYXNrICYgaGFuZGxlIGFzIHVua25vd24gYXMgbnVtYmVyO1xyXG4gICAgICAgIGlmIChERUJVRyAmJiAoIWhhbmRsZSB8fCBjaHVuayA8IDAgfHwgY2h1bmsgPj0gdGhpcy5fZnJlZWxpc3RzLmxlbmd0aCB8fFxyXG4gICAgICAgICAgICBlbnRyeSA8IDAgfHwgZW50cnkgPj0gdGhpcy5fZW50cmllc1BlckNodW5rIHx8IHRoaXMuX2ZyZWVsaXN0c1tjaHVua10uZmluZCgobikgPT4gbiA9PT0gZW50cnkpKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ2ludmFsaWQgYnVmZmVyIHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgYnVmZmVyVmlld3MgPSB0aGlzLl9oYXNVaW50MzIgPyB0aGlzLl91aW50MzJCdWZmZXJWaWV3cyA6IHRoaXMuX2Zsb2F0MzJCdWZmZXJWaWV3cztcclxuICAgICAgICBidWZmZXJWaWV3c1tjaHVua11bZW50cnldLmZpbGwoMCk7XHJcbiAgICAgICAgdGhpcy5fZnJlZWxpc3RzW2NodW5rXS5wdXNoKGVudHJ5KTtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgT2JqZWN0UG9vbDxULCBQIGV4dGVuZHMgUG9vbFR5cGUsIEEgZXh0ZW5kcyBhbnlbXT4ge1xyXG5cclxuICAgIHByaXZhdGUgX2N0b3I6IChhcmdzOiBBLCBvYmo/OiBUKSA9PiBUO1xyXG4gICAgcHJpdmF0ZSBfZHRvcj86IChvYmo6IFQpID0+IHZvaWQ7XHJcbiAgICBwcml2YXRlIF9pbmRleE1hc2s6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3Bvb2xGbGFnOiBudW1iZXI7XHJcblxyXG4gICAgcHJpdmF0ZSBfYXJyYXk6IFRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfZnJlZWxpc3Q6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgcHJpdmF0ZSBfbmF0aXZlUG9vbDogTmF0aXZlT2JqZWN0UG9vbDxUPjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocG9vbFR5cGU6IFAsIGN0b3I6IChhcmdzOiBBLCBvYmo/OiBUKSA9PiBULCBkdG9yPzogKG9iajogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuX2N0b3IgPSBjdG9yO1xyXG4gICAgICAgIGlmIChkdG9yKSB7IHRoaXMuX2R0b3IgPSBkdG9yOyB9XHJcbiAgICAgICAgdGhpcy5fcG9vbEZsYWcgPSAxIDw8IDI5O1xyXG4gICAgICAgIHRoaXMuX2luZGV4TWFzayA9IH50aGlzLl9wb29sRmxhZztcclxuICAgICAgICB0aGlzLl9uYXRpdmVQb29sID0gbmV3IE5hdGl2ZU9iamVjdFBvb2wocG9vbFR5cGUsIHRoaXMuX2FycmF5KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWxsb2MgKC4uLmFyZ3M6IEEpOiBJSGFuZGxlPFA+IHtcclxuICAgICAgICBjb25zdCBmcmVlbGlzdCA9IHRoaXMuX2ZyZWVsaXN0O1xyXG4gICAgICAgIGxldCBpID0gLTE7XHJcbiAgICAgICAgaWYgKGZyZWVsaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBpID0gZnJlZWxpc3RbZnJlZWxpc3QubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGZyZWVsaXN0Lmxlbmd0aC0tO1xyXG4gICAgICAgICAgICB0aGlzLl9hcnJheVtpXSA9IHRoaXMuX2N0b3IoYXJndW1lbnRzIGFzIHVua25vd24gYXMgQSwgdGhpcy5fYXJyYXlbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgaSA9IHRoaXMuX2FycmF5Lmxlbmd0aDtcclxuICAgICAgICAgICAgY29uc3Qgb2JqID0gdGhpcy5fY3Rvcihhcmd1bWVudHMgYXMgdW5rbm93biBhcyBBKTtcclxuICAgICAgICAgICAgaWYgKCFvYmopIHsgcmV0dXJuIDAgYXMgdW5rbm93biBhcyBJSGFuZGxlPFA+OyB9XHJcbiAgICAgICAgICAgIHRoaXMuX2FycmF5LnB1c2gob2JqKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGkgKyB0aGlzLl9wb29sRmxhZyBhcyB1bmtub3duIGFzIElIYW5kbGU8UD47IC8vIGd1YXJhbnRlZXMgdGhlIGhhbmRsZSBpcyBhbHdheXMgbm90IHplcm9cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IChoYW5kbGU6IElIYW5kbGU8UD4pIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuX2FycmF5Lmxlbmd0aCB8fCB0aGlzLl9mcmVlbGlzdC5maW5kKChuKSA9PiBuID09PSBpbmRleCkpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignaW52YWxpZCBvYmplY3QgcG9vbCBoYW5kbGUnKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fYXJyYXlbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcmVlIChoYW5kbGU6IElIYW5kbGU8UD4pIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX2luZGV4TWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBpZiAoREVCVUcgJiYgKCFoYW5kbGUgfHwgaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMuX2FycmF5Lmxlbmd0aCB8fCB0aGlzLl9mcmVlbGlzdC5maW5kKChuKSA9PiBuID09PSBpbmRleCkpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignaW52YWxpZCBvYmplY3QgcG9vbCBoYW5kbGUnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5fZHRvcikgeyB0aGlzLl9kdG9yKHRoaXMuX2FycmF5W2luZGV4XSk7IH1cclxuICAgICAgICB0aGlzLl9mcmVlbGlzdC5wdXNoKGluZGV4KTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFA6IHBvb2wgdHlwZVxyXG4gKiBEOiBwb29sIGRhdGEgdHlwZVxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFycmF5UG9vbDxQIGV4dGVuZHMgUG9vbFR5cGUsIEQgZXh0ZW5kcyBQb29sVHlwZT4ge1xyXG4gICAgcHJpdmF0ZSBfbmF0aXZlQXJyYXlQb29sOiBOYXRpdmVBcnJheVBvb2w7XHJcbiAgICBwcml2YXRlIF9hcnJheU1hcDogTWFwPG51bWJlciwgVWludDMyQXJyYXk+ID0gbmV3IE1hcDxudW1iZXIsIFVpbnQzMkFycmF5PigpO1xyXG4gICAgcHJpdmF0ZSBfY3VyQXJyYXlIYW5kbGU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9hcnJheUhhbmRsZUZsYWc6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX2FycmF5SGFuZGxlTWFzazogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfc2l6ZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX3N0ZXA6IG51bWJlciA9IDA7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3Rvci5cclxuICAgICAqIEBwYXJhbSBzaXplIFRoZSBzaXplIG9mIHRoZSBhcnJheVxyXG4gICAgICogQHBhcmFtIHN0ZXAgVGhlIHN0ZXAgc2l6ZSB0byBleHRlbmQgdGhlIGFycmF5IHdoZW4gZXhjZWVkaW5nIHRoZSBhcnJheSBzaXplLlxyXG4gICAgICogSXQgaXMgdGhlIHNhbWUgYXMgc2l6ZSBpZiBpdCBpcyBub3Qgc2V0LlxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoYXJyYXlUeXBlOiBQLCBzaXplOiBudW1iZXIsIHN0ZXA/OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9hcnJheUhhbmRsZUZsYWcgPSAxIDw8IDMwO1xyXG4gICAgICAgIHRoaXMuX2FycmF5SGFuZGxlTWFzayA9IH50aGlzLl9hcnJheUhhbmRsZUZsYWc7XHJcbiAgICAgICAgdGhpcy5fc2l6ZSA9IHNpemUgKyAxO1xyXG4gICAgICAgIHRoaXMuX3N0ZXAgPSBzdGVwIHx8IHNpemU7XHJcbiAgICAgICAgdGhpcy5fbmF0aXZlQXJyYXlQb29sID0gbmV3IE5hdGl2ZUFycmF5UG9vbChhcnJheVR5cGUsIHRoaXMuX3NpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWxsb2NhdGUgYSBuZXcgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSBUaGUgc2l6ZSBvZiB0aGUgYXJyYXlcclxuICAgICAqIEBwYXJhbSBzdGVwIFRoZSBzdGVwIHNpemUgdG8gZXh0ZW5kIHRoZSBhcnJheSB3aGVuIGV4Y2VlZGluZyB0aGUgYXJyYXkgc2l6ZS5cclxuICAgICAqIEl0IGlzIHRoZSBzYW1lIGFzIHNpemUgaWYgaXQgaXMgbm90IHNldC5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGFsbG9jICgpOiBJSGFuZGxlPFA+IHtcclxuICAgICAgICBjb25zdCBoYW5kbGUgPSB0aGlzLl9jdXJBcnJheUhhbmRsZSsrO1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5fbmF0aXZlQXJyYXlQb29sLmFsbG9jKGhhbmRsZSk7XHJcbiAgICAgICAgdGhpcy5fYXJyYXlNYXAuc2V0KGhhbmRsZSwgYXJyYXkpO1xyXG5cclxuICAgICAgICByZXR1cm4gKGhhbmRsZSB8IHRoaXMuX2FycmF5SGFuZGxlRmxhZykgYXMgdW5rbm93biBhcyBJSGFuZGxlPFA+O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmcmVlIChoYW5kbGU6IElIYW5kbGU8UD4pIHtcclxuICAgICAgICBjb25zdCBhcnJheUhhbmRsZSA9IHRoaXMuX2FycmF5SGFuZGxlTWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcjtcclxuICAgICAgICBpZiAodGhpcy5fYXJyYXlNYXAuZ2V0KGFycmF5SGFuZGxlKSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChERUJVRykgY29uc29sZS53YXJuKCdpbnZhbGlkIGFycmF5IHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXJyYXlNYXAuZGVsZXRlKGFycmF5SGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYXNzaWduIChoYW5kbGU6IElIYW5kbGU8UD4sIGluZGV4OiBudW1iZXIsIHZhbHVlOiBJSGFuZGxlPEQ+KSB7XHJcbiAgICAgICAgY29uc3QgYXJyYXlIYW5kbGUgPSB0aGlzLl9hcnJheUhhbmRsZU1hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXI7XHJcbiAgICAgICAgbGV0IGFycmF5ID0gdGhpcy5fYXJyYXlNYXAuZ2V0KGFycmF5SGFuZGxlKTtcclxuICAgICAgICBpZiAoYXJyYXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBpZiAoREVCVUcpIGNvbnNvbGUud2FybignaW52YWxpZCBhcnJheSBwb29sIGhhbmRsZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaXJzdCBlbGVtZW50IGlzIHRoZSBsZW5ndGggb2YgYXJyYXkuXHJcbiAgICAgICAgaW5kZXggPSBpbmRleCArIDE7XHJcbiAgICAgICAgaWYgKGluZGV4ID49IGFycmF5Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICBsZXQgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBsZW5ndGggKz0gdGhpcy5fc3RlcDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYXJyYXkgPSB0aGlzLl9uYXRpdmVBcnJheVBvb2wucmVzaXplKGFycmF5LCBsZW5ndGgsIGFycmF5SGFuZGxlKTtcclxuICAgICAgICAgICAgdGhpcy5fYXJyYXlNYXAuc2V0KGFycmF5SGFuZGxlLCBhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFycmF5W2luZGV4XSA9IHZhbHVlIGFzIHVua25vd24gYXMgbnVtYmVyO1xyXG5cclxuICAgICAgICAvLyBUaGVyZSBtYXkgYmUgaG9sZXMgaW4gdGhlIGFycmF5LlxyXG4gICAgICAgIGNvbnN0IGxlbiA9IGFycmF5WzBdO1xyXG4gICAgICAgIGFycmF5WzBdID0gaW5kZXggPiBsZW4gPyBpbmRleCA6IGxlbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXJhc2UgKGhhbmRsZTogSUhhbmRsZTxQPiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGFycmF5ID0gdGhpcy5fYXJyYXlNYXAuZ2V0KHRoaXMuX2FycmF5SGFuZGxlTWFzayAmIGhhbmRsZSBhcyB1bmtub3duIGFzIG51bWJlcik7XHJcbiAgICAgICAgaWYgKGFycmF5ID09PSB1bmRlZmluZWQgfHwgaW5kZXggPiBhcnJheVswXSkge1xyXG4gICAgICAgICAgICBpZiAoREVCVUcpIGNvbnNvbGUud2FybignaW52YWxpZCBhcnJheSBwb29sIGluZGV4IG9yIGludmFsaWQgYXJyYXkgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGluZGV4ICsgMTsgaSA8IGFycmF5WzBdOyArK2kpIHtcclxuICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtpICsgMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC0tYXJyYXlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHB1c2ggKGhhbmRsZTogSUhhbmRsZTxQPiwgdmFsdWU6IElIYW5kbGU8RD4pIHtcclxuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2FycmF5TWFwLmdldCh0aGlzLl9hcnJheUhhbmRsZU1hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpO1xyXG4gICAgICAgIGlmIChhcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChERUJVRykgY29uc29sZS53YXJuKCdpbnZhbGlkIGFycmF5IHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuYXNzaWduKGhhbmRsZSwgYXJyYXlbMF0sIHZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcG9wIChoYW5kbGU6IElIYW5kbGU8UD4pIHtcclxuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2FycmF5TWFwLmdldCh0aGlzLl9hcnJheUhhbmRsZU1hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpO1xyXG4gICAgICAgIGlmIChhcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChERUJVRykgY29uc29sZS53YXJuKCdpbnZhbGlkIGFycmF5IHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhcnJheVswXSA9PT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLS1hcnJheVswXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDbGVhciB0aGUgY29udGVudHMgb2YgYXJyYXkuXHJcbiAgICAgKiBAcGFyYW0gaGFuZGxlIEhhbmRsZSB0byBiZSBjbGVhci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNsZWFyIChoYW5kbGU6IElIYW5kbGU8UD4pIHtcclxuICAgICAgICBjb25zdCBhcnJheSA9IHRoaXMuX2FycmF5TWFwLmdldCh0aGlzLl9hcnJheUhhbmRsZU1hc2sgJiBoYW5kbGUgYXMgdW5rbm93biBhcyBudW1iZXIpO1xyXG4gICAgICAgIGlmIChhcnJheSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIGlmIChERUJVRykgY29uc29sZS53YXJuKCdpbnZhbGlkIGFycmF5IHBvb2wgaGFuZGxlJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgYXJyYXlbMF0gPSAwO1xyXG4gICAgfVxyXG59O1xyXG5cclxuZW51bSBQb29sVHlwZSB7XHJcbiAgICAvLyBvYmplY3RzXHJcbiAgICBSQVNURVJJWkVSX1NUQVRFLFxyXG4gICAgREVQVEhfU1RFTkNJTF9TVEFURSxcclxuICAgIEJMRU5EX1NUQVRFLFxyXG4gICAgREVTQ1JJUFRPUl9TRVRTLFxyXG4gICAgU0hBREVSLFxyXG4gICAgSU5QVVRfQVNTRU1CTEVSLFxyXG4gICAgUElQRUxJTkVfTEFZT1VULFxyXG4gICAgRlJBTUVCVUZGRVIsXHJcbiAgICAvLyBidWZmZXJzXHJcbiAgICBQQVNTID0gMTAwLFxyXG4gICAgU1VCX01PREVMLFxyXG4gICAgTU9ERUwsXHJcbiAgICBTQ0VORSxcclxuICAgIENBTUVSQSxcclxuICAgIE5PREUsXHJcbiAgICBST09ULFxyXG4gICAgQUFCQixcclxuICAgIFJFTkRFUl9XSU5ET1csXHJcbiAgICBGUlVTVFVNLFxyXG4gICAgQU1CSUVOVCxcclxuICAgIEZPRyxcclxuICAgIFNLWUJPWCxcclxuICAgIFNIQURPVyxcclxuICAgIExJR0hULFxyXG4gICAgLy8gYXJyYXlcclxuICAgIFNVQl9NT0RFTF9BUlJBWSA9IDIwMCxcclxuICAgIE1PREVMX0FSUkFZLFxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgTlVMTF9IQU5ETEUgPSAwIGFzIHVua25vd24gYXMgSUhhbmRsZTxhbnk+O1xyXG5cclxuZXhwb3J0IHR5cGUgUmFzdGVyaXplclN0YXRlSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5SQVNURVJJWkVSX1NUQVRFPjtcclxuZXhwb3J0IHR5cGUgRGVwdGhTdGVuY2lsU3RhdGVIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLkRFUFRIX1NURU5DSUxfU1RBVEU+O1xyXG5leHBvcnQgdHlwZSBCbGVuZFN0YXRlSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5CTEVORF9TVEFURT47XHJcbmV4cG9ydCB0eXBlIERlc2NyaXB0b3JTZXRIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLkRFU0NSSVBUT1JfU0VUUz47XHJcbmV4cG9ydCB0eXBlIFNoYWRlckhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuU0hBREVSPjtcclxuZXhwb3J0IHR5cGUgSW5wdXRBc3NlbWJsZXJIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLklOUFVUX0FTU0VNQkxFUj47XHJcbmV4cG9ydCB0eXBlIFBpcGVsaW5lTGF5b3V0SGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5QSVBFTElORV9MQVlPVVQ+O1xyXG5leHBvcnQgdHlwZSBGcmFtZWJ1ZmZlckhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuRlJBTUVCVUZGRVI+O1xyXG5leHBvcnQgdHlwZSBQYXNzSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5QQVNTPjtcclxuZXhwb3J0IHR5cGUgU3ViTW9kZWxIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLlNVQl9NT0RFTD47XHJcbmV4cG9ydCB0eXBlIE1vZGVsSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5NT0RFTD47XHJcbmV4cG9ydCB0eXBlIFNjZW5lSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5TQ0VORT47XHJcbmV4cG9ydCB0eXBlIENhbWVyYUhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuQ0FNRVJBPjtcclxuZXhwb3J0IHR5cGUgTm9kZUhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuTk9ERT47XHJcbmV4cG9ydCB0eXBlIFJvb3RIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLlJPT1Q+O1xyXG5leHBvcnQgdHlwZSBBQUJCSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5BQUJCPjtcclxuZXhwb3J0IHR5cGUgRnJ1c3R1bUhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuRlJVU1RVTT47XHJcbmV4cG9ydCB0eXBlIFJlbmRlcldpbmRvd0hhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuUkVOREVSX1dJTkRPVz47XHJcbmV4cG9ydCB0eXBlIFN1Yk1vZGVsQXJyYXlIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLlNVQl9NT0RFTF9BUlJBWT47XHJcbmV4cG9ydCB0eXBlIE1vZGVsQXJyYXlIYW5kbGUgPSBJSGFuZGxlPFBvb2xUeXBlLk1PREVMX0FSUkFZPjtcclxuZXhwb3J0IHR5cGUgQW1iaWVudEhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuQU1CSUVOVD47XHJcbmV4cG9ydCB0eXBlIEZvZ0hhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuRk9HPjtcclxuZXhwb3J0IHR5cGUgU2t5Ym94SGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5TS1lCT1g+O1xyXG5leHBvcnQgdHlwZSBTaGFkb3dzSGFuZGxlID0gSUhhbmRsZTxQb29sVHlwZS5TSEFET1c+O1xyXG5leHBvcnQgdHlwZSBMaWdodEhhbmRsZSA9IElIYW5kbGU8UG9vbFR5cGUuTElHSFQ+O1xyXG5cclxuLy8gZG9uJ3QgcmV1c2UgYW55IG9mIHRoZXNlIGRhdGEtb25seSBzdHJ1Y3RzLCBmb3IgR0ZYIG9iamVjdHMgbWF5IGRpcmVjdGx5IHJlZmVyZW5jZSB0aGVtXHJcbmV4cG9ydCBjb25zdCBSYXN0ZXJpemVyU3RhdGVQb29sID0gbmV3IE9iamVjdFBvb2woUG9vbFR5cGUuUkFTVEVSSVpFUl9TVEFURSwgKCkgPT4gbmV3IEdGWFJhc3Rlcml6ZXJTdGF0ZSgpKTtcclxuZXhwb3J0IGNvbnN0IERlcHRoU3RlbmNpbFN0YXRlUG9vbCA9IG5ldyBPYmplY3RQb29sKFBvb2xUeXBlLkRFUFRIX1NURU5DSUxfU1RBVEUsICgpID0+IG5ldyBHRlhEZXB0aFN0ZW5jaWxTdGF0ZSgpKTtcclxuZXhwb3J0IGNvbnN0IEJsZW5kU3RhdGVQb29sID0gbmV3IE9iamVjdFBvb2woUG9vbFR5cGUuQkxFTkRfU1RBVEUsICgpID0+IG5ldyBHRlhCbGVuZFN0YXRlKCkpO1xyXG5cclxuLy8gVE9ETzogY291bGQgdXNlIExhYmVsZWQgVHVwbGUgRWxlbWVudCBmZWF0dXJlIGhlcmUgYWZ0ZXIgbmV4dCBiYWJlbCB1cGRhdGUgKHJlcXVpcmVkIFRTNC4wKyBzdXBwb3J0KVxyXG5leHBvcnQgY29uc3QgU2hhZGVyUG9vbCA9IG5ldyBPYmplY3RQb29sKFBvb2xUeXBlLlNIQURFUixcclxuICAgIChhcmdzOiBbR0ZYRGV2aWNlLCBHRlhTaGFkZXJJbmZvXSwgb2JqPzogR0ZYU2hhZGVyKSA9PiBvYmogPyAob2JqLmluaXRpYWxpemUoYXJnc1sxXSksIG9iaikgOiBhcmdzWzBdLmNyZWF0ZVNoYWRlcihhcmdzWzFdKSxcclxuICAgIChvYmo6IEdGWFNoYWRlcikgPT4gb2JqICYmIG9iai5kZXN0cm95KCksXHJcbik7XHJcbmV4cG9ydCBjb25zdCBEU1Bvb2wgPSBuZXcgT2JqZWN0UG9vbChQb29sVHlwZS5ERVNDUklQVE9SX1NFVFMsXHJcbiAgICAoYXJnczogW0dGWERldmljZSwgR0ZYRGVzY3JpcHRvclNldEluZm9dLCBvYmo/OiBHRlhEZXNjcmlwdG9yU2V0KSA9PiBvYmogPyAob2JqLmluaXRpYWxpemUoYXJnc1sxXSksIG9iaikgOiBhcmdzWzBdLmNyZWF0ZURlc2NyaXB0b3JTZXQoYXJnc1sxXSksXHJcbiAgICAob2JqOiBHRlhEZXNjcmlwdG9yU2V0KSA9PiBvYmogJiYgb2JqLmRlc3Ryb3koKSxcclxuKTtcclxuZXhwb3J0IGNvbnN0IElBUG9vbCA9IG5ldyBPYmplY3RQb29sKFBvb2xUeXBlLklOUFVUX0FTU0VNQkxFUixcclxuICAgIChhcmdzOiBbR0ZYRGV2aWNlLCBHRlhJbnB1dEFzc2VtYmxlckluZm9dLCBvYmo/OiBHRlhJbnB1dEFzc2VtYmxlcikgPT4gb2JqID8gKG9iai5pbml0aWFsaXplKGFyZ3NbMV0pLCBvYmopIDogYXJnc1swXS5jcmVhdGVJbnB1dEFzc2VtYmxlcihhcmdzWzFdKSxcclxuICAgIChvYmo6IEdGWElucHV0QXNzZW1ibGVyKSA9PiBvYmogJiYgb2JqLmRlc3Ryb3koKSxcclxuKTtcclxuZXhwb3J0IGNvbnN0IFBpcGVsaW5lTGF5b3V0UG9vbCA9IG5ldyBPYmplY3RQb29sKFBvb2xUeXBlLlBJUEVMSU5FX0xBWU9VVCxcclxuICAgIChhcmdzOiBbR0ZYRGV2aWNlLCBHRlhQaXBlbGluZUxheW91dEluZm9dLCBvYmo/OiBHRlhQaXBlbGluZUxheW91dCkgPT4gb2JqID8gKG9iai5pbml0aWFsaXplKGFyZ3NbMV0pLCBvYmopIDogYXJnc1swXS5jcmVhdGVQaXBlbGluZUxheW91dChhcmdzWzFdKSxcclxuICAgIChvYmo6IEdGWFBpcGVsaW5lTGF5b3V0KSA9PiBvYmogJiYgb2JqLmRlc3Ryb3koKSxcclxuKTtcclxuZXhwb3J0IGNvbnN0IEZyYW1lYnVmZmVyUG9vbCA9IG5ldyBPYmplY3RQb29sKFBvb2xUeXBlLkZSQU1FQlVGRkVSLFxyXG4gICAgKGFyZ3M6IFtHRlhEZXZpY2UsIEdGWEZyYW1lYnVmZmVySW5mb10sIG9iaj86IEdGWEZyYW1lYnVmZmVyKSA9PiBvYmogPyAob2JqLmluaXRpYWxpemUoYXJnc1sxXSksIG9iaikgOiBhcmdzWzBdLmNyZWF0ZUZyYW1lYnVmZmVyKGFyZ3NbMV0pLFxyXG4gICAgKG9iajogR0ZYRnJhbWVidWZmZXIpID0+IG9iaiAmJiBvYmouZGVzdHJveSgpLFxyXG4pO1xyXG5cclxuZXhwb3J0IGNvbnN0IFN1Yk1vZGVsQXJyYXlQb29sID0gbmV3IEFycmF5UG9vbDxQb29sVHlwZS5TVUJfTU9ERUxfQVJSQVksIFBvb2xUeXBlLlNVQl9NT0RFTD4oUG9vbFR5cGUuU1VCX01PREVMX0FSUkFZLCAxMCk7XHJcbmV4cG9ydCBjb25zdCBNb2RlbEFycmF5UG9vbCA9IG5ldyBBcnJheVBvb2w8UG9vbFR5cGUuTU9ERUxfQVJSQVksIFBvb2xUeXBlLk1PREVMPihQb29sVHlwZS5NT0RFTF9BUlJBWSwgNTAsIDEwKTtcclxuXHJcbmV4cG9ydCBlbnVtIFBhc3NWaWV3IHtcclxuICAgIFBSSU9SSVRZLFxyXG4gICAgU1RBR0UsXHJcbiAgICBQSEFTRSxcclxuICAgIEJBVENISU5HX1NDSEVNRSxcclxuICAgIFBSSU1JVElWRSxcclxuICAgIERZTkFNSUNfU1RBVEVTLFxyXG4gICAgSEFTSCxcclxuICAgIFJBU1RFUklaRVJfU1RBVEUsICAgIC8vIGhhbmRsZVxyXG4gICAgREVQVEhfU1RFTkNJTF9TVEFURSwgLy8gaGFuZGxlXHJcbiAgICBCTEVORF9TVEFURSwgICAgICAgICAvLyBoYW5kbGVcclxuICAgIERFU0NSSVBUT1JfU0VULCAgICAgIC8vIGhhbmRsZVxyXG4gICAgUElQRUxJTkVfTEFZT1VULCAgICAgLy8gaGFuZGxlXHJcbiAgICBDT1VOVCxcclxufVxyXG5pbnRlcmZhY2UgSVBhc3NWaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgUGFzc1ZpZXc+IHtcclxuICAgIFtQYXNzVmlldy5QUklPUklUWV06IG51bWJlcjtcclxuICAgIFtQYXNzVmlldy5TVEFHRV06IFJlbmRlclBhc3NTdGFnZTtcclxuICAgIFtQYXNzVmlldy5QSEFTRV06IG51bWJlcjtcclxuICAgIFtQYXNzVmlldy5CQVRDSElOR19TQ0hFTUVdOiBCYXRjaGluZ1NjaGVtZXM7XHJcbiAgICBbUGFzc1ZpZXcuUFJJTUlUSVZFXTogR0ZYUHJpbWl0aXZlTW9kZTtcclxuICAgIFtQYXNzVmlldy5EWU5BTUlDX1NUQVRFU106IEdGWER5bmFtaWNTdGF0ZUZsYWdzO1xyXG4gICAgW1Bhc3NWaWV3LkhBU0hdOiBudW1iZXI7XHJcbiAgICBbUGFzc1ZpZXcuUkFTVEVSSVpFUl9TVEFURV06IFJhc3Rlcml6ZXJTdGF0ZUhhbmRsZTtcclxuICAgIFtQYXNzVmlldy5ERVBUSF9TVEVOQ0lMX1NUQVRFXTogRGVwdGhTdGVuY2lsU3RhdGVIYW5kbGU7XHJcbiAgICBbUGFzc1ZpZXcuQkxFTkRfU1RBVEVdOiBCbGVuZFN0YXRlSGFuZGxlO1xyXG4gICAgW1Bhc3NWaWV3LkRFU0NSSVBUT1JfU0VUXTogRGVzY3JpcHRvclNldEhhbmRsZTtcclxuICAgIFtQYXNzVmlldy5QSVBFTElORV9MQVlPVVRdOiBQaXBlbGluZUxheW91dEhhbmRsZTtcclxuICAgIFtQYXNzVmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IHBhc3NWaWV3RGF0YVR5cGUgOkJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIFBhc3NWaWV3PiA9IHtcclxuICAgIFtQYXNzVmlldy5QUklPUklUWV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtQYXNzVmlldy5TVEFHRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtQYXNzVmlldy5QSEFTRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtQYXNzVmlldy5CQVRDSElOR19TQ0hFTUVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbUGFzc1ZpZXcuUFJJTUlUSVZFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1Bhc3NWaWV3LkRZTkFNSUNfU1RBVEVTXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1Bhc3NWaWV3LkhBU0hdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbUGFzc1ZpZXcuUkFTVEVSSVpFUl9TVEFURV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtQYXNzVmlldy5ERVBUSF9TVEVOQ0lMX1NUQVRFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1Bhc3NWaWV3LkJMRU5EX1NUQVRFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1Bhc3NWaWV3LkRFU0NSSVBUT1JfU0VUXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1Bhc3NWaWV3LlBJUEVMSU5FX0xBWU9VVF06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtQYXNzVmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuLy8gVGhlb3JldGljYWxseSB3ZSBvbmx5IGhhdmUgdG8gZGVjbGFyZSB0aGUgdHlwZSB2aWV3IGhlcmUgd2hpbGUgYWxsIHRoZSBvdGhlciBhcmd1bWVudHMgY2FuIGJlIGluZmVycmVkLlxyXG4vLyBidXQgYmVmb3JlIHRoZSBvZmZpY2lhbCBzdXBwb3J0IG9mIFBhcnRpYWwgVHlwZSBBcmd1bWVudCBJbmZlcmVuY2UgcmVsZWFzZXMsIChtaWNyb3NvZnQvVHlwZVNjcmlwdCMyNjM0OSlcclxuLy8gd2UnbGwgaGF2ZSB0byBleHBsaWNpdGx5IGRlY2xhcmUgYWxsIHRoZXNlIHR5cGVzLlxyXG5leHBvcnQgY29uc3QgUGFzc1Bvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5QQVNTLCB0eXBlb2YgUGFzc1ZpZXcsIElQYXNzVmlld1R5cGU+KFBvb2xUeXBlLlBBU1MsIHBhc3NWaWV3RGF0YVR5cGUsIFBhc3NWaWV3KTtcclxuXHJcbmV4cG9ydCBlbnVtIFN1Yk1vZGVsVmlldyB7XHJcbiAgICBQUklPUklUWSxcclxuICAgIFBBU1NfQ09VTlQsXHJcbiAgICBQQVNTXzAsICAgICAgICAgIC8vIGhhbmRsZVxyXG4gICAgUEFTU18xLCAgICAgICAgICAvLyBoYW5kbGVcclxuICAgIFBBU1NfMiwgICAgICAgICAgLy8gaGFuZGxlXHJcbiAgICBQQVNTXzMsICAgICAgICAgIC8vIGhhbmRsZVxyXG4gICAgU0hBREVSXzAsICAgICAgICAvLyBoYW5kbGVcclxuICAgIFNIQURFUl8xLCAgICAgICAgLy8gaGFuZGxlXHJcbiAgICBTSEFERVJfMiwgICAgICAgIC8vIGhhbmRsZVxyXG4gICAgU0hBREVSXzMsICAgICAgICAvLyBoYW5kbGVcclxuICAgIERFU0NSSVBUT1JfU0VULCAgLy8gaGFuZGxlXHJcbiAgICBJTlBVVF9BU1NFTUJMRVIsIC8vIGhhbmRsZVxyXG4gICAgQ09VTlQsXHJcbn1cclxuaW50ZXJmYWNlIElTdWJNb2RlbFZpZXdUeXBlIGV4dGVuZHMgQnVmZmVyVHlwZU1hbmlmZXN0PHR5cGVvZiBTdWJNb2RlbFZpZXc+IHtcclxuICAgIFtTdWJNb2RlbFZpZXcuUFJJT1JJVFldOiBudW1iZXI7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfQ09VTlRdOiBudW1iZXI7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfMF06IFBhc3NIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfMV06IFBhc3NIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfMl06IFBhc3NIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfM106IFBhc3NIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlNIQURFUl8wXTogU2hhZGVySGFuZGxlO1xyXG4gICAgW1N1Yk1vZGVsVmlldy5TSEFERVJfMV06IFNoYWRlckhhbmRsZTtcclxuICAgIFtTdWJNb2RlbFZpZXcuU0hBREVSXzJdOiBTaGFkZXJIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LlNIQURFUl8zXTogU2hhZGVySGFuZGxlO1xyXG4gICAgW1N1Yk1vZGVsVmlldy5ERVNDUklQVE9SX1NFVF06IERlc2NyaXB0b3JTZXRIYW5kbGU7XHJcbiAgICBbU3ViTW9kZWxWaWV3LklOUFVUX0FTU0VNQkxFUl06IElucHV0QXNzZW1ibGVySGFuZGxlO1xyXG4gICAgW1N1Yk1vZGVsVmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IHN1Yk1vZGVsVmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBTdWJNb2RlbFZpZXc+ID0ge1xyXG4gICAgW1N1Yk1vZGVsVmlldy5QUklPUklUWV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuUEFTU19DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuUEFTU18wXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1N1Yk1vZGVsVmlldy5QQVNTXzFdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU3ViTW9kZWxWaWV3LlBBU1NfMl06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuUEFTU18zXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1N1Yk1vZGVsVmlldy5TSEFERVJfMF06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuU0hBREVSXzFdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU3ViTW9kZWxWaWV3LlNIQURFUl8yXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1N1Yk1vZGVsVmlldy5TSEFERVJfM106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuREVTQ1JJUFRPUl9TRVRdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU3ViTW9kZWxWaWV3LklOUFVUX0FTU0VNQkxFUl06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTdWJNb2RlbFZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUixcclxufVxyXG4vLyBUaGVvcmV0aWNhbGx5IHdlIG9ubHkgaGF2ZSB0byBkZWNsYXJlIHRoZSB0eXBlIHZpZXcgaGVyZSB3aGlsZSBhbGwgdGhlIG90aGVyIGFyZ3VtZW50cyBjYW4gYmUgaW5mZXJyZWQuXHJcbi8vIGJ1dCBiZWZvcmUgdGhlIG9mZmljaWFsIHN1cHBvcnQgb2YgUGFydGlhbCBUeXBlIEFyZ3VtZW50IEluZmVyZW5jZSByZWxlYXNlcywgKG1pY3Jvc29mdC9UeXBlU2NyaXB0IzI2MzQ5KVxyXG4vLyB3ZSdsbCBoYXZlIHRvIGV4cGxpY2l0bHkgZGVjbGFyZSBhbGwgdGhlc2UgdHlwZXMuXHJcbmV4cG9ydCBjb25zdCBTdWJNb2RlbFBvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5TVUJfTU9ERUwsIHR5cGVvZiBTdWJNb2RlbFZpZXcsIElTdWJNb2RlbFZpZXdUeXBlPlxyXG4gICAgKFBvb2xUeXBlLlNVQl9NT0RFTCwgc3ViTW9kZWxWaWV3RGF0YVR5cGUsIFN1Yk1vZGVsVmlldyk7XHJcblxyXG5leHBvcnQgZW51bSBNb2RlbFZpZXcge1xyXG4gICAgRU5BQkxFRCxcclxuICAgIFZJU19GTEFHUyxcclxuICAgIENBU1RfU0hBRE9XLFxyXG4gICAgV09STERfQk9VTkRTLCAgICAvLyBoYW5kbGVcclxuICAgIE5PREUsICAgICAgICAgICAgLy8gaGFuZGxlXHJcbiAgICBUUkFOU0ZPUk0sICAgICAgIC8vIGhhbmRsZVxyXG4gICAgU1VCX01PREVMX0FSUkFZLCAvLyBhcnJheSBoYW5kbGVcclxuICAgIENPVU5UXHJcbn1cclxuaW50ZXJmYWNlIElNb2RlbFZpZXdUeXBlIGV4dGVuZHMgQnVmZmVyVHlwZU1hbmlmZXN0PHR5cGVvZiBNb2RlbFZpZXc+IHtcclxuICAgIFtNb2RlbFZpZXcuRU5BQkxFRF06IG51bWJlcjtcclxuICAgIFtNb2RlbFZpZXcuVklTX0ZMQUdTXTogbnVtYmVyO1xyXG4gICAgW01vZGVsVmlldy5DQVNUX1NIQURPV106IG51bWJlcjtcclxuICAgIFtNb2RlbFZpZXcuV09STERfQk9VTkRTXTogQUFCQkhhbmRsZTtcclxuICAgIFtNb2RlbFZpZXcuTk9ERV06IE5vZGVIYW5kbGU7XHJcbiAgICBbTW9kZWxWaWV3LlRSQU5TRk9STV06IE5vZGVIYW5kbGU7XHJcbiAgICBbTW9kZWxWaWV3LlNVQl9NT0RFTF9BUlJBWV06IFN1Yk1vZGVsQXJyYXlIYW5kbGU7XHJcbiAgICBbTW9kZWxWaWV3LkNPVU5UXTogbmV2ZXI7XHJcbn1cclxuY29uc3QgbW9kZWxWaWV3RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIE1vZGVsVmlldz4gPSB7XHJcbiAgICBbTW9kZWxWaWV3LkVOQUJMRURdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbTW9kZWxWaWV3LlZJU19GTEFHU106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtNb2RlbFZpZXcuQ0FTVF9TSEFET1ddOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbTW9kZWxWaWV3LldPUkxEX0JPVU5EU106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtNb2RlbFZpZXcuTk9ERV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtNb2RlbFZpZXcuVFJBTlNGT1JNXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW01vZGVsVmlldy5TVUJfTU9ERUxfQVJSQVldOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbTW9kZWxWaWV3LkNPVU5UXTogQnVmZmVyRGF0YVR5cGUuTkVWRVJcclxufVxyXG4vLyBUaGVvcmV0aWNhbGx5IHdlIG9ubHkgaGF2ZSB0byBkZWNsYXJlIHRoZSB0eXBlIHZpZXcgaGVyZSB3aGlsZSBhbGwgdGhlIG90aGVyIGFyZ3VtZW50cyBjYW4gYmUgaW5mZXJyZWQuXHJcbi8vIGJ1dCBiZWZvcmUgdGhlIG9mZmljaWFsIHN1cHBvcnQgb2YgUGFydGlhbCBUeXBlIEFyZ3VtZW50IEluZmVyZW5jZSByZWxlYXNlcywgKG1pY3Jvc29mdC9UeXBlU2NyaXB0IzI2MzQ5KVxyXG4vLyB3ZSdsbCBoYXZlIHRvIGV4cGxpY2l0bHkgZGVjbGFyZSBhbGwgdGhlc2UgdHlwZXMuXHJcbmV4cG9ydCBjb25zdCBNb2RlbFBvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5NT0RFTCwgdHlwZW9mIE1vZGVsVmlldywgSU1vZGVsVmlld1R5cGU+KFBvb2xUeXBlLk1PREVMLCBtb2RlbFZpZXdEYXRhVHlwZSwgTW9kZWxWaWV3KTtcclxuXHJcbmV4cG9ydCBlbnVtIEFBQkJWaWV3IHtcclxuICAgIENFTlRFUiwgICAgICAgICAgICAgLy8gVmVjM1xyXG4gICAgSEFMRl9FWFRFTlNJT04gPSAzLCAvLyBWZWMzXHJcbiAgICBDT1VOVCA9IDZcclxufVxyXG5pbnRlcmZhY2UgSUFBQkJWaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgQUFCQlZpZXc+IHtcclxuICAgIFtBQUJCVmlldy5DRU5URVJdOiBWZWMzO1xyXG4gICAgW0FBQkJWaWV3LkhBTEZfRVhURU5TSU9OXTogVmVjMztcclxuICAgIFtBQUJCVmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IGFhYmJWaWV3RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIEFBQkJWaWV3PiA9IHtcclxuICAgIFtBQUJCVmlldy5DRU5URVJdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0FBQkJWaWV3LkhBTEZfRVhURU5TSU9OXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtBQUJCVmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuLy8gVGhlb3JldGljYWxseSB3ZSBvbmx5IGhhdmUgdG8gZGVjbGFyZSB0aGUgdHlwZSB2aWV3IGhlcmUgd2hpbGUgYWxsIHRoZSBvdGhlciBhcmd1bWVudHMgY2FuIGJlIGluZmVycmVkLlxyXG4vLyBidXQgYmVmb3JlIHRoZSBvZmZpY2lhbCBzdXBwb3J0IG9mIFBhcnRpYWwgVHlwZSBBcmd1bWVudCBJbmZlcmVuY2UgcmVsZWFzZXMsIChtaWNyb3NvZnQvVHlwZVNjcmlwdCMyNjM0OSlcclxuLy8gd2UnbGwgaGF2ZSB0byBleHBsaWNpdGx5IGRlY2xhcmUgYWxsIHRoZXNlIHR5cGVzLlxyXG5leHBvcnQgY29uc3QgQUFCQlBvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5BQUJCLCB0eXBlb2YgQUFCQlZpZXcsIElBQUJCVmlld1R5cGU+KFBvb2xUeXBlLkFBQkIsIGFhYmJWaWV3RGF0YVR5cGUsIEFBQkJWaWV3KTtcclxuXHJcbmV4cG9ydCBlbnVtIFNjZW5lVmlldyB7XHJcbiAgICBNQUlOX0xJR0hULCAgICAvLyBUT0RPXHJcbiAgICBNT0RFTF9BUlJBWSwgICAvLyBhcnJheSBoYW5kbGVcclxuICAgIENPVU5ULFxyXG59XHJcbmludGVyZmFjZSBJU2NlbmVWaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgU2NlbmVWaWV3PiB7XHJcbiAgICBbU2NlbmVWaWV3Lk1BSU5fTElHSFRdOiBMaWdodEhhbmRsZTtcclxuICAgIFtTY2VuZVZpZXcuTU9ERUxfQVJSQVldOiBNb2RlbEFycmF5SGFuZGxlO1xyXG4gICAgW1NjZW5lVmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IHNjZW5lVmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBTY2VuZVZpZXc+ID0ge1xyXG4gICAgW1NjZW5lVmlldy5NQUlOX0xJR0hUXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1NjZW5lVmlldy5NT0RFTF9BUlJBWV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTY2VuZVZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUlxyXG59XHJcbi8vIFRoZW9yZXRpY2FsbHkgd2Ugb25seSBoYXZlIHRvIGRlY2xhcmUgdGhlIHR5cGUgdmlldyBoZXJlIHdoaWxlIGFsbCB0aGUgb3RoZXIgYXJndW1lbnRzIGNhbiBiZSBpbmZlcnJlZC5cclxuLy8gYnV0IGJlZm9yZSB0aGUgb2ZmaWNpYWwgc3VwcG9ydCBvZiBQYXJ0aWFsIFR5cGUgQXJndW1lbnQgSW5mZXJlbmNlIHJlbGVhc2VzLCAobWljcm9zb2Z0L1R5cGVTY3JpcHQjMjYzNDkpXHJcbi8vIHdlJ2xsIGhhdmUgdG8gZXhwbGljaXRseSBkZWNsYXJlIGFsbCB0aGVzZSB0eXBlcy5cclxuZXhwb3J0IGNvbnN0IFNjZW5lUG9vbCA9IG5ldyBCdWZmZXJQb29sPFBvb2xUeXBlLlNDRU5FLCB0eXBlb2YgU2NlbmVWaWV3LCBJU2NlbmVWaWV3VHlwZT4oUG9vbFR5cGUuU0NFTkUsIHNjZW5lVmlld0RhdGFUeXBlLCBTY2VuZVZpZXcpO1xyXG5cclxuZXhwb3J0IGVudW0gQ2FtZXJhVmlldyB7XHJcbiAgICBXSURUSCxcclxuICAgIEhFSUdIVCxcclxuICAgIEVYUE9TVVJFLFxyXG4gICAgQ0xFQVJfRkxBRyxcclxuICAgIENMRUFSX0RFUFRILFxyXG4gICAgQ0xFQVJfU1RFTkNJTCxcclxuICAgIE5PREUsICAgICAgICAgICAgICAgICAgIC8vIGhhbmRsZVxyXG4gICAgU0NFTkUsICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlXHJcbiAgICBGUlVTVFVNLCAgICAgICAgICAgICAgICAvLyBoYW5kbGVcclxuICAgIEZPUldBUkQsICAgICAgICAgICAgICAgIC8vIFZlYzNcclxuICAgIFBPU0lUSU9OID0gMTIsICAgICAgICAgIC8vIFZlYzNcclxuICAgIFZJRVdfUE9SVCA9IDE1LCAgICAgICAgIC8vIFJlY3RcclxuICAgIENMRUFSX0NPTE9SID0gMTksICAgICAgIC8vIENvbG9yXHJcbiAgICBNQVRfVklFVyA9IDIzLCAgICAgICAgICAvLyBNYXQ0XHJcbiAgICBNQVRfVklFV19QUk9KID0gMzksICAgICAvLyBNYXQ0XHJcbiAgICBNQVRfVklFV19QUk9KX0lOViA9IDU1LCAvLyBNYXQ0XHJcbiAgICBNQVRfUFJPSiA9IDcxLCAgICAgICAgICAvLyBNYXQ0XHJcbiAgICBNQVRfUFJPSl9JTlYgPSA4NywgICAgICAvLyBNYXQ0XHJcbiAgICBDT1VOVCA9IDEwM1xyXG59XHJcbmludGVyZmFjZSBJQ2FtZXJhVmlld1R5cGUgZXh0ZW5kcyBCdWZmZXJUeXBlTWFuaWZlc3Q8dHlwZW9mIENhbWVyYVZpZXc+IHtcclxuICAgIFtDYW1lcmFWaWV3LldJRFRIXTogbnVtYmVyO1xyXG4gICAgW0NhbWVyYVZpZXcuSEVJR0hUXTogbnVtYmVyO1xyXG4gICAgW0NhbWVyYVZpZXcuRVhQT1NVUkVdOiBudW1iZXI7XHJcbiAgICBbQ2FtZXJhVmlldy5DTEVBUl9GTEFHXTogR0ZYQ2xlYXJGbGFnO1xyXG4gICAgW0NhbWVyYVZpZXcuQ0xFQVJfREVQVEhdOiBudW1iZXI7XHJcbiAgICBbQ2FtZXJhVmlldy5DTEVBUl9TVEVOQ0lMXTogbnVtYmVyO1xyXG4gICAgW0NhbWVyYVZpZXcuTk9ERV06IE5vZGVIYW5kbGU7XHJcbiAgICBbQ2FtZXJhVmlldy5TQ0VORV06IFNjZW5lSGFuZGxlO1xyXG4gICAgW0NhbWVyYVZpZXcuRlJVU1RVTV06IEZydXN0dW1IYW5kbGU7XHJcbiAgICBbQ2FtZXJhVmlldy5GT1JXQVJEXTogVmVjMztcclxuICAgIFtDYW1lcmFWaWV3LlBPU0lUSU9OXTogVmVjMztcclxuICAgIFtDYW1lcmFWaWV3LlZJRVdfUE9SVF06IFJlY3Q7XHJcbiAgICBbQ2FtZXJhVmlldy5DTEVBUl9DT0xPUl06IElWZWM0TGlrZTtcclxuICAgIFtDYW1lcmFWaWV3Lk1BVF9WSUVXXTogTWF0NDtcclxuICAgIFtDYW1lcmFWaWV3Lk1BVF9WSUVXX1BST0pdOiBNYXQ0O1xyXG4gICAgW0NhbWVyYVZpZXcuTUFUX1ZJRVdfUFJPSl9JTlZdOiBNYXQ0O1xyXG4gICAgW0NhbWVyYVZpZXcuTUFUX1BST0pdOiBNYXQ0O1xyXG4gICAgW0NhbWVyYVZpZXcuTUFUX1BST0pfSU5WXTogTWF0NDtcclxuICAgIFtDYW1lcmFWaWV3LkNPVU5UXTogbmV2ZXI7XHJcbn1cclxuY29uc3QgY2FtZXJhVmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBDYW1lcmFWaWV3PiA9IHtcclxuICAgIFtDYW1lcmFWaWV3LldJRFRIXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW0NhbWVyYVZpZXcuSEVJR0hUXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW0NhbWVyYVZpZXcuRVhQT1NVUkVdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0NhbWVyYVZpZXcuQ0xFQVJfRkxBR106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtDYW1lcmFWaWV3LkNMRUFSX0RFUFRIXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtDYW1lcmFWaWV3LkNMRUFSX1NURU5DSUxdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5OT0RFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW0NhbWVyYVZpZXcuU0NFTkVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5GUlVTVFVNXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW0NhbWVyYVZpZXcuRk9SV0FSRF06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5QT1NJVElPTl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5WSUVXX1BPUlRdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5DTEVBUl9DT0xPUl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5NQVRfVklFV106IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5NQVRfVklFV19QUk9KXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtDYW1lcmFWaWV3Lk1BVF9WSUVXX1BST0pfSU5WXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtDYW1lcmFWaWV3Lk1BVF9QUk9KXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtDYW1lcmFWaWV3Lk1BVF9QUk9KX0lOVl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQ2FtZXJhVmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuLy8gVGhlb3JldGljYWxseSB3ZSBvbmx5IGhhdmUgdG8gZGVjbGFyZSB0aGUgdHlwZSB2aWV3IGhlcmUgd2hpbGUgYWxsIHRoZSBvdGhlciBhcmd1bWVudHMgY2FuIGJlIGluZmVycmVkLlxyXG4vLyBidXQgYmVmb3JlIHRoZSBvZmZpY2lhbCBzdXBwb3J0IG9mIFBhcnRpYWwgVHlwZSBBcmd1bWVudCBJbmZlcmVuY2UgcmVsZWFzZXMsIChtaWNyb3NvZnQvVHlwZVNjcmlwdCMyNjM0OSlcclxuLy8gd2UnbGwgaGF2ZSB0byBleHBsaWNpdGx5IGRlY2xhcmUgYWxsIHRoZXNlIHR5cGVzLlxyXG5leHBvcnQgY29uc3QgQ2FtZXJhUG9vbCA9IG5ldyBCdWZmZXJQb29sPFBvb2xUeXBlLkNBTUVSQSwgdHlwZW9mIENhbWVyYVZpZXcsIElDYW1lcmFWaWV3VHlwZT4oUG9vbFR5cGUuQ0FNRVJBLCBjYW1lcmFWaWV3RGF0YVR5cGUsIENhbWVyYVZpZXcpO1xyXG5cclxuZXhwb3J0IGVudW0gTm9kZVZpZXcge1xyXG4gICAgTEFZRVIsXHJcbiAgICBXT1JMRF9TQ0FMRSwgICAgICAgIC8vIFZlYzNcclxuICAgIFdPUkxEX1BPU0lUSU9OID0gNCwgLy8gVmVjM1xyXG4gICAgV09STERfUk9UQVRJT04gPSA3LCAvLyBRdWF0XHJcbiAgICBXT1JMRF9NQVRSSVggPSAxMSwgIC8vIE1hdDRcclxuICAgIENPVU5UID0gMjdcclxufVxyXG5pbnRlcmZhY2UgSU5vZGVWaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgTm9kZVZpZXc+IHtcclxuICAgIFtOb2RlVmlldy5MQVlFUl06IExheWVycy5FbnVtO1xyXG4gICAgW05vZGVWaWV3LldPUkxEX1NDQUxFXTogVmVjMztcclxuICAgIFtOb2RlVmlldy5XT1JMRF9QT1NJVElPTl06IFZlYzM7XHJcbiAgICBbTm9kZVZpZXcuV09STERfUk9UQVRJT05dOiBRdWF0O1xyXG4gICAgW05vZGVWaWV3LldPUkxEX01BVFJJWF06IE1hdDQ7XHJcbiAgICBbTm9kZVZpZXcuQ09VTlRdOiBuZXZlcjtcclxufVxyXG5jb25zdCBub2RlVmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBOb2RlVmlldz4gPSB7XHJcbiAgICBbTm9kZVZpZXcuTEFZRVJdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbTm9kZVZpZXcuV09STERfU0NBTEVdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW05vZGVWaWV3LldPUkxEX1BPU0lUSU9OXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtOb2RlVmlldy5XT1JMRF9ST1RBVElPTl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbTm9kZVZpZXcuV09STERfTUFUUklYXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtOb2RlVmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuLy8gQHRzLWlnbm9yZSBEb24ndCBhbGxvYyBtZW1vcnkgZm9yIFZlYzMsIFF1YXQsIE1hdDQgb24gd2ViLCBhcyB0aGV5IGFyZSBhY2Nlc3NlZCBieSBjbGFzcyBtZW1iZXIgdmFyaWFibGUuXHJcbmlmICghSlNCKSB7IGRlbGV0ZSBOb2RlVmlld1tOb2RlVmlldy5DT1VOVF07IE5vZGVWaWV3W05vZGVWaWV3LkNPVU5UID0gTm9kZVZpZXcuTEFZRVIgKyAxXSA9ICdDT1VOVCc7IH1cclxuLy8gVGhlb3JldGljYWxseSB3ZSBvbmx5IGhhdmUgdG8gZGVjbGFyZSB0aGUgdHlwZSB2aWV3IGhlcmUgd2hpbGUgYWxsIHRoZSBvdGhlciBhcmd1bWVudHMgY2FuIGJlIGluZmVycmVkLlxyXG4vLyBidXQgYmVmb3JlIHRoZSBvZmZpY2lhbCBzdXBwb3J0IG9mIFBhcnRpYWwgVHlwZSBBcmd1bWVudCBJbmZlcmVuY2UgcmVsZWFzZXMsIChtaWNyb3NvZnQvVHlwZVNjcmlwdCMyNjM0OSlcclxuLy8gd2UnbGwgaGF2ZSB0byBleHBsaWNpdGx5IGRlY2xhcmUgYWxsIHRoZXNlIHR5cGVzLlxyXG5leHBvcnQgY29uc3QgTm9kZVBvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5OT0RFLCB0eXBlb2YgTm9kZVZpZXcsIElOb2RlVmlld1R5cGU+KFBvb2xUeXBlLk5PREUsIG5vZGVWaWV3RGF0YVR5cGUsIE5vZGVWaWV3KTtcclxuXHJcbmV4cG9ydCBlbnVtIFJvb3RWaWV3IHtcclxuICAgIENVTVVMQVRJVkVfVElNRSxcclxuICAgIEZSQU1FX1RJTUUsXHJcbiAgICBDT1VOVFxyXG59XHJcbmludGVyZmFjZSBJUm9vdFZpZXdUeXBlIGV4dGVuZHMgQnVmZmVyVHlwZU1hbmlmZXN0PHR5cGVvZiBSb290Vmlldz4ge1xyXG4gICAgW1Jvb3RWaWV3LkNVTVVMQVRJVkVfVElNRV06IG51bWJlcjtcclxuICAgIFtSb290Vmlldy5GUkFNRV9USU1FXTogbnVtYmVyO1xyXG4gICAgW1Jvb3RWaWV3LkNPVU5UXTogbmV2ZXI7XHJcbn1cclxuY29uc3Qgcm9vdFZpZXdEYXRhVHlwZTogQnVmZmVyRGF0YVR5cGVNYW5pZmVzdDx0eXBlb2YgUm9vdFZpZXc+ID0ge1xyXG4gICAgW1Jvb3RWaWV3LkNVTVVMQVRJVkVfVElNRV06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbUm9vdFZpZXcuRlJBTUVfVElNRV06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbUm9vdFZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUlxyXG59XHJcbi8vIFRoZW9yZXRpY2FsbHkgd2Ugb25seSBoYXZlIHRvIGRlY2xhcmUgdGhlIHR5cGUgdmlldyBoZXJlIHdoaWxlIGFsbCB0aGUgb3RoZXIgYXJndW1lbnRzIGNhbiBiZSBpbmZlcnJlZC5cclxuLy8gYnV0IGJlZm9yZSB0aGUgb2ZmaWNpYWwgc3VwcG9ydCBvZiBQYXJ0aWFsIFR5cGUgQXJndW1lbnQgSW5mZXJlbmNlIHJlbGVhc2VzLCAobWljcm9zb2Z0L1R5cGVTY3JpcHQjMjYzNDkpXHJcbi8vIHdlJ2xsIGhhdmUgdG8gZXhwbGljaXRseSBkZWNsYXJlIGFsbCB0aGVzZSB0eXBlcy5cclxuZXhwb3J0IGNvbnN0IFJvb3RQb29sID0gbmV3IEJ1ZmZlclBvb2w8UG9vbFR5cGUuUk9PVCwgdHlwZW9mIFJvb3RWaWV3LCBJUm9vdFZpZXdUeXBlPihQb29sVHlwZS5ST09ULCByb290Vmlld0RhdGFUeXBlLCBSb290VmlldywgMSk7XHJcblxyXG5leHBvcnQgZW51bSBSZW5kZXJXaW5kb3dWaWV3IHtcclxuICAgIEhBU19PTl9TQ1JFRU5fQVRUQUNITUVOVFMsXHJcbiAgICBIQVNfT0ZGX1NDUkVFTl9BVFRBQ0hNRU5UUyxcclxuICAgIEZSQU1FQlVGRkVSLCAgLy8gaGFuZGxlXHJcbiAgICBDT1VOVFxyXG59XHJcbmludGVyZmFjZSBJUmVuZGVyV2luZG93Vmlld1R5cGUgZXh0ZW5kcyBCdWZmZXJUeXBlTWFuaWZlc3Q8dHlwZW9mIFJlbmRlcldpbmRvd1ZpZXc+IHtcclxuICAgIFtSZW5kZXJXaW5kb3dWaWV3LkhBU19PTl9TQ1JFRU5fQVRUQUNITUVOVFNdOiBudW1iZXI7XHJcbiAgICBbUmVuZGVyV2luZG93Vmlldy5IQVNfT0ZGX1NDUkVFTl9BVFRBQ0hNRU5UU106IG51bWJlcjtcclxuICAgIFtSZW5kZXJXaW5kb3dWaWV3LkZSQU1FQlVGRkVSXTogRnJhbWVidWZmZXJIYW5kbGU7XHJcbiAgICBbUmVuZGVyV2luZG93Vmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IHJlbmRlcldpbmRvd0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBSZW5kZXJXaW5kb3dWaWV3PiA9IHtcclxuICAgIFtSZW5kZXJXaW5kb3dWaWV3LkhBU19PTl9TQ1JFRU5fQVRUQUNITUVOVFNdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbUmVuZGVyV2luZG93Vmlldy5IQVNfT0ZGX1NDUkVFTl9BVFRBQ0hNRU5UU106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtSZW5kZXJXaW5kb3dWaWV3LkZSQU1FQlVGRkVSXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1JlbmRlcldpbmRvd1ZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUlxyXG59XHJcbi8vIFRoZW9yZXRpY2FsbHkgd2Ugb25seSBoYXZlIHRvIGRlY2xhcmUgdGhlIHR5cGUgdmlldyBoZXJlIHdoaWxlIGFsbCB0aGUgb3RoZXIgYXJndW1lbnRzIGNhbiBiZSBpbmZlcnJlZC5cclxuLy8gYnV0IGJlZm9yZSB0aGUgb2ZmaWNpYWwgc3VwcG9ydCBvZiBQYXJ0aWFsIFR5cGUgQXJndW1lbnQgSW5mZXJlbmNlIHJlbGVhc2VzLCAobWljcm9zb2Z0L1R5cGVTY3JpcHQjMjYzNDkpXHJcbi8vIHdlJ2xsIGhhdmUgdG8gZXhwbGljaXRseSBkZWNsYXJlIGFsbCB0aGVzZSB0eXBlcy5cclxuZXhwb3J0IGNvbnN0IFJlbmRlcldpbmRvd1Bvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5SRU5ERVJfV0lORE9XLCB0eXBlb2YgUmVuZGVyV2luZG93VmlldywgSVJlbmRlcldpbmRvd1ZpZXdUeXBlPlxyXG4gICAgKFBvb2xUeXBlLlJFTkRFUl9XSU5ET1csIHJlbmRlcldpbmRvd0RhdGFUeXBlLCBSZW5kZXJXaW5kb3dWaWV3LCAyKTtcclxuXHJcbmV4cG9ydCBlbnVtIEZydXN0dW1WaWV3IHtcclxuICAgIFZFUlRJQ0VTLCAgICAvLyBWZWMzWzhdXHJcbiAgICBQTEFORVMgPSAyNCwgLy8gcGxhbmVbNl1cclxuICAgIENPVU5UID0gNDhcclxufVxyXG5pbnRlcmZhY2UgSUZydXN0dW1WaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgRnJ1c3R1bVZpZXc+IHtcclxuICAgIFtGcnVzdHVtVmlldy5WRVJUSUNFU106IFZlYzM7XHJcbiAgICBbRnJ1c3R1bVZpZXcuUExBTkVTXTogcGxhbmU7XHJcbiAgICBbRnJ1c3R1bVZpZXcuQ09VTlRdOiBuZXZlcjtcclxufVxyXG5jb25zdCBmcnVzdHVtVmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBGcnVzdHVtVmlldz4gPSB7XHJcbiAgICBbRnJ1c3R1bVZpZXcuVkVSVElDRVNdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0ZydXN0dW1WaWV3LlBMQU5FU106IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbRnJ1c3R1bVZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUixcclxufVxyXG4vLyBUaGVvcmV0aWNhbGx5IHdlIG9ubHkgaGF2ZSB0byBkZWNsYXJlIHRoZSB0eXBlIHZpZXcgaGVyZSB3aGlsZSBhbGwgdGhlIG90aGVyIGFyZ3VtZW50cyBjYW4gYmUgaW5mZXJyZWQuXHJcbi8vIGJ1dCBiZWZvcmUgdGhlIG9mZmljaWFsIHN1cHBvcnQgb2YgUGFydGlhbCBUeXBlIEFyZ3VtZW50IEluZmVyZW5jZSByZWxlYXNlcywgKG1pY3Jvc29mdC9UeXBlU2NyaXB0IzI2MzQ5KVxyXG4vLyB3ZSdsbCBoYXZlIHRvIGV4cGxpY2l0bHkgZGVjbGFyZSBhbGwgdGhlc2UgdHlwZXMuXHJcbmV4cG9ydCBjb25zdCBGcnVzdHVtUG9vbCA9IG5ldyBCdWZmZXJQb29sPFBvb2xUeXBlLkZSVVNUVU0sIHR5cGVvZiBGcnVzdHVtVmlldywgSUZydXN0dW1WaWV3VHlwZT4oUG9vbFR5cGUuRlJVU1RVTSwgZnJ1c3R1bVZpZXdEYXRhVHlwZSwgRnJ1c3R1bVZpZXcpO1xyXG5cclxuZXhwb3J0IGVudW0gQW1iaWVudFZpZXcge1xyXG4gICAgRU5BQkxFLFxyXG4gICAgSUxMVU0sXHJcbiAgICBTS1lfQ09MT1IsIC8vIHZlYzRcclxuICAgIEdST1VORF9BTEJFRE8gPSA2LCAvLyB2ZWM0XHJcbiAgICBDT1VOVCA9IDEwXHJcbn1cclxuaW50ZXJmYWNlIElBbWJpZW50Vmlld1R5cGUgZXh0ZW5kcyBCdWZmZXJUeXBlTWFuaWZlc3Q8dHlwZW9mIEFtYmllbnRWaWV3PiB7XHJcbiAgICBbQW1iaWVudFZpZXcuRU5BQkxFXTogbnVtYmVyO1xyXG4gICAgW0FtYmllbnRWaWV3LklMTFVNXTogbnVtYmVyO1xyXG4gICAgW0FtYmllbnRWaWV3LlNLWV9DT0xPUl06IENvbG9yO1xyXG4gICAgW0FtYmllbnRWaWV3LkdST1VORF9BTEJFRE9dOiBDb2xvcjtcclxuICAgIFtBbWJpZW50Vmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IGFtYmllbnRWaWV3RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIEFtYmllbnRWaWV3PiA9IHtcclxuICAgIFtBbWJpZW50Vmlldy5FTkFCTEVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbQW1iaWVudFZpZXcuSUxMVU1dOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0FtYmllbnRWaWV3LlNLWV9DT0xPUl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQW1iaWVudFZpZXcuR1JPVU5EX0FMQkVET106IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbQW1iaWVudFZpZXcuQ09VTlRdOiBCdWZmZXJEYXRhVHlwZS5ORVZFUlxyXG59XHJcbi8vIEB0cy1pZ25vcmUgRG9uJ3QgYWxsb2MgbWVtb3J5IGZvciBWZWMzLCBRdWF0LCBNYXQ0IG9uIHdlYiwgYXMgdGhleSBhcmUgYWNjZXNzZWQgYnkgY2xhc3MgbWVtYmVyIHZhcmlhYmxlLlxyXG5pZiAoIUpTQikge2RlbGV0ZSBBbWJpZW50Vmlld1tBbWJpZW50Vmlldy5DT1VOVF07IEFtYmllbnRWaWV3W0FtYmllbnRWaWV3LkNPVU5UID0gQW1iaWVudFZpZXcuSUxMVU0gKyAxXSA9ICdDT1VOVCc7IH1cclxuZXhwb3J0IGNvbnN0IEFtYmllbnRQb29sID0gbmV3IEJ1ZmZlclBvb2w8UG9vbFR5cGUuQU1CSUVOVCwgdHlwZW9mIEFtYmllbnRWaWV3LCBJQW1iaWVudFZpZXdUeXBlPihQb29sVHlwZS5BTUJJRU5ULCBhbWJpZW50Vmlld0RhdGFUeXBlLCBBbWJpZW50VmlldywgMSk7XHJcblxyXG5leHBvcnQgZW51bSBTa3lib3hWaWV3IHtcclxuICAgIEVOQUJMRSxcclxuICAgIElTX1JHQkUsXHJcbiAgICBVU0VfSUJMLFxyXG4gICAgTU9ERUwsXHJcbiAgICBDT1VOVFxyXG59XHJcbmludGVyZmFjZSBJU2t5Ym94Vmlld1R5cGUgZXh0ZW5kcyBCdWZmZXJUeXBlTWFuaWZlc3Q8dHlwZW9mIFNreWJveFZpZXc+IHtcclxuICAgIFtTa3lib3hWaWV3LkVOQUJMRV06IG51bWJlcjtcclxuICAgIFtTa3lib3hWaWV3LklTX1JHQkVdOiBudW1iZXI7XHJcbiAgICBbU2t5Ym94Vmlldy5VU0VfSUJMXTogbnVtYmVyO1xyXG4gICAgW1NreWJveFZpZXcuTU9ERUxdOiBNb2RlbEhhbmRsZTtcclxuICAgIFtTa3lib3hWaWV3LkNPVU5UXTogbmV2ZXI7XHJcbn1cclxuY29uc3Qgc2t5Ym94RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIFNreWJveFZpZXc+ID0ge1xyXG4gICAgW1NreWJveFZpZXcuRU5BQkxFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW1NreWJveFZpZXcuSVNfUkdCRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTa3lib3hWaWV3LlVTRV9JQkxdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU2t5Ym94Vmlldy5NT0RFTF06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTa3lib3hWaWV3LkNPVU5UXTogQnVmZmVyRGF0YVR5cGUuTkVWRVJcclxufVxyXG5leHBvcnQgY29uc3QgU2t5Ym94UG9vbCA9IG5ldyBCdWZmZXJQb29sPFBvb2xUeXBlLlNLWUJPWCwgdHlwZW9mIFNreWJveFZpZXcsIElTa3lib3hWaWV3VHlwZT4oUG9vbFR5cGUuU0tZQk9YLCBza3lib3hEYXRhVHlwZSwgU2t5Ym94VmlldywgMSk7XHJcblxyXG5leHBvcnQgZW51bSBGb2dWaWV3IHtcclxuICAgIEVOQUJMRSxcclxuICAgIFRZUEUsXHJcbiAgICBERU5TSVRZLFxyXG4gICAgU1RBUlQsXHJcbiAgICBFTkQsXHJcbiAgICBBVFRFTixcclxuICAgIFRPUCxcclxuICAgIFJBTkdFLFxyXG4gICAgQ09MT1IsXHJcbiAgICBDT1VOVCA9IDEyXHJcbn1cclxuaW50ZXJmYWNlIElGb2dWaWV3VHlwZSBleHRlbmRzIEJ1ZmZlclR5cGVNYW5pZmVzdDx0eXBlb2YgRm9nVmlldz4ge1xyXG4gICAgW0ZvZ1ZpZXcuRU5BQkxFXTogbnVtYmVyO1xyXG4gICAgW0ZvZ1ZpZXcuVFlQRV06IG51bWJlcjtcclxuICAgIFtGb2dWaWV3LkRFTlNJVFldOiBudW1iZXI7XHJcbiAgICBbRm9nVmlldy5TVEFSVF06IG51bWJlcjtcclxuICAgIFtGb2dWaWV3LkVORF06IG51bWJlcjtcclxuICAgIFtGb2dWaWV3LkFUVEVOXTogbnVtYmVyO1xyXG4gICAgW0ZvZ1ZpZXcuVE9QXTogbnVtYmVyO1xyXG4gICAgW0ZvZ1ZpZXcuUkFOR0VdOiBudW1iZXI7XHJcbiAgICBbRm9nVmlldy5DT0xPUl06IENvbG9yO1xyXG4gICAgW0ZvZ1ZpZXcuQ09VTlRdOiBuZXZlcjtcclxufVxyXG5jb25zdCBmb2dWaWV3RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIEZvZ1ZpZXc+ID0ge1xyXG4gICAgW0ZvZ1ZpZXcuRU5BQkxFXTogQnVmZmVyRGF0YVR5cGUuVUlOVDMyLFxyXG4gICAgW0ZvZ1ZpZXcuVFlQRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtGb2dWaWV3LkRFTlNJVFldOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0ZvZ1ZpZXcuU1RBUlRdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0ZvZ1ZpZXcuRU5EXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtGb2dWaWV3LkFUVEVOXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtGb2dWaWV3LlRPUF06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbRm9nVmlldy5SQU5HRV06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbRm9nVmlldy5DT0xPUl06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbRm9nVmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuLy8gQHRzLWlnbm9yZSBEb24ndCBhbGxvYyBtZW1vcnkgZm9yIFZlYzMsIFF1YXQsIE1hdDQgb24gd2ViLCBhcyB0aGV5IGFyZSBhY2Nlc3NlZCBieSBjbGFzcyBtZW1iZXIgdmFyaWFibGUuXHJcbmlmICghSlNCKSB7ZGVsZXRlIEZvZ1ZpZXdbRm9nVmlldy5DT1VOVF07IEZvZ1ZpZXdbRm9nVmlldy5DT1VOVCA9IEZvZ1ZpZXcuUkFOR0UgKyAxXSA9ICdDT1VOVCc7IH1cclxuZXhwb3J0IGNvbnN0IEZvZ1Bvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5GT0csIHR5cGVvZiBGb2dWaWV3LCBJRm9nVmlld1R5cGU+KFBvb2xUeXBlLkZPRywgZm9nVmlld0RhdGFUeXBlLCBGb2dWaWV3KTtcclxuXHJcbmV4cG9ydCBlbnVtIFNoYWRvd3NWaWV3IHtcclxuICAgIEVOQUJMRSxcclxuICAgIERJUlRZLFxyXG4gICAgVFlQRSxcclxuICAgIERJU1RBTkNFLFxyXG4gICAgSU5TVEFOQ0VfUEFTUyxcclxuICAgIFBMQU5BUl9QQVNTLFxyXG4gICAgTkVBUixcclxuICAgIEZBUixcclxuICAgIEFTUEVDVCxcclxuICAgIFBDRl9UWVBFLFxyXG4gICAgT1JUSE9fU0laRSxcclxuICAgIFNJWkUsIC8vIFZlYzJcclxuICAgIE5PUk1BTCA9IDEzLCAvLyBWZWMzXHJcbiAgICBDT0xPUiA9IDE2LCAvLyBWZWM0XHJcbiAgICBTUEhFUkUgPSAyMCwgLy8gVmVjNFxyXG4gICAgQ09VTlQgPSAyNFxyXG59XHJcbmludGVyZmFjZSBJU2hhZG93c1ZpZXdUeXBlIGV4dGVuZHMgQnVmZmVyVHlwZU1hbmlmZXN0PHR5cGVvZiBTaGFkb3dzVmlldz4ge1xyXG4gICAgW1NoYWRvd3NWaWV3LkVOQUJMRV06IG51bWJlcjtcclxuICAgIFtTaGFkb3dzVmlldy5UWVBFXTogbnVtYmVyO1xyXG4gICAgW1NoYWRvd3NWaWV3LkRJU1RBTkNFXTogbnVtYmVyO1xyXG4gICAgW1NoYWRvd3NWaWV3LklOU1RBTkNFX1BBU1NdOiBQYXNzSGFuZGxlO1xyXG4gICAgW1NoYWRvd3NWaWV3LlBMQU5BUl9QQVNTXTogUGFzc0hhbmRsZTtcclxuICAgIFtTaGFkb3dzVmlldy5ORUFSXTogbnVtYmVyO1xyXG4gICAgW1NoYWRvd3NWaWV3LkZBUl06IG51bWJlcjtcclxuICAgIFtTaGFkb3dzVmlldy5BU1BFQ1RdOiBudW1iZXI7XHJcbiAgICBbU2hhZG93c1ZpZXcuUENGX1RZUEVdOiBudW1iZXI7XHJcbiAgICBbU2hhZG93c1ZpZXcuRElSVFldOiBudW1iZXI7XHJcbiAgICBbU2hhZG93c1ZpZXcuT1JUSE9fU0laRV06IG51bWJlcjtcclxuICAgIFtTaGFkb3dzVmlldy5TSVpFXTogVmVjMjtcclxuICAgIFtTaGFkb3dzVmlldy5OT1JNQUxdOiBWZWMzO1xyXG4gICAgW1NoYWRvd3NWaWV3LkNPTE9SXTogQ29sb3I7XHJcbiAgICBbU2hhZG93c1ZpZXcuU1BIRVJFXTogVmVjNDtcclxuICAgIFtTaGFkb3dzVmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IHNoYWRvd3NWaWV3RGF0YVR5cGU6IEJ1ZmZlckRhdGFUeXBlTWFuaWZlc3Q8dHlwZW9mIFNoYWRvd3NWaWV3PiA9IHtcclxuICAgIFtTaGFkb3dzVmlldy5FTkFCTEVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU2hhZG93c1ZpZXcuVFlQRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTaGFkb3dzVmlldy5ESVNUQU5DRV06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbU2hhZG93c1ZpZXcuSU5TVEFOQ0VfUEFTU106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTaGFkb3dzVmlldy5QTEFOQVJfUEFTU106IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTaGFkb3dzVmlldy5ORUFSXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtTaGFkb3dzVmlldy5GQVJdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW1NoYWRvd3NWaWV3LkFTUEVDVF06IEJ1ZmZlckRhdGFUeXBlLkZMT0FUMzIsXHJcbiAgICBbU2hhZG93c1ZpZXcuUENGX1RZUEVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU2hhZG93c1ZpZXcuRElSVFldOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbU2hhZG93c1ZpZXcuT1JUSE9fU0laRV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtTaGFkb3dzVmlldy5TSVpFXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtTaGFkb3dzVmlldy5OT1JNQUxdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW1NoYWRvd3NWaWV3LkNPTE9SXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtTaGFkb3dzVmlldy5TUEhFUkVdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW1NoYWRvd3NWaWV3LkNPVU5UXTogQnVmZmVyRGF0YVR5cGUuTkVWRVJcclxufVxyXG4vLyBAdHMtaWdub3JlIERvbid0IGFsbG9jIG1lbW9yeSBmb3IgVmVjMywgUXVhdCwgTWF0NCBvbiB3ZWIsIGFzIHRoZXkgYXJlIGFjY2Vzc2VkIGJ5IGNsYXNzIG1lbWJlciB2YXJpYWJsZS5cclxuaWYgKCFKU0IpIHtkZWxldGUgU2hhZG93c1ZpZXdbRm9nVmlldy5DT1VOVF07IFNoYWRvd3NWaWV3W1NoYWRvd3NWaWV3LkNPVU5UID0gU2hhZG93c1ZpZXcuT1JUSE9fU0laRSArIDFdID0gJ0NPVU5UJzsgfVxyXG5leHBvcnQgY29uc3QgU2hhZG93c1Bvb2wgPSBuZXcgQnVmZmVyUG9vbDxQb29sVHlwZS5TSEFET1csIHR5cGVvZiBTaGFkb3dzVmlldywgSVNoYWRvd3NWaWV3VHlwZT4oUG9vbFR5cGUuU0hBRE9XLCBzaGFkb3dzVmlld0RhdGFUeXBlLCBTaGFkb3dzVmlldywgMSk7XHJcblxyXG5leHBvcnQgZW51bSBMaWdodFZpZXcge1xyXG4gICAgVVNFX0NPTE9SX1RFTVBFUkFUVVJFLFxyXG4gICAgSUxMVU1JTkFOQ0UsXHJcbiAgICBOT0RFLCAgICAgICAgICAgICAgICAgICAgICAgLy8gaGFuZGxlXHJcbiAgICBESVJFQ1RJT04sICAgICAgICAgICAgICAgICAgLy8gVmVjM1xyXG4gICAgQ09MT1IgPSA2LCAgICAgICAgICAgICAgICAgIC8vIFZlYzNcclxuICAgIENPTE9SX1RFTVBFUkFUVVJFX1JHQiA9IDksICAvLyBWZWMzXHJcbiAgICBDT1VOVCA9IDEyXHJcbn1cclxuaW50ZXJmYWNlIElMaWdodFZpZXdUeXBlIGV4dGVuZHMgQnVmZmVyVHlwZU1hbmlmZXN0PHR5cGVvZiBMaWdodFZpZXc+IHtcclxuICAgIFtMaWdodFZpZXcuVVNFX0NPTE9SX1RFTVBFUkFUVVJFXTogbnVtYmVyO1xyXG4gICAgW0xpZ2h0Vmlldy5JTExVTUlOQU5DRV06IG51bWJlcjtcclxuICAgIFtMaWdodFZpZXcuTk9ERV06Tm9kZUhhbmRsZTtcclxuICAgIFtMaWdodFZpZXcuRElSRUNUSU9OXTogVmVjMztcclxuICAgIFtMaWdodFZpZXcuQ09MT1JdOiBWZWMzO1xyXG4gICAgW0xpZ2h0Vmlldy5DT0xPUl9URU1QRVJBVFVSRV9SR0JdOiBWZWMzO1xyXG4gICAgW0xpZ2h0Vmlldy5DT1VOVF06IG5ldmVyO1xyXG59XHJcbmNvbnN0IGxpZ2h0Vmlld0RhdGFUeXBlOiBCdWZmZXJEYXRhVHlwZU1hbmlmZXN0PHR5cGVvZiBMaWdodFZpZXc+ID0ge1xyXG4gICAgW0xpZ2h0Vmlldy5VU0VfQ09MT1JfVEVNUEVSQVRVUkVdOiBCdWZmZXJEYXRhVHlwZS5VSU5UMzIsXHJcbiAgICBbTGlnaHRWaWV3LklMTFVNSU5BTkNFXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtMaWdodFZpZXcuTk9ERV06IEJ1ZmZlckRhdGFUeXBlLlVJTlQzMixcclxuICAgIFtMaWdodFZpZXcuRElSRUNUSU9OXTogQnVmZmVyRGF0YVR5cGUuRkxPQVQzMixcclxuICAgIFtMaWdodFZpZXcuQ09MT1JdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0xpZ2h0Vmlldy5DT0xPUl9URU1QRVJBVFVSRV9SR0JdOiBCdWZmZXJEYXRhVHlwZS5GTE9BVDMyLFxyXG4gICAgW0xpZ2h0Vmlldy5DT1VOVF06IEJ1ZmZlckRhdGFUeXBlLk5FVkVSXHJcbn1cclxuZXhwb3J0IGNvbnN0IExpZ2h0UG9vbCA9IG5ldyBCdWZmZXJQb29sPFBvb2xUeXBlLkxJR0hULCB0eXBlb2YgTGlnaHRWaWV3LCBJTGlnaHRWaWV3VHlwZT4oUG9vbFR5cGUuTElHSFQsIGxpZ2h0Vmlld0RhdGFUeXBlLCBMaWdodFZpZXcsIDMpO1xyXG4iXX0=