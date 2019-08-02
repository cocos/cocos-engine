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

import { Vec3 } from '../../../../core/math';
import { IRenderData, RenderData } from '../../../../renderer/ui/renderData';
import { UI } from '../../../../renderer/ui/ui';
import { SpriteComponent } from '../../components';
import { IAssembler } from '../base';
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
        renderData!.indiceCount = 6;

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
                this.updateVerts(sprite);
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
        //     sprite.renderData!.indiceCount,
        // );
        // const commitBuffer: IUIRenderData = renderer.createUIRenderData();
        const datas: IRenderData[] = sprite!.renderData!.datas;
        const node = sprite.node;

        let buffer = renderer.currBufferBatch!;
        let vertexOffset = buffer.byteOffset >> 2;
        let indiceOffset = buffer.indiceOffset;
        let vertexId = buffer.vertexOffset;

        const isRecreate = buffer.request();
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexOffset = 0;
            indiceOffset = 0;
            vertexId = 0;
        }

        // buffer data may be reallocated, need get reference after request.
        const vbuf = buffer.vData!;
        const ibuf = buffer.iData!;
        const vData = sprite!.renderData!.vData!;
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
        /* *
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
        /* */

        vbuf.set(vData, vertexOffset);

        // fill indice data
        ibuf[indiceOffset++] = vertexId;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 2;
        ibuf[indiceOffset++] = vertexId + 2;
        ibuf[indiceOffset++] = vertexId + 1;
        ibuf[indiceOffset++] = vertexId + 3;
    },

    updateVerts (sprite: SpriteComponent) {
        const renderData: RenderData | null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const node = sprite.node;
        const datas: IRenderData[] = renderData.datas;
        const cw = node.width;
        const ch = node.height;
        const appx = node.anchorX * cw;
        const appy = node.anchorY * ch;
        let l = 0;
        let b = 0;
        let r = 0;
        let t = 0;
        if (sprite.trim) {
            l = -appx;
            b = -appy;
            r = cw - appx;
            t = ch - appy;
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
            l = trimLeft * scaleX - appx;
            b = trimBottom * scaleY - appy;
            r = cw + trimRight * scaleX - appx;
            t = ch + trimTop * scaleY - appy;
        }

        datas[0].x = l;
        datas[0].y = b;
        datas[0].z = 0;
        // datas[1].x = r;
        // datas[1].y = b;
        // datas[2].x = l;
        // datas[2].y = t;
        datas[3].x = r;
        datas[3].y = t;
        datas[3].z = 0;

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
        const colorr = color.r / 255;
        const colorg = color.g / 255;
        const colorb = color.b / 255;
        const colora = color.a / 255;
        for (let i = 0; i < 4; i++) {
            vData![colorOffset] = colorr;
            vData![colorOffset + 1] = colorg;
            vData![colorOffset + 2] = colorb;
            vData![colorOffset + 3] = colora;

            colorOffset += 9;
        }
    },
};
