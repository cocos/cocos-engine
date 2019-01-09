import { GFXDevice } from './device';

export interface IGFXCommandAllocatorInfo {
}

export abstract class GFXCommandAllocator {

    protected _device: GFXDevice;

    constructor (device: GFXDevice) {
        this._device = device;
    }

    public abstract initialize (info: IGFXCommandAllocatorInfo): boolean;
    public abstract destroy ();
}
