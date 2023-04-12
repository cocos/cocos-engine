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

import { CullingMode, FinishAction, Space } from './enum';
import { Color, Mat4, Quat, Vec3, Node, Vec2, assert, approx } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { CurveRange } from './curve-range';
import { ModuleExecStage } from './particle-module';
import { RandomStream } from './random-stream';
import { BuiltinParticleParameter, BuiltinParticleParameterFlags, ParticleDataSet } from './particle-data-set';
import { ParticleColorArrayParameter, ParticleFloatArrayParameter, ParticleUint32ArrayParameter, ParticleVec3ArrayParameter } from './particle-parameter';

export enum ParticleEventType {
    UNKNOWN,
    LOCATION,
    DEATH,
    BIRTH,
    COLLISION,
    TRIGGER,
    MANUAL,
}

export class ParticleEventInfo {
    public particleId = 0;
    public currentTime = 0;
    public prevTime = 0;
    public position = new Vec3();
    public velocity = new Vec3();
    public rotation = new Vec3();
    public size = new Vec3();
    public color = new Color();
    public randomSeed = 0;
}

export class ParticleEvents {
    get count () {
        return this._count;
    }

    get capacity () {
        return this._capacity;
    }

    get particleId () {
        return this._particleId;
    }

    private _count = 0;
    private _capacity = 16;
    private _particleId = new ParticleUint32ArrayParameter();
    private _currentTime = new ParticleFloatArrayParameter();
    private _prevTime = new ParticleFloatArrayParameter();
    private _position = new ParticleVec3ArrayParameter();
    private _velocity = new ParticleVec3ArrayParameter();
    private _rotation = new ParticleVec3ArrayParameter();
    private _size = new ParticleVec3ArrayParameter();
    private _color = new ParticleColorArrayParameter();
    private _startLifeTime = new ParticleFloatArrayParameter();
    private _randomSeed = new ParticleUint32ArrayParameter();
    private _normalizedAliveTime = new ParticleFloatArrayParameter();

    clear () {
        this._count = 0;
    }

    reserve (capacity: number) {
        if (capacity > this._capacity) {
            this._particleId.reserve(capacity);
            this._currentTime.reserve(capacity);
            this._prevTime.reserve(capacity);
            this._position.reserve(capacity);
            this._velocity.reserve(capacity);
            this._rotation.reserve(capacity);
            this._size.reserve(capacity);
            this._color.reserve(capacity);
            this._startLifeTime.reserve(capacity);
            this._randomSeed.reserve(capacity);
            this._normalizedAliveTime.reserve(capacity);
            this._capacity = capacity;
        }
    }

    dispatch (eventInfo: ParticleEventInfo) {
        if (this._count === this._capacity) {
            this.reserve(this._capacity * 2);
        }
        const handle = this._count++;
        this._particleId.setUint32At(eventInfo.particleId, handle);
        this._currentTime.setFloatAt(eventInfo.currentTime, handle);
        this._prevTime.setFloatAt(eventInfo.prevTime, handle);
        this._position.setVec3At(eventInfo.position, handle);
        this._velocity.setVec3At(eventInfo.velocity, handle);
        this._rotation.setVec3At(eventInfo.rotation, handle);
        this._size.setVec3At(eventInfo.size, handle);
        this._color.setColorAt(eventInfo.color, handle);
        this._randomSeed.setUint32At(eventInfo.randomSeed, handle);
    }

    getEventInfoAt (out: ParticleEventInfo, handle: number) {
        out.particleId = this._particleId.getUint32At(handle);
        out.currentTime = this._currentTime.getFloatAt(handle);
        out.prevTime = this._prevTime.getFloatAt(handle);
        out.randomSeed = this._randomSeed.getUint32At(handle);
        this._position.getVec3At(out.position, handle);
        this._velocity.getVec3At(out.velocity, handle);
        this._rotation.getVec3At(out.rotation, handle);
        this._size.getVec3At(out.size, handle);
        this._color.getColorAt(out.color, handle);
    }
}

export enum LoopMode {
    INFINITE,
    ONCE,
    MULTIPLE
}

export enum DelayMode {
    NONE,
    FIRST_LOOP_ONLY,
    EVERY_LOOP,
}

export enum BoundsMode {
    AUTO,
    FIXED,
}

export enum CapacityMode {
    AUTO,
    FIXED,
}

