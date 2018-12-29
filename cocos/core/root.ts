import { Scene } from "../renderer/scene/scene";
import { RenderView, RenderViewInfo } from "../renderer/pipeline/render-view";
import { GFXDevice } from "../renderer/gfx/gfx-device";
import { GFXWindow, GFXWindowInfo } from "../renderer/gfx/gfx-window";
import { RenderPipeline } from "../renderer/pipeline/render-pipeline";
import { ForwardPipeline } from "../renderer/pipeline/forward/forward-pipeline";

export interface RootInfo {
};

export class Root {

    constructor() {
    }

    public initialize(info: RootInfo): boolean {

        let pipeline = new ForwardPipeline;
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

        if (this._pipeline) {
            for (let i = 0; i < this._views.length; ++i) {
                this._pipeline.render(this._views[i]);
            }
        }

        if (this._device) {
            this._device.present();
        }
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

    public createScene(): Scene | null {
        let scene = new Scene;
        this._scenes.push(scene);
        return scene;
    }

    public destroyScene(scene: Scene) {
        for (let i = 0; i < this._scenes.length; ++i) {
            if (this._scenes[i] === scene) {
                this._scenes.splice(i);
                return;
            }
        }
    }

    public destroyScenes() {
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

    public get pipeline(): RenderPipeline | null {
        return this._pipeline;
    }

    public get scenes(): Scene[] {
        return this._scenes;
    }

    public get views(): RenderView[] {
        return this._views;
    }

    private _device: GFXDevice | null = null;
    private _windows: GFXWindow[] = [];
    private _pipeline: RenderPipeline | null = null;
    private _scenes: Scene[] = [];
    private _views: RenderView[] = [];
};
