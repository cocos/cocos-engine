import { vec3 } from '../../core/vmath';
import { RenderScene } from './render-scene';

export class Ambient {
    public static SUN_ILLUM = 65000.0;
    public static SKY_ILLUM = 20000.0;

    set enabled (val) {
        this._enabled = val;
    }
    get enabled () {
        return this._enabled;
    }

    get skyColor (): Float32Array {
        return this._skyColor;
    }

    set skyColor (color: Float32Array) {
        this._skyColor = color;
    }

    set skyIllum (illum: number) {
        this._skyIllum = illum;
    }

    get skyIllum (): number {
        return this._skyIllum;
    }

    get groundAlbedo (): Float32Array {
        return this._groundAlbedo;
    }

    set groundAlbedo (color: Float32Array) {
        this._groundAlbedo = color;
    }

    protected _enabled = true;
    protected _skyColor = Float32Array.from([0.2, 0.5, 0.8, 1.0]);
    protected _skyIllum: number = Ambient.SKY_ILLUM;
    protected _groundAlbedo = Float32Array.from([0.2, 0.2, 0.2, 1.0]);

    protected _scene: RenderScene;

    constructor (scene: RenderScene) {
        this._scene = scene;
    }

    public update () {}
}
