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
import { debug, error, errorID } from '../../platform/debug';
import { WebGLCommandAllocator } from './webgl-command-allocator';
import { WebGLEXT } from './webgl-define';
import { WebGLDevice } from './webgl-device';
import {
    IWebGLGPUInputAssembler, IWebGLGPUUniform, IWebGLAttrib, IWebGLGPUDescriptorSet, IWebGLGPUBuffer, IWebGLGPUFramebuffer, IWebGLGPUInput,
    IWebGLGPUPipelineState, IWebGLGPUShader, IWebGLGPUTexture, IWebGLGPUUniformBlock, IWebGLGPUUniformSamplerTexture, IWebGLGPURenderPass,
} from './webgl-gpu-objects';
import {
    BufferUsageBit, ClearFlagBit, ClearFlags, ColorMask, CullMode, Format, BufferTextureCopy, Color, Rect,
    FormatInfos, FormatSize, LoadOp, MemoryUsageBit, ShaderStageFlagBit, UniformSamplerTexture,
    TextureFlagBit, TextureType, Type, FormatInfo, DynamicStateFlagBit, BufferSource, DrawInfo, IndirectBuffer, DynamicStates,
} from '../base/define';

export function GFXFormatToWebGLType (format: Format, gl: WebGLRenderingContext): GLenum {
    switch (format) {
    case Format.R8: return gl.UNSIGNED_BYTE;
    case Format.R8SN: return gl.BYTE;
    case Format.R8UI: return gl.UNSIGNED_BYTE;
    case Format.R8I: return gl.BYTE;
    case Format.R16F: return WebGLEXT.HALF_FLOAT_OES;
    case Format.R16UI: return gl.UNSIGNED_SHORT;
    case Format.R16I: return gl.SHORT;
    case Format.R32F: return gl.FLOAT;
    case Format.R32UI: return gl.UNSIGNED_INT;
    case Format.R32I: return gl.INT;

    case Format.RG8: return gl.UNSIGNED_BYTE;
    case Format.RG8SN: return gl.BYTE;
    case Format.RG8UI: return gl.UNSIGNED_BYTE;
    case Format.RG8I: return gl.BYTE;
    case Format.RG16F: return WebGLEXT.HALF_FLOAT_OES;
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
    case Format.RGB16F: return WebGLEXT.HALF_FLOAT_OES;
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
    case Format.RGBA16F: return WebGLEXT.HALF_FLOAT_OES;
    case Format.RGBA16UI: return gl.UNSIGNED_SHORT;
    case Format.RGBA16I: return gl.SHORT;
    case Format.RGBA32F: return gl.FLOAT;
    case Format.RGBA32UI: return gl.UNSIGNED_INT;
    case Format.RGBA32I: return gl.INT;

    case Format.R5G6B5: return gl.UNSIGNED_SHORT_5_6_5;
    case Format.R11G11B10F: return gl.FLOAT;
    case Format.RGB5A1: return gl.UNSIGNED_SHORT_5_5_5_1;
    case Format.RGBA4: return gl.UNSIGNED_SHORT_4_4_4_4;
    case Format.RGB10A2: return gl.UNSIGNED_BYTE;
    case Format.RGB10A2UI: return gl.UNSIGNED_INT;
    case Format.RGB9E5: return gl.UNSIGNED_BYTE;

    case Format.DEPTH: return gl.UNSIGNED_INT;
    case Format.DEPTH_STENCIL: return WebGLEXT.UNSIGNED_INT_24_8_WEBGL; // not supported, fallback

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

export function GFXFormatToWebGLInternalFormat (format: Format, gl: WebGLRenderingContext): GLenum {
    switch (format) {
    case Format.R5G6B5: return gl.RGB565;
    case Format.RGB5A1: return gl.RGB5_A1;
    case Format.RGBA4: return gl.RGBA4;
    case Format.RGBA16F: return WebGLEXT.RGBA16F_EXT;
    case Format.RGBA32F: return WebGLEXT.RGBA32F_EXT;
    case Format.SRGB8_A8: return WebGLEXT.SRGB8_ALPHA8_EXT;
    case Format.DEPTH: return gl.DEPTH_COMPONENT16;
    case Format.DEPTH_STENCIL: return gl.DEPTH_STENCIL;

    default: {
        console.error('Unsupported Format, convert to WebGL internal format failed.');
        return gl.RGBA;
    }
    }
}

export function GFXFormatToWebGLFormat (format: Format, gl: WebGLRenderingContext): GLenum {
    switch (format) {
    case Format.A8: return gl.ALPHA;
    case Format.L8: return gl.LUMINANCE;
    case Format.LA8: return gl.LUMINANCE_ALPHA;
    case Format.RGB8: return gl.RGB;
    case Format.RGB16F: return gl.RGB;
    case Format.RGB32F: return gl.RGB;
    case Format.BGRA8: return gl.RGBA;
    case Format.RGBA8: return gl.RGBA;
    case Format.SRGB8_A8: return gl.RGBA;
    case Format.RGBA16F: return gl.RGBA;
    case Format.RGBA32F: return gl.RGBA;
    case Format.R5G6B5: return gl.RGB;
    case Format.RGB5A1: return gl.RGBA;
    case Format.RGBA4: return gl.RGBA;
    case Format.DEPTH: return gl.DEPTH_COMPONENT;
    case Format.DEPTH_STENCIL: return gl.DEPTH_STENCIL;

    case Format.BC1: return WebGLEXT.COMPRESSED_RGB_S3TC_DXT1_EXT;
    case Format.BC1_ALPHA: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT1_EXT;
    case Format.BC1_SRGB: return WebGLEXT.COMPRESSED_SRGB_S3TC_DXT1_EXT;
    case Format.BC1_SRGB_ALPHA: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
    case Format.BC2: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT3_EXT;
    case Format.BC2_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
    case Format.BC3: return WebGLEXT.COMPRESSED_RGBA_S3TC_DXT5_EXT;
    case Format.BC3_SRGB: return WebGLEXT.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;

    case Format.ETC_RGB8: return WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL;
    case Format.ETC2_RGB8: return WebGLEXT.COMPRESSED_RGB8_ETC2;
    case Format.ETC2_SRGB8: return WebGLEXT.COMPRESSED_SRGB8_ETC2;
    case Format.ETC2_RGB8_A1: return WebGLEXT.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_SRGB8_A1: return WebGLEXT.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2;
    case Format.ETC2_RGBA8: return WebGLEXT.COMPRESSED_RGBA8_ETC2_EAC;
    case Format.ETC2_SRGB8_A8: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC;
    case Format.EAC_R11: return WebGLEXT.COMPRESSED_R11_EAC;
    case Format.EAC_R11SN: return WebGLEXT.COMPRESSED_SIGNED_R11_EAC;
    case Format.EAC_RG11: return WebGLEXT.COMPRESSED_RG11_EAC;
    case Format.EAC_RG11SN: return WebGLEXT.COMPRESSED_SIGNED_RG11_EAC;

    case Format.PVRTC_RGB2: return WebGLEXT.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGBA2: return WebGLEXT.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
    case Format.PVRTC_RGB4: return WebGLEXT.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
    case Format.PVRTC_RGBA4: return WebGLEXT.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;

    case Format.ASTC_RGBA_4X4: return WebGLEXT.COMPRESSED_RGBA_ASTC_4x4_KHR;
    case Format.ASTC_RGBA_5X4: return WebGLEXT.COMPRESSED_RGBA_ASTC_5x4_KHR;
    case Format.ASTC_RGBA_5X5: return WebGLEXT.COMPRESSED_RGBA_ASTC_5x5_KHR;
    case Format.ASTC_RGBA_6X5: return WebGLEXT.COMPRESSED_RGBA_ASTC_6x5_KHR;
    case Format.ASTC_RGBA_6X6: return WebGLEXT.COMPRESSED_RGBA_ASTC_6x6_KHR;
    case Format.ASTC_RGBA_8X5: return WebGLEXT.COMPRESSED_RGBA_ASTC_8x5_KHR;
    case Format.ASTC_RGBA_8X6: return WebGLEXT.COMPRESSED_RGBA_ASTC_8x6_KHR;
    case Format.ASTC_RGBA_8X8: return WebGLEXT.COMPRESSED_RGBA_ASTC_8x8_KHR;
    case Format.ASTC_RGBA_10X5: return WebGLEXT.COMPRESSED_RGBA_ASTC_10x5_KHR;
    case Format.ASTC_RGBA_10X6: return WebGLEXT.COMPRESSED_RGBA_ASTC_10x6_KHR;
    case Format.ASTC_RGBA_10X8: return WebGLEXT.COMPRESSED_RGBA_ASTC_10x8_KHR;
    case Format.ASTC_RGBA_10X10: return WebGLEXT.COMPRESSED_RGBA_ASTC_10x10_KHR;
    case Format.ASTC_RGBA_12X10: return WebGLEXT.COMPRESSED_RGBA_ASTC_12x10_KHR;
    case Format.ASTC_RGBA_12X12: return WebGLEXT.COMPRESSED_RGBA_ASTC_12x12_KHR;

    case Format.ASTC_SRGBA_4X4: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR;
    case Format.ASTC_SRGBA_5X4: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR;
    case Format.ASTC_SRGBA_5X5: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR;
    case Format.ASTC_SRGBA_6X5: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR;
    case Format.ASTC_SRGBA_6X6: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR;
    case Format.ASTC_SRGBA_8X5: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR;
    case Format.ASTC_SRGBA_8X6: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR;
    case Format.ASTC_SRGBA_8X8: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR;
    case Format.ASTC_SRGBA_10X5: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR;
    case Format.ASTC_SRGBA_10X6: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR;
    case Format.ASTC_SRGBA_10X8: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR;
    case Format.ASTC_SRGBA_10X10: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR;
    case Format.ASTC_SRGBA_12X10: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR;
    case Format.ASTC_SRGBA_12X12: return WebGLEXT.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR;

    default: {
        console.error('Unsupported Format, convert to WebGL format failed.');
        return gl.RGBA;
    }
    }
}

function GFXTypeToWebGLType (type: Type, gl: WebGLRenderingContext): GLenum {
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
    case Type.MAT3: return gl.FLOAT_MAT3;
    case Type.MAT4: return gl.FLOAT_MAT4;
    case Type.SAMPLER2D: return gl.SAMPLER_2D;
    case Type.SAMPLER_CUBE: return gl.SAMPLER_CUBE;
    default: {
        console.error('Unsupported GLType, convert to GL type failed.');
        return Type.UNKNOWN;
    }
    }
}

function GFXTypeToTypedArrayCtor (type: Type) {
    switch (type) {
    case Type.BOOL:
    case Type.BOOL2:
    case Type.BOOL3:
    case Type.BOOL4:
    case Type.INT:
    case Type.INT2:
    case Type.INT3:
    case Type.INT4:
    case Type.UINT:
        return Int32Array;
    case Type.FLOAT:
    case Type.FLOAT2:
    case Type.FLOAT3:
    case Type.FLOAT4:
    case Type.MAT2:
    case Type.MAT3:
    case Type.MAT4:
        return Float32Array;
    default: {
        console.error('Unsupported GLType, convert to TypedArrayConstructor failed.');
        return Float32Array;
    }
    }
}

function WebGLTypeToGFXType (glType: GLenum, gl: WebGLRenderingContext): Type {
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
    case gl.FLOAT: return Type.FLOAT;
    case gl.FLOAT_VEC2: return Type.FLOAT2;
    case gl.FLOAT_VEC3: return Type.FLOAT3;
    case gl.FLOAT_VEC4: return Type.FLOAT4;
    case gl.FLOAT_MAT2: return Type.MAT2;
    case gl.FLOAT_MAT3: return Type.MAT3;
    case gl.FLOAT_MAT4: return Type.MAT4;
    case gl.SAMPLER_2D: return Type.SAMPLER2D;
    case gl.SAMPLER_CUBE: return Type.SAMPLER_CUBE;
    default: {
        console.error('Unsupported GLType, convert to Type failed.');
        return Type.UNKNOWN;
    }
    }
}

