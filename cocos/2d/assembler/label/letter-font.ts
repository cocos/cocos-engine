/*
 Copyright (c) 2018-2023 Xiamen Yaji Software Co., Ltd.

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

import { js } from '../../../core';
import { Label, LabelOutline, Overflow } from '../../components';
import { UITransform } from '../../framework/ui-transform';
import { bmfontUtils } from './bmfontUtils';
import { shareLabelInfo, LetterAtlas, computeHash } from './font-utils';
import { TextLayout } from './text-layout';
import { TextOutputLayoutData } from './text-output-data';
import { TextStyle } from './text-style';

const _atlasWidth = 1024;
const _atlasHeight = 1024;
const _isBold = false;

let _shareAtlas: LetterAtlas | null  = null;

export const letterFont = js.mixin(bmfontUtils, {
    getAssemblerData () {
        if (!_shareAtlas) {
            _shareAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
        }

        return _shareAtlas.getTexture();
    },

    _getFontFamily (comp: Label) {
        let fontFamily = 'Arial';
        if (!comp.useSystemFont) {
            if (comp.font) {
                fontFamily = comp.font._nativeAsset || 'Arial';
            }
        } else {
            fontFamily = comp.fontFamily || 'Arial';
        }

        return fontFamily;
    },

    _getFontDesc () {
        let fontDesc = `${shareLabelInfo.fontSize.toString()}px `;
        fontDesc += shareLabelInfo.fontFamily;
        if (_isBold) {
            fontDesc = `bold ${fontDesc}`;
        }

        return fontDesc;
    },

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

        style.fontAtlas = _shareAtlas;
        shareLabelInfo.fontFamily = this._getFontFamily(comp);

        // outline
        let margin = 0;
        const outline = comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            shareLabelInfo.isOutlined = true;
            margin = outline.width;
            style.outlineWidth = outline.width;
            shareLabelInfo.out = outline.color.clone();
            shareLabelInfo.out.a = outline.color.a * comp.color.a / 255.0;
        } else {
            shareLabelInfo.isOutlined = false;
            style.outlineWidth = 0;
            margin = 0;
        }

        // should wrap text
        if (overflow === Overflow.NONE) {
            layout.wrapping = false; // both
            outputLayoutData.nodeContentSize.width += margin * 2; // 用于支持 char 模式的 outline 和 shadow
            outputLayoutData.nodeContentSize.height += margin * 2; // 用于支持 char 模式的 outline 和 shadow
        } else if (overflow === Overflow.RESIZE_HEIGHT) {
            layout.wrapping = true;
            outputLayoutData.nodeContentSize.height += margin * 2; // not for bmfont
        } else {
            layout.wrapping = comp.enableWrapText;
        }
        style.originFontSize = comp.fontSize; // not for bmfont
        shareLabelInfo.fontSize = comp.fontSize; // not for bmfont
        style.fontFamily = shareLabelInfo.fontFamily; // layout only
        style.fntConfig = null;

        shareLabelInfo.fontDesc = this._getFontDesc();
        shareLabelInfo.color = comp.color;
        style.hash = computeHash(shareLabelInfo); // todo, 要删掉 // 实际上也是数据集合而已

        // maybe useless
        style.fontDesc = shareLabelInfo.fontDesc;
    },
});
