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

import { DescriptorSet } from '../base/descriptor-set';
import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { PipelineLayout } from '../base/pipeline-layout';
import { Buffer } from '../base/buffer';
import { CommandBuffer } from '../base/command-buffer';
import { Device } from '../base/device';
import { Framebuffer } from '../base/framebuffer';
import { InputAssembler } from '../base/input-assembler';
import { PipelineState, PipelineStateInfo } from '../base/pipeline-state';
import { Queue } from '../base/queue';
import { RenderPass } from '../base/render-pass';
import { Sampler } from '../base/states/sampler';
import { Shader } from '../base/shader';
import { Texture } from '../base/texture';
import { WebGL2DescriptorSet } from './webgl2-descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { WebGL2Framebuffer } from './webgl2-framebuffer';
import { WebGL2InputAssembler } from './webgl2-input-assembler';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';
import { WebGL2PipelineLayout } from './webgl2-pipeline-layout';
import { WebGL2PipelineState } from './webgl2-pipeline-state';
import { WebGL2PrimaryCommandBuffer } from './webgl2-primary-command-buffer';
import { WebGL2Queue } from './webgl2-queue';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { WebGL2Sampler } from './states/webgl2-sampler';
import { WebGL2Shader } from './webgl2-shader';
import { WebGL2Swapchain, getExtensions, getContext } from './webgl2-swapchain';
import { WebGL2Texture } from './webgl2-texture';
import {
    CommandBufferType, DescriptorSetLayoutInfo, DescriptorSetInfo,
    PipelineLayoutInfo, BufferViewInfo, CommandBufferInfo, BufferInfo, FramebufferInfo, InputAssemblerInfo,
    QueueInfo, RenderPassInfo, SamplerInfo, ShaderInfo, TextureInfo, TextureViewInfo, DeviceInfo, GlobalBarrierInfo, TextureBarrierInfo,
    QueueType, API, Feature, BufferTextureCopy, SwapchainInfo, FormatFeature, Format, FormatFeatureBit,
} from '../base/define';
import { WebGL2CmdFuncCopyTextureToBuffers, WebGL2CmdFuncCopyBuffersToTexture, WebGL2CmdFuncCopyTexImagesToTexture } from './webgl2-commands';
import { GlobalBarrier } from '../base/states/global-barrier';
import { TextureBarrier } from '../base/states/texture-barrier';
import { debug } from '../../platform/debug';
import { Swapchain } from '../base/swapchain';
import { IWebGL2Extensions, WebGL2DeviceManager } from './webgl2-define';
import { IWebGL2BindingMapping } from './webgl2-gpu-objects';

export class WebGL2Device extends Device {
    get gl () {
        return this._context!;
    }

    get extensions () {
        return this._swapchain!.extensions;
    }

    get stateCache () {
        return this._swapchain!.stateCache;
    }

    get nullTex2D () {
        return this._swapchain!.nullTex2D;
    }

    get nullTexCube () {
        return this._swapchain!.nullTexCube;
    }

    get textureExclusive (): boolean[] {
        return this._textureExclusive;
    }

    get bindingMappings () {
        return this._bindingMappings!;
    }

    private _swapchain: WebGL2Swapchain | null = null;
    private _context: WebGL2RenderingContext | null = null;
    private _bindingMappings: IWebGL2BindingMapping | null = null;

    protected _textureExclusive = new Array<boolean>(Format.COUNT);

