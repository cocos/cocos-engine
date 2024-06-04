import { PipelineLayout } from '../base/pipeline-layout';
import { IWebGPUGPUPipelineLayout, IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { PipelineLayoutInfo } from '../base/define';
import { WebGPUDeviceManager } from './define';

export class WebGPUPipelineLayout extends PipelineLayout {
    get gpuPipelineLayout () { return this._gpuPipelineLayout!; }

    private _gpuPipelineLayout: IWebGPUGPUPipelineLayout | null = null;
    private _nativePipelineLayout!: GPUPipelineLayout;
    private _bindGrpLayouts: GPUBindGroupLayout[] = [];
    
    // public isChange() {
    //     for (let i = 0; i < this._setLayouts.length; i++) {
    //         const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
    //         if(setLayout.hasChanged) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    public fetchPipelineLayout(resetAll: boolean = true): GPUPipelineLayout {
        const gpuPipelineLayout = this._gpuPipelineLayout!;
        if(resetAll) {
            gpuPipelineLayout.gpuSetLayouts.length = 0;
            gpuPipelineLayout.dynamicOffsetIndices.length = 0;
        }
        const webGPUDevice = WebGPUDeviceManager.instance;
        const nativeDevice = webGPUDevice.nativeDevice;
        this._bindGrpLayouts.length = 0;
        for (let i = 0; i < this._setLayouts.length; i++) {
            const setLayout = this._setLayouts[i] as WebGPUDescriptorSetLayout;
            const bindGroupLayout = setLayout.gpuDescriptorSetLayout.bindGroupLayout;
            if (bindGroupLayout) {
                if(resetAll) {
                    const dynamicBindings = setLayout.gpuDescriptorSetLayout.dynamicBindings;
                    const indices = Array(setLayout.bindingIndices.length).fill(-1);
                    for (let j = 0; j < dynamicBindings.length; j++) {
                        const binding = dynamicBindings[j];
                        if (indices[binding] < 0) indices[binding] = gpuPipelineLayout.dynamicOffsetCount + j;
                    }

                    gpuPipelineLayout.gpuSetLayouts.push(setLayout.gpuDescriptorSetLayout);
                    gpuPipelineLayout.dynamicOffsetIndices.push(indices);
                    gpuPipelineLayout.dynamicOffsetCount += dynamicBindings.length;
                }
                this._bindGrpLayouts[i] = bindGroupLayout;
            }
            // setLayout.resetChange();
        }
        
        this._nativePipelineLayout = nativeDevice?.createPipelineLayout({ bindGroupLayouts: this._bindGrpLayouts }) as GPUPipelineLayout;
        return this._nativePipelineLayout;
    }

    public initialize (info: PipelineLayoutInfo) {
        Array.prototype.push.apply(this._setLayouts, info.setLayouts);

        const dynamicOffsetIndices: number[][] = [];

        const gpuSetLayouts: IWebGPUGPUDescriptorSetLayout[] = [];
        
        let dynamicOffsetCount = 0;

        
        const that = this;
        this._gpuPipelineLayout = {
            setLayouts: this._setLayouts,
            gpuSetLayouts,
            dynamicOffsetIndices,
            dynamicOffsetCount,
            gpuBindGroupLayouts: this._bindGrpLayouts,
            // In order to avoid binding exceeding the number specified by webgpu,
            // gpulayout changes dynamically instead of binding everything at once.
            get nativePipelineLayout() {
                // if(!that.isChange()) {
                    return that._nativePipelineLayout;
                // }
                // return that.fetchPipelineLayout(false);
            },

        };
        this.fetchPipelineLayout(); 
        return true;
    }

    public changeSetLayout(idx: number, setLayout: WebGPUDescriptorSetLayout)
    {
        this._setLayouts[idx] = setLayout;
    }

    public destroy () {
        this._setLayouts.length = 0;
    }
}
