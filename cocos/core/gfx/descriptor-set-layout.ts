/**
 * @packageDocumentation
 * @module gfx
 */

import { Device } from './device';
import { Sampler } from './sampler';
import { DescriptorType, Obj, ObjectType, ShaderStageFlagBit, ShaderStageFlags } from './define';

export class DescriptorSetLayoutBinding {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public binding: number = -1,
        public descriptorType: DescriptorType = DescriptorType.UNKNOWN,
        public count: number = 0,
        public stageFlags: ShaderStageFlags = ShaderStageFlagBit.NONE,
        public immutableSamplers: Sampler[] = [],
    ) {}
}

export class DescriptorSetLayoutInfo {
    declare private _token: never; // to make sure all usages must be an instance of this exact class, not assembled from plain object

    constructor (
        public bindings: DescriptorSetLayoutBinding[] = []
    ) {}
}

export const DESCRIPTOR_DYNAMIC_TYPE = DescriptorType.DYNAMIC_STORAGE_BUFFER | DescriptorType.DYNAMIC_UNIFORM_BUFFER;

/**
 * @en GFX descriptor sets layout.
 * @zh GFX 描述符集布局。
 */
export abstract class DescriptorSetLayout extends Obj {

    get bindings () {
        return this._bindings;
    }

    get bindingIndices () {
        return this._bindingIndices;
    }

    get descriptorIndices () {
        return this._descriptorIndices;
    }

    protected _device: Device;

    protected _bindings: DescriptorSetLayoutBinding[] = [];

    protected _bindingIndices: number[] = [];

    protected _descriptorIndices: number[] = [];

    constructor (device: Device) {
        super(ObjectType.DESCRIPTOR_SET_LAYOUT);
        this._device = device;
    }

    public abstract initialize (info: DescriptorSetLayoutInfo): boolean;

    public abstract destroy (): void;
}
