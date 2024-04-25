import {
    Address,
    DescriptorType,
    BufferUsage,
    Filter,
    Format,
    MemoryUsage,
    SampleCount,
    ShaderStageFlagBit,
    TextureFlags,
    TextureType,
    TextureUsage,
    Type,
    DynamicStateFlagBit,
    DrawInfo,
    Attribute,
    ColorAttachment,
    DepthStencilAttachment,
    UniformBlock,
    UniformSampler,
    DescriptorSetLayoutBinding,
    BufferFlags,
} from '../base/define';
import { BlendState, DepthStencilState, RasterizerState } from '../base/pipeline-state';
import { WebGPUDeviceManager } from './define';
import { WebGPUFramebuffer } from './webgpu-framebuffer';

export interface IWebGPUGPUUniformInfo {
    name: string;
    type: Type;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export interface IWebGPUGPUBuffer {
    usage: BufferUsage;
    memUsage: MemoryUsage;
    size: number;
    stride: number;

    glTarget: GLenum;
    glBuffer: GPUBuffer | null;
    glOffset: number;
    flags: BufferFlags | null;
    buffer: ArrayBufferView | null;
    indirects: DrawInfo[];
    drawIndirectByIndex: boolean;
}

export interface IWebGPUTexture {
    type: TextureType;
    format: Format;
    usage: TextureUsage;
    width: number;
    height: number;
    depth: number;
    size: number;
    arrayLayer: number;
    mipLevel: number;
    samples: SampleCount;
    flags: TextureFlags;
    isPowerOf2: boolean;

    glTarget: GPUTextureViewDimension;  // 1d, 2d, 3d
    glInternalFmt: GPUTextureFormat;// rgba8unorm
    glFormat: GPUTextureFormat;
    glType: GLenum;                 // data type, gl.UNSIGNED_BYTE
    glUsage: GPUTextureUsageFlags;  // webgl:DYNIMIC_DRAW... -> webGPU:COPY_DST/STORAGE...
    glTexture: GPUTexture | undefined;   // native tex handler
    glRenderbuffer: null;           // not suitable for webgpu
    glWrapS: GPUAddressMode;        // clamp-to-edge, repeat...
    glWrapT: GPUAddressMode;
    glMinFilter: GPUFilterMode;     // linear, nearest
    glMagFilter: GPUFilterMode;

    isSwapchainTexture: boolean;
}

export interface IWebGPUGPURenderPass {
    colorAttachments: ColorAttachment[];
    depthStencilAttachment: DepthStencilAttachment | null;
    nativeRenderPass: GPURenderPassDescriptor | null;
}

export interface IWebGPUGPUFramebuffer {
    gpuRenderPass: IWebGPUGPURenderPass;
    gpuColorTextures: IWebGPUTexture[];
    gpuDepthStencilTexture: IWebGPUTexture | null;
    isOffscreen?: boolean;
    glFramebuffer: WebGPUFramebuffer | null;
    width: number;
    height: number;
}

export interface IWebGPUGPUSampler {
    glSampler: GPUSampler | null;
    minFilter: Filter;
    magFilter: Filter;
    mipFilter: Filter;
    addressU: Address;
    addressV: Address;
    addressW: Address;

    glMinFilter: GPUFilterMode;
    glMagFilter: GPUFilterMode;
    glMipFilter: GPUFilterMode;
    glWrapS: GPUAddressMode;
    glWrapT: GPUAddressMode;
    glWrapR: GPUAddressMode;
}

export interface IWebGPUGPUInput {
    name: string;
    type: Type;
    stride: number;
    count: number;
    size: number;

    glType: GLenum;
    glLoc: GLint;
}

export interface IWebGPUGPUUniform {
    binding: number;
    name: string;
    type: Type;
    stride: number;
    count: number;
    size: number;
    offset: number;

