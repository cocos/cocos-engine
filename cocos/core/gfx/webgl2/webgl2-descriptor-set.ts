import { GFXDescriptorSet, IGFXDescriptorSetInfo, DESCRIPTOR_BUFFER_TYPE, DESCRIPTOR_SAMPLER_TYPE } from '../descriptor-set';
import { WebGL2Buffer } from './webgl2-buffer';
import { IWebGL2GPUDescriptorSet, IWebGL2GPUDescriptor } from './webgl2-gpu-objects';
import { WebGL2Sampler } from './webgl2-sampler';
import { WebGL2Texture } from './webgl2-texture';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';

export class WebGL2DescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGL2GPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGL2GPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGL2GPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._layout = info.layout;
        const { bindings, descriptorCount, descriptorIndices } = (info.layout as WebGL2DescriptorSetLayout).gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGL2GPUDescriptor[] = [];
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
                        descriptors[i].gpuBuffer = (this._buffers[i] as WebGL2Buffer).gpuBuffer;
                    }
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                    if (this._textures[i]) {
                        descriptors[i].gpuTexture = (this._textures[i] as WebGL2Texture).gpuTexture;
                    }
                    if (this._samplers[i]) {
                        descriptors[i].gpuSampler = (this._samplers[i] as WebGL2Sampler).gpuSampler;
                    }
                }
            }
            this._isDirty = false;
        }
    }
}
