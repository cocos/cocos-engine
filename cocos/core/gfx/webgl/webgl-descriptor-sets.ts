import { GFXDescriptorSets, IGFXDescriptorSetsInfo, GFXDescriptor } from '../descriptor-sets';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLGPUDescriptorSets } from './webgl-gpu-objects';
import { WebGLGFXSampler } from './webgl-sampler';
import { WebGLGFXTexture } from './webgl-texture';
import { WebGLGFXDevice } from '../../../../exports/gfx-webgl';
import { GFXBuffer } from '../buffer';
import { GFXSampler } from '../sampler';
import { GFXTexture } from '../texture';

export class WebGLGFXDescriptorSets extends GFXDescriptorSets {

    get gpuDescriptorSets (): WebGLGPUDescriptorSets {
        return this._gpuDescriptorSets as WebGLGPUDescriptorSets;
    }

    private _gpuDescriptorSets: WebGLGPUDescriptorSets | null = null;

    public initialize (info: IGFXDescriptorSetsInfo): boolean {

        const blockCount = info.shader.blocks.length;
        const samplerCount = info.shader.samplers.length;
        const offsets = (this._device as WebGLGFXDevice).perSetBindingOffsets;

        for (let i = 0; i < blockCount; ++i) {
            const block = info.shader.blocks[i];
            const flatBinding = block.binding + offsets[block.set];
            this._descriptorSets[flatBinding] = {
                type: GFXDescriptorType.UNIFORM_BUFFER,
                name: block.name,
                buffer: null,
                texture: null,
                sampler: null,
            };
        }
        for (let i = 0; i < samplerCount; ++i) {
            const sampler = info.shader.samplers[i];
            const flatBinding = sampler.binding + offsets[sampler.set];
            this._descriptorSets[flatBinding] = {
                type: GFXDescriptorType.SAMPLER,
                name: sampler.name,
                buffer: null,
                texture: null,
                sampler: null,
            };
        }

        this._gpuDescriptorSets = {
            gpuDescriptors: [],
        };

        const gpuDescriptorSet = this._gpuDescriptorSets.gpuDescriptors;

        for (let i = 0; i < blockCount; ++i) {
            const block = info.shader.blocks[i];
            const flatBinding = block.binding + offsets[block.set];
            gpuDescriptorSet[flatBinding] = {
                type: GFXDescriptorType.UNIFORM_BUFFER,
                name: block.name,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            };
        }
        for (let i = 0; i < samplerCount; ++i) {
            const sampler = info.shader.samplers[i];
            const flatBinding = sampler.binding + offsets[sampler.set];
            gpuDescriptorSet[flatBinding] = {
                type: GFXDescriptorType.SAMPLER,
                name: sampler.name,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            };
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuDescriptorSets = null;
        this._status = GFXStatus.UNREADY;
    }

    public bindBuffer (set: number, binding: number, buffer: GFXBuffer) {
        const flatBinding = binding + (this._device as WebGLGFXDevice).perSetBindingOffsets[set];

        const descriptor = this._descriptorSets[flatBinding];
        if (descriptor && descriptor.type === GFXDescriptorType.UNIFORM_BUFFER) {
            if (descriptor.buffer !== buffer) {
                descriptor.buffer = buffer;
                this._isDirty |= flatBinding;
            }
        } else {
            console.error(`Illegal descriptor set buffer binding ${set}:${binding}}.`);
        }
    }

    public bindSampler (set: number, binding: number, sampler: GFXSampler) {
        const flatBinding = binding + (this._device as WebGLGFXDevice).perSetBindingOffsets[set];

        const descriptor = this._descriptorSets[flatBinding];
        if (descriptor && descriptor.type === GFXDescriptorType.SAMPLER) {
            if (descriptor.sampler !== sampler) {
                descriptor.sampler = sampler;
                this._isDirty |= flatBinding;
            }
        } else {
            console.error(`Illegal descriptor set sampler binding ${set}:${binding}}.`);
        }
    }

    public bindTexture (set: number, binding: number, texture: GFXTexture) {
        const flatBinding = binding + (this._device as WebGLGFXDevice).perSetBindingOffsets[set];

        const descriptor = this._descriptorSets[flatBinding];
        if (descriptor && descriptor.type === GFXDescriptorType.SAMPLER) {
            if (descriptor.texture !== texture) {
                descriptor.texture = texture;
                this._isDirty |= flatBinding;
            }
        } else {
            console.error(`Illegal descriptor set texture binding ${set}:${binding}}.`);
        }
    }

    public getDescriptor (set: number, binding: number): GFXDescriptor | undefined {
        const flatBinding = binding + (this._device as WebGLGFXDevice).perSetBindingOffsets[set];

        return this._descriptorSets[flatBinding];
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSets) {
            for (let i = 0; i < this._descriptorSets.length; ++i) {
                if (this._isDirty & i) {
                    const bindingUnit = this._descriptorSets[i];
                    switch (bindingUnit.type) {
                        case GFXDescriptorType.UNIFORM_BUFFER: {
                            if (bindingUnit.buffer) {
                                this._gpuDescriptorSets.gpuDescriptors[i].gpuBuffer =
                                    (bindingUnit.buffer as WebGLGFXBuffer).gpuBuffer;
                            }
                            break;
                        }
                        case GFXDescriptorType.SAMPLER: {
                            if (bindingUnit.texture) {
                                this._gpuDescriptorSets.gpuDescriptors[i].gpuTexture =
                                    (bindingUnit.texture as WebGLGFXTexture).gpuTexture;
                            }
                            if (bindingUnit.sampler) {
                                this._gpuDescriptorSets.gpuDescriptors[i].gpuSampler =
                                    (bindingUnit.sampler as WebGLGFXSampler).gpuSampler;
                            }
                            break;
                        }
                        default:
                    }
                }
            }
            this._isDirty = 0;
        }
    }
}
