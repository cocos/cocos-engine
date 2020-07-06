/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
*/
/**
 * @category core
 */

import { ALIPAY, EDITOR, JSB, PREVIEW, RUNTIME_BASED } from 'internal:constants';
import AssetLibrary from './assets/asset-library';
import { EventTarget } from './event/event-target';
import { WebGLGFXDevice } from './gfx/webgl/webgl-device';
import { WebGL2GFXDevice } from './gfx/webgl2/webgl2-device';
import { ForwardPipeline, RenderPipeline } from './pipeline';
import * as debug from './platform/debug';
import inputManager from './platform/event-manager/input-manager';
import { GFXDevice } from './gfx';
import { sys } from './platform/sys';
import { macro } from './platform/macro';
import { ICustomJointTextureLayout } from './renderer';
import { legacyCC } from './global-exports';

/**
 * @zh
 * AssetLibrary 配置。
 * @en
 * AssetLibrary configuration.
 */
export interface IAssetOptions {
    /**
     * @zh
     * 导入 Library 的资源根目录（相对于构建目录）
     * @en
     * The root path (relative to the build destination folder) of the imported library assets
     */
    libraryPath: string;
    /**
     * @zh
     * RawAssets 类资源的根目录前缀（相对于构建目录），
     * 这个路径尾部和 "assets" 拼接后就是完整路径
     * @en
     * The prefix of the root path (relative to the build destination folder) of the raw assets,
     * This will be joint with "assets" to form the complete path
     */
    rawAssetsBase: string;
    /**
     * @zh
     * RawAssets 列表，从 Settings 中获取
     * @en
     * The list of raw assets, normally retrieved from Settings
     */
    rawAssets: object;
    /**
     * @zh
     * 合并后的资源合集列表
     * @en
     * The list of asset packs
     */
    packedAssets?: object;
    /**
     * @zh
     * 资源及其 md5 前缀关系
     * @en
     * The map of assets and their md5 prefix
     */
    md5AssetsMap?: object;
    /**
     * @zh
     * 子包列表
     * @en
     * The list of sub packages
     */
    subPackages?: [];
}

interface ISceneInfo {
    url: string;
    uuid: string;
}

/**
 * @zh
 * 游戏配置。
 * @en
 * Game configuration.
 */
export interface IGameConfig {
    /**
     * @zh
     * 设置 debug 模式，在浏览器中这个选项会被忽略。
     * 各种设置选项的意义：
     *  - 0 - 没有消息被打印出来。
     *  - 1 - cc.error，cc.assert，cc.warn，cc.log 将打印在 console 中。
     *  - 2 - cc.error，cc.assert，cc.warn 将打印在 console 中。
     *  - 3 - cc.error，cc.assert 将打印在 console 中。
     *  - 4 - cc.error，cc.assert，cc.warn，cc.log 将打印在 canvas 中（仅适用于 web 端）。
     *  - 5 - cc.error，cc.assert，cc.warn 将打印在 canvas 中（仅适用于 web 端）。
     *  - 6 - cc.error，cc.assert 将打印在 canvas 中（仅适用于 web 端）。
     * @en
     * Set debug mode, only valid in non-browser environment.
     * Possible values:
     * 0 - No message will be printed.
     * 1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
     * 2 - cc.error, cc.assert, cc.warn will print in console.
     * 3 - cc.error, cc.assert will print in console.
     * 4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
     * 5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
     * 6 - cc.error, cc.assert will print on canvas, available only on web.
     */
    debugMode?: 0 | 1 | 2 | 3 | 4 | 5 | 6;

    /**
     * @zh
     * 当 showFPS 为 true 的时候界面的左下角将显示 fps 的信息，否则被隐藏。
     * @en
     * Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.
     */
    showFPS?: boolean;

    /**
     * @zh
     * 暴露类名让 Chrome DevTools 可以识别，如果开启会稍稍降低类的创建过程的性能，但对对象构造没有影响。
     * @en
     * Expose class name to chrome debug tools, the class intantiate performance is a little bit slower when exposed.
     */
    exposeClassName?: boolean;

