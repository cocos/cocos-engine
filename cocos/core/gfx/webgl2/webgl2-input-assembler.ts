import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { WebGL2Buffer } from './webgl2-buffer';
import { WebGL2CmdFuncCreateInputAssember, WebGL2CmdFuncDestroyInputAssembler } from './webgl2-commands';
import { WebGL2Device } from './webgl2-device';
import { IWebGL2GPUInputAssembler, IWebGL2GPUBuffer } from './webgl2-gpu-objects';
import { GFXStatus } from '../define';

export class WebGL2InputAssembler extends GFXInputAssembler {

    public get gpuInputAssembler (): IWebGL2GPUInputAssembler {
        return  this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: IWebGL2GPUInputAssembler | null = null;

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

        const gpuVertexBuffers: IWebGL2GPUBuffer[] = new Array<IWebGL2GPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGL2Buffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: IWebGL2GPUBuffer | null = null;
        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGL2Buffer).gpuBuffer;
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

        let gpuIndirectBuffer: IWebGL2GPUBuffer | null = null;
        if (info.indirectBuffer !== undefined) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGL2Buffer).gpuBuffer;
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

        WebGL2CmdFuncCreateInputAssember(this._device as WebGL2Device, this._gpuInputAssembler);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        const webgl2Dev = this._device as WebGL2Device;
        if (this._gpuInputAssembler && webgl2Dev.useVAO) {
            WebGL2CmdFuncDestroyInputAssembler(webgl2Dev, this._gpuInputAssembler);
        }
        this._gpuInputAssembler = null;
        this._status = GFXStatus.UNREADY;
    }
}
