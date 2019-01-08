import { GFXDevice } from '../device';
import { GFXInputAssembler, GFXInputAssemblerInfo } from '../input-assembler';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUInputAssembler } from './webgl-gpu-objects';

export class WebGLGFXInputAssembler extends GFXInputAssembler {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXInputAssemblerInfo): boolean {
        
        if(info.vertexBuffers.length === 0) {
            console.error("GFXInputAssemblerInfo.vertexBuffers is null.");
            return false;
        }

        this._attributes = info.attributes;
        this._vertexBuffers = info.vertexBuffers;
        
        if (info.indexBuffer !== undefined) {
            this._indexBuffer = info.indexBuffer;
            this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
        } else {
            let vertBuff = this._vertexBuffers[0];
            this._vertexCount = vertBuff.size / vertBuff.stride;
        }

        if (info.isIndirect !== undefined) {
            this._isIndirect = info.isIndirect;
        }

        this._gpuInputAssembler = this.webGLDevice.emitCmdCreateGPUInputAssembler(info);

        return true;
    }

    public destroy() {
        if (this._gpuInputAssembler) {
            this.webGLDevice.emitCmdDestroyGPUInputAssembler(this._gpuInputAssembler);
            this._gpuInputAssembler = null;
        }
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuInputAssembler(): WebGLGPUInputAssembler {
        return <WebGLGPUInputAssembler>this._gpuInputAssembler;
    }

    private _gpuInputAssembler: WebGLGPUInputAssembler | null = null;
};
