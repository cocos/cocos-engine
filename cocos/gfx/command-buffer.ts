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

/**
 * @zh
 * GFX命令缓冲描述信息
 */
export interface IGFXCommandBufferInfo {
    allocator: GFXCommandAllocator;
    type: GFXCommandBufferType;
}

/**
 * @zh
 * GFX深度便宜
 */
export interface IGFXDepthBias {
    constantFactor: number;
    clamp: number;
    slopeFactor: number;
}

/**
 * @zh
 * GFX深度边界
 */
export interface IGFXDepthBounds {
    minBounds: number;
    maxBounds: number;
}

/**
 * @zh
 * GFX模板写掩码
 */
export interface IGFXStencilWriteMask {
    face: GFXStencilFace;
    writeMask: number;
}

/**
 * @zh
 * GFX模板比较掩码
 */
export interface IGFXStencilCompareMask {
    face: GFXStencilFace;
    reference: number;
    compareMask: number;
}

/**
 * @zh
 * GFX命令缓冲
 */
// tslint:disable: max-line-length
export abstract class GFXCommandBuffer extends GFXObject {

    /**
     * @zh
     * 命令缓冲类型
     */
    public get type (): GFXCommandBufferType {
        return this._type;
    }

    /**
     * @zh
     * 绘制调用次数
     */
    public get numDrawCalls (): number {
        return this._numDrawCalls;
    }

    /**
     * @zh
     * 绘制三角形数量
     */
    public get numTris (): number {
        return this._numTris;
    }

    /**
     * @zh
     * GFX设备
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX命令缓冲分配器
     */
    protected _allocator: GFXCommandAllocator | null = null;

    /**
     * @zh
     * 命令缓冲类型
     */
    protected _type: GFXCommandBufferType = GFXCommandBufferType.PRIMARY;

    /**
     * @zh
     * 绘制调用次数
     */
    protected _numDrawCalls: number = 0;

    /**
     * @zh
     * 绘制三角形数量
     */
    protected _numTris: number = 0;

    /**
     * @zh
     * 构造函数
     * @param device GFX设备
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_BUFFER);
        this._device = device;
    }

    /**
     * @zh
     * 初始化函数
     * @param info GFX命令缓冲描述信息
     */
    public abstract initialize (info: IGFXCommandBufferInfo): boolean;

    /**
     * @zh
     * 销毁函数
     */
    public abstract destroy ();

    /**
     * @zh
     * 开始记录命令
     */
    public abstract begin ();

    /**
     * @zh
     * 结束记录命令
     */
    public abstract end ();

    /**
     * @zh
     * 开始RenderPass
     * @param framebuffer GFX帧缓冲
     * @param renderArea 渲染区域
     * @param clearFlag 清除标识
     * @param clearColors 清除颜色数组
     * @param clearDepth 清除深度值
     * @param clearStencil 清除模板值
     */
    public abstract beginRenderPass (framebuffer: GFXFramebuffer, renderArea: IGFXRect, clearFlag: GFXClearFlag, clearColors: IGFXColor[], clearDepth: number, clearStencil: number);

    /**
     * @zh
     * 结束RenderPass
     */
    public abstract endRenderPass ();

    /**
     * @zh
     * 绑定GFX管线状态
     * @param pipelineState GFX管线状态
     */
    public abstract bindPipelineState (pipelineState: GFXPipelineState);

    /**
     * @zh
     * 绑定GFX绑定布局
     * @param bindingLayout GFX绑定布局
     */
    public abstract bindBindingLayout (bindingLayout: GFXBindingLayout);

    /**
     * @zh
     * 绑定GFX输入汇集器
     * @param inputAssembler GFX输入汇集器
     */
    public abstract bindInputAssembler (inputAssembler: GFXInputAssembler);

    /**
     * @zh
     * 设置视口
     * @param viewport 视口
     */
    public abstract setViewport (viewport: IGFXViewport);

    /**
     * @zh
     * 设置剪裁区域
     * @param scissor 剪裁区域
     */
    public abstract setScissor (scissor: IGFXRect);

    /**
     * @zh
     * 设置线宽
     * @param lineWidth 线的宽度
     */
    public abstract setLineWidth (lineWidth: number);

    /**
     * @zh
     * 设置深度偏移
     * @param depthBiasConstantFacotr
     * @param depthBiasClamp
     * @param depthBiasSlopeFactor
     */
    public abstract setDepthBias (depthBiasConstantFacotr: number, depthBiasClamp: number, depthBiasSlopeFactor: number);

    /**
     * @zh
     * 设置混合因子
     * @param blendConstants 混合因子
     */
    public abstract setBlendConstants (blendConstants: number[]);

    /**
     * @zh
     * 设置深度边界
     * @param minDepthBounds 最小深度边界
     * @param maxDepthBounds 最大深度边界
     */
    public abstract setDepthBound (minDepthBounds: number, maxDepthBounds: number);

    /**
     * @zh
     * 设置模板写掩码
     * @param face 三角面朝向
     * @param writeMask 写掩码
     */
    public abstract setStencilWriteMask (face: GFXStencilFace, writeMask: number);

    /**
     * @zh
     * 设置模板比较掩码
     * @param face 三角面朝向
     * @param reference 参考值
     * @param compareMask 比较掩码
     */
    public abstract setStencilCompareMask (face: GFXStencilFace, reference: number, compareMask: number);

    /**
     * @zh
     * 绘制
     * @param inputAssembler GFX输入汇集器
     */
    public abstract draw (inputAssembler: GFXInputAssembler);

    /**
     * @zh
     * 更新缓冲
     * @param buffer GFX缓冲
     * @param data 数据源
     * @param offset 目的缓冲的偏移量
     */
    public abstract updateBuffer (buffer: GFXBuffer, data: ArrayBuffer, offset?: number);

    /**
     * @zh
     * 拷贝缓冲到纹理
     * @param srcBuff 源GFX缓冲
     * @param dstTex 目的GFX纹理
     * @param dstLayout 目的纹理布局
     * @param regions 拷贝区域数组
     */
    public abstract copyBufferToTexture (srcBuff: GFXBuffer, dstTex: GFXTexture, dstLayout: GFXTextureLayout, regions: GFXBufferTextureCopy[]);

    /**
     * @zh
     * 执行一组命令缓冲
     * @param cmdBuffs 命令缓冲数组
     * @param count 执行命令缓冲的数组数量
     */
    public abstract execute (cmdBuffs: GFXCommandBuffer[], count: number);
}
