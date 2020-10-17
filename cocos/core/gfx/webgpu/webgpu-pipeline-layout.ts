import { GFXPipelineLayout, GFXPipelineLayoutInfo } from '../pipeline-layout';
import { IWebGPUGPUPipelineLayout, IWebGPUGPUDescriptorSetLayout } from './WebGPU-gpu-objects';
import { WebGPUDescriptorSetLayout } from './WebGPU-descriptor-set-layout';

export class WebGPUPipelineLayout extends GFXPipelineLayout {

    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGPUGPUPipelineLayout | null = null;

    public initialize (info: GFXPipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[] = [];
        let dynamicOffsetCount = 0;
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
            const dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
            const indices = Array(setLayout.bindingIndices.length).fill(-1);
            for (let j = 0; j < dynamicBindings.length; j++) {
                const binding = dynamicBindings[j];
                if (indices[binding] < 0) indices[binding] = dynamicOffsetCount + j;
            }

            gpuSetLayouts.push(setLayout.gpuDescriptorSetLayout);
            dynamicOffsetIndices.push(indices);
            dynamicOffsetCount += dynamicBindings.length;
        }

        this._gpuPipelineLayout = {
            gpuSetLayouts,
            dynamicOffsetIndices,
            dynamicOffsetCount,
        };

        return true;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