    /**
     * @zh
     * 设置想要的帧率你的游戏，但真正的FPS取决于你的游戏实现和运行环境。
     * @en
     * Set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.
     */
    frameRate?: number;

    /**
     * @zh
     * Web 页面上的 Canvas Element ID，仅适用于 web 端。
     * @en
     * Sets the id of your canvas element on the web page, it's useful only on web.
     */
    id?: string | HTMLElement;

    /**
     * @zh
     * 渲染模式。
     * 设置渲染器类型，仅适用于 web 端：
     * - 0 - 通过引擎自动选择。
     * - 1 - 强制使用 canvas 渲染。
     * - 2 - 强制使用 WebGL 渲染，但是在部分 Android 浏览器中这个选项会被忽略。
     * @en
     * Sets the renderer type, only useful on web:
     * - 0 - Automatically chosen by engine.
     * - 1 - Forced to use canvas renderer.
     * - 2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers.
     */
    renderMode?: 0 | 1 | 2;

    /**
     * @zh
     * 当前包中可用场景。
     * @en
     * Include available scenes in the current bundle.
     */
    scenes?: ISceneInfo[];

    /**
     * For internal use.
     */
    registerSystemEvent?: boolean;

    /**
     * For internal use.
     */
    collisionMatrix?: never[];

    /**
     * For internal use.
     */
    groupList?: any[];

    /**
     * For internal use.
     */
    jsList?: string[];

    /**
     * Render pipeline resources
     */
    renderPipeline?: string;

    /**
     * Asset library initialization options
     */
    assetOptions?: IAssetOptions;

    /**
     * GPU instancing options
     */
    customJointTextureLayouts?: ICustomJointTextureLayout[];
}

/**
 * @en An object to boot the game.
 * @zh 包含游戏主体信息并负责驱动游戏的游戏对象。
 * @class game
 * @static
 */
export class Game extends EventTarget {
    /**
     * @en Event triggered when game hide to background.<br>
     * Please note that this event is not 100% guaranteed to be fired on Web platform,<br>
     * on native platforms, it corresponds to enter background event, os status bar or notification center may not trigger this event.
     * @zh 游戏进入后台时触发的事件。<br>
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。<br>
     * 在原生平台，它对应的是应用被切换到后台事件，下拉菜单和上拉状态栏等不一定会触发这个事件，这取决于系统行为。
     * @property EVENT_HIDE
     * @example
     * ```typescript
     * cc.game.on(Game.EVENT_HIDE, function () {
     *     cc.audioEngine.pauseMusic();
     *     cc.audioEngine.pauseAllEffects();
     * });
     * ```
     */
    public static EVENT_HIDE: string = 'game_on_hide';

    /**
     * @en Event triggered when game back to foreground<br>
     * Please note that this event is not 100% guaranteed to be fired on Web platform,<br>
     * on native platforms, it corresponds to enter foreground event.
     * @zh 游戏进入前台运行时触发的事件。<br>
     * 请注意，在 WEB 平台，这个事件不一定会 100% 触发，这完全取决于浏览器的回调行为。<br>
     * 在原生平台，它对应的是应用被切换到前台事件。
     * @property EVENT_SHOW
     * @constant
     */
    public static EVENT_SHOW: string = 'game_on_show';

    /**
     * @en Event triggered after game inited, at this point all engine objects and game scripts are loaded
     * @zh 游戏启动后的触发事件，此时加载所有的引擎对象和游戏脚本。
     * @property EVENT_GAME_INITED
     * @constant
     */
    public static EVENT_GAME_INITED: string = 'game_inited';

