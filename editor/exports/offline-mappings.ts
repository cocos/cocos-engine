
import {
  GFXAddress, GFXBlendFactor, GFXBlendOp, GFXColorMask, GFXComparisonFunc, GFXCullMode, GFXDynamicStateFlagBit,
  GFXFilter, GFXFormat, GFXFormatInfos, GFXFormatType, GFXGetTypeSize, GFXPolygonMode, GFXPrimitiveMode,
  GFXShadeModel, GFXShaderStageFlagBit, GFXStencilOp, GFXType, GFXDescriptorType,
} from '../../cocos/core/gfx/define';
import { RenderQueue } from '../../cocos/core/renderer/core/constants';
import { RenderPassStage, RenderPriority, SetIndex } from '../../cocos/core/pipeline/define';
import { murmurhash2_32_gc } from '../../cocos/core/utils/murmurhash2_gc';
import { SamplerInfoIndex, genSamplerHash } from '../../cocos/core/renderer/core/sampler-lib';

const typeMap = {};
typeMap[typeMap['bool'] = GFXType.BOOL] = 'bool';
typeMap[typeMap['bvec2'] = GFXType.BOOL2] = 'bvec2';
typeMap[typeMap['bvec3'] = GFXType.BOOL3] = 'bvec3';
typeMap[typeMap['bvec4'] = GFXType.BOOL4] = 'bvec4';
typeMap[typeMap['int'] = GFXType.INT] = 'int';
typeMap[typeMap['ivec2'] = GFXType.INT2] = 'ivec2';
typeMap[typeMap['ivec3'] = GFXType.INT3] = 'ivec3';
typeMap[typeMap['ivec4'] = GFXType.INT4] = 'ivec4';
typeMap[typeMap['uint'] = GFXType.UINT] = 'uint';
typeMap[typeMap['uvec2'] = GFXType.UINT2] = 'uvec2';
typeMap[typeMap['uvec3'] = GFXType.UINT3] = 'uvec3';
typeMap[typeMap['uvec4'] = GFXType.UINT4] = 'uvec4';
typeMap[typeMap['float'] = GFXType.FLOAT] = 'float';
typeMap[typeMap['vec2'] = GFXType.FLOAT2] = 'vec2';
typeMap[typeMap['vec3'] = GFXType.FLOAT3] = 'vec3';
typeMap[typeMap['vec4'] = GFXType.FLOAT4] = 'vec4';
typeMap[typeMap['mat2'] = GFXType.MAT2] = 'mat2';
typeMap[typeMap['mat3'] = GFXType.MAT3] = 'mat3';
typeMap[typeMap['mat4'] = GFXType.MAT4] = 'mat4';
typeMap[typeMap['mat2x3'] = GFXType.MAT2X3] = 'mat2x3';
typeMap[typeMap['mat2x4'] = GFXType.MAT2X4] = 'mat2x4';
typeMap[typeMap['mat3x2'] = GFXType.MAT3X2] = 'mat3x2';
typeMap[typeMap['mat3x4'] = GFXType.MAT3X4] = 'mat3x4';
typeMap[typeMap['mat4x2'] = GFXType.MAT4X2] = 'mat4x2';
typeMap[typeMap['mat4x3'] = GFXType.MAT4X3] = 'mat4x3';
typeMap[typeMap['sampler1D'] = GFXType.SAMPLER1D] = 'sampler1D';
typeMap[typeMap['sampler1DArray'] = GFXType.SAMPLER1D_ARRAY] = 'sampler1DArray';
typeMap[typeMap['sampler2D'] = GFXType.SAMPLER2D] = 'sampler2D';
typeMap[typeMap['sampler2DArray'] = GFXType.SAMPLER2D_ARRAY] = 'sampler2DArray';
typeMap[typeMap['sampler3D'] = GFXType.SAMPLER3D] = 'sampler3D';
typeMap[typeMap['samplerCube'] = GFXType.SAMPLER_CUBE] = 'samplerCube';
// variations
typeMap['int8_t'] = GFXType.INT;
typeMap['i8vec2'] = GFXType.INT2;
typeMap['i8vec3'] = GFXType.INT3;
typeMap['i8vec4'] = GFXType.INT4;
typeMap['uint8_t'] = GFXType.UINT;
typeMap['u8vec2'] = GFXType.UINT2;
typeMap['u8vec3'] = GFXType.UINT3;
typeMap['u8vec4'] = GFXType.UINT4;
typeMap['int16_t'] = GFXType.INT;
typeMap['i16vec2'] = GFXType.INT2;
typeMap['i16vec3'] = GFXType.INT3;
typeMap['i16vec4'] = GFXType.INT4;
typeMap['uint16_t'] = GFXType.INT;
typeMap['u16vec2'] = GFXType.UINT2;
typeMap['u16vec3'] = GFXType.UINT3;
typeMap['u16vec4'] = GFXType.UINT4;
typeMap['float16_t'] = GFXType.FLOAT;
typeMap['f16vec2'] = GFXType.FLOAT2;
typeMap['f16vec3'] = GFXType.FLOAT3;
typeMap['f16vec4'] = GFXType.FLOAT4;
typeMap['mat2x2'] = GFXType.MAT2;
typeMap['mat3x3'] = GFXType.MAT3;
typeMap['mat4x4'] = GFXType.MAT4;
typeMap['isampler1D'] = GFXType.SAMPLER1D;
typeMap['usampler1D'] = GFXType.SAMPLER1D;
typeMap['sampler1DShadow'] = GFXType.SAMPLER1D;
typeMap['isampler1DArray'] = GFXType.SAMPLER1D_ARRAY;
typeMap['usampler1DArray'] = GFXType.SAMPLER1D_ARRAY;
typeMap['sampler1DArrayShadow'] = GFXType.SAMPLER1D_ARRAY;
typeMap['isampler2D'] = GFXType.SAMPLER2D;
typeMap['usampler2D'] = GFXType.SAMPLER2D;
typeMap['sampler2DShadow'] = GFXType.SAMPLER2D;
typeMap['isampler2DArray'] = GFXType.SAMPLER2D_ARRAY;
typeMap['usampler2DArray'] = GFXType.SAMPLER2D_ARRAY;
typeMap['sampler2DArrayShadow'] = GFXType.SAMPLER2D_ARRAY;
typeMap['isampler3D'] = GFXType.SAMPLER3D;
typeMap['usampler3D'] = GFXType.SAMPLER3D;
typeMap['isamplerCube'] = GFXType.SAMPLER_CUBE;
typeMap['usamplerCube'] = GFXType.SAMPLER_CUBE;
typeMap['samplerCubeShadow'] = GFXType.SAMPLER_CUBE;

