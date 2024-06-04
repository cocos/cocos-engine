import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor, IWebGPUGPUBuffer } from './webgpu-gpu-objects';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { FormatToWGPUFormatType, WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import {
    DescriptorSetInfo,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
    DescriptorSetLayoutBinding,
    DescriptorType,
    ShaderStageFlagBit,
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
    private _prepareDynOffsets: number[] = [];
    private _dynamicOffsets: number[] = [];
    private _dynamicOffsetNum: number = 0;

    get dynamicOffsetCount() {
        return this._dynamicOffsetNum;
    }

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
        const destBind = this._gpuDescriptorSet!.gpuDescriptors[bind.binding];
        if(destBind) {
            destBind.gpuBuffer = buffer.gpuBuffer;
        }
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
        buffer.resetChange();
    }

    private _bindTextureEntry(bind: DescriptorSetLayoutBinding, texture: WebGPUTexture) {
        this._gpuDescriptorSet!.gpuDescriptors[bind.binding].gpuTexture = texture.gpuTexture;
        const layout = this._layout as WebGPUDescriptorSetLayout;
        const nativeTexView = texture.getNativeTextureView()!;
        const bindGrpEntry: GPUBindGroupEntry = {
            binding: bind.binding,
            resource: nativeTexView,
        };
        layout.updateBindGroupLayout(bind, null, texture, null);
        this._bindGroupEntries.set(bindGrpEntry.binding, bindGrpEntry);
        texture.resetChange();
    }

    private _bindSamplerEntry(bind: DescriptorSetLayoutBinding, sampler: WebGPUSampler) {
        const samplerIdx = bind.binding + SEPARATE_SAMPLER_BINDING_OFFSET;
        this._gpuDescriptorSet!.gpuDescriptors[bind.binding].gpuSampler = sampler.gpuSampler;
        const layout = this._layout as WebGPUDescriptorSetLayout;
        sampler.createGPUSampler(this._textures[bind.binding].levelCount);
        const bindSamplerGrpEntry: GPUBindGroupEntry = {
            binding: samplerIdx,
            resource: sampler.gpuSampler?.glSampler as GPUSampler,
        };
        layout.updateBindGroupLayout(bind, null, null, sampler);
        this._bindGroupEntries.set(samplerIdx, bindSamplerGrpEntry);
        sampler.resetChange();
    }

    private _bindResourceEntry(bind: number, resource: WebGPUBuffer | WebGPUTexture | WebGPUSampler) {
        const gpuSetLayout = this.layout as WebGPUDescriptorSetLayout;
        const binding = gpuSetLayout.bindings[bind];
        if(resource instanceof WebGPUBuffer) {
            this._bindBufferEntry(binding, resource);
        } else if(resource instanceof WebGPUTexture) {
            this._bindTextureEntry(binding, resource);
        } else if(resource instanceof WebGPUSampler) {
            this._bindSamplerEntry(binding, resource);
        }
    }

    private _applyBindGroup(): void {
        if (this._isDirty && this._gpuDescriptorSet) {
            const layout = this._layout as WebGPUDescriptorSetLayout;
            this._bindGroupEntries.clear();
            this._dynamicOffsets.length = 0;
            const descriptors = this._gpuDescriptorSet.gpuDescriptors;
            for (let i = 0; i < descriptors.length; ++i) {
                let binding = layout.gpuDescriptorSetLayout.bindings[i];
                const bindIdx = binding.binding;
                // const isNeedBind = this._isNeedBindFromLayout(bindIdx);
                if (descriptors[i].type & DESCRIPTOR_BUFFER_TYPE) {
                    const buffer = this._buffers[i] as WebGPUBuffer;
                    if(buffer) {
                        this._bindBufferEntry(binding, buffer);
                        if(descriptors[i].type & (DescriptorType.DYNAMIC_STORAGE_BUFFER | DescriptorType.DYNAMIC_UNIFORM_BUFFER)) {
                            this._dynamicOffsets.push(bindIdx);
                        }
                    }
                } else if (descriptors[i].type & DESCRIPTOR_SAMPLER_TYPE) {
                        // texture
                        const currTex = this._textures[i] as WebGPUTexture;
                        if(currTex) {
                            this._bindTextureEntry(binding, currTex);
                        }
                        // sampler
                        const currSampler = this._samplers[i] as WebGPUSampler;
                        if(currSampler) {
                            this._bindSamplerEntry(binding, currSampler);
                        }
                    }
            }
            this._isDirty = false;
            this._needUpdate = true;
        }
    }

    private _resetPrepareDynOffsets() {
        this._prepareDynOffsets.length = 0;
        this._dynamicOffsetNum = 0;
    }

    private _hasIncludeDynamic() {
        if(!this._dynamicOffsets.length) {
            this._resetPrepareDynOffsets();
            return true;
        }
        for(const entry of this._prepareEntries) {
            if(this._dynamicOffsets.includes(entry.binding) && !this._prepareDynOffsets.includes(entry.binding)) {
                return false;
            }
        }
        return true;
    }

    private _hasResourceChange(bind: number, resource: WebGPUBuffer | WebGPUTexture | WebGPUSampler): boolean {
        if (resource && resource.hasChange) {
            this._bindResourceEntry(bind, resource);
            return true;
        }
        return false;
      }
      
      private _isResourceChange(binds: number[]): boolean {
        return binds.every((bind) => {
          const resource = this._buffers[bind] as WebGPUBuffer || this._textures[bind] || this._samplers[bind];
          return !this._hasResourceChange(bind, resource);
        });
      }

    public prepare(frequency: DescUpdateFrequency, binds: number[], vertBinds: number[] = [], fragBinds: number[] = []) {
        // set null
        const layout = this._layout as WebGPUDescriptorSetLayout;
        if(!binds) {
            const device = WebGPUDeviceManager.instance;
            if(!this._bindGroupEntries.size) {
                const gpuSetLayout = device.defaultResource.setLayout as WebGPUDescriptorSetLayout;
                const binding = gpuSetLayout.bindings[0];
                this._bindBufferEntry(binding, device.defaultResource.buffer);
                this._needUpdate = true;
                this.prepare(frequency, [-1]);
            } else {
                this.prepare(frequency, [-1]);
            }
            // this._resetPrepareDynOffsets();
            return;
        }
        const isLowFrequency = frequency === DescUpdateFrequency.LOW;
        const breakUpdate = !this._needUpdate && (isLowFrequency ? this._gpuDescriptorSet!.bindGroup : (isBind(binds, this._currBinds) && isBind(binds, layout.currBinds)))
        && this._hasIncludeDynamic() && this._isResourceChange(binds);
        if (breakUpdate) return;
        this._needUpdate = false;
        this._currBinds = binds;
        this._resetPrepareDynOffsets();
        this._prepareEntries.length = 0;
        if(!isLowFrequency) {
            binds.forEach((bind: number) => {
                const currBind = bind < 0 ? 0 : bind;
                let currGrpEntry = this._bindGroupEntries.get(currBind)!;
                if(!currGrpEntry && bind < 0) {
                    currGrpEntry = Array.from(this._bindGroupEntries.values())[0];
                }
                if(this._dynamicOffsets.includes(currGrpEntry.binding)) {
                    this._prepareDynOffsets.push(currGrpEntry.binding);
                    this._dynamicOffsetNum++;
                }
                this._prepareEntries.push(currGrpEntry!);
            });
        } else {
            this._bindGroupEntries.forEach((val, currBind) => {
                if(val.resource instanceof GPUTextureView) {
                    const currTex = this._textures[currBind] as WebGPUTexture;
                    const texFormat = FormatToWGPUFormatType(currTex.format);
                    if(layout.bindGrpLayoutEntries.get(currBind)?.texture?.sampleType !== texFormat) {
                        layout.updateBindGroupLayout(layout.gpuDescriptorSetLayout.bindings[currBind], null, currTex, null);
                    }
                }
                this._prepareEntries.push(val);
                if(this._dynamicOffsets.includes(currBind)) {
                    this._prepareDynOffsets.push(currBind);
                    this._dynamicOffsetNum++;
                }
            });
        }
        layout.prepare(frequency, binds, vertBinds, fragBinds);
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
