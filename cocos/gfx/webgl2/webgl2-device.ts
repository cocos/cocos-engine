import { GFXBindingLayout, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import { GFXBufferTextureCopy, GFXFilter, GFXFormat, GFXFormatInfos, GFXFormatSize, GFXQueueType, IGFXRect, GFXTextureType, GFXTextureUsageBit, GFXTextureFlagBit, GFXTextureViewType } from '../define';
import { GFXAPI, GFXDevice, GFXFeature, IGFXDeviceInfo } from '../device';
import { GFXFramebuffer, IGFXFramebufferInfo } from '../framebuffer';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { GFXPipelineState, IGFXPipelineStateInfo } from '../pipeline-state';
import { GFXQueue, IGFXQueueInfo } from '../queue';
import { GFXRenderPass, IGFXRenderPassInfo } from '../render-pass';
import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { GFXShader, IGFXShaderInfo } from '../shader';
import { GFXTexture, IGFXTextureInfo } from '../texture';
import { GFXTextureView, IGFXTextureViewInfo } from '../texture-view';
import { GFXWindow, IGFXWindowInfo } from '../window';
import { WebGL2GFXBindingLayout } from './webgl2-binding-layout';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2GFXCommandAllocator } from './webgl2-command-allocator';
import { WebGL2GFXCommandBuffer } from './webgl2-command-buffer';
import { WebGL2CmdFuncBlitFramebuffer, WebGL2CmdFuncCopyBuffersToTexture, WebGL2CmdFuncCopyTexImagesToTexture } from './webgl2-commands';
import { WebGL2GFXFramebuffer } from './webgl2-framebuffer';
import { WebGL2GFXInputAssembler } from './webgl2-input-assembler';
import { WebGL2GFXPipelineLayout } from './webgl2-pipeline-layout';
import { WebGL2GFXPipelineState } from './webgl2-pipeline-state';
import { WebGL2GFXQueue } from './webgl2-queue';
import { WebGL2GFXRenderPass } from './webgl2-render-pass';
import { WebGL2GFXSampler } from './webgl2-sampler';
import { WebGL2GFXShader } from './webgl2-shader';
import { WebGL2StateCache } from './webgl2-state-cache';
import { WebGL2GFXTexture } from './webgl2-texture';
import { WebGL2GFXTextureView } from './webgl2-texture-view';
import { WebGL2GFXWindow } from './webgl2-window';

export class WebGL2GFXDevice extends GFXDevice {

    public get gl (): WebGL2RenderingContext {
        return this._webGL2RC as WebGL2RenderingContext;
    }

    public get isAntialias (): boolean {
        return this._isAntialias;
    }

    public get isPremultipliedAlpha (): boolean {
        return this._isPremultipliedAlpha;
    }

    public get useVAO (): boolean {
        return this._useVAO;
    }

    public get EXT_texture_filter_anisotropic (): EXT_texture_filter_anisotropic | null {
        return this._EXT_texture_filter_anisotropic;
    }

    public get OES_texture_float_linear (): OES_texture_float_linear | null {
        return this._OES_texture_float_linear;
    }

    public get EXT_color_buffer_float (): EXT_color_buffer_float | null {
        return this._EXT_color_buffer_float;
    }

    public get EXT_disjoint_timer_query_webgl2 (): EXT_disjoint_timer_query_webgl2 | null {
        return this._EXT_disjoint_timer_query_webgl2;
    }

    public get WEBGL_compressed_texture_s3tc (): WEBGL_compressed_texture_s3tc | null {
        return this._WEBGL_compressed_texture_s3tc;
    }

    public get WEBGL_compressed_texture_s3tc_srgb (): WEBGL_compressed_texture_s3tc_srgb | null {
        return this._WEBGL_compressed_texture_s3tc_srgb;
    }

    public stateCache: WebGL2StateCache = new WebGL2StateCache();
    public nullTex2D: WebGL2GFXTexture | null = null;
    public nullTexCube: WebGL2GFXTexture | null = null;

    private _webGL2RC: WebGL2RenderingContext | null = null;
    private _isAntialias: boolean = true;
    private _isPremultipliedAlpha: boolean = true;
    private _useVAO: boolean = true;

    private _extensions: string[] | null = null;
    private _EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null = null;
    private _OES_texture_float_linear: OES_texture_float_linear | null = null;
    private _EXT_color_buffer_float: EXT_color_buffer_float | null = null;
    private _EXT_disjoint_timer_query_webgl2: EXT_disjoint_timer_query_webgl2 | null = null;
    private _WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null = null;
    private _WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null = null;
    private _WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null = null;
    private _WEBGL_texture_storage_multisample: WEBGL_texture_storage_multisample | null = null;
    private _WEBGL_debug_shaders: WEBGL_debug_shaders | null = null;
    private _WEBGL_lose_context: WEBGL_lose_context | null = null;

