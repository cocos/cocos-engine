/**
 * @category core
 */

import { builtinResMgr } from '../3d/builtin';
import { GFXDevice } from '../gfx/device';
import { GFXWindow, IGFXWindowInfo } from '../gfx/window';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { IRenderViewInfo, RenderView } from '../pipeline/render-view';
import { IRenderSceneInfo, RenderScene } from '../renderer/scene/render-scene';
import { UI } from '../renderer/ui/ui';

export let _createSceneFun;
export let _createViewFun;

/**
 * @zh
 * Root描述信息
 */
export interface IRootInfo {
    enableHDR?: boolean;
}

/**
 * @zh
 * 场景描述信息
 */
export interface ISceneInfo {
    name: string;
}

/**
 * @zh
 * Root类
 */
export class Root {

    /**
     * @zh
     * GFX设备
     */
    public get device (): GFXDevice {
        return this._device;
    }

    /**
     * @zh
     * 主窗口
     */
    public get mainWindow (): GFXWindow | null {
        return this._mainWindow;
    }

    /**
     * @zh
     * 当前窗口
     */
    public get curWindow (): GFXWindow | null {
        return this._curWindow;
    }

    /**
     * @zh
     * 窗口列表
     */
    public get windows (): GFXWindow[] {
        return this._windows;
    }

    /**
     * @zh
     * 渲染管线
     */
    public get pipeline (): RenderPipeline {
        return this._pipeline!;
    }

    /**
     * @zh
     * UI实例
     */
    public get ui (): UI {
        return this._ui as UI;
    }

    /**
     * @zh
     * 场景列表
     */
    public get scenes (): RenderScene[] {
        return this._scenes;
    }

    /**
     * @zh
     * 渲染视图列表
     */
    public get views (): RenderView[] {
        return this._views;
    }

    /**
     * @zh
     * 累计时间（秒）
     */
    public get cumulativeTime (): number {
        return this._time;
    }

    /**
     * @zh
     * 帧时间（秒）
     */
    public get frameTime (): number {
        return this._frameTime;
    }

    /**
     * @zh
     * 一秒内的累计帧数
     */
    public get frameCount (): number {
        return this._frameCount;
    }

    /**
     * @zh
     * 每秒帧率
     */
    public get fps (): number {
        return this._fps;
    }

    public _createSceneFun;
    public _createViewFun;

    private _device: GFXDevice;
    private _windows: GFXWindow[] = [];
    private _mainWindow: GFXWindow | null = null;
    private _curWindow: GFXWindow | null = null;
    private _pipeline: RenderPipeline | null = null;
    private _ui: UI | null = null;
    private _scenes: RenderScene[] = [];
    private _views: RenderView[] = [];
    private _time: number = 0;
    private _frameTime: number = 0;
    private _fpsTime: number = 0;
    private _frameCount: number = 0;
    private _fps: number = 0;

    /**
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        this._device = device;

        RenderScene.registerCreateFunc(this);
        RenderView.registerCreateFunc(this);
    }

    /**
     * @zh
     * 初始化函数
     * @param info Root描述信息
     */
    public initialize (info: IRootInfo): boolean {

        if (!this._device.mainWindow) {
            return false;
        }

        this._mainWindow = this._device.mainWindow;
        this._curWindow = this._mainWindow;

        builtinResMgr.initBuiltinRes(this._device);

        cc.view.on('design-resolution-changed', () => {
            const width = cc.game.canvas.width;
            const height = cc.game.canvas.height;
            this.resize(width, height);
        }, this);

        return true;
    }

    public destroy () {
        this.destroyViews();
        this.destroyScenes();

        if (this._pipeline) {
            this._pipeline.destroy();
            this._pipeline = null;
        }

        if (this._ui) {
            this._ui.destroy();
            this._ui = null;
        }

        this._curWindow = null;
        this._mainWindow = null;
    }

    /**
     * @zh
     * 重置大小
     * @param width 屏幕宽度
     * @param height 屏幕高度
     */
    public resize (width: number, height: number) {
        // const w = width / cc.view._devicePixelRatio;
        // const h = height / cc.view._devicePixelRatio;

        this._device.resize(width, height);

        this._mainWindow!.resize(width, height);

        for (const window of this._windows) {
            if (!window.isOffscreen) {
                window.resize(width, height);
            }
        }

        if (this._pipeline) {
            this._pipeline.resize(width, height);
        }

        for (const view of this._views) {
            if (view.camera.isWindowSize) {
                view.camera.resize(width, height);
            }
        }
    }

