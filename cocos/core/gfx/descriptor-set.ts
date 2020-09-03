/**
 * @category gfx
 */

import { GFXBuffer } from './buffer';
import { GFXDescriptorType, GFXObject, GFXObjectType } from './define';
import { GFXDevice } from './device';
import { GFXSampler } from './sampler';
import { GFXTexture } from './texture';
import { GFXDescriptorSetLayout } from './descriptor-set-layout';

export const DESCRIPTOR_BUFFER_TYPE =
    GFXDescriptorType.UNIFORM_BUFFER | GFXDescriptorType.DYNAMIC_UNIFORM_BUFFER |
    GFXDescriptorType.STORAGE_BUFFER | GFXDescriptorType.DYNAMIC_STORAGE_BUFFER;

export const DESCRIPTOR_SAMPLER_TYPE = GFXDescriptorType.SAMPLER;

export interface IGFXDescriptorSetInfo {
    layout: GFXDescriptorSetLayout;
}

/**
 * @en GFX descriptor sets.
 * @zh GFX 描述符集组。
 */
export abstract class GFXDescriptorSet extends GFXObject {

    get layout () {
        return this._layout!;
    }

    protected _device: GFXDevice;

    protected _layout: GFXDescriptorSetLayout | null = null;
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
    public bindBuffer (binding: number, buffer: GFXBuffer, index = 0) {
        const info = this._layout!.bindings[binding];
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        if (info && (info.descriptorType & DESCRIPTOR_BUFFER_TYPE)) {
            if (this._buffers[descriptorIndex + index] !== buffer) {
                this._buffers[descriptorIndex + index] = buffer;
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
    public bindSampler (binding: number, sampler: GFXSampler, index = 0) {
        const info = this._layout!.bindings[binding];
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        if (info && (info.descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
            if (this._samplers[descriptorIndex + index] !== sampler) {
                this._samplers[descriptorIndex + index] = sampler;
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
    public bindTexture (binding: number, texture: GFXTexture, index = 0) {
        const info = this._layout!.bindings[binding];
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        if (info && (info.descriptorType & DESCRIPTOR_SAMPLER_TYPE)) {
            if (this._textures[descriptorIndex + index] !== texture) {
                this._textures[descriptorIndex + index] = texture;
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
    public getBuffer (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._buffers[descriptorIndex + index];
    }

    /**
     * @en Get sampler from the specified binding location.
     * @zh 获取当前指定绑定位置上的采样器。
     * @param binding The target binding.
     */
    public getSampler (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._samplers[descriptorIndex + index];
    }

    /**
     * @en Get texture from the specified binding location.
     * @zh 获取当前指定绑定位置上的贴图。
     * @param binding The target binding.
     */
    public getTexture (binding: number, index = 0) {
        const descriptorIndex = this._layout!.descriptorIndices[binding];
        return this._textures[descriptorIndex + index];
    }
}
