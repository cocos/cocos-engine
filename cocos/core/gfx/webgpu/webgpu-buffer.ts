import { Buffer } from '../base/buffer';

import {
    BufferFlagBit,
    BufferUsageBit,
    IndirectBuffer,
    BufferSource,
    BufferInfo,
    BufferViewInfo
} from '../base/define';
import {
    WebGPUCmdFuncCreateBuffer,
    WebGPUCmdFuncDestroyBuffer,
    WebGPUCmdFuncResizeBuffer,
    WebGPUCmdFuncUpdateBuffer,
} from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUBuffer } from './webgpu-gpu-objects';

export class WebGPUBuffer extends Buffer {
    get gpuBuffer(): IWebGPUGPUBuffer {
        return this._gpuBuffer!;
    }

    private _gpuBuffer: IWebGPUGPUBuffer | null = null;

    public initialize(info: BufferInfo | BufferViewInfo): boolean {
        if ('buffer' in info) { // buffer view
            // validate: webGPU buffer offset must be 256 bytes aligned
            // which can be guaranteed by WebGPUDevice::uboOffsetAligned

            this._isBufferView = true;

            const buffer = info.buffer as WebGPUBuffer;

            this._usage = buffer.usage;
            this._memUsage = buffer.memUsage;
            this._size = this._stride = Math.ceil(info.range / 4) * 4;
            this._count = 1;
            this._flags = buffer.flags;

            this._gpuBuffer = {
                usage: this._usage,
                memUsage: this._memUsage,
                size: this._size,
                stride: this._stride,
                buffer: null,
                indirects: buffer.gpuBuffer.indirects,
                glTarget: buffer.gpuBuffer.glTarget,
                glBuffer: buffer.gpuBuffer.glBuffer,
                glOffset: info.offset,
                drawIndirectByIndex: false,
            };
        } else { // native buffer
            this._usage = info.usage;
            this._memUsage = info.memUsage;
            this._size = Math.ceil(info.size / 4) * 4;
            this._stride = Math.max(info.stride || this._size, 1);
            this._count = this._size / this._stride;
            this._flags = info.flags;

            if (this._usage & BufferUsageBit.INDIRECT) {
                this._indirectBuffer = new IndirectBuffer();
            }

            this._gpuBuffer = {
                usage: this._usage,
                memUsage: this._memUsage,
                size: this._size,
                stride: this._stride,
                buffer: null,
                indirects: [],
                glTarget: 0,
                glBuffer: null,
                glOffset: 0,
                drawIndirectByIndex: false,
            };

            if (info.usage & BufferUsageBit.INDIRECT) {
                this._gpuBuffer.indirects = this._indirectBuffer!.drawInfos;
            }

            WebGPUCmdFuncCreateBuffer(this._device as WebGPUDevice, this._gpuBuffer);

            this._device.memoryStatus.bufferSize += this._size;
        }

        return true;
    }

    public destroy() {
        if (this._gpuBuffer) {
            if (!this._isBufferView) {
                WebGPUCmdFuncDestroyBuffer(this._device as WebGPUDevice, this._gpuBuffer);
                this._device.memoryStatus.bufferSize -= this._size;
            }
            this._gpuBuffer = null;
        }
    }

    public resize(size: number) {
        if (this._isBufferView) {
            console.warn('cannot resize buffer views!');
            return;
        }

        const oldSize = this._size;
        if (oldSize === size) { return; }

        this._size = Math.ceil(size / 4) * 4;
        this._count = this._size / this._stride;

        if (this._gpuBuffer) {
            this._gpuBuffer.size = this._size;
            if (this._size > 0) {
                WebGPUCmdFuncResizeBuffer(this._device as WebGPUDevice, this._gpuBuffer);
                this._device.memoryStatus.bufferSize -= oldSize;
                this._device.memoryStatus.bufferSize += this._size;
            }
        }
    }

    public update(buffer: BufferSource, offset?: number, size?: number) {
        if (this._isBufferView) {
            console.warn('cannot update through buffer views!');
            return;
        }

        let buffSize: number;
        if (size !== undefined) {
            buffSize = size;
        } else if (this._usage & BufferUsageBit.INDIRECT) {
            buffSize = 0;
        } else {
            buffSize = (buffer as ArrayBuffer).byteLength;
        }

        WebGPUCmdFuncUpdateBuffer(
            this._device as WebGPUDevice,
            this._gpuBuffer!,
            buffer,
            offset || 0,
            buffSize,
        );
    }
}
