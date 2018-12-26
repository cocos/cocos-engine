import { GFXDevice } from './gfx-device';

export abstract class GFXCommandAllocator {
    
    constructor(device : GFXDevice) {
        this._device = device;
    }

    public abstract initialize() : boolean;
    public abstract destroy();

    protected _device : GFXDevice;
}