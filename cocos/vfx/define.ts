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
import { VFXParameterIdentity, VFXParameterNameSpace, VFXParameterType } from './vfx-parameter';

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

// #region emitter parameters
let builtinParameterId = 1;
export const E_AGE = new VFXParameterIdentity(builtinParameterId++, 'age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_IS_WORLD_SPACE = new VFXParameterIdentity(builtinParameterId++, 'is-world-space', VFXParameterType.BOOL, VFXParameterNameSpace.EMITTER, false);
export const E_CURRENT_DELAY = new VFXParameterIdentity(builtinParameterId++, 'current-delay', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_LOOPED_AGE = new VFXParameterIdentity(builtinParameterId++, 'looped-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_NORMALIZED_LOOP_AGE = new VFXParameterIdentity(builtinParameterId++, 'normalized-loop-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_SPAWN_REMAINDER = new VFXParameterIdentity(builtinParameterId++, 'spawn-remainder', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_SPAWN_REMAINDER_PER_UNIT = new VFXParameterIdentity(builtinParameterId++, 'spawn-remainder-per-unit', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER, false);
export const E_CURRENT_LOOP_COUNT = new VFXParameterIdentity(builtinParameterId++, 'current-loop-count', VFXParameterType.UINT32, VFXParameterNameSpace.EMITTER, false);
export const E_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER, false);
export const E_SIMULATION_POSITION = new VFXParameterIdentity(builtinParameterId++, 'simulation-position', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER, false);
export const E_POSITION = new VFXParameterIdentity(builtinParameterId++, 'position', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER, false);
export const E_LOCAL_TO_WORLD = new VFXParameterIdentity(builtinParameterId++, 'local-to-world', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER, false);
export const E_WORLD_TO_LOCAL = new VFXParameterIdentity(builtinParameterId++, 'world-to-local', VFXParameterType.MAT4, VFXParameterNameSpace.EMITTER, false);
export const E_LOCAL_TO_WORLD_RS = new VFXParameterIdentity(builtinParameterId++, 'local-to-world-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER, false);
export const E_WORLD_TO_LOCAL_RS = new VFXParameterIdentity(builtinParameterId++, 'world-to-local-rs', VFXParameterType.MAT3, VFXParameterNameSpace.EMITTER, false);
export const E_LOCAL_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'local-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER, false);
export const E_WORLD_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'world-rotation', VFXParameterType.QUAT, VFXParameterNameSpace.EMITTER, false);
export const E_RENDER_SCALE = new VFXParameterIdentity(builtinParameterId++, 'render-scale', VFXParameterType.VEC3, VFXParameterNameSpace.EMITTER, false);
// #endregion emitter parameters

// #region context parameters
builtinParameterId = 1000;
export const C_DELTA_TIME = new VFXParameterIdentity(builtinParameterId++, 'delta-time', VFXParameterType.FLOAT, VFXParameterNameSpace.CONTEXT, false);
export const C_FROM_INDEX = new VFXParameterIdentity(builtinParameterId++, 'from-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT, false);
export const C_TO_INDEX = new VFXParameterIdentity(builtinParameterId++, 'to-index', VFXParameterType.UINT32, VFXParameterNameSpace.CONTEXT, false);
// #endregion context parameters

// #region particle parameters
builtinParameterId = 2000;
export const P_ID = new VFXParameterIdentity(builtinParameterId++, 'id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE, true);
export const P_RANDOM_SEED = new VFXParameterIdentity(builtinParameterId++, 'random-seed', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE, true);
export const P_INV_LIFETIME = new VFXParameterIdentity(builtinParameterId++, 'inv-lifetime', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_NORMALIZED_AGE = new VFXParameterIdentity(builtinParameterId++, 'normalized-age', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_IS_DEAD = new VFXParameterIdentity(builtinParameterId++, 'is-dead', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE, true);
export const P_HAS_COLLIDED = new VFXParameterIdentity(builtinParameterId++, 'has-collided', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE, true);
export const P_POSITION = new VFXParameterIdentity(builtinParameterId++, 'position', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_PHYSICS_FORCE = new VFXParameterIdentity(builtinParameterId++, 'physics-force', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_BASE_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'base-velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_VELOCITY = new VFXParameterIdentity(builtinParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_SPRITE_ROTATION = new VFXParameterIdentity(builtinParameterId++, 'sprite-rotation', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_MESH_ORIENTATION = new VFXParameterIdentity(builtinParameterId++, 'mesh-orientation', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_SUB_UV_INDEX1 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index1', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_SUB_UV_INDEX2 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index2', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_SUB_UV_INDEX3 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index3', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_SUB_UV_INDEX4 = new VFXParameterIdentity(builtinParameterId++, 'sub-uv-index4', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_RIBBON_ID = new VFXParameterIdentity(builtinParameterId++, 'ribbon-id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE, true);
export const P_RIBBON_LINK_ORDER = new VFXParameterIdentity(builtinParameterId++, 'ribbon-link-order', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_BASE_RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'base-ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_RIBBON_WIDTH = new VFXParameterIdentity(builtinParameterId++, 'ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE, true);
export const P_BASE_SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'base-sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE, true);
export const P_SPRITE_SIZE = new VFXParameterIdentity(builtinParameterId++, 'sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE, true);
export const P_BASE_SCALE = new VFXParameterIdentity(builtinParameterId++, 'base-scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_SCALE = new VFXParameterIdentity(builtinParameterId++, 'scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE, true);
export const P_BASE_COLOR = new VFXParameterIdentity(builtinParameterId++, 'base-color', VFXParameterType.COLOR, VFXParameterNameSpace.PARTICLE, true);
export const P_COLOR = new VFXParameterIdentity(builtinParameterId++, 'color', VFXParameterType.COLOR, VFXParameterNameSpace.PARTICLE, true);
export const P_VISIBILITY_TAG = new VFXParameterIdentity(builtinParameterId++, 'visibility-tag', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE, true);
//#endregion particle parameters

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
