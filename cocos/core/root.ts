import { builtinResMgr } from '../3d/builtin';
import { GFXDevice } from '../gfx/device';
import { GFXWindow, IGFXWindowInfo } from '../gfx/window';
import { ForwardPipeline } from '../pipeline/forward/forward-pipeline';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { IRenderViewInfo, RenderView } from '../pipeline/render-view';
import { IRenderSceneInfo, RenderScene } from '../renderer/scene/render-scene';
import { UI } from '../renderer/ui/ui';

export let _createSceneFun;
export let _createViewFun;

// tslint:disable-next-line:no-empty-interface
export interface IRootInfo {
}

export interface ISceneInfo {
    name: string;
}

export class Root {

    public get device (): GFXDevice {
        return this._device;
    }

    public get mainWindow (): GFXWindow | null {
        return this._mainWindow;
    }

    public get curWindow (): GFXWindow | null {
        return this._curWindow;
    }

    public get windows (): GFXWindow[] {
        return this._windows;
    }

    public get pipeline (): RenderPipeline {
        return this._pipeline as RenderPipeline;
    }

    public get ui (): UI {
        return this._ui as UI;
    }

    public get scenes (): RenderScene[] {
        return this._scenes;
    }

    public get views (): RenderView[] {
        return this._views;
    }

    public get frameTime (): number {
        return this._frameTime;
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
    private _frameTime: number = 0;

    constructor (device: GFXDevice) {
        this._device = device;

        RenderScene.registerCreateFunc(this);
        RenderView.registerCreateFunc(this);
    }

    public initialize (info: IRootInfo): boolean {

        if (!this._device.mainWindow) {
            return false;
        }

        this._mainWindow = this._device.mainWindow;
        this._curWindow = this._mainWindow;

        const pipeline = new ForwardPipeline(this);
        if (!pipeline.initialize()) {
            this.destroy();
            return false;
        }

        this._pipeline = pipeline;

        builtinResMgr.initBuiltinRes(this._device);

        this._ui = new UI(this);
        if (!this._ui.initialize()) {
            this.destroy();
            return false;
        }

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

    public resize (width: number, height: number) {

        this._device.resize(width, height);

        for (const window of this._windows) {
            window.resize(width, height);
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

    public activeWindow (window: GFXWindow) {
        this._curWindow = window;
    }

    public frameMove (deltaTime: number) {

        this._frameTime = deltaTime;

        for (const view of this._views) {
            if (view.isEnable() && view.window === this._mainWindow) {
                this._pipeline!.render(view);
            }
        }

        this._ui!.update(deltaTime);

        this._device.present();
    }

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

    public destroyWindow (window: GFXWindow) {
        for (let i = 0; i < this._windows.length; ++i) {
            if (this._windows[i] === window) {
                window.destroy();
                this._windows.splice(i);
                return;
            }
        }
    }

    public destroyWindows () {
        for (const window of this._windows) {
            window.destroy();
        }
        this._windows = [];
    }

    public createScene (info: IRenderSceneInfo): RenderScene {
        const scene: RenderScene = this._createSceneFun(this);
        scene.initialize(info);
        this._scenes.push(scene);
        return scene;
    }

    public destroyScene (scene: RenderScene) {
        for (let i = 0; i < this._scenes.length; ++i) {
            if (this._scenes[i] === scene) {
                scene.destroy();
                this._scenes.splice(i);
                return;
            }
        }
    }

    public destroyScenes () {
        for (const scene of this._scenes) {
            scene.destroy();
        }
        this._scenes = [];
    }

    public createView (info: IRenderViewInfo): RenderView {
        const view: RenderView = this._createViewFun(this, info.camera);
        view.initialize(info);

        this._views.push(view);
        this._views.sort((a: RenderView, b: RenderView) => {
            return a.priority - b.priority;
        });

        return view;
    }

    public destroyView (view: RenderView) {
        for (let i = 0; i < this._views.length; ++i) {
            if (this._views[i] === view) {
                this._views.splice(i);
                return;
            }
        }
    }

    public destroyViews () {
        for (const view of this._views) {
            view.destroy();
        }
        this._views = [];
    }
}
