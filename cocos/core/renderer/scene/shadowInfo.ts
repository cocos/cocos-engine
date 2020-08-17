import { Vec2 } from '../../math';

export class ShadowInfo {

    public set shadowCameraNear (val: number) {
        this._shadowCameraNear = val;
    }
    public get shadowCameraNear () :number {
        return this._shadowCameraNear;
    }

    public set shadowCameraFar (val: number) {
        this._shadowCameraFar = val;
    }
    public get shadowCameraFar () :number {
        return this._shadowCameraFar;
    }

    public set shadowCameraFov (val: number) {
        this._shadowCameraFov = val;
    }
    public get shadowCameraFov () :number {
        return this._shadowCameraFov;
    }

    public set shadowCameraAspect (val: number) {
        this._shadowCameraAspect = val;
    }
    public get shadowCameraAspect () :number {
        return this._shadowCameraAspect;
    }

    public set shadowCameraOrthoSize (val: number) {
        this._shadowCameraOrthoSize = val;
    }
    public get shadowCameraOrthoSize () :number {
        return this._shadowCameraOrthoSize;
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
    protected _shadowCameraNear: number = 0.1;
    protected _shadowCameraFar: number = 1000.0;
    protected _shadowCameraFov: number = 45.0;
    protected _shadowCameraAspect: number = 1.0;
    protected _shadowCameraOrthoSize: number = 20.0;

    protected _shadowMapSize: Vec2 = new Vec2(512, 512);
    protected _enabled: boolean = true;

    protected static _shadowInfo: ShadowInfo|null = null;
}
