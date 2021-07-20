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

import { CachedArray } from '../../memop/cached-array';
import { error, errorID } from '../../platform';
import { debug } from '../../platform/debug';
import {
    BufferUsageBit, ColorMask, CullMode, DynamicStateFlagBit, Filter, Format, TextureType, Type, FormatInfo,
    FormatInfos, FormatSize, LoadOp, MemoryUsageBit, SampleCount, ShaderStageFlagBit, TextureFlagBit,
    Color, Rect, BufferTextureCopy, BufferSource, DrawInfo, IndirectBuffer, UniformBlock, DynamicStates,
} from '../base/define';
import { WebGL2EXT } from './webgl2-define';
import { WebGL2CommandAllocator } from './webgl2-command-allocator';
import { WebGL2Device } from './webgl2-device';
import {
    IWebGL2GPUInputAssembler,
    IWebGL2Attrib,
    IWebGL2GPUDescriptorSet,
    IWebGL2GPUBuffer,
    IWebGL2GPUFramebuffer,
    IWebGL2GPUInput,
    IWebGL2GPUPipelineState,
    IWebGL2GPUSampler,
    IWebGL2GPUShader,
    IWebGL2GPUTexture,
    IWebGL2GPUUniformBlock,
    IWebGL2GPUUniformSamplerTexture,
    IWebGL2GPURenderPass,
} from './webgl2-gpu-objects';

const WebGLWraps: GLenum[] = [
    0x2901, // WebGLRenderingContext.REPEAT
    0x8370, // WebGLRenderingContext.MIRRORED_REPEAT
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE
    0x812F, // WebGLRenderingContext.CLAMP_TO_EDGE
];

const _f32v4 = new Float32Array(4);

function CmpF32NotEuqal (a: number, b: number): boolean {
    const c = a - b;
    return (c > 0.000001 || c < -0.000001);
}

export function GFXFormatToWebGLType (format: Format, gl: WebGL2RenderingContext): GLenum {
    switch (format) {
    case Format.R8: return gl.UNSIGNED_BYTE;
    case Format.R8SN: return gl.BYTE;
    case Format.R8UI: return gl.UNSIGNED_BYTE;
    case Format.R8I: return gl.BYTE;
    case Format.R16F: return gl.HALF_FLOAT;
    case Format.R16UI: return gl.UNSIGNED_SHORT;
    case Format.R16I: return gl.SHORT;
    case Format.R32F: return gl.FLOAT;
    case Format.R32UI: return gl.UNSIGNED_INT;
    case Format.R32I: return gl.INT;

    case Format.RG8: return gl.UNSIGNED_BYTE;
    case Format.RG8SN: return gl.BYTE;
    case Format.RG8UI: return gl.UNSIGNED_BYTE;
    case Format.RG8I: return gl.BYTE;
    case Format.RG16F: return gl.HALF_FLOAT;
    case Format.RG16UI: return gl.UNSIGNED_SHORT;
    case Format.RG16I: return gl.SHORT;
    case Format.RG32F: return gl.FLOAT;
    case Format.RG32UI: return gl.UNSIGNED_INT;
    case Format.RG32I: return gl.INT;

    case Format.RGB8: return gl.UNSIGNED_BYTE;
    case Format.SRGB8: return gl.UNSIGNED_BYTE;
    case Format.RGB8SN: return gl.BYTE;
    case Format.RGB8UI: return gl.UNSIGNED_BYTE;
    case Format.RGB8I: return gl.BYTE;
    case Format.RGB16F: return gl.HALF_FLOAT;
    case Format.RGB16UI: return gl.UNSIGNED_SHORT;
    case Format.RGB16I: return gl.SHORT;
    case Format.RGB32F: return gl.FLOAT;
    case Format.RGB32UI: return gl.UNSIGNED_INT;
    case Format.RGB32I: return gl.INT;

    case Format.BGRA8: return gl.UNSIGNED_BYTE;
    case Format.RGBA8: return gl.UNSIGNED_BYTE;
    case Format.SRGB8_A8: return gl.UNSIGNED_BYTE;
    case Format.RGBA8SN: return gl.BYTE;
    case Format.RGBA8UI: return gl.UNSIGNED_BYTE;
    case Format.RGBA8I: return gl.BYTE;
    case Format.RGBA16F: return gl.HALF_FLOAT;
    case Format.RGBA16UI: return gl.UNSIGNED_SHORT;
    case Format.RGBA16I: return gl.SHORT;
    case Format.RGBA32F: return gl.FLOAT;
    case Format.RGBA32UI: return gl.UNSIGNED_INT;
    case Format.RGBA32I: return gl.INT;

    case Format.R5G6B5: return gl.UNSIGNED_SHORT_5_6_5;
    case Format.R11G11B10F: return gl.UNSIGNED_INT_10F_11F_11F_REV;
    case Format.RGB5A1: return gl.UNSIGNED_SHORT_5_5_5_1;
    case Format.RGBA4: return gl.UNSIGNED_SHORT_4_4_4_4;
    case Format.RGB10A2: return gl.UNSIGNED_INT_2_10_10_10_REV;
    case Format.RGB10A2UI: return gl.UNSIGNED_INT_2_10_10_10_REV;
    case Format.RGB9E5: return gl.FLOAT;

    case Format.DEPTH: return gl.FLOAT;
    case Format.DEPTH_STENCIL: return gl.FLOAT_32_UNSIGNED_INT_24_8_REV;

    case Format.BC1: return gl.UNSIGNED_BYTE;
    case Format.BC1_SRGB: return gl.UNSIGNED_BYTE;
    case Format.BC2: return gl.UNSIGNED_BYTE;
    case Format.BC2_SRGB: return gl.UNSIGNED_BYTE;
    case Format.BC3: return gl.UNSIGNED_BYTE;
    case Format.BC3_SRGB: return gl.UNSIGNED_BYTE;
    case Format.BC4: return gl.UNSIGNED_BYTE;
    case Format.BC4_SNORM: return gl.BYTE;
    case Format.BC5: return gl.UNSIGNED_BYTE;
    case Format.BC5_SNORM: return gl.BYTE;
    case Format.BC6H_SF16: return gl.FLOAT;
    case Format.BC6H_UF16: return gl.FLOAT;
    case Format.BC7: return gl.UNSIGNED_BYTE;
    case Format.BC7_SRGB: return gl.UNSIGNED_BYTE;

    case Format.ETC_RGB8: return gl.UNSIGNED_BYTE;
    case Format.ETC2_RGB8: return gl.UNSIGNED_BYTE;
    case Format.ETC2_SRGB8: return gl.UNSIGNED_BYTE;
    case Format.ETC2_RGB8_A1: return gl.UNSIGNED_BYTE;
    case Format.ETC2_SRGB8_A1: return gl.UNSIGNED_BYTE;
    case Format.EAC_R11: return gl.UNSIGNED_BYTE;
    case Format.EAC_R11SN: return gl.BYTE;
    case Format.EAC_RG11: return gl.UNSIGNED_BYTE;
    case Format.EAC_RG11SN: return gl.BYTE;

    case Format.PVRTC_RGB2: return gl.UNSIGNED_BYTE;
    case Format.PVRTC_RGBA2: return gl.UNSIGNED_BYTE;
    case Format.PVRTC_RGB4: return gl.UNSIGNED_BYTE;
    case Format.PVRTC_RGBA4: return gl.UNSIGNED_BYTE;
    case Format.PVRTC2_2BPP: return gl.UNSIGNED_BYTE;
    case Format.PVRTC2_4BPP: return gl.UNSIGNED_BYTE;

    case Format.ASTC_RGBA_4X4:
    case Format.ASTC_RGBA_5X4:
    case Format.ASTC_RGBA_5X5:
    case Format.ASTC_RGBA_6X5:
    case Format.ASTC_RGBA_6X6:
    case Format.ASTC_RGBA_8X5:
    case Format.ASTC_RGBA_8X6:
    case Format.ASTC_RGBA_8X8:
    case Format.ASTC_RGBA_10X5:
    case Format.ASTC_RGBA_10X6:
    case Format.ASTC_RGBA_10X8:
    case Format.ASTC_RGBA_10X10:
    case Format.ASTC_RGBA_12X10:
    case Format.ASTC_RGBA_12X12:
    case Format.ASTC_SRGBA_4X4:
    case Format.ASTC_SRGBA_5X4:
    case Format.ASTC_SRGBA_5X5:
    case Format.ASTC_SRGBA_6X5:
    case Format.ASTC_SRGBA_6X6:
    case Format.ASTC_SRGBA_8X5:
    case Format.ASTC_SRGBA_8X6:
    case Format.ASTC_SRGBA_8X8:
    case Format.ASTC_SRGBA_10X5:
    case Format.ASTC_SRGBA_10X6:
    case Format.ASTC_SRGBA_10X8:
    case Format.ASTC_SRGBA_10X10:
    case Format.ASTC_SRGBA_12X10:
    case Format.ASTC_SRGBA_12X12:
        return gl.UNSIGNED_BYTE;

    default: {
        return gl.UNSIGNED_BYTE;
    }
    }
}

