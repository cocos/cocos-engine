import { DEBUG } from 'internal:constants';
import { Vec2, assertIsTrue } from '../../core';
import { ParticleHandle, VFXParameterType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD_VEC3 } from '../vfx-parameter';

const tempVec2 = new Vec2();
export class Vec2ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.VEC2;
    }

    get stride () {
        return 2;
    }

    private _data = new Float32Array(2 * this._capacity);

    static add (out: Vec2ArrayParameter, a: Vec2ArrayParameter, b: Vec2ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] + bData[i];
        }
    }

    static sub (out: Vec2ArrayParameter, a: Vec2ArrayParameter, b: Vec2ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] - bData[i];
        }
    }

    static scaleAndAdd (out: Vec2ArrayParameter, a: Vec2ArrayParameter, b: Vec2ArrayParameter, scale: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] + bData[i] * scale;
        }
    }

    static multiplyScalar (out: Vec2ArrayParameter, a: Vec2ArrayParameter, scale: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(out._capacity === a._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const outData = out.data;
        for (let i = fromIndex * 2, length = toIndex * 2; i < length; i++) {
            outData[i] = aData[i] * scale;
        }
    }

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(3 * capacity);
        this._data.set(oldData);
    }

    /**
     * Move data at a to b. the previous data at b will be overwrite.
     * @param a the handle to be moved.
     * @param b the handle to be overwrite.
     */
    move (a: ParticleHandle, b: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(a < this._capacity && a >= 0 && b < this._capacity && b >= 0);
        }
        this.setVec2At(this.getVec2At(tempVec2, a), b);
    }

    getXAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        return this._data[offset];
    }

    getYAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        return this._data[offset + 1];
    }

    getVec2At (out: Vec2, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        out.x = data[offset];
        out.y = data[offset + 1];
        return out;
    }

    setVec2At (val: Vec2, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
    }

    set2fAt (x: number, y: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] = x;
        data[offset + 1] = y;
    }

    setXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        this._data[offset] = val;
    }

    setYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        this._data[offset + 1] = val;
    }

    set1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] = val;
        data[offset + 1] = val;
    }

    addVec2At (val: Vec2, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] += val.x;
        data[offset + 1] += val.y;
    }

    subVec2At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] -= val.x;
        data[offset + 1] -= val.y;
    }

    add2fAt (x: number, y: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] += x;
        data[offset + 1] += y;
    }

    addXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        this._data[offset] += val;
    }

    addYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        this._data[offset + 1] += val;
    }

    multiplyVec2At (val: Vec2, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] *= val.x;
        data[offset + 1] *= val.y;
    }

    multiply2fAt (x: number, y: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] *= x;
        data[offset + 1] *= y;
    }

    multiply1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] *= val;
        data[offset + 1] *= val;
    }

    add1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 2;
        const data = this._data;
        data[offset] += val;
        data[offset + 1] += val;
    }

    copyFrom (src: Vec2ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(this._capacity === src._capacity && toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (fromIndex === 0 && toIndex === this._capacity) ? src._data : src._data.subarray(fromIndex * 2, toIndex * 2);
            this._data.set(source, fromIndex * 2);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex * 2, length = toIndex * 2; i < length; i++) {
                destData[i] = srcData[i];
            }
        }
    }

    copyToTypedArray (dest: Float32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= this.stride && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(stride >= strideOffset + this.stride);
            assertIsTrue(destOffset >= 0);
            assertIsTrue(destOffset >= 0 && (destOffset * stride) + (toIndex - fromIndex) * stride <= dest.length);
        }

        if (stride === this.stride && strideOffset === 0 && (toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (toIndex === this._capacity && fromIndex === 0) ? this._data : this._data.subarray(fromIndex * 2, toIndex * 2);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, sourceOffset = fromIndex * 2, length = toIndex * 2; sourceOffset < length; offset += stride, sourceOffset += 2) {
            dest[offset] = data[sourceOffset];
            dest[offset + 1] = data[sourceOffset + 1];
        }
    }

    fill1f (val: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if (toIndex - fromIndex > BATCH_OPERATION_THRESHOLD_VEC3) {
            this._data.fill(val, fromIndex * 2, toIndex * 2);
        } else {
            const data = this._data;
            for (let i = fromIndex * 2, length = toIndex * 2; i < length; i++) {
                data[i] = val;
            }
        }
    }

    fill (val: Vec2, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const data = this._data;
        const x = val.x;
        const y = val.y;
        for (let i = fromIndex * 2, length = toIndex * 2; i < length; i += 2) {
            data[i] = x;
            data[i + 1] = y;
        }
    }
}
