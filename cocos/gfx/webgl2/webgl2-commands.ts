import { CachedArray } from '../../core/memop/cached-array';
import { GFXBufferSource, IGFXDrawInfo, IGFXIndirectBuffer } from '../buffer';
import {
    GFXBindingType,
    GFXBufferTextureCopy,
    GFXBufferUsageBit,
    GFXColorMask,
    GFXCullMode,
    GFXDynamicState,
    GFXFilter,
    GFXFormat,
    GFXFormatInfos,
    GFXFormatSize,
    GFXLoadOp,
    GFXMemoryUsageBit,
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
import { WebGL2GFXCommandAllocator } from './webgl2-command-allocator';
import {
    IWebGL2DepthBias,
    IWebGL2DepthBounds,
    IWebGL2StencilCompareMask,
    IWebGL2StencilWriteMask,
} from './webgl2-command-buffer';
import { WebGL2GFXDevice } from './webgl2-device';
import {
    IWebGL2GPUUniform,
    WebGL2Attrib,
    WebGL2GPUBindingLayout,
    WebGL2GPUBuffer,
    WebGL2GPUFramebuffer,
    WebGL2GPUInput,
    WebGL2GPUInputAssembler,
    WebGL2GPUPipelineState,
    WebGL2GPUSampler,
    WebGL2GPUShader,
    WebGL2GPUTexture,
    WebGL2GPUUniformBlock,
    WebGL2GPUUniformSampler,
} from './webgl2-gpu-objects';
import { IWebGL2TexUnit } from './webgl2-state-cache';

const WebGLWraps: GLenum[] = [
    WebGLRenderingContext.REPEAT,
    WebGLRenderingContext.MIRRORED_REPEAT,
    WebGLRenderingContext.CLAMP_TO_EDGE,
    WebGLRenderingContext.CLAMP_TO_EDGE,
];

const _uniformValues = new Array<number>(1024 * 4);
const _f32v4 = new Float32Array(4);

// tslint:disable: max-line-length

function CmpF32NotEuqal (a: number, b: number): boolean {
    const c = a - b;
    return (c > 0.000001 || c < -0.000001);
}

function GFXFormatToWebGLType (format: GFXFormat, device: WebGL2GFXDevice): GLenum {
    switch (format) {
        case GFXFormat.R8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8SN: return WebGL2RenderingContext.BYTE;
        case GFXFormat.R8UI: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.R8I: return WebGL2RenderingContext.BYTE;
        case GFXFormat.R16F: return WebGL2RenderingContext.HALF_FLOAT;
        case GFXFormat.R16UI: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.R16I: return WebGL2RenderingContext.SHORT;
        case GFXFormat.R32F: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.R32UI: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.R32I: return WebGL2RenderingContext.INT;

        case GFXFormat.RG8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8SN: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RG8UI: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RG8I: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RG16F: return WebGL2RenderingContext.HALF_FLOAT;
        case GFXFormat.RG16UI: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RG16I: return WebGL2RenderingContext.SHORT;
        case GFXFormat.RG32F: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.RG32UI: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.RG32I: return WebGL2RenderingContext.INT;

        case GFXFormat.RGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8SN: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RGB8UI: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB8I: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RGB16F: return WebGL2RenderingContext.HALF_FLOAT;
        case GFXFormat.RGB16UI: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RGB16I: return WebGL2RenderingContext.SHORT;
        case GFXFormat.RGB32F: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.RGB32UI: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB32I: return WebGL2RenderingContext.INT;

        case GFXFormat.RGBA8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.SRGB8_A8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8SN: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RGBA8UI: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGBA8I: return WebGL2RenderingContext.BYTE;
        case GFXFormat.RGBA16F: return WebGL2RenderingContext.HALF_FLOAT;
        case GFXFormat.RGBA16UI: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.RGBA16I: return WebGL2RenderingContext.SHORT;
        case GFXFormat.RGBA32F: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.RGBA32UI: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.RGBA32I: return WebGL2RenderingContext.INT;

        case GFXFormat.R5G6B5: return WebGL2RenderingContext.UNSIGNED_SHORT_5_6_5;
        case GFXFormat.R11G11B10F: return WebGL2RenderingContext.UNSIGNED_INT_10F_11F_11F_REV;
        case GFXFormat.RGB5A1: return WebGL2RenderingContext.UNSIGNED_SHORT_5_5_5_1;
        case GFXFormat.RGBA4: return WebGL2RenderingContext.UNSIGNED_SHORT_4_4_4_4;
        case GFXFormat.RGB10A2: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.RGB10A2UI: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.RGB9E5: return WebGL2RenderingContext.FLOAT;

        case GFXFormat.D16: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D16S8: return WebGL2RenderingContext.UNSIGNED_SHORT;
        case GFXFormat.D24: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXFormat.D24S8: return WebGL2RenderingContext.UNSIGNED_INT_24_8;
        case GFXFormat.D32F: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.D32F_S8: return WebGL2RenderingContext.FLOAT_32_UNSIGNED_INT_24_8_REV;

        case GFXFormat.BC1: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC1_SRGB: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC2_SRGB: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC3_SRGB: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC4_SNORM: return WebGL2RenderingContext.BYTE;
        case GFXFormat.BC5: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC5_SNORM: return WebGL2RenderingContext.BYTE;
        case GFXFormat.BC6H_SF16: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.BC6H_UF16: return WebGL2RenderingContext.FLOAT;
        case GFXFormat.BC7: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.BC7_SRGB: return WebGL2RenderingContext.UNSIGNED_BYTE;

        case GFXFormat.ETC_RGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8_A1: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8_A1: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_RGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.ETC2_SRGB8: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_R11SN: return WebGL2RenderingContext.BYTE;
        case GFXFormat.EAC_RG11: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.EAC_RG11SN: return WebGL2RenderingContext.BYTE;

        case GFXFormat.PVRTC_RGB2: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA2: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGB4: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC_RGBA4: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_2BPP: return WebGL2RenderingContext.UNSIGNED_BYTE;
        case GFXFormat.PVRTC2_4BPP: return WebGL2RenderingContext.UNSIGNED_BYTE;

        default: {
            return WebGL2RenderingContext.UNSIGNED_BYTE;
        }
    }
}

function GFXFormatToWebGLInternalFormat (format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGL2RenderingContext.ALPHA;
        case GFXFormat.L8: return WebGL2RenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGL2RenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.R8: return WebGL2RenderingContext.R8;
        case GFXFormat.R8SN: return WebGL2RenderingContext.R8_SNORM;
        case GFXFormat.R8UI: return WebGL2RenderingContext.R8UI;
        case GFXFormat.R8I: return WebGL2RenderingContext.R8I;
        case GFXFormat.RG8: return WebGL2RenderingContext.RG8;
        case GFXFormat.RG8SN: return WebGL2RenderingContext.RG8_SNORM;
        case GFXFormat.RG8UI: return WebGL2RenderingContext.RG8UI;
        case GFXFormat.RG8I: return WebGL2RenderingContext.RG8I;
        case GFXFormat.RGB8: return WebGL2RenderingContext.RGB8;
        case GFXFormat.RGB8SN: return WebGL2RenderingContext.RGB8_SNORM;
        case GFXFormat.RGB8UI: return WebGL2RenderingContext.RGB8UI;
        case GFXFormat.RGB8I: return WebGL2RenderingContext.RGB8I;
        case GFXFormat.RGBA8: return WebGL2RenderingContext.RGBA;
        case GFXFormat.RGBA8SN: return WebGL2RenderingContext.RGBA8_SNORM;
        case GFXFormat.RGBA8UI: return WebGL2RenderingContext.RGBA8UI;
        case GFXFormat.RGBA8I: return WebGL2RenderingContext.RGBA8I;
        case GFXFormat.R16I: return WebGL2RenderingContext.R16I;
        case GFXFormat.R16UI: return WebGL2RenderingContext.R16UI;
        case GFXFormat.R16F: return WebGL2RenderingContext.R16F;
        case GFXFormat.RG16I: return WebGL2RenderingContext.RG16I;
        case GFXFormat.RG16UI: return WebGL2RenderingContext.RG16UI;
        case GFXFormat.RG16F: return WebGL2RenderingContext.RG16F;
        case GFXFormat.RGB16I: return WebGL2RenderingContext.RGB16I;
        case GFXFormat.RGB16UI: return WebGL2RenderingContext.RGB16UI;
        case GFXFormat.RGB16F: return WebGL2RenderingContext.RGB16F;
        case GFXFormat.RGBA16I: return WebGL2RenderingContext.RGBA16I;
        case GFXFormat.RGBA16UI: return WebGL2RenderingContext.RGBA16UI;
        case GFXFormat.RGBA16F: return WebGL2RenderingContext.RGBA16F;
        case GFXFormat.R32I: return WebGL2RenderingContext.R32I;
        case GFXFormat.R32UI: return WebGL2RenderingContext.R32UI;
        case GFXFormat.R32F: return WebGL2RenderingContext.R32F;
        case GFXFormat.RG32I: return WebGL2RenderingContext.RG32I;
        case GFXFormat.RG32UI: return WebGL2RenderingContext.RG32UI;
        case GFXFormat.RG32F: return WebGL2RenderingContext.RG32F;
        case GFXFormat.RGB32I: return WebGL2RenderingContext.RGB32I;
        case GFXFormat.RGB32UI: return WebGL2RenderingContext.RGB32UI;
        case GFXFormat.RGB32F: return WebGL2RenderingContext.RGB32F;
        case GFXFormat.RGBA32I: return WebGL2RenderingContext.RGBA32I;
        case GFXFormat.RGBA32UI: return WebGL2RenderingContext.RGBA32UI;
        case GFXFormat.RGBA32F: return WebGL2RenderingContext.RGBA32F;
        case GFXFormat.R5G6B5: return WebGL2RenderingContext.RGB565;
        case GFXFormat.RGB5A1: return WebGL2RenderingContext.RGB5_A1;
        case GFXFormat.RGBA4: return WebGL2RenderingContext.RGBA4;
        case GFXFormat.RGB10A2: return WebGL2RenderingContext.RGB10_A2;
        case GFXFormat.RGB10A2UI: return WebGL2RenderingContext.RGB10_A2UI;
        case GFXFormat.R11G11B10F: return WebGL2RenderingContext.R11F_G11F_B10F;
        case GFXFormat.D16: return WebGL2RenderingContext.DEPTH_COMPONENT16;
        case GFXFormat.D16S8: return WebGL2RenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGL2RenderingContext.DEPTH_COMPONENT24;
        case GFXFormat.D24S8: return WebGL2RenderingContext.DEPTH24_STENCIL8;
        case GFXFormat.D32F: return WebGL2RenderingContext.DEPTH_COMPONENT32F;
        case GFXFormat.D32F_S8: return WebGL2RenderingContext.DEPTH32F_STENCIL8;

        case GFXFormat.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
        case GFXFormat.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
        case GFXFormat.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        case GFXFormat.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
        case GFXFormat.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        case GFXFormat.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

        case GFXFormat.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;
        case GFXFormat.ETC2_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;

        case GFXFormat.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        case GFXFormat.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        case GFXFormat.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

        default: {
            console.error('Unsupported GFXFormat, convert to WebGL internal format failed.');
            return WebGL2RenderingContext.RGBA;
        }
    }
}

