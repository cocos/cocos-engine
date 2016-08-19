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

var AutoReleaseUtils = require('../cocos2d/core/load-pipeline/auto-release-utils');

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

        // collider manager
        if (cc.CollisionManager) {
            this._collisionManager = new cc.CollisionManager();
            this.getScheduler().scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }
        else {
            this._collisionManager = null;
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

        // Collision manager
        if (this._collisionManager) {
            this.getScheduler().scheduleUpdate(this._collisionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
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
     * Returns the cc.CollisionManager associated with this director.
     * @method getCollisionManager
     * @return {CollisionManager}
     */
    getCollisionManager: function () {
        return this._collisionManager;
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
     * The new scene will be launched immediately.
     * @method runScene
     * @param {Scene} scene - The need run scene.
     * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
     * @param {Function} [onLaunched] - The function invoked at the scene after launch.
     */
    runSceneImmediate: function (scene, onBeforeLoadScene, onLaunched) {
        var id, node, game = cc.game;
        var persistNodes = game._persistRootNodes;

        if (scene instanceof cc.Scene) {
            scene._load();  // ensure scene initialized
        }

        // detach persist nodes
        for (id in persistNodes) {
            node = persistNodes[id];
            game._ignoreRemovePersistNode = node;
            node.parent = null;
            game._ignoreRemovePersistNode = null;
        }

        var oldScene = this._scene;

        // auto release assets
        var autoReleaseAssets = oldScene && oldScene.autoReleaseAssets && oldScene.dependAssets;
        AutoReleaseUtils.autoRelease(cc.loader, autoReleaseAssets, scene.dependAssets);

        // unload scene
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
            this._scene = scene;
            sgScene = scene._sgNode;

            // Re-attach or replace persist nodes
            for (id in persistNodes) {
                node = persistNodes[id];
                var existNode = scene.getChildByUuid(id);
                if (existNode) {
                    // scene also contains the persist node, select the old one
                    var index = existNode.getSiblingIndex();
                    existNode._destroyImmediate();
                    node.parent = scene;
                    node.setSiblingIndex(index);
                }
                else {
                    node.parent = scene;
                }
            }
            scene._activate();
        }

        // Run or replace rendering scene
        if (!this.getRunningScene()) {
            this.runWithScene(sgScene);
        }
        else {
            this.replaceScene(sgScene);
        }

        if (onLaunched) {
            onLaunched(null, scene);
        }
        this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
    },

    /**
     * Run a scene. Replaces the running scene with a new one or enter the first scene.
     * The new scene will be launched at the end of the current frame.
     * @method runScene
     * @param {Scene} scene - The need run scene.
     * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
     * @param {Function} [onLaunched] - The function invoked at the scene after launch.
     */
    runScene: function (scene, onBeforeLoadScene, onLaunched) {
        cc.assert(scene, cc._LogInfos.Director.pushScene);
        if (scene instanceof cc.Scene) {
            // ensure scene initialized
            scene._load();
        }

        // Delay run / replace scene to the end of the frame
        this.once(cc.Director.EVENT_AFTER_UPDATE, function () {
            this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
        });
    },

    //  @Scene loading section

    _getSceneUuid: function (key) {
        var scenes = cc.game._sceneInfos;
        if (typeof key === 'string') {
            if (!key.endsWith('.fire')) {
                key += '.fire';
            }
            if (key[0] !== '/' && !key.startsWith('db://assets/')) {
                key = '/' + key;    // 使用全名匹配
            }
            // search scene
            for (var i = 0; i < scenes.length; i++) {
                var info = scenes[i];
                if (info.url.endsWith(key)) {
                    return info;
                }
            }
        }
        else if (typeof key === 'number') {
            if (0 <= key && key < scenes.length) {
                return scenes[key];
            }
            else {
                cc.error('loadScene: The scene index to load (%s) is out of range.', key);
            }
        }
        else {
            cc.error('loadScene: Unknown name type to load: "%s"', key);
        }
        return null;
    },

    setRuntimeLaunchScene: function (sceneName) {
        // should not preload launch scene in runtime
        var info = this._getSceneUuid(sceneName);
        this._launchSceneUuid = info.uuid;
    },

    /**
     * Loads the scene by its name.
     * @method loadScene
     * @param {String} sceneName - The name of the scene to load.
     * @param {Function} [onLaunched] - callback, will be called after scene launched.
     * @param {Function} [onUnloaded] - callback, will be called when the previous scene was unloaded.
     * @return {Boolean} if error, return false
     */
    loadScene: function (sceneName, onLaunched, _onUnloaded) {
        if (this._loadingScene) {
            cc.error('loadScene: Failed to load scene "%s" because "%s" is already loading', sceneName, this._loadingScene);
            return false;
        }
        var info = this._getSceneUuid(sceneName);
        if (info) {
            var uuid = info.uuid;
            this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            this._loadingScene = sceneName;
            if (CC_JSB && cc.runtime && uuid !== this._launchSceneUuid) {
                var self = this;
                var groupName = cc.path.basename(info.url) + '_' + info.uuid;
                console.log('==> start preload: ' + groupName);
                var ensureAsync = false;
                cc.LoaderLayer.preload([groupName], function () {
                    console.log('==> end preload: ' + groupName);
                    if (ensureAsync) {
                        self._loadSceneByUuid(uuid, onLaunched, _onUnloaded);
                    }
                    else {
                        setTimeout(function () {
                            self._loadSceneByUuid(uuid, onLaunched, _onUnloaded);
                        }, 0);
                    }
                });
                ensureAsync = true;
            }
            else {
                this._loadSceneByUuid(uuid, onLaunched, _onUnloaded);
            }
            return true;
        }
        else {
            cc.error('loadScene: Can not load the scene "%s" because it was not in the build settings before playing.', sceneName);
            return false;
        }
    },

    preloadScene: function (sceneName, onLoaded) {
        var info = this._getSceneUuid(sceneName);
        if (info) {
            this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            cc.loader.load({ id: info.uuid, type: 'uuid' }, function (error, asset) {
                if (error) {
                    cc.error('Failed to preload "%s", %s', sceneName, error.message);
                }
                if (onLoaded) {
                    onLoaded(error, asset);
                }
            });
        }
        else {
            var error = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
            onLoaded(new Error(error));
            cc.error('preloadScene: ' + error);
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
            var self = cc.director;
            self._loadingScene = '';
            var scene;
            if (error) {
                error = 'Failed to load scene: ' + error;
                cc.error(error);
                if (CC_DEV) {
                    console.assert(false, error);
                }
            }
            else {
                if (sceneAsset instanceof cc.SceneAsset) {
                    scene = sceneAsset.scene;
                    scene._id = sceneAsset._uuid;
                    scene._name = sceneAsset._name;
                    self.runSceneImmediate(scene, onUnloaded, onLaunched);
                }
                else {
                    error = 'The asset ' + uuid + ' is not a scene';
                    cc.error(error);
                    scene = null;
                }
            }
            if (error && onLaunched) {
                onLaunched(error);
            }
        });
    }
});

