import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXSampler, GFXSamplerState, IGFXSamplerInfo } from '../sampler';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUSampler } from './webgl-gpu-objects';

export class WebGLGFXSampler extends GFXSampler {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuSampler (): WebGLGPUSampler {
        return  this._gpuSampler!;
    }

    private _gpuSampler: WebGLGPUSampler | null = null;

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

        this._gpuSampler = this.webGLDevice.emitCmdCreateGPUSampler(info);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuSampler) {
            this.webGLDevice.emitCmdDestroyGPUSampler(this._gpuSampler);
            this._gpuSampler = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
