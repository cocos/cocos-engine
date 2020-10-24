(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../geometry/index.js", "../../gfx/define.js", "../../math/index.js", "../../memop/index.js", "../../scene-graph/layers.js", "./model.js", "../../default-constants.js", "../../scene-graph/node-enum.js", "../../global-exports.js", "../core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../geometry/index.js"), require("../../gfx/define.js"), require("../../math/index.js"), require("../../memop/index.js"), require("../../scene-graph/layers.js"), require("./model.js"), require("../../default-constants.js"), require("../../scene-graph/node-enum.js"), require("../../global-exports.js"), require("../core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.define, global.index, global.index, global.layers, global.model, global.defaultConstants, global.nodeEnum, global.globalExports, global.memoryPools);
    global.renderScene = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _define, _index2, _index3, _layers, _model, _defaultConstants, _nodeEnum, _globalExports, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RenderScene = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var RenderScene = /*#__PURE__*/function () {
    _createClass(RenderScene, [{
      key: "root",
      get: function get() {
        return this._root;
      }
    }, {
      key: "name",
      get: function get() {
        return this._name;
      }
    }, {
      key: "cameras",
      get: function get() {
        return this._cameras;
      }
    }, {
      key: "mainLight",
      get: function get() {
        return this._mainLight;
      }
    }, {
      key: "sphereLights",
      get: function get() {
        return this._sphereLights;
      }
    }, {
      key: "spotLights",
      get: function get() {
        return this._spotLights;
      }
    }, {
      key: "models",
      get: function get() {
        return this._models;
      }
      /**
       * @zh
       * 获取 raycastAllCanvas 后的检测结果
       */

    }, {
      key: "rayResultCanvas",
      get: function get() {
        return resultCanvas;
      }
      /**
       * @zh
       * 获取 raycastAllModels 后的检测结果
       */

    }, {
      key: "rayResultModels",
      get: function get() {
        return resultModels;
      }
      /**
       * @zh
       * 获取 raycastAll 后的检测结果
       */

    }, {
      key: "rayResultAll",
      get: function get() {
        return resultAll;
      }
      /**
       * @zh
       * 获取 raycastSingleModel 后的检测结果
       */

    }, {
      key: "rayResultSingleModel",
      get: function get() {
        return resultSingleModel;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._scenePoolHandle;
      }
    }], [{
      key: "registerCreateFunc",
      value: function registerCreateFunc(root) {
        root._createSceneFun = function (_root) {
          return new RenderScene(_root);
        };
      }
    }]);

    function RenderScene(root) {
      _classCallCheck(this, RenderScene);

      this._root = void 0;
      this._name = '';
      this._cameras = [];
      this._models = [];
      this._directionalLights = [];
      this._sphereLights = [];
      this._spotLights = [];
      this._mainLight = null;
      this._modelId = 0;
      this._scenePoolHandle = _memoryPools.NULL_HANDLE;
      this._modelArrayHandle = _memoryPools.NULL_HANDLE;
      this._root = root;

      this._createHandles();
    }

    _createClass(RenderScene, [{
      key: "initialize",
      value: function initialize(info) {
        this._name = info.name;

        this._createHandles();

        return true;
      }
    }, {
      key: "update",
      value: function update(stamp) {
        var mainLight = this._mainLight;

        if (mainLight) {
          mainLight.update();
        }

        var sphereLights = this._sphereLights;

        for (var i = 0; i < sphereLights.length; i++) {
          var light = sphereLights[i];
          light.update();
        }

        var spotLights = this._spotLights;

        for (var _i = 0; _i < spotLights.length; _i++) {
          var _light = spotLights[_i];

          _light.update();
        }

        var models = this._models;

        for (var _i2 = 0; _i2 < models.length; _i2++) {
          var model = models[_i2];

          if (model.enabled) {
            model.updateTransform(stamp);
            model.updateUBOs(stamp);
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.removeCameras();
        this.removeSphereLights();
        this.removeSpotLights();
        this.removeModels();

        if (this._modelArrayHandle) {
          _memoryPools.ModelArrayPool.free(this._modelArrayHandle);

          _memoryPools.ScenePool.free(this._scenePoolHandle);

          this._modelArrayHandle = _memoryPools.NULL_HANDLE;
          this._scenePoolHandle = _memoryPools.NULL_HANDLE;
        }
      }
    }, {
      key: "addCamera",
      value: function addCamera(cam) {
        cam.attachToScene(this);

        this._cameras.push(cam);
      }
    }, {
      key: "removeCamera",
      value: function removeCamera(camera) {
        for (var i = 0; i < this._cameras.length; ++i) {
          if (this._cameras[i] === camera) {
            this._cameras.splice(i, 1);

            camera.detachFromScene();
            return;
          }
        }
      }
    }, {
      key: "removeCameras",
      value: function removeCameras() {
        var _iterator = _createForOfIteratorHelper(this._cameras),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var camera = _step.value;
            camera.detachFromScene();
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._cameras.splice(0);
      }
    }, {
      key: "setMainLight",
      value: function setMainLight(dl) {
        this._mainLight = dl;

        _memoryPools.ScenePool.set(this._scenePoolHandle, _memoryPools.SceneView.MAIN_LIGHT, dl.handle);
      }
    }, {
      key: "unsetMainLight",
      value: function unsetMainLight(dl) {
        if (this._mainLight === dl) {
          var dlList = this._directionalLights;

          if (dlList.length) {
            this._mainLight = dlList[dlList.length - 1];

            if (this._mainLight.node) {
              // trigger update
              this._mainLight.node.hasChangedFlags |= _nodeEnum.TransformBit.ROTATION;
            }
          } else {
            this._mainLight = null;
          }
        }
      }
    }, {
      key: "addDirectionalLight",
      value: function addDirectionalLight(dl) {
        dl.attachToScene(this);

        this._directionalLights.push(dl);
      }
    }, {
      key: "removeDirectionalLight",
      value: function removeDirectionalLight(dl) {
        for (var i = 0; i < this._directionalLights.length; ++i) {
          if (this._directionalLights[i] === dl) {
            dl.detachFromScene();

            this._directionalLights.splice(i, 1);

            return;
          }
        }
      }
    }, {
      key: "addSphereLight",
      value: function addSphereLight(pl) {
        pl.attachToScene(this);

        this._sphereLights.push(pl);
      }
    }, {
      key: "removeSphereLight",
      value: function removeSphereLight(pl) {
        for (var i = 0; i < this._sphereLights.length; ++i) {
          if (this._sphereLights[i] === pl) {
            pl.detachFromScene();

            this._sphereLights.splice(i, 1);

            return;
          }
        }
      }
    }, {
      key: "addSpotLight",
      value: function addSpotLight(sl) {
        sl.attachToScene(this);

        this._spotLights.push(sl);
      }
    }, {
      key: "removeSpotLight",
      value: function removeSpotLight(sl) {
        for (var i = 0; i < this._spotLights.length; ++i) {
          if (this._spotLights[i] === sl) {
            sl.detachFromScene();

            this._spotLights.splice(i, 1);

            return;
          }
        }
      }
    }, {
      key: "removeSphereLights",
      value: function removeSphereLights() {
        for (var i = 0; i < this._sphereLights.length; ++i) {
          this._sphereLights[i].detachFromScene();
        }

        this._sphereLights.length = 0;
      }
    }, {
      key: "removeSpotLights",
      value: function removeSpotLights() {
        for (var i = 0; i < this._spotLights.length; ++i) {
          this._spotLights[i].detachFromScene();
        }

        this._spotLights = [];
      }
    }, {
      key: "addModel",
      value: function addModel(m) {
        m.attachToScene(this);

        this._models.push(m);

        _memoryPools.ModelArrayPool.push(this._modelArrayHandle, m.handle);
      }
    }, {
      key: "removeModel",
      value: function removeModel(model) {
        for (var i = 0; i < this._models.length; ++i) {
          if (this._models[i] === model) {
            model.detachFromScene();

            this._models.splice(i, 1);

            _memoryPools.ModelArrayPool.erase(this._modelArrayHandle, i);

            return;
          }
        }
      }
    }, {
      key: "removeModels",
      value: function removeModels() {
        var _iterator2 = _createForOfIteratorHelper(this._models),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var m = _step2.value;
            m.detachFromScene();
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        this._models.length = 0;

        _memoryPools.ModelArrayPool.clear(this._modelArrayHandle);
      }
    }, {
      key: "onGlobalPipelineStateChanged",
      value: function onGlobalPipelineStateChanged() {
        var _iterator3 = _createForOfIteratorHelper(this._models),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var m = _step3.value;
            m.onGlobalPipelineStateChanged();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    }, {
      key: "generateModelId",
      value: function generateModelId() {
        return this._modelId++;
      }
      /**
       * @en
       * Cast a ray into the scene, record all the intersected models and ui2d nodes in the result array
       * @param worldRay the testing ray
       * @param mask the layer mask to filter the models
       * @param distance the max distance , Infinity by default
       * @returns boolean , ray is hit or not
       * @note getter of this.rayResultAll can get recently result
       * @zh
       * 传入一条射线检测场景中所有的 3D 模型和 UI2D Node
       * @param worldRay 世界射线
       * @param mask mask 用于标记所有要检测的层，默认为 Default | UI2D
       * @param distance 射线检测的最大距离, 默认为 Infinity
       * @returns boolean , 射线是否有击中
       * @note 通过 this.rayResultAll 可以获取到最近的结果
       */

    }, {
      key: "raycastAll",
      value: function raycastAll(worldRay) {
        var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _layers.Layers.Enum.DEFAULT | _layers.Layers.Enum.UI_2D;
        var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
        var r_3d = this.raycastAllModels(worldRay, mask, distance);
        var r_ui2d = this.raycastAllCanvas(worldRay, mask, distance);
        var isHit = r_3d || r_ui2d;
        resultAll.length = 0;

        if (isHit) {
          Array.prototype.push.apply(resultAll, resultModels);
          Array.prototype.push.apply(resultAll, resultCanvas);
        }

        return isHit;
      }
      /**
       * @en
       * Cast a ray into the scene, record all the intersected models in the result array
       * @param worldRay the testing ray
       * @param mask the layer mask to filter the models
       * @param distance the max distance , Infinity by default
       * @returns boolean , ray is hit or not
       * @note getter of this.rayResultModels can get recently result
       * @zh
       * 传入一条射线检测场景中所有的 3D 模型。
       * @param worldRay 世界射线
       * @param mask 用于标记所有要检测的层，默认为 Default
       * @param distance 射线检测的最大距离, 默认为 Infinity
       * @returns boolean , 射线是否有击中
       * @note 通过 this.rayResultModels 可以获取到最近的结果
       */

    }, {
      key: "raycastAllModels",
      value: function raycastAllModels(worldRay) {
        var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _layers.Layers.Enum.DEFAULT;
        var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
        pool.reset();

        var _iterator4 = _createForOfIteratorHelper(this._models),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var m = _step4.value;
            var transform = m.transform;

            if (!transform || !m.enabled || !(m.node.layer & (mask & ~_layers.Layers.Enum.IGNORE_RAYCAST)) || !m.worldBounds) {
              continue;
            } // broadphase


            var d = _index.intersect.ray_aabb(worldRay, m.worldBounds);

            if (d <= 0 || d >= distance) {
              continue;
            }

            if (m.type === _model.ModelType.DEFAULT) {
              // transform ray back to model space
              _index2.Mat4.invert(m4, transform.getWorldMatrix(m4));

              _index2.Vec3.transformMat4(modelRay.o, worldRay.o, m4);

              _index2.Vec3.normalize(modelRay.d, _index2.Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));

              d = Infinity;
              var subModels = m.subModels;

              for (var i = 0; i < subModels.length; ++i) {
                var subMesh = subModels[i].subMesh;

                if (subMesh && subMesh.geometricInfo) {
                  var _subMesh$geometricInf = subMesh.geometricInfo,
                      vb = _subMesh$geometricInf.positions,
                      ib = _subMesh$geometricInf.indices,
                      sides = _subMesh$geometricInf.doubleSided;
                  narrowphase(vb, ib, subMesh.primitiveMode, sides, distance);
                  d = Math.min(d, narrowDis * _index2.Vec3.multiply(v3, modelRay.d, transform.worldScale).length());
                }
              }
            }

            if (d < distance) {
              var r = pool.add();
              r.node = m.node;
              r.distance = d;
              resultModels[pool.length - 1] = r;
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        resultModels.length = pool.length;
        return resultModels.length > 0;
      }
      /**
       * @en
       * Before you raycast the model, make sure the model is not null
       * @param worldRay the testing ray
       * @param model the testing model
       * @param mask the layer mask to filter the models
       * @param distance the max distance , Infinity by default
       * @returns boolean , ray is hit or not
       * @zh
       * 传入一条射线和一个 3D 模型进行射线检测。
       * @param worldRay 世界射线
       * @param model 进行检测的模型
       * @param mask 用于标记所有要检测的层，默认为 Default
       * @param distance 射线检测的最大距离, 默认为 Infinity
       * @returns boolean , 射线是否有击中
       */

    }, {
      key: "raycastSingleModel",
      value: function raycastSingleModel(worldRay, model) {
        var mask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _layers.Layers.Enum.DEFAULT;
        var distance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;

        if (_defaultConstants.PREVIEW) {
          if (model == null) {
            console.error(' 检测前请保证 model 不为 null ');
          }
        }

        pool.reset();
        var m = model;
        var transform = m.transform;

        if (!transform || !m.enabled || !(m.node.layer & (mask & ~_layers.Layers.Enum.IGNORE_RAYCAST)) || !m.worldBounds) {
          return false;
        } // broadphase


        var d = _index.intersect.ray_aabb(worldRay, m.worldBounds);

        if (d <= 0 || d >= distance) {
          return false;
        }

        if (m.type === _model.ModelType.DEFAULT) {
          // transform ray back to model space
          _index2.Mat4.invert(m4, transform.getWorldMatrix(m4));

          _index2.Vec3.transformMat4(modelRay.o, worldRay.o, m4);

          _index2.Vec3.normalize(modelRay.d, _index2.Vec3.transformMat4Normal(modelRay.d, worldRay.d, m4));

          d = Infinity;
          var subModels = m.subModels;

          for (var i = 0; i < subModels.length; ++i) {
            var subMesh = subModels[i].subMesh;

            if (subMesh && subMesh.geometricInfo) {
              var _subMesh$geometricInf2 = subMesh.geometricInfo,
                  vb = _subMesh$geometricInf2.positions,
                  ib = _subMesh$geometricInf2.indices,
                  sides = _subMesh$geometricInf2.doubleSided;
              narrowphase(vb, ib, subMesh.primitiveMode, sides, distance);
              d = Math.min(d, narrowDis * _index2.Vec3.multiply(v3, modelRay.d, transform.worldScale).length());
            }
          }
        }

        if (d < distance) {
          var r = pool.add();
          r.node = m.node;
          r.distance = d;
          resultSingleModel[pool.length - 1] = r;
        }

        resultSingleModel.length = pool.length;
        return resultSingleModel.length > 0;
      }
      /**
       * @en
       * Cast a ray into the scene, detect all canvas and its children
       * @param worldRay the testing ray
       * @param mask the layer mask to filter all ui2d aabb
       * @param distance the max distance , Infinity by default
       * @returns boolean , ray is hit or not
       * @note getter of this.rayResultCanvas can get recently result
       * @zh
       * 传入一条射线检测场景中所有的 Canvas 以及 Canvas 下的 Node
       * @param worldRay 世界射线
       * @param mask 用于标记所有要检测的层，默认为 UI_2D
       * @param distance 射线检测的最大距离, 默认为 Infinity
       * @returns boolean , 射线是否有击中
       * @note 通过 this.rayResultCanvas 可以获取到最近的结果
       */

    }, {
      key: "raycastAllCanvas",
      value: function raycastAllCanvas(worldRay) {
        var mask = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _layers.Layers.Enum.UI_2D;
        var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Infinity;
        poolUI.reset();

        var canvasComs = _globalExports.legacyCC.director.getScene().getComponentsInChildren(_globalExports.legacyCC.Canvas);

        if (canvasComs != null && canvasComs.length > 0) {
          for (var i = 0; i < canvasComs.length; i++) {
            var canvasNode = canvasComs[i].node;

            if (canvasNode != null && canvasNode.active) {
              this._raycastUI2DNodeRecursiveChildren(worldRay, canvasNode, mask, distance);
            }
          }
        }

        resultCanvas.length = poolUI.length;
        return resultCanvas.length > 0;
      }
    }, {
      key: "_raycastUI2DNode",
      value: function _raycastUI2DNode(worldRay, ui2dNode) {
        var mask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _layers.Layers.Enum.UI_2D;
        var distance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;

        if (_defaultConstants.PREVIEW) {
          if (ui2dNode == null) {
            console.error('make sure UINode is not null');
          }
        }

        var uiTransform = ui2dNode._uiProps.uiTransformComp;

        if (uiTransform == null || ui2dNode.layer & _layers.Layers.Enum.IGNORE_RAYCAST || !(ui2dNode.layer & mask)) {
          return;
        }

        uiTransform.getComputeAABB(aabbUI);

        var d = _index.intersect.ray_aabb(worldRay, aabbUI);

        if (d <= 0) {
          return;
        } else if (d < distance) {
          var r = poolUI.add();
          r.node = ui2dNode;
          r.distance = d;
          return r;
        }
      }
    }, {
      key: "_raycastUI2DNodeRecursiveChildren",
      value: function _raycastUI2DNodeRecursiveChildren(worldRay, parent) {
        var mask = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _layers.Layers.Enum.UI_2D;
        var distance = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;

        var result = this._raycastUI2DNode(worldRay, parent, mask, distance);

        if (result != null) {
          resultCanvas[poolUI.length - 1] = result;
        }

        var _iterator5 = _createForOfIteratorHelper(parent.children),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var node = _step5.value;

            if (node != null && node.active) {
              this._raycastUI2DNodeRecursiveChildren(worldRay, node, mask, distance);
            }
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    }, {
      key: "_createHandles",
      value: function _createHandles() {
        if (!this._modelArrayHandle) {
          this._modelArrayHandle = _memoryPools.ModelArrayPool.alloc();
          this._scenePoolHandle = _memoryPools.ScenePool.alloc();

          _memoryPools.ScenePool.set(this._scenePoolHandle, _memoryPools.SceneView.MODEL_ARRAY, this._modelArrayHandle);
        }
      }
    }]);

    return RenderScene;
  }();

  _exports.RenderScene = RenderScene;

  var modelRay = _index.ray.create();

  var v3 = new _index2.Vec3();
  var m4 = new _index2.Mat4();
  var narrowDis = Infinity;

  var tri = _index.triangle.create();

  var pool = new _index3.RecyclePool(function () {
    return {
      node: null,
      distance: Infinity
    };
  }, 8);
  var resultModels = [];
  /** Canvas raycast result pool */

  var aabbUI = new _index.aabb();
  var poolUI = new _index3.RecyclePool(function () {
    return {
      node: null,
      distance: Infinity
    };
  }, 8);
  var resultCanvas = [];
  /** raycast all */

  var resultAll = [];
  /** raycast single model */

  var resultSingleModel = [];

  var narrowphase = function narrowphase(vb, ib, pm, sides) {
    var distance = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : Infinity;
    narrowDis = distance;

    if (pm === _define.GFXPrimitiveMode.TRIANGLE_LIST) {
      var cnt = ib.length;

      for (var j = 0; j < cnt; j += 3) {
        var i0 = ib[j] * 3;
        var i1 = ib[j + 1] * 3;
        var i2 = ib[j + 2] * 3;

        _index2.Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);

        _index2.Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);

        _index2.Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);

        var dist = _index.intersect.ray_triangle(modelRay, tri, sides);

        if (dist <= 0 || dist >= narrowDis) {
          continue;
        }

        narrowDis = dist;
      }
    } else if (pm === _define.GFXPrimitiveMode.TRIANGLE_STRIP) {
      var _cnt = ib.length - 2;

      var rev = 0;

      for (var _j = 0; _j < _cnt; _j += 1) {
        var _i3 = ib[_j - rev] * 3;

        var _i4 = ib[_j + rev + 1] * 3;

        var _i5 = ib[_j + 2] * 3;

        _index2.Vec3.set(tri.a, vb[_i3], vb[_i3 + 1], vb[_i3 + 2]);

        _index2.Vec3.set(tri.b, vb[_i4], vb[_i4 + 1], vb[_i4 + 2]);

        _index2.Vec3.set(tri.c, vb[_i5], vb[_i5 + 1], vb[_i5 + 2]);

        rev = ~rev;

        var _dist = _index.intersect.ray_triangle(modelRay, tri, sides);

        if (_dist <= 0 || _dist >= narrowDis) {
          continue;
        }

        narrowDis = _dist;
      }
    } else if (pm === _define.GFXPrimitiveMode.TRIANGLE_FAN) {
      var _cnt2 = ib.length - 1;

      var _i6 = ib[0] * 3;

      _index2.Vec3.set(tri.a, vb[_i6], vb[_i6 + 1], vb[_i6 + 2]);

      for (var _j2 = 1; _j2 < _cnt2; _j2 += 1) {
        var _i7 = ib[_j2] * 3;

        var _i8 = ib[_j2 + 1] * 3;

        _index2.Vec3.set(tri.b, vb[_i7], vb[_i7 + 1], vb[_i7 + 2]);

        _index2.Vec3.set(tri.c, vb[_i8], vb[_i8 + 1], vb[_i8 + 2]);

        var _dist2 = _index.intersect.ray_triangle(modelRay, tri, sides);

        if (_dist2 <= 0 || _dist2 >= narrowDis) {
          continue;
        }

        narrowDis = _dist2;
      }
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcmVuZGVyZXIvc2NlbmUvcmVuZGVyLXNjZW5lLnRzIl0sIm5hbWVzIjpbIlJlbmRlclNjZW5lIiwiX3Jvb3QiLCJfbmFtZSIsIl9jYW1lcmFzIiwiX21haW5MaWdodCIsIl9zcGhlcmVMaWdodHMiLCJfc3BvdExpZ2h0cyIsIl9tb2RlbHMiLCJyZXN1bHRDYW52YXMiLCJyZXN1bHRNb2RlbHMiLCJyZXN1bHRBbGwiLCJyZXN1bHRTaW5nbGVNb2RlbCIsIl9zY2VuZVBvb2xIYW5kbGUiLCJyb290IiwiX2NyZWF0ZVNjZW5lRnVuIiwiX2RpcmVjdGlvbmFsTGlnaHRzIiwiX21vZGVsSWQiLCJOVUxMX0hBTkRMRSIsIl9tb2RlbEFycmF5SGFuZGxlIiwiX2NyZWF0ZUhhbmRsZXMiLCJpbmZvIiwibmFtZSIsInN0YW1wIiwibWFpbkxpZ2h0IiwidXBkYXRlIiwic3BoZXJlTGlnaHRzIiwiaSIsImxlbmd0aCIsImxpZ2h0Iiwic3BvdExpZ2h0cyIsIm1vZGVscyIsIm1vZGVsIiwiZW5hYmxlZCIsInVwZGF0ZVRyYW5zZm9ybSIsInVwZGF0ZVVCT3MiLCJyZW1vdmVDYW1lcmFzIiwicmVtb3ZlU3BoZXJlTGlnaHRzIiwicmVtb3ZlU3BvdExpZ2h0cyIsInJlbW92ZU1vZGVscyIsIk1vZGVsQXJyYXlQb29sIiwiZnJlZSIsIlNjZW5lUG9vbCIsImNhbSIsImF0dGFjaFRvU2NlbmUiLCJwdXNoIiwiY2FtZXJhIiwic3BsaWNlIiwiZGV0YWNoRnJvbVNjZW5lIiwiZGwiLCJzZXQiLCJTY2VuZVZpZXciLCJNQUlOX0xJR0hUIiwiaGFuZGxlIiwiZGxMaXN0Iiwibm9kZSIsImhhc0NoYW5nZWRGbGFncyIsIlRyYW5zZm9ybUJpdCIsIlJPVEFUSU9OIiwicGwiLCJzbCIsIm0iLCJlcmFzZSIsImNsZWFyIiwib25HbG9iYWxQaXBlbGluZVN0YXRlQ2hhbmdlZCIsIndvcmxkUmF5IiwibWFzayIsIkxheWVycyIsIkVudW0iLCJERUZBVUxUIiwiVUlfMkQiLCJkaXN0YW5jZSIsIkluZmluaXR5Iiwicl8zZCIsInJheWNhc3RBbGxNb2RlbHMiLCJyX3VpMmQiLCJyYXljYXN0QWxsQ2FudmFzIiwiaXNIaXQiLCJBcnJheSIsInByb3RvdHlwZSIsImFwcGx5IiwicG9vbCIsInJlc2V0IiwidHJhbnNmb3JtIiwibGF5ZXIiLCJJR05PUkVfUkFZQ0FTVCIsIndvcmxkQm91bmRzIiwiZCIsImludGVyc2VjdCIsInJheV9hYWJiIiwidHlwZSIsIk1vZGVsVHlwZSIsIk1hdDQiLCJpbnZlcnQiLCJtNCIsImdldFdvcmxkTWF0cml4IiwiVmVjMyIsInRyYW5zZm9ybU1hdDQiLCJtb2RlbFJheSIsIm8iLCJub3JtYWxpemUiLCJ0cmFuc2Zvcm1NYXQ0Tm9ybWFsIiwic3ViTW9kZWxzIiwic3ViTWVzaCIsImdlb21ldHJpY0luZm8iLCJ2YiIsInBvc2l0aW9ucyIsImliIiwiaW5kaWNlcyIsInNpZGVzIiwiZG91YmxlU2lkZWQiLCJuYXJyb3dwaGFzZSIsInByaW1pdGl2ZU1vZGUiLCJNYXRoIiwibWluIiwibmFycm93RGlzIiwibXVsdGlwbHkiLCJ2MyIsIndvcmxkU2NhbGUiLCJyIiwiYWRkIiwiUFJFVklFVyIsImNvbnNvbGUiLCJlcnJvciIsInBvb2xVSSIsImNhbnZhc0NvbXMiLCJsZWdhY3lDQyIsImRpcmVjdG9yIiwiZ2V0U2NlbmUiLCJnZXRDb21wb25lbnRzSW5DaGlsZHJlbiIsIkNhbnZhcyIsImNhbnZhc05vZGUiLCJhY3RpdmUiLCJfcmF5Y2FzdFVJMkROb2RlUmVjdXJzaXZlQ2hpbGRyZW4iLCJ1aTJkTm9kZSIsInVpVHJhbnNmb3JtIiwiX3VpUHJvcHMiLCJ1aVRyYW5zZm9ybUNvbXAiLCJnZXRDb21wdXRlQUFCQiIsImFhYmJVSSIsInBhcmVudCIsInJlc3VsdCIsIl9yYXljYXN0VUkyRE5vZGUiLCJjaGlsZHJlbiIsImFsbG9jIiwiTU9ERUxfQVJSQVkiLCJyYXkiLCJjcmVhdGUiLCJ0cmkiLCJ0cmlhbmdsZSIsIlJlY3ljbGVQb29sIiwiYWFiYiIsInBtIiwiR0ZYUHJpbWl0aXZlTW9kZSIsIlRSSUFOR0xFX0xJU1QiLCJjbnQiLCJqIiwiaTAiLCJpMSIsImkyIiwiYSIsImIiLCJjIiwiZGlzdCIsInJheV90cmlhbmdsZSIsIlRSSUFOR0xFX1NUUklQIiwicmV2IiwiVFJJQU5HTEVfRkFOIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQWlDYUEsVzs7OzBCQUVTO0FBQ2QsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7OzswQkFFbUI7QUFDaEIsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7OzswQkFFd0I7QUFDckIsZUFBTyxLQUFLQyxRQUFaO0FBQ0g7OzswQkFFeUM7QUFDdEMsZUFBTyxLQUFLQyxVQUFaO0FBQ0g7OzswQkFFa0M7QUFDL0IsZUFBTyxLQUFLQyxhQUFaO0FBQ0g7OzswQkFFOEI7QUFDM0IsZUFBTyxLQUFLQyxXQUFaO0FBQ0g7OzswQkFFc0I7QUFDbkIsZUFBTyxLQUFLQyxPQUFaO0FBQ0g7QUFFRDs7Ozs7OzswQkFJdUI7QUFDbkIsZUFBT0MsWUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSXVCO0FBQ25CLGVBQU9DLFlBQVA7QUFDSDtBQUVEOzs7Ozs7OzBCQUlvQjtBQUNoQixlQUFPQyxTQUFQO0FBQ0g7QUFFRDs7Ozs7OzswQkFJNEI7QUFDeEIsZUFBT0MsaUJBQVA7QUFDSDs7OzBCQUUyQjtBQUN4QixlQUFPLEtBQUtDLGdCQUFaO0FBQ0g7Ozt5Q0FFaUNDLEksRUFBWTtBQUMxQ0EsUUFBQUEsSUFBSSxDQUFDQyxlQUFMLEdBQXVCLFVBQUNiLEtBQUQ7QUFBQSxpQkFBOEIsSUFBSUQsV0FBSixDQUFnQkMsS0FBaEIsQ0FBOUI7QUFBQSxTQUF2QjtBQUNIOzs7QUFjRCx5QkFBYVksSUFBYixFQUF5QjtBQUFBOztBQUFBLFdBWmpCWixLQVlpQjtBQUFBLFdBWGpCQyxLQVdpQixHQVhELEVBV0M7QUFBQSxXQVZqQkMsUUFVaUIsR0FWSSxFQVVKO0FBQUEsV0FUakJJLE9BU2lCLEdBVEUsRUFTRjtBQUFBLFdBUmpCUSxrQkFRaUIsR0FSd0IsRUFReEI7QUFBQSxXQVBqQlYsYUFPaUIsR0FQYyxFQU9kO0FBQUEsV0FOakJDLFdBTWlCLEdBTlUsRUFNVjtBQUFBLFdBTGpCRixVQUtpQixHQUxxQixJQUtyQjtBQUFBLFdBSmpCWSxRQUlpQixHQUpFLENBSUY7QUFBQSxXQUhqQkosZ0JBR2lCLEdBSGVLLHdCQUdmO0FBQUEsV0FGakJDLGlCQUVpQixHQUZxQkQsd0JBRXJCO0FBQ3JCLFdBQUtoQixLQUFMLEdBQWFZLElBQWI7O0FBQ0EsV0FBS00sY0FBTDtBQUNIOzs7O2lDQUVrQkMsSSxFQUFpQztBQUNoRCxhQUFLbEIsS0FBTCxHQUFha0IsSUFBSSxDQUFDQyxJQUFsQjs7QUFDQSxhQUFLRixjQUFMOztBQUNBLGVBQU8sSUFBUDtBQUNIOzs7NkJBRWNHLEssRUFBZTtBQUMxQixZQUFNQyxTQUFTLEdBQUcsS0FBS25CLFVBQXZCOztBQUNBLFlBQUltQixTQUFKLEVBQWU7QUFDWEEsVUFBQUEsU0FBUyxDQUFDQyxNQUFWO0FBQ0g7O0FBRUQsWUFBTUMsWUFBWSxHQUFHLEtBQUtwQixhQUExQjs7QUFDQSxhQUFLLElBQUlxQixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxZQUFZLENBQUNFLE1BQWpDLEVBQXlDRCxDQUFDLEVBQTFDLEVBQThDO0FBQzFDLGNBQU1FLEtBQUssR0FBR0gsWUFBWSxDQUFDQyxDQUFELENBQTFCO0FBQ0FFLFVBQUFBLEtBQUssQ0FBQ0osTUFBTjtBQUNIOztBQUVELFlBQU1LLFVBQVUsR0FBRyxLQUFLdkIsV0FBeEI7O0FBQ0EsYUFBSyxJQUFJb0IsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBR0csVUFBVSxDQUFDRixNQUEvQixFQUF1Q0QsRUFBQyxFQUF4QyxFQUE0QztBQUN4QyxjQUFNRSxNQUFLLEdBQUdDLFVBQVUsQ0FBQ0gsRUFBRCxDQUF4Qjs7QUFDQUUsVUFBQUEsTUFBSyxDQUFDSixNQUFOO0FBQ0g7O0FBRUQsWUFBTU0sTUFBTSxHQUFHLEtBQUt2QixPQUFwQjs7QUFDQSxhQUFLLElBQUltQixHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHSSxNQUFNLENBQUNILE1BQTNCLEVBQW1DRCxHQUFDLEVBQXBDLEVBQXdDO0FBQ3BDLGNBQU1LLEtBQUssR0FBR0QsTUFBTSxDQUFDSixHQUFELENBQXBCOztBQUVBLGNBQUlLLEtBQUssQ0FBQ0MsT0FBVixFQUFtQjtBQUNmRCxZQUFBQSxLQUFLLENBQUNFLGVBQU4sQ0FBc0JYLEtBQXRCO0FBQ0FTLFlBQUFBLEtBQUssQ0FBQ0csVUFBTixDQUFpQlosS0FBakI7QUFDSDtBQUNKO0FBQ0o7OztnQ0FFaUI7QUFDZCxhQUFLYSxhQUFMO0FBQ0EsYUFBS0Msa0JBQUw7QUFDQSxhQUFLQyxnQkFBTDtBQUNBLGFBQUtDLFlBQUw7O0FBQ0EsWUFBSSxLQUFLcEIsaUJBQVQsRUFBNEI7QUFDeEJxQixzQ0FBZUMsSUFBZixDQUFvQixLQUFLdEIsaUJBQXpCOztBQUNBdUIsaUNBQVVELElBQVYsQ0FBZSxLQUFLNUIsZ0JBQXBCOztBQUNBLGVBQUtNLGlCQUFMLEdBQXlCRCx3QkFBekI7QUFDQSxlQUFLTCxnQkFBTCxHQUF3Qkssd0JBQXhCO0FBQ0g7QUFDSjs7O2dDQUVpQnlCLEcsRUFBYTtBQUMzQkEsUUFBQUEsR0FBRyxDQUFDQyxhQUFKLENBQWtCLElBQWxCOztBQUNBLGFBQUt4QyxRQUFMLENBQWN5QyxJQUFkLENBQW1CRixHQUFuQjtBQUNIOzs7bUNBRW9CRyxNLEVBQWdCO0FBQ2pDLGFBQUssSUFBSW5CLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS3ZCLFFBQUwsQ0FBY3dCLE1BQWxDLEVBQTBDLEVBQUVELENBQTVDLEVBQStDO0FBQzNDLGNBQUksS0FBS3ZCLFFBQUwsQ0FBY3VCLENBQWQsTUFBcUJtQixNQUF6QixFQUFpQztBQUM3QixpQkFBSzFDLFFBQUwsQ0FBYzJDLE1BQWQsQ0FBcUJwQixDQUFyQixFQUF3QixDQUF4Qjs7QUFDQW1CLFlBQUFBLE1BQU0sQ0FBQ0UsZUFBUDtBQUNBO0FBQ0g7QUFDSjtBQUNKOzs7c0NBRXVCO0FBQUEsbURBQ0MsS0FBSzVDLFFBRE47QUFBQTs7QUFBQTtBQUNwQiw4REFBb0M7QUFBQSxnQkFBekIwQyxNQUF5QjtBQUNoQ0EsWUFBQUEsTUFBTSxDQUFDRSxlQUFQO0FBQ0g7QUFIbUI7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFJcEIsYUFBSzVDLFFBQUwsQ0FBYzJDLE1BQWQsQ0FBcUIsQ0FBckI7QUFDSDs7O21DQUVvQkUsRSxFQUFzQjtBQUN2QyxhQUFLNUMsVUFBTCxHQUFrQjRDLEVBQWxCOztBQUNBUCwrQkFBVVEsR0FBVixDQUFjLEtBQUtyQyxnQkFBbkIsRUFBcUNzQyx1QkFBVUMsVUFBL0MsRUFBMkRILEVBQUUsQ0FBQ0ksTUFBOUQ7QUFDSDs7O3FDQUVzQkosRSxFQUFzQjtBQUN6QyxZQUFJLEtBQUs1QyxVQUFMLEtBQW9CNEMsRUFBeEIsRUFBNEI7QUFDeEIsY0FBTUssTUFBTSxHQUFHLEtBQUt0QyxrQkFBcEI7O0FBQ0EsY0FBSXNDLE1BQU0sQ0FBQzFCLE1BQVgsRUFBbUI7QUFDZixpQkFBS3ZCLFVBQUwsR0FBa0JpRCxNQUFNLENBQUNBLE1BQU0sQ0FBQzFCLE1BQVAsR0FBZ0IsQ0FBakIsQ0FBeEI7O0FBQ0EsZ0JBQUksS0FBS3ZCLFVBQUwsQ0FBZ0JrRCxJQUFwQixFQUEwQjtBQUFFO0FBQ3hCLG1CQUFLbEQsVUFBTCxDQUFnQmtELElBQWhCLENBQXFCQyxlQUFyQixJQUF3Q0MsdUJBQWFDLFFBQXJEO0FBQ0g7QUFDSixXQUxELE1BS087QUFDSCxpQkFBS3JELFVBQUwsR0FBa0IsSUFBbEI7QUFDSDtBQUNKO0FBQ0o7OzswQ0FFMkI0QyxFLEVBQXNCO0FBQzlDQSxRQUFBQSxFQUFFLENBQUNMLGFBQUgsQ0FBaUIsSUFBakI7O0FBQ0EsYUFBSzVCLGtCQUFMLENBQXdCNkIsSUFBeEIsQ0FBNkJJLEVBQTdCO0FBQ0g7Ozs2Q0FFOEJBLEUsRUFBc0I7QUFDakQsYUFBSyxJQUFJdEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLWCxrQkFBTCxDQUF3QlksTUFBNUMsRUFBb0QsRUFBRUQsQ0FBdEQsRUFBeUQ7QUFDckQsY0FBSSxLQUFLWCxrQkFBTCxDQUF3QlcsQ0FBeEIsTUFBK0JzQixFQUFuQyxFQUF1QztBQUNuQ0EsWUFBQUEsRUFBRSxDQUFDRCxlQUFIOztBQUNBLGlCQUFLaEMsa0JBQUwsQ0FBd0IrQixNQUF4QixDQUErQnBCLENBQS9CLEVBQWtDLENBQWxDOztBQUNBO0FBQ0g7QUFDSjtBQUNKOzs7cUNBRXNCZ0MsRSxFQUFpQjtBQUNwQ0EsUUFBQUEsRUFBRSxDQUFDZixhQUFILENBQWlCLElBQWpCOztBQUNBLGFBQUt0QyxhQUFMLENBQW1CdUMsSUFBbkIsQ0FBd0JjLEVBQXhCO0FBQ0g7Ozt3Q0FFeUJBLEUsRUFBaUI7QUFDdkMsYUFBSyxJQUFJaEMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLckIsYUFBTCxDQUFtQnNCLE1BQXZDLEVBQStDLEVBQUVELENBQWpELEVBQW9EO0FBQ2hELGNBQUksS0FBS3JCLGFBQUwsQ0FBbUJxQixDQUFuQixNQUEwQmdDLEVBQTlCLEVBQWtDO0FBQzlCQSxZQUFBQSxFQUFFLENBQUNYLGVBQUg7O0FBQ0EsaUJBQUsxQyxhQUFMLENBQW1CeUMsTUFBbkIsQ0FBMEJwQixDQUExQixFQUE2QixDQUE3Qjs7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7O21DQUVvQmlDLEUsRUFBZTtBQUNoQ0EsUUFBQUEsRUFBRSxDQUFDaEIsYUFBSCxDQUFpQixJQUFqQjs7QUFDQSxhQUFLckMsV0FBTCxDQUFpQnNDLElBQWpCLENBQXNCZSxFQUF0QjtBQUNIOzs7c0NBRXVCQSxFLEVBQWU7QUFDbkMsYUFBSyxJQUFJakMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxLQUFLcEIsV0FBTCxDQUFpQnFCLE1BQXJDLEVBQTZDLEVBQUVELENBQS9DLEVBQWtEO0FBQzlDLGNBQUksS0FBS3BCLFdBQUwsQ0FBaUJvQixDQUFqQixNQUF3QmlDLEVBQTVCLEVBQWdDO0FBQzVCQSxZQUFBQSxFQUFFLENBQUNaLGVBQUg7O0FBQ0EsaUJBQUt6QyxXQUFMLENBQWlCd0MsTUFBakIsQ0FBd0JwQixDQUF4QixFQUEyQixDQUEzQjs7QUFDQTtBQUNIO0FBQ0o7QUFDSjs7OzJDQUU0QjtBQUN6QixhQUFLLElBQUlBLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS3JCLGFBQUwsQ0FBbUJzQixNQUF2QyxFQUErQyxFQUFFRCxDQUFqRCxFQUFvRDtBQUNoRCxlQUFLckIsYUFBTCxDQUFtQnFCLENBQW5CLEVBQXNCcUIsZUFBdEI7QUFDSDs7QUFDRCxhQUFLMUMsYUFBTCxDQUFtQnNCLE1BQW5CLEdBQTRCLENBQTVCO0FBQ0g7Ozt5Q0FFMEI7QUFDdkIsYUFBSyxJQUFJRCxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtwQixXQUFMLENBQWlCcUIsTUFBckMsRUFBNkMsRUFBRUQsQ0FBL0MsRUFBa0Q7QUFDOUMsZUFBS3BCLFdBQUwsQ0FBaUJvQixDQUFqQixFQUFvQnFCLGVBQXBCO0FBQ0g7O0FBQ0QsYUFBS3pDLFdBQUwsR0FBbUIsRUFBbkI7QUFDSDs7OytCQUVnQnNELEMsRUFBVTtBQUN2QkEsUUFBQUEsQ0FBQyxDQUFDakIsYUFBRixDQUFnQixJQUFoQjs7QUFDQSxhQUFLcEMsT0FBTCxDQUFhcUMsSUFBYixDQUFrQmdCLENBQWxCOztBQUNBckIsb0NBQWVLLElBQWYsQ0FBb0IsS0FBSzFCLGlCQUF6QixFQUE0QzBDLENBQUMsQ0FBQ1IsTUFBOUM7QUFDSDs7O2tDQUVtQnJCLEssRUFBYztBQUM5QixhQUFLLElBQUlMLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS25CLE9BQUwsQ0FBYW9CLE1BQWpDLEVBQXlDLEVBQUVELENBQTNDLEVBQThDO0FBQzFDLGNBQUksS0FBS25CLE9BQUwsQ0FBYW1CLENBQWIsTUFBb0JLLEtBQXhCLEVBQStCO0FBQzNCQSxZQUFBQSxLQUFLLENBQUNnQixlQUFOOztBQUNBLGlCQUFLeEMsT0FBTCxDQUFhdUMsTUFBYixDQUFvQnBCLENBQXBCLEVBQXVCLENBQXZCOztBQUNBYSx3Q0FBZXNCLEtBQWYsQ0FBcUIsS0FBSzNDLGlCQUExQixFQUE2Q1EsQ0FBN0M7O0FBQ0E7QUFDSDtBQUNKO0FBQ0o7OztxQ0FFc0I7QUFBQSxvREFDSCxLQUFLbkIsT0FERjtBQUFBOztBQUFBO0FBQ25CLGlFQUE4QjtBQUFBLGdCQUFuQnFELENBQW1CO0FBQzFCQSxZQUFBQSxDQUFDLENBQUNiLGVBQUY7QUFDSDtBQUhrQjtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUluQixhQUFLeEMsT0FBTCxDQUFhb0IsTUFBYixHQUFzQixDQUF0Qjs7QUFDQVksb0NBQWV1QixLQUFmLENBQXFCLEtBQUs1QyxpQkFBMUI7QUFDSDs7O3FEQUVzQztBQUFBLG9EQUNuQixLQUFLWCxPQURjO0FBQUE7O0FBQUE7QUFDbkMsaUVBQThCO0FBQUEsZ0JBQW5CcUQsQ0FBbUI7QUFDMUJBLFlBQUFBLENBQUMsQ0FBQ0csNEJBQUY7QUFDSDtBQUhrQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBSXRDOzs7d0NBRWlDO0FBQzlCLGVBQU8sS0FBSy9DLFFBQUwsRUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7aUNBZ0JtQmdELFEsRUFBNkY7QUFBQSxZQUE5RUMsSUFBOEUsdUVBQXZFQyxlQUFPQyxJQUFQLENBQVlDLE9BQVosR0FBc0JGLGVBQU9DLElBQVAsQ0FBWUUsS0FBcUM7QUFBQSxZQUE5QkMsUUFBOEIsdUVBQW5CQyxRQUFtQjtBQUM1RyxZQUFNQyxJQUFJLEdBQUcsS0FBS0MsZ0JBQUwsQ0FBc0JULFFBQXRCLEVBQWdDQyxJQUFoQyxFQUFzQ0ssUUFBdEMsQ0FBYjtBQUNBLFlBQU1JLE1BQU0sR0FBRyxLQUFLQyxnQkFBTCxDQUFzQlgsUUFBdEIsRUFBZ0NDLElBQWhDLEVBQXNDSyxRQUF0QyxDQUFmO0FBQ0EsWUFBTU0sS0FBSyxHQUFHSixJQUFJLElBQUlFLE1BQXRCO0FBQ0FoRSxRQUFBQSxTQUFTLENBQUNpQixNQUFWLEdBQW1CLENBQW5COztBQUNBLFlBQUlpRCxLQUFKLEVBQVc7QUFDUEMsVUFBQUEsS0FBSyxDQUFDQyxTQUFOLENBQWdCbEMsSUFBaEIsQ0FBcUJtQyxLQUFyQixDQUEyQnJFLFNBQTNCLEVBQXNDRCxZQUF0QztBQUNBb0UsVUFBQUEsS0FBSyxDQUFDQyxTQUFOLENBQWdCbEMsSUFBaEIsQ0FBcUJtQyxLQUFyQixDQUEyQnJFLFNBQTNCLEVBQXNDRixZQUF0QztBQUNIOztBQUNELGVBQU9vRSxLQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1Q0FnQnlCWixRLEVBQXlFO0FBQUEsWUFBMURDLElBQTBELHVFQUFuREMsZUFBT0MsSUFBUCxDQUFZQyxPQUF1QztBQUFBLFlBQTlCRSxRQUE4Qix1RUFBbkJDLFFBQW1CO0FBQzlGUyxRQUFBQSxJQUFJLENBQUNDLEtBQUw7O0FBRDhGLG9EQUU5RSxLQUFLMUUsT0FGeUU7QUFBQTs7QUFBQTtBQUU5RixpRUFBOEI7QUFBQSxnQkFBbkJxRCxDQUFtQjtBQUMxQixnQkFBTXNCLFNBQVMsR0FBR3RCLENBQUMsQ0FBQ3NCLFNBQXBCOztBQUNBLGdCQUFJLENBQUNBLFNBQUQsSUFBYyxDQUFDdEIsQ0FBQyxDQUFDNUIsT0FBakIsSUFBNEIsRUFBRTRCLENBQUMsQ0FBQ04sSUFBRixDQUFPNkIsS0FBUCxJQUFnQmxCLElBQUksR0FBRyxDQUFDQyxlQUFPQyxJQUFQLENBQVlpQixjQUFwQyxDQUFGLENBQTVCLElBQXNGLENBQUN4QixDQUFDLENBQUN5QixXQUE3RixFQUEwRztBQUFFO0FBQVcsYUFGN0YsQ0FHMUI7OztBQUNBLGdCQUFJQyxDQUFDLEdBQUdDLGlCQUFVQyxRQUFWLENBQW1CeEIsUUFBbkIsRUFBNkJKLENBQUMsQ0FBQ3lCLFdBQS9CLENBQVI7O0FBQ0EsZ0JBQUlDLENBQUMsSUFBSSxDQUFMLElBQVVBLENBQUMsSUFBSWhCLFFBQW5CLEVBQTZCO0FBQUU7QUFBVzs7QUFDMUMsZ0JBQUlWLENBQUMsQ0FBQzZCLElBQUYsS0FBV0MsaUJBQVV0QixPQUF6QixFQUFrQztBQUM5QjtBQUNBdUIsMkJBQUtDLE1BQUwsQ0FBWUMsRUFBWixFQUFnQlgsU0FBUyxDQUFDWSxjQUFWLENBQXlCRCxFQUF6QixDQUFoQjs7QUFDQUUsMkJBQUtDLGFBQUwsQ0FBbUJDLFFBQVEsQ0FBQ0MsQ0FBNUIsRUFBK0JsQyxRQUFRLENBQUNrQyxDQUF4QyxFQUEyQ0wsRUFBM0M7O0FBQ0FFLDJCQUFLSSxTQUFMLENBQWVGLFFBQVEsQ0FBQ1gsQ0FBeEIsRUFBMkJTLGFBQUtLLG1CQUFMLENBQXlCSCxRQUFRLENBQUNYLENBQWxDLEVBQXFDdEIsUUFBUSxDQUFDc0IsQ0FBOUMsRUFBaURPLEVBQWpELENBQTNCOztBQUNBUCxjQUFBQSxDQUFDLEdBQUdmLFFBQUo7QUFBYyxrQkFBTThCLFNBQVMsR0FBR3pDLENBQUMsQ0FBQ3lDLFNBQXBCOztBQUNkLG1CQUFLLElBQUkzRSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMkUsU0FBUyxDQUFDMUUsTUFBOUIsRUFBc0MsRUFBRUQsQ0FBeEMsRUFBMkM7QUFDdkMsb0JBQU00RSxPQUFPLEdBQUdELFNBQVMsQ0FBQzNFLENBQUQsQ0FBVCxDQUFhNEUsT0FBN0I7O0FBQ0Esb0JBQUlBLE9BQU8sSUFBSUEsT0FBTyxDQUFDQyxhQUF2QixFQUFzQztBQUFBLDhDQUN5QkQsT0FBTyxDQUFDQyxhQURqQztBQUFBLHNCQUNmQyxFQURlLHlCQUMxQkMsU0FEMEI7QUFBQSxzQkFDRkMsRUFERSx5QkFDWEMsT0FEVztBQUFBLHNCQUNlQyxLQURmLHlCQUNFQyxXQURGO0FBRWxDQyxrQkFBQUEsV0FBVyxDQUFDTixFQUFELEVBQUtFLEVBQUwsRUFBVUosT0FBTyxDQUFDUyxhQUFsQixFQUFpQ0gsS0FBakMsRUFBeUN0QyxRQUF6QyxDQUFYO0FBQ0FnQixrQkFBQUEsQ0FBQyxHQUFHMEIsSUFBSSxDQUFDQyxHQUFMLENBQVMzQixDQUFULEVBQVk0QixTQUFTLEdBQUduQixhQUFLb0IsUUFBTCxDQUFjQyxFQUFkLEVBQWtCbkIsUUFBUSxDQUFDWCxDQUEzQixFQUE4QkosU0FBUyxDQUFDbUMsVUFBeEMsRUFBb0QxRixNQUFwRCxFQUF4QixDQUFKO0FBQ0g7QUFDSjtBQUNKOztBQUNELGdCQUFJMkQsQ0FBQyxHQUFHaEIsUUFBUixFQUFrQjtBQUNkLGtCQUFNZ0QsQ0FBQyxHQUFHdEMsSUFBSSxDQUFDdUMsR0FBTCxFQUFWO0FBQ0FELGNBQUFBLENBQUMsQ0FBQ2hFLElBQUYsR0FBU00sQ0FBQyxDQUFDTixJQUFYO0FBQ0FnRSxjQUFBQSxDQUFDLENBQUNoRCxRQUFGLEdBQWFnQixDQUFiO0FBQ0E3RSxjQUFBQSxZQUFZLENBQUN1RSxJQUFJLENBQUNyRCxNQUFMLEdBQWMsQ0FBZixDQUFaLEdBQWdDMkYsQ0FBaEM7QUFDSDtBQUNKO0FBN0I2RjtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQThCOUY3RyxRQUFBQSxZQUFZLENBQUNrQixNQUFiLEdBQXNCcUQsSUFBSSxDQUFDckQsTUFBM0I7QUFDQSxlQUFPbEIsWUFBWSxDQUFDa0IsTUFBYixHQUFzQixDQUE3QjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUNBZ0IyQnFDLFEsRUFBZWpDLEssRUFBd0U7QUFBQSxZQUExRGtDLElBQTBELHVFQUFuREMsZUFBT0MsSUFBUCxDQUFZQyxPQUF1QztBQUFBLFlBQTlCRSxRQUE4Qix1RUFBbkJDLFFBQW1COztBQUM5RyxZQUFJaUQseUJBQUosRUFBYTtBQUNULGNBQUl6RixLQUFLLElBQUksSUFBYixFQUFtQjtBQUFFMEYsWUFBQUEsT0FBTyxDQUFDQyxLQUFSLENBQWMsd0JBQWQ7QUFBMEM7QUFDbEU7O0FBQ0QxQyxRQUFBQSxJQUFJLENBQUNDLEtBQUw7QUFDQSxZQUFNckIsQ0FBQyxHQUFHN0IsS0FBVjtBQUNBLFlBQU1tRCxTQUFTLEdBQUd0QixDQUFDLENBQUNzQixTQUFwQjs7QUFDQSxZQUFJLENBQUNBLFNBQUQsSUFBYyxDQUFDdEIsQ0FBQyxDQUFDNUIsT0FBakIsSUFBNEIsRUFBRTRCLENBQUMsQ0FBQ04sSUFBRixDQUFPNkIsS0FBUCxJQUFnQmxCLElBQUksR0FBRyxDQUFDQyxlQUFPQyxJQUFQLENBQVlpQixjQUFwQyxDQUFGLENBQTVCLElBQXNGLENBQUN4QixDQUFDLENBQUN5QixXQUE3RixFQUEwRztBQUFFLGlCQUFPLEtBQVA7QUFBZSxTQVBiLENBUTlHOzs7QUFDQSxZQUFJQyxDQUFDLEdBQUdDLGlCQUFVQyxRQUFWLENBQW1CeEIsUUFBbkIsRUFBNkJKLENBQUMsQ0FBQ3lCLFdBQS9CLENBQVI7O0FBQ0EsWUFBSUMsQ0FBQyxJQUFJLENBQUwsSUFBVUEsQ0FBQyxJQUFJaEIsUUFBbkIsRUFBNkI7QUFBRSxpQkFBTyxLQUFQO0FBQWU7O0FBQzlDLFlBQUlWLENBQUMsQ0FBQzZCLElBQUYsS0FBV0MsaUJBQVV0QixPQUF6QixFQUFrQztBQUM5QjtBQUNBdUIsdUJBQUtDLE1BQUwsQ0FBWUMsRUFBWixFQUFnQlgsU0FBUyxDQUFDWSxjQUFWLENBQXlCRCxFQUF6QixDQUFoQjs7QUFDQUUsdUJBQUtDLGFBQUwsQ0FBbUJDLFFBQVEsQ0FBQ0MsQ0FBNUIsRUFBK0JsQyxRQUFRLENBQUNrQyxDQUF4QyxFQUEyQ0wsRUFBM0M7O0FBQ0FFLHVCQUFLSSxTQUFMLENBQWVGLFFBQVEsQ0FBQ1gsQ0FBeEIsRUFBMkJTLGFBQUtLLG1CQUFMLENBQXlCSCxRQUFRLENBQUNYLENBQWxDLEVBQXFDdEIsUUFBUSxDQUFDc0IsQ0FBOUMsRUFBaURPLEVBQWpELENBQTNCOztBQUNBUCxVQUFBQSxDQUFDLEdBQUdmLFFBQUo7QUFBYyxjQUFNOEIsU0FBUyxHQUFHekMsQ0FBQyxDQUFDeUMsU0FBcEI7O0FBQ2QsZUFBSyxJQUFJM0UsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRzJFLFNBQVMsQ0FBQzFFLE1BQTlCLEVBQXNDLEVBQUVELENBQXhDLEVBQTJDO0FBQ3ZDLGdCQUFNNEUsT0FBTyxHQUFHRCxTQUFTLENBQUMzRSxDQUFELENBQVQsQ0FBYTRFLE9BQTdCOztBQUNBLGdCQUFJQSxPQUFPLElBQUlBLE9BQU8sQ0FBQ0MsYUFBdkIsRUFBc0M7QUFBQSwyQ0FDeUJELE9BQU8sQ0FBQ0MsYUFEakM7QUFBQSxrQkFDZkMsRUFEZSwwQkFDMUJDLFNBRDBCO0FBQUEsa0JBQ0ZDLEVBREUsMEJBQ1hDLE9BRFc7QUFBQSxrQkFDZUMsS0FEZiwwQkFDRUMsV0FERjtBQUVsQ0MsY0FBQUEsV0FBVyxDQUFDTixFQUFELEVBQUtFLEVBQUwsRUFBVUosT0FBTyxDQUFDUyxhQUFsQixFQUFpQ0gsS0FBakMsRUFBeUN0QyxRQUF6QyxDQUFYO0FBQ0FnQixjQUFBQSxDQUFDLEdBQUcwQixJQUFJLENBQUNDLEdBQUwsQ0FBUzNCLENBQVQsRUFBWTRCLFNBQVMsR0FBR25CLGFBQUtvQixRQUFMLENBQWNDLEVBQWQsRUFBa0JuQixRQUFRLENBQUNYLENBQTNCLEVBQThCSixTQUFTLENBQUNtQyxVQUF4QyxFQUFvRDFGLE1BQXBELEVBQXhCLENBQUo7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsWUFBSTJELENBQUMsR0FBR2hCLFFBQVIsRUFBa0I7QUFDZCxjQUFNZ0QsQ0FBQyxHQUFHdEMsSUFBSSxDQUFDdUMsR0FBTCxFQUFWO0FBQ0FELFVBQUFBLENBQUMsQ0FBQ2hFLElBQUYsR0FBU00sQ0FBQyxDQUFDTixJQUFYO0FBQ0FnRSxVQUFBQSxDQUFDLENBQUNoRCxRQUFGLEdBQWFnQixDQUFiO0FBQ0EzRSxVQUFBQSxpQkFBaUIsQ0FBQ3FFLElBQUksQ0FBQ3JELE1BQUwsR0FBYyxDQUFmLENBQWpCLEdBQXFDMkYsQ0FBckM7QUFDSDs7QUFDRDNHLFFBQUFBLGlCQUFpQixDQUFDZ0IsTUFBbEIsR0FBMkJxRCxJQUFJLENBQUNyRCxNQUFoQztBQUNBLGVBQU9oQixpQkFBaUIsQ0FBQ2dCLE1BQWxCLEdBQTJCLENBQWxDO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1Q0FnQnlCcUMsUSxFQUF1RTtBQUFBLFlBQXhEQyxJQUF3RCx1RUFBakRDLGVBQU9DLElBQVAsQ0FBWUUsS0FBcUM7QUFBQSxZQUE5QkMsUUFBOEIsdUVBQW5CQyxRQUFtQjtBQUM1Rm9ELFFBQUFBLE1BQU0sQ0FBQzFDLEtBQVA7O0FBQ0EsWUFBTTJDLFVBQVUsR0FBR0Msd0JBQVNDLFFBQVQsQ0FBa0JDLFFBQWxCLEdBQTZCQyx1QkFBN0IsQ0FBcURILHdCQUFTSSxNQUE5RCxDQUFuQjs7QUFDQSxZQUFJTCxVQUFVLElBQUksSUFBZCxJQUFzQkEsVUFBVSxDQUFDakcsTUFBWCxHQUFvQixDQUE5QyxFQUFpRDtBQUM3QyxlQUFLLElBQUlELENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdrRyxVQUFVLENBQUNqRyxNQUEvQixFQUF1Q0QsQ0FBQyxFQUF4QyxFQUE0QztBQUN4QyxnQkFBTXdHLFVBQVUsR0FBR04sVUFBVSxDQUFDbEcsQ0FBRCxDQUFWLENBQWM0QixJQUFqQzs7QUFDQSxnQkFBSTRFLFVBQVUsSUFBSSxJQUFkLElBQXNCQSxVQUFVLENBQUNDLE1BQXJDLEVBQTZDO0FBQ3pDLG1CQUFLQyxpQ0FBTCxDQUF1Q3BFLFFBQXZDLEVBQWlEa0UsVUFBakQsRUFBNkRqRSxJQUE3RCxFQUFtRUssUUFBbkU7QUFDSDtBQUNKO0FBQ0o7O0FBQ0Q5RCxRQUFBQSxZQUFZLENBQUNtQixNQUFiLEdBQXNCZ0csTUFBTSxDQUFDaEcsTUFBN0I7QUFDQSxlQUFPbkIsWUFBWSxDQUFDbUIsTUFBYixHQUFzQixDQUE3QjtBQUNIOzs7dUNBRXlCcUMsUSxFQUFlcUUsUSxFQUErRDtBQUFBLFlBQS9DcEUsSUFBK0MsdUVBQXhDQyxlQUFPQyxJQUFQLENBQVlFLEtBQTRCO0FBQUEsWUFBckJDLFFBQXFCLHVFQUFWQyxRQUFVOztBQUNwRyxZQUFJaUQseUJBQUosRUFBYTtBQUNULGNBQUlhLFFBQVEsSUFBSSxJQUFoQixFQUFzQjtBQUFFWixZQUFBQSxPQUFPLENBQUNDLEtBQVIsQ0FBYyw4QkFBZDtBQUFnRDtBQUMzRTs7QUFDRCxZQUFNWSxXQUFXLEdBQUdELFFBQVEsQ0FBQ0UsUUFBVCxDQUFrQkMsZUFBdEM7O0FBQ0EsWUFBSUYsV0FBVyxJQUFJLElBQWYsSUFBdUJELFFBQVEsQ0FBQ2xELEtBQVQsR0FBaUJqQixlQUFPQyxJQUFQLENBQVlpQixjQUFwRCxJQUFzRSxFQUFFaUQsUUFBUSxDQUFDbEQsS0FBVCxHQUFpQmxCLElBQW5CLENBQTFFLEVBQW9HO0FBQUU7QUFBUzs7QUFDL0dxRSxRQUFBQSxXQUFXLENBQUNHLGNBQVosQ0FBMkJDLE1BQTNCOztBQUNBLFlBQU1wRCxDQUFDLEdBQUdDLGlCQUFVQyxRQUFWLENBQW1CeEIsUUFBbkIsRUFBNkIwRSxNQUE3QixDQUFWOztBQUVBLFlBQUlwRCxDQUFDLElBQUksQ0FBVCxFQUFZO0FBQ1I7QUFDSCxTQUZELE1BRU8sSUFBSUEsQ0FBQyxHQUFHaEIsUUFBUixFQUFrQjtBQUNyQixjQUFNZ0QsQ0FBQyxHQUFHSyxNQUFNLENBQUNKLEdBQVAsRUFBVjtBQUNBRCxVQUFBQSxDQUFDLENBQUNoRSxJQUFGLEdBQVMrRSxRQUFUO0FBQ0FmLFVBQUFBLENBQUMsQ0FBQ2hELFFBQUYsR0FBYWdCLENBQWI7QUFDQSxpQkFBT2dDLENBQVA7QUFDSDtBQUNKOzs7d0RBRTBDdEQsUSxFQUFlMkUsTSxFQUE2RDtBQUFBLFlBQS9DMUUsSUFBK0MsdUVBQXhDQyxlQUFPQyxJQUFQLENBQVlFLEtBQTRCO0FBQUEsWUFBckJDLFFBQXFCLHVFQUFWQyxRQUFVOztBQUNuSCxZQUFNcUUsTUFBTSxHQUFHLEtBQUtDLGdCQUFMLENBQXNCN0UsUUFBdEIsRUFBZ0MyRSxNQUFoQyxFQUF3QzFFLElBQXhDLEVBQThDSyxRQUE5QyxDQUFmOztBQUNBLFlBQUlzRSxNQUFNLElBQUksSUFBZCxFQUFvQjtBQUNoQnBJLFVBQUFBLFlBQVksQ0FBQ21ILE1BQU0sQ0FBQ2hHLE1BQVAsR0FBZ0IsQ0FBakIsQ0FBWixHQUFrQ2lILE1BQWxDO0FBQ0g7O0FBSmtILG9EQUtoR0QsTUFBTSxDQUFDRyxRQUx5RjtBQUFBOztBQUFBO0FBS25ILGlFQUFvQztBQUFBLGdCQUF6QnhGLElBQXlCOztBQUNoQyxnQkFBSUEsSUFBSSxJQUFJLElBQVIsSUFBZ0JBLElBQUksQ0FBQzZFLE1BQXpCLEVBQWlDO0FBQzdCLG1CQUFLQyxpQ0FBTCxDQUF1Q3BFLFFBQXZDLEVBQWlEVixJQUFqRCxFQUF1RFcsSUFBdkQsRUFBNkRLLFFBQTdEO0FBQ0g7QUFDSjtBQVRrSDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBVXRIOzs7dUNBRXlCO0FBQ3RCLFlBQUksQ0FBQyxLQUFLcEQsaUJBQVYsRUFBNkI7QUFDekIsZUFBS0EsaUJBQUwsR0FBeUJxQiw0QkFBZXdHLEtBQWYsRUFBekI7QUFDQSxlQUFLbkksZ0JBQUwsR0FBd0I2Qix1QkFBVXNHLEtBQVYsRUFBeEI7O0FBQ0F0RyxpQ0FBVVEsR0FBVixDQUFjLEtBQUtyQyxnQkFBbkIsRUFBcUNzQyx1QkFBVThGLFdBQS9DLEVBQTRELEtBQUs5SCxpQkFBakU7QUFDSDtBQUNKOzs7Ozs7OztBQUdMLE1BQU0rRSxRQUFRLEdBQUdnRCxXQUFJQyxNQUFKLEVBQWpCOztBQUNBLE1BQU05QixFQUFFLEdBQUcsSUFBSXJCLFlBQUosRUFBWDtBQUNBLE1BQU1GLEVBQUUsR0FBRyxJQUFJRixZQUFKLEVBQVg7QUFDQSxNQUFJdUIsU0FBUyxHQUFHM0MsUUFBaEI7O0FBQ0EsTUFBTTRFLEdBQUcsR0FBR0MsZ0JBQVNGLE1BQVQsRUFBWjs7QUFDQSxNQUFNbEUsSUFBSSxHQUFHLElBQUlxRSxtQkFBSixDQUFnQyxZQUFNO0FBQy9DLFdBQU87QUFBRS9GLE1BQUFBLElBQUksRUFBRSxJQUFSO0FBQWVnQixNQUFBQSxRQUFRLEVBQUVDO0FBQXpCLEtBQVA7QUFDSCxHQUZZLEVBRVYsQ0FGVSxDQUFiO0FBR0EsTUFBTTlELFlBQThCLEdBQUcsRUFBdkM7QUFDQTs7QUFDQSxNQUFNaUksTUFBTSxHQUFHLElBQUlZLFdBQUosRUFBZjtBQUNBLE1BQU0zQixNQUFNLEdBQUcsSUFBSTBCLG1CQUFKLENBQWdDLFlBQU07QUFDakQsV0FBTztBQUFFL0YsTUFBQUEsSUFBSSxFQUFFLElBQVI7QUFBZWdCLE1BQUFBLFFBQVEsRUFBRUM7QUFBekIsS0FBUDtBQUNILEdBRmMsRUFFWixDQUZZLENBQWY7QUFHQSxNQUFNL0QsWUFBOEIsR0FBRyxFQUF2QztBQUNBOztBQUNBLE1BQU1FLFNBQTJCLEdBQUcsRUFBcEM7QUFDQTs7QUFDQSxNQUFNQyxpQkFBbUMsR0FBRyxFQUE1Qzs7QUFFQSxNQUFNbUcsV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ04sRUFBRCxFQUFtQkUsRUFBbkIsRUFBZ0M2QyxFQUFoQyxFQUFzRDNDLEtBQXRELEVBQThGO0FBQUEsUUFBeEJ0QyxRQUF3Qix1RUFBYkMsUUFBYTtBQUM5RzJDLElBQUFBLFNBQVMsR0FBRzVDLFFBQVo7O0FBQ0EsUUFBSWlGLEVBQUUsS0FBS0MseUJBQWlCQyxhQUE1QixFQUEyQztBQUN2QyxVQUFNQyxHQUFHLEdBQUdoRCxFQUFFLENBQUMvRSxNQUFmOztBQUNBLFdBQUssSUFBSWdJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdELEdBQXBCLEVBQXlCQyxDQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDN0IsWUFBTUMsRUFBRSxHQUFHbEQsRUFBRSxDQUFDaUQsQ0FBRCxDQUFGLEdBQVEsQ0FBbkI7QUFDQSxZQUFNRSxFQUFFLEdBQUduRCxFQUFFLENBQUNpRCxDQUFDLEdBQUcsQ0FBTCxDQUFGLEdBQVksQ0FBdkI7QUFDQSxZQUFNRyxFQUFFLEdBQUdwRCxFQUFFLENBQUNpRCxDQUFDLEdBQUcsQ0FBTCxDQUFGLEdBQVksQ0FBdkI7O0FBQ0E1RCxxQkFBSzlDLEdBQUwsQ0FBU2tHLEdBQUcsQ0FBQ1ksQ0FBYixFQUFnQnZELEVBQUUsQ0FBQ29ELEVBQUQsQ0FBbEIsRUFBd0JwRCxFQUFFLENBQUNvRCxFQUFFLEdBQUcsQ0FBTixDQUExQixFQUFvQ3BELEVBQUUsQ0FBQ29ELEVBQUUsR0FBRyxDQUFOLENBQXRDOztBQUNBN0QscUJBQUs5QyxHQUFMLENBQVNrRyxHQUFHLENBQUNhLENBQWIsRUFBZ0J4RCxFQUFFLENBQUNxRCxFQUFELENBQWxCLEVBQXdCckQsRUFBRSxDQUFDcUQsRUFBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NyRCxFQUFFLENBQUNxRCxFQUFFLEdBQUcsQ0FBTixDQUF0Qzs7QUFDQTlELHFCQUFLOUMsR0FBTCxDQUFTa0csR0FBRyxDQUFDYyxDQUFiLEVBQWdCekQsRUFBRSxDQUFDc0QsRUFBRCxDQUFsQixFQUF3QnRELEVBQUUsQ0FBQ3NELEVBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DdEQsRUFBRSxDQUFDc0QsRUFBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0EsWUFBTUksSUFBSSxHQUFHM0UsaUJBQVU0RSxZQUFWLENBQXVCbEUsUUFBdkIsRUFBaUNrRCxHQUFqQyxFQUFzQ3ZDLEtBQXRDLENBQWI7O0FBQ0EsWUFBSXNELElBQUksSUFBSSxDQUFSLElBQWFBLElBQUksSUFBSWhELFNBQXpCLEVBQW9DO0FBQUU7QUFBVzs7QUFDakRBLFFBQUFBLFNBQVMsR0FBR2dELElBQVo7QUFDSDtBQUNKLEtBYkQsTUFhTyxJQUFJWCxFQUFFLEtBQUtDLHlCQUFpQlksY0FBNUIsRUFBNEM7QUFDL0MsVUFBTVYsSUFBRyxHQUFHaEQsRUFBRSxDQUFDL0UsTUFBSCxHQUFZLENBQXhCOztBQUNBLFVBQUkwSSxHQUFHLEdBQUcsQ0FBVjs7QUFDQSxXQUFLLElBQUlWLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdELElBQXBCLEVBQXlCQyxFQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDN0IsWUFBTUMsR0FBRSxHQUFHbEQsRUFBRSxDQUFDaUQsRUFBQyxHQUFHVSxHQUFMLENBQUYsR0FBYyxDQUF6Qjs7QUFDQSxZQUFNUixHQUFFLEdBQUduRCxFQUFFLENBQUNpRCxFQUFDLEdBQUdVLEdBQUosR0FBVSxDQUFYLENBQUYsR0FBa0IsQ0FBN0I7O0FBQ0EsWUFBTVAsR0FBRSxHQUFHcEQsRUFBRSxDQUFDaUQsRUFBQyxHQUFHLENBQUwsQ0FBRixHQUFZLENBQXZCOztBQUNBNUQscUJBQUs5QyxHQUFMLENBQVNrRyxHQUFHLENBQUNZLENBQWIsRUFBZ0J2RCxFQUFFLENBQUNvRCxHQUFELENBQWxCLEVBQXdCcEQsRUFBRSxDQUFDb0QsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NwRCxFQUFFLENBQUNvRCxHQUFFLEdBQUcsQ0FBTixDQUF0Qzs7QUFDQTdELHFCQUFLOUMsR0FBTCxDQUFTa0csR0FBRyxDQUFDYSxDQUFiLEVBQWdCeEQsRUFBRSxDQUFDcUQsR0FBRCxDQUFsQixFQUF3QnJELEVBQUUsQ0FBQ3FELEdBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DckQsRUFBRSxDQUFDcUQsR0FBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0E5RCxxQkFBSzlDLEdBQUwsQ0FBU2tHLEdBQUcsQ0FBQ2MsQ0FBYixFQUFnQnpELEVBQUUsQ0FBQ3NELEdBQUQsQ0FBbEIsRUFBd0J0RCxFQUFFLENBQUNzRCxHQUFFLEdBQUcsQ0FBTixDQUExQixFQUFvQ3RELEVBQUUsQ0FBQ3NELEdBQUUsR0FBRyxDQUFOLENBQXRDOztBQUNBTyxRQUFBQSxHQUFHLEdBQUcsQ0FBQ0EsR0FBUDs7QUFDQSxZQUFNSCxLQUFJLEdBQUczRSxpQkFBVTRFLFlBQVYsQ0FBdUJsRSxRQUF2QixFQUFpQ2tELEdBQWpDLEVBQXNDdkMsS0FBdEMsQ0FBYjs7QUFDQSxZQUFJc0QsS0FBSSxJQUFJLENBQVIsSUFBYUEsS0FBSSxJQUFJaEQsU0FBekIsRUFBb0M7QUFBRTtBQUFXOztBQUNqREEsUUFBQUEsU0FBUyxHQUFHZ0QsS0FBWjtBQUNIO0FBQ0osS0FmTSxNQWVBLElBQUlYLEVBQUUsS0FBS0MseUJBQWlCYyxZQUE1QixFQUEwQztBQUM3QyxVQUFNWixLQUFHLEdBQUdoRCxFQUFFLENBQUMvRSxNQUFILEdBQVksQ0FBeEI7O0FBQ0EsVUFBTWlJLEdBQUUsR0FBR2xELEVBQUUsQ0FBQyxDQUFELENBQUYsR0FBUSxDQUFuQjs7QUFDQVgsbUJBQUs5QyxHQUFMLENBQVNrRyxHQUFHLENBQUNZLENBQWIsRUFBZ0J2RCxFQUFFLENBQUNvRCxHQUFELENBQWxCLEVBQXdCcEQsRUFBRSxDQUFDb0QsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NwRCxFQUFFLENBQUNvRCxHQUFFLEdBQUcsQ0FBTixDQUF0Qzs7QUFDQSxXQUFLLElBQUlELEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUdELEtBQXBCLEVBQXlCQyxHQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDN0IsWUFBTUUsR0FBRSxHQUFHbkQsRUFBRSxDQUFDaUQsR0FBRCxDQUFGLEdBQVEsQ0FBbkI7O0FBQ0EsWUFBTUcsR0FBRSxHQUFHcEQsRUFBRSxDQUFDaUQsR0FBQyxHQUFHLENBQUwsQ0FBRixHQUFZLENBQXZCOztBQUNBNUQscUJBQUs5QyxHQUFMLENBQVNrRyxHQUFHLENBQUNhLENBQWIsRUFBZ0J4RCxFQUFFLENBQUNxRCxHQUFELENBQWxCLEVBQXdCckQsRUFBRSxDQUFDcUQsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NyRCxFQUFFLENBQUNxRCxHQUFFLEdBQUcsQ0FBTixDQUF0Qzs7QUFDQTlELHFCQUFLOUMsR0FBTCxDQUFTa0csR0FBRyxDQUFDYyxDQUFiLEVBQWdCekQsRUFBRSxDQUFDc0QsR0FBRCxDQUFsQixFQUF3QnRELEVBQUUsQ0FBQ3NELEdBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DdEQsRUFBRSxDQUFDc0QsR0FBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0EsWUFBTUksTUFBSSxHQUFHM0UsaUJBQVU0RSxZQUFWLENBQXVCbEUsUUFBdkIsRUFBaUNrRCxHQUFqQyxFQUFzQ3ZDLEtBQXRDLENBQWI7O0FBQ0EsWUFBSXNELE1BQUksSUFBSSxDQUFSLElBQWFBLE1BQUksSUFBSWhELFNBQXpCLEVBQW9DO0FBQUU7QUFBVzs7QUFDakRBLFFBQUFBLFNBQVMsR0FBR2dELE1BQVo7QUFDSDtBQUNKO0FBQ0osR0E1Q0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQkFycmF5IH0gZnJvbSAnLi4vLi4vYXNzZXRzL21lc2gnO1xyXG5pbXBvcnQgeyBhYWJiLCBpbnRlcnNlY3QsIHJheSwgdHJpYW5nbGUgfSBmcm9tICcuLi8uLi9nZW9tZXRyeSc7XHJcbmltcG9ydCB7IEdGWFByaW1pdGl2ZU1vZGUgfSBmcm9tICcuLi8uLi9nZngvZGVmaW5lJztcclxuaW1wb3J0IHsgTWF0NCwgVmVjMyB9IGZyb20gJy4uLy4uL21hdGgnO1xyXG5pbXBvcnQgeyBSZWN5Y2xlUG9vbCB9IGZyb20gJy4uLy4uL21lbW9wJztcclxuaW1wb3J0IHsgUm9vdCB9IGZyb20gJy4uLy4uL3Jvb3QnO1xyXG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnLi4vLi4vc2NlbmUtZ3JhcGgnO1xyXG5pbXBvcnQgeyBMYXllcnMgfSBmcm9tICcuLi8uLi9zY2VuZS1ncmFwaC9sYXllcnMnO1xyXG5pbXBvcnQgeyBDYW1lcmEgfSBmcm9tICcuL2NhbWVyYSc7XHJcbmltcG9ydCB7IERpcmVjdGlvbmFsTGlnaHQgfSBmcm9tICcuL2RpcmVjdGlvbmFsLWxpZ2h0JztcclxuaW1wb3J0IHsgTW9kZWwsIE1vZGVsVHlwZSB9IGZyb20gJy4vbW9kZWwnO1xyXG5pbXBvcnQgeyBTcGhlcmVMaWdodCB9IGZyb20gJy4vc3BoZXJlLWxpZ2h0JztcclxuaW1wb3J0IHsgU3BvdExpZ2h0IH0gZnJvbSAnLi9zcG90LWxpZ2h0JztcclxuaW1wb3J0IHsgUFJFVklFVyB9IGZyb20gJ2ludGVybmFsOmNvbnN0YW50cyc7XHJcbmltcG9ydCB7IFRyYW5zZm9ybUJpdCB9IGZyb20gJy4uLy4uL3NjZW5lLWdyYXBoL25vZGUtZW51bSc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBTY2VuZVBvb2wsIFNjZW5lVmlldywgTW9kZWxBcnJheVBvb2wsIE1vZGVsQXJyYXlIYW5kbGUsIFNjZW5lSGFuZGxlLCBOVUxMX0hBTkRMRSB9IGZyb20gJy4uL2NvcmUvbWVtb3J5LXBvb2xzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJlbmRlclNjZW5lSW5mbyB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVNjZW5lTm9kZUluZm8ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaXNTdGF0aWM/OiBib29sZWFuO1xyXG4gICAgLy8gcGFyZW50OiBOb2RlO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElSYXljYXN0UmVzdWx0IHtcclxuICAgIG5vZGU6IE5vZGU7XHJcbiAgICBkaXN0YW5jZTogbnVtYmVyO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVuZGVyU2NlbmUge1xyXG5cclxuICAgIGdldCByb290ICgpOiBSb290IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbmFtZSAoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY2FtZXJhcyAoKTogQ2FtZXJhW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jYW1lcmFzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBtYWluTGlnaHQgKCk6IERpcmVjdGlvbmFsTGlnaHQgfCBudWxsIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbWFpbkxpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldCBzcGhlcmVMaWdodHMgKCk6IFNwaGVyZUxpZ2h0W10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zcGhlcmVMaWdodHM7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHNwb3RMaWdodHMgKCk6IFNwb3RMaWdodFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3BvdExpZ2h0cztcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbW9kZWxzICgpOiBNb2RlbFtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWxzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5YgcmF5Y2FzdEFsbENhbnZhcyDlkI7nmoTmo4DmtYvnu5PmnpxcclxuICAgICAqL1xyXG4gICAgZ2V0IHJheVJlc3VsdENhbnZhcyAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+WIHJheWNhc3RBbGxNb2RlbHMg5ZCO55qE5qOA5rWL57uT5p6cXHJcbiAgICAgKi9cclxuICAgIGdldCByYXlSZXN1bHRNb2RlbHMgKCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHRNb2RlbHM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPliByYXljYXN0QWxsIOWQjueahOajgOa1i+e7k+aenFxyXG4gICAgICovXHJcbiAgICBnZXQgcmF5UmVzdWx0QWxsICgpIHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0QWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5YgcmF5Y2FzdFNpbmdsZU1vZGVsIOWQjueahOajgOa1i+e7k+aenFxyXG4gICAgICovXHJcbiAgICBnZXQgcmF5UmVzdWx0U2luZ2xlTW9kZWwgKCkge1xyXG4gICAgICAgIHJldHVybiByZXN1bHRTaW5nbGVNb2RlbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFuZGxlICgpIDogU2NlbmVIYW5kbGUge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2VuZVBvb2xIYW5kbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyByZWdpc3RlckNyZWF0ZUZ1bmMgKHJvb3Q6IFJvb3QpIHtcclxuICAgICAgICByb290Ll9jcmVhdGVTY2VuZUZ1biA9IChfcm9vdDogUm9vdCk6IFJlbmRlclNjZW5lID0+IG5ldyBSZW5kZXJTY2VuZShfcm9vdCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcm9vdDogUm9vdDtcclxuICAgIHByaXZhdGUgX25hbWU6IHN0cmluZyA9ICcnO1xyXG4gICAgcHJpdmF0ZSBfY2FtZXJhczogQ2FtZXJhW10gPSBbXTtcclxuICAgIHByaXZhdGUgX21vZGVsczogTW9kZWxbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfZGlyZWN0aW9uYWxMaWdodHM6IERpcmVjdGlvbmFsTGlnaHRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfc3BoZXJlTGlnaHRzOiBTcGhlcmVMaWdodFtdID0gW107XHJcbiAgICBwcml2YXRlIF9zcG90TGlnaHRzOiBTcG90TGlnaHRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBfbWFpbkxpZ2h0OiBEaXJlY3Rpb25hbExpZ2h0IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9tb2RlbElkOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfc2NlbmVQb29sSGFuZGxlOiBTY2VuZUhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgcHJpdmF0ZSBfbW9kZWxBcnJheUhhbmRsZTogTW9kZWxBcnJheUhhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyb290OiBSb290KSB7XHJcbiAgICAgICAgdGhpcy5fcm9vdCA9IHJvb3Q7XHJcbiAgICAgICAgdGhpcy5fY3JlYXRlSGFuZGxlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUmVuZGVyU2NlbmVJbmZvKTogYm9vbGVhbiB7XHJcbiAgICAgICAgdGhpcy5fbmFtZSA9IGluZm8ubmFtZTtcclxuICAgICAgICB0aGlzLl9jcmVhdGVIYW5kbGVzKCk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZSAoc3RhbXA6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IG1haW5MaWdodCA9IHRoaXMuX21haW5MaWdodDtcclxuICAgICAgICBpZiAobWFpbkxpZ2h0KSB7XHJcbiAgICAgICAgICAgIG1haW5MaWdodC51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHNwaGVyZUxpZ2h0cyA9IHRoaXMuX3NwaGVyZUxpZ2h0cztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwaGVyZUxpZ2h0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBsaWdodCA9IHNwaGVyZUxpZ2h0c1tpXTtcclxuICAgICAgICAgICAgbGlnaHQudXBkYXRlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBzcG90TGlnaHRzID0gdGhpcy5fc3BvdExpZ2h0cztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNwb3RMaWdodHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgbGlnaHQgPSBzcG90TGlnaHRzW2ldO1xyXG4gICAgICAgICAgICBsaWdodC51cGRhdGUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG1vZGVscyA9IHRoaXMuX21vZGVscztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBtb2RlbCA9IG1vZGVsc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlbC5lbmFibGVkKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbC51cGRhdGVUcmFuc2Zvcm0oc3RhbXApO1xyXG4gICAgICAgICAgICAgICAgbW9kZWwudXBkYXRlVUJPcyhzdGFtcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3kgKCkge1xyXG4gICAgICAgIHRoaXMucmVtb3ZlQ2FtZXJhcygpO1xyXG4gICAgICAgIHRoaXMucmVtb3ZlU3BoZXJlTGlnaHRzKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVTcG90TGlnaHRzKCk7XHJcbiAgICAgICAgdGhpcy5yZW1vdmVNb2RlbHMoKTtcclxuICAgICAgICBpZiAodGhpcy5fbW9kZWxBcnJheUhhbmRsZSkge1xyXG4gICAgICAgICAgICBNb2RlbEFycmF5UG9vbC5mcmVlKHRoaXMuX21vZGVsQXJyYXlIYW5kbGUpO1xyXG4gICAgICAgICAgICBTY2VuZVBvb2wuZnJlZSh0aGlzLl9zY2VuZVBvb2xIYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbEFycmF5SGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lUG9vbEhhbmRsZSA9IE5VTExfSEFORExFO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkQ2FtZXJhIChjYW06IENhbWVyYSkge1xyXG4gICAgICAgIGNhbS5hdHRhY2hUb1NjZW5lKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYXMucHVzaChjYW0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDYW1lcmEgKGNhbWVyYTogQ2FtZXJhKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYW1lcmFzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jYW1lcmFzW2ldID09PSBjYW1lcmEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NhbWVyYXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgY2FtZXJhLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDYW1lcmFzICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGNhbWVyYSBvZiB0aGlzLl9jYW1lcmFzKSB7XHJcbiAgICAgICAgICAgIGNhbWVyYS5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY2FtZXJhcy5zcGxpY2UoMCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldE1haW5MaWdodCAoZGw6IERpcmVjdGlvbmFsTGlnaHQpIHtcclxuICAgICAgICB0aGlzLl9tYWluTGlnaHQgPSBkbDtcclxuICAgICAgICBTY2VuZVBvb2wuc2V0KHRoaXMuX3NjZW5lUG9vbEhhbmRsZSwgU2NlbmVWaWV3Lk1BSU5fTElHSFQsIGRsLmhhbmRsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVuc2V0TWFpbkxpZ2h0IChkbDogRGlyZWN0aW9uYWxMaWdodCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9tYWluTGlnaHQgPT09IGRsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRsTGlzdCA9IHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzO1xyXG4gICAgICAgICAgICBpZiAoZGxMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fbWFpbkxpZ2h0ID0gZGxMaXN0W2RsTGlzdC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9tYWluTGlnaHQubm9kZSkgeyAvLyB0cmlnZ2VyIHVwZGF0ZVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX21haW5MaWdodC5ub2RlLmhhc0NoYW5nZWRGbGFncyB8PSBUcmFuc2Zvcm1CaXQuUk9UQVRJT047XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9tYWluTGlnaHQgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGREaXJlY3Rpb25hbExpZ2h0IChkbDogRGlyZWN0aW9uYWxMaWdodCkge1xyXG4gICAgICAgIGRsLmF0dGFjaFRvU2NlbmUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fZGlyZWN0aW9uYWxMaWdodHMucHVzaChkbCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZURpcmVjdGlvbmFsTGlnaHQgKGRsOiBEaXJlY3Rpb25hbExpZ2h0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9kaXJlY3Rpb25hbExpZ2h0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fZGlyZWN0aW9uYWxMaWdodHNbaV0gPT09IGRsKSB7XHJcbiAgICAgICAgICAgICAgICBkbC5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcmVjdGlvbmFsTGlnaHRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU3BoZXJlTGlnaHQgKHBsOiBTcGhlcmVMaWdodCkge1xyXG4gICAgICAgIHBsLmF0dGFjaFRvU2NlbmUodGhpcyk7XHJcbiAgICAgICAgdGhpcy5fc3BoZXJlTGlnaHRzLnB1c2gocGwpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVTcGhlcmVMaWdodCAocGw6IFNwaGVyZUxpZ2h0KSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zcGhlcmVMaWdodHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3NwaGVyZUxpZ2h0c1tpXSA9PT0gcGwpIHtcclxuICAgICAgICAgICAgICAgIHBsLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fc3BoZXJlTGlnaHRzLnNwbGljZShpLCAxKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU3BvdExpZ2h0IChzbDogU3BvdExpZ2h0KSB7XHJcbiAgICAgICAgc2wuYXR0YWNoVG9TY2VuZSh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zcG90TGlnaHRzLnB1c2goc2wpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVTcG90TGlnaHQgKHNsOiBTcG90TGlnaHQpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Nwb3RMaWdodHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3Nwb3RMaWdodHNbaV0gPT09IHNsKSB7XHJcbiAgICAgICAgICAgICAgICBzbC5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3Nwb3RMaWdodHMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVTcGhlcmVMaWdodHMgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3BoZXJlTGlnaHRzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NwaGVyZUxpZ2h0c1tpXS5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc3BoZXJlTGlnaHRzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZVNwb3RMaWdodHMgKCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc3BvdExpZ2h0cy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLl9zcG90TGlnaHRzW2ldLmRldGFjaEZyb21TY2VuZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9zcG90TGlnaHRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZE1vZGVsIChtOiBNb2RlbCkge1xyXG4gICAgICAgIG0uYXR0YWNoVG9TY2VuZSh0aGlzKTtcclxuICAgICAgICB0aGlzLl9tb2RlbHMucHVzaChtKTtcclxuICAgICAgICBNb2RlbEFycmF5UG9vbC5wdXNoKHRoaXMuX21vZGVsQXJyYXlIYW5kbGUsIG0uaGFuZGxlKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlTW9kZWwgKG1vZGVsOiBNb2RlbCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbW9kZWxzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9tb2RlbHNbaV0gPT09IG1vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBtb2RlbC5kZXRhY2hGcm9tU2NlbmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX21vZGVscy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICBNb2RlbEFycmF5UG9vbC5lcmFzZSh0aGlzLl9tb2RlbEFycmF5SGFuZGxlLCBpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVtb3ZlTW9kZWxzICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5fbW9kZWxzKSB7XHJcbiAgICAgICAgICAgIG0uZGV0YWNoRnJvbVNjZW5lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX21vZGVscy5sZW5ndGggPSAwO1xyXG4gICAgICAgIE1vZGVsQXJyYXlQb29sLmNsZWFyKHRoaXMuX21vZGVsQXJyYXlIYW5kbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBvbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG0gb2YgdGhpcy5fbW9kZWxzKSB7XHJcbiAgICAgICAgICAgIG0ub25HbG9iYWxQaXBlbGluZVN0YXRlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVNb2RlbElkICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlbElkKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENhc3QgYSByYXkgaW50byB0aGUgc2NlbmUsIHJlY29yZCBhbGwgdGhlIGludGVyc2VjdGVkIG1vZGVscyBhbmQgdWkyZCBub2RlcyBpbiB0aGUgcmVzdWx0IGFycmF5XHJcbiAgICAgKiBAcGFyYW0gd29ybGRSYXkgdGhlIHRlc3RpbmcgcmF5XHJcbiAgICAgKiBAcGFyYW0gbWFzayB0aGUgbGF5ZXIgbWFzayB0byBmaWx0ZXIgdGhlIG1vZGVsc1xyXG4gICAgICogQHBhcmFtIGRpc3RhbmNlIHRoZSBtYXggZGlzdGFuY2UgLCBJbmZpbml0eSBieSBkZWZhdWx0XHJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuICwgcmF5IGlzIGhpdCBvciBub3RcclxuICAgICAqIEBub3RlIGdldHRlciBvZiB0aGlzLnJheVJlc3VsdEFsbCBjYW4gZ2V0IHJlY2VudGx5IHJlc3VsdFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDkvKDlhaXkuIDmnaHlsITnur/mo4DmtYvlnLrmma/kuK3miYDmnInnmoQgM0Qg5qih5Z6L5ZKMIFVJMkQgTm9kZVxyXG4gICAgICogQHBhcmFtIHdvcmxkUmF5IOS4lueVjOWwhOe6v1xyXG4gICAgICogQHBhcmFtIG1hc2sgbWFzayDnlKjkuo7moIforrDmiYDmnInopoHmo4DmtYvnmoTlsYLvvIzpu5jorqTkuLogRGVmYXVsdCB8IFVJMkRcclxuICAgICAqIEBwYXJhbSBkaXN0YW5jZSDlsITnur/mo4DmtYvnmoTmnIDlpKfot53nprssIOm7mOiupOS4uiBJbmZpbml0eVxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiAsIOWwhOe6v+aYr+WQpuacieWHu+S4rVxyXG4gICAgICogQG5vdGUg6YCa6L+HIHRoaXMucmF5UmVzdWx0QWxsIOWPr+S7peiOt+WPluWIsOacgOi/keeahOe7k+aenFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmF5Y2FzdEFsbCAod29ybGRSYXk6IHJheSwgbWFzayA9IExheWVycy5FbnVtLkRFRkFVTFQgfCBMYXllcnMuRW51bS5VSV8yRCwgZGlzdGFuY2UgPSBJbmZpbml0eSk6IGJvb2xlYW4ge1xyXG4gICAgICAgIGNvbnN0IHJfM2QgPSB0aGlzLnJheWNhc3RBbGxNb2RlbHMod29ybGRSYXksIG1hc2ssIGRpc3RhbmNlKTtcclxuICAgICAgICBjb25zdCByX3VpMmQgPSB0aGlzLnJheWNhc3RBbGxDYW52YXMod29ybGRSYXksIG1hc2ssIGRpc3RhbmNlKTtcclxuICAgICAgICBjb25zdCBpc0hpdCA9IHJfM2QgfHwgcl91aTJkO1xyXG4gICAgICAgIHJlc3VsdEFsbC5sZW5ndGggPSAwO1xyXG4gICAgICAgIGlmIChpc0hpdCkge1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHRBbGwsIHJlc3VsdE1vZGVscyk7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdEFsbCwgcmVzdWx0Q2FudmFzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGlzSGl0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDYXN0IGEgcmF5IGludG8gdGhlIHNjZW5lLCByZWNvcmQgYWxsIHRoZSBpbnRlcnNlY3RlZCBtb2RlbHMgaW4gdGhlIHJlc3VsdCBhcnJheVxyXG4gICAgICogQHBhcmFtIHdvcmxkUmF5IHRoZSB0ZXN0aW5nIHJheVxyXG4gICAgICogQHBhcmFtIG1hc2sgdGhlIGxheWVyIG1hc2sgdG8gZmlsdGVyIHRoZSBtb2RlbHNcclxuICAgICAqIEBwYXJhbSBkaXN0YW5jZSB0aGUgbWF4IGRpc3RhbmNlICwgSW5maW5pdHkgYnkgZGVmYXVsdFxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiAsIHJheSBpcyBoaXQgb3Igbm90XHJcbiAgICAgKiBAbm90ZSBnZXR0ZXIgb2YgdGhpcy5yYXlSZXN1bHRNb2RlbHMgY2FuIGdldCByZWNlbnRseSByZXN1bHRcclxuICAgICAqIEB6aFxyXG4gICAgICog5Lyg5YWl5LiA5p2h5bCE57q/5qOA5rWL5Zy65pmv5Lit5omA5pyJ55qEIDNEIOaooeWei+OAglxyXG4gICAgICogQHBhcmFtIHdvcmxkUmF5IOS4lueVjOWwhOe6v1xyXG4gICAgICogQHBhcmFtIG1hc2sg55So5LqO5qCH6K6w5omA5pyJ6KaB5qOA5rWL55qE5bGC77yM6buY6K6k5Li6IERlZmF1bHRcclxuICAgICAqIEBwYXJhbSBkaXN0YW5jZSDlsITnur/mo4DmtYvnmoTmnIDlpKfot53nprssIOm7mOiupOS4uiBJbmZpbml0eVxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiAsIOWwhOe6v+aYr+WQpuacieWHu+S4rVxyXG4gICAgICogQG5vdGUg6YCa6L+HIHRoaXMucmF5UmVzdWx0TW9kZWxzIOWPr+S7peiOt+WPluWIsOacgOi/keeahOe7k+aenFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmF5Y2FzdEFsbE1vZGVscyAod29ybGRSYXk6IHJheSwgbWFzayA9IExheWVycy5FbnVtLkRFRkFVTFQsIGRpc3RhbmNlID0gSW5maW5pdHkpOiBib29sZWFuIHtcclxuICAgICAgICBwb29sLnJlc2V0KCk7XHJcbiAgICAgICAgZm9yIChjb25zdCBtIG9mIHRoaXMuX21vZGVscykge1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm0gPSBtLnRyYW5zZm9ybTtcclxuICAgICAgICAgICAgaWYgKCF0cmFuc2Zvcm0gfHwgIW0uZW5hYmxlZCB8fCAhKG0ubm9kZS5sYXllciAmIChtYXNrICYgfkxheWVycy5FbnVtLklHTk9SRV9SQVlDQVNUKSkgfHwgIW0ud29ybGRCb3VuZHMpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgLy8gYnJvYWRwaGFzZVxyXG4gICAgICAgICAgICBsZXQgZCA9IGludGVyc2VjdC5yYXlfYWFiYih3b3JsZFJheSwgbS53b3JsZEJvdW5kcyk7XHJcbiAgICAgICAgICAgIGlmIChkIDw9IDAgfHwgZCA+PSBkaXN0YW5jZSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICBpZiAobS50eXBlID09PSBNb2RlbFR5cGUuREVGQVVMVCkge1xyXG4gICAgICAgICAgICAgICAgLy8gdHJhbnNmb3JtIHJheSBiYWNrIHRvIG1vZGVsIHNwYWNlXHJcbiAgICAgICAgICAgICAgICBNYXQ0LmludmVydChtNCwgdHJhbnNmb3JtLmdldFdvcmxkTWF0cml4KG00KSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQobW9kZWxSYXkubywgd29ybGRSYXkubywgbTQpO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUobW9kZWxSYXkuZCwgVmVjMy50cmFuc2Zvcm1NYXQ0Tm9ybWFsKG1vZGVsUmF5LmQsIHdvcmxkUmF5LmQsIG00KSk7XHJcbiAgICAgICAgICAgICAgICBkID0gSW5maW5pdHk7IGNvbnN0IHN1Yk1vZGVscyA9IG0uc3ViTW9kZWxzO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJNb2RlbHMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdWJNZXNoID0gc3ViTW9kZWxzW2ldLnN1Yk1lc2g7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN1Yk1lc2ggJiYgc3ViTWVzaC5nZW9tZXRyaWNJbmZvKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHsgcG9zaXRpb25zOiB2YiwgaW5kaWNlczogaWIsIGRvdWJsZVNpZGVkOiBzaWRlcyB9ID0gc3ViTWVzaC5nZW9tZXRyaWNJbmZvO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuYXJyb3dwaGFzZSh2YiwgaWIhLCBzdWJNZXNoLnByaW1pdGl2ZU1vZGUsIHNpZGVzISwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBkID0gTWF0aC5taW4oZCwgbmFycm93RGlzICogVmVjMy5tdWx0aXBseSh2MywgbW9kZWxSYXkuZCwgdHJhbnNmb3JtLndvcmxkU2NhbGUpLmxlbmd0aCgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGQgPCBkaXN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgciA9IHBvb2wuYWRkKCk7XHJcbiAgICAgICAgICAgICAgICByLm5vZGUgPSBtLm5vZGU7XHJcbiAgICAgICAgICAgICAgICByLmRpc3RhbmNlID0gZDtcclxuICAgICAgICAgICAgICAgIHJlc3VsdE1vZGVsc1twb29sLmxlbmd0aCAtIDFdID0gcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHRNb2RlbHMubGVuZ3RoID0gcG9vbC5sZW5ndGg7XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdE1vZGVscy5sZW5ndGggPiAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBCZWZvcmUgeW91IHJheWNhc3QgdGhlIG1vZGVsLCBtYWtlIHN1cmUgdGhlIG1vZGVsIGlzIG5vdCBudWxsXHJcbiAgICAgKiBAcGFyYW0gd29ybGRSYXkgdGhlIHRlc3RpbmcgcmF5XHJcbiAgICAgKiBAcGFyYW0gbW9kZWwgdGhlIHRlc3RpbmcgbW9kZWxcclxuICAgICAqIEBwYXJhbSBtYXNrIHRoZSBsYXllciBtYXNrIHRvIGZpbHRlciB0aGUgbW9kZWxzXHJcbiAgICAgKiBAcGFyYW0gZGlzdGFuY2UgdGhlIG1heCBkaXN0YW5jZSAsIEluZmluaXR5IGJ5IGRlZmF1bHRcclxuICAgICAqIEByZXR1cm5zIGJvb2xlYW4gLCByYXkgaXMgaGl0IG9yIG5vdFxyXG4gICAgICogQHpoXHJcbiAgICAgKiDkvKDlhaXkuIDmnaHlsITnur/lkozkuIDkuKogM0Qg5qih5Z6L6L+b6KGM5bCE57q/5qOA5rWL44CCXHJcbiAgICAgKiBAcGFyYW0gd29ybGRSYXkg5LiW55WM5bCE57q/XHJcbiAgICAgKiBAcGFyYW0gbW9kZWwg6L+b6KGM5qOA5rWL55qE5qih5Z6LXHJcbiAgICAgKiBAcGFyYW0gbWFzayDnlKjkuo7moIforrDmiYDmnInopoHmo4DmtYvnmoTlsYLvvIzpu5jorqTkuLogRGVmYXVsdFxyXG4gICAgICogQHBhcmFtIGRpc3RhbmNlIOWwhOe6v+ajgOa1i+eahOacgOWkp+i3neemuywg6buY6K6k5Li6IEluZmluaXR5XHJcbiAgICAgKiBAcmV0dXJucyBib29sZWFuICwg5bCE57q/5piv5ZCm5pyJ5Ye75LitXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByYXljYXN0U2luZ2xlTW9kZWwgKHdvcmxkUmF5OiByYXksIG1vZGVsOiBNb2RlbCwgbWFzayA9IExheWVycy5FbnVtLkRFRkFVTFQsIGRpc3RhbmNlID0gSW5maW5pdHkpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoUFJFVklFVykge1xyXG4gICAgICAgICAgICBpZiAobW9kZWwgPT0gbnVsbCkgeyBjb25zb2xlLmVycm9yKCcg5qOA5rWL5YmN6K+35L+d6K+BIG1vZGVsIOS4jeS4uiBudWxsICcpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvb2wucmVzZXQoKTtcclxuICAgICAgICBjb25zdCBtID0gbW9kZWw7XHJcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtID0gbS50cmFuc2Zvcm07XHJcbiAgICAgICAgaWYgKCF0cmFuc2Zvcm0gfHwgIW0uZW5hYmxlZCB8fCAhKG0ubm9kZS5sYXllciAmIChtYXNrICYgfkxheWVycy5FbnVtLklHTk9SRV9SQVlDQVNUKSkgfHwgIW0ud29ybGRCb3VuZHMpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgLy8gYnJvYWRwaGFzZVxyXG4gICAgICAgIGxldCBkID0gaW50ZXJzZWN0LnJheV9hYWJiKHdvcmxkUmF5LCBtLndvcmxkQm91bmRzKTtcclxuICAgICAgICBpZiAoZCA8PSAwIHx8IGQgPj0gZGlzdGFuY2UpIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgaWYgKG0udHlwZSA9PT0gTW9kZWxUeXBlLkRFRkFVTFQpIHtcclxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtIHJheSBiYWNrIHRvIG1vZGVsIHNwYWNlXHJcbiAgICAgICAgICAgIE1hdDQuaW52ZXJ0KG00LCB0cmFuc2Zvcm0uZ2V0V29ybGRNYXRyaXgobTQpKTtcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG1vZGVsUmF5Lm8sIHdvcmxkUmF5Lm8sIG00KTtcclxuICAgICAgICAgICAgVmVjMy5ub3JtYWxpemUobW9kZWxSYXkuZCwgVmVjMy50cmFuc2Zvcm1NYXQ0Tm9ybWFsKG1vZGVsUmF5LmQsIHdvcmxkUmF5LmQsIG00KSk7XHJcbiAgICAgICAgICAgIGQgPSBJbmZpbml0eTsgY29uc3Qgc3ViTW9kZWxzID0gbS5zdWJNb2RlbHM7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3ViTW9kZWxzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzdWJNZXNoID0gc3ViTW9kZWxzW2ldLnN1Yk1lc2g7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3ViTWVzaCAmJiBzdWJNZXNoLmdlb21ldHJpY0luZm8pIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHBvc2l0aW9uczogdmIsIGluZGljZXM6IGliLCBkb3VibGVTaWRlZDogc2lkZXMgfSA9IHN1Yk1lc2guZ2VvbWV0cmljSW5mbztcclxuICAgICAgICAgICAgICAgICAgICBuYXJyb3dwaGFzZSh2YiwgaWIhLCBzdWJNZXNoLnByaW1pdGl2ZU1vZGUsIHNpZGVzISwgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGQgPSBNYXRoLm1pbihkLCBuYXJyb3dEaXMgKiBWZWMzLm11bHRpcGx5KHYzLCBtb2RlbFJheS5kLCB0cmFuc2Zvcm0ud29ybGRTY2FsZSkubGVuZ3RoKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgciA9IHBvb2wuYWRkKCk7XHJcbiAgICAgICAgICAgIHIubm9kZSA9IG0ubm9kZTtcclxuICAgICAgICAgICAgci5kaXN0YW5jZSA9IGQ7XHJcbiAgICAgICAgICAgIHJlc3VsdFNpbmdsZU1vZGVsW3Bvb2wubGVuZ3RoIC0gMV0gPSByO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHRTaW5nbGVNb2RlbC5sZW5ndGggPSBwb29sLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0U2luZ2xlTW9kZWwubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2FzdCBhIHJheSBpbnRvIHRoZSBzY2VuZSwgZGV0ZWN0IGFsbCBjYW52YXMgYW5kIGl0cyBjaGlsZHJlblxyXG4gICAgICogQHBhcmFtIHdvcmxkUmF5IHRoZSB0ZXN0aW5nIHJheVxyXG4gICAgICogQHBhcmFtIG1hc2sgdGhlIGxheWVyIG1hc2sgdG8gZmlsdGVyIGFsbCB1aTJkIGFhYmJcclxuICAgICAqIEBwYXJhbSBkaXN0YW5jZSB0aGUgbWF4IGRpc3RhbmNlICwgSW5maW5pdHkgYnkgZGVmYXVsdFxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiAsIHJheSBpcyBoaXQgb3Igbm90XHJcbiAgICAgKiBAbm90ZSBnZXR0ZXIgb2YgdGhpcy5yYXlSZXN1bHRDYW52YXMgY2FuIGdldCByZWNlbnRseSByZXN1bHRcclxuICAgICAqIEB6aFxyXG4gICAgICog5Lyg5YWl5LiA5p2h5bCE57q/5qOA5rWL5Zy65pmv5Lit5omA5pyJ55qEIENhbnZhcyDku6Xlj4ogQ2FudmFzIOS4i+eahCBOb2RlXHJcbiAgICAgKiBAcGFyYW0gd29ybGRSYXkg5LiW55WM5bCE57q/XHJcbiAgICAgKiBAcGFyYW0gbWFzayDnlKjkuo7moIforrDmiYDmnInopoHmo4DmtYvnmoTlsYLvvIzpu5jorqTkuLogVUlfMkRcclxuICAgICAqIEBwYXJhbSBkaXN0YW5jZSDlsITnur/mo4DmtYvnmoTmnIDlpKfot53nprssIOm7mOiupOS4uiBJbmZpbml0eVxyXG4gICAgICogQHJldHVybnMgYm9vbGVhbiAsIOWwhOe6v+aYr+WQpuacieWHu+S4rVxyXG4gICAgICogQG5vdGUg6YCa6L+HIHRoaXMucmF5UmVzdWx0Q2FudmFzIOWPr+S7peiOt+WPluWIsOacgOi/keeahOe7k+aenFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmF5Y2FzdEFsbENhbnZhcyAod29ybGRSYXk6IHJheSwgbWFzayA9IExheWVycy5FbnVtLlVJXzJELCBkaXN0YW5jZSA9IEluZmluaXR5KTogYm9vbGVhbiB7XHJcbiAgICAgICAgcG9vbFVJLnJlc2V0KCk7XHJcbiAgICAgICAgY29uc3QgY2FudmFzQ29tcyA9IGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjZW5lKCkuZ2V0Q29tcG9uZW50c0luQ2hpbGRyZW4obGVnYWN5Q0MuQ2FudmFzKTtcclxuICAgICAgICBpZiAoY2FudmFzQ29tcyAhPSBudWxsICYmIGNhbnZhc0NvbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbnZhc0NvbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGNhbnZhc05vZGUgPSBjYW52YXNDb21zW2ldLm5vZGU7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FudmFzTm9kZSAhPSBudWxsICYmIGNhbnZhc05vZGUuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmF5Y2FzdFVJMkROb2RlUmVjdXJzaXZlQ2hpbGRyZW4od29ybGRSYXksIGNhbnZhc05vZGUsIG1hc2ssIGRpc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXN1bHRDYW52YXMubGVuZ3RoID0gcG9vbFVJLmxlbmd0aDtcclxuICAgICAgICByZXR1cm4gcmVzdWx0Q2FudmFzLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmF5Y2FzdFVJMkROb2RlICh3b3JsZFJheTogcmF5LCB1aTJkTm9kZTogTm9kZSwgbWFzayA9IExheWVycy5FbnVtLlVJXzJELCBkaXN0YW5jZSA9IEluZmluaXR5KSB7XHJcbiAgICAgICAgaWYgKFBSRVZJRVcpIHtcclxuICAgICAgICAgICAgaWYgKHVpMmROb2RlID09IG51bGwpIHsgY29uc29sZS5lcnJvcignbWFrZSBzdXJlIFVJTm9kZSBpcyBub3QgbnVsbCcpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHVpVHJhbnNmb3JtID0gdWkyZE5vZGUuX3VpUHJvcHMudWlUcmFuc2Zvcm1Db21wO1xyXG4gICAgICAgIGlmICh1aVRyYW5zZm9ybSA9PSBudWxsIHx8IHVpMmROb2RlLmxheWVyICYgTGF5ZXJzLkVudW0uSUdOT1JFX1JBWUNBU1QgfHwgISh1aTJkTm9kZS5sYXllciAmIG1hc2spKSB7IHJldHVybjsgfVxyXG4gICAgICAgIHVpVHJhbnNmb3JtLmdldENvbXB1dGVBQUJCKGFhYmJVSSk7XHJcbiAgICAgICAgY29uc3QgZCA9IGludGVyc2VjdC5yYXlfYWFiYih3b3JsZFJheSwgYWFiYlVJKTtcclxuXHJcbiAgICAgICAgaWYgKGQgPD0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmIChkIDwgZGlzdGFuY2UpIHtcclxuICAgICAgICAgICAgY29uc3QgciA9IHBvb2xVSS5hZGQoKTtcclxuICAgICAgICAgICAgci5ub2RlID0gdWkyZE5vZGU7XHJcbiAgICAgICAgICAgIHIuZGlzdGFuY2UgPSBkO1xyXG4gICAgICAgICAgICByZXR1cm4gcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfcmF5Y2FzdFVJMkROb2RlUmVjdXJzaXZlQ2hpbGRyZW4gKHdvcmxkUmF5OiByYXksIHBhcmVudDogTm9kZSwgbWFzayA9IExheWVycy5FbnVtLlVJXzJELCBkaXN0YW5jZSA9IEluZmluaXR5KSB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fcmF5Y2FzdFVJMkROb2RlKHdvcmxkUmF5LCBwYXJlbnQsIG1hc2ssIGRpc3RhbmNlKTtcclxuICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgcmVzdWx0Q2FudmFzW3Bvb2xVSS5sZW5ndGggLSAxXSA9IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIHBhcmVudC5jaGlsZHJlbikge1xyXG4gICAgICAgICAgICBpZiAobm9kZSAhPSBudWxsICYmIG5vZGUuYWN0aXZlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yYXljYXN0VUkyRE5vZGVSZWN1cnNpdmVDaGlsZHJlbih3b3JsZFJheSwgbm9kZSwgbWFzaywgZGlzdGFuY2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NyZWF0ZUhhbmRsZXMgKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5fbW9kZWxBcnJheUhhbmRsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbEFycmF5SGFuZGxlID0gTW9kZWxBcnJheVBvb2wuYWxsb2MoKTtcclxuICAgICAgICAgICAgdGhpcy5fc2NlbmVQb29sSGFuZGxlID0gU2NlbmVQb29sLmFsbG9jKCk7XHJcbiAgICAgICAgICAgIFNjZW5lUG9vbC5zZXQodGhpcy5fc2NlbmVQb29sSGFuZGxlLCBTY2VuZVZpZXcuTU9ERUxfQVJSQVksIHRoaXMuX21vZGVsQXJyYXlIYW5kbGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgbW9kZWxSYXkgPSByYXkuY3JlYXRlKCk7XHJcbmNvbnN0IHYzID0gbmV3IFZlYzMoKTtcclxuY29uc3QgbTQgPSBuZXcgTWF0NCgpO1xyXG5sZXQgbmFycm93RGlzID0gSW5maW5pdHk7XHJcbmNvbnN0IHRyaSA9IHRyaWFuZ2xlLmNyZWF0ZSgpO1xyXG5jb25zdCBwb29sID0gbmV3IFJlY3ljbGVQb29sPElSYXljYXN0UmVzdWx0PigoKSA9PiB7XHJcbiAgICByZXR1cm4geyBub2RlOiBudWxsISwgZGlzdGFuY2U6IEluZmluaXR5IH07XHJcbn0sIDgpO1xyXG5jb25zdCByZXN1bHRNb2RlbHM6IElSYXljYXN0UmVzdWx0W10gPSBbXTtcclxuLyoqIENhbnZhcyByYXljYXN0IHJlc3VsdCBwb29sICovXHJcbmNvbnN0IGFhYmJVSSA9IG5ldyBhYWJiKCk7XHJcbmNvbnN0IHBvb2xVSSA9IG5ldyBSZWN5Y2xlUG9vbDxJUmF5Y2FzdFJlc3VsdD4oKCkgPT4ge1xyXG4gICAgcmV0dXJuIHsgbm9kZTogbnVsbCEsIGRpc3RhbmNlOiBJbmZpbml0eSB9O1xyXG59LCA4KTtcclxuY29uc3QgcmVzdWx0Q2FudmFzOiBJUmF5Y2FzdFJlc3VsdFtdID0gW107XHJcbi8qKiByYXljYXN0IGFsbCAqL1xyXG5jb25zdCByZXN1bHRBbGw6IElSYXljYXN0UmVzdWx0W10gPSBbXTtcclxuLyoqIHJheWNhc3Qgc2luZ2xlIG1vZGVsICovXHJcbmNvbnN0IHJlc3VsdFNpbmdsZU1vZGVsOiBJUmF5Y2FzdFJlc3VsdFtdID0gW107XHJcblxyXG5jb25zdCBuYXJyb3dwaGFzZSA9ICh2YjogRmxvYXQzMkFycmF5LCBpYjogSUJBcnJheSwgcG06IEdGWFByaW1pdGl2ZU1vZGUsIHNpZGVzOiBib29sZWFuLCBkaXN0YW5jZSA9IEluZmluaXR5KSA9PiB7XHJcbiAgICBuYXJyb3dEaXMgPSBkaXN0YW5jZTtcclxuICAgIGlmIChwbSA9PT0gR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9MSVNUKSB7XHJcbiAgICAgICAgY29uc3QgY250ID0gaWIubGVuZ3RoO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY250OyBqICs9IDMpIHtcclxuICAgICAgICAgICAgY29uc3QgaTAgPSBpYltqXSAqIDM7XHJcbiAgICAgICAgICAgIGNvbnN0IGkxID0gaWJbaiArIDFdICogMztcclxuICAgICAgICAgICAgY29uc3QgaTIgPSBpYltqICsgMl0gKiAzO1xyXG4gICAgICAgICAgICBWZWMzLnNldCh0cmkuYSwgdmJbaTBdLCB2YltpMCArIDFdLCB2YltpMCArIDJdKTtcclxuICAgICAgICAgICAgVmVjMy5zZXQodHJpLmIsIHZiW2kxXSwgdmJbaTEgKyAxXSwgdmJbaTEgKyAyXSk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5jLCB2YltpMl0sIHZiW2kyICsgMV0sIHZiW2kyICsgMl0pO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gaW50ZXJzZWN0LnJheV90cmlhbmdsZShtb2RlbFJheSwgdHJpLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIGlmIChkaXN0IDw9IDAgfHwgZGlzdCA+PSBuYXJyb3dEaXMpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgbmFycm93RGlzID0gZGlzdDtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHBtID09PSBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX1NUUklQKSB7XHJcbiAgICAgICAgY29uc3QgY250ID0gaWIubGVuZ3RoIC0gMjtcclxuICAgICAgICBsZXQgcmV2ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNudDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkwID0gaWJbaiAtIHJldl0gKiAzO1xyXG4gICAgICAgICAgICBjb25zdCBpMSA9IGliW2ogKyByZXYgKyAxXSAqIDM7XHJcbiAgICAgICAgICAgIGNvbnN0IGkyID0gaWJbaiArIDJdICogMztcclxuICAgICAgICAgICAgVmVjMy5zZXQodHJpLmEsIHZiW2kwXSwgdmJbaTAgKyAxXSwgdmJbaTAgKyAyXSk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5iLCB2YltpMV0sIHZiW2kxICsgMV0sIHZiW2kxICsgMl0pO1xyXG4gICAgICAgICAgICBWZWMzLnNldCh0cmkuYywgdmJbaTJdLCB2YltpMiArIDFdLCB2YltpMiArIDJdKTtcclxuICAgICAgICAgICAgcmV2ID0gfnJldjtcclxuICAgICAgICAgICAgY29uc3QgZGlzdCA9IGludGVyc2VjdC5yYXlfdHJpYW5nbGUobW9kZWxSYXksIHRyaSwgc2lkZXMpO1xyXG4gICAgICAgICAgICBpZiAoZGlzdCA8PSAwIHx8IGRpc3QgPj0gbmFycm93RGlzKSB7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgIG5hcnJvd0RpcyA9IGRpc3Q7XHJcbiAgICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChwbSA9PT0gR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9GQU4pIHtcclxuICAgICAgICBjb25zdCBjbnQgPSBpYi5sZW5ndGggLSAxO1xyXG4gICAgICAgIGNvbnN0IGkwID0gaWJbMF0gKiAzO1xyXG4gICAgICAgIFZlYzMuc2V0KHRyaS5hLCB2YltpMF0sIHZiW2kwICsgMV0sIHZiW2kwICsgMl0pO1xyXG4gICAgICAgIGZvciAobGV0IGogPSAxOyBqIDwgY250OyBqICs9IDEpIHtcclxuICAgICAgICAgICAgY29uc3QgaTEgPSBpYltqXSAqIDM7XHJcbiAgICAgICAgICAgIGNvbnN0IGkyID0gaWJbaiArIDFdICogMztcclxuICAgICAgICAgICAgVmVjMy5zZXQodHJpLmIsIHZiW2kxXSwgdmJbaTEgKyAxXSwgdmJbaTEgKyAyXSk7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5jLCB2YltpMl0sIHZiW2kyICsgMV0sIHZiW2kyICsgMl0pO1xyXG4gICAgICAgICAgICBjb25zdCBkaXN0ID0gaW50ZXJzZWN0LnJheV90cmlhbmdsZShtb2RlbFJheSwgdHJpLCBzaWRlcyk7XHJcbiAgICAgICAgICAgIGlmIChkaXN0IDw9IDAgfHwgZGlzdCA+PSBuYXJyb3dEaXMpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgbmFycm93RGlzID0gZGlzdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn07XHJcbiJdfQ==