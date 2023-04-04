/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */
import { DEBUG } from 'internal:constants';
import { assert, Color, Enum, Vec3 } from '../core';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { ParticleHandle } from './particle-data-set';

const DEFAULT_CAPACITY = 16;
const tempColor = new Color();
const tempVec3 = new Vec3();
export const BATCH_OPERATION_THRESHOLD_VEC3 = 330;
export const BATCH_OPERATION_THRESHOLD = 1000;

export enum ParticleParameterType {
    FLOAT,
    BOOL,
    VEC3,
    COLOR,
    UINT32,
}

@ccclass('cc.ParticleParameterIdentity')
export class ParticleParameterIdentity {
    public get id () {
        return this._id;
    }

    @visible(true)
    public get name () {
        return this._name;
    }

    public set name (val) {
        this._name = val;
    }

    @visible(true)
    @type(Enum(ParticleParameterType))
    public get type () {
        return this._type;
    }

    public set type (val) {
        this._type = val;
    }

    @serializable
    private _id = 0;
    @serializable
    private _name = '';
    @serializable
    private _type: ParticleParameterType = ParticleParameterType.FLOAT;

    constructor (id: number, name: string, type: ParticleParameterType) {
        this._id = id;
        this._name = name;
        this._type = type;
    }
}

export abstract class ParticleParameter {
    get isArray () {
        return false;
    }

    abstract get type (): ParticleParameterType;
}

export abstract class ParticleArrayParameter extends ParticleParameter {
    get capacity () {
        return this._capacity;
    }

    get isArray () {
        return true;
    }

    get stride () {
        return 1;
    }

    protected _capacity = DEFAULT_CAPACITY;
    abstract reserve (capacity: number);
    abstract move (a: ParticleHandle, b: ParticleHandle);
}

export class ParticleVec3ArrayParameter extends ParticleArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.VEC3;
    }

    get stride () {
        return 3;
    }

    private _data = new Float32Array(3 * this._capacity);

    static add (out: ParticleVec3ArrayParameter, a: ParticleVec3ArrayParameter, b: ParticleVec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] + bData[i];
        }
    }

    static sub (out: ParticleVec3ArrayParameter, a: ParticleVec3ArrayParameter, b: ParticleVec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] - bData[i];
        }
    }

    static scaleAndAdd (out: ParticleVec3ArrayParameter, a: ParticleVec3ArrayParameter, b: ParticleVec3ArrayParameter, scale: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(out._capacity === a._capacity && a._capacity === b._capacity
                && toIndex <= out._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] + bData[i] * scale;
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
            assert(a < this._capacity && a >= 0 && b < this._capacity && b >= 0);
        }
        this.setVec3At(this.getVec3At(tempVec3, a), b);
    }

    getXAt (handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset];
    }

    getYAt (handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset + 1];
    }

    getZAt (handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        return this._data[offset + 2];
    }

    getVec3At (out: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        out.x = data[offset];
        out.y = data[offset + 1];
        out.z = data[offset + 2];
        return out;
    }

    setVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
        data[offset + 2] = val.z;
    }

    set3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = x;
        data[offset + 1] = y;
        data[offset + 2] = z;
    }

    setXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset] = val;
    }

    setYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 1] = val;
    }

    setZAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 2] = val;
    }

    set1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = val;
        data[offset + 1] = val;
        data[offset + 2] = val;
    }

    addVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += val.x;
        data[offset + 1] += val.y;
        data[offset + 2] += val.z;
    }

    subVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] -= val.x;
        data[offset + 1] -= val.y;
        data[offset + 2] -= val.z;
    }

    add3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += x;
        data[offset + 1] += y;
        data[offset + 2] += z;
    }

    addXAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset] += val;
    }

    addYAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 1] += val;
    }

    addZAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        this._data[offset + 2] += val;
    }

    multiplyVec3At (val: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= val.x;
        data[offset + 1] *= val.y;
        data[offset + 2] *= val.z;
    }

    multiply3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= x;
        data[offset + 1] *= y;
        data[offset + 2] *= z;
    }

    multiply1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] *= val;
        data[offset + 1] *= val;
        data[offset + 2] *= val;
    }

    add1fAt (val: number, handle: ParticleHandle) {
        if (DEBUG) {
            assert(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] += val;
        data[offset + 1] += val;
        data[offset + 2] += val;
    }

    copyFrom (src: ParticleVec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(this._capacity === src._capacity && toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD_VEC3) {
            this._data.set(src._data.subarray(fromIndex * 3, toIndex * 3), fromIndex * 3);
        } else {
            const destData = this._data;
            const srcData = src._data;
            for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
                destData[i] = srcData[i];
            }
        }
    }

    copyToTypedArray (dest: Float32Array, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assert(stride >= 3 && strideOffset >= 0 && strideOffset < stride);
            assert(dest.length >= (toIndex - fromIndex) * stride);
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, offset3 = fromIndex * 3, length = toIndex * 3; offset3 < length; offset += stride, offset3 += 3) {
            dest[offset] = data[offset3];
            dest[offset + 1] = data[offset3 + 1];
            dest[offset + 2] = data[offset3 + 2];
        }
    }

    fill1f (val: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
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
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
        }
        const data = this._data;
        const x = val.x;
        const y = val.y;
        const z = val.z;
        for (let i = fromIndex; i < toIndex; i++) {
            const offset = 3 * i;
            data[offset] = x;
            data[offset + 1] = y;
            data[offset + 2] = z;
        }
    }
}