    /**
     * @en Event triggered after engine inited, at this point you will be able to use all engine classes.<br>
     * It was defined as EVENT_RENDERER_INITED in cocos creator v1.x and renamed in v2.0.
     * In cocos creator 3d, EVENT_RENDERER_INITED is a new event, look up define for details.
     * @zh 在引擎初始化之后触发的事件，此时您能够使用引擎所有的类。<br>
     * 它在 cocos creator v1.x 版本中名字为 EVENT_RENDERER_INITED ,在 v2.0 版本中更名为 EVENT_ENGINE_INITED
     * 并在 cocos creator 3d 版本中将 EVENT_RENDERER_INITED 用作为渲染器初始化的事件。
     * @property EVENT_ENGINE_INITED
     * @constant
     */
    public static EVENT_ENGINE_INITED: string = 'engine_inited';

    /**
     * @en Event triggered after renderer inited, at this point you will be able to use all gfx renderer feature.<br>
     * @zh 在渲染器初始化之后触发的事件，此事件在 EVENT_ENGINE_INITED 之前触发，此时开始可使用 gfx 渲染框架。
     * @property EVENT_RENDERER_INITED
     * @readonly
     */
    public static readonly EVENT_RENDERER_INITED: string = 'renderer_inited';

    /**
     * @en Web Canvas 2d API as renderer backend.
     * @zh 使用 Web Canvas 2d API 作为渲染器后端。
     * @property RENDER_TYPE_CANVAS
     * @constant
     */
    public static RENDER_TYPE_CANVAS: number = 0;
    /**
     * @en WebGL API as renderer backend.
     * @zh 使用 WebGL API 作为渲染器后端。
     * @property RENDER_TYPE_WEBGL
     * @constant
     */
    public static RENDER_TYPE_WEBGL: number = 1;
    /**
     * @en OpenGL API as renderer backend.
     * @zh 使用 OpenGL API 作为渲染器后端。
     * @property RENDER_TYPE_OPENGL
     * @constant
     */
    public static RENDER_TYPE_OPENGL: number = 2;

    /**
     * @en The outer frame of the game canvas; parent of game container.
     * @zh 游戏画布的外框，container 的父容器。
     * @property frame
     */
    public frame: Object | null = null;
    /**
     * @en The container of game canvas.
     * @zh 游戏画布的容器。
     * @property container
     */
    public container: HTMLDivElement | null = null;
    /**
     * @en The canvas of the game.
     * @zh 游戏的画布。
     * @property canvas
     */
    public canvas: HTMLCanvasElement | null = null;

    /**
     * @en The renderer backend of the game.
     * @zh 游戏的渲染器类型。
     * @property renderType
     */
    public renderType: number = -1;

    public eventTargetOn = super.on;
    public eventTargetOnce = super.once;

    /**
     * @en
     * The current game configuration,
     * please be noticed any modification directly on this object after the game initialization won't take effect.
     * @zh
     * 当前的游戏配置
     * 注意：请不要直接修改这个对象，它不会有任何效果。
     * @property config
     */
    public config: IGameConfig = {};

    /**
     * @en Callback when the scripts of engine have been load.
     * @zh 当引擎完成启动后的回调函数。
     * @method onStart
     */
    public onStart: Function | null = null;

    /**
     * @en Indicates whether the engine has inited
     * @zh 引擎是否以完成初始化
     */
    public get inited () {
        return this._inited;
    }

    public _persistRootNodes = {};

    // states
    public _paused: boolean = true; // whether the game is paused
    public _configLoaded: boolean = false; // whether config loaded
    public _isCloning: boolean = false;    // deserializing or instantiating
    public _inited: boolean = false; // whether the engine has inited
    public _rendererInitialized: boolean = false;

    public _gfxDevice: GFXDevice | null = null;

    public _intervalId: number | null = null; // interval target of main

    public _lastTime: Date | null = null;
    public _frameTime: number | null = null;

    // Scenes list
    public _sceneInfos: ISceneInfo[] = [];
    public collisionMatrix = [];
    public groupList: any[] = [];

    // @Methods

