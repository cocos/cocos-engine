import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { WebGLBuffer } from './webgl-buffer';
import { WebGLCmdFuncCreateInputAssember, WebGLCmdFuncDestroyInputAssembler } from './webgl-commands';
import { WebGLDevice } from './webgl-device';
import { IWebGLGPUInputAssembler, IWebGLGPUBuffer } from './webgl-gpu-objects';
import { GFXStatus } from '../define';

export class WebGLInputAssembler extends GFXInputAssembler {

    get gpuInputAssembler (): IWebGLGPUInputAssembler {
        return  this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: IWebGLGPUInputAssembler | null = null;

    public initialize (info: IGFXInputAssemblerInfo): boolean {

        if (info.vertexBuffers.length === 0) {
            console.error('GFXInputAssemblerInfo.vertexBuffers is null.');
            return false;
        }

        this._attributes = info.attributes;
        this._attributesHash = this.computeAttributesHash();
        this._vertexBuffers = info.vertexBuffers;

        if (info.indexBuffer !== undefined) {
            this._indexBuffer = info.indexBuffer;
            this._indexCount = this._indexBuffer.size / this._indexBuffer.stride;
        } else {
            const vertBuff = this._vertexBuffers[0];
            this._vertexCount = vertBuff.size / vertBuff.stride;
        }

        this._indirectBuffer = info.indirectBuffer || null;

        const gpuVertexBuffers: IWebGLGPUBuffer[] = new Array<IWebGLGPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGLBuffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: IWebGLGPUBuffer | null = null;
        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGLBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = 0x1401; break; // WebGLRenderingContext.UNSIGNED_BYTE
                    case 2: glIndexType = 0x1403; break; // WebGLRenderingContext.UNSIGNED_SHORT
                    case 4: glIndexType = 0x1405; break; // WebGLRenderingContext.UNSIGNED_INT
                    default: {
                        console.error('Error index buffer stride.');
                    }
                }
            }
        }

        let gpuIndirectBuffer: IWebGLGPUBuffer | null = null;
        if (info.indirectBuffer !== undefined) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGLBuffer).gpuBuffer;
        }

        this._gpuInputAssembler = {
            attributes: info.attributes,
            gpuVertexBuffers,
            gpuIndexBuffer,
            gpuIndirectBuffer,

            glAttribs: [],
            glIndexType,
            glVAOs: new Map<WebGLProgram, WebGLVertexArrayObjectOES>(),
        };

        WebGLCmdFuncCreateInputAssember(this._device as WebGLDevice, this._gpuInputAssembler);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        const webglDev = this._device as WebGLDevice;
        if (this._gpuInputAssembler && webglDev.useVAO) {
            WebGLCmdFuncDestroyInputAssembler(webglDev, this._gpuInputAssembler);
        }
        this._gpuInputAssembler = null;
        this._status = GFXStatus.UNREADY;
    }
}
