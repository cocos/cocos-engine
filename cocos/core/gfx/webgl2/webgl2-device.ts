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

import { macro, warnID, warn } from '../../platform';
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
import { Sampler } from '../base/sampler';
import { Shader } from '../base/shader';
import { Texture } from '../base/texture';
import { WebGL2DescriptorSet } from './webgl2-descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CommandAllocator } from './webgl2-command-allocator';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { WebGL2Framebuffer } from './webgl2-framebuffer';
import { WebGL2InputAssembler } from './webgl2-input-assembler';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';
import { WebGL2PipelineLayout } from './webgl2-pipeline-layout';
import { WebGL2PipelineState } from './webgl2-pipeline-state';
import { WebGL2PrimaryCommandBuffer } from './webgl2-primary-command-buffer';
import { WebGL2Queue } from './webgl2-queue';
import { WebGL2RenderPass } from './webgl2-render-pass';
import { WebGL2Sampler } from './webgl2-sampler';
import { WebGL2Shader } from './webgl2-shader';
import { WebGL2StateCache } from './webgl2-state-cache';
import { WebGL2Texture } from './webgl2-texture';
import {
    getTypedArrayConstructor, CommandBufferType, Filter, Format, FormatInfos, DescriptorSetLayoutInfo, DescriptorSetInfo,
    PipelineLayoutInfo, BufferViewInfo, CommandBufferInfo, BufferInfo, BindingMappingInfo, FramebufferInfo, InputAssemblerInfo,
    QueueInfo, RenderPassInfo, SamplerInfo, ShaderInfo, TextureInfo, TextureViewInfo, DeviceInfo, Rect, GlobalBarrierInfo, TextureBarrierInfo,
    QueueType, TextureFlagBit, TextureType, TextureUsageBit, API, Feature, BufferTextureCopy,
} from '../base/define';
import {
    GFXFormatToWebGLFormat, GFXFormatToWebGLType, WebGL2CmdFuncBlitFramebuffer, WebGL2CmdFuncCopyTextureToBuffers,
    WebGL2CmdFuncCopyBuffersToTexture, WebGL2CmdFuncCopyTexImagesToTexture,
} from './webgl2-commands';
import { GlobalBarrier } from '../base/global-barrier';
import { TextureBarrier } from '../base/texture-barrier';
import { debug } from '../../platform/debug';

const eventWebGLContextLost = 'webglcontextlost';

export class WebGL2Device extends Device {
    get gl () {
        return this._webGL2RC as WebGL2RenderingContext;
    }

    get isAntialias () {
        return this._isAntialias;
    }

    get isPremultipliedAlpha () {
        return this._isPremultipliedAlpha;
    }

    get useVAO () {
        return this._useVAO;
    }

    get bindingMappingInfo () {
        return this._bindingMappingInfo;
    }

    get EXT_texture_filter_anisotropic () {
        return this._EXT_texture_filter_anisotropic;
    }

    get OES_texture_float_linear () {
        return this._OES_texture_float_linear;
    }

    get EXT_color_buffer_float () {
        return this._EXT_color_buffer_float;
    }

    get EXT_disjoint_timer_query_webgl2 () {
        return this._EXT_disjoint_timer_query_webgl2;
    }

    get WEBGL_compressed_texture_etc1 () {
        return this._WEBGL_compressed_texture_etc1;
    }

    get WEBGL_compressed_texture_etc () {
        return this._WEBGL_compressed_texture_etc;
    }

    get WEBGL_compressed_texture_pvrtc () {
        return this._WEBGL_compressed_texture_pvrtc;
    }

    get WEBGL_compressed_texture_s3tc () {
        return this._WEBGL_compressed_texture_s3tc;
    }

    get WEBGL_compressed_texture_s3tc_srgb () {
        return this._WEBGL_compressed_texture_s3tc_srgb;
    }

