/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXDescriptorType, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTexture } from './texture';
import { GFXShader } from './shader';

export interface IGFXDescriptorSetInfo {
    shader: GFXShader;
    set: number;
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
export abstract class GFXDescriptorSet extends GFXObject {

    protected _device: GFXDevice;

    protected _descriptors: GFXDescriptor[] = [];

    protected _set: number = 0;

    protected _isDirty = false;

    constructor (device: GFXDevice) {
        super(GFXObjectType.DESCRIPTOR_SET);
        this._device = device;
    }

    public abstract initialize (info: IGFXDescriptorSetInfo): boolean;

    public abstract destroy (): void;

    public abstract update (): void;

    /**
     * @en Bind buffer to the specified descriptor.
     * @zh 在指定的描述符位置上绑定缓冲。
     * @param set The target set.
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public bindBuffer (binding: number, buffer: GFXBuffer) {
        for (const descriptor of this._descriptors) {
            if (descriptor.binding === binding) {
                if (descriptor.type === GFXDescriptorType.UNIFORM_BUFFER) {
                    if (descriptor.buffer !== buffer) {
                        descriptor.buffer = buffer;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXDescriptorType.UNIFORM_BUFFER.');
                }
                return;
            }
        }
        console.error('Setting binding is not GFXDescriptorType.UNIFORM_BUFFER.');
    }

    /**
     * @en Bind sampler to the specified descriptor.
     * @zh 在指定的描述符位置上绑定采样器。
     * @param set The target set.
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public bindSampler (binding: number, sampler: GFXSampler) {
        for (const descriptor of this._descriptors) {
            if (descriptor.binding === binding) {
                if (descriptor.type === GFXDescriptorType.SAMPLER) {
                    if (descriptor.sampler !== sampler) {
                        descriptor.sampler = sampler;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
                }
                return;
            }
        }
        console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
    }

    /**
     * @en Bind texture to the specified descriptor.
     * @zh 在指定的描述符位置上绑定纹理。
     * @param set The target set.
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public bindTexture (binding: number, texture: GFXTexture) {
        for (const descriptor of this._descriptors) {
            if (descriptor.binding === binding) {
                if (descriptor.type === GFXDescriptorType.SAMPLER) {
                    if (descriptor.texture !== texture) {
                        descriptor.texture = texture;
                        this._isDirty = true;
                    }
                } else {
                    console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
                }
                return;
            }
        }
        console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
    }

    /**
     * @en Get the specified descriptor.
     * @zh 得到指定位置的描述符。
     * @param set The target set.
     * @param binding The target binding.
     */
    public getDescriptor (binding: number) {
        for (const descriptor of this._descriptors) {
            if (descriptor.binding === binding) {
                return descriptor;
            }
        }
        return null;
    }
}
