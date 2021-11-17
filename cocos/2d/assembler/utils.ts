/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

/**
 * @packageDocumentation
 * @hidden
 */

import { Color, Mat4, Vec3 } from '../../core/math';
import { RenderData } from '../renderer/render-data';
import { IBatcher } from '../renderer/i-batcher';
import { Node } from '../../core/scene-graph/node';

const vec3_temp = new Vec3();
const _worldMatrix = new Mat4();

export function fillVertices3D (node: Node, renderer: IBatcher, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.acquireBufferBatch()!;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    let indicesOffset = buffer.indicesOffset;
    let vertexId = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexOffset = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;
    const uintVBuf = buffer.uintVData!;

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
        uintVBuf[vertexOffset++] = color._val;
    }

    // buffer data may be realloc, need get reference after request.
    const iBuf = buffer.iData;
    for (let i = 0; i < renderData.dataLength; i++) {
        iBuf![indicesOffset + i] = vertexId + i;
    }
}

export function fillMeshVertices3D (node: Node, renderer: IBatcher, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.acquireBufferBatch()!;
    let vertexOffset = buffer.byteOffset >> 2;

    const vertexCount = renderData.vertexCount;
    let indicesOffset = buffer.indicesOffset;
    let vertexId = buffer.vertexOffset;

    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexOffset = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;
    const iBuf = buffer.iData!;
    const uintVBuf = buffer.uintVData!;

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
        uintVBuf[vertexOffset++] = color._val;
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

export function fillVerticesWithoutCalc3D (node: Node, renderer: IBatcher, renderData: RenderData, color: Color) {
    const dataList = renderData.data;
    let buffer = renderer.acquireBufferBatch()!;
    let vertexOffset = buffer.byteOffset >> 2;

    // buffer
    const vertexCount = renderData.vertexCount;
    let indicesOffset: number = buffer.indicesOffset;
    let vertexId: number = buffer.vertexOffset;
    const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
    if (!isRecreate) {
        buffer = renderer.currBufferBatch!;
        vertexOffset = 0;
        indicesOffset = 0;
        vertexId = 0;
    }

    // buffer data may be realloc, need get reference after request.
    const vBuf = buffer.vData!;
    const uintVBuf = buffer.uintVData!;

    for (let i = 0; i < vertexCount; i++) {
        const vert = dataList[i];
        vBuf[vertexOffset++] = vert.x;
        vBuf[vertexOffset++] = vert.y;
        vBuf[vertexOffset++] = vert.z;
        vBuf[vertexOffset++] = vert.u;
        vBuf[vertexOffset++] = vert.v;
        uintVBuf[vertexOffset++] = color._val;
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
