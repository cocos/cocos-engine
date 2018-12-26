import { GFXDevice } from './gfx-device';
import { GFXCommandAllocator } from './gfx-command-allocator';
import { GFXBuffer } from './gfx-buffer';
import { GFXInputAssembler } from './gfx-input-assembler';
import { GFXPipelineState } from './gfx-pipeline-state';
import { GFXBindingSetLayout } from './gfx-binding-set-layout';

export const enum GFXCommandBufferType {
    PRIMARY,
    SECONDARY,
};

export class GFXCommandBufferInfo {
    allocator : GFXCommandAllocator | null = null;
    type : GFXCommandBufferType = GFXCommandBufferType.PRIMARY;
};

export abstract class GFXCommandBuffer {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXCommandBufferInfo) : boolean;
    public abstract destroy();

    public abstract begin();
    public abstract end();
    public abstract bindPipelineState(pipelineState : GFXPipelineState);
    public abstract bindBindingSetLayout(bindingSetLayout : GFXBindingSetLayout);
    public abstract bindInputAssembler(inputAssembler : GFXInputAssembler);
    public abstract draw(inputAssembler : GFXInputAssembler);
    public abstract updateBuffer(buffer : GFXBuffer, data : ArrayBuffer, offset : number);

    public get type(): number {
        return this._type;
    }

    protected _device : GFXDevice;
    protected _allocator : GFXCommandAllocator | null = null;
    protected _type : GFXCommandBufferType = GFXCommandBufferType.PRIMARY;
};
