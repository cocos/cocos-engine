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
import { VFXParameterIdentity } from './vfx-parameter';
import { VFXParameterNameSpace, VFXParameterType } from './define';

let builtinContextParameterId = 50000;

export const DELTA_TIME = new VFXParameterIdentity(builtinContextParameterId++, 'delta-time', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);

export const CUSTOM_CONTEXT_PARAMETER_ID = 60000;

export class ModuleExecContext {
    public get events (): VFXEvents {
        if (!this._events) {
            this._events = new VFXEvents();
        }
        return this._events;
    }

    public get fromIndex () {
        return this._fromIndex;
    }

    public get toIndex () {
        return this._toIndex;
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

    public get deltaTime () {
        return this._deltaTime;
    }

    public set deltaTime (value: number) {
        this._deltaTime = value;
    }

    private _fromIndex = 0;
    private _toIndex = 0;
    private _moduleRandomSeed = 0;
    private declare _moduleRandomStream: RandomStream
    private _deltaTime = 0;
    private _executionStage = ModuleExecStage.UNKNOWN;
    private _events: VFXEvents | null = null;

    getFloatParameter (id: VFXParameterIdentity): number {
        return 0;
    }

    setFloatParameter (id: VFXParameterIdentity, value: number) {

    }

    setExecutionStage (stage: ModuleExecStage) {
        this._executionStage = stage;
    }

    setExecuteRange (fromIndex: number, toIndex: number) {
        if (DEBUG) {
            assertIsTrue(fromIndex <= toIndex);
            assertIsTrue(fromIndex >= 0);
        }
        this._fromIndex = fromIndex;
        this._toIndex = toIndex;
    }

    reset () {
        this._events?.clear();
        this._executionStage = ModuleExecStage.UNKNOWN;
        this.setExecuteRange(0, 0);
    }

    setModuleRandomSeed (seed: number) {
        this._moduleRandomSeed = seed;
    }

    setModuleRandomStream (stream: RandomStream) {
        this._moduleRandomStream = stream;
    }
}