    public initialize (info: DeviceInfo): boolean {
        WebGL2DeviceManager.setInstance(this);
        this._gfxAPI = API.WEBGL2;

        const mapping = this._bindingMappingInfo = info.bindingMappingInfo;
        const blockOffsets: number[] = [];
        const samplerTextureOffsets: number[] = [];
        const firstSet = mapping.setIndices[0];
        blockOffsets[firstSet] = 0;
        samplerTextureOffsets[firstSet] = 0;
        for (let i = 1; i < mapping.setIndices.length; ++i) {
            const curSet = mapping.setIndices[i];
            const prevSet = mapping.setIndices[i - 1];
            // accumulate the per set offset according to the specified capacity
            blockOffsets[curSet] = mapping.maxBlockCounts[prevSet] + blockOffsets[prevSet];
            samplerTextureOffsets[curSet] = mapping.maxSamplerTextureCounts[prevSet] + samplerTextureOffsets[prevSet];
        }
        for (let i = 0; i < mapping.setIndices.length; ++i) {
            const curSet = mapping.setIndices[i];
            // textures always come after UBOs
            samplerTextureOffsets[curSet] -= mapping.maxBlockCounts[curSet];
        }
        this._bindingMappings = {
            blockOffsets,
            samplerTextureOffsets,
            flexibleSet: mapping.setIndices[mapping.setIndices.length - 1],
        };

        const gl = this._context = getContext(Device.canvas);

        if (!gl) {
            console.error('This device does not support WebGL.');
            return false;
        }

        // create queue
        this._queue = this.createQueue(new QueueInfo(QueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new CommandBufferInfo(this._queue));

        this._caps.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this._caps.maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this._caps.maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._caps.maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this._caps.maxVertexTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._caps.maxUniformBufferBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        this._caps.maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        this._caps.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._caps.maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._caps.uboOffsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);

        const extensions = gl.getSupportedExtensions();
        let extStr = '';
        if (extensions) {
            for (const ext of extensions) {
                extStr += `${ext} `;
            }
        }

        const exts = getExtensions(gl);

        if (exts.WEBGL_debug_renderer_info) {
            this._renderer = gl.getParameter(exts.WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            this._vendor = gl.getParameter(exts.WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
            this._renderer = gl.getParameter(gl.RENDERER);
            this._vendor = gl.getParameter(gl.VENDOR);
        }

        const version: string = gl.getParameter(gl.VERSION);

        this._features.fill(false);

        this.initFormatFeatures(exts);

        this._features[Feature.ELEMENT_INDEX_UINT] = true;
        this._features[Feature.INSTANCED_ARRAYS] = true;
        this._features[Feature.MULTIPLE_RENDER_TARGETS] = true;
        this._features[Feature.BLEND_MINMAX] = true;

        let compressedFormat = '';

        if (this.getFormatFeatures(Format.ETC_RGB8)) {
            compressedFormat += 'etc1 ';
        }

        if (this.getFormatFeatures(Format.ETC2_RGB8)) {
            compressedFormat += 'etc2 ';
        }

        if (this.getFormatFeatures(Format.BC1)) {
            compressedFormat += 'dxt ';
        }

        if (this.getFormatFeatures(Format.PVRTC_RGB2)) {
            compressedFormat += 'pvrtc ';
        }

        if (this.getFormatFeatures(Format.ASTC_RGBA_4X4)) {
            compressedFormat += 'astc ';
        }

        debug('WebGL2 device initialized.');
        debug(`RENDERER: ${this._renderer}`);
        debug(`VENDOR: ${this._vendor}`);
        debug(`VERSION: ${version}`);
        debug(`COMPRESSED_FORMAT: ${compressedFormat}`);
        debug(`EXTENSIONS: ${extStr}`);

        return true;
    }

    public destroy (): void {
        if (this._queue) {
            this._queue.destroy();
            this._queue = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }

        const it = this._samplers.values();
        let res = it.next();
        while (!res.done) {
            (res.value as WebGL2Sampler).destroy();
            res = it.next();
        }

        this._swapchain = null;
    }

    public flushCommands (cmdBuffs: CommandBuffer[]) {}

    public acquire (swapchains: Swapchain[]) {}

    public present () {
        const queue = (this._queue as WebGL2Queue);
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
    }

    protected initFormatFeatures (exts: IWebGL2Extensions) {
        this._formatFeatures.fill(FormatFeatureBit.NONE);

        this._textureExclusive.fill(true);

        let tempFeature: FormatFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.LINEAR_FILTER | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R8] = tempFeature;
        this._formatFeatures[Format.RG8] = tempFeature;
        this._formatFeatures[Format.RGB8] = tempFeature;
        this._formatFeatures[Format.RGBA8] = tempFeature;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        this._formatFeatures[Format.R8SN] = tempFeature;
        this._formatFeatures[Format.RG8SN] = tempFeature;
        this._formatFeatures[Format.RGB8SN] = tempFeature;
        this._formatFeatures[Format.RGBA8SN] = tempFeature;
        this._formatFeatures[Format.R5G6B5] = tempFeature;
        this._formatFeatures[Format.RGBA4] = tempFeature;
        this._formatFeatures[Format.RGB5A1] = tempFeature;
        this._formatFeatures[Format.RGB10A2] = tempFeature;

        this._formatFeatures[Format.SRGB8] = tempFeature;
        this._formatFeatures[Format.SRGB8_A8] = tempFeature;

        this._formatFeatures[Format.R11G11B10F] = tempFeature;
        this._formatFeatures[Format.RGB9E5] = tempFeature;

        this._formatFeatures[Format.DEPTH] = tempFeature;
        this._formatFeatures[Format.DEPTH_STENCIL] = tempFeature;

        this._formatFeatures[Format.RGB10A2UI] = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.SAMPLED_TEXTURE
            | FormatFeatureBit.STORAGE_TEXTURE | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R16F] = tempFeature;
        this._formatFeatures[Format.RG16F] = tempFeature;
        this._formatFeatures[Format.RGB16F] = tempFeature;
        this._formatFeatures[Format.RGBA16F] = tempFeature;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R32F] = tempFeature;
        this._formatFeatures[Format.RG32F] = tempFeature;
        this._formatFeatures[Format.RGB32F] = tempFeature;
        this._formatFeatures[Format.RGBA32F] = tempFeature;

