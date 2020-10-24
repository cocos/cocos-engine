(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../default-constants.js", "../../platform/index.js", "../../platform/sys.js", "../command-buffer.js", "../device.js", "../queue.js", "../texture.js", "./webgl-descriptor-set.js", "./webgl-buffer.js", "./webgl-command-allocator.js", "./webgl-command-buffer.js", "./webgl-fence.js", "./webgl-framebuffer.js", "./webgl-input-assembler.js", "./webgl-descriptor-set-layout.js", "./webgl-pipeline-layout.js", "./webgl-pipeline-state.js", "./webgl-primary-command-buffer.js", "./webgl-queue.js", "./webgl-render-pass.js", "./webgl-sampler.js", "./webgl-shader.js", "./webgl-state-cache.js", "./webgl-texture.js", "../define.js", "./webgl-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../default-constants.js"), require("../../platform/index.js"), require("../../platform/sys.js"), require("../command-buffer.js"), require("../device.js"), require("../queue.js"), require("../texture.js"), require("./webgl-descriptor-set.js"), require("./webgl-buffer.js"), require("./webgl-command-allocator.js"), require("./webgl-command-buffer.js"), require("./webgl-fence.js"), require("./webgl-framebuffer.js"), require("./webgl-input-assembler.js"), require("./webgl-descriptor-set-layout.js"), require("./webgl-pipeline-layout.js"), require("./webgl-pipeline-state.js"), require("./webgl-primary-command-buffer.js"), require("./webgl-queue.js"), require("./webgl-render-pass.js"), require("./webgl-sampler.js"), require("./webgl-shader.js"), require("./webgl-state-cache.js"), require("./webgl-texture.js"), require("../define.js"), require("./webgl-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.index, global.sys, global.commandBuffer, global.device, global.queue, global.texture, global.webglDescriptorSet, global.webglBuffer, global.webglCommandAllocator, global.webglCommandBuffer, global.webglFence, global.webglFramebuffer, global.webglInputAssembler, global.webglDescriptorSetLayout, global.webglPipelineLayout, global.webglPipelineState, global.webglPrimaryCommandBuffer, global.webglQueue, global.webglRenderPass, global.webglSampler, global.webglShader, global.webglStateCache, global.webglTexture, global.define, global.webglCommands);
    global.webglDevice = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _index, _sys, _commandBuffer, _device, _queue, _texture, _webglDescriptorSet, _webglBuffer, _webglCommandAllocator, _webglCommandBuffer, _webglFence, _webglFramebuffer, _webglInputAssembler, _webglDescriptorSetLayout, _webglPipelineLayout, _webglPipelineState, _webglPrimaryCommandBuffer, _webglQueue, _webglRenderPass, _webglSampler, _webglShader, _webglStateCache, _webglTexture, _define, _webglCommands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGLDevice = void 0;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  var eventWebGLContextLost = 'webglcontextlost';

  var WebGLDevice = /*#__PURE__*/function (_GFXDevice) {
    _inherits(WebGLDevice, _GFXDevice);

    function WebGLDevice() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGLDevice);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGLDevice)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.stateCache = new _webglStateCache.WebGLStateCache();
      _this.cmdAllocator = new _webglCommandAllocator.WebGLCommandAllocator();
      _this.nullTex2D = null;
      _this.nullTexCube = null;
      _this._webGLRC = null;
      _this._isAntialias = true;
      _this._isPremultipliedAlpha = true;
      _this._useVAO = false;
      _this._destroyShadersImmediately = true;
      _this._noCompressedTexSubImage2D = false;
      _this._bindingMappingInfo = new _device.GFXBindingMappingInfo();
      _this._webGLContextLostHandler = null;
      _this._extensions = null;
      _this._EXT_texture_filter_anisotropic = null;
      _this._EXT_frag_depth = null;
      _this._EXT_shader_texture_lod = null;
      _this._EXT_sRGB = null;
      _this._OES_vertex_array_object = null;
      _this._EXT_color_buffer_half_float = null;
      _this._WEBGL_color_buffer_float = null;
      _this._WEBGL_compressed_texture_etc1 = null;
      _this._WEBGL_compressed_texture_etc = null;
      _this._WEBGL_compressed_texture_pvrtc = null;
      _this._WEBGL_compressed_texture_astc = null;
      _this._WEBGL_compressed_texture_s3tc = null;
      _this._WEBGL_compressed_texture_s3tc_srgb = null;
      _this._WEBGL_debug_shaders = null;
      _this._WEBGL_draw_buffers = null;
      _this._WEBGL_lose_context = null;
      _this._WEBGL_depth_texture = null;
      _this._WEBGL_debug_renderer_info = null;
      _this._OES_texture_half_float = null;
      _this._OES_texture_half_float_linear = null;
      _this._OES_texture_float = null;
      _this._OES_texture_float_linear = null;
      _this._OES_standard_derivatives = null;
      _this._OES_element_index_uint = null;
      _this._ANGLE_instanced_arrays = null;
      return _this;
    }

    _createClass(WebGLDevice, [{
      key: "initialize",
      value: function initialize(info) {
        this._canvas = info.canvasElm;
        this._isAntialias = info.isAntialias;
        this._isPremultipliedAlpha = info.isPremultipliedAlpha;
        this._bindingMappingInfo = info.bindingMappingInfo;
        if (!this._bindingMappingInfo.bufferOffsets.length) this._bindingMappingInfo.bufferOffsets.push(0);
        if (!this._bindingMappingInfo.samplerOffsets.length) this._bindingMappingInfo.samplerOffsets.push(0);

        try {
          var webGLCtxAttribs = {
            alpha: _index.macro.ENABLE_TRANSPARENT_CANVAS,
            antialias: this._isAntialias,
            depth: true,
            stencil: true,
            premultipliedAlpha: this._isPremultipliedAlpha,
            preserveDrawingBuffer: false,
            powerPreference: 'default',
            failIfMajorPerformanceCaveat: false
          };
          /*
          if (WECHAT) {
              webGLCtxAttribs.preserveDrawingBuffer = true;
          }
          */

          this._webGLRC = this._canvas.getContext('webgl', webGLCtxAttribs);
        } catch (err) {
          console.error(err);
          return false;
        }

        if (!this._webGLRC) {
          console.error('This device does not support WebGL.');
          return false;
        }

        this._webGLContextLostHandler = this._onWebGLContextLost.bind(this);

        this._canvas.addEventListener(eventWebGLContextLost, this._onWebGLContextLost);

        this._canvas2D = document.createElement('canvas');
        console.info('WebGL device initialized.');
        this._gfxAPI = _device.GFXAPI.WEBGL;
        this._deviceName = 'WebGL';
        var gl = this._webGLRC;
        this._WEBGL_debug_renderer_info = this.getExtension('WEBGL_debug_renderer_info');

        if (this._WEBGL_debug_renderer_info) {
          this._renderer = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
          this._vendor = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
          this._renderer = gl.getParameter(gl.RENDERER);
          this._vendor = gl.getParameter(gl.VENDOR);
        }

        this._version = gl.getParameter(gl.VERSION);
        this._maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this._maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this._maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this._maxVertexTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._depthBits = gl.getParameter(gl.DEPTH_BITS);
        this._stencilBits = gl.getParameter(gl.STENCIL_BITS);
        this.stateCache.initialize(this._maxTextureUnits, this._maxVertexAttributes);

        if (_defaultConstants.ALIPAY) {
          this._depthBits = 24;
        }

        this._devicePixelRatio = info.devicePixelRatio || 1.0;
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._nativeWidth = Math.max(info.nativeWidth || this._width, 0);
        this._nativeHeight = Math.max(info.nativeHeight || this._height, 0);
        this._colorFmt = _define.GFXFormat.RGBA8;

        if (this._depthBits === 24) {
          if (this._stencilBits === 8) {
            this._depthStencilFmt = _define.GFXFormat.D24S8;
          } else {
            this._depthStencilFmt = _define.GFXFormat.D24;
          }
        } else {
          if (this._stencilBits === 8) {
            this._depthStencilFmt = _define.GFXFormat.D16S8;
          } else {
            this._depthStencilFmt = _define.GFXFormat.D16;
          }
        }

        this._extensions = gl.getSupportedExtensions();
        var extensions = '';

        if (this._extensions) {
          var _iterator = _createForOfIteratorHelper(this._extensions),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var ext = _step.value;
              extensions += ext + ' ';
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          console.debug('EXTENSIONS: ' + extensions);
        }

        this._EXT_texture_filter_anisotropic = this.getExtension('EXT_texture_filter_anisotropic');
        this._EXT_frag_depth = this.getExtension('EXT_frag_depth');
        this._EXT_shader_texture_lod = this.getExtension('EXT_shader_texture_lod');
        this._EXT_sRGB = this.getExtension('EXT_sRGB');
        this._OES_vertex_array_object = this.getExtension('OES_vertex_array_object');
        this._EXT_color_buffer_half_float = this.getExtension('EXT_color_buffer_half_float');
        this._WEBGL_color_buffer_float = this.getExtension('WEBGL_color_buffer_float');
        this._WEBGL_compressed_texture_etc1 = this.getExtension('WEBGL_compressed_texture_etc1');
        this._WEBGL_compressed_texture_etc = this.getExtension('WEBGL_compressed_texture_etc');
        this._WEBGL_compressed_texture_pvrtc = this.getExtension('WEBGL_compressed_texture_pvrtc');
        this._WEBGL_compressed_texture_astc = this.getExtension('WEBGL_compressed_texture_astc');
        this._WEBGL_compressed_texture_s3tc = this.getExtension('WEBGL_compressed_texture_s3tc');
        this._WEBGL_compressed_texture_s3tc_srgb = this.getExtension('WEBGL_compressed_texture_s3tc_srgb');
        this._WEBGL_debug_shaders = this.getExtension('WEBGL_debug_shaders');
        this._WEBGL_draw_buffers = this.getExtension('WEBGL_draw_buffers');
        this._WEBGL_lose_context = this.getExtension('WEBGL_lose_context');
        this._WEBGL_depth_texture = this.getExtension('WEBGL_depth_texture');
        this._OES_texture_half_float = this.getExtension('OES_texture_half_float');
        this._OES_texture_half_float_linear = this.getExtension('OES_texture_half_float_linear');
        this._OES_texture_float = this.getExtension('OES_texture_float');
        this._OES_texture_float_linear = this.getExtension('OES_texture_float_linear');
        this._OES_standard_derivatives = this.getExtension('OES_standard_derivatives');
        this._OES_element_index_uint = this.getExtension('OES_element_index_uint');
        this._ANGLE_instanced_arrays = this.getExtension('ANGLE_instanced_arrays'); // platform-specific hacks

        {
          // UC browser instancing implementation doesn't work
          if (_sys.sys.browserType === _sys.sys.BROWSER_TYPE_UC) {
            this._ANGLE_instanced_arrays = null;
          } // bytedance ios depth texture implementation doesn't work


          if (_defaultConstants.BYTEDANCE && _sys.sys.os === _sys.sys.OS_IOS) {
            this._WEBGL_depth_texture = null;
          } // earlier runtime VAO implementations doesn't work


          if (_defaultConstants.RUNTIME_BASED && !_defaultConstants.VIVO) {
            // @ts-ignore
            if (typeof loadRuntime !== 'function' || !loadRuntime() || typeof loadRuntime().getFeature !== 'function' || loadRuntime().getFeature('webgl.extensions.oes_vertex_array_object.revision') <= 0) {
              this._OES_vertex_array_object = null;
            }
          } // some earlier version of iOS and android wechat implement gl.detachShader incorrectly


          if (_sys.sys.os === _sys.sys.OS_IOS && _sys.sys.osMainVersion <= 10 || _defaultConstants.WECHAT && _sys.sys.os === _sys.sys.OS_ANDROID) {
            this._destroyShadersImmediately = false;
          } // compressedTexSubImage2D has always been problematic because the parameters differs slightly from GLES


          if (_defaultConstants.WECHAT) {
            // and MANY platforms get it wrong
            this._noCompressedTexSubImage2D = true;
          }
        }

        this._features.fill(false);

        if (this._WEBGL_color_buffer_float) {
          this._features[_device.GFXFeature.COLOR_FLOAT] = true;
        }

        if (this._EXT_color_buffer_half_float) {
          this._features[_device.GFXFeature.COLOR_HALF_FLOAT] = true;
        }

        if (this._OES_texture_float) {
          this._features[_device.GFXFeature.TEXTURE_FLOAT] = true;
        }

        if (this._OES_texture_half_float) {
          this._features[_device.GFXFeature.TEXTURE_HALF_FLOAT] = true;
        }

        if (this._OES_texture_float_linear) {
          this._features[_device.GFXFeature.TEXTURE_FLOAT_LINEAR] = true;
        }

        if (this._OES_texture_half_float_linear) {
          this._features[_device.GFXFeature.TEXTURE_HALF_FLOAT_LINEAR] = true;
        }

        this._features[_device.GFXFeature.FORMAT_RGB8] = true;

        if (this._WEBGL_depth_texture) {
          this._features[_device.GFXFeature.FORMAT_D16] = true;
          this._features[_device.GFXFeature.FORMAT_D24] = true;
          this._features[_device.GFXFeature.FORMAT_D24S8] = true;
        }

        if (this._OES_element_index_uint) {
          this._features[_device.GFXFeature.ELEMENT_INDEX_UINT] = true;
        }

        if (this._ANGLE_instanced_arrays) {
          this._features[_device.GFXFeature.INSTANCED_ARRAYS] = true;
        }

        var compressedFormat = '';

        if (this._WEBGL_compressed_texture_etc1) {
          this._features[_device.GFXFeature.FORMAT_ETC1] = true;
          compressedFormat += 'etc1 ';
        }

        if (this._WEBGL_compressed_texture_etc) {
          this._features[_device.GFXFeature.FORMAT_ETC2] = true;
          compressedFormat += 'etc2 ';
        }

        if (this._WEBGL_compressed_texture_s3tc) {
          this._features[_device.GFXFeature.FORMAT_DXT] = true;
          compressedFormat += 'dxt ';
        }

        if (this._WEBGL_compressed_texture_pvrtc) {
          this._features[_device.GFXFeature.FORMAT_PVRTC] = true;
          compressedFormat += 'pvrtc ';
        }

        if (this._WEBGL_compressed_texture_astc) {
          this._features[_device.GFXFeature.FORMAT_ASTC] = true;
          compressedFormat += 'astc ';
        }

        if (this._OES_vertex_array_object) {
          this._useVAO = true;
        }

        console.info('RENDERER: ' + this._renderer);
        console.info('VENDOR: ' + this._vendor);
        console.info('VERSION: ' + this._version);
        console.info('DPR: ' + this._devicePixelRatio);
        console.info('SCREEN_SIZE: ' + this._width + ' x ' + this._height);
        console.info('NATIVE_SIZE: ' + this._nativeWidth + ' x ' + this._nativeHeight); // console.info('COLOR_FORMAT: ' + GFXFormatInfos[this._colorFmt].name);
        // console.info('DEPTH_STENCIL_FORMAT: ' + GFXFormatInfos[this._depthStencilFmt].name);
        // console.info('MAX_VERTEX_ATTRIBS: ' + this._maxVertexAttributes);

        console.info('MAX_VERTEX_UNIFORM_VECTORS: ' + this._maxVertexUniformVectors); // console.info('MAX_FRAGMENT_UNIFORM_VECTORS: ' + this._maxFragmentUniformVectors);
        // console.info('MAX_TEXTURE_IMAGE_UNITS: ' + this._maxTextureUnits);
        // console.info('MAX_VERTEX_TEXTURE_IMAGE_UNITS: ' + this._maxVertexTextureUnits);

        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);

        if (this._EXT_texture_filter_anisotropic) {
          console.info('MAX_TEXTURE_MAX_ANISOTROPY_EXT: ' + this._EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }

        console.info('USE_VAO: ' + this._useVAO);
        console.info('COMPRESSED_FORMAT: ' + compressedFormat); // init states

        this.initStates(gl); // create queue

        this._queue = this.createQueue(new _queue.GFXQueueInfo(_define.GFXQueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new _commandBuffer.GFXCommandBufferInfo(this._queue)); // create default null texture

        this.nullTex2D = this.createTexture(new _texture.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.SAMPLED, _define.GFXFormat.RGBA8, 2, 2, _define.GFXTextureFlagBit.GEN_MIPMAP));
        this.nullTexCube = this.createTexture(new _texture.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.SAMPLED, _define.GFXFormat.RGBA8, 2, 2, _define.GFXTextureFlagBit.CUBEMAP | _define.GFXTextureFlagBit.GEN_MIPMAP, 6));
        var nullTexRegion = new _define.GFXBufferTextureCopy();
        nullTexRegion.texExtent.width = 2;
        nullTexRegion.texExtent.height = 2;
        var nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        this.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);
        nullTexRegion.texSubres.layerCount = 6;
        this.copyBuffersToTexture([nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff], this.nullTexCube, [nullTexRegion]);
        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._canvas && this._webGLContextLostHandler) {
          this._canvas.removeEventListener(eventWebGLContextLost, this._webGLContextLostHandler);

          this._webGLContextLostHandler = null;
        }

        if (this.nullTex2D) {
          this.nullTex2D.destroy();
          this.nullTex2D = null;
        }

        if (this.nullTexCube) {
          this.nullTexCube.destroy();
          this.nullTexCube = null;
        }

        if (this._queue) {
          this._queue.destroy();

          this._queue = null;
        }

        if (this._cmdBuff) {
          this._cmdBuff.destroy();

          this._cmdBuff = null;
        }

        this._extensions = null;
        this._webGLRC = null;
      }
    }, {
      key: "resize",
      value: function resize(width, height) {
        if (this._width !== width || this._height !== height) {
          console.info('Resizing device: ' + width + 'x' + height);
          this._canvas.width = width;
          this._canvas.height = height;
          this._width = width;
          this._height = height;
        }
      }
    }, {
      key: "acquire",
      value: function acquire() {
        this.cmdAllocator.releaseCmds();
      }
    }, {
      key: "present",
      value: function present() {
        var queue = this._queue;
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
      }
    }, {
      key: "createCommandBuffer",
      value: function createCommandBuffer(info) {
        // const ctor = WebGLCommandBuffer; // opt to instant invocation
        var ctor = info.type === _define.GFXCommandBufferType.PRIMARY ? _webglPrimaryCommandBuffer.WebGLPrimaryCommandBuffer : _webglCommandBuffer.WebGLCommandBuffer;
        var cmdBuff = new ctor(this);
        cmdBuff.initialize(info);
        return cmdBuff;
      }
    }, {
      key: "createBuffer",
      value: function createBuffer(info) {
        var buffer = new _webglBuffer.WebGLBuffer(this);

        if (buffer.initialize(info)) {
          return buffer;
        }

        return null;
      }
    }, {
      key: "createTexture",
      value: function createTexture(info) {
        var texture = new _webglTexture.WebGLTexture(this);

        if (texture.initialize(info)) {
          return texture;
        }

        return null;
      }
    }, {
      key: "createSampler",
      value: function createSampler(info) {
        var sampler = new _webglSampler.WebGLSampler(this);

        if (sampler.initialize(info)) {
          return sampler;
        }

        return null;
      }
    }, {
      key: "createDescriptorSet",
      value: function createDescriptorSet(info) {
        var descriptorSet = new _webglDescriptorSet.WebGLDescriptorSet(this);

        if (descriptorSet.initialize(info)) {
          return descriptorSet;
        }

        return null;
      }
    }, {
      key: "createShader",
      value: function createShader(info) {
        var shader = new _webglShader.WebGLShader(this);

        if (shader.initialize(info)) {
          return shader;
        }

        return null;
      }
    }, {
      key: "createInputAssembler",
      value: function createInputAssembler(info) {
        var inputAssembler = new _webglInputAssembler.WebGLInputAssembler(this);

        if (inputAssembler.initialize(info)) {
          return inputAssembler;
        }

        return null;
      }
    }, {
      key: "createRenderPass",
      value: function createRenderPass(info) {
        var renderPass = new _webglRenderPass.WebGLRenderPass(this);

        if (renderPass.initialize(info)) {
          return renderPass;
        }

        return null;
      }
    }, {
      key: "createFramebuffer",
      value: function createFramebuffer(info) {
        var framebuffer = new _webglFramebuffer.WebGLFramebuffer(this);

        if (framebuffer.initialize(info)) {
          return framebuffer;
        }

        return null;
      }
    }, {
      key: "createDescriptorSetLayout",
      value: function createDescriptorSetLayout(info) {
        var descriptorSetLayout = new _webglDescriptorSetLayout.WebGLDescriptorSetLayout(this);

        if (descriptorSetLayout.initialize(info)) {
          return descriptorSetLayout;
        }

        return null;
      }
    }, {
      key: "createPipelineLayout",
      value: function createPipelineLayout(info) {
        var pipelineLayout = new _webglPipelineLayout.WebGLPipelineLayout(this);

        if (pipelineLayout.initialize(info)) {
          return pipelineLayout;
        }

        return null;
      }
    }, {
      key: "createPipelineState",
      value: function createPipelineState(info) {
        var pipelineState = new _webglPipelineState.WebGLPipelineState(this);

        if (pipelineState.initialize(info)) {
          return pipelineState;
        }

        return null;
      }
    }, {
      key: "createFence",
      value: function createFence(info) {
        var fence = new _webglFence.WebGLFence(this);

        if (fence.initialize(info)) {
          return fence;
        }

        return null;
      }
    }, {
      key: "createQueue",
      value: function createQueue(info) {
        var queue = new _webglQueue.WebGLQueue(this);

        if (queue.initialize(info)) {
          return queue;
        }

        return null;
      }
    }, {
      key: "copyBuffersToTexture",
      value: function copyBuffersToTexture(buffers, texture, regions) {
        (0, _webglCommands.WebGLCmdFuncCopyBuffersToTexture)(this, buffers, texture.gpuTexture, regions);
      }
    }, {
      key: "copyTexImagesToTexture",
      value: function copyTexImagesToTexture(texImages, texture, regions) {
        (0, _webglCommands.WebGLCmdFuncCopyTexImagesToTexture)(this, texImages, texture.gpuTexture, regions);
      }
    }, {
      key: "copyFramebufferToBuffer",
      value: function copyFramebufferToBuffer(srcFramebuffer, dstBuffer, regions) {
        var gl = this._webGLRC;
        var gpuFramebuffer = srcFramebuffer.gpuFramebuffer;
        var format = gpuFramebuffer.gpuColorTextures[0].format;
        var glFormat = (0, _webglCommands.GFXFormatToWebGLFormat)(format, gl);
        var glType = (0, _webglCommands.GFXFormatToWebGLType)(format, gl);
        var ctor = (0, _define.getTypedArrayConstructor)(_define.GFXFormatInfos[format]);
        var curFBO = this.stateCache.glFramebuffer;

        if (this.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
          this.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
        }

        var view = new ctor(dstBuffer);

        var _iterator2 = _createForOfIteratorHelper(regions),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var region = _step2.value;
            var w = region.texExtent.width;
            var h = region.texExtent.height;
            gl.readPixels(region.texOffset.x, region.texOffset.y, w, h, glFormat, glType, view);
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        if (this.stateCache.glFramebuffer !== curFBO) {
          gl.bindFramebuffer(gl.FRAMEBUFFER, curFBO);
          this.stateCache.glFramebuffer = curFBO;
        }
      }
    }, {
      key: "blitFramebuffer",
      value: function blitFramebuffer(src, dst, srcRect, dstRect, filter) {}
    }, {
      key: "getExtension",
      value: function getExtension(ext) {
        var prefixes = ['', 'WEBKIT_', 'MOZ_'];

        for (var i = 0; i < prefixes.length; ++i) {
          var _ext = this.gl.getExtension(prefixes[i] + ext);

          if (_ext) {
            return _ext;
          }
        }

        return null;
      }
    }, {
      key: "initStates",
      value: function initStates(gl) {
        gl.activeTexture(gl.TEXTURE0);
        gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); // rasteriazer state

        gl.disable(gl.SCISSOR_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.disable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(0.0, 0.0); // depth stencil state

        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LESS);
        gl.depthRange(0.0, 1.0);
        gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 1, 0xffff);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.FRONT, 0xffff);
        gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 1, 0xffff);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.BACK, 0xffff);
        gl.disable(gl.STENCIL_TEST); // blend state

        gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
        gl.disable(gl.BLEND);
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        gl.colorMask(true, true, true, true);
        gl.blendColor(0.0, 0.0, 0.0, 0.0);
      }
    }, {
      key: "_onWebGLContextLost",
      value: function _onWebGLContextLost(event) {
        (0, _index.warnID)(11000);
        (0, _index.warn)(event); // 2020.9.3: `preventDefault` is not available on some platforms
        // event.preventDefault();
      }
    }, {
      key: "gl",
      get: function get() {
        return this._webGLRC;
      }
    }, {
      key: "webGLQueue",
      get: function get() {
        return this._queue;
      }
    }, {
      key: "isAntialias",
      get: function get() {
        return this._isAntialias;
      }
    }, {
      key: "isPremultipliedAlpha",
      get: function get() {
        return this._isPremultipliedAlpha;
      }
    }, {
      key: "useVAO",
      get: function get() {
        return this._useVAO;
      }
    }, {
      key: "destroyShadersImmediately",
      get: function get() {
        return this._destroyShadersImmediately;
      }
    }, {
      key: "noCompressedTexSubImage2D",
      get: function get() {
        return this._noCompressedTexSubImage2D;
      }
    }, {
      key: "bindingMappingInfo",
      get: function get() {
        return this._bindingMappingInfo;
      }
    }, {
      key: "EXT_texture_filter_anisotropic",
      get: function get() {
        return this._EXT_texture_filter_anisotropic;
      }
    }, {
      key: "EXT_frag_depth",
      get: function get() {
        return this._EXT_frag_depth;
      }
    }, {
      key: "EXT_shader_texture_lod",
      get: function get() {
        return this._EXT_shader_texture_lod;
      }
    }, {
      key: "EXT_sRGB",
      get: function get() {
        return this._EXT_sRGB;
      }
    }, {
      key: "OES_vertex_array_object",
      get: function get() {
        return this._OES_vertex_array_object;
      }
    }, {
      key: "WEBGL_color_buffer_float",
      get: function get() {
        return this._WEBGL_color_buffer_float;
      }
    }, {
      key: "WEBGL_compressed_texture_etc1",
      get: function get() {
        return this._WEBGL_compressed_texture_etc1;
      }
    }, {
      key: "WEBGL_compressed_texture_pvrtc",
      get: function get() {
        return this._WEBGL_compressed_texture_pvrtc;
      }
    }, {
      key: "WEBGL_compressed_texture_astc",
      get: function get() {
        return this._WEBGL_compressed_texture_astc;
      }
    }, {
      key: "WEBGL_compressed_texture_s3tc",
      get: function get() {
        return this._WEBGL_compressed_texture_s3tc;
      }
    }, {
      key: "WEBGL_compressed_texture_s3tc_srgb",
      get: function get() {
        return this._WEBGL_compressed_texture_s3tc_srgb;
      }
    }, {
      key: "WEBGL_debug_shaders",
      get: function get() {
        return this._WEBGL_debug_shaders;
      }
    }, {
      key: "WEBGL_draw_buffers",
      get: function get() {
        return this._WEBGL_draw_buffers;
      }
    }, {
      key: "WEBGL_lose_context",
      get: function get() {
        return this._WEBGL_lose_context;
      }
    }, {
      key: "WEBGL_depth_texture",
      get: function get() {
        return this._WEBGL_depth_texture;
      }
    }, {
      key: "WEBGL_debug_renderer_info",
      get: function get() {
        return this._WEBGL_debug_renderer_info;
      }
    }, {
      key: "OES_texture_half_float",
      get: function get() {
        return this._OES_texture_half_float;
      }
    }, {
      key: "OES_texture_half_float_linear",
      get: function get() {
        return this._OES_texture_half_float_linear;
      }
    }, {
      key: "OES_texture_float",
      get: function get() {
        return this._OES_texture_float;
      }
    }, {
      key: "OES_standard_derivatives",
      get: function get() {
        return this._OES_standard_derivatives;
      }
    }, {
      key: "OES_element_index_uint",
      get: function get() {
        return this._OES_element_index_uint;
      }
    }, {
      key: "ANGLE_instanced_arrays",
      get: function get() {
        return this._ANGLE_instanced_arrays;
      }
    }]);

    return WebGLDevice;
  }(_device.GFXDevice);

  _exports.WebGLDevice = WebGLDevice;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsL3dlYmdsLWRldmljZS50cyJdLCJuYW1lcyI6WyJldmVudFdlYkdMQ29udGV4dExvc3QiLCJXZWJHTERldmljZSIsInN0YXRlQ2FjaGUiLCJXZWJHTFN0YXRlQ2FjaGUiLCJjbWRBbGxvY2F0b3IiLCJXZWJHTENvbW1hbmRBbGxvY2F0b3IiLCJudWxsVGV4MkQiLCJudWxsVGV4Q3ViZSIsIl93ZWJHTFJDIiwiX2lzQW50aWFsaWFzIiwiX2lzUHJlbXVsdGlwbGllZEFscGhhIiwiX3VzZVZBTyIsIl9kZXN0cm95U2hhZGVyc0ltbWVkaWF0ZWx5IiwiX25vQ29tcHJlc3NlZFRleFN1YkltYWdlMkQiLCJfYmluZGluZ01hcHBpbmdJbmZvIiwiR0ZYQmluZGluZ01hcHBpbmdJbmZvIiwiX3dlYkdMQ29udGV4dExvc3RIYW5kbGVyIiwiX2V4dGVuc2lvbnMiLCJfRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljIiwiX0VYVF9mcmFnX2RlcHRoIiwiX0VYVF9zaGFkZXJfdGV4dHVyZV9sb2QiLCJfRVhUX3NSR0IiLCJfT0VTX3ZlcnRleF9hcnJheV9vYmplY3QiLCJfRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0IiwiX1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMSIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjIiwiX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXN0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Y19zcmdiIiwiX1dFQkdMX2RlYnVnX3NoYWRlcnMiLCJfV0VCR0xfZHJhd19idWZmZXJzIiwiX1dFQkdMX2xvc2VfY29udGV4dCIsIl9XRUJHTF9kZXB0aF90ZXh0dXJlIiwiX1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8iLCJfT0VTX3RleHR1cmVfaGFsZl9mbG9hdCIsIl9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhciIsIl9PRVNfdGV4dHVyZV9mbG9hdCIsIl9PRVNfdGV4dHVyZV9mbG9hdF9saW5lYXIiLCJfT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzIiwiX09FU19lbGVtZW50X2luZGV4X3VpbnQiLCJfQU5HTEVfaW5zdGFuY2VkX2FycmF5cyIsImluZm8iLCJfY2FudmFzIiwiY2FudmFzRWxtIiwiaXNBbnRpYWxpYXMiLCJpc1ByZW11bHRpcGxpZWRBbHBoYSIsImJpbmRpbmdNYXBwaW5nSW5mbyIsImJ1ZmZlck9mZnNldHMiLCJsZW5ndGgiLCJwdXNoIiwic2FtcGxlck9mZnNldHMiLCJ3ZWJHTEN0eEF0dHJpYnMiLCJhbHBoYSIsIm1hY3JvIiwiRU5BQkxFX1RSQU5TUEFSRU5UX0NBTlZBUyIsImFudGlhbGlhcyIsImRlcHRoIiwic3RlbmNpbCIsInByZW11bHRpcGxpZWRBbHBoYSIsInByZXNlcnZlRHJhd2luZ0J1ZmZlciIsInBvd2VyUHJlZmVyZW5jZSIsImZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQiLCJnZXRDb250ZXh0IiwiZXJyIiwiY29uc29sZSIsImVycm9yIiwiX29uV2ViR0xDb250ZXh0TG9zdCIsImJpbmQiLCJhZGRFdmVudExpc3RlbmVyIiwiX2NhbnZhczJEIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiX2dmeEFQSSIsIkdGWEFQSSIsIldFQkdMIiwiX2RldmljZU5hbWUiLCJnbCIsImdldEV4dGVuc2lvbiIsIl9yZW5kZXJlciIsImdldFBhcmFtZXRlciIsIlVOTUFTS0VEX1JFTkRFUkVSX1dFQkdMIiwiX3ZlbmRvciIsIlVOTUFTS0VEX1ZFTkRPUl9XRUJHTCIsIlJFTkRFUkVSIiwiVkVORE9SIiwiX3ZlcnNpb24iLCJWRVJTSU9OIiwiX21heFZlcnRleEF0dHJpYnV0ZXMiLCJNQVhfVkVSVEVYX0FUVFJJQlMiLCJfbWF4VmVydGV4VW5pZm9ybVZlY3RvcnMiLCJNQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUyIsIl9tYXhGcmFnbWVudFVuaWZvcm1WZWN0b3JzIiwiTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUyIsIl9tYXhUZXh0dXJlVW5pdHMiLCJNQVhfVEVYVFVSRV9JTUFHRV9VTklUUyIsIl9tYXhWZXJ0ZXhUZXh0dXJlVW5pdHMiLCJNQVhfVkVSVEVYX1RFWFRVUkVfSU1BR0VfVU5JVFMiLCJfbWF4VGV4dHVyZVNpemUiLCJNQVhfVEVYVFVSRV9TSVpFIiwiX21heEN1YmVNYXBUZXh0dXJlU2l6ZSIsIk1BWF9DVUJFX01BUF9URVhUVVJFX1NJWkUiLCJfZGVwdGhCaXRzIiwiREVQVEhfQklUUyIsIl9zdGVuY2lsQml0cyIsIlNURU5DSUxfQklUUyIsImluaXRpYWxpemUiLCJBTElQQVkiLCJfZGV2aWNlUGl4ZWxSYXRpbyIsImRldmljZVBpeGVsUmF0aW8iLCJfd2lkdGgiLCJ3aWR0aCIsIl9oZWlnaHQiLCJoZWlnaHQiLCJfbmF0aXZlV2lkdGgiLCJNYXRoIiwibWF4IiwibmF0aXZlV2lkdGgiLCJfbmF0aXZlSGVpZ2h0IiwibmF0aXZlSGVpZ2h0IiwiX2NvbG9yRm10IiwiR0ZYRm9ybWF0IiwiUkdCQTgiLCJfZGVwdGhTdGVuY2lsRm10IiwiRDI0UzgiLCJEMjQiLCJEMTZTOCIsIkQxNiIsImdldFN1cHBvcnRlZEV4dGVuc2lvbnMiLCJleHRlbnNpb25zIiwiZXh0IiwiZGVidWciLCJzeXMiLCJicm93c2VyVHlwZSIsIkJST1dTRVJfVFlQRV9VQyIsIkJZVEVEQU5DRSIsIm9zIiwiT1NfSU9TIiwiUlVOVElNRV9CQVNFRCIsIlZJVk8iLCJsb2FkUnVudGltZSIsImdldEZlYXR1cmUiLCJvc01haW5WZXJzaW9uIiwiV0VDSEFUIiwiT1NfQU5EUk9JRCIsIl9mZWF0dXJlcyIsImZpbGwiLCJHRlhGZWF0dXJlIiwiQ09MT1JfRkxPQVQiLCJDT0xPUl9IQUxGX0ZMT0FUIiwiVEVYVFVSRV9GTE9BVCIsIlRFWFRVUkVfSEFMRl9GTE9BVCIsIlRFWFRVUkVfRkxPQVRfTElORUFSIiwiVEVYVFVSRV9IQUxGX0ZMT0FUX0xJTkVBUiIsIkZPUk1BVF9SR0I4IiwiRk9STUFUX0QxNiIsIkZPUk1BVF9EMjQiLCJGT1JNQVRfRDI0UzgiLCJFTEVNRU5UX0lOREVYX1VJTlQiLCJJTlNUQU5DRURfQVJSQVlTIiwiY29tcHJlc3NlZEZvcm1hdCIsIkZPUk1BVF9FVEMxIiwiRk9STUFUX0VUQzIiLCJGT1JNQVRfRFhUIiwiRk9STUFUX1BWUlRDIiwiRk9STUFUX0FTVEMiLCJNQVhfVEVYVFVSRV9NQVhfQU5JU09UUk9QWV9FWFQiLCJpbml0U3RhdGVzIiwiX3F1ZXVlIiwiY3JlYXRlUXVldWUiLCJHRlhRdWV1ZUluZm8iLCJHRlhRdWV1ZVR5cGUiLCJHUkFQSElDUyIsIl9jbWRCdWZmIiwiY3JlYXRlQ29tbWFuZEJ1ZmZlciIsIkdGWENvbW1hbmRCdWZmZXJJbmZvIiwiY3JlYXRlVGV4dHVyZSIsIkdGWFRleHR1cmVJbmZvIiwiR0ZYVGV4dHVyZVR5cGUiLCJURVgyRCIsIkdGWFRleHR1cmVVc2FnZUJpdCIsIlNBTVBMRUQiLCJHRlhUZXh0dXJlRmxhZ0JpdCIsIkdFTl9NSVBNQVAiLCJDVUJFTUFQIiwibnVsbFRleFJlZ2lvbiIsIkdGWEJ1ZmZlclRleHR1cmVDb3B5IiwidGV4RXh0ZW50IiwibnVsbFRleEJ1ZmYiLCJVaW50OEFycmF5Iiwic2l6ZSIsImNvcHlCdWZmZXJzVG9UZXh0dXJlIiwidGV4U3VicmVzIiwibGF5ZXJDb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXN0cm95IiwicmVsZWFzZUNtZHMiLCJxdWV1ZSIsIl9udW1EcmF3Q2FsbHMiLCJudW1EcmF3Q2FsbHMiLCJfbnVtSW5zdGFuY2VzIiwibnVtSW5zdGFuY2VzIiwiX251bVRyaXMiLCJudW1UcmlzIiwiY2xlYXIiLCJjdG9yIiwidHlwZSIsIkdGWENvbW1hbmRCdWZmZXJUeXBlIiwiUFJJTUFSWSIsIldlYkdMUHJpbWFyeUNvbW1hbmRCdWZmZXIiLCJXZWJHTENvbW1hbmRCdWZmZXIiLCJjbWRCdWZmIiwiYnVmZmVyIiwiV2ViR0xCdWZmZXIiLCJ0ZXh0dXJlIiwiV2ViR0xUZXh0dXJlIiwic2FtcGxlciIsIldlYkdMU2FtcGxlciIsImRlc2NyaXB0b3JTZXQiLCJXZWJHTERlc2NyaXB0b3JTZXQiLCJzaGFkZXIiLCJXZWJHTFNoYWRlciIsImlucHV0QXNzZW1ibGVyIiwiV2ViR0xJbnB1dEFzc2VtYmxlciIsInJlbmRlclBhc3MiLCJXZWJHTFJlbmRlclBhc3MiLCJmcmFtZWJ1ZmZlciIsIldlYkdMRnJhbWVidWZmZXIiLCJkZXNjcmlwdG9yU2V0TGF5b3V0IiwiV2ViR0xEZXNjcmlwdG9yU2V0TGF5b3V0IiwicGlwZWxpbmVMYXlvdXQiLCJXZWJHTFBpcGVsaW5lTGF5b3V0IiwicGlwZWxpbmVTdGF0ZSIsIldlYkdMUGlwZWxpbmVTdGF0ZSIsImZlbmNlIiwiV2ViR0xGZW5jZSIsIldlYkdMUXVldWUiLCJidWZmZXJzIiwicmVnaW9ucyIsImdwdVRleHR1cmUiLCJ0ZXhJbWFnZXMiLCJzcmNGcmFtZWJ1ZmZlciIsImRzdEJ1ZmZlciIsImdwdUZyYW1lYnVmZmVyIiwiZm9ybWF0IiwiZ3B1Q29sb3JUZXh0dXJlcyIsImdsRm9ybWF0IiwiZ2xUeXBlIiwiR0ZYRm9ybWF0SW5mb3MiLCJjdXJGQk8iLCJnbEZyYW1lYnVmZmVyIiwiYmluZEZyYW1lYnVmZmVyIiwiRlJBTUVCVUZGRVIiLCJ2aWV3IiwicmVnaW9uIiwidyIsImgiLCJyZWFkUGl4ZWxzIiwidGV4T2Zmc2V0IiwieCIsInkiLCJzcmMiLCJkc3QiLCJzcmNSZWN0IiwiZHN0UmVjdCIsImZpbHRlciIsInByZWZpeGVzIiwiaSIsIl9leHQiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJwaXhlbFN0b3JlaSIsIlBBQ0tfQUxJR05NRU5UIiwiVU5QQUNLX0FMSUdOTUVOVCIsIlVOUEFDS19GTElQX1lfV0VCR0wiLCJkaXNhYmxlIiwiU0NJU1NPUl9URVNUIiwiZW5hYmxlIiwiQ1VMTF9GQUNFIiwiY3VsbEZhY2UiLCJCQUNLIiwiZnJvbnRGYWNlIiwiQ0NXIiwiUE9MWUdPTl9PRkZTRVRfRklMTCIsInBvbHlnb25PZmZzZXQiLCJERVBUSF9URVNUIiwiZGVwdGhNYXNrIiwiZGVwdGhGdW5jIiwiTEVTUyIsImRlcHRoUmFuZ2UiLCJzdGVuY2lsRnVuY1NlcGFyYXRlIiwiRlJPTlQiLCJBTFdBWVMiLCJzdGVuY2lsT3BTZXBhcmF0ZSIsIktFRVAiLCJzdGVuY2lsTWFza1NlcGFyYXRlIiwiU1RFTkNJTF9URVNUIiwiU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFIiwiQkxFTkQiLCJibGVuZEVxdWF0aW9uU2VwYXJhdGUiLCJGVU5DX0FERCIsImJsZW5kRnVuY1NlcGFyYXRlIiwiT05FIiwiWkVSTyIsImNvbG9yTWFzayIsImJsZW5kQ29sb3IiLCJldmVudCIsIkdGWERldmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1Q0EsTUFBTUEscUJBQXFCLEdBQUcsa0JBQTlCOztNQUVhQyxXOzs7Ozs7Ozs7Ozs7Ozs7WUEwSEZDLFUsR0FBOEIsSUFBSUMsZ0NBQUosRTtZQUM5QkMsWSxHQUFzQyxJQUFJQyw0Q0FBSixFO1lBQ3RDQyxTLEdBQWlDLEk7WUFDakNDLFcsR0FBbUMsSTtZQUVsQ0MsUSxHQUF5QyxJO1lBQ3pDQyxZLEdBQXdCLEk7WUFDeEJDLHFCLEdBQWlDLEk7WUFDakNDLE8sR0FBbUIsSztZQUNuQkMsMEIsR0FBc0MsSTtZQUN0Q0MsMEIsR0FBc0MsSztZQUN0Q0MsbUIsR0FBNkMsSUFBSUMsNkJBQUosRTtZQUM3Q0Msd0IsR0FBNEQsSTtZQUU1REMsVyxHQUErQixJO1lBQy9CQywrQixHQUF5RSxJO1lBQ3pFQyxlLEdBQXlDLEk7WUFDekNDLHVCLEdBQXlELEk7WUFDekRDLFMsR0FBNkIsSTtZQUM3QkMsd0IsR0FBMkQsSTtZQUMzREMsNEIsR0FBbUUsSTtZQUNuRUMseUIsR0FBNkQsSTtZQUM3REMs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QUFDSDs7OzBCQUVvQztBQUNqQyxlQUFPLEtBQUtDLDhCQUFaO0FBQ0g7OzswQkFFd0I7QUFDckIsZUFBTyxLQUFLQyxrQkFBWjtBQUNIOzs7MEJBRStCO0FBQzVCLGVBQU8sS0FBS0UseUJBQVo7QUFDSDs7OzBCQUU2QjtBQUMxQixlQUFPLEtBQUtDLHVCQUFaO0FBQ0g7OzswQkFFNkI7QUFDMUIsZUFBTyxLQUFLQyx1QkFBWjtBQUNIOzs7O0lBeEg0QjBRLGlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQUxJUEFZLCBSVU5USU1FX0JBU0VELCBCWVRFREFOQ0UsIFdFQ0hBVCwgREVCVUcsIFZJVk8gfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBtYWNybywgd2FybklELCB3YXJuIH0gZnJvbSAnLi4vLi4vcGxhdGZvcm0nO1xyXG5pbXBvcnQgeyBzeXMgfSBmcm9tICcuLi8uLi9wbGF0Zm9ybS9zeXMnO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0LCBHRlhEZXNjcmlwdG9yU2V0SW5mbyB9IGZyb20gJy4uL2Rlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgR0ZYQnVmZmVyLCBHRlhCdWZmZXJJbmZvLCBHRlhCdWZmZXJWaWV3SW5mbyB9IGZyb20gJy4uL2J1ZmZlcic7XHJcbmltcG9ydCB7IEdGWENvbW1hbmRCdWZmZXIsIEdGWENvbW1hbmRCdWZmZXJJbmZvIH0gZnJvbSAnLi4vY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhBUEksIEdGWERldmljZSwgR0ZYRmVhdHVyZSwgR0ZYRGV2aWNlSW5mbywgR0ZYQmluZGluZ01hcHBpbmdJbmZvIH0gZnJvbSAnLi4vZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYRmVuY2UsIEdGWEZlbmNlSW5mbyB9IGZyb20gJy4uL2ZlbmNlJztcclxuaW1wb3J0IHsgR0ZYRnJhbWVidWZmZXIsIEdGWEZyYW1lYnVmZmVySW5mbyB9IGZyb20gJy4uL2ZyYW1lYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIsIEdGWElucHV0QXNzZW1ibGVySW5mbyB9IGZyb20gJy4uL2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IEdGWFBpcGVsaW5lU3RhdGUsIEdGWFBpcGVsaW5lU3RhdGVJbmZvIH0gZnJvbSAnLi4vcGlwZWxpbmUtc3RhdGUnO1xyXG5pbXBvcnQgeyBHRlhRdWV1ZSwgR0ZYUXVldWVJbmZvIH0gZnJvbSAnLi4vcXVldWUnO1xyXG5pbXBvcnQgeyBHRlhSZW5kZXJQYXNzLCBHRlhSZW5kZXJQYXNzSW5mbyB9IGZyb20gJy4uL3JlbmRlci1wYXNzJztcclxuaW1wb3J0IHsgR0ZYU2FtcGxlciwgR0ZYU2FtcGxlckluZm8gfSBmcm9tICcuLi9zYW1wbGVyJztcclxuaW1wb3J0IHsgR0ZYU2hhZGVyLCBHRlhTaGFkZXJJbmZvIH0gZnJvbSAnLi4vc2hhZGVyJztcclxuaW1wb3J0IHsgR0ZYVGV4dHVyZSwgR0ZYVGV4dHVyZUluZm8sIEdGWFRleHR1cmVWaWV3SW5mbyB9IGZyb20gJy4uL3RleHR1cmUnO1xyXG5pbXBvcnQgeyBXZWJHTERlc2NyaXB0b3JTZXQgfSBmcm9tICcuL3dlYmdsLWRlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgV2ViR0xCdWZmZXIgfSBmcm9tICcuL3dlYmdsLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMQ29tbWFuZEFsbG9jYXRvciB9IGZyb20gJy4vd2ViZ2wtY29tbWFuZC1hbGxvY2F0b3InO1xyXG5pbXBvcnQgeyBXZWJHTENvbW1hbmRCdWZmZXIgfSBmcm9tICcuL3dlYmdsLWNvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0xGZW5jZSB9IGZyb20gJy4vd2ViZ2wtZmVuY2UnO1xyXG5pbXBvcnQgeyBXZWJHTEZyYW1lYnVmZmVyIH0gZnJvbSAnLi93ZWJnbC1mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMSW5wdXRBc3NlbWJsZXIgfSBmcm9tICcuL3dlYmdsLWlucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFdlYkdMRGVzY3JpcHRvclNldExheW91dCB9IGZyb20gJy4vd2ViZ2wtZGVzY3JpcHRvci1zZXQtbGF5b3V0JztcclxuaW1wb3J0IHsgV2ViR0xQaXBlbGluZUxheW91dCB9IGZyb20gJy4vd2ViZ2wtcGlwZWxpbmUtbGF5b3V0JztcclxuaW1wb3J0IHsgV2ViR0xQaXBlbGluZVN0YXRlIH0gZnJvbSAnLi93ZWJnbC1waXBlbGluZS1zdGF0ZSc7XHJcbmltcG9ydCB7IFdlYkdMUHJpbWFyeUNvbW1hbmRCdWZmZXIgfSBmcm9tICcuL3dlYmdsLXByaW1hcnktY29tbWFuZC1idWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTFF1ZXVlIH0gZnJvbSAnLi93ZWJnbC1xdWV1ZSc7XHJcbmltcG9ydCB7IFdlYkdMUmVuZGVyUGFzcyB9IGZyb20gJy4vd2ViZ2wtcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTFNhbXBsZXIgfSBmcm9tICcuL3dlYmdsLXNhbXBsZXInO1xyXG5pbXBvcnQgeyBXZWJHTFNoYWRlciB9IGZyb20gJy4vd2ViZ2wtc2hhZGVyJztcclxuaW1wb3J0IHsgV2ViR0xTdGF0ZUNhY2hlIH0gZnJvbSAnLi93ZWJnbC1zdGF0ZS1jYWNoZSc7XHJcbmltcG9ydCB7IFdlYkdMVGV4dHVyZSB9IGZyb20gJy4vd2ViZ2wtdGV4dHVyZSc7XHJcbmltcG9ydCB7IGdldFR5cGVkQXJyYXlDb25zdHJ1Y3RvciwgR0ZYQnVmZmVyVGV4dHVyZUNvcHksIEdGWENvbW1hbmRCdWZmZXJUeXBlLCBHRlhGaWx0ZXIsIEdGWEZvcm1hdCwgR0ZYRm9ybWF0SW5mb3MsXHJcbiAgICBHRlhRdWV1ZVR5cGUsIEdGWFRleHR1cmVGbGFnQml0LCBHRlhUZXh0dXJlVHlwZSwgR0ZYVGV4dHVyZVVzYWdlQml0LCBHRlhSZWN0IH0gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdCwgR0ZYRm9ybWF0VG9XZWJHTFR5cGUsIFdlYkdMQ21kRnVuY0NvcHlCdWZmZXJzVG9UZXh0dXJlLFxyXG4gICAgV2ViR0xDbWRGdW5jQ29weVRleEltYWdlc1RvVGV4dHVyZSB9IGZyb20gJy4vd2ViZ2wtY29tbWFuZHMnO1xyXG5pbXBvcnQgeyBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0SW5mbywgR0ZYRGVzY3JpcHRvclNldExheW91dCwgR0ZYUGlwZWxpbmVMYXlvdXRJbmZvLCBHRlhQaXBlbGluZUxheW91dCB9IGZyb20gJy4uLy4uJztcclxuXHJcbmNvbnN0IGV2ZW50V2ViR0xDb250ZXh0TG9zdCA9ICd3ZWJnbGNvbnRleHRsb3N0JztcclxuXHJcbmV4cG9ydCBjbGFzcyBXZWJHTERldmljZSBleHRlbmRzIEdGWERldmljZSB7XHJcblxyXG4gICAgZ2V0IGdsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2ViR0xSQyBhcyBXZWJHTFJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHdlYkdMUXVldWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWV1ZSBhcyBXZWJHTFF1ZXVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc0FudGlhbGlhcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzQW50aWFsaWFzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBpc1ByZW11bHRpcGxpZWRBbHBoYSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzUHJlbXVsdGlwbGllZEFscGhhO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB1c2VWQU8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91c2VWQU87XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGRlc3Ryb3lTaGFkZXJzSW1tZWRpYXRlbHkgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXN0cm95U2hhZGVyc0ltbWVkaWF0ZWx5O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBub0NvbXByZXNzZWRUZXhTdWJJbWFnZTJEICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbm9Db21wcmVzc2VkVGV4U3ViSW1hZ2UyRDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgYmluZGluZ01hcHBpbmdJbmZvICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmluZGluZ01hcHBpbmdJbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9FWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IEVYVF9mcmFnX2RlcHRoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fRVhUX2ZyYWdfZGVwdGg7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IEVYVF9zaGFkZXJfdGV4dHVyZV9sb2QgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9FWFRfc2hhZGVyX3RleHR1cmVfbG9kO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBFWFRfc1JHQiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX0VYVF9zUkdCO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBPRVNfdmVydGV4X2FycmF5X29iamVjdCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBXRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXN0YztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGNfc3JnYiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2I7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2RlYnVnX3NoYWRlcnMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9kZWJ1Z19zaGFkZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBXRUJHTF9kcmF3X2J1ZmZlcnMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9kcmF3X2J1ZmZlcnM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2xvc2VfY29udGV4dCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1dFQkdMX2xvc2VfY29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgV0VCR0xfZGVwdGhfdGV4dHVyZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX1dFQkdMX2RlcHRoX3RleHR1cmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fT0VTX3RleHR1cmVfaGFsZl9mbG9hdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgT0VTX3RleHR1cmVfZmxvYXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9PRVNfdGV4dHVyZV9mbG9hdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBPRVNfZWxlbWVudF9pbmRleF91aW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fT0VTX2VsZW1lbnRfaW5kZXhfdWludDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgQU5HTEVfaW5zdGFuY2VkX2FycmF5cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX0FOR0xFX2luc3RhbmNlZF9hcnJheXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRlQ2FjaGU6IFdlYkdMU3RhdGVDYWNoZSA9IG5ldyBXZWJHTFN0YXRlQ2FjaGUoKTtcclxuICAgIHB1YmxpYyBjbWRBbGxvY2F0b3I6IFdlYkdMQ29tbWFuZEFsbG9jYXRvciA9IG5ldyBXZWJHTENvbW1hbmRBbGxvY2F0b3IoKTtcclxuICAgIHB1YmxpYyBudWxsVGV4MkQ6IFdlYkdMVGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIG51bGxUZXhDdWJlOiBXZWJHTFRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF93ZWJHTFJDOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2lzQW50aWFsaWFzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX2lzUHJlbXVsdGlwbGllZEFscGhhOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX3VzZVZBTzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJpdmF0ZSBfZGVzdHJveVNoYWRlcnNJbW1lZGlhdGVseTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICBwcml2YXRlIF9ub0NvbXByZXNzZWRUZXhTdWJJbWFnZTJEOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcml2YXRlIF9iaW5kaW5nTWFwcGluZ0luZm86IEdGWEJpbmRpbmdNYXBwaW5nSW5mbyA9IG5ldyBHRlhCaW5kaW5nTWFwcGluZ0luZm8oKTtcclxuICAgIHByaXZhdGUgX3dlYkdMQ29udGV4dExvc3RIYW5kbGVyOiBudWxsIHwgKChldmVudDogRXZlbnQpID0+IHZvaWQpID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9leHRlbnNpb25zOiBzdHJpbmdbXSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljOiBFWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX0VYVF9mcmFnX2RlcHRoOiBFWFRfZnJhZ19kZXB0aCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfRVhUX3NoYWRlcl90ZXh0dXJlX2xvZDogRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfRVhUX3NSR0I6IEVYVF9zUkdCIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9PRVNfdmVydGV4X2FycmF5X29iamVjdDogT0VTX3ZlcnRleF9hcnJheV9vYmplY3QgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdDogRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQ6IFdFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzE6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjOiBXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGM6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGM6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hc3RjIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YzogV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2I6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2IgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX2RlYnVnX3NoYWRlcnM6IFdFQkdMX2RlYnVnX3NoYWRlcnMgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX2RyYXdfYnVmZmVyczogV0VCR0xfZHJhd19idWZmZXJzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9sb3NlX2NvbnRleHQ6IFdFQkdMX2xvc2VfY29udGV4dCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfZGVwdGhfdGV4dHVyZTogV0VCR0xfZGVwdGhfdGV4dHVyZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbzogV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfT0VTX3RleHR1cmVfaGFsZl9mbG9hdDogT0VTX3RleHR1cmVfaGFsZl9mbG9hdCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXI6IE9FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9PRVNfdGV4dHVyZV9mbG9hdDogT0VTX3RleHR1cmVfZmxvYXQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhcjogT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXM6IE9FU19zdGFuZGFyZF9kZXJpdmF0aXZlcyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfT0VTX2VsZW1lbnRfaW5kZXhfdWludDogT0VTX2VsZW1lbnRfaW5kZXhfdWludCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfQU5HTEVfaW5zdGFuY2VkX2FycmF5czogQU5HTEVfaW5zdGFuY2VkX2FycmF5cyB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhEZXZpY2VJbmZvKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGluZm8uY2FudmFzRWxtIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuX2lzQW50aWFsaWFzID0gaW5mby5pc0FudGlhbGlhcztcclxuICAgICAgICB0aGlzLl9pc1ByZW11bHRpcGxpZWRBbHBoYSA9IGluZm8uaXNQcmVtdWx0aXBsaWVkQWxwaGE7XHJcbiAgICAgICAgdGhpcy5fYmluZGluZ01hcHBpbmdJbmZvID0gaW5mby5iaW5kaW5nTWFwcGluZ0luZm87XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uYnVmZmVyT2Zmc2V0cy5sZW5ndGgpIHRoaXMuX2JpbmRpbmdNYXBwaW5nSW5mby5idWZmZXJPZmZzZXRzLnB1c2goMCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHMubGVuZ3RoKSB0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHMucHVzaCgwKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgd2ViR0xDdHhBdHRyaWJzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xyXG4gICAgICAgICAgICAgICAgYWxwaGE6IG1hY3JvLkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMsXHJcbiAgICAgICAgICAgICAgICBhbnRpYWxpYXM6IHRoaXMuX2lzQW50aWFsaWFzLFxyXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdGVuY2lsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLl9pc1ByZW11bHRpcGxpZWRBbHBoYSxcclxuICAgICAgICAgICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwb3dlclByZWZlcmVuY2U6ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgaWYgKFdFQ0hBVCkge1xyXG4gICAgICAgICAgICAgICAgd2ViR0xDdHhBdHRyaWJzLnByZXNlcnZlRHJhd2luZ0J1ZmZlciA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKi9cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3dlYkdMUkMgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCB3ZWJHTEN0eEF0dHJpYnMpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fd2ViR0xSQykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdUaGlzIGRldmljZSBkb2VzIG5vdCBzdXBwb3J0IFdlYkdMLicpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl93ZWJHTENvbnRleHRMb3N0SGFuZGxlciA9IHRoaXMuX29uV2ViR0xDb250ZXh0TG9zdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50V2ViR0xDb250ZXh0TG9zdCwgdGhpcy5fb25XZWJHTENvbnRleHRMb3N0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fY2FudmFzMkQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1dlYkdMIGRldmljZSBpbml0aWFsaXplZC4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZ2Z4QVBJID0gR0ZYQVBJLldFQkdMO1xyXG4gICAgICAgIHRoaXMuX2RldmljZU5hbWUgPSAnV2ViR0wnO1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5fd2ViR0xSQztcclxuXHJcbiAgICAgICAgdGhpcy5fV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIodGhpcy5fV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mby5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlbmRvciA9IGdsLmdldFBhcmFtZXRlcih0aGlzLl9XRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvLlVOTUFTS0VEX1ZFTkRPUl9XRUJHTCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuUkVOREVSRVIpO1xyXG4gICAgICAgICAgICB0aGlzLl92ZW5kb3IgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVORE9SKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnNpb24gPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVSU0lPTik7XHJcbiAgICAgICAgdGhpcy5fbWF4VmVydGV4QXR0cmlidXRlcyA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVkVSVEVYX0FUVFJJQlMpO1xyXG4gICAgICAgIHRoaXMuX21heFZlcnRleFVuaWZvcm1WZWN0b3JzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTKTtcclxuICAgICAgICB0aGlzLl9tYXhGcmFnbWVudFVuaWZvcm1WZWN0b3JzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9GUkFHTUVOVF9VTklGT1JNX1ZFQ1RPUlMpO1xyXG4gICAgICAgIHRoaXMuX21heFRleHR1cmVVbml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgdGhpcy5fbWF4VmVydGV4VGV4dHVyZVVuaXRzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgdGhpcy5fbWF4VGV4dHVyZVNpemUgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX1RFWFRVUkVfU0laRSk7XHJcbiAgICAgICAgdGhpcy5fbWF4Q3ViZU1hcFRleHR1cmVTaXplID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9DVUJFX01BUF9URVhUVVJFX1NJWkUpO1xyXG4gICAgICAgIHRoaXMuX2RlcHRoQml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5ERVBUSF9CSVRTKTtcclxuICAgICAgICB0aGlzLl9zdGVuY2lsQml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5TVEVOQ0lMX0JJVFMpO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlQ2FjaGUuaW5pdGlhbGl6ZSh0aGlzLl9tYXhUZXh0dXJlVW5pdHMsIHRoaXMuX21heFZlcnRleEF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICBpZiAoQUxJUEFZKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlcHRoQml0cyA9IDI0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZGV2aWNlUGl4ZWxSYXRpbyA9IGluZm8uZGV2aWNlUGl4ZWxSYXRpbyB8fCAxLjA7XHJcbiAgICAgICAgdGhpcy5fd2lkdGggPSB0aGlzLl9jYW52YXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gdGhpcy5fY2FudmFzLmhlaWdodDtcclxuICAgICAgICB0aGlzLl9uYXRpdmVXaWR0aCA9IE1hdGgubWF4KGluZm8ubmF0aXZlV2lkdGggfHwgdGhpcy5fd2lkdGgsIDApO1xyXG4gICAgICAgIHRoaXMuX25hdGl2ZUhlaWdodCA9IE1hdGgubWF4KGluZm8ubmF0aXZlSGVpZ2h0IHx8IHRoaXMuX2hlaWdodCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbG9yRm10ID0gR0ZYRm9ybWF0LlJHQkE4O1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fZGVwdGhCaXRzID09PSAyNCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RlbmNpbEJpdHMgPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMjRTODtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMjQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RlbmNpbEJpdHMgPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMTZTODtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMTY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBnbC5nZXRTdXBwb3J0ZWRFeHRlbnNpb25zKCk7XHJcbiAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5fZXh0ZW5zaW9ucykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV4dCBvZiB0aGlzLl9leHRlbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zICs9IGV4dCArICcgJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRVhURU5TSU9OUzogJyArIGV4dGVuc2lvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljID0gdGhpcy5nZXRFeHRlbnNpb24oJ0VYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYycpO1xyXG4gICAgICAgIHRoaXMuX0VYVF9mcmFnX2RlcHRoID0gdGhpcy5nZXRFeHRlbnNpb24oJ0VYVF9mcmFnX2RlcHRoJyk7XHJcbiAgICAgICAgdGhpcy5fRVhUX3NoYWRlcl90ZXh0dXJlX2xvZCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdFWFRfc2hhZGVyX3RleHR1cmVfbG9kJyk7XHJcbiAgICAgICAgdGhpcy5fRVhUX3NSR0IgPSB0aGlzLmdldEV4dGVuc2lvbignRVhUX3NSR0InKTtcclxuICAgICAgICB0aGlzLl9PRVNfdmVydGV4X2FycmF5X29iamVjdCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdmVydGV4X2FycmF5X29iamVjdCcpO1xyXG4gICAgICAgIHRoaXMuX0VYVF9jb2xvcl9idWZmZXJfaGFsZl9mbG9hdCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdFWFRfY29sb3JfYnVmZmVyX2hhbGZfZmxvYXQnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9jb2xvcl9idWZmZXJfZmxvYXQgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29sb3JfYnVmZmVyX2Zsb2F0Jyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGMgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGMnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YycpO1xyXG4gICAgICAgIHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2IgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGNfc3JnYicpO1xyXG4gICAgICAgIHRoaXMuX1dFQkdMX2RlYnVnX3NoYWRlcnMgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfZGVidWdfc2hhZGVycycpO1xyXG4gICAgICAgIHRoaXMuX1dFQkdMX2RyYXdfYnVmZmVycyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kcmF3X2J1ZmZlcnMnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9sb3NlX2NvbnRleHQgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfbG9zZV9jb250ZXh0Jyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfZGVwdGhfdGV4dHVyZSA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZXB0aF90ZXh0dXJlJyk7XHJcbiAgICAgICAgdGhpcy5fT0VTX3RleHR1cmVfaGFsZl9mbG9hdCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0Jyk7XHJcbiAgICAgICAgdGhpcy5fT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXIgPSB0aGlzLmdldEV4dGVuc2lvbignT0VTX3RleHR1cmVfaGFsZl9mbG9hdF9saW5lYXInKTtcclxuICAgICAgICB0aGlzLl9PRVNfdGV4dHVyZV9mbG9hdCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdCcpO1xyXG4gICAgICAgIHRoaXMuX09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhciA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInKTtcclxuICAgICAgICB0aGlzLl9PRVNfc3RhbmRhcmRfZGVyaXZhdGl2ZXMgPSB0aGlzLmdldEV4dGVuc2lvbignT0VTX3N0YW5kYXJkX2Rlcml2YXRpdmVzJyk7XHJcbiAgICAgICAgdGhpcy5fT0VTX2VsZW1lbnRfaW5kZXhfdWludCA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfZWxlbWVudF9pbmRleF91aW50Jyk7XHJcbiAgICAgICAgdGhpcy5fQU5HTEVfaW5zdGFuY2VkX2FycmF5cyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdBTkdMRV9pbnN0YW5jZWRfYXJyYXlzJyk7XHJcblxyXG4gICAgICAgIC8vIHBsYXRmb3JtLXNwZWNpZmljIGhhY2tzXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICAvLyBVQyBicm93c2VyIGluc3RhbmNpbmcgaW1wbGVtZW50YXRpb24gZG9lc24ndCB3b3JrXHJcbiAgICAgICAgICAgIGlmIChzeXMuYnJvd3NlclR5cGUgPT09IHN5cy5CUk9XU0VSX1RZUEVfVUMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX0FOR0xFX2luc3RhbmNlZF9hcnJheXMgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBieXRlZGFuY2UgaW9zIGRlcHRoIHRleHR1cmUgaW1wbGVtZW50YXRpb24gZG9lc24ndCB3b3JrXHJcbiAgICAgICAgICAgIGlmIChCWVRFREFOQ0UgJiYgc3lzLm9zID09PSBzeXMuT1NfSU9TKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9XRUJHTF9kZXB0aF90ZXh0dXJlID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gZWFybGllciBydW50aW1lIFZBTyBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCB3b3JrXHJcbiAgICAgICAgICAgIGlmIChSVU5USU1FX0JBU0VEICYmICFWSVZPKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGxvYWRSdW50aW1lICE9PSAnZnVuY3Rpb24nIHx8ICFsb2FkUnVudGltZSgpIHx8IHR5cGVvZiBsb2FkUnVudGltZSgpLmdldEZlYXR1cmUgIT09ICdmdW5jdGlvbicgfHwgbG9hZFJ1bnRpbWUoKVxyXG4gICAgICAgICAgICAgICAgICAgIC5nZXRGZWF0dXJlKCd3ZWJnbC5leHRlbnNpb25zLm9lc192ZXJ0ZXhfYXJyYXlfb2JqZWN0LnJldmlzaW9uJykgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX09FU192ZXJ0ZXhfYXJyYXlfb2JqZWN0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc29tZSBlYXJsaWVyIHZlcnNpb24gb2YgaU9TIGFuZCBhbmRyb2lkIHdlY2hhdCBpbXBsZW1lbnQgZ2wuZGV0YWNoU2hhZGVyIGluY29ycmVjdGx5XHJcbiAgICAgICAgICAgIGlmICgoc3lzLm9zID09PSBzeXMuT1NfSU9TICYmIHN5cy5vc01haW5WZXJzaW9uIDw9IDEwKSB8fFxyXG4gICAgICAgICAgICAgICAgKFdFQ0hBVCAmJiBzeXMub3MgPT09IHN5cy5PU19BTkRST0lEKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzdHJveVNoYWRlcnNJbW1lZGlhdGVseSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBjb21wcmVzc2VkVGV4U3ViSW1hZ2UyRCBoYXMgYWx3YXlzIGJlZW4gcHJvYmxlbWF0aWMgYmVjYXVzZSB0aGUgcGFyYW1ldGVycyBkaWZmZXJzIHNsaWdodGx5IGZyb20gR0xFU1xyXG4gICAgICAgICAgICBpZiAoV0VDSEFUKSB7IC8vIGFuZCBNQU5ZIHBsYXRmb3JtcyBnZXQgaXQgd3JvbmdcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vQ29tcHJlc3NlZFRleFN1YkltYWdlMkQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9mZWF0dXJlcy5maWxsKGZhbHNlKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX1dFQkdMX2NvbG9yX2J1ZmZlcl9mbG9hdCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkNPTE9SX0ZMT0FUXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fRVhUX2NvbG9yX2J1ZmZlcl9oYWxmX2Zsb2F0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuQ09MT1JfSEFMRl9GTE9BVF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX09FU190ZXh0dXJlX2Zsb2F0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuVEVYVFVSRV9GTE9BVF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX09FU190ZXh0dXJlX2hhbGZfZmxvYXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5URVhUVVJFX0hBTEZfRkxPQVRdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9PRVNfdGV4dHVyZV9mbG9hdF9saW5lYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5URVhUVVJFX0ZMT0FUX0xJTkVBUl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuVEVYVFVSRV9IQUxGX0ZMT0FUX0xJTkVBUl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfUkdCOF0gPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fV0VCR0xfZGVwdGhfdGV4dHVyZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9EMTZdID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRDI0XSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX0QyNFM4XSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fT0VTX2VsZW1lbnRfaW5kZXhfdWludCkge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkVMRU1FTlRfSU5ERVhfVUlOVF0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX0FOR0xFX2luc3RhbmNlZF9hcnJheXMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5JTlNUQU5DRURfQVJSQVlTXSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZXQgY29tcHJlc3NlZEZvcm1hdDogc3RyaW5nID0gJyc7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMSkge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9FVEMxXSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbXByZXNzZWRGb3JtYXQgKz0gJ2V0YzEgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX0VUQzJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29tcHJlc3NlZEZvcm1hdCArPSAnZXRjMiAnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX0RYVF0gPSB0cnVlO1xyXG4gICAgICAgICAgICBjb21wcmVzc2VkRm9ybWF0ICs9ICdkeHQgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfUFZSVENdID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29tcHJlc3NlZEZvcm1hdCArPSAncHZydGMgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXN0Yykge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9BU1RDXSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbXByZXNzZWRGb3JtYXQgKz0gJ2FzdGMgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9PRVNfdmVydGV4X2FycmF5X29iamVjdCkge1xyXG4gICAgICAgICAgICB0aGlzLl91c2VWQU8gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdSRU5ERVJFUjogJyArIHRoaXMuX3JlbmRlcmVyKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1ZFTkRPUjogJyArIHRoaXMuX3ZlbmRvcik7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdWRVJTSU9OOiAnICsgdGhpcy5fdmVyc2lvbik7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdEUFI6ICcgKyB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1NDUkVFTl9TSVpFOiAnICsgdGhpcy5fd2lkdGggKyAnIHggJyArIHRoaXMuX2hlaWdodCk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdOQVRJVkVfU0laRTogJyArIHRoaXMuX25hdGl2ZVdpZHRoICsgJyB4ICcgKyB0aGlzLl9uYXRpdmVIZWlnaHQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygnQ09MT1JfRk9STUFUOiAnICsgR0ZYRm9ybWF0SW5mb3NbdGhpcy5fY29sb3JGbXRdLm5hbWUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygnREVQVEhfU1RFTkNJTF9GT1JNQVQ6ICcgKyBHRlhGb3JtYXRJbmZvc1t0aGlzLl9kZXB0aFN0ZW5jaWxGbXRdLm5hbWUpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbygnTUFYX1ZFUlRFWF9BVFRSSUJTOiAnICsgdGhpcy5fbWF4VmVydGV4QXR0cmlidXRlcyk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdNQVhfVkVSVEVYX1VOSUZPUk1fVkVDVE9SUzogJyArIHRoaXMuX21heFZlcnRleFVuaWZvcm1WZWN0b3JzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmluZm8oJ01BWF9GUkFHTUVOVF9VTklGT1JNX1ZFQ1RPUlM6ICcgKyB0aGlzLl9tYXhGcmFnbWVudFVuaWZvcm1WZWN0b3JzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmluZm8oJ01BWF9URVhUVVJFX0lNQUdFX1VOSVRTOiAnICsgdGhpcy5fbWF4VGV4dHVyZVVuaXRzKTtcclxuICAgICAgICAvLyBjb25zb2xlLmluZm8oJ01BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUzogJyArIHRoaXMuX21heFZlcnRleFRleHR1cmVVbml0cyk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdERVBUSF9CSVRTOiAnICsgdGhpcy5fZGVwdGhCaXRzKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1NURU5DSUxfQklUUzogJyArIHRoaXMuX3N0ZW5jaWxCaXRzKTtcclxuICAgICAgICBpZiAodGhpcy5fRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUOiAnICsgdGhpcy5fRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljLk1BWF9URVhUVVJFX01BWF9BTklTT1RST1BZX0VYVCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnVVNFX1ZBTzogJyArIHRoaXMuX3VzZVZBTyk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdDT01QUkVTU0VEX0ZPUk1BVDogJyArIGNvbXByZXNzZWRGb3JtYXQpO1xyXG5cclxuICAgICAgICAvLyBpbml0IHN0YXRlc1xyXG4gICAgICAgIHRoaXMuaW5pdFN0YXRlcyhnbCk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBxdWV1ZVxyXG4gICAgICAgIHRoaXMuX3F1ZXVlID0gdGhpcy5jcmVhdGVRdWV1ZShuZXcgR0ZYUXVldWVJbmZvKEdGWFF1ZXVlVHlwZS5HUkFQSElDUykpO1xyXG4gICAgICAgIHRoaXMuX2NtZEJ1ZmYgPSB0aGlzLmNyZWF0ZUNvbW1hbmRCdWZmZXIobmV3IEdGWENvbW1hbmRCdWZmZXJJbmZvKHRoaXMuX3F1ZXVlKSk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBkZWZhdWx0IG51bGwgdGV4dHVyZVxyXG4gICAgICAgIHRoaXMubnVsbFRleDJEID0gdGhpcy5jcmVhdGVUZXh0dXJlKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVVc2FnZUJpdC5TQU1QTEVELFxyXG4gICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTgsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVGbGFnQml0LkdFTl9NSVBNQVAsXHJcbiAgICAgICAgKSkgYXMgV2ViR0xUZXh0dXJlO1xyXG5cclxuICAgICAgICB0aGlzLm51bGxUZXhDdWJlID0gdGhpcy5jcmVhdGVUZXh0dXJlKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVVc2FnZUJpdC5TQU1QTEVELFxyXG4gICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTgsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVGbGFnQml0LkNVQkVNQVAgfCAgR0ZYVGV4dHVyZUZsYWdCaXQuR0VOX01JUE1BUCxcclxuICAgICAgICAgICAgNixcclxuICAgICAgICApKSBhcyBXZWJHTFRleHR1cmU7XHJcblxyXG4gICAgICAgIGNvbnN0IG51bGxUZXhSZWdpb24gPSBuZXcgR0ZYQnVmZmVyVGV4dHVyZUNvcHkoKTtcclxuICAgICAgICBudWxsVGV4UmVnaW9uLnRleEV4dGVudC53aWR0aCA9IDI7XHJcbiAgICAgICAgbnVsbFRleFJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0ID0gMjtcclxuXHJcbiAgICAgICAgY29uc3QgbnVsbFRleEJ1ZmYgPSBuZXcgVWludDhBcnJheSh0aGlzLm51bGxUZXgyRC5zaXplKTtcclxuICAgICAgICBudWxsVGV4QnVmZi5maWxsKDApO1xyXG4gICAgICAgIHRoaXMuY29weUJ1ZmZlcnNUb1RleHR1cmUoW251bGxUZXhCdWZmXSwgdGhpcy5udWxsVGV4MkQsIFtudWxsVGV4UmVnaW9uXSk7XHJcblxyXG4gICAgICAgIG51bGxUZXhSZWdpb24udGV4U3VicmVzLmxheWVyQ291bnQgPSA2O1xyXG4gICAgICAgIHRoaXMuY29weUJ1ZmZlcnNUb1RleHR1cmUoXHJcbiAgICAgICAgICAgIFtudWxsVGV4QnVmZiwgbnVsbFRleEJ1ZmYsIG51bGxUZXhCdWZmLCBudWxsVGV4QnVmZiwgbnVsbFRleEJ1ZmYsIG51bGxUZXhCdWZmXSxcclxuICAgICAgICAgICAgdGhpcy5udWxsVGV4Q3ViZSwgW251bGxUZXhSZWdpb25dKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLl9jYW52YXMgJiYgdGhpcy5fd2ViR0xDb250ZXh0TG9zdEhhbmRsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fY2FudmFzLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRXZWJHTENvbnRleHRMb3N0LCB0aGlzLl93ZWJHTENvbnRleHRMb3N0SGFuZGxlcik7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlYkdMQ29udGV4dExvc3RIYW5kbGVyID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm51bGxUZXgyRCkge1xyXG4gICAgICAgICAgICB0aGlzLm51bGxUZXgyRC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMubnVsbFRleDJEID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm51bGxUZXhDdWJlKSB7XHJcbiAgICAgICAgICAgIHRoaXMubnVsbFRleEN1YmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLm51bGxUZXhDdWJlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9xdWV1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9xdWV1ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jbWRCdWZmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NtZEJ1ZmYuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jbWRCdWZmID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl93ZWJHTFJDID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVzaXplICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl93aWR0aCAhPT0gd2lkdGggfHwgdGhpcy5faGVpZ2h0ICE9PSBoZWlnaHQpIHtcclxuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdSZXNpemluZyBkZXZpY2U6ICcgKyB3aWR0aCArICd4JyArIGhlaWdodCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyEud2lkdGggPSB3aWR0aDtcclxuICAgICAgICAgICAgdGhpcy5fY2FudmFzIS5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3dpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX2hlaWdodCA9IGhlaWdodDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFjcXVpcmUgKCkge1xyXG4gICAgICAgIHRoaXMuY21kQWxsb2NhdG9yLnJlbGVhc2VDbWRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHByZXNlbnQgKCkge1xyXG4gICAgICAgIGNvbnN0IHF1ZXVlID0gKHRoaXMuX3F1ZXVlIGFzIFdlYkdMUXVldWUpO1xyXG4gICAgICAgIHRoaXMuX251bURyYXdDYWxscyA9IHF1ZXVlLm51bURyYXdDYWxscztcclxuICAgICAgICB0aGlzLl9udW1JbnN0YW5jZXMgPSBxdWV1ZS5udW1JbnN0YW5jZXM7XHJcbiAgICAgICAgdGhpcy5fbnVtVHJpcyA9IHF1ZXVlLm51bVRyaXM7XHJcbiAgICAgICAgcXVldWUuY2xlYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQ29tbWFuZEJ1ZmZlciAoaW5mbzogR0ZYQ29tbWFuZEJ1ZmZlckluZm8pOiBHRlhDb21tYW5kQnVmZmVyIHtcclxuICAgICAgICAvLyBjb25zdCBjdG9yID0gV2ViR0xDb21tYW5kQnVmZmVyOyAvLyBvcHQgdG8gaW5zdGFudCBpbnZvY2F0aW9uXHJcbiAgICAgICAgY29uc3QgY3RvciA9IGluZm8udHlwZSA9PT0gR0ZYQ29tbWFuZEJ1ZmZlclR5cGUuUFJJTUFSWSA/IFdlYkdMUHJpbWFyeUNvbW1hbmRCdWZmZXIgOiBXZWJHTENvbW1hbmRCdWZmZXI7XHJcbiAgICAgICAgY29uc3QgY21kQnVmZiA9IG5ldyBjdG9yKHRoaXMpO1xyXG4gICAgICAgIGNtZEJ1ZmYuaW5pdGlhbGl6ZShpbmZvKTtcclxuICAgICAgICByZXR1cm4gY21kQnVmZjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlQnVmZmVyIChpbmZvOiBHRlhCdWZmZXJJbmZvIHwgR0ZYQnVmZmVyVmlld0luZm8pOiBHRlhCdWZmZXIge1xyXG4gICAgICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXZWJHTEJ1ZmZlcih0aGlzKTtcclxuICAgICAgICBpZiAoYnVmZmVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVUZXh0dXJlIChpbmZvOiBHRlhUZXh0dXJlSW5mbyB8IEdGWFRleHR1cmVWaWV3SW5mbyk6IEdGWFRleHR1cmUge1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBuZXcgV2ViR0xUZXh0dXJlKHRoaXMpO1xyXG4gICAgICAgIGlmICh0ZXh0dXJlLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2FtcGxlciAoaW5mbzogR0ZYU2FtcGxlckluZm8pOiBHRlhTYW1wbGVyIHtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gbmV3IFdlYkdMU2FtcGxlcih0aGlzKTtcclxuICAgICAgICBpZiAoc2FtcGxlci5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBzYW1wbGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZURlc2NyaXB0b3JTZXQgKGluZm86IEdGWERlc2NyaXB0b3JTZXRJbmZvKTogR0ZYRGVzY3JpcHRvclNldCB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvclNldCA9IG5ldyBXZWJHTERlc2NyaXB0b3JTZXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGRlc2NyaXB0b3JTZXQuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvclNldDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVTaGFkZXIgKGluZm86IEdGWFNoYWRlckluZm8pOiBHRlhTaGFkZXIge1xyXG4gICAgICAgIGNvbnN0IHNoYWRlciA9IG5ldyBXZWJHTFNoYWRlcih0aGlzKTtcclxuICAgICAgICBpZiAoc2hhZGVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVJbnB1dEFzc2VtYmxlciAoaW5mbzogR0ZYSW5wdXRBc3NlbWJsZXJJbmZvKTogR0ZYSW5wdXRBc3NlbWJsZXIge1xyXG4gICAgICAgIGNvbnN0IGlucHV0QXNzZW1ibGVyID0gbmV3IFdlYkdMSW5wdXRBc3NlbWJsZXIodGhpcyk7XHJcbiAgICAgICAgaWYgKGlucHV0QXNzZW1ibGVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGlucHV0QXNzZW1ibGVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVJlbmRlclBhc3MgKGluZm86IEdGWFJlbmRlclBhc3NJbmZvKTogR0ZYUmVuZGVyUGFzcyB7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGFzcyA9IG5ldyBXZWJHTFJlbmRlclBhc3ModGhpcyk7XHJcbiAgICAgICAgaWYgKHJlbmRlclBhc3MuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVuZGVyUGFzcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVGcmFtZWJ1ZmZlciAoaW5mbzogR0ZYRnJhbWVidWZmZXJJbmZvKTogR0ZYRnJhbWVidWZmZXIge1xyXG4gICAgICAgIGNvbnN0IGZyYW1lYnVmZmVyID0gbmV3IFdlYkdMRnJhbWVidWZmZXIodGhpcyk7XHJcbiAgICAgICAgaWYgKGZyYW1lYnVmZmVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyYW1lYnVmZmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZURlc2NyaXB0b3JTZXRMYXlvdXQgKGluZm86IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvKTogR0ZYRGVzY3JpcHRvclNldExheW91dCB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvclNldExheW91dCA9IG5ldyBXZWJHTERlc2NyaXB0b3JTZXRMYXlvdXQodGhpcyk7XHJcbiAgICAgICAgaWYgKGRlc2NyaXB0b3JTZXRMYXlvdXQuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZGVzY3JpcHRvclNldExheW91dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVQaXBlbGluZUxheW91dCAoaW5mbzogR0ZYUGlwZWxpbmVMYXlvdXRJbmZvKTogR0ZYUGlwZWxpbmVMYXlvdXQge1xyXG4gICAgICAgIGNvbnN0IHBpcGVsaW5lTGF5b3V0ID0gbmV3IFdlYkdMUGlwZWxpbmVMYXlvdXQodGhpcyk7XHJcbiAgICAgICAgaWYgKHBpcGVsaW5lTGF5b3V0LmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBpcGVsaW5lTGF5b3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVBpcGVsaW5lU3RhdGUgKGluZm86IEdGWFBpcGVsaW5lU3RhdGVJbmZvKTogR0ZYUGlwZWxpbmVTdGF0ZSB7XHJcbiAgICAgICAgY29uc3QgcGlwZWxpbmVTdGF0ZSA9IG5ldyBXZWJHTFBpcGVsaW5lU3RhdGUodGhpcyk7XHJcbiAgICAgICAgaWYgKHBpcGVsaW5lU3RhdGUuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVGZW5jZSAoaW5mbzogR0ZYRmVuY2VJbmZvKTogR0ZYRmVuY2Uge1xyXG4gICAgICAgIGNvbnN0IGZlbmNlID0gbmV3IFdlYkdMRmVuY2UodGhpcyk7XHJcbiAgICAgICAgaWYgKGZlbmNlLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZlbmNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVF1ZXVlIChpbmZvOiBHRlhRdWV1ZUluZm8pOiBHRlhRdWV1ZSB7XHJcbiAgICAgICAgY29uc3QgcXVldWUgPSBuZXcgV2ViR0xRdWV1ZSh0aGlzKTtcclxuICAgICAgICBpZiAocXVldWUuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcXVldWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY29weUJ1ZmZlcnNUb1RleHR1cmUgKGJ1ZmZlcnM6IEFycmF5QnVmZmVyVmlld1tdLCB0ZXh0dXJlOiBHRlhUZXh0dXJlLCByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdKSB7XHJcbiAgICAgICAgV2ViR0xDbWRGdW5jQ29weUJ1ZmZlcnNUb1RleHR1cmUoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIGJ1ZmZlcnMsXHJcbiAgICAgICAgICAgICh0ZXh0dXJlIGFzIFdlYkdMVGV4dHVyZSkuZ3B1VGV4dHVyZSxcclxuICAgICAgICAgICAgcmVnaW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNvcHlUZXhJbWFnZXNUb1RleHR1cmUgKFxyXG4gICAgICAgIHRleEltYWdlczogVGV4SW1hZ2VTb3VyY2VbXSxcclxuICAgICAgICB0ZXh0dXJlOiBHRlhUZXh0dXJlLFxyXG4gICAgICAgIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuXHJcbiAgICAgICAgV2ViR0xDbWRGdW5jQ29weVRleEltYWdlc1RvVGV4dHVyZShcclxuICAgICAgICAgICAgdGhpcyxcclxuICAgICAgICAgICAgdGV4SW1hZ2VzLFxyXG4gICAgICAgICAgICAodGV4dHVyZSBhcyBXZWJHTFRleHR1cmUpLmdwdVRleHR1cmUsXHJcbiAgICAgICAgICAgIHJlZ2lvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5RnJhbWVidWZmZXJUb0J1ZmZlciAoXHJcbiAgICAgICAgc3JjRnJhbWVidWZmZXI6IEdGWEZyYW1lYnVmZmVyLFxyXG4gICAgICAgIGRzdEJ1ZmZlcjogQXJyYXlCdWZmZXIsXHJcbiAgICAgICAgcmVnaW9uczogR0ZYQnVmZmVyVGV4dHVyZUNvcHlbXSkge1xyXG5cclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuX3dlYkdMUkMgYXMgV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgICAgIGNvbnN0IGdwdUZyYW1lYnVmZmVyID0gKHNyY0ZyYW1lYnVmZmVyIGFzIFdlYkdMRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IGdwdUZyYW1lYnVmZmVyLmdwdUNvbG9yVGV4dHVyZXNbMF0uZm9ybWF0O1xyXG4gICAgICAgIGNvbnN0IGdsRm9ybWF0ID0gR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdChmb3JtYXQsIGdsKTtcclxuICAgICAgICBjb25zdCBnbFR5cGUgPSBHRlhGb3JtYXRUb1dlYkdMVHlwZShmb3JtYXQsIGdsKTtcclxuICAgICAgICBjb25zdCBjdG9yID0gZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yKEdGWEZvcm1hdEluZm9zW2Zvcm1hdF0pO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJGQk8gPSB0aGlzLnN0YXRlQ2FjaGUuZ2xGcmFtZWJ1ZmZlcjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyICE9PSBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyID0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgY3Rvcihkc3RCdWZmZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiByZWdpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3ID0gcmVnaW9uLnRleEV4dGVudC53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgaCA9IHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgZ2wucmVhZFBpeGVscyhyZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSwgdywgaCwgZ2xGb3JtYXQsIGdsVHlwZSwgdmlldyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIgIT09IGN1ckZCTykge1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGN1ckZCTyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyID0gY3VyRkJPO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxpdEZyYW1lYnVmZmVyIChzcmM6IEdGWEZyYW1lYnVmZmVyLCBkc3Q6IEdGWEZyYW1lYnVmZmVyLCBzcmNSZWN0OiBHRlhSZWN0LCBkc3RSZWN0OiBHRlhSZWN0LCBmaWx0ZXI6IEdGWEZpbHRlcikge1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0RXh0ZW5zaW9uIChleHQ6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgY29uc3QgcHJlZml4ZXMgPSBbJycsICdXRUJLSVRfJywgJ01PWl8nXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWZpeGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IF9leHQgPSB0aGlzLmdsLmdldEV4dGVuc2lvbihwcmVmaXhlc1tpXSArIGV4dCk7XHJcbiAgICAgICAgICAgIGlmIChfZXh0KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gX2V4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRTdGF0ZXMgKGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQpIHtcclxuXHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcbiAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuUEFDS19BTElHTk1FTlQsIDEpO1xyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19BTElHTk1FTlQsIDEpO1xyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIDApO1xyXG5cclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cclxuICAgICAgICAvLyByYXN0ZXJpYXplciBzdGF0ZVxyXG4gICAgICAgIGdsLmRpc2FibGUoZ2wuU0NJU1NPUl9URVNUKTtcclxuICAgICAgICBnbC5lbmFibGUoZ2wuQ1VMTF9GQUNFKTtcclxuICAgICAgICBnbC5jdWxsRmFjZShnbC5CQUNLKTtcclxuICAgICAgICBnbC5mcm9udEZhY2UoZ2wuQ0NXKTtcclxuICAgICAgICBnbC5kaXNhYmxlKGdsLlBPTFlHT05fT0ZGU0VUX0ZJTEwpO1xyXG4gICAgICAgIGdsLnBvbHlnb25PZmZzZXQoMC4wLCAwLjApO1xyXG5cclxuICAgICAgICAvLyBkZXB0aCBzdGVuY2lsIHN0YXRlXHJcbiAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgIGdsLmRlcHRoTWFzayh0cnVlKTtcclxuICAgICAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVTUyk7XHJcbiAgICAgICAgZ2wuZGVwdGhSYW5nZSgwLjAsIDEuMCk7XHJcblxyXG4gICAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoZ2wuRlJPTlQsIGdsLkFMV0FZUywgMSwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5GUk9OVCwgZ2wuS0VFUCwgZ2wuS0VFUCwgZ2wuS0VFUCk7XHJcbiAgICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5GUk9OVCwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGdsLkJBQ0ssIGdsLkFMV0FZUywgMSwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5CQUNLLCBnbC5LRUVQLCBnbC5LRUVQLCBnbC5LRUVQKTtcclxuICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIDB4ZmZmZik7XHJcblxyXG4gICAgICAgIGdsLmRpc2FibGUoZ2wuU1RFTkNJTF9URVNUKTtcclxuXHJcbiAgICAgICAgLy8gYmxlbmQgc3RhdGVcclxuICAgICAgICBnbC5kaXNhYmxlKGdsLlNBTVBMRV9BTFBIQV9UT19DT1ZFUkFHRSk7XHJcbiAgICAgICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XHJcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKGdsLkZVTkNfQURELCBnbC5GVU5DX0FERCk7XHJcbiAgICAgICAgZ2wuYmxlbmRGdW5jU2VwYXJhdGUoZ2wuT05FLCBnbC5aRVJPLCBnbC5PTkUsIGdsLlpFUk8pO1xyXG4gICAgICAgIGdsLmNvbG9yTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICBnbC5ibGVuZENvbG9yKDAuMCwgMC4wLCAwLjAsIDAuMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25XZWJHTENvbnRleHRMb3N0IChldmVudDogRXZlbnQpIHtcclxuICAgICAgICB3YXJuSUQoMTEwMDApO1xyXG4gICAgICAgIHdhcm4oZXZlbnQpO1xyXG4gICAgICAgIC8vIDIwMjAuOS4zOiBgcHJldmVudERlZmF1bHRgIGlzIG5vdCBhdmFpbGFibGUgb24gc29tZSBwbGF0Zm9ybXNcclxuICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==