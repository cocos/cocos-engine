/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { screenAdapter } from 'pal/screen-adapter';
import { BitmapFont, IConfig, FontLetterDefinition } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';
import { isUnicodeCJK, isUnicodeSpace } from '../../utils/text-utils';
import { Rect, Size, Vec2 } from '../../../core/math';
import { HorizontalTextAlignment, VerticalTextAlignment, Label, Overflow } from '../../components/label';
import { UITransform } from '../../framework/ui-transform';
import { shareLabelInfo } from './font-utils';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';

class LetterInfo {
    public char = '';
    public valid = true;
    public x = 0;
    public y = 0;
    public line = 0;
    public hash = '';
}

const _tmpRect = new Rect();

let _comp: Label | null = null;
let _uiTrans: UITransform | null = null;

const _horizontalKerning: number[] = [];
const _lettersInfo: LetterInfo[] = [];
const _linesWidth: number[] = [];
const _linesOffsetX: number[] = [];
const _labelDimensions = new Size();
const _lineBreakWithoutSpaces = false;
const _contentSize = new Size();
const letterPosition = new Vec2();
const _lineSpacing = 0;

let _fntConfig: IConfig | null = null;
let _numberOfLines = 0;
let _textDesiredHeight = 0;
let _letterOffsetY = 0;
let _tailoredTopY = 0;
let _tailoredBottomY = 0;
let _bmfontScale = 1.0;
let _spriteFrame: SpriteFrame|null = null;
let _string = '';
let _fontSize = 0;
let _originFontSize = 0;
let _hAlign = 0;
let _vAlign = 0;
let _spacingX = 0;
let _lineHeight = 0;
let _overflow = 0;
let _isWrapText = false;
let _labelWidth = 0;
let _labelHeight = 0;
let _maxLineWidth = 0;
let _enableDpr = false;
let _dpr = 1;

