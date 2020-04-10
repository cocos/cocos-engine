import { GFXBuffer, GFXBufferSource, IGFXBufferInfo } from '../buffer';
import { GFXBufferUsageBit } from '../define';
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

    protected _initialize (info: IGFXBufferInfo): boolean {

        if ((this._usage & GFXBufferUsageBit.UNIFORM) && this._size > 0) {
            this._uniformBuffer = new Uint8Array(this._size);
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

        return true;
    }

    protected _destroy () {
        if (this._gpuBuffer) {
            WebGLCmdFuncDestroyBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
            this._device.memoryStatus.bufferSize -= this._size;
            this._gpuBuffer = null;
        }

        this._bufferView = null;
    }

    protected _resize (size: number) {
        if (this._uniformBuffer) {
            this._uniformBuffer = new Uint8Array(size);
        }

        if (this._gpuBuffer) {
            if (this._uniformBuffer) {
                this._gpuBuffer.buffer = this._uniformBuffer;
            } else if (this._bufferView) {
                this._gpuBuffer.buffer = this._bufferView;
            }

            this._gpuBuffer.size = size;
            if (size > 0) {
                WebGLCmdFuncResizeBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
            }
        }
    }

    public update (buffer: GFXBufferSource, offset?: number, size?: number) {

        let buffSize: number;
        if (size !== undefined) {
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
