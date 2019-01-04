import { GFXBuffer, GFXBufferInfo } from './buffer';
import { GFXQueue, GFXQueueInfo } from './queue';
import { GFXTexture, GFXTextureInfo } from './texture';
import { GFXTextureViewInfo, GFXTextureView } from './texture-view';
import { GFXFramebufferInfo, GFXFramebuffer } from './framebuffer';
import { GFXRenderPassInfo, GFXRenderPass } from './render-pass';
import { GFXPipelineStateInfo, GFXPipelineState } from './pipeline-state';
import { GFXPipelineLayoutInfo, GFXPipelineLayout } from './pipeline-layout';
import { GFXSamplerInfo, GFXSampler } from './sampler';
import { GFXShaderInfo, GFXShader } from './shader';
import { GFXInputAssemblerInfo, GFXInputAssembler } from './input-assembler';
import { GFXCommandBufferInfo, GFXCommandBuffer } from './command-buffer';
import { GFXCommandAllocatorInfo, GFXCommandAllocator } from './command-allocator';
import { GFXWindowInfo, GFXWindow } from './window';
import { GFXBindingLayoutInfo, GFXBindingLayout } from './binding-layout';
import { GFXRect } from './define';

export enum GFXFeature {
};

export interface GFXDeviceInfo {
    canvasElm: HTMLElement;
    isAntialias?: boolean;
    isPremultipliedAlpha?: boolean;
};

export abstract class GFXDevice {

    public abstract initialize(info: GFXDeviceInfo): boolean;
    public abstract destroy(): void;
    public abstract createBuffer(info: GFXBufferInfo): GFXBuffer | null;
    public abstract createTexture(info: GFXTextureInfo): GFXTexture | null;
    public abstract createTextureView(info: GFXTextureViewInfo): GFXTextureView | null;
    public abstract createSampler(info: GFXSamplerInfo): GFXSampler | null;
    public abstract createBindingLayout(info: GFXBindingLayoutInfo): GFXBindingLayout | null;
    public abstract createShader(info: GFXShaderInfo): GFXShader | null;
    public abstract createInputAssembler(info: GFXInputAssemblerInfo): GFXInputAssembler | null;
    public abstract createRenderPass(info: GFXRenderPassInfo): GFXRenderPass | null;
    public abstract createFramebuffer(info: GFXFramebufferInfo): GFXFramebuffer | null;
    public abstract createPipelineLayout(info: GFXPipelineLayoutInfo): GFXPipelineLayout | null;
    public abstract createPipelineState(info: GFXPipelineStateInfo): GFXPipelineState | null;
    public abstract createCommandAllocator(info: GFXCommandAllocatorInfo): GFXCommandAllocator | null;
    public abstract createCommandBuffer(info: GFXCommandBufferInfo): GFXCommandBuffer | null;
    public abstract createQueue(info: GFXQueueInfo): GFXQueue | null;
    public abstract createWindow(info: GFXWindowInfo): GFXWindow | null;
    public abstract present();

    public abstract copyBufferToTexture2D(buffer: ArrayBuffer, texture: GFXTexture, rect?: GFXRect);

    public get canvas(): HTMLCanvasElement {
        return <HTMLCanvasElement>this._canvas;
    }

    public get queue(): GFXQueue {
        return <GFXQueue>this._queue;
    }

    public get mainWindow(): GFXWindow | null {
        return this._mainWindow;
    }

    public get commandAllocator(): GFXCommandAllocator {
        return <GFXCommandAllocator>this._cmdAllocator;
    }

    public get renderer(): string {
        return this._renderer;
    }

    public get vendor(): string {
        return this._vendor;
    }

    public get maxVertexAttributes(): number {
        return this._maxVertexAttributes;
    }

    public get maxVertexUniformVectors(): number {
        return this._maxVertexUniformVectors;
    }

    public get maxFragmentUniformVectors(): number {
        return this._maxFragmentUniformVectors;
    }

    public get maxTextureUnits(): number {
        return this._maxTextureUnits;
    }

    public get maxVertexTextureUnits(): number {
        return this._maxVertexTextureUnits;
    }

    public get depthBits(): number {
        return this._depthBits;
    }

    public get stencilBits(): number {
        return this._stencilBits;
    }

    protected _canvas: HTMLCanvasElement | null = null;
    protected _deviceName: string = "";
    protected _renderer: string = "";
    protected _vendor: string = "";
    protected _version: string = "";
    protected _queue: GFXQueue | null = null;
    protected _mainWindow: GFXWindow | null = null;
    protected _cmdAllocator: GFXCommandAllocator | null = null;
    protected _maxVertexAttributes: number = 0;
    protected _maxVertexUniformVectors: number = 0;
    protected _maxFragmentUniformVectors: number = 0;
    protected _maxTextureUnits: number = 0;
    protected _maxVertexTextureUnits: number = 0;
    protected _depthBits: number = 0;
    protected _stencilBits: number = 0;
};