    get WEBGL_texture_storage_multisample () {
        return this._WEBGL_texture_storage_multisample;
    }

    get WEBGL_debug_shaders () {
        return this._WEBGL_debug_shaders;
    }

    get WEBGL_lose_context () {
        return this._WEBGL_lose_context;
    }

    public stateCache: WebGL2StateCache = new WebGL2StateCache();
    public cmdAllocator: WebGL2CommandAllocator = new WebGL2CommandAllocator();
    public nullTex2D: WebGL2Texture | null = null;
    public nullTexCube: WebGL2Texture | null = null;

    private _webGL2RC: WebGL2RenderingContext | null = null;
    private _isAntialias = true;
    private _isPremultipliedAlpha = true;
    private _useVAO = true;
    private _bindingMappingInfo: BindingMappingInfo = new BindingMappingInfo();
    private _webGLContextLostHandler: null | ((event: Event) => void) = null;

    private _extensions: string[] | null = null;
    private _EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null = null;
    private _OES_texture_float_linear: OES_texture_float_linear | null = null;
    private _OES_texture_half_float_linear: OES_texture_half_float_linear | null = null;
    private _EXT_color_buffer_float: EXT_color_buffer_float | null = null;
    private _EXT_disjoint_timer_query_webgl2: EXT_disjoint_timer_query_webgl2 | null = null;
    private _WEBGL_compressed_texture_etc1: WEBGL_compressed_texture_etc1 | null = null;
    private _WEBGL_compressed_texture_etc: WEBGL_compressed_texture_etc | null = null;
    private _WEBGL_compressed_texture_pvrtc: WEBGL_compressed_texture_pvrtc | null = null;
    private _WEBGL_compressed_texture_astc: WEBGL_compressed_texture_astc | null = null;
    private _WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null = null;
    private _WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null = null;
    private _WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null = null;
    private _WEBGL_texture_storage_multisample: WEBGL_texture_storage_multisample | null = null;
    private _WEBGL_debug_shaders: WEBGL_debug_shaders | null = null;
    private _WEBGL_lose_context: WEBGL_lose_context | null = null;

