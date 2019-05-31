
export default {
    floatsPerVert: 5,

    verticesCount: 4,
    verticesFloats: 4 * 5,
    indicesCount: 6,

    uvOffset: 2,
    colorOffset: 4,

    updateColor (sprite) {
        let uintVerts = sprite._renderHandle.uintVDatas[0];
        if (!uintVerts) return;
        let color = sprite.node.color._val;
        let floatsPerVert = this.floatsPerVert;
        let colorOffset = this.colorOffset;
        for (let i = colorOffset, l = uintVerts.length; i < l; i += floatsPerVert) {
            uintVerts[i] = color;
        }
    },

    getBuffer (renderer) {
        return renderer._meshBuffer;
    },

    fillBuffers (sprite, renderer) {
        if (renderer.worldMatDirty) {
            this.updateWorldVerts(sprite);
        }

        let renderHandle = sprite._renderHandle;
        let vData = renderHandle.vDatas[0];
        let iData = renderHandle.iDatas[0];
        let verticesCount = vData.length / this.floatsPerVert;

        let buffer = this.getBuffer(renderer);
        let offsetInfo = buffer.request(verticesCount, iData.length);

        // buffer data may be realloc, need get reference after request.

        // fill vertices
        let vertexOffset = offsetInfo.byteOffset >> 2,
            vbuf = buffer._vData;

        vbuf.set(vData, vertexOffset);

        // fill indices
        let ibuf = buffer._iData,
            indiceOffset = offsetInfo.indiceOffset,
            vertexId = offsetInfo.vertexOffset;
        for (let i = 0, l = iData.length; i < l; i++) {
            ibuf[indiceOffset++] = vertexId + iData[i];
        }
    },
};
