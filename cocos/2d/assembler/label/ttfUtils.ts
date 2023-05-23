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
        data.outputLayoutData.nodeContentSize.width = data.outputLayoutData.canvasSize.width = trans.width;
        data.outputLayoutData.nodeContentSize.height = data.outputLayoutData.canvasSize.height = trans.height;
        // layout info
        data.inputString = comp.string; // both
        data.layout.lineHeight = comp.lineHeight; // both
        data.layout.overFlow = comp.overflow; // layout only // but change render
        if (comp.overflow === Overflow.NONE) {
            data.layout.wrapping = false;
        } else if (comp.overflow === Overflow.RESIZE_HEIGHT) {
            data.layout.wrapping = true;
        } else {
            data.layout.wrapping = comp.enableWrapText; // layout only // but change render
        }

        // effect info // both
        data.style.isBold = comp.isBold;
        data.style.isItalic = comp.isItalic;
        data.style.isUnderline = comp.isUnderline;
        data.style.underlineHeight = comp.underlineHeight;

        // outline// both
        let outlineComp = LabelOutline && comp.getComponent(LabelOutline);
        outlineComp = (outlineComp && outlineComp.enabled && outlineComp.width > 0) ? outlineComp : null;
        if (outlineComp) {
            data.style.isOutlined = true;
            data.style.outlineColor.set(outlineComp.color);
            data.style.outlineWidth = outlineComp.width;
        } else {
            data.style.isOutlined = false;
        }

        // shadow// both
        let shadowComp = LabelShadow && comp.getComponent(LabelShadow);
        shadowComp = (shadowComp && shadowComp.enabled) ? shadowComp : null;
        if (shadowComp) {
            data.style.hasShadow = true;
            data.style.shadowColor.set(shadowComp.color);
            data.style.shadowBlur = shadowComp.blur;
            data.style.shadowOffsetX = shadowComp.offset.x;
            data.style.shadowOffsetY = shadowComp.offset.y;
        } else {
            data.style.hasShadow = false;
        }

        // render info
        data.color.set(comp.color);// may opacity bug // render Only
        data.outputRenderData.texture = comp.spriteFrame; // render Only
        data.outputRenderData.uiTransAnchorX = trans.anchorX; // render Only
        data.outputRenderData.uiTransAnchorY = trans.anchorY; // render Only

        data.layout.hAlign = comp.horizontalAlign; // render Only
        data.layout.vAlign = comp.verticalAlign; // render Only
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
            // use canvas in assemblerData // to do to optimize
            processing.setCanvasUsed(comp.assemblerData!.canvas, comp.assemblerData!.context);
            data.fontFamily = this._updateFontFamily(comp);

            // TextProcessing
            processing.processingString(data);
            processing.generateRenderInfo(data, this.generateVertexData);

            const renderData = comp.renderData;
            renderData.textureDirty = true;
            this._calDynamicAtlas(comp, data);

            comp.actualFontSize = data.actualFontSize;
            trans.setContentSize(data.outputLayoutData.canvasSize);

            const datalist = renderData.data;
            datalist[0] = data.outputRenderData.vertexBuffer[0];
            datalist[1] = data.outputRenderData.vertexBuffer[1];
            datalist[2] = data.outputRenderData.vertexBuffer[2];
            datalist[3] = data.outputRenderData.vertexBuffer[3];

            this.updateUVs(comp);
            comp.renderData.vertDirty = false;
            comp.contentWidth = data.outputLayoutData.nodeContentSize.width;
        }

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    // callBack function
    generateVertexData (info: TextProcessData) {
        const data = info.outputRenderData.vertexBuffer;

        const width = info.outputLayoutData.canvasSize.width;
        const height = info.outputLayoutData.canvasSize.height;
        const appX = info.outputRenderData.uiTransAnchorX * width;
        const appY = info.outputRenderData.uiTransAnchorY * height;

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
        if (comp.cacheMode !== Label.CacheMode.BITMAP || data.outputLayoutData.canvasSize.width <= 0 || data.outputLayoutData.canvasSize.height <= 0) return;
        const frame = comp.ttfSpriteFrame!;
        dynamicAtlasManager.packToDynamicAtlas(comp, frame);
        // TODO update material and uv
    },
};
