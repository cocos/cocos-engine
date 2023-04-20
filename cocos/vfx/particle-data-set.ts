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
import { assertIsTrue } from '../core';
import { ParticleParameter, ParticleBoolParameter, ParticleColorParameter, ParticleFloatParameter, VFXParameterIdentity, ParticleUint32Parameter, ParticleVec3Parameter } from './particle-parameter';
import { VFXParameterType } from './enum';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;
export const MAX_PARAMETER_COUNT = 32;

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
    MESH_ORIENTATION = 'mesh-orientation',
    ANGULAR_VELOCITY = 'angular-velocity',
    FRAME_INDEX = 'frame-index',
    RIBBON_ID = 'ribbon-id',
    RIBBON_LINK_ORDER = 'ribbon-link-order',
    BASE_RIBBON_WIDTH = 'base-ribbon-width',
    RIBBON_WIDTH = 'ribbon-width',
    BASE_SPRITE_SIZE = 'base-sprite-size',
    SPRITE_SIZE = 'sprite-size',
    BASE_SCALE = 'base-scale',
    SCALE = 'scale',
    BASE_COLOR = 'base-color',
    COLOR = 'color',
    SPAWN_TIME_RATIO = 'spawn-time-ratio',
    SPAWN_NORMALIZED_TIME = 'spawn-normalized-time',
    VISIBILITY_TAG = 'visibility-tag',
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
    MESH_ORIENTATION,
    ANGULAR_VELOCITY,
    FRAME_INDEX,
    RIBBON_ID,
    RIBBON_LINK_ORDER,
    BASE_RIBBON_WIDTH,
    RIBBON_WIDTH,
    BASE_SPRITE_SIZE,
    SPRITE_SIZE,
    BASE_SCALE,
    SCALE,
    BASE_COLOR,
    COLOR,
    SPAWN_TIME_RATIO,
    SPAWN_NORMALIZED_TIME,
    VISIBILITY_TAG,
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
    MESH_ORIENTATION = 1 << BuiltinParticleParameter.MESH_ORIENTATION,
    ANGULAR_VELOCITY = 1 << BuiltinParticleParameter.ANGULAR_VELOCITY,
    FRAME_INDEX = 1 << BuiltinParticleParameter.FRAME_INDEX,
    RIBBON_ID = 1 << BuiltinParticleParameter.RIBBON_ID,
    RIBBON_LINK_ORDER = 1 << BuiltinParticleParameter.RIBBON_LINK_ORDER,
    BASE_RIBBON_WIDTH = 1 << BuiltinParticleParameter.BASE_RIBBON_WIDTH,
    RIBBON_WIDTH = 1 << BuiltinParticleParameter.RIBBON_WIDTH,
    BASE_SPRITE_SIZE = 1 << BuiltinParticleParameter.BASE_SPRITE_SIZE,
    SPRITE_SIZE = 1 << BuiltinParticleParameter.SPRITE_SIZE,
    BASE_SCALE = 1 << BuiltinParticleParameter.BASE_SCALE,
    SCALE = 1 << BuiltinParticleParameter.SCALE,
    BASE_COLOR = 1 << BuiltinParticleParameter.BASE_COLOR,
    COLOR = 1 << BuiltinParticleParameter.COLOR,
    SPAWN_TIME_RATIO = 1 << BuiltinParticleParameter.SPAWN_TIME_RATIO,
    SPAWN_NORMALIZED_TIME = 1 << BuiltinParticleParameter.SPAWN_NORMALIZED_TIME,
    VISIBILITY_TAG = 1 << BuiltinParticleParameter.VISIBILITY_TAG,
    VEC3_REGISTER = 1 << BuiltinParticleParameter.VEC3_REGISTER,
    FLOAT_REGISTER = 1 << BuiltinParticleParameter.FLOAT_REGISTER,
}