    glType: GLenum;
    glLoc: WebGLUniformLocation;
    array: number[];
    begin: number;
}

export interface IWebGPUGPUUniformBlock {
    set: number;
    binding: number;
    idx: number;
    name: string;
    size: number;
    glBinding: number;
}

export interface IWebGPUGPUUniformSampler {
    set: number;
    binding: number;
    name: string;
    type: Type;
    count: number;
    units: number[];
    glUnits: Int32Array;

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGPUGPUShaderStage {
    type: ShaderStageFlagBit;
    source: string;
    glShader: GPUProgrammableStage | null;
    bindings: number[][];
}

export interface IWebGPUGPUShader {
    name: string;
    blocks: UniformBlock[];
    samplers: UniformSampler[];

    gpuStages: IWebGPUGPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGPUGPUInput[];
    glUniforms: IWebGPUGPUUniform[];
    glBlocks: IWebGPUGPUUniformBlock[];
    glSamplers: IWebGPUGPUUniformSampler[];
    bindings: Map<number, number[]>;
}

export interface IWebGPUGPUDescriptorSetLayout {
    bindings: DescriptorSetLayoutBinding[];
    dynamicBindings: number[];
    descriptorIndices: number[];
    descriptorCount: number;
    bindGroupLayout: GPUBindGroupLayout | null;
}

export interface IWebGPUGPUPipelineLayout {
    gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[];
    gpuBindGroupLayouts: GPUBindGroupLayout[];
    dynamicOffsetCount: number;
    dynamicOffsetIndices: number[][];
    nativePipelineLayout: GPUPipelineLayout;
}

export interface IWebGPUGPUPipelineState {
    glPrimitive: GPUPrimitiveTopology;
    gpuShader: IWebGPUGPUShader | null;
    gpuPipelineLayout: IWebGPUGPUPipelineLayout | null;
    rs: RasterizerState;
    dss: DepthStencilState;
    bs: BlendState;
    dynamicStates: DynamicStateFlagBit[];
    gpuRenderPass: IWebGPUGPURenderPass | null;
    pipelineState: GPURenderPipelineDescriptor | undefined;
    nativePipeline: GPUPipelineBase | undefined;
}

export interface IWebGPUGPUDescriptor {
    type: DescriptorType;
    gpuBuffer: IWebGPUGPUBuffer | null;
    gpuTexture: IWebGPUTexture | null;
    gpuSampler: IWebGPUGPUSampler | null;
}

export interface IWebGPUGPUDescriptorSet {
    gpuDescriptors: IWebGPUGPUDescriptor[];
    descriptorIndices: number[];
    bindGroup: GPUBindGroup;
    bindGroupLayout: GPUBindGroupLayout;
}

export interface IWebGPUAttrib {
    name: string;
    glBuffer: GPUBuffer | null;
    glType: GLenum;
    size: number;
    count: number;
    stride: number;
    componentCount: number;
    isNormalized: boolean;
    isInstanced: boolean;
    offset: number;
}

export interface IWebGPUGPUInputAssembler {
    attributes: Attribute[];
    gpuVertexBuffers: IWebGPUGPUBuffer[];
    gpuIndexBuffer: IWebGPUGPUBuffer | null;
    gpuIndirectBuffer: IWebGPUGPUBuffer | null;

    glAttribs: IWebGPUAttrib[];
    glIndexType: GPUIndexFormat;
}

export interface IWebGPUBindingMapping {
    blockOffsets: number[];
    samplerTextureOffsets: number[];
    flexibleSet: number;
}

export class IWebGPUBlitManager {
    private _srcFramebuffer: WebGPUFramebuffer | null = null;
    private _dstFramebuffer: WebGPUFramebuffer | null = null;

    get srcFramebuffer (): WebGPUFramebuffer | null {
        return this._srcFramebuffer;
    }

    get dstFramebuffer (): WebGPUFramebuffer | null {
        return this._dstFramebuffer;
    }

    constructor () {
        const device = WebGPUDeviceManager.instance;
        // this._srcFramebuffer = gl.createFramebuffer();
        // this._dstFramebuffer = gl.createFramebuffer();
    }

    destroy (): void {
        // const { gl } = WebGPUDeviceManager.instance;
        // gl.deleteFramebuffer(this._srcFramebuffer);
        // gl.deleteFramebuffer(this._dstFramebuffer);
    }
}
