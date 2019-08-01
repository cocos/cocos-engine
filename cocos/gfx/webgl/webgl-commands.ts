import { CachedArray } from '../../core/memop/cached-array';
import { GFXBufferSource, IGFXDrawInfo, IGFXIndirectBuffer } from '../buffer';
import {
    GFXBindingType,
    GFXBufferTextureCopy,
    GFXBufferUsageBit,
    GFXClearFlag,
    GFXColorMask,
    GFXCullMode,
    GFXDynamicState,
    GFXFormat,
    GFXFormatInfos,
    GFXFormatSize,
    GFXFormatType,
    GFXLoadOp,
    GFXMemoryUsageBit,
    GFXSampleCount,
    GFXShaderType,
    GFXStencilFace,
    GFXTextureFlagBit,
    GFXTextureLayout,
    GFXTextureViewType,
    GFXType,
    IGFXColor,
    IGFXFormatInfo,
    IGFXRect,
    IGFXViewport,
} from '../define';
import { WebGLGFXCommandAllocator } from './webgl-command-allocator';
import {
    IWebGLDepthBias,
    IWebGLDepthBounds,
    IWebGLStencilCompareMask,
    IWebGLStencilWriteMask,
} from './webgl-command-buffer';
import { WebGLEXT } from './webgl-define';
import { WebGLGFXDevice } from './webgl-device';
import { IWebGLGPUInputAssembler, IWebGLGPUUniform, WebGLAttrib, WebGLGPUBindingLayout,
    WebGLGPUBuffer, WebGLGPUFramebuffer, WebGLGPUInput,
    WebGLGPUPipelineState, WebGLGPUShader, WebGLGPUTexture, WebGLGPUUniformBlock, WebGLGPUUniformSampler } from './webgl-gpu-objects';
import { IWebGLTexUnit } from './webgl-state-cache';

function CmpF32NotEuqal (a: number, b: number): boolean {
    const c = a - b;
    return (c > 0.000001 || c < -0.000001);
}

function GFXFormatToWebGLType (format: GFXFormat, gl: WebGLRenderingContext): GLenum {
    switch (format) {
        case GFXFormat.R8: return gl.UNSIGNED_BYTE;
        case GFXFormat.R8SN: return gl.BYTE;
        case GFXFormat.R8UI: return gl.UNSIGNED_BYTE;
        case GFXFormat.R8I: return gl.BYTE;
        case GFXFormat.R16F: return WebGLEXT.HALF_FLOAT_OES;
        case GFXFormat.R16UI: return gl.UNSIGNED_SHORT;
        case GFXFormat.R16I: return gl.SHORT;
        case GFXFormat.R32F: return gl.FLOAT;
        case GFXFormat.R32UI: return gl.UNSIGNED_INT;
        case GFXFormat.R32I: return gl.INT;

        case GFXFormat.RG8: return gl.UNSIGNED_BYTE;
        case GFXFormat.RG8SN: return gl.BYTE;
        case GFXFormat.RG8UI: return gl.UNSIGNED_BYTE;
        case GFXFormat.RG8I: return gl.BYTE;
        case GFXFormat.RG16F: return WebGLEXT.HALF_FLOAT_OES;
        case GFXFormat.RG16UI: return gl.UNSIGNED_SHORT;
        case GFXFormat.RG16I: return gl.SHORT;
        case GFXFormat.RG32F: return gl.FLOAT;
        case GFXFormat.RG32UI: return gl.UNSIGNED_INT;
        case GFXFormat.RG32I: return gl.INT;

        case GFXFormat.RGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.SRGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.RGB8SN: return gl.BYTE;
        case GFXFormat.RGB8UI: return gl.UNSIGNED_BYTE;
        case GFXFormat.RGB8I: return gl.BYTE;
        case GFXFormat.RGB16F: return WebGLEXT.HALF_FLOAT_OES;
        case GFXFormat.RGB16UI: return gl.UNSIGNED_SHORT;
        case GFXFormat.RGB16I: return gl.SHORT;
        case GFXFormat.RGB32F: return gl.FLOAT;
        case GFXFormat.RGB32UI: return gl.UNSIGNED_INT;
        case GFXFormat.RGB32I: return gl.INT;

        case GFXFormat.RGBA8: return gl.UNSIGNED_BYTE;
        case GFXFormat.SRGB8_A8: return gl.UNSIGNED_BYTE;
        case GFXFormat.RGBA8SN: return gl.BYTE;
        case GFXFormat.RGBA8UI: return gl.UNSIGNED_BYTE;
        case GFXFormat.RGBA8I: return gl.BYTE;
        case GFXFormat.RGBA16F: return WebGLEXT.HALF_FLOAT_OES;
        case GFXFormat.RGBA16UI: return gl.UNSIGNED_SHORT;
        case GFXFormat.RGBA16I: return gl.SHORT;
        case GFXFormat.RGBA32F: return gl.FLOAT;
        case GFXFormat.RGBA32UI: return gl.UNSIGNED_INT;
        case GFXFormat.RGBA32I: return gl.INT;

        case GFXFormat.R5G6B5: return gl.UNSIGNED_SHORT_5_6_5;
        case GFXFormat.R11G11B10F: return gl.FLOAT;
        case GFXFormat.RGB5A1: return gl.UNSIGNED_SHORT_5_5_5_1;
        case GFXFormat.RGBA4: return gl.UNSIGNED_SHORT_4_4_4_4;
        case GFXFormat.RGB10A2: return gl.UNSIGNED_BYTE;
        case GFXFormat.RGB10A2UI: return gl.UNSIGNED_INT;
        case GFXFormat.RGB9E5: return gl.UNSIGNED_BYTE;

        case GFXFormat.D16: return gl.UNSIGNED_SHORT;
        case GFXFormat.D16S8: return gl.UNSIGNED_SHORT;
        case GFXFormat.D24: return gl.UNSIGNED_INT;
        case GFXFormat.D24S8: return WebGLEXT.UNSIGNED_INT_24_8_WEBGL;
        case GFXFormat.D32F: return gl.FLOAT;
        case GFXFormat.D32F_S8: return gl.FLOAT;

        case GFXFormat.BC1: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC1_SRGB: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC2: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC2_SRGB: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC3: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC3_SRGB: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC4: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC4_SNORM: return gl.BYTE;
        case GFXFormat.BC5: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC5_SNORM: return gl.BYTE;
        case GFXFormat.BC6H_SF16: return gl.FLOAT;
        case GFXFormat.BC6H_UF16: return gl.FLOAT;
        case GFXFormat.BC7: return gl.UNSIGNED_BYTE;
        case GFXFormat.BC7_SRGB: return gl.UNSIGNED_BYTE;

        case GFXFormat.ETC_RGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8_A1: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8_A1: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return gl.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11: return gl.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11SN: return gl.BYTE;
        case GFXFormat.EAC_RG11: return gl.UNSIGNED_BYTE;
        case GFXFormat.EAC_RG11SN: return gl.BYTE;

        case GFXFormat.PVRTC_RGB2: return gl.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA2: return gl.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGB4: return gl.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA4: return gl.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_2BPP: return gl.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_4BPP: return gl.UNSIGNED_BYTE;

        default: {
            return gl.UNSIGNED_BYTE;
        }
    }
}

// tslint:disable: max-line-length
function GFXFormatToWebGLInternalFormat (format: GFXFormat, gl: WebGLRenderingContext): GLenum {
    switch (format) {
        case GFXFormat.A8: return gl.ALPHA;
        case GFXFormat.L8: return gl.LUMINANCE;
        case GFXFormat.LA8: return gl.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return gl.RGB;
        case GFXFormat.RGB16F: return gl.RGB;
        case GFXFormat.RGB32F: return gl.RGB;
        case GFXFormat.RGBA8: return gl.RGBA;
        case GFXFormat.RGBA16F: return gl.RGBA;
        case GFXFormat.RGBA32F: return gl.RGBA;
        case GFXFormat.R5G6B5: return gl.RGB565;
        case GFXFormat.RGB5A1: return gl.RGB5_A1;
        case GFXFormat.RGBA4: return gl.RGBA4;
        case GFXFormat.D16: return gl.DEPTH_COMPONENT;
        case GFXFormat.D16S8: return gl.DEPTH_STENCIL;
        case GFXFormat.D24: return gl.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return gl.DEPTH_STENCIL;
        case GFXFormat.D32F: return gl.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return gl.DEPTH_STENCIL;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error('Unsupported GFXFormat, convert to WebGL internal format failed.');
            return gl.RGBA;
        }
    }
}
// tslint:enable: max-line-length

function GFXFormatToWebGLFormat (format: GFXFormat, gl: WebGLRenderingContext): GLenum {
    switch (format) {
        case GFXFormat.A8: return gl.ALPHA;
        case GFXFormat.L8: return gl.LUMINANCE;
        case GFXFormat.LA8: return gl.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return gl.RGB;
        case GFXFormat.RGB16F: return gl.RGB;
        case GFXFormat.RGB32F: return gl.RGB;
        case GFXFormat.RGBA8: return gl.RGBA;
        case GFXFormat.RGBA16F: return gl.RGBA;
        case GFXFormat.RGBA32F: return gl.RGBA;
        case GFXFormat.R5G6B5: return gl.RGB;
        case GFXFormat.RGB5A1: return gl.RGBA;
        case GFXFormat.RGBA4: return gl.RGBA;
        case GFXFormat.D16: return gl.DEPTH_COMPONENT;
        case GFXFormat.D16S8: return gl.DEPTH_STENCIL;
        case GFXFormat.D24: return gl.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return gl.DEPTH_STENCIL;
        case GFXFormat.D32F: return gl.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return gl.DEPTH_STENCIL;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;
        case GFXFormat.ETC2_RGB8: return WebGLEXT.COMPRESSED_RGB8_ETC2;
        case GFXFormat.ETC2_SRGB8: return WebGLEXT.COMPRESSED_SRGB8_ETC2;
        case GFXFormat.ETC2_RGB8_A1: return WebGLEXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
        case GFXFormat.ETC2_SRGB8_A1: return WebGLEXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
        case GFXFormat.ETC2_RGBA8: return WebGLEXT.COMPRESSED_RGBA8_ETC2_EAC;
        case GFXFormat.ETC2_SRGB8_A8: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
        case GFXFormat.EAC_R11: return WebGLEXT.COMPRESSED_R11_EAC;
        case GFXFormat.EAC_R11SN: return WebGLEXT.COMPRESSED_SIGNED_R11_EAC;
        case GFXFormat.EAC_RG11: return WebGLEXT.COMPRESSED_RG11_EAC;
        case GFXFormat.EAC_RG11SN: return WebGLEXT.COMPRESSED_SIGNED_RG11_EAC;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error('Unsupported GFXFormat, convert to WebGL format failed.');
            return gl.RGBA;
        }
    }
}