export const builtinParticleParameterIdentities = [
    new VFXParameterIdentity(BuiltinParticleParameter.ID, BuiltinParticleParameterName.ID, VFXParameterType.UINT32),
    new VFXParameterIdentity(BuiltinParticleParameter.RANDOM_SEED, BuiltinParticleParameterName.RANDOM_SEED, VFXParameterType.UINT32),
    new VFXParameterIdentity(BuiltinParticleParameter.INV_START_LIFETIME, BuiltinParticleParameterName.INV_START_LIFETIME, VFXParameterType.FLOAT),
    new VFXParameterIdentity(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME, BuiltinParticleParameterName.NORMALIZED_ALIVE_TIME, VFXParameterType.FLOAT),
    new VFXParameterIdentity(BuiltinParticleParameter.IS_DEAD, BuiltinParticleParameterName.IS_DEAD, VFXParameterType.BOOL),
    new VFXParameterIdentity(BuiltinParticleParameter.POSITION, BuiltinParticleParameterName.POSITION, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.START_DIR, BuiltinParticleParameterName.START_DIR, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.BASE_VELOCITY, BuiltinParticleParameterName.BASE_VELOCITY, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.VELOCITY, BuiltinParticleParameterName.VELOCITY, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.ROTATION, BuiltinParticleParameterName.ROTATION, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.MESH_ORIENTATION, BuiltinParticleParameterName.MESH_ORIENTATION, VFXParameterType.QUAT),
    new VFXParameterIdentity(BuiltinParticleParameter.ANGULAR_VELOCITY, BuiltinParticleParameterName.ANGULAR_VELOCITY, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.FRAME_INDEX, BuiltinParticleParameterName.FRAME_INDEX, VFXParameterType.FLOAT),
    new VFXParameterIdentity(BuiltinParticleParameter.BASE_SCALE, BuiltinParticleParameterName.BASE_SCALE, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.SCALE, BuiltinParticleParameterName.SCALE, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.BASE_COLOR, BuiltinParticleParameterName.BASE_COLOR, VFXParameterType.COLOR),
    new VFXParameterIdentity(BuiltinParticleParameter.COLOR, BuiltinParticleParameterName.COLOR, VFXParameterType.COLOR),
    new VFXParameterIdentity(BuiltinParticleParameter.SPAWN_TIME_RATIO, BuiltinParticleParameterName.SPAWN_TIME_RATIO, VFXParameterType.FLOAT),
    new VFXParameterIdentity(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME, BuiltinParticleParameterName.SPAWN_NORMALIZED_TIME, VFXParameterType.FLOAT),
    new VFXParameterIdentity(BuiltinParticleParameter.VEC3_REGISTER, BuiltinParticleParameterName.VEC3_REGISTER, VFXParameterType.VEC3),
    new VFXParameterIdentity(BuiltinParticleParameter.FLOAT_REGISTER, BuiltinParticleParameterName.FLOAT_REGISTER, VFXParameterType.FLOAT),
];

export class ParticleDataSet {
    public get capacity () {
        return this._capacity;
    }

    public get count () {
        return this._count;
    }

    public get id () {
        return this.getParameterUnsafe<ParticleUint32Parameter>(BuiltinParticleParameter.ID);
    }

