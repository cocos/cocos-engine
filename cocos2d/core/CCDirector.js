/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EventTarget = require('./event/event-target');
var Class = require('./platform/_CCClass');

cc.g_NumberOfDraws = 0;

//----------------------------------------------------------------------------------------------------------------------

/**
 * !#en
 * <p>
 *    ATTENTION: USE cc.director INSTEAD OF cc.Director.<br/>
 *    cc.director is a singleton object which manage your game's logic flow.<br/>
 *    Since the cc.director is a singleton, you don't need to call any constructor or create functions,<br/>
 *    the standard way to use it is by calling:<br/>
 *      - cc.director.methodName(); <br/>
 *
 *    It creates and handle the main Window and manages how and when to execute the Scenes.<br/>
 *    <br/>
 *    The cc.director is also responsible for:<br/>
 *      - initializing the OpenGL context<br/>
 *      - setting the OpenGL pixel format (default on is RGB565)<br/>
 *      - setting the OpenGL pixel format (default on is RGB565)<br/>
 *      - setting the OpenGL buffer depth (default one is 0-bit)<br/>
        - setting the color for clear screen (default one is BLACK)<br/>
 *      - setting the projection (default one is 3D)<br/>
 *      - setting the orientation (default one is Portrait)<br/>
 *      <br/>
 *    <br/>
 *    The cc.director also sets the default OpenGL context:<br/>
 *      - GL_TEXTURE_2D is enabled<br/>
 *      - GL_VERTEX_ARRAY is enabled<br/>
 *      - GL_COLOR_ARRAY is enabled<br/>
 *      - GL_TEXTURE_COORD_ARRAY is enabled<br/>
 * </p>
 * <p>
 *   cc.director also synchronizes timers with the refresh rate of the display.<br/>
 *   Features and Limitations:<br/>
 *      - Scheduled timers & drawing are synchronizes with the refresh rate of the display<br/>
 *      - Only supports animation intervals of 1/60 1/30 & 1/15<br/>
 * </p>
 *
 * !#zh 导演类，负责创建和处理主窗口，以及管理场景执行。
 *
 * @class Director
 */
