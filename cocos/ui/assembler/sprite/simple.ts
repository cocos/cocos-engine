/*
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

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
 * UI 组装器
 * @category ui-assembler
 */

import { Vec3 } from '../../../core/math';
import { IAssembler } from '../../../core/renderer/ui/base';
import { IRenderData, RenderData } from '../../../core/renderer/ui/render-data';
import { UI } from '../../../core/renderer/ui/ui';
import { SpriteComponent } from '../../components';

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

/**
 * simple 组装器
 * 可通过 cc.UI.simple 获取该组装器。
 */
export const simple: IAssembler = {
    createData (sprite: SpriteComponent) {
        const renderData = sprite.requestRenderData();
        renderData!.dataLength = 4;
        renderData!.vertexCount = 4;
        renderData!.indicesCount = 6;

        renderData.vData = new Float32Array(4 * 9);

        return renderData as RenderData;
    },

    updateRenderData (sprite: SpriteComponent) {
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

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        if (sprite === null) {
            return;
        }

        // const buffer: MeshBuffer = renderer.createBuffer(
        //     sprite.renderData!.vertexCount,
        //     sprite.renderData!.indicesCount,
        // );
        // const commitBuffer: IUIRenderData = renderer.createUIRenderData();
        const dataList: IRenderData[] = sprite!.renderData!.data;
        const node = sprite.node;

        let buffer = renderer.currBufferBatch!;
        let vertexOffset = buffer.byteOffset >> 2;
        let indicesOffset = buffer.indicesOffset;
        let vertexId = buffer.vertexOffset;

        const isRecreate = buffer.request();
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indicesOffset = 0;
            vertexId = 0;
        }

        // buffer data may be reallocated, need get reference after request.
        const vBuf = buffer.vData!;
        const iBuf = buffer.iData!;
        const vData = sprite!.renderData!.vData!;
        const data0 = dataList[0];
        const data3 = dataList[3];
        const matrix = node.worldMatrix;
        const a = matrix.m00; const b = matrix.m01;
        const c = matrix.m04; const d = matrix.m05;
        const tx = matrix.m12; const ty = matrix.m13;
        const vl = data0.x; const vr = data3.x;
        const vb = data0.y; const vt = data3.y;
        const al = a * vl; const ar = a * vr;
        const bl = b * vl; const br = b * vr;
        const cb = c * vb; const ct = c * vt;
        const db = d * vb; const dt = d * vt;
        // left bottom
        vData[0] = al + cb + tx;
        vData[1] = bl + db + ty;
        // right bottom
        vData[9] = ar + cb + tx;
        vData[10] = br + db + ty;
        // left top
        vData[18] = al + ct + tx;
        vData[19] = bl + dt + ty;
        // right top
        vData[27] = ar + ct + tx;
        vData[28] = br + dt + ty;

        vBuf.set(vData, vertexOffset);

        // fill index data
        iBuf[indicesOffset++] = vertexId;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 2;
        iBuf[indicesOffset++] = vertexId + 1;
        iBuf[indicesOffset++] = vertexId + 3;
    },

    updateVertexData (sprite: SpriteComponent) {
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
        }
        else {
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
        dataList[0].z = 0;

        dataList[3].x = r;
        dataList[3].y = t;
        dataList[3].z = 0;

        renderData.vertDirty = false;
    },

    updateUvs (sprite: SpriteComponent) {
        const renderData = sprite.renderData!;
        const vData = renderData.vData!;
        const uv = sprite!.spriteFrame!.uv;
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

    updateColor (sprite: SpriteComponent) {
        const vData = sprite.renderData!.vData;

        let colorOffset = 5;
        const color = sprite.color;
        const colorR = color.r / 255;
        const colorG = color.g / 255;
        const colorB = color.b / 255;
        const colorA = color.a / 255;
        for (let i = 0; i < 4; i++) {
            vData![colorOffset] = colorR;
            vData![colorOffset + 1] = colorG;
            vData![colorOffset + 2] = colorB;
            vData![colorOffset + 3] = colorA;

            colorOffset += 9;
        }
    },
};
