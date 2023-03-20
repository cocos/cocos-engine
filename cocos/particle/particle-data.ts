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

import { assert, Color, Vec3 } from '../core';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;
const DEFAULT_CAPACITY = 16;

export abstract class ParticleParameter {
    get capacity () {
        return this._capacity;
    }

    protected _capacity = DEFAULT_CAPACITY;

    abstract reserve (capacity: number);
    abstract move (a: ParticleHandle, b: ParticleHandle);
}

export class ParticleVec3Parameter extends ParticleParameter {
    get data () {
        return this._data;
    }

    private _data = new Float32Array(3 * this._capacity);

    static add (out: Vec3, a: ParticleVec3Parameter, b: ParticleVec3Parameter, handle: number) {
        const xOffset = handle * 3;
        const yOffset = xOffset + 1;
        const zOffset = yOffset + 1;
        const aData = a.data;
        const bData = b.data;
        out.x = aData[xOffset] + bData[xOffset];
        out.y = aData[yOffset] + bData[yOffset];
        out.z = aData[zOffset] + bData[zOffset];
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

    add1fAt (val: number, handle: ParticleHandle) {
        const offset = handle * 3;
        this._data[offset] += val;
        this._data[offset + 1] += val;
        this._data[offset + 2] += val;
    }

    fill1f (val: number, start: ParticleHandle, end: ParticleHandle) {
        if (end - start > 1000) {
            this._data.fill(val, start * 3, end * 3);
        } else {
            const data = this._data;
            for (let i = start * 3, length = end * 3; i < length; i++) {
                data[i] = val;
            }
        }
    }
}

export class ParticleColorParameter extends ParticleParameter {
    get data () {
        return this._data;
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

    multiplyColorAt (color: Color, handle: ParticleHandle) {
        Color.fromUint32(tempColor, this._data[handle]);
        tempColor.multiply(color);
        this._data[handle] = Color.toUint32(tempColor);
    }
}

const tempColor = new Color();
export class ParticleData {
    get capacity () {
        return this._capacity;
    }

    get count () {
        return this._count;
    }

    get id () {
        return this._id;
    }

    get position () {
        return this._position;
    }

    get randomSeed () {
        return this._randomSeed;
    }

    get invStartLifeTime () {
        return this._invStartLifeTime;
    }

    get normalizedAliveTime () {
        return this._normalizedAliveTime;
    }

    get frameIndex () {
        return this._frameIndex;
    }

    get noise () {
        return this._noise;
    }

    get velocity () {
        return this._velocity;
    }

    get startDir () {
        return this._startDir;
    }

    get animatedVelocity () {
        return this._animatedVelocity;
    }

    get rotation () {
        return this._rotation;
    }

    get axisOfRotation () {
        return this._axisOfRotation;
    }

    get angularVelocity () {
        return this._angularVelocity;
    }

    get speedModifier () {
        return this._speedModifier;
    }

    get size () {
        return this._size;
    }

    get startSize () {
        return this._startSize;
    }

    get startColor () {
        return this._startColor;
    }

    get color () {
        return this._color;
    }
    private _maxId = 1;
    private _count = 0;
    private _capacity = DEFAULT_CAPACITY;
    private _id = new Uint32Array(this._capacity);
    private _position = new ParticleVec3Parameter();
    private _velocity = new ParticleVec3Parameter();
    private _startDir = new ParticleVec3Parameter();
    private _animatedVelocity = new ParticleVec3Parameter();
    private _rotation = new ParticleVec3Parameter();
    private _axisOfRotation = new ParticleVec3Parameter();
    private _angularVelocity = new ParticleVec3Parameter();
    private _startSize = new ParticleVec3Parameter();
    private _size = new ParticleVec3Parameter();
    private _noise = new ParticleVec3Parameter();
    private _speedModifier = new Float32Array(this._capacity);
    private _startColor = new ParticleColorParameter();
    private _color = new ParticleColorParameter();
    private _randomSeed = new Uint32Array(this._capacity);
    private _invStartLifeTime = new Float32Array(this._capacity);
    private _normalizedAliveTime = new Float32Array(this._capacity);
    private _frameIndex = new Float32Array(this._capacity);

