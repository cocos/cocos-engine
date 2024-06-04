import { Sampler } from '../base/states/sampler';
import { WebGPUCmdFuncCreateSampler, WebGPUCmdFuncDestroySampler } from './webgpu-commands';
import { IWebGPUGPUSampler } from './webgpu-gpu-objects';
import { SamplerInfo } from '../base/define';
import { WebGPUDeviceManager } from './define';

export class WebGPUSampler extends Sampler {
    public get gpuSampler(): IWebGPUGPUSampler {
        return this._gpuSampler!;
    }

    private _gpuSampler: IWebGPUGPUSampler | null = null;
    private _hasChange: boolean = false;
    get hasChange() {
        return this._hasChange;
    }
    public resetChange() {
        this._hasChange = false;
    }
    constructor (info: Readonly<SamplerInfo>, hash: number) {
        super(info, hash);
        this._gpuSampler = {
            glSampler: null,
            compare: info.cmpFunc,
            minFilter: info.minFilter,
            magFilter: info.magFilter,
            mipFilter: info.mipFilter,
            addressU: info.addressU,
            addressV: info.addressV,
            addressW: info.addressW,
            maxAnisotropy: info.maxAnisotropy,
            mipLevel: 1,
            
            glMinFilter: 'linear',
            glMagFilter: 'linear',
            glMipFilter: 'linear',
            glWrapS: 'clamp-to-edge',
            glWrapT: 'clamp-to-edge',
            glWrapR: 'clamp-to-edge',
        };
    }

    public createGPUSampler(mipLevel: number = 1) {
        if(this._gpuSampler && !this.gpuSampler.glSampler) {
            this._gpuSampler.mipLevel = mipLevel;
            const device = WebGPUDeviceManager.instance;
            this._hasChange = true;
            WebGPUCmdFuncCreateSampler(device, this._gpuSampler);
        }
    }

    public destroy() {
        if (this._gpuSampler) {
            this._hasChange = true;
            const device = WebGPUDeviceManager.instance;
            WebGPUCmdFuncDestroySampler(device, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
