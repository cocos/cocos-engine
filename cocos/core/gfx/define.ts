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

/**
 * @packageDocumentation
 * @module gfx
 */

export const MAX_ATTACHMENTS = 4;

export enum ObjectType {
    UNKNOWN,
    BUFFER,
    TEXTURE,
    RENDER_PASS,
    FRAMEBUFFER,
    SAMPLER,
    SHADER,
    DESCRIPTOR_SET_LAYOUT,
    PIPELINE_LAYOUT,
    PIPELINE_STATE,
    DESCRIPTOR_SET,
    INPUT_ASSEMBLER,
    COMMAND_BUFFER,
    FENCE,
    QUEUE,
    WINDOW,
}

/**
 * @en GFX base object.
 * @zh GFX 基类对象。
 */
export class Obj {
    public get gfxType (): ObjectType {
        return this._gfxType;
    }

    protected _gfxType = ObjectType.UNKNOWN;

    constructor (gfxType: ObjectType) {
        this._gfxType = gfxType;
    }
}

export enum AttributeName {
    ATTR_POSITION = 'a_position',
    ATTR_NORMAL = 'a_normal',
    ATTR_TANGENT = 'a_tangent',
    ATTR_BITANGENT = 'a_bitangent',
    ATTR_WEIGHTS = 'a_weights',
    ATTR_JOINTS = 'a_joints',
    ATTR_COLOR = 'a_color',
    ATTR_COLOR1 = 'a_color1',
    ATTR_COLOR2 = 'a_color2',
    ATTR_TEX_COORD = 'a_texCoord',
    ATTR_TEX_COORD1 = 'a_texCoord1',
    ATTR_TEX_COORD2 = 'a_texCoord2',
    ATTR_TEX_COORD3 = 'a_texCoord3',
    ATTR_TEX_COORD4 = 'a_texCoord4',
    ATTR_TEX_COORD5 = 'a_texCoord5',
    ATTR_TEX_COORD6 = 'a_texCoord6',
    ATTR_TEX_COORD7 = 'a_texCoord7',
    ATTR_TEX_COORD8 = 'a_texCoord8',
    ATTR_BATCH_ID = 'a_batch_id',
    ATTR_BATCH_UV = 'a_batch_uv',
}

export enum Type {
    // assumptions about the order of this enum: (exploited by other parts of the engine)
    // * vectors always come before samplers
    // * vectors with the same data type are always consecutive, in an component-wise ascending order
    // * unknown is always zero
    UNKNOWN,
    // vectors
    BOOL,
    BOOL2,
    BOOL3,
    BOOL4,

    INT,
    INT2,
    INT3,
    INT4,

    UINT,
    UINT2,
    UINT3,
    UINT4,

    FLOAT,
    FLOAT2,
    FLOAT3,
    FLOAT4,

    MAT2,
    MAT2X3,
    MAT2X4,
    MAT3X2,
    MAT3,
    MAT3X4,
    MAT4X2,
    MAT4X3,
    MAT4,
    // samplers
    SAMPLER1D,
    SAMPLER1D_ARRAY,
    SAMPLER2D,
    SAMPLER2D_ARRAY,
    SAMPLER3D,
    SAMPLER_CUBE,
    COUNT,
}

export enum Format {

    UNKNOWN,

    A8,
    L8,
    LA8,

    R8,
    R8SN,
    R8UI,
    R8I,
    R16F,
    R16UI,
    R16I,
    R32F,
    R32UI,
    R32I,

    RG8,
    RG8SN,
    RG8UI,
    RG8I,
    RG16F,
    RG16UI,
    RG16I,
    RG32F,
    RG32UI,
    RG32I,

    RGB8,
    SRGB8,
    RGB8SN,
    RGB8UI,
    RGB8I,
    RGB16F,
    RGB16UI,
    RGB16I,
    RGB32F,
    RGB32UI,
    RGB32I,

