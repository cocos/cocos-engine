import { PipelineLayout } from '../base/pipeline-layout';
import { IWebGPUGPUPipelineLayout, IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUDevice } from './webgpu-device';
import { PipelineLayoutInfo } from '../base/define';
import { WebGPUDeviceManager } from './define';

export class WebGPUPipelineLayout extends PipelineLayout {
    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGPUGPUPipelineLayout | null = null;
    private _nativePipelineLayout!: GPUPipelineLayout;
    private _isChange() {
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
            if(setLayout.hasChanged) {
                return true;
            }
        }
        return false;
    }

    public initialize (info: PipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[] = [];
        const nativeDevice = (WebGPUDeviceManager.instance as WebGPUDevice).nativeDevice;
        const bindGrpLayouts: GPUBindGroupLayout[] = [];
        let dynamicOffsetCount = 0;
        const fetchPipelineLayout = (resetAll: boolean = true): GPUPipelineLayout => {
            if(resetAll) {
                gpuSetLayouts.length = 0;
                dynamicOffsetIndices.length = 0;
            }
            bindGrpLayouts.length = 0;
            for (let i = 0; i < this._setLayouts.length; i++) {
                const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
                if (setLayout.gpuDescriptorSetLayout.bindGroupLayout) {
                    if(resetAll) {
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
                    bindGrpLayouts.push(setLayout.gpuDescriptorSetLayout.bindGroupLayout);
                }
                setLayout.resetChange();
            }
            this._nativePipelineLayout = nativeDevice?.createPipelineLayout({ bindGroupLayouts: bindGrpLayouts }) as GPUPipelineLayout;
            return this._nativePipelineLayout;
        }

        fetchPipelineLayout(); 
        const that = this;
        this._gpuPipelineLayout = {
            gpuSetLayouts,
            dynamicOffsetIndices,
            dynamicOffsetCount,
            // In order to avoid binding exceeding the number specified by webgpu,
            // gpulayout changes dynamically instead of binding everything at once.
            get nativePipelineLayout() {
                if(!that._isChange()) {
                    return that._nativePipelineLayout;
                }
                return fetchPipelineLayout(false);
            },
        };

        return true;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
