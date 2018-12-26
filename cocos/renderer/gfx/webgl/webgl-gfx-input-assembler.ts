import { GFXDevice } from '../gfx-device';
import { GFXInputAssembler, GFXInputAssemblerInfo } from '../gfx-input-assembler';
import { WebGLGFXDevice } from './webgl-gfx-device';
import { WebGLGPUInputAssembler } from './webgl-gpu-objects';

export class WebGLGFXInputAssembler extends GFXInputAssembler {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXInputAssemblerInfo) : boolean {

        this._attributes = info.attributes;
        this._vertexBuffers = info.vertexBuffers;
        this._indexBuffer = info.indexBuffer;
        this._isIndirect = info.isIndirect;

        this._gpuInputAssembler = this.webGLDevice.emitCmdCreateGPUInputAssembler(info);

        return true;
    }

    public destroy() {
        if(this._gpuInputAssembler) {
            this.webGLDevice.emitCmdDestroyGPUInputAssembler(this._gpuInputAssembler);
            this._gpuInputAssembler = null;
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuInputAssembler() : WebGLGPUInputAssembler | null {
        return this._gpuInputAssembler;
    }

    private _gpuInputAssembler : WebGLGPUInputAssembler | null = null;
};
