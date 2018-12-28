import { GFXBuffer, GFXBufferInfo } from './gfx-buffer';
import { GFXQueue, GFXQueueInfo } from './gfx-queue';
import { GFXTexture, GFXTextureInfo } from './gfx-texture';
import { GFXTextureViewInfo, GFXTextureView } from './gfx-texture-view';
import { GFXFramebufferInfo, GFXFramebuffer } from './gfx-framebuffer';
import { GFXRenderPassInfo, GFXRenderPass } from './gfx-render-pass';
import { GFXPipelineStateInfo, GFXPipelineState } from './gfx-pipeline-state';
import { GFXPipelineLayoutInfo, GFXPipelineLayout } from './gfx-pipeline-layout';
import { GFXSamplerInfo, GFXSampler } from './gfx-sampler';
import { GFXShaderInfo, GFXShader } from './gfx-shader';
import { GFXInputAssemblerInfo, GFXInputAssembler } from './gfx-input-assembler';
import { GFXCommandBufferInfo, GFXCommandBuffer } from './gfx-command-buffer';
import { GFXCommandAllocatorInfo, GFXCommandAllocator } from './gfx-command-allocator';
import { GFXWindowInfo, GFXWindow } from './gfx-window';

export enum GFXFeature {
};

export interface GFXDeviceInfo {
    canvasElm: HTMLElement;
    isAntialias?: boolean;
    isPremultipliedAlpha?: boolean;
};

export abstract class GFXDevice {

    public abstract initialize(info : GFXDeviceInfo) : boolean;
    public abstract destroy() : void;
    public abstract createBuffer(info: GFXBufferInfo) : GFXBuffer | null;
    public abstract createTexture(info: GFXTextureInfo) : GFXTexture | null;
    public abstract createTextureView(info: GFXTextureViewInfo) : GFXTextureView | null;
    public abstract createSampler(info: GFXSamplerInfo) : GFXSampler | null;
    public abstract createShader(info: GFXShaderInfo) : GFXShader | null;
    public abstract createInputAssembler(info: GFXInputAssemblerInfo) : GFXInputAssembler | null;
    public abstract createRenderPass(info: GFXRenderPassInfo) : GFXRenderPass | null;
    public abstract createFramebuffer(info: GFXFramebufferInfo) : GFXFramebuffer | null;
    public abstract createPipelineLayout(info: GFXPipelineLayoutInfo) : GFXPipelineLayout | null;
    public abstract createPipelineState(info: GFXPipelineStateInfo) : GFXPipelineState | null;
    public abstract createCommandAllocator(info: GFXCommandAllocatorInfo): GFXCommandAllocator | null;
    public abstract createCommandBuffer(info: GFXCommandBufferInfo) : GFXCommandBuffer | null;
    public abstract createQueue(info: GFXQueueInfo) : GFXQueue | null;
    public abstract createWindow(info: GFXWindowInfo) : GFXWindow | null;

    public get queue(): GFXQueue {
        return <GFXQueue>this._queue;
    }

    public get maxVertexAttributes(): number {
        return this._maxVertexAttributes;
    }

    protected _deviceName : string = "";
    protected _queue : GFXQueue | null = null;
    protected _primaryWindow : GFXWindow | null = null;
    protected _windows : GFXWindow[] = [];

    protected _maxVertexAttributes : number = 0;
};
