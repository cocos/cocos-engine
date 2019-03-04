
import { Color, Mat4 } from '../../../core/value-types';
import { color4, vec3 } from '../../../core/vmath/index';
import { RenderData } from '../../../renderer/ui/renderData';
import { Node } from '../../../scene-graph/node';
import { MeshBuffer } from '../mesh-buffer';

const vec3_temp = vec3.create();
const _worldMatrix = new Mat4();
const _tempColor = new Color();

export function fillVertices (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const data = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;
    // uintbuf = buffer._uintVData;

    // let matrix = node._worldMatrix;
    node.getWorldMatrix(_worldMatrix);
    const matrix = _worldMatrix;
    const a = matrix.m00;
    const b = matrix.m01;
    const c = matrix.m04;
    const d = matrix.m05;
    const tx = matrix.m12;
    const ty = matrix.m13;
    for (let i = 0; i < vertexCount; i++) {
        const vert = data[i];
        vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
        vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }
}

export function fillMeshVertices (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    let indiceOffset = buffer.indiceOffset;
    const vertexId = buffer.vertexOffset;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;
    const ibuf = buffer.iData!;

    node.getWorldMatrix(_worldMatrix);
    const matrix = _worldMatrix;
    const a = matrix.m00;
    const b = matrix.m01;
    const c = matrix.m04;
    const d = matrix.m05;
    const tx = matrix.m12;
    const ty = matrix.m13;
    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vbuf[vertexOffset++] = vert.x * a + vert.y * c + tx;
        vbuf[vertexOffset++] = vert.x * b + vert.y * d + ty;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // fill indice data
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        const start = vertexId + i * 4;
        ibuf[indiceOffset++] = start;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 2;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 3;
        ibuf[indiceOffset++] = start + 2;
    }
}

export function fillVertices3D (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;
    color.to01(_tempColor);

    const vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vec3.set(vec3_temp, vert.x, vert.y, 0);
        vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }
}

export function fillMeshVertices3D (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    let indiceOffset = buffer.indiceOffset;
    const vertexId = buffer.vertexOffset;

    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;
    const ibuf = buffer.iData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vec3.set(vec3_temp, vert.x, vert.y, 0);
        vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // fill indice data
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        const start = vertexId + i * 4;
        ibuf[indiceOffset++] = start;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 2;
        ibuf[indiceOffset++] = start + 1;
        ibuf[indiceOffset++] = start + 3;
        ibuf[indiceOffset++] = start + 2;
    }
}

export function fillVerticesWithoutCalc (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;
    // uintbuf = buffer._uintVData;

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }
}

export function fillVerticesWithoutCalc3D (node: Node, buffer: MeshBuffer, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let vertexOffset = buffer.byteOffset >> 2;
    color.to01(_tempColor);

    const vertexCount = renderData.vertexCount;
    buffer.request(vertexCount, renderData.indiceCount);

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        color4.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }
}
