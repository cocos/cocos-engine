// this file is used for offline effect building.

import { enums } from '../../renderer/gfx/enums';
import rendererEnums from '../../renderer/enums';

const typeParams = {
  float: rendererEnums.PARAM_FLOAT,
  float2: rendererEnums.PARAM_FLOAT2,
  float3: rendererEnums.PARAM_FLOAT3,
  float4: rendererEnums.PARAM_FLOAT4,
  color3: rendererEnums.PARAM_COLOR3,
  color4: rendererEnums.PARAM_COLOR4,
  texture2d: rendererEnums.PARAM_TEXTURE_2D,
  textureCube: rendererEnums.PARAM_TEXTURE_CUBE
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