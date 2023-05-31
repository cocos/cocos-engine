import { DEBUG } from 'internal:constants';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD, Handle, VFXParameter, VFXParameterType } from '../vfx-parameter';
import { assertIsTrue } from '../../core';

export class Uint8ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get stride (): number {
        return 1;
    }

    get type (): VFXParameterType {
        return VFXParameterType.UINT8;
    }

    private _data = new Uint8Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Uint8Array(capacity);
        this._data.set(oldData);
    }

    move (a: number, b: number) {
        this._data[b] = this._data[a];
    }

    getUint8At (handle: Handle) {
        return this._data[handle];
    }

    setUint8At (val: number, handle: Handle) {
        this._data[handle] = val;
    }

    copyFrom (src: Uint8ArrayParameter, fromIndex: Handle, toIndex: Handle) {
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

    copyToTypedArray (dest: Uint8Array, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle) {
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

export class Uint8Parameter extends VFXParameter {
    get isArray (): boolean {
        return false;
    }
    get type (): VFXParameterType {
        return VFXParameterType.UINT8;
    }

    get data (): number {
        return this._data;
    }

    set data (val: number) {
        this._data = val >>> 0;
    }

    private _data = 0;
}