        this._formatFeatures[Format.RGB10A2UI] = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        tempFeature = FormatFeatureBit.RENDER_TARGET | FormatFeatureBit.STORAGE_TEXTURE
            | FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER | FormatFeatureBit.VERTEX_ATTRIBUTE;

        this._formatFeatures[Format.R8I] = tempFeature;
        this._formatFeatures[Format.R8UI] = tempFeature;
        this._formatFeatures[Format.R16I] = tempFeature;
        this._formatFeatures[Format.R16UI] = tempFeature;
        this._formatFeatures[Format.R32I] = tempFeature;
        this._formatFeatures[Format.R32UI] = tempFeature;

        this._formatFeatures[Format.RG8I] = tempFeature;
        this._formatFeatures[Format.RG8UI] = tempFeature;
        this._formatFeatures[Format.RG16I] = tempFeature;
        this._formatFeatures[Format.RG16UI] = tempFeature;
        this._formatFeatures[Format.RG32I] = tempFeature;
        this._formatFeatures[Format.RG32UI] = tempFeature;

        this._formatFeatures[Format.RGB8I] = tempFeature;
        this._formatFeatures[Format.RGB8UI] = tempFeature;
        this._formatFeatures[Format.RGB16I] = tempFeature;
        this._formatFeatures[Format.RGB16UI] = tempFeature;
        this._formatFeatures[Format.RGB32I] = tempFeature;
        this._formatFeatures[Format.RGB32UI] = tempFeature;

        this._formatFeatures[Format.RGBA8I] = tempFeature;
        this._formatFeatures[Format.RGBA8UI] = tempFeature;
        this._formatFeatures[Format.RGBA16I] = tempFeature;
        this._formatFeatures[Format.RGBA16UI] = tempFeature;
        this._formatFeatures[Format.RGBA32I] = tempFeature;
        this._formatFeatures[Format.RGBA32UI] = tempFeature;

