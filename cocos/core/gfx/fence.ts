/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

// tslint:disable-next-line: no-empty-interface
export interface IGFXFenceInfo {
}

/**
 * @en GFX Fence.
 * @zh GFX 同步信号。
 */
export abstract class GFXFence extends GFXObject {

    protected _device: GFXDevice;

    constructor (device: GFXDevice) {
        super(GFXObjectType.FENCE);
        this._device = device;
    }

    public abstract initialize (info: IGFXFenceInfo): boolean;

    public abstract destroy (): void;
}
