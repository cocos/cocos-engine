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

    protected _initialize (info: IGFXBufferInfo): boolean {

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

        return true;
    }

    protected _destroy () {
        if (this._gpuBuffer) {
            WebGL2CmdFuncDestroyBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
            this._device.memoryStatus.bufferSize -= this._size;
            this._gpuBuffer = null;
        }

        this._bufferView = null;
    }

    protected _resize (size: number) {
        if (this._gpuBuffer) {
            if (this._bufferView) {
                this._gpuBuffer.buffer = this._bufferView;
            }

            this._gpuBuffer.size = size;
            if (size > 0) {
                WebGL2CmdFuncResizeBuffer(this._device as WebGL2GFXDevice, this._gpuBuffer);
            }
        }
    }

    public update (buffer: GFXBufferSource, offset?: number, size?: number) {

        let buffSize: number;
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