        this._textureExclusive[Format.R8] = false;
        this._textureExclusive[Format.RG8] = false;
        this._textureExclusive[Format.RGB8] = false;
        this._textureExclusive[Format.R5G6B5] = false;
        this._textureExclusive[Format.RGBA4] = false;

        this._textureExclusive[Format.RGB5A1] = false;
        this._textureExclusive[Format.RGBA8] = false;
        this._textureExclusive[Format.RGB10A2] = false;
        this._textureExclusive[Format.RGB10A2UI] = false;
        this._textureExclusive[Format.SRGB8_A8] = false;

        this._textureExclusive[Format.R8I] = false;
        this._textureExclusive[Format.R8UI] = false;
        this._textureExclusive[Format.R16I] = false;
        this._textureExclusive[Format.R16UI] = false;
        this._textureExclusive[Format.R32I] = false;
        this._textureExclusive[Format.R32UI] = false;

        this._textureExclusive[Format.RG8I] = false;
        this._textureExclusive[Format.RG8UI] = false;
        this._textureExclusive[Format.RG16I] = false;
        this._textureExclusive[Format.RG16UI] = false;
        this._textureExclusive[Format.RG32I] = false;
        this._textureExclusive[Format.RG32UI] = false;

        this._textureExclusive[Format.RGBA8I] = false;
        this._textureExclusive[Format.RGBA8UI] = false;
        this._textureExclusive[Format.RGBA16I] = false;
        this._textureExclusive[Format.RGBA16UI] = false;
        this._textureExclusive[Format.RGBA32I] = false;
        this._textureExclusive[Format.RGBA32UI] = false;

        this._textureExclusive[Format.DEPTH] = false;
        this._textureExclusive[Format.DEPTH_STENCIL] = false;

        if (exts.EXT_color_buffer_float) {
            this._textureExclusive[Format.R32F] = false;
            this._textureExclusive[Format.RG32F] = false;
            this._textureExclusive[Format.RGBA32F] = false;
        }

        if (exts.EXT_color_buffer_half_float) {
            this._textureExclusive[Format.R16F] = false;
            this._textureExclusive[Format.RG16F] = false;
            this._textureExclusive[Format.RGBA16F] = false;
        }

        if (exts.OES_texture_float_linear) {
            this._formatFeatures[Format.RGB32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RGBA32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.R32F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RG32F] |= FormatFeatureBit.LINEAR_FILTER;
        }

        if (exts.OES_texture_half_float_linear) {
            this._formatFeatures[Format.RGB16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RGBA16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.R16F] |= FormatFeatureBit.LINEAR_FILTER;
            this._formatFeatures[Format.RG16F] |= FormatFeatureBit.LINEAR_FILTER;
        }

        const compressedFeature: FormatFeature = FormatFeatureBit.SAMPLED_TEXTURE | FormatFeatureBit.LINEAR_FILTER;

        if (exts.WEBGL_compressed_texture_etc1) {
            this._formatFeatures[Format.ETC_RGB8] = compressedFeature;
        }

