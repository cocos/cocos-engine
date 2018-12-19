import { GFXDevice } from './gfx-device';
import { GFXCommandAllocator } from './gfx-command-allocator';

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
    public abstract destroy() : void;

    public get type(): number {
        return this._type;
    }

    protected _device : GFXDevice;
    protected _type : GFXCommandBufferType = GFXCommandBufferType.PRIMARY;
};
