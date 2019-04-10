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
    WebGLEXT,
} from '../define';
import { WebGLGFXCommandAllocator } from './webgl-command-allocator';
import {
    IWebGLDepthBias,
    IWebGLDepthBounds,
    IWebGLStencilCompareMask,
    IWebGLStencilWriteMask,
} from './webgl-command-buffer';
import { WebGLGFXDevice } from './webgl-device';
import { IWebGLGPUInputAssembler, IWebGLGPUUniform, WebGLAttrib, WebGLGPUBindingLayout,
    WebGLGPUBuffer, WebGLGPUFramebuffer, WebGLGPUInput,
    WebGLGPUPipelineState, WebGLGPUShader, WebGLGPUTexture, WebGLGPUUniformBlock, WebGLGPUUniformSampler } from './webgl-gpu-objects';
import { IWebGLTexUnit } from './webgl-state-cache';

const SAMPLES: number[] = [
    1,
    2,
    4,
    8,
    16,
    32,
    64,
];

// tslint:disable: max-line-length

function CmpF32NotEuqal (a: number, b: number): boolean {
    const c = a - b;
    return (c > 0.000001 || c < -0.000001);
}

function GFXFormatToWebGLType (format: GFXFormat, device: WebGLGFXDevice): GLenum {
    switch (format) {
        case GFXFormat.R8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.R8UI: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8I: return WebGLRenderingContext.BYTE;
        case GFXFormat.R16F: return device.OES_texture_half_float ? device.OES_texture_half_float.HALF_FLOAT_OES : WebGLRenderingContext.FLOAT;
        case GFXFormat.R16UI: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.R16I: return WebGLRenderingContext.SHORT;
        case GFXFormat.R32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.R32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.R32I: return WebGLRenderingContext.INT;

        case GFXFormat.RG8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RG8UI: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8I: return WebGLRenderingContext.BYTE;
        case GFXFormat.RG16F: return device.OES_texture_half_float ? device.OES_texture_half_float.HALF_FLOAT_OES : WebGLRenderingContext.FLOAT;
        case GFXFormat.RG16UI: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RG16I: return WebGLRenderingContext.SHORT;
        case GFXFormat.RG32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RG32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RG32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGB8UI: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8I: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGB16F: return device.OES_texture_half_float ? device.OES_texture_half_float.HALF_FLOAT_OES : WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB16UI: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RGB16I: return WebGLRenderingContext.SHORT;
        case GFXFormat.RGB32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB32I: return WebGLRenderingContext.INT;

        case GFXFormat.RGBA8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8_A8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGBA8UI: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8I: return WebGLRenderingContext.BYTE;
        case GFXFormat.RGBA16F: return device.OES_texture_half_float ? device.OES_texture_half_float.HALF_FLOAT_OES : WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA16UI: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RGBA16I: return WebGLRenderingContext.SHORT;
        case GFXFormat.RGBA32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGBA32UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA32I: return WebGLRenderingContext.INT;

        case GFXFormat.R5G6B5: return WebGLRenderingContext.UNSIGNED_SHORT_5_6_5;
        case GFXFormat.R11G11B10F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4;
        case GFXFormat.RGB10A2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB10A2UI: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB9E5: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.D16: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D16S8: return WebGLRenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D24: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D24S8: return device.WEBGL_depth_texture ? device.WEBGL_depth_texture.UNSIGNED_INT_24_8_WEBGL : WebGLRenderingContext.UNSIGNED_INT;
        case GFXFormat.D32F: return WebGLRenderingContext.FLOAT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.FLOAT;

        case GFXFormat.BC1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC1_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC5: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC5_SNORM: return WebGLRenderingContext.BYTE;
        case GFXFormat.BC6H_SF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC6H_UF16: return WebGLRenderingContext.FLOAT;
        case GFXFormat.BC7: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC7_SRGB: return WebGLRenderingContext.UNSIGNED_BYTE;

        case GFXFormat.ETC_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8_A1: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11SN: return WebGLRenderingContext.BYTE;
        case GFXFormat.EAC_RG11: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_RG11SN: return WebGLRenderingContext.BYTE;

        case GFXFormat.PVRTC_RGB2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA2: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGB4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA4: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_2BPP: return WebGLRenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_4BPP: return WebGLRenderingContext.UNSIGNED_BYTE;

        default: {
            return WebGLRenderingContext.UNSIGNED_BYTE;
        }
    }
}

