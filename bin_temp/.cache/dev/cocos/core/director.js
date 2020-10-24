(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./components/system.js", "./data/object.js", "./event/event-target.js", "./game.js", "./load-pipeline/auto-release-utils.js", "./math/index.js", "./platform/event-manager/event-manager.js", "./root.js", "./scene-graph/index.js", "./scene-graph/component-scheduler.js", "./scene-graph/node-activator.js", "./scheduler.js", "./utils/index.js", "./default-constants.js", "./global-exports.js", "./platform/debug.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./components/system.js"), require("./data/object.js"), require("./event/event-target.js"), require("./game.js"), require("./load-pipeline/auto-release-utils.js"), require("./math/index.js"), require("./platform/event-manager/event-manager.js"), require("./root.js"), require("./scene-graph/index.js"), require("./scene-graph/component-scheduler.js"), require("./scene-graph/node-activator.js"), require("./scheduler.js"), require("./utils/index.js"), require("./default-constants.js"), require("./global-exports.js"), require("./platform/debug.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.system, global.object, global.eventTarget, global.game, global.autoReleaseUtils, global.index, global.eventManager, global.root, global.index, global.componentScheduler, global.nodeActivator, global.scheduler, global.index, global.defaultConstants, global.globalExports, global.debug);
    global.director = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _system, _object, _eventTarget, _game, _autoReleaseUtils, _index, _eventManager, _root, _index2, _componentScheduler, _nodeActivator, _scheduler, _index3, _defaultConstants, _globalExports, _debug) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.director = _exports.Director = void 0;
  _system = _interopRequireDefault(_system);
  _eventManager = _interopRequireDefault(_eventManager);
  _nodeActivator = _interopRequireDefault(_nodeActivator);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  // ----------------------------------------------------------------------------------------------------------------------

  /**
   * @en
   * <p>
   *    ATTENTION: USE `director` INSTEAD OF `Director`.<br/>
   *    `director` is a singleton object which manage your game's logic flow.<br/>
   *    Since the `director` is a singleton, you don't need to call any constructor or create functions,<br/>
   *    the standard way to use it is by calling:<br/>
   *      - `director.methodName();` <br/>
   *
   *    It creates and handle the main Window and manages how and when to execute the Scenes.<br/>
   *    <br/>
   *    The `director` is also responsible for:<br/>
   *      - initializing the OpenGL context<br/>
   *      - setting the OpenGL pixel format (default on is RGB565)<br/>
   *      - setting the OpenGL buffer depth (default on is 0-bit)<br/>
   *      - setting the color for clear screen (default one is BLACK)<br/>
   *      - setting the projection (default one is 3D)<br/>
   *      - setting the orientation (default one is Portrait)<br/>
   *      <br/>
   *    <br/>
   *    The `director` also sets the default OpenGL context:<br/>
   *      - GL_TEXTURE_2D is enabled<br/>
   *      - GL_VERTEX_ARRAY is enabled<br/>
   *      - GL_COLOR_ARRAY is enabled<br/>
   *      - GL_TEXTURE_COORD_ARRAY is enabled<br/>
   * </p>
   * <p>
   *   `director` also synchronizes timers with the refresh rate of the display.<br/>
   *   Features and Limitations:<br/>
   *      - Scheduled timers & drawing are synchronizes with the refresh rate of the display<br/>
   *      - Only supports animation intervals of 1/60 1/30 & 1/15<br/>
   * </p>
   *
   * @zh
   * <p>
   *     注意：用 `director` 代替 `Director`。<br/>
   *     `director` 一个管理你的游戏的逻辑流程的单例对象。<br/>
   *     由于 `director` 是一个单例，你不需要调用任何构造函数或创建函数，<br/>
   *     使用它的标准方法是通过调用：<br/>
   *       - `director.methodName();`
   *     <br/>
   *     它创建和处理主窗口并且管理什么时候执行场景。<br/>
   *     <br/>
   *     `director` 还负责：<br/>
   *      - 初始化 OpenGL 环境。<br/>
   *      - 设置OpenGL像素格式。(默认是 RGB565)<br/>
   *      - 设置OpenGL缓冲区深度 (默认是 0-bit)<br/>
   *      - 设置空白场景的颜色 (默认是 黑色)<br/>
   *      - 设置投影 (默认是 3D)<br/>
   *      - 设置方向 (默认是 Portrait)<br/>
   *    <br/>
   *    `director` 设置了 OpenGL 默认环境 <br/>
   *      - GL_TEXTURE_2D   启用。<br/>
   *      - GL_VERTEX_ARRAY 启用。<br/>
   *      - GL_COLOR_ARRAY  启用。<br/>
   *      - GL_TEXTURE_COORD_ARRAY 启用。<br/>
   * </p>
   * <p>
   *   `director` 也同步定时器与显示器的刷新速率。
   *   <br/>
   *   特点和局限性: <br/>
   *      - 将计时器 & 渲染与显示器的刷新频率同步。<br/>
   *      - 只支持动画的间隔 1/60 1/30 & 1/15。<br/>
   * </p>
   *
   * @class Director
   * @extends EventTarget
   */
  var Director = /*#__PURE__*/function (_EventTarget) {
    _inherits(Director, _EventTarget);

    /**
     * @en The event which will be triggered when the singleton of Director initialized.
     * @zh Director 单例初始化时触发的事件
     * @event Director.EVENT_INIT
     */

    /**
     * @en The event which will be triggered when the singleton of Director initialized.
     * @zh Director 单例初始化时触发的事件
     */

    /**
     * @en The event which will be triggered when the singleton of Director reset.
     * @zh Director 单例重置时触发的事件
     * @event Director.EVENT_RESET
     */

    /**
     * @en The event which will be triggered when the singleton of Director reset.
     * @zh Director 单例重置时触发的事件
     */

    /**
     * @en The event which will be triggered before loading a new scene.
     * @zh 加载新场景之前所触发的事件。
     * @event Director.EVENT_BEFORE_SCENE_LOADING
     * @param {String} sceneName - The loading scene name
     */

    /**
     * @en The event which will be triggered before loading a new scene.
     * @zh 加载新场景之前所触发的事件。
     */

    /**
     * @en The event which will be triggered before launching a new scene.
     * @zh 运行新场景之前所触发的事件。
     * @event Director.EVENT_BEFORE_SCENE_LAUNCH
     * @param {String} sceneName - New scene which will be launched
     */

    /**
     * @en The event which will be triggered before launching a new scene.
     * @zh 运行新场景之前所触发的事件。
     */

    /**
     * @en The event which will be triggered after launching a new scene.
     * @zh 运行新场景之后所触发的事件。
     * @event Director.EVENT_AFTER_SCENE_LAUNCH
     * @param {String} sceneName - New scene which is launched
     */

    /**
     * @en The event which will be triggered after launching a new scene.
     * @zh 运行新场景之后所触发的事件。
     */

    /**
     * @en The event which will be triggered at the beginning of every frame.
     * @zh 每个帧的开始时所触发的事件。
     * @event Director.EVENT_BEFORE_UPDATE
     */

    /**
     * @en The event which will be triggered at the beginning of every frame.
     * @zh 每个帧的开始时所触发的事件。
     */

    /**
     * @en The event which will be triggered after engine and components update logic.
     * @zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
     * @event Director.EVENT_AFTER_UPDATE
     */

    /**
     * @en The event which will be triggered after engine and components update logic.
     * @zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
     */

    /**
     * @en The event which will be triggered before the rendering process.
     * @zh 渲染过程之前所触发的事件。
     * @event Director.EVENT_BEFORE_DRAW
     */

    /**
     * @en The event which will be triggered before the rendering process.
     * @zh 渲染过程之前所触发的事件。
     */

    /**
     * @en The event which will be triggered after the rendering process.
     * @zh 渲染过程之后所触发的事件。
     */

    /**
     * @en The event which will be triggered after the rendering process.
     * @zh 渲染过程之后所触发的事件。
     */

    /**
     * The event which will be triggered before the physics process.<br/>
     * 物理过程之前所触发的事件。
     */

    /**
     * The event which will be triggered after the physics process.<br/>
     * 物理过程之后所触发的事件。
     */
    function Director() {
      var _this;

      _classCallCheck(this, Director);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(Director).call(this));
      _this._compScheduler = void 0;
      _this._nodeActivator = void 0;
      _this._invalid = void 0;
      _this._paused = void 0;
      _this._purgeDirectorInNextLoop = void 0;
      _this._root = void 0;
      _this._loadingScene = void 0;
      _this._scene = void 0;
      _this._totalFrames = void 0;
      _this._lastUpdate = void 0;
      _this._deltaTime = void 0;
      _this._startTime = void 0;
      _this._scheduler = void 0;
      _this._systems = void 0;
      _this._invalid = false; // paused?

      _this._paused = false; // purge?

      _this._purgeDirectorInNextLoop = false; // root

      _this._root = null; // scenes

      _this._loadingScene = '';
      _this._scene = null; // FPS

      _this._totalFrames = 0;
      _this._lastUpdate = 0;
      _this._deltaTime = 0.0;
      _this._startTime = 0.0; // Scheduler for user registration update

      _this._scheduler = new _scheduler.Scheduler(); // Scheduler for life-cycle methods in component

      _this._compScheduler = new _componentScheduler.ComponentScheduler(); // Node activator

      _this._nodeActivator = new _nodeActivator.default();
      _this._systems = [];

      _globalExports.legacyCC.game.once(_game.Game.EVENT_RENDERER_INITED, _this._initOnRendererInitialized, _assertThisInitialized(_this));

      return _this;
    }
    /**
     * calculates delta time since last time it was called
     */


    _createClass(Director, [{
      key: "calculateDeltaTime",
      value: function calculateDeltaTime(now) {
        if (!now) now = performance.now();
        this._deltaTime = now > this._lastUpdate ? (now - this._lastUpdate) / 1000 : 0;

        if (_defaultConstants.DEBUG && this._deltaTime > 1) {
          this._deltaTime = 1 / 60.0;
        }

        this._lastUpdate = now;
      }
      /**
       * @en
       * Converts a view coordinate to an WebGL coordinate<br/>
       * Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
       * Implementation can be found in directorWebGL.
       * @zh 将触摸点的屏幕坐标转换为 WebGL View 下的坐标。
       * @deprecated since v2.0
       */

    }, {
      key: "convertToGL",
      value: function convertToGL(uiPoint) {
        var container = _globalExports.legacyCC.game.container;
        var view = _globalExports.legacyCC.view;
        var box = container.getBoundingClientRect();
        var left = box.left + window.pageXOffset - container.clientLeft;
        var top = box.top + window.pageYOffset - container.clientTop;
        var x = view._devicePixelRatio * (uiPoint.x - left);
        var y = view._devicePixelRatio * (top + box.height - uiPoint.y);
        return view._isRotated ? (0, _index.v2)(view._viewportRect.width - y, x) : (0, _index.v2)(x, y);
      }
      /**
       * @en
       * Converts an OpenGL coordinate to a view coordinate<br/>
       * Useful to convert node points to window points for calls such as glScissor<br/>
       * Implementation can be found in directorWebGL.
       * @zh 将触摸点的 WebGL View 坐标转换为屏幕坐标。
       * @deprecated since v2.0
       */

    }, {
      key: "convertToUI",
      value: function convertToUI(glPoint) {
        var container = _globalExports.legacyCC.game.container;
        var view = _globalExports.legacyCC.view;
        var box = container.getBoundingClientRect();
        var left = box.left + window.pageXOffset - container.clientLeft;
        var top = box.top + window.pageYOffset - container.clientTop;
        var uiPoint = (0, _index.v2)(0, 0);

        if (view._isRotated) {
          uiPoint.x = left + glPoint.y / view._devicePixelRatio;
          uiPoint.y = top + box.height - (view._viewportRect.width - glPoint.x) / view._devicePixelRatio;
        } else {
          uiPoint.x = left + glPoint.x * view._devicePixelRatio;
          uiPoint.y = top + box.height - glPoint.y * view._devicePixelRatio;
        }

        return uiPoint;
      }
      /**
       * End the life of director in the next frame
       */

    }, {
      key: "end",
      value: function end() {
        this._purgeDirectorInNextLoop = true;
      }
      /**
       * @en
       * Returns the size of the WebGL view in points.<br/>
       * It takes into account any possible rotation (device orientation) of the window.
       * @zh 获取视图的大小，以点为单位。
       * @deprecated since v2.0
       */

    }, {
      key: "getWinSize",
      value: function getWinSize() {
        return (0, _index.size)(_globalExports.legacyCC.winSize);
      }
      /**
       * @en
       * Returns the size of the OpenGL view in pixels.<br/>
       * It takes into account any possible rotation (device orientation) of the window.<br/>
       * On Mac winSize and winSizeInPixels return the same value.
       * (The pixel here refers to the resource resolution. If you want to get the physics resolution of device, you need to use `view.getFrameSize()`)
       * @zh
       * 获取视图大小，以像素为单位（这里的像素指的是资源分辨率。
       * 如果要获取屏幕物理分辨率，需要用 `view.getFrameSize()`）
       * @deprecated since v2.0
       */

    }, {
      key: "getWinSizeInPixels",
      value: function getWinSizeInPixels() {
        return (0, _index.size)(_globalExports.legacyCC.winSize);
      }
      /**
       * @en Pause the director's ticker, only involve the game logic execution.<br>
       * It won't pause the rendering process nor the event manager.<br>
       * If you want to pause the entire game including rendering, audio and event,<br>
       * please use `game.pause`.
       * @zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。<br>
       * 如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 `game.pause` 。
       */

    }, {
      key: "pause",
      value: function pause() {
        if (this._paused) {
          return;
        }

        this._paused = true;
      }
      /**
       * @en Removes cached all cocos2d cached data.
       * @zh 删除cocos2d所有的缓存数据
       * @deprecated since v2.0
       */

    }, {
      key: "purgeCachedData",
      value: function purgeCachedData() {
        _globalExports.legacyCC.loader.releaseAll();
      }
      /**
       * @en Purge the `director` itself, including unschedule all schedule,<br>
       * remove all event listeners, clean up and exit the running scene, stops all animations, clear cached data.
       * @zh 清除 `director` 本身，包括停止所有的计时器，<br>
       * 移除所有的事件监听器，清理并退出当前运行的场景，停止所有动画，清理缓存数据。
       */

    }, {
      key: "purgeDirector",
      value: function purgeDirector() {
        // cleanup scheduler
        this._scheduler.unscheduleAll();

        this._compScheduler.unscheduleAll();

        this._nodeActivator.reset(); // Disable event dispatching


        if (_eventManager.default) {
          _eventManager.default.setEnabled(false);
        }

        if (!_defaultConstants.EDITOR) {
          if (_globalExports.legacyCC.isValid(this._scene)) {
            this._scene.destroy();
          }

          this._scene = null;
        }

        this.stopAnimation(); // Clear all caches

        _globalExports.legacyCC.loader.releaseAll();
      }
      /**
       * @en Reset the director, can be used to restart the director after purge
       * @zh 重置此 Director，可用于在清除后重启 Director。
       */

    }, {
      key: "reset",
      value: function reset() {
        this.purgeDirector();
        this.emit(Director.EVENT_RESET);

        if (_eventManager.default) {
          _eventManager.default.setEnabled(true);
        }

        this.startAnimation();
      }
      /**
       * @en
       * Run a scene. Replaces the running scene with a new one or enter the first scene.<br>
       * The new scene will be launched immediately.
       * @zh 运行指定场景。将正在运行的场景替换为（或重入为）新场景。新场景将立即启动。
       * @param scene - The need run scene.
       * @param onBeforeLoadScene - The function invoked at the scene before loading.
       * @param onLaunched - The function invoked at the scene after launch.
       */

    }, {
      key: "runSceneImmediate",
      value: function runSceneImmediate(scene, onBeforeLoadScene, onLaunched) {
        (0, _debug.assertID)(scene instanceof _globalExports.legacyCC.Scene, 1216);

        var uuid = _globalExports.legacyCC.loader._getReferenceKey(scene.uuid); // Scene cannot be cached in loader, because it will be destroyed after switching.


        _globalExports.legacyCC.loader.removeItem(uuid);

        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.time('InitScene');
        } // @ts-ignore


        scene._load(); // ensure scene initialized


        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.timeEnd('InitScene');
        } // Re-attach or replace persist nodes


        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.time('AttachPersist');
        }

        var persistNodeList = Object.keys(_globalExports.legacyCC.game._persistRootNodes).map(function (x) {
          return _globalExports.legacyCC.game._persistRootNodes[x];
        });

        for (var i = 0; i < persistNodeList.length; i++) {
          var node = persistNodeList[i];
          node.emit(_globalExports.legacyCC.Node.SCENE_CHANGED_FOR_PERSISTS, scene.renderScene);
          var existNode = scene.getChildByUuid(node.uuid);

          if (existNode) {
            // scene also contains the persist node, select the old one
            var index = existNode.getSiblingIndex();

            existNode._destroyImmediate();

            scene.insertChild(node, index);
          } else {
            node.parent = scene;
          }
        }

        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.timeEnd('AttachPersist');
        }

        var oldScene = this._scene;

        if (!_defaultConstants.EDITOR) {
          // auto release assets
          if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
            console.time('AutoRelease');
          }

          var autoReleaseAssets = oldScene && oldScene.autoReleaseAssets && oldScene.dependAssets;
          (0, _autoReleaseUtils.autoRelease)(autoReleaseAssets, scene.dependAssets, persistNodeList);

          if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
            console.timeEnd('AutoRelease');
          }
        } // unload scene


        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.time('Destroy');
        }

        if (_globalExports.legacyCC.isValid(oldScene)) {
          oldScene.destroy();
        }

        this._scene = null; // purge destroyed nodes belongs to old scene

        _object.CCObject._deferredDestroy();

        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.timeEnd('Destroy');
        }

        if (onBeforeLoadScene) {
          onBeforeLoadScene();
        }

        this.emit(_globalExports.legacyCC.Director.EVENT_BEFORE_SCENE_LAUNCH, scene); // Run an Entity Scene

        this._scene = scene;

        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.time('Activate');
        } // @ts-ignore


        scene._activate();

        if (_defaultConstants.BUILD && _defaultConstants.DEBUG) {
          console.timeEnd('Activate');
        } // start scene


        if (this._root) {
          this._root.resetCumulativeTime();
        }

        this.startAnimation();

        if (onLaunched) {
          onLaunched(null, scene);
        }

        this.emit(_globalExports.legacyCC.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
      }
      /**
       * @en
       * Run a scene. Replaces the running scene with a new one or enter the first scene.<br>
       * The new scene will be launched at the end of the current frame.<br>
       * @zh 运行指定场景。
       * @param scene - The need run scene.
       * @param onBeforeLoadScene - The function invoked at the scene before loading.
       * @param onLaunched - The function invoked at the scene after launch.
       * @private
       */

    }, {
      key: "runScene",
      value: function runScene(scene, onBeforeLoadScene, onLaunched) {
        var _this2 = this;

        (0, _debug.assertID)(scene, 1205);
        (0, _debug.assertID)(scene instanceof _globalExports.legacyCC.Scene, 1216); // ensure scene initialized
        // @ts-ignore

        scene._load(); // Delay run / replace scene to the end of the frame


        this.once(_globalExports.legacyCC.Director.EVENT_AFTER_DRAW, function () {
          _this2.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
        });
      } //  @Scene loading section

    }, {
      key: "_getSceneUuid",
      value: function _getSceneUuid(key) {
        var scenes = _globalExports.legacyCC.game._sceneInfos;

        if (typeof key === 'string') {
          if (!key.endsWith('.scene')) {
            key += '.scene';
          }

          if (key[0] !== '/' && !key.startsWith('db://')) {
            key = '/' + key; // 使用全名匹配
          } // search scene
          // tslint:disable-next-line: prefer-for-of


          for (var i = 0; i < scenes.length; i++) {
            var info = scenes[i];

            if (info.url.endsWith(key)) {
              return info;
            }
          }
        } else if (typeof key === 'number') {
          if (0 <= key && key < scenes.length) {
            return scenes[key];
          } else {
            (0, _debug.errorID)(1206, key);
          }
        } else {
          (0, _debug.errorID)(1207, key);
        }

        return null;
      }
      /**
       * @en Loads the scene by its name.
       * @zh 通过场景名称进行加载场景。
       *
       * @param sceneName - The name of the scene to load.
       * @param onLaunched - callback, will be called after scene launched.
       * @return if error, return false
       */

    }, {
      key: "loadScene",
      value: function loadScene(sceneName, onLaunched, onUnloaded) {
        if (this._loadingScene) {
          (0, _debug.warnID)(1208, sceneName, this._loadingScene);
          return false;
        }

        var info = this._getSceneUuid(sceneName);

        if (info) {
          var _uuid = info.uuid;
          this.emit(_globalExports.legacyCC.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
          this._loadingScene = sceneName;

          this._loadSceneByUuid(_uuid, onLaunched, onUnloaded);

          return true;
        } else {
          (0, _debug.errorID)(1209, sceneName);
          return false;
        }
      }
      /**
       * @en
       * Pre-loads the scene to reduces loading time. You can call this method at any time you want.<br>
       * After calling this method, you still need to launch the scene by `director.loadScene`.<br>
       * It will be totally fine to call `director.loadScene` at any time even if the preloading is not<br>
       * yet finished, the scene will be launched after loaded automatically.
       * @zh 预加载场景，你可以在任何时候调用这个方法。
       * 调用完后，你仍然需要通过 `director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。<br>
       * 就算预加载还没完成，你也可以直接调用 `director.loadScene`，加载完成后场景就会启动。
       * @param sceneName 场景名称。
       * @param onLoaded 加载回调。
       */

    }, {
      key: "preloadScene",
      value: function preloadScene(sceneName, arg1, arg2) {
        var onProgress;
        var onLoaded;

        if (arg2 === undefined) {
          onLoaded = arg1;
          onProgress = void 0;
        } else {
          onLoaded = arg2;
          onProgress = arg1;
        }

        var info = this._getSceneUuid(sceneName);

        if (info) {
          this.emit(_globalExports.legacyCC.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);

          _globalExports.legacyCC.loader.load({
            uuid: info.uuid,
            type: 'uuid'
          }, onProgress, function (err, asset) {
            if (err) {
              (0, _debug.errorID)(1210, sceneName, err.message);
            }

            if (onLoaded) {
              onLoaded(err, asset);
            }
          });
        } else {
          var err = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';

          if (onLoaded) {
            onLoaded(new Error(err));
          }

          (0, _debug.error)('preloadScene: ' + err);
        }
      }
      /**
       * @en Loads the scene by its uuid.
       * @zh 通过 uuid 加载场景。
       * @param uuid 场景资源的 uuid。
       * @param doNotRun 仅加载和初始化场景，但并不运行。此参数仅在编辑器环境中生效。
       */

    }, {
      key: "_loadSceneByUuid",
      value: function _loadSceneByUuid(uuid, arg1, arg2, arg3) {
        var onLaunched;
        var onUnloaded;
        var doNotRun;

        if (_defaultConstants.EDITOR && typeof arg1 === 'boolean') {
          doNotRun = arg1;
          onUnloaded = arg2;
        } else if (_defaultConstants.EDITOR && typeof arg2 === 'boolean') {
          doNotRun = arg2;
          onLaunched = arg1;
        } else {
          onLaunched = arg1;
          onUnloaded = arg2;
          doNotRun = arg3;
        } // legacyCC.AssetLibrary.unloadAsset(uuid);     // force reload


        console.time('LoadScene ' + uuid);

        _globalExports.legacyCC.AssetLibrary.loadAsset(uuid, function (err, sceneAsset) {
          console.timeEnd('LoadScene ' + uuid);
          var self = director;
          self._loadingScene = '';

          if (err) {
            err = 'Failed to load scene: ' + err;
            (0, _debug.error)(err);
          } else {
            if (sceneAsset instanceof _globalExports.legacyCC.SceneAsset) {
              var _scene = sceneAsset.scene;
              _scene._id = sceneAsset._uuid;
              _scene._name = sceneAsset._name;

              if (_defaultConstants.EDITOR) {
                if (!doNotRun) {
                  self.runSceneImmediate(_scene, onUnloaded, onLaunched);
                } else {
                  _scene._load();

                  if (onLaunched) {
                    onLaunched(null, _scene);
                  }
                }
              } else {
                self.runSceneImmediate(_scene, onUnloaded, onLaunched);
              }

              return;
            } else {
              err = 'The asset ' + uuid + ' is not a scene';
              (0, _debug.error)(err);
            }
          }

          if (onLaunched) {
            onLaunched(err);
          }
        });
      }
      /**
       * @en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
       * @zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。
       */

    }, {
      key: "resume",
      value: function resume() {
        if (!this._paused) {
          return;
        }

        this._lastUpdate = performance.now();

        if (!this._lastUpdate) {
          (0, _debug.logID)(1200);
        }

        this._paused = false;
        this._deltaTime = 0;
      }
      /**
       * @en
       * Enables or disables WebGL depth test.<br>
       * Implementation can be found in directorCanvas.js/directorWebGL.js
       * @zh 启用/禁用深度测试（在 Canvas 渲染模式下不会生效）。
       * @deprecated since v2.0
       */

    }, {
      key: "setDepthTest",
      value: function setDepthTest(value) {
        if (!_globalExports.legacyCC.Camera.main) {
          return;
        }

        _globalExports.legacyCC.Camera.main.depth = !!value;
      }
      /**
       * @en
       * Set color for clear screen.<br>
       * (Implementation can be found in directorCanvas.js/directorWebGL.js)
       * @zh
       * 设置场景的默认擦除颜色。<br>
       * 支持全透明，但不支持透明度为中间值。要支持全透明需手工开启 `macro.ENABLE_TRANSPARENT_CANVAS`。
       * @deprecated since v2.0
       */

    }, {
      key: "setClearColor",
      value: function setClearColor(clearColor) {
        if (!_globalExports.legacyCC.Camera.main) {
          return;
        }

        _globalExports.legacyCC.Camera.main.backgroundColor = clearColor;
      }
    }, {
      key: "getRunningScene",

      /**
       * @en Returns current logic Scene.
       * @zh 获取当前逻辑场景。
       * @deprecated Since v2.0.
       */
      value: function getRunningScene() {
        return this._scene;
      }
      /**
       * @en Returns current logic Scene.
       * @zh 获取当前逻辑场景。
       * @example
       * ```
       * import { director } from 'cc';
       * // This will help you to get the Canvas node in scene
       * director.getScene().getChildByName('Canvas');
       * ```
       */

    }, {
      key: "getScene",
      value: function getScene() {
        return this._scene;
      }
      /**
       * @en Returns the FPS value. Please use [[Game.setFrameRate]] to control animation interval.
       * @zh 获取单位帧执行时间。请使用 [[Game.setFrameRate]] 来控制游戏帧率。
       * @deprecated since v2.0.
       */

    }, {
      key: "getAnimationInterval",
      value: function getAnimationInterval() {
        return 1000 / _globalExports.legacyCC.game.getFrameRate();
      }
      /**
       * @en Sets animation interval, this doesn't control the main loop.<br>
       * To control the game's frame rate overall, please use `game.setFrameRate`
       * @zh 设置动画间隔，这不控制主循环。<br>
       * 要控制游戏的帧速率，请使用 `game.setFrameRate`
       * @deprecated since v2.0
       * @param value - The animation interval desired.
       */

    }, {
      key: "setAnimationInterval",
      value: function setAnimationInterval(value) {
        _globalExports.legacyCC.game.setFrameRate(Math.round(1000 / value));
      }
      /**
       * @en Returns the delta time since last frame.
       * @zh 获取上一帧的增量时间。
       */

    }, {
      key: "getDeltaTime",
      value: function getDeltaTime() {
        return this._deltaTime;
      }
      /**
       * @en Returns the total passed time since game start, unit: ms
       * @zh 获取从游戏开始到现在总共经过的时间，单位为 ms
       */

    }, {
      key: "getTotalTime",
      value: function getTotalTime() {
        return performance.now() - this._startTime;
      }
      /**
       * @en Returns the current time.
       * @zh 获取当前帧的时间。
       */

    }, {
      key: "getCurrentTime",
      value: function getCurrentTime() {
        return this._lastUpdate;
      }
      /**
       * @en Returns how many frames were called since the director started.
       * @zh 获取 director 启动以来游戏运行的总帧数。
       */

    }, {
      key: "getTotalFrames",
      value: function getTotalFrames() {
        return this._totalFrames;
      }
      /**
       * @en Returns whether or not the Director is paused.
       * @zh 是否处于暂停状态。
       */

    }, {
      key: "isPaused",
      value: function isPaused() {
        return this._paused;
      }
      /**
       * @en Returns the scheduler associated with this director.
       * @zh 获取和 director 相关联的调度器。
       */

    }, {
      key: "getScheduler",
      value: function getScheduler() {
        return this._scheduler;
      }
      /**
       * @en Sets the scheduler associated with this director.
       * @zh 设置和 director 相关联的调度器。
       */

    }, {
      key: "setScheduler",
      value: function setScheduler(scheduler) {
        if (this._scheduler !== scheduler) {
          this.unregisterSystem(this._scheduler);
          this._scheduler = scheduler;
          this.registerSystem(_scheduler.Scheduler.ID, scheduler, 200);
        }
      }
      /**
       * @en Register a system.
       * @zh 注册一个系统。
       */

    }, {
      key: "registerSystem",
      value: function registerSystem(name, sys, priority) {
        sys.id = name;
        sys.priority = priority;
        sys.init();

        this._systems.push(sys);

        this._systems.sort(_system.default.sortByPriority);
      }
    }, {
      key: "unregisterSystem",
      value: function unregisterSystem(sys) {
        _index3.js.array.fastRemove(this._systems, sys);

        this._systems.sort(_system.default.sortByPriority);
      }
      /**
       * @en get a system.
       * @zh 获取一个 system。
       */

    }, {
      key: "getSystem",
      value: function getSystem(name) {
        return this._systems.find(function (sys) {
          return sys.id === name;
        });
      }
      /**
       * @en Returns the `AnimationManager` associated with this director. Please use getSystem(AnimationManager.ID)
       * @zh 获取和 director 相关联的 `AnimationManager`（动画管理器）。请使用 getSystem(AnimationManager.ID) 来替代
       * @deprecated
       */

    }, {
      key: "getAnimationManager",
      value: function getAnimationManager() {
        return this.getSystem(_globalExports.legacyCC.AnimationManager.ID);
      } // Loop management

      /**
       * @en Starts Animation
       * @zh 开始动画
       */

    }, {
      key: "startAnimation",
      value: function startAnimation() {
        this._invalid = false;
        this._lastUpdate = performance.now();
      }
      /**
       * @en Stops animation
       * @zh 停止动画
       */

    }, {
      key: "stopAnimation",
      value: function stopAnimation() {
        this._invalid = true;
      }
      /**
       * @en Run main loop of director
       * @zh 运行主循环
       */

    }, {
      key: "mainLoop",
      value: function mainLoop(time) {
        if (this._purgeDirectorInNextLoop) {
          this._purgeDirectorInNextLoop = false;
          this.purgeDirector();
        } else if (!this._invalid) {
          // calculate "global" dt
          this.calculateDeltaTime(time);
          var dt = this._deltaTime; // Update

          if (!this._paused) {
            this.emit(Director.EVENT_BEFORE_UPDATE); // Call start for new added components

            this._compScheduler.startPhase(); // Update for components


            this._compScheduler.updatePhase(dt); // Update systems


            for (var i = 0; i < this._systems.length; ++i) {
              this._systems[i].update(dt);
            } // Late update for components


            this._compScheduler.lateUpdatePhase(dt); // User can use this event to do things after update


            this.emit(Director.EVENT_AFTER_UPDATE); // Destroy entities that have been removed recently

            _object.CCObject._deferredDestroy(); // Post update systems


            for (var _i = 0; _i < this._systems.length; ++_i) {
              this._systems[_i].postUpdate(dt);
            }
          }

          this.emit(Director.EVENT_BEFORE_DRAW);

          this._root.frameMove(this._deltaTime);

          this.emit(Director.EVENT_AFTER_DRAW);

          _eventManager.default.frameUpdateListeners();

          _index2.Node.bookOfChange.clear();

          this._totalFrames++;
        }
      }
    }, {
      key: "_initOnRendererInitialized",
      value: function _initOnRendererInitialized() {
        this._totalFrames = 0;
        this._lastUpdate = performance.now();
        this._startTime = this._lastUpdate;
        this._paused = false;
        this._purgeDirectorInNextLoop = false; // Event manager

        if (_eventManager.default) {
          _eventManager.default.setEnabled(true);
        } // Scheduler
        // TODO: have a solid organization of priority and expose to user


        this.registerSystem(_scheduler.Scheduler.ID, this._scheduler, 200);
        this.emit(Director.EVENT_INIT);
      }
    }, {
      key: "_init",
      value: function _init() {
        _globalExports.legacyCC.loader.init(this);

        this._root = new _root.Root(_globalExports.legacyCC.game._gfxDevice);
        var rootInfo = {};

        if (!this._root.initialize(rootInfo)) {
          (0, _debug.errorID)(1217);
          return false;
        }

        return true;
      }
    }, {
      key: "root",
      get: function get() {
        return this._root;
      }
    }]);

    return Director;
  }(_eventTarget.EventTarget);

  _exports.Director = Director;
  Director.EVENT_INIT = 'director_init';
  Director.EVENT_RESET = 'director_reset';
  Director.EVENT_BEFORE_SCENE_LOADING = 'director_before_scene_loading';
  Director.EVENT_BEFORE_SCENE_LAUNCH = 'director_before_scene_launch';
  Director.EVENT_AFTER_SCENE_LAUNCH = 'director_after_scene_launch';
  Director.EVENT_BEFORE_UPDATE = 'director_before_update';
  Director.EVENT_AFTER_UPDATE = 'director_after_update';
  Director.EVENT_BEFORE_DRAW = 'director_before_draw';
  Director.EVENT_AFTER_DRAW = 'director_after_draw';
  Director.EVENT_BEFORE_PHYSICS = 'director_before_physics';
  Director.EVENT_AFTER_PHYSICS = 'director_after_physics';
  Director.instance = void 0;
  _globalExports.legacyCC.Director = Director;
  /**
   * 导演类。
   */

  var director = Director.instance = _globalExports.legacyCC.director = new Director();
  _exports.director = director;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGlyZWN0b3IudHMiXSwibmFtZXMiOlsiRGlyZWN0b3IiLCJfY29tcFNjaGVkdWxlciIsIl9ub2RlQWN0aXZhdG9yIiwiX2ludmFsaWQiLCJfcGF1c2VkIiwiX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wIiwiX3Jvb3QiLCJfbG9hZGluZ1NjZW5lIiwiX3NjZW5lIiwiX3RvdGFsRnJhbWVzIiwiX2xhc3RVcGRhdGUiLCJfZGVsdGFUaW1lIiwiX3N0YXJ0VGltZSIsIl9zY2hlZHVsZXIiLCJfc3lzdGVtcyIsIlNjaGVkdWxlciIsIkNvbXBvbmVudFNjaGVkdWxlciIsIk5vZGVBY3RpdmF0b3IiLCJsZWdhY3lDQyIsImdhbWUiLCJvbmNlIiwiR2FtZSIsIkVWRU5UX1JFTkRFUkVSX0lOSVRFRCIsIl9pbml0T25SZW5kZXJlckluaXRpYWxpemVkIiwibm93IiwicGVyZm9ybWFuY2UiLCJERUJVRyIsInVpUG9pbnQiLCJjb250YWluZXIiLCJ2aWV3IiwiYm94IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwibGVmdCIsIndpbmRvdyIsInBhZ2VYT2Zmc2V0IiwiY2xpZW50TGVmdCIsInRvcCIsInBhZ2VZT2Zmc2V0IiwiY2xpZW50VG9wIiwieCIsIl9kZXZpY2VQaXhlbFJhdGlvIiwieSIsImhlaWdodCIsIl9pc1JvdGF0ZWQiLCJfdmlld3BvcnRSZWN0Iiwid2lkdGgiLCJnbFBvaW50Iiwid2luU2l6ZSIsImxvYWRlciIsInJlbGVhc2VBbGwiLCJ1bnNjaGVkdWxlQWxsIiwicmVzZXQiLCJldmVudE1hbmFnZXIiLCJzZXRFbmFibGVkIiwiRURJVE9SIiwiaXNWYWxpZCIsImRlc3Ryb3kiLCJzdG9wQW5pbWF0aW9uIiwicHVyZ2VEaXJlY3RvciIsImVtaXQiLCJFVkVOVF9SRVNFVCIsInN0YXJ0QW5pbWF0aW9uIiwic2NlbmUiLCJvbkJlZm9yZUxvYWRTY2VuZSIsIm9uTGF1bmNoZWQiLCJTY2VuZSIsInV1aWQiLCJfZ2V0UmVmZXJlbmNlS2V5IiwicmVtb3ZlSXRlbSIsIkJVSUxEIiwiY29uc29sZSIsInRpbWUiLCJfbG9hZCIsInRpbWVFbmQiLCJwZXJzaXN0Tm9kZUxpc3QiLCJPYmplY3QiLCJrZXlzIiwiX3BlcnNpc3RSb290Tm9kZXMiLCJtYXAiLCJpIiwibGVuZ3RoIiwibm9kZSIsIk5vZGUiLCJTQ0VORV9DSEFOR0VEX0ZPUl9QRVJTSVNUUyIsInJlbmRlclNjZW5lIiwiZXhpc3ROb2RlIiwiZ2V0Q2hpbGRCeVV1aWQiLCJpbmRleCIsImdldFNpYmxpbmdJbmRleCIsIl9kZXN0cm95SW1tZWRpYXRlIiwiaW5zZXJ0Q2hpbGQiLCJwYXJlbnQiLCJvbGRTY2VuZSIsImF1dG9SZWxlYXNlQXNzZXRzIiwiZGVwZW5kQXNzZXRzIiwiQ0NPYmplY3QiLCJfZGVmZXJyZWREZXN0cm95IiwiRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCIsIl9hY3RpdmF0ZSIsInJlc2V0Q3VtdWxhdGl2ZVRpbWUiLCJFVkVOVF9BRlRFUl9TQ0VORV9MQVVOQ0giLCJFVkVOVF9BRlRFUl9EUkFXIiwicnVuU2NlbmVJbW1lZGlhdGUiLCJrZXkiLCJzY2VuZXMiLCJfc2NlbmVJbmZvcyIsImVuZHNXaXRoIiwic3RhcnRzV2l0aCIsImluZm8iLCJ1cmwiLCJzY2VuZU5hbWUiLCJvblVubG9hZGVkIiwiX2dldFNjZW5lVXVpZCIsIkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HIiwiX2xvYWRTY2VuZUJ5VXVpZCIsImFyZzEiLCJhcmcyIiwib25Qcm9ncmVzcyIsIm9uTG9hZGVkIiwidW5kZWZpbmVkIiwibG9hZCIsInR5cGUiLCJlcnIiLCJhc3NldCIsIm1lc3NhZ2UiLCJFcnJvciIsImFyZzMiLCJkb05vdFJ1biIsIkFzc2V0TGlicmFyeSIsImxvYWRBc3NldCIsInNjZW5lQXNzZXQiLCJzZWxmIiwiZGlyZWN0b3IiLCJTY2VuZUFzc2V0IiwiX2lkIiwiX3V1aWQiLCJfbmFtZSIsInZhbHVlIiwiQ2FtZXJhIiwibWFpbiIsImRlcHRoIiwiY2xlYXJDb2xvciIsImJhY2tncm91bmRDb2xvciIsImdldEZyYW1lUmF0ZSIsInNldEZyYW1lUmF0ZSIsIk1hdGgiLCJyb3VuZCIsInNjaGVkdWxlciIsInVucmVnaXN0ZXJTeXN0ZW0iLCJyZWdpc3RlclN5c3RlbSIsIklEIiwibmFtZSIsInN5cyIsInByaW9yaXR5IiwiaWQiLCJpbml0IiwicHVzaCIsInNvcnQiLCJTeXN0ZW0iLCJzb3J0QnlQcmlvcml0eSIsImpzIiwiYXJyYXkiLCJmYXN0UmVtb3ZlIiwiZmluZCIsImdldFN5c3RlbSIsIkFuaW1hdGlvbk1hbmFnZXIiLCJjYWxjdWxhdGVEZWx0YVRpbWUiLCJkdCIsIkVWRU5UX0JFRk9SRV9VUERBVEUiLCJzdGFydFBoYXNlIiwidXBkYXRlUGhhc2UiLCJ1cGRhdGUiLCJsYXRlVXBkYXRlUGhhc2UiLCJFVkVOVF9BRlRFUl9VUERBVEUiLCJwb3N0VXBkYXRlIiwiRVZFTlRfQkVGT1JFX0RSQVciLCJmcmFtZU1vdmUiLCJmcmFtZVVwZGF0ZUxpc3RlbmVycyIsImJvb2tPZkNoYW5nZSIsImNsZWFyIiwiRVZFTlRfSU5JVCIsIlJvb3QiLCJfZ2Z4RGV2aWNlIiwicm9vdEluZm8iLCJpbml0aWFsaXplIiwiRXZlbnRUYXJnZXQiLCJFVkVOVF9CRUZPUkVfUEhZU0lDUyIsIkVWRU5UX0FGVEVSX1BIWVNJQ1MiLCJpbnN0YW5jZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1EQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFvRWFBLFE7OztBQUVUOzs7Ozs7QUFLQTs7Ozs7QUFNQTs7Ozs7O0FBS0E7Ozs7O0FBTUE7Ozs7Ozs7QUFNQTs7Ozs7QUFNQTs7Ozs7OztBQU1BOzs7OztBQU1BOzs7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7OztBQUtBOzs7OztBQU1BOzs7Ozs7QUFLQTs7Ozs7QUFNQTs7Ozs7O0FBS0E7Ozs7O0FBTUE7Ozs7O0FBSUE7Ozs7O0FBTUE7Ozs7O0FBTUE7Ozs7QUF1QkEsd0JBQWU7QUFBQTs7QUFBQTs7QUFDWDtBQURXLFlBZlJDLGNBZVE7QUFBQSxZQWRSQyxjQWNRO0FBQUEsWUFiUEMsUUFhTztBQUFBLFlBWlBDLE9BWU87QUFBQSxZQVhQQyx3QkFXTztBQUFBLFlBVlBDLEtBVU87QUFBQSxZQVRQQyxhQVNPO0FBQUEsWUFSUEMsTUFRTztBQUFBLFlBUFBDLFlBT087QUFBQSxZQU5QQyxXQU1PO0FBQUEsWUFMUEMsVUFLTztBQUFBLFlBSlBDLFVBSU87QUFBQSxZQUhQQyxVQUdPO0FBQUEsWUFGUEMsUUFFTztBQUdYLFlBQUtYLFFBQUwsR0FBZ0IsS0FBaEIsQ0FIVyxDQUlYOztBQUNBLFlBQUtDLE9BQUwsR0FBZSxLQUFmLENBTFcsQ0FNWDs7QUFDQSxZQUFLQyx3QkFBTCxHQUFnQyxLQUFoQyxDQVBXLENBU1g7O0FBQ0EsWUFBS0MsS0FBTCxHQUFhLElBQWIsQ0FWVyxDQVlYOztBQUNBLFlBQUtDLGFBQUwsR0FBcUIsRUFBckI7QUFDQSxZQUFLQyxNQUFMLEdBQWMsSUFBZCxDQWRXLENBZ0JYOztBQUNBLFlBQUtDLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxZQUFLQyxXQUFMLEdBQW1CLENBQW5CO0FBQ0EsWUFBS0MsVUFBTCxHQUFrQixHQUFsQjtBQUNBLFlBQUtDLFVBQUwsR0FBa0IsR0FBbEIsQ0FwQlcsQ0FzQlg7O0FBQ0EsWUFBS0MsVUFBTCxHQUFrQixJQUFJRSxvQkFBSixFQUFsQixDQXZCVyxDQXdCWDs7QUFDQSxZQUFLZCxjQUFMLEdBQXNCLElBQUllLHNDQUFKLEVBQXRCLENBekJXLENBMEJYOztBQUNBLFlBQUtkLGNBQUwsR0FBc0IsSUFBSWUsc0JBQUosRUFBdEI7QUFFQSxZQUFLSCxRQUFMLEdBQWdCLEVBQWhCOztBQUVBSSw4QkFBU0MsSUFBVCxDQUFjQyxJQUFkLENBQW1CQyxXQUFLQyxxQkFBeEIsRUFBK0MsTUFBS0MsMEJBQXBEOztBQS9CVztBQWdDZDtBQUVEOzs7Ozs7O3lDQUcyQkMsRyxFQUFLO0FBQzVCLFlBQUksQ0FBQ0EsR0FBTCxFQUFVQSxHQUFHLEdBQUdDLFdBQVcsQ0FBQ0QsR0FBWixFQUFOO0FBRVYsYUFBS2IsVUFBTCxHQUFrQmEsR0FBRyxHQUFHLEtBQUtkLFdBQVgsR0FBeUIsQ0FBQ2MsR0FBRyxHQUFHLEtBQUtkLFdBQVosSUFBMkIsSUFBcEQsR0FBMkQsQ0FBN0U7O0FBQ0EsWUFBSWdCLDJCQUFVLEtBQUtmLFVBQUwsR0FBa0IsQ0FBaEMsRUFBb0M7QUFDaEMsZUFBS0EsVUFBTCxHQUFrQixJQUFJLElBQXRCO0FBQ0g7O0FBRUQsYUFBS0QsV0FBTCxHQUFtQmMsR0FBbkI7QUFDSDtBQUVEOzs7Ozs7Ozs7OztrQ0FRb0JHLE8sRUFBZTtBQUMvQixZQUFNQyxTQUFTLEdBQUdWLHdCQUFTQyxJQUFULENBQWNTLFNBQWhDO0FBQ0EsWUFBTUMsSUFBSSxHQUFHWCx3QkFBU1csSUFBdEI7QUFDQSxZQUFNQyxHQUFHLEdBQUdGLFNBQVMsQ0FBQ0cscUJBQVYsRUFBWjtBQUNBLFlBQU1DLElBQUksR0FBR0YsR0FBRyxDQUFDRSxJQUFKLEdBQVdDLE1BQU0sQ0FBQ0MsV0FBbEIsR0FBZ0NOLFNBQVMsQ0FBQ08sVUFBdkQ7QUFDQSxZQUFNQyxHQUFHLEdBQUdOLEdBQUcsQ0FBQ00sR0FBSixHQUFVSCxNQUFNLENBQUNJLFdBQWpCLEdBQStCVCxTQUFTLENBQUNVLFNBQXJEO0FBQ0EsWUFBTUMsQ0FBQyxHQUFHVixJQUFJLENBQUNXLGlCQUFMLElBQTBCYixPQUFPLENBQUNZLENBQVIsR0FBWVAsSUFBdEMsQ0FBVjtBQUNBLFlBQU1TLENBQUMsR0FBR1osSUFBSSxDQUFDVyxpQkFBTCxJQUEwQkosR0FBRyxHQUFHTixHQUFHLENBQUNZLE1BQVYsR0FBbUJmLE9BQU8sQ0FBQ2MsQ0FBckQsQ0FBVjtBQUNBLGVBQU9aLElBQUksQ0FBQ2MsVUFBTCxHQUFrQixlQUFHZCxJQUFJLENBQUNlLGFBQUwsQ0FBbUJDLEtBQW5CLEdBQTJCSixDQUE5QixFQUFpQ0YsQ0FBakMsQ0FBbEIsR0FBd0QsZUFBR0EsQ0FBSCxFQUFNRSxDQUFOLENBQS9EO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7a0NBUW9CSyxPLEVBQWU7QUFDL0IsWUFBTWxCLFNBQVMsR0FBR1Ysd0JBQVNDLElBQVQsQ0FBY1MsU0FBaEM7QUFDQSxZQUFNQyxJQUFJLEdBQUdYLHdCQUFTVyxJQUF0QjtBQUNBLFlBQU1DLEdBQUcsR0FBR0YsU0FBUyxDQUFDRyxxQkFBVixFQUFaO0FBQ0EsWUFBTUMsSUFBSSxHQUFHRixHQUFHLENBQUNFLElBQUosR0FBV0MsTUFBTSxDQUFDQyxXQUFsQixHQUFnQ04sU0FBUyxDQUFDTyxVQUF2RDtBQUNBLFlBQU1DLEdBQUcsR0FBR04sR0FBRyxDQUFDTSxHQUFKLEdBQVVILE1BQU0sQ0FBQ0ksV0FBakIsR0FBK0JULFNBQVMsQ0FBQ1UsU0FBckQ7QUFDQSxZQUFNWCxPQUFPLEdBQUcsZUFBRyxDQUFILEVBQU0sQ0FBTixDQUFoQjs7QUFDQSxZQUFJRSxJQUFJLENBQUNjLFVBQVQsRUFBcUI7QUFDakJoQixVQUFBQSxPQUFPLENBQUNZLENBQVIsR0FBWVAsSUFBSSxHQUFHYyxPQUFPLENBQUNMLENBQVIsR0FBWVosSUFBSSxDQUFDVyxpQkFBcEM7QUFDQWIsVUFBQUEsT0FBTyxDQUFDYyxDQUFSLEdBQVlMLEdBQUcsR0FBR04sR0FBRyxDQUFDWSxNQUFWLEdBQW1CLENBQUNiLElBQUksQ0FBQ2UsYUFBTCxDQUFtQkMsS0FBbkIsR0FBMkJDLE9BQU8sQ0FBQ1AsQ0FBcEMsSUFBeUNWLElBQUksQ0FBQ1csaUJBQTdFO0FBQ0gsU0FIRCxNQUlLO0FBQ0RiLFVBQUFBLE9BQU8sQ0FBQ1ksQ0FBUixHQUFZUCxJQUFJLEdBQUdjLE9BQU8sQ0FBQ1AsQ0FBUixHQUFZVixJQUFJLENBQUNXLGlCQUFwQztBQUNBYixVQUFBQSxPQUFPLENBQUNjLENBQVIsR0FBWUwsR0FBRyxHQUFHTixHQUFHLENBQUNZLE1BQVYsR0FBbUJJLE9BQU8sQ0FBQ0wsQ0FBUixHQUFZWixJQUFJLENBQUNXLGlCQUFoRDtBQUNIOztBQUNELGVBQU9iLE9BQVA7QUFDSDtBQUVEOzs7Ozs7NEJBR2M7QUFDVixhQUFLdEIsd0JBQUwsR0FBZ0MsSUFBaEM7QUFDSDtBQUVEOzs7Ozs7Ozs7O21DQU9xQjtBQUNqQixlQUFPLGlCQUFLYSx3QkFBUzZCLE9BQWQsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7OzJDQVc2QjtBQUN6QixlQUFPLGlCQUFLN0Isd0JBQVM2QixPQUFkLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs4QkFRZ0I7QUFDWixZQUFJLEtBQUszQyxPQUFULEVBQWtCO0FBQ2Q7QUFDSDs7QUFDRCxhQUFLQSxPQUFMLEdBQWUsSUFBZjtBQUNIO0FBRUQ7Ozs7Ozs7O3dDQUswQjtBQUN0QmMsZ0NBQVM4QixNQUFULENBQWdCQyxVQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7OztzQ0FNd0I7QUFDcEI7QUFDQSxhQUFLcEMsVUFBTCxDQUFnQnFDLGFBQWhCOztBQUNBLGFBQUtqRCxjQUFMLENBQW9CaUQsYUFBcEI7O0FBRUEsYUFBS2hELGNBQUwsQ0FBb0JpRCxLQUFwQixHQUxvQixDQU9wQjs7O0FBQ0EsWUFBSUMscUJBQUosRUFBa0I7QUFDZEEsZ0NBQWFDLFVBQWIsQ0FBd0IsS0FBeEI7QUFDSDs7QUFFRCxZQUFJLENBQUNDLHdCQUFMLEVBQWE7QUFDVCxjQUFJcEMsd0JBQVNxQyxPQUFULENBQWlCLEtBQUsvQyxNQUF0QixDQUFKLEVBQW1DO0FBQy9CLGlCQUFLQSxNQUFMLENBQWFnRCxPQUFiO0FBQ0g7O0FBQ0QsZUFBS2hELE1BQUwsR0FBYyxJQUFkO0FBQ0g7O0FBRUQsYUFBS2lELGFBQUwsR0FuQm9CLENBcUJwQjs7QUFDQXZDLGdDQUFTOEIsTUFBVCxDQUFnQkMsVUFBaEI7QUFDSDtBQUVEOzs7Ozs7OzhCQUlnQjtBQUNaLGFBQUtTLGFBQUw7QUFFQSxhQUFLQyxJQUFMLENBQVUzRCxRQUFRLENBQUM0RCxXQUFuQjs7QUFFQSxZQUFJUixxQkFBSixFQUFrQjtBQUNkQSxnQ0FBYUMsVUFBYixDQUF3QixJQUF4QjtBQUNIOztBQUVELGFBQUtRLGNBQUw7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7d0NBUzBCQyxLLEVBQWNDLGlCLEVBQWdEQyxVLEVBQXVDO0FBQzNILDZCQUFTRixLQUFLLFlBQVk1Qyx3QkFBUytDLEtBQW5DLEVBQTBDLElBQTFDOztBQUVBLFlBQU1DLElBQUksR0FBR2hELHdCQUFTOEIsTUFBVCxDQUFnQm1CLGdCQUFoQixDQUFpQ0wsS0FBSyxDQUFDSSxJQUF2QyxDQUFiLENBSDJILENBSTNIOzs7QUFDQWhELGdDQUFTOEIsTUFBVCxDQUFnQm9CLFVBQWhCLENBQTJCRixJQUEzQjs7QUFFQSxZQUFJRywyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQ2hCNEMsVUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsV0FBYjtBQUNILFNBVDBILENBVTNIOzs7QUFDQVQsUUFBQUEsS0FBSyxDQUFDVSxLQUFOLEdBWDJILENBVzNHOzs7QUFDaEIsWUFBSUgsMkJBQVMzQyx1QkFBYixFQUFvQjtBQUNoQjRDLFVBQUFBLE9BQU8sQ0FBQ0csT0FBUixDQUFnQixXQUFoQjtBQUNILFNBZDBILENBZTNIOzs7QUFDQSxZQUFJSiwyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQ2hCNEMsVUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsZUFBYjtBQUNIOztBQUNELFlBQU1HLGVBQWUsR0FBR0MsTUFBTSxDQUFDQyxJQUFQLENBQVkxRCx3QkFBU0MsSUFBVCxDQUFjMEQsaUJBQTFCLEVBQTZDQyxHQUE3QyxDQUFpRCxVQUFDdkMsQ0FBRCxFQUFPO0FBQzVFLGlCQUFPckIsd0JBQVNDLElBQVQsQ0FBYzBELGlCQUFkLENBQWdDdEMsQ0FBaEMsQ0FBUDtBQUNILFNBRnVCLENBQXhCOztBQUdBLGFBQUssSUFBSXdDLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLGVBQWUsQ0FBQ00sTUFBcEMsRUFBNENELENBQUMsRUFBN0MsRUFBaUQ7QUFDN0MsY0FBTUUsSUFBSSxHQUFHUCxlQUFlLENBQUNLLENBQUQsQ0FBNUI7QUFDQUUsVUFBQUEsSUFBSSxDQUFDdEIsSUFBTCxDQUFVekMsd0JBQVNnRSxJQUFULENBQWNDLDBCQUF4QixFQUFvRHJCLEtBQUssQ0FBQ3NCLFdBQTFEO0FBQ0EsY0FBTUMsU0FBUyxHQUFHdkIsS0FBSyxDQUFDd0IsY0FBTixDQUFxQkwsSUFBSSxDQUFDZixJQUExQixDQUFsQjs7QUFDQSxjQUFJbUIsU0FBSixFQUFlO0FBQ1g7QUFDQSxnQkFBTUUsS0FBSyxHQUFHRixTQUFTLENBQUNHLGVBQVYsRUFBZDs7QUFDQUgsWUFBQUEsU0FBUyxDQUFDSSxpQkFBVjs7QUFDQTNCLFlBQUFBLEtBQUssQ0FBQzRCLFdBQU4sQ0FBa0JULElBQWxCLEVBQXdCTSxLQUF4QjtBQUNILFdBTEQsTUFNSztBQUNETixZQUFBQSxJQUFJLENBQUNVLE1BQUwsR0FBYzdCLEtBQWQ7QUFDSDtBQUNKOztBQUNELFlBQUlPLDJCQUFTM0MsdUJBQWIsRUFBb0I7QUFDaEI0QyxVQUFBQSxPQUFPLENBQUNHLE9BQVIsQ0FBZ0IsZUFBaEI7QUFDSDs7QUFDRCxZQUFNbUIsUUFBUSxHQUFHLEtBQUtwRixNQUF0Qjs7QUFDQSxZQUFJLENBQUM4Qyx3QkFBTCxFQUFhO0FBQ1Q7QUFDQSxjQUFJZSwyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQ2hCNEMsWUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsYUFBYjtBQUNIOztBQUNELGNBQU1zQixpQkFBaUIsR0FBR0QsUUFBUSxJQUFJQSxRQUFRLENBQUNDLGlCQUFyQixJQUEwQ0QsUUFBUSxDQUFDRSxZQUE3RTtBQUNBLDZDQUFZRCxpQkFBWixFQUErQi9CLEtBQUssQ0FBQ2dDLFlBQXJDLEVBQW1EcEIsZUFBbkQ7O0FBQ0EsY0FBSUwsMkJBQVMzQyx1QkFBYixFQUFvQjtBQUNoQjRDLFlBQUFBLE9BQU8sQ0FBQ0csT0FBUixDQUFnQixhQUFoQjtBQUNIO0FBQ0osU0FsRDBILENBb0QzSDs7O0FBQ0EsWUFBSUosMkJBQVMzQyx1QkFBYixFQUFvQjtBQUNoQjRDLFVBQUFBLE9BQU8sQ0FBQ0MsSUFBUixDQUFhLFNBQWI7QUFDSDs7QUFDRCxZQUFJckQsd0JBQVNxQyxPQUFULENBQWlCcUMsUUFBakIsQ0FBSixFQUFnQztBQUM1QkEsVUFBQUEsUUFBUSxDQUFFcEMsT0FBVjtBQUNIOztBQUVELGFBQUtoRCxNQUFMLEdBQWMsSUFBZCxDQTVEMkgsQ0E4RDNIOztBQUNBdUYseUJBQVNDLGdCQUFUOztBQUNBLFlBQUkzQiwyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQUU0QyxVQUFBQSxPQUFPLENBQUNHLE9BQVIsQ0FBZ0IsU0FBaEI7QUFBNkI7O0FBRW5ELFlBQUlWLGlCQUFKLEVBQXVCO0FBQ25CQSxVQUFBQSxpQkFBaUI7QUFDcEI7O0FBQ0QsYUFBS0osSUFBTCxDQUFVekMsd0JBQVNsQixRQUFULENBQWtCaUcseUJBQTVCLEVBQXVEbkMsS0FBdkQsRUFyRTJILENBdUUzSDs7QUFDQSxhQUFLdEQsTUFBTCxHQUFjc0QsS0FBZDs7QUFFQSxZQUFJTywyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQ2hCNEMsVUFBQUEsT0FBTyxDQUFDQyxJQUFSLENBQWEsVUFBYjtBQUNILFNBNUUwSCxDQTZFM0g7OztBQUNBVCxRQUFBQSxLQUFLLENBQUNvQyxTQUFOOztBQUNBLFlBQUk3QiwyQkFBUzNDLHVCQUFiLEVBQW9CO0FBQ2hCNEMsVUFBQUEsT0FBTyxDQUFDRyxPQUFSLENBQWdCLFVBQWhCO0FBQ0gsU0FqRjBILENBa0YzSDs7O0FBQ0EsWUFBSSxLQUFLbkUsS0FBVCxFQUFnQjtBQUNaLGVBQUtBLEtBQUwsQ0FBVzZGLG1CQUFYO0FBQ0g7O0FBQ0QsYUFBS3RDLGNBQUw7O0FBRUEsWUFBSUcsVUFBSixFQUFnQjtBQUNaQSxVQUFBQSxVQUFVLENBQUMsSUFBRCxFQUFPRixLQUFQLENBQVY7QUFDSDs7QUFDRCxhQUFLSCxJQUFMLENBQVV6Qyx3QkFBU2xCLFFBQVQsQ0FBa0JvRyx3QkFBNUIsRUFBc0R0QyxLQUF0RDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7K0JBVWlCQSxLLEVBQWNDLGlCLEVBQWdEQyxVLEVBQXVDO0FBQUE7O0FBQ2xILDZCQUFTRixLQUFULEVBQWdCLElBQWhCO0FBQ0EsNkJBQVNBLEtBQUssWUFBWTVDLHdCQUFTK0MsS0FBbkMsRUFBMEMsSUFBMUMsRUFGa0gsQ0FJbEg7QUFDQTs7QUFDQUgsUUFBQUEsS0FBSyxDQUFDVSxLQUFOLEdBTmtILENBUWxIOzs7QUFDQSxhQUFLcEQsSUFBTCxDQUFVRix3QkFBU2xCLFFBQVQsQ0FBa0JxRyxnQkFBNUIsRUFBOEMsWUFBTTtBQUNoRCxVQUFBLE1BQUksQ0FBQ0MsaUJBQUwsQ0FBdUJ4QyxLQUF2QixFQUE4QkMsaUJBQTlCLEVBQWlEQyxVQUFqRDtBQUNILFNBRkQ7QUFHSCxPLENBRUQ7Ozs7b0NBRXNCdUMsRyxFQUFzQjtBQUN4QyxZQUFNQyxNQUFNLEdBQUd0Rix3QkFBU0MsSUFBVCxDQUFjc0YsV0FBN0I7O0FBQ0EsWUFBSSxPQUFPRixHQUFQLEtBQWUsUUFBbkIsRUFBNkI7QUFDekIsY0FBSSxDQUFDQSxHQUFHLENBQUNHLFFBQUosQ0FBYSxRQUFiLENBQUwsRUFBNkI7QUFDekJILFlBQUFBLEdBQUcsSUFBSSxRQUFQO0FBQ0g7O0FBQ0QsY0FBSUEsR0FBRyxDQUFDLENBQUQsQ0FBSCxLQUFXLEdBQVgsSUFBa0IsQ0FBQ0EsR0FBRyxDQUFDSSxVQUFKLENBQWUsT0FBZixDQUF2QixFQUFnRDtBQUM1Q0osWUFBQUEsR0FBRyxHQUFHLE1BQU1BLEdBQVosQ0FENEMsQ0FDeEI7QUFDdkIsV0FOd0IsQ0FPekI7QUFDQTs7O0FBQ0EsZUFBSyxJQUFJeEIsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3lCLE1BQU0sQ0FBQ3hCLE1BQTNCLEVBQW1DRCxDQUFDLEVBQXBDLEVBQXdDO0FBQ3BDLGdCQUFNNkIsSUFBSSxHQUFHSixNQUFNLENBQUN6QixDQUFELENBQW5COztBQUNBLGdCQUFJNkIsSUFBSSxDQUFDQyxHQUFMLENBQVNILFFBQVQsQ0FBa0JILEdBQWxCLENBQUosRUFBNEI7QUFDeEIscUJBQU9LLElBQVA7QUFDSDtBQUNKO0FBQ0osU0FmRCxNQWdCSyxJQUFJLE9BQU9MLEdBQVAsS0FBZSxRQUFuQixFQUE2QjtBQUM5QixjQUFJLEtBQUtBLEdBQUwsSUFBWUEsR0FBRyxHQUFHQyxNQUFNLENBQUN4QixNQUE3QixFQUFxQztBQUNqQyxtQkFBT3dCLE1BQU0sQ0FBQ0QsR0FBRCxDQUFiO0FBQ0gsV0FGRCxNQUdLO0FBQ0QsZ0NBQVEsSUFBUixFQUFjQSxHQUFkO0FBQ0g7QUFDSixTQVBJLE1BUUE7QUFDRCw4QkFBUSxJQUFSLEVBQWNBLEdBQWQ7QUFDSDs7QUFDRCxlQUFPLElBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztnQ0FRa0JPLFMsRUFBbUI5QyxVLEVBQXVDK0MsVSxFQUFnQztBQUN4RyxZQUFJLEtBQUt4RyxhQUFULEVBQXdCO0FBQ3BCLDZCQUFPLElBQVAsRUFBYXVHLFNBQWIsRUFBd0IsS0FBS3ZHLGFBQTdCO0FBQ0EsaUJBQU8sS0FBUDtBQUNIOztBQUNELFlBQU1xRyxJQUFJLEdBQUcsS0FBS0ksYUFBTCxDQUFtQkYsU0FBbkIsQ0FBYjs7QUFDQSxZQUFJRixJQUFKLEVBQVU7QUFDTixjQUFNMUMsS0FBSSxHQUFHMEMsSUFBSSxDQUFDMUMsSUFBbEI7QUFDQSxlQUFLUCxJQUFMLENBQVV6Qyx3QkFBU2xCLFFBQVQsQ0FBa0JpSCwwQkFBNUIsRUFBd0RILFNBQXhEO0FBQ0EsZUFBS3ZHLGFBQUwsR0FBcUJ1RyxTQUFyQjs7QUFDQSxlQUFLSSxnQkFBTCxDQUFzQmhELEtBQXRCLEVBQTRCRixVQUE1QixFQUF3QytDLFVBQXhDOztBQUNBLGlCQUFPLElBQVA7QUFDSCxTQU5ELE1BT0s7QUFDRCw4QkFBUSxJQUFSLEVBQWNELFNBQWQ7QUFDQSxpQkFBTyxLQUFQO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7bUNBK0JJQSxTLEVBQ0FLLEksRUFDQUMsSSxFQUErQjtBQUMvQixZQUFJQyxVQUFKO0FBQ0EsWUFBSUMsUUFBSjs7QUFFQSxZQUFJRixJQUFJLEtBQUtHLFNBQWIsRUFBd0I7QUFDcEJELFVBQUFBLFFBQVEsR0FBR0gsSUFBWDtBQUNBRSxVQUFBQSxVQUFVLEdBQUcsS0FBSyxDQUFsQjtBQUNILFNBSEQsTUFHTztBQUNIQyxVQUFBQSxRQUFRLEdBQUdGLElBQVg7QUFDQUMsVUFBQUEsVUFBVSxHQUFHRixJQUFiO0FBQ0g7O0FBRUQsWUFBTVAsSUFBSSxHQUFHLEtBQUtJLGFBQUwsQ0FBbUJGLFNBQW5CLENBQWI7O0FBQ0EsWUFBSUYsSUFBSixFQUFVO0FBQ04sZUFBS2pELElBQUwsQ0FBVXpDLHdCQUFTbEIsUUFBVCxDQUFrQmlILDBCQUE1QixFQUF3REgsU0FBeEQ7O0FBQ0E1RixrQ0FBUzhCLE1BQVQsQ0FBZ0J3RSxJQUFoQixDQUFxQjtBQUFFdEQsWUFBQUEsSUFBSSxFQUFFMEMsSUFBSSxDQUFDMUMsSUFBYjtBQUFtQnVELFlBQUFBLElBQUksRUFBRTtBQUF6QixXQUFyQixFQUNJSixVQURKLEVBRUksVUFBQ0ssR0FBRCxFQUFvQkMsS0FBcEIsRUFBMEM7QUFDdEMsZ0JBQUlELEdBQUosRUFBUztBQUNMLGtDQUFRLElBQVIsRUFBY1osU0FBZCxFQUF5QlksR0FBRyxDQUFDRSxPQUE3QjtBQUNIOztBQUNELGdCQUFJTixRQUFKLEVBQWM7QUFDVkEsY0FBQUEsUUFBUSxDQUFDSSxHQUFELEVBQU1DLEtBQU4sQ0FBUjtBQUNIO0FBQ0osV0FUTDtBQVVILFNBWkQsTUFhSztBQUNELGNBQU1ELEdBQUcsR0FBRyxnQ0FBZ0NaLFNBQWhDLEdBQTRDLDRDQUF4RDs7QUFDQSxjQUFJUSxRQUFKLEVBQWM7QUFDVkEsWUFBQUEsUUFBUSxDQUFDLElBQUlPLEtBQUosQ0FBVUgsR0FBVixDQUFELENBQVI7QUFDSDs7QUFDRCw0QkFBTSxtQkFBbUJBLEdBQXpCO0FBQ0g7QUFDSjtBQUVEOzs7Ozs7Ozs7dUNBYUl4RCxJLEVBQ0FpRCxJLEVBQ0FDLEksRUFDQVUsSSxFQUFnQjtBQUNoQixZQUFJOUQsVUFBSjtBQUNBLFlBQUkrQyxVQUFKO0FBQ0EsWUFBSWdCLFFBQUo7O0FBRUEsWUFBSXpFLDRCQUFVLE9BQU82RCxJQUFQLEtBQWdCLFNBQTlCLEVBQXlDO0FBQ3JDWSxVQUFBQSxRQUFRLEdBQUdaLElBQVg7QUFDQUosVUFBQUEsVUFBVSxHQUFHSyxJQUFiO0FBQ0gsU0FIRCxNQUdPLElBQUk5RCw0QkFBVSxPQUFPOEQsSUFBUCxLQUFnQixTQUE5QixFQUF5QztBQUM1Q1csVUFBQUEsUUFBUSxHQUFHWCxJQUFYO0FBQ0FwRCxVQUFBQSxVQUFVLEdBQUdtRCxJQUFiO0FBQ0gsU0FITSxNQUdBO0FBQ0huRCxVQUFBQSxVQUFVLEdBQUdtRCxJQUFiO0FBQ0FKLFVBQUFBLFVBQVUsR0FBR0ssSUFBYjtBQUNBVyxVQUFBQSxRQUFRLEdBQUdELElBQVg7QUFDSCxTQWZlLENBaUJoQjs7O0FBQ0F4RCxRQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxlQUFlTCxJQUE1Qjs7QUFDQWhELGdDQUFTOEcsWUFBVCxDQUFzQkMsU0FBdEIsQ0FBZ0MvRCxJQUFoQyxFQUFzQyxVQUFDd0QsR0FBRCxFQUFNUSxVQUFOLEVBQXFCO0FBQ3ZENUQsVUFBQUEsT0FBTyxDQUFDRyxPQUFSLENBQWdCLGVBQWVQLElBQS9CO0FBQ0EsY0FBTWlFLElBQUksR0FBR0MsUUFBYjtBQUNBRCxVQUFBQSxJQUFJLENBQUM1SCxhQUFMLEdBQXFCLEVBQXJCOztBQUNBLGNBQUltSCxHQUFKLEVBQVM7QUFDTEEsWUFBQUEsR0FBRyxHQUFHLDJCQUEyQkEsR0FBakM7QUFDQSw4QkFBTUEsR0FBTjtBQUNILFdBSEQsTUFJSztBQUNELGdCQUFJUSxVQUFVLFlBQVloSCx3QkFBU21ILFVBQW5DLEVBQStDO0FBQzNDLGtCQUFNdkUsTUFBSyxHQUFHb0UsVUFBVSxDQUFDcEUsS0FBekI7QUFDQUEsY0FBQUEsTUFBSyxDQUFDd0UsR0FBTixHQUFZSixVQUFVLENBQUNLLEtBQXZCO0FBQ0F6RSxjQUFBQSxNQUFLLENBQUMwRSxLQUFOLEdBQWNOLFVBQVUsQ0FBQ00sS0FBekI7O0FBQ0Esa0JBQUlsRix3QkFBSixFQUFZO0FBQ1Isb0JBQUksQ0FBQ3lFLFFBQUwsRUFBZTtBQUNYSSxrQkFBQUEsSUFBSSxDQUFDN0IsaUJBQUwsQ0FBdUJ4QyxNQUF2QixFQUE4QmlELFVBQTlCLEVBQTBDL0MsVUFBMUM7QUFDSCxpQkFGRCxNQUdLO0FBQ0RGLGtCQUFBQSxNQUFLLENBQUNVLEtBQU47O0FBQ0Esc0JBQUlSLFVBQUosRUFBZ0I7QUFDWkEsb0JBQUFBLFVBQVUsQ0FBQyxJQUFELEVBQU9GLE1BQVAsQ0FBVjtBQUNIO0FBQ0o7QUFDSixlQVZELE1BV0s7QUFDRHFFLGdCQUFBQSxJQUFJLENBQUM3QixpQkFBTCxDQUF1QnhDLE1BQXZCLEVBQThCaUQsVUFBOUIsRUFBMEMvQyxVQUExQztBQUNIOztBQUNEO0FBQ0gsYUFuQkQsTUFvQks7QUFDRDBELGNBQUFBLEdBQUcsR0FBRyxlQUFleEQsSUFBZixHQUFzQixpQkFBNUI7QUFDQSxnQ0FBTXdELEdBQU47QUFDSDtBQUNKOztBQUNELGNBQUkxRCxVQUFKLEVBQWdCO0FBQ1pBLFlBQUFBLFVBQVUsQ0FBQzBELEdBQUQsQ0FBVjtBQUNIO0FBQ0osU0FyQ0Q7QUFzQ0g7QUFFRDs7Ozs7OzsrQkFJaUI7QUFDYixZQUFJLENBQUMsS0FBS3RILE9BQVYsRUFBbUI7QUFDZjtBQUNIOztBQUVELGFBQUtNLFdBQUwsR0FBbUJlLFdBQVcsQ0FBQ0QsR0FBWixFQUFuQjs7QUFDQSxZQUFJLENBQUMsS0FBS2QsV0FBVixFQUF1QjtBQUNuQiw0QkFBTSxJQUFOO0FBQ0g7O0FBRUQsYUFBS04sT0FBTCxHQUFlLEtBQWY7QUFDQSxhQUFLTyxVQUFMLEdBQWtCLENBQWxCO0FBQ0g7QUFFRDs7Ozs7Ozs7OzttQ0FPcUI4SCxLLEVBQWdCO0FBQ2pDLFlBQUksQ0FBQ3ZILHdCQUFTd0gsTUFBVCxDQUFnQkMsSUFBckIsRUFBMkI7QUFDdkI7QUFDSDs7QUFDRHpILGdDQUFTd0gsTUFBVCxDQUFnQkMsSUFBaEIsQ0FBcUJDLEtBQXJCLEdBQTZCLENBQUMsQ0FBQ0gsS0FBL0I7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7b0NBU3NCSSxVLEVBQW1CO0FBQ3JDLFlBQUksQ0FBQzNILHdCQUFTd0gsTUFBVCxDQUFnQkMsSUFBckIsRUFBMkI7QUFDdkI7QUFDSDs7QUFDRHpILGdDQUFTd0gsTUFBVCxDQUFnQkMsSUFBaEIsQ0FBcUJHLGVBQXJCLEdBQXVDRCxVQUF2QztBQUNIOzs7O0FBTUQ7Ozs7O3dDQUswQjtBQUN0QixlQUFPLEtBQUtySSxNQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVaUM7QUFDN0IsZUFBTyxLQUFLQSxNQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7NkNBSytCO0FBQzNCLGVBQU8sT0FBT1Usd0JBQVNDLElBQVQsQ0FBYzRILFlBQWQsRUFBZDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OzJDQVE2Qk4sSyxFQUFlO0FBQ3hDdkgsZ0NBQVNDLElBQVQsQ0FBYzZILFlBQWQsQ0FBMkJDLElBQUksQ0FBQ0MsS0FBTCxDQUFXLE9BQU9ULEtBQWxCLENBQTNCO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLOUgsVUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7cUNBSXVCO0FBQ25CLGVBQU9jLFdBQVcsQ0FBQ0QsR0FBWixLQUFvQixLQUFLWixVQUFoQztBQUNIO0FBRUQ7Ozs7Ozs7dUNBSXlCO0FBQ3JCLGVBQU8sS0FBS0YsV0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7dUNBSXlCO0FBQ3JCLGVBQU8sS0FBS0QsWUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7aUNBSW1CO0FBQ2YsZUFBTyxLQUFLTCxPQUFaO0FBQ0g7QUFFRDs7Ozs7OztxQ0FJdUI7QUFDbkIsZUFBTyxLQUFLUyxVQUFaO0FBQ0g7QUFFRDs7Ozs7OzttQ0FJcUJzSSxTLEVBQXNCO0FBQ3ZDLFlBQUksS0FBS3RJLFVBQUwsS0FBb0JzSSxTQUF4QixFQUFtQztBQUMvQixlQUFLQyxnQkFBTCxDQUFzQixLQUFLdkksVUFBM0I7QUFDQSxlQUFLQSxVQUFMLEdBQWtCc0ksU0FBbEI7QUFDQSxlQUFLRSxjQUFMLENBQW9CdEkscUJBQVV1SSxFQUE5QixFQUFrQ0gsU0FBbEMsRUFBNkMsR0FBN0M7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7cUNBSXVCSSxJLEVBQWNDLEcsRUFBYUMsUSxFQUFrQjtBQUNoRUQsUUFBQUEsR0FBRyxDQUFDRSxFQUFKLEdBQVNILElBQVQ7QUFDQUMsUUFBQUEsR0FBRyxDQUFDQyxRQUFKLEdBQWVBLFFBQWY7QUFDQUQsUUFBQUEsR0FBRyxDQUFDRyxJQUFKOztBQUNBLGFBQUs3SSxRQUFMLENBQWM4SSxJQUFkLENBQW1CSixHQUFuQjs7QUFDQSxhQUFLMUksUUFBTCxDQUFjK0ksSUFBZCxDQUFtQkMsZ0JBQU9DLGNBQTFCO0FBQ0g7Ozt1Q0FFd0JQLEcsRUFBYTtBQUNsQ1EsbUJBQUdDLEtBQUgsQ0FBU0MsVUFBVCxDQUFvQixLQUFLcEosUUFBekIsRUFBbUMwSSxHQUFuQzs7QUFDQSxhQUFLMUksUUFBTCxDQUFjK0ksSUFBZCxDQUFtQkMsZ0JBQU9DLGNBQTFCO0FBQ0g7QUFFRDs7Ozs7OztnQ0FJa0JSLEksRUFBYztBQUM1QixlQUFPLEtBQUt6SSxRQUFMLENBQWNxSixJQUFkLENBQW1CLFVBQUNYLEdBQUQsRUFBUztBQUMvQixpQkFBT0EsR0FBRyxDQUFDRSxFQUFKLEtBQVdILElBQWxCO0FBQ0gsU0FGTSxDQUFQO0FBR0g7QUFFRDs7Ozs7Ozs7NENBS21DO0FBQy9CLGVBQU8sS0FBS2EsU0FBTCxDQUFlbEosd0JBQVNtSixnQkFBVCxDQUEwQmYsRUFBekMsQ0FBUDtBQUNILE8sQ0FFRDs7QUFDQTs7Ozs7Ozt1Q0FJeUI7QUFDckIsYUFBS25KLFFBQUwsR0FBZ0IsS0FBaEI7QUFDQSxhQUFLTyxXQUFMLEdBQW1CZSxXQUFXLENBQUNELEdBQVosRUFBbkI7QUFDSDtBQUVEOzs7Ozs7O3NDQUl3QjtBQUNwQixhQUFLckIsUUFBTCxHQUFnQixJQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7K0JBSWlCb0UsSSxFQUFjO0FBQzNCLFlBQUksS0FBS2xFLHdCQUFULEVBQW1DO0FBQy9CLGVBQUtBLHdCQUFMLEdBQWdDLEtBQWhDO0FBQ0EsZUFBS3FELGFBQUw7QUFDSCxTQUhELE1BSUssSUFBSSxDQUFDLEtBQUt2RCxRQUFWLEVBQW9CO0FBQ3JCO0FBQ0EsZUFBS21LLGtCQUFMLENBQXdCL0YsSUFBeEI7QUFDQSxjQUFNZ0csRUFBRSxHQUFHLEtBQUs1SixVQUFoQixDQUhxQixDQUtyQjs7QUFDQSxjQUFJLENBQUMsS0FBS1AsT0FBVixFQUFtQjtBQUNmLGlCQUFLdUQsSUFBTCxDQUFVM0QsUUFBUSxDQUFDd0ssbUJBQW5CLEVBRGUsQ0FFZjs7QUFDQSxpQkFBS3ZLLGNBQUwsQ0FBb0J3SyxVQUFwQixHQUhlLENBSWY7OztBQUNBLGlCQUFLeEssY0FBTCxDQUFvQnlLLFdBQXBCLENBQWdDSCxFQUFoQyxFQUxlLENBTWY7OztBQUNBLGlCQUFLLElBQUl4RixDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEtBQUtqRSxRQUFMLENBQWNrRSxNQUFsQyxFQUEwQyxFQUFFRCxDQUE1QyxFQUErQztBQUMzQyxtQkFBS2pFLFFBQUwsQ0FBY2lFLENBQWQsRUFBaUI0RixNQUFqQixDQUF3QkosRUFBeEI7QUFDSCxhQVRjLENBVWY7OztBQUNBLGlCQUFLdEssY0FBTCxDQUFvQjJLLGVBQXBCLENBQW9DTCxFQUFwQyxFQVhlLENBWWY7OztBQUNBLGlCQUFLNUcsSUFBTCxDQUFVM0QsUUFBUSxDQUFDNkssa0JBQW5CLEVBYmUsQ0FjZjs7QUFDQTlFLDZCQUFTQyxnQkFBVCxHQWZlLENBaUJmOzs7QUFDQSxpQkFBSyxJQUFJakIsRUFBQyxHQUFHLENBQWIsRUFBZ0JBLEVBQUMsR0FBRyxLQUFLakUsUUFBTCxDQUFja0UsTUFBbEMsRUFBMEMsRUFBRUQsRUFBNUMsRUFBK0M7QUFDM0MsbUJBQUtqRSxRQUFMLENBQWNpRSxFQUFkLEVBQWlCK0YsVUFBakIsQ0FBNEJQLEVBQTVCO0FBQ0g7QUFDSjs7QUFFRCxlQUFLNUcsSUFBTCxDQUFVM0QsUUFBUSxDQUFDK0ssaUJBQW5COztBQUNBLGVBQUt6SyxLQUFMLENBQVkwSyxTQUFaLENBQXNCLEtBQUtySyxVQUEzQjs7QUFDQSxlQUFLZ0QsSUFBTCxDQUFVM0QsUUFBUSxDQUFDcUcsZ0JBQW5COztBQUVBakQsZ0NBQWE2SCxvQkFBYjs7QUFDQS9GLHVCQUFLZ0csWUFBTCxDQUFrQkMsS0FBbEI7O0FBQ0EsZUFBSzFLLFlBQUw7QUFDSDtBQUNKOzs7bURBRXFDO0FBQ2xDLGFBQUtBLFlBQUwsR0FBb0IsQ0FBcEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CZSxXQUFXLENBQUNELEdBQVosRUFBbkI7QUFDQSxhQUFLWixVQUFMLEdBQWtCLEtBQUtGLFdBQXZCO0FBQ0EsYUFBS04sT0FBTCxHQUFlLEtBQWY7QUFDQSxhQUFLQyx3QkFBTCxHQUFnQyxLQUFoQyxDQUxrQyxDQU9sQzs7QUFDQSxZQUFJK0MscUJBQUosRUFBa0I7QUFDZEEsZ0NBQWFDLFVBQWIsQ0FBd0IsSUFBeEI7QUFDSCxTQVZpQyxDQVlsQztBQUNBOzs7QUFDQSxhQUFLZ0csY0FBTCxDQUFvQnRJLHFCQUFVdUksRUFBOUIsRUFBa0MsS0FBS3pJLFVBQXZDLEVBQW1ELEdBQW5EO0FBRUEsYUFBSzhDLElBQUwsQ0FBVTNELFFBQVEsQ0FBQ29MLFVBQW5CO0FBQ0g7Ozs4QkFFZ0I7QUFDYmxLLGdDQUFTOEIsTUFBVCxDQUFnQjJHLElBQWhCLENBQXFCLElBQXJCOztBQUNBLGFBQUtySixLQUFMLEdBQWEsSUFBSStLLFVBQUosQ0FBU25LLHdCQUFTQyxJQUFULENBQWNtSyxVQUF2QixDQUFiO0FBQ0EsWUFBTUMsUUFBUSxHQUFHLEVBQWpCOztBQUNBLFlBQUksQ0FBQyxLQUFLakwsS0FBTCxDQUFXa0wsVUFBWCxDQUFzQkQsUUFBdEIsQ0FBTCxFQUFzQztBQUNsQyw4QkFBUSxJQUFSO0FBQ0EsaUJBQU8sS0FBUDtBQUNIOztBQUVELGVBQU8sSUFBUDtBQUNIOzs7MEJBL09XO0FBQ1IsZUFBTyxLQUFLakwsS0FBWjtBQUNIOzs7O0lBdHNCeUJtTCx3Qjs7O0FBQWpCekwsRUFBQUEsUSxDQVdjb0wsVSxHQUFhLGU7QUFYM0JwTCxFQUFBQSxRLENBc0JjNEQsVyxHQUFjLGdCO0FBdEI1QjVELEVBQUFBLFEsQ0FrQ2NpSCwwQixHQUE2QiwrQjtBQWxDM0NqSCxFQUFBQSxRLENBOENjaUcseUIsR0FBNEIsOEI7QUE5QzFDakcsRUFBQUEsUSxDQTBEY29HLHdCLEdBQTJCLDZCO0FBMUR6Q3BHLEVBQUFBLFEsQ0FxRWN3SyxtQixHQUFzQix3QjtBQXJFcEN4SyxFQUFBQSxRLENBZ0ZjNkssa0IsR0FBcUIsdUI7QUFoRm5DN0ssRUFBQUEsUSxDQTJGYytLLGlCLEdBQW9CLHNCO0FBM0ZsQy9LLEVBQUFBLFEsQ0FxR2NxRyxnQixHQUFtQixxQjtBQXJHakNyRyxFQUFBQSxRLENBMkdjMEwsb0IsR0FBdUIseUI7QUEzR3JDMUwsRUFBQUEsUSxDQWlIYzJMLG1CLEdBQXNCLHdCO0FBakhwQzNMLEVBQUFBLFEsQ0FtSEs0TCxRO0FBbzFCbEIxSywwQkFBU2xCLFFBQVQsR0FBb0JBLFFBQXBCO0FBRUE7Ozs7QUFHTyxNQUFNb0ksUUFBa0IsR0FBR3BJLFFBQVEsQ0FBQzRMLFFBQVQsR0FBb0IxSyx3QkFBU2tILFFBQVQsR0FBb0IsSUFBSXBJLFFBQUosRUFBbkUiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDA4LTIwMTAgUmljYXJkbyBRdWVzYWRhXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMiBjb2NvczJkLXgub3JnXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zMmQteC5vcmdcclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXHJcbiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXHJcbiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXHJcbiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcclxuIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XHJcblxyXG4gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cclxuIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLyogc3BlbGwtY2hlY2tlcjp3b3JkcyBDT09SRCwgUXVlc2FkYSwgSU5JVEVELCBSZW5lcmVyICovXHJcblxyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBTY2VuZUFzc2V0IH0gZnJvbSAnLi9hc3NldHMnO1xyXG5pbXBvcnQgU3lzdGVtIGZyb20gJy4vY29tcG9uZW50cy9zeXN0ZW0nO1xyXG5pbXBvcnQgeyBDQ09iamVjdCB9IGZyb20gJy4vZGF0YS9vYmplY3QnO1xyXG5pbXBvcnQgeyBFdmVudFRhcmdldCB9IGZyb20gJy4vZXZlbnQvZXZlbnQtdGFyZ2V0JztcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gJy4vZ2FtZSc7XHJcbmltcG9ydCB7IGF1dG9SZWxlYXNlIH0gZnJvbSAnLi9sb2FkLXBpcGVsaW5lL2F1dG8tcmVsZWFzZS11dGlscyc7XHJcbmltcG9ydCB7IENvbG9yLCBzaXplLCB2MiwgVmVjMiB9IGZyb20gJy4vbWF0aCc7XHJcbmltcG9ydCBldmVudE1hbmFnZXIgZnJvbSAnLi9wbGF0Zm9ybS9ldmVudC1tYW5hZ2VyL2V2ZW50LW1hbmFnZXInO1xyXG5pbXBvcnQgeyBSb290IH0gZnJvbSAnLi9yb290JztcclxuaW1wb3J0IHsgTm9kZSwgU2NlbmUgfSBmcm9tICcuL3NjZW5lLWdyYXBoJztcclxuaW1wb3J0IHsgQ29tcG9uZW50U2NoZWR1bGVyIH0gZnJvbSAnLi9zY2VuZS1ncmFwaC9jb21wb25lbnQtc2NoZWR1bGVyJztcclxuaW1wb3J0IE5vZGVBY3RpdmF0b3IgZnJvbSAnLi9zY2VuZS1ncmFwaC9ub2RlLWFjdGl2YXRvcic7XHJcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4vc2NoZWR1bGVyJztcclxuaW1wb3J0IHsganMgfSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHsgREVCVUcsIEVESVRPUiwgQlVJTEQgfSBmcm9tICdpbnRlcm5hbDpjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBsZWdhY3lDQyB9IGZyb20gJy4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5pbXBvcnQgeyBlcnJvcklELCBlcnJvciwgbG9nSUQsIGFzc2VydElELCB3YXJuSUQgfSBmcm9tICcuL3BsYXRmb3JtL2RlYnVnJztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogPHA+XHJcbiAqICAgIEFUVEVOVElPTjogVVNFIGBkaXJlY3RvcmAgSU5TVEVBRCBPRiBgRGlyZWN0b3JgLjxici8+XHJcbiAqICAgIGBkaXJlY3RvcmAgaXMgYSBzaW5nbGV0b24gb2JqZWN0IHdoaWNoIG1hbmFnZSB5b3VyIGdhbWUncyBsb2dpYyBmbG93Ljxici8+XHJcbiAqICAgIFNpbmNlIHRoZSBgZGlyZWN0b3JgIGlzIGEgc2luZ2xldG9uLCB5b3UgZG9uJ3QgbmVlZCB0byBjYWxsIGFueSBjb25zdHJ1Y3RvciBvciBjcmVhdGUgZnVuY3Rpb25zLDxici8+XHJcbiAqICAgIHRoZSBzdGFuZGFyZCB3YXkgdG8gdXNlIGl0IGlzIGJ5IGNhbGxpbmc6PGJyLz5cclxuICogICAgICAtIGBkaXJlY3Rvci5tZXRob2ROYW1lKCk7YCA8YnIvPlxyXG4gKlxyXG4gKiAgICBJdCBjcmVhdGVzIGFuZCBoYW5kbGUgdGhlIG1haW4gV2luZG93IGFuZCBtYW5hZ2VzIGhvdyBhbmQgd2hlbiB0byBleGVjdXRlIHRoZSBTY2VuZXMuPGJyLz5cclxuICogICAgPGJyLz5cclxuICogICAgVGhlIGBkaXJlY3RvcmAgaXMgYWxzbyByZXNwb25zaWJsZSBmb3I6PGJyLz5cclxuICogICAgICAtIGluaXRpYWxpemluZyB0aGUgT3BlbkdMIGNvbnRleHQ8YnIvPlxyXG4gKiAgICAgIC0gc2V0dGluZyB0aGUgT3BlbkdMIHBpeGVsIGZvcm1hdCAoZGVmYXVsdCBvbiBpcyBSR0I1NjUpPGJyLz5cclxuICogICAgICAtIHNldHRpbmcgdGhlIE9wZW5HTCBidWZmZXIgZGVwdGggKGRlZmF1bHQgb24gaXMgMC1iaXQpPGJyLz5cclxuICogICAgICAtIHNldHRpbmcgdGhlIGNvbG9yIGZvciBjbGVhciBzY3JlZW4gKGRlZmF1bHQgb25lIGlzIEJMQUNLKTxici8+XHJcbiAqICAgICAgLSBzZXR0aW5nIHRoZSBwcm9qZWN0aW9uIChkZWZhdWx0IG9uZSBpcyAzRCk8YnIvPlxyXG4gKiAgICAgIC0gc2V0dGluZyB0aGUgb3JpZW50YXRpb24gKGRlZmF1bHQgb25lIGlzIFBvcnRyYWl0KTxici8+XHJcbiAqICAgICAgPGJyLz5cclxuICogICAgPGJyLz5cclxuICogICAgVGhlIGBkaXJlY3RvcmAgYWxzbyBzZXRzIHRoZSBkZWZhdWx0IE9wZW5HTCBjb250ZXh0Ojxici8+XHJcbiAqICAgICAgLSBHTF9URVhUVVJFXzJEIGlzIGVuYWJsZWQ8YnIvPlxyXG4gKiAgICAgIC0gR0xfVkVSVEVYX0FSUkFZIGlzIGVuYWJsZWQ8YnIvPlxyXG4gKiAgICAgIC0gR0xfQ09MT1JfQVJSQVkgaXMgZW5hYmxlZDxici8+XHJcbiAqICAgICAgLSBHTF9URVhUVVJFX0NPT1JEX0FSUkFZIGlzIGVuYWJsZWQ8YnIvPlxyXG4gKiA8L3A+XHJcbiAqIDxwPlxyXG4gKiAgIGBkaXJlY3RvcmAgYWxzbyBzeW5jaHJvbml6ZXMgdGltZXJzIHdpdGggdGhlIHJlZnJlc2ggcmF0ZSBvZiB0aGUgZGlzcGxheS48YnIvPlxyXG4gKiAgIEZlYXR1cmVzIGFuZCBMaW1pdGF0aW9uczo8YnIvPlxyXG4gKiAgICAgIC0gU2NoZWR1bGVkIHRpbWVycyAmIGRyYXdpbmcgYXJlIHN5bmNocm9uaXplcyB3aXRoIHRoZSByZWZyZXNoIHJhdGUgb2YgdGhlIGRpc3BsYXk8YnIvPlxyXG4gKiAgICAgIC0gT25seSBzdXBwb3J0cyBhbmltYXRpb24gaW50ZXJ2YWxzIG9mIDEvNjAgMS8zMCAmIDEvMTU8YnIvPlxyXG4gKiA8L3A+XHJcbiAqXHJcbiAqIEB6aFxyXG4gKiA8cD5cclxuICogICAgIOazqOaEj++8mueUqCBgZGlyZWN0b3JgIOS7o+abvyBgRGlyZWN0b3Jg44CCPGJyLz5cclxuICogICAgIGBkaXJlY3RvcmAg5LiA5Liq566h55CG5L2g55qE5ri45oiP55qE6YC76L6R5rWB56iL55qE5Y2V5L6L5a+56LGh44CCPGJyLz5cclxuICogICAgIOeUseS6jiBgZGlyZWN0b3JgIOaYr+S4gOS4quWNleS+i++8jOS9oOS4jemcgOimgeiwg+eUqOS7u+S9leaehOmAoOWHveaVsOaIluWIm+W7uuWHveaVsO+8jDxici8+XHJcbiAqICAgICDkvb/nlKjlroPnmoTmoIflh4bmlrnms5XmmK/pgJrov4fosIPnlKjvvJo8YnIvPlxyXG4gKiAgICAgICAtIGBkaXJlY3Rvci5tZXRob2ROYW1lKCk7YFxyXG4gKiAgICAgPGJyLz5cclxuICogICAgIOWug+WIm+W7uuWSjOWkhOeQhuS4u+eql+WPo+W5tuS4lOeuoeeQhuS7gOS5iOaXtuWAmeaJp+ihjOWcuuaZr+OAgjxici8+XHJcbiAqICAgICA8YnIvPlxyXG4gKiAgICAgYGRpcmVjdG9yYCDov5jotJ/otKPvvJo8YnIvPlxyXG4gKiAgICAgIC0g5Yid5aeL5YyWIE9wZW5HTCDnjq/looPjgII8YnIvPlxyXG4gKiAgICAgIC0g6K6+572uT3BlbkdM5YOP57Sg5qC85byP44CCKOm7mOiupOaYryBSR0I1NjUpPGJyLz5cclxuICogICAgICAtIOiuvue9rk9wZW5HTOe8k+WGsuWMuua3seW6piAo6buY6K6k5pivIDAtYml0KTxici8+XHJcbiAqICAgICAgLSDorr7nva7nqbrnmb3lnLrmma/nmoTpopzoibIgKOm7mOiupOaYryDpu5HoibIpPGJyLz5cclxuICogICAgICAtIOiuvue9ruaKleW9sSAo6buY6K6k5pivIDNEKTxici8+XHJcbiAqICAgICAgLSDorr7nva7mlrnlkJEgKOm7mOiupOaYryBQb3J0cmFpdCk8YnIvPlxyXG4gKiAgICA8YnIvPlxyXG4gKiAgICBgZGlyZWN0b3JgIOiuvue9ruS6hiBPcGVuR0wg6buY6K6k546v5aKDIDxici8+XHJcbiAqICAgICAgLSBHTF9URVhUVVJFXzJEICAg5ZCv55So44CCPGJyLz5cclxuICogICAgICAtIEdMX1ZFUlRFWF9BUlJBWSDlkK/nlKjjgII8YnIvPlxyXG4gKiAgICAgIC0gR0xfQ09MT1JfQVJSQVkgIOWQr+eUqOOAgjxici8+XHJcbiAqICAgICAgLSBHTF9URVhUVVJFX0NPT1JEX0FSUkFZIOWQr+eUqOOAgjxici8+XHJcbiAqIDwvcD5cclxuICogPHA+XHJcbiAqICAgYGRpcmVjdG9yYCDkuZ/lkIzmraXlrprml7blmajkuI7mmL7npLrlmajnmoTliLfmlrDpgJ/njofjgIJcclxuICogICA8YnIvPlxyXG4gKiAgIOeJueeCueWSjOWxgOmZkOaApzogPGJyLz5cclxuICogICAgICAtIOWwhuiuoeaXtuWZqCAmIOa4suafk+S4juaYvuekuuWZqOeahOWIt+aWsOmikeeOh+WQjOatpeOAgjxici8+XHJcbiAqICAgICAgLSDlj6rmlK/mjIHliqjnlLvnmoTpl7TpmpQgMS82MCAxLzMwICYgMS8xNeOAgjxici8+XHJcbiAqIDwvcD5cclxuICpcclxuICogQGNsYXNzIERpcmVjdG9yXHJcbiAqIEBleHRlbmRzIEV2ZW50VGFyZ2V0XHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgRGlyZWN0b3IgZXh0ZW5kcyBFdmVudFRhcmdldCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIHdoZW4gdGhlIHNpbmdsZXRvbiBvZiBEaXJlY3RvciBpbml0aWFsaXplZC5cclxuICAgICAqIEB6aCBEaXJlY3RvciDljZXkvovliJ3lp4vljJbml7bop6blj5HnmoTkuovku7ZcclxuICAgICAqIEBldmVudCBEaXJlY3Rvci5FVkVOVF9JTklUXHJcbiAgICAgKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBzaW5nbGV0b24gb2YgRGlyZWN0b3IgaW5pdGlhbGl6ZWQuXHJcbiAgICAgKiBAemggRGlyZWN0b3Ig5Y2V5L6L5Yid5aeL5YyW5pe26Kem5Y+R55qE5LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRVZFTlRfSU5JVCA9ICdkaXJlY3Rvcl9pbml0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgd2hlbiB0aGUgc2luZ2xldG9uIG9mIERpcmVjdG9yIHJlc2V0LlxyXG4gICAgICogQHpoIERpcmVjdG9yIOWNleS+i+mHjee9ruaXtuinpuWPkeeahOS6i+S7tlxyXG4gICAgICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX1JFU0VUXHJcbiAgICAgKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBzaW5nbGV0b24gb2YgRGlyZWN0b3IgcmVzZXQuXHJcbiAgICAgKiBAemggRGlyZWN0b3Ig5Y2V5L6L6YeN572u5pe26Kem5Y+R55qE5LqL5Lu2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRVZFTlRfUkVTRVQgPSAnZGlyZWN0b3JfcmVzZXQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgbG9hZGluZyBhIG5ldyBzY2VuZS5cclxuICAgICAqIEB6aCDliqDovb3mlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcclxuICAgICAqIEBldmVudCBEaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTE9BRElOR1xyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjZW5lTmFtZSAtIFRoZSBsb2FkaW5nIHNjZW5lIG5hbWVcclxuICAgICAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGJlZm9yZSBsb2FkaW5nIGEgbmV3IHNjZW5lLlxyXG4gICAgICogQHpoIOWKoOi9veaWsOWcuuaZr+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HID0gJ2RpcmVjdG9yX2JlZm9yZV9zY2VuZV9sb2FkaW5nJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIGxhdW5jaGluZyBhIG5ldyBzY2VuZS5cclxuICAgICAqIEB6aCDov5DooYzmlrDlnLrmma/kuYvliY3miYDop6blj5HnmoTkuovku7bjgIJcclxuICAgICAqIEBldmVudCBEaXJlY3Rvci5FVkVOVF9CRUZPUkVfU0NFTkVfTEFVTkNIXHJcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gc2NlbmVOYW1lIC0gTmV3IHNjZW5lIHdoaWNoIHdpbGwgYmUgbGF1bmNoZWRcclxuICAgICAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGJlZm9yZSBsYXVuY2hpbmcgYSBuZXcgc2NlbmUuXHJcbiAgICAgKiBAemgg6L+Q6KGM5paw5Zy65pmv5LmL5YmN5omA6Kem5Y+R55qE5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRVZFTlRfQkVGT1JFX1NDRU5FX0xBVU5DSCA9ICdkaXJlY3Rvcl9iZWZvcmVfc2NlbmVfbGF1bmNoJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxyXG4gICAgICogQHpoIOi/kOihjOaWsOWcuuaZr+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0FGVEVSX1NDRU5FX0xBVU5DSFxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHNjZW5lTmFtZSAtIE5ldyBzY2VuZSB3aGljaCBpcyBsYXVuY2hlZFxyXG4gICAgICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgbGF1bmNoaW5nIGEgbmV3IHNjZW5lLlxyXG4gICAgICogQHpoIOi/kOihjOaWsOWcuuaZr+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0FGVEVSX1NDRU5FX0xBVU5DSCA9ICdkaXJlY3Rvcl9hZnRlcl9zY2VuZV9sYXVuY2gnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGV2ZXJ5IGZyYW1lLlxyXG4gICAgICogQHpoIOavj+S4quW4p+eahOW8gOWni+aXtuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0JFRk9SRV9VUERBVEVcclxuICAgICAqL1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGV2ZW50IHdoaWNoIHdpbGwgYmUgdHJpZ2dlcmVkIGF0IHRoZSBiZWdpbm5pbmcgb2YgZXZlcnkgZnJhbWUuXHJcbiAgICAgKiBAemgg5q+P5Liq5bin55qE5byA5aeL5pe25omA6Kem5Y+R55qE5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRVZFTlRfQkVGT1JFX1VQREFURSA9ICdkaXJlY3Rvcl9iZWZvcmVfdXBkYXRlJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGFuZCBjb21wb25lbnRzIHVwZGF0ZSBsb2dpYy5cclxuICAgICAqIEB6aCDlsIblnKjlvJXmk47lkoznu4Tku7Yg4oCcdXBkYXRl4oCdIOmAu+i+keS5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0FGVEVSX1VQREFURVxyXG4gICAgICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGFuZCBjb21wb25lbnRzIHVwZGF0ZSBsb2dpYy5cclxuICAgICAqIEB6aCDlsIblnKjlvJXmk47lkoznu4Tku7Yg4oCcdXBkYXRl4oCdIOmAu+i+keS5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0FGVEVSX1VQREFURSA9ICdkaXJlY3Rvcl9hZnRlcl91cGRhdGUnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgdGhlIHJlbmRlcmluZyBwcm9jZXNzLlxyXG4gICAgICogQHpoIOa4suafk+i/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICogQGV2ZW50IERpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXXHJcbiAgICAgKi9cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBiZWZvcmUgdGhlIHJlbmRlcmluZyBwcm9jZXNzLlxyXG4gICAgICogQHpoIOa4suafk+i/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0JFRk9SRV9EUkFXID0gJ2RpcmVjdG9yX2JlZm9yZV9kcmF3JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIHJlbmRlcmluZyBwcm9jZXNzLlxyXG4gICAgICogQHpoIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYWZ0ZXIgdGhlIHJlbmRlcmluZyBwcm9jZXNzLlxyXG4gICAgICogQHpoIOa4suafk+i/h+eoi+S5i+WQjuaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0FGVEVSX0RSQVcgPSAnZGlyZWN0b3JfYWZ0ZXJfZHJhdyc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgZXZlbnQgd2hpY2ggd2lsbCBiZSB0cmlnZ2VyZWQgYmVmb3JlIHRoZSBwaHlzaWNzIHByb2Nlc3MuPGJyLz5cclxuICAgICAqIOeJqeeQhui/h+eoi+S5i+WJjeaJgOinpuWPkeeahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEVWRU5UX0JFRk9SRV9QSFlTSUNTID0gJ2RpcmVjdG9yX2JlZm9yZV9waHlzaWNzJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBldmVudCB3aGljaCB3aWxsIGJlIHRyaWdnZXJlZCBhZnRlciB0aGUgcGh5c2ljcyBwcm9jZXNzLjxici8+XHJcbiAgICAgKiDniannkIbov4fnqIvkuYvlkI7miYDop6blj5HnmoTkuovku7bjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBFVkVOVF9BRlRFUl9QSFlTSUNTID0gJ2RpcmVjdG9yX2FmdGVyX3BoeXNpY3MnO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5zdGFuY2U6IERpcmVjdG9yO1xyXG5cclxuICAgIHB1YmxpYyBfY29tcFNjaGVkdWxlcjogQ29tcG9uZW50U2NoZWR1bGVyO1xyXG4gICAgcHVibGljIF9ub2RlQWN0aXZhdG9yOiBOb2RlQWN0aXZhdG9yO1xyXG4gICAgcHJpdmF0ZSBfaW52YWxpZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3BhdXNlZDogYm9vbGVhbjtcclxuICAgIHByaXZhdGUgX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wOiBib29sZWFuO1xyXG4gICAgcHJpdmF0ZSBfcm9vdDogUm9vdCB8IG51bGw7XHJcbiAgICBwcml2YXRlIF9sb2FkaW5nU2NlbmU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX3NjZW5lOiBTY2VuZSB8IG51bGw7XHJcbiAgICBwcml2YXRlIF90b3RhbEZyYW1lczogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbGFzdFVwZGF0ZTogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfZGVsdGFUaW1lOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9zdGFydFRpbWU6IG51bWJlcjtcclxuICAgIHByaXZhdGUgX3NjaGVkdWxlcjogU2NoZWR1bGVyO1xyXG4gICAgcHJpdmF0ZSBfc3lzdGVtczogU3lzdGVtW107XHJcblxyXG4gICAgY29uc3RydWN0b3IgKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAvLyBwYXVzZWQ/XHJcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgLy8gcHVyZ2U/XHJcbiAgICAgICAgdGhpcy5fcHVyZ2VEaXJlY3RvckluTmV4dExvb3AgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gcm9vdFxyXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xyXG5cclxuICAgICAgICAvLyBzY2VuZXNcclxuICAgICAgICB0aGlzLl9sb2FkaW5nU2NlbmUgPSAnJztcclxuICAgICAgICB0aGlzLl9zY2VuZSA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIEZQU1xyXG4gICAgICAgIHRoaXMuX3RvdGFsRnJhbWVzID0gMDtcclxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gMDtcclxuICAgICAgICB0aGlzLl9kZWx0YVRpbWUgPSAwLjA7XHJcbiAgICAgICAgdGhpcy5fc3RhcnRUaW1lID0gMC4wO1xyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZXIgZm9yIHVzZXIgcmVnaXN0cmF0aW9uIHVwZGF0ZVxyXG4gICAgICAgIHRoaXMuX3NjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcclxuICAgICAgICAvLyBTY2hlZHVsZXIgZm9yIGxpZmUtY3ljbGUgbWV0aG9kcyBpbiBjb21wb25lbnRcclxuICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyID0gbmV3IENvbXBvbmVudFNjaGVkdWxlcigpO1xyXG4gICAgICAgIC8vIE5vZGUgYWN0aXZhdG9yXHJcbiAgICAgICAgdGhpcy5fbm9kZUFjdGl2YXRvciA9IG5ldyBOb2RlQWN0aXZhdG9yKCk7XHJcblxyXG4gICAgICAgIHRoaXMuX3N5c3RlbXMgPSBbXTtcclxuXHJcbiAgICAgICAgbGVnYWN5Q0MuZ2FtZS5vbmNlKEdhbWUuRVZFTlRfUkVOREVSRVJfSU5JVEVELCB0aGlzLl9pbml0T25SZW5kZXJlckluaXRpYWxpemVkLCB0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGNhbGN1bGF0ZXMgZGVsdGEgdGltZSBzaW5jZSBsYXN0IHRpbWUgaXQgd2FzIGNhbGxlZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2FsY3VsYXRlRGVsdGFUaW1lIChub3cpIHtcclxuICAgICAgICBpZiAoIW5vdykgbm93ID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcblxyXG4gICAgICAgIHRoaXMuX2RlbHRhVGltZSA9IG5vdyA+IHRoaXMuX2xhc3RVcGRhdGUgPyAobm93IC0gdGhpcy5fbGFzdFVwZGF0ZSkgLyAxMDAwIDogMDtcclxuICAgICAgICBpZiAoREVCVUcgJiYgKHRoaXMuX2RlbHRhVGltZSA+IDEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhVGltZSA9IDEgLyA2MC4wO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IG5vdztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29udmVydHMgYSB2aWV3IGNvb3JkaW5hdGUgdG8gYW4gV2ViR0wgY29vcmRpbmF0ZTxici8+XHJcbiAgICAgKiBVc2VmdWwgdG8gY29udmVydCAobXVsdGkpIHRvdWNoZXMgY29vcmRpbmF0ZXMgdG8gdGhlIGN1cnJlbnQgbGF5b3V0IChwb3J0cmFpdCBvciBsYW5kc2NhcGUpPGJyLz5cclxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBkaXJlY3RvcldlYkdMLlxyXG4gICAgICogQHpoIOWwhuinpuaRuOeCueeahOWxj+W5leWdkOagh+i9rOaNouS4uiBXZWJHTCBWaWV3IOS4i+eahOWdkOagh+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udmVydFRvR0wgKHVpUG9pbnQ6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBsZWdhY3lDQy5nYW1lLmNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCB2aWV3ID0gbGVnYWN5Q0MudmlldztcclxuICAgICAgICBjb25zdCBib3ggPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudExlZnQ7XHJcbiAgICAgICAgY29uc3QgdG9wID0gYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRUb3A7XHJcbiAgICAgICAgY29uc3QgeCA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gKiAodWlQb2ludC54IC0gbGVmdCk7XHJcbiAgICAgICAgY29uc3QgeSA9IHZpZXcuX2RldmljZVBpeGVsUmF0aW8gKiAodG9wICsgYm94LmhlaWdodCAtIHVpUG9pbnQueSk7XHJcbiAgICAgICAgcmV0dXJuIHZpZXcuX2lzUm90YXRlZCA/IHYyKHZpZXcuX3ZpZXdwb3J0UmVjdC53aWR0aCAtIHksIHgpIDogdjIoeCwgeSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvbnZlcnRzIGFuIE9wZW5HTCBjb29yZGluYXRlIHRvIGEgdmlldyBjb29yZGluYXRlPGJyLz5cclxuICAgICAqIFVzZWZ1bCB0byBjb252ZXJ0IG5vZGUgcG9pbnRzIHRvIHdpbmRvdyBwb2ludHMgZm9yIGNhbGxzIHN1Y2ggYXMgZ2xTY2lzc29yPGJyLz5cclxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBkaXJlY3RvcldlYkdMLlxyXG4gICAgICogQHpoIOWwhuinpuaRuOeCueeahCBXZWJHTCBWaWV3IOWdkOagh+i9rOaNouS4uuWxj+W5leWdkOagh+OAglxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29udmVydFRvVUkgKGdsUG9pbnQ6IFZlYzIpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBsZWdhY3lDQy5nYW1lLmNvbnRhaW5lcjtcclxuICAgICAgICBjb25zdCB2aWV3ID0gbGVnYWN5Q0MudmlldztcclxuICAgICAgICBjb25zdCBib3ggPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgbGVmdCA9IGJveC5sZWZ0ICsgd2luZG93LnBhZ2VYT2Zmc2V0IC0gY29udGFpbmVyLmNsaWVudExlZnQ7XHJcbiAgICAgICAgY29uc3QgdG9wID0gYm94LnRvcCArIHdpbmRvdy5wYWdlWU9mZnNldCAtIGNvbnRhaW5lci5jbGllbnRUb3A7XHJcbiAgICAgICAgY29uc3QgdWlQb2ludCA9IHYyKDAsIDApO1xyXG4gICAgICAgIGlmICh2aWV3Ll9pc1JvdGF0ZWQpIHtcclxuICAgICAgICAgICAgdWlQb2ludC54ID0gbGVmdCArIGdsUG9pbnQueSAvIHZpZXcuX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHVpUG9pbnQueSA9IHRvcCArIGJveC5oZWlnaHQgLSAodmlldy5fdmlld3BvcnRSZWN0LndpZHRoIC0gZ2xQb2ludC54KSAvIHZpZXcuX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB1aVBvaW50LnggPSBsZWZ0ICsgZ2xQb2ludC54ICogdmlldy5fZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgdWlQb2ludC55ID0gdG9wICsgYm94LmhlaWdodCAtIGdsUG9pbnQueSAqIHZpZXcuX2RldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB1aVBvaW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRW5kIHRoZSBsaWZlIG9mIGRpcmVjdG9yIGluIHRoZSBuZXh0IGZyYW1lXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmQgKCkge1xyXG4gICAgICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUmV0dXJucyB0aGUgc2l6ZSBvZiB0aGUgV2ViR0wgdmlldyBpbiBwb2ludHMuPGJyLz5cclxuICAgICAqIEl0IHRha2VzIGludG8gYWNjb3VudCBhbnkgcG9zc2libGUgcm90YXRpb24gKGRldmljZSBvcmllbnRhdGlvbikgb2YgdGhlIHdpbmRvdy5cclxuICAgICAqIEB6aCDojrflj5bop4blm77nmoTlpKflsI/vvIzku6XngrnkuLrljZXkvY3jgIJcclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFdpblNpemUgKCkge1xyXG4gICAgICAgIHJldHVybiBzaXplKGxlZ2FjeUNDLndpblNpemUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBPcGVuR0wgdmlldyBpbiBwaXhlbHMuPGJyLz5cclxuICAgICAqIEl0IHRha2VzIGludG8gYWNjb3VudCBhbnkgcG9zc2libGUgcm90YXRpb24gKGRldmljZSBvcmllbnRhdGlvbikgb2YgdGhlIHdpbmRvdy48YnIvPlxyXG4gICAgICogT24gTWFjIHdpblNpemUgYW5kIHdpblNpemVJblBpeGVscyByZXR1cm4gdGhlIHNhbWUgdmFsdWUuXHJcbiAgICAgKiAoVGhlIHBpeGVsIGhlcmUgcmVmZXJzIHRvIHRoZSByZXNvdXJjZSByZXNvbHV0aW9uLiBJZiB5b3Ugd2FudCB0byBnZXQgdGhlIHBoeXNpY3MgcmVzb2x1dGlvbiBvZiBkZXZpY2UsIHlvdSBuZWVkIHRvIHVzZSBgdmlldy5nZXRGcmFtZVNpemUoKWApXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluinhuWbvuWkp+Wwj++8jOS7peWDj+e0oOS4uuWNleS9je+8iOi/memHjOeahOWDj+e0oOaMh+eahOaYr+i1hOa6kOWIhui+qOeOh+OAglxyXG4gICAgICog5aaC5p6c6KaB6I635Y+W5bGP5bmV54mp55CG5YiG6L6o546H77yM6ZyA6KaB55SoIGB2aWV3LmdldEZyYW1lU2l6ZSgpYO+8iVxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0V2luU2l6ZUluUGl4ZWxzICgpIHtcclxuICAgICAgICByZXR1cm4gc2l6ZShsZWdhY3lDQy53aW5TaXplKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQYXVzZSB0aGUgZGlyZWN0b3IncyB0aWNrZXIsIG9ubHkgaW52b2x2ZSB0aGUgZ2FtZSBsb2dpYyBleGVjdXRpb24uPGJyPlxyXG4gICAgICogSXQgd29uJ3QgcGF1c2UgdGhlIHJlbmRlcmluZyBwcm9jZXNzIG5vciB0aGUgZXZlbnQgbWFuYWdlci48YnI+XHJcbiAgICAgKiBJZiB5b3Ugd2FudCB0byBwYXVzZSB0aGUgZW50aXJlIGdhbWUgaW5jbHVkaW5nIHJlbmRlcmluZywgYXVkaW8gYW5kIGV2ZW50LDxicj5cclxuICAgICAqIHBsZWFzZSB1c2UgYGdhbWUucGF1c2VgLlxyXG4gICAgICogQHpoIOaaguWBnOato+WcqOi/kOihjOeahOWcuuaZr++8jOivpeaaguWBnOWPquS8muWBnOatoua4uOaIj+mAu+i+keaJp+ihjO+8jOS9huaYr+S4jeS8muWBnOatoua4suafk+WSjCBVSSDlk43lupTjgII8YnI+XHJcbiAgICAgKiDlpoLmnpzmg7PopoHmm7TlvbvlupXlvpfmmoLlgZzmuLjmiI/vvIzljIXlkKvmuLLmn5PvvIzpn7PpopHlkozkuovku7bvvIzor7fkvb/nlKggYGdhbWUucGF1c2VgIOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcGF1c2UgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9wYXVzZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbW92ZXMgY2FjaGVkIGFsbCBjb2NvczJkIGNhY2hlZCBkYXRhLlxyXG4gICAgICogQHpoIOWIoOmZpGNvY29zMmTmiYDmnInnmoTnvJPlrZjmlbDmja5cclxuICAgICAqIEBkZXByZWNhdGVkIHNpbmNlIHYyLjBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1cmdlQ2FjaGVkRGF0YSAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MubG9hZGVyLnJlbGVhc2VBbGwoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQdXJnZSB0aGUgYGRpcmVjdG9yYCBpdHNlbGYsIGluY2x1ZGluZyB1bnNjaGVkdWxlIGFsbCBzY2hlZHVsZSw8YnI+XHJcbiAgICAgKiByZW1vdmUgYWxsIGV2ZW50IGxpc3RlbmVycywgY2xlYW4gdXAgYW5kIGV4aXQgdGhlIHJ1bm5pbmcgc2NlbmUsIHN0b3BzIGFsbCBhbmltYXRpb25zLCBjbGVhciBjYWNoZWQgZGF0YS5cclxuICAgICAqIEB6aCDmuIXpmaQgYGRpcmVjdG9yYCDmnKzouqvvvIzljIXmi6zlgZzmraLmiYDmnInnmoTorqHml7blmajvvIw8YnI+XHJcbiAgICAgKiDnp7vpmaTmiYDmnInnmoTkuovku7bnm5HlkKzlmajvvIzmuIXnkIblubbpgIDlh7rlvZPliY3ov5DooYznmoTlnLrmma/vvIzlgZzmraLmiYDmnInliqjnlLvvvIzmuIXnkIbnvJPlrZjmlbDmja7jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1cmdlRGlyZWN0b3IgKCkge1xyXG4gICAgICAgIC8vIGNsZWFudXAgc2NoZWR1bGVyXHJcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyLnVuc2NoZWR1bGVBbGwoKTtcclxuICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLnVuc2NoZWR1bGVBbGwoKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbm9kZUFjdGl2YXRvci5yZXNldCgpO1xyXG5cclxuICAgICAgICAvLyBEaXNhYmxlIGV2ZW50IGRpc3BhdGNoaW5nXHJcbiAgICAgICAgaWYgKGV2ZW50TWFuYWdlcikge1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuc2V0RW5hYmxlZChmYWxzZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICBpZiAobGVnYWN5Q0MuaXNWYWxpZCh0aGlzLl9zY2VuZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NjZW5lIS5kZXN0cm95KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fc2NlbmUgPSBudWxsO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zdG9wQW5pbWF0aW9uKCk7XHJcblxyXG4gICAgICAgIC8vIENsZWFyIGFsbCBjYWNoZXNcclxuICAgICAgICBsZWdhY3lDQy5sb2FkZXIucmVsZWFzZUFsbCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlc2V0IHRoZSBkaXJlY3RvciwgY2FuIGJlIHVzZWQgdG8gcmVzdGFydCB0aGUgZGlyZWN0b3IgYWZ0ZXIgcHVyZ2VcclxuICAgICAqIEB6aCDph43nva7mraQgRGlyZWN0b3LvvIzlj6/nlKjkuo7lnKjmuIXpmaTlkI7ph43lkK8gRGlyZWN0b3LjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICB0aGlzLnB1cmdlRGlyZWN0b3IoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lbWl0KERpcmVjdG9yLkVWRU5UX1JFU0VUKTtcclxuXHJcbiAgICAgICAgaWYgKGV2ZW50TWFuYWdlcikge1xyXG4gICAgICAgICAgICBldmVudE1hbmFnZXIuc2V0RW5hYmxlZCh0cnVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc3RhcnRBbmltYXRpb24oKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUnVuIGEgc2NlbmUuIFJlcGxhY2VzIHRoZSBydW5uaW5nIHNjZW5lIHdpdGggYSBuZXcgb25lIG9yIGVudGVyIHRoZSBmaXJzdCBzY2VuZS48YnI+XHJcbiAgICAgKiBUaGUgbmV3IHNjZW5lIHdpbGwgYmUgbGF1bmNoZWQgaW1tZWRpYXRlbHkuXHJcbiAgICAgKiBAemgg6L+Q6KGM5oyH5a6a5Zy65pmv44CC5bCG5q2j5Zyo6L+Q6KGM55qE5Zy65pmv5pu/5o2i5Li677yI5oiW6YeN5YWl5Li677yJ5paw5Zy65pmv44CC5paw5Zy65pmv5bCG56uL5Y2z5ZCv5Yqo44CCXHJcbiAgICAgKiBAcGFyYW0gc2NlbmUgLSBUaGUgbmVlZCBydW4gc2NlbmUuXHJcbiAgICAgKiBAcGFyYW0gb25CZWZvcmVMb2FkU2NlbmUgLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYmVmb3JlIGxvYWRpbmcuXHJcbiAgICAgKiBAcGFyYW0gb25MYXVuY2hlZCAtIFRoZSBmdW5jdGlvbiBpbnZva2VkIGF0IHRoZSBzY2VuZSBhZnRlciBsYXVuY2guXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBydW5TY2VuZUltbWVkaWF0ZSAoc2NlbmU6IFNjZW5lLCBvbkJlZm9yZUxvYWRTY2VuZT86IERpcmVjdG9yLk9uQmVmb3JlTG9hZFNjZW5lLCBvbkxhdW5jaGVkPzogRGlyZWN0b3IuT25TY2VuZUxhdW5jaGVkKSB7XHJcbiAgICAgICAgYXNzZXJ0SUQoc2NlbmUgaW5zdGFuY2VvZiBsZWdhY3lDQy5TY2VuZSwgMTIxNik7XHJcblxyXG4gICAgICAgIGNvbnN0IHV1aWQgPSBsZWdhY3lDQy5sb2FkZXIuX2dldFJlZmVyZW5jZUtleShzY2VuZS51dWlkKTtcclxuICAgICAgICAvLyBTY2VuZSBjYW5ub3QgYmUgY2FjaGVkIGluIGxvYWRlciwgYmVjYXVzZSBpdCB3aWxsIGJlIGRlc3Ryb3llZCBhZnRlciBzd2l0Y2hpbmcuXHJcbiAgICAgICAgbGVnYWN5Q0MubG9hZGVyLnJlbW92ZUl0ZW0odXVpZCk7XHJcblxyXG4gICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ0luaXRTY2VuZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBAdHMtaWdub3JlXHJcbiAgICAgICAgc2NlbmUuX2xvYWQoKTsgIC8vIGVuc3VyZSBzY2VuZSBpbml0aWFsaXplZFxyXG4gICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0luaXRTY2VuZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBSZS1hdHRhY2ggb3IgcmVwbGFjZSBwZXJzaXN0IG5vZGVzXHJcbiAgICAgICAgaWYgKEJVSUxEICYmIERFQlVHKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgnQXR0YWNoUGVyc2lzdCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBwZXJzaXN0Tm9kZUxpc3QgPSBPYmplY3Qua2V5cyhsZWdhY3lDQy5nYW1lLl9wZXJzaXN0Um9vdE5vZGVzKS5tYXAoKHgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGxlZ2FjeUNDLmdhbWUuX3BlcnNpc3RSb290Tm9kZXNbeF07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwZXJzaXN0Tm9kZUxpc3QubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgbm9kZSA9IHBlcnNpc3ROb2RlTGlzdFtpXTtcclxuICAgICAgICAgICAgbm9kZS5lbWl0KGxlZ2FjeUNDLk5vZGUuU0NFTkVfQ0hBTkdFRF9GT1JfUEVSU0lTVFMsIHNjZW5lLnJlbmRlclNjZW5lKTtcclxuICAgICAgICAgICAgY29uc3QgZXhpc3ROb2RlID0gc2NlbmUuZ2V0Q2hpbGRCeVV1aWQobm9kZS51dWlkKTtcclxuICAgICAgICAgICAgaWYgKGV4aXN0Tm9kZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2NlbmUgYWxzbyBjb250YWlucyB0aGUgcGVyc2lzdCBub2RlLCBzZWxlY3QgdGhlIG9sZCBvbmVcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gZXhpc3ROb2RlLmdldFNpYmxpbmdJbmRleCgpO1xyXG4gICAgICAgICAgICAgICAgZXhpc3ROb2RlLl9kZXN0cm95SW1tZWRpYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBzY2VuZS5pbnNlcnRDaGlsZChub2RlLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBub2RlLnBhcmVudCA9IHNjZW5lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWVFbmQoJ0F0dGFjaFBlcnNpc3QnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgb2xkU2NlbmUgPSB0aGlzLl9zY2VuZTtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICAvLyBhdXRvIHJlbGVhc2UgYXNzZXRzXHJcbiAgICAgICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS50aW1lKCdBdXRvUmVsZWFzZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGF1dG9SZWxlYXNlQXNzZXRzID0gb2xkU2NlbmUgJiYgb2xkU2NlbmUuYXV0b1JlbGVhc2VBc3NldHMgJiYgb2xkU2NlbmUuZGVwZW5kQXNzZXRzO1xyXG4gICAgICAgICAgICBhdXRvUmVsZWFzZShhdXRvUmVsZWFzZUFzc2V0cywgc2NlbmUuZGVwZW5kQXNzZXRzLCBwZXJzaXN0Tm9kZUxpc3QpO1xyXG4gICAgICAgICAgICBpZiAoQlVJTEQgJiYgREVCVUcpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnQXV0b1JlbGVhc2UnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gdW5sb2FkIHNjZW5lXHJcbiAgICAgICAgaWYgKEJVSUxEICYmIERFQlVHKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZSgnRGVzdHJveScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAobGVnYWN5Q0MuaXNWYWxpZChvbGRTY2VuZSkpIHtcclxuICAgICAgICAgICAgb2xkU2NlbmUhLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gcHVyZ2UgZGVzdHJveWVkIG5vZGVzIGJlbG9uZ3MgdG8gb2xkIHNjZW5lXHJcbiAgICAgICAgQ0NPYmplY3QuX2RlZmVycmVkRGVzdHJveSgpO1xyXG4gICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykgeyBjb25zb2xlLnRpbWVFbmQoJ0Rlc3Ryb3knKTsgfVxyXG5cclxuICAgICAgICBpZiAob25CZWZvcmVMb2FkU2NlbmUpIHtcclxuICAgICAgICAgICAgb25CZWZvcmVMb2FkU2NlbmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbWl0KGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MQVVOQ0gsIHNjZW5lKTtcclxuXHJcbiAgICAgICAgLy8gUnVuIGFuIEVudGl0eSBTY2VuZVxyXG4gICAgICAgIHRoaXMuX3NjZW5lID0gc2NlbmU7XHJcblxyXG4gICAgICAgIGlmIChCVUlMRCAmJiBERUJVRykge1xyXG4gICAgICAgICAgICBjb25zb2xlLnRpbWUoJ0FjdGl2YXRlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBzY2VuZS5fYWN0aXZhdGUoKTtcclxuICAgICAgICBpZiAoQlVJTEQgJiYgREVCVUcpIHtcclxuICAgICAgICAgICAgY29uc29sZS50aW1lRW5kKCdBY3RpdmF0ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBzdGFydCBzY2VuZVxyXG4gICAgICAgIGlmICh0aGlzLl9yb290KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3Jvb3QucmVzZXRDdW11bGF0aXZlVGltZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXJ0QW5pbWF0aW9uKCk7XHJcblxyXG4gICAgICAgIGlmIChvbkxhdW5jaGVkKSB7XHJcbiAgICAgICAgICAgIG9uTGF1bmNoZWQobnVsbCwgc2NlbmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVtaXQobGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQUZURVJfU0NFTkVfTEFVTkNILCBzY2VuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJ1biBhIHNjZW5lLiBSZXBsYWNlcyB0aGUgcnVubmluZyBzY2VuZSB3aXRoIGEgbmV3IG9uZSBvciBlbnRlciB0aGUgZmlyc3Qgc2NlbmUuPGJyPlxyXG4gICAgICogVGhlIG5ldyBzY2VuZSB3aWxsIGJlIGxhdW5jaGVkIGF0IHRoZSBlbmQgb2YgdGhlIGN1cnJlbnQgZnJhbWUuPGJyPlxyXG4gICAgICogQHpoIOi/kOihjOaMh+WumuWcuuaZr+OAglxyXG4gICAgICogQHBhcmFtIHNjZW5lIC0gVGhlIG5lZWQgcnVuIHNjZW5lLlxyXG4gICAgICogQHBhcmFtIG9uQmVmb3JlTG9hZFNjZW5lIC0gVGhlIGZ1bmN0aW9uIGludm9rZWQgYXQgdGhlIHNjZW5lIGJlZm9yZSBsb2FkaW5nLlxyXG4gICAgICogQHBhcmFtIG9uTGF1bmNoZWQgLSBUaGUgZnVuY3Rpb24gaW52b2tlZCBhdCB0aGUgc2NlbmUgYWZ0ZXIgbGF1bmNoLlxyXG4gICAgICogQHByaXZhdGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJ1blNjZW5lIChzY2VuZTogU2NlbmUsIG9uQmVmb3JlTG9hZFNjZW5lPzogRGlyZWN0b3IuT25CZWZvcmVMb2FkU2NlbmUsIG9uTGF1bmNoZWQ/OiBEaXJlY3Rvci5PblNjZW5lTGF1bmNoZWQpIHtcclxuICAgICAgICBhc3NlcnRJRChzY2VuZSwgMTIwNSk7XHJcbiAgICAgICAgYXNzZXJ0SUQoc2NlbmUgaW5zdGFuY2VvZiBsZWdhY3lDQy5TY2VuZSwgMTIxNik7XHJcblxyXG4gICAgICAgIC8vIGVuc3VyZSBzY2VuZSBpbml0aWFsaXplZFxyXG4gICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICBzY2VuZS5fbG9hZCgpO1xyXG5cclxuICAgICAgICAvLyBEZWxheSBydW4gLyByZXBsYWNlIHNjZW5lIHRvIHRoZSBlbmQgb2YgdGhlIGZyYW1lXHJcbiAgICAgICAgdGhpcy5vbmNlKGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0FGVEVSX0RSQVcsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5ydW5TY2VuZUltbWVkaWF0ZShzY2VuZSwgb25CZWZvcmVMb2FkU2NlbmUsIG9uTGF1bmNoZWQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8vICBAU2NlbmUgbG9hZGluZyBzZWN0aW9uXHJcblxyXG4gICAgcHVibGljIF9nZXRTY2VuZVV1aWQgKGtleTogc3RyaW5nIHwgbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3Qgc2NlbmVzID0gbGVnYWN5Q0MuZ2FtZS5fc2NlbmVJbmZvcztcclxuICAgICAgICBpZiAodHlwZW9mIGtleSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgaWYgKCFrZXkuZW5kc1dpdGgoJy5zY2VuZScpKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgKz0gJy5zY2VuZSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGtleVswXSAhPT0gJy8nICYmICFrZXkuc3RhcnRzV2l0aCgnZGI6Ly8nKSkge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gJy8nICsga2V5OyAgICAvLyDkvb/nlKjlhajlkI3ljLnphY1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBzZWFyY2ggc2NlbmVcclxuICAgICAgICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOiBwcmVmZXItZm9yLW9mXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NlbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpbmZvID0gc2NlbmVzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGluZm8udXJsLmVuZHNXaXRoKGtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaW5mbztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlb2Yga2V5ID09PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBpZiAoMCA8PSBrZXkgJiYga2V5IDwgc2NlbmVzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNjZW5lc1trZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXJyb3JJRCgxMjA2LCBrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICBlcnJvcklEKDEyMDcsIGtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIExvYWRzIHRoZSBzY2VuZSBieSBpdHMgbmFtZS5cclxuICAgICAqIEB6aCDpgJrov4flnLrmma/lkI3np7Dov5vooYzliqDovb3lnLrmma/jgIJcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHNjZW5lIHRvIGxvYWQuXHJcbiAgICAgKiBAcGFyYW0gb25MYXVuY2hlZCAtIGNhbGxiYWNrLCB3aWxsIGJlIGNhbGxlZCBhZnRlciBzY2VuZSBsYXVuY2hlZC5cclxuICAgICAqIEByZXR1cm4gaWYgZXJyb3IsIHJldHVybiBmYWxzZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbG9hZFNjZW5lIChzY2VuZU5hbWU6IHN0cmluZywgb25MYXVuY2hlZD86IERpcmVjdG9yLk9uU2NlbmVMYXVuY2hlZCwgb25VbmxvYWRlZD86IERpcmVjdG9yLk9uVW5sb2FkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX2xvYWRpbmdTY2VuZSkge1xyXG4gICAgICAgICAgICB3YXJuSUQoMTIwOCwgc2NlbmVOYW1lLCB0aGlzLl9sb2FkaW5nU2NlbmUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLl9nZXRTY2VuZVV1aWQoc2NlbmVOYW1lKTtcclxuICAgICAgICBpZiAoaW5mbykge1xyXG4gICAgICAgICAgICBjb25zdCB1dWlkID0gaW5mby51dWlkO1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQobGVnYWN5Q0MuRGlyZWN0b3IuRVZFTlRfQkVGT1JFX1NDRU5FX0xPQURJTkcsIHNjZW5lTmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xvYWRpbmdTY2VuZSA9IHNjZW5lTmFtZTtcclxuICAgICAgICAgICAgdGhpcy5fbG9hZFNjZW5lQnlVdWlkKHV1aWQsIG9uTGF1bmNoZWQsIG9uVW5sb2FkZWQpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGVycm9ySUQoMTIwOSwgc2NlbmVOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUHJlLWxvYWRzIHRoZSBzY2VuZSB0byByZWR1Y2VzIGxvYWRpbmcgdGltZS4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGF0IGFueSB0aW1lIHlvdSB3YW50Ljxicj5cclxuICAgICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBzdGlsbCBuZWVkIHRvIGxhdW5jaCB0aGUgc2NlbmUgYnkgYGRpcmVjdG9yLmxvYWRTY2VuZWAuPGJyPlxyXG4gICAgICogSXQgd2lsbCBiZSB0b3RhbGx5IGZpbmUgdG8gY2FsbCBgZGlyZWN0b3IubG9hZFNjZW5lYCBhdCBhbnkgdGltZSBldmVuIGlmIHRoZSBwcmVsb2FkaW5nIGlzIG5vdDxicj5cclxuICAgICAqIHlldCBmaW5pc2hlZCwgdGhlIHNjZW5lIHdpbGwgYmUgbGF1bmNoZWQgYWZ0ZXIgbG9hZGVkIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgKiBAemgg6aKE5Yqg6L295Zy65pmv77yM5L2g5Y+v5Lul5Zyo5Lu75L2V5pe25YCZ6LCD55So6L+Z5Liq5pa55rOV44CCXHJcbiAgICAgKiDosIPnlKjlrozlkI7vvIzkvaDku43nhLbpnIDopoHpgJrov4cgYGRpcmVjdG9yLmxvYWRTY2VuZWAg5p2l5ZCv5Yqo5Zy65pmv77yM5Zug5Li66L+Z5Liq5pa55rOV5LiN5Lya5omn6KGM5Zy65pmv5Yqg6L295pON5L2c44CCPGJyPlxyXG4gICAgICog5bCx566X6aKE5Yqg6L296L+Y5rKh5a6M5oiQ77yM5L2g5Lmf5Y+v5Lul55u05o6l6LCD55SoIGBkaXJlY3Rvci5sb2FkU2NlbmVg77yM5Yqg6L295a6M5oiQ5ZCO5Zy65pmv5bCx5Lya5ZCv5Yqo44CCXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVOYW1lIOWcuuaZr+WQjeensOOAglxyXG4gICAgICogQHBhcmFtIG9uTG9hZGVkIOWKoOi9veWbnuiwg+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHJlbG9hZFNjZW5lIChzY2VuZU5hbWU6IHN0cmluZywgb25Mb2FkZWQ/OiBEaXJlY3Rvci5PblNjZW5lTG9hZGVkKTogdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUHJlLWxvYWRzIHRoZSBzY2VuZSB0byByZWR1Y2VzIGxvYWRpbmcgdGltZS4gWW91IGNhbiBjYWxsIHRoaXMgbWV0aG9kIGF0IGFueSB0aW1lIHlvdSB3YW50Ljxicj5cclxuICAgICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHlvdSBzdGlsbCBuZWVkIHRvIGxhdW5jaCB0aGUgc2NlbmUgYnkgYGRpcmVjdG9yLmxvYWRTY2VuZWAuPGJyPlxyXG4gICAgICogSXQgd2lsbCBiZSB0b3RhbGx5IGZpbmUgdG8gY2FsbCBgZGlyZWN0b3IubG9hZFNjZW5lYCBhdCBhbnkgdGltZSBldmVuIGlmIHRoZSBwcmVsb2FkaW5nIGlzIG5vdDxicj5cclxuICAgICAqIHlldCBmaW5pc2hlZCwgdGhlIHNjZW5lIHdpbGwgYmUgbGF1bmNoZWQgYWZ0ZXIgbG9hZGVkIGF1dG9tYXRpY2FsbHkuXHJcbiAgICAgKiBAemgg6aKE5Yqg6L295Zy65pmv77yM5L2g5Y+v5Lul5Zyo5Lu75L2V5pe25YCZ6LCD55So6L+Z5Liq5pa55rOV44CCXHJcbiAgICAgKiDosIPnlKjlrozlkI7vvIzkvaDku43nhLbpnIDopoHpgJrov4cgYGRpcmVjdG9yLmxvYWRTY2VuZWAg5p2l5ZCv5Yqo5Zy65pmv77yM5Zug5Li66L+Z5Liq5pa55rOV5LiN5Lya5omn6KGM5Zy65pmv5Yqg6L295pON5L2c44CCPGJyPlxyXG4gICAgICog5bCx566X6aKE5Yqg6L296L+Y5rKh5a6M5oiQ77yM5L2g5Lmf5Y+v5Lul55u05o6l6LCD55SoIGBkaXJlY3Rvci5sb2FkU2NlbmVg77yM5Yqg6L295a6M5oiQ5ZCO5Zy65pmv5bCx5Lya5ZCv5Yqo44CCXHJcbiAgICAgKiBAcGFyYW0gc2NlbmVOYW1lIOWcuuaZr+WQjeensOOAglxyXG4gICAgICogQHBhcmFtIG9uUHJvZ3Jlc3Mg5Yqg6L296L+b5bqm5Zue6LCD44CCXHJcbiAgICAgKiBAcGFyYW0gb25Mb2FkZWQg5Yqg6L295Zue6LCD44CCXHJcbiAgICAgKi9cclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvdW5pZmllZC1zaWduYXR1cmVzXHJcbiAgICBwdWJsaWMgcHJlbG9hZFNjZW5lIChzY2VuZU5hbWU6IHN0cmluZywgb25Qcm9ncmVzczogRGlyZWN0b3IuT25Mb2FkU2NlbmVQcm9ncmVzcywgb25Mb2FkZWQ6IERpcmVjdG9yLk9uU2NlbmVMb2FkZWQpOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBwcmVsb2FkU2NlbmUgKFxyXG4gICAgICAgIHNjZW5lTmFtZTogc3RyaW5nLFxyXG4gICAgICAgIGFyZzE/OiBEaXJlY3Rvci5PbkxvYWRTY2VuZVByb2dyZXNzIHwgRGlyZWN0b3IuT25TY2VuZUxvYWRlZCxcclxuICAgICAgICBhcmcyPzogRGlyZWN0b3IuT25TY2VuZUxvYWRlZCkge1xyXG4gICAgICAgIGxldCBvblByb2dyZXNzOiBEaXJlY3Rvci5PbkxvYWRTY2VuZVByb2dyZXNzIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBvbkxvYWRlZDogRGlyZWN0b3IuT25TY2VuZUxvYWRlZCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgaWYgKGFyZzIgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBvbkxvYWRlZCA9IGFyZzEgYXMgRGlyZWN0b3IuT25TY2VuZUxvYWRlZDtcclxuICAgICAgICAgICAgb25Qcm9ncmVzcyA9IHZvaWQgMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvbkxvYWRlZCA9IGFyZzI7XHJcbiAgICAgICAgICAgIG9uUHJvZ3Jlc3MgPSBhcmcxIGFzIERpcmVjdG9yLk9uTG9hZFNjZW5lUHJvZ3Jlc3M7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBpbmZvID0gdGhpcy5fZ2V0U2NlbmVVdWlkKHNjZW5lTmFtZSk7XHJcbiAgICAgICAgaWYgKGluZm8pIHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KGxlZ2FjeUNDLkRpcmVjdG9yLkVWRU5UX0JFRk9SRV9TQ0VORV9MT0FESU5HLCBzY2VuZU5hbWUpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIubG9hZCh7IHV1aWQ6IGluZm8udXVpZCwgdHlwZTogJ3V1aWQnIH0sXHJcbiAgICAgICAgICAgICAgICBvblByb2dyZXNzLFxyXG4gICAgICAgICAgICAgICAgKGVycjogbnVsbCB8IEVycm9yLCBhc3NldDogU2NlbmVBc3NldCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JJRCgxMjEwLCBzY2VuZU5hbWUsIGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9uTG9hZGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTG9hZGVkKGVyciwgYXNzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgZXJyID0gJ0NhbiBub3QgcHJlbG9hZCB0aGUgc2NlbmUgXCInICsgc2NlbmVOYW1lICsgJ1wiIGJlY2F1c2UgaXQgaXMgbm90IGluIHRoZSBidWlsZCBzZXR0aW5ncy4nO1xyXG4gICAgICAgICAgICBpZiAob25Mb2FkZWQpIHtcclxuICAgICAgICAgICAgICAgIG9uTG9hZGVkKG5ldyBFcnJvcihlcnIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlcnJvcigncHJlbG9hZFNjZW5lOiAnICsgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gTG9hZHMgdGhlIHNjZW5lIGJ5IGl0cyB1dWlkLlxyXG4gICAgICogQHpoIOmAmui/hyB1dWlkIOWKoOi9veWcuuaZr+OAglxyXG4gICAgICogQHBhcmFtIHV1aWQg5Zy65pmv6LWE5rqQ55qEIHV1aWTjgIJcclxuICAgICAqIEBwYXJhbSBkb05vdFJ1biDku4XliqDovb3lkozliJ3lp4vljJblnLrmma/vvIzkvYblubbkuI3ov5DooYzjgILmraTlj4LmlbDku4XlnKjnvJbovpHlmajnjq/looPkuK3nlJ/mlYjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9sb2FkU2NlbmVCeVV1aWQgKHV1aWQ6IHN0cmluZywgZG9Ob3RSdW4/OiBib29sZWFuKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgX2xvYWRTY2VuZUJ5VXVpZCAodXVpZDogc3RyaW5nLCBvbkxhdW5jaGVkPzogRGlyZWN0b3IuT25TY2VuZUxhdW5jaGVkLCBkb05vdFJ1bj86IGJvb2xlYW4pOiB2b2lkO1xyXG5cclxuICAgIHB1YmxpYyBfbG9hZFNjZW5lQnlVdWlkICh1dWlkOiBzdHJpbmcsIG9uTGF1bmNoZWQ/OiBEaXJlY3Rvci5PblNjZW5lTGF1bmNoZWQsIG9uVW5sb2FkZWQ/OiBEaXJlY3Rvci5PblVubG9hZCwgZG9Ob3RSdW4/OiBib29sZWFuKTogdm9pZDtcclxuXHJcbiAgICBwdWJsaWMgX2xvYWRTY2VuZUJ5VXVpZCAoXHJcbiAgICAgICAgdXVpZDogc3RyaW5nLFxyXG4gICAgICAgIGFyZzE/OiBEaXJlY3Rvci5PblNjZW5lTGF1bmNoZWQgfCBib29sZWFuLFxyXG4gICAgICAgIGFyZzI/OiBEaXJlY3Rvci5PblVubG9hZCB8IGJvb2xlYW4sXHJcbiAgICAgICAgYXJnMz86IGJvb2xlYW4pIHtcclxuICAgICAgICBsZXQgb25MYXVuY2hlZDogRGlyZWN0b3IuT25TY2VuZUxhdW5jaGVkIHwgdW5kZWZpbmVkO1xyXG4gICAgICAgIGxldCBvblVubG9hZGVkOiBEaXJlY3Rvci5PblVubG9hZCB8IHVuZGVmaW5lZDtcclxuICAgICAgICBsZXQgZG9Ob3RSdW46IGJvb2xlYW4gfCB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGlmIChFRElUT1IgJiYgdHlwZW9mIGFyZzEgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBkb05vdFJ1biA9IGFyZzE7XHJcbiAgICAgICAgICAgIG9uVW5sb2FkZWQgPSBhcmcyIGFzIChEaXJlY3Rvci5PblVubG9hZCB8IHVuZGVmaW5lZCk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChFRElUT1IgJiYgdHlwZW9mIGFyZzIgPT09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICBkb05vdFJ1biA9IGFyZzI7XHJcbiAgICAgICAgICAgIG9uTGF1bmNoZWQgPSBhcmcxIGFzIChEaXJlY3Rvci5PblNjZW5lTGF1bmNoZWQgfCB1bmRlZmluZWQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIG9uTGF1bmNoZWQgPSBhcmcxIGFzIChEaXJlY3Rvci5PblNjZW5lTGF1bmNoZWQgfCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBvblVubG9hZGVkID0gYXJnMiBhcyAoRGlyZWN0b3IuT25VbmxvYWQgfCB1bmRlZmluZWQpO1xyXG4gICAgICAgICAgICBkb05vdFJ1biA9IGFyZzM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBsZWdhY3lDQy5Bc3NldExpYnJhcnkudW5sb2FkQXNzZXQodXVpZCk7ICAgICAvLyBmb3JjZSByZWxvYWRcclxuICAgICAgICBjb25zb2xlLnRpbWUoJ0xvYWRTY2VuZSAnICsgdXVpZCk7XHJcbiAgICAgICAgbGVnYWN5Q0MuQXNzZXRMaWJyYXJ5LmxvYWRBc3NldCh1dWlkLCAoZXJyLCBzY2VuZUFzc2V0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUudGltZUVuZCgnTG9hZFNjZW5lICcgKyB1dWlkKTtcclxuICAgICAgICAgICAgY29uc3Qgc2VsZiA9IGRpcmVjdG9yO1xyXG4gICAgICAgICAgICBzZWxmLl9sb2FkaW5nU2NlbmUgPSAnJztcclxuICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgZXJyID0gJ0ZhaWxlZCB0byBsb2FkIHNjZW5lOiAnICsgZXJyO1xyXG4gICAgICAgICAgICAgICAgZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChzY2VuZUFzc2V0IGluc3RhbmNlb2YgbGVnYWN5Q0MuU2NlbmVBc3NldCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNjZW5lID0gc2NlbmVBc3NldC5zY2VuZTtcclxuICAgICAgICAgICAgICAgICAgICBzY2VuZS5faWQgPSBzY2VuZUFzc2V0Ll91dWlkO1xyXG4gICAgICAgICAgICAgICAgICAgIHNjZW5lLl9uYW1lID0gc2NlbmVBc3NldC5fbmFtZTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZG9Ob3RSdW4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucnVuU2NlbmVJbW1lZGlhdGUoc2NlbmUsIG9uVW5sb2FkZWQsIG9uTGF1bmNoZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NlbmUuX2xvYWQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbkxhdW5jaGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25MYXVuY2hlZChudWxsLCBzY2VuZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucnVuU2NlbmVJbW1lZGlhdGUoc2NlbmUsIG9uVW5sb2FkZWQsIG9uTGF1bmNoZWQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBlcnIgPSAnVGhlIGFzc2V0ICcgKyB1dWlkICsgJyBpcyBub3QgYSBzY2VuZSc7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3IoZXJyKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob25MYXVuY2hlZCkge1xyXG4gICAgICAgICAgICAgICAgb25MYXVuY2hlZChlcnIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzdW1lIGdhbWUgbG9naWMgZXhlY3V0aW9uIGFmdGVyIHBhdXNlLCBpZiB0aGUgY3VycmVudCBzY2VuZSBpcyBub3QgcGF1c2VkLCBub3RoaW5nIHdpbGwgaGFwcGVuLlxyXG4gICAgICogQHpoIOaBouWkjeaaguWBnOWcuuaZr+eahOa4uOaIj+mAu+i+ke+8jOWmguaenOW9k+WJjeWcuuaZr+ayoeacieaaguWBnOWwhuayoeS7u+S9leS6i+aDheWPkeeUn+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdW1lICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuX3BhdXNlZCkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9sYXN0VXBkYXRlKSB7XHJcbiAgICAgICAgICAgIGxvZ0lEKDEyMDApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fZGVsdGFUaW1lID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogRW5hYmxlcyBvciBkaXNhYmxlcyBXZWJHTCBkZXB0aCB0ZXN0Ljxicj5cclxuICAgICAqIEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBkaXJlY3RvckNhbnZhcy5qcy9kaXJlY3RvcldlYkdMLmpzXHJcbiAgICAgKiBAemgg5ZCv55SoL+emgeeUqOa3seW6pua1i+ivle+8iOWcqCBDYW52YXMg5riy5p+T5qih5byP5LiL5LiN5Lya55Sf5pWI77yJ44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXREZXB0aFRlc3QgKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgaWYgKCFsZWdhY3lDQy5DYW1lcmEubWFpbikge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxlZ2FjeUNDLkNhbWVyYS5tYWluLmRlcHRoID0gISF2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IGNvbG9yIGZvciBjbGVhciBzY3JlZW4uPGJyPlxyXG4gICAgICogKEltcGxlbWVudGF0aW9uIGNhbiBiZSBmb3VuZCBpbiBkaXJlY3RvckNhbnZhcy5qcy9kaXJlY3RvcldlYkdMLmpzKVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva7lnLrmma/nmoTpu5jorqTmk6bpmaTpopzoibLjgII8YnI+XHJcbiAgICAgKiDmlK/mjIHlhajpgI/mmI7vvIzkvYbkuI3mlK/mjIHpgI/mmI7luqbkuLrkuK3pl7TlgLzjgILopoHmlK/mjIHlhajpgI/mmI7pnIDmiYvlt6XlvIDlkK8gYG1hY3JvLkVOQUJMRV9UUkFOU1BBUkVOVF9DQU5WQVNg44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzZXRDbGVhckNvbG9yIChjbGVhckNvbG9yOiBDb2xvcikge1xyXG4gICAgICAgIGlmICghbGVnYWN5Q0MuQ2FtZXJhLm1haW4pIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZWdhY3lDQy5DYW1lcmEubWFpbi5iYWNrZ3JvdW5kQ29sb3IgPSBjbGVhckNvbG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCByb290ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIGN1cnJlbnQgbG9naWMgU2NlbmUuXHJcbiAgICAgKiBAemgg6I635Y+W5b2T5YmN6YC76L6R5Zy65pmv44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBTaW5jZSB2Mi4wLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0UnVubmluZ1NjZW5lICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2NlbmU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyBjdXJyZW50IGxvZ2ljIFNjZW5lLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjemAu+i+keWcuuaZr+OAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYFxyXG4gICAgICogaW1wb3J0IHsgZGlyZWN0b3IgfSBmcm9tICdjYyc7XHJcbiAgICAgKiAvLyBUaGlzIHdpbGwgaGVscCB5b3UgdG8gZ2V0IHRoZSBDYW52YXMgbm9kZSBpbiBzY2VuZVxyXG4gICAgICogZGlyZWN0b3IuZ2V0U2NlbmUoKS5nZXRDaGlsZEJ5TmFtZSgnQ2FudmFzJyk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjZW5lICgpOiBTY2VuZSB8IG51bGwge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zY2VuZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBGUFMgdmFsdWUuIFBsZWFzZSB1c2UgW1tHYW1lLnNldEZyYW1lUmF0ZV1dIHRvIGNvbnRyb2wgYW5pbWF0aW9uIGludGVydmFsLlxyXG4gICAgICogQHpoIOiOt+WPluWNleS9jeW4p+aJp+ihjOaXtumXtOOAguivt+S9v+eUqCBbW0dhbWUuc2V0RnJhbWVSYXRlXV0g5p2l5o6n5Yi25ri45oiP5bin546H44CCXHJcbiAgICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2Mi4wLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0QW5pbWF0aW9uSW50ZXJ2YWwgKCkge1xyXG4gICAgICAgIHJldHVybiAxMDAwIC8gbGVnYWN5Q0MuZ2FtZS5nZXRGcmFtZVJhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIGFuaW1hdGlvbiBpbnRlcnZhbCwgdGhpcyBkb2Vzbid0IGNvbnRyb2wgdGhlIG1haW4gbG9vcC48YnI+XHJcbiAgICAgKiBUbyBjb250cm9sIHRoZSBnYW1lJ3MgZnJhbWUgcmF0ZSBvdmVyYWxsLCBwbGVhc2UgdXNlIGBnYW1lLnNldEZyYW1lUmF0ZWBcclxuICAgICAqIEB6aCDorr7nva7liqjnlLvpl7TpmpTvvIzov5nkuI3mjqfliLbkuLvlvqrnjq/jgII8YnI+XHJcbiAgICAgKiDopoHmjqfliLbmuLjmiI/nmoTluKfpgJ/njofvvIzor7fkvb/nlKggYGdhbWUuc2V0RnJhbWVSYXRlYFxyXG4gICAgICogQGRlcHJlY2F0ZWQgc2luY2UgdjIuMFxyXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIGFuaW1hdGlvbiBpbnRlcnZhbCBkZXNpcmVkLlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0QW5pbWF0aW9uSW50ZXJ2YWwgKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICBsZWdhY3lDQy5nYW1lLnNldEZyYW1lUmF0ZShNYXRoLnJvdW5kKDEwMDAgLyB2YWx1ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgdGhlIGRlbHRhIHRpbWUgc2luY2UgbGFzdCBmcmFtZS5cclxuICAgICAqIEB6aCDojrflj5bkuIrkuIDluKfnmoTlop7ph4/ml7bpl7TjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldERlbHRhVGltZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlbHRhVGltZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSB0b3RhbCBwYXNzZWQgdGltZSBzaW5jZSBnYW1lIHN0YXJ0LCB1bml0OiBtc1xyXG4gICAgICogQHpoIOiOt+WPluS7jua4uOaIj+W8gOWni+WIsOeOsOWcqOaAu+WFsee7j+i/h+eahOaXtumXtO+8jOWNleS9jeS4uiBtc1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0VG90YWxUaW1lICgpIHtcclxuICAgICAgICByZXR1cm4gcGVyZm9ybWFuY2Uubm93KCkgLSB0aGlzLl9zdGFydFRpbWU7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgY3VycmVudCB0aW1lLlxyXG4gICAgICogQHpoIOiOt+WPluW9k+WJjeW4p+eahOaXtumXtOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Q3VycmVudFRpbWUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sYXN0VXBkYXRlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJldHVybnMgaG93IG1hbnkgZnJhbWVzIHdlcmUgY2FsbGVkIHNpbmNlIHRoZSBkaXJlY3RvciBzdGFydGVkLlxyXG4gICAgICogQHpoIOiOt+WPliBkaXJlY3RvciDlkK/liqjku6XmnaXmuLjmiI/ov5DooYznmoTmgLvluKfmlbDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFRvdGFsRnJhbWVzICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdG90YWxGcmFtZXM7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB3aGV0aGVyIG9yIG5vdCB0aGUgRGlyZWN0b3IgaXMgcGF1c2VkLlxyXG4gICAgICogQHpoIOaYr+WQpuWkhOS6juaaguWBnOeKtuaAgeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNQYXVzZWQgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXVzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmV0dXJucyB0aGUgc2NoZWR1bGVyIGFzc29jaWF0ZWQgd2l0aCB0aGlzIGRpcmVjdG9yLlxyXG4gICAgICogQHpoIOiOt+WPluWSjCBkaXJlY3RvciDnm7jlhbPogZTnmoTosIPluqblmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldFNjaGVkdWxlciAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBTZXRzIHRoZSBzY2hlZHVsZXIgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZGlyZWN0b3IuXHJcbiAgICAgKiBAemgg6K6+572u5ZKMIGRpcmVjdG9yIOebuOWFs+iBlOeahOiwg+W6puWZqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0U2NoZWR1bGVyIChzY2hlZHVsZXI6IFNjaGVkdWxlcikge1xyXG4gICAgICAgIGlmICh0aGlzLl9zY2hlZHVsZXIgIT09IHNjaGVkdWxlcikge1xyXG4gICAgICAgICAgICB0aGlzLnVucmVnaXN0ZXJTeXN0ZW0odGhpcy5fc2NoZWR1bGVyKTtcclxuICAgICAgICAgICAgdGhpcy5fc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xyXG4gICAgICAgICAgICB0aGlzLnJlZ2lzdGVyU3lzdGVtKFNjaGVkdWxlci5JRCwgc2NoZWR1bGVyLCAyMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZWdpc3RlciBhIHN5c3RlbS5cclxuICAgICAqIEB6aCDms6jlhozkuIDkuKrns7vnu5/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlZ2lzdGVyU3lzdGVtIChuYW1lOiBzdHJpbmcsIHN5czogU3lzdGVtLCBwcmlvcml0eTogbnVtYmVyKSB7XHJcbiAgICAgICAgc3lzLmlkID0gbmFtZTtcclxuICAgICAgICBzeXMucHJpb3JpdHkgPSBwcmlvcml0eTtcclxuICAgICAgICBzeXMuaW5pdCgpO1xyXG4gICAgICAgIHRoaXMuX3N5c3RlbXMucHVzaChzeXMpO1xyXG4gICAgICAgIHRoaXMuX3N5c3RlbXMuc29ydChTeXN0ZW0uc29ydEJ5UHJpb3JpdHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1bnJlZ2lzdGVyU3lzdGVtIChzeXM6IFN5c3RlbSkge1xyXG4gICAgICAgIGpzLmFycmF5LmZhc3RSZW1vdmUodGhpcy5fc3lzdGVtcywgc3lzKTtcclxuICAgICAgICB0aGlzLl9zeXN0ZW1zLnNvcnQoU3lzdGVtLnNvcnRCeVByaW9yaXR5KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBnZXQgYSBzeXN0ZW0uXHJcbiAgICAgKiBAemgg6I635Y+W5LiA5LiqIHN5c3RlbeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0U3lzdGVtIChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc3lzdGVtcy5maW5kKChzeXMpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHN5cy5pZCA9PT0gbmFtZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXR1cm5zIHRoZSBgQW5pbWF0aW9uTWFuYWdlcmAgYXNzb2NpYXRlZCB3aXRoIHRoaXMgZGlyZWN0b3IuIFBsZWFzZSB1c2UgZ2V0U3lzdGVtKEFuaW1hdGlvbk1hbmFnZXIuSUQpXHJcbiAgICAgKiBAemgg6I635Y+W5ZKMIGRpcmVjdG9yIOebuOWFs+iBlOeahCBgQW5pbWF0aW9uTWFuYWdlcmDvvIjliqjnlLvnrqHnkIblmajvvInjgILor7fkvb/nlKggZ2V0U3lzdGVtKEFuaW1hdGlvbk1hbmFnZXIuSUQpIOadpeabv+S7o1xyXG4gICAgICogQGRlcHJlY2F0ZWRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEFuaW1hdGlvbk1hbmFnZXIgKCk6IGFueSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3lzdGVtKGxlZ2FjeUNDLkFuaW1hdGlvbk1hbmFnZXIuSUQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIExvb3AgbWFuYWdlbWVudFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU3RhcnRzIEFuaW1hdGlvblxyXG4gICAgICogQHpoIOW8gOWni+WKqOeUu1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhcnRBbmltYXRpb24gKCkge1xyXG4gICAgICAgIHRoaXMuX2ludmFsaWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLl9sYXN0VXBkYXRlID0gcGVyZm9ybWFuY2Uubm93KCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU3RvcHMgYW5pbWF0aW9uXHJcbiAgICAgKiBAemgg5YGc5q2i5Yqo55S7XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdG9wQW5pbWF0aW9uICgpIHtcclxuICAgICAgICB0aGlzLl9pbnZhbGlkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSdW4gbWFpbiBsb29wIG9mIGRpcmVjdG9yXHJcbiAgICAgKiBAemgg6L+Q6KGM5Li75b6q546vXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBtYWluTG9vcCAodGltZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3B1cmdlRGlyZWN0b3JJbk5leHRMb29wID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMucHVyZ2VEaXJlY3RvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICghdGhpcy5faW52YWxpZCkge1xyXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgXCJnbG9iYWxcIiBkdFxyXG4gICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZURlbHRhVGltZSh0aW1lKTtcclxuICAgICAgICAgICAgY29uc3QgZHQgPSB0aGlzLl9kZWx0YVRpbWU7XHJcblxyXG4gICAgICAgICAgICAvLyBVcGRhdGVcclxuICAgICAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChEaXJlY3Rvci5FVkVOVF9CRUZPUkVfVVBEQVRFKTtcclxuICAgICAgICAgICAgICAgIC8vIENhbGwgc3RhcnQgZm9yIG5ldyBhZGRlZCBjb21wb25lbnRzXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb21wU2NoZWR1bGVyLnN0YXJ0UGhhc2UoKTtcclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBmb3IgY29tcG9uZW50c1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29tcFNjaGVkdWxlci51cGRhdGVQaGFzZShkdCk7XHJcbiAgICAgICAgICAgICAgICAvLyBVcGRhdGUgc3lzdGVtc1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zeXN0ZW1zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzdGVtc1tpXS51cGRhdGUoZHQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gTGF0ZSB1cGRhdGUgZm9yIGNvbXBvbmVudHNcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBTY2hlZHVsZXIubGF0ZVVwZGF0ZVBoYXNlKGR0KTtcclxuICAgICAgICAgICAgICAgIC8vIFVzZXIgY2FuIHVzZSB0aGlzIGV2ZW50IHRvIGRvIHRoaW5ncyBhZnRlciB1cGRhdGVcclxuICAgICAgICAgICAgICAgIHRoaXMuZW1pdChEaXJlY3Rvci5FVkVOVF9BRlRFUl9VUERBVEUpO1xyXG4gICAgICAgICAgICAgICAgLy8gRGVzdHJveSBlbnRpdGllcyB0aGF0IGhhdmUgYmVlbiByZW1vdmVkIHJlY2VudGx5XHJcbiAgICAgICAgICAgICAgICBDQ09iamVjdC5fZGVmZXJyZWREZXN0cm95KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUG9zdCB1cGRhdGUgc3lzdGVtc1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zeXN0ZW1zLmxlbmd0aDsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3lzdGVtc1tpXS5wb3N0VXBkYXRlKGR0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5lbWl0KERpcmVjdG9yLkVWRU5UX0JFRk9SRV9EUkFXKTtcclxuICAgICAgICAgICAgdGhpcy5fcm9vdCEuZnJhbWVNb3ZlKHRoaXMuX2RlbHRhVGltZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChEaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXKTtcclxuXHJcbiAgICAgICAgICAgIGV2ZW50TWFuYWdlci5mcmFtZVVwZGF0ZUxpc3RlbmVycygpO1xyXG4gICAgICAgICAgICBOb2RlLmJvb2tPZkNoYW5nZS5jbGVhcigpO1xyXG4gICAgICAgICAgICB0aGlzLl90b3RhbEZyYW1lcysrO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0T25SZW5kZXJlckluaXRpYWxpemVkICgpIHtcclxuICAgICAgICB0aGlzLl90b3RhbEZyYW1lcyA9IDA7XHJcbiAgICAgICAgdGhpcy5fbGFzdFVwZGF0ZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xyXG4gICAgICAgIHRoaXMuX3N0YXJ0VGltZSA9IHRoaXMuX2xhc3RVcGRhdGU7XHJcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5fcHVyZ2VEaXJlY3RvckluTmV4dExvb3AgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gRXZlbnQgbWFuYWdlclxyXG4gICAgICAgIGlmIChldmVudE1hbmFnZXIpIHtcclxuICAgICAgICAgICAgZXZlbnRNYW5hZ2VyLnNldEVuYWJsZWQodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBTY2hlZHVsZXJcclxuICAgICAgICAvLyBUT0RPOiBoYXZlIGEgc29saWQgb3JnYW5pemF0aW9uIG9mIHByaW9yaXR5IGFuZCBleHBvc2UgdG8gdXNlclxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTeXN0ZW0oU2NoZWR1bGVyLklELCB0aGlzLl9zY2hlZHVsZXIsIDIwMCk7XHJcblxyXG4gICAgICAgIHRoaXMuZW1pdChEaXJlY3Rvci5FVkVOVF9JTklUKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0ICgpIHtcclxuICAgICAgICBsZWdhY3lDQy5sb2FkZXIuaW5pdCh0aGlzKTtcclxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IFJvb3QobGVnYWN5Q0MuZ2FtZS5fZ2Z4RGV2aWNlKTtcclxuICAgICAgICBjb25zdCByb290SW5mbyA9IHt9O1xyXG4gICAgICAgIGlmICghdGhpcy5fcm9vdC5pbml0aWFsaXplKHJvb3RJbmZvKSkge1xyXG4gICAgICAgICAgICBlcnJvcklEKDEyMTcpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGRlY2xhcmUgbmFtZXNwYWNlIERpcmVjdG9yIHtcclxuICAgIGV4cG9ydCB0eXBlIE9uQmVmb3JlTG9hZFNjZW5lID0gKCkgPT4gdm9pZDtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBPblVubG9hZCA9ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgZXhwb3J0IHR5cGUgT25TY2VuZUxvYWRlZCA9IChlcnJvcjogbnVsbCB8IEVycm9yLCBzY2VuZUFzc2V0PzogU2NlbmVBc3NldCkgPT4gdm9pZDtcclxuXHJcbiAgICBleHBvcnQgdHlwZSBPblNjZW5lTGF1bmNoZWQgPSAoZXJyb3I6IG51bGwgfCBFcnJvciwgc2NlbmU/OiBTY2VuZSkgPT4gdm9pZDtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSBjb21wbGV0ZWRDb3VudCAtIFRoZSBudW1iZXIgb2YgdGhlIGl0ZW1zIHRoYXQgYXJlIGFscmVhZHkgY29tcGxldGVkLlxyXG4gICAgICogQHBhcmFtIHRvdGFsQ291bnQgLSBUaGUgdG90YWwgbnVtYmVyIG9mIHRoZSBpdGVtcy5cclxuICAgICAqIEBwYXJhbSBpdGVtIC0gVGhlIGxhdGVzdCBpdGVtIHdoaWNoIGZsb3cgb3V0IHRoZSBwaXBlbGluZS5cclxuICAgICAqL1xyXG4gICAgZXhwb3J0IHR5cGUgT25Mb2FkU2NlbmVQcm9ncmVzcyA9IChjb21wbGV0ZWRDb3VudDogbnVtYmVyLCB0b3RhbENvdW50OiBudW1iZXIsIGl0ZW06IGFueSkgPT4gdm9pZDtcclxufVxyXG5cclxubGVnYWN5Q0MuRGlyZWN0b3IgPSBEaXJlY3RvcjtcclxuXHJcbi8qKlxyXG4gKiDlr7zmvJTnsbvjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBkaXJlY3RvcjogRGlyZWN0b3IgPSBEaXJlY3Rvci5pbnN0YW5jZSA9IGxlZ2FjeUNDLmRpcmVjdG9yID0gbmV3IERpcmVjdG9yKCk7XHJcbiJdfQ==