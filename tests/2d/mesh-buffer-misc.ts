import { MeshBuffer } from "../../cocos/2d/renderer/mesh-buffer";
import { RecyclePool } from "../../cocos/core";
import { Attribute } from "../../cocos/core/gfx/base/define";
import * as VertexFormat from '../../cocos/2d/renderer/vertex-format';


export class Batcher2DTest {

    public _bufferBatchPool: RecyclePool<MeshBuffer> = new RecyclePool(() => new MeshBuffer(null), 1);

    public _meshBuffers: Map<number, MeshBuffer[]> = new Map();
    public _meshBufferUseCount: Map<number, number> = new Map();

    public _currMeshBuffer: MeshBuffer | null = null;

    public _customMeshBuffers: Map<number, MeshBuffer[]> = new Map();

    _createMeshBuffer (attributes: Attribute[]) {
        const batch = this._bufferBatchPool.add() as MeshBuffer;
        batch.initialize(attributes, this._requireBufferBatch.bind(this,attributes));
        const strideBytes = VertexFormat.getAttributeStride(attributes);
        let buffers = this._meshBuffers.get(strideBytes);
        if (!buffers) { buffers = []; this._meshBuffers.set(strideBytes, buffers); }
        buffers.push(batch);
        return batch;
    }

    _requireBufferBatch (attributes: Attribute[], vertexCount?: number, indexCount?: number) {
        const strideBytes = VertexFormat.getAttributeStride(attributes);
        let buffers = this._meshBuffers.get(strideBytes);
        if (!buffers) { buffers = []; this._meshBuffers.set(strideBytes, buffers); }
        const meshBufferUseCount = this._meshBufferUseCount.get(strideBytes) || 0;
    
        this._currMeshBuffer = buffers[meshBufferUseCount];
        if (!this._currMeshBuffer) {
            this._currMeshBuffer = this._createMeshBuffer(attributes);
        }
        this._meshBufferUseCount.set(strideBytes, meshBufferUseCount);
        if (vertexCount && indexCount) {
            this._meshBufferUseCount.set(strideBytes, meshBufferUseCount + 1);
            this._currMeshBuffer.request(vertexCount, indexCount);
        }
    }

    acquireBufferBatch (attributes: Attribute[] = VertexFormat.vfmtPosUvColor) {
        const strideBytes = attributes === VertexFormat.vfmtPosUvColor ? 36 /* 9x4 */ : VertexFormat.getAttributeStride(attributes);
        if (!this._currMeshBuffer || (this._currMeshBuffer.vertexFormatBytes) !== strideBytes) {
            this._requireBufferBatch(attributes);
            return this._currMeshBuffer;
        }
        return this._currMeshBuffer;
    }

    registerCustomBuffer (attributes: MeshBuffer | Attribute[], callback: ((...args: number[]) => void) | null) {
        let batch: MeshBuffer;
        if (attributes instanceof MeshBuffer) {
            batch = attributes;
        } else {
            batch = this._bufferBatchPool.add();
            batch.initialize(attributes, callback || this._requireBufferBatch.bind(this, attributes));
        }
        const strideBytes = batch.vertexFormatBytes;
        let buffers = this._customMeshBuffers.get(strideBytes);
        if (!buffers) { buffers = []; this._customMeshBuffers.set(strideBytes, buffers); }
        buffers.push(batch);
        return batch;
    }

    unRegisterCustomBuffer (buffer: MeshBuffer) {
        const buffers = this._customMeshBuffers.get(buffer.vertexFormatBytes);
        if (buffers) {
            for (let i = 0; i < buffers.length; i++) {
                if (buffers[i] === buffer) {
                    buffers.splice(i, 1);
                    break;
                }
            }
        }
        
        // release the buffer to recycle pool --
        const idx = this._bufferBatchPool.data.indexOf(buffer);
        if (idx !== -1) {
            buffer.reset();
            this._bufferBatchPool.removeAt(idx);
        }
        // ---
    }
}

