import { GFXBufferInfo, GFXBuffer, GFXMemoryUsageBit, GFXBufferAccess, GFXBufferAccessBit, GFXBufferUsageBit } from '../gfx-buffer';
import { GFXDevice } from '../gfx-device';
import { WebGLGPUBuffer } from './webgl-gpu-objects';
import { WebGLGFXDevice } from './webgl-gfx-device';

export class WebGLGFXBuffer extends GFXBuffer {

    constructor(device : GFXDevice) {
        super(device);
    }

    public initialize(info : GFXBufferInfo) : boolean {

        this._usage = info.usage;
        this._memUsage = info.memUsage;
        this._size = info.size;
        this._stride = info.stride;

        if (this._memUsage & GFXMemoryUsageBit.HOST) {
            this._buffer = new ArrayBuffer(this._size);
        }

        this._isSimulate = (this._usage & GFXBufferUsageBit.TRANSFER_SRC) != GFXBufferUsageBit.NONE;

        if (!this._isSimulate) {
            this._gpuBuffer = this.webGLDevice.emitCmdCreateGPUBuffer(info);
        }

        return true;
    }

    public destroy() {
        if(this._gpuBuffer) {
            this.webGLDevice.emitCmdDestroyGPUBuffer(this._gpuBuffer);
            this._buffer = null;
        }
    }

    public update(buffer : ArrayBuffer, offset : number) {

        if(this._buffer) {
            let srcView : Uint8Array = new Uint8Array(buffer);
            let dstView : Uint8Array = new Uint8Array(this._buffer, offset);
            dstView.set(srcView);
        }

        if(!this._isSimulate) {
            this.webGLDevice.emitCmdUpdateGPUBuffer(<WebGLGPUBuffer>this._gpuBuffer, offset, <ArrayBuffer>this._buffer);
        }
    }

    public get webGLDevice() : WebGLGFXDevice {
        return <WebGLGFXDevice>this._device;
    }

    public get gpuBuffer() : WebGLGPUBuffer | null  {
        return this._gpuBuffer;
    }

    private  _gpuBuffer : WebGLGPUBuffer | null = null;
    private _isSimulate : boolean = false;
};
