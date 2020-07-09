/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
*/

/* spell-checker:words COORD, Quesada, INITED, Renerer */

/**
 * @category core
 */

import { SceneAsset } from './assets';
import System from './components/system';
import { CCObject } from './data/object';
import { EventTarget } from './event/event-target';
import { Game } from './game';
import { autoRelease } from './load-pipeline/auto-release-utils';
import { Color, size, v2, Vec2 } from './math';
import eventManager from './platform/event-manager/event-manager';
import { Root } from './root';
import { Node, Scene } from './scene-graph';
import { ComponentScheduler } from './scene-graph/component-scheduler';
import NodeActivator from './scene-graph/node-activator';
import { Scheduler } from './scheduler';
import { js } from './utils';
import { DEBUG, EDITOR, BUILD } from 'internal:constants';
import { legacyCC } from './global-exports';
import { errorID, error, logID, assertID } from './platform/debug';
import { PipelineGlobal } from './pipeline/global';

// ----------------------------------------------------------------------------------------------------------------------

/**
 * @en
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
 *      - setting the OpenGL buffer depth (default on is 0-bit)<br/>
 *      - setting the color for clear screen (default one is BLACK)<br/>
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
 * @zh
 * <p>
 *     注意：用 cc.director 代替 cc.Director。<br/>
 *     cc.director 一个管理你的游戏的逻辑流程的单例对象。<br/>
 *     由于 cc.director 是一个单例，你不需要调用任何构造函数或创建函数，<br/>
 *     使用它的标准方法是通过调用：<br/>
 *       - cc.director.methodName();
 *     <br/>
 *     它创建和处理主窗口并且管理什么时候执行场景。<br/>
 *     <br/>
 *     cc.director 还负责：<br/>
 *      - 初始化 OpenGL 环境。<br/>
 *      - 设置OpenGL像素格式。(默认是 RGB565)<br/>
 *      - 设置OpenGL缓冲区深度 (默认是 0-bit)<br/>
 *      - 设置空白场景的颜色 (默认是 黑色)<br/>
 *      - 设置投影 (默认是 3D)<br/>
 *      - 设置方向 (默认是 Portrait)<br/>
 *    <br/>
 *    cc.director 设置了 OpenGL 默认环境 <br/>
 *      - GL_TEXTURE_2D   启用。<br/>
 *      - GL_VERTEX_ARRAY 启用。<br/>
 *      - GL_COLOR_ARRAY  启用。<br/>
 *      - GL_TEXTURE_COORD_ARRAY 启用。<br/>
 * </p>
 * <p>
 *   cc.director 也同步定时器与显示器的刷新速率。
 *   <br/>
 *   特点和局限性: <br/>
 *      - 将计时器 & 渲染与显示器的刷新频率同步。<br/>
 *      - 只支持动画的间隔 1/60 1/30 & 1/15。<br/>
 * </p>
 *
 * @class Director
 * @extends EventTarget
 */
export class Director extends EventTarget {

    /**
     * @en The event which will be triggered when the singleton of Director initialized.
     * @zh Director 单例初始化时触发的事件
     * @event Director.EVENT_INIT
     */
    /**
     * @en The event which will be triggered when the singleton of Director initialized.
     * @zh Director 单例初始化时触发的事件
     * @property {String} EVENT_INIT
     * @readonly
     */
    public static readonly EVENT_INIT = 'director_init';

    /**
     * @en The event which will be triggered when the singleton of Director reset.
     * @zh Director 单例重置时触发的事件
     * @event Director.EVENT_RESET
     */
    /**
     * @en The event which will be triggered when the singleton of Director reset.
     * @zh Director 单例重置时触发的事件
     * @property {String} EVENT_RESET
     * @readonly
     */
    public static readonly EVENT_RESET = 'director_reset';

    /**
     * @en The event which will be triggered before loading a new scene.
     * @zh 加载新场景之前所触发的事件。
     * @event Director.EVENT_BEFORE_SCENE_LOADING
     * @param {String} sceneName - The loading scene name
     */
    /**
     * @en The event which will be triggered before loading a new scene.
     * @zh 加载新场景之前所触发的事件。
     * @property {String} EVENT_BEFORE_SCENE_LOADING
     * @readonly
     */
    public static readonly EVENT_BEFORE_SCENE_LOADING = 'director_before_scene_loading';

