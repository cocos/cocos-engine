/**
 * @category gfx
 */

import { ccenum } from '../value-types/enum';
import { GFXBindingLayout, IGFXBindingLayoutInfo } from './binding-layout';
import { GFXBuffer, IGFXBufferInfo } from './buffer';
import { GFXCommandAllocator, IGFXCommandAllocatorInfo } from './command-allocator';
import { GFXCommandBuffer, IGFXCommandBufferInfo } from './command-buffer';
import { GFX_MAX_BUFFER_BINDINGS, GFXBufferTextureCopy, GFXFilter, GFXFormat, IGFXMemoryStatus, IGFXRect } from './define';
import { GFXFence, IGFXFenceInfo } from './fence';
import { GFXFramebuffer, IGFXFramebufferInfo } from './framebuffer';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from './input-assembler';
import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from './pipeline-layout';
import { GFXPipelineState, IGFXPipelineStateInfo } from './pipeline-state';
import { GFXQueue, IGFXQueueInfo } from './queue';
import { GFXRenderPass, IGFXRenderPassInfo } from './render-pass';
import { GFXSampler, IGFXSamplerInfo } from './sampler';
import { GFXShader, IGFXShaderInfo } from './shader';
import { GFXTexture, IGFXTextureInfo, IGFXTextureViewInfo } from './texture';

ccenum(GFXFormat);

export enum GFXAPI {
    UNKNOWN,
    GL,
    GLES2,
    GLES3,
    METAL,
    VULKAN,
    DX12,
    WEBGL,
    WEBGL2,
}

export enum GFXFeature {
    COLOR_FLOAT,
    COLOR_HALF_FLOAT,
    TEXTURE_FLOAT,
    TEXTURE_HALF_FLOAT,
    TEXTURE_FLOAT_LINEAR,
    TEXTURE_HALF_FLOAT_LINEAR,
    FORMAT_R11G11B10F,
    FORMAT_D16,
    FORMAT_D16S8,
    FORMAT_D24,
    FORMAT_D24S8,
    FORMAT_D32F,
    FORMAT_D32FS8,
    FORMAT_ETC1,
    FORMAT_ETC2,
    FORMAT_DXT,
    FORMAT_PVRTC,
    FORMAT_ASTC,
    FORMAT_RGB8,
    MSAA,
    ELEMENT_INDEX_UINT,
    INSTANCED_ARRAYS,
    COUNT,
}

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
 * @en GFX Device.
 * @zh GFX 设备。
 */
export abstract class GFXDevice {

    /**
     * @en The HTML canvas element.
     * @zh HTML 画布。
     */
    get canvas (): HTMLCanvasElement {
        return this._canvas as HTMLCanvasElement;
    }

    /**
     * @en The HTML canvas element for 2D rendering.
     * @zh 用于 2D 绘制的 HTML 画布。
     */
    get canvas2D (): HTMLCanvasElement {
        return this._canvas2D as HTMLCanvasElement;
    }

    /**
     * @en Current rendering API.
     * @zh 当前 GFX 使用的渲染 API。
     */
    get gfxAPI (): GFXAPI {
        return this._gfxAPI;
    }

    /**
     * @en GFX queue.
     * @zh GFX 队列。
     */
    get queue (): GFXQueue {
        return this._queue as GFXQueue;
    }

    /**
     * @en Device pixel ratio.
     * @zh DPR 设备像素比。
     */
    get devicePixelRatio (): number {
        return this._devicePixelRatio;
    }

    /**
     * @en Device pixel width.
     * @zh 设备像素宽度。
     */
    get width (): number {
        return this._width;
    }

    /**
     * @en Device pixel height.
     * @zh 设备像素高度。
     */
    get height (): number {
        return this._height;
    }

    /**
     * @en Device native width.
     * @zh 设备原生的像素宽度。
     */
    get nativeWidth (): number {
        return this._nativeWidth;
    }

    /**
     * @en Device native height.
     * @zh 设备原生的像素高度。
     */
    get nativeHeight (): number {
        return this._nativeHeight;
    }

    /**
     * @en Device command allocator.
     * @zh 命令分配器。
     */
    get commandAllocator (): GFXCommandAllocator {
        return this._cmdAllocator as GFXCommandAllocator;
    }

    /**
     * @en Renderer description.
     * @zh 渲染器描述。
     */
    get renderer (): string {
        return this._renderer;
    }

    /**
     * @en Vendor description.
     * @zh 厂商描述。
     */
    get vendor (): string {
        return this._vendor;
    }

    /**
     * @en Max vertex attributes supported.
     * @zh 最大顶点属性数量。
     */
    get maxVertexAttributes (): number {
        return this._maxVertexAttributes;
    }

    /**
     * @en Max vertex uniform vectors supported.
     * @zh 最大顶点Uniform向量数。
     */
    get maxVertexUniformVectors (): number {
        return this._maxVertexUniformVectors;
    }

    /**
     * @en Max fragment uniform vectors supported.
     * @zh 最大片段Uniform向量数。
     */
    get maxFragmentUniformVectors (): number {
        return this._maxFragmentUniformVectors;
    }

