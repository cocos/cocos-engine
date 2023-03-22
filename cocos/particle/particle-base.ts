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
import { ModuleExecStage } from './particle-module';

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
    public startLifeTime = 5;
    public randomSeed = 0;
    public normalizedAliveTime = 0;
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
    private _particleId = new Uint32Array(this._capacity);
    private _currentTime = new Float32Array(this._capacity);
    private _prevTime = new Float32Array(this._capacity);
    private _position = new Float32Array(this._capacity * 3);
    private _velocity = new Float32Array(this._capacity * 3);
    private _rotation = new Float32Array(this._capacity * 3);
    private _size = new Float32Array(this._capacity * 3);
    private _color = new Uint32Array(this._capacity);
    private _startLifeTime = new Float32Array(this._capacity);
    private _randomSeed = new Uint32Array(this._capacity);
    private _normalizedAliveTime = new Float32Array(this._capacity);

    clear () {
        this._count = 0;
    }

    reserve (capacity: number) {
        if (capacity > this._capacity) {
            const oldParticleId = this._particleId;
            const oldCurrentTime = this._currentTime;
            const oldPrevTime = this._prevTime;
            const oldPosition = this._position;
            const oldVelocity = this._velocity;
            const oldRotation = this._rotation;
            const oldSize = this._size;
            const oldColor = this._color;
            const oldStartLifeTime = this._startLifeTime;
            const oldRandomSeed = this._randomSeed;
            const oldNormalizedAliveTime = this._normalizedAliveTime;
            this._particleId = new Uint32Array(capacity);
            this._particleId.set(oldParticleId);
            this._currentTime = new Float32Array(capacity);
            this._currentTime.set(oldCurrentTime);
            this._prevTime = new Float32Array(capacity);
            this._prevTime.set(oldPrevTime);
            this._position = new Float32Array(capacity * 3);
            this._position.set(oldPosition);
            this._velocity = new Float32Array(capacity * 3);
            this._velocity.set(oldVelocity);
            this._rotation = new Float32Array(capacity * 3);
            this._rotation.set(oldRotation);
            this._size = new Float32Array(capacity * 3);
            this._size.set(oldSize);
            this._color = new Uint32Array(capacity);
            this._color.set(oldColor);
            this._startLifeTime = new Float32Array(capacity);
            this._startLifeTime.set(oldStartLifeTime);
            this._randomSeed = new Uint32Array(capacity);
            this._randomSeed.set(oldRandomSeed);
            this._normalizedAliveTime = new Float32Array(capacity);
            this._normalizedAliveTime.set(oldNormalizedAliveTime);
            this._capacity = capacity;
        }
    }

    dispatch (eventInfo: ParticleEventInfo) {
        if (this._count === this._capacity) {
            this.reserve(this._capacity * 2);
        }
        const handle = this._count++;
        this._particleId[handle] = eventInfo.particleId;
        this._currentTime[handle] = eventInfo.currentTime;
        this._prevTime[handle] = eventInfo.prevTime;
        const xOffset = handle * 3;
        const yOffset = xOffset + 1;
        const zOffset = yOffset + 1;
        this._position[xOffset] = eventInfo.position.x;
        this._position[yOffset] = eventInfo.position.y;
        this._position[zOffset] = eventInfo.position.z;
        this._velocity[xOffset] = eventInfo.velocity.x;
        this._velocity[yOffset] = eventInfo.velocity.y;
        this._velocity[zOffset] = eventInfo.velocity.z;
        this._rotation[xOffset] = eventInfo.rotation.x;
        this._rotation[yOffset] = eventInfo.rotation.y;
        this._rotation[zOffset] = eventInfo.rotation.z;
        this._size[xOffset] = eventInfo.size.x;
        this._size[yOffset] = eventInfo.size.y;
        this._size[zOffset] = eventInfo.size.z;
        this._color[handle] = Color.toUint32(eventInfo.color);
        this._startLifeTime[handle] = eventInfo.startLifeTime;
        this._randomSeed[handle] = eventInfo.randomSeed;
        this._normalizedAliveTime[handle] = eventInfo.normalizedAliveTime;
    }

    getEventInfoAt (out: ParticleEventInfo, handle: number) {
        const xOffset = handle * 3;
        const yOffset = xOffset + 1;
        const zOffset = yOffset + 1;
        out.particleId = this._particleId[handle];
        out.currentTime = this._currentTime[handle];
        out.prevTime = this._prevTime[handle];
        out.position.x = this._position[xOffset];
        out.position.y = this._position[yOffset];
        out.position.z = this._position[zOffset];
        out.velocity.x = this._velocity[xOffset];
        out.velocity.y = this._velocity[yOffset];
        out.velocity.z = this._velocity[zOffset];
        out.rotation.x = this._rotation[xOffset];
        out.rotation.y = this._rotation[yOffset];
        out.rotation.z = this._rotation[zOffset];
        out.size.x = this._size[xOffset];
        out.size.y = this._size[yOffset];
        out.size.z = this._size[zOffset];
        Color.fromUint32(out.color, this._color[handle]);
        out.startLifeTime = this._startLifeTime[handle];
        out.randomSeed = this._randomSeed[handle];
        out.normalizedAliveTime = this._normalizedAliveTime[handle];
    }
}

