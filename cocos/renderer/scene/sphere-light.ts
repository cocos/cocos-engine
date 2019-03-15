import { aabb } from '../../3d/geom-utils';
import { Vec3 } from '../../core/value-types';
import { v3 } from '../../core/value-types/vec3';
import { Node } from '../../scene-graph';
import { Light, LightType } from './light';
import { RenderScene } from './render-scene';

export class SphereLight extends Light {

    get position () {
        return this._pos;
    }

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
        this._luminousPower = this._luminance * (4.0 * this._size * this._size * Math.PI * Math.PI);
    }

    get luminance (): number {
        return this._luminance;
    }

    set luminousPower (lm: number) {
        this._luminousPower = lm;
        this._luminance = this._luminousPower / (4.0 * this._size * this._size * Math.PI * Math.PI);
    }

    get luminousPower (): number {
        return this._luminousPower;
    }

    get aabb () {
        return this._aabb;
    }

    protected _size: number = 0.15;
    protected _range: number = 1.0;
    protected _luminance: number = 0.0;
    protected _luminousPower: number = 0.0;
    protected _pos: Vec3;
    protected _aabb: aabb;

    constructor (scene: RenderScene, name: string, node: Node) {
        super(scene, name, node);
        this._type = LightType.SPHERE;
        this.luminousPower = 1700.0;
        this._aabb = aabb.create();
        this._pos = v3();
    }

    public update () {
        if (this._node) {
            this._node.getWorldPosition(this._pos);
            aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);
        }
    }
}
