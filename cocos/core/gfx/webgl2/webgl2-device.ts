import { macro } from '../../platform';
import { GFXDescriptorSet, IGFXDescriptorSetInfo } from '../descriptor-set';
import { GFXBuffer, IGFXBufferInfo, IGFXBufferViewInfo } from '../buffer';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import { GFXAPI, GFXDevice, GFXFeature, IGFXDeviceInfo, GFXBindingMappingInfo } from '../device';
import { GFXFence, IGFXFenceInfo } from '../fence';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { GFXShader, GFXShaderInfo } from '../shader';
import { GFXTexture, IGFXTextureInfo, IGFXTextureViewInfo } from '../texture';
import { WebGL2DescriptorSet } from './webgl2-descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CommandAllocator } from './webgl2-command-allocator';
import { WebGL2CommandBuffer } from './webgl2-command-buffer';
import { WebGL2Fence } from './webgl2-fence';
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
import { getTypedArrayConstructor, GFXBufferTextureCopy, GFXCommandBufferType, GFXFilter, GFXFormat, GFXFormatInfos,
    GFXQueueType, GFXTextureFlagBit, GFXTextureType, GFXTextureUsageBit, GFXRect } from '../define';
import { GFXFormatToWebGLFormat, GFXFormatToWebGLType, WebGL2CmdFuncBlitFramebuffer,
    WebGL2CmdFuncCopyBuffersToTexture, WebGL2CmdFuncCopyTexImagesToTexture } from './webgl2-commands';
import { GFXPipelineLayout, GFXDescriptorSetLayout, IGFXDescriptorSetLayoutInfo, IGFXPipelineLayoutInfo } from '../..';

export class WebGL2Device extends GFXDevice {

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
    private _isAntialias: boolean = true;
    private _isPremultipliedAlpha: boolean = true;
    private _useVAO: boolean = true;
    private _bindingMappingInfo: GFXBindingMappingInfo = new GFXBindingMappingInfo();

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