export const bmfontUtils = {
    enableDpr (v: boolean) {
        _enableDpr = v;
    },
    updateRenderData (comp: Label) {
        if (!comp.renderData) {
            return;
        }

        if (_comp === comp) { return; }

        if (comp.font instanceof BitmapFont) {
            _dpr = 1;
        } else {
            _dpr = Math.min(Math.ceil(screenAdapter.devicePixelRatio), 2);
        }

        if (comp.renderData.vertDirty) {
            _comp = comp;
            _uiTrans = _comp.node._uiProps.uiTransformComp!;
            this._updateFontFamily(comp);
            this._updateProperties(comp);
            this._updateLabelInfo(comp);
            this._updateContent();

            _comp.actualFontSize = _fontSize;
            _uiTrans.setContentSize(_contentSize);
            this.updateUVs(comp);

            _comp.renderData!.vertDirty = false;
            // fix bmfont run updateRenderData twice bug
            _comp.markForUpdateRenderData(false);

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

    _updateFontScale () {
        _bmfontScale = _fontSize / _originFontSize;
    },

    _updateFontFamily (comp) {
        const fontAsset = comp.font;
        _spriteFrame = fontAsset.spriteFrame;
        _fntConfig = fontAsset.fntConfig;
        shareLabelInfo.fontAtlas = fontAsset.fontDefDictionary;

        dynamicAtlasManager.packToDynamicAtlas(comp, _spriteFrame);
        // TODO update material and uv
    },

    _updateLabelInfo (comp) {
        // clear
        shareLabelInfo.hash = '';
        shareLabelInfo.margin = 0;
    },

    _updateProperties (comp) {
        _string = comp.string.toString();
        _fontSize = comp.fontSize;
        _originFontSize = _fntConfig ? _fntConfig.fontSize : comp.fontSize;
        if (_enableDpr) _originFontSize *= _dpr;
        _hAlign = comp.horizontalAlign;
        _vAlign = comp.verticalAlign;
        _spacingX = comp.spacingX;
        _overflow = comp.overflow;
        _lineHeight = comp._lineHeight;

        const contentSize = _uiTrans!.contentSize;
        _contentSize.width = contentSize.width;
        _contentSize.height = contentSize.height;

        // should wrap text
        if (_overflow === Overflow.NONE) {
            _isWrapText = false;
            _contentSize.width += shareLabelInfo.margin * 2;
            _contentSize.height += shareLabelInfo.margin * 2;
        } else if (_overflow === Overflow.RESIZE_HEIGHT) {
            _isWrapText = true;
            _contentSize.height += shareLabelInfo.margin * 2;
        } else {
            _isWrapText = comp.enableWrapText;
        }

        shareLabelInfo.lineHeight = _lineHeight;
        shareLabelInfo.fontSize = _fontSize;

        this._setupBMFontOverflowMetrics();
    },

    _resetProperties () {
        _fntConfig = null;
        _spriteFrame = null;
        shareLabelInfo.hash = '';
        shareLabelInfo.margin = 0;
    },

    _updateContent () {
        this._updateFontScale();
        this._computeHorizontalKerningForText();
        this._alignText();
    },

    _computeHorizontalKerningForText () {
        const string = _string;
        const stringLen = string.length;

        const kerningDict = _fntConfig!.kerningDict;
        const horizontalKerning = _horizontalKerning;

        let prev = -1;
        for (let i = 0; i < stringLen; ++i) {
            const key = string.charCodeAt(i);
            const kerningAmount = kerningDict[(prev << 16) | (key & 0xffff)] || 0;
            if (i < stringLen - 1) {
                horizontalKerning[i] = kerningAmount;
            } else {
                horizontalKerning[i] = 0;
            }
            prev = key;
        }
    },

    _multilineTextWrap (nextTokenFunc: (arg0: string, arg1: number, arg2: number) => number) {
        const textLen = _string.length;

        let lineIndex = 0;
        let nextTokenX = 0;
        let nextTokenY = 0;
        let longestLine = 0;
        let letterRight = 0;

        let highestY = 0;
        let lowestY = 0;
        let letterDef: FontLetterDefinition | null = null;

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === '\n') {
                _linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= _lineHeight * this._getFontScale() + _lineSpacing;
                this._recordPlaceholderInfo(index, character);
                index++;
                continue;
            }

            const tokenLen = nextTokenFunc(_string, index, textLen);
            let tokenHighestY = highestY;
            let tokenLowestY = lowestY;
            let tokenRight = letterRight;
            let nextLetterX = nextTokenX;
            let newLine = false;

            for (let tmp = 0; tmp < tokenLen; ++tmp) {
                const letterIndex = index + tmp;
                character = _string.charAt(letterIndex);
                if (character === '\r') {
                    this._recordPlaceholderInfo(letterIndex, character);
                    continue;
                }
                letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(character, shareLabelInfo);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    console.log(`Can't find letter definition in texture atlas ${
                        _fntConfig!.atlasName} for letter:${character}`);
                    continue;
                }

                const letterX = nextLetterX + letterDef.offsetX * _bmfontScale - shareLabelInfo.margin;

                if (_isWrapText
                    && _maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.w * _bmfontScale > _maxLineWidth
                    && !isUnicodeSpace(character)) {
                    _linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (_lineHeight * this._getFontScale() + _lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < _horizontalKerning.length && letterIndex < textLen - 1) {
                    nextLetterX += _horizontalKerning[letterIndex + 1];
                }

                nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

                tokenRight = letterPosition.x + letterDef.w * _bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.h * _bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.h * _bmfontScale;
                }
            } // end of for loop

            if (newLine) { continue; }

            nextTokenX = nextLetterX;
            letterRight = tokenRight;

            if (highestY < tokenHighestY) {
                highestY = tokenHighestY;
            }
            if (lowestY > tokenLowestY) {
                lowestY = tokenLowestY;
            }
            if (longestLine < letterRight) {
                longestLine = letterRight;
            }

            index += tokenLen;
        } // end of for loop

        _linesWidth.push(letterRight);

        _numberOfLines = lineIndex + 1;
        _textDesiredHeight = _numberOfLines * _lineHeight * this._getFontScale();
        if (_numberOfLines > 1) {
            _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
        }

        _contentSize.width = _labelWidth;
        _contentSize.height = _labelHeight;
        if (_labelWidth <= 0) {
            _contentSize.width = parseFloat(longestLine.toFixed(2)) + shareLabelInfo.margin * 2;
        }
        if (_labelHeight <= 0) {
            _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2)) + shareLabelInfo.margin * 2;
        }

        _tailoredTopY = _contentSize.height;
        _tailoredBottomY = 0;
        if (highestY > 0) {
            _tailoredTopY = _contentSize.height + highestY;
        }
        if (lowestY < -_textDesiredHeight) {
            _tailoredBottomY = _textDesiredHeight + lowestY;
        }

        return true;
    },

    _getFirstCharLen () {
        return 1;
    },

    _getFontScale () {
        return _overflow === Overflow.SHRINK ? _bmfontScale : 1;
    },

    _getFirstWordLen (text: string, startIndex: number, textLen: number) {
        let character = text.charAt(startIndex);
        if (isUnicodeCJK(character)
            || character === '\n'
            || isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        let letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(character, shareLabelInfo);
        if (!letterDef) {
            return len;
        }
        let nextLetterX = letterDef.xAdvance * _bmfontScale + _spacingX;
        let letterX = 0;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(character, shareLabelInfo);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

            if (letterX + letterDef.w * _bmfontScale > _maxLineWidth
                && !isUnicodeSpace(character)
                && _maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;
            if (character === '\n'
                || isUnicodeSpace(character)
                || isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    },

    _multilineTextWrapByWord () {
        return this._multilineTextWrap(this._getFirstWordLen);
    },

    _multilineTextWrapByChar () {
        return this._multilineTextWrap(this._getFirstCharLen);
    },

    _recordPlaceholderInfo (letterIndex: number, char: string) {
        if (letterIndex >= _lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }

        _lettersInfo[letterIndex].char = char;
        _lettersInfo[letterIndex].hash = `${char.charCodeAt(0)}${shareLabelInfo.hash}`;
        _lettersInfo[letterIndex].valid = false;
    },

    _recordLetterInfo (letterPosition: Vec2, character: string, letterIndex: number, lineIndex: number) {
        if (letterIndex >= _lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }

        const char = character.charCodeAt(0);
        const key = `${char}${shareLabelInfo.hash}`;

        _lettersInfo[letterIndex].line = lineIndex;
        _lettersInfo[letterIndex].char = character;
        _lettersInfo[letterIndex].hash = key;
        _lettersInfo[letterIndex].valid = shareLabelInfo.fontAtlas!.getLetter(key).valid;
        _lettersInfo[letterIndex].x = letterPosition.x;
        _lettersInfo[letterIndex].y = letterPosition.y;
    },

    _alignText () {
        _textDesiredHeight = 0;
        _linesWidth.length = 0;

        if (!_lineBreakWithoutSpaces) {
            this._multilineTextWrapByWord();
        } else {
            this._multilineTextWrapByChar();
        }

        this._computeAlignmentOffset();

        // shrink
        if (_overflow === Overflow.SHRINK) {
            if (_fontSize > 0 && this._isVerticalClamp()) {
                this._shrinkLabelToContentSize(this._isVerticalClamp);
            }
        }

        if (!this._updateQuads()) {
            if (_overflow === Overflow.SHRINK) {
                this._shrinkLabelToContentSize(this._isHorizontalClamp);
            }
        }
    },

    _scaleFontSizeDown (fontSize: number) {
        let shouldUpdateContent = true;
        if (!fontSize) {
            fontSize = 0.1;
            shouldUpdateContent = false;
        }
        _fontSize = fontSize;

        if (shouldUpdateContent) {
            this._updateContent();
        }
    },

    _shrinkLabelToContentSize (lambda: () => boolean) {
        const fontSize = _fontSize;

        let left = 0;
        let right = fontSize | 0;
        let mid = 0;
        while (left < right) {
            mid = (left + right + 1) >> 1;

            const newFontSize = mid;
            if (newFontSize <= 0) {
                break;
            }

            _bmfontScale = newFontSize / _originFontSize;

            if (!_lineBreakWithoutSpaces) {
                this._multilineTextWrapByWord();
            } else {
                this._multilineTextWrapByChar();
            }
            this._computeAlignmentOffset();

            if (lambda()) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }

        if (left >= 0) {
            this._scaleFontSizeDown(left);
        }
    },

    _isVerticalClamp () {
        if (_textDesiredHeight > _contentSize.height) {
            return true;
        } else {
            return false;
        }
    },

    _isHorizontalClamp () {
        let letterClamp = false;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = _lettersInfo[ctr];
            if (letterInfo.valid) {
                const letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(letterInfo.char, shareLabelInfo);
                if (!letterDef) {
                    continue;
                }

                const px = letterInfo.x + letterDef.w * _bmfontScale;
                const lineIndex = letterInfo.line;
                if (_labelWidth > 0) {
                    if (!_isWrapText) {
                        if (px > _contentSize.width) {
                            letterClamp = true;
                            break;
                        }
                    } else {
                        const wordWidth = _linesWidth[lineIndex];
                        if (wordWidth > _contentSize.width && (px > _contentSize.width || px < 0)) {
                            letterClamp = true;
                            break;
                        }
                    }
                }
            }
        }

        return letterClamp;
    },

    _isHorizontalClamped (px: number, lineIndex: number) {
        const wordWidth = _linesWidth[lineIndex];
        const letterOverClamp = (px > _contentSize.width || px < 0);

        if (!_isWrapText) {
            return letterOverClamp;
        } else {
            return (wordWidth > _contentSize.width && letterOverClamp);
        }
    },

    _updateQuads () {
        if (!_comp) {
            return false;
        }

        const texture =  _spriteFrame ? _spriteFrame.texture : shareLabelInfo.fontAtlas!.getTexture();
        const renderData = _comp.renderData!;
        renderData.dataLength = 0;
        renderData.resize(0, 0);
        const anchorPoint = _uiTrans!.anchorPoint;
        const contentSize = _contentSize;
        const appX = anchorPoint.x * contentSize.width;
        const appY = anchorPoint.y * contentSize.height;

        let ret = true;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = _lettersInfo[ctr];
            if (!letterInfo.valid) { continue; }
            const letterDef = shareLabelInfo.fontAtlas!.getLetter(letterInfo.hash);
            if (!letterDef) {
                console.warn('Can\'t find letter in this bitmap-font');
                continue;
            }

            _tmpRect.height = letterDef.h;
            _tmpRect.width = letterDef.w;
            _tmpRect.x = letterDef.u;
            _tmpRect.y = letterDef.v;

            let py = letterInfo.y + _letterOffsetY;

            if (_labelHeight > 0) {
                if (py > _tailoredTopY) {
                    const clipTop = py - _tailoredTopY;
                    _tmpRect.y += clipTop;
                    _tmpRect.height -= clipTop;
                    py -= clipTop;
                }

                if ((py - letterDef.h * _bmfontScale < _tailoredBottomY) && _overflow === Overflow.CLAMP) {
                    _tmpRect.height = (py < _tailoredBottomY) ? 0 : (py - _tailoredBottomY) / _bmfontScale;
                }
            }

            const lineIndex = letterInfo.line;
            const px = letterInfo.x + letterDef.w / 2 * _bmfontScale + _linesOffsetX[lineIndex];

            if (_labelWidth > 0) {
                if (this._isHorizontalClamped(px, lineIndex)) {
                    if (_overflow === Overflow.CLAMP) {
                        _tmpRect.width = 0;
                    } else if (_overflow === Overflow.SHRINK) {
                        if (_contentSize.width > letterDef.w) {
                            ret = false;
                            break;
                        } else {
                            _tmpRect.width = 0;
                        }
                    }
                }
            }

            if (_tmpRect.height > 0 && _tmpRect.width > 0) {
                const isRotated = this._determineRect();
                const letterPositionX = letterInfo.x + _linesOffsetX[letterInfo.line];
                this.appendQuad(_comp, texture, _tmpRect, isRotated, letterPositionX - appX, py - appY, _bmfontScale);
            }
        }

        return ret;
    },

    appendQuad (comp, texture, rect, rotated, x, y, scale) {
    },

    _determineRect () {
        const isRotated = _spriteFrame!.isRotated();

        const originalSize = _spriteFrame!.getOriginalSize();
        const rect = _spriteFrame!.getRect();
        const offset = _spriteFrame!.getOffset();
        const trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
        const trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

        if (!isRotated) {
            _tmpRect.x += (rect.x - trimmedLeft);
            _tmpRect.y += (rect.y + trimmedTop);
        } else {
            const originalX = _tmpRect.x;
            _tmpRect.x = rect.x + rect.height - _tmpRect.y - _tmpRect.height - trimmedTop;
            _tmpRect.y = originalX + rect.y - trimmedLeft;
            if (_tmpRect.y < 0) {
                _tmpRect.height += trimmedTop;
            }
        }

        return isRotated;
    },

    _computeAlignmentOffset () {
        _linesOffsetX.length = 0;

        switch (_hAlign) {
        case HorizontalTextAlignment.LEFT:
            for (let i = 0; i < _numberOfLines; ++i) {
                _linesOffsetX.push(0);
            }
            break;
        case HorizontalTextAlignment.CENTER:
            for (let i = 0, l = _linesWidth.length; i < l; i++) {
                _linesOffsetX.push((_contentSize.width - _linesWidth[i]) / 2);
            }
            break;
        case HorizontalTextAlignment.RIGHT:
            for (let i = 0, l = _linesWidth.length; i < l; i++) {
                _linesOffsetX.push(_contentSize.width - _linesWidth[i]);
            }
            break;
        default:
            break;
        }

        // TOP
        _letterOffsetY = _contentSize.height;
        if (_vAlign !== VerticalTextAlignment.TOP) {
            const blank = _contentSize.height - _textDesiredHeight + _lineHeight * this._getFontScale() - _originFontSize * _bmfontScale;
            if (_vAlign === VerticalTextAlignment.BOTTOM) {
                // BOTTOM
                _letterOffsetY -= blank;
            } else {
                // CENTER:
                _letterOffsetY -= blank / 2;
            }
        }
    },

    _setupBMFontOverflowMetrics () {
        let newWidth = _contentSize.width;
        let newHeight = _contentSize.height;

        if (_overflow === Overflow.RESIZE_HEIGHT) {
            newHeight = 0;
        }

        if (_overflow === Overflow.NONE) {
            newWidth = 0;
            newHeight = 0;
        }

        _labelWidth = newWidth;
        _labelHeight = newHeight;
        _labelDimensions.width = newWidth;
        _labelDimensions.height = newHeight;
        _maxLineWidth = newWidth;
    },
};

export default bmfontUtils;
