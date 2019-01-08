import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { GFXShader, GFXShaderInfo } from '../shader';
import { WebGLGPUShader } from './webgl-gpu-objects';

export class WebGLGFXShader extends GFXShader {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;

        if(info.blocks !== undefined) {
            this._blocks = info.blocks;
        }

        if(info.samplers !== undefined) {
            this._samplers = info.samplers;
        }

        this._gpuShader = this.webGLDevice.emitCmdCreateGPUShader(info);

        return true;
    }

    public destroy() {
        if (this._gpuShader) {
            this.webGLDevice.emitCmdDestroyGPUShader(this._gpuShader);
            this._gpuShader = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuShader(): WebGLGPUShader {
        return <WebGLGPUShader>this._gpuShader;
    }

    private _gpuShader: WebGLGPUShader | null = null;
};