const isSampler = (type) => type >= GFXType.SAMPLER1D;
const isPaddedMatrix = (type) => type >= GFXType.MAT2 && type < GFXType.MAT4;

const formatMap = {
  bool: GFXFormat.R8,
  bvec2: GFXFormat.RG8,
  bvec3: GFXFormat.RGB8,
  bvec4: GFXFormat.RGBA8,
  int: GFXFormat.R32I,
  ivec2: GFXFormat.RG32I,
  ivec3: GFXFormat.RGB32I,
  ivec4: GFXFormat.RGBA32I,
  uint: GFXFormat.R32UI,
  uvec2: GFXFormat.RG32UI,
  uvec3: GFXFormat.RGB32UI,
  uvec4: GFXFormat.RGBA32UI,
  float: GFXFormat.R32F,
  vec2: GFXFormat.RG32F,
  vec3: GFXFormat.RGB32F,
  vec4: GFXFormat.RGBA32F,
  int8_t: GFXFormat.R8I,
  i8vec2: GFXFormat.RG8I,
  i8vec3: GFXFormat.RGB8I,
  i8vec4: GFXFormat.RGBA8I,
  uint8_t: GFXFormat.R8UI,
  u8vec2: GFXFormat.RG8UI,
  u8vec3: GFXFormat.RGB8UI,
  u8vec4: GFXFormat.RGBA8UI,
  int16_t: GFXFormat.R16I,
  i16vec2: GFXFormat.RG16I,
  i16vec3: GFXFormat.RGB16I,
  i16vec4: GFXFormat.RGBA16I,
  uint16_t: GFXFormat.R16UI,
  u16vec2: GFXFormat.RG16UI,
  u16vec3: GFXFormat.RGB16UI,
  u16vec4: GFXFormat.RGBA16UI,
  float16_t: GFXFormat.R16F,
  f16vec2: GFXFormat.RG16F,
  f16vec3: GFXFormat.RGB16F,
  f16vec4: GFXFormat.RGBA16F,
  // no suitable conversions:
  mat2: GFXFormat.RGBA32F,
  mat3: GFXFormat.RGBA32F,
  mat4: GFXFormat.RGBA32F,
  mat2x2: GFXFormat.RGBA32F,
  mat3x3: GFXFormat.RGBA32F,
  mat4x4: GFXFormat.RGBA32F,
  mat2x3: GFXFormat.RGBA32F,
  mat2x4: GFXFormat.RGBA32F,
  mat3x2: GFXFormat.RGBA32F,
  mat3x4: GFXFormat.RGBA32F,
  mat4x2: GFXFormat.RGBA32F,
  mat4x3: GFXFormat.RGBA32F,
};
const getFormat = (name) => typeof name === 'string' && GFXFormat[name.toUpperCase()];
const getShaderStage = (name) => typeof name === 'string' && GFXShaderStageFlagBit[name.toUpperCase()];
const getDescriptorType = (name) => typeof name === 'string' && GFXDescriptorType[name.toUpperCase()];
const isNormalized = (format) => {
  const type = GFXFormatInfos[format] && GFXFormatInfos[format].type;
  return type === GFXFormatType.UNORM || type === GFXFormatType.SNORM;
};

