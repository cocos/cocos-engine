/**
 * @packageDocumentation
 * @module gfx
 */

import { Device } from './device';
import { Obj, ObjectType } from './define';

export class FenceInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
    ) {}
}

/**
 * @en GFX Fence.
 * @zh GFX 同步信号。
 */
export abstract class Fence extends Obj {

    protected _device: Device;

    constructor (device: Device) {
        super(ObjectType.FENCE);
        this._device = device;
    }

    public abstract initialize (info: FenceInfo): boolean;

    public abstract destroy (): void;
}
