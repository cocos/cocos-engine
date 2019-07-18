/**
 * @category gfx
 */

import { CCEnum } from '../core/value-types/enum';
import { GFXBindingLayout, IGFXBindingLayoutInfo } from './binding-layout';
import { GFXBuffer, IGFXBufferInfo } from './buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from './command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from './command-buffer';
import { GFX_MAX_BUFFER_BINDINGS, GFXBufferTextureCopy, GFXFilter, GFXFormat, IGFXMemoryStatus, IGFXRect } from './define';
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

CCEnum(GFXFormat);

/**
 * @zh
 * GFX API。
 */
export enum GFXAPI {
    UNKNOWN,
    WEBGL,
    WEBGL2,
}

/**
 * @zh
 * GFX特性。
 */
export enum GFXFeature {
    COLOR_FLOAT,
    COLOR_HALF_FLOAT,
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    TEXTURE_FLOAT_LINEAR,
    TEXTURE_HALF_FLOAT_LINEAR,
    FORMAT_R11G11B10F,
    FORMAT_D24S8,
    FORMAT_ETC1,
    FORMAT_ETC2,
    FORMAT_DXT,
    FORMAT_PVRTC,
    MSAA,
    COUNT,
}

/**
 * @zh
 * GFX设备描述信息。
 */
export interface IGFXDeviceInfo {
    canvasElm: HTMLElement;
    isAntialias?: boolean;
    isPremultipliedAlpha?: boolean;
    debug?: boolean;
    devicePixelRatio?: number;
    nativeWidth?: number;
    nativeHeight?: number;
}

/**
 * @zh
 * GFX设备。
 */
// tslint:disable: max-line-length
export abstract class GFXDevice {

    /**
     * @zh
     * HTML画布。
     */
    public get canvas (): HTMLCanvasElement {
        return this._canvas as HTMLCanvasElement;
    }

    /**
     * @zh
     * 用于2D绘制的HTML画布。
     */
    public get canvas2D (): HTMLCanvasElement {
        return this._canvas2D as HTMLCanvasElement;
    }

    /**
     * @zh
     * GFX API。
     */
    public get gfxAPI (): GFXAPI {
        return this._gfxAPI;
    }

    /**
     * @zh
     * GFX队列。
     */
    public get queue (): GFXQueue {
        return this._queue as GFXQueue;
    }

    /**
     * @zh
     * DPR 设备像素比。
     */
    public get devicePixelRatio (): number {
        return this._devicePixelRatio;
    }

    /**
     * @zh
     * 设备像素宽度。
     */
    public get width (): number {
        return this._width;
    }

    /**
     * @zh
     * 设备像素高度。
     */
    public get height (): number {
        return this._height;
    }

    /**
     * @zh
     * 设备原生的像素宽度。
     */
    public get nativeWidth (): number {
        return this._nativeWidth;
    }

    /**
     * @zh
     * 设备原生的像素高度。
     */
    public get nativeHeight (): number {
        return this._nativeHeight;
    }

    /**
     * @zh
     * 设备主窗口。
     */
    public get mainWindow (): GFXWindow {
        return this._mainWindow as GFXWindow;
    }

    /**
     * @zh
     * 命令分配器。
     */
    public get commandAllocator (): GFXCommandAllocator {
        return this._cmdAllocator as GFXCommandAllocator;
    }

    /**
     * @zh
     * 渲染器描述。
     */
    public get renderer (): string {
        return this._renderer;
    }

    /**
     * @zh
     * 厂商描述。
     */
    public get vendor (): string {
        return this._vendor;
    }

    /**
     * @zh
     * 最大顶点属性数量。
     */
    public get maxVertexAttributes (): number {
        return this._maxVertexAttributes;
    }

    /**
     * @zh
     * 最大顶点Uniform向量数。
     */
    public get maxVertexUniformVectors (): number {
        return this._maxVertexUniformVectors;
    }

    /**
     * @zh
     * 最大片段Uniform向量数。
     */
    public get maxFragmentUniformVectors (): number {
        return this._maxFragmentUniformVectors;
    }

    /**
     * @zh
     * 最大纹理单元数量。
     */
    public get maxTextureUnits (): number {
        return this._maxTextureUnits;
    }

    /**
     * @zh
     * 最大顶点纹理单元数量。
     */
    public get maxVertexTextureUnits (): number {
        return this._maxVertexTextureUnits;
    }

    /**
     * @zh
     * 最大UniformBuffer绑定数量。
     */
    public get maxUniformBufferBindings (): number {
        return this._maxUniformBufferBindings;
    }

    /**
     * @zh
     * 最大Uniform块大小。
     */
    public get maxUniformBlockSize (): number {
        return this._maxUniformBlockSize;
    }

    /**
     * @zh
     * 深度位数。
     */
    public get depthBits (): number {
        return this._depthBits;
    }

    /**
     * @zh
     * 模板位数。
     */
    public get stencilBits (): number {
        return this._stencilBits;
    }

