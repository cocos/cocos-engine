/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 * ui-assembler 相关模块
 * @module ui-assembler
 */

import * as js from '../../../core/utils/js';
import { Color } from '../../../core/math';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { IAssembler } from '../../renderer/base';
import { ttfUtils } from './ttfUtils';
import { IRenderData } from '../../renderer/render-data';

const WHITE = Color.WHITE.clone();

/**
 * ttf 组装器
 * 可通过 `UI.ttf` 获取该组装器。
 */
export const ttf: IAssembler = {
    createData (comp: Label) {
        const renderData = comp.requestRenderData()!;

        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indicesCount = 6;

        const vData =  renderData.vData = new Float32Array(4 * 9);

        vData[3] = vData[21] = vData[22] = vData[31] = 0;
        vData[4] = vData[12] = vData[13] = vData[30] = 1;
        let offset = 5;
        for (let i = 0; i < 4; i++) {
            Color.toArray(vData, WHITE, offset);
            offset += 9;
        }
        return renderData;
    },

    fillBuffers (comp: Label, renderer: IBatcher) {
        const renderData = comp.renderData!;
        const dataList: IRenderData[] = renderData.data;
        const node = comp.node;

        const accessor = renderer.switchBufferAccessor();
        accessor.request();
        const buffer = accessor.currentBuffer;
        const vertexOffset = accessor.byteOffset >> 2;
        let indicesOffset = accessor.indexOffset;
        const vertexId = accessor.vertexOffset;

        // buffer data may be reallocated, need get reference after request.
        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;
        const vData = renderData.vData!;
        const data0 = dataList[0];
        const data3 = dataList[3];
        /* */
        node.updateWorldTransform();
        // @ts-expect-error private property access
        const pos = node._pos; const rot = node._rot; const scale = node._scale;
        const ax = data0.x * scale.x; const bx = data3.x * scale.x;
        const ay = data0.y * scale.y; const by = data3.y * scale.y;
        const qx = rot.x; const qy = rot.y; const qz = rot.z; const qw = rot.w;
        const qxy = qx * qy; const qzw = qz * qw;
        const qxy2 = qx * qx - qy * qy;
        const qzw2 = qw * qw - qz * qz;
        const cx1 = qzw2 + qxy2;
        const cx2 = (qxy - qzw) * 2;
        const cy1 = qzw2 - qxy2;
        const cy2 = (qxy + qzw) * 2;
        const x = pos.x; const y = pos.y;
        // left bottom
        vData[0] = cx1 * ax + cx2 * ay + x;
        vData[1] = cy1 * ay + cy2 * ax + y;
        // right bottom
        vData[9] = cx1 * bx + cx2 * ay + x;
        vData[10] = cy1 * ay + cy2 * bx + y;
        // left top
        vData[18] = cx1 * ax + cx2 * by + x;
        vData[19] = cy1 * by + cy2 * ax + y;
        // right top
        vData[27] = cx1 * bx + cx2 * by + x;
        vData[28] = cy1 * by + cy2 * bx + y;

        vBuf.set(vData, vertexOffset);

        // fill index data
        iBuf[indicesOffset++] = vertexId;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 3;
    },

    updateVertexData (comp: Label) {
        const renderData = comp.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = comp.node._uiProps.uiTransformComp!;
        const width = uiTrans.width;
        const height = uiTrans.height;
        const appX = uiTrans.anchorX * width;
        const appY = uiTrans.anchorY * height;

        const data = renderData.data;
        data[0].x = -appX;
        data[0].y = -appY;
        data[3].x = width - appX;
        data[3].y = height - appY;
    },

    updateUvs (comp: Label) {
        const renderData = comp.renderData;
        if (!renderData) {
            return;
        }
        const vData = renderData.vData!;
        if (!vData || !renderData.uvDirty) {
            return;
        }

        const uv = comp.ttfSpriteFrame!.uv;
        vData[3] = uv[0];
        vData[4] = uv[1];
        vData[12] = uv[2];
        vData[13] = uv[3];
        vData[21] = uv[4];
        vData[22] = uv[5];
        vData[30] = uv[6];
        vData[31] = uv[7];

        renderData.uvDirty = false;
    },
};

js.addon(ttf, ttfUtils);
