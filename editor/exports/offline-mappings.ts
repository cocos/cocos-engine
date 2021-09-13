/* eslint-disable camelcase */

import {
    Address, BlendFactor, BlendOp, ColorMask, ComparisonFunc, CullMode, DynamicStateFlagBit,
    Filter, Format, FormatInfos, FormatType, GetTypeSize, PolygonMode, PrimitiveMode,
    ShadeModel, ShaderStageFlagBit, StencilOp, Type, DescriptorType, SamplerInfo,
} from '../../cocos/core/gfx/base/define';
import { RenderPassStage, RenderPriority, SetIndex } from '../../cocos/core/pipeline/define';
import { murmurhash2_32_gc } from '../../cocos/core/utils/murmurhash2_gc';
import { Sampler } from '../../cocos/core/gfx/base/states/sampler';

const typeMap: Record<string, Type | string> = {};
typeMap[typeMap.bool = Type.BOOL] = 'bool';
typeMap[typeMap.bvec2 = Type.BOOL2] = 'bvec2';
typeMap[typeMap.bvec3 = Type.BOOL3] = 'bvec3';
typeMap[typeMap.bvec4 = Type.BOOL4] = 'bvec4';
typeMap[typeMap.int = Type.INT] = 'int';
typeMap[typeMap.ivec2 = Type.INT2] = 'ivec2';
typeMap[typeMap.ivec3 = Type.INT3] = 'ivec3';
typeMap[typeMap.ivec4 = Type.INT4] = 'ivec4';
typeMap[typeMap.uint = Type.UINT] = 'uint';
typeMap[typeMap.uvec2 = Type.UINT2] = 'uvec2';
typeMap[typeMap.uvec3 = Type.UINT3] = 'uvec3';
typeMap[typeMap.uvec4 = Type.UINT4] = 'uvec4';
typeMap[typeMap.float = Type.FLOAT] = 'float';
typeMap[typeMap.vec2 = Type.FLOAT2] = 'vec2';
typeMap[typeMap.vec3 = Type.FLOAT3] = 'vec3';
typeMap[typeMap.vec4 = Type.FLOAT4] = 'vec4';
typeMap[typeMap.mat2 = Type.MAT2] = 'mat2';
typeMap[typeMap.mat3 = Type.MAT3] = 'mat3';
typeMap[typeMap.mat4 = Type.MAT4] = 'mat4';
typeMap[typeMap.mat2x3 = Type.MAT2X3] = 'mat2x3';
typeMap[typeMap.mat2x4 = Type.MAT2X4] = 'mat2x4';
typeMap[typeMap.mat3x2 = Type.MAT3X2] = 'mat3x2';
typeMap[typeMap.mat3x4 = Type.MAT3X4] = 'mat3x4';
typeMap[typeMap.mat4x2 = Type.MAT4X2] = 'mat4x2';
typeMap[typeMap.mat4x3 = Type.MAT4X3] = 'mat4x3';
typeMap[typeMap.sampler1D = Type.SAMPLER1D] = 'sampler1D';
typeMap[typeMap.sampler1DArray = Type.SAMPLER1D_ARRAY] = 'sampler1DArray';
typeMap[typeMap.sampler2D = Type.SAMPLER2D] = 'sampler2D';
typeMap[typeMap.sampler2DArray = Type.SAMPLER2D_ARRAY] = 'sampler2DArray';
typeMap[typeMap.sampler3D = Type.SAMPLER3D] = 'sampler3D';
typeMap[typeMap.samplerCube = Type.SAMPLER_CUBE] = 'samplerCube';
// variations
typeMap.int8_t = Type.INT;
typeMap.i8vec2 = Type.INT2;
typeMap.i8vec3 = Type.INT3;
typeMap.i8vec4 = Type.INT4;
typeMap.uint8_t = Type.UINT;
typeMap.u8vec2 = Type.UINT2;
typeMap.u8vec3 = Type.UINT3;
typeMap.u8vec4 = Type.UINT4;
typeMap.int16_t = Type.INT;
typeMap.i16vec2 = Type.INT2;
typeMap.i16vec3 = Type.INT3;
typeMap.i16vec4 = Type.INT4;
typeMap.uint16_t = Type.INT;
typeMap.u16vec2 = Type.UINT2;
typeMap.u16vec3 = Type.UINT3;
typeMap.u16vec4 = Type.UINT4;
typeMap.float16_t = Type.FLOAT;
typeMap.f16vec2 = Type.FLOAT2;
typeMap.f16vec3 = Type.FLOAT3;
typeMap.f16vec4 = Type.FLOAT4;
typeMap.mat2x2 = Type.MAT2;
typeMap.mat3x3 = Type.MAT3;
typeMap.mat4x4 = Type.MAT4;
typeMap.isampler1D = Type.SAMPLER1D;
typeMap.usampler1D = Type.SAMPLER1D;
typeMap.sampler1DShadow = Type.SAMPLER1D;
typeMap.isampler1DArray = Type.SAMPLER1D_ARRAY;
typeMap.usampler1DArray = Type.SAMPLER1D_ARRAY;
typeMap.sampler1DArrayShadow = Type.SAMPLER1D_ARRAY;
typeMap.isampler2D = Type.SAMPLER2D;
typeMap.usampler2D = Type.SAMPLER2D;
typeMap.sampler2DShadow = Type.SAMPLER2D;
typeMap.isampler2DArray = Type.SAMPLER2D_ARRAY;
typeMap.usampler2DArray = Type.SAMPLER2D_ARRAY;
typeMap.sampler2DArrayShadow = Type.SAMPLER2D_ARRAY;
typeMap.isampler3D = Type.SAMPLER3D;
typeMap.usampler3D = Type.SAMPLER3D;
typeMap.isamplerCube = Type.SAMPLER_CUBE;
typeMap.usamplerCube = Type.SAMPLER_CUBE;
typeMap.samplerCubeShadow = Type.SAMPLER_CUBE;

