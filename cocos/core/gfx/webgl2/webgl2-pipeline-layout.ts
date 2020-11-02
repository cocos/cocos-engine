import { PipelineLayout, PipelineLayoutInfo } from '../pipeline-layout';
import { IWebGL2GPUPipelineLayout, IWebGL2GPUDescriptorSetLayout } from './webgl2-gpu-objects';
import { WebGL2DescriptorSetLayout } from './webgl2-descriptor-set-layout';

export class WebGL2PipelineLayout extends PipelineLayout {

    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGL2GPUPipelineLayout | null = null;

    public initialize (info: PipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGL2GPUDescriptorSetLayout[] = [];
        let dynamicOffsetCount = 0;
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGL2DescriptorSetLayout;
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
