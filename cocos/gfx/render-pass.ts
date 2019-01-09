import { GFXFormat, GFXLoadOp, GFXPipelineBindPoint, GFXStoreOp, GFXTextureLayout } from './define';
import { GFXDevice } from './device';

export class GFXColorAttachment {
    public format: GFXFormat = GFXFormat.UNKNOWN;
    public loadOp: GFXLoadOp = GFXLoadOp.CLEAR;
    public storeOp: GFXStoreOp = GFXStoreOp.STORE;
    public sampleCount: number = 1;
    public beginLayout: GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
    public endLayout: GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
}

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

export interface IGFXSubPassInfo {
    bindPoint: GFXPipelineBindPoint;
    inputs: number[];
    colors: number[];
    resolves: number[];
    depthStencil: number;
    preserves: number[];
}

export interface IGFXRenderPassInfo {
    colorAttachments?: GFXColorAttachment[];
    depthStencilAttachment?: GFXDepthStencilAttachment;
    // subPasses? : GFXSubPassInfo[];
}

export abstract class GFXRenderPass {

    protected _device: GFXDevice;
    protected _colorInfos: GFXColorAttachment[] = [];
    protected _depthStencilInfo: GFXDepthStencilAttachment | null = null;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXRenderPassInfo): boolean;
    public abstract destroy (): void;
    // protected _subPasses : GFXSubPassInfo[] = [];
}
