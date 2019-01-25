import { GFXBuffer, GFXBufferSource, IGFXBufferInfo } from '../buffer';
import { GFXBufferUsageBit, GFXGetTypeSize, GFXMemoryUsageBit, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';

export class WebGLGFXBuffer extends GFXBuffer {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuBuffer (): WebGLGPUBuffer {
        return  this._gpuBuffer!;
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
        this._count = this._size / this._stride;

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            if (this._usage & GFXBufferUsageBit.INDIRECT) {
                this._buffer = { drawInfos: [] };
            } else {
                this._buffer = new ArrayBuffer(this._size);
            }
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
        this._status = GFXStatus.UNREADY;
    }

    public resize (size: number) {
        this._size = size;
        this._count = this._size / this._stride;

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            if ((this._usage & GFXBufferUsageBit.INDIRECT) === GFXBufferUsageBit.NONE) {
                this._buffer = new ArrayBuffer(this._size);
            }
        }

        this.webGLDevice.emitCmdResizeGPUBuffer(this._gpuBuffer!, this._buffer);
    }

    public update (buffer: GFXBufferSource, offset?: number, size?: number) {

        // const isUniformBuffer = (this._usage & GFXBufferUsageBit.UNIFORM) !== GFXBufferUsageBit.NONE;
        let buffSize;
        if (size !== undefined ) {
            buffSize = size;
        } else if (this._usage & GFXBufferUsageBit.INDIRECT) {
            buffSize = 0;
        } else {
            buffSize = (buffer as ArrayBuffer).byteLength;
        }

        this.webGLDevice.emitCmdUpdateGPUBuffer(
            this._gpuBuffer!,
            buffer,
            offset !== undefined ? offset : 0,
            buffSize);
    }
}
