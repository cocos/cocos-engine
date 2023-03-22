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
import { assert } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { BitsBucket } from './particle-base';
import { ParticleColorParameter, ParticleFloatParameter, ParticleParameter, ParticleParameterIdentity, ParticleParameterType, ParticleUint32Parameter, ParticleVec3Parameter } from './particle-parameter';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;

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

@ccclass('cc.ParticleDataSet')
export class ParticleDataSet {
    get capacity () {
        return this._parameters[0] ? this._parameters[0].capacity : 0;
    }

    get count () {
        return this._count;
    }

    get id () {
        return this.getParameterNoCheck<ParticleUint32Parameter>(BuiltinParticleParameter.ID);
    }

    get position () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.POSITION);
    }

    get randomSeed () {
        return this.getParameterNoCheck<ParticleUint32Parameter>(BuiltinParticleParameter.RANDOM_SEED);
    }

    get invStartLifeTime () {
        return this.getParameterNoCheck<ParticleFloatParameter>(BuiltinParticleParameter.INV_START_LIFETIME);
    }

    get normalizedAliveTime () {
        return this.getParameterNoCheck<ParticleFloatParameter>(BuiltinParticleParameter.NORMALIZED_ALIVE_TIME);
    }

    get frameIndex () {
        return this.getParameterNoCheck<ParticleFloatParameter>(BuiltinParticleParameter.FRAME_INDEX);
    }

    get noise () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.NOISE);
    }

    get velocity () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.VELOCITY);
    }

    get startDir () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.START_DIR);
    }

    get animatedVelocity () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.ANIMATED_VELOCITY);
    }

    get rotation () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.ROTATION);
    }

    get axisOfRotation () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.AXIS_OF_ROTATION);
    }

    get angularVelocity () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.ANGULAR_VELOCITY);
    }

    get speedModifier () {
        return this.getParameterNoCheck<ParticleFloatParameter>(BuiltinParticleParameter.SPEED_MODIFIER);
    }

    get size () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.SIZE);
    }

    get startSize () {
        return this.getParameterNoCheck<ParticleVec3Parameter>(BuiltinParticleParameter.START_SIZE);
    }

    get startColor () {
        return this.getParameterNoCheck<ParticleColorParameter>(BuiltinParticleParameter.START_COLOR);
    }

    get color () {
        return this.getParameterNoCheck<ParticleColorParameter>(BuiltinParticleParameter.COLOR);
    }

    private _count = 0;
    private _parameterFlags = new BitsBucket();
    private _parameterCount = 0;
    private _parameterIds = new Uint8Array(8);
    private _parameters: ParticleParameter[] = [];
    @serializable
    private _customParameterId: number = BuiltinParticleParameter.COUNT;
    @serializable
    private _customParameterRegistry: ParticleParameterIdentity[] = [];

    getParameter<T extends ParticleParameter> (id: number) {
        if (!this.hasParameter(id)) {
            return null;
        }
        return this.getParameterNoCheck<T>(id);
    }

    getParameterNoCheck<T extends ParticleParameter> (id: number) {
        const parameterIds = this._parameterIds;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            if (id === parameterIds[i]) {
                return parameters[i] as T;
            }
        }
        throw new Error('Oops, should not be here. Please make sure the parameter exists before calling getParameterNoCheck');
    }

    hasParameter (id: number) {
        return this._parameterFlags.isMarked(id);
    }

    addBuiltinParameter (id: BuiltinParticleParameter) {
        switch (id) {
        case BuiltinParticleParameter.ID:
        case BuiltinParticleParameter.RANDOM_SEED:
            this.addParameter(id, new ParticleUint32Parameter());
            break;
        case BuiltinParticleParameter.POSITION:
        case BuiltinParticleParameter.VELOCITY:
        case BuiltinParticleParameter.ANIMATED_VELOCITY:
        case BuiltinParticleParameter.START_DIR:
        case BuiltinParticleParameter.START_SIZE:
        case BuiltinParticleParameter.SIZE:
        case BuiltinParticleParameter.ROTATION:
        case BuiltinParticleParameter.ANGULAR_VELOCITY:
        case BuiltinParticleParameter.AXIS_OF_ROTATION:
        case BuiltinParticleParameter.NOISE:
            this.addParameter(id, new ParticleVec3Parameter());
            break;
        case BuiltinParticleParameter.COLOR:
        case BuiltinParticleParameter.START_COLOR:
            this.addParameter(id, new ParticleColorParameter());
            break;
        case BuiltinParticleParameter.SPEED_MODIFIER:
        case BuiltinParticleParameter.FRAME_INDEX:
        case BuiltinParticleParameter.INV_START_LIFETIME:
        case BuiltinParticleParameter.NORMALIZED_ALIVE_TIME:
            this.addParameter(id, new ParticleFloatParameter());
            break;
        default:
        }
    }

    addParameter (id: number, parameter: ParticleParameter) {
        if (this._parameterFlags.isMarked(id)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        const parameterIds = this._parameterIds;
        const count = this._parameterCount;
        if (parameterIds.length === count) {
            this._parameterIds = new Uint8Array(2 * count);
            this._parameterIds.set(parameterIds);
        }
        this._parameterFlags.mark(id);
        this._parameterIds[this._parameterCount++] = id;
        this._parameters.push(parameter);
    }

    registerCustomParameter (name: string, type: ParticleParameterType) {
        const identity = new ParticleParameterIdentity(this._customParameterId++, name, type);
        this._customParameterRegistry.push(identity);
        return identity;
    }

    unregisterCustomParameter (name: string) {
        const index = this._customParameterRegistry.findIndex((identity) => identity.name === name);
        if (index >= 0) {
            this._customParameterRegistry.splice(index, 1);
        }
    }

    getCustomParameterIdentity (name: string) {
        return this._customParameterRegistry.find((identity) => identity.name === name);
    }

    removeParameter (id: number) {
        if (!this._parameterFlags.isMarked(id)) {
            return;
        }
        const parameterIds = this._parameterIds;
        const parameters = this._parameters;
        const count = this._parameterCount;
        for (let i = count - 1; i >= 0; i--) {
            if (id === parameterIds[i]) {
                parameterIds[i] = parameterIds[count - 1];
                parameters[i] = parameters[count - 1];
                this._parameterFlags.unmark(id);
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
    }

    removeParticle (handle: ParticleHandle) {
        assert(handle >= 0 && handle < this._count);
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
        if (capacity <= this.capacity) return;
        const parameters = this._parameters;
        for (let i = 0, length = this._parameterCount; i < length; i++) {
            parameters[i].reserve(capacity);
        }
    }

    ensureParameters (requiredParameters: BitsBucket) {
        if (requiredParameters.equals(this._parameterFlags)) return;
        // handle builtin parameters
        for (let i = 0; i < BuiltinParticleParameter.COUNT; i++) {
            if (requiredParameters.isMarked(i) && !this._parameterFlags.isMarked(i)) {
                this.addBuiltinParameter(i);
            } else if (!requiredParameters.isMarked(i) && this._parameterFlags.isMarked(i)) {
                this.removeParameter(i);
            }
        }
        // handle custom parameters
        const customParameterRegistry = this._customParameterRegistry;
        for (let i = 0, length = customParameterRegistry.length; i < length; i++) {
            const id = customParameterRegistry[i].id;
            if (requiredParameters.isMarked(id) && !this._parameterFlags.isMarked(id)) {
                switch (customParameterRegistry[i].type) {
                case ParticleParameterType.FLOAT:
                    this.addParameter(id, new ParticleFloatParameter());
                    break;
                case ParticleParameterType.VEC3:
                    this.addParameter(id, new ParticleVec3Parameter());
                    break;
                case ParticleParameterType.COLOR:
                    this.addParameter(id, new ParticleColorParameter());
                    break;
                case ParticleParameterType.UINT32:
                    this.addParameter(id, new ParticleUint32Parameter());
                    break;
                default:
                    throw new Error('Unknown particle parameter type!');
                }
            } else if (!requiredParameters.isMarked(id) && this._parameterFlags.isMarked(id)) {
                this.removeParameter(id);
            } else if (requiredParameters.isMarked(id) && this._parameterFlags.isMarked(id)) {
                const parameter = this.getParameterNoCheck(id);
                if (parameter.type !== customParameterRegistry[i].type) {
                    this.removeParameter(id);
                    switch (customParameterRegistry[i].type) {
                    case ParticleParameterType.FLOAT:
                        this.addParameter(id, new ParticleFloatParameter());
                        break;
                    case ParticleParameterType.VEC3:
                        this.addParameter(id, new ParticleVec3Parameter());
                        break;
                    case ParticleParameterType.COLOR:
                        this.addParameter(id, new ParticleColorParameter());
                        break;
                    case ParticleParameterType.UINT32:
                        this.addParameter(id, new ParticleUint32Parameter());
                        break;
                    default:
                        throw new Error('Unknown particle parameter type!');
                    }
                }
            }
        }
    }

    clear () {
        this._count = 0;
    }
}