    public initialize (info: DeviceInfo): boolean {
        this._canvas = info.canvasElm as HTMLCanvasElement;
        this._isAntialias = info.isAntialias;
        this._isPremultipliedAlpha = info.isPremultipliedAlpha;
        this._bindingMappingInfo = info.bindingMappingInfo;
        if (!this._bindingMappingInfo.bufferOffsets.length) this._bindingMappingInfo.bufferOffsets.push(0);
        if (!this._bindingMappingInfo.samplerOffsets.length) this._bindingMappingInfo.samplerOffsets.push(0);

        try {
            const webGLCtxAttribs: WebGLContextAttributes = {
                alpha: macro.ENABLE_TRANSPARENT_CANVAS,
                antialias: this._isAntialias,
                depth: true,
                stencil: true,
                premultipliedAlpha: this._isPremultipliedAlpha,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
            };

            this._webGL2RC = this._canvas.getContext('webgl2', webGLCtxAttribs);
        } catch (err) {
            console.warn(err);
            return false;
        }

        if (!this._webGL2RC) {
            console.warn('This device does not support WebGL2.');
            return false;
        }

        this._webGLContextLostHandler = this._onWebGLContextLost.bind(this);
        this._canvas.addEventListener(eventWebGLContextLost, this._onWebGLContextLost);

        this._canvas2D = document.createElement('canvas');

        console.info('WebGL2 device initialized.');

        this._gfxAPI = API.WEBGL2;
        this._deviceName = 'WebGL2';
        const gl = this._webGL2RC;

        this._WEBGL_debug_renderer_info = this.getExtension('WEBGL_debug_renderer_info');
        if (this._WEBGL_debug_renderer_info) {
            this._renderer = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            this._vendor = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
            this._renderer = gl.getParameter(gl.RENDERER);
            this._vendor = gl.getParameter(gl.VENDOR);
        }

        this._version = gl.getParameter(gl.VERSION);
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
        this._caps.depthBits = gl.getParameter(gl.DEPTH_BITS);
        this._caps.stencilBits = gl.getParameter(gl.STENCIL_BITS);
        // let maxVertexUniformBlocks = gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS);
        // let maxFragmentUniformBlocks = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS);

        this.stateCache.initialize(this._caps.maxTextureUnits, this._caps.maxUniformBufferBindings, this._caps.maxVertexAttributes);

        this._devicePixelRatio = info.devicePixelRatio || 1.0;
        this._width = info.width;
        this._height = info.height;

        this._colorFmt = Format.RGBA8;

        if (this._caps.depthBits === 32) {
            if (this._caps.stencilBits === 8) {
                this._depthStencilFmt = Format.D32F_S8;
            } else {
                this._depthStencilFmt = Format.D32F;
            }
        } else if (this._caps.depthBits === 24) {
            if (this._caps.stencilBits === 8) {
                this._depthStencilFmt = Format.D24S8;
            } else {
                this._depthStencilFmt = Format.D24;
            }
        } else if (this._caps.stencilBits === 8) {
            this._depthStencilFmt = Format.D16S8;
        } else {
            this._depthStencilFmt = Format.D16;
        }

        this._extensions = gl.getSupportedExtensions();
        let extensions = '';
        if (this._extensions) {
            for (const ext of this._extensions) {
                extensions += `${ext} `;
            }

            debug(`EXTENSIONS: ${extensions}`);
        }

        this._EXT_texture_filter_anisotropic = this.getExtension('EXT_texture_filter_anisotropic');
        this._EXT_color_buffer_float = this.getExtension('EXT_color_buffer_float');
        this._EXT_disjoint_timer_query_webgl2 = this.getExtension('EXT_disjoint_timer_query_webgl2');
        this._OES_texture_float_linear = this.getExtension('OES_texture_float_linear');
        this._OES_texture_half_float_linear = this.getExtension('OES_texture_half_float_linear');
        this._WEBGL_compressed_texture_etc1 = this.getExtension('WEBGL_compressed_texture_etc1');
        this._WEBGL_compressed_texture_etc = this.getExtension('WEBGL_compressed_texture_etc');
        this._WEBGL_compressed_texture_pvrtc = this.getExtension('WEBGL_compressed_texture_pvrtc');
        this._WEBGL_compressed_texture_astc = this.getExtension('WEBGL_compressed_texture_astc');
        this._WEBGL_compressed_texture_s3tc = this.getExtension('WEBGL_compressed_texture_s3tc');
        this._WEBGL_compressed_texture_s3tc_srgb = this.getExtension('WEBGL_compressed_texture_s3tc_srgb');
        this._WEBGL_texture_storage_multisample = this.getExtension('WEBGL_texture_storage_multisample');
        this._WEBGL_debug_shaders = this.getExtension('WEBGL_debug_shaders');
        this._WEBGL_lose_context = this.getExtension('WEBGL_lose_context');

        this._features.fill(false);
        this._features[Feature.TEXTURE_FLOAT] = true;
        this._features[Feature.TEXTURE_HALF_FLOAT] = true;
        this._features[Feature.FORMAT_R11G11B10F] = true;
        this._features[Feature.FORMAT_SRGB] = true;
        this._features[Feature.FORMAT_RGB8] = true;
        this._features[Feature.ELEMENT_INDEX_UINT] = true;
        this._features[Feature.INSTANCED_ARRAYS] = true;
        this._features[Feature.MULTIPLE_RENDER_TARGETS] = true;
        this._features[Feature.BLEND_MINMAX] = true;

        if (this._EXT_color_buffer_float) {
            this._features[Feature.COLOR_FLOAT] = true;
            this._features[Feature.COLOR_HALF_FLOAT] = true;
        }

        if (this._OES_texture_float_linear) {
            this._features[Feature.TEXTURE_FLOAT_LINEAR] = true;
        }

        if (this._OES_texture_half_float_linear) {
            this._features[Feature.TEXTURE_HALF_FLOAT_LINEAR] = true;
        }

        let compressedFormat = '';

        if (this._WEBGL_compressed_texture_etc1) {
            this._features[Feature.FORMAT_ETC1] = true;
            compressedFormat += 'etc1 ';
        }

        if (this._WEBGL_compressed_texture_etc) {
            this._features[Feature.FORMAT_ETC2] = true;
            compressedFormat += 'etc2 ';
        }

        if (this._WEBGL_compressed_texture_s3tc) {
            this._features[Feature.FORMAT_DXT] = true;
            compressedFormat += 'dxt ';
        }

        if (this._WEBGL_compressed_texture_pvrtc) {
            this._features[Feature.FORMAT_PVRTC] = true;
            compressedFormat += 'pvrtc ';
        }

        if (this._WEBGL_compressed_texture_astc) {
            this._features[Feature.FORMAT_ASTC] = true;
            compressedFormat += 'astc ';
        }

        debug(`RENDERER: ${this._renderer}`);
        debug(`VENDOR: ${this._vendor}`);
        debug(`VERSION: ${this._version}`);
        debug(`DPR: ${this._devicePixelRatio}`);
        debug(`SCREEN_SIZE: ${this._width} x ${this._height}`);
        debug(`MAX_VERTEX_ATTRIBS: ${this._caps.maxVertexAttributes}`);
        debug(`MAX_VERTEX_UNIFORM_VECTORS: ${this._caps.maxVertexUniformVectors}`);
        debug(`MAX_FRAGMENT_UNIFORM_VECTORS: ${this._caps.maxFragmentUniformVectors}`);
        debug(`MAX_TEXTURE_IMAGE_UNITS: ${this._caps.maxTextureUnits}`);
        debug(`MAX_VERTEX_TEXTURE_IMAGE_UNITS: ${this._caps.maxVertexTextureUnits}`);
        debug(`MAX_UNIFORM_BUFFER_BINDINGS: ${this._caps.maxUniformBufferBindings}`);
        debug(`MAX_UNIFORM_BLOCK_SIZE: ${this._caps.maxUniformBlockSize}`);
        debug(`DEPTH_BITS: ${this._caps.depthBits}`);
        debug(`STENCIL_BITS: ${this._caps.stencilBits}`);
        debug(`UNIFORM_BUFFER_OFFSET_ALIGNMENT: ${this._caps.uboOffsetAlignment}`);
        if (this._EXT_texture_filter_anisotropic) {
            debug(`MAX_TEXTURE_MAX_ANISOTROPY_EXT: ${this._EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT}`);
        }
        debug(`USE_VAO: ${this._useVAO}`);
        debug(`COMPRESSED_FORMAT: ${compressedFormat}`);

        // init states
        this.initStates(gl);

        // create queue
        this._queue = this.createQueue(new QueueInfo(QueueType.GRAPHICS));
        this._cmdBuff = this.createCommandBuffer(new CommandBufferInfo(this._queue));

        // create default null texture
        this.nullTex2D = this.createTexture(new TextureInfo(
            TextureType.TEX2D,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
        )) as WebGL2Texture;

        this.nullTexCube = new WebGL2Texture(this);
        this.nullTexCube.initialize(new TextureInfo(
            TextureType.CUBE,
            TextureUsageBit.SAMPLED,
            Format.RGBA8,
            2,
            2,
            TextureFlagBit.GEN_MIPMAP,
            6,
        ));

        const nullTexRegion = new BufferTextureCopy();
        nullTexRegion.texExtent.width = 2;
        nullTexRegion.texExtent.height = 2;

        const nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        this.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);

