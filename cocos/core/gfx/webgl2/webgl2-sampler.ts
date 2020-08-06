import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { WebGL2CmdFuncCreateSampler, WebGL2CmdFuncDestroySampler } from './webgl2-commands';
import { WebGL2Device } from './webgl2-device';
import { IWebGL2GPUSampler } from './webgl2-gpu-objects';
import { GFXStatus } from '../define';

export class WebGL2Sampler extends GFXSampler {

    public get gpuSampler (): IWebGL2GPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: IWebGL2GPUSampler | null = null;

    public initialize (info: IGFXSamplerInfo): boolean {

        if (info.name !== undefined) {
            this._state.name = info.name;
        }

        if (info.minFilter !== undefined) {
            this._state.minFilter = info.minFilter;
        }

        if (info.magFilter !== undefined) {
            this._state.magFilter = info.magFilter;
        }

        if (info.mipFilter !== undefined) {
            this._state.mipFilter = info.mipFilter;
        }

        if (info.addressU !== undefined) {
            this._state.addressU = info.addressU;
        }

        if (info.addressV !== undefined) {
            this._state.addressV = info.addressV;
        }

        if (info.addressW !== undefined) {
            this._state.addressW = info.addressW;
        }

        if (info.maxAnisotropy !== undefined) {
            this._state.maxAnisotropy = info.maxAnisotropy;
        }

        if (info.cmpFunc !== undefined) {
            this._state.cmpFunc = info.cmpFunc;
        }

        if (info.borderColor !== undefined) {
            this._state.borderColor = info.borderColor;
        }

        if (info.minLOD !== undefined) {
            this._state.minLOD = info.minLOD;
        }

        if (info.maxLOD !== undefined) {
            this._state.maxLOD = info.maxLOD;
        }

        if (info.mipLODBias !== undefined) {
            this._state.mipLODBias = info.mipLODBias;
        }

        this._gpuSampler = {
            glSampler: null,
            minFilter: this._state.minFilter,
            magFilter: this._state.magFilter,
            mipFilter: this._state.mipFilter,
            addressU: this._state.addressU,
            addressV: this._state.addressV,
            addressW: this._state.addressW,
            minLOD: this._state.minLOD,
            maxLOD: this._state.maxLOD,

            glMinFilter: 0,
            glMagFilter: 0,
            glWrapS: 0,
            glWrapT: 0,
            glWrapR: 0,
        };

        WebGL2CmdFuncCreateSampler(this._device as WebGL2Device, this._gpuSampler);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuSampler) {
            WebGL2CmdFuncDestroySampler(this._device as WebGL2Device, this._gpuSampler);
            this._gpuSampler = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