    /**
     * @en The event which will be triggered before launching a new scene.
     * @zh 运行新场景之前所触发的事件。
     * @event Director.EVENT_BEFORE_SCENE_LAUNCH
     * @param {String} sceneName - New scene which will be launched
     */
    /**
     * @en The event which will be triggered before launching a new scene.
     * @zh 运行新场景之前所触发的事件。
     * @property {String} EVENT_BEFORE_SCENE_LAUNCH
     * @readonly
     */
    public static readonly EVENT_BEFORE_SCENE_LAUNCH = 'director_before_scene_launch';

    /**
     * @en The event which will be triggered after launching a new scene.
     * @zh 运行新场景之后所触发的事件。
     * @event Director.EVENT_AFTER_SCENE_LAUNCH
     * @param {String} sceneName - New scene which is launched
     */
    /**
     * @en The event which will be triggered after launching a new scene.
     * @zh 运行新场景之后所触发的事件。
     * @property {String} EVENT_AFTER_SCENE_LAUNCH
     * @readonly
     */
    public static readonly EVENT_AFTER_SCENE_LAUNCH = 'director_after_scene_launch';

    /**
     * @en The event which will be triggered at the beginning of every frame.
     * @zh 每个帧的开始时所触发的事件。
     * @event Director.EVENT_BEFORE_UPDATE
     */
    /**
     * @en The event which will be triggered at the beginning of every frame.
     * @zh 每个帧的开始时所触发的事件。
     * @property {String} EVENT_BEFORE_UPDATE
     * @readonly
     */
    public static readonly EVENT_BEFORE_UPDATE = 'director_before_update';

    /**
     * @en The event which will be triggered after engine and components update logic.
     * @zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
     * @event Director.EVENT_AFTER_UPDATE
     */
    /**
     * @en The event which will be triggered after engine and components update logic.
     * @zh 将在引擎和组件 “update” 逻辑之后所触发的事件。
     * @property {String} EVENT_AFTER_UPDATE
     * @readonly
     */
    public static readonly EVENT_AFTER_UPDATE = 'director_after_update';

    /**
     * @en The event which will be triggered before the rendering process.
     * @zh 渲染过程之前所触发的事件。
     * @event Director.EVENT_BEFORE_DRAW
     */
    /**
     * @en The event which will be triggered before the rendering process.
     * @zh 渲染过程之前所触发的事件。
     * @property {String} EVENT_BEFORE_DRAW
     * @readonly
     */
    public static readonly EVENT_BEFORE_DRAW = 'director_before_draw';

    /**
     * @en The event which will be triggered after the rendering process.
     * @zh 渲染过程之后所触发的事件。
     * @event Director.EVENT_AFTER_DRAW
     */
    /**
     * @en The event which will be triggered after the rendering process.
     * @zh 渲染过程之后所触发的事件。
     * @property {String} EVENT_AFTER_DRAW
     * @readonly
     */
    public static readonly EVENT_AFTER_DRAW = 'director_after_draw';

    /**
     * The event which will be triggered before the physics process.<br/>
     * 物理过程之前所触发的事件。
     * @event Director.EVENT_BEFORE_PHYSICS
     * @readonly
     */
    public static readonly EVENT_BEFORE_PHYSICS = 'director_before_physics';

    /**
     * The event which will be triggered after the physics process.<br/>
     * 物理过程之后所触发的事件。
     * @event Director.EVENT_AFTER_PHYSICS
     * @readonly
     */
    public static readonly EVENT_AFTER_PHYSICS = 'director_after_physics';

    public static instance: Director;

    public _compScheduler: ComponentScheduler;
    public _nodeActivator: NodeActivator;
    private _invalid: boolean;
    private _paused: boolean;
    private _purgeDirectorInNextLoop: boolean;
    private _root: Root | null;
    private _loadingScene: string;
    private _scene: Scene | null;
    private _totalFrames: number;
    private _lastUpdate: number;
    private _deltaTime: number;
    private _scheduler: Scheduler;
    private _systems: System[];

