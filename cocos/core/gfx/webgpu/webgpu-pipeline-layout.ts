import { PipelineLayout } from '../base/pipeline-layout';
import { IWebGPUGPUPipelineLayout, IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUDevice } from './webgpu-device';
import { PipelineLayoutInfo } from '../base/define';

export class WebGPUPipelineLayout extends PipelineLayout {
    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGPUGPUPipelineLayout | null = null;

    public initialize (info: PipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[] = [];
        const nativeDevice = (this._device as WebGPUDevice).nativeDevice();
        const bindGrpLayouts: GPUBindGroupLayout[] = [];
        let dynamicOffsetCount = 0;
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
            if (setLayout.gpuDescriptorSetLayout.bindGroupLayout) {
                const dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
                const indices = Array(setLayout.bindingIndices.length).fill(-1);
                for (let j = 0; j < dynamicBindings.length; j++) {
                    const binding = dynamicBindings[j];
                    if (indices[binding] < 0) indices[binding] = dynamicOffsetCount + j;
                }

                gpuSetLayouts.push(setLayout.gpuDescriptorSetLayout);
                dynamicOffsetIndices.push(indices);
                dynamicOffsetCount += dynamicBindings.length;

                bindGrpLayouts.push(setLayout.gpuDescriptorSetLayout.bindGroupLayout);
            }
        }

        const pipelineLayout = nativeDevice?.createPipelineLayout({ bindGroupLayouts: bindGrpLayouts }) as GPUPipelineLayout;

        this._gpuPipelineLayout = {
            gpuSetLayouts,
            dynamicOffsetIndices,
            dynamicOffsetCount,
            nativePipelineLayout: pipelineLayout,
        };

        return true;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