function GFXTypeToWebGLType (type: GFXType, gl: WebGLRenderingContext): GLenum {
    switch (type) {
        case GFXType.BOOL: return gl.BOOL;
        case GFXType.BOOL2: return gl.BOOL_VEC2;
        case GFXType.BOOL3: return gl.BOOL_VEC3;
        case GFXType.BOOL4: return gl.BOOL_VEC4;
        case GFXType.INT: return gl.INT;
        case GFXType.INT2: return gl.INT_VEC2;
        case GFXType.INT3: return gl.INT_VEC3;
        case GFXType.INT4: return gl.INT_VEC4;
        case GFXType.UINT: return gl.UNSIGNED_INT;
        case GFXType.FLOAT: return gl.FLOAT;
        case GFXType.FLOAT2: return gl.FLOAT_VEC2;
        case GFXType.FLOAT3: return gl.FLOAT_VEC3;
        case GFXType.FLOAT4: return gl.FLOAT_VEC4;
        case GFXType.MAT2: return gl.FLOAT_MAT2;
        case GFXType.MAT3: return gl.FLOAT_MAT3;
        case GFXType.MAT4: return gl.FLOAT_MAT4;
        case GFXType.SAMPLER2D: return gl.SAMPLER_2D;
        case GFXType.SAMPLER_CUBE: return gl.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GL type failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLTypeToGFXType (glType: GLenum, gl: WebGLRenderingContext): GFXType {
    switch (glType) {
        case gl.BOOL: return GFXType.BOOL;
        case gl.BOOL_VEC2: return GFXType.BOOL2;
        case gl.BOOL_VEC3: return GFXType.BOOL3;
        case gl.BOOL_VEC4: return GFXType.BOOL4;
        case gl.INT: return GFXType.INT;
        case gl.INT_VEC2: return GFXType.INT2;
        case gl.INT_VEC3: return GFXType.INT3;
        case gl.INT_VEC4: return GFXType.INT4;
        case gl.UNSIGNED_INT: return GFXType.UINT;
        case gl.FLOAT: return GFXType.FLOAT;
        case gl.FLOAT_VEC2: return GFXType.FLOAT2;
        case gl.FLOAT_VEC3: return GFXType.FLOAT3;
        case gl.FLOAT_VEC4: return GFXType.FLOAT4;
        case gl.FLOAT_MAT2: return GFXType.MAT2;
        case gl.FLOAT_MAT3: return GFXType.MAT3;
        case gl.FLOAT_MAT4: return GFXType.MAT4;
        case gl.SAMPLER_2D: return GFXType.SAMPLER2D;
        case gl.SAMPLER_CUBE: return GFXType.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GFXType failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLGetTypeSize (glType: GLenum, gl: WebGLRenderingContext): GFXType {
    switch (glType) {
        case gl.BOOL: return 4;
        case gl.BOOL_VEC2: return 8;
        case gl.BOOL_VEC3: return 12;
        case gl.BOOL_VEC4: return 16;
        case gl.INT: return 4;
        case gl.INT_VEC2: return 8;
        case gl.INT_VEC3: return 12;
        case gl.INT_VEC4: return 16;
        case gl.UNSIGNED_INT: return 4;
        case gl.FLOAT: return 4;
        case gl.FLOAT_VEC2: return 8;
        case gl.FLOAT_VEC3: return 12;
        case gl.FLOAT_VEC4: return 16;
        case gl.FLOAT_MAT2: return 16;
        case gl.FLOAT_MAT3: return 36;
        case gl.FLOAT_MAT4: return 64;
        case gl.SAMPLER_2D: return 4;
        case gl.SAMPLER_CUBE: return 4;
        default: {
            console.error('Unsupported GLType, get type failed.');
            return 0;
        }
    }
}

function WebGLGetComponentCount (glType: GLenum, gl: WebGLRenderingContext): GFXType {
    switch (glType) {
        case gl.FLOAT_MAT2: return 2;
        case gl.FLOAT_MAT3: return 3;
        case gl.FLOAT_MAT4: return 4;
        default: {
            return 1;
        }
    }
}

const WebGLCmpFuncs: GLenum[] = [
    0x0200, // WebGLRenderingContext.NEVER,
    0x0201, // WebGLRenderingContext.LESS,
    0x0202, // WebGLRenderingContext.EQUAL,
    0x0203, // WebGLRenderingContext.LEQUAL,
    0x0204, // WebGLRenderingContext.GREATER,
    0x0205, // WebGLRenderingContext.NOTEQUAL,
    0x0206, // WebGLRenderingContext.GEQUAL,
    0x0207, // WebGLRenderingContext.ALWAYS,
];

const WebGLStencilOps: GLenum[] = [
    0x0000, // WebGLRenderingContext.ZERO,
    0x1E00, // WebGLRenderingContext.KEEP,
    0x1E01, // WebGLRenderingContext.REPLACE,
    0x1E02, // WebGLRenderingContext.INCR,
    0x1E03, // WebGLRenderingContext.DECR,
    0x150A, // WebGLRenderingContext.INVERT,
    0x8507, // WebGLRenderingContext.INCR_WRAP,
    0x8508, // WebGLRenderingContext.DECR_WRAP,
];

const WebGLBlendOps: GLenum[] = [
    0x8006, // WebGLRenderingContext.FUNC_ADD,
    0x800A, // WebGLRenderingContext.FUNC_SUBTRACT,
    0x800B, // WebGLRenderingContext.FUNC_REVERSE_SUBTRACT,
    0x8006, // WebGLRenderingContext.FUNC_ADD,
    0x8006, // WebGLRenderingContext.FUNC_ADD,
];

const WebGLBlendFactors: GLenum[] = [
    0x0000, // WebGLRenderingContext.ZERO,
    0x0001, // WebGLRenderingContext.ONE,
    0x0302, // WebGLRenderingContext.SRC_ALPHA,
    0x0304, // WebGLRenderingContext.DST_ALPHA,
    0x0303, // WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
    0x0305, // WebGLRenderingContext.ONE_MINUS_DST_ALPHA,
    0x0300, // WebGLRenderingContext.SRC_COLOR,
    0x0306, // WebGLRenderingContext.DST_COLOR,
    0x0301, // WebGLRenderingContext.ONE_MINUS_SRC_COLOR,
    0x0307, // WebGLRenderingContext.ONE_MINUS_DST_COLOR,
    0x0308, // WebGLRenderingContext.SRC_ALPHA_SATURATE,
    0x8001, // WebGLRenderingContext.CONSTANT_COLOR,
    0x8002, // WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR,
    0x8003, // WebGLRenderingContext.CONSTANT_ALPHA,
    0x8004, // WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA,
];

export enum WebGLCmd {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_STATES,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    COUNT,
}

export abstract class WebGLCmdObject {
    public cmdType: WebGLCmd;
    public refCount: number = 0;

    constructor (type: WebGLCmd) {
        this.cmdType = type;
    }

    public abstract clear ();
}

export class WebGLCmdBeginRenderPass extends WebGLCmdObject {

    public gpuFramebuffer: WebGLGPUFramebuffer | null = null;
    public renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    public clearFlag: GFXClearFlag = GFXClearFlag.NONE;
    public clearColors: IGFXColor[] = [];
    public clearDepth: number = 1.0;
    public clearStencil: number = 0;

    constructor () {
        super(WebGLCmd.BEGIN_RENDER_PASS);
    }

    public clear () {
        this.gpuFramebuffer = null;
        this.clearColors = [];
    }
}

export class WebGLCmdBindStates extends WebGLCmdObject {

    public gpuPipelineState: WebGLGPUPipelineState | null = null;
    public gpuBindingLayout: WebGLGPUBindingLayout | null = null;
    public gpuInputAssembler: IWebGLGPUInputAssembler | null = null;
    public viewport: IGFXViewport | null = null;
    public scissor: IGFXRect | null = null;
    public lineWidth: number | null = null;
    public depthBias: IWebGLDepthBias | null = null;
    public blendConstants: number[] | null = null;
    public depthBounds: IWebGLDepthBounds | null = null;
    public stencilWriteMask: IWebGLStencilWriteMask | null = null;
    public stencilCompareMask: IWebGLStencilCompareMask | null = null;

    constructor () {
        super(WebGLCmd.BIND_STATES);
    }

    public clear () {
        this.gpuPipelineState = null;
        this.gpuBindingLayout = null;
        this.gpuInputAssembler = null;
        this.viewport = null;
        this.scissor = null;
        this.lineWidth = null;
        this.depthBias = null;
        this.blendConstants = null;
        this.depthBounds = null;
        this.stencilWriteMask = null;
        this.stencilCompareMask = null;
    }
}

export class WebGLCmdDraw extends WebGLCmdObject {

    public drawInfo: IGFXDrawInfo = {
        vertexCount: 0,
        firstVertex: 0,
        indexCount: 0,
        firstIndex: 0,
        vertexOffset: 0,
        instanceCount: 0,
        firstInstance: 0,
    };

    constructor () {
        super(WebGLCmd.DRAW);
    }

    public clear () {
    }
}

export class WebGLCmdUpdateBuffer extends WebGLCmdObject {

    public gpuBuffer: WebGLGPUBuffer | null = null;
    public buffer: GFXBufferSource | null = null;
    public offset: number = 0;
    public size: number = 0;

    constructor () {
        super(WebGLCmd.UPDATE_BUFFER);
    }

    public clear () {
        this.gpuBuffer = null;
        this.buffer = null;
    }
}

export class WebGLGFXTextureSubres {
    public baseMipLevel: number = 0;
    public levelCount: number = 1;
    public baseArrayLayer: number = 0;
    public layerCount: number = 1;
}

export class WebGLGFXBufferTextureCopy {
    public buffOffset: number = 0;
    public buffStride: number = 0;
    public buffTexHeight: number = 0;
    public texOffset: number[] = [0, 0, 0];
    public texExtent: number[] = [0, 0, 0];
    public texSubres: WebGLGFXTextureSubres = new WebGLGFXTextureSubres();
}

export class WebGLCmdCopyBufferToTexture extends WebGLCmdObject {

    public gpuBuffer: WebGLGPUBuffer | null = null;
    public gpuTexture: WebGLGPUTexture | null = null;
    public dstLayout: GFXTextureLayout | null = null;
    public regions: GFXBufferTextureCopy[] = [];

    constructor () {
        super(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
    }

    public clear () {
        this.gpuBuffer = null;
        this.gpuTexture = null;
        this.dstLayout = null;
        this.regions = [];
    }
}

export class WebGLCmdPackage {
    public cmds: CachedArray<WebGLCmd> = new CachedArray(1);
    public beginRenderPassCmds: CachedArray<WebGLCmdBeginRenderPass> = new CachedArray(1);
    public bindStatesCmds: CachedArray<WebGLCmdBindStates> = new CachedArray(1);
    public drawCmds: CachedArray<WebGLCmdDraw> = new CachedArray(1);
    public updateBufferCmds: CachedArray<WebGLCmdUpdateBuffer> = new CachedArray(1);
    public copyBufferToTextureCmds: CachedArray<WebGLCmdCopyBufferToTexture> = new CachedArray(1);

    public clearCmds (allocator: WebGLGFXCommandAllocator) {

        if (this.beginRenderPassCmds.length) {
            allocator.beginRenderPassCmdPool.freeCmds(this.beginRenderPassCmds);
            this.beginRenderPassCmds.clear();
        }

        if (this.bindStatesCmds.length) {
            allocator.bindStatesCmdPool.freeCmds(this.bindStatesCmds);
            this.bindStatesCmds.clear();
        }

        if (this.drawCmds.length) {
            allocator.drawCmdPool.freeCmds(this.drawCmds);
            this.drawCmds.clear();
        }

        if (this.updateBufferCmds.length) {
            allocator.updateBufferCmdPool.freeCmds(this.updateBufferCmds);
            this.updateBufferCmds.clear();
        }

        if (this.copyBufferToTextureCmds.length) {
            allocator.copyBufferToTextureCmdPool.freeCmds(this.copyBufferToTextureCmds);
            this.copyBufferToTextureCmds.clear();
        }

        this.cmds.clear();
    }
}

export function WebGLCmdFuncCreateBuffer (device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer) {

    const gl = device.gl;
    const cache = device.stateCache;
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {

        gpuBuffer.glTarget = gl.ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                device.stateCache.glArrayBuffer = null;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {

        gpuBuffer.glTarget = gl.ELEMENT_ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();

        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                device.stateCache.glElementArrayBuffer = null;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        // console.error("WebGL 1.0 doesn't support uniform buffer.");
        gpuBuffer.glTarget = gl.NONE;

        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer as ArrayBuffer);
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = gl.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = gl.NONE;
    }
}

export function WebGLCmdFuncDestroyBuffer (device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer) {
    if (gpuBuffer.glBuffer) {
        device.gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = null;
    }
}

export function WebGLCmdFuncResizeBuffer (device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer) {

    const gl = device.gl;
    const cache = device.stateCache;
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {
        if (device.useVAO) {
            if (cache.glVAO) {
                device.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }

        if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        device.stateCache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {
        if (device.useVAO) {
            if (cache.glVAO) {
                device.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }

        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        device.stateCache.glElementArrayBuffer = null;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        // console.error("WebGL 1.0 doesn't support uniform buffer.");
        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer as ArrayBuffer);
        }
    } else if ((gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC)) {
        gpuBuffer.glTarget = gl.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = gl.NONE;
    }
}

export function WebGLCmdFuncUpdateBuffer (device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer, buffer: GFXBufferSource, offset: number, size: number) {

    if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        if (buffer instanceof Float32Array) {
            gpuBuffer.vf32!.set(buffer, offset / Float32Array.BYTES_PER_ELEMENT);
        } else {
            gpuBuffer.vf32!.set(new Float32Array(buffer as ArrayBuffer), offset / Float32Array.BYTES_PER_ELEMENT);
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.indirects = (buffer as IGFXIndirectBuffer).drawInfos;
    } else {
        const buff = buffer as ArrayBuffer;
        const gl = device.gl;
        const cache = device.stateCache;

        switch (gpuBuffer.glTarget) {
            case gl.ARRAY_BUFFER: {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }
                break;
            }
            case gl.ELEMENT_ARRAY_BUFFER: {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }
                break;
            }
            default: {
                console.error('Unsupported GFXBufferType, update buffer failed.');
                return;
            }
        }

        if (size === buff.byteLength) {
            gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
        } else {
            gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
        }
    }
}

export function WebGLCmdFuncCreateTexture (device: WebGLGFXDevice, gpuTexture: WebGLGPUTexture) {

    const gl = device.gl;

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format, gl);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, gl);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D: {

            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = gl.TEXTURE_2D;

            if (gpuTexture.samples === GFXSampleCount.X1) {
                const glTexture = gl.createTexture();
                if (glTexture && gpuTexture.size > 0) {
                    gpuTexture.glTexture = glTexture;
                    const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];

                    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                        gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                        glTexUnit.glTexture = gpuTexture.glTexture;
                    }

                    let w = gpuTexture.width;
                    let h = gpuTexture.height;

                    if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    } else {
                        if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                            for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                                const imgSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                                const view: Uint8Array = new Uint8Array(imgSize);
                                gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                                w = Math.max(1, w >> 1);
                                h = Math.max(1, h >> 1);
                            }
                        }
                        else {
                            // init 2 x 2 texture
                            const imgSize = GFXFormatSize(gpuTexture.format, 2, 2, 1);
                            const view: Uint8Array = new Uint8Array(imgSize);
                            gl.compressedTexImage2D(gl.TEXTURE_2D, 0, gpuTexture.glInternelFmt, 2, 2, 0, view);
                        }
                    }

                    if (gpuTexture.isPowerOf2) {
                        gpuTexture.glWrapS = gl.REPEAT;
                        gpuTexture.glWrapT = gl.REPEAT;
                    } else {
                        gpuTexture.glWrapS = gl.CLAMP_TO_EDGE;
                        gpuTexture.glWrapT = gl.CLAMP_TO_EDGE;
                    }
                    gpuTexture.glMinFilter = gl.LINEAR;
                    gpuTexture.glMagFilter = gl.LINEAR;

                    gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, gpuTexture.glWrapS);
                    gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, gpuTexture.glWrapT);
                    gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
                    gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
                }
            }

            break;
        }
        case GFXTextureViewType.CUBE: {

            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

            const glTexture = gl.createTexture();
            if (glTexture && gpuTexture.size > 0) {
                gpuTexture.glTexture = glTexture;
                const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0,
                                gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                } else {
                    if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                        for (let f = 0; f < 6; ++f) {
                            let w = gpuTexture.width;
                            let h = gpuTexture.height;
                            for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                                const imgSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                                const view: Uint8Array = new Uint8Array(imgSize);
                                gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                                w = Math.max(1, w >> 1);
                                h = Math.max(1, h >> 1);
                            }
                        }
                    }
                    else {
                        for (let f = 0; f < 6; ++f) {
                            const imgSize = GFXFormatSize(gpuTexture.format, 2, 2, 1);
                            const view: Uint8Array = new Uint8Array(imgSize);
                            gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, 0, gpuTexture.glInternelFmt, 2, 2, 0, view);
                        }
                    }
                }

                if (gpuTexture.isPowerOf2) {
                    gpuTexture.glWrapS = gl.REPEAT;
                    gpuTexture.glWrapT = gl.REPEAT;
                } else {
                    gpuTexture.glWrapS = gl.CLAMP_TO_EDGE;
                    gpuTexture.glWrapT = gl.CLAMP_TO_EDGE;
                }
                gpuTexture.glMinFilter = gl.LINEAR;
                gpuTexture.glMagFilter = gl.LINEAR;

                gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, gpuTexture.glWrapS);
                gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, gpuTexture.glWrapT);
                gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
                gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
            }

            break;
        }
        default: {
            console.error('Unsupported GFXTextureType, create texture failed.');
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = gl.TEXTURE_2D;
        }
    }
}