function WebGLGetTypeSize (glType: GLenum, gl: WebGLRenderingContext): Type {
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

function WebGLGetComponentCount (glType: GLenum, gl: WebGLRenderingContext): Type {
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
    0x8007, // WebGLRenderingContext.MIN,
    0x8008, // WebGLRenderingContext.MAX,
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
    public refCount = 0;

    constructor (type: WebGLCmd) {
        this.cmdType = type;
    }

    public abstract clear ();
}

export class WebGLCmdBeginRenderPass extends WebGLCmdObject {
    public gpuRenderPass: IWebGLGPURenderPass | null = null;
    public gpuFramebuffer: IWebGLGPUFramebuffer | null = null;
    public renderArea = new Rect();
    public clearFlag: ClearFlags = ClearFlagBit.NONE;
    public clearColors: Color[] = [];
    public clearDepth = 1.0;
    public clearStencil = 0;

    constructor () {
        super(WebGLCmd.BEGIN_RENDER_PASS);
    }

    public clear () {
        this.gpuFramebuffer = null;
        this.clearColors.length = 0;
    }
}

export class WebGLCmdBindStates extends WebGLCmdObject {
    public gpuPipelineState: IWebGLGPUPipelineState | null = null;
    public gpuInputAssembler: IWebGLGPUInputAssembler | null = null;
    public gpuDescriptorSets: IWebGLGPUDescriptorSet[] = [];
    public dynamicOffsets: number[] = [];
    public dynamicStates: DynamicStates = new DynamicStates();

    constructor () {
        super(WebGLCmd.BIND_STATES);
    }

    public clear () {
        this.gpuPipelineState = null;
        this.gpuDescriptorSets.length = 0;
        this.gpuInputAssembler = null;
        this.dynamicOffsets.length = 0;
    }
}

export class WebGLCmdDraw extends WebGLCmdObject {
    public drawInfo = new DrawInfo();

    constructor () {
        super(WebGLCmd.DRAW);
    }

    public clear () {
    }
}

export class WebGLCmdUpdateBuffer extends WebGLCmdObject {
    public gpuBuffer: IWebGLGPUBuffer | null = null;
    public buffer: BufferSource | null = null;
    public offset = 0;
    public size = 0;

    constructor () {
        super(WebGLCmd.UPDATE_BUFFER);
    }

    public clear () {
        this.gpuBuffer = null;
        this.buffer = null;
    }
}

export class WebGLCmdCopyBufferToTexture extends WebGLCmdObject {
    public gpuTexture: IWebGLGPUTexture | null = null;
    public buffers: ArrayBufferView[] = [];
    public regions: BufferTextureCopy[] = [];

    constructor () {
        super(WebGLCmd.COPY_BUFFER_TO_TEXTURE);
    }

    public clear () {
        this.gpuTexture = null;
        this.buffers.length = 0;
        this.regions.length = 0;
    }
}

export class WebGLCmdPackage {
    public cmds: CachedArray<WebGLCmd> = new CachedArray(1);
    public beginRenderPassCmds: CachedArray<WebGLCmdBeginRenderPass> = new CachedArray(1);
    public bindStatesCmds: CachedArray<WebGLCmdBindStates> = new CachedArray(1);
    public drawCmds: CachedArray<WebGLCmdDraw> = new CachedArray(1);
    public updateBufferCmds: CachedArray<WebGLCmdUpdateBuffer> = new CachedArray(1);
    public copyBufferToTextureCmds: CachedArray<WebGLCmdCopyBufferToTexture> = new CachedArray(1);

    public clearCmds (allocator: WebGLCommandAllocator) {
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

export function WebGLCmdFuncCreateBuffer (device: WebGLDevice, gpuBuffer: IWebGLGPUBuffer) {
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
                        device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }
                gfxStateCache.gpuInputAssembler = null;

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
                        device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                        cache.glVAO = null;
                    }
                }
                gfxStateCache.gpuInputAssembler = null;

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
        gpuBuffer.glTarget = gl.NONE;

        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer.buffer);
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