cc.Director = Class.extend(/** @lends cc.Director# */{
    //Variables
    _landscape: false,
    _nextDeltaTimeZero: false,
    _paused: false,
    _purgeDirectorInNextLoop: false,
    _sendCleanupToScene: false,
    _animationInterval: 0.0,
    _oldAnimationInterval: 0.0,
    _projection: 0,
    _contentScaleFactor: 1.0,

    _deltaTime: 0.0,

    _winSizeInPoints: null,

    _lastUpdate: null,
    _nextScene: null,
    _notificationNode: null,
    _openGLView: null,
    _scenesStack: null,
    _projectionDelegate: null,

    _loadingScene: '',
    _runningScene: null,    // The root of rendering scene graph

    // The entity-component scene
    _scene: null,

    _totalFrames: 0,
    _secondsPerFrame: 0,

    _dirtyRegion: null,

    _scheduler: null,
    _actionManager: null,

    ctor: function () {
        var self = this;

        EventTarget.call(self);
        self._lastUpdate = Date.now();
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function () {
            self._lastUpdate = Date.now();
        });
    },

    init: function () {
        // scenes
        this._oldAnimationInterval = this._animationInterval = 1.0 / cc.defaultFPS;
        this._scenesStack = [];
        // Set default projection (3D)
        this._projection = cc.Director.PROJECTION_DEFAULT;
        // projection delegate if "Custom" projection is used
        this._projectionDelegate = null;

        // FPS
        this._totalFrames = 0;
        this._lastUpdate = Date.now();

        //Paused?
        this._paused = false;

        //purge?
        this._purgeDirectorInNextLoop = false;

        this._winSizeInPoints = cc.size(0, 0);

        this._openGLView = null;
        this._contentScaleFactor = 1.0;

        // Scheduler for user registration update
        this._scheduler = new cc.Scheduler();

        // Action manager
        if(cc.ActionManager){
            this._actionManager = new cc.ActionManager();
            this._scheduler.scheduleUpdate(this._actionManager, cc.Scheduler.PRIORITY_SYSTEM, false);
        }else{
            this._actionManager = null;
        }

        this.sharedInit();

        return true;
    },

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
     * calculates delta time since last time it was called
     */
    calculateDeltaTime: function () {
        var now = Date.now();

        // new delta time.
        if (this._nextDeltaTimeZero) {
            this._deltaTime = 0;
            this._nextDeltaTimeZero = false;
        } else {
            this._deltaTime = (now - this._lastUpdate) / 1000;
        }

        if ((cc.game.config[cc.game.CONFIG_KEY.debugMode] > 0) && (this._deltaTime > 0.2))
            this._deltaTime = 1 / 60.0;

        this._lastUpdate = now;
    },

    /**
     * Converts a view coordinate to an WebGL coordinate<br/>
     * Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
     * Implementation can be found in CCDirectorWebGL.
     * @method convertToGL
     * @param {Vec2} uiPoint
     * @return {Vec2}
     */
    convertToGL: null,

    /**
     * Converts an WebGL coordinate to a view coordinate<br/>
     * Useful to convert node points to window points for calls such as glScissor<br/>
     * Implementation can be found in CCDirectorWebGL.
     * @method convertToUI
     * @param {Vec2} glPoint
     * @return {Vec2}
     */
    convertToUI: null,

    engineUpdate: function (deltaTime) {
        //tick before glClear: issue #533
        this._scheduler.update(deltaTime);
    },

    _visitScene: function () {
        if (this._runningScene) {
            var renderer = cc.renderer;
            if (renderer.childrenOrderDirty) {
                renderer.clearRenderCommands();
                this._runningScene._renderCmd._curLevel = 0;                          //level start from 0;
                this._runningScene.visit();
                renderer.resetFlag();
            }
            else if (renderer.transformDirty()) {
                renderer.transform();
            }
        }
    },

    visit: function (deltaTime) {
        this.emit(cc.Director.EVENT_BEFORE_VISIT, this);

        if (this._beforeVisitScene)
            this._beforeVisitScene();

        // visit EC
        if (this._scene) {
            // clear flags
            clearFlags(this._scene);
        }

        // update the scene
        this._visitScene();

        // visit the notifications node
        if (this._notificationNode)
            this._notificationNode.visit();

        this.emit(cc.Director.EVENT_AFTER_VISIT, this);

        if (this._afterVisitScene)
            this._afterVisitScene();
    },

    render: function (deltaTime) {
        cc.g_NumberOfDraws = 0;
        cc.renderer.clear();

        cc.renderer.rendering(cc._renderContext);
        this._totalFrames++;

        this.emit(cc.Director.EVENT_AFTER_DRAW);
    },

    _beforeVisitScene: null,
    _afterVisitScene: null,

    /**
     * End the life of director in the next frame
     */
    end: function () {
        this._purgeDirectorInNextLoop = true;
    },

    /**
     * Returns the size in pixels of the surface. It could be different than the screen size.<br/>
     * High-res devices might have a higher surface size than the screen size.
     *
     * @method getContentScaleFactor
     * @return {Number}
     */
    getContentScaleFactor: function () {
        return this._contentScaleFactor;
    },

    /**
     * This object will be visited after the main scene is visited.<br/>
     * This object MUST implement the "visit" selector.<br/>
     * Useful to hook a notification object.
     *
     * @method getNotificationNode
     * @return {Node}
     */
    getNotificationNode: function () {
        return this._notificationNode;
    },

    /**
     * Returns the size of the WebGL view in points.<br/>
     * It takes into account any possible rotation (device orientation) of the window.
     *
     * @method getWinSize
     * @return {Size}
     */
    getWinSize: function () {
        return cc.size(this._winSizeInPoints);
    },

    /**
     * Returns the size of the OpenGL view in pixels.<br/>
     * It takes into account any possible rotation (device orientation) of the window.<br/>
     * On Mac winSize and winSizeInPixels return the same value.
     *
     * @method getWinSizeInPixels
     * @return {Size}
     */
    getWinSizeInPixels: function () {
        return cc.size(this._winSizeInPoints.width * this._contentScaleFactor, this._winSizeInPoints.height * this._contentScaleFactor);
    },

    /**
     * getVisibleSize/getVisibleOrigin move to CCDirectorWebGL/CCDirectorCanvas
     * getZEye move to CCDirectorWebGL
     */

    /**
     * Returns the visible size of the running scene.
     * @method getVisibleSize
     * @return {Size}
     */
    getVisibleSize: null,

    /**
     * Returns the visible origin of the running scene.
     * @method getVisibleOrigin
     * @return {Vec2}
     */
    getVisibleOrigin: null,

    /**
     * Returns the z eye, only available in WebGL mode.
     * @method getZEye
     * @return {Number}
     */
    getZEye: null,

    /**
     * Pause the director's ticker
     * @method pause
     */
    pause: function () {
        if (this._paused)
            return;

        this._oldAnimationInterval = this._animationInterval;
        // when paused, don't consume CPU
        this.setAnimationInterval(1 / 4.0);
        this._paused = true;
    },

    /**
     * Pops out a scene from the queue.<br/>
     * This scene will replace the running one.<br/>
     * The running scene will be deleted. If there are no more scenes in the stack the execution is terminated.<br/>
     * ONLY call it if there is a running scene.
     */
    popScene: function () {

        cc.assert(this._runningScene, cc._LogInfos.Director.popScene);

        this._scenesStack.pop();
        var c = this._scenesStack.length;

        if (c === 0)
            this.end();
        else {
            this._sendCleanupToScene = true;
            this._nextScene = this._scenesStack[c - 1];
        }
    },

    /**
     * Removes cached all cocos2d cached data. It will purge the cc.textureCache, cc.spriteFrameCache, cc.spriteFrameAnimationCache
     */
    purgeCachedData: function () {
        // cc.spriteFrameAnimationCache._clear();
        cc.spriteFrameCache._clear();
        cc.textureCache._clear();
    },

    /**
     * Purge the cc.director itself, including unschedule all schedule, remove all event listeners, clean up and exit the running scene, stops all animations, clear cached data.
     */
    purgeDirector: function () {
        //cleanup scheduler
        this.getScheduler().unscheduleAll();

        // Disable event dispatching
        if (cc.eventManager)
            cc.eventManager.setEnabled(false);

        // don't release the event handlers
        // They are needed in case the director is run again

        if (this._runningScene) {
            this._runningScene.onExitTransitionDidStart();
            this._runningScene.onExit();
            this._runningScene.cleanup();

            cc.renderer.clearRenderCommands();
        }

        this._runningScene = null;
        this._nextScene = null;

        // remove all objects, but don't release it.
        // runScene might be executed after 'end'.
        this._scenesStack.length = 0;

        this.stopAnimation();

        // Clear all caches
        this.purgeCachedData();

        cc.checkGLErrorDebug();
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
     * Suspends the execution of the running scene, pushing it on the stack of suspended scenes.<br/>
     * The new scene will be executed.<br/>
     * Try to avoid big stacks of pushed scenes to reduce memory allocation.<br/>
     * ONLY call it if there is a running scene.
     * @method pushScene
     * @param {Scene} scene
     */
    pushScene: function (scene) {

        cc.assert(scene, cc._LogInfos.Director.pushScene);

        this._sendCleanupToScene = false;

        this._scenesStack.push(scene);
        this._nextScene = scene;
    },

    /**
     * Run a scene. Replaces the running scene with a new one or enter the first scene.
     * The new scene will be launched immediately.
     * @method runSceneImmediate
     * @param {Scene} scene - The need run scene.
     * @param {Function} [onBeforeLoadScene] - The function invoked at the scene before loading.
     * @param {Function} [onLaunched] - The function invoked at the scene after launch.
     */
    runSceneImmediate: function (scene, onBeforeLoadScene, onLaunched) {
        var id, node, game = cc.game;
        var persistNodes = game._persistRootNodes;

        if (scene instanceof cc.Scene) {
            // ensure scene initialized
            scene._load();
        }

        // detach persist nodes
        for (id in persistNodes) {
            node = persistNodes[id];
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
            this._scene = scene;
            sgScene = scene._sgNode;

            // Re-attach or replace persist nodes
            for (id in persistNodes) {
                node = persistNodes[id];
                var existNode = scene.getChildByUuid(id);
                // Scene contains the persist node, should not reattach, should update the persist node
                if (existNode) {
                    persistNodes[id] = existNode;
                    existNode._persistNode = true;
                }
                else {
                    node.parent = scene;
                }
            }
            scene._activate();
        }

        // Run or replace rendering scene
        if ( !this._runningScene ) {
            //start scene
            this.pushScene(sgScene);
            this.startAnimation();
        }
        else {
            //replace scene
            var i = this._scenesStack.length;
            this._scenesStack[Math.max(i - 1, 0)] = sgScene;
            this._sendCleanupToScene = true;
            this._nextScene = sgScene;
        }

        if (this._nextScene) {
            this.setNextScene();
        }

        if (onLaunched) {
            onLaunched(null, scene);
        }
        cc.renderer.clear();
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
        this.once(cc.Director.EVENT_AFTER_DRAW, function () {
            this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
        });
    },

    //_replaceScene: CC_EDITOR && function (scene) {
    //    if (this._scene) {
    //        this._scene._activate(false);
    //    }
    //    if (this._runningScene) {
    //        this._runningScene.onExit();
    //    }
    //
    //    this.emit(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, scene);
    //
    //    // ensure scene initialized
    //    scene._load();
    //
    //    // replace scene
    //    this._scene = scene;
    //    this._runningScene = scene._sgNode;
    //
    //    // Activate
    //    cc.renderer.childrenOrderDirty = true;
    //    scene._sgNode.onEnter();
    //    scene._activate();
    //    this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
    //},

    //  @Scene loading section

    /**
     * Loads the scene by its name.
     * @method loadScene
     * @param {String} sceneName - The name of the scene to load.
     * @param {Function} [onLaunched] - callback, will be called after scene launched.
     * @return {Boolean} if error, return false
     */
    loadScene: function (sceneName, onLaunched, _onUnloaded) {
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
            this.emit(cc.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            this._loadingScene = sceneName;
            this._loadSceneByUuid(uuid, onLaunched, _onUnloaded);
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
                if (sceneAsset instanceof cc.SceneAsset) {
                    scene = sceneAsset.scene;
                    scene._id = sceneAsset._uuid;
                }
                else {
                    // hack for preview
                    scene = sceneAsset;
                }
                if (scene instanceof cc.Scene) {
                    self.runSceneImmediate(scene, onUnloaded, onLaunched);
                }
                else {
                    error = 'The asset ' + uuid + ' is not a scene';
                    cc.error(error);
                    scene = null;
                }
            }
            self._loadingScene = '';
            if (error && onLaunched) {
                onLaunched(error);
            }
        });
    },

    /**
     * Resume director after pause, if the current scene is not paused, nothing will happen.
     * @method resume
     */
    resume: function () {
        if (!this._paused) {
            return;
        }

        this.setAnimationInterval(this._oldAnimationInterval);
        this._lastUpdate = Date.now();
        if (!this._lastUpdate) {
            cc.log(cc._LogInfos.Director.resume);
        }

        this._paused = false;
        this._deltaTime = 0;
    },

    /**
     * The size in pixels of the surface. It could be different than the screen size.<br/>
     * High-res devices might have a higher surface size than the screen size.
     * @param {Number} scaleFactor
     */
    setContentScaleFactor: function (scaleFactor) {
        if (scaleFactor !== this._contentScaleFactor) {
            this._contentScaleFactor = scaleFactor;
        }
    },

    /**
     * Enables or disables WebGL depth test.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js
     * @method setDepthTest
     * @param {Boolean} on
     */
    setDepthTest: null,

    /**
     * set color for clear screen.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js
     * @method setClearColor
     * @param {Color} clearColor
     */
    setClearColor: null,
    /**
     * Sets the default values based on the CCConfiguration info
     */
    setDefaultValues: function () {

    },

    /**
     * Sets whether next delta time equals to zero
     * @param {Boolean} nextDeltaTimeZero
     */
    setNextDeltaTimeZero: function (nextDeltaTimeZero) {
        this._nextDeltaTimeZero = nextDeltaTimeZero;
    },

    /**
     * Starts the registered next scene
     */
    setNextScene: function () {
        var runningIsTransition = false, newIsTransition = false;
        if (cc.TransitionScene) {
            runningIsTransition = this._runningScene ? this._runningScene instanceof cc.TransitionScene : false;
            newIsTransition = this._nextScene ? this._nextScene instanceof cc.TransitionScene : false;
        }

        // If it is not a transition, call onExit/cleanup
        if (!newIsTransition) {
            var locRunningScene = this._runningScene;
            if (locRunningScene) {
                locRunningScene.onExitTransitionDidStart();
                locRunningScene.onExit();
            }

            // issue #709. the root node (scene) should receive the cleanup message too
            // otherwise it might be leaked.
            if (this._sendCleanupToScene && locRunningScene)
                locRunningScene.cleanup();
        }

        this._runningScene = this._nextScene;
        cc.renderer.childrenOrderDirty = true;

        this._nextScene = null;
        if ((!runningIsTransition) && (this._runningScene !== null)) {
            this._runningScene.onEnter();
            this._runningScene.onEnterTransitionDidFinish();
        }
    },

    /**
     * Sets Notification Node
     * @param {Node} node
     */
    setNotificationNode: function (node) {
        cc.renderer.childrenOrderDirty = true;
        if(this._notificationNode){
            this._notificationNode.onExitTransitionDidStart();
            this._notificationNode.onExit();
            this._notificationNode.cleanup();
        }
        this._notificationNode = node;
        if(!node)
            return;
        this._notificationNode.onEnter();
        this._notificationNode.onEnterTransitionDidFinish();
    },

    /**
     * Returns the cc.director delegate.
     * @return {cc.DirectorDelegate}
     */
    getDelegate: function () {
        return this._projectionDelegate;
    },

    /**
     * Sets the cc.director delegate. It shall implement the CCDirectorDelegate protocol
     * @return {cc.DirectorDelegate}
     */
    setDelegate: function (delegate) {
        this._projectionDelegate = delegate;
    },

    /**
     * Sets the view, where everything is rendered, do not call this function.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method setOpenGLView
     * @param {View} openGLView
     */
    setOpenGLView: null,

    /**
     * Sets an OpenGL projection.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method setProjection
     * @param {Number} projection
     */
    setProjection: null,

    /**
     * Update the view port.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method setViewport
     */
    setViewport: null,

    /**
     * Get the View, where everything is rendered.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method getOpenGLView
     * @return {View}
     */
    getOpenGLView: null,

    /**
     * Sets an OpenGL projection.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method getProjection
     * @return {Number}
     */
    getProjection: null,

    /**
     * Enables/disables OpenGL alpha blending.<br/>
     * Implementation can be found in CCDirectorCanvas.js/CCDirectorWebGL.js.
     * @method setAlphaBlending
     * @param {Boolean} on
     */
    setAlphaBlending: null,

    /**
     * Returns whether or not the replaced scene will receive the cleanup message.<br>
     * If the new scene is pushed, then the old scene won't receive the "cleanup" message.<br/>
     * If the new scene replaces the old one, the it will receive the "cleanup" message.
     * @method isSendCleanupToScene
     * @return {Boolean}
     */
    isSendCleanupToScene: function () {
        return this._sendCleanupToScene;
    },

    /**
     * Returns current render Scene, normally you will never need to use this API.
     * In most case, you probably want to use `getScene` instead.
     * @method getRunningScene
     * @private
     * @return {Scene}
     */
    getRunningScene: function () {
        return this._runningScene;
    },

    /**
     * Returns current logic Scene.
     * @example
     *  // This will help you to get the Canvas node in scene
     *  cc.director.getScene().getChildByName('Canvas');
     * @method getScene
     * @return {Scene}
     */
    getScene: function () {
        return this._scene;
    },

    /**
     * Returns the FPS value.
     * @method getAnimationInterval
     * @return {Number}
     */
    getAnimationInterval: function () {
        return this._animationInterval;
    },

    /**
     * Returns whether or not to display the FPS informations.
     * @method isDisplayStats
     * @return {Boolean}
     */
    isDisplayStats: function () {
        return cc.profiler ? cc.profiler.isShowingStats() : false;
    },

    /**
     * Sets whether display the FPS on the bottom-left corner.
     * @method setDisplayStats
     * @param {Boolean} displayStats
     */
    setDisplayStats: function (displayStats) {
        if (cc.profiler) {
            displayStats ? cc.profiler.showStats() : cc.profiler.hideStats();
        }
    },

    /**
     * Returns seconds per frame.
     * @method getSecondsPerFrame
     * @return {Number}
     */
    getSecondsPerFrame: function () {
        return this._secondsPerFrame;
    },

    /**
     * Returns whether next delta time equals to zero
     * @method isNextDeltaTimeZero
     * @return {Boolean}
     */
    isNextDeltaTimeZero: function () {
        return this._nextDeltaTimeZero;
    },

    /**
     * Returns whether or not the Director is paused
     * @method isPaused
     * @return {Boolean}
     */
    isPaused: function () {
        return this._paused;
    },

    /**
     * Returns how many frames were called since the director started
     * @method getTotalFrames
     * @return {Number}
     */
    getTotalFrames: function () {
        return this._totalFrames;
    },

    /**
     * Pops out all scenes from the queue until the root scene in the queue. <br/>
     * This scene will replace the running one.  <br/>
     * Internally it will call "popToSceneStackLevel(1)".
     */
    popToRootScene: function () {
        this.popToSceneStackLevel(1);
    },

    /**
     * Pops out all scenes from the queue until it reaches "level".                             <br/>
     * If level is 0, it will end the director.                                                 <br/>
     * If level is 1, it will pop all scenes until it reaches to root scene.                    <br/>
     * If level is <= than the current stack level, it won't do anything.
     * @param {Number} level
     */
    popToSceneStackLevel: function (level) {
        cc.assert(this._runningScene, cc._LogInfos.Director.popToSceneStackLevel_2);

        var locScenesStack = this._scenesStack;
        var c = locScenesStack.length;

        if (c === 0) {
            this.end();
            return;
        }
        // current level or lower -> nothing
        if (level > c)
            return;

        // pop stack until reaching desired level
        while (c > level) {
            var current = locScenesStack.pop();
            if (current.running) {
                current.onExitTransitionDidStart();
                current.onExit();
            }
            current.cleanup();
            c--;
        }
        this._nextScene = locScenesStack[locScenesStack.length - 1];
        this._sendCleanupToScene = false;
    },

    /**
     * Returns the cc.Scheduler associated with this director.
     * @method getScheduler
     * @return {Scheduler}
     */
    getScheduler: function () {
        return this._scheduler;
    },

    /**
     * Sets the cc.Scheduler associated with this director.
     * @method setScheduler
     * @param {Scheduler} scheduler
     */
    setScheduler: function (scheduler) {
        if (this._scheduler !== scheduler) {
            this._scheduler = scheduler;
        }
    },

    /**
     * Returns the cc.ActionManager associated with this director.
     * @method getActionManager
     * @return {ActionManager}
     */
    getActionManager: function () {
        return this._actionManager;
    },
    /**
     * Sets the cc.ActionManager associated with this director.
     * @method setActionManager
     * @param {ActionManager} actionManager
     */
    setActionManager: function (actionManager) {
        if (this._actionManager !== actionManager) {
            this._actionManager = actionManager;
        }
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
     * Returns the delta time since last frame.
     * @method getDeltaTime
     * @return {Number}
     */
    getDeltaTime: function () {
        return this._deltaTime;
    },

    _calculateMPF: function () {
        var now = Date.now();
        this._secondsPerFrame = (now - this._lastUpdate) / 1000;
    }
});

