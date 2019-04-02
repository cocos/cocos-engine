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

export interface IRootInfo {
    enableHDR?: boolean;
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
        return this._pipeline!;
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

    public get frameCount (): number {
        return this._frameCount;
    }

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
    private _frameTime: number = 0;
    private _fpsTime: number = 0;
    private _frameCount: number = 0;
    private _fps: number = 0;

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

        builtinResMgr.initBuiltinRes(this._device);

        this._pipeline = new ForwardPipeline(this);
        if (!this._pipeline.initialize(info)) {
            this.destroy();
            return false;
        }

        this._ui = new UI(this);
        if (!this._ui.initialize()) {
            this.destroy();
            return false;
        }

        cc.view.on('canvas-resize', () => {
            this.resize(cc.game.canvas.width, cc.game.canvas.height);
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

    public resize (width: number, height: number) {

        this._device.resize(width, height);

        this._mainWindow!.resize(width, height);

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
        ++this._frameCount;
        this._fpsTime += this._frameTime;
        if (this._fpsTime > 1.0) {
            this._fps = this._frameCount;
            this._frameCount = 0;
            this._fpsTime = 0.0;
        }

        for (const view of this._views) {
            if (view.isEnable && view.window === this._mainWindow) {
                this._pipeline!.render(view);
            }
        }

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
                this._windows.splice(i, 1);
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
                this._scenes.splice(i, 1);
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
        // view.camera.resize(cc.game.canvas.width, cc.game.canvas.height);

        this._views.push(view);
        this._views.sort((a: RenderView, b: RenderView) => {
            return a.priority - b.priority;
        });

        return view;
    }

    public destroyView (view: RenderView) {
        for (let i = 0; i < this._views.length; ++i) {
            if (this._views[i] === view) {
                this._views.splice(i, 1);
                view.destroy();
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
