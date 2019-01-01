import { Scene } from "../renderer/scene/scene";
import { Camera } from "../renderer/scene/camera";
import { GFXWindow } from "../gfx/window";

export interface RenderViewInfo {
    window: GFXWindow;
    priority: number;
    width: number;
    height: number;
};

export class RenderView {

    public initialize(info: RenderViewInfo): boolean {

        if (!info.window) {
            console.error("RenderViewInfo.window is null.");
            return false;
        }

        if (info.width <= 0 || info.height <= 0) {
            console.error("RenderView size is an error size.");
            return false;
        }

        this._window = info.window;
        this._priority = info.priority;
        this._width = info.width;
        this._height = info.height;

        return true;
    }

    public destroy() {
        this._window = null;
        this._priority = 0;
        this._width = 0;
        this._height = 0;
    }

    public resize(width, height) {

    }

    public attach(scene: Scene, camera: Camera) {
        this._scene = scene;
        this._camera = camera;
    }

    public detach() {
        this._scene = null;
        this._camera = null;
    }

    public get window(): GFXWindow | null {
        return this._window;
    }

    public get priority(): number {
        return this._priority;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    protected _window: GFXWindow | null = null;
    protected _priority: number = 0;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _scene: Scene | null = null;
    protected _camera: Camera | null = null;
};
