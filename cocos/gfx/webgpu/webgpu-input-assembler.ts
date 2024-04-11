import { InputAssembler } from '../base/input-assembler';
import { WebGPUBuffer } from './webgpu-buffer';
import { WebGPUCmdFuncCreateInputAssember, WebGPUCmdFuncDestroyInputAssembler } from './webgpu-commands';
import { WebGPUDevice } from './webgpu-device';
import { IWebGPUGPUInputAssembler, IWebGPUGPUBuffer } from './webgpu-gpu-objects';
import { InputAssemblerInfo } from '../base/define';
import { WebGPUDeviceManager } from './define';

export class WebGPUInputAssembler extends InputAssembler {
    public get gpuInputAssembler(): IWebGPUGPUInputAssembler {
        return this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: IWebGPUGPUInputAssembler | null = null;

    public initialize(info: Readonly<InputAssemblerInfo>): void {
        if (info.vertexBuffers.length === 0) {
            console.error('InputAssemblerInfo.vertexBuffers is null.');
            return;
        }

        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer) {
            this._indexBuffer = info.indexBuffer;
            this.drawInfo.indexCount = this._indexBuffer.size / this._indexBuffer.stride;
            this.drawInfo.firstIndex = 0;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this.drawInfo.vertexCount = vertBuff.size / vertBuff.stride;
            this.drawInfo.firstVertex = 0;
            this.drawInfo.vertexOffset = 0;
        }

        this._drawInfo.instanceCount = 0;
        this._drawInfo.firstInstance = 0;

        this._indirectBuffer = info.indirectBuffer || null;

        const gpuVertexBuffers: IWebGPUGPUBuffer[] = new Array<IWebGPUGPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGPUBuffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: IWebGPUGPUBuffer | null = null;
        let glIndexType: GPUIndexFormat = 'uint16';
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGPUBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    // case 1: glIndexType = 0x1401; break; // WebGLRenderingContext.UNSIGNED_BYTE
                    case 2: glIndexType = 'uint16'; break; // WebGLRenderingContext.UNSIGNED_SHORT
                    case 4: glIndexType = 'uint32'; break; // WebGLRenderingContext.UNSIGNED_INT
                    default: {
                        console.error('Illegal index buffer stride.');
                    }
                }
            }
        }

        let gpuIndirectBuffer: IWebGPUGPUBuffer | null = null;
        if (info.indirectBuffer) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGPUBuffer).gpuBuffer;
        }

        this._gpuInputAssembler = {
            attributes: info.attributes,
            gpuVertexBuffers,
            gpuIndexBuffer,
            gpuIndirectBuffer,

            glAttribs: [],
            glIndexType,
        };

        WebGPUCmdFuncCreateInputAssember(WebGPUDeviceManager.instance as WebGPUDevice, this._gpuInputAssembler);
    }

    public destroy() {
        const WebGPUDev = WebGPUDeviceManager.instance as WebGPUDevice;
        if (this._gpuInputAssembler) {
            WebGPUCmdFuncDestroyInputAssembler(WebGPUDev, this._gpuInputAssembler);
        }
        this._gpuInputAssembler = null;
    }
}