export function GFXFormatToWebGLInternalFormat (format: Format, gl: WebGL2RenderingContext): GLenum {
    switch (format) {
    case Format.A8: return gl.ALPHA;
    case Format.L8: return gl.LUMINANCE;
    case Format.LA8: return gl.LUMINANCE_ALPHA;
    case Format.R8: return gl.R8;
    case Format.R8SN: return gl.R8_SNORM;
    case Format.R8UI: return gl.R8UI;
    case Format.R8I: return gl.R8I;
    case Format.RG8: return gl.RG8;
    case Format.RG8SN: return gl.RG8_SNORM;
    case Format.RG8UI: return gl.RG8UI;
    case Format.RG8I: return gl.RG8I;
    case Format.RGB8: return gl.RGB8;
    case Format.RGB8SN: return gl.RGB8_SNORM;
    case Format.RGB8UI: return gl.RGB8UI;
    case Format.RGB8I: return gl.RGB8I;
    case Format.BGRA8: return gl.RGBA8;
    case Format.RGBA8: return gl.RGBA8;
    case Format.RGBA8SN: return gl.RGBA8_SNORM;
    case Format.RGBA8UI: return gl.RGBA8UI;
    case Format.RGBA8I: return gl.RGBA8I;
    case Format.R16I: return gl.R16I;
    case Format.R16UI: return gl.R16UI;
    case Format.R16F: return gl.R16F;
    case Format.RG16I: return gl.RG16I;
    case Format.RG16UI: return gl.RG16UI;
    case Format.RG16F: return gl.RG16F;
    case Format.RGB16I: return gl.RGB16I;
    case Format.RGB16UI: return gl.RGB16UI;
    case Format.RGB16F: return gl.RGB16F;
    case Format.RGBA16I: return gl.RGBA16I;
    case Format.RGBA16UI: return gl.RGBA16UI;
    case Format.RGBA16F: return gl.RGBA16F;
    case Format.R32I: return gl.R32I;
    case Format.R32UI: return gl.R32UI;
    case Format.R32F: return gl.R32F;
    case Format.RG32I: return gl.RG32I;
    case Format.RG32UI: return gl.RG32UI;
    case Format.RG32F: return gl.RG32F;
    case Format.RGB32I: return gl.RGB32I;
    case Format.RGB32UI: return gl.RGB32UI;
    case Format.RGB32F: return gl.RGB32F;
    case Format.RGBA32I: return gl.RGBA32I;
    case Format.RGBA32UI: return gl.RGBA32UI;
    case Format.RGBA32F: return gl.RGBA32F;
    case Format.R5G6B5: return gl.RGB565;
    case Format.RGB5A1: return gl.RGB5_A1;
    case Format.RGBA4: return gl.RGBA4;
    case Format.SRGB8: return gl.SRGB8;
    case Format.SRGB8_A8: return gl.SRGB8_ALPHA8;
    case Format.RGB10A2: return gl.RGB10_A2;
    case Format.RGB10A2UI: return gl.RGB10_A2UI;
    case Format.R11G11B10F: return gl.R11F_G11F_B10F;
    case Format.DEPTH: return gl.DEPTH_COMPONENT32F;
    case Format.DEPTH_STENCIL: return gl.DEPTH32F_STENCIL8;

    case Format.BC1: return WebGL2EXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
    case Format.BC1_ALPHA: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
    case Format.BC1_SRGB: return WebGL2EXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
    case Format.BC1_SRGB_ALPHA: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
    case Format.BC2: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
    case Format.BC2_SRGB: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
    case Format.BC3: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    case Format.BC3_SRGB: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

    case Format.ETC_RGB8: return WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL;
    case Format.ETC2_RGB8: return WebGL2EXT.COMPRESSED_RGB8_ETC2;
    case Format.ETC2_SRGB8: return WebGL2EXT.COMPRESSED_SRGB8_ETC2;
    case Format.ETC2_RGB8_A1: return WebGL2EXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_SRGB8_A1: return WebGL2EXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_RGBA8: return WebGL2EXT.COMPRESSED_RGBA8_ETC2_EAC;
    case Format.ETC2_SRGB8_A8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
    case Format.EAC_R11: return WebGL2EXT.COMPRESSED_R11_EAC;
    case Format.EAC_R11SN: return WebGL2EXT.COMPRESSED_SIGNED_R11_EAC;
    case Format.EAC_RG11: return WebGL2EXT.COMPRESSED_RG11_EAC;
    case Format.EAC_RG11SN: return WebGL2EXT.COMPRESSED_SIGNED_RG11_EAC;

    case Format.PVRTC_RGB2: return WebGL2EXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGBA2: return WebGL2EXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGB4: return WebGL2EXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    case Format.PVRTC_RGBA4: return WebGL2EXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

    case Format.ASTC_RGBA_4X4: return WebGL2EXT.COMPRESSED_RGBA_ASTC_4x4_KHR;
    case Format.ASTC_RGBA_5X4: return WebGL2EXT.COMPRESSED_RGBA_ASTC_5x4_KHR;
    case Format.ASTC_RGBA_5X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_5x5_KHR;
    case Format.ASTC_RGBA_6X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_6x5_KHR;
    case Format.ASTC_RGBA_6X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_6x6_KHR;
    case Format.ASTC_RGBA_8X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x5_KHR;
    case Format.ASTC_RGBA_8X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x6_KHR;
    case Format.ASTC_RGBA_8X8: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x8_KHR;
    case Format.ASTC_RGBA_10X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x5_KHR;
    case Format.ASTC_RGBA_10X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x6_KHR;
    case Format.ASTC_RGBA_10X8: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x8_KHR;
    case Format.ASTC_RGBA_10X10: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x10_KHR;
    case Format.ASTC_RGBA_12X10: return WebGL2EXT.COMPRESSED_RGBA_ASTC_12x10_KHR;
    case Format.ASTC_RGBA_12X12: return WebGL2EXT.COMPRESSED_RGBA_ASTC_12x12_KHR;

    case Format.ASTC_SRGBA_4X4: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
    case Format.ASTC_SRGBA_5X4: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;
    case Format.ASTC_SRGBA_5X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;
    case Format.ASTC_SRGBA_6X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;
    case Format.ASTC_SRGBA_6X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
    case Format.ASTC_SRGBA_8X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;
    case Format.ASTC_SRGBA_8X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;
    case Format.ASTC_SRGBA_8X8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
    case Format.ASTC_SRGBA_10X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;
    case Format.ASTC_SRGBA_10X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;
    case Format.ASTC_SRGBA_10X8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;
    case Format.ASTC_SRGBA_10X10: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
    case Format.ASTC_SRGBA_12X10: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;
    case Format.ASTC_SRGBA_12X12: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

    default: {
        console.error('Unsupported Format, convert to WebGL internal format failed.');
        return gl.RGBA;
    }
    }
}

export function GFXFormatToWebGLFormat (format: Format, gl: WebGL2RenderingContext): GLenum {
    switch (format) {
    case Format.A8: return gl.ALPHA;
    case Format.L8: return gl.LUMINANCE;
    case Format.LA8: return gl.LUMINANCE_ALPHA;
    case Format.R8:
    case Format.R8SN: return gl.RED;
    case Format.R8UI:
    case Format.R8I: return gl.RED;
    case Format.RG8:
    case Format.RG8SN:
    case Format.RG8UI:
    case Format.RG8I: return gl.RG;
    case Format.RGB8:
    case Format.RGB8SN:
    case Format.RGB8UI:
    case Format.RGB8I: return gl.RGB;
    case Format.BGRA8:
    case Format.RGBA8:
    case Format.RGBA8SN:
    case Format.RGBA8UI:
    case Format.RGBA8I: return gl.RGBA;
    case Format.R16UI:
    case Format.R16I:
    case Format.R16F: return gl.RED;
    case Format.RG16UI:
    case Format.RG16I:
    case Format.RG16F: return gl.RG;
    case Format.RGB16UI:
    case Format.RGB16I:
    case Format.RGB16F: return gl.RGB;
    case Format.RGBA16UI:
    case Format.RGBA16I:
    case Format.RGBA16F: return gl.RGBA;
    case Format.R32UI:
    case Format.R32I:
    case Format.R32F: return gl.RED;
    case Format.RG32UI:
    case Format.RG32I:
    case Format.RG32F: return gl.RG;
    case Format.RGB32UI:
    case Format.RGB32I:
    case Format.RGB32F: return gl.RGB;
    case Format.RGBA32UI:
    case Format.RGBA32I:
    case Format.RGBA32F: return gl.RGBA;
    case Format.RGB10A2: return gl.RGBA;
    case Format.R11G11B10F: return gl.RGB;
    case Format.R5G6B5: return gl.RGB;
    case Format.RGB5A1: return gl.RGBA;
    case Format.RGBA4: return gl.RGBA;
    case Format.SRGB8: return gl.RGB;
    case Format.SRGB8_A8: return gl.RGBA;
    case Format.DEPTH: return gl.DEPTH_COMPONENT;
    case Format.DEPTH_STENCIL: return gl.DEPTH_STENCIL;

    case Format.BC1: return WebGL2EXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
    case Format.BC1_ALPHA: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
    case Format.BC1_SRGB: return WebGL2EXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
    case Format.BC1_SRGB_ALPHA: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
    case Format.BC2: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
    case Format.BC2_SRGB: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
    case Format.BC3: return WebGL2EXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    case Format.BC3_SRGB: return WebGL2EXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

    case Format.ETC_RGB8: return WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL;
    case Format.ETC2_RGB8: return WebGL2EXT.COMPRESSED_RGB8_ETC2;
    case Format.ETC2_SRGB8: return WebGL2EXT.COMPRESSED_SRGB8_ETC2;
    case Format.ETC2_RGB8_A1: return WebGL2EXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_SRGB8_A1: return WebGL2EXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_RGBA8: return WebGL2EXT.COMPRESSED_RGBA8_ETC2_EAC;
    case Format.ETC2_SRGB8_A8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
    case Format.EAC_R11: return WebGL2EXT.COMPRESSED_R11_EAC;
    case Format.EAC_R11SN: return WebGL2EXT.COMPRESSED_SIGNED_R11_EAC;
    case Format.EAC_RG11: return WebGL2EXT.COMPRESSED_RG11_EAC;
    case Format.EAC_RG11SN: return WebGL2EXT.COMPRESSED_SIGNED_RG11_EAC;

    case Format.PVRTC_RGB2: return WebGL2EXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGBA2: return WebGL2EXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGB4: return WebGL2EXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    case Format.PVRTC_RGBA4: return WebGL2EXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

    case Format.ASTC_RGBA_4X4: return WebGL2EXT.COMPRESSED_RGBA_ASTC_4x4_KHR;
    case Format.ASTC_RGBA_5X4: return WebGL2EXT.COMPRESSED_RGBA_ASTC_5x4_KHR;
    case Format.ASTC_RGBA_5X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_5x5_KHR;
    case Format.ASTC_RGBA_6X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_6x5_KHR;
    case Format.ASTC_RGBA_6X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_6x6_KHR;
    case Format.ASTC_RGBA_8X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x5_KHR;
    case Format.ASTC_RGBA_8X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x6_KHR;
    case Format.ASTC_RGBA_8X8: return WebGL2EXT.COMPRESSED_RGBA_ASTC_8x8_KHR;
    case Format.ASTC_RGBA_10X5: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x5_KHR;
    case Format.ASTC_RGBA_10X6: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x6_KHR;
    case Format.ASTC_RGBA_10X8: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x8_KHR;
    case Format.ASTC_RGBA_10X10: return WebGL2EXT.COMPRESSED_RGBA_ASTC_10x10_KHR;
    case Format.ASTC_RGBA_12X10: return WebGL2EXT.COMPRESSED_RGBA_ASTC_12x10_KHR;
    case Format.ASTC_RGBA_12X12: return WebGL2EXT.COMPRESSED_RGBA_ASTC_12x12_KHR;

    case Format.ASTC_SRGBA_4X4: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
    case Format.ASTC_SRGBA_5X4: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;
    case Format.ASTC_SRGBA_5X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;
    case Format.ASTC_SRGBA_6X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;
    case Format.ASTC_SRGBA_6X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
    case Format.ASTC_SRGBA_8X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;
    case Format.ASTC_SRGBA_8X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;
    case Format.ASTC_SRGBA_8X8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
    case Format.ASTC_SRGBA_10X5: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;
    case Format.ASTC_SRGBA_10X6: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;
    case Format.ASTC_SRGBA_10X8: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;
    case Format.ASTC_SRGBA_10X10: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
    case Format.ASTC_SRGBA_12X10: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;
    case Format.ASTC_SRGBA_12X12: return WebGL2EXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

    default: {
        console.error('Unsupported Format, convert to WebGL format failed.');
        return gl.RGBA;
    }
    }
}

function GFXTypeToWebGLType (type: Type, gl: WebGL2RenderingContext): GLenum {
    switch (type) {
    case Type.BOOL: return gl.BOOL;
    case Type.BOOL2: return gl.BOOL_VEC2;
    case Type.BOOL3: return gl.BOOL_VEC3;
    case Type.BOOL4: return gl.BOOL_VEC4;
    case Type.INT: return gl.INT;
    case Type.INT2: return gl.INT_VEC2;
    case Type.INT3: return gl.INT_VEC3;
    case Type.INT4: return gl.INT_VEC4;
    case Type.UINT: return gl.UNSIGNED_INT;
    case Type.FLOAT: return gl.FLOAT;
    case Type.FLOAT2: return gl.FLOAT_VEC2;
    case Type.FLOAT3: return gl.FLOAT_VEC3;
    case Type.FLOAT4: return gl.FLOAT_VEC4;
    case Type.MAT2: return gl.FLOAT_MAT2;
    case Type.MAT2X3: return gl.FLOAT_MAT2x3;
    case Type.MAT2X4: return gl.FLOAT_MAT2x4;
    case Type.MAT3X2: return gl.FLOAT_MAT3x2;
    case Type.MAT3: return gl.FLOAT_MAT3;
    case Type.MAT3X4: return gl.FLOAT_MAT3x4;
    case Type.MAT4X2: return gl.FLOAT_MAT4x2;
    case Type.MAT4X3: return gl.FLOAT_MAT4x3;
    case Type.MAT4: return gl.FLOAT_MAT4;
    case Type.SAMPLER2D: return gl.SAMPLER_2D;
    case Type.SAMPLER2D_ARRAY: return gl.SAMPLER_2D_ARRAY;
    case Type.SAMPLER3D: return gl.SAMPLER_3D;
    case Type.SAMPLER_CUBE: return gl.SAMPLER_CUBE;
    default: {
        console.error('Unsupported GLType, convert to GL type failed.');
        return Type.UNKNOWN;
    }
    }
}

