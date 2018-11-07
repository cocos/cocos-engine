// this file is used for offline effect building.

import { enums } from './gfx/enums';
import rendererEnums from './enums';

const typeParams = {
  int: rendererEnums.PARAM_INT,
  ivec2: rendererEnums.PARAM_INT2,
  ivec3: rendererEnums.PARAM_INT3,
  ivec4: rendererEnums.PARAM_INT4,
  float: rendererEnums.PARAM_FLOAT,
  vec2: rendererEnums.PARAM_FLOAT2,
  vec3: rendererEnums.PARAM_FLOAT3,
  vec4: rendererEnums.PARAM_FLOAT4,
  color3: rendererEnums.PARAM_COLOR3,
  color4: rendererEnums.PARAM_COLOR4,
  mat2: rendererEnums.PARAM_MAT2,
  mat3: rendererEnums.PARAM_MAT3,
  mat4: rendererEnums.PARAM_MAT4,
  sampler2D: rendererEnums.PARAM_TEXTURE_2D,
  samplerCube: rendererEnums.PARAM_TEXTURE_CUBE
};

const passParams = {
  back: enums.CULL_BACK,
  front: enums.CULL_FRONT,
  none: enums.CULL_NONE,
  add: enums.BLEND_FUNC_ADD,
  subtract: enums.BLEND_FUNC_SUBTRACT,
  reverseSubtract: enums.BLEND_FUNC_REVERSE_SUBTRACT,
  zero: enums.BLEND_ZERO,
  one: enums.BLEND_ONE,
  srcColor: enums.BLEND_SRC_COLOR,
  oneMinusSrcColor: enums.BLEND_ONE_MINUS_SRC_COLOR,
  dstColor: enums.BLEND_DST_COLOR,
  oneMinusDstColor: enums.BLEND_ONE_MINUS_DST_COLOR,
  srcAlpha: enums.BLEND_SRC_ALPHA,
  oneMinusSrcAlpha: enums.BLEND_ONE_MINUS_SRC_ALPHA,
  dstAlpha: enums.BLEND_DST_ALPHA,
  oneMinusDstAlpha: enums.BLEND_ONE_MINUS_DST_ALPHA,
  constColor: enums.BLEND_CONSTANT_COLOR,
  oneMinusConstColor: enums.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constAlpha: enums.BLEND_CONSTANT_ALPHA,
  oneMinusConstAlpha: enums.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  srcAlphaSaturate: enums.BLEND_SRC_ALPHA_SATURATE,
  [true]: true,
  [false]: false
};

let mappings = {
  typeParams,
  passParams,
};

export default mappings;