    public setRenderPipeline (rppl: RenderPipeline) {
        this._pipeline = rppl;
        this._pipeline.initialize();
        this._ui = new UI(this);
        if (!this._ui.initialize()) {
            this.destroy();
            return false;
        }
    }

    /**
     * @zh
     * 激活指定窗口为当前窗口
     * @param window GFX窗口
     */
    public activeWindow (window: GFXWindow) {
        this._curWindow = window;
    }

    /**
     * @zh
     * 重置累计时间
     */
    public resetCumulativeTime () {
        this._time = 0;
    }

    /**
     * @zh
     * 每帧执行函数
     * @param deltaTime 间隔时间
     */
    public frameMove (deltaTime: number) {

        this._frameTime = deltaTime;
        ++this._frameCount;
        this._time += this._frameTime;
        this._fpsTime += this._frameTime;
        if (this._fpsTime > 1.0) {
            this._fps = this._frameCount;
            this._frameCount = 0;
            this._fpsTime = 0.0;
        }

        for (const view of this._views) {
            if (view.isEnable && (view.window &&
                (view.window.isOffscreen ||
                (!view.window.isOffscreen && (view.window === this._curWindow))))) {
                this._pipeline!.render(view);
            }
        }

        // this._device.present();
    }

    /**
     * @zh
     * 创建窗口
     * @param info GFX窗口描述信息
     */
    public createWindow (info: IGFXWindowInfo): GFXWindow | null {
        if (this._device) {
            const window = this._device.createWindow(info);
            if (window) {
                this._windows.push(window);
                return window;
            }
        }

        return null;
    }

    /**
     * @zh
     * 销毁指定的窗口
     * @param window GFX窗口
     */
    public destroyWindow (window: GFXWindow) {
        for (let i = 0; i < this._windows.length; ++i) {
            if (this._windows[i] === window) {
                window.destroy();
                this._windows.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @zh
     * 销毁全部窗口
     */
    public destroyWindows () {
        for (const window of this._windows) {
            window.destroy();
        }
        this._windows = [];
    }

    /**
     * @zh
     * 创建渲染场景
     * @param info 渲染场景描述信息
     */
    public createScene (info: IRenderSceneInfo): RenderScene {
        const scene: RenderScene = this._createSceneFun(this);
        scene.initialize(info);
        this._scenes.push(scene);
        return scene;
    }

    /**
     * @zh
     * 销毁指定的渲染场景
     * @param scene 渲染场景
     */
    public destroyScene (scene: RenderScene) {
        for (let i = 0; i < this._scenes.length; ++i) {
            if (this._scenes[i] === scene) {
                scene.destroy();
                this._scenes.splice(i, 1);
                return;
            }
        }
    }

    /**
     * @zh
     * 销毁全部场景
     */
    public destroyScenes () {
        for (const scene of this._scenes) {
            scene.destroy();
        }
        this._scenes = [];
    }

    /**
     * @zh
     * 创建渲染视图
     * @param info 渲染视图描述信息
     */
    public createView (info: IRenderViewInfo): RenderView {
        const view: RenderView = this._createViewFun(this, info.camera);
        view.initialize(info);
        // view.camera.resize(cc.game.canvas.width, cc.game.canvas.height);

        this._views.push(view);
        this._views.sort((a: RenderView, b: RenderView) => {
            return a.priority - b.priority;
        });

        return view;
    }

    /**
     * @zh
     * 销毁指定的渲染视图
     * @param view 渲染视图
     */
    public destroyView (view: RenderView) {
        for (let i = 0; i < this._views.length; ++i) {
            if (this._views[i] === view) {
                this._views.splice(i, 1);
                view.destroy();
                return;
            }
        }
    }

    /**
     * @zh
     * 销毁全部渲染视图
     */
    public destroyViews () {
        for (const view of this._views) {
            view.destroy();
        }
        this._views = [];
    }
}