    //  @Game play control
    /**
     * @en Set frame rate of game.
     * @zh 设置游戏帧率。
     * @param {Number} frameRate
     */
    public setFrameRate (frameRate: number) {
        const config = this.config;
        if (typeof frameRate !== 'number') {
            frameRate = parseInt(frameRate);
            if (isNaN(frameRate)) {
                frameRate = 60;
            }
        }
        config.frameRate = frameRate;
        this._paused = true;
        this._setAnimFrame();
        this._runMainLoop();
    }

    /**
     * @en Get frame rate set for the game, it doesn't represent the real frame rate.
     * @zh 获取设置的游戏帧率（不等同于实际帧率）。
     * @return {Number} frame rate
     */
    public getFrameRate (): number {
        return this.config.frameRate || 0;
    }

    /**
     * @en Run the game frame by frame.
     * @zh 执行一帧游戏循环。
     */
    public step () {
        legacyCC.director.mainLoop();
    }

    /**
     * @en Pause the game main loop. This will pause:<br>
     * game logic execution, rendering process, event manager, background music and all audio effects.<br>
     * This is different with cc.director.pause which only pause the game logic execution.<br>
     * @zh 暂停游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。这点和只暂停游戏逻辑的 cc.director.pause 不同。
     */
    public pause () {
        if (this._paused) { return; }
        this._paused = true;
        // Pause main loop
        if (this._intervalId) {
            window.cAF(this._intervalId);
            this._intervalId = 0;
        }
        // Because JSB platforms never actually stops the swap chain,
        // we draw some more frames here to (try to) make sure swap chain consistency
        if (JSB || RUNTIME_BASED || ALIPAY) {
            let swapbuffers = 3;
            const cb = () => {
                if (--swapbuffers > 1) {
                    window.rAF(cb);
                }
                const root = legacyCC.director.root;
                root.frameMove(0); root.device.present();
            };
            window.rAF(cb);
        }
    }

    /**
     * @en Resume the game from pause. This will resume:<br>
     * game logic execution, rendering process, event manager, background music and all audio effects.<br>
     * @zh 恢复游戏主循环。包含：游戏逻辑，渲染，事件处理，背景音乐和所有音效。
     */
    public resume () {
        if (!this._paused) { return; }
        this._paused = false;
        // Resume main loop
        this._runMainLoop();
    }

    /**
     * @en Check whether the game is paused.
     * @zh 判断游戏是否暂停。
     * @return {Boolean}
     */
    public isPaused (): boolean {
        return this._paused;
    }

    /**
     * @en Restart game.
     * @zh 重新开始游戏
     */
    public restart () {
        legacyCC.director.once(legacyCC.Director.EVENT_AFTER_DRAW, () => {
            // tslint:disable-next-line: forin
            for (const id in legacyCC.game._persistRootNodes) {
                legacyCC.game.removePersistRootNode(legacyCC.game._persistRootNodes[id]);
            }

            // Clear scene
            legacyCC.director.getScene().destroy();
            legacyCC.Object._deferredDestroy();

            legacyCC.director.purgeDirector();

            legacyCC.director.reset();
            legacyCC.game.onStart();
        });
    }

    /**
     * @en End game, it will close the game window
     * @zh 退出游戏
     */
    public end () {
        if (this._gfxDevice) {
            this._gfxDevice.destroy();
            this._gfxDevice = null;
        }

        close();
    }

    /**
     * @en
     * Register an callback of a specific event type on the game object.<br>
     * This type of event should be triggered via `emit`.<br>
     * @zh
     * 注册 game 的特定事件类型回调。这种类型的事件应该被 `emit` 触发。<br>
     *
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.<br>
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {any} [callback.arg1] arg1
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     * @return {Function} - Just returns the incoming callback so you can save the anonymous function easier.
     */
    public on (type: string, callback: Function, target?: object, once?: boolean): any {
        // Make sure EVENT_ENGINE_INITED callbacks to be invoked
        if (this._inited && type === Game.EVENT_ENGINE_INITED) {
            callback.call(target);
        }
        else {
            this.eventTargetOn(type, callback, target, once);
        }
    }

