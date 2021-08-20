import { CachedArray } from '../../memop/cached-array';
import { error, errorID } from '../../platform';
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
    IWebGPUGPUTexture,
    IWebGPUGPUUniformBlock,
    IWebGPUGPUUniformSampler,
    IWebGPUGPURenderPass,
} from './webgpu-gpu-objects';

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

export function GLDescTypeToWebGPUDescType (descType: DescriptorType) {
    switch (descType) {
        case DescriptorType.UNIFORM_BUFFER:
        case DescriptorType.DYNAMIC_UNIFORM_BUFFER:
            return 'uniform-buffer';
        case DescriptorType.STORAGE_BUFFER:
            return 'storage-buffer';
        case DescriptorType.SAMPLER:
            return 'sampler';
        case DescriptorType.SAMPLER_TEXTURE:
            return 'sampled-texture';
        default:
            console.error('binding type not support by webGPU!');
    }
}

export function GFXFormatToWGPUVertexFormat (format: Format): GPUVertexFormat {
    switch (format) {
        case Format.R32F: return 'float';
        case Format.R32UI: return 'uint';
        case Format.R32I: return 'int';

        case Format.RG8: return 'uchar2norm';
        case Format.RG8SN: return 'char2norm';
        case Format.RG8UI: return 'uchar2';
        case Format.RG8I: return 'char2';
        case Format.RG16F: return 'half2';
        case Format.RG16UI: return 'ushort2';
        case Format.RG16I: return 'short2';
        case Format.RG32F: return 'float2';
        case Format.RG32UI: return 'uint2';
        case Format.RG32I: return 'int2';

        case Format.RGB32F: return 'float3';
        case Format.RGB32UI: return 'uint3';
        case Format.RGB32I: return 'int3';

        case Format.BGRA8: return 'uchar4norm';
        case Format.RGBA8: return 'uchar4norm';
        case Format.SRGB8_A8: return 'char4';
        case Format.RGBA8SN: return 'char4norm';
        case Format.RGBA8UI: return 'uchar4';
        case Format.RGBA8I: return 'char4';
        case Format.RGBA16F: return 'half4';
        case Format.RGBA16UI: return 'ushort4';
        case Format.RGBA16I: return 'short4';
        case Format.RGBA32F: return 'float4';
        case Format.RGBA32UI: return 'uint4';
        case Format.RGBA32I: return 'int4';

        default: {
            console.warn('unexpected format for WGPU detected, return \'int\' as default.');
            return 'int';
        }
    }
}

export function GFXFormatToWGPUTextureFormat (format: Format): GPUTextureFormat {
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

        case Format.D24: return 'depth24plus';
        case Format.D32F: return 'depth32float';
        case Format.D32F_S8: return 'depth24plus-stencil8';

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

    if (TextureUsageBit.TRANSFER_DST) {
        nativeUsage |= GPUTextureUsage.COPY_DST;
    }

    if (TextureUsageBit.SAMPLED) {
        nativeUsage |= GPUTextureUsage.SAMPLED;
    }

    if (TextureUsageBit.STORAGE) {
        nativeUsage |= GPUTextureUsage.STORAGE;
    }

    if (TextureUsageBit.COLOR_ATTACHMENT) {
        nativeUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
    }

    if (TextureUsageBit.DEPTH_STENCIL_ATTACHMENT) {
        nativeUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
    }

    if (typeof nativeUsage === 'undefined') {
        console.error('Unsupported texture usage, convert to webGPU type failed.');
        nativeUsage = GPUTextureUsage.RENDER_ATTACHMENT;
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
    'src-color',
    'dst-color',
    'one-minus-src-color',
    'one-minus-dst-color',
    'src-alpha-saturated',
    'blend-color', // CONSTANT_COLOR
    'one-minus-blend-color', // ONE_MINUS_CONSTANT_COLOR
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
    public gpuTexture: IWebGPUGPUTexture | null = null;
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
    const nativeDevice: GPUDevice = device.nativeDevice()!;

    const bufferDesc = {} as GPUBufferDescriptor;
    bufferDesc.size = gpuBuffer.size;

    let bufferUsage = 0x0;

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

    // FIXME: depend by inputs but vertexbuffer was updated without COPY_DST.
    bufferUsage |= GPUBufferUsage.COPY_DST;

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
        const nativeDevice: GPUDevice = device.nativeDevice()!;
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
        // const stagingBuffer = nativeDevice.createBuffer({
        //    size,
        //    usage: GPUBufferUsage.COPY_SRC,
        //    mappedAtCreation: true,
        // });
        // new Uint8Array(stagingBuffer.getMappedRange(0, size)).set(new Uint8Array(buff));
        // stagingBuffer.unmap();

        const cache = device.stateCache;

        if (buff.byteLength % 4 !== 0) {
            const newBuffer = new Uint8Array(Math.ceil(rawBuffer.byteLength / 4) * 4);
            newBuffer.set(new Uint8Array(rawBuffer), 0);
            nativeDevice.queue.writeBuffer(gpuBuffer.glBuffer!, 0, newBuffer);
        } else {
            nativeDevice.queue.writeBuffer(gpuBuffer.glBuffer!, offset, buff);
        }

        const encoder = nativeDevice.createCommandEncoder();
        nativeDevice.queue.submit([encoder.finish()]);

        // const commandEncoder = nativeDevice.createCommandEncoder();
        // commandEncoder.copyBufferToBuffer(stagingBuffer, 0, gpuBuffer.glBuffer as GPUBuffer, offset, size);
        // const commandBuffer = commandEncoder.finish();
        // nativeDevice.queue.submit([commandBuffer]);
        // stagingBuffer.destroy();
    }
}

