import { Vec3 } from '../../core/value-types';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

export class SphereLight extends Light {

    set size (size: number) {
        this._size = size;
    }

    get size (): number {
        return this._size;
    }

    set range (range: number) {
        this._range = range;
    }

    get range (): number {
        return this._range;
    }

    set luminance (lum: number) {
        this._luminance = lum;
        this._luminousPower = this._luminance * 4.0 * Math.PI;
    }

    get luminance (): number {
        return this._luminance;
    }

    set luminousPower (lm: number) {
        this._luminousPower = lm;
        this._luminance = this._luminousPower / 4.0 / Math.PI;
    }

    get luminousPower (): number {
        return this._luminousPower;
    }

    protected _size: number = 15.0;
    protected _range: number = 1.0;
    protected _luminance: number = 10000.0;
    protected _luminousPower: number = 0.0;

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.SPHERE;
        this._luminousPower = this._luminance * 4.0 * Math.PI;
    }
}
