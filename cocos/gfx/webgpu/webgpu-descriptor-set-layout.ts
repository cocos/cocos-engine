import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { GLStageToWebGPUStage, GLDescTypeToGPUBufferDescType, GLSamplerToGPUSamplerDescType, SEPARATE_SAMPLER_BINDING_OFFSET, TextureSampleTypeTrait } from './webgpu-commands';
import {
    DescriptorSetLayoutInfo,
    DESCRIPTOR_DYNAMIC_TYPE,
    DescriptorSetLayoutBinding,
    Format,
    DescriptorType,
} from '../base/define';
import { DescUpdateFrequency, WebGPUDeviceManager, isBind } from './define';
import { WebGPUTexture } from './webgpu-texture';
import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUSampler } from './webgpu-sampler';

export function FormatToWGPUFormatType(format: Format): GPUTextureSampleType {
    if(format === Format.DEPTH_STENCIL) {
        return 'unfilterable-float';
    }
    return TextureSampleTypeTrait(format);
}
export class WebGPUDescriptorSetLayout extends DescriptorSetLayout {
    get gpuDescriptorSetLayout () { return this._gpuDescriptorSetLayout!; }

    private _gpuDescriptorSetLayout: IWebGPUGPUDescriptorSetLayout | null = null;
    private _bindGrpLayoutEntries: Map<number, GPUBindGroupLayoutEntry> = new Map<number, GPUBindGroupLayoutEntry>();

    private _hasChange = false;
    private _currBinds: number[] = [];
    private _prepareEntries: GPUBindGroupLayoutEntry[] = []
    // private _dirty: boolean = false;

    public buffers: Map<number, WebGPUBuffer> = new Map<number, WebGPUBuffer>();
    public textures: Map<number, WebGPUTexture> = new Map<number, WebGPUTexture>();
    public samplers: Map<number, WebGPUSampler> = new Map<number, WebGPUSampler>();

    public references : DescriptorSet[] = [];
    public get currBinds() {
        return this._currBinds;
    }
    public get prepareEntries() {
        return this._prepareEntries;
    }
    public get bindGrpLayoutEntries() {
        return this._bindGrpLayoutEntries;
    }

    public get hasChanged(): boolean {
        return this._hasChange;
    }
    public resetChanged() {
        this._hasChange = false;
        // for(let ref of this.references) {
        //     (ref as any).prepare(this._currBinds);
        // }
    }
    public initialize (info: Readonly<DescriptorSetLayoutInfo>) {
        Array.prototype.push.apply(this._bindings, info.bindings);

        let descriptorCount = 0; let maxBinding = -1;
        const flattenedIndices: number[] = [];
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            flattenedIndices.push(descriptorCount);
            descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }

