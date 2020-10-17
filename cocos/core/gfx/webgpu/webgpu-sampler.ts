import { GFXSampler, GFXSamplerInfo } from '../sampler';
import { WebGPUCmdFuncCreateSampler, WebGPUCmdFuncDestroySampler } from './WebGPU-commands';
import { WebGPUDevice } from './WebGPU-device';
import { IWebGPUGPUSampler } from './WebGPU-gpu-objects';

export class WebGPUSampler extends GFXSampler {

    public get gpuSampler (): IWebGPUGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGPUGPUSampler | null = null;

    public initialize (info: GFXSamplerInfo): boolean {

        this._minFilter = info.minFilter;
        this._magFilter = info.magFilter;
        this._mipFilter = info.mipFilter;
        this._addressU = info.addressU;
        this._addressV = info.addressV;
        this._addressW = info.addressW;
        this._maxAnisotropy = info.maxAnisotropy;
        this._cmpFunc = info.cmpFunc;
        this._borderColor = info.borderColor;
        this._minLOD = info.minLOD;
        this._maxLOD = info.maxLOD;
        this._mipLODBias = info.mipLODBias;

        this._gpuSampler = {
            glSampler: null,
            minFilter: this._minFilter,
            magFilter: this._magFilter,
            mipFilter: this._mipFilter,
            addressU: this._addressU,
            addressV: this._addressV,
            addressW: this._addressW,
            minLOD: this._minLOD,
            maxLOD: this._maxLOD,

            glMinFilter: 0,
            glMagFilter: 0,
            glWrapS: 0,
            glWrapT: 0,
            glWrapR: 0,
        };

        WebGPUCmdFuncCreateSampler(this._device as WebGPUDevice, this._gpuSampler);

        return true;
    }

    public destroy () {
        if (this._gpuSampler) {
            WebGPUCmdFuncDestroySampler(this._device as WebGPUDevice, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
