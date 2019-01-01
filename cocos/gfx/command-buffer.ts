import { GFXDevice } from './device';
import { GFXCommandAllocator } from './command-allocator';
import { GFXBuffer } from './buffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineState } from './pipeline-state';
import { GFXBindingLayout } from './binding-layout';
import { GFXTexture } from './texture';
import { GFXFramebuffer } from './framebuffer';
import { GFXColor, GFXRect, GFXCommandBufferType, GFXBufferTextureCopy, GFXTextureLayout } from './gfx-define';

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
    public abstract beginRenderPass(framebuffer : GFXFramebuffer, renderArea : GFXRect, clearColors : GFXColor[], clearDepth: number, clearStencil : number);
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
