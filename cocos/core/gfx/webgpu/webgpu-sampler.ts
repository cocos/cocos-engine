import { Sampler } from '../base/sampler';
import { WebGPUCmdFuncCreateSampler, WebGPUCmdFuncDestroySampler } from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUSampler } from './webgpu-gpu-objects';
import { SamplerInfo } from '../base/define';

export class WebGPUSampler extends Sampler {
    public get gpuSampler(): IWebGPUGPUSampler {
        return this._gpuSampler!;
    }

    private _gpuSampler: IWebGPUGPUSampler | null = null;

    public initialize(info: SamplerInfo): boolean {
        this._minFilter = info.minFilter;
        this._magFilter = info.magFilter;
        this._mipFilter = info.mipFilter;
        this._addressU = info.addressU;
        this._addressV = info.addressV;
        this._addressW = info.addressW;
        this._maxAnisotropy = info.maxAnisotropy;
        this._cmpFunc = info.cmpFunc;
        this._borderColor = info.borderColor;
        this._mipLODBias = info.mipLODBias;

        this._gpuSampler = {
            glSampler: null,
            minFilter: this._minFilter,
            magFilter: this._magFilter,
            mipFilter: this._mipFilter,
            addressU: this._addressU,
            addressV: this._addressV,
            addressW: this._addressW,

            glMinFilter: 'linear',
            glMagFilter: 'linear',
            glMipFilter: 'linear',
            glWrapS: 'clamp-to-edge',
            glWrapT: 'clamp-to-edge',
            glWrapR: 'clamp-to-edge',
        };

        WebGPUCmdFuncCreateSampler(this._device as WebGPUDevice, this._gpuSampler);

        return true;
    }

    public destroy() {
        if (this._gpuSampler) {
            WebGPUCmdFuncDestroySampler(this._device as WebGPUDevice, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
