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

import { assertIsTrue } from '../core';
import { ParticleArrayParameter, ParticleBoolArrayParameter, ParticleColorArrayParameter, ParticleFloatArrayParameter, ParticleParameterType, ParticleUint32ArrayParameter, ParticleVec3ArrayParameter } from './particle-parameter';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;
export const MAX_BUILTIN_PARAMETER_COUNT = 32;
export const MAX_CUSTOM_PARAMETER_COUNT = 32;

export enum BuiltinParticleParameterName {
    ID = 'id',
    RANDOM_SEED = 'random-seed',
    INV_START_LIFETIME = 'inv-start-lifetime',
    NORMALIZED_ALIVE_TIME = 'normalized-alive-time',
    IS_DEAD = 'is-dead',
    POSITION = 'position',
    START_DIR = 'start-dir',
    BASE_VELOCITY = 'base-velocity',
    VELOCITY = 'velocity',
    ROTATION = 'rotation',
    AXIS_OF_ROTATION = 'axis-of-rotation',
    ANGULAR_VELOCITY = 'angular-velocity',
    FRAME_INDEX = 'frame-index',
    BASE_SIZE = 'base-size',
    SIZE = 'size',
    BASE_COLOR = 'base-color',
    COLOR = 'color',
    SPAWN_TIME_RATIO = 'spawn-time-ratio',
    SPAWN_NORMALIZED_TIME = 'spawn-normalized-time',
    VEC3_REGISTER = 'vec3-register',
    FLOAT_REGISTER = 'float-register'
}
/**
 * Keep same with BuiltinParticleParameterName.
 */
export enum BuiltinParticleParameter {
    ID,
    RANDOM_SEED,
    INV_START_LIFETIME,
    NORMALIZED_ALIVE_TIME,
    IS_DEAD,
    POSITION,
    START_DIR,
    BASE_VELOCITY,
    VELOCITY,
    ROTATION,
    AXIS_OF_ROTATION,
    ANGULAR_VELOCITY,
    FRAME_INDEX,
    BASE_SIZE,
    SIZE,
    BASE_COLOR,
    COLOR,
    SPAWN_TIME_RATIO,
    SPAWN_NORMALIZED_TIME,
    VEC3_REGISTER,
    FLOAT_REGISTER,
    COUNT,
}

export enum BuiltinParticleParameterFlags {
    ID = 1 << BuiltinParticleParameter.ID,
    RANDOM_SEED = 1 << BuiltinParticleParameter.RANDOM_SEED,
    INV_START_LIFETIME = 1 << BuiltinParticleParameter.INV_START_LIFETIME,
    NORMALIZED_ALIVE_TIME = 1 << BuiltinParticleParameter.NORMALIZED_ALIVE_TIME,
    IS_DEAD = 1 << BuiltinParticleParameter.IS_DEAD,
    POSITION = 1 << BuiltinParticleParameter.POSITION,
    START_DIR = 1 << BuiltinParticleParameter.START_DIR,
    BASE_VELOCITY = 1 << BuiltinParticleParameter.BASE_VELOCITY,
    VELOCITY = 1 << BuiltinParticleParameter.VELOCITY,
    ROTATION = 1 << BuiltinParticleParameter.ROTATION,
    AXIS_OF_ROTATION = 1 << BuiltinParticleParameter.AXIS_OF_ROTATION,
    ANGULAR_VELOCITY = 1 << BuiltinParticleParameter.ANGULAR_VELOCITY,
    FRAME_INDEX = 1 << BuiltinParticleParameter.FRAME_INDEX,
    BASE_SIZE = 1 << BuiltinParticleParameter.BASE_SIZE,
    SIZE = 1 << BuiltinParticleParameter.SIZE,
    BASE_COLOR = 1 << BuiltinParticleParameter.BASE_COLOR,
    COLOR = 1 << BuiltinParticleParameter.COLOR,
    SPAWN_TIME_RATIO = 1 << BuiltinParticleParameter.SPAWN_TIME_RATIO,
    SPAWN_NORMALIZED_TIME = 1 << BuiltinParticleParameter.SPAWN_NORMALIZED_TIME,
    VEC3_REGISTER = 1 << BuiltinParticleParameter.VEC3_REGISTER,
    FLOAT_REGISTER = 1 << BuiltinParticleParameter.FLOAT_REGISTER,
}