        if (exts.WEBGL_compressed_texture_etc) {
            this._formatFeatures[Format.ETC2_RGB8] = compressedFeature;
            this._formatFeatures[Format.ETC2_RGBA8] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8_A8] = compressedFeature;
            this._formatFeatures[Format.ETC2_RGB8_A1] = compressedFeature;
            this._formatFeatures[Format.ETC2_SRGB8_A1] = compressedFeature;
        }

        if (exts.WEBGL_compressed_texture_s3tc) {
            this._formatFeatures[Format.BC1] = compressedFeature;
            this._formatFeatures[Format.BC1_ALPHA] = compressedFeature;
            this._formatFeatures[Format.BC1_SRGB] = compressedFeature;
            this._formatFeatures[Format.BC1_SRGB_ALPHA] = compressedFeature;
            this._formatFeatures[Format.BC2] = compressedFeature;
            this._formatFeatures[Format.BC2_SRGB] = compressedFeature;
            this._formatFeatures[Format.BC3] = compressedFeature;
            this._formatFeatures[Format.BC3_SRGB] = compressedFeature;
        }

        if (exts.WEBGL_compressed_texture_pvrtc) {
            this._formatFeatures[Format.PVRTC_RGB2] = compressedFeature;
            this._formatFeatures[Format.PVRTC_RGBA2] = compressedFeature;
            this._formatFeatures[Format.PVRTC_RGB4] = compressedFeature;
            this._formatFeatures[Format.PVRTC_RGBA4] = compressedFeature;
        }

        if (exts.WEBGL_compressed_texture_astc) {
            this._formatFeatures[Format.ASTC_RGBA_4X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_5X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_5X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_6X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_6X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_8X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_10X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_12X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_RGBA_12X12] = compressedFeature;

            this._formatFeatures[Format.ASTC_SRGBA_4X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_5X4] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_5X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_6X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_6X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_8X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X5] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X6] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X8] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_10X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_12X10] = compressedFeature;
            this._formatFeatures[Format.ASTC_SRGBA_12X12] = compressedFeature;
        }
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        // const Ctor = WebGLCommandBuffer; // opt to instant invocation
        const Ctor = info.type === CommandBufferType.PRIMARY ? WebGL2PrimaryCommandBuffer : WebGL2CommandBuffer;
        const cmdBuff = new Ctor();
        cmdBuff.initialize(info);
        return cmdBuff;
    }

    public createSwapchain (info: SwapchainInfo): Swapchain {
        const swapchain = new WebGL2Swapchain();
        this._swapchain = swapchain;
        swapchain.initialize(info);
        return swapchain;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new WebGL2Buffer();
        buffer.initialize(info);
        return buffer;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new WebGL2Texture();
        texture.initialize(info);
        return texture;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new WebGL2DescriptorSet();
        descriptorSet.initialize(info);
        return descriptorSet;
    }

    public createShader (info: ShaderInfo): Shader {
        const shader = new WebGL2Shader();
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        const inputAssembler = new WebGL2InputAssembler();
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const renderPass = new WebGL2RenderPass();
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new WebGL2Framebuffer();
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new WebGL2DescriptorSetLayout();
        descriptorSetLayout.initialize(info);
        return descriptorSetLayout;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new WebGL2PipelineLayout();
        pipelineLayout.initialize(info);
        return pipelineLayout;
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        const pipelineState = new WebGL2PipelineState();
        pipelineState.initialize(info);
        return pipelineState;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new WebGL2Queue();
        queue.initialize(info);
        return queue;
    }

    public getSampler (info: SamplerInfo): Sampler {
        const hash = Sampler.computeHash(info);
        if (!this._samplers.has(hash)) {
            this._samplers.set(hash, new WebGL2Sampler(info, hash));
        }
        return this._samplers.get(hash)!;
    }

    public getGlobalBarrier (info: GlobalBarrierInfo) {
        const hash = GlobalBarrier.computeHash(info);
        if (!this._globalBarriers.has(hash)) {
            this._globalBarriers.set(hash, new GlobalBarrier(info, hash));
        }
        return this._globalBarriers.get(hash)!;
    }

    public getTextureBarrier (info: TextureBarrierInfo) {
        const hash = TextureBarrier.computeHash(info);
        if (!this._textureBarriers.has(hash)) {
            this._textureBarriers.set(hash, new TextureBarrier(info, hash));
        }
        return this._textureBarriers.get(hash)!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]) {
        WebGL2CmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGL2Texture).gpuTexture,
            regions,
        );
    }

    public copyTextureToBuffers (texture: Texture, buffers: ArrayBufferView[], regions: BufferTextureCopy[]) {
        WebGL2CmdFuncCopyTextureToBuffers(
            this,
            (texture as WebGL2Texture).gpuTexture,
            buffers,
            regions,
        );
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: Texture,
        regions: BufferTextureCopy[],
    ) {
        WebGL2CmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGL2Texture).gpuTexture,
            regions,
        );
    }
}
