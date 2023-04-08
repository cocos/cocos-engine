/*
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
import { Label, LabelOutline, LabelShadow } from '../../components';
import { ISharedLabelData } from './font-utils';
import { UITransform } from '../../framework/ui-transform';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { TextProcessing } from './text-processing';
import { TextProcessData } from './text-process-data';

const Overflow = Label.Overflow;

export const ttfUtils =  {

    updateProcessingData (data: TextProcessData, comp: Label, trans: UITransform) {
        // font info // both
        // data._font = comp.font;
        data.isSystemFontUsed = comp.useSystemFont;
        data.fontSize = comp.fontSize;

        // node info // both
        data.nodeContentSize.width = data.canvasSize.width = trans.width;
        data.nodeContentSize.height = data.canvasSize.height = trans.height;
        // layout info
        data.inputString = comp.string; // both
        data.lineHeight = comp.lineHeight; // both
        data.overFlow = comp.overflow; // layout only // but change render
        if (comp.overflow === Overflow.NONE) {
            data.wrapping = false;
        } else if (comp.overflow === Overflow.RESIZE_HEIGHT) {
            data.wrapping = true;
        } else {
            data.wrapping = comp.enableWrapText; // layout only // but change render
        }

        // effect info // both
        data.isBold = comp.isBold;
        data.isItalic = comp.isItalic;
        data.isUnderline = comp.isUnderline;
        data.underlineHeight = comp.underlineHeight;

        // outline// both
        let outlineComp = LabelOutline && comp.getComponent(LabelOutline);
        outlineComp = (outlineComp && outlineComp.enabled && outlineComp.width > 0) ? outlineComp : null;
        if (outlineComp) {
            data.isOutlined = true;
            data.outlineColor.set(outlineComp.color);
            data.outlineWidth = outlineComp.width;
        } else {
            data.isOutlined = false;
        }

        // shadow// both
        let shadowComp = LabelShadow && comp.getComponent(LabelShadow);
        shadowComp = (shadowComp && shadowComp.enabled) ? shadowComp : null;
        if (shadowComp) {
            data.hasShadow = true;
            data.shadowColor.set(shadowComp.color);
            data.shadowBlur = shadowComp.blur;
            data.shadowOffsetX = shadowComp.offset.x;
            data.shadowOffsetY = shadowComp.offset.y;
        } else {
            data.hasShadow = false;
        }

        // render info
        data.color.set(comp.color);// may opacity bug // render Only
        data.texture = comp.spriteFrame; // render Only

        data.hAlign = comp.horizontalAlign; // render Only
        data.vAlign = comp.verticalAlign; // render Only
    },

    getAssemblerData () {
        const sharedLabelData = Label._canvasPool.get();
        sharedLabelData.canvas.width = sharedLabelData.canvas.height = 1;
        return sharedLabelData;
    },

    resetAssemblerData (assemblerData: ISharedLabelData) {
        if (assemblerData) {
            Label._canvasPool.put(assemblerData);
        }
    },

    updateRenderData (comp: Label) {
        if (!comp.renderData) { return; }

        if (comp.renderData.vertDirty) {
            const trans = comp.node._uiProps.uiTransformComp!;
            const processing = TextProcessing.instance;
            const data = comp.processingData;
            data.isBmFont = false; // hard code
            this.updateProcessingData(data, comp, trans);
            data.fontFamily = this._updateFontFamily(comp);

            // TextProcessing
            processing.processingString(data);
            processing.generateRenderInfo(data, this.generateVertexData);

            const renderData = comp.renderData;
            renderData.textureDirty = true;
            this._calDynamicAtlas(comp, data);

            comp.actualFontSize = data.actualFontSize;
            trans.setContentSize(data.canvasSize);

            const datalist = renderData.data;
            datalist[0] = data.vertexBuffer[0];
            datalist[1] = data.vertexBuffer[1];
            datalist[2] = data.vertexBuffer[2];
            datalist[3] = data.vertexBuffer[3];

            this.updateUVs(comp);
            comp.renderData.vertDirty = false;
            comp.contentWidth = data.nodeContentSize.width;
        }

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    // callBack function
    generateVertexData (info: TextProcessData) {
        const data = info.vertexBuffer;

        const width = info.canvasSize.width;
        const height = info.canvasSize.height;
        const appX = info.uiTransAnchorX * width;
        const appY = info.uiTransAnchorY * height;

        data[0].x = -appX; // l
        data[0].y = -appY; // b
        data[1].x = width - appX; // r
        data[1].y = -appY; // b
        data[2].x = -appX; // l
        data[2].y = height - appY; // t
        data[3].x = width - appX; // r
        data[3].y = height - appY; // t
    },

    updateVertexData (comp: Label) {
    },

    updateUVs (comp: Label) {
    },

    _updateFontFamily (comp: Label) {
        let _fontFamily = '';
        if (!comp.useSystemFont) {
            if (comp.font) {
                _fontFamily = comp.font._nativeAsset || 'Arial';
            } else {
                _fontFamily = 'Arial';
            }
        } else {
            _fontFamily = comp.fontFamily || 'Arial';
        }
        return _fontFamily;
    },

    _calDynamicAtlas (comp: Label, data: TextProcessData) {
        if (comp.cacheMode !== Label.CacheMode.BITMAP || data.canvasSize.width <= 0 || data.canvasSize.height <= 0) return;
        const frame = comp.ttfSpriteFrame!;
        dynamicAtlasManager.packToDynamicAtlas(comp, frame);
        // TODO update material and uv
    },
};