cc.EventTarget.call(cc.director);
cc.js.addon(cc.director, cc.EventTarget.prototype);

cc.Director.EVENT_PROJECTION_CHANGED = 'director_projection_changed';
cc.Director.EVENT_AFTER_DRAW = 'director_after_draw';
cc.Director.EVENT_BEFORE_VISIT = 'director_before_visit';
cc.Director.EVENT_AFTER_VISIT = 'director_after_visit';
cc.Director.EVENT_BEFORE_UPDATE = 'director_before_update';
cc.Director.EVENT_AFTER_UPDATE = 'director_after_update';
cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading";
cc.Director.EVENT_BEFORE_SCENE_LAUNCH = 'director_before_scene_launch';
cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch";
cc.Director.EVENT_COMPONENT_UPDATE = 'director_component_update';
cc.Director.EVENT_COMPONENT_LATE_UPDATE = 'director_component_late_update';

cc.eventManager.addCustomListener(cc.Director.EVENT_BEFORE_UPDATE, function () {
    var dt = cc.director.getDeltaTime();
    // Call start for new added components
    cc.director.emit(cc.Director.EVENT_BEFORE_UPDATE);
    // Update for components
    cc.director.emit(cc.Director.EVENT_COMPONENT_UPDATE, dt);
});
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_UPDATE, function () {
    var dt = cc.director.getDeltaTime();
    // Late update for components
    cc.director.emit(cc.Director.EVENT_COMPONENT_LATE_UPDATE, dt);
    // User can use this event to do things after update
    cc.director.emit(cc.Director.EVENT_AFTER_UPDATE);
    // Destroy entities that have been removed recently
    cc.Object._deferredDestroy();
    
    cc.director.emit(cc.Director.EVENT_BEFORE_VISIT, this);
});
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_VISIT, function () {
    cc.director.emit(cc.Director.EVENT_AFTER_VISIT, this);
});
cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_DRAW, function () {
    cc.director.emit(cc.Director.EVENT_AFTER_DRAW, this);
});
