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

require('./CCDirector');
require('./CCGame');
require('../kazmath');

var AutoReleaseUtils = require('./load-pipeline/auto-release-utils');

var math = cc.math;

cc.game.once(cc.game.EVENT_RENDERER_INITED, function () {

    // Do nothing if it is not 3d
    if (cc._renderType !== cc.game.RENDER_TYPE_WEBGL || !cc.game._is3D) {
        return;
    }

    cc.DisplayLinkDirector.prototype.mainLoop = CC_EDITOR ? function (deltaTime, updateAnimate) {
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

        // Render
        cc.g_NumberOfDraws = 0;

        //console.log('rendering in cc.DisplayLinkDirector.mainLoop in 3D');

        this._totalFrames++;

        this.emit(cc.Director.EVENT_AFTER_DRAW);

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

            // Render
            cc.g_NumberOfDraws = 0;
            //console.log('rendering in cc.DisplayLinkDirector.mainLoop in 3D');

            this._totalFrames++;

            this.emit(cc.Director.EVENT_AFTER_DRAW);

            this._calculateMPF();
        }
    };

    var _p = cc.Director.prototype;

    _p.setAlphaBlending = function() {
        //nothing to do
    };

    _p.setViewport = function() {
        //nothing to do
    };

    _p.setProjection = function(projection) {
        this._projection = projection;
    };

    _p.getProjection = function() {
        return this._projection;
    };

    _p.getOpenGLView = function() {
        return this._openGLView;
    };

    _p.setOpenGLView = function(openGLView) {
        var _t = this;
        // set size
        _t._winSizeInPoints.width = cc._canvas.width;      //_t._openGLView.getDesignResolutionSize();
        _t._winSizeInPoints.height = cc._canvas.height;
        _t._openGLView = openGLView || cc.view;

        // Configuration. Gather GPU info
        var conf = cc.configuration;
        conf.gatherGPUInfo();

        if (cc.eventManager)
            cc.eventManager.setEnabled(true);
    };

    _p.setNotificationNode = function() {
        //nothing to do
    };

    _p.setNextScene = function() {
        //nothing to do
    };

    _p.setClearColor = function() {
        //nothing to do
    };

    _p.setDepthTest = function() {
        //nothing to do
    };

    _p.runSceneImmediate = function (scene, onBeforeLoadScene, onLaunched) {
        var id, node, game = cc.game;
        var persistNodes = game._persistRootNodes;

        if (scene instanceof cc.Scene3D) {
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

        if (!CC_EDITOR) {
            // auto release assets
            var autoReleaseAssets = oldScene && oldScene.autoReleaseAssets && oldScene.dependAssets;
            AutoReleaseUtils.autoRelease(cc.loader, autoReleaseAssets, scene.dependAssets);
        }

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

        // Run an Entity Scene
        if (scene instanceof cc.Scene3D) {
            this._scene = scene;

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

        if (onLaunched) {
            onLaunched(null, scene);
        }
        //cc.renderer.clear();
        this.emit(cc.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
    };

    _p.runScene = function (scene, onBeforeLoadScene, onLaunched) {
        cc.assertID(scene, 1205);
        if (scene instanceof cc.Scene3D) {
            // ensure scene initialized
            scene._load();
        }

        // Delay run / replace scene to the end of the frame
        this.once(cc.Director.EVENT_AFTER_UPDATE, function () {
            this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
        });
    };

    _p.purgeDirector = function () {
        //cleanup scheduler
        this.getScheduler().unscheduleAll();

        // Disable event dispatching
        if (cc.eventManager)
            cc.eventManager.setEnabled(false);


        this.stopAnimation();

        // Clear all caches
        this.purgeCachedData();

    };

    _p.pushScene = function() {
        //nothing to do
    };

    _p.popScene = function() {
        //nothing to do
    };

    _p.getVisibleOrigin = function() {
        return this._openGLView.getVisibleOrigin();
    };

    _p.getVisibleSize = function() {
        return this._openGLView.getVisibleSize();
    };

    _p._visitScene = function () {
        if(this._scene) {
            this._scene.syncHierarchy();
            cc.renderer.render(this._scene._sgScene, this._scene._testCamera);
        }
    };

    _p.popToSceneStackLevel = function() {
        //nothing to do
    };
});