// Event target
cc.js.addon(cc.Director.prototype, EventTarget.prototype);

/**
 * The event projection changed of cc.Director
 * @event cc.Director.EVENT_PROJECTION_CHANGED
 * @param {Event} event
 * @example
 *   cc.director.on(cc.Director.EVENT_PROJECTION_CHANGED, function(event) {
 *           cc.log("Projection changed.");
 *       });
 */
cc.Director.EVENT_PROJECTION_CHANGED = "director_projection_changed";

/**
 * The event which will be triggered before loading a new scene
 * @event cc.Director.EVENT_BEFORE_SCENE_LOADING
 * @param {Event} event
 * @param {Vec2} event.detail - The loading scene name
 */
cc.Director.EVENT_BEFORE_SCENE_LOADING = "director_before_scene_loading";

/*
 * The event which will be triggered before launching a new scene
 * @event cc.Director.EVENT_BEFORE_SCENE_LAUNCH
 * @param {Event} event
 * @param {Vec2} event.detail - New scene which will be launched
 */
cc.Director.EVENT_BEFORE_SCENE_LAUNCH = "director_before_scene_launch";

/**
 * The event which will be triggered after launching a new scene
 * @event cc.Director.EVENT_AFTER_SCENE_LAUNCH
 * @param {Event} event
 * @param {Vec2} event.detail - New scene which is launched
 */
