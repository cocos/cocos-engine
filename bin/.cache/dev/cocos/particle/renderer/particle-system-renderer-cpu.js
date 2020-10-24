(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/3d/builtin/index.js", "../../core/gfx/define.js", "../../core/math/index.js", "../../core/memop/index.js", "../../core/renderer/core/material-instance.js", "../enum.js", "../particle.js", "./particle-system-renderer-base.js", "../../core/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/3d/builtin/index.js"), require("../../core/gfx/define.js"), require("../../core/math/index.js"), require("../../core/memop/index.js"), require("../../core/renderer/core/material-instance.js"), require("../enum.js"), require("../particle.js"), require("./particle-system-renderer-base.js"), require("../../core/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.index, global.index, global.materialInstance, global._enum, global.particle, global.particleSystemRendererBase, global.index);
    global.particleSystemRendererCpu = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _index2, _index3, _materialInstance, _enum, _particle, _particleSystemRendererBase, _index4) {
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

  var _tempAttribUV = new _index2.Vec3();

  var _tempWorldTrans = new _index2.Mat4();

  var _anim_module = ['_colorOverLifetimeModule', '_sizeOvertimeModule', '_velocityOvertimeModule', '_forceOvertimeModule', '_limitVelocityOvertimeModule', '_rotationOvertimeModule', '_textureAnimationModule'];
  var _uvs = [0, 0, // bottom-left
  1, 0, // bottom-right
  0, 1, // top-left
  1, 1 // top-right
  ];
  var CC_USE_WORLD_SPACE = 'CC_USE_WORLD_SPACE';
  var CC_RENDER_MODE = 'CC_RENDER_MODE';
  var RENDER_MODE_BILLBOARD = 0;
  var RENDER_MODE_STRETCHED_BILLBOARD = 1;
  var RENDER_MODE_HORIZONTAL_BILLBOARD = 2;
  var RENDER_MODE_VERTICAL_BILLBOARD = 3;
  var RENDER_MODE_MESH = 4;
  var _vertex_attrs = [new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), // position
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGB32F), // uv,frame idx
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD1, _define.GFXFormat.RGB32F), // size
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD2, _define.GFXFormat.RGB32F), // rotation
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA8, true) // color
  ];
  var _vertex_attrs_stretch = [new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), // position
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGB32F), // uv,frame idx
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD1, _define.GFXFormat.RGB32F), // size
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD2, _define.GFXFormat.RGB32F), // rotation
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA8, true), // color
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR1, _define.GFXFormat.RGB32F) // particle velocity
  ];
  var _vertex_attrs_mesh = [new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), // particle position
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RGB32F), // uv,frame idx
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD1, _define.GFXFormat.RGB32F), // size
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD2, _define.GFXFormat.RGB32F), // rotation
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR, _define.GFXFormat.RGBA8, true), // particle color
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD3, _define.GFXFormat.RGB32F), // mesh position
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_NORMAL, _define.GFXFormat.RGB32F), // mesh normal
  new _index4.GFXAttribute(_define.GFXAttributeName.ATTR_COLOR1, _define.GFXFormat.RGBA8, true) // mesh color
  ];
  var _matInsInfo = {
    parent: null,
    owner: null,
    subModelIdx: 0
  };

  var ParticleSystemRendererCPU = /*#__PURE__*/function (_ParticleSystemRender) {
    _inherits(ParticleSystemRendererCPU, _ParticleSystemRender);

    function ParticleSystemRendererCPU(info) {
      var _this;

      _classCallCheck(this, ParticleSystemRendererCPU);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ParticleSystemRendererCPU).call(this, info));
      _this._defines = void 0;
      _this._trailDefines = void 0;
      _this._frameTile_velLenScale = void 0;
      _this._defaultMat = null;
      _this._node_scale = void 0;
      _this._attrs = void 0;
      _this._particles = null;
      _this._defaultTrailMat = null;
      _this._updateList = new Map();
      _this._animateList = new Map();
      _this._runAnimateList = new Array();
      _this._fillDataFunc = null;
      _this._uScaleHandle = 0;
      _this._uLenHandle = 0;
      _this._inited = false;
      _this._model = null;
      _this._frameTile_velLenScale = new _index2.Vec4(1, 1, 0, 0);
      _this._node_scale = new _index2.Vec4();
      _this._attrs = new Array(5);
      _this._defines = {
        CC_USE_WORLD_SPACE: true,
        CC_USE_BILLBOARD: true,
        CC_USE_STRETCHED_BILLBOARD: false,
        CC_USE_HORIZONTAL_BILLBOARD: false,
        CC_USE_VERTICAL_BILLBOARD: false
      };
      _this._trailDefines = {
        CC_USE_WORLD_SPACE: true // CC_DRAW_WIRE_FRAME: true,   // <wireframe debug>

      };
      return _this;
    }

    _createClass(ParticleSystemRendererCPU, [{
      key: "onInit",
      value: function onInit(ps) {
        var _this2 = this;

        _get(_getPrototypeOf(ParticleSystemRendererCPU.prototype), "onInit", this).call(this, ps);

        this._particles = new _index3.RecyclePool(function () {
          return new _particle.Particle(_this2);
        }, 16);

        this._setVertexAttrib();

        this._setFillFunc();

        this._initModuleList();

        this._initModel();

        this.updateMaterialParams();
        this.updateTrailMaterial();
        this.setVertexAttributes();
        this._inited = true;
      }
    }, {
      key: "clear",
      value: function clear() {
        this._particles.reset();

        if (this._particleSystem._trailModule) {
          this._particleSystem._trailModule.clear();
        }

        this.updateRenderData();
      }
    }, {
      key: "updateRenderMode",
      value: function updateRenderMode() {
        this._setVertexAttrib();

        this._setFillFunc();

        this.updateMaterialParams();
        this.setVertexAttributes();
      }
    }, {
      key: "getFreeParticle",
      value: function getFreeParticle() {
        if (this._particles.length >= this._particleSystem.capacity) {
          return null;
        }

        return this._particles.add();
      }
    }, {
      key: "getDefaultTrailMaterial",
      value: function getDefaultTrailMaterial() {
        return this._defaultTrailMat;
      }
    }, {
      key: "setNewParticle",
      value: function setNewParticle(p) {}
    }, {
      key: "_initModuleList",
      value: function _initModuleList() {
        var _this3 = this;

        _anim_module.forEach(function (val) {
          var pm = _this3._particleSystem[val];

          if (pm && pm.enable) {
            if (pm.needUpdate) {
              _this3._updateList[pm.name] = pm;
            }

            if (pm.needAnimate) {
              _this3._animateList[pm.name] = pm;
            }
          }
        }); // reorder


        this._runAnimateList.length = 0;

        for (var i = 0, len = _particle.PARTICLE_MODULE_ORDER.length; i < len; i++) {
          var p = this._animateList[_particle.PARTICLE_MODULE_ORDER[i]];

          if (p) {
            this._runAnimateList.push(p);
          }
        }
      }
    }, {
      key: "enableModule",
      value: function enableModule(name, val, pm) {
        if (val) {
          if (pm.needUpdate) {
            this._updateList[pm.name] = pm;
          }

          if (pm.needAnimate) {
            this._animateList[pm.name] = pm;
          }
        } else {
          delete this._animateList[name];
          delete this._updateList[name];
        } // reorder


        this._runAnimateList.length = 0;

        for (var i = 0, len = _particle.PARTICLE_MODULE_ORDER.length; i < len; i++) {
          var p = this._animateList[_particle.PARTICLE_MODULE_ORDER[i]];

          if (p) {
            this._runAnimateList.push(p);
          }
        }
      }
    }, {
      key: "updateParticles",
      value: function updateParticles(dt) {
        var _this4 = this;

        var ps = this._particleSystem;

        if (!ps) {
          return this._particles.length;
        }

        ps.node.getWorldMatrix(_tempWorldTrans);

        switch (ps.scaleSpace) {
          case _enum.Space.Local:
            ps.node.getScale(this._node_scale);
            break;

          case _enum.Space.World:
            ps.node.getWorldScale(this._node_scale);
            break;
        }

        var mat = ps.getMaterialInstance(0) || this._defaultMat;

        var pass = mat.passes[0];
        pass.setUniform(this._uScaleHandle, this._node_scale);

        this._updateList.forEach(function (value, key) {
          value.update(ps._simulationSpace, _tempWorldTrans);
        });

        var trailModule = ps._trailModule;
        var trailEnable = trailModule && trailModule.enable;

        if (trailEnable) {
          trailModule.update();
        }

        var _loop = function _loop(_i) {
          var p = _this4._particles.data[_i];
          p.remainingLifetime -= dt;

          _index2.Vec3.set(p.animatedVelocity, 0, 0, 0);

          if (p.remainingLifetime < 0.0) {
            if (trailEnable) {
              trailModule.removeParticle(p);
            }

            _this4._particles.removeAt(_i);

            --_i;
            i = _i;
            return "continue";
          } // apply gravity.


          p.velocity.y -= ps.gravityModifier.evaluate(1 - p.remainingLifetime / p.startLifetime, (0, _index2.pseudoRandom)(p.randomSeed)) * 9.8 * dt;

          _index2.Vec3.copy(p.ultimateVelocity, p.velocity);

          _this4._runAnimateList.forEach(function (value) {
            value.animate(p, dt);
          });

          _index2.Vec3.scaleAndAdd(p.position, p.position, p.ultimateVelocity, dt); // apply velocity.


          if (trailEnable) {
            trailModule.animate(p, dt);
          }

          i = _i;
        };

        for (var i = 0; i < this._particles.length; ++i) {
          var _ret = _loop(i);

          if (_ret === "continue") continue;
        }

        return this._particles.length;
      } // internal function

    }, {
      key: "updateRenderData",
      value: function updateRenderData() {
        // update vertex buffer
        var idx = 0;

        for (var _i2 = 0; _i2 < this._particles.length; ++_i2) {
          var p = this._particles.data[_i2];
          var fi = 0;
          var textureModule = this._particleSystem._textureAnimationModule;

          if (textureModule && textureModule.enable) {
            fi = p.frameIndex;
          }

          idx = _i2 * 4;

          this._fillDataFunc(p, idx, fi);
        } // because we use index buffer, per particle index count = 6.


        this._model.updateIA(this._particles.length);
      }
    }, {
      key: "getParticleCount",
      value: function getParticleCount() {
        return this._particles.length;
      }
    }, {
      key: "onMaterialModified",
      value: function onMaterialModified(index, material) {
        if (!this._inited) {
          return;
        }

        if (index === 0) {
          this.updateMaterialParams();
        } else {
          this.updateTrailMaterial();
        }
      }
    }, {
      key: "onRebuildPSO",
      value: function onRebuildPSO(index, material) {
        if (this._model && index === 0) {
          this._model.setSubModelMaterial(0, material);
        }

        var trailModule = this._particleSystem._trailModule;

        if (trailModule && trailModule._trailModel && index === 1) {
          trailModule._trailModel.setSubModelMaterial(0, material);
        }
      }
    }, {
      key: "_setFillFunc",
      value: function _setFillFunc() {
        if (this._renderInfo.renderMode === _enum.RenderMode.Mesh) {
          this._fillDataFunc = this._fillMeshData;
        } else if (this._renderInfo.renderMode === _enum.RenderMode.StrecthedBillboard) {
          this._fillDataFunc = this._fillStrecthedData;
        } else {
          this._fillDataFunc = this._fillNormalData;
        }
      }
    }, {
      key: "_fillMeshData",
      value: function _fillMeshData(p, idx, fi) {
        var i = idx / 4;
        var attrNum = 0;
        this._attrs[attrNum++] = p.position;
        _tempAttribUV.z = fi;
        this._attrs[attrNum++] = _tempAttribUV;
        this._attrs[attrNum++] = p.size;
        this._attrs[attrNum++] = p.rotation;
        this._attrs[attrNum++] = p.color._val;

        this._model.addParticleVertexData(i, this._attrs);
      }
    }, {
      key: "_fillStrecthedData",
      value: function _fillStrecthedData(p, idx, fi) {
        var attrNum = 0;

        for (var j = 0; j < 4; ++j) {
          // four verts per particle.
          attrNum = 0;
          this._attrs[attrNum++] = p.position;
          _tempAttribUV.x = _uvs[2 * j];
          _tempAttribUV.y = _uvs[2 * j + 1];
          _tempAttribUV.z = fi;
          this._attrs[attrNum++] = _tempAttribUV;
          this._attrs[attrNum++] = p.size;
          this._attrs[attrNum++] = p.rotation;
          this._attrs[attrNum++] = p.color._val;
          this._attrs[attrNum++] = p.ultimateVelocity;
          this._attrs[attrNum++] = p.ultimateVelocity;

          this._model.addParticleVertexData(idx++, this._attrs);
        }
      }
    }, {
      key: "_fillNormalData",
      value: function _fillNormalData(p, idx, fi) {
        var attrNum = 0;

        for (var j = 0; j < 4; ++j) {
          // four verts per particle.
          attrNum = 0;
          this._attrs[attrNum++] = p.position;
          _tempAttribUV.x = _uvs[2 * j];
          _tempAttribUV.y = _uvs[2 * j + 1];
          _tempAttribUV.z = fi;
          this._attrs[attrNum++] = _tempAttribUV;
          this._attrs[attrNum++] = p.size;
          this._attrs[attrNum++] = p.rotation;
          this._attrs[attrNum++] = p.color._val;
          this._attrs[attrNum++] = null;

          this._model.addParticleVertexData(idx++, this._attrs);
        }
      }
    }, {
      key: "_setVertexAttrib",
      value: function _setVertexAttrib() {
        switch (this._renderInfo.renderMode) {
          case _enum.RenderMode.StrecthedBillboard:
            this._vertAttrs = _vertex_attrs_stretch.slice();
            break;

          case _enum.RenderMode.Mesh:
            this._vertAttrs = _vertex_attrs_mesh.slice();
            break;

          default:
            this._vertAttrs = _vertex_attrs.slice();
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

        if (shareMaterial != null) {
          var effectName = shareMaterial._effectAsset._name;
          this._renderInfo.mainTexture = shareMaterial.getProperty('mainTexture', 0); // reset material

          if (effectName.indexOf('particle') === -1 || effectName.indexOf('particle-gpu') !== -1) {
            ps.setMaterial(null, 0);
          }
        }

        if (ps.sharedMaterial == null && this._defaultMat == null) {
          _matInsInfo.parent = _index.builtinResMgr.get('default-particle-material');
          _matInsInfo.owner = this._particleSystem;
          _matInsInfo.subModelIdx = 0;
          this._defaultMat = new _materialInstance.MaterialInstance(_matInsInfo);

          if (this._renderInfo.mainTexture !== null) {
            this._defaultMat.setProperty('mainTexture', this._renderInfo.mainTexture);
          }
        }

        var mat = ps.getMaterialInstance(0) || this._defaultMat;

        if (ps._simulationSpace === _enum.Space.World) {
          this._defines[CC_USE_WORLD_SPACE] = true;
        } else {
          this._defines[CC_USE_WORLD_SPACE] = false;
        }

        var pass = mat.passes[0];
        this._uScaleHandle = pass.getHandle('scale');
        this._uLenHandle = pass.getHandle('frameTile_velLenScale');
        var renderMode = this._renderInfo.renderMode;
        var vlenScale = this._frameTile_velLenScale;

        if (renderMode === _enum.RenderMode.Billboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_BILLBOARD;
        } else if (renderMode === _enum.RenderMode.StrecthedBillboard) {
          this._defines[CC_RENDER_MODE] = RENDER_MODE_STRETCHED_BILLBOARD;
          vlenScale.z = this._renderInfo.velocityScale;
          vlenScale.w = this._renderInfo.lengthScale;
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
          _index2.Vec2.set(vlenScale, textureModule.numTilesX, textureModule.numTilesY);

          pass.setUniform(this._uLenHandle, vlenScale);
        } else {
          pass.setUniform(this._uLenHandle, vlenScale);
        }

        mat.recompileShaders(this._defines);

        if (this._model) {
          this._model.updateMaterial(mat);
        }
      }
    }, {
      key: "updateTrailMaterial",
      value: function updateTrailMaterial() {
        if (!this._particleSystem) {
          return;
        }

        var ps = this._particleSystem;
        var trailModule = ps._trailModule;

        if (trailModule && trailModule.enable) {
          if (ps.simulationSpace === _enum.Space.World || trailModule.space === _enum.Space.World) {
            this._trailDefines[CC_USE_WORLD_SPACE] = true;
          } else {
            this._trailDefines[CC_USE_WORLD_SPACE] = false;
          }

          var mat = ps.getMaterialInstance(1);

          if (mat === null && this._defaultTrailMat === null) {
            _matInsInfo.parent = _index.builtinResMgr.get('default-trail-material');
            _matInsInfo.owner = this._particleSystem;
            _matInsInfo.subModelIdx = 1;
            this._defaultTrailMat = new _materialInstance.MaterialInstance(_matInsInfo);
          }

          mat = mat || this._defaultTrailMat;
          mat.recompileShaders(this._trailDefines);
          trailModule.updateMaterial();
        }
      }
    }]);

    return ParticleSystemRendererCPU;
  }(_particleSystemRendererBase.ParticleSystemRendererBase);

  _exports.default = ParticleSystemRendererCPU;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BhcnRpY2xlL3JlbmRlcmVyL3BhcnRpY2xlLXN5c3RlbS1yZW5kZXJlci1jcHUudHMiXSwibmFtZXMiOlsiX3RlbXBBdHRyaWJVViIsIlZlYzMiLCJfdGVtcFdvcmxkVHJhbnMiLCJNYXQ0IiwiX2FuaW1fbW9kdWxlIiwiX3V2cyIsIkNDX1VTRV9XT1JMRF9TUEFDRSIsIkNDX1JFTkRFUl9NT0RFIiwiUkVOREVSX01PREVfQklMTEJPQVJEIiwiUkVOREVSX01PREVfU1RSRVRDSEVEX0JJTExCT0FSRCIsIlJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEIiwiUkVOREVSX01PREVfVkVSVElDQUxfQklMTEJPQVJEIiwiUkVOREVSX01PREVfTUVTSCIsIl92ZXJ0ZXhfYXR0cnMiLCJHRlhBdHRyaWJ1dGUiLCJHRlhBdHRyaWJ1dGVOYW1lIiwiQVRUUl9QT1NJVElPTiIsIkdGWEZvcm1hdCIsIlJHQjMyRiIsIkFUVFJfVEVYX0NPT1JEIiwiQVRUUl9URVhfQ09PUkQxIiwiQVRUUl9URVhfQ09PUkQyIiwiQVRUUl9DT0xPUiIsIlJHQkE4IiwiX3ZlcnRleF9hdHRyc19zdHJldGNoIiwiQVRUUl9DT0xPUjEiLCJfdmVydGV4X2F0dHJzX21lc2giLCJBVFRSX1RFWF9DT09SRDMiLCJBVFRSX05PUk1BTCIsIl9tYXRJbnNJbmZvIiwicGFyZW50Iiwib3duZXIiLCJzdWJNb2RlbElkeCIsIlBhcnRpY2xlU3lzdGVtUmVuZGVyZXJDUFUiLCJpbmZvIiwiX2RlZmluZXMiLCJfdHJhaWxEZWZpbmVzIiwiX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZSIsIl9kZWZhdWx0TWF0IiwiX25vZGVfc2NhbGUiLCJfYXR0cnMiLCJfcGFydGljbGVzIiwiX2RlZmF1bHRUcmFpbE1hdCIsIl91cGRhdGVMaXN0IiwiTWFwIiwiX2FuaW1hdGVMaXN0IiwiX3J1bkFuaW1hdGVMaXN0IiwiQXJyYXkiLCJfZmlsbERhdGFGdW5jIiwiX3VTY2FsZUhhbmRsZSIsIl91TGVuSGFuZGxlIiwiX2luaXRlZCIsIl9tb2RlbCIsIlZlYzQiLCJDQ19VU0VfQklMTEJPQVJEIiwiQ0NfVVNFX1NUUkVUQ0hFRF9CSUxMQk9BUkQiLCJDQ19VU0VfSE9SSVpPTlRBTF9CSUxMQk9BUkQiLCJDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJEIiwicHMiLCJSZWN5Y2xlUG9vbCIsIlBhcnRpY2xlIiwiX3NldFZlcnRleEF0dHJpYiIsIl9zZXRGaWxsRnVuYyIsIl9pbml0TW9kdWxlTGlzdCIsIl9pbml0TW9kZWwiLCJ1cGRhdGVNYXRlcmlhbFBhcmFtcyIsInVwZGF0ZVRyYWlsTWF0ZXJpYWwiLCJzZXRWZXJ0ZXhBdHRyaWJ1dGVzIiwicmVzZXQiLCJfcGFydGljbGVTeXN0ZW0iLCJfdHJhaWxNb2R1bGUiLCJjbGVhciIsInVwZGF0ZVJlbmRlckRhdGEiLCJsZW5ndGgiLCJjYXBhY2l0eSIsImFkZCIsInAiLCJmb3JFYWNoIiwidmFsIiwicG0iLCJlbmFibGUiLCJuZWVkVXBkYXRlIiwibmFtZSIsIm5lZWRBbmltYXRlIiwiaSIsImxlbiIsIlBBUlRJQ0xFX01PRFVMRV9PUkRFUiIsInB1c2giLCJkdCIsIm5vZGUiLCJnZXRXb3JsZE1hdHJpeCIsInNjYWxlU3BhY2UiLCJTcGFjZSIsIkxvY2FsIiwiZ2V0U2NhbGUiLCJXb3JsZCIsImdldFdvcmxkU2NhbGUiLCJtYXQiLCJnZXRNYXRlcmlhbEluc3RhbmNlIiwicGFzcyIsInBhc3NlcyIsInNldFVuaWZvcm0iLCJ2YWx1ZSIsImtleSIsInVwZGF0ZSIsIl9zaW11bGF0aW9uU3BhY2UiLCJ0cmFpbE1vZHVsZSIsInRyYWlsRW5hYmxlIiwiZGF0YSIsInJlbWFpbmluZ0xpZmV0aW1lIiwic2V0IiwiYW5pbWF0ZWRWZWxvY2l0eSIsInJlbW92ZVBhcnRpY2xlIiwicmVtb3ZlQXQiLCJ2ZWxvY2l0eSIsInkiLCJncmF2aXR5TW9kaWZpZXIiLCJldmFsdWF0ZSIsInN0YXJ0TGlmZXRpbWUiLCJyYW5kb21TZWVkIiwiY29weSIsInVsdGltYXRlVmVsb2NpdHkiLCJhbmltYXRlIiwic2NhbGVBbmRBZGQiLCJwb3NpdGlvbiIsImlkeCIsImZpIiwidGV4dHVyZU1vZHVsZSIsIl90ZXh0dXJlQW5pbWF0aW9uTW9kdWxlIiwiZnJhbWVJbmRleCIsInVwZGF0ZUlBIiwiaW5kZXgiLCJtYXRlcmlhbCIsInNldFN1Yk1vZGVsTWF0ZXJpYWwiLCJfdHJhaWxNb2RlbCIsIl9yZW5kZXJJbmZvIiwicmVuZGVyTW9kZSIsIlJlbmRlck1vZGUiLCJNZXNoIiwiX2ZpbGxNZXNoRGF0YSIsIlN0cmVjdGhlZEJpbGxib2FyZCIsIl9maWxsU3RyZWN0aGVkRGF0YSIsIl9maWxsTm9ybWFsRGF0YSIsImF0dHJOdW0iLCJ6Iiwic2l6ZSIsInJvdGF0aW9uIiwiY29sb3IiLCJfdmFsIiwiYWRkUGFydGljbGVWZXJ0ZXhEYXRhIiwiaiIsIngiLCJfdmVydEF0dHJzIiwic2xpY2UiLCJzaGFyZU1hdGVyaWFsIiwic2hhcmVkTWF0ZXJpYWwiLCJlZmZlY3ROYW1lIiwiX2VmZmVjdEFzc2V0IiwiX25hbWUiLCJtYWluVGV4dHVyZSIsImdldFByb3BlcnR5IiwiaW5kZXhPZiIsInNldE1hdGVyaWFsIiwiYnVpbHRpblJlc01nciIsImdldCIsIk1hdGVyaWFsSW5zdGFuY2UiLCJzZXRQcm9wZXJ0eSIsImdldEhhbmRsZSIsInZsZW5TY2FsZSIsIkJpbGxib2FyZCIsInZlbG9jaXR5U2NhbGUiLCJ3IiwibGVuZ3RoU2NhbGUiLCJIb3Jpem9udGFsQmlsbGJvYXJkIiwiVmVydGljYWxCaWxsYm9hcmQiLCJjb25zb2xlIiwid2FybiIsIlZlYzIiLCJudW1UaWxlc1giLCJudW1UaWxlc1kiLCJyZWNvbXBpbGVTaGFkZXJzIiwidXBkYXRlTWF0ZXJpYWwiLCJzaW11bGF0aW9uU3BhY2UiLCJzcGFjZSIsIlBhcnRpY2xlU3lzdGVtUmVuZGVyZXJCYXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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QjtBQUNBLGlCQUFLVSxnQkFBTCxHQUF3QixJQUFJMkgsa0NBQUosQ0FBcUJ4SSxXQUFyQixDQUF4QjtBQUNIOztBQUNEb0UsVUFBQUEsR0FBRyxHQUFHQSxHQUFHLElBQUksS0FBS3ZELGdCQUFsQjtBQUNBdUQsVUFBQUEsR0FBRyxDQUFFbUYsZ0JBQUwsQ0FBc0IsS0FBS2hKLGFBQTNCO0FBQ0FzRSxVQUFBQSxXQUFXLENBQUMyRSxjQUFaO0FBQ0g7QUFDSjs7OztJQXhZa0RHLHNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYnVpbHRpblJlc01nciB9IGZyb20gJy4uLy4uL2NvcmUvM2QvYnVpbHRpbic7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vY29yZS9hc3NldHMnO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGVOYW1lLCBHRlhGb3JtYXQgfSBmcm9tICcuLi8uLi9jb3JlL2dmeC9kZWZpbmUnO1xyXG5pbXBvcnQgeyBNYXQ0LCBWZWMyLCBWZWMzLCBWZWM0LCBwc2V1ZG9SYW5kb20gfSBmcm9tICcuLi8uLi9jb3JlL21hdGgnO1xyXG5pbXBvcnQgeyBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uLy4uL2NvcmUvbWVtb3AnO1xyXG5pbXBvcnQgeyBNYXRlcmlhbEluc3RhbmNlLCBJTWF0ZXJpYWxJbnN0YW5jZUluZm8gfSBmcm9tICcuLi8uLi9jb3JlL3JlbmRlcmVyL2NvcmUvbWF0ZXJpYWwtaW5zdGFuY2UnO1xyXG5pbXBvcnQgeyBNYWNyb1JlY29yZCB9IGZyb20gJy4uLy4uL2NvcmUvcmVuZGVyZXIvY29yZS9wYXNzLXV0aWxzJztcclxuaW1wb3J0IHsgUmVuZGVyTW9kZSwgU3BhY2UgfSBmcm9tICcuLi9lbnVtJztcclxuaW1wb3J0IHsgUGFydGljbGUsIElQYXJ0aWNsZU1vZHVsZSwgUEFSVElDTEVfTU9EVUxFX09SREVSIH0gZnJvbSAnLi4vcGFydGljbGUnO1xyXG5pbXBvcnQgeyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQmFzZSB9IGZyb20gJy4vcGFydGljbGUtc3lzdGVtLXJlbmRlcmVyLWJhc2UnO1xyXG5pbXBvcnQgeyBDb21wb25lbnQsIEdGWEF0dHJpYnV0ZSB9IGZyb20gJy4uLy4uL2NvcmUnO1xyXG5cclxuY29uc3QgX3RlbXBBdHRyaWJVViA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF90ZW1wV29ybGRUcmFucyA9IG5ldyBNYXQ0KCk7XHJcblxyXG5jb25zdCBfYW5pbV9tb2R1bGUgPSBbXHJcbiAgICAnX2NvbG9yT3ZlckxpZmV0aW1lTW9kdWxlJyxcclxuICAgICdfc2l6ZU92ZXJ0aW1lTW9kdWxlJyxcclxuICAgICdfdmVsb2NpdHlPdmVydGltZU1vZHVsZScsXHJcbiAgICAnX2ZvcmNlT3ZlcnRpbWVNb2R1bGUnLFxyXG4gICAgJ19saW1pdFZlbG9jaXR5T3ZlcnRpbWVNb2R1bGUnLFxyXG4gICAgJ19yb3RhdGlvbk92ZXJ0aW1lTW9kdWxlJyxcclxuICAgICdfdGV4dHVyZUFuaW1hdGlvbk1vZHVsZSdcclxuXTtcclxuXHJcbmNvbnN0IF91dnMgPSBbXHJcbiAgICAwLCAwLCAvLyBib3R0b20tbGVmdFxyXG4gICAgMSwgMCwgLy8gYm90dG9tLXJpZ2h0XHJcbiAgICAwLCAxLCAvLyB0b3AtbGVmdFxyXG4gICAgMSwgMSwgLy8gdG9wLXJpZ2h0XHJcbl07XHJcblxyXG5jb25zdCBDQ19VU0VfV09STERfU1BBQ0UgPSAnQ0NfVVNFX1dPUkxEX1NQQUNFJztcclxuXHJcbmNvbnN0IENDX1JFTkRFUl9NT0RFID0gJ0NDX1JFTkRFUl9NT0RFJztcclxuY29uc3QgUkVOREVSX01PREVfQklMTEJPQVJEID0gMDtcclxuY29uc3QgUkVOREVSX01PREVfU1RSRVRDSEVEX0JJTExCT0FSRCA9IDE7XHJcbmNvbnN0IFJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEID0gMjtcclxuY29uc3QgUkVOREVSX01PREVfVkVSVElDQUxfQklMTEJPQVJEID0gMztcclxuY29uc3QgUkVOREVSX01PREVfTUVTSCA9IDQ7XHJcblxyXG5jb25zdCBfdmVydGV4X2F0dHJzID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCBHRlhGb3JtYXQuUkdCMzJGKSwgICAgICAvLyB1dixmcmFtZSBpZHhcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRDEsIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgLy8gc2l6ZVxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMiwgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAvLyByb3RhdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBOCwgdHJ1ZSksICAgICAvLyBjb2xvclxyXG5dO1xyXG5cclxuY29uc3QgX3ZlcnRleF9hdHRyc19zdHJldGNoID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgICAvLyBwb3NpdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCBHRlhGb3JtYXQuUkdCMzJGKSwgICAgICAvLyB1dixmcmFtZSBpZHhcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRDEsIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgLy8gc2l6ZVxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMiwgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAvLyByb3RhdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBOCwgdHJ1ZSksICAgICAvLyBjb2xvclxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IxLCBHRlhGb3JtYXQuUkdCMzJGKSwgICAgICAgICAvLyBwYXJ0aWNsZSB2ZWxvY2l0eVxyXG5dO1xyXG5cclxuY29uc3QgX3ZlcnRleF9hdHRyc19tZXNoID0gW1xyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgICAvLyBwYXJ0aWNsZSBwb3NpdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JELCBHRlhGb3JtYXQuUkdCMzJGKSwgICAgICAvLyB1dixmcmFtZSBpZHhcclxuICAgIG5ldyBHRlhBdHRyaWJ1dGUoR0ZYQXR0cmlidXRlTmFtZS5BVFRSX1RFWF9DT09SRDEsIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgLy8gc2l6ZVxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMiwgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAvLyByb3RhdGlvblxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfQ09MT1IsIEdGWEZvcm1hdC5SR0JBOCwgdHJ1ZSksICAgICAvLyBwYXJ0aWNsZSBjb2xvclxyXG4gICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfVEVYX0NPT1JEMywgR0ZYRm9ybWF0LlJHQjMyRiksICAgICAvLyBtZXNoIHBvc2l0aW9uXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwsIEdGWEZvcm1hdC5SR0IzMkYpLCAgICAgICAgIC8vIG1lc2ggbm9ybWFsXHJcbiAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9DT0xPUjEsIEdGWEZvcm1hdC5SR0JBOCwgdHJ1ZSksICAgIC8vIG1lc2ggY29sb3JcclxuXTtcclxuXHJcbmNvbnN0IF9tYXRJbnNJbmZvOiBJTWF0ZXJpYWxJbnN0YW5jZUluZm8gPSB7XHJcbiAgICBwYXJlbnQ6IG51bGwhLFxyXG4gICAgb3duZXI6IG51bGwhLFxyXG4gICAgc3ViTW9kZWxJZHg6IDAsXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXJ0aWNsZVN5c3RlbVJlbmRlcmVyQ1BVIGV4dGVuZHMgUGFydGljbGVTeXN0ZW1SZW5kZXJlckJhc2Uge1xyXG4gICAgcHJpdmF0ZSBfZGVmaW5lczogTWFjcm9SZWNvcmQ7XHJcbiAgICBwcml2YXRlIF90cmFpbERlZmluZXM6IE1hY3JvUmVjb3JkO1xyXG4gICAgcHJpdmF0ZSBfZnJhbWVUaWxlX3ZlbExlblNjYWxlOiBWZWM0O1xyXG4gICAgcHJpdmF0ZSBfZGVmYXVsdE1hdDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX25vZGVfc2NhbGU6IFZlYzQ7XHJcbiAgICBwcml2YXRlIF9hdHRyczogYW55W107XHJcbiAgICBwcml2YXRlIF9wYXJ0aWNsZXM6IFJlY3ljbGVQb29sIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9kZWZhdWx0VHJhaWxNYXQ6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF91cGRhdGVMaXN0OiBNYXA8c3RyaW5nLCBJUGFydGljbGVNb2R1bGU+ID0gbmV3IE1hcDxzdHJpbmcsIElQYXJ0aWNsZU1vZHVsZT4oKTtcclxuICAgIHByaXZhdGUgX2FuaW1hdGVMaXN0OiBNYXA8c3RyaW5nLCBJUGFydGljbGVNb2R1bGU+ID0gbmV3IE1hcDxzdHJpbmcsIElQYXJ0aWNsZU1vZHVsZT4oKTtcclxuICAgIHByaXZhdGUgX3J1bkFuaW1hdGVMaXN0OiBJUGFydGljbGVNb2R1bGVbXSA9IG5ldyBBcnJheTxJUGFydGljbGVNb2R1bGU+KCk7XHJcbiAgICBwcml2YXRlIF9maWxsRGF0YUZ1bmM6IGFueSA9IG51bGw7XHJcbiAgICBwcml2YXRlIF91U2NhbGVIYW5kbGU6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF91TGVuSGFuZGxlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfaW5pdGVkOiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKGluZm86IGFueSkge1xyXG4gICAgICAgIHN1cGVyKGluZm8pO1xyXG5cclxuICAgICAgICB0aGlzLl9tb2RlbCA9IG51bGw7XHJcblxyXG4gICAgICAgIHRoaXMuX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZSA9IG5ldyBWZWM0KDEsIDEsIDAsIDApO1xyXG4gICAgICAgIHRoaXMuX25vZGVfc2NhbGUgPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgIHRoaXMuX2F0dHJzID0gbmV3IEFycmF5KDUpO1xyXG4gICAgICAgIHRoaXMuX2RlZmluZXMgPSB7XHJcbiAgICAgICAgICAgIENDX1VTRV9XT1JMRF9TUEFDRTogdHJ1ZSxcclxuICAgICAgICAgICAgQ0NfVVNFX0JJTExCT0FSRDogdHJ1ZSxcclxuICAgICAgICAgICAgQ0NfVVNFX1NUUkVUQ0hFRF9CSUxMQk9BUkQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBDQ19VU0VfSE9SSVpPTlRBTF9CSUxMQk9BUkQ6IGZhbHNlLFxyXG4gICAgICAgICAgICBDQ19VU0VfVkVSVElDQUxfQklMTEJPQVJEOiBmYWxzZSxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuX3RyYWlsRGVmaW5lcyA9IHtcclxuICAgICAgICAgICAgQ0NfVVNFX1dPUkxEX1NQQUNFOiB0cnVlLFxyXG4gICAgICAgICAgICAvLyBDQ19EUkFXX1dJUkVfRlJBTUU6IHRydWUsICAgLy8gPHdpcmVmcmFtZSBkZWJ1Zz5cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkluaXQgKHBzOiBDb21wb25lbnQpIHtcclxuICAgICAgICBzdXBlci5vbkluaXQocHMpO1xyXG5cclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZXMgPSBuZXcgUmVjeWNsZVBvb2woKCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFBhcnRpY2xlKHRoaXMpO1xyXG4gICAgICAgIH0sIDE2KTtcclxuICAgICAgICB0aGlzLl9zZXRWZXJ0ZXhBdHRyaWIoKTtcclxuICAgICAgICB0aGlzLl9zZXRGaWxsRnVuYygpO1xyXG4gICAgICAgIHRoaXMuX2luaXRNb2R1bGVMaXN0KCk7XHJcbiAgICAgICAgdGhpcy5faW5pdE1vZGVsKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlVHJhaWxNYXRlcmlhbCgpO1xyXG4gICAgICAgIHRoaXMuc2V0VmVydGV4QXR0cmlidXRlcygpO1xyXG4gICAgICAgIHRoaXMuX2luaXRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNsZWFyICgpIHtcclxuICAgICAgICB0aGlzLl9wYXJ0aWNsZXMhLnJlc2V0KCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhcnRpY2xlU3lzdGVtIS5fdHJhaWxNb2R1bGUpIHtcclxuICAgICAgICAgICAgdGhpcy5fcGFydGljbGVTeXN0ZW0hLl90cmFpbE1vZHVsZS5jbGVhcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVwZGF0ZVJlbmRlckRhdGEoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVuZGVyTW9kZSAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2V0VmVydGV4QXR0cmliKCk7XHJcbiAgICAgICAgdGhpcy5fc2V0RmlsbEZ1bmMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZU1hdGVyaWFsUGFyYW1zKCk7XHJcbiAgICAgICAgdGhpcy5zZXRWZXJ0ZXhBdHRyaWJ1dGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEZyZWVQYXJ0aWNsZSAoKTogUGFydGljbGUgfCBudWxsIHtcclxuICAgICAgICBpZiAodGhpcy5fcGFydGljbGVzIS5sZW5ndGggPj0gdGhpcy5fcGFydGljbGVTeXN0ZW0hLmNhcGFjaXR5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5fcGFydGljbGVzIS5hZGQoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RGVmYXVsdFRyYWlsTWF0ZXJpYWwgKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRUcmFpbE1hdDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0TmV3UGFydGljbGUgKHA6IFBhcnRpY2xlKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5pdE1vZHVsZUxpc3QgKCkge1xyXG4gICAgICAgIF9hbmltX21vZHVsZS5mb3JFYWNoKHZhbCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBtID0gdGhpcy5fcGFydGljbGVTeXN0ZW1bdmFsXTtcclxuICAgICAgICAgICAgaWYgKHBtICYmIHBtLmVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBtLm5lZWRVcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl91cGRhdGVMaXN0W3BtLm5hbWVdID0gcG07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHBtLm5lZWRBbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYW5pbWF0ZUxpc3RbcG0ubmFtZV0gPSBwbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyByZW9yZGVyXHJcbiAgICAgICAgdGhpcy5fcnVuQW5pbWF0ZUxpc3QubGVuZ3RoID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gUEFSVElDTEVfTU9EVUxFX09SREVSLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHAgPSB0aGlzLl9hbmltYXRlTGlzdFtQQVJUSUNMRV9NT0RVTEVfT1JERVJbaV1dO1xyXG4gICAgICAgICAgICBpZiAocCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcnVuQW5pbWF0ZUxpc3QucHVzaChwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZW5hYmxlTW9kdWxlIChuYW1lOiBzdHJpbmcsIHZhbDogQm9vbGVhbiwgcG06IElQYXJ0aWNsZU1vZHVsZSkge1xyXG4gICAgICAgIGlmICh2YWwpIHtcclxuICAgICAgICAgICAgaWYgKHBtLm5lZWRVcGRhdGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VwZGF0ZUxpc3RbcG0ubmFtZV0gPSBwbTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHBtLm5lZWRBbmltYXRlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9hbmltYXRlTGlzdFtwbS5uYW1lXSA9IHBtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2FuaW1hdGVMaXN0W25hbWVdO1xyXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fdXBkYXRlTGlzdFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcmVvcmRlclxyXG4gICAgICAgIHRoaXMuX3J1bkFuaW1hdGVMaXN0Lmxlbmd0aCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IFBBUlRJQ0xFX01PRFVMRV9PUkRFUi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwID0gdGhpcy5fYW5pbWF0ZUxpc3RbUEFSVElDTEVfTU9EVUxFX09SREVSW2ldXTtcclxuICAgICAgICAgICAgaWYgKHApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3J1bkFuaW1hdGVMaXN0LnB1c2gocCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVBhcnRpY2xlcyAoZHQ6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5fcGFydGljbGVTeXN0ZW07XHJcbiAgICAgICAgaWYgKCFwcykge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcGFydGljbGVzIS5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBzLm5vZGUuZ2V0V29ybGRNYXRyaXgoX3RlbXBXb3JsZFRyYW5zKTtcclxuICAgICAgICBzd2l0Y2ggKHBzLnNjYWxlU3BhY2UpIHtcclxuICAgICAgICAgICAgY2FzZSBTcGFjZS5Mb2NhbDpcclxuICAgICAgICAgICAgICAgIHBzLm5vZGUuZ2V0U2NhbGUodGhpcy5fbm9kZV9zY2FsZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBTcGFjZS5Xb3JsZDpcclxuICAgICAgICAgICAgICAgIHBzLm5vZGUuZ2V0V29ybGRTY2FsZSh0aGlzLl9ub2RlX3NjYWxlKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtYXQ6IE1hdGVyaWFsIHwgbnVsbCA9IHBzLmdldE1hdGVyaWFsSW5zdGFuY2UoMCkgfHwgdGhpcy5fZGVmYXVsdE1hdDtcclxuICAgICAgICBjb25zdCBwYXNzID0gbWF0IS5wYXNzZXNbMF07XHJcbiAgICAgICAgcGFzcy5zZXRVbmlmb3JtKHRoaXMuX3VTY2FsZUhhbmRsZSwgdGhpcy5fbm9kZV9zY2FsZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUxpc3QuZm9yRWFjaCgodmFsdWU6IElQYXJ0aWNsZU1vZHVsZSwga2V5OiBzdHJpbmcpPT57XHJcbiAgICAgICAgICAgIHZhbHVlLnVwZGF0ZShwcy5fc2ltdWxhdGlvblNwYWNlLCBfdGVtcFdvcmxkVHJhbnMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCB0cmFpbE1vZHVsZSA9IHBzLl90cmFpbE1vZHVsZTtcclxuICAgICAgICBjb25zdCB0cmFpbEVuYWJsZSA9IHRyYWlsTW9kdWxlICYmIHRyYWlsTW9kdWxlLmVuYWJsZTtcclxuICAgICAgICBpZiAodHJhaWxFbmFibGUpIHtcclxuICAgICAgICAgICAgdHJhaWxNb2R1bGUudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlcyEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgcCA9IHRoaXMuX3BhcnRpY2xlcyEuZGF0YVtpXTtcclxuICAgICAgICAgICAgcC5yZW1haW5pbmdMaWZldGltZSAtPSBkdDtcclxuICAgICAgICAgICAgVmVjMy5zZXQocC5hbmltYXRlZFZlbG9jaXR5LCAwLCAwLCAwKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwLnJlbWFpbmluZ0xpZmV0aW1lIDwgMC4wKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHJhaWxFbmFibGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0cmFpbE1vZHVsZS5yZW1vdmVQYXJ0aWNsZShwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3BhcnRpY2xlcyEucmVtb3ZlQXQoaSk7XHJcbiAgICAgICAgICAgICAgICAtLWk7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXBwbHkgZ3Jhdml0eS5cclxuICAgICAgICAgICAgcC52ZWxvY2l0eS55IC09IHBzLmdyYXZpdHlNb2RpZmllci5ldmFsdWF0ZSgxIC0gcC5yZW1haW5pbmdMaWZldGltZSAvIHAuc3RhcnRMaWZldGltZSwgcHNldWRvUmFuZG9tKHAucmFuZG9tU2VlZCkpISAqIDkuOCAqIGR0O1xyXG5cclxuICAgICAgICAgICAgVmVjMy5jb3B5KHAudWx0aW1hdGVWZWxvY2l0eSwgcC52ZWxvY2l0eSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9ydW5BbmltYXRlTGlzdC5mb3JFYWNoKHZhbHVlID0+e1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuYW5pbWF0ZShwLCBkdCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgVmVjMy5zY2FsZUFuZEFkZChwLnBvc2l0aW9uLCBwLnBvc2l0aW9uLCBwLnVsdGltYXRlVmVsb2NpdHksIGR0KTsgLy8gYXBwbHkgdmVsb2NpdHkuXHJcbiAgICAgICAgICAgIGlmICh0cmFpbEVuYWJsZSkge1xyXG4gICAgICAgICAgICAgICAgdHJhaWxNb2R1bGUuYW5pbWF0ZShwLCBkdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcnRpY2xlcyEubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGludGVybmFsIGZ1bmN0aW9uXHJcbiAgICBwdWJsaWMgdXBkYXRlUmVuZGVyRGF0YSAoKSB7XHJcbiAgICAgICAgLy8gdXBkYXRlIHZlcnRleCBidWZmZXJcclxuICAgICAgICBsZXQgaWR4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3BhcnRpY2xlcyEubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgcCA9IHRoaXMuX3BhcnRpY2xlcyEuZGF0YVtpXTtcclxuICAgICAgICAgICAgbGV0IGZpID0gMDtcclxuICAgICAgICAgICAgY29uc3QgdGV4dHVyZU1vZHVsZSA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtIS5fdGV4dHVyZUFuaW1hdGlvbk1vZHVsZTtcclxuICAgICAgICAgICAgaWYgKHRleHR1cmVNb2R1bGUgJiYgdGV4dHVyZU1vZHVsZS5lbmFibGUpIHtcclxuICAgICAgICAgICAgICAgIGZpID0gcC5mcmFtZUluZGV4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlkeCA9IGkgKiA0O1xyXG4gICAgICAgICAgICB0aGlzLl9maWxsRGF0YUZ1bmMocCwgaWR4LCBmaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGJlY2F1c2Ugd2UgdXNlIGluZGV4IGJ1ZmZlciwgcGVyIHBhcnRpY2xlIGluZGV4IGNvdW50ID0gNi5cclxuICAgICAgICB0aGlzLl9tb2RlbCEudXBkYXRlSUEodGhpcy5fcGFydGljbGVzIS5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQYXJ0aWNsZUNvdW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJ0aWNsZXMhLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25NYXRlcmlhbE1vZGlmaWVkIChpbmRleDogbnVtYmVyLCBtYXRlcmlhbDogTWF0ZXJpYWwpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX2luaXRlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVNYXRlcmlhbFBhcmFtcygpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVHJhaWxNYXRlcmlhbCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SZWJ1aWxkUFNPIChpbmRleDogbnVtYmVyLCBtYXRlcmlhbDogTWF0ZXJpYWwpIHtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwgJiYgaW5kZXggPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0U3ViTW9kZWxNYXRlcmlhbCgwLCBtYXRlcmlhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRyYWlsTW9kdWxlID0gdGhpcy5fcGFydGljbGVTeXN0ZW0hLl90cmFpbE1vZHVsZTtcclxuICAgICAgICBpZiAodHJhaWxNb2R1bGUgJiYgdHJhaWxNb2R1bGUuX3RyYWlsTW9kZWwgJiYgaW5kZXggPT09IDEpIHtcclxuICAgICAgICAgICAgdHJhaWxNb2R1bGUuX3RyYWlsTW9kZWwuc2V0U3ViTW9kZWxNYXRlcmlhbCgwLCBtYXRlcmlhbCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3NldEZpbGxGdW5jICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fcmVuZGVySW5mbyEucmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5NZXNoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbGxEYXRhRnVuYyA9IHRoaXMuX2ZpbGxNZXNoRGF0YTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX3JlbmRlckluZm8hLnJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuU3RyZWN0aGVkQmlsbGJvYXJkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbGxEYXRhRnVuYyA9IHRoaXMuX2ZpbGxTdHJlY3RoZWREYXRhO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpbGxEYXRhRnVuYyA9IHRoaXMuX2ZpbGxOb3JtYWxEYXRhO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9maWxsTWVzaERhdGEgKHA6IFBhcnRpY2xlLCBpZHg6IG51bWJlciwgZmk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGkgPSBpZHggLyA0O1xyXG4gICAgICAgIGxldCBhdHRyTnVtID0gMDtcclxuICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5wb3NpdGlvbjtcclxuICAgICAgICBfdGVtcEF0dHJpYlVWLnogPSBmaTtcclxuICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gX3RlbXBBdHRyaWJVVjtcclxuICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5zaXplO1xyXG4gICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBwLnJvdGF0aW9uO1xyXG4gICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBwLmNvbG9yLl92YWw7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwhLmFkZFBhcnRpY2xlVmVydGV4RGF0YShpLCB0aGlzLl9hdHRycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZmlsbFN0cmVjdGhlZERhdGEgKHA6IFBhcnRpY2xlLCBpZHg6IG51bWJlciwgZmk6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBhdHRyTnVtID0gMDtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDQ7ICsraikgeyAvLyBmb3VyIHZlcnRzIHBlciBwYXJ0aWNsZS5cclxuICAgICAgICAgICAgYXR0ck51bSA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBwLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICBfdGVtcEF0dHJpYlVWLnggPSBfdXZzWzIgKiBqXTtcclxuICAgICAgICAgICAgX3RlbXBBdHRyaWJVVi55ID0gX3V2c1syICogaiArIDFdO1xyXG4gICAgICAgICAgICBfdGVtcEF0dHJpYlVWLnogPSBmaTtcclxuICAgICAgICAgICAgdGhpcy5fYXR0cnNbYXR0ck51bSsrXSA9IF90ZW1wQXR0cmliVVY7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBwLnNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBwLnJvdGF0aW9uO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5jb2xvci5fdmFsO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC51bHRpbWF0ZVZlbG9jaXR5O1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC51bHRpbWF0ZVZlbG9jaXR5O1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbCEuYWRkUGFydGljbGVWZXJ0ZXhEYXRhKGlkeCsrLCB0aGlzLl9hdHRycyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2ZpbGxOb3JtYWxEYXRhIChwOiBQYXJ0aWNsZSwgaWR4OiBudW1iZXIsIGZpOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgYXR0ck51bSA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA0OyArK2opIHsgLy8gZm91ciB2ZXJ0cyBwZXIgcGFydGljbGUuXHJcbiAgICAgICAgICAgIGF0dHJOdW0gPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5wb3NpdGlvbjtcclxuICAgICAgICAgICAgX3RlbXBBdHRyaWJVVi54ID0gX3V2c1syICogal07XHJcbiAgICAgICAgICAgIF90ZW1wQXR0cmliVVYueSA9IF91dnNbMiAqIGogKyAxXTtcclxuICAgICAgICAgICAgX3RlbXBBdHRyaWJVVi56ID0gZmk7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dHJzW2F0dHJOdW0rK10gPSBfdGVtcEF0dHJpYlVWO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5zaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9hdHRyc1thdHRyTnVtKytdID0gcC5yb3RhdGlvbjtcclxuICAgICAgICAgICAgdGhpcy5fYXR0cnNbYXR0ck51bSsrXSA9IHAuY29sb3IuX3ZhbDtcclxuICAgICAgICAgICAgdGhpcy5fYXR0cnNbYXR0ck51bSsrXSA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsIS5hZGRQYXJ0aWNsZVZlcnRleERhdGEoaWR4KyssIHRoaXMuX2F0dHJzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfc2V0VmVydGV4QXR0cmliICgpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuX3JlbmRlckluZm8hLnJlbmRlck1vZGUpIHtcclxuICAgICAgICAgICAgY2FzZSBSZW5kZXJNb2RlLlN0cmVjdGhlZEJpbGxib2FyZDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRBdHRycyA9IF92ZXJ0ZXhfYXR0cnNfc3RyZXRjaC5zbGljZSgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgUmVuZGVyTW9kZS5NZXNoOlxyXG4gICAgICAgICAgICAgICAgdGhpcy5fdmVydEF0dHJzID0gX3ZlcnRleF9hdHRyc19tZXNoLnNsaWNlKCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuX3ZlcnRBdHRycyA9IF92ZXJ0ZXhfYXR0cnMuc2xpY2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZU1hdGVyaWFsUGFyYW1zICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBzID0gdGhpcy5fcGFydGljbGVTeXN0ZW07XHJcbiAgICAgICAgY29uc3Qgc2hhcmVNYXRlcmlhbCA9IHBzLnNoYXJlZE1hdGVyaWFsO1xyXG4gICAgICAgIGlmIChzaGFyZU1hdGVyaWFsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgZWZmZWN0TmFtZSA9IHNoYXJlTWF0ZXJpYWwuX2VmZmVjdEFzc2V0Ll9uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJJbmZvIS5tYWluVGV4dHVyZSA9IHNoYXJlTWF0ZXJpYWwuZ2V0UHJvcGVydHkoJ21haW5UZXh0dXJlJywgMCk7XHJcbiAgICAgICAgICAgIC8vIHJlc2V0IG1hdGVyaWFsXHJcbiAgICAgICAgICAgIGlmIChlZmZlY3ROYW1lLmluZGV4T2YoJ3BhcnRpY2xlJykgPT09IC0xIHx8IGVmZmVjdE5hbWUuaW5kZXhPZigncGFydGljbGUtZ3B1JykgIT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBwcy5zZXRNYXRlcmlhbChudWxsLCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBzLnNoYXJlZE1hdGVyaWFsID09IG51bGwgJiYgdGhpcy5fZGVmYXVsdE1hdCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIF9tYXRJbnNJbmZvLnBhcmVudCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0PE1hdGVyaWFsPignZGVmYXVsdC1wYXJ0aWNsZS1tYXRlcmlhbCcpO1xyXG4gICAgICAgICAgICBfbWF0SW5zSW5mby5vd25lciA9IHRoaXMuX3BhcnRpY2xlU3lzdGVtO1xyXG4gICAgICAgICAgICBfbWF0SW5zSW5mby5zdWJNb2RlbElkeCA9IDA7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRNYXQgPSBuZXcgTWF0ZXJpYWxJbnN0YW5jZShfbWF0SW5zSW5mbyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9yZW5kZXJJbmZvIS5tYWluVGV4dHVyZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVmYXVsdE1hdC5zZXRQcm9wZXJ0eSgnbWFpblRleHR1cmUnLCB0aGlzLl9yZW5kZXJJbmZvIS5tYWluVGV4dHVyZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbWF0OiBNYXRlcmlhbCA9IHBzLmdldE1hdGVyaWFsSW5zdGFuY2UoMCkgfHwgdGhpcy5fZGVmYXVsdE1hdDtcclxuICAgICAgICBpZiAocHMuX3NpbXVsYXRpb25TcGFjZSA9PT0gU3BhY2UuV29ybGQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lc1tDQ19VU0VfV09STERfU1BBQ0VdID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1VTRV9XT1JMRF9TUEFDRV0gPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHBhc3MgPSBtYXQucGFzc2VzWzBdO1xyXG4gICAgICAgIHRoaXMuX3VTY2FsZUhhbmRsZSA9IHBhc3MuZ2V0SGFuZGxlKCdzY2FsZScpO1xyXG4gICAgICAgIHRoaXMuX3VMZW5IYW5kbGUgPSBwYXNzLmdldEhhbmRsZSgnZnJhbWVUaWxlX3ZlbExlblNjYWxlJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbmRlck1vZGUgPSB0aGlzLl9yZW5kZXJJbmZvIS5yZW5kZXJNb2RlO1xyXG4gICAgICAgIGNvbnN0IHZsZW5TY2FsZSA9IHRoaXMuX2ZyYW1lVGlsZV92ZWxMZW5TY2FsZTtcclxuICAgICAgICBpZiAocmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5CaWxsYm9hcmQpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVmaW5lc1tDQ19SRU5ERVJfTU9ERV0gPSBSRU5ERVJfTU9ERV9CSUxMQk9BUkQ7XHJcbiAgICAgICAgfSBlbHNlIGlmIChyZW5kZXJNb2RlID09PSBSZW5kZXJNb2RlLlN0cmVjdGhlZEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX1NUUkVUQ0hFRF9CSUxMQk9BUkQ7XHJcbiAgICAgICAgICAgIHZsZW5TY2FsZS56ID0gdGhpcy5fcmVuZGVySW5mbyEudmVsb2NpdHlTY2FsZTtcclxuICAgICAgICAgICAgdmxlblNjYWxlLncgPSB0aGlzLl9yZW5kZXJJbmZvIS5sZW5ndGhTY2FsZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuSG9yaXpvbnRhbEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX0hPUklaT05UQUxfQklMTEJPQVJEO1xyXG4gICAgICAgIH0gZWxzZSBpZiAocmVuZGVyTW9kZSA9PT0gUmVuZGVyTW9kZS5WZXJ0aWNhbEJpbGxib2FyZCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX1ZFUlRJQ0FMX0JJTExCT0FSRDtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlbmRlck1vZGUgPT09IFJlbmRlck1vZGUuTWVzaCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZWZpbmVzW0NDX1JFTkRFUl9NT0RFXSA9IFJFTkRFUl9NT0RFX01FU0g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGBwYXJ0aWNsZSBzeXN0ZW0gcmVuZGVyTW9kZSAke3JlbmRlck1vZGV9IG5vdCBzdXBwb3J0LmApO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCB0ZXh0dXJlTW9kdWxlID0gcHMuX3RleHR1cmVBbmltYXRpb25Nb2R1bGU7XHJcbiAgICAgICAgaWYgKHRleHR1cmVNb2R1bGUgJiYgdGV4dHVyZU1vZHVsZS5lbmFibGUpIHtcclxuICAgICAgICAgICAgVmVjMi5zZXQodmxlblNjYWxlLCB0ZXh0dXJlTW9kdWxlLm51bVRpbGVzWCwgdGV4dHVyZU1vZHVsZS5udW1UaWxlc1kpO1xyXG4gICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0odGhpcy5fdUxlbkhhbmRsZSwgdmxlblNjYWxlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBwYXNzLnNldFVuaWZvcm0odGhpcy5fdUxlbkhhbmRsZSwgdmxlblNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbWF0LnJlY29tcGlsZVNoYWRlcnModGhpcy5fZGVmaW5lcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZU1hdGVyaWFsKG1hdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVUcmFpbE1hdGVyaWFsICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhcnRpY2xlU3lzdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgcHMgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbTtcclxuICAgICAgICBjb25zdCB0cmFpbE1vZHVsZSA9IHBzLl90cmFpbE1vZHVsZTtcclxuICAgICAgICBpZiAodHJhaWxNb2R1bGUgJiYgdHJhaWxNb2R1bGUuZW5hYmxlKSB7XHJcbiAgICAgICAgICAgIGlmIChwcy5zaW11bGF0aW9uU3BhY2UgPT09IFNwYWNlLldvcmxkIHx8IHRyYWlsTW9kdWxlLnNwYWNlID09PSBTcGFjZS5Xb3JsZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhaWxEZWZpbmVzW0NDX1VTRV9XT1JMRF9TUEFDRV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fdHJhaWxEZWZpbmVzW0NDX1VTRV9XT1JMRF9TUEFDRV0gPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBsZXQgbWF0ID0gcHMuZ2V0TWF0ZXJpYWxJbnN0YW5jZSgxKTtcclxuICAgICAgICAgICAgaWYgKG1hdCA9PT0gbnVsbCAmJiB0aGlzLl9kZWZhdWx0VHJhaWxNYXQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIF9tYXRJbnNJbmZvLnBhcmVudCA9IGJ1aWx0aW5SZXNNZ3IuZ2V0PE1hdGVyaWFsPignZGVmYXVsdC10cmFpbC1tYXRlcmlhbCcpO1xyXG4gICAgICAgICAgICAgICAgX21hdEluc0luZm8ub3duZXIgPSB0aGlzLl9wYXJ0aWNsZVN5c3RlbTtcclxuICAgICAgICAgICAgICAgIF9tYXRJbnNJbmZvLnN1Yk1vZGVsSWR4ID0gMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RlZmF1bHRUcmFpbE1hdCA9IG5ldyBNYXRlcmlhbEluc3RhbmNlKF9tYXRJbnNJbmZvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXQgPSBtYXQgfHwgdGhpcy5fZGVmYXVsdFRyYWlsTWF0O1xyXG4gICAgICAgICAgICBtYXQhLnJlY29tcGlsZVNoYWRlcnModGhpcy5fdHJhaWxEZWZpbmVzKTtcclxuICAgICAgICAgICAgdHJhaWxNb2R1bGUudXBkYXRlTWF0ZXJpYWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIl19