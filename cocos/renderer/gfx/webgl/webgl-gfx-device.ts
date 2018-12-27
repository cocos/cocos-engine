import { GFXDeviceInfo, GFXDevice } from '../gfx-device';
import { GFXBuffer, GFXBufferInfo, GFXBufferUsageBit } from '../gfx-buffer';
import { WebGLGFXBuffer } from './webgl-gfx-buffer';
import { WebGLGFXQueue } from './webgl-gfx-queue';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLGPUBuffer, WebGLGPUObjectType, WebGLGPUTexture, WebGLGPURenderPass, WebGLGPUFramebuffer, WebGLGPUTextureView, WebGLGPUShader, WebGLGPUShaderStage, WebGLGPUSampler, WebGLGPUInputAssembler, WebGLGPUPipelineState, WebGLGPUPipelineLayout, WebGLGPUBindingLayout as WebGLGPUBindingLayout, WebGLGPUBinding } from './webgl-gpu-objects';
import { WebGLCmdFuncUpdateBuffer, WebGLCmdFuncDestroyBuffer, WebGLCmdFuncCreateBuffer, WebGLCmdFuncDestroyTexture, WebGLCmdFuncCreateTexture, WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer, WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader, WebGLCmdFuncCreateInputAssember, WebGLCmdFuncDestroyInputAssembler } from './webgl-commands';
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
import { GFXPipelineStateInfo, GFXPipelineState, GFXPrimitiveMode, GFXRasterizerState, GFXDepthStencilState, GFXBlendState } from '../gfx-pipeline-state';
import { WebGLGFXPipelineLayout } from './webgl-gfx-pipeline-layout';
import { GFXBindingLayoutInfo, GFXBinding, GFXBindingUnit, GFXBindingType } from '../gfx-binding-layout';
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

    constructor(canvasEL: HTMLElement) {

        super();

        //this.webGLCmdAllocator = new WebGLGFXCommandAllocator(this);
    }

    public initialize(info: GFXDeviceInfo): boolean {

        this._canvasElm = <HTMLCanvasElement>info.canvasElm;

        try {
            let webGLCtxAttribs: WebGLContextAttributes = {
                alpha: true,
                antialias: true,
                depth: true,
                stencil: true,
                premultipliedAlpha: true,
                preserveDrawingBuffer: false,
                powerPreference: "default",
                failIfMajorPerformanceCaveat: false,
            };

            this._webGLRC = this._canvasElm.getContext('webgl', webGLCtxAttribs);
        } catch (err) {
            console.error(err);
            return false;
        }

        // No errors are thrown using try catch
        // Tested through ios baidu browser 4.14.1
        if (!this._webGLRC) {
            console.error('This device does not support WebGL.');
        }

        this._deviceName = "WebGL";

        this._primaryWindow = this.createWindow({
            title: this._canvasElm.title,
            left: this._canvasElm.offsetLeft,
            top: this._canvasElm.offsetTop,
            width: this._canvasElm.width,
            height: this._canvasElm.height,
        });

        return true;
    }

    public destroy(): void {

        if (this._primaryWindow) {
            this._primaryWindow.destroy();
            this._primaryWindow = null;
        }
        
        this._canvasElm = null;
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

    public emitCmdCreateGPUBuffer(info: GFXBufferInfo, buffer: Buffer | null): WebGLGPUBuffer | null {

        let gpuBuffer: WebGLGPUBuffer = {
            objType: WebGLGPUObjectType.BUFFER,
            usage: info.usage,
            memUsage: info.memUsage,
            size: info.size,
            stride: info.stride ? info.stride : 1,
            arrayBuffer: null,
            buffer: null,
            glTarget: 0,
            glBuffer: 0,
        };

        if (buffer) {
            gpuBuffer.arrayBuffer = buffer.buffer;
            gpuBuffer.buffer = buffer;
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

    public emitCmdUpdateGPUBuffer(gpuBuffer: WebGLGPUBuffer, offset: number, buffer: Buffer) {
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

    private _webGLRC: WebGLRenderingContext | null = null;
    private _canvasElm: HTMLCanvasElement | null = null;
};
