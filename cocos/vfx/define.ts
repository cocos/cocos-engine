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

import { VFXParameterIdentity } from './vfx-parameter';

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
    MAT3,
    MAT4,
}

export enum VFXParameterNameSpace {
    EMITTER,
    PARTICLE,
    USER,
    CONTEXT
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
    COLLISION,
}

let builtinParameterId = 1;
// #region emitter
export const E_AGE = new VFXParameterIdentity(builtinParameterId++, 'age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_IS_WORLD_SPACE = new VFXParameterIdentity(builtinParameterId++, 'is-world-space', VFXParameterType.BOOL, VFXParameterNameSpace.EMITTER);
export const E_CURRENT_DELAY = new VFXParameterIdentity(builtinParameterId++, 'current-delay', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_LOOPED_AGE = new VFXParameterIdentity(builtinParameterId++, 'looped-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_NORMALIZED_LOOP_AGE = new VFXParameterIdentity(builtinParameterId++, 'normalized-loop-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_SPAWN_REMAINDER = new VFXParameterIdentity(builtinParameterId++, 'spawn-remainder', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_SPAWN_REMAINDER_PER_UNIT = new VFXParameterIdentity(builtinParameterId++, 'spawn-remainder-per-unit', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const E_CURRENT_LOOP_COUNT = new VFXParameterIdentity(builtinParameterId++, 'current-loop-count', VFXParameterType.UINT32, VFXParameterNameSpace.EMITTER);
export const E_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const E_SIMULATION_POSITION = new VFXParameterIdentity(builtinParameterId++, 'simulation-position', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const E_POSITION = new VFXParameterIdentity(builtinParameterId++, 'position', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
export const E_LOCAL_TO_WORLD = new VFXParameterIdentity(builtinParameterId++, 'local-to-world', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER);
export const E_WORLD_TO_LOCAL = new VFXParameterIdentity(builtinParameterId++, 'world-to-local', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER);
export const E_LOCAL_TO_WORLD_RS = new VFXParameterIdentity(builtinParameterId++, 'local-to-world-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER);
export const E_WORLD_TO_LOCAL_RS = new VFXParameterIdentity(builtinParameterId++, 'world-to-local-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER);
export const E_LOCAL_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'local-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER);
export const E_WORLD_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'world-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER);
export const E_RENDER_SCALE = new VFXParameterIdentity(builtinParameterId++, 'render-scale', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER);
// #endregion emitter

builtinParameterId = 1000;
// #region context
export const C_DELTA_TIME = new VFXParameterIdentity(builtinParameterId++, 'delta-time', VFXParameterType.FLOAT, VFXParameterNameSpace.CONTEXT);
export const C_FROM_INDEX = new VFXParameterIdentity(builtinParameterId++, 'from-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT);
export const C_TO_INDEX = new VFXParameterIdentity(builtinParameterId++, 'to-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT);
// #endregion context

builtinParameterId = 2000;
// #region particle
export const P_ID = new VFXParameterIdentity(builtinParameterId++, 'id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const P_RANDOM_SEED = new VFXParameterIdentity(builtinParameterId++, 'random-seed', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const P_INV_LIFETIME = new VFXParameterIdentity(builtinParameterId++, 'inv-lifetime', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_NORMALIZED_AGE = new VFXParameterIdentity(builtinParameterId++, 'normalized-age', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_IS_DEAD = new VFXParameterIdentity(builtinParameterId++, 'is-dead', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE);
export const P_HAS_COLLIDED = new VFXParameterIdentity(builtinParameterId++, 'has-collided', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE);
export const P_POSITION = new VFXParameterIdentity(builtinParameterId++, 'position', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_PHYSICS_FORCE = new VFXParameterIdentity(builtinParameterId++, 'physics-force', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_BASE_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'base-velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_SPRITE_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'sprite-rotation', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_MESH_ORIENTATION = new VFXParameterIdentity(builtinParameterId++, 'mesh-orientation', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_SUB_UV_INDEX = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_SUB_UV_INDEX2 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index2', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_SUB_UV_INDEX3 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index3', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_SUB_UV_INDEX4 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index4', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_RIBBON_ID = new VFXParameterIdentity(builtinParameterId++, 'ribbon-id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const P_RIBBON_LINK_ORDER = new VFXParameterIdentity(builtinParameterId++, 'ribbon-link-order', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_BASE_RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'base-ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const P_BASE_SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'base-sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE);
export const P_SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE);
export const P_BASE_SCALE = new VFXParameterIdentity(builtinParameterId++, 'base-scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_SCALE = new VFXParameterIdentity(builtinParameterId++, 'scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const P_BASE_COLOR = new VFXParameterIdentity(builtinParameterId++, 'base-color', VFXParameterType.P_COLOR, VFXParameterNameSpace.PARTICLE);
export const P_COLOR = new VFXParameterIdentity(builtinParameterId++, 'color', VFXParameterType.P_COLOR, VFXParameterNameSpace.PARTICLE);
export const P_VISIBILITY_TAG = new VFXParameterIdentity(builtinParameterId++, 'visibility-tag', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);

//#endregion particle
