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

import { nextPow2 } from '../../math/bits';
import {
    Address, DescriptorType, BufferUsage, Filter, Format, MemoryUsage, SampleCount, UniformInputAttachment,
    ShaderStageFlagBit, TextureFlags, TextureType, TextureUsage, Type, DynamicStateFlagBit, DrawInfo, Attribute,
    ColorAttachment, DepthStencilAttachment, UniformBlock, UniformSamplerTexture, DescriptorSetLayoutBinding,
    TextureBlit, Uniform, ShaderStage, BufferUsageBit, MemoryUsageBit,
} from '../base/define';
import { BlendState, DepthStencilState, RasterizerState } from '../base/pipeline-state';
import { WebGL2Device } from './webgl2-device';
import { WebGLStateCache } from '../webgl/webgl-state-cache';
import { WebGL2Sampler } from './states/webgl2-sampler';
import { WebGL2CmdFuncBindStates, WebGL2CmdFuncCreateBuffer, WebGL2CmdFuncCreateInputAssember, WebGL2CmdFuncCreateShader,
    WebGL2CmdFuncDestroyBuffer, WebGL2CmdFuncDestroyInputAssembler, WebGL2CmdFuncDestroySampler, WebGL2CmdFuncDestroyShader,
    WebGL2CmdFuncDraw, WebGL2CmdFuncPrepareSamplerInfo, WebGL2CmdFuncUpdateBuffer } from './webgl2-commands';
import { WebGL2DeviceManager } from './webgl2-define';

export class WebGL2IndirectDrawInfos {
    public counts: Int32Array;
    public offsets: Int32Array;
    public instances: Int32Array;
    public drawCount = 0;
    public drawByIndex = false;
    public instancedDraw = false;

    // staging buffer
    public byteOffsets: Int32Array;

    private _capacity = 4;

    constructor () {
        this.counts = new Int32Array(this._capacity);
        this.offsets = new Int32Array(this._capacity);
        this.instances  = new Int32Array(this._capacity);
        this.byteOffsets = new Int32Array(this._capacity);
    }

    public clearDraws () {
        this.drawCount = 0;
        this.drawByIndex = false;
        this.instancedDraw = false;
    }

    public setDrawInfo (idx: number, info: Readonly<DrawInfo>) {
        this._ensureCapacity(idx);
        this.drawByIndex = info.indexCount > 0;
        this.instancedDraw = !!info.instanceCount;
        this.drawCount = Math.max(idx + 1, this.drawCount);

        if (this.drawByIndex) {
            this.counts[idx] = info.indexCount;
            this.offsets[idx] = info.firstIndex;
        } else {
            this.counts[idx] = info.vertexCount;
            this.offsets[idx] = info.firstVertex;
        }
        this.instances[idx] = Math.max(1, info.instanceCount);
    }

    private _ensureCapacity (target: number) {
        if (this._capacity > target) return;
        this._capacity = nextPow2(target);

        const counts = new Int32Array(this._capacity);
        const offsets = new Int32Array(this._capacity);
        const instances = new Int32Array(this._capacity);
        this.byteOffsets = new Int32Array(this._capacity);

        counts.set(this.counts);
        offsets.set(this.offsets);
        instances.set(this.instances);

        this.counts = counts;
        this.offsets = offsets;
        this.instances = instances;
    }
}

export interface IWebGL2BindingMapping {
    blockOffsets: number[];
    samplerTextureOffsets: number[];
    flexibleSet: number;
}

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
    indirects: WebGL2IndirectDrawInfos;
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
    isMemoryLess : boolean;
}

export interface IWebGL2GPUTextureView {
    gpuTexture: IWebGL2GPUTexture;
    type: TextureType;
    format: Format;
    baseLevel: number;
    levelCount: number;
}

export interface IWebGL2GPURenderPass {
    colorAttachments: ColorAttachment[];
    depthStencilAttachment: DepthStencilAttachment | null;
}

export interface IWebGL2GPUFramebuffer {
    gpuRenderPass: IWebGL2GPURenderPass;
    gpuColorViews: IWebGL2GPUTextureView[];
    gpuDepthStencilView: IWebGL2GPUTextureView | null;
    glFramebuffer: WebGLFramebuffer | null;
    isOffscreen: boolean;
    width: number;
    height: number;
}

export interface IWebGL2GPUSampler {
    glSamplers: Map<number, WebGLSampler>;

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