export function WebGLCmdFuncDestroyTexture (device: WebGLGFXDevice, gpuTexture: WebGLGPUTexture) {
    if (gpuTexture.glTexture) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = null;
    }

    if (gpuTexture.glRenderbuffer) {
        device.gl.deleteRenderbuffer(gpuTexture.glRenderbuffer);
        gpuTexture.glRenderbuffer = null;
    }
}

export function WebGLCmdFuncResizeTexture (device: WebGLGFXDevice, gpuTexture: WebGLGPUTexture) {

    const gl = device.gl;

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format, gl);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, gl);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D: {
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = gl.TEXTURE_2D;

            if (gpuTexture.samples === GFXSampleCount.X1) {
                const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                let w = gpuTexture.width;
                let h = gpuTexture.height;

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            const imgSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            const view: Uint8Array = new Uint8Array(imgSize);
                            gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                }
            }
            break;
        }
        case GFXTextureViewType.CUBE: {
            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                for (let f = 0; f < 6; ++f) {
                    let w = gpuTexture.width;
                    let h = gpuTexture.height;
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                }
            } else {
                if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            const imgSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            const view: Uint8Array = new Uint8Array(imgSize);
                            gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                }
            }
            break;
        }
        default: {
            console.error('Unsupported GFXTextureType, create texture failed.');
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = gl.TEXTURE_2D;
        }
    }
}

