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

'use strict';

// cc.game
cc.game = {

    DEBUG_MODE_NONE: 0,
    DEBUG_MODE_INFO: 1,
    DEBUG_MODE_WARN: 2,
    DEBUG_MODE_ERROR: 3,
    DEBUG_MODE_INFO_FOR_WEB_PAGE: 4,
    DEBUG_MODE_WARN_FOR_WEB_PAGE: 5,
    DEBUG_MODE_ERROR_FOR_WEB_PAGE: 6,

    EVENT_HIDE: "game_on_hide",
    EVENT_SHOW: "game_on_show",
    EVENT_RESIZE: "game_on_resize",

    _onShowListener: null,
    _onHideListener: null,

    // states
    _paused: false, //whether the game is paused
    _prepareCalled: false,//whether the prepare function has been called
    _prepared: false,//whether the engine has prepared

    /**
     * Config of game
     * @type {Object}
     */
    config: null,

    /**
     * Callback when the scripts of engine have been load.
     * @type {Function}
     */
    onStart: null,

    // Scenes list
    _sceneInfos: [],

    _persistRootNodes: {},
    _ignoreRemovePersistNode: null,

    RENDER_TYPE_CANVAS: 0,
    RENDER_TYPE_WEBGL: 1,
    RENDER_TYPE_OPENGL: 2,

    EVENT_GAME_INITED: "game_inited",
    
    CONFIG_KEY: {
        width: 'width',
        height: 'height',
        // engineDir: 'engineDir',
        modules: 'modules',
        debugMode: 'debugMode',
        showFPS: 'showFPS',
        frameRate: 'frameRate',
        id: 'id',
        renderMode: 'renderMode',
        registerSystemEvent: 'registerSystemEvent',
        jsList: 'jsList',
        scenes: 'scenes'
    },

//@Public Methods

//  @Game play control
    /**
     * Set frameRate of game.
     * @param frameRate
     */
    setFrameRate: function (frameRate) {
        var self = this, config = self.config, CONFIG_KEY = self.CONFIG_KEY;
        config[CONFIG_KEY.frameRate] = frameRate;
        cc.director.setAnimationInterval(1.0/frameRate);
    },

    /**
     * Run the game frame by frame.
     */
    step: function () {
        cc.director.mainLoop();
    },

    /**
     * Pause the game.
     */
    pause: function () {
        this._paused = true;
        cc.director.pause();
    },

    /**
     * Resume the game from pause.
     */
    resume: function () {
        this._paused = false;
        cc.director.resume();
    },

    /**
     * Check whether the game is paused.
     */
    isPaused: function () {
        return this._paused;
    },

    /**
     * Restart game.
     */
    restart: function () {
        __restartVM();
    },

    /**
     * End game, it will close the game window
     */
    end: function () {
        close();
    },

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
        this._prepareCalled = true;

        // Additional step in JSB
        cc._renderType = cc.game.RENDER_TYPE_OPENGL;
        cc.director.sharedInit();

        // Load game scripts
        var jsList = config[CONFIG_KEY.jsList];
        if (jsList) {
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
    },

    /**
     * Run game with configuration object and onStart function.
     * @param {Object|Function} [config] Pass configuration object or onStart function
     * @param {onStart} [onStart] onStart function to be executed after game initialized
     */
    run: function (config, onStart) {
        if (typeof config === 'function') {
            cc.game.onStart = config;
        }
        else {
            if (config) {
                cc.game.config = config;
            }
            if (typeof onStart === 'function') {
                cc.game.onStart = onStart;
            }
        }
        cc.director.startAnimation();
        this.prepare(cc.game.onStart && cc.game.onStart.bind(cc.game));
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
            cc.warnID(3803);
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
     * Remove a persistent root node
     * @method removePersistRootNode
     * @param {ENode} node - The node to be removed from persistent node list
     */
    removePersistRootNode: function (node) {
        if (node !== this._ignoreRemovePersistNode) {
            var id = node._id || '';
            if (node === this._persistRootNodes[id]) {
                delete this._persistRootNodes[id];
                node._persistNode = false;
            }
        }
    },

    /**
     * Check whether the node is a persistent root node
     * @method isPersistRootNode
     * @param {ENode} node - The node to be checked
     * @return {Boolean}
     */
    isPersistRootNode: function (node) {
        return node._persistNode;
    },

//@Private Methods

    _loadConfig: function () {
        // Load config
        // Already loaded
        if (this.config) {
            this._initConfig(this.config);
        }
        // Load from project.json
        else {
            try {
                var txt = jsb.fileUtils.getStringFromFile('project.json');
                var data = JSON.parse(txt);
                this._initConfig(data || {});
            } catch (e) {
                console.log('Failed to read or parse project.json');
                this._initConfig({});
            }
        }
    },

    _initConfig: function (config) {
        var CONFIG_KEY = this.CONFIG_KEY;

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
        config[CONFIG_KEY.showFPS] = (CONFIG_KEY.showFPS in config) ? (!!config[CONFIG_KEY.showFPS]) : true;
        // config[CONFIG_KEY.engineDir] = config[CONFIG_KEY.engineDir] || 'frameworks/cocos2d-html5';

        // Group List and Collide Map
        this.groupList = config.groupList || [];
        this.collisionMatrix = config.collisionMatrix || [];

        // Scene parser
        this._sceneInfos = config[CONFIG_KEY.scenes] || [];

        cc.director.setDisplayStats(config[CONFIG_KEY.showFPS]);
        cc.director.setAnimationInterval(1.0/config[CONFIG_KEY.frameRate]);
        cc._initDebugSetting(config[CONFIG_KEY.debugMode]);

        this.config = config;
    }
};

cc.EventTarget.call(cc.game);
cc.js.addon(cc.game, cc.EventTarget.prototype);

cc.game._onHideListener = cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function () {
    cc.game.emit(cc.game.EVENT_HIDE, cc.game);
});
cc.game._onShowListener = cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
    cc.game.emit(cc.game.EVENT_SHOW, cc.game);
});

cc._initDebugSetting(cc.game.DEBUG_MODE_INFO);