export function WebGPUCmdFuncCreateTexture (device: WebGPUDevice, gpuTexture: IWebGPUGPUTexture) {
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

    gpuTexture.glTexture = device.nativeDevice()!.createTexture(texDescriptor);
}

export function WebGPUCmdFuncDestroyTexture (gpuTexture: IWebGPUGPUTexture) {
    if (gpuTexture.glTexture) {
        gpuTexture.glTexture.destroy();
    }
}

export function WebGPUCmdFuncResizeTexture (device: WebGPUDevice, gpuTexture: IWebGPUGPUTexture) {
    if (gpuTexture.glTexture) {
        WebGPUCmdFuncDestroyTexture(gpuTexture);
    }
    WebGPUCmdFuncCreateTexture(device, gpuTexture);
}

export function WebGPUCmdFuncCreateSampler (device: WebGPUDevice, gpuSampler: IWebGPUGPUSampler) {
    const nativeDevice: GPUDevice = device.nativeDevice()!;

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
    samplerDesc.lodMinClamp = 0;// gpuSampler.minLOD;
    samplerDesc.lodMaxClamp = 1000;// gpuSampler.maxLOD;

    const sampler: GPUSampler = nativeDevice.createSampler(samplerDesc);
    gpuSampler.glSampler = sampler;
}

export function WebGPUCmdFuncDestroySampler (device: WebGPUDevice, gpuSampler: IWebGPUGPUSampler) {
    if (gpuSampler.glSampler) {
        device.gl.deleteSampler(gpuSampler.glSampler);
        gpuSampler.glSampler = null;
    }
}

export function WebGPUCmdFuncDestroyFramebuffer (device: WebGPUDevice, gpuFramebuffer: IWebGPUGPUFramebuffer) {
    if (gpuFramebuffer.glFramebuffer) {
        device.gl.deleteFramebuffer(gpuFramebuffer.glFramebuffer);
        gpuFramebuffer.glFramebuffer = null;
    }
}

// ----------------------- FIXME: a temp solution for seperate sampler/texture, needs to be done in editor-------------------------------------
/*
CCSamplerTexture(sampler2D tex, vec2 uv){
    ...
    texture(tex,uv);
    ...
}

origin:
CCSamplerTexture(texSampler, uv);
to:
CCSamplerTexture(sampler2D(tex, sampler), uv);

error occurs:
'call argument' : sampler constructor must appear at point of use
*/
//------------------------------------------------------------------------------------------------------------

