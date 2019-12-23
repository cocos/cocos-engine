import { GFXBuffer, GFXBufferSource, IGFXBufferInfo, IGFXIndirectBuffer } from '../buffer';
import { GFXBufferFlagBit, GFXBufferUsageBit, GFXStatus } from '../define';
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
    private _indirectBuffer: IGFXIndirectBuffer | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXBufferInfo): boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;
        this._stride = Math.max(info.stride || this._size, 1);
        this._count = this._size / this._stride;
        this._flags = (info.flags !== undefined ? info.flags : GFXBufferFlagBit.NONE);

        if (this._usage & GFXBufferUsageBit.INDIRECT) {
            this._indirectBuffer = { drawInfos: [] };
        }

        if (this._flags & GFXBufferFlagBit.BAKUP_BUFFER) {
            this._bufferView = new Uint8Array(this._size);
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
            glBuffer: null,
        };

        if (info.usage & GFXBufferUsageBit.INDIRECT) {
            this._gpuBuffer.indirects = this._indirectBuffer!.drawInfos;
        }

        WebGL2CmdFuncCreateBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);

        this._device.memoryStatus.bufferSize += this._size;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGL2CmdFuncDestroyBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
            this._device.memoryStatus.bufferSize -= this._size;
            this._gpuBuffer = null;
        }

        this._bufferView = null;
        this._status = GFXStatus.UNREADY;
    }

    public resize (size: number) {
        const oldSize = this._size;
        this._size = size;
        this._count = this._size / this._stride;

        if (this._bufferView && oldSize !== size) {
            const oldView = this._bufferView;
            this._bufferView = new Uint8Array(this._size);
            this._bufferView.set(oldView);
            if (this._gpuBuffer) {
                this._gpuBuffer.buffer = this._bufferView;
            }
        }

        if (this._gpuBuffer) {
            this._gpuBuffer.size = this._size;
            if (this._size > 0) {
                WebGL2CmdFuncResizeBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
                this._device.memoryStatus.bufferSize -= oldSize;
                this._device.memoryStatus.bufferSize += this._size;
                if (this._bufferView) {
                    this._device.memoryStatus.bufferSize -= oldSize;
                    this._device.memoryStatus.bufferSize += this._size;
                }
            }
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
        if (this._bufferView && buffer !== this._bufferView.buffer) {
            const view = new Uint8Array(buffer as ArrayBuffer, 0, size);
            this._bufferView.set(view, offset);
        }

        WebGL2CmdFuncUpdateBuffer(
            this._device as WebGL2GFXDevice,
            this._gpuBuffer!,
            buffer,
            offset || 0,
            buffSize);
    }
}