export function WebGLCmdFuncCreateFramebuffer (device: WebGLGFXDevice, gpuFramebuffer: WebGLGPUFramebuffer) {

    if (gpuFramebuffer.isOffscreen) {

        const gl = device.gl;
        const attachments: GLenum[] = [];

        const glFramebuffer = gl.createFramebuffer();
        if (glFramebuffer) {
            gpuFramebuffer.glFramebuffer = glFramebuffer;

            if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
                device.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
            }

            for (let i = 0; i < gpuFramebuffer.gpuColorViews.length; ++i) {

                const cv = gpuFramebuffer.gpuColorViews[i];
                if (cv) {
                    if (cv.gpuTexture.glTexture) {
                        gl.framebufferTexture2D(
                            gl.FRAMEBUFFER,
                            gl.COLOR_ATTACHMENT0 + i,
                            cv.gpuTexture.glTarget,
                            cv.gpuTexture.glTexture,
                            cv.baseLevel);
                    } else {
                        gl.framebufferRenderbuffer(
                            gl.FRAMEBUFFER,
                            gl.COLOR_ATTACHMENT0 + i,
                            gl.RENDERBUFFER,
                            cv.gpuTexture.glRenderbuffer,
                        );
                    }

                    attachments.push(gl.COLOR_ATTACHMENT0 + i);
                }
            }

            const dsv = gpuFramebuffer.gpuDepthStencilView;
            if (dsv) {
                const glAttachment = GFXFormatInfos[dsv.format].hasStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
                if (dsv.gpuTexture.glTexture) {
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        glAttachment,
                        dsv.gpuTexture.glTarget,
                        dsv.gpuTexture.glTexture,
                        dsv.baseLevel);
                } else {
                    gl.framebufferRenderbuffer(
                        gl.FRAMEBUFFER,
                        glAttachment,
                        gl.RENDERBUFFER,
                        dsv.gpuTexture.glRenderbuffer,
                    );
                }
            }

            if (device.WEBGL_draw_buffers) {
                device.WEBGL_draw_buffers.drawBuffersWEBGL(attachments);
            }

            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                switch (status) {
                    case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
                        break;
                    }
                    case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
                        break;
                    }
                    case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
                        break;
                    }
                    case gl.FRAMEBUFFER_UNSUPPORTED: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED');
                        break;
                    }
                    default:
                }
            }
        }
    }
}

export function WebGLCmdFuncDestroyFramebuffer (device: WebGLGFXDevice, gpuFramebuffer: WebGLGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = null;
    }
}

export function WebGLCmdFuncCreateShader (device: WebGLGFXDevice, gpuShader: WebGLGPUShader) {
    const gl = device.gl;

    for (const gpuStage of gpuShader.gpuStages) {

        let glShaderType: GLenum = 0;
        let shaderTypeStr = '';
        let lineNumber = 1;

        switch (gpuStage.type) {
            case GFXShaderType.VERTEX: {
                shaderTypeStr = 'VertexShader';
                glShaderType = gl.VERTEX_SHADER;
                break;
            }
            case GFXShaderType.FRAGMENT: {
                shaderTypeStr = 'FragmentShader';
                glShaderType = gl.FRAGMENT_SHADER;
                break;
            }
            default: {
                console.error('Unsupported GFXShaderType.');
                return;
            }
        }

        const glShader = gl.createShader(glShaderType);
        if (glShader) {
            gpuStage.glShader = glShader;
            gl.shaderSource(gpuStage.glShader, gpuStage.source);
            gl.compileShader(gpuStage.glShader);

            if (!gl.getShaderParameter(gpuStage.glShader, gl.COMPILE_STATUS)) {
                console.error(shaderTypeStr + ' in \'' + gpuShader.name + '\' compilation failed.');
                console.error('Shader source dump:', gpuStage.source.replace(/^|\n/g, () => `\n${lineNumber++} `));
                console.error(gl.getShaderInfoLog(gpuStage.glShader));

                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = null;
                return;
            }
        }
    }

    const glProgram = gl.createProgram();
    if (!glProgram) {
        return;
    }

    gpuShader.glProgram = glProgram;

    // link program
    for (const gpuStage of gpuShader.gpuStages) {
        gl.attachShader(gpuShader.glProgram, gpuStage.glShader!);
    }

    gl.linkProgram(gpuShader.glProgram);
    if (gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS)) {
        console.info('Shader \'' + gpuShader.name + '\' compilation successed.');
    } else {
        console.error('Failed to link shader \'' + gpuShader.name + '\'.');
        console.error(gl.getProgramInfoLog(gpuShader.glProgram));

        for (const gpuStage of gpuShader.gpuStages) {
            if (gpuStage.glShader) {
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = null;
            }
        }
        return;
    }

    // parse inputs
    const activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array<WebGLGPUInput>(activeAttribCount);

    for (let i = 0; i < activeAttribCount; ++i) {
        const attribInfo = gl.getActiveAttrib(gpuShader.glProgram, i);
        if (attribInfo) {
            let varName: string;
            const nameOffset = attribInfo.name.indexOf('[');
            if (nameOffset !== -1) {
                varName = attribInfo.name.substr(0, nameOffset);
            } else {
                varName = attribInfo.name;
            }

            const glLoc = gl.getAttribLocation(gpuShader.glProgram, varName);
            const type = WebGLTypeToGFXType(attribInfo.type, gl);
            const stride = WebGLGetTypeSize(attribInfo.type, gl);

            gpuShader.glInputs[i] = {
                binding: glLoc,
                name: varName,
                type,
                stride,
                count: attribInfo.size,
                size: stride * attribInfo.size,

                glType: attribInfo.type,
                glLoc,
            };
        }
    }

    // create uniform blocks
    if (gpuShader.blocks.length > 0) {
        gpuShader.glBlocks = new Array<WebGLGPUUniformBlock>(gpuShader.blocks.length);
        for (let i = 0; i < gpuShader.blocks.length; ++i) {
            const block = gpuShader.blocks[i];

            const glBlock: WebGLGPUUniformBlock = {
                binding: block.binding,
                name: block.name,
                size: 0,
                glUniforms: new Array<IWebGLGPUUniform>(block.members.length),
                glActiveUniforms: [],
                isUniformPackage: true,
            };

            gpuShader.glBlocks[i] = glBlock;

            for (let u = 0; u < block.members.length; ++u) {
                const uniform = block.members[u];
                const glType = GFXTypeToWebGLType(uniform.type, gl);
                const stride = WebGLGetTypeSize(glType, gl);
                const size = stride * uniform.count;
                const begin = glBlock.size / 4;
                const count = size / 4;
                const array = new Array<number>(count);
                array.fill(0);

                glBlock.glUniforms[u] = {
                    binding: -1,
                    name: uniform.name,
                    type: uniform.type,
                    stride,
                    count: uniform.count,
                    size,
                    offset: glBlock.size,

                    glType,
                    glLoc: -1,
                    array,
                    begin,
                };

                glBlock.size += size;
            }

            /*
            glBlock.buffer = new ArrayBuffer(glBlock.size);

            for (const glUniform of glBlock.glUniforms) {
                switch (glUniform.glType) {
                    case gl.BOOL:
                    case gl.BOOL_VEC2:
                    case gl.BOOL_VEC3:
                    case gl.BOOL_VEC4:
                    case gl.INT:
                    case gl.INT_VEC2:
                    case gl.INT_VEC3:
                    case gl.INT_VEC4:
                    case gl.SAMPLER_2D:
                    case gl.SAMPLER_CUBE: {
                        glUniform.vi32 = new Int32Array(glBlock.buffer);
                        break;
                    }
                    default: {
                        glUniform.vf32 = new Float32Array(glBlock.buffer);
                    }
                }
            }
            */
        }
    }

    // create uniform samplers
    if (gpuShader.samplers.length > 0) {
        gpuShader.glSamplers = new Array<WebGLGPUUniformSampler>(gpuShader.samplers.length);

        for (let i = 0; i < gpuShader.samplers.length; ++i) {
            const sampler = gpuShader.samplers[i];
            gpuShader.glSamplers[i] = {
                binding: sampler.binding,
                name: sampler.name,
                type: sampler.type,
                units: [],
                glType: GFXTypeToWebGLType(sampler.type, gl),
                glLoc: -1,
            };
        }
    }

    // parse uniforms
    const activeUniformCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORMS);
    let unitIdx = 0;

    const glActiveSamplers: WebGLGPUUniformSampler[] = [];

    for (let i = 0; i < activeUniformCount; ++i) {
        const uniformInfo = gl.getActiveUniform(gpuShader.glProgram, i);
        if (uniformInfo) {
            const glLoc = gl.getUniformLocation(gpuShader.glProgram, uniformInfo.name);
            if (glLoc) {
                let varName: string;
                const nameOffset = uniformInfo.name.indexOf('[');
                if (nameOffset !== -1) {
                    varName = uniformInfo.name.substr(0, nameOffset);
                } else {
                    varName = uniformInfo.name;
                }

                const isSampler = (uniformInfo.type === gl.SAMPLER_2D) ||
                    (uniformInfo.type === gl.SAMPLER_CUBE);

                if (!isSampler) {
                    // let stride = WebGLGetTypeSize(info.type);

                    // build uniform block mapping
                    for (const glBlock of gpuShader.glBlocks) {

                        for (const glUniform of glBlock.glUniforms) {
                            if (glUniform.name === varName) {
                                // let varSize = stride * info.size;

                                glUniform.glLoc = glLoc;
                                glBlock.glActiveUniforms.push(glUniform);

                                break;
                            }
                        }
                    } // for
                } else {

                    for (const glSampler of gpuShader.glSamplers) {
                        if (glSampler.name === varName) {
                            // let varSize = stride * uniformInfo.size;

                            for (let t = 0; t < uniformInfo.size; ++t) {
                                glSampler.units.push(unitIdx + t);
                            }

                            glSampler.glLoc = glLoc;

                            unitIdx += uniformInfo.size;
                            glActiveSamplers.push(glSampler);

                            break;
                        }
                    } // for
                }
            }
        }
    } // for

    if (glActiveSamplers.length) {
        if (device.stateCache.glProgram !== gpuShader.glProgram) {
            gl.useProgram(gpuShader.glProgram);
            device.stateCache.glProgram = gpuShader.glProgram;
        }

        for (const glSampler of glActiveSamplers) {
            gl.uniform1iv(glSampler.glLoc, glSampler.units);
        }
    }
}