function removeCombinedSamplerTexture (shaderSource: string) {
    // sampler and texture
    const samplerTexturArr = shaderSource.match(/(.*?)\(set = \d+, binding = \d+\) uniform(.*?)sampler\w* \w+;/g);
    const count = samplerTexturArr?.length ? samplerTexturArr?.length : 0;
    let code = shaderSource;

    const referredFuncSet = new Set<[fnName: string, samplerType: string]>();
    const samplerTypeSet = new Set<string>();
    samplerTexturArr?.every((str) => {
        const textureName = str.match(/(?<=uniform(.*?)sampler\w* )(\w+)(?=;)/g)!.toString();
        let samplerStr = str.replace(textureName, `${textureName}Sampler`);
        let samplerFunc = samplerStr.match(/(?<=uniform(.*?))sampler(\w*)/g)!.toString();
        samplerFunc = samplerFunc.replace('sampler', '');
        samplerStr = samplerStr.replace(/(?<=uniform(.*?))(sampler\w*)/g, 'sampler');

        // layout (set = a, binding = b) uniform sampler2D cctex;
        // to:
        // layout (set = a, binding = b) uniform sampler cctexSampler;
        // layout (set = a, binding = b + maxTextureNum) uniform texture2D cctex;
        const samplerReg = /(?<=binding = )(\d+)(?=\))/g;
        const samplerBindingStr = str.match(samplerReg)!.toString();
        const samplerBinding = Number(samplerBindingStr) + 16;
        samplerStr = samplerStr.replace(samplerReg, samplerBinding.toString());

        const textureStr = str.replace(/(?<=uniform(.*?))(sampler)(?=\w*)/g, 'texture');
        code = code.replace(str, `${samplerStr}\n${textureStr}`);

        if (!samplerTypeSet.has(samplerFunc)) {
            samplerTypeSet.add(samplerFunc);
            // gathering referred func
            const referredFuncStr = `([\\w]+)\\(sampler${samplerFunc}[^\\)]+\\).*{`;
            const referredFuncRe = new RegExp(referredFuncStr, 'g');
            let reArr = referredFuncRe.exec(code);
            while (reArr) {
                referredFuncSet.add([reArr[1], samplerFunc]);
                reArr = referredFuncRe.exec(code);
            }
        }

        // cctex in main() called directly
        // .*?texture\(
        const regStr = `texture\\(\\b(${textureName})\\b`;
        const re = new RegExp(regStr);
        let reArr = re.exec(code);
        while (reArr) {
            code = code.replace(re, `texture(sampler${samplerFunc}(${textureName},${textureName}Sampler)`);
            reArr = re.exec(code);
        }
        return true;
    });

    // function
    referredFuncSet.forEach((pair) => {
        // 1. fn definition
        const fnDefReStr = `.*?${pair[0]}\\(sampler${pair[1]}[^}]+}`;
        const fnDefRe = new RegExp(fnDefReStr);
        let fnArr = fnDefRe.exec(code);
        while (fnArr) {
            const samplerType = `sampler${pair[1]}`;
            const textureRe = (new RegExp(`.*?${samplerType}[\\s]+([\\S]+),`)).exec(fnArr[0])!;
            const textureName = textureRe[1];
            const paramReStr = `${samplerType}[\\s]+${textureName}`;
            let funcDef = fnArr[0].replace(new RegExp(paramReStr), `texture${pair[1]} ${textureName}, sampler ${textureName}Sampler`);

            // 2. texture(...) inside, builtin funcs
            const textureOpArr = ['texture', 'textureSize', 'texelFetch'];
            for (let i = 0; i < textureOpArr.length; i++) {
                const texFuncReStr = `(${textureOpArr[i]})\\(${textureName},`;
                const texFuncRe = new RegExp(texFuncReStr, 'g');
                funcDef = funcDef.replace(texFuncRe, `$1(${samplerType}(${textureName}, ${textureName}Sampler),`);
            }
            code = code.replace(fnDefRe, funcDef);

            fnArr = fnDefRe.exec(code);
        }

        // 3. fn called
        // getVec3DisplacementFromTexture\(([\S]+),[^\)]+
        const calledReStr = `(?<!vec.*?)${pair[0]}\\(([\\S]+),[\\s]*[^\\)]+`;
        const calledRe = new RegExp(calledReStr, 'g');
        let calledArr = calledRe.exec(code);
        while (calledArr) {
            if (!calledArr[0].includes(`${calledArr[1]}, ${calledArr[1]}Sampler`)) {
                const calledStr = calledArr[0].replace(calledArr[1], `${calledArr[1]}, ${calledArr[1]}Sampler`);
                code = code.replace(calledArr[0], calledStr);
            }
            calledArr = calledRe.exec(code);
        }
    });
    // code = code.replace(/(?<!vec4 )(CCSampleTexture\(.+\))/g, 'CCSampleTexture(cc_spriteTextureSampler, cc_spriteTexture, uv0)');
    return code;
}

