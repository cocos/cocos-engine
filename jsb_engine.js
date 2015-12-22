'use strict';

function _getPropertyDescriptor (obj, name) {
    var pd = Object.getOwnPropertyDescriptor(obj, name);
    if (pd) {
        return pd;
    }
    var p = Object.getPrototypeOf(obj);
    if (p) {
        return _getPropertyDescriptor(p, name);
    }
    else {
        return null;
    }
}

function _copyprop(name, source, target) {
    var pd = _getPropertyDescriptor(source, name);
    Object.defineProperty(target, name, pd);
}

function mixin (obj) {
    obj = obj || {};
    for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        if (source) {
            if (typeof source !== 'object') {
                cc.error('mixin: arguments must be type object:', source);
                continue;
            }
            for ( var name in source) {
                _copyprop( name, source, obj);
            }
        }
    }
    return obj;
}

cc.js = {
    mixin: mixin
};

cc.initEngine = function (config, cb) {
    require('script/jsb.js');
    cc._renderType = cc.game.RENDER_TYPE_OPENGL;
    cc._initDebugSetting(config[cc.game.CONFIG_KEY.debugMode]);
    cc._engineLoaded = true;
    cc.log(cc.ENGINE_VERSION);
    if (cb) cb();
};

// cc.game
mixin(cc.game, {

    // states
    _paused: false, //whether the game is paused

    // Scenes list
    _sceneInfos: [],

    _persistRootNodes: [],

    CONFIG_KEY: {
        width: 'width',
        height: 'height',
        engineDir: 'engineDir',
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
            // Load game scripts
            var jsList = config[CONFIG_KEY.jsList];
            if (jsList) {
                cc.loader.loadJs(jsList, function (err) {
                    if (err) throw new Error(err);
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

        this.prepare(cc.game.onStart && cc.game.onStart.bind(cc.game));
    },

//  @ Persist root node section
    /**
     * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition
     * @method addPersistRootNode
     * @param {ENode} node - The node to be made persistent
     */
    addPersistRootNode: function (node) {
        if (!(node instanceof cc.Node))
            return;
        var index = this._persistRootNodes.indexOf(node);
        if (index === -1) {
            var scene = cc.director._scene;
            if (cc.isValid(scene)) {
                if (!node.parent) {
                    node.parent = scene;
                }
                else if (node.parent !== scene) {
                    cc.warn('The node can not be made persist because it\'s not under root node.');
                    return;
                }
                this._persistRootNodes.push(node);
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
        var index = this._persistRootNodes.indexOf(node);
        if (index !== -1) {
            this._persistRootNodes.splice(index, 1);
        }
        node._persistNode = false;
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
        config[CONFIG_KEY.showFPS] = config[CONFIG_KEY.showFPS] || true;
        config[CONFIG_KEY.engineDir] = config[CONFIG_KEY.engineDir] || 'frameworks/cocos2d-html5';
        if (config[CONFIG_KEY.debugMode] == null)
            config[CONFIG_KEY.debugMode] = 0;
        config[CONFIG_KEY.frameRate] = config[CONFIG_KEY.frameRate] || 60;
        if (config[CONFIG_KEY.renderMode] == null)
            config[CONFIG_KEY.renderMode] = 0;

        // Scene parser
        this._sceneInfos = this._sceneInfos.concat(config[CONFIG_KEY.scenes]);

        cc.director.setDisplayStats(this.config[CONFIG_KEY.showFPS]);
        cc.director.setAnimationInterval(1.0/this.config[CONFIG_KEY.frameRate]);

        this.config = config;
    }
});

// cc.director
mixin(cc.director, {
    /**
     * Manage all init process shared between the web engine and jsb engine.
     * All platform independent init process should be occupied here.
     */
    sharedInit: function () {
        // Animation manager
        if (cc.AnimationManager) {
            this._animationManager = new cc.AnimationManager();
            this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }
        else {
            this._animationManager = null;
        }

        // WidgetManager
        cc._widgetManager.init(this);
    },

    /**
     * Reset the cc.director, can be used to restart the director after purge
     */
    reset: function () {
        this.purgeDirector();

        if (cc.eventManager)
            cc.eventManager.setEnabled(true);

        // Action manager
        if(this._actionManager){
            this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }

        // Animation manager
        if (this._animationManager) {
            this._scheduler.scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }

        this.startAnimation();
    },

    /**
     * Run a scene. Replaces the running scene with a new one or enter the first scene.
     * @method runScene
     * @param {EScene} scene - The need run scene.
     * @param {Function} [onBeforeLoadScene] - The function at the scene before loading.
     */
    runScene: function (scene, onBeforeLoadScene) {
        // cc.assert(scene, cc._LogInfos.Director.pushScene);

        // unload scene
        var oldScene = this._scene;
        if (cc.isValid(oldScene)) {
            oldScene.destroy();
        }
        this._scene = null;

        // purge destroyed nodes belongs to old scene
        cc.Object._deferredDestroy();

        if (onBeforeLoadScene) {
            onBeforeLoadScene();
        }
        this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, scene);

        // Re-add persist node root
        var persistNodes = cc.game._persistRootNodes;
        for (var i = 0; i < persistNodes.length; ++i) {
            var node = persistNodes[i];
            node.parent = scene;
        }

        var sgScene = scene;

        // Run an Entity Scene
        if (scene instanceof cc.Scene) {
            // ensure scene initialized
            scene._load();

            this._scene = scene;
            sgScene = scene._sgNode;
        }

        // Run or replace rendering scene
        if (!this.getRunningScene()) {
            this.runWithScene(sgScene);
        }
        else {
            this.replaceScene(sgScene);
        }

        // Activate
        if (scene instanceof cc.Scene) {
            scene._activate();
        }
    },

    //  @Scene loading section

    /**
     * Loads the scene by its name.
     * @method loadScene
     * @param {String} sceneName - The name of the scene to load.
     * @param {Function} [onLaunched] - callback, will be called after scene launched.
     * @param {Function} [onUnloaded] - callback, will be called when the previous scene was unloaded.
     * @return {Boolean} if error, return false
     */
    loadScene: function (sceneName, onLaunched, onUnloaded) {
        var uuid, info;
        if (this._loadingScene) {
            cc.error('[loadScene] Failed to load scene "%s" because "%s" is already loading', sceneName, this._loadingScene);
            return false;
        }
        if (typeof sceneName === 'string') {
            if (!sceneName.endsWith('.fire')) {
                sceneName += '.fire';
            }
            if (sceneName[0] !== '/' && !sceneName.startsWith('db://assets/')) {
                sceneName = '/' + sceneName;    // 使用全名匹配
            }
            // search scene
            for (var i = 0; i < cc.game._sceneInfos.length; i++) {
                info = cc.game._sceneInfos[i];
                var url = info.url;
                if (url.endsWith(sceneName)) {
                    uuid = info.uuid;
                    break;
                }
            }
        }
        else {
            info = cc.game._sceneInfos[sceneName];
            if (typeof info === 'object') {
                uuid = info.uuid;
            }
            else {
                cc.error('[loadScene] The scene index to load (%s) is out of range.', sceneName);
                return false;
            }
        }
        if (uuid) {
            this._loadingScene = sceneName;
            this._loadSceneByUuid(uuid, onLaunched, onUnloaded);
            return true;
        }
        else {
            cc.error('[loadScene] Can not load the scene "%s" because it has not been added to the build settings before play.', sceneName);
            return false;
        }
    },

    /**
     * Loads the scene by its uuid.
     * @method _loadSceneByUuid
     * @param {String} uuid - the uuid of the scene asset to load
     * @param {Function} [onLaunched]
     * @param {Function} [onUnloaded]
     * @private
     */
    _loadSceneByUuid: function (uuid, onLaunched, onUnloaded) {
        //cc.AssetLibrary.unloadAsset(uuid);     // force reload
        cc.AssetLibrary.loadAsset(uuid, function (error, sceneAsset) {
            var scene;
            if (error) {
                error = 'Failed to load scene: ' + error;
                cc.error(error);
                if (CC_EDITOR) {
                    console.assert(false, error);
                }
            }
            else {
                var uuid = sceneAsset._uuid;
                scene = sceneAsset.scene;
                if (scene instanceof cc.Scene) {
                    scene._id = uuid;
                    cc.director.runScene(scene, onUnloaded);
                }
                else {
                    error = 'The asset ' + uuid + ' is not a scene';
                    cc.error(error);
                    scene = null;
                }
            }
            cc.director._loadingScene = '';
            if (onLaunched) {
                onLaunched(error, scene);
            }
        });
    }
});

cc.director.sharedInit();

cc._LogInfos = {};