    constructor () {
        super();

        this._invalid = false;
        // paused?
        this._paused = false;
        // purge?
        this._purgeDirectorInNextLoop = false;

        // root
        this._root = null;

        // scenes
        this._loadingScene = '';
        this._scene = null;

        // FPS
        this._totalFrames = 0;
        this._lastUpdate = 0;
        this._deltaTime = 0.0;

        // Scheduler for user registration update
        this._scheduler = new Scheduler();
        // Scheduler for life-cycle methods in component
        this._compScheduler = new ComponentScheduler();
        // Node activator
        this._nodeActivator = new NodeActivator();

        this._systems = [];

        legacyCC.game.once(Game.EVENT_RENDERER_INITED, this._initOnRendererInitialized, this);
    }

    /**
     * calculates delta time since last time it was called
     */
    public calculateDeltaTime () {
        const now = performance.now();

        this._deltaTime = (now - this._lastUpdate) / 1000;
        if (DEBUG && (this._deltaTime > 1)) {
            this._deltaTime = 1 / 60.0;
        }

        this._lastUpdate = now;
    }

    /**
     * @en
     * Converts a view coordinate to an WebGL coordinate<br/>
     * Useful to convert (multi) touches coordinates to the current layout (portrait or landscape)<br/>
     * Implementation can be found in directorWebGL.
     * @zh 将触摸点的屏幕坐标转换为 WebGL View 下的坐标。
     * @deprecated since v2.0
     */
    public convertToGL (uiPoint: Vec2) {
        const container = legacyCC.game.container;
        const view = legacyCC.view;
        const box = container.getBoundingClientRect();
        const left = box.left + window.pageXOffset - container.clientLeft;
        const top = box.top + window.pageYOffset - container.clientTop;
        const x = view._devicePixelRatio * (uiPoint.x - left);
        const y = view._devicePixelRatio * (top + box.height - uiPoint.y);
        return view._isRotated ? v2(view._viewportRect.width - y, x) : v2(x, y);
    }

    /**
     * @en
     * Converts an OpenGL coordinate to a view coordinate<br/>
     * Useful to convert node points to window points for calls such as glScissor<br/>
     * Implementation can be found in directorWebGL.
     * @zh 将触摸点的 WebGL View 坐标转换为屏幕坐标。
     * @deprecated since v2.0
     */
    public convertToUI (glPoint: Vec2) {
        const container = legacyCC.game.container;
        const view = legacyCC.view;
        const box = container.getBoundingClientRect();
        const left = box.left + window.pageXOffset - container.clientLeft;
        const top = box.top + window.pageYOffset - container.clientTop;
        const uiPoint = v2(0, 0);
        if (view._isRotated) {
            uiPoint.x = left + glPoint.y / view._devicePixelRatio;
            uiPoint.y = top + box.height - (view._viewportRect.width - glPoint.x) / view._devicePixelRatio;
        }
        else {
            uiPoint.x = left + glPoint.x * view._devicePixelRatio;
            uiPoint.y = top + box.height - glPoint.y * view._devicePixelRatio;
        }
        return uiPoint;
    }

    /**
     * End the life of director in the next frame
     */
    public end () {
        this._purgeDirectorInNextLoop = true;
    }

    /**
     * @en
     * Returns the size of the WebGL view in points.<br/>
     * It takes into account any possible rotation (device orientation) of the window.
     * @zh 获取视图的大小，以点为单位。
     * @deprecated since v2.0
     */
    public getWinSize () {
        return size(legacyCC.winSize);
    }

    /**
     * @en
     * Returns the size of the OpenGL view in pixels.<br/>
     * It takes into account any possible rotation (device orientation) of the window.<br/>
     * On Mac winSize and winSizeInPixels return the same value.
     * (The pixel here refers to the resource resolution. If you want to get the physics resolution of device, you need to use cc.view.getFrameSize())
     * @zh
     * 获取视图大小，以像素为单位（这里的像素指的是资源分辨率。
     * 如果要获取屏幕物理分辨率，需要用 cc.view.getFrameSize()）
     * @deprecated since v2.0
     */
    public getWinSizeInPixels () {
        return size(legacyCC.winSize);
    }

    /**
     * @en Pause the director's ticker, only involve the game logic execution.<br>
     * It won't pause the rendering process nor the event manager.<br>
     * If you want to pause the entire game including rendering, audio and event,<br>
     * please use cc.game.pause
     * @zh 暂停正在运行的场景，该暂停只会停止游戏逻辑执行，但是不会停止渲染和 UI 响应。<br>
     * 如果想要更彻底得暂停游戏，包含渲染，音频和事件，请使用 cc.game.pause 。
     */
    public pause () {
        if (this._paused) {
            return;
        }
        this._paused = true;
    }

