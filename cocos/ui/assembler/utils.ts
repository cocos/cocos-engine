/**
 * @hidden
 */

import { Color, Mat4, Vec3 } from '../../core/math';
import { RenderData } from '../../core/renderer/ui/render-data';
import { UI } from '../../core/renderer/ui/ui';
import { Node } from '../../core';

const vec3_temp = new Vec3();
const _worldMatrix = new Mat4();

export function fillVertices3D (node: Node, renderer: UI, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    let indicesOffset = buffer!.indicesOffset;
    let vertexId = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = dataList[i];
        Vec3.set(vec3_temp, vert.x, vert.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vBuf[vertexOffset++] = vec3_temp.x;
        vBuf[vertexOffset++] = vec3_temp.y;
        vBuf[vertexOffset++] = vec3_temp.z;
        vBuf[vertexOffset++] = vert.u;
        vBuf[vertexOffset++] = vert.v;
        Color.toArray(vBuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // buffer data may be realloc, need get reference after request.
    const iBuf = buffer.iData;
    for (let i = 0; i < renderData!.dataLength; i++) {
        iBuf![indicesOffset + i] = vertexId + i;
    }
}

export function fillMeshVertices3D (node: Node, renderer: UI, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    let vertexCount = renderData.vertexCount;
    let indicesOffset = buffer.indicesOffset;
    let vertexId = buffer.vertexOffset;

    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;
    const iBuf = buffer.iData!;

    node.getWorldMatrix(_worldMatrix);

    for (let i = 0; i < vertexCount; i++) {
        const vert = dataList[i];
        Vec3.set(vec3_temp, vert.x, vert.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, _worldMatrix);
        vBuf[vertexOffset++] = vec3_temp.x;
        vBuf[vertexOffset++] = vec3_temp.y;
        vBuf[vertexOffset++] = vec3_temp.z;
        vBuf[vertexOffset++] = vert.u;
        vBuf[vertexOffset++] = vert.v;
        Color.toArray(vBuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // fill index data
    for (let i = 0, count = vertexCount / 4; i < count; i++) {
        const start = vertexId + i * 4;
        iBuf[indicesOffset++] = start;
        iBuf[indicesOffset++] = start + 1;
        iBuf[indicesOffset++] = start + 2;
        iBuf[indicesOffset++] = start + 1;
        iBuf[indicesOffset++] = start + 3;
        iBuf[indicesOffset++] = start + 2;
    }
}

export function fillVerticesWithoutCalc3D (node: Node, renderer: UI, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.currBufferBatch!;
    let vertexOffset = buffer.byteOffset >> 2;

    // buffer
    let vertexCount = renderData.vertexCount;
    let indicesOffset: number = buffer.indicesOffset;
    let vertexId: number = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexCount = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;

    for (let i = 0; i < vertexCount; i++) {
        const vert = dataList[i];
        vBuf[vertexOffset++] = vert.x;
        vBuf[vertexOffset++] = vert.y;
        vBuf[vertexOffset++] = vert.z;
        vBuf[vertexOffset++] = vert.u;
        vBuf[vertexOffset++] = vert.v;
        Color.toArray(vBuf!, color, vertexOffset);
        vertexOffset += 4;
    }

    // buffer data may be realloc, need get reference after request.
    const iBuf = buffer.iData;
    iBuf![indicesOffset++] = vertexId;
    iBuf![indicesOffset++] = vertexId + 1;
    iBuf![indicesOffset++] = vertexId + 2;
    iBuf![indicesOffset++] = vertexId + 1;
    iBuf![indicesOffset++] = vertexId + 3;
    iBuf![indicesOffset++] = vertexId + 2;
}