    /**
     * @en
     * Register an callback of a specific event type on the game object,<br>
     * the callback will remove itself after the first time it is triggered.<br>
     * @zh
     * 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
     *
     * @param {String} type - A string representing the event type to listen for.
     * @param {Function} callback - The callback that will be invoked when the event is dispatched.<br>
     *                              The callback is ignored if it is a duplicate (the callbacks are unique).
     * @param {any} [callback.arg1] arg1
     * @param {any} [callback.arg2] arg2
     * @param {any} [callback.arg3] arg3
     * @param {any} [callback.arg4] arg4
     * @param {any} [callback.arg5] arg5
     * @param {Object} [target] - The target (this object) to invoke the callback, can be null
     */
    // @ts-ignore
    public once (type: string, callback: Function, target?: object) {
        // Make sure EVENT_ENGINE_INITED callbacks to be invoked
        if (this._inited && type === Game.EVENT_ENGINE_INITED) {
            callback.call(target);
        }
        else {
            this.eventTargetOnce(type, callback, target);
        }
    }

    /**
     * @en Init game with configuration object.
     * @zh 使用指定的配置初始化引擎。
     * @param {Object} config - Pass configuration object
     */
    public init (config: IGameConfig) {
        this._initConfig(config);
        // Init AssetLibrary
        if (this.config.assetOptions) {
            AssetLibrary.init(this.config.assetOptions);
        }

        this._initEngine();

        if (!EDITOR) {
            this._initEvents();
        }

        if (!JSB && !EDITOR && !PREVIEW && legacyCC.internal.SplashScreen) {
            legacyCC.internal.SplashScreen.instance.main(legacyCC.director.root);
        }

        legacyCC.director.root.dataPoolManager.jointTexturePool.registerCustomTextureLayouts(config.customJointTextureLayouts);

        return this._inited;
    }

    /**
     * @en Run game with configuration object and onStart function.
     * @zh 运行游戏，并且指定引擎配置和 onStart 的回调。
     * @param {Function} onStart - function to be executed after game initialized
     */
    public run (onStart: Function | null, legacyOnStart?: Function | null) {
        if (!EDITOR) {
            this._initEvents();
        }
        if (typeof onStart !== 'function' && legacyOnStart) {
            const config: IGameConfig = this.onStart as IGameConfig;
            this.init(config);
            this.onStart = legacyOnStart;
        }
        else {
            this.onStart = onStart;
        }

        this._setAnimFrame();
        this._runMainLoop();

        // register system events
        if (!EDITOR && game.config.registerSystemEvent) {
            inputManager.registerSystemEvent(game.canvas);
        }

        const splashScreen = legacyCC.internal.SplashScreen && legacyCC.internal.SplashScreen.instance;
        const useSplash = (!JSB && !EDITOR && !PREVIEW && splashScreen);
        if (useSplash) {
            splashScreen.setOnFinish(() => {
                if (this.onStart) { this.onStart(); }
            });
        }
        // Load render pipeline if needed
        const renderPipeline = this.config.renderPipeline;
        if (renderPipeline) {
            legacyCC.loader.load({ uuid: renderPipeline }, (err, asset) => {
                // failed load renderPipeline
                if (err || !(asset instanceof RenderPipeline)) {
                    console.warn(`Failed load renderpipeline: ${renderPipeline}, engine failed to initialize, all process stopped`);
                    console.warn(err);
                }
                else {
                    this.setRenderPipeline(asset);
                }
                this._safeEmit(Game.EVENT_GAME_INITED);
                if (useSplash) {
                    splashScreen.loadFinish = true;
                }
                else {
                    if (this.onStart) { this.onStart(); }
                }
            });
        }
        else {
            this._safeEmit(Game.EVENT_GAME_INITED);
            if (useSplash) {
                splashScreen.loadFinish = true;
            }
            else {
                if (this.onStart) { this.onStart(); }
            }
        }
    }

