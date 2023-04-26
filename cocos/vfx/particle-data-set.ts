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
import { ArrayParameter, BoolArrayParameter, ColorArrayParameter, FloatArrayParameter, VFXParameterIdentity, Uint32ArrayParameter, Vec3ArrayParameter } from './vfx-parameter';
import { ParameterNameSpace, VFXParameterType } from './enum';

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;

let builtinParameterId = 0;
export const ID = new VFXParameterIdentity(builtinParameterId++, 'id', VFXParameterType.UINT32, ParameterNameSpace.PARTICLE);
export const RANDOM_SEED = new VFXParameterIdentity(builtinParameterId++, 'random-seed', VFXParameterType.UINT32, ParameterNameSpace.PARTICLE);
export const INV_START_LIFETIME = new VFXParameterIdentity(builtinParameterId++, 'inv-start-lifetime', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const NORMALIZED_AGE = new VFXParameterIdentity(builtinParameterId++, 'normalized-age', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const IS_DEAD = new VFXParameterIdentity(builtinParameterId++, 'is-dead', VFXParameterType.BOOL, ParameterNameSpace.PARTICLE);
export const HAS_COLLIDED = new VFXParameterIdentity(builtinParameterId++, 'has-collided', VFXParameterType.BOOL, ParameterNameSpace.PARTICLE);
export const POSITION = new VFXParameterIdentity(builtinParameterId++, 'position', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const INITIAL_DIR = new VFXParameterIdentity(builtinParameterId++, 'initial-dir', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const PHYSICS_FORCE = new VFXParameterIdentity(builtinParameterId++, 'physics-force', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const BASE_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'base-velocity', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'velocity', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const SPRITE_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'sprite-rotation', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const MESH_ORIENTATION = new VFXParameterIdentity(builtinParameterId++, 'mesh-orientation', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX2 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index2', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX3 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index3', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX4 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index4', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const RIBBON_ID = new VFXParameterIdentity(builtinParameterId++, 'ribbon-id', VFXParameterType.UINT32, ParameterNameSpace.PARTICLE);
export const RIBBON_LINK_ORDER = new VFXParameterIdentity(builtinParameterId++, 'ribbon-link-order', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const BASE_RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'base-ribbon-width', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'ribbon-width', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const BASE_SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'base-sprite-size', VFXParameterType.VEC2, ParameterNameSpace.PARTICLE);
export const SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'sprite-size', VFXParameterType.VEC2, ParameterNameSpace.PARTICLE);
export const BASE_SCALE = new VFXParameterIdentity(builtinParameterId++, 'base-scale', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const SCALE = new VFXParameterIdentity(builtinParameterId++, 'scale', VFXParameterType.VEC3, ParameterNameSpace.PARTICLE);
export const BASE_COLOR = new VFXParameterIdentity(builtinParameterId++, 'base-color', VFXParameterType.COLOR, ParameterNameSpace.PARTICLE);
export const COLOR = new VFXParameterIdentity(builtinParameterId++, 'color', VFXParameterType.COLOR, ParameterNameSpace.PARTICLE);
export const SPAWN_TIME_RATIO = new VFXParameterIdentity(builtinParameterId++, 'spawn-time-ratio', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const SPAWN_NORMALIZED_TIME = new VFXParameterIdentity(builtinParameterId++, 'spawn-normalized-time', VFXParameterType.FLOAT, ParameterNameSpace.PARTICLE);
export const VISIBILITY_TAG = new VFXParameterIdentity(builtinParameterId++, 'visibility-tag', VFXParameterType.UINT32, ParameterNameSpace.PARTICLE);

export const builtinParticleParameterIdentities = [
    ID,
    RANDOM_SEED,
    INV_START_LIFETIME,
    NORMALIZED_AGE,
    IS_DEAD,
    HAS_COLLIDED,
    POSITION,
    INITIAL_DIR,
    PHYSICS_FORCE,
    BASE_VELOCITY,
    VELOCITY,
    SPRITE_ROTATION,
    MESH_ORIENTATION,
    SUB_UV_INDEX,
    SUB_UV_INDEX2,
    SUB_UV_INDEX3,
    SUB_UV_INDEX4,
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
];

export class ParticleDataSet {
    public get capacity () {
        return this._capacity;
    }

    public get count () {
        return this._count;
    }

    public get id () {
        return this.getParameterUnsafe<Uint32ArrayParameter>(ID);
    }

    public get position () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.POSITION);
    }

    public get randomSeed () {
        return this.getParameterUnsafe<Uint32ArrayParameter>(BuiltinParticleParameter.RANDOM_SEED);
    }

    public get invStartLifeTime () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.INV_START_LIFETIME);
    }

    public get normalizedAge () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.NORMALIZED_AGE);
    }

    public get isDead () {
        return this.getParameterUnsafe<BoolArrayParameter>(BuiltinParticleParameter.IS_DEAD);
    }

    public get subUVIndex () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.SUB_UV_INDEX);
    }

    public get physicsForce () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.PHYSICS_FORCE);
    }

    public get baseVelocity () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.BASE_VELOCITY);
    }

    public get velocity () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.VELOCITY);
    }

    public get initialDir () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.INITIAL_DIR);
    }

    public get rotation () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.ROTATION);
    }

    public get angularVelocity () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.ANGULAR_VELOCITY);
    }

    public get baseSpriteSize () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.BASE_SPRITE_SIZE);
    }

    public get spriteSize () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.SPRITE_SIZE);
    }

    public get baseScale () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.BASE_SCALE);
    }

    public get scale () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.SCALE);
    }

    public get baseColor () {
        return this.getParameterUnsafe<ColorArrayParameter>(BuiltinParticleParameter.BASE_COLOR);
    }

    public get color () {
        return this.getParameterUnsafe<ColorArrayParameter>(BuiltinParticleParameter.COLOR);
    }

    public get spawnTimeRatio () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.SPAWN_TIME_RATIO);
    }

    public get spawnNormalizedTime () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.SPAWN_NORMALIZED_TIME);
    }

    public get vec3Register () {
        return this.getParameterUnsafe<Vec3ArrayParameter>(BuiltinParticleParameter.VEC3_REGISTER);
    }

    public get floatRegister () {
        return this.getParameterUnsafe<FloatArrayParameter>(BuiltinParticleParameter.FLOAT_REGISTER);
    }

    public get parameterCount () {
        return this._parameterCount;
    }

    private _count = 0;
    private _capacity = 16;
    private _parameterCount = 0;
    private _requiredParameterFlags = 0;
    private _parameters: ArrayParameter[] = [];
    private _parameterMap: Record<number, ArrayParameter | null> = {};

    public getParameter<T extends ArrayParameter> (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            return null;
        }
        return this.getParameterUnsafe<T>(identity);
    }

    public getParameterUnsafe<T extends ArrayParameter> (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(this.hasParameter(identity));
        }
        return this._parameterMap[identity.id] as T;
    }

    public hasParameter (identity: VFXParameterIdentity) {
        return identity.id in this._parameterMap;
    }

    public addParameter (identity: VFXParameterIdentity) {
        if (this.hasParameter(identity)) {
            throw new Error('Already exist a particle parameter with same id!');
        }
        switch (identity.type) {
        case VFXParameterType.FLOAT:
            this.addParameter_internal(identity.id, new FloatArrayParameter());
            break;
        case VFXParameterType.VEC3:
            this.addParameter_internal(identity.id, new Vec3ArrayParameter());
            break;
        case VFXParameterType.COLOR:
            this.addParameter_internal(identity.id, new ColorArrayParameter());
            break;
        case VFXParameterType.UINT32:
            this.addParameter_internal(identity.id, new Uint32ArrayParameter());
            break;
        case VFXParameterType.BOOL:
            this.addParameter_internal(identity.id, new BoolArrayParameter());
            break;
        default:
            throw new Error('Unknown particle parameter type!');
        }
    }

    public removeParameter (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            return;
        }
        const parameter = this._parameterMap[identity.id];
        if (DEBUG) {
            assertIsTrue(parameter);
        }
        delete this._parameterMap[identity.id];
        const index = this._parameters.indexOf(parameter!);
        this._parameters.splice(index, 1);
        this._parameterCount--;
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

    private addParameter_internal (id: number, parameter: ArrayParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
        this._parameterFlags |= (1 << id);
        parameter.reserve(this._capacity);
    }
}