type ShaderStage = 'vertex' | 'fragment' | 'compute';
export function WebGPUCmdFuncCreateShader (device: WebGPUDevice, gpuShader: IWebGPUGPUShader) {
    const nativeDevice = device.nativeDevice()!;
    const glslang = device.glslang()!;

    for (let k = 0; k < gpuShader.gpuStages.length; k++) {
        const gpuStage = gpuShader.gpuStages[k];

        let glShaderType: number = GPUShaderStage.VERTEX;
        let shaderTypeStr: ShaderStage = 'vertex';
        const lineNumber = 1;

        switch (gpuStage.type) {
            case ShaderStageFlagBit.VERTEX: {
                shaderTypeStr = 'vertex';
                glShaderType = GPUShaderStage.VERTEX;
                break;
            }
            case ShaderStageFlagBit.FRAGMENT: {
                shaderTypeStr = 'fragment';
                glShaderType = GPUShaderStage.FRAGMENT;
                break;
            }
            case ShaderStageFlagBit.COMPUTE: {
                shaderTypeStr = 'compute';
                glShaderType = GPUShaderStage.COMPUTE;
                break;
            }
            default: {
                console.error('Unsupported GFXShaderType.');
                return;
            }
        }

        const useWGSL = false;
        let sourceCode = `#version 450\n${gpuStage.source}`;
        sourceCode = removeCombinedSamplerTexture(sourceCode);
        if (gpuShader.name === 'builtin-standard|standard-vs:vert|standard-fs:frag|CC_USE_MORPH1|CC_MORPH_TARGET_COUNT1|CC_SUPPORT_FLOAT_TEXTURE1|CC_MORPH_TARGET_HAS_POSITION1|CC_USE_FOG4|USE_ALBEDO_MAP1'
            && shaderTypeStr === 'vertex') {
            sourceCode = `#version 450
#define CC_USE_MORPH 1
#define CC_MORPH_TARGET_COUNT 1
#define CC_SUPPORT_FLOAT_TEXTURE 1
#define CC_MORPH_PRECOMPUTED 0
#define CC_MORPH_TARGET_HAS_POSITION 1
#define CC_MORPH_TARGET_HAS_NORMAL 0
#define CC_MORPH_TARGET_HAS_TANGENT 0
#define CC_USE_SKINNING 0
#define CC_USE_BAKED_ANIMATION 0
#define USE_INSTANCING 0
#define USE_BATCHING 0
#define USE_LIGHTMAP 0
#define CC_USE_FOG 4
#define CC_FORWARD_ADD 0
#define USE_VERTEX_COLOR 0
#define USE_NORMAL_MAP 0
#define HAS_SECOND_UV 0
#define CC_USE_IBL 0
#define CC_RECEIVE_SHADOW 0
#define CC_USE_HDR 0
#define USE_ALBEDO_MAP 1
#define ALBEDO_UV v_uv
#define NORMAL_UV v_uv
#define PBR_UV v_uv
#define USE_PBR_MAP 0
#define USE_METALLIC_ROUGHNESS_MAP 0
#define USE_OCCLUSION_MAP 0
#define USE_EMISSIVE_MAP 0
#define EMISSIVE_UV v_uv
#define USE_ALPHA_TEST 0
#define ALPHA_TEST_CHANNEL a

#extension GL_EXT_shader_explicit_arithmetic_types_int16: require
precision highp float;
highp float decode32 (highp vec4 rgba) {
  rgba = rgba * 255.0;
  highp float Sign = 1.0 - (step(128.0, (rgba[3]) + 0.5)) * 2.0;
  highp float Exponent = 2.0 * (mod(float(int((rgba[3]) + 0.5)), 128.0)) + (step(128.0, (rgba[2]) + 0.5)) - 127.0;
  highp float Mantissa = (mod(float(int((rgba[2]) + 0.5)), 128.0)) * 65536.0 + rgba[1] * 256.0 + rgba[0] + 8388608.0;
  return Sign * exp2(Exponent - 23.0) * Mantissa;
}
struct StandardVertInput {
  highp vec4 position;
  vec3 normal;
  vec4 tangent;
};
layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_texCoord;
layout(location = 3) in vec4 a_tangent;
#if CC_USE_MORPH
    int getVertexId() {
        return gl_VertexIndex;
    }
layout(set = 2, binding = 4) uniform CCMorph {
    vec4 cc_displacementWeights[15];
    vec4 cc_displacementTextureInfo;
};
vec2 getPixelLocation(vec2 textureResolution, int pixelIndex) {
    float pixelIndexF = float(pixelIndex);
    float x = mod(pixelIndexF, textureResolution.x);
    float y = floor(pixelIndexF / textureResolution.x);
    return vec2(x, y);
}
vec2 getPixelCoordFromLocation(vec2 location, vec2 textureResolution) {
    return (vec2(location.x, location.y) + .5) / textureResolution;
}
#if CC_SUPPORT_FLOAT_TEXTURE
        vec4 fetchVec3ArrayFromTexture(texture2D tex, sampler texSampler, int pixelIndex) {
            ivec2 texSize = textureSize(sampler2D(tex, texSampler), 0);
            return texelFetch(sampler2D(tex, texSampler), ivec2(pixelIndex % texSize.x, pixelIndex / texSize.x), 0);
        }
#else
    vec4 fetchVec3ArrayFromTexture(texture2D tex, sampler texSampler, int elementIndex) {
        int pixelIndex = elementIndex * 4;
        vec2 location = getPixelLocation(cc_displacementTextureInfo.xy, pixelIndex);
        vec2 x = getPixelCoordFromLocation(location + vec2(0.0, 0.0), cc_displacementTextureInfo.xy);
        vec2 y = getPixelCoordFromLocation(location + vec2(1.0, 0.0), cc_displacementTextureInfo.xy);
        vec2 z = getPixelCoordFromLocation(location + vec2(2.0, 0.0), cc_displacementTextureInfo.xy);
        return vec4(
            decode32(texture(sampler2D(tex, texSampler), x)),
            decode32(texture(sampler2D(tex, texSampler), y)),
            decode32(texture(sampler2D(tex, texSampler), z)),
            1.0
        );
    }
#endif
float getDisplacementWeight(int index) {
    int quot = index / 4;
    int remainder = index - quot * 4;
    if (remainder == 0) {
        return cc_displacementWeights[quot].x;
    } else if (remainder == 1) {
        return cc_displacementWeights[quot].y;
    } else if (remainder == 2) {
        return cc_displacementWeights[quot].z;
    } else {
        return cc_displacementWeights[quot].w;
    }
}
vec3 getVec3DisplacementFromTexture(texture2D tex, sampler texSampler, int vertexIndex) {
#if CC_MORPH_PRECOMPUTED
    return fetchVec3ArrayFromTexture(tex, texSampler, vertexIndex).rgb;
#else
    vec3 result = vec3(0, 0, 0);
    int nVertices = int(cc_displacementTextureInfo.z);
    for (int iTarget = 0; iTarget < CC_MORPH_TARGET_COUNT; ++iTarget) {
        result += (fetchVec3ArrayFromTexture(tex, texSampler, nVertices * iTarget + vertexIndex).rgb * getDisplacementWeight(iTarget));
    }
    return result;
#endif
}
#if CC_MORPH_TARGET_HAS_POSITION
    layout(set = 2, binding = 6) uniform sampler cc_PositionDisplacementsSampler;
layout(set = 2, binding = 22) uniform texture2D cc_PositionDisplacements;
    vec3 getPositionDisplacement(int vertexId) {
        return getVec3DisplacementFromTexture(cc_PositionDisplacements, cc_PositionDisplacementsSampler, vertexId);
    }
#endif
#if CC_MORPH_TARGET_HAS_NORMAL
    layout(set = 2, binding = 7) uniform sampler cc_NormalDisplacementsSampler;
layout(set = 2, binding = 23) uniform texture2D cc_NormalDisplacements;
    vec3 getNormalDisplacement(int vertexId) {
        return getVec3DisplacementFromTexture(cc_NormalDisplacements, cc_NormalDisplacementsSampler, vertexId);
    }
#endif
#if CC_MORPH_TARGET_HAS_TANGENT
    layout(set = 2, binding = 8) uniform sampler cc_TangentDisplacementsSampler;
layout(set = 2, binding = 24) uniform texture2D cc_TangentDisplacements;
    vec3 getTangentDisplacement(int vertexId) {
        return getVec3DisplacementFromTexture(cc_TangentDisplacements, cc_TangentDisplacementsSampler, vertexId);
    }
#endif
void applyMorph (inout StandardVertInput attr) {
    int vertexId = getVertexId();
#if CC_MORPH_TARGET_HAS_POSITION
    attr.position.xyz = attr.position.xyz + getPositionDisplacement(vertexId);
#endif
#if CC_MORPH_TARGET_HAS_NORMAL
    attr.normal.xyz = attr.normal.xyz + getNormalDisplacement(vertexId);
#endif
#if CC_MORPH_TARGET_HAS_TANGENT
    attr.tangent.xyz = attr.tangent.xyz + getTangentDisplacement(vertexId);
#endif
}
void applyMorph (inout vec4 position) {
#if CC_MORPH_TARGET_HAS_POSITION
    position.xyz = position.xyz + getPositionDisplacement(getVertexId());
#endif
}
#endif
#if CC_USE_SKINNING
  layout(location = 4) in u16vec4 a_joints;
layout(location = 5) in vec4 a_weights;
#if CC_USE_BAKED_ANIMATION
  #if USE_INSTANCING
    layout(location = 7) in highp vec4 a_jointAnimInfo;
  #endif
  layout(set = 2, binding = 3) uniform CCSkinningTexture {
    highp vec4 cc_jointTextureInfo;
  };
  layout(set = 2, binding = 2) uniform CCSkinningAnimation {
    highp vec4 cc_jointAnimInfo;
  };
  layout(set = 2, binding = 5) uniform highp sampler2D cc_jointTexture;
  #else
  layout(set = 2, binding = 3) uniform CCSkinning {
    highp vec4 cc_joints[30 * 3];
  };
#endif
#if CC_USE_BAKED_ANIMATION
  #if CC_SUPPORT_FLOAT_TEXTURE
    mat4 getJointMatrix (float i) {
    #if USE_INSTANCING
      highp float j = 3.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;
    #else
      highp float j = 3.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;
    #endif
    highp float invSize = cc_jointTextureInfo.w;
    highp float y = floor(j * invSize);
    highp float x = j - y * cc_jointTextureInfo.x;
    y = (y + 0.5) * invSize;
      vec4 v1 = texture(cc_jointTexture, vec2((x + 0.5) * invSize, y));
      vec4 v2 = texture(cc_jointTexture, vec2((x + 1.5) * invSize, y));
      vec4 v3 = texture(cc_jointTexture, vec2((x + 2.5) * invSize, y));
      return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
    }
  #else
    mat4 getJointMatrix (float i) {
    #if USE_INSTANCING
      highp float j = 12.0 * (a_jointAnimInfo.x * a_jointAnimInfo.y + i) + a_jointAnimInfo.z;
    #else
      highp float j = 12.0 * (cc_jointAnimInfo.x * cc_jointTextureInfo.y + i) + cc_jointTextureInfo.z;
    #endif
    highp float invSize = cc_jointTextureInfo.w;
    highp float y = floor(j * invSize);
    highp float x = j - y * cc_jointTextureInfo.x;
    y = (y + 0.5) * invSize;
      vec4 v1 = vec4(
        decode32(texture(cc_jointTexture, vec2((x + 0.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 1.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 2.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 3.5) * invSize, y)))
      );
      vec4 v2 = vec4(
        decode32(texture(cc_jointTexture, vec2((x + 4.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 5.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 6.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 7.5) * invSize, y)))
      );
      vec4 v3 = vec4(
        decode32(texture(cc_jointTexture, vec2((x + 8.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 9.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 10.5) * invSize, y))),
        decode32(texture(cc_jointTexture, vec2((x + 11.5) * invSize, y)))
      );
      return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
    }
  #endif
#else
  mat4 getJointMatrix (float i) {
    int idx = int(i);
    vec4 v1 = cc_joints[idx * 3];
    vec4 v2 = cc_joints[idx * 3 + 1];
    vec4 v3 = cc_joints[idx * 3 + 2];
    return mat4(vec4(v1.xyz, 0.0), vec4(v2.xyz, 0.0), vec4(v3.xyz, 0.0), vec4(v1.w, v2.w, v3.w, 1.0));
  }
#endif
mat4 skinMatrix () {
  vec4 joints = vec4(a_joints);
  return getJointMatrix(joints.x) * a_weights.x
       + getJointMatrix(joints.y) * a_weights.y
       + getJointMatrix(joints.z) * a_weights.z
       + getJointMatrix(joints.w) * a_weights.w;
}
void CCSkin (inout vec4 position) {
  mat4 m = skinMatrix();
  position = m * position;
}
void CCSkin (inout StandardVertInput attr) {
  mat4 m = skinMatrix();
  attr.position = m * attr.position;
  attr.normal = (m * vec4(attr.normal, 0.0)).xyz;
  attr.tangent.xyz = (m * vec4(attr.tangent.xyz, 0.0)).xyz;
}
#endif
layout(set = 0, binding = 0) uniform CCGlobal {
  highp   vec4 cc_time;
  mediump vec4 cc_screenSize;
  mediump vec4 cc_nativeSize;
};
layout(set = 0, binding = 1) uniform CCCamera {
  highp   mat4 cc_matView;
  highp   mat4 cc_matViewInv;
  highp   mat4 cc_matProj;
  highp   mat4 cc_matProjInv;
  highp   mat4 cc_matViewProj;
  highp   mat4 cc_matViewProjInv;
  highp   vec4 cc_cameraPos;
  mediump vec4 cc_screenScale;
  mediump vec4 cc_exposure;
  mediump vec4 cc_mainLitDir;
  mediump vec4 cc_mainLitColor;
  mediump vec4 cc_ambientSky;
  mediump vec4 cc_ambientGround;
  mediump vec4 cc_fogColor;
  mediump vec4 cc_fogBase;
  mediump vec4 cc_fogAdd;
};
#if USE_INSTANCING
  layout(location = 8) in vec4 a_matWorld0;
  layout(location = 9) in vec4 a_matWorld1;
  layout(location = 10) in vec4 a_matWorld2;
  #if USE_LIGHTMAP
    layout(location = 11) in vec4 a_lightingMapUVParam;
  #endif
#elif USE_BATCHING
  layout(location = 12) in float a_dyn_batch_id;
  layout(set = 2, binding = 0) uniform CCLocalBatched {
    highp mat4 cc_matWorlds[10];
  };
#else
layout(set = 2, binding = 0) uniform CCLocal {
  highp mat4 cc_matWorld;
  highp mat4 cc_matWorldIT;
  highp vec4 cc_lightingMapUVParam;
};
#endif
layout(set = 1, binding = 0) uniform Constants {
  vec4 tilingOffset;
  vec4 albedo;
  vec4 albedoScaleAndCutoff;
  vec4 pbrParams;
  vec4 emissive;
  vec4 emissiveScaleParam;
};
float LinearFog(vec4 pos) {
    vec4 wPos = pos;
    float cam_dis = distance(cc_cameraPos, wPos);
    float fogStart = cc_fogBase.x;
    float fogEnd = cc_fogBase.y;
    return clamp((fogEnd - cam_dis) / (fogEnd - fogStart), 0., 1.);
}
float ExpFog(vec4 pos) {
    vec4 wPos = pos;
    float fogAtten = cc_fogAdd.z;
    float fogDensity = cc_fogBase.z;
    float cam_dis = distance(cc_cameraPos, wPos) / fogAtten * 4.;
    float f = exp(-cam_dis * fogDensity);
    return f;
}
float ExpSquaredFog(vec4 pos) {
    vec4 wPos = pos;
    float fogAtten = cc_fogAdd.z;
    float fogDensity = cc_fogBase.z;
    float cam_dis = distance(cc_cameraPos, wPos) / fogAtten * 4.;
    float f = exp(-cam_dis * cam_dis * fogDensity * fogDensity);
    return f;
}
float LayeredFog(vec4 pos) {
    vec4 wPos = pos;
    float fogAtten = cc_fogAdd.z;
    float _FogTop = cc_fogAdd.x;
    float _FogRange = cc_fogAdd.y;
    vec3 camWorldProj = cc_cameraPos.xyz;
    camWorldProj.y = 0.;
    vec3 worldPosProj = wPos.xyz;
    worldPosProj.y = 0.;
    float fDeltaD = distance(worldPosProj, camWorldProj) / fogAtten * 2.0;
    float fDeltaY, fDensityIntegral;
    if (cc_cameraPos.y > _FogTop) {
        if (wPos.y < _FogTop) {
            fDeltaY = (_FogTop - wPos.y) / _FogRange * 2.0;
            fDensityIntegral = fDeltaY * fDeltaY * 0.5;
        } else {
            fDeltaY = 0.;
            fDensityIntegral = 0.;
        }
    } else {
        if (wPos.y < _FogTop) {
            float fDeltaA = (_FogTop - cc_cameraPos.y) / _FogRange * 2.;
            float fDeltaB = (_FogTop - wPos.y) / _FogRange * 2.;
            fDeltaY = abs(fDeltaA - fDeltaB);
            fDensityIntegral = abs((fDeltaA * fDeltaA * 0.5) - (fDeltaB * fDeltaB * 0.5));
        } else {
            fDeltaY = abs(_FogTop - cc_cameraPos.y) / _FogRange * 2.;
            fDensityIntegral = abs(fDeltaY * fDeltaY * 0.5);
        }
    }
    float fDensity;
    if (fDeltaY != 0.) {
        fDensity = (sqrt(1.0 + ((fDeltaD / fDeltaY) * (fDeltaD / fDeltaY)))) * fDensityIntegral;
    } else {
        fDensity = 0.;
    }
    float f = exp(-fDensity);
    return f;
}
float CC_TRANSFER_FOG(vec4 pos) {
    #if CC_USE_FOG == 0
        return LinearFog(pos);
\t#elif CC_USE_FOG == 1
        return ExpFog(pos);
    #elif CC_USE_FOG == 2
        return ExpSquaredFog(pos);
    #elif CC_USE_FOG == 3
        return LayeredFog(pos);
    #endif
    return 1.;
}
layout(location = 0) out highp vec4 v_shadowPos;
layout(set = 0, binding = 2) uniform CCShadow {
  highp mat4 cc_matLightPlaneProj;
  highp mat4 cc_matLightViewProj;
  lowp  vec4 cc_shadowColor;
  lowp  vec4 cc_shadowInfo;
};
#if USE_VERTEX_COLOR
  layout(location = 13) in vec4 a_color;
  layout(location = 1) out vec4 v_color;
#endif
layout(location = 2) out vec3 v_position;
layout(location = 3) out vec3 v_normal;
layout(location = 4) out vec2 v_uv;
layout(location = 5) out vec2 v_uv1;
layout(location = 6) out float v_fog_factor;
#if USE_NORMAL_MAP
  layout(location = 7) out vec3 v_tangent;
  layout(location = 8) out vec3 v_bitangent;
#endif
#if HAS_SECOND_UV || USE_LIGHTMAP
  layout(location = 14) in vec2 a_texCoord1;
#endif
#if USE_LIGHTMAP && !USE_BATCHING && !CC_FORWARD_ADD
  layout(location = 9) out vec2 v_luv;
void CCLightingMapCaclUV()
{
#if !USE_INSTANCING
      v_luv = cc_lightingMapUVParam.xy + a_texCoord1 * cc_lightingMapUVParam.zw;
#else
      v_luv = a_lightingMapUVParam.xy + a_texCoord1 * a_lightingMapUVParam.zw;
#endif
}
#endif
vec4 vert () {
  StandardVertInput In;
  In.position = vec4(a_position, 1.0);
  In.normal = a_normal;
  In.tangent = a_tangent;
  #if CC_USE_MORPH
    //applyMorph(In);
  #endif
  #if CC_USE_SKINNING
    CCSkin(In);
  #endif
  mat4 matWorld, matWorldIT;
  #if USE_INSTANCING
    matWorld = mat4(
      vec4(a_matWorld0.xyz, 0.0),
      vec4(a_matWorld1.xyz, 0.0),
      vec4(a_matWorld2.xyz, 0.0),
      vec4(a_matWorld0.w, a_matWorld1.w, a_matWorld2.w, 1.0)
    );
    matWorldIT = matWorld;
  #elif USE_BATCHING
    matWorld = cc_matWorlds[int(a_dyn_batch_id)];
    matWorldIT = matWorld;
  #else
    matWorld = cc_matWorld;
    matWorldIT = cc_matWorldIT;
  #endif
  vec4 pos = matWorld * In.position;
  v_position = pos.xyz;
  v_normal = normalize((matWorldIT * vec4(In.normal, 0.0)).xyz);
  #if USE_NORMAL_MAP
    v_tangent = normalize((matWorld * vec4(In.tangent.xyz, 0.0)).xyz);
    v_bitangent = cross(v_normal, v_tangent) * In.tangent.w;
  #endif
  v_uv = a_texCoord * tilingOffset.xy + tilingOffset.zw;
  #if HAS_SECOND_UV
    v_uv1 = a_texCoord1 * tilingOffset.xy + tilingOffset.zw;
  #endif
  #if USE_VERTEX_COLOR
    v_color = a_color;
  #endif
  v_fog_factor = CC_TRANSFER_FOG(pos);
  #if USE_LIGHTMAP && !USE_BATCHING && !CC_FORWARD_ADD
    CCLightingMapCaclUV();
  #endif
    v_shadowPos = cc_matLightViewProj * pos;
  return cc_matProj * (cc_matView * matWorld) * In.position;
}
void main() { gl_Position = vert(); }`;
        }
        const code = useWGSL ? sourceCode : glslang.compileGLSL(sourceCode, shaderTypeStr, true);
        const shader: GPUShaderModule = nativeDevice?.createShaderModule({ code });
        // shader.compilationInfo().then((compileInfo: GPUCompilationInfo) => {
        //     compileInfo.messages.forEach((info) => {
        //         console.log(info.lineNum, info.linePos, info.type, info.message);
        //     });
        // }).catch((compileInfo: GPUCompilationInfo) => {
        //     compileInfo.messages.forEach((info) => {
        //         console.log(info.lineNum, info.linePos, info.type, info.message);
        //     });
        // });
        const shaderStage: GPUProgrammableStageDescriptor = {
            module: shader,
            entryPoint: 'main',
        };
        gpuStage.glShader = shaderStage;
        // const complieInfo = shader.compilationInfo();
        // void complieInfo.then((info) => {
        //     console.info(info);
        // });
    }
}