cc.Director.EVENT_AFTER_SCENE_LAUNCH = "director_after_scene_launch";

/**
 * The event which will be triggered at the beginning of every frame
 * @event cc.Director.EVENT_BEFORE_UPDATE
 * @param {Event} event
 */
cc.Director.EVENT_BEFORE_UPDATE = "director_before_update";

/**
 * The event which will be triggered after components update
 * @event cc.Director.EVENT_COMPONENT_UPDATE
 * @param {Event} event
 * @param {Vec2} event.detail - The delta time from last frame
 */
cc.Director.EVENT_COMPONENT_UPDATE = "director_component_update";

/**
 * The event which will be triggered after components late update
 * @event cc.Director.EVENT_COMPONENT_LATE_UPDATE
 * @param {Event} event
 * @param {Vec2} event.detail - The delta time from last frame
 */
cc.Director.EVENT_COMPONENT_LATE_UPDATE = "director_component_late_update";

/**
 * The event which will be triggered after engine and components update logic
 * @event cc.Director.EVENT_AFTER_UPDATE
 * @param {Event} event
 */
cc.Director.EVENT_AFTER_UPDATE = "director_after_update";

/**
 * The event which will be triggered before visiting the rendering scene graph
 * @event cc.Director.EVENT_BEFORE_VISIT
 * @param {Event} event
 */