    RGBA8,
    BGRA8,
    SRGB8_A8,
    RGBA8SN,
    RGBA8UI,
    RGBA8I,
    RGBA16F,
    RGBA16UI,
    RGBA16I,
    RGBA32F,
    RGBA32UI,
    RGBA32I,

    // Special Format
    R5G6B5,
    R11G11B10F,
    RGB5A1,
    RGBA4,
    RGB10A2,
    RGB10A2UI,
    RGB9E5,

    // Depth-Stencil Format
    D16,
    D16S8,
    D24,
    D24S8,
    D32F,
    D32F_S8,

    // Compressed Format

    // Block Compression Format, DDS (DirectDraw Surface)
    // DXT1: 3 channels (5:6:5), 1/8 origianl size, with 0 or 1 bit of alpha
    BC1,
    BC1_ALPHA,
    BC1_SRGB,
    BC1_SRGB_ALPHA,
    // DXT3: 4 channels (5:6:5), 1/4 origianl size, with 4 bits of alpha
    BC2,
    BC2_SRGB,
    // DXT5: 4 channels (5:6:5), 1/4 origianl size, with 8 bits of alpha
    BC3,
    BC3_SRGB,
    // 1 channel (8), 1/4 origianl size
    BC4,
    BC4_SNORM,
    // 2 channels (8:8), 1/2 origianl size
    BC5,
    BC5_SNORM,
    // 3 channels (16:16:16), half-floating point, 1/6 origianl size
    // UF16: unsigned float, 5 exponent bits + 11 mantissa bits
    // SF16: signed float, 1 signed bit + 5 exponent bits + 10 mantissa bits
    BC6H_UF16,
    BC6H_SF16,
    // 4 channels (4~7 bits per channel) with 0 to 8 bits of alpha, 1/3 original size
    BC7,
    BC7_SRGB,

    // Ericsson Texture Compression Format
    ETC_RGB8,
    ETC2_RGB8,
    ETC2_SRGB8,
    ETC2_RGB8_A1,
    ETC2_SRGB8_A1,
    ETC2_RGBA8,
    ETC2_SRGB8_A8,
    EAC_R11,
    EAC_R11SN,
    EAC_RG11,
    EAC_RG11SN,

    // PVRTC (PowerVR)
    PVRTC_RGB2,
    PVRTC_RGBA2,
    PVRTC_RGB4,
    PVRTC_RGBA4,
    PVRTC2_2BPP,
    PVRTC2_4BPP,

    // ASTC (Adaptive Scalable Texture Compression)
    ASTC_RGBA_4x4,
    ASTC_RGBA_5x4,
    ASTC_RGBA_5x5,
    ASTC_RGBA_6x5,
    ASTC_RGBA_6x6,
    ASTC_RGBA_8x5,
    ASTC_RGBA_8x6,
    ASTC_RGBA_8x8,
    ASTC_RGBA_10x5,
    ASTC_RGBA_10x6,
    ASTC_RGBA_10x8,
    ASTC_RGBA_10x10,
    ASTC_RGBA_12x10,
    ASTC_RGBA_12x12,

    // ASTC (Adaptive Scalable Texture Compression) SRGB
    ASTC_SRGBA_4x4,
    ASTC_SRGBA_5x4,
    ASTC_SRGBA_5x5,
    ASTC_SRGBA_6x5,
    ASTC_SRGBA_6x6,
    ASTC_SRGBA_8x5,
    ASTC_SRGBA_8x6,
    ASTC_SRGBA_8x8,
    ASTC_SRGBA_10x5,
    ASTC_SRGBA_10x6,
    ASTC_SRGBA_10x8,
    ASTC_SRGBA_10x10,
    ASTC_SRGBA_12x10,
    ASTC_SRGBA_12x12,
}

export enum BufferUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX = 0x4,
    VERTEX = 0x8,
    UNIFORM = 0x10,
    STORAGE = 0x20,
    INDIRECT = 0x40,
}

export type BufferUsage = BufferUsageBit;

