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

import { ccclass, serializable } from 'cc.decorator';
import { DEBUG } from 'internal:constants';
import { DelayMode, LoopMode, PlayingState } from './define';
import { Vec3, Vec2, assertIsTrue } from '../core';
import { ModuleExecStage } from './vfx-module';
import { RandomStream } from './random-stream';
import { VFXEvents } from './vfx-events';

@ccclass('cc.VFXEmitterLifeCycleParams')
export class VFXEmitterLifeCycleParams {
    @serializable
    public loopMode = LoopMode.INFINITE;
    @serializable
    public loopCount = 1;
    @serializable
    public duration = 5;
    @serializable
    public prewarm = false;
    @serializable
    public prewarmTime = 5;
    @serializable
    public prewarmTimeStep = 0.03;
    @serializable
    public simulationSpeed = 1.0;
    @serializable
    public playOnAwake = true;
    @serializable
    public delayMode = DelayMode.NONE;
    @serializable
    public delayRange = new Vec2(0, 0);
}

export class VFXEmitterState {
    public accumulatedTime = 0;
    public playingState = PlayingState.STOPPED;
    public needRestart = false;
    public isSimulating = true;
    public isEmitting = true;
    public lastSimulateFrame = 0;
    public maxParticleId = 0;
    public boundsMin = new Vec3();
    public boundsMax = new Vec3();
    public randomStream = new RandomStream();
    public lastTransformChangedVersion = 0xffffffff;
}

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
