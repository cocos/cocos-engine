import { Root } from '../core/root';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer/scene/camera';

export enum RenderViewPriority {
    GENERAL = 100,
}

export interface IRenderViewInfo {
    camera: Camera;
    name: string;
    priority: number;
    isUI: boolean;
}

export class RenderView {

    public get name () {
        return this._name;
    }

    public get window () {
        return this._window;
    }

    public set window (val) {
        this._window = val;
    }

    public get priority () {
        return this._priority;
    }

    public set priority (val: number) {
        this._priority = val;
    }

    public set visibility (vis) {
        this._visibility = vis;
    }
    public get visibility () {
        return this._visibility;
    }

    public get camera () {
        return this._camera!;
    }

    public get isEnable (): boolean {
        return this._isEnable;
    }

    public get isUI (): boolean {
        return this._isUI;
    }

    public static registerCreateFunc (root: Root) {
        root._createViewFun = (_root: Root, _camera: Camera): RenderView => new RenderView(_root, _camera);
    }

    private _root: Root;
    private _name: string = '';
    private _window: GFXWindow | null = null;
    private _priority: number = 0;
    private _visibility: number = 0;
    private _camera: Camera;
    private _isEnable: boolean = true;
    private _isUI: boolean = false;

    private constructor (root: Root, camera: Camera) {
        this._root = root;
        this._camera = camera;
    }

    public initialize (info: IRenderViewInfo): boolean {

        this._name = info.name;
        this._isUI = info.isUI;
        this.priority = info.priority;

        return true;
    }

    public destroy () {
        this._window = null;
        this._priority = 0;
    }

    public resize (width, height) {

    }

    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }
}
