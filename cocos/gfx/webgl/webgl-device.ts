import { GFXBindingLayout, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXBuffer, IGFXBufferInfo } from '../buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import {
    GFXBufferTextureCopy,
    GFXFormat,
    GFXFormatSize,
    GFXQueueType,
    IGFXRect,
    GFXFilter,
} from '../define';
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
import { WebGLGFXBindingLayout } from './webgl-binding-layout';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGFXCommandAllocator } from './webgl-command-allocator';
import { WebGLGFXCommandBuffer } from './webgl-command-buffer';
import { WebGLCmdFuncCopyBuffersToTexture, WebGLCmdFuncCopyTexImagesToTexture } from './webgl-commands';
import { WebGLGFXFramebuffer } from './webgl-framebuffer';
import { WebGLGFXInputAssembler } from './webgl-input-assembler';
import { WebGLGFXPipelineLayout } from './webgl-pipeline-layout';
import { WebGLGFXPipelineState } from './webgl-pipeline-state';
import { WebGLGFXQueue } from './webgl-queue';
import { WebGLGFXRenderPass } from './webgl-render-pass';
import { WebGLGFXSampler } from './webgl-sampler';
import { WebGLGFXShader } from './webgl-shader';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLGFXTexture } from './webgl-texture';
import { WebGLGFXTextureView } from './webgl-texture-view';
import { WebGLGFXWindow } from './webgl-window';

export class WebGLGFXDevice extends GFXDevice {

    public get gl (): WebGLRenderingContext {
        return this._webGLRC as WebGLRenderingContext;
    }

    public get webGLQueue (): WebGLGFXQueue {
        return this._queue as WebGLGFXQueue;
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

    public get EXT_frag_depth (): EXT_frag_depth | null {
        return this._EXT_frag_depth;
    }

    public get EXT_shader_texture_lod (): EXT_shader_texture_lod | null {
        return this._EXT_shader_texture_lod;
    }

    public get EXT_sRGB (): EXT_sRGB | null {
        return this._EXT_sRGB;
    }

    public get OES_vertex_array_object (): OES_vertex_array_object | null {
        return this._OES_vertex_array_object;
    }

    public get WEBGL_color_buffer_float (): WEBGL_color_buffer_float | null {
        return this._WEBGL_color_buffer_float;
    }

    public get WEBGL_compressed_texture_astc (): WEBGL_compressed_texture_astc | null {
        return this._WEBGL_compressed_texture_astc;
    }

    public get WEBGL_compressed_texture_s3tc (): WEBGL_compressed_texture_s3tc | null {
        return this._WEBGL_compressed_texture_s3tc;
    }

    public get WEBGL_compressed_texture_s3tc_srgb (): WEBGL_compressed_texture_s3tc_srgb | null {
        return this._WEBGL_compressed_texture_s3tc_srgb;
    }

    public get WEBGL_debug_shaders (): WEBGL_debug_shaders | null {
        return this._WEBGL_debug_shaders;
    }

    public get WEBGL_draw_buffers (): WEBGL_draw_buffers | null {
        return this._WEBGL_draw_buffers;
    }

    public get WEBGL_lose_context (): WEBGL_lose_context | null {
        return this._WEBGL_lose_context;
    }

    public get WEBGL_depth_texture (): WEBGL_depth_texture | null {
        return this._WEBGL_depth_texture;
    }

    public get WEBGL_debug_renderer_info (): WEBGL_debug_renderer_info | null {
        return this._WEBGL_debug_renderer_info;
    }

    public get OES_texture_half_float (): OES_texture_half_float | null {
        return this._OES_texture_half_float;
    }

    public get OES_texture_half_float_linear (): OES_texture_half_float_linear | null {
        return this._OES_texture_half_float_linear;
    }

    public get OES_texture_float (): OES_texture_float | null {
        return this._OES_texture_float;
    }

    public get OES_standard_derivatives (): OES_standard_derivatives | null {
        return this._OES_standard_derivatives;
    }

    public get OES_element_index_uint (): OES_element_index_uint | null {
        return this._OES_element_index_uint;
    }

    public get ANGLE_instanced_arrays (): ANGLE_instanced_arrays | null {
        return this._ANGLE_instanced_arrays;
    }

    public stateCache: WebGLStateCache = new WebGLStateCache();

    private _webGLRC: WebGLRenderingContext | null = null;
    private _isAntialias: boolean = true;
    private _isPremultipliedAlpha: boolean = true;
    private _useVAO: boolean = false;
    private _extensions: string[] | null = null;
    private _EXT_texture_filter_anisotropic: EXT_texture_filter_anisotropic | null = null;
    private _EXT_frag_depth: EXT_frag_depth | null = null;
    private _EXT_shader_texture_lod: EXT_shader_texture_lod | null = null;
    private _EXT_sRGB: EXT_sRGB | null = null;
    private _OES_vertex_array_object: OES_vertex_array_object | null = null;
    private _WEBGL_color_buffer_float: WEBGL_color_buffer_float | null = null;
    private _WEBGL_compressed_texture_astc: WEBGL_compressed_texture_astc | null = null;
    private _WEBGL_compressed_texture_s3tc: WEBGL_compressed_texture_s3tc | null = null;
    private _WEBGL_compressed_texture_s3tc_srgb: WEBGL_compressed_texture_s3tc_srgb | null = null;
    private _WEBGL_debug_shaders: WEBGL_debug_shaders | null = null;
    private _WEBGL_draw_buffers: WEBGL_draw_buffers | null = null;
    private _WEBGL_lose_context: WEBGL_lose_context | null = null;
    private _WEBGL_depth_texture: WEBGL_depth_texture | null = null;
    private _WEBGL_debug_renderer_info: WEBGL_debug_renderer_info | null = null;
    private _OES_texture_half_float: OES_texture_half_float | null = null;
    private _OES_texture_half_float_linear: OES_texture_half_float_linear | null = null;
    private _OES_texture_float: OES_texture_float | null = null;
    private _OES_standard_derivatives: OES_standard_derivatives | null = null;
    private _OES_element_index_uint: OES_element_index_uint | null = null;
    private _ANGLE_instanced_arrays: ANGLE_instanced_arrays | null = null;

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

            this._webGLRC = this._canvas.getContext('webgl', webGLCtxAttribs);
        } catch (err) {
            console.error(err);
            return false;
        }

