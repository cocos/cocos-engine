/****************************************************************************
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
 ****************************************************************************/

import { Vec3 } from '../../../../core/value-types';
import { vec3, color4 } from '../../../../core/vmath/index';
import { IRenderData, RenderData } from '../../../../renderer/ui/renderData';
import { IUIRenderData, UI } from '../../../../renderer/ui/ui';
import { Node } from '../../../../scene-graph/node';
import { SpriteComponent } from '../../components/sprite-component';
import { MeshBuffer } from '../../mesh-buffer';
import { IAssembler } from '../assembler';
// const dynamicAtlasManager = require('../../../../utils/dynamic-atlas/manager');
const matrix = cc.mat4();
const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}
const color_temp = color4.create();

export const simple: IAssembler = {

    useModel: false,

    createData (sprite: SpriteComponent) {
        const renderData = sprite.requestRenderData();
        renderData!.dataLength = 4;
        renderData!.vertexCount = 4;
        renderData!.indiceCount = 6;
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
                if (this.updateVerts) {
                    this.updateVerts(sprite);
                }
            }
        }
    },

    fillBuffers (sprite: SpriteComponent, renderer: UI) {
        if (sprite === null) {
            return;
        }

        const buffer: MeshBuffer = renderer.createBuffer(
            sprite.renderData!.vertexCount,
            sprite.renderData!.indiceCount,
        );
        const commitBuffer: IUIRenderData = renderer.createUIRenderData();
        const datas: IRenderData[] = sprite!.renderData!.datas;
        const node: Node = sprite.node;
        // const color: Color = sprite.color;
        sprite.color.to01(color_temp);

        node.getWorldMatrix(matrix);

        let vertexOffset: number = buffer.byteOffset >> 2;
        let indiceOffset: number = buffer.indiceOffset;
        const vertexId: number = buffer.vertexOffset;

        buffer.request(4, 6);

        // buffer data may be realloc, need get reference after request.
        const vbuf: Float32Array|null = buffer.vData;
        // const uintbuf = buffer.uintVData;
        const ibuf: Uint16Array|null = buffer.iData;

        const data0 = datas[0];
        const data3 = datas[3];
        vec3.set(vec3_temps[0], data0.x, data0.y, 0);
        vec3.set(vec3_temps[1], data3.x, data0.y, 0);
        vec3.set(vec3_temps[2], data0.x, data3.y, 0);
        vec3.set(vec3_temps[3], data3.x, data3.y, 0);

        // get uv from sprite frame directly
        const uv = sprite!.spriteFrame!.uv;

        for (let i = 0; i < 4; i++) {
            // vertex
            const vertex = vec3_temps[i];
            vec3.transformMat4(vertex, vertex, matrix);

            vbuf![vertexOffset++] = vertex.x;
            vbuf![vertexOffset++] = vertex.y;
            vbuf![vertexOffset++] = vertex.z;

            // uv
            const uvOffset = i * 2;
            vbuf![vertexOffset++] = uv[0 + uvOffset];
            vbuf![vertexOffset++] = uv[1 + uvOffset];

            // color
            vbuf![vertexOffset++] = color_temp.r;
            vbuf![vertexOffset++] = color_temp.g;
            vbuf![vertexOffset++] = color_temp.b;
            vbuf![vertexOffset++] = color_temp.a;
            // uintbuf[vertexOffset++] = color;
        }

        // fill indice data
        ibuf![indiceOffset++] = vertexId;
        ibuf![indiceOffset++] = vertexId + 1;
        ibuf![indiceOffset++] = vertexId + 2;
        ibuf![indiceOffset++] = vertexId + 1;
        ibuf![indiceOffset++] = vertexId + 3;
        ibuf![indiceOffset++] = vertexId + 2;

        commitBuffer.meshBuffer = buffer;
        commitBuffer.material = sprite.sharedMaterial!;
        commitBuffer.texture = sprite.spriteFrame!;
        commitBuffer.priority = sprite.priority;
        renderer.addToQueue(commitBuffer);
    },

    updateVerts (sprite: SpriteComponent) {
        const renderData: RenderData|null = sprite.renderData;
        if (!renderData) {
            return;
        }

        const node: Node = sprite.node;
        const datas: IRenderData[] = renderData.datas;
        const cw: number = node.width;
        const ch: number = node.height;
        const appx: number = node.anchorX * cw;
        const appy: number = node.anchorY * ch;
        let l: number = 0;
        let b: number = 0;
        let r: number = 0;
        let t: number = 0;
        // if (sprite.trim) {
        l = -appx;
        b = -appy;
        r = cw - appx;
        t = ch - appy;
        // }
        // else {
        //     let frame = sprite.spriteFrame,
        //         ow = frame._originalSize.width, oh = frame._originalSize.height,
        //         rw = frame._rect.width, rh = frame._rect.height,
        //         offset = frame._offset,
        //         scaleX = cw / ow, scaleY = ch / oh;
        //     let trimLeft = offset.x + (ow - rw) / 2;
        //     let trimRight = offset.x - (ow - rw) / 2;
        //     let trimBottom = offset.y + (oh - rh) / 2;
        //     let trimTop = offset.y - (oh - rh) / 2;
        //     l = trimLeft * scaleX - appx;
        //     b = trimBottom * scaleY - appy;
        //     r = cw + trimRight * scaleX - appx;
        //     t = ch + trimTop * scaleY - appy;
        // }

        datas[0].x = l;
        datas[0].y = b;
        // datas[1].x = r;
        // datas[1].y = b;
        // datas[2].x = l;
        // datas[2].y = t;
        datas[3].x = r;
        datas[3].y = t;

        renderData.vertDirty = false;
    },
};
