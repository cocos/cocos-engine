import { GFXDrawInfo } from '../buffer';
import {
    GFXDescriptorType,
    GFXBufferUsage,
    GFXFormat,
    GFXMemoryUsage,
    GFXSampleCount,
    GFXShaderStageFlagBit,
    GFXTextureFlags,
    GFXTextureType,
    GFXTextureUsage,
    GFXType,
    GFXDynamicStateFlagBit,
} from '../define';
import { IGFXAttribute } from '../input-assembler';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';
import { GFXColorAttachment, GFXDepthStencilAttachment } from '../render-pass';
import { GFXUniformBlock, GFXUniformSampler } from '../shader';
import { GFXDescriptorSetLayout, IGFXDescriptorSetLayoutBinding } from '../descriptor-set-layout';

export interface IWebGLGPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export interface IWebGLGPUBufferView {
    gpuBuffer: IWebGLGPUBuffer;
    offset: number;
    range: number;
}

export interface IWebGLGPUBuffer {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride: number;

    glTarget: GLenum;
    glBuffer: WebGLBuffer | null;

    buffer: ArrayBufferView | null;
    vf32: Float32Array | null;
    indirects: GFXDrawInfo[];
}

export interface IWebGLGPUTexture {
    type: GFXTextureType;
    format: GFXFormat;
    usage: GFXTextureUsage;
    width: number;
    height: number;
    depth: number;
    size: number;
    arrayLayer: number;
    mipLevel: number;
    samples: GFXSampleCount;
    flags: GFXTextureFlags;
    isPowerOf2: boolean;

    glTarget: GLenum;
    glInternalFmt: GLenum;
    glFormat: GLenum;
    glType: GLenum;
    glUsage: GLenum;
    glTexture: WebGLTexture | null;
    glRenderbuffer: WebGLRenderbuffer | null;
    glWrapS: GLenum;
    glWrapT: GLenum;
    glMinFilter: GLenum;
    glMagFilter: GLenum;
}

export interface IWebGLGPURenderPass {
    colorAttachments: GFXColorAttachment[];
    depthStencilAttachment: GFXDepthStencilAttachment | null;
}

export interface IWebGLGPUFramebuffer {
    gpuRenderPass: IWebGLGPURenderPass;
    gpuColorTextures: IWebGLGPUTexture[];
    gpuDepthStencilTexture: IWebGLGPUTexture | null;
    glFramebuffer: WebGLFramebuffer | null;
}

export interface IWebGLGPUSampler {
    glMinFilter: GLenum;
    glMagFilter: GLenum;
    glWrapS: GLenum;
    glWrapT: GLenum;
    glWrapR: GLenum;
}

export interface IWebGLGPUInput {
    binding: number;
    name: string;
    type: GFXType;
    stride: number;
    count: number;
    size: number;

    glType: GLenum;
    glLoc: GLint;
}

export interface IWebGLGPUUniform {
    binding: number;
    name: string;
    type: GFXType;
    stride: number;
    count: number;
    size: number;
    offset: number;

    glType: GLenum;
    glLoc: WebGLUniformLocation;
    array: number[];
    begin: number;
}

export interface IWebGLGPUUniformBlock {
    set: number;
    binding: number;
    name: string;
    size: number;
    glUniforms: IWebGLGPUUniform[];
    glActiveUniforms: IWebGLGPUUniform[];
}

export interface IWebGLGPUUniformSampler {
    set: number;
    binding: number;
    name: string;
    type: GFXType;
    count: number;
    units: number[];

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGLGPUShaderStage {
    type: GFXShaderStageFlagBit;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGLGPUShader {
    name: string;
    blocks: GFXUniformBlock[];
    samplers: GFXUniformSampler[];

    gpuStages: IWebGLGPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGLGPUInput[];
    glUniforms: IWebGLGPUUniform[];
    glBlocks: IWebGLGPUUniformBlock[];
    glSamplers: IWebGLGPUUniformSampler[];
}

export interface IWebGLGPUDescriptorSetLayout {
    bindings: IGFXDescriptorSetLayoutBinding[];
    dynamicBindings: number[];
    descriptorIndices: number[];
    descriptorCount: number;
}

export interface IWebGLGPUPipelineLayout {
    gpuSetLayouts: IWebGLGPUDescriptorSetLayout[];
    dynamicOffsetCount: number;
    dynamicOffsetOffsets: number[];
    dynamicOffsetIndices: number[][];
}

export interface IWebGLGPUPipelineState {
    glPrimitive: GLenum;
    gpuShader: IWebGLGPUShader | null;
    gpuPipelineLayout: IWebGLGPUPipelineLayout | null;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates: GFXDynamicStateFlagBit[];
    gpuRenderPass: IWebGLGPURenderPass | null;
}

export interface IWebGLGPUDescriptor {
    type: GFXDescriptorType;
    gpuBuffer: IWebGLGPUBuffer | IWebGLGPUBufferView | null;
    gpuTexture: IWebGLGPUTexture | null;
    gpuSampler: IWebGLGPUSampler | null;
}

export interface IWebGLGPUDescriptorSet {
    gpuDescriptors: IWebGLGPUDescriptor[];
    descriptorIndices: number[];
}

export interface IWebGLAttrib {
    name: string;
    glBuffer: WebGLBuffer | null;
    glType: GLenum;
    size: number;
    count: number;
    stride: number;
    componentCount: number;
    isNormalized: boolean;
    isInstanced: boolean;
    offset: number;
}

export interface IWebGLGPUInputAssembler {
    attributes: IGFXAttribute[];
    gpuVertexBuffers: IWebGLGPUBuffer[];
    gpuIndexBuffer: IWebGLGPUBuffer | null;
    gpuIndirectBuffer: IWebGLGPUBuffer | null;

    glAttribs: IWebGLAttrib[];
    glIndexType: GLenum;
    glVAOs: Map<WebGLProgram, WebGLVertexArrayObjectOES>;
}
