/**
 * @hidden
 */

import { Color, Mat4, Vec3 } from '../../../core/math';
import { RenderData } from '../../../renderer/ui/renderData';
import { UI } from '../../../renderer/ui/ui';
import { INode } from '../../../core/utils/interfaces';

const vec3_temp = new Vec3();
const _worldMatrix = new Mat4();

export function fillVertices3D (node: INode, renderer: UI, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    let indiceOffset = buffer!.indiceOffset;
    let vertexId = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indiceCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indiceOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        Vec3.set(vec3_temp, vert.x, vert.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        Color.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // buffer data may be realloc, need get reference after request.
    const ibuf = buffer.iData;
    for (let i = 0; i < renderData!.dataLength; i++) {
        ibuf![indiceOffset + i] = vertexId + i;
    }
}

export function fillMeshVertices3D (node: INode, renderer: UI, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    let indiceOffset = buffer.indiceOffset;
    let vertexId = buffer.vertexOffset;

    const isRecreate = buffer.request(vertexCount, renderData.indiceCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indiceOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;
    const ibuf = buffer.iData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        Vec3.set(vec3_temp, vert.x, vert.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vbuf[vertexOffset++] = vec3_temp.x;
        vbuf[vertexOffset++] = vec3_temp.y;
        vbuf[vertexOffset++] = vec3_temp.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        Color.array(vbuf!, color, vertexOffset);
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

export function fillVerticesWithoutCalc3D (node: INode, renderer: UI, renderData: RenderData, color: Color) {
    const datas = renderData.datas;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    // buffer
    let vertexCount = renderData.vertexCount;
    let indiceOffset: number = buffer.indiceOffset;
    let vertexId: number = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indiceCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indiceOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vbuf = buffer.vData!;

    for (let i = 0; i < vertexCount; i++) {
        const vert = datas[i];
        vbuf[vertexOffset++] = vert.x;
        vbuf[vertexOffset++] = vert.y;
        vbuf[vertexOffset++] = vert.z;
        vbuf[vertexOffset++] = vert.u;
        vbuf[vertexOffset++] = vert.v;
        Color.array(vbuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // buffer data may be realloc, need get reference after request.
    const ibuf = buffer.iData;
    ibuf![indiceOffset++] = vertexId;
    ibuf![indiceOffset++] = vertexId + 1;
    ibuf![indiceOffset++] = vertexId + 2;
    ibuf![indiceOffset++] = vertexId + 1;
    ibuf![indiceOffset++] = vertexId + 3;
    ibuf![indiceOffset++] = vertexId + 2;
}
