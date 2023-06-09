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

import { ModuleExecStage } from '../vfx-module';
import { RandomStream } from '../random-stream';
import { VFXEvents } from '../vfx-events';
import { C_DELTA_TIME, C_FROM_INDEX, C_TO_INDEX } from '../define';
import { VFXDataSet } from '../vfx-data-set';
import { VFXParameterNamespace } from '../vfx-parameter';

export class ContextDataSet extends VFXDataSet {
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

    constructor () {
        super(VFXParameterNamespace.CONTEXT);
        this.addParameter(C_DELTA_TIME);
        this.addParameter(C_FROM_INDEX);
        this.addParameter(C_TO_INDEX);
    }

    setExecutionStage (stage: ModuleExecStage) {
        this._executionStage = stage;
    }

    clearEvents () {
        this._events?.clear();
    }

    setModuleRandomSeed (seed: number) {
        this._moduleRandomSeed = seed;
    }

    setModuleRandomStream (stream: RandomStream) {
        this._moduleRandomStream = stream;
    }
}