function WebGLTypeToGFXType (glType: GLenum, gl: WebGL2RenderingContext): Type {
    switch (glType) {
    case gl.BOOL: return Type.BOOL;
    case gl.BOOL_VEC2: return Type.BOOL2;
    case gl.BOOL_VEC3: return Type.BOOL3;
    case gl.BOOL_VEC4: return Type.BOOL4;
    case gl.INT: return Type.INT;
    case gl.INT_VEC2: return Type.INT2;
    case gl.INT_VEC3: return Type.INT3;
    case gl.INT_VEC4: return Type.INT4;
    case gl.UNSIGNED_INT: return Type.UINT;
    case gl.UNSIGNED_INT_VEC2: return Type.UINT2;
    case gl.UNSIGNED_INT_VEC3: return Type.UINT3;
    case gl.UNSIGNED_INT_VEC4: return Type.UINT4;
    case gl.FLOAT: return Type.FLOAT;
    case gl.FLOAT_VEC2: return Type.FLOAT2;
    case gl.FLOAT_VEC3: return Type.FLOAT3;
    case gl.FLOAT_VEC4: return Type.FLOAT4;
    case gl.FLOAT_MAT2: return Type.MAT2;
    case gl.FLOAT_MAT2x3: return Type.MAT2X3;
    case gl.FLOAT_MAT2x4: return Type.MAT2X4;
    case gl.FLOAT_MAT3x2: return Type.MAT3X2;
    case gl.FLOAT_MAT3: return Type.MAT3;
    case gl.FLOAT_MAT3x4: return Type.MAT3X4;
    case gl.FLOAT_MAT4x2: return Type.MAT4X2;
    case gl.FLOAT_MAT4x3: return Type.MAT4X3;
    case gl.FLOAT_MAT4: return Type.MAT4;
    case gl.SAMPLER_2D: return Type.SAMPLER2D;
    case gl.SAMPLER_2D_ARRAY: return Type.SAMPLER2D_ARRAY;
    case gl.SAMPLER_3D: return Type.SAMPLER3D;
    case gl.SAMPLER_CUBE: return Type.SAMPLER_CUBE;
    default: {
        console.error('Unsupported GLType, convert to Type failed.');
        return Type.UNKNOWN;
    }
    }
}

function WebGLGetTypeSize (glType: GLenum, gl: WebGL2RenderingContext): Type {
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
    case gl.UNSIGNED_INT_VEC2: return 8;
    case gl.UNSIGNED_INT_VEC3: return 12;
    case gl.UNSIGNED_INT_VEC4: return 16;
    case gl.FLOAT: return 4;
    case gl.FLOAT_VEC2: return 8;
    case gl.FLOAT_VEC3: return 12;
    case gl.FLOAT_VEC4: return 16;
    case gl.FLOAT_MAT2: return 16;
    case gl.FLOAT_MAT2x3: return 24;
    case gl.FLOAT_MAT2x4: return 32;
    case gl.FLOAT_MAT3x2: return 24;
    case gl.FLOAT_MAT3: return 36;
    case gl.FLOAT_MAT3x4: return 48;
    case gl.FLOAT_MAT4x2: return 32;
    case gl.FLOAT_MAT4x3: return 48;
    case gl.FLOAT_MAT4: return 64;
    case gl.SAMPLER_2D: return 4;
    case gl.SAMPLER_2D_ARRAY: return 4;
    case gl.SAMPLER_2D_ARRAY_SHADOW: return 4;
    case gl.SAMPLER_3D: return 4;
    case gl.SAMPLER_CUBE: return 4;
    case gl.INT_SAMPLER_2D: return 4;
    case gl.INT_SAMPLER_2D_ARRAY: return 4;
    case gl.INT_SAMPLER_3D: return 4;
    case gl.INT_SAMPLER_CUBE: return 4;
    case gl.UNSIGNED_INT_SAMPLER_2D: return 4;
    case gl.UNSIGNED_INT_SAMPLER_2D_ARRAY: return 4;
    case gl.UNSIGNED_INT_SAMPLER_3D: return 4;
    case gl.UNSIGNED_INT_SAMPLER_CUBE: return 4;
    default: {
        console.error('Unsupported GLType, get type failed.');
        return 0;
    }
    }
}