export function WebGLCmdFuncDestroyShader (device: WebGLGFXDevice, gpuShader: WebGLGPUShader) {

    for (const gpuStage of gpuShader.gpuStages) {
        if (gpuStage.glShader) {
            device.gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = null;
        }
    }

    if (gpuShader.glProgram) {
        device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = null;
    }
}

export function WebGLCmdFuncCreateInputAssember (device: WebGLGFXDevice, gpuInputAssembler: IWebGLGPUInputAssembler) {

    const gl = device.gl;

    gpuInputAssembler.glAttribs = new Array<WebGLAttrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;

        const gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];

        const glType = GFXFormatToWebGLType(attrib.format, gl);
        const size = GFXFormatInfos[attrib.format].size;

        gpuInputAssembler.glAttribs[i] = {
            name: attrib.name,
            glBuffer: gpuBuffer.glBuffer,
            glType,
            size,
            count: GFXFormatInfos[attrib.format].count,
            stride: gpuBuffer.stride,
            componentCount: WebGLGetComponentCount(glType, gl),
            isNormalized: (attrib.isNormalized !== undefined ? attrib.isNormalized : false),
            isInstanced: (attrib.isInstanced !== undefined ? attrib.isInstanced : false),
            offset: offsets[stream],
        };

        offsets[stream] += size;
    }
}

export function WebGLCmdFuncDestroyInputAssembler (device: WebGLGFXDevice, gpuInputAssembler: IWebGLGPUInputAssembler) {
    for (const vao of gpuInputAssembler.glVAOs) {
        device.OES_vertex_array_object!.deleteVertexArrayOES(vao[1]);
    }
    gpuInputAssembler.glVAOs.clear();
}

