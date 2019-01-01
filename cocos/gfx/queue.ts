import { GFXDevice } from './device';
import { GFXCommandBuffer } from './command-buffer';
import { GFXQueueType } from './gfx-define';

export interface GFXQueueInfo {
    type : GFXQueueType;
};

export abstract class GFXQueue {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info : GFXQueueInfo) : boolean;
    public abstract destroy();
    public abstract submit(cmdBuffs: GFXCommandBuffer[], fence?);

    public get type(): number {
        return this._type;
    }

    protected _device : GFXDevice;
    protected _type : GFXQueueType = GFXQueueType.GRAPHICS;
};
