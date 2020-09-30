/**
 * @packageDocumentation
 * @module gfx
 */

import { GFXDescriptorType, GFXObject, GFXObjectType, GFXShaderStageFlagBit, GFXShaderStageFlags } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';

export class GFXDescriptorSetLayoutBinding {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public descriptorType: GFXDescriptorType = GFXDescriptorType.UNKNOWN,
        public count: number = 0,
        public stageFlags: GFXShaderStageFlags = GFXShaderStageFlagBit.NONE,
        public immutableSamplers: GFXSampler[] = [],
    ) {}
}

export class GFXDescriptorSetLayoutInfo {
    declare private token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        // array index is used as the binding numbers,
        // i.e. they should be strictly consecutive and start from 0
        public bindings: GFXDescriptorSetLayoutBinding[] = []
    ) {}
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

    protected _bindings: GFXDescriptorSetLayoutBinding[] = [];

    protected _descriptorIndices: number[] = [];

    constructor (device: GFXDevice) {
        super(GFXObjectType.DESCRIPTOR_SET_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: GFXDescriptorSetLayoutInfo): boolean;

    public abstract destroy (): void;
}
