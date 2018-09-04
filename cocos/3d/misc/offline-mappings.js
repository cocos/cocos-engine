// this file is used for offline effect building.

import gfx from '../gfx';
import rendererEnums from '../renderer/enums';

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
  back: gfx.CULL_BACK,
  front: gfx.CULL_FRONT,
  none: gfx.CULL_NONE,
  add: gfx.BLEND_FUNC_ADD,
  subtract: gfx.BLEND_FUNC_SUBTRACT,
  reverseSubtract: gfx.BLEND_FUNC_REVERSE_SUBTRACT,
  zero: gfx.BLEND_ZERO,
  one: gfx.BLEND_ONE,
  srcColor: gfx.BLEND_SRC_COLOR,
  oneMinusSrcColor: gfx.BLEND_ONE_MINUS_SRC_COLOR,
  dstColor: gfx.BLEND_DST_COLOR,
  oneMinusDstColor: gfx.BLEND_ONE_MINUS_DST_COLOR,
  srcAlpha: gfx.BLEND_SRC_ALPHA,
  oneMinusSrcAlpha: gfx.BLEND_ONE_MINUS_SRC_ALPHA,
  dstAlpha: gfx.BLEND_DST_ALPHA,
  oneMinusDstAlpha: gfx.BLEND_ONE_MINUS_DST_ALPHA,
  constColor: gfx.BLEND_CONSTANT_COLOR,
  oneMinusConstColor: gfx.BLEND_ONE_MINUS_CONSTANT_COLOR,
  constAlpha: gfx.BLEND_CONSTANT_ALPHA,
  oneMinusConstAlpha: gfx.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  srcAlphaSaturate: gfx.BLEND_SRC_ALPHA_SATURATE,
  [true]: true,
  [false]: false
};

let mappings = {
  typeParams,
  passParams,
};

export default mappings;