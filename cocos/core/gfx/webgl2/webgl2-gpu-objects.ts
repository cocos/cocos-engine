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
import { IGFXAttribute } from '../input-assembler';
import { GFXBlendState, GFXDepthStencilState, GFXRasterizerState } from '../pipeline-state';
import { GFXColorAttachment, GFXDepthStencilAttachment } from '../render-pass';
import { GFXUniformBlock, GFXUniformSampler } from '../shader';
import { GFXDescriptorSetLayout, IGFXDescriptorSetLayoutBinding } from '../descriptor-set-layout';

export interface IWebGL2GPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export interface IWebGL2GPUBuffer {
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

export interface IWebGL2GPUTexture {
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

export interface IWebGL2GPURenderPass {
    colorAttachments: GFXColorAttachment[];
    depthStencilAttachment: GFXDepthStencilAttachment | null;
}

export interface IWebGL2GPUFramebuffer {
    gpuRenderPass: IWebGL2GPURenderPass;
    gpuColorTextures: IWebGL2GPUTexture[];
    gpuDepthStencilTexture: IWebGL2GPUTexture | null;
    isOffscreen?: boolean;

    glFramebuffer: WebGLFramebuffer | null;
}

export interface IWebGL2GPUSampler {
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

export interface IWebGL2GPUInput {
    name: string;
    type: GFXType;
    stride: number;
    count: number;
    size: number;

    glType: GLenum;
    glLoc: GLint;
}

export interface IWebGL2GPUUniform {
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

export interface IWebGL2GPUUniformBlock {
    set: number;
    binding: number;
    idx: number;
    name: string;
    size: number;
    glBinding: number;
}

export interface IWebGL2GPUUniformSampler {
    set: number;
    binding: number;
    name: string;
    type: GFXType;
    count: number;
    units: number[];

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGL2GPUShaderStage {
    type: GFXShaderStageFlagBit;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGL2GPUShader {
    name: string;
    blocks: GFXUniformBlock[];
    samplers: GFXUniformSampler[];

    gpuStages: IWebGL2GPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGL2GPUInput[];
    glUniforms: IWebGL2GPUUniform[];
    glBlocks: IWebGL2GPUUniformBlock[];
    glSamplers: IWebGL2GPUUniformSampler[];
}

export interface IWebGL2GPUDescriptorSetLayout {
    bindings: IGFXDescriptorSetLayoutBinding[];
    dynamicBindings: number[];
    descriptorIndices: number[];
    descriptorCount: number;
}

export interface IWebGL2GPUPipelineLayout {
    gpuSetLayouts: IWebGL2GPUDescriptorSetLayout[];
    dynamicOffsetCount: number;
    dynamicOffsetOffsets: number[];
    dynamicOffsetIndices: number[][];
}

export interface IWebGL2GPUPipelineState {
    glPrimitive: GLenum;
    gpuShader: IWebGL2GPUShader | null;
    gpuPipelineLayout: IWebGL2GPUPipelineLayout | null;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates: GFXDynamicStateFlagBit[];
    gpuRenderPass: IWebGL2GPURenderPass | null;
}

export interface IWebGL2GPUDescriptor {
    type: GFXDescriptorType;
    gpuBuffer: IWebGL2GPUBuffer | null;
    gpuTexture: IWebGL2GPUTexture | null;
    gpuSampler: IWebGL2GPUSampler | null;
}

export interface IWebGL2GPUDescriptorSet {
    gpuDescriptors: IWebGL2GPUDescriptor[];
    descriptorIndices: number[];
}

export interface IWebGL2Attrib {
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

export interface IWebGL2GPUInputAssembler {
    attributes: IGFXAttribute[];
    gpuVertexBuffers: IWebGL2GPUBuffer[];
    gpuIndexBuffer: IWebGL2GPUBuffer | null;
    gpuIndirectBuffer: IWebGL2GPUBuffer | null;

    glAttribs: IWebGL2Attrib[];
    glIndexType: GLenum;
    glVAOs: Map<WebGLProgram, WebGLVertexArrayObject>;
}
