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
import { Color, Vec3 } from '../core';
import { ccclass, serializable, visible } from '../core/data/decorators';
import { ParticleHandle } from './particle-data-set';
import { assertIsTrue } from '../core/data/utils/asserts';
import { ParameterNameSpace, VFXParameterType } from './enum';

const DEFAULT_CAPACITY = 16;
const tempColor = new Color();
const tempVec3 = new Vec3();
export const BATCH_OPERATION_THRESHOLD_VEC3 = 330;
export const BATCH_OPERATION_THRESHOLD = 1000;

@ccclass('cc.VFXParameterIdentity')
export class VFXParameterIdentity {
    public get id () {
        return this._id;
    }

    public get type () {
        return this._type;
    }

    public get namespace () {
        return this._namespace;
    }

    @visible(true)
    public get name () {
        return this._name;
    }

    public set name (val) {
        this._name = val;
    }

    @serializable
    private _id = 0;
    @serializable
    private _name = '';
    @serializable
    private _type: VFXParameterType = VFXParameterType.FLOAT;
    @serializable
    private _namespace: ParameterNameSpace = ParameterNameSpace.USER;

    constructor (id: number, name: string, type: VFXParameterType, namespace: ParameterNameSpace) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._namespace = namespace;
    }
}

export abstract class VFXParameter {
    abstract get isArray (): boolean;
    abstract get type (): VFXParameterType;
}

export abstract class ArrayParameter extends VFXParameter {
    get capacity () {
        return this._capacity;
    }

    get isArray () {
        return true;
    }

    abstract get data (): ArrayBufferView;
    abstract get stride (): number;
    protected _capacity = DEFAULT_CAPACITY;
    abstract reserve (capacity: number);
    abstract move (a: ParticleHandle, b: ParticleHandle);
    abstract copyFrom (src: ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle);
    abstract copyToTypedArray (dest: ArrayBufferView, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle);
}

export class Vec3ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.VEC3;
    }

    get stride () {
        return 3;
    }

    private _data = new Float32Array(3 * this._capacity);

    static add (out: Vec3ArrayParameter, a: Vec3ArrayParameter, b: Vec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    static sub (out: Vec3ArrayParameter, a: Vec3ArrayParameter, b: Vec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    static scaleAndAdd (out: Vec3ArrayParameter, a: Vec3ArrayParameter, b: Vec3ArrayParameter, scale: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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
        this.setVec3At(this.getVec3At(tempVec3, a), b);
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

    getVec3At (out: Vec3, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle < this._capacity && handle >= 0);
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
            assertIsTrue(handle < this._capacity && handle >= 0);
        }
        const offset = handle * 3;
        const data = this._data;
        data[offset] = val.x;
        data[offset + 1] = val.y;
        data[offset + 2] = val.z;
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

    copyFrom (src: Vec3ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

export class BoolArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.BOOL;
    }

    get stride (): number {
        return 1;
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
        if (DEBUG) {
            assertIsTrue(a <= this._capacity && a >= 0);
            assertIsTrue(b <= this._capacity && b >= 0);
        }
        this._data[b] = this._data[a];
    }

    getBoolAt (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        return this._data[handle] !== 0;
    }

    setBoolAt (val: boolean, handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle <= this._capacity && handle >= 0);
        }
        this._data[handle] = val ? 1 : 0;
    }

    copyFrom (src: BoolArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Uint8Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(destOffset >= 0);
            assertIsTrue(dest.length >= (toIndex - fromIndex) * stride);
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

export class Uint32ArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.UINT32;
    }

    get stride (): number {
        return 1;
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

    copyFrom (src: Uint32ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Uint32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    getUint32At (handle: ParticleHandle) {
        return this._data[handle];
    }

    setUint32At (val: number, handle: ParticleHandle) {
        this._data[handle] = val;
    }

    copyFrom (src: Uint8ArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

    copyToTypedArray (dest: Uint32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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

export class ColorArrayParameter extends ArrayParameter {
    get data () {
        return this._data;
    }

    get type () {
        return VFXParameterType.COLOR;
    }

    get stride (): number {
        return 1;
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

    copyToTypedArray (dest: Uint32Array, destOffset: number, stride: number, strideOffset: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(toIndex <= this._capacity && fromIndex >= 0 && fromIndex <= toIndex);
            assertIsTrue(stride >= 1 && strideOffset >= 0 && strideOffset < stride);
            assertIsTrue(strideOffset + this.stride <= stride);
            assertIsTrue(dest.length >= (toIndex - fromIndex) * stride + destOffset * stride);
        }

        if (stride === this.stride && strideOffset === 0 && (toIndex - fromIndex) > BATCH_OPERATION_THRESHOLD) {
            const source = (fromIndex === 0 && toIndex === this._capacity) ? this._data : this._data.subarray(fromIndex, toIndex);
            dest.set(source, destOffset * stride);
            return;
        }

        const data = this._data;
        for (let offset = fromIndex * stride + strideOffset, i = fromIndex; i < toIndex; offset += stride, i++) {
            dest[offset] = data[i];
        }
    }

    copyFrom (src: ColorArrayParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
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
