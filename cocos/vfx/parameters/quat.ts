import { DEBUG } from 'internal:constants';
import { Quat, Vec3, assertIsTrue } from '../../core';
import { ParticleHandle, VFXParameterType } from '../define';
import { ArrayParameter, BATCH_OPERATION_THRESHOLD_VEC3 } from '../vfx-parameter';

const tempQuat = new Quat();
export class QuatArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.QUAT;
    }

    get stride () {
        return 4;
    }

    private _data = new Float32Array(4 * this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Float32Array(4 * capacity);
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
        this.setQuatAt(this.getQuatAt(tempQuat, a), b);
    }

    getXAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset];
    }

    getYAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset + 1];
    }

    getZAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset + 2];
    }

    getQuatAt (out: Quat, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 4;
        const data = this._data;
        out.x = data[offset];
        out.y = data[offset + 1];
        out.z = data[offset + 2];
        out.w = data[offset + 3];
        return out;
    }

    setQuatAt (val: Quat, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 4;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
        data[offset + 2] = val.z;
        data[offset + 3] = val.w;
    }

    set3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = x;
        data[offset + 1] = y;
        data[offset + 2] = z;
    }

    setXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset] = val;
    }

    setYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 1] = val;
    }

    setZAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 2] = val;
    }

    set1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = val;
        data[offset + 1] = val;
        data[offset + 2] = val;
    }

    addVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += val.x;
        data[offset + 1] += val.y;
        data[offset + 2] += val.z;
    }

    subVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] -= val.x;
        data[offset + 1] -= val.y;
        data[offset + 2] -= val.z;
    }

    add3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += x;
        data[offset + 1] += y;
        data[offset + 2] += z;
    }

    addXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset] += val;
    }

    addYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 1] += val;
    }

    addZAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 2] += val;
    }

    multiplyVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= val.x;
        data[offset + 1] *= val.y;
        data[offset + 2] *= val.z;
    }

    multiply3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= x;
        data[offset + 1] *= y;
        data[offset + 2] *= z;
    }

    multiply1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= val;
        data[offset + 1] *= val;
        data[offset + 2] *= val;
    }

    add1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += val;
        data[offset + 1] += val;
        data[offset + 2] += val;
    }

    copyFrom (src: QuatArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(this._capacity === src._capacity && toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            const source = (fromIndex === 0 && toIndex === this._capacity) ? src._data : src._data.subarray(fromIndex * 3, toIndex * 3);
            this._data.set(source, fromIndex * 3);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
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
            const source = (toIndex === this._capacity && fromIndex === 0) ? this._data : this._data.subarray(fromIndex * 3, toIndex * 3);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = destOffset * stride + strideOffset, sourceOffset = fromIndex * 3, length = toIndex * 3; sourceOffset < length; offset += stride, sourceOffset += 3) {
            dest[offset] = data[sourceOffset];
            dest[offset + 1] = data[sourceOffset + 1];
            dest[offset + 2] = data[sourceOffset + 2];
        }
    }

    fill1f (val: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if (toIndex - fromIndex > BATCH_OPERATION_THRESHOLD_VEC3) {
            this._data.fill(val, fromIndex * 3, toIndex * 3);
        } else {
            const data = this._data;
            for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
                data[i] = val;
            }
        }
    }

    fill (val: Vec3, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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