function GFXFormatToWebGLFormat (format: GFXFormat): GLenum {
    switch (format) {
        case GFXFormat.A8: return WebGL2RenderingContext.ALPHA;
        case GFXFormat.L8: return WebGL2RenderingContext.LUMINANCE;
        case GFXFormat.LA8: return WebGL2RenderingContext.LUMINANCE_ALPHA;
        case GFXFormat.R8:
        case GFXFormat.R8SN:
        case GFXFormat.R8UI:
        case GFXFormat.R8I: return WebGL2RenderingContext.RED;
        case GFXFormat.RG8:
        case GFXFormat.RG8SN:
        case GFXFormat.RG8UI:
        case GFXFormat.RG8I: return WebGL2RenderingContext.RG;
        case GFXFormat.RGB8:
        case GFXFormat.RGB8SN:
        case GFXFormat.RGB8UI:
        case GFXFormat.RGB8I: return WebGL2RenderingContext.RGB;
        case GFXFormat.RGBA8:
        case GFXFormat.RGBA8SN:
        case GFXFormat.RGBA8UI:
        case GFXFormat.RGBA8I: return WebGL2RenderingContext.RGBA;
        case GFXFormat.R16UI:
        case GFXFormat.R16I:
        case GFXFormat.R16F: return WebGL2RenderingContext.RED;
        case GFXFormat.RG16UI:
        case GFXFormat.RG16I:
        case GFXFormat.RG16F: return WebGL2RenderingContext.RG;
        case GFXFormat.RGB16UI:
        case GFXFormat.RGB16I:
        case GFXFormat.RGB16F: return WebGL2RenderingContext.RGB;
        case GFXFormat.RGBA16UI:
        case GFXFormat.RGBA16I:
        case GFXFormat.RGBA16F: return WebGL2RenderingContext.RGBA;
        case GFXFormat.R32UI:
        case GFXFormat.R32I:
        case GFXFormat.R32F: return WebGL2RenderingContext.RED;
        case GFXFormat.RG32UI:
        case GFXFormat.RG32I:
        case GFXFormat.RG32F: return WebGL2RenderingContext.RG;
        case GFXFormat.RGB32UI:
        case GFXFormat.RGB32I:
        case GFXFormat.RGB32F: return WebGL2RenderingContext.RGB;
        case GFXFormat.RGBA32UI:
        case GFXFormat.RGBA32I:
        case GFXFormat.RGBA32F: return WebGL2RenderingContext.RGBA;
        case GFXFormat.RGB10A2: return WebGL2RenderingContext.RGBA;
        case GFXFormat.R11G11B10F: return WebGL2RenderingContext.RGB;
        case GFXFormat.R5G6B5: return WebGL2RenderingContext.RGB;
        case GFXFormat.RGB5A1: return WebGL2RenderingContext.RGBA;
        case GFXFormat.RGBA4: return WebGL2RenderingContext.RGBA;
        case GFXFormat.D16: return WebGL2RenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D16S8: return WebGL2RenderingContext.DEPTH_STENCIL;
        case GFXFormat.D24: return WebGL2RenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D24S8: return WebGL2RenderingContext.DEPTH_STENCIL;
        case GFXFormat.D32F: return WebGL2RenderingContext.DEPTH_COMPONENT;
        case GFXFormat.D32F_S8: return WebGL2RenderingContext.DEPTH_STENCIL;

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
            console.error('Unsupported GFXFormat, convert to WebGL format failed.');
            return WebGL2RenderingContext.RGBA;
        }
    }
}

