import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { GLStageToWebGPUStage, GLDescTypeToGPUBufferDescType, GLSamplerToGPUSamplerDescType, SEPARATE_SAMPLER_BINDING_OFFSET, TextureSampleTypeTrait } from './webgpu-commands';
import {
    DescriptorSetLayoutInfo,
    DESCRIPTOR_DYNAMIC_TYPE,
    DescriptorSetLayoutBinding,
    Format,
} from '../base/define';
import { WebGPUDeviceManager } from './define';
import { WebGPUTexture } from './webgpu-texture';
import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUSampler } from './webgpu-sampler';

function FormatToWGPUFormatType(format: Format): GPUTextureSampleType {
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
    // private _dirty: boolean = false;

    public buffers: Map<number, WebGPUBuffer> = new Map<number, WebGPUBuffer>();
    public textures: Map<number, WebGPUTexture> = new Map<number, WebGPUTexture>();
    public samplers: Map<number, WebGPUSampler> = new Map<number, WebGPUSampler>();

    public references : DescriptorSet[] = [];
    public get bindGrpLayoutEntries() {
        return this._bindGrpLayoutEntries;
    }

    public get hasChanged(): boolean {
        return this._hasChange;
    }
    public resetChange() {
        this._hasChange = false;
        for(let ref of this.references) {
            (ref as any).update(true);
        }
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
            const defaultBuffer = wgpuDeviceInst.getDefaultDescResources(currEntry, buffer.gpuBuffer) as WebGPUBuffer;
            this.buffers.set(bindIdx, defaultBuffer);
            entries.set(bindIdx, currEntry);
        }
        if (texture) {
            const targetTex = texture as WebGPUTexture;
            currEntry.texture = {
                    sampleType: FormatToWGPUFormatType(texture.format),
                    viewDimension: targetTex.gpuTexture.glTarget,
                    multisampled: targetTex.gpuTexture.samples > 1 ? true : false
                };
            const defaultTexture = wgpuDeviceInst.getDefaultDescResources(currEntry, targetTex.gpuTexture) as WebGPUTexture;
            this.textures.set(bindIdx, defaultTexture);
            entries.set(bindIdx, currEntry);
        }
        if (sampler) {
            currEntry.sampler = { type: GLSamplerToGPUSamplerDescType(sampler.info)};
            const defaultSampler = wgpuDeviceInst.getDefaultDescResources(currEntry, sampler.gpuSampler) as WebGPUSampler;
            this.samplers.set(bindIdx, defaultSampler);
            entries.set(bindIdx, currEntry);
        }
    }

    public removeRef(ref: DescriptorSet) {
        const index = this.references.indexOf(ref);
        if (index !== -1) {
            this.references.splice(index, 1);
        }
        this._hasChange = true;
        if(this.references.length === 0) {
            this.clear();
        }
    }

    public prepare (ref: DescriptorSet) {
        // if(!this._dirty) {
        //     return;
        // }
        // this._dirty = false;
        this._hasChange = true;
        if(!this.references.includes(ref)) {
            this.references.push(ref);
        }
        const nativeDevice = WebGPUDeviceManager.instance.nativeDevice;
        const layouts = Array.from(this._bindGrpLayoutEntries.values());
        const bindGrpLayout = nativeDevice?.createBindGroupLayout({ entries: layouts });
        this._gpuDescriptorSetLayout!.bindGroupLayout = bindGrpLayout!;
    }

    public clear () {
        this.buffers.clear();
        this.textures.clear();
        this.samplers.clear();
        this.references.length = 0;
        this._hasChange = true;
        // this._dirty = true;
        this._bindGrpLayoutEntries.clear();
    }

    public destroy () {
        this._bindings.length = 0;
        this.clear();
        this._gpuDescriptorSetLayout = null;
    }
}
