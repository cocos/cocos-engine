
const vec3 = cc.vmath.vec3;
let vec3_temp = vec3.create();

function fillVertices (node, buffer, renderData, color) {
    let verts = renderData.vertices,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let matrix = node._worldMatrix;
    let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
        tx = matrix.m12, ty = matrix.m13;
    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
        vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }
}

function fillMeshVertices (node, buffer, renderData, color) {
    let data = renderData._data,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount,
        indiceOffset = buffer.indiceOffset,
        vertexId = buffer.vertexOffset;
    
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData,
        ibuf = buffer._iData;

    let matrix = node._worldMatrix;
    let a = matrix.m00, b = matrix.m01, c = matrix.m04, d = matrix.m05,
        tx = matrix.m12, ty = matrix.m13;
    for (let i = 0; i < vertexCount; i++) {
        let vert = data[i];
        vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
        vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }

    // fill indice data
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        let start = vertexId + i * 4;
        ibuf[indiceOffset++] = start;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 2;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 3;
        ibuf[indiceOffset++] = start + 2;
    }
}

function fillVertices3D (node, buffer, renderData, color) {
    let verts = renderData.vertices,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let matrix = node._worldMatrix;

    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vec3.set(vec3_temp, vert.x, vert.y, 0);
        vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }
}

function fillMeshVertices3D (node, buffer, renderData, color) {
    let data = renderData._data,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount,
        indiceOffset = buffer.indiceOffset,
        vertexId = buffer.vertexOffset;
    
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData,
        ibuf = buffer._iData;

    let matrix = node._worldMatrix;

    for (let i = 0; i < vertexCount; i++) {
        let vert = data[i];
        vec3.set(vec3_temp, vert.x, vert.y, 0);
        vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }

    // fill indice data
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        let start = vertexId + i * 4;
        ibuf[indiceOffset++] = start;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 2;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 3;
        ibuf[indiceOffset++] = start + 2;
    }
}

function fillVerticesWithoutCalc (node, buffer, renderData, color) {
    let verts = renderData.vertices,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }
}

function fillVerticesWithoutCalc3D (node, buffer, renderData, color) {
    let verts = renderData.vertices,
        vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }
}

module.exports = {
    fillVertices: fillVertices,
    fillMeshVertices: fillMeshVertices,
    fillVertices3D: fillVertices3D,
    fillMeshVertices3D: fillMeshVertices3D,
    fillVerticesWithoutCalc: fillVerticesWithoutCalc,
    fillVerticesWithoutCalc3D: fillVerticesWithoutCalc3D
};
