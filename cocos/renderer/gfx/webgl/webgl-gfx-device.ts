import { GFXDeviceInfo, GFXDevice } from '../gfx-device';
import { GFXBuffer, GFXBufferInfo, GFXBufferUsageBit } from '../gfx-buffer';
import { WebGLGFXBuffer } from './webgl-gfx-buffer';
import { WebGLGFXQueue } from './webgl-gfx-queue';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLGPUBuffer, WebGLGPUObjectType, WebGLGPUTexture, WebGLGPURenderPass, WebGLGPUFramebuffer, WebGLGPUTextureView, WebGLGPUShader, WebGLGPUShaderStage, WebGLGPUSampler, WebGLGPUInputAssembler, WebGLGPUPipelineState, WebGLGPUPipelineLayout, WebGLGPUBindingLayout as WebGLGPUBindingLayout, WebGLGPUBinding } from './webgl-gpu-objects';
import { WebGLCmdFuncUpdateBuffer, WebGLCmdFuncDestroyBuffer, WebGLCmdFuncCreateBuffer, WebGLCmdFuncDestroyTexture, WebGLCmdFuncCreateTexture, WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer, WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader, WebGLCmdFuncCreateInputAssember } from './webgl-commands';
import { GFXTextureInfo, GFXTextureType, GFXTextureFlagBit, GFXTexture } from '../gfx-texture';
import { GFXTextureViewType, GFXTextureViewInfo, GFXTextureView } from '../gfx-texture-view';
import { GFXRenderPassInfo, GFXRenderPass } from '../gfx-render-pass';
import { GFXFramebufferInfo, GFXFramebuffer } from '../gfx-framebuffer';
import { WebGLGFXRenderPass } from './webgl-gfx-render-pass';
import { WebGLGFXTextureView } from './webgl-gfx-texture-view';
import { WebGLGFXTexture } from './webgl-gfx-texture';
import { GFXShaderInfo, GFXShader } from '../gfx-shader';
import { GFXSamplerInfo, GFXFilter, GFXSampler, GFXAddress } from '../gfx-sampler';
import { WebGLGFXCommandAllocator } from './webgl-gfx-command-allocator';
import { GFXInputAssemblerInfo, GFXInputAssembler } from '../gfx-input-assembler';
import { WebGLGFXShader } from './webgl-gfx-shader';
import { GFXCommandAllocator, GFXCommandAllocatorInfo } from '../gfx-command-allocator';
import { GFXPipelineStateInfo, GFXPipelineState } from '../gfx-pipeline-state';
import { WebGLGFXPipelineLayout } from './webgl-gfx-pipeline-layout';
import { GFXBindingLayoutInfo, GFXBindingUnit, GFXBindingType } from '../gfx-binding-layout';
import { WebGLGFXSampler } from './webgl-gfx-sampler';
import { GFXCommandBufferInfo, GFXCommandBuffer } from '../gfx-command-buffer';
import { GFXQueueInfo, GFXQueue } from '../gfx-queue';
import { WebGLGFXCommandBuffer } from './webgl-gfx-command-buffer';
import { WebGLGFXPipelineState } from './webgl-gfx-pipeline-state';
import { GFXPipelineLayoutInfo, GFXPipelineLayout } from '../gfx-pipeline-layout';
import { WebGLGFXFramebuffer } from './webgl-gfx-framebuffer';
import { WebGLGFXInputAssembler } from './webgl-gfx-input-assembler';
import { GFXWindowInfo, GFXWindow } from '../gfx-window';
import { WebGLGFXWindow } from './webgl-gfx-window';
import { BufferView } from '../gfx-define';