const isSampler = (type) => type >= Type.SAMPLER1D;
const isPaddedMatrix = (type) => type >= Type.MAT2 && type < Type.MAT4;

const formatMap = {
    bool: Format.R8,
    bvec2: Format.RG8,
    bvec3: Format.RGB8,
    bvec4: Format.RGBA8,
    int: Format.R32I,
    ivec2: Format.RG32I,
    ivec3: Format.RGB32I,
    ivec4: Format.RGBA32I,
    uint: Format.R32UI,
    uvec2: Format.RG32UI,
    uvec3: Format.RGB32UI,
    uvec4: Format.RGBA32UI,
    float: Format.R32F,
    vec2: Format.RG32F,
    vec3: Format.RGB32F,
    vec4: Format.RGBA32F,
    int8_t: Format.R8I,
    i8vec2: Format.RG8I,
    i8vec3: Format.RGB8I,
    i8vec4: Format.RGBA8I,
    uint8_t: Format.R8UI,
    u8vec2: Format.RG8UI,
    u8vec3: Format.RGB8UI,
    u8vec4: Format.RGBA8UI,
    int16_t: Format.R16I,
    i16vec2: Format.RG16I,
    i16vec3: Format.RGB16I,
    i16vec4: Format.RGBA16I,
    uint16_t: Format.R16UI,
    u16vec2: Format.RG16UI,
    u16vec3: Format.RGB16UI,
    u16vec4: Format.RGBA16UI,
    float16_t: Format.R16F,
    f16vec2: Format.RG16F,
    f16vec3: Format.RGB16F,
    f16vec4: Format.RGBA16F,
    // no suitable conversions:
    mat2: Format.RGBA32F,
    mat3: Format.RGBA32F,
    mat4: Format.RGBA32F,
    mat2x2: Format.RGBA32F,
    mat3x3: Format.RGBA32F,
    mat4x4: Format.RGBA32F,
    mat2x3: Format.RGBA32F,
    mat2x4: Format.RGBA32F,
    mat3x2: Format.RGBA32F,
    mat3x4: Format.RGBA32F,
    mat4x2: Format.RGBA32F,
    mat4x3: Format.RGBA32F,
};
const getFormat = (name) => typeof name === 'string' && Format[name.toUpperCase()];
const getShaderStage = (name) => typeof name === 'string' && ShaderStageFlagBit[name.toUpperCase()];
const getDescriptorType = (name) => typeof name === 'string' && DescriptorType[name.toUpperCase()];
const isNormalized = (format) => {
    const type = FormatInfos[format] && FormatInfos[format].type;
    return type === FormatType.UNORM || type === FormatType.SNORM;
};

