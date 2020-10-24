(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../render-pipeline.js", "./gbuffer-flow.js", "./lighting-flow.js", "../pipeline-serialization.js", "../shadow/shadow-flow.js", "../../renderer/core/sampler-lib.js", "../../gfx/define.js", "../define.js", "../../gfx/index.js", "../../renderer/scene/camera.js", "../../global-exports.js", "../../math/index.js", "../../gfx/device.js", "../../renderer/scene/fog.js", "../../renderer/scene/ambient.js", "../../renderer/scene/skybox.js", "../../renderer/scene/shadows.js", "./scene-culling.js", "../ui/ui-flow.js", "../../gfx/input-assembler.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../render-pipeline.js"), require("./gbuffer-flow.js"), require("./lighting-flow.js"), require("../pipeline-serialization.js"), require("../shadow/shadow-flow.js"), require("../../renderer/core/sampler-lib.js"), require("../../gfx/define.js"), require("../define.js"), require("../../gfx/index.js"), require("../../renderer/scene/camera.js"), require("../../global-exports.js"), require("../../math/index.js"), require("../../gfx/device.js"), require("../../renderer/scene/fog.js"), require("../../renderer/scene/ambient.js"), require("../../renderer/scene/skybox.js"), require("../../renderer/scene/shadows.js"), require("./scene-culling.js"), require("../ui/ui-flow.js"), require("../../gfx/input-assembler.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.renderPipeline, global.gbufferFlow, global.lightingFlow, global.pipelineSerialization, global.shadowFlow, global.samplerLib, global.define, global.define, global.index, global.camera, global.globalExports, global.index, global.device, global.fog, global.ambient, global.skybox, global.shadows, global.sceneCulling, global.uiFlow, global.inputAssembler);
    global.deferredPipeline = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _renderPipeline, _gbufferFlow, _lightingFlow, _pipelineSerialization, _shadowFlow, _samplerLib, _define, _define2, _index2, _camera, _globalExports, _index3, _device, _fog, _ambient, _skybox, _shadows, _sceneCulling, _uiFlow, _inputAssembler) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.DeferredPipeline = void 0;

  var _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _temp;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

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

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  var matShadowView = new _index3.Mat4();
  var matShadowViewProj = new _index3.Mat4();
  var vec4 = new _index3.Vec4();
  /**
   * @en The deferred render pipeline
   * @zh 前向渲染管线。
   */

  var DeferredPipeline = (_dec = (0, _index.ccclass)('DeferredPipeline'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderTextureConfig]), _dec3 = (0, _index.displayOrder)(2), _dec4 = (0, _index.type)([_pipelineSerialization.MaterialConfig]), _dec5 = (0, _index.displayOrder)(3), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_RenderPipeline) {
    _inherits(DeferredPipeline, _RenderPipeline);

    function DeferredPipeline() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, DeferredPipeline);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(DeferredPipeline)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _initializerDefineProperty(_this, "renderTextures", _descriptor, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "materials", _descriptor2, _assertThisInitialized(_this));

      _this.fog = new _fog.Fog();
      _this.ambient = new _ambient.Ambient();
      _this.skybox = new _skybox.Skybox();
      _this.shadows = new _shadows.Shadows();
      _this.renderObjects = [];
      _this.shadowObjects = [];
      _this._isHDR = false;
      _this._shadingScale = 1.0;
      _this._fpScale = 1.0 / 1024.0;
      _this._renderPasses = new Map();
      _this._globalUBO = new Float32Array(_define2.UBOGlobal.COUNT);
      _this._shadowUBO = new Float32Array(_define2.UBOShadow.COUNT);
      _this._quadVB = null;
      _this._quadIB = null;
      _this._quadIA = null;
      return _this;
    }

    _createClass(DeferredPipeline, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(DeferredPipeline.prototype), "initialize", this).call(this, info);

        if (this._flows.length === 0) {
          var shadowFlow = new _shadowFlow.ShadowFlow();
          shadowFlow.initialize(_shadowFlow.ShadowFlow.initInfo);

          this._flows.push(shadowFlow);

          var gbufferFlow = new _gbufferFlow.GbufferFlow();
          gbufferFlow.initialize(_gbufferFlow.GbufferFlow.initInfo);

          this._flows.push(gbufferFlow);

          var lightingFlow = new _lightingFlow.LightingFlow();
          lightingFlow.initialize(_lightingFlow.LightingFlow.initInfo);

          this._flows.push(lightingFlow);

          var uiFlow = new _uiFlow.UIFlow();
          uiFlow.initialize(_uiFlow.UIFlow.initInfo);

          this._flows.push(uiFlow);

          uiFlow.activate(this);
        }

        return true;
      }
    }, {
      key: "activate",
      value: function activate() {
        this._macros = {};

        if (!_get(_getPrototypeOf(DeferredPipeline.prototype), "activate", this).call(this)) {
          return false;
        }

        if (!this._activeRenderer()) {
          console.error('DeferredPipeline startup failed!');
          return false;
        }

        return true;
      }
    }, {
      key: "render",
      value: function render(views) {
        for (var i = 0; i < views.length; i++) {
          var view = views[i];
          (0, _sceneCulling.sceneCulling)(this, view);

          for (var j = 0; j < view.flows.length; j++) {
            view.flows[j].render(view);
          }
        }

        this._commandBuffers[0].end();

        this._device.queue.submit(this._commandBuffers);
      }
    }, {
      key: "getRenderPass",
      value: function getRenderPass(clearFlags) {
        var renderPass = this._renderPasses.get(clearFlags);

        if (renderPass) {
          return renderPass;
        }

        var device = this.device;
        var colorAttachment = new _index2.GFXColorAttachment();
        var depthStencilAttachment = new _index2.GFXDepthStencilAttachment();
        colorAttachment.format = device.colorFormat;
        depthStencilAttachment.format = device.depthStencilFormat;

        if (!(clearFlags & _define.GFXClearFlag.COLOR)) {
          if (clearFlags & _camera.SKYBOX_FLAG) {
            colorAttachment.loadOp = _index2.GFXLoadOp.DISCARD;
          } else {
            colorAttachment.loadOp = _index2.GFXLoadOp.LOAD;
            colorAttachment.beginLayout = _index2.GFXTextureLayout.PRESENT_SRC;
          }
        }

        if ((clearFlags & _define.GFXClearFlag.DEPTH_STENCIL) !== _define.GFXClearFlag.DEPTH_STENCIL) {
          if (!(clearFlags & _define.GFXClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = _index2.GFXLoadOp.LOAD;
          if (!(clearFlags & _define.GFXClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = _index2.GFXLoadOp.LOAD;
          depthStencilAttachment.beginLayout = _index2.GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
        }

        var renderPassInfo = new _index2.GFXRenderPassInfo([colorAttachment], depthStencilAttachment);
        renderPass = device.createRenderPass(renderPassInfo);

        this._renderPasses.set(clearFlags, renderPass);

        return renderPass;
      }
      /**
       * @en Update all UBOs
       * @zh 更新全部 UBO。
       */

    }, {
      key: "updateUBOs",
      value: function updateUBOs(view) {
        this._updateUBO(view);

        var mainLight = view.camera.scene.mainLight;
        var device = this.device;
        var shadowInfo = this.shadows;

        if (mainLight && shadowInfo.type === _shadows.ShadowType.ShadowMap) {
          // light view
          var shadowCameraView = (0, _sceneCulling.getShadowWorldMatrix)(this, mainLight.node.worldRotation, mainLight.direction);

          _index3.Mat4.invert(matShadowView, shadowCameraView); // light proj


          var x = 0;
          var y = 0;

          if (shadowInfo.orthoSize > shadowInfo.sphere.radius) {
            x = shadowInfo.orthoSize * shadowInfo.aspect;
            y = shadowInfo.orthoSize;
          } else {
            // if orthoSize is the smallest, auto calculate orthoSize.
            x = shadowInfo.sphere.radius * shadowInfo.aspect;
            y = shadowInfo.sphere.radius;
          }

          var projectionSignY = device.screenSpaceSignY * device.UVSpaceSignY; // always offscreen

          _index3.Mat4.ortho(matShadowViewProj, -x, x, -y, y, shadowInfo.near, shadowInfo.far, device.clipSpaceMinZ, projectionSignY); // light viewProj


          _index3.Mat4.multiply(matShadowViewProj, matShadowViewProj, matShadowView);

          _index3.Mat4.toArray(this._shadowUBO, matShadowViewProj, _define2.UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

          vec4.set(shadowInfo.pcf);

          _index3.Vec4.toArray(this._shadowUBO, vec4, _define2.UBOShadow.SHADOW_PCF_OFFSET);

          vec4.set(shadowInfo.size.x, shadowInfo.size.y);

          _index3.Vec4.toArray(this._shadowUBO, vec4, _define2.UBOShadow.SHADOW_SIZE_OFFSET);
        } // update ubos


        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(_define2.UBOGlobal.BINDING), this._globalUBO);

        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(_define2.UBOShadow.BINDING), this._shadowUBO);
      }
    }, {
      key: "_activeRenderer",
      value: function _activeRenderer() {
        var device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        var globalUBO = device.createBuffer(new _index2.GFXBufferInfo(_define.GFXBufferUsageBit.UNIFORM | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _define2.UBOGlobal.SIZE, _define2.UBOGlobal.SIZE));

        this._descriptorSet.bindBuffer(_define2.UBOGlobal.BINDING, globalUBO);

        var shadowUBO = device.createBuffer(new _index2.GFXBufferInfo(_define.GFXBufferUsageBit.UNIFORM | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _define2.UBOShadow.SIZE, _define2.UBOShadow.SIZE));

        this._descriptorSet.bindBuffer(_define2.UBOShadow.BINDING, shadowUBO);

        var shadowMapSamplerHash = (0, _samplerLib.genSamplerHash)([_define.GFXFilter.LINEAR, _define.GFXFilter.LINEAR, _define.GFXFilter.NONE, _define.GFXAddress.CLAMP, _define.GFXAddress.CLAMP, _define.GFXAddress.CLAMP]);

        var shadowMapSampler = _samplerLib.samplerLib.getSampler(device, shadowMapSamplerHash);

        this._descriptorSet.bindSampler(_define2.UNIFORM_SHADOWMAP_BINDING, shadowMapSampler);

        this._descriptorSet.bindSampler(_define2.UNIFORM_GBUFFER_ALBEDOMAP_BINDING, shadowMapSampler);

        this._descriptorSet.bindSampler(_define2.UNIFORM_GBUFFER_POSITIONMAP_BINDING, shadowMapSampler);

        this._descriptorSet.bindSampler(_define2.UNIFORM_GBUFFER_NORMALMAP_BINDING, shadowMapSampler);

        this._descriptorSet.bindSampler(_define2.UNIFORM_GBUFFER_EMISSIVEMAP_BINDING, shadowMapSampler); // update global defines when all states initialized.


        this.macros.CC_USE_HDR = this._isHDR;
        this.macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(_device.GFXFeature.TEXTURE_FLOAT);

        if (!this.createQuadInputAssembler()) {
          return false;
        }

        return true;
      }
    }, {
      key: "_updateUBO",
      value: function _updateUBO(view) {
        this._descriptorSet.update();

        var root = _globalExports.legacyCC.director.root;
        var camera = view.camera;
        var scene = camera.scene;
        var mainLight = scene.mainLight;
        var ambient = this.ambient;
        var fog = this.fog;
        var fv = this._globalUBO;
        var device = this.device;
        var shadingWidth = Math.floor(device.width);
        var shadingHeight = Math.floor(device.height); // update UBOGlobal

        fv[_define2.UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[_define2.UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[_define2.UBOGlobal.TIME_OFFSET + 2] = _globalExports.legacyCC.director.getTotalFrames();
        fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET];
        fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[_define2.UBOGlobal.SCREEN_SIZE_OFFSET + 1];
        fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * this.shadingScale;
        fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * this.shadingScale;
        fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET];
        fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[_define2.UBOGlobal.SCREEN_SCALE_OFFSET + 1];
        fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[_define2.UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        _index3.Mat4.toArray(fv, camera.matView, _define2.UBOGlobal.MAT_VIEW_OFFSET);

        _index3.Mat4.toArray(fv, camera.node.worldMatrix, _define2.UBOGlobal.MAT_VIEW_INV_OFFSET);

        _index3.Mat4.toArray(fv, camera.matProj, _define2.UBOGlobal.MAT_PROJ_OFFSET);

        _index3.Mat4.toArray(fv, camera.matProjInv, _define2.UBOGlobal.MAT_PROJ_INV_OFFSET);

        _index3.Mat4.toArray(fv, camera.matViewProj, _define2.UBOGlobal.MAT_VIEW_PROJ_OFFSET);

        _index3.Mat4.toArray(fv, camera.matViewProjInv, _define2.UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);

        _index3.Vec3.toArray(fv, camera.position, _define2.UBOGlobal.CAMERA_POS_OFFSET);

        var projectionSignY = device.screenSpaceSignY;

        if (view.window.hasOffScreenAttachments) {
          projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }

        fv[_define2.UBOGlobal.CAMERA_POS_OFFSET + 3] = projectionSignY;
        var exposure = camera.exposure;
        fv[_define2.UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[_define2.UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[_define2.UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        fv[_define2.UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
          _index3.Vec3.toArray(fv, mainLight.direction, _define2.UBOGlobal.MAIN_LIT_DIR_OFFSET);

          _index3.Vec3.toArray(fv, mainLight.color, _define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET);

          if (mainLight.useColorTemperature) {
            var colorTempRGB = mainLight.colorTemperatureRGB;
            fv[_define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            fv[_define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            fv[_define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
          }

          if (this._isHDR) {
            fv[_define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
          } else {
            fv[_define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
          }
        } else {
          _index3.Vec3.toArray(fv, _index3.Vec3.UNIT_Z, _define2.UBOGlobal.MAIN_LIT_DIR_OFFSET);

          _index3.Vec4.toArray(fv, _index3.Vec4.ZERO, _define2.UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        var skyColor = ambient.colorArray;

        if (this._isHDR) {
          skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
          skyColor[3] = ambient.skyIllum * exposure;
        }

        fv.set(skyColor, _define2.UBOGlobal.AMBIENT_SKY_OFFSET);
        fv.set(ambient.albedoArray, _define2.UBOGlobal.AMBIENT_GROUND_OFFSET);

        if (fog.enabled) {
          fv.set(fog.colorArray, _define2.UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);
          fv[_define2.UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
          fv[_define2.UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
          fv[_define2.UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;
          fv[_define2.UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
          fv[_define2.UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
          fv[_define2.UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
        }
      }
    }, {
      key: "destroyUBOs",
      value: function destroyUBOs() {
        if (this._descriptorSet) {
          this._descriptorSet.getBuffer(_define2.UBOGlobal.BINDING).destroy();

          this._descriptorSet.getBuffer(_define2.UBOShadow.BINDING).destroy();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyUBOs();
        this.destroyQuadInputAssembler();

        var rpIter = this._renderPasses.values();

        var rpRes = rpIter.next();

        while (!rpRes.done) {
          rpRes.value.destroy();
          rpRes = rpIter.next();
        }

        this._commandBuffers.length = 0;
        this.ambient.destroy();
        this.skybox.destroy();
        this.fog.destroy();
        this.shadows.destroy();
        return _get(_getPrototypeOf(DeferredPipeline.prototype), "destroy", this).call(this);
      }
      /**
       * @zh
       * 创建四边形输入汇集器。
       */

    }, {
      key: "createQuadInputAssembler",
      value: function createQuadInputAssembler() {
        // create vertex buffer
        var vbStride = Float32Array.BYTES_PER_ELEMENT * 4;
        var vbSize = vbStride * 4;
        this._quadVB = this._device.createBuffer(new _index2.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, vbSize, vbStride));

        if (!this._quadVB) {
          return false;
        }

        var verts = new Float32Array(4 * 4);
        var n = 0;
        verts[n++] = -1.0;
        verts[n++] = -1.0;
        verts[n++] = 0.0;
        verts[n++] = 0.0;
        verts[n++] = 1.0;
        verts[n++] = -1.0;
        verts[n++] = 1.0;
        verts[n++] = 0.0;
        verts[n++] = -1.0;
        verts[n++] = 1.0;
        verts[n++] = 0.0;
        verts[n++] = 1.0;
        verts[n++] = 1.0;
        verts[n++] = 1.0;
        verts[n++] = 1.0;
        verts[n++] = 1.0;

        this._quadVB.update(verts); // create index buffer


        var ibStride = Uint8Array.BYTES_PER_ELEMENT;
        var ibSize = ibStride * 6;
        this._quadIB = this._device.createBuffer(new _index2.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, ibSize, ibStride));

        if (!this._quadIB) {
          return false;
        }

        var indices = new Uint8Array(6);
        indices[0] = 0;
        indices[1] = 1;
        indices[2] = 2;
        indices[3] = 1;
        indices[4] = 3;
        indices[5] = 2;

        this._quadIB.update(indices); // create input assembler


        var attributes = new Array(2);
        attributes[0] = new _inputAssembler.GFXAttribute('a_position', _define.GFXFormat.RG32F);
        attributes[1] = new _inputAssembler.GFXAttribute('a_texCoord', _define.GFXFormat.RG32F);
        this._quadIA = this._device.createInputAssembler(new _inputAssembler.GFXInputAssemblerInfo(attributes, [this._quadVB], this._quadIB));
        return true;
      }
      /**
       * @zh
       * 销毁四边形输入汇集器。
       */

    }, {
      key: "destroyQuadInputAssembler",
      value: function destroyQuadInputAssembler() {
        if (this._quadVB) {
          this._quadVB.destroy();

          this._quadVB = null;
        }

        if (this._quadIB) {
          this._quadIB.destroy();

          this._quadIB = null;
        }

        if (this._quadIA) {
          this._quadIA.destroy();

          this._quadIA = null;
        }
      }
    }, {
      key: "isHDR",
      get: function get() {
        return this._isHDR;
      },
      set: function set(val) {
        if (this._isHDR === val) {
          return;
        }

        this._isHDR = val;
        var defaultGlobalUBOData = this._globalUBO;
        defaultGlobalUBOData[_define2.UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
      }
    }, {
      key: "shadingScale",
      get: function get() {
        return this._shadingScale;
      }
    }, {
      key: "fpScale",
      get: function get() {
        return this._fpScale;
      }
      /**
       * @zh
       * 四边形输入汇集器。
       */

    }, {
      key: "quadIA",
      get: function get() {
        return this._quadIA;
      }
      /**
       * @en Get shadow UBO.
       * @zh 获取阴影UBO。
       */

    }, {
      key: "shadowUBO",
      get: function get() {
        return this._shadowUBO;
      }
    }]);

    return DeferredPipeline;
  }(_renderPipeline.RenderPipeline), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "renderTextures", [_dec2, _index.serializable, _dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "materials", [_dec4, _index.serializable, _dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  })), _class2)) || _class);
  _exports.DeferredPipeline = DeferredPipeline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZGVmZXJyZWQvZGVmZXJyZWQtcGlwZWxpbmUudHMiXSwibmFtZXMiOlsibWF0U2hhZG93VmlldyIsIk1hdDQiLCJtYXRTaGFkb3dWaWV3UHJvaiIsInZlYzQiLCJWZWM0IiwiRGVmZXJyZWRQaXBlbGluZSIsIlJlbmRlclRleHR1cmVDb25maWciLCJNYXRlcmlhbENvbmZpZyIsImZvZyIsIkZvZyIsImFtYmllbnQiLCJBbWJpZW50Iiwic2t5Ym94IiwiU2t5Ym94Iiwic2hhZG93cyIsIlNoYWRvd3MiLCJyZW5kZXJPYmplY3RzIiwic2hhZG93T2JqZWN0cyIsIl9pc0hEUiIsIl9zaGFkaW5nU2NhbGUiLCJfZnBTY2FsZSIsIl9yZW5kZXJQYXNzZXMiLCJNYXAiLCJfZ2xvYmFsVUJPIiwiRmxvYXQzMkFycmF5IiwiVUJPR2xvYmFsIiwiQ09VTlQiLCJfc2hhZG93VUJPIiwiVUJPU2hhZG93IiwiX3F1YWRWQiIsIl9xdWFkSUIiLCJfcXVhZElBIiwiaW5mbyIsIl9mbG93cyIsImxlbmd0aCIsInNoYWRvd0Zsb3ciLCJTaGFkb3dGbG93IiwiaW5pdGlhbGl6ZSIsImluaXRJbmZvIiwicHVzaCIsImdidWZmZXJGbG93IiwiR2J1ZmZlckZsb3ciLCJsaWdodGluZ0Zsb3ciLCJMaWdodGluZ0Zsb3ciLCJ1aUZsb3ciLCJVSUZsb3ciLCJhY3RpdmF0ZSIsIl9tYWNyb3MiLCJfYWN0aXZlUmVuZGVyZXIiLCJjb25zb2xlIiwiZXJyb3IiLCJ2aWV3cyIsImkiLCJ2aWV3IiwiaiIsImZsb3dzIiwicmVuZGVyIiwiX2NvbW1hbmRCdWZmZXJzIiwiZW5kIiwiX2RldmljZSIsInF1ZXVlIiwic3VibWl0IiwiY2xlYXJGbGFncyIsInJlbmRlclBhc3MiLCJnZXQiLCJkZXZpY2UiLCJjb2xvckF0dGFjaG1lbnQiLCJHRlhDb2xvckF0dGFjaG1lbnQiLCJkZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCIsImZvcm1hdCIsImNvbG9yRm9ybWF0IiwiZGVwdGhTdGVuY2lsRm9ybWF0IiwiR0ZYQ2xlYXJGbGFnIiwiQ09MT1IiLCJTS1lCT1hfRkxBRyIsImxvYWRPcCIsIkdGWExvYWRPcCIsIkRJU0NBUkQiLCJMT0FEIiwiYmVnaW5MYXlvdXQiLCJHRlhUZXh0dXJlTGF5b3V0IiwiUFJFU0VOVF9TUkMiLCJERVBUSF9TVEVOQ0lMIiwiREVQVEgiLCJkZXB0aExvYWRPcCIsIlNURU5DSUwiLCJzdGVuY2lsTG9hZE9wIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwiLCJyZW5kZXJQYXNzSW5mbyIsIkdGWFJlbmRlclBhc3NJbmZvIiwiY3JlYXRlUmVuZGVyUGFzcyIsInNldCIsIl91cGRhdGVVQk8iLCJtYWluTGlnaHQiLCJjYW1lcmEiLCJzY2VuZSIsInNoYWRvd0luZm8iLCJ0eXBlIiwiU2hhZG93VHlwZSIsIlNoYWRvd01hcCIsInNoYWRvd0NhbWVyYVZpZXciLCJub2RlIiwid29ybGRSb3RhdGlvbiIsImRpcmVjdGlvbiIsImludmVydCIsIngiLCJ5Iiwib3J0aG9TaXplIiwic3BoZXJlIiwicmFkaXVzIiwiYXNwZWN0IiwicHJvamVjdGlvblNpZ25ZIiwic2NyZWVuU3BhY2VTaWduWSIsIlVWU3BhY2VTaWduWSIsIm9ydGhvIiwibmVhciIsImZhciIsImNsaXBTcGFjZU1pbloiLCJtdWx0aXBseSIsInRvQXJyYXkiLCJNQVRfTElHSFRfVklFV19QUk9KX09GRlNFVCIsInBjZiIsIlNIQURPV19QQ0ZfT0ZGU0VUIiwic2l6ZSIsIlNIQURPV19TSVpFX09GRlNFVCIsInVwZGF0ZUJ1ZmZlciIsIl9kZXNjcmlwdG9yU2V0IiwiZ2V0QnVmZmVyIiwiQklORElORyIsImNvbW1hbmRCdWZmZXIiLCJnbG9iYWxVQk8iLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJVTklGT1JNIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiU0laRSIsImJpbmRCdWZmZXIiLCJzaGFkb3dVQk8iLCJzaGFkb3dNYXBTYW1wbGVySGFzaCIsIkdGWEZpbHRlciIsIkxJTkVBUiIsIk5PTkUiLCJHRlhBZGRyZXNzIiwiQ0xBTVAiLCJzaGFkb3dNYXBTYW1wbGVyIiwic2FtcGxlckxpYiIsImdldFNhbXBsZXIiLCJiaW5kU2FtcGxlciIsIlVOSUZPUk1fU0hBRE9XTUFQX0JJTkRJTkciLCJVTklGT1JNX0dCVUZGRVJfQUxCRURPTUFQX0JJTkRJTkciLCJVTklGT1JNX0dCVUZGRVJfUE9TSVRJT05NQVBfQklORElORyIsIlVOSUZPUk1fR0JVRkZFUl9OT1JNQUxNQVBfQklORElORyIsIlVOSUZPUk1fR0JVRkZFUl9FTUlTU0lWRU1BUF9CSU5ESU5HIiwibWFjcm9zIiwiQ0NfVVNFX0hEUiIsIkNDX1NVUFBPUlRfRkxPQVRfVEVYVFVSRSIsImhhc0ZlYXR1cmUiLCJHRlhGZWF0dXJlIiwiVEVYVFVSRV9GTE9BVCIsImNyZWF0ZVF1YWRJbnB1dEFzc2VtYmxlciIsInVwZGF0ZSIsInJvb3QiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwiZnYiLCJzaGFkaW5nV2lkdGgiLCJNYXRoIiwiZmxvb3IiLCJ3aWR0aCIsInNoYWRpbmdIZWlnaHQiLCJoZWlnaHQiLCJUSU1FX09GRlNFVCIsImN1bXVsYXRpdmVUaW1lIiwiZnJhbWVUaW1lIiwiZ2V0VG90YWxGcmFtZXMiLCJTQ1JFRU5fU0laRV9PRkZTRVQiLCJTQ1JFRU5fU0NBTEVfT0ZGU0VUIiwic2hhZGluZ1NjYWxlIiwiTkFUSVZFX1NJWkVfT0ZGU0VUIiwibWF0VmlldyIsIk1BVF9WSUVXX09GRlNFVCIsIndvcmxkTWF0cml4IiwiTUFUX1ZJRVdfSU5WX09GRlNFVCIsIm1hdFByb2oiLCJNQVRfUFJPSl9PRkZTRVQiLCJtYXRQcm9qSW52IiwiTUFUX1BST0pfSU5WX09GRlNFVCIsIm1hdFZpZXdQcm9qIiwiTUFUX1ZJRVdfUFJPSl9PRkZTRVQiLCJtYXRWaWV3UHJvakludiIsIk1BVF9WSUVXX1BST0pfSU5WX09GRlNFVCIsIlZlYzMiLCJwb3NpdGlvbiIsIkNBTUVSQV9QT1NfT0ZGU0VUIiwid2luZG93IiwiaGFzT2ZmU2NyZWVuQXR0YWNobWVudHMiLCJleHBvc3VyZSIsIkVYUE9TVVJFX09GRlNFVCIsIk1BSU5fTElUX0RJUl9PRkZTRVQiLCJjb2xvciIsIk1BSU5fTElUX0NPTE9SX09GRlNFVCIsInVzZUNvbG9yVGVtcGVyYXR1cmUiLCJjb2xvclRlbXBSR0IiLCJjb2xvclRlbXBlcmF0dXJlUkdCIiwieiIsImlsbHVtaW5hbmNlIiwiVU5JVF9aIiwiWkVSTyIsInNreUNvbG9yIiwiY29sb3JBcnJheSIsInNreUlsbHVtIiwiQU1CSUVOVF9TS1lfT0ZGU0VUIiwiYWxiZWRvQXJyYXkiLCJBTUJJRU5UX0dST1VORF9PRkZTRVQiLCJlbmFibGVkIiwiR0xPQkFMX0ZPR19DT0xPUl9PRkZTRVQiLCJHTE9CQUxfRk9HX0JBU0VfT0ZGU0VUIiwiZm9nU3RhcnQiLCJmb2dFbmQiLCJmb2dEZW5zaXR5IiwiR0xPQkFMX0ZPR19BRERfT0ZGU0VUIiwiZm9nVG9wIiwiZm9nUmFuZ2UiLCJmb2dBdHRlbiIsImRlc3Ryb3kiLCJkZXN0cm95VUJPcyIsImRlc3Ryb3lRdWFkSW5wdXRBc3NlbWJsZXIiLCJycEl0ZXIiLCJ2YWx1ZXMiLCJycFJlcyIsIm5leHQiLCJkb25lIiwidmFsdWUiLCJ2YlN0cmlkZSIsIkJZVEVTX1BFUl9FTEVNRU5UIiwidmJTaXplIiwiVkVSVEVYIiwidmVydHMiLCJuIiwiaWJTdHJpZGUiLCJVaW50OEFycmF5IiwiaWJTaXplIiwiSU5ERVgiLCJpbmRpY2VzIiwiYXR0cmlidXRlcyIsIkFycmF5IiwiR0ZYQXR0cmlidXRlIiwiR0ZYRm9ybWF0IiwiUkczMkYiLCJjcmVhdGVJbnB1dEFzc2VtYmxlciIsIkdGWElucHV0QXNzZW1ibGVySW5mbyIsInZhbCIsImRlZmF1bHRHbG9iYWxVQk9EYXRhIiwiUmVuZGVyUGlwZWxp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ZSxJQUFmO0FBQ0g7O0FBRUQsWUFBSSxLQUFLQyxPQUFULEVBQWtCO0FBQ2QsZUFBS0EsT0FBTCxDQUFhdU0sT0FBYjs7QUFDQSxlQUFLdk0sT0FBTCxHQUFlLElBQWY7QUFDSDs7QUFFRCxZQUFJLEtBQUtDLE9BQVQsRUFBa0I7QUFDZCxlQUFLQSxPQUFMLENBQWFzTSxPQUFiOztBQUNBLGVBQUt0TSxPQUFMLEdBQWUsSUFBZjtBQUNIO0FBQ0o7OzswQkE1Y1k7QUFDVCxlQUFPLEtBQUtiLE1BQVo7QUFDSCxPO3dCQUVVOE8sRyxFQUFLO0FBQ1osWUFBSSxLQUFLOU8sTUFBTCxLQUFnQjhPLEdBQXBCLEVBQXlCO0FBQ3JCO0FBQ0g7O0FBRUQsYUFBSzlPLE1BQUwsR0FBYzhPLEdBQWQ7QUFDQSxZQUFNQyxvQkFBb0IsR0FBRyxLQUFLMU8sVUFBbEM7QUFDQTBPLFFBQUFBLG9CQUFvQixDQUFDeE8sbUJBQVVpTCxlQUFWLEdBQTRCLENBQTdCLENBQXBCLEdBQXNELEtBQUt4TCxNQUFMLEdBQWMsR0FBZCxHQUFvQixHQUExRTtBQUNIOzs7MEJBRTJCO0FBQ3hCLGVBQU8sS0FBS0MsYUFBWjtBQUNIOzs7MEJBRXNCO0FBQ25CLGVBQU8sS0FBS0MsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXdDO0FBQ3BDLGVBQU8sS0FBS1csT0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSStCO0FBQzNCLGVBQU8sS0FBS0osVUFBWjtBQUNIOzs7O0lBdENpQ3VPLDhCLGlHQXlDakNDLG1COzs7OzthQUVpRCxFOzt1RkFHakRBLG1COzs7OzthQUV1QyxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaXBlbGluZVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IGNjY2xhc3MsIGRpc3BsYXlPcmRlciwgdHlwZSwgc2VyaWFsaXphYmxlIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgUmVuZGVyUGlwZWxpbmUsIElSZW5kZXJQaXBlbGluZUluZm8gfSBmcm9tICcuLi9yZW5kZXItcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBHYnVmZmVyRmxvdyB9IGZyb20gJy4vZ2J1ZmZlci1mbG93JztcclxuaW1wb3J0IHsgTGlnaHRpbmdGbG93IH0gZnJvbSAnLi9saWdodGluZy1mbG93JztcclxuaW1wb3J0IHsgUmVuZGVyVGV4dHVyZUNvbmZpZywgTWF0ZXJpYWxDb25maWcgfSBmcm9tICcuLi9waXBlbGluZS1zZXJpYWxpemF0aW9uJztcclxuaW1wb3J0IHsgU2hhZG93RmxvdyB9IGZyb20gJy4uL3NoYWRvdy9zaGFkb3ctZmxvdyc7XHJcbmltcG9ydCB7IGdlblNhbXBsZXJIYXNoLCBzYW1wbGVyTGliIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvY29yZS9zYW1wbGVyLWxpYic7XHJcbmltcG9ydCB7XHJcbiAgICBHRlhCdWZmZXJVc2FnZUJpdCxcclxuICAgIEdGWEZvcm1hdCxcclxuICAgIEdGWEZvcm1hdEluZm9zLFxyXG4gICAgR0ZYTWVtb3J5VXNhZ2VCaXQsXHJcbiAgICBHRlhDbGVhckZsYWcsXHJcbiAgICBHRlhGaWx0ZXIsIFxyXG4gICAgR0ZYQWRkcmVzcyxcclxuICAgIEdGWFRleHR1cmVVc2FnZUJpdCB9IGZyb20gJy4uLy4uL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBJUmVuZGVyT2JqZWN0LCBVQk9HbG9iYWwsIFVCT1NoYWRvdywgIFVOSUZPUk1fU0hBRE9XTUFQX0JJTkRJTkcsIFVOSUZPUk1fR0JVRkZFUl9BTEJFRE9NQVBfQklORElORywgXHJcbiAgICBVTklGT1JNX0dCVUZGRVJfUE9TSVRJT05NQVBfQklORElORywgVU5JRk9STV9HQlVGRkVSX05PUk1BTE1BUF9CSU5ESU5HLCBVTklGT1JNX0dCVUZGRVJfRU1JU1NJVkVNQVBfQklORElOR30gZnJvbSAnLi4vZGVmaW5lJztcclxuaW1wb3J0IHsgR0ZYQ29sb3JBdHRhY2htZW50LCBHRlhEZXB0aFN0ZW5jaWxBdHRhY2htZW50LCBHRlhSZW5kZXJQYXNzLCBHRlhMb2FkT3AsIEdGWFRleHR1cmVMYXlvdXQsIEdGWFJlbmRlclBhc3NJbmZvLCBHRlhCdWZmZXJJbmZvIH0gZnJvbSAnLi4vLi4vZ2Z4JztcclxuaW1wb3J0IHsgU0tZQk9YX0ZMQUcgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9zY2VuZS9jYW1lcmEnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4uLy4uL2dsb2JhbC1leHBvcnRzJztcclxuaW1wb3J0IHsgUmVuZGVyVmlldyB9IGZyb20gJy4uL3JlbmRlci12aWV3JztcclxuaW1wb3J0IHsgTWF0NCwgVmVjMywgVmVjNH0gZnJvbSAnLi4vLi4vbWF0aCc7XHJcbmltcG9ydCB7IEdGWEZlYXR1cmUgfSBmcm9tICcuLi8uLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgRm9nIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvZm9nJztcclxuaW1wb3J0IHsgQW1iaWVudCB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3NjZW5lL2FtYmllbnQnO1xyXG5pbXBvcnQgeyBTa3lib3ggfSBmcm9tICcuLi8uLi9yZW5kZXJlci9zY2VuZS9za3lib3gnO1xyXG5pbXBvcnQgeyBTaGFkb3dzLCBTaGFkb3dUeXBlIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvc2hhZG93cyc7XHJcbmltcG9ydCB7IHNjZW5lQ3VsbGluZywgZ2V0U2hhZG93V29ybGRNYXRyaXggfSBmcm9tICcuL3NjZW5lLWN1bGxpbmcnO1xyXG5pbXBvcnQgeyBVSUZsb3cgfSBmcm9tICcuLi91aS91aS1mbG93JztcclxuaW1wb3J0IHsgR0ZYSW5wdXRBc3NlbWJsZXIsIEdGWElucHV0QXNzZW1ibGVySW5mbywgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vLi4vZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlciB9IGZyb20gJy4uLy4uL2dmeC9idWZmZXInO1xyXG5cclxuXHJcblxyXG5jb25zdCBtYXRTaGFkb3dWaWV3ID0gbmV3IE1hdDQoKTtcclxuY29uc3QgbWF0U2hhZG93Vmlld1Byb2ogPSBuZXcgTWF0NCgpO1xyXG5jb25zdCB2ZWM0ID0gbmV3IFZlYzQoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGRlZmVycmVkIHJlbmRlciBwaXBlbGluZVxyXG4gKiBAemgg5YmN5ZCR5riy5p+T566h57q/44CCXHJcbiAqL1xyXG5AY2NjbGFzcygnRGVmZXJyZWRQaXBlbGluZScpXHJcbmV4cG9ydCBjbGFzcyBEZWZlcnJlZFBpcGVsaW5lIGV4dGVuZHMgUmVuZGVyUGlwZWxpbmUge1xyXG5cclxuICAgIGdldCBpc0hEUiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSERSO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpc0hEUiAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSERSID09PSB2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0hEUiA9IHZhbDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0R2xvYmFsVUJPRGF0YSA9IHRoaXMuX2dsb2JhbFVCTztcclxuICAgICAgICBkZWZhdWx0R2xvYmFsVUJPRGF0YVtVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUICsgMl0gPSB0aGlzLl9pc0hEUiA/IDEuMCA6IDAuMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2hhZGluZ1NjYWxlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkaW5nU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZwU2NhbGUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZwU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWbm+i+ueW9oui+k+WFpeaxh+mbhuWZqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHF1YWRJQSAoKTogR0ZYSW5wdXRBc3NlbWJsZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9xdWFkSUEhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBzaGFkb3cgVUJPLlxyXG4gICAgICogQHpoIOiOt+WPlumYtOW9sVVCT+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgc2hhZG93VUJPICgpOiBGbG9hdDMyQXJyYXkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dVQk87XHJcbiAgICB9XHJcblxyXG4gICAgQHR5cGUoW1JlbmRlclRleHR1cmVDb25maWddKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigyKVxyXG4gICAgcHJvdGVjdGVkIHJlbmRlclRleHR1cmVzOiBSZW5kZXJUZXh0dXJlQ29uZmlnW10gPSBbXTtcclxuXHJcbiAgICBAdHlwZShbTWF0ZXJpYWxDb25maWddKVxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc3BsYXlPcmRlcigzKVxyXG4gICAgcHJvdGVjdGVkIG1hdGVyaWFsczogTWF0ZXJpYWxDb25maWdbXSA9IFtdO1xyXG5cclxuICAgIHB1YmxpYyBmb2c6IEZvZyA9IG5ldyBGb2coKTtcclxuICAgIHB1YmxpYyBhbWJpZW50OiBBbWJpZW50ID0gbmV3IEFtYmllbnQoKTtcclxuICAgIHB1YmxpYyBza3lib3g6IFNreWJveCA9IG5ldyBTa3lib3goKTtcclxuICAgIHB1YmxpYyBzaGFkb3dzOiBTaGFkb3dzID0gbmV3IFNoYWRvd3MoKTtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBsaXN0IGZvciByZW5kZXIgb2JqZWN0cywgb25seSBhdmFpbGFibGUgYWZ0ZXIgdGhlIHNjZW5lIGN1bGxpbmcgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXHJcbiAgICAgKiBAemgg5riy5p+T5a+56LGh5pWw57uE77yM5LuF5Zyo5b2T5YmN5bin55qE5Zy65pmv5YmU6Zmk5a6M5oiQ5ZCO5pyJ5pWI44CCXHJcbiAgICAgKiBAcmVhZG9ubHlcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbmRlck9iamVjdHM6IElSZW5kZXJPYmplY3RbXSA9IFtdO1xyXG4gICAgcHVibGljIHNoYWRvd09iamVjdHM6IElSZW5kZXJPYmplY3RbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9pc0hEUjogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFkaW5nU2NhbGU6IG51bWJlciA9IDEuMDtcclxuICAgIHByb3RlY3RlZCBfZnBTY2FsZTogbnVtYmVyID0gMS4wIC8gMTAyNC4wO1xyXG4gICAgcHJvdGVjdGVkIF9yZW5kZXJQYXNzZXMgPSBuZXcgTWFwPEdGWENsZWFyRmxhZywgR0ZYUmVuZGVyUGFzcz4oKTtcclxuICAgIHByb3RlY3RlZCBfZ2xvYmFsVUJPID0gbmV3IEZsb2F0MzJBcnJheShVQk9HbG9iYWwuQ09VTlQpO1xyXG4gICAgcHJvdGVjdGVkIF9zaGFkb3dVQk8gPSBuZXcgRmxvYXQzMkFycmF5KFVCT1NoYWRvdy5DT1VOVCk7XHJcbiAgICBwcm90ZWN0ZWQgX3F1YWRWQjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3F1YWRJQjogR0ZYQnVmZmVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcm90ZWN0ZWQgX3F1YWRJQTogR0ZYSW5wdXRBc3NlbWJsZXIgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclBpcGVsaW5lSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mbG93cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93RmxvdyA9IG5ldyBTaGFkb3dGbG93KCk7XHJcbiAgICAgICAgICAgIHNoYWRvd0Zsb3cuaW5pdGlhbGl6ZShTaGFkb3dGbG93LmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZmxvd3MucHVzaChzaGFkb3dGbG93KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGdidWZmZXJGbG93ID0gbmV3IEdidWZmZXJGbG93KCk7XHJcbiAgICAgICAgICAgIGdidWZmZXJGbG93LmluaXRpYWxpemUoR2J1ZmZlckZsb3cuaW5pdEluZm8pO1xyXG4gICAgICAgICAgICB0aGlzLl9mbG93cy5wdXNoKGdidWZmZXJGbG93KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGxpZ2h0aW5nRmxvdyA9IG5ldyBMaWdodGluZ0Zsb3coKTtcclxuICAgICAgICAgICAgbGlnaHRpbmdGbG93LmluaXRpYWxpemUoTGlnaHRpbmdGbG93LmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZmxvd3MucHVzaChsaWdodGluZ0Zsb3cpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdWlGbG93ID0gbmV3IFVJRmxvdygpO1xyXG4gICAgICAgICAgICB1aUZsb3cuaW5pdGlhbGl6ZShVSUZsb3cuaW5pdEluZm8pO1xyXG4gICAgICAgICAgICB0aGlzLl9mbG93cy5wdXNoKHVpRmxvdyk7XHJcbiAgICAgICAgICAgIHVpRmxvdy5hY3RpdmF0ZSh0aGlzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhY3RpdmF0ZSAoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5fbWFjcm9zID0ge307XHJcblxyXG4gICAgICAgIGlmICghc3VwZXIuYWN0aXZhdGUoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX2FjdGl2ZVJlbmRlcmVyKCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRGVmZXJyZWRQaXBlbGluZSBzdGFydHVwIGZhaWxlZCEnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlld3M6IFJlbmRlclZpZXdbXSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHZpZXdzW2ldO1xyXG4gICAgICAgICAgICBzY2VuZUN1bGxpbmcodGhpcywgdmlldyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdmlldy5mbG93cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmlldy5mbG93c1tqXS5yZW5kZXIodmlldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZEJ1ZmZlcnNbMF0uZW5kKCk7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlLnF1ZXVlLnN1Ym1pdCh0aGlzLl9jb21tYW5kQnVmZmVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJlbmRlclBhc3MgKGNsZWFyRmxhZ3M6IEdGWENsZWFyRmxhZyk6IEdGWFJlbmRlclBhc3Mge1xyXG4gICAgICAgIGxldCByZW5kZXJQYXNzID0gdGhpcy5fcmVuZGVyUGFzc2VzLmdldChjbGVhckZsYWdzKTtcclxuICAgICAgICBpZiAocmVuZGVyUGFzcykgeyByZXR1cm4gcmVuZGVyUGFzczsgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZSE7XHJcbiAgICAgICAgY29uc3QgY29sb3JBdHRhY2htZW50ID0gbmV3IEdGWENvbG9yQXR0YWNobWVudCgpO1xyXG4gICAgICAgIGNvbnN0IGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgPSBuZXcgR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCgpO1xyXG4gICAgICAgIGNvbG9yQXR0YWNobWVudC5mb3JtYXQgPSBkZXZpY2UuY29sb3JGb3JtYXQ7XHJcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5mb3JtYXQgPSBkZXZpY2UuZGVwdGhTdGVuY2lsRm9ybWF0O1xyXG5cclxuICAgICAgICBpZiAoIShjbGVhckZsYWdzICYgR0ZYQ2xlYXJGbGFnLkNPTE9SKSkge1xyXG4gICAgICAgICAgICBpZiAoY2xlYXJGbGFncyAmIFNLWUJPWF9GTEFHKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQubG9hZE9wID0gR0ZYTG9hZE9wLkRJU0NBUkQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQubG9hZE9wID0gR0ZYTG9hZE9wLkxPQUQ7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQuYmVnaW5MYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlBSRVNFTlRfU1JDO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuREVQVEhfU1RFTkNJTCkgIT09IEdGWENsZWFyRmxhZy5ERVBUSF9TVEVOQ0lMKSB7XHJcbiAgICAgICAgICAgIGlmICghKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuREVQVEgpKSBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmRlcHRoTG9hZE9wID0gR0ZYTG9hZE9wLkxPQUQ7XHJcbiAgICAgICAgICAgIGlmICghKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuU1RFTkNJTCkpIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuc3RlbmNpbExvYWRPcCA9IEdGWExvYWRPcC5MT0FEO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmJlZ2luTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlRfT1BUSU1BTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3NJbmZvID0gbmV3IEdGWFJlbmRlclBhc3NJbmZvKFtjb2xvckF0dGFjaG1lbnRdLCBkZXB0aFN0ZW5jaWxBdHRhY2htZW50KTtcclxuICAgICAgICByZW5kZXJQYXNzID0gZGV2aWNlLmNyZWF0ZVJlbmRlclBhc3MocmVuZGVyUGFzc0luZm8pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclBhc3Nlcy5zZXQoY2xlYXJGbGFncywgcmVuZGVyUGFzcyEpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyUGFzcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVcGRhdGUgYWxsIFVCT3NcclxuICAgICAqIEB6aCDmm7TmlrDlhajpg6ggVUJP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVVQk9zICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlVUJPKHZpZXcpO1xyXG4gICAgICAgIGNvbnN0IG1haW5MaWdodCA9IHZpZXcuY2FtZXJhLnNjZW5lIS5tYWluTGlnaHQ7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gdGhpcy5kZXZpY2U7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93SW5mbyA9IHRoaXMuc2hhZG93cztcclxuXHJcbiAgICAgICAgaWYgKG1haW5MaWdodCAmJiBzaGFkb3dJbmZvLnR5cGUgPT09IFNoYWRvd1R5cGUuU2hhZG93TWFwKSB7XHJcbiAgICAgICAgICAgIC8vIGxpZ2h0IHZpZXdcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93Q2FtZXJhVmlldyA9IGdldFNoYWRvd1dvcmxkTWF0cml4KHRoaXMsIG1haW5MaWdodCEubm9kZSEud29ybGRSb3RhdGlvbiwgbWFpbkxpZ2h0IS5kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBNYXQ0LmludmVydChtYXRTaGFkb3dWaWV3LCBzaGFkb3dDYW1lcmFWaWV3KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxpZ2h0IHByb2pcclxuICAgICAgICAgICAgbGV0IHg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCB5OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAoc2hhZG93SW5mby5vcnRob1NpemUgPiBzaGFkb3dJbmZvLnNwaGVyZS5yYWRpdXMpIHtcclxuICAgICAgICAgICAgICAgIHggPSBzaGFkb3dJbmZvLm9ydGhvU2l6ZSAqIHNoYWRvd0luZm8uYXNwZWN0O1xyXG4gICAgICAgICAgICAgICAgeSA9IHNoYWRvd0luZm8ub3J0aG9TaXplO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgb3J0aG9TaXplIGlzIHRoZSBzbWFsbGVzdCwgYXV0byBjYWxjdWxhdGUgb3J0aG9TaXplLlxyXG4gICAgICAgICAgICAgICAgeCA9IHNoYWRvd0luZm8uc3BoZXJlLnJhZGl1cyAqIHNoYWRvd0luZm8uYXNwZWN0O1xyXG4gICAgICAgICAgICAgICAgeSA9IHNoYWRvd0luZm8uc3BoZXJlLnJhZGl1cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0aW9uU2lnblkgPSBkZXZpY2Uuc2NyZWVuU3BhY2VTaWduWSAqIGRldmljZS5VVlNwYWNlU2lnblk7IC8vIGFsd2F5cyBvZmZzY3JlZW5cclxuICAgICAgICAgICAgTWF0NC5vcnRobyhtYXRTaGFkb3dWaWV3UHJvaiwgLXgsIHgsIC15LCB5LCBzaGFkb3dJbmZvLm5lYXIsIHNoYWRvd0luZm8uZmFyLFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlLmNsaXBTcGFjZU1pblosIHByb2plY3Rpb25TaWduWSk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaWdodCB2aWV3UHJvalxyXG4gICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KG1hdFNoYWRvd1ZpZXdQcm9qLCBtYXRTaGFkb3dWaWV3UHJvaiwgbWF0U2hhZG93Vmlldyk7XHJcblxyXG4gICAgICAgICAgICBNYXQ0LnRvQXJyYXkodGhpcy5fc2hhZG93VUJPLCBtYXRTaGFkb3dWaWV3UHJvaiwgVUJPU2hhZG93Lk1BVF9MSUdIVF9WSUVXX1BST0pfT0ZGU0VUKTtcclxuXHJcbiAgICAgICAgICAgIHZlYzQuc2V0KHNoYWRvd0luZm8ucGNmKTtcclxuICAgICAgICAgICAgVmVjNC50b0FycmF5KHRoaXMuX3NoYWRvd1VCTywgdmVjNCwgVUJPU2hhZG93LlNIQURPV19QQ0ZfT0ZGU0VUKTtcclxuXHJcbiAgICAgICAgICAgIHZlYzQuc2V0KHNoYWRvd0luZm8uc2l6ZS54LCBzaGFkb3dJbmZvLnNpemUueSk7XHJcbiAgICAgICAgICAgIFZlYzQudG9BcnJheSh0aGlzLl9zaGFkb3dVQk8sIHZlYzQsIFVCT1NoYWRvdy5TSEFET1dfU0laRV9PRkZTRVQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHVib3NcclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVyc1swXS51cGRhdGVCdWZmZXIodGhpcy5fZGVzY3JpcHRvclNldC5nZXRCdWZmZXIoVUJPR2xvYmFsLkJJTkRJTkcpLCB0aGlzLl9nbG9iYWxVQk8pO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRCdWZmZXJzWzBdLnVwZGF0ZUJ1ZmZlcih0aGlzLl9kZXNjcmlwdG9yU2V0LmdldEJ1ZmZlcihVQk9TaGFkb3cuQklORElORyksIHRoaXMuX3NoYWRvd1VCTyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aXZlUmVuZGVyZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHRoaXMuZGV2aWNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVycy5wdXNoKGRldmljZS5jb21tYW5kQnVmZmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2xvYmFsVUJPID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVUJPR2xvYmFsLlNJWkUsXHJcbiAgICAgICAgICAgIFVCT0dsb2JhbC5TSVpFLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9HbG9iYWwuQklORElORywgZ2xvYmFsVUJPKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZG93VUJPID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVUJPU2hhZG93LlNJWkUsXHJcbiAgICAgICAgICAgIFVCT1NoYWRvdy5TSVpFLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9TaGFkb3cuQklORElORywgc2hhZG93VUJPKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZG93TWFwU2FtcGxlckhhc2ggPSBnZW5TYW1wbGVySGFzaChbXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5OT05FLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd01hcFNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIoZGV2aWNlLCBzaGFkb3dNYXBTYW1wbGVySGFzaCk7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihVTklGT1JNX1NIQURPV01BUF9CSU5ESU5HLCBzaGFkb3dNYXBTYW1wbGVyKTtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmJpbmRTYW1wbGVyKFVOSUZPUk1fR0JVRkZFUl9BTEJFRE9NQVBfQklORElORywgc2hhZG93TWFwU2FtcGxlcik7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihVTklGT1JNX0dCVUZGRVJfUE9TSVRJT05NQVBfQklORElORywgc2hhZG93TWFwU2FtcGxlcik7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihVTklGT1JNX0dCVUZGRVJfTk9STUFMTUFQX0JJTkRJTkcsIHNoYWRvd01hcFNhbXBsZXIpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZFNhbXBsZXIoVU5JRk9STV9HQlVGRkVSX0VNSVNTSVZFTUFQX0JJTkRJTkcsIHNoYWRvd01hcFNhbXBsZXIpO1xyXG5cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGdsb2JhbCBkZWZpbmVzIHdoZW4gYWxsIHN0YXRlcyBpbml0aWFsaXplZC5cclxuICAgICAgICB0aGlzLm1hY3Jvcy5DQ19VU0VfSERSID0gdGhpcy5faXNIRFI7XHJcbiAgICAgICAgdGhpcy5tYWNyb3MuQ0NfU1VQUE9SVF9GTE9BVF9URVhUVVJFID0gdGhpcy5kZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLlRFWFRVUkVfRkxPQVQpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuY3JlYXRlUXVhZElucHV0QXNzZW1ibGVyKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdXBkYXRlVUJPICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgcm9vdCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3Q7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbWVyYSA9IHZpZXcuY2FtZXJhO1xyXG4gICAgICAgIGNvbnN0IHNjZW5lID0gY2FtZXJhLnNjZW5lITtcclxuXHJcbiAgICAgICAgY29uc3QgbWFpbkxpZ2h0ID0gc2NlbmUubWFpbkxpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGFtYmllbnQgPSB0aGlzLmFtYmllbnQ7XHJcbiAgICAgICAgY29uc3QgZm9nID0gdGhpcy5mb2c7XHJcbiAgICAgICAgY29uc3QgZnYgPSB0aGlzLl9nbG9iYWxVQk87XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gdGhpcy5kZXZpY2U7XHJcblxyXG4gICAgICAgIGNvbnN0IHNoYWRpbmdXaWR0aCA9IE1hdGguZmxvb3IoZGV2aWNlLndpZHRoKTtcclxuICAgICAgICBjb25zdCBzaGFkaW5nSGVpZ2h0ID0gTWF0aC5mbG9vcihkZXZpY2UuaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIFVCT0dsb2JhbFxyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5USU1FX09GRlNFVF0gPSByb290LmN1bXVsYXRpdmVUaW1lO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5USU1FX09GRlNFVCArIDFdID0gcm9vdC5mcmFtZVRpbWU7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlRJTUVfT0ZGU0VUICsgMl0gPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRUb3RhbEZyYW1lcygpO1xyXG5cclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NJWkVfT0ZGU0VUXSA9IGRldmljZS53aWR0aDtcclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NJWkVfT0ZGU0VUICsgMV0gPSBkZXZpY2UuaGVpZ2h0O1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVQgKyAyXSA9IDEuMCAvIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVRdO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVQgKyAzXSA9IDEuMCAvIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVQgKyAxXTtcclxuXHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlNDUkVFTl9TQ0FMRV9PRkZTRVRdID0gY2FtZXJhLndpZHRoIC8gc2hhZGluZ1dpZHRoICogdGhpcy5zaGFkaW5nU2NhbGU7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlNDUkVFTl9TQ0FMRV9PRkZTRVQgKyAxXSA9IGNhbWVyYS5oZWlnaHQgLyBzaGFkaW5nSGVpZ2h0ICogdGhpcy5zaGFkaW5nU2NhbGU7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlNDUkVFTl9TQ0FMRV9PRkZTRVQgKyAyXSA9IDEuMCAvIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0NBTEVfT0ZGU0VUXTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NDQUxFX09GRlNFVCArIDNdID0gMS4wIC8gZnZbVUJPR2xvYmFsLlNDUkVFTl9TQ0FMRV9PRkZTRVQgKyAxXTtcclxuXHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLk5BVElWRV9TSVpFX09GRlNFVF0gPSBzaGFkaW5nV2lkdGg7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLk5BVElWRV9TSVpFX09GRlNFVCArIDFdID0gc2hhZGluZ0hlaWdodDtcclxuICAgICAgICBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUICsgMl0gPSAxLjAgLyBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUXTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUICsgM10gPSAxLjAgLyBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUICsgMV07XHJcblxyXG4gICAgICAgIE1hdDQudG9BcnJheShmdiwgY2FtZXJhLm1hdFZpZXcsIFVCT0dsb2JhbC5NQVRfVklFV19PRkZTRVQpO1xyXG4gICAgICAgIE1hdDQudG9BcnJheShmdiwgY2FtZXJhLm5vZGUud29ybGRNYXRyaXgsIFVCT0dsb2JhbC5NQVRfVklFV19JTlZfT0ZGU0VUKTtcclxuICAgICAgICBNYXQ0LnRvQXJyYXkoZnYsIGNhbWVyYS5tYXRQcm9qLCBVQk9HbG9iYWwuTUFUX1BST0pfT0ZGU0VUKTtcclxuICAgICAgICBNYXQ0LnRvQXJyYXkoZnYsIGNhbWVyYS5tYXRQcm9qSW52LCBVQk9HbG9iYWwuTUFUX1BST0pfSU5WX09GRlNFVCk7XHJcbiAgICAgICAgTWF0NC50b0FycmF5KGZ2LCBjYW1lcmEubWF0Vmlld1Byb2osIFVCT0dsb2JhbC5NQVRfVklFV19QUk9KX09GRlNFVCk7XHJcbiAgICAgICAgTWF0NC50b0FycmF5KGZ2LCBjYW1lcmEubWF0Vmlld1Byb2pJbnYsIFVCT0dsb2JhbC5NQVRfVklFV19QUk9KX0lOVl9PRkZTRVQpO1xyXG4gICAgICAgIFZlYzMudG9BcnJheShmdiwgY2FtZXJhLnBvc2l0aW9uLCBVQk9HbG9iYWwuQ0FNRVJBX1BPU19PRkZTRVQpO1xyXG4gICAgICAgIGxldCBwcm9qZWN0aW9uU2lnblkgPSBkZXZpY2Uuc2NyZWVuU3BhY2VTaWduWTtcclxuICAgICAgICBpZiAodmlldy53aW5kb3cuaGFzT2ZmU2NyZWVuQXR0YWNobWVudHMpIHtcclxuICAgICAgICAgICAgcHJvamVjdGlvblNpZ25ZICo9IGRldmljZS5VVlNwYWNlU2lnblk7IC8vIG5lZWQgZmxpcHBpbmcgaWYgZHJhd2luZyBvbiByZW5kZXIgdGFyZ2V0c1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdltVQk9HbG9iYWwuQ0FNRVJBX1BPU19PRkZTRVQgKyAzXSA9IHByb2plY3Rpb25TaWduWTtcclxuXHJcbiAgICAgICAgY29uc3QgZXhwb3N1cmUgPSBjYW1lcmEuZXhwb3N1cmU7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLkVYUE9TVVJFX09GRlNFVF0gPSBleHBvc3VyZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUICsgMV0gPSAxLjAgLyBleHBvc3VyZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUICsgMl0gPSB0aGlzLl9pc0hEUiA/IDEuMCA6IDAuMDtcclxuICAgICAgICBmdltVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUICsgM10gPSB0aGlzLl9mcFNjYWxlIC8gZXhwb3N1cmU7XHJcblxyXG4gICAgICAgIGlmIChtYWluTGlnaHQpIHtcclxuICAgICAgICAgICAgVmVjMy50b0FycmF5KGZ2LCBtYWluTGlnaHQuZGlyZWN0aW9uLCBVQk9HbG9iYWwuTUFJTl9MSVRfRElSX09GRlNFVCk7XHJcbiAgICAgICAgICAgIFZlYzMudG9BcnJheShmdiwgbWFpbkxpZ2h0LmNvbG9yLCBVQk9HbG9iYWwuTUFJTl9MSVRfQ09MT1JfT0ZGU0VUKTtcclxuICAgICAgICAgICAgaWYgKG1haW5MaWdodC51c2VDb2xvclRlbXBlcmF0dXJlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xvclRlbXBSR0IgPSBtYWluTGlnaHQuY29sb3JUZW1wZXJhdHVyZVJHQjtcclxuICAgICAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5NQUlOX0xJVF9DT0xPUl9PRkZTRVRdICo9IGNvbG9yVGVtcFJHQi54O1xyXG4gICAgICAgICAgICAgICAgZnZbVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVCArIDFdICo9IGNvbG9yVGVtcFJHQi55O1xyXG4gICAgICAgICAgICAgICAgZnZbVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVCArIDJdICo9IGNvbG9yVGVtcFJHQi56O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5faXNIRFIpIHtcclxuICAgICAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5NQUlOX0xJVF9DT0xPUl9PRkZTRVQgKyAzXSA9IG1haW5MaWdodC5pbGx1bWluYW5jZSAqIHRoaXMuX2ZwU2NhbGU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmdltVQk9HbG9iYWwuTUFJTl9MSVRfQ09MT1JfT0ZGU0VUICsgM10gPSBtYWluTGlnaHQuaWxsdW1pbmFuY2UgKiBleHBvc3VyZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMudG9BcnJheShmdiwgVmVjMy5VTklUX1osIFVCT0dsb2JhbC5NQUlOX0xJVF9ESVJfT0ZGU0VUKTtcclxuICAgICAgICAgICAgVmVjNC50b0FycmF5KGZ2LCBWZWM0LlpFUk8sIFVCT0dsb2JhbC5NQUlOX0xJVF9DT0xPUl9PRkZTRVQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgc2t5Q29sb3IgPSBhbWJpZW50LmNvbG9yQXJyYXk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSERSKSB7XHJcbiAgICAgICAgICAgIHNreUNvbG9yWzNdID0gYW1iaWVudC5za3lJbGx1bSAqIHRoaXMuX2ZwU2NhbGU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc2t5Q29sb3JbM10gPSBhbWJpZW50LnNreUlsbHVtICogZXhwb3N1cmU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ2LnNldChza3lDb2xvciwgVUJPR2xvYmFsLkFNQklFTlRfU0tZX09GRlNFVCk7XHJcbiAgICAgICAgZnYuc2V0KGFtYmllbnQuYWxiZWRvQXJyYXksIFVCT0dsb2JhbC5BTUJJRU5UX0dST1VORF9PRkZTRVQpO1xyXG5cclxuICAgICAgICBpZiAoZm9nLmVuYWJsZWQpIHtcclxuICAgICAgICAgICAgZnYuc2V0KGZvZy5jb2xvckFycmF5LCBVQk9HbG9iYWwuR0xPQkFMX0ZPR19DT0xPUl9PRkZTRVQpO1xyXG5cclxuICAgICAgICAgICAgZnZbVUJPR2xvYmFsLkdMT0JBTF9GT0dfQkFTRV9PRkZTRVRdID0gZm9nLmZvZ1N0YXJ0O1xyXG4gICAgICAgICAgICBmdltVQk9HbG9iYWwuR0xPQkFMX0ZPR19CQVNFX09GRlNFVCArIDFdID0gZm9nLmZvZ0VuZDtcclxuICAgICAgICAgICAgZnZbVUJPR2xvYmFsLkdMT0JBTF9GT0dfQkFTRV9PRkZTRVQgKyAyXSA9IGZvZy5mb2dEZW5zaXR5O1xyXG5cclxuICAgICAgICAgICAgZnZbVUJPR2xvYmFsLkdMT0JBTF9GT0dfQUREX09GRlNFVF0gPSBmb2cuZm9nVG9wO1xyXG4gICAgICAgICAgICBmdltVQk9HbG9iYWwuR0xPQkFMX0ZPR19BRERfT0ZGU0VUICsgMV0gPSBmb2cuZm9nUmFuZ2U7XHJcbiAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5HTE9CQUxfRk9HX0FERF9PRkZTRVQgKyAyXSA9IGZvZy5mb2dBdHRlbjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBkZXN0cm95VUJPcyAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2NyaXB0b3JTZXQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5nZXRCdWZmZXIoVUJPR2xvYmFsLkJJTkRJTkcpLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5nZXRCdWZmZXIoVUJPU2hhZG93LkJJTkRJTkcpLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMuZGVzdHJveVVCT3MoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lRdWFkSW5wdXRBc3NlbWJsZXIoKTtcclxuXHJcbiAgICAgICAgY29uc3QgcnBJdGVyID0gdGhpcy5fcmVuZGVyUGFzc2VzLnZhbHVlcygpO1xyXG4gICAgICAgIGxldCBycFJlcyA9IHJwSXRlci5uZXh0KCk7XHJcbiAgICAgICAgd2hpbGUgKCFycFJlcy5kb25lKSB7XHJcbiAgICAgICAgICAgIHJwUmVzLnZhbHVlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgcnBSZXMgPSBycEl0ZXIubmV4dCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY29tbWFuZEJ1ZmZlcnMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgdGhpcy5hbWJpZW50LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnNreWJveC5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5mb2cuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuc2hhZG93cy5kZXN0cm95KCk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uuWbm+i+ueW9oui+k+WFpeaxh+mbhuWZqOOAglxyXG4gICAgICovXHJcbiAgICBwcm90ZWN0ZWQgY3JlYXRlUXVhZElucHV0QXNzZW1ibGVyICgpOiBib29sZWFuIHtcclxuXHJcbiAgICAgICAgLy8gY3JlYXRlIHZlcnRleCBidWZmZXJcclxuXHJcbiAgICAgICAgY29uc3QgdmJTdHJpZGUgPSBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiA0O1xyXG4gICAgICAgIGNvbnN0IHZiU2l6ZSA9IHZiU3RyaWRlICogNDtcclxuXHJcbiAgICAgICAgdGhpcy5fcXVhZFZCID0gdGhpcy5fZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVkVSVEVYIHwgR0ZYQnVmZmVyVXNhZ2VCaXQuVFJBTlNGRVJfRFNULFxyXG4gICAgICAgICAgICBHRlhNZW1vcnlVc2FnZUJpdC5IT1NUIHwgR0ZYTWVtb3J5VXNhZ2VCaXQuREVWSUNFLFxyXG4gICAgICAgICAgICB2YlNpemUsXHJcbiAgICAgICAgICAgIHZiU3RyaWRlLFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICBpZiAoIXRoaXMuX3F1YWRWQikge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0cyA9IG5ldyBGbG9hdDMyQXJyYXkoNCAqIDQpO1xyXG4gICAgICAgIGxldCBuID0gMDtcclxuICAgICAgICB2ZXJ0c1tuKytdID0gLTEuMDsgdmVydHNbbisrXSA9IC0xLjA7IHZlcnRzW24rK10gPSAwLjA7IHZlcnRzW24rK10gPSAwLjA7XHJcbiAgICAgICAgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IC0xLjA7IHZlcnRzW24rK10gPSAxLjA7IHZlcnRzW24rK10gPSAwLjA7XHJcbiAgICAgICAgdmVydHNbbisrXSA9IC0xLjA7IHZlcnRzW24rK10gPSAxLjA7IHZlcnRzW24rK10gPSAwLjA7IHZlcnRzW24rK10gPSAxLjA7XHJcbiAgICAgICAgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDEuMDsgdmVydHNbbisrXSA9IDEuMDtcclxuXHJcbiAgICAgICAgdGhpcy5fcXVhZFZCLnVwZGF0ZSh2ZXJ0cyk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBpbmRleCBidWZmZXJcclxuICAgICAgICBjb25zdCBpYlN0cmlkZSA9IFVpbnQ4QXJyYXkuQllURVNfUEVSX0VMRU1FTlQ7XHJcbiAgICAgICAgY29uc3QgaWJTaXplID0gaWJTdHJpZGUgKiA2O1xyXG5cclxuICAgICAgICB0aGlzLl9xdWFkSUIgPSB0aGlzLl9kZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKCBcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuSU5ERVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIGliU2l6ZSxcclxuICAgICAgICAgICAgaWJTdHJpZGUsXHJcbiAgICAgICAgKSk7XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fcXVhZElCKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGluZGljZXMgPSBuZXcgVWludDhBcnJheSg2KTtcclxuICAgICAgICBpbmRpY2VzWzBdID0gMDsgaW5kaWNlc1sxXSA9IDE7IGluZGljZXNbMl0gPSAyO1xyXG4gICAgICAgIGluZGljZXNbM10gPSAxOyBpbmRpY2VzWzRdID0gMzsgaW5kaWNlc1s1XSA9IDI7XHJcblxyXG4gICAgICAgIHRoaXMuX3F1YWRJQi51cGRhdGUoaW5kaWNlcyk7XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZSBpbnB1dCBhc3NlbWJsZXJcclxuXHJcbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IG5ldyBBcnJheTxHRlhBdHRyaWJ1dGU+KDIpO1xyXG4gICAgICAgIGF0dHJpYnV0ZXNbMF0gPSBuZXcgR0ZYQXR0cmlidXRlKCdhX3Bvc2l0aW9uJywgR0ZYRm9ybWF0LlJHMzJGKTtcclxuICAgICAgICBhdHRyaWJ1dGVzWzFdID0gbmV3IEdGWEF0dHJpYnV0ZSgnYV90ZXhDb29yZCcsIEdGWEZvcm1hdC5SRzMyRik7XHJcblxyXG4gICAgICAgIHRoaXMuX3F1YWRJQSA9IHRoaXMuX2RldmljZS5jcmVhdGVJbnB1dEFzc2VtYmxlcihuZXcgR0ZYSW5wdXRBc3NlbWJsZXJJbmZvKFxyXG4gICAgICAgICAgICBhdHRyaWJ1dGVzLFxyXG4gICAgICAgICAgICBbdGhpcy5fcXVhZFZCXSxcclxuICAgICAgICAgICAgdGhpcy5fcXVhZElCLFxyXG4gICAgICAgICkpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6ZSA5q+B5Zub6L655b2i6L6T5YWl5rGH6ZuG5Zmo44CCXHJcbiAgICAgKi9cclxuICAgIHByb3RlY3RlZCBkZXN0cm95UXVhZElucHV0QXNzZW1ibGVyICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcXVhZFZCKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRWQi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRWQiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fcXVhZElCKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRJQi5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRJQiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fcXVhZElBKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRJQS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3F1YWRJQSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==