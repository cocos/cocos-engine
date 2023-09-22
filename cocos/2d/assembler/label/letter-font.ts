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
import { LetterAtlas, computeHash } from './font-utils';
import { TextLayout } from './text-layout';
import { TextOutputLayoutData } from './text-output-data';
import { TextStyle } from './text-style';

const _atlasWidth = 1024;
const _atlasHeight = 1024;

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

    _getFontDesc (fontSize: number, fontFamily: string) {
        let fontDesc = `${fontSize.toString()}px `;
        fontDesc += fontFamily;

        return fontDesc;
    },

    updateLayoutProcessingData (
        style: TextStyle,
        layout: TextLayout,
        outputLayoutData: TextOutputLayoutData,
        comp: Label,
        trans: UITransform,
    ): void {
        style.fontSize = comp.fontSize;
        style.actualFontSize = comp.fontSize;
        layout.horizontalAlign = comp.horizontalAlign;
        layout.verticalAlign = comp.verticalAlign;
        layout.spacingX = comp.spacingX;
        const overflow = comp.overflow;

        outputLayoutData.nodeContentSize.width = trans.width;
        outputLayoutData.nodeContentSize.height = trans.height;
        layout.overFlow = overflow;
        layout.lineHeight = comp.lineHeight;

        style.fontAtlas = _shareAtlas;
        style.fontFamily = this._getFontFamily(comp);

        // outline
        let margin = 0;
        const isOutlined = comp.enableOutline && comp.outlineWidth > 0;
        if (isOutlined) {
            style.isOutlined = true;
            margin = comp.outlineWidth;
            style.outlineWidth = comp.outlineWidth;
            style.outlineColor = comp.outlineColor.clone();
            style.outlineColor.a = comp.outlineColor.a * comp.color.a / 255.0;
        } else {
            style.outlineWidth = 0;
            style.isOutlined = false;
            margin = 0;
        }

        // should wrap text
        if (overflow === Overflow.NONE) {
            layout.wrapping = false; // both
            outputLayoutData.nodeContentSize.width += margin * 2;
            outputLayoutData.nodeContentSize.height += margin * 2;
        } else if (overflow === Overflow.RESIZE_HEIGHT) {
            layout.wrapping = true;
            outputLayoutData.nodeContentSize.height += margin * 2;
        } else {
            layout.wrapping = comp.enableWrapText;
        }
        style.originFontSize = comp.fontSize;
        style.fntConfig = null;

        style.fontDesc = this._getFontDesc(style.fontSize, style.fontFamily);
        style.color.set(comp.color);
        style.hash = computeHash(style.color, style.isOutlined, style.outlineWidth, style.outlineColor, style.fontSize, style.fontFamily);
    },
});
