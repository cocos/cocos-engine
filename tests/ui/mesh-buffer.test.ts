import { MeshBuffer } from '../../cocos/2d/renderer/mesh-buffer';
import { vfmtPosUvColor } from '../../cocos/2d/renderer/vertex-format';
import { director, macro } from '../../cocos/core';

const meshBuffer = new MeshBuffer();
meshBuffer.initialize(director.root.device, vfmtPosUvColor);

test('basic', () => {
    expect(meshBuffer.vertexOffset).toBe(0);
    expect(meshBuffer.byteOffset).toBe(0);
    expect(meshBuffer.indexOffset).toBe(0);
    expect(meshBuffer.attributes).toBe(vfmtPosUvColor);
    // TODO. initialized vData.length should be 256 * 9
    const vDataCount = macro.BATCHER2D_MEM_INCREMENT * 1024 / Float32Array.BYTES_PER_ELEMENT;
    const iDataCount = vDataCount * MeshBuffer.IB_SCALE;
    expect(meshBuffer.vData.length).toBe(vDataCount);
    expect(meshBuffer.iData.length).toBe(iDataCount);

    meshBuffer.byteOffset = Float32Array.BYTES_PER_ELEMENT * 36;
    meshBuffer.vertexOffset = 4;
    meshBuffer.indexOffset = 6;
    meshBuffer.setDirty();
    // @ts-expect-error
    expect(meshBuffer._dirty).toBe(true);
    meshBuffer.uploadBuffers();
    // @ts-expect-error
    expect(meshBuffer._dirty).toBe(false);

    // Reset do not affect offsets
    meshBuffer.reset();
    expect(meshBuffer.vertexOffset).toBe(4);
    expect(meshBuffer.byteOffset).toBe(Float32Array.BYTES_PER_ELEMENT * 36);
    expect(meshBuffer.indexOffset).toBe(6);
});

// test('shrink', () => {
//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
//     expect(meshBuffer.iData.length).toBe(256 * 6);
//     meshBuffer.request(2000, 1000);

//     // alloc double buffer
//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
//     expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

//     // can not shrink when mesh buffer is dirty
//     meshBuffer.tryShrink();

//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
//     expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

//     meshBuffer.uploadBuffers();

//     // can not shrink when mesh buffer is full
//     meshBuffer.tryShrink();

//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
//     expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

//     meshBuffer.reset();
//     meshBuffer.request(6, 4);
//     meshBuffer.uploadBuffers();

//     // shrink success, realloc buffer as size / 2
//     meshBuffer.tryShrink();

//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
//     expect(meshBuffer.iData.length).toBe(256 * 6);

//     // can not shrink any more
//     meshBuffer.tryShrink();
//     meshBuffer.tryShrink();

//     expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
//     expect(meshBuffer.iData.length).toBe(256 * 6);

// });