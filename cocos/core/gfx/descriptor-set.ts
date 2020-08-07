/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXDescriptorType, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTexture } from './texture';

export interface IGFXDescriptorSetInfo {
    // array index is used as the binding numbers,
    // i.e. they should be strictly consecutive and start from 0
    layout: GFXDescriptorType[];
}

/**
 * @en GFX descriptor sets.
 * @zh GFX 描述符集组。
 */
export abstract class GFXDescriptorSet extends GFXObject {

    get layout () {
        return this._layout;
    }

    protected _device: GFXDevice;

    protected _layout: GFXDescriptorType[] = [];
    protected _buffers: GFXBuffer[] = [];
    protected _textures: GFXTexture[] = [];
    protected _samplers: GFXSampler[] = [];

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
     * @param binding The target binding.
     * @param buffer The buffer to be bound.
     */
    public bindBuffer (binding: number, buffer: GFXBuffer | null) {
        const descriptor = this._layout[binding];
        if (descriptor && descriptor === GFXDescriptorType.UNIFORM_BUFFER) {
            if (this._buffers[binding] !== buffer) {
                this._buffers[binding] = buffer!;
                this._isDirty = true;
            }
        } else {
            console.error('Setting binding is not GFXDescriptorType.UNIFORM_BUFFER.');
        }
    }

    /**
     * @en Bind sampler to the specified descriptor.
     * @zh 在指定的描述符位置上绑定采样器。
     * @param binding The target binding.
     * @param sampler The sampler to be bound.
     */
    public bindSampler (binding: number, sampler: GFXSampler | null) {
        const descriptor = this._layout[binding];
        if (descriptor && descriptor === GFXDescriptorType.SAMPLER) {
            if (this._samplers[binding] !== sampler) {
                this._samplers[binding] = sampler!;
                this._isDirty = true;
            }
        } else {
            console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
        }
    }

    /**
     * @en Bind texture to the specified descriptor.
     * @zh 在指定的描述符位置上绑定纹理。
     * @param binding The target binding.
     * @param texture The texture to be bound.
     */
    public bindTexture (binding: number, texture: GFXTexture | null) {
        const descriptor = this._layout[binding];
        if (descriptor && descriptor === GFXDescriptorType.SAMPLER) {
            if (this._textures[binding] !== texture) {
                this._textures[binding] = texture!;
                this._isDirty = true;
            }
        } else {
            console.error('Setting binding is not GFXDescriptorType.SAMPLER.');
        }
    }

    /**
     * @en Get buffer from the specified binding location.
     * @zh 获取当前指定绑定位置上的缓冲。
     * @param binding The target binding.
     */
    public getBuffer (binding: number) {
        return this._buffers[binding];
    }

    /**
     * @en Get sampler from the specified binding location.
     * @zh 获取当前指定绑定位置上的采样器。
     * @param binding The target binding.
     */
    public getSampler (binding: number) {
        return this._samplers[binding];
    }

    /**
     * @en Get texture from the specified binding location.
     * @zh 获取当前指定绑定位置上的贴图。
     * @param binding The target binding.
     */
    public getTexture (binding: number) {
        return this._textures[binding];
    }
}