export function WebGLCmdFuncDestroyBuffer (device: WebGLDevice, gpuBuffer: IWebGLGPUBuffer) {
    const { gl } = device;
    const cache = device.stateCache;

    if (gpuBuffer.glBuffer) {
        // Firefox 75+ implicitly unbind whatever buffer there was on the slot sometimes
        // can be reproduced in the static batching scene at https://github.com/cocos-creator/test-cases-3d
        switch (gpuBuffer.glTarget) {
        case gl.ARRAY_BUFFER:
            if (device.extensions.useVAO) {
                if (cache.glVAO) {
                    device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                    device.stateCache.glVAO = null;
                }
            }
            gfxStateCache.gpuInputAssembler = null;

            gl.bindBuffer(gl.ARRAY_BUFFER, null);
            device.stateCache.glArrayBuffer = null;
            break;
        case gl.ELEMENT_ARRAY_BUFFER:
            if (device.extensions.useVAO) {
                if (cache.glVAO) {
                    device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                    device.stateCache.glVAO = null;
                }
            }
            gfxStateCache.gpuInputAssembler = null;

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
            device.stateCache.glElementArrayBuffer = null;
            break;
        default:
        }

        gl.deleteBuffer(gpuBuffer.glBuffer);
        gpuBuffer.glBuffer = null;
    }
}

export function WebGLCmdFuncResizeBuffer (device: WebGLDevice, gpuBuffer: IWebGLGPUBuffer) {
    const { gl } = device;
    const cache = device.stateCache;
    const glUsage: GLenum = gpuBuffer.memUsage & MemoryUsageBit.HOST ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

    if (gpuBuffer.usage & BufferUsageBit.VERTEX) {
        if (device.extensions.useVAO) {
            if (cache.glVAO) {
                device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }
        gfxStateCache.gpuInputAssembler = null;

        if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
        }

        if (gpuBuffer.buffer) {
            gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.buffer, glUsage);
        } else {
            gl.bufferData(gl.ARRAY_BUFFER, gpuBuffer.size, glUsage);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        device.stateCache.glArrayBuffer = null;
    } else if (gpuBuffer.usage & BufferUsageBit.INDEX) {
        if (device.extensions.useVAO) {
            if (cache.glVAO) {
                device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                cache.glVAO = null;
            }
        }
        gfxStateCache.gpuInputAssembler = null;

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
        if (gpuBuffer.buffer) {
            gpuBuffer.vf32 = new Float32Array(gpuBuffer.buffer.buffer);
        }
    } else if ((gpuBuffer.usage & BufferUsageBit.INDIRECT)
            || (gpuBuffer.usage & BufferUsageBit.TRANSFER_DST)
            || (gpuBuffer.usage & BufferUsageBit.TRANSFER_SRC)) {
        gpuBuffer.glTarget = gl.NONE;
    } else {
        console.error('Unsupported BufferType, create buffer failed.');
        gpuBuffer.glTarget = gl.NONE;
    }
}

