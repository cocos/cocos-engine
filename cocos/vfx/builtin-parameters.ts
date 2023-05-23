import { VFXParameterNameSpace, VFXParameterType } from './define';
import { VFXParameterIdentity } from './vfx-parameter';

const MAX_PARAMETER_COUNT = 0xffffffff;
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

export const builtinParticleParameterIdentities = [
    ID,
    RANDOM_SEED,
    INV_START_LIFETIME,
    NORMALIZED_AGE,
    IS_DEAD,
    HAS_COLLIDED,
    POSITION,
    PHYSICS_FORCE,
    BASE_VELOCITY,
    VELOCITY,
    SPRITE_ROTATION,
    MESH_ORIENTATION,
    SUB_UV_INDEX,
    SUB_UV_INDEX2,
    SUB_UV_INDEX3,
    SUB_UV_INDEX4,
    RIBBON_ID,
    RIBBON_LINK_ORDER,
    BASE_RIBBON_WIDTH,
    RIBBON_WIDTH,
    BASE_SPRITE_SIZE,
    SPRITE_SIZE,
    BASE_SCALE,
    SCALE,
    BASE_COLOR,
    COLOR,
    VISIBILITY_TAG,
];

export const customParticleParameterId = 1000;

const builtinEmitterParameterId = 2000;
