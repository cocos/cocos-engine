import { DEBUG } from 'internal:constants';
import { Vec2, assertIsTrue } from '../../core';
import { VFXArray, BATCH_OPERATION_THRESHOLD_VEC3, Handle, VFXValue, VFXValueType } from '../vfx-parameter';

const tempVec2 = new Vec2();
const STRIDE = 2;
export class VFXVec2Array extends VFXArray {
    get type () {
        return VFXValueType.VEC2;
    }

    private _data = new Float32Array(STRIDE * this._size);

    reserve (size: number) {
        if (size <= this._size) return;
        this._size = size;
        const oldData = this._data;
        this._data = new Float32Array(STRIDE * size);
        this._data.set(oldData);
    }

    /**
     * Move data at a to b. the previous data at b will be overwrite.
     * @param a the handle to be moved.
     * @param b the handle to be overwrite.
     */
    moveTo (a: Handle, b: Handle) {
        if (DEBUG) {
            assertIsTrue(a < this._size && a >= 0 && b < this._size && b >= 0);
        }
        this.setVec2At(this.getVec2At(tempVec2, a), b);
    }

    getVec2At (out: Vec2, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        out.x = data[offset];
        out.y = data[offset + 1];
        return out;
    }

    setVec2At (val: Vec2, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
    }

    setUniformFloatAt (val: number, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] = val;
        data[offset + 1] = val;
    }

    addVec2At (val: Vec2, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] += val.x;
        data[offset + 1] += val.y;
    }

    multiplyVec2At (val: Vec2, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] *= val.x;
        data[offset + 1] *= val.y;
    }

    multiplyScalarAt (val: number, handle: Handle) {
        if (DEBUG) {
            assertIsTrue(handle < this._size && handle >= 0);
        }
        const offset = handle * STRIDE;
        const data = this._data;
        data[offset] *= val;
        data[offset + 1] *= val;
    }

    copyFrom (src: VFXVec2Array, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(this._size === src._size && toIndex <= this._size && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (fromIndex === 0 && toIndex === this._size) ? src._data : src._data.subarray(fromIndex * STRIDE, toIndex * STRIDE);
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
            assertIsTrue(toIndex <= this._size && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= STRIDE && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(stride >= strideOffset + STRIDE);
            assertIsTrue(destOffset >= 0);
            assertIsTrue(destOffset >= 0 && (destOffset * stride) + (toIndex - fromIndex) * stride <= dest.length);
        }

        if (stride === STRIDE && strideOffset === 0 && (toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (toIndex === this._size && fromIndex === 0) ? this._data : this._data.subarray(fromIndex * STRIDE, toIndex * STRIDE);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, sourceOffset = fromIndex * STRIDE, length = toIndex * STRIDE; sourceOffset < length; offset += stride, sourceOffset += STRIDE) {
            dest[offset] = data[sourceOffset];
            dest[offset + 1] = data[sourceOffset + 1];
        }
    }

    fill (val: Vec2, fromIndex: Handle, toIndex: Handle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._size && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const data = this._data;
        const x = val.x;
        const y = val.y;
        for (let i = fromIndex * STRIDE, length = toIndex * STRIDE; i < length; i += STRIDE) {
            data[i] = x;
            data[i + 1] = y;
        }
    }
}

export class VFXVec2 extends VFXValue {
    get type (): VFXValueType {
        return VFXValueType.VEC2;
    }

    get data (): Readonly<Vec2> {
        return this._data;
    }

    set data (val: Readonly<Vec2>) {
        Vec2.copy(this._data, val);
    }

    private _data = new Vec2();
}