    //  @ Persist root node section
    /**
     * @en
     * Add a persistent root node to the game, the persistent node won't be destroyed during scene transition.<br>
     * The target node must be placed in the root level of hierarchy, otherwise this API won't have any effect.
     * @zh
     * 声明常驻根节点，该节点不会被在场景切换中被销毁。<br>
     * 目标节点必须位于为层级的根节点，否则无效。
     * @param {Node} node - The node to be made persistent
     */
    public addPersistRootNode (node: { uuid: any; parent: any; _persistNode: boolean; }) {
        if (!legacyCC.Node.isNode(node) || !node.uuid) {
            debug.warnID(3800);
            return;
        }
        const id = node.uuid;
        if (!this._persistRootNodes[id]) {
            const scene = legacyCC.director._scene;
            if (legacyCC.isValid(scene)) {
                if (!node.parent) {
                    node.parent = scene;
                }
                else if (!(node.parent instanceof legacyCC.Scene)) {
                    debug.warnID(3801);
                    return;
                }
                else if (node.parent !== scene) {
                    debug.warnID(3802);
                    return;
                }
            }
            this._persistRootNodes[id] = node;
            node._persistNode = true;
        }
    }

    /**
     * @en Remove a persistent root node.
     * @zh 取消常驻根节点。
     * @param {Node} node - The node to be removed from persistent node list
     */
    public removePersistRootNode (node: { uuid: string; _persistNode: boolean; }) {
        const id = node.uuid || '';
        if (node === this._persistRootNodes[id]) {
            delete this._persistRootNodes[id];
            node._persistNode = false;
        }
    }

    /**
     * @en Check whether the node is a persistent root node.
     * @zh 检查节点是否是常驻根节点。
     * @param {Node} node - The node to be checked
     * @return {Boolean}
     */
    public isPersistRootNode (node: { _persistNode: any; }) {
        return node._persistNode;
    }

    //  @Engine loading

    private _initEngine () {
        this._initDevice();
        legacyCC.director._init();
        this.setRenderPipeline();

        // Log engine version
        console.log('Cocos Creator 3D v' + legacyCC.ENGINE_VERSION);
        this.emit(Game.EVENT_ENGINE_INITED);
        this._inited = true;
    }

    // @Methods

    //  @Time ticker section
    private _setAnimFrame () {
        this._lastTime = new Date();
        const frameRate = legacyCC.game.config.frameRate;
        this._frameTime = 1000 / frameRate;

        if (JSB) {
            jsb.setPreferredFramesPerSecond(frameRate);
            window.rAF = window.requestAnimationFrame;
            window.cAF = window.cancelAnimationFrame;
        }
        else {
            if (this._intervalId) {
                window.cAF(this._intervalId);
                this._intervalId = 0;
            }

            if (frameRate !== 60 && frameRate !== 30) {
                window.rAF = this._stTime;
                window.cAF = this._ctTime;
            }
            else {
                window.rAF = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    this._stTime;
                window.cAF = window.cancelAnimationFrame ||
                    window.cancelRequestAnimationFrame ||
                    window.msCancelRequestAnimationFrame ||
                    window.mozCancelRequestAnimationFrame ||
                    window.oCancelRequestAnimationFrame ||
                    window.webkitCancelRequestAnimationFrame ||
                    window.msCancelAnimationFrame ||
                    window.mozCancelAnimationFrame ||
                    window.webkitCancelAnimationFrame ||
                    window.ocancelAnimationFrame ||
                    this._ctTime;
            }
        }
    }
    private _stTime (callback) {
        const currTime = new Date().getTime();
        const timeToCall = Math.max(0, legacyCC.game._frameTime - (currTime - legacyCC.game._lastTime));
        const id = window.setTimeout(callback, timeToCall);
        legacyCC.game._lastTime = currTime + timeToCall;
        return id;
    }
    private _ctTime (id: number | undefined) {
        window.clearTimeout(id);
    }
    // Run game.
    private _runMainLoop () {
        let callback: FrameRequestCallback;
        const config = this.config;
        const director = legacyCC.director;
        let skip: boolean = true;
        const frameRate = config.frameRate;

        debug.setDisplayStats(!!config.showFPS);

        director.startAnimation();

        callback = (time: number) => {
            if (this._paused) { return; }
            this._intervalId = window.rAF(callback);
            if (!JSB && frameRate === 30) {
                skip = !skip;
                if (skip) {
                    return;
                }
            }
            director.mainLoop(time);
        };

        if (this._intervalId) {
            window.cAF(this._intervalId);
            this._intervalId = 0;
        }

        this._intervalId = window.rAF(callback);
        this._paused = false;
    }