    /**
     * @en Max texture units supported.
     * @zh 最大纹理单元数量。
     */
    get maxTextureUnits (): number {
        return this._maxTextureUnits;
    }

    /**
     * @en Max vertex texture units supported.
     * @zh 最大顶点纹理单元数量。
     */
    get maxVertexTextureUnits (): number {
        return this._maxVertexTextureUnits;
    }

    /**
     * @en Max uniform buffer bindings supported.
     * @zh 最大 UniformBuffer 绑定数量。
     */
    get maxUniformBufferBindings (): number {
        return this._maxUniformBufferBindings;
    }

    /**
     * @en Max uniform block size supported.
     * @zh 最大Uniform块大小。
     */
    get maxUniformBlockSize (): number {
        return this._maxUniformBlockSize;
    }

    /**
     * @en Max texture size supported.
     * @zh 最大贴图尺寸。
     */
    get maxTextureSize (): number {
        return this._maxTextureSize;
    }

    /**
     * @en Max cube map texture size supported.
     * @zh 最大立方贴图尺寸。
     */
    get maxCubeMapTextureSize (): number {
        return this._maxCubeMapTextureSize;
    }

    /**
     * @en Device depth bits.
     * @zh 深度位数。
     */
    get depthBits (): number {
        return this._depthBits;
    }

    /**
     * @en Device stencil bits.
     * @zh 模板位数。
     */
    get stencilBits (): number {
        return this._stencilBits;
    }

    /**
     * @en Device color format.
     * @zh 颜色格式。
     */
    get colorFormat (): GFXFormat {
        return this._colorFmt;
    }

    /**
     * @en Device depth stencil format.
     * @zh 深度模板格式。
     */
    get depthStencilFormat (): GFXFormat {
        return this._depthStencilFmt;
    }

    /**
     * @en Device built-in macros.
     * @zh 系统宏定义。
     */
    get macros (): Map<string, string> {
        return this._macros;
    }

    /**
     * @en Number of draw calls currently recorded.
     * @zh 绘制调用次数。
     */
    get numDrawCalls (): number {
        return this._numDrawCalls;
    }

    /**
     * @en Number of instances currently recorded.
     * @zh 绘制 Instance 数量。
     */
    get numInstances (): number {
        return this._numInstances;
    }

    /**
     * @en Number of triangles currently recorded.
     * @zh 渲染三角形数量。
     */
    get numTris (): number {
        return this._numTris;
    }

    /**
     * @en Total memory size currently allocated.
     * @zh 内存状态。
     */
    get memoryStatus (): IGFXMemoryStatus {
        return this._memoryStatus;
    }

    /**
     * @en Is the front face winding order reversed?
     * @zh 是否倒置三角面缠绕顺序？
     */
    get reverseCW (): boolean {
        return this._reverseCW;
    }

    set reverseCW (val: boolean) {
        this._reverseCW = val;
    }

    /**
     * @en The minimum Z value in clip space for the device.
     * @zh 当前设备剪裁空间的最小 z 值。
     */
    get minClipZ () {
        return this._minClipZ;
    }

