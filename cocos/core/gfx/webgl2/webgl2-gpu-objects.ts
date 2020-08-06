import { IGFXDrawInfo } from '../buffer';
import {
    GFXAddress,
    GFXDescriptorType,
    GFXBufferUsage,
    GFXFilter,
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
    buffer: ArrayBufferView | null;
    vf32: Float32Array | null;
    indirects: IGFXDrawInfo[];
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
    sourceSet: number;
    binding: number;
    idx: number;
    name: string;
    size: number;
    glUniforms: IWebGL2GPUUniform[];
    glActiveUniforms: IWebGL2GPUUniform[];

    isUniformPackage: boolean;
}

export interface IWebGL2GPUUniformSampler {
    sourceSet: number;
    binding: number;
    name: string;
    type: GFXType;
    units: number[];

    glType: GLenum;
    glLoc: WebGLUniformLocation;
}

export interface IWebGL2GPUShaderStage {
    type: GFXShaderType;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGL2UniformBlock extends GFXUniformBlock {
    gpuBinding: number;
}

export interface IWebGL2UniformSampler extends GFXUniformSampler {
    gpuBinding: number;
}

export interface IWebGL2GPUShader {
    name: string;
    blocks: IWebGL2UniformBlock[];
    samplers: IWebGL2UniformSampler[];

    gpuStages: IWebGL2GPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGL2GPUInput[];
    glUniforms: IWebGL2GPUUniform[];
    glBlocks: IWebGL2GPUUniformBlock[];
    glSamplers: IWebGL2GPUUniformSampler[];
}

export interface IWebGL2GPUPipelineState {
    glPrimitive: GLenum;
    gpuShader: IWebGL2GPUShader | null;
    rs: GFXRasterizerState;
    dss: GFXDepthStencilState;
    bs: GFXBlendState;
    dynamicStates: GFXDynamicStateFlagBit[];
    gpuRenderPass: IWebGL2GPURenderPass | null;
}

export interface IWebGL2GPUDescriptor {
    type: GFXDescriptorType;
    name: string;
    gpuBuffer: IWebGL2GPUBuffer | null;
    gpuTexture: IWebGL2GPUTexture | null;
    gpuSampler: IWebGL2GPUSampler | null;
}

export interface IWebGL2GPUDescriptorSet {
    // these two are just different groupings of the same set of descriptors
    gpuDescriptors: Record<number, IWebGL2GPUDescriptor>;
    gpuDescriptorArray: IWebGL2GPUDescriptor[];
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