        // No errors are thrown using try catch
        // Tested through ios baidu browser 4.14.1
        if (!this._webGLRC) {
            console.error('This device does not support WebGL.');
            return false;
        }

        this._canvas2D = document.createElement('canvas');

        console.info('WebGL device initialized.');

        this._gfxAPI = GFXAPI.WEBGL;
        this._deviceName = 'WebGL';
        const gl = this._webGLRC;

        this._WEBGL_debug_renderer_info = gl.getExtension('WEBGL_debug_renderer_info');
        if (this._WEBGL_debug_renderer_info) {
            this._renderer = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            this._vendor = gl.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
        } else {
            this._renderer = gl.getParameter(WebGLRenderingContext.RENDERER);
            this._vendor = gl.getParameter(WebGLRenderingContext.VENDOR);
        }

        this._version = gl.getParameter(WebGLRenderingContext.VERSION);
        this._maxVertexAttributes = gl.getParameter(WebGLRenderingContext.MAX_VERTEX_ATTRIBS);
        this._maxVertexUniformVectors = gl.getParameter(WebGLRenderingContext.MAX_VERTEX_UNIFORM_VECTORS);
        this._maxFragmentUniformVectors = gl.getParameter(WebGLRenderingContext.MAX_FRAGMENT_UNIFORM_VECTORS);
        this._maxTextureUnits = gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_IMAGE_UNITS);
        this._maxVertexTextureUnits = gl.getParameter(WebGLRenderingContext.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        this._depthBits = gl.getParameter(WebGLRenderingContext.DEPTH_BITS);
        this._stencilBits = gl.getParameter(WebGLRenderingContext.STENCIL_BITS);

        this._width = this._canvas.width;
        this._height = this._canvas.height;
        this._nativeWidth = Math.max(info.nativeWidth || this._width, 0);
        this._nativeHeight = Math.max(info.nativeHeight || this._height, 0);

        this._colorFmt = GFXFormat.RGBA8;

        if (this._depthBits === 24) {
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
        this._EXT_frag_depth = gl.getExtension('EXT_frag_depth');
        this._EXT_shader_texture_lod = gl.getExtension('EXT_shader_texture_lod');
        this._EXT_sRGB = gl.getExtension('EXT_sRGB');
        this._OES_vertex_array_object = gl.getExtension('OES_vertex_array_object');
        this._WEBGL_color_buffer_float = gl.getExtension('WEBGL_color_buffer_float');
        this._WEBGL_compressed_texture_astc = gl.getExtension('WEBGL_compressed_texture_astc');
        this._WEBGL_compressed_texture_s3tc = gl.getExtension('WEBGL_compressed_texture_s3tc');
        this._WEBGL_compressed_texture_s3tc_srgb = gl.getExtension('WEBGL_compressed_texture_s3tc_srgb');
        this._WEBGL_debug_shaders = gl.getExtension('WEBGL_debug_shaders');
        this._WEBGL_draw_buffers = gl.getExtension('WEBGL_draw_buffers');
        this._WEBGL_lose_context = gl.getExtension('WEBGL_lose_context');
        this._WEBGL_depth_texture = gl.getExtension('WEBGL_depth_texture');
        this._OES_texture_half_float = gl.getExtension('OES_texture_half_float');
        this._OES_texture_half_float_linear = gl.getExtension('OES_texture_half_float_linear');
        this._OES_texture_float = gl.getExtension('OES_texture_float');
        this._OES_standard_derivatives = gl.getExtension('OES_standard_derivatives');
        this._OES_element_index_uint = gl.getExtension('OES_element_index_uint');
        this._ANGLE_instanced_arrays = gl.getExtension('ANGLE_instanced_arrays');

        this._features.fill(false);
        if (this._OES_texture_float) {
            this._features[GFXFeature.TEXTURE_FLOAT] = true;
        }

        if (this._OES_texture_half_float) {
            this._features[GFXFeature.TEXTURE_HALF_FLOAT] = true;
        }

        if (this._WEBGL_depth_texture) {
            this._features[GFXFeature.FORMAT_D24S8] = true;
        }

        this._features[GFXFeature.MSAA] = false;

        if (this._OES_vertex_array_object) {
            this._useVAO = true;
        }

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
        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);
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
            title: this._webGLRC.canvas.title,
            left: this._webGLRC.canvas.offsetLeft,
            top: this._webGLRC.canvas.offsetTop,
            width: this._webGLRC.drawingBufferWidth,
            height: this._webGLRC.drawingBufferHeight,
            colorFmt: this._colorFmt,
            depthStencilFmt: this._depthStencilFmt,
        });

        this._cmdAllocator = this.createCommandAllocator({});

        return true;
    }

    public destroy (): void {

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

        this._webGLRC = null;
    }

    public resize (width: number, height: number) {
        if (this._width !== width && this._height !== height) {
            console.log('RESIZING DEVICE: ' + width + 'x' + height);
            this._canvas!.width = width;
            this._canvas!.height = height;
            this._width = width;
            this._height = height;
        }
    }

    public createBuffer (info: IGFXBufferInfo): GFXBuffer {
        const buffer = new WebGLGFXBuffer(this);
        buffer.initialize(info);
        return buffer;
    }

    public createTexture (info: IGFXTextureInfo): GFXTexture {
        const texture = new WebGLGFXTexture(this);
        texture.initialize(info);
        return texture;
    }

    public createTextureView (info: IGFXTextureViewInfo): GFXTextureView {
        const texView = new WebGLGFXTextureView(this);
        texView.initialize(info);
        return texView;
    }

    public createSampler (info: IGFXSamplerInfo): GFXSampler {
        const sampler = new WebGLGFXSampler(this);
        sampler.initialize(info);
        return sampler;
    }

    public createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout {
        const bindingLayout = new WebGLGFXBindingLayout(this);
        bindingLayout.initialize(info);
        return bindingLayout;
    }

    public createShader (info: IGFXShaderInfo): GFXShader {
        const shader = new WebGLGFXShader(this);
        shader.initialize(info);
        return shader;
    }

    public createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler {
        const inputAssembler = new WebGLGFXInputAssembler(this);
        inputAssembler.initialize(info);
        return inputAssembler;
    }

    public createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass {
        const renderPass = new WebGLGFXRenderPass(this);
        renderPass.initialize(info);
        return renderPass;
    }

    public createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer {
        const framebuffer = new WebGLGFXFramebuffer(this);
        framebuffer.initialize(info);
        return framebuffer;
    }

    public createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout {
        const pipelineLayout = new WebGLGFXPipelineLayout(this);
        pipelineLayout.initialize(info);
        return pipelineLayout;
    }

    public createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState {
        const pipelineState = new WebGLGFXPipelineState(this);
        pipelineState.initialize(info);
        return pipelineState;
    }

    public createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator {
        const cmdAllocator = new WebGLGFXCommandAllocator(this);
        cmdAllocator.initialize(info);
        return cmdAllocator;
    }

    public createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer {
        const cmdBuff = new WebGLGFXCommandBuffer(this);
        cmdBuff.initialize(info);
        return cmdBuff;
    }

    public createQueue (info: IGFXQueueInfo): GFXQueue {
        const queue = new WebGLGFXQueue(this);
        queue.initialize(info);
        return queue;
    }

    public createWindow (info: IGFXWindowInfo): GFXWindow {
        const window = new WebGLGFXWindow(this);
        window.initialize(info);
        return window;
    }

    public present () {
        (this._cmdAllocator as WebGLGFXCommandAllocator).releaseCmds();
    }

    public copyBuffersToTexture (buffers: ArrayBuffer[], texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        WebGLCmdFuncCopyBuffersToTexture(
            this,
            buffers,
            (texture as WebGLGFXTexture).gpuTexture,
            regions);
    }

    public copyTexImagesToTexture (
        texImages: TexImageSource[],
        texture: GFXTexture,
        regions: GFXBufferTextureCopy[]) {

        WebGLCmdFuncCopyTexImagesToTexture(
            this,
            texImages,
            (texture as WebGLGFXTexture).gpuTexture,
            regions);
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: GFXFramebuffer,
        dstBuffer: ArrayBuffer,
        regions: GFXBufferTextureCopy[]) {

        const gl = this._webGLRC!;
        const gpuFramebuffer = (srcFramebuffer as WebGLGFXFramebuffer).gpuFramebuffer;

        const curFBO = this.stateCache.glFramebuffer;

        if (this.stateCache.glFramebuffer !== gpuFramebuffer.glFramebuffer) {
            gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, gpuFramebuffer.glFramebuffer);
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
                WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, data);
        }

        if (this.stateCache.glFramebuffer !== curFBO) {
            gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, curFBO);
            this.stateCache.glFramebuffer = curFBO;
        }
    }

    public blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: IGFXRect, dstRect: IGFXRect, filter: GFXFilter) {
    }

    private initStates (gl: WebGLRenderingContext) {

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
