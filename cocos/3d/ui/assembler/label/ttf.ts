/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * @category ui-assembler
 */

import * as js from '../../../../core/utils/js';
import { Color } from '../../../../core/math';
import { UI } from '../../../../renderer/ui/ui';
import { LabelComponent } from '../../components/label-component';
import { IAssembler} from '../base';
import { ttfUtils } from './ttfUtils';
import { IRenderData } from '../../../../renderer/ui/renderData';

const WHITE = Color.WHITE;

/**
 * ttf 组装器
 * 可通过 cc.UI.ttf 获取该组装器。
 */
export const ttf: IAssembler = {
    createData (comp: LabelComponent) {
        const renderData = comp.requestRenderData();

        renderData!.dataLength = 4;
        renderData!.vertexCount = 4;
        renderData!.indiceCount = 6;

        const vData =  renderData.vData = new Float32Array(4 * 9);

        vData[3] = vData[21] = vData[22] = vData[31] = 0;
        vData[4] = vData[12] = vData[13] = vData[30] = 1;
        let offset = 5;
        for (let i = 0; i < 4; i++) {
            Color.array(vData, WHITE, offset);
            offset += 9;
        }
        return renderData;
    },

    fillBuffers (comp: LabelComponent, renderer: UI) {
        const renderData = comp.renderData!;
        const datas: IRenderData[] = renderData.datas;
        const node = comp.node;

        let buffer = renderer.currBufferBatch!;
        let vertexCount = renderData.vertexCount;
        let vertexOffset = buffer.byteOffset >> 2;
        let indiceOffset = buffer.indiceOffset;
        let vertexId = buffer.vertexOffset;
        const isRecreate = buffer.request();
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexCount = 0;
            indiceOffset = 0;
            vertexId = 0;
        }

        // buffer data may be reallocated, need get reference after request.
        const vbuf = buffer.vData!;
        const ibuf = buffer.iData!;
        const vData = renderData.vData!;
        const data0 = datas[0];
        const data3 = datas[3];
        /* */
        node.updateWorldTransform();
        // @ts-ignore
        const pos = node._pos as Vec3; const rot = node._rot; const scale = node._scale;
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

        vbuf.set(vData, vertexOffset);

        // fill indice data
        ibuf[indiceOffset++] = vertexId;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 2;
        ibuf[indiceOffset++] = vertexId + 2;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 3;
    },

    updateVerts (comp: LabelComponent) {
        const renderData = comp.renderData;
        if (!renderData){
            return;
        }

        const node = comp.node;
        const width = node.width!;
        const height = node.height!;
        const appx = node.anchorX! * width;
        const appy = node.anchorY! * height;

        const datas = renderData!.datas;
        datas[0].x = -appx;
        datas[0].y = -appy;
        datas[3].x = width - appx;
        datas[3].y = height - appy;
    },
};

js.addon(ttf, ttfUtils);
