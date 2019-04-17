/****************************************************************************
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
 ****************************************************************************/

import { SpriteFrame } from '../../../../assets/sprite-frame';
import * as js from '../../../../core/utils/js';
import { Rect } from '../../../../core/value-types';
import { RenderData } from '../../../../renderer/ui/renderData';
import { UI } from '../../../../renderer/ui/ui';
import { LabelComponent } from '../../components/label-component';
import { IAssembler } from '../assembler';
import { fillMeshVertices3D } from '../utils';
import { bmfontUtils } from './bmfontUtils';

export const bmfont: IAssembler = {
    createData (comp: LabelComponent) {
        return comp.requestRenderData();
    },

    fillBuffers (comp: LabelComponent, renderer: UI) {
        const node = comp.node;
        fillMeshVertices3D(node, renderer, comp.renderData!, comp.color);
    },

    appendQuad (renderData: RenderData, texture: SpriteFrame, rect: Rect, rotated: boolean, x: number, y: number, scale: number) {
        const dataOffset = renderData.dataLength;

        renderData.dataLength += 4;
        renderData.vertexCount = renderData.dataLength;
        renderData.indiceCount = renderData.dataLength / 2 * 3;

        const datas = renderData.datas;
        const texw = texture.width;
        const texh = texture.height;

        const rectWidth = rect.width;
        const rectHeight = rect.height;

        let l = 0;
        let b = 0;
        let t = 0;
        let r = 0;
        if (!rotated) {
            l = (rect.x) / texw;
            r = (rect.x + rectWidth) / texw;
            b = (rect.y + rectHeight) / texh;
            t = (rect.y) / texh;

            datas[dataOffset].u = l;
            datas[dataOffset].v = b;
            datas[dataOffset + 1].u = r;
            datas[dataOffset + 1].v = b;
            datas[dataOffset + 2].u = l;
            datas[dataOffset + 2].v = t;
            datas[dataOffset + 3].u = r;
            datas[dataOffset + 3].v = t;
        } else {
            l = (rect.x) / texw;
            r = (rect.x + rectHeight) / texw;
            b = (rect.y + rectWidth) / texh;
            t = (rect.y) / texh;

            datas[dataOffset].u = l;
            datas[dataOffset].v = t;
            datas[dataOffset + 1].u = l;
            datas[dataOffset + 1].v = b;
            datas[dataOffset + 2].u = r;
            datas[dataOffset + 2].v = t;
            datas[dataOffset + 3].u = r;
            datas[dataOffset + 3].v = b;
        }

        datas[dataOffset].x = x;
        datas[dataOffset].y = y - rectHeight * scale;
        datas[dataOffset + 1].x = x + rectWidth * scale;
        datas[dataOffset + 1].y = y - rectHeight * scale;
        datas[dataOffset + 2].x = x;
        datas[dataOffset + 2].y = y;
        datas[dataOffset + 3].x = x + rectWidth * scale;
        datas[dataOffset + 3].y = y;
    },
};

js.addon(bmfont, bmfontUtils);
