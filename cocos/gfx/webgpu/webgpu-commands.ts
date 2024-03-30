import { CachedArray } from '../../core/memop/cached-array';
import { error, errorID } from '../../core/platform';
import { BufferSource, DrawInfo, IndirectBuffer } from '..';
import {
    BufferUsageBit,
    ColorMask,
    CullMode,
    DynamicStateFlagBit,
    Filter,
    Format,
    FormatInfos,
    FormatSize,
    LoadOp,
    MemoryUsageBit,
    SampleCount,
    ShaderStageFlagBit,
    StencilFace,
    TextureFlagBit,
    TextureType,
    Type,
    FormatInfo,
    TextureUsageBit,
    StoreOp,
    ShaderStageFlags,
    DescriptorType,
    TextureInfo,
    Color, Rect, Viewport, BufferTextureCopy,
    SamplerInfo,
    ComparisonFunc,
    BufferInfo,
    BufferFlagBit,
} from '../base/define';

import { WebGLEXT } from '../webgl/webgl-define';
import { WebGPUCommandAllocator } from './webgpu-command-allocator';
import {
    IWebGPUDepthBias,
    IWebGPUDepthBounds,
    IWebGPUStencilCompareMask,
    IWebGPUStencilWriteMask,
} from './webgpu-command-buffer';
import { WebGPUDevice } from './webgpu-device';
import {
    IWebGPUGPUInputAssembler,
    IWebGPUGPUUniform,
    IWebGPUAttrib,
    IWebGPUGPUDescriptorSet,
    IWebGPUGPUBuffer,
    IWebGPUGPUFramebuffer,
    IWebGPUGPUInput,
    IWebGPUGPUPipelineState,
    IWebGPUGPUSampler,
    IWebGPUGPUShader,
    IWebGPUTexture,
    IWebGPUGPUUniformBlock,
    IWebGPUGPUUniformSampler,
    IWebGPUGPURenderPass,
} from './webgpu-gpu-objects';
import { WebGPUBuffer } from './webgpu-buffer';

const WebGPUAdressMode: GPUAddressMode[] = [
    'repeat', // WRAP,
    'mirror-repeat', // MIRROR,
    'clamp-to-edge', // CLAMP,
    'clamp-to-edge', // BORDER,
];

const SAMPLES: number[] = [
    1,
    2,
    4,
    8,
    16,
    32,
    64,
];

const _f32v4 = new Float32Array(4);

// tslint:disable: max-line-length

function CmpF32NotEuqal (a: number, b: number): boolean {
    const c = a - b;
    return (c > 0.000001 || c < -0.000001);
}

export function GLStageToWebGPUStage (stage: ShaderStageFlags) {
    let flag = 0x0;
    if (stage & ShaderStageFlagBit.VERTEX) { flag |= GPUShaderStage.VERTEX; }
    if (stage & ShaderStageFlagBit.FRAGMENT) { flag |= GPUShaderStage.FRAGMENT; }
    if (stage & ShaderStageFlagBit.COMPUTE) { flag |= GPUShaderStage.COMPUTE; }
    if (stage === ShaderStageFlagBit.ALL) { flag |= (GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT | GPUShaderStage.COMPUTE); }
    if (flag === 0x0) { console.error('shader stage not supported by webGPU!'); }
    return flag;
}

type WebGPUResourceTypeName =
  | 'buffer'
  | 'texture'
  | 'sampler'
  | 'externalTexture'
  | 'storageTexture';

export function GLSamplerToGPUSamplerDescType(info: Readonly<SamplerInfo>) : GPUSamplerBindingType {
    if(info.magFilter !== Filter.LINEAR && info.minFilter !== Filter.LINEAR) {
        return 'non-filtering';
    } else {
        return 'filtering';
    }
}

export function GLDescTypeToGPUBufferDescType(descType: DescriptorType): GPUBufferBindingType {
    switch (descType) {
        case DescriptorType.UNIFORM_BUFFER:
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
            return 'uniform';
        case DescriptorType.STORAGE_BUFFER:
        case DescriptorType.DYNAMIC_STORAGE_BUFFER:
        default:
            return 'storage';
    }
}

export function GLDescTypeToWebGPUDescType (descType: DescriptorType): WebGPUResourceTypeName {
    switch (descType) {
        case DescriptorType.UNIFORM_BUFFER:
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
        case DescriptorType.STORAGE_BUFFER:
            return 'buffer';
        case DescriptorType.SAMPLER:
            return 'sampler';
        case DescriptorType.SAMPLER_TEXTURE:
            return 'texture';
        case DescriptorType.STORAGE_IMAGE:
            return 'storageTexture';
        default:
            return "externalTexture";
    }
}
  
