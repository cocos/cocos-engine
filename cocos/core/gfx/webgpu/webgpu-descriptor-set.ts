import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor } from './webgpu-gpu-objects';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUDevice } from './webgpu-device';
import {
    DescriptorType,
    DescriptorSetLayoutBinding,
    DescriptorSetInfo,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
} from '../base/define';

export class WebGPUDescriptorSet extends DescriptorSet {
    get gpuDescriptorSet (): IWebGPUGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGPUGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGPUGPUDescriptorSet | null = null;
    private _bindGroupEntries: GPUBindGroupEntry[] = [];
    private _textureIdxMap = new Map<number, number>();
    private _samplerIdxMap = new Map<number, number>();

    public initialize (info: DescriptorSetInfo): boolean {
        this._layout = info.layout;
        const { bindings, descriptorIndices, descriptorCount } = (info.layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGPUGPUDescriptor[] = [];
        const bindGroup = {} as GPUBindGroup;
        this._gpuDescriptorSet = { gpuDescriptors, descriptorIndices, bindGroup };

        const wgpuDevice = (this._device as WebGPUDevice);
        const defaultResource = wgpuDevice.defaultDescriptorResource!;

        for (let i = 0; i < bindings.length; ++i) {
            const binding = bindings[i];
            for (let j = 0; j < binding.count; j++) {
                if (binding.descriptorType !== DescriptorType.UNKNOWN) {
                    if (binding.descriptorType & DescriptorType.SAMPLER_TEXTURE) {
                        const texture = (defaultResource.texture as unknown as WebGPUTexture).gpuTexture;
                        gpuDescriptors.push({
                            type: binding.descriptorType,
                            gpuBuffer: null,
                            gpuTexture: texture,
                            gpuSampler: null,
                        });

                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding,
                            resource: texture.glTexture!.createView(),
                        };
                        this._bindGroupEntries.push(bindGrpEntry);
                        this._textureIdxMap.set(this._bindGroupEntries.length - 1, i);

                        const sampler = (defaultResource.sampler as unknown as WebGPUSampler).gpuSampler;
                        gpuDescriptors.push({
                            type: binding.descriptorType,
                            gpuBuffer: null,
                            gpuTexture: null,
                            gpuSampler: sampler,
                        });
                        const smpBindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding + 16,
                            resource: sampler.glSampler!,
                        };
                        this._bindGroupEntries.push(smpBindGrpEntry);
                        this._samplerIdxMap.set(this._bindGroupEntries.length - 1, i);
                    } else if (binding.descriptorType & DESCRIPTOR_BUFFER_TYPE) {
                        const buffer = (defaultResource.buffer as WebGPUBuffer).gpuBuffer;
                        gpuDescriptors.push({
                            type: binding.descriptorType,
                            gpuBuffer: buffer,
                            gpuTexture: null,
                            gpuSampler: null,
                        });

                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding,
                            resource: {
                                buffer: buffer.glBuffer!,
                                offset: buffer.glOffset,
                                size: buffer.size,
                            },
                        };
                        this._bindGroupEntries.push(bindGrpEntry);
                    }
                }
            }
        }

        return true;
    }

    public destroy () {
        this._layout = null;
        this._gpuDescriptorSet = null;
        this._bindGroupEntries = [];
        this._samplerIdxMap.clear();
        this._textureIdxMap.clear();
    }

    public update () {
        if (this._isDirty && this._gpuDescriptorSet) {
            const descriptors = this._gpuDescriptorSet.gpuDescriptors;
            const layout = this._layout as WebGPUDescriptorSetLayout;
            /* --------------FIXME: for combined tex/sampler shader--------------*/
            let samplerCount = 0;
            for (let i = 0; i < this._samplers.length; i++) {
                if (this._samplers[i]) { samplerCount++; }
            }
            /*------------------------------------------------------------------*/
            for (let i = 0; i < descriptors.length; ++i) {
                let binding = (this._layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout.bindings[i];
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    if (this._buffers[i]) {
                        descriptors[i].gpuBuffer = (this._buffers[i] as WebGPUBuffer).gpuBuffer;
                        const nativeBuffer = descriptors[i].gpuBuffer?.glBuffer;
                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding,
                            resource: {
                                buffer: nativeBuffer!,
                                offset: descriptors[i].gpuBuffer?.glOffset,
                                size: descriptors[i].gpuBuffer?.size,
                            },
                        };
                        this._bindGroupEntries[i] = bindGrpEntry;
                    }
                } else if (descriptors[i].type & DescriptorType.SAMPLER_TEXTURE) {
                    const samplerIdx = this._samplerIdxMap.get(i)!;
                    const textureIdx = this._textureIdxMap.get(i)!;
                    if (this._samplers[samplerIdx]) {
                        binding = (this._layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout.bindings[samplerIdx];
                        descriptors[i].gpuSampler = (this._samplers[samplerIdx] as unknown as WebGPUSampler).gpuSampler;
                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding + 16,
                            resource: descriptors[i].gpuSampler?.glSampler as GPUSampler,
                        };
                        this._bindGroupEntries[i] = bindGrpEntry;
                    }

                    if (this._textures[textureIdx] && this._bindGroupEntries[i]) {
                        binding = (this._layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout.bindings[textureIdx];
                        descriptors[i].gpuTexture = (this._textures[textureIdx] as unknown as WebGPUTexture).gpuTexture;

                        const bindGrpEntry: GPUBindGroupEntry = {
                            binding: binding.binding,
                            resource: descriptors[i].gpuTexture?.glTexture?.createView() as GPUTextureView,
                        };

                        this._bindGroupEntries[i] = bindGrpEntry;
                    }
                }
            }
            this._isDirty = false;
            const nativeDevice = (this._device as WebGPUDevice).nativeDevice();
            const bindGroup = nativeDevice?.createBindGroup({
                layout: (this._layout as WebGPUDescriptorSetLayout).gpuDescriptorSetLayout.bindGroupLayout!,
                entries: this._bindGroupEntries,
            });

            const encoder = nativeDevice?.createCommandEncoder();
            nativeDevice?.queue.submit([encoder!.finish()]);

            this._gpuDescriptorSet.bindGroup = bindGroup!;
        }
    }
}