    /**
     * @zh
     * 颜色格式。
     */
    public get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    /**
     * @zh
     * 深度模板格式。
     */
    public get depthStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
    }

    /**
     * @zh
     * 系统宏定义。
     */
    public get macros (): Map<string, string> {
        return this._macros;
    }

    /**
     * @zh
     * 绘制调用次数。
     */
    public get numDrawCalls (): number {
        return this._numDrawCalls;
    }

    /**
     * @zh
     * 渲染三角形数量。
     */
    public get numTris (): number {
        return this._numTris;
    }

    /**
     * @zh
     * 内存状态。
     */
    public get memoryStatus (): IGFXMemoryStatus {
        return this._memoryStatus;
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
    protected _devicePixelRatio: number = 1.0;
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
    protected _depthBits: number = 0;
    protected _stencilBits: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _shaderIdGen: number = 0;
    protected _macros: Map<string, string> = new Map();
    protected _numDrawCalls: number = 0;
    protected _numTris: number = 0;
    protected _memoryStatus: IGFXMemoryStatus = {
        bufferSize: 0,
        textureSize: 0,
    };

    /**
     * @zh
     * 初始化函数。
     * @param info GFX设备描述信息。
     */
    public abstract initialize (info: IGFXDeviceInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy (): void;

    /**
     * @zh
     * 重置设备大小。
     * @param width 设备宽度。
     * @param height 设备高度。
     */
    public abstract resize (width: number, height: number);

    /**
     * @zh
     * 创建缓冲。
     * @param info GFX缓冲描述信息。
     */
    public abstract createBuffer (info: IGFXBufferInfo): GFXBuffer;

    /**
     * @zh
     * 创建纹理。
     * @param info GFX纹理描述信息。
     */
    public abstract createTexture (info: IGFXTextureInfo): GFXTexture;

    /**
     * @zh
     * 创建纹理视图。
     * @param info GFX纹理视图描述信息。
     */
    public abstract createTextureView (info: IGFXTextureViewInfo): GFXTextureView;

    /**
     * @zh
     * 创建采样器。
     * @param info GFX采样器描述信息。
     */
    public abstract createSampler (info: IGFXSamplerInfo): GFXSampler;

    /**
     * @zh
     * 创建绑定布局。
     * @param info GFX绑定布局描述信息。
     */
    public abstract createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout;

    /**
     * @zh
     * 创建着色器。
     * @param info GFX着色器描述信息。
     */
    public abstract createShader (info: IGFXShaderInfo): GFXShader;

    /**
     * @zh
     * 创建纹理。
     * @param info GFX纹理描述信息。
     */
    public abstract createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler;

    /**
     * @zh
     * 创建渲染过程。
     * @param info GFX渲染过程描述信息。
     */
    public abstract createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass;

    /**
     * @zh
     * 创建帧缓冲。
     * @param info GFX帧缓冲描述信息。
     */
    public abstract createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer;

    /**
     * @zh
     * 创建管线布局。
     * @param info GFX管线布局描述信息。
     */
    public abstract createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout;

    /**
     * @zh
     * 创建管线状态。
     * @param info GFX管线状态描述信息。
     */
    public abstract createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState;

    /**
     * @zh
     * 创建命令分配器。
     * @param info GFX命令分配器描述信息。
     */
    public abstract createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator;

    /**
     * @zh
     * 创建命令缓冲。
     * @param info GFX命令缓冲描述信息。
     */
    public abstract createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer;

    /**
     * @zh
     * 创建队列。
     * @param info GFX队列描述信息。
     */
    public abstract createQueue (info: IGFXQueueInfo): GFXQueue;

    /**
     * @zh
     * 创建窗口。
     * @param info GFX窗口描述信息。
     */
    public abstract createWindow (info: IGFXWindowInfo): GFXWindow;

    /**
     * @zh
     * 呈现当前帧。
     */
    public abstract present ();

    /**
     * @zh
     * 拷贝缓冲到纹理。
     * @param buffers 缓冲数组。
     * @param texture GFX纹理。
     * @param regions GFX缓冲纹理拷贝区域信息。
     */
    public abstract copyBuffersToTexture (buffers: ArrayBuffer[], texture: GFXTexture, regions: GFXBufferTextureCopy[]);

    /**
     * @zh
     * 拷贝图像到纹理。
     * @param texImages 图像数据源。
     * @param texture GFX纹理。
     * @param regions GFX缓冲纹理拷贝区域信息。
     */
    public abstract copyTexImagesToTexture (texImages: TexImageSource[], texture: GFXTexture, regions: GFXBufferTextureCopy[]);

    /**
     * @zh
     * 拷贝帧缓冲到缓冲。
     * @param srcFramebuffer 源帧缓冲。
     * @param dstBuffer 目的缓冲。
     * @param regions GFX缓冲纹理拷贝区域信息。
     */
    public abstract copyFramebufferToBuffer (srcFramebuffer: GFXFramebuffer, dstBuffer: ArrayBuffer, regions: GFXBufferTextureCopy[]);

    /**
     * @zh
     * 填充帧缓冲。
     * @param src 源帧缓冲。
     * @param dst 目的帧缓冲。
     * @param srcRect 源矩形区域。
     * @param dstRect 目的矩形区域。
     * @param filter 过滤模式。
     */
    public abstract blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: IGFXRect, dstRect: IGFXRect, filter: GFXFilter);

    /**
     * @zh
     * 是否具备特性。
     * @param feature GFX特性。
     */
    public hasFeature (feature: GFXFeature): boolean {
        return this._features[feature];
    }

    /**
     * @zh
     * 生成 Shader ID。
     */
    public genShaderId (): number {
        return this._shaderIdGen++;
    }

    /**
     * @zh
     * 定义宏。
     * @param macro 宏。
     * @param value 值。
     */
    public defineMacro (macro: string, value?: string) {
        const val = (value !== undefined ? value : '');
        this._macros.set(macro, val);
    }
}
