import { GFXDevice } from '../gfx-device';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { GFXShader, GFXShaderInfo } from '../gfx-shader';
import { WebGLGPUShader } from './webgl-gpu-objects';

export class WebGLGFXShader extends GFXShader {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXShaderInfo) : boolean {

        this._name = info.name;
        this._stages = info.stages;
        this._bindings = info.bindings;

        this._gpuShader = this.webGLDevice.emitCmdCreateGPUShader(info);

        return true;
    }

    public destroy() {
        if (this._gpuShader) {
            this.webGLDevice.emitCmdDestroyGPUShader(this._gpuShader);
            this._gpuShader = null;
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuShader() : WebGLGPUShader | null  {
        return this._gpuShader;
    }

    private _gpuShader : WebGLGPUShader | null = null;
};