export enum MemoryUsageBit {
    NONE = 0,
    DEVICE = 0x1,
    HOST = 0x2,
}

export type MemoryUsage = MemoryUsageBit;

export enum BufferFlagBit {
    NONE = 0,
}

export type BufferFlags = BufferFlagBit;

export enum BufferAccessBit {
    NONE = 0,
    READ = 0x1,
    WRITE = 0x2,
}

export type BufferAccess = BufferAccessBit;

export enum PrimitiveMode {
    POINT_LIST,
    LINE_LIST,
    LINE_STRIP,
    LINE_LOOP,
    LINE_LIST_ADJACENCY,
    LINE_STRIP_ADJACENCY,
    ISO_LINE_LIST,
    // raycast detectable:
    TRIANGLE_LIST,
    TRIANGLE_STRIP,
    TRIANGLE_FAN,
    TRIANGLE_LIST_ADJACENCY,
    TRIANGLE_STRIP_ADJACENCY,
    TRIANGLE_PATCH_ADJACENCY,
    QUAD_PATCH_LIST,
}

export enum PolygonMode {
    FILL,
    POINT,
    LINE,
}

export enum ShadeModel {
    GOURAND,
    FLAT,
}

export enum CullMode {
    NONE,
    FRONT,
    BACK,
}

export enum ComparisonFunc {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
}

export enum StencilOp {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
}

export enum BlendOp {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
}

export enum BlendFactor {
    ZERO,
    ONE,
    SRC_ALPHA,
    DST_ALPHA,
    ONE_MINUS_SRC_ALPHA,
    ONE_MINUS_DST_ALPHA,
    SRC_COLOR,
    DST_COLOR,
    ONE_MINUS_SRC_COLOR,
    ONE_MINUS_DST_COLOR,
    SRC_ALPHA_SATURATE,
    CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA,
}

export enum ColorMask {
    NONE = 0x0,
    R = 0x1,
    G = 0x2,
    B = 0x4,
    A = 0x8,
    ALL = R | G | B | A,
}

export enum Filter {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
}

export enum Address {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
}

export enum TextureType {
    TEX1D,
    TEX2D,
    TEX3D,
    CUBE,
    TEX1D_ARRAY,
    TEX2D_ARRAY,
}

export enum TextureUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    SAMPLED = 0x4,
    STORAGE = 0x8,
    COLOR_ATTACHMENT = 0x10,
    DEPTH_STENCIL_ATTACHMENT = 0x20,
    TRANSIENT_ATTACHMENT = 0x40,
    INPUT_ATTACHMENT = 0x80,
}

export type TextureUsage = TextureUsageBit;

export enum SampleCount {
    X1,
    X2,
    X4,
    X8,
    X16,
    X32,
    X64,
}

export enum TextureFlagBit {
    NONE = 0,
    GEN_MIPMAP = 0x1,
    CUBEMAP = 0x2,
    BAKUP_BUFFER = 0x4,
    IMMUTABLE = 0x8,
}
export type TextureFlags = TextureFlagBit;

export enum ShaderStageFlagBit {
    NONE = 0,
    VERTEX = 0x1,
    CONTROL = 0x2,
    EVALUATION = 0x4,
    GEOMETRY = 0x8,
    FRAGMENT = 0x10,
    COMPUTE = 0x20,
    ALL = 0x3f,
}
export type ShaderStageFlags = ShaderStageFlagBit;

export enum DescriptorType {
    UNKNOWN = 0,
    UNIFORM_BUFFER = 0x1,
    DYNAMIC_UNIFORM_BUFFER = 0x2,
    STORAGE_BUFFER = 0x4,
    DYNAMIC_STORAGE_BUFFER = 0x8,
    SAMPLER = 0x10,
}

export enum CommandBufferType {
    PRIMARY,
    SECONDARY,
}

export enum LoadOp {
    LOAD,    // Load the previous data
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore the previous data
}

export enum StoreOp {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
}

