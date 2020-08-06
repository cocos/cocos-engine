/**
 * @category gfx
 */

export const GFX_MAX_VERTEX_ATTRIBUTES: number = 16;
export const GFX_MAX_TEXTURE_UNITS: number = 16;
export const GFX_MAX_ATTACHMENTS: number = 4;
export const GFX_MAX_BUFFER_BINDINGS: number = 24;

export enum GFXObjectType {
    UNKNOWN,
    BUFFER,
    TEXTURE,
    TEXTURE_VIEW,
    RENDER_PASS,
    FRAMEBUFFER,
    SAMPLER,
    SHADER,
    PIPELINE_STATE,
    DESCRIPTOR_SET,
    INPUT_ASSEMBLER,
    COMMAND_BUFFER,
    FENCE,
    QUEUE,
    WINDOW,
}

export enum GFXStatus {
    UNREADY,
    FAILED,
    SUCCESS,
}

/**
 * @en GFX base object.
 * @zh GFX 基类对象。
 */
export class GFXObject {

    public get gfxType (): GFXObjectType {
        return this._gfxType;
    }

    public get status (): GFXStatus {
        return this._status;
    }

    protected _gfxType = GFXObjectType.UNKNOWN;

    protected _status = GFXStatus.UNREADY;

    constructor (gfxType: GFXObjectType) {
        this._gfxType = gfxType;
    }
}