    /**
     * @en Removes cached all cocos2d cached data.
     * @zh 删除cocos2d所有的缓存数据
     * @deprecated since v2.0
     */
    public purgeCachedData () {
        legacyCC.loader.releaseAll();
    }

    /**
     * @en Purge the cc.director itself, including unschedule all schedule,<br>
     * remove all event listeners, clean up and exit the running scene, stops all animations, clear cached data.
     * @zh 清除 cc.director 本身，包括停止所有的计时器，<br>
     * 移除所有的事件监听器，清理并退出当前运行的场景，停止所有动画，清理缓存数据。
     */
    public purgeDirector () {
        // cleanup scheduler
        this._scheduler.unscheduleAll();
        this._compScheduler.unscheduleAll();

        this._nodeActivator.reset();

        // Disable event dispatching
        if (eventManager) {
            eventManager.setEnabled(false);
        }

        // cc.renderer.clear();

        if (!EDITOR) {
            if (legacyCC.isValid(this._scene)) {
                this._scene!.destroy();
            }
            this._scene = null;
        }

        this.stopAnimation();

        if (this._root != null) {
            this._root.destroy();
        }
        this._root = null;

        // Clear all caches
        legacyCC.loader.releaseAll();
    }

    /**
     * @en Reset the cc.director, can be used to restart the director after purge
     * @zh 重置 cc.director，可用于在清除后重启 director
     */
    public reset () {
        this.purgeDirector();

        this.emit(Director.EVENT_RESET);

        if (eventManager) {
            eventManager.setEnabled(true);
        }

        this.startAnimation();
    }

    /**
     * @en
     * Run a scene. Replaces the running scene with a new one or enter the first scene.<br>
     * The new scene will be launched immediately.
     * @zh 运行指定场景。将正在运行的场景替换为（或重入为）新场景。新场景将立即启动。
     * @param scene - The need run scene.
     * @param onBeforeLoadScene - The function invoked at the scene before loading.
     * @param onLaunched - The function invoked at the scene after launch.
     */
    public runSceneImmediate (scene: Scene, onBeforeLoadScene?: Director.OnBeforeLoadScene, onLaunched?: Director.OnSceneLaunched) {
        assertID(scene instanceof legacyCC.Scene, 1216);

        const uuid = legacyCC.loader._getReferenceKey(scene.uuid);
        // Scene cannot be cached in loader, because it will be destroyed after switching.
        legacyCC.loader.removeItem(uuid);

        if (BUILD && DEBUG) {
            console.time('InitScene');
        }
        // @ts-ignore
        scene._load();  // ensure scene initialized
        if (BUILD && DEBUG) {
            console.timeEnd('InitScene');
        }
        // Re-attach or replace persist nodes
        if (BUILD && DEBUG) {
            console.time('AttachPersist');
        }
        const persistNodeList = Object.keys(legacyCC.game._persistRootNodes).map((x) => {
            return legacyCC.game._persistRootNodes[x];
        });
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < persistNodeList.length; i++) {
            const node = persistNodeList[i];
            node.emit(legacyCC.Node.SCENE_CHANGED_FOR_PERSISTS, scene.renderScene);
            const existNode = scene.getChildByUuid(node.uuid);
            if (existNode) {
                // scene also contains the persist node, select the old one
                const index = existNode.getSiblingIndex();
                existNode._destroyImmediate();
                scene.insertChild(node, index);
            }
            else {
                node.parent = scene;
            }
        }
        if (BUILD && DEBUG) {
            console.timeEnd('AttachPersist');
        }
        const oldScene = this._scene;
        if (!EDITOR) {
            // auto release assets
            if (BUILD && DEBUG) {
                console.time('AutoRelease');
            }
            const autoReleaseAssets = oldScene && oldScene.autoReleaseAssets && oldScene.dependAssets;
            autoRelease(autoReleaseAssets, scene.dependAssets, persistNodeList);
            if (BUILD && DEBUG) {
                console.timeEnd('AutoRelease');
            }
        }

        // unload scene
        if (BUILD && DEBUG) {
            console.time('Destroy');
        }
        if (legacyCC.isValid(oldScene)) {
            oldScene!.destroy();
        }

        this._scene = null;

        // purge destroyed nodes belongs to old scene
        CCObject._deferredDestroy();
        if (BUILD && DEBUG) { console.timeEnd('Destroy'); }