const passParams = {
    // color mask
    NONE: ColorMask.NONE,
    R: ColorMask.R,
    G: ColorMask.G,
    B: ColorMask.B,
    A: ColorMask.A,
    RG: ColorMask.R | ColorMask.G,
    RB: ColorMask.R | ColorMask.B,
    RA: ColorMask.R | ColorMask.A,
    GB: ColorMask.G | ColorMask.B,
    GA: ColorMask.G | ColorMask.A,
    BA: ColorMask.B | ColorMask.A,
    RGB: ColorMask.R | ColorMask.G | ColorMask.B,
    RGA: ColorMask.R | ColorMask.G | ColorMask.A,
    RBA: ColorMask.R | ColorMask.B | ColorMask.A,
    GBA: ColorMask.G | ColorMask.B | ColorMask.A,
    ALL: ColorMask.ALL,
    // blend operation
    ADD: BlendOp.ADD,
    SUB: BlendOp.SUB,
    REV_SUB: BlendOp.REV_SUB,
    MIN: BlendOp.MIN,
    MAX: BlendOp.MAX,
    // blend factor
    ZERO: BlendFactor.ZERO,
    ONE: BlendFactor.ONE,
    SRC_ALPHA: BlendFactor.SRC_ALPHA,
    DST_ALPHA: BlendFactor.DST_ALPHA,
    ONE_MINUS_SRC_ALPHA: BlendFactor.ONE_MINUS_SRC_ALPHA,
    ONE_MINUS_DST_ALPHA: BlendFactor.ONE_MINUS_DST_ALPHA,
    SRC_COLOR: BlendFactor.SRC_COLOR,
    DST_COLOR: BlendFactor.DST_COLOR,
    ONE_MINUS_SRC_COLOR: BlendFactor.ONE_MINUS_SRC_COLOR,
    ONE_MINUS_DST_COLOR: BlendFactor.ONE_MINUS_DST_COLOR,
    SRC_ALPHA_SATURATE: BlendFactor.SRC_ALPHA_SATURATE,
    CONSTANT_COLOR: BlendFactor.CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR: BlendFactor.ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA: BlendFactor.CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA: BlendFactor.ONE_MINUS_CONSTANT_ALPHA,
    // stencil operation
    // ZERO: StencilOp.ZERO, // duplicate, safely removed because enum value is(and always will be) the same
    KEEP: StencilOp.KEEP,
    REPLACE: StencilOp.REPLACE,
    INCR: StencilOp.INCR,
    DECR: StencilOp.DECR,
    INVERT: StencilOp.INVERT,
    INCR_WRAP: StencilOp.INCR_WRAP,
    DECR_WRAP: StencilOp.DECR_WRAP,
    // comparison function
    NEVER: ComparisonFunc.NEVER,
    LESS: ComparisonFunc.LESS,
    EQUAL: ComparisonFunc.EQUAL,
    LESS_EQUAL: ComparisonFunc.LESS_EQUAL,
    GREATER: ComparisonFunc.GREATER,
    NOT_EQUAL: ComparisonFunc.NOT_EQUAL,
    GREATER_EQUAL: ComparisonFunc.GREATER_EQUAL,
    ALWAYS: ComparisonFunc.ALWAYS,
    // cull mode
    // NONE: CullMode.NONE, // duplicate, safely removed because enum value is(and always will be) the same
    FRONT: CullMode.FRONT,
    BACK: CullMode.BACK,
    // shade mode
    GOURAND: ShadeModel.GOURAND,
    FLAT: ShadeModel.FLAT,
    // polygon mode
    FILL: PolygonMode.FILL,
    LINE: PolygonMode.LINE,
    POINT: PolygonMode.POINT,
    // primitive mode
    POINT_LIST: PrimitiveMode.POINT_LIST,
    LINE_LIST: PrimitiveMode.LINE_LIST,
    LINE_STRIP: PrimitiveMode.LINE_STRIP,
    LINE_LOOP: PrimitiveMode.LINE_LOOP,
    TRIANGLE_LIST: PrimitiveMode.TRIANGLE_LIST,
    TRIANGLE_STRIP: PrimitiveMode.TRIANGLE_STRIP,
    TRIANGLE_FAN: PrimitiveMode.TRIANGLE_FAN,
    LINE_LIST_ADJACENCY: PrimitiveMode.LINE_LIST_ADJACENCY,
    LINE_STRIP_ADJACENCY: PrimitiveMode.LINE_STRIP_ADJACENCY,
    TRIANGLE_LIST_ADJACENCY: PrimitiveMode.TRIANGLE_LIST_ADJACENCY,
    TRIANGLE_STRIP_ADJACENCY: PrimitiveMode.TRIANGLE_STRIP_ADJACENCY,
    TRIANGLE_PATCH_ADJACENCY: PrimitiveMode.TRIANGLE_PATCH_ADJACENCY,
    QUAD_PATCH_LIST: PrimitiveMode.QUAD_PATCH_LIST,
    ISO_LINE_LIST: PrimitiveMode.ISO_LINE_LIST,

    // POINT: Filter.POINT, // duplicate, safely removed because enum value is(and always will be) the same
    LINEAR: Filter.LINEAR,
    ANISOTROPIC: Filter.ANISOTROPIC,

    WRAP: Address.WRAP,
    MIRROR: Address.MIRROR,
    CLAMP: Address.CLAMP,
    BORDER: Address.BORDER,

    VIEWPORT: DynamicStateFlagBit.VIEWPORT,
    SCISSOR: DynamicStateFlagBit.SCISSOR,
    LINE_WIDTH: DynamicStateFlagBit.LINE_WIDTH,
    DEPTH_BIAS: DynamicStateFlagBit.DEPTH_BIAS,
    BLEND_CONSTANTS: DynamicStateFlagBit.BLEND_CONSTANTS,
    DEPTH_BOUNDS: DynamicStateFlagBit.DEPTH_BOUNDS,
    STENCIL_WRITE_MASK: DynamicStateFlagBit.STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK: DynamicStateFlagBit.STENCIL_COMPARE_MASK,

    TRUE: true,
    FALSE: false,
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
                },
            ],
        },
    ],
};

export {
    murmurhash2_32_gc,
    Sampler,
    SamplerInfo,
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
    SetIndex,
    RenderPriority,
    GetTypeSize,
};