function GFXFormatToWebGLInternalFormat (format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB16F: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB32F: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA16F: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA32F: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB565;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGB5_A1;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA4;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT16;
        case GFXFormat.D16S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;

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
            return WebGLRenderingContext.RGBA;
        }
    }
}

function GFXFormatToWebGLFormat (format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGLRenderingContext.ALPHA;
        case GFXFormat.L8: return WebGLRenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGLRenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.RGB8: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB16F: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB32F: return WebGLRenderingContext.RGB;
        case GFXFormat.RGBA8: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA16F: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA32F: return WebGLRenderingContext.RGBA;
        case GFXFormat.R5G6B5: return WebGLRenderingContext.RGB;
        case GFXFormat.RGB5A1: return WebGLRenderingContext.RGBA;
        case GFXFormat.RGBA4: return WebGLRenderingContext.RGBA;
        case GFXFormat.D16: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D16S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGLRenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGLRenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGLRenderingContext.DEPTH_STENCIL;

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
            return WebGLRenderingContext.RGBA;
        }
    }
}

function GFXTypeToWebGLType (type: GFXType): GLenum {
    switch (type) {
        case GFXType.BOOL: return WebGLRenderingContext.BOOL;
        case GFXType.BOOL2: return WebGLRenderingContext.BOOL_VEC2;
        case GFXType.BOOL3: return WebGLRenderingContext.BOOL_VEC3;
        case GFXType.BOOL4: return WebGLRenderingContext.BOOL_VEC4;
        case GFXType.INT: return WebGLRenderingContext.INT;
        case GFXType.INT2: return WebGLRenderingContext.INT_VEC2;
        case GFXType.INT3: return WebGLRenderingContext.INT_VEC3;
        case GFXType.INT4: return WebGLRenderingContext.INT_VEC4;
        case GFXType.UINT: return WebGLRenderingContext.UNSIGNED_INT;
        case GFXType.FLOAT: return WebGLRenderingContext.FLOAT;
        case GFXType.FLOAT2: return WebGLRenderingContext.FLOAT_VEC2;
        case GFXType.FLOAT3: return WebGLRenderingContext.FLOAT_VEC3;
        case GFXType.FLOAT4: return WebGLRenderingContext.FLOAT_VEC4;
        case GFXType.MAT2: return WebGLRenderingContext.FLOAT_MAT2;
        case GFXType.MAT3: return WebGLRenderingContext.FLOAT_MAT3;
        case GFXType.MAT4: return WebGLRenderingContext.FLOAT_MAT4;
        case GFXType.SAMPLER2D: return WebGLRenderingContext.SAMPLER_2D;
        case GFXType.SAMPLER_CUBE: return WebGLRenderingContext.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GL type failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLTypeToGFXType (glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.BOOL: return GFXType.BOOL;
        case WebGLRenderingContext.BOOL_VEC2: return GFXType.BOOL2;
        case WebGLRenderingContext.BOOL_VEC3: return GFXType.BOOL3;
        case WebGLRenderingContext.BOOL_VEC4: return GFXType.BOOL4;
        case WebGLRenderingContext.INT: return GFXType.INT;
        case WebGLRenderingContext.INT_VEC2: return GFXType.INT2;
        case WebGLRenderingContext.INT_VEC3: return GFXType.INT3;
        case WebGLRenderingContext.INT_VEC4: return GFXType.INT4;
        case WebGLRenderingContext.UNSIGNED_INT: return GFXType.UINT;
        case WebGLRenderingContext.FLOAT: return GFXType.FLOAT;
        case WebGLRenderingContext.FLOAT_VEC2: return GFXType.FLOAT2;
        case WebGLRenderingContext.FLOAT_VEC3: return GFXType.FLOAT3;
        case WebGLRenderingContext.FLOAT_VEC4: return GFXType.FLOAT4;
        case WebGLRenderingContext.FLOAT_MAT2: return GFXType.MAT2;
        case WebGLRenderingContext.FLOAT_MAT3: return GFXType.MAT3;
        case WebGLRenderingContext.FLOAT_MAT4: return GFXType.MAT4;
        case WebGLRenderingContext.SAMPLER_2D: return GFXType.SAMPLER2D;
        case WebGLRenderingContext.SAMPLER_CUBE: return GFXType.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GFXType failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLGetTypeSize (glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.BOOL: return 4;
        case WebGLRenderingContext.BOOL_VEC2: return 8;
        case WebGLRenderingContext.BOOL_VEC3: return 12;
        case WebGLRenderingContext.BOOL_VEC4: return 16;
        case WebGLRenderingContext.INT: return 4;
        case WebGLRenderingContext.INT_VEC2: return 8;
        case WebGLRenderingContext.INT_VEC3: return 12;
        case WebGLRenderingContext.INT_VEC4: return 16;
        case WebGLRenderingContext.UNSIGNED_INT: return 4;
        case WebGLRenderingContext.FLOAT: return 4;
        case WebGLRenderingContext.FLOAT_VEC2: return 8;
        case WebGLRenderingContext.FLOAT_VEC3: return 12;
        case WebGLRenderingContext.FLOAT_VEC4: return 16;
        case WebGLRenderingContext.FLOAT_MAT2: return 16;
        case WebGLRenderingContext.FLOAT_MAT3: return 36;
        case WebGLRenderingContext.FLOAT_MAT4: return 64;
        case WebGLRenderingContext.SAMPLER_2D: return 4;
        case WebGLRenderingContext.SAMPLER_CUBE: return 4;
        default: {
            console.error('Unsupported GLType, get type failed.');
            return 0;
        }
    }
}

function WebGLGetComponentCount (glType: GLenum): GFXType {
    switch (glType) {
        case WebGLRenderingContext.FLOAT_MAT2: return 2;
        case WebGLRenderingContext.FLOAT_MAT3: return 3;
        case WebGLRenderingContext.FLOAT_MAT4: return 4;
        default: {
            return 1;
        }
    }
}

const WebGLCmpFuncs: GLenum[] = [
    WebGLRenderingContext.NEVER,
    WebGLRenderingContext.LESS,
    WebGLRenderingContext.EQUAL,
    WebGLRenderingContext.LEQUAL,
    WebGLRenderingContext.GREATER,
    WebGLRenderingContext.NOTEQUAL,
    WebGLRenderingContext.GEQUAL,
    WebGLRenderingContext.ALWAYS,
];

const WebGLStencilOps: GLenum[] = [
    WebGLRenderingContext.ZERO,
    WebGLRenderingContext.KEEP,
    WebGLRenderingContext.REPLACE,
    WebGLRenderingContext.INCR,
    WebGLRenderingContext.DECR,
    WebGLRenderingContext.INVERT,
    WebGLRenderingContext.INCR_WRAP,
    WebGLRenderingContext.DECR_WRAP,
];

const WebGLBlendOps: GLenum[] = [
    WebGLRenderingContext.FUNC_ADD,
    WebGLRenderingContext.FUNC_SUBTRACT,
    WebGLRenderingContext.FUNC_REVERSE_SUBTRACT,
    WebGLRenderingContext.FUNC_ADD,
    WebGLRenderingContext.FUNC_ADD,
];

const WebGLBlendFactors: GLenum[] = [
    WebGLRenderingContext.ZERO,
    WebGLRenderingContext.ONE,
    WebGLRenderingContext.SRC_ALPHA,
    WebGLRenderingContext.DST_ALPHA,
    WebGLRenderingContext.ONE_MINUS_SRC_ALPHA,
    WebGLRenderingContext.ONE_MINUS_DST_ALPHA,
    WebGLRenderingContext.SRC_COLOR,
    WebGLRenderingContext.DST_COLOR,
    WebGLRenderingContext.ONE_MINUS_SRC_COLOR,
    WebGLRenderingContext.ONE_MINUS_DST_COLOR,
    WebGLRenderingContext.SRC_ALPHA_SATURATE,
    WebGLRenderingContext.CONSTANT_COLOR,
    WebGLRenderingContext.ONE_MINUS_CONSTANT_COLOR,
    WebGLRenderingContext.CONSTANT_ALPHA,
    WebGLRenderingContext.ONE_MINUS_CONSTANT_ALPHA,
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
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? WebGLRenderingContext.DYNAMIC_DRAW : WebGLRenderingContext.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {

        gpuBuffer.glTarget = WebGLRenderingContext.ARRAY_BUFFER;
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
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);
                gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);
                device.stateCache.glArrayBuffer = null;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {

        gpuBuffer.glTarget = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER;
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
                    gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
                device.stateCache.glElementArrayBuffer = null;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        // console.error("WebGL 1.0 doesn't support uniform buffer.");
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;

        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer as ArrayBuffer);
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
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
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? WebGLRenderingContext.DYNAMIC_DRAW : WebGLRenderingContext.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {
        if (device.useVAO) {
            if (cache.glVAO) {
                device.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }

        if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);
        device.stateCache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {
        if (device.useVAO) {
            if (cache.glVAO) {
                device.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }

        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
        device.stateCache.glElementArrayBuffer = null;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        // console.error("WebGL 1.0 doesn't support uniform buffer.");
        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer as ArrayBuffer);
        }
    } else if ((gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC)) {
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = WebGLRenderingContext.NONE;
    }
}

export function WebGLCmdFuncUpdateBuffer (device: WebGLGFXDevice, gpuBuffer: WebGLGPUBuffer, buffer: GFXBufferSource, offset: number, size: number) {

    if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        if (buffer instanceof Float32Array) {
            gpuBuffer.vf32!.set(buffer, offset);
        } else {
            gpuBuffer.vf32!.set(new Float32Array(buffer as ArrayBuffer), offset);
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.indirects = (buffer as IGFXIndirectBuffer).drawInfos;
    } else {
        const buff = buffer as ArrayBuffer;
        const gl = device.gl;
        const cache = device.stateCache;

        switch (gpuBuffer.glTarget) {
            case WebGLRenderingContext.ARRAY_BUFFER: {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }
                break;
            }
            case WebGLRenderingContext.ELEMENT_ARRAY_BUFFER: {
                if (device.useVAO) {
                    if (cache.glVAO) {
                        device.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }

                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
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

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, device);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D: {

            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;

            if (gpuTexture.samples === GFXSampleCount.X1) {
                const glTexture = gl.createTexture();
                if (glTexture && gpuTexture.size > 0) {
                    gpuTexture.glTexture = glTexture;
                    const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];

                    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                        gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                        glTexUnit.glTexture = gpuTexture.glTexture;
                    }

                    let w = gpuTexture.width;
                    let h = gpuTexture.height;

                    if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    } else {
                        const view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }

                    if (gpuTexture.isPowerOf2) {
                        gpuTexture.glWrapS = WebGLRenderingContext.REPEAT;
                        gpuTexture.glWrapT = WebGLRenderingContext.REPEAT;
                    } else {
                        gpuTexture.glWrapS = WebGLRenderingContext.CLAMP_TO_EDGE;
                        gpuTexture.glWrapT = WebGLRenderingContext.CLAMP_TO_EDGE;
                    }
                    gpuTexture.glMinFilter = WebGLRenderingContext.LINEAR;
                    gpuTexture.glMagFilter = WebGLRenderingContext.LINEAR;

                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_S, gpuTexture.glWrapS);
                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_T, gpuTexture.glWrapT);
                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
                    gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
                }
            }

            break;
        }
        case GFXTextureViewType.CUBE: {

            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_CUBE_MAP;

            const glTexture = gl.createTexture();
            if (glTexture && gpuTexture.size > 0) {
                gpuTexture.glTexture = glTexture;
                const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                } else {
                    const view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };

                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.compressedTexImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, h >> 1);
                        }
                    }
                }

                if (gpuTexture.isPowerOf2) {
                    gpuTexture.glWrapS = WebGLRenderingContext.REPEAT;
                    gpuTexture.glWrapT = WebGLRenderingContext.REPEAT;
                } else {
                    gpuTexture.glWrapS = WebGLRenderingContext.CLAMP_TO_EDGE;
                    gpuTexture.glWrapT = WebGLRenderingContext.CLAMP_TO_EDGE;
                }
                gpuTexture.glMinFilter = WebGLRenderingContext.LINEAR;
                gpuTexture.glMagFilter = WebGLRenderingContext.LINEAR;

                gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_S, gpuTexture.glWrapS);
                gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_T, gpuTexture.glWrapT);
                gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MIN_FILTER, gpuTexture.glMinFilter);
                gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MAG_FILTER, gpuTexture.glMagFilter);
            }

            break;
        }
        default: {
            console.error('Unsupported GFXTextureType, create texture failed.');
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGLRenderingContext.TEXTURE_2D;
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

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, device);

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
                    const view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
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
                const view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };

                for (let f = 0; f < 6; ++f) {
                    let w = gpuTexture.width;
                    let h = gpuTexture.height;
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
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

        switch (gpuStage.type) {
            case GFXShaderType.VERTEX: {
                shaderTypeStr = 'VertexShader';
                glShaderType = WebGLRenderingContext.VERTEX_SHADER;
                break;
            }
            case GFXShaderType.FRAGMENT: {
                shaderTypeStr = 'FragmentShader';
                glShaderType = WebGLRenderingContext.FRAGMENT_SHADER;
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
                console.error(gpuStage.source);
                console.error(gl.getShaderInfoLog(gpuStage.glShader));

                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = null;
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
            const type = WebGLTypeToGFXType(attribInfo.type);
            const stride = WebGLGetTypeSize(attribInfo.type);

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
                const glType = GFXTypeToWebGLType(uniform.type);
                const stride = WebGLGetTypeSize(glType);
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
                    isFirst: true,
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
                glType: GFXTypeToWebGLType(sampler.type),
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

                const isSampler = (uniformInfo.type === WebGLRenderingContext.SAMPLER_2D) ||
                    (uniformInfo.type === WebGLRenderingContext.SAMPLER_CUBE);

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

    gpuInputAssembler.glAttribs = new Array<WebGLAttrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;

        const gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];

        const glType = GFXFormatToWebGLType(attrib.format, device);
        const size = GFXFormatInfos[attrib.format].size;

        gpuInputAssembler.glAttribs[i] = {
            name: attrib.name,
            glBuffer: gpuBuffer.glBuffer,
            glType,
            size,
            count: GFXFormatInfos[attrib.format].count,
            stride: gpuBuffer.stride,
            componentCount: WebGLGetComponentCount(glType),
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
    cmdIds.fill(0);

    let gpuPipelineState: WebGLGPUPipelineState | null = null;
    let gpuShader: WebGLGPUShader | null = null;
    let gpuInputAssembler: IWebGLGPUInputAssembler | null = null;
    let glPrimitive = WebGLRenderingContext.TRIANGLES;
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
                        gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, cmd0.gpuFramebuffer.glFramebuffer);
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
                                        clears |= WebGLRenderingContext.COLOR_BUFFER_BIT;
                                    }
                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    // invalidateAttachments.push(WebGLRenderingContext.COLOR_ATTACHMENT0 + j);
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

                                        clears |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
                                    }
                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    // invalidateAttachments.push(WebGLRenderingContext.DEPTH_ATTACHMENT);
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
                                                gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, 0xFFFFFFFF);
                                            }

                                            if (!cache.dss.stencilWriteMaskBack) {
                                                gl.stencilMaskSeparate(WebGLRenderingContext.BACK, 0xFFFFFFFF);
                                            }

                                            gl.clearStencil(cmd0.clearStencil);
                                            clears |= WebGLRenderingContext.STENCIL_BUFFER_BIT;
                                        }
                                        break;
                                    }
                                    case GFXLoadOp.DISCARD: {
                                        // invalidate the framebuffer
                                        // invalidateAttachments.push(WebGLRenderingContext.STENCIL_ATTACHMENT);
                                        break;
                                    }
                                    default:
                                }
                            }
                        }
                    } // if (curGPURenderPass.depthStencilAttachment)

                    /*
                    if (numInvalidAttach) {
                        gl.invalidateFramebuffer(WebGLRenderingContext.FRAMEBUFFER, numInvalidAttach, invalidateAttachments);
                    }
                    */

                    if (clears) {
                        gl.clear(clears);
                    }

                    // restore states
                    if (clears & WebGLRenderingContext.COLOR_BUFFER_BIT) {

                        const colorMask = cache.bs.targets[0].blendColorMask;
                        if (colorMask !== GFXColorMask.ALL) {
                            const r = (colorMask & GFXColorMask.R) !== GFXColorMask.NONE;
                            const g = (colorMask & GFXColorMask.G) !== GFXColorMask.NONE;
                            const b = (colorMask & GFXColorMask.B) !== GFXColorMask.NONE;
                            const a = (colorMask & GFXColorMask.A) !== GFXColorMask.NONE;
                            gl.colorMask(r, g, b, a);
                        }
                    }

                    if ((clears & WebGLRenderingContext.DEPTH_BUFFER_BIT) &&
                        !cache.dss.depthWrite) {
                        gl.depthMask(false);
                    }

                    if (clears & WebGLRenderingContext.STENCIL_BUFFER_BIT) {
                        if (!cache.dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, 0);
                        }

                        if (!cache.dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.BACK, 0);
                        }
                    }
                } // if (curGPURenderPass)

                break;
            }
            case WebGLCmd.END_RENDER_PASS: {
                // WebGL 1.0 doesn't support store operation of attachments.
                // GFXStoreOp.Store is the default GL behaviour.
                break;
            }
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
                                    gl.disable(WebGLRenderingContext.CULL_FACE);
                                    break;
                                }
                                case GFXCullMode.FRONT: {
                                    gl.enable(WebGLRenderingContext.CULL_FACE);
                                    gl.cullFace(WebGLRenderingContext.FRONT);
                                    break;
                                }
                                case GFXCullMode.BACK: {
                                    gl.enable(WebGLRenderingContext.CULL_FACE);
                                    gl.cullFace(WebGLRenderingContext.BACK);
                                    break;
                                }
                                default:
                            }

                            cache.rs.cullMode = rs.cullMode;
                        }

                        if (cache.rs.isFrontFaceCCW !== rs.isFrontFaceCCW) {
                            gl.frontFace(rs.isFrontFaceCCW ? WebGLRenderingContext.CCW : WebGLRenderingContext.CW);
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
                                gl.enable(WebGLRenderingContext.DEPTH_TEST);
                            } else {
                                gl.disable(WebGLRenderingContext.DEPTH_TEST);
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
                                gl.enable(WebGLRenderingContext.STENCIL_TEST);
                            } else {
                                gl.disable(WebGLRenderingContext.STENCIL_TEST);
                            }
                            cache.dss.stencilTestFront = dss.stencilTestFront;
                            cache.dss.stencilTestBack = dss.stencilTestBack;
                        }

                        if ((cache.dss.stencilFuncFront !== dss.stencilFuncFront) ||
                            (cache.dss.stencilRefFront !== dss.stencilRefFront) ||
                            (cache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront)) {

                            gl.stencilFuncSeparate(
                                WebGLRenderingContext.FRONT,
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
                                WebGLRenderingContext.FRONT,
                                WebGLStencilOps[dss.stencilFailOpFront],
                                WebGLStencilOps[dss.stencilZFailOpFront],
                                WebGLStencilOps[dss.stencilPassOpFront]);

                            cache.dss.stencilFailOpFront = dss.stencilFailOpFront;
                            cache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
                            cache.dss.stencilPassOpFront = dss.stencilPassOpFront;
                        }

                        if (cache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, dss.stencilWriteMaskFront);
                            cache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
                        }

                        // back
                        if ((cache.dss.stencilFuncBack !== dss.stencilFuncBack) ||
                            (cache.dss.stencilRefBack !== dss.stencilRefBack) ||
                            (cache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack)) {

                            gl.stencilFuncSeparate(
                                WebGLRenderingContext.BACK,
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
                                WebGLRenderingContext.BACK,
                                WebGLStencilOps[dss.stencilFailOpBack],
                                WebGLStencilOps[dss.stencilZFailOpBack],
                                WebGLStencilOps[dss.stencilPassOpBack]);

                            cache.dss.stencilFailOpBack = dss.stencilFailOpBack;
                            cache.dss.stencilZFailOpBack = dss.stencilZFailOpBack;
                            cache.dss.stencilPassOpBack = dss.stencilPassOpBack;
                        }

                        if (cache.dss.stencilWriteMaskBack !== dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGLRenderingContext.BACK, dss.stencilWriteMaskBack);
                            cache.dss.stencilWriteMaskBack = dss.stencilWriteMaskBack;
                        }
                    } // depth-stencil state

                    // blend state
                    const bs = cmd2.gpuPipelineState.bs;
                    if (bs) {

                        if (cache.bs.isA2C !== bs.isA2C) {
                            if (bs.isA2C) {
                                gl.enable(WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
                            } else {
                                gl.disable(WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
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
                                gl.enable(WebGLRenderingContext.BLEND);
                            } else {
                                gl.disable(WebGLRenderingContext.BLEND);
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
                                                case WebGLRenderingContext.BOOL:
                                                case WebGLRenderingContext.INT: {
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
                                                case WebGLRenderingContext.BOOL_VEC2:
                                                case WebGLRenderingContext.INT_VEC2: {
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
                                                case WebGLRenderingContext.BOOL_VEC3:
                                                case WebGLRenderingContext.INT_VEC3: {
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
                                                case WebGLRenderingContext.BOOL_VEC4:
                                                case WebGLRenderingContext.INT_VEC4: {
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
                                                case WebGLRenderingContext.FLOAT: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform1fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_VEC2: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform2fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_VEC3: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform3fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_VEC4: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniform4fv(glUniform.glLoc, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_MAT2: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniformMatrix2fv(glUniform.glLoc, false, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_MAT3: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
                                                            for (let n = u, m = glUniform.begin + u; n < glUniform.array.length; ++n, ++m) {
                                                                glUniform.array[n] = gpuBinding.gpuBuffer.vf32[m];
                                                            }
                                                            gl.uniformMatrix3fv(glUniform.glLoc, false, glUniform.array);
                                                            break;
                                                        }
                                                    }
                                                    break;
                                                }
                                                case WebGLRenderingContext.FLOAT_MAT4: {
                                                    for (let u = 0; u < glUniform.array.length; ++u) {
                                                        const idx = glUniform.begin + u;
                                                        if (CmpF32NotEuqal(gpuBinding.gpuBuffer.vf32[idx], glUniform.array[u])) {
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
                                                    gl.activeTexture(WebGLRenderingContext.TEXTURE0 + texUnit);
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

                                                    if (gpuTexture.isPowerOf2 && gpuTexture.mipLevel > 1) {
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
                                                        gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_S, glWrapS);
                                                        gpuTexture.glWrapS = glWrapS;
                                                    }

                                                    if (gpuTexture.glWrapT !== glWrapT) {
                                                        gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_WRAP_T, glWrapT);
                                                        gpuTexture.glWrapT = glWrapT;
                                                    }

                                                    if (gpuTexture.glMinFilter !== glMinFilter) {
                                                        gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MIN_FILTER, glMinFilter);
                                                        gpuTexture.glMinFilter = glMinFilter;
                                                    }

                                                    if (gpuTexture.glMagFilter !== gpuSampler.glMagFilter) {
                                                        gl.texParameteri(gpuTexture.glTarget, WebGLRenderingContext.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
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
                        const glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram!);
                        if (glVAO) {
                            if (cache.glVAO !== glVAO) {
                                vao.bindVertexArrayOES(glVAO);
                                cache.glVAO = glVAO;
                            }
                        } else {
                            const _glVAO = vao.createVertexArrayOES();
                            gpuInputAssembler.glVAOs.set(gpuShader.glProgram!, _glVAO!);

                            vao.bindVertexArrayOES(_glVAO);
                            cache.glVAO = _glVAO;

                            gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, null);
                            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
                            cache.glArrayBuffer = 0;
                            cache.glElementArrayBuffer = 0;

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
                                        gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, glAttrib.glBuffer);
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
                                if (cache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                                    gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                                    cache.glElementArrayBuffer = gpuBuffer.glBuffer;
                                }
                            }
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
                                    gl.bindBuffer(WebGLRenderingContext.ARRAY_BUFFER, glAttrib.glBuffer);
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
                                gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                                cache.glElementArrayBuffer = gpuBuffer.glBuffer;
                            }
                        }

                        for (let a = 0; a < device.maxVertexAttributes; ++a) {
                            if (cache.glEnabledAttribLocs[a] !== cache.glCurrentAttribLocs[a]) {
                                gl.disableVertexAttribArray(a);
                                cache.glEnabledAttribLocs[a] = false;
                            }
                        }
                    }
                } // if (device.useVAO)

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
                                                gl.stencilMaskSeparate(WebGLRenderingContext.FRONT, cmd2.stencilWriteMask.writeMask);
                                                cache.dss.stencilWriteMaskFront = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.BACK: {
                                            if (cache.dss.stencilWriteMaskBack !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMaskSeparate(WebGLRenderingContext.BACK, cmd2.stencilWriteMask.writeMask);
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
                                                    WebGLRenderingContext.FRONT,
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
                                                    WebGLRenderingContext.BACK,
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
                        if (gpuBuffer && cmd3.drawInfo.indexCount > 0) {
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
        case WebGLRenderingContext.TEXTURE_2D: {
            const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                n = 0;
                for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                    gl.texSubImage2D(WebGLRenderingContext.TEXTURE_2D, m,
                        region.texOffset.x, region.texOffset.y,
                        gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
                }
            }
            break;
        }
        case WebGLRenderingContext.TEXTURE_CUBE_MAP: {
            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                n = 0;
                const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                    const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                    for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                        gl.texSubImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
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
        case WebGLRenderingContext.TEXTURE_2D: {
            const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                n = 0;
                w = region.texExtent.width;
                h = region.texExtent.height;

                for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                    const pixels = !fmtInfo.isFloating ? new Uint8Array(buffers[n++]) : new Float32Array(buffers[n++]);

                    if (!isCompressed) {
                        gl.texSubImage2D(WebGLRenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, gpuTexture.glType, pixels);
                    } else {
                        gl.compressedTexSubImage2D(WebGLRenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, pixels);
                    }

                    w = Math.max(1, w >> 1);
                    h = Math.max(1, w >> 1);
                }
            }
            break;
        }
        case WebGLRenderingContext.TEXTURE_CUBE_MAP: {
            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGLRenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            for (const region of regions) {
                n = 0;
                const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                    w = region.texExtent.width;
                    h = region.texExtent.height;

                    const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                    for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                        const pixels = !fmtInfo.isFloating ? new Uint8Array(buffers[n++]) : new Float32Array(buffers[n++]);

                        gl.texSubImage2D(WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, gpuTexture.glType, pixels);

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
