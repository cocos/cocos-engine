import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDevice } from './webgpu-device';
import { GLStageToWebGPUStage, GLDescTypeToWebGPUDescType } from './webgpu-commands';
import {
    DescriptorType,
    TextureUsage,
    TextureUsageBit,
    DescriptorSetLayoutInfo,
    DESCRIPTOR_DYNAMIC_TYPE,
    DescriptorSetLayoutBinding,
} from '../base/define';
import { Buffer } from '../base/buffer';
import { Sampler } from '../base/states/sampler';
import { Texture } from '../base/texture';
import { WebGPUDeviceManager } from './define';

function texUsageToTexType (usage: TextureUsage): GPUTextureUsageFlags {
    switch (usage) {
        case TextureUsageBit.SAMPLED: return GPUTextureUsage.TEXTURE_BINDING;
        case TextureUsageBit.TRANSFER_SRC: return GPUTextureUsage.COPY_SRC;
        case TextureUsageBit.TRANSFER_DST: return GPUTextureUsage.COPY_DST;
        case TextureUsageBit.STORAGE: return GPUTextureUsage.STORAGE_BINDING;
        case TextureUsageBit.INPUT_ATTACHMENT: return GPUTextureUsage.STORAGE_BINDING;
        case TextureUsageBit.DEPTH_STENCIL_ATTACHMENT: return GPUTextureUsage.RENDER_ATTACHMENT;
        case TextureUsageBit.COLOR_ATTACHMENT: return GPUTextureUsage.RENDER_ATTACHMENT;
        default: return GPUTextureUsage.TEXTURE_BINDING;
    }
}
export class WebGPUDescriptorSetLayout extends DescriptorSetLayout {
    get gpuDescriptorSetLayout () { return this._gpuDescriptorSetLayout!; }

    private _gpuDescriptorSetLayout: IWebGPUGPUDescriptorSetLayout | null = null;
    private _bindGrpLayoutEntries: GPUBindGroupLayoutEntry[] = [];

    public initialize (info: DescriptorSetLayoutInfo) {
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
            if (binding.descriptorType !== DescriptorType.UNKNOWN) {
                const grpLayoutEntry: GPUBindGroupLayoutEntry = {
                    binding: binding.binding,
                    visibility: GLStageToWebGPUStage(binding.stageFlags),
                    // type: GLDescTypeToWebGPUDescType(binding.descriptorType)!,
                };
                this._bindGrpLayoutEntries.push(grpLayoutEntry);

                /* ---------------FIXME: temp solution for combined tex/sampler---------------------*/
                if (binding.descriptorType === DescriptorType.SAMPLER_TEXTURE) {
                    const grpLayoutEntry: GPUBindGroupLayoutEntry = {
                        binding: binding.binding + 16,
                        visibility: GLStageToWebGPUStage(binding.stageFlags),
                        // type: 'sampler',
                    };
                    this._bindGrpLayoutEntries.push(grpLayoutEntry);
                }
                /*---------------------------------------------------------------------------------*/
            }
        }
        const nativeDevice = (WebGPUDeviceManager.instance as WebGPUDevice).nativeDevice;
        const bindGrpLayout = nativeDevice?.createBindGroupLayout({ entries: this._bindGrpLayoutEntries });

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
            bindGroupLayout: bindGrpLayout!,
        };

        return true;
    }

    public updateBindGroupLayout (index: number, binding: DescriptorSetLayoutBinding, buffer: Buffer | null, texture: Texture | null, sampler: Sampler | null) {
        if (buffer) {
            this._bindGrpLayoutEntries[index] = {
                binding: binding.binding,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                // type: GLDescTypeToWebGPUDescType(binding.descriptorType)!,
            };
        }
        if (sampler) {
            this._bindGrpLayoutEntries[index] = {
                binding: binding.binding,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                // type: GLDescTypeToWebGPUDescType(binding.descriptorType)!,
            };
        }
        if (texture) {
            this._bindGrpLayoutEntries[index] = {
                binding: binding.binding,
                visibility: GLStageToWebGPUStage(binding.stageFlags),
                // type: texUsageToTexType(texture.usage),
            };
        }
    }

    public prepare () {
        const nativeDevice = WebGPUDeviceManager.instance.nativeDevice;
        const bindGrpLayout = nativeDevice?.createBindGroupLayout({ entries: this._bindGrpLayoutEntries });
        this._gpuDescriptorSetLayout!.bindGroupLayout = bindGrpLayout!;
    }

    public destroy () {
        this._bindings.length = 0;
    }
}
