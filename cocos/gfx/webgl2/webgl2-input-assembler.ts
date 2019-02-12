import { GFXStatus } from '../define';
import { GFXDevice } from '../device';
import { GFXInputAssembler, IGFXInputAssemblerInfo } from '../input-assembler';
import { WebGL2GFXBuffer } from './webgl2-buffer';
import { WebGL2CmdDraw, WebGL2CmdFuncCreateInputAssember } from './webgl2-commands';
import { WebGL2GFXDevice } from './webgl2-device';
import { WebGL2GPUBuffer, WebGL2GPUInputAssembler } from './webgl2-gpu-objects';

export class WebGL2GFXInputAssembler extends GFXInputAssembler {

    public get gpuInputAssembler (): WebGL2GPUInputAssembler {
        return  this._gpuInputAssembler!;
    }

    private _gpuInputAssembler: WebGL2GPUInputAssembler | null = null;

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

        this._indirectBuffer = info.indirectBuffer || null;

        const gpuVertexBuffers: WebGL2GPUBuffer[] = new Array<WebGL2GPUBuffer>(info.vertexBuffers.length);
        for (let i = 0; i < info.vertexBuffers.length; ++i) {
            const vb = info.vertexBuffers[i] as WebGL2GFXBuffer;
            if (vb.gpuBuffer) {
                gpuVertexBuffers[i] = vb.gpuBuffer;
            }
        }

        let gpuIndexBuffer: WebGL2GPUBuffer | null = null;
        let glIndexType = 0;
        if (info.indexBuffer) {
            gpuIndexBuffer = (info.indexBuffer as WebGL2GFXBuffer).gpuBuffer;
            if (gpuIndexBuffer) {
                switch (gpuIndexBuffer.stride) {
                    case 1: glIndexType = WebGLRenderingContext.UNSIGNED_BYTE; break;
                    case 2: glIndexType = WebGLRenderingContext.UNSIGNED_SHORT; break;
                    case 4: glIndexType = WebGLRenderingContext.UNSIGNED_INT; break;
                    default: {
                        console.error('Error index buffer stride.');
                    }
                }
            }
        }

        let gpuIndirectBuffer: WebGL2GPUBuffer | null = null;
        if (info.indirectBuffer !== undefined) {
            gpuIndirectBuffer = (info.indirectBuffer as WebGL2GFXBuffer).gpuBuffer;
        }

        this._gpuInputAssembler = {
            attributes: info.attributes,
            gpuVertexBuffers,
            gpuIndexBuffer,
            gpuIndirectBuffer,

            glAttribs: [],
            glIndexType,
            glVAO: 0,
        };

        WebGL2CmdFuncCreateInputAssember(this._device as WebGL2GFXDevice, this._gpuInputAssembler);

        this._status = GFXStatus.SUCCESS;

        return true;
    }

    public destroy () {
        this._gpuInputAssembler = null;
        this._status = GFXStatus.UNREADY;
    }

    public extractCmdDraw (cmd: WebGL2CmdDraw) {
        cmd.drawInfo.vertexCount = this._vertexCount;
        cmd.drawInfo.firstVertex = this._firstVertex;
        cmd.drawInfo.indexCount = this._indexCount;
        cmd.drawInfo.firstIndex = this._firstIndex;
        cmd.drawInfo.vertexOffset = this._vertexOffset;
        cmd.drawInfo.instanceCount = this._instanceCount;
        cmd.drawInfo.firstInstance = this._firstInstance;
    }
}