    getGLSampler (device: WebGL2Device, minLod: number, maxLod: number) : WebGLSampler;
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
    subpassInputs: UniformInputAttachment[];

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
    gpuTextureView: IWebGL2GPUTextureView | null;
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

export class IWebGL2BlitManager {
    private _gpuShader : IWebGL2GPUShader | null = null;
    private _gpuDescriptorSetLayout : IWebGL2GPUDescriptorSetLayout | null = null;
    private _gpuPipelineLayout : IWebGL2GPUPipelineLayout | null = null;
    private _gpuPipelineState : IWebGL2GPUPipelineState | null = null;

    private _gpuVertexBuffer : IWebGL2GPUBuffer | null = null;
    private _gpuInputAssembler : IWebGL2GPUInputAssembler | null = null;
    private _gpuPointSampler : IWebGL2GPUSampler | null = null;
    private _gpuLinearSampler : IWebGL2GPUSampler | null = null;
    private _gpuDescriptorSet : IWebGL2GPUDescriptorSet | null = null;
    private _gpuUniformBuffer : IWebGL2GPUBuffer | null = null;
    private _drawInfo : DrawInfo | null = null;

    private _uniformBuffer : Float32Array | null = null;

    constructor () {
    }

    public initialize () {
        const device = WebGL2DeviceManager.instance;
        const { gl } = WebGL2DeviceManager.instance;
        const samplerOffset = device.bindingMappingInfo.maxBlockCounts[0];

        this._gpuShader = {
            name: 'Blit Pass',
            blocks: [
                new UniformBlock(0, 0, `BlitParams`,
                    [
                        new Uniform(`tilingOffsetSrc`, Type.FLOAT4, 1),
                        new Uniform(`tilingOffsetDst`, Type.FLOAT4, 1),
                    ],
                    1),
            ],
            samplerTextures: [new UniformSamplerTexture(0, samplerOffset, 'textureSrc', Type.SAMPLER2D, 1)],
            subpassInputs: [],
            gpuStages: [
                {
                    type: ShaderStageFlagBit.VERTEX,
                    source: `
                    precision mediump float;

                    in vec2 a_position;
                    in vec2 a_texCoord;
            
                    layout(std140) uniform BlitParams {
                        vec4 tilingOffsetSrc;
                        vec4 tilingOffsetDst;
                    };
            
                    out vec2 v_texCoord;
            
                    void main() {
                        v_texCoord = a_texCoord * tilingOffsetSrc.xy + tilingOffsetSrc.zw;
                        gl_Position = vec4((a_position + 1.0) * tilingOffsetDst.xy - 1.0 + tilingOffsetDst.zw * 2.0, 0, 1);
                    }`,
                    glShader: null },
                {
                    type: ShaderStageFlagBit.FRAGMENT,
                    source: `
                    precision mediump float;
                    uniform sampler2D textureSrc;

                    in vec2 v_texCoord;

                    layout(location = 0) out vec4 fragColor;
                    
                    void main() {
                        fragColor = texture(textureSrc, v_texCoord);
                    }`,
                    glShader: null },

            ],
            glProgram: null,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplerTextures: [],
        };
        WebGL2CmdFuncCreateShader(WebGL2DeviceManager.instance, this._gpuShader);

        this._gpuDescriptorSetLayout = {
            bindings: [
                new DescriptorSetLayoutBinding(0, DescriptorType.UNIFORM_BUFFER, 1, ShaderStageFlagBit.VERTEX),
                new DescriptorSetLayoutBinding(samplerOffset,
                    DescriptorType.SAMPLER_TEXTURE, 1, ShaderStageFlagBit.FRAGMENT),
            ],
            dynamicBindings: [],
            descriptorIndices: [],
            descriptorCount: 1 + samplerOffset,
        };
        for (let i = 0; i < samplerOffset; i++) {
            this._gpuDescriptorSetLayout.descriptorIndices[i] = 0;
        }
        this._gpuDescriptorSetLayout.descriptorIndices.push(1);

        this._gpuPipelineLayout = {
            gpuSetLayouts: [this._gpuDescriptorSetLayout],
            dynamicOffsetCount: 0,
            dynamicOffsetOffsets: [0],
            dynamicOffsetIndices: [[]],
        };

        this._gpuPipelineState = {
            glPrimitive: gl.TRIANGLE_STRIP,
            gpuShader: this._gpuShader,
            gpuPipelineLayout: this._gpuPipelineLayout,
            rs: null!,
            dss: new DepthStencilState(false, false),
            bs: null!,
            dynamicStates: [],
            gpuRenderPass: null,
        };

        this._gpuVertexBuffer = {
            usage: BufferUsageBit.VERTEX,
            memUsage: MemoryUsageBit.DEVICE,
            size: 16 * Float32Array.BYTES_PER_ELEMENT,
            stride: 4 * Float32Array.BYTES_PER_ELEMENT,
            buffer: null,
            indirects: null!,
            glTarget: 0,
            glBuffer: null,
            glOffset: 0,
        };
        WebGL2CmdFuncCreateBuffer(WebGL2DeviceManager.instance, this._gpuVertexBuffer);
        const data  = new Float32Array(
            [-1.0, -1.0, 0.0, 0.0,
                1.0, -1.0, 1.0, 0.0,
                -1.0, 1.0, 0.0, 1.0,
                1.0, 1.0, 1.0, 1.0],
        );
        WebGL2CmdFuncUpdateBuffer(WebGL2DeviceManager.instance, this._gpuVertexBuffer, data, 0, data.length);

        this._gpuInputAssembler = {
            attributes: [new Attribute(`a_position`, Format.RG32F), new Attribute(`a_texCoord`, Format.RG32F)],
            gpuVertexBuffers: [this._gpuVertexBuffer],
            gpuIndexBuffer: null,
            gpuIndirectBuffer: null,

            glAttribs: [],
            glIndexType: 0,
            glVAOs: new Map<WebGLProgram, WebGLVertexArrayObject>(),
        };
        WebGL2CmdFuncCreateInputAssember(WebGL2DeviceManager.instance, this._gpuInputAssembler);

        this._gpuPointSampler = {
            glSamplers: new Map<number, WebGL2Sampler>(),
            minFilter: Filter.POINT,
            magFilter: Filter.POINT,
            mipFilter: Filter.NONE,
            addressU: Address.CLAMP,
            addressV: Address.CLAMP,
            addressW: Address.CLAMP,

            glMinFilter: 0,
            glMagFilter: 0,
            glWrapS: 0,
            glWrapT: 0,
            glWrapR: 0,

            getGLSampler (device: WebGL2Device, minLod: number, maxLod: number) : WebGLSampler {
                const { gl } = device;
                const samplerHash = minLod << 16 | maxLod;
                if (!this.glSamplers.has(samplerHash)) {
                    const glSampler = gl.createSampler();
                    if (glSampler) {
                        this.glSamplers.set(samplerHash, glSampler);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, this.glWrapS);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, this.glWrapT);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, this.glWrapR);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MIN_LOD, minLod);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MAX_LOD, maxLod);
                    }
                }
                const sampler = this.glSamplers.get(samplerHash)!;
                return sampler;
            },
        };

        WebGL2CmdFuncPrepareSamplerInfo(WebGL2DeviceManager.instance, this._gpuPointSampler);

        this._gpuLinearSampler = {
            glSamplers: new Map<number, WebGL2Sampler>(),
            minFilter: Filter.LINEAR,
            magFilter: Filter.LINEAR,
            mipFilter: Filter.NONE,
            addressU: Address.CLAMP,
            addressV: Address.CLAMP,
            addressW: Address.CLAMP,

            glMinFilter: 0,
            glMagFilter: 0,
            glWrapS: 0,
            glWrapT: 0,
            glWrapR: 0,

            getGLSampler (device: WebGL2Device, minLod: number, maxLod: number) : WebGLSampler {
                const { gl } = device;
                const samplerHash = minLod << 16 | maxLod;
                if (!this.glSamplers.has(samplerHash)) {
                    const glSampler = gl.createSampler();
                    if (glSampler) {
                        this.glSamplers.set(samplerHash, glSampler);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MIN_FILTER, this.glMinFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_MAG_FILTER, this.glMagFilter);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_S, this.glWrapS);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_T, this.glWrapT);
                        gl.samplerParameteri(glSampler, gl.TEXTURE_WRAP_R, this.glWrapR);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MIN_LOD, minLod);
                        gl.samplerParameterf(glSampler, gl.TEXTURE_MAX_LOD, maxLod);
                    }
                }
                const sampler = this.glSamplers.get(samplerHash)!;
                return sampler;
            },
        };
        WebGL2CmdFuncPrepareSamplerInfo(WebGL2DeviceManager.instance, this._gpuLinearSampler);

        this._gpuUniformBuffer = {
            usage: BufferUsageBit.UNIFORM,
            memUsage: MemoryUsageBit.DEVICE,
            size: 8 * Float32Array.BYTES_PER_ELEMENT,
            stride: 8 * Float32Array.BYTES_PER_ELEMENT,
            buffer: null,
            indirects: null!,
            glTarget: 0,
            glBuffer: null,
            glOffset: 0,
        };
        WebGL2CmdFuncCreateBuffer(WebGL2DeviceManager.instance, this._gpuUniformBuffer);

        this._gpuDescriptorSet = {
            gpuDescriptors: [
                { type: DescriptorType.UNIFORM_BUFFER, gpuBuffer: this._gpuUniformBuffer, gpuTextureView: null, gpuSampler: null },
                { type: DescriptorType.SAMPLER_TEXTURE, gpuBuffer: null, gpuTextureView: null, gpuSampler: null }],
            descriptorIndices: this._gpuDescriptorSetLayout.descriptorIndices,
        };

        this._drawInfo = new DrawInfo(4, 0, 0, 0, 0, 0, 0);

        this._uniformBuffer = new Float32Array(8);
    }

    public destroy () {
        if (this._gpuVertexBuffer) {
            WebGL2CmdFuncDestroyBuffer(WebGL2DeviceManager.instance, this._gpuVertexBuffer);
        }
        if (this._gpuUniformBuffer) {
            WebGL2CmdFuncDestroyBuffer(WebGL2DeviceManager.instance, this._gpuUniformBuffer);
        }
        if (this._gpuShader) {
            WebGL2CmdFuncDestroyShader(WebGL2DeviceManager.instance, this._gpuShader);
        }
        if (this._gpuInputAssembler) {
            WebGL2CmdFuncDestroyInputAssembler(WebGL2DeviceManager.instance, this._gpuInputAssembler);
        }
        if (this._gpuPointSampler) {
            WebGL2CmdFuncDestroySampler(WebGL2DeviceManager.instance, this._gpuPointSampler);
            this._gpuPointSampler = null;
        }
        if (this._gpuLinearSampler) {
            WebGL2CmdFuncDestroySampler(WebGL2DeviceManager.instance, this._gpuLinearSampler);
            this._gpuLinearSampler = null;
        }
    }

    public draw (gpuTextureViewSrc : IWebGL2GPUTextureView, gpuTextureViewDst : IWebGL2GPUTextureView, regions : TextureBlit[], filter : Filter) {
        const gpuDescriptor = this._gpuDescriptorSet;
        const device = WebGL2DeviceManager.instance;

        if (!this._uniformBuffer || !this._gpuUniformBuffer || !this._gpuPipelineState
            || !this._gpuInputAssembler || !this._gpuDescriptorSet || !this._drawInfo) {
            return;
        }

        const descriptor = this._gpuDescriptorSet.gpuDescriptors[1];

        descriptor.gpuTextureView = gpuTextureViewSrc;
        descriptor.gpuSampler = filter === Filter.POINT ? this._gpuPointSampler : this._gpuLinearSampler;

        const count = regions.length;
        for (let i = 0; i < count; ++i) {
            const region = regions[i];

            const srcWidth = gpuTextureViewSrc.gpuTexture.width;
            const srcHeight = gpuTextureViewSrc.gpuTexture.height;
            const dstWidth = gpuTextureViewDst.gpuTexture.width;
            const dstHeight = gpuTextureViewDst.gpuTexture.height;

            this._uniformBuffer[0] = region.srcExtent.width / srcWidth;
            this._uniformBuffer[1] = region.srcExtent.height / srcHeight;
            this._uniformBuffer[2] = region.srcOffset.x / srcWidth;
            this._uniformBuffer[3] = region.srcOffset.y / srcHeight;
            this._uniformBuffer[4] = region.dstExtent.width / dstWidth;
            this._uniformBuffer[5] = region.dstExtent.height / dstHeight;
            this._uniformBuffer[6] = region.dstOffset.x / dstWidth;
            this._uniformBuffer[7] = region.dstOffset.y / dstHeight;

            WebGL2CmdFuncUpdateBuffer(device, this._gpuUniformBuffer, this._uniformBuffer, 0,
                this._uniformBuffer.length * Float32Array.BYTES_PER_ELEMENT);
            WebGL2CmdFuncBindStates(device, this._gpuPipelineState, this._gpuInputAssembler, [this._gpuDescriptorSet], [], null!);
            WebGL2CmdFuncDraw(device, this._drawInfo);
        }
    }
}

interface FramebufferRecord {
    glFramebugger: GLint;
    isExternal: boolean;
}

export class FramebufferCacheMap {
    private _textureMap : Record<GLint, FramebufferRecord[]> = [];
    private _renderBufferMap: Record<GLint, FramebufferRecord[]> = [];
    private _stateCache : WebGLStateCache | null = null;

    constructor (cache : Readonly<WebGLStateCache>) {
        this._stateCache = cache;
    }

    public registerExternal (glFramebuffer: GLint, gpuTexture: IWebGL2GPUTexture, mipLevel: number) {
    }
}