        nullTexRegion.texSubres.layerCount = 6;
        this.copyBuffersToTexture(
            [nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff],
            this.nullTexCube, [nullTexRegion],
        );

        return true;
    }

    public destroy (): void {
        if (this._canvas && this._webGLContextLostHandler) {
            this._canvas.removeEventListener(eventWebGLContextLost, this._webGLContextLostHandler);
            this._webGLContextLostHandler = null;
        }

        if (this.nullTex2D) {
            this.nullTex2D.destroy();
            this.nullTex2D = null;
        }

        if (this.nullTexCube) {
            this.nullTexCube.destroy();
            this.nullTexCube = null;
        }

        // for (let i = 0; i < this._primaries.length; i++) {
        //     this._primaries[i].destroy();
        // }
        // this._nextPrimary = this._primaries.length = 0;

        // for (let i = 0; i < this._secondaries.length; i++) {
        //     this._secondaries[i].destroy();
        // }
        // this._nextSecondary = this._secondaries.length = 0;

        if (this._queue) {
            this._queue.destroy();
            this._queue = null;
        }

        if (this._cmdBuff) {
            this._cmdBuff.destroy();
            this._cmdBuff = null;
        }

        this._extensions = null;

        this._webGL2RC = null;
    }

    public resize (width: number, height: number) {
        if (this._width !== width || this._height !== height) {
            debug(`Resizing device: ${width}x${height}`);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._width = width;
            this._height = height;
        }
    }

    public flushCommands (cmdBuffs: CommandBuffer[]) {}

    public acquire () {
        this.cmdAllocator.releaseCmds();
    }

    public present () {
        const queue = (this._queue as WebGL2Queue);
        this._numDrawCalls = queue.numDrawCalls;
        this._numInstances = queue.numInstances;
        this._numTris = queue.numTris;
        queue.clear();
    }

    public createCommandBuffer (info: CommandBufferInfo): CommandBuffer {
        // const Ctor = WebGLCommandBuffer; // opt to instant invocation
        const Ctor = info.type === CommandBufferType.PRIMARY ? WebGL2PrimaryCommandBuffer : WebGL2CommandBuffer;
        const cmdBuff = new Ctor(this);
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        }
        return null!;
    }

    public createBuffer (info: BufferInfo | BufferViewInfo): Buffer {
        const buffer = new WebGL2Buffer(this);
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: TextureInfo | TextureViewInfo): Texture {
        const texture = new WebGL2Texture(this);
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public createSampler (info: SamplerInfo): Sampler {
        const sampler = new WebGL2Sampler(this);
        if (sampler.initialize(info)) {
            return sampler;
        }
        return null!;
    }

    public createDescriptorSet (info: DescriptorSetInfo): DescriptorSet {
        const descriptorSet = new WebGL2DescriptorSet(this);
        if (descriptorSet.initialize(info)) {
            return descriptorSet;
        }
        return null!;
    }

    public createShader (info: ShaderInfo): Shader {
        const shader = new WebGL2Shader(this);
        if (shader.initialize(info)) {
            return shader;
        }
        return null!;
    }

    public createInputAssembler (info: InputAssemblerInfo): InputAssembler {
        const inputAssembler = new WebGL2InputAssembler(this);
        if (inputAssembler.initialize(info)) {
            return inputAssembler;
        }
        return null!;
    }

    public createRenderPass (info: RenderPassInfo): RenderPass {
        const renderPass = new WebGL2RenderPass(this);
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: FramebufferInfo): Framebuffer {
        const framebuffer = new WebGL2Framebuffer(this);
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
    }

    public createDescriptorSetLayout (info: DescriptorSetLayoutInfo): DescriptorSetLayout {
        const descriptorSetLayout = new WebGL2DescriptorSetLayout(this);
        if (descriptorSetLayout.initialize(info)) {
            return descriptorSetLayout;
        }
        return null!;
    }

    public createPipelineLayout (info: PipelineLayoutInfo): PipelineLayout {
        const pipelineLayout = new WebGL2PipelineLayout(this);
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: PipelineStateInfo): PipelineState {
        const pipelineState = new WebGL2PipelineState(this);
        if (pipelineState.initialize(info)) {
            return pipelineState;
        }
        return null!;
    }

    public createQueue (info: QueueInfo): Queue {
        const queue = new WebGL2Queue(this);
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public createGlobalBarrier (info: GlobalBarrierInfo) {
        const barrier = new GlobalBarrier(this);
        if (barrier.initialize(info)) {
            return barrier;
        }
        return null!;
    }

    public createTextureBarrier (info: TextureBarrierInfo) {
        const barrier = new TextureBarrier(this);
        if (barrier.initialize(info)) {
            return barrier;
        }
        return null!;
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

    public copyFramebufferToBuffer (
        srcFramebuffer: Framebuffer,
        dstBuffer: ArrayBuffer,
        regions: BufferTextureCopy[],
    ) {
        const gl = this._webGL2RC as WebGL2RenderingContext;
        const gpuFramebuffer = (srcFramebuffer as WebGL2Framebuffer).gpuFramebuffer;
        const format = gpuFramebuffer.gpuColorTextures[0].format;
        const glFormat = GFXFormatToWebGLFormat(format, gl);
        const glType = GFXFormatToWebGLType(format, gl);
        const Ctor = getTypedArrayConstructor(FormatInfos[format]);

        const curFBO = this.stateCache.glFramebuffer;

        if (this.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
            this.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
        }

        const view = new Ctor(dstBuffer);

        for (const region of regions) {
            const w = region.texExtent.width;
            const h = region.texExtent.height;

            gl.readPixels(region.texOffset.x, region.texOffset.y, w, h, glFormat, glType, view);
        }

        if (this.stateCache.glFramebuffer !== curFBO) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, curFBO);
            this.stateCache.glFramebuffer = curFBO;
        }
    }

    public blitFramebuffer (src: Framebuffer, dst: Framebuffer, srcRect: Rect, dstRect: Rect, filter: Filter) {
        const srcFBO = (src as WebGL2Framebuffer).gpuFramebuffer;
        const dstFBO = (dst as WebGL2Framebuffer).gpuFramebuffer;

        WebGL2CmdFuncBlitFramebuffer(
            this,
            srcFBO,
            dstFBO,
            srcRect,
            dstRect,
            filter,
        );
    }

    private getExtension (ext: string): any {
        const prefixes = ['', 'WEBKIT_', 'MOZ_'];
        for (let i = 0; i < prefixes.length; ++i) {
            const _ext = this.gl.getExtension(prefixes[i] + ext);
            if (_ext) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return _ext;
            }
        }
        return null;
    }

    private initStates (gl: WebGL2RenderingContext) {
        gl.activeTexture(gl.TEXTURE0);
        gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // rasterizer state
        gl.enable(gl.SCISSOR_TEST);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);
        gl.frontFace(gl.CCW);
        gl.polygonOffset(0.0, 0.0);

        // depth stencil state
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.depthFunc(gl.LESS);

        gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 1, 0xffff);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.FRONT, 0xffff);
        gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 1, 0xffff);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.BACK, 0xffff);

        gl.disable(gl.STENCIL_TEST);

        // blend state
        gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
        gl.disable(gl.BLEND);
        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        gl.blendFuncSeparate(gl.ONE, gl.ZERO, gl.ONE, gl.ZERO);
        gl.colorMask(true, true, true, true);
        gl.blendColor(0.0, 0.0, 0.0, 0.0);
    }

    private _onWebGLContextLost (event: Event) {
        warnID(11000);
        warn(event);
        // 2020.9.3: `preventDefault` is not available on some platforms
        // event.preventDefault();
    }
}
