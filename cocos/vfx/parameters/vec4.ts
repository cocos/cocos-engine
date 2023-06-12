import { DEBUG } from 'internal:constants';
import { Vec4, assertIsTrue } from '../../core';
import { VFXArray, BATCH_OPERATION_THRESHOLD_VEC3, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

const tempVec4 = new Vec4();
const STRIDE = 4;
export class VFXVec4Array extends VFXArray {
    get data () {
        return this._data;
    }

    get type () {
        return VFXValueType.VEC4;
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
        this.setVec4At(this.getVec4At(tempVec4, a), b);
    }

    getVec4At (out: Vec4, handle: Handle) {
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

    setVec4At (val: Vec4, handle: Handle) {
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

    setUniformFloatAt (val: number, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] = val;
        data[offset + 1] = val;
        data[offset + 2] = val;
        data[offset + 3] = val;
    }

    addVec4At (val: Vec4, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] += val.x;
        data[offset + 1] += val.y;
        data[offset + 2] += val.z;
        data[offset + 3] += val.w;
    }

    multiplyVec4At (val: Vec4, handle: Handle) {
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

    copyFrom (src: VFXVec4Array, fromIndex: Handle, toIndex: Handle) {
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
            dest[offset + 3] = data[sourceOffset + 3];
        }
    }

    fill (val: Vec4, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const data = this._data;
        const x = val.x;
        const y = val.y;
        const z = val.z;
        const w = val.w;
        for (let i = fromIndex * STRIDE, length = toIndex * STRIDE; i < length; i += STRIDE) {
            data[i] = x;
            data[i + 1] = y;
            data[i + 2] = z;
            data[i + 3] = w;
        }
    }
}

export class VFXVec4 extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.VEC4;
    }

    get data (): Readonly<Vec4> {
        return this._data;
    }

    set data (val: Readonly<Vec4>) {
        Vec4.copy(this._data, val);
    }

    private _data = new Vec4();
}