export function GFXFormatToWGPUVertexFormat(format: Format): GPUVertexFormat {
    switch (format) {
        case Format.R32F: return 'float32';
        case Format.R32UI: return 'uint32';
        case Format.R32I: return 'sint32';
        case Format.RG8: return 'unorm8x2';
        case Format.RG8SN: return 'snorm8x2';
        case Format.RG8UI: return 'uint8x2';
        case Format.RG8I: return 'sint8x2';
        case Format.RG16F: return 'float16x2';
        case Format.RG16UI: return 'uint16x2';
        case Format.RG16I: return 'sint16x2';
        case Format.RG32F: return 'float32x2';
        case Format.RG32UI: return 'uint32x2';
        case Format.RG32I: return 'sint32x2';
        case Format.RGB32F: return 'float32x3';
        case Format.RGB32UI: return 'uint32x3';
        case Format.RGB32I: return 'sint32x3';
        case Format.BGRA8: return 'unorm8x4';
        case Format.RGBA8: return 'unorm8x4';
        case Format.SRGB8_A8: return 'uint8x4';
        case Format.RGBA8SN: return 'snorm8x4';
        case Format.RGBA8UI: return 'uint8x4';
        case Format.RGBA8I: return 'sint8x4';
        case Format.RGBA16F: return 'float16x4';
        case Format.RGBA16UI: return 'uint16x4';
        case Format.RGBA16I: return 'sint16x4';
        case Format.RGBA32F: return 'float32x4';
        case Format.RGBA32UI: return 'uint32x4';
        case Format.RGBA32I: return 'sint32x4';

        default: {
            console.info('Unsupported Format, return sint8x4 in default.');
            return 'sint8x4';
        }
    }
  }

function GFXFormatToWGPUTextureFormat (format: Format): GPUTextureFormat {
    switch (format) {
        case Format.R8: return 'r8unorm';
        case Format.R8SN: return 'r8snorm';
        case Format.R8UI: return 'r8uint';
        case Format.R8I: return 'r8sint';
        case Format.RG8: return 'rg8unorm';
        case Format.RG8SN: return 'rg8snorm';
        case Format.RG8UI: return 'rg8uint';
        case Format.RG8I: return 'rg8sint';
        case Format.BGRA8: return 'bgra8unorm';
        case Format.RGBA8: return 'rgba8unorm';
        case Format.SRGB8_A8: return 'rgba8unorm-srgb';
        case Format.RGBA8SN: return 'rgba8snorm';
        case Format.RGBA8UI: return 'rgba8uint';
        case Format.RGBA8I: return 'rgba8sint';
        case Format.R16I: return 'r16sint';
        case Format.R16UI: return 'r16uint';
        case Format.R16F: return 'r16sint';
        case Format.RG16I: return 'rg16sint';
        case Format.RG16UI: return 'rg16uint';
        case Format.RG16F: return 'rg16float';
        case Format.RGBA16I: return 'rgba16sint';
        case Format.RGBA16UI: return 'rgba16uint';
        case Format.RGBA16F: return 'rgba16float';
        case Format.R32I: return 'r32sint';
        case Format.R32UI: return 'r32uint';
        case Format.R32F: return 'r32float';
        case Format.RG32I: return 'rg32sint';
        case Format.RG32UI: return 'rg32uint';
        case Format.RG32F: return 'rg32float';
        case Format.RGBA32I: return 'rgba32sint';
        case Format.RGBA32UI: return 'rgba32uint';
        case Format.RGBA32F: return 'rgba32float';
        case Format.RGB10A2: return 'rgb10a2unorm';

        case Format.DEPTH: return 'depth24plus';
        case Format.DEPTH_STENCIL: return 'depth24plus-stencil8';

        case Format.BC1_ALPHA: return 'bc1-rgba-unorm';
        case Format.BC1_SRGB_ALPHA: return 'bc1-rgba-unorm-srgb';
        case Format.BC2: return 'bc2-rgba-unorm';
        case Format.BC2_SRGB: return 'bc2-rgba-unorm-srgb';
        case Format.BC3: return 'bc3-rgba-unorm';
        case Format.BC3_SRGB: return 'bc3-rgba-unorm-srgb';
        case Format.BC4_SNORM: return 'bc4-r-snorm';
        case Format.BC6H_SF16: return 'bc6h-rgb-float';
        case Format.BC6H_UF16: return 'bc6h-rgb-ufloat';
        case Format.BC7: return 'bc7-rgba-unorm';
        case Format.BC7_SRGB: return 'bc7-rgba-unorm-srgb';

        default: {
            console.info('Unsupported Format, return bgra8unorm indefault.');
            return 'bgra8unorm';
        }
    }
}

export function GFXFormatToWGPUFormat (format: Format): GPUTextureFormat {
    return GFXFormatToWGPUTextureFormat(format);
}

function wGPUTextureFormatToGFXFormat (format: GPUTextureFormat): Format {
    switch(format) {
        case 'r8unorm': return Format.R8;
        case 'r8snorm': return Format.R8SN;
        case 'r8uint': return Format.R8UI;
        case 'r8sint': return Format.R8I;
        case 'rg8unorm': return Format.RG8;
        case 'rg8snorm': return Format.RG8SN;
        case 'rg8uint': return Format.RG8UI;
        case 'rg8sint': return Format.RG8I;
        case 'bgra8unorm': return Format.BGRA8;
        case 'rgba8unorm': return Format.RGBA8;
        case 'rgba8unorm-srgb': return Format.SRGB8_A8;
        case 'rgba8snorm': return Format.RGBA8SN;
        case 'rgba8uint': return Format.RGBA8UI;
        case 'rgba8sint': return Format.RGBA8I;
        case 'r16sint': return Format.R16I;
        case 'r16uint': return Format.R16UI;
        case 'r16float': return Format.R16F; // Handle potential mismatch between GFXFormat and WGPU
        case 'rg16sint': return Format.RG16I;
        case 'rg16uint': return Format.RG16UI;
        case 'rg16float': return Format.RG16F;
        case 'rgba16sint': return Format.RGBA16I;
        case 'rgba16uint': return Format.RGBA16UI;
        case 'rgba16float': return Format.RGBA16F;
        case 'r32sint': return Format.R32I;
        case 'r32uint': return Format.R32UI;
        case 'r32float': return Format.R32F;
        case 'rg32sint': return Format.RG32I;
        case 'rg32uint': return Format.RG32UI;
        case 'rg32float': return Format.RG32F;
        case 'rgba32sint': return Format.RGBA32I;
        case 'rgba32uint': return Format.RGBA32UI;
        case 'rgba32float': return Format.RGBA32F;
        case 'rgb10a2unorm': return Format.RGB10A2;
        case 'depth24plus': return Format.DEPTH;
        case 'depth24plus-stencil8': return Format.DEPTH_STENCIL;
        case 'bc1-rgba-unorm': return Format.BC1_ALPHA;
        case 'bc1-rgba-unorm-srgb': return Format.BC1_SRGB_ALPHA;
        case 'bc2-rgba-unorm': return Format.BC2;
        case 'bc2-rgba-unorm-srgb': return Format.BC2_SRGB;
        case 'bc3-rgba-unorm': return Format.BC3;
        case 'bc3-rgba-unorm-srgb': return Format.BC3_SRGB;
        case 'bc4-r-snorm': return Format.BC4_SNORM;
        case 'bc6h-rgb-float': return Format.BC6H_SF16;
        case 'bc6h-rgb-ufloat': return Format.BC6H_UF16;
        case 'bc7-rgba-unorm': return Format.BC7;
        case 'bc7-rgba-unorm-srgb': return Format.BC7_SRGB;
        default:
            return Format.BGRA8;
    }
};
  
