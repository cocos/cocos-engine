import { GFXDrawInfo } from '../buffer';
import {
    GFXAddress,
    GFXDescriptorType,
    GFXBufferUsage,
    GFXFilter,
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
import { GFXAttribute } from '../input-assembler';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';
import { GFXColorAttachment, GFXDepthStencilAttachment } from '../render-pass';
import { GFXUniformBlock, GFXUniformSampler } from '../shader';
import { GFXDescriptorSetLayout, GFXDescriptorSetLayoutBinding } from '../descriptor-set-layout';

export interface IWebGPUGPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export interface IWebGPUGPUBuffer {
    usage: GFXBufferUsage;
    memUsage: GFXMemoryUsage;
    size: number;
    stride: number;

    glTarget: GLenum;
    glBuffer: WebGLBuffer | null;
    glOffset: number;

    buffer: ArrayBufferView | null;
    indirects: GFXDrawInfo[];
}

export interface IWebGPUGPUTexture {
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

export interface IWebGPUGPURenderPass {
    colorAttachments: GFXColorAttachment[];
    depthStencilAttachment: GFXDepthStencilAttachment | null;
}

export interface IWebGPUGPUFramebuffer {
    gpuRenderPass: IWebGPUGPURenderPass;
    gpuColorTextures: IWebGPUGPUTexture[];
    gpuDepthStencilTexture: IWebGPUGPUTexture | null;
    isOffscreen?: boolean;

    glFramebuffer: WebGLFramebuffer | null;
}

export interface IWebGPUGPUSampler {
    glSampler: WebGLSampler | null;
    minFilter: GFXFilter;
    magFilter: GFXFilter;
    mipFilter: GFXFilter;
    addressU: GFXAddress;
    addressV: GFXAddress;
    addressW: GFXAddress;
    minLOD: number;
    maxLOD: number;

    glMinFilter: GLenum;
    glMagFilter: GLenum;
    glWrapS: GLenum;
    glWrapT: GLenum;
    glWrapR: GLenum;
}

export interface IWebGPUGPUInput {
    name: string;
    type: GFXType;
    stride: number;
    count: number;
    size: number;

    glType: GLenum;
    glLoc: GLint;
}

export interface IWebGPUGPUUniform {
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
    type: GFXType;
    count: number;
    units: number[];
    glUnits: Int32Array;

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGPUGPUShaderStage {
    type: GFXShaderStageFlagBit;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGPUGPUShader {
    name: string;
    blocks: GFXUniformBlock[];
    samplers: GFXUniformSampler[];

    gpuStages: IWebGPUGPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGPUGPUInput[];
    glUniforms: IWebGPUGPUUniform[];
    glBlocks: IWebGPUGPUUniformBlock[];
    glSamplers: IWebGPUGPUUniformSampler[];
}

export interface IWebGPUGPUDescriptorSetLayout {
    bindings: GFXDescriptorSetLayoutBinding[];
    dynamicBindings: number[];
    descriptorIndices: number[];
    descriptorCount: number;
}

export interface IWebGPUGPUPipelineLayout {
    gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[];
    dynamicOffsetCount: number;
    dynamicOffsetIndices: number[][];
}

export interface IWebGPUGPUPipelineState {
    glPrimitive: GLenum;
    gpuShader: IWebGPUGPUShader | null;
    gpuPipelineLayout: IWebGPUGPUPipelineLayout | null;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates: GFXDynamicStateFlagBit[];
    gpuRenderPass: IWebGPUGPURenderPass | null;
}

export interface IWebGPUGPUDescriptor {
    type: GFXDescriptorType;
    gpuBuffer: IWebGPUGPUBuffer | null;
    gpuTexture: IWebGPUGPUTexture | null;
    gpuSampler: IWebGPUGPUSampler | null;
}

export interface IWebGPUGPUDescriptorSet {
    gpuDescriptors: IWebGPUGPUDescriptor[];
    descriptorIndices: number[];
}

export interface IWebGPUAttrib {
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

export interface IWebGPUGPUInputAssembler {
    attributes: GFXAttribute[];
    gpuVertexBuffers: IWebGPUGPUBuffer[];
    gpuIndexBuffer: IWebGPUGPUBuffer | null;
    gpuIndirectBuffer: IWebGPUGPUBuffer | null;

    glAttribs: IWebGPUAttrib[];
    glIndexType: GLenum;
    glVAOs: Map<WebGLProgram, WebGLVertexArrayObject>;
}