const WebGLPrimitives: GLenum[] = [
    WebGLRenderingContext.POINTS,
    WebGLRenderingContext.LINES,
    WebGLRenderingContext.LINE_STRIP,
    WebGLRenderingContext.LINE_LOOP,
    WebGLRenderingContext.TRIANGLES,
    WebGLRenderingContext.TRIANGLE_STRIP,
    WebGLRenderingContext.TRIANGLE_FAN,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
    WebGLRenderingContext.NONE,
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

    stateCache: WebGLStateCache = new WebGLStateCache;
    //webGLCmdAllocator: WebGLGFXCommandAllocator;

    constructor() {
        super();

        //this.webGLCmdAllocator = new WebGLGFXCommandAllocator(this);
    }

    public initialize(info: GFXDeviceInfo): boolean {

        let canvasElm = <HTMLCanvasElement>info.canvasElm;

        if (info.isAntialias) {
            this._isAntialias = info.isAntialias;
        }

        if (info.isPremultipliedAlpha) {
            this._isPremultipliedAlpha = info.isPremultipliedAlpha;
        }

        try {
            let webGLCtxAttribs: WebGLContextAttributes = {
                alpha: true,
                antialias: this._isAntialias,
                depth: true,
                stencil: true,
                premultipliedAlpha: this._isPremultipliedAlpha,
                preserveDrawingBuffer: false,
                powerPreference: "default",
                failIfMajorPerformanceCaveat: false,
            };

            this._webGLRC = canvasElm.getContext('webgl', webGLCtxAttribs);
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

        console.info('WebGL device initialization successed.');

        this._deviceName = "WebGL";

        this._WEBGL_debug_renderer_info = this._webGLRC.getExtension("WEBGL_debug_renderer_info");
        if (this._WEBGL_debug_renderer_info) {
            let renderer = this._webGLRC.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_RENDERER_WEBGL);
            console.info("RENDERER: " + renderer);

            let vendor = this._webGLRC.getParameter(this._WEBGL_debug_renderer_info.UNMASKED_VENDOR_WEBGL);
            console.info("VENDOR: " + vendor);
        }

        this._extensions = this._webGLRC.getSupportedExtensions();
        /*
        if (this._extensions) {
            for (let i = 0; i < this._extensions.length; ++i) {
                console.info(this._extensions[i]);
            }
        }
        */

        this._EXT_texture_filter_anisotropic = this._webGLRC.getExtension("EXT_texture_filter_anisotropic");
        this._EXT_frag_depth = this._webGLRC.getExtension("EXT_frag_depth");
        this._EXT_shader_texture_lod = this._webGLRC.getExtension("EXT_shader_texture_lod");
        this._EXT_sRGB = this._webGLRC.getExtension("EXT_sRGB");
        this._OES_vertex_array_object = this._webGLRC.getExtension("OES_vertex_array_object");
        this._WEBGL_color_buffer_float = this._webGLRC.getExtension("WEBGL_color_buffer_float");
        this._WEBGL_compressed_texture_astc = this._webGLRC.getExtension("WEBGL_compressed_texture_astc");
        this._WEBGL_compressed_texture_s3tc = this._webGLRC.getExtension("WEBGL_compressed_texture_s3tc");
        this._WEBGL_compressed_texture_s3tc_srgb = this._webGLRC.getExtension("WEBGL_compressed_texture_s3tc_srgb");
        this._WEBGL_debug_shaders = this._webGLRC.getExtension("WEBGL_debug_shaders");
        this._WEBGL_draw_buffers = this._webGLRC.getExtension("WEBGL_draw_buffers");
        this._WEBGL_lose_context = this._webGLRC.getExtension("WEBGL_lose_context");
        this._WEBGL_depth_texture = this._webGLRC.getExtension("WEBGL_depth_texture");
        this._OES_texture_half_float = this._webGLRC.getExtension("OES_texture_half_float");
        this._OES_texture_half_float_linear = this._webGLRC.getExtension("OES_texture_half_float_linear");
        this._OES_texture_float = this._webGLRC.getExtension("OES_texture_float");
        this._OES_standard_derivatives = this._webGLRC.getExtension("OES_standard_derivatives");
        this._OES_element_index_uint = this._webGLRC.getExtension("OES_element_index_uint");
        this._ANGLE_instanced_arrays = this._webGLRC.getExtension("ANGLE_instanced_arrays");

        // create primary window
        this._primaryWindow = this.createWindow({
            title: this._webGLRC.canvas.title,
            left: this._webGLRC.canvas.offsetLeft,
            top: this._webGLRC.canvas.offsetTop,
            width: this._webGLRC.drawingBufferWidth,
            height: this._webGLRC.drawingBufferHeight,
        });

        return true;
    }

    public destroy(): void {

        if (this._primaryWindow) {
            this._primaryWindow.destroy();
            this._primaryWindow = null;
        }

        this._webGLRC = null;
    }

    public createBuffer(info: GFXBufferInfo): GFXBuffer | null {
        let buffer = new WebGLGFXBuffer(this);
        if (buffer.initialize(info)) {
            return buffer;
        } else {
            buffer.destroy();
            return null;
        }
    }

    public createTexture(info: GFXTextureInfo): GFXTexture | null {
        let texture = new WebGLGFXTexture(this);
        if (texture.initialize(info)) {
            return texture;
        } else {
            texture.destroy();
            return null;
        }
    }

    public createTextureView(info: GFXTextureViewInfo): GFXTextureView | null {
        let texView = new WebGLGFXTextureView(this);
        if (texView.initialize(info)) {
            return texView;
        } else {
            texView.destroy();
            return null;
        }
    }

    public createSampler(info: GFXSamplerInfo): GFXSampler | null {
        let sampler = new WebGLGFXSampler(this);
        if (sampler.initialize(info)) {
            return sampler;
        } else {
            sampler.destroy();
            return null;
        }
    }

    public createShader(info: GFXShaderInfo): GFXShader | null {
        let shader = new WebGLGFXShader(this);
        if (shader.initialize(info)) {
            return shader;
        } else {
            shader.destroy();
            return null;
        }
    }

    public createInputAssembler(info: GFXInputAssemblerInfo): GFXInputAssembler | null {
        let inputAssembler = new WebGLGFXInputAssembler(this);
        if (inputAssembler.initialize(info)) {
            return inputAssembler;
        } else {
            inputAssembler.destroy();
            return null;
        }
    }

    public createRenderPass(info: GFXRenderPassInfo): GFXRenderPass | null {
        let renderPass = new WebGLGFXRenderPass(this);
        if (renderPass.initialize(info)) {
            return renderPass;
        } else {
            renderPass.destroy();
            return null;
        }
    }

    public createFramebuffer(info: GFXFramebufferInfo): GFXFramebuffer | null {
        let framebuffer = new WebGLGFXFramebuffer(this);
        if (framebuffer.initialize(info)) {
            return framebuffer;
        } else {
            framebuffer.destroy();
            return null;
        }
    }

    public createPipelineLayout(info: GFXPipelineLayoutInfo): GFXPipelineLayout | null {
        let pipelineLayout = new WebGLGFXPipelineLayout(this);
        if (pipelineLayout.initialize(info)) {
            return pipelineLayout;
        } else {
            pipelineLayout.destroy();
            return null;
        }
    }

    public createPipelineState(info: GFXPipelineStateInfo): GFXPipelineState | null {
        let pipelineState = new WebGLGFXPipelineState(this);
        if (pipelineState.initialize(info)) {
            return pipelineState;
        } else {
            pipelineState.destroy();
            return null;
        }
    }

    public createCommandAllocator(info: GFXCommandAllocatorInfo): GFXCommandAllocator | null {
        let cmdAllocator = new WebGLGFXCommandAllocator(this);
        if (cmdAllocator.initialize(info)) {
            return cmdAllocator;
        } else {
            cmdAllocator.destroy();
            return null;
        }
    }

    public createCommandBuffer(info: GFXCommandBufferInfo): GFXCommandBuffer | null {
        let cmdBuff = new WebGLGFXCommandBuffer(this);
        if (cmdBuff.initialize(info)) {
            return cmdBuff;
        } else {
            cmdBuff.destroy();
            return null;
        }
    }

    public createQueue(info: GFXQueueInfo): GFXQueue | null {
        let queue = new WebGLGFXQueue(this);
        if (queue.initialize(info)) {
            return queue;
        } else {
            queue.destroy();
            return null;
        }
    }

    public createWindow(info: GFXWindowInfo): GFXWindow | null {
        let window = new WebGLGFXWindow(this);
        if (window.initialize(info)) {
            this._windows.push(window);
            return window;
        } else {
            window.destroy();
            return null;
        }
    }

    public get gl(): WebGLRenderingContext {
        return <WebGLRenderingContext>this._webGLRC;
    }

    public get webGLQueue(): WebGLGFXQueue {
        return <WebGLGFXQueue>this._queue;
    }

    public emitCmdCreateGPUBuffer(info: GFXBufferInfo, buffer: BufferView | null): WebGLGPUBuffer | null {

        let gpuBuffer: WebGLGPUBuffer = {
            objType: WebGLGPUObjectType.BUFFER,
            usage: info.usage,
            memUsage: info.memUsage,
            size: info.size,
            stride: info.stride ? info.stride : 1,
            buffer: null,
            bufferView: null,
            glTarget: 0,
            glBuffer: 0,
        };

        if (buffer) {
            gpuBuffer.buffer = buffer.buffer;
            gpuBuffer.bufferView = buffer;
        }

        //let isUBOSimulate = (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) !== GFXBufferUsageBit.NONE;
        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncCreateBuffer(<WebGLGFXDevice>this, gpuBuffer);

        return gpuBuffer;
    }

    public emitCmdDestroyGPUBuffer(gpuBuffer: WebGLGPUBuffer) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncDestroyBuffer(<WebGLGFXDevice>this, gpuBuffer);
    }

    public emitCmdUpdateGPUBuffer(gpuBuffer: WebGLGPUBuffer, offset: number, buffer: BufferView) {
        // TODO: Async
        let isUBOSimulate = (gpuBuffer.usage & GFXBufferUsageBit.UNIFORM) !== GFXBufferUsageBit.NONE;
        let isStagingBuffer = (gpuBuffer.usage & GFXBufferUsageBit.TRANSFER_SRC) !== GFXBufferUsageBit.NONE;
        if (!isUBOSimulate && !isStagingBuffer) {
            WebGLCmdFuncUpdateBuffer(<WebGLGFXDevice>this, gpuBuffer, offset, buffer);
        }
    }

    public emitCmdCreateGPUTexture(info: GFXTextureInfo): WebGLGPUTexture {

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

        let gpuTexture: WebGLGPUTexture = {
            objType: WebGLGPUObjectType.TEXTURE,
            type: info.type,
            viewType: viewType,
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
        };

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.CREATE_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncCreateTexture(<WebGLGFXDevice>this, gpuTexture);

        return gpuTexture;
    }

    public emitCmdDestroyGPUTexture(gpuTexture: WebGLGPUTexture) {

        // TODO: Async
        // let cmd : WebGLCmd = { type : WebGLCmdType.DESTROY_BUFFER, gpuObj : gpuBuffer, isFree : false };
        WebGLCmdFuncDestroyTexture(<WebGLGFXDevice>this, gpuTexture);
    }

    public emitCmdCreateGPUTextureView(info: GFXTextureViewInfo): WebGLGPUTextureView {
        let webGLTexture = <WebGLGFXTexture>info.texture;

        let gpuTextureView: WebGLGPUTextureView = {
            objType: WebGLGPUObjectType.TEXTURE_VIEW,
            gpuTexture: webGLTexture.gpuTexture,
            type: info.type,
            format: info.format,
            baseLevel: info.baseLevel ? info.baseLevel : 0,
            levelCount: info.levelCount ? info.levelCount : 1,
        };

        return gpuTextureView;
    }

    public emitCmdCreateGPURenderPass(info: GFXRenderPassInfo): WebGLGPURenderPass {
        let gpuRenderPass: WebGLGPURenderPass = {
            objType: WebGLGPUObjectType.RENDER_PASS,
            colorAttachments: info.colorAttachment,
            depthStencilAttachment: info.depthStencilAttachment,
        }

        return gpuRenderPass;
    }

    public emitCmdDestroyGPURenderPass(renderPass: WebGLGPURenderPass) {
    }

    public emitCmdCreateGPUFramebuffer(info: GFXFramebufferInfo): WebGLGPUFramebuffer {

        let renderPass = <WebGLGFXRenderPass>info.renderPass;

        let gpuColorViews: (WebGLGPUTextureView | null)[] = new Array<WebGLGPUTextureView | null>();

        if (info.colorViews) {
            for (let i = 0; i < info.colorViews.length; ++i) {
                let webGLColorView = <WebGLGFXTextureView>info.colorViews[i];
                gpuColorViews[i] = webGLColorView.gpuTextureView;
            }
        }

        let gpuDepthStencilView: WebGLGPUTextureView | null = null;

        if (info.depthStencilView) {
            gpuDepthStencilView = (<WebGLGFXTextureView>info.depthStencilView).gpuTextureView;
        }

        let gpuFramebuffer: WebGLGPUFramebuffer = {
            objType: WebGLGPUObjectType.FRAMEBUFFER,
            gpuRenderPass: renderPass.gpuRenderPass,
            gpuColorViews: gpuColorViews,
            gpuDepthStencilView: gpuDepthStencilView,
            isOffscreen: info.isOffscreen,
            glFramebuffer: 0,
        };

        // TODO: Async
        WebGLCmdFuncCreateFramebuffer(<WebGLGFXDevice>this, gpuFramebuffer);

        return gpuFramebuffer;
    }

    public emitCmdDestroyGPUFramebuffer(gpuFramebuffer: WebGLGPUFramebuffer) {

        // TODO: Async
        WebGLCmdFuncDestroyFramebuffer(<WebGLGFXDevice>this, gpuFramebuffer);
    }

    public emitCmdCreateGPUSampler(info: GFXSamplerInfo): WebGLGPUSampler {

        let glMinFilter = WebGLRenderingContext.NONE;
        let glMagFilter = WebGLRenderingContext.NONE;

        if (info.minFilter === GFXFilter.LINEAR || info.minFilter === GFXFilter.ANISOTROPIC) {
            if (info.mipFilter === GFXFilter.LINEAR || info.mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_LINEAR;
            } else if (info.mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.LINEAR;
            }
        } else {
            if (info.mipFilter === GFXFilter.LINEAR || info.mipFilter === GFXFilter.ANISOTROPIC) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_LINEAR;
            } else if (info.mipFilter === GFXFilter.POINT) {
                glMinFilter = WebGLRenderingContext.NEAREST_MIPMAP_NEAREST;
            } else {
                glMinFilter = WebGLRenderingContext.NEAREST;
            }
        }

        if (info.magFilter === GFXFilter.LINEAR || info.magFilter === GFXFilter.ANISOTROPIC) {
            glMagFilter = WebGLRenderingContext.LINEAR;
        } else {
            glMagFilter = WebGLRenderingContext.NEAREST;
        }

        let glWrapS = info.addressU ? WebGLWraps[info.addressU] : GFXAddress.WRAP;
        let glWrapT = info.addressV ? WebGLWraps[info.addressV] : GFXAddress.WRAP;
        let glWrapR = info.addressW ? WebGLWraps[info.addressW] : GFXAddress.WRAP;

        let gpuSampler: WebGLGPUSampler = {
            objType: WebGLGPUObjectType.SAMPLER,

            glMinFilter: glMinFilter,
            glMagFilter: glMagFilter,
            glWrapS: glWrapS,
            glWrapT: glWrapT,
            glWrapR: glWrapR,
        };

        return gpuSampler;
    }

    public emitCmdDestroyGPUSampler(gpuSampler: WebGLGPUSampler) {
        // TODO: Async
    }

    public emitCmdCreateGPUShader(info: GFXShaderInfo): WebGLGPUShader {

        let gpuStages: WebGLGPUShaderStage[] = new Array<WebGLGPUShaderStage>(info.stages.length);

        for (let i = 0; i < info.stages.length; ++i) {
            let stage = info.stages[i];
            let gpuStage = gpuStages[i];
            gpuStage.type = stage.type;
            gpuStage.source = stage.source;

            if (stage.macros) {
                gpuStage.macros = stage.macros;
            }
        }

        let gpuShader: WebGLGPUShader = {
            objType: WebGLGPUObjectType.SHADER,
            name: info.name ? info.name : "",
            blocks: info.blocks,
            samplers: info.samplers,

            gpuStages: gpuStages,
            glProgram: 0,
            glInputs: [],
            glUniforms: [],
            glBlocks: [],
            glSamplers: [],
        };

        // TODO: Async
        WebGLCmdFuncCreateShader(<WebGLGFXDevice>this, gpuShader);

        return gpuShader;
    }

    public emitCmdDestroyGPUShader(gpuShader: WebGLGPUShader) {
        // TODO: Async
        WebGLCmdFuncDestroyShader(<WebGLGFXDevice>this, gpuShader);
    }

    public emitCmdCreateGPUPipelineState(info: GFXPipelineStateInfo): WebGLGPUPipelineState {

        let gpuShader: WebGLGPUShader | null = null;
        if (info.shader) {
            gpuShader = (<WebGLGFXShader>info.shader).gpuShader;
        }

        let gpuLayout: WebGLGPUPipelineLayout | null = null;
        if (info.layout) {
            gpuLayout = (<WebGLGFXPipelineLayout>info.layout).gpuPipelineLayout;
        }

        let gpuRenderPass: WebGLGPURenderPass | null = null;
        if (info.renderPass) {
            gpuRenderPass = (<WebGLGFXRenderPass>info.renderPass).gpuRenderPass;
        }

        let gpuPipelineState: WebGLGPUPipelineState = {
            objType: WebGLGPUObjectType.PIPELINE_STATE,
            glPrimitive: info.primitive,
            gpuShader: gpuShader,
            rs: info.rs,
            dss: info.dss,
            bs: info.bs,
            gpuLayout: gpuLayout,
            gpuRenderPass: gpuRenderPass,
        };

        return gpuPipelineState;
    }

    public emitCmdDestroyGPUPipelineState(gpuPipelineState: WebGLGPUPipelineState) {
        // TODO: Async
    }

    public emitCmdCreateGPUBindingLayout(info: GFXBindingLayoutInfo): WebGLGPUBindingLayout {

        let gpuBindings: WebGLGPUBinding[] = new Array<WebGLGPUBinding>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            let binding = info.bindings[i];
            let gpuBinding = gpuBindings[i];
            gpuBinding.binding = binding.binding;
            gpuBinding.type = binding.type;
            gpuBinding.name = binding.name;
        }

        let gpuBindingLayout: WebGLGPUBindingLayout = {
            objType: WebGLGPUObjectType.BINDING_LAYOUT,
            gpuBindings: gpuBindings,
        };

        return gpuBindingLayout;
    }

    public emitCmdDestroyGPUBindingLayout(gpuBindingLayout: WebGLGPUBindingLayout) {
        // TODO: Async
    }

    public emitCmdUpdateGPUBindingLayout(gpuBindingLayout: WebGLGPUBindingLayout, bindingUnits: GFXBindingUnit[]) {

        // TODO: Async
        for (let i = 0; i < bindingUnits.length; ++i) {
            let bindingUnit = bindingUnits[i];
            let gpuBinding = gpuBindingLayout.gpuBindings[i];
            gpuBinding.binding = bindingUnit.binding;
            gpuBinding.type = bindingUnit.type;
            gpuBinding.name = bindingUnit.name;

            switch (bindingUnit.type) {
                case GFXBindingType.UNIFORM_BUFFER: {
                    if (bindingUnit.buffer) {
                        gpuBinding.gpuBuffer = (<WebGLGFXBuffer>bindingUnit.buffer).gpuBuffer;
                    }
                    break;
                }
                case GFXBindingType.SAMPLER: {
                    if (bindingUnit.texView) {
                        gpuBinding.gpuTexView = (<WebGLGFXTextureView>bindingUnit.texView).gpuTextureView;
                    }

                    if (bindingUnit.sampler) {
                        gpuBinding.gpuSampler = (<WebGLGFXSampler>bindingUnit.sampler).gpuSampler;
                    }
                    break;
                }
                default: ;
            }
        }
    }

    public emitCmdCreateGPUInputAssembler(info: GFXInputAssemblerInfo): WebGLGPUInputAssembler {

        let gpuShader: WebGLGPUShader | null = null;

        if (info.shader) {
            gpuShader = (<WebGLGFXShader>info.shader).gpuShader;
        }

        let gpuVertexBuffers: WebGLGPUBuffer[] = new Array<WebGLGPUBuffer>(info.vertexBuffers.length);

        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            let vb = <WebGLGFXBuffer>info.vertexBuffers[i];
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: WebGLGPUBuffer | null = null;

        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (<WebGLGFXBuffer>info.indexBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = WebGLRenderingContext.UNSIGNED_BYTE; break;
                    case 2: glIndexType = WebGLRenderingContext.UNSIGNED_SHORT; break;
                    case 4: glIndexType = WebGLRenderingContext.UNSIGNED_INT; break;
                    default: {
                        console.error("Error index buffer stride.");
                    }
                }
            }
        }

        let gpuInputAssembler: WebGLGPUInputAssembler = {
            objType: WebGLGPUObjectType.INPUT_ASSEMBLER,
            attributes: info.attributes,
            gpuShader: gpuShader,
            gpuVertexBuffers: gpuVertexBuffers,
            gpuIndexBuffer: gpuIndexBuffer,

            glAttribs: [],
            glIndexType: glIndexType,
            glVAO: 0,
        };

        WebGLCmdFuncCreateInputAssember(<WebGLGFXDevice>this, gpuInputAssembler);

        // TODO: Async
        return gpuInputAssembler;
    }

    public emitCmdDestroyGPUInputAssembler(gpuInputAssembler: WebGLGPUInputAssembler) {
        // TODO: Async
        // WebGLCmdFuncDestroyInputAssembler(<WebGLGFXDevice>this, gpuInputAssembler);
    }

    public get isAntialias(): boolean {
        return this._isAntialias;
    }

    public get isPremultipliedAlpha(): boolean {
        return this._isPremultipliedAlpha;
    }

    public get EXT_texture_filter_anisotropic(): EXT_texture_filter_anisotropic | null {
        return this._EXT_texture_filter_anisotropic;
    }

    public get EXT_frag_depth(): EXT_frag_depth | null {
        return this._EXT_frag_depth;
    }

    public get EXT_shader_texture_lod(): EXT_shader_texture_lod | null {
        return this._EXT_shader_texture_lod;
    }

    public get EXT_sRGB(): EXT_sRGB | null {
        return this._EXT_sRGB;
    }

    public get OES_vertex_array_object(): OES_vertex_array_object | null {
        return this._OES_vertex_array_object;
    }

    public get WEBGL_color_buffer_float(): WEBGL_color_buffer_float | null {
        return this._WEBGL_color_buffer_float;
    }

    public get WEBGL_compressed_texture_astc(): WEBGL_compressed_texture_astc | null {
        return this._WEBGL_compressed_texture_astc;
    }

    public get WEBGL_compressed_texture_s3tc(): WEBGL_compressed_texture_s3tc | null {
        return this._WEBGL_compressed_texture_s3tc;
    }

    public get WEBGL_compressed_texture_s3tc_srgb(): WEBGL_compressed_texture_s3tc_srgb | null {
        return this._WEBGL_compressed_texture_s3tc_srgb;
    }

    public get WEBGL_debug_shaders(): WEBGL_debug_shaders | null {
        return this._WEBGL_debug_shaders;
    }

    public get WEBGL_draw_buffers(): WEBGL_draw_buffers | null {
        return this._WEBGL_draw_buffers;
    }

    public get WEBGL_lose_context(): WEBGL_lose_context | null {
        return this._WEBGL_lose_context;
    }

    public get WEBGL_depth_texture(): WEBGL_depth_texture | null {
        return this._WEBGL_depth_texture;
    }

    public get WEBGL_debug_renderer_info(): WEBGL_debug_renderer_info | null {
        return this._WEBGL_debug_renderer_info;
    }

    public get OES_texture_half_float(): OES_texture_half_float | null {
        return this._OES_texture_half_float;
    }

    public get OES_texture_half_float_linear(): OES_texture_half_float_linear | null {
        return this._OES_texture_half_float_linear;
    }

    public get OES_texture_float(): OES_texture_float | null {
        return this._OES_texture_float;
    }

    public get OES_standard_derivatives(): OES_standard_derivatives | null {
        return this._OES_standard_derivatives;
    }

    public get OES_element_index_uint(): OES_element_index_uint | null {
        return this._OES_element_index_uint;
    }

    public get ANGLE_instanced_arrays(): ANGLE_instanced_arrays | null {
        return this._ANGLE_instanced_arrays;
    }

    private _webGLRC: WebGLRenderingContext | null = null;
    private _isAntialias: boolean = true;
    private _isPremultipliedAlpha: boolean = false;

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
};
