import { Vec2 } from '../../math';

export class ShadowInfo {

    public set shadowCamera_Near (val: number) {
        this._shadowCamera_Near = val;
    }
    public get shadowCamera_Near () :number {
        return this._shadowCamera_Near;
    }

    public set shadowCamera_Far (val: number) {
        this._shadowCamera_Far = val;
    }
    public get shadowCamera_Far () :number {
        return this._shadowCamera_Far;
    }

    public set shadowCamera_Fov (val: number) {
        this._shadowCamera_Fov = val;
    }
    public get shadowCamera_Fov () :number {
        return this._shadowCamera_Fov;
    }

    public set shadowCamera_Aspect (val: number) {
        this._shadowCamera_Aspect = val;
    }
    public get shadowCamera_Aspect () :number {
        return this._shadowCamera_Aspect;
    }

    public set shadowCamera_OrthoSize (val: number) {
        this._shadowCamera_OrthoSize = val;
    }
    public get shadowCamera_OrthoSize () :number {
        return this._shadowCamera_OrthoSize;
    }

    public set size (val: Vec2) {
        this._shadowMapSize = val;
    }
    public get size (): Vec2 {
        return this._shadowMapSize;
    }

    public set enabled (val: boolean) {
        this._enabled = val;
    }
    public get enabled () :boolean {
        return this._enabled;
    }

    constructor () {}

    public static get shadowInfoInstance (): ShadowInfo {
        if (!this._shadowInfo) {
            this._shadowInfo = new ShadowInfo();
        }

        return this._shadowInfo;
    }

    // Define shadwoMapCamera
    protected _shadowCamera_Near: number = 0.1;
    protected _shadowCamera_Far: number = 1000.0;
    protected _shadowCamera_Fov: number = 45.0;
    protected _shadowCamera_Aspect: number = 1.0;
    protected _shadowCamera_OrthoSize: number = 20.0;

    protected _shadowMapSize: Vec2 = new Vec2(512, 512);
    protected _enabled: boolean = true;

    protected static _shadowInfo: ShadowInfo|null = null;
}