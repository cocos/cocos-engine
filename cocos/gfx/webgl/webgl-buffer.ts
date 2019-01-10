import { GFXBuffer, IGFXBufferInfo } from '../buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';

export class WebGLGFXBuffer extends GFXBuffer {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuBuffer (): WebGLGPUBuffer {
        return  this._gpuBuffer as WebGLGPUBuffer;
    }

    private _gpuBuffer: WebGLGPUBuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXBufferInfo): boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;

        if (info.stride !== undefined) {
            this._stride = info.stride;
        }
        this._stride = Math.max(this._stride, 1);

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            this._buffer = new ArrayBuffer(this._size);
            this._bufferView = new Uint8Array(this._buffer);
        }

        // this._isSimulate = (this._usage & GFXBufferUsageBit.TRANSFER_SRC) != GFXBufferUsageBit.NONE;
        this._gpuBuffer = this.webGLDevice.emitCmdCreateGPUBuffer(info, this._buffer);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            this.webGLDevice.emitCmdDestroyGPUBuffer(this._gpuBuffer);
            this._gpuBuffer = null;
        }

        this._buffer = null;
        this._bufferView = null;
        this._status = GFXStatus.UNREADY;
    }

    public update (buffer: ArrayBuffer, offset?: number, size?: number) {

        const isUniformBuffer = (this._usage & GFXBufferUsageBit.UNIFORM) !== GFXBufferUsageBit.NONE;
        if (this._bufferView && !isUniformBuffer) {
            this._bufferView.set(new Uint8Array(buffer, 0, size), offset);
        }

        this.webGLDevice.emitCmdUpdateGPUBuffer(
            this._gpuBuffer as WebGLGPUBuffer,
            buffer,
            offset !== undefined ? offset : 0,
            size !== undefined ? size : buffer.byteLength);
    }
}
