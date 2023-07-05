import { DEBUG } from 'internal:constants';
import { assertIsTrue } from '../../core';
import { VFXArray, BATCH_OPERATION_THRESHOLD, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

const STRIDE = 1;
export class VFXInt32Array extends VFXArray {
    get type () {
        return VFXValueType.INT32;
    }

    private _data = new Int32Array(this._size);

    reserve (size: number) {
        if (size <= this._size) return;
        this._size = size;
        const oldData = this._data;
        this._data = new Int32Array(size);
        this._data.set(oldData);
    }

    moveTo (a: number, b: number) {
        this._data[b] = this._data[a];
    }

    getInt32At (handle: Handle) {
        return this._data[handle];
    }

    setInt32At (val: number, handle: Handle) {
        this._data[handle] = val;
    }

    copyFrom (src: VFXInt32Array, fromIndex: Handle, toIndex: Handle) {
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

    copyToTypedArray (dest: Int32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._size && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= STRIDE && strideOffset >= 0 && strideOffset < stride);
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

export class VFXInt32 extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.INT32;
    }

    get data (): number {
        return this._data;
    }

    set data (val: number) {
        this._data = val;
    }

    private _data = 0;
}
