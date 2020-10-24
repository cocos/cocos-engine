(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./3d/builtin/index.js", "./memop/index.js", "./pipeline/index.js", "./renderer/scene/index.js", "./renderer/data-pool-manager.js", "./renderer/scene/light.js", "./renderer/scene/render-scene.js", "./renderer/ui/ui.js", "./global-exports.js", "./renderer/core/render-window.js", "./gfx/index.js", "./renderer/core/memory-pools.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./3d/builtin/index.js"), require("./memop/index.js"), require("./pipeline/index.js"), require("./renderer/scene/index.js"), require("./renderer/data-pool-manager.js"), require("./renderer/scene/light.js"), require("./renderer/scene/render-scene.js"), require("./renderer/ui/ui.js"), require("./global-exports.js"), require("./renderer/core/render-window.js"), require("./gfx/index.js"), require("./renderer/core/memory-pools.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.index, global.index, global.index, global.dataPoolManager, global.light, global.renderScene, global.ui, global.globalExports, global.renderWindow, global.index, global.memoryPools);
    global.root = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _index2, _index3, _index4, _dataPoolManager, _light, _renderScene, _ui, _globalExports, _renderWindow, _index5, _memoryPools) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Root = void 0;

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @zh
   * Root类
   */
  var Root = /*#__PURE__*/function () {
    _createClass(Root, [{
      key: "device",

      /**
       * @zh
       * GFX设备
       */
      get: function get() {
        return this._device;
      }
      /**
       * @zh
       * 主窗口
       */

    }, {
      key: "mainWindow",
      get: function get() {
        return this._mainWindow;
      }
      /**
       * @zh
       * 当前窗口
       */

    }, {
      key: "curWindow",
      set: function set(window) {
        this._curWindow = window;
      },
      get: function get() {
        return this._curWindow;
      }
      /**
       * @zh
       * 临时窗口（用于数据传输）
       */

    }, {
      key: "tempWindow",
      set: function set(window) {
        this._tempWindow = window;
      },
      get: function get() {
        return this._tempWindow;
      }
      /**
       * @zh
       * 窗口列表
       */

    }, {
      key: "windows",
      get: function get() {
        return this._windows;
      }
      /**
       * @zh
       * 渲染管线
       */

    }, {
      key: "pipeline",
      get: function get() {
        return this._pipeline;
      }
      /**
       * @zh
       * UI实例
       */

    }, {
      key: "ui",
      get: function get() {
        return this._ui;
      }
      /**
       * @zh
       * 场景列表
       */

    }, {
      key: "scenes",
      get: function get() {
        return this._scenes;
      }
      /**
       * @zh
       * 累计时间（秒）
       */

    }, {
      key: "cumulativeTime",
      get: function get() {
        return _memoryPools.RootPool.get(this._poolHandle, _memoryPools.RootView.CUMULATIVE_TIME);
      }
      /**
       * @zh
       * 帧时间（秒）
       */

    }, {
      key: "frameTime",
      get: function get() {
        return _memoryPools.RootPool.get(this._poolHandle, _memoryPools.RootView.FRAME_TIME);
      }
      /**
       * @zh
       * 一秒内的累计帧数
       */

    }, {
      key: "frameCount",
      get: function get() {
        return this._frameCount;
      }
      /**
       * @zh
       * 每秒帧率
       */

    }, {
      key: "fps",
      get: function get() {
        return this._fps;
      }
      /**
       * @zh
       * 每秒固定帧率
       */

    }, {
      key: "fixedFPS",
      set: function set(fps) {
        if (fps > 0) {
          this._fixedFPS = fps;
          this._fixedFPSFrameTime = 1000.0 / fps;
        } else {
          this._fixedFPSFrameTime = 0;
        }
      },
      get: function get() {
        return this._fixedFPS;
      }
    }, {
      key: "dataPoolManager",
      get: function get() {
        return this._dataPoolMgr;
      }
    }, {
      key: "handle",
      get: function get() {
        return this._poolHandle;
      }
    }]);

    /**
     * 构造函数
     * @param device GFX设备
     */
    function Root(device) {
      var _this = this;

      _classCallCheck(this, Root);

      this._createSceneFun = null;
      this._createWindowFun = null;
      this._device = void 0;
      this._windows = [];
      this._mainWindow = null;
      this._curWindow = null;
      this._tempWindow = null;
      this._pipeline = null;
      this._ui = null;
      this._dataPoolMgr = void 0;
      this._scenes = [];
      this._cameras = [];
      this._views = [];
      this._modelPools = new Map();
      this._cameraPool = null;
      this._lightPools = new Map();
      this._fpsTime = 0;
      this._frameCount = 0;
      this._fps = 0;
      this._fixedFPS = 0;
      this._fixedFPSFrameTime = 0;
      this._poolHandle = _memoryPools.NULL_HANDLE;
      this._device = device;
      this._dataPoolMgr = new _dataPoolManager.DataPoolManager(device);

      _renderScene.RenderScene.registerCreateFunc(this);

      _renderWindow.RenderWindow.registerCreateFunc(this);

      this._cameraPool = new _index2.Pool(function () {
        return new _index4.Camera(_this._device);
      }, 4);
    }
    /**
     * @zh
     * 初始化函数
     * @param info Root描述信息
     */


    _createClass(Root, [{
      key: "initialize",
      value: function initialize(info) {
        var _this2 = this;

        this._poolHandle = _memoryPools.RootPool.alloc();
        var colorAttachment = new _index5.GFXColorAttachment();
        var depthStencilAttachment = new _index5.GFXDepthStencilAttachment();
        depthStencilAttachment.depthStoreOp = _index5.GFXStoreOp.DISCARD;
        depthStencilAttachment.stencilStoreOp = _index5.GFXStoreOp.DISCARD;
        var renderPassInfo = new _index5.GFXRenderPassInfo([colorAttachment], depthStencilAttachment);
        this._mainWindow = this.createWindow({
          title: 'rootMainWindow',
          width: this._device.width,
          height: this._device.height,
          renderPassInfo: renderPassInfo,
          swapchainBufferIndices: -1 // always on screen

        });
        this._curWindow = this._mainWindow;

        _index.builtinResMgr.initBuiltinRes(this._device);

        _globalExports.legacyCC.view.on('design-resolution-changed', function () {
          var width = _globalExports.legacyCC.game.canvas.width;
          var height = _globalExports.legacyCC.game.canvas.height;

          _this2.resize(width, height);
        }, this);

        return true;
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.clearCameras();
        this.destroyScenes();

        if (this._pipeline) {
          this._pipeline.destroy();

          this._pipeline = null;
        }

        if (this._ui) {
          this._ui.destroy();

          this._ui = null;
        }

        this._curWindow = null;
        this._mainWindow = null;
        this.dataPoolManager.clear();

        if (this._poolHandle) {
          _memoryPools.RootPool.free(this._poolHandle);

          this._poolHandle = _memoryPools.NULL_HANDLE;
        }
      }
      /**
       * @zh
       * 重置大小
       * @param width 屏幕宽度
       * @param height 屏幕高度
       */

    }, {
      key: "resize",
      value: function resize(width, height) {
        // const w = width / cc.view._devicePixelRatio;
        // const h = height / cc.view._devicePixelRatio;
        this._device.resize(width, height);

        this._mainWindow.resize(width, height);

        var _iterator = _createForOfIteratorHelper(this._windows),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var window = _step.value;

            if (window.shouldSyncSizeWithSwapchain) {
              window.resize(width, height);
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        var _iterator2 = _createForOfIteratorHelper(this._cameras),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var camera = _step2.value;

            if (camera.isWindowSize) {
              camera.resize(width, height);
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    }, {
      key: "setRenderPipeline",
      value: function setRenderPipeline(rppl) {
        if (!rppl) {
          rppl = this.createDefaultPipeline();
        }

        this._pipeline = rppl;

        if (!this._pipeline.activate()) {
          return false;
        }

        this.onGlobalPipelineStateChanged();
        this._ui = new _ui.UI(this);

        if (!this._ui.initialize()) {
          this.destroy();
          return false;
        }

        return true;
      }
    }, {
      key: "createDefaultPipeline",
      value: function createDefaultPipeline() {
        var rppl = new _index3.ForwardPipeline();
        rppl.initialize({
          flows: []
        });
        return rppl;
      }
    }, {
      key: "onGlobalPipelineStateChanged",
      value: function onGlobalPipelineStateChanged() {
        for (var i = 0; i < this._cameras.length; i++) {
          this._cameras[i].view.onGlobalPipelineStateChanged();
        }

        for (var _i = 0; _i < this._scenes.length; _i++) {
          this._scenes[_i].onGlobalPipelineStateChanged();
        }
      }
      /**
       * @zh
       * 激活指定窗口为当前窗口
       * @param window GFX窗口
       */

    }, {
      key: "activeWindow",
      value: function activeWindow(window) {
        this._curWindow = window;
      }
      /**
       * @zh
       * 重置累计时间
       */

    }, {
      key: "resetCumulativeTime",
      value: function resetCumulativeTime() {
        _memoryPools.RootPool.set(this._poolHandle, _memoryPools.RootView.CUMULATIVE_TIME, 0);
      }
      /**
       * @zh
       * 每帧执行函数
       * @param deltaTime 间隔时间
       */

    }, {
      key: "frameMove",
      value: function frameMove(deltaTime) {
        _memoryPools.RootPool.set(this._poolHandle, _memoryPools.RootView.FRAME_TIME, deltaTime);
        /*
        if (this._fixedFPSFrameTime > 0) {
              const elapsed = this._frameTime * 1000.0;
            if (this._fixedFPSFrameTime > elapsed) {
                // tslint:disable-next-line: only-arrow-functions
                setTimeout(function () {}, this._fixedFPSFrameTime - elapsed);
            }
        }
        */


        ++this._frameCount;

        _memoryPools.RootPool.set(this._poolHandle, _memoryPools.RootView.CUMULATIVE_TIME, _memoryPools.RootPool.get(this._poolHandle, _memoryPools.RootView.CUMULATIVE_TIME) + deltaTime);

        this._fpsTime += deltaTime;

        if (this._fpsTime > 1.0) {
          this._fps = this._frameCount;
          this._frameCount = 0;
          this._fpsTime = 0.0;
        }

        if (this._pipeline) {
          this._device.acquire();

          this._views.length = 0;
          var views = this._cameras;

          var stamp = _globalExports.legacyCC.director.getTotalFrames();

          for (var i = 0; i < views.length; i++) {
            var camera = this._cameras[i];
            var view = camera.view;

            if (view.isEnable && view.window) {
              camera.update();
              camera.scene.update(stamp);

              this._views.push(view);
            }
          }

          this._pipeline.render(this._views);

          this._device.present();
        }
      }
      /**
       * @zh
       * 创建窗口
       * @param info GFX窗口描述信息
       */

    }, {
      key: "createWindow",
      value: function createWindow(info) {
        var window = this._createWindowFun(this);

        window.initialize(this.device, info);

        this._windows.push(window);

        return window;
      }
      /**
       * @zh
       * 销毁指定的窗口
       * @param window GFX窗口
       */

    }, {
      key: "destroyWindow",
      value: function destroyWindow(window) {
        for (var i = 0; i < this._windows.length; ++i) {
          if (this._windows[i] === window) {
            window.destroy();

            this._windows.splice(i, 1);

            return;
          }
        }
      }
      /**
       * @zh
       * 销毁全部窗口
       */

    }, {
      key: "destroyWindows",
      value: function destroyWindows() {
        var _iterator3 = _createForOfIteratorHelper(this._windows),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var window = _step3.value;
            window.destroy();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }

        this._windows = [];
      }
      /**
       * @zh
       * 创建渲染场景
       * @param info 渲染场景描述信息
       */

    }, {
      key: "createScene",
      value: function createScene(info) {
        var scene = this._createSceneFun(this);

        scene.initialize(info);

        this._scenes.push(scene);

        return scene;
      }
      /**
       * @zh
       * 销毁指定的渲染场景
       * @param scene 渲染场景
       */

    }, {
      key: "destroyScene",
      value: function destroyScene(scene) {
        for (var i = 0; i < this._scenes.length; ++i) {
          if (this._scenes[i] === scene) {
            scene.destroy();

            this._scenes.splice(i, 1);

            return;
          }
        }
      }
      /**
       * @zh
       * 销毁全部场景
       */

    }, {
      key: "destroyScenes",
      value: function destroyScenes() {
        var _iterator4 = _createForOfIteratorHelper(this._scenes),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var scene = _step4.value;
            scene.destroy();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }

        this._scenes = [];
      }
      /**
       * @zh
       * 创建渲染视图
       * @param info 渲染视图描述信息
       */

    }, {
      key: "createView",
      value: function createView(info) {
        var view = new _index3.RenderView();
        view.initialize(info);
        return view;
      }
      /**
       * @zh
       * 添加渲染相机
       * @param camera 渲染相机
       */

    }, {
      key: "attachCamera",
      value: function attachCamera(camera) {
        for (var i = 0; i < this._cameras.length; i++) {
          if (this._cameras[i] === camera) {
            return;
          }
        }

        this._cameras.push(camera);

        this.sortViews();
      }
      /**
       * @zh
       * 移除渲染相机
       * @param camera 相机
       */

    }, {
      key: "detachCamera",
      value: function detachCamera(camera) {
        for (var i = 0; i < this._cameras.length; ++i) {
          if (this._cameras[i] === camera) {
            this._cameras.splice(i, 1);

            return;
          }
        }
      }
      /**
       * @zh
       * 销毁全部渲染相机
       */

    }, {
      key: "clearCameras",
      value: function clearCameras() {
        this._cameras.length = 0;
      }
    }, {
      key: "createModel",
      value: function createModel(mClass) {
        var p = this._modelPools.get(mClass);

        if (!p) {
          this._modelPools.set(mClass, new _index2.Pool(function () {
            return new mClass();
          }, 10));

          p = this._modelPools.get(mClass);
        }

        var model = p.alloc();
        model.initialize();
        return model;
      }
    }, {
      key: "destroyModel",
      value: function destroyModel(m) {
        var p = this._modelPools.get(m.constructor);

        if (p) {
          p.free(m);
          m.destroy();

          if (m.scene) {
            m.scene.removeModel(m);
          }
        } else {
          console.warn("'".concat(m.constructor.name, "'is not in the model pool and cannot be destroyed by destroyModel."));
        }
      }
    }, {
      key: "createCamera",
      value: function createCamera() {
        return this._cameraPool.alloc();
      }
    }, {
      key: "destroyCamera",
      value: function destroyCamera(c) {
        this._cameraPool.free(c);

        c.destroy();

        if (c.scene) {
          c.scene.removeCamera(c);
        }

        c.isWindowSize = true;
      }
    }, {
      key: "createLight",
      value: function createLight(lClass) {
        var l = this._lightPools.get(lClass);

        if (!l) {
          this._lightPools.set(lClass, new _index2.Pool(function () {
            return new lClass();
          }, 4));

          l = this._lightPools.get(lClass);
        }

        var light = l.alloc();
        light.initialize();
        return light;
      }
    }, {
      key: "destroyLight",
      value: function destroyLight(l) {
        var p = this._lightPools.get(l.constructor);

        l.destroy();

        if (p) {
          p.free(l);

          if (l.scene) {
            switch (l.type) {
              case _light.LightType.SPHERE:
                l.scene.removeSphereLight(l);
                break;

              case _light.LightType.SPOT:
                l.scene.removeSpotLight(l);
                break;
            }
          }
        }
      }
    }, {
      key: "sortViews",
      value: function sortViews() {
        this._cameras.sort(function (a, b) {
          return a.view.priority - b.view.priority;
        });
      }
    }]);

    return Root;
  }();

  _exports.Root = Root;
  _globalExports.legacyCC.Root = Root;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcm9vdC50cyJdLCJuYW1lcyI6WyJSb290IiwiX2RldmljZSIsIl9tYWluV2luZG93Iiwid2luZG93IiwiX2N1cldpbmRvdyIsIl90ZW1wV2luZG93IiwiX3dpbmRvd3MiLCJfcGlwZWxpbmUiLCJfdWkiLCJfc2NlbmVzIiwiUm9vdFBvb2wiLCJnZXQiLCJfcG9vbEhhbmRsZSIsIlJvb3RWaWV3IiwiQ1VNVUxBVElWRV9USU1FIiwiRlJBTUVfVElNRSIsIl9mcmFtZUNvdW50IiwiX2ZwcyIsImZwcyIsIl9maXhlZEZQUyIsIl9maXhlZEZQU0ZyYW1lVGltZSIsIl9kYXRhUG9vbE1nciIsImRldmljZSIsIl9jcmVhdGVTY2VuZUZ1biIsIl9jcmVhdGVXaW5kb3dGdW4iLCJfY2FtZXJhcyIsIl92aWV3cyIsIl9tb2RlbFBvb2xzIiwiTWFwIiwiX2NhbWVyYVBvb2wiLCJfbGlnaHRQb29scyIsIl9mcHNUaW1lIiwiTlVMTF9IQU5ETEUiLCJEYXRhUG9vbE1hbmFnZXIiLCJSZW5kZXJTY2VuZSIsInJlZ2lzdGVyQ3JlYXRlRnVuYyIsIlJlbmRlcldpbmRvdyIsIlBvb2wiLCJDYW1lcmEiLCJpbmZvIiwiYWxsb2MiLCJjb2xvckF0dGFjaG1lbnQiLCJHRlhDb2xvckF0dGFjaG1lbnQiLCJkZXB0aFN0ZW5jaWxBdHRhY2htZW50IiwiR0ZYRGVwdGhTdGVuY2lsQXR0YWNobWVudCIsImRlcHRoU3RvcmVPcCIsIkdGWFN0b3JlT3AiLCJESVNDQVJEIiwic3RlbmNpbFN0b3JlT3AiLCJyZW5kZXJQYXNzSW5mbyIsIkdGWFJlbmRlclBhc3NJbmZvIiwiY3JlYXRlV2luZG93IiwidGl0bGUiLCJ3aWR0aCIsImhlaWdodCIsInN3YXBjaGFpbkJ1ZmZlckluZGljZXMiLCJidWlsdGluUmVzTWdyIiwiaW5pdEJ1aWx0aW5SZXMiLCJsZWdhY3lDQyIsInZpZXciLCJvbiIsImdhbWUiLCJjYW52YXMiLCJyZXNpemUiLCJjbGVhckNhbWVyYXMiLCJkZXN0cm95U2NlbmVzIiwiZGVzdHJveSIsImRhdGFQb29sTWFuYWdlciIsImNsZWFyIiwiZnJlZSIsInNob3VsZFN5bmNTaXplV2l0aFN3YXBjaGFpbiIsImNhbWVyYSIsImlzV2luZG93U2l6ZSIsInJwcGwiLCJjcmVhdGVEZWZhdWx0UGlwZWxpbmUiLCJhY3RpdmF0ZSIsIm9uR2xvYmFsUGlwZWxpbmVTdGF0ZUNoYW5nZWQiLCJVSSIsImluaXRpYWxpemUiLCJGb3J3YXJkUGlwZWxpbmUiLCJmbG93cyIsImkiLCJsZW5ndGgiLCJzZXQiLCJkZWx0YVRpbWUiLCJhY3F1aXJlIiwidmlld3MiLCJzdGFtcCIsImRpcmVjdG9yIiwiZ2V0VG90YWxGcmFtZXMiLCJpc0VuYWJsZSIsInVwZGF0ZSIsInNjZW5lIiwicHVzaCIsInJlbmRlciIsInByZXNlbnQiLCJzcGxpY2UiLCJSZW5kZXJWaWV3Iiwic29ydFZpZXdzIiwibUNsYXNzIiwicCIsIm1vZGVsIiwibSIsImNvbnN0cnVjdG9yIiwicmVtb3ZlTW9kZWwiLCJjb25zb2xlIiwid2FybiIsIm5hbWUiLCJjIiwicmVtb3ZlQ2FtZXJhIiwibENsYXNzIiwibCIsImxpZ2h0IiwidHlwZSIsIkxpZ2h0VHlwZSIsIlNQSEVSRSIsInJlbW92ZVNwaGVyZUxpZ2h0IiwiU1BPVCIsInJlbW92ZVNwb3RMaWdodCIsInNvcnQiLCJhIiwiYiIsInByaW9yaXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFDQTs7OztNQUlhQSxJOzs7O0FBRVQ7Ozs7MEJBSWdDO0FBQzVCLGVBQU8sS0FBS0MsT0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSThDO0FBQzFDLGVBQU8sS0FBS0MsV0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7d0JBSXNCQyxNLEVBQTZCO0FBQy9DLGFBQUtDLFVBQUwsR0FBa0JELE1BQWxCO0FBQ0gsTzswQkFFNEM7QUFDekMsZUFBTyxLQUFLQyxVQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt3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QkQsQ0FBQyxDQUFDOUQsSUFBRixDQUFPK0QsUUFBaEM7QUFDSCxTQUZEO0FBR0g7Ozs7Ozs7QUFHTGhFLDBCQUFTMUQsSUFBVCxHQUFnQkEsSUFBaEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBidWlsdGluUmVzTWdyIH0gZnJvbSAnLi8zZC9idWlsdGluJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlIH0gZnJvbSAnLi9nZngvZGV2aWNlJztcclxuaW1wb3J0IHsgUG9vbCB9IGZyb20gJy4vbWVtb3AnO1xyXG5pbXBvcnQgeyBSZW5kZXJQaXBlbGluZSwgRm9yd2FyZFBpcGVsaW5lLCBSZW5kZXJWaWV3ICB9IGZyb20gJy4vcGlwZWxpbmUnO1xyXG5pbXBvcnQgeyBJUmVuZGVyVmlld0luZm8gfSBmcm9tICcuL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IENhbWVyYSwgTGlnaHQsIE1vZGVsIH0gZnJvbSAnLi9yZW5kZXJlci9zY2VuZSc7XHJcbmltcG9ydCB7IERhdGFQb29sTWFuYWdlciB9IGZyb20gJy4vcmVuZGVyZXIvZGF0YS1wb29sLW1hbmFnZXInO1xyXG5pbXBvcnQgeyBMaWdodFR5cGUgfSBmcm9tICcuL3JlbmRlcmVyL3NjZW5lL2xpZ2h0JztcclxuaW1wb3J0IHsgSVJlbmRlclNjZW5lSW5mbywgUmVuZGVyU2NlbmUgfSBmcm9tICcuL3JlbmRlcmVyL3NjZW5lL3JlbmRlci1zY2VuZSc7XHJcbmltcG9ydCB7IFNwaGVyZUxpZ2h0IH0gZnJvbSAnLi9yZW5kZXJlci9zY2VuZS9zcGhlcmUtbGlnaHQnO1xyXG5pbXBvcnQgeyBTcG90TGlnaHQgfSBmcm9tICcuL3JlbmRlcmVyL3NjZW5lL3Nwb3QtbGlnaHQnO1xyXG5pbXBvcnQgeyBVSSB9IGZyb20gJy4vcmVuZGVyZXIvdWkvdWknO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBSZW5kZXJXaW5kb3csIElSZW5kZXJXaW5kb3dJbmZvIH0gZnJvbSAnLi9yZW5kZXJlci9jb3JlL3JlbmRlci13aW5kb3cnO1xyXG5pbXBvcnQgeyBHRlhDb2xvckF0dGFjaG1lbnQsIEdGWERlcHRoU3RlbmNpbEF0dGFjaG1lbnQsIEdGWFJlbmRlclBhc3NJbmZvLCBHRlhTdG9yZU9wIH0gZnJvbSAnLi9nZngnO1xyXG5pbXBvcnQgeyBSb290SGFuZGxlLCBSb290UG9vbCwgUm9vdFZpZXcsIE5VTExfSEFORExFIH0gZnJvbSAnLi9yZW5kZXJlci9jb3JlL21lbW9yeS1wb29scyc7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIFJvb3Tmj4/ov7Dkv6Hmga9cclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVJvb3RJbmZvIHtcclxuICAgIGVuYWJsZUhEUj86IGJvb2xlYW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5Zy65pmv5o+P6L+w5L+h5oGvXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElTY2VuZUluZm8ge1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIFJvb3TnsbtcclxuICovXHJcbmV4cG9ydCBjbGFzcyBSb290IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICogR0ZY6K6+5aSHXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgZGV2aWNlICgpOiBHRlhEZXZpY2Uge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS4u+eql+WPo1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IG1haW5XaW5kb3cgKCk6IFJlbmRlcldpbmRvdyB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9tYWluV2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY3nqpflj6NcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldCBjdXJXaW5kb3cgKHdpbmRvdzogUmVuZGVyV2luZG93IHwgbnVsbCkge1xyXG4gICAgICAgIHRoaXMuX2N1cldpbmRvdyA9IHdpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IGN1cldpbmRvdyAoKTogUmVuZGVyV2luZG93IHwgbnVsbCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2N1cldpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Li05pe256qX5Y+j77yI55So5LqO5pWw5o2u5Lyg6L6T77yJXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgdGVtcFdpbmRvdyAod2luZG93OiBSZW5kZXJXaW5kb3cgfCBudWxsKSB7XHJcbiAgICAgICAgdGhpcy5fdGVtcFdpbmRvdyA9IHdpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2V0IHRlbXBXaW5kb3cgKCk6IFJlbmRlcldpbmRvdyB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90ZW1wV2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnqpflj6PliJfooahcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB3aW5kb3dzICgpOiBSZW5kZXJXaW5kb3dbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3dpbmRvd3M7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa4suafk+euoee6v1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IHBpcGVsaW5lICgpOiBSZW5kZXJQaXBlbGluZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BpcGVsaW5lITtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICogVUnlrp7kvotcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCB1aSAoKTogVUkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl91aSBhcyBVSTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Zy65pmv5YiX6KGoXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgc2NlbmVzICgpOiBSZW5kZXJTY2VuZVtdIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmVzO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDntK/orqHml7bpl7TvvIjnp5LvvIlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBjdW11bGF0aXZlVGltZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gUm9vdFBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJvb3RWaWV3LkNVTVVMQVRJVkVfVElNRSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW4p+aXtumXtO+8iOenku+8iVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IGZyYW1lVGltZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gUm9vdFBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJvb3RWaWV3LkZSQU1FX1RJTUUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDkuIDnp5LlhoXnmoTntK/orqHluKfmlbBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBmcmFtZUNvdW50ICgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9mcmFtZUNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmr4/np5LluKfnjodcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldCBmcHMgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZwcztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5q+P56eS5Zu65a6a5bin546HXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXQgZml4ZWRGUFMgKGZwczogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGZwcyA+IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fZml4ZWRGUFMgPSBmcHM7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpeGVkRlBTRnJhbWVUaW1lID0gMTAwMC4wIC8gZnBzO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZpeGVkRlBTRnJhbWVUaW1lID0gMDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBmaXhlZEZQUyAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZml4ZWRGUFM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBkYXRhUG9vbE1hbmFnZXIgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhUG9vbE1ncjtcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaGFuZGxlICgpIDogUm9vdEhhbmRsZSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Bvb2xIYW5kbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIF9jcmVhdGVTY2VuZUZ1bjogKHJvb3Q6IFJvb3QpID0+IFJlbmRlclNjZW5lID0gbnVsbCE7XHJcbiAgICBwdWJsaWMgX2NyZWF0ZVdpbmRvd0Z1bjogKHJvb3Q6IFJvb3QpID0+IFJlbmRlcldpbmRvdyA9IG51bGwhO1xyXG5cclxuICAgIHByaXZhdGUgX2RldmljZTogR0ZYRGV2aWNlO1xyXG4gICAgcHJpdmF0ZSBfd2luZG93czogUmVuZGVyV2luZG93W10gPSBbXTtcclxuICAgIHByaXZhdGUgX21haW5XaW5kb3c6IFJlbmRlcldpbmRvdyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfY3VyV2luZG93OiBSZW5kZXJXaW5kb3cgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX3RlbXBXaW5kb3c6IFJlbmRlcldpbmRvdyB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBfcGlwZWxpbmU6IFJlbmRlclBpcGVsaW5lIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF91aTogVUkgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgX2RhdGFQb29sTWdyOiBEYXRhUG9vbE1hbmFnZXI7XHJcbiAgICBwcml2YXRlIF9zY2VuZXM6IFJlbmRlclNjZW5lW10gPSBbXTtcclxuICAgIHByaXZhdGUgX2NhbWVyYXM6IENhbWVyYVtdID0gW107XHJcbiAgICBwcml2YXRlIF92aWV3czogUmVuZGVyVmlld1tdID0gW107XHJcbiAgICBwcml2YXRlIF9tb2RlbFBvb2xzID0gbmV3IE1hcDxDb25zdHJ1Y3RvcjxNb2RlbD4sIFBvb2w8TW9kZWw+PigpO1xyXG4gICAgcHJpdmF0ZSBfY2FtZXJhUG9vbDogUG9vbDxDYW1lcmE+IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIF9saWdodFBvb2xzID0gbmV3IE1hcDxDb25zdHJ1Y3RvcjxMaWdodD4sIFBvb2w8TGlnaHQ+PigpO1xyXG4gICAgcHJpdmF0ZSBfZnBzVGltZTogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2ZyYW1lQ291bnQ6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9mcHM6IG51bWJlciA9IDA7XHJcbiAgICBwcml2YXRlIF9maXhlZEZQUzogbnVtYmVyID0gMDtcclxuICAgIHByaXZhdGUgX2ZpeGVkRlBTRnJhbWVUaW1lOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfcG9vbEhhbmRsZTogUm9vdEhhbmRsZSA9IE5VTExfSEFORExFO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p6E6YCg5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gZGV2aWNlIEdGWOiuvuWkh1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZGV2aWNlOiBHRlhEZXZpY2UpIHtcclxuICAgICAgICB0aGlzLl9kZXZpY2UgPSBkZXZpY2U7XHJcbiAgICAgICAgdGhpcy5fZGF0YVBvb2xNZ3IgPSBuZXcgRGF0YVBvb2xNYW5hZ2VyKGRldmljZSk7XHJcblxyXG4gICAgICAgIFJlbmRlclNjZW5lLnJlZ2lzdGVyQ3JlYXRlRnVuYyh0aGlzKTtcclxuICAgICAgICBSZW5kZXJXaW5kb3cucmVnaXN0ZXJDcmVhdGVGdW5jKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLl9jYW1lcmFQb29sID0gbmV3IFBvb2woKCkgPT4gbmV3IENhbWVyYSh0aGlzLl9kZXZpY2UpLCA0KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yid5aeL5YyW5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gaW5mbyBSb2905o+P6L+w5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0aWFsaXplIChpbmZvOiBJUm9vdEluZm8pOiBib29sZWFuIHtcclxuICAgICAgICB0aGlzLl9wb29sSGFuZGxlID0gUm9vdFBvb2wuYWxsb2MoKTtcclxuICAgICAgICBjb25zdCBjb2xvckF0dGFjaG1lbnQgPSBuZXcgR0ZYQ29sb3JBdHRhY2htZW50KCk7XHJcbiAgICAgICAgY29uc3QgZGVwdGhTdGVuY2lsQXR0YWNobWVudCA9IG5ldyBHRlhEZXB0aFN0ZW5jaWxBdHRhY2htZW50KCk7XHJcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5kZXB0aFN0b3JlT3AgPSBHRlhTdG9yZU9wLkRJU0NBUkQ7XHJcbiAgICAgICAgZGVwdGhTdGVuY2lsQXR0YWNobWVudC5zdGVuY2lsU3RvcmVPcCA9IEdGWFN0b3JlT3AuRElTQ0FSRDtcclxuICAgICAgICBjb25zdCByZW5kZXJQYXNzSW5mbyA9IG5ldyBHRlhSZW5kZXJQYXNzSW5mbyhbY29sb3JBdHRhY2htZW50XSwgZGVwdGhTdGVuY2lsQXR0YWNobWVudCk7XHJcbiAgICAgICAgdGhpcy5fbWFpbldpbmRvdyA9IHRoaXMuY3JlYXRlV2luZG93KHtcclxuICAgICAgICAgICAgdGl0bGU6ICdyb290TWFpbldpbmRvdycsXHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLl9kZXZpY2Uud2lkdGgsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5fZGV2aWNlLmhlaWdodCxcclxuICAgICAgICAgICAgcmVuZGVyUGFzc0luZm8sXHJcbiAgICAgICAgICAgIHN3YXBjaGFpbkJ1ZmZlckluZGljZXM6IC0xLCAvLyBhbHdheXMgb24gc2NyZWVuXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY3VyV2luZG93ID0gdGhpcy5fbWFpbldpbmRvdztcclxuXHJcbiAgICAgICAgYnVpbHRpblJlc01nci5pbml0QnVpbHRpblJlcyh0aGlzLl9kZXZpY2UpO1xyXG5cclxuICAgICAgICBsZWdhY3lDQy52aWV3Lm9uKCdkZXNpZ24tcmVzb2x1dGlvbi1jaGFuZ2VkJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IGxlZ2FjeUNDLmdhbWUuY2FudmFzLndpZHRoO1xyXG4gICAgICAgICAgICBjb25zdCBoZWlnaHQgPSBsZWdhY3lDQy5nYW1lLmNhbnZhcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIHRoaXMucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVzdHJveSAoKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhckNhbWVyYXMoKTtcclxuICAgICAgICB0aGlzLmRlc3Ryb3lTY2VuZXMoKTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcGVsaW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fcGlwZWxpbmUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3VpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3VpLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fdWkgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fY3VyV2luZG93ID0gbnVsbDtcclxuICAgICAgICB0aGlzLl9tYWluV2luZG93ID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRhdGFQb29sTWFuYWdlci5jbGVhcigpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5fcG9vbEhhbmRsZSkge1xyXG4gICAgICAgICAgICBSb290UG9vbC5mcmVlKHRoaXMuX3Bvb2xIYW5kbGUpO1xyXG4gICAgICAgICAgICB0aGlzLl9wb29sSGFuZGxlID0gTlVMTF9IQU5ETEU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDph43nva7lpKflsI9cclxuICAgICAqIEBwYXJhbSB3aWR0aCDlsY/luZXlrr3luqZcclxuICAgICAqIEBwYXJhbSBoZWlnaHQg5bGP5bmV6auY5bqmXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZXNpemUgKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKSB7XHJcbiAgICAgICAgLy8gY29uc3QgdyA9IHdpZHRoIC8gY2Mudmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAvLyBjb25zdCBoID0gaGVpZ2h0IC8gY2Mudmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuXHJcbiAgICAgICAgdGhpcy5fZGV2aWNlLnJlc2l6ZSh3aWR0aCwgaGVpZ2h0KTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFpbldpbmRvdyEucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IHdpbmRvdyBvZiB0aGlzLl93aW5kb3dzKSB7XHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cuc2hvdWxkU3luY1NpemVXaXRoU3dhcGNoYWluKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGNhbWVyYSBvZiB0aGlzLl9jYW1lcmFzKSB7XHJcbiAgICAgICAgICAgIGlmIChjYW1lcmEuaXNXaW5kb3dTaXplKSB7XHJcbiAgICAgICAgICAgICAgICBjYW1lcmEucmVzaXplKHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRSZW5kZXJQaXBlbGluZSAocnBwbDogUmVuZGVyUGlwZWxpbmUpOiBib29sZWFuIHtcclxuICAgICAgICBpZiAoIXJwcGwpIHtcclxuICAgICAgICAgICAgcnBwbCA9IHRoaXMuY3JlYXRlRGVmYXVsdFBpcGVsaW5lKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3BpcGVsaW5lID0gcnBwbDtcclxuICAgICAgICBpZiAoIXRoaXMuX3BpcGVsaW5lLmFjdGl2YXRlKCkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uR2xvYmFsUGlwZWxpbmVTdGF0ZUNoYW5nZWQoKTtcclxuICAgICAgICB0aGlzLl91aSA9IG5ldyBVSSh0aGlzKTtcclxuICAgICAgICBpZiAoIXRoaXMuX3VpLmluaXRpYWxpemUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlRGVmYXVsdFBpcGVsaW5lICgpIHtcclxuICAgICAgICBjb25zdCBycHBsID0gbmV3IEZvcndhcmRQaXBlbGluZSgpO1xyXG4gICAgICAgIHJwcGwuaW5pdGlhbGl6ZSh7IGZsb3dzOiBbXSB9KTtcclxuICAgICAgICByZXR1cm4gcnBwbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgb25HbG9iYWxQaXBlbGluZVN0YXRlQ2hhbmdlZCAoKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9jYW1lcmFzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhbWVyYXNbaV0udmlldy5vbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2NlbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NjZW5lc1tpXS5vbkdsb2JhbFBpcGVsaW5lU3RhdGVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmv4DmtLvmjIflrprnqpflj6PkuLrlvZPliY3nqpflj6NcclxuICAgICAqIEBwYXJhbSB3aW5kb3cgR0ZY56qX5Y+jXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhY3RpdmVXaW5kb3cgKHdpbmRvdzogUmVuZGVyV2luZG93KSB7XHJcbiAgICAgICAgdGhpcy5fY3VyV2luZG93ID0gd2luZG93O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDph43nva7ntK/orqHml7bpl7RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0Q3VtdWxhdGl2ZVRpbWUgKCkge1xyXG4gICAgICAgIFJvb3RQb29sLnNldCh0aGlzLl9wb29sSGFuZGxlLCBSb290Vmlldy5DVU1VTEFUSVZFX1RJTUUsIDApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmr4/luKfmiafooYzlh73mlbBcclxuICAgICAqIEBwYXJhbSBkZWx0YVRpbWUg6Ze06ZqU5pe26Ze0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmcmFtZU1vdmUgKGRlbHRhVGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgUm9vdFBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJvb3RWaWV3LkZSQU1FX1RJTUUsIGRlbHRhVGltZSk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgaWYgKHRoaXMuX2ZpeGVkRlBTRnJhbWVUaW1lID4gMCkge1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZWxhcHNlZCA9IHRoaXMuX2ZyYW1lVGltZSAqIDEwMDAuMDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2ZpeGVkRlBTRnJhbWVUaW1lID4gZWxhcHNlZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBvbmx5LWFycm93LWZ1bmN0aW9uc1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7fSwgdGhpcy5fZml4ZWRGUFNGcmFtZVRpbWUgLSBlbGFwc2VkKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICArK3RoaXMuX2ZyYW1lQ291bnQ7XHJcbiAgICAgICAgUm9vdFBvb2wuc2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJvb3RWaWV3LkNVTVVMQVRJVkVfVElNRSwgUm9vdFBvb2wuZ2V0KHRoaXMuX3Bvb2xIYW5kbGUsIFJvb3RWaWV3LkNVTVVMQVRJVkVfVElNRSkgKyBkZWx0YVRpbWUpO1xyXG4gICAgICAgIHRoaXMuX2Zwc1RpbWUgKz0gZGVsdGFUaW1lO1xyXG4gICAgICAgIGlmICh0aGlzLl9mcHNUaW1lID4gMS4wKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZwcyA9IHRoaXMuX2ZyYW1lQ291bnQ7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyYW1lQ291bnQgPSAwO1xyXG4gICAgICAgICAgICB0aGlzLl9mcHNUaW1lID0gMC4wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX3BpcGVsaW5lKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5hY3F1aXJlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3ZpZXdzLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIGNvbnN0IHZpZXdzID0gdGhpcy5fY2FtZXJhcztcclxuICAgICAgICAgICAgY29uc3Qgc3RhbXAgPSBsZWdhY3lDQy5kaXJlY3Rvci5nZXRUb3RhbEZyYW1lcygpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZXdzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBjYW1lcmEgPSB0aGlzLl9jYW1lcmFzW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IGNhbWVyYS52aWV3O1xyXG4gICAgICAgICAgICAgICAgaWYgKHZpZXcuaXNFbmFibGUgJiYgdmlldy53aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICBjYW1lcmEudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FtZXJhLnNjZW5lIS51cGRhdGUoc3RhbXApO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3ZpZXdzLnB1c2godmlldyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuX3BpcGVsaW5lLnJlbmRlcih0aGlzLl92aWV3cyk7XHJcbiAgICAgICAgICAgIHRoaXMuX2RldmljZS5wcmVzZW50KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliJvlu7rnqpflj6NcclxuICAgICAqIEBwYXJhbSBpbmZvIEdGWOeql+WPo+aPj+i/sOS/oeaBr1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY3JlYXRlV2luZG93IChpbmZvOiBJUmVuZGVyV2luZG93SW5mbyk6IFJlbmRlcldpbmRvdyB8IG51bGwge1xyXG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMuX2NyZWF0ZVdpbmRvd0Z1bih0aGlzKTtcclxuICAgICAgICB3aW5kb3cuaW5pdGlhbGl6ZSh0aGlzLmRldmljZSwgaW5mbyk7XHJcbiAgICAgICAgdGhpcy5fd2luZG93cy5wdXNoKHdpbmRvdyk7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6ZSA5q+B5oyH5a6a55qE56qX5Y+jXHJcbiAgICAgKiBAcGFyYW0gd2luZG93IEdGWOeql+WPo1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGVzdHJveVdpbmRvdyAod2luZG93OiBSZW5kZXJXaW5kb3cpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpbmRvd3MubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX3dpbmRvd3NbaV0gPT09IHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3dpbmRvd3Muc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4Hlhajpg6jnqpflj6NcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3lXaW5kb3dzICgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHdpbmRvdyBvZiB0aGlzLl93aW5kb3dzKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5kZXN0cm95KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX3dpbmRvd3MgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yib5bu65riy5p+T5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gaW5mbyDmuLLmn5PlnLrmma/mj4/ov7Dkv6Hmga9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNyZWF0ZVNjZW5lIChpbmZvOiBJUmVuZGVyU2NlbmVJbmZvKTogUmVuZGVyU2NlbmUge1xyXG4gICAgICAgIGNvbnN0IHNjZW5lOiBSZW5kZXJTY2VuZSA9IHRoaXMuX2NyZWF0ZVNjZW5lRnVuKHRoaXMpO1xyXG4gICAgICAgIHNjZW5lLmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgdGhpcy5fc2NlbmVzLnB1c2goc2NlbmUpO1xyXG4gICAgICAgIHJldHVybiBzY2VuZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6ZSA5q+B5oyH5a6a55qE5riy5p+T5Zy65pmvXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUg5riy5p+T5Zy65pmvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95U2NlbmUgKHNjZW5lOiBSZW5kZXJTY2VuZSkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fc2NlbmVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9zY2VuZXNbaV0gPT09IHNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICBzY2VuZS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zY2VuZXMuc3BsaWNlKGksIDEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplIDmr4Hlhajpg6jlnLrmma9cclxuICAgICAqL1xyXG4gICAgcHVibGljIGRlc3Ryb3lTY2VuZXMgKCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2NlbmUgb2YgdGhpcy5fc2NlbmVzKSB7XHJcbiAgICAgICAgICAgIHNjZW5lLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fc2NlbmVzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uua4suafk+inhuWbvlxyXG4gICAgICogQHBhcmFtIGluZm8g5riy5p+T6KeG5Zu+5o+P6L+w5L+h5oGvXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjcmVhdGVWaWV3IChpbmZvOiBJUmVuZGVyVmlld0luZm8pOiBSZW5kZXJWaWV3IHtcclxuICAgICAgICBjb25zdCB2aWV3OiBSZW5kZXJWaWV3ID0gbmV3IFJlbmRlclZpZXcoKTtcclxuICAgICAgICB2aWV3LmluaXRpYWxpemUoaW5mbyk7XHJcbiAgICAgICAgcmV0dXJuIHZpZXc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa3u+WKoOa4suafk+ebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYSDmuLLmn5Pnm7jmnLpcclxuICAgICAqL1xyXG4gICAgcHVibGljIGF0dGFjaENhbWVyYSAoY2FtZXJhOiBDYW1lcmEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbWVyYXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYXNbaV0gPT09IGNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYXMucHVzaChjYW1lcmEpO1xyXG4gICAgICAgIHRoaXMuc29ydFZpZXdzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOenu+mZpOa4suafk+ebuOaculxyXG4gICAgICogQHBhcmFtIGNhbWVyYSDnm7jmnLpcclxuICAgICAqL1xyXG4gICAgcHVibGljIGRldGFjaENhbWVyYSAoY2FtZXJhOiBDYW1lcmEpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2NhbWVyYXMubGVuZ3RoOyArK2kpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NhbWVyYXNbaV0gPT09IGNhbWVyYSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2FtZXJhcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOmUgOavgeWFqOmDqOa4suafk+ebuOaculxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xlYXJDYW1lcmFzICgpIHtcclxuICAgICAgICB0aGlzLl9jYW1lcmFzLmxlbmd0aCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGNyZWF0ZU1vZGVsPFQgZXh0ZW5kcyBNb2RlbD4gKG1DbGFzczogdHlwZW9mIE1vZGVsKTogVCB7XHJcbiAgICAgICAgbGV0IHAgPSB0aGlzLl9tb2RlbFBvb2xzLmdldChtQ2xhc3MpO1xyXG4gICAgICAgIGlmICghcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9tb2RlbFBvb2xzLnNldChtQ2xhc3MsIG5ldyBQb29sKCgpID0+IG5ldyBtQ2xhc3MoKSwgMTApKTtcclxuICAgICAgICAgICAgcCA9IHRoaXMuX21vZGVsUG9vbHMuZ2V0KG1DbGFzcykhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBtb2RlbCA9IHAuYWxsb2MoKSBhcyBUO1xyXG4gICAgICAgIG1vZGVsLmluaXRpYWxpemUoKTtcclxuICAgICAgICByZXR1cm4gbW9kZWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3lNb2RlbCAobTogTW9kZWwpIHtcclxuICAgICAgICBjb25zdCBwID0gdGhpcy5fbW9kZWxQb29scy5nZXQobS5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxNb2RlbD4pO1xyXG4gICAgICAgIGlmIChwKSB7XHJcbiAgICAgICAgICAgIHAuZnJlZShtKTtcclxuICAgICAgICAgICAgbS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIGlmIChtLnNjZW5lKSB7XHJcbiAgICAgICAgICAgICAgICBtLnNjZW5lLnJlbW92ZU1vZGVsKG0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS53YXJuKGAnJHttLmNvbnN0cnVjdG9yLm5hbWV9J2lzIG5vdCBpbiB0aGUgbW9kZWwgcG9vbCBhbmQgY2Fubm90IGJlIGRlc3Ryb3llZCBieSBkZXN0cm95TW9kZWwuYCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjcmVhdGVDYW1lcmEgKCk6IENhbWVyYSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NhbWVyYVBvb2whLmFsbG9jKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3lDYW1lcmEgKGM6IENhbWVyYSkge1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYVBvb2whLmZyZWUoYyk7XHJcbiAgICAgICAgYy5kZXN0cm95KCk7XHJcbiAgICAgICAgaWYgKGMuc2NlbmUpIHtcclxuICAgICAgICAgICAgYy5zY2VuZS5yZW1vdmVDYW1lcmEoYyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGMuaXNXaW5kb3dTaXplID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgY3JlYXRlTGlnaHQ8VCBleHRlbmRzIExpZ2h0PiAobENsYXNzOiBuZXcgKCkgPT4gVCk6IFQge1xyXG4gICAgICAgIGxldCBsID0gdGhpcy5fbGlnaHRQb29scy5nZXQobENsYXNzKTtcclxuICAgICAgICBpZiAoIWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fbGlnaHRQb29scy5zZXQobENsYXNzLCBuZXcgUG9vbCgoKSA9PiBuZXcgbENsYXNzKCksIDQpKTtcclxuICAgICAgICAgICAgbCA9IHRoaXMuX2xpZ2h0UG9vbHMuZ2V0KGxDbGFzcykhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBsaWdodCA9IGwuYWxsb2MoKSBhcyBUO1xyXG4gICAgICAgIGxpZ2h0LmluaXRpYWxpemUoKTtcclxuICAgICAgICByZXR1cm4gbGlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3lMaWdodCAobDogTGlnaHQpIHtcclxuICAgICAgICBjb25zdCBwID0gdGhpcy5fbGlnaHRQb29scy5nZXQobC5jb25zdHJ1Y3RvciBhcyBDb25zdHJ1Y3RvcjxMaWdodD4pO1xyXG4gICAgICAgIGwuZGVzdHJveSgpO1xyXG4gICAgICAgIGlmIChwKSB7XHJcbiAgICAgICAgICAgIHAuZnJlZShsKTtcclxuICAgICAgICAgICAgaWYgKGwuc2NlbmUpIHtcclxuICAgICAgICAgICAgICAgIHN3aXRjaCAobC50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBMaWdodFR5cGUuU1BIRVJFOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLnNjZW5lLnJlbW92ZVNwaGVyZUxpZ2h0KGwgYXMgU3BoZXJlTGlnaHQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIExpZ2h0VHlwZS5TUE9UOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsLnNjZW5lLnJlbW92ZVNwb3RMaWdodChsIGFzIFNwb3RMaWdodCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzb3J0Vmlld3MgKCkge1xyXG4gICAgICAgIHRoaXMuX2NhbWVyYXMuc29ydCgoYTogQ2FtZXJhLCBiOiBDYW1lcmEpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGEudmlldy5wcmlvcml0eSAtIGIudmlldy5wcmlvcml0eTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxubGVnYWN5Q0MuUm9vdCA9IFJvb3Q7XHJcbiJdfQ==