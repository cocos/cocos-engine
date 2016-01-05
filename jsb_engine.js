'use strict';

var _engineNumberVersion = (function () {
    var result = /Cocos2d\-JS\sv([\.\d]+)/.exec(cc.ENGINE_VERSION);
    if (result && result[1]) {
        return parseFloat(result[1]);
    }
    else {
        return null;
    }
})();

cc.js.mixin(cc.path, {
    //todo make public after verification
    _normalize: function(url){
        var oldUrl = url = String(url);

        //removing all ../
        do {
            oldUrl = url;
            url = url.replace(this.normalizeRE, '');
        } while(oldUrl.length !== url.length);
        return url;
    },

    // The platform-specific file separator. '\\' or '/'.
    sep: (cc.sys.os === cc.sys.OS_WINDOWS ? '\\' : '/'),

    // @param {string} path
    // @param {boolean|string} [endsWithSep = true]
    // @returns {string}
    _setEndWithSep: function (path, endsWithSep) {
        var sep = cc.path.sep;
        if (typeof endsWithSep === 'undefined') {
            endsWithSep = true;
        }
        else if (typeof endsWithSep === 'string') {
            sep = endsWithSep;
            endsWithSep = !!endsWithSep;
        }

        var endChar = path[path.length - 1];
        var oldEndWithSep = (endChar === '\\' || endChar === '/');
        if (!oldEndWithSep && endsWithSep) {
            path += sep;
        }
        else if (oldEndWithSep && !endsWithSep) {
            path = path.slice(0, -1);
        }
        return path;
    }
});

