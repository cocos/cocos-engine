import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { toWGPUNativeDescriptorType, toWGPUNativeStageFlags } from './webgpu-commands';
import { DescriptorSetLayoutInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';
import { WebGPUSampler } from './webgpu-sampler';

export class WebGPUDescriptorSetLayout extends DescriptorSetLayout {
    private _nativeDescriptorSetLayout;

    get nativeDescriptorSetLayout () {
        return this._nativeDescriptorSetLayout;
    }

    public initialize (info: DescriptorSetLayoutInfo) {
        this._bindings = info.bindings;
        let descriptorCount = 0; let maxBinding = -1;
        const flattenedIndices: number[] = [];
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            flattenedIndices.push(descriptorCount);
            descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }

        this._bindingIndices = Array(maxBinding + 1).fill(-1);

        const nativeDevice = wgpuWasmModule.nativeDevice;
        const dsLayoutInfo = new wgpuWasmModule.DescriptorSetLayoutInfoInstance();
        dsLayoutInfo.bindings = new wgpuWasmModule.DescriptorSetLayoutBindingList();
        for (let i = 0; i < info.bindings.length; i++) {
            this._bindingIndices[info.bindings[i].binding] = i;

            const binding = new wgpuWasmModule.DescriptorSetLayoutBindingInstance();
            binding.binding = info.bindings[i].binding;
            binding.descriptorType = toWGPUNativeDescriptorType(info.bindings[i].descriptorType);
            binding.count = info.bindings[i].count;
            binding.stageFlags = toWGPUNativeStageFlags(info.bindings[i].stageFlags);
            binding.immutableSamplers = new wgpuWasmModule.SamplerList();
            for (let j = 0; j < info.bindings[i].immutableSamplers.length; j++) {
                const sampler = info.bindings[i].immutableSamplers[j] as WebGPUSampler;
                binding.immutableSamplers.push_back(sampler.nativeSampler);
            }
            dsLayoutInfo.bindings.push_back(binding);
        }

        this._nativeDescriptorSetLayout = nativeDevice.createDescriptorSetLayout(dsLayoutInfo);
        return true;
    }

    public destroy () {
        this._nativeDescriptorSetLayout.destroy();
        this._nativeDescriptorSetLayout.delete();
    }
}
