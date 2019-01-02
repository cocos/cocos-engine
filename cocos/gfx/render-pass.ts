import { GFXFormat, GFXLoadOp, GFXStoreOp, GFXTextureLayout, GFXPipelineBindPoint } from './define';
import { GFXDevice } from './device';

export class GFXColorAttachment
{
	format : GFXFormat = GFXFormat.UNKNOWN;
	loadOp : GFXLoadOp = GFXLoadOp.CLEAR;
	storeOp : GFXStoreOp = GFXStoreOp.STORE;
	sampleCount : number = 1;
	beginLayout : GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
	endLayout : GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
};

export class GFXDepthStencilAttachment
{
	format : GFXFormat = GFXFormat.UNKNOWN;
	depthLoadOp : GFXLoadOp = GFXLoadOp.CLEAR;
	depthStoreOp : GFXStoreOp = GFXStoreOp.STORE;
	stencilLoadOp : GFXLoadOp = GFXLoadOp.CLEAR;
	stencilStoreOp : GFXStoreOp = GFXStoreOp.STORE;
    sampleCount : number = 1;
    beginLayout : GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
	endLayout : GFXTextureLayout = GFXTextureLayout.DEPTH_STENCIL_ATTACHMENT_OPTIMAL;
};

export interface GFXSubPassInfo
{
    bindPoint : GFXPipelineBindPoint;
    inputs : number[];
    colors : number[];
    resolves : number[];
    depthStencil : number;
    preserves : number[];
};

export interface GFXRenderPassInfo
{
	colorAttachments? : GFXColorAttachment[];
	depthStencilAttachment? : GFXDepthStencilAttachment;
	//subPasses? : GFXSubPassInfo[];
};

export abstract class GFXRenderPass {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXRenderPassInfo) : boolean;
    public abstract destroy() : void;

    protected _device : GFXDevice;
    protected _colorInfos : GFXColorAttachment[] = [];
    protected _depthStencilInfo : GFXDepthStencilAttachment | null = null;
    //protected _subPasses : GFXSubPassInfo[] = [];
};
