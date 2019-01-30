import * as WebGLDeveloperTools from 'webgl-debug';
import { GFXBindingLayout, GFXBindingUnit, IGFXBindingLayoutInfo } from '../binding-layout';
import { GFXBuffer, GFXBufferSource, IGFXBufferInfo, IGFXIndirectBuffer } from '../buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from '../command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from '../command-buffer';
import {
    GFXBindingType,
    GFXBufferTextureCopy,
    GFXBufferUsageBit,
    GFXFilter,
    GFXFormat,
    GFXFormatInfos,
    GFXFormatSize,
    GFXQueueType,
    GFXTextureFlagBit,
    GFXTextureType,
    GFXTextureViewType,
} from '../define';
import { GFXDevice, GFXFeature, IGFXDeviceInfo } from '../device';
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
import {
    WebGLCmdFuncCopyBufferToTexture,
    WebGLCmdFuncCreateBuffer,
    WebGLCmdFuncCreateFramebuffer,
    WebGLCmdFuncCreateInputAssember,
    WebGLCmdFuncCreateShader,
    WebGLCmdFuncCreateTexture,
    WebGLCmdFuncDestroyBuffer,
    WebGLCmdFuncDestroyFramebuffer,
    WebGLCmdFuncDestroyShader,
    WebGLCmdFuncDestroyTexture,
    WebGLCmdFuncResizeBuffer,
    WebGLCmdFuncUpdateBuffer,
} from './webgl-commands';
import { WebGLGFXFramebuffer } from './webgl-framebuffer';
import {
    WebGLGPUBinding,
    WebGLGPUBindingLayout,
    WebGLGPUBuffer,
    WebGLGPUFramebuffer,
    WebGLGPUInputAssembler,
    WebGLGPUObjectType,
    WebGLGPUPipelineLayout,
    WebGLGPUPipelineState,
    WebGLGPURenderPass,
    WebGLGPUSampler,
    WebGLGPUShader,
    WebGLGPUShaderStage,
    WebGLGPUTexture,
    WebGLGPUTextureView,
} from './webgl-gpu-objects';
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

const WebGLPrimitives: GLenum[] = [
    WebGLRenderingContext.POINTS,
    WebGLRenderingContext.LINES,
    WebGLRenderingContext.LINE_STRIP,
    WebGLRenderingContext.LINE_LOOP,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.TRIANGLES,
    WebGLRenderingContext.TRIANGLE_STRIP,
    WebGLRenderingContext.TRIANGLE_FAN,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
];

