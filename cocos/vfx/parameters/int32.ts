import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../core';
import { ParticleHandle, VFXParameterType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD, VFXParameter } from '../vfx-parameter';

export class Int32ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.INT32;
    }

    get stride (): number {
        return 1;
    }

    private _data = new Int32Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Int32Array(capacity);
        this._data.set(oldData);
    }

    move (a: number, b: number) {
        this._data[b] = this._data[a];
    }

    getInt32At (handle: ParticleHandle) {
        return this._data[handle];
    }

    setInt32At (val: number, handle: ParticleHandle) {
        this._data[handle] = val;
    }

    copyFrom (src: Int32ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.set(src._data.subarray(fromIndex, toIndex), fromIndex);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex; i < toIndex; i++) {
                destData[i] = srcData[i];
            }
        }
    }

    copyToTypedArray (dest: Int32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(dest.length >= (toIndex - fromIndex) * stride + destOffset * stride);
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    fill (val: number, fromIndex: number, toIndex: number) {
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }
}

export class Int32Parameter extends VFXParameter {
    get isArray (): boolean {
        return false;
    }
    get type (): VFXParameterType {
        return VFXParameterType.INT32;
    }

    get data (): number {
        return this._data;
    }

    set data (val: number) {
        this._data = val;
    }

    private _data = 0;
}
