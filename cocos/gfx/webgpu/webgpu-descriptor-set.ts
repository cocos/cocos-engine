import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor, IWebGPUGPUBuffer } from './webgpu-gpu-objects';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import {
    DescriptorSetInfo,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
    DescriptorSetLayoutBinding,
} from '../base/define';
import { DescUpdateFrequency, WebGPUDeviceManager, isBind } from './define';
import { SEPARATE_SAMPLER_BINDING_OFFSET } from './webgpu-commands';

export class WebGPUDescriptorSet extends DescriptorSet {
    get gpuDescriptorSet (): IWebGPUGPUDescriptorSet {
        return this._gpuDescriptorSet as IWebGPUGPUDescriptorSet;
    }

    private _gpuDescriptorSet: IWebGPUGPUDescriptorSet | null = null;
    private _bindGroupEntries: Map<number, GPUBindGroupEntry> = new Map<number, GPUBindGroupEntry>();
    private _prepareEntries: GPUBindGroupEntry[] = [];
    private _currBinds: number[] = [];
    private _needUpdate: boolean = false;

    public initialize (info: Readonly<DescriptorSetInfo>) {
        const layout = this._layout = info.layout as WebGPUDescriptorSetLayout;
        layout.addRef(this);
        const { bindings, descriptorIndices, descriptorCount } = layout.gpuDescriptorSetLayout;

        this._buffers = Array(descriptorCount).fill(null);
        this._textures = Array(descriptorCount).fill(null);
        this._samplers = Array(descriptorCount).fill(null);

        const gpuDescriptors: IWebGPUGPUDescriptor[] = [];
        const bindGroup = null!;
        const bindGroupLayout = null!;
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

    private _bindBufferEntry(bind: DescriptorSetLayoutBinding, buffer: WebGPUBuffer) {
        const layout = this._layout as WebGPUDescriptorSetLayout;
        const nativeBuffer = buffer.gpuBuffer.glBuffer;
        const bindGrpEntry: GPUBindGroupEntry = {
            binding: bind.binding,
            resource: {
                buffer: nativeBuffer!,
                offset: buffer.gpuBuffer.glOffset,
                size: buffer.gpuBuffer.size,
            },
        };
        layout.updateBindGroupLayout(bind, buffer, null, null);
        this._bindGroupEntries.set(bindGrpEntry.binding, bindGrpEntry);
    }

    private _applyBindGroup(): void {
        if (this._isDirty && this._gpuDescriptorSet) {
            const layout = this._layout as WebGPUDescriptorSetLayout;
            this._bindGroupEntries.clear();
            // Because layout can be used on different objects, it can't simply clean it up
            // layout.clear();
            // Although some shaders do not use the specified setindex, webgpu is also strictly checked.
            // It is also to avoid binding beyond the specified number of WebGPU
            // let isEmpty = this._isEmpty();
            const descriptors = this._gpuDescriptorSet.gpuDescriptors;
            
            const device = WebGPUDeviceManager.instance;
            for (let i = 0; i < descriptors.length; ++i) {
                let binding = layout.gpuDescriptorSetLayout.bindings[i];
                const bindIdx = binding.binding;
                // const isNeedBind = this._isNeedBindFromLayout(bindIdx);
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    const buffer = this._buffers[i] as WebGPUBuffer;
                    if(buffer) {
                        descriptors[i].gpuBuffer = buffer.gpuBuffer;
                        this._bindBufferEntry(binding, buffer);
                    }
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                        // texture
                        const currTex = this._textures[i] as WebGPUTexture;
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
                        const currSampler = this._samplers[i] as WebGPUSampler;
                        
                        if(currSampler) {
                            descriptors[i].gpuSampler = currSampler.gpuSampler;
                            const bindSamplerGrpEntry: GPUBindGroupEntry = {
                                binding: samplerIdx,
                                resource: descriptors[i].gpuSampler?.glSampler as GPUSampler,
                            };
                            layout.updateBindGroupLayout(binding, null, null, currSampler);
                            this._bindGroupEntries.set(samplerIdx, bindSamplerGrpEntry);
                        }
                    }
            }
            this._isDirty = false;
            this._needUpdate = true;
        }
    }

    public prepare(frequency: DescUpdateFrequency, binds: number[]) {
        // set null
        const layout = this._layout as WebGPUDescriptorSetLayout;
        if(!binds) {
            const device = WebGPUDeviceManager.instance;
            if(!this._bindGroupEntries.size) {
                const gpuSetLayout = device.defaultResource.setLayout as WebGPUDescriptorSetLayout;
                this._bindBufferEntry(gpuSetLayout.bindings[0], device.defaultResource.buffer);
                this._needUpdate = true;
                this.prepare(frequency, [-1]);
            } else {
                this.prepare(frequency, [-1]);
            }
            return;
        }
        const isLowFrequency = frequency === DescUpdateFrequency.LOW;
        const breakUpdate = !this._needUpdate && (isLowFrequency ? this._gpuDescriptorSet!.bindGroup : isBind(binds, this._currBinds)
            && isBind(binds, layout.currBinds));
        if (breakUpdate) return;
        this._needUpdate = false;
        this._currBinds = binds;
        if(!isLowFrequency) {
            this._prepareEntries.length = 0;
            binds.forEach((bind: number) => {
                let currGrpEntry = this._bindGroupEntries.get(bind < 0 ? 0 : bind);
                if(!currGrpEntry && bind < 0) {
                    currGrpEntry = Array.from(this._bindGroupEntries.values())[0];
                }
                this._prepareEntries.push(currGrpEntry!);
            });
        } else {
            this._prepareEntries = Array.from(this._bindGroupEntries.values());
        }
        layout.prepare(frequency, binds);
        this._createBindGroup();
    }

    private _createBindGroup() {
        const device = WebGPUDeviceManager.instance;
        const nativeDevice = device.nativeDevice;
        const layout = this._layout as WebGPUDescriptorSetLayout;
        const bindGroup = nativeDevice?.createBindGroup({
            layout: layout.gpuDescriptorSetLayout.bindGroupLayout!,
            entries: this._prepareEntries,
        });
        this._gpuDescriptorSet!.bindGroupLayout = layout.gpuDescriptorSetLayout.bindGroupLayout!;
        this._gpuDescriptorSet!.bindGroup = bindGroup!;
    }

    public update () {
        this._applyBindGroup();
    }
}
