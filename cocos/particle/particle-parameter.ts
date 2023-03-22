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

import { Color, Enum, Vec3 } from '../core';
import { ccclass, serializable, type, visible } from '../core/data/decorators';
import { ParticleHandle } from './particle-data-set';

const DEFAULT_CAPACITY = 16;
const tempColor = new Color();
export abstract class ParticleParameter {
    get capacity () {
        return this._capacity;
    }

    abstract get type (): ParticleParameterType;

    protected _capacity = DEFAULT_CAPACITY;

    abstract reserve (capacity: number);
    abstract move (a: ParticleHandle, b: ParticleHandle);
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

export class ParticleVec3Parameter extends ParticleParameter {
    get data () {
        return this._data;
    }

    get type () {
        return ParticleParameterType.VEC3;
    }

    private _data = new Float32Array(3 * this._capacity);

    static addSingle (out: Vec3, a: ParticleVec3Parameter, b: ParticleVec3Parameter, handle: ParticleHandle) {
        const xOffset = handle * 3;
        const yOffset = xOffset + 1;
        const zOffset = yOffset + 1;
        const aData = a.data;
        const bData = b.data;
        out.x = aData[xOffset] + bData[xOffset];
        out.y = aData[yOffset] + bData[yOffset];
        out.z = aData[zOffset] + bData[zOffset];
    }

    static add (out: ParticleVec3Parameter, a: ParticleVec3Parameter, b: ParticleVec3Parameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] + bData[i];
        }
    }

    static sub (out: ParticleVec3Parameter, a: ParticleVec3Parameter, b: ParticleVec3Parameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        const aData = a.data;
        const bData = b.data;
        const outData = out.data;
        for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
            outData[i] = aData[i] - bData[i];
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
        const aOffset = a * 3;
        const bOffset = b * 3;
        this._data[bOffset] = this._data[aOffset];
        this._data[bOffset + 1] = this._data[aOffset + 1];
        this._data[bOffset + 2] = this._data[aOffset + 2];
    }

    getXAt (handle: ParticleHandle) {
        const offset = handle * 3;
        return this._data[offset];
    }

    getYAt (handle: ParticleHandle) {
        const offset = handle * 3;
        return this._data[offset + 1];
    }

    getZAt (handle: ParticleHandle) {
        const offset = handle * 3;
        return this._data[offset + 2];
    }

    getVec3At (out: Vec3, handle: ParticleHandle) {
        const offset = handle * 3;
        out.x = this._data[offset];
        out.y = this._data[offset + 1];
        out.z = this._data[offset + 2];
        return out;
    }

    setVec3At (val: Vec3, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] = val.x;
        this._data[offset + 1] = val.y;
        this._data[offset + 2] = val.z;
    }

    set3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] = x;
        this._data[offset + 1] = y;
        this._data[offset + 2] = z;
    }

    setXAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] = val;
    }

    setYAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset + 1] = val;
    }

    setZAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset + 2] = val;
    }

    set1fAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] = val;
        this._data[offset + 1] = val;
        this._data[offset + 2] = val;
    }

    addVec3At (val: Vec3, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] += val.x;
        this._data[offset + 1] += val.y;
        this._data[offset + 2] += val.z;
    }

    add3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] += x;
        this._data[offset + 1] += y;
        this._data[offset + 2] += z;
    }

    addXAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] += val;
    }

    addYAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset + 1] += val;
    }

    addZAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset + 2] += val;
    }

    multiplyVec3At (val: Vec3, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] *= val.x;
        this._data[offset + 1] *= val.y;
        this._data[offset + 2] *= val.z;
    }

    multiply3fAt (x: number, y: number, z: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] *= x;
        this._data[offset + 1] *= y;
        this._data[offset + 2] *= z;
    }

    multiply1fAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] *= val;
        this._data[offset + 1] *= val;
        this._data[offset + 2] *= val;
    }

    add1fAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] += val;
        this._data[offset + 1] += val;
        this._data[offset + 2] += val;
    }

    fill1f (val: number, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if (toIndex - fromIndex > 1000) {
            this._data.fill(val, fromIndex * 3, toIndex * 3);
        } else {
            const data = this._data;
            for (let i = fromIndex * 3, length = toIndex * 3; i < length; i++) {
                data[i] = val;
            }
        }
    }
}

export class ParticleFloatParameter extends ParticleParameter {
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

    fill (val: number, fromIndex: number, toIndex: number) {
        if ((toIndex - fromIndex) > 1000) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }
}

export class ParticleUint32Parameter extends ParticleParameter {
    get data () {
        return this._data;
    }

    get type (): ParticleParameterType {
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

    fill (val: number, fromIndex: number, toIndex: number) {
        if ((toIndex - fromIndex) > 1000) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }
}

export enum ParticleParameterType {
    FLOAT,
    VEC3,
    COLOR,
    UINT32,
}

export class ParticleColorParameter extends ParticleParameter {
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
        if ((toIndex - fromIndex) > 1000) {
            this._data.fill(val, fromIndex, toIndex);
        } else {
            const data = this._data;
            for (let i = fromIndex; i < toIndex; i++) {
                data[i] = val;
            }
        }
    }

    fillColor (color: Color, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        const val = Color.toUint32(color);
        this.fillUint32(val, fromIndex, toIndex);
    }

    copyFrom (src: ParticleColorParameter, fromIndex: ParticleHandle, toIndex: ParticleHandle) {
        if ((toIndex - fromIndex) > 1000) {
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
