/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EventTarget = require('./event/event-target');
require('../audio/CCAudioEngine');
const debug = require('./CCDebug');
const renderer = require('./renderer/index.js');
const dynamicAtlasManager = require('../core/renderer/utils/dynamic-atlas/manager');

/**
 * @module cc
 */

/**
 * !#en An object to boot the game.
 * !#zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class Game
 * @extends EventTarget
 */
var game = {
    /**
     * !#en Event triggered when game hide to background.
     * Please note that this event is not 100% guaranteed to be fired on Web platform,
     * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
     * !#zh 游戏进入后台时触发的事件。
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
     * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
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
     * !#en Event triggered when game back to foreground
     * Please note that this event is not 100% guaranteed to be fired on Web platform,
     * on native platforms, it corresponds to enter foreground event.
     * !#zh 游戏进入前台运行时触发的事件。
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。
     * 在原生平台，它对应的是应用被切换到前台事件。
     * @property EVENT_SHOW
     * @constant
     * @type {String}
     */
    EVENT_SHOW: "game_on_show",

    /**
     * !#en Event triggered when game restart
     * !#zh 调用restart后，触发事件。
     * @property EVENT_RESTART
     * @constant
     * @type {String}
     */
    EVENT_RESTART: "game_on_restart",

    /**
     * Event triggered after game inited, at this point all engine objects and game scripts are loaded
     * @property EVENT_GAME_INITED
     * @constant
     * @type {String}
     */
    EVENT_GAME_INITED: "game_inited",

    /**
     * Event triggered after engine inited, at this point you will be able to use all engine classes. 
     * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0
     * @property EVENT_ENGINE_INITED
     * @constant
     * @type {String}
     */
    EVENT_ENGINE_INITED: "engine_inited",
    // deprecated
    EVENT_RENDERER_INITED: "engine_inited",

    /**
     * Web Canvas 2d API as renderer backend
     * @property RENDER_TYPE_CANVAS
     * @constant
     * @type {Number}
     */
    RENDER_TYPE_CANVAS: 0,
    /**
     * WebGL API as renderer backend
     * @property RENDER_TYPE_WEBGL
     * @constant
     * @type {Number}
     */
    RENDER_TYPE_WEBGL: 1,
    /**
     * OpenGL API as renderer backend
     * @property RENDER_TYPE_OPENGL
     * @constant
     * @type {Number}
     */
    RENDER_TYPE_OPENGL: 2,

    _persistRootNodes: {},

    // states
    _paused: true,//whether the game is paused
    _configLoaded: false,//whether config loaded
    _isCloning: false,    // deserializing or instantiating
    _prepared: false, //whether the engine has prepared
    _rendererInitialized: false,

    _renderContext: null,

    _intervalId: null,//interval target of main

    _lastTime: null,
    _frameTime: null,

    /**
     * !#en The outer frame of the game canvas, parent of game container.
     * !#zh 游戏画布的外框，container 的父容器。
     * @property frame
     * @type {Object}
     */
    frame: null,
    /**
     * !#en The container of game canvas.
     * !#zh 游戏画布的容器。
     * @property container
     * @type {HTMLDivElement}
     */
    container: null,
    /**
     * !#en The canvas of the game.
     * !#zh 游戏的画布。
     * @property canvas
     * @type {HTMLCanvasElement}
     */
    canvas: null,

    /**
     * !#en The renderer backend of the game.
     * !#zh 游戏的渲染器类型。
     * @property renderType
     * @type {Number}
     */
    renderType: -1,

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
     * !#en Set frame rate of game.
     * !#zh 设置游戏帧率。
     * @method setFrameRate
     * @param {Number} frameRate
     */
    setFrameRate: function (frameRate) {
        var config = this.config;
        config.frameRate = frameRate;
        if (this._intervalId)
            window.cancelAnimFrame(this._intervalId);
        this._intervalId = 0;
        this._paused = true;
        this._setAnimFrame();
        this._runMainLoop();
    },

    /**
     * !#en Get frame rate set for the game, it doesn't represent the real frame rate.
     * !#zh 获取设置的游戏帧率（不等同于实际帧率）。
     * @method getFrameRate
     * @return {Number} frame rate
     */
    getFrameRate: function () {
        return this.config.frameRate;
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
        cc.director._resetDeltaTime();
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
        cc.director.once(cc.Director.EVENT_AFTER_DRAW, function () {
            for (var id in game._persistRootNodes) {
                game.removePersistRootNode(game._persistRootNodes[id]);
            }

            // Clear scene
            cc.director.getScene().destroy();
            cc.Object._deferredDestroy();

            // Clean up audio
            if (cc.audioEngine) {
                cc.audioEngine.uncacheAll();
            }

            cc.director.reset();

            game.pause();
            cc.assetManager.builtins.init(() => {
                game.onStart();
                game.emit(game.EVENT_RESTART);
            });
        });
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

    _initEngine () {
        if (this._rendererInitialized) {
            return;
        }

        this._initRenderer();

        if (!CC_EDITOR) {
            this._initEvents();
        }

        this.emit(this.EVENT_ENGINE_INITED);
    },

    _prepareFinished (cb) {

        if (CC_PREVIEW && window.__modular) {
            window.__modular.run();
        }

        // Init engine
        this._initEngine();
        this._setAnimFrame();
        cc.assetManager.builtins.init(() => {
            // Log engine version
            console.log('Cocos Creator v' + cc.ENGINE_VERSION);
            this._prepared = true;
            this._runMainLoop();

            this.emit(this.EVENT_GAME_INITED);

            if (cb) cb();
        });
    },

    eventTargetOn: EventTarget.prototype.on,
    eventTargetOnce: EventTarget.prototype.once,

    /**
     * !#en
     * Register an callback of a specific event type on the game object.
     * This type of event should be triggered via `emit`.
     * !#zh
     * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。
     *
     * @method on
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {any} [callback.arg1] arg1
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     * @typescript
     * on<T extends Function>(type: string, callback: T, target?: any, useCapture?: boolean): T
     */
    on (type, callback, target) {
        // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
        if ((this._prepared && type === this.EVENT_ENGINE_INITED) ||
            (!this._paused && type === this.EVENT_GAME_INITED)) {
            callback.call(target);
        }
        else {
            this.eventTargetOn(type, callback, target);
        }
    },
    /**
     * !#en
     * Register an callback of a specific event type on the game object,
     * the callback will remove itself after the first time it is triggered.
     * !#zh
     * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @method once
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {any} [callback.arg1] arg1
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    once (type, callback, target) {
        // Make sure EVENT_ENGINE_INITED and EVENT_GAME_INITED callbacks to be invoked
        if ((this._prepared && type === this.EVENT_ENGINE_INITED) ||
            (!this._paused && type === this.EVENT_GAME_INITED)) {
            callback.call(target);
        }
        else {
            this.eventTargetOnce(type, callback, target);
        }
    },

    /**
     * !#en Prepare game.
     * !#zh 准备引擎，请不要直接调用这个函数。
     * @param {Function} cb
     * @method prepare
     */
    prepare (cb) {
        // Already prepared
        if (this._prepared) {
            if (cb) cb();
            return;
        }

        // Load game scripts
        let jsList = this.config.jsList;
        if (jsList && jsList.length > 0) {
            var self = this;
            var count = 0;
            for (var i = 0, l = jsList.length; i < l; i++) {
                cc.assetManager.loadScript(jsList[i], function (err) {
                    if (err) throw new Error(JSON.stringify(err));
                    count++;
                    if (count === l) self._prepareFinished(cb);
                });
            }
        }
        else {
            this._prepareFinished(cb);
        }
    },

    /**
     * !#en Run game with configuration object and onStart function.
     * !#zh 运行游戏，并且指定引擎配置和 onStart 的回调。
     * @method run
     * @param {Object} config - Pass configuration object or onStart function
     * @param {Function} onStart - function to be executed after game initialized
     */
    run: function (config, onStart) {
        this._initConfig(config);
        this.onStart = onStart;
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
            }
            this._persistRootNodes[id] = node;
            node._persistNode = true;
            cc.assetManager.finalizer._addPersistNodeRef(node);
        }
    },

    /**
     * !#en Remove a persistent root node.
     * !#zh 取消常驻根节点。
     * @method removePersistRootNode
     * @param {Node} node - The node to be removed from persistent node list
     */
    removePersistRootNode: function (node) {
        var id = node.uuid || '';
        if (node === this._persistRootNodes[id]) {
            delete this._persistRootNodes[id];
            node._persistNode = false;
            cc.assetManager.finalizer._removePersistNodeRef(node);
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
        this._lastTime = performance.now();
        var frameRate = game.config.frameRate;
        this._frameTime = 1000 / frameRate;

        if (CC_JSB || CC_RUNTIME) {
            jsb.setPreferredFramesPerSecond(frameRate);
            window.requestAnimFrame = window.requestAnimationFrame;
            window.cancelAnimFrame = window.cancelAnimationFrame;
        }
        else {
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
        }
    },
    _stTime: function(callback){
        var currTime = performance.now();
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
        if (CC_EDITOR) {
            return;
        }
        if (!this._prepared) return;

        var self = this, callback, config = self.config,
            director = cc.director,
            skip = true, frameRate = config.frameRate;

        debug.setDisplayStats(config.showFPS);

        callback = function (now) {
            if (!self._paused) {
                self._intervalId = window.requestAnimFrame(callback);
                if (!CC_JSB && !CC_RUNTIME && frameRate === 30) {
                    if (skip = !skip) {
                        return;
                    }
                }
                director.mainLoop(now);
            }
        };

        self._intervalId = window.requestAnimFrame(callback);
        self._paused = false;
    },

//  @Game loading section
    _initConfig (config) {
        // Configs adjustment
        if (typeof config.debugMode !== 'number') {
            config.debugMode = 0;
        }
        config.exposeClassName = !!config.exposeClassName;
        if (typeof config.frameRate !== 'number') {
            config.frameRate = 60;
        }
        let renderMode = config.renderMode;
        if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
            config.renderMode = 0;
        }
        if (typeof config.registerSystemEvent !== 'boolean') {
            config.registerSystemEvent = true;
        }
        config.showFPS = !!config.showFPS;

        // Collide Map and Group List
        this.collisionMatrix = config.collisionMatrix || [];
        this.groupList = config.groupList || [];

        debug._resetDebugSetting(config.debugMode);

        this.config = config;
        this._configLoaded = true;
    },

    _determineRenderType () {
        let config = this.config,
            userRenderMode = parseInt(config.renderMode) || 0;
    
        // Determine RenderType
        this.renderType = this.RENDER_TYPE_CANVAS;
        let supportRender = false;
    
        if (userRenderMode === 0) {
            if (cc.sys.capabilities['opengl']) {
                this.renderType = this.RENDER_TYPE_WEBGL;
                supportRender = true;
            }
            else if (cc.sys.capabilities['canvas']) {
                this.renderType = this.RENDER_TYPE_CANVAS;
                supportRender = true;
            }
        }
        else if (userRenderMode === 1 && cc.sys.capabilities['canvas']) {
            this.renderType = this.RENDER_TYPE_CANVAS;
            supportRender = true;
        }
        else if (userRenderMode === 2 && cc.sys.capabilities['opengl']) {
            this.renderType = this.RENDER_TYPE_WEBGL;
            supportRender = true;
        }
    
        if (!supportRender) {
            throw new Error(debug.getError(3820, userRenderMode));
        }
    },

    _initRenderer () {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) return;

        let el = this.config.id,
            width, height,
            localCanvas, localContainer;

        if (CC_JSB || CC_RUNTIME) {
            this.container = localContainer = document.createElement("DIV");
            this.frame = localContainer.parentNode === document.body ? document.documentElement : localContainer.parentNode;
            localCanvas = window.__canvas;
            this.canvas = localCanvas;
        }
        else {
            var element = (el instanceof HTMLElement) ? el : (document.querySelector(el) || document.querySelector('#' + el));

            if (element.tagName === "CANVAS") {
                width = element.width;
                height = element.height;

                //it is already a canvas, we wrap it around with a div
                this.canvas = localCanvas = element;
                this.container = localContainer = document.createElement("DIV");
                if (localCanvas.parentNode)
                    localCanvas.parentNode.insertBefore(localContainer, localCanvas);
            } else {
                //we must make a new canvas and place into this element
                if (element.tagName !== "DIV") {
                    cc.warnID(3819);
                }
                width = element.clientWidth;
                height = element.clientHeight;
                this.canvas = localCanvas = document.createElement("CANVAS");
                this.container = localContainer = document.createElement("DIV");
                element.appendChild(localContainer);
            }
            localContainer.setAttribute('id', 'Cocos2dGameContainer');
            localContainer.appendChild(localCanvas);
            this.frame = (localContainer.parentNode === document.body) ? document.documentElement : localContainer.parentNode;

            function addClass (element, name) {
                var hasClass = (' ' + element.className + ' ').indexOf(' ' + name + ' ') > -1;
                if (!hasClass) {
                    if (element.className) {
                        element.className += " ";
                    }
                    element.className += name;
                }
            }
            addClass(localCanvas, "gameCanvas");
            localCanvas.setAttribute("width", width || 480);
            localCanvas.setAttribute("height", height || 320);
            localCanvas.setAttribute("tabindex", 99);
        }

        this._determineRenderType();
        // WebGL context created successfully
        if (this.renderType === this.RENDER_TYPE_WEBGL) {
            var opts = {
                'stencil': true,
                // MSAA is causing serious performance dropdown on some browsers.
                'antialias': cc.macro.ENABLE_WEBGL_ANTIALIAS,
                'alpha': cc.macro.ENABLE_TRANSPARENT_CANVAS
            };
            renderer.initWebGL(localCanvas, opts);
            this._renderContext = renderer.device._gl;
            
            // Enable dynamic atlas manager by default
            if (!cc.macro.CLEANUP_IMAGE_CACHE && dynamicAtlasManager) {
                dynamicAtlasManager.enabled = true;
            }
        }
        if (!this._renderContext) {
            this.renderType = this.RENDER_TYPE_CANVAS;
            // Could be ignored by module settings
            renderer.initCanvas(localCanvas);
            this._renderContext = renderer.device._ctx;
        }

        this.canvas.oncontextmenu = function () {
            if (!cc._isContextMenuEnable) return false;
        };

        this._rendererInitialized = true;
    },

    _initEvents: function () {
        var win = window, hiddenPropName;

        // register system events
        if (this.config.registerSystemEvent)
            _cc.inputManager.registerSystemEvent(this.canvas);

        if (typeof document.hidden !== 'undefined') {
            hiddenPropName = "hidden";
        } else if (typeof document.mozHidden !== 'undefined') {
            hiddenPropName = "mozHidden";
        } else if (typeof document.msHidden !== 'undefined') {
            hiddenPropName = "msHidden";
        } else if (typeof document.webkitHidden !== 'undefined') {
            hiddenPropName = "webkitHidden";
        }

        var hidden = false;

        function onHidden () {
            if (!hidden) {
                hidden = true;
                game.emit(game.EVENT_HIDE);
            }
        }
        // In order to adapt the most of platforms the onshow API.
        function onShown (arg0, arg1, arg2, arg3, arg4) {
            if (hidden) {
                hidden = false;
                game.emit(game.EVENT_SHOW, arg0, arg1, arg2, arg3, arg4);
            }
        }

        if (hiddenPropName) {
            var changeList = [
                "visibilitychange",
                "mozvisibilitychange",
                "msvisibilitychange",
                "webkitvisibilitychange",
                "qbrowserVisibilityChange"
            ];
            for (var i = 0; i < changeList.length; i++) {
                document.addEventListener(changeList[i], function (event) {
                    var visible = document[hiddenPropName];
                    // QQ App
                    visible = visible || event["hidden"];
                    if (visible)
                        onHidden();
                    else
                        onShown();
                });
            }
        } else {
            win.addEventListener("blur", onHidden);
            win.addEventListener("focus", onShown);
        }

        if (navigator.userAgent.indexOf("MicroMessenger") > -1) {
            win.onfocus = onShown;
        }

        if ("onpageshow" in window && "onpagehide" in window) {
            win.addEventListener("pagehide", onHidden);
            win.addEventListener("pageshow", onShown);
            // Taobao UIWebKit
            document.addEventListener("pagehide", onHidden);
            document.addEventListener("pageshow", onShown);
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
 * !#en This is a Game instance.
 * !#zh 这是一个 Game 类的实例，包含游戏主体信息并负责驱动游戏的游戏对象。。
 * @property game
 * @type Game
 */
cc.game = module.exports = game;
