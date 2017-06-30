/****************************************************************************
 Copyright (c) 2013-2017 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EventTarget = require('./event/event-target');
var View;
if (!(CC_EDITOR && Editor.isMainProcess)) {
    View = require('./platform/CCView');
}

require('../audio/CCAudioEngine');

/**
 * !#en An object to boot the game.
 * !#zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class Game
 * @extends EventTarget
 */
var game = {

    /**
     * Event triggered when game hide to background.
     * Please note that this event is not 100% guaranteed to be fired.
     * @property EVENT_HIDE
     * @type {String}
     * @example
     * cc.game.on(cc.game.EVENT_HIDE, function () {
     *     cc.audioEngine.pauseMusic();
     *     cc.audioEngine.pauseAllEffects();
     * });
     */
    EVENT_HIDE: "game_on_hide",

    /**
     * Event triggered when game back to foreground
     * Please note that this event is not 100% guaranteed to be fired.
     * @property EVENT_SHOW
     * @type {String}
     */
    EVENT_SHOW: "game_on_show",

    /**
     * Event triggered after game inited, at this point all engine objects and game scripts are loaded
     * @property EVENT_GAME_INITED
     * @type {String}
     */
    EVENT_GAME_INITED: "game_inited",

    /**
     * Event triggered after renderer inited, at this point you will be able to use the render context
     * @property EVENT_RENDERER_INITED
     * @type {String}
     */
    EVENT_RENDERER_INITED: "renderer_inited",

    RENDER_TYPE_CANVAS: 0,
    RENDER_TYPE_WEBGL: 1,
    RENDER_TYPE_OPENGL: 2,

    _persistRootNodes: {},
    _ignoreRemovePersistNode: null,

    /**
     * Key of config
     * @property CONFIG_KEY
     * @type {Object}
     */
    CONFIG_KEY: {
        width: "width",
        height: "height",
        // engineDir: "engineDir",
        debugMode: "debugMode",
        exposeClassName: "exposeClassName",
        showFPS: "showFPS",
        frameRate: "frameRate",
        id: "id",
        renderMode: "renderMode",
        registerSystemEvent: "registerSystemEvent",
        jsList: "jsList",
        scenes: "scenes"
    },

    // states
    _paused: true,//whether the game is paused
    _configLoaded: false,//whether config loaded
    _isCloning: false,    // deserializing or instantiating
    _prepareCalled: false, //whether the prepare function has been called
    _prepared: false, //whether the engine has prepared
    _rendererInitialized: false,

    _renderContext: null,

    _intervalId: null,//interval target of main

    _lastTime: null,
    _frameTime: null,

    // Scenes list
    _sceneInfos: [],

    /**
     * !#en The outer frame of the game canvas, parent of cc.container.
     * !#zh 游戏画布的外框，cc.container 的父类。
     * @property frame
     * @type {Object}
     */
    frame: null,
    /**
     * !#en The container of game canvas, equals to cc.container.
     * !#zh 游戏画布的容器。
     * @property container
     * @type {HTMLDivElement}
     */
    container: null,
    /**
     * !#en The canvas of the game, equals to cc._canvas.
     * !#zh 游戏的画布。
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    canvas: null,

    /**
     * !#en
     * The current game configuration, including:<br/>
     * 1. debugMode<br/>
     *      "debugMode" possible values :<br/>
     *      0 - No message will be printed.                                                      <br/>
     *      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.                      <br/>
     *      2 - cc.error, cc.assert, cc.warn will print in console.                              <br/>
     *      3 - cc.error, cc.assert will print in console.                                       <br/>
     *      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.<br/>
     *      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.        <br/>
     *      6 - cc.error, cc.assert will print on canvas, available only on web.                 <br/>
     * 2. showFPS<br/>
     *      Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.<br/>
     * 3. exposeClassName<br/>
     *      Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.<br/>
     * 4. frameRate<br/>
     *      "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.<br/>
     * 5. id<br/>
     *      "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.<br/>
     * 6. renderMode<br/>
     *      "renderMode" sets the renderer type, only useful on web :<br/>
     *      0 - Automatically chosen by engine<br/>
     *      1 - Forced to use canvas renderer<br/>
     *      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers<br/>
     * 7. scenes<br/>
     *      "scenes" include available scenes in the current bundle.<br/>
     *<br/>
     * Please DO NOT modify this object directly, it won't have any effect.<br/>
     * !#zh
     * 当前的游戏配置，包括：                                                                  <br/>
     * 1. debugMode（debug 模式，但是在浏览器中这个选项会被忽略）                                <br/>
     *      "debugMode" 各种设置选项的意义。                                                   <br/>
     *          0 - 没有消息被打印出来。                                                       <br/>
     *          1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。                  <br/>
     *          2 - cc.error，cc.assert，cc.warn 将打印在 console 中。                          <br/>
     *          3 - cc.error，cc.assert 将打印在 console 中。                                   <br/>
     *          4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。 <br/>
     *          5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。         <br/>
     *          6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。                  <br/>
     * 2. showFPS（显示 FPS）                                                            <br/>
     *      当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。              <br/>
     * 3. exposeClassName                                                           <br/>
     *      暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。 <br/>
     * 4. frameRate (帧率)                                                              <br/>
     *      “frameRate” 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。      <br/>
     * 5. id                                                                            <br/>
     *      "gameCanvas" Web 页面上的 Canvas Element ID，仅适用于 web 端。                         <br/>
     * 6. renderMode（渲染模式）                                                         <br/>
     *      “renderMode” 设置渲染器类型，仅适用于 web 端：                              <br/>
     *          0 - 通过引擎自动选择。                                                     <br/>
     *          1 - 强制使用 canvas 渲染。
     *          2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。     <br/>
     * 7. scenes                                                                         <br/>
     *      “scenes” 当前包中可用场景。                                                   <br/>
     * <br/>
     * 注意：请不要直接修改这个对象，它不会有任何效果。
     * @property config
     * @type {Object}
     */
    config: null,

    /**
     * !#en Callback when the scripts of engine have been load.
     * !#zh 当引擎完成启动后的回调函数。
     * @method onStart
     * @type {Function}
     */
    onStart: null,

//@Public Methods

//  @Game play control
    /**
     * !#en Set frameRate of game.
     * !#zh 设置游戏帧率。
     * @method setFrameRate
     * @param {Number} frameRate
     */
    setFrameRate: function (frameRate) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        config[CONFIG_KEY.frameRate] = frameRate;
        if (self._intervalId)
            window.cancelAnimFrame(self._intervalId);
        self._intervalId = 0;
        self._paused = true;
        self._setAnimFrame();
        self._runMainLoop();
    },

    /**
     * !#en Run the game frame by frame.
     * !#zh 执行一帧游戏循环。
     * @method step
     */
    step: function () {
        cc.director.mainLoop();
    },

    /**
     * !#en Pause the game main loop. This will pause:
     * game logic execution, rendering process, event manager, background music and all audio effects.
     * This is different with cc.director.pause which only pause the game logic execution.
     * !#zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。
     * @method pause
     */
    pause: function () {
        if (this._paused) return;
        this._paused = true;
        // Pause audio engine
        if (cc.audioEngine) {
            cc.audioEngine._break();
        }
        // Pause main loop
        if (this._intervalId)
            window.cancelAnimFrame(this._intervalId);
        this._intervalId = 0;
    },

    /**
     * !#en Resume the game from pause. This will resume:
     * game logic execution, rendering process, event manager, background music and all audio effects.
     * !#zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
     * @method resume
     */
    resume: function () {
        if (!this._paused) return;
        this._paused = false;
        // Resume audio engine
        if (cc.audioEngine) {
            cc.audioEngine._restore();
        }
        // Resume main loop
        this._runMainLoop();
    },

    /**
     * !#en Check whether the game is paused.
     * !#zh 判断游戏是否暂停。
     * @method isPaused
     * @return {Boolean}
     */
    isPaused: function () {
        return this._paused;
    },

    /**
     * !#en Restart game.
     * !#zh 重新开始游戏
     * @method restart
     */
    restart: function () {
        cc.director.popToSceneStackLevel(0);
        // Clean up audio
        if (cc.audioEngine) {
            cc.audioEngine.uncacheAll();
        }

        game.onStart();
    },

    /**
     * !#en End game, it will close the game window
     * !#zh 退出游戏
     * @method end
     */
    end: function () {
        close();
    },

