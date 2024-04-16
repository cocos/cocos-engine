import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDevice } from './webgpu-device';
import { GLStageToWebGPUStage, GLDescTypeToWebGPUDescType, GLDescTypeToGPUBufferDescType, GLSamplerToGPUSamplerDescType, GFXFormatToWGPUFormat, SEPARATE_SAMPLER_BINDING_OFFSET, TextureSampleTypeTrait } from './webgpu-commands';
import {
    DescriptorSetLayoutInfo,
    DESCRIPTOR_DYNAMIC_TYPE,
    DescriptorSetLayoutBinding,
    Format,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
} from '../base/define';
import { Buffer } from '../base/buffer';
import { Sampler } from '../base/states/sampler';
import { Texture } from '../base/texture';
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

    public buffers: WebGPUBuffer[] = [];
    public textures: WebGPUTexture[] = [];
    public samplers: WebGPUSampler[] = [];

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
        if (buffer) {
            this.buffers[bindIdx] = buffer;
            this._bindGrpLayoutEntries.set(bindIdx, {
                binding: bindIdx,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                buffer: { type: GLDescTypeToGPUBufferDescType(binding.descriptorType)! },
            });
        }
        if (texture) {
            const targetTex = texture as WebGPUTexture;
            this.textures[bindIdx] = targetTex;
            this._bindGrpLayoutEntries.set(bindIdx, {
                binding: bindIdx,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                texture: {
                    sampleType: FormatToWGPUFormatType(texture.format),
                    viewDimension: targetTex.gpuTexture.glTarget,
                    multisampled: targetTex.gpuTexture.samples > 1 ? true : false
                },
            });
        }
        if (sampler) {
            const samplerBinding = bindIdx + SEPARATE_SAMPLER_BINDING_OFFSET;
            this.samplers[samplerBinding] = sampler;
            this._bindGrpLayoutEntries.set(samplerBinding, {
                binding: samplerBinding,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                sampler: { type: GLSamplerToGPUSamplerDescType(sampler.info)},
            });
        }
    }

    public prepare (ref: DescriptorSet) {
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
        this.buffers.length = 0;
        this.textures.length = 0;
        this.samplers.length = 0;
        this._bindGrpLayoutEntries.clear();
    }

    public destroy () {
        this._bindings.length = 0;
        this._gpuDescriptorSetLayout = null;
        this.clear();
    }
}
