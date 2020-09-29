import { Quat, Vec3, Vec4 } from '../../math';
import { Ambient } from './ambient';
import { Light, LightType } from './light';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class DirectionalLight extends Light {

    public set shadowRange (shadowRange: number) {
        this._shadowRange = shadowRange;
    }

    public get shadowRange () {
        return this._shadowRange;
    }

    public set shadowIntensitywRange (shadowIntensity: number) {
        this._shadowIntensity = shadowIntensity;
    }

    public get shadowIntensity () {
        return this._shadowIntensity;
    }

    public set shadowFadeDistance (shadowFadeDistance: number) {
        this._shadowFadeDistance = shadowFadeDistance;
    }

    public get shadowFadeDistance () {
        return this._shadowFadeDistance;
    }

    public set shadowDistance (shadowDistance: number) {
        this._shadowDistance = shadowDistance;
    }

    public get shadowDistance () {
        return this._shadowDistance;
    }

    public set fadeStart (fadeStart: number) {
        this._fadeStart = fadeStart;
    }

    public get fadeStart () {
        return this._fadeStart;
    }

    public set splits (splits: Vec4) {
        this._splits = splits;
    }

    public get splits () {
        return this._splits;
    }

    public set biasAutoAdjust (biasAutoAdjust: number) {
        this._biasAutoAdjust = biasAutoAdjust;
    }

    public get biasAutoAdjust () {
        return this._biasAutoAdjust;
    }

    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _illum: number = Ambient.SUN_ILLUM;

    // shadow
    private _shadowRange: number = 1000.0;
    private _shadowIntensity: number = 0.0;
    private _shadowFadeDistance: number = 0.0;
    private _shadowDistance: number = 0.0;

    // Cascaded shadow map parameters.
    private _fadeStart: number = 0.8;
    private _splits: Vec4 = new Vec4(1.0, 0.0, 0.0, 0.0);
    private _biasAutoAdjust: number = 1.0;

    set direction (dir: Vec3) {
        this._dir = dir;
        Vec3.normalize(this._dir, this._dir);
    }

    get direction (): Vec3 {
        return this._dir;
    }

    // in Lux(lx)
    set illuminance (illum: number) {
        this._illum = illum;
    }

    get illuminance (): number {
        return this._illum;
    }

    constructor () {
        super();
        this._type = LightType.DIRECTIONAL;
    }

    public update () {
        if (this._node && this._node.hasChangedFlags) {
            this._dir = Vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
            Vec3.normalize(this._dir, this._dir);
        }
    }
}