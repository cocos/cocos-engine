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
const _canvas: HTMLCanvasElement | null = null;
let _fontFamily = '';

export const ttfUtils =  {

    updateProcessingData (data: TextProcessData, comp: Label, trans: UITransform) {
        // 字体信息 // both
        data._font = comp.font;
        data._isSystemFontUsed = comp.useSystemFont;
        data._fontSize = comp.fontSize; // 可能需要暴露下 shrink 模式下的实际字号？

        // node 相关信息 // both
        data._nodeContentSize.width = data._canvasSize.width = trans.width;
        data._nodeContentSize.height = data._canvasSize.height = trans.height;
        // 排版相关
        data.inputString = comp.string; // both
        data._lineHeight = comp.lineHeight; // both
        data._overFlow = comp.overflow; // layout only // 但是会导致 render
        if (comp.overflow === Overflow.NONE) {
            data._wrapping = false;
        } else if (comp.overflow === Overflow.RESIZE_HEIGHT) {
            data._wrapping = true;
        } else {
            data._wrapping = comp.enableWrapText; // layout only // 但是会导致 render
        }

        // 后效相关 // both // 很奇怪，但是由于他会影响的还有canvas的宽度，所以是 both
        data.isBold = comp.isBold;
        data.isItalic = comp.isItalic;
        data.isUnderline = comp.isUnderline;
        data.underlineHeight = comp.underlineHeight;

        // outline// both // 很奇怪，但是由于他会影响的还有canvas的宽度，所以是 both
        let outlineComp = LabelOutline && comp.getComponent(LabelOutline);
        outlineComp = (outlineComp && outlineComp.enabled && outlineComp.width > 0) ? outlineComp : null;
        if (outlineComp) {
            data._isOutlined = true;
            data._outlineColor.set(outlineComp.color);
            data.outlineWidth = outlineComp.width;
        } else {
            data._isOutlined = false;
        }

        // shadow// both // 很奇怪，但是由于他会影响的还有canvas的宽度，所以是 both
        let shadowComp = LabelShadow && comp.getComponent(LabelShadow);
        shadowComp = (shadowComp && shadowComp.enabled) ? shadowComp : null;
        if (shadowComp) {
            data._hasShadow = true;
            data.shadowColor.set(shadowComp.color);
            data.shadowBlur = shadowComp.blur;
            data.shadowOffsetX = shadowComp.offset.x;
            data.shadowOffsetY = shadowComp.offset.y;
        } else {
            data._hasShadow = false;
        }

        // 渲染相关
        data._color = comp.color;// 级联可能有问题 // render Only
        data._texture = comp.spriteFrame; // render Only

        data._hAlign = comp.horizontalAlign; // render Only
        data._vAlign = comp.verticalAlign; // render Only
        // 差一个 alpha
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

        // 需要使用 vertexDirty
        const trans = comp.node._uiProps.uiTransformComp!;
        const processing = TextProcessing.instance;
        const data = comp.processingData;
        this.updateProcessingData(data, comp, trans);// 同步信息
        // hack
        const fontFamily = this._updateFontFamily(comp);
        data._fontFamily = fontFamily; // 外部不应该操作 data，集中于处理器内部最好

        // TextProcessing
        processing.processingString(data);// 可以填 out // 用一个flag来避免排版的更新，比如 renderDirtyOnly
        processing.generateRenderInfo(data, this.generateVertexData); // 传个方法进去

        const renderData = comp.renderData;
        renderData.textureDirty = true;
        this._calDynamicAtlas(comp); // need // 存在数据同步问题

        // comp.actualFontSize = _fontSize;
        trans.setContentSize(data._canvasSize);

        // this.updateVertexData(comp); // 合并到了 generateRenderInfo 中
        if (!renderData) {
            return;
        }
        const datalist = renderData.data;
        datalist[0] = data.vertexBuffer[0];
        datalist[1] = data.vertexBuffer[1];
        datalist[2] = data.vertexBuffer[2];
        datalist[3] = data.vertexBuffer[3];

        this.updateUVs(comp);
        comp.renderData.vertDirty = false;
        comp.contentWidth = data._nodeContentSize.width;

        if (comp.spriteFrame) {
            const renderData = comp.renderData;
            renderData.updateRenderData(comp, comp.spriteFrame);
        }
    },

    // callBack function
    generateVertexData (info: TextProcessData) {
        const data = info.vertexBuffer; // 需要预先知道格式和长度，可以考虑只保存基础的 xyzuv

        // 此后的部分处理会有区别，怎么对接？
        const width = info._canvasSize.width;
        const height = info._canvasSize.height;
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

    // 可能要挪到 processing 中
    _calDynamicAtlas (comp: Label) {
        if (comp.cacheMode !== Label.CacheMode.BITMAP || !_canvas || _canvas.width <= 0 || _canvas.height <= 0) return;
        const frame = comp.ttfSpriteFrame!;
        dynamicAtlasManager.packToDynamicAtlas(comp, frame);
        // TODO update material and uv
    },
};
