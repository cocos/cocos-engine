import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { WebGLGFXBuffer } from './webgl-buffer';
import { WebGLCmdDraw } from './webgl-commands';
import { WebGLGFXDevice } from './webgl-device';
import { WebGLGPUInputAssembler } from './webgl-gpu-objects';

export class WebGLGFXInputAssembler extends GFXInputAssembler {

    public get webGLDevice (): WebGLGFXDevice {
        return  this._device as WebGLGFXDevice;
    }

    public get gpuInputAssembler (): WebGLGPUInputAssembler {
        return  this._gpuInputAssembler as WebGLGPUInputAssembler;
    }

    private _gpuInputAssembler: WebGLGPUInputAssembler | null = null;

    constructor (device: GFXDevice) {
        super(device);
    }

    public initialize (info: IGFXInputAssemblerInfo): boolean {

        if (info.vertexBuffers.length === 0) {
            console.error('GFXInputAssemblerInfo.vertexBuffers is null.');
            return false;
        }

        this._attributes = info.attributes;
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer !== undefined) {
            this._indexBuffer = info.indexBuffer;
            this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._vertexCount = vertBuff.size / vertBuff.stride;
        }

        this._gpuInputAssembler = this.webGLDevice.emitCmdCreateGPUInputAssembler(info);
        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        if (this._gpuInputAssembler) {
            this.webGLDevice.emitCmdDestroyGPUInputAssembler(this._gpuInputAssembler);
            this._gpuInputAssembler = null;
        }
        this._status = GFXStatus.UNREADY;
    }

    public extractCmdDraw (cmd: WebGLCmdDraw) {
        if (!this._indirectBuffer) {
            cmd.drawInfo.vertexCount = this._vertexCount;
            cmd.drawInfo.firstVertex = this._firstVertex;
            cmd.drawInfo.indexCount = this._indexCount;
            cmd.drawInfo.firstIndex = this._firstIndex;
            cmd.drawInfo.vertexOffset = this._vertexOffset;
            cmd.drawInfo.instanceCount = this._instanceCount;
            cmd.drawInfo.firstInstance = this._firstInstance;
            cmd.gpuIndirectBuffer = null;
        } else {
            cmd.gpuIndirectBuffer = (this._indirectBuffer as WebGLGFXBuffer).gpuBuffer;
        }
    }
}
