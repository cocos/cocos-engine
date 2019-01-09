import { GFXBindingLayout, IGFXBindingLayoutInfo } from './binding-layout';
import { GFXBuffer, IGFXBufferInfo } from './buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from './command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from './command-buffer';
import { GFXBufferTextureCopy, GFXFormat } from './define';
import { GFXFramebuffer, IGFXFramebufferInfo } from './framebuffer';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from './input-assembler';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from './pipeline-layout';
import { GFXPipelineState, IGFXPipelineStateInfo } from './pipeline-state';
import { GFXQueue, IGFXQueueInfo } from './queue';
import { GFXRenderPass, IGFXRenderPassInfo } from './render-pass';
import { GFXSampler, IGFXSamplerInfo } from './sampler';
import { GFXShader, IGFXShaderInfo } from './shader';
import { GFXTexture, IGFXTextureInfo } from './texture';
import { GFXTextureView, IGFXTextureViewInfo } from './texture-view';
import { GFXWindow, IGFXWindowInfo } from './window';

export enum GFXFeature {
}

export interface IGFXDeviceInfo {
    canvasElm: HTMLElement;
    isAntialias?: boolean;
    isPremultipliedAlpha?: boolean;
}

export abstract class GFXDevice {

    public get canvas (): HTMLCanvasElement {
        return this._canvas as HTMLCanvasElement;
    }

    public get canvas2D (): HTMLCanvasElement {
        return this._canvas2D as HTMLCanvasElement;
    }

    public get queue (): GFXQueue {
        return this._queue as GFXQueue;
    }

    public get width (): number {
        return this._width;
    }

    public get height (): number {
        return this._height;
    }

    public get mainWindow (): GFXWindow {
        return this._mainWindow as GFXWindow;
    }

    public get commandAllocator (): GFXCommandAllocator {
        return this._cmdAllocator as GFXCommandAllocator;
    }

    public get renderer (): string {
        return this._renderer;
    }

    public get vendor (): string {
        return this._vendor;
    }

    public get maxVertexAttributes (): number {
        return this._maxVertexAttributes;
    }

    public get maxVertexUniformVectors (): number {
        return this._maxVertexUniformVectors;
    }

    public get maxFragmentUniformVectors (): number {
        return this._maxFragmentUniformVectors;
    }

    public get maxTextureUnits (): number {
        return this._maxTextureUnits;
    }

    public get maxVertexTextureUnits (): number {
        return this._maxVertexTextureUnits;
    }

    public get depthBits (): number {
        return this._depthBits;
    }

    public get stencilBits (): number {
        return this._stencilBits;
    }

    public get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    public get depthStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
    }

    protected _canvas: HTMLCanvasElement | null = null;
    protected _canvas2D: HTMLCanvasElement | null = null;
    protected _deviceName: string = '';
    protected _renderer: string = '';
    protected _vendor: string = '';
    protected _version: string = '';
    protected _queue: GFXQueue | null = null;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _mainWindow: GFXWindow | null = null;
    protected _cmdAllocator: GFXCommandAllocator | null = null;
    protected _maxVertexAttributes: number = 0;
    protected _maxVertexUniformVectors: number = 0;
    protected _maxFragmentUniformVectors: number = 0;
    protected _maxTextureUnits: number = 0;
    protected _maxVertexTextureUnits: number = 0;
    protected _depthBits: number = 0;
    protected _stencilBits: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _shaderIdGen: number = 0;

    public abstract initialize (info: IGFXDeviceInfo): boolean;
    public abstract destroy (): void;
    public abstract createBuffer (info: IGFXBufferInfo): GFXBuffer | null;
    public abstract createTexture (info: IGFXTextureInfo): GFXTexture | null;
    public abstract createTextureView (info: IGFXTextureViewInfo): GFXTextureView | null;
    public abstract createSampler (info: IGFXSamplerInfo): GFXSampler | null;
    public abstract createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout | null;
    public abstract createShader (info: IGFXShaderInfo): GFXShader | null;
    public abstract createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler | null;
    public abstract createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass | null;
    public abstract createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer | null;
    public abstract createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout | null;
    public abstract createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState | null;
    public abstract createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator | null;
    public abstract createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer | null;
    public abstract createQueue (info: IGFXQueueInfo): GFXQueue | null;
    public abstract createWindow (info: IGFXWindowInfo): GFXWindow | null;
    public abstract present ();

    public abstract copyBufferToTexture (buffer: ArrayBuffer, texture: GFXTexture, regions: GFXBufferTextureCopy[]);
    public abstract copyImageSourceToTexture (source: CanvasImageSource, texture: GFXTexture, regions: GFXBufferTextureCopy[]);
    public abstract copyFramebufferToBuffer (srcFramebuffer: GFXFramebuffer, dstBuffer: ArrayBuffer, regions: GFXBufferTextureCopy[]);

    public genShaderId (): number {
        return this._shaderIdGen++;
    }
}
