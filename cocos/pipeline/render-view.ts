import { Root } from '../core/root';
import { GFXFramebuffer } from '../gfx/framebuffer';
import { GFXWindow } from '../gfx/window';
import { Camera } from '../renderer/scene/camera';
import { RenderFlow } from './render-flow';

export enum RenderViewPriority {
    GENERAL = 100,
}

export interface IRenderViewInfo {
    camera: Camera;
    name: string;
    priority: number;
    isUI: boolean;
    flows?: string[];
}

export interface IRenderTargetInfo {
    width?: number;
    height?: number;
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
        if (this.isUI) {
            this._priority |= 1 << 30;
        }
    }

    public set visibility (vis) {
        this._visibility = vis;
    }
    public get visibility () {
        return this._visibility;
    }

    public get camera (): Camera {
        return this._camera!;
    }

    public get isEnable (): boolean {
        return this._isEnable;
    }

    public get isUI (): boolean {
        return this._isUI;
    }

    public get flows (): RenderFlow[] {
        return this._flows;
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
    private _flows: RenderFlow[] = [];

    private constructor (root: Root, camera: Camera) {
        this._root = root;
        this._camera = camera;
    }

    public initialize (info: IRenderViewInfo): boolean {

        this._name = info.name;
        this._isUI = info.isUI;
        this.priority = info.priority;
        if (!info.flows) {
            info.flows = ['ForwardFlow', 'ToneMapFlow', 'SMAAFlow'];
        }
        const pipelineFlows = cc.director.root.pipeline.flows;
        for (const f of pipelineFlows) {
            if (info.flows.indexOf(f.name) !== -1) {
                this.flows.push(f);
            }
        }

        return true;
    }

    public destroy () {
        this._window = null;
        this._priority = 0;
    }

    public enable (isEnable: boolean) {
        this._isEnable = isEnable;
    }
}
