import { PipelineLayout } from '../base/pipeline-layout';
import { IWebGPUGPUPipelineLayout, IWebGPUGPUDescriptorSetLayout } from './webgpu-gpu-objects';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUDevice } from './webgpu-device';
import { PipelineLayoutInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUPipelineLayout extends PipelineLayout {
    private _nativePipelineLayout;

    get nativePipelineLayout () {
        return this._nativePipelineLayout;
    }

    public initialize (info: PipelineLayoutInfo) {
        const nativeDevice = wgpuWasmModule.nativeDevice;
        const pipelineLayoutInfo = new wgpuWasmModule.PipelineLayoutInfoInstance();
        for (let i = 0; i < info.setLayouts.length; i++) {
            const descriptorSetLayout = info.setLayouts[i] as WebGPUDescriptorSetLayout;
            pipelineLayoutInfo.setLayouts.push_back(descriptorSetLayout.nativeDescriptorSetLayout);
        }
        this._nativePipelineLayout = nativeDevice.createPipelineLayout(pipelineLayoutInfo);
        return true;
    }

    public destroy () {
        this._nativePipelineLayout.destroy();
        this._nativePipelineLayout.delete();
    }
}