const WebGLWraps: GLenum[] = [
    WebGLRenderingContext.REPEAT,
    WebGLRenderingContext.MIRRORED_REPEAT,
    WebGLRenderingContext.CLAMP_TO_EDGE,
    WebGLRenderingContext.CLAMP_TO_EDGE,
];

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

        if (info.isAntialias) {
            this._isAntialias = info.isAntialias;
        }

        if (info.isPremultipliedAlpha) {
            this._isPremultipliedAlpha = info.isPremultipliedAlpha;
        }

        try {
            const webGLCtxAttribs: WebGLContextAttributes = {
                alpha: true,
                antialias: this._isAntialias,
                depth: true,
                stencil: true,
                premultipliedAlpha: this._isPremultipliedAlpha,
                preserveDrawingBuffer: false,
                powerPreference: 'default',
                failIfMajorPerformanceCaveat: false,
            };

            this._webGLRC = this._canvas.getContext('webgl', webGLCtxAttribs);
            /*
            if (this._webGLRC && info.debug) {
                this._webGLRC = WebGLDeveloperTools.makeDebugContext(this._webGLRC, this._onWebGLError.bind(this));
            }
            */
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

        console.info('RENDERER: ' + this._renderer);
        console.info('VENDOR: ' + this._vendor);
        console.info('VERSION: ' + this._version);
        console.info('SCREEN_SIZE: ' + this._width + ' x ' + this._height);
        console.info('COLOR_FORMAT: ' + GFXFormatInfos[this._colorFmt].name);
        console.info('DEPTH_STENCIL_FORMAT: ' + GFXFormatInfos[this._depthStencilFmt].name);

        console.info('MAX_VERTEX_ATTRIBS: ' + this._maxVertexAttributes);
        console.info('MAX_VERTEX_UNIFORM_VECTORS: ' + this._maxVertexUniformVectors);
        console.info('MAX_FRAGMENT_UNIFORM_VECTORS: ' + this._maxFragmentUniformVectors);
        console.info('MAX_TEXTURE_IMAGE_UNITS: ' + this._maxTextureUnits);
        console.info('MAX_VERTEX_TEXTURE_IMAGE_UNITS: ' + this._maxVertexTextureUnits);
        console.info('DEPTH_BITS: ' + this._depthBits);
        console.info('STENCIL_BITS: ' + this._stencilBits);

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
        this._canvas!.width = width;
        this._canvas!.height = height;
        this._width = width;
        this._height = height;
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

    public copyBufferToTexture (buffer: ArrayBuffer, texture: GFXTexture, regions: GFXBufferTextureCopy[]) {
        WebGLCmdFuncCopyBufferToTexture(
            this,
            buffer,
            (texture as WebGLGFXTexture).gpuTexture,
            regions);
    }

    public copyImageSourceToTexture (source: CanvasImageSource, texture: GFXTexture, regions: GFXBufferTextureCopy[]) {

        if (this._canvas2D) {
            const context = this._canvas2D.getContext('2d');

            if (context) {
                this._canvas2D.width = texture.width;
                this._canvas2D.height = texture.height;
                context.drawImage(source, 0, 0);

                const imgData = context.getImageData(0, 0, this._canvas2D.width, this._canvas2D.height);
                WebGLCmdFuncCopyBufferToTexture(
                    this,
                    imgData.data,
                    (texture as WebGLGFXTexture).gpuTexture,
                    regions);
            }
        }
    }

    public copyFramebufferToBuffer (
        srcFramebuffer: GFXFramebuffer,
        dstBuffer: ArrayBuffer,
        regions: GFXBufferTextureCopy[]) {

        const gl = this._webGLRC as WebGLRenderingContext;
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

    public emitCmdCreateGPUBuffer (info: IGFXBufferInfo, buffer: GFXBufferSource | null): WebGLGPUBuffer | null {

        const gpuBuffer: WebGLGPUBuffer = {
            objType: WebGLGPUObjectType.BUFFER,
            usage: info.usage,
            memUsage: info.memUsage,
            size: info.size,
            stride: info.stride ? info.stride : 1,
            buffer: null,
            vf32: null,
            uniforms: [],
            indirects: [],
            glTarget: 0,
            glBuffer: 0,
        };

        if (buffer) {
            if (info.usage & GFXBufferUsageBit.INDIRECT) {
                gpuBuffer.indirects = (buffer as IGFXIndirectBuffer).drawInfos;
            } else {
                gpuBuffer.buffer = buffer as ArrayBuffer;
            }
        }

        // let isUBOSimulate = (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) !== GFXBufferUsageBit.NONE;
        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncCreateBuffer(this as WebGLGFXDevice, gpuBuffer);

        return gpuBuffer;
    }

    public emitCmdDestroyGPUBuffer (gpuBuffer: WebGLGPUBuffer) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncDestroyBuffer(this, gpuBuffer);
    }

    public emitCmdResizeGPUBuffer (gpuBuffer: WebGLGPUBuffer, buffer: GFXBufferSource | null) {

        if (buffer) {
            if ((gpuBuffer.usage & GFXBufferUsageBit.INDIRECT) === GFXBufferUsageBit.NONE) {
                gpuBuffer.buffer = buffer as ArrayBuffer;
                gpuBuffer.size = gpuBuffer.buffer.byteLength;
            }
        }

        // TODO: Async
        WebGLCmdFuncResizeBuffer(this, gpuBuffer);
    }

    public emitCmdUpdateGPUBuffer (gpuBuffer: WebGLGPUBuffer, buffer: GFXBufferSource, offset: number, size: number) {
        // TODO: Async
        const isStagingBuffer = (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) !== GFXBufferUsageBit.NONE;
        if (!isStagingBuffer) {
            WebGLCmdFuncUpdateBuffer(this, gpuBuffer, buffer, offset, size);
        }
    }

    public emitCmdCreateGPUTexture (info: IGFXTextureInfo): WebGLGPUTexture {

        let viewType: GFXTextureViewType;

        switch (info.type) {
            case GFXTextureType.TEX1D: {

                if (info.arrayLayer) {
                    viewType = info.arrayLayer <= 1 ? GFXTextureViewType.TV1D : GFXTextureViewType.TV1D_ARRAY;
                } else {
                    viewType = GFXTextureViewType.TV1D;
                }

                break;
            }
            case GFXTextureType.TEX2D: {
                let flags = GFXTextureFlagBit.NONE;
                if (info.flags) {
                    flags = info.flags;
                }

                if (info.arrayLayer) {
                    if (info.arrayLayer <= 1) {
                        viewType = GFXTextureViewType.TV2D;
                    } else if (info.arrayLayer === 6 && (flags & GFXTextureFlagBit.CUBEMAP)) {
                        viewType = GFXTextureViewType.CUBE;
                    } else {
                        viewType = GFXTextureViewType.TV2D_ARRAY;
                    }
                } else {
                    viewType = GFXTextureViewType.TV2D;
                }

                break;
            }
            case GFXTextureType.TEX3D: {
                viewType = GFXTextureViewType.TV3D;
                break;
            }
            default: {
                viewType = GFXTextureViewType.TV2D;
            }
        }

        const gpuTexture: WebGLGPUTexture = {
            objType: WebGLGPUObjectType.TEXTURE,
            type: info.type,
            viewType,
            format: info.format,
            usage: info.usage,
            width: info.width,
            height: info.height,
            depth: info.depth ? info.depth : 1,
            arrayLayer: info.arrayLayer ? info.arrayLayer : 1,
            mipLevel: info.mipLevel ? info.mipLevel : 1,
            flags: info.flags ? info.flags : GFXTextureFlagBit.NONE,

            glTarget: 0,
            glInternelFmt: 0,
            glFormat: 0,
            glType: 0,
            glUsage: 0,
            glTexture: 0,
            glWrapS: 0,
            glWrapT: 0,
            glMinFilter: 0,
            glMagFilter: 0,
        };

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncCreateTexture(this, gpuTexture);

        return gpuTexture;
    }

    public emitCmdDestroyGPUTexture (gpuTexture: WebGLGPUTexture) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncDestroyTexture(this, gpuTexture);
    }

    public emitCmdCreateGPUTextureView (info: IGFXTextureViewInfo): WebGLGPUTextureView {
        const webGLTexture = info.texture as WebGLGFXTexture;

        const gpuTextureView: WebGLGPUTextureView = {
            objType: WebGLGPUObjectType.TEXTURE_VIEW,
            gpuTexture: webGLTexture.gpuTexture,
            type: info.type,
            format: info.format,
            baseLevel: info.baseLevel ? info.baseLevel : 0,
            levelCount: info.levelCount ? info.levelCount : 1,
        };

        return gpuTextureView;
    }

    public emitCmdDestroyGPUTextureView (gpuTextureView: WebGLGPUTextureView) {
    }

    public emitCmdCreateGPURenderPass (info: IGFXRenderPassInfo): WebGLGPURenderPass {
        const gpuRenderPass: WebGLGPURenderPass = {
            objType: WebGLGPUObjectType.RENDER_PASS,
            colorAttachments: info.colorAttachments ? info.colorAttachments : [],
            depthStencilAttachment: info.depthStencilAttachment ? info.depthStencilAttachment : null,
        };

        return gpuRenderPass;
    }

    public emitCmdDestroyGPURenderPass (gpuRenderPass: WebGLGPURenderPass) {
    }

    public emitCmdCreateGPUFramebuffer (info: IGFXFramebufferInfo): WebGLGPUFramebuffer {

        const renderPass = info.renderPass as WebGLGFXRenderPass;

        const isOffscreen = info.isOffscreen !== undefined ? info.isOffscreen : true;
        if (isOffscreen) {

            const gpuColorViews: WebGLGPUTextureView[] = [];

            if (info.colorViews) {
                for (const colorView of info.colorViews) {
                    const webGLColorView = colorView as WebGLGFXTextureView;
                    gpuColorViews.push(webGLColorView.gpuTextureView);
                }
            }

            let gpuDepthStencilView: WebGLGPUTextureView | null = null;

            if (info.depthStencilView) {
                gpuDepthStencilView = (info.depthStencilView as WebGLGFXTextureView).gpuTextureView;
            }

            const gpuFramebuffer: WebGLGPUFramebuffer = {
                objType: WebGLGPUObjectType.FRAMEBUFFER,
                gpuRenderPass: renderPass.gpuRenderPass,
                gpuColorViews,
                gpuDepthStencilView,
                isOffscreen: info.isOffscreen,
                glFramebuffer: 0,
            };

            // TODO: Async
            WebGLCmdFuncCreateFramebuffer(this, gpuFramebuffer);

            return gpuFramebuffer;

        } else {
            const gpuFramebuffer: WebGLGPUFramebuffer = {
                objType: WebGLGPUObjectType.FRAMEBUFFER,
                gpuRenderPass: renderPass.gpuRenderPass,
                gpuColorViews: [],
                gpuDepthStencilView: null,
                isOffscreen: info.isOffscreen,
                glFramebuffer: 0,
            };

            return gpuFramebuffer;
        }
    }

    public emitCmdDestroyGPUFramebuffer (gpuFramebuffer: WebGLGPUFramebuffer) {
        if (gpuFramebuffer.isOffscreen) {
            // TODO: Async
            WebGLCmdFuncDestroyFramebuffer(this, gpuFramebuffer);
        }
    }

    public emitCmdCreateGPUSampler (info: IGFXSamplerInfo): WebGLGPUSampler {

        let glMinFilter = WebGLRenderingContext.NONE;
        let glMagFilter = WebGLRenderingContext.NONE;

        const minFilter = (info.minFilter !== undefined ? info.minFilter : GFXFilter.LINEAR);
        const magFilter = (info.magFilter !== undefined ? info.magFilter : GFXFilter.LINEAR);
        const mipFilter = (info.mipFilter !== undefined ? info.mipFilter : GFXFilter.NONE);

        if (minFilter === GFXFilter.LINEAR || minFilter === GFXFilter.ANISOTROPIC) {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.LINEAR;
            }
        } else {
            if (mipFilter === GFXFilter.LINEAR || mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
            } else if (mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.NEAREST;
            }
        }

        if (magFilter === GFXFilter.LINEAR || magFilter === GFXFilter.ANISOTROPIC) {
            glMagFilter = WebGLRenderingContext.LINEAR;
        } else {
            glMagFilter = WebGLRenderingContext.NEAREST;
        }

        const glWrapS = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.REPEAT);
        const glWrapT = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.REPEAT);
        const glWrapR = (info.addressU !== undefined ? WebGLWraps[info.addressU] : WebGLRenderingContext.REPEAT);

        const gpuSampler: WebGLGPUSampler = {
            objType: WebGLGPUObjectType.SAMPLER,

            glMinFilter,
            glMagFilter,
            glWrapS,
            glWrapT,
            glWrapR,
        };

        return gpuSampler;
    }

    public emitCmdDestroyGPUSampler (gpuSampler: WebGLGPUSampler) {
        // TODO: Async
    }

    public emitCmdCreateGPUShader (info: IGFXShaderInfo): WebGLGPUShader {

        const gpuStages: WebGLGPUShaderStage[] = new Array<WebGLGPUShaderStage>(info.stages.length);

        for (let i = 0; i < info.stages.length; ++i) {
            const stage = info.stages[i];
            gpuStages[i] = {
                type: stage.type,
                source: stage.source,
                macros: stage.macros ? stage.macros : [],
                glShader: 0,
            };
        }

        const gpuShader: WebGLGPUShader = {
            objType: WebGLGPUObjectType.SHADER,
            name: info.name ? info.name : '',
            blocks: (info.blocks !== undefined ? info.blocks : []),
            samplers: (info.samplers !== undefined ? info.samplers : []),

            gpuStages,
            glProgram: 0,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplers: [],
        };

        // TODO: Async
        WebGLCmdFuncCreateShader(this, gpuShader);

        return gpuShader;
    }

    public emitCmdDestroyGPUShader (gpuShader: WebGLGPUShader) {
        // TODO: Async
        WebGLCmdFuncDestroyShader(this, gpuShader);
    }

    public emitCmdCreateGPUPipelineState (info: IGFXPipelineStateInfo): WebGLGPUPipelineState {

        let gpuShader: WebGLGPUShader | null = null;
        if (info.shader) {
            gpuShader = (info.shader as WebGLGFXShader).gpuShader;
        }

        let gpuLayout: WebGLGPUPipelineLayout | null = null;
        if (info.layout) {
            gpuLayout = (info.layout as WebGLGFXPipelineLayout).gpuPipelineLayout;
        }

        let gpuRenderPass: WebGLGPURenderPass | null = null;
        if (info.renderPass) {
            gpuRenderPass = (info.renderPass as WebGLGFXRenderPass).gpuRenderPass;
        }

        const gpuPipelineState: WebGLGPUPipelineState = {
            objType: WebGLGPUObjectType.PIPELINE_STATE,
            glPrimitive: WebGLPrimitives[info.primitive],
            gpuShader,
            rs: info.rs,
            dss: info.dss,
            bs: info.bs,
            dynamicStates: (info.dynamicStates !== undefined ? info.dynamicStates : []),
            gpuLayout,
            gpuRenderPass,
        };

        return gpuPipelineState;
    }

    public emitCmdDestroyGPUPipelineState (gpuPipelineState: WebGLGPUPipelineState) {
        // TODO: Async
    }

    public emitCmdCreateGPUBindingLayout (info: IGFXBindingLayoutInfo): WebGLGPUBindingLayout {

        const gpuBindings: WebGLGPUBinding[] = new Array<WebGLGPUBinding>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            const binding = info.bindings[i];
            gpuBindings[i] = {
                binding: binding.binding,
                type: binding.type,
                name: binding.name,
                gpuBuffer: null,
                gpuTexView: null,
                gpuSampler: null,
            };
        }

        const gpuBindingLayout: WebGLGPUBindingLayout = {
            objType: WebGLGPUObjectType.BINDING_LAYOUT,
            gpuBindings,
        };

        return gpuBindingLayout;
    }

    public emitCmdDestroyGPUBindingLayout (gpuBindingLayout: WebGLGPUBindingLayout) {
        // TODO: Async
    }

    public emitCmdUpdateGPUBindingLayout (gpuBindingLayout: WebGLGPUBindingLayout, bindingUnits: GFXBindingUnit[]) {

        // TODO: Async
        for (let i = 0; i < bindingUnits.length; ++i) {
            const bindingUnit = bindingUnits[i];
            const gpuBinding = gpuBindingLayout.gpuBindings[i];
            gpuBinding.binding = bindingUnit.binding;
            gpuBinding.type = bindingUnit.type;
            gpuBinding.name = bindingUnit.name;

            switch (bindingUnit.type) {
                case GFXBindingType.UNIFORM_BUFFER: {
                    if (bindingUnit.buffer) {
                        gpuBinding.gpuBuffer = (bindingUnit.buffer as WebGLGFXBuffer).gpuBuffer;
                    }
                    break;
                }
                case GFXBindingType.SAMPLER: {
                    if (bindingUnit.texView) {
                        gpuBinding.gpuTexView = (bindingUnit.texView as WebGLGFXTextureView).gpuTextureView;
                    }

                    if (bindingUnit.sampler) {
                        gpuBinding.gpuSampler = (bindingUnit.sampler as WebGLGFXSampler).gpuSampler;
                    }
                    break;
                }
                default:
            }
        }
    }

    public emitCmdCreateGPUInputAssembler (info: IGFXInputAssemblerInfo): WebGLGPUInputAssembler {

        const gpuVertexBuffers: WebGLGPUBuffer[] = new Array<WebGLGPUBuffer>(info.vertexBuffers.length);

        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGLGFXBuffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: WebGLGPUBuffer | null = null;

        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGLGFXBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = WebGLRenderingContext.UNSIGNED_BYTE; break;
                    case 2: glIndexType = WebGLRenderingContext.UNSIGNED_SHORT; break;
                    case 4: glIndexType = WebGLRenderingContext.UNSIGNED_INT; break;
                    default: {
                        console.error('Error index buffer stride.');
                    }
                }
            }
        }

        let gpuIndirectBuffer: WebGLGPUBuffer | null = null;

        if (info.indirectBuffer !== undefined) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGLGFXBuffer).gpuBuffer;
        }

        const gpuInputAssembler: WebGLGPUInputAssembler = {
            objType: WebGLGPUObjectType.INPUT_ASSEMBLER,
            attributes: info.attributes,
            gpuVertexBuffers,
            gpuIndexBuffer,
            gpuIndirectBuffer,

            glAttribs: [],
            glIndexType,
            glVAO: 0,
        };

        WebGLCmdFuncCreateInputAssember(this as WebGLGFXDevice, gpuInputAssembler);

        // TODO: Async
        return gpuInputAssembler;
    }

    public emitCmdDestroyGPUInputAssembler (gpuInputAssembler: WebGLGPUInputAssembler) {
        // TODO: Async
        // WebGLCmdFuncDestroyInputAssembler(<WebGLGFXDevice>this, gpuInputAssembler);
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

    private _onWebGLError (error: GLenum, functionName: string, ...args: any[]) {
        throw new Error(`${WebGLDeveloperTools.glEnumToString(error)} was caused by call to ${functionName}`);
    }
}
