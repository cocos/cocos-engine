import { GFXCommandBuffer } from './command-buffer';
import { GFXQueueType } from './define';
import { GFXDevice } from './device';

export interface IGFXQueueInfo {
    type: GFXQueueType;
}

export abstract class GFXQueue {

    public get type (): number {
        return this._type;
    }

    protected _device: GFXDevice;
    protected _type: GFXQueueType = GFXQueueType.GRAPHICS;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXQueueInfo): boolean;
    public abstract destroy ();
    public abstract submit (cmdBuffs: GFXCommandBuffer[], fence?);
}
