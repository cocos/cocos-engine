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

export type ParticleHandle = number;
export const INVALID_HANDLE = -1;

export enum VFXParameterType {
    FLOAT,
    BOOL,
    VEC2,
    VEC3,
    VEC4,
    QUAT,
    COLOR,
    INT32,
    UINT32,
    UINT8,
}

export enum ParameterNameSpace {
    EMITTER,
    PARTICLE,
    USER,
}

export enum CoordinateSpace {
    WORLD,
    LOCAL,
    SIMULATION
}

export enum ScalingMode {
    HIERARCHY,
    LOCAL,
    SHAPE,
}

export enum FinishAction {
    NONE,
    DESTROY,
    DISABLE,
}

/**
 * @en Particle emitter culling mode
 * @zh 粒子的剔除模式。
 */
export enum CullingMode {
    ALWAYS_SIMULATE,
    PAUSE,
    PAUSE_AND_CATCHUP,
    STOP_EMITTING,
    CLEAR_AND_FINISH,
}

/**
 * @en Particle emitter alignment space
 * @zh 粒子的对齐模式。
 * @enum ParticleSystemRenderer.AlignmentSpace
 */
export enum AlignmentSpace {
    WORLD,

    LOCAL,

    VIEW,
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

export enum InheritedProperty {
    COLOR = 1,
    SCALE = 1 << 1,
    ROTATION = 1 << 2,
}

export enum PlayingState {
    STOPPED,
    PLAYING,
    PAUSED,
}

export enum VFXEventType {
    UNKNOWN,
    LOCATION,
    DEATH,
    BIRTH,
    COLLISION,
    TRIGGER,
    MANUAL,
}
