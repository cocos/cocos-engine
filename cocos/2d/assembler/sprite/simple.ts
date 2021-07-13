/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
 * @module ui-assembler
 */

import { Vec3 } from '../../../core/math';
import { IAssembler } from '../../renderer/base';
import { IRenderData, RenderData } from '../../renderer/render-data';
import { Batcher2D } from '../../renderer/batcher-2d';
import { Sprite } from '../../components';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { TransformBit } from '../../../core/scene-graph/node-enum';

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

/**
 * simple 组装器
 * 可通过 `UI.simple` 获取该组装器。
 */
export const simple: IAssembler = {
    createData (sprite: Sprite) {
        const renderData = sprite.requestRenderData();
        renderData.dataLength = 4;
        renderData.vertexCount = 4;
        renderData.indicesCount = 6;

        renderData.vData = new Float32Array(4 * 9);

        return renderData;
    },

    updateRenderData (sprite: Sprite) {
        const frame = sprite.spriteFrame;

        // TODO: Material API design and export from editor could affect the material activation process
        // need to update the logic here
        // if (frame) {
        //     if (!frame._original && dynamicAtlasManager) {
        //         dynamicAtlasManager.insertSpriteFrame(frame);
        //     }
        //     if (sprite._material._texture !== frame._texture) {
        //         sprite._activateMaterial();
        //     }
        // }
        dynamicAtlasManager.packToDynamicAtlas(sprite, frame);

        const renderData = sprite.renderData;
        if (renderData && frame) {
            if (renderData.vertDirty) {
                this.updateVertexData(sprite);
            }
            if (renderData.uvDirty) {
                this.updateUvs(sprite);
            }
        }
    },

    updateWorldVerts (sprite: Sprite, vData: Float32Array) {
        const renderData = sprite.renderData;

        const dataList: IRenderData[] = renderData!.data;
        const node = sprite.node;

        const data0 = dataList[0];
        const data3 = dataList[3];
        const matrix = node.worldMatrix;
        const a = matrix.m00; const b = matrix.m01;
        const c = matrix.m04; const d = matrix.m05;

        const justTranslate = a === 1 && b === 0 && c === 0 && d === 1;

        const tx = matrix.m12; const ty = matrix.m13;
        const vl = data0.x; const vr = data3.x;
        const vb = data0.y; const vt = data3.y;

        if (justTranslate) {
            const vltx = vl + tx;
            const vrtx = vr + tx;
            const vbty = vb + ty;
            const vtty = vt + ty;

            // left bottom
            vData[0] = vltx;
            vData[1] = vbty;
            // right bottom
            vData[9] = vrtx;
            vData[10] = vbty;
            // left top
            vData[18] = vltx;
            vData[19] = vtty;
            // right top
            vData[27] = vrtx;
            vData[28] = vtty;
        } else {
            const al = a * vl; const ar = a * vr;
            const bl = b * vl; const br = b * vr;
            const cb = c * vb; const ct = c * vt;
            const db = d * vb; const dt = d * vt;

            const cbtx = cb + tx;
            const cttx = ct + tx;
            const dbty = db + ty;
            const dtty = dt + ty;

            // left bottom
            vData[0] = al + cbtx;
            vData[1] = bl + dbty;
            // right bottom
            vData[9] = ar + cbtx;
            vData[10] = br + dbty;
            // left top
            vData[18] = al + cttx;
            vData[19] = bl + dtty;
            // right top
            vData[27] = ar + cttx;
            vData[28] = br + dtty;
        }
    },

    fillBuffers (sprite: Sprite, renderer: Batcher2D) {
        if (sprite === null) {
            return;
        }

        const vData = sprite.renderData!.vData!;
        // 这里是认为在 updateRenderData 的时候已经进行了更新
        // 也确实做过了更新
        if (sprite.node._uiProps.UITransformDirty) {
            this.updateWorldVerts(sprite, vData);
        }

        // const buffer: MeshBuffer = renderer.createBuffer(
        //     sprite.renderData!.vertexCount,
        //     sprite.renderData!.indicesCount,
        // );
        // const commitBuffer: IUIRenderData = renderer.createUIRenderData();
        const dataList: IRenderData[] = sprite.renderData!.data; // 四个顶点数据
        const node = sprite.node;

        let buffer = renderer.acquireBufferBatch()!; // 申请了 vfmtPosUvColor 格式的 buffer，即 3 2 4
        let vertexOffset = buffer.byteOffset >> 2; // 顶点数据 offset 距离
        let indicesOffset = buffer.indicesOffset; // 索引offset 距离
        let vertexId = buffer.vertexOffset; // 顶点索引ID

        const bufferUnchanged = buffer.request();
        if (!bufferUnchanged) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indicesOffset = 0;
            vertexId = 0;
        }

        // 如果把 renderData 的相关属性都移动到使用 uniform 实现，那么，这里还剩下些什么？

        // buffer data may be reallocated, need get reference after request.
        const vBuf = buffer.vData!; // 顶点数据
        const iBuf = buffer.iData!; // 索引数据
        const vData = sprite.renderData!.vData!; // 顶点数据
        const data0 = dataList[0];  // 渲染 data
        const data3 = dataList[3]; // 渲染 data
        const matrix = node.worldMatrix; // 世界矩阵
        const a = matrix.m00; const b = matrix.m01; // m00 scale x  m05 scale y m10 scale z
        const c = matrix.m04; const d = matrix.m05; // m00 m01 m04 m05 rotation with z // 所以 0145 是 RS
        const tx = matrix.m12; const ty = matrix.m13; // m12 pos x m12 pos y m14 pos z
        const vl = data0.x; const vr = data3.x; // 这个是 RECT
        const vb = data0.y; const vt = data3.y;
        const al = a * vl; const ar = a * vr; // 左右的 X 位置，RS 过的
        const bl = b * vl; const br = b * vr; // 左右的 Y 位置，RS 过的
        const cb = c * vb; const ct = c * vt; // 上下的位置
        const db = d * vb; const dt = d * vt; // 上下的位置
        // left bottom
        vData[0] = al + cb + tx; // 左X加下X 加 POS X
        vData[1] = bl + db + ty; // 左Y加下Y 加 POS Y
        // right bottom
        vData[9] = ar + cb + tx; // 右X加下X 加 POS X
        vData[10] = br + db + ty; // 右X加下X 加 POS Y
        // left top
        vData[18] = al + ct + tx; // 左X加上X 加 POS X
        vData[19] = bl + dt + ty; // 左X加上X 加 POS Y
        // right top
        vData[27] = ar + ct + tx; // 右X加上X 加 POS X
        vData[28] = br + dt + ty; // 右X加上X 加 POS Y

        vBuf.set(vData, vertexOffset); // 其实是都赋值了，只是说 vData 要不要更新

        // fill index data // 0122113
        iBuf[indicesOffset++] = vertexId;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 3;
    },

    updateVertexData (sprite: Sprite) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const uiTrans = sprite.node._uiProps.uiTransformComp!;
        const dataList: IRenderData[] = renderData.data;
        const cw = uiTrans.width;
        const ch = uiTrans.height;
        const appX = uiTrans.anchorX * cw;
        const appY = uiTrans.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appX;
            b = -appY;
            r = cw - appX;
            t = ch - appY;
        } else {
            const frame = sprite.spriteFrame!;
            const originSize = frame.getOriginalSize();
            const rect = frame.getRect();
            const ow = originSize.width;
            const oh = originSize.height;
            const rw = rect.width;
            const rh = rect.height;
            const offset = frame.getOffset();
            const scaleX = cw / ow;
            const scaleY = ch / oh;
            const trimLeft = offset.x + (ow - rw) / 2;
            const trimRight = offset.x - (ow - rw) / 2;
            const trimBottom = offset.y + (oh - rh) / 2;
            const trimTop = offset.y - (oh - rh) / 2;
            l = trimLeft * scaleX - appX;
            b = trimBottom * scaleY - appY;
            r = cw + trimRight * scaleX - appX;
            t = ch + trimTop * scaleY - appY;
        }

        dataList[0].x = l;
        dataList[0].y = b;

        dataList[3].x = r;
        dataList[3].y = t;

        renderData.vertDirty = false;
        this.updateWorldVerts(sprite, renderData.vData);
    },

    updateUvs (sprite: Sprite) {
        const renderData = sprite.renderData!;
        const vData = renderData.vData!;
        const uv = sprite.spriteFrame!.uv;
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

    updateColor (sprite: Sprite) {
        const vData = sprite.renderData!.vData;

        let colorOffset = 5;
        const color = sprite.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = sprite.node._uiProps.opacity;
        for (let i = 0; i < 4; i++) {
            vData![colorOffset] = colorR;
            vData![colorOffset + 1] = colorG;
            vData![colorOffset + 2] = colorB;
            vData![colorOffset + 3] = colorA;

            colorOffset += 9;
        }
    },
};
