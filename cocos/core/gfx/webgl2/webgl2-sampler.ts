import { GFXSampler, IGFXSamplerInfo } from '../sampler';
import { WebGL2CmdFuncCreateSampler, WebGL2CmdFuncDestroySampler } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUSampler } from './webgl2-gpu-objects';

export class WebGL2GFXSampler extends GFXSampler {

    public get gpuSampler (): WebGL2GPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: WebGL2GPUSampler | null = null;

    protected _initialize (info: IGFXSamplerInfo): boolean {

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

        WebGL2CmdFuncCreateSampler(this._device as WebGL2GFXDevice, this._gpuSampler);

        return true;
    }

    protected _destroy () {
        if (this._gpuSampler) {
            WebGL2CmdFuncDestroySampler(this._device as WebGL2GFXDevice, this._gpuSampler);
            this._gpuSampler = null;
        }
    }
}