    public get position () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.POSITION);
    }

    public get randomSeed () {
        return this.getParameterUnsafe<ParticleUint32Parameter>(BuiltinParticleParameter.RANDOM_SEED);
    }

    public get invStartLifeTime () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.INV_START_LIFETIME);
    }

    public get normalizedAliveTime () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
    }

    public get isDead () {
        return this.getParameterUnsafe<ParticleBoolParameter>(BuiltinParticleParameter.IS_DEAD);
    }

    public get frameIndex () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.FRAME_INDEX);
    }

    public get baseVelocity () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.BASE_VELOCITY);
    }

    public get velocity () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.VELOCITY);
    }

    public get startDir () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.START_DIR);
    }

    public get rotation () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.ROTATION);
    }

    public get angularVelocity () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.ANGULAR_VELOCITY);
    }

    public get baseSize () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.BASE_SIZE);
    }

    public get size () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.SIZE);
    }

    public get baseColor () {
        return this.getParameterUnsafe<ParticleColorParameter>(BuiltinParticleParameter.BASE_COLOR);
    }

    public get color () {
        return this.getParameterUnsafe<ParticleColorParameter>(BuiltinParticleParameter.COLOR);
    }

    public get spawnTimeRatio () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.SPAWN_TIME_RATIO);
    }

    public get spawnNormalizedTime () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME);
    }

    public get vec3Register () {
        return this.getParameterUnsafe<ParticleVec3Parameter>(BuiltinParticleParameter.VEC3_REGISTER);
    }

    public get floatRegister () {
        return this.getParameterUnsafe<ParticleFloatParameter>(BuiltinParticleParameter.FLOAT_REGISTER);
    }

    public get parameterCount () {
        return this._parameterCount;
    }

    private _count = 0;
    private _capacity = 16;
    private _parameterCount = 0;
    private _parameterFlags = 0;
    private _requiredParameterFlags = 0;
    private _parameters: ParticleParameter[] = [];
    private _parameterMap: Record<number, ParticleParameter | null> = {};

    public getParameter<T extends ParticleParameter> (id: number) {
        if (!this.hasParameter(id)) {
            return null;
        }
        return this.getParameterUnsafe<T>(id);
    }

    public getParameterUnsafe<T extends ParticleParameter> (id: number) {
        if (DEBUG) {
            assertIsTrue(id < MAX_PARAMETER_COUNT && id >= 0);
            assertIsTrue(this.hasParameter(id));
        }
        return this._parameterMap[id] as T;
    }

    public hasParameter (id: number) {
        if (DEBUG) {
            assertIsTrue(id < MAX_PARAMETER_COUNT && id >= 0);
        }
        return this._parameterFlags & (1 << id);
    }

    public addParameter (id: number, type: VFXParameterType) {
        if (DEBUG) {
            assertIsTrue(id < MAX_PARAMETER_COUNT && id >= 0);
        }
        if (this.hasParameter(id)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (type) {
        case VFXParameterType.FLOAT:
            this.addParameter_internal(id, new ParticleFloatParameter());
            break;
        case VFXParameterType.VEC3:
            this.addParameter_internal(id, new ParticleVec3Parameter());
            break;
        case VFXParameterType.COLOR:
            this.addParameter_internal(id, new ParticleColorParameter());
            break;
        case VFXParameterType.UINT32:
            this.addParameter_internal(id, new ParticleUint32Parameter());
            break;
        case VFXParameterType.BOOL:
            this.addParameter_internal(id, new ParticleBoolParameter());
            break;
        default:
            throw new Error('Unknown particle parameter type!');
        }
    }

    public removeParameter (id: number) {
        if (DEBUG) {
            assertIsTrue(id < MAX_PARAMETER_COUNT && id >= 0);
        }
        if (!this.hasParameter(id)) {
            return;
        }
        const parameter = this._parameterMap[id];
        if (DEBUG) {
            assertIsTrue(parameter);
        }
        this._parameterMap[id] = null;
        const index = this._parameters.indexOf(parameter!);
        this._parameters.splice(index, 1);
        this._parameterCount--;
        this._parameterFlags &= ~(1 << id);
    }

    public addParticles (count: number) {
        if (DEBUG) {
            assertIsTrue(count >= 0);
        }
        let reservedCount = this.capacity;
        while (this._count + count > reservedCount) {
            reservedCount *= 2;
        }
        this.reserve(reservedCount);
        this._count += count;
    }

    public removeParticle (handle: ParticleHandle) {
        if (DEBUG) {
            assertIsTrue(handle >= 0 && handle < this._count);
        }
        const lastParticle = this._count - 1;
        if (lastParticle !== handle) {
            const parameters = this._parameters;
            for (let i = 0, length = this._parameterCount; i < length; i++) {
                parameters[i].move(lastParticle, handle);
            }
        }
        this._count -= 1;
    }

    public reserve (capacity: number) {
        if (capacity <= this._capacity) return;
        this._capacity = capacity;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            parameters[i].reserve(capacity);
        }
    }

    public ensureParameters (parameterIdentities: VFXParameterIdentity[]) {
        if (this._requiredParameterFlags !== this._parameterFlags) {
            for (let i = 0; i < parameterIdentities.length; i++) {
                const { id, type } = parameterIdentities[i];
                if ((this._requiredParameterFlags & 1 << id) && !this.hasParameter(id)) {
                    this.addParameter(id, type);
                } else if (!(this._requiredParameterFlags & 1 << id) && this.hasParameter(id)) {
                    this.removeParameter(id);
                }
            }
        }
    }

    public clear () {
        this._count = 0;
    }

    public reset () {
        this._count = 0;
        this._parameters.length = 0;
        this._parameterMap = {};
        this._parameterCount = 0;
    }

    public markRequiredParameters (flags: number) {
        this._requiredParameterFlags |= flags;
    }

    public clearRequiredParameters () {
        this._requiredParameterFlags = 0;
    }

    private addParameter_internal (id: number, parameter: ParticleParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
        this._parameterFlags |= (1 << id);
        parameter.reserve(this._capacity);
    }
}