//  @Game loading
    /**
     * !#en Prepare game.
     * !#zh 准备引擎，请不要直接调用这个函数。
     * @param {Function} cb
     * @method prepare
     */
    prepare: function (cb) {
        var self = this,
            config = self.config,
            CONFIG_KEY = self.CONFIG_KEY;

        // Config loaded
        if (!this._configLoaded) {
            this._loadConfig(function () {
                self.prepare(cb);
            });
            return;
        }

        // Already prepared
        if (this._prepared) {
            if (cb) cb();
            return;
        }
        // Prepare called, but not done yet
        if (this._prepareCalled) {
            return;
        }
        // Prepare never called and engine ready
        if (cc._engineLoaded) {
            this._prepareCalled = true;

            this._initRenderer(config[CONFIG_KEY.width], config[CONFIG_KEY.height]);

            /**
             * @module cc
             */

            /**
             * !#en cc.view is the shared view object.
             * !#zh cc.view 是全局的视图对象。
             * @property view
             * @type {View}
             */
            cc.view = View ? View._getInstance() : null;

            /**
             * !#en Director
             * !#zh 导演类。
             * @property director
             * @type {Director}
             */
            cc.director = cc.Director._getInstance();
            if (cc.director.setOpenGLView)
                cc.director.setOpenGLView(cc.view);
            /**
             * !#en cc.winSize is the alias object for the size of the current game window.
             * !#zh cc.winSize 为当前的游戏窗口的大小。
             * @property winSize
             * @type Size
             */
            cc.winSize = cc.director.getWinSize();

            if (!CC_EDITOR) {
                this._initEvents();
            }

            this._setAnimFrame();
            this._runMainLoop();

            // Load game scripts
            var jsList = config[CONFIG_KEY.jsList];
            if (jsList && jsList.length > 0) {
                cc.loader.load(jsList, function (err) {
                    if (err) throw new Error(JSON.stringify(err));
                    self._prepared = true;
                    if (cb) cb();
                    self.emit(self.EVENT_GAME_INITED);
                });
            }
            else {
                if (cb) cb();
                self.emit(self.EVENT_GAME_INITED);
            }

            return;
        }

        // Engine not loaded yet
        cc.initEngine(this.config, function () {
            self.prepare(cb);
        });
    },

    /**
     * !#en cc.game is the singleton object for game related functions.
     * !#zh cc.game 是 Game 的实例，用来驱动整个游戏。
     * @class Game
     */

    /**
     * !#en Run game with configuration object and onStart function.
     * !#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
     * @method run
     * @param {Object|Function} [config] - Pass configuration object or onStart function
     * @param {Function} [onStart] - function to be executed after game initialized
     */
    run: function (config, onStart) {
        if (typeof config === 'function') {
            game.onStart = config;
        }
        else {
            if (config) {
                game.config = config;
            }
            if (typeof onStart === 'function') {
                game.onStart = onStart;
            }
        }

        this.prepare(game.onStart && game.onStart.bind(game));
    },

