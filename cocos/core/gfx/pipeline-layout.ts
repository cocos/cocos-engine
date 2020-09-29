/**
 * @category gfx
 */

import { GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXDescriptorSetLayout } from './descriptor-set-layout';

export interface IGFXPipelineLayoutInfo {
    setLayouts: GFXDescriptorSetLayout[];
}

/**
 * @en GFX pipeline layout.
 * @zh GFX 管线布局。
 */
export abstract class GFXPipelineLayout extends GFXObject {

    get setLayouts () {
        return this._setLayouts;
    }

    protected _device: GFXDevice;

    protected _setLayouts: GFXDescriptorSetLayout[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.PIPELINE_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: IGFXPipelineLayoutInfo): boolean;

    public abstract destroy (): void;
}
