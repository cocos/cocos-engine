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
import { murmurhash2_32_gc } from '../utils/murmurhash2_gc';

/**
 * @en Color attachment.
 * @zh GFX 颜色附件。
 */
export class GFXColorAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    public sampleCount: number = 1;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    public endLayout: GFXTextureLayout = GFXTextureLayout.PRESENT_SRC;
}

/**
 * @en Depth stencil attachment.
 * @zh GFX 深度模板附件。
 */
export class GFXDepthStencilAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public depthLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public depthStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public stencilLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public stencilStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public sampleCount: number = 1;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    public endLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
}

export interface IGFXSubPassInfo {
    bindPoint: GFXPipelineBindPoint;
    inputs: number[];
    colors: number[];
    resolves: number[];
    depthStencil: number;
    preserves: number[];
}

export interface IGFXRenderPassInfo {
    colorAttachments: GFXColorAttachment[];
    depthStencilAttachment: GFXDepthStencilAttachment;
    subPasses?: IGFXSubPassInfo[];
}

/**
 * @en GFX render pass.
 * @zh GFX 渲染过程。
 */
export abstract class GFXRenderPass extends GFXObject {

    protected _device: GFXDevice;

    protected _colorInfos: GFXColorAttachment[] = [];

    protected _depthStencilInfo: GFXDepthStencilAttachment | null = null;
    protected _hash: number = 0;

    // protected _subPasses : GFXSubPassInfo[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.RENDER_PASS);
        this._device = device;
    }

    public abstract initialize (info: IGFXRenderPassInfo): boolean;

    public abstract destroy (): void;
    public get hash (): number { return this._hash; }

    protected computeHash (): number {
        let res = 'ca';
        for (let i = 0; i < this._colorInfos.length; ++i) {
            const ca = this._colorInfos[i];
            res += `,${ca.format},${ca.loadOp},${ca.storeOp},${ca.sampleCount},${ca.beginLayout},${ca.endLayout}`;
        }

        const ds = this._depthStencilInfo;
        if (ds) {
            res += `ds,${ds.format},${ds.depthLoadOp},${ds.depthStoreOp},${ds.stencilLoadOp},
                    ${ds.stencilStoreOp},${ds.beginLayout},${ds.endLayout}`;
        }

        return murmurhash2_32_gc(res, 666);
    }
}
