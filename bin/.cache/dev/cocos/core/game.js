(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./default-constants.js", "./assets/asset-library.js", "./event/event-target.js", "./platform/debug.js", "./platform/event-manager/input-manager.js", "./gfx/index.js", "./platform/sys.js", "./platform/macro.js", "./global-exports.js", "./pipeline/define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./default-constants.js"), require("./assets/asset-library.js"), require("./event/event-target.js"), require("./platform/debug.js"), require("./platform/event-manager/input-manager.js"), require("./gfx/index.js"), require("./platform/sys.js"), require("./platform/macro.js"), require("./global-exports.js"), require("./pipeline/define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.defaultConstants, global.assetLibrary, global.eventTarget, global.debug, global.inputManager, global.index, global.sys, global.macro, global.globalExports, global.define);
    global.game = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _defaultConstants, _assetLibrary, _eventTarget, debug, _inputManager, _index, _sys, _macro, _globalExports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.game = _exports.Game = void 0;
  _assetLibrary = _interopRequireDefault(_assetLibrary);
  debug = _interopRequireWildcard(debug);
  _inputManager = _interopRequireDefault(_inputManager);

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  /**
   * @en An object to boot the game.
   * @zh 包含游戏主体信息并负责驱动游戏的游戏对象。
   * @class Game
   */
  var Game = /*#__PURE__*/function (_EventTarget) {
    _inherits(Game, _EventTarget);

    function Game() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Game);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Game)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _this.frame = null;
      _this.container = null;
      _this.canvas = null;
      _this.renderType = -1;
      _this.eventTargetOn = _get(_getPrototypeOf(Game.prototype), "on", _assertThisInitialized(_this));
      _this.eventTargetOnce = _get(_getPrototypeOf(Game.prototype), "once", _assertThisInitialized(_this));
      _this.config = {};
      _this.onStart = null;
      _this._persistRootNodes = {};
      _this._paused = true;
      _this._configLoaded = false;
      _this._isCloning = false;
      _this._inited = false;
      _this._rendererInitialized = false;
      _this._gfxDevice = null;
      _this._intervalId = null;
      _this._lastTime = null;
      _this._frameTime = null;
      _this._sceneInfos = [];
      _this.collisionMatrix = [];
      _this.groupList = [];
      return _this;
    }

    _createClass(Game, [{
      key: "setFrameRate",
      // @Methods
      //  @Game play control

      /**
       * @en Set frame rate of game.
       * @zh 设置游戏帧率。
       * @param {Number} frameRate
       */
      value: function setFrameRate(frameRate) {
        var config = this.config;

        if (typeof frameRate !== 'number') {
          frameRate = parseInt(frameRate);

          if (isNaN(frameRate)) {
            frameRate = 60;
          }
        }

        config.frameRate = frameRate;
        this._paused = true;

        this._setAnimFrame();

        this._runMainLoop();
      }
      /**
       * @en Get frame rate set for the game, it doesn't represent the real frame rate.
       * @zh 获取设置的游戏帧率（不等同于实际帧率）。
       * @return {Number} frame rate
       */

    }, {
      key: "getFrameRate",
      value: function getFrameRate() {
        return this.config.frameRate || 0;
      }
      /**
       * @en Run the game frame by frame.
       * @zh 执行一帧游戏循环。
       */

    }, {
      key: "step",
      value: function step() {
        _globalExports.legacyCC.director.mainLoop();
      }
      /**
       * @en Pause the game main loop. This will pause:<br>
       * game logic execution, rendering process, event manager, background music and all audio effects.<br>
       * This is different with `director.pause` which only pause the game logic execution.<br>
       * @zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 `director.pause` 不同。
       */

    }, {
      key: "pause",
      value: function pause() {
        if (this._paused) {
          return;
        }

        this._paused = true; // Pause main loop

        if (this._intervalId) {
          window.cAF(this._intervalId);
          this._intervalId = 0;
        } // Because JSB platforms never actually stops the swap chain,
        // we draw some more frames here to (try to) make sure swap chain consistency


        if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED || _defaultConstants.ALIPAY) {
          var swapbuffers = 3;

          var cb = function cb() {
            if (--swapbuffers > 1) {
              window.rAF(cb);
            }

            var root = _globalExports.legacyCC.director.root;
            root.frameMove(0);
            root.device.present();
          };

          window.rAF(cb);
        }
      }
      /**
       * @en Resume the game from pause. This will resume:<br>
       * game logic execution, rendering process, event manager, background music and all audio effects.<br>
       * @zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
       */

    }, {
      key: "resume",
      value: function resume() {
        if (!this._paused) {
          return;
        }

        this._paused = false; // Resume main loop

        this._runMainLoop();
      }
      /**
       * @en Check whether the game is paused.
       * @zh 判断游戏是否暂停。
       * @return {Boolean}
       */

    }, {
      key: "isPaused",
      value: function isPaused() {
        return this._paused;
      }
      /**
       * @en Restart game.
       * @zh 重新开始游戏
       */

    }, {
      key: "restart",
      value: function restart() {
        _globalExports.legacyCC.director.once(_globalExports.legacyCC.Director.EVENT_AFTER_DRAW, function () {
          // tslint:disable-next-line: forin
          for (var id in _globalExports.legacyCC.game._persistRootNodes) {
            _globalExports.legacyCC.game.removePersistRootNode(_globalExports.legacyCC.game._persistRootNodes[id]);
          } // Clear scene


          _globalExports.legacyCC.director.getScene().destroy();

          _globalExports.legacyCC.Object._deferredDestroy();

          _globalExports.legacyCC.director.reset();

          _globalExports.legacyCC.game.onStart();

          _globalExports.legacyCC.game._safeEmit(_globalExports.legacyCC.Game.EVENT_RESTART);
        });
      }
      /**
       * @en End game, it will close the game window
       * @zh 退出游戏
       */

    }, {
      key: "end",
      value: function end() {
        if (this._gfxDevice) {
          this._gfxDevice.destroy();

          this._gfxDevice = null;
        }

        close();
      }
      /**
       * @en
       * Register an callback of a specific event type on the game object.<br>
       * This type of event should be triggered via `emit`.<br>
       * @zh
       * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。<br>
       *
       * @param {String} type - A string representing the event type to listen for.
       * @param {Function} callback - The callback that will be invoked when the event is dispatched.<br>
       *                              The callback is ignored if it is a duplicate (the callbacks are unique).
       * @param {any} [callback.arg1] arg1
       * @param {any} [callback.arg2] arg2
       * @param {any} [callback.arg3] arg3
       * @param {any} [callback.arg4] arg4
       * @param {any} [callback.arg5] arg5
       * @param {Object} [target] - The target (this object) to invoke the callback, can be null
       * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
       */

    }, {
      key: "on",
      value: function on(type, callback, target, once) {
        // Make sure EVENT_ENGINE_INITED callbacks to be invoked
        if (this._inited && type === Game.EVENT_ENGINE_INITED) {
          callback.call(target);
        } else {
          this.eventTargetOn(type, callback, target, once);
        }
      }
      /**
       * @en
       * Register an callback of a specific event type on the game object,<br>
       * the callback will remove itself after the first time it is triggered.<br>
       * @zh
       * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
       *
       * @param {String} type - A string representing the event type to listen for.
       * @param {Function} callback - The callback that will be invoked when the event is dispatched.<br>
       *                              The callback is ignored if it is a duplicate (the callbacks are unique).
       * @param {any} [callback.arg1] arg1
       * @param {any} [callback.arg2] arg2
       * @param {any} [callback.arg3] arg3
       * @param {any} [callback.arg4] arg4
       * @param {any} [callback.arg5] arg5
       * @param {Object} [target] - The target (this object) to invoke the callback, can be null
       */
      // @ts-ignore

    }, {
      key: "once",
      value: function once(type, callback, target) {
        // Make sure EVENT_ENGINE_INITED callbacks to be invoked
        if (this._inited && type === Game.EVENT_ENGINE_INITED) {
          callback.call(target);
        } else {
          this.eventTargetOnce(type, callback, target);
        }
      }
      /**
       * @en Init game with configuration object.
       * @zh 使用指定的配置初始化引擎。
       * @param {Object} config - Pass configuration object
       */

    }, {
      key: "init",
      value: function init(config) {
        this._initConfig(config); // Init AssetLibrary


        if (this.config.assetOptions) {
          _assetLibrary.default.init(this.config.assetOptions);
        }

        this._initEngine();

        if (!_defaultConstants.EDITOR) {
          this._initEvents();
        }

        _globalExports.legacyCC.director.root.dataPoolManager.jointTexturePool.registerCustomTextureLayouts(config.customJointTextureLayouts);

        return this._inited;
      }
      /**
       * @en Run game with configuration object and onStart function.
       * @zh 运行游戏，并且指定引擎配置和 onStart 的回调。
       * @param {Function} onStart - function to be executed after game initialized
       */

    }, {
      key: "run",
      value: function run(onStart, legacyOnStart) {
        var _this2 = this;

        if (!_defaultConstants.EDITOR) {
          this._initEvents();
        }

        if (typeof onStart !== 'function' && legacyOnStart) {
          var config = this.onStart;
          this.init(config);
          this.onStart = legacyOnStart;
        } else {
          this.onStart = onStart;
        }

        this._setAnimFrame();

        this._runMainLoop(); // register system events


        if (!_defaultConstants.EDITOR && game.config.registerSystemEvent) {
          _inputManager.default.registerSystemEvent(game.canvas);
        }

        var useSplash = !_defaultConstants.EDITOR && !_defaultConstants.PREVIEW && _globalExports.legacyCC.internal.SplashScreen; // Load render pipeline if needed
        // const renderPipeline = this.config.renderPipeline;

        var renderPipeline = "5d45ba66-829a-46d3-948e-2ed3fa7ee421";

        if (renderPipeline) {
          _globalExports.legacyCC.loader.load({
            uuid: renderPipeline
          }, function (err, asset) {
            // failed load renderPipeline
            if (err) {
              console.warn("Failed load renderpipeline: ".concat(renderPipeline, ", engine failed to initialize, will fallback to default pipeline"));
              console.warn(err);

              _this2.setRenderPipeline();
            } else {
              try {
                _this2.setRenderPipeline(asset);
              } catch (e) {
                console.warn(e);
                console.warn("Failed load renderpipeline: ".concat(renderPipeline, ", engine failed to initialize, will fallback to default pipeline"));

                _this2.setRenderPipeline();
              }
            }

            _this2._safeEmit(Game.EVENT_GAME_INITED);

            if (useSplash) {
              var splashScreen = _globalExports.legacyCC.internal.SplashScreen.instance;
              splashScreen.main(_globalExports.legacyCC.director.root);
              splashScreen.setOnFinish(function () {
                if (_this2.onStart) {
                  _this2.onStart();
                }
              });
              splashScreen.loadFinish = true;
            } else {
              if (_this2.onStart) {
                _this2.onStart();
              }
            }
          });
        } else {
          this.setRenderPipeline();

          this._safeEmit(Game.EVENT_GAME_INITED);

          if (useSplash) {
            var splashScreen = _globalExports.legacyCC.internal.SplashScreen.instance;
            splashScreen.main(_globalExports.legacyCC.director.root);
            splashScreen.setOnFinish(function () {
              if (_this2.onStart) {
                _this2.onStart();
              }
            });
            splashScreen.loadFinish = true;
          } else {
            if (this.onStart) {
              this.onStart();
            }
          }
        }
      } //  @ Persist root node section

      /**
       * @en
       * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br>
       * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
       * @zh
       * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br>
       * 目标节点必须位于为层级的根节点，否则无效。
       * @param {Node} node - The node to be made persistent
       */

    }, {
      key: "addPersistRootNode",
      value: function addPersistRootNode(node) {
        if (!_globalExports.legacyCC.Node.isNode(node) || !node.uuid) {
          debug.warnID(3800);
          return;
        }

        var id = node.uuid;

        if (!this._persistRootNodes[id]) {
          var scene = _globalExports.legacyCC.director._scene;

          if (_globalExports.legacyCC.isValid(scene)) {
            if (!node.parent) {
              node.parent = scene;
            } else if (!(node.parent instanceof _globalExports.legacyCC.Scene)) {
              debug.warnID(3801);
              return;
            } else if (node.parent !== scene) {
              debug.warnID(3802);
              return;
            }
          }

          this._persistRootNodes[id] = node;
          node._persistNode = true;
        }
      }
      /**
       * @en Remove a persistent root node.
       * @zh 取消常驻根节点。
       * @param {Node} node - The node to be removed from persistent node list
       */

    }, {
      key: "removePersistRootNode",
      value: function removePersistRootNode(node) {
        var id = node.uuid || '';

        if (node === this._persistRootNodes[id]) {
          delete this._persistRootNodes[id];
          node._persistNode = false;
        }
      }
      /**
       * @en Check whether the node is a persistent root node.
       * @zh 检查节点是否是常驻根节点。
       * @param {Node} node - The node to be checked
       * @return {Boolean}
       */

    }, {
      key: "isPersistRootNode",
      value: function isPersistRootNode(node) {
        return node._persistNode;
      } //  @Engine loading

    }, {
      key: "_initEngine",
      value: function _initEngine() {
        this._initDevice();

        _globalExports.legacyCC.director._init(); // Log engine version


        console.log('Cocos Creator 3D v' + _globalExports.legacyCC.ENGINE_VERSION);
        this.emit(Game.EVENT_ENGINE_INITED);
        this._inited = true;
      } // @Methods
      //  @Time ticker section

    }, {
      key: "_setAnimFrame",
      value: function _setAnimFrame() {
        this._lastTime = new Date();
        var frameRate = _globalExports.legacyCC.game.config.frameRate;
        this._frameTime = 1000 / frameRate;

        if (_defaultConstants.JSB || _defaultConstants.RUNTIME_BASED) {
          // @ts-ignore
          jsb.setPreferredFramesPerSecond(frameRate);
          window.rAF = window.requestAnimationFrame;
          window.cAF = window.cancelAnimationFrame;
        } else {
          if (this._intervalId) {
            window.cAF(this._intervalId);
            this._intervalId = 0;
          }

          if (frameRate !== 60 && frameRate !== 30) {
            window.rAF = this._stTime;
            window.cAF = this._ctTime;
          } else {
            window.rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || this._stTime;
            window.cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.webkitCancelRequestAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame || window.ocancelAnimationFrame || this._ctTime;
          }
        }
      }
    }, {
      key: "_stTime",
      value: function _stTime(callback) {
        var currTime = new Date().getTime();
        var elapseTime = Math.max(0, currTime - _globalExports.legacyCC.game._lastTime);
        var timeToCall = Math.max(0, _globalExports.legacyCC.game._frameTime - elapseTime);
        var id = window.setTimeout(callback, timeToCall);
        _globalExports.legacyCC.game._lastTime = currTime + timeToCall;
        return id;
      }
    }, {
      key: "_ctTime",
      value: function _ctTime(id) {
        window.clearTimeout(id);
      } // Run game.

    }, {
      key: "_runMainLoop",
      value: function _runMainLoop() {
        var _this3 = this;

        if (_defaultConstants.EDITOR && !_globalExports.legacyCC.GAME_VIEW) {
          return;
        }

        var _callback;

        var config = this.config;
        var director = _globalExports.legacyCC.director;
        var skip = true;
        var frameRate = config.frameRate;
        debug.setDisplayStats(!!config.showFPS);
        director.startAnimation();

        _callback = function callback(time) {
          if (_this3._paused) {
            return;
          }

          _this3._intervalId = window.rAF(_callback);

          if (!_defaultConstants.JSB && !_defaultConstants.RUNTIME_BASED && frameRate === 30) {
            skip = !skip;

            if (skip) {
              return;
            }
          }

          director.mainLoop(time);
        };

        if (this._intervalId) {
          window.cAF(this._intervalId);
          this._intervalId = 0;
        }

        this._intervalId = window.rAF(_callback);
        this._paused = false;
      } // @Game loading section

    }, {
      key: "_initConfig",
      value: function _initConfig(config) {
        // Configs adjustment
        if (typeof config.debugMode !== 'number') {
          config.debugMode = 0;
        }

        config.exposeClassName = !!config.exposeClassName;

        if (typeof config.frameRate !== 'number') {
          config.frameRate = 60;
        }

        var renderMode = config.renderMode;

        if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
          config.renderMode = 0;
        }

        if (typeof config.registerSystemEvent !== 'boolean') {
          config.registerSystemEvent = true;
        }

        config.showFPS = !!config.showFPS; // Scene parser

        this._sceneInfos = config.scenes || []; // Collide Map and Group List

        this.collisionMatrix = config.collisionMatrix || [];
        this.groupList = config.groupList || [];

        debug._resetDebugSetting(config.debugMode);

        this.config = config;
        this._configLoaded = true;
      }
    }, {
      key: "_determineRenderType",
      value: function _determineRenderType() {
        var config = this.config;
        var userRenderMode = parseInt(config.renderMode); // Determine RenderType

        this.renderType = Game.RENDER_TYPE_CANVAS;
        var supportRender = false;

        if (userRenderMode === 0) {
          if (_globalExports.legacyCC.sys.capabilities.opengl) {
            this.renderType = Game.RENDER_TYPE_WEBGL;
            supportRender = true;
          } else if (_globalExports.legacyCC.sys.capabilities.canvas) {
            this.renderType = Game.RENDER_TYPE_CANVAS;
            supportRender = true;
          }
        } else if (userRenderMode === 1 && _globalExports.legacyCC.sys.capabilities.canvas) {
          this.renderType = Game.RENDER_TYPE_CANVAS;
          supportRender = true;
        } else if (userRenderMode === 2 && _globalExports.legacyCC.sys.capabilities.opengl) {
          this.renderType = Game.RENDER_TYPE_WEBGL;
          supportRender = true;
        }

        if (!supportRender) {
          throw new Error(debug.getError(3820, userRenderMode));
        }
      }
    }, {
      key: "_initDevice",
      value: function _initDevice() {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) {
          return;
        }

        this.canvas = this.config.adapter.canvas;
        this.frame = this.config.adapter.frame;
        this.container = this.config.adapter.container;

        this._determineRenderType(); // WebGL context created successfully


        if (this.renderType === Game.RENDER_TYPE_WEBGL) {
          var ctors = [];

          if (_defaultConstants.JSB && window.gfx) {
            if (gfx.CCVKDevice) {
              ctors.push(gfx.CCVKDevice);
            }

            if (gfx.CCMTLDevice) {
              ctors.push(gfx.CCMTLDevice);
            }

            if (gfx.GLES3Device) {
              ctors.push(gfx.GLES3Device);
            }

            if (gfx.GLES2Device) {
              ctors.push(gfx.GLES2Device);
            }
          } else {
            var useWebGL2 = !!window.WebGL2RenderingContext;
            var userAgent = window.navigator.userAgent.toLowerCase();

            if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1 || _sys.sys.browserType === _sys.sys.BROWSER_TYPE_UC // UC browser implementation doesn't not conform to WebGL2 standard
            ) {
                useWebGL2 = false;
              }

            if (useWebGL2 && _globalExports.legacyCC.WebGL2Device) {
              ctors.push(_globalExports.legacyCC.WebGL2Device);
            }

            if (_globalExports.legacyCC.WebGLDevice) {
              ctors.push(_globalExports.legacyCC.WebGLDevice);
            }
          }

          var opts = new _index.GFXDeviceInfo(this.canvas, _defaultConstants.EDITOR || _macro.macro.ENABLE_WEBGL_ANTIALIAS, false, window.devicePixelRatio, Math.floor(screen.width * window.devicePixelRatio), Math.floor(screen.height * window.devicePixelRatio), _define.bindingMappingInfo);

          for (var i = 0; i < ctors.length; i++) {
            this._gfxDevice = new ctors[i]();

            if (this._gfxDevice.initialize(opts)) {
              break;
            }
          }
        }

        if (!this._gfxDevice) {
          // todo fix here for wechat game
          console.error('can not support canvas rendering in 3D');
          this.renderType = Game.RENDER_TYPE_CANVAS;
          return;
        }

        this.canvas.oncontextmenu = function () {
          if (!_globalExports.legacyCC._isContextMenuEnable) {
            return false;
          }
        };
      }
    }, {
      key: "_initEvents",
      value: function _initEvents() {
        var win = window;
        var hiddenPropName;

        if (typeof document.hidden !== 'undefined') {
          hiddenPropName = 'hidden';
        } else if (typeof document.mozHidden !== 'undefined') {
          hiddenPropName = 'mozHidden';
        } else if (typeof document.msHidden !== 'undefined') {
          hiddenPropName = 'msHidden';
        } else if (typeof document.webkitHidden !== 'undefined') {
          hiddenPropName = 'webkitHidden';
        }

        var hidden = false;

        function onHidden() {
          if (!hidden) {
            hidden = true;

            _globalExports.legacyCC.game.emit(Game.EVENT_HIDE);
          }
        } // In order to adapt the most of platforms the onshow API.


        function onShown(arg0, arg1, arg2, arg3, arg4) {
          if (hidden) {
            hidden = false;

            _globalExports.legacyCC.game.emit(Game.EVENT_SHOW, arg0, arg1, arg2, arg3, arg4);
          }
        }

        if (hiddenPropName) {
          var changeList = ['visibilitychange', 'mozvisibilitychange', 'msvisibilitychange', 'webkitvisibilitychange', 'qbrowserVisibilityChange']; // tslint:disable-next-line: prefer-for-of

          for (var i = 0; i < changeList.length; i++) {
            document.addEventListener(changeList[i], function (event) {
              var visible = document[hiddenPropName]; // QQ App
              // @ts-ignore

              visible = visible || event.hidden;

              if (visible) {
                onHidden();
              } else {
                onShown();
              }
            });
          }
        } else {
          win.addEventListener('blur', onHidden);
          win.addEventListener('focus', onShown);
        }

        if (window.navigator.userAgent.indexOf('MicroMessenger') > -1) {
          win.onfocus = onShown;
        }

        if ('onpageshow' in window && 'onpagehide' in window) {
          win.addEventListener('pagehide', onHidden);
          win.addEventListener('pageshow', onShown); // Taobao UIWebKit

          document.addEventListener('pagehide', onHidden);
          document.addEventListener('pageshow', onShown);
        }

        this.on(Game.EVENT_HIDE, function () {
          _globalExports.legacyCC.game.pause();
        });
        this.on(Game.EVENT_SHOW, function () {
          _globalExports.legacyCC.game.resume();
        });
      }
    }, {
      key: "setRenderPipeline",
      value: function setRenderPipeline(rppl) {
        if (!_globalExports.legacyCC.director.root.setRenderPipeline(rppl)) {
          this.setRenderPipeline();
        }

        this._rendererInitialized = true;

        this._safeEmit(Game.EVENT_RENDERER_INITED);
      }
    }, {
      key: "_safeEmit",
      value: function _safeEmit(event) {
        if (_defaultConstants.EDITOR) {
          try {
            this.emit(event);
          } catch (e) {
            console.warn(e);
          }
        } else {
          this.emit(event);
        }
      }
    }, {
      key: "inited",

      /**
       * @en Indicates whether the engine has inited
       * @zh 引擎是否以完成初始化
       */
      get: function get() {
        return this._inited;
      }
    }]);

    return Game;
  }(_eventTarget.EventTarget);

  _exports.Game = Game;
  Game.EVENT_HIDE = 'game_on_hide';
  Game.EVENT_SHOW = 'game_on_show';
  Game.EVENT_GAME_INITED = 'game_inited';
  Game.EVENT_ENGINE_INITED = 'engine_inited';
  Game.EVENT_RENDERER_INITED = 'renderer_inited';
  Game.EVENT_RESTART = 'game_on_restart';
  Game.RENDER_TYPE_CANVAS = 0;
  Game.RENDER_TYPE_WEBGL = 1;
  Game.RENDER_TYPE_OPENGL = 2;
  _globalExports.legacyCC.Game = Game;
  /**
   * @en
   * This is a Game instance.
   * @zh
   * 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。
   */

  var game = _globalExports.legacyCC.game = new Game();
  _exports.game = game;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2FtZS50cyJdLCJuYW1lcyI6WyJHYW1lIiwiZnJhbWUiLCJjb250YWluZXIiLCJjYW52YXMiLCJyZW5kZXJUeXBlIiwiZXZlbnRUYXJnZXRPbiIsImV2ZW50VGFyZ2V0T25jZSIsImNvbmZpZyIsIm9uU3RhcnQiLCJfcGVyc2lzdFJvb3ROb2RlcyIsIl9wYXVzZWQiLCJfY29uZmlnTG9hZGVkIiwiX2lzQ2xvbmluZyIsIl9pbml0ZWQiLCJfcmVuZGVyZXJJbml0aWFsaXplZCIsIl9nZnhEZXZpY2UiLCJfaW50ZXJ2YWxJZCIsIl9sYXN0VGltZSIsIl9mcmFtZVRpbWUiLCJfc2NlbmVJbmZvcyIsImNvbGxpc2lvbk1hdHJpeCIsImdyb3VwTGlzdCIsImZyYW1lUmF0ZSIsInBhcnNlSW50IiwiaXNOYU4iLCJfc2V0QW5pbUZyYW1lIiwiX3J1bk1haW5Mb29wIiwibGVnYWN5Q0MiLCJkaXJlY3RvciIsIm1haW5Mb29wIiwid2luZG93IiwiY0FGIiwiSlNCIiwiUlVOVElNRV9CQVNFRCIsIkFMSVBBWSIsInN3YXBidWZmZXJzIiwiY2IiLCJyQUYiLCJyb290IiwiZnJhbWVNb3ZlIiwiZGV2aWNlIiwicHJlc2VudCIsIm9uY2UiLCJEaXJlY3RvciIsIkVWRU5UX0FGVEVSX0RSQVciLCJpZCIsImdhbWUiLCJyZW1vdmVQZXJzaXN0Um9vdE5vZGUiLCJnZXRTY2VuZSIsImRlc3Ryb3kiLCJPYmplY3QiLCJfZGVmZXJyZWREZXN0cm95IiwicmVzZXQiLCJfc2FmZUVtaXQiLCJFVkVOVF9SRVNUQVJUIiwiY2xvc2UiLCJ0eXBlIiwiY2FsbGJhY2siLCJ0YXJnZXQiLCJFVkVOVF9FTkdJTkVfSU5JVEVEIiwiY2FsbCIsIl9pbml0Q29uZmlnIiwiYXNzZXRPcHRpb25zIiwiQXNzZXRMaWJyYXJ5IiwiaW5pdCIsIl9pbml0RW5naW5lIiwiRURJVE9SIiwiX2luaXRFdmVudHMiLCJkYXRhUG9vbE1hbmFnZXIiLCJqb2ludFRleHR1cmVQb29sIiwicmVnaXN0ZXJDdXN0b21UZXh0dXJlTGF5b3V0cyIsImN1c3RvbUpvaW50VGV4dHVyZUxheW91dHMiLCJsZWdhY3lPblN0YXJ0IiwicmVnaXN0ZXJTeXN0ZW1FdmVudCIsImlucHV0TWFuYWdlciIsInVzZVNwbGFzaCIsIlBSRVZJRVciLCJpbnRlcm5hbCIsIlNwbGFzaFNjcmVlbiIsInJlbmRlclBpcGVsaW5lIiwibG9hZGVyIiwibG9hZCIsInV1aWQiLCJlcnIiLCJhc3NldCIsImNvbnNvbGUiLCJ3YXJuIiwic2V0UmVuZGVyUGlwZWxpbmUiLCJlIiwiRVZFTlRfR0FNRV9JTklURUQiLCJzcGxhc2hTY3JlZW4iLCJpbnN0YW5jZSIsIm1haW4iLCJzZXRPbkZpbmlzaCIsImxvYWRGaW5pc2giLCJub2RlIiwiTm9kZSIsImlzTm9kZSIsImRlYnVnIiwid2FybklEIiwic2NlbmUiLCJfc2NlbmUiLCJpc1ZhbGlkIiwicGFyZW50IiwiU2NlbmUiLCJfcGVyc2lzdE5vZGUiLCJfaW5pdERldmljZSIsIl9pbml0IiwibG9nIiwiRU5HSU5FX1ZFUlNJT04iLCJlbWl0IiwiRGF0ZSIsImpzYiIsInNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZCIsInJlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwiX3N0VGltZSIsIl9jdFRpbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJvUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc0NhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSIsIm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtc0NhbmNlbEFuaW1hdGlvbkZyYW1lIiwibW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSIsIm9jYW5jZWxBbmltYXRpb25GcmFtZSIsImN1cnJUaW1lIiwiZ2V0VGltZSIsImVsYXBzZVRpbWUiLCJNYXRoIiwibWF4IiwidGltZVRvQ2FsbCIsInNldFRpbWVvdXQiLCJjbGVhclRpbWVvdXQiLCJHQU1FX1ZJRVciLCJza2lwIiwic2V0RGlzcGxheVN0YXRzIiwic2hvd0ZQUyIsInN0YXJ0QW5pbWF0aW9uIiwidGltZSIsImRlYnVnTW9kZSIsImV4cG9zZUNsYXNzTmFtZSIsInJlbmRlck1vZGUiLCJzY2VuZXMiLCJfcmVzZXREZWJ1Z1NldHRpbmciLCJ1c2VyUmVuZGVyTW9kZSIsIlJFTkRFUl9UWVBFX0NBTlZBUyIsInN1cHBvcnRSZW5kZXIiLCJzeXMiLCJjYXBhYmlsaXRpZXMiLCJvcGVuZ2wiLCJSRU5ERVJfVFlQRV9XRUJHTCIsIkVycm9yIiwiZ2V0RXJyb3IiLCJhZGFwdGVyIiwiX2RldGVybWluZVJlbmRlclR5cGUiLCJjdG9ycyIsImdmeCIsIkNDVktEZXZpY2UiLCJwdXNoIiwiQ0NNVExEZXZpY2UiLCJHTEVTM0RldmljZSIsIkdMRVMyRGV2aWNlIiwidXNlV2ViR0wyIiwiV2ViR0wyUmVuZGVyaW5nQ29udGV4dCIsInVzZXJBZ2VudCIsIm5hdmlnYXRvciIsInRvTG93ZXJDYXNlIiwiaW5kZXhPZiIsImJyb3dzZXJUeXBlIiwiQlJPV1NFUl9UWVBFX1VDIiwiV2ViR0wyRGV2aWNlIiwiV2ViR0xEZXZpY2UiLCJvcHRzIiwiR0ZYRGV2aWNlSW5mbyIsIm1hY3JvIiwiRU5BQkxFX1dFQkdMX0FOVElBTElBUyIsImRldmljZVBpeGVsUmF0aW8iLCJmbG9vciIsInNjcmVlbiIsIndpZHRoIiwiaGVpZ2h0IiwiYmluZGluZ01hcHBpbmdJbmZvIiwiaSIsImxlbmd0aCIsImluaXRpYWxpemUiLCJlcnJvciIsIm9uY29udGV4dG1lbnUiLCJfaXNDb250ZXh0TWVudUVuYWJsZSIsIndpbiIsImhpZGRlblByb3BOYW1lIiwiZG9jdW1lbnQiLCJoaWRkZW4iLCJtb3pIaWRkZW4iLCJtc0hpZGRlbiIsIndlYmtpdEhpZGRlbiIsIm9uSGlkZGVuIiwiRVZFTlRfSElERSIsIm9uU2hvd24iLCJhcmcwIiwiYXJnMSIsImFyZzIiLCJhcmczIiwiYXJnNCIsIkVWRU5UX1NIT1ciLCJjaGFuZ2VMaXN0IiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwidmlzaWJsZSIsIm9uZm9jdXMiLCJvbiIsInBhdXNlIiwicmVzdW1lIiwicnBwbCIsIkVWRU5UX1JFTkRFUkVSX0lOSVRFRCIsIkV2ZW50VGFyZ2V0IiwiUkVOREVSX1RZUEVfT1BFTkdMIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvT0E7Ozs7O01BS2FBLEk7Ozs7Ozs7Ozs7Ozs7OztZQTZFRkMsSyxHQUF1QixJO1lBS3ZCQyxTLEdBQW1DLEk7WUFLbkNDLE0sR0FBbUMsSTtZQU1uQ0MsVSxHQUFxQixDQUFDLEM7WUFFdEJDLGE7WUFDQUMsZTtZQVVBQyxNLEdBQXNCLEU7WUFPdEJDLE8sR0FBMkIsSTtZQVUzQkMsaUIsR0FBb0IsRTtZQUdwQkMsTyxHQUFtQixJO1lBQ25CQyxhLEdBQXlCLEs7WUFDekJDLFUsR0FBc0IsSztZQUN0QkMsTyxHQUFtQixLO1lBQ25CQyxvQixHQUFnQyxLO1lBRWhDQyxVLEdBQStCLEk7WUFFL0JDLFcsR0FBNkIsSTtZQUU3QkMsUyxHQUF5QixJO1lBQ3pCQyxVLEdBQTRCLEk7WUFHNUJDLFcsR0FBNEIsRTtZQUM1QkMsZSxHQUFrQixFO1lBQ2xCQyxTLEdBQW1CLEU7Ozs7OztBQUUxQjtBQUVBOztBQUNBOzs7OzttQ0FLcUJDLFMsRUFBbUI7QUFDcEMsWUFBTWYsTUFBTSxHQUFHLEtBQUtBLE1BQXBCOztBQUNBLFlBQUksT0FBT2UsU0FBUCxLQUFxQixRQUF6QixFQUFtQztBQUMvQkEsVUFBQUEsU0FBUyxHQUFHQyxR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TixrQixHQUE2QixDO0FBeXVCL0NsTSwwQkFBUzNCLElBQVQsR0FBZ0JBLElBQWhCO0FBRUE7Ozs7Ozs7QUFNTyxNQUFNOEMsSUFBSSxHQUFHbkIsd0JBQVNtQixJQUFULEdBQWdCLElBQUk5QyxJQUFKLEVBQTdCIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuIENvcHlyaWdodCAoYykgMjAxMy0yMDE2IENodWtvbmcgVGVjaG5vbG9naWVzIEluYy5cclxuIENvcHlyaWdodCAoYykgMjAxNy0yMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiAgd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuICBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiAgdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG4vKipcclxuICogQGNhdGVnb3J5IGNvcmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBBTElQQVksIEVESVRPUiwgSlNCLCBQUkVWSUVXLCBSVU5USU1FX0JBU0VEIH0gZnJvbSAnaW50ZXJuYWw6Y29uc3RhbnRzJztcclxuaW1wb3J0IEFzc2V0TGlicmFyeSBmcm9tICcuL2Fzc2V0cy9hc3NldC1saWJyYXJ5JztcclxuaW1wb3J0IHsgRXZlbnRUYXJnZXQgfSBmcm9tICcuL2V2ZW50L2V2ZW50LXRhcmdldCc7XHJcbmltcG9ydCAqIGFzIGRlYnVnIGZyb20gJy4vcGxhdGZvcm0vZGVidWcnO1xyXG5pbXBvcnQgaW5wdXRNYW5hZ2VyIGZyb20gJy4vcGxhdGZvcm0vZXZlbnQtbWFuYWdlci9pbnB1dC1tYW5hZ2VyJztcclxuaW1wb3J0IHsgR0ZYRGV2aWNlLCBHRlhEZXZpY2VJbmZvIH0gZnJvbSAnLi9nZngnO1xyXG5pbXBvcnQgeyBzeXMgfSBmcm9tICcuL3BsYXRmb3JtL3N5cyc7XHJcbmltcG9ydCB7IG1hY3JvIH0gZnJvbSAnLi9wbGF0Zm9ybS9tYWNybyc7XHJcbmltcG9ydCB7IElDdXN0b21Kb2ludFRleHR1cmVMYXlvdXQgfSBmcm9tICcuL3JlbmRlcmVyL21vZGVscyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi9nbG9iYWwtZXhwb3J0cyc7XHJcbmltcG9ydCB7IElQaHlzaWNzQ29uZmlnIH0gZnJvbSAnLi4vcGh5c2ljcy9mcmFtZXdvcmsvcGh5c2ljcy1jb25maWcnO1xyXG5pbXBvcnQgeyBiaW5kaW5nTWFwcGluZ0luZm8gfSBmcm9tICcuL3BpcGVsaW5lL2RlZmluZSc7XHJcbmltcG9ydCB7IFNwbGFzaFNjcmVlbiB9IGZyb20gJy4vc3BsYXNoLXNjcmVlbic7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIEFzc2V0TGlicmFyeSDphY3nva7jgIJcclxuICogQGVuXHJcbiAqIEFzc2V0TGlicmFyeSBjb25maWd1cmF0aW9uLlxyXG4gKi9cclxuZXhwb3J0IGludGVyZmFjZSBJQXNzZXRPcHRpb25zIHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlr7zlhaUgTGlicmFyeSDnmoTotYTmupDmoLnnm67lvZXvvIjnm7jlr7nkuo7mnoTlu7rnm67lvZXvvIlcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIHJvb3QgcGF0aCAocmVsYXRpdmUgdG8gdGhlIGJ1aWxkIGRlc3RpbmF0aW9uIGZvbGRlcikgb2YgdGhlIGltcG9ydGVkIGxpYnJhcnkgYXNzZXRzXHJcbiAgICAgKi9cclxuICAgIGxpYnJhcnlQYXRoOiBzdHJpbmc7XHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICogUmF3QXNzZXRzIOexu+i1hOa6kOeahOagueebruW9leWJjee8gO+8iOebuOWvueS6juaehOW7uuebruW9le+8ie+8jFxyXG4gICAgICog6L+Z5Liq6Lev5b6E5bC+6YOo5ZKMIFwiYXNzZXRzXCIg5ou85o6l5ZCO5bCx5piv5a6M5pW06Lev5b6EXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBwcmVmaXggb2YgdGhlIHJvb3QgcGF0aCAocmVsYXRpdmUgdG8gdGhlIGJ1aWxkIGRlc3RpbmF0aW9uIGZvbGRlcikgb2YgdGhlIHJhdyBhc3NldHMsXHJcbiAgICAgKiBUaGlzIHdpbGwgYmUgam9pbnQgd2l0aCBcImFzc2V0c1wiIHRvIGZvcm0gdGhlIGNvbXBsZXRlIHBhdGhcclxuICAgICAqL1xyXG4gICAgcmF3QXNzZXRzQmFzZTogc3RyaW5nO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIFJhd0Fzc2V0cyDliJfooajvvIzku44gU2V0dGluZ3Mg5Lit6I635Y+WXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBsaXN0IG9mIHJhdyBhc3NldHMsIG5vcm1hbGx5IHJldHJpZXZlZCBmcm9tIFNldHRpbmdzXHJcbiAgICAgKi9cclxuICAgIHJhd0Fzc2V0czogb2JqZWN0O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWQiOW5tuWQjueahOi1hOa6kOWQiOmbhuWIl+ihqFxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGlzdCBvZiBhc3NldCBwYWNrc1xyXG4gICAgICovXHJcbiAgICBwYWNrZWRBc3NldHM/OiBvYmplY3Q7XHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6LWE5rqQ5Y+K5YW2IG1kNSDliY3nvIDlhbPns7tcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG1hcCBvZiBhc3NldHMgYW5kIHRoZWlyIG1kNSBwcmVmaXhcclxuICAgICAqL1xyXG4gICAgbWQ1QXNzZXRzTWFwPzogb2JqZWN0O1xyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWtkOWMheWIl+ihqFxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbGlzdCBvZiBzdWIgcGFja2FnZXNcclxuICAgICAqL1xyXG4gICAgc3ViUGFja2FnZXM/OiBbXTtcclxufVxyXG5cclxuaW50ZXJmYWNlIElTY2VuZUluZm8ge1xyXG4gICAgdXJsOiBzdHJpbmc7XHJcbiAgICB1dWlkOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5ri45oiP6YWN572u44CCXHJcbiAqIEBlblxyXG4gKiBHYW1lIGNvbmZpZ3VyYXRpb24uXHJcbiAqL1xyXG5leHBvcnQgaW50ZXJmYWNlIElHYW1lQ29uZmlnIHtcclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorr7nva4gZGVidWcg5qih5byP77yM5Zyo5rWP6KeI5Zmo5Lit6L+Z5Liq6YCJ6aG55Lya6KKr5b+955Wl44CCXHJcbiAgICAgKiDlkITnp43orr7nva7pgInpobnnmoTmhI/kuYnvvJpcclxuICAgICAqICAtIDAgLSDmsqHmnInmtojmga/ooqvmiZPljbDlh7rmnaXjgIJcclxuICAgICAqICAtIDEgLSBgZXJyb3Jg77yMYGFzc2VydGDvvIxgd2FybmDvvIxgbG9nYCDlsIbmiZPljbDlnKggY29uc29sZSDkuK3jgIJcclxuICAgICAqICAtIDIgLSBgZXJyb3Jg77yMYGFzc2VydGDvvIxgd2FybmAg5bCG5omT5Y2w5ZyoIGNvbnNvbGUg5Lit44CCXHJcbiAgICAgKiAgLSAzIC0gYGVycm9yYO+8jGBhc3NlcnRgIOWwhuaJk+WNsOWcqCBjb25zb2xlIOS4reOAglxyXG4gICAgICogIC0gNCAtIGBlcnJvcmDvvIxgYXNzZXJ0YO+8jGB3YXJuYO+8jGBsb2dgIOWwhuaJk+WNsOWcqCBjYW52YXMg5Lit77yI5LuF6YCC55So5LqOIHdlYiDnq6/vvInjgIJcclxuICAgICAqICAtIDUgLSBgZXJyb3Jg77yMYGFzc2VydGDvvIxgd2FybmAg5bCG5omT5Y2w5ZyoIGNhbnZhcyDkuK3vvIjku4XpgILnlKjkuo4gd2ViIOerr++8ieOAglxyXG4gICAgICogIC0gNiAtIGBlcnJvcmDvvIxgYXNzZXJ0YCDlsIbmiZPljbDlnKggY2FudmFzIOS4re+8iOS7hemAgueUqOS6jiB3ZWIg56uv77yJ44CCXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCBkZWJ1ZyBtb2RlLCBvbmx5IHZhbGlkIGluIG5vbi1icm93c2VyIGVudmlyb25tZW50LlxyXG4gICAgICogUG9zc2libGUgdmFsdWVzOlxyXG4gICAgICogMCAtIE5vIG1lc3NhZ2Ugd2lsbCBiZSBwcmludGVkLlxyXG4gICAgICogMSAtIGBlcnJvcmDvvIxgYXNzZXJ0YO+8jGB3YXJuYO+8jGBsb2dgIHdpbGwgcHJpbnQgaW4gY29uc29sZS5cclxuICAgICAqIDIgLSBgZXJyb3Jg77yMYGFzc2VydGDvvIxgd2FybmAgd2lsbCBwcmludCBpbiBjb25zb2xlLlxyXG4gICAgICogMyAtIGBlcnJvcmDvvIxgYXNzZXJ0YCB3aWxsIHByaW50IGluIGNvbnNvbGUuXHJcbiAgICAgKiA0IC0gYGVycm9yYO+8jGBhc3NlcnRg77yMYHdhcm5g77yMYGxvZ2Agd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi5cclxuICAgICAqIDUgLSBgZXJyb3Jg77yMYGFzc2VydGDvvIxgd2FybmAgd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi5cclxuICAgICAqIDYgLSBgZXJyb3Jg77yMYGFzc2VydGAgd2lsbCBwcmludCBvbiBjYW52YXMsIGF2YWlsYWJsZSBvbmx5IG9uIHdlYi5cclxuICAgICAqL1xyXG4gICAgZGVidWdNb2RlPzogMCB8IDEgfCAyIHwgMyB8IDQgfCA1IHwgNjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5b2TIHNob3dGUFMg5Li6IHRydWUg55qE5pe25YCZ55WM6Z2i55qE5bem5LiL6KeS5bCG5pi+56S6IGZwcyDnmoTkv6Hmga/vvIzlkKbliJnooqvpmpDol4/jgIJcclxuICAgICAqIEBlblxyXG4gICAgICogTGVmdCBib3R0b20gY29ybmVyIGZwcyBpbmZvcm1hdGlvbiB3aWxsIHNob3cgd2hlbiBcInNob3dGUFNcIiBlcXVhbHMgdHJ1ZSwgb3RoZXJ3aXNlIGl0IHdpbGwgYmUgaGlkZS5cclxuICAgICAqL1xyXG4gICAgc2hvd0ZQUz86IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaatOmcsuexu+WQjeiuqSBDaHJvbWUgRGV2VG9vbHMg5Y+v5Lul6K+G5Yir77yM5aaC5p6c5byA5ZCv5Lya56iN56iN6ZmN5L2O57G755qE5Yib5bu66L+H56iL55qE5oCn6IO977yM5L2G5a+55a+56LGh5p6E6YCg5rKh5pyJ5b2x5ZON44CCXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEV4cG9zZSBjbGFzcyBuYW1lIHRvIGNocm9tZSBkZWJ1ZyB0b29scywgdGhlIGNsYXNzIGludGFudGlhdGUgcGVyZm9ybWFuY2UgaXMgYSBsaXR0bGUgYml0IHNsb3dlciB3aGVuIGV4cG9zZWQuXHJcbiAgICAgKi9cclxuICAgIGV4cG9zZUNsYXNzTmFtZT86IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruaDs+imgeeahOW4p+eOh+S9oOeahOa4uOaIj++8jOS9huecn+ato+eahEZQU+WPluWGs+S6juS9oOeahOa4uOaIj+WunueOsOWSjOi/kOihjOeOr+Wig+OAglxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXQgdGhlIHdhbnRlZCBmcmFtZSByYXRlIGZvciB5b3VyIGdhbWUsIGJ1dCB0aGUgcmVhbCBmcHMgZGVwZW5kcyBvbiB5b3VyIGdhbWUgaW1wbGVtZW50YXRpb24gYW5kIHRoZSBydW5uaW5nIGVudmlyb25tZW50LlxyXG4gICAgICovXHJcbiAgICBmcmFtZVJhdGU/OiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIFdlYiDpobXpnaLkuIrnmoQgQ2FudmFzIEVsZW1lbnQgSUTvvIzku4XpgILnlKjkuo4gd2ViIOerr+OAglxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXRzIHRoZSBpZCBvZiB5b3VyIGNhbnZhcyBlbGVtZW50IG9uIHRoZSB3ZWIgcGFnZSwgaXQncyB1c2VmdWwgb25seSBvbiB3ZWIuXHJcbiAgICAgKi9cclxuICAgIGlkPzogc3RyaW5nIHwgSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOa4suafk+aooeW8j+OAglxyXG4gICAgICog6K6+572u5riy5p+T5Zmo57G75Z6L77yM5LuF6YCC55So5LqOIHdlYiDnq6/vvJpcclxuICAgICAqIC0gMCAtIOmAmui/h+W8leaTjuiHquWKqOmAieaLqeOAglxyXG4gICAgICogLSAxIC0g5by65Yi25L2/55SoIGNhbnZhcyDmuLLmn5PjgIJcclxuICAgICAqIC0gMiAtIOW8uuWItuS9v+eUqCBXZWJHTCDmuLLmn5PvvIzkvYbmmK/lnKjpg6jliIYgQW5kcm9pZCDmtY/op4jlmajkuK3ov5nkuKrpgInpobnkvJrooqvlv73nlaXjgIJcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0cyB0aGUgcmVuZGVyZXIgdHlwZSwgb25seSB1c2VmdWwgb24gd2ViOlxyXG4gICAgICogLSAwIC0gQXV0b21hdGljYWxseSBjaG9zZW4gYnkgZW5naW5lLlxyXG4gICAgICogLSAxIC0gRm9yY2VkIHRvIHVzZSBjYW52YXMgcmVuZGVyZXIuXHJcbiAgICAgKiAtIDIgLSBGb3JjZWQgdG8gdXNlIFdlYkdMIHJlbmRlcmVyLCBidXQgdGhpcyB3aWxsIGJlIGlnbm9yZWQgb24gbW9iaWxlIGJyb3dzZXJzLlxyXG4gICAgICovXHJcbiAgICByZW5kZXJNb2RlPzogMCB8IDEgfCAyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY3ljIXkuK3lj6/nlKjlnLrmma/jgIJcclxuICAgICAqIEBlblxyXG4gICAgICogSW5jbHVkZSBhdmFpbGFibGUgc2NlbmVzIGluIHRoZSBjdXJyZW50IGJ1bmRsZS5cclxuICAgICAqL1xyXG4gICAgc2NlbmVzPzogSVNjZW5lSW5mb1tdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yIGludGVybmFsIHVzZS5cclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJTeXN0ZW1FdmVudD86IGJvb2xlYW47XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgaW50ZXJuYWwgdXNlLlxyXG4gICAgICovXHJcbiAgICBjb2xsaXNpb25NYXRyaXg/OiBuZXZlcltdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogRm9yIGludGVybmFsIHVzZS5cclxuICAgICAqL1xyXG4gICAgZ3JvdXBMaXN0PzogYW55W107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGb3IgaW50ZXJuYWwgdXNlLlxyXG4gICAgICovXHJcbiAgICBqc0xpc3Q/OiBzdHJpbmdbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbmRlciBwaXBlbGluZSByZXNvdXJjZXNcclxuICAgICAqL1xyXG4gICAgcmVuZGVyUGlwZWxpbmU/OiBzdHJpbmc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBc3NldCBsaWJyYXJ5IGluaXRpYWxpemF0aW9uIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgYXNzZXRPcHRpb25zPzogSUFzc2V0T3B0aW9ucztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEdQVSBpbnN0YW5jaW5nIG9wdGlvbnNcclxuICAgICAqL1xyXG4gICAgY3VzdG9tSm9pbnRUZXh0dXJlTGF5b3V0cz86IElDdXN0b21Kb2ludFRleHR1cmVMYXlvdXRbXTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFBoeXNpY3Mgc3lzdGVtIGNvbmZpZ1xyXG4gICAgICovXHJcbiAgICBwaHlzaWNzPzogSVBoeXNpY3NDb25maWc7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gQW4gb2JqZWN0IHRvIGJvb3QgdGhlIGdhbWUuXHJcbiAqIEB6aCDljIXlkKvmuLjmiI/kuLvkvZPkv6Hmga/lubbotJ/otKPpqbHliqjmuLjmiI/nmoTmuLjmiI/lr7nosaHjgIJcclxuICogQGNsYXNzIEdhbWVcclxuICovXHJcbmV4cG9ydCBjbGFzcyBHYW1lIGV4dGVuZHMgRXZlbnRUYXJnZXQge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXZlbnQgdHJpZ2dlcmVkIHdoZW4gZ2FtZSBoaWRlIHRvIGJhY2tncm91bmQuPGJyPlxyXG4gICAgICogUGxlYXNlIG5vdGUgdGhhdCB0aGlzIGV2ZW50IGlzIG5vdCAxMDAlIGd1YXJhbnRlZWQgdG8gYmUgZmlyZWQgb24gV2ViIHBsYXRmb3JtLDxicj5cclxuICAgICAqIG9uIG5hdGl2ZSBwbGF0Zm9ybXMsIGl0IGNvcnJlc3BvbmRzIHRvIGVudGVyIGJhY2tncm91bmQgZXZlbnQsIG9zIHN0YXR1cyBiYXIgb3Igbm90aWZpY2F0aW9uIGNlbnRlciBtYXkgbm90IHRyaWdnZXIgdGhpcyBldmVudC5cclxuICAgICAqIEB6aCDmuLjmiI/ov5vlhaXlkI7lj7Dml7bop6blj5HnmoTkuovku7bjgII8YnI+XHJcbiAgICAgKiDor7fms6jmhI/vvIzlnKggV0VCIOW5s+WPsO+8jOi/meS4quS6i+S7tuS4jeS4gOWumuS8miAxMDAlIOinpuWPke+8jOi/meWujOWFqOWPluWGs+S6jua1j+iniOWZqOeahOWbnuiwg+ihjOS4uuOAgjxicj5cclxuICAgICAqIOWcqOWOn+eUn+W5s+WPsO+8jOWug+WvueW6lOeahOaYr+W6lOeUqOiiq+WIh+aNouWIsOWQjuWPsOS6i+S7tu+8jOS4i+aLieiPnOWNleWSjOS4iuaLieeKtuaAgeagj+etieS4jeS4gOWumuS8muinpuWPkei/meS4quS6i+S7tu+8jOi/meWPluWGs+S6juezu+e7n+ihjOS4uuOAglxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGBgYHRzXHJcbiAgICAgKiBpbXBvcnQgeyBnYW1lLCBhdWRpb0VuZ2luZSB9IGZyb20gJ2NjJztcclxuICAgICAqIGdhbWUub24oR2FtZS5FVkVOVF9ISURFLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgKiAgICAgYXVkaW9FbmdpbmUucGF1c2VNdXNpYygpO1xyXG4gICAgICogICAgIGF1ZGlvRW5naW5lLnBhdXNlQWxsRWZmZWN0cygpO1xyXG4gICAgICogfSk7XHJcbiAgICAgKiBgYGBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBFVkVOVF9ISURFOiBzdHJpbmcgPSAnZ2FtZV9vbl9oaWRlJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFdmVudCB0cmlnZ2VyZWQgd2hlbiBnYW1lIGJhY2sgdG8gZm9yZWdyb3VuZDxicj5cclxuICAgICAqIFBsZWFzZSBub3RlIHRoYXQgdGhpcyBldmVudCBpcyBub3QgMTAwJSBndWFyYW50ZWVkIHRvIGJlIGZpcmVkIG9uIFdlYiBwbGF0Zm9ybSw8YnI+XHJcbiAgICAgKiBvbiBuYXRpdmUgcGxhdGZvcm1zLCBpdCBjb3JyZXNwb25kcyB0byBlbnRlciBmb3JlZ3JvdW5kIGV2ZW50LlxyXG4gICAgICogQHpoIOa4uOaIj+i/m+WFpeWJjeWPsOi/kOihjOaXtuinpuWPkeeahOS6i+S7tuOAgjxicj5cclxuICAgICAqIOivt+azqOaEj++8jOWcqCBXRUIg5bmz5Y+w77yM6L+Z5Liq5LqL5Lu25LiN5LiA5a6a5LyaIDEwMCUg6Kem5Y+R77yM6L+Z5a6M5YWo5Y+W5Yaz5LqO5rWP6KeI5Zmo55qE5Zue6LCD6KGM5Li644CCPGJyPlxyXG4gICAgICog5Zyo5Y6f55Sf5bmz5Y+w77yM5a6D5a+55bqU55qE5piv5bqU55So6KKr5YiH5o2i5Yiw5YmN5Y+w5LqL5Lu244CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgRVZFTlRfU0hPVzogc3RyaW5nID0gJ2dhbWVfb25fc2hvdyc7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRXZlbnQgdHJpZ2dlcmVkIGFmdGVyIGdhbWUgaW5pdGVkLCBhdCB0aGlzIHBvaW50IGFsbCBlbmdpbmUgb2JqZWN0cyBhbmQgZ2FtZSBzY3JpcHRzIGFyZSBsb2FkZWRcclxuICAgICAqIEB6aCDmuLjmiI/lkK/liqjlkI7nmoTop6blj5Hkuovku7bvvIzmraTml7bliqDovb3miYDmnInnmoTlvJXmk47lr7nosaHlkozmuLjmiI/ohJrmnKzjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBFVkVOVF9HQU1FX0lOSVRFRDogc3RyaW5nID0gJ2dhbWVfaW5pdGVkJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgZW5naW5lIGluaXRlZCwgYXQgdGhpcyBwb2ludCB5b3Ugd2lsbCBiZSBhYmxlIHRvIHVzZSBhbGwgZW5naW5lIGNsYXNzZXMuPGJyPlxyXG4gICAgICogSXQgd2FzIGRlZmluZWQgYXMgRVZFTlRfUkVOREVSRVJfSU5JVEVEIGluIGNvY29zIGNyZWF0b3IgdjEueCBhbmQgcmVuYW1lZCBpbiB2Mi4wLlxyXG4gICAgICogSW4gY29jb3MgY3JlYXRvciAzZCwgRVZFTlRfUkVOREVSRVJfSU5JVEVEIGlzIGEgbmV3IGV2ZW50LCBsb29rIHVwIGRlZmluZSBmb3IgZGV0YWlscy5cclxuICAgICAqIEB6aCDlnKjlvJXmk47liJ3lp4vljJbkuYvlkI7op6blj5HnmoTkuovku7bvvIzmraTml7bmgqjog73lpJ/kvb/nlKjlvJXmk47miYDmnInnmoTnsbvjgII8YnI+XHJcbiAgICAgKiDlroPlnKggY29jb3MgY3JlYXRvciB2MS54IOeJiOacrOS4reWQjeWtl+S4uiBFVkVOVF9SRU5ERVJFUl9JTklURUQgLOWcqCB2Mi4wIOeJiOacrOS4reabtOWQjeS4uiBFVkVOVF9FTkdJTkVfSU5JVEVEXHJcbiAgICAgKiDlubblnKggY29jb3MgY3JlYXRvciAzZCDniYjmnKzkuK3lsIYgRVZFTlRfUkVOREVSRVJfSU5JVEVEIOeUqOS9nOS4uua4suafk+WZqOWIneWni+WMlueahOS6i+S7tuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIEVWRU5UX0VOR0lORV9JTklURUQ6IHN0cmluZyA9ICdlbmdpbmVfaW5pdGVkJztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBFdmVudCB0cmlnZ2VyZWQgYWZ0ZXIgcmVuZGVyZXIgaW5pdGVkLCBhdCB0aGlzIHBvaW50IHlvdSB3aWxsIGJlIGFibGUgdG8gdXNlIGFsbCBnZnggcmVuZGVyZXIgZmVhdHVyZS48YnI+XHJcbiAgICAgKiBAemgg5Zyo5riy5p+T5Zmo5Yid5aeL5YyW5LmL5ZCO6Kem5Y+R55qE5LqL5Lu277yM5q2k5LqL5Lu25ZyoIEVWRU5UX0VOR0lORV9JTklURUQg5LmL5YmN6Kem5Y+R77yM5q2k5pe25byA5aeL5Y+v5L2/55SoIGdmeCDmuLLmn5PmoYbmnrbjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyByZWFkb25seSBFVkVOVF9SRU5ERVJFUl9JTklURUQ6IHN0cmluZyA9ICdyZW5kZXJlcl9pbml0ZWQnO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEV2ZW50IHRyaWdnZXJlZCB3aGVuIGdhbWUgcmVzdGFydFxyXG4gICAgICogQHpoIOiwg+eUqHJlc3RhcnTlkI7vvIzop6blj5Hkuovku7ZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBFVkVOVF9SRVNUQVJUOiBzdHJpbmcgPSAnZ2FtZV9vbl9yZXN0YXJ0JztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXZWIgQ2FudmFzIDJkIEFQSSBhcyByZW5kZXJlciBiYWNrZW5kLlxyXG4gICAgICogQHpoIOS9v+eUqCBXZWIgQ2FudmFzIDJkIEFQSSDkvZzkuLrmuLLmn5PlmajlkI7nq6/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBSRU5ERVJfVFlQRV9DQU5WQVM6IG51bWJlciA9IDA7XHJcbiAgICAvKipcclxuICAgICAqIEBlbiBXZWJHTCBBUEkgYXMgcmVuZGVyZXIgYmFja2VuZC5cclxuICAgICAqIEB6aCDkvb/nlKggV2ViR0wgQVBJIOS9nOS4uua4suafk+WZqOWQjuerr+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFTkRFUl9UWVBFX1dFQkdMOiBudW1iZXIgPSAxO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gT3BlbkdMIEFQSSBhcyByZW5kZXJlciBiYWNrZW5kLlxyXG4gICAgICogQHpoIOS9v+eUqCBPcGVuR0wgQVBJIOS9nOS4uua4suafk+WZqOWQjuerr+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIFJFTkRFUl9UWVBFX09QRU5HTDogbnVtYmVyID0gMjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBUaGUgb3V0ZXIgZnJhbWUgb2YgdGhlIGdhbWUgY2FudmFzOyBwYXJlbnQgb2YgZ2FtZSBjb250YWluZXIuXHJcbiAgICAgKiBAemgg5ri45oiP55S75biD55qE5aSW5qGG77yMY29udGFpbmVyIOeahOeItuWuueWZqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZnJhbWU6IE9iamVjdCB8IG51bGwgPSBudWxsO1xyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIGNvbnRhaW5lciBvZiBnYW1lIGNhbnZhcy5cclxuICAgICAqIEB6aCDmuLjmiI/nlLvluIPnmoTlrrnlmajjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIC8qKlxyXG4gICAgICogQGVuIFRoZSBjYW52YXMgb2YgdGhlIGdhbWUuXHJcbiAgICAgKiBAemgg5ri45oiP55qE55S75biD44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gVGhlIHJlbmRlcmVyIGJhY2tlbmQgb2YgdGhlIGdhbWUuXHJcbiAgICAgKiBAemgg5ri45oiP55qE5riy5p+T5Zmo57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW5kZXJUeXBlOiBudW1iZXIgPSAtMTtcclxuXHJcbiAgICBwdWJsaWMgZXZlbnRUYXJnZXRPbiA9IHN1cGVyLm9uO1xyXG4gICAgcHVibGljIGV2ZW50VGFyZ2V0T25jZSA9IHN1cGVyLm9uY2U7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBjdXJyZW50IGdhbWUgY29uZmlndXJhdGlvbixcclxuICAgICAqIHBsZWFzZSBiZSBub3RpY2VkIGFueSBtb2RpZmljYXRpb24gZGlyZWN0bHkgb24gdGhpcyBvYmplY3QgYWZ0ZXIgdGhlIGdhbWUgaW5pdGlhbGl6YXRpb24gd29uJ3QgdGFrZSBlZmZlY3QuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW9k+WJjeeahOa4uOaIj+mFjee9rlxyXG4gICAgICog5rOo5oSP77ya6K+35LiN6KaB55u05o6l5L+u5pS56L+Z5Liq5a+56LGh77yM5a6D5LiN5Lya5pyJ5Lu75L2V5pWI5p6c44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb25maWc6IElHYW1lQ29uZmlnID0ge307XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2FsbGJhY2sgd2hlbiB0aGUgc2NyaXB0cyBvZiBlbmdpbmUgaGF2ZSBiZWVuIGxvYWQuXHJcbiAgICAgKiBAemgg5b2T5byV5pOO5a6M5oiQ5ZCv5Yqo5ZCO55qE5Zue6LCD5Ye95pWw44CCXHJcbiAgICAgKiBAbWV0aG9kIG9uU3RhcnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uU3RhcnQ6IEZ1bmN0aW9uIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGVuZ2luZSBoYXMgaW5pdGVkXHJcbiAgICAgKiBAemgg5byV5pOO5piv5ZCm5Lul5a6M5oiQ5Yid5aeL5YyWXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgaW5pdGVkICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBfcGVyc2lzdFJvb3ROb2RlcyA9IHt9O1xyXG5cclxuICAgIC8vIHN0YXRlc1xyXG4gICAgcHVibGljIF9wYXVzZWQ6IGJvb2xlYW4gPSB0cnVlOyAvLyB3aGV0aGVyIHRoZSBnYW1lIGlzIHBhdXNlZFxyXG4gICAgcHVibGljIF9jb25maWdMb2FkZWQ6IGJvb2xlYW4gPSBmYWxzZTsgLy8gd2hldGhlciBjb25maWcgbG9hZGVkXHJcbiAgICBwdWJsaWMgX2lzQ2xvbmluZzogYm9vbGVhbiA9IGZhbHNlOyAgICAvLyBkZXNlcmlhbGl6aW5nIG9yIGluc3RhbnRpYXRpbmdcclxuICAgIHB1YmxpYyBfaW5pdGVkOiBib29sZWFuID0gZmFsc2U7IC8vIHdoZXRoZXIgdGhlIGVuZ2luZSBoYXMgaW5pdGVkXHJcbiAgICBwdWJsaWMgX3JlbmRlcmVySW5pdGlhbGl6ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICBwdWJsaWMgX2dmeERldmljZTogR0ZYRGV2aWNlIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHVibGljIF9pbnRlcnZhbElkOiBudW1iZXIgfCBudWxsID0gbnVsbDsgLy8gaW50ZXJ2YWwgdGFyZ2V0IG9mIG1haW5cclxuXHJcbiAgICBwdWJsaWMgX2xhc3RUaW1lOiBEYXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgX2ZyYW1lVGltZTogbnVtYmVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLy8gU2NlbmVzIGxpc3RcclxuICAgIHB1YmxpYyBfc2NlbmVJbmZvczogSVNjZW5lSW5mb1tdID0gW107XHJcbiAgICBwdWJsaWMgY29sbGlzaW9uTWF0cml4ID0gW107XHJcbiAgICBwdWJsaWMgZ3JvdXBMaXN0OiBhbnlbXSA9IFtdO1xyXG5cclxuICAgIC8vIEBNZXRob2RzXHJcblxyXG4gICAgLy8gIEBHYW1lIHBsYXkgY29udHJvbFxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gU2V0IGZyYW1lIHJhdGUgb2YgZ2FtZS5cclxuICAgICAqIEB6aCDorr7nva7muLjmiI/luKfnjofjgIJcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBmcmFtZVJhdGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldEZyYW1lUmF0ZSAoZnJhbWVSYXRlOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBpZiAodHlwZW9mIGZyYW1lUmF0ZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgZnJhbWVSYXRlID0gcGFyc2VJbnQoZnJhbWVSYXRlKTtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKGZyYW1lUmF0ZSkpIHtcclxuICAgICAgICAgICAgICAgIGZyYW1lUmF0ZSA9IDYwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmZpZy5mcmFtZVJhdGUgPSBmcmFtZVJhdGU7XHJcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLl9zZXRBbmltRnJhbWUoKTtcclxuICAgICAgICB0aGlzLl9ydW5NYWluTG9vcCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIEdldCBmcmFtZSByYXRlIHNldCBmb3IgdGhlIGdhbWUsIGl0IGRvZXNuJ3QgcmVwcmVzZW50IHRoZSByZWFsIGZyYW1lIHJhdGUuXHJcbiAgICAgKiBAemgg6I635Y+W6K6+572u55qE5ri45oiP5bin546H77yI5LiN562J5ZCM5LqO5a6e6ZmF5bin546H77yJ44CCXHJcbiAgICAgKiBAcmV0dXJuIHtOdW1iZXJ9IGZyYW1lIHJhdGVcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEZyYW1lUmF0ZSAoKTogbnVtYmVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb25maWcuZnJhbWVSYXRlIHx8IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUnVuIHRoZSBnYW1lIGZyYW1lIGJ5IGZyYW1lLlxyXG4gICAgICogQHpoIOaJp+ihjOS4gOW4p+a4uOaIj+W+queOr+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RlcCAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IubWFpbkxvb3AoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBQYXVzZSB0aGUgZ2FtZSBtYWluIGxvb3AuIFRoaXMgd2lsbCBwYXVzZTo8YnI+XHJcbiAgICAgKiBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiwgcmVuZGVyaW5nIHByb2Nlc3MsIGV2ZW50IG1hbmFnZXIsIGJhY2tncm91bmQgbXVzaWMgYW5kIGFsbCBhdWRpbyBlZmZlY3RzLjxicj5cclxuICAgICAqIFRoaXMgaXMgZGlmZmVyZW50IHdpdGggYGRpcmVjdG9yLnBhdXNlYCB3aGljaCBvbmx5IHBhdXNlIHRoZSBnYW1lIGxvZ2ljIGV4ZWN1dGlvbi48YnI+XHJcbiAgICAgKiBAemgg5pqC5YGc5ri45oiP5Li75b6q546v44CC5YyF5ZCr77ya5ri45oiP6YC76L6R77yM5riy5p+T77yM5LqL5Lu25aSE55CG77yM6IOM5pmv6Z+z5LmQ5ZKM5omA5pyJ6Z+z5pWI44CC6L+Z54K55ZKM5Y+q5pqC5YGc5ri45oiP6YC76L6R55qEIGBkaXJlY3Rvci5wYXVzZWAg5LiN5ZCM44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBwYXVzZSAoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX3BhdXNlZCkgeyByZXR1cm47IH1cclxuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xyXG4gICAgICAgIC8vIFBhdXNlIG1haW4gbG9vcFxyXG4gICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jQUYodGhpcy5faW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludGVydmFsSWQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBCZWNhdXNlIEpTQiBwbGF0Zm9ybXMgbmV2ZXIgYWN0dWFsbHkgc3RvcHMgdGhlIHN3YXAgY2hhaW4sXHJcbiAgICAgICAgLy8gd2UgZHJhdyBzb21lIG1vcmUgZnJhbWVzIGhlcmUgdG8gKHRyeSB0bykgbWFrZSBzdXJlIHN3YXAgY2hhaW4gY29uc2lzdGVuY3lcclxuICAgICAgICBpZiAoSlNCIHx8IFJVTlRJTUVfQkFTRUQgfHwgQUxJUEFZKSB7XHJcbiAgICAgICAgICAgIGxldCBzd2FwYnVmZmVycyA9IDM7XHJcbiAgICAgICAgICAgIGNvbnN0IGNiID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKC0tc3dhcGJ1ZmZlcnMgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnJBRihjYik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zdCByb290ID0gbGVnYWN5Q0MuZGlyZWN0b3Iucm9vdDtcclxuICAgICAgICAgICAgICAgIHJvb3QuZnJhbWVNb3ZlKDApOyByb290LmRldmljZS5wcmVzZW50KCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHdpbmRvdy5yQUYoY2IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBSZXN1bWUgdGhlIGdhbWUgZnJvbSBwYXVzZS4gVGhpcyB3aWxsIHJlc3VtZTo8YnI+XHJcbiAgICAgKiBnYW1lIGxvZ2ljIGV4ZWN1dGlvbiwgcmVuZGVyaW5nIHByb2Nlc3MsIGV2ZW50IG1hbmFnZXIsIGJhY2tncm91bmQgbXVzaWMgYW5kIGFsbCBhdWRpbyBlZmZlY3RzLjxicj5cclxuICAgICAqIEB6aCDmgaLlpI3muLjmiI/kuLvlvqrnjq/jgILljIXlkKvvvJrmuLjmiI/pgLvovpHvvIzmuLLmn5PvvIzkuovku7blpITnkIbvvIzog4zmma/pn7PkuZDlkozmiYDmnInpn7PmlYjjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc3VtZSAoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLl9wYXVzZWQpIHsgcmV0dXJuOyB9XHJcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgLy8gUmVzdW1lIG1haW4gbG9vcFxyXG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gQ2hlY2sgd2hldGhlciB0aGUgZ2FtZSBpcyBwYXVzZWQuXHJcbiAgICAgKiBAemgg5Yik5pat5ri45oiP5piv5ZCm5pqC5YGc44CCXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNQYXVzZWQgKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXVzZWQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUmVzdGFydCBnYW1lLlxyXG4gICAgICogQHpoIOmHjeaWsOW8gOWni+a4uOaIj1xyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzdGFydCAoKSB7XHJcbiAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3Iub25jZShsZWdhY3lDQy5EaXJlY3Rvci5FVkVOVF9BRlRFUl9EUkFXLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogZm9yaW5cclxuICAgICAgICAgICAgZm9yIChjb25zdCBpZCBpbiBsZWdhY3lDQy5nYW1lLl9wZXJzaXN0Um9vdE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBsZWdhY3lDQy5nYW1lLnJlbW92ZVBlcnNpc3RSb290Tm9kZShsZWdhY3lDQy5nYW1lLl9wZXJzaXN0Um9vdE5vZGVzW2lkXSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFyIHNjZW5lXHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmRpcmVjdG9yLmdldFNjZW5lKCkuZGVzdHJveSgpO1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5PYmplY3QuX2RlZmVycmVkRGVzdHJveSgpO1xyXG5cclxuICAgICAgICAgICAgbGVnYWN5Q0MuZGlyZWN0b3IucmVzZXQoKTtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5vblN0YXJ0KCk7XHJcbiAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuX3NhZmVFbWl0KGxlZ2FjeUNDLkdhbWUuRVZFTlRfUkVTVEFSVCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gRW5kIGdhbWUsIGl0IHdpbGwgY2xvc2UgdGhlIGdhbWUgd2luZG93XHJcbiAgICAgKiBAemgg6YCA5Ye65ri45oiPXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlbmQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9nZnhEZXZpY2UpIHtcclxuICAgICAgICAgICAgdGhpcy5fZ2Z4RGV2aWNlLmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgdGhpcy5fZ2Z4RGV2aWNlID0gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNsb3NlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFJlZ2lzdGVyIGFuIGNhbGxiYWNrIG9mIGEgc3BlY2lmaWMgZXZlbnQgdHlwZSBvbiB0aGUgZ2FtZSBvYmplY3QuPGJyPlxyXG4gICAgICogVGhpcyB0eXBlIG9mIGV2ZW50IHNob3VsZCBiZSB0cmlnZ2VyZWQgdmlhIGBlbWl0YC48YnI+XHJcbiAgICAgKiBAemhcclxuICAgICAqIOazqOWGjCBnYW1lIOeahOeJueWumuS6i+S7tuexu+Wei+Wbnuiwg+OAgui/meenjeexu+Wei+eahOS6i+S7tuW6lOivpeiiqyBgZW1pdGAg6Kem5Y+R44CCPGJyPlxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSB0eXBlIC0gQSBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0eXBlIHRvIGxpc3RlbiBmb3IuXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIFRoZSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyBkaXNwYXRjaGVkLjxicj5cclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgVGhlIGNhbGxiYWNrIGlzIGlnbm9yZWQgaWYgaXQgaXMgYSBkdXBsaWNhdGUgKHRoZSBjYWxsYmFja3MgYXJlIHVuaXF1ZSkuXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzFdIGFyZzFcclxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMl0gYXJnMlxyXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmczXSBhcmczXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzRdIGFyZzRcclxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNV0gYXJnNVxyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IFt0YXJnZXRdIC0gVGhlIHRhcmdldCAodGhpcyBvYmplY3QpIHRvIGludm9rZSB0aGUgY2FsbGJhY2ssIGNhbiBiZSBudWxsXHJcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gLSBKdXN0IHJldHVybnMgdGhlIGluY29taW5nIGNhbGxiYWNrIHNvIHlvdSBjYW4gc2F2ZSB0aGUgYW5vbnltb3VzIGZ1bmN0aW9uIGVhc2llci5cclxuICAgICAqL1xyXG4gICAgcHVibGljIG9uICh0eXBlOiBzdHJpbmcsIGNhbGxiYWNrOiBGdW5jdGlvbiwgdGFyZ2V0Pzogb2JqZWN0LCBvbmNlPzogYm9vbGVhbik6IGFueSB7XHJcbiAgICAgICAgLy8gTWFrZSBzdXJlIEVWRU5UX0VOR0lORV9JTklURUQgY2FsbGJhY2tzIHRvIGJlIGludm9rZWRcclxuICAgICAgICBpZiAodGhpcy5faW5pdGVkICYmIHR5cGUgPT09IEdhbWUuRVZFTlRfRU5HSU5FX0lOSVRFRCkge1xyXG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRhcmdldCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmV2ZW50VGFyZ2V0T24odHlwZSwgY2FsbGJhY2ssIHRhcmdldCwgb25jZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBSZWdpc3RlciBhbiBjYWxsYmFjayBvZiBhIHNwZWNpZmljIGV2ZW50IHR5cGUgb24gdGhlIGdhbWUgb2JqZWN0LDxicj5cclxuICAgICAqIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgdGhlIGZpcnN0IHRpbWUgaXQgaXMgdHJpZ2dlcmVkLjxicj5cclxuICAgICAqIEB6aFxyXG4gICAgICog5rOo5YaMIGdhbWUg55qE54m55a6a5LqL5Lu257G75Z6L5Zue6LCD77yM5Zue6LCD5Lya5Zyo56ys5LiA5pe26Ze06KKr6Kem5Y+R5ZCO5Yig6Zmk6Ieq6Lqr44CCXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBBIHN0cmluZyByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHR5cGUgdG8gbGlzdGVuIGZvci5cclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIHRoYXQgd2lsbCBiZSBpbnZva2VkIHdoZW4gdGhlIGV2ZW50IGlzIGRpc3BhdGNoZWQuPGJyPlxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGUgY2FsbGJhY2sgaXMgaWdub3JlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZSAodGhlIGNhbGxiYWNrcyBhcmUgdW5pcXVlKS5cclxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnMV0gYXJnMVxyXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmcyXSBhcmcyXHJcbiAgICAgKiBAcGFyYW0ge2FueX0gW2NhbGxiYWNrLmFyZzNdIGFyZzNcclxuICAgICAqIEBwYXJhbSB7YW55fSBbY2FsbGJhY2suYXJnNF0gYXJnNFxyXG4gICAgICogQHBhcmFtIHthbnl9IFtjYWxsYmFjay5hcmc1XSBhcmc1XHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gW3RhcmdldF0gLSBUaGUgdGFyZ2V0ICh0aGlzIG9iamVjdCkgdG8gaW52b2tlIHRoZSBjYWxsYmFjaywgY2FuIGJlIG51bGxcclxuICAgICAqL1xyXG4gICAgLy8gQHRzLWlnbm9yZVxyXG4gICAgcHVibGljIG9uY2UgKHR5cGU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCB0YXJnZXQ/OiBvYmplY3QpIHtcclxuICAgICAgICAvLyBNYWtlIHN1cmUgRVZFTlRfRU5HSU5FX0lOSVRFRCBjYWxsYmFja3MgdG8gYmUgaW52b2tlZFxyXG4gICAgICAgIGlmICh0aGlzLl9pbml0ZWQgJiYgdHlwZSA9PT0gR2FtZS5FVkVOVF9FTkdJTkVfSU5JVEVEKSB7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrLmNhbGwodGFyZ2V0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnRUYXJnZXRPbmNlKHR5cGUsIGNhbGxiYWNrLCB0YXJnZXQpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBJbml0IGdhbWUgd2l0aCBjb25maWd1cmF0aW9uIG9iamVjdC5cclxuICAgICAqIEB6aCDkvb/nlKjmjIflrprnmoTphY3nva7liJ3lp4vljJblvJXmk47jgIJcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgLSBQYXNzIGNvbmZpZ3VyYXRpb24gb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbml0IChjb25maWc6IElHYW1lQ29uZmlnKSB7XHJcbiAgICAgICAgdGhpcy5faW5pdENvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIC8vIEluaXQgQXNzZXRMaWJyYXJ5XHJcbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmFzc2V0T3B0aW9ucykge1xyXG4gICAgICAgICAgICBBc3NldExpYnJhcnkuaW5pdCh0aGlzLmNvbmZpZy5hc3NldE9wdGlvbnMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW5pdEVuZ2luZSgpO1xyXG5cclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5yb290LmRhdGFQb29sTWFuYWdlci5qb2ludFRleHR1cmVQb29sLnJlZ2lzdGVyQ3VzdG9tVGV4dHVyZUxheW91dHMoY29uZmlnLmN1c3RvbUpvaW50VGV4dHVyZUxheW91dHMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5faW5pdGVkO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJ1biBnYW1lIHdpdGggY29uZmlndXJhdGlvbiBvYmplY3QgYW5kIG9uU3RhcnQgZnVuY3Rpb24uXHJcbiAgICAgKiBAemgg6L+Q6KGM5ri45oiP77yM5bm25LiU5oyH5a6a5byV5pOO6YWN572u5ZKMIG9uU3RhcnQg55qE5Zue6LCD44CCXHJcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBvblN0YXJ0IC0gZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgYWZ0ZXIgZ2FtZSBpbml0aWFsaXplZFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcnVuIChvblN0YXJ0OiBGdW5jdGlvbiB8IG51bGwsIGxlZ2FjeU9uU3RhcnQ/OiBGdW5jdGlvbiB8IG51bGwpIHtcclxuICAgICAgICBpZiAoIUVESVRPUikge1xyXG4gICAgICAgICAgICB0aGlzLl9pbml0RXZlbnRzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0eXBlb2Ygb25TdGFydCAhPT0gJ2Z1bmN0aW9uJyAmJiBsZWdhY3lPblN0YXJ0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbmZpZzogSUdhbWVDb25maWcgPSB0aGlzLm9uU3RhcnQgYXMgSUdhbWVDb25maWc7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdChjb25maWcpO1xyXG4gICAgICAgICAgICB0aGlzLm9uU3RhcnQgPSBsZWdhY3lPblN0YXJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vblN0YXJ0ID0gb25TdGFydDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3NldEFuaW1GcmFtZSgpO1xyXG4gICAgICAgIHRoaXMuX3J1bk1haW5Mb29wKCk7XHJcblxyXG4gICAgICAgIC8vIHJlZ2lzdGVyIHN5c3RlbSBldmVudHNcclxuICAgICAgICBpZiAoIUVESVRPUiAmJiBnYW1lLmNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50KSB7XHJcbiAgICAgICAgICAgIGlucHV0TWFuYWdlci5yZWdpc3RlclN5c3RlbUV2ZW50KGdhbWUuY2FudmFzKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHVzZVNwbGFzaCA9ICghRURJVE9SICYmICFQUkVWSUVXICYmIGxlZ2FjeUNDLmludGVybmFsLlNwbGFzaFNjcmVlbik7XHJcblxyXG4gICAgICAgIC8vIExvYWQgcmVuZGVyIHBpcGVsaW5lIGlmIG5lZWRlZFxyXG4gICAgICAgIC8vIGNvbnN0IHJlbmRlclBpcGVsaW5lID0gdGhpcy5jb25maWcucmVuZGVyUGlwZWxpbmU7XHJcbiAgICAgICAgY29uc3QgcmVuZGVyUGlwZWxpbmUgPSBcIjVkNDViYTY2LTgyOWEtNDZkMy05NDhlLTJlZDNmYTdlZTQyMVwiO1xyXG4gICAgICAgIGlmIChyZW5kZXJQaXBlbGluZSkge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5sb2FkZXIubG9hZCh7IHV1aWQ6IHJlbmRlclBpcGVsaW5lIH0sIChlcnIsIGFzc2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyBmYWlsZWQgbG9hZCByZW5kZXJQaXBlbGluZVxyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihgRmFpbGVkIGxvYWQgcmVuZGVycGlwZWxpbmU6ICR7cmVuZGVyUGlwZWxpbmV9LCBlbmdpbmUgZmFpbGVkIHRvIGluaXRpYWxpemUsIHdpbGwgZmFsbGJhY2sgdG8gZGVmYXVsdCBwaXBlbGluZWApO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVuZGVyUGlwZWxpbmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0UmVuZGVyUGlwZWxpbmUoYXNzZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS53YXJuKGUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oYEZhaWxlZCBsb2FkIHJlbmRlcnBpcGVsaW5lOiAke3JlbmRlclBpcGVsaW5lfSwgZW5naW5lIGZhaWxlZCB0byBpbml0aWFsaXplLCB3aWxsIGZhbGxiYWNrIHRvIGRlZmF1bHQgcGlwZWxpbmVgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRSZW5kZXJQaXBlbGluZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuX3NhZmVFbWl0KEdhbWUuRVZFTlRfR0FNRV9JTklURUQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzZVNwbGFzaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNwbGFzaFNjcmVlbiA9IGxlZ2FjeUNDLmludGVybmFsLlNwbGFzaFNjcmVlbi5pbnN0YW5jZSBhcyBTcGxhc2hTY3JlZW47XHJcbiAgICAgICAgICAgICAgICAgICAgc3BsYXNoU2NyZWVuLm1haW4obGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc3BsYXNoU2NyZWVuLnNldE9uRmluaXNoKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMub25TdGFydCkgeyB0aGlzLm9uU3RhcnQoKTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHNwbGFzaFNjcmVlbi5sb2FkRmluaXNoID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uU3RhcnQpIHsgdGhpcy5vblN0YXJ0KCk7IH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNldFJlbmRlclBpcGVsaW5lKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX3NhZmVFbWl0KEdhbWUuRVZFTlRfR0FNRV9JTklURUQpO1xyXG4gICAgICAgICAgICBpZiAodXNlU3BsYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBzcGxhc2hTY3JlZW4gPSBsZWdhY3lDQy5pbnRlcm5hbC5TcGxhc2hTY3JlZW4uaW5zdGFuY2UgYXMgU3BsYXNoU2NyZWVuO1xyXG4gICAgICAgICAgICAgICAgc3BsYXNoU2NyZWVuLm1haW4obGVnYWN5Q0MuZGlyZWN0b3Iucm9vdCk7XHJcbiAgICAgICAgICAgICAgICBzcGxhc2hTY3JlZW4uc2V0T25GaW5pc2goKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm9uU3RhcnQpIHsgdGhpcy5vblN0YXJ0KCk7IH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc3BsYXNoU2NyZWVuLmxvYWRGaW5pc2ggPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub25TdGFydCkgeyB0aGlzLm9uU3RhcnQoKTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vICBAIFBlcnNpc3Qgcm9vdCBub2RlIHNlY3Rpb25cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBBZGQgYSBwZXJzaXN0ZW50IHJvb3Qgbm9kZSB0byB0aGUgZ2FtZSwgdGhlIHBlcnNpc3RlbnQgbm9kZSB3b24ndCBiZSBkZXN0cm95ZWQgZHVyaW5nIHNjZW5lIHRyYW5zaXRpb24uPGJyPlxyXG4gICAgICogVGhlIHRhcmdldCBub2RlIG11c3QgYmUgcGxhY2VkIGluIHRoZSByb290IGxldmVsIG9mIGhpZXJhcmNoeSwgb3RoZXJ3aXNlIHRoaXMgQVBJIHdvbid0IGhhdmUgYW55IGVmZmVjdC5cclxuICAgICAqIEB6aFxyXG4gICAgICog5aOw5piO5bi46am75qC56IqC54K577yM6K+l6IqC54K55LiN5Lya6KKr5Zyo5Zy65pmv5YiH5o2i5Lit6KKr6ZSA5q+B44CCPGJyPlxyXG4gICAgICog55uu5qCH6IqC54K55b+F6aG75L2N5LqO5Li65bGC57qn55qE5qC56IqC54K577yM5ZCm5YiZ5peg5pWI44CCXHJcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSBtYWRlIHBlcnNpc3RlbnRcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFkZFBlcnNpc3RSb290Tm9kZSAobm9kZTogeyB1dWlkOiBhbnk7IHBhcmVudDogYW55OyBfcGVyc2lzdE5vZGU6IGJvb2xlYW47IH0pIHtcclxuICAgICAgICBpZiAoIWxlZ2FjeUNDLk5vZGUuaXNOb2RlKG5vZGUpIHx8ICFub2RlLnV1aWQpIHtcclxuICAgICAgICAgICAgZGVidWcud2FybklEKDM4MDApO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGlkID0gbm9kZS51dWlkO1xyXG4gICAgICAgIGlmICghdGhpcy5fcGVyc2lzdFJvb3ROb2Rlc1tpZF0pIHtcclxuICAgICAgICAgICAgY29uc3Qgc2NlbmUgPSBsZWdhY3lDQy5kaXJlY3Rvci5fc2NlbmU7XHJcbiAgICAgICAgICAgIGlmIChsZWdhY3lDQy5pc1ZhbGlkKHNjZW5lKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFub2RlLnBhcmVudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGUucGFyZW50ID0gc2NlbmU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghKG5vZGUucGFyZW50IGluc3RhbmNlb2YgbGVnYWN5Q0MuU2NlbmUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVidWcud2FybklEKDM4MDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKG5vZGUucGFyZW50ICE9PSBzY2VuZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlYnVnLndhcm5JRCgzODAyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fcGVyc2lzdFJvb3ROb2Rlc1tpZF0gPSBub2RlO1xyXG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlbW92ZSBhIHBlcnNpc3RlbnQgcm9vdCBub2RlLlxyXG4gICAgICogQHpoIOWPlua2iOW4uOmpu+agueiKgueCueOAglxyXG4gICAgICogQHBhcmFtIHtOb2RlfSBub2RlIC0gVGhlIG5vZGUgdG8gYmUgcmVtb3ZlZCBmcm9tIHBlcnNpc3RlbnQgbm9kZSBsaXN0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyByZW1vdmVQZXJzaXN0Um9vdE5vZGUgKG5vZGU6IHsgdXVpZDogc3RyaW5nOyBfcGVyc2lzdE5vZGU6IGJvb2xlYW47IH0pIHtcclxuICAgICAgICBjb25zdCBpZCA9IG5vZGUudXVpZCB8fCAnJztcclxuICAgICAgICBpZiAobm9kZSA9PT0gdGhpcy5fcGVyc2lzdFJvb3ROb2Rlc1tpZF0pIHtcclxuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3BlcnNpc3RSb290Tm9kZXNbaWRdO1xyXG4gICAgICAgICAgICBub2RlLl9wZXJzaXN0Tm9kZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlbiBDaGVjayB3aGV0aGVyIHRoZSBub2RlIGlzIGEgcGVyc2lzdGVudCByb290IG5vZGUuXHJcbiAgICAgKiBAemgg5qOA5p+l6IqC54K55piv5ZCm5piv5bi46am75qC56IqC54K544CCXHJcbiAgICAgKiBAcGFyYW0ge05vZGV9IG5vZGUgLSBUaGUgbm9kZSB0byBiZSBjaGVja2VkXHJcbiAgICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgaXNQZXJzaXN0Um9vdE5vZGUgKG5vZGU6IHsgX3BlcnNpc3ROb2RlOiBhbnk7IH0pIHtcclxuICAgICAgICByZXR1cm4gbm9kZS5fcGVyc2lzdE5vZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gIEBFbmdpbmUgbG9hZGluZ1xyXG5cclxuICAgIHByaXZhdGUgX2luaXRFbmdpbmUgKCkge1xyXG4gICAgICAgIHRoaXMuX2luaXREZXZpY2UoKTtcclxuICAgICAgICBsZWdhY3lDQy5kaXJlY3Rvci5faW5pdCgpO1xyXG5cclxuICAgICAgICAvLyBMb2cgZW5naW5lIHZlcnNpb25cclxuICAgICAgICBjb25zb2xlLmxvZygnQ29jb3MgQ3JlYXRvciAzRCB2JyArIGxlZ2FjeUNDLkVOR0lORV9WRVJTSU9OKTtcclxuICAgICAgICB0aGlzLmVtaXQoR2FtZS5FVkVOVF9FTkdJTkVfSU5JVEVEKTtcclxuICAgICAgICB0aGlzLl9pbml0ZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEBNZXRob2RzXHJcblxyXG4gICAgLy8gIEBUaW1lIHRpY2tlciBzZWN0aW9uXHJcbiAgICBwcml2YXRlIF9zZXRBbmltRnJhbWUgKCkge1xyXG4gICAgICAgIHRoaXMuX2xhc3RUaW1lID0gbmV3IERhdGUoKTtcclxuICAgICAgICBjb25zdCBmcmFtZVJhdGUgPSBsZWdhY3lDQy5nYW1lLmNvbmZpZy5mcmFtZVJhdGU7XHJcbiAgICAgICAgdGhpcy5fZnJhbWVUaW1lID0gMTAwMCAvIGZyYW1lUmF0ZTtcclxuXHJcbiAgICAgICAgaWYgKEpTQiB8fCBSVU5USU1FX0JBU0VEKSB7XHJcbiAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAganNiLnNldFByZWZlcnJlZEZyYW1lc1BlclNlY29uZChmcmFtZVJhdGUpO1xyXG4gICAgICAgICAgICB3aW5kb3cuckFGID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTtcclxuICAgICAgICAgICAgd2luZG93LmNBRiA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY0FGKHRoaXMuX2ludGVydmFsSWQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5faW50ZXJ2YWxJZCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChmcmFtZVJhdGUgIT09IDYwICYmIGZyYW1lUmF0ZSAhPT0gMzApIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5yQUYgPSB0aGlzLl9zdFRpbWU7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuY0FGID0gdGhpcy5fY3RUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgd2luZG93LnJBRiA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RUaW1lO1xyXG4gICAgICAgICAgICAgICAgd2luZG93LmNBRiA9IHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubXNDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm9DYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93Lm1zQ2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cub2NhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3RUaW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfc3RUaW1lIChjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGN1cnJUaW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgY29uc3QgZWxhcHNlVGltZSA9IE1hdGgubWF4KDAsIChjdXJyVGltZSAtIGxlZ2FjeUNDLmdhbWUuX2xhc3RUaW1lKSk7XHJcbiAgICAgICAgY29uc3QgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIGxlZ2FjeUNDLmdhbWUuX2ZyYW1lVGltZSAtIGVsYXBzZVRpbWUpO1xyXG4gICAgICAgIGNvbnN0IGlkID0gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVUb0NhbGwpO1xyXG4gICAgICAgIGxlZ2FjeUNDLmdhbWUuX2xhc3RUaW1lID0gY3VyclRpbWUgKyB0aW1lVG9DYWxsO1xyXG4gICAgICAgIHJldHVybiBpZDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX2N0VGltZSAoaWQ6IG51bWJlciB8IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHdpbmRvdy5jbGVhclRpbWVvdXQoaWQpO1xyXG4gICAgfVxyXG4gICAgLy8gUnVuIGdhbWUuXHJcbiAgICBwcml2YXRlIF9ydW5NYWluTG9vcCAoKSB7XHJcbiAgICAgICAgaWYgKEVESVRPUiAmJiAhbGVnYWN5Q0MuR0FNRV9WSUVXKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IGNhbGxiYWNrOiBGcmFtZVJlcXVlc3RDYWxsYmFjaztcclxuICAgICAgICBjb25zdCBjb25maWcgPSB0aGlzLmNvbmZpZztcclxuICAgICAgICBjb25zdCBkaXJlY3RvciA9IGxlZ2FjeUNDLmRpcmVjdG9yO1xyXG4gICAgICAgIGxldCBza2lwOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBjb25zdCBmcmFtZVJhdGUgPSBjb25maWcuZnJhbWVSYXRlO1xyXG5cclxuICAgICAgICBkZWJ1Zy5zZXREaXNwbGF5U3RhdHMoISFjb25maWcuc2hvd0ZQUyk7XHJcblxyXG4gICAgICAgIGRpcmVjdG9yLnN0YXJ0QW5pbWF0aW9uKCk7XHJcblxyXG4gICAgICAgIGNhbGxiYWNrID0gKHRpbWU6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fcGF1c2VkKSB7IHJldHVybjsgfVxyXG4gICAgICAgICAgICB0aGlzLl9pbnRlcnZhbElkID0gd2luZG93LnJBRihjYWxsYmFjayk7XHJcbiAgICAgICAgICAgIGlmICghSlNCICYmICFSVU5USU1FX0JBU0VEICYmIGZyYW1lUmF0ZSA9PT0gMzApIHtcclxuICAgICAgICAgICAgICAgIHNraXAgPSAhc2tpcDtcclxuICAgICAgICAgICAgICAgIGlmIChza2lwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGRpcmVjdG9yLm1haW5Mb29wKHRpbWUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9pbnRlcnZhbElkKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5jQUYodGhpcy5faW50ZXJ2YWxJZCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2ludGVydmFsSWQgPSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5faW50ZXJ2YWxJZCA9IHdpbmRvdy5yQUYoY2FsbGJhY2spO1xyXG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEBHYW1lIGxvYWRpbmcgc2VjdGlvblxyXG4gICAgcHJpdmF0ZSBfaW5pdENvbmZpZyAoY29uZmlnOiBJR2FtZUNvbmZpZykge1xyXG4gICAgICAgIC8vIENvbmZpZ3MgYWRqdXN0bWVudFxyXG4gICAgICAgIGlmICh0eXBlb2YgY29uZmlnLmRlYnVnTW9kZSAhPT0gJ251bWJlcicpIHtcclxuICAgICAgICAgICAgY29uZmlnLmRlYnVnTW9kZSA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbmZpZy5leHBvc2VDbGFzc05hbWUgPSAhIWNvbmZpZy5leHBvc2VDbGFzc05hbWU7XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcuZnJhbWVSYXRlICE9PSAnbnVtYmVyJykge1xyXG4gICAgICAgICAgICBjb25maWcuZnJhbWVSYXRlID0gNjA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHJlbmRlck1vZGUgPSBjb25maWcucmVuZGVyTW9kZTtcclxuICAgICAgICBpZiAodHlwZW9mIHJlbmRlck1vZGUgIT09ICdudW1iZXInIHx8IHJlbmRlck1vZGUgPiAyIHx8IHJlbmRlck1vZGUgPCAwKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5yZW5kZXJNb2RlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiBjb25maWcucmVnaXN0ZXJTeXN0ZW1FdmVudCAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgICAgICAgIGNvbmZpZy5yZWdpc3RlclN5c3RlbUV2ZW50ID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uZmlnLnNob3dGUFMgPSAhIWNvbmZpZy5zaG93RlBTO1xyXG5cclxuICAgICAgICAvLyBTY2VuZSBwYXJzZXJcclxuICAgICAgICB0aGlzLl9zY2VuZUluZm9zID0gY29uZmlnLnNjZW5lcyB8fCBbXTtcclxuXHJcbiAgICAgICAgLy8gQ29sbGlkZSBNYXAgYW5kIEdyb3VwIExpc3RcclxuICAgICAgICB0aGlzLmNvbGxpc2lvbk1hdHJpeCA9IGNvbmZpZy5jb2xsaXNpb25NYXRyaXggfHwgW107XHJcbiAgICAgICAgdGhpcy5ncm91cExpc3QgPSBjb25maWcuZ3JvdXBMaXN0IHx8IFtdO1xyXG5cclxuICAgICAgICBkZWJ1Zy5fcmVzZXREZWJ1Z1NldHRpbmcoY29uZmlnLmRlYnVnTW9kZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY29uZmlnID0gY29uZmlnO1xyXG4gICAgICAgIHRoaXMuX2NvbmZpZ0xvYWRlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZGV0ZXJtaW5lUmVuZGVyVHlwZSAoKSB7XHJcbiAgICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5jb25maWc7XHJcbiAgICAgICAgY29uc3QgdXNlclJlbmRlck1vZGUgPSBwYXJzZUludChjb25maWcucmVuZGVyTW9kZSBhcyBhbnkpO1xyXG5cclxuICAgICAgICAvLyBEZXRlcm1pbmUgUmVuZGVyVHlwZVxyXG4gICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IEdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTO1xyXG4gICAgICAgIGxldCBzdXBwb3J0UmVuZGVyID0gZmFsc2U7XHJcblxyXG4gICAgICAgIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBpZiAobGVnYWN5Q0Muc3lzLmNhcGFiaWxpdGllcy5vcGVuZ2wpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IEdhbWUuUkVOREVSX1RZUEVfV0VCR0w7XHJcbiAgICAgICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChsZWdhY3lDQy5zeXMuY2FwYWJpbGl0aWVzLmNhbnZhcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJUeXBlID0gR2FtZS5SRU5ERVJfVFlQRV9DQU5WQVM7XHJcbiAgICAgICAgICAgICAgICBzdXBwb3J0UmVuZGVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh1c2VyUmVuZGVyTW9kZSA9PT0gMSAmJiBsZWdhY3lDQy5zeXMuY2FwYWJpbGl0aWVzLmNhbnZhcykge1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlclR5cGUgPSBHYW1lLlJFTkRFUl9UWVBFX0NBTlZBUztcclxuICAgICAgICAgICAgc3VwcG9ydFJlbmRlciA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKHVzZXJSZW5kZXJNb2RlID09PSAyICYmIGxlZ2FjeUNDLnN5cy5jYXBhYmlsaXRpZXMub3BlbmdsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IEdhbWUuUkVOREVSX1RZUEVfV0VCR0w7XHJcbiAgICAgICAgICAgIHN1cHBvcnRSZW5kZXIgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCFzdXBwb3J0UmVuZGVyKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihkZWJ1Zy5nZXRFcnJvcigzODIwLCB1c2VyUmVuZGVyTW9kZSkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0RGV2aWNlICgpIHtcclxuICAgICAgICAvLyBBdm9pZCBzZXR1cCB0byBiZSBjYWxsZWQgdHdpY2UuXHJcbiAgICAgICAgaWYgKHRoaXMuX3JlbmRlcmVySW5pdGlhbGl6ZWQpIHsgcmV0dXJuOyB9XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzID0gKHRoaXMuY29uZmlnIGFzIGFueSkuYWRhcHRlci5jYW52YXM7XHJcbiAgICAgICAgdGhpcy5mcmFtZSA9ICh0aGlzLmNvbmZpZyBhcyBhbnkpLmFkYXB0ZXIuZnJhbWU7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIgPSAodGhpcy5jb25maWcgYXMgYW55KS5hZGFwdGVyLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgdGhpcy5fZGV0ZXJtaW5lUmVuZGVyVHlwZSgpO1xyXG5cclxuICAgICAgICAvLyBXZWJHTCBjb250ZXh0IGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5XHJcbiAgICAgICAgaWYgKHRoaXMucmVuZGVyVHlwZSA9PT0gR2FtZS5SRU5ERVJfVFlQRV9XRUJHTCkge1xyXG4gICAgICAgICAgICBjb25zdCBjdG9yczogQ29uc3RydWN0b3I8R0ZYRGV2aWNlPltdID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAoSlNCICYmIHdpbmRvdy5nZngpIHtcclxuICAgICAgICAgICAgICAgIGlmIChnZnguQ0NWS0RldmljZSkgeyBjdG9ycy5wdXNoKGdmeC5DQ1ZLRGV2aWNlKTsgfVxyXG4gICAgICAgICAgICAgICAgaWYgKGdmeC5DQ01UTERldmljZSkgeyBjdG9ycy5wdXNoKGdmeC5DQ01UTERldmljZSk7IH1cclxuICAgICAgICAgICAgICAgIGlmIChnZnguR0xFUzNEZXZpY2UpIHsgY3RvcnMucHVzaChnZnguR0xFUzNEZXZpY2UpOyB9XHJcbiAgICAgICAgICAgICAgICBpZiAoZ2Z4LkdMRVMyRGV2aWNlKSB7IGN0b3JzLnB1c2goZ2Z4LkdMRVMyRGV2aWNlKTsgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGV0IHVzZVdlYkdMMiA9ICghIXdpbmRvdy5XZWJHTDJSZW5kZXJpbmdDb250ZXh0KTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJBZ2VudCA9IHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50LnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodXNlckFnZW50LmluZGV4T2YoJ3NhZmFyaScpICE9PSAtMSAmJiB1c2VyQWdlbnQuaW5kZXhPZignY2hyb21lJykgPT09IC0xXHJcbiAgICAgICAgICAgICAgICAgICAgfHwgc3lzLmJyb3dzZXJUeXBlID09PSBzeXMuQlJPV1NFUl9UWVBFX1VDIC8vIFVDIGJyb3dzZXIgaW1wbGVtZW50YXRpb24gZG9lc24ndCBub3QgY29uZm9ybSB0byBXZWJHTDIgc3RhbmRhcmRcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHVzZVdlYkdMMiA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHVzZVdlYkdMMiAmJiBsZWdhY3lDQy5XZWJHTDJEZXZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdG9ycy5wdXNoKGxlZ2FjeUNDLldlYkdMMkRldmljZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAobGVnYWN5Q0MuV2ViR0xEZXZpY2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdG9ycy5wdXNoKGxlZ2FjeUNDLldlYkdMRGV2aWNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3B0cyA9IG5ldyBHRlhEZXZpY2VJbmZvKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQsXHJcbiAgICAgICAgICAgICAgICBFRElUT1IgfHwgbWFjcm8uRU5BQkxFX1dFQkdMX0FOVElBTElBUyxcclxuICAgICAgICAgICAgICAgIGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgd2luZG93LmRldmljZVBpeGVsUmF0aW8sXHJcbiAgICAgICAgICAgICAgICBNYXRoLmZsb29yKHNjcmVlbi53aWR0aCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSxcclxuICAgICAgICAgICAgICAgIE1hdGguZmxvb3Ioc2NyZWVuLmhlaWdodCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKSxcclxuICAgICAgICAgICAgICAgIGJpbmRpbmdNYXBwaW5nSW5mbyxcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZ2Z4RGV2aWNlID0gbmV3IGN0b3JzW2ldKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ2Z4RGV2aWNlIS5pbml0aWFsaXplKG9wdHMpKSB7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5fZ2Z4RGV2aWNlKSB7XHJcbiAgICAgICAgICAgIC8vIHRvZG8gZml4IGhlcmUgZm9yIHdlY2hhdCBnYW1lXHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ2NhbiBub3Qgc3VwcG9ydCBjYW52YXMgcmVuZGVyaW5nIGluIDNEJyk7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVHlwZSA9IEdhbWUuUkVOREVSX1RZUEVfQ0FOVkFTO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmNhbnZhcyEub25jb250ZXh0bWVudSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFsZWdhY3lDQy5faXNDb250ZXh0TWVudUVuYWJsZSkgeyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXRFdmVudHMgKCkge1xyXG4gICAgICAgIGNvbnN0IHdpbiA9IHdpbmRvdztcclxuICAgICAgICBsZXQgaGlkZGVuUHJvcE5hbWU6IHN0cmluZztcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkb2N1bWVudC5oaWRkZW4gIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGhpZGRlblByb3BOYW1lID0gJ2hpZGRlbic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQubW96SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9ICdtb3pIaWRkZW4nO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50Lm1zSGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9ICdtc0hpZGRlbic7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQud2Via2l0SGlkZGVuICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBoaWRkZW5Qcm9wTmFtZSA9ICd3ZWJraXRIaWRkZW4nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGhpZGRlbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBvbkhpZGRlbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICghaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5lbWl0KEdhbWUuRVZFTlRfSElERSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gSW4gb3JkZXIgdG8gYWRhcHQgdGhlIG1vc3Qgb2YgcGxhdGZvcm1zIHRoZSBvbnNob3cgQVBJLlxyXG4gICAgICAgIGZ1bmN0aW9uIG9uU2hvd24gKGFyZzA/LCBhcmcxPywgYXJnMj8sIGFyZzM/LCBhcmc0Pykge1xyXG4gICAgICAgICAgICBpZiAoaGlkZGVuKSB7XHJcbiAgICAgICAgICAgICAgICBoaWRkZW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGxlZ2FjeUNDLmdhbWUuZW1pdChHYW1lLkVWRU5UX1NIT1csIGFyZzAsIGFyZzEsIGFyZzIsIGFyZzMsIGFyZzQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaGlkZGVuUHJvcE5hbWUhKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYW5nZUxpc3QgPSBbXHJcbiAgICAgICAgICAgICAgICAndmlzaWJpbGl0eWNoYW5nZScsXHJcbiAgICAgICAgICAgICAgICAnbW96dmlzaWJpbGl0eWNoYW5nZScsXHJcbiAgICAgICAgICAgICAgICAnbXN2aXNpYmlsaXR5Y2hhbmdlJyxcclxuICAgICAgICAgICAgICAgICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJyxcclxuICAgICAgICAgICAgICAgICdxYnJvd3NlclZpc2liaWxpdHlDaGFuZ2UnLFxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IHByZWZlci1mb3Itb2ZcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGNoYW5nZUxpc3RbaV0sIChldmVudCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB2aXNpYmxlID0gZG9jdW1lbnRbaGlkZGVuUHJvcE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIFFRIEFwcFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEB0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2aXNpYmxlID0gdmlzaWJsZSB8fCBldmVudC5oaWRkZW47XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb25IaWRkZW4oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uU2hvd24oKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgb25IaWRkZW4pO1xyXG4gICAgICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcignZm9jdXMnLCBvblNob3duKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdNaWNyb01lc3NlbmdlcicpID4gLTEpIHtcclxuICAgICAgICAgICAgd2luLm9uZm9jdXMgPSBvblNob3duO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKCdvbnBhZ2VzaG93JyBpbiB3aW5kb3cgJiYgJ29ucGFnZWhpZGUnIGluIHdpbmRvdykge1xyXG4gICAgICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBvbkhpZGRlbik7XHJcbiAgICAgICAgICAgIHdpbi5hZGRFdmVudExpc3RlbmVyKCdwYWdlc2hvdycsIG9uU2hvd24pO1xyXG4gICAgICAgICAgICAvLyBUYW9iYW8gVUlXZWJLaXRcclxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBvbkhpZGRlbik7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VzaG93Jywgb25TaG93bik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm9uKEdhbWUuRVZFTlRfSElERSwgKCkgPT4ge1xyXG4gICAgICAgICAgICBsZWdhY3lDQy5nYW1lLnBhdXNlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5vbihHYW1lLkVWRU5UX1NIT1csICgpID0+IHtcclxuICAgICAgICAgICAgbGVnYWN5Q0MuZ2FtZS5yZXN1bWUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldFJlbmRlclBpcGVsaW5lIChycHBsPzogYW55KSB7XHJcbiAgICAgICAgaWYgKCFsZWdhY3lDQy5kaXJlY3Rvci5yb290LnNldFJlbmRlclBpcGVsaW5lKHJwcGwpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0UmVuZGVyUGlwZWxpbmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3JlbmRlcmVySW5pdGlhbGl6ZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuX3NhZmVFbWl0KEdhbWUuRVZFTlRfUkVOREVSRVJfSU5JVEVEKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9zYWZlRW1pdCAoZXZlbnQpIHtcclxuICAgICAgICBpZiAoRURJVE9SKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVtaXQoZXZlbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZW1pdChldmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5sZWdhY3lDQy5HYW1lID0gR2FtZTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogVGhpcyBpcyBhIEdhbWUgaW5zdGFuY2UuXHJcbiAqIEB6aFxyXG4gKiDov5nmmK/kuIDkuKogR2FtZSDnsbvnmoTlrp7kvovvvIzljIXlkKvmuLjmiI/kuLvkvZPkv6Hmga/lubbotJ/otKPpqbHliqjmuLjmiI/nmoTmuLjmiI/lr7nosaHjgIJcclxuICovXHJcbmV4cG9ydCBjb25zdCBnYW1lID0gbGVnYWN5Q0MuZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiJdfQ==