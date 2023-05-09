import { DEBUG } from 'internal:constants';
import { ParticleHandle, VFXParameterType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD } from '../vfx-parameter';
import { assertIsTrue } from '../../core';

export class FloatArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.FLOAT;
    }

    get stride (): number {
        return 1;
    }

    private _data = new Float32Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(capacity);
        this._data.set(oldData);
    }

    move (a: number, b: number) {
        if (DEBUG) {
            assertIsTrue(a <= this._capacity && a >= 0);
            assertIsTrue(b <= this._capacity && b >= 0);
        }
        this._data[b] = this._data[a];
    }

    getFloatAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        return this._data[handle];
    }

    setFloatAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        this._data[handle] = val;
    }

    addFloatAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        this._data[handle] += val;
    }

    multiplyFloatAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        this._data[handle] *= val;
    }

    copyFrom (src: FloatArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(src._capacity === this._capacity);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            const source = (toIndex === this._capacity && fromIndex === 0) ? src._data : src._data.subarray(fromIndex, toIndex);
            this._data.set(source, fromIndex);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex; i < toIndex; i++) {
                destData[i] = srcData[i];
            }
        }
    }

    copyToTypedArray (dest: Float32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(destOffset >= 0);
            assertIsTrue(dest.length >= (toIndex - fromIndex) * stride + destOffset * stride);
            assertIsTrue(stride >= strideOffset + this.stride);
        }

        if (stride === this.stride && strideOffset === 0 && toIndex - fromIndex > BATCH_OPERATION_THRESHOLD) {
            const source = (toIndex === this._capacity && fromIndex === 0) ? this._data : this._data.subarray(fromIndex, toIndex);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    fill (val: number, fromIndex: number, toIndex: number) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
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
