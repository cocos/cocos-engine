(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../platform/index.js", "../command-buffer.js", "../device.js", "../queue.js", "../texture.js", "./webgl2-descriptor-set.js", "./webgl2-buffer.js", "./webgl2-command-allocator.js", "./webgl2-command-buffer.js", "./webgl2-fence.js", "./webgl2-framebuffer.js", "./webgl2-input-assembler.js", "./webgl2-descriptor-set-layout.js", "./webgl2-pipeline-layout.js", "./webgl2-pipeline-state.js", "./webgl2-primary-command-buffer.js", "./webgl2-queue.js", "./webgl2-render-pass.js", "./webgl2-sampler.js", "./webgl2-shader.js", "./webgl2-state-cache.js", "./webgl2-texture.js", "../define.js", "./webgl2-commands.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../platform/index.js"), require("../command-buffer.js"), require("../device.js"), require("../queue.js"), require("../texture.js"), require("./webgl2-descriptor-set.js"), require("./webgl2-buffer.js"), require("./webgl2-command-allocator.js"), require("./webgl2-command-buffer.js"), require("./webgl2-fence.js"), require("./webgl2-framebuffer.js"), require("./webgl2-input-assembler.js"), require("./webgl2-descriptor-set-layout.js"), require("./webgl2-pipeline-layout.js"), require("./webgl2-pipeline-state.js"), require("./webgl2-primary-command-buffer.js"), require("./webgl2-queue.js"), require("./webgl2-render-pass.js"), require("./webgl2-sampler.js"), require("./webgl2-shader.js"), require("./webgl2-state-cache.js"), require("./webgl2-texture.js"), require("../define.js"), require("./webgl2-commands.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.commandBuffer, global.device, global.queue, global.texture, global.webgl2DescriptorSet, global.webgl2Buffer, global.webgl2CommandAllocator, global.webgl2CommandBuffer, global.webgl2Fence, global.webgl2Framebuffer, global.webgl2InputAssembler, global.webgl2DescriptorSetLayout, global.webgl2PipelineLayout, global.webgl2PipelineState, global.webgl2PrimaryCommandBuffer, global.webgl2Queue, global.webgl2RenderPass, global.webgl2Sampler, global.webgl2Shader, global.webgl2StateCache, global.webgl2Texture, global.define, global.webgl2Commands);
    global.webgl2Device = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _commandBuffer, _device, _queue, _texture, _webgl2DescriptorSet, _webgl2Buffer, _webgl2CommandAllocator, _webgl2CommandBuffer, _webgl2Fence, _webgl2Framebuffer, _webgl2InputAssembler, _webgl2DescriptorSetLayout, _webgl2PipelineLayout, _webgl2PipelineState, _webgl2PrimaryCommandBuffer, _webgl2Queue, _webgl2RenderPass, _webgl2Sampler, _webgl2Shader, _webgl2StateCache, _webgl2Texture, _define, _webgl2Commands) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.WebGL2Device = void 0;

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

  var WebGL2Device = /*#__PURE__*/function (_GFXDevice) {
    _inherits(WebGL2Device, _GFXDevice);

    function WebGL2Device() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WebGL2Device);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebGL2Device)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.stateCache = new _webgl2StateCache.WebGL2StateCache();
      _this.cmdAllocator = new _webgl2CommandAllocator.WebGL2CommandAllocator();
      _this.nullTex2D = null;
      _this.nullTexCube = null;
      _this._webGL2RC = null;
      _this._isAntialias = true;
      _this._isPremultipliedAlpha = true;
      _this._useVAO = true;
      _this._bindingMappingInfo = new _device.GFXBindingMappingInfo();
      _this._webGLContextLostHandler = null;
      _this._extensions = null;
      _this._EXT_texture_filter_anisotropic = null;
      _this._OES_texture_float_linear = null;
      _this._OES_texture_half_float_linear = null;
      _this._EXT_color_buffer_float = null;
      _this._EXT_disjoint_timer_query_webgl2 = null;
      _this._WEBGL_compressed_texture_etc1 = null;
      _this._WEBGL_compressed_texture_etc = null;
      _this._WEBGL_compressed_texture_pvrtc = null;
      _this._WEBGL_compressed_texture_astc = null;
      _this._WEBGL_compressed_texture_s3tc = null;
      _this._WEBGL_compressed_texture_s3tc_srgb = null;
      _this._WEBGL_debug_renderer_info = null;
      _this._WEBGL_texture_storage_multisample = null;
      _this._WEBGL_debug_shaders = null;
      _this._WEBGL_lose_context = null;
      return _this;
    }

    _createClass(WebGL2Device, [{
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
          this._webGL2RC = this._canvas.getContext('webgl2', webGLCtxAttribs);
        } catch (err) {
          console.warn(err);
          return false;
        }

        if (!this._webGL2RC) {
          console.warn('This device does not support WebGL2.');
          return false;
        }

        this._webGLContextLostHandler = this._onWebGLContextLost.bind(this);

        this._canvas.addEventListener(eventWebGLContextLost, this._onWebGLContextLost);

        this._canvas2D = document.createElement('canvas');
        console.info('WebGL2 device initialized.');
        this._gfxAPI = _device.GFXAPI.WEBGL2;
        this._deviceName = 'WebGL2';
        var gl = this._webGL2RC;
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
        this._maxUniformBufferBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        this._maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._uboOffsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
        this._depthBits = gl.getParameter(gl.DEPTH_BITS);
        this._stencilBits = gl.getParameter(gl.STENCIL_BITS); // let maxVertexUniformBlocks = gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS);
        // let maxFragmentUniformBlocks = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS);

        this.stateCache.initialize(this._maxTextureUnits, this._maxUniformBufferBindings, this._maxVertexAttributes);
        this._devicePixelRatio = info.devicePixelRatio || 1.0;
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._nativeWidth = Math.max(info.nativeWidth || this._width, 0);
        this._nativeHeight = Math.max(info.nativeHeight || this._height, 0);
        this._colorFmt = _define.GFXFormat.RGBA8;

        if (this._depthBits === 32) {
          if (this._stencilBits === 8) {
            this._depthStencilFmt = _define.GFXFormat.D32F_S8;
          } else {
            this._depthStencilFmt = _define.GFXFormat.D32F;
          }
        } else if (this._depthBits === 24) {
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
        this._EXT_color_buffer_float = this.getExtension('EXT_color_buffer_float');
        this._EXT_disjoint_timer_query_webgl2 = this.getExtension('EXT_disjoint_timer_query_webgl2');
        this._OES_texture_float_linear = this.getExtension('OES_texture_float_linear');
        this._OES_texture_half_float_linear = this.getExtension('OES_texture_half_float_linear');
        this._WEBGL_compressed_texture_etc1 = this.getExtension('WEBGL_compressed_texture_etc1');
        this._WEBGL_compressed_texture_etc = this.getExtension('WEBGL_compressed_texture_etc');
        this._WEBGL_compressed_texture_pvrtc = this.getExtension('WEBGL_compressed_texture_pvrtc');
        this._WEBGL_compressed_texture_astc = this.getExtension('WEBGL_compressed_texture_astc');
        this._WEBGL_compressed_texture_s3tc = this.getExtension('WEBGL_compressed_texture_s3tc');
        this._WEBGL_compressed_texture_s3tc_srgb = this.getExtension('WEBGL_compressed_texture_s3tc_srgb');
        this._WEBGL_texture_storage_multisample = this.getExtension('WEBGL_texture_storage_multisample');
        this._WEBGL_debug_shaders = this.getExtension('WEBGL_debug_shaders');
        this._WEBGL_lose_context = this.getExtension('WEBGL_lose_context');

        this._features.fill(false);

        this._features[_device.GFXFeature.TEXTURE_FLOAT] = true;
        this._features[_device.GFXFeature.TEXTURE_HALF_FLOAT] = true;
        this._features[_device.GFXFeature.FORMAT_R11G11B10F] = true;
        this._features[_device.GFXFeature.FORMAT_RGB8] = true;
        this._features[_device.GFXFeature.FORMAT_D16] = true;
        this._features[_device.GFXFeature.FORMAT_D24] = true;
        this._features[_device.GFXFeature.FORMAT_D32F] = true;
        this._features[_device.GFXFeature.FORMAT_D24S8] = true;
        this._features[_device.GFXFeature.FORMAT_D32FS8] = true;
        this._features[_device.GFXFeature.MSAA] = true;
        this._features[_device.GFXFeature.ELEMENT_INDEX_UINT] = true;
        this._features[_device.GFXFeature.INSTANCED_ARRAYS] = true;

        if (this._EXT_color_buffer_float) {
          this._features[_device.GFXFeature.COLOR_FLOAT] = true;
          this._features[_device.GFXFeature.COLOR_HALF_FLOAT] = true;
        }

        if (this._OES_texture_float_linear) {
          this._features[_device.GFXFeature.TEXTURE_FLOAT_LINEAR] = true;
        }

        if (this._OES_texture_half_float_linear) {
          this._features[_device.GFXFeature.TEXTURE_HALF_FLOAT_LINEAR] = true;
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

        console.info('RENDERER: ' + this._renderer);
        console.info('VENDOR: ' + this._vendor);
        console.info('VERSION: ' + this._version);
        console.info('DPR: ' + this._devicePixelRatio);
        console.info('SCREEN_SIZE: ' + this._width + ' x ' + this._height);
        console.info('NATIVE_SIZE: ' + this._nativeWidth + ' x ' + this._nativeHeight);
        console.info('MAX_VERTEX_ATTRIBS: ' + this._maxVertexAttributes);
        console.info('MAX_VERTEX_UNIFORM_VECTORS: ' + this._maxVertexUniformVectors);
        console.info('MAX_FRAGMENT_UNIFORM_VECTORS: ' + this._maxFragmentUniformVectors);
        console.info('MAX_TEXTURE_IMAGE_UNITS: ' + this._maxTextureUnits);
        console.info('MAX_VERTEX_TEXTURE_IMAGE_UNITS: ' + this._maxVertexTextureUnits);
        console.info('MAX_UNIFORM_BUFFER_BINDINGS: ' + this._maxUniformBufferBindings);
        console.info('MAX_UNIFORM_BLOCK_SIZE: ' + this._maxUniformBlockSize);
        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);
        console.info('UNIFORM_BUFFER_OFFSET_ALIGNMENT: ' + this._uboOffsetAlignment);

        if (this._EXT_texture_filter_anisotropic) {
          console.info('MAX_TEXTURE_MAX_ANISOTROPY_EXT: ' + this._EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }

        console.info('USE_VAO: ' + this._useVAO);
        console.info('COMPRESSED_FORMAT: ' + compressedFormat); // init states

        this.initStates(gl); // create queue

        this._queue = this.createQueue(new _queue.GFXQueueInfo(_define.GFXQueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new _commandBuffer.GFXCommandBufferInfo(this._queue)); // create default null texture

        this.nullTex2D = this.createTexture(new _texture.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.SAMPLED, _define.GFXFormat.RGBA8, 2, 2, _define.GFXTextureFlagBit.GEN_MIPMAP));
        this.nullTexCube = new _webgl2Texture.WebGL2Texture(this);
        this.nullTexCube.initialize(new _texture.GFXTextureInfo(_define.GFXTextureType.TEX2D, _define.GFXTextureUsageBit.SAMPLED, _define.GFXFormat.RGBA8, 2, 2, _define.GFXTextureFlagBit.CUBEMAP | _define.GFXTextureFlagBit.GEN_MIPMAP, 6));
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
        } // for (let i = 0; i < this._primaries.length; i++) {
        //     this._primaries[i].destroy();
        // }
        // this._nextPrimary = this._primaries.length = 0;
        // for (let i = 0; i < this._secondaries.length; i++) {
        //     this._secondaries[i].destroy();
        // }
        // this._nextSecondary = this._secondaries.length = 0;


        if (this._queue) {
          this._queue.destroy();

          this._queue = null;
        }

        if (this._cmdBuff) {
          this._cmdBuff.destroy();

          this._cmdBuff = null;
        }

        this._extensions = null;
        this._webGL2RC = null;
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
        var ctor = info.type === _define.GFXCommandBufferType.PRIMARY ? _webgl2PrimaryCommandBuffer.WebGL2PrimaryCommandBuffer : _webgl2CommandBuffer.WebGL2CommandBuffer;
        var cmdBuff = new ctor(this);

        if (cmdBuff.initialize(info)) {
          return cmdBuff;
        }

        return null;
      }
    }, {
      key: "createBuffer",
      value: function createBuffer(info) {
        var buffer = new _webgl2Buffer.WebGL2Buffer(this);

        if (buffer.initialize(info)) {
          return buffer;
        }

        return null;
      }
    }, {
      key: "createTexture",
      value: function createTexture(info) {
        var texture = new _webgl2Texture.WebGL2Texture(this);

        if (texture.initialize(info)) {
          return texture;
        }

        return null;
      }
    }, {
      key: "createSampler",
      value: function createSampler(info) {
        var sampler = new _webgl2Sampler.WebGL2Sampler(this);

        if (sampler.initialize(info)) {
          return sampler;
        }

        return null;
      }
    }, {
      key: "createDescriptorSet",
      value: function createDescriptorSet(info) {
        var descriptorSet = new _webgl2DescriptorSet.WebGL2DescriptorSet(this);

        if (descriptorSet.initialize(info)) {
          return descriptorSet;
        }

        return null;
      }
    }, {
      key: "createShader",
      value: function createShader(info) {
        var shader = new _webgl2Shader.WebGL2Shader(this);

        if (shader.initialize(info)) {
          return shader;
        }

        return null;
      }
    }, {
      key: "createInputAssembler",
      value: function createInputAssembler(info) {
        var inputAssembler = new _webgl2InputAssembler.WebGL2InputAssembler(this);

        if (inputAssembler.initialize(info)) {
          return inputAssembler;
        }

        return null;
      }
    }, {
      key: "createRenderPass",
      value: function createRenderPass(info) {
        var renderPass = new _webgl2RenderPass.WebGL2RenderPass(this);

        if (renderPass.initialize(info)) {
          return renderPass;
        }

        return null;
      }
    }, {
      key: "createFramebuffer",
      value: function createFramebuffer(info) {
        var framebuffer = new _webgl2Framebuffer.WebGL2Framebuffer(this);

        if (framebuffer.initialize(info)) {
          return framebuffer;
        }

        return null;
      }
    }, {
      key: "createDescriptorSetLayout",
      value: function createDescriptorSetLayout(info) {
        var descriptorSetLayout = new _webgl2DescriptorSetLayout.WebGL2DescriptorSetLayout(this);

        if (descriptorSetLayout.initialize(info)) {
          return descriptorSetLayout;
        }

        return null;
      }
    }, {
      key: "createPipelineLayout",
      value: function createPipelineLayout(info) {
        var pipelineLayout = new _webgl2PipelineLayout.WebGL2PipelineLayout(this);

        if (pipelineLayout.initialize(info)) {
          return pipelineLayout;
        }

        return null;
      }
    }, {
      key: "createPipelineState",
      value: function createPipelineState(info) {
        var pipelineState = new _webgl2PipelineState.WebGL2PipelineState(this);

        if (pipelineState.initialize(info)) {
          return pipelineState;
        }

        return null;
      }
    }, {
      key: "createFence",
      value: function createFence(info) {
        var fence = new _webgl2Fence.WebGL2Fence(this);

        if (fence.initialize(info)) {
          return fence;
        }

        return null;
      }
    }, {
      key: "createQueue",
      value: function createQueue(info) {
        var queue = new _webgl2Queue.WebGL2Queue(this);

        if (queue.initialize(info)) {
          return queue;
        }

        return null;
      }
    }, {
      key: "copyBuffersToTexture",
      value: function copyBuffersToTexture(buffers, texture, regions) {
        (0, _webgl2Commands.WebGL2CmdFuncCopyBuffersToTexture)(this, buffers, texture.gpuTexture, regions);
      }
    }, {
      key: "copyTexImagesToTexture",
      value: function copyTexImagesToTexture(texImages, texture, regions) {
        (0, _webgl2Commands.WebGL2CmdFuncCopyTexImagesToTexture)(this, texImages, texture.gpuTexture, regions);
      }
    }, {
      key: "copyFramebufferToBuffer",
      value: function copyFramebufferToBuffer(srcFramebuffer, dstBuffer, regions) {
        var gl = this._webGL2RC;
        var gpuFramebuffer = srcFramebuffer.gpuFramebuffer;
        var format = gpuFramebuffer.gpuColorTextures[0].format;
        var glFormat = (0, _webgl2Commands.GFXFormatToWebGLFormat)(format, gl);
        var glType = (0, _webgl2Commands.GFXFormatToWebGLType)(format, gl);
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
      value: function blitFramebuffer(src, dst, srcRect, dstRect, filter) {
        var srcFBO = src.gpuFramebuffer;
        var dstFBO = dst.gpuFramebuffer;
        (0, _webgl2Commands.WebGL2CmdFuncBlitFramebuffer)(this, srcFBO, dstFBO, srcRect, dstRect, filter);
      }
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

        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.polygonOffset(0.0, 0.0); // depth stencil state

        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LESS);
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
        return this._webGL2RC;
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
      key: "OES_texture_float_linear",
      get: function get() {
        return this._OES_texture_float_linear;
      }
    }, {
      key: "EXT_color_buffer_float",
      get: function get() {
        return this._EXT_color_buffer_float;
      }
    }, {
      key: "EXT_disjoint_timer_query_webgl2",
      get: function get() {
        return this._EXT_disjoint_timer_query_webgl2;
      }
    }, {
      key: "WEBGL_compressed_texture_etc1",
      get: function get() {
        return this._WEBGL_compressed_texture_etc1;
      }
    }, {
      key: "WEBGL_compressed_texture_etc",
      get: function get() {
        return this._WEBGL_compressed_texture_etc;
      }
    }, {
      key: "WEBGL_compressed_texture_pvrtc",
      get: function get() {
        return this._WEBGL_compressed_texture_pvrtc;
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
      key: "WEBGL_texture_storage_multisample",
      get: function get() {
        return this._WEBGL_texture_storage_multisample;
      }
    }, {
      key: "WEBGL_debug_shaders",
      get: function get() {
        return this._WEBGL_debug_shaders;
      }
    }, {
      key: "WEBGL_lose_context",
      get: function get() {
        return this._WEBGL_lose_context;
      }
    }]);

    return WebGL2Device;
  }(_device.GFXDevice);

  _exports.WebGL2Device = WebGL2Device;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2Z4L3dlYmdsMi93ZWJnbDItZGV2aWNlLnRzIl0sIm5hbWVzIjpbImV2ZW50V2ViR0xDb250ZXh0TG9zdCIsIldlYkdMMkRldmljZSIsInN0YXRlQ2FjaGUiLCJXZWJHTDJTdGF0ZUNhY2hlIiwiY21kQWxsb2NhdG9yIiwiV2ViR0wyQ29tbWFuZEFsbG9jYXRvciIsIm51bGxUZXgyRCIsIm51bGxUZXhDdWJlIiwiX3dlYkdMMlJDIiwiX2lzQW50aWFsaWFzIiwiX2lzUHJlbXVsdGlwbGllZEFscGhhIiwiX3VzZVZBTyIsIl9iaW5kaW5nTWFwcGluZ0luZm8iLCJHRlhCaW5kaW5nTWFwcGluZ0luZm8iLCJfd2ViR0xDb250ZXh0TG9zdEhhbmRsZXIiLCJfZXh0ZW5zaW9ucyIsIl9FWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMiLCJfT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyIiwiX09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyIiwiX0VYVF9jb2xvcl9idWZmZXJfZmxvYXQiLCJfRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMiIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjMSIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjIiwiX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfYXN0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YyIsIl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Y19zcmdiIiwiX1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8iLCJfV0VCR0xfdGV4dHVyZV9zdG9yYWdlX211bHRpc2FtcGxlIiwiX1dFQkdMX2RlYnVnX3NoYWRlcnMiLCJfV0VCR0xfbG9zZV9jb250ZXh0IiwiaW5mbyIsIl9jYW52YXMiLCJjYW52YXNFbG0iLCJpc0FudGlhbGlhcyIsImlzUHJlbXVsdGlwbGllZEFscGhhIiwiYmluZGluZ01hcHBpbmdJbmZvIiwiYnVmZmVyT2Zmc2V0cyIsImxlbmd0aCIsInB1c2giLCJzYW1wbGVyT2Zmc2V0cyIsIndlYkdMQ3R4QXR0cmlicyIsImFscGhhIiwibWFjcm8iLCJFTkFCTEVfVFJBTlNQQVJFTlRfQ0FOVkFTIiwiYW50aWFsaWFzIiwiZGVwdGgiLCJzdGVuY2lsIiwicHJlbXVsdGlwbGllZEFscGhhIiwicHJlc2VydmVEcmF3aW5nQnVmZmVyIiwicG93ZXJQcmVmZXJlbmNlIiwiZmFpbElmTWFqb3JQZXJmb3JtYW5jZUNhdmVhdCIsImdldENvbnRleHQiLCJlcnIiLCJjb25zb2xlIiwid2FybiIsIl9vbldlYkdMQ29udGV4dExvc3QiLCJiaW5kIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9jYW52YXMyRCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIl9nZnhBUEkiLCJHRlhBUEkiLCJXRUJHTDIiLCJfZGV2aWNlTmFtZSIsImdsIiwiZ2V0RXh0ZW5zaW9uIiwiX3JlbmRlcmVyIiwiZ2V0UGFyYW1ldGVyIiwiVU5NQVNLRURfUkVOREVSRVJfV0VCR0wiLCJfdmVuZG9yIiwiVU5NQVNLRURfVkVORE9SX1dFQkdMIiwiUkVOREVSRVIiLCJWRU5ET1IiLCJfdmVyc2lvbiIsIlZFUlNJT04iLCJfbWF4VmVydGV4QXR0cmlidXRlcyIsIk1BWF9WRVJURVhfQVRUUklCUyIsIl9tYXhWZXJ0ZXhVbmlmb3JtVmVjdG9ycyIsIk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTIiwiX21heEZyYWdtZW50VW5pZm9ybVZlY3RvcnMiLCJNQVhfRlJBR01FTlRfVU5JRk9STV9WRUNUT1JTIiwiX21heFRleHR1cmVVbml0cyIsIk1BWF9URVhUVVJFX0lNQUdFX1VOSVRTIiwiX21heFZlcnRleFRleHR1cmVVbml0cyIsIk1BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUyIsIl9tYXhVbmlmb3JtQnVmZmVyQmluZGluZ3MiLCJNQVhfVU5JRk9STV9CVUZGRVJfQklORElOR1MiLCJfbWF4VW5pZm9ybUJsb2NrU2l6ZSIsIk1BWF9VTklGT1JNX0JMT0NLX1NJWkUiLCJfbWF4VGV4dHVyZVNpemUiLCJNQVhfVEVYVFVSRV9TSVpFIiwiX21heEN1YmVNYXBUZXh0dXJlU2l6ZSIsIk1BWF9DVUJFX01BUF9URVhUVVJFX1NJWkUiLCJfdWJvT2Zmc2V0QWxpZ25tZW50IiwiVU5JRk9STV9CVUZGRVJfT0ZGU0VUX0FMSUdOTUVOVCIsIl9kZXB0aEJpdHMiLCJERVBUSF9CSVRTIiwiX3N0ZW5jaWxCaXRzIiwiU1RFTkNJTF9CSVRTIiwiaW5pdGlhbGl6ZSIsIl9kZXZpY2VQaXhlbFJhdGlvIiwiZGV2aWNlUGl4ZWxSYXRpbyIsIl93aWR0aCIsIndpZHRoIiwiX2hlaWdodCIsImhlaWdodCIsIl9uYXRpdmVXaWR0aCIsIk1hdGgiLCJtYXgiLCJuYXRpdmVXaWR0aCIsIl9uYXRpdmVIZWlnaHQiLCJuYXRpdmVIZWlnaHQiLCJfY29sb3JGbXQiLCJHRlhGb3JtYXQiLCJSR0JBOCIsIl9kZXB0aFN0ZW5jaWxGbXQiLCJEMzJGX1M4IiwiRDMyRiIsIkQyNFM4IiwiRDI0IiwiRDE2UzgiLCJEMTYiLCJnZXRTdXBwb3J0ZWRFeHRlbnNpb25zIiwiZXh0ZW5zaW9ucyIsImV4dCIsImRlYnVnIiwiX2ZlYXR1cmVzIiwiZmlsbCIsIkdGWEZlYXR1cmUiLCJURVhUVVJFX0ZMT0FUIiwiVEVYVFVSRV9IQUxGX0ZMT0FUIiwiRk9STUFUX1IxMUcxMUIxMEYiLCJGT1JNQVRfUkdCOCIsIkZPUk1BVF9EMTYiLCJGT1JNQVRfRDI0IiwiRk9STUFUX0QzMkYiLCJGT1JNQVRfRDI0UzgiLCJGT1JNQVRfRDMyRlM4IiwiTVNBQSIsIkVMRU1FTlRfSU5ERVhfVUlOVCIsIklOU1RBTkNFRF9BUlJBWVMiLCJDT0xPUl9GTE9BVCIsIkNPTE9SX0hBTEZfRkxPQVQiLCJURVhUVVJFX0ZMT0FUX0xJTkVBUiIsIlRFWFRVUkVfSEFMRl9GTE9BVF9MSU5FQVIiLCJjb21wcmVzc2VkRm9ybWF0IiwiRk9STUFUX0VUQzEiLCJGT1JNQVRfRVRDMiIsIkZPUk1BVF9EWFQiLCJGT1JNQVRfUFZSVEMiLCJGT1JNQVRfQVNUQyIsIk1BWF9URVhUVVJFX01BWF9BTklTT1RST1BZX0VYVCIsImluaXRTdGF0ZXMiLCJfcXVldWUiLCJjcmVhdGVRdWV1ZSIsIkdGWFF1ZXVlSW5mbyIsIkdGWFF1ZXVlVHlwZSIsIkdSQVBISUNTIiwiX2NtZEJ1ZmYiLCJjcmVhdGVDb21tYW5kQnVmZmVyIiwiR0ZYQ29tbWFuZEJ1ZmZlckluZm8iLCJjcmVhdGVUZXh0dXJlIiwiR0ZYVGV4dHVyZUluZm8iLCJHRlhUZXh0dXJlVHlwZSIsIlRFWDJEIiwiR0ZYVGV4dHVyZVVzYWdlQml0IiwiU0FNUExFRCIsIkdGWFRleHR1cmVGbGFnQml0IiwiR0VOX01JUE1BUCIsIldlYkdMMlRleHR1cmUiLCJDVUJFTUFQIiwibnVsbFRleFJlZ2lvbiIsIkdGWEJ1ZmZlclRleHR1cmVDb3B5IiwidGV4RXh0ZW50IiwibnVsbFRleEJ1ZmYiLCJVaW50OEFycmF5Iiwic2l6ZSIsImNvcHlCdWZmZXJzVG9UZXh0dXJlIiwidGV4U3VicmVzIiwibGF5ZXJDb3VudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXN0cm95IiwicmVsZWFzZUNtZHMiLCJxdWV1ZSIsIl9udW1EcmF3Q2FsbHMiLCJudW1EcmF3Q2FsbHMiLCJfbnVtSW5zdGFuY2VzIiwibnVtSW5zdGFuY2VzIiwiX251bVRyaXMiLCJudW1UcmlzIiwiY2xlYXIiLCJjdG9yIiwidHlwZSIsIkdGWENvbW1hbmRCdWZmZXJUeXBlIiwiUFJJTUFSWSIsIldlYkdMMlByaW1hcnlDb21tYW5kQnVmZmVyIiwiV2ViR0wyQ29tbWFuZEJ1ZmZlciIsImNtZEJ1ZmYiLCJidWZmZXIiLCJXZWJHTDJCdWZmZXIiLCJ0ZXh0dXJlIiwic2FtcGxlciIsIldlYkdMMlNhbXBsZXIiLCJkZXNjcmlwdG9yU2V0IiwiV2ViR0wyRGVzY3JpcHRvclNldCIsInNoYWRlciIsIldlYkdMMlNoYWRlciIsImlucHV0QXNzZW1ibGVyIiwiV2ViR0wySW5wdXRBc3NlbWJsZXIiLCJyZW5kZXJQYXNzIiwiV2ViR0wyUmVuZGVyUGFzcyIsImZyYW1lYnVmZmVyIiwiV2ViR0wyRnJhbWVidWZmZXIiLCJkZXNjcmlwdG9yU2V0TGF5b3V0IiwiV2ViR0wyRGVzY3JpcHRvclNldExheW91dCIsInBpcGVsaW5lTGF5b3V0IiwiV2ViR0wyUGlwZWxpbmVMYXlvdXQiLCJwaXBlbGluZVN0YXRlIiwiV2ViR0wyUGlwZWxpbmVTdGF0ZSIsImZlbmNlIiwiV2ViR0wyRmVuY2UiLCJXZWJHTDJRdWV1ZSIsImJ1ZmZlcnMiLCJyZWdpb25zIiwiZ3B1VGV4dHVyZSIsInRleEltYWdlcyIsInNyY0ZyYW1lYnVmZmVyIiwiZHN0QnVmZmVyIiwiZ3B1RnJhbWVidWZmZXIiLCJmb3JtYXQiLCJncHVDb2xvclRleHR1cmVzIiwiZ2xGb3JtYXQiLCJnbFR5cGUiLCJHRlhGb3JtYXRJbmZvcyIsImN1ckZCTyIsImdsRnJhbWVidWZmZXIiLCJiaW5kRnJhbWVidWZmZXIiLCJGUkFNRUJVRkZFUiIsInZpZXciLCJyZWdpb24iLCJ3IiwiaCIsInJlYWRQaXhlbHMiLCJ0ZXhPZmZzZXQiLCJ4IiwieSIsInNyYyIsImRzdCIsInNyY1JlY3QiLCJkc3RSZWN0IiwiZmlsdGVyIiwic3JjRkJPIiwiZHN0RkJPIiwicHJlZml4ZXMiLCJpIiwiX2V4dCIsImFjdGl2ZVRleHR1cmUiLCJURVhUVVJFMCIsInBpeGVsU3RvcmVpIiwiUEFDS19BTElHTk1FTlQiLCJVTlBBQ0tfQUxJR05NRU5UIiwiVU5QQUNLX0ZMSVBfWV9XRUJHTCIsImVuYWJsZSIsIkNVTExfRkFDRSIsImN1bGxGYWNlIiwiQkFDSyIsImZyb250RmFjZSIsIkNDVyIsInBvbHlnb25PZmZzZXQiLCJERVBUSF9URVNUIiwiZGVwdGhNYXNrIiwiZGVwdGhGdW5jIiwiTEVTUyIsInN0ZW5jaWxGdW5jU2VwYXJhdGUiLCJGUk9OVCIsIkFMV0FZUyIsInN0ZW5jaWxPcFNlcGFyYXRlIiwiS0VFUCIsInN0ZW5jaWxNYXNrU2VwYXJhdGUiLCJkaXNhYmxlIiwiU1RFTkNJTF9URVNUIiwiU0FNUExFX0FMUEhBX1RPX0NPVkVSQUdFIiwiQkxFTkQiLCJibGVuZEVxdWF0aW9uU2VwYXJhdGUiLCJGVU5DX0FERCIsImJsZW5kRnVuY1NlcGFyYXRlIiwiT05FIiwiWkVSTyIsImNvbG9yTWFzayIsImJsZW5kQ29sb3IiLCJldmVudCIsIkdGWERldmljZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQ0EsTUFBTUEscUJBQXFCLEdBQUcsa0JBQTlCOztNQUVhQyxZOzs7Ozs7Ozs7Ozs7Ozs7WUFzRUZDLFUsR0FBK0IsSUFBSUMsa0NBQUosRTtZQUMvQkMsWSxHQUF1QyxJQUFJQyw4Q0FBSixFO1lBQ3ZDQyxTLEdBQWtDLEk7WUFDbENDLFcsR0FBb0MsSTtZQUVuQ0MsUyxHQUEyQyxJO1lBQzNDQyxZLEdBQXdCLEk7WUFDeEJDLHFCLEdBQWlDLEk7WUFDakNDLE8sR0FBbUIsSTtZQUNuQkMsbUIsR0FBNkMsSUFBSUMsNkJBQUosRTtZQUM3Q0Msd0IsR0FBNEQsSTtZQUU1REMsVyxHQUErQixJO1lBQy9CQywrQixHQUF5RSxJO1lBQ3pFQyx5QixHQUE2RCxJO1lBQzdEQyw4QixHQUF1RSxJO1lBQ3ZFQyx1QixHQUF5RCxJO1lBQ3pEQyxnQyxHQUEyRSxJO1lBQzNFQyw4QixHQUF1RSxJO1lBQ3ZFQyw2QixHQUFxRSxJO1lBQ3JFQywrQixHQUF5RSxJO1lBQ3pFQyw4QixHQUF1RSxJO1lBQ3ZFQyw4QixHQUF1RSxJO1lBQ3ZFQyxtQyxHQUFpRixJO1lBQ2pGQywwQixHQUErRCxJO1lBQy9EQyxrQyxHQUErRSxJO1lBQy9FQyxvQixHQUFtRCxJO1lBQ25EQyxtQixHQUFpRCxJOzs7Ozs7aUNBRXRDQyxJLEVBQThCO0FBRTdDLGFBQUtDLE9BQUwsR0FBZUQsSUFBSSxDQUFDRSxTQUFwQjtBQUNBLGFBQUt4QixZQUFMLEdBQW9Cc0IsSUFBSSxDQUFDRyxXQUF6QjtBQUNB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QUNmLGVBQU8sS0FBS0MsWUFBWjtBQUNIOzs7MEJBRTJCO0FBQ3hCLGVBQU8sS0FBS0MscUJBQVo7QUFDSDs7OzBCQUVhO0FBQ1YsZUFBTyxLQUFLQyxPQUFaO0FBQ0g7OzswQkFFeUI7QUFDdEIsZUFBTyxLQUFLQyxtQkFBWjtBQUNIOzs7MEJBRXFDO0FBQ2xDLGVBQU8sS0FBS0ksK0JBQVo7QUFDSDs7OzBCQUUrQjtBQUM1QixlQUFPLEtBQUtDLHlCQUFaO0FBQ0g7OzswQkFFNkI7QUFDMUIsZUFBTyxLQUFLRSx1QkFBWjtBQUNIOzs7MEJBRXNDO0FBQ25DLGVBQU8sS0FBS0MsZ0NBQVo7QUFDSDs7OzBCQUVvQztBQUNqQyxlQUFPLEtBQUtDLDhCQUFaO0FBQ0g7OzswQkFFbUM7QUFDaEMsZUFBTyxLQUFLQyw2QkFBWjtBQUNIOzs7MEJBRXFDO0FBQ2xDLGVBQU8sS0FBS0MsK0JBQVo7QUFDSDs7OzBCQUVvQztBQUNqQyxlQUFPLEtBQUtFLDhCQUFaO0FBQ0g7OzswQkFFeUM7QUFDdEMsZUFBTyxLQUFLQyxtQ0FBWjtBQUNIOzs7MEJBRXdDO0FBQ3JDLGVBQU8sS0FBS0Usa0NBQVo7QUFDSDs7OzBCQUUwQjtBQUN2QixlQUFPLEtBQUtDLG9CQUFaO0FBQ0g7OzswQkFFeUI7QUFDdEIsZUFBTyxLQUFLQyxtQkFBWjtBQUNIOzs7O0lBcEU2QnVRLGlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbWFjcm8sIHdhcm5JRCwgd2FybiB9IGZyb20gJy4uLy4uL3BsYXRmb3JtJztcclxuaW1wb3J0IHsgR0ZYRGVzY3JpcHRvclNldCwgR0ZYRGVzY3JpcHRvclNldEluZm8gfSBmcm9tICcuLi9kZXNjcmlwdG9yLXNldCc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciwgR0ZYQnVmZmVySW5mbywgR0ZYQnVmZmVyVmlld0luZm8gfSBmcm9tICcuLi9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhDb21tYW5kQnVmZmVyLCBHRlhDb21tYW5kQnVmZmVySW5mbyB9IGZyb20gJy4uL2NvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgR0ZYQVBJLCBHRlhEZXZpY2UsIEdGWEZlYXR1cmUsIEdGWERldmljZUluZm8sIEdGWEJpbmRpbmdNYXBwaW5nSW5mbyB9IGZyb20gJy4uL2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEZlbmNlLCBHRlhGZW5jZUluZm8gfSBmcm9tICcuLi9mZW5jZSc7XHJcbmltcG9ydCB7IEdGWEZyYW1lYnVmZmVyLCBHRlhGcmFtZWJ1ZmZlckluZm8gfSBmcm9tICcuLi9mcmFtZWJ1ZmZlcic7XHJcbmltcG9ydCB7IEdGWElucHV0QXNzZW1ibGVyLCBHRlhJbnB1dEFzc2VtYmxlckluZm8gfSBmcm9tICcuLi9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBHRlhQaXBlbGluZVN0YXRlLCBHRlhQaXBlbGluZVN0YXRlSW5mbyB9IGZyb20gJy4uL3BpcGVsaW5lLXN0YXRlJztcclxuaW1wb3J0IHsgR0ZYUXVldWUsIEdGWFF1ZXVlSW5mbyB9IGZyb20gJy4uL3F1ZXVlJztcclxuaW1wb3J0IHsgR0ZYUmVuZGVyUGFzcywgR0ZYUmVuZGVyUGFzc0luZm8gfSBmcm9tICcuLi9yZW5kZXItcGFzcyc7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIsIEdGWFNhbXBsZXJJbmZvIH0gZnJvbSAnLi4vc2FtcGxlcic7XHJcbmltcG9ydCB7IEdGWFNoYWRlciwgR0ZYU2hhZGVySW5mbyB9IGZyb20gJy4uL3NoYWRlcic7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUsIEdGWFRleHR1cmVJbmZvLCBHRlhUZXh0dXJlVmlld0luZm8gfSBmcm9tICcuLi90ZXh0dXJlJztcclxuaW1wb3J0IHsgV2ViR0wyRGVzY3JpcHRvclNldCB9IGZyb20gJy4vd2ViZ2wyLWRlc2NyaXB0b3Itc2V0JztcclxuaW1wb3J0IHsgV2ViR0wyQnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0wyQ29tbWFuZEFsbG9jYXRvciB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmQtYWxsb2NhdG9yJztcclxuaW1wb3J0IHsgV2ViR0wyQ29tbWFuZEJ1ZmZlciB9IGZyb20gJy4vd2ViZ2wyLWNvbW1hbmQtYnVmZmVyJztcclxuaW1wb3J0IHsgV2ViR0wyRmVuY2UgfSBmcm9tICcuL3dlYmdsMi1mZW5jZSc7XHJcbmltcG9ydCB7IFdlYkdMMkZyYW1lYnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItZnJhbWVidWZmZXInO1xyXG5pbXBvcnQgeyBXZWJHTDJJbnB1dEFzc2VtYmxlciB9IGZyb20gJy4vd2ViZ2wyLWlucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IFdlYkdMMkRlc2NyaXB0b3JTZXRMYXlvdXQgfSBmcm9tICcuL3dlYmdsMi1kZXNjcmlwdG9yLXNldC1sYXlvdXQnO1xyXG5pbXBvcnQgeyBXZWJHTDJQaXBlbGluZUxheW91dCB9IGZyb20gJy4vd2ViZ2wyLXBpcGVsaW5lLWxheW91dCc7XHJcbmltcG9ydCB7IFdlYkdMMlBpcGVsaW5lU3RhdGUgfSBmcm9tICcuL3dlYmdsMi1waXBlbGluZS1zdGF0ZSc7XHJcbmltcG9ydCB7IFdlYkdMMlByaW1hcnlDb21tYW5kQnVmZmVyIH0gZnJvbSAnLi93ZWJnbDItcHJpbWFyeS1jb21tYW5kLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFdlYkdMMlF1ZXVlIH0gZnJvbSAnLi93ZWJnbDItcXVldWUnO1xyXG5pbXBvcnQgeyBXZWJHTDJSZW5kZXJQYXNzIH0gZnJvbSAnLi93ZWJnbDItcmVuZGVyLXBhc3MnO1xyXG5pbXBvcnQgeyBXZWJHTDJTYW1wbGVyIH0gZnJvbSAnLi93ZWJnbDItc2FtcGxlcic7XHJcbmltcG9ydCB7IFdlYkdMMlNoYWRlciB9IGZyb20gJy4vd2ViZ2wyLXNoYWRlcic7XHJcbmltcG9ydCB7IFdlYkdMMlN0YXRlQ2FjaGUgfSBmcm9tICcuL3dlYmdsMi1zdGF0ZS1jYWNoZSc7XHJcbmltcG9ydCB7IFdlYkdMMlRleHR1cmUgfSBmcm9tICcuL3dlYmdsMi10ZXh0dXJlJztcclxuaW1wb3J0IHsgZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yLCBHRlhCdWZmZXJUZXh0dXJlQ29weSwgR0ZYQ29tbWFuZEJ1ZmZlclR5cGUsIEdGWEZpbHRlciwgR0ZYRm9ybWF0LCBHRlhGb3JtYXRJbmZvcyxcclxuICAgIEdGWFF1ZXVlVHlwZSwgR0ZYVGV4dHVyZUZsYWdCaXQsIEdGWFRleHR1cmVUeXBlLCBHRlhUZXh0dXJlVXNhZ2VCaXQsIEdGWFJlY3QgfSBmcm9tICcuLi9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhGb3JtYXRUb1dlYkdMRm9ybWF0LCBHRlhGb3JtYXRUb1dlYkdMVHlwZSwgV2ViR0wyQ21kRnVuY0JsaXRGcmFtZWJ1ZmZlcixcclxuICAgIFdlYkdMMkNtZEZ1bmNDb3B5QnVmZmVyc1RvVGV4dHVyZSwgV2ViR0wyQ21kRnVuY0NvcHlUZXhJbWFnZXNUb1RleHR1cmUgfSBmcm9tICcuL3dlYmdsMi1jb21tYW5kcyc7XHJcbmltcG9ydCB7IEdGWFBpcGVsaW5lTGF5b3V0LCBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0LCBHRlhEZXNjcmlwdG9yU2V0TGF5b3V0SW5mbywgR0ZYUGlwZWxpbmVMYXlvdXRJbmZvIH0gZnJvbSAnLi4vLi4nO1xyXG5cclxuY29uc3QgZXZlbnRXZWJHTENvbnRleHRMb3N0ID0gJ3dlYmdsY29udGV4dGxvc3QnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYkdMMkRldmljZSBleHRlbmRzIEdGWERldmljZSB7XHJcblxyXG4gICAgZ2V0IGdsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2ViR0wyUkMgYXMgV2ViR0wyUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNBbnRpYWxpYXMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc0FudGlhbGlhcztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaXNQcmVtdWx0aXBsaWVkQWxwaGEgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pc1ByZW11bHRpcGxpZWRBbHBoYTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgdXNlVkFPICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdXNlVkFPO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBiaW5kaW5nTWFwcGluZ0luZm8gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm87XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IEVYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX0VYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBFWFRfY29sb3JfYnVmZmVyX2Zsb2F0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX0VYVF9kaXNqb2ludF90aW1lcl9xdWVyeV93ZWJnbDI7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzE7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2IgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Y19zcmdiO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBXRUJHTF90ZXh0dXJlX3N0b3JhZ2VfbXVsdGlzYW1wbGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF90ZXh0dXJlX3N0b3JhZ2VfbXVsdGlzYW1wbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IFdFQkdMX2RlYnVnX3NoYWRlcnMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9kZWJ1Z19zaGFkZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBXRUJHTF9sb3NlX2NvbnRleHQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9XRUJHTF9sb3NlX2NvbnRleHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRlQ2FjaGU6IFdlYkdMMlN0YXRlQ2FjaGUgPSBuZXcgV2ViR0wyU3RhdGVDYWNoZSgpO1xyXG4gICAgcHVibGljIGNtZEFsbG9jYXRvcjogV2ViR0wyQ29tbWFuZEFsbG9jYXRvciA9IG5ldyBXZWJHTDJDb21tYW5kQWxsb2NhdG9yKCk7XHJcbiAgICBwdWJsaWMgbnVsbFRleDJEOiBXZWJHTDJUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgbnVsbFRleEN1YmU6IFdlYkdMMlRleHR1cmUgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF93ZWJHTDJSQzogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfaXNBbnRpYWxpYXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfaXNQcmVtdWx0aXBsaWVkQWxwaGE6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgcHJpdmF0ZSBfdXNlVkFPOiBib29sZWFuID0gdHJ1ZTtcclxuICAgIHByaXZhdGUgX2JpbmRpbmdNYXBwaW5nSW5mbzogR0ZYQmluZGluZ01hcHBpbmdJbmZvID0gbmV3IEdGWEJpbmRpbmdNYXBwaW5nSW5mbygpO1xyXG4gICAgcHJpdmF0ZSBfd2ViR0xDb250ZXh0TG9zdEhhbmRsZXI6IG51bGwgfCAoKGV2ZW50OiBFdmVudCkgPT4gdm9pZCkgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX2V4dGVuc2lvbnM6IHN0cmluZ1tdIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9FWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWM6IEVYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyOiBPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyOiBPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdDogRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMjogRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzE6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjOiBXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfcHZydGM6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGM6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hc3RjIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0YzogV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2I6IFdFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2IgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm86IFdFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX1dFQkdMX3RleHR1cmVfc3RvcmFnZV9tdWx0aXNhbXBsZTogV0VCR0xfdGV4dHVyZV9zdG9yYWdlX211bHRpc2FtcGxlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9kZWJ1Z19zaGFkZXJzOiBXRUJHTF9kZWJ1Z19zaGFkZXJzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9XRUJHTF9sb3NlX2NvbnRleHQ6IFdFQkdMX2xvc2VfY29udGV4dCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBHRlhEZXZpY2VJbmZvKTogYm9vbGVhbiB7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGluZm8uY2FudmFzRWxtIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIHRoaXMuX2lzQW50aWFsaWFzID0gaW5mby5pc0FudGlhbGlhcztcclxuICAgICAgICB0aGlzLl9pc1ByZW11bHRpcGxpZWRBbHBoYSA9IGluZm8uaXNQcmVtdWx0aXBsaWVkQWxwaGE7XHJcbiAgICAgICAgdGhpcy5fYmluZGluZ01hcHBpbmdJbmZvID0gaW5mby5iaW5kaW5nTWFwcGluZ0luZm87XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uYnVmZmVyT2Zmc2V0cy5sZW5ndGgpIHRoaXMuX2JpbmRpbmdNYXBwaW5nSW5mby5idWZmZXJPZmZzZXRzLnB1c2goMCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHMubGVuZ3RoKSB0aGlzLl9iaW5kaW5nTWFwcGluZ0luZm8uc2FtcGxlck9mZnNldHMucHVzaCgwKTtcclxuXHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgY29uc3Qgd2ViR0xDdHhBdHRyaWJzOiBXZWJHTENvbnRleHRBdHRyaWJ1dGVzID0ge1xyXG4gICAgICAgICAgICAgICAgYWxwaGE6IG1hY3JvLkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVMsXHJcbiAgICAgICAgICAgICAgICBhbnRpYWxpYXM6IHRoaXMuX2lzQW50aWFsaWFzLFxyXG4gICAgICAgICAgICAgICAgZGVwdGg6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBzdGVuY2lsOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcHJlbXVsdGlwbGllZEFscGhhOiB0aGlzLl9pc1ByZW11bHRpcGxpZWRBbHBoYSxcclxuICAgICAgICAgICAgICAgIHByZXNlcnZlRHJhd2luZ0J1ZmZlcjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwb3dlclByZWZlcmVuY2U6ICdkZWZhdWx0JyxcclxuICAgICAgICAgICAgICAgIGZhaWxJZk1ham9yUGVyZm9ybWFuY2VDYXZlYXQ6IGZhbHNlLFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fd2ViR0wyUkMgPSB0aGlzLl9jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJywgd2ViR0xDdHhBdHRyaWJzKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fd2ViR0wyUkMpIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKCdUaGlzIGRldmljZSBkb2VzIG5vdCBzdXBwb3J0IFdlYkdMMi4nKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fd2ViR0xDb250ZXh0TG9zdEhhbmRsZXIgPSB0aGlzLl9vbldlYkdMQ29udGV4dExvc3QuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcihldmVudFdlYkdMQ29udGV4dExvc3QsIHRoaXMuX29uV2ViR0xDb250ZXh0TG9zdCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NhbnZhczJEID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnV2ViR0wyIGRldmljZSBpbml0aWFsaXplZC4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZ2Z4QVBJID0gR0ZYQVBJLldFQkdMMjtcclxuICAgICAgICB0aGlzLl9kZXZpY2VOYW1lID0gJ1dlYkdMMic7XHJcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLl93ZWJHTDJSQztcclxuXHJcbiAgICAgICAgdGhpcy5fV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mbyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvJyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX1dFQkdMX2RlYnVnX3JlbmRlcmVyX2luZm8pIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIodGhpcy5fV0VCR0xfZGVidWdfcmVuZGVyZXJfaW5mby5VTk1BU0tFRF9SRU5ERVJFUl9XRUJHTCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZlbmRvciA9IGdsLmdldFBhcmFtZXRlcih0aGlzLl9XRUJHTF9kZWJ1Z19yZW5kZXJlcl9pbmZvLlVOTUFTS0VEX1ZFTkRPUl9XRUJHTCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyZXIgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuUkVOREVSRVIpO1xyXG4gICAgICAgICAgICB0aGlzLl92ZW5kb3IgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVORE9SKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3ZlcnNpb24gPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuVkVSU0lPTik7XHJcbiAgICAgICAgdGhpcy5fbWF4VmVydGV4QXR0cmlidXRlcyA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVkVSVEVYX0FUVFJJQlMpO1xyXG4gICAgICAgIHRoaXMuX21heFZlcnRleFVuaWZvcm1WZWN0b3JzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTKTtcclxuICAgICAgICB0aGlzLl9tYXhGcmFnbWVudFVuaWZvcm1WZWN0b3JzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9GUkFHTUVOVF9VTklGT1JNX1ZFQ1RPUlMpO1xyXG4gICAgICAgIHRoaXMuX21heFRleHR1cmVVbml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgdGhpcy5fbWF4VmVydGV4VGV4dHVyZVVuaXRzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVEVYVFVSRV9JTUFHRV9VTklUUyk7XHJcbiAgICAgICAgdGhpcy5fbWF4VW5pZm9ybUJ1ZmZlckJpbmRpbmdzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9VTklGT1JNX0JVRkZFUl9CSU5ESU5HUyk7XHJcbiAgICAgICAgdGhpcy5fbWF4VW5pZm9ybUJsb2NrU2l6ZSA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVU5JRk9STV9CTE9DS19TSVpFKTtcclxuICAgICAgICB0aGlzLl9tYXhUZXh0dXJlU2l6ZSA9IGdsLmdldFBhcmFtZXRlcihnbC5NQVhfVEVYVFVSRV9TSVpFKTtcclxuICAgICAgICB0aGlzLl9tYXhDdWJlTWFwVGV4dHVyZVNpemUgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX0NVQkVfTUFQX1RFWFRVUkVfU0laRSk7XHJcbiAgICAgICAgdGhpcy5fdWJvT2Zmc2V0QWxpZ25tZW50ID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLlVOSUZPUk1fQlVGRkVSX09GRlNFVF9BTElHTk1FTlQpO1xyXG4gICAgICAgIHRoaXMuX2RlcHRoQml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5ERVBUSF9CSVRTKTtcclxuICAgICAgICB0aGlzLl9zdGVuY2lsQml0cyA9IGdsLmdldFBhcmFtZXRlcihnbC5TVEVOQ0lMX0JJVFMpO1xyXG4gICAgICAgIC8vIGxldCBtYXhWZXJ0ZXhVbmlmb3JtQmxvY2tzID0gZ2wuZ2V0UGFyYW1ldGVyKGdsLk1BWF9WRVJURVhfVU5JRk9STV9CTE9DS1MpO1xyXG4gICAgICAgIC8vIGxldCBtYXhGcmFnbWVudFVuaWZvcm1CbG9ja3MgPSBnbC5nZXRQYXJhbWV0ZXIoZ2wuTUFYX0ZSQUdNRU5UX1VOSUZPUk1fQkxPQ0tTKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZUNhY2hlLmluaXRpYWxpemUodGhpcy5fbWF4VGV4dHVyZVVuaXRzLCB0aGlzLl9tYXhVbmlmb3JtQnVmZmVyQmluZGluZ3MsIHRoaXMuX21heFZlcnRleEF0dHJpYnV0ZXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9kZXZpY2VQaXhlbFJhdGlvID0gaW5mby5kZXZpY2VQaXhlbFJhdGlvIHx8IDEuMDtcclxuICAgICAgICB0aGlzLl93aWR0aCA9IHRoaXMuX2NhbnZhcy53aWR0aDtcclxuICAgICAgICB0aGlzLl9oZWlnaHQgPSB0aGlzLl9jYW52YXMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMuX25hdGl2ZVdpZHRoID0gTWF0aC5tYXgoaW5mby5uYXRpdmVXaWR0aCB8fCB0aGlzLl93aWR0aCwgMCk7XHJcbiAgICAgICAgdGhpcy5fbmF0aXZlSGVpZ2h0ID0gTWF0aC5tYXgoaW5mby5uYXRpdmVIZWlnaHQgfHwgdGhpcy5faGVpZ2h0LCAwKTtcclxuXHJcbiAgICAgICAgdGhpcy5fY29sb3JGbXQgPSBHRlhGb3JtYXQuUkdCQTg7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9kZXB0aEJpdHMgPT09IDMyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGVuY2lsQml0cyA9PT0gOCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVwdGhTdGVuY2lsRm10ID0gR0ZYRm9ybWF0LkQzMkZfUzg7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9kZXB0aFN0ZW5jaWxGbXQgPSBHRlhGb3JtYXQuRDMyRjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGVwdGhCaXRzID09PSAyNCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RlbmNpbEJpdHMgPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMjRTODtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMjQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fc3RlbmNpbEJpdHMgPT09IDgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMTZTODtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlcHRoU3RlbmNpbEZtdCA9IEdGWEZvcm1hdC5EMTY7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBnbC5nZXRTdXBwb3J0ZWRFeHRlbnNpb25zKCk7XHJcbiAgICAgICAgbGV0IGV4dGVuc2lvbnMgPSAnJztcclxuICAgICAgICBpZiAodGhpcy5fZXh0ZW5zaW9ucykge1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IGV4dCBvZiB0aGlzLl9leHRlbnNpb25zKSB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zICs9IGV4dCArICcgJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc29sZS5kZWJ1ZygnRVhURU5TSU9OUzogJyArIGV4dGVuc2lvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fRVhUX3RleHR1cmVfZmlsdGVyX2FuaXNvdHJvcGljID0gdGhpcy5nZXRFeHRlbnNpb24oJ0VYVF90ZXh0dXJlX2ZpbHRlcl9hbmlzb3Ryb3BpYycpO1xyXG4gICAgICAgIHRoaXMuX0VYVF9jb2xvcl9idWZmZXJfZmxvYXQgPSB0aGlzLmdldEV4dGVuc2lvbignRVhUX2NvbG9yX2J1ZmZlcl9mbG9hdCcpO1xyXG4gICAgICAgIHRoaXMuX0VYVF9kaXNqb2ludF90aW1lcl9xdWVyeV93ZWJnbDIgPSB0aGlzLmdldEV4dGVuc2lvbignRVhUX2Rpc2pvaW50X3RpbWVyX3F1ZXJ5X3dlYmdsMicpO1xyXG4gICAgICAgIHRoaXMuX09FU190ZXh0dXJlX2Zsb2F0X2xpbmVhciA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXInKTtcclxuICAgICAgICB0aGlzLl9PRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhciA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdPRVNfdGV4dHVyZV9oYWxmX2Zsb2F0X2xpbmVhcicpO1xyXG4gICAgICAgIHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9ldGMxJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfZXRjJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9wdnJ0YycpO1xyXG4gICAgICAgIHRoaXMuX1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hc3RjID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9hc3RjJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3MzdGMnKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Y19zcmdiID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2NvbXByZXNzZWRfdGV4dHVyZV9zM3RjX3NyZ2InKTtcclxuICAgICAgICB0aGlzLl9XRUJHTF90ZXh0dXJlX3N0b3JhZ2VfbXVsdGlzYW1wbGUgPSB0aGlzLmdldEV4dGVuc2lvbignV0VCR0xfdGV4dHVyZV9zdG9yYWdlX211bHRpc2FtcGxlJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfZGVidWdfc2hhZGVycyA9IHRoaXMuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kZWJ1Z19zaGFkZXJzJyk7XHJcbiAgICAgICAgdGhpcy5fV0VCR0xfbG9zZV9jb250ZXh0ID0gdGhpcy5nZXRFeHRlbnNpb24oJ1dFQkdMX2xvc2VfY29udGV4dCcpO1xyXG5cclxuICAgICAgICB0aGlzLl9mZWF0dXJlcy5maWxsKGZhbHNlKTtcclxuICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLlRFWFRVUkVfRkxPQVRdID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLlRFWFRVUkVfSEFMRl9GTE9BVF0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX1IxMUcxMUIxMEZdID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9SR0I4XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRDE2XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRDI0XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRDMyRl0gPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX0QyNFM4XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRDMyRlM4XSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5NU0FBXSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5FTEVNRU5UX0lOREVYX1VJTlRdID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLklOU1RBTkNFRF9BUlJBWVNdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX0VYVF9jb2xvcl9idWZmZXJfZmxvYXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5DT0xPUl9GTE9BVF0gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkNPTE9SX0hBTEZfRkxPQVRdID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9PRVNfdGV4dHVyZV9mbG9hdF9saW5lYXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5URVhUVVJFX0ZMT0FUX0xJTkVBUl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX09FU190ZXh0dXJlX2hhbGZfZmxvYXRfbGluZWFyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuVEVYVFVSRV9IQUxGX0ZMT0FUX0xJTkVBUl0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGNvbXByZXNzZWRGb3JtYXQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0YzEpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfRVRDMV0gPSB0cnVlO1xyXG4gICAgICAgICAgICBjb21wcmVzc2VkRm9ybWF0ICs9ICdldGMxICc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2V0Yykge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9FVEMyXSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbXByZXNzZWRGb3JtYXQgKz0gJ2V0YzIgJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9XRUJHTF9jb21wcmVzc2VkX3RleHR1cmVfczN0Yykge1xyXG4gICAgICAgICAgICB0aGlzLl9mZWF0dXJlc1tHRlhGZWF0dXJlLkZPUk1BVF9EWFRdID0gdHJ1ZTtcclxuICAgICAgICAgICAgY29tcHJlc3NlZEZvcm1hdCArPSAnZHh0ICc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX3B2cnRjKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZlYXR1cmVzW0dGWEZlYXR1cmUuRk9STUFUX1BWUlRDXSA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbXByZXNzZWRGb3JtYXQgKz0gJ3B2cnRjICc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fV0VCR0xfY29tcHJlc3NlZF90ZXh0dXJlX2FzdGMpIHtcclxuICAgICAgICAgICAgdGhpcy5fZmVhdHVyZXNbR0ZYRmVhdHVyZS5GT1JNQVRfQVNUQ10gPSB0cnVlO1xyXG4gICAgICAgICAgICBjb21wcmVzc2VkRm9ybWF0ICs9ICdhc3RjICc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmluZm8oJ1JFTkRFUkVSOiAnICsgdGhpcy5fcmVuZGVyZXIpO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnVkVORE9SOiAnICsgdGhpcy5fdmVuZG9yKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1ZFUlNJT046ICcgKyB0aGlzLl92ZXJzaW9uKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ0RQUjogJyArIHRoaXMuX2RldmljZVBpeGVsUmF0aW8pO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnU0NSRUVOX1NJWkU6ICcgKyB0aGlzLl93aWR0aCArICcgeCAnICsgdGhpcy5faGVpZ2h0KTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ05BVElWRV9TSVpFOiAnICsgdGhpcy5fbmF0aXZlV2lkdGggKyAnIHggJyArIHRoaXMuX25hdGl2ZUhlaWdodCk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdNQVhfVkVSVEVYX0FUVFJJQlM6ICcgKyB0aGlzLl9tYXhWZXJ0ZXhBdHRyaWJ1dGVzKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ01BWF9WRVJURVhfVU5JRk9STV9WRUNUT1JTOiAnICsgdGhpcy5fbWF4VmVydGV4VW5pZm9ybVZlY3RvcnMpO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnTUFYX0ZSQUdNRU5UX1VOSUZPUk1fVkVDVE9SUzogJyArIHRoaXMuX21heEZyYWdtZW50VW5pZm9ybVZlY3RvcnMpO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnTUFYX1RFWFRVUkVfSU1BR0VfVU5JVFM6ICcgKyB0aGlzLl9tYXhUZXh0dXJlVW5pdHMpO1xyXG4gICAgICAgIGNvbnNvbGUuaW5mbygnTUFYX1ZFUlRFWF9URVhUVVJFX0lNQUdFX1VOSVRTOiAnICsgdGhpcy5fbWF4VmVydGV4VGV4dHVyZVVuaXRzKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ01BWF9VTklGT1JNX0JVRkZFUl9CSU5ESU5HUzogJyArIHRoaXMuX21heFVuaWZvcm1CdWZmZXJCaW5kaW5ncyk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdNQVhfVU5JRk9STV9CTE9DS19TSVpFOiAnICsgdGhpcy5fbWF4VW5pZm9ybUJsb2NrU2l6ZSk7XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdERVBUSF9CSVRTOiAnICsgdGhpcy5fZGVwdGhCaXRzKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1NURU5DSUxfQklUUzogJyArIHRoaXMuX3N0ZW5jaWxCaXRzKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ1VOSUZPUk1fQlVGRkVSX09GRlNFVF9BTElHTk1FTlQ6ICcgKyB0aGlzLl91Ym9PZmZzZXRBbGlnbm1lbnQpO1xyXG4gICAgICAgIGlmICh0aGlzLl9FWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMpIHtcclxuICAgICAgICAgICAgY29uc29sZS5pbmZvKCdNQVhfVEVYVFVSRV9NQVhfQU5JU09UUk9QWV9FWFQ6ICcgKyB0aGlzLl9FWFRfdGV4dHVyZV9maWx0ZXJfYW5pc290cm9waWMuTUFYX1RFWFRVUkVfTUFYX0FOSVNPVFJPUFlfRVhUKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc29sZS5pbmZvKCdVU0VfVkFPOiAnICsgdGhpcy5fdXNlVkFPKTtcclxuICAgICAgICBjb25zb2xlLmluZm8oJ0NPTVBSRVNTRURfRk9STUFUOiAnICsgY29tcHJlc3NlZEZvcm1hdCk7XHJcblxyXG4gICAgICAgIC8vIGluaXQgc3RhdGVzXHJcbiAgICAgICAgdGhpcy5pbml0U3RhdGVzKGdsKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHF1ZXVlXHJcbiAgICAgICAgdGhpcy5fcXVldWUgPSB0aGlzLmNyZWF0ZVF1ZXVlKG5ldyBHRlhRdWV1ZUluZm8oR0ZYUXVldWVUeXBlLkdSQVBISUNTKSk7XHJcbiAgICAgICAgdGhpcy5fY21kQnVmZiA9IHRoaXMuY3JlYXRlQ29tbWFuZEJ1ZmZlcihuZXcgR0ZYQ29tbWFuZEJ1ZmZlckluZm8odGhpcy5fcXVldWUpKTtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIGRlZmF1bHQgbnVsbCB0ZXh0dXJlXHJcbiAgICAgICAgdGhpcy5udWxsVGV4MkQgPSB0aGlzLmNyZWF0ZVRleHR1cmUobmV3IEdGWFRleHR1cmVJbmZvKFxyXG4gICAgICAgICAgICBHRlhUZXh0dXJlVHlwZS5URVgyRCxcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVVzYWdlQml0LlNBTVBMRUQsXHJcbiAgICAgICAgICAgIEdGWEZvcm1hdC5SR0JBOCxcclxuICAgICAgICAgICAgMixcclxuICAgICAgICAgICAgMixcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZUZsYWdCaXQuR0VOX01JUE1BUCxcclxuICAgICAgICApKSBhcyBXZWJHTDJUZXh0dXJlO1xyXG5cclxuICAgICAgICB0aGlzLm51bGxUZXhDdWJlID0gbmV3IFdlYkdMMlRleHR1cmUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5udWxsVGV4Q3ViZS5pbml0aWFsaXplKG5ldyBHRlhUZXh0dXJlSW5mbyhcclxuICAgICAgICAgICAgR0ZYVGV4dHVyZVR5cGUuVEVYMkQsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVVc2FnZUJpdC5TQU1QTEVELFxyXG4gICAgICAgICAgICBHRlhGb3JtYXQuUkdCQTgsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIDIsXHJcbiAgICAgICAgICAgIEdGWFRleHR1cmVGbGFnQml0LkNVQkVNQVAgfCBHRlhUZXh0dXJlRmxhZ0JpdC5HRU5fTUlQTUFQLFxyXG4gICAgICAgICAgICA2LFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICBjb25zdCBudWxsVGV4UmVnaW9uID0gbmV3IEdGWEJ1ZmZlclRleHR1cmVDb3B5KCk7XHJcbiAgICAgICAgbnVsbFRleFJlZ2lvbi50ZXhFeHRlbnQud2lkdGggPSAyO1xyXG4gICAgICAgIG51bGxUZXhSZWdpb24udGV4RXh0ZW50LmhlaWdodCA9IDI7XHJcblxyXG4gICAgICAgIGNvbnN0IG51bGxUZXhCdWZmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5udWxsVGV4MkQuc2l6ZSk7XHJcbiAgICAgICAgbnVsbFRleEJ1ZmYuZmlsbCgwKTtcclxuICAgICAgICB0aGlzLmNvcHlCdWZmZXJzVG9UZXh0dXJlKFtudWxsVGV4QnVmZl0sIHRoaXMubnVsbFRleDJELCBbbnVsbFRleFJlZ2lvbl0pO1xyXG5cclxuICAgICAgICBudWxsVGV4UmVnaW9uLnRleFN1YnJlcy5sYXllckNvdW50ID0gNjtcclxuICAgICAgICB0aGlzLmNvcHlCdWZmZXJzVG9UZXh0dXJlKFxyXG4gICAgICAgICAgICBbbnVsbFRleEJ1ZmYsIG51bGxUZXhCdWZmLCBudWxsVGV4QnVmZiwgbnVsbFRleEJ1ZmYsIG51bGxUZXhCdWZmLCBudWxsVGV4QnVmZl0sXHJcbiAgICAgICAgICAgIHRoaXMubnVsbFRleEN1YmUsIFtudWxsVGV4UmVnaW9uXSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fY2FudmFzICYmIHRoaXMuX3dlYkdMQ29udGV4dExvc3RIYW5kbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50V2ViR0xDb250ZXh0TG9zdCwgdGhpcy5fd2ViR0xDb250ZXh0TG9zdEhhbmRsZXIpO1xyXG4gICAgICAgICAgICB0aGlzLl93ZWJHTENvbnRleHRMb3N0SGFuZGxlciA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5udWxsVGV4MkQpIHtcclxuICAgICAgICAgICAgdGhpcy5udWxsVGV4MkQuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLm51bGxUZXgyRCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5udWxsVGV4Q3ViZSkge1xyXG4gICAgICAgICAgICB0aGlzLm51bGxUZXhDdWJlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5udWxsVGV4Q3ViZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3ByaW1hcmllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vICAgICB0aGlzLl9wcmltYXJpZXNbaV0uZGVzdHJveSgpO1xyXG4gICAgICAgIC8vIH1cclxuICAgICAgICAvLyB0aGlzLl9uZXh0UHJpbWFyeSA9IHRoaXMuX3ByaW1hcmllcy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3NlY29uZGFyaWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gICAgIHRoaXMuX3NlY29uZGFyaWVzW2ldLmRlc3Ryb3koKTtcclxuICAgICAgICAvLyB9XHJcbiAgICAgICAgLy8gdGhpcy5fbmV4dFNlY29uZGFyeSA9IHRoaXMuX3NlY29uZGFyaWVzLmxlbmd0aCA9IDA7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9xdWV1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9xdWV1ZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9jbWRCdWZmKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NtZEJ1ZmYuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jbWRCdWZmID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2V4dGVuc2lvbnMgPSBudWxsO1xyXG5cclxuICAgICAgICB0aGlzLl93ZWJHTDJSQyA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlc2l6ZSAod2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fd2lkdGggIT09IHdpZHRoIHx8IHRoaXMuX2hlaWdodCAhPT0gaGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuaW5mbygnUmVzaXppbmcgZGV2aWNlOiAnICsgd2lkdGggKyAneCcgKyBoZWlnaHQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jYW52YXMhLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbnZhcyEuaGVpZ2h0ID0gaGVpZ2h0O1xyXG4gICAgICAgICAgICB0aGlzLl93aWR0aCA9IHdpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3F1aXJlICgpIHtcclxuICAgICAgICB0aGlzLmNtZEFsbG9jYXRvci5yZWxlYXNlQ21kcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBwcmVzZW50ICgpIHtcclxuICAgICAgICBjb25zdCBxdWV1ZSA9ICh0aGlzLl9xdWV1ZSBhcyBXZWJHTDJRdWV1ZSk7XHJcbiAgICAgICAgdGhpcy5fbnVtRHJhd0NhbGxzID0gcXVldWUubnVtRHJhd0NhbGxzO1xyXG4gICAgICAgIHRoaXMuX251bUluc3RhbmNlcyA9IHF1ZXVlLm51bUluc3RhbmNlcztcclxuICAgICAgICB0aGlzLl9udW1UcmlzID0gcXVldWUubnVtVHJpcztcclxuICAgICAgICBxdWV1ZS5jbGVhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDb21tYW5kQnVmZmVyIChpbmZvOiBHRlhDb21tYW5kQnVmZmVySW5mbyk6IEdGWENvbW1hbmRCdWZmZXIge1xyXG4gICAgICAgIC8vIGNvbnN0IGN0b3IgPSBXZWJHTENvbW1hbmRCdWZmZXI7IC8vIG9wdCB0byBpbnN0YW50IGludm9jYXRpb25cclxuICAgICAgICBjb25zdCBjdG9yID0gaW5mby50eXBlID09PSBHRlhDb21tYW5kQnVmZmVyVHlwZS5QUklNQVJZID8gV2ViR0wyUHJpbWFyeUNvbW1hbmRCdWZmZXIgOiBXZWJHTDJDb21tYW5kQnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGNtZEJ1ZmYgPSBuZXcgY3Rvcih0aGlzKTtcclxuICAgICAgICBpZiAoY21kQnVmZi5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjbWRCdWZmO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUJ1ZmZlciAoaW5mbzogR0ZYQnVmZmVySW5mbyB8IEdGWEJ1ZmZlclZpZXdJbmZvKTogR0ZYQnVmZmVyIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSBuZXcgV2ViR0wyQnVmZmVyKHRoaXMpO1xyXG4gICAgICAgIGlmIChidWZmZXIuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVRleHR1cmUgKGluZm86IEdGWFRleHR1cmVJbmZvIHwgR0ZYVGV4dHVyZVZpZXdJbmZvKTogR0ZYVGV4dHVyZSB7XHJcbiAgICAgICAgY29uc3QgdGV4dHVyZSA9IG5ldyBXZWJHTDJUZXh0dXJlKHRoaXMpO1xyXG4gICAgICAgIGlmICh0ZXh0dXJlLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRleHR1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlU2FtcGxlciAoaW5mbzogR0ZYU2FtcGxlckluZm8pOiBHRlhTYW1wbGVyIHtcclxuICAgICAgICBjb25zdCBzYW1wbGVyID0gbmV3IFdlYkdMMlNhbXBsZXIodGhpcyk7XHJcbiAgICAgICAgaWYgKHNhbXBsZXIuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gc2FtcGxlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVEZXNjcmlwdG9yU2V0IChpbmZvOiBHRlhEZXNjcmlwdG9yU2V0SW5mbyk6IEdGWERlc2NyaXB0b3JTZXQge1xyXG4gICAgICAgIGNvbnN0IGRlc2NyaXB0b3JTZXQgPSBuZXcgV2ViR0wyRGVzY3JpcHRvclNldCh0aGlzKTtcclxuICAgICAgICBpZiAoZGVzY3JpcHRvclNldC5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkZXNjcmlwdG9yU2V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZVNoYWRlciAoaW5mbzogR0ZYU2hhZGVySW5mbyk6IEdGWFNoYWRlciB7XHJcbiAgICAgICAgY29uc3Qgc2hhZGVyID0gbmV3IFdlYkdMMlNoYWRlcih0aGlzKTtcclxuICAgICAgICBpZiAoc2hhZGVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNoYWRlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVJbnB1dEFzc2VtYmxlciAoaW5mbzogR0ZYSW5wdXRBc3NlbWJsZXJJbmZvKTogR0ZYSW5wdXRBc3NlbWJsZXIge1xyXG4gICAgICAgIGNvbnN0IGlucHV0QXNzZW1ibGVyID0gbmV3IFdlYkdMMklucHV0QXNzZW1ibGVyKHRoaXMpO1xyXG4gICAgICAgIGlmIChpbnB1dEFzc2VtYmxlci5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBpbnB1dEFzc2VtYmxlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJQYXNzIChpbmZvOiBHRlhSZW5kZXJQYXNzSW5mbyk6IEdGWFJlbmRlclBhc3Mge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3MgPSBuZXcgV2ViR0wyUmVuZGVyUGFzcyh0aGlzKTtcclxuICAgICAgICBpZiAocmVuZGVyUGFzcy5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZW5kZXJQYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZUZyYW1lYnVmZmVyIChpbmZvOiBHRlhGcmFtZWJ1ZmZlckluZm8pOiBHRlhGcmFtZWJ1ZmZlciB7XHJcbiAgICAgICAgY29uc3QgZnJhbWVidWZmZXIgPSBuZXcgV2ViR0wyRnJhbWVidWZmZXIodGhpcyk7XHJcbiAgICAgICAgaWYgKGZyYW1lYnVmZmVyLmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZyYW1lYnVmZmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbCE7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZURlc2NyaXB0b3JTZXRMYXlvdXQgKGluZm86IEdGWERlc2NyaXB0b3JTZXRMYXlvdXRJbmZvKTogR0ZYRGVzY3JpcHRvclNldExheW91dCB7XHJcbiAgICAgICAgY29uc3QgZGVzY3JpcHRvclNldExheW91dCA9IG5ldyBXZWJHTDJEZXNjcmlwdG9yU2V0TGF5b3V0KHRoaXMpO1xyXG4gICAgICAgIGlmIChkZXNjcmlwdG9yU2V0TGF5b3V0LmluaXRpYWxpemUoaW5mbykpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3JTZXRMYXlvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlUGlwZWxpbmVMYXlvdXQgKGluZm86IEdGWFBpcGVsaW5lTGF5b3V0SW5mbyk6IEdGWFBpcGVsaW5lTGF5b3V0IHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZUxheW91dCA9IG5ldyBXZWJHTDJQaXBlbGluZUxheW91dCh0aGlzKTtcclxuICAgICAgICBpZiAocGlwZWxpbmVMYXlvdXQuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwZWxpbmVMYXlvdXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsITtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlUGlwZWxpbmVTdGF0ZSAoaW5mbzogR0ZYUGlwZWxpbmVTdGF0ZUluZm8pOiBHRlhQaXBlbGluZVN0YXRlIHtcclxuICAgICAgICBjb25zdCBwaXBlbGluZVN0YXRlID0gbmV3IFdlYkdMMlBpcGVsaW5lU3RhdGUodGhpcyk7XHJcbiAgICAgICAgaWYgKHBpcGVsaW5lU3RhdGUuaW5pdGlhbGl6ZShpbmZvKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGlwZWxpbmVTdGF0ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVGZW5jZSAoaW5mbzogR0ZYRmVuY2VJbmZvKTogR0ZYRmVuY2Uge1xyXG4gICAgICAgIGNvbnN0IGZlbmNlID0gbmV3IFdlYkdMMkZlbmNlKHRoaXMpO1xyXG4gICAgICAgIGlmIChmZW5jZS5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmZW5jZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVRdWV1ZSAoaW5mbzogR0ZYUXVldWVJbmZvKTogR0ZYUXVldWUge1xyXG4gICAgICAgIGNvbnN0IHF1ZXVlID0gbmV3IFdlYkdMMlF1ZXVlKHRoaXMpO1xyXG4gICAgICAgIGlmIChxdWV1ZS5pbml0aWFsaXplKGluZm8pKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWV1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGwhO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5QnVmZmVyc1RvVGV4dHVyZSAoYnVmZmVyczogQXJyYXlCdWZmZXJWaWV3W10sIHRleHR1cmU6IEdGWFRleHR1cmUsIHJlZ2lvbnM6IEdGWEJ1ZmZlclRleHR1cmVDb3B5W10pIHtcclxuICAgICAgICBXZWJHTDJDbWRGdW5jQ29weUJ1ZmZlcnNUb1RleHR1cmUoXHJcbiAgICAgICAgICAgIHRoaXMsXHJcbiAgICAgICAgICAgIGJ1ZmZlcnMsXHJcbiAgICAgICAgICAgICh0ZXh0dXJlIGFzIFdlYkdMMlRleHR1cmUpLmdwdVRleHR1cmUsXHJcbiAgICAgICAgICAgIHJlZ2lvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5VGV4SW1hZ2VzVG9UZXh0dXJlIChcclxuICAgICAgICB0ZXhJbWFnZXM6IFRleEltYWdlU291cmNlW10sXHJcbiAgICAgICAgdGV4dHVyZTogR0ZYVGV4dHVyZSxcclxuICAgICAgICByZWdpb25zOiBHRlhCdWZmZXJUZXh0dXJlQ29weVtdKSB7XHJcblxyXG4gICAgICAgIFdlYkdMMkNtZEZ1bmNDb3B5VGV4SW1hZ2VzVG9UZXh0dXJlKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICB0ZXhJbWFnZXMsXHJcbiAgICAgICAgICAgICh0ZXh0dXJlIGFzIFdlYkdMMlRleHR1cmUpLmdwdVRleHR1cmUsXHJcbiAgICAgICAgICAgIHJlZ2lvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb3B5RnJhbWVidWZmZXJUb0J1ZmZlciAoXHJcbiAgICAgICAgc3JjRnJhbWVidWZmZXI6IEdGWEZyYW1lYnVmZmVyLFxyXG4gICAgICAgIGRzdEJ1ZmZlcjogQXJyYXlCdWZmZXIsXHJcbiAgICAgICAgcmVnaW9uczogR0ZYQnVmZmVyVGV4dHVyZUNvcHlbXSkge1xyXG5cclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuX3dlYkdMMlJDIGFzIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQ7XHJcbiAgICAgICAgY29uc3QgZ3B1RnJhbWVidWZmZXIgPSAoc3JjRnJhbWVidWZmZXIgYXMgV2ViR0wyRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGZvcm1hdCA9IGdwdUZyYW1lYnVmZmVyLmdwdUNvbG9yVGV4dHVyZXNbMF0uZm9ybWF0O1xyXG4gICAgICAgIGNvbnN0IGdsRm9ybWF0ID0gR0ZYRm9ybWF0VG9XZWJHTEZvcm1hdChmb3JtYXQsIGdsKTtcclxuICAgICAgICBjb25zdCBnbFR5cGUgPSBHRlhGb3JtYXRUb1dlYkdMVHlwZShmb3JtYXQsIGdsKTtcclxuICAgICAgICBjb25zdCBjdG9yID0gZ2V0VHlwZWRBcnJheUNvbnN0cnVjdG9yKEdGWEZvcm1hdEluZm9zW2Zvcm1hdF0pO1xyXG5cclxuICAgICAgICBjb25zdCBjdXJGQk8gPSB0aGlzLnN0YXRlQ2FjaGUuZ2xGcmFtZWJ1ZmZlcjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyICE9PSBncHVGcmFtZWJ1ZmZlci5nbEZyYW1lYnVmZmVyKSB7XHJcbiAgICAgICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcik7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyID0gZ3B1RnJhbWVidWZmZXIuZ2xGcmFtZWJ1ZmZlcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHZpZXcgPSBuZXcgY3Rvcihkc3RCdWZmZXIpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiByZWdpb25zKSB7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3ID0gcmVnaW9uLnRleEV4dGVudC53aWR0aDtcclxuICAgICAgICAgICAgY29uc3QgaCA9IHJlZ2lvbi50ZXhFeHRlbnQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgZ2wucmVhZFBpeGVscyhyZWdpb24udGV4T2Zmc2V0LngsIHJlZ2lvbi50ZXhPZmZzZXQueSwgdywgaCwgZ2xGb3JtYXQsIGdsVHlwZSwgdmlldyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZUNhY2hlLmdsRnJhbWVidWZmZXIgIT09IGN1ckZCTykge1xyXG4gICAgICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGN1ckZCTyk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGVDYWNoZS5nbEZyYW1lYnVmZmVyID0gY3VyRkJPO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYmxpdEZyYW1lYnVmZmVyIChzcmM6IEdGWEZyYW1lYnVmZmVyLCBkc3Q6IEdGWEZyYW1lYnVmZmVyLCBzcmNSZWN0OiBHRlhSZWN0LCBkc3RSZWN0OiBHRlhSZWN0LCBmaWx0ZXI6IEdGWEZpbHRlcikge1xyXG4gICAgICAgIGNvbnN0IHNyY0ZCTyA9IChzcmMgYXMgV2ViR0wyRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGRzdEZCTyA9IChkc3QgYXMgV2ViR0wyRnJhbWVidWZmZXIpLmdwdUZyYW1lYnVmZmVyO1xyXG5cclxuICAgICAgICBXZWJHTDJDbWRGdW5jQmxpdEZyYW1lYnVmZmVyKFxyXG4gICAgICAgICAgICB0aGlzLFxyXG4gICAgICAgICAgICBzcmNGQk8sXHJcbiAgICAgICAgICAgIGRzdEZCTyxcclxuICAgICAgICAgICAgc3JjUmVjdCxcclxuICAgICAgICAgICAgZHN0UmVjdCxcclxuICAgICAgICAgICAgZmlsdGVyLFxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRFeHRlbnNpb24gKGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICBjb25zdCBwcmVmaXhlcyA9IFsnJywgJ1dFQktJVF8nLCAnTU9aXyddO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcHJlZml4ZXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgX2V4dCA9IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKHByZWZpeGVzW2ldICsgZXh0KTtcclxuICAgICAgICAgICAgaWYgKF9leHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBfZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaW5pdFN0YXRlcyAoZ2w6IFdlYkdMMlJlbmRlcmluZ0NvbnRleHQpIHtcclxuXHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCk7XHJcbiAgICAgICAgZ2wucGl4ZWxTdG9yZWkoZ2wuUEFDS19BTElHTk1FTlQsIDEpO1xyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19BTElHTk1FTlQsIDEpO1xyXG4gICAgICAgIGdsLnBpeGVsU3RvcmVpKGdsLlVOUEFDS19GTElQX1lfV0VCR0wsIDApO1xyXG5cclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG5cclxuICAgICAgICAvLyByYXN0ZXJpYXplciBzdGF0ZVxyXG4gICAgICAgIGdsLmVuYWJsZShnbC5DVUxMX0ZBQ0UpO1xyXG4gICAgICAgIGdsLmN1bGxGYWNlKGdsLkJBQ0spO1xyXG4gICAgICAgIGdsLmZyb250RmFjZShnbC5DQ1cpO1xyXG4gICAgICAgIGdsLnBvbHlnb25PZmZzZXQoMC4wLCAwLjApO1xyXG5cclxuICAgICAgICAvLyBkZXB0aCBzdGVuY2lsIHN0YXRlXHJcbiAgICAgICAgZ2wuZW5hYmxlKGdsLkRFUFRIX1RFU1QpO1xyXG4gICAgICAgIGdsLmRlcHRoTWFzayh0cnVlKTtcclxuICAgICAgICBnbC5kZXB0aEZ1bmMoZ2wuTEVTUyk7XHJcblxyXG4gICAgICAgIGdsLnN0ZW5jaWxGdW5jU2VwYXJhdGUoZ2wuRlJPTlQsIGdsLkFMV0FZUywgMSwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5GUk9OVCwgZ2wuS0VFUCwgZ2wuS0VFUCwgZ2wuS0VFUCk7XHJcbiAgICAgICAgZ2wuc3RlbmNpbE1hc2tTZXBhcmF0ZShnbC5GUk9OVCwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsRnVuY1NlcGFyYXRlKGdsLkJBQ0ssIGdsLkFMV0FZUywgMSwgMHhmZmZmKTtcclxuICAgICAgICBnbC5zdGVuY2lsT3BTZXBhcmF0ZShnbC5CQUNLLCBnbC5LRUVQLCBnbC5LRUVQLCBnbC5LRUVQKTtcclxuICAgICAgICBnbC5zdGVuY2lsTWFza1NlcGFyYXRlKGdsLkJBQ0ssIDB4ZmZmZik7XHJcblxyXG4gICAgICAgIGdsLmRpc2FibGUoZ2wuU1RFTkNJTF9URVNUKTtcclxuXHJcbiAgICAgICAgLy8gYmxlbmQgc3RhdGVcclxuICAgICAgICBnbC5kaXNhYmxlKGdsLlNBTVBMRV9BTFBIQV9UT19DT1ZFUkFHRSk7XHJcbiAgICAgICAgZ2wuZGlzYWJsZShnbC5CTEVORCk7XHJcbiAgICAgICAgZ2wuYmxlbmRFcXVhdGlvblNlcGFyYXRlKGdsLkZVTkNfQURELCBnbC5GVU5DX0FERCk7XHJcbiAgICAgICAgZ2wuYmxlbmRGdW5jU2VwYXJhdGUoZ2wuT05FLCBnbC5aRVJPLCBnbC5PTkUsIGdsLlpFUk8pO1xyXG4gICAgICAgIGdsLmNvbG9yTWFzayh0cnVlLCB0cnVlLCB0cnVlLCB0cnVlKTtcclxuICAgICAgICBnbC5ibGVuZENvbG9yKDAuMCwgMC4wLCAwLjAsIDAuMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfb25XZWJHTENvbnRleHRMb3N0IChldmVudDogRXZlbnQpIHtcclxuICAgICAgICB3YXJuSUQoMTEwMDApO1xyXG4gICAgICAgIHdhcm4oZXZlbnQpO1xyXG4gICAgICAgIC8vIDIwMjAuOS4zOiBgcHJldmVudERlZmF1bHRgIGlzIG5vdCBhdmFpbGFibGUgb24gc29tZSBwbGF0Zm9ybXNcclxuICAgICAgICAvLyBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==