import { Camera } from "../renderer/scene/camera";
import { GFXWindow } from "../gfx/window";
import { SceneManager } from "../scene/scene-manager";

export enum RenderViewPriority {
    GENERAL = 100,
};

export interface RenderViewInfo {
    name: string;
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

        this._name = info.name;
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

    public attach(camera: Camera) {
        this._sceneMgr = camera.sceneMgr;
        this._camera = camera;
        this._isAttached = true;
    }

    public detach() {
        this._sceneMgr = null;
        this._camera = null;
        this._isAttached = false;
    }

    public enable(isEnable: boolean) {
        this._isEnable = isEnable;
    }

    public isEnable() : boolean {
        return this._isEnable;
    }
    
    public isAttached() : boolean {
        return this._isAttached;
    }

    public get name(): string {
        return this._name;
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

    private _name: string = "";
    private _window: GFXWindow | null = null;
    private _priority: number = 0;
    private _width: number = 0;
    private _height: number = 0;
    private _sceneMgr: SceneManager | null = null;
    private _camera: Camera | null = null;
    private _isAttached: boolean = false;
    private _isEnable: boolean = true;
};
