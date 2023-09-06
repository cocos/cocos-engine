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
import { FontAtlas, BitmapFont } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';
import { Rect, Vec2, error } from '../../../core';
import { Label, Overflow, CacheMode } from '../../components/label';
import { UITransform } from '../../framework/ui-transform';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { TextProcessing } from './text-processing';
import { TextOutputLayoutData, TextOutputRenderData } from './text-output-data';
import { TextStyle } from './text-style';
import { TextLayout } from './text-layout';
import { view } from '../../../ui/view';

const _defaultFontAtlas = new FontAtlas(null);

let QUAD_INDICES;

export const bmfontUtils = {

    updateLayoutProcessingData (
        style: TextStyle,
        layout: TextLayout,
        outputLayoutData: TextOutputLayoutData,
        comp: Label,
        trans: UITransform,
    ): void {
        style.fontSize = comp.fontSize; //both
        style.actualFontSize = comp.fontSize; //both
        layout.horizontalAlign = comp.horizontalAlign; //both
        layout.verticalAlign = comp.verticalAlign; //both
        layout.spacingX = comp.spacingX; // layout only
        const overflow = comp.overflow;

        outputLayoutData.nodeContentSize.width = trans.width;
        outputLayoutData.nodeContentSize.height = trans.height;
        layout.overFlow = overflow; // both
        layout.lineHeight = comp.lineHeight; // both

        // should wrap text
        if (overflow === Overflow.NONE) {
            layout.wrapping = false; // both
        } else if (overflow === Overflow.RESIZE_HEIGHT) {
            layout.wrapping = true;
        } else {
            layout.wrapping = comp.enableWrapText;
        }
        const fontAsset = comp.font as BitmapFont;
        style.fntConfig = fontAsset.fntConfig; // layout only
        style.originFontSize = fontAsset.fntConfig?.fontSize; //both // 是否需要防护？
        style.fontAtlas = fontAsset.fontDefDictionary;
        if (!style.fontAtlas) { // 为了避免后面的判断？看能不能删掉
            style.fontAtlas = _defaultFontAtlas; // 容错？不要容错！
        }

        style.isOutlined = false;
        style.outlineWidth = 0;

        style.hash = '';
    },

    // render Only
    updateRenderProcessingData (
        style: TextStyle,
        outputRenderData: TextOutputRenderData,
        comp: Label,
        anchor: Readonly<Vec2>,
    ): void {
        // render info
        outputRenderData.uiTransAnchorX = anchor.x;
        outputRenderData.uiTransAnchorY = anchor.y;

        if (comp.cacheMode !== CacheMode.CHAR) {
            const fontAsset = comp.font! as BitmapFont;
            style.spriteFrame = fontAsset.spriteFrame; // render only
            // 如果最开始不显示，则不显示，应该还是数据分离后的问题
            dynamicAtlasManager.packToDynamicAtlas(comp, style.spriteFrame); // 效果有问题，应该还是数据串了
        }
        style.color.set(comp.color); // render only
    },

    updateLayoutData (comp: Label): void {
        if (comp.layoutDirty) {
            const trans = comp.node._uiProps.uiTransformComp!;
            const processing = TextProcessing.instance;
            const style = comp.textStyle;
            const layout = comp.textLayout;
            const outputLayoutData = comp.textLayoutData;
            style.fontScale = view.getScaleX();

            this.updateLayoutProcessingData(style, layout, outputLayoutData, comp, trans);

            // TextProcessing
            processing.processingString(true, style, layout, outputLayoutData, comp.string);

            comp.actualFontSize = style.actualFontSize;
            trans.setContentSize(outputLayoutData.nodeContentSize);

            comp._resetLayoutDirty();
        }
    },

    updateRenderData (comp: Label): void {
        if (!comp.renderData) {
            return;
        }

        if (comp.renderData.vertDirty) {
            const renderData = comp.renderData;
            const processing = TextProcessing.instance;
            const style = comp.textStyle;
            const layout = comp.textLayout;
            const outputLayoutData = comp.textLayoutData;
            const outputRenderData = comp.textRenderData;
            const anchor = comp.node._uiProps.uiTransformComp!.anchorPoint;
            this.updateRenderProcessingData(style, outputRenderData, comp, anchor);

            // generateVertex
            this.resetRenderData(comp);
            outputRenderData.quadCount = 0;
            processing.generateRenderInfo(
                true,
                style,
                layout,
                outputLayoutData,
                outputRenderData,
                comp.string,
                this.generateVertexData,
            );

            renderData.dataLength = outputRenderData.quadCount;
            renderData.resize(renderData.dataLength, renderData.dataLength / 2 * 3);
            const datalist = renderData.data;
            for (let i = 0, l = outputRenderData.quadCount; i < l; i++) {
                datalist[i] = outputRenderData.vertexBuffer[i];
            }

            const indexCount = renderData.indexCount;
            this.createQuadIndices(indexCount);
            renderData.chunk.setIndexBuffer(QUAD_INDICES);

            this.updateUVs(comp);// dirty need
            this.updateColor(comp); // dirty need

            renderData.vertDirty = false;
        }

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    updateUVs (label: Label): void {
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

    updateColor (label: Label): void {
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

    resetRenderData (comp: Label): void {
        const renderData = comp.renderData!;
        renderData.dataLength = 0;
        renderData.resize(0, 0);
    },

    // callBack function
    generateVertexData (
        style: TextStyle,
        outputLayoutData: TextOutputLayoutData,
        outputRenderData: TextOutputRenderData,
        offset: number,
        spriteFrame: SpriteFrame,
        rect: Rect,
        rotated: boolean,
        x: number,
        y: number,
    ): void {
        const dataOffset = offset;
        const scale = style.bmfontScale;

        const dataList = outputRenderData.vertexBuffer;
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

    createQuadIndices (indexCount): void {
        if (indexCount % 6 !== 0) {
            error('illegal index count!');
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
