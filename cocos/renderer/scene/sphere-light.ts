import { Vec3 } from '../../core/value-types';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

const _v3 = new Vec3();

export class SphereLight extends Light {

    get size (): number {
        return this._size;
    }

    set luminance (lum: number) {
        this._luminance = lum;
        this._luminousPower = this._luminance * 4.0 * Math.PI;
    }

    get luminance (): number {
        return this._luminance;
    }

    get luminousPower (): number {
        return this._luminousPower;
    }

    get range (): number {
        return this._range;
    }

    set useColorTemperature (enable: boolean) {
        this._useColorTemp = enable;
    }

    get useColorTemperature (): boolean {
        return this._useColorTemp;
    }

    get colorTemperature (): number {
        return this._colorTemp;
    }

    protected _size: number = 15.0;
    protected _luminance: number = 10000.0;
    protected _luminousPower: number = 0.0;
    protected _range: number = 500.0;
    protected _useColorTemp: boolean = false;
    protected _colorTemp: number = 6550.0;

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.POINT;
        this._luminousPower = this._luminance * 4.0 * Math.PI;
    }
}