function GFXTypeToWebGLType (type: GFXType): GLenum {
    switch (type) {
        case GFXType.BOOL: return WebGL2RenderingContext.BOOL;
        case GFXType.BOOL2: return WebGL2RenderingContext.BOOL_VEC2;
        case GFXType.BOOL3: return WebGL2RenderingContext.BOOL_VEC3;
        case GFXType.BOOL4: return WebGL2RenderingContext.BOOL_VEC4;
        case GFXType.INT: return WebGL2RenderingContext.INT;
        case GFXType.INT2: return WebGL2RenderingContext.INT_VEC2;
        case GFXType.INT3: return WebGL2RenderingContext.INT_VEC3;
        case GFXType.INT4: return WebGL2RenderingContext.INT_VEC4;
        case GFXType.UINT: return WebGL2RenderingContext.UNSIGNED_INT;
        case GFXType.FLOAT: return WebGL2RenderingContext.FLOAT;
        case GFXType.FLOAT2: return WebGL2RenderingContext.FLOAT_VEC2;
        case GFXType.FLOAT3: return WebGL2RenderingContext.FLOAT_VEC3;
        case GFXType.FLOAT4: return WebGL2RenderingContext.FLOAT_VEC4;
        case GFXType.COLOR4: return WebGL2RenderingContext.FLOAT_VEC4;
        case GFXType.MAT2: return WebGL2RenderingContext.FLOAT_MAT2;
        case GFXType.MAT2X3: return WebGL2RenderingContext.FLOAT_MAT2x3;
        case GFXType.MAT2X4: return WebGL2RenderingContext.FLOAT_MAT2x4;
        case GFXType.MAT3X2: return WebGL2RenderingContext.FLOAT_MAT3x2;
        case GFXType.MAT3: return WebGL2RenderingContext.FLOAT_MAT3;
        case GFXType.MAT3X4: return WebGL2RenderingContext.FLOAT_MAT3x4;
        case GFXType.MAT4X2: return WebGL2RenderingContext.FLOAT_MAT4x2;
        case GFXType.MAT4X3: return WebGL2RenderingContext.FLOAT_MAT4x3;
        case GFXType.MAT4: return WebGL2RenderingContext.FLOAT_MAT4;
        case GFXType.SAMPLER2D: return WebGL2RenderingContext.SAMPLER_2D;
        case GFXType.SAMPLER2D_ARRAY: return WebGL2RenderingContext.SAMPLER_2D_ARRAY;
        case GFXType.SAMPLER3D: return WebGL2RenderingContext.SAMPLER_3D;
        case GFXType.SAMPLER_CUBE: return WebGL2RenderingContext.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GL type failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLTypeToGFXType (glType: GLenum): GFXType {
    switch (glType) {
        case WebGL2RenderingContext.BOOL: return GFXType.BOOL;
        case WebGL2RenderingContext.BOOL_VEC2: return GFXType.BOOL2;
        case WebGL2RenderingContext.BOOL_VEC3: return GFXType.BOOL3;
        case WebGL2RenderingContext.BOOL_VEC4: return GFXType.BOOL4;
        case WebGL2RenderingContext.INT: return GFXType.INT;
        case WebGL2RenderingContext.INT_VEC2: return GFXType.INT2;
        case WebGL2RenderingContext.INT_VEC3: return GFXType.INT3;
        case WebGL2RenderingContext.INT_VEC4: return GFXType.INT4;
        case WebGL2RenderingContext.UNSIGNED_INT: return GFXType.UINT;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC2: return GFXType.UINT2;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC3: return GFXType.UINT3;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC4: return GFXType.UINT4;
        case WebGL2RenderingContext.UNSIGNED_INT: return GFXType.UINT;
        case WebGL2RenderingContext.FLOAT: return GFXType.FLOAT;
        case WebGL2RenderingContext.FLOAT_VEC2: return GFXType.FLOAT2;
        case WebGL2RenderingContext.FLOAT_VEC3: return GFXType.FLOAT3;
        case WebGL2RenderingContext.FLOAT_VEC4: return GFXType.FLOAT4;
        case WebGL2RenderingContext.FLOAT_MAT2: return GFXType.MAT2;
        case WebGL2RenderingContext.FLOAT_MAT2x3: return GFXType.MAT2X3;
        case WebGL2RenderingContext.FLOAT_MAT2x4: return GFXType.MAT2X4;
        case WebGL2RenderingContext.FLOAT_MAT3x2: return GFXType.MAT3X2;
        case WebGL2RenderingContext.FLOAT_MAT3: return GFXType.MAT3;
        case WebGL2RenderingContext.FLOAT_MAT3x4: return GFXType.MAT3X4;
        case WebGL2RenderingContext.FLOAT_MAT4x2: return GFXType.MAT4X2;
        case WebGL2RenderingContext.FLOAT_MAT4x3: return GFXType.MAT4X3;
        case WebGL2RenderingContext.FLOAT_MAT4: return GFXType.MAT4;
        case WebGL2RenderingContext.SAMPLER_2D: return GFXType.SAMPLER2D;
        case WebGL2RenderingContext.SAMPLER_2D_ARRAY: return GFXType.SAMPLER2D_ARRAY;
        case WebGL2RenderingContext.SAMPLER_3D: return GFXType.SAMPLER3D;
        case WebGL2RenderingContext.SAMPLER_CUBE: return GFXType.SAMPLER_CUBE;
        default: {
            console.error('Unsupported GLType, convert to GFXType failed.');
            return GFXType.UNKNOWN;
        }
    }
}

function WebGLGetTypeSize (glType: GLenum): GFXType {
    switch (glType) {
        case WebGL2RenderingContext.BOOL: return 4;
        case WebGL2RenderingContext.BOOL_VEC2: return 8;
        case WebGL2RenderingContext.BOOL_VEC3: return 12;
        case WebGL2RenderingContext.BOOL_VEC4: return 16;
        case WebGL2RenderingContext.INT: return 4;
        case WebGL2RenderingContext.INT_VEC2: return 8;
        case WebGL2RenderingContext.INT_VEC3: return 12;
        case WebGL2RenderingContext.INT_VEC4: return 16;
        case WebGL2RenderingContext.UNSIGNED_INT: return 4;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC2: return 8;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC3: return 12;
        case WebGL2RenderingContext.UNSIGNED_INT_VEC4: return 16;
        case WebGL2RenderingContext.FLOAT: return 4;
        case WebGL2RenderingContext.FLOAT_VEC2: return 8;
        case WebGL2RenderingContext.FLOAT_VEC3: return 12;
        case WebGL2RenderingContext.FLOAT_VEC4: return 16;
        case WebGL2RenderingContext.FLOAT_MAT2: return 16;
        case WebGL2RenderingContext.FLOAT_MAT2x3: return 24;
        case WebGL2RenderingContext.FLOAT_MAT2x4: return 32;
        case WebGL2RenderingContext.FLOAT_MAT3x2: return 24;
        case WebGL2RenderingContext.FLOAT_MAT3: return 36;
        case WebGL2RenderingContext.FLOAT_MAT3x4: return 48;
        case WebGL2RenderingContext.FLOAT_MAT4x2: return 32;
        case WebGL2RenderingContext.FLOAT_MAT4x3: return 48;
        case WebGL2RenderingContext.FLOAT_MAT4: return 64;
        case WebGL2RenderingContext.SAMPLER_2D: return 4;
        case WebGL2RenderingContext.SAMPLER_2D_ARRAY: return 4;
        case WebGL2RenderingContext.SAMPLER_2D_ARRAY_SHADOW: return 4;
        case WebGL2RenderingContext.SAMPLER_3D: return 4;
        case WebGL2RenderingContext.SAMPLER_CUBE: return 4;
        case WebGL2RenderingContext.INT_SAMPLER_2D: return 4;
        case WebGL2RenderingContext.INT_SAMPLER_2D_ARRAY: return 4;
        case WebGL2RenderingContext.INT_SAMPLER_3D: return 4;
        case WebGL2RenderingContext.INT_SAMPLER_CUBE: return 4;
        case WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_2D: return 4;
        case WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_2D_ARRAY: return 4;
        case WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_3D: return 4;
        case WebGL2RenderingContext.UNSIGNED_INT_SAMPLER_CUBE: return 4;
        default: {
            console.error('Unsupported GLType, get type failed.');
            return 0;
        }
    }
}

function WebGLGetComponentCount (glType: GLenum): GFXType {
    switch (glType) {
        case WebGL2RenderingContext.FLOAT_MAT2: return 2;
        case WebGL2RenderingContext.FLOAT_MAT2x3: return 2;
        case WebGL2RenderingContext.FLOAT_MAT2x4: return 2;
        case WebGL2RenderingContext.FLOAT_MAT3x2: return 3;
        case WebGL2RenderingContext.FLOAT_MAT3: return 3;
        case WebGL2RenderingContext.FLOAT_MAT3x4: return 3;
        case WebGL2RenderingContext.FLOAT_MAT4x2: return 4;
        case WebGL2RenderingContext.FLOAT_MAT4x3: return 4;
        case WebGL2RenderingContext.FLOAT_MAT4: return 4;
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

export enum WebGL2Cmd {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_STATES,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    COUNT,
}

export abstract class WebGL2CmdObject {
    public cmdType: WebGL2Cmd;
    public refCount: number = 0;

    constructor (type: WebGL2Cmd) {
        this.cmdType = type;
    }

    public abstract clear ();
}

export class WebGL2CmdBeginRenderPass extends WebGL2CmdObject {

    public gpuFramebuffer: WebGL2GPUFramebuffer | null = null;
    public renderArea: IGFXRect = { x: 0, y: 0, width: 0, height: 0 };
    public clearColors: IGFXColor[] = [];
    public clearDepth: number = 1.0;
    public clearStencil: number = 0;

    constructor () {
        super(WebGL2Cmd.BEGIN_RENDER_PASS);
    }

    public clear () {
        this.gpuFramebuffer = null;
        this.clearColors = [];
    }
}

export class WebGL2CmdBindStates extends WebGL2CmdObject {

    public gpuPipelineState: WebGL2GPUPipelineState | null = null;
    public gpuBindingLayout: WebGL2GPUBindingLayout | null = null;
    public gpuInputAssembler: WebGL2GPUInputAssembler | null = null;
    public viewport: IGFXViewport | null = null;
    public scissor: IGFXRect | null = null;
    public lineWidth: number | null = null;
    public depthBias: IWebGL2DepthBias | null = null;
    public blendConstants: number[] | null = null;
    public depthBounds: IWebGL2DepthBounds | null = null;
    public stencilWriteMask: IWebGL2StencilWriteMask | null = null;
    public stencilCompareMask: IWebGL2StencilCompareMask | null = null;

    constructor () {
        super(WebGL2Cmd.BIND_STATES);
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

export class WebGL2CmdDraw extends WebGL2CmdObject {

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
        super(WebGL2Cmd.DRAW);
    }

    public clear () {
    }
}

export class WebGL2CmdUpdateBuffer extends WebGL2CmdObject {

    public gpuBuffer: WebGL2GPUBuffer | null = null;
    public buffer: GFXBufferSource | null = null;
    public offset: number = 0;
    public size: number = 0;

    constructor () {
        super(WebGL2Cmd.UPDATE_BUFFER);
    }

    public clear () {
        this.gpuBuffer = null;
        this.buffer = null;
    }
}

export class WebGL2GFXTextureSubres {
    public baseMipLevel: number = 0;
    public levelCount: number = 1;
    public baseArrayLayer: number = 0;
    public layerCount: number = 1;
}

export class WebGL2GFXBufferTextureCopy {
    public buffOffset: number = 0;
    public buffStride: number = 0;
    public buffTexHeight: number = 0;
    public texOffset: number[] = [0, 0, 0];
    public texExtent: number[] = [0, 0, 0];
    public texSubres: WebGL2GFXTextureSubres = new WebGL2GFXTextureSubres();
}

export class WebGL2CmdCopyBufferToTexture extends WebGL2CmdObject {

    public gpuBuffer: WebGL2GPUBuffer | null = null;
    public gpuTexture: WebGL2GPUTexture | null = null;
    public dstLayout: GFXTextureLayout | null = null;
    public regions: GFXBufferTextureCopy[] = [];

    constructor () {
        super(WebGL2Cmd.COPY_BUFFER_TO_TEXTURE);
    }

    public clear () {
        this.gpuBuffer = null;
        this.gpuTexture = null;
        this.dstLayout = null;
        this.regions = [];
    }
}

export class WebGL2CmdPackage {
    public cmds: CachedArray<WebGL2Cmd> = new CachedArray(1);
    public beginRenderPassCmds: CachedArray<WebGL2CmdBeginRenderPass> = new CachedArray(1);
    public bindStatesCmds: CachedArray<WebGL2CmdBindStates> = new CachedArray(1);
    public drawCmds: CachedArray<WebGL2CmdDraw> = new CachedArray(1);
    public updateBufferCmds: CachedArray<WebGL2CmdUpdateBuffer> = new CachedArray(1);
    public copyBufferToTextureCmds: CachedArray<WebGL2CmdCopyBufferToTexture> = new CachedArray(1);

    public clearCmds (allocator: WebGL2GFXCommandAllocator) {

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

export function WebGL2CmdFuncCreateBuffer (device: WebGL2GFXDevice, gpuBuffer: WebGL2GPUBuffer) {

    const gl = device.gl;
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? WebGL2RenderingContext.DYNAMIC_DRAW : WebGL2RenderingContext.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {

        gpuBuffer.glTarget = WebGL2RenderingContext.ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();

        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);

                gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
                device.stateCache.glArrayBuffer = 0;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {

        gpuBuffer.glTarget = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }

                gl.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);

                gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
                device.stateCache.glElementArrayBuffer = 0;
            }
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {

        gpuBuffer.glTarget = WebGL2RenderingContext.UNIFORM_BUFFER;
        const glBuffer = gl.createBuffer();
        if (glBuffer && gpuBuffer.size > 0) {
            gpuBuffer.glBuffer = glBuffer;
            if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glUniformBuffer = gpuBuffer.glBuffer;
            }

            gl.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, gpuBuffer.size, glUsage);

            gl.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, null);
            device.stateCache.glUniformBuffer = 0;
        }
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    }
}

export function WebGL2CmdFuncDestroyBuffer (device: WebGL2GFXDevice, gpuBuffer: WebGL2GPUBuffer) {
    if (gpuBuffer.glBuffer > 0) {
        device.gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = 0;
    }
}

export function WebGL2CmdFuncResizeBuffer (device: WebGL2GFXDevice, gpuBuffer: WebGL2GPUBuffer) {

    const gl = device.gl;
    const glUsage: GLenum = gpuBuffer.memUsage & GFXMemoryUsageBit.HOST ? WebGL2RenderingContext.DYNAMIC_DRAW : WebGL2RenderingContext.STATIC_DRAW;

    if (gpuBuffer.usage & GFXBufferUsageBit.VERTEX) {

        if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(WebGL2RenderingContext.ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, null);
        device.stateCache.glArrayBuffer = 0;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.INDEX) {

        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, null);
        device.stateCache.glElementArrayBuffer = 0;
    } else if (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) {
        if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(WebGL2RenderingContext.UNIFORM_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, null);
        device.stateCache.glUniformBuffer = 0;
    } else if ((gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_DST) ||
            (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC)) {
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    } else {
        console.error('Unsupported GFXBufferType, create buffer failed.');
        gpuBuffer.glTarget = WebGL2RenderingContext.NONE;
    }
}

export function WebGL2CmdFuncUpdateBuffer (device: WebGL2GFXDevice, gpuBuffer: WebGL2GPUBuffer, buffer: GFXBufferSource, offset: number, size: number) {

    if (gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) {
        gpuBuffer.indirects = (buffer as IGFXIndirectBuffer).drawInfos;
    } else {
        const buff = buffer as ArrayBuffer;
        const gl = device.gl;

        switch (gpuBuffer.glTarget) {
            case WebGL2RenderingContext.ARRAY_BUFFER: {
                if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
                }

                if (size === buff.byteLength) {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
                } else {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
                }
                break;
            }
            case WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER: {
                if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                }

                if (size === buff.byteLength) {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
                } else {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
                }
                break;
            }
            case WebGL2RenderingContext.UNIFORM_BUFFER: {
                if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
                    gl.bindBuffer(WebGL2RenderingContext.UNIFORM_BUFFER, gpuBuffer.glBuffer);
                    device.stateCache.glUniformBuffer = gpuBuffer.glBuffer;
                }

                let buf: Float32Array;
                if (buffer instanceof Float32Array) {
                    buf = buffer;
                } else {
                    buf = new Float32Array(buffer as ArrayBuffer, 0, size / 4);
                }

                if (size === buf.byteLength) {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, buf);
                } else {
                    gl.bufferSubData(gpuBuffer.glTarget, offset, new Float32Array(buff, 0, size / 4));
                }
                break;
            }
            default: {
                console.error('Unsupported GFXBufferType, update buffer failed.');
                return;
            }
        }
    }
}

