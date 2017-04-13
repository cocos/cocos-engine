/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

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
if (!(CC_EDITOR && Editor.isCoreLevel)) {
    View = require('./platform/CCView');
}

/**
 * An object to boot the game.
 * @class Game
 */
var game = /** @lends cc.game# */{

    EVENT_HIDE: "game_on_hide",
    EVENT_SHOW: "game_on_show",
    EVENT_RESIZE: "game_on_resize",
    EVENT_RENDERER_INITED: "renderer_inited",

    RENDER_TYPE_CANVAS: 0,
    RENDER_TYPE_WEBGL: 1,
    RENDER_TYPE_OPENGL: 2,

    _eventHide: null,
    _eventShow: null,

    _persistRootNodes: {},
    _ignoreRemovePersistNode: null,

    /**
     * Key of config
     * @constant
     * @type {Object}
     */
    CONFIG_KEY: {
        width: "width",
        height: "height",
        engineDir: "engineDir",
        modules: "modules",
        debugMode: "debugMode",
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
     * The outer frame of the game canvas, parent of cc.container.
     * @property frame
     * @type {Object}
     */
    frame: null,
    /**
     * The container of game canvas, equals to cc.container.
     * @property container
     * @type {Object}
     */
    container: null,
    /**
     * The canvas of the game, equals to cc._canvas.
     * @property canvas
     * @type {Object}
     */
    canvas: null,

    /**
     * The current game configuration, including:
     * 1. debugMode
     *      "debugMode" possible values :
     *      0 - No message will be printed.
     *      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
     *      2 - cc.error, cc.assert, cc.warn will print in console.
     *      3 - cc.error, cc.assert will print in console.
     *      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
     *      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
     *      6 - cc.error, cc.assert will print on canvas, available only on web.
     * 2. showFPS
     *      Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.
     * 3. frameRate
     *      "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.
     * 4. id
     *      "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.
     * 5. renderMode
     *      "renderMode" sets the renderer type, only useful on web :
     *      0 - Automatically chosen by engine
     *      1 - Forced to use canvas renderer
     *      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers
     * 6. scenes
     *      "scenes" include available scenes in the current bundle.
     *
     * Please DO NOT modify this object directly, it won't have any effect.
     * @property config
     * @type {Object}
     */
    config: null,

    /**
     * Callback when the scripts of engine have been load.
     * @method onStart
     * @type {Function}
     */
    onStart: null,

    /**
     * Callback when game exits.
     * @method onStop
     * @type {Function}
     */
    onStop: null,

//@Public Methods

//  @Game play control
    /**
     * Set frameRate of game.
     * @method setFrameRate
     * @param {Number} frameRate
     */
    setFrameRate: function (frameRate) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        config[CONFIG_KEY.frameRate] = frameRate;
        if (self._intervalId)
            window.cancelAnimationFrame(self._intervalId);
        self._paused = true;
        self._setAnimFrame();
        self._runMainLoop();
    },

    /**
     * Run the game frame by frame.
     * @method step
     */
    step: function () {
        cc.director.mainLoop();
    },

    /**
     * Pause the game.
     * @method pause
     */
    pause: function () {
        if (this._paused) return;
        this._paused = true;
        // Pause audio engine
        cc.audioEngine && cc.audioEngine._pausePlaying();
        // Pause main loop
        if (this._intervalId)
            window.cancelAnimationFrame(this._intervalId);
        this._intervalId = 0;
    },

    /**
     * Resume the game from pause.
     * @method resume
     */
    resume: function () {
        if (!this._paused) return;
        this._paused = false;
        // Resume audio engine
        cc.audioEngine && cc.audioEngine._resumePlaying();
        // Resume main loop
        this._runMainLoop();
    },

    /**
     * Check whether the game is paused.
     * @method isPaused
     * @return {Boolean}
     */
    isPaused: function () {
        return this._paused;
    },

    /**
     * Restart game.
     * @method restart
     */
    restart: function () {
        cc.director.popToSceneStackLevel(0);
        // Clean up audio
        cc.audioEngine && cc.audioEngine.end();

        game.onStart();
    },

//  @Game loading
    /**
     * Prepare game.
     * @param {Function} cb
     * @method prepare
     */
    prepare: function (cb) {
        var self = this,
            config = self.config,
            CONFIG_KEY = self.CONFIG_KEY;

        this._loadConfig();

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
             * cc.view is the shared view object.
             * @property view
             * @type View
             */
            cc.view = View ? View._getInstance() : null;

            /**
             * @property director
             * @type Director
             */
            cc.director = cc.Director._getInstance();
            if (cc.director.setOpenGLView)
                cc.director.setOpenGLView(cc.view);
            /**
             * cc.winSize is the alias object for the size of the current game window.
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
                });
            }
            else {
                if (cb) cb();
            }

            return;
        }

        // Engine not loaded yet
        cc.initEngine(this.config, function () {
            self.prepare(cb);
        });
    },

    /**
     * cc.game is the singleton object for game related functions.
     * @class Game
     */

    /**
     * Run game with configuration object and onStart function.
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
     * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.
     * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
     * @method addPersistRootNode
     * @param {Node} node - The node to be made persistent
     * @return {key} 返回创建使用的key -1失败 其它成功
     */
    addPersistRootNode: function (node) {
        return this.setPersistRootNode(node.uuid,node);
    },
    setPersistRootNode: function (key,node) {
        if (!(node instanceof cc.Node) || !key) {
            cc.warn('The target can not be made persist because it\'s not a cc.Node or it doesn\'t have _id property.');
            return -1;
        }
        var id = key;
        if (!this._persistRootNodes[id]) {
            var scene = cc.director._scene;
            if (cc.isValid(scene)) {
                if (!node.parent) {
                    node.parent = scene;
                }
                else if ( !(node.parent instanceof cc.Scene) ) {
                    cc.warn('The node can not be made persist because it\'s not under root node.');
                    return -1;
                }
                else if (node.parent !== scene) {
                    cc.warn('The node can not be made persist because it\'s not in current scene.');
                    return -1;
                }
                this._persistRootNodes[id] = node;
                node._persistNode = true;
                return id;
            }
        }
        return -1;
    },
    getPersistRootNode:function(key){
         if (!key) {
            cc.warn(' getPersistRootNode key==null');
            return null;
        }
        return this._persistRootNodes[key];
    },


    /**
     * Remove a persistent root node
     * @method removePersistRootNode
     * @param {Node|Number} nodeOrKey - The node to be removed from persistent node list
     * @return {Boolean} false 失败 true 成功
     */
    removePersistRootNode: function (nodeOrKey) {
        if (nodeOrKey !== this._ignoreRemovePersistNode) {
             var id =''
            if(nodeOrKey instanceof cc.Node){
                id = nodeOrKey.uuid || '';
            }else if(typeof(nodeOrKey) == 'number'){
                id = nodeOrKey;
                nodeOrKey=this.getPersistRootNode(nodeOrKey);
            }else{
                return false;
            }
            if (nodeOrKey === this._persistRootNodes[id]) {
                delete this._persistRootNodes[id];
                nodeOrKey._persistNode = false;
                return true;
            }
        }
        return false;
    },

    /**
     * Check whether the node is a persistent root node
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
        this._frameTime = 1000 / game.config[game.CONFIG_KEY.frameRate];
        if((cc.sys.os === cc.sys.OS_IOS && cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT) || game.config[game.CONFIG_KEY.frameRate] !== 60) {
            window.requestAnimFrame = this._stTime;
            window.cancelAnimationFrame = this._ctTime;
        }
        else {
            window.requestAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            this._stTime;
            window.cancelAnimationFrame = window.cancelAnimationFrame ||
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
            director = cc.director;

        director.setDisplayStats(config[CONFIG_KEY.showFPS]);

        callback = function () {
            if (!self._paused) {
                director.mainLoop();
                if(self._intervalId)
                    window.cancelAnimationFrame(self._intervalId);
                self._intervalId = window.requestAnimFrame(callback);
            }
        };

        window.requestAnimFrame(callback);
        self._paused = false;
    },

//  @Game loading section
    _loadConfig: function () {
        // Load config
        // Already loaded
        if (this.config) {
            this._initConfig(this.config);
            return;
        }
        // Load from document.ccConfig
        if (document["ccConfig"]) {
            this._initConfig(document["ccConfig"]);
        }
        // Load from project.json
        else {
            try {
                var cocos_script = document.getElementsByTagName('script');
                for(var i = 0; i < cocos_script.length; i++){
                    var _t = cocos_script[i].getAttribute('cocos');
                    if(_t === '' || _t) {
                        break;
                    }
                }
                var _src, txt, _resPath;
                if(i < cocos_script.length){
                    _src = cocos_script[i].src;
                    if(_src){
                        _resPath = /(.*)\//.exec(_src)[0];
                        cc.loader.resPath = _resPath;
                        _src = cc.path.join(_resPath, 'project.json');
                    }
                    txt = cc.loader._loadTxtSync(_src);
                }
                if(!txt){
                    txt = cc.loader._loadTxtSync("project.json");
                }
                var data = JSON.parse(txt);
                this._initConfig(data || {});
            } catch (e) {
                cc.log("Failed to read or parse project.json");
                this._initConfig({});
            }
        }
    },

    _initConfig: function (config) {
        var CONFIG_KEY = this.CONFIG_KEY,
            modules = config[CONFIG_KEY.modules];

        // Configs adjustment
        if (typeof config[CONFIG_KEY.debugMode] !== 'number') {
            config[CONFIG_KEY.debugMode] = 0;
        }
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
        config[CONFIG_KEY.engineDir] = config[CONFIG_KEY.engineDir] || 'frameworks/cocos2d-html5';


        // Modules adjustment
        if (modules && modules.indexOf("core") < 0) modules.splice(0, 0, "core");
        modules && (config[CONFIG_KEY.modules] = modules);

        // Scene parser
        this._sceneInfos = this._sceneInfos.concat(config[CONFIG_KEY.scenes]);

        this.config = config;
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
                cc.log("Warning: target element is not a DIV or CANVAS");
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
        localCanvas.style.outline = "none";
        localConStyle = localContainer.style;
        localConStyle.width = (width || 480) + "px";
        localConStyle.height = (height || 320) + "px";
        localConStyle.margin = "0 auto";

        localConStyle.position = 'relative';
        localConStyle.overflow = 'hidden';
        localContainer.top = '100%';

        if (cc._renderType === game.RENDER_TYPE_WEBGL) {
            this._renderContext = cc._renderContext = cc.webglContext
             = cc.create3DContext(localCanvas, {
                'stencil': true,
                'preserveDrawingBuffer': true,
                'antialias': !cc.sys.isMobile,
                'alpha': true
            });
        }
        // WebGL context created successfully
        if (this._renderContext) {
            cc.renderer = cc.rendererWebGL;
            win.gl = this._renderContext; // global variable declared in CCMacro.js
            cc.shaderCache._init();
            cc._drawingUtil = new cc.DrawingPrimitiveWebGL(this._renderContext);
            cc.textureCache._initializingRenderer();
        } else {
            cc.renderer = cc.rendererCanvas;
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
        var win = window, self = this, hidden, visibilityChange, _undef = "undefined";

        this._eventHide = this._eventHide || new cc.Event.EventCustom(this.EVENT_HIDE);
        this._eventHide.setUserData(this);
        this._eventShow = this._eventShow || new cc.Event.EventCustom(this.EVENT_SHOW);
        this._eventShow.setUserData(this);

        // register system events
        if (this.config[this.CONFIG_KEY.registerSystemEvent])
            cc.inputManager.registerSystemEvent(this.canvas);

        if (!cc.js.isUndefined(document.hidden)) {
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (!cc.js.isUndefined(document.mozHidden)) {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (!cc.js.isUndefined(document.msHidden)) {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (!cc.js.isUndefined(document.webkitHidden)) {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        var onHidden = function () {
            if (cc.eventManager && game._eventHide)
                cc.eventManager.dispatchEvent(game._eventHide);
        };
        var onShow = function () {
            if (cc.eventManager && game._eventShow)
                cc.eventManager.dispatchEvent(game._eventShow);
        };

        if (hidden) {
            document.addEventListener(visibilityChange, function () {
                if (document[hidden]) onHidden();
                else onShow();
            }, false);
        } else {
            win.addEventListener("blur", onHidden, false);
            win.addEventListener("focus", onShow, false);
        }

        if(navigator.userAgent.indexOf("MicroMessenger") > -1){
            win.onfocus = function(){ onShow() };
        }

        if ("onpageshow" in window && "onpagehide" in window) {
            win.addEventListener("pagehide", onHidden, false);
            win.addEventListener("pageshow", onShow, false);
        }

        cc.eventManager.addCustomListener(game.EVENT_HIDE, function () {
            game.pause();
        });
        cc.eventManager.addCustomListener(game.EVENT_SHOW, function () {
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
