/**
 * @category gfx
 */

import { GFXObject, GFXObjectType, GFXStatus } from './define';
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

    public initialize (info: IGFXCommandAllocatorInfo) {
        if (this._initialize(info)) { this._status = GFXStatus.SUCCESS; return true; }
        else { this._status = GFXStatus.FAILED; return false; }
    }

    public destroy () {
        if (this._status !== GFXStatus.SUCCESS) { return; }
        this._destroy();
        this._status = GFXStatus.UNREADY;
    }

    protected abstract _initialize (info: IGFXCommandAllocatorInfo): boolean;

    protected abstract _destroy (): void;
}
