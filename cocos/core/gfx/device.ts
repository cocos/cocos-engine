/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @module gfx
 */

import { ccenum } from '../value-types/enum';
import { gfx } from '../../../exports/base';
import { API, Feature, Filter, Format, MemoryStatus, SurfaceTransform } from './define';
import { Buffer, BufferInfo, BufferViewInfo } from './buffer';
import { BufferTextureCopy, Rect } from './define-class';
import { CommandBuffer, CommandBufferInfo } from './command-buffer';
import { DescriptorSet, DescriptorSetInfo } from './descriptor-set';
import { Fence, FenceInfo } from './fence';
import { Framebuffer, FramebufferInfo } from './framebuffer';
import { InputAssembler, InputAssemblerInfo } from './input-assembler';
import { PipelineState, PipelineStateInfo } from './pipeline-state';
import { Queue, QueueInfo } from './queue';
import { RenderPass, RenderPassInfo } from './render-pass';
import { Sampler, SamplerInfo } from './sampler';
import { Shader, ShaderInfo } from './shader';
import { Texture, TextureInfo, TextureViewInfo } from './texture';

ccenum(Format);

export class BindingMappingInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bufferOffsets: number[] = [],
        public samplerOffsets: number[] = [],
        public flexibleSet: number = 0,
    ) {}
}

export class DeviceInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public canvasElm: HTMLElement,
        public isAntialias: boolean = true,
        public isPremultipliedAlpha: boolean = true,
        public devicePixelRatio: number = 1,
        public nativeWidth: number = 1,
        public nativeHeight: number = 1,
        /**
         * For non-vulkan backends, to maintain compatibility and maximize
         * descriptor cache-locality, descriptor-set-based binding numbers need
         * to be mapped to backend-specific bindings based on the maximum limit
         * of available descriptor slots in each set.
         *
         * The GFX layer assumes the binding numbers for each descriptor type inside each set
         * are guaranteed to be consecutive, so the mapping procedure is reduced
         * to a simple shifting operation. This data structure specifies the
         * offsets for each descriptor type in each set.
         */
        public bindingMappingInfo = new BindingMappingInfo(),
    ) {}
}

/**
 * @en GFX Device.
 * @zh GFX 设备。
 */
export abstract class Device {
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
    get gfxAPI (): API {
        return this._gfxAPI;
    }

    /**
     * @en GFX default queue.
     * @zh GFX 默认队列。
     */
    get queue (): Queue {
        return this._queue as Queue;
    }

