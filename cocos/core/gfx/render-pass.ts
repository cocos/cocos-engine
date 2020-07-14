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
    public sampleCount: number = 1;
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    public endLayout: GFXTextureLayout = GFXTextureLayout.PRESENT_SRC;
}

/**
 * @en Depth stencil attachment.
 * @zh GFX 深度模板附件。
 */
export class GFXDepthStencilAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public sampleCount: number = 1;
    public depthLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public depthStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public stencilLoadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public stencilStoreOp: GFXStoreOp = GFXStoreOp.STORE;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.UNDEFINED;
    public endLayout: GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
}

export interface IGFXSubPassInfo {
    bindPoint: GFXPipelineBindPoint;
    inputs: number[];
    colors: number[];
    resolves: number[];
    depthStencil?: number;
    preserves: number[];
}

export interface IGFXRenderPassInfo {
    colorAttachments: GFXColorAttachment[];
    depthStencilAttachment: GFXDepthStencilAttachment | null;
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

    protected _subPasses : IGFXSubPassInfo[] = [];

    protected _hash: number = 0;

    get colorAttachments () { return this._colorInfos; }
    get depthStencilAttachment () { return this._depthStencilInfo; }
    get subPasses () { return this._subPasses; }
    get hash () { return this._hash; }

    constructor (device: GFXDevice) {
        super(GFXObjectType.RENDER_PASS);
        this._device = device;
    }

    public abstract initialize (info: IGFXRenderPassInfo): boolean;

    public abstract destroy (): void;

    // Based on render pass compatibility
    protected computeHash (): number {
        let res = '';
        if (this._subPasses.length) {
            for (let i = 0; i < this._subPasses.length; ++i) {
                const subpass = this._subPasses[i];
                if (subpass.inputs.length) {
                    res += 'ia';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ia = this._colorInfos[subpass.inputs[j]];
                        res += `,${ia.format},${ia.sampleCount}`;
                    }
                }
                if (subpass.colors.length) {
                    res += 'ca';
                    for (let j = 0; j < subpass.inputs.length; ++j) {
                        const ca = this._colorInfos[subpass.inputs[j]];
                        res += `,${ca.format},${ca.sampleCount}`;
                    }
                }
                if (subpass.depthStencil !== undefined) {
                    const ds = this._colorInfos[subpass.depthStencil];
                    res += `ds,${ds.format},${ds.sampleCount}`;
                }
            }
        } else {
            res += 'ca';
            for (let i = 0; i < this._colorInfos.length; ++i) {
                const ca = this._colorInfos[i];
                res += `,${ca.format},${ca.sampleCount}`;
            }
            const ds = this._depthStencilInfo;
            if (ds) {
                res += `ds,${ds.format},${ds.sampleCount}`;
            }
        }

        return murmurhash2_32_gc(res, 666);
    }
}
