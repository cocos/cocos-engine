import { GFXInputAssembler, GFXInputAssemblerInfo } from '../input-assembler';
import { WebGPUBuffer } from './WebGPU-buffer';
import { WebGPUCmdFuncCreateInputAssember, WebGPUCmdFuncDestroyInputAssembler } from './WebGPU-commands';
import { WebGPUDevice } from './WebGPU-device';
import { IWebGPUGPUInputAssembler, IWebGPUGPUBuffer } from './WebGPU-gpu-objects';

export class WebGPUInputAssembler extends GFXInputAssembler {

    public get gpuInputAssembler (): IWebGPUGPUInputAssembler {
        return  this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: IWebGPUGPUInputAssembler | null = null;

    public initialize (info: GFXInputAssemblerInfo): boolean {

        if (info.vertexBuffers.length === 0) {
            console.error('GFXInputAssemblerInfo.vertexBuffers is null.');
            return false;
        }

        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer) {
            this._indexBuffer = info.indexBuffer;
            this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
            this._firstIndex = 0;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._vertexCount = vertBuff.size / vertBuff.stride;
            this._firstVertex = 0;
            this._vertexOffset = 0;
        }
        this._instanceCount = 0;
        this._firstInstance = 0;

        this._indirectBuffer = info.indirectBuffer || null;

        const gpuVertexBuffers: IWebGPUGPUBuffer[] = new Array<IWebGPUGPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGPUBuffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: IWebGPUGPUBuffer | null = null;
        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGPUBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = 0x1401; break; // WebGLRenderingContext.UNSIGNED_BYTE
                    case 2: glIndexType = 0x1403; break; // WebGLRenderingContext.UNSIGNED_SHORT
                    case 4: glIndexType = 0x1405; break; // WebGLRenderingContext.UNSIGNED_INT
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
            glVAOs: new Map<WebGLProgram, WebGLVertexArrayObject>(),
        };

        WebGPUCmdFuncCreateInputAssember(this._device as WebGPUDevice, this._gpuInputAssembler);

        return true;
    }

    public destroy () {
        const WebGPUDev = this._device as WebGPUDevice;
        if (this._gpuInputAssembler && WebGPUDev.useVAO) {
            WebGPUCmdFuncDestroyInputAssembler(WebGPUDev, this._gpuInputAssembler);
        }
        this._gpuInputAssembler = null;
    }
}
