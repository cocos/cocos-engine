// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { typeParams } from './build/mappings'

export default {
  // projection
  PROJ_PERSPECTIVE: 0,
  PROJ_ORTHO: 1,

  // lights
  LIGHT_DIRECTIONAL: 0,
  LIGHT_POINT: 1,
  LIGHT_SPOT: 2,
  LIGHT_AMBIENT: 3,

  // shadows
  SHADOW_NONE: 0,
  SHADOW_HARD: 1,
  SHADOW_SOFT: 2,

  // parameter type
  PARAM_INT:             typeParams.INT,
  PARAM_INT2:            typeParams.IVEC2,
  PARAM_INT3:            typeParams.IVEC3,
  PARAM_INT4:            typeParams.IVEC4,
  PARAM_FLOAT:           typeParams.FLOAT,
  PARAM_FLOAT2:          typeParams.VEC2,
  PARAM_FLOAT3:          typeParams.VEC3,
  PARAM_FLOAT4:          typeParams.VEC4,
  PARAM_MAT2:           typeParams.MAT2,
  PARAM_MAT3:           typeParams.MAT3,
  PARAM_MAT4:           typeParams.MAT4,
  PARAM_TEXTURE_2D:     typeParams.SAMPLER2D,
  PARAM_TEXTURE_CUBE:   typeParams.SAMPLERCUBE,

  // clear flags
  CLEAR_COLOR: 1,
  CLEAR_DEPTH: 2,
  CLEAR_STENCIL: 4,
  CLEAR_SKYBOX: 8,

  //
  BUFFER_VIEW_INT8: 0,
  BUFFER_VIEW_UINT8: 1,
  BUFFER_VIEW_INT16: 2,
  BUFFER_VIEW_UINT16: 3,
  BUFFER_VIEW_INT32: 4,
  BUFFER_VIEW_UINT32: 5,
  BUFFER_VIEW_FLOAT32: 6,
};
