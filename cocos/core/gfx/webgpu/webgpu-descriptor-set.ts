import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUBuffer } from './webgpu-buffer';
import { IWebGPUGPUDescriptorSet, IWebGPUGPUDescriptor } from './webgpu-gpu-objects';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { WebGPUDevice } from './webgpu-device';
import {
    DescriptorType,
    DescriptorSetLayoutBinding,
    DescriptorSetInfo,
    DESCRIPTOR_BUFFER_TYPE,
    DESCRIPTOR_SAMPLER_TYPE,
} from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';

export class WebGPUDescriptorSet extends DescriptorSet {
    private _nativeDescriptorSet;

    public initialize (info: DescriptorSetInfo) {
        this._layout = info.layout;
        const nativeDevice = wgpuWasmModule.nativeDevice;
        const descriptorSetInfo = new wgpuWasmModule.DescriptorSetInfoInstance();
        const layout = info.layout as WebGPUDescriptorSetLayout;
        descriptorSetInfo.setDescriptorSetLayout(layout.nativeDescriptorSetLayout);

        this._nativeDescriptorSet = nativeDevice.createDescriptorSet(descriptorSetInfo);
    }

    public destroy () {
        this._nativeDescriptorSet.destroy();
        this._nativeDescriptorSet.delete();
    }

    public update () {
        this._nativeDescriptorSet.update();
    }
}
