/**
 * @category gfx
 */

import { GFXBindingLayout } from './binding-layout';
import { GFXBuffer } from './buffer';
import { GFXCommandAllocator } from './command-allocator';
import {
    GFXBufferTextureCopy,
    GFXClearFlag,
    GFXCommandBufferType,
    GFXObject,
    GFXObjectType,
    GFXStencilFace,
    GFXTextureLayout,
    IGFXColor,
    IGFXRect,
    IGFXViewport,
} from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineState } from './pipeline-state';
import { GFXTexture } from './texture';

export interface IGFXCommandBufferInfo {
    allocator: GFXCommandAllocator;
    type: GFXCommandBufferType;
}

export interface IGFXDepthBias {
    constantFactor: number;
    clamp: number;
    slopeFactor: number;
}

export interface IGFXDepthBounds {
    minBounds: number;
    maxBounds: number;
}

export interface IGFXStencilWriteMask {
    face: GFXStencilFace;
    writeMask: number;
}

export interface IGFXStencilCompareMask {
    face: GFXStencilFace;
    reference: number;
    compareMask: number;
}

/**
 * @en GFX command buffer.
 * @zh GFX 命令缓冲。
 */
// tslint:disable: max-line-length
export abstract class GFXCommandBuffer extends GFXObject {

    /**
     * @en Type of the command buffer.
     * @zh 命令缓冲类型。
     */
    public get type (): GFXCommandBufferType {
        return this._type;
    }

    /**
     * @en Number of draw calls currently recorded.
     * @zh 绘制调用次数。
     */
    public get numDrawCalls (): number {
        return this._numDrawCalls;
    }

    /**
     * @en Number of triangles currently recorded.
     * @zh 绘制三角形数量。
     */
    public get numTris (): number {
        return this._numTris;
    }

    protected _device: GFXDevice;

    protected _allocator: GFXCommandAllocator | null = null;

    protected _type: GFXCommandBufferType = GFXCommandBufferType.PRIMARY;

    protected _numDrawCalls: number = 0;

    protected _numTris: number = 0;

    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_BUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXCommandBufferInfo): boolean;

    public abstract destroy (): void;

    /**
     * @en Begin recording commands.
     * @zh 开始记录命令。
     */
    public abstract begin (): void;

    /**
     * @en End recording commands.
     * @zh 结束记录命令。
     */
    public abstract end (): void;

    /**
     * @en Begin render pass.
     * @zh 开始 RenderPass。
     * @param framebuffer GFX 帧缓冲。
     * @param renderArea 渲染区域。
     * @param clearFlag 清除标识。
     * @param clearColors 清除颜色数组。
     * @param clearDepth 清除深度值。
     * @param clearStencil 清除模板值。
     */
    public abstract beginRenderPass (framebuffer: GFXFramebuffer, renderArea: IGFXRect, clearFlag: GFXClearFlag, clearColors: IGFXColor[], clearDepth: number, clearStencil: number): void;

    /**
     * @en End render pass.
     * @zh 结束 RenderPass。
     */
    public abstract endRenderPass (): void;

    /**
     * @en Bind pipeline state.
     * @zh 绑定 GFX 管线状态。
     * @param pipelineState GFX 管线状态。
     */
    public abstract bindPipelineState (pipelineState: GFXPipelineState): void;

    /**
     * @en Bind binding layout.
     * @zh 绑定 GFX 绑定布局。
     * @param bindingLayout GFX 绑定布局。
     */
    public abstract bindBindingLayout (bindingLayout: GFXBindingLayout): void;

    /**
     * @en Bind input assembler.
     * @zh 绑定GFX输入汇集器。
     * @param inputAssembler GFX 输入汇集器。
     */
    public abstract bindInputAssembler (inputAssembler: GFXInputAssembler): void;

    /**
     * @en Set viewport.
     * @zh 设置视口。
     * @param viewport 视口。
     */
    public abstract setViewport (viewport: IGFXViewport): void;

    /**
     * @en Set scissor range.
     * @zh 设置剪裁区域。
     * @param scissor 剪裁区域。
     */
    public abstract setScissor (scissor: IGFXRect): void;

    /**
     * @en Set line width.
     * @zh 设置线宽。
     * @param lineWidth 线的宽度。
     */
    public abstract setLineWidth (lineWidth: number): void;

    /**
     * @en Set depth bias.
     * @zh 设置深度偏移。
     * @param depthBiasConstantFacotr
     * @param depthBiasClamp
     * @param depthBiasSlopeFactor
     */
    public abstract setDepthBias (depthBiasConstantFacotr: number, depthBiasClamp: number, depthBiasSlopeFactor: number): void;

    /**
     * @en Set blend constants.
     * @zh 设置混合因子。
     * @param blendConstants 混合因子。
     */
    public abstract setBlendConstants (blendConstants: number[]): void;

    /**
     * @en Set depth bound.
     * @zh 设置深度边界。
     * @param minDepthBounds 最小深度边界。
     * @param maxDepthBounds 最大深度边界。
     */
    public abstract setDepthBound (minDepthBounds: number, maxDepthBounds: number): void;

    /**
     * @en Set stencil write mask.
     * @zh 设置模板写掩码。
     * @param face 三角面朝向。
     * @param writeMask 写掩码。
     */
    public abstract setStencilWriteMask (face: GFXStencilFace, writeMask: number): void;

    /**
     * @en Set stencil compare mask.
     * @zh 设置模板比较掩码。
     * @param face 三角面朝向。
     * @param reference 参考值。
     * @param compareMask 比较掩码。
     */
    public abstract setStencilCompareMask (face: GFXStencilFace, reference: number, compareMask: number): void;

    /**
     * @en Draw the specified primitives.
     * @zh 绘制。
     * @param inputAssembler GFX 输入汇集器。
     */
    public abstract draw (inputAssembler: GFXInputAssembler): void;

    /**
     * @en Update buffer.
     * @zh 更新缓冲。
     * @param buffer GFX 缓冲。
     * @param data 数据源。
     * @param offset 目的缓冲的偏移量。
     */
    public abstract updateBuffer (buffer: GFXBuffer, data: ArrayBuffer, offset?: number): void;

    /**
     * @en Copy buffer to texture.
     * @zh 拷贝缓冲到纹理。
     * @param srcBuff 源 GFX 缓冲。
     * @param dstTex 目的 GFX 纹理。
     * @param dstLayout 目的纹理布局。
     * @param regions 拷贝区域数组。
     */
    public abstract copyBufferToTexture (srcBuff: GFXBuffer, dstTex: GFXTexture, dstLayout: GFXTextureLayout, regions: GFXBufferTextureCopy[]): void;

    /**
     * @en Execute specified command buffers.
     * @zh 执行一组命令缓冲。
     * @param cmdBuffs 命令缓冲数组。
     * @param count 执行命令缓冲的数组数量。
     */
    public abstract execute (cmdBuffs: GFXCommandBuffer[], count: number): void;
}