// cc.game
cc.js.mixin(cc.game, {

    // states
    _paused: false, //whether the game is paused

    // Scenes list
    _sceneInfos: [],

    _persistRootNodes: [],
    _ignoreRemovePersistNode: null,

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

            // Additional step in JSB
            cc.director.sharedInit();

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
                else if ( !(node.parent instanceof cc.Scene) ) {
                    cc.warn('The node can not be made persist because it\'s not under root node.');
                    return;
                }
                else if (node.parent !== scene) {
                    cc.warn('The node can not be made persist because it\'s not in current scene.');
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
        if (node !== this._ignoreRemovePersistNode) {
            var index = this._persistRootNodes.indexOf(node);
            if (index !== -1) {
                this._persistRootNodes.splice(index, 1);
            }
            node._persistNode = false;
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
cc.js.mixin(cc.director, {
    /**
     * Manage all init process shared between the web engine and jsb engine.
     * All platform independent init process should be occupied here.
     */
    sharedInit: function () {
        // Animation manager
        if (cc.AnimationManager) {
            this._animationManager = new cc.AnimationManager();
            this.getScheduler().scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
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
        var actionManager = this.getActionManager();
        if (actionManager) {
            this.getScheduler().scheduleUpdate(actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }

        // Animation manager
        if (this._animationManager) {
            this.getScheduler().scheduleUpdate(this._animationManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }

        this.startAnimation();
    },

    /**
     * Returns the cc.AnimationManager associated with this director.
     * @method getAnimationManager
     * @return {AnimationManager}
     */
    getAnimationManager: function () {
        return this._animationManager;
    },

    /**
     * Returns current running Scene. Director can only run one Scene at the time.
     * @method getScene
     * @return {Scene}
     */
    getScene: function () {
        return this._scene;
    },

    /**
     * Run a scene. Replaces the running scene with a new one or enter the first scene.
     * @method runScene
     * @param {EScene} scene - The need run scene.
     * @param {Function} [onBeforeLoadScene] - The function at the scene before loading.
     */
    runScene: function (scene, onBeforeLoadScene) {
        cc.assert(scene, cc._LogInfos.Director.pushScene);

        // detach persist nodes
        var i, node, game = cc.game;
        var persistNodes = game._persistRootNodes;
        for (i = persistNodes.length - 1; i >= 0; --i) {
            node = persistNodes[i];
            game._ignoreRemovePersistNode = node;
            node.parent = null;
            game._ignoreRemovePersistNode = null;
        }

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

        var sgScene = scene;

        // Run an Entity Scene
        if (scene instanceof cc.Scene) {
            // ensure scene initialized
            scene._load();

            this._scene = scene;
            sgScene = scene._sgNode;
            
            // Re-attach persist nodes
            for (i = 0; i < persistNodes.length; ++i) {
                node = persistNodes[i];
                node.parent = scene;
            }
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

    // load raw assets
    _loadRawAssets: function (assetObjects, done) {
        var urls = assetObjects.map(function (asset) {
            return asset.url;
        });

        //var info = 'preload ' + urls;
        //console.time(info);

        // currently cocos jsb 3.3 not support preload too much assets
        // so we divide assets to 30 a group
        var index = 0;
        var count = 30;
        var total = urls.length;

        function preload () {
            if (index + count > total) {
                // the last time
                count = total - index;
            }

            var assets = urls.slice(index, count);

            index += count;

            if (index < total) {
                cc.loader.load(assets, preload);
            }
            else {
                //console.timeEnd(info);
                done();
            }
        }

        preload();
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
            var self = cc.director;
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
                    self.runScene(scene, onUnloaded);
                }
                else {
                    error = 'The asset ' + uuid + ' is not a scene';
                    cc.error(error);
                    scene = null;
                }
            }
            self._loadingScene = '';
            if (onLaunched) {
                onLaunched(error, scene);
            }
        }, { recordAssets: true });
    }
});

cc.Director.EVENT_PROJECTION_CHANGED = 'director_projection_changed';
cc.Director.EVENT_AFTER_DRAW = 'director_after_draw';
cc.Director.EVENT_BEFORE_VISIT = 'director_before_visit';
cc.Director.EVENT_AFTER_VISIT = 'director_after_visit';
cc.Director.EVENT_BEFORE_UPDATE = 'director_before_update';
cc.Director.EVENT_AFTER_UPDATE = 'director_after_update';
cc.Director.EVENT_BEFORE_SCENE_LAUNCH = 'director_before_scene_launch';
cc.Director.EVENT_COMPONENT_UPDATE = 'director_component_update';
cc.Director.EVENT_COMPONENT_LATE_UPDATE = 'director_component_late_update';

// Overwrite main loop
if (_engineNumberVersion && _engineNumberVersion >= 3.9) {
    var scheduleTarget = {
        update: function (dt) {
            // Call start for new added components
            cc.director.emit(cc.Director.EVENT_BEFORE_UPDATE);
            // Update for components
            cc.director.emit(cc.Director.EVENT_COMPONENT_UPDATE, dt);
        }
    };
    cc.Director.getInstance().getScheduler().scheduleUpdateForTarget(scheduleTarget, -1000, false);
}
else {
    cc.eventManager.addCustomListener(cc.Director.EVENT_BEFORE_UPDATE, function () {
       var dt = 1 / cc.game.config[cc.game.CONFIG_KEY.frameRate];
       // Call start for new added components
       cc.director.emit(cc.Director.EVENT_BEFORE_UPDATE);
       // Update for components
       cc.director.emit(cc.Director.EVENT_COMPONENT_UPDATE, dt);
    });
}
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_UPDATE, function () {
    var dt = 1 / cc.game.config[cc.game.CONFIG_KEY.frameRate];
    // Late update for components
    cc.director.emit(cc.Director.EVENT_COMPONENT_LATE_UPDATE, dt);
    // User can use this event to do things after update
    cc.director.emit(cc.Director.EVENT_AFTER_UPDATE);
    
    cc.director.emit(cc.Director.EVENT_BEFORE_VISIT, this);
});
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_VISIT, function () {
    cc.director.emit(cc.Director.EVENT_AFTER_VISIT, this);
});
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_DRAW, function () {
    cc.director.emit(cc.Director.EVENT_AFTER_DRAW, this);
});

cc.ParticleSystem.Mode = cc.Enum({
    /** The gravity mode (A mode) */
    GRAVITY: 0,
    /** The radius mode (B mode) */
    RADIUS: 1
});


cc.ParticleSystem.Type = cc.Enum({
    /**
     * Living particles are attached to the world and are unaffected by emitter repositioning.
     */
    FREE: 0,

    /**
     * Living particles are attached to the world but will follow the emitter repositioning.<br/>
     * Use case: Attach an emitter to an sprite, and you want that the emitter follows the sprite.
     */
    RELATIVE: 1,

    /**
     * Living particles are attached to the emitter and are translated along with it.
     */
    GROUPED: 2
});

cc.ProgressTimer.Type = cc.Enum({
    /**
     * Radial Counter-Clockwise
     */
    RADIAL: 0,
    BAR: 1
});


cc.EditBox.InputMode = cc.Enum({

    ANY: 0,

    /**
     * The user is allowed to enter an e-mail address.
     */
    EMAILADDR: 1,

    /**
     * The user is allowed to enter an integer value.
     */
    NUMERIC: 2,

    /**
     * The user is allowed to enter a phone number.
     */
    PHONENUMBER: 3,

    /**
     * The user is allowed to enter a URL.
     */
    URL: 4,

    /**
     * The user is allowed to enter a real number value.
     * This extends kEditBoxInputModeNumeric by allowing a decimal point.
     */
    DECIMAL: 5,

    /**
     * The user is allowed to enter any text, except for line breaks.
     */
    SINGLELINE: 6
});

/**
 * Enum for the EditBox's input flags
 * @readonly
 * @enum {number}
 * @memberof cc.EditBox
 */
cc.EditBox.InputFlag = cc.Enum({
    /**
     * Indicates that the text entered is confidential data that should be
     * obscured whenever possible. This implies EDIT_BOX_INPUT_FLAG_SENSITIVE.
     */
    PASSWORD: 0,

    /**
     * Indicates that the text entered is sensitive data that the
     * implementation must never store into a dictionary or table for use
     * in predictive, auto-completing, or other accelerated input schemes.
     * A credit card number is an example of sensitive data.
     */
    SENSITIVE: 1,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each word should be capitalized.
     */
    INITIAL_CAPS_WORD: 2,

    /**
     * This flag is a hint to the implementation that during text editing,
     * the initial letter of each sentence should be capitalized.
     */
    INITIAL_CAPS_SENTENCE: 3,

    /**
     * Capitalize all characters automatically.
     */
    INITIAL_CAPS_ALL_CHARACTERS: 4
});

/**
 * Enum for keyboard return types
 * @readonly
 * @enum {number}
 */
cc.KeyboardReturnType = cc.Enum({
    DEFAULT: 0,
    DONE: 1,
    SEND: 2,
    SEARCH: 3,
    GO: 4
});

/**
 * Enum for text alignment
 * @readonly
 * @enum {number}
 */
cc.TextAlignment = cc.Enum({
    LEFT: 0,
    CENTER: 1,
    RIGHT: 2
});

/**
 * Enum for vertical text alignment
 * @readonly
 * @enum {number}
 */
cc.VerticalTextAlignment = cc.Enum({
    TOP: 0,
    CENTER: 1,
    BOTTOM: 2
});

/**
 * Enum for Relative layout parameter RelativeAlign
 * @readonly
 * @enum {number}
 */
ccui.RelativeLayoutParameter.Type = cc.Enum({
    /**
     * The none of ccui.RelativeLayoutParameter's relative align.
     */
    NONE: 0,
    /**
     * The parent's top left of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_LEFT: 1,
    /**
     * The parent's top center horizontal of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_CENTER_HORIZONTAL: 2,
    /**
     * The parent's top right of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_TOP_RIGHT: 3,
    /**
     * The parent's left center vertical of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_LEFT_CENTER_VERTICAL: 4,

    /**
     * The center in parent of ccui.RelativeLayoutParameter's relative align.
     */
    CENTER_IN_PARENT: 5,

    /**
     * The parent's right center vertical of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_RIGHT_CENTER_VERTICAL: 6,
    /**
     * The parent's left bottom of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_LEFT_BOTTOM: 7,
    /**
     * The parent's bottom center horizontal of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_BOTTOM_CENTER_HORIZONTAL: 8,
    /**
     * The parent's right bottom of ccui.RelativeLayoutParameter's relative align.
     */
    PARENT_RIGHT_BOTTOM: 9,

    /**
     * The location above left align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_LEFTALIGN: 10,
    /**
     * The location above center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_CENTER: 11,
    /**
     * The location above right align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_ABOVE_RIGHTALIGN: 12,
    /**
     * The location left of top align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_TOPALIGN: 13,
    /**
     * The location left of center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_CENTER: 14,
    /**
     * The location left of bottom align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_LEFT_OF_BOTTOMALIGN: 15,
    /**
     * The location right of top align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_TOPALIGN: 16,
    /**
     * The location right of center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_CENTER: 17,
    /**
     * The location right of bottom align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_RIGHT_OF_BOTTOMALIGN: 18,
    /**
     * The location below left align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_LEFTALIGN: 19,
    /**
     * The location below center of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_CENTER: 20,
    /**
     * The location below right align of ccui.RelativeLayoutParameter's relative align.
     */
    LOCATION_BELOW_RIGHTALIGN: 21
});


/**
 * Enum for layout type
 * @readonly
 * @enum {number}
 */
ccui.Layout.Type = cc.Enum({
    /**
     * The absolute of ccui.Layout's layout type.
     */
    ABSOLUTE: 0,
    /**
     * The vertical of ccui.Layout's layout type.
     */
    LINEAR_VERTICAL: 1,
    /**
     * The horizontal of ccui.Layout's layout type.
     */
    LINEAR_HORIZONTAL: 2,
    /**
     * The relative of ccui.Layout's layout type.
     */
    RELATIVE: 3
});

/**
 * Enum for loadingBar Type
 * @readonly
 * @enum {number}
 */
ccui.LoadingBar.Type = cc.Enum({
    /**
     * The left direction of ccui.LoadingBar.
     */
    LEFT: 0,
    /**
     * The right direction of ccui.LoadingBar.
     */
    RIGHT: 1
});

/**
 * Enum for ScrollView direction
 * @readonly
 * @enum {number}
 */
ccui.ScrollView.Dir = cc.Enum({
    /**
     * The none flag of ccui.ScrollView's direction.
     */
    NONE: 0,
    /**
     * The vertical flag of ccui.ScrollView's direction.
     */
    VERTICAL: 1,
    /**
     * The horizontal flag of ccui.ScrollView's direction.
     */
    HORIZONTAL: 2,
    /**
     * The both flag of ccui.ScrollView's direction.
     */
    BOTH: 3
});

cc.EventTarget.call(cc.game);
cc.js.addon(cc.game, cc.EventTarget.prototype);
cc.EventTarget.call(cc.director);
cc.js.addon(cc.director, cc.EventTarget.prototype);

// cc.Label
cc._Label = cc.Label;
cc._Label.prototype.setHorizontalAlign = cc._Label.prototype.setHorizontalAlignment;
cc._Label.prototype.setVerticalAlign = cc._Label.prototype.setVerticalAlignment;
cc._Label.prototype.setFontSize = function (size) {
    if (this._labelType === _ccsg.Label.Type.TTF) {
        this.setSystemFontSize(size);
    }
    else if (this._labelType === _ccsg.Label.Type.BMFont) {
        this.setBMFontSize(size);
    }
};
cc._Label.prototype.enableWrapText = cc._Label.prototype.enableWrap;
cc._Label.prototype.isWrapTextEnabled = cc._Label.prototype.isWrapEnabled;
cc._Label.prototype._setLineHeight = cc._Label.prototype.setLineHeight;
cc._Label.prototype.setLineHeight = function (height) {
    if (this._labelType === _ccsg.Label.Type.BMFont) {
        this._setLineHeight(height);
    }
};
cc.Label = function (string, fontHandle, type) {
    var label;
    if (type === _ccsg.Label.Type.TTF) {
        label = cc._Label.createWithSystemFont(string, fontHandle, 40);
    }
    else if (type === _ccsg.Label.Type.BMFont) {
        label = cc._Label.createWithBMFont(fontHandle, string);
    }
    label._labelType = type;
    return label;
};
cc.Label.Type = cc.Enum({
    TTF: 0,
    BMFont: 1
});
cc.Label.Overflow = cc.Enum({
    CLAMP: 0,
    SHRINK: 1,
    RESIZE: 2
});

cc.spriteFrameAnimationCache = cc.animationCache;
cc.SpriteFrameAnimation = cc.Animation;

// Assets
cc.js.setClassName('cc.SpriteFrame', cc.SpriteFrame);

// ccsg
window._ccsg = {
    Node: cc.Node,
    Scene: cc.Scene,
    Sprite: cc.Sprite,
    ParticleSystem: cc.ParticleSystem,
    Label: cc.Label,

};

// rename cc.Class to cc._Class
cc._Class = cc.Class;

// cc.textureCache.cacheImage
cc.textureCache._textures = {};
cc.textureCache.cacheImage = function (key, texture) {
    if (texture instanceof cc.Texture2D) {
        this._textures[key] = texture;
    }
};
cc.textureCache._getTextureForKey = cc.textureCache.getTextureForKey;
cc.textureCache.getTextureForKey = function (key) {
    var tex = this._getTextureForKey(key);
    if (!tex)
        tex = this._textures[key];
    return tex || null;
};

// cc.Texture2D
cc.Texture2D.prototype.isLoaded = function () {
    return true;
};
cc.Texture2D.prototype.getPixelWidth = cc.Texture2D.prototype.getPixelsWide;
cc.Texture2D.prototype.getPixelHeight = cc.Texture2D.prototype.getPixelsHigh;

// cc.SpriteFrame
cc.js.mixin(cc.SpriteFrame.prototype, cc.EventTarget.prototype);
cc.SpriteFrame.prototype.textureLoaded = function () {
    return this.getTexture() !== null;
};
cc.SpriteFrame.prototype._initWithTexture = cc.SpriteFrame.prototype.initWithTexture;
cc.SpriteFrame.prototype.initWithTexture = function (texture, rect, rotated, offset, originalSize, _uuid) {
    function check(texture) {
        if (texture && texture.isLoaded()) {
            var _x, _y;
            if (rotated) {
                _x = rect.x + rect.height;
                _y = rect.y + rect.width;
            }
            else {
                _x = rect.x + rect.width;
                _y = rect.y + rect.height;
            }
            if (_x > texture.getPixelWidth()) {
                cc.error(cc._LogInfos.RectWidth, _uuid);
            }
            if (_y > texture.getPixelHeight()) {
                cc.error(cc._LogInfos.RectHeight, _uuid);
            }
        }
    }

    if(arguments.length === 2)
        rect = cc.rectPointsToPixels(rect);

    offset = cc.p(0, 0);
    originalSize = originalSize || rect;
    rotated = rotated || false;

    if (this.insetTop === undefined) {
        this.insetTop = 0;
        this.insetBottom = 0;
        this.insetLeft = 0;
        this.insetRight = 0;
    }

    var locTexture;
    if (!texture && _uuid) {
        // deserialize texture from uuid
        var info = cc.AssetLibrary._getAssetInfoInRuntime(_uuid);
        if (!info) {
            cc.error('SpriteFrame: Failed to load sprite texture "%s"', _uuid);
            return;
        }

        this._textureFilename = info.url;

        locTexture = cc.textureCache.addImage(info.url);
        this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
    }
    else {
        if (cc.js.isString(texture)){
            this._textureFilename = texture;
            locTexture = cc.textureCache.addImage(this._textureFilename);
            this._initWithTexture(locTexture, rect, rotated, offset, originalSize);
        } else if (texture instanceof cc.Texture2D) {
            this._textureFilename = '';
            this._initWithTexture(texture, rect, rotated, offset, originalSize);
        }
    }
    this.emit('load');
    check(this.getTexture());
    return true;
};
cc.SpriteFrame.prototype._deserialize = function (data, handle) {
    var rect = data.rect ? new cc.Rect(data.rect[0], data.rect[1], data.rect[2], data.rect[3]) : undefined;
    var offset = data.offset ? new cc.Vec2(data.offset[0], data.offset[1]) : undefined;
    var size = data.originalSize ? new cc.Size(data.originalSize[0], data.originalSize[1]) : undefined;
    var rotated = data.rotated === 1;
    // init properties not included in this._initWithTexture()
    this._name = data.name;
    var capInsets = data.capInsets;
    if (capInsets) {
        this.insetLeft = capInsets[0];
        this.insetTop = capInsets[1];
        this.insetRight = capInsets[2];
        this.insetBottom = capInsets[3];
    }

    // load texture via _textureFilenameSetter
    var textureUuid = data.texture;
    if (textureUuid) {
        handle.result.push(this, '_textureFilenameSetter', textureUuid);
    }

    this.initWithTexture(null, rect, rotated, offset, size, textureUuid);
};
cc.SpriteFrame.prototype._checkRect = function (texture) {
    var rect = this.getRectInPixels();
    var maxX = rect.x, maxY = rect.y;
    if (this._rotated) {
        maxX += rect.height;
        maxY += rect.width;
    }
    else {
        maxX += rect.width;
        maxY += rect.height;
    }
    if (maxX > texture.getPixelWidth()) {
        cc.error(cc._LogInfos.RectWidth, texture.url);
    }
    if (maxY > texture.getPixelHeight()) {
        cc.error(cc._LogInfos.RectHeight, texture.url);
    }
};
var getTextureJSB = cc.SpriteFrame.prototype.getTexture;
cc.SpriteFrame.prototype.getTexture = function () {
    var tex = getTextureJSB.call(this);
    this._texture = tex;
    return tex;
};
cc.js.set(cc.SpriteFrame.prototype, '_textureFilenameSetter', function (url) {
    this._textureFilename = url;
    if (url) {
        // texture will be init in getTexture()
        var texture = this.getTexture();
        if (this.textureLoaded()) {
            this._checkRect(texture);
            this.emit('load');
        }
        else {
            // register event in setTexture()
            this._texture = null;
            this.setTexture(texture);
        }
    }
});

// cc.Label
cc.Label.prototype.setHorizontalAlign = cc.Label.prototype.setHorizontalAlignment;
cc.Label.prototype.setVerticalAlign = cc.Label.prototype.setVerticalAlignment;
cc.Label.prototype.setFontSize = cc.Label.prototype.setSystemFontSize;
cc.Label.prototype.setOverflow = function () {};
cc.Label.prototype.enableWrapText = function () {};
cc.Label.prototype.setLineHeight = function () {};

// cc.Event#getCurrentTarget
cc.Event.prototype._getCurrentTarget = cc.Event.prototype.getCurrentTarget;
cc.Event.prototype.getCurrentTarget = function () {
    return this._currentTarget || this._getCurrentTarget();
};

// cc.eventManager.addListener
cc.eventManager.addListener = function(listener, nodeOrPriority) {
    if(!(listener instanceof cc.EventListener)) {
        listener = cc.EventListener.create(listener);
    }

    if (typeof nodeOrPriority == "number") {
        if (nodeOrPriority == 0) {
            cc.log("0 priority is forbidden for fixed priority since it's used for scene graph based priority.");
            return;
        }

        cc.eventManager.addEventListenerWithFixedPriority(listener, nodeOrPriority);
    } else {
        var node = nodeOrPriority;
        if (nodeOrPriority instanceof cc.Component) {
            node = nodeOrPriority.node._sgNode;
        }
        if (nodeOrPriority instanceof cc.Node) {
            node = nodeOrPriority._sgNode;
        }
        // rebind target
        if (node !== nodeOrPriority) {
            var keys = Object.keys(listener);
            // Overwrite all functions
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                var value = listener[key];
                if (typeof value === 'function') {
                    // var _value = value;
                    listener[key] = (function (realCallback) {
                        return function (event1, event2) {
                            // event must be the last argument, and arguments count could be 1 or 2 
                            var event = event2 || event1;
                            // Replace event's _currentTarget
                            if (event) {
                                event._currentTarget = nodeOrPriority;
                            }
                            return realCallback.call(this, event1, event2);
                        };
                    })(value);
                }
            }
        }
        cc.eventManager.addEventListenerWithSceneGraphPriority(listener, node);
    }

    return listener;
};
cc.eventManager._removeListeners = cc.eventManager.removeListeners;
cc.eventManager.removeListeners = function (target, recursive) {
    if (target instanceof cc.Component) {
        target = target.node._sgNode;
    }
    if (target instanceof cc.Node) {
        target = target._sgNode;
    }
    this._removeListeners(target, recursive);
};

// cc.Scheduler
cc.Scheduler.prototype.scheduleUpdate = cc.Scheduler.prototype.scheduleUpdateForTarget;
cc.Scheduler.prototype._unschedule = cc.Scheduler.prototype.unschedule;
cc.Scheduler.prototype.unschedule = function (callback, target) {
    if (typeof target === 'function') {
        var tmp = target;
        target = callback;
        callback = tmp;
    }
    this._unschedule(target, callback);
};

// cc.Scale9Sprite
cc.Scale9Sprite.prototype._setBlendFunc = cc.Scale9Sprite.prototype.setBlendFunc;
cc.Scale9Sprite.prototype.setBlendFunc = function(blendFunc, dst) {
    if (dst !== undefined) {
        blendFunc = {
            src : blendFunc,
            dst : dst
        };
    }
    this._setBlendFunc(blendFunc);
};
cc.Scale9Sprite.prototype._setContentSize = cc.Scale9Sprite.prototype.setContentSize;
cc.Scale9Sprite.prototype.setContentSize = function(size, height){
    if (height !== undefined) {
        size = new cc.Size(size, height);
    }
    this._setContentSize(size);
};
cc.Scale9Sprite.prototype._setAnchorPoint = cc.Scale9Sprite.prototype.setAnchorPoint;
cc.Scale9Sprite.prototype.setAnchorPoint = function(anchorPoint, y){
    if (y !== undefined) {
        anchorPoint = new cc.Vec2(anchorPoint, y);
    }
    this._setAnchorPoint(anchorPoint);
};

cc.Scale9Sprite.prototype._setSpriteFrame = cc.Scale9Sprite.prototype.setSpriteFrame;
cc.Scale9Sprite.prototype.setSpriteFrame = function(spriteFrame) {
    var contentSize = this.getContentSize();
    this._setSpriteFrame(spriteFrame);
    if (!cc.sizeEqualToSize(contentSize, cc.size(0, 0))) {
        this.setContentSize(contentSize);
    }
};
