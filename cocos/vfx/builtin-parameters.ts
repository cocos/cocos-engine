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
import { VFXParameterNameSpace, VFXParameterType } from './define';
import { VFXParameterIdentity } from './vfx-parameter';

let builtinParticleParameterId = 0;
export const ID = new VFXParameterIdentity(builtinParticleParameterId++, 'id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const RANDOM_SEED = new VFXParameterIdentity(builtinParticleParameterId++, 'random-seed', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const INV_START_LIFETIME = new VFXParameterIdentity(builtinParticleParameterId++, 'inv-start-lifetime', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const NORMALIZED_AGE = new VFXParameterIdentity(builtinParticleParameterId++, 'normalized-age', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const IS_DEAD = new VFXParameterIdentity(builtinParticleParameterId++, 'is-dead', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE);
export const HAS_COLLIDED = new VFXParameterIdentity(builtinParticleParameterId++, 'has-collided', VFXParameterType.BOOL, VFXParameterNameSpace.PARTICLE);
export const POSITION = new VFXParameterIdentity(builtinParticleParameterId++, 'position', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const PHYSICS_FORCE = new VFXParameterIdentity(builtinParticleParameterId++, 'physics-force', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const BASE_VELOCITY = new VFXParameterIdentity(builtinParticleParameterId++, 'base-velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const VELOCITY = new VFXParameterIdentity(builtinParticleParameterId++, 'velocity', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const SPRITE_ROTATION = new VFXParameterIdentity(builtinParticleParameterId++, 'sprite-rotation', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const MESH_ORIENTATION = new VFXParameterIdentity(builtinParticleParameterId++, 'mesh-orientation', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX = new VFXParameterIdentity(builtinParticleParameterId++, 'sub-uv-index', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX2 = new VFXParameterIdentity(builtinParticleParameterId++, 'sub-uv-index2', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX3 = new VFXParameterIdentity(builtinParticleParameterId++, 'sub-uv-index3', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const SUB_UV_INDEX4 = new VFXParameterIdentity(builtinParticleParameterId++, 'sub-uv-index4', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const RIBBON_ID = new VFXParameterIdentity(builtinParticleParameterId++, 'ribbon-id', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);
export const RIBBON_LINK_ORDER = new VFXParameterIdentity(builtinParticleParameterId++, 'ribbon-link-order', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const BASE_RIBBON_WIDTH = new VFXParameterIdentity(builtinParticleParameterId++, 'base-ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const RIBBON_WIDTH = new VFXParameterIdentity(builtinParticleParameterId++, 'ribbon-width', VFXParameterType.FLOAT, VFXParameterNameSpace.PARTICLE);
export const BASE_SPRITE_SIZE = new VFXParameterIdentity(builtinParticleParameterId++, 'base-sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE);
export const SPRITE_SIZE = new VFXParameterIdentity(builtinParticleParameterId++, 'sprite-size', VFXParameterType.VEC2, VFXParameterNameSpace.PARTICLE);
export const BASE_SCALE = new VFXParameterIdentity(builtinParticleParameterId++, 'base-scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const SCALE = new VFXParameterIdentity(builtinParticleParameterId++, 'scale', VFXParameterType.VEC3, VFXParameterNameSpace.PARTICLE);
export const BASE_COLOR = new VFXParameterIdentity(builtinParticleParameterId++, 'base-color', VFXParameterType.COLOR, VFXParameterNameSpace.PARTICLE);
export const COLOR = new VFXParameterIdentity(builtinParticleParameterId++, 'color', VFXParameterType.COLOR, VFXParameterNameSpace.PARTICLE);
export const VISIBILITY_TAG = new VFXParameterIdentity(builtinParticleParameterId++, 'visibility-tag', VFXParameterType.UINT32, VFXParameterNameSpace.PARTICLE);

export const customParticleParameterId = 1000;

let builtinEmitterParameterId = 2000;
export const AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const IS_WORLD_SPACE = new VFXParameterIdentity(builtinEmitterParameterId++, 'is-world-space', VFXParameterType.BOOL, VFXParameterNameSpace.EMITTER);
export const CURRENT_DELAY = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-delay', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const LOOPED_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'looped-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const NORMALIZED_LOOP_AGE = new VFXParameterIdentity(builtinEmitterParameterId++, 'normalized-loop-age', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
export const CURRENT_LOOP_COUNT = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-loop-count', VFXParameterType.UINT32, VFXParameterNameSpace.EMITTER);
export const CURRENT_DURATION = new VFXParameterIdentity(builtinEmitterParameterId++, 'current-duration', VFXParameterType.FLOAT, VFXParameterNameSpace.EMITTER);