export function WebGL2CmdFuncCreateTexture (device: WebGL2GFXDevice, gpuTexture: WebGL2GPUTexture) {

    const gl = device.gl;

    gpuTexture.glInternelFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, device);

    switch (gpuTexture.viewType) {
        case GFXTextureViewType.TV2D: {
            gpuTexture.viewType = GFXTextureViewType.TV2D;
            gpuTexture.glTarget = WebGL2RenderingContext.TEXTURE_2D;

            const glTexture = gl.createTexture();
            if (glTexture) {
                gpuTexture.glTexture = glTexture;
                const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGL2RenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                let w = gpuTexture.width;
                let h = gpuTexture.height;

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(WebGL2RenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    const view: ArrayBufferView = { buffer: new ArrayBuffer(0), byteLength: 0, byteOffset: 0 };
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.compressedTexImage2D(WebGL2RenderingContext.TEXTURE_2D, i, gpuTexture.glInternelFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                }
            }
            break;
        }
        case GFXTextureViewType.CUBE: {
            gpuTexture.viewType = GFXTextureViewType.CUBE;
            gpuTexture.glTarget = WebGL2RenderingContext.TEXTURE_CUBE_MAP;

            const glTexture = gl.createTexture();
            if (glTexture) {
                gpuTexture.glTexture = glTexture;
                const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(WebGL2RenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (!GFXFormatInfos[gpuTexture.format].isCompressed) {
                    for (let f = 0; f < 6; ++f) {
                        let w = gpuTexture.width;
                        let h = gpuTexture.height;
                        for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                            gl.texImage2D(WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
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
                            gl.compressedTexImage2D(WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternelFmt, w, h, 0, view);
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
            gpuTexture.glTarget = WebGL2RenderingContext.TEXTURE_2D;
        }
    }
}

export function WebGL2CmdFuncDestroyTexture (device: WebGL2GFXDevice, gpuTexture: WebGL2GPUTexture) {
    if (gpuTexture.glTexture > 0) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = 0;
    }
}

export function WebGL2CmdFuncCreateSampler (device: WebGL2GFXDevice, gpuSampler: WebGL2GPUSampler) {

    const gl = device.gl;
    const glSampler = gl.createSampler();
    if (glSampler) {
        if (gpuSampler.minFilter === GFXFilter.LINEAR || gpuSampler.minFilter === GFXFilter.ANISOTROPIC) {
            if (gpuSampler.mipFilter === GFXFilter.LINEAR || gpuSampler.mipFilter === GFXFilter.ANISOTROPIC) {
                gpuSampler.glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (gpuSampler.mipFilter === GFXFilter.POINT) {
                gpuSampler.glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                gpuSampler.glMinFilter = WebGLRenderingContext.LINEAR;
            }
        } else {
            if (gpuSampler.mipFilter === GFXFilter.LINEAR || gpuSampler.mipFilter === GFXFilter.ANISOTROPIC) {
                gpuSampler.glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
            } else if (gpuSampler.mipFilter === GFXFilter.POINT) {
                gpuSampler.glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
            } else {
                gpuSampler.glMinFilter = WebGLRenderingContext.NEAREST;
            }
        }

        if (gpuSampler.magFilter === GFXFilter.LINEAR || gpuSampler.magFilter === GFXFilter.ANISOTROPIC) {
            gpuSampler.glMagFilter = WebGLRenderingContext.LINEAR;
        } else {
            gpuSampler.glMagFilter = WebGLRenderingContext.NEAREST;
        }

        gpuSampler.glWrapS = WebGLWraps[gpuSampler.addressU];
        gpuSampler.glWrapT = WebGLWraps[gpuSampler.addressV];
        gpuSampler.glWrapR = WebGLWraps[gpuSampler.addressW];

        gpuSampler.glSampler = glSampler;
        gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, gpuSampler.glMinFilter);
        gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, gpuSampler.glWrapS);
        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, gpuSampler.glWrapT);
        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, gpuSampler.glWrapR);
        gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_LOD, gpuSampler.minLOD);
        gl.samplerParameteri(glSampler, gl.TEXTURE_MAX_LOD, gpuSampler.maxLOD);
    }
}

export function WebGL2CmdFuncDestroySampler (device: WebGL2GFXDevice, gpuSampler: WebGL2GPUSampler) {
    if (gpuSampler.glSampler) {
        device.gl.deleteSampler(gpuSampler.glSampler);
        gpuSampler.glSampler = 0;
    }
}

export function WebGL2CmdFuncCreateFramebuffer (device: WebGL2GFXDevice, gpuFramebuffer: WebGL2GPUFramebuffer) {

    if (gpuFramebuffer.isOffscreen) {

        const gl = device.gl;
        const attachments: GLenum[] = [];

        const glFramebuffer = gl.createFramebuffer();
        if (glFramebuffer) {
            gpuFramebuffer.glFramebuffer = glFramebuffer;

            if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
                gl.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
                device.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
            }

            for (let i = 0; i < gpuFramebuffer.gpuColorViews.length; ++i) {

                const gpuColorView = gpuFramebuffer.gpuColorViews[i];
                if (gpuColorView) {
                    gl.framebufferTexture2D(
                        WebGL2RenderingContext.FRAMEBUFFER,
                        WebGL2RenderingContext.COLOR_ATTACHMENT0 + i,
                        gpuColorView.gpuTexture.glTarget,
                        gpuColorView.gpuTexture.glTexture,
                        gpuColorView.baseLevel);

                    attachments.push(WebGL2RenderingContext.COLOR_ATTACHMENT0 + i);
                }
            }

            if (gpuFramebuffer.gpuDepthStencilView) {

                const glAttachment = GFXFormatInfos[gpuFramebuffer.gpuDepthStencilView.format].hasStencil ?
                    WebGL2RenderingContext.DEPTH_STENCIL_ATTACHMENT : WebGL2RenderingContext.DEPTH_ATTACHMENT;

                gl.framebufferTexture2D(
                    WebGL2RenderingContext.FRAMEBUFFER,
                    glAttachment,
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTarget,
                    gpuFramebuffer.gpuDepthStencilView.gpuTexture.glTexture,
                    gpuFramebuffer.gpuDepthStencilView.baseLevel);
            }

            gl.drawBuffers(attachments);

            const status = gl.checkFramebufferStatus(WebGL2RenderingContext.FRAMEBUFFER);
            if (status !== WebGL2RenderingContext.FRAMEBUFFER_COMPLETE) {
                switch (status) {
                    case WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_ATTACHMENT: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_ATTACHMENT');
                        break;
                    }
                    case WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT');
                        break;
                    }
                    case WebGL2RenderingContext.FRAMEBUFFER_INCOMPLETE_DIMENSIONS: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_INCOMPLETE_DIMENSIONS');
                        break;
                    }
                    case WebGL2RenderingContext.FRAMEBUFFER_UNSUPPORTED: {
                        console.error('glCheckFramebufferStatus() - FRAMEBUFFER_UNSUPPORTED');
                        break;
                    }
                    default:
                }
            }
        }
    }
}

export function WebGL2CmdFuncDestroyFramebuffer (device: WebGL2GFXDevice, gpuFramebuffer: WebGL2GPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer > 0) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = 0;
    }
}

