import { GFXBuffer, GFXBufferSource, IGFXBufferInfo, IGFXIndirectBuffer } from '../buffer';
import { GFXBufferUsageBit, GFXMemoryUsageBit, GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';
import { WebGLCmdFuncCreateBuffer, WebGLCmdFuncDestroyBuffer, WebGLCmdFuncResizeBuffer, WebGLCmdFuncUpdateBuffer } from './webgl-commands';

export class WebGLGFXBuffer extends GFXBuffer {

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
        this._stride = Math.max(info.stride || 1, 1);
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
            stride: info.stride ? info.stride : 1,
            buffer: null,
            vf32: null,
            uniforms: [],
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

        WebGLCmdFuncCreateBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuBuffer) {
            WebGLCmdFuncDestroyBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
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
    
            WebGLCmdFuncResizeBuffer(this._device as WebGLGFXDevice, this._gpuBuffer);
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

        WebGLCmdFuncUpdateBuffer(
            this._device as WebGLGFXDevice, 
            this._gpuBuffer!, 
            buffer, 
            offset || 0, 
            buffSize);
    }
}