export class ParticleFloatArrayParameter extends ParticleArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.FLOAT;
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
        this._data[b] = this._data[a];
    }

    get1fAt (handle: ParticleHandle) {
        return this._data[handle];
    }

    set1fAt (val: number, handle: ParticleHandle) {
        this._data[handle] = val;
    }

    add1fAt (val: number, handle: ParticleHandle) {
        this._data[handle] += val;
    }

    copyFrom (src: ParticleFloatArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Float32Array, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assert(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assert(dest.length >= (toIndex - fromIndex) * stride);
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
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

export class ParticleBoolArrayParameter extends ParticleArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.BOOL;
    }

    private _data = new Uint8Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Uint8Array(capacity);
        this._data.set(oldData);
    }

    move (a: ParticleHandle, b: ParticleHandle) {
        this._data[b] = this._data[a];
    }

    getBoolAt (handle: ParticleHandle) {
        return this._data[handle] !== 0;
    }

    setBoolAt (val: boolean, handle: ParticleHandle) {
        this._data[handle] = val ? 1 : 0;
    }

    copyFrom (src: ParticleBoolArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Uint8Array, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assert(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assert(dest.length >= (toIndex - fromIndex) * stride);
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    fill (val: boolean, fromIndex: number, toIndex: number) {
        const valNum = val ? 1 : 0;
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.fill(valNum, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = valNum;
            }
        }
    }
}

export class ParticleUint32ArrayParameter extends ParticleArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.UINT32;
    }

    private _data = new Uint32Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Uint32Array(capacity);
        this._data.set(oldData);
    }

    move (a: number, b: number) {
        this._data[b] = this._data[a];
    }

    getUint32At (handle: ParticleHandle) {
        return this._data[handle];
    }

    setUint32At (val: number, handle: ParticleHandle) {
        this._data[handle] = val;
    }

    copyFrom (src: ParticleUint32ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Uint32Array, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assert(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assert(dest.length >= (toIndex - fromIndex) * stride);
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
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

export class ParticleColorArrayParameter extends ParticleArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.COLOR;
    }

    private _data = new Uint32Array(this._capacity);

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldData = this._data;
        this._data = new Uint32Array(capacity);
        this._data.set(oldData);
    }

    move (a: ParticleHandle, b: ParticleHandle) {
        this._data[b] = this._data[a];
    }

    getColorAt (out: Color, handle: ParticleHandle) {
        Color.fromUint32(out, this._data[handle]);
        return out;
    }

    setColorAt (color: Color, handle: ParticleHandle) {
        this._data[handle] = Color.toUint32(color);
    }

    setUint32At (val: number, handle: ParticleHandle) {
        this._data[handle] = val;
    }

    getUint32At (handle: ParticleHandle) {
        return this._data[handle];
    }

    multiplyColorAt (color: Color, handle: ParticleHandle) {
        Color.fromUint32(tempColor, this._data[handle]);
        tempColor.multiply(color);
        this._data[handle] = Color.toUint32(tempColor);
    }

    fillUint32 (val: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if ((toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }

    fill (color: Color, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        const val = Color.toUint32(color);
        this.fillUint32(val, fromIndex, toIndex);
    }

    copyToTypedArray (dest: Uint32Array, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assert(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assert(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assert(dest.length >= (toIndex - fromIndex) * stride);
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    copyFrom (src: ParticleColorArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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
}