const passParams = {
  // color mask
  NONE: GFXColorMask.NONE,
  R: GFXColorMask.R,
  G: GFXColorMask.G,
  B: GFXColorMask.B,
  A: GFXColorMask.A,
  RG: GFXColorMask.R | GFXColorMask.G,
  RB: GFXColorMask.R | GFXColorMask.B,
  RA: GFXColorMask.R | GFXColorMask.A,
  GB: GFXColorMask.G | GFXColorMask.B,
  GA: GFXColorMask.G | GFXColorMask.A,
  BA: GFXColorMask.B | GFXColorMask.A,
  RGB: GFXColorMask.R | GFXColorMask.G | GFXColorMask.B,
  RGA: GFXColorMask.R | GFXColorMask.G | GFXColorMask.A,
  RBA: GFXColorMask.R | GFXColorMask.B | GFXColorMask.A,
  GBA: GFXColorMask.G | GFXColorMask.B | GFXColorMask.A,
  ALL: GFXColorMask.ALL,
  // blend operation
  ADD: GFXBlendOp.ADD,
  SUB: GFXBlendOp.SUB,
  REV_SUB: GFXBlendOp.REV_SUB,
  MIN: GFXBlendOp.MIN,
  MAX: GFXBlendOp.MAX,
  // blend factor
  ZERO: GFXBlendFactor.ZERO,
  ONE: GFXBlendFactor.ONE,
  SRC_ALPHA: GFXBlendFactor.SRC_ALPHA,
  DST_ALPHA: GFXBlendFactor.DST_ALPHA,
  ONE_MINUS_SRC_ALPHA: GFXBlendFactor.ONE_MINUS_SRC_ALPHA,
  ONE_MINUS_DST_ALPHA: GFXBlendFactor.ONE_MINUS_DST_ALPHA,
  SRC_COLOR: GFXBlendFactor.SRC_COLOR,
  DST_COLOR: GFXBlendFactor.DST_COLOR,
  ONE_MINUS_SRC_COLOR: GFXBlendFactor.ONE_MINUS_SRC_COLOR,
  ONE_MINUS_DST_COLOR: GFXBlendFactor.ONE_MINUS_DST_COLOR,
  SRC_ALPHA_SATURATE: GFXBlendFactor.SRC_ALPHA_SATURATE,
  CONSTANT_COLOR: GFXBlendFactor.CONSTANT_COLOR,
  ONE_MINUS_CONSTANT_COLOR: GFXBlendFactor.ONE_MINUS_CONSTANT_COLOR,
  CONSTANT_ALPHA: GFXBlendFactor.CONSTANT_ALPHA,
  ONE_MINUS_CONSTANT_ALPHA: GFXBlendFactor.ONE_MINUS_CONSTANT_ALPHA,
  // stencil operation
  // ZERO: GFXStencilOp.ZERO, // duplicate, safely removed because enum value is(and always will be) the same
  KEEP: GFXStencilOp.KEEP,
  REPLACE: GFXStencilOp.REPLACE,
  INCR: GFXStencilOp.INCR,
  DECR: GFXStencilOp.DECR,
  INVERT: GFXStencilOp.INVERT,
  INCR_WRAP: GFXStencilOp.INCR_WRAP,
  DECR_WRAP: GFXStencilOp.DECR_WRAP,
    // comparison function
  NEVER: GFXComparisonFunc.NEVER,
  LESS: GFXComparisonFunc.LESS,
  EQUAL: GFXComparisonFunc.EQUAL,
  LESS_EQUAL: GFXComparisonFunc.LESS_EQUAL,
  GREATER: GFXComparisonFunc.GREATER,
  NOT_EQUAL: GFXComparisonFunc.NOT_EQUAL,
  GREATER_EQUAL: GFXComparisonFunc.GREATER_EQUAL,
  ALWAYS: GFXComparisonFunc.ALWAYS,
  // cull mode
  // NONE: GFXCullMode.NONE, // duplicate, safely removed because enum value is(and always will be) the same
  FRONT: GFXCullMode.FRONT,
  BACK: GFXCullMode.BACK,
  // shade mode
  GOURAND: GFXShadeModel.GOURAND,
  FLAT: GFXShadeModel.FLAT,
  // polygon mode
  FILL: GFXPolygonMode.FILL,
  LINE: GFXPolygonMode.LINE,
  POINT: GFXPolygonMode.POINT,
  // primitive mode
  POINT_LIST: GFXPrimitiveMode.POINT_LIST,
  LINE_LIST: GFXPrimitiveMode.LINE_LIST,
  LINE_STRIP: GFXPrimitiveMode.LINE_STRIP,
  LINE_LOOP: GFXPrimitiveMode.LINE_LOOP,
  TRIANGLE_LIST: GFXPrimitiveMode.TRIANGLE_LIST,
  TRIANGLE_STRIP: GFXPrimitiveMode.TRIANGLE_STRIP,
  TRIANGLE_FAN: GFXPrimitiveMode.TRIANGLE_FAN,
  LINE_LIST_ADJACENCY: GFXPrimitiveMode.LINE_LIST_ADJACENCY,
  LINE_STRIP_ADJACENCY: GFXPrimitiveMode.LINE_STRIP_ADJACENCY,
  TRIANGLE_LIST_ADJACENCY: GFXPrimitiveMode.TRIANGLE_LIST_ADJACENCY,
  TRIANGLE_STRIP_ADJACENCY: GFXPrimitiveMode.TRIANGLE_STRIP_ADJACENCY,
  TRIANGLE_PATCH_ADJACENCY: GFXPrimitiveMode.TRIANGLE_PATCH_ADJACENCY,
  QUAD_PATCH_LIST: GFXPrimitiveMode.QUAD_PATCH_LIST,
  ISO_LINE_LIST: GFXPrimitiveMode.ISO_LINE_LIST,

  // POINT: GFXFilter.POINT, // duplicate, safely removed because enum value is(and always will be) the same
  LINEAR: GFXFilter.LINEAR,
  ANISOTROPIC: GFXFilter.ANISOTROPIC,

  WRAP: GFXAddress.WRAP,
  MIRROR: GFXAddress.MIRROR,
  CLAMP: GFXAddress.CLAMP,
  BORDER: GFXAddress.BORDER,

  VIEWPORT: GFXDynamicStateFlagBit.VIEWPORT,
  SCISSOR: GFXDynamicStateFlagBit.SCISSOR,
  LINE_WIDTH: GFXDynamicStateFlagBit.LINE_WIDTH,
  DEPTH_BIAS: GFXDynamicStateFlagBit.DEPTH_BIAS,
  BLEND_CONSTANTS: GFXDynamicStateFlagBit.BLEND_CONSTANTS,
  DEPTH_BOUNDS: GFXDynamicStateFlagBit.DEPTH_BOUNDS,
  STENCIL_WRITE_MASK: GFXDynamicStateFlagBit.STENCIL_WRITE_MASK,
  STENCIL_COMPARE_MASK: GFXDynamicStateFlagBit.STENCIL_COMPARE_MASK,

  TRUE: true,
  FALSE: false
};
Object.assign(passParams, RenderPassStage);

// for structural type checking
// an 'any' key will check against all elements defined in that object
// a key start with '$' means its essential, and can't be undefined
const effectStructure = {
  $techniques: [
    {
      $passes: [
        {
          depthStencilState: {},
          rasterizerState: {},
          blendState: { targets: [{}] },
          properties: { any: { sampler: {}, editor: {} } },
          migrations: { properties: { any: {} }, macros: { any: {} } },
          embeddedMacros: {},
        }
      ]
    }
  ]
};

export {
  murmurhash2_32_gc,
  SamplerInfoIndex,
  genSamplerHash,
  effectStructure,
  isSampler,
  typeMap,
  formatMap,
  getFormat,
  getShaderStage,
  getDescriptorType,
  isNormalized,
  isPaddedMatrix,
  passParams,
  RenderQueue,
  SetIndex,
  RenderPriority,
  GFXGetTypeSize,
};
