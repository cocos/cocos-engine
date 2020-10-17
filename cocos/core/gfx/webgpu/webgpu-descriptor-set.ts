import { GFXDescriptorSet, GFXDescriptorSetInfo, DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE } from '../descriptor-set';
import { WebGPUBuffer } from './WebGPU-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor } from './WebGPU-gpu-objects';
import { WebGPUSampler } from './WebGPU-sampler';
import { WebGPUTexture } from './WebGPU-texture';
import { WebGPUDescriptorSetLayout } from './WebGPU-descriptor-set-layout';

export class WebGPUDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGPUGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGPUGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGPUGPUDescriptorSet | null = null;

    public initialize (info: GFXDescriptorSetInfo): boolean {

        this._layout = info.layout;
        const { bindings, descriptorIndices, descriptorCount } = (info.layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGPUGPUDescriptor[] = [];
        this._gpuDescriptorSet = { gpuDescriptors, descriptorIndices };

        for (let i = 0; i < bindings.length; ++i) {
            const binding = bindings[i];
            for (let j = 0; j < binding.count; j++) {
                gpuDescriptors.push({
                    type: binding.descriptorType,
                    gpuBuffer: null,
                    gpuTexture: null,
                    gpuSampler: null,
                });
            }
        }

        return true;
    }

    public destroy () {
        this._layout = null;
        this._gpuDescriptorSet = null;
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSet) {
            const descriptors = this._gpuDescriptorSet!.gpuDescriptors;
            for (let i = 0; i < descriptors.length; ++i) {
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    if (this._buffers[i]) {
                        descriptors[i].gpuBuffer = (this._buffers[i] as WebGPUBuffer).gpuBuffer;
                    }
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                    if (this._textures[i]) {
                        descriptors[i].gpuTexture = (this._textures[i] as WebGPUTexture).gpuTexture;
                    }
                    if (this._samplers[i]) {
                        descriptors[i].gpuSampler = (this._samplers[i] as WebGPUSampler).gpuSampler;
                    }
                }
            }
            this._isDirty = false;
        }
    }
}
