import { MeshBuffer } from "../../cocos/2d/renderer/mesh-buffer";
import { RecyclePool } from "../../cocos/core";
import { Attribute } from "../../cocos/core/gfx/base/define";
import * as VertexFormat from '../../cocos/2d/renderer/vertex-format';


export class Batcher2DTest {

    public _bufferBatchPool: RecyclePool<MeshBuffer> = new RecyclePool(() => new MeshBuffer(null), 1);

    public _meshBuffers: Map<number, MeshBuffer[]> = new Map();
    public _meshBufferUseCount: Map<number, number> = new Map();

    public _currMeshBuffer: MeshBuffer | null = null;

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
        const meshBufferUseCount = this._meshBufferUseCount.get(strideBytes) || 0; // 这儿有问题 // 意义在哪？
    
        if (meshBufferUseCount >= buffers.length) {
            this._currMeshBuffer = this._createMeshBuffer(attributes);
        } else {
            this._currMeshBuffer = buffers[meshBufferUseCount];
        }
        this._meshBufferUseCount.set(strideBytes, meshBufferUseCount + 1);
        if (vertexCount && indexCount) {
            // 这儿应该走不到
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
}

