(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/mesh.js", "../../data/decorators/index.js", "../../math/index.js", "../../renderer/index.js", "../../scene-graph/node-enum.js", "../../value-types/index.js", "../builtin/index.js", "./renderable-component.js", "../../global-exports.js", "../../data/utils/asserts.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/mesh.js"), require("../../data/decorators/index.js"), require("../../math/index.js"), require("../../renderer/index.js"), require("../../scene-graph/node-enum.js"), require("../../value-types/index.js"), require("../builtin/index.js"), require("./renderable-component.js"), require("../../global-exports.js"), require("../../data/utils/asserts.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.mesh, global.index, global.index, global.index, global.nodeEnum, global.index, global.index, global.renderableComponent, global.globalExports, global.asserts);
    global.meshRenderer = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _mesh, _index, _index2, _index3, _nodeEnum, _index4, _index5, _renderableComponent, _globalExports, _asserts) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.MeshRenderer = void 0;

  var _dec, _dec2, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _temp, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class4, _class5, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _class6, _temp2;

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en Shadow projection mode.
   * @zh 阴影投射方式。
   */
  var ModelShadowCastingMode = (0, _index4.Enum)({
    /**
     * @en Disable shadow projection.
     * @zh 不投射阴影。
     */
    OFF: 0,

    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: 1
  });
  /**
   * @en Shadow receive mode.
   * @zh 阴影接收方式。
   */

  var ModelShadowReceivingMode = (0, _index4.Enum)({
    /**
     * @en Disable shadow projection.
     * @zh 不接收阴影。
     */
    OFF: 0,

    /**
     * @en Enable shadow projection.
     * @zh 开启阴影投射。
     */
    ON: 1
  });
  /**
   * @en model light map settings.
   * @zh 模型光照图设置
   */

  var ModelLightmapSettings = (_dec = (0, _index.ccclass)('cc.ModelLightmapSettings'), _dec2 = (0, _index.formerlySerializedAs)('_recieveShadow'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function ModelLightmapSettings() {
      _classCallCheck(this, ModelLightmapSettings);

      _initializerDefineProperty(this, "texture", _descriptor, this);

      _initializerDefineProperty(this, "uvParam", _descriptor2, this);

      _initializerDefineProperty(this, "_bakeable", _descriptor3, this);

      _initializerDefineProperty(this, "_castShadow", _descriptor4, this);

      _initializerDefineProperty(this, "_receiveShadow", _descriptor5, this);

      _initializerDefineProperty(this, "_lightmapSize", _descriptor6, this);
    }

    _createClass(ModelLightmapSettings, [{
      key: "bakeable",

      /**
       * @en bakeable.
       * @zh 是否可烘培。
       */
      get: function get() {
        return this._bakeable;
      },
      set: function set(val) {
        this._bakeable = val;
      }
      /**
       * @en cast shadow.
       * @zh 是否投射阴影。
       */

    }, {
      key: "castShadow",
      get: function get() {
        return this._castShadow;
      },
      set: function set(val) {
        this._castShadow = val;
      }
      /**
       * @en receive shadow.
       * @zh 是否接受阴影。
       */

    }, {
      key: "receiveShadow",
      get: function get() {
        return this._receiveShadow;
      },
      set: function set(val) {
        this._receiveShadow = val;
      }
      /**
       * @en lightmap size.
       * @zh 光照图大小
       */

    }, {
      key: "lightmapSize",
      get: function get() {
        return this._lightmapSize;
      },
      set: function set(val) {
        this._lightmapSize = val;
      }
    }]);

    return ModelLightmapSettings;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "texture", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "uvParam", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new _index2.Vec4();
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "_bakeable", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "_castShadow", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "_receiveShadow", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return false;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "_lightmapSize", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 64;
    }
  }), _applyDecoratedDescriptor(_class2.prototype, "bakeable", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "bakeable"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "castShadow", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "castShadow"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "receiveShadow", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "receiveShadow"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "lightmapSize", [_index.editable], Object.getOwnPropertyDescriptor(_class2.prototype, "lightmapSize"), _class2.prototype)), _class2)) || _class);
  /**
   * @en Mesh renderer component
   * @zh 网格渲染器组件。
   */

  var MeshRenderer = (_dec3 = (0, _index.ccclass)('cc.MeshRenderer'), _dec4 = (0, _index.help)('i18n:cc.MeshRenderer'), _dec5 = (0, _index.executionOrder)(100), _dec6 = (0, _index.menu)('Components/MeshRenderer'), _dec7 = (0, _index.type)(ModelShadowCastingMode), _dec8 = (0, _index.tooltip)('i18n:model.shadow_casting_model'), _dec9 = (0, _index.type)(ModelShadowReceivingMode), _dec10 = (0, _index.tooltip)('i18n:model.shadow_receiving_model'), _dec11 = (0, _index.type)(_mesh.Mesh), _dec12 = (0, _index.tooltip)('i18n:model.mesh'), _dec13 = (0, _index.visible)(function () {
    return !!(this.mesh && this.mesh.struct.morph && this.mesh.struct.morph.subMeshMorphs.some(function (subMeshMorph) {
      return !!subMeshMorph;
    }));
  }), _dec3(_class4 = _dec4(_class4 = _dec5(_class4 = _dec6(_class4 = (0, _index.executeInEditMode)(_class4 = (_class5 = (_temp2 = _class6 = /*#__PURE__*/function (_RenderableComponent) {
    _inherits(MeshRenderer, _RenderableComponent);

    _createClass(MeshRenderer, [{
      key: "shadowCastingMode",

      /**
       * @en Shadow projection mode.
       * @zh 阴影投射方式。
       */
      get: function get() {
        return this._shadowCastingMode;
      },
      set: function set(val) {
        this._shadowCastingMode = val;

        this._updateCastShadow();
      }
      /**
       * @en receive shadow.
       * @zh 是否接受阴影。
       */

    }, {
      key: "receiveShadow",
      get: function get() {
        return this._shadowReceivingMode;
      },
      set: function set(val) {
        this._shadowReceivingMode = val;

        this._updateReceiveShadow();
      }
      /**
       * @en The mesh of the model.
       * @zh 模型的网格数据。
       */

    }, {
      key: "mesh",
      get: function get() {
        return this._mesh;
      },
      set: function set(val) {
        var _this$_mesh;

        var old = this._mesh;
        this._mesh = val;
        (_this$_mesh = this._mesh) === null || _this$_mesh === void 0 ? void 0 : _this$_mesh.initialize();

        this._watchMorphInMesh();

        this._onMeshChanged(old);

        this._updateModels();

        if (this.enabledInHierarchy) {
          this._attachToScene();
        }
      }
    }, {
      key: "model",
      get: function get() {
        return this._model;
      }
    }, {
      key: "enableMorph",
      get: function get() {
        return this._enableMorph;
      },
      set: function set(value) {
        this._enableMorph = value;
      }
    }]);

    function MeshRenderer() {
      var _this;

      _classCallCheck(this, MeshRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(MeshRenderer).call(this));

      _initializerDefineProperty(_this, "lightmapSettings", _descriptor7, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_mesh", _descriptor8, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_shadowCastingMode", _descriptor9, _assertThisInitialized(_this));

      _initializerDefineProperty(_this, "_shadowReceivingMode", _descriptor10, _assertThisInitialized(_this));

      _this._modelType = void 0;
      _this._model = null;
      _this._morphInstance = null;

      _initializerDefineProperty(_this, "_enableMorph", _descriptor11, _assertThisInitialized(_this));

      _this._modelType = _index3.scene.Model;
      return _this;
    }

    _createClass(MeshRenderer, [{
      key: "onLoad",
      value: function onLoad() {
        var _this$_mesh2;

        (_this$_mesh2 = this._mesh) === null || _this$_mesh2 === void 0 ? void 0 : _this$_mesh2.initialize();

        this._watchMorphInMesh();

        this._updateModels();

        this._updateCastShadow();

        this._updateReceiveShadow();
      } // Redo, Undo, Prefab restore, etc.

    }, {
      key: "onRestore",
      value: function onRestore() {
        this._updateModels();
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (!this._model) {
          this._updateModels();
        }

        this._attachToScene();
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        if (this._model) {
          this._detachFromScene();
        }
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        if (this._model) {
          _globalExports.legacyCC.director.root.destroyModel(this._model);

          this._model = null;
          this._models.length = 0;
        }

        if (this._morphInstance) {
          this._morphInstance.destroy();
        }
      }
    }, {
      key: "setWeights",
      value: function setWeights(weights, subMeshIndex) {
        if (this._morphInstance) {
          this._morphInstance.setWeights(subMeshIndex, weights);
        }
      }
    }, {
      key: "setInstancedAttribute",
      value: function setInstancedAttribute(name, value) {
        if (!this.model) {
          return;
        }

        var list = this.model.instancedAttributes.list;

        for (var i = 0; i < list.length; i++) {
          if (list[i].name === name) {
            list[i].view.set(value);
            break;
          }
        }
      }
    }, {
      key: "_updateLightmap",
      value: function _updateLightmap(lightmap, uOff, vOff, uScale, vScale) {
        this.lightmapSettings.texture = lightmap;
        this.lightmapSettings.uvParam.x = uOff;
        this.lightmapSettings.uvParam.y = vOff;
        this.lightmapSettings.uvParam.z = uScale;
        this.lightmapSettings.uvParam.w = vScale;

        this._onUpdateLightingmap();
      }
    }, {
      key: "_updateModels",
      value: function _updateModels() {
        if (!this.enabledInHierarchy || !this._mesh) {
          return;
        }

        var model = this._model;

        if (model) {
          model.destroy();
          model.node = model.transform = this.node;
        } else {
          this._createModel();
        }

        this._updateModelParams();

        this._onUpdateLightingmap();
      }
    }, {
      key: "_createModel",
      value: function _createModel() {
        var preferMorphOverPlain = !!this._morphInstance; // Note we only change to use `MorphModel` if
        // we are required to render morph and the `this._modelType` is exactly the basic `Model`.
        // We do this since the `this._modelType` might be changed in classes derived from `Model`.
        // We shall not overwrite it.
        // Please notice that we do not enforce that
        // derived classes should use a morph-able model type(i.e. model type derived from `MorphModel`).
        // So we should take care of the edge case.

        var modelType = preferMorphOverPlain && this._modelType === _index3.scene.Model ? _index3.models.MorphModel : this._modelType;

        var model = this._model = _globalExports.legacyCC.director.root.createModel(modelType);

        model.visFlags = this.visibility;
        model.node = model.transform = this.node;
        this._models.length = 0;

        this._models.push(this._model);

        if (this._morphInstance && model instanceof _index3.models.MorphModel) {
          model.setMorphRendering(this._morphInstance);
        }
      }
    }, {
      key: "_attachToScene",
      value: function _attachToScene() {
        if (!this.node.scene || !this._model) {
          return;
        }

        var renderScene = this._getRenderScene();

        if (this._model.scene != null) {
          this._detachFromScene();
        }

        renderScene.addModel(this._model);
      }
    }, {
      key: "_detachFromScene",
      value: function _detachFromScene() {
        if (this._model && this._model.scene) {
          this._model.scene.removeModel(this._model);
        }
      }
    }, {
      key: "_updateModelParams",
      value: function _updateModelParams() {
        if (!this._mesh || !this._model) {
          return;
        }

        this.node.hasChangedFlags |= _nodeEnum.TransformBit.POSITION;
        this._model.transform.hasChangedFlags |= _nodeEnum.TransformBit.POSITION;
        this._model.isDynamicBatching = this._isBatchingEnabled();
        var meshCount = this._mesh ? this._mesh.subMeshCount : 0;
        var renderingMesh = this._mesh.renderingSubMeshes;

        if (renderingMesh) {
          for (var i = 0; i < meshCount; ++i) {
            var material = this.getRenderMaterial(i);
            var subMeshData = renderingMesh[i];

            if (subMeshData) {
              this._model.initSubModel(i, subMeshData, material || this._getBuiltinMaterial());
            }
          }
        }

        this._model.createBoundingShape(this._mesh.minPosition, this._mesh.maxPosition);

        this._model.enabled = true;
      }
    }, {
      key: "_onUpdateLightingmap",
      value: function _onUpdateLightingmap() {
        if (this.model !== null) {
          this.model.updateLightingmap(this.lightmapSettings.texture, this.lightmapSettings.uvParam);
        }

        this.setInstancedAttribute('a_lightingMapUVParam', [this.lightmapSettings.uvParam.x, this.lightmapSettings.uvParam.y, this.lightmapSettings.uvParam.z, this.lightmapSettings.uvParam.w]);
      }
    }, {
      key: "_onMaterialModified",
      value: function _onMaterialModified(idx, material) {
        if (!this._model || !this._model.inited) {
          return;
        }

        this._onRebuildPSO(idx, material || this._getBuiltinMaterial());
      }
    }, {
      key: "_onRebuildPSO",
      value: function _onRebuildPSO(idx, material) {
        if (!this._model || !this._model.inited) {
          return;
        }

        this._model.isDynamicBatching = this._isBatchingEnabled();

        this._model.setSubModelMaterial(idx, material);

        this._onUpdateLightingmap();
      }
    }, {
      key: "_onMeshChanged",
      value: function _onMeshChanged(old) {}
    }, {
      key: "_clearMaterials",
      value: function _clearMaterials() {
        if (!this._model) {
          return;
        }

        var subModels = this._model.subModels;

        for (var i = 0; i < subModels.length; ++i) {
          this._onMaterialModified(i, null);
        }
      }
    }, {
      key: "_getBuiltinMaterial",
      value: function _getBuiltinMaterial() {
        // classic ugly pink indicating missing material
        return _index5.builtinResMgr.get('missing-material');
      }
    }, {
      key: "_onVisibilityChange",
      value: function _onVisibilityChange(val) {
        if (!this._model) {
          return;
        }

        this._model.visFlags = val;
      }
    }, {
      key: "_updateCastShadow",
      value: function _updateCastShadow() {
        if (!this._model) {
          return;
        }

        if (this._shadowCastingMode === ModelShadowCastingMode.OFF) {
          this._model.castShadow = false;
        } else {
          (0, _asserts.assertIsTrue)(this._shadowCastingMode === ModelShadowCastingMode.ON, "ShadowCastingMode ".concat(this._shadowCastingMode, " is not supported."));
          this._model.castShadow = true;
        }
      }
    }, {
      key: "_updateReceiveShadow",
      value: function _updateReceiveShadow() {
        if (!this._model) {
          return;
        }

        if (this._shadowReceivingMode === ModelShadowReceivingMode.OFF) {
          this._model.receiveShadow = false;
        } else {
          this._model.receiveShadow = true;
        }
      }
    }, {
      key: "_isBatchingEnabled",
      value: function _isBatchingEnabled() {
        for (var i = 0; i < this._materials.length; ++i) {
          var mat = this._materials[i];

          if (!mat) {
            continue;
          }

          for (var p = 0; p < mat.passes.length; ++p) {
            var pass = mat.passes[p];

            if (pass.batchingScheme) {
              return true;
            }
          }
        }

        return false;
      }
    }, {
      key: "_watchMorphInMesh",
      value: function _watchMorphInMesh() {
        if (this._morphInstance) {
          this._morphInstance.destroy();

          this._morphInstance = null;
        }

        if (!this._enableMorph) {
          return;
        }

        if (!this._mesh || !this._mesh.struct.morph || !this._mesh.morphRendering) {
          return;
        }

        var morph = this._mesh.struct.morph;
        this._morphInstance = this._mesh.morphRendering.createInstance();
        var nSubMeshes = this._mesh.struct.primitives.length;

        for (var iSubMesh = 0; iSubMesh < nSubMeshes; ++iSubMesh) {
          var subMeshMorph = morph.subMeshMorphs[iSubMesh];

          if (!subMeshMorph) {
            continue;
          }

          var initialWeights = subMeshMorph.weights || morph.weights;
          var weights = initialWeights ? initialWeights.slice() : new Array(subMeshMorph.targets.length).fill(0);

          this._morphInstance.setWeights(iSubMesh, weights);
        }

        if (this._model && this._model instanceof _index3.models.MorphModel) {
          this._model.setMorphRendering(this._morphInstance);
        }
      }
    }, {
      key: "_syncMorphWeights",
      value: function _syncMorphWeights(subMeshIndex) {
        if (!this._morphInstance) {
          return;
        }

        var subMeshMorphInstance = this._morphInstance[subMeshIndex];

        if (!subMeshMorphInstance || !subMeshMorphInstance.renderResources) {
          return;
        }

        subMeshMorphInstance.renderResources.setWeights(subMeshMorphInstance.weights);
      }
    }]);

    return MeshRenderer;
  }(_renderableComponent.RenderableComponent), _class6.ShadowCastingMode = ModelShadowCastingMode, _class6.ShadowReceivingMode = ModelShadowReceivingMode, _temp2), (_descriptor7 = _applyDecoratedDescriptor(_class5.prototype, "lightmapSettings", [_index.serializable, _index.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return new ModelLightmapSettings();
    }
  }), _descriptor8 = _applyDecoratedDescriptor(_class5.prototype, "_mesh", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class5.prototype, "_shadowCastingMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ModelShadowCastingMode.OFF;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class5.prototype, "_shadowReceivingMode", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return ModelShadowReceivingMode.ON;
    }
  }), _applyDecoratedDescriptor(_class5.prototype, "shadowCastingMode", [_dec7, _dec8], Object.getOwnPropertyDescriptor(_class5.prototype, "shadowCastingMode"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "receiveShadow", [_dec9, _dec10], Object.getOwnPropertyDescriptor(_class5.prototype, "receiveShadow"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "mesh", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class5.prototype, "mesh"), _class5.prototype), _applyDecoratedDescriptor(_class5.prototype, "enableMorph", [_dec13], Object.getOwnPropertyDescriptor(_class5.prototype, "enableMorph"), _class5.prototype), _descriptor11 = _applyDecoratedDescriptor(_class5.prototype, "_enableMorph", [_index.serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return true;
    }
  })), _class5)) || _class4) || _class4) || _class4) || _class4) || _class4);
  _exports.MeshRenderer = MeshRenderer;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvM2QvZnJhbWV3b3JrL21lc2gtcmVuZGVyZXIudHMiXSwibmFtZXMiOlsiTW9kZWxTaGFkb3dDYXN0aW5nTW9kZSIsIk9GRiIsIk9OIiwiTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlIiwiTW9kZWxMaWdodG1hcFNldHRpbmdzIiwiX2Jha2VhYmxlIiwidmFsIiwiX2Nhc3RTaGFkb3ciLCJfcmVjZWl2ZVNoYWRvdyIsIl9saWdodG1hcFNpemUiLCJzZXJpYWxpemFibGUiLCJWZWM0IiwiZWRpdGFibGUiLCJNZXNoUmVuZGVyZXIiLCJNZXNoIiwibWVzaCIsInN0cnVjdCIsIm1vcnBoIiwic3ViTWVzaE1vcnBocyIsInNvbWUiLCJzdWJNZXNoTW9ycGgiLCJleGVjdXRlSW5FZGl0TW9kZSIsIl9zaGFkb3dDYXN0aW5nTW9kZSIsIl91cGRhdGVDYXN0U2hhZG93IiwiX3NoYWRvd1JlY2VpdmluZ01vZGUiLCJfdXBkYXRlUmVjZWl2ZVNoYWRvdyIsIl9tZXNoIiwib2xkIiwiaW5pdGlhbGl6ZSIsIl93YXRjaE1vcnBoSW5NZXNoIiwiX29uTWVzaENoYW5nZWQiLCJfdXBkYXRlTW9kZWxzIiwiZW5hYmxlZEluSGllcmFyY2h5IiwiX2F0dGFjaFRvU2NlbmUiLCJfbW9kZWwiLCJfZW5hYmxlTW9ycGgiLCJ2YWx1ZSIsIl9tb2RlbFR5cGUiLCJfbW9ycGhJbnN0YW5jZSIsInNjZW5lIiwiTW9kZWwiLCJfZGV0YWNoRnJvbVNjZW5lIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJkZXN0cm95TW9kZWwiLCJfbW9kZWxzIiwibGVuZ3RoIiwiZGVzdHJveSIsIndlaWdodHMiLCJzdWJNZXNoSW5kZXgiLCJzZXRXZWlnaHRzIiwibmFtZSIsIm1vZGVsIiwibGlzdCIsImluc3RhbmNlZEF0dHJpYnV0ZXMiLCJpIiwidmlldyIsInNldCIsImxpZ2h0bWFwIiwidU9mZiIsInZPZmYiLCJ1U2NhbGUiLCJ2U2NhbGUiLCJsaWdodG1hcFNldHRpbmdzIiwidGV4dHVyZSIsInV2UGFyYW0iLCJ4IiwieSIsInoiLCJ3IiwiX29uVXBkYXRlTGlnaHRpbmdtYXAiLCJub2RlIiwidHJhbnNmb3JtIiwiX2NyZWF0ZU1vZGVsIiwiX3VwZGF0ZU1vZGVsUGFyYW1zIiwicHJlZmVyTW9ycGhPdmVyUGxhaW4iLCJtb2RlbFR5cGUiLCJtb2RlbHMiLCJNb3JwaE1vZGVsIiwiY3JlYXRlTW9kZWwiLCJ2aXNGbGFncyIsInZpc2liaWxpdHkiLCJwdXNoIiwic2V0TW9ycGhSZW5kZXJpbmciLCJyZW5kZXJTY2VuZSIsIl9nZXRSZW5kZXJTY2VuZSIsImFkZE1vZGVsIiwicmVtb3ZlTW9kZWwiLCJoYXNDaGFuZ2VkRmxhZ3MiLCJUcmFuc2Zvcm1CaXQiLCJQT1NJVElPTiIsImlzRHluYW1pY0JhdGNoaW5nIiwiX2lzQmF0Y2hpbmdFbmFibGVkIiwibWVzaENvdW50Iiwic3ViTWVzaENvdW50IiwicmVuZGVyaW5nTWVzaCIsInJlbmRlcmluZ1N1Yk1lc2hlcyIsIm1hdGVyaWFsIiwiZ2V0UmVuZGVyTWF0ZXJpYWwiLCJzdWJNZXNoRGF0YSIsImluaXRTdWJNb2RlbCIsIl9nZXRCdWlsdGluTWF0ZXJpYWwiLCJjcmVhdGVCb3VuZGluZ1NoYXBlIiwibWluUG9zaXRpb24iLCJtYXhQb3NpdGlvbiIsImVuYWJsZWQiLCJ1cGRhdGVMaWdodGluZ21hcCIsInNldEluc3RhbmNlZEF0dHJpYnV0ZSIsImlkeCIsImluaXRlZCIsIl9vblJlYnVpbGRQU08iLCJzZXRTdWJNb2RlbE1hdGVyaWFsIiwic3ViTW9kZWxzIiwiX29uTWF0ZXJpYWxNb2RpZmllZCIsImJ1aWx0aW5SZXNNZ3IiLCJnZXQiLCJjYXN0U2hhZG93IiwicmVjZWl2ZVNoYWRvdyIsIl9tYXRlcmlhbHMiLCJtYXQiLCJwIiwicGFzc2VzIiwicGFzcyIsImJhdGNoaW5nU2NoZW1lIiwibW9ycGhSZW5kZXJpbmciLCJjcmVhdGVJbnN0YW5jZSIsIm5TdWJNZXNoZXMiLCJwcmltaXRpdmVzIiwiaVN1Yk1lc2giLCJpbml0aWFsV2VpZ2h0cyIsInNsaWNlIiwiQXJyYXkiLCJ0YXJnZXRzIiwiZmlsbCIsInN1Yk1lc2hNb3JwaEluc3RhbmNlIiwicmVuZGVyUmVzb3VyY2VzIiwiUmVuZGVyYWJsZUNvbXBvbmVudCIsIlNoYWRvd0Nhc3RpbmdNb2RlIiwiU2hhZG93UmVjZWl2aW5nTW9kZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRDQTs7OztBQUlBLE1BQU1BLHNCQUFzQixHQUFHLGtCQUFLO0FBQ2hDOzs7O0FBSUFDLElBQUFBLEdBQUcsRUFBRSxDQUwyQjs7QUFNaEM7Ozs7QUFJQUMsSUFBQUEsRUFBRSxFQUFFO0FBVjRCLEdBQUwsQ0FBL0I7QUFhQTs7Ozs7QUFJQSxNQUFNQyx3QkFBd0IsR0FBRyxrQkFBSztBQUNsQzs7OztBQUlBRixJQUFBQSxHQUFHLEVBQUUsQ0FMNkI7O0FBTWxDOzs7O0FBSUFDLElBQUFBLEVBQUUsRUFBRTtBQVY4QixHQUFMLENBQWpDO0FBYUE7Ozs7O01BS01FLHFCLFdBREwsb0JBQVEsMEJBQVIsQyxVQVVJLGlDQUFxQixnQkFBckIsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLRDs7OzswQkFLZ0I7QUFDWixlQUFPLEtBQUtDLFNBQVo7QUFDSCxPO3dCQUVhQyxHLEVBQUs7QUFDZixhQUFLRCxTQUFMLEdBQWlCQyxHQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBS2tCO0FBQ2QsZUFBTyxLQUFLQyxXQUFaO0FBQ0gsTzt3QkFFZUQsRyxFQUFLO0FBQ2pCLGFBQUtDLFdBQUwsR0FBbUJELEdBQW5CO0FBQ0g7QUFFRDs7Ozs7OzswQkFLcUI7QUFDakIsZUFBTyxLQUFLRSxjQUFaO0FBQ0gsTzt3QkFFa0JGLEcsRUFBSztBQUNwQixhQUFLRSxjQUFMLEdBQXNCRixHQUF0QjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBS29CO0FBQ2hCLGVBQU8sS0FBS0csYUFBWjtBQUNILE87d0JBRWlCSCxH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LE1BQXZDLEVBQStDdUYsSUFBL0MsQ0FBb0QsQ0FBcEQsQ0FGSjs7QUFHQSxlQUFLaEcsY0FBTCxDQUFvQmEsVUFBcEIsQ0FBK0I4RSxRQUEvQixFQUF5Q2hGLE9BQXpDO0FBQ0g7O0FBRUQsWUFBSSxLQUFLZixNQUFMLElBQWUsS0FBS0EsTUFBTCxZQUF1QjRDLGVBQU9DLFVBQWpELEVBQTZEO0FBQ3pELGVBQUs3QyxNQUFMLENBQVlrRCxpQkFBWixDQUE4QixLQUFLOUMsY0FBbkM7QUFDSDtBQUNKOzs7d0NBRTBCWSxZLEVBQXNCO0FBQzdDLFlBQUksQ0FBQyxLQUFLWixjQUFWLEVBQTBCO0FBQ3RCO0FBQ0g7O0FBQ0QsWUFBTWlHLG9CQUFvQixHQUFHLEtBQUtqRyxjQUFMLENBQW9CWSxZQUFwQixDQUE3Qjs7QUFDQSxZQUFJLENBQUNxRixvQkFBRCxJQUF5QixDQUFDQSxvQkFBb0IsQ0FBQ0MsZUFBbkQsRUFBb0U7QUFDaEU7QUFDSDs7QUFDREQsUUFBQUEsb0JBQW9CLENBQUNDLGVBQXJCLENBQXFDckYsVUFBckMsQ0FBZ0RvRixvQkFBb0IsQ0FBQ3RGLE9BQXJFO0FBQ0g7Ozs7SUE3VzZCd0Ysd0MsV0FFaEJDLGlCLEdBQW9CMUksc0IsVUFDcEIySSxtQixHQUFzQnhJLHdCLDZGQUVuQ08sbUIsRUFDQUUsZTs7Ozs7YUFDeUIsSUFBSVIscUJBQUosRTs7NEVBRXpCTSxtQjs7Ozs7YUFDOEIsSTs7eUZBRTlCQSxtQjs7Ozs7YUFDOEJWLHNCQUFzQixDQUFDQyxHOzs0RkFFckRTLG1COzs7OzthQUNnQ1Asd0JBQXdCLENBQUNELEU7Oyt0QkErRXpEUSxtQjs7Ozs7YUFDc0IsSSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBtb2RlbFxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFRleHR1cmUyRCB9IGZyb20gJy4uLy4uL2Fzc2V0cyc7XHJcbmltcG9ydCB7IE1hdGVyaWFsIH0gZnJvbSAnLi4vLi4vYXNzZXRzL21hdGVyaWFsJztcclxuaW1wb3J0IHsgTWVzaCB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgY2NjbGFzcywgaGVscCwgZXhlY3V0ZUluRWRpdE1vZGUsIGV4ZWN1dGlvbk9yZGVyLCBtZW51LCB0b29sdGlwLCB2aXNpYmxlLCB0eXBlLCBmb3JtZXJseVNlcmlhbGl6ZWRBcywgc2VyaWFsaXphYmxlLCBlZGl0YWJsZSB9IGZyb20gJ2NjLmRlY29yYXRvcic7XHJcbmltcG9ydCB7IFZlYzQgfSBmcm9tICcuLi8uLi9tYXRoJztcclxuaW1wb3J0IHsgc2NlbmUsIG1vZGVscyB9IGZyb20gJy4uLy4uL3JlbmRlcmVyJztcclxuaW1wb3J0IHsgUm9vdCB9IGZyb20gJy4uLy4uL3Jvb3QnO1xyXG5pbXBvcnQgeyBUcmFuc2Zvcm1CaXQgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9ub2RlLWVudW0nO1xyXG5pbXBvcnQgeyBFbnVtIH0gZnJvbSAnLi4vLi4vdmFsdWUtdHlwZXMnO1xyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vYnVpbHRpbic7XHJcbmltcG9ydCB7IFJlbmRlcmFibGVDb21wb25lbnQgfSBmcm9tICcuL3JlbmRlcmFibGUtY29tcG9uZW50JztcclxuaW1wb3J0IHsgTW9ycGhSZW5kZXJpbmdJbnN0YW5jZSB9IGZyb20gJy4uLy4uL2Fzc2V0cy9tb3JwaCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBhc3NlcnRJc1RydWUgfSBmcm9tICcuLi8uLi9kYXRhL3V0aWxzL2Fzc2VydHMnO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBTaGFkb3cgcHJvamVjdGlvbiBtb2RlLlxyXG4gKiBAemgg6Zi05b2x5oqV5bCE5pa55byP44CCXHJcbiAqL1xyXG5jb25zdCBNb2RlbFNoYWRvd0Nhc3RpbmdNb2RlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEaXNhYmxlIHNoYWRvdyBwcm9qZWN0aW9uLlxyXG4gICAgICogQHpoIOS4jeaKleWwhOmYtOW9seOAglxyXG4gICAgICovXHJcbiAgICBPRkY6IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbmFibGUgc2hhZG93IHByb2plY3Rpb24uXHJcbiAgICAgKiBAemgg5byA5ZCv6Zi05b2x5oqV5bCE44CCXHJcbiAgICAgKi9cclxuICAgIE9OOiAxLFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gU2hhZG93IHJlY2VpdmUgbW9kZS5cclxuICogQHpoIOmYtOW9seaOpeaUtuaWueW8j+OAglxyXG4gKi9cclxuY29uc3QgTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlID0gRW51bSh7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBEaXNhYmxlIHNoYWRvdyBwcm9qZWN0aW9uLlxyXG4gICAgICogQHpoIOS4jeaOpeaUtumYtOW9seOAglxyXG4gICAgICovXHJcbiAgICBPRkY6IDAsXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFbmFibGUgc2hhZG93IHByb2plY3Rpb24uXHJcbiAgICAgKiBAemgg5byA5ZCv6Zi05b2x5oqV5bCE44CCXHJcbiAgICAgKi9cclxuICAgIE9OOiAxLFxyXG59KTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gbW9kZWwgbGlnaHQgbWFwIHNldHRpbmdzLlxyXG4gKiBAemgg5qih5Z6L5YWJ54Wn5Zu+6K6+572uXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuTW9kZWxMaWdodG1hcFNldHRpbmdzJylcclxuY2xhc3MgTW9kZWxMaWdodG1hcFNldHRpbmdzIHtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHB1YmxpYyB0ZXh0dXJlOiBUZXh0dXJlMkR8bnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwdWJsaWMgdXZQYXJhbTogVmVjNCA9IG5ldyBWZWM0KCk7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2Jha2VhYmxlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2Nhc3RTaGFkb3c6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIEBmb3JtZXJseVNlcmlhbGl6ZWRBcygnX3JlY2lldmVTaGFkb3cnKVxyXG4gICAgcHJvdGVjdGVkIF9yZWNlaXZlU2hhZG93OiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX2xpZ2h0bWFwU2l6ZTogbnVtYmVyID0gNjQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYmFrZWFibGUuXHJcbiAgICAgKiBAemgg5piv5ZCm5Y+v54OY5Z+544CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGJha2VhYmxlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmFrZWFibGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGJha2VhYmxlICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9iYWtlYWJsZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBjYXN0IHNoYWRvdy5cclxuICAgICAqIEB6aCDmmK/lkKbmipXlsITpmLTlvbHjgIJcclxuICAgICAqL1xyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBnZXQgY2FzdFNoYWRvdyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nhc3RTaGFkb3c7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IGNhc3RTaGFkb3cgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX2Nhc3RTaGFkb3cgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gcmVjZWl2ZSBzaGFkb3cuXHJcbiAgICAgKiBAemgg5piv5ZCm5o6l5Y+X6Zi05b2x44CCXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IHJlY2VpdmVTaGFkb3cgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9yZWNlaXZlU2hhZG93O1xyXG4gICAgfVxyXG5cclxuICAgIHNldCByZWNlaXZlU2hhZG93ICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9yZWNlaXZlU2hhZG93ID0gdmFsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGxpZ2h0bWFwIHNpemUuXHJcbiAgICAgKiBAemgg5YWJ54Wn5Zu+5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIEBlZGl0YWJsZVxyXG4gICAgZ2V0IGxpZ2h0bWFwU2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpZ2h0bWFwU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgbGlnaHRtYXBTaXplICh2YWwpIHtcclxuICAgICAgICB0aGlzLl9saWdodG1hcFNpemUgPSB2YWw7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gTWVzaCByZW5kZXJlciBjb21wb25lbnRcclxuICogQHpoIOe9keagvOa4suafk+WZqOe7hOS7tuOAglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLk1lc2hSZW5kZXJlcicpXHJcbkBoZWxwKCdpMThuOmNjLk1lc2hSZW5kZXJlcicpXHJcbkBleGVjdXRpb25PcmRlcigxMDApXHJcbkBtZW51KCdDb21wb25lbnRzL01lc2hSZW5kZXJlcicpXHJcbkBleGVjdXRlSW5FZGl0TW9kZVxyXG5leHBvcnQgY2xhc3MgTWVzaFJlbmRlcmVyIGV4dGVuZHMgUmVuZGVyYWJsZUNvbXBvbmVudCB7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBTaGFkb3dDYXN0aW5nTW9kZSA9IE1vZGVsU2hhZG93Q2FzdGluZ01vZGU7XHJcbiAgICBwdWJsaWMgc3RhdGljIFNoYWRvd1JlY2VpdmluZ01vZGUgPSBNb2RlbFNoYWRvd1JlY2VpdmluZ01vZGU7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgbGlnaHRtYXBTZXR0aW5ncyA9IG5ldyBNb2RlbExpZ2h0bWFwU2V0dGluZ3MoKTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX21lc2g6IE1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBwcm90ZWN0ZWQgX3NoYWRvd0Nhc3RpbmdNb2RlID0gTW9kZWxTaGFkb3dDYXN0aW5nTW9kZS5PRkY7XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgcHJvdGVjdGVkIF9zaGFkb3dSZWNlaXZpbmdNb2RlID0gTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlLk9OO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFNoYWRvdyBwcm9qZWN0aW9uIG1vZGUuXHJcbiAgICAgKiBAemgg6Zi05b2x5oqV5bCE5pa55byP44CCXHJcbiAgICAgKi9cclxuICAgIEB0eXBlKE1vZGVsU2hhZG93Q2FzdGluZ01vZGUpXHJcbiAgICBAdG9vbHRpcCgnaTE4bjptb2RlbC5zaGFkb3dfY2FzdGluZ19tb2RlbCcpXHJcbiAgICBnZXQgc2hhZG93Q2FzdGluZ01vZGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFkb3dDYXN0aW5nTW9kZTtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgc2hhZG93Q2FzdGluZ01vZGUgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3NoYWRvd0Nhc3RpbmdNb2RlID0gdmFsO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RTaGFkb3coKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiByZWNlaXZlIHNoYWRvdy5cclxuICAgICAqIEB6aCDmmK/lkKbmjqXlj5fpmLTlvbHjgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlKVxyXG4gICAgQHRvb2x0aXAoJ2kxOG46bW9kZWwuc2hhZG93X3JlY2VpdmluZ19tb2RlbCcpXHJcbiAgICBnZXQgcmVjZWl2ZVNoYWRvdyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYWRvd1JlY2VpdmluZ01vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0IHJlY2VpdmVTaGFkb3cgKHZhbCkge1xyXG4gICAgICAgIHRoaXMuX3NoYWRvd1JlY2VpdmluZ01vZGUgPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUmVjZWl2ZVNoYWRvdygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBtZXNoIG9mIHRoZSBtb2RlbC5cclxuICAgICAqIEB6aCDmqKHlnovnmoTnvZHmoLzmlbDmja7jgIJcclxuICAgICAqL1xyXG4gICAgQHR5cGUoTWVzaClcclxuICAgIEB0b29sdGlwKCdpMThuOm1vZGVsLm1lc2gnKVxyXG4gICAgZ2V0IG1lc2ggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tZXNoO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBtZXNoICh2YWwpIHtcclxuICAgICAgICBjb25zdCBvbGQgPSB0aGlzLl9tZXNoO1xyXG4gICAgICAgIHRoaXMuX21lc2ggPSB2YWw7XHJcbiAgICAgICAgdGhpcy5fbWVzaD8uaW5pdGlhbGl6ZSgpO1xyXG4gICAgICAgIHRoaXMuX3dhdGNoTW9ycGhJbk1lc2goKTtcclxuICAgICAgICB0aGlzLl9vbk1lc2hDaGFuZ2VkKG9sZCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9kZWxzKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuZW5hYmxlZEluSGllcmFyY2h5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2F0dGFjaFRvU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG1vZGVsICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgQHZpc2libGUoZnVuY3Rpb24gKHRoaXM6IE1lc2hSZW5kZXJlcikge1xyXG4gICAgICAgIHJldHVybiAhIShcclxuICAgICAgICAgICAgdGhpcy5tZXNoICYmXHJcbiAgICAgICAgICAgIHRoaXMubWVzaC5zdHJ1Y3QubW9ycGggJiZcclxuICAgICAgICAgICAgdGhpcy5tZXNoLnN0cnVjdC5tb3JwaC5zdWJNZXNoTW9ycGhzLnNvbWUoKHN1Yk1lc2hNb3JwaCkgPT4gISFzdWJNZXNoTW9ycGgpXHJcbiAgICAgICAgKTtcclxuICAgIH0pXHJcbiAgICBnZXQgZW5hYmxlTW9ycGggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lbmFibGVNb3JwaDtcclxuICAgIH1cclxuXHJcbiAgICBzZXQgZW5hYmxlTW9ycGggKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fZW5hYmxlTW9ycGggPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX21vZGVsVHlwZTogdHlwZW9mIHNjZW5lLk1vZGVsO1xyXG5cclxuICAgIHByb3RlY3RlZCBfbW9kZWw6IHNjZW5lLk1vZGVsIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBfbW9ycGhJbnN0YW5jZTogTW9ycGhSZW5kZXJpbmdJbnN0YW5jZSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIHByaXZhdGUgX2VuYWJsZU1vcnBoID0gdHJ1ZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLl9tb2RlbFR5cGUgPSBzY2VuZS5Nb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLl9tZXNoPy5pbml0aWFsaXplKCk7XHJcbiAgICAgICAgdGhpcy5fd2F0Y2hNb3JwaEluTWVzaCgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVscygpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUNhc3RTaGFkb3coKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVSZWNlaXZlU2hhZG93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVkbywgVW5kbywgUHJlZmFiIHJlc3RvcmUsIGV0Yy5cclxuICAgIHB1YmxpYyBvblJlc3RvcmUgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZU1vZGVscygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkVuYWJsZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNb2RlbHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fYXR0YWNoVG9TY2VuZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkRpc2FibGUgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRGVzdHJveSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuZGVzdHJveU1vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbHMubGVuZ3RoID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuX21vcnBoSW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9ycGhJbnN0YW5jZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRXZWlnaHRzICh3ZWlnaHRzOiBudW1iZXJbXSwgc3ViTWVzaEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fbW9ycGhJbnN0YW5jZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb3JwaEluc3RhbmNlLnNldFdlaWdodHMoc3ViTWVzaEluZGV4LCB3ZWlnaHRzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEluc3RhbmNlZEF0dHJpYnV0ZSAobmFtZTogc3RyaW5nLCB2YWx1ZTogQXJyYXlMaWtlPG51bWJlcj4pIHtcclxuICAgICAgICBpZiAoIXRoaXMubW9kZWwpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMubW9kZWwuaW5zdGFuY2VkQXR0cmlidXRlcy5saXN0O1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAobGlzdFtpXS52aWV3IGFzIFR5cGVkQXJyYXkpLnNldCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3VwZGF0ZUxpZ2h0bWFwIChsaWdodG1hcDogVGV4dHVyZTJEfG51bGwsIHVPZmY6IG51bWJlciwgdk9mZjogbnVtYmVyLCB1U2NhbGU6IG51bWJlciwgdlNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudGV4dHVyZSA9IGxpZ2h0bWFwO1xyXG4gICAgICAgIHRoaXMubGlnaHRtYXBTZXR0aW5ncy51dlBhcmFtLnggPSB1T2ZmO1xyXG4gICAgICAgIHRoaXMubGlnaHRtYXBTZXR0aW5ncy51dlBhcmFtLnkgPSB2T2ZmO1xyXG4gICAgICAgIHRoaXMubGlnaHRtYXBTZXR0aW5ncy51dlBhcmFtLnogPSB1U2NhbGU7XHJcbiAgICAgICAgdGhpcy5saWdodG1hcFNldHRpbmdzLnV2UGFyYW0udyA9IHZTY2FsZTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25VcGRhdGVMaWdodGluZ21hcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlTW9kZWxzICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuZW5hYmxlZEluSGllcmFyY2h5IHx8ICF0aGlzLl9tZXNoKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5fbW9kZWw7XHJcbiAgICAgICAgaWYgKG1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgbW9kZWwubm9kZSA9IG1vZGVsLnRyYW5zZm9ybSA9IHRoaXMubm9kZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9jcmVhdGVNb2RlbCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTW9kZWxQYXJhbXMoKTtcclxuICAgICAgICB0aGlzLl9vblVwZGF0ZUxpZ2h0aW5nbWFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jcmVhdGVNb2RlbCAoKSB7XHJcbiAgICAgICAgY29uc3QgcHJlZmVyTW9ycGhPdmVyUGxhaW4gPSAhIXRoaXMuX21vcnBoSW5zdGFuY2U7XHJcbiAgICAgICAgLy8gTm90ZSB3ZSBvbmx5IGNoYW5nZSB0byB1c2UgYE1vcnBoTW9kZWxgIGlmXHJcbiAgICAgICAgLy8gd2UgYXJlIHJlcXVpcmVkIHRvIHJlbmRlciBtb3JwaCBhbmQgdGhlIGB0aGlzLl9tb2RlbFR5cGVgIGlzIGV4YWN0bHkgdGhlIGJhc2ljIGBNb2RlbGAuXHJcbiAgICAgICAgLy8gV2UgZG8gdGhpcyBzaW5jZSB0aGUgYHRoaXMuX21vZGVsVHlwZWAgbWlnaHQgYmUgY2hhbmdlZCBpbiBjbGFzc2VzIGRlcml2ZWQgZnJvbSBgTW9kZWxgLlxyXG4gICAgICAgIC8vIFdlIHNoYWxsIG5vdCBvdmVyd3JpdGUgaXQuXHJcbiAgICAgICAgLy8gUGxlYXNlIG5vdGljZSB0aGF0IHdlIGRvIG5vdCBlbmZvcmNlIHRoYXRcclxuICAgICAgICAvLyBkZXJpdmVkIGNsYXNzZXMgc2hvdWxkIHVzZSBhIG1vcnBoLWFibGUgbW9kZWwgdHlwZShpLmUuIG1vZGVsIHR5cGUgZGVyaXZlZCBmcm9tIGBNb3JwaE1vZGVsYCkuXHJcbiAgICAgICAgLy8gU28gd2Ugc2hvdWxkIHRha2UgY2FyZSBvZiB0aGUgZWRnZSBjYXNlLlxyXG4gICAgICAgIGNvbnN0IG1vZGVsVHlwZSA9IChwcmVmZXJNb3JwaE92ZXJQbGFpbiAmJiB0aGlzLl9tb2RlbFR5cGUgPT09IHNjZW5lLk1vZGVsKSA/IG1vZGVscy5Nb3JwaE1vZGVsIDogdGhpcy5fbW9kZWxUeXBlO1xyXG4gICAgICAgIGNvbnN0IG1vZGVsID0gdGhpcy5fbW9kZWwhID0gKGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QgYXMgUm9vdCkuY3JlYXRlTW9kZWwobW9kZWxUeXBlKTtcclxuICAgICAgICBtb2RlbC52aXNGbGFncyA9IHRoaXMudmlzaWJpbGl0eTtcclxuICAgICAgICBtb2RlbC5ub2RlID0gbW9kZWwudHJhbnNmb3JtID0gdGhpcy5ub2RlO1xyXG4gICAgICAgIHRoaXMuX21vZGVscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX21vZGVscy5wdXNoKHRoaXMuX21vZGVsKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9ycGhJbnN0YW5jZSAmJiBtb2RlbCBpbnN0YW5jZW9mIG1vZGVscy5Nb3JwaE1vZGVsKSB7XHJcbiAgICAgICAgICAgIG1vZGVsLnNldE1vcnBoUmVuZGVyaW5nKHRoaXMuX21vcnBoSW5zdGFuY2UpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2F0dGFjaFRvU2NlbmUgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5ub2RlLnNjZW5lIHx8ICF0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlbmRlclNjZW5lID0gdGhpcy5fZ2V0UmVuZGVyU2NlbmUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwuc2NlbmUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVuZGVyU2NlbmUuYWRkTW9kZWwodGhpcy5fbW9kZWwpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfZGV0YWNoRnJvbVNjZW5lICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwgJiYgdGhpcy5fbW9kZWwuc2NlbmUpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2NlbmUucmVtb3ZlTW9kZWwodGhpcy5fbW9kZWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX3VwZGF0ZU1vZGVsUGFyYW1zICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX21lc2ggfHwgIXRoaXMuX21vZGVsKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMubm9kZS5oYXNDaGFuZ2VkRmxhZ3MgfD0gVHJhbnNmb3JtQml0LlBPU0lUSU9OO1xyXG4gICAgICAgIHRoaXMuX21vZGVsLnRyYW5zZm9ybS5oYXNDaGFuZ2VkRmxhZ3MgfD0gVHJhbnNmb3JtQml0LlBPU0lUSU9OO1xyXG4gICAgICAgIHRoaXMuX21vZGVsLmlzRHluYW1pY0JhdGNoaW5nID0gdGhpcy5faXNCYXRjaGluZ0VuYWJsZWQoKTtcclxuICAgICAgICBjb25zdCBtZXNoQ291bnQgPSB0aGlzLl9tZXNoID8gdGhpcy5fbWVzaC5zdWJNZXNoQ291bnQgOiAwO1xyXG4gICAgICAgIGNvbnN0IHJlbmRlcmluZ01lc2ggPSB0aGlzLl9tZXNoLnJlbmRlcmluZ1N1Yk1lc2hlcztcclxuICAgICAgICBpZiAocmVuZGVyaW5nTWVzaCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1lc2hDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBtYXRlcmlhbCA9IHRoaXMuZ2V0UmVuZGVyTWF0ZXJpYWwoaSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNZXNoRGF0YSA9IHJlbmRlcmluZ01lc2hbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoc3ViTWVzaERhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9tb2RlbC5pbml0U3ViTW9kZWwoaSwgc3ViTWVzaERhdGEsIG1hdGVyaWFsIHx8IHRoaXMuX2dldEJ1aWx0aW5NYXRlcmlhbCgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9tb2RlbC5jcmVhdGVCb3VuZGluZ1NoYXBlKHRoaXMuX21lc2gubWluUG9zaXRpb24sIHRoaXMuX21lc2gubWF4UG9zaXRpb24pO1xyXG4gICAgICAgIHRoaXMuX21vZGVsLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25VcGRhdGVMaWdodGluZ21hcCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMubW9kZWwgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5tb2RlbC51cGRhdGVMaWdodGluZ21hcCh0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudGV4dHVyZSwgdGhpcy5saWdodG1hcFNldHRpbmdzLnV2UGFyYW0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRJbnN0YW5jZWRBdHRyaWJ1dGUoJ2FfbGlnaHRpbmdNYXBVVlBhcmFtJywgW1xyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudXZQYXJhbS54LFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudXZQYXJhbS55LFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudXZQYXJhbS56LFxyXG4gICAgICAgICAgICB0aGlzLmxpZ2h0bWFwU2V0dGluZ3MudXZQYXJhbS53XSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbk1hdGVyaWFsTW9kaWZpZWQgKGlkeDogbnVtYmVyLCBtYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCB8fCAhdGhpcy5fbW9kZWwuaW5pdGVkKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHRoaXMuX29uUmVidWlsZFBTTyhpZHgsIG1hdGVyaWFsIHx8IHRoaXMuX2dldEJ1aWx0aW5NYXRlcmlhbCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uUmVidWlsZFBTTyAoaWR4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwgfHwgIXRoaXMuX21vZGVsLmluaXRlZCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9tb2RlbC5pc0R5bmFtaWNCYXRjaGluZyA9IHRoaXMuX2lzQmF0Y2hpbmdFbmFibGVkKCk7XHJcbiAgICAgICAgdGhpcy5fbW9kZWwuc2V0U3ViTW9kZWxNYXRlcmlhbChpZHgsIG1hdGVyaWFsKTtcclxuICAgICAgICB0aGlzLl9vblVwZGF0ZUxpZ2h0aW5nbWFwKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9vbk1lc2hDaGFuZ2VkIChvbGQ6IE1lc2ggfCBudWxsKSB7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF9jbGVhck1hdGVyaWFscyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkgeyByZXR1cm47IH1cclxuICAgICAgICBjb25zdCBzdWJNb2RlbHMgPSB0aGlzLl9tb2RlbC5zdWJNb2RlbHM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5fb25NYXRlcmlhbE1vZGlmaWVkKGksIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2dldEJ1aWx0aW5NYXRlcmlhbCAoKSB7XHJcbiAgICAgICAgLy8gY2xhc3NpYyB1Z2x5IHBpbmsgaW5kaWNhdGluZyBtaXNzaW5nIG1hdGVyaWFsXHJcbiAgICAgICAgcmV0dXJuIGJ1aWx0aW5SZXNNZ3IuZ2V0PE1hdGVyaWFsPignbWlzc2luZy1tYXRlcmlhbCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfb25WaXNpYmlsaXR5Q2hhbmdlICh2YWw6IG51bWJlcikge1xyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWwpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fbW9kZWwudmlzRmxhZ3MgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIF91cGRhdGVDYXN0U2hhZG93ICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX21vZGVsKSB7IHJldHVybjsgfVxyXG4gICAgICAgIGlmICh0aGlzLl9zaGFkb3dDYXN0aW5nTW9kZSA9PT0gTW9kZWxTaGFkb3dDYXN0aW5nTW9kZS5PRkYpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2FzdFNoYWRvdyA9IGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFzc2VydElzVHJ1ZShcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NoYWRvd0Nhc3RpbmdNb2RlID09PSBNb2RlbFNoYWRvd0Nhc3RpbmdNb2RlLk9OLFxyXG4gICAgICAgICAgICAgICAgYFNoYWRvd0Nhc3RpbmdNb2RlICR7dGhpcy5fc2hhZG93Q2FzdGluZ01vZGV9IGlzIG5vdCBzdXBwb3J0ZWQuYCxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuY2FzdFNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfdXBkYXRlUmVjZWl2ZVNoYWRvdyAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb2RlbCkgeyByZXR1cm47IH1cclxuICAgICAgICBpZiAodGhpcy5fc2hhZG93UmVjZWl2aW5nTW9kZSA9PT0gTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlLk9GRikge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwucmVjZWl2ZVNoYWRvdyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBfaXNCYXRjaGluZ0VuYWJsZWQgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWF0ZXJpYWxzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdCA9IHRoaXMuX21hdGVyaWFsc1tpXTtcclxuICAgICAgICAgICAgaWYgKCFtYXQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgZm9yIChsZXQgcCA9IDA7IHAgPCBtYXQucGFzc2VzLmxlbmd0aDsgKytwKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwYXNzID0gbWF0LnBhc3Nlc1twXTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXNzLmJhdGNoaW5nU2NoZW1lKSB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3dhdGNoTW9ycGhJbk1lc2ggKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb3JwaEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vcnBoSW5zdGFuY2UuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICB0aGlzLl9tb3JwaEluc3RhbmNlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fZW5hYmxlTW9ycGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLl9tZXNoIHx8XHJcbiAgICAgICAgICAgICF0aGlzLl9tZXNoLnN0cnVjdC5tb3JwaCB8fFxyXG4gICAgICAgICAgICAhdGhpcy5fbWVzaC5tb3JwaFJlbmRlcmluZykge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB7IG1vcnBoIH0gPSB0aGlzLl9tZXNoLnN0cnVjdDtcclxuICAgICAgICB0aGlzLl9tb3JwaEluc3RhbmNlID0gdGhpcy5fbWVzaC5tb3JwaFJlbmRlcmluZy5jcmVhdGVJbnN0YW5jZSgpO1xyXG4gICAgICAgIGNvbnN0IG5TdWJNZXNoZXMgPSB0aGlzLl9tZXNoLnN0cnVjdC5wcmltaXRpdmVzLmxlbmd0aDtcclxuICAgICAgICBmb3IgKGxldCBpU3ViTWVzaCA9IDA7IGlTdWJNZXNoIDwgblN1Yk1lc2hlczsgKytpU3ViTWVzaCkge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNZXNoTW9ycGggPSBtb3JwaC5zdWJNZXNoTW9ycGhzW2lTdWJNZXNoXTtcclxuICAgICAgICAgICAgaWYgKCFzdWJNZXNoTW9ycGgpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGluaXRpYWxXZWlnaHRzID0gc3ViTWVzaE1vcnBoLndlaWdodHMgfHwgbW9ycGgud2VpZ2h0cztcclxuICAgICAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IGluaXRpYWxXZWlnaHRzID9cclxuICAgICAgICAgICAgICAgIGluaXRpYWxXZWlnaHRzLnNsaWNlKCkgOlxyXG4gICAgICAgICAgICAgICAgbmV3IEFycmF5PG51bWJlcj4oc3ViTWVzaE1vcnBoLnRhcmdldHMubGVuZ3RoKS5maWxsKDApO1xyXG4gICAgICAgICAgICB0aGlzLl9tb3JwaEluc3RhbmNlLnNldFdlaWdodHMoaVN1Yk1lc2gsIHdlaWdodHMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX21vZGVsICYmIHRoaXMuX21vZGVsIGluc3RhbmNlb2YgbW9kZWxzLk1vcnBoTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbW9kZWwuc2V0TW9ycGhSZW5kZXJpbmcodGhpcy5fbW9ycGhJbnN0YW5jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3N5bmNNb3JwaFdlaWdodHMgKHN1Yk1lc2hJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9tb3JwaEluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc3ViTWVzaE1vcnBoSW5zdGFuY2UgPSB0aGlzLl9tb3JwaEluc3RhbmNlW3N1Yk1lc2hJbmRleF07XHJcbiAgICAgICAgaWYgKCFzdWJNZXNoTW9ycGhJbnN0YW5jZSB8fCAhc3ViTWVzaE1vcnBoSW5zdGFuY2UucmVuZGVyUmVzb3VyY2VzKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc3ViTWVzaE1vcnBoSW5zdGFuY2UucmVuZGVyUmVzb3VyY2VzLnNldFdlaWdodHMoc3ViTWVzaE1vcnBoSW5zdGFuY2Uud2VpZ2h0cyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWNsYXJlIG5hbWVzcGFjZSBNZXNoUmVuZGVyZXIge1xyXG4gICAgZXhwb3J0IHR5cGUgU2hhZG93Q2FzdGluZ01vZGUgPSBFbnVtQWxpYXM8dHlwZW9mIE1vZGVsU2hhZG93Q2FzdGluZ01vZGU+O1xyXG4gICAgZXhwb3J0IHR5cGUgU2hhZG93UmVjZWl2aW5nTW9kZSA9IEVudW1BbGlhczx0eXBlb2YgTW9kZWxTaGFkb3dSZWNlaXZpbmdNb2RlPjtcclxufVxyXG4iXX0=