    /**
     * @en GFX default command buffer.
     * @zh GFX 默认命令缓冲。
     */
    get commandBuffer (): CommandBuffer {
        return this._cmdBuff as CommandBuffer;
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
     * @zh 最大 uniform 缓冲绑定数量。
     */
    get maxUniformBufferBindings (): number {
        return this._maxUniformBufferBindings;
    }

    /**
     * @en Max uniform block size supported.
     * @zh 最大 uniform 缓冲大小。
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
     * @en Uniform buffer offset alignment.
     * @zh Uniform 缓冲偏移量的对齐单位。
     */
    get uboOffsetAlignment (): number {
        return this._uboOffsetAlignment;
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
    get colorFormat (): Format {
        return this._colorFmt;
    }

    /**
     * @en Device depth stencil format.
     * @zh 深度模板格式。
     */
    get depthStencilFormat (): Format {
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
    get memoryStatus (): MemoryStatus {
        return this._memoryStatus;
    }

    /**
     * @en The minimum Z value in clip space for the device.
     * @zh 裁剪空间的最小 z 值。
     */
    get clipSpaceMinZ () {
        return this._clipSpaceMinZ;
    }

    /**
     * @en The sign of the screen space Y axis, positive if origin at lower-left.
     * @zh 屏幕空间的 y 轴符号，原点在左下角时为正。
     */
    get screenSpaceSignY () {
        return this._screenSpaceSignY;
    }

    /**
     * @en The sign of the UV space Y axis, positive if origin at upper-left.
     * @zh UV 空间的 y 轴符号，原点在左上角时为正。
     */
    get UVSpaceSignY () {
        return this._UVSpaceSignY;
    }

    /**
     * @en The surface transform to be applied in projection matrices.
     * @zh 需要在投影矩阵中应用的表面变换。
     */
    get surfaceTransform () {
        return this._transform;
    }

    protected _canvas: HTMLCanvasElement | null = null;
    protected _canvas2D: HTMLCanvasElement | null = null;
    protected _gfxAPI = API.UNKNOWN;
    protected _transform = SurfaceTransform.IDENTITY;
    protected _deviceName = '';
    protected _renderer = '';
    protected _vendor = '';
    protected _version = '';
    protected _features = new Array<boolean>(Feature.COUNT);
    protected _queue: Queue | null = null;
    protected _cmdBuff: CommandBuffer | null = null;
    protected _devicePixelRatio = 1.0;
    protected _width = 0;
    protected _height = 0;
    protected _nativeWidth = 0;
    protected _nativeHeight = 0;
    protected _maxVertexAttributes = 0;
    protected _maxVertexUniformVectors = 0;
    protected _maxFragmentUniformVectors = 0;
    protected _maxTextureUnits = 0;
    protected _maxVertexTextureUnits = 0;
    protected _maxUniformBufferBindings = 0;
    protected _maxUniformBlockSize = 0;
    protected _maxTextureSize = 0;
    protected _maxCubeMapTextureSize = 0;
    protected _uboOffsetAlignment = 1;
    protected _depthBits = 0;
    protected _stencilBits = 0;
    protected _colorFmt = Format.UNKNOWN;
    protected _depthStencilFmt = Format.UNKNOWN;
    protected _macros = new Map<string, string>();
    protected _numDrawCalls = 0;
    protected _numInstances = 0;
    protected _numTris = 0;
    protected _memoryStatus = new MemoryStatus();
    protected _clipSpaceMinZ = -1;
    protected _screenSpaceSignY = 1;
    protected _UVSpaceSignY = -1;

    public abstract initialize (info: DeviceInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Resize the device.
     * @zh 重置设备大小。
     * @param width The device width.
     * @param height The device height.
     */
    public abstract resize (width: number, height: number): void;

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
     * @en Create command buffer.
     * @zh 创建命令缓冲。
     * @param info GFX command buffer description info.
     */
    public abstract createCommandBuffer (info: CommandBufferInfo): CommandBuffer;

    /**
     * @en Create buffer.
     * @zh 创建缓冲。
     * @param info GFX buffer description info.
     */
    public abstract createBuffer (info: BufferInfo | BufferViewInfo): Buffer;

    /**
     * @en Create texture.
     * @zh 创建纹理。
     * @param info GFX texture description info.
     */
    public abstract createTexture (info: TextureInfo | TextureViewInfo): Texture;

    /**
     * @en Create sampler.
     * @zh 创建采样器。
     * @param info GFX sampler description info.
     */
    public abstract createSampler (info: SamplerInfo): Sampler;

    /**
     * @en Create descriptor sets.
     * @zh 创建描述符集组。
     * @param info GFX descriptor sets description info.
     */
    public abstract createDescriptorSet (info: DescriptorSetInfo): DescriptorSet;

    /**
     * @en Create shader.
     * @zh 创建着色器。
     * @param info GFX shader description info.
     */
    public abstract createShader (info: ShaderInfo): Shader;

    /**
     * @en Create input assembler.
     * @zh 创建纹理。
     * @param info GFX input assembler description info.
     */
    public abstract createInputAssembler (info: InputAssemblerInfo): InputAssembler;

    /**
     * @en Create render pass.
     * @zh 创建渲染过程。
     * @param info GFX render pass description info.
     */
    public abstract createRenderPass (info: RenderPassInfo): RenderPass;

    /**
     * @en Create frame buffer.
     * @zh 创建帧缓冲。
     * @param info GFX frame buffer description info.
     */
    public abstract createFramebuffer (info: FramebufferInfo): Framebuffer;

    /**
     * @en Create descriptor set layout.
     * @zh 创建描述符集布局。
     * @param info GFX descriptor set layout description info.
     */
    public abstract createDescriptorSetLayout (info: gfx.DescriptorSetLayoutInfo): gfx.DescriptorSetLayout;

    /**
     * @en Create pipeline layout.
     * @zh 创建管线布局。
     * @param info GFX pipeline layout description info.
     */
    public abstract createPipelineLayout (info: gfx.PipelineLayoutInfo): gfx.PipelineLayout;

    /**
     * @en Create pipeline state.
     * @zh 创建管线状态。
     * @param info GFX pipeline state description info.
     */
    public abstract createPipelineState (info: PipelineStateInfo): PipelineState;

    /**
     * @en Create queue.
     * @zh 创建队列。
     * @param info GFX queue description info.
     */
    public abstract createQueue (info: QueueInfo): Queue;

    /**
     * @en Create fence.
     * @zh 创建同步信号。
     * @param info GFX fence description info.
     */
    public abstract createFence (info: FenceInfo): Fence;

    /**
     * @en Copy buffers to texture.
     * @zh 拷贝缓冲到纹理。
     * @param buffers The buffers to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyBuffersToTexture (buffers: ArrayBufferView[], texture: Texture, regions: BufferTextureCopy[]): void;

    /**
     * @en Copy texture images to texture.
     * @zh 拷贝图像到纹理。
     * @param texImages The texture to be copied.
     * @param texture The texture to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyTexImagesToTexture (texImages: TexImageSource[], texture: Texture, regions: BufferTextureCopy[]): void;

    /**
     * @en Copy frame buffer to buffer.
     * @zh 拷贝帧缓冲到缓冲。
     * @param srcFramebuffer The frame buffer to be copied.
     * @param dstBuffer The buffer to copy to.
     * @param regions The region descriptions.
     */
    public abstract copyFramebufferToBuffer (srcFramebuffer: Framebuffer, dstBuffer: ArrayBuffer, regions: BufferTextureCopy[]): void;

    /**
     * @en Blit frame buffers.
     * @zh 填充帧缓冲。
     * @param src The source frame buffer.
     * @param dst The destination frame buffer.
     * @param srcRect The source region.
     * @param dstRect The target region.
     * @param filter Filtering mode for the process.
     */
    public abstract blitFramebuffer (src: Framebuffer, dst: Framebuffer, srcRect: Rect, dstRect: Rect, filter: Filter): void;

    /**
     * @en Whether the device has specific feature.
     * @zh 是否具备特性。
     * @param feature The GFX feature to be queried.
     */
    public hasFeature (feature: Feature): boolean {
        return this._features[feature];
    }
}