    // @Game loading section
    private _initConfig (config: IGameConfig) {
        // Configs adjustment
        if (typeof config.debugMode !== 'number') {
            config.debugMode = 0;
        }
        config.exposeClassName = !!config.exposeClassName;
        if (typeof config.frameRate !== 'number') {
            config.frameRate = 60;
        }
        const renderMode = config.renderMode;
        if (typeof renderMode !== 'number' || renderMode > 2 || renderMode < 0) {
            config.renderMode = 0;
        }
        if (typeof config.registerSystemEvent !== 'boolean') {
            config.registerSystemEvent = true;
        }
        config.showFPS = !!config.showFPS;

        // Scene parser
        this._sceneInfos = config.scenes || [];

        // Collide Map and Group List
        this.collisionMatrix = config.collisionMatrix || [];
        this.groupList = config.groupList || [];

        debug._resetDebugSetting(config.debugMode);

        this.config = config;
        this._configLoaded = true;
    }

    private _determineRenderType () {
        const config = this.config;
        const userRenderMode = parseInt(config.renderMode as any);

        // Determine RenderType
        this.renderType = Game.RENDER_TYPE_CANVAS;
        let supportRender = false;

        if (userRenderMode === 0) {
            if (legacyCC.sys.capabilities.opengl) {
                this.renderType = Game.RENDER_TYPE_WEBGL;
                supportRender = true;
            }
            else if (legacyCC.sys.capabilities.canvas) {
                this.renderType = Game.RENDER_TYPE_CANVAS;
                supportRender = true;
            }
        }
        else if (userRenderMode === 1 && legacyCC.sys.capabilities.canvas) {
            this.renderType = Game.RENDER_TYPE_CANVAS;
            supportRender = true;
        }
        else if (userRenderMode === 2 && legacyCC.sys.capabilities.opengl) {
            this.renderType = Game.RENDER_TYPE_WEBGL;
            supportRender = true;
        }

        if (!supportRender) {
            throw new Error(debug.getError(3820, userRenderMode));
        }
    }

    private _initDevice () {
        // Avoid setup to be called twice.
        if (this._rendererInitialized) { return; }

        this.canvas = (this.config as any).adapter.canvas;
        this.frame = (this.config as any).adapter.frame;
        this.container = (this.config as any).adapter.container;

        this._determineRenderType();

        // WebGL context created successfully
        if (this.renderType === Game.RENDER_TYPE_WEBGL) {
            const ctors: Constructor<GFXDevice>[] = [];

            if (JSB && window.gfx) {
                if (gfx.CCVKDevice) { ctors.push(gfx.CCVKDevice); }
                if (gfx.CCMTLDevice) { ctors.push(gfx.CCMTLDevice); }
                if (gfx.GLES3Device) { ctors.push(gfx.GLES3Device); }
                if (gfx.GLES2Device) { ctors.push(gfx.GLES2Device); }
            } else {
                let useWebGL2 = (!!window.WebGL2RenderingContext);
                const userAgent = window.navigator.userAgent.toLowerCase();
                if (userAgent.indexOf('safari') !== -1 && userAgent.indexOf('chrome') === -1
                    || sys.browserType === sys.BROWSER_TYPE_UC // UC browser implementation doesn't not conform to WebGL2 standard
                ) {
                    useWebGL2 = false;
                }
                if (useWebGL2 && legacyCC.WebGL2GFXDevice) {
                    ctors.push(legacyCC.WebGL2GFXDevice);
                }
                if (legacyCC.WebGLGFXDevice) {
                    ctors.push(legacyCC.WebGLGFXDevice);
                }
            }

            const opts = {
                canvasElm: this.canvas as HTMLCanvasElement,
                debug: true,
                isAntialias: EDITOR || macro.ENABLE_WEBGL_ANTIALIAS,
                devicePixelRatio: window.devicePixelRatio,
                nativeWidth: Math.floor(screen.width * window.devicePixelRatio),
                nativeHeight: Math.floor(screen.height * window.devicePixelRatio),
            };
            for (let i = 0; i < ctors.length; i++) {
                this._gfxDevice = new ctors[i]();
                if (this._gfxDevice!.initialize(opts)) { break; }
            }
        }

        if (!this._gfxDevice) {
            // todo fix here for wechat game
            console.error('can not support canvas rendering in 3D');
            this.renderType = Game.RENDER_TYPE_CANVAS;
            return;
        }

        this.canvas!.oncontextmenu = () => {
            if (!legacyCC._isContextMenuEnable) { return false; }
        };
    }

