import { GFXDevice } from '../device';
import { GFXSampler, GFXSamplerInfo, GFXSamplerState } from '../sampler';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUSampler } from './webgl-gpu-objects';

export class WebGLGFXSampler extends GFXSampler {

    constructor(device : GFXDevice) {
        super(device);

        this._state = new GFXSamplerState;
    }

    public initialize(info : GFXSamplerInfo) : boolean {

        if(info.name) {
            this._state.name = info.name;
        }

        if(info.minFilter) {
            this._state.minFilter = info.minFilter;
        }

        if(info.magFilter) {
            this._state.magFilter = info.magFilter;
        }

        if(info.mipFilter) {
            this._state.mipFilter = info.mipFilter;
        }

        if(info.addressU) {
            this._state.addressU = info.addressU;
        }

        if(info.addressV) {
            this._state.addressV = info.addressV;
        }

        if(info.addressW) {
            this._state.addressW = info.addressW;
        }

        if(info.maxAnisotropy) {
            this._state.maxAnisotropy = info.maxAnisotropy;
        }

        if(info.cmpFunc) {
            this._state.cmpFunc = info.cmpFunc;
        }

        if(info.borderColor) {
            this._state.borderColor = info.borderColor;
        }

        if(info.minLOD) {
            this._state.minLOD = info.minLOD;
        }

        if(info.maxLOD) {
            this._state.maxLOD = info.maxLOD;
        }

        if(info.mipLODBias) {
            this._state.mipLODBias = info.mipLODBias;
        }

        this._gpuSampler = this.webGLDevice.emitCmdCreateGPUSampler(info);

        return true;
    }

    public destroy() {
        if(this._gpuSampler) {
            this.webGLDevice.emitCmdDestroyGPUSampler(this._gpuSampler);
            this._gpuSampler = null;
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuSampler() : WebGLGPUSampler | null {
        return this._gpuSampler;
    }

    private _gpuSampler : WebGLGPUSampler | null = null;
};
