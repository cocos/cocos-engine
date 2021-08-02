
import { Batcher2DTest } from "./mesh-buffer-misc";
import * as VertexFormat from '../../cocos/2d/renderer/vertex-format';
import { Attribute } from "../../cocos/core/gfx/base/define";

interface renderData {
    vertexCount: number;
    indicesCount: number;
}

const renderDataTemp: renderData[] = [
    {vertexCount: 4, indicesCount: 6}, //simple 
    {vertexCount: 16, indicesCount: 54}, // sliced
    {vertexCount: 4, indicesCount: 6}, // tiled row * col * 4;row * col * 6;
    {vertexCount: 12, indicesCount: 18}, // spine(unknown)
    {vertexCount: 26, indicesCount: 33}, // DB(unknown)
    {vertexCount: 55, indicesCount: 120}, // tiledMap(unknown)
]

const attributesTemp: Attribute[][] = [
    VertexFormat.vfmt,
    VertexFormat.vfmtPosColor,
    VertexFormat.vfmtPosUvColor,
    VertexFormat.vfmtPosUvTwoColor,
]

const batcher = new Batcher2DTest();

test('MeshBuffer Create Same', function () {
    const buffer = batcher._createMeshBuffer(attributesTemp[1]);
    batcher._currMeshBuffer = buffer;

    // _bufferBatchPool check
    expect(batcher._bufferBatchPool.length).toBe(1);

    // _buffer check
    let buffersLength = batcher._meshBuffers.get(VertexFormat.getAttributeStride(attributesTemp[1])).length;
    expect(buffersLength).toBe(1);

    const initVDataCount = 256 * VertexFormat.getComponentPerVertex(attributesTemp[1]) * Float32Array.BYTES_PER_ELEMENT;
    // @ts-expect-error for Test
    expect(buffer._initVDataCount).toBe(initVDataCount);

    // buffer add
    // same attributes
    let compNum = 0;
    let dataType = 0;
    let vertexCount = 4;
    let indicesCount = 6;

    while(compNum < 10000) {
        if (dataType >= renderDataTemp.length) {
            dataType = 0;
        }
        vertexCount = renderDataTemp[dataType].vertexCount;
        indicesCount = renderDataTemp[dataType].indicesCount;
        batcher._currMeshBuffer.request(vertexCount, indicesCount);
        dataType++;
        compNum++;
    }
    buffersLength = batcher._meshBuffers.get(VertexFormat.getAttributeStride(attributesTemp[1])).length;
    expect(buffersLength).toBe(3);

    for (const size of batcher._meshBuffers.keys()) {
        const buffers = batcher._meshBuffers.get(size);
        if (buffers) {
            buffers.forEach((buffer) => {
                buffer.reset();
                buffer.destroy();
            });
        }
    }

    batcher._meshBuffers.clear();
    batcher._meshBufferUseCount.clear();
    batcher._currMeshBuffer = null;
});

test('MeshBuffer Create diff', function () {
    // _bufferBatchPool check
    // cause not clean
    expect(batcher._bufferBatchPool.length).toBe(3);

    // buffer add
    // diff attributes
    let compNum = 0;
    let dataType = 0;
    let vertexCount = 4;
    let indicesCount = 6;
    let attributes = attributesTemp[0];
    let attributesNum = 0;
    const tempLength = attributesTemp.length;

    while(compNum < tempLength * 2) {
        if (dataType >= renderDataTemp.length) {
            dataType = 0;
        }
        
        attributesNum = compNum % tempLength;
        attributes = attributesTemp[attributesNum];
        vertexCount = renderDataTemp[dataType].vertexCount;
        indicesCount = renderDataTemp[dataType].indicesCount;
        let buffer = batcher.acquireBufferBatch(attributes);
        buffer.request(vertexCount, indicesCount);
        dataType++;
        compNum++;
    }
    const mapSize = batcher._meshBuffers.size;
    expect(mapSize).toBe(tempLength);
    expect(batcher._bufferBatchPool.length).toBe(3 + tempLength);

    let buffersLength = 0;
    for (let i = 0; i < attributesTemp.length; i++) {
        buffersLength = batcher._meshBuffers.get(VertexFormat.getAttributeStride(attributesTemp[i])).length;
        expect(buffersLength).toBe(1);
    }

    for (const size of batcher._meshBuffers.keys()) {
        const buffers = batcher._meshBuffers.get(size);
        if (buffers) {
            buffers.forEach((buffer) => {
                buffer.reset();
                buffer.destroy();
            });
        }
    }

    batcher._meshBuffers.clear();
    batcher._meshBufferUseCount.clear();
    batcher._currMeshBuffer = null;
});

