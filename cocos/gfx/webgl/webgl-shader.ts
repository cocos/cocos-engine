import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXShader, IGFXShaderInfo } from '../shader';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUShader } from './webgl-gpu-objects';

export class WebGLGFXShader extends GFXShader {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuShader (): WebGLGPUShader {
        return  this._gpuShader!;
    }

    private _gpuShader: WebGLGPUShader | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXShaderInfo): boolean {

        this._name = info.name;
        this._stages = info.stages;

        if (info.blocks !== undefined) {
            this._blocks = info.blocks;
        }

        if (info.samplers !== undefined) {
            this._samplers = info.samplers;
        }

        this._gpuShader = this.webGLDevice.emitCmdCreateGPUShader(info);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuShader) {
            this.webGLDevice.emitCmdDestroyGPUShader(this._gpuShader);
            this._gpuShader = null;
        }
        this._status = GFXStatus.UNREADY;
    }
}