    private _initEvents () {
        const win = window;
        let hiddenPropName: string;

        if (typeof document.hidden !== 'undefined') {
            hiddenPropName = 'hidden';
        } else if (typeof document.mozHidden !== 'undefined') {
            hiddenPropName = 'mozHidden';
        } else if (typeof document.msHidden !== 'undefined') {
            hiddenPropName = 'msHidden';
        } else if (typeof document.webkitHidden !== 'undefined') {
            hiddenPropName = 'webkitHidden';
        }

        let hidden = false;

        function onHidden () {
            if (!hidden) {
                hidden = true;
                legacyCC.game.emit(Game.EVENT_HIDE);
            }
        }
        function onShown () {
            if (hidden) {
                hidden = false;
                legacyCC.game.emit(Game.EVENT_SHOW);
            }
        }

        if (hiddenPropName!) {
            const changeList = [
                'visibilitychange',
                'mozvisibilitychange',
                'msvisibilitychange',
                'webkitvisibilitychange',
                'qbrowserVisibilityChange',
            ];
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < changeList.length; i++) {
                document.addEventListener(changeList[i], (event) => {
                    let visible = document[hiddenPropName];
                    // QQ App
                    // @ts-ignore
                    visible = visible || event.hidden;
                    if (visible) {
                        onHidden();
                    }
                    else {
                        onShown();
                    }
                });
            }
        } else {
            win.addEventListener('blur', onHidden);
            win.addEventListener('focus', onShown);
        }

        if (window.navigator.userAgent.indexOf('MicroMessenger') > -1) {
            win.onfocus = onShown;
        }

        if ('onpageshow' in window && 'onpagehide' in window) {
            win.addEventListener('pagehide', onHidden);
            win.addEventListener('pageshow', onShown);
            // Taobao UIWebKit
            document.addEventListener('pagehide', onHidden);
            document.addEventListener('pageshow', onShown);
        }

        this.on(Game.EVENT_HIDE, () => {
            legacyCC.game.pause();
        });
        this.on(Game.EVENT_SHOW, () => {
            legacyCC.game.resume();
        });
    }

    private setRenderPipeline (rppl?: RenderPipeline) {
        if (!rppl) {
            rppl = new ForwardPipeline();
            rppl.initialize(ForwardPipeline.initInfo);
        }
        if (!legacyCC.director.root.setRenderPipeline(rppl)) {
            this.setRenderPipeline();
        }

        this._rendererInitialized = true;
        this._safeEmit(Game.EVENT_RENDERER_INITED);
    }

    private _safeEmit (event) {
        if (EDITOR) {
            try {
                this.emit(event);
            }
            catch (e) {
                console.warn(e);
            }
        }
        else {
            this.emit(event);
        }
    }
}

legacyCC.Game = Game;
export const game = legacyCC.game = new Game();