//  @ Persist root node section
    /**
     * !#en
     * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br/>
     * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
     * !#zh
     * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br/>
     * 目标节点必须位于为层级的根节点，否则无效。
     * @method addPersistRootNode
     * @param {Node} node - The node to be made persistent
     */
    addPersistRootNode: function (node) {
        if (!cc.Node.isNode(node) || !node.uuid) {
            cc.warnID(3800);
            return;
        }
        var id = node.uuid;
        if (!this._persistRootNodes[id]) {
            var scene = cc.director._scene;
            if (cc.isValid(scene)) {
                if (!node.parent) {
                    node.parent = scene;
                }
                else if ( !(node.parent instanceof cc.Scene) ) {
                    cc.warnID(3801);
                    return;
                }
                else if (node.parent !== scene) {
                    cc.warnID(3802);
                    return;
                }
                this._persistRootNodes[id] = node;
                node._persistNode = true;
            }
        }
    },

    /**
     * !#en Remove a persistent root node.
     * !#zh 取消常驻根节点。
     * @method removePersistRootNode
     * @param {Node} node - The node to be removed from persistent node list
     */
    removePersistRootNode: function (node) {
        if (node !== this._ignoreRemovePersistNode) {
            var id = node.uuid || '';
            if (node === this._persistRootNodes[id]) {
                delete this._persistRootNodes[id];
                node._persistNode = false;
            }
        }
    },

    /**
     * !#en Check whether the node is a persistent root node.
     * !#zh 检查节点是否是常驻根节点。
     * @method isPersistRootNode
     * @param {Node} node - The node to be checked
     * @return {Boolean}
     */
    isPersistRootNode: function (node) {
        return node._persistNode;
    },

