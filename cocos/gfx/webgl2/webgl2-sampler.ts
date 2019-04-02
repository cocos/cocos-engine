import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXSampler, GFXSamplerState, IGFXSamplerInfo } from '../sampler';
import { WebGL2CmdFuncCreateSampler, WebGL2CmdFuncDestroySampler } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUSampler } from './webgl2-gpu-objects';

export class WebGL2GFXSampler extends GFXSampler {

    public get gpuSampler (): WebGL2GPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: WebGL2GPUSampler | null = null;

    constructor (device: GFXDevice) {
        super(device);

        this._state = new GFXSamplerState();
    }

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

            glMinFilter: WebGL2RenderingContext.NONE,
            glMagFilter: WebGL2RenderingContext.NONE,
            glWrapS: WebGL2RenderingContext.NONE,
            glWrapT: WebGL2RenderingContext.NONE,
            glWrapR: WebGL2RenderingContext.NONE,
        };

        WebGL2CmdFuncCreateSampler(this._device as WebGL2GFXDevice, this._gpuSampler);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuSampler) {
            WebGL2CmdFuncDestroySampler(this._device as WebGL2GFXDevice, this._gpuSampler);
            this._gpuSampler = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