export enum TextureLayout {
    UNDEFINED,
    GENERAL,
    COLOR_ATTACHMENT_OPTIMAL,
    DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
    DEPTH_STENCIL_READONLY_OPTIMAL,
    SHADER_READONLY_OPTIMAL,
    TRANSFER_SRC_OPTIMAL,
    TRANSFER_DST_OPTIMAL,
    PREINITIALIZED,
    PRESENT_SRC,
}

export enum PipelineBindPoint {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
}

export enum DynamicStateFlagBit {
    NONE = 0x0,
    VIEWPORT = 0x1,
    SCISSOR = 0x2,
    LINE_WIDTH = 0x4,
    DEPTH_BIAS = 0x8,
    BLEND_CONSTANTS = 0x10,
    DEPTH_BOUNDS = 0x20,
    STENCIL_WRITE_MASK = 0x40,
    STENCIL_COMPARE_MASK = 0x80,
}

export type DynamicStateFlags = DynamicStateFlagBit;

export enum StencilFace {
    FRONT,
    BACK,
    ALL,
}

export enum QueueType {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
}

export enum ClearFlag {
    NONE = 0,
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL = COLOR | DEPTH | STENCIL,
}

export enum FormatType {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
}

export enum API {
    UNKNOWN,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    WEBGL,
    WEBGL2,
    WEBGPU,
}

export enum SurfaceTransform {
    IDENTITY,
    ROTATE_90,
    ROTATE_180,
    ROTATE_270,
}

export enum Feature {
    COLOR_FLOAT,
    COLOR_HALF_FLOAT,
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    TEXTURE_FLOAT_LINEAR,
    TEXTURE_HALF_FLOAT_LINEAR,
    FORMAT_R11G11B10F,
    FORMAT_D16,
    FORMAT_D16S8,
    FORMAT_D24,
    FORMAT_D24S8,
    FORMAT_D32F,
    FORMAT_D32FS8,
    FORMAT_ETC1,
    FORMAT_ETC2,
    FORMAT_DXT,
    FORMAT_PVRTC,
    FORMAT_ASTC,
    FORMAT_RGB8,
    MSAA,
    ELEMENT_INDEX_UINT,
    INSTANCED_ARRAYS,
    MULTIPLE_RENDER_TARGETS,
    BLEND_MINMAX,
    DEPTH_BOUNDS,
    LINE_WIDTH,
    STENCIL_WRITE_MASK,
    STENCIL_COMPARE_MASK,
    COUNT,
}

export class FormatInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public readonly name: string,
        public readonly size: number,
        public readonly count: number,
        public readonly type: FormatType,
        public readonly hasAlpha: boolean,
        public readonly hasDepth: boolean,
        public readonly hasStencil: boolean,
        public readonly isCompressed: boolean,
    ) {}
}

export class MemoryStatus {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bufferSize: number = 0,
        public textureSize: number = 0,
    ) {}
}

