import { DEBUG } from 'internal:constants';
import { Quat, Vec3, assertIsTrue } from '../../core';
import { VFXArray, BATCH_OPERATION_THRESHOLD_VEC3, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

const tempQuat = new Quat();
const STRIDE = 4;
export class VFXQuatArray extends VFXArray {
    get data () {
        return this._data;
    }

    get type () {
        return VFXValueType.QUAT;
    }

    private _data = new Float32Array(STRIDE * this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * capacity);
        this._data.set(oldData);
    }

    /**
     * Move data at a to b. the previous data at b will be overwrite.
     * @param a the handle to be moved.
     * @param b the handle to be overwrite.
     */
    moveTo (a: Handle, b: Handle) {
        if (DEBUG) {
            assertIsTrue(a < this._capacity && a >= 0 && b < this._capacity && b >= 0);
        }
        this.setQuatAt(this.getQuatAt(tempQuat, a), b);
    }

    getQuatAt (out: Quat, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        out.x = data[offset];
        out.y = data[offset + 1];
        out.z = data[offset + 2];
        out.w = data[offset + 3];
        return out;
    }

    setQuatAt (val: Quat, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
        data[offset + 2] = val.z;
        data[offset + 3] = val.w;
    }

    multiplyQuatAt (val: Quat, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] *= val.x;
        data[offset + 1] *= val.y;
        data[offset + 2] *= val.z;
        data[offset + 3] *= val.w;
    }

    multiplyScalarAt (val: number, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] *= val;
        data[offset + 1] *= val;
        data[offset + 2] *= val;
        data[offset + 3] *= val;
    }

    copyFrom (src: VFXQuatArray, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(this._capacity === src._capacity && toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (fromIndex === 0 && toIndex === this._capacity) ? src._data : src._data.subarray(fromIndex * STRIDE, toIndex * STRIDE);
            this._data.set(source, fromIndex * STRIDE);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex * STRIDE, length = toIndex * STRIDE; i < length; i++) {
                destData[i] = srcData[i];
            }
        }
    }

    copyToTypedArray (dest: Float32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= STRIDE && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(stride >= strideOffset + STRIDE);
            assertIsTrue(destOffset >= 0);
            assertIsTrue(destOffset >= 0 && (destOffset * stride) + (toIndex - fromIndex) * stride <= dest.length);
        }

        if (stride === STRIDE && strideOffset === 0 && (toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (toIndex === this._capacity && fromIndex === 0) ? this._data : this._data.subarray(fromIndex * STRIDE, toIndex * STRIDE);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, sourceOffset = fromIndex * STRIDE, length = toIndex * STRIDE; sourceOffset < length; offset += stride, sourceOffset += STRIDE) {
            dest[offset] = data[sourceOffset];
            dest[offset + 1] = data[sourceOffset + 1];
            dest[offset + 2] = data[sourceOffset + 2];
        }
    }

    fill (val: Vec3, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const data = this._data;
        const x = val.x;
        const y = val.y;
        const z = val.z;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i += 3) {
            data[i] = x;
            data[i + 1] = y;
            data[i + 2] = z;
        }
    }
}

export class VFXQuat extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.QUAT;
    }

    get data (): Readonly<Quat> {
        return this._data;
    }

    set data (val: Readonly<Quat>) {
        Quat.copy(this._data, val);
    }

    private _data = new Quat();
}
