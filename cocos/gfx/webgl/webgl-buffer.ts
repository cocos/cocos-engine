import { GFXBufferInfo, GFXBuffer, GFXMemoryUsageBit, GFXBufferAccess, GFXBufferAccessBit, GFXBufferUsageBit } from '../buffer';
import { GFXDevice } from '../device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-device';
import { BufferView } from '../define';

export class WebGLGFXBuffer extends GFXBuffer {

    constructor(device: GFXDevice) {
        super(device);
    }

    public initialize(info: GFXBufferInfo): boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;
        this._stride = info.stride? info.stride : 1;

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            this._buffer = new ArrayBuffer(this._size);
            this._bufferView = new Uint8Array(this._buffer);
        }

        //this._isSimulate = (this._usage & GFXBufferUsageBit.TRANSFER_SRC) != GFXBufferUsageBit.NONE;
        this._gpuBuffer = this.webGLDevice.emitCmdCreateGPUBuffer(info, this._bufferView);

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

    public update(buffer: BufferView, offset: number) {

        if (this._bufferView) {
            this._bufferView.set(buffer, offset);
        }

        this.webGLDevice.emitCmdUpdateGPUBuffer(<WebGLGPUBuffer>this._gpuBuffer, offset, buffer);
    }

    public get webGLDevice(): WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBuffer(): WebGLGPUBuffer | null {
        return this._gpuBuffer;
    }

    private _gpuBuffer: WebGLGPUBuffer | null = null;
};
