(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../core/3d/builtin/index.js", "../core/3d/framework/renderable-component.js", "../core/assets/index.js", "../core/assets/asset-enum.js", "../core/assets/material.js", "../core/assets/mesh.js", "../core/components/index.js", "../core/data/decorators/index.js", "../core/data/object.js", "../core/director.js", "../core/gfx/buffer.js", "../core/gfx/define.js", "../core/gfx/input-assembler.js", "../core/math/index.js", "../core/renderer/index.js", "../core/scene-graph/private-node.js", "../core/global-exports.js", "./terrain-asset.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../core/3d/builtin/index.js"), require("../core/3d/framework/renderable-component.js"), require("../core/assets/index.js"), require("../core/assets/asset-enum.js"), require("../core/assets/material.js"), require("../core/assets/mesh.js"), require("../core/components/index.js"), require("../core/data/decorators/index.js"), require("../core/data/object.js"), require("../core/director.js"), require("../core/gfx/buffer.js"), require("../core/gfx/define.js"), require("../core/gfx/input-assembler.js"), require("../core/math/index.js"), require("../core/renderer/index.js"), require("../core/scene-graph/private-node.js"), require("../core/global-exports.js"), require("./terrain-asset.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.renderableComponent, global.index, global.assetEnum, global.material, global.mesh, global.index, global.index, global.object, global.director, global.buffer, global.define, global.inputAssembler, global.index, global.index, global.privateNode, global.globalExports, global.terrainAsset);
    global.terrain = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _renderableComponent, _index2, _assetEnum, _material, _mesh, _index3, _index4, _object, _director, _buffer, _define, _inputAssembler, _index5, _index6, _privateNode, _globalExports, _terrainAsset) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Terrain = _exports.TerrainBlock = _exports.TerrainBlockLightmapInfo = _exports.TerrainBlockInfo = _exports.TerrainLayer = _exports.TerrainInfo = void 0;

  var _dec, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp, _dec2, _class4, _class5, _descriptor5, _descriptor6, _temp2, _dec3, _class7, _class8, _descriptor7, _temp3, _dec4, _class10, _class11, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _temp4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _class13, _class14, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _temp5;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

  /**
   * @en Terrain info
   * @zh 地形信息
   */
  var TerrainInfo = (_dec = (0, _index4.ccclass)('cc.TerrainInfo'), _dec(_class = (_class2 = (_temp = /*#__PURE__*/function () {
    function TerrainInfo() {
      _classCallCheck(this, TerrainInfo);

      _initializerDefineProperty(this, "tileSize", _descriptor, this);

      _initializerDefineProperty(this, "blockCount", _descriptor2, this);

      _initializerDefineProperty(this, "weightMapSize", _descriptor3, this);

      _initializerDefineProperty(this, "lightMapSize", _descriptor4, this);
    }

    _createClass(TerrainInfo, [{
      key: "size",

      /**
       * @en terrain size
       * @zh 地形大小
       */
      get: function get() {
        var sz = new _index5.Size(0, 0);
        sz.width = this.blockCount[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        sz.height = this.blockCount[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        return sz;
      }
      /**
       * @en tile count
       * @zh 栅格数量
       */

    }, {
      key: "tileCount",
      get: function get() {
        var _tileCount = [0, 0];
        _tileCount[0] = this.blockCount[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        _tileCount[1] = this.blockCount[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        return _tileCount;
      }
      /**
       * @en vertex count
       * @zh 顶点数量
       */

    }, {
      key: "vertexCount",
      get: function get() {
        var _vertexCount = this.tileCount;
        _vertexCount[0] += 1;
        _vertexCount[1] += 1;
        return _vertexCount;
      }
    }]);

    return TerrainInfo;
  }(), _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "tileSize", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "blockCount", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [1, 1];
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "weightMapSize", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 128;
    }
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "lightMapSize", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 128;
    }
  })), _class2)) || _class);
  /**
   * @en Terrain layer
   * @zh 地形纹理层
   */

  _exports.TerrainInfo = TerrainInfo;
  var TerrainLayer = (_dec2 = (0, _index4.ccclass)('cc.TerrainLayer'), _dec2(_class4 = (_class5 = (_temp2 = function TerrainLayer() {
    _classCallCheck(this, TerrainLayer);

    _initializerDefineProperty(this, "detailMap", _descriptor5, this);

    _initializerDefineProperty(this, "tileSize", _descriptor6, this);
  }, _temp2), (_descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "detailMap", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor6 = _applyDecoratedDescriptor(_class5.prototype, "tileSize", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 1;
    }
  })), _class5)) || _class4);
  /**
   * @en Terrain renderable
   * @zh 地形渲染组件
   */

  _exports.TerrainLayer = TerrainLayer;

  var TerrainRenderable = /*#__PURE__*/function (_RenderableComponent) {
    _inherits(TerrainRenderable, _RenderableComponent);

    function TerrainRenderable() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, TerrainRenderable);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TerrainRenderable)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this._model = null;
      _this._meshData = null;
      _this._brushMaterial = null;
      _this._currentMaterial = null;
      _this._currentMaterialLayers = 0;
      return _this;
    }

    _createClass(TerrainRenderable, [{
      key: "destroy",
      value: function destroy() {
        // this._invalidMaterial();
        if (this._model != null) {
          _globalExports.legacyCC.director.root.destroyModel(this._model);

          this._model = null;
        }

        return _get(_getPrototypeOf(TerrainRenderable.prototype), "destroy", this).call(this);
      }
    }, {
      key: "_invalidMaterial",
      value: function _invalidMaterial() {
        if (this._currentMaterial == null) {
          return;
        }

        this._clearMaterials();

        this._currentMaterial = null;

        if (this._model != null) {
          this._model.enabled = false;
        }
      }
    }, {
      key: "_updateMaterial",
      value: function _updateMaterial(block, init) {
        if (this._meshData == null || this._model == null) {
          return;
        }

        var nLayers = block.getMaxLayer();

        if (this._currentMaterial == null || nLayers !== this._currentMaterialLayers) {
          this._currentMaterial = new _material.Material();

          this._currentMaterial.initialize({
            effectAsset: block.getTerrain().getEffectAsset(),
            defines: block._getMaterialDefines(nLayers)
          });

          if (this._brushMaterial !== null) {
            var passes = this._currentMaterial.passes;
            passes.push(this._brushMaterial.passes[0]);
          }

          if (init) {
            this._model.initSubModel(0, this._meshData, this._currentMaterial);
          }

          this.setMaterial(this._currentMaterial, 0);
          this._currentMaterialLayers = nLayers;
          this._model.enabled = true;
        }
      }
    }, {
      key: "_onMaterialModified",
      value: function _onMaterialModified(idx, mtl) {
        if (this._model == null) {
          return;
        }

        this._onRebuildPSO(idx, mtl || this._getBuiltinMaterial());
      }
    }, {
      key: "_onRebuildPSO",
      value: function _onRebuildPSO(idx, material) {
        if (this._model) {
          this._model.setSubModelMaterial(idx, material);
        }
      }
    }, {
      key: "_clearMaterials",
      value: function _clearMaterials() {
        if (this._model == null) {
          return;
        }

        this._onMaterialModified(0, null);
      }
    }, {
      key: "_getBuiltinMaterial",
      value: function _getBuiltinMaterial() {
        return _index.builtinResMgr.get('missing-material');
      }
    }]);

    return TerrainRenderable;
  }(_renderableComponent.RenderableComponent);
  /**
   * @en Terrain block info
   * @zh 地形块信息
   */


  var TerrainBlockInfo = (_dec3 = (0, _index4.ccclass)('cc.TerrainBlockInfo'), _dec3(_class7 = (_class8 = (_temp3 = function TerrainBlockInfo() {
    _classCallCheck(this, TerrainBlockInfo);

    _initializerDefineProperty(this, "layers", _descriptor7, this);
  }, _temp3), (_descriptor7 = _applyDecoratedDescriptor(_class8.prototype, "layers", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [-1, -1, -1, -1];
    }
  })), _class8)) || _class7);
  /**
   * @en Terrain block light map info
   * @zh 地形块光照图信息
   */

  _exports.TerrainBlockInfo = TerrainBlockInfo;
  var TerrainBlockLightmapInfo = (_dec4 = (0, _index4.ccclass)('cc.TerrainBlockLightmapInfo'), _dec4(_class10 = (_class11 = (_temp4 = function TerrainBlockLightmapInfo() {
    _classCallCheck(this, TerrainBlockLightmapInfo);

    _initializerDefineProperty(this, "texture", _descriptor8, this);

    _initializerDefineProperty(this, "UOff", _descriptor9, this);

    _initializerDefineProperty(this, "VOff", _descriptor10, this);

    _initializerDefineProperty(this, "UScale", _descriptor11, this);

    _initializerDefineProperty(this, "VScale", _descriptor12, this);
  }, _temp4), (_descriptor8 = _applyDecoratedDescriptor(_class11.prototype, "texture", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor9 = _applyDecoratedDescriptor(_class11.prototype, "UOff", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor10 = _applyDecoratedDescriptor(_class11.prototype, "VOff", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor11 = _applyDecoratedDescriptor(_class11.prototype, "UScale", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  }), _descriptor12 = _applyDecoratedDescriptor(_class11.prototype, "VScale", [_index4.serializable, _index4.editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return 0;
    }
  })), _class11)) || _class10);
  /**
   * @en Terrain block
   * @zh 地形块
   */

  _exports.TerrainBlockLightmapInfo = TerrainBlockLightmapInfo;

  var TerrainBlock = /*#__PURE__*/function () {
    // private _neighbor: TerrainBlock|null[] = [null, null, null, null];
    function TerrainBlock(t, i, j) {
      _classCallCheck(this, TerrainBlock);

      this._terrain = void 0;
      this._info = void 0;
      this._node = void 0;
      this._renderable = void 0;
      this._index = [1, 1];
      this._weightMap = null;
      this._lightmapInfo = null;
      this._terrain = t;
      this._info = t.getBlockInfo(i, j);
      this._index[0] = i;
      this._index[1] = j;
      this._lightmapInfo = t._getLightmapInfo(i, j);
      this._node = new _privateNode.PrivateNode(''); // @ts-ignore

      this._node.setParent(this._terrain.node); // @ts-ignore


      this._node._objFlags |= _globalExports.legacyCC.Object.Flags.DontSave;
      this._renderable = this._node.addComponent(TerrainRenderable);
    }

    _createClass(TerrainBlock, [{
      key: "build",
      value: function build() {
        var gfxDevice = _director.director.root.device; // vertex buffer

        var vertexData = new Float32Array(_terrainAsset.TERRAIN_BLOCK_VERTEX_SIZE * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY);
        var index = 0;

        for (var j = 0; j < _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
          for (var i = 0; i < _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
            var x = this._index[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY + i;
            var y = this._index[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY + j;

            var position = this._terrain.getPosition(x, y);

            var normal = this._terrain.getNormal(x, y);

            var uv = new _index5.Vec2(i / _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY, j / _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY);
            vertexData[index++] = position.x;
            vertexData[index++] = position.y;
            vertexData[index++] = position.z;
            vertexData[index++] = normal.x;
            vertexData[index++] = normal.y;
            vertexData[index++] = normal.z;
            vertexData[index++] = uv.x;
            vertexData[index++] = uv.y;
          }
        }

        var vertexBuffer = gfxDevice.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.VERTEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, _terrainAsset.TERRAIN_BLOCK_VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY, _terrainAsset.TERRAIN_BLOCK_VERTEX_SIZE * Float32Array.BYTES_PER_ELEMENT));
        vertexBuffer.update(vertexData); // initialize renderable

        var gfxAttributes = [new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_POSITION, _define.GFXFormat.RGB32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_NORMAL, _define.GFXFormat.RGB32F), new _inputAssembler.GFXAttribute(_define.GFXAttributeName.ATTR_TEX_COORD, _define.GFXFormat.RG32F)];
        this._renderable._meshData = new _mesh.RenderingSubMesh([vertexBuffer], gfxAttributes, _define.GFXPrimitiveMode.TRIANGLE_LIST, this._terrain._getSharedIndexBuffer());

        var model = this._renderable._model = _globalExports.legacyCC.director.root.createModel(_index6.scene.Model);

        model.node = model.transform = this._node;

        this._renderable._getRenderScene().addModel(model); // reset weightmap


        this._updateWeightMap(); // reset material


        this._updateMaterial(true);
      }
    }, {
      key: "rebuild",
      value: function rebuild() {
        this._updateHeight();

        this._updateWeightMap();

        this._renderable._invalidMaterial();

        this._updateMaterial(false);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        if (this._renderable != null) {
          this._renderable.destroy();
        }

        if (this._node != null) {
          this._node.destroy();
        }

        if (this._weightMap != null) {
          this._weightMap.destroy();
        }
      }
    }, {
      key: "update",
      value: function update() {
        this._updateMaterial(false);

        var mtl = this._renderable._currentMaterial;

        if (mtl != null) {
          var nlayers = this.getMaxLayer();
          var uvScale = new _index5.Vec4(1, 1, 1, 1);

          if (nlayers === 0) {
            if (this.layers[0] !== -1) {
              var l0 = this._terrain.getLayer(this.layers[0]);

              if (l0 != null) {
                uvScale.x = 1.0 / l0.tileSize;
              }

              mtl.setProperty('detailMap0', l0 != null ? l0.detailMap : null);
            } else {
              mtl.setProperty('detailMap0', _globalExports.legacyCC.builtinResMgr.get('default-texture'));
            }
          } else if (nlayers === 1) {
            var _l = this._terrain.getLayer(this.layers[0]);

            var l1 = this._terrain.getLayer(this.layers[1]);

            if (_l != null) {
              uvScale.x = 1.0 / _l.tileSize;
            }

            if (l1 != null) {
              uvScale.y = 1.0 / l1.tileSize;
            }

            mtl.setProperty('weightMap', this._weightMap);
            mtl.setProperty('detailMap0', _l != null ? _l.detailMap : null);
            mtl.setProperty('detailMap1', l1 != null ? l1.detailMap : null);
          } else if (nlayers === 2) {
            var _l2 = this._terrain.getLayer(this.layers[0]);

            var _l3 = this._terrain.getLayer(this.layers[1]);

            var l2 = this._terrain.getLayer(this.layers[2]);

            if (_l2 != null) {
              uvScale.x = 1.0 / _l2.tileSize;
            }

            if (_l3 != null) {
              uvScale.y = 1.0 / _l3.tileSize;
            }

            if (l2 != null) {
              uvScale.z = 1.0 / l2.tileSize;
            }

            mtl.setProperty('weightMap', this._weightMap);
            mtl.setProperty('detailMap0', _l2 != null ? _l2.detailMap : null);
            mtl.setProperty('detailMap1', _l3 != null ? _l3.detailMap : null);
            mtl.setProperty('detailMap2', l2 != null ? l2.detailMap : null);
          } else if (nlayers === 3) {
            var _l4 = this._terrain.getLayer(this.layers[0]);

            var _l5 = this._terrain.getLayer(this.layers[1]);

            var _l6 = this._terrain.getLayer(this.layers[2]);

            var l3 = this._terrain.getLayer(this.layers[3]);

            if (_l4 != null) {
              uvScale.x = 1.0 / _l4.tileSize;
            }

            if (_l5 != null) {
              uvScale.y = 1.0 / _l5.tileSize;
            }

            if (_l6 != null) {
              uvScale.z = 1.0 / _l6.tileSize;
            }

            if (l3 != null) {
              uvScale.z = 1.0 / l3.tileSize;
            }

            mtl.setProperty('weightMap', this._weightMap);
            mtl.setProperty('detailMap0', _l4 != null ? _l4.detailMap : null);
            mtl.setProperty('detailMap1', _l5 != null ? _l5.detailMap : null);
            mtl.setProperty('detailMap2', _l6 != null ? _l6.detailMap : null);
            mtl.setProperty('detailMap3', l3 != null ? l3.detailMap : null);
          }

          mtl.setProperty('UVScale', uvScale);

          if (this.lightmap != null) {
            mtl.setProperty('lightMap', this.lightmap);
            mtl.setProperty('lightMapUVParam', this.lightmapUVParam);
          }
        }
      }
    }, {
      key: "setBrushMaterial",
      value: function setBrushMaterial(mtl) {
        if (this._renderable._brushMaterial !== mtl) {
          this._renderable._brushMaterial = mtl;

          this._renderable._invalidMaterial();
        }
      }
      /**
       * @en get layers
       * @zh 获得纹理层索引
       */

    }, {
      key: "getTerrain",

      /**
       * @en get terrain owner
       * @zh 获得地形对象
       */
      value: function getTerrain() {
        return this._terrain;
      }
      /**
       * @en get index
       * @zh 获得地形索引
       */

    }, {
      key: "getIndex",
      value: function getIndex() {
        return this._index;
      }
      /**
       * @en get rect bound
       * @zh 获得地形矩形包围体
       */

    }, {
      key: "getRect",
      value: function getRect() {
        var rect = new _index5.Rect();
        rect.x = this._index[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.y = this._index[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.width = _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        rect.height = _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY;
        return rect;
      }
      /**
       * @en set layer
       * @zh 设置纹理层
       */

    }, {
      key: "setLayer",
      value: function setLayer(index, layerId) {
        if (this.layers[index] !== layerId) {
          this.layers[index] = layerId;

          this._renderable._invalidMaterial();

          this._updateMaterial(false);
        }
      }
      /**
       * @en get layer
       * @zh 获得纹理层
       */

    }, {
      key: "getLayer",
      value: function getLayer(index) {
        return this.layers[index];
      }
      /**
       * @en get max layer index
       * @zh 获得最大纹理索引
       */

    }, {
      key: "getMaxLayer",
      value: function getMaxLayer() {
        if (this.layers[3] >= 0) {
          return 3;
        } else if (this.layers[2] >= 0) {
          return 2;
        } else if (this.layers[1] >= 0) {
          return 1;
        } else {
          return 0;
        }
      }
    }, {
      key: "_getMaterialDefines",
      value: function _getMaterialDefines(nlayers) {
        if (this.lightmap != null) {
          if (nlayers === 0) {
            return {
              LAYERS: 1,
              LIGHT_MAP: 1
            };
          } else if (nlayers === 1) {
            return {
              LAYERS: 2,
              LIGHT_MAP: 1
            };
          } else if (nlayers === 2) {
            return {
              LAYERS: 3,
              LIGHT_MAP: 1
            };
          } else if (nlayers === 3) {
            return {
              LAYERS: 4,
              LIGHT_MAP: 1
            };
          }
        } else {
          if (nlayers === 0) {
            return {
              LAYERS: 1
            };
          } else if (nlayers === 1) {
            return {
              LAYERS: 2
            };
          } else if (nlayers === 2) {
            return {
              LAYERS: 3
            };
          } else if (nlayers === 3) {
            return {
              LAYERS: 4
            };
          }
        }

        return {
          LAYERS: 0
        };
      }
    }, {
      key: "_invalidMaterial",
      value: function _invalidMaterial() {
        this._renderable._invalidMaterial();
      }
    }, {
      key: "_updateMaterial",
      value: function _updateMaterial(init) {
        this._renderable._updateMaterial(this, init);
      }
    }, {
      key: "_updateHeight",
      value: function _updateHeight() {
        if (this._renderable._meshData == null) {
          return;
        }

        var vertexData = new Float32Array(_terrainAsset.TERRAIN_BLOCK_VERTEX_SIZE * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY);
        var index = 0;

        for (var j = 0; j < _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++j) {
          for (var i = 0; i < _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY; ++i) {
            var x = this._index[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY + i;
            var y = this._index[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY + j;

            var position = this._terrain.getPosition(x, y);

            var normal = this._terrain.getNormal(x, y);

            var uv = new _index5.Vec2(i / _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY, j / _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY);
            vertexData[index++] = position.x;
            vertexData[index++] = position.y;
            vertexData[index++] = position.z;
            vertexData[index++] = normal.x;
            vertexData[index++] = normal.y;
            vertexData[index++] = normal.z;
            vertexData[index++] = uv.x;
            vertexData[index++] = uv.y;
          }
        }

        this._renderable._meshData.vertexBuffers[0].update(vertexData);
      }
    }, {
      key: "_updateWeightMap",
      value: function _updateWeightMap() {
        var nlayers = this.getMaxLayer();

        if (nlayers === 0) {
          if (this._weightMap != null) {
            this._weightMap.destroy();

            this._weightMap = null;
          }

          return;
        } else {
          if (this._weightMap == null) {
            this._weightMap = new _index2.Texture2D();

            this._weightMap.create(this._terrain.weightMapSize, this._terrain.weightMapSize, _assetEnum.PixelFormat.RGBA8888);

            this._weightMap.setFilters(_assetEnum.Filter.LINEAR, _assetEnum.Filter.LINEAR);

            this._weightMap.setWrapMode(_assetEnum.WrapMode.CLAMP_TO_EDGE, _assetEnum.WrapMode.CLAMP_TO_EDGE);
          }
        }

        var weightData = new Uint8Array(this._terrain.weightMapSize * this._terrain.weightMapSize * 4);
        var weightIndex = 0;

        for (var j = 0; j < this._terrain.weightMapSize; ++j) {
          for (var i = 0; i < this._terrain.weightMapSize; ++i) {
            var x = this._index[0] * this._terrain.weightMapSize + i;
            var y = this._index[1] * this._terrain.weightMapSize + j;

            var w = this._terrain.getWeight(x, y);

            weightData[weightIndex * 4 + 0] = Math.floor(w.x * 255);
            weightData[weightIndex * 4 + 1] = Math.floor(w.y * 255);
            weightData[weightIndex * 4 + 2] = Math.floor(w.z * 255);
            weightData[weightIndex * 4 + 3] = Math.floor(w.w * 255);
            weightIndex += 1;
          }
        }

        this._weightMap.uploadData(weightData);
      }
    }, {
      key: "_updateLightmap",
      value: function _updateLightmap(info) {
        this._lightmapInfo = info;

        this._invalidMaterial();
      }
    }, {
      key: "layers",
      get: function get() {
        return this._info.layers;
      }
      /**
       * @en get light map
       * @zh 获得光照图
       */

    }, {
      key: "lightmap",
      get: function get() {
        return this._lightmapInfo ? this._lightmapInfo.texture : null;
      }
      /**
       * @en get light map uv parameter
       * @zh 获得光照图纹理坐标参数
       */

    }, {
      key: "lightmapUVParam",
      get: function get() {
        if (this._lightmapInfo != null) {
          return new _index5.Vec4(this._lightmapInfo.UOff, this._lightmapInfo.VOff, this._lightmapInfo.UScale, this._lightmapInfo.VScale);
        } else {
          return new _index5.Vec4(0, 0, 0, 0);
        }
      }
    }]);

    return TerrainBlock;
  }();
  /**
   * @en Terrain
   * @zh 地形组件
   */


  _exports.TerrainBlock = TerrainBlock;
  var Terrain = (_dec5 = (0, _index4.ccclass)('cc.Terrain'), _dec6 = (0, _index4.help)('i18n:cc.Terrain'), _dec7 = (0, _index4.type)(_terrainAsset.TerrainAsset), _dec8 = (0, _index4.type)(_index2.EffectAsset), _dec9 = (0, _index4.visible)(false), _dec10 = (0, _index4.type)(TerrainLayer), _dec11 = (0, _index4.type)(_terrainAsset.TerrainAsset), _dec12 = (0, _index4.visible)(true), _dec13 = (0, _index4.type)(_index2.EffectAsset), _dec14 = (0, _index4.visible)(true), _dec15 = (0, _index4.type)(TerrainInfo), _dec5(_class13 = _dec6(_class13 = (0, _index4.executeInEditMode)(_class13 = (0, _index4.disallowMultiple)(_class13 = (_class14 = (_temp5 = /*#__PURE__*/function (_Component) {
    _inherits(Terrain, _Component);

    function Terrain() {
      var _this2;

      _classCallCheck(this, Terrain);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Terrain).call(this)); // initialize layers

      _initializerDefineProperty(_this2, "__asset", _descriptor13, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_effectAsset", _descriptor14, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_layers", _descriptor15, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_blockInfos", _descriptor16, _assertThisInitialized(_this2));

      _initializerDefineProperty(_this2, "_lightmapInfos", _descriptor17, _assertThisInitialized(_this2));

      _this2._tileSize = 1;
      _this2._blockCount = [1, 1];
      _this2._weightMapSize = 128;
      _this2._lightMapSize = 128;
      _this2._heights = new Uint16Array();
      _this2._weights = new Uint8Array();
      _this2._normals = [];
      _this2._blocks = [];
      _this2._sharedIndexBuffer = null;

      for (var i = 0; i < _terrainAsset.TERRAIN_MAX_LAYER_COUNT; ++i) {
        _this2._layers.push(null);
      }

      return _this2;
    }

    _createClass(Terrain, [{
      key: "build",

      /**
       * @en build
       * @zh 构建地形
       */
      value: function build(info) {
        this._tileSize = info.tileSize;
        this._blockCount[0] = info.blockCount[0];
        this._blockCount[1] = info.blockCount[1];
        this._weightMapSize = info.weightMapSize;
        this._lightMapSize = info.lightMapSize;
        return this._buildImp();
      }
      /**
       * @en rebuild
       * @zh 重建地形
       */

    }, {
      key: "rebuild",
      value: function rebuild(info) {
        // build block info
        var blockInfos = [];

        for (var i = 0; i < info.blockCount[0] * info.blockCount[1]; ++i) {
          blockInfos.push(new TerrainBlockInfo());
        }

        var w = Math.min(this._blockCount[0], info.blockCount[0]);
        var h = Math.min(this._blockCount[1], info.blockCount[1]);

        for (var j = 0; j < h; ++j) {
          for (var _i2 = 0; _i2 < w; ++_i2) {
            var index0 = j * info.blockCount[0] + _i2;
            var index1 = j * this.blockCount[0] + _i2;
            blockInfos[index0] = this._blockInfos[index1];
          }
        }

        this._blockInfos = blockInfos;

        var _iterator = _createForOfIteratorHelper(this._blocks),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var block = _step.value;
            block.destroy();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._blocks = []; // build heights

        this._rebuildHeights(info); // build weights


        this._rebuildWeights(info); // update info


        this._tileSize = info.tileSize;
        this._blockCount[0] = info.blockCount[0];
        this._blockCount[1] = info.blockCount[1];
        this._weightMapSize = info.weightMapSize;
        this._lightMapSize = info.lightMapSize; // build blocks

        this._buildNormals();

        for (var _j2 = 0; _j2 < this._blockCount[1]; ++_j2) {
          for (var _i3 = 0; _i3 < this._blockCount[0]; ++_i3) {
            this._blocks.push(new TerrainBlock(this, _i3, _j2));
          }
        }

        var _iterator2 = _createForOfIteratorHelper(this._blocks),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _i4 = _step2.value;

            _i4.build();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      /**
       * @en import height field
       * @zh 导入高度图
       */

    }, {
      key: "importHeightField",
      value: function importHeightField(hf, heightScale) {
        var index = 0;

        for (var j = 0; j < this.vertexCount[1]; ++j) {
          for (var i = 0; i < this.vertexCount[0]; ++i) {
            var u = i / this.tileCount[0];
            var v = j / this.tileCount[1];
            var h = hf.getAt(u * hf.w, v * hf.h) * heightScale;
            this._heights[index++] = h;
          }
        }

        this._buildNormals(); // rebuild all blocks


        var _iterator3 = _createForOfIteratorHelper(this._blocks),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _i5 = _step3.value;

            _i5._updateHeight();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
      /**
       * @en export height field
       * @zh 导出高度图
       */

    }, {
      key: "exportHeightField",
      value: function exportHeightField(hf, heightScale) {
        var index = 0;

        for (var j = 0; j < hf.h; ++j) {
          for (var i = 0; i < hf.w; ++i) {
            var u = i / (hf.w - 1);
            var v = j / (hf.h - 1);
            var x = u * this.size.width;
            var y = v * this.size.height;
            var h = this.getHeightAt(x, y);

            if (h != null) {
              hf.data[index++] = h * heightScale;
            }
          }
        }
      }
    }, {
      key: "exportAsset",
      value: function exportAsset() {
        var asset = new _terrainAsset.TerrainAsset();
        asset.tileSize = this.tileSize;
        asset.blockCount = this.blockCount;
        asset.lightMapSize = this.lightMapSize;
        asset.weightMapSize = this.weightMapSize;
        asset.heights = this.heights;
        asset.weights = this.weights;
        asset.layerBuffer = new Array(this._blocks.length * 4);

        for (var i = 0; i < this._blocks.length; ++i) {
          asset.layerBuffer[i * 4 + 0] = this._blocks[i].layers[0];
          asset.layerBuffer[i * 4 + 1] = this._blocks[i].layers[1];
          asset.layerBuffer[i * 4 + 2] = this._blocks[i].layers[2];
          asset.layerBuffer[i * 4 + 3] = this._blocks[i].layers[3];
        }

        for (var _i6 = 0; _i6 < this._layers.length; ++_i6) {
          var temp = this._layers[_i6];

          if (temp && temp.detailMap && (0, _object.isValid)(temp.detailMap)) {
            var layer = new _terrainAsset.TerrainLayerInfo();
            layer.slot = _i6;
            layer.tileSize = temp.tileSize;
            layer.detailMap = temp.detailMap._uuid;
            asset.layerInfos.push(layer);
          }
        }

        return asset;
      }
    }, {
      key: "getEffectAsset",
      value: function getEffectAsset() {
        if (this._effectAsset === null) {
          return _globalExports.legacyCC.EffectAsset.get('builtin-terrain');
        } else {
          return this._effectAsset;
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        var gfxDevice = _globalExports.legacyCC.director.root.device; // initialize shared index buffer

        var indexData = new Uint16Array(_terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * 6);
        var index = 0;

        for (var j = 0; j < _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY; ++j) {
          for (var i = 0; i < _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY; ++i) {
            var a = j * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
            var b = j * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1;
            var c = (j + 1) * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY + i;
            var d = (j + 1) * _terrainAsset.TERRAIN_BLOCK_VERTEX_COMPLEXITY + i + 1; // face 1

            indexData[index++] = a;
            indexData[index++] = c;
            indexData[index++] = b; // face 2

            indexData[index++] = b;
            indexData[index++] = c;
            indexData[index++] = d;
          }
        }

        this._sharedIndexBuffer = gfxDevice.createBuffer(new _buffer.GFXBufferInfo(_define.GFXBufferUsageBit.INDEX | _define.GFXBufferUsageBit.TRANSFER_DST, _define.GFXMemoryUsageBit.HOST | _define.GFXMemoryUsageBit.DEVICE, Uint16Array.BYTES_PER_ELEMENT * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * 6, Uint16Array.BYTES_PER_ELEMENT));

        this._sharedIndexBuffer.update(indexData);
      }
    }, {
      key: "onEnable",
      value: function onEnable() {
        if (this._blocks.length === 0) {
          this._buildImp();
        }
      }
    }, {
      key: "onDisable",
      value: function onDisable() {
        var _iterator4 = _createForOfIteratorHelper(this._blocks),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var i = _step4.value;
            i.destroy();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        this._blocks = [];
      }
    }, {
      key: "onDestroy",
      value: function onDestroy() {
        for (var i = 0; i < this._layers.length; ++i) {
          this._layers[i] = null;
        }

        if (this._sharedIndexBuffer != null) {
          this._sharedIndexBuffer.destroy();
        }
      }
    }, {
      key: "onRestore",
      value: function onRestore() {
        this.onDisable();
        this.onLoad();

        this._buildImp(true);
      }
    }, {
      key: "update",
      value: function update(deltaTime) {
        var _iterator5 = _createForOfIteratorHelper(this._blocks),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var i = _step5.value;
            i.update();
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
      /**
       * @en add layer
       * @zh 添加纹理层
       */

    }, {
      key: "addLayer",
      value: function addLayer(layer) {
        for (var i = 0; i < this._layers.length; ++i) {
          if (this._layers[i] == null) {
            this._layers[i] = layer;
            return i;
          }
        }

        return -1;
      }
      /**
       * @en set layer
       * @zh 设置纹理层
       */

    }, {
      key: "setLayer",
      value: function setLayer(i, layer) {
        this._layers[i] = layer;
      }
      /**
       * @en remove layer
       * @zh 移除纹理层
       */

    }, {
      key: "removeLayer",
      value: function removeLayer(id) {
        this._layers[id] = null;
      }
      /**
       * @en get layer
       * @zh 获得纹理层
       */

    }, {
      key: "getLayer",
      value: function getLayer(id) {
        if (id === -1) {
          return null;
        }

        return this._layers[id];
      }
      /**
       * @en get position
       * @zh 获得地形上的位置
       */

    }, {
      key: "getPosition",
      value: function getPosition(i, j) {
        var x = i * this._tileSize;
        var z = j * this._tileSize;
        var y = this.getHeight(i, j);
        return new _index5.Vec3(x, y, z);
      }
    }, {
      key: "getHeightField",
      value: function getHeightField() {
        return this._heights;
      }
      /**
       * @en set height
       * @zh 设置地形上的高度
       */

    }, {
      key: "setHeight",
      value: function setHeight(i, j, h) {
        h = (0, _index5.clamp)(h, _terrainAsset.TERRAIN_HEIGHT_FMIN, _terrainAsset.TERRAIN_HEIGHT_FMAX);
        this._heights[j * this.vertexCount[0] + i] = _terrainAsset.TERRAIN_HEIGHT_BASE + h / _terrainAsset.TERRAIN_HEIGHT_FACTORY;
      }
      /**
       * @en get height
       * @zh 获得地形上的高度
       */

    }, {
      key: "getHeight",
      value: function getHeight(i, j) {
        return (this._heights[j * this.vertexCount[0] + i] - _terrainAsset.TERRAIN_HEIGHT_BASE) * _terrainAsset.TERRAIN_HEIGHT_FACTORY;
      }
      /**
       * @en set height
       * @zh 设置高度
       */

    }, {
      key: "getHeightClamp",
      value: function getHeightClamp(i, j) {
        i = (0, _index5.clamp)(i, 0, this.vertexCount[0] - 1);
        j = (0, _index5.clamp)(j, 0, this.vertexCount[1] - 1);
        return this.getHeight(i, j);
      }
      /**
       * @en get height by point
       * @zh 根据点的坐标获得高度
       */

    }, {
      key: "getHeightAt",
      value: function getHeightAt(x, y) {
        var fx = x / this.tileSize;
        var fy = y / this.tileSize;
        var ix0 = Math.floor(fx);
        var iz0 = Math.floor(fy);
        var ix1 = ix0 + 1;
        var iz1 = iz0 + 1;
        var dx = fx - ix0;
        var dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
          return null;
        }

        ix0 = (0, _index5.clamp)(ix0, 0, this.vertexCount[0] - 1);
        iz0 = (0, _index5.clamp)(iz0, 0, this.vertexCount[1] - 1);
        ix1 = (0, _index5.clamp)(ix1, 0, this.vertexCount[0] - 1);
        iz1 = (0, _index5.clamp)(iz1, 0, this.vertexCount[1] - 1);
        var a = this.getHeight(ix0, iz0);
        var b = this.getHeight(ix1, iz0);
        var c = this.getHeight(ix0, iz1);
        var d = this.getHeight(ix1, iz1);
        var m = (b + c) * 0.5;

        if (dx + dz <= 1.0) {
          d = m + (m - a);
        } else {
          a = m + (m - d);
        }

        var h1 = a * (1.0 - dx) + b * dx;
        var h2 = c * (1.0 - dx) + d * dx;
        var h = h1 * (1.0 - dz) + h2 * dz;
        return h;
      }
    }, {
      key: "_setNormal",
      value: function _setNormal(i, j, n) {
        var index = j * this.vertexCount[0] + i;
        this._normals[index * 3 + 0] = n.x;
        this._normals[index * 3 + 1] = n.y;
        this._normals[index * 3 + 2] = n.z;
      }
      /**
       * @en get normal
       * @zh 获得法线
       */

    }, {
      key: "getNormal",
      value: function getNormal(i, j) {
        var index = j * this.vertexCount[0] + i;
        var n = new _index5.Vec3();
        n.x = this._normals[index * 3 + 0];
        n.y = this._normals[index * 3 + 1];
        n.z = this._normals[index * 3 + 2];
        return n;
      }
      /**
       * @en get normal by point
       * @zh 根据点的坐标获得法线
       */

    }, {
      key: "getNormalAt",
      value: function getNormalAt(x, y) {
        var fx = x / this.tileSize;
        var fy = y / this.tileSize;
        var ix0 = Math.floor(fx);
        var iz0 = Math.floor(fy);
        var ix1 = ix0 + 1;
        var iz1 = iz0 + 1;
        var dx = fx - ix0;
        var dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
          return null;
        }

        ix0 = (0, _index5.clamp)(ix0, 0, this.vertexCount[0] - 1);
        iz0 = (0, _index5.clamp)(iz0, 0, this.vertexCount[1] - 1);
        ix1 = (0, _index5.clamp)(ix1, 0, this.vertexCount[0] - 1);
        iz1 = (0, _index5.clamp)(iz1, 0, this.vertexCount[1] - 1);
        var a = this.getNormal(ix0, iz0);
        var b = this.getNormal(ix1, iz0);
        var c = this.getNormal(ix0, iz1);
        var d = this.getNormal(ix1, iz1);
        var m = new _index5.Vec3();

        _index5.Vec3.add(m, b, c).multiplyScalar(0.5);

        if (dx + dz <= 1.0) {
          // d = m + (m - a);
          d.set(m);
          d.subtract(a);
          d.add(m);
        } else {
          // a = m + (m - d);
          a.set(m);
          a.subtract(d);
          a.add(m);
        }

        var n1 = new _index5.Vec3();
        var n2 = new _index5.Vec3();
        var n = new _index5.Vec3();

        _index5.Vec3.lerp(n1, a, b, dx);

        _index5.Vec3.lerp(n2, c, d, dx);

        _index5.Vec3.lerp(n, n1, n2, dz);

        return n;
      }
      /**
       * @en set weight
       * @zh 设置权重
       */

    }, {
      key: "setWeight",
      value: function setWeight(i, j, w) {
        var index = j * this._weightMapSize * this._blockCount[0] + i;
        this._weights[index * 4 + 0] = w.x * 255;
        this._weights[index * 4 + 1] = w.y * 255;
        this._weights[index * 4 + 2] = w.z * 255;
        this._weights[index * 4 + 3] = w.w * 255;
      }
      /**
       * @en get weight
       * @zh 获得权重
       */

    }, {
      key: "getWeight",
      value: function getWeight(i, j) {
        var index = j * this._weightMapSize * this._blockCount[0] + i;
        var w = new _index5.Vec4();
        w.x = this._weights[index * 4 + 0] / 255.0;
        w.y = this._weights[index * 4 + 1] / 255.0;
        w.z = this._weights[index * 4 + 2] / 255.0;
        w.w = this._weights[index * 4 + 3] / 255.0;
        return w;
      }
      /**
       * @en get normal by point
       * @zh 根据点的坐标获得权重
       */

    }, {
      key: "getWeightAt",
      value: function getWeightAt(x, y) {
        var fx = x / this.tileSize;
        var fy = y / this.tileSize;
        var ix0 = Math.floor(fx);
        var iz0 = Math.floor(fy);
        var ix1 = ix0 + 1;
        var iz1 = iz0 + 1;
        var dx = fx - ix0;
        var dz = fy - iz0;

        if (ix0 < 0 || ix0 > this.vertexCount[0] - 1 || iz0 < 0 || iz0 > this.vertexCount[1] - 1) {
          return null;
        }

        ix0 = (0, _index5.clamp)(ix0, 0, this.vertexCount[0] - 1);
        iz0 = (0, _index5.clamp)(iz0, 0, this.vertexCount[1] - 1);
        ix1 = (0, _index5.clamp)(ix1, 0, this.vertexCount[0] - 1);
        iz1 = (0, _index5.clamp)(iz1, 0, this.vertexCount[1] - 1);
        var a = this.getWeight(ix0, iz0);
        var b = this.getWeight(ix1, iz0);
        var c = this.getWeight(ix0, iz1);
        var d = this.getWeight(ix1, iz1);
        var m = new _index5.Vec4();

        _index5.Vec4.add(m, b, c).multiplyScalar(0.5);

        if (dx + dz <= 1.0) {
          d = new _index5.Vec4();

          _index5.Vec4.subtract(d, m, a).add(m);
        } else {
          a = new _index5.Vec4();

          _index5.Vec4.subtract(a, m, d).add(m);
        }

        var n1 = new _index5.Vec4();
        var n2 = new _index5.Vec4();
        var n = new _index5.Vec4();

        _index5.Vec4.lerp(n1, a, b, dx);

        _index5.Vec4.lerp(n2, c, d, dx);

        _index5.Vec4.lerp(n, n1, n2, dz);

        return n;
      }
      /**
       * @en get block info
       * @zh 获得地形块信息
       */

    }, {
      key: "getBlockInfo",
      value: function getBlockInfo(i, j) {
        return this._blockInfos[j * this._blockCount[0] + i];
      }
      /**
       * @en get block
       * @zh 获得地形块对象
       */

    }, {
      key: "getBlock",
      value: function getBlock(i, j) {
        return this._blocks[j * this._blockCount[0] + i];
      }
      /**
       * @en get all blocks
       * @zh 获得地形块缓存
       */

    }, {
      key: "getBlocks",
      value: function getBlocks() {
        return this._blocks;
      }
      /**
       * @en ray check
       * @param start ray start
       * @param dir ray direction
       * @param step ray step
       * @param worldSpace is world space
       * @zh 射线检测
       * @param start 射线原点
       * @param dir 射线方向
       * @param step 射线步长
       * @param worldSpace 是否在世界空间
       */

    }, {
      key: "rayCheck",
      value: function rayCheck(start, dir, step) {
        var worldSpace = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
        var MAX_COUNT = 2000;
        var trace = start;

        if (worldSpace) {
          _index5.Vec3.subtract(trace, start, this.node.getWorldPosition());
        }

        var delta = new _index5.Vec3();
        delta.set(dir);
        delta.multiplyScalar(step);
        var position = null;

        if (dir.equals(new _index5.Vec3(0, 1, 0))) {
          var y = this.getHeightAt(trace.x, trace.z);

          if (y != null && trace.y <= y) {
            position = new _index5.Vec3(trace.x, y, trace.z);
          }
        } else if (dir.equals(new _index5.Vec3(0, -1, 0))) {
          var _y2 = this.getHeightAt(trace.x, trace.z);

          if (_y2 != null && trace.y >= _y2) {
            position = new _index5.Vec3(trace.x, _y2, trace.z);
          }
        } else {
          var i = 0; // 优先大步进查找

          while (i++ < MAX_COUNT) {
            var _y3 = this.getHeightAt(trace.x, trace.z);

            if (_y3 != null && trace.y <= _y3) {
              break;
            }

            trace.add(dir);
          } // 穷举法


          while (i++ < MAX_COUNT) {
            var _y4 = this.getHeightAt(trace.x, trace.z);

            if (_y4 != null && trace.y <= _y4) {
              position = new _index5.Vec3(trace.x, _y4, trace.z);
              break;
            }

            trace.add(delta);
          }
        }

        return position;
      }
    }, {
      key: "_getSharedIndexBuffer",
      value: function _getSharedIndexBuffer() {
        return this._sharedIndexBuffer;
      }
    }, {
      key: "_resetLightmap",
      value: function _resetLightmap(enble) {
        this._lightmapInfos.length = 0;

        if (enble) {
          for (var i = 0; i < this._blockCount[0] * this._blockCount[1]; ++i) {
            this._lightmapInfos.push(new TerrainBlockLightmapInfo());
          }
        }
      }
    }, {
      key: "_updateLightmap",
      value: function _updateLightmap(blockId, tex, uOff, vOff, uScale, vScale) {
        this._lightmapInfos[blockId].texture = tex;
        this._lightmapInfos[blockId].UOff = uOff;
        this._lightmapInfos[blockId].VOff = vOff;
        this._lightmapInfos[blockId].UScale = uScale;
        this._lightmapInfos[blockId].VScale = vScale;

        this._blocks[blockId]._updateLightmap(this._lightmapInfos[blockId]);
      }
    }, {
      key: "_getLightmapInfo",
      value: function _getLightmapInfo(i, j) {
        var index = j * this._blockCount[0] + i;
        return index < this._lightmapInfos.length ? this._lightmapInfos[index] : null;
      }
    }, {
      key: "_calcNormal",
      value: function _calcNormal(x, z) {
        var flip = 1;
        var here = this.getPosition(x, z);
        var right;
        var up;

        if (x < this.vertexCount[0] - 1) {
          right = this.getPosition(x + 1, z);
        } else {
          flip *= -1;
          right = this.getPosition(x - 1, z);
        }

        if (z < this.vertexCount[1] - 1) {
          up = this.getPosition(x, z + 1);
        } else {
          flip *= -1;
          up = this.getPosition(x, z - 1);
        }

        right.subtract(here);
        up.subtract(here);
        var normal = new _index5.Vec3();
        normal.set(up);
        normal.cross(right);
        normal.multiplyScalar(flip);
        normal.normalize();
        return normal;
      }
    }, {
      key: "_buildNormals",
      value: function _buildNormals() {
        var index = 0;

        for (var y = 0; y < this.vertexCount[1]; ++y) {
          for (var x = 0; x < this.vertexCount[0]; ++x) {
            var n = this._calcNormal(x, y);

            this._normals[index * 3 + 0] = n.x;
            this._normals[index * 3 + 1] = n.y;
            this._normals[index * 3 + 2] = n.z;
            index += 1;
          }
        }
      }
    }, {
      key: "_buildImp",
      value: function _buildImp() {
        var _this3 = this;

        var restore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (this.valid) {
          return true;
        }

        if (!restore && this.__asset != null) {
          this._tileSize = this.__asset.tileSize;
          this._blockCount = this.__asset.blockCount;
          this._weightMapSize = this.__asset.weightMapSize;
          this._lightMapSize = this.__asset.lightMapSize;
          this._heights = this.__asset.heights;
          this._weights = this.__asset.weights; // build layers

          var initial = true;

          for (var i = 0; i < this._layers.length; ++i) {
            if (this._layers[i] != null) {
              initial = false;
            }
          }

          if (initial && this._asset != null) {
            var _iterator6 = _createForOfIteratorHelper(this._asset.layerInfos),
                _step6;

            try {
              var _loop = function _loop() {
                var i = _step6.value;
                var layer = new TerrainLayer();
                layer.tileSize = i.tileSize;

                _globalExports.legacyCC.loader.loadRes(i.detailMap, _index2.Texture2D, function (err, asset) {
                  layer.detailMap = asset;
                });

                _this3._layers[i.slot] = layer;
              };

              for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
                _loop();
              }
            } catch (err) {
              _iterator6.e(err);
            } finally {
              _iterator6.f();
            }
          }
        }

        if (this._blockCount[0] === 0 || this._blockCount[1] === 0) {
          return false;
        } // build heights & normals


        var vertexCount = this.vertexCount[0] * this.vertexCount[1];

        if (this._heights === null || this._heights.length !== vertexCount) {
          this._heights = new Uint16Array(vertexCount);
          this._normals = new Array(vertexCount * 3);

          for (var _i7 = 0; _i7 < vertexCount; ++_i7) {
            this._heights[_i7] = _terrainAsset.TERRAIN_HEIGHT_BASE;
            this._normals[_i7 * 3 + 0] = 0;
            this._normals[_i7 * 3 + 1] = 1;
            this._normals[_i7 * 3 + 2] = 0;
          }
        } else {
          this._normals = new Array(vertexCount * 3);

          this._buildNormals();
        } // build weights


        var weightMapComplexityU = this._weightMapSize * this._blockCount[0];
        var weightMapComplexityV = this._weightMapSize * this._blockCount[1];

        if (this._weights.length !== weightMapComplexityU * weightMapComplexityV * 4) {
          this._weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);

          for (var _i8 = 0; _i8 < weightMapComplexityU * weightMapComplexityV; ++_i8) {
            this._weights[_i8 * 4 + 0] = 255;
            this._weights[_i8 * 4 + 1] = 0;
            this._weights[_i8 * 4 + 2] = 0;
            this._weights[_i8 * 4 + 3] = 0;
          }
        } // build blocks


        if (this._blockInfos.length !== this._blockCount[0] * this._blockCount[1]) {
          this._blockInfos = [];

          for (var j = 0; j < this._blockCount[1]; ++j) {
            for (var _i9 = 0; _i9 < this._blockCount[0]; ++_i9) {
              var info = new TerrainBlockInfo();

              if (this._asset != null) {
                info.layers[0] = this._asset.getLayer(_i9, j, 0);
                info.layers[1] = this._asset.getLayer(_i9, j, 1);

                if (info.layers[1] === info.layers[0]) {
                  info.layers[1] = -1;
                }

                info.layers[2] = this._asset.getLayer(_i9, j, 2);

                if (info.layers[2] === info.layers[0]) {
                  info.layers[2] = -1;
                }

                info.layers[3] = this._asset.getLayer(_i9, j, 3);

                if (info.layers[3] === info.layers[0]) {
                  info.layers[3] = -1;
                }
              }

              this._blockInfos.push(info);
            }
          }
        }

        for (var _j3 = 0; _j3 < this._blockCount[1]; ++_j3) {
          for (var _i10 = 0; _i10 < this._blockCount[0]; ++_i10) {
            this._blocks.push(new TerrainBlock(this, _i10, _j3));
          }
        }

        var _iterator7 = _createForOfIteratorHelper(this._blocks),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var _i11 = _step7.value;

            _i11.build();
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }, {
      key: "_rebuildHeights",
      value: function _rebuildHeights(info) {
        if (this.vertexCount[0] === info.vertexCount[0] && this.vertexCount[1] === info.vertexCount[1]) {
          return false;
        }

        var heights = new Uint16Array(info.vertexCount[0] * info.vertexCount[1]);

        for (var i = 0; i < heights.length; ++i) {
          heights[i] = _terrainAsset.TERRAIN_HEIGHT_BASE;
        }

        var w = Math.min(this.vertexCount[0], info.vertexCount[0]);
        var h = Math.min(this.vertexCount[1], info.vertexCount[1]);

        for (var j = 0; j < h; ++j) {
          for (var _i12 = 0; _i12 < w; ++_i12) {
            var index0 = j * info.vertexCount[0] + _i12;
            var index1 = j * this.vertexCount[0] + _i12;
            heights[index0] = this._heights[index1];
          }
        }

        this._heights = heights;
        return true;
      }
    }, {
      key: "_rebuildWeights",
      value: function _rebuildWeights(info) {
        var _this4 = this;

        var oldWeightMapSize = this._weightMapSize;
        var oldWeightMapComplexityU = this._weightMapSize * this._blockCount[0];
        var oldWeightMapComplexityV = this._weightMapSize * this._blockCount[1];
        var weightMapComplexityU = info.weightMapSize * info.blockCount[0];
        var weightMapComplexityV = info.weightMapSize * info.blockCount[1];

        if (weightMapComplexityU === oldWeightMapComplexityU && weightMapComplexityV === oldWeightMapComplexityV) {
          return false;
        }

        var weights = new Uint8Array(weightMapComplexityU * weightMapComplexityV * 4);

        for (var i = 0; i < weightMapComplexityU * weightMapComplexityV; ++i) {
          weights[i * 4 + 0] = 255;
          weights[i * 4 + 1] = 0;
          weights[i * 4 + 2] = 0;
          weights[i * 4 + 3] = 0;
        }

        var w = Math.min(info.blockCount[0], this._blockCount[0]);
        var h = Math.min(info.blockCount[1], this._blockCount[1]); // get weight

        var getOldWeight = function getOldWeight(_i, _j, _weights) {
          var index = _j * oldWeightMapComplexityU + _i;
          var weight = new _index5.Vec4();
          weight.x = _weights[index * 4 + 0] / 255.0;
          weight.y = _weights[index * 4 + 1] / 255.0;
          weight.z = _weights[index * 4 + 2] / 255.0;
          weight.w = _weights[index * 4 + 3] / 255.0;
          return weight;
        }; // sample weight


        var sampleOldWeight = function sampleOldWeight(_x, _y, _xOff, _yOff, _weights) {
          var ix0 = Math.floor(_x);
          var iz0 = Math.floor(_y);
          var ix1 = ix0 + 1;
          var iz1 = iz0 + 1;
          var dx = _x - ix0;
          var dz = _y - iz0;
          var a = getOldWeight(ix0 + _xOff, iz0 + _yOff, _this4._weights);
          var b = getOldWeight(ix1 + _xOff, iz0 + _yOff, _this4._weights);
          var c = getOldWeight(ix0 + _xOff, iz1 + _yOff, _this4._weights);
          var d = getOldWeight(ix1 + _xOff, iz1 + _yOff, _this4._weights);
          var m = new _index5.Vec4();

          _index5.Vec4.add(m, b, c).multiplyScalar(0.5);

          if (dx + dz <= 1.0) {
            d.set(m);
            d.subtract(a);
            d.add(m);
          } else {
            a.set(m);
            a.subtract(d);
            a.add(m);
          }

          var n1 = new _index5.Vec4();
          var n2 = new _index5.Vec4();
          var n = new _index5.Vec4();

          _index5.Vec4.lerp(n1, a, b, dx);

          _index5.Vec4.lerp(n2, c, d, dx);

          _index5.Vec4.lerp(n, n1, n2, dz);

          return n;
        }; // fill new weights


        for (var j = 0; j < h; ++j) {
          for (var _i13 = 0; _i13 < w; ++_i13) {
            var uOff = _i13 * oldWeightMapSize;
            var vOff = j * oldWeightMapSize;

            for (var v = 0; v < info.weightMapSize; ++v) {
              for (var u = 0; u < info.weightMapSize; ++u) {
                // tslint:disable-next-line: no-shadowed-variable
                var _w = void 0;

                if (info.weightMapSize === oldWeightMapSize) {
                  _w = getOldWeight(u + uOff, v + vOff, this._weights);
                } else {
                  var x = u / (info.weightMapSize - 1) * (oldWeightMapSize - 1);
                  var y = v / (info.weightMapSize - 1) * (oldWeightMapSize - 1);
                  _w = sampleOldWeight(x, y, uOff, vOff, this._weights);
                }

                var du = _i13 * info.weightMapSize + u;
                var dv = j * info.weightMapSize + v;
                var index = dv * weightMapComplexityU + du;
                weights[index * 4 + 0] = _w.x * 255;
                weights[index * 4 + 1] = _w.y * 255;
                weights[index * 4 + 2] = _w.z * 255;
                weights[index * 4 + 3] = _w.w * 255;
              }
            }
          }
        }

        this._weights = weights;
        return true;
      }
    }, {
      key: "_asset",
      set: function set(value) {
        if (this.__asset !== value) {
          this.__asset = value;

          if (this.__asset != null && this.valid) {
            // rebuild
            var _iterator8 = _createForOfIteratorHelper(this._blocks),
                _step8;

            try {
              for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                var block = _step8.value;
                block.destroy();
              }
            } catch (err) {
              _iterator8.e(err);
            } finally {
              _iterator8.f();
            }

            this._blocks = [];
            this._blockInfos = [];

            this._buildImp();
          }
        }
      },
      get: function get() {
        return this.__asset;
      }
      /**
       * @en Terrain effect asset
       * @zh 地形特效资源
       */

    }, {
      key: "effectAsset",
      set: function set(value) {
        if (this._effectAsset === value) {
          return;
        }

        this._effectAsset = value;

        var _iterator9 = _createForOfIteratorHelper(this._blocks),
            _step9;

        try {
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var i = _step9.value;

            i._invalidMaterial();
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      },
      get: function get() {
        return this._effectAsset;
      }
      /**
       * @en get terrain size
       * @zh 获得地形大小
       */

    }, {
      key: "size",
      get: function get() {
        var sz = new _index5.Size(0, 0);
        sz.width = this.blockCount[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        sz.height = this.blockCount[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY * this.tileSize;
        return sz;
      }
      /**
       * @en get tile size
       * @zh 获得栅格大小
       */

    }, {
      key: "tileSize",
      get: function get() {
        return this._tileSize;
      }
      /**
       * @en get tile count
       * @zh 获得栅格数量
       */

    }, {
      key: "tileCount",
      get: function get() {
        return [this.blockCount[0] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY, this.blockCount[1] * _terrainAsset.TERRAIN_BLOCK_TILE_COMPLEXITY];
      }
      /**
       * @en get vertex count
       * @zh 获得顶点数量
       */

    }, {
      key: "vertexCount",
      get: function get() {
        var _vertexCount = this.tileCount;
        _vertexCount[0] += 1;
        _vertexCount[1] += 1;
        return _vertexCount;
      }
      /**
       * @en get block count
       * @zh 获得地形块数量
       */

    }, {
      key: "blockCount",
      get: function get() {
        return this._blockCount;
      }
      /**
       * @en get light map size
       * @zh 获得光照图大小
       */

    }, {
      key: "lightMapSize",
      get: function get() {
        return this._lightMapSize;
      }
      /**
       * @en get weight map size
       * @zh 获得权重图大小
       */

    }, {
      key: "weightMapSize",
      get: function get() {
        return this._weightMapSize;
      }
      /**
       * @en get height buffer
       * @zh 获得高度缓存
       */

    }, {
      key: "heights",
      get: function get() {
        return this._heights;
      }
      /**
       * @en get weight buffer
       * @zh 获得权重缓存
       */

    }, {
      key: "weights",
      get: function get() {
        return this._weights;
      }
      /**
       * @en check valid
       * @zh 检测是否有效
       */

    }, {
      key: "valid",
      get: function get() {
        return this._blocks.length > 0;
      }
      /**
       * @en get terrain info
       * @zh 获得地形信息
       */

    }, {
      key: "info",
      get: function get() {
        var ti = new TerrainInfo();
        ti.tileSize = this.tileSize;
        ti.blockCount[0] = this.blockCount[0];
        ti.blockCount[1] = this.blockCount[1];
        ti.weightMapSize = this.weightMapSize;
        ti.lightMapSize = this.lightMapSize;
        return ti;
      }
    }]);

    return Terrain;
  }(_index3.Component), _temp5), (_descriptor13 = _applyDecoratedDescriptor(_class14.prototype, "__asset", [_dec7, _index4.serializable, _index4.disallowAnimation], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor14 = _applyDecoratedDescriptor(_class14.prototype, "_effectAsset", [_dec8, _index4.serializable, _index4.disallowAnimation, _dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return null;
    }
  }), _descriptor15 = _applyDecoratedDescriptor(_class14.prototype, "_layers", [_dec10, _index4.serializable, _index4.disallowAnimation], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor16 = _applyDecoratedDescriptor(_class14.prototype, "_blockInfos", [_index4.serializable, _index4.disallowAnimation], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class14.prototype, "_lightmapInfos", [_index4.serializable, _index4.disallowAnimation], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer() {
      return [];
    }
  }), _applyDecoratedDescriptor(_class14.prototype, "_asset", [_dec11, _dec12], Object.getOwnPropertyDescriptor(_class14.prototype, "_asset"), _class14.prototype), _applyDecoratedDescriptor(_class14.prototype, "effectAsset", [_dec13, _dec14], Object.getOwnPropertyDescriptor(_class14.prototype, "effectAsset"), _class14.prototype), _applyDecoratedDescriptor(_class14.prototype, "info", [_dec15], Object.getOwnPropertyDescriptor(_class14.prototype, "info"), _class14.prototype)), _class14)) || _class13) || _class13) || _class13) || _class13);
  _exports.Terrain = Terrain;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3RlcnJhaW4vdGVycmFpbi50cyJdLCJuYW1lcyI6WyJUZXJyYWluSW5mbyIsInN6IiwiU2l6ZSIsIndpZHRoIiwiYmxvY2tDb3VudCIsIlRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZIiwidGlsZVNpemUiLCJoZWlnaHQiLCJfdGlsZUNvdW50IiwiX3ZlcnRleENvdW50IiwidGlsZUNvdW50Iiwic2VyaWFsaXphYmxlIiwiZWRpdGFibGUiLCJUZXJyYWluTGF5ZXIiLCJUZXJyYWluUmVuZGVyYWJsZSIsIl9tb2RlbCIsIl9tZXNoRGF0YSIsIl9icnVzaE1hdGVyaWFsIiwiX2N1cnJlbnRNYXRlcmlhbCIsIl9jdXJyZW50TWF0ZXJpYWxMYXllcnMiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwicm9vdCIsImRlc3Ryb3lNb2RlbCIsIl9jbGVhck1hdGVyaWFscyIsImVuYWJsZWQiLCJibG9jayIsImluaXQiLCJuTGF5ZXJzIiwiZ2V0TWF4TGF5ZXIiLCJNYXRlcmlhbCIsImluaXRpYWxpemUiLCJlZmZlY3RBc3NldCIsImdldFRlcnJhaW4iLCJnZXRFZmZlY3RBc3NldCIsImRlZmluZXMiLCJfZ2V0TWF0ZXJpYWxEZWZpbmVzIiwicGFzc2VzIiwicHVzaCIsImluaXRTdWJNb2RlbCIsInNldE1hdGVyaWFsIiwiaWR4IiwibXRsIiwiX29uUmVidWlsZFBTTyIsIl9nZXRCdWlsdGluTWF0ZXJpYWwiLCJtYXRlcmlhbCIsInNldFN1Yk1vZGVsTWF0ZXJpYWwiLCJfb25NYXRlcmlhbE1vZGlmaWVkIiwiYnVpbHRpblJlc01nciIsImdldCIsIlJlbmRlcmFibGVDb21wb25lbnQiLCJUZXJyYWluQmxvY2tJbmZvIiwiVGVycmFpbkJsb2NrTGlnaHRtYXBJbmZvIiwiVGVycmFpbkJsb2NrIiwidCIsImkiLCJqIiwiX3RlcnJhaW4iLCJfaW5mbyIsIl9ub2RlIiwiX3JlbmRlcmFibGUiLCJfaW5kZXgiLCJfd2VpZ2h0TWFwIiwiX2xpZ2h0bWFwSW5mbyIsImdldEJsb2NrSW5mbyIsIl9nZXRMaWdodG1hcEluZm8iLCJQcml2YXRlTm9kZSIsInNldFBhcmVudCIsIm5vZGUiLCJfb2JqRmxhZ3MiLCJPYmplY3QiLCJGbGFncyIsIkRvbnRTYXZlIiwiYWRkQ29tcG9uZW50IiwiZ2Z4RGV2aWNlIiwiZGV2aWNlIiwidmVydGV4RGF0YSIsIkZsb2F0MzJBcnJheSIsIlRFUlJBSU5fQkxPQ0tfVkVSVEVYX1NJWkUiLCJURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZIiwiaW5kZXgiLCJ4IiwieSIsInBvc2l0aW9uIiwiZ2V0UG9zaXRpb24iLCJub3JtYWwiLCJnZXROb3JtYWwiLCJ1diIsIlZlYzIiLCJ6IiwidmVydGV4QnVmZmVyIiwiY3JlYXRlQnVmZmVyIiwiR0ZYQnVmZmVySW5mbyIsIkdGWEJ1ZmZlclVzYWdlQml0IiwiVkVSVEVYIiwiVFJBTlNGRVJfRFNUIiwiR0ZYTWVtb3J5VXNhZ2VCaXQiLCJIT1NUIiwiREVWSUNFIiwiQllURVNfUEVSX0VMRU1FTlQiLCJ1cGRhdGUiLCJnZnhBdHRyaWJ1dGVzIiwiR0ZYQXR0cmlidXRlIiwiR0ZYQXR0cmlidXRlTmFtZSIsIkFUVFJfUE9TSVRJT04iLCJHRlhGb3JtYXQiLCJSR0IzMkYiLCJBVFRSX05PUk1BTCIsIkFUVFJfVEVYX0NPT1JEIiwiUkczMkYiLCJSZW5kZXJpbmdTdWJNZXNoIiwiR0ZYUHJpbWl0aXZlTW9kZSIsIlRSSUFOR0xFX0xJU1QiLCJfZ2V0U2hhcmVkSW5kZXhCdWZmZXIiLCJtb2RlbCIsImNyZWF0ZU1vZGVsIiwic2NlbmUiLCJNb2RlbCIsInRyYW5zZm9ybSIsIl9nZXRSZW5kZXJTY2VuZSIsImFkZE1vZGVsIiwiX3VwZGF0ZVdlaWdodE1hcCIsIl91cGRhdGVNYXRlcmlhbCIsIl91cGRhdGVIZWlnaHQiLCJfaW52YWxpZE1hdGVyaWFsIiwiZGVzdHJveSIsIm5sYXllcnMiLCJ1dlNjYWxlIiwiVmVjNCIsImxheWVycyIsImwwIiwiZ2V0TGF5ZXIiLCJzZXRQcm9wZXJ0eSIsImRldGFpbE1hcCIsImwxIiwibDIiLCJsMyIsImxpZ2h0bWFwIiwibGlnaHRtYXBVVlBhcmFtIiwicmVjdCIsIlJlY3QiLCJsYXllcklkIiwiTEFZRVJTIiwiTElHSFRfTUFQIiwidmVydGV4QnVmZmVycyIsIlRleHR1cmUyRCIsImNyZWF0ZSIsIndlaWdodE1hcFNpemUiLCJQaXhlbEZvcm1hdCIsIlJHQkE4ODg4Iiwic2V0RmlsdGVycyIsIkZpbHRlciIsIkxJTkVBUiIsInNldFdyYXBNb2RlIiwiV3JhcE1vZGUiLCJDTEFNUF9UT19FREdFIiwid2VpZ2h0RGF0YSIsIlVpbnQ4QXJyYXkiLCJ3ZWlnaHRJbmRleCIsInciLCJnZXRXZWlnaHQiLCJNYXRoIiwiZmxvb3IiLCJ1cGxvYWREYXRhIiwiaW5mbyIsInRleHR1cmUiLCJVT2ZmIiwiVk9mZiIsIlVTY2FsZSIsIlZTY2FsZSIsIlRlcnJhaW4iLCJUZXJyYWluQXNzZXQiLCJFZmZlY3RBc3NldCIsImV4ZWN1dGVJbkVkaXRNb2RlIiwiZGlzYWxsb3dNdWx0aXBsZSIsIl90aWxlU2l6ZSIsIl9ibG9ja0NvdW50IiwiX3dlaWdodE1hcFNpemUiLCJfbGlnaHRNYXBTaXplIiwiX2hlaWdodHMiLCJVaW50MTZBcnJheSIsIl93ZWlnaHRzIiwiX25vcm1hbHMiLCJfYmxvY2tzIiwiX3NoYXJlZEluZGV4QnVmZmVyIiwiVEVSUkFJTl9NQVhfTEFZRVJfQ09VTlQiLCJfbGF5ZXJzIiwibGlnaHRNYXBTaXplIiwiX2J1aWxkSW1wIiwiYmxvY2tJbmZvcyIsIm1pbiIsImgiLCJpbmRleDAiLCJpbmRleDEiLCJfYmxvY2tJbmZvcyIsIl9yZWJ1aWxkSGVpZ2h0cyIsIl9yZWJ1aWxkV2VpZ2h0cyIsIl9idWlsZE5vcm1hbHMiLCJidWlsZCIsImhmIiwiaGVpZ2h0U2NhbGUiLCJ2ZXJ0ZXhDb3VudCIsInUiLCJ2IiwiZ2V0QXQiLCJzaXplIiwiZ2V0SGVpZ2h0QXQiLCJkYXRhIiwiYXNzZXQiLCJoZWlnaHRzIiwid2VpZ2h0cyIsImxheWVyQnVmZmVyIiwiQXJyYXkiLCJsZW5ndGgiLCJ0ZW1wIiwibGF5ZXIiLCJUZXJyYWluTGF5ZXJJbmZvIiwic2xvdCIsIl91dWlkIiwibGF5ZXJJbmZvcyIsIl9lZmZlY3RBc3NldCIsImluZGV4RGF0YSIsImEiLCJiIiwiYyIsImQiLCJJTkRFWCIsIm9uRGlzYWJsZSIsIm9uTG9hZCIsImRlbHRhVGltZSIsImlkIiwiZ2V0SGVpZ2h0IiwiVmVjMyIsIlRFUlJBSU5fSEVJR0hUX0ZNSU4iLCJURVJSQUlOX0hFSUdIVF9GTUFYIiwiVEVSUkFJTl9IRUlHSFRfQkFTRSIsIlRFUlJBSU5fSEVJR0hUX0ZBQ1RPUlkiLCJmeCIsImZ5IiwiaXgwIiwiaXowIiwiaXgxIiwiaXoxIiwiZHgiLCJkeiIsIm0iLCJoMSIsImgyIiwibiIsImFkZCIsIm11bHRpcGx5U2NhbGFyIiwic2V0Iiwic3VidHJhY3QiLCJuMSIsIm4yIiwibGVycCIsInN0YXJ0IiwiZGlyIiwic3RlcCIsIndvcmxkU3BhY2UiLCJNQVhfQ09VTlQiLCJ0cmFjZSIsImdldFdvcmxkUG9zaXRpb24iLCJkZWx0YSIsImVxdWFscyIsImVuYmxlIiwiX2xpZ2h0bWFwSW5mb3MiLCJibG9ja0lkIiwidGV4IiwidU9mZiIsInZPZmYiLCJ1U2NhbGUiLCJ2U2NhbGUiLCJfdXBkYXRlTGlnaHRtYXAiLCJmbGlwIiwiaGVyZSIsInJpZ2h0IiwidXAiLCJjcm9zcyIsIm5vcm1hbGl6ZSIsIl9jYWxjTm9ybWFsIiwicmVzdG9yZSIsInZhbGlkIiwiX19hc3NldCIsImluaXRpYWwiLCJfYXNzZXQiLCJsb2FkZXIiLCJsb2FkUmVzIiwiZXJyIiwid2VpZ2h0TWFwQ29tcGxleGl0eVUiLCJ3ZWlnaHRNYXBDb21wbGV4aXR5ViIsIm9sZFdlaWdodE1hcFNpemUiLCJvbGRXZWlnaHRNYXBDb21wbGV4aXR5VSIsIm9sZFdlaWdodE1hcENvbXBsZXhpdHlWIiwiZ2V0T2xkV2VpZ2h0IiwiX2kiLCJfaiIsIndlaWdodCIsInNhbXBsZU9sZFdlaWdodCIsIl94IiwiX3kiLCJfeE9mZiIsIl95T2ZmIiwiZHUiLCJkdiIsInZhbHVlIiwidGkiLCJDb21wb25lbnQiLCJkaXNhbGxvd0FuaW1hdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE0QkE7Ozs7TUFLYUEsVyxXQURaLHFCQUFRLGdCQUFSLEM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFrQ0c7Ozs7MEJBSW1CO0FBQ2YsWUFBTUMsRUFBRSxHQUFHLElBQUlDLFlBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixDQUFYO0FBQ0FELFFBQUFBLEVBQUUsQ0FBQ0UsS0FBSCxHQUFXLEtBQUtDLFVBQUwsQ0FBZ0IsQ0FBaEIsSUFBcUJDLDJDQUFyQixHQUFxRCxLQUFLQyxRQUFyRTtBQUNBTCxRQUFBQSxFQUFFLENBQUNNLE1BQUgsR0FBWSxLQUFLSCxVQUFMLENBQWdCLENBQWhCLElBQXFCQywyQ0FBckIsR0FBcUQsS0FBS0MsUUFBdEU7QUFFQSxlQUFPTCxFQUFQO0FBQ0g7QUFFRDs7Ozs7OzswQkFJd0I7QUFDcEIsWUFBTU8sVUFBVSxHQUFHLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBbkI7QUFDQUEsUUFBQUEsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQixLQUFLSixVQUFMLENBQWdCLENBQWhCLElBQXFCQywyQ0FBckM7QUFDQUcsUUFBQUEsVUFBVSxDQUFDLENBQUQsQ0FBVixHQUFnQixLQUFLSixVQUFMLENBQWdCLENBQWhCLElBQXFCQywyQ0FBckM7QUFFQSxlQUFPRyxVQUFQO0FBQ0g7QUFFRDs7Ozs7OzswQkFJMEI7QUFDdEIsWUFBTUMsWUFBWSxHQUFHLEtBQUtDLFNBQTFCO0FBQ0FELFFBQUFBLFlBQVksQ0FBQyxDQUFELENBQVosSUFBbUIsQ0FBbkI7QUFDQUEsUUFBQUEsWUFBWSxDQUFDLENBQUQsQ0FBWixJQUFtQixDQUFuQjtBQUVBLGVBQU9BLFlBQVA7QUFDSDs7Ozt3RkE5REFFLG9CLEVBQ0FDLGdCOzs7OzthQUN5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QkFJZTtBQUNYLGVBQU8sS0FBS0UsUUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSWE7QUFDVCxlQUFPLEtBQUtFLE9BQUwsQ0FBYThCLE1BQWIsR0FBc0IsQ0FBN0I7QUFDSDtBQUVEOzs7Ozs7OzBCQUttQjtBQUNmLFlBQU02RixFQUFFLEdBQUcsSUFBSWxULFdBQUosRUFBWDtBQUNBa1QsUUFBQUEsRUFBRSxDQUFDNVMsUUFBSCxHQUFjLEtBQUtBLFFBQW5CO0FBQ0E0UyxRQUFBQSxFQUFFLENBQUM5UyxVQUFILENBQWMsQ0FBZCxJQUFtQixLQUFLQSxVQUFMLENBQWdCLENBQWhCLENBQW5CO0FBQ0E4UyxRQUFBQSxFQUFFLENBQUM5UyxVQUFILENBQWMsQ0FBZCxJQUFtQixLQUFLQSxVQUFMLENBQWdCLENBQWhCLENBQW5CO0FBQ0E4UyxRQUFBQSxFQUFFLENBQUMvSixhQUFILEdBQW1CLEtBQUtBLGFBQXhCO0FBQ0ErSixRQUFBQSxFQUFFLENBQUN2SCxZQUFILEdBQWtCLEtBQUtBLFlBQXZCO0FBRUEsZUFBT3VILEVBQVA7QUFDSDs7OztJQTNMd0JDLGlCLDhGQUV4QnhTLG9CLEVBQ0F5Uyx5Qjs7Ozs7YUFDc0MsSTs7NEZBR3RDelMsb0IsRUFDQXlTLHlCOzs7OzthQUUwQyxJOzt3RkFHMUN6UyxvQixFQUNBeVMseUI7Ozs7O2FBQzBDLEU7O29GQUUxQ3pTLG9CLEVBQ0F5Uyx5Qjs7Ozs7YUFDMkMsRTs7dUZBRTNDelMsb0IsRUFDQXlTLHlCOzs7OzthQUNzRCxFIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSB0ZXJyYWluXHJcbiAqL1xyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi4vY29yZS8zZC9idWlsdGluJztcclxuaW1wb3J0IHsgUmVuZGVyYWJsZUNvbXBvbmVudCB9IGZyb20gJy4uL2NvcmUvM2QvZnJhbWV3b3JrL3JlbmRlcmFibGUtY29tcG9uZW50JztcclxuaW1wb3J0IHsgRWZmZWN0QXNzZXQsIFRleHR1cmUyRCB9IGZyb20gJy4uL2NvcmUvYXNzZXRzJztcclxuaW1wb3J0IHsgRmlsdGVyLCBQaXhlbEZvcm1hdCwgV3JhcE1vZGUgfSBmcm9tICcuLi9jb3JlL2Fzc2V0cy9hc3NldC1lbnVtJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi9jb3JlL2Fzc2V0cy9tYXRlcmlhbCc7XHJcbmltcG9ydCB7IFJlbmRlcmluZ1N1Yk1lc2ggfSBmcm9tICcuLi9jb3JlL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29yZS9jb21wb25lbnRzJztcclxuaW1wb3J0IHsgY2NjbGFzcywgZGlzYWxsb3dNdWx0aXBsZSwgZXhlY3V0ZUluRWRpdE1vZGUsIGhlbHAsIHZpc2libGUsIHR5cGUsIHNlcmlhbGl6YWJsZSwgZWRpdGFibGUsIGRpc2FsbG93QW5pbWF0aW9uIH0gZnJvbSAnY2MuZGVjb3JhdG9yJztcclxuaW1wb3J0IHsgaXNWYWxpZCB9IGZyb20gJy4uL2NvcmUvZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgeyBkaXJlY3RvciB9IGZyb20gJy4uL2NvcmUvZGlyZWN0b3InO1xyXG5pbXBvcnQgeyBHRlhCdWZmZXIsIEdGWEJ1ZmZlckluZm8gfSBmcm9tICcuLi9jb3JlL2dmeC9idWZmZXInO1xyXG5pbXBvcnQgeyBHRlhBdHRyaWJ1dGVOYW1lLCBHRlhCdWZmZXJVc2FnZUJpdCwgR0ZYRm9ybWF0LCBHRlhNZW1vcnlVc2FnZUJpdCwgR0ZYUHJpbWl0aXZlTW9kZSB9IGZyb20gJy4uL2NvcmUvZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IEdGWERldmljZSB9IGZyb20gJy4uL2NvcmUvZ2Z4L2RldmljZSc7XHJcbmltcG9ydCB7IEdGWEF0dHJpYnV0ZSB9IGZyb20gJy4uL2NvcmUvZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IGNsYW1wLCBSZWN0LCBTaXplLCBWZWMyLCBWZWMzLCBWZWM0IH0gZnJvbSAnLi4vY29yZS9tYXRoJztcclxuaW1wb3J0IHsgTWFjcm9SZWNvcmQgfSBmcm9tICcuLi9jb3JlL3JlbmRlcmVyL2NvcmUvcGFzcy11dGlscyc7XHJcbmltcG9ydCB7IHNjZW5lIH0gZnJvbSAnLi4vY29yZS9yZW5kZXJlcic7XHJcbmltcG9ydCB7IFJvb3QgfSBmcm9tICcuLi9jb3JlL3Jvb3QnO1xyXG5pbXBvcnQgeyBQcml2YXRlTm9kZSB9IGZyb20gJy4uL2NvcmUvc2NlbmUtZ3JhcGgvcHJpdmF0ZS1ub2RlJztcclxuaW1wb3J0IHsgSGVpZ2h0RmllbGQgfSBmcm9tICcuL2hlaWdodC1maWVsZCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vY29yZS9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IFRlcnJhaW5Bc3NldCwgVGVycmFpbkxheWVySW5mbywgVEVSUkFJTl9IRUlHSFRfQkFTRSwgVEVSUkFJTl9IRUlHSFRfRkFDVE9SWSxcclxuICAgIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZLCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9TSVpFLCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZLFxyXG4gICAgVEVSUkFJTl9NQVhfTEFZRVJfQ09VTlQsIFRFUlJBSU5fSEVJR0hUX0ZNSU4sIFRFUlJBSU5fSEVJR0hUX0ZNQVgsIH0gZnJvbSAnLi90ZXJyYWluLWFzc2V0JztcclxuXHJcbi8qKlxyXG4gKiBAZW4gVGVycmFpbiBpbmZvXHJcbiAqIEB6aCDlnLDlvaLkv6Hmga9cclxuICovXHJcbkBjY2NsYXNzKCdjYy5UZXJyYWluSW5mbycpXHJcbmV4cG9ydCBjbGFzcyBUZXJyYWluSW5mbyB7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiB0aWxlIHNpemVcclxuICAgICAqIEB6aCDmoIXmoLzlpKflsI9cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgdGlsZVNpemU6IG51bWJlciA9IDE7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYmxvY2sgY291bnRcclxuICAgICAqIEB6aCDlnLDlvaLlnZfnmoTmlbDph49cclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgYmxvY2tDb3VudDogbnVtYmVyW10gPSBbMSwgMV07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gd2VpZ2h0IG1hcCBzaXplXHJcbiAgICAgKiBAemgg5p2D6YeN5Zu+5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIHdlaWdodE1hcFNpemU6IG51bWJlciA9IDEyODtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBsaWdodCBtYXAgc2l6ZVxyXG4gICAgICogQHpoIOWFieeFp+WbvuWkp+Wwj1xyXG4gICAgICovXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBsaWdodE1hcFNpemU6IG51bWJlciA9IDEyODtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiB0ZXJyYWluIHNpemVcclxuICAgICAqIEB6aCDlnLDlvaLlpKflsI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzaXplICgpIHtcclxuICAgICAgICBjb25zdCBzeiA9IG5ldyBTaXplKDAsIDApO1xyXG4gICAgICAgIHN6LndpZHRoID0gdGhpcy5ibG9ja0NvdW50WzBdICogVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFkgKiB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgIHN6LmhlaWdodCA9IHRoaXMuYmxvY2tDb3VudFsxXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICogdGhpcy50aWxlU2l6ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN6O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIHRpbGUgY291bnRcclxuICAgICAqIEB6aCDmoIXmoLzmlbDph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB0aWxlQ291bnQgKCkge1xyXG4gICAgICAgIGNvbnN0IF90aWxlQ291bnQgPSBbMCwgMF07XHJcbiAgICAgICAgX3RpbGVDb3VudFswXSA9IHRoaXMuYmxvY2tDb3VudFswXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZO1xyXG4gICAgICAgIF90aWxlQ291bnRbMV0gPSB0aGlzLmJsb2NrQ291bnRbMV0gKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWTtcclxuXHJcbiAgICAgICAgcmV0dXJuIF90aWxlQ291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gdmVydGV4IGNvdW50XHJcbiAgICAgKiBAemgg6aG254K55pWw6YePXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgdmVydGV4Q291bnQgKCkge1xyXG4gICAgICAgIGNvbnN0IF92ZXJ0ZXhDb3VudCA9IHRoaXMudGlsZUNvdW50O1xyXG4gICAgICAgIF92ZXJ0ZXhDb3VudFswXSArPSAxO1xyXG4gICAgICAgIF92ZXJ0ZXhDb3VudFsxXSArPSAxO1xyXG5cclxuICAgICAgICByZXR1cm4gX3ZlcnRleENvdW50O1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIFRlcnJhaW4gbGF5ZXJcclxuICogQHpoIOWcsOW9oue6ueeQhuWxglxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlRlcnJhaW5MYXllcicpXHJcbmV4cG9ydCBjbGFzcyBUZXJyYWluTGF5ZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZGV0YWlsIHRleHR1cmVcclxuICAgICAqIEB6aCDnu4boioLnurnnkIZcclxuICAgICAqL1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgZGV0YWlsTWFwOiBUZXh0dXJlMkR8bnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gdGlsZSBzaXplXHJcbiAgICAgKiBAemgg5bmz6ZO65aSn5bCPXHJcbiAgICAgKi9cclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIHRpbGVTaXplOiBudW1iZXIgPSAxO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFRlcnJhaW4gcmVuZGVyYWJsZVxyXG4gKiBAemgg5Zyw5b2i5riy5p+T57uE5Lu2XHJcbiAqL1xyXG5jbGFzcyBUZXJyYWluUmVuZGVyYWJsZSBleHRlbmRzIFJlbmRlcmFibGVDb21wb25lbnQge1xyXG4gICAgcHVibGljIF9tb2RlbDogc2NlbmUuTW9kZWwgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBfbWVzaERhdGE6IFJlbmRlcmluZ1N1Yk1lc2ggfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwdWJsaWMgX2JydXNoTWF0ZXJpYWw6IE1hdGVyaWFsIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgX2N1cnJlbnRNYXRlcmlhbDogTWF0ZXJpYWwgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyBfY3VycmVudE1hdGVyaWFsTGF5ZXJzOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIHB1YmxpYyBkZXN0cm95ICgpIHtcclxuICAgICAgICAvLyB0aGlzLl9pbnZhbGlkTWF0ZXJpYWwoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRlc3Ryb3lNb2RlbCh0aGlzLl9tb2RlbCk7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9pbnZhbGlkTWF0ZXJpYWwgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50TWF0ZXJpYWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jbGVhck1hdGVyaWFscygpO1xyXG5cclxuICAgICAgICB0aGlzLl9jdXJyZW50TWF0ZXJpYWwgPSBudWxsO1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF91cGRhdGVNYXRlcmlhbCAoYmxvY2s6IFRlcnJhaW5CbG9jaywgaW5pdDogYm9vbGVhbikge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXNoRGF0YSA9PSBudWxsIHx8IHRoaXMuX21vZGVsID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbkxheWVycyA9IGJsb2NrLmdldE1heExheWVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnRNYXRlcmlhbCA9PSBudWxsIHx8IG5MYXllcnMgIT09IHRoaXMuX2N1cnJlbnRNYXRlcmlhbExheWVycykge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50TWF0ZXJpYWwgPSBuZXcgTWF0ZXJpYWwoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXRlcmlhbC5pbml0aWFsaXplKHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdEFzc2V0OiBibG9jay5nZXRUZXJyYWluKCkuZ2V0RWZmZWN0QXNzZXQoKSxcclxuICAgICAgICAgICAgICAgIGRlZmluZXM6IGJsb2NrLl9nZXRNYXRlcmlhbERlZmluZXMobkxheWVycyksXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2JydXNoTWF0ZXJpYWwgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBhc3NlcyA9IHRoaXMuX2N1cnJlbnRNYXRlcmlhbC5wYXNzZXM7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFzc2VzLnB1c2godGhpcy5fYnJ1c2hNYXRlcmlhbC5wYXNzZXNbMF0pO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5pdCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbW9kZWwuaW5pdFN1Yk1vZGVsKDAsIHRoaXMuX21lc2hEYXRhLCB0aGlzLl9jdXJyZW50TWF0ZXJpYWwpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNldE1hdGVyaWFsKHRoaXMuX2N1cnJlbnRNYXRlcmlhbCwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJlbnRNYXRlcmlhbExheWVycyA9IG5MYXllcnM7XHJcbiAgICAgICAgICAgIHRoaXMuX21vZGVsLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX29uTWF0ZXJpYWxNb2RpZmllZCAoaWR4OiBudW1iZXIsIG10bDogTWF0ZXJpYWx8bnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fb25SZWJ1aWxkUFNPKGlkeCwgbXRsIHx8IHRoaXMuX2dldEJ1aWx0aW5NYXRlcmlhbCgpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX29uUmVidWlsZFBTTyAoaWR4OiBudW1iZXIsIG1hdGVyaWFsOiBNYXRlcmlhbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbC5zZXRTdWJNb2RlbE1hdGVyaWFsKGlkeCwgbWF0ZXJpYWwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgX2NsZWFyTWF0ZXJpYWxzICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWwgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9vbk1hdGVyaWFsTW9kaWZpZWQoMCwgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0QnVpbHRpbk1hdGVyaWFsICgpIHtcclxuICAgICAgICByZXR1cm4gYnVpbHRpblJlc01nci5nZXQ8TWF0ZXJpYWw+KCdtaXNzaW5nLW1hdGVyaWFsJyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gVGVycmFpbiBibG9jayBpbmZvXHJcbiAqIEB6aCDlnLDlvaLlnZfkv6Hmga9cclxuICovXHJcbkBjY2NsYXNzKCdjYy5UZXJyYWluQmxvY2tJbmZvJylcclxuZXhwb3J0IGNsYXNzIFRlcnJhaW5CbG9ja0luZm8ge1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgbGF5ZXJzOiBudW1iZXJbXSA9IFstMSwgLTEsIC0xLCAtMV07XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gVGVycmFpbiBibG9jayBsaWdodCBtYXAgaW5mb1xyXG4gKiBAemgg5Zyw5b2i5Z2X5YWJ54Wn5Zu+5L+h5oGvXHJcbiAqL1xyXG5AY2NjbGFzcygnY2MuVGVycmFpbkJsb2NrTGlnaHRtYXBJbmZvJylcclxuZXhwb3J0IGNsYXNzIFRlcnJhaW5CbG9ja0xpZ2h0bWFwSW5mbyB7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyB0ZXh0dXJlOiBUZXh0dXJlMkR8bnVsbCA9IG51bGw7XHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZWRpdGFibGVcclxuICAgIHB1YmxpYyBVT2ZmOiBudW1iZXIgPSAwO1xyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGVkaXRhYmxlXHJcbiAgICBwdWJsaWMgVk9mZjogbnVtYmVyID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIFVTY2FsZTogbnVtYmVyID0gMDtcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBlZGl0YWJsZVxyXG4gICAgcHVibGljIFZTY2FsZTogbnVtYmVyID0gMDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBUZXJyYWluIGJsb2NrXHJcbiAqIEB6aCDlnLDlvaLlnZdcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUZXJyYWluQmxvY2sge1xyXG4gICAgcHJpdmF0ZSBfdGVycmFpbjogVGVycmFpbjtcclxuICAgIHByaXZhdGUgX2luZm86IFRlcnJhaW5CbG9ja0luZm87XHJcbiAgICBwcml2YXRlIF9ub2RlOiBQcml2YXRlTm9kZTtcclxuICAgIHByaXZhdGUgX3JlbmRlcmFibGU6IFRlcnJhaW5SZW5kZXJhYmxlO1xyXG4gICAgcHJpdmF0ZSBfaW5kZXg6IG51bWJlcltdID0gWzEsIDFdO1xyXG4gICAgLy8gcHJpdmF0ZSBfbmVpZ2hib3I6IFRlcnJhaW5CbG9ja3xudWxsW10gPSBbbnVsbCwgbnVsbCwgbnVsbCwgbnVsbF07XHJcbiAgICBwcml2YXRlIF93ZWlnaHRNYXA6IFRleHR1cmUyRHxudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2xpZ2h0bWFwSW5mbzogVGVycmFpbkJsb2NrTGlnaHRtYXBJbmZvfG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICh0OiBUZXJyYWluLCBpOiBudW1iZXIsIGo6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX3RlcnJhaW4gPSB0O1xyXG4gICAgICAgIHRoaXMuX2luZm8gPSB0LmdldEJsb2NrSW5mbyhpLCBqKTtcclxuICAgICAgICB0aGlzLl9pbmRleFswXSA9IGk7XHJcbiAgICAgICAgdGhpcy5faW5kZXhbMV0gPSBqO1xyXG4gICAgICAgIHRoaXMuX2xpZ2h0bWFwSW5mbyA9IHQuX2dldExpZ2h0bWFwSW5mbyhpLCBqKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5ldyBQcml2YXRlTm9kZSgnJyk7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX25vZGUuc2V0UGFyZW50KHRoaXMuX3RlcnJhaW4ubm9kZSk7XHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX25vZGUuX29iakZsYWdzIHw9IGxlZ2FjeUNDLk9iamVjdC5GbGFncy5Eb250U2F2ZTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyYWJsZSA9IHRoaXMuX25vZGUuYWRkQ29tcG9uZW50KFRlcnJhaW5SZW5kZXJhYmxlKSBhcyBUZXJyYWluUmVuZGVyYWJsZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYnVpbGQgKCkge1xyXG4gICAgICAgIGNvbnN0IGdmeERldmljZSA9IGRpcmVjdG9yLnJvb3QhLmRldmljZSBhcyBHRlhEZXZpY2U7XHJcblxyXG4gICAgICAgIC8vIHZlcnRleCBidWZmZXJcclxuICAgICAgICBjb25zdCB2ZXJ0ZXhEYXRhID0gbmV3IEZsb2F0MzJBcnJheShURVJSQUlOX0JMT0NLX1ZFUlRFWF9TSVpFICogVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSAqIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFkpO1xyXG4gICAgICAgIGxldCBpbmRleCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZOyArK2opIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9pbmRleFswXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICsgaTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLl9pbmRleFsxXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICsgajtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fdGVycmFpbi5nZXRQb3NpdGlvbih4LCB5KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuX3RlcnJhaW4uZ2V0Tm9ybWFsKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXYgPSBuZXcgVmVjMihpIC8gVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFksIGogLyBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWSk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gcG9zaXRpb24ueDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSBwb3NpdGlvbi55O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVtpbmRleCsrXSA9IHBvc2l0aW9uLno7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gbm9ybWFsLng7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gbm9ybWFsLnk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gbm9ybWFsLno7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gdXYueDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSB1di55O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0ZXhCdWZmZXIgPSBnZnhEZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5WRVJURVggfCBHRlhCdWZmZXJVc2FnZUJpdC5UUkFOU0ZFUl9EU1QsXHJcbiAgICAgICAgICAgIEdGWE1lbW9yeVVzYWdlQml0LkhPU1QgfCBHRlhNZW1vcnlVc2FnZUJpdC5ERVZJQ0UsXHJcbiAgICAgICAgICAgIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX1NJWkUgKiBGbG9hdDMyQXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZICogVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSxcclxuICAgICAgICAgICAgVEVSUkFJTl9CTE9DS19WRVJURVhfU0laRSAqIEZsb2F0MzJBcnJheS5CWVRFU19QRVJfRUxFTUVOVCxcclxuICAgICAgICApKTtcclxuICAgICAgICB2ZXJ0ZXhCdWZmZXIudXBkYXRlKHZlcnRleERhdGEpO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIHJlbmRlcmFibGVcclxuICAgICAgICBjb25zdCBnZnhBdHRyaWJ1dGVzOiBHRlhBdHRyaWJ1dGVbXSA9IFtcclxuICAgICAgICAgICAgbmV3IEdGWEF0dHJpYnV0ZShHRlhBdHRyaWJ1dGVOYW1lLkFUVFJfUE9TSVRJT04sIEdGWEZvcm1hdC5SR0IzMkYpLFxyXG4gICAgICAgICAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9OT1JNQUwsIEdGWEZvcm1hdC5SR0IzMkYpLFxyXG4gICAgICAgICAgICBuZXcgR0ZYQXR0cmlidXRlKEdGWEF0dHJpYnV0ZU5hbWUuQVRUUl9URVhfQ09PUkQsIEdGWEZvcm1hdC5SRzMyRiksXHJcbiAgICAgICAgXTtcclxuXHJcbiAgICAgICAgdGhpcy5fcmVuZGVyYWJsZS5fbWVzaERhdGEgPSBuZXcgUmVuZGVyaW5nU3ViTWVzaChbdmVydGV4QnVmZmVyXSwgZ2Z4QXR0cmlidXRlcyxcclxuICAgICAgICAgICAgR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9MSVNULCB0aGlzLl90ZXJyYWluLl9nZXRTaGFyZWRJbmRleEJ1ZmZlcigpKTtcclxuXHJcbiAgICAgICAgY29uc3QgbW9kZWwgPSB0aGlzLl9yZW5kZXJhYmxlLl9tb2RlbCA9IChsZWdhY3lDQy5kaXJlY3Rvci5yb290IGFzIFJvb3QpLmNyZWF0ZU1vZGVsKHNjZW5lLk1vZGVsKTtcclxuICAgICAgICBtb2RlbC5ub2RlID0gbW9kZWwudHJhbnNmb3JtID0gdGhpcy5fbm9kZTtcclxuICAgICAgICB0aGlzLl9yZW5kZXJhYmxlLl9nZXRSZW5kZXJTY2VuZSgpLmFkZE1vZGVsKG1vZGVsKTtcclxuXHJcbiAgICAgICAgLy8gcmVzZXQgd2VpZ2h0bWFwXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlV2VpZ2h0TWFwKCk7XHJcblxyXG4gICAgICAgIC8vIHJlc2V0IG1hdGVyaWFsXHJcbiAgICAgICAgdGhpcy5fdXBkYXRlTWF0ZXJpYWwodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlYnVpbGQgKCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUhlaWdodCgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVdlaWdodE1hcCgpO1xyXG5cclxuICAgICAgICB0aGlzLl9yZW5kZXJhYmxlLl9pbnZhbGlkTWF0ZXJpYWwoKTtcclxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbChmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJhYmxlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyYWJsZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl9ub2RlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbm9kZS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLl93ZWlnaHRNYXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLl93ZWlnaHRNYXAuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgdXBkYXRlICgpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbChmYWxzZSk7XHJcblxyXG4gICAgICAgIGNvbnN0IG10bCA9IHRoaXMuX3JlbmRlcmFibGUuX2N1cnJlbnRNYXRlcmlhbDtcclxuICAgICAgICBpZiAobXRsICE9IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbmxheWVycyA9IHRoaXMuZ2V0TWF4TGF5ZXIoKTtcclxuICAgICAgICAgICAgY29uc3QgdXZTY2FsZSA9IG5ldyBWZWM0KDEsIDEsIDEsIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5sYXllcnMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmxheWVyc1swXSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBsMCA9IHRoaXMuX3RlcnJhaW4uZ2V0TGF5ZXIodGhpcy5sYXllcnNbMF0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobDAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1dlNjYWxlLnggPSAxLjAgLyBsMC50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG10bC5zZXRQcm9wZXJ0eSgnZGV0YWlsTWFwMCcsIGwwICE9IG51bGwgPyBsMC5kZXRhaWxNYXAgOiBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG10bC5zZXRQcm9wZXJ0eSgnZGV0YWlsTWFwMCcsIGxlZ2FjeUNDLmJ1aWx0aW5SZXNNZ3IuZ2V0KCdkZWZhdWx0LXRleHR1cmUnKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobmxheWVycyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbDAgPSB0aGlzLl90ZXJyYWluLmdldExheWVyKHRoaXMubGF5ZXJzWzBdKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGwxID0gdGhpcy5fdGVycmFpbi5nZXRMYXllcih0aGlzLmxheWVyc1sxXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGwwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dlNjYWxlLnggPSAxLjAgLyBsMC50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsMSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXZTY2FsZS55ID0gMS4wIC8gbDEudGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCd3ZWlnaHRNYXAnLCB0aGlzLl93ZWlnaHRNYXApO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdkZXRhaWxNYXAwJywgbDAgIT0gbnVsbCA/IGwwLmRldGFpbE1hcCA6IG51bGwpO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdkZXRhaWxNYXAxJywgbDEgIT0gbnVsbCA/IGwxLmRldGFpbE1hcCA6IG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5sYXllcnMgPT09IDIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGwwID0gdGhpcy5fdGVycmFpbi5nZXRMYXllcih0aGlzLmxheWVyc1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsMSA9IHRoaXMuX3RlcnJhaW4uZ2V0TGF5ZXIodGhpcy5sYXllcnNbMV0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbDIgPSB0aGlzLl90ZXJyYWluLmdldExheWVyKHRoaXMubGF5ZXJzWzJdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAobDAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV2U2NhbGUueCA9IDEuMCAvIGwwLnRpbGVTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGwxICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dlNjYWxlLnkgPSAxLjAgLyBsMS50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsMiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXZTY2FsZS56ID0gMS4wIC8gbDIudGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCd3ZWlnaHRNYXAnLCB0aGlzLl93ZWlnaHRNYXApO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdkZXRhaWxNYXAwJywgbDAgIT0gbnVsbCA/IGwwLmRldGFpbE1hcCA6IG51bGwpO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdkZXRhaWxNYXAxJywgbDEgIT0gbnVsbCA/IGwxLmRldGFpbE1hcCA6IG51bGwpO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdkZXRhaWxNYXAyJywgbDIgIT0gbnVsbCA/IGwyLmRldGFpbE1hcCA6IG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5sYXllcnMgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGwwID0gdGhpcy5fdGVycmFpbi5nZXRMYXllcih0aGlzLmxheWVyc1swXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBsMSA9IHRoaXMuX3RlcnJhaW4uZ2V0TGF5ZXIodGhpcy5sYXllcnNbMV0pO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbDIgPSB0aGlzLl90ZXJyYWluLmdldExheWVyKHRoaXMubGF5ZXJzWzJdKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGwzID0gdGhpcy5fdGVycmFpbi5nZXRMYXllcih0aGlzLmxheWVyc1szXSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGwwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dlNjYWxlLnggPSAxLjAgLyBsMC50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChsMSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXZTY2FsZS55ID0gMS4wIC8gbDEudGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobDIgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHV2U2NhbGUueiA9IDEuMCAvIGwyLnRpbGVTaXplO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGwzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICB1dlNjYWxlLnogPSAxLjAgLyBsMy50aWxlU2l6ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtdGwuc2V0UHJvcGVydHkoJ3dlaWdodE1hcCcsIHRoaXMuX3dlaWdodE1hcCk7XHJcbiAgICAgICAgICAgICAgICBtdGwuc2V0UHJvcGVydHkoJ2RldGFpbE1hcDAnLCBsMCAhPSBudWxsID8gbDAuZGV0YWlsTWFwIDogbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBtdGwuc2V0UHJvcGVydHkoJ2RldGFpbE1hcDEnLCBsMSAhPSBudWxsID8gbDEuZGV0YWlsTWFwIDogbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBtdGwuc2V0UHJvcGVydHkoJ2RldGFpbE1hcDInLCBsMiAhPSBudWxsID8gbDIuZGV0YWlsTWFwIDogbnVsbCk7XHJcbiAgICAgICAgICAgICAgICBtdGwuc2V0UHJvcGVydHkoJ2RldGFpbE1hcDMnLCBsMyAhPSBudWxsID8gbDMuZGV0YWlsTWFwIDogbnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG10bC5zZXRQcm9wZXJ0eSgnVVZTY2FsZScsIHV2U2NhbGUpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMubGlnaHRtYXAgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdsaWdodE1hcCcsIHRoaXMubGlnaHRtYXApO1xyXG4gICAgICAgICAgICAgICAgbXRsLnNldFByb3BlcnR5KCdsaWdodE1hcFVWUGFyYW0nLCB0aGlzLmxpZ2h0bWFwVVZQYXJhbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldEJydXNoTWF0ZXJpYWwgKG10bDogTWF0ZXJpYWx8bnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9yZW5kZXJhYmxlLl9icnVzaE1hdGVyaWFsICE9PSBtdGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyYWJsZS5fYnJ1c2hNYXRlcmlhbCA9IG10bDtcclxuICAgICAgICAgICAgdGhpcy5fcmVuZGVyYWJsZS5faW52YWxpZE1hdGVyaWFsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBsYXllcnNcclxuICAgICAqIEB6aCDojrflvpfnurnnkIblsYLntKLlvJVcclxuICAgICAqL1xyXG4gICAgZ2V0IGxheWVycyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2luZm8ubGF5ZXJzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBsaWdodCBtYXBcclxuICAgICAqIEB6aCDojrflvpflhYnnhaflm75cclxuICAgICAqL1xyXG4gICAgZ2V0IGxpZ2h0bWFwICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbGlnaHRtYXBJbmZvID8gdGhpcy5fbGlnaHRtYXBJbmZvLnRleHR1cmUgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBsaWdodCBtYXAgdXYgcGFyYW1ldGVyXHJcbiAgICAgKiBAemgg6I635b6X5YWJ54Wn5Zu+57q555CG5Z2Q5qCH5Y+C5pWwXHJcbiAgICAgKi9cclxuICAgIGdldCBsaWdodG1hcFVWUGFyYW0gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9saWdodG1hcEluZm8gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlYzQodGhpcy5fbGlnaHRtYXBJbmZvLlVPZmYsIHRoaXMuX2xpZ2h0bWFwSW5mby5WT2ZmLCB0aGlzLl9saWdodG1hcEluZm8uVVNjYWxlLCB0aGlzLl9saWdodG1hcEluZm8uVlNjYWxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVjNCgwLCAwLCAwLCAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IHRlcnJhaW4gb3duZXJcclxuICAgICAqIEB6aCDojrflvpflnLDlvaLlr7nosaFcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFRlcnJhaW4gKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZXJyYWluO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBpbmRleFxyXG4gICAgICogQHpoIOiOt+W+l+WcsOW9oue0ouW8lVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0SW5kZXggKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9pbmRleDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgcmVjdCBib3VuZFxyXG4gICAgICogQHpoIOiOt+W+l+WcsOW9ouefqeW9ouWMheWbtOS9k1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UmVjdCAoKSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IG5ldyBSZWN0KCk7XHJcbiAgICAgICAgcmVjdC54ID0gdGhpcy5faW5kZXhbMF0gKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWTtcclxuICAgICAgICByZWN0LnkgPSB0aGlzLl9pbmRleFsxXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZO1xyXG4gICAgICAgIHJlY3Qud2lkdGggPSBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWTtcclxuICAgICAgICByZWN0LmhlaWdodCA9IFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVjdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBzZXQgbGF5ZXJcclxuICAgICAqIEB6aCDorr7nva7nurnnkIblsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldExheWVyIChpbmRleDogbnVtYmVyLCBsYXllcklkOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5sYXllcnNbaW5kZXhdICE9PSBsYXllcklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubGF5ZXJzW2luZGV4XSA9IGxheWVySWQ7XHJcbiAgICAgICAgICAgIHRoaXMuX3JlbmRlcmFibGUuX2ludmFsaWRNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVNYXRlcmlhbChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBsYXllclxyXG4gICAgICogQHpoIOiOt+W+l+e6ueeQhuWxglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TGF5ZXIgKGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5sYXllcnNbaW5kZXhdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBtYXggbGF5ZXIgaW5kZXhcclxuICAgICAqIEB6aCDojrflvpfmnIDlpKfnurnnkIbntKLlvJVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldE1heExheWVyICgpIHtcclxuICAgICAgICBpZiAodGhpcy5sYXllcnNbM10gPj0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMztcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5sYXllcnNbMl0gPj0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodGhpcy5sYXllcnNbMV0gPj0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2dldE1hdGVyaWFsRGVmaW5lcyAobmxheWVyczogbnVtYmVyKTogTWFjcm9SZWNvcmQge1xyXG4gICAgICAgIGlmICh0aGlzLmxpZ2h0bWFwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKG5sYXllcnMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IExBWUVSUzogMSwgTElHSFRfTUFQOiAxIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAobmxheWVycyA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHsgTEFZRVJTOiAyLCBMSUdIVF9NQVA6IDEgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChubGF5ZXJzID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBMQVlFUlM6IDMsIExJR0hUX01BUDogMSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKG5sYXllcnMgPT09IDMpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7IExBWUVSUzogNCwgTElHSFRfTUFQOiAxIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChubGF5ZXJzID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBMQVlFUlM6IDEgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChubGF5ZXJzID09PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBMQVlFUlM6IDIgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChubGF5ZXJzID09PSAyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBMQVlFUlM6IDMgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChubGF5ZXJzID09PSAzKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4geyBMQVlFUlM6IDQgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHsgTEFZRVJTOiAwIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9pbnZhbGlkTWF0ZXJpYWwgKCkge1xyXG4gICAgICAgIHRoaXMuX3JlbmRlcmFibGUuX2ludmFsaWRNYXRlcmlhbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfdXBkYXRlTWF0ZXJpYWwgKGluaXQ6IGJvb2xlYW4pIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXJhYmxlLl91cGRhdGVNYXRlcmlhbCh0aGlzLCBpbml0KTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3VwZGF0ZUhlaWdodCAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlcmFibGUuX21lc2hEYXRhID09IG51bGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdmVydGV4RGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoVEVSUkFJTl9CTE9DS19WRVJURVhfU0laRSAqIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFkgKiBURVJSQUlOX0JMT0NLX1ZFUlRFWF9DT01QTEVYSVRZKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFk7ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFk7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHRoaXMuX2luZGV4WzBdICogVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFkgKyBpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IHRoaXMuX2luZGV4WzFdICogVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFkgKyBqO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gdGhpcy5fdGVycmFpbi5nZXRQb3NpdGlvbih4LCB5KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5vcm1hbCA9IHRoaXMuX3RlcnJhaW4uZ2V0Tm9ybWFsKHgsIHkpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXYgPSBuZXcgVmVjMihpIC8gVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSwgaiAvIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSBwb3NpdGlvbi54O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVtpbmRleCsrXSA9IHBvc2l0aW9uLnk7XHJcbiAgICAgICAgICAgICAgICB2ZXJ0ZXhEYXRhW2luZGV4KytdID0gcG9zaXRpb24uejtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSBub3JtYWwueDtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSBub3JtYWwueTtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSBub3JtYWwuejtcclxuICAgICAgICAgICAgICAgIHZlcnRleERhdGFbaW5kZXgrK10gPSB1di54O1xyXG4gICAgICAgICAgICAgICAgdmVydGV4RGF0YVtpbmRleCsrXSA9IHV2Lnk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmFibGUuX21lc2hEYXRhLnZlcnRleEJ1ZmZlcnNbMF0udXBkYXRlKHZlcnRleERhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfdXBkYXRlV2VpZ2h0TWFwICgpIHtcclxuICAgICAgICBjb25zdCBubGF5ZXJzID0gdGhpcy5nZXRNYXhMYXllcigpO1xyXG5cclxuICAgICAgICBpZiAobmxheWVycyA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fd2VpZ2h0TWFwICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodE1hcC5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWlnaHRNYXAgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fd2VpZ2h0TWFwID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodE1hcCA9IG5ldyBUZXh0dXJlMkQoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodE1hcC5jcmVhdGUodGhpcy5fdGVycmFpbi53ZWlnaHRNYXBTaXplLCB0aGlzLl90ZXJyYWluLndlaWdodE1hcFNpemUsIFBpeGVsRm9ybWF0LlJHQkE4ODg4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodE1hcC5zZXRGaWx0ZXJzKEZpbHRlci5MSU5FQVIsIEZpbHRlci5MSU5FQVIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2VpZ2h0TWFwLnNldFdyYXBNb2RlKFdyYXBNb2RlLkNMQU1QX1RPX0VER0UsIFdyYXBNb2RlLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3ZWlnaHREYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fdGVycmFpbi53ZWlnaHRNYXBTaXplICogdGhpcy5fdGVycmFpbi53ZWlnaHRNYXBTaXplICogNCk7XHJcbiAgICAgICAgbGV0IHdlaWdodEluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX3RlcnJhaW4ud2VpZ2h0TWFwU2l6ZTsgKytqKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdGVycmFpbi53ZWlnaHRNYXBTaXplOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHggPSB0aGlzLl9pbmRleFswXSAqIHRoaXMuX3RlcnJhaW4ud2VpZ2h0TWFwU2l6ZSArIGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5faW5kZXhbMV0gKiB0aGlzLl90ZXJyYWluLndlaWdodE1hcFNpemUgKyBqO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdyA9IHRoaXMuX3RlcnJhaW4uZ2V0V2VpZ2h0KHgsIHkpO1xyXG5cclxuICAgICAgICAgICAgICAgIHdlaWdodERhdGFbd2VpZ2h0SW5kZXggKiA0ICsgMF0gPSBNYXRoLmZsb29yKHcueCAqIDI1NSk7XHJcbiAgICAgICAgICAgICAgICB3ZWlnaHREYXRhW3dlaWdodEluZGV4ICogNCArIDFdID0gTWF0aC5mbG9vcih3LnkgKiAyNTUpO1xyXG4gICAgICAgICAgICAgICAgd2VpZ2h0RGF0YVt3ZWlnaHRJbmRleCAqIDQgKyAyXSA9IE1hdGguZmxvb3Iody56ICogMjU1KTtcclxuICAgICAgICAgICAgICAgIHdlaWdodERhdGFbd2VpZ2h0SW5kZXggKiA0ICsgM10gPSBNYXRoLmZsb29yKHcudyAqIDI1NSk7XHJcblxyXG4gICAgICAgICAgICAgICAgd2VpZ2h0SW5kZXggKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl93ZWlnaHRNYXAudXBsb2FkRGF0YSh3ZWlnaHREYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3VwZGF0ZUxpZ2h0bWFwIChpbmZvOiBUZXJyYWluQmxvY2tMaWdodG1hcEluZm8pIHtcclxuICAgICAgICB0aGlzLl9saWdodG1hcEluZm8gPSBpbmZvO1xyXG4gICAgICAgIHRoaXMuX2ludmFsaWRNYXRlcmlhbCgpO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQGVuIFRlcnJhaW5cclxuICogQHpoIOWcsOW9oue7hOS7tlxyXG4gKi9cclxuQGNjY2xhc3MoJ2NjLlRlcnJhaW4nKVxyXG5AaGVscCgnaTE4bjpjYy5UZXJyYWluJylcclxuQGV4ZWN1dGVJbkVkaXRNb2RlXHJcbkBkaXNhbGxvd011bHRpcGxlXHJcbmV4cG9ydCBjbGFzcyBUZXJyYWluIGV4dGVuZHMgQ29tcG9uZW50IHtcclxuICAgIEB0eXBlKFRlcnJhaW5Bc3NldClcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNhbGxvd0FuaW1hdGlvblxyXG4gICAgcHJvdGVjdGVkIF9fYXNzZXQ6IFRlcnJhaW5Bc3NldHxudWxsID0gbnVsbDtcclxuXHJcbiAgICBAdHlwZShFZmZlY3RBc3NldClcclxuICAgIEBzZXJpYWxpemFibGVcclxuICAgIEBkaXNhbGxvd0FuaW1hdGlvblxyXG4gICAgQHZpc2libGUoZmFsc2UpXHJcbiAgICBwcm90ZWN0ZWQgX2VmZmVjdEFzc2V0OiBFZmZlY3RBc3NldHxudWxsID0gbnVsbDtcclxuXHJcbiAgICBAdHlwZShUZXJyYWluTGF5ZXIpXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzYWxsb3dBbmltYXRpb25cclxuICAgIHByb3RlY3RlZCBfbGF5ZXJzOiAoVGVycmFpbkxheWVyfG51bGwpW10gPSBbXTtcclxuXHJcbiAgICBAc2VyaWFsaXphYmxlXHJcbiAgICBAZGlzYWxsb3dBbmltYXRpb25cclxuICAgIHByb3RlY3RlZCBfYmxvY2tJbmZvczogVGVycmFpbkJsb2NrSW5mb1tdID0gW107XHJcblxyXG4gICAgQHNlcmlhbGl6YWJsZVxyXG4gICAgQGRpc2FsbG93QW5pbWF0aW9uXHJcbiAgICBwcm90ZWN0ZWQgX2xpZ2h0bWFwSW5mb3M6IFRlcnJhaW5CbG9ja0xpZ2h0bWFwSW5mb1tdID0gW107XHJcblxyXG4gICAgcHJvdGVjdGVkIF90aWxlU2l6ZTogbnVtYmVyID0gMTtcclxuICAgIHByb3RlY3RlZCBfYmxvY2tDb3VudDogbnVtYmVyW10gPSBbMSwgMV07XHJcbiAgICBwcm90ZWN0ZWQgX3dlaWdodE1hcFNpemU6IG51bWJlciA9IDEyODtcclxuICAgIHByb3RlY3RlZCBfbGlnaHRNYXBTaXplOiBudW1iZXIgPSAxMjg7XHJcbiAgICBwcm90ZWN0ZWQgX2hlaWdodHM6IFVpbnQxNkFycmF5ID0gbmV3IFVpbnQxNkFycmF5KCk7XHJcbiAgICBwcm90ZWN0ZWQgX3dlaWdodHM6IFVpbnQ4QXJyYXkgPSBuZXcgVWludDhBcnJheSgpO1xyXG4gICAgcHJvdGVjdGVkIF9ub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJvdGVjdGVkIF9ibG9ja3M6IFRlcnJhaW5CbG9ja1tdID0gW107XHJcbiAgICBwcm90ZWN0ZWQgX3NoYXJlZEluZGV4QnVmZmVyOiBHRlhCdWZmZXJ8bnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIC8vIGluaXRpYWxpemUgbGF5ZXJzXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBURVJSQUlOX01BWF9MQVlFUl9DT1VOVDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2xheWVycy5wdXNoKG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBAdHlwZShUZXJyYWluQXNzZXQpXHJcbiAgICBAdmlzaWJsZSh0cnVlKVxyXG4gICAgcHVibGljIHNldCBfYXNzZXQgKHZhbHVlOiBUZXJyYWluQXNzZXR8bnVsbCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fYXNzZXQgIT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX19hc3NldCA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fX2Fzc2V0ICE9IG51bGwgJiYgdGhpcy52YWxpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVidWlsZFxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBibG9jayBvZiB0aGlzLl9ibG9ja3MpIHtcclxuICAgICAgICAgICAgICAgICAgICBibG9jay5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ibG9ja3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Jsb2NrSW5mb3MgPSBbXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2J1aWxkSW1wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBfYXNzZXQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9fYXNzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGVycmFpbiBlZmZlY3QgYXNzZXRcclxuICAgICAqIEB6aCDlnLDlvaLnibnmlYjotYTmupBcclxuICAgICAqL1xyXG4gICAgQHR5cGUoRWZmZWN0QXNzZXQpXHJcbiAgICBAdmlzaWJsZSh0cnVlKVxyXG4gICAgcHVibGljIHNldCBlZmZlY3RBc3NldCAodmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy5fZWZmZWN0QXNzZXQgPT09IHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2VmZmVjdEFzc2V0ID0gdmFsdWU7XHJcbiAgICAgICAgZm9yIChjb25zdCBpIG9mIHRoaXMuX2Jsb2Nrcykge1xyXG4gICAgICAgICAgICBpLl9pbnZhbGlkTWF0ZXJpYWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBlZmZlY3RBc3NldCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VmZmVjdEFzc2V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCB0ZXJyYWluIHNpemVcclxuICAgICAqIEB6aCDojrflvpflnLDlvaLlpKflsI9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBzaXplICgpIHtcclxuICAgICAgICBjb25zdCBzeiA9IG5ldyBTaXplKDAsIDApO1xyXG4gICAgICAgIHN6LndpZHRoID0gdGhpcy5ibG9ja0NvdW50WzBdICogVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFkgKiB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgIHN6LmhlaWdodCA9IHRoaXMuYmxvY2tDb3VudFsxXSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICogdGhpcy50aWxlU2l6ZTtcclxuICAgICAgICByZXR1cm4gc3o7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IHRpbGUgc2l6ZVxyXG4gICAgICogQHpoIOiOt+W+l+agheagvOWkp+Wwj1xyXG4gICAgICovXHJcbiAgICBnZXQgdGlsZVNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90aWxlU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgdGlsZSBjb3VudFxyXG4gICAgICogQHpoIOiOt+W+l+agheagvOaVsOmHj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHRpbGVDb3VudCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIFt0aGlzLmJsb2NrQ291bnRbMF0gKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWSwgdGhpcy5ibG9ja0NvdW50WzFdICogVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCB2ZXJ0ZXggY291bnRcclxuICAgICAqIEB6aCDojrflvpfpobbngrnmlbDph49cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB2ZXJ0ZXhDb3VudCAoKSB7XHJcbiAgICAgICAgY29uc3QgX3ZlcnRleENvdW50ID0gdGhpcy50aWxlQ291bnQ7XHJcbiAgICAgICAgX3ZlcnRleENvdW50WzBdICs9IDE7XHJcbiAgICAgICAgX3ZlcnRleENvdW50WzFdICs9IDE7XHJcblxyXG4gICAgICAgIHJldHVybiBfdmVydGV4Q291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IGJsb2NrIGNvdW50XHJcbiAgICAgKiBAemgg6I635b6X5Zyw5b2i5Z2X5pWw6YePXHJcbiAgICAgKi9cclxuICAgIGdldCBibG9ja0NvdW50ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tDb3VudDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgbGlnaHQgbWFwIHNpemVcclxuICAgICAqIEB6aCDojrflvpflhYnnhaflm77lpKflsI9cclxuICAgICAqL1xyXG4gICAgZ2V0IGxpZ2h0TWFwU2l6ZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpZ2h0TWFwU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgd2VpZ2h0IG1hcCBzaXplXHJcbiAgICAgKiBAemgg6I635b6X5p2D6YeN5Zu+5aSn5bCPXHJcbiAgICAgKi9cclxuICAgIGdldCB3ZWlnaHRNYXBTaXplICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fd2VpZ2h0TWFwU2l6ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgaGVpZ2h0IGJ1ZmZlclxyXG4gICAgICogQHpoIOiOt+W+l+mrmOW6pue8k+WtmFxyXG4gICAgICovXHJcbiAgICBnZXQgaGVpZ2h0cyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hlaWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IHdlaWdodCBidWZmZXJcclxuICAgICAqIEB6aCDojrflvpfmnYPph43nvJPlrZhcclxuICAgICAqL1xyXG4gICAgZ2V0IHdlaWdodHMgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl93ZWlnaHRzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGNoZWNrIHZhbGlkXHJcbiAgICAgKiBAemgg5qOA5rWL5piv5ZCm5pyJ5pWIXHJcbiAgICAgKi9cclxuICAgIGdldCB2YWxpZCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jsb2Nrcy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCB0ZXJyYWluIGluZm9cclxuICAgICAqIEB6aCDojrflvpflnLDlvaLkv6Hmga9cclxuICAgICAqL1xyXG4gICAgQHR5cGUoVGVycmFpbkluZm8pXHJcbiAgICBwdWJsaWMgZ2V0IGluZm8gKCkge1xyXG4gICAgICAgIGNvbnN0IHRpID0gbmV3IFRlcnJhaW5JbmZvKCk7XHJcbiAgICAgICAgdGkudGlsZVNpemUgPSB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgIHRpLmJsb2NrQ291bnRbMF0gPSB0aGlzLmJsb2NrQ291bnRbMF07XHJcbiAgICAgICAgdGkuYmxvY2tDb3VudFsxXSA9IHRoaXMuYmxvY2tDb3VudFsxXTtcclxuICAgICAgICB0aS53ZWlnaHRNYXBTaXplID0gdGhpcy53ZWlnaHRNYXBTaXplO1xyXG4gICAgICAgIHRpLmxpZ2h0TWFwU2l6ZSA9IHRoaXMubGlnaHRNYXBTaXplO1xyXG5cclxuICAgICAgICByZXR1cm4gdGk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gYnVpbGRcclxuICAgICAqIEB6aCDmnoTlu7rlnLDlvaJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGJ1aWxkIChpbmZvOiBUZXJyYWluSW5mbykge1xyXG4gICAgICAgIHRoaXMuX3RpbGVTaXplID0gaW5mby50aWxlU2l6ZTtcclxuICAgICAgICB0aGlzLl9ibG9ja0NvdW50WzBdID0gaW5mby5ibG9ja0NvdW50WzBdO1xyXG4gICAgICAgIHRoaXMuX2Jsb2NrQ291bnRbMV0gPSBpbmZvLmJsb2NrQ291bnRbMV07XHJcbiAgICAgICAgdGhpcy5fd2VpZ2h0TWFwU2l6ZSA9IGluZm8ud2VpZ2h0TWFwU2l6ZTtcclxuICAgICAgICB0aGlzLl9saWdodE1hcFNpemUgPSBpbmZvLmxpZ2h0TWFwU2l6ZTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2J1aWxkSW1wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gcmVidWlsZFxyXG4gICAgICogQHpoIOmHjeW7uuWcsOW9olxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVidWlsZCAoaW5mbzogVGVycmFpbkluZm8pIHtcclxuICAgICAgICAvLyBidWlsZCBibG9jayBpbmZvXHJcbiAgICAgICAgY29uc3QgYmxvY2tJbmZvczogVGVycmFpbkJsb2NrSW5mb1tdID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmZvLmJsb2NrQ291bnRbMF0gKiBpbmZvLmJsb2NrQ291bnRbMV07ICsraSkge1xyXG4gICAgICAgICAgICBibG9ja0luZm9zLnB1c2gobmV3IFRlcnJhaW5CbG9ja0luZm8oKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3ID0gTWF0aC5taW4odGhpcy5fYmxvY2tDb3VudFswXSwgaW5mby5ibG9ja0NvdW50WzBdKTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5taW4odGhpcy5fYmxvY2tDb3VudFsxXSwgaW5mby5ibG9ja0NvdW50WzFdKTtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGg7ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXgwID0gaiAqIGluZm8uYmxvY2tDb3VudFswXSArIGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleDEgPSBqICogdGhpcy5ibG9ja0NvdW50WzBdICsgaTtcclxuXHJcbiAgICAgICAgICAgICAgICBibG9ja0luZm9zW2luZGV4MF0gPSB0aGlzLl9ibG9ja0luZm9zW2luZGV4MV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2Jsb2NrSW5mb3MgPSBibG9ja0luZm9zO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGJsb2NrIG9mIHRoaXMuX2Jsb2Nrcykge1xyXG4gICAgICAgICAgICBibG9jay5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Jsb2NrcyA9IFtdO1xyXG5cclxuICAgICAgICAvLyBidWlsZCBoZWlnaHRzXHJcbiAgICAgICAgdGhpcy5fcmVidWlsZEhlaWdodHMoaW5mbyk7XHJcblxyXG4gICAgICAgIC8vIGJ1aWxkIHdlaWdodHNcclxuICAgICAgICB0aGlzLl9yZWJ1aWxkV2VpZ2h0cyhpbmZvKTtcclxuXHJcbiAgICAgICAgLy8gdXBkYXRlIGluZm9cclxuICAgICAgICB0aGlzLl90aWxlU2l6ZSA9IGluZm8udGlsZVNpemU7XHJcbiAgICAgICAgdGhpcy5fYmxvY2tDb3VudFswXSA9IGluZm8uYmxvY2tDb3VudFswXTtcclxuICAgICAgICB0aGlzLl9ibG9ja0NvdW50WzFdID0gaW5mby5ibG9ja0NvdW50WzFdO1xyXG4gICAgICAgIHRoaXMuX3dlaWdodE1hcFNpemUgPSBpbmZvLndlaWdodE1hcFNpemU7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRNYXBTaXplID0gaW5mby5saWdodE1hcFNpemU7XHJcblxyXG4gICAgICAgIC8vIGJ1aWxkIGJsb2Nrc1xyXG4gICAgICAgIHRoaXMuX2J1aWxkTm9ybWFscygpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2Jsb2NrQ291bnRbMV07ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Jsb2NrQ291bnRbMF07ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmxvY2tzLnB1c2gobmV3IFRlcnJhaW5CbG9jayh0aGlzLCBpLCBqKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLl9ibG9ja3MpIHtcclxuICAgICAgICAgICAgaS5idWlsZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBpbXBvcnQgaGVpZ2h0IGZpZWxkXHJcbiAgICAgKiBAemgg5a+85YWl6auY5bqm5Zu+XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbXBvcnRIZWlnaHRGaWVsZCAoaGY6IEhlaWdodEZpZWxkLCBoZWlnaHRTY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMudmVydGV4Q291bnRbMV07ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmVydGV4Q291bnRbMF07ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdSA9IGkgLyB0aGlzLnRpbGVDb3VudFswXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHYgPSBqIC8gdGhpcy50aWxlQ291bnRbMV07XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IGhmLmdldEF0KHUgKiBoZi53LCB2ICogaGYuaCkgKiBoZWlnaHRTY2FsZTtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHRzW2luZGV4KytdID0gaDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fYnVpbGROb3JtYWxzKCk7XHJcblxyXG4gICAgICAgIC8vIHJlYnVpbGQgYWxsIGJsb2Nrc1xyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLl9ibG9ja3MpIHtcclxuICAgICAgICAgICAgaS5fdXBkYXRlSGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGV4cG9ydCBoZWlnaHQgZmllbGRcclxuICAgICAqIEB6aCDlr7zlh7rpq5jluqblm75cclxuICAgICAqL1xyXG4gICAgcHVibGljIGV4cG9ydEhlaWdodEZpZWxkIChoZjogSGVpZ2h0RmllbGQsIGhlaWdodFNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaGYuaDsgKytqKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGYudzsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB1ID0gaSAvIChoZi53IC0gMSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB2ID0gaiAvIChoZi5oIC0gMSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IHUgKiB0aGlzLnNpemUud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gdiAqIHRoaXMuc2l6ZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgaCA9IHRoaXMuZ2V0SGVpZ2h0QXQoeCwgeSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaCAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGYuZGF0YVtpbmRleCsrXSA9IGggKiBoZWlnaHRTY2FsZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZXhwb3J0QXNzZXQgKCkge1xyXG4gICAgICAgIGNvbnN0IGFzc2V0ID0gbmV3IFRlcnJhaW5Bc3NldCgpO1xyXG5cclxuICAgICAgICBhc3NldC50aWxlU2l6ZSA9IHRoaXMudGlsZVNpemU7XHJcbiAgICAgICAgYXNzZXQuYmxvY2tDb3VudCA9IHRoaXMuYmxvY2tDb3VudDtcclxuICAgICAgICBhc3NldC5saWdodE1hcFNpemUgPSB0aGlzLmxpZ2h0TWFwU2l6ZTtcclxuICAgICAgICBhc3NldC53ZWlnaHRNYXBTaXplID0gdGhpcy53ZWlnaHRNYXBTaXplO1xyXG4gICAgICAgIGFzc2V0LmhlaWdodHMgPSB0aGlzLmhlaWdodHM7XHJcbiAgICAgICAgYXNzZXQud2VpZ2h0cyA9IHRoaXMud2VpZ2h0cztcclxuXHJcbiAgICAgICAgYXNzZXQubGF5ZXJCdWZmZXIgPSBuZXcgQXJyYXk8bnVtYmVyPih0aGlzLl9ibG9ja3MubGVuZ3RoICogNCk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ibG9ja3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgYXNzZXQubGF5ZXJCdWZmZXJbaSAqIDQgKyAwXSA9IHRoaXMuX2Jsb2Nrc1tpXS5sYXllcnNbMF07XHJcbiAgICAgICAgICAgIGFzc2V0LmxheWVyQnVmZmVyW2kgKiA0ICsgMV0gPSB0aGlzLl9ibG9ja3NbaV0ubGF5ZXJzWzFdO1xyXG4gICAgICAgICAgICBhc3NldC5sYXllckJ1ZmZlcltpICogNCArIDJdID0gdGhpcy5fYmxvY2tzW2ldLmxheWVyc1syXTtcclxuICAgICAgICAgICAgYXNzZXQubGF5ZXJCdWZmZXJbaSAqIDQgKyAzXSA9IHRoaXMuX2Jsb2Nrc1tpXS5sYXllcnNbM107XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xheWVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCB0ZW1wID0gdGhpcy5fbGF5ZXJzW2ldO1xyXG4gICAgICAgICAgICBpZiAodGVtcCAmJiB0ZW1wLmRldGFpbE1hcCAmJiBpc1ZhbGlkKHRlbXAuZGV0YWlsTWFwKSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSBuZXcgVGVycmFpbkxheWVySW5mbygpO1xyXG4gICAgICAgICAgICAgICAgbGF5ZXIuc2xvdCA9IGk7XHJcbiAgICAgICAgICAgICAgICBsYXllci50aWxlU2l6ZSA9IHRlbXAudGlsZVNpemU7XHJcbiAgICAgICAgICAgICAgICBsYXllci5kZXRhaWxNYXAgPSB0ZW1wLmRldGFpbE1hcC5fdXVpZDtcclxuICAgICAgICAgICAgICAgIGFzc2V0LmxheWVySW5mb3MucHVzaChsYXllcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBhc3NldDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0RWZmZWN0QXNzZXQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lZmZlY3RBc3NldCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICByZXR1cm4gbGVnYWN5Q0MuRWZmZWN0QXNzZXQuZ2V0KCdidWlsdGluLXRlcnJhaW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lZmZlY3RBc3NldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgY29uc3QgZ2Z4RGV2aWNlID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdC5kZXZpY2UgYXMgR0ZYRGV2aWNlO1xyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIHNoYXJlZCBpbmRleCBidWZmZXJcclxuICAgICAgICBjb25zdCBpbmRleERhdGEgPSBuZXcgVWludDE2QXJyYXkoVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFkgKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWSAqIDYpO1xyXG5cclxuICAgICAgICBsZXQgaW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgVEVSUkFJTl9CTE9DS19USUxFX0NPTVBMRVhJVFk7ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGEgPSBqICogVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSArIGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiID0gaiAqIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFkgKyBpICsgMTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGMgPSAoaiArIDEpICogVEVSUkFJTl9CTE9DS19WRVJURVhfQ09NUExFWElUWSArIGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkID0gKGogKyAxKSAqIFRFUlJBSU5fQkxPQ0tfVkVSVEVYX0NPTVBMRVhJVFkgKyBpICsgMTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIDFcclxuICAgICAgICAgICAgICAgIGluZGV4RGF0YVtpbmRleCsrXSA9IGE7XHJcbiAgICAgICAgICAgICAgICBpbmRleERhdGFbaW5kZXgrK10gPSBjO1xyXG4gICAgICAgICAgICAgICAgaW5kZXhEYXRhW2luZGV4KytdID0gYjtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBmYWNlIDJcclxuICAgICAgICAgICAgICAgIGluZGV4RGF0YVtpbmRleCsrXSA9IGI7XHJcbiAgICAgICAgICAgICAgICBpbmRleERhdGFbaW5kZXgrK10gPSBjO1xyXG4gICAgICAgICAgICAgICAgaW5kZXhEYXRhW2luZGV4KytdID0gZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2hhcmVkSW5kZXhCdWZmZXIgPSBnZnhEZXZpY2UuY3JlYXRlQnVmZmVyKG5ldyBHRlhCdWZmZXJJbmZvKFxyXG4gICAgICAgICAgICBHRlhCdWZmZXJVc2FnZUJpdC5JTkRFWCB8IEdGWEJ1ZmZlclVzYWdlQml0LlRSQU5TRkVSX0RTVCxcclxuICAgICAgICAgICAgR0ZYTWVtb3J5VXNhZ2VCaXQuSE9TVCB8IEdGWE1lbW9yeVVzYWdlQml0LkRFVklDRSxcclxuICAgICAgICAgICAgVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiBURVJSQUlOX0JMT0NLX1RJTEVfQ09NUExFWElUWSAqIFRFUlJBSU5fQkxPQ0tfVElMRV9DT01QTEVYSVRZICogNixcclxuICAgICAgICAgICAgVWludDE2QXJyYXkuQllURVNfUEVSX0VMRU1FTlQsXHJcbiAgICAgICAgKSk7XHJcbiAgICAgICAgdGhpcy5fc2hhcmVkSW5kZXhCdWZmZXIudXBkYXRlKGluZGV4RGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG9uRW5hYmxlICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fYmxvY2tzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLl9idWlsZEltcCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EaXNhYmxlICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5fYmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGkuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9ibG9ja3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25EZXN0cm95ICgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xheWVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl9sYXllcnNbaV0gPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3NoYXJlZEluZGV4QnVmZmVyICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fc2hhcmVkSW5kZXhCdWZmZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25SZXN0b3JlICgpIHtcclxuICAgICAgICB0aGlzLm9uRGlzYWJsZSgpO1xyXG4gICAgICAgIHRoaXMub25Mb2FkKCk7XHJcbiAgICAgICAgdGhpcy5fYnVpbGRJbXAodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoZGVsdGFUaW1lOiBudW1iZXIpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGkgb2YgdGhpcy5fYmxvY2tzKSB7XHJcbiAgICAgICAgICAgIGkudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGFkZCBsYXllclxyXG4gICAgICogQHpoIOa3u+WKoOe6ueeQhuWxglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkTGF5ZXIgKGxheWVyOiBUZXJyYWluTGF5ZXIpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2xheWVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fbGF5ZXJzW2ldID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2xheWVyc1tpXSA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBzZXQgbGF5ZXJcclxuICAgICAqIEB6aCDorr7nva7nurnnkIblsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldExheWVyIChpOiBudW1iZXIsIGxheWVyOiBUZXJyYWluTGF5ZXIpIHtcclxuICAgICAgICB0aGlzLl9sYXllcnNbaV0gPSBsYXllcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiByZW1vdmUgbGF5ZXJcclxuICAgICAqIEB6aCDnp7vpmaTnurnnkIblsYJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUxheWVyIChpZDogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5fbGF5ZXJzW2lkXSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IGxheWVyXHJcbiAgICAgKiBAemgg6I635b6X57q555CG5bGCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRMYXllciAoaWQ6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpZCA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5fbGF5ZXJzW2lkXTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IHBvc2l0aW9uXHJcbiAgICAgKiBAemgg6I635b6X5Zyw5b2i5LiK55qE5L2N572uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRQb3NpdGlvbiAoaTogbnVtYmVyLCBqOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCB4ID0gaSAqIHRoaXMuX3RpbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IHogPSBqICogdGhpcy5fdGlsZVNpemU7XHJcbiAgICAgICAgY29uc3QgeSA9IHRoaXMuZ2V0SGVpZ2h0KGksIGopO1xyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFZlYzMoeCwgeSwgeik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEhlaWdodEZpZWxkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faGVpZ2h0cztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBzZXQgaGVpZ2h0XHJcbiAgICAgKiBAemgg6K6+572u5Zyw5b2i5LiK55qE6auY5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRIZWlnaHQgKGk6IG51bWJlciwgajogbnVtYmVyLCBoOiBudW1iZXIpIHtcclxuICAgICAgICBoID0gY2xhbXAoaCwgVEVSUkFJTl9IRUlHSFRfRk1JTiwgVEVSUkFJTl9IRUlHSFRfRk1BWCk7XHJcbiAgICAgICAgdGhpcy5faGVpZ2h0c1tqICogdGhpcy52ZXJ0ZXhDb3VudFswXSArIGldID0gVEVSUkFJTl9IRUlHSFRfQkFTRSArIGggLyBURVJSQUlOX0hFSUdIVF9GQUNUT1JZO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBoZWlnaHRcclxuICAgICAqIEB6aCDojrflvpflnLDlvaLkuIrnmoTpq5jluqZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEhlaWdodCAoaTogbnVtYmVyLCBqOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gKHRoaXMuX2hlaWdodHNbaiAqIHRoaXMudmVydGV4Q291bnRbMF0gKyBpXSAtIFRFUlJBSU5fSEVJR0hUX0JBU0UpICogVEVSUkFJTl9IRUlHSFRfRkFDVE9SWTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBzZXQgaGVpZ2h0XHJcbiAgICAgKiBAemgg6K6+572u6auY5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRIZWlnaHRDbGFtcCAoaTogbnVtYmVyLCBqOiBudW1iZXIpIHtcclxuICAgICAgICBpID0gY2xhbXAoaSwgMCwgdGhpcy52ZXJ0ZXhDb3VudFswXSAtIDEpO1xyXG4gICAgICAgIGogPSBjbGFtcChqLCAwLCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmdldEhlaWdodChpLCBqKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgaGVpZ2h0IGJ5IHBvaW50XHJcbiAgICAgKiBAemgg5qC55o2u54K555qE5Z2Q5qCH6I635b6X6auY5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRIZWlnaHRBdCAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBmeCA9IHggLyB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGZ5ID0geSAvIHRoaXMudGlsZVNpemU7XHJcblxyXG4gICAgICAgIGxldCBpeDAgPSBNYXRoLmZsb29yKGZ4KTtcclxuICAgICAgICBsZXQgaXowID0gTWF0aC5mbG9vcihmeSk7XHJcbiAgICAgICAgbGV0IGl4MSA9IGl4MCArIDE7XHJcbiAgICAgICAgbGV0IGl6MSA9IGl6MCArIDE7XHJcbiAgICAgICAgY29uc3QgZHggPSBmeCAtIGl4MDtcclxuICAgICAgICBjb25zdCBkeiA9IGZ5IC0gaXowO1xyXG5cclxuICAgICAgICBpZiAoaXgwIDwgMCB8fCBpeDAgPiB0aGlzLnZlcnRleENvdW50WzBdIC0gMSB8fCBpejAgPCAwIHx8IGl6MCA+IHRoaXMudmVydGV4Q291bnRbMV0gLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXgwID0gY2xhbXAoaXgwLCAwLCB0aGlzLnZlcnRleENvdW50WzBdIC0gMSk7XHJcbiAgICAgICAgaXowID0gY2xhbXAoaXowLCAwLCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSk7XHJcbiAgICAgICAgaXgxID0gY2xhbXAoaXgxLCAwLCB0aGlzLnZlcnRleENvdW50WzBdIC0gMSk7XHJcbiAgICAgICAgaXoxID0gY2xhbXAoaXoxLCAwLCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSk7XHJcblxyXG4gICAgICAgIGxldCBhID0gdGhpcy5nZXRIZWlnaHQoaXgwLCBpejApO1xyXG4gICAgICAgIGNvbnN0IGIgPSB0aGlzLmdldEhlaWdodChpeDEsIGl6MCk7XHJcbiAgICAgICAgY29uc3QgYyA9IHRoaXMuZ2V0SGVpZ2h0KGl4MCwgaXoxKTtcclxuICAgICAgICBsZXQgZCA9IHRoaXMuZ2V0SGVpZ2h0KGl4MSwgaXoxKTtcclxuICAgICAgICBjb25zdCBtID0gKGIgKyBjKSAqIDAuNTtcclxuXHJcbiAgICAgICAgaWYgKGR4ICsgZHogPD0gMS4wKSB7XHJcbiAgICAgICAgICAgIGQgPSBtICsgKG0gLSBhKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGEgPSBtICsgKG0gLSBkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGgxID0gYSAqICgxLjAgLSBkeCkgKyBiICogZHg7XHJcbiAgICAgICAgY29uc3QgaDIgPSBjICogKDEuMCAtIGR4KSArIGQgKiBkeDtcclxuXHJcbiAgICAgICAgY29uc3QgaCA9IGgxICogKDEuMCAtIGR6KSArIGgyICogZHo7XHJcblxyXG4gICAgICAgIHJldHVybiBoO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfc2V0Tm9ybWFsIChpOiBudW1iZXIsIGo6IG51bWJlciwgbjogVmVjMykge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gaiAqIHRoaXMudmVydGV4Q291bnRbMF0gKyBpO1xyXG5cclxuICAgICAgICB0aGlzLl9ub3JtYWxzW2luZGV4ICogMyArIDBdID0gbi54O1xyXG4gICAgICAgIHRoaXMuX25vcm1hbHNbaW5kZXggKiAzICsgMV0gPSBuLnk7XHJcbiAgICAgICAgdGhpcy5fbm9ybWFsc1tpbmRleCAqIDMgKyAyXSA9IG4uejtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgbm9ybWFsXHJcbiAgICAgKiBAemgg6I635b6X5rOV57q/XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXROb3JtYWwgKGk6IG51bWJlciwgajogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBqICogdGhpcy52ZXJ0ZXhDb3VudFswXSArIGk7XHJcblxyXG4gICAgICAgIGNvbnN0IG4gPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIG4ueCA9IHRoaXMuX25vcm1hbHNbaW5kZXggKiAzICsgMF07XHJcbiAgICAgICAgbi55ID0gdGhpcy5fbm9ybWFsc1tpbmRleCAqIDMgKyAxXTtcclxuICAgICAgICBuLnogPSB0aGlzLl9ub3JtYWxzW2luZGV4ICogMyArIDJdO1xyXG5cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgbm9ybWFsIGJ5IHBvaW50XHJcbiAgICAgKiBAemgg5qC55o2u54K555qE5Z2Q5qCH6I635b6X5rOV57q/XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXROb3JtYWxBdCAoeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBmeCA9IHggLyB0aGlzLnRpbGVTaXplO1xyXG4gICAgICAgIGNvbnN0IGZ5ID0geSAvIHRoaXMudGlsZVNpemU7XHJcblxyXG4gICAgICAgIGxldCBpeDAgPSBNYXRoLmZsb29yKGZ4KTtcclxuICAgICAgICBsZXQgaXowID0gTWF0aC5mbG9vcihmeSk7XHJcbiAgICAgICAgbGV0IGl4MSA9IGl4MCArIDE7XHJcbiAgICAgICAgbGV0IGl6MSA9IGl6MCArIDE7XHJcbiAgICAgICAgY29uc3QgZHggPSBmeCAtIGl4MDtcclxuICAgICAgICBjb25zdCBkeiA9IGZ5IC0gaXowO1xyXG5cclxuICAgICAgICBpZiAoaXgwIDwgMCB8fCBpeDAgPiB0aGlzLnZlcnRleENvdW50WzBdIC0gMSB8fCBpejAgPCAwIHx8IGl6MCA+IHRoaXMudmVydGV4Q291bnRbMV0gLSAxKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaXgwID0gY2xhbXAoaXgwLCAwLCB0aGlzLnZlcnRleENvdW50WzBdIC0gMSk7XHJcbiAgICAgICAgaXowID0gY2xhbXAoaXowLCAwLCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSk7XHJcbiAgICAgICAgaXgxID0gY2xhbXAoaXgxLCAwLCB0aGlzLnZlcnRleENvdW50WzBdIC0gMSk7XHJcbiAgICAgICAgaXoxID0gY2xhbXAoaXoxLCAwLCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGEgPSB0aGlzLmdldE5vcm1hbChpeDAsIGl6MCk7XHJcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuZ2V0Tm9ybWFsKGl4MSwgaXowKTtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5nZXROb3JtYWwoaXgwLCBpejEpO1xyXG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLmdldE5vcm1hbChpeDEsIGl6MSk7XHJcbiAgICAgICAgY29uc3QgbSA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgVmVjMy5hZGQobSwgYiwgYykubXVsdGlwbHlTY2FsYXIoMC41KTtcclxuXHJcbiAgICAgICAgaWYgKGR4ICsgZHogPD0gMS4wKSB7XHJcbiAgICAgICAgICAgIC8vIGQgPSBtICsgKG0gLSBhKTtcclxuICAgICAgICAgICAgZC5zZXQobSk7XHJcbiAgICAgICAgICAgIGQuc3VidHJhY3QoYSk7XHJcbiAgICAgICAgICAgIGQuYWRkKG0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgLy8gYSA9IG0gKyAobSAtIGQpO1xyXG4gICAgICAgICAgICBhLnNldChtKTtcclxuICAgICAgICAgICAgYS5zdWJ0cmFjdChkKTtcclxuICAgICAgICAgICAgYS5hZGQobSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuMSA9IG5ldyBWZWMzKCk7XHJcbiAgICAgICAgY29uc3QgbjIgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGNvbnN0IG4gPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIFZlYzMubGVycChuMSwgYSwgYiwgZHgpO1xyXG4gICAgICAgIFZlYzMubGVycChuMiwgYywgZCwgZHgpO1xyXG4gICAgICAgIFZlYzMubGVycChuLCBuMSwgbjIsIGR6KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gc2V0IHdlaWdodFxyXG4gICAgICogQHpoIOiuvue9ruadg+mHjVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0V2VpZ2h0IChpOiBudW1iZXIsIGo6IG51bWJlciwgdzogVmVjNCkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gaiAqIHRoaXMuX3dlaWdodE1hcFNpemUgKiB0aGlzLl9ibG9ja0NvdW50WzBdICsgaTtcclxuXHJcbiAgICAgICAgdGhpcy5fd2VpZ2h0c1tpbmRleCAqIDQgKyAwXSA9IHcueCAqIDI1NTtcclxuICAgICAgICB0aGlzLl93ZWlnaHRzW2luZGV4ICogNCArIDFdID0gdy55ICogMjU1O1xyXG4gICAgICAgIHRoaXMuX3dlaWdodHNbaW5kZXggKiA0ICsgMl0gPSB3LnogKiAyNTU7XHJcbiAgICAgICAgdGhpcy5fd2VpZ2h0c1tpbmRleCAqIDQgKyAzXSA9IHcudyAqIDI1NTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgd2VpZ2h0XHJcbiAgICAgKiBAemgg6I635b6X5p2D6YeNXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRXZWlnaHQgKGk6IG51bWJlciwgajogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBqICogdGhpcy5fd2VpZ2h0TWFwU2l6ZSAqIHRoaXMuX2Jsb2NrQ291bnRbMF0gKyBpO1xyXG5cclxuICAgICAgICBjb25zdCB3ID0gbmV3IFZlYzQoKTtcclxuICAgICAgICB3LnggPSB0aGlzLl93ZWlnaHRzW2luZGV4ICogNCArIDBdIC8gMjU1LjA7XHJcbiAgICAgICAgdy55ID0gdGhpcy5fd2VpZ2h0c1tpbmRleCAqIDQgKyAxXSAvIDI1NS4wO1xyXG4gICAgICAgIHcueiA9IHRoaXMuX3dlaWdodHNbaW5kZXggKiA0ICsgMl0gLyAyNTUuMDtcclxuICAgICAgICB3LncgPSB0aGlzLl93ZWlnaHRzW2luZGV4ICogNCArIDNdIC8gMjU1LjA7XHJcblxyXG4gICAgICAgIHJldHVybiB3O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBub3JtYWwgYnkgcG9pbnRcclxuICAgICAqIEB6aCDmoLnmja7ngrnnmoTlnZDmoIfojrflvpfmnYPph41cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdlaWdodEF0ICh4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGZ4ID0geCAvIHRoaXMudGlsZVNpemU7XHJcbiAgICAgICAgY29uc3QgZnkgPSB5IC8gdGhpcy50aWxlU2l6ZTtcclxuXHJcbiAgICAgICAgbGV0IGl4MCA9IE1hdGguZmxvb3IoZngpO1xyXG4gICAgICAgIGxldCBpejAgPSBNYXRoLmZsb29yKGZ5KTtcclxuICAgICAgICBsZXQgaXgxID0gaXgwICsgMTtcclxuICAgICAgICBsZXQgaXoxID0gaXowICsgMTtcclxuICAgICAgICBjb25zdCBkeCA9IGZ4IC0gaXgwO1xyXG4gICAgICAgIGNvbnN0IGR6ID0gZnkgLSBpejA7XHJcblxyXG4gICAgICAgIGlmIChpeDAgPCAwIHx8IGl4MCA+IHRoaXMudmVydGV4Q291bnRbMF0gLSAxIHx8IGl6MCA8IDAgfHwgaXowID4gdGhpcy52ZXJ0ZXhDb3VudFsxXSAtIDEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpeDAgPSBjbGFtcChpeDAsIDAsIHRoaXMudmVydGV4Q291bnRbMF0gLSAxKTtcclxuICAgICAgICBpejAgPSBjbGFtcChpejAsIDAsIHRoaXMudmVydGV4Q291bnRbMV0gLSAxKTtcclxuICAgICAgICBpeDEgPSBjbGFtcChpeDEsIDAsIHRoaXMudmVydGV4Q291bnRbMF0gLSAxKTtcclxuICAgICAgICBpejEgPSBjbGFtcChpejEsIDAsIHRoaXMudmVydGV4Q291bnRbMV0gLSAxKTtcclxuXHJcbiAgICAgICAgbGV0IGEgPSB0aGlzLmdldFdlaWdodChpeDAsIGl6MCk7XHJcbiAgICAgICAgY29uc3QgYiA9IHRoaXMuZ2V0V2VpZ2h0KGl4MSwgaXowKTtcclxuICAgICAgICBjb25zdCBjID0gdGhpcy5nZXRXZWlnaHQoaXgwLCBpejEpO1xyXG4gICAgICAgIGxldCBkID0gdGhpcy5nZXRXZWlnaHQoaXgxLCBpejEpO1xyXG4gICAgICAgIGNvbnN0IG0gPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgIFZlYzQuYWRkKG0sIGIsIGMpLm11bHRpcGx5U2NhbGFyKDAuNSk7XHJcblxyXG4gICAgICAgIGlmIChkeCArIGR6IDw9IDEuMCkge1xyXG4gICAgICAgICAgICBkID0gbmV3IFZlYzQoKTtcclxuICAgICAgICAgICAgVmVjNC5zdWJ0cmFjdChkLCBtLCBhKS5hZGQobSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBhID0gbmV3IFZlYzQoKTtcclxuICAgICAgICAgICAgVmVjNC5zdWJ0cmFjdChhLCBtLCBkKS5hZGQobSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuMSA9IG5ldyBWZWM0KCk7XHJcbiAgICAgICAgY29uc3QgbjIgPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgIGNvbnN0IG4gPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgIFZlYzQubGVycChuMSwgYSwgYiwgZHgpO1xyXG4gICAgICAgIFZlYzQubGVycChuMiwgYywgZCwgZHgpO1xyXG4gICAgICAgIFZlYzQubGVycChuLCBuMSwgbjIsIGR6KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gZ2V0IGJsb2NrIGluZm9cclxuICAgICAqIEB6aCDojrflvpflnLDlvaLlnZfkv6Hmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJsb2NrSW5mbyAoaTogbnVtYmVyLCBqOiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fYmxvY2tJbmZvc1tqICogdGhpcy5fYmxvY2tDb3VudFswXSArIGldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBibG9ja1xyXG4gICAgICogQHpoIOiOt+W+l+WcsOW9ouWdl+WvueixoVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QmxvY2sgKGk6IG51bWJlciwgajogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jsb2Nrc1tqICogdGhpcy5fYmxvY2tDb3VudFswXSArIGldO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIGdldCBhbGwgYmxvY2tzXHJcbiAgICAgKiBAemgg6I635b6X5Zyw5b2i5Z2X57yT5a2YXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRCbG9ja3MgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ibG9ja3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gcmF5IGNoZWNrXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQgcmF5IHN0YXJ0XHJcbiAgICAgKiBAcGFyYW0gZGlyIHJheSBkaXJlY3Rpb25cclxuICAgICAqIEBwYXJhbSBzdGVwIHJheSBzdGVwXHJcbiAgICAgKiBAcGFyYW0gd29ybGRTcGFjZSBpcyB3b3JsZCBzcGFjZVxyXG4gICAgICogQHpoIOWwhOe6v+ajgOa1i1xyXG4gICAgICogQHBhcmFtIHN0YXJ0IOWwhOe6v+WOn+eCuVxyXG4gICAgICogQHBhcmFtIGRpciDlsITnur/mlrnlkJFcclxuICAgICAqIEBwYXJhbSBzdGVwIOWwhOe6v+atpemVv1xyXG4gICAgICogQHBhcmFtIHdvcmxkU3BhY2Ug5piv5ZCm5Zyo5LiW55WM56m66Ze0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByYXlDaGVjayAoc3RhcnQ6IFZlYzMsIGRpcjogVmVjMywgc3RlcDogbnVtYmVyLCB3b3JsZFNwYWNlOiBib29sZWFuID0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IE1BWF9DT1VOVCA9IDIwMDA7XHJcblxyXG4gICAgICAgIGNvbnN0IHRyYWNlID0gc3RhcnQ7XHJcbiAgICAgICAgaWYgKHdvcmxkU3BhY2UpIHtcclxuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0cmFjZSwgc3RhcnQsIHRoaXMubm9kZS5nZXRXb3JsZFBvc2l0aW9uKCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZGVsdGEgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIGRlbHRhLnNldChkaXIpO1xyXG4gICAgICAgIGRlbHRhLm11bHRpcGx5U2NhbGFyKHN0ZXApO1xyXG5cclxuICAgICAgICBsZXQgcG9zaXRpb246IFZlYzN8bnVsbCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmIChkaXIuZXF1YWxzKG5ldyBWZWMzKDAsIDEsIDApKSkge1xyXG4gICAgICAgICAgICBjb25zdCB5ID0gdGhpcy5nZXRIZWlnaHRBdCh0cmFjZS54LCB0cmFjZS56KTtcclxuICAgICAgICAgICAgaWYgKHkgIT0gbnVsbCAmJiB0cmFjZS55IDw9IHkpIHtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gbmV3IFZlYzModHJhY2UueCwgeSwgdHJhY2Uueik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoZGlyLmVxdWFscyhuZXcgVmVjMygwLCAtMSwgMCkpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldEhlaWdodEF0KHRyYWNlLngsIHRyYWNlLnopO1xyXG4gICAgICAgICAgICBpZiAoeSAhPSBudWxsICYmIHRyYWNlLnkgPj0geSkge1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSBuZXcgVmVjMyh0cmFjZS54LCB5LCB0cmFjZS56KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgbGV0IGkgPSAwO1xyXG5cclxuICAgICAgICAgICAgLy8g5LyY5YWI5aSn5q2l6L+b5p+l5om+XHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPCBNQVhfQ09VTlQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldEhlaWdodEF0KHRyYWNlLngsIHRyYWNlLnopO1xyXG4gICAgICAgICAgICAgICAgaWYgKHkgIT0gbnVsbCAmJiB0cmFjZS55IDw9IHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB0cmFjZS5hZGQoZGlyKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8g56m35Li+5rOVXHJcbiAgICAgICAgICAgIHdoaWxlIChpKysgPCBNQVhfQ09VTlQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB0aGlzLmdldEhlaWdodEF0KHRyYWNlLngsIHRyYWNlLnopO1xyXG4gICAgICAgICAgICAgICAgaWYgKHkgIT0gbnVsbCAmJiB0cmFjZS55IDw9IHkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IG5ldyBWZWMzKHRyYWNlLngsIHksIHRyYWNlLnopO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHRyYWNlLmFkZChkZWx0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2dldFNoYXJlZEluZGV4QnVmZmVyICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcmVkSW5kZXhCdWZmZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9yZXNldExpZ2h0bWFwIChlbmJsZTogYm9vbGVhbikge1xyXG4gICAgICAgIHRoaXMuX2xpZ2h0bWFwSW5mb3MubGVuZ3RoID0gMDtcclxuICAgICAgICBpZiAoZW5ibGUpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ibG9ja0NvdW50WzBdICogdGhpcy5fYmxvY2tDb3VudFsxXTsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9saWdodG1hcEluZm9zLnB1c2gobmV3IFRlcnJhaW5CbG9ja0xpZ2h0bWFwSW5mbygpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX3VwZGF0ZUxpZ2h0bWFwIChibG9ja0lkOiBudW1iZXIsIHRleDogVGV4dHVyZTJEfG51bGwsIHVPZmY6IG51bWJlciwgdk9mZjogbnVtYmVyLCB1U2NhbGU6IG51bWJlciwgdlNjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9saWdodG1hcEluZm9zW2Jsb2NrSWRdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgdGhpcy5fbGlnaHRtYXBJbmZvc1tibG9ja0lkXS5VT2ZmID0gdU9mZjtcclxuICAgICAgICB0aGlzLl9saWdodG1hcEluZm9zW2Jsb2NrSWRdLlZPZmYgPSB2T2ZmO1xyXG4gICAgICAgIHRoaXMuX2xpZ2h0bWFwSW5mb3NbYmxvY2tJZF0uVVNjYWxlID0gdVNjYWxlO1xyXG4gICAgICAgIHRoaXMuX2xpZ2h0bWFwSW5mb3NbYmxvY2tJZF0uVlNjYWxlID0gdlNjYWxlO1xyXG4gICAgICAgIHRoaXMuX2Jsb2Nrc1tibG9ja0lkXS5fdXBkYXRlTGlnaHRtYXAodGhpcy5fbGlnaHRtYXBJbmZvc1tibG9ja0lkXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9nZXRMaWdodG1hcEluZm8gKGk6IG51bWJlciwgajogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSBqICogdGhpcy5fYmxvY2tDb3VudFswXSArIGk7XHJcbiAgICAgICAgcmV0dXJuIGluZGV4IDwgdGhpcy5fbGlnaHRtYXBJbmZvcy5sZW5ndGggPyB0aGlzLl9saWdodG1hcEluZm9zW2luZGV4XSA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jYWxjTm9ybWFsICh4OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIGxldCBmbGlwID0gMTtcclxuICAgICAgICBjb25zdCBoZXJlID0gdGhpcy5nZXRQb3NpdGlvbih4LCB6KTtcclxuICAgICAgICBsZXQgcmlnaHQ6IFZlYzM7XHJcbiAgICAgICAgbGV0IHVwOiBWZWMzO1xyXG5cclxuICAgICAgICBpZiAoeCA8IHRoaXMudmVydGV4Q291bnRbMF0gLSAxKSB7XHJcbiAgICAgICAgICAgIHJpZ2h0ID0gdGhpcy5nZXRQb3NpdGlvbih4ICsgMSwgeik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBmbGlwICo9IC0xO1xyXG4gICAgICAgICAgICByaWdodCA9IHRoaXMuZ2V0UG9zaXRpb24oeCAtIDEsIHopO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHogPCB0aGlzLnZlcnRleENvdW50WzFdIC0gMSkge1xyXG4gICAgICAgICAgICB1cCA9IHRoaXMuZ2V0UG9zaXRpb24oeCwgeiArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgZmxpcCAqPSAtMTtcclxuICAgICAgICAgICAgdXAgPSB0aGlzLmdldFBvc2l0aW9uKHgsIHogLSAxKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJpZ2h0LnN1YnRyYWN0KGhlcmUpO1xyXG4gICAgICAgIHVwLnN1YnRyYWN0KGhlcmUpO1xyXG5cclxuICAgICAgICBjb25zdCBub3JtYWwgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIG5vcm1hbC5zZXQodXApO1xyXG4gICAgICAgIG5vcm1hbC5jcm9zcyhyaWdodCk7XHJcbiAgICAgICAgbm9ybWFsLm11bHRpcGx5U2NhbGFyKGZsaXApO1xyXG4gICAgICAgIG5vcm1hbC5ub3JtYWxpemUoKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG5vcm1hbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2J1aWxkTm9ybWFscyAoKSB7XHJcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHRoaXMudmVydGV4Q291bnRbMV07ICsreSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHRoaXMudmVydGV4Q291bnRbMF07ICsreCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbiA9IHRoaXMuX2NhbGNOb3JtYWwoeCwgeSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsc1tpbmRleCAqIDMgKyAwXSA9IG4ueDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbHNbaW5kZXggKiAzICsgMV0gPSBuLnk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWxzW2luZGV4ICogMyArIDJdID0gbi56O1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9idWlsZEltcCAocmVzdG9yZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMudmFsaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIXJlc3RvcmUgJiYgdGhpcy5fX2Fzc2V0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5fdGlsZVNpemUgPSB0aGlzLl9fYXNzZXQudGlsZVNpemU7XHJcbiAgICAgICAgICAgIHRoaXMuX2Jsb2NrQ291bnQgPSB0aGlzLl9fYXNzZXQuYmxvY2tDb3VudDtcclxuICAgICAgICAgICAgdGhpcy5fd2VpZ2h0TWFwU2l6ZSA9IHRoaXMuX19hc3NldC53ZWlnaHRNYXBTaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9saWdodE1hcFNpemUgPSB0aGlzLl9fYXNzZXQubGlnaHRNYXBTaXplO1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHRzID0gdGhpcy5fX2Fzc2V0LmhlaWdodHM7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlaWdodHMgPSB0aGlzLl9fYXNzZXQud2VpZ2h0cztcclxuXHJcbiAgICAgICAgICAgIC8vIGJ1aWxkIGxheWVyc1xyXG4gICAgICAgICAgICBsZXQgaW5pdGlhbCA9IHRydWU7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbGF5ZXJzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fbGF5ZXJzW2ldICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbml0aWFsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpbml0aWFsICYmIHRoaXMuX2Fzc2V0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLl9hc3NldC5sYXllckluZm9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbGF5ZXIgPSBuZXcgVGVycmFpbkxheWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXIudGlsZVNpemUgPSBpLnRpbGVTaXplO1xyXG4gICAgICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmxvYWRlci5sb2FkUmVzKGkuZGV0YWlsTWFwLCBUZXh0dXJlMkQsIChlcnIsIGFzc2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyLmRldGFpbE1hcCA9IGFzc2V0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9sYXllcnNbaS5zbG90XSA9IGxheWVyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5fYmxvY2tDb3VudFswXSA9PT0gMCB8fCB0aGlzLl9ibG9ja0NvdW50WzFdID09PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGJ1aWxkIGhlaWdodHMgJiBub3JtYWxzXHJcbiAgICAgICAgY29uc3QgdmVydGV4Q291bnQgPSB0aGlzLnZlcnRleENvdW50WzBdICogdGhpcy52ZXJ0ZXhDb3VudFsxXTtcclxuICAgICAgICBpZiAodGhpcy5faGVpZ2h0cyA9PT0gbnVsbCB8fCB0aGlzLl9oZWlnaHRzLmxlbmd0aCAhPT0gdmVydGV4Q291bnQpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0cyA9IG5ldyBVaW50MTZBcnJheSh2ZXJ0ZXhDb3VudCk7XHJcbiAgICAgICAgICAgIHRoaXMuX25vcm1hbHMgPSBuZXcgQXJyYXk8bnVtYmVyPih2ZXJ0ZXhDb3VudCAqIDMpO1xyXG5cclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB2ZXJ0ZXhDb3VudDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9oZWlnaHRzW2ldID0gVEVSUkFJTl9IRUlHSFRfQkFTRTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX25vcm1hbHNbaSAqIDMgKyAwXSA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9ub3JtYWxzW2kgKiAzICsgMV0gPSAxO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbm9ybWFsc1tpICogMyArIDJdID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fbm9ybWFscyA9IG5ldyBBcnJheTxudW1iZXI+KHZlcnRleENvdW50ICogMyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2J1aWxkTm9ybWFscygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gYnVpbGQgd2VpZ2h0c1xyXG4gICAgICAgIGNvbnN0IHdlaWdodE1hcENvbXBsZXhpdHlVID0gdGhpcy5fd2VpZ2h0TWFwU2l6ZSAqIHRoaXMuX2Jsb2NrQ291bnRbMF07XHJcbiAgICAgICAgY29uc3Qgd2VpZ2h0TWFwQ29tcGxleGl0eVYgPSB0aGlzLl93ZWlnaHRNYXBTaXplICogdGhpcy5fYmxvY2tDb3VudFsxXTtcclxuICAgICAgICBpZiAodGhpcy5fd2VpZ2h0cy5sZW5ndGggIT09IHdlaWdodE1hcENvbXBsZXhpdHlVICogd2VpZ2h0TWFwQ29tcGxleGl0eVYgKiA0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3dlaWdodHMgPSBuZXcgVWludDhBcnJheSh3ZWlnaHRNYXBDb21wbGV4aXR5VSAqIHdlaWdodE1hcENvbXBsZXhpdHlWICogNCk7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd2VpZ2h0TWFwQ29tcGxleGl0eVUgKiB3ZWlnaHRNYXBDb21wbGV4aXR5VjsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWlnaHRzW2kgKiA0ICsgMF0gPSAyNTU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93ZWlnaHRzW2kgKiA0ICsgMV0gPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fd2VpZ2h0c1tpICogNCArIDJdID0gMDtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dlaWdodHNbaSAqIDQgKyAzXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGJ1aWxkIGJsb2Nrc1xyXG4gICAgICAgIGlmICh0aGlzLl9ibG9ja0luZm9zLmxlbmd0aCAhPT0gdGhpcy5fYmxvY2tDb3VudFswXSAqIHRoaXMuX2Jsb2NrQ291bnRbMV0pIHtcclxuICAgICAgICAgICAgdGhpcy5fYmxvY2tJbmZvcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2Jsb2NrQ291bnRbMV07ICsraikge1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ibG9ja0NvdW50WzBdOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gbmV3IFRlcnJhaW5CbG9ja0luZm8oKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fYXNzZXQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvLmxheWVyc1swXSA9IHRoaXMuX2Fzc2V0LmdldExheWVyKGksIGosIDApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbMV0gPSB0aGlzLl9hc3NldC5nZXRMYXllcihpLCBqLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8ubGF5ZXJzWzFdID09PSBpbmZvLmxheWVyc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbMV0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbMl0gPSB0aGlzLl9hc3NldC5nZXRMYXllcihpLCBqLCAyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8ubGF5ZXJzWzJdID09PSBpbmZvLmxheWVyc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbMl0gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbM10gPSB0aGlzLl9hc3NldC5nZXRMYXllcihpLCBqLCAzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZm8ubGF5ZXJzWzNdID09PSBpbmZvLmxheWVyc1swXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mby5sYXllcnNbM10gPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmxvY2tJbmZvcy5wdXNoKGluZm8pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2Jsb2NrQ291bnRbMV07ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2Jsb2NrQ291bnRbMF07ICsraSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fYmxvY2tzLnB1c2gobmV3IFRlcnJhaW5CbG9jayh0aGlzLCBpLCBqKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgaSBvZiB0aGlzLl9ibG9ja3MpIHtcclxuICAgICAgICAgICAgaS5idWlsZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZWJ1aWxkSGVpZ2h0cyAoaW5mbzogVGVycmFpbkluZm8pIHtcclxuICAgICAgICBpZiAodGhpcy52ZXJ0ZXhDb3VudFswXSA9PT0gaW5mby52ZXJ0ZXhDb3VudFswXSAmJlxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvdW50WzFdID09PSBpbmZvLnZlcnRleENvdW50WzFdKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGhlaWdodHMgPSBuZXcgVWludDE2QXJyYXkoaW5mby52ZXJ0ZXhDb3VudFswXSAqIGluZm8udmVydGV4Q291bnRbMV0pO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaGVpZ2h0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBoZWlnaHRzW2ldID0gVEVSUkFJTl9IRUlHSFRfQkFTRTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHcgPSBNYXRoLm1pbih0aGlzLnZlcnRleENvdW50WzBdLCBpbmZvLnZlcnRleENvdW50WzBdKTtcclxuICAgICAgICBjb25zdCBoID0gTWF0aC5taW4odGhpcy52ZXJ0ZXhDb3VudFsxXSwgaW5mby52ZXJ0ZXhDb3VudFsxXSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaDsgKytqKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdzsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleDAgPSBqICogaW5mby52ZXJ0ZXhDb3VudFswXSArIGk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmRleDEgPSBqICogdGhpcy52ZXJ0ZXhDb3VudFswXSArIGk7XHJcblxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0c1tpbmRleDBdID0gdGhpcy5faGVpZ2h0c1tpbmRleDFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9oZWlnaHRzID0gaGVpZ2h0cztcclxuXHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmVidWlsZFdlaWdodHMgKGluZm86IFRlcnJhaW5JbmZvKSB7XHJcbiAgICAgICAgY29uc3Qgb2xkV2VpZ2h0TWFwU2l6ZSA9IHRoaXMuX3dlaWdodE1hcFNpemU7XHJcbiAgICAgICAgY29uc3Qgb2xkV2VpZ2h0TWFwQ29tcGxleGl0eVUgPSB0aGlzLl93ZWlnaHRNYXBTaXplICogdGhpcy5fYmxvY2tDb3VudFswXTtcclxuICAgICAgICBjb25zdCBvbGRXZWlnaHRNYXBDb21wbGV4aXR5ViA9IHRoaXMuX3dlaWdodE1hcFNpemUgKiB0aGlzLl9ibG9ja0NvdW50WzFdO1xyXG5cclxuICAgICAgICBjb25zdCB3ZWlnaHRNYXBDb21wbGV4aXR5VSA9IGluZm8ud2VpZ2h0TWFwU2l6ZSAqIGluZm8uYmxvY2tDb3VudFswXTtcclxuICAgICAgICBjb25zdCB3ZWlnaHRNYXBDb21wbGV4aXR5ViA9IGluZm8ud2VpZ2h0TWFwU2l6ZSAqIGluZm8uYmxvY2tDb3VudFsxXTtcclxuXHJcbiAgICAgICAgaWYgKHdlaWdodE1hcENvbXBsZXhpdHlVID09PSBvbGRXZWlnaHRNYXBDb21wbGV4aXR5VSAmJlxyXG4gICAgICAgICAgICB3ZWlnaHRNYXBDb21wbGV4aXR5ViA9PT0gb2xkV2VpZ2h0TWFwQ29tcGxleGl0eVYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgd2VpZ2h0cyA9IG5ldyBVaW50OEFycmF5KHdlaWdodE1hcENvbXBsZXhpdHlVICogd2VpZ2h0TWFwQ29tcGxleGl0eVYgKiA0KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3ZWlnaHRNYXBDb21wbGV4aXR5VSAqIHdlaWdodE1hcENvbXBsZXhpdHlWOyArK2kpIHtcclxuICAgICAgICAgICAgd2VpZ2h0c1tpICogNCArIDBdID0gMjU1O1xyXG4gICAgICAgICAgICB3ZWlnaHRzW2kgKiA0ICsgMV0gPSAwO1xyXG4gICAgICAgICAgICB3ZWlnaHRzW2kgKiA0ICsgMl0gPSAwO1xyXG4gICAgICAgICAgICB3ZWlnaHRzW2kgKiA0ICsgM10gPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgdyA9IE1hdGgubWluKGluZm8uYmxvY2tDb3VudFswXSwgdGhpcy5fYmxvY2tDb3VudFswXSk7XHJcbiAgICAgICAgY29uc3QgaCA9IE1hdGgubWluKGluZm8uYmxvY2tDb3VudFsxXSwgdGhpcy5fYmxvY2tDb3VudFsxXSk7XHJcblxyXG4gICAgICAgIC8vIGdldCB3ZWlnaHRcclxuICAgICAgICBjb25zdCBnZXRPbGRXZWlnaHQgPSAoX2k6IG51bWJlciwgX2o6IG51bWJlciwgX3dlaWdodHM6IFVpbnQ4QXJyYXkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBfaiAqIG9sZFdlaWdodE1hcENvbXBsZXhpdHlVICsgX2k7XHJcblxyXG4gICAgICAgICAgICBjb25zdCB3ZWlnaHQgPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgICAgICB3ZWlnaHQueCA9IF93ZWlnaHRzW2luZGV4ICogNCArIDBdIC8gMjU1LjA7XHJcbiAgICAgICAgICAgIHdlaWdodC55ID0gX3dlaWdodHNbaW5kZXggKiA0ICsgMV0gLyAyNTUuMDtcclxuICAgICAgICAgICAgd2VpZ2h0LnogPSBfd2VpZ2h0c1tpbmRleCAqIDQgKyAyXSAvIDI1NS4wO1xyXG4gICAgICAgICAgICB3ZWlnaHQudyA9IF93ZWlnaHRzW2luZGV4ICogNCArIDNdIC8gMjU1LjA7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gd2VpZ2h0O1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIHNhbXBsZSB3ZWlnaHRcclxuICAgICAgICBjb25zdCBzYW1wbGVPbGRXZWlnaHQgPSAoX3g6IG51bWJlciwgX3k6IG51bWJlciwgX3hPZmY6IG51bWJlciwgX3lPZmY6IG51bWJlciwgX3dlaWdodHM6IFVpbnQ4QXJyYXkpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaXgwID0gTWF0aC5mbG9vcihfeCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGl6MCA9IE1hdGguZmxvb3IoX3kpO1xyXG4gICAgICAgICAgICBjb25zdCBpeDEgPSBpeDAgKyAxO1xyXG4gICAgICAgICAgICBjb25zdCBpejEgPSBpejAgKyAxO1xyXG4gICAgICAgICAgICBjb25zdCBkeCA9IF94IC0gaXgwO1xyXG4gICAgICAgICAgICBjb25zdCBkeiA9IF95IC0gaXowO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYSA9IGdldE9sZFdlaWdodChpeDAgKyBfeE9mZiwgaXowICsgX3lPZmYsIHRoaXMuX3dlaWdodHMpO1xyXG4gICAgICAgICAgICBjb25zdCBiID0gZ2V0T2xkV2VpZ2h0KGl4MSArIF94T2ZmLCBpejAgKyBfeU9mZiwgdGhpcy5fd2VpZ2h0cyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGMgPSBnZXRPbGRXZWlnaHQoaXgwICsgX3hPZmYsIGl6MSArIF95T2ZmLCB0aGlzLl93ZWlnaHRzKTtcclxuICAgICAgICAgICAgY29uc3QgZCA9IGdldE9sZFdlaWdodChpeDEgKyBfeE9mZiwgaXoxICsgX3lPZmYsIHRoaXMuX3dlaWdodHMpO1xyXG4gICAgICAgICAgICBjb25zdCBtID0gbmV3IFZlYzQoKTtcclxuICAgICAgICAgICAgVmVjNC5hZGQobSwgYiwgYykubXVsdGlwbHlTY2FsYXIoMC41KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkeCArIGR6IDw9IDEuMCkge1xyXG4gICAgICAgICAgICAgICAgZC5zZXQobSk7XHJcbiAgICAgICAgICAgICAgICBkLnN1YnRyYWN0KGEpO1xyXG4gICAgICAgICAgICAgICAgZC5hZGQobSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBhLnNldChtKTtcclxuICAgICAgICAgICAgICAgIGEuc3VidHJhY3QoZCk7XHJcbiAgICAgICAgICAgICAgICBhLmFkZChtKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgbjEgPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgICAgICBjb25zdCBuMiA9IG5ldyBWZWM0KCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG4gPSBuZXcgVmVjNCgpO1xyXG4gICAgICAgICAgICBWZWM0LmxlcnAobjEsIGEsIGIsIGR4KTtcclxuICAgICAgICAgICAgVmVjNC5sZXJwKG4yLCBjLCBkLCBkeCk7XHJcbiAgICAgICAgICAgIFZlYzQubGVycChuLCBuMSwgbjIsIGR6KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIGZpbGwgbmV3IHdlaWdodHNcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGg7ICsraikge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdU9mZiA9IGkgKiBvbGRXZWlnaHRNYXBTaXplO1xyXG4gICAgICAgICAgICAgICAgY29uc3Qgdk9mZiA9IGogKiBvbGRXZWlnaHRNYXBTaXplO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IHYgPSAwOyB2IDwgaW5mby53ZWlnaHRNYXBTaXplOyArK3YpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCB1ID0gMDsgdSA8IGluZm8ud2VpZ2h0TWFwU2l6ZTsgKyt1KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogbm8tc2hhZG93ZWQtdmFyaWFibGVcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHc6IFZlYzQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmZvLndlaWdodE1hcFNpemUgPT09IG9sZFdlaWdodE1hcFNpemUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBnZXRPbGRXZWlnaHQodSArIHVPZmYsIHYgKyB2T2ZmLCB0aGlzLl93ZWlnaHRzKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHggPSB1IC8gKGluZm8ud2VpZ2h0TWFwU2l6ZSAtIDEpICogKG9sZFdlaWdodE1hcFNpemUgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHkgPSB2IC8gKGluZm8ud2VpZ2h0TWFwU2l6ZSAtIDEpICogKG9sZFdlaWdodE1hcFNpemUgLSAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHcgPSBzYW1wbGVPbGRXZWlnaHQoeCwgeSwgdU9mZiwgdk9mZiwgdGhpcy5fd2VpZ2h0cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR1ID0gaSAqIGluZm8ud2VpZ2h0TWFwU2l6ZSArIHU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGR2ID0gaiAqIGluZm8ud2VpZ2h0TWFwU2l6ZSArIHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZHYgKiB3ZWlnaHRNYXBDb21wbGV4aXR5VSArIGR1O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpbmRleCAqIDQgKyAwXSA9IHcueCAqIDI1NTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpbmRleCAqIDQgKyAxXSA9IHcueSAqIDI1NTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpbmRleCAqIDQgKyAyXSA9IHcueiAqIDI1NTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2VpZ2h0c1tpbmRleCAqIDQgKyAzXSA9IHcudyAqIDI1NTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3dlaWdodHMgPSB3ZWlnaHRzO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG4iXX0=