    /**
     * @en The sign to apply to the Y axis of projection matrices, positive value for pointing upwards.
     * @zh 投影矩阵的 y 轴符号，正值为向上。
     */
    get projectionSignY () {
        return this._projectionSignY;
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
    protected _cmdAllocator: GFXCommandAllocator | null = null;
    protected _maxVertexAttributes: number = 0;
    protected _maxVertexUniformVectors: number = 0;
    protected _maxFragmentUniformVectors: number = 0;
    protected _maxTextureUnits: number = 0;
    protected _maxVertexTextureUnits: number = 0;
    protected _maxUniformBufferBindings: number = GFX_MAX_BUFFER_BINDINGS;
    protected _maxUniformBlockSize: number = 0;
    protected _maxTextureSize: number = 0;
    protected _maxCubeMapTextureSize: number = 0;
    protected _depthBits: number = 0;
    protected _stencilBits: number = 0;
    protected _colorFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _depthStencilFmt: GFXFormat = GFXFormat.UNKNOWN;
    protected _reverseCW: boolean = false;
    protected _shaderIdGen: number = 0;
    protected _macros: Map<string, string> = new Map();
    protected _numDrawCalls: number = 0;
    protected _numInstances: number = 0;
    protected _numTris: number = 0;
    protected _memoryStatus: IGFXMemoryStatus = {
        bufferSize: 0,
        textureSize: 0,
    };
    protected _minClipZ = -1;
    protected _projectionSignY = 1;

    public abstract initialize (info: IGFXDeviceInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize the device.
     * @zh 重置设备大小。
     * @param width The device width.
     * @param height The device height.
     */
    public abstract resize (width: number, height: number): void;

    /**
     * @en Create buffer.
     * @zh 创建缓冲。
     * @param info GFX buffer description info.
     */
    public abstract createBuffer (info: IGFXBufferInfo): GFXBuffer;

    /**
     * @en Create texture.
     * @zh 创建纹理。
     * @param info GFX texture description info.
     */
    public abstract createTexture (info: IGFXTextureInfo | IGFXTextureViewInfo): GFXTexture;

    /**
     * @en Create sampler.
     * @zh 创建采样器。
     * @param info GFX sampler description info.
     */
    public abstract createSampler (info: IGFXSamplerInfo): GFXSampler;

    /**
     * @en Create binding layout.
     * @zh 创建绑定布局。
     * @param info GFX binding layout description info.
     */
    public abstract createBindingLayout (info: IGFXBindingLayoutInfo): GFXBindingLayout;

    /**
     * @en Create shader.
     * @zh 创建着色器。
     * @param info GFX shader description info.
     */
    public abstract createShader (info: IGFXShaderInfo): GFXShader;

    /**
     * @en Create input assembler.
     * @zh 创建纹理。
     * @param info GFX input assembler description info.
     */
    public abstract createInputAssembler (info: IGFXInputAssemblerInfo): GFXInputAssembler;

    /**
     * @en Create render pass.
     * @zh 创建渲染过程。
     * @param info GFX render pass description info.
     */
    public abstract createRenderPass (info: IGFXRenderPassInfo): GFXRenderPass;

    /**
     * @en Create frame buffer.
     * @zh 创建帧缓冲。
     * @param info GFX frame buffer description info.
     */
    public abstract createFramebuffer (info: IGFXFramebufferInfo): GFXFramebuffer;

    /**
     * @en Create pipeline layout.
     * @zh 创建管线布局。
     * @param info GFX pipeline layout description info.
     */
    public abstract createPipelineLayout (info: IGFXPipelineLayoutInfo): GFXPipelineLayout;

    /**
     * @en Create pipeline state.
     * @zh 创建管线状态。
     * @param info GFX pipeline state description info.
     */
    public abstract createPipelineState (info: IGFXPipelineStateInfo): GFXPipelineState;

    /**
     * @en Create command allocator.
     * @zh 创建命令分配器。
     * @param info GFX command allocator description info.
     */
    public abstract createCommandAllocator (info: IGFXCommandAllocatorInfo): GFXCommandAllocator;

    /**
     * @en Create command buffer.
     * @zh 创建命令缓冲。
     * @param info GFX command buffer description info.
     */
    public abstract createCommandBuffer (info: IGFXCommandBufferInfo): GFXCommandBuffer;

    /**
     * @en Create queue.
     * @zh 创建队列。
     * @param info GFX queue description info.
     */
    public abstract createQueue (info: IGFXQueueInfo): GFXQueue;

    /**
     * @en Create fence.
     * @zh 创建同步信号。
     * @param info GFX fence description info.
     */
    public abstract createFence (info: IGFXFenceInfo): GFXFence;

    /**
     * @en Begin current frame.
     * @zh 开始当前帧。
     */
    public abstract acquire (): void;

    /**
     * @en Present current frame.
     * @zh 呈现当前帧。
     */
    public abstract present (): void;

    /**
     * @en Copy buffers to texture.
     * @zh 拷贝缓冲到纹理。
     * @param buffers The buffers to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyBuffersToTexture (buffers: ArrayBufferView[], texture: GFXTexture, regions: GFXBufferTextureCopy[]): void;

    /**
     * @en Copy texture images to texture.
     * @zh 拷贝图像到纹理。
     * @param texImages The texture to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyTexImagesToTexture (texImages: TexImageSource[], texture: GFXTexture, regions: GFXBufferTextureCopy[]): void;

    /**
     * @en Copy frame buffer to buffer.
     * @zh 拷贝帧缓冲到缓冲。
     * @param srcFramebuffer The frame buffer to be copied.
     * @param dstBuffer The buffer to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyFramebufferToBuffer (srcFramebuffer: GFXFramebuffer, dstBuffer: ArrayBuffer, regions: GFXBufferTextureCopy[]): void;

    /**
     * @en Blit frame buffers.
     * @zh 填充帧缓冲。
     * @param src The source frame buffer.
     * @param dst The destination frame buffer.
     * @param srcRect The source region.
     * @param dstRect The target region.
     * @param filter Filtering mode for the process.
     */
    public abstract blitFramebuffer (src: GFXFramebuffer, dst: GFXFramebuffer, srcRect: IGFXRect, dstRect: IGFXRect, filter: GFXFilter): void;

    /**
     * @en Whether the device has specific feature.
     * @zh 是否具备特性。
     * @param feature The GFX feature to be queried.
     */
    public hasFeature (feature: GFXFeature): boolean {
        return this._features[feature];
    }

    /**
     * @en Generate shader ID.
     * @zh 生成 Shader ID。
     */
    public genShaderId (): number {
        return this._shaderIdGen++;
    }

    /**
     * @en Define a macro.
     * @zh 定义宏。
     * @param macro The macro name.
     * @param value The macro value.
     */
    public defineMacro (macro: string, value?: string) {
        const val = (value !== undefined ? value : '');
        this._macros.set(macro, val);
    }
}
