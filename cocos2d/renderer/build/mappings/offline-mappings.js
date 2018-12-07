// this file is used for offline effect building.

import { enums } from '../../gfx/enums';
import rendererEnums from '../../enums';
import { RenderQueue, PassStage } from '../../core/constants';

const typeParams = {
  INT: rendererEnums.PARAM_INT,
  IVEC2: rendererEnums.PARAM_INT2,
  IVEC3: rendererEnums.PARAM_INT3,
  IVEC4: rendererEnums.PARAM_INT4,
  FLOAT: rendererEnums.PARAM_FLOAT,
  VEC2: rendererEnums.PARAM_FLOAT2,
  VEC3: rendererEnums.PARAM_FLOAT3,
  VEC4: rendererEnums.PARAM_FLOAT4,
  COLOR3: rendererEnums.PARAM_COLOR3,
  COLOR4: rendererEnums.PARAM_COLOR4,
  MAT2: rendererEnums.PARAM_MAT2,
  MAT3: rendererEnums.PARAM_MAT3,
  MAT4: rendererEnums.PARAM_MAT4,
  SAMPLER2D: rendererEnums.PARAM_TEXTURE_2D,
  SAMPLERCUBE: rendererEnums.PARAM_TEXTURE_CUBE,
  [rendererEnums.PARAM_FLOAT3]: rendererEnums.PARAM_COLOR3,
  [rendererEnums.PARAM_FLOAT4]: rendererEnums.PARAM_COLOR4
};

const passParams = {
  BACK: enums.CULL_BACK,
  FRONT: enums.CULL_FRONT,
  NONE: enums.CULL_NONE,

  ADD: enums.BLEND_FUNC_ADD,
  SUBTRACT: enums.BLEND_FUNC_SUBTRACT,
  REVERSESUBTRACT: enums.BLEND_FUNC_REVERSE_SUBTRACT,
  ZERO: enums.BLEND_ZERO,
  ONE: enums.BLEND_ONE,
  SRCCOLOR: enums.BLEND_SRC_COLOR,
  ONEMINUSSRCCOLOR: enums.BLEND_ONE_MINUS_SRC_COLOR,
  DSTCOLOR: enums.BLEND_DST_COLOR,
  ONEMINUSDSTCOLOR: enums.BLEND_ONE_MINUS_DST_COLOR,
  SRCALPHA: enums.BLEND_SRC_ALPHA,
  ONEMINUSSRCALPHA: enums.BLEND_ONE_MINUS_SRC_ALPHA,
  DSTALPHA: enums.BLEND_DST_ALPHA,
  ONEMINUSDSTALPHA: enums.BLEND_ONE_MINUS_DST_ALPHA,
  CONSTCOLOR: enums.BLEND_CONSTANT_COLOR,
  ONEMINUSCONSTCOLOR: enums.BLEND_ONE_MINUS_CONSTANT_COLOR,
  CONSTALPHA: enums.BLEND_CONSTANT_ALPHA,
  ONEMINUSCONSTALPHA: enums.BLEND_ONE_MINUS_CONSTANT_ALPHA,
  SRCALPHASATURATE: enums.BLEND_SRC_ALPHA_SATURATE,

  NEVER: enums.DS_FUNC_NEVER,
  LESS: enums.DS_FUNC_LESS,
  EQUAL: enums.DS_FUNC_EQUAL,
  LEQUAL: enums.DS_FUNC_LEQUAL,
  GREATER: enums.DS_FUNC_GREATER,
  NOTEQUAL: enums.DS_FUNC_NOTEQUAL,
  GEQUAL: enums.DS_FUNC_GEQUAL,
  ALWAYS: enums.DS_FUNC_ALWAYS,

  KEEP: enums.STENCIL_OP_KEEP,
  REPLACE: enums.STENCIL_OP_REPLACE,
  INCR: enums.STENCIL_OP_INCR,
  INCR_WRAP: enums.STENCIL_OP_INCR_WRAP,
  DECR: enums.STENCIL_OP_DECR,
  DECR_WRAP: enums.STENCIL_OP_DECR_WRAP,
  INVERT: enums.STENCIL_OP_INVERT
};

let mappings = {
  typeParams,
  passParams,
  RenderQueue
};

export default mappings;