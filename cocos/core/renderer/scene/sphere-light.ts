import { aabb } from '../../geometry';
import { Vec3 } from '../../math';
import { Light, LightType, nt2lm } from './light';
import { AABBHandle, AABBPool, AABBView, LightPool, LightView, NULL_HANDLE } from '../core/memory-pools';

export class SphereLight extends Light {

    protected _needUpdate = false;

    get position () {
        return this._pos;
    }

    set size (size: number) {
        LightPool.set(this._handle, LightView.SIZE, size);
    }

    get size (): number {
        return LightPool.get(this._handle, LightView.SIZE);
    }

    set range (range: number) {
        LightPool.set(this._handle, LightView.RANGE, range);
        this._needUpdate = true;
    }

    get range (): number {
        return LightPool.get(this._handle, LightView.RANGE);
    }

    set luminance (lum: number) {
        LightPool.set(this._handle, LightView.ILLUMINANCE, lum);
    }

    get luminance (): number {
        return LightPool.get(this._handle, LightView.ILLUMINANCE);
    }

    get aabb () {
        return this._aabb;
    }

    protected _pos: Vec3;
    protected _aabb: aabb;
    protected _hAABB: AABBHandle = NULL_HANDLE;

    constructor () {
        super();
        this._type = LightType.SPHERE;
        this._aabb = aabb.create();
        this._pos = new Vec3();
    }

    public initialize () {
        super.initialize();
        this._hAABB = AABBPool.alloc();
        const size = 0.15;
        LightPool.set(this._handle, LightView.SIZE, size);
        LightPool.set(this._handle, LightView.RANGE, 1.0);
        LightPool.set(this._handle, LightView.AABB, this._hAABB);
        LightPool.set(this._handle, LightView.ILLUMINANCE, 1700 / nt2lm(size));
    }

    public update () {
        if (this._node && (this._node.hasChangedFlags || this._needUpdate)) {
            this._node.getWorldPosition(this._pos);
            const range = LightPool.get(this._handle, LightView.RANGE);
            aabb.set(this._aabb, this._pos.x, this._pos.y, this._pos.z, range, range, range);
            this._needUpdate = false;

            LightPool.setVec3(this._handle, LightView.POSITION, this._pos);
            AABBPool.setVec3(this._hAABB, AABBView.CENTER, this._aabb.center);
            AABBPool.setVec3(this._hAABB, AABBView.HALF_EXTENSION, this._aabb.halfExtents);
        }
    }

    public destroy () {
        if (this._hAABB) {
            AABBPool.free(this._hAABB);
            this._hAABB = NULL_HANDLE;
        }
        return super.destroy();
    }
}