export const BuiltinParticleParameterID2Name = {
    [BuiltinParticleParameter.ID]: BuiltinParticleParameterName.ID,
    [BuiltinParticleParameter.RANDOM_SEED]: BuiltinParticleParameterName.RANDOM_SEED,
    [BuiltinParticleParameter.INV_START_LIFETIME]: BuiltinParticleParameterName.INV_START_LIFETIME,
    [BuiltinParticleParameter.NORMALIZED_ALIVE_TIME]: BuiltinParticleParameterName.NORMALIZED_ALIVE_TIME,
    [BuiltinParticleParameter.IS_DEAD]: BuiltinParticleParameterName.IS_DEAD,
    [BuiltinParticleParameter.POSITION]: BuiltinParticleParameterName.POSITION,
    [BuiltinParticleParameter.START_DIR]: BuiltinParticleParameterName.START_DIR,
    [BuiltinParticleParameter.BASE_VELOCITY]: BuiltinParticleParameterName.BASE_VELOCITY,
    [BuiltinParticleParameter.VELOCITY]: BuiltinParticleParameterName.VELOCITY,
    [BuiltinParticleParameter.ROTATION]: BuiltinParticleParameterName.ROTATION,
    [BuiltinParticleParameter.AXIS_OF_ROTATION]: BuiltinParticleParameterName.AXIS_OF_ROTATION,
    [BuiltinParticleParameter.ANGULAR_VELOCITY]: BuiltinParticleParameterName.ANGULAR_VELOCITY,
    [BuiltinParticleParameter.FRAME_INDEX]: BuiltinParticleParameterName.FRAME_INDEX,
    [BuiltinParticleParameter.BASE_SIZE]: BuiltinParticleParameterName.BASE_SIZE,
    [BuiltinParticleParameter.SIZE]: BuiltinParticleParameterName.SIZE,
    [BuiltinParticleParameter.BASE_COLOR]: BuiltinParticleParameterName.BASE_COLOR,
    [BuiltinParticleParameter.COLOR]: BuiltinParticleParameterName.COLOR,
    [BuiltinParticleParameter.SPAWN_TIME_RATIO]: BuiltinParticleParameterName.SPAWN_TIME_RATIO,
    [BuiltinParticleParameter.SPAWN_NORMALIZED_TIME]: BuiltinParticleParameterName.SPAWN_NORMALIZED_TIME,
    [BuiltinParticleParameter.VEC3_REGISTER]: BuiltinParticleParameterName.VEC3_REGISTER,
    [BuiltinParticleParameter.FLOAT_REGISTER]: BuiltinParticleParameterName.FLOAT_REGISTER,
};

export class ParticleDataSet {
    get capacity () {
        return this._capacity;
    }

    get count () {
        return this._count;
    }

    get id () {
        return this.getParameterNoCheck<ParticleUint32ArrayParameter>(BuiltinParticleParameter.ID);
    }

