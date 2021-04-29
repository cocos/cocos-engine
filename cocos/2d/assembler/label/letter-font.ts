/*
 Copyright (c) 2018-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @hidden
 */
import { assetManager } from '../../../core/asset-manager';
import { mixin } from '../../../core/utils/js';
import { Label, LabelOutline } from '../../components';
import { bmfontUtils } from './bmfontUtils';
import { shareLabelInfo, LetterAtlas, computeHash } from './font-utils';

const _atlasWidth = 1024;
const _atlasHeight = 1024;
const _isBold = false;

let _shareAtlas: LetterAtlas | null  = null;

export const letterFont = mixin(bmfontUtils, {
    getAssemblerData () {
        if (!_shareAtlas) {
            _shareAtlas = new LetterAtlas(_atlasWidth, _atlasHeight);
        }

        return _shareAtlas.getTexture();
    },

    _updateFontFamily (comp) {
        shareLabelInfo.fontAtlas = _shareAtlas;
        shareLabelInfo.fontFamily = this._getFontFamily(comp);

        // outline
        const outline = comp.getComponent(LabelOutline);
        if (outline && outline.enabled) {
            shareLabelInfo.isOutlined = true;
            shareLabelInfo.margin = outline.width;
            shareLabelInfo.out = outline.color.clone();
            shareLabelInfo.out.a = outline.color.a * comp.color.a / 255.0;
        } else {
            shareLabelInfo.isOutlined = false;
            shareLabelInfo.margin = 0;
        }
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

    _updateLabelInfo (comp) {
        shareLabelInfo.fontDesc = this._getFontDesc();
        shareLabelInfo.color = comp.color;
        shareLabelInfo.hash = computeHash(shareLabelInfo);
    },

    _getFontDesc () {
        let fontDesc = `${shareLabelInfo.fontSize.toString()}px `;
        fontDesc += shareLabelInfo.fontFamily;
        if (_isBold) {
            fontDesc = `bold ${fontDesc}`;
        }

        return fontDesc;
    },
    _computeHorizontalKerningForText () {},
    _determineRect (tempRect) {
        return false;
    },
});