const cmdIds = new Array<number>(WebGLCmd.COUNT);
export function WebGLCmdFuncExecuteCmds (device: WebGLGFXDevice, cmdPackage: WebGLCmdPackage) {

    const gl = device.gl;
    const cache = device.stateCache;
    for (let i = 0; i < WebGLCmd.COUNT; ++i) {
        cmdIds[i] = 0;
    }

    let gpuPipelineState: WebGLGPUPipelineState | null = null;
    let gpuShader: WebGLGPUShader | null = null;
    let gpuInputAssembler: IWebGLGPUInputAssembler | null = null;
    let glPrimitive = gl.TRIANGLES;
    let glWrapS;
    let glWrapT;
    let glMinFilter;

    for (let i = 0; i < cmdPackage.cmds.length; ++i) {
        const cmd = cmdPackage.cmds.array[i];
        const cmdId = cmdIds[cmd]++;

        switch (cmd) {
            case WebGLCmd.BEGIN_RENDER_PASS: {
                const cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];

                let clears: GLbitfield = 0;

                if (cmd0.gpuFramebuffer) {
                    if (cache.glFramebuffer !== cmd0.gpuFramebuffer.glFramebuffer) {
                        gl.bindFramebuffer(gl.FRAMEBUFFER, cmd0.gpuFramebuffer.glFramebuffer);
                        cache.glFramebuffer = cmd0.gpuFramebuffer.glFramebuffer;
                    }

                    if (cache.viewport.left !== cmd0.renderArea.x ||
                        cache.viewport.top !== cmd0.renderArea.y ||
                        cache.viewport.width !== cmd0.renderArea.width ||
                        cache.viewport.height !== cmd0.renderArea.height) {

                        gl.viewport(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        cache.viewport.left = cmd0.renderArea.x;
                        cache.viewport.top = cmd0.renderArea.y;
                        cache.viewport.width = cmd0.renderArea.width;
                        cache.viewport.height = cmd0.renderArea.height;
                    }

                    if (cache.scissorRect.x !== cmd0.renderArea.x ||
                        cache.scissorRect.y !== cmd0.renderArea.y ||
                        cache.scissorRect.width !== cmd0.renderArea.width ||
                        cache.scissorRect.height !== cmd0.renderArea.height) {

                        gl.scissor(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        cache.scissorRect.x = cmd0.renderArea.x;
                        cache.scissorRect.y = cmd0.renderArea.y;
                        cache.scissorRect.width = cmd0.renderArea.width;
                        cache.scissorRect.height = cmd0.renderArea.height;
                    }

                    const curGPURenderPass = cmd0.gpuFramebuffer.gpuRenderPass;
                    // const invalidateAttachments: GLenum[] = [];
                    let clearCount = cmd0.clearColors.length;

                    if (!device.WEBGL_draw_buffers) {
                        clearCount = 1;
                    }

                    for (let j = 0; j < clearCount; ++j) {
                        const colorAttachment = curGPURenderPass.colorAttachments[j];

                        if (colorAttachment.format !== GFXFormat.UNKNOWN) {
                            switch (colorAttachment.loadOp) {
                                case GFXLoadOp.LOAD: break; // GL default behaviour
                                case GFXLoadOp.CLEAR: {
                                    if (cmd0.clearFlag & GFXClearFlag.COLOR) {
                                        if (cache.bs.targets[0].blendColorMask !== GFXColorMask.ALL) {
                                            gl.colorMask(true, true, true, true);
                                        }

                                        const clearColor = cmd0.clearColors[0];
                                        gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
                                        clears |= gl.COLOR_BUFFER_BIT;
                                    }
                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    // invalidateAttachments.push(gl.COLOR_ATTACHMENT0 + j);
                                    break;
                                }
                                default:
                            }
                        }
                    } // if (curGPURenderPass)

                    if (curGPURenderPass.depthStencilAttachment) {

                        if (curGPURenderPass.depthStencilAttachment.format !== GFXFormat.UNKNOWN) {
                            switch (curGPURenderPass.depthStencilAttachment.depthLoadOp) {
                                case GFXLoadOp.LOAD: break; // GL default behaviour
                                case GFXLoadOp.CLEAR: {
                                    if (cmd0.clearFlag & GFXClearFlag.DEPTH) {
                                        if (!cache.dss.depthWrite) {
                                            gl.depthMask(true);
                                        }

                                        gl.clearDepth(cmd0.clearDepth);

                                        clears |= gl.DEPTH_BUFFER_BIT;
                                    }
                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    // invalidateAttachments.push(gl.DEPTH_ATTACHMENT);
                                    break;
                                }
                                default:
                            }

                            if (GFXFormatInfos[curGPURenderPass.depthStencilAttachment.format].hasStencil) {
                                switch (curGPURenderPass.depthStencilAttachment.stencilLoadOp) {
                                    case GFXLoadOp.LOAD: break; // GL default behaviour
                                    case GFXLoadOp.CLEAR: {
                                        if (cmd0.clearFlag & GFXClearFlag.STENCIL) {
                                            if (!cache.dss.stencilWriteMaskFront) {
                                                gl.stencilMaskSeparate(gl.FRONT, 0xFFFFFFFF);
                                            }

                                            if (!cache.dss.stencilWriteMaskBack) {
                                                gl.stencilMaskSeparate(gl.BACK, 0xFFFFFFFF);
                                            }

                                            gl.clearStencil(cmd0.clearStencil);
                                            clears |= gl.STENCIL_BUFFER_BIT;
                                        }
                                        break;
                                    }
                                    case GFXLoadOp.DISCARD: {
                                        // invalidate the framebuffer
                                        // invalidateAttachments.push(gl.STENCIL_ATTACHMENT);
                                        break;
                                    }
                                    default:
                                }
                            }
                        }
                    } // if (curGPURenderPass.depthStencilAttachment)

                    /*
                    if (numInvalidAttach) {
                        gl.invalidateFramebuffer(gl.FRAMEBUFFER, numInvalidAttach, invalidateAttachments);
                    }
                    */

                    if (clears) {
                        gl.clear(clears);
                    }

                    // restore states
                    if (clears & gl.COLOR_BUFFER_BIT) {

                        const colorMask = cache.bs.targets[0].blendColorMask;
                        if (colorMask !== GFXColorMask.ALL) {
                            const r = (colorMask & GFXColorMask.R) !== GFXColorMask.NONE;
                            const g = (colorMask & GFXColorMask.G) !== GFXColorMask.NONE;
                            const b = (colorMask & GFXColorMask.B) !== GFXColorMask.NONE;
                            const a = (colorMask & GFXColorMask.A) !== GFXColorMask.NONE;
                            gl.colorMask(r, g, b, a);
                        }
                    }

                    if ((clears & gl.DEPTH_BUFFER_BIT) &&
                        !cache.dss.depthWrite) {
                        gl.depthMask(false);
                    }

                    if (clears & gl.STENCIL_BUFFER_BIT) {
                        if (!cache.dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(gl.FRONT, 0);
                        }

                        if (!cache.dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(gl.BACK, 0);
                        }
                    }
                } // if (curGPURenderPass)

                break;
            }
            /*
            case WebGLCmd.END_RENDER_PASS: {
                // WebGL 1.0 doesn't support store operation of attachments.
                // GFXStoreOp.Store is the default GL behaviour.
                break;
            }
            */
            case WebGLCmd.BIND_STATES: {

                const cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
                if (cmd2.gpuPipelineState) {
                    gpuPipelineState = cmd2.gpuPipelineState;
                    glPrimitive = cmd2.gpuPipelineState.glPrimitive;

                    if (cmd2.gpuPipelineState.gpuShader) {

                        const glProgram = cmd2.gpuPipelineState.gpuShader.glProgram;
                        if (cache.glProgram !== glProgram) {
                            gl.useProgram(glProgram);
                            cache.glProgram = glProgram;
                        }

                        gpuShader = cmd2.gpuPipelineState.gpuShader;
                    }

                    // rasterizer state
                    const rs = cmd2.gpuPipelineState.rs;
                    if (rs) {

                        if (cache.rs.cullMode !== rs.cullMode) {
                            switch (rs.cullMode) {
                                case GFXCullMode.NONE: {
                                    gl.disable(gl.CULL_FACE);
                                    break;
                                }
                                case GFXCullMode.FRONT: {
                                    gl.enable(gl.CULL_FACE);
                                    gl.cullFace(gl.FRONT);
                                    break;
                                }
                                case GFXCullMode.BACK: {
                                    gl.enable(gl.CULL_FACE);
                                    gl.cullFace(gl.BACK);
                                    break;
                                }
                                default:
                            }

                            cache.rs.cullMode = rs.cullMode;
                        }

                        if (cache.rs.isFrontFaceCCW !== rs.isFrontFaceCCW) {
                            gl.frontFace(rs.isFrontFaceCCW ? gl.CCW : gl.CW);
                            cache.rs.isFrontFaceCCW = rs.isFrontFaceCCW;
                        }

                        if ((cache.rs.depthBias !== rs.depthBias) ||
                            (cache.rs.depthBiasSlop !== rs.depthBiasSlop)) {
                            gl.polygonOffset(rs.depthBias, rs.depthBiasSlop);
                            cache.rs.depthBias = rs.depthBias;
                            cache.rs.depthBiasSlop = rs.depthBiasSlop;
                        }

                        if (cache.rs.lineWidth !== rs.lineWidth) {
                            gl.lineWidth(rs.lineWidth);
                            cache.rs.lineWidth = rs.lineWidth;
                        }

                    } // rasterizater state

                    // depth-stencil state
                    const dss = cmd2.gpuPipelineState.dss;
                    if (dss) {

                        if (cache.dss.depthTest !== dss.depthTest) {
                            if (dss.depthTest) {
                                gl.enable(gl.DEPTH_TEST);
                            } else {
                                gl.disable(gl.DEPTH_TEST);
                            }
                            cache.dss.depthTest = dss.depthTest;
                        }

                        if (cache.dss.depthWrite !== dss.depthWrite) {
                            gl.depthMask(dss.depthWrite);
                            cache.dss.depthWrite = dss.depthWrite;
                        }

                        if (cache.dss.depthFunc !== dss.depthFunc) {
                            gl.depthFunc(WebGLCmpFuncs[dss.depthFunc]);
                            cache.dss.depthFunc = dss.depthFunc;
                        }

                        // front
                        if ((cache.dss.stencilTestFront !== dss.stencilTestFront) ||
                            (cache.dss.stencilTestBack !== dss.stencilTestBack)) {
                            if (dss.stencilTestFront || dss.stencilTestBack) {
                                gl.enable(gl.STENCIL_TEST);
                            } else {
                                gl.disable(gl.STENCIL_TEST);
                            }
                            cache.dss.stencilTestFront = dss.stencilTestFront;
                            cache.dss.stencilTestBack = dss.stencilTestBack;
                        }

                        if ((cache.dss.stencilFuncFront !== dss.stencilFuncFront) ||
                            (cache.dss.stencilRefFront !== dss.stencilRefFront) ||
                            (cache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront)) {

                            gl.stencilFuncSeparate(
                                gl.FRONT,
                                WebGLCmpFuncs[dss.stencilFuncFront],
                                dss.stencilRefFront,
                                dss.stencilReadMaskFront);

                            cache.dss.stencilFuncFront = dss.stencilFuncFront;
                            cache.dss.stencilRefFront = dss.stencilRefFront;
                            cache.dss.stencilReadMaskFront = dss.stencilReadMaskFront;
                        }

                        if ((cache.dss.stencilFailOpFront !== dss.stencilFailOpFront) ||
                            (cache.dss.stencilZFailOpFront !== dss.stencilZFailOpFront) ||
                            (cache.dss.stencilPassOpFront !== dss.stencilPassOpFront)) {

                            gl.stencilOpSeparate(
                                gl.FRONT,
                                WebGLStencilOps[dss.stencilFailOpFront],
                                WebGLStencilOps[dss.stencilZFailOpFront],
                                WebGLStencilOps[dss.stencilPassOpFront]);

                            cache.dss.stencilFailOpFront = dss.stencilFailOpFront;
                            cache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
                            cache.dss.stencilPassOpFront = dss.stencilPassOpFront;
                        }

                        if (cache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(gl.FRONT, dss.stencilWriteMaskFront);
                            cache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
                        }

                        // back
                        if ((cache.dss.stencilFuncBack !== dss.stencilFuncBack) ||
                            (cache.dss.stencilRefBack !== dss.stencilRefBack) ||
                            (cache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack)) {

                            gl.stencilFuncSeparate(
                                gl.BACK,
                                WebGLCmpFuncs[dss.stencilFuncBack],
                                dss.stencilRefBack,
                                dss.stencilReadMaskBack);

                            cache.dss.stencilFuncBack = dss.stencilFuncBack;
                            cache.dss.stencilRefBack = dss.stencilRefBack;
                            cache.dss.stencilReadMaskBack = dss.stencilReadMaskBack;
                        }

                        if ((cache.dss.stencilFailOpBack !== dss.stencilFailOpBack) ||
                            (cache.dss.stencilZFailOpBack !== dss.stencilZFailOpBack) ||
                            (cache.dss.stencilPassOpBack !== dss.stencilPassOpBack)) {

                            gl.stencilOpSeparate(
                                gl.BACK,
                                WebGLStencilOps[dss.stencilFailOpBack],
                                WebGLStencilOps[dss.stencilZFailOpBack],
                                WebGLStencilOps[dss.stencilPassOpBack]);

                            cache.dss.stencilFailOpBack = dss.stencilFailOpBack;
                            cache.dss.stencilZFailOpBack = dss.stencilZFailOpBack;
                            cache.dss.stencilPassOpBack = dss.stencilPassOpBack;
                        }

                        if (cache.dss.stencilWriteMaskBack !== dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(gl.BACK, dss.stencilWriteMaskBack);
                            cache.dss.stencilWriteMaskBack = dss.stencilWriteMaskBack;
                        }
                    } // depth-stencil state

                    // blend state
                    const bs = cmd2.gpuPipelineState.bs;
                    if (bs) {

                        if (cache.bs.isA2C !== bs.isA2C) {
                            if (bs.isA2C) {
                                gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
                            } else {
                                gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
                            }
                            cache.bs.isA2C = bs.isA2C;
                        }

                        if ((cache.bs.blendColor[0] !== bs.blendColor[0]) ||
                            (cache.bs.blendColor[1] !== bs.blendColor[1]) ||
                            (cache.bs.blendColor[2] !== bs.blendColor[2]) ||
                            (cache.bs.blendColor[3] !== bs.blendColor[3])) {

                            gl.blendColor(bs.blendColor[0], bs.blendColor[1], bs.blendColor[2], bs.blendColor[3]);

                            cache.bs.blendColor[0] = bs.blendColor[0];
                            cache.bs.blendColor[1] = bs.blendColor[1];
                            cache.bs.blendColor[2] = bs.blendColor[2];
                            cache.bs.blendColor[3] = bs.blendColor[3];
                        }

                        const target0 = bs.targets[0];
                        const target0Cache = cache.bs.targets[0];

                        if (target0Cache.blend !== target0.blend) {
                            if (target0.blend) {
                                gl.enable(gl.BLEND);
                            } else {
                                gl.disable(gl.BLEND);
                            }
                            target0Cache.blend = target0.blend;
                        }

                        if ((target0Cache.blendEq !== target0.blendEq) ||
                            (target0Cache.blendAlphaEq !== target0.blendAlphaEq)) {

                            gl.blendEquationSeparate(WebGLBlendOps[target0.blendEq], WebGLBlendOps[target0.blendAlphaEq]);

                            target0Cache.blendEq = target0.blendEq;
                            target0Cache.blendAlphaEq = target0.blendAlphaEq;
                        }

                        if ((target0Cache.blendSrc !== target0.blendSrc) ||
                            (target0Cache.blendDst !== target0.blendDst) ||
                            (target0Cache.blendSrcAlpha !== target0.blendSrcAlpha) ||
                            (target0Cache.blendDstAlpha !== target0.blendDstAlpha)) {

                            gl.blendFuncSeparate(
                                WebGLBlendFactors[target0.blendSrc],
                                WebGLBlendFactors[target0.blendDst],
                                WebGLBlendFactors[target0.blendSrcAlpha],
                                WebGLBlendFactors[target0.blendDstAlpha]);

                            target0Cache.blendSrc = target0.blendSrc;
                            target0Cache.blendDst = target0.blendDst;
                            target0Cache.blendSrcAlpha = target0.blendSrcAlpha;
                            target0Cache.blendDstAlpha = target0.blendDstAlpha;
                        }

                        if (target0Cache.blendColorMask !== target0.blendColorMask) {

                            gl.colorMask(
                                (target0.blendColorMask & GFXColorMask.R) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.G) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.B) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.A) !== GFXColorMask.NONE);

                            target0Cache.blendColorMask = target0.blendColorMask;
                        }
                    } // blend state
                } // bind pso

                if (cmd2.gpuBindingLayout && gpuShader) {
                    for (const gpuBinding of cmd2.gpuBindingLayout.gpuBindings) {

                        switch (gpuBinding.type) {
                            case GFXBindingType.UNIFORM_BUFFER: {

                                if (gpuBinding.gpuBuffer && gpuBinding.gpuBuffer.buffer) {

                                    let glBlock: WebGLGPUUniformBlock | null = null;

                                    for (const block of gpuShader.glBlocks) {
                                        if (block.binding === gpuBinding.binding) {
                                            glBlock = block;
                                            break;
                                        }
                                    }

                                    if (glBlock && gpuBinding.gpuBuffer.vf32) {
                                        for (const glUniform of glBlock.glActiveUniforms) {
                                            switch (glUniform.glType) {
                                                case gl.BOOL:
                                                case gl.INT: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform1iv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.BOOL_VEC2:
                                                case gl.INT_VEC2: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform2iv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.BOOL_VEC3:
                                                case gl.INT_VEC3: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform3iv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.BOOL_VEC4:
                                                case gl.INT_VEC4: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform4iv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform1fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_VEC2: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform2fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_VEC3: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform3fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_VEC4: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform4fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_MAT2: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniformMatrix2fv(glUniform.glLoc, false, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_MAT3: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniformMatrix3fv(glUniform.glLoc, false, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case gl.FLOAT_MAT4: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (gpuBinding.gpuBuffer.vf32[idx] !== glUniform.array[u]) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniformMatrix4fv(glUniform.glLoc, false, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                default:
                                            }
                                        }
                                    }
                                } // if

                                break;
                            }
                            case GFXBindingType.SAMPLER: {

                                if (gpuBinding.gpuSampler) {

                                    let glSampler: WebGLGPUUniformSampler | null = null;

                                    for (const sampler of gpuShader.glSamplers) {
                                        if (sampler.binding === gpuBinding.binding) {
                                            glSampler = sampler;
                                            break;
                                        }
                                    }

                                    if (glSampler) {
                                        for (const texUnit of glSampler.units) {

                                            let glTexUnit: IWebGLTexUnit | null = null;

                                            if (gpuBinding.gpuTexView &&
                                                gpuBinding.gpuTexView.gpuTexture.size > 0) {

                                                if (cache.texUnit !== texUnit) {
                                                    gl.activeTexture(gl.TEXTURE0 + texUnit);
                                                    cache.texUnit = texUnit;
                                                }

                                                const gpuTexture = gpuBinding.gpuTexView.gpuTexture;
                                                switch (glSampler.glType) {
                                                    case gl.SAMPLER_2D: {
                                                        glTexUnit = cache.glTex2DUnits[texUnit];
                                                        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                            if (gpuTexture.glTexture) {
                                                                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                                                            } else {
                                                                gl.bindTexture(gl.TEXTURE_2D, device.nullTex2D!.gpuTexture.glTexture);
                                                            }
                                                            glTexUnit.glTexture = gpuTexture.glTexture;
                                                        }
                                                        break;
                                                    }
                                                    case gl.SAMPLER_CUBE: {
                                                        glTexUnit = cache.glTexCubeUnits[texUnit];
                                                        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                            if (gpuTexture.glTexture) {
                                                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                                                            } else {
                                                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, device.nullTexCube!.gpuTexture.glTexture);
                                                            }
                                                            glTexUnit.glTexture = gpuTexture.glTexture;
                                                        }
                                                        break;
                                                    }
                                                    default: {
                                                        console.error('Unsupported GL Texture type.');
                                                    }
                                                }

                                                if (glTexUnit) {
                                                    const gpuSampler = gpuBinding.gpuSampler;
                                                    if (gpuTexture.isPowerOf2) {
                                                        glWrapS = gpuSampler.glWrapS;
                                                        glWrapT = gpuSampler.glWrapT;
                                                    } else {
                                                        glWrapS = gl.CLAMP_TO_EDGE;
                                                        glWrapT = gl.CLAMP_TO_EDGE;
                                                    }

                                                    if (gpuTexture.isPowerOf2
                                                        // && gpuTexture.mipLevel > 1
                                                        ) {
                                                        glMinFilter = gpuSampler.glMinFilter;
                                                    } else {
                                                        if (gpuSampler.glMinFilter === gl.LINEAR ||
                                                            gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_NEAREST ||
                                                            gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_LINEAR) {
                                                            glMinFilter = gl.LINEAR;
                                                        } else {
                                                            glMinFilter = gl.NEAREST;
                                                        }
                                                    }

                                                    if (gpuTexture.glWrapS !== glWrapS) {
                                                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, glWrapS);
                                                        gpuTexture.glWrapS = glWrapS;
                                                    }

                                                    if (gpuTexture.glWrapT !== glWrapT) {
                                                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, glWrapT);
                                                        gpuTexture.glWrapT = glWrapT;
                                                    }

                                                    if (gpuTexture.glMinFilter !== glMinFilter) {
                                                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, glMinFilter);
                                                        gpuTexture.glMinFilter = glMinFilter;
                                                    }

                                                    if (gpuTexture.glMagFilter !== gpuSampler.glMagFilter) {
                                                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
                                                        gpuTexture.glMagFilter = gpuSampler.glMagFilter;
                                                    }
                                                }
                                            }
                                        }
                                    } // if
                                } else {
                                    console.error('Not found sampler on binding unit ' + gpuBinding.binding);
                                }

                                break;
                            }
                        }
                    }
                } // bind binding layout

                if (cmd2.gpuInputAssembler && gpuShader && gpuInputAssembler !== cmd2.gpuInputAssembler) {
                    gpuInputAssembler = cmd2.gpuInputAssembler;

                    if (device.useVAO) {
                        const vao = device.OES_vertex_array_object!;

                        // check vao
                        let glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram!);
                        if (!glVAO) {
                            glVAO = vao.createVertexArrayOES()!;
                            gpuInputAssembler.glVAOs.set(gpuShader.glProgram!, glVAO);

                            vao.bindVertexArrayOES(glVAO);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

                            let glAttrib: WebGLAttrib | null;
                            for (const glInput of gpuShader.glInputs) {
                                glAttrib = null;

                                for (const attrib of gpuInputAssembler.glAttribs) {
                                    if (attrib.name === glInput.name) {
                                        glAttrib = attrib;
                                        break;
                                    }
                                }

                                if (glAttrib) {
                                    if (cache.glArrayBuffer !== glAttrib.glBuffer) {
                                        gl.bindBuffer(gl.ARRAY_BUFFER, glAttrib.glBuffer);
                                        cache.glArrayBuffer = glAttrib.glBuffer;
                                    }

                                    for (let c = 0; c < glAttrib.componentCount; ++c) {
                                        const glLoc = glInput.glLoc + c;
                                        const attribOffset = glAttrib.offset + glAttrib.size * c;

                                        gl.enableVertexAttribArray(glLoc);
                                        cache.glCurrentAttribLocs[glLoc] = true;

                                        gl.vertexAttribPointer(glLoc, glAttrib.count, glAttrib.glType, glAttrib.isNormalized, glAttrib.stride, attribOffset);
                                        // gl.vertexAttribDivisor(glLoc, glAttrib.isInstanced ? 1 : 0);
                                    }
                                }
                            }

                            const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                            if (gpuBuffer) {
                                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                            }

                            vao.bindVertexArrayOES(null);
                            gl.bindBuffer(gl.ARRAY_BUFFER, null);
                            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                            cache.glArrayBuffer = null;
                            cache.glElementArrayBuffer = null;
                        }

                        if (cache.glVAO !== glVAO) {
                            vao.bindVertexArrayOES(glVAO);
                            cache.glVAO = glVAO;
                        }
                    } else {
                        for (let a = 0; a < device.maxVertexAttributes; ++a) {
                            cache.glCurrentAttribLocs[a] = false;
                        }

                        for (const glInput of gpuShader.glInputs) {
                            let glAttrib: WebGLAttrib | null = null;

                            for (const attrib of gpuInputAssembler.glAttribs) {
                                if (attrib.name === glInput.name) {
                                    glAttrib = attrib;
                                    break;
                                }
                            }

                            if (glAttrib) {
                                if (cache.glArrayBuffer !== glAttrib.glBuffer) {
                                    gl.bindBuffer(gl.ARRAY_BUFFER, glAttrib.glBuffer);
                                    cache.glArrayBuffer = glAttrib.glBuffer;
                                }

                                for (let c = 0; c < glAttrib.componentCount; ++c) {
                                    const glLoc = glInput.glLoc + c;
                                    const attribOffset = glAttrib.offset + glAttrib.size * c;

                                    if (!cache.glEnabledAttribLocs[glLoc] && glLoc >= 0) {
                                        gl.enableVertexAttribArray(glLoc);
                                        cache.glEnabledAttribLocs[glLoc] = true;
                                    }
                                    cache.glCurrentAttribLocs[glLoc] = true;

                                    gl.vertexAttribPointer(glLoc, glAttrib.count, glAttrib.glType, glAttrib.isNormalized, glAttrib.stride, attribOffset);
                                }
                            }
                        } // for

                        const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                        if (gpuBuffer) {
                            if (cache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                                cache.glElementArrayBuffer = gpuBuffer.glBuffer;
                            }
                        }

                        for (let a = 0; a < device.maxVertexAttributes; ++a) {
                            if (cache.glEnabledAttribLocs[a] !== cache.glCurrentAttribLocs[a]) {
                                gl.disableVertexAttribArray(a);
                                cache.glEnabledAttribLocs[a] = false;
                            }
                        }
                    } // if (device.useVAO)
                }

                if (gpuPipelineState) {
                    for (const dynamicState of gpuPipelineState.dynamicStates) {
                        switch (dynamicState) {
                            case GFXDynamicState.VIEWPORT: {
                                if (cmd2.viewport) {
                                    if (cache.viewport.left !== cmd2.viewport.left ||
                                        cache.viewport.top !== cmd2.viewport.top ||
                                        cache.viewport.width !== cmd2.viewport.width ||
                                        cache.viewport.height !== cmd2.viewport.height) {

                                        gl.viewport(cmd2.viewport.left, cmd2.viewport.top, cmd2.viewport.width, cmd2.viewport.height);

                                        cache.viewport.left = cmd2.viewport.left;
                                        cache.viewport.top = cmd2.viewport.top;
                                        cache.viewport.width = cmd2.viewport.width;
                                        cache.viewport.height = cmd2.viewport.height;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.SCISSOR: {
                                if (cmd2.scissor) {
                                    if (cache.scissorRect.x !== cmd2.scissor.x ||
                                        cache.scissorRect.y !== cmd2.scissor.y ||
                                        cache.scissorRect.width !== cmd2.scissor.width ||
                                        cache.scissorRect.height !== cmd2.scissor.height) {

                                        gl.scissor(cmd2.scissor.x, cmd2.scissor.y, cmd2.scissor.width, cmd2.scissor.height);

                                        cache.scissorRect.x = cmd2.scissor.x;
                                        cache.scissorRect.y = cmd2.scissor.y;
                                        cache.scissorRect.width = cmd2.scissor.width;
                                        cache.scissorRect.height = cmd2.scissor.height;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.LINE_WIDTH: {
                                if (cmd2.lineWidth) {
                                    if (cache.rs.lineWidth !== cmd2.lineWidth) {
                                        gl.lineWidth(cmd2.lineWidth);
                                        cache.rs.lineWidth = cmd2.lineWidth;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.DEPTH_BIAS: {
                                if (cmd2.depthBias) {

                                    if ((cache.rs.depthBias !== cmd2.depthBias.constantFactor) ||
                                        (cache.rs.depthBiasSlop !== cmd2.depthBias.slopeFactor)) {
                                        gl.polygonOffset(cmd2.depthBias.constantFactor, cmd2.depthBias.slopeFactor);
                                        cache.rs.depthBias = cmd2.depthBias.constantFactor;
                                        cache.rs.depthBiasSlop = cmd2.depthBias.slopeFactor;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.BLEND_CONSTANTS: {
                                if (cmd2.blendConstants) {
                                    if ((cache.bs.blendColor[0] !== cmd2.blendConstants[0]) ||
                                        (cache.bs.blendColor[1] !== cmd2.blendConstants[1]) ||
                                        (cache.bs.blendColor[2] !== cmd2.blendConstants[2]) ||
                                        (cache.bs.blendColor[3] !== cmd2.blendConstants[3])) {

                                        gl.blendColor(cmd2.blendConstants[0], cmd2.blendConstants[1], cmd2.blendConstants[2], cmd2.blendConstants[3]);

                                        cache.bs.blendColor[0] = cmd2.blendConstants[0];
                                        cache.bs.blendColor[1] = cmd2.blendConstants[1];
                                        cache.bs.blendColor[2] = cmd2.blendConstants[2];
                                        cache.bs.blendColor[3] = cmd2.blendConstants[3];
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.STENCIL_WRITE_MASK: {
                                if (cmd2.stencilWriteMask) {
                                    switch (cmd2.stencilWriteMask.face) {
                                        case GFXStencilFace.FRONT: {
                                            if (cache.dss.stencilWriteMaskFront !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMaskSeparate(gl.FRONT, cmd2.stencilWriteMask.writeMask);
                                                cache.dss.stencilWriteMaskFront = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.BACK: {
                                            if (cache.dss.stencilWriteMaskBack !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMaskSeparate(gl.BACK, cmd2.stencilWriteMask.writeMask);
                                                cache.dss.stencilWriteMaskBack = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.ALL: {
                                            if (cache.dss.stencilWriteMaskFront !== cmd2.stencilWriteMask.writeMask ||
                                                cache.dss.stencilWriteMaskBack !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMask(cmd2.stencilWriteMask.writeMask);
                                                cache.dss.stencilWriteMaskFront = cmd2.stencilWriteMask.writeMask;
                                                cache.dss.stencilWriteMaskBack = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.STENCIL_COMPARE_MASK: {
                                if (cmd2.stencilCompareMask) {
                                    switch (cmd2.stencilCompareMask.face) {
                                        case GFXStencilFace.FRONT: {
                                            if (cache.dss.stencilRefFront !== cmd2.stencilCompareMask.reference ||
                                                cache.dss.stencilReadMaskFront !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFuncSeparate(
                                                    gl.FRONT,
                                                    WebGLCmpFuncs[cache.dss.stencilFuncFront],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                cache.dss.stencilRefFront = cmd2.stencilCompareMask.reference;
                                                cache.dss.stencilReadMaskFront = cmd2.stencilCompareMask.compareMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.BACK: {
                                            if (cache.dss.stencilRefBack !== cmd2.stencilCompareMask.reference ||
                                                cache.dss.stencilReadMaskBack !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFuncSeparate(
                                                    gl.BACK,
                                                    WebGLCmpFuncs[cache.dss.stencilFuncBack],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                cache.dss.stencilRefBack = cmd2.stencilCompareMask.reference;
                                                cache.dss.stencilReadMaskBack = cmd2.stencilCompareMask.compareMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.ALL: {
                                            if (cache.dss.stencilRefFront !== cmd2.stencilCompareMask.reference ||
                                                cache.dss.stencilReadMaskFront !== cmd2.stencilCompareMask.compareMask ||
                                                cache.dss.stencilRefBack !== cmd2.stencilCompareMask.reference ||
                                                cache.dss.stencilReadMaskBack !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFunc(
                                                    WebGLCmpFuncs[cache.dss.stencilFuncBack],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                cache.dss.stencilRefFront = cmd2.stencilCompareMask.reference;
                                                cache.dss.stencilReadMaskFront = cmd2.stencilCompareMask.compareMask;
                                                cache.dss.stencilRefBack = cmd2.stencilCompareMask.reference;
                                                cache.dss.stencilReadMaskBack = cmd2.stencilCompareMask.compareMask;
                                            }
                                            break;
                                        }
                                    }
                                }
                                break;
                            }
                        } // switch
                    } // for
                } // if

                break;
            }
            case WebGLCmd.DRAW: {
                const cmd3: WebGLCmdDraw = cmdPackage.drawCmds.array[cmdId];
                if (gpuInputAssembler && gpuShader) {
                    if (!gpuInputAssembler.gpuIndirectBuffer) {
                        const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                        if (gpuBuffer && cmd3.drawInfo.indexCount > -1) {
                            const offset = cmd3.drawInfo.firstIndex * gpuBuffer.stride;
                            gl.drawElements(glPrimitive, cmd3.drawInfo.indexCount, gpuInputAssembler.glIndexType, offset);
                        } else {
                            gl.drawArrays(glPrimitive, cmd3.drawInfo.firstVertex, cmd3.drawInfo.vertexCount);
                        }
                    } else {
                        if (gpuInputAssembler.gpuIndirectBuffer) {
                            for (const drawInfo of gpuInputAssembler.gpuIndirectBuffer.indirects) {
                                const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                                if (gpuBuffer && drawInfo.indexCount > -1) {
                                    const offset = drawInfo.firstIndex * gpuBuffer.stride;
                                    gl.drawElements(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, offset);
                                } else {
                                    gl.drawArrays(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount);
                                }
                            }
                        }
                    }
                }
                break;
            }
            case WebGLCmd.UPDATE_BUFFER: {
                const cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
                WebGLCmdFuncUpdateBuffer(
                    device,
                    cmd4.gpuBuffer as WebGLGPUBuffer,
                    cmd4.buffer as GFXBufferSource,
                    cmd4.offset,
                    cmd4.size);

                break;
            }
            case WebGLCmd.COPY_BUFFER_TO_TEXTURE: {
                const cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
                WebGLCmdFuncCopyBuffersToTexture(
                    device,
                    [(cmd5.gpuBuffer as WebGLGPUBuffer).buffer!],
                    cmd5.gpuTexture as WebGLGPUTexture,
                    cmd5.regions);

                break;
            }
        } // switch
    } // for
}

export function WebGLCmdFuncCopyTexImagesToTexture (
    device: WebGLGFXDevice,
    texImages: TexImageSource[],
    gpuTexture: WebGLGPUTexture,
    regions: GFXBufferTextureCopy[]) {

    const gl = device.gl;
    let m = 0;
    let n = 0;
    let f = 0;

    switch (gpuTexture.glTarget) {
        case gl.TEXTURE_2D: {
            const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                // console.debug('Copying image to texture 2D: ' + region.texExtent.width + ' x ' + region.texExtent.height);
                for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                    gl.texSubImage2D(gl.TEXTURE_2D, m,
                        region.texOffset.x, region.texOffset.y,
                        gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
                }
            }
            break;
        }
        case gl.TEXTURE_CUBE_MAP: {
            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                // console.debug('Copying image to texture cube: ' + region.texExtent.width + ' x ' + region.texExtent.height);
                const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                    const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                    for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                        gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                            region.texOffset.x, region.texOffset.y,
                            gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
                    }
                }
            }
            break;
        }
        default: {
            console.error('Unsupported GL texture type, copy buffer to texture failed.');
        }
    }

    if ((gpuTexture.flags & GFXTextureFlagBit.GEN_MIPMAP) &&
        gpuTexture.isPowerOf2) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}

export function WebGLCmdFuncCopyBuffersToTexture (
    device: WebGLGFXDevice,
    buffers: ArrayBuffer[],
    gpuTexture: WebGLGPUTexture,
    regions: GFXBufferTextureCopy[]) {

    const gl = device.gl;
    let m = 0;
    let n = 0;
    let w = 1;
    let h = 1;
    let f = 0;

    const fmtInfo: IGFXFormatInfo = GFXFormatInfos[gpuTexture.format];
    const isCompressed = fmtInfo.isCompressed;
    switch (gpuTexture.glTarget) {
        case gl.TEXTURE_2D: {
            const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                w = region.texExtent.width;
                h = region.texExtent.height;
                // console.debug('Copying buffer to texture 2D: ' + w + ' x ' + h);

                for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                    const pixels = (fmtInfo.type === GFXFormatType.FLOAT && !isCompressed ? new Float32Array(buffers[n++]) : new Uint8Array(buffers[n++]));

                    if (!isCompressed) {
                        gl.texSubImage2D(gl.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, gpuTexture.glType, pixels);
                    } else {
                        if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                            gl.compressedTexSubImage2D(gl.TEXTURE_2D, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, pixels);
                        } else {
                            gl.compressedTexImage2D(gl.TEXTURE_2D, m,
                                gpuTexture.glInternelFmt, w, h, 0, pixels);
                        }
                    }

                    w = Math.max(1, w >> 1);
                    h = Math.max(1, w >> 1);
                }
            }

            break;
        }
        case gl.TEXTURE_CUBE_MAP: {
            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                n = 0;
                const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                    w = region.texExtent.width;
                    h = region.texExtent.height;
                    // console.debug('Copying buffer to texture cube: ' + w + ' x ' + h);

                    const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                    for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                        const pixels = (fmtInfo.type === GFXFormatType.FLOAT && !isCompressed ? new Float32Array(buffers[n++]) : new Uint8Array(buffers[n++]));
                        if (!isCompressed) {
                            gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, gpuTexture.glType, pixels);
                        } else {
                            if (gpuTexture.glInternelFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL) {
                                gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                                    region.texOffset.x, region.texOffset.y, w, h,
                                    gpuTexture.glFormat, pixels);
                            } else {
                                gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                                    gpuTexture.glInternelFmt, w, h, 0, pixels);
                            }
                        }
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, w >> 1);
                    }
                }
            }
            break;
        }
        default: {
            console.error('Unsupported GL texture type, copy buffer to texture failed.');
        }
    }

    if (gpuTexture.flags & GFXTextureFlagBit.GEN_MIPMAP) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}