    get position () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.POSITION);
    }

    get randomSeed () {
        return this.getParameterNoCheck<ParticleUint32ArrayParameter>(BuiltinParticleParameter.RANDOM_SEED);
    }

    get invStartLifeTime () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.INV_START_LIFETIME);
    }

    get normalizedAliveTime () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
    }

    get isDead () {
        return this.getParameterNoCheck<ParticleBoolArrayParameter>(BuiltinParticleParameter.IS_DEAD);
    }

    get frameIndex () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.FRAME_INDEX);
    }

    get baseVelocity () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.BASE_VELOCITY);
    }

    get velocity () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.VELOCITY);
    }

    get startDir () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.START_DIR);
    }

    get rotation () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.ROTATION);
    }

    get axisOfRotation () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.AXIS_OF_ROTATION);
    }

    get angularVelocity () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.ANGULAR_VELOCITY);
    }

    get baseSize () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.BASE_SIZE);
    }

    get size () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.SIZE);
    }

    get baseColor () {
        return this.getParameterNoCheck<ParticleColorArrayParameter>(BuiltinParticleParameter.BASE_COLOR);
    }

    get color () {
        return this.getParameterNoCheck<ParticleColorArrayParameter>(BuiltinParticleParameter.COLOR);
    }

    get spawnTimeRatio () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.SPAWN_TIME_RATIO);
    }

    get spawnNormalizedTime () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME);
    }

    get vec3Register () {
        return this.getParameterNoCheck<ParticleVec3ArrayParameter>(BuiltinParticleParameter.VEC3_REGISTER);
    }

    get floatRegister () {
        return this.getParameterNoCheck<ParticleFloatArrayParameter>(BuiltinParticleParameter.FLOAT_REGISTER);
    }

    private _count = 0;
    private _capacity = 16;
    private _parameterCount = 0;
    private _builtinParameterFlags = 0;
    private _customParameterFlags = 0;
    private _parameters: ParticleArrayParameter[] = [];
    private _parameterMap: Record<number, ParticleArrayParameter | null> = {};

    getParameter<T extends ParticleArrayParameter> (id: number) {
        if (!this.hasParameter(id)) {
            return null;
        }
        return this.getParameterNoCheck<T>(id);
    }

    getParameterNoCheck<T extends ParticleArrayParameter> (id: number) {
        return this._parameterMap[id] as T;
    }

    hasParameter (id: number) {
        return id < MAX_BUILTIN_PARAMETER_COUNT ? (this._builtinParameterFlags & (1 << id)) : (this._customParameterFlags & (1 << (id - MAX_BUILTIN_PARAMETER_COUNT)));
    }

    addBuiltinParameter (id: BuiltinParticleParameter) {
        switch (id) {
        case BuiltinParticleParameter.ID:
        case BuiltinParticleParameter.RANDOM_SEED:
            this.addParameter(id, ParticleParameterType.UINT32);
            break;
        case BuiltinParticleParameter.POSITION:
        case BuiltinParticleParameter.BASE_VELOCITY:
        case BuiltinParticleParameter.VELOCITY:
        case BuiltinParticleParameter.START_DIR:
        case BuiltinParticleParameter.BASE_SIZE:
        case BuiltinParticleParameter.SIZE:
        case BuiltinParticleParameter.ROTATION:
        case BuiltinParticleParameter.ANGULAR_VELOCITY:
        case BuiltinParticleParameter.AXIS_OF_ROTATION:
        case BuiltinParticleParameter.VEC3_REGISTER:
            this.addParameter(id, ParticleParameterType.VEC3);
            break;
        case BuiltinParticleParameter.COLOR:
        case BuiltinParticleParameter.BASE_COLOR:
            this.addParameter(id, ParticleParameterType.COLOR);
            break;
        case BuiltinParticleParameter.FRAME_INDEX:
        case BuiltinParticleParameter.INV_START_LIFETIME:
        case BuiltinParticleParameter.NORMALIZED_ALIVE_TIME:
        case BuiltinParticleParameter.SPAWN_TIME_RATIO:
        case BuiltinParticleParameter.FLOAT_REGISTER:
            this.addParameter(id, ParticleParameterType.FLOAT);
            break;
        case BuiltinParticleParameter.IS_DEAD:
            this.addParameter(id, ParticleParameterType.BOOL);
            break;
        default:
        }
    }

    addParameter (id: number, type: ParticleParameterType) {
        if (this.hasParameter(id)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (type) {
        case ParticleParameterType.FLOAT:
            this.addParameter_internal(id, new ParticleFloatArrayParameter());
            break;
        case ParticleParameterType.VEC3:
            this.addParameter_internal(id, new ParticleVec3ArrayParameter());
            break;
        case ParticleParameterType.COLOR:
            this.addParameter_internal(id, new ParticleColorArrayParameter());
            break;
        case ParticleParameterType.UINT32:
            this.addParameter_internal(id, new ParticleUint32ArrayParameter());
            break;
        case ParticleParameterType.BOOL:
            this.addParameter_internal(id, new ParticleBoolArrayParameter());
            break;
        default:
            throw new Error('Unknown particle parameter type!');
        }
    }

    addParameter_internal (id: number, parameter: ParticleArrayParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
        if (id < MAX_BUILTIN_PARAMETER_COUNT) {
            this._builtinParameterFlags |= (1 << id);
        } else {
            this._customParameterFlags |= (1 << (id - MAX_BUILTIN_PARAMETER_COUNT));
        }
        parameter.reserve(this._capacity);
    }

    removeParameter (id: number) {
        if (!this.hasParameter(id)) {
            return;
        }
        const parameter = this._parameterMap[id];
        assertIsTrue(parameter);
        this._parameterMap[id] = null;
        const index = this._parameters.indexOf(parameter);
        this._parameters.splice(index, 1);
        this._parameterCount--;
        if (id < MAX_BUILTIN_PARAMETER_COUNT) {
            this._builtinParameterFlags &= ~(1 << id);
        } else {
            this._customParameterFlags &= ~(1 << (id - MAX_BUILTIN_PARAMETER_COUNT));
        }
    }

    addParticles (count: number) {
        let reservedCount = this.capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        this._count += count;
    }

    removeParticle (handle: ParticleHandle) {
        assertIsTrue(handle >= 0 && handle < this._count);
        const lastParticle = this._count - 1;
        if (lastParticle !== handle) {
            const parameters = this._parameters;
            for (let i = 0, length = this._parameterCount; i < length; i++) {
                parameters[i].move(lastParticle, handle);
            }
        }
        this._count -= 1;
    }

    reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            parameters[i].reserve(capacity);
        }
    }

    ensureBuiltinParameters (builtinParameterRequirement: number) {
        if (builtinParameterRequirement !== this._builtinParameterFlags) {
            for (let i = 0; i < BuiltinParticleParameter.COUNT; i++) {
                if ((builtinParameterRequirement & 1 << i) && !this.hasParameter(i)) {
                    this.addBuiltinParameter(i);
                } else if (!(builtinParameterRequirement & 1 << i) && this.hasParameter(i)) {
                    this.removeParameter(i);
                }
            }
        }
    }

    clear () {
        this._count = 0;
    }

    reset () {
        this._count = 0;
        this._parameters.length = 0;
        this._parameterMap = {};
        this._parameterCount = 0;
    }
}
