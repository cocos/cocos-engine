import { GFXDescriptorSets, IGFXDescriptorSetsInfo, GFXDescriptor } from '../descriptor-sets';
import { GFXDescriptorType, GFXStatus } from '../define';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2GPUDescriptorSets } from './webgl2-gpu-objects';
import { WebGL2GFXSampler } from './webgl2-sampler';
import { WebGL2GFXTexture } from './webgl2-texture';
import { WebGL2GFXDevice } from '../../../../exports/gfx-webgl2';
import { GFXBuffer } from '../buffer';
import { GFXSampler } from '../sampler';
import { GFXTexture } from '../texture';

export class WebGL2GFXDescriptorSets extends GFXDescriptorSets {

    get gpuDescriptorSets (): WebGL2GPUDescriptorSets {
        return this._gpuDescriptorSets as WebGL2GPUDescriptorSets;
    }

    private _gpuDescriptorSets: WebGL2GPUDescriptorSets | null = null;

    public initialize (info: IGFXDescriptorSetsInfo): boolean {

        const blockCount = info.shader.blocks.length;
        const samplerCount = info.shader.samplers.length;
        const offsets = (this._device as WebGL2GFXDevice).perSetBindingOffsets;

        for (let i = 0; i < blockCount; ++i) {
            const block = info.shader.blocks[i];
            const flatBinding = block.binding + offsets[block.set];
            this._descriptorSets[flatBinding] = {
                binding: flatBinding,
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
                binding: flatBinding,
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
            gpuDescriptorSet.push({
                binding: flatBinding,
                type: GFXDescriptorType.UNIFORM_BUFFER,
                name: block.name,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            });
        }
        for (let i = 0; i < samplerCount; ++i) {
            const sampler = info.shader.samplers[i];
            const flatBinding = sampler.binding + offsets[sampler.set];
            gpuDescriptorSet.push({
                binding: flatBinding,
                type: GFXDescriptorType.SAMPLER,
                name: sampler.name,
                gpuBuffer: null,
                gpuTexture: null,
                gpuSampler: null,
            });
        }

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuDescriptorSets = null;
        this._status = GFXStatus.UNREADY;
    }

    public bindBuffer (set: number, binding: number, buffer: GFXBuffer) {
        const flatBinding = binding + (this._device as WebGL2GFXDevice).perSetBindingOffsets[set];

        for (let i = 0; i < this._descriptorSets.length; i++) {
            const descriptor = this._descriptorSets[i];
            if (descriptor.binding === flatBinding) {
                if (descriptor.type === GFXDescriptorType.UNIFORM_BUFFER) {
                    if (descriptor.buffer !== buffer) {
                        descriptor.buffer = buffer;
                        this._isDirty = true;
                    }
                } else {
                    console.error(`Illegal descriptor set buffer binding ${set}:${binding}}.`);
                }
                return;
            }
        }
    }

    public bindSampler (set: number, binding: number, sampler: GFXSampler) {
        const flatBinding = binding + (this._device as WebGL2GFXDevice).perSetBindingOffsets[set];

        for (let i = 0; i < this._descriptorSets.length; i++) {
            const descriptor = this._descriptorSets[i];
            if (descriptor.binding === flatBinding) {
                if (descriptor.type === GFXDescriptorType.SAMPLER) {
                    if (descriptor.sampler !== sampler) {
                        descriptor.sampler = sampler;
                        this._isDirty = true;
                    }
                } else {
                    console.error(`Illegal descriptor set sampler binding ${set}:${binding}}.`);
                }
                return;
            }
        }
    }

    public bindTexture (set: number, binding: number, texture: GFXTexture) {
        const flatBinding = binding + (this._device as WebGL2GFXDevice).perSetBindingOffsets[set];

        for (let i = 0; i < this._descriptorSets.length; i++) {
            const descriptor = this._descriptorSets[i];
            if (descriptor.binding === flatBinding) {
                if (descriptor.type === GFXDescriptorType.SAMPLER) {
                    if (descriptor.texture !== texture) {
                        descriptor.texture = texture;
                        this._isDirty = true;
                    }
                } else {
                    console.error(`Illegal descriptor set texture binding ${set}:${binding}}.`);
                }
                return;
            }
        }
    }

    public getDescriptor (set: number, binding: number): GFXDescriptor | undefined {
        const flatBinding = binding + (this._device as WebGL2GFXDevice).perSetBindingOffsets[set];

        for (let i = 0; i < this._descriptorSets.length; i++) {
            const descriptor = this._descriptorSets[i];
            if (descriptor.binding === flatBinding) {
                return descriptor;
            }
        }
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSets) {
            for (let i = 0; i < this._descriptorSets.length; ++i) {
                const descriptor = this._descriptorSets[i];
                switch (descriptor.type) {
                    case GFXDescriptorType.UNIFORM_BUFFER: {
                        if (descriptor.buffer) {
                            this._gpuDescriptorSets.gpuDescriptors[i].gpuBuffer =
                                (descriptor.buffer as WebGL2GFXBuffer).gpuBuffer;
                        }
                        break;
                    }
                    case GFXDescriptorType.SAMPLER: {
                        if (descriptor.texture) {
                            this._gpuDescriptorSets.gpuDescriptors[i].gpuTexture =
                                (descriptor.texture as WebGL2GFXTexture).gpuTexture;
                        }
                        if (descriptor.sampler) {
                            this._gpuDescriptorSets.gpuDescriptors[i].gpuSampler =
                                (descriptor.sampler as WebGL2GFXSampler).gpuSampler;
                        }
                        break;
                    }
                    default:
                }
            }
            this._isDirty = false;
        }
    }
}
