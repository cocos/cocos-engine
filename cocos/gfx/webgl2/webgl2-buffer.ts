import { GFXBuffer, GFXBufferSource, IGFXBufferInfo, IGFXIndirectBuffer } from '../buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import {
    WebGL2CmdFuncCreateBuffer,
    WebGL2CmdFuncDestroyBuffer,
    WebGL2CmdFuncResizeBuffer,
    WebGL2CmdFuncUpdateBuffer,
} from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUBuffer } from './webgl2-gpu-objects';

export class WebGL2GFXBuffer extends GFXBuffer {

    public get gpuBuffer (): WebGL2GPUBuffer {
        return  this._gpuBuffer!;
    }

    private _gpuBuffer: WebGL2GPUBuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXBufferInfo): boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;
        this._stride = Math.max(info.stride || this._size, 1);
        this._count = this._size / this._stride;

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            if (this._usage & GFXBufferUsageBit.INDIRECT) {
                this._buffer = { drawInfos: [] };
            } else {
                this._buffer = new ArrayBuffer(this._size);
            }
        }

        this._gpuBuffer = {
            usage: info.usage,
            memUsage: info.memUsage,
            size: info.size,
            stride: this._stride,
            buffer: null,
            vf32: null,
            indirects: [],
            glTarget: 0,
            glBuffer: 0,
        };

        if (this._buffer) {
            if (info.usage & GFXBufferUsageBit.INDIRECT) {
                this._gpuBuffer.indirects = (this._buffer as IGFXIndirectBuffer).drawInfos;
            } else {
                this._gpuBuffer.buffer = this._buffer as ArrayBuffer;
            }
        }

        WebGL2CmdFuncCreateBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGL2CmdFuncDestroyBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
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

        if (this._gpuBuffer) {
            if (this._buffer) {
                if ((this._usage & GFXBufferUsageBit.INDIRECT) === GFXBufferUsageBit.NONE) {
                    this._gpuBuffer.buffer = this._buffer as ArrayBuffer;
                    this._gpuBuffer.size = this._gpuBuffer.buffer.byteLength;
                }
            }

            WebGL2CmdFuncResizeBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
        }
    }

    public update (buffer: GFXBufferSource, offset?: number, size?: number) {

        let buffSize;
        if (size !== undefined ) {
            buffSize = size;
        } else if (this._usage & GFXBufferUsageBit.INDIRECT) {
            buffSize = 0;
        } else {
            buffSize = (buffer as ArrayBuffer).byteLength;
        }

        WebGL2CmdFuncUpdateBuffer(
            this._device as WebGL2GFXDevice,
            this._gpuBuffer!,
            buffer,
            offset || 0,
            buffSize);
    }
}
