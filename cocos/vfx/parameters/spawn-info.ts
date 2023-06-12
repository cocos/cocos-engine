import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../core';
import { VFXArray, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

export class SpawnInfo {
    public count = 0;
    public intervalDt = 0;
    public interpStartDt = 0;

    copy (val: Readonly<SpawnInfo>) {
        this.count = val.count;
        this.intervalDt = val.intervalDt;
        this.interpStartDt = val.interpStartDt;
    }
}

const STRIDE = 3;

export class VFXSpawnInfoArray extends VFXArray {
    get type () {
        return VFXValueType.SPAWN_INFO;
    }

    private _data = new Float32Array(STRIDE * this._capacity);
    private _uint32data = new Uint32Array(this._data.buffer);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * capacity);
        this._uint32data = new Uint32Array(this._data.buffer);
        this._data.set(oldData);
    }

    moveTo (a: Handle, b: Handle) {
        if (DEBUG) {
            assertIsTrue(a <= this._capacity && a >= 0);
            assertIsTrue(b <= this._capacity && b >= 0);
        }
        const offsetA = a * STRIDE;
        const offsetB = b * STRIDE;
        this._data[offsetB] = this._data[offsetA];
        this._data[offsetB + 1] = this._data[offsetA + 1];
        this._data[offsetB + 2] = this._data[offsetA + 2];
    }

    getSpawnInfoAt (out: SpawnInfo, handle: Handle) {
        const data = this._data;
        const uint32Data = this._uint32data;
        const offset = handle * STRIDE;
        out.count = uint32Data[offset];
        out.intervalDt = data[offset + 1];
        out.interpStartDt = data[offset + 2];
        return out;
    }

    setSpawnInfoAt (spawnInfo: SpawnInfo, handle: Handle) {
        const data = this._data;
        const uint32Data = this._uint32data;
        const offset = handle * STRIDE;
        uint32Data[offset] = spawnInfo.count;
        data[offset + 1] = spawnInfo.intervalDt;
        data[offset + 2] = spawnInfo.interpStartDt;
    }

    copyFrom (src: VFXSpawnInfoArray, fromIndex: Handle, toIndex: Handle) {
    }
}

export class VFXSpawnInfo extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.EVENT;
    }

    get data (): Readonly<SpawnInfo> {
        return this._data;
    }

    set data (val: Readonly<SpawnInfo>) {
        this._data.copy(val);
    }

    private _data = new SpawnInfo();
}
