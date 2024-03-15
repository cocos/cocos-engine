import { Sampler } from '../base/states/sampler';
import { WebGPUCmdFuncCreateSampler, WebGPUCmdFuncDestroySampler } from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUSampler } from './webgpu-gpu-objects';
import { SamplerInfo } from '../base/define';
import { cclegacy } from '../../core';

export class WebGPUSampler extends Sampler {
    public get gpuSampler(): IWebGPUGPUSampler {
        return this._gpuSampler!;
    }

    private _gpuSampler: IWebGPUGPUSampler | null = null;
    constructor (info: Readonly<SamplerInfo>, hash: number) {
        super(info, hash);
        this._gpuSampler = {
            glSampler: null,
            minFilter: info.minFilter,
            magFilter: info.magFilter,
            mipFilter: info.mipFilter,
            addressU: info.addressU,
            addressV: info.addressV,
            addressW: info.addressW,

            glMinFilter: 'linear',
            glMagFilter: 'linear',
            glMipFilter: 'linear',
            glWrapS: 'clamp-to-edge',
            glWrapT: 'clamp-to-edge',
            glWrapR: 'clamp-to-edge',
        };
        const device = cclegacy.director.root.device as WebGPUDevice;
        WebGPUCmdFuncCreateSampler(device, this._gpuSampler);
    }

    public destroy() {
        if (this._gpuSampler) {
            const device = cclegacy.director.root.device as WebGPUDevice;
            WebGPUCmdFuncDestroySampler(device, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