@ccclass('cc.ParticleEmitterParams')
export class ParticleEmitterParams {
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
    public simulationSpace = Space.LOCAL;
    @serializable
    public scaleSpace = Space.LOCAL;
    @serializable
    public simulationSpeed = 1.0;
    @serializable
    public maxDeltaTime = 0.05;
    @serializable
    public playOnAwake = true;
    @serializable
    public delayMode = DelayMode.NONE;
    @serializable
    public delayRange = new Vec2(0, 0);
    @serializable
    public boundsMode = BoundsMode.AUTO;
    @serializable
    public fixedBoundsMin = new Vec3(-100, -100, -100);
    @serializable
    public fixedBoundsMax = new Vec3(100, 100, 100);
    @serializable
    public cullingMode = CullingMode.ALWAYS_SIMULATE;
    @serializable
    public capacityMode = CapacityMode.AUTO;
    @serializable
    public capacity = 100;
    @serializable
    public useAutoRandomSeed = true;
    @serializable
    public randomSeed = 0;
    @serializable
    public finishAction = FinishAction.NONE;
}

export enum InheritedProperty {
    COLOR = 1,
    SIZE = 1 << 1,
    ROTATION = 1 << 2,
}

export enum PlayingState {
    STOPPED,
    PLAYING,
    PAUSED,
}

export class ParticleEmitterState {
    public accumulatedTime = 0;
    public spawnFraction = 0;
    public playingState = PlayingState.STOPPED;
    public lastPosition = new Vec3();
    public currentPosition = new Vec3();
    public currentDelay = 0;
    public isSimulating = true;
    public isEmitting = true;
    public lastSimulateFrame = 0;
    public maxParticleId = 0;
    public boundsMin = new Vec3();
    public boundsMax = new Vec3();
    public rand = new RandomStream();

    tick (transform: Node, params: ParticleEmitterParams, context: ParticleExecContext, dt: number) {
        const prevTime = this.accumulatedTime;
        this.accumulatedTime += dt;
        const isWorldSpace = params.simulationSpace === Space.WORLD;
        context.updateEmitterTime(this.accumulatedTime, prevTime,
            params.delayMode, this.currentDelay, params.loopMode, params.loopCount, params.duration);
        this.updateTransform(transform.worldPosition);
        context.updateTransform(transform, isWorldSpace);
        Vec3.subtract(context.emitterVelocity, this.currentPosition, this.lastPosition);
        Vec3.multiplyScalar(context.emitterVelocity, context.emitterVelocity, 1 / dt);
        Vec3.copy(context.emitterVelocityInEmittingSpace, isWorldSpace ? context.emitterVelocity : Vec3.ZERO);
        if (isWorldSpace) {
            context.markRequiredBuiltinParameters(BuiltinParticleParameterFlags.POSITION);
        }
    }

    updateTransform (pos: Vec3) {
        Vec3.copy(this.lastPosition, this.currentPosition);
        Vec3.copy(this.currentPosition, pos);
    }
}

export class ParticleExecContext {
    public get locationEvents (): ParticleEvents {
        if (!this._locationEvents) {
            this._locationEvents = new ParticleEvents();
        }
        return this._locationEvents;
    }

    public get deathEvents (): ParticleEvents {
        if (!this._deathEvents) {
            this._deathEvents = new ParticleEvents();
        }
        return this._deathEvents;
    }

    public get builtinParameterRequirements () {
        return this._builtinParameterRequirements;
    }
    // emitter range
    public emitterCurrentTime = 0;
    public emitterPreviousTime = 0;
    public emitterNormalizedTime = 0;
    public emitterNormalizedPrevTime = 0;
    public emitterDeltaTime = 0;
    public emitterFrameOffset = 0;
    public loopCount = 0;
    public spawnContinuousCount = 0;
    public burstCount = 0;
    /**
     * The velocity of the emitter in world space.
     */
    public emitterVelocity = new Vec3();
    /**
     * The velocity of the emitter in emitting space. When emitting space equals to world space, it's equals to emitterVelocity.
     */
    public emitterVelocityInEmittingSpace = new Vec3();
    // end emitter range

    // simulation range
    public deltaTime = 0;
    public localToWorld = new Mat4();
    public worldToLocal = new Mat4();
    public rotationIfNeedTransform = new Quat();
    public localScale = new Vec3(1, 1, 1);
    public worldScale = new Vec3(1, 1, 1);
    public worldRotation = new Quat();
    public localRotation = new Quat();
    // end simulation range

