import { GFXDeviceInfo, GFXDevice } from '../gfx-device';
import { GFXBuffer, GFXBufferInfo } from '../gfx-buffer';
import { WebGLGFXBuffer } from './webgl-gfx-buffer';
import { WebGLGFXQueue } from './webgl-gfx-queue';
import { WebGLStateCache } from './webgl-state-cache';
import { WebGLGPUBuffer, WebGLGPUObjectType, WebGLGPUTexture, WebGLGPURenderPass, WebGLGPUFramebuffer, WebGLGPUTextureView, WebGLGPUShader, WebGLGPUShaderStage, WebGLGPUSampler, WebGLGPUInputAssembler, WebGLGPUPipelineState, WebGLGPUPipelineLayout, WebGLGPUBindingSetLayout, WebGLGPUBinding } from './webgl-gpu-objects';
import { WebGLCmdFuncUpdateBuffer, WebGLCmdFuncDestroyBuffer, WebGLCmdFuncCreateBuffer, WebGLCmdFuncDestroyTexture, WebGLCmdFuncCreateTexture, WebGLCmdFuncCreateFramebuffer, WebGLCmdFuncDestroyFramebuffer, WebGLCmdFuncCreateShader, WebGLCmdFuncDestroyShader, WebGLCmdFuncCreateInputAssember, WebGLCmdFuncDestroyInputAssembler } from './webgl-commands';
import { GFXTextureInfo, GFXTextureType, GFXTextureFlagBit } from '../gfx-texture';
import { GFXTextureViewType, GFXTextureViewInfo } from '../gfx-texture-view';
import { GFXRenderPassInfo } from '../gfx-render-pass';
import { GFXFramebufferInfo } from '../gfx-framebuffer';
import { WebGLGFXRenderPass } from './webgl-gfx-render-pass';
import { WebGLGFXTextureView } from './webgl-gfx-texture-view';
import { WebGLGFXTexture } from './webgl-gfx-texture';
import { GFXShaderInfo } from '../gfx-shader';
import { GFXSamplerInfo } from '../gfx-sampler';
import { WebGLGFXCommandAllocator } from './webgl-gfx-command-allocator';
import { GFXInputAssemblerInfo } from '../gfx-input-assembler';
import { WebGLGFXShader } from './webgl-gfx-shader';
import { GFXCommandAllocator } from '../gfx-command-allocator';
import { GFXPipelineStateInfo } from '../gfx-pipeline-state';
import { WebGLGFXPipelineLayout } from './webgl-gfx-pipeline-layout';
import { GFXBindingSetLayoutInfo } from '../gfx-binding-set-layout';

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

export class WebGLGFXDevice extends GFXDevice {

    stateCache: WebGLStateCache = new WebGLStateCache;
    webGLCmdAllocator: WebGLGFXCommandAllocator;

    constructor(canvasEL: HTMLElement) {

        super();

        this.webGLCmdAllocator = new WebGLGFXCommandAllocator(this);

        try {
            this._webGLRC = (<HTMLCanvasElement>canvasEL).getContext('webgl');
        } catch (err) {
            console.error(err);
            return;
        }

        // No errors are thrown using try catch
        // Tested through ios baidu browser 4.14.1
        if (!this._webGLRC) {
            console.error('This device does not support WebGL.');
        }
    }

    public initialize(info: GFXDeviceInfo): boolean {

        return true;
    }

    public destroy(): void {

    }

    public createBuffer(): GFXBuffer {
        return new WebGLGFXBuffer(this);
    }

    public createCommandAllocator(): GFXCommandAllocator {
        return new WebGLGFXCommandAllocator(this);
    }

    public getDeviceName(): string {
        return "WebGLDevice";
    }

    public get gl(): WebGLRenderingContext {
        return <WebGLRenderingContext>this._webGLRC;
    }

    public get webGLQueue(): WebGLGFXQueue {
        return <WebGLGFXQueue>this._queue;
    }

    public emitCmdCreateGPUBuffer(info: GFXBufferInfo, buffer : Buffer | null): WebGLGPUBuffer | null {

        let gpuBuffer: WebGLGPUBuffer = {
            objType: WebGLGPUObjectType.BUFFER,
            usage: info.usage,
            memUsage: info.memUsage,
            size: info.size,
            stride: info.stride,
            arrayBuffer: null,
            buffer: null,
            glTarget: 0,
            glBuffer: 0,
        };

        if(buffer) {
            gpuBuffer.arrayBuffer = buffer.buffer;
            gpuBuffer.buffer = buffer;
        }

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
        WebGLCmdFuncUpdateBuffer(<WebGLGFXDevice>this, gpuBuffer, offset, buffer);
    }

