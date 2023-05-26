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
import { ModuleExecStage } from './vfx-module';
import { RandomStream } from './random-stream';
import { VFXEvents } from './vfx-events';
import { VFXParameter, VFXParameterIdentity } from './vfx-parameter';
import { VFXParameterNameSpace, VFXParameterType } from './define';
import { BoolParameter, FloatParameter, Uint32Parameter, Vec3Parameter } from './parameters';

let builtinContextParameterId = 50000;

export const DELTA_TIME = new VFXParameterIdentity(builtinContextParameterId++, 'delta-time', VFXParameterType.FLOAT, VFXParameterNameSpace.CONTEXT);
export const FROM_INDEX = new VFXParameterIdentity(builtinContextParameterId++, 'from-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT);
export const TO_INDEX = new VFXParameterIdentity(builtinContextParameterId++, 'to-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT);

export const CUSTOM_CONTEXT_PARAMETER_ID = 60000;

export class ModuleExecContext {
    public get events (): VFXEvents {
        if (!this._events) {
            this._events = new VFXEvents();
        }
        return this._events;
    }

    public get executionStage () {
        return this._executionStage;
    }

    public get moduleRandomSeed () {
        return this._moduleRandomSeed;
    }

    public get moduleRandomStream () {
        return this._moduleRandomStream;
    }

    private _moduleRandomSeed = 0;
    private declare _moduleRandomStream: RandomStream
    private _executionStage = ModuleExecStage.UNKNOWN;
    private _events: VFXEvents | null = null;

    private _parameterMap: Record<number, VFXParameter> = {
        [DELTA_TIME.id]: new FloatParameter(),
        [FROM_INDEX.id]: new Uint32Parameter(),
        [TO_INDEX.id]: new Uint32Parameter(),
    };

    getFloatParameter (identity: VFXParameterIdentity): FloatParameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.FLOAT);
        }
        return this.getParameterUnsafe<FloatParameter>(identity);
    }

    getVec3Parameter (identity: VFXParameterIdentity): Vec3Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.VEC3);
        }
        return this.getParameterUnsafe<Vec3Parameter>(identity);
    }

    getBoolParameter (identity: VFXParameterIdentity): BoolParameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.BOOL);
        }
        return this.getParameterUnsafe<BoolParameter>(identity);
    }

    getUint32Parameter (identity: VFXParameterIdentity): Uint32Parameter {
        if (DEBUG) {
            assertIsTrue(identity.type === VFXParameterType.UINT32);
        }
        return this.getParameterUnsafe<Uint32Parameter>(identity);
    }

    private getParameterUnsafe<T extends VFXParameter> (identity: VFXParameterIdentity) {
        if (DEBUG) {
            assertIsTrue(this.hasParameter(identity));
            assertIsTrue(identity.namespace === VFXParameterNameSpace.CONTEXT);
        }
        return this._parameterMap[identity.id] as T;
    }

    hasParameter (identity: VFXParameterIdentity) {
        return identity.id in this._parameterMap;
    }

    setExecutionStage (stage: ModuleExecStage) {
        this._executionStage = stage;
    }

    reset () {
        this._events?.clear();
        this._executionStage = ModuleExecStage.UNKNOWN;
    }

    setModuleRandomSeed (seed: number) {
        this._moduleRandomSeed = seed;
    }

    setModuleRandomStream (stream: RandomStream) {
        this._moduleRandomStream = stream;
    }
}
