(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../assets/material.js", "../../memop/index.js", "../../memop/cached-array.js", "../../scene-graph/index.js", "./mesh-buffer.js", "./stencil-manager.js", "./ui-batch-model.js", "./ui-draw-batch.js", "./ui-material.js", "./ui-vertex-format.js", "../../global-exports.js", "../core/memory-pools.js", "../../pipeline/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../assets/material.js"), require("../../memop/index.js"), require("../../memop/cached-array.js"), require("../../scene-graph/index.js"), require("./mesh-buffer.js"), require("./stencil-manager.js"), require("./ui-batch-model.js"), require("./ui-draw-batch.js"), require("./ui-material.js"), require("./ui-vertex-format.js"), require("../../global-exports.js"), require("../core/memory-pools.js"), require("../../pipeline/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.material, global.index, global.cachedArray, global.index, global.meshBuffer, global.stencilManager, global.uiBatchModel, global.uiDrawBatch, global.uiMaterial, global.uiVertexFormat, global.globalExports, global.memoryPools, global.define);
    global.ui = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _material, _index, _cachedArray, _index2, _meshBuffer, _stencilManager, _uiBatchModel, _uiDrawBatch, _uiMaterial, UIVertexFormat, _globalExports, _memoryPools, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.UI = void 0;
  UIVertexFormat = _interopRequireWildcard(UIVertexFormat);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @zh
   * UI 渲染流程
   */
  var UI = /*#__PURE__*/function () {
    _createClass(UI, [{
      key: "renderScene",
      get: function get() {
        return this._scene;
      }
    }, {
      key: "currBufferBatch",
      get: function get() {
        return this._currMeshBuffer;
      },
      set: function set(value) {
        if (!value) {
          return;
        }

        this._currMeshBuffer = value;
      }
    }, {
      key: "currStaticRoot",
      set: function set(value) {
        this._currStaticRoot = value;
      }
    }]);

    function UI(_root) {
      var _this = this;

      _classCallCheck(this, UI);

      this.device = void 0;
      this._screens = [];
      this._bufferBatchPool = new _index.RecyclePool(function () {
        return new _meshBuffer.MeshBuffer(_this);
      }, 128);
      this._drawBatchPool = void 0;
      this._scene = void 0;
      this._attributes = [];
      this._meshBuffers = [];
      this._meshBufferUseCount = 0;
      this._uiMaterials = new Map();
      this._canvasMaterials = new Map();
      this._batches = void 0;
      this._uiModelPool = null;
      this._modelInUse = void 0;
      this._emptyMaterial = new _material.Material();
      this._currMaterial = this._emptyMaterial;
      this._currTexture = null;
      this._currSampler = null;
      this._currCanvas = null;
      this._currMeshBuffer = null;
      this._currStaticRoot = null;
      this._currComponent = null;
      this._parentOpacity = 1;
      this._root = _root;
      this.device = _root.device;
      this._scene = this._root.createScene({
        name: 'GUIScene'
      });
      this._uiModelPool = new _index.Pool(function () {
        var model = _globalExports.legacyCC.director.root.createModel(_uiBatchModel.UIBatchModel);

        model.enabled = true;
        model.visFlags |= _index2.Layers.Enum.UI_3D;
        return model;
      }, 2);
      this._modelInUse = new _cachedArray.CachedArray(10);
      this._batches = new _cachedArray.CachedArray(64);
      this._drawBatchPool = new _index.Pool(function () {
        return new _uiDrawBatch.UIDrawBatch();
      }, 128);

      _globalExports.legacyCC.director.on(_globalExports.legacyCC.Director.EVENT_BEFORE_DRAW, this.update, this);
    }

    _createClass(UI, [{
      key: "initialize",
      value: function initialize() {
        this._attributes = UIVertexFormat.vfmtPosUvColor;

        this._requireBufferBatch();

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        for (var i = 0; i < this._batches.array.length; i++) {
          this._batches.array[i].destroy(this);
        }

        for (var _i = 0; _i < this._meshBuffers.length; _i++) {
          this._meshBuffers[_i].destroy();
        }

        this._meshBuffers.splice(0);
      }
    }, {
      key: "getRenderSceneGetter",
      value: function getRenderSceneGetter() {
        return Object.getOwnPropertyDescriptor(Object.getPrototypeOf(this), 'renderScene').get.bind(this);
      }
    }, {
      key: "_getUIMaterial",
      value: function _getUIMaterial(mat) {
        if (this._uiMaterials.has(mat.hash)) {
          return this._uiMaterials.get(mat.hash);
        } else {
          var uiMat = new _uiMaterial.UIMaterial();
          uiMat.initialize({
            material: mat
          });

          this._uiMaterials.set(mat.hash, uiMat);

          return uiMat;
        }
      }
    }, {
      key: "_removeUIMaterial",
      value: function _removeUIMaterial(hash) {
        if (this._uiMaterials.has(hash)) {
          if (this._uiMaterials.get(hash).decrease() === 0) {
            this._uiMaterials["delete"](hash);
          }
        }
      }
      /**
       * @en
       * Add the managed Canvas.
       *
       * @zh
       * 添加屏幕组件管理。
       *
       * @param comp - 屏幕组件。
       */

    }, {
      key: "addScreen",
      value: function addScreen(comp) {
        var screens = this._screens; // clear the canvas old visibility cache in canvasMaterial list

        for (var i = 0; i < screens.length; i++) {
          var screen = screens[i];

          if (screen.camera) {
            var visibility = screen.camera.view.visibility;

            var matRecord = this._canvasMaterials.get(visibility);

            if (matRecord) {
              var matHashInter = matRecord.keys();
              var matHash = matHashInter.next();

              while (!matHash.done) {
                this._removeUIMaterial(matHash.value);

                matHash = matHashInter.next();
              }

              matRecord.clear();
            }
          }
        }

        this._screens.push(comp);

        this._screens.sort(this._screenSort);

        for (var _i2 = 0; _i2 < screens.length; _i2++) {
          var element = screens[_i2];

          if (element.camera) {
            element.camera.view.visibility = _index2.Layers.BitMask.UI_2D | _i2 + 1;

            if (!this._canvasMaterials.has(element.camera.view.visibility)) {
              this._canvasMaterials.set(element.camera.view.visibility, new Map());
            }
          }
        }
      }
      /**
       * @en
       * Get the Canvas by number.
       *
       * @zh
       * 通过屏幕编号获得屏幕组件。
       *
       * @param visibility - 屏幕编号。
       */

    }, {
      key: "getScreen",
      value: function getScreen(visibility) {
        var screens = this._screens;

        for (var i = 0; i < screens.length; ++i) {
          var screen = screens[i];

          if (screen.camera) {
            if (screen.camera.view.visibility === visibility) {
              return screen;
            }
          }
        }

        return null;
      }
      /**
       * @zh
       * Removes the Canvas from the list.
       *
       * @param comp - 被移除的屏幕。
       */

    }, {
      key: "removeScreen",
      value: function removeScreen(comp) {
        var _this2 = this;

        var idx = this._screens.indexOf(comp);

        if (idx === -1) {
          return;
        }

        this._screens.splice(idx, 1);

        if (comp.camera) {
          var matRecord = this._canvasMaterials.get(comp.camera.view.visibility);

          var matHashInter = matRecord.keys();
          var matHash = matHashInter.next();

          while (!matHash.done) {
            this._removeUIMaterial(matHash.value);

            matHash = matHashInter.next();
          }

          matRecord.clear();
        }

        var camera;

        for (var i = idx; i < this._screens.length; i++) {
          camera = this._screens[i].camera;

          if (camera) {
            (function () {
              var matRecord = _this2._canvasMaterials.get(camera.view.visibility);

              camera.view.visibility = _index2.Layers.BitMask.UI_2D | i + 1;

              var newMatRecord = _this2._canvasMaterials.get(camera.view.visibility);

              matRecord.forEach(function (value, key) {
                newMatRecord.set(key, value);
              });
              matRecord.clear();
            })();
          }
        }
      }
    }, {
      key: "update",
      value: function update(dt) {
        this._renderScreens(); // update buffers


        if (this._batches.length > 0) {
          var buffers = this._meshBuffers;

          for (var i = 0; i < buffers.length; ++i) {
            var bufferBatch = buffers[i];
            bufferBatch.uploadData();
            bufferBatch.reset();
          }
        }

        this.render();

        this._reset();
      }
    }, {
      key: "sortScreens",
      value: function sortScreens() {
        this._screens.sort(this._screenSort);
      }
    }, {
      key: "render",
      value: function render() {
        var batchPriority = 0;

        for (var m = 0; m < this._modelInUse.length; m++) {
          this._scene.removeModel(this._modelInUse.get(m));

          this._uiModelPool.free(this._modelInUse.get(m));
        }

        this._modelInUse.clear();

        if (this._batches.length) {
          for (var i = 0; i < this._batches.length; ++i) {
            var batch = this._batches.array[i];

            if (batch.model) {
              if (batch.camera) {
                var visFlags = batch.camera.view.visibility;
                batch.model.visFlags = visFlags;
                batch.model.node.layer = visFlags;
              }

              var subModels = batch.model.subModels;

              for (var j = 0; j < subModels.length; j++) {
                subModels[j].priority = batchPriority++;
              }
            } else {
              var descriptorSet = _memoryPools.DSPool.get(batch.hDescriptorSet);

              var binding = _define.ModelLocalBindings.SAMPLER_SPRITE;
              descriptorSet.bindTexture(binding, batch.texture);
              descriptorSet.bindSampler(binding, batch.sampler);
              descriptorSet.update();

              var uiModel = this._uiModelPool.alloc();

              uiModel.directInitialize(batch);

              this._scene.addModel(uiModel);

              uiModel.subModels[0].priority = batchPriority++;

              if (batch.camera) {
                var viewVisibility = batch.camera.view.visibility;
                uiModel.visFlags = viewVisibility;

                if (this._canvasMaterials.get(viewVisibility).get(batch.material.hash) == null) {
                  this._canvasMaterials.get(viewVisibility).set(batch.material.hash, 1);
                }
              }

              this._modelInUse.push(uiModel);
            }
          }
        }
      }
      /**
       * @en
       * Render component data submission process of UI.
       * The submitted vertex data is the UI for world coordinates.
       * For example: The UI components except Graphics and UIModel.
       *
       * @zh
       * UI 渲染组件数据提交流程（针对提交的顶点数据是世界坐标的提交流程，例如：除 Graphics 和 UIModel 的大部分 ui 组件）。
       * 此处的数据最终会生成需要提交渲染的 model 数据。
       *
       * @param comp - 当前执行组件。
       * @param frame - 当前执行组件贴图。
       * @param assembler - 当前组件渲染数据组装器。
       */

    }, {
      key: "commitComp",
      value: function commitComp(comp) {
        var frame = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var assembler = arguments.length > 2 ? arguments[2] : undefined;
        var sampler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var renderComp = comp;
        var texture = frame;
        var samp = sampler;
        var mat = renderComp.getRenderMaterial(0);

        if (!mat) {
          mat = renderComp._updateBuiltinMaterial();
          mat = renderComp._updateBlendFunc();
        }

        if (this._currMaterial !== mat || this._currTexture !== texture || this._currSampler !== samp) {
          this.autoMergeBatches(this._currComponent);
          this._currComponent = renderComp;
          this._currMaterial = mat;
          this._currTexture = texture;
          this._currSampler = samp;
        }

        if (assembler) {
          assembler.fillBuffers(renderComp, this);

          this._applyOpacity(renderComp);
        }
      }
      /**
       * @en
       * Render component data submission process of UI.
       * The submitted vertex data is the UI for local coordinates.
       * For example: The UI components of Graphics and UIModel.
       *
       * @zh
       * UI 渲染组件数据提交流程（针对例如： Graphics 和 UIModel 等数据量较为庞大的 ui 组件）。
       *
       * @param comp - 当前执行组件。
       * @param model - 提交渲染的 model 数据。
       * @param mat - 提交渲染的材质。
       */

    }, {
      key: "commitModel",
      value: function commitModel(comp, model, mat) {
        // if the last comp is spriteComp, previous comps should be batched.
        if (this._currMaterial !== this._emptyMaterial) {
          this.autoMergeBatches();
        }

        if (mat) {
          var rebuild = false;

          if (_stencilManager.StencilManager.sharedManager.handleMaterial(mat)) {
            var state = _stencilManager.StencilManager.sharedManager.pattern;
            mat.overridePipelineStates({
              depthStencilState: {
                stencilTestFront: state.stencilTest,
                stencilFuncFront: state.func,
                stencilReadMaskFront: state.stencilMask,
                stencilWriteMaskFront: state.writeMask,
                stencilFailOpFront: state.failOp,
                stencilZFailOpFront: state.zFailOp,
                stencilPassOpFront: state.passOp,
                stencilRefFront: state.ref,
                stencilTestBack: state.stencilTest,
                stencilFuncBack: state.func,
                stencilReadMaskBack: state.stencilMask,
                stencilWriteMaskBack: state.writeMask,
                stencilFailOpBack: state.failOp,
                stencilZFailOpBack: state.zFailOp,
                stencilPassOpBack: state.passOp,
                stencilRefBack: state.ref
              }
            });
            rebuild = true;
          }

          if (rebuild && model) {
            for (var i = 0; i < model.subModels.length; i++) {
              model.setSubModelMaterial(i, mat);
            }
          }
        }

        var uiCanvas = this._currCanvas;

        var curDrawBatch = this._drawBatchPool.alloc();

        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.model = model;
        curDrawBatch.bufferBatch = null;
        curDrawBatch.material = mat;
        curDrawBatch.texture = null;
        curDrawBatch.sampler = null; // reset current render state to null

        this._currMaterial = this._emptyMaterial;
        this._currComponent = null;
        this._currTexture = null;
        this._currSampler = null;

        this._batches.push(curDrawBatch);
      }
      /**
       * @en
       * Submit separate render data.
       * This data does not participate in the batch.
       *
       * @zh
       * 提交独立渲染数据.
       * @param comp 静态组件
       */

    }, {
      key: "commitStaticBatch",
      value: function commitStaticBatch(comp) {
        this._batches.concat(comp.drawBatchList);

        this.finishMergeBatches();
      }
      /**
       * @en
       * End a section of render data and submit according to the batch condition.
       *
       * @zh
       * 根据合批条件，结束一段渲染数据并提交。
       */

    }, {
      key: "autoMergeBatches",
      value: function autoMergeBatches(renderComp) {
        var buffer = this._currMeshBuffer;
        var uiCanvas = this._currCanvas;
        var hIA = buffer.recordBatch();
        var mat = this._currMaterial;

        if (!hIA || !mat) {
          return;
        }

        if (renderComp && _stencilManager.StencilManager.sharedManager.handleMaterial(mat)) {
          this._currMaterial = mat = renderComp.getUIMaterialInstance();
          var state = _stencilManager.StencilManager.sharedManager.pattern;
          mat.overridePipelineStates({
            depthStencilState: {
              stencilTestFront: state.stencilTest,
              stencilFuncFront: state.func,
              stencilReadMaskFront: state.stencilMask,
              stencilWriteMaskFront: state.writeMask,
              stencilFailOpFront: state.failOp,
              stencilZFailOpFront: state.zFailOp,
              stencilPassOpFront: state.passOp,
              stencilRefFront: state.ref,
              stencilTestBack: state.stencilTest,
              stencilFuncBack: state.func,
              stencilReadMaskBack: state.stencilMask,
              stencilWriteMaskBack: state.writeMask,
              stencilFailOpBack: state.failOp,
              stencilZFailOpBack: state.zFailOp,
              stencilPassOpBack: state.passOp,
              stencilRefBack: state.ref
            }
          });
        }

        var curDrawBatch = this._currStaticRoot ? this._currStaticRoot._requireDrawBatch() : this._drawBatchPool.alloc();
        curDrawBatch.camera = uiCanvas && uiCanvas.camera;
        curDrawBatch.bufferBatch = buffer;
        curDrawBatch.material = mat;
        curDrawBatch.texture = this._currTexture;
        curDrawBatch.sampler = this._currSampler;
        curDrawBatch.hInputAssembler = hIA;

        this._batches.push(curDrawBatch);

        buffer.vertexStart = buffer.vertexOffset;
        buffer.indicesStart = buffer.indicesOffset;
        buffer.byteStart = buffer.byteOffset;
      }
      /**
       * @en
       * Force changes to current batch data and merge
       *
       * @zh
       * 强行修改当前批次数据并合并。
       *
       * @param material - 当前批次的材质。
       * @param sprite - 当前批次的精灵帧。
       */

    }, {
      key: "forceMergeBatches",
      value: function forceMergeBatches(material, sprite) {
        this._currMaterial = material;
        this._currTexture = sprite;
        this.autoMergeBatches();
      }
      /**
       * @en
       * Forced to merge the data of the previous batch to start a new batch.
       *
       * @zh
       * 强制合并上一个批次的数据，开启新一轮合批。
       */

    }, {
      key: "finishMergeBatches",
      value: function finishMergeBatches() {
        this.autoMergeBatches();
        this._currMaterial = this._emptyMaterial;
        this._currTexture = null;
        this._currComponent = null;
      }
    }, {
      key: "_destroyUIMaterials",
      value: function _destroyUIMaterials() {
        var matIter = this._uiMaterials.values();

        var result = matIter.next();

        while (!result.done) {
          var uiMat = result.value;
          uiMat.destroy();
          result = matIter.next();
        }

        this._uiMaterials.clear();
      }
    }, {
      key: "_walk",
      value: function _walk(node) {
        var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var len = node.children.length;
        var parentOpacity = this._parentOpacity;
        this._parentOpacity *= node._uiProps.opacity;

        this._preprocess(node);

        if (len > 0 && !node._static) {
          var children = node.children;

          for (var i = 0; i < children.length; ++i) {
            var child = children[i];

            this._walk(child, level);
          }
        }

        this._postprocess(node);

        this._parentOpacity = parentOpacity;
        level += 1;
      }
    }, {
      key: "_renderScreens",
      value: function _renderScreens() {
        var screens = this._screens;

        for (var i = 0; i < screens.length; ++i) {
          var screen = screens[i];

          if (!screen.enabledInHierarchy) {
            continue;
          }

          this._currCanvas = screen;

          this._recursiveScreenNode(screen.node);
        }
      }
    }, {
      key: "_preprocess",
      value: function _preprocess(node) {
        if (!node._uiProps.uiTransformComp) {
          return;
        } // parent changed can flush child visibility


        node._uiProps.uiTransformComp._canvas = this._currCanvas;
        var render = node._uiProps.uiComp;

        if (render && render.enabledInHierarchy) {
          render.updateAssembler(this);
        }
      }
    }, {
      key: "_postprocess",
      value: function _postprocess(node) {
        var render = node._uiProps.uiComp;

        if (render && render.enabledInHierarchy) {
          render.postUpdateAssembler(this);
        }
      }
    }, {
      key: "_recursiveScreenNode",
      value: function _recursiveScreenNode(screen) {
        this._walk(screen);

        this.autoMergeBatches(this._currComponent);
      }
    }, {
      key: "_reset",
      value: function _reset() {
        for (var i = 0; i < this._batches.length; ++i) {
          var batch = this._batches.array[i];

          if (batch.isStatic) {
            continue;
          }

          batch.clear();

          this._drawBatchPool.free(batch);
        }

        this._parentOpacity = 1;

        this._batches.clear();

        this._currMaterial = this._emptyMaterial;
        this._currCanvas = null;
        this._currTexture = null;
        this._currSampler = null;
        this._currComponent = null;
        this._meshBufferUseCount = 0;

        this._requireBufferBatch();

        _stencilManager.StencilManager.sharedManager.reset();
      }
    }, {
      key: "_createMeshBuffer",
      value: function _createMeshBuffer() {
        var batch = this._bufferBatchPool.add();

        batch.initialize(this._attributes, this._requireBufferBatch.bind(this));

        this._meshBuffers.push(batch);

        return batch;
      }
    }, {
      key: "_requireBufferBatch",
      value: function _requireBufferBatch() {
        if (this._meshBufferUseCount >= this._meshBuffers.length) {
          this._currMeshBuffer = this._createMeshBuffer();
        } else {
          this._currMeshBuffer = this._meshBuffers[this._meshBufferUseCount];
        }

        this._meshBufferUseCount++;

        if (arguments.length === 2) {
          this._currMeshBuffer.request(arguments[0], arguments[1]);
        }
      }
    }, {
      key: "_screenSort",
      value: function _screenSort(a, b) {
        var delta = a.priority - b.priority;
        return delta === 0 ? a.node.getSiblingIndex() - b.node.getSiblingIndex() : delta;
      }
    }, {
      key: "_applyOpacity",
      value: function _applyOpacity(comp) {
        var color = comp.color.a / 255;
        var opacity = this._parentOpacity = this._parentOpacity * color;
        var byteOffset = this._currMeshBuffer.byteOffset >> 2;
        var vbuf = this._currMeshBuffer.vData;
        var lastByteOffset = this._currMeshBuffer.lastByteOffset >> 2;

        for (var i = lastByteOffset; i < byteOffset; i += 9) {
          vbuf[i + _meshBuffer.MeshBuffer.OPACITY_OFFSET] = opacity;
        }

        this._currMeshBuffer.lastByteOffset = this._currMeshBuffer.byteOffset;
      }
    }]);

    return UI;
  }();

  _exports.UI = UI;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvdWkvdWkudHMiXSwibmFtZXMiOlsiVUkiLCJfc2NlbmUiLCJfY3Vyck1lc2hCdWZmZXIiLCJ2YWx1ZSIsIl9jdXJyU3RhdGljUm9vdCIsIl9yb290IiwiZGV2aWNlIiwiX3NjcmVlbnMiLCJfYnVmZmVyQmF0Y2hQb29sIiwiUmVjeWNsZVBvb2wiLCJNZXNoQnVmZmVyIiwiX2RyYXdCYXRjaFBvb2wiLCJfYXR0cmlidXRlcyIsIl9tZXNoQnVmZmVycyIsIl9tZXNoQnVmZmVyVXNlQ291bnQiLCJfdWlNYXRlcmlhbHMiLCJNYXAiLCJfY2FudmFzTWF0ZXJpYWxzIiwiX2JhdGNoZXMiLCJfdWlNb2RlbFBvb2wiLCJfbW9kZWxJblVzZSIsIl9lbXB0eU1hdGVyaWFsIiwiTWF0ZXJpYWwiLCJfY3Vyck1hdGVyaWFsIiwiX2N1cnJUZXh0dXJlIiwiX2N1cnJTYW1wbGVyIiwiX2N1cnJDYW52YXMiLCJfY3VyckNvbXBvbmVudCIsIl9wYXJlbnRPcGFjaXR5IiwiY3JlYXRlU2NlbmUiLCJuYW1lIiwiUG9vbCIsIm1vZGVsIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsInJvb3QiLCJjcmVhdGVNb2RlbCIsIlVJQmF0Y2hNb2RlbCIsImVuYWJsZWQiLCJ2aXNGbGFncyIsIkxheWVycyIsIkVudW0iLCJVSV8zRCIsIkNhY2hlZEFycmF5IiwiVUlEcmF3QmF0Y2giLCJvbiIsIkRpcmVjdG9yIiwiRVZFTlRfQkVGT1JFX0RSQVciLCJ1cGRhdGUiLCJVSVZlcnRleEZvcm1hdCIsInZmbXRQb3NVdkNvbG9yIiwiX3JlcXVpcmVCdWZmZXJCYXRjaCIsImkiLCJhcnJheSIsImxlbmd0aCIsImRlc3Ryb3kiLCJzcGxpY2UiLCJPYmplY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm90b3R5cGVPZiIsImdldCIsImJpbmQiLCJtYXQiLCJoYXMiLCJoYXNoIiwidWlNYXQiLCJVSU1hdGVyaWFsIiwiaW5pdGlhbGl6ZSIsIm1hdGVyaWFsIiwic2V0IiwiZGVjcmVhc2UiLCJjb21wIiwic2NyZWVucyIsInNjcmVlbiIsImNhbWVyYSIsInZpc2liaWxpdHkiLCJ2aWV3IiwibWF0UmVjb3JkIiwibWF0SGFzaEludGVyIiwia2V5cyIsIm1hdEhhc2giLCJuZXh0IiwiZG9uZSIsIl9yZW1vdmVVSU1hdGVyaWFsIiwiY2xlYXIiLCJwdXNoIiwic29ydCIsIl9zY3JlZW5Tb3J0IiwiZWxlbWVudCIsIkJpdE1hc2siLCJVSV8yRCIsImlkeCIsImluZGV4T2YiLCJuZXdNYXRSZWNvcmQiLCJmb3JFYWNoIiwia2V5IiwiZHQiLCJfcmVuZGVyU2NyZWVucyIsImJ1ZmZlcnMiLCJidWZmZXJCYXRjaCIsInVwbG9hZERhdGEiLCJyZXNldCIsInJlbmRlciIsIl9yZXNldCIsImJhdGNoUHJpb3JpdHkiLCJtIiwicmVtb3ZlTW9kZWwiLCJmcmVlIiwiYmF0Y2giLCJub2RlIiwibGF5ZXIiLCJzdWJNb2RlbHMiLCJqIiwicHJpb3JpdHkiLCJkZXNjcmlwdG9yU2V0IiwiRFNQb29sIiwiaERlc2NyaXB0b3JTZXQiLCJiaW5kaW5nIiwiTW9kZWxMb2NhbEJpbmRpbmdzIiwiU0FNUExFUl9TUFJJVEUiLCJiaW5kVGV4dHVyZSIsInRleHR1cmUiLCJiaW5kU2FtcGxlciIsInNhbXBsZXIiLCJ1aU1vZGVsIiwiYWxsb2MiLCJkaXJlY3RJbml0aWFsaXplIiwiYWRkTW9kZWwiLCJ2aWV3VmlzaWJpbGl0eSIsImZyYW1lIiwiYXNzZW1ibGVyIiwicmVuZGVyQ29tcCIsInNhbXAiLCJnZXRSZW5kZXJNYXRlcmlhbCIsIl91cGRhdGVCdWlsdGluTWF0ZXJpYWwiLCJfdXBkYXRlQmxlbmRGdW5jIiwiYXV0b01lcmdlQmF0Y2hlcyIsImZpbGxCdWZmZXJzIiwiX2FwcGx5T3BhY2l0eSIsInJlYnVpbGQiLCJTdGVuY2lsTWFuYWdlciIsInNoYXJlZE1hbmFnZXIiLCJoYW5kbGVNYXRlcmlhbCIsInN0YXRlIiwicGF0dGVybiIsIm92ZXJyaWRlUGlwZWxpbmVTdGF0ZXMiLCJkZXB0aFN0ZW5jaWxTdGF0ZSIsInN0ZW5jaWxUZXN0RnJvbnQiLCJzdGVuY2lsVGVzdCIsInN0ZW5jaWxGdW5jRnJvbnQiLCJmdW5jIiwic3RlbmNpbFJlYWRNYXNrRnJvbnQiLCJzdGVuY2lsTWFzayIsInN0ZW5jaWxXcml0ZU1hc2tGcm9udCIsIndyaXRlTWFzayIsInN0ZW5jaWxGYWlsT3BGcm9udCIsImZhaWxPcCIsInN0ZW5jaWxaRmFpbE9wRnJvbnQiLCJ6RmFpbE9wIiwic3RlbmNpbFBhc3NPcEZyb250IiwicGFzc09wIiwic3RlbmNpbFJlZkZyb250IiwicmVmIiwic3RlbmNpbFRlc3RCYWNrIiwic3RlbmNpbEZ1bmNCYWNrIiwic3RlbmNpbFJlYWRNYXNrQmFjayIsInN0ZW5jaWxXcml0ZU1hc2tCYWNrIiwic3RlbmNpbEZhaWxPcEJhY2siLCJzdGVuY2lsWkZhaWxPcEJhY2siLCJzdGVuY2lsUGFzc09wQmFjayIsInN0ZW5jaWxSZWZCYWNrIiwic2V0U3ViTW9kZWxNYXRlcmlhbCIsInVpQ2FudmFzIiwiY3VyRHJhd0JhdGNoIiwiY29uY2F0IiwiZHJhd0JhdGNoTGlzdCIsImZpbmlzaE1lcmdlQmF0Y2hlcyIsImJ1ZmZlciIsImhJQSIsInJlY29yZEJhdGNoIiwiZ2V0VUlNYXRlcmlhbEluc3RhbmNlIiwiX3JlcXVpcmVEcmF3QmF0Y2giLCJoSW5wdXRBc3NlbWJsZXIiLCJ2ZXJ0ZXhTdGFydCIsInZlcnRleE9mZnNldCIsImluZGljZXNTdGFydCIsImluZGljZXNPZmZzZXQiLCJieXRlU3RhcnQiLCJieXRlT2Zmc2V0Iiwic3ByaXRlIiwibWF0SXRlciIsInZhbHVlcyIsInJlc3VsdCIsImxldmVsIiwibGVuIiwiY2hpbGRyZW4iLCJwYXJlbnRPcGFjaXR5IiwiX3VpUHJvcHMiLCJvcGFjaXR5IiwiX3ByZXByb2Nlc3MiLCJfc3RhdGljIiwiY2hpbGQiLCJfd2FsayIsIl9wb3N0cHJvY2VzcyIsImVuYWJsZWRJbkhpZXJhcmNoeSIsIl9yZWN1cnNpdmVTY3JlZW5Ob2RlIiwidWlUcmFuc2Zvcm1Db21wIiwiX2NhbnZhcyIsInVpQ29tcCIsInVwZGF0ZUFzc2VtYmxlciIsInBvc3RVcGRhdGVBc3NlbWJsZXIiLCJpc1N0YXRpYyIsImFkZCIsIl9jcmVhdGVNZXNoQnVmZmVyIiwiYXJndW1lbnRzIiwicmVxdWVzdCIsImEiLCJiIiwiZGVsdGEiLCJnZXRTaWJsaW5nSW5kZXgiLCJjb2xvciIsInZidWYiLCJ2RGF0YSIsImxhc3RCeXRlT2Zmc2V0IiwiT1BBQ0lUWV9PRkZTRVQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvREE7Ozs7TUFJYUEsRTs7OzBCQUV1QjtBQUM1QixlQUFPLEtBQUtDLE1BQVo7QUFDSDs7OzBCQUVzQjtBQUNuQixlQUFPLEtBQUtDLGVBQVo7QUFDSCxPO3dCQUVvQkMsSyxFQUFPO0FBQ3hCLFlBQUksQ0FBQ0EsS0FBTCxFQUFZO0FBQ1I7QUFDSDs7QUFFRCxhQUFLRCxlQUFMLEdBQXVCQyxLQUF2QjtBQUNIOzs7d0JBRW1CQSxLLEVBQTZCO0FBQzdDLGFBQUtDLGVBQUwsR0FBdUJELEtBQXZCO0FBQ0g7OztBQTRCRCxnQkFBcUJFLEtBQXJCLEVBQWtDO0FBQUE7O0FBQUE7O0FBQUEsV0ExQjNCQyxNQTBCMkI7QUFBQSxXQXpCMUJDLFFBeUIwQixHQXpCTCxFQXlCSztBQUFBLFdBeEIxQkMsZ0JBd0IwQixHQXhCa0IsSUFBSUMsa0JBQUosQ0FBZ0IsWUFBTTtBQUN0RSxlQUFPLElBQUlDLHNCQUFKLENBQWUsS0FBZixDQUFQO0FBQ0gsT0FGbUQsRUFFakQsR0FGaUQsQ0F3QmxCO0FBQUEsV0FyQjFCQyxjQXFCMEI7QUFBQSxXQXBCMUJWLE1Bb0IwQjtBQUFBLFdBbkIxQlcsV0FtQjBCLEdBbkJJLEVBbUJKO0FBQUEsV0FsQjFCQyxZQWtCMEIsR0FsQkcsRUFrQkg7QUFBQSxXQWpCMUJDLG1CQWlCMEIsR0FqQkosQ0FpQkk7QUFBQSxXQWhCMUJDLFlBZ0IwQixHQWhCYyxJ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Q0FBc0I2TixjQUF0QixHQUF1QyxLQUFLN04sZUFBTCxDQUFzQjBMLFVBQTdEO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE5IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcbi8qKlxyXG4gKiBAaGlkZGVuXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVUlTdGF0aWNCYXRjaCB9IGZyb20gJy4uLy4uLy4uL3VpJztcclxuaW1wb3J0IHsgTWF0ZXJpYWwgfSBmcm9tICcuLi8uLi9hc3NldHMvbWF0ZXJpYWwnO1xyXG5pbXBvcnQgeyBDYW52YXMsIFVJQ29tcG9uZW50LCBVSVJlbmRlcmFibGUgfSBmcm9tICcuLi8uLi9jb21wb25lbnRzL3VpLWJhc2UnO1xyXG5pbXBvcnQgeyBHRlhEZXZpY2UgfSBmcm9tICcuLi8uLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgR0ZYQXR0cmlidXRlIH0gZnJvbSAnLi4vLi4vZ2Z4L2lucHV0LWFzc2VtYmxlcic7XHJcbmltcG9ydCB7IEdGWFNhbXBsZXIgfSBmcm9tICcuLi8uLi9nZngvc2FtcGxlcic7XHJcbmltcG9ydCB7IEdGWFRleHR1cmUgfSBmcm9tICcuLi8uLi9nZngvdGV4dHVyZSc7XHJcbmltcG9ydCB7IFBvb2wsIFJlY3ljbGVQb29sIH0gZnJvbSAnLi4vLi4vbWVtb3AnO1xyXG5pbXBvcnQgeyBDYWNoZWRBcnJheSB9IGZyb20gJy4uLy4uL21lbW9wL2NhY2hlZC1hcnJheSc7XHJcbmltcG9ydCB7IENhbWVyYSB9IGZyb20gJy4uL3NjZW5lL2NhbWVyYSc7XHJcbmltcG9ydCB7IE1vZGVsIH0gZnJvbSAnLi4vc2NlbmUvbW9kZWwnO1xyXG5pbXBvcnQgeyBSZW5kZXJTY2VuZSB9IGZyb20gJy4uL3NjZW5lL3JlbmRlci1zY2VuZSc7XHJcbmltcG9ydCB7IFJvb3QgfSBmcm9tICcuLi8uLi9yb290JztcclxuaW1wb3J0IHsgTGF5ZXJzLCBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBNZXNoQnVmZmVyIH0gZnJvbSAnLi9tZXNoLWJ1ZmZlcic7XHJcbmltcG9ydCB7IFN0ZW5jaWxNYW5hZ2VyIH0gZnJvbSAnLi9zdGVuY2lsLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBVSUJhdGNoTW9kZWwgfSBmcm9tICcuL3VpLWJhdGNoLW1vZGVsJztcclxuaW1wb3J0IHsgVUlEcmF3QmF0Y2ggfSBmcm9tICcuL3VpLWRyYXctYmF0Y2gnO1xyXG5pbXBvcnQgeyBVSU1hdGVyaWFsIH0gZnJvbSAnLi91aS1tYXRlcmlhbCc7XHJcbmltcG9ydCAqIGFzIFVJVmVydGV4Rm9ybWF0IGZyb20gJy4vdWktdmVydGV4LWZvcm1hdCc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBEU1Bvb2wgfSBmcm9tICcuLi9jb3JlL21lbW9yeS1wb29scyc7XHJcbmltcG9ydCB7IE1vZGVsTG9jYWxCaW5kaW5ncyB9IGZyb20gJy4uLy4uL3BpcGVsaW5lL2RlZmluZSc7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIFVJIOa4suafk+a1geeoi1xyXG4gKi9cclxuZXhwb3J0IGNsYXNzIFVJIHtcclxuXHJcbiAgICBnZXQgcmVuZGVyU2NlbmUgKCk6IFJlbmRlclNjZW5lIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IGN1cnJCdWZmZXJCYXRjaCAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cnJNZXNoQnVmZmVyO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjdXJyQnVmZmVyQmF0Y2ggKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKCF2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9jdXJyTWVzaEJ1ZmZlciA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIHNldCBjdXJyU3RhdGljUm9vdCAodmFsdWU6IFVJU3RhdGljQmF0Y2ggfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fY3VyclN0YXRpY1Jvb3QgPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGV2aWNlOiBHRlhEZXZpY2U7XHJcbiAgICBwcml2YXRlIF9zY3JlZW5zOiBDYW52YXNbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfYnVmZmVyQmF0Y2hQb29sOiBSZWN5Y2xlUG9vbDxNZXNoQnVmZmVyPiA9IG5ldyBSZWN5Y2xlUG9vbCgoKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBNZXNoQnVmZmVyKHRoaXMpO1xyXG4gICAgfSwgMTI4KTtcclxuICAgIHByaXZhdGUgX2RyYXdCYXRjaFBvb2w6IFBvb2w8VUlEcmF3QmF0Y2g+O1xyXG4gICAgcHJpdmF0ZSBfc2NlbmU6IFJlbmRlclNjZW5lO1xyXG4gICAgcHJpdmF0ZSBfYXR0cmlidXRlczogR0ZYQXR0cmlidXRlW10gPSBbXTtcclxuICAgIHByaXZhdGUgX21lc2hCdWZmZXJzOiBNZXNoQnVmZmVyW10gPSBbXTtcclxuICAgIHByaXZhdGUgX21lc2hCdWZmZXJVc2VDb3VudCA9IDA7XHJcbiAgICBwcml2YXRlIF91aU1hdGVyaWFsczogTWFwPG51bWJlciwgVUlNYXRlcmlhbD4gPSBuZXcgTWFwPG51bWJlciwgVUlNYXRlcmlhbD4oKTtcclxuICAgIHByaXZhdGUgX2NhbnZhc01hdGVyaWFsczogTWFwPG51bWJlciwgTWFwPG51bWJlciwgbnVtYmVyPj4gPSBuZXcgTWFwPG51bWJlciwgTWFwPG51bWJlciwgbnVtYmVyPj4oKTtcclxuICAgIHByaXZhdGUgX2JhdGNoZXM6IENhY2hlZEFycmF5PFVJRHJhd0JhdGNoPjtcclxuICAgIHByaXZhdGUgX3VpTW9kZWxQb29sOiBQb29sPFVJQmF0Y2hNb2RlbD4gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX21vZGVsSW5Vc2U6IENhY2hlZEFycmF5PFVJQmF0Y2hNb2RlbD47XHJcbiAgICAvLyBiYXRjaGVyXHJcbiAgICBwcml2YXRlIF9lbXB0eU1hdGVyaWFsID0gbmV3IE1hdGVyaWFsKCk7XHJcbiAgICBwcml2YXRlIF9jdXJyTWF0ZXJpYWw6IE1hdGVyaWFsID0gdGhpcy5fZW1wdHlNYXRlcmlhbDtcclxuICAgIHByaXZhdGUgX2N1cnJUZXh0dXJlOiBHRlhUZXh0dXJlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9jdXJyU2FtcGxlcjogR0ZYU2FtcGxlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY3VyckNhbnZhczogQ2FudmFzIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9jdXJyTWVzaEJ1ZmZlcjogTWVzaEJ1ZmZlciB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY3VyclN0YXRpY1Jvb3Q6IFVJU3RhdGljQmF0Y2ggfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2N1cnJDb21wb25lbnQ6IFVJUmVuZGVyYWJsZSB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGFyZW50T3BhY2l0eSA9IDE7XHJcblxyXG4gICAgY29uc3RydWN0b3IgKHByaXZhdGUgX3Jvb3Q6IFJvb3QpIHtcclxuICAgICAgICB0aGlzLmRldmljZSA9IF9yb290LmRldmljZTtcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IHRoaXMuX3Jvb3QuY3JlYXRlU2NlbmUoe1xyXG4gICAgICAgICAgICBuYW1lOiAnR1VJU2NlbmUnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3VpTW9kZWxQb29sID0gbmV3IFBvb2woKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IGxlZ2FjeUNDLmRpcmVjdG9yLnJvb3QuY3JlYXRlTW9kZWwoVUlCYXRjaE1vZGVsKTtcclxuICAgICAgICAgICAgbW9kZWwuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIG1vZGVsLnZpc0ZsYWdzIHw9IExheWVycy5FbnVtLlVJXzNEO1xyXG4gICAgICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICAgICAgfSwgMik7XHJcbiAgICAgICAgdGhpcy5fbW9kZWxJblVzZSA9IG5ldyBDYWNoZWRBcnJheTxVSUJhdGNoTW9kZWw+KDEwKTtcclxuICAgICAgICB0aGlzLl9iYXRjaGVzID0gbmV3IENhY2hlZEFycmF5KDY0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fZHJhd0JhdGNoUG9vbCA9IG5ldyBQb29sKCgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBVSURyYXdCYXRjaCgpO1xyXG4gICAgICAgIH0sIDEyOCk7XHJcblxyXG4gICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLm9uKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXLCB0aGlzLnVwZGF0ZSwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGluaXRpYWxpemUgKCkge1xyXG5cclxuICAgICAgICB0aGlzLl9hdHRyaWJ1dGVzID0gVUlWZXJ0ZXhGb3JtYXQudmZtdFBvc1V2Q29sb3I7XHJcblxyXG4gICAgICAgIHRoaXMuX3JlcXVpcmVCdWZmZXJCYXRjaCgpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYmF0Y2hlcy5hcnJheS5sZW5ndGg7IGkrKyApIHtcclxuICAgICAgICAgICAgdGhpcy5fYmF0Y2hlcy5hcnJheVtpXS5kZXN0cm95KHRoaXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tZXNoQnVmZmVycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLl9tZXNoQnVmZmVyc1tpXS5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21lc2hCdWZmZXJzLnNwbGljZSgwKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0UmVuZGVyU2NlbmVHZXR0ZXIgKCkge1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSwgJ3JlbmRlclNjZW5lJykhLmdldCEuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgX2dldFVJTWF0ZXJpYWwgKG1hdDogTWF0ZXJpYWwpOiBVSU1hdGVyaWFsIHtcclxuICAgICAgICBpZiAodGhpcy5fdWlNYXRlcmlhbHMuaGFzKG1hdC5oYXNoKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdWlNYXRlcmlhbHMuZ2V0KG1hdC5oYXNoKSE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdWlNYXQgPSBuZXcgVUlNYXRlcmlhbCgpO1xyXG4gICAgICAgICAgICB1aU1hdC5pbml0aWFsaXplKHsgbWF0ZXJpYWw6IG1hdCB9KTtcclxuICAgICAgICAgICAgdGhpcy5fdWlNYXRlcmlhbHMuc2V0KG1hdC5oYXNoLCB1aU1hdCk7XHJcbiAgICAgICAgICAgIHJldHVybiB1aU1hdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9yZW1vdmVVSU1hdGVyaWFsIChoYXNoOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAodGhpcy5fdWlNYXRlcmlhbHMuaGFzKGhhc2gpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl91aU1hdGVyaWFscy5nZXQoaGFzaCkhLmRlY3JlYXNlKCkgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3VpTWF0ZXJpYWxzLmRlbGV0ZShoYXNoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQWRkIHRoZSBtYW5hZ2VkIENhbnZhcy5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOWxj+W5lee7hOS7tueuoeeQhuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wIC0g5bGP5bmV57uE5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhZGRTY3JlZW4gKGNvbXA6IENhbnZhcykge1xyXG4gICAgICAgIGNvbnN0IHNjcmVlbnMgPSB0aGlzLl9zY3JlZW5zO1xyXG4gICAgICAgIC8vIGNsZWFyIHRoZSBjYW52YXMgb2xkIHZpc2liaWxpdHkgY2FjaGUgaW4gY2FudmFzTWF0ZXJpYWwgbGlzdFxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NyZWVucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW4gPSBzY3JlZW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAoc2NyZWVuLmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlzaWJpbGl0eSA9IHNjcmVlbi5jYW1lcmEudmlldy52aXNpYmlsaXR5O1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF0UmVjb3JkID0gdGhpcy5fY2FudmFzTWF0ZXJpYWxzLmdldCh2aXNpYmlsaXR5KTtcclxuICAgICAgICAgICAgICAgIGlmIChtYXRSZWNvcmQpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBtYXRIYXNoSW50ZXIgPSBtYXRSZWNvcmQhLmtleXMoKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgbWF0SGFzaCA9IG1hdEhhc2hJbnRlci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFtYXRIYXNoLmRvbmUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVtb3ZlVUlNYXRlcmlhbChtYXRIYXNoLnZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWF0SGFzaCA9IG1hdEhhc2hJbnRlci5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBtYXRSZWNvcmQuY2xlYXIoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fc2NyZWVucy5wdXNoKGNvbXApO1xyXG4gICAgICAgIHRoaXMuX3NjcmVlbnMuc29ydCh0aGlzLl9zY3JlZW5Tb3J0KTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudCA9IHNjcmVlbnNbaV07XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5jYW1lcmEudmlldy52aXNpYmlsaXR5ID0gTGF5ZXJzLkJpdE1hc2suVUlfMkQgfCAoaSArIDEpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl9jYW52YXNNYXRlcmlhbHMuaGFzKGVsZW1lbnQuY2FtZXJhLnZpZXcudmlzaWJpbGl0eSkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jYW52YXNNYXRlcmlhbHMuc2V0KGVsZW1lbnQuY2FtZXJhLnZpZXcudmlzaWJpbGl0eSwgbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCB0aGUgQ2FudmFzIGJ5IG51bWJlci5cclxuICAgICAqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmAmui/h+Wxj+W5lee8luWPt+iOt+W+l+Wxj+W5lee7hOS7tuOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB2aXNpYmlsaXR5IC0g5bGP5bmV57yW5Y+344CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRTY3JlZW4gKHZpc2liaWxpdHk6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHNjcmVlbnMgPSB0aGlzLl9zY3JlZW5zO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NyZWVucy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW4gPSBzY3JlZW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAoc2NyZWVuLmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNjcmVlbi5jYW1lcmEudmlldy52aXNpYmlsaXR5ID09PSB2aXNpYmlsaXR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNjcmVlbjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIFJlbW92ZXMgdGhlIENhbnZhcyBmcm9tIHRoZSBsaXN0LlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wIC0g6KKr56e76Zmk55qE5bGP5bmV44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVTY3JlZW4gKGNvbXA6IENhbnZhcykge1xyXG4gICAgICAgIGNvbnN0IGlkeCA9IHRoaXMuX3NjcmVlbnMuaW5kZXhPZihjb21wKTtcclxuICAgICAgICBpZiAoaWR4ID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9zY3JlZW5zLnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIGlmIChjb21wLmNhbWVyYSkge1xyXG4gICAgICAgICAgICBjb25zdCBtYXRSZWNvcmQgPSB0aGlzLl9jYW52YXNNYXRlcmlhbHMuZ2V0KGNvbXAuY2FtZXJhLnZpZXcudmlzaWJpbGl0eSk7XHJcbiAgICAgICAgICAgIGNvbnN0IG1hdEhhc2hJbnRlciA9IG1hdFJlY29yZCEua2V5cygpO1xyXG4gICAgICAgICAgICBsZXQgbWF0SGFzaCA9IG1hdEhhc2hJbnRlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIHdoaWxlICghbWF0SGFzaC5kb25lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVVSU1hdGVyaWFsKG1hdEhhc2gudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgbWF0SGFzaCA9IG1hdEhhc2hJbnRlci5uZXh0KCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG1hdFJlY29yZCEuY2xlYXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjYW1lcmE6IENhbWVyYSB8IG51bGw7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGlkeDsgaSA8IHRoaXMuX3NjcmVlbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY2FtZXJhID0gdGhpcy5fc2NyZWVuc1tpXS5jYW1lcmE7XHJcbiAgICAgICAgICAgIGlmIChjYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG1hdFJlY29yZCA9IHRoaXMuX2NhbnZhc01hdGVyaWFscy5nZXQoY2FtZXJhLnZpZXcudmlzaWJpbGl0eSkhO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLnZpZXcudmlzaWJpbGl0eSA9IExheWVycy5CaXRNYXNrLlVJXzJEIHwgKGkgKyAxKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IG5ld01hdFJlY29yZCA9IHRoaXMuX2NhbnZhc01hdGVyaWFscy5nZXQoY2FtZXJhLnZpZXcudmlzaWJpbGl0eSkhO1xyXG4gICAgICAgICAgICAgICAgbWF0UmVjb3JkLmZvckVhY2goKHZhbHVlOiBudW1iZXIsIGtleTogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3TWF0UmVjb3JkLnNldChrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIG1hdFJlY29yZC5jbGVhcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGUgKGR0OiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9yZW5kZXJTY3JlZW5zKCk7XHJcblxyXG4gICAgICAgIC8vIHVwZGF0ZSBidWZmZXJzXHJcbiAgICAgICAgaWYgKHRoaXMuX2JhdGNoZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBidWZmZXJzID0gdGhpcy5fbWVzaEJ1ZmZlcnM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmZmVycy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyQmF0Y2ggPSBidWZmZXJzW2ldO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyQmF0Y2gudXBsb2FkRGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgYnVmZmVyQmF0Y2gucmVzZXQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICB0aGlzLl9yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzb3J0U2NyZWVucyAoKSB7XHJcbiAgICAgICAgdGhpcy5fc2NyZWVucy5zb3J0KHRoaXMuX3NjcmVlblNvcnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIgKCkge1xyXG5cclxuICAgICAgICBsZXQgYmF0Y2hQcmlvcml0eSA9IDA7XHJcblxyXG4gICAgICAgIGZvciAobGV0IG0gPSAwOyBtIDwgdGhpcy5fbW9kZWxJblVzZS5sZW5ndGg7IG0rKykge1xyXG4gICAgICAgICAgICB0aGlzLl9zY2VuZS5yZW1vdmVNb2RlbCh0aGlzLl9tb2RlbEluVXNlLmdldChtKSk7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpTW9kZWxQb29sIS5mcmVlKHRoaXMuX21vZGVsSW5Vc2UuZ2V0KG0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fbW9kZWxJblVzZS5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fYmF0Y2hlcy5sZW5ndGgpIHtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fYmF0Y2hlcy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgYmF0Y2ggPSB0aGlzLl9iYXRjaGVzLmFycmF5W2ldO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChiYXRjaC5tb2RlbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChiYXRjaC5jYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlzRmxhZ3MgPSBiYXRjaC5jYW1lcmEudmlldy52aXNpYmlsaXR5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaC5tb2RlbC52aXNGbGFncyA9IHZpc0ZsYWdzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBiYXRjaC5tb2RlbC5ub2RlLmxheWVyID0gdmlzRmxhZ3M7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IGJhdGNoLm1vZGVsLnN1Yk1vZGVscztcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHN1Yk1vZGVscy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJNb2RlbHNbal0ucHJpb3JpdHkgPSBiYXRjaFByaW9yaXR5Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdG9yU2V0ID0gRFNQb29sLmdldChiYXRjaC5oRGVzY3JpcHRvclNldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJpbmRpbmcgPSBNb2RlbExvY2FsQmluZGluZ3MuU0FNUExFUl9TUFJJVEU7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kVGV4dHVyZShiaW5kaW5nLCBiYXRjaC50ZXh0dXJlISk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC5iaW5kU2FtcGxlcihiaW5kaW5nLCBiYXRjaC5zYW1wbGVyISk7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvclNldC51cGRhdGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdWlNb2RlbCA9IHRoaXMuX3VpTW9kZWxQb29sIS5hbGxvYygpO1xyXG4gICAgICAgICAgICAgICAgICAgIHVpTW9kZWwuZGlyZWN0SW5pdGlhbGl6ZShiYXRjaCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2NlbmUuYWRkTW9kZWwodWlNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdWlNb2RlbC5zdWJNb2RlbHNbMF0ucHJpb3JpdHkgPSBiYXRjaFByaW9yaXR5Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGJhdGNoLmNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWV3VmlzaWJpbGl0eSA9IGJhdGNoLmNhbWVyYS52aWV3LnZpc2liaWxpdHk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpTW9kZWwudmlzRmxhZ3MgPSB2aWV3VmlzaWJpbGl0eTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2NhbnZhc01hdGVyaWFscy5nZXQodmlld1Zpc2liaWxpdHkpIS5nZXQoYmF0Y2gubWF0ZXJpYWwhLmhhc2gpID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NhbnZhc01hdGVyaWFscy5nZXQodmlld1Zpc2liaWxpdHkpIS5zZXQoYmF0Y2gubWF0ZXJpYWwhLmhhc2gsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21vZGVsSW5Vc2UucHVzaCh1aU1vZGVsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmVuZGVyIGNvbXBvbmVudCBkYXRhIHN1Ym1pc3Npb24gcHJvY2VzcyBvZiBVSS5cclxuICAgICAqIFRoZSBzdWJtaXR0ZWQgdmVydGV4IGRhdGEgaXMgdGhlIFVJIGZvciB3b3JsZCBjb29yZGluYXRlcy5cclxuICAgICAqIEZvciBleGFtcGxlOiBUaGUgVUkgY29tcG9uZW50cyBleGNlcHQgR3JhcGhpY3MgYW5kIFVJTW9kZWwuXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBVSSDmuLLmn5Pnu4Tku7bmlbDmja7mj5DkuqTmtYHnqIvvvIjpkojlr7nmj5DkuqTnmoTpobbngrnmlbDmja7mmK/kuJbnlYzlnZDmoIfnmoTmj5DkuqTmtYHnqIvvvIzkvovlpoLvvJrpmaQgR3JhcGhpY3Mg5ZKMIFVJTW9kZWwg55qE5aSn6YOo5YiGIHVpIOe7hOS7tu+8ieOAglxyXG4gICAgICog5q2k5aSE55qE5pWw5o2u5pyA57uI5Lya55Sf5oiQ6ZyA6KaB5o+Q5Lqk5riy5p+T55qEIG1vZGVsIOaVsOaNruOAglxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjb21wIC0g5b2T5YmN5omn6KGM57uE5Lu244CCXHJcbiAgICAgKiBAcGFyYW0gZnJhbWUgLSDlvZPliY3miafooYznu4Tku7botLTlm77jgIJcclxuICAgICAqIEBwYXJhbSBhc3NlbWJsZXIgLSDlvZPliY3nu4Tku7bmuLLmn5PmlbDmja7nu4Too4XlmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbW1pdENvbXAgKGNvbXA6IFVJUmVuZGVyYWJsZSwgZnJhbWU6IEdGWFRleHR1cmUgfCBudWxsID0gbnVsbCwgYXNzZW1ibGVyOiBhbnksIHNhbXBsZXI6IEdGWFNhbXBsZXIgfCBudWxsID0gbnVsbCkge1xyXG4gICAgICAgIGNvbnN0IHJlbmRlckNvbXAgPSBjb21wO1xyXG4gICAgICAgIGNvbnN0IHRleHR1cmUgPSBmcmFtZTtcclxuICAgICAgICBjb25zdCBzYW1wID0gc2FtcGxlcjtcclxuXHJcbiAgICAgICAgbGV0IG1hdCA9IHJlbmRlckNvbXAuZ2V0UmVuZGVyTWF0ZXJpYWwoMCk7XHJcbiAgICAgICAgaWYgKCFtYXQpIHtcclxuICAgICAgICAgICAgbWF0ID0gcmVuZGVyQ29tcC5fdXBkYXRlQnVpbHRpbk1hdGVyaWFsKCk7XHJcbiAgICAgICAgICAgIG1hdCA9IHJlbmRlckNvbXAuX3VwZGF0ZUJsZW5kRnVuYygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJNYXRlcmlhbCAhPT0gbWF0IHx8XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJUZXh0dXJlICE9PSB0ZXh0dXJlIHx8IHRoaXMuX2N1cnJTYW1wbGVyICE9PSBzYW1wXHJcbiAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0b01lcmdlQmF0Y2hlcyh0aGlzLl9jdXJyQ29tcG9uZW50ISk7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJDb21wb25lbnQgPSByZW5kZXJDb21wO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyTWF0ZXJpYWwgPSBtYXQhO1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyVGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJTYW1wbGVyID0gc2FtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChhc3NlbWJsZXIpIHtcclxuICAgICAgICAgICAgYXNzZW1ibGVyLmZpbGxCdWZmZXJzKHJlbmRlckNvbXAsIHRoaXMpO1xyXG4gICAgICAgICAgICB0aGlzLl9hcHBseU9wYWNpdHkocmVuZGVyQ29tcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZW5kZXIgY29tcG9uZW50IGRhdGEgc3VibWlzc2lvbiBwcm9jZXNzIG9mIFVJLlxyXG4gICAgICogVGhlIHN1Ym1pdHRlZCB2ZXJ0ZXggZGF0YSBpcyB0aGUgVUkgZm9yIGxvY2FsIGNvb3JkaW5hdGVzLlxyXG4gICAgICogRm9yIGV4YW1wbGU6IFRoZSBVSSBjb21wb25lbnRzIG9mIEdyYXBoaWNzIGFuZCBVSU1vZGVsLlxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICogVUkg5riy5p+T57uE5Lu25pWw5o2u5o+Q5Lqk5rWB56iL77yI6ZKI5a+55L6L5aaC77yaIEdyYXBoaWNzIOWSjCBVSU1vZGVsIOetieaVsOaNrumHj+i+g+S4uuW6nuWkp+eahCB1aSDnu4Tku7bvvInjgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY29tcCAtIOW9k+WJjeaJp+ihjOe7hOS7tuOAglxyXG4gICAgICogQHBhcmFtIG1vZGVsIC0g5o+Q5Lqk5riy5p+T55qEIG1vZGVsIOaVsOaNruOAglxyXG4gICAgICogQHBhcmFtIG1hdCAtIOaPkOS6pOa4suafk+eahOadkOi0qOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29tbWl0TW9kZWwgKGNvbXA6IFVJQ29tcG9uZW50IHwgVUlSZW5kZXJhYmxlLCBtb2RlbDogTW9kZWwgfCBudWxsLCBtYXQ6IE1hdGVyaWFsIHwgbnVsbCkge1xyXG4gICAgICAgIC8vIGlmIHRoZSBsYXN0IGNvbXAgaXMgc3ByaXRlQ29tcCwgcHJldmlvdXMgY29tcHMgc2hvdWxkIGJlIGJhdGNoZWQuXHJcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJNYXRlcmlhbCAhPT0gdGhpcy5fZW1wdHlNYXRlcmlhbCkge1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9NZXJnZUJhdGNoZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChtYXQpIHtcclxuICAgICAgICAgICAgbGV0IHJlYnVpbGQgPSBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKFN0ZW5jaWxNYW5hZ2VyLnNoYXJlZE1hbmFnZXIhLmhhbmRsZU1hdGVyaWFsKG1hdCkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXRlID0gU3RlbmNpbE1hbmFnZXIuc2hhcmVkTWFuYWdlciEucGF0dGVybjtcclxuICAgICAgICAgICAgICAgIG1hdC5vdmVycmlkZVBpcGVsaW5lU3RhdGVzKHtcclxuICAgICAgICAgICAgICAgICAgICBkZXB0aFN0ZW5jaWxTdGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsVGVzdEZyb250OiBzdGF0ZS5zdGVuY2lsVGVzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZ1bmNGcm9udDogc3RhdGUuZnVuYyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFJlYWRNYXNrRnJvbnQ6IHN0YXRlLnN0ZW5jaWxNYXNrLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsV3JpdGVNYXNrRnJvbnQ6IHN0YXRlLndyaXRlTWFzayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZhaWxPcEZyb250OiBzdGF0ZS5mYWlsT3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxaRmFpbE9wRnJvbnQ6IHN0YXRlLnpGYWlsT3AsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxQYXNzT3BGcm9udDogc3RhdGUucGFzc09wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVmRnJvbnQ6IHN0YXRlLnJlZixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFRlc3RCYWNrOiBzdGF0ZS5zdGVuY2lsVGVzdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZ1bmNCYWNrOiBzdGF0ZS5mdW5jLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVhZE1hc2tCYWNrOiBzdGF0ZS5zdGVuY2lsTWFzayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFdyaXRlTWFza0JhY2s6IHN0YXRlLndyaXRlTWFzayxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZhaWxPcEJhY2s6IHN0YXRlLmZhaWxPcCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFpGYWlsT3BCYWNrOiBzdGF0ZS56RmFpbE9wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUGFzc09wQmFjazogc3RhdGUucGFzc09wLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVmQmFjazogc3RhdGUucmVmLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmVidWlsZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlYnVpbGQgJiYgbW9kZWwpIHtcclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWwuc3ViTW9kZWxzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwuc2V0U3ViTW9kZWxNYXRlcmlhbChpLCBtYXQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB1aUNhbnZhcyA9IHRoaXMuX2N1cnJDYW52YXM7XHJcbiAgICAgICAgY29uc3QgY3VyRHJhd0JhdGNoID0gdGhpcy5fZHJhd0JhdGNoUG9vbC5hbGxvYygpO1xyXG4gICAgICAgIGN1ckRyYXdCYXRjaC5jYW1lcmEgPSB1aUNhbnZhcyAmJiB1aUNhbnZhcy5jYW1lcmE7XHJcbiAgICAgICAgY3VyRHJhd0JhdGNoLm1vZGVsID0gbW9kZWw7XHJcbiAgICAgICAgY3VyRHJhd0JhdGNoLmJ1ZmZlckJhdGNoID0gbnVsbDtcclxuICAgICAgICBjdXJEcmF3QmF0Y2gubWF0ZXJpYWwgPSBtYXQ7XHJcbiAgICAgICAgY3VyRHJhd0JhdGNoLnRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgIGN1ckRyYXdCYXRjaC5zYW1wbGVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gcmVzZXQgY3VycmVudCByZW5kZXIgc3RhdGUgdG8gbnVsbFxyXG4gICAgICAgIHRoaXMuX2N1cnJNYXRlcmlhbCA9IHRoaXMuX2VtcHR5TWF0ZXJpYWw7XHJcbiAgICAgICAgdGhpcy5fY3VyckNvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyclRleHR1cmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1cnJTYW1wbGVyID0gbnVsbDtcclxuXHJcbiAgICAgICAgdGhpcy5fYmF0Y2hlcy5wdXNoKGN1ckRyYXdCYXRjaCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFN1Ym1pdCBzZXBhcmF0ZSByZW5kZXIgZGF0YS5cclxuICAgICAqIFRoaXMgZGF0YSBkb2VzIG5vdCBwYXJ0aWNpcGF0ZSBpbiB0aGUgYmF0Y2guXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmj5DkuqTni6znq4vmuLLmn5PmlbDmja4uXHJcbiAgICAgKiBAcGFyYW0gY29tcCDpnZnmgIHnu4Tku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbW1pdFN0YXRpY0JhdGNoIChjb21wOiBVSVN0YXRpY0JhdGNoKSB7XHJcbiAgICAgICAgdGhpcy5fYmF0Y2hlcy5jb25jYXQoY29tcC5kcmF3QmF0Y2hMaXN0KTtcclxuICAgICAgICB0aGlzLmZpbmlzaE1lcmdlQmF0Y2hlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBFbmQgYSBzZWN0aW9uIG9mIHJlbmRlciBkYXRhIGFuZCBzdWJtaXQgYWNjb3JkaW5nIHRvIHRoZSBiYXRjaCBjb25kaXRpb24uXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja7lkIjmibnmnaHku7bvvIznu5PmnZ/kuIDmrrXmuLLmn5PmlbDmja7lubbmj5DkuqTjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGF1dG9NZXJnZUJhdGNoZXMgKHJlbmRlckNvbXA/OiBVSVJlbmRlcmFibGUpIHtcclxuICAgICAgICBjb25zdCBidWZmZXIgPSB0aGlzLl9jdXJyTWVzaEJ1ZmZlciE7XHJcbiAgICAgICAgY29uc3QgdWlDYW52YXMgPSB0aGlzLl9jdXJyQ2FudmFzO1xyXG4gICAgICAgIGNvbnN0IGhJQSA9IGJ1ZmZlci5yZWNvcmRCYXRjaCgpO1xyXG4gICAgICAgIGxldCBtYXQgPSB0aGlzLl9jdXJyTWF0ZXJpYWw7XHJcblxyXG4gICAgICAgIGlmICghaElBIHx8ICFtYXQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHJlbmRlckNvbXAgJiYgU3RlbmNpbE1hbmFnZXIuc2hhcmVkTWFuYWdlciEuaGFuZGxlTWF0ZXJpYWwobWF0KSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jdXJyTWF0ZXJpYWwgPSBtYXQgPSByZW5kZXJDb21wLmdldFVJTWF0ZXJpYWxJbnN0YW5jZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBzdGF0ZSA9IFN0ZW5jaWxNYW5hZ2VyLnNoYXJlZE1hbmFnZXIhLnBhdHRlcm47XHJcbiAgICAgICAgICAgIG1hdC5vdmVycmlkZVBpcGVsaW5lU3RhdGVzKHtcclxuICAgICAgICAgICAgICAgIGRlcHRoU3RlbmNpbFN0YXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFRlc3RGcm9udDogc3RhdGUuc3RlbmNpbFRlc3QsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZ1bmNGcm9udDogc3RhdGUuZnVuYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVhZE1hc2tGcm9udDogc3RhdGUuc3RlbmNpbE1hc2ssXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFdyaXRlTWFza0Zyb250OiBzdGF0ZS53cml0ZU1hc2ssXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbEZhaWxPcEZyb250OiBzdGF0ZS5mYWlsT3AsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFpGYWlsT3BGcm9udDogc3RhdGUuekZhaWxPcCxcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUGFzc09wRnJvbnQ6IHN0YXRlLnBhc3NPcCxcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVmRnJvbnQ6IHN0YXRlLnJlZixcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsVGVzdEJhY2s6IHN0YXRlLnN0ZW5jaWxUZXN0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxGdW5jQmFjazogc3RhdGUuZnVuYyxcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsUmVhZE1hc2tCYWNrOiBzdGF0ZS5zdGVuY2lsTWFzayxcclxuICAgICAgICAgICAgICAgICAgICBzdGVuY2lsV3JpdGVNYXNrQmFjazogc3RhdGUud3JpdGVNYXNrLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxGYWlsT3BCYWNrOiBzdGF0ZS5mYWlsT3AsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFpGYWlsT3BCYWNrOiBzdGF0ZS56RmFpbE9wLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0ZW5jaWxQYXNzT3BCYWNrOiBzdGF0ZS5wYXNzT3AsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RlbmNpbFJlZkJhY2s6IHN0YXRlLnJlZixcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgY3VyRHJhd0JhdGNoID0gdGhpcy5fY3VyclN0YXRpY1Jvb3QgPyB0aGlzLl9jdXJyU3RhdGljUm9vdC5fcmVxdWlyZURyYXdCYXRjaCgpIDogdGhpcy5fZHJhd0JhdGNoUG9vbC5hbGxvYygpO1xyXG4gICAgICAgIGN1ckRyYXdCYXRjaC5jYW1lcmEgPSB1aUNhbnZhcyAmJiB1aUNhbnZhcy5jYW1lcmE7XHJcbiAgICAgICAgY3VyRHJhd0JhdGNoLmJ1ZmZlckJhdGNoID0gYnVmZmVyO1xyXG4gICAgICAgIGN1ckRyYXdCYXRjaC5tYXRlcmlhbCA9IG1hdDtcclxuICAgICAgICBjdXJEcmF3QmF0Y2gudGV4dHVyZSA9IHRoaXMuX2N1cnJUZXh0dXJlITtcclxuICAgICAgICBjdXJEcmF3QmF0Y2guc2FtcGxlciA9IHRoaXMuX2N1cnJTYW1wbGVyO1xyXG4gICAgICAgIGN1ckRyYXdCYXRjaC5oSW5wdXRBc3NlbWJsZXIgPSBoSUE7XHJcblxyXG4gICAgICAgIHRoaXMuX2JhdGNoZXMucHVzaChjdXJEcmF3QmF0Y2gpO1xyXG5cclxuICAgICAgICBidWZmZXIudmVydGV4U3RhcnQgPSBidWZmZXIudmVydGV4T2Zmc2V0O1xyXG4gICAgICAgIGJ1ZmZlci5pbmRpY2VzU3RhcnQgPSBidWZmZXIuaW5kaWNlc09mZnNldDtcclxuICAgICAgICBidWZmZXIuYnl0ZVN0YXJ0ID0gYnVmZmVyLmJ5dGVPZmZzZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEZvcmNlIGNoYW5nZXMgdG8gY3VycmVudCBiYXRjaCBkYXRhIGFuZCBtZXJnZVxyXG4gICAgICpcclxuICAgICAqIEB6aFxyXG4gICAgICog5by66KGM5L+u5pS55b2T5YmN5om55qyh5pWw5o2u5bm25ZCI5bm244CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG1hdGVyaWFsIC0g5b2T5YmN5om55qyh55qE5p2Q6LSo44CCXHJcbiAgICAgKiBAcGFyYW0gc3ByaXRlIC0g5b2T5YmN5om55qyh55qE57K+54G15bin44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmb3JjZU1lcmdlQmF0Y2hlcyAobWF0ZXJpYWw6IE1hdGVyaWFsLCBzcHJpdGU6IEdGWFRleHR1cmUgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fY3Vyck1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbiAgICAgICAgdGhpcy5fY3VyclRleHR1cmUgPSBzcHJpdGU7XHJcbiAgICAgICAgdGhpcy5hdXRvTWVyZ2VCYXRjaGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEZvcmNlZCB0byBtZXJnZSB0aGUgZGF0YSBvZiB0aGUgcHJldmlvdXMgYmF0Y2ggdG8gc3RhcnQgYSBuZXcgYmF0Y2guXHJcbiAgICAgKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvLrliLblkIjlubbkuIrkuIDkuKrmibnmrKHnmoTmlbDmja7vvIzlvIDlkK/mlrDkuIDova7lkIjmibnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZpbmlzaE1lcmdlQmF0Y2hlcyAoKSB7XHJcbiAgICAgICAgdGhpcy5hdXRvTWVyZ2VCYXRjaGVzKCk7XHJcbiAgICAgICAgdGhpcy5fY3Vyck1hdGVyaWFsID0gdGhpcy5fZW1wdHlNYXRlcmlhbDtcclxuICAgICAgICB0aGlzLl9jdXJyVGV4dHVyZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyckNvbXBvbmVudCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGVzdHJveVVJTWF0ZXJpYWxzICgpIHtcclxuICAgICAgICBjb25zdCBtYXRJdGVyID0gdGhpcy5fdWlNYXRlcmlhbHMudmFsdWVzKCk7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IG1hdEl0ZXIubmV4dCgpO1xyXG4gICAgICAgIHdoaWxlICghcmVzdWx0LmRvbmUpIHtcclxuICAgICAgICAgICAgY29uc3QgdWlNYXQgPSByZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgIHVpTWF0LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgcmVzdWx0ID0gbWF0SXRlci5uZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3VpTWF0ZXJpYWxzLmNsZWFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfd2FsayAobm9kZTogTm9kZSwgbGV2ZWwgPSAwKSB7XHJcbiAgICAgICAgY29uc3QgbGVuID0gbm9kZS5jaGlsZHJlbi5sZW5ndGg7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmVudE9wYWNpdHkgPSB0aGlzLl9wYXJlbnRPcGFjaXR5O1xyXG4gICAgICAgIHRoaXMuX3BhcmVudE9wYWNpdHkgKj0gbm9kZS5fdWlQcm9wcy5vcGFjaXR5O1xyXG4gICAgICAgIHRoaXMuX3ByZXByb2Nlc3Mobm9kZSk7XHJcbiAgICAgICAgaWYgKGxlbiA+IDAgJiYgIW5vZGUuX3N0YXRpYykge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZHJlbiA9IG5vZGUuY2hpbGRyZW47XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRyZW5baV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLl93YWxrKGNoaWxkLCBsZXZlbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3Bvc3Rwcm9jZXNzKG5vZGUpO1xyXG4gICAgICAgIHRoaXMuX3BhcmVudE9wYWNpdHkgPSBwYXJlbnRPcGFjaXR5O1xyXG5cclxuICAgICAgICBsZXZlbCArPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlbmRlclNjcmVlbnMgKCkge1xyXG4gICAgICAgIGNvbnN0IHNjcmVlbnMgPSB0aGlzLl9zY3JlZW5zO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NyZWVucy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBjb25zdCBzY3JlZW4gPSBzY3JlZW5zW2ldO1xyXG4gICAgICAgICAgICBpZiAoIXNjcmVlbi5lbmFibGVkSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLl9jdXJyQ2FudmFzID0gc2NyZWVuO1xyXG4gICAgICAgICAgICB0aGlzLl9yZWN1cnNpdmVTY3JlZW5Ob2RlKHNjcmVlbi5ub2RlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcHJlcHJvY2VzcyAobm9kZTogTm9kZSkge1xyXG4gICAgICAgIGlmICghbm9kZS5fdWlQcm9wcy51aVRyYW5zZm9ybUNvbXApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcGFyZW50IGNoYW5nZWQgY2FuIGZsdXNoIGNoaWxkIHZpc2liaWxpdHlcclxuICAgICAgICBub2RlLl91aVByb3BzLnVpVHJhbnNmb3JtQ29tcC5fY2FudmFzID0gdGhpcy5fY3VyckNhbnZhcztcclxuICAgICAgICBjb25zdCByZW5kZXIgPSBub2RlLl91aVByb3BzLnVpQ29tcDtcclxuICAgICAgICBpZiAocmVuZGVyICYmIHJlbmRlci5lbmFibGVkSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgcmVuZGVyLnVwZGF0ZUFzc2VtYmxlcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcG9zdHByb2Nlc3MgKG5vZGU6IE5vZGUpIHtcclxuICAgICAgICBjb25zdCByZW5kZXIgPSBub2RlLl91aVByb3BzLnVpQ29tcDtcclxuICAgICAgICBpZiAocmVuZGVyICYmIHJlbmRlci5lbmFibGVkSW5IaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgcmVuZGVyLnBvc3RVcGRhdGVBc3NlbWJsZXIodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3JlY3Vyc2l2ZVNjcmVlbk5vZGUgKHNjcmVlbjogTm9kZSkge1xyXG4gICAgICAgIHRoaXMuX3dhbGsoc2NyZWVuKTtcclxuXHJcbiAgICAgICAgdGhpcy5hdXRvTWVyZ2VCYXRjaGVzKHRoaXMuX2N1cnJDb21wb25lbnQhKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXNldCAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9iYXRjaGVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJhdGNoID0gdGhpcy5fYmF0Y2hlcy5hcnJheVtpXTtcclxuICAgICAgICAgICAgaWYgKGJhdGNoLmlzU3RhdGljKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgYmF0Y2guY2xlYXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fZHJhd0JhdGNoUG9vbC5mcmVlKGJhdGNoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3BhcmVudE9wYWNpdHkgPSAxO1xyXG4gICAgICAgIHRoaXMuX2JhdGNoZXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9jdXJyTWF0ZXJpYWwgPSB0aGlzLl9lbXB0eU1hdGVyaWFsO1xyXG4gICAgICAgIHRoaXMuX2N1cnJDYW52YXMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuX2N1cnJUZXh0dXJlID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9jdXJyU2FtcGxlciA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fY3VyckNvbXBvbmVudCA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5fbWVzaEJ1ZmZlclVzZUNvdW50ID0gMDtcclxuICAgICAgICB0aGlzLl9yZXF1aXJlQnVmZmVyQmF0Y2goKTtcclxuICAgICAgICBTdGVuY2lsTWFuYWdlci5zaGFyZWRNYW5hZ2VyIS5yZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZU1lc2hCdWZmZXIgKCk6IE1lc2hCdWZmZXIge1xyXG4gICAgICAgIGNvbnN0IGJhdGNoID0gdGhpcy5fYnVmZmVyQmF0Y2hQb29sLmFkZCgpO1xyXG4gICAgICAgIGJhdGNoLmluaXRpYWxpemUodGhpcy5fYXR0cmlidXRlcywgdGhpcy5fcmVxdWlyZUJ1ZmZlckJhdGNoLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMuX21lc2hCdWZmZXJzLnB1c2goYmF0Y2gpO1xyXG4gICAgICAgIHJldHVybiBiYXRjaDtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9yZXF1aXJlQnVmZmVyQmF0Y2ggKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tZXNoQnVmZmVyVXNlQ291bnQgPj0gdGhpcy5fbWVzaEJ1ZmZlcnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJNZXNoQnVmZmVyID0gdGhpcy5fY3JlYXRlTWVzaEJ1ZmZlcigpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJNZXNoQnVmZmVyID0gdGhpcy5fbWVzaEJ1ZmZlcnNbdGhpcy5fbWVzaEJ1ZmZlclVzZUNvdW50XTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX21lc2hCdWZmZXJVc2VDb3VudCsrO1xyXG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2N1cnJNZXNoQnVmZmVyLnJlcXVlc3QoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zY3JlZW5Tb3J0IChhOiBDYW52YXMsIGI6IENhbnZhcykge1xyXG4gICAgICAgIGNvbnN0IGRlbHRhID0gYS5wcmlvcml0eSAtIGIucHJpb3JpdHk7XHJcbiAgICAgICAgcmV0dXJuIGRlbHRhID09PSAwID8gYS5ub2RlLmdldFNpYmxpbmdJbmRleCgpIC0gYi5ub2RlLmdldFNpYmxpbmdJbmRleCgpIDogZGVsdGE7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfYXBwbHlPcGFjaXR5IChjb21wOiBVSVJlbmRlcmFibGUpIHtcclxuICAgICAgICBjb25zdCBjb2xvciA9IGNvbXAuY29sb3IuYSAvIDI1NTtcclxuICAgICAgICBjb25zdCBvcGFjaXR5ID0gKHRoaXMuX3BhcmVudE9wYWNpdHkgPSB0aGlzLl9wYXJlbnRPcGFjaXR5ICogY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IGJ5dGVPZmZzZXQgPSB0aGlzLl9jdXJyTWVzaEJ1ZmZlciEuYnl0ZU9mZnNldCA+PiAyO1xyXG4gICAgICAgIGNvbnN0IHZidWYgPSB0aGlzLl9jdXJyTWVzaEJ1ZmZlciEudkRhdGEhO1xyXG4gICAgICAgIGNvbnN0IGxhc3RCeXRlT2Zmc2V0ID0gdGhpcy5fY3Vyck1lc2hCdWZmZXIhLmxhc3RCeXRlT2Zmc2V0ID4+IDI7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IGxhc3RCeXRlT2Zmc2V0OyBpIDwgYnl0ZU9mZnNldDsgaSArPSA5KSB7XHJcbiAgICAgICAgICAgIHZidWZbaSArIE1lc2hCdWZmZXIuT1BBQ0lUWV9PRkZTRVRdID0gb3BhY2l0eTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX2N1cnJNZXNoQnVmZmVyIS5sYXN0Qnl0ZU9mZnNldCA9IHRoaXMuX2N1cnJNZXNoQnVmZmVyIS5ieXRlT2Zmc2V0O1xyXG4gICAgfVxyXG59XHJcbiJdfQ==