@ccclass('cc.ParticleEmitterParams')
export class ParticleEmitterParams {
    @serializable
    public capacity = 100;
    @serializable
    public loop = true;
    @serializable
    public invDuration = 0.2;
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

export enum InheritedProperty {
    COLOR = 1,
    SIZE = 1 << 1,
    ROTATION = 1 << 2,
    LIFETIME = 1 << 3,
    DURATION = 1 << 4
}

export class BitsBucket {
    private _flags = new Uint32Array(1);
    private _count = 1;

    mark (flagNum: number) {
        const bytes = flagNum >> 5;
        if (bytes >= this._count) {
            const newFlags = new Uint32Array(bytes + 1);
            newFlags.set(this._flags);
            this._flags = newFlags;
            this._count = bytes + 1;
        }
        const left = flagNum - (bytes << 5);
        this._flags[bytes] |= 1 << left;
    }

    isMarked (flagNum: number) {
        const bytes = flagNum >> 5;
        if (bytes >= this._count) return false;
        const left = flagNum - (bytes << 5);
        return (this._flags[bytes] & (1 << left)) !== 0;
    }

    unmark (flagNum: number) {
        const bytes = flagNum >> 5;
        if (bytes >= this._count) return;
        const left = flagNum - (bytes << 5);
        this._flags[bytes] &= ~(1 << left);
    }

    equals (other: BitsBucket) {
        const count = Math.min(this._count, other._count);
        for (let i = 0; i < count; i++) {
            if (this._flags[i] !== other._flags[i]) return false;
        }
        for (let i = count; i < this._count; i++) {
            if (this._flags[i] !== 0) return false;
        }
        for (let i = count; i < other._count; i++) {
            if (other._flags[i] !== 0) return false;
        }
        return true;
    }

    clear () {
        this._flags.fill(0);
    }
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
    public spawnFraction = 0;
    public playingState = PlayingState.STOPPED;
    public lastPosition = new Vec3();
    public currentPosition = new Vec3();
    public startDelay = 0;
    public isSimulating = true;
    public isEmitting = true;
    public lastSimulateFrame = 0;
    public maxParticleId = 0;
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

    public get requiredParameters () {
        return this._requiredParameters;
    }

    public currentTime = 0;
    public previousTime = 0;
    public normalizedTimeInCycle = 0;
    public deltaTime = 0;
    public velocity = new Vec3();
    public inheritedProperties: InheritedProperties | null = null;
    public emitterTransform = new Mat4();
    public emittingNumOverTime = 0;
    public emittingNumOverDistance = 0;
    public burstCount = 0;
    public localToWorld = new Mat4();
    public worldToLocal = new Mat4();
    public worldRotation = new Quat();
    public fromIndex = 0;
    public toIndex = 0;
    public executionStage = ModuleExecStage.NONE;
    private _requiredParameters = new BitsBucket();
    private _locationEvents: ParticleEvents | null = null;
    private _deathEvents: ParticleEvents | null = null;

    setExecutionStage (stage: ModuleExecStage) {
        this.executionStage = stage;
    }

    setExecuteRange (fromIndex: number, toIndex: number) {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }

    setTime (currentTime: number, previousTime: number, invCycle: number) {
        this.previousTime = previousTime;
        this.currentTime = currentTime;
        this.deltaTime = currentTime - previousTime;
        this.normalizedTimeInCycle = currentTime * invCycle;
    }

    resetSpawningState () {
        this.burstCount = this.emittingNumOverDistance = this.emittingNumOverTime = 0;
    }

    clear () {
        this._deathEvents?.clear();
        this._locationEvents?.clear();
        this._requiredParameters.clear();
        this.setExecuteRange(0, 0);
        this.resetSpawningState();
    }

    markRequiredParameter (parameterId: number) {
        this._requiredParameters.mark(parameterId);
    }
}