export const FormatInfos = Object.freeze([

    new FormatInfo('UNKNOWN', 0, 0, FormatType.NONE, false, false, false, false),

    new FormatInfo('A8', 1, 1, FormatType.UNORM, true, false, false, false),
    new FormatInfo('L8', 1, 1, FormatType.UNORM, false, false, false, false),
    new FormatInfo('LA8', 1, 2, FormatType.UNORM, true, false, false, false),

    new FormatInfo('R8', 1, 1, FormatType.UNORM, false, false, false, false),
    new FormatInfo('R8SN', 1, 1, FormatType.SNORM, false, false, false, false),
    new FormatInfo('R8UI', 1, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R8I', 1, 1, FormatType.INT, false, false, false, false),
    new FormatInfo('R16F', 2, 1, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('R16UI', 2, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R16I', 2, 1, FormatType.INT, false, false, false, false),
    new FormatInfo('R32F', 4, 1, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('R32UI', 4, 1, FormatType.UINT, false, false, false, false),
    new FormatInfo('R32I', 4, 1, FormatType.INT, false, false, false, false),

    new FormatInfo('RG8', 2, 2, FormatType.UNORM, false, false, false, false),
    new FormatInfo('RG8SN', 2, 2, FormatType.SNORM, false, false, false, false),
    new FormatInfo('RG8UI', 2, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG8I', 2, 2, FormatType.INT, false, false, false, false),
    new FormatInfo('RG16F', 4, 2, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RG16UI', 4, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG16I', 4, 2, FormatType.INT, false, false, false, false),
    new FormatInfo('RG32F', 8, 2, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RG32UI', 8, 2, FormatType.UINT, false, false, false, false),
    new FormatInfo('RG32I', 8, 2, FormatType.INT, false, false, false, false),

    new FormatInfo('RGB8', 3, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('SRGB8', 3, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('RGB8SN', 3, 3, FormatType.SNORM, false, false, false, false),
    new FormatInfo('RGB8UI', 3, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB8I', 3, 3, FormatType.INT, false, false, false, false),
    new FormatInfo('RGB16F', 6, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB16UI', 6, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB16I', 6, 3, FormatType.INT, false, false, false, false),
    new FormatInfo('RGB32F', 12, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB32UI', 12, 3, FormatType.UINT, false, false, false, false),
    new FormatInfo('RGB32I', 12, 3, FormatType.INT, false, false, false, false),

    new FormatInfo('RGBA8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('BGRA8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('SRGB8_A8', 4, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGBA8SN', 4, 4, FormatType.SNORM, true, false, false, false),
    new FormatInfo('RGBA8UI', 4, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA8I', 4, 4, FormatType.INT, true, false, false, false),
    new FormatInfo('RGBA16F', 8, 4, FormatType.FLOAT, true, false, false, false),
    new FormatInfo('RGBA16UI', 8, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA16I', 8, 4, FormatType.INT, true, false, false, false),
    new FormatInfo('RGBA32F', 16, 4, FormatType.FLOAT, true, false, false, false),
    new FormatInfo('RGBA32UI', 16, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGBA32I', 16, 4, FormatType.INT, true, false, false, false),

    new FormatInfo('R5G6B5', 2, 3, FormatType.UNORM, false, false, false, false),
    new FormatInfo('R11G11B10F', 4, 3, FormatType.FLOAT, false, false, false, false),
    new FormatInfo('RGB5A1', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGBA4', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGB10A2', 2, 4, FormatType.UNORM, true, false, false, false),
    new FormatInfo('RGB10A2UI', 2, 4, FormatType.UINT, true, false, false, false),
    new FormatInfo('RGB9E5', 2, 4, FormatType.FLOAT, true, false, false, false),

    new FormatInfo('D16', 2, 1, FormatType.UINT, false, true, false, false),
    new FormatInfo('D16S8', 3, 2, FormatType.UINT, false, true, true, false),
    new FormatInfo('D24', 3, 1, FormatType.UINT, false, true, false, false),
    new FormatInfo('D24S8', 4, 2, FormatType.UINT, false, true, true, false),
    new FormatInfo('D32F', 4, 1, FormatType.FLOAT, false, true, false, false),
    new FormatInfo('D32FS8', 5, 2, FormatType.FLOAT, false, true, true, false),

    new FormatInfo('BC1', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC1_ALPHA', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC1_SRGB', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC1_SRGB_ALPHA', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC2', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC2_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC3', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC3_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC4', 1, 1, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC4_SNORM', 1, 1, FormatType.SNORM, false, false, false, true),
    new FormatInfo('BC5', 1, 2, FormatType.UNORM, false, false, false, true),
    new FormatInfo('BC5_SNORM', 1, 2, FormatType.SNORM, false, false, false, true),
    new FormatInfo('BC6H_UF16', 1, 3, FormatType.UFLOAT, false, false, false, true),
    new FormatInfo('BC6H_SF16', 1, 3, FormatType.FLOAT, false, false, false, true),
    new FormatInfo('BC7', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('BC7_SRGB', 1, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ETC_RGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_RGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_SRGB8', 1, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('ETC2_RGB8_A1', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_SRGB8_A1', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_RGBA8', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ETC2_SRGB8_A8', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('EAC_R11', 1, 1, FormatType.UNORM, false, false, false, true),
    new FormatInfo('EAC_R11SN', 1, 1, FormatType.SNORM, false, false, false, true),
    new FormatInfo('EAC_RG11', 2, 2, FormatType.UNORM, false, false, false, true),
    new FormatInfo('EAC_RG11SN', 2, 2, FormatType.SNORM, false, false, false, true),

    new FormatInfo('PVRTC_RGB2', 2, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('PVRTC_RGBA2', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC_RGB4', 2, 3, FormatType.UNORM, false, false, false, true),
    new FormatInfo('PVRTC_RGBA4', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC2_2BPP', 2, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('PVRTC2_4BPP', 2, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ASTC_RGBA_4x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_5x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_5x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_6x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_6x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_8x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_10x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_12x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_RGBA_12x12', 1, 4, FormatType.UNORM, true, false, false, true),

    new FormatInfo('ASTC_SRGBA_4x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_5x4', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_5x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_6x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_6x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_8x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x5', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x6', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x8', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_10x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_12x10', 1, 4, FormatType.UNORM, true, false, false, true),
    new FormatInfo('ASTC_SRGBA_12x12', 1, 4, FormatType.UNORM, true, false, false, true),
]);

/**
 * @en Get memory size of the specified fomat.
 * @zh 获取指定格式对应的内存大小。
 * @param format The target format.
 * @param width The target width.
 * @param height The target height.
 * @param depth The target depth.
 */
export function FormatSize (format: Format, width: number, height: number, depth: number): number {
    if (!FormatInfos[format].isCompressed) {
        return (width * height * depth * FormatInfos[format].size);
    } else {
        switch (format) {
        case Format.BC1:
        case Format.BC1_ALPHA:
        case Format.BC1_SRGB:
        case Format.BC1_SRGB_ALPHA:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
        case Format.BC2:
        case Format.BC2_SRGB:
        case Format.BC3:
        case Format.BC3_SRGB:
        case Format.BC4:
        case Format.BC4_SNORM:
        case Format.BC6H_SF16:
        case Format.BC6H_UF16:
        case Format.BC7:
        case Format.BC7_SRGB:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
        case Format.BC5:
        case Format.BC5_SNORM:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 32 * depth;

        case Format.ETC_RGB8:
        case Format.ETC2_RGB8:
        case Format.ETC2_SRGB8:
        case Format.ETC2_RGB8_A1:
        case Format.EAC_R11:
        case Format.EAC_R11SN:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
        case Format.ETC2_RGBA8:
        case Format.ETC2_SRGB8_A1:
        case Format.EAC_RG11:
        case Format.EAC_RG11SN:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

        case Format.PVRTC_RGB2:
        case Format.PVRTC_RGBA2:
        case Format.PVRTC2_2BPP:
            return Math.ceil(Math.max(width, 16) * Math.max(height, 8) / 4) * depth;
        case Format.PVRTC_RGB4:
        case Format.PVRTC_RGBA4:
        case Format.PVRTC2_4BPP:
            return Math.ceil(Math.max(width, 8) * Math.max(height, 8) / 2) * depth;

        case Format.ASTC_RGBA_4x4:
        case Format.ASTC_SRGBA_4x4:
            return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
        case Format.ASTC_RGBA_5x4:
        case Format.ASTC_SRGBA_5x4:
            return Math.ceil(width / 5) * Math.ceil(height / 4) * 16 * depth;
        case Format.ASTC_RGBA_5x5:
        case Format.ASTC_SRGBA_5x5:
            return Math.ceil(width / 5) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_6x5:
        case Format.ASTC_SRGBA_6x5:
            return Math.ceil(width / 6) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_6x6:
        case Format.ASTC_SRGBA_6x6:
            return Math.ceil(width / 6) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_8x5:
        case Format.ASTC_SRGBA_8x5:
            return Math.ceil(width / 8) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_8x6:
        case Format.ASTC_SRGBA_8x6:
            return Math.ceil(width / 8) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_8x8:
        case Format.ASTC_SRGBA_8x8:
            return Math.ceil(width / 8) * Math.ceil(height / 8) * 16 * depth;
        case Format.ASTC_RGBA_10x5:
        case Format.ASTC_SRGBA_10x5:
            return Math.ceil(width / 10) * Math.ceil(height / 5) * 16 * depth;
        case Format.ASTC_RGBA_10x6:
        case Format.ASTC_SRGBA_10x6:
            return Math.ceil(width / 10) * Math.ceil(height / 6) * 16 * depth;
        case Format.ASTC_RGBA_10x8:
        case Format.ASTC_SRGBA_10x8:
            return Math.ceil(width / 10) * Math.ceil(height / 8) * 16 * depth;
        case Format.ASTC_RGBA_10x10:
        case Format.ASTC_SRGBA_10x10:
            return Math.ceil(width / 10) * Math.ceil(height / 10) * 16 * depth;
        case Format.ASTC_RGBA_12x10:
        case Format.ASTC_SRGBA_12x10:
            return Math.ceil(width / 12) * Math.ceil(height / 10) * 16 * depth;
        case Format.ASTC_RGBA_12x12:
        case Format.ASTC_SRGBA_12x12:
            return Math.ceil(width / 12) * Math.ceil(height / 12) * 16 * depth;

        default: {
            return 0;
        }
        }
    }
}

/**
 * @en Get memory size of the specified surface.
 * @zh GFX 格式表面内存大小。
 * @param format The target format.
 * @param width The target width.
 * @param height The target height.
 * @param depth The target depth.
 * @param mips The target mip levels.
 */
export function FormatSurfaceSize (
    format: Format, width: number, height: number,
    depth: number, mips: number,
): number {
    let size = 0;

    for (let i = 0; i < mips; ++i) {
        size += FormatSize(format, width, height, depth);
        width = Math.max(width >> 1, 1);
        height = Math.max(height >> 1, 1);
    }

    return size;
}

const _type2size = [
    0,  // UNKNOWN
    4,  // BOOL
    8,  // BOOL2
    12, // BOOL3
    16, // BOOL4
    4,  // INT
    8,  // INT2
    12, // INT3
    16, // INT4
    4,  // UINT
    8,  // UINT2
    12, // UINT3
    16, // UINT4
    4,  // FLOAT
    8,  // FLOAT2
    12, // FLOAT3
    16, // FLOAT4
    16, // MAT2
    24, // MAT2X3
    32, // MAT2X4
    24, // MAT3X2
    36, // MAT3
    48, // MAT3X4
    32, // MAT4X2
    48, // MAT4X3
    64, // MAT4
    4,  // SAMPLER1D
    4,  // SAMPLER1D_ARRAY
    4,  // SAMPLER2D
    4,  // SAMPLER2D_ARRAY
    4,  // SAMPLER3D
    4,  // SAMPLER_CUBE
];

/**
 * @en Get the memory size of the specified type.
 * @zh 得到 GFX 数据类型的大小。
 * @param type The target type.
 */
export function GetTypeSize (type: Type): number {
    return _type2size[type] || 0;
}

export function getTypedArrayConstructor (info: FormatInfo): TypedArrayConstructor {
    const stride = info.size / info.count;
    switch (info.type) {
    case FormatType.UNORM:
    case FormatType.UINT: {
        switch (stride) {
        case 1: return Uint8Array;
        case 2: return Uint16Array;
        case 4: return Uint32Array;
        }
        break;
    }
    case FormatType.SNORM:
    case FormatType.INT: {
        switch (stride) {
        case 1: return Int8Array;
        case 2: return Int16Array;
        case 4: return Int32Array;
        }
        break;
    }
    case FormatType.FLOAT: {
        return Float32Array;
    }
    }
    return Float32Array;
}