export function WebGLCmdFuncUpdateBuffer (device: WebGLDevice, gpuBuffer: IWebGLGPUBuffer, buffer: BufferSource, offset: number, size: number) {
    if (gpuBuffer.usage & BufferUsageBit.UNIFORM) {
        if (ArrayBuffer.isView(buffer)) {
            gpuBuffer.vf32!.set(buffer as Float32Array, offset / Float32Array.BYTES_PER_ELEMENT);
        } else {
            gpuBuffer.vf32!.set(new Float32Array(buffer as ArrayBuffer), offset / Float32Array.BYTES_PER_ELEMENT);
        }
    } else if (gpuBuffer.usage & BufferUsageBit.INDIRECT) {
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
            if (device.extensions.useVAO) {
                if (cache.glVAO) {
                    device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                    cache.glVAO = null;
                }
            }
            gfxStateCache.gpuInputAssembler = null;

            if (device.stateCache.glArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glArrayBuffer = gpuBuffer.glBuffer;
            }
            break;
        }
        case gl.ELEMENT_ARRAY_BUFFER: {
            if (device.extensions.useVAO) {
                if (cache.glVAO) {
                    device.extensions.OES_vertex_array_object!.bindVertexArrayOES(null);
                    cache.glVAO = null;
                }
            }
            gfxStateCache.gpuInputAssembler = null;

            if (device.stateCache.glElementArrayBuffer !== gpuBuffer.glBuffer) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gpuBuffer.glBuffer);
                device.stateCache.glElementArrayBuffer = gpuBuffer.glBuffer;
            }
            break;
        }
        default: {
            console.error('Unsupported BufferType, update buffer failed.');
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

export function WebGLCmdFuncCreateTexture (device: WebGLDevice, gpuTexture: IWebGLGPUTexture) {
    const { gl } = device;

    gpuTexture.glFormat = gpuTexture.glInternalFmt = GFXFormatToWebGLFormat(gpuTexture.format, gl);
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

        if (!device.extensions.WEBGL_depth_texture && FormatInfos[gpuTexture.format].hasDepth) {
            gpuTexture.glInternalFmt = GFXFormatToWebGLInternalFormat(gpuTexture.format, gl);
            gpuTexture.glRenderbuffer = gl.createRenderbuffer();
            if (gpuTexture.size > 0) {
                if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                    gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                    device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
                }
                gl.renderbufferStorage(gl.RENDERBUFFER, gpuTexture.glInternalFmt, w, h);
            }
        } else {
            gpuTexture.glTexture = gl.createTexture();
            if (gpuTexture.size > 0) {
                const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

                if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                    gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                    glTexUnit.glTexture = gpuTexture.glTexture;
                }

                if (FormatInfos[gpuTexture.format].isCompressed) {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                        const view: Uint8Array = new Uint8Array(imgSize);
                        gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, view);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
                    }
                } else {
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
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
    case TextureType.CUBE: {
        gpuTexture.glTarget = gl.TEXTURE_CUBE_MAP;

        const maxSize = Math.max(w, h);
        if (maxSize > device.capabilities.maxCubeMapTextureSize) {
            errorID(9100, maxSize, device.capabilities.maxTextureSize);
        }

        gpuTexture.glTexture = gl.createTexture();
        if (gpuTexture.size > 0) {
            const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (FormatInfos[gpuTexture.format].isCompressed) {
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
            } else {
                for (let f = 0; f < 6; ++f) {
                    w = gpuTexture.width;
                    h = gpuTexture.height;
                    for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, i, gpuTexture.glInternalFmt, w, h, 0,
                            gpuTexture.glFormat, gpuTexture.glType, null);
                        w = Math.max(1, w >> 1);
                        h = Math.max(1, h >> 1);
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
        console.error('Unsupported TextureType, create texture failed.');
        gpuTexture.type = TextureType.TEX2D;
        gpuTexture.glTarget = gl.TEXTURE_2D;
    }
    }
}

export function WebGLCmdFuncDestroyTexture (device: WebGLDevice, gpuTexture: IWebGLGPUTexture) {
    if (gpuTexture.glTexture) {
        device.gl.deleteTexture(gpuTexture.glTexture);
        gpuTexture.glTexture = null;
    }

    if (gpuTexture.glRenderbuffer) {
        device.gl.deleteRenderbuffer(gpuTexture.glRenderbuffer);
        gpuTexture.glRenderbuffer = null;
    }
}

export function WebGLCmdFuncResizeTexture (device: WebGLDevice, gpuTexture: IWebGLGPUTexture) {
    if (!gpuTexture.size) return;

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

        if (gpuTexture.glRenderbuffer) {
            if (device.stateCache.glRenderbuffer !== gpuTexture.glRenderbuffer) {
                gl.bindRenderbuffer(gl.RENDERBUFFER, gpuTexture.glRenderbuffer);
                device.stateCache.glRenderbuffer = gpuTexture.glRenderbuffer;
            }
            gl.renderbufferStorage(gl.RENDERBUFFER, gpuTexture.glInternalFmt, w, h);
        } else if (gpuTexture.glTexture) {
            const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

            if (glTexUnit.glTexture !== gpuTexture.glTexture) {
                gl.bindTexture(gl.TEXTURE_2D, gpuTexture.glTexture);
                glTexUnit.glTexture = gpuTexture.glTexture;
            }

            if (FormatInfos[gpuTexture.format].isCompressed) {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    const imgSize = FormatSize(gpuTexture.format, w, h, 1);
                    const view: Uint8Array = new Uint8Array(imgSize);
                    gl.compressedTexImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, view);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
            } else {
                for (let i = 0; i < gpuTexture.mipLevel; ++i) {
                    gl.texImage2D(gl.TEXTURE_2D, i, gpuTexture.glInternalFmt, w, h, 0, gpuTexture.glFormat, gpuTexture.glType, null);
                    w = Math.max(1, w >> 1);
                    h = Math.max(1, h >> 1);
                }
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

        const glTexUnit = device.stateCache.glTexUnits[device.stateCache.texUnit];

        if (glTexUnit.glTexture !== gpuTexture.glTexture) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, gpuTexture.glTexture);
            glTexUnit.glTexture = gpuTexture.glTexture;
        }

        if (FormatInfos[gpuTexture.format].isCompressed) {
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
        } else {
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

export function WebGLCmdFuncCreateFramebuffer (device: WebGLDevice, gpuFramebuffer: IWebGLGPUFramebuffer) {
    for (let i = 0; i < gpuFramebuffer.gpuColorTextures.length; ++i) {
        const tex = gpuFramebuffer.gpuColorTextures[i];
        if (tex.isSwapchainTexture) {
            gpuFramebuffer.isOffscreen = false;
            return;
        }
    }

    const { gl } = device;
    const attachments: GLenum[] = [];

    const glFramebuffer = gl.createFramebuffer();
    if (glFramebuffer) {
        gpuFramebuffer.glFramebuffer = glFramebuffer;

        if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
        }

        for (let i = 0; i < gpuFramebuffer.gpuColorTextures.length; ++i) {
            const gpuTexture = gpuFramebuffer.gpuColorTextures[i];
            if (gpuTexture) {
                if (gpuTexture.glTexture) {
                    gl.framebufferTexture2D(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0 + i,
                        gpuTexture.glTarget,
                        gpuTexture.glTexture,
                        0,
                    ); // level must be 0
                } else {
                    gl.framebufferRenderbuffer(
                        gl.FRAMEBUFFER,
                        gl.COLOR_ATTACHMENT0 + i,
                        gl.RENDERBUFFER,
                        gpuTexture.glRenderbuffer,
                    );
                }

                attachments.push(gl.COLOR_ATTACHMENT0 + i);
                gpuFramebuffer.width = Math.min(gpuFramebuffer.width, gpuTexture.width);
                gpuFramebuffer.height = Math.min(gpuFramebuffer.height, gpuTexture.height);
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
            gpuFramebuffer.width = Math.min(gpuFramebuffer.width, dst.width);
            gpuFramebuffer.height = Math.min(gpuFramebuffer.height, dst.height);
        }

        if (device.extensions.WEBGL_draw_buffers) {
            device.extensions.WEBGL_draw_buffers.drawBuffersWEBGL(attachments);
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

        if (device.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, device.stateCache.glFramebuffer);
        }
    }
}

export function WebGLCmdFuncDestroyFramebuffer (device: WebGLDevice, gpuFramebuffer: IWebGLGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = null;
    }
}

export function WebGLCmdFuncCreateShader (device: WebGLDevice, gpuShader: IWebGLGPUShader) {
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
            gl.shaderSource(gpuStage.glShader, gpuStage.source);
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
    if (device.extensions.destroyShadersImmediately) {
        for (let k = 0; k < gpuShader.gpuStages.length; k++) {
            const gpuStage = gpuShader.gpuStages[k];
            if (gpuStage.glShader) {
                gl.detachShader(gpuShader.glProgram, gpuStage.glShader);
                gl.deleteShader(gpuStage.glShader);
                gpuStage.glShader = null;
            }
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
    gpuShader.glInputs = new Array<IWebGLGPUInput>(activeAttribCount);

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
        gpuShader.glBlocks = new Array<IWebGLGPUUniformBlock>(gpuShader.blocks.length);
        for (let i = 0; i < gpuShader.blocks.length; ++i) {
            const block = gpuShader.blocks[i];

            const glBlock: IWebGLGPUUniformBlock = {
                set: block.set,
                binding: block.binding,
                name: block.name,
                size: 0,
                glUniforms: new Array<IWebGLGPUUniform>(block.members.length),
                glActiveUniforms: [],
            };

            gpuShader.glBlocks[i] = glBlock;

            for (let u = 0; u < block.members.length; ++u) {
                const uniform = block.members[u];
                const glType = GFXTypeToWebGLType(uniform.type, gl);
                const stride = WebGLGetTypeSize(glType, gl);
                const size = stride * uniform.count;

                glBlock.glUniforms[u] = {
                    binding: -1,
                    name: uniform.name,
                    type: uniform.type,
                    stride,
                    count: uniform.count,
                    size,
                    offset: 0,

                    glType,
                    glLoc: null!,
                    array: null!,
                };
            }
        }
    }

    // WebGL doesn't support Framebuffer Fetch
    for (let i = 0; i < gpuShader.subpassInputs.length; ++i) {
        const subpassInput = gpuShader.subpassInputs[i];
        gpuShader.samplerTextures.push(new UniformSamplerTexture(
            subpassInput.set, subpassInput.binding, subpassInput.name, Type.SAMPLER2D, subpassInput.count,
        ));
    }

    // create uniform sampler textures
    if (gpuShader.samplerTextures.length > 0) {
        gpuShader.glSamplerTextures = new Array<IWebGLGPUUniformSamplerTexture>(gpuShader.samplerTextures.length);

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

    // parse uniforms
    const activeUniformCount = gl.getProgramParameter(gpuShader.glProgram, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < activeUniformCount; ++i) {
        const uniformInfo = gl.getActiveUniform(gpuShader.glProgram, i);
        if (uniformInfo) {
            const isSampler = (uniformInfo.type === gl.SAMPLER_2D)
                || (uniformInfo.type === gl.SAMPLER_CUBE);

            if (!isSampler) {
                const glLoc = gl.getUniformLocation(gpuShader.glProgram, uniformInfo.name);
                if (device.extensions.isLocationActive(glLoc)) {
                    let varName: string;
                    const nameOffset = uniformInfo.name.indexOf('[');
                    if (nameOffset !== -1) {
                        varName = uniformInfo.name.substr(0, nameOffset);
                    } else {
                        varName = uniformInfo.name;
                    }

                    // build uniform block mapping
                    for (let j = 0; j < gpuShader.glBlocks.length; j++) {
                        const glBlock = gpuShader.glBlocks[j];

                        for (let k = 0; k < glBlock.glUniforms.length; k++) {
                            const glUniform = glBlock.glUniforms[k];
                            if (glUniform.name === varName) {
                                glUniform.glLoc = glLoc;
                                glUniform.count = uniformInfo.size;
                                glUniform.size = glUniform.stride * glUniform.count;
                                glUniform.array = new (GFXTypeToTypedArrayCtor(glUniform.type))(glUniform.size / 4);

                                glBlock.glActiveUniforms.push(glUniform);
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    // calculate offset & size
    // WARNING: we can't handle inactive uniform arrays with wrong input sizes
    // and there is no way to detect that for now
    for (let j = 0; j < gpuShader.glBlocks.length; j++) {
        const glBlock = gpuShader.glBlocks[j];
        for (let k = 0; k < glBlock.glUniforms.length; k++) {
            const glUniform = glBlock.glUniforms[k];
            glUniform.offset = glBlock.size / 4;
            glBlock.size += glUniform.size;
        }
    }

    // texture unit index mapping optimization
    const glActiveSamplers: IWebGLGPUUniformSamplerTexture[] = [];
    const glActiveSamplerLocations: WebGLUniformLocation[] = [];
    const { bindingMappingInfo } = device;
    const { texUnitCacheMap } = device.stateCache;

    let flexibleSetBaseOffset = 0;
    for (let i = 0; i < gpuShader.blocks.length; ++i) {
        if (gpuShader.blocks[i].set === bindingMappingInfo.flexibleSet) {
            flexibleSetBaseOffset++;
        }
    }

    let arrayOffset = 0;
    for (let i = 0; i < gpuShader.samplerTextures.length; ++i) {
        const sampler = gpuShader.samplerTextures[i];
        const glLoc = gl.getUniformLocation(gpuShader.glProgram, sampler.name);
        if (device.extensions.isLocationActive(glLoc)) {
            glActiveSamplers.push(gpuShader.glSamplerTextures[i]);
            glActiveSamplerLocations.push(glLoc);
        }
        if (texUnitCacheMap[sampler.name] === undefined) {
            let binding = sampler.binding + bindingMappingInfo.samplerOffsets[sampler.set] + arrayOffset;
            if (sampler.set === bindingMappingInfo.flexibleSet) { binding -= flexibleSetBaseOffset; }
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

            if (!device.extensions.isLocationActive(glSampler.glLoc)) {
                glSampler.glLoc = glActiveSamplerLocations[i];
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

        for (let i = 0; i < glActiveSamplers.length; i++) {
            const glSampler = glActiveSamplers[i];
            glSampler.glUnits = new Int32Array(glSampler.units);
            gl.uniform1iv(glSampler.glLoc, glSampler.glUnits);
        }

        if (device.stateCache.glProgram !== gpuShader.glProgram) {
            gl.useProgram(device.stateCache.glProgram);
        }
    }

    // strip out the inactive ones
    for (let i = 0; i < gpuShader.glBlocks.length;) {
        if (gpuShader.glBlocks[i].glActiveUniforms.length) {
            i++;
        } else {
            gpuShader.glBlocks[i] = gpuShader.glBlocks[gpuShader.glBlocks.length - 1];
            gpuShader.glBlocks.length--;
        }
    }

    gpuShader.glSamplerTextures = glActiveSamplers;
}

export function WebGLCmdFuncDestroyShader (device: WebGLDevice, gpuShader: IWebGLGPUShader) {
    if (gpuShader.glProgram) {
        const { gl } = device;
        if (!device.extensions.destroyShadersImmediately) {
            for (let k = 0; k < gpuShader.gpuStages.length; k++) {
                const gpuStage = gpuShader.gpuStages[k];
                if (gpuStage.glShader) {
                    gl.detachShader(gpuShader.glProgram, gpuStage.glShader);
                    gl.deleteShader(gpuStage.glShader);
                    gpuStage.glShader = null;
                }
            }
        }
        gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = null;
    }
}

export function WebGLCmdFuncCreateInputAssember (device: WebGLDevice, gpuInputAssembler: IWebGLGPUInputAssembler) {
    const { gl } = device;

    gpuInputAssembler.glAttribs = new Array<IWebGLAttrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;

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

export function WebGLCmdFuncDestroyInputAssembler (device: WebGLDevice, gpuInputAssembler: IWebGLGPUInputAssembler) {
    const it = gpuInputAssembler.glVAOs.values();
    let res = it.next();
    while (!res.done) {
        device.extensions.OES_vertex_array_object!.deleteVertexArrayOES(res.value);
        res = it.next();
    }
    gpuInputAssembler.glVAOs.clear();
}

interface IWebGLStateCache {
    gpuPipelineState: IWebGLGPUPipelineState | null;
    gpuInputAssembler: IWebGLGPUInputAssembler | null;
    glPrimitive: number;
}
const gfxStateCache: IWebGLStateCache = {
    gpuPipelineState: null,
    gpuInputAssembler: null,
    glPrimitive: 0,
};

export function WebGLCmdFuncBeginRenderPass (
    device: WebGLDevice,
    gpuRenderPass: IWebGLGPURenderPass | null,
    gpuFramebuffer: IWebGLGPUFramebuffer | null,
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

        if (cache.scissorRect.x !== 0
            || cache.scissorRect.y !== 0
            || cache.scissorRect.width !== gpuFramebuffer.width
            || cache.scissorRect.height !== gpuFramebuffer.height) {
            gl.scissor(0, 0, gpuFramebuffer.width, gpuFramebuffer.height);

            cache.scissorRect.x = 0;
            cache.scissorRect.y = 0;
            cache.scissorRect.width = gpuFramebuffer.width;
            cache.scissorRect.height = gpuFramebuffer.height;
        }

        // const invalidateAttachments: GLenum[] = [];
        let clearCount = clearColors.length;

        if (!device.extensions.WEBGL_draw_buffers) {
            clearCount = 1;
        }

        for (let j = 0; j < clearCount; ++j) {
            const colorAttachment = gpuRenderPass.colorAttachments[j];

            if (colorAttachment.format !== Format.UNKNOWN) {
                switch (colorAttachment.loadOp) {
                case LoadOp.LOAD: break; // GL default behavior
                case LoadOp.CLEAR: {
                    if (cache.bs.targets[0].blendColorMask !== ColorMask.ALL) {
                        gl.colorMask(true, true, true, true);
                    }

                    const clearColor = clearColors[0];
                    gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
                    clears |= gl.COLOR_BUFFER_BIT;
                    break;
                }
                case LoadOp.DISCARD: {
                    // invalidate the framebuffer
                    // invalidateAttachments.push(gl.COLOR_ATTACHMENT0 + j);
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
                    // invalidateAttachments.push(gl.DEPTH_ATTACHMENT);
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
                        // invalidateAttachments.push(gl.STENCIL_ATTACHMENT);
                        break;
                    }
                    default:
                    }
                }
            }
        } // if (gpuRenderPass.depthStencilAttachment)

        /*
        if (invalidateAttachments.length) {
            gl.invalidateFramebuffer(gl.FRAMEBUFFER, invalidateAttachments);
        }
        */

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

export function WebGLCmdFuncBindStates (
    device: WebGLDevice,
    gpuPipelineState: IWebGLGPUPipelineState | null,
    gpuInputAssembler: IWebGLGPUInputAssembler | null,
    gpuDescriptorSets: IWebGLGPUDescriptorSet[],
    dynamicOffsets: number[],
    dynamicStates: DynamicStates,
) {
    const { gl } = device;
    const cache = device.stateCache;
    const gpuShader = gpuPipelineState && gpuPipelineState.gpuShader;

    let isShaderChanged = false;
    let glWrapS: number;
    let glWrapT: number;
    let glMinFilter: number;

    // bind pipeline
    if (gpuPipelineState && gfxStateCache.gpuPipelineState !== gpuPipelineState) {
        gfxStateCache.gpuPipelineState = gpuPipelineState;
        gfxStateCache.glPrimitive = gpuPipelineState.glPrimitive;

        if (gpuPipelineState.gpuShader) {
            const { glProgram } = gpuPipelineState.gpuShader;
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

                cache.rs.cullMode = rs.cullMode;
            }

            const isFrontFaceCCW = rs.isFrontFaceCCW;
            if (cache.rs.isFrontFaceCCW !== isFrontFaceCCW) {
                gl.frontFace(isFrontFaceCCW ? gl.CCW : gl.CW);
                cache.rs.isFrontFaceCCW = isFrontFaceCCW;
            }

            if ((cache.rs.depthBias !== rs.depthBias)
                || (cache.rs.depthBiasSlop !== rs.depthBiasSlop)) {
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
            const descriptorIdx = gpuDescriptorSet && gpuDescriptorSet.descriptorIndices[glBlock.binding];
            const gpuDescriptor = descriptorIdx >= 0 && gpuDescriptorSet.gpuDescriptors[descriptorIdx];
            let vf32: Float32Array | null = null; let offset = 0;

            if (gpuDescriptor && gpuDescriptor.gpuBuffer) {
                const { gpuBuffer } = gpuDescriptor;
                const dynamicOffsetIndexSet = dynamicOffsetIndices[glBlock.set];
                const dynamicOffsetIndex = dynamicOffsetIndexSet && dynamicOffsetIndexSet[glBlock.binding];
                if (dynamicOffsetIndex >= 0) { offset = dynamicOffsets[dynamicOffsetIndex]; }

                if ('vf32' in gpuBuffer) {
                    vf32 = gpuBuffer.vf32;
                } else {
                    offset += gpuBuffer.offset;
                    vf32 = gpuBuffer.gpuBuffer.vf32;
                }
                offset >>= 2;
            }

            if (!vf32) {
                error(`Buffer binding '${glBlock.name}' at set ${glBlock.set} binding ${glBlock.binding} is not bounded`);
                continue;
            }

            const uniformLen = glBlock.glActiveUniforms.length;
            for (let l = 0; l < uniformLen; l++) {
                const glUniform = glBlock.glActiveUniforms[l];
                switch (glUniform.glType) {
                case gl.BOOL:
                case gl.INT: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform1iv(glUniform.glLoc, glUniform.array as Int32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.BOOL_VEC2:
                case gl.INT_VEC2: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform2iv(glUniform.glLoc, glUniform.array as Int32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.BOOL_VEC3:
                case gl.INT_VEC3: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform3iv(glUniform.glLoc, glUniform.array as Int32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.BOOL_VEC4:
                case gl.INT_VEC4: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform4iv(glUniform.glLoc, glUniform.array as Int32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform1fv(glUniform.glLoc, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_VEC2: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform2fv(glUniform.glLoc, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_VEC3: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform3fv(glUniform.glLoc, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_VEC4: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniform4fv(glUniform.glLoc, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_MAT2: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniformMatrix2fv(glUniform.glLoc, false, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_MAT3: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniformMatrix3fv(glUniform.glLoc, false, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                case gl.FLOAT_MAT4: {
                    for (let u = 0; u < glUniform.array.length; ++u) {
                        const idx = glUniform.offset + offset + u;
                        if (vf32[idx] !== glUniform.array[u]) {
                            for (let n = u, m = idx; n < glUniform.array.length; ++n, ++m) {
                                glUniform.array[n] = vf32[m];
                            }
                            gl.uniformMatrix4fv(glUniform.glLoc, false, glUniform.array as Float32Array);
                            break;
                        }
                    }
                    break;
                }
                default:
                }
            }
            continue;
        }

        const samplerLen = gpuShader.glSamplerTextures.length;
        for (let i = 0; i < samplerLen; i++) {
            const glSampler = gpuShader.glSamplerTextures[i];
            const gpuDescriptorSet = gpuDescriptorSets[glSampler.set];
            let descriptorIndex = gpuDescriptorSet && gpuDescriptorSet.descriptorIndices[glSampler.binding];
            let gpuDescriptor = descriptorIndex >= 0 && gpuDescriptorSet.gpuDescriptors[descriptorIndex];

            const texUnitLen = glSampler.units.length;
            for (let l = 0; l < texUnitLen; l++) {
                const texUnit = glSampler.units[l];

                if (!gpuDescriptor || !gpuDescriptor.gpuSampler) {
                    error(`Sampler binding '${glSampler.name}' at set ${glSampler.set} binding ${glSampler.binding} index ${l} is not bounded`);
                    continue;
                }

                if (gpuDescriptor.gpuTexture && gpuDescriptor.gpuTexture.size > 0) {
                    const { gpuTexture } = gpuDescriptor;
                    const glTexUnit = cache.glTexUnits[texUnit];

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
                    if (gpuTexture.isPowerOf2) {
                        glWrapS = gpuSampler.glWrapS;
                        glWrapT = gpuSampler.glWrapT;
                    } else {
                        glWrapS = gl.CLAMP_TO_EDGE;
                        glWrapT = gl.CLAMP_TO_EDGE;
                    }

                    if (gpuTexture.isPowerOf2) {
                        if (gpuTexture.mipLevel <= 1
                            && (gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_NEAREST
                            || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_LINEAR)) {
                            glMinFilter = gl.LINEAR;
                        } else {
                            glMinFilter = gpuSampler.glMinFilter;
                        }
                    } else if (gpuSampler.glMinFilter === gl.LINEAR
                            || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_NEAREST
                            || gpuSampler.glMinFilter === gl.LINEAR_MIPMAP_LINEAR) {
                        glMinFilter = gl.LINEAR;
                    } else {
                        glMinFilter = gl.NEAREST;
                    }

                    if (gpuTexture.glWrapS !== glWrapS) {
                        if (cache.texUnit !== texUnit) {
                            gl.activeTexture(gl.TEXTURE0 + texUnit);
                            cache.texUnit = texUnit;
                        }
                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_S, glWrapS);
                        gpuTexture.glWrapS = glWrapS;
                    }

                    if (gpuTexture.glWrapT !== glWrapT) {
                        if (cache.texUnit !== texUnit) {
                            gl.activeTexture(gl.TEXTURE0 + texUnit);
                            cache.texUnit = texUnit;
                        }
                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_WRAP_T, glWrapT);
                        gpuTexture.glWrapT = glWrapT;
                    }

                    if (gpuTexture.glMinFilter !== glMinFilter) {
                        if (cache.texUnit !== texUnit) {
                            gl.activeTexture(gl.TEXTURE0 + texUnit);
                            cache.texUnit = texUnit;
                        }
                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MIN_FILTER, glMinFilter);
                        gpuTexture.glMinFilter = glMinFilter;
                    }

                    if (gpuTexture.glMagFilter !== gpuSampler.glMagFilter) {
                        if (cache.texUnit !== texUnit) {
                            gl.activeTexture(gl.TEXTURE0 + texUnit);
                            cache.texUnit = texUnit;
                        }
                        gl.texParameteri(gpuTexture.glTarget, gl.TEXTURE_MAG_FILTER, gpuSampler.glMagFilter);
                        gpuTexture.glMagFilter = gpuSampler.glMagFilter;
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
        const ia = device.extensions.ANGLE_instanced_arrays;

        if (device.extensions.useVAO) {
            const vao = device.extensions.OES_vertex_array_object!;

            // check vao
            let glVAO = gpuInputAssembler.glVAOs.get(gpuShader.glProgram!);
            if (!glVAO) {
                glVAO = vao.createVertexArrayOES()!;
                gpuInputAssembler.glVAOs.set(gpuShader.glProgram!, glVAO);

                vao.bindVertexArrayOES(glVAO);
                gl.bindBuffer(gl.ARRAY_BUFFER, null);
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
                cache.glArrayBuffer = null;
                cache.glElementArrayBuffer = null;

                let glAttrib: IWebGLAttrib | null;
                const inputLen = gpuShader.glInputs.length;
                for (let j = 0; j < inputLen; j++) {
                    const glInput = gpuShader.glInputs[j];
                    glAttrib = null;

                    const attribLen = gpuInputAssembler.glAttribs.length;
                    for (let k = 0; k < attribLen; k++) {
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
                            if (ia) { ia.vertexAttribDivisorANGLE(glLoc, glAttrib.isInstanced ? 1 : 0); }
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
            for (let a = 0; a < device.capabilities.maxVertexAttributes; ++a) {
                cache.glCurrentAttribLocs[a] = false;
            }

            const inputLen = gpuShader.glInputs.length;
            for (let j = 0; j < inputLen; j++) {
                const glInput = gpuShader.glInputs[j];
                let glAttrib: IWebGLAttrib | null = null;

                const attribLen = gpuInputAssembler.glAttribs.length;
                for (let k = 0; k < attribLen; k++) {
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
                        if (ia) { ia.vertexAttribDivisorANGLE(glLoc, glAttrib.isInstanced ? 1 : 0); }
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
        for (let j = 0; j < dsLen; j++) {
            const dynamicState = gpuPipelineState.dynamicStates[j];
            switch (dynamicState) {
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

export function WebGLCmdFuncDraw (device: WebGLDevice, drawInfo: Readonly<DrawInfo>) {
    const { gl } = device;
    const { ANGLE_instanced_arrays: ia, WEBGL_multi_draw: md } = device.extensions;
    const { gpuInputAssembler, glPrimitive } = gfxStateCache;

    if (gpuInputAssembler) {
        const indexBuffer = gpuInputAssembler.gpuIndexBuffer;
        if (gpuInputAssembler.gpuIndirectBuffer) {
            const indirects = gpuInputAssembler.gpuIndirectBuffer.indirects;
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
                        if (indirects.instances[j] > 1 && ia) {
                            ia.drawElementsInstancedANGLE(glPrimitive, indirects.counts[j],
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
                    if (indirects.instances[j] > 1 && ia) {
                        ia.drawArraysInstancedANGLE(glPrimitive, indirects.offsets[j], indirects.counts[j], indirects.instances[j]);
                    } else {
                        gl.drawArrays(glPrimitive, indirects.offsets[j], indirects.counts[j]);
                    }
                }
            }
        } else if (drawInfo.instanceCount > 1 && ia) {
            if (indexBuffer) {
                if (drawInfo.indexCount > 0) {
                    const offset = drawInfo.firstIndex * indexBuffer.stride;
                    ia.drawElementsInstancedANGLE(glPrimitive, drawInfo.indexCount,
                        gpuInputAssembler.glIndexType, offset, drawInfo.instanceCount);
                }
            } else if (drawInfo.vertexCount > 0) {
                ia.drawArraysInstancedANGLE(glPrimitive, drawInfo.firstVertex, drawInfo.vertexCount, drawInfo.instanceCount);
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

const cmdIds = new Array<number>(WebGLCmd.COUNT);
export function WebGLCmdFuncExecuteCmds (device: WebGLDevice, cmdPackage: WebGLCmdPackage) {
    cmdIds.fill(0);

    for (let i = 0; i < cmdPackage.cmds.length; ++i) {
        const cmd = cmdPackage.cmds.array[i];
        const cmdId = cmdIds[cmd]++;

        switch (cmd) {
        case WebGLCmd.BEGIN_RENDER_PASS: {
            const cmd0 = cmdPackage.beginRenderPassCmds.array[cmdId];
            WebGLCmdFuncBeginRenderPass(device, cmd0.gpuRenderPass, cmd0.gpuFramebuffer, cmd0.renderArea,
                cmd0.clearColors, cmd0.clearDepth, cmd0.clearStencil);
            break;
        }
        /*
            case WebGLCmd.END_RENDER_PASS: {
                // WebGL 1.0 doesn't support store operation of attachments.
                // StoreOp.Store is the default GL behavior.
                break;
            }
            */
        case WebGLCmd.BIND_STATES: {
            const cmd2 = cmdPackage.bindStatesCmds.array[cmdId];
            WebGLCmdFuncBindStates(device, cmd2.gpuPipelineState, cmd2.gpuInputAssembler,
                cmd2.gpuDescriptorSets, cmd2.dynamicOffsets, cmd2.dynamicStates);
            break;
        }
        case WebGLCmd.DRAW: {
            const cmd3 = cmdPackage.drawCmds.array[cmdId];
            WebGLCmdFuncDraw(device, cmd3.drawInfo);
            break;
        }
        case WebGLCmd.UPDATE_BUFFER: {
            const cmd4 = cmdPackage.updateBufferCmds.array[cmdId];
            WebGLCmdFuncUpdateBuffer(device, cmd4.gpuBuffer as IWebGLGPUBuffer, cmd4.buffer as BufferSource, cmd4.offset, cmd4.size);
            break;
        }
        case WebGLCmd.COPY_BUFFER_TO_TEXTURE: {
            const cmd5 = cmdPackage.copyBufferToTextureCmds.array[cmdId];
            WebGLCmdFuncCopyBuffersToTexture(device, cmd5.buffers, cmd5.gpuTexture as IWebGLGPUTexture, cmd5.regions);
            break;
        }
        default:
        } // switch
    } // for
}

export function WebGLCmdFuncCopyTexImagesToTexture (
    device: WebGLDevice,
    texImages: TexImageSource[],
    gpuTexture: IWebGLGPUTexture,
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
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            // console.debug('Copying image to texture 2D: ' + region.texExtent.width + ' x ' + region.texExtent.height);
            gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                region.texOffset.x, region.texOffset.y,
                gpuTexture.glFormat, gpuTexture.glType, texImages[n++]);
        }
        break;
    }
    case gl.TEXTURE_CUBE_MAP: {
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            // console.debug('Copying image to texture cube: ' + region.texExtent.width + ' x ' + region.texExtent.height);
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

    if ((gpuTexture.flags & TextureFlagBit.GEN_MIPMAP)
        && gpuTexture.isPowerOf2) {
        gl.generateMipmap(gpuTexture.glTarget);
    }
}

export function WebGLCmdFuncCopyBuffersToTexture (
    device: WebGLDevice,
    buffers: ArrayBufferView[],
    gpuTexture: IWebGLGPUTexture,
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
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            w = region.texExtent.width;
            h = region.texExtent.height;
            // console.debug('Copying buffer to texture 2D: ' + w + ' x ' + h);

            const pixels = buffers[n++];
            if (!isCompressed) {
                gl.texSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    region.texOffset.x, region.texOffset.y, w, h,
                    gpuTexture.glFormat, gpuTexture.glType, pixels);
            } else if (gpuTexture.glInternalFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL && !device.extensions.noCompressedTexSubImage2D) {
                gl.compressedTexSubImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    region.texOffset.x, region.texOffset.y, w, h,
                    gpuTexture.glFormat, pixels);
            } else { // WEBGL_compressed_texture_etc1
                gl.compressedTexImage2D(gl.TEXTURE_2D, region.texSubres.mipLevel,
                    gpuTexture.glInternalFmt, w, h, 0, pixels);
            }
        }

        break;
    }
    case gl.TEXTURE_CUBE_MAP: {
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            const fcount = region.texSubres.baseArrayLayer + region.texSubres.layerCount;
            for (f = region.texSubres.baseArrayLayer; f < fcount; ++f) {
                w = region.texExtent.width;
                h = region.texExtent.height;
                // console.debug('Copying buffer to texture cube: ' + w + ' x ' + h);

                const pixels = buffers[n++];
                if (!isCompressed) {
                    gl.texSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                        region.texOffset.x, region.texOffset.y, w, h,
                        gpuTexture.glFormat, gpuTexture.glType, pixels);
                } else if (gpuTexture.glInternalFmt !== WebGLEXT.COMPRESSED_RGB_ETC1_WEBGL && !device.extensions.noCompressedTexSubImage2D) {
                    gl.compressedTexSubImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + f, region.texSubres.mipLevel,
                        region.texOffset.x, region.texOffset.y, w, h,
                        gpuTexture.glFormat, pixels);
                } else { // WEBGL_compressed_texture_etc1
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

export function WebGLCmdFuncCopyTextureToBuffers (
    device: WebGLDevice,
    gpuTexture: IWebGLGPUTexture,
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
