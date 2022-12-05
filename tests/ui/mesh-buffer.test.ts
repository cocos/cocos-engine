import { MeshBuffer } from '../../cocos/2d/renderer/mesh-buffer';
import { vfmtPosUvColor } from '../../cocos/2d/renderer/vertex-format';
import { deviceManager } from '../../cocos/gfx';

const meshBuffer = new MeshBuffer();
meshBuffer.initialize(deviceManager.gfxDevice, vfmtPosUvColor, 1024, 2048);

test('basic', () => {
    expect(meshBuffer.vertexOffset).toBe(0);
    expect(meshBuffer.byteOffset).toBe(0);
    expect(meshBuffer.indexOffset).toBe(0);
    expect(meshBuffer.attributes).toBe(vfmtPosUvColor);
    // TODO. initialized vData.length should be 256 * 9
    expect(meshBuffer.vData.length).toBe(1024);
    expect(meshBuffer.iData.length).toBe(2048);

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

    // test checkCapacity
    expect(meshBuffer.checkCapacity(110, 0)).toBe(false);
    expect(meshBuffer.checkCapacity(0, 2048)).toBe(false);
    expect(meshBuffer.checkCapacity(109, 0)).toBe(true);
    expect(meshBuffer.checkCapacity(0, 2042)).toBe(true);

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