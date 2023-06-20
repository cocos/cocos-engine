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

import { Attribute, AttributeName, Format } from '../gfx';
import { VFXParameter, VFXParameterRegistry, VFXValueType } from './vfx-parameter';

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

export enum VFXBuiltinNamespace {
    EMITTER = 'emitter',
    PARTICLE = 'particle',
    USER = 'user',
    CONTEXT = 'context',
}

export enum VFXRandomEvaluationMode {
    SPAWN_ONLY,
    EVERY_FRAME
}

// DO NOT change the order of execution in same namespace since it will affect the id of parameter.
// #region emitter parameters
export const E_AGE = VFXParameterRegistry.registerGlobalParameter('age', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_PARTICLE_NUM = VFXParameterRegistry.registerGlobalParameter('particle-num', VFXValueType.UINT32, VFXBuiltinNamespace.EMITTER, false);
export const E_IS_WORLD_SPACE = VFXParameterRegistry.registerGlobalParameter('is-world-space', VFXValueType.BOOL, VFXBuiltinNamespace.EMITTER, false);
export const E_CURRENT_LOOP_DURATION = VFXParameterRegistry.registerGlobalParameter('current-loop-duration', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_CURRENT_LOOP_DELAY = VFXParameterRegistry.registerGlobalParameter('current-loop-delay', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_LOOPED_AGE = VFXParameterRegistry.registerGlobalParameter('looped-age', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_NORMALIZED_LOOP_AGE = VFXParameterRegistry.registerGlobalParameter('normalized-loop-age', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_SPAWN_REMAINDER = VFXParameterRegistry.registerGlobalParameter('spawn-remainder', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_SPAWN_REMAINDER_PER_UNIT = VFXParameterRegistry.registerGlobalParameter('spawn-remainder-per-unit', VFXValueType.FLOAT, VFXBuiltinNamespace.EMITTER, false);
export const E_CURRENT_LOOP_COUNT = VFXParameterRegistry.registerGlobalParameter('current-loop-count', VFXValueType.UINT32, VFXBuiltinNamespace.EMITTER, false);
export const E_VELOCITY = VFXParameterRegistry.registerGlobalParameter('velocity', VFXValueType.VEC3, VFXBuiltinNamespace.EMITTER, false);
export const E_SIMULATION_POSITION = VFXParameterRegistry.registerGlobalParameter('simulation-position', VFXValueType.VEC3, VFXBuiltinNamespace.EMITTER, false);
export const E_POSITION = VFXParameterRegistry.registerGlobalParameter('position', VFXValueType.VEC3, VFXBuiltinNamespace.EMITTER, false);
export const E_LOCAL_TO_WORLD = VFXParameterRegistry.registerGlobalParameter('local-to-world', VFXValueType.MAT4, VFXBuiltinNamespace.EMITTER, false);
export const E_WORLD_TO_LOCAL = VFXParameterRegistry.registerGlobalParameter('world-to-local', VFXValueType.MAT4, VFXBuiltinNamespace.EMITTER, false);
export const E_LOCAL_TO_WORLD_RS = VFXParameterRegistry.registerGlobalParameter('local-to-world-rs', VFXValueType.MAT3, VFXBuiltinNamespace.EMITTER, false);
export const E_WORLD_TO_LOCAL_RS = VFXParameterRegistry.registerGlobalParameter('world-to-local-rs', VFXValueType.MAT3, VFXBuiltinNamespace.EMITTER, false);
export const E_LOCAL_ROTATION = VFXParameterRegistry.registerGlobalParameter('local-rotation', VFXValueType.QUAT, VFXBuiltinNamespace.EMITTER, false);
export const E_WORLD_ROTATION = VFXParameterRegistry.registerGlobalParameter('world-rotation', VFXValueType.QUAT, VFXBuiltinNamespace.EMITTER, false);
export const E_RENDER_SCALE = VFXParameterRegistry.registerGlobalParameter('render-scale', VFXValueType.VEC3, VFXBuiltinNamespace.EMITTER, false);
export const E_SPAWN_INFOS = VFXParameterRegistry.registerGlobalParameter('spawn-infos', VFXValueType.SPAWN_INFO, VFXBuiltinNamespace.EMITTER, true);
export const E_SPAWN_INFO_COUNT = VFXParameterRegistry.registerGlobalParameter('spawn-info-count', VFXValueType.UINT32, VFXBuiltinNamespace.EMITTER, false);
export const E_RANDOM_SEED = VFXParameterRegistry.registerGlobalParameter('random-seed', VFXValueType.UINT32, VFXBuiltinNamespace.EMITTER, false);
// #endregion emitter parameters

// #region context parameters
export const C_DELTA_TIME = VFXParameterRegistry.registerGlobalParameter('delta-time', VFXValueType.FLOAT, VFXBuiltinNamespace.CONTEXT, false);
export const C_TICK_COUNT = VFXParameterRegistry.registerGlobalParameter('tick-count', VFXValueType.UINT32, VFXBuiltinNamespace.CONTEXT, false);
export const C_FROM_INDEX = VFXParameterRegistry.registerGlobalParameter('from-index', VFXValueType.UINT32, VFXBuiltinNamespace.CONTEXT, false);
export const C_TO_INDEX = VFXParameterRegistry.registerGlobalParameter('to-index', VFXValueType.UINT32, VFXBuiltinNamespace.CONTEXT, false);
export const C_EVENTS = VFXParameterRegistry.registerGlobalParameter('events', VFXValueType.EVENT, VFXBuiltinNamespace.CONTEXT, true);
export const C_EVENT_COUNT = VFXParameterRegistry.registerGlobalParameter('event-count', VFXValueType.UINT32, VFXBuiltinNamespace.CONTEXT, false);
// #endregion context parameters

// #region particle parameters
export const P_ID = VFXParameterRegistry.registerGlobalParameter('id', VFXValueType.UINT32, VFXBuiltinNamespace.PARTICLE, true);
export const P_INV_LIFETIME = VFXParameterRegistry.registerGlobalParameter('inv-lifetime', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_NORMALIZED_AGE = VFXParameterRegistry.registerGlobalParameter('normalized-age', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_IS_DEAD = VFXParameterRegistry.registerGlobalParameter('is-dead', VFXValueType.BOOL, VFXBuiltinNamespace.PARTICLE, true);
export const P_HAS_COLLIDED = VFXParameterRegistry.registerGlobalParameter('has-collided', VFXValueType.BOOL, VFXBuiltinNamespace.PARTICLE, true);
export const P_POSITION = VFXParameterRegistry.registerGlobalParameter('position', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_PHYSICS_FORCE = VFXParameterRegistry.registerGlobalParameter('physics-force', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_BASE_VELOCITY = VFXParameterRegistry.registerGlobalParameter('base-velocity', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_VELOCITY = VFXParameterRegistry.registerGlobalParameter('velocity', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_SPRITE_ROTATION = VFXParameterRegistry.registerGlobalParameter('sprite-rotation', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_MESH_ORIENTATION = VFXParameterRegistry.registerGlobalParameter('mesh-orientation', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_SUB_UV_INDEX1 = VFXParameterRegistry.registerGlobalParameter('sub-uv-index1', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_SUB_UV_INDEX2 = VFXParameterRegistry.registerGlobalParameter('sub-uv-index2', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_SUB_UV_INDEX3 = VFXParameterRegistry.registerGlobalParameter('sub-uv-index3', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_SUB_UV_INDEX4 = VFXParameterRegistry.registerGlobalParameter('sub-uv-index4', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_RIBBON_ID = VFXParameterRegistry.registerGlobalParameter('ribbon-id', VFXValueType.UINT32, VFXBuiltinNamespace.PARTICLE, true);
export const P_RIBBON_LINK_ORDER = VFXParameterRegistry.registerGlobalParameter('ribbon-link-order', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_BASE_RIBBON_WIDTH = VFXParameterRegistry.registerGlobalParameter('base-ribbon-width', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_RIBBON_WIDTH = VFXParameterRegistry.registerGlobalParameter('ribbon-width', VFXValueType.FLOAT, VFXBuiltinNamespace.PARTICLE, true);
export const P_BASE_SPRITE_SIZE = VFXParameterRegistry.registerGlobalParameter('base-sprite-size', VFXValueType.VEC2, VFXBuiltinNamespace.PARTICLE, true);
export const P_SPRITE_SIZE = VFXParameterRegistry.registerGlobalParameter('sprite-size', VFXValueType.VEC2, VFXBuiltinNamespace.PARTICLE, true);
export const P_BASE_SCALE = VFXParameterRegistry.registerGlobalParameter('base-scale', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_SCALE = VFXParameterRegistry.registerGlobalParameter('scale', VFXValueType.VEC3, VFXBuiltinNamespace.PARTICLE, true);
export const P_BASE_COLOR = VFXParameterRegistry.registerGlobalParameter('base-color', VFXValueType.COLOR, VFXBuiltinNamespace.PARTICLE, true);
export const P_COLOR = VFXParameterRegistry.registerGlobalParameter('color', VFXValueType.COLOR, VFXBuiltinNamespace.PARTICLE, true);
export const P_VISIBILITY_TAG = VFXParameterRegistry.registerGlobalParameter('visibility-tag', VFXValueType.UINT32, VFXBuiltinNamespace.PARTICLE, true);
//#endregion particle parameters

export const CUSTOM_PARAMETER_ID_BEGIN = 20000;

//#region shader defines
export const CC_VFX_RENDERER_TYPE = 'CC_VFX_RENDERER_TYPE';
export const CC_VFX_RENDERER_TYPE_SPRITE = 0;
export const CC_VFX_RENDERER_TYPE_MESH = 1;
export const CC_VFX_RENDERER_TYPE_RIBBON = 2;
export const CC_VFX_E_IS_WORLD_SPACE = 'CC_VFX_E_IS_WORLD_SPACE';
export const CC_VFX_P_POSITION = 'CC_VFX_P_POSITION';
export const CC_VFX_P_MESH_ORIENTATION = 'CC_VFX_P_MESH_ORIENTATION';
export const CC_VFX_P_SPRITE_ROTATION = 'CC_VFX_P_SPRITE_ROTATION';
export const CC_VFX_P_SCALE = 'CC_VFX_P_SCALE';
export const CC_VFX_P_SPRITE_SIZE = 'CC_VFX_P_SPRITE_SIZE';
export const CC_VFX_P_COLOR = 'CC_VFX_P_COLOR';
export const CC_VFX_P_SUB_UV_INDEX = 'CC_VFX_P_SUB_UV_INDEX';
export const CC_VFX_P_VELOCITY = 'CC_VFX_P_VELOCITY';
export const CC_VFX_SPRITE_FACING_MODE = 'CC_VFX_SPRITE_FACING_MODE';
export const CC_VFX_SPRITE_FACING_MODE_CAMERA = 0;
export const CC_VFX_SPRITE_FACING_MODE_HORIZONTAL = 1;
export const CC_VFX_SPRITE_FACING_MODE_VERTICAL = 2;
export const CC_VFX_SPRITE_FACING_MODE_CUSTOM = 3;
export const CC_VFX_SPRITE_ALIGNMENT_MODE = 'CC_VFX_SPRITE_ALIGNMENT_MODE';
export const CC_VFX_SPRITE_ALIGNMENT_MODE_NONE = 0;
export const CC_VFX_SPRITE_ALIGNMENT_MODE_VELOCITY = 1;
export const CC_VFX_SPRITE_ALIGNMENT_MODE_CUSTOM = 2;
export const CC_VFX_U_SUB_IMAGE_SIZE = 'u_vfx_sub_image_size';
//#endregion shader defines

//#region shader attributes
export const meshPosition = new Attribute(AttributeName.ATTR_POSITION, Format.RGB32F, false, 0);           // mesh position
export const meshUv = new Attribute(AttributeName.ATTR_TEX_COORD, Format.RGB32F, false, 0);                // mesh uv
export const meshNormal = new Attribute(AttributeName.ATTR_NORMAL, Format.RGB32F, false, 0);               // mesh normal
export const meshColorRGBA8 = new Attribute(AttributeName.ATTR_COLOR, Format.RGBA8, true, 0);              // mesh color rgba8
export const meshColorRGBA32 = new Attribute(AttributeName.ATTR_COLOR, Format.RGBA32F, true, 0);            // mesh color rgba32
export const vfxPPosition = new Attribute('a_vfx_p_position', Format.RGB32F, false, 1, true);              // particle position
export const vfxPMeshOrientation = new Attribute('a_vfx_p_mesh_orientation', Format.RGB32F, false, 1, true); // particle mesh orientation
export const vfxPSpriteRotation = new Attribute('a_vfx_p_sprite_rotation', Format.R32F, false, 1, true);   // particle sprite rotation
export const vfxPScale = new Attribute('a_vfx_p_scale', Format.RGB32F, false, 1, true);                     // particle scale
export const vfxPSpriteSize = new Attribute('a_vfx_p_sprite_size', Format.RG32F, false, 1, true);          // particle sprite size
export const vfxPColor = new Attribute('a_vfx_p_color', Format.RGBA8, true, 1, true);                       // particle color
export const vfxPSubUVIndex = new Attribute('a_vfx_p_sub_uv_index', Format.R32F, false, 1, true);          // particle sub uv index
export const vfxPVelocity = new Attribute('a_vfx_p_velocity', Format.RGB32F, false, 1, true);              // particle velocity
//#endregion shader attributes