    // execution range
    public get fromIndex () {
        return this._fromIndex;
    }

    public get toIndex () {
        return this._toIndex;
    }

    public get executionStage () {
        return this._executionStage;
    }
    // end execution range

    private _fromIndex = 0;
    private _toIndex = 0;
    private _executionStage = ModuleExecStage.NONE;
    private _builtinParameterRequirements = 0;
    private _locationEvents: ParticleEvents | null = null;
    private _deathEvents: ParticleEvents | null = null;
    private _lastTransformChangedVersion = 0xffffffff;

    setExecutionStage (stage: ModuleExecStage) {
        this._executionStage = stage;
    }

    setExecuteRange (fromIndex: number, toIndex: number) {
        this._fromIndex = fromIndex;
        this._toIndex = toIndex;
    }

    updateEmitterTime (accumulatedTime: number, previousTime: number, delayMode: DelayMode,
        delay: number, loopMode: LoopMode, loopCount: number, duration: number) {
        assert((accumulatedTime - previousTime) < duration,
            'The delta time should not exceed the duration of the particle system. please adjust the duration of the particle system.');
        assert(accumulatedTime >= previousTime);
        const deltaTime = accumulatedTime - previousTime;
        let prevTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(previousTime - delay, 0) : previousTime;
        let currentTime = delayMode === DelayMode.FIRST_LOOP_ONLY ? Math.max(accumulatedTime - delay, 0) : accumulatedTime;
        const expectedLoopCount = loopMode === LoopMode.INFINITE ? Number.MAX_SAFE_INTEGER
            : (loopMode === LoopMode.MULTIPLE ? loopCount : 1);
        const invDuration = 1 / duration;
        const durationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (duration + delay) : duration;
        const invDurationAndDelay = delayMode === DelayMode.EVERY_LOOP ? (1 / durationAndDelay) : invDuration;
        const count = Math.floor(currentTime * invDurationAndDelay);
        if (count < expectedLoopCount) {
            prevTime %= durationAndDelay;
            currentTime %= durationAndDelay;
            this.loopCount = count;
        } else {
            if (Math.floor(prevTime * invDurationAndDelay) >= expectedLoopCount) {
                prevTime = durationAndDelay;
            } else {
                prevTime %= durationAndDelay;
            }
            currentTime = durationAndDelay;
            this.loopCount = expectedLoopCount;
        }
        if (delayMode === DelayMode.EVERY_LOOP) {
            prevTime = Math.max(prevTime - delay, 0);
            currentTime = Math.max(currentTime - delay, 0);
        }

        let emitterDeltaTime = currentTime - prevTime;
        if (emitterDeltaTime < 0) {
            emitterDeltaTime += duration;
        }

        this.deltaTime = deltaTime;
        this.emitterFrameOffset = deltaTime > 0 ? (deltaTime - emitterDeltaTime) / deltaTime : 0;
        this.emitterCurrentTime = currentTime;
        this.emitterPreviousTime = prevTime;
        this.emitterDeltaTime = emitterDeltaTime;
        this.emitterNormalizedTime = currentTime * invDuration;
        this.emitterNormalizedPrevTime = prevTime * invDuration;
    }

    updateTransform (node: Node, inWorldSpace: boolean) {
        if (node.flagChangedVersion !== this._lastTransformChangedVersion) {
            Mat4.copy(this.localToWorld, node.worldMatrix);
            Mat4.invert(this.worldToLocal, this.localToWorld);
            if (inWorldSpace) {
                Mat4.getRotation(this.rotationIfNeedTransform, this.localToWorld);
            } else {
                Mat4.getRotation(this.rotationIfNeedTransform, this.worldToLocal);
            }
            Quat.normalize(this.rotationIfNeedTransform, this.rotationIfNeedTransform);
            this._lastTransformChangedVersion = node.flagChangedVersion;
        }
    }

    setDeltaTime (deltaTime: number) {
        this.deltaTime = deltaTime;
    }

    resetSpawningState () {
        this.burstCount = this.spawnContinuousCount = 0;
    }

    reset () {
        this._deathEvents?.clear();
        this._locationEvents?.clear();
        this._builtinParameterRequirements = 0;
        this._executionStage = ModuleExecStage.NONE;
        this.setExecuteRange(0, 0);
        this.resetSpawningState();
    }

    markRequiredBuiltinParameters (parameterFlags: BuiltinParticleParameterFlags) {
        this._builtinParameterRequirements |= parameterFlags;
    }
}
