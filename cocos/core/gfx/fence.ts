/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';

export class GFXFenceInfo {
    declare private token: never; // make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
    ){}
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

    public abstract initialize (info: GFXFenceInfo): boolean;

    public abstract destroy (): void;
}
