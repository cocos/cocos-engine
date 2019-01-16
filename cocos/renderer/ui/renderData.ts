
import { Material } from '../../3d/assets/material';
import { RecyclePool } from '../../3d/memop/recycle-pool';

class BaseRenderData {
    public material: Material | null = null;
    public vertexCount: number = 0;
    public indiceCount: number = 0;
}

export class RenderData extends BaseRenderData {

    get dataLength () {
        return this._data.length;
    }

    set dataLength (length: number) {
        const data = this._data;
        if (data.length !== length) {
            // // Free extra data
            const value = data.length;
            let i = 0;
            for (i = value; i < length; i++) {
                data[i] = _dataPool.add();
            }
            for (i = value; i > length; i--) {
                _dataPool.remove(i);
                data.splice(i, 1);
            }
        }
    }

    public static add () {
        const data = _pool.add();
        return {
            pooID: _pool.length - 1,
            data,
        };
    }

    public static remove (idx: number) {
        _pool.data[idx].clear();
        _pool.remove(idx);
    }
    public _data: number[] = [];
    public _indices: number[] = [];
    public _pivotX: number = 0;
    public _pivotY: number = 0;
    public _width: number = 0;
    public _height: number = 0;
    public uvDirty: boolean = true;
    public vertDirty: boolean = true;

    public updateSizeNPivot (width: number, height: number, pivotX: number, pivotY: number) {
        if (width !== this._width ||
            height !== this._height ||
            pivotX !== this._pivotX ||
            pivotY !== this._pivotY) {
            this._width = width;
            this._height = height;
            this._pivotX = pivotX;
            this._pivotY = pivotY;
            this.vertDirty = true;
        }
    }

    public clear () {
        this._data.length = 0;
        this._indices.length = 0;
        this._pivotX = 0;
        this._pivotY = 0;
        this._width = 0;
        this._height = 0;
        this.uvDirty = true;
        this.vertDirty = true;
        this.material = null;
        this.vertexCount = 0;
        this.indiceCount = 0;
    }
}

const _dataPool = new RecyclePool(128, () => {
    return {
        x: 0.0,
        y: 0.0,
        z: 0.0,
        u: 0.0,
        v: 0.0,
        color: 0,
    };
});

const _pool = new RecyclePool(32, () => {
    return new RenderData();
});