function WebGLGetComponentCount (glType: GLenum, gl: WebGL2RenderingContext): Type {
    switch (glType) {
    case gl.FLOAT_MAT2: return 2;
    case gl.FLOAT_MAT2x3: return 2;
    case gl.FLOAT_MAT2x4: return 2;
    case gl.FLOAT_MAT3x2: return 3;
    case gl.FLOAT_MAT3: return 3;
    case gl.FLOAT_MAT3x4: return 3;
    case gl.FLOAT_MAT4x2: return 4;
    case gl.FLOAT_MAT4x3: return 4;
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
    0x8007, // WebGL2RenderingContext.MIN,
    0x8008, // WebGL2RenderingContext.MAX,
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
    public refCount = 0;

    constructor (type: WebGL2Cmd) {
        this.cmdType = type;
    }

    public abstract clear ();
}

export class WebGL2CmdBeginRenderPass extends WebGL2CmdObject {
    public gpuRenderPass: IWebGL2GPURenderPass | null = null;
    public gpuFramebuffer: IWebGL2GPUFramebuffer | null = null;
    public renderArea = new Rect();
    public clearColors: Color[] = [];
    public clearDepth = 1.0;
    public clearStencil = 0;

    constructor () {
        super(WebGL2Cmd.BEGIN_RENDER_PASS);
    }

    public clear () {
        this.gpuFramebuffer = null;
        this.clearColors.length = 0;
    }
}

export class WebGL2CmdBindStates extends WebGL2CmdObject {
    public gpuPipelineState: IWebGL2GPUPipelineState | null = null;
    public gpuInputAssembler: IWebGL2GPUInputAssembler | null = null;
    public gpuDescriptorSets: IWebGL2GPUDescriptorSet[] = [];
    public dynamicOffsets: number[] = [];
    public dynamicStates: DynamicStates = new DynamicStates();

    constructor () {
        super(WebGL2Cmd.BIND_STATES);
    }

    public clear () {
        this.gpuPipelineState = null;
        this.gpuInputAssembler = null;
        this.gpuDescriptorSets.length = 0;
        this.dynamicOffsets.length = 0;
    }
}

export class WebGL2CmdDraw extends WebGL2CmdObject {
    public drawInfo = new DrawInfo();

    constructor () {
        super(WebGL2Cmd.DRAW);
    }

    public clear () {
    }
}

export class WebGL2CmdUpdateBuffer extends WebGL2CmdObject {
    public gpuBuffer: IWebGL2GPUBuffer | null = null;
    public buffer: BufferSource | null = null;
    public offset = 0;
    public size = 0;

    constructor () {
        super(WebGL2Cmd.UPDATE_BUFFER);
    }

    public clear () {
        this.gpuBuffer = null;
        this.buffer = null;
    }
}

export class WebGL2CmdCopyBufferToTexture extends WebGL2CmdObject {
    public gpuTexture: IWebGL2GPUTexture | null = null;
    public buffers: ArrayBufferView[] = [];
    public regions: BufferTextureCopy[] = [];

    constructor () {
        super(WebGL2Cmd.COPY_BUFFER_TO_TEXTURE);
    }

    public clear () {
        this.gpuTexture = null;
        this.buffers.length = 0;
        this.regions.length = 0;
    }
}

export class WebGL2CmdPackage {
    public cmds: CachedArray<WebGL2Cmd> = new CachedArray(1);
    public beginRenderPassCmds: CachedArray<WebGL2CmdBeginRenderPass> = new CachedArray(1);
    public bindStatesCmds: CachedArray<WebGL2CmdBindStates> = new CachedArray(1);
    public drawCmds: CachedArray<WebGL2CmdDraw> = new CachedArray(1);
    public updateBufferCmds: CachedArray<WebGL2CmdUpdateBuffer> = new CachedArray(1);
    public copyBufferToTextureCmds: CachedArray<WebGL2CmdCopyBufferToTexture> = new CachedArray(1);

    public clearCmds (allocator: WebGL2CommandAllocator) {
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

export function WebGL2CmdFuncCreateBuffer (device: WebGL2Device, gpuBuffer: IWebGL2GPUBuffer) {
    const { gl } = device;
    const cache = device.stateCache;
    const glUsage: GLenum = gpuBuffer.memUsage & MemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & BufferUsageBit.VERTEX) {
        gpuBuffer.glTarget = gl.ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();

        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.extensions.useVAO) {
                    if (cache.glVAO) {
                        gl.bindVertexArray(null);
                        cache.glVAO = gfxStateCache.gpuInputAssembler = null;
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
    } else if (gpuBuffer.usage & BufferUsageBit.INDEX) {
        gpuBuffer.glTarget = gl.ELEMENT_ARRAY_BUFFER;
        const glBuffer = gl.createBuffer();
        if (glBuffer) {
            gpuBuffer.glBuffer = glBuffer;
            if (gpuBuffer.size > 0) {
                if (device.extensions.useVAO) {
                    if (cache.glVAO) {
                        gl.bindVertexArray(null);
                        cache.glVAO = gfxStateCache.gpuInputAssembler = null;
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
    } else if (gpuBuffer.usage & BufferUsageBit.UNIFORM) {
        gpuBuffer.glTarget = gl.UNIFORM_BUFFER;
        const glBuffer = gl.createBuffer();
        if (glBuffer && gpuBuffer.size > 0) {
            gpuBuffer.glBuffer = glBuffer;
            if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glUniformBuffer = gpuBuffer.glBuffer;
            }

            gl.bufferData(gl.UNIFORM_BUFFER, gpuBuffer.size, glUsage);

            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            device.stateCache.glUniformBuffer = null;
        }
    } else if (gpuBuffer.usage & BufferUsageBit.INDIRECT) {
        gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & BufferUsageBit.TRANSFER_DST) {
        gpuBuffer.glTarget = gl.NONE;
    } else if (gpuBuffer.usage & BufferUsageBit.TRANSFER_SRC) {
        gpuBuffer.glTarget = gl.NONE;
    } else {
        console.error('Unsupported BufferType, create buffer failed.');
        gpuBuffer.glTarget = gl.NONE;
    }
}

export function WebGL2CmdFuncDestroyBuffer (device: WebGL2Device, gpuBuffer: IWebGL2GPUBuffer) {
    const { gl } = device;
    if (gpuBuffer.glBuffer) {
        // Firefox 75+ implicitly unbind whatever buffer there was on the slot sometimes
        // can be reproduced in the static batching scene at https://github.com/cocos-creator/test-cases-3d
        switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER:
            if (device.extensions.useVAO && device.stateCache.glVAO) {
                gl.bindVertexArray(null);
                device.stateCache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            device.stateCache.glArrayBuffer = null;
            break;
        case gl.ELEMENT_ARRAY_BUFFER:
            if (device.extensions.useVAO && device.stateCache.glVAO) {
                gl.bindVertexArray(null);
                device.stateCache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            device.stateCache.glElementArrayBuffer = null;
            break;
        case gl.UNIFORM_BUFFER:
            gl.bindBuffer(gl.UNIFORM_BUFFER, null);
            device.stateCache.glUniformBuffer = null;
            break;
        default:
        }

        gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = null;
    }
}

export function WebGL2CmdFuncResizeBuffer (device: WebGL2Device, gpuBuffer: IWebGL2GPUBuffer) {
    const { gl } = device;
    const cache = device.stateCache;
    const glUsage: GLenum = gpuBuffer.memUsage & MemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & BufferUsageBit.VERTEX) {
        if (device.extensions.useVAO) {
            if (cache.glVAO) {
                gl.bindVertexArray(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
        }

        if (cache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        if (gpuBuffer.buffer) {
            gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        cache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & BufferUsageBit.INDEX) {
        if (device.extensions.useVAO) {
            if (cache.glVAO) {
                gl.bindVertexArray(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }
        }

        if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        if (gpuBuffer.buffer) {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
        } else {
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.size, glUsage);
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        device.stateCache.glElementArrayBuffer = null;
    } else if (gpuBuffer.usage & BufferUsageBit.UNIFORM) {
        if (device.stateCache.glUniformBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
        }

        gl.bufferData(gl.UNIFORM_BUFFER, gpuBuffer.size, glUsage);
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        device.stateCache.glUniformBuffer = null;
    } else if ((gpuBuffer.usage & BufferUsageBit.INDIRECT)
            || (gpuBuffer.usage & BufferUsageBit.TRANSFER_DST)
            || (gpuBuffer.usage & BufferUsageBit.TRANSFER_SRC)) {
        gpuBuffer.glTarget = gl.NONE;
    } else {
        console.error('Unsupported BufferType, create buffer failed.');
        gpuBuffer.glTarget = gl.NONE;
    }
}

export function WebGL2CmdFuncUpdateBuffer (device: WebGL2Device, gpuBuffer: IWebGL2GPUBuffer, buffer: BufferSource, offset: number, size: number) {
    if (gpuBuffer.usage & BufferUsageBit.INDIRECT) {
        gpuBuffer.indirects.clearDraws();
        const drawInfos = (buffer as IndirectBuffer).drawInfos;
        for (let i = 0; i < drawInfos.length; ++i) {
            gpuBuffer.indirects.setDrawInfo(offset + i, drawInfos[i]);
        }
    } else {
        const buff = buffer as ArrayBuffer;
        const { gl } = device;
        const cache = device.stateCache;

        switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER: {
            if (cache.glVAO) {
                gl.bindVertexArray(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }

            if (cache.glArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
                cache.glArrayBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
                gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
                gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
            }
            break;
        }
        case gl.ELEMENT_ARRAY_BUFFER: {
            if (cache.glVAO) {
                gl.bindVertexArray(null);
                cache.glVAO = gfxStateCache.gpuInputAssembler = null;
            }

            if (cache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                cache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
                gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
                gl.bufferSubData(gpuBuffer.glTarget, offset, buff.slice(0, size));
            }
            break;
        }
        case gl.UNIFORM_BUFFER: {
            if (cache.glUniformBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.UNIFORM_BUFFER, gpuBuffer.glBuffer);
                cache.glUniformBuffer = gpuBuffer.glBuffer;
            }

            if (size === buff.byteLength) {
                gl.bufferSubData(gpuBuffer.glTarget, offset, buff);
            } else {
                gl.bufferSubData(gpuBuffer.glTarget, offset, new Float32Array(buff, 0, size / 4));
            }
            break;
        }
        default: {
            console.error('Unsupported BufferType, update buffer failed.');
        }
        }
    }
}

export function WebGL2CmdFuncCreateTexture (device: WebGL2Device, gpuTexture: IWebGL2GPUTexture) {
    const { gl } = device;

    gpuTexture.glInternalFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
    gpuTexture.glFormat = GFXFormatToWebGLFormat(gpuTexture.format, gl);
    gpuTexture.glType = GFXFormatToWebGLType(gpuTexture.format, gl);

    let w = gpuTexture.width;
    let h = gpuTexture.height;

    switch (gpuTexture.type) {
    case TextureType.TEX2D: {
        gpuTexture.glTarget = gl.TEXTURE_2D;
        if (gpuTexture.isSwapchainTexture) break;

        const maxSize = Math.max(w, h);
        if (maxSize > device.capabilities.maxTextureSize) {
            errorID(9100, maxSize, device.capabilities.maxTextureSize);
        }

        if (gpuTexture.samples === SampleCount.ONE) {
            const glTexture = gl.createTexture();
            if (glTexture && gpuTexture.size > 0) {
                gpuTexture.glTexture = glTexture;
                const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (gpuTexture.glInternalFmt === WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
                    // init 2 x 2 texture
                    const imgSize = FormatSize(gpuTexture.format, 2, 2, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_2D, 0, gpuTexture.glInternalFmt, 2, 2, 0, view);
                } else if (gpuTexture.flags & TextureFlagBit.IMMUTABLE) {
                    gl.texStorage2D(gl.TEXTURE_2D, gpuTexture.mipLevel, gpuTexture.glInternalFmt, w, h);
                } else if (!FormatInfos[gpuTexture.format].isCompressed) {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                        const view: Uint8Array = new Uint8Array(imgSize);
                        gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                }
            } else {
                gl.deleteTexture(glTexture);
            }
        } else {
            const glRenderbuffer = gl.createRenderbuffer();
            if (glRenderbuffer && gpuTexture.size > 0) {
                gpuTexture.glRenderbuffer = glRenderbuffer;
                if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                    gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                    device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
                }

                gl.renderbufferStorageMultisample(gl.RENDERBUFFER, gpuTexture.samples,
                    gpuTexture.glInternalFmt, gpuTexture.width, gpuTexture.height);
            }
        }
        break;
    }
    case TextureType.CUBE: {
        gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

        const maxSize = Math.max(w, h);
        if (maxSize > device.capabilities.maxCubeMapTextureSize) {
            errorID(9100, maxSize, device.capabilities.maxTextureSize);
        }

        const glTexture = gl.createTexture();
        if (glTexture && gpuTexture.size > 0) {
            gpuTexture.glTexture = glTexture;
            const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (gpuTexture.glInternalFmt === WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
                for (let f = 0; f < 6; ++f) {
                    const imgSize = FormatSize(gpuTexture.format, 2, 2, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, 0, gpuTexture.glInternalFmt, 2, 2, 0, view);
                }
            } else if (gpuTexture.flags & TextureFlagBit.IMMUTABLE) {
                gl.texStorage2D(gl.TEXTURE_CUBE_MAP, gpuTexture.mipLevel, gpuTexture.glInternalFmt, w, h);
            } else if (!FormatInfos[gpuTexture.format].isCompressed) {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    for (let f = 0; f < 6; ++f) {
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i,
                            gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                    }
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            } else {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    for (let f = 0; f < 6; ++f) {
                        gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternalFmt, w, h, 0, view);
                    }
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            }
        }
        break;
    }
    default: {
        console.error('Unsupported TextureType, create texture failed.');
        gpuTexture.type = TextureType.TEX2D;
        gpuTexture.glTarget = gl.TEXTURE_2D;
    }
    }
}

export function WebGL2CmdFuncDestroyTexture (device: WebGL2Device, gpuTexture: IWebGL2GPUTexture) {
    if (gpuTexture.glTexture) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = null;
    }

    if (gpuTexture.glRenderbuffer) {
        device.gl.deleteRenderbuffer(gpuTexture.glRenderbuffer);
        gpuTexture.glRenderbuffer = null;
    }
}

export function WebGL2CmdFuncResizeTexture (device: WebGL2Device, gpuTexture: IWebGL2GPUTexture) {
    const { gl } = device;

    let w = gpuTexture.width;
    let h = gpuTexture.height;

    switch (gpuTexture.type) {
    case TextureType.TEX2D: {
        gpuTexture.glTarget = gl.TEXTURE_2D;

        const maxSize = Math.max(w, h);
        if (maxSize > device.capabilities.maxTextureSize) {
            errorID(9100, maxSize, device.capabilities.maxTextureSize);
        }

        if (gpuTexture.samples === SampleCount.ONE) {
            const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (!FormatInfos[gpuTexture.format].isCompressed) {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            } else if (gpuTexture.glInternalFmt !== WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, view);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            }
        } else if (gpuTexture.glRenderbuffer && gpuTexture.size > 0) {
            if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
            }

            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, gpuTexture.samples,
                gpuTexture.glInternalFmt, gpuTexture.width, gpuTexture.height);
        }
        break;
    }
    case TextureType.CUBE: {
        gpuTexture.type = TextureType.CUBE;
        gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

        const maxSize = Math.max(w, h);
        if (maxSize > device.capabilities.maxCubeMapTextureSize) {
            errorID(9100, maxSize, device.capabilities.maxTextureSize);
        }

        const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
            glTexUnit.glTexture = gpuTexture.glTexture;
        }

        if (!FormatInfos[gpuTexture.format].isCompressed) {
            for (let f = 0; f < 6; ++f) {
                w = gpuTexture.width;
                h = gpuTexture.height;
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternalFmt, w, h,
                        0, gpuTexture.glFormat, gpuTexture.glType, null);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            }
        } else if (gpuTexture.glInternalFmt !== WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
            for (let f = 0; f < 6; ++f) {
                w = gpuTexture.width;
                h = gpuTexture.height;
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternalFmt, w, h, 0, view);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            }
        }
        break;
    }
    default: {
        console.error('Unsupported TextureType, create texture failed.');
        gpuTexture.type = TextureType.TEX2D;
        gpuTexture.glTarget = gl.TEXTURE_2D;
    }
    }
}

export function WebGL2CmdFuncCreateSampler (device: WebGL2Device, gpuSampler: IWebGL2GPUSampler) {
    const { gl } = device;
    const glSampler = gl.createSampler();
    if (glSampler) {
        if (gpuSampler.minFilter === Filter.LINEAR || gpuSampler.minFilter === Filter.ANISOTROPIC) {
            if (gpuSampler.mipFilter === Filter.LINEAR || gpuSampler.mipFilter === Filter.ANISOTROPIC) {
                gpuSampler.glMinFilter = gl.LINEAR_MIPMAP_LINEAR;
            } else if (gpuSampler.mipFilter === Filter.POINT) {
                gpuSampler.glMinFilter = gl.LINEAR_MIPMAP_NEAREST;
            } else {
                gpuSampler.glMinFilter = gl.LINEAR;
            }
        } else if (gpuSampler.mipFilter === Filter.LINEAR || gpuSampler.mipFilter === Filter.ANISOTROPIC) {
            gpuSampler.glMinFilter = gl.NEAREST_MIPMAP_LINEAR;
        } else if (gpuSampler.mipFilter === Filter.POINT) {
            gpuSampler.glMinFilter = gl.NEAREST_MIPMAP_NEAREST;
        } else {
            gpuSampler.glMinFilter = gl.NEAREST;
        }

        if (gpuSampler.magFilter === Filter.LINEAR || gpuSampler.magFilter === Filter.ANISOTROPIC) {
            gpuSampler.glMagFilter = gl.LINEAR;
        } else {
            gpuSampler.glMagFilter = gl.NEAREST;
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
        gl.samplerParameterf(glSampler, gl.TEXTURE_MIN_LOD, 0);
        gl.samplerParameterf(glSampler, gl.TEXTURE_MAX_LOD, 1000);
    }
}

export function WebGL2CmdFuncDestroySampler (device: WebGL2Device, gpuSampler: IWebGL2GPUSampler) {
    if (gpuSampler.glSampler) {
        device.gl.deleteSampler(gpuSampler.glSampler);
        gpuSampler.glSampler = null;
    }
}

export function WebGL2CmdFuncCreateFramebuffer (device: WebGL2Device, gpuFramebuffer: IWebGL2GPUFramebuffer) {
    let isOnscreen = false;
    for (let i = 0; i < gpuFramebuffer.gpuColorTextures.length; ++i) {
        if (!gpuFramebuffer.gpuColorTextures[i].glTexture) isOnscreen = true;
    }
    if (gpuFramebuffer.gpuDepthStencilTexture && !gpuFramebuffer.gpuDepthStencilTexture.glTexture) isOnscreen = true;
    if (isOnscreen) return;

    const { gl } = device;
    const attachments: GLenum[] = [];

    const glFramebuffer = gl.createFramebuffer();
    if (glFramebuffer) {
        gpuFramebuffer.glFramebuffer = glFramebuffer;

        if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
        }

        for (let i = 0; i < gpuFramebuffer.gpuColorTextures.length; ++i) {
            const colorTexture = gpuFramebuffer.gpuColorTextures[i];
            if (colorTexture) {
                if (colorTexture.glTexture) {
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0 + i,
                        colorTexture.glTarget,
                        colorTexture.glTexture,
                        0,
                    ); // level should be 0.
                } else {
                    gl.framebufferRenderbuffer(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0 + i,
                        gl.RENDERBUFFER,
                        colorTexture.glRenderbuffer,
                    );
                }

                attachments.push(gl.COLOR_ATTACHMENT0 + i);
            }
        }

        const dst = gpuFramebuffer.gpuDepthStencilTexture;
        if (dst) {
            const glAttachment = FormatInfos[dst.format].hasStencil ? gl.DEPTH_STENCIL_ATTACHMENT : gl.DEPTH_ATTACHMENT;
            if (dst.glTexture) {
                gl.framebufferTexture2D(
                    gl.FRAMEBUFFER,
                    glAttachment,
                    dst.glTarget,
                    dst.glTexture,
                    0,
                ); // level must be 0
            } else {
                gl.framebufferRenderbuffer(
                    gl.FRAMEBUFFER,
                    glAttachment,
                    gl.RENDERBUFFER,
                    dst.glRenderbuffer,
                );
            }
        }

        gl.drawBuffers(attachments);

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

        if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, device.stateCache.glFramebuffer);
        }
    }
}

