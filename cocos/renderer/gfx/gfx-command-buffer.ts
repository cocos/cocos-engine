import { GFXDevice } from './gfx-device';
import { GFXCommandAllocator } from './gfx-command-allocator';
import { GFXBuffer } from './gfx-buffer';
import { GFXInputAssembler } from './gfx-input-assembler';
import { GFXPipelineState } from './gfx-pipeline-state';
import { GFXBindingLayout } from './gfx-binding-layout';
import { GFXTextureLayout } from './gfx-render-pass';
import { GFXTexture } from './gfx-texture';
import { GFXFramebuffer } from './gfx-framebuffer';

export class GFXTextureSubres
{
	baseMipLevel: number = 0;
	levelCount: number = 1;
	baseArrayLayer: number = 0;
	layerCount: number = 1;
};

export class GFXTextureCopy {
    srcSubres: GFXTextureSubres = new GFXTextureSubres;
    srcOffset: number[] = [0, 0, 0];
    dstSubres: GFXTextureSubres = new GFXTextureSubres;
    dstOffset: number[] = [0, 0, 0];
    extent: number[] = [0, 0, 0];
};

export class GFXBufferTextureCopy {
	buffOffset: number = 0;
	buffStride: number = 0;
	buffTexHeight: number = 0;
	texOffset: number[] = [0, 0, 0];
    texExtent: number[] = [0, 0, 0];
    texSubres: GFXTextureSubres = new GFXTextureSubres;
};

export const enum GFXCommandBufferType {
    PRIMARY,
    SECONDARY,
};

export interface GFXCommandBufferInfo {
    allocator : GFXCommandAllocator;
    type : GFXCommandBufferType;
};

export abstract class GFXCommandBuffer {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXCommandBufferInfo) : boolean;
    public abstract destroy();

    public abstract begin();
    public abstract end();
    public abstract beginRenderPass(framebuffer : GFXFramebuffer, viewport : number[], numClearColors : number, clearColors : number[], clearStencil : number);
    public abstract endRenderPass();
    public abstract bindPipelineState(pipelineState : GFXPipelineState);
    public abstract bindBindingLayout(bindingLayout : GFXBindingLayout);
    public abstract bindInputAssembler(inputAssembler : GFXInputAssembler);
    public abstract draw(inputAssembler : GFXInputAssembler);
    public abstract updateBuffer(buffer : GFXBuffer, data : ArrayBuffer, offset : number);
    public abstract copyBufferToTexture(srcBuff : GFXBuffer, dstTex : GFXTexture, dstLayout: GFXTextureLayout, regions : GFXBufferTextureCopy[]);
    public abstract execute(cmdBuffs : GFXCommandBuffer[]);

    public get type(): number {
        return this._type;
    }

    protected _device : GFXDevice;
    protected _allocator : GFXCommandAllocator | null = null;
    protected _type : GFXCommandBufferType = GFXCommandBufferType.PRIMARY;
};
