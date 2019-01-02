import { GFXBufferInfo, GFXBuffer } from '../buffer';
import { GFXDevice } from '../device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-device';
import { GFXMemoryUsageBit } from '../define';

export class WebGLGFXBuffer extends GFXBuffer {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXBufferInfo): boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;

        if(info.stride) {
            this._stride = info.stride;
        }
        this._stride = Math.max(this._stride, 1);

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            this._buffer = new ArrayBuffer(this._size);
            this._bufferView = new Uint8Array(this._buffer);
        }

        //this._isSimulate = (this._usage & GFXBufferUsageBit.TRANSFER_SRC) != GFXBufferUsageBit.NONE;
        this._gpuBuffer = this.webGLDevice.emitCmdCreateGPUBuffer(info, this._buffer);

        return true;
    }

    public destroy() {
        if (this._gpuBuffer) {
            this.webGLDevice.emitCmdDestroyGPUBuffer(this._gpuBuffer);
            this._gpuBuffer = null;
        }

        this._buffer = null;
        this._bufferView = null;
    }

    public update(buffer: ArrayBuffer, offset?: number) {

        if (this._bufferView) {
            this._bufferView.set(new Uint8Array(buffer), offset);
        }

        this.webGLDevice.emitCmdUpdateGPUBuffer(<WebGLGPUBuffer>this._gpuBuffer, offset? offset : 0, buffer);
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBuffer(): WebGLGPUBuffer | null {
        return this._gpuBuffer;
    }

    private _gpuBuffer: WebGLGPUBuffer | null = null;
};