cc.Director.EVENT_BEFORE_VISIT = "director_before_visit";

/**
 * The event which will be triggered after visiting the rendering scene graph,
 * the render queue is ready but not rendered at this point
 * @event cc.Director.EVENT_AFTER_VISIT
 * @param {Event} event
 */
cc.Director.EVENT_AFTER_VISIT = "director_after_visit";

/**
 * The event which will be triggered after the rendering process
 * @event cc.Director.EVENT_AFTER_DRAW
 * @param {Event} event
 */
cc.Director.EVENT_AFTER_DRAW = "director_after_draw";

/***************************************************
 * implementation of DisplayLinkDirector
 **************************************************/
cc.DisplayLinkDirector = cc.Director.extend(/** @lends cc.Director# */{
    invalid: false,

    /**
     * Starts Animation
     */
    startAnimation: function () {
        this._nextDeltaTimeZero = true;
        this.invalid = false;
    },

    /**
     * Run main loop of director
     */
    mainLoop: CC_EDITOR ? function (deltaTime, updateAnimate) {
        if (!this._paused) {
            this.emit(cc.Director.EVENT_BEFORE_UPDATE);
            this.emit(cc.Director.EVENT_COMPONENT_UPDATE, deltaTime);

            if (updateAnimate) {
                cc.director.engineUpdate(deltaTime);
            }

            this.emit(cc.Director.EVENT_COMPONENT_LATE_UPDATE, deltaTime);
            this.emit(cc.Director.EVENT_AFTER_UPDATE);
        }

        this.visit();
        this.render();
    } : function () {
        if (this._purgeDirectorInNextLoop) {
            this._purgeDirectorInNextLoop = false;
            this.purgeDirector();
        }
        else if (!this.invalid) {
            // calculate "global" dt
            this.calculateDeltaTime();

            if (!this._paused) {
                // Call start for new added components
                this.emit(cc.Director.EVENT_BEFORE_UPDATE);
                // Update for components
                this.emit(cc.Director.EVENT_COMPONENT_UPDATE, this._deltaTime);
                // Engine update with scheduler
                this.engineUpdate(this._deltaTime);
                // Late update for components
                this.emit(cc.Director.EVENT_COMPONENT_LATE_UPDATE, this._deltaTime);
                // User can use this event to do things after update
                this.emit(cc.Director.EVENT_AFTER_UPDATE);
                // Destroy entities that have been removed recently
                cc.Object._deferredDestroy();
            }

            /* to avoid flickr, nextScene MUST be here: after tick and before draw.
             XXX: Which bug is this one. It seems that it can't be reproduced with v0.9 */
            if (this._nextScene) {
                this.setNextScene();
            }

            this.visit(this._deltaTime);
            this.render(this._deltaTime);

            this._calculateMPF();
        }
    },

    /**
     * Stops animation
     */
    stopAnimation: function () {
        this.invalid = true;
    },

    /**
     * Sets animation interval
     * @param {Number} value - The animation interval desired.
     */
    setAnimationInterval: function (value) {
        this._animationInterval = value;
        if (!this.invalid) {
            this.stopAnimation();
            this.startAnimation();
        }
    }
});

