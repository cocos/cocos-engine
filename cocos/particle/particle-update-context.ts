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
import { Color, Mat4, Quat, Vec3 } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { CurveRange } from './curve-range';
import { ParticleEmitter } from './particle-emitter';

@ccclass('cc.ParticleEmitterParams')
export class ParticleEmitterParams {
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

export class SpawnEvent {
    public deltaTime = 0;
    public currentTime = 0;
    public prevTime = 0;
    public velocity = new Vec3();
    public rotation = new Vec3();
    public size = new Vec3();
    public color = new Color();
    public invStartLifeTime = 1;
    public normalizedAliveTime = 0;
    public transform = new Mat4();
}

export class ParticleSnapshot {
    public rotation = new Vec3();
    public startSize = new Vec3();
    public size = new Vec3();
    public startColor = new Color();
    public color = new Color();
    public randomSeed = 0;
    public invStartLifeTime = 1;
    public normalizedAliveTime = 0;
    public recordReason = -1;
}
export class InheritedProperties {
    public rotation = new Vec3();
    public size = new Vec3();
    public color = new Color();
    public invStartLifeTime = 1;
    public normalizedAliveTime = 0;
}

export enum PlayingState {
    STOPPED,
    PLAYING,
    PAUSED,
}

export class ParticleEmitterState {
    public accumulatedTime = 0;
    public playingState = PlayingState.STOPPED;
    public lastPosition = new Vec3();
    public currentPosition = new Vec3();
    public startDelay = 0;
    public isSimulating = true;
    public isEmitting = true;
}

export class ParticleEmitterContext {
    public emittingAccumulatedCount = 0;
    public velocity = new Vec3();
    public inheritedProperties: InheritedProperties | null = null;
    public emitterTransform = new Mat4();
    public emittingNumOverTime = 0;
    public emittingNumOverDistance = 0;
    public burstCount = 0;
}

export class ParticleUpdateContext {
    public localToWorld = new Mat4();
    public worldToLocal = new Mat4();
    public worldRotation = new Quat();

    constructor () {

    }
}
