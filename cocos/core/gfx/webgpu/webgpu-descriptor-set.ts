/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DescriptorSet } from '../base/descriptor-set';
import { WebGPUDescriptorSetLayout } from './webgpu-descriptor-set-layout';
import { DescriptorSetInfo } from '../base/define';
import { nativeLib } from './instantiated';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUSampler } from './webgpu-sampler';
import { WebGPUTexture } from './webgpu-texture';

export class WebGPUDescriptorSet extends DescriptorSet {
    private _nativeDescriptorSet;

    get nativeDescriptorSet () {
        return this._nativeDescriptorSet;
    }

    public initialize (info: DescriptorSetInfo) {
        this._layout = info.layout;
        const nativeDevice = nativeLib.nativeDevice;
        const descriptorSetInfo = new nativeLib.DescriptorSetInfoInstance();
        const layout = info.layout as WebGPUDescriptorSetLayout;
        descriptorSetInfo.setDescriptorSetLayout(layout.nativeDescriptorSetLayout);

        this._nativeDescriptorSet = nativeDevice.createDescriptorSet(descriptorSetInfo);
    }

    public destroy () {
        this._nativeDescriptorSet.destroy();
        this._nativeDescriptorSet.delete();
    }

    public update () {
        if (this._isDirty) {
            for (let i = 0; i < this._buffers.length; i++) {
                if (this._buffers[i]) {
                    this._nativeDescriptorSet.bindBuffer(i, (this._buffers[i] as WebGPUBuffer).nativeBuffer);
                }
            }
            for (let i = 0; i < this._samplers.length; i++) {
                if (this._samplers[i]) {
                    this._nativeDescriptorSet.bindSampler(i, (this._samplers[i] as WebGPUSampler).nativeSampler);
                }
            }
            for (let i = 0; i < this._textures.length; i++) {
                if (this._textures[i]) {
                    this._nativeDescriptorSet.bindTexture(i, (this._textures[i] as WebGPUTexture).nativeTexture);
                }
            }
            this._nativeDescriptorSet.update();
        }
        this._isDirty = false;
    }
}