    constructor () {
        super();
    }

    public initialize (info: IGFXDeviceInfo): boolean {

        this._canvas = info.canvasElm as HTMLCanvasElement;
        this._isAntialias = info.isAntialias !== undefined ? info.isAntialias : true;
        this._isPremultipliedAlpha = info.isPremultipliedAlpha !== undefined ? info.isPremultipliedAlpha : true;

        try {
            const webGLCtxAttribs: WebGLContextAttributes = {
                alpha: true,
                antialias: false,
                // antialias: this._isAntialias,
                depth: true,
                stencil: true,
                premultipliedAlpha: this._isPremultipliedAlpha,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
            };

            this._webGL2RC = this._canvas.getContext('webgl2', webGLCtxAttribs);
        } catch (err) {
            console.error(err);
            return false;
        }

        // No errors are thrown using try catch
        // Tested through ios baidu browser 4.14.1
        if (!this._webGL2RC) {
            console.error('This device does not support WebGL2.');
            return false;
        }

        this._canvas2D = document.createElement('canvas');

        console.info('WebGL2 device initialized.');

        this._gfxAPI = GFXAPI.WEBGL2;
        this._deviceName = 'WebGL2';
        const gl = this._webGL2RC;

        this._WEBGL_debug_renderer_info = gl.getExtension('WEBGL_debug_renderer_info');
        if (this._WEBGL_debug_renderer_info) {
            this._renderer = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            this._vendor = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
            this._renderer = gl.getParameter(WebGL2RenderingContext.RENDERER);
            this._vendor = gl.getParameter(WebGL2RenderingContext.VENDOR);
        }

        this._version = gl.getParameter(WebGL2RenderingContext.VERSION);
        this._maxVertexAttributes = gl.getParameter(WebGL2RenderingContext.MAX_VERTEX_ATTRIBS);
        this._maxVertexUniformVectors = gl.getParameter(WebGL2RenderingContext.MAX_VERTEX_UNIFORM_VECTORS);
        this._maxFragmentUniformVectors = gl.getParameter(WebGL2RenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._maxTextureUnits = gl.getParameter(WebGL2RenderingContext.MAX_TEXTURE_IMAGE_UNITS);
        this._maxVertexTextureUnits = gl.getParameter(WebGL2RenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._maxUniformBufferBindings = gl.getParameter(WebGL2RenderingContext.MAX_UNIFORM_BUFFER_BINDINGS);
        this._maxUniformBlockSize = gl.getParameter(WebGL2RenderingContext.MAX_UNIFORM_BLOCK_SIZE);
        this._maxCombinedUniformBlocks = gl.getParameter(WebGL2RenderingContext.MAX_COMBINED_UNIFORM_BLOCKS);
        this._depthBits = gl.getParameter(WebGL2RenderingContext.DEPTH_BITS);
        this._stencilBits = gl.getParameter(WebGL2RenderingContext.STENCIL_BITS);
        // let maxVertexUniformBlocks = gl.getParameter(WebGL2RenderingContext.MAX_VERTEX_UNIFORM_BLOCKS);
        // let maxFragmentUniformBlocks = gl.getParameter(WebGL2RenderingContext.MAX_FRAGMENT_UNIFORM_BLOCKS);
        // let uboOffsetAlignment = gl.getParameter(WebGL2RenderingContext.UNIFORM_BUFFER_OFFSET_ALIGNMENT);

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
        /*
        if (this._extensions) {
            for (let i = 0; i < this._extensions.length; ++i) {
                console.info(this._extensions[i]);
            }
        }
        */

        this._EXT_texture_filter_anisotropic = gl.getExtension('EXT_texture_filter_anisotropic');
        this._EXT_color_buffer_float = gl.getExtension('EXT_color_buffer_float');
        this._EXT_disjoint_timer_query_webgl2 = gl.getExtension('EXT_disjoint_timer_query_webgl2');
        this._OES_texture_float_linear = gl.getExtension('OES_texture_float_linear');
        this._WEBGL_compressed_texture_s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc');
        this._WEBGL_compressed_texture_s3tc_srgb = gl.getExtension('WEBGL_compressed_texture_s3tc_srgb');
        this._WEBGL_texture_storage_multisample = gl.getExtension('WEBGL_texture_storage_multisample');
        this._WEBGL_debug_shaders = gl.getExtension('WEBGL_debug_shaders');
        this._WEBGL_lose_context = gl.getExtension('WEBGL_lose_context');

        this._features.fill(false);
        this._features[GFXFeature.TEXTURE_FLOAT] = true;
        this._features[GFXFeature.TEXTURE_HALF_FLOAT] = true;
        this._features[GFXFeature.FORMAT_R11G11B10F] = true;
        this._features[GFXFeature.FORMAT_D24S8] = true;
        this._features[GFXFeature.MSAA] = true;

        console.info('RENDERER: ' + this._renderer);
        console.info('VENDOR: ' + this._vendor);
        console.info('VERSION: ' + this._version);
        console.info('SCREEN_SIZE: ' + this._width + ' x ' + this._height);
        console.info('NATIVE_SIZE: ' + this._nativeWidth + ' x ' + this._nativeHeight);
        // console.info('COLOR_FORMAT: ' + GFXFormatInfos[this._colorFmt].name);
        // console.info('DEPTH_STENCIL_FORMAT: ' + GFXFormatInfos[this._depthStencilFmt].name);
        // console.info('MAX_VERTEX_ATTRIBS: ' + this._maxVertexAttributes);
        console.info('MAX_VERTEX_UNIFORM_VECTORS: ' + this._maxVertexUniformVectors);
        console.info('MAX_FRAGMENT_UNIFORM_VECTORS: ' + this._maxFragmentUniformVectors);
        // console.info('MAX_TEXTURE_IMAGE_UNITS: ' + this._maxTextureUnits);
        // console.info('MAX_VERTEX_TEXTURE_IMAGE_UNITS: ' + this._maxVertexTextureUnits);
        console.info('MAX_UNIFORM_BUFFER_BINDINGS: ' + this._maxUniformBufferBindings);
        // console.info('MAX_UNIFORM_BLOCK_SIZE: ' + this._maxUniformBlockSize);
        // console.info('MAX_COMBINED_UNIFORM_BLOCKS: ' + this._maxCombinedUniformBlocks);
        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);
        // console.info('UNIFORM_BUFFER_OFFSET_ALIGNMENT: ' + uboOffsetAlignment);
        if (this._EXT_texture_filter_anisotropic) {
            console.info('MAX_TEXTURE_MAX_ANISOTROPY_EXT: ' + this._EXT_texture_filter_anisotropic.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
        }
        console.info('USE_VAO: ' + this._useVAO);

        // init states
        this.initStates(gl);

        // create queue
        this._queue = this.createQueue({ type: GFXQueueType.GRAPHICS });

        // create primary window
        this._mainWindow = this.createWindow({
            title: this._webGL2RC.canvas.title,
            left: this._webGL2RC.canvas.offsetLeft,
            top: this._webGL2RC.canvas.offsetTop,
            width: this._webGL2RC.drawingBufferWidth,
            height: this._webGL2RC.drawingBufferHeight,
            colorFmt: this._colorFmt,
            depthStencilFmt: this._depthStencilFmt,
        });

        this._cmdAllocator = this.createCommandAllocator({});

        this.nullTex2D = new WebGL2GFXTexture(this);
        this.nullTex2D.initialize({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: 2,
            height: 2,
        });

        this.nullTexCube = new WebGL2GFXTexture(this);
        this.nullTexCube.initialize({
            type: GFXTextureType.TEX2D,
            usage: GFXTextureUsageBit.SAMPLED,
            format: GFXFormat.RGBA8,
            width: 2,
            height: 2,
            arrayLayer: 6,
            flags: GFXTextureFlagBit.CUBEMAP,
        });

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

        if (this._mainWindow) {
            this._mainWindow.destroy();
            this._mainWindow = null;
        }

        if (this._cmdAllocator) {
            this._cmdAllocator.destroy();
            this._cmdAllocator = null;
        }

        if (this._queue) {
            this._queue.destroy();
            this._queue = null;
        }

        this._webGL2RC = null;
    }

    public resize (width: number, height: number) {
        if (this._width !== width || this._height !== height) {
            console.log('RESIZING DEVICE: ' + width + 'x' + height);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._width = width;
            this._height = height;
        }
    }

    public createBuffer (info: IGFXBufferInfo): GFXBuffer {
        const buffer = new WebGL2GFXBuffer(this);
        buffer.initialize(info);
        return buffer;
    }

    public createTexture (info: IGFXTextureInfo): GFXTexture {
        const texture = new WebGL2GFXTexture(this);
        texture.initialize(info);
        return texture;
    }

    public createTextureView (info: IGFXTextureViewInfo): GFXTextureView {
        const texView = new WebGL2GFXTextureView(this);
        texView.initialize(info);
        return texView;
    }

    public createSampler (info: IGFXSamplerInfo): GFXSampler {
        const sampler = new WebGL2GFXSampler(this);
        sampler.initialize(info);
        return sampler;
    }

    public createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout {
        const bindingLayout = new WebGL2GFXBindingLayout(this);
        bindingLayout.initialize(info);
        return bindingLayout;
    }

    public createShader (info: IGFXShaderInfo): GFXShader {
        const shader = new WebGL2GFXShader(this);
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler {
        const inputAssembler = new WebGL2GFXInputAssembler(this);
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass {
        const renderPass = new WebGL2GFXRenderPass(this);
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer {
        const framebuffer = new WebGL2GFXFramebuffer(this);
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout {
        const pipelineLayout = new WebGL2GFXPipelineLayout(this);
        pipelineLayout.initialize(info);
        return pipelineLayout;
    }

    public createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState {
        const pipelineState = new WebGL2GFXPipelineState(this);
        pipelineState.initialize(info);
        return pipelineState;
    }

    public createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator {
        const cmdAllocator = new WebGL2GFXCommandAllocator(this);
        cmdAllocator.initialize(info);
        return cmdAllocator;
    }

    public createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer {
        const cmdBuff = new WebGL2GFXCommandBuffer(this);
        cmdBuff.initialize(info);
        return cmdBuff;
    }

    public createQueue (info: IGFXQueueInfo): GFXQueue {
        const queue = new WebGL2GFXQueue(this);
        queue.initialize(info);
        return queue;
    }

    public createWindow (info: IGFXWindowInfo): GFXWindow {
        const window = new WebGL2GFXWindow(this);
        window.initialize(info);
        return window;
    }

    public present () {
        (this._cmdAllocator as WebGL2GFXCommandAllocator).releaseCmds();
    }

    public copyBuffersToTexture (buffers: ArrayBuffer[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        WebGL2CmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGL2GFXTexture).gpuTexture,
            regions);
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: GFXTexture,
        regions: GFXBufferTextureCopy[]) {

        WebGL2CmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGL2GFXTexture).gpuTexture,
            regions);
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: GFXFramebuffer,
        dstBuffer: ArrayBuffer,
        regions: GFXBufferTextureCopy[]) {

        const gl = this._webGL2RC!;
        const gpuFramebuffer = (srcFramebuffer as WebGL2GFXFramebuffer).gpuFramebuffer;

        const curFBO = this.stateCache.glFramebuffer;

        if (this.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
            this.stateCache.glFramebuffer = gpuFramebuffer.glFramebuffer;
        }

        const view = new Uint8Array(dstBuffer);

        for (const region of regions) {
            const buffOffset = region.buffOffset + region.buffTexHeight * region.buffStride;

            const w = region.texExtent.width;
            const h = region.texExtent.height;

            const memSize = GFXFormatSize(GFXFormat.RGBA8, w, h, 1);
            const data = view.subarray(buffOffset, buffOffset + memSize);

            gl.readPixels(region.texOffset.x, region.texOffset.y, w, h,
                WebGL2RenderingContext.RGBA, WebGL2RenderingContext.UNSIGNED_BYTE, data);
        }

        if (this.stateCache.glFramebuffer !== curFBO) {
            gl.bindFramebuffer(WebGL2RenderingContext.FRAMEBUFFER, curFBO);
            this.stateCache.glFramebuffer = curFBO;
        }
    }

    public blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: IGFXRect, dstRect: IGFXRect, filter: GFXFilter) {
        const srcFBO = (src as WebGL2GFXFramebuffer).gpuFramebuffer;
        const dstFBO = (dst as WebGL2GFXFramebuffer).gpuFramebuffer;

        WebGL2CmdFuncBlitFramebuffer(
            this,
            srcFBO,
            dstFBO,
            srcRect,
            dstRect,
            filter,
        );
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

        gl.stencilFuncSeparate(gl.FRONT, gl.ALWAYS, 1, 0xffffffff);
        gl.stencilOpSeparate(gl.FRONT, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.FRONT, 0xffffffff);
        gl.stencilFuncSeparate(gl.BACK, gl.ALWAYS, 1, 0xffffffff);
        gl.stencilOpSeparate(gl.BACK, gl.KEEP, gl.KEEP, gl.KEEP);
        gl.stencilMaskSeparate(gl.BACK, 0xffffffff);

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