export function WGPUFormatToGFXFormat(format: GPUTextureFormat): Format {
    return wGPUTextureFormatToGFXFormat(format);
}

export function GFXTextureToWebGPUTexture (textureType: TextureType): GPUTextureViewDimension {
    switch (textureType) {
        case TextureType.TEX1D: return '1d';
        case TextureType.TEX2D: return '2d';
        case TextureType.TEX2D_ARRAY: return '2d-array';
        case TextureType.TEX3D: return '3d';
        case TextureType.CUBE: return 'cube';
        default: {
            console.error('Unsupported textureType, convert to WebGPUTexture failed.');
            return '2d';
        }
    }
}

export function GFXTextureUsageToNative (usage: TextureUsageBit): GPUTextureUsageFlags {
    let nativeUsage: GPUTextureUsageFlags = 0;
    if (usage & TextureUsageBit.TRANSFER_SRC) {
        nativeUsage |= GPUTextureUsage.COPY_SRC;
    }

    if (usage & TextureUsageBit.TRANSFER_DST) {
        nativeUsage |= GPUTextureUsage.COPY_DST;
    }

    if (usage & TextureUsageBit.SAMPLED) {
        nativeUsage |= GPUTextureUsage.TEXTURE_BINDING;
    }

    if (usage & TextureUsageBit.STORAGE) {
        nativeUsage |= GPUTextureUsage.STORAGE_BINDING;
    }

    if (usage & TextureUsageBit.COLOR_ATTACHMENT || usage & TextureUsageBit.DEPTH_STENCIL_ATTACHMENT) {
        nativeUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
    }

    if (!nativeUsage) {
        // The default value is TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        nativeUsage = GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT;
    }

    if((nativeUsage & (GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST))
    && !(nativeUsage & (GPUTextureUsage.RENDER_ATTACHMENT))) {
        nativeUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
    }

    return nativeUsage;
}

