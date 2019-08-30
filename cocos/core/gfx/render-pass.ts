/**
 * @category gfx
 */

import {
    GFXFormat,
    GFXLoadOp,
    GFXObject,
    GFXObjectType,
    GFXPipelineBindPoint,
    GFXStoreOp,
    GFXTextureLayout,
} from './define';
import { GFXDevice } from './device';

/**
 * @zh
 * GFX颜色附件。
 */
export class GFXColorAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    public sampleCount: number = 1;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
    public endLayout: GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
}

/**
 * @zh
 * GFX深度模板附件。
 */
export class GFXDepthStencilAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public depthLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public depthStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public stencilLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public stencilStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public sampleCount: number = 1;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
    public endLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
}

/**
 * @zh
 * GFX子过程描述信息。
 */
export interface IGFXSubPassInfo {
    bindPoint: GFXPipelineBindPoint;
    inputs: number[];
    colors: number[];
    resolves: number[];
    depthStencil: number;
    preserves: number[];
}

/**
 * @zh
 * GFX渲染过程描述信息。
 */
export interface IGFXRenderPassInfo {
    colorAttachments?: GFXColorAttachment[];
    depthStencilAttachment?: GFXDepthStencilAttachment;
    // subPasses? : GFXSubPassInfo[];
}

/**
 * @zh
 * GFX渲染过程。
 */
export abstract class GFXRenderPass extends GFXObject {

    /**
     * @zh
     * GFX设备。
     */
    protected _device: GFXDevice;

    /**
     * @zh
     * GFX颜色附件数组。
     */
    protected _colorInfos: GFXColorAttachment[] = [];

    /**
     * @zh
     * GFX深度模板附件。
     */
    protected _depthStencilInfo: GFXDepthStencilAttachment | null = null;

    /**
     * 构造函数。
     * @param device GFX设备。
     */
    constructor (device: GFXDevice) {
        super(GFXObjectType.RENDER_PASS);
        this._device = device;
    }

    /**
     * @zh
     * 提交命令缓冲数组。
     * @param info GFX渲染过程描述信息。
     */
    public abstract initialize (info: IGFXRenderPassInfo): boolean;

    /**
     * @zh
     * 销毁函数。
     */
    public abstract destroy (): void;
    // protected _subPasses : GFXSubPassInfo[] = [];
}
