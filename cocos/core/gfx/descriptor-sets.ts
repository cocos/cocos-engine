/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXDescriptorType, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTexture } from './texture';
import { GFXShader } from './shader';

export interface IGFXDescriptorSetsInfo {
    shader: GFXShader;
}

export class GFXDescriptor {
    public binding: number = 0;
    public type: GFXDescriptorType = GFXDescriptorType.UNKNOWN;
    public name: string = '';
    public buffer: GFXBuffer | null = null;
    public texture: GFXTexture | null = null;
    public sampler: GFXSampler | null = null;
}

/**
 * @en GFX descriptor sets.
 * @zh GFX 描述符集组。
 */
export abstract class GFXDescriptorSets extends GFXObject {

    protected _device: GFXDevice;

    protected _descriptorSets: GFXDescriptor[] = [];

    protected _isDirty = false;

    constructor (device: GFXDevice) {
        super(GFXObjectType.DESCRIPTOR_SETS);
        this._device = device;
    }

    public abstract initialize (info: IGFXDescriptorSetsInfo): boolean;

    public abstract destroy (): void;

    public abstract update (): void;

    /**
     * @en Bind buffer to the specified descriptor set.
     * @zh 在指定的描述符集位置上绑定缓冲。
     * @param set The target set.
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public abstract bindBuffer (set: number, binding: number, buffer: GFXBuffer): void;

    /**
     * @en Bind sampler to the specified descriptor set.
     * @zh 在指定的描述符集位置上绑定采样器。
     * @param set The target set.
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public abstract bindSampler (set: number, binding: number, sampler: GFXSampler): void;

    /**
     * @en Bind texture to the specified descriptor set.
     * @zh 在指定的描述符集位置上绑定纹理。
     * @param set The target set.
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public abstract bindTexture (set: number, binding: number, texture: GFXTexture): void;

    /**
     * @en Get the specified descriptor.
     * @zh 得到指定位置的描述符。
     * @param set The target set.
     * @param binding The target binding.
     */
    public abstract getDescriptor (set: number, binding: number): GFXDescriptor | undefined;
}