//@Private Methods

//  @Time ticker section
    _setAnimFrame: function () {
        this._lastTime = new Date();
        var frameRate = game.config[game.CONFIG_KEY.frameRate];
        this._frameTime = 1000 / frameRate;
        if (frameRate !== 60 && frameRate !== 30) {
            window.requestAnimFrame = this._stTime;
            window.cancelAnimFrame = this._ctTime;
        }
        else {
            window.requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            this._stTime;
            window.cancelAnimFrame = window.cancelAnimationFrame ||
            window.cancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.msCancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.oCancelAnimationFrame ||
            this._ctTime;
        }
    },
    _stTime: function(callback){
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, game._frameTime - (currTime - game._lastTime));
        var id = window.setTimeout(function() { callback(); },
            timeToCall);
        game._lastTime = currTime + timeToCall;
        return id;
    },
    _ctTime: function(id){
        window.clearTimeout(id);
    },
    //Run game.
    _runMainLoop: function () {
        var self = this, callback, config = self.config, CONFIG_KEY = self.CONFIG_KEY,
            director = cc.director,
            skip = true, frameRate = config[CONFIG_KEY.frameRate];

        director.setDisplayStats(config[CONFIG_KEY.showFPS]);

        callback = function () {
            if (!self._paused) {
                if (frameRate === 30) {
                    if (skip = !skip) {
                        self._intervalId = window.requestAnimFrame(callback);
                        return;
                    }
                }

                director.mainLoop();
                self._intervalId = window.requestAnimFrame(callback);
            }
        };

        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    },

