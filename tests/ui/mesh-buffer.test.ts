import { MeshBuffer } from '../../cocos/2d/renderer/mesh-buffer';
import { vfmtPosUvColor } from '../../cocos/2d/renderer/vertex-format';
import { Batcher2D } from '../../cocos/2d/renderer/batcher-2d';
import { director } from '../../cocos/core';

const meshBuffer = new MeshBuffer(new Batcher2D(director.root));
meshBuffer.initialize(vfmtPosUvColor, null);

test('basic', () => {
    expect(meshBuffer.vertexOffset).toBe(0);
    expect(meshBuffer.byteOffset).toBe(0);
    expect(meshBuffer.indicesOffset).toBe(0);
    expect(meshBuffer.attributes).toBe(vfmtPosUvColor);
    // TODO. initialized vData.length should be 256 * 9
    expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
    expect(meshBuffer.iData.length).toBe(256 * 6);
    meshBuffer.request(4, 6);
    // @ts-expect-error
    expect(meshBuffer._dirty).toBe(true);
    expect(meshBuffer.vertexOffset).toBe(4);
    expect(meshBuffer.byteOffset).toBe(4 * 4 * 9); // 4 vertices * 9 attribute * 4 bytes
    expect(meshBuffer.indicesOffset).toBe(6);

    const ia = meshBuffer.recordBatch();
    // Inelegant interface
    meshBuffer.vertexStart = meshBuffer.vertexOffset;
    meshBuffer.indicesStart = meshBuffer.indicesOffset;
    meshBuffer.byteStart = meshBuffer.byteOffset;

    expect(ia.indexBuffer).toBe(meshBuffer.indexBuffer);
    expect(ia.indexCount).toBe(6);
    expect(ia.firstIndex).toBe(0);
    expect(ia.attributes).toBe(vfmtPosUvColor);

    meshBuffer.request(100, 200);
    // @ts-expect-error
    expect(meshBuffer._dirty).toBe(true);
    expect(meshBuffer.vertexOffset).toBe(4 + 100);
    expect(meshBuffer.byteOffset).toBe(104 * 4 * 9); // 104 vertices * 9 attribute * 4 bytes
    expect(meshBuffer.indicesOffset).toBe(206);

    const ia2 = meshBuffer.recordBatch();
    expect(ia2.indexBuffer).toBe(meshBuffer.indexBuffer);
    expect(ia2.indexCount).toBe(200);
    expect(ia2.firstIndex).toBe(6);

    meshBuffer.uploadBuffers();
    // @ts-expect-error
    expect(meshBuffer._dirty).toBe(false);

    meshBuffer.reset();
    expect(meshBuffer.vertexOffset).toBe(0);
    expect(meshBuffer.byteOffset).toBe(0);
    expect(meshBuffer.indicesOffset).toBe(0);
});

test('shrink', () => {
    expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
    expect(meshBuffer.iData.length).toBe(256 * 6);
    meshBuffer.request(2000, 1000);

    // alloc double buffer
    expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
    expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

    // can not shrink when mesh buffer is dirty
    meshBuffer.tryShrink();

    expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
    expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

    meshBuffer.uploadBuffers();

    // can not shrink when mesh buffer is full
    meshBuffer.tryShrink();

    expect(meshBuffer.vData.length).toBe(256 * 9 * 4 * 2);
    expect(meshBuffer.iData.length).toBe(256 * 6 * 2);

    meshBuffer.reset();
    meshBuffer.request(6, 4);
    meshBuffer.uploadBuffers();

    // shrink success, realloc buffer as size / 2
    meshBuffer.tryShrink();

    expect(meshBuffer.vData.length).toBe(256 * 9 * 4);
    expect(meshBuffer.iData.length).toBe(256 * 6);

});