test('CustomBuffer', function () {
    // _bufferBatchPool check
    // cause not clean
    batcher._bufferBatchPool.reset();
    expect(batcher._bufferBatchPool.length).toBe(0);

    // buffer add
    // diff attributes
    let bufferNum = 0;
    let compNum = 0;
    let dataType = 0;
    let vertexCount = 4;
    let indicesCount = 6;
    let attributes = attributesTemp[0];
    let attributesNum = 0;
    const tempLength = attributesTemp.length;

    while(bufferNum < tempLength * 6) {
        attributesNum = bufferNum % tempLength;
        attributes = attributesTemp[attributesNum];
        let buffer = batcher.registerCustomBuffer(attributes, null);
        bufferNum++;
        compNum = 0;
        while(compNum < 100) {
            if (dataType >= renderDataTemp.length) {
                dataType = 0;
            }
            vertexCount = renderDataTemp[dataType].vertexCount;
            indicesCount = renderDataTemp[dataType].indicesCount;
            buffer.request(vertexCount, indicesCount);
            dataType++;
            compNum++;
        }
    }
    expect(batcher._bufferBatchPool.length).toBe(bufferNum);
    expect(batcher._customMeshBuffers.size).toBe(tempLength);

    for (const size of batcher._customMeshBuffers.keys()) {
        const buffers = batcher._customMeshBuffers.get(size);
        if (buffers) {
            for (let i = buffers.length - 1; i >= 0; i--) {
                batcher.unRegisterCustomBuffer(buffers[i]);
            }
        }
    }
    batcher._customMeshBuffers.clear();

    expect(batcher._customMeshBuffers.size).toBe(0);

    // RecyclePool leak
    expect(batcher._bufferBatchPool.length).toBe(0);

    bufferNum = 0;
    while(bufferNum < tempLength * 6) {
        attributesNum = bufferNum % tempLength;
        attributes = attributesTemp[attributesNum];
        // 问题在于回收之后，池子中的对象已经是使用过后的了
        // 数据 _initIDataCount _initVDataCount iData vData 没有清空
        // 所以在重新申请使用时，this._reallocBuffer() 没有必要
        // 或者是清空 _initIDataCount _initVDataCount
        let buffer = batcher.registerCustomBuffer(attributes, null);
        bufferNum++;
        compNum = 0;
        while(compNum < 1) {
            if (dataType >= renderDataTemp.length) {
                dataType = 0;
            }
            vertexCount = renderDataTemp[dataType].vertexCount;
            indicesCount = renderDataTemp[dataType].indicesCount;
            buffer.request(vertexCount, indicesCount);
            dataType++;
            compNum++;
        }
        // RecyclePool use again
        // if reset _initIDataCount & _initVDataCount in reset()
        // // @ts-expect-error
        // expect(buffer._initIDataCount).toBe(256 * 6);
        // @ts-expect-error
        expect(buffer._initVDataCount).toBe(256 * buffer._vertexFormatBytes);
    }

    // RecyclePool leak
    expect(batcher._bufferBatchPool.length).toBe(bufferNum);

    for (const size of batcher._meshBuffers.keys()) {
        const buffers = batcher._meshBuffers.get(size);
        if (buffers) {
            buffers.forEach((buffer) => {
                buffer.reset();
                buffer.destroy();
            });
        }
    }

    batcher._meshBuffers.clear();
    batcher._meshBufferUseCount.clear();
    batcher._currMeshBuffer = null;
});
