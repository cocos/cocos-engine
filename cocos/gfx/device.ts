import { GFXBindingLayout, IGFXBindingLayoutInfo } from './binding-layout';
import { GFXBuffer, IGFXBufferInfo } from './buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from './command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from './command-buffer';
import { GFX_MAX_BUFFER_BINDINGS, GFXBufferTextureCopy, GFXFilter, GFXFormat, IGFXRect } from './define';
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

export enum GFXAPI {
    UNKNOWN,
    WEBGL,
    WEBGL2,
}

export enum GFXFeature {
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    FORMAT_R11G11B10F,
    FORMAT_D24S8,
    MSAA,
    COUNT,
}

export interface IGFXDeviceInfo {
    canvasElm: HTMLElement;
    isAntialias?: boolean;
    isPremultipliedAlpha?: boolean;
    debug?: boolean;
    nativeWidth?: number;
    nativeHeight?: number;
}

// tslint:disable: max-line-length
export abstract class GFXDevice {

    public get canvas (): HTMLCanvasElement {
        return this._canvas as HTMLCanvasElement;
    }

    public get canvas2D (): HTMLCanvasElement {
        return this._canvas2D as HTMLCanvasElement;
    }

    public get gfxAPI (): GFXAPI {
        return this._gfxAPI;
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

    public get nativeWidth (): number {
        return this._nativeWidth;
    }

    public get nativeHeight (): number {
        return this._nativeHeight;
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

    public get maxUniformBufferBindings (): number {
        return this._maxUniformBufferBindings;
    }

    public get maxUniformBlockSize (): number {
        return this._maxUniformBlockSize;
    }

    public get maxCombinedUniformBlocks (): number {
        return this._maxCombinedUniformBlocks;
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

    public get macros (): Map<string, string> {
        return this._macros;
    }

    protected _canvas: HTMLCanvasElement | null = null;
    protected _canvas2D: HTMLCanvasElement | null = null;
    protected _gfxAPI: GFXAPI = GFXAPI.UNKNOWN;
    protected _deviceName: string = '';
    protected _renderer: string = '';
    protected _vendor: string = '';
    protected _version: string = '';
    protected _features: boolean[] = new Array<boolean>(GFXFeature.COUNT);
    protected _queue: GFXQueue | null = null;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _nativeWidth: number = 0;
    protected _nativeHeight: number = 0;
    protected _mainWindow: GFXWindow | null = null;
    protected _cmdAllocator: GFXCommandAllocator | null = null;
    protected _maxVertexAttributes: number = 0;
    protected _maxVertexUniformVectors: number = 0;
    protected _maxFragmentUniformVectors: number = 0;
    protected _maxTextureUnits: number = 0;
    protected _maxVertexTextureUnits: number = 0;
    protected _maxUniformBufferBindings: number = GFX_MAX_BUFFER_BINDINGS;
    protected _maxUniformBlockSize: number = 0;
    protected _maxCombinedUniformBlocks: number = GFX_MAX_BUFFER_BINDINGS;
    protected _depthBits: number = 0;
    protected _stencilBits: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _shaderIdGen: number = 0;
    protected _macros: Map<string, string> = new Map();

    public abstract initialize (info: IGFXDeviceInfo): boolean;
    public abstract destroy (): void;
    public abstract resize (width: number, height: number);
    public abstract createBuffer (info: IGFXBufferInfo): GFXBuffer;
    public abstract createTexture (info: IGFXTextureInfo): GFXTexture;
    public abstract createTextureView (info: IGFXTextureViewInfo): GFXTextureView;
    public abstract createSampler (info: IGFXSamplerInfo): GFXSampler;
    public abstract createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout;
    public abstract createShader (info: IGFXShaderInfo): GFXShader;
    public abstract createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler;
    public abstract createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass;
    public abstract createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer;
    public abstract createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout;
    public abstract createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState;
    public abstract createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator;
    public abstract createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer;
    public abstract createQueue (info: IGFXQueueInfo): GFXQueue;
    public abstract createWindow (info: IGFXWindowInfo): GFXWindow;
    public abstract present ();

    public abstract copyBuffersToTexture (buffers: ArrayBuffer[], texture: GFXTexture, regions: GFXBufferTextureCopy[]);
    public abstract copyTexImagesToTexture (texImages: TexImageSource[], texture: GFXTexture, regions: GFXBufferTextureCopy[]);
    public abstract copyFramebufferToBuffer (srcFramebuffer: GFXFramebuffer, dstBuffer: ArrayBuffer, regions: GFXBufferTextureCopy[]);
    public abstract blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: IGFXRect, dstRect: IGFXRect, filter: GFXFilter);

    public hasFeature (feature: GFXFeature): boolean {
        return this._features[feature];
    }

    public genShaderId (): number {
        return this._shaderIdGen++;
    }

    public defineMacro (macro: string, value?: string) {
        const val = (value !== undefined ? value : '');
        this._macros.set(macro, val);
    }
}
