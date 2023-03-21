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
import { assert, Color, Vec3 } from '../core';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;
const DEFAULT_CAPACITY = 16;

export enum BuiltinParticleParameterName {
    ID = 'id',
    RANDOM_SEED = 'random-seed',
    INV_START_LIFETIME = 'inv-start-lifetime',
    NORMALIZED_ALIVE_TIME = 'normalized-alive-time',
    POSITION = 'position',
    START_DIR = 'start-dir',
    VELOCITY = 'velocity',
    ANIMATED_VELOCITY = 'animated-velocity',
    ROTATION = 'rotation',
    AXIS_OF_ROTATION = 'axis-of-rotation',
    ANGULAR_VELOCITY = 'angular-velocity',
    SPEED_MODIFIER = 'speed-modifier',
    NOISE = 'noise',
    FRAME_INDEX = 'frame-index',
    START_SIZE = 'start-size',
    SIZE = 'size',
    START_COLOR = 'start-color',
    COLOR = 'color',
}

export enum BuiltinParticleParameter {
    ID,
    RANDOM_SEED,
    INV_START_LIFETIME,
    NORMALIZED_ALIVE_TIME,
    POSITION,
    START_DIR,
    VELOCITY,
    ANIMATED_VELOCITY,
    ROTATION,
    AXIS_OF_ROTATION,
    ANGULAR_VELOCITY,
    SPEED_MODIFIER,
    NOISE,
    FRAME_INDEX,
    START_SIZE,
    SIZE,
    START_COLOR,
    COLOR,
    COUNT,
}

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

    static addSingle (out: Vec3, a: ParticleVec3Parameter, b: ParticleVec3Parameter, handle: number) {
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

const tempColor = new Color();
export class ParticleData {
    get capacity () {
        return this._parameters[0] ? this._parameters[0].capacity : 0;
    }

    get count () {
        return this._count;
    }

    get id () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.ID)); }
        return this.getParameter(BuiltinParticleParameter.ID) as ParticleUint32Parameter;
        // return this._id;
    }

    get position () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.POSITION)); }
        return this.getParameter(BuiltinParticleParameter.POSITION) as ParticleVec3Parameter;
        // return this._position;
    }

    get randomSeed () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.RANDOM_SEED)); }
        return this.getParameter(BuiltinParticleParameter.RANDOM_SEED) as ParticleUint32Parameter;
        // return this._randomSeed;
    }

    get invStartLifeTime () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.INV_START_LIFETIME)); }
        return this.getParameter(BuiltinParticleParameter.INV_START_LIFETIME) as ParticleFloatParameter;
        // return this._invStartLifeTime;
    }

    get normalizedAliveTime () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME)); }
        return this.getParameter(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME) as ParticleFloatParameter;
        // return this._normalizedAliveTime;
    }

    get frameIndex () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.FRAME_INDEX)); }
        return this.getParameter(BuiltinParticleParameter.FRAME_INDEX) as ParticleFloatParameter;
        //return this._frameIndex;
    }

    get noise () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.NOISE)); }
        return this.getParameter(BuiltinParticleParameter.NOISE) as ParticleVec3Parameter;
        // return this._noise;
    }

    get velocity () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.VELOCITY)); }
        return this.getParameter(BuiltinParticleParameter.VELOCITY) as ParticleVec3Parameter;
        // return this._velocity;
    }

    get startDir () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.START_DIR)); }
        return this.getParameter(BuiltinParticleParameter.START_DIR) as ParticleVec3Parameter;
        // return this._startDir;
    }

    get animatedVelocity () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.ANIMATED_VELOCITY)); }
        return this.getParameter(BuiltinParticleParameter.ANIMATED_VELOCITY) as ParticleVec3Parameter;
        // return this._animatedVelocity;
    }

    get rotation () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.ROTATION)); }
        return this.getParameter(BuiltinParticleParameter.ROTATION) as ParticleVec3Parameter;
        // return this._rotation;
    }

    get axisOfRotation () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.AXIS_OF_ROTATION)); }
        return this.getParameter(BuiltinParticleParameter.AXIS_OF_ROTATION) as ParticleVec3Parameter;
        // return this._axisOfRotation;
    }

    get angularVelocity () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.ANGULAR_VELOCITY)); }
        return this.getParameter(BuiltinParticleParameter.ANGULAR_VELOCITY) as ParticleVec3Parameter;
        // return this._angularVelocity;
    }

    get speedModifier () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.SPEED_MODIFIER)); }
        return this.getParameter(BuiltinParticleParameter.SPEED_MODIFIER) as ParticleFloatParameter;
        // return this._speedModifier;
    }

    get size () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.SIZE)); }
        return this.getParameter(BuiltinParticleParameter.SIZE) as ParticleVec3Parameter;
        // return this._size;
    }

    get startSize () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.START_SIZE)); }
        return this.getParameter(BuiltinParticleParameter.START_SIZE) as ParticleVec3Parameter;
        // return this._startSize;
    }

    get startColor () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.START_COLOR)); }
        return this.getParameter(BuiltinParticleParameter.START_COLOR) as ParticleColorParameter;
        // return this._startColor;
    }

    get color () {
        if (DEBUG) { assert(this.hasParameter(BuiltinParticleParameter.COLOR)); }
        return this.getParameter(BuiltinParticleParameter.COLOR) as ParticleColorParameter;
        // return this._color;
    }

    private _count = 0;
    private _parameterCount = 0;
    private _parameterIds = new Uint8Array(8);
    private _parameters: ParticleParameter[] = [];
    // private _id = new ParticleUint32Parameter();
    // private _position = new ParticleVec3Parameter();
    // private _velocity = new ParticleVec3Parameter();
    // private _startDir = new ParticleVec3Parameter();
    // private _animatedVelocity = new ParticleVec3Parameter();
    // private _rotation = new ParticleVec3Parameter();
    // private _axisOfRotation = new ParticleVec3Parameter();
    // private _angularVelocity = new ParticleVec3Parameter();
    // private _startSize = new ParticleVec3Parameter();
    // private _size = new ParticleVec3Parameter();
    // private _noise = new ParticleVec3Parameter();
    // private _speedModifier = new ParticleFloatParameter();
    // private _startColor = new ParticleColorParameter();
    // private _color = new ParticleColorParameter();
    // private _randomSeed = new ParticleUint32Parameter();
    // private _invStartLifeTime = new ParticleFloatParameter();
    // private _normalizedAliveTime = new ParticleFloatParameter();
    // private _frameIndex = new ParticleFloatParameter();

    constructor () {
        this.addParameter(BuiltinParticleParameter.POSITION, new ParticleVec3Parameter());
    }

    getParameter (id: number) {
        const parameterIds = this._parameterIds;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            if (id === parameterIds[i]) {
                return parameters[i];
            }
        }
        return null;
    }

    hasParameter (id: number) {
        const parameterIds = this._parameterIds;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            if (id === parameterIds[i]) {
                return true;
            }
        }
        return false;
    }

    addParameter (id: number, parameter: ParticleParameter) {
        const parameterIds = this._parameterIds;
        const count = this._parameterCount;
        for (let i = 0; i < count; i++) {
            if (id === parameterIds[i]) {
                throw new Error('Already exist a particle parameter with same id!');
            }
        }
        if (parameterIds.length === count) {
            this._parameterIds = new Uint8Array(2 * count);
            this._parameterIds.set(parameterIds);
        }
        this._parameterIds[this._parameterCount++] = id;
        this._parameters.push(parameter);
    }

    removeParameter (id: number) {
        const parameterIds = this._parameterIds;
        const parameters = this._parameters;
        const count = this._parameterCount;
        for (let i = count - 1; i >= 0; i--) {
            if (id === parameterIds[i]) {
                parameterIds[i] = parameterIds[count - 1];
                parameters[i] = parameters[count - 1];
                parameters.length--;
                this._parameterCount--;
            }
        }
    }

    addParticles (count: number) {
        let reservedCount = this.capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        this._count += count;
        // this.resetParticles(this._count, this._count += count);
    }

    removeParticle (handle: ParticleHandle) {
        assert(handle >= 0 && handle < this._count);
        const lastParticle = this._count - 1;
        if (lastParticle !== handle) {
            for (let i = 0; i < this._parameterCount; i++) {
                this._parameters[i].move(lastParticle, handle);
            }
            // this._id.move(lastParticle, handle);
            // this._position.move(lastParticle, handle);
            // this._velocity.move(lastParticle, handle);
            // this._startDir.move(lastParticle, handle);
            // this._animatedVelocity.move(lastParticle, handle);
            // this._speedModifier[handle] = this._speedModifier[lastParticle];
            // this._rotation.move(lastParticle, handle);
            // this._axisOfRotation.move(lastParticle, handle);
            // this._angularVelocity.move(lastParticle, handle);
            // this._startSize.move(lastParticle, handle);
            // this._size.move(lastParticle, handle);
            // this._startColor.move(lastParticle, handle);
            // this._color.move(lastParticle, handle);
            // this._randomSeed.move(lastParticle, handle);
            // this._invStartLifeTime.move(lastParticle, handle);
            // this._normalizedAliveTime.move(lastParticle, handle);
            // this._frameIndex.move(lastParticle, handle);
            // this._noise.move(lastParticle, handle);
        }
        this._count -= 1;
    }

    // resetParticles (fromIndex: ParticleHandle, toIndex: ParticleHandle) {
    //     for (let i = fromIndex; i < toIndex; i++) {
    //         this._id.setUint32At(this._maxId++, i);
    //     }
    //     this._velocity.fill1f(0, fromIndex, toIndex);
    //     this._animatedVelocity.fill1f(0, fromIndex, toIndex);
    //     this._speedModifier.fill(1, fromIndex, toIndex);
    //     this._rotation.fill1f(0, fromIndex, toIndex);
    //     this._axisOfRotation.fill1f(0, fromIndex, toIndex);
    //     this._angularVelocity.fill1f(0, fromIndex, toIndex);
    //     this._startSize.fill1f(1, fromIndex, toIndex);
    //     this._size.fill1f(1, fromIndex, toIndex);
    //     this._startColor.fillColor(Color.WHITE, fromIndex, toIndex);
    //     this._color.fillColor(Color.WHITE, fromIndex, toIndex);
    //     this._randomSeed.fill(0, fromIndex, toIndex);
    //     this._invStartLifeTime.fill(1, fromIndex, toIndex);
    //     this._normalizedAliveTime.fill(0, fromIndex, toIndex);
    //     this._frameIndex.fill(0, fromIndex, toIndex);
    //     this._noise.fill1f(0, fromIndex, toIndex);
    // }

    reserve (capacity: number) {
        if (capacity <= this.capacity) return;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            parameters[i].reserve(capacity);
        }
        // this._id.reserve(capacity);
        // this._position.reserve(capacity);
        // this._velocity.reserve(capacity);
        // this._startDir.reserve(capacity);
        // this._animatedVelocity.reserve(capacity);
        // this._speedModifier.reserve(capacity);
        // this._rotation.reserve(capacity);
        // this._axisOfRotation.reserve(capacity);
        // this._angularVelocity.reserve(capacity);
        // this._startSize.reserve(capacity);
        // this._size.reserve(capacity);
        // this._startColor.reserve(capacity);
        // this._color.reserve(capacity);
        // this._randomSeed.reserve(capacity);
        // this._invStartLifeTime.reserve(capacity);
        // this._normalizedAliveTime.reserve(capacity);
        // this._frameIndex.reserve(capacity);
        // this._noise.reserve(capacity);
    }

    clear () {
        this._count = 0;
    }
}
