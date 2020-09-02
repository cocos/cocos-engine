/**
 * @category gfx
 */

import { GFXDescriptorType, GFXObject, GFXObjectType, GFXShaderStageFlags } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';

export interface IGFXDescriptorSetLayoutBinding {
    descriptorType: GFXDescriptorType;
    count: number;
    stageFlags: GFXShaderStageFlags;
    immutableSamplers?: GFXSampler[];
}

export interface IGFXDescriptorSetLayoutInfo {
    // array index is used as the binding numbers,
    // i.e. they should be strictly consecutive and start from 0
    bindings: IGFXDescriptorSetLayoutBinding[];
}

export const DESCRIPTOR_DYNAMIC_TYPE = GFXDescriptorType.DYNAMIC_STORAGE_BUFFER | GFXDescriptorType.DYNAMIC_UNIFORM_BUFFER;

/**
 * @en GFX descriptor sets layout.
 * @zh GFX 描述符集布局。
 */
export abstract class GFXDescriptorSetLayout extends GFXObject {

    get bindings () {
        return this._bindings;
    }

    get descriptorIndices () {
        return this._descriptorIndices;
    }

    protected _device: GFXDevice;

    protected _bindings: IGFXDescriptorSetLayoutBinding[] = [];

    protected _descriptorIndices: number[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.DESCRIPTOR_SET_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: IGFXDescriptorSetLayoutInfo): boolean;

    public abstract destroy (): void;
}
