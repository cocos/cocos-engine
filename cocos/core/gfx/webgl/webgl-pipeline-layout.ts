import { GFXPipelineLayout, IGFXPipelineLayoutInfo } from '../pipeline-layout';
import { IWebGLGPUPipelineLayout, IWebGLGPUDescriptorSetLayout } from './webgl-gpu-objects';
import { WebGLDescriptorSetLayout } from './webgl-descriptor-set-layout';

export class WebGLPipelineLayout extends GFXPipelineLayout {

    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGLGPUPipelineLayout | null = null;

    public initialize (info: IGFXPipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGLGPUDescriptorSetLayout[] = [];
        const dynamicOffsetOffsets: number[] = [];
        let dynamicOffsetCount = 0; let idx = 0;
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGLDescriptorSetLayout;
            const dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
            const bindings = setLayout.bindings;
            const indices: number[] = [];
            gpuSetLayouts.push(setLayout.gpuDescriptorSetLayout);
            for (let j = 0, k = 0; j < bindings.length; j++) {
                if (dynamicBindings[k] === j) {
                    indices.push(idx);
                    while (dynamicBindings[k] === j) k++, idx++;
                } else {
                    indices.push(-1);
                }
            }

            dynamicOffsetIndices.push(indices);
            dynamicOffsetOffsets.push(dynamicOffsetCount);
            dynamicOffsetCount += dynamicBindings.length;
        }

        this._gpuPipelineLayout = {
            gpuSetLayouts,
            dynamicOffsetCount,
            dynamicOffsetOffsets,
            dynamicOffsetIndices,
        };

        return true;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
