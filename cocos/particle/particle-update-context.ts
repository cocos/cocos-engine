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

import { CullingMode, Space } from './enum';
import { Mat4, Quat, Vec3 } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { CurveRange } from './curve-range';

@ccclass('cc.ParticleSystemParams')
export class ParticleSystemParams {
    @serializable
    public capacity = 100;
    @serializable
    public loop = true;
    @serializable
    public duration = 5.0;
    @serializable
    public prewarm = false;
    @serializable
    public simulationSpace = Space.LOCAL;
    @serializable
    public scaleSpace = Space.LOCAL;
    @serializable
    public simulationSpeed = 1.0;
    @serializable
    public playOnAwake = true;
    @serializable
    public startDelay = new CurveRange();
    @serializable
    public cullingMode = CullingMode.ALWAYS_SIMULATE;
}

export class ParticleUpdateContext {
    public accumulatedTime = 0;
    public emitterAccumulatedTime = 0;
    public normalizedTimeInCycle = 0;
    public deltaTime = 0;
    public localToWorld = new Mat4();
    public emitterVelocity = new Vec3();
    public worldRotation = new Quat();
    public emittingOverTimeAccumulatedCount = 0;
    public emittingOverDistanceAccumulatedCount = 0;
    public burstEmittingCount = 0;
    public newParticleIndexStart = -1;
    public newParticleIndexEnd = -1;
    public lastPosition = new Vec3();
    public currentPosition = new Vec3();
    public emitterStartDelay = 0;
    public emitterDelayRemaining = 0;
    public emitterDeltaTime = 0;

    constructor () {

    }
}
