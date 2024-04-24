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
        const bindGroupLayout = {} as GPUBindGroupLayout;
        this._gpuDescriptorSet = { gpuDescriptors, descriptorIndices, bindGroup, bindGroupLayout };

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
        const layout = (this._layout as WebGPUDescriptorSetLayout);// .removeRef(this);
        layout.removeRef(this);
        this._layout = null;
        this._gpuDescriptorSet = null;
        this._buffers.length = 0;
        this._textures.length = 0;
        this._samplers.length = 0;
        this._bindGroupEntries.clear();
    }

    private _isEmpty(): boolean {
        if (this._buffers.some(buffer => buffer) ||
            this._textures.some(texture => texture) ||
            this._samplers.some(sampler => sampler)) {
            return false;
        }

        // If all buffers, textures, and samplers are null, check the layout entries
        return !((this._layout as WebGPUDescriptorSetLayout).bindGrpLayoutEntries.size);
    }

    private _isNeedBindFromLayout(binding: number) {
        const layout = this._layout as WebGPUDescriptorSetLayout;
        return layout.bindGrpLayoutEntries.has(binding);
    }

    private _applyBindGroup(): void {
        if (this._isDirty && this._gpuDescriptorSet) {
            const layout = this._layout as WebGPUDescriptorSetLayout;
            this._bindGroupEntries.clear();
            // Because layout can be used on different objects, it can't simply clean it up
            // layout.clear();
            // Although some shaders do not use the specified setindex, webgpu is also strictly checked.
            // It is also to avoid binding beyond the specified number of WebGPU
            let isEmpty = this._isEmpty();
            const descriptors = this._gpuDescriptorSet.gpuDescriptors;
            
            const device = WebGPUDeviceManager.instance;
            for (let i = 0; i < descriptors.length; ++i) {
                let binding = layout.gpuDescriptorSetLayout.bindings[i];
                const bindIdx = binding.binding;
                const isNeedBind = this._isNeedBindFromLayout(bindIdx);
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    const buffer = (isEmpty || (isNeedBind && !this._buffers[i])) ? isNeedBind ? layout.buffers.get(bindIdx) : device.defaultDescriptorResource.buffer : this._buffers[i] as WebGPUBuffer;
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
                        const currTex = (isEmpty || (isNeedBind && !this._textures[i])) ? isNeedBind ? layout.textures.get(bindIdx) : device.defaultDescriptorResource.texture : this._textures[i] as WebGPUTexture;
                        if(currTex) {
                            descriptors[i].gpuTexture = currTex.gpuTexture;

                            const bindTextureGrpEntry: GPUBindGroupEntry = {
                                binding: bindIdx,
                                resource: currTex.getNativeTextureView()!,
                            };
                            layout.updateBindGroupLayout(binding, null, currTex, null);
                            this._bindGroupEntries.set(bindIdx, bindTextureGrpEntry);
                        }

                        // sampler
                        const samplerIdx = bindIdx + SEPARATE_SAMPLER_BINDING_OFFSET;
                        const currSampler = (isEmpty  || (isNeedBind && !this._samplers[i])) ? isNeedBind ? layout.samplers.get(samplerIdx) : device.defaultDescriptorResource.sampler : this._samplers[i] as WebGPUSampler;
                        
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
            layout.prepare(this);
            this._isDirty = false;
            this._createBindGroup();
        }
    }

    private _createBindGroup() {
        const device = WebGPUDeviceManager.instance;
        const nativeDevice = device.nativeDevice;
        const layout = this._layout as WebGPUDescriptorSetLayout;
        const groups = Array.from(this._bindGroupEntries.values());
        const bindGroup = nativeDevice?.createBindGroup({
            layout: layout.gpuDescriptorSetLayout.bindGroupLayout!,
            entries: groups,
        });
        this._gpuDescriptorSet!.bindGroupLayout = layout.gpuDescriptorSetLayout.bindGroupLayout!;
        this._gpuDescriptorSet!.bindGroup = bindGroup!;
    }

    public update (refUpdate: boolean = false) {
        // Because layout will be used by multiple desc, reverse assignment through layout is required.
        if(refUpdate && this._gpuDescriptorSet) {
            const layout = this.layout as WebGPUDescriptorSetLayout;
            for(const [binding, entry] of layout.bindGrpLayoutEntries) {
                if(!this._bindGroupEntries.has(binding)) {
                    if(entry.buffer) {
                        const buffer = layout.buffers.get(binding)!;
                        this._buffers[binding] = buffer;
                        this._bindGroupEntries.set(binding, {
                            binding: binding,
                            resource: {
                                buffer: buffer.gpuBuffer.glBuffer!,
                                offset: buffer.gpuBuffer.glOffset,
                                size: buffer.gpuBuffer.size,
                            },
                        });
                    }
                    if(entry.texture) {
                        const texture = layout.textures.get(binding)!;
                        this._textures[binding] = texture;
                        this._bindGroupEntries.set(binding, {
                            binding: binding,
                            resource: texture.getNativeTextureView()!,
                        });
                    }
                    if(entry.sampler) {
                        const sampler = layout.samplers.get(binding)!;
                        this._samplers[binding] = sampler;
                        this._bindGroupEntries.set(binding, {
                            binding: binding,
                            resource: sampler.gpuSampler.glSampler!,
                        });
                    }
                }
            }
            this._createBindGroup();
        } else {
            this._applyBindGroup();
        }
    }
}
