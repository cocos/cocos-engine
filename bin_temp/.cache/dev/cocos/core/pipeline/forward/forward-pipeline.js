(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../data/decorators/index.js", "../render-pipeline.js", "./forward-flow.js", "../pipeline-serialization.js", "../shadow/shadow-flow.js", "../../renderer/core/sampler-lib.js", "../define.js", "../../gfx/define.js", "../../gfx/index.js", "../../renderer/scene/camera.js", "../../global-exports.js", "../../math/index.js", "../../gfx/device.js", "../../renderer/scene/fog.js", "../../renderer/scene/ambient.js", "../../renderer/scene/skybox.js", "../../renderer/scene/shadows.js", "./scene-culling.js", "../ui/ui-flow.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../data/decorators/index.js"), require("../render-pipeline.js"), require("./forward-flow.js"), require("../pipeline-serialization.js"), require("../shadow/shadow-flow.js"), require("../../renderer/core/sampler-lib.js"), require("../define.js"), require("../../gfx/define.js"), require("../../gfx/index.js"), require("../../renderer/scene/camera.js"), require("../../global-exports.js"), require("../../math/index.js"), require("../../gfx/device.js"), require("../../renderer/scene/fog.js"), require("../../renderer/scene/ambient.js"), require("../../renderer/scene/skybox.js"), require("../../renderer/scene/shadows.js"), require("./scene-culling.js"), require("../ui/ui-flow.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.renderPipeline, global.forwardFlow, global.pipelineSerialization, global.shadowFlow, global.samplerLib, global.define, global.define, global.index, global.camera, global.globalExports, global.index, global.device, global.fog, global.ambient, global.skybox, global.shadows, global.sceneCulling, global.uiFlow);
    global.forwardPipeline = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _renderPipeline, _forwardFlow, _pipelineSerialization, _shadowFlow, _samplerLib, _define, _define2, _index2, _camera, _globalExports, _index3, _device, _fog, _ambient, _skybox, _shadows, _sceneCulling, _uiFlow) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ForwardPipeline = void 0;

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
   * @en The forward render pipeline
   * @zh 前向渲染管线。
   */

  var ForwardPipeline = (_dec = (0, _index.ccclass)('ForwardPipeline'), _dec2 = (0, _index.type)([_pipelineSerialization.RenderTextureConfig]), _dec3 = (0, _index.displayOrder)(2), _dec4 = (0, _index.type)([_pipelineSerialization.MaterialConfig]), _dec5 = (0, _index.displayOrder)(3), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function (_RenderPipeline) {
    _inherits(ForwardPipeline, _RenderPipeline);

    function ForwardPipeline() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, ForwardPipeline);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(ForwardPipeline)).call.apply(_getPrototypeOf2, [this].concat(args)));

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
      _this._globalUBO = new Float32Array(_define.UBOGlobal.COUNT);
      _this._shadowUBO = new Float32Array(_define.UBOShadow.COUNT);
      return _this;
    }

    _createClass(ForwardPipeline, [{
      key: "initialize",
      value: function initialize(info) {
        _get(_getPrototypeOf(ForwardPipeline.prototype), "initialize", this).call(this, info);

        if (this._flows.length === 0) {
          var shadowFlow = new _shadowFlow.ShadowFlow();
          shadowFlow.initialize(_shadowFlow.ShadowFlow.initInfo);

          this._flows.push(shadowFlow);

          var forwardFlow = new _forwardFlow.ForwardFlow();
          forwardFlow.initialize(_forwardFlow.ForwardFlow.initInfo);

          this._flows.push(forwardFlow);

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

        if (!_get(_getPrototypeOf(ForwardPipeline.prototype), "activate", this).call(this)) {
          return false;
        }

        if (!this._activeRenderer()) {
          console.error('ForwardPipeline startup failed!');
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

        if (!(clearFlags & _define2.GFXClearFlag.COLOR)) {
          if (clearFlags & _camera.SKYBOX_FLAG) {
            colorAttachment.loadOp = _index2.GFXLoadOp.DISCARD;
          } else {
            colorAttachment.loadOp = _index2.GFXLoadOp.LOAD;
            colorAttachment.beginLayout = _index2.GFXTextureLayout.PRESENT_SRC;
          }
        }

        if ((clearFlags & _define2.GFXClearFlag.DEPTH_STENCIL) !== _define2.GFXClearFlag.DEPTH_STENCIL) {
          if (!(clearFlags & _define2.GFXClearFlag.DEPTH)) depthStencilAttachment.depthLoadOp = _index2.GFXLoadOp.LOAD;
          if (!(clearFlags & _define2.GFXClearFlag.STENCIL)) depthStencilAttachment.stencilLoadOp = _index2.GFXLoadOp.LOAD;
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

          _index3.Mat4.toArray(this._shadowUBO, matShadowViewProj, _define.UBOShadow.MAT_LIGHT_VIEW_PROJ_OFFSET);

          vec4.set(shadowInfo.pcf);

          _index3.Vec4.toArray(this._shadowUBO, vec4, _define.UBOShadow.SHADOW_PCF_OFFSET);

          vec4.set(shadowInfo.size.x, shadowInfo.size.y);

          _index3.Vec4.toArray(this._shadowUBO, vec4, _define.UBOShadow.SHADOW_SIZE_OFFSET);
        } // update ubos


        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(_define.UBOGlobal.BINDING), this._globalUBO);

        this._commandBuffers[0].updateBuffer(this._descriptorSet.getBuffer(_define.UBOShadow.BINDING), this._shadowUBO);
      }
    }, {
      key: "_activeRenderer",
      value: function _activeRenderer() {
        var device = this.device;

        this._commandBuffers.push(device.commandBuffer);

        var globalUBO = device.createBuffer(new _index2.GFXBufferInfo(_define2.GFXBufferUsageBit.UNIFORM | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, _define.UBOGlobal.SIZE, _define.UBOGlobal.SIZE));

        this._descriptorSet.bindBuffer(_define.UBOGlobal.BINDING, globalUBO);

        var shadowUBO = device.createBuffer(new _index2.GFXBufferInfo(_define2.GFXBufferUsageBit.UNIFORM | _define2.GFXBufferUsageBit.TRANSFER_DST, _define2.GFXMemoryUsageBit.HOST | _define2.GFXMemoryUsageBit.DEVICE, _define.UBOShadow.SIZE, _define.UBOShadow.SIZE));

        this._descriptorSet.bindBuffer(_define.UBOShadow.BINDING, shadowUBO);

        var shadowMapSamplerHash = (0, _samplerLib.genSamplerHash)([_define2.GFXFilter.LINEAR, _define2.GFXFilter.LINEAR, _define2.GFXFilter.NONE, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP, _define2.GFXAddress.CLAMP]);

        var shadowMapSampler = _samplerLib.samplerLib.getSampler(device, shadowMapSamplerHash);

        this._descriptorSet.bindSampler(_define.UNIFORM_SHADOWMAP_BINDING, shadowMapSampler); // update global defines when all states initialized.


        this.macros.CC_USE_HDR = this._isHDR;
        this.macros.CC_SUPPORT_FLOAT_TEXTURE = this.device.hasFeature(_device.GFXFeature.TEXTURE_FLOAT);
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

        fv[_define.UBOGlobal.TIME_OFFSET] = root.cumulativeTime;
        fv[_define.UBOGlobal.TIME_OFFSET + 1] = root.frameTime;
        fv[_define.UBOGlobal.TIME_OFFSET + 2] = _globalExports.legacyCC.director.getTotalFrames();
        fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET] = device.width;
        fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET + 1] = device.height;
        fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET + 2] = 1.0 / fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET];
        fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET + 3] = 1.0 / fv[_define.UBOGlobal.SCREEN_SIZE_OFFSET + 1];
        fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET] = camera.width / shadingWidth * this.shadingScale;
        fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET + 1] = camera.height / shadingHeight * this.shadingScale;
        fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET + 2] = 1.0 / fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET];
        fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET + 3] = 1.0 / fv[_define.UBOGlobal.SCREEN_SCALE_OFFSET + 1];
        fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET] = shadingWidth;
        fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET + 1] = shadingHeight;
        fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET + 2] = 1.0 / fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET];
        fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET + 3] = 1.0 / fv[_define.UBOGlobal.NATIVE_SIZE_OFFSET + 1];

        _index3.Mat4.toArray(fv, camera.matView, _define.UBOGlobal.MAT_VIEW_OFFSET);

        _index3.Mat4.toArray(fv, camera.node.worldMatrix, _define.UBOGlobal.MAT_VIEW_INV_OFFSET);

        _index3.Mat4.toArray(fv, camera.matProj, _define.UBOGlobal.MAT_PROJ_OFFSET);

        _index3.Mat4.toArray(fv, camera.matProjInv, _define.UBOGlobal.MAT_PROJ_INV_OFFSET);

        _index3.Mat4.toArray(fv, camera.matViewProj, _define.UBOGlobal.MAT_VIEW_PROJ_OFFSET);

        _index3.Mat4.toArray(fv, camera.matViewProjInv, _define.UBOGlobal.MAT_VIEW_PROJ_INV_OFFSET);

        _index3.Vec3.toArray(fv, camera.position, _define.UBOGlobal.CAMERA_POS_OFFSET);

        var projectionSignY = device.screenSpaceSignY;

        if (view.window.hasOffScreenAttachments) {
          projectionSignY *= device.UVSpaceSignY; // need flipping if drawing on render targets
        }

        fv[_define.UBOGlobal.CAMERA_POS_OFFSET + 3] = projectionSignY;
        var exposure = camera.exposure;
        fv[_define.UBOGlobal.EXPOSURE_OFFSET] = exposure;
        fv[_define.UBOGlobal.EXPOSURE_OFFSET + 1] = 1.0 / exposure;
        fv[_define.UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
        fv[_define.UBOGlobal.EXPOSURE_OFFSET + 3] = this._fpScale / exposure;

        if (mainLight) {
          _index3.Vec3.toArray(fv, mainLight.direction, _define.UBOGlobal.MAIN_LIT_DIR_OFFSET);

          _index3.Vec3.toArray(fv, mainLight.color, _define.UBOGlobal.MAIN_LIT_COLOR_OFFSET);

          if (mainLight.useColorTemperature) {
            var colorTempRGB = mainLight.colorTemperatureRGB;
            fv[_define.UBOGlobal.MAIN_LIT_COLOR_OFFSET] *= colorTempRGB.x;
            fv[_define.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 1] *= colorTempRGB.y;
            fv[_define.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 2] *= colorTempRGB.z;
          }

          if (this._isHDR) {
            fv[_define.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * this._fpScale;
          } else {
            fv[_define.UBOGlobal.MAIN_LIT_COLOR_OFFSET + 3] = mainLight.illuminance * exposure;
          }
        } else {
          _index3.Vec3.toArray(fv, _index3.Vec3.UNIT_Z, _define.UBOGlobal.MAIN_LIT_DIR_OFFSET);

          _index3.Vec4.toArray(fv, _index3.Vec4.ZERO, _define.UBOGlobal.MAIN_LIT_COLOR_OFFSET);
        }

        var skyColor = ambient.colorArray;

        if (this._isHDR) {
          skyColor[3] = ambient.skyIllum * this._fpScale;
        } else {
          skyColor[3] = ambient.skyIllum * exposure;
        }

        fv.set(skyColor, _define.UBOGlobal.AMBIENT_SKY_OFFSET);
        fv.set(ambient.albedoArray, _define.UBOGlobal.AMBIENT_GROUND_OFFSET);

        if (fog.enabled) {
          fv.set(fog.colorArray, _define.UBOGlobal.GLOBAL_FOG_COLOR_OFFSET);
          fv[_define.UBOGlobal.GLOBAL_FOG_BASE_OFFSET] = fog.fogStart;
          fv[_define.UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 1] = fog.fogEnd;
          fv[_define.UBOGlobal.GLOBAL_FOG_BASE_OFFSET + 2] = fog.fogDensity;
          fv[_define.UBOGlobal.GLOBAL_FOG_ADD_OFFSET] = fog.fogTop;
          fv[_define.UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 1] = fog.fogRange;
          fv[_define.UBOGlobal.GLOBAL_FOG_ADD_OFFSET + 2] = fog.fogAtten;
        }
      }
    }, {
      key: "destroyUBOs",
      value: function destroyUBOs() {
        if (this._descriptorSet) {
          this._descriptorSet.getBuffer(_define.UBOGlobal.BINDING).destroy();

          this._descriptorSet.getBuffer(_define.UBOShadow.BINDING).destroy();
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.destroyUBOs();

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
        return _get(_getPrototypeOf(ForwardPipeline.prototype), "destroy", this).call(this);
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
        defaultGlobalUBOData[_define.UBOGlobal.EXPOSURE_OFFSET + 2] = this._isHDR ? 1.0 : 0.0;
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
       * @en Get shadow UBO.
       * @zh 获取阴影UBO。
       */

    }, {
      key: "shadowUBO",
      get: function get() {
        return this._shadowUBO;
      }
    }]);

    return ForwardPipeline;
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
  _exports.ForwardPipeline = ForwardPipeline;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcGlwZWxpbmUvZm9yd2FyZC9mb3J3YXJkLXBpcGVsaW5lLnRzIl0sIm5hbWVzIjpbIm1hdFNoYWRvd1ZpZXciLCJNYXQ0IiwibWF0U2hhZG93Vmlld1Byb2oiLCJ2ZWM0IiwiVmVjNCIsIkZvcndhcmRQaXBlbGluZSIsIlJlbmRlclRleHR1cmVDb25maWciLCJNYXRlcmlhbENvbmZpZyIsImZvZyIsIkZvZyIsImFtYmllbnQiLCJBbWJpZW50Iiwic2t5Ym94IiwiU2t5Ym94Iiwic2hhZG93cyIsIlNoYWRvd3MiLCJyZW5kZXJPYmplY3RzIiwic2hhZG93T2JqZWN0cyIsIl9pc0hEUiIsIl9zaGFkaW5nU2NhbGUiLCJfZnBTY2FsZSIsIl9yZW5kZXJQYXNzZXMiLCJNYXAiLCJfZ2xvYmFsVUJPIiwiRmxvYXQzMkFycmF5IiwiVUJPR2xvYmFsIiwiQ09VTlQiLCJfc2hhZG93VUJPIiwiVUJPU2hhZG93IiwiaW5mbyIsIl9mbG93cyIsImxlbmd0aCIsInNoYWRvd0Zsb3ciLCJTaGFkb3dGbG93IiwiaW5pdGlhbGl6ZSIsImluaXRJbmZvIiwicHVzaCIsImZvcndhcmRGbG93IiwiRm9yd2FyZEZsb3ciLCJ1aUZsb3ciLCJVSUZsb3ciLCJhY3RpdmF0ZSIsIl9tYWNyb3MiLCJfYWN0aXZlUmVuZGVyZXIiLCJjb25zb2xlIiwiZXJyb3IiLCJ2aWV3cyIsImkiLCJ2aWV3IiwiaiIsImZsb3dzIiwicmVuZGVyIiwiX2NvbW1hbmRCdWZmZXJzIiwiZW5kIiwiX2RldmljZSIsInF1ZXVlIiwic3VibWl0IiwiY2xlYXJGbGFncyIsInJlbmRlclBhc3MiLCJnZXQiLCJkZXZpY2UiLCJjb2xvckF0dGFjaG1lbnQiLCJHRlhDb2xvckF0dGFjaG1lbnQiLCJkZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCIsImZvcm1hdCIsImNvbG9yRm9ybWF0IiwiZGVwdGhTdGVuY2lsRm9ybWF0IiwiR0ZYQ2xlYXJGbGFnIiwiQ09MT1IiLCJTS1lCT1hfRkxBRyIsImxvYWRPcCIsIkdGWExvYWRPcCIsIkRJU0NBUkQiLCJMT0FEIiwiYmVnaW5MYXlvdXQiLCJHRlhUZXh0dXJlTGF5b3V0IiwiUFJFU0VOVF9TUkMiLCJERVBUSF9TVEVOQ0lMIiwiREVQVEgiLCJkZXB0aExvYWRPcCIsIlNURU5DSUwiLCJzdGVuY2lsTG9hZE9wIiwiREVQVEhfU1RFTkNJTF9BVFRBQ0hNRU5UX09QVElNQUwiLCJyZW5kZXJQYXNzSW5mbyIsIkdGWFJlbmRlclBhc3NJbmZvIiwiY3JlYXRlUmVuZGVyUGFzcyIsInNldCIsIl91cGRhdGVVQk8iLCJtYWluTGlnaHQiLCJjYW1lcmEiLCJzY2VuZSIsInNoYWRvd0luZm8iLCJ0eXBlIiwiU2hhZG93VHlwZSIsIlNoYWRvd01hcCIsInNoYWRvd0NhbWVyYVZpZXciLCJub2RlIiwid29ybGRSb3RhdGlvbiIsImRpcmVjdGlvbiIsImludmVydCIsIngiLCJ5Iiwib3J0aG9TaXplIiwic3BoZXJlIiwicmFkaXVzIiwiYXNwZWN0IiwicHJvamVjdGlvblNpZ25ZIiwic2NyZWVuU3BhY2VTaWduWSIsIlVWU3BhY2VTaWduWSIsIm9ydGhvIiwibmVhciIsImZhciIsImNsaXBTcGFjZU1pbloiLCJtdWx0aXBseSIsInRvQXJyYXkiLCJNQVRfTElHSFRfVklFV19QUk9KX09GRlNFVCIsInBjZiIsIlNIQURPV19QQ0ZfT0ZGU0VUIiwic2l6ZSIsIlNIQURPV19TSVpFX09GRlNFVCIsInVwZGF0ZUJ1ZmZlciIsIl9kZXNjcmlwdG9yU2V0IiwiZ2V0QnVmZmVyIiwiQklORElORyIsImNvbW1hbmRCdWZmZXIiLCJnbG9iYWxVQk8iLCJjcmVhdGVCdWZmZXIiLCJHRlhCdWZmZXJJbmZvIiwiR0ZYQnVmZmVyVXNhZ2VCaXQiLCJVTklGT1JNIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiU0laRSIsImJpbmRCdWZmZXIiLCJzaGFkb3dVQk8iLCJzaGFkb3dNYXBTYW1wbGVySGFzaCIsIkdGWEZpbHRlciIsIkxJTkVBUiIsIk5PTkUiLCJHRlhBZGRyZXNzIiwiQ0xBTVAiLCJzaGFkb3dNYXBTYW1wbGVyIiwic2FtcGxlckxpYiIsImdldFNhbXBsZXIiLCJiaW5kU2FtcGxlciIsIlVOSUZPUk1fU0hBRE9XTUFQX0JJTkRJTkciLCJtYWNyb3MiLCJDQ19VU0VfSERSIiwiQ0NfU1VQUE9SVF9GTE9BVF9URVhUVVJFIiwiaGFzRmVhdHVyZSIsIkdGWEZlYXR1cmUiLCJURVhUVVJFX0ZMT0FUIiwidXBkYXRlIiwicm9vdCIsImxlZ2FjeUNDIiwiZGlyZWN0b3IiLCJmdiIsInNoYWRpbmdXaWR0aCIsIk1hdGgiLCJmbG9vciIsIndpZHRoIiwic2hhZGluZ0hlaWdodCIsImhlaWdodCIsIlRJTUVfT0ZGU0VUIiwiY3VtdWxhdGl2ZVRpbWUiLCJmcmFtZVRpbWUiLCJnZXRUb3RhbEZyYW1lcyIsIlNDUkVFTl9TSVpFX09GRlNFVCIsIlNDUkVFTl9TQ0FMRV9PRkZTRVQiLCJzaGFkaW5nU2NhbGUiLCJOQVRJVkVfU0laRV9PRkZTRVQiLCJtYXRWaWV3IiwiTUFUX1ZJRVdfT0ZGU0VUIiwid29ybGRNYXRyaXgiLCJNQVRfVklFV19JTlZfT0ZGU0VUIiwibWF0UHJvaiIsIk1BVF9QUk9KX09GRlNFVCIsIm1hdFByb2pJbnYiLCJNQVRfUFJPSl9JTlZfT0ZGU0VUIiwibWF0Vmlld1Byb2oiLCJNQVRfVklFV19QUk9KX09GRlNFVCIsIm1hdFZpZXdQcm9qSW52IiwiTUFUX1ZJRVdfUFJPSl9JTlZfT0ZGU0VUIiwiVmVjMyIsInBvc2l0aW9uIiwiQ0FNRVJBX1BPU19PRkZTRVQiLCJ3aW5kb3ciLCJoYXNPZmZTY3JlZW5BdHRhY2htZW50cyIsImV4cG9zdXJlIiwiRVhQT1NVUkVfT0ZGU0VUIiwiTUFJTl9MSVRfRElSX09GRlNFVCIsImNvbG9yIiwiTUFJTl9MSVRfQ09MT1JfT0ZGU0VUIiwidXNlQ29sb3JUZW1wZXJhdHVyZSIsImNvbG9yVGVtcFJHQiIsImNvbG9yVGVtcGVyYXR1cmVSR0IiLCJ6IiwiaWxsdW1pbmFuY2UiLCJVTklUX1oiLCJaRVJPIiwic2t5Q29sb3IiLCJjb2xvckFycmF5Iiwic2t5SWxsdW0iLCJBTUJJRU5UX1NLWV9PRkZTRVQiLCJhbGJlZG9BcnJheSIsIkFNQklFTlRfR1JPVU5EX09GRlNFVCIsImVuYWJsZWQiLCJHTE9CQUxfRk9HX0NPTE9SX09GRlNFVCIsIkdMT0JBTF9GT0dfQkFTRV9PRkZTRVQiLCJmb2dTdGFydCIsImZvZ0VuZCIsImZvZ0RlbnNpdHkiLCJHTE9CQUxfRk9HX0FERF9PRkZTRVQiLCJmb2dUb3AiLCJmb2dSYW5nZSIsImZvZ0F0dGVuIiwiZGVzdHJveSIsImRlc3Ryb3lVQk9zIiwicnBJdGVyIiwidmFsdWVzIiwicnBSZXMiLCJuZXh0IiwiZG9uZSIsInZhbHVlIiwidmFsIiwiZGVmYXVsdEdsb2JhbFVCT0RhdGEiLCJSZW5kZXJQaXBlbGluZSIsInNlcmlhbGl6YWJsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEwQkEsTUFBTUEsYUFBYSxHQUFHLElBQUlDLFlBQUosRUFBdEI7QUFDQSxNQUFNQyxpQkFBaUIsR0FBRyxJQUFJRCxZQUFKLEVBQTFCO0FBQ0EsTUFBTUUsSUFBSSxHQUFHLElBQUlDLFlBQUosRUFBYjtBQUVBOzs7OztNQUthQyxlLFdBRFosb0JBQVEsaUJBQVIsQyxVQWlDSSxpQkFBSyxDQUFDQywwQ0FBRCxDQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEMsVUFHQSxpQkFBSyxDQUFDQyxxQ0FBRCxDQUFMLEMsVUFFQSx5QkFBYSxDQUFiLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBR01DLEcsR0FBVyxJQUFJQyxRQUFKLEU7WUFDWEMsTyxHQUFtQixJQUFJQyxnQkFBSixFO1lBQ25CQyxNLEdBQWlCLElBQUlDLGNBQUosRTtZQUNqQkMsTyxHQUFtQixJQUFJQyxnQkFBSixFO1lBTW5CQyxhLEdBQWlDLEU7WUFD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QXFCckIsTUFBckIsR0FBOEIsQ0FBOUI7QUFFQSxhQUFLckIsT0FBTCxDQUFhaU4sT0FBYjtBQUNBLGFBQUsvTSxNQUFMLENBQVkrTSxPQUFaO0FBQ0EsYUFBS25OLEdBQUwsQ0FBU21OLE9BQVQ7QUFDQSxhQUFLN00sT0FBTCxDQUFhNk0sT0FBYjtBQUVBO0FBQ0g7OzswQkEzVlk7QUFDVCxlQUFPLEtBQUt6TSxNQUFaO0FBQ0gsTzt3QkFFVWlOLEcsRUFBSztBQUNaLFlBQUksS0FBS2pOLE1BQUwsS0FBZ0JpTixHQUFwQixFQUF5QjtBQUNyQjtBQUNIOztBQUVELGFBQUtqTixNQUFMLEdBQWNpTixHQUFkO0FBQ0EsWUFBTUMsb0JBQW9CLEdBQUcsS0FBSzdNLFVBQWxDO0FBQ0E2TSxRQUFBQSxvQkFBb0IsQ0FBQzNNLGtCQUFVdUssZUFBVixHQUE0QixDQUE3QixDQUFwQixHQUFzRCxLQUFLOUssTUFBTCxHQUFjLEdBQWQsR0FBb0IsR0FBMUU7QUFDSDs7OzBCQUUyQjtBQUN4QixlQUFPLEtBQUtDLGFBQVo7QUFDSDs7OzBCQUVzQjtBQUNuQixlQUFPLEtBQUtDLFFBQVo7QUFDSDtBQUVEOzs7Ozs7OzBCQUkrQjtBQUMzQixlQUFPLEtBQUtPLFVBQVo7QUFDSDs7OztJQTlCZ0MwTSw4QixpR0FpQ2hDQyxtQjs7Ozs7YUFFaUQsRTs7dUZBR2pEQSxtQjs7Ozs7YUFFdUMsRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgcGlwZWxpbmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBjY2NsYXNzLCBkaXNwbGF5T3JkZXIsIHR5cGUsIHNlcmlhbGl6YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFJlbmRlclBpcGVsaW5lLCBJUmVuZGVyUGlwZWxpbmVJbmZvIH0gZnJvbSAnLi4vcmVuZGVyLXBpcGVsaW5lJztcclxuaW1wb3J0IHsgRm9yd2FyZEZsb3cgfSBmcm9tICcuL2ZvcndhcmQtZmxvdyc7XHJcbmltcG9ydCB7IFJlbmRlclRleHR1cmVDb25maWcsIE1hdGVyaWFsQ29uZmlnIH0gZnJvbSAnLi4vcGlwZWxpbmUtc2VyaWFsaXphdGlvbic7XHJcbmltcG9ydCB7IFNoYWRvd0Zsb3cgfSBmcm9tICcuLi9zaGFkb3cvc2hhZG93LWZsb3cnO1xyXG5pbXBvcnQgeyBnZW5TYW1wbGVySGFzaCwgc2FtcGxlckxpYiB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL2NvcmUvc2FtcGxlci1saWInO1xyXG5pbXBvcnQgeyBJUmVuZGVyT2JqZWN0LCBVQk9HbG9iYWwsIFVCT1NoYWRvdywgVU5JRk9STV9TSEFET1dNQVBfQklORElORyB9IGZyb20gJy4uL2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWEJ1ZmZlclVzYWdlQml0LCBHRlhNZW1vcnlVc2FnZUJpdCxcclxuICAgIEdGWENsZWFyRmxhZywgR0ZYRmlsdGVyLCBHRlhBZGRyZXNzIH0gZnJvbSAnLi4vLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWENvbG9yQXR0YWNobWVudCwgR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCwgR0ZYUmVuZGVyUGFzcywgR0ZYTG9hZE9wLCBHRlhUZXh0dXJlTGF5b3V0LCBHRlhSZW5kZXJQYXNzSW5mbywgR0ZYQnVmZmVySW5mbyB9IGZyb20gJy4uLy4uL2dmeCc7XHJcbmltcG9ydCB7IFNLWUJPWF9GTEFHIH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvY2FtZXJhJztcclxuaW1wb3J0IHsgbGVnYWN5Q0MgfSBmcm9tICcuLi8uLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFJlbmRlclZpZXcgfSBmcm9tICcuLi9yZW5kZXItdmlldyc7XHJcbmltcG9ydCB7IE1hdDQsIFZlYzMsIFZlYzR9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBHRlhGZWF0dXJlIH0gZnJvbSAnLi4vLi4vZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEZvZyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3NjZW5lL2ZvZyc7XHJcbmltcG9ydCB7IEFtYmllbnQgfSBmcm9tICcuLi8uLi9yZW5kZXJlci9zY2VuZS9hbWJpZW50JztcclxuaW1wb3J0IHsgU2t5Ym94IH0gZnJvbSAnLi4vLi4vcmVuZGVyZXIvc2NlbmUvc2t5Ym94JztcclxuaW1wb3J0IHsgU2hhZG93cywgU2hhZG93VHlwZSB9IGZyb20gJy4uLy4uL3JlbmRlcmVyL3NjZW5lL3NoYWRvd3MnO1xyXG5pbXBvcnQgeyBzY2VuZUN1bGxpbmcsIGdldFNoYWRvd1dvcmxkTWF0cml4IH0gZnJvbSAnLi9zY2VuZS1jdWxsaW5nJztcclxuaW1wb3J0IHsgVUlGbG93IH0gZnJvbSAnLi4vdWkvdWktZmxvdyc7XHJcblxyXG5jb25zdCBtYXRTaGFkb3dWaWV3ID0gbmV3IE1hdDQoKTtcclxuY29uc3QgbWF0U2hhZG93Vmlld1Byb2ogPSBuZXcgTWF0NCgpO1xyXG5jb25zdCB2ZWM0ID0gbmV3IFZlYzQoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGhlIGZvcndhcmQgcmVuZGVyIHBpcGVsaW5lXHJcbiAqIEB6aCDliY3lkJHmuLLmn5PnrqHnur/jgIJcclxuICovXHJcbkBjY2NsYXNzKCdGb3J3YXJkUGlwZWxpbmUnKVxyXG5leHBvcnQgY2xhc3MgRm9yd2FyZFBpcGVsaW5lIGV4dGVuZHMgUmVuZGVyUGlwZWxpbmUge1xyXG5cclxuICAgIGdldCBpc0hEUiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lzSERSO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBpc0hEUiAodmFsKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSERSID09PSB2YWwpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9pc0hEUiA9IHZhbDtcclxuICAgICAgICBjb25zdCBkZWZhdWx0R2xvYmFsVUJPRGF0YSA9IHRoaXMuX2dsb2JhbFVCTztcclxuICAgICAgICBkZWZhdWx0R2xvYmFsVUJPRGF0YVtVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUICsgMl0gPSB0aGlzLl9pc0hEUiA/IDEuMCA6IDAuMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2hhZGluZ1NjYWxlICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkaW5nU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGZwU2NhbGUgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZwU2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gR2V0IHNoYWRvdyBVQk8uXHJcbiAgICAgKiBAemgg6I635Y+W6Zi05b2xVUJP44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBzaGFkb3dVQk8gKCk6IEZsb2F0MzJBcnJheSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd1VCTztcclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShbUmVuZGVyVGV4dHVyZUNvbmZpZ10pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDIpXHJcbiAgICBwcm90ZWN0ZWQgcmVuZGVyVGV4dHVyZXM6IFJlbmRlclRleHR1cmVDb25maWdbXSA9IFtdO1xyXG5cclxuICAgIEB0eXBlKFtNYXRlcmlhbENvbmZpZ10pXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzcGxheU9yZGVyKDMpXHJcbiAgICBwcm90ZWN0ZWQgbWF0ZXJpYWxzOiBNYXRlcmlhbENvbmZpZ1tdID0gW107XHJcblxyXG4gICAgcHVibGljIGZvZzogRm9nID0gbmV3IEZvZygpO1xyXG4gICAgcHVibGljIGFtYmllbnQ6IEFtYmllbnQgPSBuZXcgQW1iaWVudCgpO1xyXG4gICAgcHVibGljIHNreWJveDogU2t5Ym94ID0gbmV3IFNreWJveCgpO1xyXG4gICAgcHVibGljIHNoYWRvd3M6IFNoYWRvd3MgPSBuZXcgU2hhZG93cygpO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGxpc3QgZm9yIHJlbmRlciBvYmplY3RzLCBvbmx5IGF2YWlsYWJsZSBhZnRlciB0aGUgc2NlbmUgY3VsbGluZyBvZiB0aGUgY3VycmVudCBmcmFtZS5cclxuICAgICAqIEB6aCDmuLLmn5Plr7nosaHmlbDnu4TvvIzku4XlnKjlvZPliY3luKfnmoTlnLrmma/liZTpmaTlrozmiJDlkI7mnInmlYjjgIJcclxuICAgICAqIEByZWFkb25seVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVuZGVyT2JqZWN0czogSVJlbmRlck9iamVjdFtdID0gW107XHJcbiAgICBwdWJsaWMgc2hhZG93T2JqZWN0czogSVJlbmRlck9iamVjdFtdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX2lzSERSOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRpbmdTY2FsZTogbnVtYmVyID0gMS4wO1xyXG4gICAgcHJvdGVjdGVkIF9mcFNjYWxlOiBudW1iZXIgPSAxLjAgLyAxMDI0LjA7XHJcbiAgICBwcm90ZWN0ZWQgX3JlbmRlclBhc3NlcyA9IG5ldyBNYXA8R0ZYQ2xlYXJGbGFnLCBHRlhSZW5kZXJQYXNzPigpO1xyXG4gICAgcHJvdGVjdGVkIF9nbG9iYWxVQk8gPSBuZXcgRmxvYXQzMkFycmF5KFVCT0dsb2JhbC5DT1VOVCk7XHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRvd1VCTyA9IG5ldyBGbG9hdDMyQXJyYXkoVUJPU2hhZG93LkNPVU5UKTtcclxuXHJcbiAgICBwdWJsaWMgaW5pdGlhbGl6ZSAoaW5mbzogSVJlbmRlclBpcGVsaW5lSW5mbyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHN1cGVyLmluaXRpYWxpemUoaW5mbyk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9mbG93cy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93RmxvdyA9IG5ldyBTaGFkb3dGbG93KCk7XHJcbiAgICAgICAgICAgIHNoYWRvd0Zsb3cuaW5pdGlhbGl6ZShTaGFkb3dGbG93LmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZmxvd3MucHVzaChzaGFkb3dGbG93KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGZvcndhcmRGbG93ID0gbmV3IEZvcndhcmRGbG93KCk7XHJcbiAgICAgICAgICAgIGZvcndhcmRGbG93LmluaXRpYWxpemUoRm9yd2FyZEZsb3cuaW5pdEluZm8pO1xyXG4gICAgICAgICAgICB0aGlzLl9mbG93cy5wdXNoKGZvcndhcmRGbG93KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVpRmxvdyA9IG5ldyBVSUZsb3coKTtcclxuICAgICAgICAgICAgdWlGbG93LmluaXRpYWxpemUoVUlGbG93LmluaXRJbmZvKTtcclxuICAgICAgICAgICAgdGhpcy5fZmxvd3MucHVzaCh1aUZsb3cpO1xyXG4gICAgICAgICAgICB1aUZsb3cuYWN0aXZhdGUodGhpcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWN0aXZhdGUgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHRoaXMuX21hY3JvcyA9IHt9O1xyXG5cclxuICAgICAgICBpZiAoIXN1cGVyLmFjdGl2YXRlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9hY3RpdmVSZW5kZXJlcigpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZvcndhcmRQaXBlbGluZSBzdGFydHVwIGZhaWxlZCEnKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlciAodmlld3M6IFJlbmRlclZpZXdbXSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlld3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgdmlldyA9IHZpZXdzW2ldO1xyXG4gICAgICAgICAgICBzY2VuZUN1bGxpbmcodGhpcywgdmlldyk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdmlldy5mbG93cy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgdmlldy5mbG93c1tqXS5yZW5kZXIodmlldyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29tbWFuZEJ1ZmZlcnNbMF0uZW5kKCk7XHJcbiAgICAgICAgdGhpcy5fZGV2aWNlLnF1ZXVlLnN1Ym1pdCh0aGlzLl9jb21tYW5kQnVmZmVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFJlbmRlclBhc3MgKGNsZWFyRmxhZ3M6IEdGWENsZWFyRmxhZyk6IEdGWFJlbmRlclBhc3Mge1xyXG4gICAgICAgIGxldCByZW5kZXJQYXNzID0gdGhpcy5fcmVuZGVyUGFzc2VzLmdldChjbGVhckZsYWdzKTtcclxuICAgICAgICBpZiAocmVuZGVyUGFzcykgeyByZXR1cm4gcmVuZGVyUGFzczsgfVxyXG5cclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZSE7XHJcbiAgICAgICAgY29uc3QgY29sb3JBdHRhY2htZW50ID0gbmV3IEdGWENvbG9yQXR0YWNobWVudCgpO1xyXG4gICAgICAgIGNvbnN0IGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQgPSBuZXcgR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCgpO1xyXG4gICAgICAgIGNvbG9yQXR0YWNobWVudC5mb3JtYXQgPSBkZXZpY2UuY29sb3JGb3JtYXQ7XHJcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5mb3JtYXQgPSBkZXZpY2UuZGVwdGhTdGVuY2lsRm9ybWF0O1xyXG5cclxuICAgICAgICBpZiAoIShjbGVhckZsYWdzICYgR0ZYQ2xlYXJGbGFnLkNPTE9SKSkge1xyXG4gICAgICAgICAgICBpZiAoY2xlYXJGbGFncyAmIFNLWUJPWF9GTEFHKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQubG9hZE9wID0gR0ZYTG9hZE9wLkRJU0NBUkQ7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQubG9hZE9wID0gR0ZYTG9hZE9wLkxPQUQ7XHJcbiAgICAgICAgICAgICAgICBjb2xvckF0dGFjaG1lbnQuYmVnaW5MYXlvdXQgPSBHRlhUZXh0dXJlTGF5b3V0LlBSRVNFTlRfU1JDO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuREVQVEhfU1RFTkNJTCkgIT09IEdGWENsZWFyRmxhZy5ERVBUSF9TVEVOQ0lMKSB7XHJcbiAgICAgICAgICAgIGlmICghKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuREVQVEgpKSBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmRlcHRoTG9hZE9wID0gR0ZYTG9hZE9wLkxPQUQ7XHJcbiAgICAgICAgICAgIGlmICghKGNsZWFyRmxhZ3MgJiBHRlhDbGVhckZsYWcuU1RFTkNJTCkpIGRlcHRoU3RlbmNpbEF0dGFjaG1lbnQuc3RlbmNpbExvYWRPcCA9IEdGWExvYWRPcC5MT0FEO1xyXG4gICAgICAgICAgICBkZXB0aFN0ZW5jaWxBdHRhY2htZW50LmJlZ2luTGF5b3V0ID0gR0ZYVGV4dHVyZUxheW91dC5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlRfT1BUSU1BTDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlclBhc3NJbmZvID0gbmV3IEdGWFJlbmRlclBhc3NJbmZvKFtjb2xvckF0dGFjaG1lbnRdLCBkZXB0aFN0ZW5jaWxBdHRhY2htZW50KTtcclxuICAgICAgICByZW5kZXJQYXNzID0gZGV2aWNlLmNyZWF0ZVJlbmRlclBhc3MocmVuZGVyUGFzc0luZm8pO1xyXG4gICAgICAgIHRoaXMuX3JlbmRlclBhc3Nlcy5zZXQoY2xlYXJGbGFncywgcmVuZGVyUGFzcyEpO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVuZGVyUGFzcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBVcGRhdGUgYWxsIFVCT3NcclxuICAgICAqIEB6aCDmm7TmlrDlhajpg6ggVUJP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB1cGRhdGVVQk9zICh2aWV3OiBSZW5kZXJWaWV3KSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlVUJPKHZpZXcpO1xyXG4gICAgICAgIGNvbnN0IG1haW5MaWdodCA9IHZpZXcuY2FtZXJhLnNjZW5lIS5tYWluTGlnaHQ7XHJcbiAgICAgICAgY29uc3QgZGV2aWNlID0gdGhpcy5kZXZpY2U7XHJcbiAgICAgICAgY29uc3Qgc2hhZG93SW5mbyA9IHRoaXMuc2hhZG93cztcclxuXHJcbiAgICAgICAgaWYgKG1haW5MaWdodCAmJiBzaGFkb3dJbmZvLnR5cGUgPT09IFNoYWRvd1R5cGUuU2hhZG93TWFwKSB7XHJcbiAgICAgICAgICAgIC8vIGxpZ2h0IHZpZXdcclxuICAgICAgICAgICAgY29uc3Qgc2hhZG93Q2FtZXJhVmlldyA9IGdldFNoYWRvd1dvcmxkTWF0cml4KHRoaXMsIG1haW5MaWdodCEubm9kZSEud29ybGRSb3RhdGlvbiwgbWFpbkxpZ2h0IS5kaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBNYXQ0LmludmVydChtYXRTaGFkb3dWaWV3LCBzaGFkb3dDYW1lcmFWaWV3KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGxpZ2h0IHByb2pcclxuICAgICAgICAgICAgbGV0IHg6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGxldCB5OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBpZiAoc2hhZG93SW5mby5vcnRob1NpemUgPiBzaGFkb3dJbmZvLnNwaGVyZS5yYWRpdXMpIHtcclxuICAgICAgICAgICAgICAgIHggPSBzaGFkb3dJbmZvLm9ydGhvU2l6ZSAqIHNoYWRvd0luZm8uYXNwZWN0O1xyXG4gICAgICAgICAgICAgICAgeSA9IHNoYWRvd0luZm8ub3J0aG9TaXplO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaWYgb3J0aG9TaXplIGlzIHRoZSBzbWFsbGVzdCwgYXV0byBjYWxjdWxhdGUgb3J0aG9TaXplLlxyXG4gICAgICAgICAgICAgICAgeCA9IHNoYWRvd0luZm8uc3BoZXJlLnJhZGl1cyAqIHNoYWRvd0luZm8uYXNwZWN0O1xyXG4gICAgICAgICAgICAgICAgeSA9IHNoYWRvd0luZm8uc3BoZXJlLnJhZGl1cztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBwcm9qZWN0aW9uU2lnblkgPSBkZXZpY2Uuc2NyZWVuU3BhY2VTaWduWSAqIGRldmljZS5VVlNwYWNlU2lnblk7IC8vIGFsd2F5cyBvZmZzY3JlZW5cclxuICAgICAgICAgICAgTWF0NC5vcnRobyhtYXRTaGFkb3dWaWV3UHJvaiwgLXgsIHgsIC15LCB5LCBzaGFkb3dJbmZvLm5lYXIsIHNoYWRvd0luZm8uZmFyLFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlLmNsaXBTcGFjZU1pblosIHByb2plY3Rpb25TaWduWSk7XHJcblxyXG4gICAgICAgICAgICAvLyBsaWdodCB2aWV3UHJvalxyXG4gICAgICAgICAgICBNYXQ0Lm11bHRpcGx5KG1hdFNoYWRvd1ZpZXdQcm9qLCBtYXRTaGFkb3dWaWV3UHJvaiwgbWF0U2hhZG93Vmlldyk7XHJcblxyXG4gICAgICAgICAgICBNYXQ0LnRvQXJyYXkodGhpcy5fc2hhZG93VUJPLCBtYXRTaGFkb3dWaWV3UHJvaiwgVUJPU2hhZG93Lk1BVF9MSUdIVF9WSUVXX1BST0pfT0ZGU0VUKTtcclxuXHJcbiAgICAgICAgICAgIHZlYzQuc2V0KHNoYWRvd0luZm8ucGNmKTtcclxuICAgICAgICAgICAgVmVjNC50b0FycmF5KHRoaXMuX3NoYWRvd1VCTywgdmVjNCwgVUJPU2hhZG93LlNIQURPV19QQ0ZfT0ZGU0VUKTtcclxuXHJcbiAgICAgICAgICAgIHZlYzQuc2V0KHNoYWRvd0luZm8uc2l6ZS54LCBzaGFkb3dJbmZvLnNpemUueSk7XHJcbiAgICAgICAgICAgIFZlYzQudG9BcnJheSh0aGlzLl9zaGFkb3dVQk8sIHZlYzQsIFVCT1NoYWRvdy5TSEFET1dfU0laRV9PRkZTRVQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIHVib3NcclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVyc1swXS51cGRhdGVCdWZmZXIodGhpcy5fZGVzY3JpcHRvclNldC5nZXRCdWZmZXIoVUJPR2xvYmFsLkJJTkRJTkcpLCB0aGlzLl9nbG9iYWxVQk8pO1xyXG4gICAgICAgIHRoaXMuX2NvbW1hbmRCdWZmZXJzWzBdLnVwZGF0ZUJ1ZmZlcih0aGlzLl9kZXNjcmlwdG9yU2V0LmdldEJ1ZmZlcihVQk9TaGFkb3cuQklORElORyksIHRoaXMuX3NoYWRvd1VCTyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYWN0aXZlUmVuZGVyZXIgKCkge1xyXG4gICAgICAgIGNvbnN0IGRldmljZSA9IHRoaXMuZGV2aWNlO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVycy5wdXNoKGRldmljZS5jb21tYW5kQnVmZmVyKTtcclxuXHJcbiAgICAgICAgY29uc3QgZ2xvYmFsVUJPID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVUJPR2xvYmFsLlNJWkUsXHJcbiAgICAgICAgICAgIFVCT0dsb2JhbC5TSVpFLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9HbG9iYWwuQklORElORywgZ2xvYmFsVUJPKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZG93VUJPID0gZGV2aWNlLmNyZWF0ZUJ1ZmZlcihuZXcgR0ZYQnVmZmVySW5mbyhcclxuICAgICAgICAgICAgR0ZYQnVmZmVyVXNhZ2VCaXQuVU5JRk9STSB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVUJPU2hhZG93LlNJWkUsXHJcbiAgICAgICAgICAgIFVCT1NoYWRvdy5TSVpFLFxyXG4gICAgICAgICkpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2NyaXB0b3JTZXQuYmluZEJ1ZmZlcihVQk9TaGFkb3cuQklORElORywgc2hhZG93VUJPKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZG93TWFwU2FtcGxlckhhc2ggPSBnZW5TYW1wbGVySGFzaChbXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5MSU5FQVIsXHJcbiAgICAgICAgICAgIEdGWEZpbHRlci5OT05FLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgICAgICBHRlhBZGRyZXNzLkNMQU1QLFxyXG4gICAgICAgIF0pO1xyXG4gICAgICAgIGNvbnN0IHNoYWRvd01hcFNhbXBsZXIgPSBzYW1wbGVyTGliLmdldFNhbXBsZXIoZGV2aWNlLCBzaGFkb3dNYXBTYW1wbGVySGFzaCk7XHJcbiAgICAgICAgdGhpcy5fZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihVTklGT1JNX1NIQURPV01BUF9CSU5ESU5HLCBzaGFkb3dNYXBTYW1wbGVyKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGdsb2JhbCBkZWZpbmVzIHdoZW4gYWxsIHN0YXRlcyBpbml0aWFsaXplZC5cclxuICAgICAgICB0aGlzLm1hY3Jvcy5DQ19VU0VfSERSID0gdGhpcy5faXNIRFI7XHJcbiAgICAgICAgdGhpcy5tYWNyb3MuQ0NfU1VQUE9SVF9GTE9BVF9URVhUVVJFID0gdGhpcy5kZXZpY2UuaGFzRmVhdHVyZShHRlhGZWF0dXJlLlRFWFRVUkVfRkxPQVQpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF91cGRhdGVVQk8gKHZpZXc6IFJlbmRlclZpZXcpIHtcclxuICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LnVwZGF0ZSgpO1xyXG5cclxuICAgICAgICBjb25zdCByb290ID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdDtcclxuXHJcbiAgICAgICAgY29uc3QgY2FtZXJhID0gdmlldy5jYW1lcmE7XHJcbiAgICAgICAgY29uc3Qgc2NlbmUgPSBjYW1lcmEuc2NlbmUhO1xyXG5cclxuICAgICAgICBjb25zdCBtYWluTGlnaHQgPSBzY2VuZS5tYWluTGlnaHQ7XHJcbiAgICAgICAgY29uc3QgYW1iaWVudCA9IHRoaXMuYW1iaWVudDtcclxuICAgICAgICBjb25zdCBmb2cgPSB0aGlzLmZvZztcclxuICAgICAgICBjb25zdCBmdiA9IHRoaXMuX2dsb2JhbFVCTztcclxuICAgICAgICBjb25zdCBkZXZpY2UgPSB0aGlzLmRldmljZTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2hhZGluZ1dpZHRoID0gTWF0aC5mbG9vcihkZXZpY2Uud2lkdGgpO1xyXG4gICAgICAgIGNvbnN0IHNoYWRpbmdIZWlnaHQgPSBNYXRoLmZsb29yKGRldmljZS5oZWlnaHQpO1xyXG5cclxuICAgICAgICAvLyB1cGRhdGUgVUJPR2xvYmFsXHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlRJTUVfT0ZGU0VUXSA9IHJvb3QuY3VtdWxhdGl2ZVRpbWU7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlRJTUVfT0ZGU0VUICsgMV0gPSByb290LmZyYW1lVGltZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuVElNRV9PRkZTRVQgKyAyXSA9IGxlZ2FjeUNDLmRpcmVjdG9yLmdldFRvdGFsRnJhbWVzKCk7XHJcblxyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVRdID0gZGV2aWNlLndpZHRoO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0laRV9PRkZTRVQgKyAxXSA9IGRldmljZS5oZWlnaHQ7XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlNDUkVFTl9TSVpFX09GRlNFVCArIDJdID0gMS4wIC8gZnZbVUJPR2xvYmFsLlNDUkVFTl9TSVpFX09GRlNFVF07XHJcbiAgICAgICAgZnZbVUJPR2xvYmFsLlNDUkVFTl9TSVpFX09GRlNFVCArIDNdID0gMS4wIC8gZnZbVUJPR2xvYmFsLlNDUkVFTl9TSVpFX09GRlNFVCArIDFdO1xyXG5cclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NDQUxFX09GRlNFVF0gPSBjYW1lcmEud2lkdGggLyBzaGFkaW5nV2lkdGggKiB0aGlzLnNoYWRpbmdTY2FsZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NDQUxFX09GRlNFVCArIDFdID0gY2FtZXJhLmhlaWdodCAvIHNoYWRpbmdIZWlnaHQgKiB0aGlzLnNoYWRpbmdTY2FsZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuU0NSRUVOX1NDQUxFX09GRlNFVCArIDJdID0gMS4wIC8gZnZbVUJPR2xvYmFsLlNDUkVFTl9TQ0FMRV9PRkZTRVRdO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5TQ1JFRU5fU0NBTEVfT0ZGU0VUICsgM10gPSAxLjAgLyBmdltVQk9HbG9iYWwuU0NSRUVOX1NDQUxFX09GRlNFVCArIDFdO1xyXG5cclxuICAgICAgICBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUXSA9IHNoYWRpbmdXaWR0aDtcclxuICAgICAgICBmdltVQk9HbG9iYWwuTkFUSVZFX1NJWkVfT0ZGU0VUICsgMV0gPSBzaGFkaW5nSGVpZ2h0O1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5OQVRJVkVfU0laRV9PRkZTRVQgKyAyXSA9IDEuMCAvIGZ2W1VCT0dsb2JhbC5OQVRJVkVfU0laRV9PRkZTRVRdO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5OQVRJVkVfU0laRV9PRkZTRVQgKyAzXSA9IDEuMCAvIGZ2W1VCT0dsb2JhbC5OQVRJVkVfU0laRV9PRkZTRVQgKyAxXTtcclxuXHJcbiAgICAgICAgTWF0NC50b0FycmF5KGZ2LCBjYW1lcmEubWF0VmlldywgVUJPR2xvYmFsLk1BVF9WSUVXX09GRlNFVCk7XHJcbiAgICAgICAgTWF0NC50b0FycmF5KGZ2LCBjYW1lcmEubm9kZS53b3JsZE1hdHJpeCwgVUJPR2xvYmFsLk1BVF9WSUVXX0lOVl9PRkZTRVQpO1xyXG4gICAgICAgIE1hdDQudG9BcnJheShmdiwgY2FtZXJhLm1hdFByb2osIFVCT0dsb2JhbC5NQVRfUFJPSl9PRkZTRVQpO1xyXG4gICAgICAgIE1hdDQudG9BcnJheShmdiwgY2FtZXJhLm1hdFByb2pJbnYsIFVCT0dsb2JhbC5NQVRfUFJPSl9JTlZfT0ZGU0VUKTtcclxuICAgICAgICBNYXQ0LnRvQXJyYXkoZnYsIGNhbWVyYS5tYXRWaWV3UHJvaiwgVUJPR2xvYmFsLk1BVF9WSUVXX1BST0pfT0ZGU0VUKTtcclxuICAgICAgICBNYXQ0LnRvQXJyYXkoZnYsIGNhbWVyYS5tYXRWaWV3UHJvakludiwgVUJPR2xvYmFsLk1BVF9WSUVXX1BST0pfSU5WX09GRlNFVCk7XHJcbiAgICAgICAgVmVjMy50b0FycmF5KGZ2LCBjYW1lcmEucG9zaXRpb24sIFVCT0dsb2JhbC5DQU1FUkFfUE9TX09GRlNFVCk7XHJcbiAgICAgICAgbGV0IHByb2plY3Rpb25TaWduWSA9IGRldmljZS5zY3JlZW5TcGFjZVNpZ25ZO1xyXG4gICAgICAgIGlmICh2aWV3LndpbmRvdy5oYXNPZmZTY3JlZW5BdHRhY2htZW50cykge1xyXG4gICAgICAgICAgICBwcm9qZWN0aW9uU2lnblkgKj0gZGV2aWNlLlVWU3BhY2VTaWduWTsgLy8gbmVlZCBmbGlwcGluZyBpZiBkcmF3aW5nIG9uIHJlbmRlciB0YXJnZXRzXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5DQU1FUkFfUE9TX09GRlNFVCArIDNdID0gcHJvamVjdGlvblNpZ25ZO1xyXG5cclxuICAgICAgICBjb25zdCBleHBvc3VyZSA9IGNhbWVyYS5leHBvc3VyZTtcclxuICAgICAgICBmdltVQk9HbG9iYWwuRVhQT1NVUkVfT0ZGU0VUXSA9IGV4cG9zdXJlO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5FWFBPU1VSRV9PRkZTRVQgKyAxXSA9IDEuMCAvIGV4cG9zdXJlO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5FWFBPU1VSRV9PRkZTRVQgKyAyXSA9IHRoaXMuX2lzSERSID8gMS4wIDogMC4wO1xyXG4gICAgICAgIGZ2W1VCT0dsb2JhbC5FWFBPU1VSRV9PRkZTRVQgKyAzXSA9IHRoaXMuX2ZwU2NhbGUgLyBleHBvc3VyZTtcclxuXHJcbiAgICAgICAgaWYgKG1haW5MaWdodCkge1xyXG4gICAgICAgICAgICBWZWMzLnRvQXJyYXkoZnYsIG1haW5MaWdodC5kaXJlY3Rpb24sIFVCT0dsb2JhbC5NQUlOX0xJVF9ESVJfT0ZGU0VUKTtcclxuICAgICAgICAgICAgVmVjMy50b0FycmF5KGZ2LCBtYWluTGlnaHQuY29sb3IsIFVCT0dsb2JhbC5NQUlOX0xJVF9DT0xPUl9PRkZTRVQpO1xyXG4gICAgICAgICAgICBpZiAobWFpbkxpZ2h0LnVzZUNvbG9yVGVtcGVyYXR1cmUpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNvbG9yVGVtcFJHQiA9IG1haW5MaWdodC5jb2xvclRlbXBlcmF0dXJlUkdCO1xyXG4gICAgICAgICAgICAgICAgZnZbVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVF0gKj0gY29sb3JUZW1wUkdCLng7XHJcbiAgICAgICAgICAgICAgICBmdltVQk9HbG9iYWwuTUFJTl9MSVRfQ09MT1JfT0ZGU0VUICsgMV0gKj0gY29sb3JUZW1wUkdCLnk7XHJcbiAgICAgICAgICAgICAgICBmdltVQk9HbG9iYWwuTUFJTl9MSVRfQ09MT1JfT0ZGU0VUICsgMl0gKj0gY29sb3JUZW1wUkdCLno7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pc0hEUikge1xyXG4gICAgICAgICAgICAgICAgZnZbVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVCArIDNdID0gbWFpbkxpZ2h0LmlsbHVtaW5hbmNlICogdGhpcy5fZnBTY2FsZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5NQUlOX0xJVF9DT0xPUl9PRkZTRVQgKyAzXSA9IG1haW5MaWdodC5pbGx1bWluYW5jZSAqIGV4cG9zdXJlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgVmVjMy50b0FycmF5KGZ2LCBWZWMzLlVOSVRfWiwgVUJPR2xvYmFsLk1BSU5fTElUX0RJUl9PRkZTRVQpO1xyXG4gICAgICAgICAgICBWZWM0LnRvQXJyYXkoZnYsIFZlYzQuWkVSTywgVUJPR2xvYmFsLk1BSU5fTElUX0NPTE9SX09GRlNFVCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBza3lDb2xvciA9IGFtYmllbnQuY29sb3JBcnJheTtcclxuICAgICAgICBpZiAodGhpcy5faXNIRFIpIHtcclxuICAgICAgICAgICAgc2t5Q29sb3JbM10gPSBhbWJpZW50LnNreUlsbHVtICogdGhpcy5fZnBTY2FsZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBza3lDb2xvclszXSA9IGFtYmllbnQuc2t5SWxsdW0gKiBleHBvc3VyZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnYuc2V0KHNreUNvbG9yLCBVQk9HbG9iYWwuQU1CSUVOVF9TS1lfT0ZGU0VUKTtcclxuICAgICAgICBmdi5zZXQoYW1iaWVudC5hbGJlZG9BcnJheSwgVUJPR2xvYmFsLkFNQklFTlRfR1JPVU5EX09GRlNFVCk7XHJcblxyXG4gICAgICAgIGlmIChmb2cuZW5hYmxlZCkge1xyXG4gICAgICAgICAgICBmdi5zZXQoZm9nLmNvbG9yQXJyYXksIFVCT0dsb2JhbC5HTE9CQUxfRk9HX0NPTE9SX09GRlNFVCk7XHJcblxyXG4gICAgICAgICAgICBmdltVQk9HbG9iYWwuR0xPQkFMX0ZPR19CQVNFX09GRlNFVF0gPSBmb2cuZm9nU3RhcnQ7XHJcbiAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5HTE9CQUxfRk9HX0JBU0VfT0ZGU0VUICsgMV0gPSBmb2cuZm9nRW5kO1xyXG4gICAgICAgICAgICBmdltVQk9HbG9iYWwuR0xPQkFMX0ZPR19CQVNFX09GRlNFVCArIDJdID0gZm9nLmZvZ0RlbnNpdHk7XHJcblxyXG4gICAgICAgICAgICBmdltVQk9HbG9iYWwuR0xPQkFMX0ZPR19BRERfT0ZGU0VUXSA9IGZvZy5mb2dUb3A7XHJcbiAgICAgICAgICAgIGZ2W1VCT0dsb2JhbC5HTE9CQUxfRk9HX0FERF9PRkZTRVQgKyAxXSA9IGZvZy5mb2dSYW5nZTtcclxuICAgICAgICAgICAgZnZbVUJPR2xvYmFsLkdMT0JBTF9GT0dfQUREX09GRlNFVCArIDJdID0gZm9nLmZvZ0F0dGVuO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGRlc3Ryb3lVQk9zICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fZGVzY3JpcHRvclNldCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmdldEJ1ZmZlcihVQk9HbG9iYWwuQklORElORykuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNjcmlwdG9yU2V0LmdldEJ1ZmZlcihVQk9TaGFkb3cuQklORElORykuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5kZXN0cm95VUJPcygpO1xyXG5cclxuICAgICAgICBjb25zdCBycEl0ZXIgPSB0aGlzLl9yZW5kZXJQYXNzZXMudmFsdWVzKCk7XHJcbiAgICAgICAgbGV0IHJwUmVzID0gcnBJdGVyLm5leHQoKTtcclxuICAgICAgICB3aGlsZSAoIXJwUmVzLmRvbmUpIHtcclxuICAgICAgICAgICAgcnBSZXMudmFsdWUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBycFJlcyA9IHJwSXRlci5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jb21tYW5kQnVmZmVycy5sZW5ndGggPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmFtYmllbnQuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuc2t5Ym94LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLmZvZy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5zaGFkb3dzLmRlc3Ryb3koKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG4iXX0=