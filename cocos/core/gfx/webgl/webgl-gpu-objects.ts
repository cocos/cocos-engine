import { IGFXDrawInfo } from '../buffer';
import {
    GFXDescriptorType,
    GFXBufferUsage,
    GFXFormat,
    GFXMemoryUsage,
    GFXSampleCount,
    GFXShaderType,
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

export interface IWebGLGPUUniformInfo {
    name: string;
    type: GFXType;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
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
    indirects: IGFXDrawInfo[];
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
    glInternelFmt: GLenum;
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
    sourceSet: number;
    binding: number;
    name: string;
    size: number;
    glUniforms: IWebGLGPUUniform[];
    glActiveUniforms: IWebGLGPUUniform[];
}

export interface IWebGLGPUUniformSampler {
    sourceSet: number;
    binding: number;
    name: string;
    type: GFXType;
    units: number[];

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGLUniformBlock extends GFXUniformBlock {
    gpuBinding: number;
}

export interface IWebGLUniformSampler extends GFXUniformSampler {
    gpuBinding: number;
}

export interface IWebGLGPUShaderStage {
    type: GFXShaderType;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGLGPUShader {
    name: string;
    blocks: IWebGLUniformBlock[];
    samplers: IWebGLUniformSampler[];

    gpuStages: IWebGLGPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGLGPUInput[];
    glUniforms: IWebGLGPUUniform[];
    glBlocks: IWebGLGPUUniformBlock[];
    glSamplers: IWebGLGPUUniformSampler[];
}

export interface IWebGLGPUPipelineState {
    glPrimitive: GLenum;
    gpuShader: IWebGLGPUShader | null;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates: GFXDynamicStateFlagBit[];
    gpuRenderPass: IWebGLGPURenderPass | null;
}

export interface IWebGLGPUDescriptor {
    type: GFXDescriptorType;
    name: string;
    gpuBuffer: IWebGLGPUBuffer | null;
    gpuTexture: IWebGLGPUTexture | null;
    gpuSampler: IWebGLGPUSampler | null;
}

export interface IWebGLGPUDescriptorSet {
    // these two are just different groupings of the same set of descriptors
    gpuDescriptors: Record<number, IWebGLGPUDescriptor>; // for execute state binding commands
    gpuDescriptorArray: IWebGLGPUDescriptor[]; // for updating descriptors
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
