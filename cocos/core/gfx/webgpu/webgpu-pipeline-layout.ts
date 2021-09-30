/* eslint-disable @typescript-eslint/no-unsafe-return */
import { PipelineLayout } from '../base/pipeline-layout';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { PipelineLayoutInfo } from '../base/define';
import { nativeLib } from './webgpu-utils';

export class WebGPUPipelineLayout extends PipelineLayout {
    private _nativePipelineLayout;

    get nativePipelineLayout () {
        return this._nativePipelineLayout;
    }

    public initialize (info: PipelineLayoutInfo) {
        this._setLayouts = info.setLayouts;

        const nativeDevice = nativeLib.nativeDevice;
        const pipelineLayoutInfo = new nativeLib.PipelineLayoutInfoInstance();
        const setLayouts = new nativeLib.DescriptorSetLayoutList();
        for (let i = 0; i < info.setLayouts.length; i++) {
            const descriptorSetLayout = info.setLayouts[i] as WebGPUDescriptorSetLayout;
            setLayouts.push_back(descriptorSetLayout.nativeDescriptorSetLayout);
        }
        pipelineLayoutInfo.setLayouts = setLayouts;
        this._nativePipelineLayout = nativeDevice.createPipelineLayout(pipelineLayoutInfo);
        return true;
    }

    public destroy () {
        this._nativePipelineLayout.destroy();
        this._nativePipelineLayout.delete();
    }
}
