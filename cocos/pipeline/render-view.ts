import { Root } from '../core/root';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer/scene/camera';
import { RenderScene } from '../renderer/scene/render-scene';

export enum RenderViewPriority {
    GENERAL = 100,
}

export interface IRenderViewInfo {
    name: string;
    window: GFXWindow;
    priority: number;
}

export class RenderView {

    public get name (): string {
        return this._name;
    }

    public get window (): GFXWindow | null {
        return this._window;
    }

    public get priority (): number {
        return this._priority;
    }

    public set visibility (vis: number) {
        this._visiblity = vis;
    }
    public get visibility (): number {
        return this._visiblity;
    }

    public get camera (): Camera {
        return this._camera as Camera;
    }

    public get scene (): RenderScene {
        return this._scene as RenderScene;
    }

    public static registerCreateFunc (root: Root) {
        root._createViewFun = (_root: Root): RenderView => new RenderView(_root);
    }

    private _root: Root;
    private _name: string = '';
    private _window: GFXWindow | null = null;
    private _priority: number = 0;
    private _visiblity: number = 0;
    private _scene: RenderScene | null = null;
    private _camera: Camera | null = null;
    private _isAttached: boolean = false;
    private _isEnable: boolean = true;

    private constructor (root: Root) {
        this._root = root;
    }

    public initialize (info: IRenderViewInfo): boolean {

        if (!info.window) {
            console.error('RenderViewInfo.window is null.');
            return false;
        }

        this._name = info.name;
        this._window = info.window;
        this._priority = info.priority;

        return true;
    }

    public destroy () {
        this._window = null;
        this._priority = 0;
    }

    public resize (width, height) {

    }

    public attach (camera: Camera) {
        this._scene = camera.scene;
        this._camera = camera;
        this._isAttached = true;
    }

    public detach () {
        this._scene = null;
        this._camera = null;
        this._isAttached = false;
    }

    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }

    public isEnable (): boolean {
        return this._isEnable;
    }

    public isAttached (): boolean {
        return this._isAttached;
    }
}