export function WebGL2CmdFuncDestroyFramebuffer (device: WebGL2Device, gpuFramebuffer: IWebGL2GPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = null;
    }
}

export function WebGL2CmdFuncCreateShader (device: WebGL2Device, gpuShader: IWebGL2GPUShader) {
    const { gl } = device;

    for (let k = 0; k < gpuShader.gpuStages.length; k++) {
        const gpuStage = gpuShader.gpuStages[k];

        let glShaderType: GLenum = 0;
        let shaderTypeStr = '';
        let lineNumber = 1;

        switch (gpuStage.type) {
        case ShaderStageFlagBit.VERTEX: {
            shaderTypeStr = 'VertexShader';
            glShaderType = gl.VERTEX_SHADER;
            break;
        }
        case ShaderStageFlagBit.FRAGMENT: {
            shaderTypeStr = 'FragmentShader';
            glShaderType = gl.FRAGMENT_SHADER;
            break;
        }
        default: {
            console.error('Unsupported ShaderType.');
            return;
        }
        }

        const glShader = gl.createShader(glShaderType);
        if (glShader) {
            gpuStage.glShader = glShader;
            gl.shaderSource(gpuStage.glShader, `#version 300 es\n${gpuStage.source}`);
            gl.compileShader(gpuStage.glShader);

            if (!gl.getShaderParameter(gpuStage.glShader, gl.COMPILE_STATUS)) {
                console.error(`${shaderTypeStr} in '${gpuShader.name}' compilation failed.`);
                console.error('Shader source dump:', gpuStage.source.replace(/^|\n/g, () => `\n${lineNumber++} `));
                console.error(gl.getShaderInfoLog(gpuStage.glShader));

                for (let l = 0; l < gpuShader.gpuStages.length; l++) {
                    const stage = gpuShader.gpuStages[k];
                    if (stage.glShader) {
                        gl.deleteShader(stage.glShader);
                        stage.glShader = null;
                    }
                }
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
    for (let k = 0; k < gpuShader.gpuStages.length; k++) {
        const gpuStage = gpuShader.gpuStages[k];
        gl.attachShader(gpuShader.glProgram, gpuStage.glShader!);
    }

    gl.linkProgram(gpuShader.glProgram);

    // detach & delete immediately
    for (let k = 0; k < gpuShader.gpuStages.length; k++) {
        const gpuStage = gpuShader.gpuStages[k];
        if (gpuStage.glShader) {
            gl.detachShader(gpuShader.glProgram, gpuStage.glShader);
            gl.deleteShader(gpuStage.glShader);
            gpuStage.glShader = null;
        }
    }

    if (gl.getProgramParameter(gpuShader.glProgram, gl.LINK_STATUS)) {
        debug(`Shader '${gpuShader.name}' compilation succeeded.`);
    } else {
        console.error(`Failed to link shader '${gpuShader.name}'.`);
        console.error(gl.getProgramInfoLog(gpuShader.glProgram));
        return;
    }

    // parse inputs
    const activeAttribCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_ATTRIBUTES);
    gpuShader.glInputs = new Array<IWebGL2GPUInput>(activeAttribCount);

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
    let block: UniformBlock | null;

    if (activeBlockCount) {
        gpuShader.glBlocks = new Array<IWebGL2GPUUniformBlock>(activeBlockCount);

        for (let b = 0; b < activeBlockCount; ++b) {
            blockName = gl.getActiveUniformBlockName(gpuShader.glProgram, b)!;
            const nameOffset = blockName.indexOf('[');
            if (nameOffset !== -1) {
                blockName = blockName.substr(0, nameOffset);
            }

            // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);
            block = null;
            for (let k = 0; k < gpuShader.blocks.length; k++) {
                if (gpuShader.blocks[k].name === blockName) {
                    block = gpuShader.blocks[k];
                    break;
                }
            }

            if (!block) {
                error(`Block '${blockName}' does not bound`);
            } else {
                // blockIdx = gl.getUniformBlockIndex(gpuShader.glProgram, blockName);
                blockIdx = b;
                blockSize = gl.getActiveUniformBlockParameter(gpuShader.glProgram, blockIdx, gl.UNIFORM_BLOCK_DATA_SIZE);
                const glBinding = block.binding + (device.bindingMappingInfo.bufferOffsets[block.set] || 0);

                gl.uniformBlockBinding(gpuShader.glProgram, blockIdx, glBinding);

                gpuShader.glBlocks[b] = {
                    set: block.set,
                    binding: block.binding,
                    idx: blockIdx,
                    name: blockName,
                    size: blockSize,
                    glBinding,
                };
            }
        }
    }

    // create uniform samplers
    if (gpuShader.samplerTextures.length > 0) {
        gpuShader.glSamplerTextures = new Array<IWebGL2GPUUniformSamplerTexture>(gpuShader.samplerTextures.length);

        for (let i = 0; i < gpuShader.samplerTextures.length; ++i) {
            const sampler = gpuShader.samplerTextures[i];
            gpuShader.glSamplerTextures[i] = {
                set: sampler.set,
                binding: sampler.binding,
                name: sampler.name,
                type: sampler.type,
                count: sampler.count,
                units: [],
                glUnits: null!,
                glType: GFXTypeToWebGLType(sampler.type, gl),
                glLoc: null!,
            };
        }
    }

    // texture unit index mapping optimization
    const glActiveSamplers: IWebGL2GPUUniformSamplerTexture[] = [];
    const glActiveSamplerLocations: WebGLUniformLocation[] = [];
    const texUnitCacheMap = device.stateCache.texUnitCacheMap;

    let flexibleSetBaseOffset = 0;
    for (let i = 0; i < gpuShader.blocks.length; ++i) {
        if (gpuShader.blocks[i].set === device.bindingMappingInfo.flexibleSet) {
            flexibleSetBaseOffset++;
        }
    }

    let arrayOffset = 0;
    for (let i = 0; i < gpuShader.samplerTextures.length; ++i) {
        const sampler = gpuShader.samplerTextures[i];
        const glLoc = gl.getUniformLocation(gpuShader.glProgram, sampler.name);
        // Note: getUniformLocation return Object on wechat platform.
        if (glLoc !== null && (typeof glLoc === 'number' || (glLoc as any).id !== -1)) {
            glActiveSamplers.push(gpuShader.glSamplerTextures[i]);
            glActiveSamplerLocations.push(glLoc);
        }
        if (texUnitCacheMap[sampler.name] === undefined) {
            let binding = sampler.binding + device.bindingMappingInfo.samplerOffsets[sampler.set] + arrayOffset;
            if (sampler.set === device.bindingMappingInfo.flexibleSet) { binding -= flexibleSetBaseOffset; }
            texUnitCacheMap[sampler.name] = binding % device.capabilities.maxTextureUnits;
            arrayOffset += sampler.count - 1;
        }
    }

    if (glActiveSamplers.length) {
        const usedTexUnits: boolean[] = [];
        // try to reuse existing mappings first
        for (let i = 0; i < glActiveSamplers.length; ++i) {
            const glSampler = glActiveSamplers[i];

            let cachedUnit = texUnitCacheMap[glSampler.name];
            if (cachedUnit !== undefined) {
                glSampler.glLoc = glActiveSamplerLocations[i];
                for (let t = 0; t < glSampler.count; ++t) {
                    while (usedTexUnits[cachedUnit]) {
                        cachedUnit = (cachedUnit + 1) % device.capabilities.maxTextureUnits;
                    }
                    glSampler.units.push(cachedUnit);
                    usedTexUnits[cachedUnit] = true;
                }
            }
        }
        // fill in the rest sequencially
        let unitIdx = 0;
        for (let i = 0; i < glActiveSamplers.length; ++i) {
            const glSampler = glActiveSamplers[i];

            if (!glSampler.glLoc) {
                glSampler.glLoc = glActiveSamplerLocations[i];
                while (usedTexUnits[unitIdx]) { unitIdx++; }
                for (let t = 0; t < glSampler.count; ++t) {
                    while (usedTexUnits[unitIdx]) {
                        unitIdx = (unitIdx + 1) % device.capabilities.maxTextureUnits;
                    }
                    if (texUnitCacheMap[glSampler.name] === undefined) {
                        texUnitCacheMap[glSampler.name] = unitIdx;
                    }
                    glSampler.units.push(unitIdx);
                    usedTexUnits[unitIdx] = true;
                }
            }
        }

        if (device.stateCache.glProgram !== gpuShader.glProgram) {
            gl.useProgram(gpuShader.glProgram);
        }

        for (let k = 0; k < glActiveSamplers.length; k++) {
            const glSampler = glActiveSamplers[k];
            glSampler.glUnits = new Int32Array(glSampler.units);
            gl.uniform1iv(glSampler.glLoc, glSampler.glUnits);
        }

        if (device.stateCache.glProgram !== gpuShader.glProgram) {
            gl.useProgram(device.stateCache.glProgram);
        }
    }

    gpuShader.glSamplerTextures = glActiveSamplers;
}

export function WebGL2CmdFuncDestroyShader (device: WebGL2Device, gpuShader: IWebGL2GPUShader) {
    if (gpuShader.glProgram) {
        device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = null;
    }
}

export function WebGL2CmdFuncCreateInputAssember (device: WebGL2Device, gpuInputAssembler: IWebGL2GPUInputAssembler) {
    const { gl } = device;

    gpuInputAssembler.glAttribs = new Array<IWebGL2Attrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;
        // if (stream < gpuInputAssembler.gpuVertexBuffers.length) {

        const gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];

        const glType = GFXFormatToWebGLType(attrib.format, gl);
        const { size } = FormatInfos[attrib.format];

        gpuInputAssembler.glAttribs[i] = {
            name: attrib.name,
            glBuffer: gpuBuffer.glBuffer,
            glType,
            size,
            count: FormatInfos[attrib.format].count,
            stride: gpuBuffer.stride,
            componentCount: WebGLGetComponentCount(glType, gl),
            isNormalized: (attrib.isNormalized !== undefined ? attrib.isNormalized : false),
            isInstanced: (attrib.isInstanced !== undefined ? attrib.isInstanced : false),
            offset: offsets[stream],
        };

        offsets[stream] += size;
    }
}

export function WebGL2CmdFuncDestroyInputAssembler (device: WebGL2Device, gpuInputAssembler: IWebGL2GPUInputAssembler) {
    const it = gpuInputAssembler.glVAOs.values();
    let res = it.next();
    while (!res.done) {
        device.gl.deleteVertexArray(res.value);
        res = it.next();
    }
    gpuInputAssembler.glVAOs.clear();
}

interface IWebGL2StateCache {
    gpuPipelineState: IWebGL2GPUPipelineState | null;
    gpuInputAssembler: IWebGL2GPUInputAssembler | null;
    glPrimitive: number;
    invalidateAttachments: GLenum[];
}
const gfxStateCache: IWebGL2StateCache = {
    gpuPipelineState: null,
    gpuInputAssembler: null,
    glPrimitive: 0,
    invalidateAttachments: [],
};

