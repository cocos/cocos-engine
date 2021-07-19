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

import {
    Address, DescriptorType, BufferUsage, Filter, Format, MemoryUsage, SampleCount,
    ShaderStageFlagBit, TextureFlags, TextureType, TextureUsage, Type, DynamicStateFlagBit, DrawInfo, Attribute,
    ColorAttachment, DepthStencilAttachment, UniformBlock, UniformSamplerTexture, DescriptorSetLayoutBinding,
} from '../base/define';
import { BlendState, DepthStencilState, RasterizerState } from '../base/pipeline-state';

export interface IWebGL2GPUUniformInfo {
    name: string;
    type: Type;
    count: number;
    offset: number;
    view: Float32Array | Int32Array;
    isDirty: boolean;
}

export interface IWebGL2GPUBuffer {
    usage: BufferUsage;
    memUsage: MemoryUsage;
    size: number;
    stride: number;

    glTarget: GLenum;
    glBuffer: WebGLBuffer | null;
    glOffset: number;

    buffer: ArrayBufferView | null;
    indirects: DrawInfo[];
}

export interface IWebGL2GPUTexture {
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

    isSwapchainTexture: boolean;
}

export interface IWebGL2GPURenderPass {
    colorAttachments: ColorAttachment[];
    depthStencilAttachment: DepthStencilAttachment | null;
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
    minFilter: Filter;
    magFilter: Filter;
    mipFilter: Filter;
    addressU: Address;
    addressV: Address;
    addressW: Address;

    glMinFilter: GLenum;
    glMagFilter: GLenum;
    glWrapS: GLenum;
    glWrapT: GLenum;
    glWrapR: GLenum;
}

export interface IWebGL2GPUInput {
    name: string;
    type: Type;
    stride: number;
    count: number;
    size: number;

    glType: GLenum;
    glLoc: GLint;
}

export interface IWebGL2GPUUniform {
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

export interface IWebGL2GPUUniformBlock {
    set: number;
    binding: number;
    idx: number;
    name: string;
    size: number;
    glBinding: number;
}

export interface IWebGL2GPUUniformSamplerTexture {
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

export interface IWebGL2GPUShaderStage {
    type: ShaderStageFlagBit;
    source: string;
    glShader: WebGLShader | null;
}

export interface IWebGL2GPUShader {
    name: string;
    blocks: UniformBlock[];
    samplerTextures: UniformSamplerTexture[];

    gpuStages: IWebGL2GPUShaderStage[];
    glProgram: WebGLProgram | null;
    glInputs: IWebGL2GPUInput[];
    glUniforms: IWebGL2GPUUniform[];
    glBlocks: IWebGL2GPUUniformBlock[];
    glSamplerTextures: IWebGL2GPUUniformSamplerTexture[];
}

export interface IWebGL2GPUDescriptorSetLayout {
    bindings: DescriptorSetLayoutBinding[];
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
    rs: RasterizerState;
    dss: DepthStencilState;
    bs: BlendState;
    dynamicStates: DynamicStateFlagBit[];
    gpuRenderPass: IWebGL2GPURenderPass | null;
}

export interface IWebGL2GPUDescriptor {
    type: DescriptorType;
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
    attributes: Attribute[];
    gpuVertexBuffers: IWebGL2GPUBuffer[];
    gpuIndexBuffer: IWebGL2GPUBuffer | null;
    gpuIndirectBuffer: IWebGL2GPUBuffer | null;

    glAttribs: IWebGL2Attrib[];
    glIndexType: GLenum;
    glVAOs: Map<WebGLProgram, WebGLVertexArrayObject>;
}
