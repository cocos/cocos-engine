(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/3d/builtin/index.js", "../../core/gfx/define.js", "../../core/gfx/input-assembler.js", "../../core/math/index.js", "../../core/renderer/core/material-instance.js", "../enum.js", "../particle.js", "../animator/gradient-range.js", "../../core/renderer/core/pass.js", "../animator/curve-range.js", "./particle-system-renderer-base.js", "../../core/default-constants.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/3d/builtin/index.js"), require("../../core/gfx/define.js"), require("../../core/gfx/input-assembler.js"), require("../../core/math/index.js"), require("../../core/renderer/core/material-instance.js"), require("../enum.js"), require("../particle.js"), require("../animator/gradient-range.js"), require("../../core/renderer/core/pass.js"), require("../animator/curve-range.js"), require("./particle-system-renderer-base.js"), require("../../core/default-constants.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.inputAssembler, global.index, global.materialInstance, global._enum, global.particle, global.gradientRange, global.pass, global.curveRange, global.particleSystemRendererBase, global.defaultConstants);
    global.particleSystemRendererGpu = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _inputAssembler, _index2, _materialInstance, _enum, _particle, _gradientRange, _pass, _curveRange, _particleSystemRendererBase, _defaultConstants) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

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

  var _tempWorldTrans = new _index2.Mat4();

  var _tempVec4 = new _index2.Vec4();

  var _world_rot = new _index2.Quat();

  var _sample_num = 32;

  var _sample_interval = 1.0 / _sample_num;

  var CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
  var CC_RENDER_MODE = 'CC_RENDER_MODE';
  var RENDER_MODE_BILLBOARD = 0;
  var RENDER_MODE_STRETCHED_BILLBOARD = 1;
  var RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
  var RENDER_MODE_VERTICAL_BILLBOARD = 3;
  var RENDER_MODE_MESH = 4;
  var COLOR_OVER_TIME_MODULE_ENABLE = 'COLOR_OVER_TIME_MODULE_ENABLE';
  var ROTATION_OVER_TIME_MODULE_ENABLE = 'ROTATION_OVER_TIME_MODULE_ENABLE';
  var SIZE_OVER_TIME_MODULE_ENABLE = 'SIZE_OVER_TIME_MODULE_ENABLE';
  var VELOCITY_OVER_TIME_MODULE_ENABLE = 'VELOCITY_OVER_TIME_MODULE_ENABLE';
  var FORCE_OVER_TIME_MODULE_ENABLE = 'FORCE_OVER_TIME_MODULE_ENABLE';
  var TEXTURE_ANIMATION_MODULE_ENABLE = 'TEXTURE_ANIMATION_MODULE_ENABLE';
  var _vert_attr_name = {
    POSITION_STARTTIME: 'a_position_starttime',
    VERT_SIZE_UV: 'a_size_uv',
    VERT_ROTATION_UV: 'a_rotation_uv',
    COLOR: 'a_color',
    DIR_LIFE: 'a_dir_life',
    RANDOM_SEED: 'a_rndSeed'
  };
  var _gpu_vert_attr = [new _inputAssembler.GFXAttribute(_vert_attr_name.POSITION_STARTTIME, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.VERT_SIZE_UV, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.VERT_ROTATION_UV, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.COLOR, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.DIR_LIFE, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.RANDOM_SEED, _define.GFXFormat.R32F)];
  var _gpu_vert_attr_mesh = [new _inputAssembler.GFXAttribute(_vert_attr_name.POSITION_STARTTIME, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.VERT_SIZE_UV, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.VERT_ROTATION_UV, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.COLOR, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.DIR_LIFE, _define.GFXFormat.RGBA32F), new _inputAssembler.GFXAttribute(_vert_attr_name.RANDOM_SEED, _define.GFXFormat.R32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGB32F), // uv,frame idx
  new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD3, _define.GFXFormat.RGB32F), // mesh position
  new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_NORMAL, _define.GFXFormat.RGB32F), // mesh normal
  new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR1, _define.GFXFormat.RGBA8, true) // mesh color
  ];
  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };

  var ParticleSystemRendererGPU = /*#__PURE__*/function (_ParticleSystemRender) {
    _inherits(ParticleSystemRendererGPU, _ParticleSystemRender);

    function ParticleSystemRendererGPU(info) {
      var _this;

      _classCallCheck(this, ParticleSystemRendererGPU);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ParticleSystemRendererGPU).call(this, info));
      _this._defines = void 0;
      _this._frameTile_velLenScale = void 0;
      _this._node_scale = void 0;
      _this._vertAttrs = [];
      _this._defaultMat = null;
      _this._particleNum = 0;
      _this._tempParticle = null;
      _this._colorTexture = null;
      _this._forceTexture = null;
      _this._velocityTexture = null;
      _this._rotationTexture = null;
      _this._sizeTexture = null;
      _this._animTexture = null;
      _this._uTimeHandle = 0;
      _this._uRotHandle = 0;
      _this._inited = false;
      _this._frameTile_velLenScale = new _index2.Vec4(1, 1, 0, 0);
      _this._node_scale = new _index2.Vec4();
      _this._defines = {
        CC_USE_WORLD_SPACE: true,
        CC_USE_BILLBOARD: true,
        CC_USE_STRETCHED_BILLBOARD: false,
        CC_USE_HORIZONTAL_BILLBOARD: false,
        CC_USE_VERTICAL_BILLBOARD: false,
        COLOR_OVER_TIME_MODULE_ENABLE: false
      };
      _this._tempParticle = new _particle.Particle(null);
      _this._particleNum = 0;
      return _this;
    }

    _createClass(ParticleSystemRendererGPU, [{
      key: "onInit",
      value: function onInit(ps) {
        _get(_getPrototypeOf(ParticleSystemRendererGPU.prototype), "onInit", this).call(this, ps);

        this._setVertexAttrib();

        this._initModel();

        this.updateMaterialParams();
        this.setVertexAttributes();
        this._inited = true;
      }
    }, {
      key: "updateRenderMode",
      value: function updateRenderMode() {
        this._setVertexAttrib();

        this.updateMaterialParams();
        this.setVertexAttributes();
      }
    }, {
      key: "setVertexAttributes",
      value: function setVertexAttributes() {
        _get(_getPrototypeOf(ParticleSystemRendererGPU.prototype), "setVertexAttributes", this).call(this);

        this._model.constructAttributeIndex();
      }
    }, {
      key: "clear",
      value: function clear() {
        this._particleNum = 0;
        this.updateRenderData();
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        _get(_getPrototypeOf(ParticleSystemRendererGPU.prototype), "onDestroy", this).call(this);

        if (this._forceTexture) this._forceTexture.destroy();
        if (this._velocityTexture) this._velocityTexture.destroy();
        if (this._colorTexture) this._colorTexture.destroy();
        if (this._sizeTexture) this._sizeTexture.destroy();
        if (this._rotationTexture) this._rotationTexture.destroy();
        if (this._animTexture) this._animTexture.destroy();
      }
    }, {
      key: "enableModule",
      value: function enableModule(name, val, pm) {
        var mat = this._particleSystem.getMaterialInstance(0) || this._defaultMat;

        if (!mat) {
          return;
        }

        this.initShaderUniform(mat);
        mat.recompileShaders(this._defines);

        if (this._model) {
          this._model.setSubModelMaterial(0, mat);
        }
      }
    }, {
      key: "getFreeParticle",
      value: function getFreeParticle() {
        if (this._particleNum >= this._particleSystem._capacity) {
          return null;
        }

        return this._tempParticle;
      }
    }, {
      key: "setNewParticle",
      value: function setNewParticle(p) {
        this._model.addGPUParticleVertexData(p, this._particleNum, this._particleSystem._time);

        this._particleNum++;
      }
    }, {
      key: "updateParticles",
      value: function updateParticles(dt) {
        if (_defaultConstants.EDITOR) {
          var mat = this._particleSystem.getMaterialInstance(0) || this._defaultMat;

          this._particleSystem.node.getWorldMatrix(_tempWorldTrans);

          switch (this._particleSystem.scaleSpace) {
            case _enum.Space.Local:
              this._particleSystem.node.getScale(this._node_scale);

              break;

            case _enum.Space.World:
              this._particleSystem.node.getWorldScale(this._node_scale);

              break;
          }

          this.initShaderUniform(mat);
        }

        this._particleNum = this._model.updateGPUParticles(this._particleNum, this._particleSystem._time, dt);
        this.updateShaderUniform(dt);
        return this._particleNum;
      } // internal function

    }, {
      key: "updateRenderData",
      value: function updateRenderData() {
        // update vertex buffer
        this._model.updateIA(this._particleNum);
      }
    }, {
      key: "updateShaderUniform",
      value: function updateShaderUniform(dt) {
        var mat = this._particleSystem.getMaterialInstance(0) || this._defaultMat;

        if (!mat) {
          return;
        }

        var pass = mat.passes[0];
        _tempVec4.x = this._particleSystem._time;
        _tempVec4.y = dt;
        pass.setUniform(this._uTimeHandle, _tempVec4);

        this._particleSystem.node.getWorldRotation(_world_rot);

        pass.setUniform(this._uRotHandle, _world_rot);
      }
    }, {
      key: "initShaderUniform",
      value: function initShaderUniform(mat) {
        var pass = mat.passes[0];
        this._uTimeHandle = pass.getHandle('u_timeDelta');
        this._uRotHandle = pass.getHandle('u_worldRot');
        pass.setUniform(pass.getHandle('scale'), this._node_scale);
        pass.setUniform(pass.getHandle('frameTile_velLenScale'), this._frameTile_velLenScale);
        _tempVec4.x = _sample_num;
        _tempVec4.y = _sample_interval;
        pass.setUniform(pass.getHandle('u_sampleInfo'), _tempVec4);
        var enable = false; // force

        var forceModule = this._particleSystem._forceOvertimeModule;
        enable = forceModule && forceModule.enable;
        this._defines[FORCE_OVER_TIME_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._forceTexture) this._forceTexture.destroy();
          this._forceTexture = (0, _curveRange.packCurveRangeXYZ)(_sample_num, forceModule.x, forceModule.y, forceModule.z);
          var handle = pass.getHandle('force_over_time_tex0');

          var binding = _pass.Pass.getBindingFromHandle(handle);

          pass.bindSampler(binding, this._forceTexture.getGFXSampler());
          pass.bindTexture(binding, this._forceTexture.getGFXTexture());
          var spaceHandle = pass.getHandle('u_force_space');
          pass.setUniform(spaceHandle, forceModule.space);
          var modeHandle = pass.getHandle('u_force_mode');
          pass.setUniform(modeHandle, this._forceTexture.height);
        } // velocity


        var velocityModule = this._particleSystem._velocityOvertimeModule;
        enable = velocityModule && velocityModule.enable;
        this._defines[VELOCITY_OVER_TIME_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._velocityTexture) this._velocityTexture.destroy();
          this._velocityTexture = (0, _curveRange.packCurveRangeXYZW)(_sample_num, velocityModule.x, velocityModule.y, velocityModule.z, velocityModule.speedModifier);

          var _handle = pass.getHandle('velocity_over_time_tex0');

          var _binding = _pass.Pass.getBindingFromHandle(_handle);

          pass.bindSampler(_binding, this._velocityTexture.getGFXSampler());
          pass.bindTexture(_binding, this._velocityTexture.getGFXTexture());

          var _spaceHandle = pass.getHandle('u_velocity_space');

          pass.setUniform(_spaceHandle, velocityModule.space);

          var _modeHandle = pass.getHandle('u_velocity_mode');

          pass.setUniform(_modeHandle, this._velocityTexture.height);
        } // color module


        var colorModule = this._particleSystem._colorOverLifetimeModule;
        enable = colorModule && colorModule.enable;
        this._defines[COLOR_OVER_TIME_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._colorTexture) this._colorTexture.destroy();
          this._colorTexture = (0, _gradientRange.packGradientRange)(_sample_num, colorModule.color);

          var _handle2 = pass.getHandle('color_over_time_tex0');

          var _binding2 = _pass.Pass.getBindingFromHandle(_handle2);

          pass.bindSampler(_binding2, this._colorTexture.getGFXSampler());
          pass.bindTexture(_binding2, this._colorTexture.getGFXTexture());

          var _modeHandle2 = pass.getHandle('u_color_mode');

          pass.setUniform(_modeHandle2, this._colorTexture.height);
        } // rotation module


        var roationModule = this._particleSystem._rotationOvertimeModule;
        enable = roationModule && roationModule.enable;
        this._defines[ROTATION_OVER_TIME_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._rotationTexture) this._rotationTexture.destroy();

          if (roationModule.separateAxes) {
            this._rotationTexture = (0, _curveRange.packCurveRangeXYZ)(_sample_num, roationModule.x, roationModule.y, roationModule.z);
          } else {
            this._rotationTexture = (0, _curveRange.packCurveRangeZ)(_sample_num, roationModule.z);
          }

          var _handle3 = pass.getHandle('rotation_over_time_tex0');

          var _binding3 = _pass.Pass.getBindingFromHandle(_handle3);

          pass.bindSampler(_binding3, this._rotationTexture.getGFXSampler());
          pass.bindTexture(_binding3, this._rotationTexture.getGFXTexture());

          var _modeHandle3 = pass.getHandle('u_rotation_mode');

          pass.setUniform(_modeHandle3, this._rotationTexture.height);
        } // size module


        var sizeModule = this._particleSystem._sizeOvertimeModule;
        enable = sizeModule && sizeModule.enable;
        this._defines[SIZE_OVER_TIME_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._sizeTexture) this._sizeTexture.destroy();

          if (sizeModule.separateAxes) {
            this._sizeTexture = (0, _curveRange.packCurveRangeXYZ)(_sample_num, sizeModule.x, sizeModule.y, sizeModule.z, true);
          } else {
            this._sizeTexture = (0, _curveRange.packCurveRangeN)(_sample_num, sizeModule.size, true);
          }

          var _handle4 = pass.getHandle('size_over_time_tex0');

          var _binding4 = _pass.Pass.getBindingFromHandle(_handle4);

          pass.bindSampler(_binding4, this._sizeTexture.getGFXSampler());
          pass.bindTexture(_binding4, this._sizeTexture.getGFXTexture());

          var _modeHandle4 = pass.getHandle('u_size_mode');

          pass.setUniform(_modeHandle4, this._sizeTexture.height);
        } // texture module


        var textureModule = this._particleSystem._textureAnimationModule;
        enable = textureModule && textureModule.enable;
        this._defines[TEXTURE_ANIMATION_MODULE_ENABLE] = enable;

        if (enable) {
          if (this._animTexture) this._animTexture.destroy();
          this._animTexture = (0, _curveRange.packCurveRangeXY)(_sample_num, textureModule.startFrame, textureModule.frameOverTime);

          var _handle5 = pass.getHandle('texture_animation_tex0');

          var _binding5 = _pass.Pass.getBindingFromHandle(_handle5);

          pass.bindSampler(_binding5, this._animTexture.getGFXSampler());
          pass.bindTexture(_binding5, this._animTexture.getGFXTexture());
          var infoHandle = pass.getHandle('u_anim_info');
          _tempVec4.x = this._animTexture.height;
          _tempVec4.y = textureModule.numTilesX * textureModule.numTilesY;
          _tempVec4.z = textureModule.cycleCount;
          pass.setUniform(infoHandle, _tempVec4);
        }
      }
    }, {
      key: "getParticleCount",
      value: function getParticleCount() {
        return this._particleNum;
      }
    }, {
      key: "onMaterialModified",
      value: function onMaterialModified(index, material) {
        if (!this._inited) {
          return;
        }

        this.updateMaterialParams();
      }
    }, {
      key: "onRebuildPSO",
      value: function onRebuildPSO(index, material) {
        if (this._model && index === 0) {
          this._model.setSubModelMaterial(0, material);
        }
      }
    }, {
      key: "_setVertexAttrib",
      value: function _setVertexAttrib() {
        switch (this._renderInfo.renderMode) {
          case _enum.RenderMode.StrecthedBillboard:
            this._vertAttrs = _gpu_vert_attr.slice();
            break;

          case _enum.RenderMode.Mesh:
            this._vertAttrs = _gpu_vert_attr_mesh.slice();
            break;

          default:
            this._vertAttrs = _gpu_vert_attr.slice();
        }
      }
    }, {
      key: "updateMaterialParams",
      value: function updateMaterialParams() {
        if (!this._particleSystem) {
          return;
        }

        var ps = this._particleSystem;
        var shareMaterial = ps.sharedMaterial;

        if (shareMaterial !== null) {
          var effectName = shareMaterial._effectAsset._name;
          this._renderInfo.mainTexture = shareMaterial.getProperty('mainTexture', 0);

          if (effectName.indexOf('particle-gpu') === -1) {
            this._renderInfo.mainTexture = shareMaterial.getProperty('mainTexture', 0); // reset material

            this._particleSystem.setMaterial(null, 0);
          }
        }

        if (ps.sharedMaterial == null && this._defaultMat == null) {
          _matInsInfo.parent = _index.builtinResMgr.get('default-particle-gpu-material');
          _matInsInfo.owner = ps;
          _matInsInfo.subModelIdx = 0;
          this._defaultMat = new _materialInstance.MaterialInstance(_matInsInfo);

          if (this._renderInfo.mainTexture !== null) {
            this._defaultMat.setProperty('mainTexture', this._renderInfo.mainTexture);
          }
        }

        var mat = ps.getMaterialInstance(0) || this._defaultMat;

        ps.node.getWorldMatrix(_tempWorldTrans);

        switch (ps.scaleSpace) {
          case _enum.Space.Local:
            ps.node.getScale(this._node_scale);
            break;

          case _enum.Space.World:
            ps.node.getWorldScale(this._node_scale);
            break;
        }

        if (ps._simulationSpace === _enum.Space.World) {
          this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
          this._defines[CC_USE_WORLD_SPACE] = false;
        }

        var renderMode = this._renderInfo.renderMode;

        if (renderMode === _enum.RenderMode.Billboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_BILLBOARD;
        } else if (renderMode === _enum.RenderMode.StrecthedBillboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_STRETCHED_BILLBOARD;
          this._frameTile_velLenScale.z = this._renderInfo.velocityScale;
          this._frameTile_velLenScale.w = this._renderInfo.lengthScale;
        } else if (renderMode === _enum.RenderMode.HorizontalBillboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_HORIZONTAL_BILLBOARD;
        } else if (renderMode === _enum.RenderMode.VerticalBillboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_VERTICAL_BILLBOARD;
        } else if (renderMode === _enum.RenderMode.Mesh) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_MESH;
        } else {
          console.warn("particle system renderMode ".concat(renderMode, " not support."));
        }

        var textureModule = ps._textureAnimationModule;

        if (textureModule && textureModule.enable) {
          _index2.Vec2.set(this._frameTile_velLenScale, textureModule.numTilesX, textureModule.numTilesY);
        }

        this.initShaderUniform(mat);
        mat.recompileShaders(this._defines);

        if (this._model) {
          this._model.updateMaterial(mat);
        }
      }
    }]);

    return ParticleSystemRendererGPU;
  }(_particleSystemRendererBase.ParticleSystemRendererBase);

  _exports.default = ParticleSystemRendererGPU;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1ncHUudHMiXSwibmFtZXMiOlsiX3RlbXBXb3JsZFRyYW5zIiwiTWF0NCIsIl90ZW1wVmVjNCIsIlZlYzQiLCJfd29ybGRfcm90IiwiUXVhdCIsIl9zYW1wbGVfbnVtIiwiX3NhbXBsZV9pbnRlcnZhbCIsIkNDX1VTRV9XT1JMRF9TUEFDRSIsIkNDX1JFTkRFUl9NT0RFIiwiUkVOREVSX01PREVfQklMTEJPQVJEIiwiUkVOREVSX01PREVfU1RSRVRDSEVEX0JJTExCT0FSRCIsIlJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEIiwiUkVOREVSX01PREVfVkVSVElDQUxfQklMTEJPQVJEIiwiUkVOREVSX01PREVfTUVTSCIsIkNPTE9SX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFIiwiUk9UQVRJT05fT1ZFUl9USU1FX01PRFVMRV9FTkFCTEUiLCJTSVpFX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFIiwiVkVMT0NJVFlfT1ZFUl9USU1FX01PRFVMRV9FTkFCTEUiLCJGT1JDRV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSIsIlRFWFRVUkVfQU5JTUFUSU9OX01PRFVMRV9FTkFCTEUiLCJfdmVydF9hdHRyX25hbWUiLCJQT1NJVElPTl9TVEFSVFRJTUUiLCJWRVJUX1NJWkVfVVYiLCJWRVJUX1JPVEFUSU9OX1VWIiwiQ09MT1IiLCJESVJfTElGRSIsIlJBTkRPTV9TRUVEIiwiX2dwdV92ZXJ0X2F0dHIiLCJHRlhBdHRyaWJ1dGUiLCJHRlhGb3JtYXQiLCJSR0JBMzJGIiwiUjMyRiIsIl9ncHVfdmVydF9hdHRyX21lc2giLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9URVhfQ09PUkQiLCJSR0IzMkYiLCJBVFRSX1RFWF9DT09SRDMiLCJBVFRSX05PUk1BTCIsIkFUVFJfQ09MT1IxIiwiUkdCQTgiLCJfbWF0SW5zSW5mbyIsInBhcmVudCIsIm93bmVyIiwic3ViTW9kZWxJZHgiLCJQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyR1BVIiwiaW5mbyIsIl9kZWZpbmVzIiwiX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZSIsIl9ub2RlX3NjYWxlIiwiX3ZlcnRBdHRycyIsIl9kZWZhdWx0TWF0IiwiX3BhcnRpY2xlTnVtIiwiX3RlbXBQYXJ0aWNsZSIsIl9jb2xvclRleHR1cmUiLCJfZm9yY2VUZXh0dXJlIiwiX3ZlbG9jaXR5VGV4dHVyZSIsIl9yb3RhdGlvblRleHR1cmUiLCJfc2l6ZVRleHR1cmUiLCJfYW5pbVRleHR1cmUiLCJfdVRpbWVIYW5kbGUiLCJfdVJvdEhhbmRsZSIsIl9pbml0ZWQiLCJDQ19VU0VfQklMTEJPQVJEIiwiQ0NfVVNFX1NUUkVUQ0hFRF9CSUxMQk9BUkQiLCJDQ19VU0VfSE9SSVpPTlRBTF9CSUxMQk9BUkQiLCJDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJEIiwiUGFydGljbGUiLCJwcyIsIl9zZXRWZXJ0ZXhBdHRyaWIiLCJfaW5pdE1vZGVsIiwidXBkYXRlTWF0ZXJpYWxQYXJhbXMiLCJzZXRWZXJ0ZXhBdHRyaWJ1dGVzIiwiX21vZGVsIiwiY29uc3RydWN0QXR0cmlidXRlSW5kZXgiLCJ1cGRhdGVSZW5kZXJEYXRhIiwiZGVzdHJveSIsIm5hbWUiLCJ2YWwiLCJwbSIsIm1hdCIsIl9wYXJ0aWNsZVN5c3RlbSIsImdldE1hdGVyaWFsSW5zdGFuY2UiLCJpbml0U2hhZGVyVW5pZm9ybSIsInJlY29tcGlsZVNoYWRlcnMiLCJzZXRTdWJNb2RlbE1hdGVyaWFsIiwiX2NhcGFjaXR5IiwicCIsImFkZEdQVVBhcnRpY2xlVmVydGV4RGF0YSIsIl90aW1lIiwiZHQiLCJFRElUT1IiLCJub2RlIiwiZ2V0V29ybGRNYXRyaXgiLCJzY2FsZVNwYWNlIiwiU3BhY2UiLCJMb2NhbCIsImdldFNjYWxlIiwiV29ybGQiLCJnZXRXb3JsZFNjYWxlIiwidXBkYXRlR1BVUGFydGljbGVzIiwidXBkYXRlU2hhZGVyVW5pZm9ybSIsInVwZGF0ZUlBIiwicGFzcyIsInBhc3NlcyIsIngiLCJ5Iiwic2V0VW5pZm9ybSIsImdldFdvcmxkUm90YXRpb24iLCJnZXRIYW5kbGUiLCJlbmFibGUiLCJmb3JjZU1vZHVsZSIsIl9mb3JjZU92ZXJ0aW1lTW9kdWxlIiwieiIsImhhbmRsZSIsImJpbmRpbmciLCJQYXNzIiwiZ2V0QmluZGluZ0Zyb21IYW5kbGUiLCJiaW5kU2FtcGxlciIsImdldEdGWFNhbXBsZXIiLCJiaW5kVGV4dHVyZSIsImdldEdGWFRleHR1cmUiLCJzcGFjZUhhbmRsZSIsInNwYWNlIiwibW9kZUhhbmRsZSIsImhlaWdodCIsInZlbG9jaXR5TW9kdWxlIiwiX3ZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUiLCJzcGVlZE1vZGlmaWVyIiwiY29sb3JNb2R1bGUiLCJfY29sb3JPdmVyTGlmZXRpbWVNb2R1bGUiLCJjb2xvciIsInJvYXRpb25Nb2R1bGUiLCJfcm90YXRpb25PdmVydGltZU1vZHVsZSIsInNlcGFyYXRlQXhlcyIsInNpemVNb2R1bGUiLCJfc2l6ZU92ZXJ0aW1lTW9kdWxlIiwic2l6ZSIsInRleHR1cmVNb2R1bGUiLCJfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZSIsInN0YXJ0RnJhbWUiLCJmcmFtZU92ZXJUaW1lIiwiaW5mb0hhbmRsZSIsIm51bVRpbGVzWCIsIm51bVRpbGVzWSIsImN5Y2xlQ291bnQiLCJpbmRleCIsIm1hdGVyaWFsIiwiX3JlbmRlckluZm8iLCJyZW5kZXJNb2RlIiwiUmVuZGVyTW9kZSIsIlN0cmVjdGhlZEJpbGxib2FyZCIsInNsaWNlIiwiTWVzaCIsInNoYXJlTWF0ZXJpYWwiLCJzaGFyZWRNYXRlcmlhbCIsImVmZmVjdE5hbWUiLCJfZWZmZWN0QXNzZXQiLCJfbmFtZSIsIm1haW5UZXh0dXJlIiwiZ2V0UHJvcGVydHkiLCJpbmRleE9mIiwic2V0TWF0ZXJpYWwiLCJidWlsdGluUmVzTWdyIiwiZ2V0IiwiTWF0ZXJpYWxJbnN0YW5jZSIsInNldFByb3BlcnR5IiwiX3NpbXVsYXRpb25TcGFjZSIsIkJpbGxib2FyZCIsInZlbG9jaXR5U2NhbGUiLCJ3IiwibGVuZ3RoU2NhbGUiLCJIb3Jpem9udGFsQmlsbGJvYXJkIiwiVmVydGljYWxCaWxsYm9hcmQiLCJjb25zb2xlIiwid2FybiIsIlZlYzIiLCJzZXQiLCJ1cGRhdGVNYXRlcmlhbCIsIlBhcnRpY2xlU3lzdGVtUmVuZGVyZXJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEsTUFBTUEsZUFBZSxHQUFHLElBQUlDLFlBQUosRUFBeEI7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLElBQUlDLFlBQUosRUFBbEI7O0FBQ0EsTUFBTUMsVUFBVSxHQUFHLElBQUlDLFlBQUosRUFBbkI7O0FBRUEsTUFBTUMsV0FBVyxHQUFHLEVBQXBCOztBQUNBLE1BQU1DLGdCQUFnQixHQUFHLE1BQU1ELFdBQS9COztBQUVBLE1BQU1FLGtCQUFrQixHQUFHLG9CQUEzQjtBQUVBLE1BQU1DLGNBQWMsR0FBRyxnQkFBdkI7QUFDQSxNQUFNQyxxQkFBcUIsR0FBRyxDQUE5QjtBQUNBLE1BQU1DLCtCQUErQixHQUFHLENBQXhDO0FBQ0EsTUFBTUMsZ0NBQWdDLEdBQUcsQ0FBekM7QUFDQSxNQUFNQyw4QkFBOEIsR0FBRyxDQUF2QztBQUNBLE1BQU1DLGdCQUFnQixHQUFHLENBQXpCO0FBRUEsTUFBTUMsNkJBQTZCLEdBQUcsK0JBQXRDO0FBQ0EsTUFBTUMsZ0NBQWdDLEdBQUcsa0NBQXpDO0FBQ0EsTUFBTUMsNEJBQTRCLEdBQUcsOEJBQXJDO0FBQ0EsTUFBTUMsZ0NBQWdDLEdBQUcsa0NBQXpDO0FBQ0EsTUFBTUMsNkJBQTZCLEdBQUcsK0JBQXRDO0FBQ0EsTUFBTUMsK0JBQStCLEdBQUcsaUNBQXhDO0FBRUEsTUFBTUMsZUFBZSxHQUFHO0FBQ3BCQyxJQUFBQSxrQkFBa0IsRUFBRSxzQkFEQTtBQUVwQkMsSUFBQUEsWUFBWSxFQUFFLFdBRk07QUFHcEJDLElBQUFBLGdCQUFnQixFQUFFLGVBSEU7QUFJcEJDLElB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SSxLQUFLMEIsTUFBVCxFQUFpQjtBQUNiLGVBQUtBLE1BQUwsQ0FBWXlHLGNBQVosQ0FBMkJsRyxHQUEzQjtBQUNIO0FBQ0o7Ozs7SUFyV2tEbUcsc0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vLi4vY29yZS8zZC9idWlsdGluJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9jb3JlL2Fzc2V0cyc7XHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9jb3JlL2NvbXBvbmVudHMnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGVOYW1lLCBHRlhGb3JtYXQgfSBmcm9tICcuLi8uLi9jb3JlL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGUgfSBmcm9tICcuLi8uLi9jb3JlL2dmeC9pbnB1dC1hc3NlbWJsZXInO1xyXG5pbXBvcnQgeyBNYXQ0LCBWZWMyLCBWZWM0LCBRdWF0fSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbEluc3RhbmNlLCBJTWF0ZXJpYWxJbnN0YW5jZUluZm8gfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBNYWNyb1JlY29yZCB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvY29yZS9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgUmVuZGVyTW9kZSwgU3BhY2UgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgUGFydGljbGUsIElQYXJ0aWNsZU1vZHVsZSB9IGZyb20gJy4uL3BhcnRpY2xlJztcclxuaW1wb3J0IHsgcGFja0dyYWRpZW50UmFuZ2UgfSBmcm9tICcuLi9hbmltYXRvci9ncmFkaWVudC1yYW5nZSc7XHJcbmltcG9ydCB7IFBhc3MgfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL2NvcmUvcGFzcyc7XHJcbmltcG9ydCB7IHBhY2tDdXJ2ZVJhbmdlWFlaLCBwYWNrQ3VydmVSYW5nZVosIHBhY2tDdXJ2ZVJhbmdlWFlaVywgcGFja0N1cnZlUmFuZ2VOLCBwYWNrQ3VydmVSYW5nZVhZIH0gZnJvbSAnLi4vYW5pbWF0b3IvY3VydmUtcmFuZ2UnO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQmFzZSB9IGZyb20gJy4vcGFydGljbGUtc3lzdGVtLXJlbmRlcmVyLWJhc2UnO1xyXG5pbXBvcnQgeyBFRElUT1IgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5cclxuY29uc3QgX3RlbXBXb3JsZFRyYW5zID0gbmV3IE1hdDQoKTtcclxuY29uc3QgX3RlbXBWZWM0ID0gbmV3IFZlYzQoKTtcclxuY29uc3QgX3dvcmxkX3JvdCA9IG5ldyBRdWF0KCk7XHJcblxyXG5jb25zdCBfc2FtcGxlX251bSA9IDMyO1xyXG5jb25zdCBfc2FtcGxlX2ludGVydmFsID0gMS4wIC8gX3NhbXBsZV9udW07XHJcblxyXG5jb25zdCBDQ19VU0VfV09STERfU1BBQ0UgPSAnQ0NfVVNFX1dPUkxEX1NQQUNFJztcclxuXHJcbmNvbnN0IENDX1JFTkRFUl9NT0RFID0gJ0NDX1JFTkRFUl9NT0RFJztcclxuY29uc3QgUkVOREVSX01PREVfQklMTEJPQVJEID0gMDtcclxuY29uc3QgUkVOREVSX01PREVfU1RSRVRDSEVEX0JJTExCT0FSRCA9IDE7XHJcbmNvbnN0IFJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEID0gMjtcclxuY29uc3QgUkVOREVSX01PREVfVkVSVElDQUxfQklMTEJPQVJEID0gMztcclxuY29uc3QgUkVOREVSX01PREVfTUVTSCA9IDQ7XHJcblxyXG5jb25zdCBDT0xPUl9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSA9ICdDT0xPUl9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSc7XHJcbmNvbnN0IFJPVEFUSU9OX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFID0gJ1JPVEFUSU9OX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFJztcclxuY29uc3QgU0laRV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSA9ICdTSVpFX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFJztcclxuY29uc3QgVkVMT0NJVFlfT1ZFUl9USU1FX01PRFVMRV9FTkFCTEUgPSAnVkVMT0NJVFlfT1ZFUl9USU1FX01PRFVMRV9FTkFCTEUnO1xyXG5jb25zdCBGT1JDRV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSA9ICdGT1JDRV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRSc7XHJcbmNvbnN0IFRFWFRVUkVfQU5JTUFUSU9OX01PRFVMRV9FTkFCTEUgPSAnVEVYVFVSRV9BTklNQVRJT05fTU9EVUxFX0VOQUJMRSc7XHJcblxyXG5jb25zdCBfdmVydF9hdHRyX25hbWUgPSB7XHJcbiAgICBQT1NJVElPTl9TVEFSVFRJTUU6ICdhX3Bvc2l0aW9uX3N0YXJ0dGltZScsXHJcbiAgICBWRVJUX1NJWkVfVVY6ICdhX3NpemVfdXYnLFxyXG4gICAgVkVSVF9ST1RBVElPTl9VVjogJ2Ffcm90YXRpb25fdXYnLFxyXG4gICAgQ09MT1I6ICdhX2NvbG9yJyxcclxuICAgIERJUl9MSUZFOiAnYV9kaXJfbGlmZScsXHJcbiAgICBSQU5ET01fU0VFRDogJ2Ffcm5kU2VlZCdcclxuICB9O1xyXG5cclxuY29uc3QgX2dwdV92ZXJ0X2F0dHIgPSBbXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKF92ZXJ0X2F0dHJfbmFtZS5QT1NJVElPTl9TVEFSVFRJTUUsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoX3ZlcnRfYXR0cl9uYW1lLlZFUlRfU0laRV9VViwgR0ZYRm9ybWF0LlJHQkEzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShfdmVydF9hdHRyX25hbWUuVkVSVF9ST1RBVElPTl9VViwgR0ZYRm9ybWF0LlJHQkEzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShfdmVydF9hdHRyX25hbWUuQ09MT1IsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoX3ZlcnRfYXR0cl9uYW1lLkRJUl9MSUZFLCBHRlhGb3JtYXQuUkdCQTMyRiksXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKF92ZXJ0X2F0dHJfbmFtZS5SQU5ET01fU0VFRCwgR0ZYRm9ybWF0LlIzMkYpXHJcbl07XHJcblxyXG5jb25zdCBfZ3B1X3ZlcnRfYXR0cl9tZXNoID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShfdmVydF9hdHRyX25hbWUuUE9TSVRJT05fU1RBUlRUSU1FLCBHRlhGb3JtYXQuUkdCQTMyRiksXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKF92ZXJ0X2F0dHJfbmFtZS5WRVJUX1NJWkVfVVYsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoX3ZlcnRfYXR0cl9uYW1lLlZFUlRfUk9UQVRJT05fVVYsIEdGWEZvcm1hdC5SR0JBMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoX3ZlcnRfYXR0cl9uYW1lLkNPTE9SLCBHRlhGb3JtYXQuUkdCQTMyRiksXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKF92ZXJ0X2F0dHJfbmFtZS5ESVJfTElGRSwgR0ZYRm9ybWF0LlJHQkEzMkYpLFxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShfdmVydF9hdHRyX25hbWUuUkFORE9NX1NFRUQsIEdGWEZvcm1hdC5SMzJGKSxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRCwgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAgLy8gdXYsZnJhbWUgaWR4XHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9URVhfQ09PUkQzLCBHRlhGb3JtYXQuUkdCMzJGKSwgICAgIC8vIG1lc2ggcG9zaXRpb25cclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX05PUk1BTCwgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAgICAgLy8gbWVzaCBub3JtYWxcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX0NPTE9SMSwgR0ZYRm9ybWF0LlJHQkE4LCB0cnVlKSwgICAgLy8gbWVzaCBjb2xvclxyXG5dO1xyXG5cclxuY29uc3QgX21hdEluc0luZm86IElNYXRlcmlhbEluc3RhbmNlSW5mbyA9IHtcclxuICAgIHBhcmVudDogbnVsbCEsXHJcbiAgICBvd25lcjogbnVsbCEsXHJcbiAgICBzdWJNb2RlbElkeDogMCxcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnRpY2xlU3lzdGVtUmVuZGVyZXJHUFUgZXh0ZW5kcyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQmFzZSB7XHJcbiAgICBwcml2YXRlIF9kZWZpbmVzOiBNYWNyb1JlY29yZDtcclxuICAgIHByaXZhdGUgX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZTogVmVjNDtcclxuICAgIHByaXZhdGUgX25vZGVfc2NhbGU6IFZlYzQ7XHJcbiAgICBwcm90ZWN0ZWQgX3ZlcnRBdHRyczogR0ZYQXR0cmlidXRlW10gPSBbXTtcclxuICAgIHByb3RlY3RlZCBfZGVmYXVsdE1hdDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3BhcnRpY2xlTnVtOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdGVtcFBhcnRpY2xlOiBhbnkgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY29sb3JUZXh0dXJlOiBUZXh0dXJlMkQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2ZvcmNlVGV4dHVyZTogVGV4dHVyZTJEIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF92ZWxvY2l0eVRleHR1cmU6IFRleHR1cmUyRCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcm90YXRpb25UZXh0dXJlOiBUZXh0dXJlMkQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3NpemVUZXh0dXJlOiBUZXh0dXJlMkQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2FuaW1UZXh0dXJlOiBUZXh0dXJlMkQgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3VUaW1lSGFuZGxlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfdVJvdEhhbmRsZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2luaXRlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChpbmZvOiBhbnkpIHtcclxuICAgICAgICBzdXBlcihpbmZvKTtcclxuXHJcbiAgICAgICAgdGhpcy5fZnJhbWVUaWxlX3ZlbExlblNjYWxlID0gbmV3IFZlYzQoMSwgMSwgMCwgMCk7XHJcbiAgICAgICAgdGhpcy5fbm9kZV9zY2FsZSA9IG5ldyBWZWM0KCk7XHJcbiAgICAgICAgdGhpcy5fZGVmaW5lcyA9IHtcclxuICAgICAgICAgICAgQ0NfVVNFX1dPUkxEX1NQQUNFOiB0cnVlLFxyXG4gICAgICAgICAgICBDQ19VU0VfQklMTEJPQVJEOiB0cnVlLFxyXG4gICAgICAgICAgICBDQ19VU0VfU1RSRVRDSEVEX0JJTExCT0FSRDogZmFsc2UsXHJcbiAgICAgICAgICAgIENDX1VTRV9IT1JJWk9OVEFMX0JJTExCT0FSRDogZmFsc2UsXHJcbiAgICAgICAgICAgIENDX1VTRV9WRVJUSUNBTF9CSUxMQk9BUkQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBDT0xPUl9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRTogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5fdGVtcFBhcnRpY2xlID0gbmV3IFBhcnRpY2xlKG51bGwpO1xyXG4gICAgICAgIHRoaXMuX3BhcnRpY2xlTnVtID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Jbml0IChwczogQ29tcG9uZW50KSB7XHJcbiAgICAgICAgc3VwZXIub25Jbml0KHBzKTtcclxuICAgICAgICB0aGlzLl9zZXRWZXJ0ZXhBdHRyaWIoKTtcclxuICAgICAgICB0aGlzLl9pbml0TW9kZWwoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XHJcbiAgICAgICAgdGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdGVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVuZGVyTW9kZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0VmVydGV4QXR0cmliKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xyXG4gICAgICAgIHRoaXMuc2V0VmVydGV4QXR0cmlidXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRWZXJ0ZXhBdHRyaWJ1dGVzICgpIHtcclxuICAgICAgICBzdXBlci5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKCk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwhLmNvbnN0cnVjdEF0dHJpYnV0ZUluZGV4KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZU51bSA9IDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSZW5kZXJEYXRhKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgc3VwZXIub25EZXN0cm95KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2ZvcmNlVGV4dHVyZSkgdGhpcy5fZm9yY2VUZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgICAgICBpZiAodGhpcy5fdmVsb2NpdHlUZXh0dXJlKSB0aGlzLl92ZWxvY2l0eVRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2xvclRleHR1cmUpIHRoaXMuX2NvbG9yVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3NpemVUZXh0dXJlKSB0aGlzLl9zaXplVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JvdGF0aW9uVGV4dHVyZSkgdGhpcy5fcm90YXRpb25UZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgICAgICBpZiAodGhpcy5fYW5pbVRleHR1cmUpIHRoaXMuX2FuaW1UZXh0dXJlLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5hYmxlTW9kdWxlIChuYW1lOiBzdHJpbmcsIHZhbDogQm9vbGVhbiwgcG06IElQYXJ0aWNsZU1vZHVsZSkge1xyXG4gICAgICAgIGNvbnN0IG1hdDogTWF0ZXJpYWwgfCBudWxsID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uZ2V0TWF0ZXJpYWxJbnN0YW5jZSgwKSB8fCB0aGlzLl9kZWZhdWx0TWF0O1xyXG4gICAgICAgIGlmICghbWF0KSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5pbml0U2hhZGVyVW5pZm9ybShtYXQpO1xyXG4gICAgICAgIG1hdC5yZWNvbXBpbGVTaGFkZXJzKHRoaXMuX2RlZmluZXMpO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zZXRTdWJNb2RlbE1hdGVyaWFsKDAsIG1hdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRGcmVlUGFydGljbGUgKCk6IFBhcnRpY2xlIHwgbnVsbCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlTnVtID49IHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9jYXBhY2l0eSkge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wUGFydGljbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE5ld1BhcnRpY2xlIChwOiBQYXJ0aWNsZSkge1xyXG4gICAgICAgIHRoaXMuX21vZGVsIS5hZGRHUFVQYXJ0aWNsZVZlcnRleERhdGEocCwgdGhpcy5fcGFydGljbGVOdW0sIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl90aW1lKTtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZU51bSsrO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVQYXJ0aWNsZXMgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdDogTWF0ZXJpYWwgfCBudWxsID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uZ2V0TWF0ZXJpYWxJbnN0YW5jZSgwKSB8fCB0aGlzLl9kZWZhdWx0TWF0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ubm9kZS5nZXRXb3JsZE1hdHJpeChfdGVtcFdvcmxkVHJhbnMpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuX3BhcnRpY2xlU3lzdGVtLnNjYWxlU3BhY2UpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgU3BhY2UuTG9jYWw6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ubm9kZS5nZXRTY2FsZSh0aGlzLl9ub2RlX3NjYWxlKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgU3BhY2UuV29ybGQ6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0ubm9kZS5nZXRXb3JsZFNjYWxlKHRoaXMuX25vZGVfc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRTaGFkZXJVbmlmb3JtKG1hdCEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZU51bSA9IHRoaXMuX21vZGVsIS51cGRhdGVHUFVQYXJ0aWNsZXModGhpcy5fcGFydGljbGVOdW0sIHRoaXMuX3BhcnRpY2xlU3lzdGVtLl90aW1lLCBkdCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFkZXJVbmlmb3JtKGR0KTtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFydGljbGVOdW07XHJcbiAgICB9XHJcblxyXG4gICAgLy8gaW50ZXJuYWwgZnVuY3Rpb25cclxuICAgIHB1YmxpYyB1cGRhdGVSZW5kZXJEYXRhICgpIHtcclxuICAgICAgICAvLyB1cGRhdGUgdmVydGV4IGJ1ZmZlclxyXG4gICAgICAgIHRoaXMuX21vZGVsIS51cGRhdGVJQSh0aGlzLl9wYXJ0aWNsZU51bSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVNoYWRlclVuaWZvcm0gKGR0OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBtYXQ6IE1hdGVyaWFsIHwgbnVsbCA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLmdldE1hdGVyaWFsSW5zdGFuY2UoMCkgfHwgdGhpcy5fZGVmYXVsdE1hdDtcclxuICAgICAgICBpZiAoIW1hdCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBwYXNzID0gbWF0LnBhc3Nlc1swXTtcclxuICAgICAgICBfdGVtcFZlYzQueCA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLl90aW1lO1xyXG4gICAgICAgIF90ZW1wVmVjNC55ID0gZHQ7XHJcbiAgICAgICAgcGFzcy5zZXRVbmlmb3JtKHRoaXMuX3VUaW1lSGFuZGxlLCBfdGVtcFZlYzQpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5ub2RlLmdldFdvcmxkUm90YXRpb24oX3dvcmxkX3JvdCk7XHJcbiAgICAgICAgcGFzcy5zZXRVbmlmb3JtKHRoaXMuX3VSb3RIYW5kbGUsIF93b3JsZF9yb3QpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0U2hhZGVyVW5pZm9ybSAobWF0OiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGNvbnN0IHBhc3MgPSBtYXQucGFzc2VzWzBdO1xyXG5cclxuICAgICAgICB0aGlzLl91VGltZUhhbmRsZSA9IHBhc3MuZ2V0SGFuZGxlKCd1X3RpbWVEZWx0YScpO1xyXG4gICAgICAgIHRoaXMuX3VSb3RIYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgndV93b3JsZFJvdCcpO1xyXG5cclxuICAgICAgICBwYXNzLnNldFVuaWZvcm0ocGFzcy5nZXRIYW5kbGUoJ3NjYWxlJyksIHRoaXMuX25vZGVfc2NhbGUpO1xyXG4gICAgICAgIHBhc3Muc2V0VW5pZm9ybShwYXNzLmdldEhhbmRsZSgnZnJhbWVUaWxlX3ZlbExlblNjYWxlJyksIHRoaXMuX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZSk7XHJcbiAgICAgICAgX3RlbXBWZWM0LnggPSBfc2FtcGxlX251bTtcclxuICAgICAgICBfdGVtcFZlYzQueSA9IF9zYW1wbGVfaW50ZXJ2YWw7XHJcbiAgICAgICAgcGFzcy5zZXRVbmlmb3JtKHBhc3MuZ2V0SGFuZGxlKCd1X3NhbXBsZUluZm8nKSwgX3RlbXBWZWM0KTtcclxuXHJcbiAgICAgICAgbGV0IGVuYWJsZSA9IGZhbHNlO1xyXG4gICAgICAgIC8vIGZvcmNlXHJcbiAgICAgICAgY29uc3QgZm9yY2VNb2R1bGUgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fZm9yY2VPdmVydGltZU1vZHVsZTtcclxuICAgICAgICBlbmFibGUgPSBmb3JjZU1vZHVsZSAmJiBmb3JjZU1vZHVsZS5lbmFibGU7XHJcbiAgICAgICAgdGhpcy5fZGVmaW5lc1tGT1JDRV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRV0gPSBlbmFibGU7XHJcbiAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZm9yY2VUZXh0dXJlKSB0aGlzLl9mb3JjZVRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9mb3JjZVRleHR1cmUgPSBwYWNrQ3VydmVSYW5nZVhZWihfc2FtcGxlX251bSwgZm9yY2VNb2R1bGUueCwgZm9yY2VNb2R1bGUueSwgZm9yY2VNb2R1bGUueik7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHBhc3MuZ2V0SGFuZGxlKCdmb3JjZV9vdmVyX3RpbWVfdGV4MCcpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRTYW1wbGVyKGJpbmRpbmcsIHRoaXMuX2ZvcmNlVGV4dHVyZS5nZXRHRlhTYW1wbGVyKCkhKTtcclxuICAgICAgICAgICAgcGFzcy5iaW5kVGV4dHVyZShiaW5kaW5nLCB0aGlzLl9mb3JjZVRleHR1cmUuZ2V0R0ZYVGV4dHVyZSgpISk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNwYWNlSGFuZGxlID0gcGFzcy5nZXRIYW5kbGUoJ3VfZm9yY2Vfc3BhY2UnKTtcclxuICAgICAgICAgICAgcGFzcy5zZXRVbmlmb3JtKHNwYWNlSGFuZGxlLCBmb3JjZU1vZHVsZS5zcGFjZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVIYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgndV9mb3JjZV9tb2RlJyk7XHJcbiAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybShtb2RlSGFuZGxlLCB0aGlzLl9mb3JjZVRleHR1cmUuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHZlbG9jaXR5XHJcbiAgICAgICAgY29uc3QgdmVsb2NpdHlNb2R1bGUgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5fdmVsb2NpdHlPdmVydGltZU1vZHVsZTtcclxuICAgICAgICBlbmFibGUgPSB2ZWxvY2l0eU1vZHVsZSAmJiB2ZWxvY2l0eU1vZHVsZS5lbmFibGU7XHJcbiAgICAgICAgdGhpcy5fZGVmaW5lc1tWRUxPQ0lUWV9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRV0gPSBlbmFibGU7XHJcbiAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fdmVsb2NpdHlUZXh0dXJlKSB0aGlzLl92ZWxvY2l0eVRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl92ZWxvY2l0eVRleHR1cmUgPSBwYWNrQ3VydmVSYW5nZVhZWlcoX3NhbXBsZV9udW0sIHZlbG9jaXR5TW9kdWxlLngsIHZlbG9jaXR5TW9kdWxlLnksIHZlbG9jaXR5TW9kdWxlLnosIHZlbG9jaXR5TW9kdWxlLnNwZWVkTW9kaWZpZXIpO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgndmVsb2NpdHlfb3Zlcl90aW1lX3RleDAnKTtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IFBhc3MuZ2V0QmluZGluZ0Zyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICAgICAgcGFzcy5iaW5kU2FtcGxlcihiaW5kaW5nLCB0aGlzLl92ZWxvY2l0eVRleHR1cmUuZ2V0R0ZYU2FtcGxlcigpISk7XHJcbiAgICAgICAgICAgIHBhc3MuYmluZFRleHR1cmUoYmluZGluZywgdGhpcy5fdmVsb2NpdHlUZXh0dXJlLmdldEdGWFRleHR1cmUoKSEpO1xyXG4gICAgICAgICAgICBjb25zdCBzcGFjZUhhbmRsZSA9IHBhc3MuZ2V0SGFuZGxlKCd1X3ZlbG9jaXR5X3NwYWNlJyk7XHJcbiAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybShzcGFjZUhhbmRsZSwgdmVsb2NpdHlNb2R1bGUuc3BhY2UpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlSGFuZGxlID0gcGFzcy5nZXRIYW5kbGUoJ3VfdmVsb2NpdHlfbW9kZScpO1xyXG4gICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0obW9kZUhhbmRsZSwgdGhpcy5fdmVsb2NpdHlUZXh0dXJlLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBjb2xvciBtb2R1bGVcclxuICAgICAgICBjb25zdCBjb2xvck1vZHVsZSA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9jb2xvck92ZXJMaWZldGltZU1vZHVsZTtcclxuICAgICAgICBlbmFibGUgPSBjb2xvck1vZHVsZSAmJiBjb2xvck1vZHVsZS5lbmFibGU7XHJcbiAgICAgICAgdGhpcy5fZGVmaW5lc1tDT0xPUl9PVkVSX1RJTUVfTU9EVUxFX0VOQUJMRV0gPSBlbmFibGU7XHJcbiAgICAgICAgaWYgKGVuYWJsZSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY29sb3JUZXh0dXJlKSB0aGlzLl9jb2xvclRleHR1cmUuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2xvclRleHR1cmUgPSBwYWNrR3JhZGllbnRSYW5nZShfc2FtcGxlX251bSwgY29sb3JNb2R1bGUuY29sb3IpO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgnY29sb3Jfb3Zlcl90aW1lX3RleDAnKTtcclxuICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IFBhc3MuZ2V0QmluZGluZ0Zyb21IYW5kbGUoaGFuZGxlKTtcclxuICAgICAgICAgICAgcGFzcy5iaW5kU2FtcGxlcihiaW5kaW5nLCB0aGlzLl9jb2xvclRleHR1cmUuZ2V0R0ZYU2FtcGxlcigpISk7XHJcbiAgICAgICAgICAgIHBhc3MuYmluZFRleHR1cmUoYmluZGluZywgdGhpcy5fY29sb3JUZXh0dXJlLmdldEdGWFRleHR1cmUoKSEpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlSGFuZGxlID0gcGFzcy5nZXRIYW5kbGUoJ3VfY29sb3JfbW9kZScpO1xyXG4gICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0obW9kZUhhbmRsZSwgdGhpcy5fY29sb3JUZXh0dXJlLmhlaWdodCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByb3RhdGlvbiBtb2R1bGVcclxuICAgICAgICBjb25zdCByb2F0aW9uTW9kdWxlID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uX3JvdGF0aW9uT3ZlcnRpbWVNb2R1bGU7XHJcbiAgICAgICAgZW5hYmxlID0gcm9hdGlvbk1vZHVsZSAmJiByb2F0aW9uTW9kdWxlLmVuYWJsZTtcclxuICAgICAgICB0aGlzLl9kZWZpbmVzW1JPVEFUSU9OX09WRVJfVElNRV9NT0RVTEVfRU5BQkxFXSA9IGVuYWJsZTtcclxuICAgICAgICBpZiAoZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yb3RhdGlvblRleHR1cmUpIHRoaXMuX3JvdGF0aW9uVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChyb2F0aW9uTW9kdWxlLnNlcGFyYXRlQXhlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm90YXRpb25UZXh0dXJlID0gcGFja0N1cnZlUmFuZ2VYWVooX3NhbXBsZV9udW0sIHJvYXRpb25Nb2R1bGUueCwgcm9hdGlvbk1vZHVsZS55LCByb2F0aW9uTW9kdWxlLnopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcm90YXRpb25UZXh0dXJlID0gcGFja0N1cnZlUmFuZ2VaKF9zYW1wbGVfbnVtLCByb2F0aW9uTW9kdWxlLnopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbmRsZSA9IHBhc3MuZ2V0SGFuZGxlKCdyb3RhdGlvbl9vdmVyX3RpbWVfdGV4MCcpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRTYW1wbGVyKGJpbmRpbmcsIHRoaXMuX3JvdGF0aW9uVGV4dHVyZS5nZXRHRlhTYW1wbGVyKCkhKTtcclxuICAgICAgICAgICAgcGFzcy5iaW5kVGV4dHVyZShiaW5kaW5nLCB0aGlzLl9yb3RhdGlvblRleHR1cmUuZ2V0R0ZYVGV4dHVyZSgpISk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1vZGVIYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgndV9yb3RhdGlvbl9tb2RlJyk7XHJcbiAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybShtb2RlSGFuZGxlLCB0aGlzLl9yb3RhdGlvblRleHR1cmUuaGVpZ2h0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHNpemUgbW9kdWxlXHJcbiAgICAgICAgY29uc3Qgc2l6ZU1vZHVsZSA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtLl9zaXplT3ZlcnRpbWVNb2R1bGU7XHJcbiAgICAgICAgZW5hYmxlID0gc2l6ZU1vZHVsZSAmJiBzaXplTW9kdWxlLmVuYWJsZTtcclxuICAgICAgICB0aGlzLl9kZWZpbmVzW1NJWkVfT1ZFUl9USU1FX01PRFVMRV9FTkFCTEVdID0gZW5hYmxlO1xyXG4gICAgICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NpemVUZXh0dXJlKSB0aGlzLl9zaXplVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChzaXplTW9kdWxlLnNlcGFyYXRlQXhlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc2l6ZVRleHR1cmUgPSBwYWNrQ3VydmVSYW5nZVhZWihfc2FtcGxlX251bSwgc2l6ZU1vZHVsZS54LCBzaXplTW9kdWxlLnksIHNpemVNb2R1bGUueiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zaXplVGV4dHVyZSA9IHBhY2tDdXJ2ZVJhbmdlTihfc2FtcGxlX251bSwgc2l6ZU1vZHVsZS5zaXplLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgnc2l6ZV9vdmVyX3RpbWVfdGV4MCcpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRTYW1wbGVyKGJpbmRpbmcsIHRoaXMuX3NpemVUZXh0dXJlLmdldEdGWFNhbXBsZXIoKSEpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRUZXh0dXJlKGJpbmRpbmcsIHRoaXMuX3NpemVUZXh0dXJlLmdldEdGWFRleHR1cmUoKSEpO1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlSGFuZGxlID0gcGFzcy5nZXRIYW5kbGUoJ3Vfc2l6ZV9tb2RlJyk7XHJcbiAgICAgICAgICAgIHBhc3Muc2V0VW5pZm9ybShtb2RlSGFuZGxlLCB0aGlzLl9zaXplVGV4dHVyZS5oZWlnaHQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdGV4dHVyZSBtb2R1bGVcclxuICAgICAgICBjb25zdCB0ZXh0dXJlTW9kdWxlID0gdGhpcy5fcGFydGljbGVTeXN0ZW0uX3RleHR1cmVBbmltYXRpb25Nb2R1bGU7XHJcbiAgICAgICAgZW5hYmxlID0gdGV4dHVyZU1vZHVsZSAmJiB0ZXh0dXJlTW9kdWxlLmVuYWJsZTtcclxuICAgICAgICB0aGlzLl9kZWZpbmVzW1RFWFRVUkVfQU5JTUFUSU9OX01PRFVMRV9FTkFCTEVdID0gZW5hYmxlO1xyXG4gICAgICAgIGlmIChlbmFibGUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2FuaW1UZXh0dXJlKSB0aGlzLl9hbmltVGV4dHVyZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2FuaW1UZXh0dXJlID0gcGFja0N1cnZlUmFuZ2VYWShfc2FtcGxlX251bSwgdGV4dHVyZU1vZHVsZS5zdGFydEZyYW1lLCB0ZXh0dXJlTW9kdWxlLmZyYW1lT3ZlclRpbWUpO1xyXG4gICAgICAgICAgICBjb25zdCBoYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgndGV4dHVyZV9hbmltYXRpb25fdGV4MCcpO1xyXG4gICAgICAgICAgICBjb25zdCBiaW5kaW5nID0gUGFzcy5nZXRCaW5kaW5nRnJvbUhhbmRsZShoYW5kbGUpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRTYW1wbGVyKGJpbmRpbmcsIHRoaXMuX2FuaW1UZXh0dXJlLmdldEdGWFNhbXBsZXIoKSEpO1xyXG4gICAgICAgICAgICBwYXNzLmJpbmRUZXh0dXJlKGJpbmRpbmcsIHRoaXMuX2FuaW1UZXh0dXJlLmdldEdGWFRleHR1cmUoKSEpO1xyXG4gICAgICAgICAgICBjb25zdCBpbmZvSGFuZGxlID0gcGFzcy5nZXRIYW5kbGUoJ3VfYW5pbV9pbmZvJyk7XHJcbiAgICAgICAgICAgIF90ZW1wVmVjNC54ID0gdGhpcy5fYW5pbVRleHR1cmUuaGVpZ2h0O1xyXG4gICAgICAgICAgICBfdGVtcFZlYzQueSA9IHRleHR1cmVNb2R1bGUubnVtVGlsZXNYICogdGV4dHVyZU1vZHVsZS5udW1UaWxlc1k7XHJcbiAgICAgICAgICAgIF90ZW1wVmVjNC56ID0gdGV4dHVyZU1vZHVsZS5jeWNsZUNvdW50O1xyXG4gICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0oaW5mb0hhbmRsZSwgX3RlbXBWZWM0KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFBhcnRpY2xlQ291bnQgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlTnVtO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbk1hdGVyaWFsTW9kaWZpZWQgKGluZGV4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5faW5pdGVkKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy51cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvblJlYnVpbGRQU08gKGluZGV4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAmJiBpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zZXRTdWJNb2RlbE1hdGVyaWFsKDAsIG1hdGVyaWFsKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0VmVydGV4QXR0cmliICgpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlckluZm8hLnJlbmRlck1vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBSZW5kZXJNb2RlLlN0cmVjdGhlZEJpbGxib2FyZDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRBdHRycyA9IF9ncHVfdmVydF9hdHRyLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBSZW5kZXJNb2RlLk1lc2g6XHJcbiAgICAgICAgICAgICAgICB0aGlzLl92ZXJ0QXR0cnMgPSBfZ3B1X3ZlcnRfYXR0cl9tZXNoLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRBdHRycyA9IF9ncHVfdmVydF9hdHRyLnNsaWNlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVNYXRlcmlhbFBhcmFtcyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXJ0aWNsZVN5c3RlbSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5fcGFydGljbGVTeXN0ZW07XHJcbiAgICAgICAgY29uc3Qgc2hhcmVNYXRlcmlhbCA9IHBzLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIGlmIChzaGFyZU1hdGVyaWFsICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGVmZmVjdE5hbWUgPSBzaGFyZU1hdGVyaWFsLl9lZmZlY3RBc3NldC5fbmFtZTtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVySW5mbyEubWFpblRleHR1cmUgPSBzaGFyZU1hdGVyaWFsLmdldFByb3BlcnR5KCdtYWluVGV4dHVyZScsIDApO1xyXG4gICAgICAgICAgICBpZiAoZWZmZWN0TmFtZS5pbmRleE9mKCdwYXJ0aWNsZS1ncHUnKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3JlbmRlckluZm8hLm1haW5UZXh0dXJlID0gc2hhcmVNYXRlcmlhbC5nZXRQcm9wZXJ0eSgnbWFpblRleHR1cmUnLCAwKTtcclxuICAgICAgICAgICAgICAgIC8vIHJlc2V0IG1hdGVyaWFsXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9wYXJ0aWNsZVN5c3RlbS5zZXRNYXRlcmlhbChudWxsLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBzLnNoYXJlZE1hdGVyaWFsID09IG51bGwgJiYgdGhpcy5fZGVmYXVsdE1hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIF9tYXRJbnNJbmZvLnBhcmVudCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0PE1hdGVyaWFsPignZGVmYXVsdC1wYXJ0aWNsZS1ncHUtbWF0ZXJpYWwnKTtcclxuICAgICAgICAgICAgX21hdEluc0luZm8ub3duZXIgPSBwcztcclxuICAgICAgICAgICAgX21hdEluc0luZm8uc3ViTW9kZWxJZHggPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZhdWx0TWF0ID0gbmV3IE1hdGVyaWFsSW5zdGFuY2UoX21hdEluc0luZm8pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcmVuZGVySW5mbyEubWFpblRleHR1cmUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRNYXQuc2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgdGhpcy5fcmVuZGVySW5mbyEubWFpblRleHR1cmUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IG1hdDogTWF0ZXJpYWwgfCBudWxsID0gcHMuZ2V0TWF0ZXJpYWxJbnN0YW5jZSgwKSB8fCB0aGlzLl9kZWZhdWx0TWF0O1xyXG5cclxuICAgICAgICBwcy5ub2RlLmdldFdvcmxkTWF0cml4KF90ZW1wV29ybGRUcmFucyk7XHJcbiAgICAgICAgc3dpdGNoIChwcy5zY2FsZVNwYWNlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgU3BhY2UuTG9jYWw6XHJcbiAgICAgICAgICAgICAgICBwcy5ub2RlLmdldFNjYWxlKHRoaXMuX25vZGVfc2NhbGUpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgU3BhY2UuV29ybGQ6XHJcbiAgICAgICAgICAgICAgICBwcy5ub2RlLmdldFdvcmxkU2NhbGUodGhpcy5fbm9kZV9zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwcy5fc2ltdWxhdGlvblNwYWNlID09PSBTcGFjZS5Xb3JsZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1VTRV9XT1JMRF9TUEFDRV0gPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmluZXNbQ0NfVVNFX1dPUkxEX1NQQUNFXSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCByZW5kZXJNb2RlID0gdGhpcy5fcmVuZGVySW5mbyEucmVuZGVyTW9kZTtcclxuICAgICAgICBpZiAocmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5CaWxsYm9hcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lc1tDQ19SRU5ERVJfTU9ERV0gPSBSRU5ERVJfTU9ERV9CSUxMQk9BUkQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZW5kZXJNb2RlID09PSBSZW5kZXJNb2RlLlN0cmVjdGhlZEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX1NUUkVUQ0hFRF9CSUxMQk9BUkQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZS56ID0gdGhpcy5fcmVuZGVySW5mbyEudmVsb2NpdHlTY2FsZTtcclxuICAgICAgICAgICAgdGhpcy5fZnJhbWVUaWxlX3ZlbExlblNjYWxlLncgPSB0aGlzLl9yZW5kZXJJbmZvIS5sZW5ndGhTY2FsZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuSG9yaXpvbnRhbEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5WZXJ0aWNhbEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX1ZFUlRJQ0FMX0JJTExCT0FSRDtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuTWVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX01FU0g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBwYXJ0aWNsZSBzeXN0ZW0gcmVuZGVyTW9kZSAke3JlbmRlck1vZGV9IG5vdCBzdXBwb3J0LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0ZXh0dXJlTW9kdWxlID0gcHMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGU7XHJcbiAgICAgICAgaWYgKHRleHR1cmVNb2R1bGUgJiYgdGV4dHVyZU1vZHVsZS5lbmFibGUpIHtcclxuICAgICAgICAgICAgVmVjMi5zZXQodGhpcy5fZnJhbWVUaWxlX3ZlbExlblNjYWxlLCB0ZXh0dXJlTW9kdWxlLm51bVRpbGVzWCwgdGV4dHVyZU1vZHVsZS5udW1UaWxlc1kpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pbml0U2hhZGVyVW5pZm9ybShtYXQhKTtcclxuXHJcbiAgICAgICAgbWF0IS5yZWNvbXBpbGVTaGFkZXJzKHRoaXMuX2RlZmluZXMpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwudXBkYXRlTWF0ZXJpYWwobWF0ISk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==