    public emitCmdCreateGPUTexture(info: GFXTextureInfo): WebGLGPUTexture {

        let viewType: GFXTextureViewType;

        switch (info.type) {
            case GFXTextureType.TEX1D: {
                viewType = info.arrayLayer <= 1 ? GFXTextureViewType.TV1D : GFXTextureViewType.TV1D_ARRAY;
                break;
            }
            case GFXTextureType.TEX2D: {

                if (info.arrayLayer <= 1) {
                    viewType = GFXTextureViewType.TV2D;
                } else if (info.arrayLayer === 6 && (info.flags & GFXTextureFlagBit.CUBEMAP)) {
                    viewType = GFXTextureViewType.CUBE;
                } else {
                    viewType = GFXTextureViewType.TV2D_ARRAY;
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
            depth: info.depth,
            arrayLayer: info.arrayLayer,
            mipLevel: info.mipLevel,
            flags: info.flags,

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
            baseLevel: info.baseLevel,
            levelCount: info.levelCount,
        };

        return gpuTextureView;
    }

    public emitCmdCreateGPURenderPass(info: GFXRenderPassInfo): WebGLGPURenderPass {
        let gpuRenderPass: WebGLGPURenderPass = {
            objType: WebGLGPUObjectType.RENDER_PASS,
            colorAttachments: info.colorInfos,
            depthStencilAttachment: info.depthStencilInfo,
        }

        return gpuRenderPass;
    }

    public emitCmdDestroyGPURenderPass(renderPass: WebGLGPURenderPass) {
    }

    public emitCmdCreateGPUFramebuffer(info: GFXFramebufferInfo): WebGLGPUFramebuffer {

        let renderPass = <WebGLGFXRenderPass>info.renderPass;

        let gpuColorViews: (WebGLGPUTextureView | null)[] = new Array<WebGLGPUTextureView | null>();

        for (let i = 0; i < info.colorViews.length; ++i) {
            let webGLColorView = <WebGLGFXTextureView>info.colorViews[i];
            gpuColorViews[i] = webGLColorView.gpuTextureView;
        }

        let webGLDSView = <WebGLGFXTextureView>info.depthStencilView;

        let gpuFramebuffer: WebGLGPUFramebuffer = {
            objType: WebGLGPUObjectType.FRAMEBUFFER,
            gpuRenderPass: renderPass.gpuRenderPass,
            gpuColorViews: gpuColorViews,
            gpuDepthStencilView: webGLDSView.gpuTextureView,
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
        let gpuSampler: WebGLGPUSampler = {
            objType: WebGLGPUObjectType.FRAMEBUFFER,
            minFilter: info.minFilter,
            magFilter: info.magFilter,
            mipFilter: info.minFilter,
            addressU: info.addressU,
            addressV: info.addressV,
            addressW: info.addressW,
            maxAnisotropy: info.maxAnisotropy,
            cmpFunc: info.cmpFunc,
            borderColor: info.borderColor,
            minLOD: info.minLOD,
            maxLOD: info.maxLOD,
            mipLODBias: info.mipLODBias,
        };

        return gpuSampler;
    }

    public emitCmdDestroyGPUSampler(gpuSampler: WebGLGPUSampler) {
        // TODO: Async
    }

    public emitCmdCreateGPUShader(info: GFXShaderInfo): WebGLGPUShader {

        let gpuStages: WebGLGPUShaderStage[] = [];
        for (let i = 0; i < info.stages.length; ++i) {
            let stage = info.stages[i];

            gpuStages.push({
                type: stage.type,
                source: stage.source,
                macros: stage.macros,
                glShader: 0,
            });
        }

        let gpuShader: WebGLGPUShader = {
            objType: WebGLGPUObjectType.SHADER,
            name: info.name,
            bindings: info.bindings,
            blocks: info.blocks,

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
            glPrimitive: WebGLPrimitives[info.primitive],
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

    public emitCmdCreateGPUBindingSetLayout(info: GFXBindingSetLayoutInfo): WebGLGPUBindingSetLayout {

        let gpuBindings: WebGLGPUBinding[] = new Array<WebGLGPUBinding>(info.bindings.length);
        for (let i = 0; i < info.bindings.length; ++i) {
            let binding = info.bindings[i];
            let gpuBinding = gpuBindings[i];
            gpuBinding.binding = binding.binding;
            gpuBinding.type = binding.type;
            gpuBinding.name = binding.name;
        }

        let gpuBindingSetLayout: WebGLGPUBindingSetLayout = {
            objType: WebGLGPUObjectType.BINDING_SET_LAYOUT,
            gpuBinding: gpuBindings,
        };

        return gpuBindingSetLayout;
    }

    public emitCmdDestroyGPUBindingSetLayout(gpuBindingSetLayout: WebGLGPUBindingSetLayout) {
        // TODO: Async
    }

    public emitCmdUpdateGPUBindingSetLayout(gpuBindingSetLayout: WebGLGPUBindingSetLayout) {
        // TODO: Async


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
};
