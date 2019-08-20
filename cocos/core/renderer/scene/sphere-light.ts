import { aabb } from '../../geom-utils';
import { Vec3 } from '../../math';
import { Light, LightType, nt2lm } from './light';
import { RenderScene } from './render-scene';
import { INode } from '../../utils/interfaces';

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
    }

    get luminance (): number {
        return this._luminance;
    }

    get aabb () {
        return this._aabb;
    }

    protected _size: number = 0.15;
    protected _range: number = 1.0;
    protected _luminance: number = 1700 / nt2lm(this._size);
    protected _pos: Vec3;
    protected _aabb: aabb;

    constructor (scene: RenderScene, name: string, node: INode) {
        super(scene, name, node);
        this._type = LightType.SPHERE;
        this._aabb = aabb.create();
        this._pos = new Vec3();
    }

    public update () {
        if (this._node) {
            this._node.getWorldPosition(this._pos);
            aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, this._range, this._range, this._range);
        }
    }
}
