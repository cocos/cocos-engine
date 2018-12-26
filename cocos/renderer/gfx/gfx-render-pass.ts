import { GFXFormat, GFXFormatInfo } from './gfx-define';
import { GFXDevice } from './gfx-device';

// Enumeration all possible values of operations to be performed on initially Loading a Framebuffer Object.
export const enum GFXLoadOp
{
	LOAD,		// Load the contents from the fbo from previous
	CLEAR,		// Clear the fbo
	DISCARD,	// Ignore writing to the fbo and keep old data
};

// Enumerates all possible values of operations to be performed when Storing to a Framebuffer Object.
export const enum GFXStoreOp
{
	STORE,		// Write the source to the destination
	DISCARD,	// Don't write the source to the destination
};

export const enum GFXTextureLayout
{
    UNDEFINED,
    GENERAL,
	COLOR_ATTACHMENT_OPTIMAL,
	DEPTH_STENCIL_ATTACHMENT_OPTIMAL,
	DEPTH_STENCIL_READONLY_OPTIMAL,
    SHADER_READONLY_OPTIMAL,
    TRANSFER_SRC_OPTIMAL,
    TRANSFER_DST_OPTIMAL,
    PREINITIALIZED,
    PRESENT_SRC,
};

export class GFXColorAttachment
{
	format : GFXFormat = GFXFormat.UNKNOWN;
	loadOp : GFXLoadOp = GFXLoadOp.CLEAR;
	storeOp : GFXStoreOp = GFXStoreOp.STORE;
	sampleCount : number = 1;
	beginLayout : GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
	endLayout : GFXTextureLayout = GFXTextureLayout.COLOR_ATTACHMENT_OPTIMAL;
};

export class  GFXDepthStencilAttachment
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

export const enum GFXPipelineBindPoint
{
    GRAPHICS,
    COMPUTE,
    RAY_TRACING,
};

export class GFXSubPassInfo
{
    bindPoint : GFXPipelineBindPoint = GFXPipelineBindPoint.GRAPHICS;
    inputs : number[] = [];
    colors : number[] = [];
    resolves : number[] = [];
    depthStencil : number = -1;
    preserves : number[] = [];
};

export class GFXRenderPassInfo
{
	colorInfos : GFXColorAttachment[] = [];
	depthStencilInfo : GFXDepthStencilAttachment | null = null;
	subPasses : GFXSubPassInfo[] = [];
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
    protected _subPasses : GFXSubPassInfo[] = [];
};
