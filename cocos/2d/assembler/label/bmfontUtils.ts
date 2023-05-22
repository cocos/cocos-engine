/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { JSB } from 'internal:constants';
import { IConfig, FontAtlas } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';
import { Rect } from '../../../core';
import { Label, Overflow, CacheMode } from '../../components/label';
import { UITransform } from '../../framework/ui-transform';
import { LetterAtlas, shareLabelInfo } from './font-utils';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { TextProcessing } from './text-processing';
import { TextProcessData } from './text-process-data';

const _defaultLetterAtlas = new LetterAtlas(64, 64);
const _defaultFontAtlas = new FontAtlas(null);

let _comp: Label | null = null;
let _uiTrans: UITransform | null = null;

let _fntConfig: IConfig | null = null;
let _spriteFrame: SpriteFrame|null = null;
let QUAD_INDICES;

export const bmfontUtils = {

    updateProcessingData (data: TextProcessData, comp: Label, trans: UITransform) {
        data.inputString = comp.string.toString();
        data.fontSize = comp.fontSize;
        data.actualFontSize = comp.fontSize;
        data.originFontSize = _fntConfig ? _fntConfig.fontSize : comp.fontSize;
        data.layout.hAlign = comp.horizontalAlign;
        data.layout.vAlign = comp.verticalAlign;
        data.layout.spacingX = comp.spacingX;
        const overflow = comp.overflow;
        data.layout.overFlow = overflow;
        data.layout.lineHeight = comp.lineHeight;

        data.outputLayoutData.nodeContentSize.width = trans.width;
        data.outputLayoutData.nodeContentSize.height = trans.height;

        // should wrap text
        if (overflow === Overflow.NONE) {
            data.layout.wrapping = false;
            data.outputLayoutData.nodeContentSize.width += shareLabelInfo.margin * 2;
            data.outputLayoutData.nodeContentSize.height += shareLabelInfo.margin * 2;
        } else if (overflow === Overflow.RESIZE_HEIGHT) {
            data.layout.wrapping = true;
            data.outputLayoutData.nodeContentSize.height += shareLabelInfo.margin * 2;
        } else {
            data.layout.wrapping = comp.enableWrapText;
        }

        shareLabelInfo.lineHeight = comp.lineHeight;
        shareLabelInfo.fontSize = comp.fontSize;

        data.spriteFrame = _spriteFrame;
        data.fntConfig = _fntConfig;
        data.fontAtlas = shareLabelInfo.fontAtlas;
        data.fontFamily = shareLabelInfo.fontFamily;

        data.color.set(comp.color);
    },

    updateRenderData (comp: Label) {
        if (!comp.renderData) {
            return;
        }

        if (_comp === comp) { return; }

        if (comp.renderData.vertDirty) {
            _comp = comp;
            _uiTrans = _comp.node._uiProps.uiTransformComp!;
            const renderData = comp.renderData;

            const processing = TextProcessing.instance;
            const data = comp.processingData;
            data.isBmFont = true; // hard code
            this._updateFontFamily(comp);

            this.updateProcessingData(data, comp, _uiTrans);

            this._updateLabelInfo(comp);

            data.fontDesc = shareLabelInfo.fontDesc;

            // TextProcessing
            processing.processingString(data);
            // generateVertex
            this.resetRenderData(comp);
            data.outputRenderData.quadCount = 0;
            processing.generateRenderInfo(data, this.generateVertexData);

            renderData.dataLength = data.outputRenderData.quadCount;
            renderData.resize(renderData.dataLength, renderData.dataLength / 2 * 3);
            const datalist = renderData.data;
            for (let i = 0, l = data.outputRenderData.quadCount; i < l; i++) {
                datalist[i] = data.outputRenderData.vertexBuffer[i];
            }

            const indexCount = renderData.indexCount;
            this.createQuadIndices(indexCount);
            renderData.chunk.setIndexBuffer(QUAD_INDICES);

            _comp.actualFontSize = data.actualFontSize;
            _uiTrans.setContentSize(data.outputLayoutData.nodeContentSize);
            this.updateUVs(comp);// dirty need
            this.updateColor(comp); // dirty need

            renderData.vertDirty = false;
            _comp = null;

            this._resetProperties();
        }

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    updateUVs (label: Label) {
        const renderData = label.renderData!;
        const vData = renderData.chunk.vb;
        const vertexCount = renderData.vertexCount;
        const dataList = renderData.data;
        let vertexOffset = 3;
        for (let i = 0; i < vertexCount; i++) {
            const vert = dataList[i];
            vData[vertexOffset] = vert.u;
            vData[vertexOffset + 1] = vert.v;
            vertexOffset += 9;
        }
    },

    updateColor (label: Label) {
        if (JSB) {
            const renderData = label.renderData!;
            const vertexCount = renderData.vertexCount;
            if (vertexCount === 0) return;
            const vData = renderData.chunk.vb;
            const stride = renderData.floatStride;
            let colorOffset = 5;
            const color = label.color;
            const colorR = color.r / 255;
            const colorG = color.g / 255;
            const colorB = color.b / 255;
            const colorA = color.a / 255;
            for (let i = 0; i < vertexCount; i++) {
                vData[colorOffset] = colorR;
                vData[colorOffset + 1] = colorG;
                vData[colorOffset + 2] = colorB;
                vData[colorOffset + 3] = colorA;
                colorOffset += stride;
            }
        }
    },

    resetRenderData (comp: Label) {
        const renderData = comp.renderData!;
        renderData.dataLength = 0;
        renderData.resize(0, 0);
    },

    // callBack function
    generateVertexData (info: TextProcessData, offset: number,
        spriteFrame: SpriteFrame, rect: Rect, rotated: boolean, x: number, y: number) {
        const dataOffset = offset;
        const scale = info.bmfontScale;

        const dataList = info.outputRenderData.vertexBuffer;
        const texW = spriteFrame.width;
        const texH = spriteFrame.height;

        const rectWidth = rect.width;
        const rectHeight = rect.height;

        let l = 0;
        let b = 0;
        let t = 0;
        let r = 0;
        if (!rotated) {
            l = (rect.x) / texW;
            r = (rect.x + rectWidth) / texW;
            b = (rect.y + rectHeight) / texH;
            t = (rect.y) / texH;

            dataList[dataOffset].u = l;
            dataList[dataOffset].v = b;
            dataList[dataOffset + 1].u = r;
            dataList[dataOffset + 1].v = b;
            dataList[dataOffset + 2].u = l;
            dataList[dataOffset + 2].v = t;
            dataList[dataOffset + 3].u = r;
            dataList[dataOffset + 3].v = t;
        } else {
            l = (rect.x) / texW;
            r = (rect.x + rectHeight) / texW;
            b = (rect.y + rectWidth) / texH;
            t = (rect.y) / texH;

            dataList[dataOffset].u = l;
            dataList[dataOffset].v = t;
            dataList[dataOffset + 1].u = l;
            dataList[dataOffset + 1].v = b;
            dataList[dataOffset + 2].u = r;
            dataList[dataOffset + 2].v = t;
            dataList[dataOffset + 3].u = r;
            dataList[dataOffset + 3].v = b;
        }

        dataList[dataOffset].x = x;
        dataList[dataOffset].y = y - rectHeight * scale;
        dataList[dataOffset + 1].x = x + rectWidth * scale;
        dataList[dataOffset + 1].y = y - rectHeight * scale;
        dataList[dataOffset + 2].x = x;
        dataList[dataOffset + 2].y = y;
        dataList[dataOffset + 3].x = x + rectWidth * scale;
        dataList[dataOffset + 3].y = y;
    },

    _updateFontFamily (comp) {
        const fontAsset = comp.font;
        _spriteFrame = fontAsset.spriteFrame;
        _fntConfig = fontAsset.fntConfig;
        shareLabelInfo.fontAtlas = fontAsset.fontDefDictionary;
        if (!shareLabelInfo.fontAtlas) {
            if (comp.cacheMode === CacheMode.CHAR) {
                shareLabelInfo.fontAtlas = _defaultLetterAtlas;
            } else {
                shareLabelInfo.fontAtlas = _defaultFontAtlas;
            }
        }

        dynamicAtlasManager.packToDynamicAtlas(comp, _spriteFrame);
        // TODO update material and uv
    },

    _updateLabelInfo (comp) {
        // clear
        shareLabelInfo.hash = '';
        shareLabelInfo.margin = 0;
    },

    _resetProperties () {
        _fntConfig = null;
        _spriteFrame = null;
        shareLabelInfo.hash = '';
        shareLabelInfo.margin = 0;
    },

    createQuadIndices (indexCount) {
        if (indexCount % 6 !== 0) {
            console.error('illegal index count!');
            return;
        }
        const quadCount = indexCount / 6;
        QUAD_INDICES = null;
        QUAD_INDICES = new Uint16Array(indexCount);
        let offset = 0;
        for (let i = 0; i < quadCount; i++) {
            QUAD_INDICES[offset++] = 0 + i * 4;
            QUAD_INDICES[offset++] = 1 + i * 4;
            QUAD_INDICES[offset++] = 2 + i * 4;
            QUAD_INDICES[offset++] = 1 + i * 4;
            QUAD_INDICES[offset++] = 3 + i * 4;
            QUAD_INDICES[offset++] = 2 + i * 4;
        }
    },
};

export default bmfontUtils;
