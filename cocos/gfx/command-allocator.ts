import { GFXDevice } from './device';

export interface GFXCommandAllocatorInfo {
};

export abstract class GFXCommandAllocator {

    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize(info: GFXCommandAllocatorInfo) : boolean;
    public abstract destroy();

    protected _device : GFXDevice;
}
