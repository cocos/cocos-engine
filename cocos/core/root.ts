import { GFXDevice } from '../gfx/device';
import { GFXWindow, IGFXWindowInfo } from '../gfx/window';
import { ForwardPipeline } from '../pipeline/forward/forward-pipeline';
import { RenderPipeline } from '../pipeline/render-pipeline';
import { IRenderViewInfo, RenderView } from '../pipeline/render-view';
import { IRenderSceneInfo, RenderScene } from '../renderer/scene/render-scene';
import { GUI } from '../renderer/gui/gui';

export let _createSceneFun;
export let _createViewFun;

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

    public get windows (): GFXWindow[] {
        return this._windows;
    }

    public get pipeline (): RenderPipeline {
        return this._pipeline as RenderPipeline;
    }

    public get gui (): GUI {
        return this._gui as GUI;
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
    private _pipeline: RenderPipeline | null = null;
    private _gui: GUI | null = null;
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

        const pipeline = new ForwardPipeline(this);
        if (!pipeline.initialize()) {
            return false;
        }

        this._pipeline = pipeline;

        this._gui = new GUI(this);

        return true;
    }

    public destroy () {
        this.destroyViews();
        this.destroyScenes();

        if (this._pipeline) {
            this._pipeline.destroy();
            this._pipeline = null;
        }
    }

    public frameMove (deltaTime: number) {

        this._frameTime = deltaTime;

        for (const view of this._views) {
            if (view.isEnable() && view.isAttached) {
                ( this._pipeline as RenderPipeline).render(view);
            }
        }

        ( this._device as GFXDevice).present();
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

    public createScene (info: IRenderSceneInfo): RenderScene | null {
        const scene = this._createSceneFun(this);
        if (scene.initialize(info)) {
            this._scenes.push(scene);
            return scene;
        } else {
            return null;
        }
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

    public createView (info: IRenderViewInfo): RenderView | null {
        const view = this._createViewFun(this);
        if (view.initialize(info)) {
            this._views.push(view);
            this._views.sort((a: RenderView, b: RenderView) => {
                return a.priority - b.priority;
            });
            return view;
        } else {
            return null;
        }
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
