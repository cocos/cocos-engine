import { GFXBuffer, GFXBufferSource, IGFXBufferInfo, IGFXIndirectBuffer } from '../buffer';
import { GFXBufferFlagBit, GFXBufferUsageBit, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import {
    WebGLCmdFuncCreateBuffer,
    WebGLCmdFuncDestroyBuffer,
    WebGLCmdFuncResizeBuffer,
    WebGLCmdFuncUpdateBuffer,
} from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';

export class WebGLGFXBuffer extends GFXBuffer {

    public get gpuBuffer (): WebGLGPUBuffer {
        return  this._gpuBuffer!;
    }

    private _gpuBuffer: WebGLGPUBuffer | null = null;
    private _uniformBuffer: Uint8Array | null = null;
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
        } else {
            if ((this._usage & GFXBufferUsageBit.UNIFORM) && this._size > 0) {
                this._uniformBuffer = new Uint8Array(this._size);
            }
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
        } else if (this._usage & GFXBufferUsageBit.UNIFORM) {
            this._gpuBuffer.buffer = this._uniformBuffer;
        }

        WebGLCmdFuncCreateBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);

        this._device.memoryStatus.bufferSize += this._size;
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGLCmdFuncDestroyBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
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

        if (this._uniformBuffer) {
            this._uniformBuffer = new Uint8Array(this._size);
        }

        if (this._bufferView && oldSize !== size) {
            const oldView = this._bufferView;
            this._bufferView = new Uint8Array(this._size);
            this._bufferView.set(oldView);
            if (this._gpuBuffer) {
                this._gpuBuffer.buffer = this._bufferView;
            }
        }

        if (this._gpuBuffer) {
            if (this._uniformBuffer) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            }

            this._gpuBuffer.size = this._size;
            if (this._size > 0) {
                WebGLCmdFuncResizeBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
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

        WebGLCmdFuncUpdateBuffer(
            this._device as WebGLGFXDevice,
            this._gpuBuffer!,
            buffer,
            offset || 0,
            buffSize);
    }
}
