import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

// tslint:disable-next-line:no-empty-interface
export interface IGFXCommandAllocatorInfo {
}

export abstract class GFXCommandAllocator extends GFXObject {

    protected _device: GFXDevice;

    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_ALLOCATOR);
        this._device = device;
    }

    public abstract initialize (info: IGFXCommandAllocatorInfo): boolean;
    public abstract destroy ();
}
