/**
 * @category core
 */

import { builtinResMgr } from './3d/builtin';
import { GFXDevice } from './gfx/device';
import { GFXWindow, IGFXWindowInfo } from './gfx/window';
import { Pool } from './memop';
import { RenderPipeline } from './pipeline/render-pipeline';
import { IRenderViewInfo, RenderView } from './pipeline/render-view';
import { Camera, Light, Model } from './renderer';
import { DataPoolManager } from './renderer/data-pool-manager';
import { DirectionalLight } from './renderer/scene/directional-light';
import { LightType } from './renderer/scene/light';
import { IRenderSceneInfo, RenderScene } from './renderer/scene/render-scene';
import { SphereLight } from './renderer/scene/sphere-light';
import { SpotLight } from './renderer/scene/spot-light';
import { UI } from './renderer/ui/ui';
import { legacyCC } from './global-exports';

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
    public set curWindow (window: GFXWindow | null) {
        this._curWindow = window;
    }

    public get curWindow (): GFXWindow | null {
        return this._curWindow;
    }

    /**
     * @zh
     * 临时窗口（用于数据传输）
     */
    public set tempWindow (window: GFXWindow | null) {
        this._tempWindow = window;
    }

    public get tempWindow (): GFXWindow | null {
        return this._tempWindow;
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

    /**
     * @zh
     * 每秒固定帧率
     */
    public set fixedFPS (fps: number) {
        if (fps > 0) {
            this._fixedFPS = fps;
            this._fixedFPSFrameTime = 1000.0 / fps;
        } else {
            this._fixedFPSFrameTime = 0;
        }
    }

    public get fixedFPS (): number {
        return this._fixedFPS;
    }

    public get dataPoolManager () {
        return this._dataPoolMgr;
    }

    public _createSceneFun;
    public _createViewFun;

    private _device: GFXDevice;
    private _windows: GFXWindow[] = [];
    private _mainWindow: GFXWindow | null = null;
    private _curWindow: GFXWindow | null = null;
    private _tempWindow: GFXWindow | null = null;
    private _pipeline: RenderPipeline | null = null;
    private _ui: UI | null = null;
    private _dataPoolMgr: DataPoolManager;
    private _scenes: RenderScene[] = [];
    private _views: RenderView[] = [];
    private _modelPools: Map<Function, Pool<any>> = new Map<Function, Pool<any>>();
    private _cameraPool: Pool<Camera> | null = null;
    private _lightPools: Map<Function, Pool<any>> = new Map<Function, Pool<any>>();
    private _directLightPool: Pool<DirectionalLight> | null = null;
    private _sphereLightPool: Pool<SphereLight> | null = null;
    private _spotLightPool: Pool<SpotLight> | null = null;
    private _time: number = 0;
    private _frameTime: number = 0;
    private _fpsTime: number = 0;
    private _frameCount: number = 0;
    private _fps: number = 0;
    private _fixedFPS: number = 0;
    private _fixedFPSFrameTime: number = 0;

    /**
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        this._device = device;
        this._dataPoolMgr = new DataPoolManager(device);

        RenderScene.registerCreateFunc(this);
        RenderView.registerCreateFunc(this);

        this._cameraPool = new Pool(() => new Camera(), 4);
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

        legacyCC.view.on('design-resolution-changed', () => {
            const width = legacyCC.game.canvas.width;
            const height = legacyCC.game.canvas.height;
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
        this.dataPoolManager.clear();
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

    public setRenderPipeline (rppl: RenderPipeline): boolean {
        this._pipeline = rppl;
        if (!this._pipeline.activate(this)) {
            return false;
        }
        this._ui = new UI(this);
        if (!this._ui.initialize()) {
            this.destroy();
            return false;
        }
        return true;
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

        /*
        if (this._fixedFPSFrameTime > 0) {

            const elapsed = this._frameTime * 1000.0;
            if (this._fixedFPSFrameTime > elapsed) {
                // tslint:disable-next-line: only-arrow-functions
                setTimeout(function () {}, this._fixedFPSFrameTime - elapsed);
            }
        }
        */

        ++this._frameCount;
        this._time += this._frameTime;
        this._fpsTime += this._frameTime;
        if (this._fpsTime > 1.0) {
            this._fps = this._frameCount;
            this._frameCount = 0;
            this._fpsTime = 0.0;
        }

        const views = this._views;
        for (let i = 0; i < views.length; i++) {
            const view = views[i];
            if (view.isEnable && (view.window &&
                (view.window.isOffscreen ||
                (!view.window.isOffscreen && (view.window === this._curWindow)))) && this._pipeline) {
                this._pipeline.render(view);
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
        this.sortViews();
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

    public createModel<T extends Model> (mClass: typeof Model): T {
        let p = this._modelPools.get(mClass);
        if (!p) {
            this._modelPools.set(mClass, new Pool(() => new mClass(), 10));
            p = this._modelPools.get(mClass)!;
        }
        return p.alloc();
    }

    public destroyModel (m: Model) {
        const p = this._modelPools.get(m.constructor);
        if (p) {
            p.free(m);
            m.destroy();
            if (m.scene) {
                m.scene.removeModel(m);
            }
        } else {
            console.warn(`'${m.constructor.name}'is not in the model pool and cannot be destroyed by destroyModel.`);
        }
    }

    public createCamera (): Camera {
        return this._cameraPool!.alloc();
    }

    public destroyCamera (c: Camera) {
        this._cameraPool!.free(c);
        c.destroy();
        if (c.scene) {
            c.scene.removeCamera(c);
        }
        c.isWindowSize = true;
    }

    public createLight<T extends Light> (lClass: new () => T): T {
        let l = this._lightPools.get(lClass);
        if (!l) {
            this._lightPools.set(lClass, new Pool(() => new lClass(), 4));
            l = this._lightPools.get(lClass)!;
        }
        return l.alloc();
    }

    public destroyLight (l: Light) {
        const p = this._lightPools.get(l.constructor);
        l.destroy();
        if (p) {
            p.free(l);
            if (l.scene) {
                switch (l.type) {
                    case LightType.SPHERE:
                        l.scene.removeSphereLight(l as SphereLight);
                        break;
                    case LightType.SPOT:
                        l.scene.removeSpotLight(l as SpotLight);
                        break;
                }
            }
        }
    }

    public sortViews () {
        this._views.sort((a: RenderView, b: RenderView) => {
            return a.priority - b.priority;
        });
    }
}
