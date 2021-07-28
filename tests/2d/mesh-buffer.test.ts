
import { Batcher2DTest } from "./mesh-buffer-misc";
import * as VertexFormat from '../../cocos/2d/renderer/vertex-format';
import { Attribute } from "../../cocos/core/gfx/base/define";

// 几个条件几个创建过程
// 针对 RecyclePool 的创建和回收
// 现在完全没回收

// 针对池子的上限操作（数量多于预设之后的添加）

// 针对 acquireBufferBatch 进行的取 buffer 操作
// 包括 空的时候的初始化
// attributes 不同时的切换
// _requireBufferBatch 中的几种边界条件
// 包括单个 buffer 的扩容操作
// 包括无法再扩容之后的新建操作（及其判断使用）

// 还有几个边界的条件
// 池子在循环之后的重复使用问题（因为实际上并没有进行销毁）
// meshBuffer 的释放检查（目前引擎没有此种设计）

// 这样，用一个 pool 模拟这个行为，来测试整套逻辑
// 包括边界条件和扩容和取用等

interface renderData {
    vertexCount: number;
    indicesCount: number;
}

// 需要一个不同 VB IB 的数组
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
        buffer.request(vertexCount, indicesCount);
        dataType++;
        compNum++;
    }
    buffersLength = batcher._meshBuffers.get(VertexFormat.getAttributeStride(attributesTemp[1])).length;
    expect(buffersLength).toBe(2); // ??? 应该是几?
    // 扩容完毕，然后清空

    for (const size of batcher._meshBuffers.keys()) {
        const buffers = batcher._meshBuffers.get(size);
        if (buffers) {
            buffers.forEach((buffer) => buffer.destroy());
        }
    }

    batcher._meshBuffers.clear();
    batcher._meshBufferUseCount.clear();
    batcher._currMeshBuffer = null;
});

test('MeshBuffer Create diff', function () {
    const buffer = batcher._createMeshBuffer(attributesTemp[0]);
    batcher._currMeshBuffer = buffer;

    // _bufferBatchPool check
    // cause not clean
    expect(batcher._bufferBatchPool.length).toBe(4);

    // _buffer check
    let buffersLength = batcher._meshBuffers.get(VertexFormat.getAttributeStride(attributesTemp[0])).length;
    expect(buffersLength).toBe(1);

    const initVDataCount = 256 * VertexFormat.getComponentPerVertex(attributesTemp[0]) * Float32Array.BYTES_PER_ELEMENT;
    // @ts-expect-error for Test
    expect(buffer._initVDataCount).toBe(initVDataCount);

    // buffer add
    // diff attributes
    let compNum = 0;
    let dataType = 0;
    let vertexCount = 4;
    let indicesCount = 6;

    while(compNum < attributesTemp.length * 2) {
        if (dataType >= renderDataTemp.length) {
            dataType = 0;
        }
        vertexCount = renderDataTemp[dataType].vertexCount;
        indicesCount = renderDataTemp[dataType].indicesCount;
        let buffer = batcher.acquireBufferBatch(attributesTemp[compNum]);
        buffer.request(vertexCount, indicesCount);
        dataType++;
        compNum++;
    }
    const mapSize = batcher._meshBuffers.size;
    expect(mapSize).toBe(4);
    expect(batcher._bufferBatchPool.length).toBe(8);

    for (const size of batcher._meshBuffers.keys()) {
        const buffers = batcher._meshBuffers.get(size);
        if (buffers) {
            buffers.forEach((buffer) => buffer.destroy());
        }
    }

    batcher._meshBuffers.clear();
    batcher._meshBufferUseCount.clear();
    batcher._currMeshBuffer = null;
});

// 差一个重复利用 POOL 里数据的测试，也就是用户使用到的那种，也就是不 destroy 只放置回去的情况