        this._bindingIndices = Array(maxBinding + 1).fill(-1);
        const descriptorIndices = this._descriptorIndices = Array(maxBinding + 1).fill(-1);
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            this._bindingIndices[binding.binding] = i;
            descriptorIndices[binding.binding] = flattenedIndices[i];
        }
        const dynamicBindings: number[] = [];
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            if (binding.descriptorType & DESCRIPTOR_DYNAMIC_TYPE) {
                for (let j = 0; j < binding.count; j++) {
                    dynamicBindings.push(binding.binding);
                }
            }
        }
        this._gpuDescriptorSetLayout = {
            bindings: this._bindings,
            dynamicBindings,
            descriptorIndices,
            descriptorCount,
            bindGroupLayout: null,
        };
    }

    

    // In order to avoid binding exceeding the number specified by webgpu,
    // gpulayout changes dynamically instead of binding everything at once.
    public updateBindGroupLayout (binding: DescriptorSetLayoutBinding, buffer: WebGPUBuffer | null, texture: WebGPUTexture | null, sampler: WebGPUSampler | null) {
        let bindIdx = binding.binding;
        const visibility = GLStageToWebGPUStage(binding.stageFlags);
        const entries = this._bindGrpLayoutEntries;
        const wgpuDeviceInst = WebGPUDeviceManager.instance;
        if(sampler) {
            bindIdx = bindIdx + SEPARATE_SAMPLER_BINDING_OFFSET;
        }
        const currEntry: GPUBindGroupLayoutEntry = {} as GPUBindGroupLayoutEntry;
        currEntry.binding = bindIdx;
        currEntry.visibility = visibility;
        // if(entries.has(bindIdx) && visibility === entries.get(bindIdx)!.visibility) {
        //     return;
        // }
        // this._dirty = true;
        if (buffer) {
            currEntry.buffer = { type: GLDescTypeToGPUBufferDescType(binding.descriptorType)! };
            currEntry.buffer.hasDynamicOffset = !!(binding.descriptorType & (DescriptorType.DYNAMIC_STORAGE_BUFFER | DescriptorType.DYNAMIC_UNIFORM_BUFFER));
            // const defaultBuffer = wgpuDeviceInst.getDefaultDescResources(currEntry, buffer.gpuBuffer) as WebGPUBuffer;
            // this.buffers.set(bindIdx, defaultBuffer);
            entries.set(bindIdx, currEntry);
        }
        if (texture) {
            const targetTex = texture as WebGPUTexture;
            currEntry.texture = {
                    sampleType: FormatToWGPUFormatType(texture.format),
                    viewDimension: targetTex.gpuTexture.glTarget,
                    multisampled: targetTex.gpuTexture.samples > 1 ? true : false
                };
            // const defaultTexture = wgpuDeviceInst.getDefaultDescResources(currEntry, targetTex.gpuTexture) as WebGPUTexture;
            // this.textures.set(bindIdx, defaultTexture);
            entries.set(bindIdx, currEntry);
        }
        if (sampler) {
            currEntry.sampler = { type: GLSamplerToGPUSamplerDescType(sampler.info)};
            // const defaultSampler = wgpuDeviceInst.getDefaultDescResources(currEntry, sampler.gpuSampler) as WebGPUSampler;
            // this.samplers.set(bindIdx, defaultSampler);
            entries.set(bindIdx, currEntry);
        }
    }

    public removeRef(ref: DescriptorSet) {
        const index = this.references.indexOf(ref);
        if (index !== -1) {
            this.references.splice(index, 1);
        }
        // this._hasChange = true;
        if(this.references.length === 0) {
            this.clear();
        }
    }

    public addRef(ref: DescriptorSet) {
        if(!this.references.includes(ref)) {
            this.references.push(ref);
        }
    }

    public resetGroupLayout() {
        if(this._gpuDescriptorSetLayout?.bindGroupLayout) {
            this._gpuDescriptorSetLayout.bindGroupLayout = null;
            this._hasChange = true;
        }
    }

    public prepare (frequency: DescUpdateFrequency, binds: number[], vertBinds: number[] = [], fragBinds: number[] = []) {
        if(isBind(binds, this._currBinds) && frequency !== DescUpdateFrequency.LOW
            && binds.length === this._prepareEntries.length) return;
        this._currBinds = binds;
        if(frequency !== DescUpdateFrequency.LOW) {
            this._prepareEntries.length = 0;
            binds.forEach((bind: number) => {
                let currGrpEntryLayout = this._bindGrpLayoutEntries.get(bind < 0 ? 0 : bind)!;
                if(!currGrpEntryLayout && bind < 0) {
                    currGrpEntryLayout = Array.from(this._bindGrpLayoutEntries.values())[0];
                }
                if(vertBinds.includes(currGrpEntryLayout.binding) && !(currGrpEntryLayout.visibility & GPUShaderStage.VERTEX)) {
                    currGrpEntryLayout.visibility |= GPUShaderStage.VERTEX;
                } else if(!vertBinds.includes(currGrpEntryLayout.binding) && (currGrpEntryLayout.visibility & GPUShaderStage.VERTEX)) {
                    currGrpEntryLayout.visibility ^= GPUShaderStage.VERTEX;
                }
                if(fragBinds.includes(currGrpEntryLayout.binding) && !(currGrpEntryLayout.visibility & GPUShaderStage.FRAGMENT)) {
                    currGrpEntryLayout.visibility |= GPUShaderStage.FRAGMENT;
                } else if(!fragBinds.includes(currGrpEntryLayout.binding) && (currGrpEntryLayout.visibility & GPUShaderStage.FRAGMENT)) {
                    currGrpEntryLayout.visibility ^= GPUShaderStage.FRAGMENT;
                }
                this._prepareEntries.push(currGrpEntryLayout!);
            });
        } else {
            this._prepareEntries = Array.from(this._bindGrpLayoutEntries.values());
        }
        this._hasChange = true;
        const nativeDevice = WebGPUDeviceManager.instance.nativeDevice;
        const bindGrpLayout = nativeDevice?.createBindGroupLayout({ entries: this._prepareEntries });
        this._gpuDescriptorSetLayout!.bindGroupLayout = bindGrpLayout!;
    }

    public clear () {
        this.buffers.clear();
        this.textures.clear();
        this.samplers.clear();
        // this.references.length = 0;
        // this._hasChange = true;
        // this._dirty = true;
        this._bindGrpLayoutEntries.clear();
    }

    public destroy () {
        this._bindings.length = 0;
        this.clear();
        this._gpuDescriptorSetLayout = null;
    }
}