export enum GFXAttributeName {
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

export enum GFXType {
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

export enum GFXFormat {

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

export enum GFXBufferUsageBit {
    NONE = 0,
    TRANSFER_SRC = 0x1,
    TRANSFER_DST = 0x2,
    INDEX = 0x4,
    VERTEX = 0x8,
    UNIFORM = 0x10,
    STORAGE = 0x20,
    INDIRECT = 0x40,
}

export type GFXBufferUsage = GFXBufferUsageBit;

export enum GFXMemoryUsageBit {
    NONE = 0,
    DEVICE = 0x1,
    HOST = 0x2,
}

export type GFXMemoryUsage = GFXMemoryUsageBit;

export enum GFXBufferFlagBit {
    NONE = 0,
    BAKUP_BUFFER = 0x4,
}

export type GFXBufferFlags = GFXBufferFlagBit;

export enum GFXBufferAccessBit {
    NONE = 0,
    READ = 0x1,
    WRITE = 0x2,
}

export type GFXBufferAccess = GFXBufferAccessBit;

export enum GFXPrimitiveMode {
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

export enum GFXPolygonMode {
    FILL,
    POINT,
    LINE,
}

export enum GFXShadeModel {
    GOURAND,
    FLAT,
}

export enum GFXCullMode {
    NONE,
    FRONT,
    BACK,
}

export enum GFXComparisonFunc {
    NEVER,
    LESS,
    EQUAL,
    LESS_EQUAL,
    GREATER,
    NOT_EQUAL,
    GREATER_EQUAL,
    ALWAYS,
}

export enum GFXStencilOp {
    ZERO,
    KEEP,
    REPLACE,
    INCR,
    DECR,
    INVERT,
    INCR_WRAP,
    DECR_WRAP,
}

export enum GFXBlendOp {
    ADD,
    SUB,
    REV_SUB,
    MIN,
    MAX,
}

export enum GFXBlendFactor {
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

export enum GFXColorMask {
    NONE = 0x0,
    R = 0x1,
    G = 0x2,
    B = 0x4,
    A = 0x8,
    ALL = R | G | B | A,
}

export enum GFXFilter {
    NONE,
    POINT,
    LINEAR,
    ANISOTROPIC,
}

export enum GFXAddress {
    WRAP,
    MIRROR,
    CLAMP,
    BORDER,
}

export enum GFXTextureType {
    TEX1D,
    TEX2D,
    TEX3D,
    CUBE,
    TEX1D_ARRAY,
    TEX2D_ARRAY,
}

export enum GFXTextureUsageBit {
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

export type GFXTextureUsage = GFXTextureUsageBit;

export enum GFXSampleCount {
    X1,
    X2,
    X4,
    X8,
    X16,
    X32,
    X64,
}

export enum GFXTextureFlagBit {
    NONE = 0,
    GEN_MIPMAP = 0x1,
    CUBEMAP = 0x2,
    BAKUP_BUFFER = 0x4,
}

export type GFXTextureFlags = GFXTextureFlagBit;

export enum GFXShaderType {
    NONE = 0,
    VERTEX = 0x1,
    CONTROL = 0x2,
    EVALUATION = 0x4,
    GEOMETRY = 0x8,
    FRAGMENT = 0x10,
    COMPUTE = 0x20,
    ALL = 0x3f,
}

export enum GFXDescriptorType {
    UNKNOWN,
    UNIFORM_BUFFER,
    SAMPLER,
    STORAGE_BUFFER,
}

export enum GFXCommandBufferType {
    PRIMARY,
    SECONDARY,
}

export enum GFXLoadOp {
    LOAD,    // Load the previous data
    CLEAR,   // Clear the fbo
    DISCARD, // Ignore the previous data
}

export enum GFXStoreOp {
    STORE,   // Write the source to the destination
    DISCARD, // Don't write the source to the destination
}

export enum GFXTextureLayout {
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

export enum GFXPipelineBindPoint {
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
}

export enum GFXDynamicStateFlagBit {
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

export type GFXDynamicStateFlags = GFXDynamicStateFlagBit;

export enum GFXStencilFace {
    FRONT,
    BACK,
    ALL,
}

export enum GFXQueueType {
    GRAPHICS,
    COMPUTE,
    TRANSFER,
}

export class GFXRect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor (x = 0, y = 0, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class GFXViewport {
    public left: number;
    public top: number;
    public width: number;
    public height: number;
    public minDepth: number;
    public maxDepth: number;

    constructor (left = 0, top = 0, width = 0, height = 0, minDepth = 0, maxDepth = 1) {
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
    }
}

export class GFXColor {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor (r = 0, g = 0, b = 0, a = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export enum GFXClearFlag {
    NONE = 0,
    COLOR = 1,
    DEPTH = 2,
    STENCIL = 4,
    DEPTH_STENCIL = DEPTH | STENCIL,
    ALL = COLOR | DEPTH | STENCIL,
}

export class GFXOffset {
    public x: number;
    public y: number;
    public z: number;

    constructor (x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class GFXExtent {
    public width: number;
    public height: number;
    public depth: number;

    constructor (width = 0, height = 0, depth = 1) {
        this.width = width;
        this.height = height;
        this.depth = depth;
    }
}

export class GFXTextureSubres {
    public mipLevel: number;
    public baseArrayLayer: number;
    public layerCount: number;

    constructor (mipLevel = 0, baseArrayLayer = 0, layerCount = 1) {
        this.mipLevel = mipLevel;
        this.baseArrayLayer = baseArrayLayer;
        this.layerCount = layerCount;
    }
}

export class GFXTextureCopy {
    public srcSubres: GFXTextureSubres;
    public srcOffset: GFXOffset;
    public dstSubres: GFXTextureSubres;
    public dstOffset: GFXOffset;
    public extent: GFXExtent;

    constructor (srcSubres = new GFXTextureSubres(), srcOffset = new GFXOffset(),
                 dstSubres = new GFXTextureSubres(), dstOffset = new GFXOffset(), extent = new GFXExtent()) {
        this.srcSubres = srcSubres;
        this.srcOffset = srcOffset;
        this.dstSubres = dstSubres;
        this.dstOffset = dstOffset;
        this.extent = extent;
    }
}

export class GFXBufferTextureCopy {
    public buffStride: number;
    public buffTexHeight: number;
    public texOffset: GFXOffset;
    public texExtent: GFXExtent;
    public texSubres: GFXTextureSubres;

    constructor (buffStride = 0, buffTexHeight = 0,
                 texOffset = new GFXOffset(), texExtent = new GFXExtent(), texSubres = new GFXTextureSubres()) {
        this.buffStride = buffStride;
        this.buffTexHeight = buffTexHeight;
        this.texOffset = texOffset;
        this.texExtent = texExtent;
        this.texSubres = texSubres;
    }
}

export enum GFXFormatType {
    NONE,
    UNORM,
    SNORM,
    UINT,
    INT,
    UFLOAT,
    FLOAT,
}

export class GFXFormatInfo {
    public readonly name: string;
    public readonly size: number;
    public readonly count: number;
    public readonly type: GFXFormatType;
    public readonly hasAlpha: boolean;
    public readonly hasDepth: boolean;
    public readonly hasStencil: boolean;
    public readonly isCompressed: boolean;

    constructor (name: string, size: number, count: number, type: GFXFormatType,
                 hasAlpha: boolean, hasDepth: boolean, hasStencil: boolean, isCompressed: boolean) {
        this.name = name;
        this.size = size;
        this.count = count;
        this.type = type;
        this.hasAlpha = hasAlpha;
        this.hasDepth = hasDepth;
        this.hasStencil = hasStencil;
        this.isCompressed = isCompressed;
    }
}

export class GFXMemoryStatus {
    public bufferSize: number = 0;
    public textureSize: number = 0;
}

export const GFXFormatInfos = Object.freeze([

    new GFXFormatInfo('UNKNOWN', 0, 0, GFXFormatType.NONE, false, false, false, false),

    new GFXFormatInfo('A8', 1, 1, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('L8', 1, 1, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('LA8', 1, 2, GFXFormatType.UNORM, true, false, false, false),

    new GFXFormatInfo('R8', 1, 1, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('R8SN', 1, 1, GFXFormatType.SNORM, false, false, false, false),
    new GFXFormatInfo('R8UI', 1, 1, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('R8I', 1, 1, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('R16F', 2, 1, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('R16UI', 2, 1, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('R16I', 2, 1, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('R32F', 4, 1, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('R32UI', 4, 1, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('R32I', 4, 1, GFXFormatType.INT, false, false, false, false),

    new GFXFormatInfo('RG8', 2, 2, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('RG8SN', 2, 2, GFXFormatType.SNORM, false, false, false, false),
    new GFXFormatInfo('RG8UI', 2, 2, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RG8I', 2, 2, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('RG16F', 4, 2, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('RG16UI', 4, 2, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RG16I', 4, 2, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('RG32F', 8, 2, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('RG32UI', 8, 2, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RG32I', 8, 2, GFXFormatType.INT, false, false, false, false),

    new GFXFormatInfo('RGB8', 3, 3, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('SRGB8', 3, 3, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('RGB8SN', 3, 3, GFXFormatType.SNORM, false, false, false, false),
    new GFXFormatInfo('RGB8UI', 3, 3, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RGB8I', 3, 3, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('RGB16F', 6, 3, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('RGB16UI', 6, 3, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RGB16I', 6, 3, GFXFormatType.INT, false, false, false, false),
    new GFXFormatInfo('RGB32F', 12, 3, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('RGB32UI', 12, 3, GFXFormatType.UINT, false, false, false, false),
    new GFXFormatInfo('RGB32I', 12, 3, GFXFormatType.INT, false, false, false, false),

    new GFXFormatInfo('RGBA8', 4, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('BGRA8', 4, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('SRGB8_A8', 4, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('RGBA8SN', 4, 4, GFXFormatType.SNORM, true, false, false, false),
    new GFXFormatInfo('RGBA8UI', 4, 4, GFXFormatType.UINT, true, false, false, false),
    new GFXFormatInfo('RGBA8I', 4, 4, GFXFormatType.INT, true, false, false, false),
    new GFXFormatInfo('RGBA16F', 8, 4, GFXFormatType.FLOAT, true, false, false, false),
    new GFXFormatInfo('RGBA16UI', 8, 4, GFXFormatType.UINT, true, false, false, false),
    new GFXFormatInfo('RGBA16I', 8, 4, GFXFormatType.INT, true, false, false, false),
    new GFXFormatInfo('RGBA32F', 16, 4, GFXFormatType.FLOAT, true, false, false, false),
    new GFXFormatInfo('RGBA32UI', 16, 4, GFXFormatType.UINT, true, false, false, false),
    new GFXFormatInfo('RGBA32I', 16, 4, GFXFormatType.INT, true, false, false, false),

    new GFXFormatInfo('R5G6B5', 2, 3, GFXFormatType.UNORM, false, false, false, false),
    new GFXFormatInfo('R11G11B10F', 4, 3, GFXFormatType.FLOAT, false, false, false, false),
    new GFXFormatInfo('RGB5A1', 2, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('RGBA4', 2, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('RGB10A2', 2, 4, GFXFormatType.UNORM, true, false, false, false),
    new GFXFormatInfo('RGB10A2UI', 2, 4, GFXFormatType.UINT, true, false, false, false),
    new GFXFormatInfo('RGB9E5', 2, 4, GFXFormatType.FLOAT, true, false, false, false),

    new GFXFormatInfo('D16', 2, 1, GFXFormatType.UINT, false, true, false, false),
    new GFXFormatInfo('D16S8', 3, 2, GFXFormatType.UINT, false, true, true, false),
    new GFXFormatInfo('D24', 3, 1, GFXFormatType.UINT, false, true, false, false),
    new GFXFormatInfo('D24S8', 4, 2, GFXFormatType.UINT, false, true, true, false),
    new GFXFormatInfo('D32F', 4, 1, GFXFormatType.FLOAT, false, true, false, false),
    new GFXFormatInfo('D32FS8', 5, 2, GFXFormatType.FLOAT, false, true, true, false),

    new GFXFormatInfo('BC1', 1, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('BC1_ALPHA', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC1_SRGB', 1, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('BC1_SRGB_ALPHA', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC2', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC2_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC3', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC3_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC4', 1, 1, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('BC4_SNORM', 1, 1, GFXFormatType.SNORM, false, false, false, true),
    new GFXFormatInfo('BC5', 1, 2, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('BC5_SNORM', 1, 2, GFXFormatType.SNORM, false, false, false, true),
    new GFXFormatInfo('BC6H_UF16', 1, 3, GFXFormatType.UFLOAT, false, false, false, true),
    new GFXFormatInfo('BC6H_SF16', 1, 3, GFXFormatType.FLOAT, false, false, false, true),
    new GFXFormatInfo('BC7', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('BC7_SRGB', 1, 4, GFXFormatType.UNORM, true, false, false, true),

    new GFXFormatInfo('ETC_RGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('ETC2_RGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('ETC2_SRGB8', 1, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('ETC2_RGB8_A1', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ETC2_SRGB8_A1', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ETC2_RGBA8', 2, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ETC2_SRGB8_A8', 2, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('EAC_R11', 1, 1, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('EAC_R11SN', 1, 1, GFXFormatType.SNORM, false, false, false, true),
    new GFXFormatInfo('EAC_RG11', 2, 2, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('EAC_RG11SN', 2, 2, GFXFormatType.SNORM, false, false, false, true),

    new GFXFormatInfo('PVRTC_RGB2', 2, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('PVRTC_RGBA2', 2, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('PVRTC_RGB4', 2, 3, GFXFormatType.UNORM, false, false, false, true),
    new GFXFormatInfo('PVRTC_RGBA4', 2, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('PVRTC2_2BPP', 2, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('PVRTC2_4BPP', 2, 4, GFXFormatType.UNORM, true, false, false, true),

    new GFXFormatInfo('ASTC_RGBA_4x4', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_5x4', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_5x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_6x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_6x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_8x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_8x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_8x8', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_10x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_10x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_10x8', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_10x10', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_12x10', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_RGBA_12x12', 1, 4, GFXFormatType.UNORM, true, false, false, true),

    new GFXFormatInfo('ASTC_SRGBA_4x4', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_5x4', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_5x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_6x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_6x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_8x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_8x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_8x8', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_10x5', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_10x6', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_10x8', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_10x10', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_12x10', 1, 4, GFXFormatType.UNORM, true, false, false, true),
    new GFXFormatInfo('ASTC_SRGBA_12x12', 1, 4, GFXFormatType.UNORM, true, false, false, true),
]);

/**
 * @en Get memory size of the specified fomat.
 * @zh 获取指定格式对应的内存大小。
 * @param format The target format.
 * @param width The target width.
 * @param height The target height.
 * @param depth The target depth.
 */
export function GFXFormatSize (format: GFXFormat, width: number, height: number, depth: number): number {

    if (!GFXFormatInfos[format].isCompressed) {
        return (width * height * depth * GFXFormatInfos[format].size);
    } else {
        switch (format) {
            case GFXFormat.BC1:
            case GFXFormat.BC1_ALPHA:
            case GFXFormat.BC1_SRGB:
            case GFXFormat.BC1_SRGB_ALPHA:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
            case GFXFormat.BC2:
            case GFXFormat.BC2_SRGB:
            case GFXFormat.BC3:
            case GFXFormat.BC3_SRGB:
            case GFXFormat.BC4:
            case GFXFormat.BC4_SNORM:
            case GFXFormat.BC6H_SF16:
            case GFXFormat.BC6H_UF16:
            case GFXFormat.BC7:
            case GFXFormat.BC7_SRGB:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
            case GFXFormat.BC5:
            case GFXFormat.BC5_SNORM:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 32 * depth;

            case GFXFormat.ETC_RGB8:
            case GFXFormat.ETC2_RGB8:
            case GFXFormat.ETC2_SRGB8:
            case GFXFormat.ETC2_RGB8_A1:
            case GFXFormat.EAC_R11:
            case GFXFormat.EAC_R11SN:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 8 * depth;
            case GFXFormat.ETC2_RGBA8:
            case GFXFormat.ETC2_SRGB8_A1:
            case GFXFormat.EAC_RG11:
            case GFXFormat.EAC_RG11SN:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;

            case GFXFormat.PVRTC_RGB2:
            case GFXFormat.PVRTC_RGBA2:
            case GFXFormat.PVRTC2_2BPP:
                return Math.ceil(Math.max(width, 16) * Math.max(height, 8) / 4) * depth;
            case GFXFormat.PVRTC_RGB4:
            case GFXFormat.PVRTC_RGBA4:
            case GFXFormat.PVRTC2_4BPP:
                return Math.ceil(Math.max(width, 8) * Math.max(height, 8) / 2) * depth;

            case GFXFormat.ASTC_RGBA_4x4:
            case GFXFormat.ASTC_SRGBA_4x4:
                return Math.ceil(width / 4) * Math.ceil(height / 4) * 16 * depth;
            case GFXFormat.ASTC_RGBA_5x4:
            case GFXFormat.ASTC_SRGBA_5x4:
                return Math.ceil(width / 5) * Math.ceil(height / 4) * 16 * depth;
            case GFXFormat.ASTC_RGBA_5x5:
            case GFXFormat.ASTC_SRGBA_5x5:
                return Math.ceil(width / 5) * Math.ceil(height / 5) * 16 * depth;
            case GFXFormat.ASTC_RGBA_6x5:
            case GFXFormat.ASTC_SRGBA_6x5:
                return Math.ceil(width / 6) * Math.ceil(height / 5) * 16 * depth;
            case GFXFormat.ASTC_RGBA_6x6:
            case GFXFormat.ASTC_SRGBA_6x6:
                return Math.ceil(width / 6) * Math.ceil(height / 6) * 16 * depth;
            case GFXFormat.ASTC_RGBA_8x5:
            case GFXFormat.ASTC_SRGBA_8x5:
                return Math.ceil(width / 8) * Math.ceil(height / 5) * 16 * depth;
            case GFXFormat.ASTC_RGBA_8x6:
            case GFXFormat.ASTC_SRGBA_8x6:
                return Math.ceil(width / 8) * Math.ceil(height / 6) * 16 * depth;
            case GFXFormat.ASTC_RGBA_8x8:
            case GFXFormat.ASTC_SRGBA_8x8:
                return Math.ceil(width / 8) * Math.ceil(height / 8) * 16 * depth;
            case GFXFormat.ASTC_RGBA_10x5:
            case GFXFormat.ASTC_SRGBA_10x5:
                return Math.ceil(width / 10) * Math.ceil(height / 5) * 16 * depth;
            case GFXFormat.ASTC_RGBA_10x6:
            case GFXFormat.ASTC_SRGBA_10x6:
                return Math.ceil(width / 10) * Math.ceil(height / 6) * 16 * depth;
            case GFXFormat.ASTC_RGBA_10x8:
            case GFXFormat.ASTC_SRGBA_10x8:
                return Math.ceil(width / 10) * Math.ceil(height / 8) * 16 * depth;
            case GFXFormat.ASTC_RGBA_10x10:
            case GFXFormat.ASTC_SRGBA_10x10:
                return Math.ceil(width / 10) * Math.ceil(height / 10) * 16 * depth;
            case GFXFormat.ASTC_RGBA_12x10:
            case GFXFormat.ASTC_SRGBA_12x10:
                return Math.ceil(width / 12) * Math.ceil(height / 10) * 16 * depth;
            case GFXFormat.ASTC_RGBA_12x12:
            case GFXFormat.ASTC_SRGBA_12x12:
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
export function GFXFormatSurfaceSize (
    format: GFXFormat, width: number, height: number,
    depth: number, mips: number): number {

    let size = 0;

    for (let i = 0; i < mips; ++i) {
        size += GFXFormatSize(format, width, height, depth);
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
export function GFXGetTypeSize (type: GFXType): number {
    return _type2size[type] || 0;
}

export function getTypedArrayConstructor (info: GFXFormatInfo): TypedArrayConstructor {
    const stride = info.size / info.count;
    switch (info.type) {
        case GFXFormatType.UNORM:
        case GFXFormatType.UINT: {
            switch (stride) {
                case 1: return Uint8Array;
                case 2: return Uint16Array;
                case 4: return Uint32Array;
            }
            break;
        }
        case GFXFormatType.SNORM:
        case GFXFormatType.INT: {
            switch (stride) {
                case 1: return Int8Array;
                case 2: return Int16Array;
                case 4: return Int32Array;
            }
            break;
        }
        case GFXFormatType.FLOAT: {
            return Float32Array;
        }
    }
    return Float32Array;
}
