import { GFXDescriptorSetLayout, GFXDescriptorSetLayoutInfo, DESCRIPTOR_DYNAMIC_TYPE } from '../descriptor-set-layout';
import { IWebGL2GPUDescriptorSetLayout } from './webgl2-gpu-objects';

export class WebGL2DescriptorSetLayout extends GFXDescriptorSetLayout {

    get gpuDescriptorSetLayout () { return this._gpuDescriptorSetLayout!; }

    private _gpuDescriptorSetLayout: IWebGL2GPUDescriptorSetLayout | null = null;

    public initialize (info: GFXDescriptorSetLayoutInfo) {
        Array.prototype.push.apply(this._bindings, info.bindings);

        let descriptorCount = 0; let maxBinding = 0;
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            this._descriptorIndices.push(descriptorCount);
            descriptorCount += binding.count;
            if (binding.binding > maxBinding) maxBinding = binding.binding;
        }
        this._descriptorIndices.push(descriptorCount);

        this._bindingIndices = Array(maxBinding).fill(-1);
        for (let i = 0; i < this._bindings.length; i++) {
            const binding = this._bindings[i];
            this._bindingIndices[binding.binding] = i;
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
            bindingIndices: this._bindingIndices,
            descriptorIndices: this._descriptorIndices,
            descriptorCount,
        };

        return true;
    }

    public destroy () {
        this._bindings.length = 0;
    }
}