export function WebGL2CmdFuncBeginRenderPass (
    device: WebGL2Device,
    gpuRenderPass: IWebGL2GPURenderPass | null,
    gpuFramebuffer: IWebGL2GPUFramebuffer | null,
    renderArea: Rect,
    clearColors: Color[],
    clearDepth: number,
    clearStencil: number,
) {
    const { gl } = device;
    const cache = device.stateCache;

    let clears: GLbitfield = 0;

    if (gpuFramebuffer && gpuRenderPass) {
        if (cache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
            cache.glFramebuffer = gpuFramebuffer.glFramebuffer;
        }

        if (cache.viewport.left !== renderArea.x
            || cache.viewport.top !== renderArea.y
            || cache.viewport.width !== renderArea.width
            || cache.viewport.height !== renderArea.height) {
            gl.viewport(renderArea.x, renderArea.y, renderArea.width, renderArea.height);

            cache.viewport.left = renderArea.x;
            cache.viewport.top = renderArea.y;
            cache.viewport.width = renderArea.width;
            cache.viewport.height = renderArea.height;
        }

        if (cache.scissorRect.x !== renderArea.x
            || cache.scissorRect.y !== renderArea.y
            || cache.scissorRect.width !== renderArea.width
            || cache.scissorRect.height !== renderArea.height) {
            gl.scissor(renderArea.x, renderArea.y, renderArea.width, renderArea.height);

            cache.scissorRect.x = renderArea.x;
            cache.scissorRect.y = renderArea.y;
            cache.scissorRect.width = renderArea.width;
            cache.scissorRect.height = renderArea.height;
        }

        gfxStateCache.invalidateAttachments.length = 0;

        for (let j = 0; j < clearColors.length; ++j) {
            const colorAttachment = gpuRenderPass.colorAttachments[j];

            if (colorAttachment.format !== Format.UNKNOWN) {
                switch (colorAttachment.loadOp) {
                case LoadOp.LOAD: break; // GL default behavior
                case LoadOp.CLEAR: {
                    if (cache.bs.targets[0].blendColorMask !== ColorMask.ALL) {
                        gl.colorMask(true, true, true, true);
                    }

                    if (!gpuFramebuffer.isOffscreen) {
                        const clearColor = clearColors[0];
                        gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
                        clears |= gl.COLOR_BUFFER_BIT;
                    } else {
                        _f32v4[0] = clearColors[j].x;
                        _f32v4[1] = clearColors[j].y;
                        _f32v4[2] = clearColors[j].z;
                        _f32v4[3] = clearColors[j].w;
                        gl.clearBufferfv(gl.COLOR, j, _f32v4);
                    }
                    break;
                }
                case LoadOp.DISCARD: {
                    // invalidate the framebuffer
                    gfxStateCache.invalidateAttachments.push(gl.COLOR_ATTACHMENT0 + j);
                    break;
                }
                default:
                }
            }
        } // if (curGPURenderPass)

        if (gpuRenderPass.depthStencilAttachment) {
            if (gpuRenderPass.depthStencilAttachment.format !== Format.UNKNOWN) {
                switch (gpuRenderPass.depthStencilAttachment.depthLoadOp) {
                case LoadOp.LOAD: break; // GL default behavior
                case LoadOp.CLEAR: {
                    if (!cache.dss.depthWrite) {
                        gl.depthMask(true);
                    }

                    gl.clearDepth(clearDepth);

                    clears |= gl.DEPTH_BUFFER_BIT;
                    break;
                }
                case LoadOp.DISCARD: {
                    // invalidate the framebuffer
                    gfxStateCache.invalidateAttachments.push(gl.DEPTH_ATTACHMENT);
                    break;
                }
                default:
                }

                if (FormatInfos[gpuRenderPass.depthStencilAttachment.format].hasStencil) {
                    switch (gpuRenderPass.depthStencilAttachment.stencilLoadOp) {
                    case LoadOp.LOAD: break; // GL default behavior
                    case LoadOp.CLEAR: {
                        if (!cache.dss.stencilWriteMaskFront) {
                            gl.stencilMaskSeparate(gl.FRONT, 0xffff);
                        }

                        if (!cache.dss.stencilWriteMaskBack) {
                            gl.stencilMaskSeparate(gl.BACK, 0xffff);
                        }

                        gl.clearStencil(clearStencil);
                        clears |= gl.STENCIL_BUFFER_BIT;
                        break;
                    }
                    case LoadOp.DISCARD: {
                        // invalidate the framebuffer
                        gfxStateCache.invalidateAttachments.push(gl.STENCIL_ATTACHMENT);
                        break;
                    }
                    default:
                    }
                }
            }
        } // if (curGPURenderPass.depthStencilAttachment)

        if (gpuFramebuffer.glFramebuffer && gfxStateCache.invalidateAttachments.length) {
            gl.invalidateFramebuffer(gl.FRAMEBUFFER, gfxStateCache.invalidateAttachments);
        }

        if (clears) {
            gl.clear(clears);
        }

        // restore states
        if (clears & gl.COLOR_BUFFER_BIT) {
            const colorMask = cache.bs.targets[0].blendColorMask;
            if (colorMask !== ColorMask.ALL) {
                const r = (colorMask & ColorMask.R) !== ColorMask.NONE;
                const g = (colorMask & ColorMask.G) !== ColorMask.NONE;
                const b = (colorMask & ColorMask.B) !== ColorMask.NONE;
                const a = (colorMask & ColorMask.A) !== ColorMask.NONE;
                gl.colorMask(r, g, b, a);
            }
        }

        if ((clears & gl.DEPTH_BUFFER_BIT)
            && !cache.dss.depthWrite) {
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
    } // if (gpuFramebuffer)
}

export function WebGL2CmdFuncBindStates (
    device: WebGL2Device,
    gpuPipelineState: IWebGL2GPUPipelineState | null,
    gpuInputAssembler: IWebGL2GPUInputAssembler | null,
    gpuDescriptorSets: IWebGL2GPUDescriptorSet[],
    dynamicOffsets: number[],
    dynamicStates: DynamicStates,
) {
    const { gl } = device;
    const cache = device.stateCache;
    const gpuShader = gpuPipelineState && gpuPipelineState.gpuShader;

    let isShaderChanged = false;

    // bind pipeline
    if (gpuPipelineState && gfxStateCache.gpuPipelineState !== gpuPipelineState) {
        gfxStateCache.gpuPipelineState = gpuPipelineState;
        gfxStateCache.glPrimitive = gpuPipelineState.glPrimitive;

        if (gpuShader) {
            const { glProgram } = gpuShader;
            if (cache.glProgram !== glProgram) {
                gl.useProgram(glProgram);
                cache.glProgram = glProgram;
                isShaderChanged = true;
            }
        }

        // rasterizer state
        const { rs } = gpuPipelineState;
        if (rs) {
            if (cache.rs.cullMode !== rs.cullMode) {
                switch (rs.cullMode) {
                case CullMode.NONE: {
                    gl.disable(gl.CULL_FACE);
                    break;
                }
                case CullMode.FRONT: {
                    gl.enable(gl.CULL_FACE);
                    gl.cullFace(gl.FRONT);
                    break;
                }
                case CullMode.BACK: {
                    gl.enable(gl.CULL_FACE);
                    gl.cullFace(gl.BACK);
                    break;
                }
                default:
                }

                device.stateCache.rs.cullMode = rs.cullMode;
            }

            const isFrontFaceCCW = rs.isFrontFaceCCW; // boolean XOR
            if (device.stateCache.rs.isFrontFaceCCW !== isFrontFaceCCW) {
                gl.frontFace(isFrontFaceCCW ? gl.CCW : gl.CW);
                device.stateCache.rs.isFrontFaceCCW = isFrontFaceCCW;
            }

            if ((device.stateCache.rs.depthBias !== rs.depthBias)
                || (device.stateCache.rs.depthBiasSlop !== rs.depthBiasSlop)) {
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
        const { dss } = gpuPipelineState;
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
            if ((cache.dss.stencilTestFront !== dss.stencilTestFront)
                || (cache.dss.stencilTestBack !== dss.stencilTestBack)) {
                if (dss.stencilTestFront || dss.stencilTestBack) {
                    gl.enable(gl.STENCIL_TEST);
                } else {
                    gl.disable(gl.STENCIL_TEST);
                }
                cache.dss.stencilTestFront = dss.stencilTestFront;
                cache.dss.stencilTestBack = dss.stencilTestBack;
            }

            if ((cache.dss.stencilFuncFront !== dss.stencilFuncFront)
                || (cache.dss.stencilRefFront !== dss.stencilRefFront)
                || (cache.dss.stencilReadMaskFront !== dss.stencilReadMaskFront)) {
                gl.stencilFuncSeparate(
                    gl.FRONT,
                    WebGLCmpFuncs[dss.stencilFuncFront],
                    dss.stencilRefFront,
                    dss.stencilReadMaskFront,
                );

                cache.dss.stencilFuncFront = dss.stencilFuncFront;
                cache.dss.stencilRefFront = dss.stencilRefFront;
                cache.dss.stencilReadMaskFront = dss.stencilReadMaskFront;
            }

            if ((cache.dss.stencilFailOpFront !== dss.stencilFailOpFront)
                || (cache.dss.stencilZFailOpFront !== dss.stencilZFailOpFront)
                || (cache.dss.stencilPassOpFront !== dss.stencilPassOpFront)) {
                gl.stencilOpSeparate(
                    gl.FRONT,
                    WebGLStencilOps[dss.stencilFailOpFront],
                    WebGLStencilOps[dss.stencilZFailOpFront],
                    WebGLStencilOps[dss.stencilPassOpFront],
                );

                cache.dss.stencilFailOpFront = dss.stencilFailOpFront;
                cache.dss.stencilZFailOpFront = dss.stencilZFailOpFront;
                cache.dss.stencilPassOpFront = dss.stencilPassOpFront;
            }

            if (cache.dss.stencilWriteMaskFront !== dss.stencilWriteMaskFront) {
                gl.stencilMaskSeparate(gl.FRONT, dss.stencilWriteMaskFront);
                cache.dss.stencilWriteMaskFront = dss.stencilWriteMaskFront;
            }

            // back
            if ((cache.dss.stencilFuncBack !== dss.stencilFuncBack)
                || (cache.dss.stencilRefBack !== dss.stencilRefBack)
                || (cache.dss.stencilReadMaskBack !== dss.stencilReadMaskBack)) {
                gl.stencilFuncSeparate(
                    gl.BACK,
                    WebGLCmpFuncs[dss.stencilFuncBack],
                    dss.stencilRefBack,
                    dss.stencilReadMaskBack,
                );

                cache.dss.stencilFuncBack = dss.stencilFuncBack;
                cache.dss.stencilRefBack = dss.stencilRefBack;
                cache.dss.stencilReadMaskBack = dss.stencilReadMaskBack;
            }

            if ((cache.dss.stencilFailOpBack !== dss.stencilFailOpBack)
                || (cache.dss.stencilZFailOpBack !== dss.stencilZFailOpBack)
                || (cache.dss.stencilPassOpBack !== dss.stencilPassOpBack)) {
                gl.stencilOpSeparate(
                    gl.BACK,
                    WebGLStencilOps[dss.stencilFailOpBack],
                    WebGLStencilOps[dss.stencilZFailOpBack],
                    WebGLStencilOps[dss.stencilPassOpBack],
                );

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
        const { bs } = gpuPipelineState;
        if (bs) {
            if (cache.bs.isA2C !== bs.isA2C) {
                if (bs.isA2C) {
                    gl.enable(gl.SAMPLE_ALPHA_TO_COVERAGE);
                } else {
                    gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
                }
                cache.bs.isA2C = bs.isA2C;
            }

            if ((cache.bs.blendColor.x !== bs.blendColor.x)
                || (cache.bs.blendColor.y !== bs.blendColor.y)
                || (cache.bs.blendColor.z !== bs.blendColor.z)
                || (cache.bs.blendColor.w !== bs.blendColor.w)) {
                gl.blendColor(bs.blendColor.x, bs.blendColor.y, bs.blendColor.z, bs.blendColor.w);

                cache.bs.blendColor.x = bs.blendColor.x;
                cache.bs.blendColor.y = bs.blendColor.y;
                cache.bs.blendColor.z = bs.blendColor.z;
                cache.bs.blendColor.w = bs.blendColor.w;
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

            if ((target0Cache.blendEq !== target0.blendEq)
                || (target0Cache.blendAlphaEq !== target0.blendAlphaEq)) {
                gl.blendEquationSeparate(WebGLBlendOps[target0.blendEq], WebGLBlendOps[target0.blendAlphaEq]);
                target0Cache.blendEq = target0.blendEq;
                target0Cache.blendAlphaEq = target0.blendAlphaEq;
            }

            if ((target0Cache.blendSrc !== target0.blendSrc)
                || (target0Cache.blendDst !== target0.blendDst)
                || (target0Cache.blendSrcAlpha !== target0.blendSrcAlpha)
                || (target0Cache.blendDstAlpha !== target0.blendDstAlpha)) {
                gl.blendFuncSeparate(
                    WebGLBlendFactors[target0.blendSrc],
                    WebGLBlendFactors[target0.blendDst],
                    WebGLBlendFactors[target0.blendSrcAlpha],
                    WebGLBlendFactors[target0.blendDstAlpha],
                );

                target0Cache.blendSrc = target0.blendSrc;
                target0Cache.blendDst = target0.blendDst;
                target0Cache.blendSrcAlpha = target0.blendSrcAlpha;
                target0Cache.blendDstAlpha = target0.blendDstAlpha;
            }

            if (target0Cache.blendColorMask !== target0.blendColorMask) {
                gl.colorMask(
                    (target0.blendColorMask & ColorMask.R) !== ColorMask.NONE,
                    (target0.blendColorMask & ColorMask.G) !== ColorMask.NONE,
                    (target0.blendColorMask & ColorMask.B) !== ColorMask.NONE,
                    (target0.blendColorMask & ColorMask.A) !== ColorMask.NONE,
                );

                target0Cache.blendColorMask = target0.blendColorMask;
            }
        } // blend state
    } // bind pipeline

    // bind descriptor sets
    if (gpuPipelineState && gpuPipelineState.gpuPipelineLayout && gpuShader) {
        const blockLen = gpuShader.glBlocks.length;
        const { dynamicOffsetIndices } = gpuPipelineState.gpuPipelineLayout;

        for (let j = 0; j < blockLen; j++) {
            const glBlock = gpuShader.glBlocks[j];
            const gpuDescriptorSet = gpuDescriptorSets[glBlock.set];
            const descriptorIndex = gpuDescriptorSet && gpuDescriptorSet.descriptorIndices[glBlock.binding];
            const gpuDescriptor = descriptorIndex >= 0 && gpuDescriptorSet.gpuDescriptors[descriptorIndex];

            if (!gpuDescriptor || !gpuDescriptor.gpuBuffer) {
                error(`Buffer binding '${glBlock.name}' at set ${glBlock.set} binding ${glBlock.binding} is not bounded`);
                continue;
            }

            const dynamicOffsetIndexSet = dynamicOffsetIndices[glBlock.set];
            const dynamicOffsetIndex = dynamicOffsetIndexSet && dynamicOffsetIndexSet[glBlock.binding];
            let offset = gpuDescriptor.gpuBuffer.glOffset;
            if (dynamicOffsetIndex >= 0) { offset += dynamicOffsets[dynamicOffsetIndex]; }

            if (cache.glBindUBOs[glBlock.glBinding] !== gpuDescriptor.gpuBuffer.glBuffer
                || cache.glBindUBOOffsets[glBlock.glBinding] !== offset) {
                if (offset) {
                    gl.bindBufferRange(gl.UNIFORM_BUFFER, glBlock.glBinding, gpuDescriptor.gpuBuffer.glBuffer,
                        offset, gpuDescriptor.gpuBuffer.size);
                } else {
                    gl.bindBufferBase(gl.UNIFORM_BUFFER, glBlock.glBinding, gpuDescriptor.gpuBuffer.glBuffer);
                }
                cache.glUniformBuffer = cache.glBindUBOs[glBlock.glBinding] = gpuDescriptor.gpuBuffer.glBuffer;
                cache.glBindUBOOffsets[glBlock.glBinding] = offset;
            }
        }

        const samplerLen = gpuShader.glSamplerTextures.length;
        for (let i = 0; i < samplerLen; i++) {
            const glSampler = gpuShader.glSamplerTextures[i];
            const gpuDescriptorSet = gpuDescriptorSets[glSampler.set];
            let descriptorIndex = gpuDescriptorSet && gpuDescriptorSet.descriptorIndices[glSampler.binding];
            let gpuDescriptor = descriptorIndex >= 0 && gpuDescriptorSet.gpuDescriptors[descriptorIndex];

            for (let l = 0; l < glSampler.units.length; l++) {
                const texUnit = glSampler.units[l];

                const glTexUnit = cache.glTexUnits[texUnit];

                if (!gpuDescriptor || !gpuDescriptor.gpuTexture || !gpuDescriptor.gpuSampler) {
                    error(`Sampler binding '${glSampler.name}' at set ${glSampler.set} binding ${glSampler.binding} index ${l} is not bounded`);
                    continue;
                }

                if (gpuDescriptor.gpuTexture
                    && gpuDescriptor.gpuTexture.size > 0) {
                    const { gpuTexture } = gpuDescriptor;
                    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                        if (cache.texUnit !== texUnit) {
                            gl.activeTexture(gl.TEXTURE0 + texUnit);
                            cache.texUnit = texUnit;
                        }
                        if (gpuTexture.glTexture) {
                            gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
                        } else {
                            gl.bindTexture(gpuTexture.glTarget, device.nullTex2D.gpuTexture.glTexture);
                        }
                        glTexUnit.glTexture = gpuTexture.glTexture;
                    }

                    const { gpuSampler } = gpuDescriptor;
                    if (cache.glSamplerUnits[texUnit] !== gpuSampler.glSampler) {
                        gl.bindSampler(texUnit, gpuSampler.glSampler);
                        cache.glSamplerUnits[texUnit] = gpuSampler.glSampler;
                    }
                }

                gpuDescriptor = gpuDescriptorSet.gpuDescriptors[++descriptorIndex];
            }
        }
    } // bind descriptor sets

    // bind vertex/index buffer
    if (gpuInputAssembler && gpuShader
        && (isShaderChanged || gfxStateCache.gpuInputAssembler !== gpuInputAssembler)) {
        gfxStateCache.gpuInputAssembler = gpuInputAssembler;

        if (device.extensions.useVAO) {
            // check vao
            let glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram!);
            if (!glVAO) {
                glVAO = gl.createVertexArray()!;
                gpuInputAssembler.glVAOs.set(gpuShader.glProgram!, glVAO);

                gl.bindVertexArray(glVAO);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                cache.glArrayBuffer = null;
                cache.glElementArrayBuffer = null;

                let glAttrib: IWebGL2Attrib | null;
                for (let j = 0; j < gpuShader.glInputs.length; j++) {
                    const glInput = gpuShader.glInputs[j];
                    glAttrib = null;

                    for (let k = 0; k < gpuInputAssembler.glAttribs.length; k++) {
                        const attrib = gpuInputAssembler.glAttribs[k];
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
                            gl.vertexAttribDivisor(glLoc, glAttrib.isInstanced ? 1 : 0);
                        }
                    }
                }

                const gpuBuffer = gpuInputAssembler.gpuIndexBuffer;
                if (gpuBuffer) {
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                }

                gl.bindVertexArray(null);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                cache.glArrayBuffer = null;
                cache.glElementArrayBuffer = null;
            }

            if (cache.glVAO !== glVAO) {
                gl.bindVertexArray(glVAO);
                cache.glVAO = glVAO;
            }
        } else {
            for (let a = 0; a < device.capabilities.maxVertexAttributes; ++a) {
                cache.glCurrentAttribLocs[a] = false;
            }

            for (let j = 0; j < gpuShader.glInputs.length; j++) {
                const glInput = gpuShader.glInputs[j];
                let glAttrib: IWebGL2Attrib | null = null;

                for (let k = 0; k < gpuInputAssembler.glAttribs.length; k++) {
                    const attrib = gpuInputAssembler.glAttribs[k];
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
                        gl.vertexAttribDivisor(glLoc, glAttrib.isInstanced ? 1 : 0);
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

            for (let a = 0; a < device.capabilities.maxVertexAttributes; ++a) {
                if (cache.glEnabledAttribLocs[a] !== cache.glCurrentAttribLocs[a]) {
                    gl.disableVertexAttribArray(a);
                    cache.glEnabledAttribLocs[a] = false;
                }
            }
        }
    } // bind vertex/index buffer

    // update dynamic states
    if (gpuPipelineState && gpuPipelineState.dynamicStates.length) {
        const dsLen = gpuPipelineState.dynamicStates.length;
        for (let k = 0; k < dsLen; k++) {
            const dynamicState = gpuPipelineState.dynamicStates[k];
            switch (dynamicState) {
            case DynamicStateFlagBit.VIEWPORT: {
                const viewport = dynamicStates.viewport;
                if (cache.viewport.left !== viewport.left
                    || cache.viewport.top !== viewport.top
                    || cache.viewport.width !== viewport.width
                    || cache.viewport.height !== viewport.height) {
                    gl.viewport(viewport.left, viewport.top, viewport.width, viewport.height);

                    cache.viewport.left = viewport.left;
                    cache.viewport.top = viewport.top;
                    cache.viewport.width = viewport.width;
                    cache.viewport.height = viewport.height;
                }
                break;
            }
            case DynamicStateFlagBit.SCISSOR: {
                const scissor = dynamicStates.scissor;
                if (cache.scissorRect.x !== scissor.x
                    || cache.scissorRect.y !== scissor.y
                    || cache.scissorRect.width !== scissor.width
                    || cache.scissorRect.height !== scissor.height) {
                    gl.scissor(scissor.x, scissor.y, scissor.width, scissor.height);

                    cache.scissorRect.x = scissor.x;
                    cache.scissorRect.y = scissor.y;
                    cache.scissorRect.width = scissor.width;
                    cache.scissorRect.height = scissor.height;
                }
                break;
            }
            case DynamicStateFlagBit.LINE_WIDTH: {
                if (cache.rs.lineWidth !== dynamicStates.lineWidth) {
                    gl.lineWidth(dynamicStates.lineWidth);
                    cache.rs.lineWidth = dynamicStates.lineWidth;
                }
                break;
            }
            case DynamicStateFlagBit.DEPTH_BIAS: {
                if (cache.rs.depthBias !== dynamicStates.depthBiasConstant
                    || cache.rs.depthBiasSlop !== dynamicStates.depthBiasSlope) {
                    gl.polygonOffset(dynamicStates.depthBiasConstant, dynamicStates.depthBiasSlope);
                    cache.rs.depthBias = dynamicStates.depthBiasConstant;
                    cache.rs.depthBiasSlop = dynamicStates.depthBiasSlope;
                }
                break;
            }
            case DynamicStateFlagBit.BLEND_CONSTANTS: {
                const blendConstant = dynamicStates.blendConstant;
                if ((cache.bs.blendColor.x !== blendConstant.x)
                    || (cache.bs.blendColor.y !== blendConstant.y)
                    || (cache.bs.blendColor.z !== blendConstant.z)
                    || (cache.bs.blendColor.w !== blendConstant.w)) {
                    gl.blendColor(blendConstant.x, blendConstant.y, blendConstant.z, blendConstant.w);
                    cache.bs.blendColor.copy(blendConstant);
                }
                break;
            }
            case DynamicStateFlagBit.STENCIL_WRITE_MASK: {
                const front = dynamicStates.stencilStatesFront;
                const back = dynamicStates.stencilStatesBack;
                if (cache.dss.stencilWriteMaskFront !== front.writeMask) {
                    gl.stencilMaskSeparate(gl.FRONT, front.writeMask);
                    cache.dss.stencilWriteMaskFront = front.writeMask;
                }
                if (cache.dss.stencilWriteMaskBack !== back.writeMask) {
                    gl.stencilMaskSeparate(gl.BACK, back.writeMask);
                    cache.dss.stencilWriteMaskBack = back.writeMask;
                }
                break;
            }
            case DynamicStateFlagBit.STENCIL_COMPARE_MASK: {
                const front = dynamicStates.stencilStatesFront;
                const back = dynamicStates.stencilStatesBack;
                if (cache.dss.stencilRefFront !== front.reference
                    || cache.dss.stencilReadMaskFront !== front.compareMask) {
                    gl.stencilFuncSeparate(gl.FRONT, WebGLCmpFuncs[cache.dss.stencilFuncFront], front.reference, front.compareMask);
                    cache.dss.stencilRefFront = front.reference;
                    cache.dss.stencilReadMaskFront = front.compareMask;
                }
                if (cache.dss.stencilRefBack !== back.reference
                    || cache.dss.stencilReadMaskBack !== back.compareMask) {
                    gl.stencilFuncSeparate(gl.BACK, WebGLCmpFuncs[cache.dss.stencilFuncBack], back.reference, back.compareMask);
                    cache.dss.stencilRefBack = back.reference;
                    cache.dss.stencilReadMaskBack = back.compareMask;
                }
                break;
            }
            default:
            } // switch
        } // for
    } // update dynamic states
}

export function WebGL2CmdFuncDraw (device: WebGL2Device, drawInfo: DrawInfo) {
    const { gl } = device;
    const { gpuInputAssembler, glPrimitive } = gfxStateCache;
    const md = device.extensions.WEBGL_multi_draw;

    if (gpuInputAssembler) {
        const indexBuffer = gpuInputAssembler.gpuIndexBuffer;
        if (gpuInputAssembler.gpuIndirectBuffer) {
            const { indirects } = gpuInputAssembler.gpuIndirectBuffer;
            if (indirects.drawByIndex) {
                for (let j = 0; j < indirects.drawCount; j++) {
                    indirects.byteOffsets[j] = indirects.offsets[j] * indexBuffer!.stride;
                }
                if (md) {
                    if (indirects.instancedDraw) {
                        md.multiDrawElementsInstancedWEBGL(glPrimitive,
                            indirects.counts, 0,
                            gpuInputAssembler.glIndexType,
                            indirects.byteOffsets, 0,
                            indirects.instances, 0,
                            indirects.drawCount);
                    } else {
                        md.multiDrawElementsWEBGL(glPrimitive,
                            indirects.counts, 0,
                            gpuInputAssembler.glIndexType,
                            indirects.byteOffsets, 0,
                            indirects.drawCount);
                    }
                } else {
                    for (let j = 0; j < indirects.drawCount; j++) {
                        if (indirects.instances[j] > 1) {
                            gl.drawElementsInstanced(glPrimitive, indirects.counts[j],
                                gpuInputAssembler.glIndexType, indirects.byteOffsets[j], indirects.instances[j]);
                        } else {
                            gl.drawElements(glPrimitive, indirects.counts[j], gpuInputAssembler.glIndexType, indirects.byteOffsets[j]);
                        }
                    }
                }
            } else if (md) {
                if (indirects.instancedDraw) {
                    md.multiDrawArraysInstancedWEBGL(glPrimitive,
                        indirects.offsets, 0,
                        indirects.counts, 0,
                        indirects.instances, 0,
                        indirects.drawCount);
                } else {
                    md.multiDrawArraysWEBGL(glPrimitive,
                        indirects.offsets, 0,
                        indirects.counts, 0,
                        indirects.drawCount);
                }
            } else {
                for (let j = 0; j < indirects.drawCount; j++) {
                    if (indirects.instances[j] > 1) {
                        gl.drawArraysInstanced(glPrimitive, indirects.offsets[j], indirects.counts[j], indirects.instances[j]);
                    } else {
                        gl.drawArrays(glPrimitive, indirects.offsets[j], indirects.counts[j]);
                    }
                }
            }
        } else if (drawInfo.instanceCount) {
            if (indexBuffer) {
                if (drawInfo.indexCount > 0) {
                    const offset = drawInfo.firstIndex * indexBuffer.stride;
                    gl.drawElementsInstanced(glPrimitive, drawInfo.indexCount,
                        gpuInputAssembler.glIndexType, offset, drawInfo.instanceCount);
                }
            } else if (drawInfo.vertexCount > 0) {
                gl.drawArraysInstanced(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount);
            }
        } else if (indexBuffer) {
            if (drawInfo.indexCount > 0) {
                const offset = drawInfo.firstIndex * indexBuffer.stride;
                gl.drawElements(glPrimitive, drawInfo.indexCount, gpuInputAssembler.glIndexType, offset);
            }
        } else if (drawInfo.vertexCount > 0) {
            gl.drawArrays(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount);
        }
    }
}

const cmdIds = new Array<number>(WebGL2Cmd.COUNT);
export function WebGL2CmdFuncExecuteCmds (device: WebGL2Device, cmdPackage: WebGL2CmdPackage) {
    cmdIds.fill(0);

    for (let i = 0; i < cmdPackage.cmds.length; ++i) {
        const cmd = cmdPackage.cmds.array[i];
        const cmdId = cmdIds[cmd]++;

        switch (cmd) {
        case WebGL2Cmd.BEGIN_RENDER_PASS: {
            const cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];
            WebGL2CmdFuncBeginRenderPass(device, cmd0.gpuRenderPass, cmd0.gpuFramebuffer, cmd0.renderArea,
                cmd0.clearColors, cmd0.clearDepth, cmd0.clearStencil);
            break;
        }
        /*
            case WebGL2Cmd.END_RENDER_PASS: {
                // WebGL 2.0 doesn't support store operation of attachments.
                // StoreOp.Store is the default GL behavior.
                break;
            }
            */
        case WebGL2Cmd.BIND_STATES: {
            const cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
            WebGL2CmdFuncBindStates(device, cmd2.gpuPipelineState, cmd2.gpuInputAssembler,
                cmd2.gpuDescriptorSets, cmd2.dynamicOffsets, cmd2.dynamicStates);
            break;
        }
        case WebGL2Cmd.DRAW: {
            const cmd3 = cmdPackage.drawCmds.array[cmdId];
            WebGL2CmdFuncDraw(device, cmd3.drawInfo);
            break;
        }
        case WebGL2Cmd.UPDATE_BUFFER: {
            const cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
            WebGL2CmdFuncUpdateBuffer(device, cmd4.gpuBuffer as IWebGL2GPUBuffer, cmd4.buffer as BufferSource, cmd4.offset, cmd4.size);
            break;
        }
        case WebGL2Cmd.COPY_BUFFER_TO_TEXTURE: {
            const cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
            WebGL2CmdFuncCopyBuffersToTexture(device, cmd5.buffers, cmd5.gpuTexture as IWebGL2GPUTexture, cmd5.regions);
            break;
        }
        default:
        } // switch
    } // for
}

export function WebGL2CmdFuncCopyTexImagesToTexture (
    device: WebGL2Device,
    texImages: TexImageSource[],
    gpuTexture: IWebGL2GPUTexture,
    regions: BufferTextureCopy[],
) {
    const { gl } = device;
    const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];
    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
        gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
        glTexUnit.glTexture = gpuTexture.glTexture;
    }

    let n = 0;
    let f = 0;

    switch (gpuTexture.glTarget) {
    case gl.TEXTURE_2D: {
        for (let k = 0; k < regions.length; k++) {
            const region = regions[k];
            gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                region.texOffset.x, region.texOffset.y,
                gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
        }
        break;
    }
    case gl.TEXTURE_CUBE_MAP: {
        for (let k = 0; k < regions.length; k++) {
            const region = regions[k];
            const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
            for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                    region.texOffset.x, region.texOffset.y,
                    gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
            }
        }
        break;
    }
    default: {
        console.error('Unsupported GL texture type, copy buffer to texture failed.');
    }
    }

    if (gpuTexture.flags & TextureFlagBit.GEN_MIPMAP) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}

