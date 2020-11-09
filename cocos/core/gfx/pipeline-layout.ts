/**
 * @packageDocumentation
 * @module gfx
 */

import { DescriptorSetLayout } from './descriptor-set-layout';
import { Device } from './device';
import { Obj, ObjectType } from './define';

export class PipelineLayoutInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public setLayouts: DescriptorSetLayout[] = [],
    ) {}
}

/**
 * @en GFX pipeline layout.
 * @zh GFX 管线布局。
 */
export abstract class PipelineLayout extends Obj {

    get setLayouts () {
        return this._setLayouts;
    }

    protected _device: Device;

    protected _setLayouts: DescriptorSetLayout[] = [];

    constructor (device: Device) {
        super(ObjectType.PIPELINE_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: PipelineLayoutInfo): boolean;

    public abstract destroy (): void;
}