//  @Game loading section
    _loadConfig: function (cb) {
        // Load config
        // Already loaded
        if (this.config) {
            this._initConfig(this.config);
            cb && cb();
            return;
        }
        // Load from document.ccConfig
        if (document["ccConfig"]) {
            this._initConfig(document["ccConfig"]);
            cb && cb();
            return;
        }
        // Load from project.json
        var self = this;
        cc.loader.load("project.json", function (err, data) {
            if (err) {
                cc.logID(3818);
            }
            self._initConfig(data || {});
            cb && cb();
        });
    },

    _initConfig: function (config) {
        var CONFIG_KEY = this.CONFIG_KEY;

        // Configs adjustment
        if (typeof config[CONFIG_KEY.debugMode] !== 'number') {
            config[CONFIG_KEY.debugMode] = 0;
        }
        config[CONFIG_KEY.exposeClassName] = !!config[CONFIG_KEY.exposeClassName];
        if (typeof config[CONFIG_KEY.frameRate] !== 'number') {
            config[CONFIG_KEY.frameRate] = 60;
        }
        if (typeof config[CONFIG_KEY.renderMode] !== 'number') {
            config[CONFIG_KEY.renderMode] = 0;
        }
        if (typeof config[CONFIG_KEY.registerSystemEvent] !== 'boolean') {
            config[CONFIG_KEY.registerSystemEvent] = true;
        }
        config[CONFIG_KEY.showFPS] = (CONFIG_KEY.showFPS in config) ? (!!config[CONFIG_KEY.showFPS]) : true;
        // config[CONFIG_KEY.engineDir] = config[CONFIG_KEY.engineDir] || 'frameworks/cocos2d-html5';

        // Scene parser
        this._sceneInfos = config[CONFIG_KEY.scenes] || [];

        // Collide Map and Group List
        this.collisionMatrix = config.collisionMatrix || [];
        this.groupList = config.groupList || [];

        cc._initDebugSetting(config[CONFIG_KEY.debugMode]);

        this.config = config;
        this._configLoaded = true;
    },

    _initRenderer: function (width, height) {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) return;

        if (!cc._supportRender) {
            throw new Error("The renderer doesn't support the renderMode " + this.config[this.CONFIG_KEY.renderMode]);
        }

        var el = this.config[game.CONFIG_KEY.id],
            win = window,
            element = cc.$(el) || cc.$('#' + el),
            localCanvas, localContainer, localConStyle;

        if (element.tagName === "CANVAS") {
            width = width || element.width;
            height = height || element.height;

            //it is already a canvas, we wrap it around with a div
            this.canvas = cc._canvas = localCanvas = element;
            this.container = cc.container = localContainer = document.createElement("DIV");
            if (localCanvas.parentNode)
                localCanvas.parentNode.insertBefore(localContainer, localCanvas);
        } else {
            //we must make a new canvas and place into this element
            if (element.tagName !== "DIV") {
                cc.warnID(3819);
            }
            width = width || element.clientWidth;
            height = height || element.clientHeight;
            this.canvas = cc._canvas = localCanvas = document.createElement("CANVAS");
            this.container = cc.container = localContainer = document.createElement("DIV");
            element.appendChild(localContainer);
        }
        localContainer.setAttribute('id', 'Cocos2dGameContainer');
        localContainer.appendChild(localCanvas);
        this.frame = (localContainer.parentNode === document.body) ? document.documentElement : localContainer.parentNode;

        localCanvas.addClass("gameCanvas");
        localCanvas.setAttribute("width", width || 480);
        localCanvas.setAttribute("height", height || 320);
        localCanvas.setAttribute("tabindex", 99);

        if (cc._renderType === game.RENDER_TYPE_WEBGL) {
            this._renderContext = cc._renderContext = cc.webglContext
             = cc.create3DContext(localCanvas, {
                'stencil': true,
                'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS,
                'antialias': cc.sys.isMobile
            });
        }
        // WebGL context created successfully
        if (this._renderContext) {
            cc.renderer = cc.rendererWebGL;
            win.gl = this._renderContext; // global variable declared in CCMacro.js
            cc.renderer.init();
            cc._drawingUtil = new cc.DrawingPrimitiveWebGL(this._renderContext);
            cc.textureCache._initializingRenderer();
            cc.glExt = {};
            cc.glExt.instanced_arrays = win.gl.getExtension("ANGLE_instanced_arrays");
            cc.glExt.element_uint = win.gl.getExtension("OES_element_index_uint");
        } else {
            cc._renderType = game.RENDER_TYPE_CANVAS;
            cc.renderer = cc.rendererCanvas;
            cc.renderer.init();
            this._renderContext = cc._renderContext = new cc.CanvasContextWrapper(localCanvas.getContext("2d"));
            cc._drawingUtil = cc.DrawingPrimitiveCanvas ? new cc.DrawingPrimitiveCanvas(this._renderContext) : null;
        }

        cc._gameDiv = localContainer;
        game.canvas.oncontextmenu = function () {
            if (!cc._isContextMenuEnable) return false;
        };

        this.emit(this.EVENT_RENDERER_INITED, true);

        this._rendererInitialized = true;
    },

    _initEvents: function () {
        var win = window, hidden, visibilityChange, _undef = "undefined";

        // register system events
        if (this.config[this.CONFIG_KEY.registerSystemEvent])
            cc.inputManager.registerSystemEvent(this.canvas);

        if (typeof document.hidden !== 'undefined') {
            hidden = "hidden";
        } else if (typeof document.mozHidden !== 'undefined') {
            hidden = "mozHidden";
        } else if (typeof document.msHidden !== 'undefined') {
            hidden = "msHidden";
        } else if (typeof document.webkitHidden !== 'undefined') {
            hidden = "webkitHidden";
        }

        var changeList = [
            "visibilitychange",
            "mozvisibilitychange",
            "msvisibilitychange",
            "webkitvisibilitychange",
            "qbrowserVisibilityChange"
        ];
        var onHidden = function () {
            game.emit(game.EVENT_HIDE, game);
        };
        var onShow = function () {
            game.emit(game.EVENT_SHOW, game);
        };

        if (hidden) {
            for (var i = 0; i < changeList.length; i++) {
                document.addEventListener(changeList[i], function (event) {
                    var visible = document[hidden];
                    // QQ App
                    visible = visible || event["hidden"];
                    if (visible) onHidden();
                    else onShow();
                }, false);
            }
        } else {
            win.addEventListener("blur", onHidden, false);
            win.addEventListener("focus", onShow, false);
        }

        if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
            win.onfocus = function(){ onShow() };
        }

        if ("onpageshow" in window && "onpagehide" in window) {
            win.addEventListener("pagehide", onHidden, false);
            win.addEventListener("pageshow", onShow, false);
        }

        this.on(game.EVENT_HIDE, function () {
            game.pause();
        });
        this.on(game.EVENT_SHOW, function () {
            game.resume();
        });
    }
};

EventTarget.call(game);
cc.js.addon(game, EventTarget.prototype);

/**
 * @module cc
 */

/**
 * @property game
 * @type Game
 */
cc.game = module.exports = game;