    addParticles (count: number) {
        let reservedCount = this._capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        for (let i = 0; i < count; ++i) {
            this.resetParticle(this._count++);
        }
    }

    removeParticle (handle: ParticleHandle) {
        assert(handle >= 0 && handle < this._count);
        const lastParticle = this._count - 1;
        if (lastParticle !== handle) {
            this._id[handle] = this._id[lastParticle];
            this._position.move(lastParticle, handle);
            this._velocity.move(lastParticle, handle);
            this._startDir.move(lastParticle, handle);
            this._animatedVelocity.move(lastParticle, handle);
            this._speedModifier[handle] = this._speedModifier[lastParticle];
            this._rotation.move(lastParticle, handle);
            this._axisOfRotation.move(lastParticle, handle);
            this._angularVelocity.move(lastParticle, handle);
            this._startSize.move(lastParticle, handle);
            this._size.move(lastParticle, handle);
            this._startColor.move(lastParticle, handle);
            this._color.move(lastParticle, handle);
            this._randomSeed[handle] = this._randomSeed[lastParticle];
            this._invStartLifeTime[handle] = this._invStartLifeTime[lastParticle];
            this._normalizedAliveTime[handle] = this._normalizedAliveTime[lastParticle];
            this._frameIndex[handle] = this._frameIndex[lastParticle];
            this._noise.move(lastParticle, handle);
        }
        this._count -= 1;
    }

    resetParticle (handle: ParticleHandle) {
        this._id[handle] = this._maxId++;
        this._position.set1fAt(0, handle);
        this._velocity.set1fAt(0, handle);
        this._startDir.set3fAt(0, 0, 1, handle);
        this._animatedVelocity.set1fAt(0, handle);
        this._speedModifier[handle] = 1;
        this._rotation.set1fAt(0, handle);
        this._axisOfRotation.set1fAt(0, handle);
        this._angularVelocity.set1fAt(0, handle);
        this._startSize.set1fAt(1, handle);
        this._size.set1fAt(1, handle);
        this._startColor.setColorAt(Color.WHITE, handle);
        this._color.setColorAt(Color.WHITE, handle);
        this._randomSeed[handle] = 0;
        this._invStartLifeTime[handle] = 1;
        this._normalizedAliveTime[handle] = 0;
        this._frameIndex[handle] = 0;
        this._noise.set1fAt(0, handle);
    }

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const oldId = this._id;
        const oldRandomSeed = this._randomSeed;
        const oldInvStartLifeTime = this._invStartLifeTime;
        const oldNormalizedAliveTime = this._normalizedAliveTime;
        const oldFrameIndex = this._frameIndex;
        const oldSpeedModifier = this._speedModifier;
        this._id = new Uint32Array(capacity);
        this._id.set(oldId);
        this._position.reserve(capacity);
        this._velocity.reserve(capacity);
        this._startDir.reserve(capacity);
        this._animatedVelocity.reserve(capacity);
        this._speedModifier = new Float32Array(capacity);
        this._speedModifier.set(oldSpeedModifier);
        this._rotation.reserve(capacity);
        this._axisOfRotation.reserve(capacity);
        this._angularVelocity.reserve(capacity);
        this._startSize.reserve(capacity);
        this._size.reserve(capacity);
        this._startColor.reserve(capacity);
        this._color.reserve(capacity);
        this._randomSeed = new Uint32Array(capacity);
        this._randomSeed.set(oldRandomSeed);
        this._invStartLifeTime = new Float32Array(capacity);
        this._invStartLifeTime.set(oldInvStartLifeTime);
        this._normalizedAliveTime = new Float32Array(capacity);
        this._normalizedAliveTime.set(oldNormalizedAliveTime);
        this._frameIndex = new Float32Array(capacity);
        this._frameIndex.set(oldFrameIndex);
        this._noise.reserve(capacity);
    }

    clear () {
        this._count = 0;
    }
}