        if (onBeforeLoadScene) {
            onBeforeLoadScene();
        }
        this.emit(legacyCC.Director.EVENT_BEFORE_SCENE_LAUNCH, scene);

        // Run an Entity Scene
        this._scene = scene;

        if (BUILD && DEBUG) {
            console.time('Activate');
        }
        // @ts-ignore
        scene._activate();
        if (BUILD && DEBUG) {
            console.timeEnd('Activate');
        }
        // start scene
        if (this._root) {
            this._root.resetCumulativeTime();
        }
        this.startAnimation();

        if (onLaunched) {
            onLaunched(null, scene);
        }
        this.emit(legacyCC.Director.EVENT_AFTER_SCENE_LAUNCH, scene);
    }

    /**
     * @en
     * Run a scene. Replaces the running scene with a new one or enter the first scene.<br>
     * The new scene will be launched at the end of the current frame.<br>
     * @zh 运行指定场景。
     * @param scene - The need run scene.
     * @param onBeforeLoadScene - The function invoked at the scene before loading.
     * @param onLaunched - The function invoked at the scene after launch.
     * @private
     */
    public runScene (scene: Scene, onBeforeLoadScene?: Director.OnBeforeLoadScene, onLaunched?: Director.OnSceneLaunched) {
        assertID(scene, 1205);
        assertID(scene instanceof legacyCC.Scene, 1216);

        // ensure scene initialized
        // @ts-ignore
        scene._load();

        // Delay run / replace scene to the end of the frame
        this.once(legacyCC.Director.EVENT_AFTER_UPDATE, () => {
            this.runSceneImmediate(scene, onBeforeLoadScene, onLaunched);
        });
    }

    //  @Scene loading section

    public _getSceneUuid (key: string | number) {
        const scenes = legacyCC.game._sceneInfos;
        if (typeof key === 'string') {
            if (!key.endsWith('.scene')) {
                key += '.scene';
            }
            if (key[0] !== '/' && !key.startsWith('db://')) {
                key = '/' + key;    // 使用全名匹配
            }
            // search scene
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < scenes.length; i++) {
                const info = scenes[i];
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
                errorID(1206, key);
            }
        }
        else {
            errorID(1207, key);
        }
        return null;
    }

    /**
     * @en Loads the scene by its name.
     * @zh 通过场景名称进行加载场景。
     *
     * @param sceneName - The name of the scene to load.
     * @param onLaunched - callback, will be called after scene launched.
     * @return if error, return false
     */
    public loadScene (sceneName: string, onLaunched?: Director.OnSceneLaunched, onUnloaded?: Director.OnUnload) {
        if (this._loadingScene) {
            errorID(1208, sceneName, this._loadingScene);
            return false;
        }
        const info = this._getSceneUuid(sceneName);
        if (info) {
            const uuid = info.uuid;
            this.emit(legacyCC.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            this._loadingScene = sceneName;
            this._loadSceneByUuid(uuid, onLaunched, onUnloaded);
            return true;
        }
        else {
            errorID(1209, sceneName);
            return false;
        }
    }

    /**
     * @en
     * Pre-loads the scene to reduces loading time. You can call this method at any time you want.<br>
     * After calling this method, you still need to launch the scene by `cc.director.loadScene`.<br>
     * It will be totally fine to call `cc.director.loadScene` at any time even if the preloading is not<br>
     * yet finished, the scene will be launched after loaded automatically.
     * @zh 预加载场景，你可以在任何时候调用这个方法。
     * 调用完后，你仍然需要通过 `cc.director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。<br>
     * 就算预加载还没完成，你也可以直接调用 `cc.director.loadScene`，加载完成后场景就会启动。
     * @param sceneName 场景名称。
     * @param onLoaded 加载回调。
     */
    public preloadScene (sceneName: string, onLoaded?: Director.OnSceneLoaded): void;

    /**
     * @en
     * Pre-loads the scene to reduces loading time. You can call this method at any time you want.<br>
     * After calling this method, you still need to launch the scene by `cc.director.loadScene`.<br>
     * It will be totally fine to call `cc.director.loadScene` at any time even if the preloading is not<br>
     * yet finished, the scene will be launched after loaded automatically.
     * @zh 预加载场景，你可以在任何时候调用这个方法。
     * 调用完后，你仍然需要通过 `cc.director.loadScene` 来启动场景，因为这个方法不会执行场景加载操作。<br>
     * 就算预加载还没完成，你也可以直接调用 `cc.director.loadScene`，加载完成后场景就会启动。
     * @param sceneName 场景名称。
     * @param onProgress 加载进度回调。
     * @param onLoaded 加载回调。
     */
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    public preloadScene (sceneName: string, onProgress: Director.OnLoadSceneProgress, onLoaded: Director.OnSceneLoaded): void;

    public preloadScene (
        sceneName: string,
        arg1?: Director.OnLoadSceneProgress | Director.OnSceneLoaded,
        arg2?: Director.OnSceneLoaded) {
        let onProgress: Director.OnLoadSceneProgress | undefined;
        let onLoaded: Director.OnSceneLoaded | undefined;

        if (arg2 === undefined) {
            onLoaded = arg1 as Director.OnSceneLoaded;
            onProgress = void 0;
        } else {
            onLoaded = arg2;
            onProgress = arg1 as Director.OnLoadSceneProgress;
        }

        const info = this._getSceneUuid(sceneName);
        if (info) {
            this.emit(legacyCC.Director.EVENT_BEFORE_SCENE_LOADING, sceneName);
            legacyCC.loader.load({ uuid: info.uuid, type: 'uuid' },
                onProgress,
                (error: null | Error, asset: SceneAsset) => {
                    if (error) {
                        errorID(1210, sceneName, error.message);
                    }
                    if (onLoaded) {
                        onLoaded(error, asset);
                    }
                });
        }
        else {
            const err = 'Can not preload the scene "' + sceneName + '" because it is not in the build settings.';
            if (onLoaded) {
                onLoaded(new Error(err));
            }
            error('preloadScene: ' + err);
        }
    }

    /**
     * @en Loads the scene by its uuid.
     * @zh 通过 uuid 加载场景。
     * @param uuid 场景资源的 uuid。
     * @param doNotRun 仅加载和初始化场景，但并不运行。此参数仅在编辑器环境中生效。
     */
    public _loadSceneByUuid (uuid: string, doNotRun?: boolean): void;

    public _loadSceneByUuid (uuid: string, onLaunched?: Director.OnSceneLaunched, doNotRun?: boolean): void;

    public _loadSceneByUuid (uuid: string, onLaunched?: Director.OnSceneLaunched, onUnloaded?: Director.OnUnload, doNotRun?: boolean): void;

    public _loadSceneByUuid (
        uuid: string,
        arg1?: Director.OnSceneLaunched | boolean,
        arg2?: Director.OnUnload | boolean,
        arg3?: boolean) {
        let onLaunched: Director.OnSceneLaunched | undefined;
        let onUnloaded: Director.OnUnload | undefined;
        let doNotRun: boolean | undefined;

        if (EDITOR && typeof arg1 === 'boolean') {
            doNotRun = arg1;
            onUnloaded = arg2 as (Director.OnUnload | undefined);
        } else if (EDITOR && typeof arg2 === 'boolean') {
            doNotRun = arg2;
            onLaunched = arg1 as (Director.OnSceneLaunched | undefined);
        } else {
            onLaunched = arg1 as (Director.OnSceneLaunched | undefined);
            onUnloaded = arg2 as (Director.OnUnload | undefined);
            doNotRun = arg3;
        }

        // cc.AssetLibrary.unloadAsset(uuid);     // force reload
        console.time('LoadScene ' + uuid);
        legacyCC.AssetLibrary.loadAsset(uuid, (err, sceneAsset) => {
            console.timeEnd('LoadScene ' + uuid);
            const self = director;
            self._loadingScene = '';
            if (err) {
                err = 'Failed to load scene: ' + err;
                error(err);
            }
            else {
                if (sceneAsset instanceof legacyCC.SceneAsset) {
                    const scene = sceneAsset.scene;
                    scene._id = sceneAsset._uuid;
                    scene._name = sceneAsset._name;
                    if (EDITOR) {
                        if (!doNotRun) {
                            self.runSceneImmediate(scene, onUnloaded, onLaunched);
                        }
                        else {
                            scene._load();
                            if (onLaunched) {
                                onLaunched(null, scene);
                            }
                        }
                    }
                    else {
                        self.runSceneImmediate(scene, onUnloaded, onLaunched);
                    }
                    return;
                }
                else {
                    err = 'The asset ' + uuid + ' is not a scene';
                    error(err);
                }
            }
            if (onLaunched) {
                onLaunched(err);
            }
        });
    }

    /**
     * @en Resume game logic execution after pause, if the current scene is not paused, nothing will happen.
     * @zh 恢复暂停场景的游戏逻辑，如果当前场景没有暂停将没任何事情发生。
     */
    public resume () {
        if (!this._paused) {
            return;
        }

        this._lastUpdate = performance.now();
        if (!this._lastUpdate) {
            logID(1200);
        }

        this._paused = false;
        this._deltaTime = 0;
    }

    /**
     * @en
     * Enables or disables WebGL depth test.<br>
     * Implementation can be found in directorCanvas.js/directorWebGL.js
     * @zh 启用/禁用深度测试（在 Canvas 渲染模式下不会生效）。
     * @deprecated since v2.0
     */
    public setDepthTest (value: boolean) {
        if (!legacyCC.Camera.main) {
            return;
        }
        legacyCC.Camera.main.depth = !!value;
    }

    /**
     * @en
     * Set color for clear screen.<br>
     * (Implementation can be found in directorCanvas.js/directorWebGL.js)
     * @zh
     * 设置场景的默认擦除颜色。<br>
     * 支持全透明，但不支持透明度为中间值。要支持全透明需手工开启 cc.macro.ENABLE_TRANSPARENT_CANVAS。
     * @deprecated since v2.0
     */
    public setClearColor (clearColor: Color) {
        if (!legacyCC.Camera.main) {
            return;
        }
        legacyCC.Camera.main.backgroundColor = clearColor;
    }

    get root () {
        return this._root;
    }

    /**
     * @en Returns current logic Scene.
     * @zh 获取当前逻辑场景。
     * @deprecated Since v2.0.
     */
    public getRunningScene () {
        return this._scene;
    }

    /**
     * @en Returns current logic Scene.
     * @zh 获取当前逻辑场景。
     * @example
     * ```
     * import { director } from 'cc';
     * // This will help you to get the Canvas node in scene
     * director.getScene().getChildByName('Canvas');
     * ```
     */
    public getScene (): Scene | null {
        return this._scene;
    }

    /**
     * @en Returns the FPS value. Please use [[Game.setFrameRate]] to control animation interval.
     * @zh 获取单位帧执行时间。请使用 [[Game.setFrameRate]] 来控制游戏帧率。
     * @deprecated since v2.0.
     */
    public getAnimationInterval () {
        return 1000 / legacyCC.game.getFrameRate();
    }

    /**
     * @en Sets animation interval, this doesn't control the main loop.<br>
     * To control the game's frame rate overall, please use cc.game.setFrameRate
     * @zh 设置动画间隔，这不控制主循环。<br>
     * 要控制游戏的帧速率，请使用 cc.game.setFrameRate
     * @deprecated since v2.0
     * @param value - The animation interval desired.
     */
    public setAnimationInterval (value: number) {
        legacyCC.game.setFrameRate(Math.round(1000 / value));
    }

    /**
     * @en Returns the delta time since last frame.
     * @zh 获取上一帧的增量时间。
     */
    public getDeltaTime () {
        return this._deltaTime;
    }

    /**
     * @en Returns the current time.
     * @zh 获取当前帧的时间。
     */
    public getCurrentTime () {
        return this._lastUpdate;
    }

    /**
     * @en Returns how many frames were called since the director started.
     * @zh 获取 director 启动以来游戏运行的总帧数。
     */
    public getTotalFrames () {
        return this._totalFrames;
    }

    /**
     * @en Returns whether or not the Director is paused.
     * @zh 是否处于暂停状态。
     */
    public isPaused () {
        return this._paused;
    }

    /**
     * @en Returns the cc.Scheduler associated with this director.
     * @zh 获取和 director 相关联的 cc.Scheduler。
     */
    public getScheduler () {
        return this._scheduler;
    }

    /**
     * @en Sets the cc.Scheduler associated with this director.
     * @zh 设置和 director 相关联的 cc.Scheduler。
     */
    public setScheduler (scheduler: Scheduler) {
        if (this._scheduler !== scheduler) {
            this.unregisterSystem(this._scheduler);
            this._scheduler = scheduler;
            this.registerSystem(Scheduler.ID, scheduler, 200);
        }
    }

    /**
     * @en register a system.
     * @zh 注册一个 system。
     */
    public registerSystem (name: string, sys: System, priority: number) {
        sys.id = name;
        sys.priority = priority;
        sys.init();
        this._systems.push(sys);
        this._systems.sort(System.sortByPriority);
    }

    public unregisterSystem (sys: System) {
        js.array.fastRemove(this._systems, sys);
        this._systems.sort(System.sortByPriority);
    }

    /**
     * @en get a system.
     * @zh 获取一个 system。
     */
    public getSystem (name: string) {
        return this._systems.find((sys) => {
            return sys.id === name;
        });
    }

    /**
     * @en Returns the cc.AnimationManager associated with this director. Please use getSystem(AnimationManager.ID)
     * @zh 获取和 director 相关联的 cc.AnimationManager（动画管理器）。请使用 getSystem(AnimationManager.ID) 来替代
     * @deprecated
     */
    public getAnimationManager (): any {
        return this.getSystem(legacyCC.AnimationManager.ID);
    }

    // Loop management
    /**
     * @en Starts Animation
     * @zh 开始动画
     */
    public startAnimation () {
        this._invalid = false;
        this._lastUpdate = performance.now();
    }

    /**
     * @en Stops animation
     * @zh 停止动画
     */
    public stopAnimation () {
        this._invalid = true;
    }

    /**
     * @en Run main loop of director
     * @zh 运行主循环
     */
    public mainLoop (time: number) {
        if (this._purgeDirectorInNextLoop) {
            this._purgeDirectorInNextLoop = false;
            this.purgeDirector();
        }
        else if (!this._invalid) {
            // calculate "global" dt
            this.calculateDeltaTime();
            const dt = this._deltaTime;

            // Update
            if (!this._paused) {
                this.emit(Director.EVENT_BEFORE_UPDATE);
                // Call start for new added components
                this._compScheduler.startPhase();
                // Update for components
                this._compScheduler.updatePhase(dt);
                // Update systems
                for (let i = 0; i < this._systems.length; ++i) {
                    this._systems[i].update(dt);
                }
                // Late update for components
                this._compScheduler.lateUpdatePhase(dt);
                // User can use this event to do things after update
                this.emit(Director.EVENT_AFTER_UPDATE);
                // Destroy entities that have been removed recently
                CCObject._deferredDestroy();

                // Post update systems
                for (let i = 0; i < this._systems.length; ++i) {
                    this._systems[i].postUpdate(dt);
                }
            }

            this.emit(Director.EVENT_BEFORE_DRAW);
            this._root!.frameMove(this._deltaTime);
            this.emit(Director.EVENT_AFTER_DRAW);

            eventManager.frameUpdateListeners();
            Node.bookOfChange.clear();
            this._totalFrames++;
        }
    }

    private _initOnRendererInitialized () {
        this._totalFrames = 0;
        this._lastUpdate = performance.now();
        this._paused = false;
        this._purgeDirectorInNextLoop = false;

        // Event manager
        if (eventManager) {
            eventManager.setEnabled(true);
        }

        // Scheduler
        // TODO: have a solid organization of priority and expose to user
        this.registerSystem(Scheduler.ID, this._scheduler, 200);

        this.emit(Director.EVENT_INIT);
    }

    private _init () {
        legacyCC.loader.init(this);
        this._root = new Root(legacyCC.game._gfxDevice);
        PipelineGlobal.root = this._root;
        PipelineGlobal.device = this.root!.device;
        const rootInfo = {};
        if (!this._root.initialize(rootInfo)) {
            errorID(1217);
            return false;
        }

        return true;
    }
}

export declare namespace Director {
    export type OnBeforeLoadScene = () => void;

    export type OnUnload = () => void;

    export type OnSceneLoaded = (error: null | Error, sceneAsset?: SceneAsset) => void;

    export type OnSceneLaunched = (error: null | Error, scene?: Scene) => void;

    /**
     * @param completedCount - The number of the items that are already completed.
     * @param totalCount - The total number of the items.
     * @param item - The latest item which flow out the pipeline.
     */
    export type OnLoadSceneProgress = (completedCount: number, totalCount: number, item: any) => void;
}

legacyCC.Director = Director;

/**
 * 导演类。
 * @property director
 */
export const director: Director = Director.instance = legacyCC.director = new Director();