export function WebGL2CmdFuncCopyBuffersToTexture (
    device: WebGL2Device,
    buffers: ArrayBufferView[],
    gpuTexture: IWebGL2GPUTexture,
    regions: BufferTextureCopy[],
) {
    const { gl } = device;
    const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];
    if (glTexUnit.glTexture !== gpuTexture.glTexture) {
        gl.bindTexture(gpuTexture.glTarget, gpuTexture.glTexture);
        glTexUnit.glTexture = gpuTexture.glTexture;
    }

    let n = 0;
    let w = 1;
    let h = 1;
    let f = 0;
    const fmtInfo: FormatInfo = FormatInfos[gpuTexture.format];
    const { isCompressed } = fmtInfo;

    switch (gpuTexture.glTarget) {
    case gl.TEXTURE_2D: {
        for (let k = 0; k < regions.length; k++) {
            const region = regions[k];
            w = region.texExtent.width;
            h = region.texExtent.height;
            const pixels = buffers[n++];
            if (!isCompressed) {
                gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    region.texOffset.x, region.texOffset.y, w, h,
                    gpuTexture.glFormat, gpuTexture.glType, pixels);
            } else if (gpuTexture.glInternalFmt !== WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
                gl.compressedTexSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    region.texOffset.x, region.texOffset.y, w, h,
                    gpuTexture.glFormat, pixels);
            } else {
                gl.compressedTexImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    gpuTexture.glInternalFmt, w, h, 0, pixels);
            }
        }
        break;
    }
    case gl.TEXTURE_CUBE_MAP: {
        for (let k = 0; k < regions.length; k++) {
            const region = regions[k];
            const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
            for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                w = region.texExtent.width;
                h = region.texExtent.height;

                const pixels = buffers[n++];

                if (!isCompressed) {
                    gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                        region.texOffset.x, region.texOffset.y, w, h,
                        gpuTexture.glFormat, gpuTexture.glType, pixels);
                } else if (gpuTexture.glInternalFmt !== WebGL2EXT.COMPRESSED_RGB_ETC1_WEBGL) {
                    gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                        region.texOffset.x, region.texOffset.y, w, h,
                        gpuTexture.glFormat, pixels);
                } else {
                    gl.compressedTexImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                        gpuTexture.glInternalFmt, w, h, 0, pixels);
                }
            }
        }
        break;
    }
    default: {
        console.error('Unsupported GL texture type, copy buffer to texture failed.');
    }
    }

    if (gpuTexture.flags & TextureFlagBit.GEN_MIPMAP) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}

