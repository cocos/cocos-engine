import { GFXDevice } from '../gfx-device';
import { GFXSampler, GFXSamplerInfo } from '../gfx-sampler';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUSampler } from './webgl-gpu-objects';

export class WebGLGFXSampler extends GFXSampler {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXSamplerInfo) : boolean {

        this._state = info;
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
