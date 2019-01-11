import { GFXBindingLayout } from './binding-layout';
import { GFXBuffer } from './buffer';
import { GFXCommandAllocator } from './command-allocator';
import {
    GFXBufferTextureCopy,
    GFXCommandBufferType,
    GFXObject,
    GFXObjectType,
    GFXTextureLayout,
    IGFXColor,
    IGFXRect,
} from './define';
import { GFXDevice } from './device';
import { GFXFramebuffer } from './framebuffer';
import { GFXInputAssembler } from './input-assembler';
import { GFXPipelineState } from './pipeline-state';
import { GFXTexture } from './texture';

export interface IGFXCommandBufferInfo {
    allocator: GFXCommandAllocator;
    type: GFXCommandBufferType;
}

// tslint:disable: max-line-length
export abstract class GFXCommandBuffer extends GFXObject {

    public get type (): number {
        return this._type;
    }

    protected _device: GFXDevice;
    protected _allocator: GFXCommandAllocator | null = null;
    protected _type: GFXCommandBufferType = GFXCommandBufferType.PRIMARY;

    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_BUFFER);
        this._device = device;
    }

    public abstract initialize (info: IGFXCommandBufferInfo): boolean;
    public abstract destroy ();

    public abstract begin ();
    public abstract end ();
    public abstract beginRenderPass (framebuffer: GFXFramebuffer, renderArea: IGFXRect, clearColors: IGFXColor[], clearDepth: number, clearStencil: number);
    public abstract endRenderPass ();
    public abstract bindPipelineState (pipelineState: GFXPipelineState);
    public abstract bindBindingLayout (bindingLayout: GFXBindingLayout);
    public abstract bindInputAssembler (inputAssembler: GFXInputAssembler);
    public abstract draw (inputAssembler: GFXInputAssembler);
    public abstract updateBuffer (buffer: GFXBuffer, data: ArrayBuffer, offset?: number);
    public abstract copyBufferToTexture (srcBuff: GFXBuffer, dstTex: GFXTexture, dstLayout: GFXTextureLayout, regions: GFXBufferTextureCopy[]);
    public abstract execute (cmdBuffs: GFXCommandBuffer[]);
}