export function WebGL2CmdFuncCopyTextureToBuffers (
    device: WebGL2Device,
    gpuTexture: IWebGL2GPUTexture,
    buffers: ArrayBufferView[],
    regions: BufferTextureCopy[],
) {
    const { gl } = device;
    const cache = device.stateCache;

    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    let x = 0;
    let y = 0;
    let w = 1;
    let h = 1;

    switch (gpuTexture.glTarget) {
    case gl.TEXTURE_2D: {
        for (let k = 0; k < regions.length; k++) {
            const region = regions[k];
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gpuTexture.glTarget, gpuTexture.glTexture, region.texSubres.mipLevel);
            x = region.texOffset.x;
            y = region.texOffset.y;
            w = region.texExtent.width;
            h = region.texExtent.height;
            gl.readPixels(x, y, w, h, gpuTexture.glFormat, gpuTexture.glType, buffers[k]);
        }
        break;
    }
    default: {
        console.error('Unsupported GL texture type, copy texture to buffers failed.');
    }
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    cache.glFramebuffer = null;
    gl.deleteFramebuffer(framebuffer);
}

export function WebGL2CmdFuncBlitFramebuffer (
    device: WebGL2Device,
    src: IWebGL2GPUFramebuffer,
    dst: IWebGL2GPUFramebuffer,
    srcRect: Rect,
    dstRect: Rect,
    filter: Filter,
) {
    const { gl } = device;

    if (device.stateCache.glReadFramebuffer !== src.glFramebuffer) {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, src.glFramebuffer);
        device.stateCache.glReadFramebuffer = src.glFramebuffer;
    }

    const rebindFBO = (dst.glFramebuffer !== device.stateCache.glFramebuffer);
    if (rebindFBO) {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, dst.glFramebuffer);
    }

    let mask = 0;
    if (src.gpuColorTextures.length > 0) {
        mask |= gl.COLOR_BUFFER_BIT;
    }

    if (src.gpuDepthStencilTexture) {
        mask |= gl.DEPTH_BUFFER_BIT;
        if (FormatInfos[src.gpuDepthStencilTexture.format].hasStencil) {
            mask |= gl.STENCIL_BUFFER_BIT;
        }
    }

    const glFilter = (filter === Filter.LINEAR || filter === Filter.ANISOTROPIC) ? gl.LINEAR : gl.NEAREST;

    gl.blitFramebuffer(
        srcRect.x, srcRect.y, srcRect.x + srcRect.width, srcRect.y + srcRect.height,
        dstRect.x, dstRect.y, dstRect.x + dstRect.width, dstRect.y + dstRect.height,
        mask, glFilter,
    );

    if (rebindFBO) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, device.stateCache.glFramebuffer);
    }
}