export function WebGL2CmdFuncCreateShader (device: WebGL2GFXDevice, gpuShader: WebGL2GPUShader) {
    const gl = device.gl;

    for (const gpuStage of gpuShader.gpuStages) {

        let glShaderType: GLenum = 0;
        let shaderTypeStr = '';

        switch (gpuStage.type) {
            case GFXShaderType.VERTEX: {
                shaderTypeStr = 'VertexShader';
                glShaderType = WebGL2RenderingContext.VERTEX_SHADER;
                break;
            }
            case GFXShaderType.FRAGMENT: {
                shaderTypeStr = 'FragmentShader';
                glShaderType = WebGL2RenderingContext.FRAGMENT_SHADER;
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
                gpuStage.glShader = 0;
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
        gl.attachShader(gpuShader.glProgram, gpuStage.glShader);
    }

    gl.linkProgram(gpuShader.glProgram);
    if (gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS)) {
        console.info('Shader \'' + gpuShader.name + '\' compilation successed.');
    } else {
        console.error('Failed to link shader \'' + gpuShader.name + '\'.');
        console.error(gl.getProgramInfoLog(gpuShader.glProgram));

        for (const gpuStage of gpuShader.gpuStages) {
            if (gpuStage.glShader > 0) {
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = 0;
            }
        }
    }

    // parse inputs
    const activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array<WebGL2GPUInput>(activeAttribCount);

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
    const activeBlockCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORM_BLOCKS);
    let blockName: string;
    let blockIdx: number;
    let blockSize: number;
    let blockBinding: number;

    let blockUniformCount: number;
    let uIndices: Uint32Array;
    let indices: number[];
    // let glUniformTypes: GLenum[];
    let glUniformSizes: GLenum[];
    let glUniformOffsets: GLenum[];
    // let glUniformArrayStride: GLint[];
    let glUniformInfo: WebGLActiveInfo | null;

    if (activeBlockCount) {
        gpuShader.glBlocks = new Array<WebGL2GPUUniformBlock>(activeBlockCount);

        for (let b = 0; b < activeBlockCount; ++b) {

            blockName = gl.getActiveUniformBlockName(gpuShader.glProgram, b)!;
            const nameOffset = blockName.indexOf('[');
            if (nameOffset !== -1) {
                blockName = blockName.substr(0, nameOffset);
            }

            // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);
            blockBinding = -1;
            for (const block of gpuShader.blocks) {
                if (block.name === blockName) {
                    blockBinding = block.binding;
                    break;
                }
            }

            if (blockBinding >= 0) {
                // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);
                blockIdx = b;
                blockSize = gl.getActiveUniformBlockParameter(gpuShader.glProgram, blockIdx, gl.UNIFORM_BLOCK_DATA_SIZE);
                blockUniformCount = gl.getActiveUniformBlockParameter(gpuShader.glProgram, blockIdx, gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS);

                gl.uniformBlockBinding(gpuShader.glProgram, blockIdx, blockBinding);

                const glBlock: WebGL2GPUUniformBlock = {
                    binding: blockBinding,
                    idx: blockIdx,
                    name: blockName,
                    size: blockSize,
                    glUniforms: new Array<IWebGL2GPUUniform>(blockUniformCount),
                    glActiveUniforms: [],
                    isUniformPackage: false,
                };

                gpuShader.glBlocks[b] = glBlock;

                uIndices = gl.getActiveUniformBlockParameter(gpuShader.glProgram, blockIdx, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
                indices = new Array(uIndices.length);
                for (let n = 0; n < uIndices.length; ++n) {
                    indices[n] = uIndices[n];
                }

                // glUniformTypes = gl.getActiveUniforms(gpuShader.glProgram, indices, gl.UNIFORM_TYPE);
                glUniformSizes = gl.getActiveUniforms(gpuShader.glProgram, indices, gl.UNIFORM_SIZE);
                glUniformOffsets = gl.getActiveUniforms(gpuShader.glProgram, indices, gl.UNIFORM_OFFSET);
                // glUniformArrayStride = gl.getActiveUniforms(gpuShader.glProgram, indices, gl.UNIFORM_ARRAY_STRIDE);

                for (let u = 0; u < blockUniformCount; ++u) {
                    glUniformInfo = gl.getActiveUniform(gpuShader.glProgram, uIndices[u]);
                    if (glUniformInfo) {
                        const stride = WebGLGetTypeSize(glUniformInfo.type);
                        const size = glUniformSizes[u] * stride;
                        const begin = glUniformOffsets[u] / 4;
                        const count = size / 4;
                        const array = new Array<number>(count);
                        array.fill(0);

                        glBlock.glUniforms[u] = {
                            binding: -1,
                            name: glUniformInfo.name,
                            type: WebGLTypeToGFXType(glUniformInfo.type),
                            stride,
                            count: glUniformInfo.size,
                            size,
                            offset: glUniformOffsets[u],
                            glType: glUniformInfo.type,
                            glLoc: -1,
                            array,
                            begin,
                            isFirst: true,
                        };
                    }
                }
            }
        }
    }

    // create uniform samplers
    if (gpuShader.samplers.length > 0) {
        gpuShader.glSamplers = new Array<WebGL2GPUUniformSampler>(gpuShader.samplers.length);

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

    const glActiveSamplers: WebGL2GPUUniformSampler[] = [];

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

                const isSampler = (uniformInfo.type === WebGL2RenderingContext.SAMPLER_2D) ||
                    (uniformInfo.type === WebGL2RenderingContext.SAMPLER_CUBE);

                if (isSampler) {
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

export function WebGL2CmdFuncDestroyShader (device: WebGL2GFXDevice, gpuShader: WebGL2GPUShader) {

    for (const gpuStage of gpuShader.gpuStages) {
        if (gpuStage.glShader > 0) {
            device.gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = 0;
        }
    }

    if (gpuShader.glProgram > 0) {
        device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = 0;
    }
}

export function WebGL2CmdFuncCreateInputAssember (device: WebGL2GFXDevice, gpuInputAssembler: WebGL2GPUInputAssembler) {

    gpuInputAssembler.glAttribs = new Array<WebGL2Attrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;
        // if (stream < gpuInputAssembler.gpuVertexBuffers.length) {

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

export function WebGL2CmdFuncDestroyInputAssembler (device: WebGL2GFXDevice, gpuInputAssembler: WebGL2GPUInputAssembler) {
}

const cmdIds = new Array<number>(WebGL2Cmd.COUNT);
export function WebGL2CmdFuncExecuteCmds (device: WebGL2GFXDevice, cmdPackage: WebGL2CmdPackage) {

    const gl = device.gl;
    cmdIds.fill(0);

    let gpuPipelineState: WebGL2GPUPipelineState | null = null;
    let gpuShader: WebGL2GPUShader | null = null;
    let gpuInputAssembler: WebGL2GPUInputAssembler | null = null;
    let glPrimitive = WebGL2RenderingContext.TRIANGLES;

    for (let i = 0; i < cmdPackage.cmds.length; ++i) {
        const cmd = cmdPackage.cmds.array[i];
        const cmdId = cmdIds[cmd]++;

        switch (cmd) {
            case WebGL2Cmd.BEGIN_RENDER_PASS: {
                const cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];

                let clears: GLbitfield = 0;

                if (cmd0.gpuFramebuffer) {
                    if (device.stateCache.glFramebuffer !== cmd0.gpuFramebuffer.glFramebuffer) {
                        const glFBO = (cmd0.gpuFramebuffer.glFramebuffer !== 0 ? cmd0.gpuFramebuffer.glFramebuffer : null);
                        gl.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, glFBO);
                        device.stateCache.glFramebuffer = cmd0.gpuFramebuffer.glFramebuffer;
                    }

                    if (device.stateCache.viewport.left !== cmd0.renderArea.x ||
                        device.stateCache.viewport.top !== cmd0.renderArea.y ||
                        device.stateCache.viewport.width !== cmd0.renderArea.width ||
                        device.stateCache.viewport.height !== cmd0.renderArea.height) {

                        gl.viewport(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        device.stateCache.viewport.left = cmd0.renderArea.x;
                        device.stateCache.viewport.top = cmd0.renderArea.y;
                        device.stateCache.viewport.width = cmd0.renderArea.width;
                        device.stateCache.viewport.height = cmd0.renderArea.height;
                    }

                    if (device.stateCache.scissorRect.x !== cmd0.renderArea.x ||
                        device.stateCache.scissorRect.y !== cmd0.renderArea.y ||
                        device.stateCache.scissorRect.width !== cmd0.renderArea.width ||
                        device.stateCache.scissorRect.height !== cmd0.renderArea.height) {

                        gl.scissor(cmd0.renderArea.x, cmd0.renderArea.y, cmd0.renderArea.width, cmd0.renderArea.height);

                        device.stateCache.scissorRect.x = cmd0.renderArea.x;
                        device.stateCache.scissorRect.y = cmd0.renderArea.y;
                        device.stateCache.scissorRect.width = cmd0.renderArea.width;
                        device.stateCache.scissorRect.height = cmd0.renderArea.height;
                    }

                    const curGPURenderPass = cmd0.gpuFramebuffer.gpuRenderPass;
                    const invalidateAttachments: GLenum[] = [];

                    for (let j = 0; j < cmd0.clearColors.length; ++j) {
                        const colorAttachment = curGPURenderPass.colorAttachments[j];

                        if (colorAttachment.format !== GFXFormat.UNKNOWN) {
                            switch (colorAttachment.loadOp) {
                                case GFXLoadOp.LOAD: break; // GL default behaviour
                                case GFXLoadOp.CLEAR: {

                                    if (device.stateCache.bs.targets[0].blendColorMask !== GFXColorMask.ALL) {
                                        gl.colorMask(true, true, true, true);
                                    }

                                    if (!cmd0.gpuFramebuffer.isOffscreen) {
                                        const clearColor = cmd0.clearColors[0];
                                        gl.clearColor(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
                                        clears |= WebGL2RenderingContext.COLOR_BUFFER_BIT;
                                    } else {
                                        _f32v4[0] = cmd0.clearColors[j].r;
                                        _f32v4[1] = cmd0.clearColors[j].g;
                                        _f32v4[2] = cmd0.clearColors[j].b;
                                        _f32v4[3] = cmd0.clearColors[j].a;
                                        gl.clearBufferfv(gl.COLOR, j, _f32v4);
                                    }

                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    invalidateAttachments.push(WebGL2RenderingContext.COLOR_ATTACHMENT0 + j);
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

                                    if (!device.stateCache.dss.depthWrite) {
                                        gl.depthMask(true);
                                    }

                                    gl.clearDepth(cmd0.clearDepth);

                                    clears |= WebGL2RenderingContext.DEPTH_BUFFER_BIT;

                                    break;
                                }
                                case GFXLoadOp.DISCARD: {
                                    // invalidate the framebuffer
                                    invalidateAttachments.push(WebGL2RenderingContext.DEPTH_ATTACHMENT);
                                    break;
                                }
                                default:
                            }

                            if (GFXFormatInfos[curGPURenderPass.depthStencilAttachment.format].hasStencil) {
                                switch (curGPURenderPass.depthStencilAttachment.stencilLoadOp) {
                                    case GFXLoadOp.LOAD: break; // GL default behaviour
                                    case GFXLoadOp.CLEAR: {

                                        if (!device.stateCache.dss.stencilWriteMaskFront) {
                                            gl.stencilMaskSeparate(WebGL2RenderingContext.FRONT, 0xFFFFFFFF);
                                        }

                                        if (!device.stateCache.dss.stencilWriteMaskBack) {
                                            gl.stencilMaskSeparate(WebGL2RenderingContext.BACK, 0xFFFFFFFF);
                                        }

                                        gl.clearStencil(cmd0.clearStencil);
                                        clears |= WebGL2RenderingContext.STENCIL_BUFFER_BIT;

                                        break;
                                    }
                                    case GFXLoadOp.DISCARD: {
                                        // invalidate the framebuffer
                                        invalidateAttachments.push(WebGL2RenderingContext.STENCIL_ATTACHMENT);
                                        break;
                                    }
                                    default:
                                }
                            }
                        }
                    } // if (curGPURenderPass.depthStencilAttachment)

                    if (invalidateAttachments.length) {
                        gl.invalidateFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, invalidateAttachments);
                    }

                    if (clears) {
                        gl.clear(clears);
                    }

                    // restore states
                    if (clears & WebGL2RenderingContext.COLOR_BUFFER_BIT) {

                        const colorMask = device.stateCache.bs.targets[0].blendColorMask;
                        if (colorMask !== GFXColorMask.ALL) {
                            const r = (colorMask & GFXColorMask.R) !== GFXColorMask.NONE;
                            const g = (colorMask & GFXColorMask.G) !== GFXColorMask.NONE;
                            const b = (colorMask & GFXColorMask.B) !== GFXColorMask.NONE;
                            const a = (colorMask & GFXColorMask.A) !== GFXColorMask.NONE;
                            gl.colorMask(r, g, b, a);
                        }
                    }

                    if ((clears & WebGL2RenderingContext.DEPTH_BUFFER_BIT) &&
                        !device.stateCache.dss.depthWrite) {
                        gl.depthMask(false);
                    }

                    if (clears & WebGL2RenderingContext.STENCIL_BUFFER_BIT) {
                        if (!device.stateCache.dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGL2RenderingContext.FRONT, 0);
                        }

                        if (!device.stateCache.dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGL2RenderingContext.BACK, 0);
                        }
                    }
                } // if (curGPURenderPass)

                break;
            }
            case WebGL2Cmd.END_RENDER_PASS: {
                // WebGL 1.0 doesn't support store operation of attachments.
                // GFXStoreOp.Store is the default GL behaviour.
                break;
            }
            case WebGL2Cmd.BIND_STATES: {

                const cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
                if (cmd2.gpuPipelineState) {
                    gpuPipelineState = cmd2.gpuPipelineState;
                    glPrimitive = cmd2.gpuPipelineState.glPrimitive;

                    if (cmd2.gpuPipelineState.gpuShader) {

                        const glProgram = cmd2.gpuPipelineState.gpuShader.glProgram;
                        if (device.stateCache.glProgram !== glProgram) {
                            gl.useProgram(glProgram);
                            device.stateCache.glProgram = glProgram;
                        }

                        gpuShader = cmd2.gpuPipelineState.gpuShader;
                    }

                    // rasterizer state
                    const rs = cmd2.gpuPipelineState.rs;
                    if (rs) {

                        if (device.stateCache.rs.cullMode !== rs.cullMode) {
                            switch (rs.cullMode) {
                                case GFXCullMode.NONE: {
                                    gl.disable(WebGL2RenderingContext.CULL_FACE);
                                    break;
                                }
                                case GFXCullMode.FRONT: {
                                    gl.enable(WebGL2RenderingContext.CULL_FACE);
                                    gl.cullFace(WebGL2RenderingContext.FRONT);
                                    break;
                                }
                                case GFXCullMode.BACK: {
                                    gl.enable(WebGL2RenderingContext.CULL_FACE);
                                    gl.cullFace(WebGL2RenderingContext.BACK);
                                    break;
                                }
                                default:
                            }

                            device.stateCache.rs.cullMode = rs.cullMode;
                        }

                        if (device.stateCache.rs.isFrontFaceCCW !== rs.isFrontFaceCCW) {
                            gl.frontFace(rs.isFrontFaceCCW ? WebGL2RenderingContext.CCW : WebGL2RenderingContext.CW);
                            device.stateCache.rs.isFrontFaceCCW = rs.isFrontFaceCCW;
                        }

                        if ((device.stateCache.rs.depthBias !== rs.depthBias) ||
                            (device.stateCache.rs.depthBiasSlop !== rs.depthBiasSlop)) {
                            gl.polygonOffset(rs.depthBias, rs.depthBiasSlop);
                            device.stateCache.rs.depthBias = rs.depthBias;
                            device.stateCache.rs.depthBiasSlop = rs.depthBiasSlop;
                        }

                        if (device.stateCache.rs.lineWidth !== rs.lineWidth) {
                            gl.lineWidth(rs.lineWidth);
                            device.stateCache.rs.lineWidth = rs.lineWidth;
                        }

                    } // rasterizater state

                    // depth-stencil state
                    const dss = cmd2.gpuPipelineState.dss;
                    if (dss) {

                        if (device.stateCache.dss.depthTest !== dss.depthTest) {
                            if (dss.depthTest) {
                                gl.enable(WebGL2RenderingContext.DEPTH_TEST);
                            } else {
                                gl.disable(WebGL2RenderingContext.DEPTH_TEST);
                            }
                            device.stateCache.dss.depthTest = dss.depthTest;
                        }

                        if (device.stateCache.dss.depthWrite !== dss.depthWrite) {
                            gl.depthMask(dss.depthWrite);
                            device.stateCache.dss.depthWrite = dss.depthWrite;
                        }

                        if (device.stateCache.dss.depthFunc !== dss.depthFunc) {
                            gl.depthFunc(WebGLCmpFuncs[dss.depthFunc]);
                            device.stateCache.dss.depthFunc = dss.depthFunc;
                        }

                        // front
                        if ((device.stateCache.dss.stencilTestFront !== dss.stencilTestFront) ||
                            (device.stateCache.dss.stencilTestBack !== dss.stencilTestBack)) {
                            if (dss.stencilTestFront || dss.stencilTestBack) {
                                gl.enable(WebGL2RenderingContext.STENCIL_TEST);
                            } else {
                                gl.disable(WebGL2RenderingContext.STENCIL_TEST);
                            }
                            device.stateCache.dss.stencilTestFront = dss.stencilTestFront;
                            device.stateCache.dss.stencilTestBack = dss.stencilTestBack;
                        }

                        if ((device.stateCache.dss.stencilFuncFront !== dss.stencilFuncFront) ||
                            (device.stateCache.dss.stencilRefFront !== dss.stencilRefFront) ||
                            (device.stateCache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront)) {

                            gl.stencilFuncSeparate(
                                WebGL2RenderingContext.FRONT,
                                WebGLCmpFuncs[dss.stencilFuncFront],
                                dss.stencilRefFront,
                                dss.stencilReadMaskFront);

                            device.stateCache.dss.stencilFuncFront = dss.stencilFuncFront;
                            device.stateCache.dss.stencilRefFront = dss.stencilRefFront;
                            device.stateCache.dss.stencilReadMaskFront = dss.stencilReadMaskFront;
                        }

                        if ((device.stateCache.dss.stencilFailOpFront !== dss.stencilFailOpFront) ||
                            (device.stateCache.dss.stencilZFailOpFront !== dss.stencilZFailOpFront) ||
                            (device.stateCache.dss.stencilPassOpFront !== dss.stencilPassOpFront)) {

                            gl.stencilOpSeparate(
                                WebGL2RenderingContext.FRONT,
                                WebGLStencilOps[dss.stencilFailOpFront],
                                WebGLStencilOps[dss.stencilZFailOpFront],
                                WebGLStencilOps[dss.stencilPassOpFront]);

                            device.stateCache.dss.stencilFailOpFront = dss.stencilFailOpFront;
                            device.stateCache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
                            device.stateCache.dss.stencilPassOpFront = dss.stencilPassOpFront;
                        }

                        if (device.stateCache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(WebGL2RenderingContext.FRONT, dss.stencilWriteMaskFront);
                            device.stateCache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
                        }

                        // back
                        if ((device.stateCache.dss.stencilFuncBack !== dss.stencilFuncBack) ||
                            (device.stateCache.dss.stencilRefBack !== dss.stencilRefBack) ||
                            (device.stateCache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack)) {

                            gl.stencilFuncSeparate(
                                WebGL2RenderingContext.BACK,
                                WebGLCmpFuncs[dss.stencilFuncBack],
                                dss.stencilRefBack,
                                dss.stencilReadMaskBack);

                            device.stateCache.dss.stencilFuncBack = dss.stencilFuncBack;
                            device.stateCache.dss.stencilRefBack = dss.stencilRefBack;
                            device.stateCache.dss.stencilReadMaskBack = dss.stencilReadMaskBack;
                        }

                        if ((device.stateCache.dss.stencilFailOpBack !== dss.stencilFailOpBack) ||
                            (device.stateCache.dss.stencilZFailOpBack !== dss.stencilZFailOpBack) ||
                            (device.stateCache.dss.stencilPassOpBack !== dss.stencilPassOpBack)) {

                            gl.stencilOpSeparate(
                                WebGL2RenderingContext.BACK,
                                WebGLStencilOps[dss.stencilFailOpBack],
                                WebGLStencilOps[dss.stencilZFailOpBack],
                                WebGLStencilOps[dss.stencilPassOpBack]);

                            device.stateCache.dss.stencilFailOpBack = dss.stencilFailOpBack;
                            device.stateCache.dss.stencilZFailOpBack = dss.stencilZFailOpBack;
                            device.stateCache.dss.stencilPassOpBack = dss.stencilPassOpBack;
                        }

                        if (device.stateCache.dss.stencilWriteMaskBack !== dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(WebGL2RenderingContext.BACK, dss.stencilWriteMaskBack);
                            device.stateCache.dss.stencilWriteMaskBack = dss.stencilWriteMaskBack;
                        }
                    } // depth-stencil state

                    // blend state
                    const bs = cmd2.gpuPipelineState.bs;
                    if (bs) {

                        if (device.stateCache.bs.isA2C !== bs.isA2C) {
                            if (bs.isA2C) {
                                gl.enable(WebGL2RenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
                            } else {
                                gl.disable(WebGL2RenderingContext.SAMPLE_ALPHA_TO_COVERAGE);
                            }
                            device.stateCache.bs.isA2C = bs.isA2C;
                        }

                        if ((device.stateCache.bs.blendColor[0] !== bs.blendColor[0]) ||
                            (device.stateCache.bs.blendColor[1] !== bs.blendColor[1]) ||
                            (device.stateCache.bs.blendColor[2] !== bs.blendColor[2]) ||
                            (device.stateCache.bs.blendColor[3] !== bs.blendColor[3])) {

                            gl.blendColor(bs.blendColor[0], bs.blendColor[1], bs.blendColor[2], bs.blendColor[3]);

                            device.stateCache.bs.blendColor[0] = bs.blendColor[0];
                            device.stateCache.bs.blendColor[1] = bs.blendColor[1];
                            device.stateCache.bs.blendColor[2] = bs.blendColor[2];
                            device.stateCache.bs.blendColor[3] = bs.blendColor[3];
                        }

                        const target0 = bs.targets[0];
                        const catchTarget0 = device.stateCache.bs.targets[0];

                        if (catchTarget0.blend !== target0.blend) {
                            if (target0.blend) {
                                gl.enable(WebGL2RenderingContext.BLEND);
                            } else {
                                gl.disable(WebGL2RenderingContext.BLEND);
                            }
                            catchTarget0.blend = target0.blend;
                        }

                        if ((catchTarget0.blendEq !== target0.blendEq) ||
                            (catchTarget0.blendAlphaEq !== target0.blendAlphaEq)) {

                            gl.blendEquationSeparate(WebGLBlendOps[target0.blendEq], WebGLBlendOps[target0.blendAlphaEq]);

                            catchTarget0.blendEq = target0.blendEq;
                            catchTarget0.blendAlphaEq = target0.blendAlphaEq;
                        }

                        if ((catchTarget0.blendSrc !== target0.blendSrc) ||
                            (catchTarget0.blendDst !== target0.blendDst) ||
                            (catchTarget0.blendSrcAlpha !== target0.blendSrcAlpha) ||
                            (catchTarget0.blendDstAlpha !== target0.blendDstAlpha)) {

                            gl.blendFuncSeparate(
                                WebGLBlendFactors[target0.blendSrc],
                                WebGLBlendFactors[target0.blendDst],
                                WebGLBlendFactors[target0.blendSrcAlpha],
                                WebGLBlendFactors[target0.blendDstAlpha]);

                            catchTarget0.blendSrc = target0.blendSrc;
                            catchTarget0.blendDst = target0.blendDst;
                            catchTarget0.blendSrcAlpha = target0.blendSrcAlpha;
                            catchTarget0.blendDstAlpha = target0.blendDstAlpha;
                        }

                        if (catchTarget0.blendColorMask !== target0.blendColorMask) {

                            gl.colorMask(
                                (target0.blendColorMask & GFXColorMask.R) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.G) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.B) !== GFXColorMask.NONE,
                                (target0.blendColorMask & GFXColorMask.A) !== GFXColorMask.NONE);

                            catchTarget0.blendColorMask = target0.blendColorMask;
                        }
                    } // blend state
                } // bind pso

                if (cmd2.gpuBindingLayout && gpuShader) {
                    for (const gpuBinding of cmd2.gpuBindingLayout.gpuBindings) {

                        switch (gpuBinding.type) {
                            case GFXBindingType.UNIFORM_BUFFER: {

                                if (gpuBinding.gpuBuffer) {
                                    for (const glBlock of gpuShader.glBlocks) {
                                        if (glBlock.binding === gpuBinding.binding) {
                                            if (device.stateCache.glBindUBOs[glBlock.binding] !== gpuBinding.gpuBuffer.glBuffer) {
                                                gl.bindBufferBase(WebGL2RenderingContext.UNIFORM_BUFFER, glBlock.binding, gpuBinding.gpuBuffer.glBuffer);
                                                // gl.bindBufferRange(WebGL2RenderingContext.UNIFORM_BUFFER, glBlock.binding, gpuBinding.gpuBuffer.glBuffer, 0, gpuBinding.gpuBuffer.size);
                                                device.stateCache.glBindUBOs[glBlock.binding] = gpuBinding.gpuBuffer.glBuffer;
                                            }

                                            break;
                                        }
                                    }
                                } // if
                                break;
                            }
                            case GFXBindingType.SAMPLER: {

                                if (gpuBinding.gpuSampler) {

                                    let glSampler: WebGL2GPUUniformSampler | null = null;

                                    for (const sampler of gpuShader.glSamplers) {
                                        if (sampler.binding === gpuBinding.binding) {
                                            glSampler = sampler;
                                            break;
                                        }
                                    }

                                    if (glSampler) {
                                        for (const texUnit of glSampler.units) {

                                            if (device.stateCache.texUnit !== texUnit) {
                                                gl.activeTexture(WebGL2RenderingContext.TEXTURE0 + texUnit);
                                                device.stateCache.texUnit = texUnit;
                                            }

                                            let glTexUnit: IWebGL2TexUnit | null = null;

                                            if (gpuBinding.gpuTexView) {
                                                const gpuTexture = gpuBinding.gpuTexView.gpuTexture;
                                                switch (glSampler.glType) {
                                                    case WebGL2RenderingContext.SAMPLER_2D: {
                                                        glTexUnit = device.stateCache.glTex2DUnits[texUnit];
                                                        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                            gl.bindTexture(WebGL2RenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                                                            glTexUnit.glTexture = gpuTexture.glTexture;
                                                        }
                                                        break;
                                                    }
                                                    case WebGL2RenderingContext.SAMPLER_CUBE: {
                                                        glTexUnit = device.stateCache.glTexCubeUnits[texUnit];

                                                        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                                                            gl.bindTexture(WebGL2RenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                                                            glTexUnit.glTexture = gpuTexture.glTexture;
                                                        }
                                                        break;
                                                    }
                                                    default: {
                                                        console.error('Unsupported GL Texture type.');
                                                    }
                                                }

                                                if (device.stateCache.glSamplerUnits[texUnit] !== gpuBinding.gpuSampler.glSampler) {
                                                    gl.bindSampler(texUnit, gpuBinding.gpuSampler.glSampler);
                                                    device.stateCache.glSamplerUnits[texUnit] = gpuBinding.gpuSampler.glSampler;
                                                }
                                            } else {
                                                console.error('Not found texture view on binding unit ' + gpuBinding.binding);
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

                if (cmd2.gpuInputAssembler && gpuShader) {
                    gpuInputAssembler = cmd2.gpuInputAssembler;

                    for (let a = 0; a < device.maxVertexAttributes; ++a) {
                        device.stateCache.glCurrentAttribLocs[a] = false;
                    }

                    for (const glInput of gpuShader.glInputs) {
                        let glAttrib: WebGL2Attrib | null = null;

                        for (const attrib of gpuInputAssembler.glAttribs) {
                            if (attrib.name === glInput.name) {
                                glAttrib = attrib;
                                break;
                            }
                        }

                        if (glAttrib) {
                            if (device.stateCache.glArrayBuffer !== glAttrib.glBuffer) {
                                gl.bindBuffer(WebGL2RenderingContext.ARRAY_BUFFER, glAttrib.glBuffer);
                                device.stateCache.glArrayBuffer = glAttrib.glBuffer;
                            }

                            for (let c = 0; c < glAttrib.componentCount; ++c) {
                                const glLoc = glInput.glLoc + c;
                                const attribOffset = glAttrib.offset + glAttrib.size * c;

                                if (!device.stateCache.glEnabledAttribLocs[glLoc] && glLoc >= 0) {
                                    gl.enableVertexAttribArray(glLoc);
                                    device.stateCache.glEnabledAttribLocs[glLoc] = true;
                                }
                                device.stateCache.glCurrentAttribLocs[glLoc] = true;

                                gl.vertexAttribPointer(glLoc, glAttrib.count, glAttrib.glType, glAttrib.isNormalized, glAttrib.stride, attribOffset);
                            }
                        }
                    } // for

                    const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                    if (gpuBuffer) {
                        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                            gl.bindBuffer(WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                            device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
                        }
                    }

                    for (let a = 0; a < device.maxVertexAttributes; ++a) {
                        if (device.stateCache.glEnabledAttribLocs[a] !== device.stateCache.glCurrentAttribLocs[a]) {
                            gl.disableVertexAttribArray(a);
                            device.stateCache.glEnabledAttribLocs[a] = false;
                        }
                    }
                }

                if (gpuPipelineState) {
                    for (const dynamicState of gpuPipelineState.dynamicStates) {
                        switch (dynamicState) {
                            case GFXDynamicState.VIEWPORT: {
                                if (cmd2.viewport) {
                                    if (device.stateCache.viewport.left !== cmd2.viewport.left ||
                                        device.stateCache.viewport.top !== cmd2.viewport.top ||
                                        device.stateCache.viewport.width !== cmd2.viewport.width ||
                                        device.stateCache.viewport.height !== cmd2.viewport.height) {

                                        gl.viewport(cmd2.viewport.left, cmd2.viewport.top, cmd2.viewport.width, cmd2.viewport.height);

                                        device.stateCache.viewport.left = cmd2.viewport.left;
                                        device.stateCache.viewport.top = cmd2.viewport.top;
                                        device.stateCache.viewport.width = cmd2.viewport.width;
                                        device.stateCache.viewport.height = cmd2.viewport.height;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.SCISSOR: {
                                if (cmd2.scissor) {
                                    if (device.stateCache.scissorRect.x !== cmd2.scissor.x ||
                                        device.stateCache.scissorRect.y !== cmd2.scissor.y ||
                                        device.stateCache.scissorRect.width !== cmd2.scissor.width ||
                                        device.stateCache.scissorRect.height !== cmd2.scissor.height) {

                                        gl.scissor(cmd2.scissor.x, cmd2.scissor.y, cmd2.scissor.width, cmd2.scissor.height);

                                        device.stateCache.scissorRect.x = cmd2.scissor.x;
                                        device.stateCache.scissorRect.y = cmd2.scissor.y;
                                        device.stateCache.scissorRect.width = cmd2.scissor.width;
                                        device.stateCache.scissorRect.height = cmd2.scissor.height;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.LINE_WIDTH: {
                                if (cmd2.lineWidth) {
                                    if (device.stateCache.rs.lineWidth !== cmd2.lineWidth) {
                                        gl.lineWidth(cmd2.lineWidth);
                                        device.stateCache.rs.lineWidth = cmd2.lineWidth;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.DEPTH_BIAS: {
                                if (cmd2.depthBias) {

                                    if ((device.stateCache.rs.depthBias !== cmd2.depthBias.constantFactor) ||
                                        (device.stateCache.rs.depthBiasSlop !== cmd2.depthBias.slopeFactor)) {
                                        gl.polygonOffset(cmd2.depthBias.constantFactor, cmd2.depthBias.slopeFactor);
                                        device.stateCache.rs.depthBias = cmd2.depthBias.constantFactor;
                                        device.stateCache.rs.depthBiasSlop = cmd2.depthBias.slopeFactor;
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.BLEND_CONSTANTS: {
                                if (cmd2.blendConstants) {
                                    if ((device.stateCache.bs.blendColor[0] !== cmd2.blendConstants[0]) ||
                                        (device.stateCache.bs.blendColor[1] !== cmd2.blendConstants[1]) ||
                                        (device.stateCache.bs.blendColor[2] !== cmd2.blendConstants[2]) ||
                                        (device.stateCache.bs.blendColor[3] !== cmd2.blendConstants[3])) {

                                        gl.blendColor(cmd2.blendConstants[0], cmd2.blendConstants[1], cmd2.blendConstants[2], cmd2.blendConstants[3]);

                                        device.stateCache.bs.blendColor[0] = cmd2.blendConstants[0];
                                        device.stateCache.bs.blendColor[1] = cmd2.blendConstants[1];
                                        device.stateCache.bs.blendColor[2] = cmd2.blendConstants[2];
                                        device.stateCache.bs.blendColor[3] = cmd2.blendConstants[3];
                                    }
                                }
                                break;
                            }
                            case GFXDynamicState.STENCIL_WRITE_MASK: {
                                if (cmd2.stencilWriteMask) {
                                    switch (cmd2.stencilWriteMask.face) {
                                        case GFXStencilFace.FRONT: {
                                            if (device.stateCache.dss.stencilWriteMaskFront !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMaskSeparate(WebGL2RenderingContext.FRONT, cmd2.stencilWriteMask.writeMask);
                                                device.stateCache.dss.stencilWriteMaskFront = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.BACK: {
                                            if (device.stateCache.dss.stencilWriteMaskBack !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMaskSeparate(WebGL2RenderingContext.BACK, cmd2.stencilWriteMask.writeMask);
                                                device.stateCache.dss.stencilWriteMaskBack = cmd2.stencilWriteMask.writeMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.ALL: {
                                            if (device.stateCache.dss.stencilWriteMaskFront !== cmd2.stencilWriteMask.writeMask ||
                                                device.stateCache.dss.stencilWriteMaskBack !== cmd2.stencilWriteMask.writeMask) {
                                                gl.stencilMask(cmd2.stencilWriteMask.writeMask);
                                                device.stateCache.dss.stencilWriteMaskFront = cmd2.stencilWriteMask.writeMask;
                                                device.stateCache.dss.stencilWriteMaskBack = cmd2.stencilWriteMask.writeMask;
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
                                            if (device.stateCache.dss.stencilRefFront !== cmd2.stencilCompareMask.reference ||
                                                device.stateCache.dss.stencilReadMaskFront !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFuncSeparate(
                                                    WebGL2RenderingContext.FRONT,
                                                    WebGLCmpFuncs[device.stateCache.dss.stencilFuncFront],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                device.stateCache.dss.stencilRefFront = cmd2.stencilCompareMask.reference;
                                                device.stateCache.dss.stencilReadMaskFront = cmd2.stencilCompareMask.compareMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.BACK: {
                                            if (device.stateCache.dss.stencilRefBack !== cmd2.stencilCompareMask.reference ||
                                                device.stateCache.dss.stencilReadMaskBack !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFuncSeparate(
                                                    WebGL2RenderingContext.BACK,
                                                    WebGLCmpFuncs[device.stateCache.dss.stencilFuncBack],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                device.stateCache.dss.stencilRefBack = cmd2.stencilCompareMask.reference;
                                                device.stateCache.dss.stencilReadMaskBack = cmd2.stencilCompareMask.compareMask;
                                            }
                                            break;
                                        }
                                        case GFXStencilFace.ALL: {
                                            if (device.stateCache.dss.stencilRefFront !== cmd2.stencilCompareMask.reference ||
                                                device.stateCache.dss.stencilReadMaskFront !== cmd2.stencilCompareMask.compareMask ||
                                                device.stateCache.dss.stencilRefBack !== cmd2.stencilCompareMask.reference ||
                                                device.stateCache.dss.stencilReadMaskBack !== cmd2.stencilCompareMask.compareMask) {
                                                gl.stencilFunc(
                                                    WebGLCmpFuncs[device.stateCache.dss.stencilFuncBack],
                                                    cmd2.stencilCompareMask.reference,
                                                    cmd2.stencilCompareMask.compareMask);
                                                device.stateCache.dss.stencilRefFront = cmd2.stencilCompareMask.reference;
                                                device.stateCache.dss.stencilReadMaskFront = cmd2.stencilCompareMask.compareMask;
                                                device.stateCache.dss.stencilRefBack = cmd2.stencilCompareMask.reference;
                                                device.stateCache.dss.stencilReadMaskBack = cmd2.stencilCompareMask.compareMask;
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
            case WebGL2Cmd.DRAW: {
                const cmd3: WebGL2CmdDraw = cmdPackage.drawCmds.array[cmdId];
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
            case WebGL2Cmd.UPDATE_BUFFER: {
                const cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
                WebGL2CmdFuncUpdateBuffer(
                    device,
                    cmd4.gpuBuffer as WebGL2GPUBuffer,
                    cmd4.buffer as GFXBufferSource,
                    cmd4.offset,
                    cmd4.size);

                break;
            }
            case WebGL2Cmd.COPY_BUFFER_TO_TEXTURE: {
                const cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
                WebGL2CmdFuncCopyBufferToTexture(
                    device,
                    (cmd5.gpuBuffer as WebGL2GPUBuffer).buffer as GFXBufferSource,
                    cmd5.gpuTexture as WebGL2GPUTexture,
                    cmd5.regions);

                break;
            }
        } // switch
    } // for
}

export function WebGL2CmdFuncCopyBufferToTexture (
    device: WebGL2GFXDevice,
    buffer: GFXBufferSource,
    gpuTexture: WebGL2GPUTexture,
    regions: GFXBufferTextureCopy[]) {

    const gl = device.gl;

    const buff = buffer as ArrayBuffer;
    const fmtInfo: IGFXFormatInfo = GFXFormatInfos[gpuTexture.format];
    let m = 0;
    let w = 1;
    let h = 1;
    let f = 0;
    let buffOffset = 0;

    switch (gpuTexture.glTarget) {
        case WebGL2RenderingContext.TEXTURE_2D: {
            const glTexUnit = device.stateCache.glTex2DUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGL2RenderingContext.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            const isCompressed = GFXFormatInfos[gpuTexture.format].isCompressed;
            if (!isCompressed) {
                for (const region of regions) {
                    buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

                    w = region.texExtent.width;
                    h = region.texExtent.height;

                    for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                        const memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                        const data = buff.slice(buffOffset, buffOffset + memSize);
                        const pixels = !fmtInfo.isFloating ? new Uint8Array(data) : new Float32Array(data);

                        gl.texSubImage2D(WebGL2RenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, gpuTexture.glType, pixels);

                        buffOffset += memSize;
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, w >> 1);
                    }
                }
            } else {
                for (const region of regions) {
                    buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

                    w = region.texExtent.width;
                    h = region.texExtent.height;

                    for (m = region.texSubres.baseMipLevel; m < region.texSubres.levelCount; ++m) {
                        const memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                        const data = buff.slice(buffOffset, buffOffset + memSize);
                        const pixels = !fmtInfo.isFloating ? new Uint8Array(data) : new Float32Array(data);

                        gl.compressedTexSubImage2D(WebGL2RenderingContext.TEXTURE_2D, m,
                            region.texOffset.x, region.texOffset.y, w, h,
                            gpuTexture.glFormat, pixels);

                        buffOffset += memSize;
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, w >> 1);
                    }
                }
            }
            break;
        }
        case WebGL2RenderingContext.TEXTURE_CUBE_MAP: {
            const glTexUnit = device.stateCache.glTexCubeUnits[device.stateCache.texUnit];
            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(WebGL2RenderingContext.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            const isCompressed = GFXFormatInfos[gpuTexture.format].isCompressed;
            if (!isCompressed) {
                for (const region of regions) {
                    buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;
                    const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                    for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                        w = region.texExtent.width;
                        h = region.texExtent.height;

                        const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                        for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                            const memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            const data = buff.slice(buffOffset, buffOffset + memSize);
                            const pixels = !fmtInfo.isFloating ? new Uint8Array(data) : new Float32Array(data);

                            gl.texSubImage2D(WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, gpuTexture.glType, pixels);

                            buffOffset += memSize;
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, w >> 1);
                        }
                    }
                }
            } else {
                for (const region of regions) {
                    buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;
                    const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
                    for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                        w = region.texExtent.width;
                        h = region.texExtent.height;

                        const mcount = region.texSubres.baseMipLevel + region.texSubres.levelCount;
                        for (m = region.texSubres.baseMipLevel; m < mcount; ++m) {
                            const memSize = GFXFormatSize(gpuTexture.format, w, h, 1);
                            const data = buff.slice(buffOffset, buffOffset + memSize);
                            const pixels = !fmtInfo.isFloating ? new Uint8Array(data) : new Float32Array(data);

                            gl.compressedTexSubImage2D(WebGL2RenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X + f, m,
                                region.texOffset.x, region.texOffset.y, w, h,
                                gpuTexture.glFormat, pixels);

                            buffOffset += memSize;
                            w = Math.max(1, w >> 1);
                            h = Math.max(1, w >> 1);
                        }
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
