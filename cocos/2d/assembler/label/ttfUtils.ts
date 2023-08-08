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
import { TextOutputLayoutData, TextOutputRenderData } from './text-output-data';
import { TextStyle } from './text-style';
import { TextLayout } from './text-layout';
import { view } from '../../../ui/view';
import { Vec2 } from '../../../core/math';

const Overflow = Label.Overflow;

export const ttfUtils =  {

    updateLayoutProcessingData (
        style: TextStyle,
        layout: TextLayout,
        outputLayoutData: TextOutputLayoutData,
        comp: Label,
        trans: UITransform,
    ): void {
        // font info // both
        style.isSystemFontUsed = comp.useSystemFont; // both
        style.fontSize = comp.fontSize; // both

        // layout info
        layout.lineHeight = comp.lineHeight; // both
        layout.overFlow = comp.overflow; // layout only
        if (comp.overflow === Overflow.NONE) {
            layout.wrapping = false;
        } else if (comp.overflow === Overflow.RESIZE_HEIGHT) {
            layout.wrapping = true;
        } else {
            layout.wrapping = comp.enableWrapText; // layout only
        }

        // effect info // both
        style.isBold = comp.isBold;
        style.isItalic = comp.isItalic;

        // outline // both
        let outlineComp = LabelOutline && comp.getComponent(LabelOutline);
        outlineComp = (outlineComp && outlineComp.enabled && outlineComp.width > 0) ? outlineComp : null;
        if (outlineComp) {
            style.isOutlined = true;
            style.outlineColor.set(outlineComp.color);
            style.outlineWidth = outlineComp.width;
        } else {
            style.isOutlined = false;
        }

        // shadow // both
        let shadowComp = LabelShadow && comp.getComponent(LabelShadow);
        shadowComp = (shadowComp && shadowComp.enabled) ? shadowComp : null;
        if (shadowComp) {
            style.hasShadow = true;
            style.shadowColor.set(shadowComp.color);
            style.shadowBlur = shadowComp.blur;
            style.shadowOffsetX = shadowComp.offset.x;
            style.shadowOffsetY = shadowComp.offset.y;
        } else {
            style.hasShadow = false;
        }

        layout.horizontalAlign = comp.horizontalAlign; // both
        layout.verticalAlign = comp.verticalAlign; // both

        // node info // both
        outputLayoutData.nodeContentSize.width = outputLayoutData.canvasSize.width = trans.width;
        outputLayoutData.nodeContentSize.height = outputLayoutData.canvasSize.height = trans.height;
    },

    // render Only
    updateRenderProcessingData (
        style: TextStyle,
        outputRenderData: TextOutputRenderData,
        comp: Label,
        anchor: Readonly<Vec2>,
    ): void {
        style.isUnderline = comp.isUnderline;
        style.underlineHeight = comp.underlineHeight;

        // render info
        style.color.set(comp.color);
        outputRenderData.texture = comp.spriteFrame;
        outputRenderData.uiTransAnchorX = anchor.x;
        outputRenderData.uiTransAnchorY = anchor.y;
    },

    getAssemblerData (): ISharedLabelData {
        const sharedLabelData = Label._canvasPool.get();
        sharedLabelData.canvas.width = sharedLabelData.canvas.height = 1;
        return sharedLabelData;
    },

    resetAssemblerData (assemblerData: ISharedLabelData): void {
        if (assemblerData) {
            Label._canvasPool.put(assemblerData);
        }
    },

    updateLayoutData (comp: Label): void {
        if (comp.layoutDirty && comp.assemblerData) {
            const trans = comp.node._uiProps.uiTransformComp!;
            const processing = TextProcessing.instance;
            const style = comp.textStyle;
            const layout = comp.textLayout;
            const outputLayoutData = comp.textLayoutData;
            style.fontScale = view.getScaleX();
            this.updateLayoutProcessingData(style, layout, outputLayoutData, comp, trans);
            // use canvas in assemblerData // to do to optimize
            processing.setCanvasUsed(comp.assemblerData.canvas, comp.assemblerData.context);
            style.fontFamily = this._updateFontFamily(comp);

            // TextProcessing
            processing.processingString(false, style, layout, outputLayoutData, comp.string);
            comp.actualFontSize = style.actualFontSize;
            trans.setContentSize(outputLayoutData.nodeContentSize);
            comp.contentWidth = outputLayoutData.nodeContentSize.width;
            comp._resetLayoutDirty();
        }
    },

    updateRenderData (comp: Label): void {
        if (!comp.renderData) { return; }

        if (comp.renderData.vertDirty) {
            const processing = TextProcessing.instance;
            const style = comp.textStyle;
            const layout = comp.textLayout;
            const outputLayoutData = comp.textLayoutData;
            const outputRenderData = comp.textRenderData;
            const anchor = comp.node._uiProps.uiTransformComp!.anchorPoint;
            this.updateRenderProcessingData(style, outputRenderData, comp, anchor);

            this._resetDynamicAtlas(comp);

            processing.setCanvasUsed(comp.assemblerData!.canvas, comp.assemblerData!.context);
            processing.generateRenderInfo(false, style, layout, outputLayoutData, outputRenderData, comp.string, this.generateVertexData);

            const renderData = comp.renderData;
            renderData.textureDirty = true;
            this._calDynamicAtlas(comp, outputLayoutData);

            const datalist = renderData.data;
            datalist[0] = outputRenderData.vertexBuffer[0];
            datalist[1] = outputRenderData.vertexBuffer[1];
            datalist[2] = outputRenderData.vertexBuffer[2];
            datalist[3] = outputRenderData.vertexBuffer[3];

            this.updateUVs(comp);
            comp.renderData.vertDirty = false;
        }

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    // callBack function
    generateVertexData (style: TextStyle, outputLayoutData: TextOutputLayoutData, outputRenderData: TextOutputRenderData): void {
        const data = outputRenderData.vertexBuffer;

        const width = outputLayoutData.nodeContentSize.width;
        const height = outputLayoutData.nodeContentSize.height;
        const appX = outputRenderData.uiTransAnchorX * width;
        const appY = outputRenderData.uiTransAnchorY * height;

        data[0].x = -appX; // l
        data[0].y = -appY; // b
        data[1].x = width - appX; // r
        data[1].y = -appY; // b
        data[2].x = -appX; // l
        data[2].y = height - appY; // t
        data[3].x = width - appX; // r
        data[3].y = height - appY; // t
    },

    updateVertexData (comp: Label): void {
    },

    updateUVs (comp: Label): void {
    },

    _updateFontFamily (comp: Label): string {
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

    _calDynamicAtlas (comp: Label, outputLayoutData: TextOutputLayoutData): void {
        if (comp.cacheMode !== Label.CacheMode.BITMAP || outputLayoutData.canvasSize.width <= 0 || outputLayoutData.canvasSize.height <= 0) return;
        const frame = comp.ttfSpriteFrame!;
        dynamicAtlasManager.packToDynamicAtlas(comp, frame);
        // TODO update material and uv
    },

    _resetDynamicAtlas (comp: Label): void {
        if (comp.cacheMode !== Label.CacheMode.BITMAP) return;
        const frame = comp.ttfSpriteFrame!;
        dynamicAtlasManager.deleteAtlasSpriteFrame(frame);
        frame._resetDynamicAtlasFrame();
    },
};
