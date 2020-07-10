/**
 * @category gfx
 */

import { GFXBindingLayout } from './binding-layout';
import { GFXBuffer } from './buffer';
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
import { GFXRenderPass } from './render-pass';
import { GFXQueue } from './queue';

export interface IGFXCommandBufferInfo {
    queue: GFXQueue;
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
    get type (): GFXCommandBufferType {
        return this._type;
    }

    /**
     * @en Type of the command buffer.
     * @zh 命令缓冲类型。
     */
    get queue (): GFXQueue {
        return this._queue!;
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
     * @zh 绘制三角形数量。
     */
    get numTris (): number {
        return this._numTris;
    }

    protected _device: GFXDevice;

    protected _queue: GFXQueue | null = null;

    protected _type: GFXCommandBufferType = GFXCommandBufferType.PRIMARY;

    protected _numDrawCalls: number = 0;

    protected _numInstances: number = 0;

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
     * @param renderPass [Secondary Command Buffer Only] The render pass the subsequent commands will be executed in
     * @param subpass [Secondary Command Buffer Only] The subpass the subsequent commands will be executed in
     * @param frameBuffer [Secondary Command Buffer Only, Optional] The framebuffer to be used in the subpass
     */
    public abstract begin (renderPass?: GFXRenderPass, subpass?: number, frameBuffer?: GFXFramebuffer): void;

    /**
     * @en End recording commands.
     * @zh 结束记录命令。
     */
    public abstract end (): void;

    /**
     * @en Begin render pass.
     * @zh 开始 RenderPass。
     * @param framebuffer The frame buffer used.
     * @param renderArea The target render area.
     * @param clearFlag The clear flags.
     * @param clearColors The clearing colors.
     * @param clearDepth The clearing depth.
     * @param clearStencil The clearing stencil.
     */
    public abstract beginRenderPass (renderPass: GFXRenderPass, framebuffer: GFXFramebuffer, renderArea: IGFXRect, clearColors: IGFXColor[], clearDepth: number, clearStencil: number): void;

    /**
     * @en End render pass.
     * @zh 结束 RenderPass。
     */
    public abstract endRenderPass (): void;

    /**
     * @en Bind pipeline state.
     * @zh 绑定 GFX 管线状态。
     * @param pipelineState The pipeline state to be bound.
     */
    public abstract bindPipelineState (pipelineState: GFXPipelineState): void;

    /**
     * @en Bind binding layout.
     * @zh 绑定 GFX 绑定布局。
     * @param bindingLayout The binding layout to be bound.
     */
    public abstract bindBindingLayout (bindingLayout: GFXBindingLayout): void;

    /**
     * @en Bind input assembler.
     * @zh 绑定GFX输入汇集器。
     * @param inputAssembler The input assembler to be bound.
     */
    public abstract bindInputAssembler (inputAssembler: GFXInputAssembler): void;

    /**
     * @en Set viewport.
     * @zh 设置视口。
     * @param viewport The new viewport.
     */
    public abstract setViewport (viewport: IGFXViewport): void;

    /**
     * @en Set scissor range.
     * @zh 设置剪裁区域。
     * @param scissor The new scissor range.
     */
    public abstract setScissor (scissor: IGFXRect): void;

    /**
     * @en Set line width.
     * @zh 设置线宽。
     * @param lineWidth The new line width.
     */
    public abstract setLineWidth (lineWidth: number): void;

    /**
     * @en Set depth bias.
     * @zh 设置深度偏移。
     * @param depthBiasConstantFactor The new depth bias factor.
     * @param depthBiasClamp The new depth bias clamp threshold.
     * @param depthBiasSlopeFactor  The new depth bias slope factor.
     */
    public abstract setDepthBias (depthBiasConstantFactor: number, depthBiasClamp: number, depthBiasSlopeFactor: number): void;

    /**
     * @en Set blend constants.
     * @zh 设置混合因子。
     * @param blendConstants The new blend constants.
     */
    public abstract setBlendConstants (blendConstants: number[]): void;

    /**
     * @en Set depth bound.
     * @zh 设置深度边界。
     * @param minDepthBounds The new minimum depth bound.
     * @param maxDepthBounds The new maximum depth bound.
     */
    public abstract setDepthBound (minDepthBounds: number, maxDepthBounds: number): void;

    /**
     * @en Set stencil write mask.
     * @zh 设置模板写掩码。
     * @param face The effective triangle face.
     * @param writeMask The new stencil write mask.
     */
    public abstract setStencilWriteMask (face: GFXStencilFace, writeMask: number): void;

    /**
     * @en Set stencil compare mask.
     * @zh 设置模板比较掩码。
     * @param face The effective triangle face.
     * @param reference The new stencil reference constant.
     * @param compareMask The new stencil read mask.
     */
    public abstract setStencilCompareMask (face: GFXStencilFace, reference: number, compareMask: number): void;

    /**
     * @en Draw the specified primitives.
     * @zh 绘制。
     * @param inputAssembler The target input assembler.
     */
    public abstract draw (inputAssembler: GFXInputAssembler): void;

    /**
     * @en Update buffer.
     * @zh 更新缓冲。
     * @param buffer The buffer to be updated.
     * @param data The source data.
     * @param offset Offset into the buffer.
     */
    public abstract updateBuffer (buffer: GFXBuffer, data: ArrayBuffer, offset?: number): void;

    /**
     * @en Copy buffer to texture.
     * @zh 拷贝缓冲到纹理。
     * @param srcBuff The buffer to be copied.
     * @param dstTex The texture to copy to.
     * @param dstLayout The target texture layout.
     * @param regions The region descriptions.
     */
    public abstract copyBufferToTexture (srcBuff: GFXBuffer, dstTex: GFXTexture, dstLayout: GFXTextureLayout, regions: GFXBufferTextureCopy[]): void;

    /**
     * @en Execute specified command buffers.
     * @zh 执行一组命令缓冲。
     * @param cmdBuffs The command buffers to be executed.
     * @param count The number of command buffers to be executed.
     */
    public abstract execute (cmdBuffs: GFXCommandBuffer[], count: number): void;
}
