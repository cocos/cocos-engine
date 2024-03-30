import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor } from './webgpu-gpu-objects';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import {
    DescriptorSetInfo,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
} from '../base/define';
import { WebGPUDeviceManager } from './define';
import { SEPARATE_SAMPLER_BINDING_OFFSET } from './webgpu-commands';

export class WebGPUDescriptorSet extends DescriptorSet {
    get gpuDescriptorSet (): IWebGPUGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGPUGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGPUGPUDescriptorSet | null = null;
    private _bindGroupEntries: Map<number, GPUBindGroupEntry> = new Map<number, GPUBindGroupEntry>();

    public initialize (info: Readonly<DescriptorSetInfo>) {
        const layout = this._layout = info.layout as WebGPUDescriptorSetLayout;
        const { bindings, descriptorIndices, descriptorCount } = layout.gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGPUGPUDescriptor[] = [];
        const bindGroup = {} as GPUBindGroup;
        this._gpuDescriptorSet = { gpuDescriptors, descriptorIndices, bindGroup };

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
        this._isDirty = true;
    }

    public destroy () {
        this._layout = null;
        this._gpuDescriptorSet = null;
        this._bindGroupEntries.clear();
    }

    private _isEmpty(): boolean {
        return !this._buffers.length && !this._samplers.length && !this._textures.length;
    }

    private _applyBindGroup(): void {
        if (this._isDirty && this._gpuDescriptorSet) {
            const layout = this._layout as WebGPUDescriptorSetLayout;
            this._bindGroupEntries.clear();
            layout.clear();
            // Although some shaders do not use the specified setindex, webgpu is also strictly checked.
            // It is also to avoid binding beyond the specified number of WebGPU
            let isEmpty = this._isEmpty();
            const descriptors = this._gpuDescriptorSet.gpuDescriptors;
            
            const device = WebGPUDeviceManager.instance;
            for (let i = 0; i < descriptors.length; ++i) {
                let binding = layout.gpuDescriptorSetLayout.bindings[i];
                const bindIdx = binding.binding;
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    const buffer = isEmpty ? device.defaultDescriptorResource.buffer : this._buffers[i] as WebGPUBuffer;
                    if(buffer) {
                        descriptors[i].gpuBuffer = buffer.gpuBuffer;
                        const nativeBuffer = descriptors[i].gpuBuffer?.glBuffer;
                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: bindIdx,
                            resource: {
                                buffer: nativeBuffer!,
                                offset: descriptors[i].gpuBuffer?.glOffset,
                                size: descriptors[i].gpuBuffer?.size,
                            },

                        };
                        layout.updateBindGroupLayout(binding, buffer, null, null);
                        this._bindGroupEntries.set(bindIdx, bindGrpEntry);
                    }
                    if(isEmpty) break;
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                        // texture
                        const currTex = isEmpty ? device.defaultDescriptorResource.texture : this._textures[i] as WebGPUTexture;
                        if(currTex) {
                            descriptors[i].gpuTexture = currTex.gpuTexture;

                            const bindTextureGrpEntry: GPUBindGroupEntry = {
                                binding: bindIdx,
                                resource: descriptors[i].gpuTexture?.glTexture?.createView() as GPUTextureView,
                            };
                            layout.updateBindGroupLayout(binding, null, currTex, null);
                            this._bindGroupEntries.set(bindIdx, bindTextureGrpEntry);
                        }

                        // sampler
                        const currSampler = isEmpty ? device.defaultDescriptorResource.sampler : this._samplers[i] as WebGPUSampler;
                        const samplerIdx = bindIdx + SEPARATE_SAMPLER_BINDING_OFFSET;
                        if(currSampler) {
                            descriptors[i].gpuSampler = currSampler.gpuSampler;
                            const bindSamplerGrpEntry: GPUBindGroupEntry = {
                                binding: samplerIdx,
                                resource: descriptors[i].gpuSampler?.glSampler as GPUSampler,
                            };
                            layout.updateBindGroupLayout(binding, null, null, currSampler);
                            this._bindGroupEntries.set(samplerIdx, bindSamplerGrpEntry);
                        }
                        if(isEmpty) break;
                    }
            }
            layout.prepare();
            this._isDirty = false;
            const nativeDevice = device.nativeDevice;
            const groups = Array.from(this._bindGroupEntries.values());
            const bindGroup = nativeDevice?.createBindGroup({
                layout: layout.gpuDescriptorSetLayout.bindGroupLayout!,
                entries: groups,
            });
            const encoder = nativeDevice?.createCommandEncoder();
            nativeDevice?.queue.submit([encoder!.finish()]);

            this._gpuDescriptorSet.bindGroup = bindGroup!;
        }
    }

    public update () {
        this._applyBindGroup();
    }
}
