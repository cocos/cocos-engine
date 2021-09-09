import { Sampler } from '../base/states/sampler';
import { SamplerInfo } from '../base/define';
import { wgpuWasmModule } from './webgpu-utils';
import { toWGPUNativeAddressMode, toWGPUNativeCompareFunc, toWGPUNativeFilter } from './webgpu-commands';

export class WebGPUSampler extends Sampler {
    private _nativeSampler;

    get nativeSampler () {
        return this._nativeSampler;
    }

    constructor (info: SamplerInfo) {
        super(info);

        const samplerInfo = new wgpuWasmModule.SamplerInfoInstance();
        samplerInfo.minFilter = toWGPUNativeFilter(info.minFilter);
        samplerInfo.magFilter = toWGPUNativeFilter(info.magFilter);
        samplerInfo.mipFilter = toWGPUNativeFilter(info.mipFilter);
        samplerInfo.addressU = toWGPUNativeAddressMode(info.addressU);
        samplerInfo.addressV = toWGPUNativeAddressMode(info.addressV);
        samplerInfo.addressW = toWGPUNativeAddressMode(info.addressW);
        samplerInfo.maxAnisotropy = info.maxAnisotropy;
        samplerInfo.cmpFunc = toWGPUNativeCompareFunc(info.cmpFunc);

        const nativeDevice = wgpuWasmModule.nativeDevice;
        this._nativeSampler = nativeDevice.getSampler(samplerInfo);
    }
}
