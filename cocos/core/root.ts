import { GFXWindow, GFXWindowInfo } from "../gfx/window";
import { GFXDevice } from "../gfx/device";
import { RenderView, RenderViewInfo, RenderViewPriority } from "../pipeline/render-view";
import { RenderPipeline } from "../pipeline/render-pipeline";
import { ForwardPipeline } from "../pipeline/forward/forward-pipeline";
import { RenderScene, RenderSceneInfo } from "../renderer/scene/render-scene";

export interface RootInfo {
};

export interface SceneInfo {
    name: string;
};

export class Root {

    constructor(device: GFXDevice) {
        this._device = device;
    }

    public initialize(info: RootInfo): boolean {

        if (!this._device.mainWindow) {
            return false;
        }

        this._mainWindow = this._device.mainWindow;

        let pipeline = new ForwardPipeline(this);
        if (!pipeline.initialize()) {
            return false;
        }

        this._pipeline = pipeline;

        return true;
    }

    public destroy() {
        this.destroyViews();
        this.destroyScenes();

        if (this._pipeline) {
            this._pipeline.destroy();
            this._pipeline = null;
        }
    }

    public frameMove(deltaTime: number) {

        for (let i = 0; i < this._views.length; ++i) {
            let view = this._views[i];
            if(view.isEnable() && view.isAttached) {
                (<RenderPipeline>this._pipeline).render(view);
            }
        }

        (<GFXDevice>this._device).present();
    }

    public createWindow(info: GFXWindowInfo): GFXWindow | null {
        if (this._device) {
            let window = this._device.createWindow(info);
            if (window) {
                this._windows.push(window);
                return window;
            }
        }

        return null;
    }

    public destroyWindow(window: GFXWindow) {
        for (let i = 0; i < this._windows.length; ++i) {
            if (this._windows[i] === window) {
                window.destroy();
                this._windows.splice(i);
                return;
            }
        }
    }

    public destroyWindows() {
        for (let i = 0; i < this._windows.length; ++i) {
            this._windows[i].destroy();
        }
        this._windows = [];
    }

    public createScene(info: RenderSceneInfo): RenderScene | null {
        let scene = new RenderScene;
        if(scene.initialize(info)) {
            this._scenes.push(scene);
            return scene;
        } else {
            return null;
        }
    }

    public destroyScene(scene: RenderScene) {
        for (let i = 0; i < this._scenes.length; ++i) {
            if (this._scenes[i] === scene) {
                scene.destroy();
                this._scenes.splice(i);
                return;
            }
        }
    }

    public destroyScenes() {
        for (let i = 0; i < this._scenes.length; ++i) {
            this._scenes[i].destroy();
        }
        this._scenes = [];
    }

    public createView(info: RenderViewInfo): RenderView | null {
        let view = new RenderView;
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

    public destroyView(view: RenderView) {
        for (let i = 0; i < this._views.length; ++i) {
            if (this._views[i] === view) {
                this._views.splice(i);
                return;
            }
        }
    }

    public destroyViews() {
        for (let i = 0; i < this._views.length; ++i) {
            this._views[i].destroy();
        }
        this._views = [];
    }

    public get device(): GFXDevice {
        return this._device;
    }

    public get mainWindow(): GFXWindow | null {
        return this._mainWindow;
    }

    public get pipeline(): RenderPipeline | null {
        return this._pipeline;
    }

    public get sceneManagers(): RenderScene[] {
        return this._scenes;
    }

    public get views(): RenderView[] {
        return this._views;
    }

    private _device: GFXDevice;
    private _windows: GFXWindow[] = [];
    private _mainWindow: GFXWindow | null = null;
    private _pipeline: RenderPipeline | null = null;
    private _scenes: RenderScene[] = [];
    private _views: RenderView[] = [];
};
