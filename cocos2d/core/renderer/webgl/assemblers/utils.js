
const vec3 = cc.vmath.vec3;
let vec3_temp = vec3.create();

function fillVertices (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let matrix = node._worldMatrix;
    let a = matrix.m[0], b = matrix.m[1], c = matrix.m[4], d = matrix.m[5],
        tx = matrix.m[12], ty = matrix.m[13];
    
    let verts = renderData.vertices;
    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
        vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }
    return offsetInfo;
}

function fillMeshVertices (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let indiceOffset = offsetInfo.indiceOffset,
        vertexOffset = offsetInfo.byteOffset >> 2,
        vertexId = offsetInfo.vertexOffset,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData,
        ibuf = buffer._iData;

    let matrix = node._worldMatrix;
    let a = matrix.m[0], b = matrix.m[1], c = matrix.m[4], d = matrix.m[5],
        tx = matrix.m[12], ty = matrix.m[13];

    let verts = renderData.vertices;
    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
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

    return offsetInfo;
}

function fillVertices3D (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let matrix = node._worldMatrix;

    let verts = renderData.vertices;
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
    
    return offsetInfo;
}

function fillMeshVertices3D (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let indiceOffset = offsetInfo.indiceOffset,
        vertexId = offsetInfo.vertexOffset,
        vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData,
        ibuf = buffer._iData;

    let matrix = node._worldMatrix;

    let verts = renderData.vertices;
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

    return offsetInfo;
}

function fillVerticesWithoutCalc (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let verts = renderData.vertices;
    for (let i = 0; i < vertexCount; i++) {
        let vert = verts[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        uintbuf[vertexOffset++] = color;
    }

    return offsetInfo;
}

function fillVerticesWithoutCalc3D (node, buffer, renderData, color) {
    let vertexCount = renderData.vertexCount;
    let offsetInfo = buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    let vertexOffset = offsetInfo.byteOffset >> 2,
        vbuf = buffer._vData,
        uintbuf = buffer._uintVData;

    let verts = renderData.vertices;
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
