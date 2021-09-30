/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DescriptorSetLayout } from '../base/descriptor-set-layout';
import { toWGPUNativeDescriptorType, toWGPUNativeStageFlags } from './webgpu-commands';
import { DescriptorSetLayoutInfo } from '../base/define';
import { nativeLib } from './webgpu-utils';
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
        this._descriptorIndices = Array(maxBinding + 1).fill(-1);
        const nativeDevice = nativeLib.nativeDevice;
        const dsLayoutInfo = new nativeLib.DescriptorSetLayoutInfoInstance();
        const bindings = new nativeLib.DescriptorSetLayoutBindingList();
        for (let i = 0; i < info.bindings.length; i++) {
            this._bindingIndices[info.bindings[i].binding] = i;
            this._descriptorIndices[info.bindings[i].binding] = flattenedIndices[i];
            const binding = new nativeLib.DescriptorSetLayoutBindingInstance();
            binding.setBinding(info.bindings[i].binding);
            binding.setDescriptorType(toWGPUNativeDescriptorType(info.bindings[i].descriptorType));
            binding.setCount(info.bindings[i].count);
            binding.setStageFlags(info.bindings[i].stageFlags);
            const immutableSamplers = new nativeLib.SamplerList();
            for (let j = 0; j < info.bindings[i].immutableSamplers.length; j++) {
                const sampler = info.bindings[i].immutableSamplers[j] as WebGPUSampler;
                immutableSamplers.push_back(sampler.nativeSampler);
            }
            binding.setImmutableSamplers(immutableSamplers);
            bindings.push_back(binding);
        }
        dsLayoutInfo.setBindings(bindings);

        this._nativeDescriptorSetLayout = nativeDevice.createDescriptorSetLayout(dsLayoutInfo);
        return true;
    }

    public destroy () {
        this._nativeDescriptorSetLayout.destroy();
        this._nativeDescriptorSetLayout.delete();
    }
}
