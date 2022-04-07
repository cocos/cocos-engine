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
import { Color, Mat4, Vec3 } from '../../../core/math';
import { IBatcher } from '../../renderer/i-batcher';
import { Label } from '../../components/label';
import { IAssembler } from '../../renderer/base';
import { ttfUtils } from './ttfUtils';
import { IRenderData } from '../../renderer/render-data';
import { StaticVBChunk } from '../../renderer/static-vb-accessor';

const WHITE = Color.WHITE.clone();

/**
 * ttf 组装器
 * 可通过 `UI.ttf` 获取该组装器。
 */
export const ttf: IAssembler = {
    createData (comp: Label) {
        const renderData = comp.requestRenderData()!;

        renderData.dataLength = 2;
        renderData.resize(4, 6);

        const vData = renderData.chunk.vb;

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
        const chunk = renderData.chunk;
        if (comp.node.hasChangedFlags || renderData.vertDirty) {
            this.updateWorldVerts(comp, chunk);
            renderData.vertDirty = false;
        }

        // quick version
        const bid = chunk.bufferId;
        const vid = chunk.vertexOffset;
        const meshBuffer = chunk.meshBuffer;
        const ib = chunk.meshBuffer.iData;
        let indexOffset = meshBuffer.indexOffset;
        ib[indexOffset++] = vid;
        ib[indexOffset++] = vid + 1;
        ib[indexOffset++] = vid + 2;
        ib[indexOffset++] = vid + 2;
        ib[indexOffset++] = vid + 1;
        ib[indexOffset++] = vid + 3;
        meshBuffer.indexOffset += 6;
        // slow version
        // const chunk = renderData.chunk;
        // renderer.getBufferAccessor().appendIndices(chunk);
    },

    updateWorldVerts (comp: Label, chunk:StaticVBChunk) {
        const dataList: IRenderData[] = comp.renderData!.data;
        const node = comp.node;

        const vData = chunk.vb;
        const data0 = dataList[0];
        const data3 = dataList[1];

        const matrix = new Mat4();
        node.getWorldMatrix(matrix);
        const vec3_temp = new Vec3();

        //left bottom
        Vec3.set(vec3_temp, data0.x, data0.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vData[0] = vec3_temp.x;
        vData[1] = vec3_temp.y;
        //right bottom
        Vec3.set(vec3_temp, data3.x, data0.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vData[9] = vec3_temp.x;
        vData[10] = vec3_temp.y;
        //left top
        Vec3.set(vec3_temp, data0.x, data3.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vData[18] = vec3_temp.x;
        vData[19] = vec3_temp.y;
        //right top
        Vec3.set(vec3_temp, data3.x, data3.y, 0);
        Vec3.transformMat4(vec3_temp, vec3_temp, matrix);
        vData[27] = vec3_temp.x;
        vData[28] = vec3_temp.y;
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
        data[1].x = width - appX;
        data[1].y = height - appY;
    },

    updateUVs (comp: Label) {
        const renderData = comp.renderData;
        if (!renderData || !comp.ttfSpriteFrame) {
            return;
        }
        const vData = renderData.chunk.vb;
        const uv = comp.ttfSpriteFrame.uv;
        vData[3] = uv[0];
        vData[4] = uv[1];
        vData[12] = uv[2];
        vData[13] = uv[3];
        vData[21] = uv[4];
        vData[22] = uv[5];
        vData[30] = uv[6];
        vData[31] = uv[7];
    },

    updateColor (comp: Label) {

    },
};

js.addon(ttf, ttfUtils);