export function WebGPUCmdFuncDestroyShader (device: WebGPUDevice, gpuShader: IWebGPUGPUShader) {
    if (gpuShader.glProgram) {
        device.gl.deleteProgram(gpuShader.glProgram);
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
        device.gl.deleteVertexArray(res.value);
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

export function WebGPUCmdFuncCopyTexImagesToTexture (
    device: WebGPUDevice,
    texImages: TexImageSource[],
    gpuTexture: IWebGPUGPUTexture,
    regions: BufferTextureCopy[],
) {
    // name all native webgpu resource nativeXXX distinguished from gpuTexture passed in.
    const nativeDevice = device.nativeDevice()!;

    // raw image buffer -> gpubuffer -> texture
    // all image share the same & largest buffer

    const pixelSize = FormatInfos[gpuTexture.format].size;
    // const nativeBuffer = nativeDevice.createBuffer({
    //     size: maxElementOfImageArray(regions) * pixelSize,
    //     usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
    //     mappedAtCreation: true,
    // });

    for (let i = 0; i < regions.length; i++) {
        if ('getContext' in texImages[i]) {
            const canvasElem = texImages[i] as HTMLCanvasElement;
            const imageData = canvasElem.getContext('2d')?.getImageData(0, 0, texImages[i].width, texImages[i].height);
            // new Uint8ClampedArray(nativeBuffer.getMappedRange(
            //     0,
            //     imageData!.data.byteLength,
            // )).set(imageData!.data);
            // nativeBuffer.unmap();

            const texDataLayout = {
                bytesPerRow: pixelSize * texImages[i].width,
            };
            const textureView: GPUTextureCopyView = {
                texture: gpuTexture.glTexture!,
            };
            nativeDevice.queue.writeTexture(textureView,
                imageData?.data.buffer as ArrayBuffer, texDataLayout,
                [regions[i].texExtent.width, regions[i].texExtent.height, regions[i].texExtent.depth]);
        } else if (texImages[i] instanceof HTMLImageElement) {
            const image = texImages[i] as HTMLImageElement;
            const canvas = document.createElement('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const context = canvas.getContext('2d');
            context?.drawImage(image, 0, 0);
            const imageData = context?.getImageData(0, 0, image.width, image.height);

            const texDataLayout = {
                bytesPerRow: pixelSize * texImages[i].width,
            };
            const textureView: GPUTextureCopyView = {
                texture: gpuTexture.glTexture!,
            };
            nativeDevice.queue.writeTexture(textureView,
                imageData?.data.buffer as ArrayBuffer, texDataLayout,
                [regions[i].texExtent.width, regions[i].texExtent.height, regions[i].texExtent.depth]);
        } else if (texImages[i] instanceof ImageBitmap) {
            const imageBmp = texImages[i] as ImageBitmap;
            const textureView: GPUTextureCopyView = {
                texture: gpuTexture.glTexture!,
                mipLevel: gpuTexture.mipLevel - 1,
                origin: [regions[i].texOffset.x, regions[i].texOffset.y, regions[i].texOffset.z],
            };
            nativeDevice.queue.copyImageBitmapToTexture(
                {
                    imageBitmap: imageBmp,
                },
                textureView,
                {
                    width: imageBmp.width,
                    height: imageBmp.height,
                    depthOrArrayLayers: 1,
                },
            );
        } else {
            throw new Error('Type not implemented.');
        }

        // const commandEncoder = nativeDevice.createCommandEncoder();
        // commandEncoder.copyBufferToTexture(
        //     { buffer: nativeBuffer, bytesPerRow: Math.floor((pixelSize + 255) / 256) * 256 },
        //     { texture: gpuTexture.glTexture! },
        //     [regions[i].texExtent.width, regions[i].texExtent.height, regions[i].texExtent.depth],
        // );

        // const cmdBuffer = commandEncoder.finish();
        // nativeDevice.queue.submit([cmdBuffer]);
        // 👇async way in initial stage may cause issues
        // createImageBitmap(texImages[i]).then( (img:ImageBitmap) => {
        //    nativeDevice.queue.copyImageBitmapToTexture(
        //        {imageBitmap: img},
        //        {texture: gpuTexture.glTexture!},
        //        [regions[i].texExtent.width, regions[i].texExtent.height, regions[i].texExtent.depth]);
        // } );
    }
}

export function WebGPUCmdFuncCopyBuffersToTexture (
    device: WebGPUDevice,
    buffers: ArrayBufferView[],
    gpuTexture: IWebGPUGPUTexture,
    regions: BufferTextureCopy[],
) {
    const nativeDevice = device.nativeDevice()!;

    for (let i = 0; i < regions.length; i++) {
        const texView = {} as GPUTextureCopyView;
        texView.texture = gpuTexture.glTexture!;
        const texDataLayout = {} as GPUTextureDataLayout;
        texDataLayout.bytesPerRow = FormatInfos[gpuTexture.format].size * regions[i].texExtent.width;
        nativeDevice.queue.writeTexture(texView, buffers[i],
            texDataLayout,
            {
                width: regions[i].texExtent.width,
                height: regions[i].texExtent.height,
                depthOrArrayLayers: regions[i].texExtent.depth,
            });
    }
}