cc.Director.sharedDirector = null;
cc.Director.firstUseDirector = true;

cc.Director._getInstance = function () {
    if (cc.Director.firstUseDirector) {
        cc.Director.firstUseDirector = false;
        cc.Director.sharedDirector = new cc.DisplayLinkDirector();
        cc.Director.sharedDirector.init();
    }
    return cc.Director.sharedDirector;
};

/**
 * Default fps is 60
 * @type {Number}
 */
cc.defaultFPS = 60;

//Possible OpenGL projections used by director
/**
 * Constant for 2D projection (orthogonal projection)
 * @constant
 * @type {Number}
 */
cc.Director.PROJECTION_2D = 0;

/**
 * Constant for 3D projection with a fovy=60, znear=0.5f and zfar=1500.
 * @constant
 * @type {Number}
 */
cc.Director.PROJECTION_3D = 1;

/**
 * Constant for custom projection, if cc.Director's projection set to it, it calls "updateProjection" on the projection delegate.
 * @constant
 * @type {Number}
 */
cc.Director.PROJECTION_CUSTOM = 3;

/**
 * Constant for default projection of cc.Director, default projection is 3D projection
 * @constant
 * @type {Number}
 */
cc.Director.PROJECTION_DEFAULT = cc.Director.PROJECTION_3D;

// clear dirtyFlags for EC
function clearFlags (node) {
    var children = node._children;
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        child._dirtyFlags = 0;
        clearFlags(child);
    }
}