    public initialize (info: IGFXDeviceInfo): boolean {

        this._canvas = info.canvasElm as HTMLCanvasElement;

        if (info.isAntialias !== undefined) {
            this._isAntialias = info.isAntialias;
        }

        if (info.isPremultipliedAlpha !== undefined) {
            this._isPremultipliedAlpha = info.isPremultipliedAlpha;
        }

        if (info.bindingMappingInfo !== undefined) {
            this._bindingMappingInfo = info.bindingMappingInfo;
        }
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

        this._canvas2D = document.createElement('canvas');

        console.info('WebGL2 device initialized.');

        this._gfxAPI = GFXAPI.WEBGL2;
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
        this._maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
        this._maxVertexUniformVectors = gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS);
        this._maxFragmentUniformVectors = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this._maxVertexTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._maxUniformBufferBindings = gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS);
        this._maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        this._maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this._maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        this._uboOffsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
        this._depthBits = gl.getParameter(gl.DEPTH_BITS);
        this._stencilBits = gl.getParameter(gl.STENCIL_BITS);
        // let maxVertexUniformBlocks = gl.getParameter(gl.MAX_VERTEX_UNIFORM_BLOCKS);
        // let maxFragmentUniformBlocks = gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_BLOCKS);

        this._devicePixelRatio = info.devicePixelRatio || 1.0;
        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._nativeWidth = Math.max(info.nativeWidth || this._width, 0);
        this._nativeHeight = Math.max(info.nativeHeight || this._height, 0);

        this._colorFmt = GFXFormat.RGBA8;

        if (this._depthBits === 32) {
            if (this._stencilBits === 8) {
                this._depthStencilFmt = GFXFormat.D32F_S8;
            } else {
                this._depthStencilFmt = GFXFormat.D32F;
            }
        } else if (this._depthBits === 24) {
            if (this._stencilBits === 8) {
                this._depthStencilFmt = GFXFormat.D24S8;
            } else {
                this._depthStencilFmt = GFXFormat.D24;
            }
        } else {
            if (this._stencilBits === 8) {
                this._depthStencilFmt = GFXFormat.D16S8;
            } else {
                this._depthStencilFmt = GFXFormat.D16;
            }
        }

        this._extensions = gl.getSupportedExtensions();
        let extensions = '';
        if (this._extensions) {
            for (const ext of this._extensions) {
                extensions += ext + ' ';
            }

            console.debug('EXTENSIONS: ' + extensions);
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
        this._features[GFXFeature.TEXTURE_FLOAT] = true;
        this._features[GFXFeature.TEXTURE_HALF_FLOAT] = true;
        this._features[GFXFeature.FORMAT_R11G11B10F] = true;
        this._features[GFXFeature.FORMAT_RGB8] = true;
        this._features[GFXFeature.FORMAT_D16] = true;
        this._features[GFXFeature.FORMAT_D24] = true;
        this._features[GFXFeature.FORMAT_D32F] = true;
        this._features[GFXFeature.FORMAT_D24S8] = true;
        this._features[GFXFeature.FORMAT_D32FS8] = true;
        this._features[GFXFeature.MSAA] = true;
        this._features[GFXFeature.ELEMENT_INDEX_UINT] = true;
        this._features[GFXFeature.INSTANCED_ARRAYS] = true;

        if (this._EXT_color_buffer_float) {
            this._features[GFXFeature.COLOR_FLOAT] = true;
            this._features[GFXFeature.COLOR_HALF_FLOAT] = true;
        }

        if (this._OES_texture_float_linear) {
            this._features[GFXFeature.TEXTURE_FLOAT_LINEAR] = true;
        }

        if (this._OES_texture_half_float_linear) {
            this._features[GFXFeature.TEXTURE_HALF_FLOAT_LINEAR] = true;
        }

        let compressedFormat: string = '';

        if (this._WEBGL_compressed_texture_etc1) {
            this._features[GFXFeature.FORMAT_ETC1] = true;
            compressedFormat += 'etc1 ';
        }

        if (this._WEBGL_compressed_texture_etc) {
            this._features[GFXFeature.FORMAT_ETC2] = true;
            compressedFormat += 'etc2 ';
        }

        if (this._WEBGL_compressed_texture_s3tc) {
            this._features[GFXFeature.FORMAT_DXT] = true;
            compressedFormat += 'dxt ';
        }

        if (this._WEBGL_compressed_texture_pvrtc) {
            this._features[GFXFeature.FORMAT_PVRTC] = true;
            compressedFormat += 'pvrtc ';
        }

        if (this._WEBGL_compressed_texture_astc) {
            this._features[GFXFeature.FORMAT_ASTC] = true;
            compressedFormat += 'astc ';
        }

        console.info('RENDERER: ' + this._renderer);
        console.info('VENDOR: ' + this._vendor);
        console.info('VERSION: ' + this._version);
        console.info('DPR: ' + this._devicePixelRatio);
        console.info('SCREEN_SIZE: ' + this._width + ' x ' + this._height);
        console.info('NATIVE_SIZE: ' + this._nativeWidth + ' x ' + this._nativeHeight);
        console.info('MAX_VERTEX_ATTRIBS: ' + this._maxVertexAttributes);
        console.info('MAX_VERTEX_UNIFORM_VECTORS: ' + this._maxVertexUniformVectors);
        console.info('MAX_FRAGMENT_UNIFORM_VECTORS: ' + this._maxFragmentUniformVectors);
        console.info('MAX_TEXTURE_IMAGE_UNITS: ' + this._maxTextureUnits);
        console.info('MAX_VERTEX_TEXTURE_IMAGE_UNITS: ' + this._maxVertexTextureUnits);
        console.info('MAX_UNIFORM_BUFFER_BINDINGS: ' + this._maxUniformBufferBindings);
        console.info('MAX_UNIFORM_BLOCK_SIZE: ' + this._maxUniformBlockSize);
        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);
        console.info('UNIFORM_BUFFER_OFFSET_ALIGNMENT: ' + this._uboOffsetAlignment);
        if (this._EXT_texture_filter_anisotropic) {
            console.info('MAX_TEXTURE_MAX_ANISOTROPY_EXT: ' + this._EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
        console.info('USE_VAO: ' + this._useVAO);
        console.info('COMPRESSED_FORMAT: ' + compressedFormat);

        // init states
        this.initStates(gl);

        // create queue
        this._queue = this.createQueue({ type: GFXQueueType.GRAPHICS });

        // create default null texture
        this.nullTex2D = new WebGL2Texture(this);
        this.nullTex2D.initialize({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: 2,
            height: 2,
            flags: GFXTextureFlagBit.GEN_MIPMAP,
        });

        this.nullTexCube = new WebGL2Texture(this);
        this.nullTexCube.initialize({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: 2,
            height: 2,
            layerCount: 6,
            flags: GFXTextureFlagBit.CUBEMAP |  GFXTextureFlagBit.GEN_MIPMAP,
        });

        const nullTexRegion: GFXBufferTextureCopy = {
            buffStride: 0,
            buffTexHeight: 0,
            texOffset: {
                x: 0,
                y: 0,
                z: 0,
            },
            texExtent: {
                width: 2,
                height: 2,
                depth: 1,
            },
            texSubres: {
                mipLevel: 0,
                baseArrayLayer: 0,
                layerCount: 1,
            },
        };

        const nullTexBuff = new Uint8Array(this.nullTex2D.size);
        nullTexBuff.fill(0);
        this.copyBuffersToTexture([nullTexBuff], this.nullTex2D, [nullTexRegion]);

        nullTexRegion.texSubres.layerCount = 6;
        this.copyBuffersToTexture(
            [nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff, nullTexBuff],
            this.nullTexCube, [nullTexRegion]);

        return true;
    }

    public destroy (): void {

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

        this._extensions = null;

        this._webGL2RC = null;
    }

    public resize (width: number, height: number) {
        if (this._width !== width || this._height !== height) {
            console.info('Resizing device: ' + width + 'x' + height);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._width = width;
            this._height = height;
        }
    }

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

    public createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer {
        // const ctor = WebGLCommandBuffer; // opt to instant invocation
        const ctor = info.type === GFXCommandBufferType.PRIMARY ? WebGL2PrimaryCommandBuffer : WebGL2CommandBuffer;
        const cmdBuff = new ctor(this);
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        }
        return null!;
    }

    public createBuffer (info: IGFXBufferInfo | IGFXBufferViewInfo): GFXBuffer {
        const buffer = new WebGL2Buffer(this);
        if (buffer.initialize(info)) {
            return buffer;
        }
        return null!;
    }

    public createTexture (info: IGFXTextureInfo | IGFXTextureViewInfo): GFXTexture {
        const texture = new WebGL2Texture(this);
        if (texture.initialize(info)) {
            return texture;
        }
        return null!;
    }

    public createSampler (info: IGFXSamplerInfo): GFXSampler {
        const sampler = new WebGL2Sampler(this);
        if (sampler.initialize(info)) {
            return sampler;
        }
        return null!;
    }

    public createDescriptorSet (info: IGFXDescriptorSetInfo): GFXDescriptorSet {
        const descriptorSet = new WebGL2DescriptorSet(this);
        if (descriptorSet.initialize(info)) {
            return descriptorSet;
        }
        return null!;
    }

    public createShader (info: GFXShaderInfo): GFXShader {
        const shader = new WebGL2Shader(this);
        if (shader.initialize(info)) {
            return shader;
        }
        return null!;
    }

    public createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler {
        const inputAssembler = new WebGL2InputAssembler(this);
        if (inputAssembler.initialize(info)) {
            return inputAssembler;
        }
        return null!;
    }

    public createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass {
        const renderPass = new WebGL2RenderPass(this);
        if (renderPass.initialize(info)) {
            return renderPass;
        }
        return null!;
    }

    public createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer {
        const framebuffer = new WebGL2Framebuffer(this);
        if (framebuffer.initialize(info)) {
            return framebuffer;
        }
        return null!;
    }

    public createDescriptorSetLayout (info: IGFXDescriptorSetLayoutInfo): GFXDescriptorSetLayout {
        const descriptorSetLayout = new WebGL2DescriptorSetLayout(this);
        if (descriptorSetLayout.initialize(info)) {
            return descriptorSetLayout;
        }
        return null!;
    }

    public createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout {
        const pipelineLayout = new WebGL2PipelineLayout(this);
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        }
        return null!;
    }

    public createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState {
        const pipelineState = new WebGL2PipelineState(this);
        if (pipelineState.initialize(info)) {
            return pipelineState;
        }
        return null!;
    }

    public createFence (info: IGFXFenceInfo): GFXFence {
        const fence = new WebGL2Fence(this);
        if (fence.initialize(info)) {
            return fence;
        }
        return null!;
    }

    public createQueue (info: IGFXQueueInfo): GFXQueue {
        const queue = new WebGL2Queue(this);
        if (queue.initialize(info)) {
            return queue;
        }
        return null!;
    }

    public copyBuffersToTexture (buffers: ArrayBufferView[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        WebGL2CmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGL2Texture).gpuTexture,
            regions);
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: GFXTexture,
        regions: GFXBufferTextureCopy[]) {

        WebGL2CmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGL2Texture).gpuTexture,
            regions);
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: GFXFramebuffer,
        dstBuffer: ArrayBuffer,
        regions: GFXBufferTextureCopy[]) {

        const gl = this._webGL2RC as WebGL2RenderingContext;
        const gpuFramebuffer = (srcFramebuffer as WebGL2Framebuffer).gpuFramebuffer;
        const format = gpuFramebuffer.gpuColorTextures[0].format;
        const glFormat = GFXFormatToWebGLFormat(format, gl);
        const glType = GFXFormatToWebGLType(format, gl);
        const ctor = getTypedArrayConstructor(GFXFormatInfos[format]);

        const curFBO = this.stateCache.glFramebuffer;

        if (this.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
            this.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
        }

        const view = new ctor(dstBuffer);

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

    public blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: GFXRect, dstRect: GFXRect, filter: GFXFilter) {
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
                return _ext;
            }
        }
        return null;
    }

    private initStates (gl: WebGL2RenderingContext) {

        gl.activeTexture(gl.TEXTURE0);
        gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // rasteriazer state
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
}
