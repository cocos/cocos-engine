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
import { ArrayParameter, VFXParameterIdentity } from './vfx-parameter';
import { VFXParameterNameSpace, ParticleHandle, VFXParameterType } from './define';
import { BoolArrayParameter, ColorArrayParameter, FloatArrayParameter, Int32ArrayParameter, QuatArrayParameter, Uint32ArrayParameter, Uint8ArrayParameter, Vec2ArrayParameter, Vec3ArrayParameter, Vec4ArrayParameter } from './parameters';

export class ParticleDataSet {
    public get capacity () {
        return this._capacity;
    }

    public get count () {
        return this._count;
    }

    public get parameterCount () {
        return this._parameterCount;
    }

    private _count = 0;
    private _capacity = 16;
    private _parameterCount = 0;
    private _parameters: ArrayParameter[] = [];
    private _parameterMap: Record<number, ArrayParameter | null> = {};

    public getParameter<T extends ArrayParameter> (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            return null;
        }
        return this.getParameterUnsafe<T>(identity);
    }

    public getFloatParameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.FLOAT);
        }
        return this.getParameterUnsafe<FloatArrayParameter>(identity);
    }

    public getVec2Parameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC2);
        }
        return this.getParameterUnsafe<Vec2ArrayParameter>(identity);
    }

    public getVec3Parameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC3);
        }
        return this.getParameterUnsafe<Vec3ArrayParameter>(identity);
    }

    public getVec4Parameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC4);
        }
        return this.getParameterUnsafe<Vec4ArrayParameter>(identity);
    }

    public getColorParameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.COLOR);
        }
        return this.getParameterUnsafe<ColorArrayParameter>(identity);
    }

    public getUint32Parameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.UINT32);
        }
        return this.getParameterUnsafe<Uint32ArrayParameter>(identity);
    }

    public getBoolParameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.BOOL);
        }
        return this.getParameterUnsafe<BoolArrayParameter>(identity);
    }

    public getUint8Parameter (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.UINT8);
        }
        return this.getParameterUnsafe<Uint8ArrayParameter>(identity);
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
        if (DEBUG) {
            assertIsTrue(identity.namespace === VFXParameterNameSpace.PARTICLE);
        }
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
        case VFXParameterType.VEC2:
            this.addParameter_internal(identity.id, new Vec2ArrayParameter());
            break;
        case VFXParameterType.VEC4:
            this.addParameter_internal(identity.id, new Vec4ArrayParameter());
            break;
        case VFXParameterType.INT32:
            this.addParameter_internal(identity.id, new Int32ArrayParameter());
            break;
        case VFXParameterType.UINT8:
            this.addParameter_internal(identity.id, new Uint8ArrayParameter());
            break;
        case VFXParameterType.QUAT:
            this.addParameter_internal(identity.id, new QuatArrayParameter());
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

    public clear () {
        this._count = 0;
    }

    public reset () {
        this._count = 0;
        this._parameters.length = 0;
        this._parameterMap = {};
        this._parameterCount = 0;
    }

    public markRequiredParameter (identity: VFXParameterIdentity) {
        if (!this.hasParameter(identity)) {
            this.addParameter(identity);
        }
    }

    private addParameter_internal (id: number, parameter: ArrayParameter) {
        this._parameterCount++;
        this._parameters.push(parameter);
        this._parameterMap[id] = parameter;
        parameter.reserve(this._capacity);
    }
}
