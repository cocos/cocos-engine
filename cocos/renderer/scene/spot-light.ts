import { Quat, Vec3 } from '../../core/value-types';
import { vec3 } from '../../core/vmath';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

const _forward = new Vec3(0, 0, -1);
const _v3 = new Vec3();
const _qt = new Quat();

export class SpotLight extends Light {
    protected _dir: Vec3 = new Vec3(1.0, -1.0, -1.0);
    protected _size: number = 15.0;
    protected _range: number = 500.0;
    protected _luminance: number = 10000.0;
    protected _luminousPower: number = 0.0;

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

    get direction (): Vec3 {
        return this._dir;
    }

    set spotAngle (val: number) {
        this._range = Math.cos(val * 0.5);
    }

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.SPOT;
        this._luminousPower = this._luminance * 4.0 * Math.PI;
    }

    public update () {
        if (this._node) {
            this._dir = vec3.transformQuat(_v3, _forward, this._node.getWorldRotation(_qt));
        }
    }
}
