import { GFXDescriptorSet, IGFXDescriptorSetInfo, DESCRIPTOR_SAMPLER_TYPE, DESCRIPTOR_BUFFER_TYPE } from '../descriptor-set';
import { WebGLBuffer } from './webgl-buffer';
import { IWebGLGPUDescriptorSet, IWebGLGPUDescriptor } from './webgl-gpu-objects';
import { WebGLSampler } from './webgl-sampler';
import { WebGLTexture } from './webgl-texture';
import { WebGLDescriptorSetLayout } from './webgl-descriptor-set-layout';

export class WebGLDescriptorSet extends GFXDescriptorSet {

    get gpuDescriptorSet (): IWebGLGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGLGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGLGPUDescriptorSet | null = null;

    public initialize (info: IGFXDescriptorSetInfo): boolean {

        this._layout = info.layout;
        const { bindings, descriptorCount, descriptorIndices } = (info.layout as WebGLDescriptorSetLayout).gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGLGPUDescriptor[] = [];
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
                    const buffer = this._buffers[i] as WebGLBuffer | null;
                    if (buffer) {
                        descriptors[i].gpuBuffer = buffer.gpuBuffer || buffer.gpuBufferView;
                    }
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                    if (this._textures[i]) {
                        descriptors[i].gpuTexture = (this._textures[i] as WebGLTexture).gpuTexture;
                    }
                    if (this._samplers[i]) {
                        descriptors[i].gpuSampler = (this._samplers[i] as WebGLSampler).gpuSampler;
                    }
                }
            }
            this._isDirty = false;
        }
    }
}