function GFXTypeToWGPUType (type: Type, gl: WebGL2RenderingContext): GLenum {
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

function WebGLGetTypeSize (glType: GLenum, gl: WebGL2RenderingContext): number {
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

export const WebGPUStencilOp: GPUStencilOperation[] = [
    'zero',
    'keep',
    'replace',
    'increment-clamp',
    'decrement-clamp',
    'invert',
    'increment-wrap',
    'decrement-wrap',
];

export const WebGPUCompereFunc: GPUCompareFunction[] = [
    'never',
    'less',
    'equal',
    'less-equal',
    'greater',
    'not-equal',
    'greater-equal',
    'always',
];

export const WebGPUBlendOps: GPUBlendOperation[] = [
    'add',
    'subtract',
    'reverse-subtract',
    'min',
    'max',
];

export function WebGPUBlendMask (mask: ColorMask): GPUColorWriteFlags {
    switch (mask) {
        case ColorMask.R:
            return GPUColorWrite.RED;
        case ColorMask.G:
            return GPUColorWrite.GREEN;
        case ColorMask.B:
            return GPUColorWrite.BLUE;
        case ColorMask.A:
            return GPUColorWrite.ALPHA;
        default:
            return GPUColorWrite.ALL;
    }
}

export const WebGPUBlendFactors: GPUBlendFactor[] = [
    'zero',
    'one',
    'src-alpha',
    'dst-alpha',
    'one-minus-src-alpha',
    'one-minus-dst-alpha',
    'src',
    'dst',
    'one-minus-src',
    'one-minus-dst',
    'src-alpha-saturated',
    'constant', // CONSTANT_COLOR
    'one-minus-constant', // ONE_MINUS_CONSTANT_COLOR
    'src-alpha', // CONSTANT_ALPHA: not supported
    'one-minus-src-alpha', // ONE_MINUS_CONSTANT_ALPHA: not supported
];

export enum WebGPUCmd {
    BEGIN_RENDER_PASS,
    END_RENDER_PASS,
    BIND_STATES,
    DRAW,
    UPDATE_BUFFER,
    COPY_BUFFER_TO_TEXTURE,
    COUNT,
}

export abstract class WebGPUCmdObject {
    public cmdType: WebGPUCmd;
    public refCount = 0;

    constructor (type: WebGPUCmd) {
        this.cmdType = type;
    }

    public abstract clear ();
}

export class WebGPUCmdBeginRenderPass extends WebGPUCmdObject {
    public gpuRenderPass: IWebGPUGPURenderPass | null = null;
    public gpuFramebuffer: IWebGPUGPUFramebuffer | null = null;
    public renderArea = new Rect();
    public clearColors: Color[] = [];
    public clearDepth = 1.0;
    public clearStencil = 0;

    constructor () {
        super(WebGPUCmd.BEGIN_RENDER_PASS);
    }

    public clear () {
        this.gpuFramebuffer = null;
        this.clearColors.length = 0;
    }
}

export class WebGPUCmdBindStates extends WebGPUCmdObject {
    public gpuPipelineState: IWebGPUGPUPipelineState | null = null;
    public gpuInputAssembler: IWebGPUGPUInputAssembler | null = null;
    public gpuDescriptorSets: IWebGPUGPUDescriptorSet[] = [];
    public dynamicOffsets: number[] = [];
    public viewport: Viewport | null = null;
    public scissor: Rect | null = null;
    public lineWidth: number | null = null;
    public depthBias: IWebGPUDepthBias | null = null;
    public blendConstants: number[] = [];
    public depthBounds: IWebGPUDepthBounds | null = null;
    public stencilWriteMask: IWebGPUStencilWriteMask | null = null;
    public stencilCompareMask: IWebGPUStencilCompareMask | null = null;

    constructor () {
        super(WebGPUCmd.BIND_STATES);
    }

    public clear () {
        this.gpuPipelineState = null;
        this.gpuInputAssembler = null;
        this.gpuDescriptorSets.length = 0;
        this.dynamicOffsets.length = 0;
        this.viewport = null;
        this.scissor = null;
        this.lineWidth = null;
        this.depthBias = null;
        this.blendConstants.length = 0;
        this.depthBounds = null;
        this.stencilWriteMask = null;
        this.stencilCompareMask = null;
    }
}

export class WebGPUCmdDraw extends WebGPUCmdObject {
    public drawInfo = new DrawInfo();

    constructor () {
        super(WebGPUCmd.DRAW);
    }

    public clear () {
    }
}

export class WebGPUCmdUpdateBuffer extends WebGPUCmdObject {
    public gpuBuffer: IWebGPUGPUBuffer | null = null;
    public buffer: BufferSource | null = null;
    public offset = 0;
    public size = 0;

    constructor () {
        super(WebGPUCmd.UPDATE_BUFFER);
    }

    public clear () {
        this.gpuBuffer = null;
        this.buffer = null;
    }
}

export class WebGPUCmdCopyBufferToTexture extends WebGPUCmdObject {
    public gpuTexture: IWebGPUTexture | null = null;
    public buffers: ArrayBufferView[] = [];
    public regions: BufferTextureCopy[] = [];

    constructor () {
        super(WebGPUCmd.COPY_BUFFER_TO_TEXTURE);
    }

    public clear () {
        this.gpuTexture = null;
        this.buffers.length = 0;
        this.regions.length = 0;
    }
}

export class WebGPUCmdPackage {
    public cmds: CachedArray<WebGPUCmd> = new CachedArray(1);
    public beginRenderPassCmds: CachedArray<WebGPUCmdBeginRenderPass> = new CachedArray(1);
    public bindStatesCmds: CachedArray<WebGPUCmdBindStates> = new CachedArray(1);
    public drawCmds: CachedArray<WebGPUCmdDraw> = new CachedArray(1);
    public updateBufferCmds: CachedArray<WebGPUCmdUpdateBuffer> = new CachedArray(1);
    public copyBufferToTextureCmds: CachedArray<WebGPUCmdCopyBufferToTexture> = new CachedArray(1);

    public clearCmds (allocator: WebGPUCommandAllocator) {
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

export function WebGPUCmdFuncCreateBuffer (device: WebGPUDevice, gpuBuffer: IWebGPUGPUBuffer) {
    const nativeDevice: GPUDevice = device.nativeDevice!;

    const bufferDesc = {} as GPUBufferDescriptor;
    bufferDesc.size = gpuBuffer.size;

    let bufferUsage = 0x0;
    if((gpuBuffer.usage & BufferUsageBit.INDEX || gpuBuffer.usage & BufferUsageBit.VERTEX) && !(gpuBuffer.usage & BufferUsageBit.TRANSFER_DST)) {
        gpuBuffer.usage |= BufferUsageBit.TRANSFER_DST;
    }
    if (gpuBuffer.usage & BufferUsageBit.VERTEX) bufferUsage |= GPUBufferUsage.VERTEX;
    if (gpuBuffer.usage & BufferUsageBit.INDEX) bufferUsage |= GPUBufferUsage.INDEX;
    if (gpuBuffer.usage & BufferUsageBit.UNIFORM) bufferUsage |= GPUBufferUsage.UNIFORM;
    if (gpuBuffer.usage & BufferUsageBit.INDIRECT) bufferUsage |= GPUBufferUsage.INDIRECT;
    if (gpuBuffer.usage & BufferUsageBit.TRANSFER_SRC) bufferUsage |= GPUBufferUsage.COPY_SRC;
    if (gpuBuffer.usage & BufferUsageBit.TRANSFER_DST) bufferUsage |= GPUBufferUsage.COPY_DST;
    if (gpuBuffer.usage & BufferUsageBit.STORAGE) bufferUsage |= GPUBufferUsage.STORAGE;

    if (bufferUsage === 0x0) {
        console.info('Unsupported GFXBufferType yet, create UNIFORM buffer in default.');
        bufferUsage |= GPUBufferUsage.UNIFORM;
    }
    
    if(!(bufferUsage & GPUBufferUsage.COPY_DST)) {
        bufferUsage |= GPUBufferUsage.COPY_DST;
    }
    bufferDesc.usage = bufferUsage;
    gpuBuffer.glTarget = bufferUsage;
    gpuBuffer.glBuffer = nativeDevice.createBuffer(bufferDesc);
}

export function WebGPUCmdFuncDestroyBuffer (device: WebGPUDevice, gpuBuffer: IWebGPUGPUBuffer) {
    if (gpuBuffer.glBuffer) {
        gpuBuffer.glBuffer.destroy();
    }
}

export function WebGPUCmdFuncResizeBuffer (device: WebGPUDevice, gpuBuffer: IWebGPUGPUBuffer) {
    WebGPUCmdFuncDestroyBuffer(device, gpuBuffer);
    WebGPUCmdFuncCreateBuffer(device, gpuBuffer);
}

export function WebGPUCmdFuncUpdateBuffer (device: WebGPUDevice, gpuBuffer: IWebGPUGPUBuffer, buffer: BufferSource, offset: number, size: number) {
    if (gpuBuffer.usage & BufferUsageBit.INDIRECT) {
        gpuBuffer.indirects.length = offset;
        Array.prototype.push.apply(gpuBuffer.indirects, (buffer as IndirectBuffer).drawInfos);
    } else {
        const nativeDevice: GPUDevice = device.nativeDevice!;
        let buff = buffer as ArrayBuffer;
        let rawBuffer;

        // arraybuffer size not equal to buff.bytelength, so new another array
        buff = buff.slice(0, size);

        if ('buffer' in buff) {
            // es-lint as any
            rawBuffer = (buff as any).buffer;
        } else {
            rawBuffer = buff;
        }

        if (rawBuffer.byteLength !== size) {
            rawBuffer = rawBuffer.slice(0, size);
        }
        // gpuBuffer.glbuffer may not able to be mapped directly, so staging buffer here.
        const stagingBuffer = nativeDevice.createBuffer({
           size,
           usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
           mappedAtCreation: true,
        });
        new Uint8Array(stagingBuffer.getMappedRange(0, size)).set(new Uint8Array(rawBuffer));
        stagingBuffer.unmap();
        const commandEncoder = nativeDevice.createCommandEncoder();
        commandEncoder.copyBufferToBuffer(stagingBuffer, 0, gpuBuffer.glBuffer as GPUBuffer, offset, size);
        const commandBuffer = commandEncoder.finish();
        nativeDevice.queue.submit([commandBuffer]);
        stagingBuffer.destroy();
    }
}

export function WebGPUCmdFuncCreateTexture (device: WebGPUDevice, gpuTexture: IWebGPUTexture) {
    // dimension optional
    // let dim: GPUTextureViewDimension = GFXTextureToWebGPUTexture(gpuTexture.type);

    gpuTexture.glTarget = GFXTextureToWebGPUTexture(gpuTexture.type) as GPUTextureDimension;
    gpuTexture.glInternalFmt = GFXFormatToWGPUTextureFormat(gpuTexture.format);
    gpuTexture.glFormat = GFXFormatToWGPUFormat(gpuTexture.format);
    gpuTexture.glUsage = GFXTextureUsageToNative(gpuTexture.usage);
    gpuTexture.glWrapS = gpuTexture.isPowerOf2 ? 'repeat' : 'clamp-to-edge';
    gpuTexture.glWrapT = gpuTexture.isPowerOf2 ? 'repeat' : 'clamp-to-edge';
    gpuTexture.glMinFilter = 'linear';
    gpuTexture.glMagFilter = 'linear';
    // TBD: 2021 feb 2nd only 1 and 4 supported.
    gpuTexture.samples = gpuTexture.samples > 1 ? 4 : 1;
    const texDescriptor: GPUTextureDescriptor = {
        size: [gpuTexture.width, gpuTexture.height, gpuTexture.depth],
        mipLevelCount: gpuTexture.mipLevel,
        sampleCount: gpuTexture.samples,
        format: gpuTexture.glFormat,
        usage: gpuTexture.glUsage,
    };

    gpuTexture.glTexture = device.nativeDevice!.createTexture(texDescriptor);
}

export function WebGPUCmdFuncDestroyTexture (gpuTexture: IWebGPUTexture) {
    if (gpuTexture.glTexture) {
        gpuTexture.glTexture.destroy();
    }
}

export function WebGPUCmdFuncResizeTexture (device: WebGPUDevice, gpuTexture: IWebGPUTexture) {
    if (gpuTexture.glTexture) {
        WebGPUCmdFuncDestroyTexture(gpuTexture);
    }
    WebGPUCmdFuncCreateTexture(device, gpuTexture);
}

export function WebGPUCmdFuncCreateSampler (device: WebGPUDevice, gpuSampler: IWebGPUGPUSampler) {
    const nativeDevice: GPUDevice = device.nativeDevice!;

    gpuSampler.glMinFilter = (gpuSampler.minFilter === Filter.LINEAR || gpuSampler.minFilter === Filter.ANISOTROPIC) ? 'linear' : 'nearest';
    gpuSampler.glMagFilter = (gpuSampler.magFilter === Filter.LINEAR || gpuSampler.magFilter === Filter.ANISOTROPIC) ? 'linear' : 'nearest';
    gpuSampler.glMipFilter = (gpuSampler.mipFilter === Filter.LINEAR || gpuSampler.mipFilter === Filter.ANISOTROPIC) ? 'linear' : 'nearest';
    gpuSampler.glWrapS = WebGPUAdressMode[gpuSampler.addressU];
    gpuSampler.glWrapT = WebGPUAdressMode[gpuSampler.addressV];
    gpuSampler.glWrapR = WebGPUAdressMode[gpuSampler.addressW];

    const samplerDesc = {} as GPUSamplerDescriptor;
    samplerDesc.addressModeU = gpuSampler.glWrapS;
    samplerDesc.addressModeV = gpuSampler.glWrapT;
    samplerDesc.addressModeW = gpuSampler.glWrapT;
    samplerDesc.minFilter = gpuSampler.glMinFilter;
    samplerDesc.magFilter = gpuSampler.glMagFilter;
    samplerDesc.mipmapFilter = gpuSampler.glMipFilter;
    // samplerDesc.lodMinClamp = 0;// gpuSampler.minLOD;
    // samplerDesc.lodMaxClamp = 32;// gpuSampler.maxLOD;

    const sampler: GPUSampler = nativeDevice.createSampler(samplerDesc);
    gpuSampler.glSampler = sampler;
}

export function WebGPUCmdFuncDestroySampler (device: WebGPUDevice, gpuSampler: IWebGPUGPUSampler) {
    if (gpuSampler.glSampler) {
        gpuSampler.glSampler = null;
    }
}

export function WebGPUCmdFuncDestroyFramebuffer (device: WebGPUDevice, gpuFramebuffer: IWebGPUGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
        gpuFramebuffer.glFramebuffer.destroy();
        gpuFramebuffer.glFramebuffer = null;
    }
}


export const SEPARATE_SAMPLER_BINDING_OFFSET = 16;
function seperateCombinedSamplerTexture(shaderSource: string) {
    // gather
    let samplerReg = /.*?(\(set = \d+, binding = )(\d+)\) uniform[^;]+sampler(\w*) (\w+);/g;
    let iter = samplerReg.exec(shaderSource);
    // samplerName, samplerType
    const referredMap = new Map<string, string>();
    while (iter) {
        const samplerName = iter[4];
        const samplerType = iter[3];
        referredMap.set(samplerName, samplerType);
        iter = samplerReg.exec(shaderSource);
    }

    // replaceAll --> es 2021 required
    let code = shaderSource;
    // referredMap.forEach((value, key)=> {
    //     const samplerName = key;
    //     const samplerType = value;
    //     const exp = new RegExp(`\\b${samplerName}\\b([^;])`);
    //     let it = exp.exec(code);
    //     while (it) {
    //         code = code.replace(exp, `sampler${samplerType}(_${samplerName}, _${samplerName}_sampler)${it[1]}`);
    //         it = exp.exec(code);
    //     }
    // });
    let sampReg = /.*?(\(set = \d+, binding = )(\d+)\) uniform[^;]+sampler(\w*) (\w+);/g;
    let it = sampReg.exec(code);
    while (it) {
        code = code.replace(sampReg, `layout$1 $2) uniform texture$3 $4;\nlayout$1 $2 + ${SEPARATE_SAMPLER_BINDING_OFFSET}) uniform sampler $4_sampler;\n`);
        it = sampReg.exec(code);
    }

    const builtinSample = ['texture', 'textureSize', 'texelFetch', 'textureLod'];
    const replaceBultin = function (samplerName: string, samplerType: string, target: string) {
        builtinSample.forEach((sampleFunc) => {
            const builtinSampleReg = new RegExp(`${sampleFunc}\\s*\\(\\s*${samplerName}\\s*,`);
            let builtinFuncIter = builtinSampleReg.exec(target);
            while (builtinFuncIter) {
                target = target.replace(builtinFuncIter[0], `${sampleFunc}(sampler${samplerType}(${samplerName}, ${samplerName}_sampler),`);
                builtinFuncIter = builtinSampleReg.exec(target);
            }
        });
        return target;
    }

    let funcReg = /\s([\S]+)\s*\(([\w\s,]+)\)[\s|\\|n]*{/g;
    let funcIter = funcReg.exec(code);
    const funcSet = new Set<string>();
    const paramTypeMap = new Map<string, string>();
    while (funcIter) {
        paramTypeMap.clear();

        const params = funcIter[2];
        let paramsRes = params.slice();
        if (params.includes('sampler')) {
            const paramIndexSet = new Set<number>();
            const paramArr = params.split(',');

            for (let i = 0; i < paramArr.length; ++i) {
                const paramDecl = paramArr[i].split(' ');
                // assert(paramDecl.length >= 2)
                const typeDecl = paramDecl[paramDecl.length - 2];
                if (typeDecl.includes('sampler') && typeDecl !== 'sampler') {
                    const samplerType = typeDecl.replace('sampler', '');
                    const paramName = paramDecl[paramDecl.length - 1];
                    paramsRes = paramsRes.replace(paramArr[i], ` texture${samplerType} ${paramName}, sampler ${paramName}_sampler`);
                    paramIndexSet.add(i);
                    paramTypeMap.set(paramName, samplerType);
                }
            }
            // let singleParamReg = new RegExp(`(\\W?)(\\w+)\\s+\\b([^,)]+)\\b`);

            code = code.replace(params, paramsRes);

            const funcName = funcIter[1];
            // function may overload
            if (!funcSet.has(funcName)) {
                // const samplerTypePrefix = '1D|2D|3D|Cube|Buffer';
                const funcSamplerReg = new RegExp(`${funcName}\\s*?\\((\\s*[^;\\{]+)`, 'g');
                // const matches = code.matchAll(funcSamplerReg);
                let matched;
                while ((matched = funcSamplerReg.exec(code)) !== null) {
                // for (let matched of matches) {
                    if (!matched[1].match(/\b\w+\b\s*\b\w+\b/g)) {
                        const stripStr = matched[1][matched[1].length - 1] === ')' ? matched[1].slice(0, -1) : matched[1];
                        let params = stripStr.split(',');
                        let queued = 0; // '('
                        let paramIndex = 0;
                        for (let i = 0; i < params.length; ++i) {
                            if (params[i].includes('(')) {
                                ++queued;
                            }
                            if (params[i].includes(')')) {
                                --queued;
                            }

                            if (!queued || i === params.length - 1) {
                                if (paramIndexSet.has(paramIndex)) {
                                    params[i] += `, ${params[i]}_sampler`;
                                }
                                ++paramIndex;
                            }
                        }
                        const newParams = params.join(',');
                        const newInvokeStr = matched[0].replace(stripStr, newParams);
                        code = code.replace(matched[0], newInvokeStr);
                    }
                    // else: function declare
                }
            }

            let count = 1;
            let startIndex = code.indexOf(funcIter[1], funcIter.index);
            startIndex = code.indexOf('{', startIndex) + 1;
            let endIndex = 0;
            while (count) {
                if (code.charAt(startIndex) === '{') {
                    ++count;
                } else if (code.charAt(startIndex) === '}') {
                    --count;
                }

                if (count === 0) {
                    endIndex = startIndex;
                    break;
                }

                const nextLeft = code.indexOf('{', startIndex + 1);
                const nextRight = code.indexOf('}', startIndex + 1);
                startIndex = nextLeft === -1 ? nextRight : Math.min(nextLeft, nextRight);
            }
            const funcBody = code.slice(funcIter.index, endIndex);
            let newFunc = funcBody;
            paramTypeMap.forEach((type, name) => {
                newFunc = replaceBultin(name, type, newFunc);
            });

            code = code.replace(funcBody, newFunc);
            funcSet.add(funcIter[1]);
        }
        funcIter = funcReg.exec(code);
    }

    referredMap.forEach((type, name) => {
        code = replaceBultin(name, type, code);
    });

    ///////////////////////////////////////////////////////////
    // isNan, isInf has been removed in dawn:tint

    let functionDefs = '';
    const precisionKeyWord = 'highp';
    const isNanIndex = code.indexOf('isnan');
    if (isNanIndex !== -1) {
        // getPrecision(isNanIndex);
        functionDefs += `\n
         bool isNan(${precisionKeyWord} float val) {
             return (val < 0.0 || 0.0 < val || val == 0.0) ? false : true;
         }
         \n`;
        code = code.replace(/isnan\(/gi, 'isNan(');
    }

    const isInfIndex = code.indexOf('isinf');
    if (isInfIndex !== -1) {
        // getPrecision(isInfIndex);
        functionDefs += `\n
         bool isInf(${precisionKeyWord} float x) {
             return x == x * 2.0 && x != 0.0;
         }
         \n`;
        code = code.replace(/isinf\(/gi, 'isInf(');
    }

    ///////////////////////////////////////////////////////////

    let firstPrecisionIdx = code.indexOf('precision');
    firstPrecisionIdx = code.indexOf(';', firstPrecisionIdx);
    firstPrecisionIdx += 1;
    code = `${code.slice(0, firstPrecisionIdx)}\n${functionDefs}\n${code.slice(firstPrecisionIdx)}`;

    return code;
}

export function WebGPUCmdFuncCreateGPUShader(device: WebGPUDevice, gpuShader: IWebGPUGPUShader) {
    // const wgslStages: string[] = [];
    const nativeDevice = device.nativeDevice!;
    const glslang = device.glslang;
    const twgsl = device.twgsl;
    for (let i = 0; i < gpuShader.gpuStages.length; ++i) {
        const gpuStage = gpuShader.gpuStages[i];
        let glslSource = seperateCombinedSamplerTexture(gpuStage.source);
        const stageStr = gpuStage.type === ShaderStageFlagBit.VERTEX ? 'vertex'
            : gpuStage.type === ShaderStageFlagBit.FRAGMENT ? 'fragment' : 'compute';
        // if (stageStr === 'compute') {
        //     glslSource = overwriteBlock(shaderInfo, glslSource);
        // }
        const sourceCode = `#version 450\n#define CC_USE_WGPU 1\n${glslSource}`;
        const spv = glslang.compileGLSL(sourceCode, stageStr, false, '1.3');

        const wgsl = twgsl.convertSpirV2WGSL(spv);
        if (wgsl === '') {
            console.error("empty wgsl");
        }
        gpuStage.source = wgsl;
        // wgslStages.push(wgsl);
        const shader: GPUShaderModule = nativeDevice?.createShaderModule({ code: wgsl });
        shader.getCompilationInfo().then((compileInfo: GPUCompilationInfo) => {
            compileInfo.messages.forEach((info) => {
                console.log(info.lineNum, info.linePos, info.type, info.message);
            });
        }).catch((compileInfo: GPUCompilationInfo) => {
            compileInfo.messages.forEach((info) => {
                console.log(info.lineNum, info.linePos, info.type, info.message);
            });
        });
        const shaderStage: GPUProgrammableStage = {
            module: shader,
            entryPoint: 'main',
        };
        gpuStage.glShader = shaderStage;
    }
}

export function WebGPUCmdFuncDestroyShader (device: WebGPUDevice, gpuShader: IWebGPUGPUShader) {
    if (gpuShader.glProgram) {
        // device.gl.deleteProgram(gpuShader.glProgram);
        gpuShader.glProgram = null;
    }
}

export function WebGPUCmdFuncCreateInputAssember (device: WebGPUDevice, gpuInputAssembler: IWebGPUGPUInputAssembler) {
    gpuInputAssembler.glAttribs = new Array<IWebGPUAttrib>(gpuInputAssembler.attributes.length);

    const offsets = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < gpuInputAssembler.attributes.length; ++i) {
        const attrib = gpuInputAssembler.attributes[i];

        const stream = attrib.stream !== undefined ? attrib.stream : 0;
        // if (stream < gpuInputAssembler.gpuVertexBuffers.length) {

        const gpuBuffer = gpuInputAssembler.gpuVertexBuffers[stream];

        const glType = 0;
        const size = FormatInfos[attrib.format].size;

        gpuInputAssembler.glAttribs[i] = {
            name: attrib.name,
            glBuffer: gpuBuffer.glBuffer,
            glType,
            size,
            count: FormatInfos[attrib.format].count,
            stride: gpuBuffer.stride,
            componentCount: 4,
            isNormalized: (attrib.isNormalized !== undefined ? attrib.isNormalized : false),
            isInstanced: (attrib.isInstanced !== undefined ? attrib.isInstanced : false),
            offset: offsets[stream],
        };

        offsets[stream] += size;
    }
}

export function WebGPUCmdFuncDestroyInputAssembler (device: WebGPUDevice, gpuInputAssembler: IWebGPUGPUInputAssembler) {
    const it = gpuInputAssembler.glVAOs.values();
    let res = it.next();
    while (!res.done) {
        // device.gl.deleteVertexArray(res.value);
        res = it.next();
    }
    gpuInputAssembler.glVAOs.clear();
}

interface IWebGPUStateCache {
    gpuPipelineState: IWebGPUGPUPipelineState | null;
    gpuInputAssembler: IWebGPUGPUInputAssembler | null;
    reverseCW: boolean;
    glPrimitive: GPUPrimitiveTopology;
    invalidateAttachments: GLenum[];
}

function maxElementOfImageArray (bufInfoArr: BufferTextureCopy[]): number {
    let maxSize = 0;
    for (let i = 0; i < bufInfoArr.length; i++) {
        const curSize = bufInfoArr[i].texExtent.width * bufInfoArr[i].texExtent.height * bufInfoArr[i].texExtent.depth;
        maxSize = maxSize < curSize ? curSize : maxSize;
    }
    return maxSize;
}

export async function WebGPUCmdFuncCopyTexImagesToTexture (
    device: WebGPUDevice,
    texImages: TexImageSource[],
    gpuTexture: IWebGPUTexture,
    regions: BufferTextureCopy[],
): Promise<void> {
    // name all native webgpu resource nativeXXX distinguished from gpuTexture passed in.
    const nativeDevice = device.nativeDevice!;
    for (let i = 0; i < regions.length; i++) {
        const texImg = texImages[i];
        nativeDevice.queue.copyExternalImageToTexture(
            { source: texImg },
            { texture: gpuTexture.glTexture! },
            [regions[i].texExtent.width, regions[i].texExtent.height, regions[i].texExtent.depth]
        );
    }
}

export function WebGPUCmdFuncCopyBuffersToTexture (
    device: WebGPUDevice,
    buffers: ArrayBufferView[],
    gpuTexture: IWebGPUTexture,
    regions: BufferTextureCopy[],
) {
    const nativeDevice = device.nativeDevice!;
    const commandEncoder = nativeDevice.createCommandEncoder();
    const buffInfo = new BufferInfo();
    buffInfo.usage = BufferUsageBit.TRANSFER_SRC;
    const wBuff = device.createBuffer(buffInfo);
    for (let i = 0; i < regions.length; ++i) {
        const region = regions[i];
        const arrayBuffer = buffers[i];
        let buffer; // buffers and regions are a one-to-one mapping
        if ('buffer' in arrayBuffer) {
            buffer = new Uint8Array(arrayBuffer.buffer, arrayBuffer.byteOffset, arrayBuffer.byteLength);
        } else {
            buffer = new Uint8Array(arrayBuffer);
        }
        wBuff.update(buffer);
        const nativeBuff = (wBuff as WebGPUBuffer).gpuBuffer.glBuffer!;
        commandEncoder.copyBufferToTexture(
            {
                buffer: nativeBuff,
                bytesPerRow: buffer.byteLength / region.texExtent.width, // Each pixel takes up 4 bytes
                rowsPerImage: region.texExtent.height,
            },
            {
                texture: gpuTexture.glTexture!,
                origin: {
                    x: region.texOffset.x,
                    y: region.texOffset.y,
                    z: region.texOffset.z
                }
            },
            [region.texExtent.width, region.texExtent.height, region.texExtent.depth]
        );
    }

    // Execute commands and release resources
    nativeDevice.queue.submit([commandEncoder.finish()]);
    wBuff.destroy();
}
