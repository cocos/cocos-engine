/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

// tslint:disable-next-line:no-empty-interface
export interface IGFXCommandAllocatorInfo {
}

/**
 * @en GFX command allocator.
 * @zh GFX 命令分配器。
 */
export abstract class GFXCommandAllocator extends GFXObject {

    protected _device: GFXDevice;

    constructor (device: GFXDevice) {
        super(GFXObjectType.COMMAND_ALLOCATOR);
        this._device = device;
    }

    public abstract initialize (info: IGFXCommandAllocatorInfo): boolean;

    public abstract destroy (): void;
}
