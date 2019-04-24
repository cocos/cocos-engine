/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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
 ****************************************************************************/

import { BitmapFont, IConfig } from '../../../../assets/bitmap-font';
import { SpriteFrame } from '../../../../assets/sprite-frame';
import { isUnicodeCJK, isUnicodeSpace } from '../../../../core/utils/text-utils';
import { Rect, Size, Vec2 } from '../../../../core/value-types';
import { HorizontalTextAlignment, VerticalTextAlignment } from '../../components/label-component';
import { LabelComponent, Overflow } from '../../components/label-component';

class FontLetterDefinition {
    public u = 0;
    public v = 0;
    public width = 0;
    public height = 0;
    public offsetX = 0;
    public offsetY = 0;
    public textureID = 0;
    public validDefinition = false;
    public xAdvance = 0;
}

interface ILetterDefinition {
    [key: string]: FontLetterDefinition;
}

export class FontAtlas {
    get letterDefinitions (){
        return this._letterDefinitions;
    }

    private _letterDefinitions: ILetterDefinition = {};
    constructor (fntConfig) {
        // this._letterDefinitions = {};
    }

    public addLetterDefinitions (letter: string, letterDefinition: FontLetterDefinition) {
        this._letterDefinitions[letter] = letterDefinition;
    }

    public cloneLetterDefinition () {
        const copyLetterDefinitions: ILetterDefinition = {};
        for (const key of Object.keys(this._letterDefinitions)) {
            const value = new FontLetterDefinition();
            cc.js.mixin(value, this._letterDefinitions[key]);
            copyLetterDefinitions[key] = value;
        }
        return copyLetterDefinitions;
    }

    public assignLetterDefinitions (letterDefinition: ILetterDefinition) {
        for (const key of Object.keys(this._letterDefinitions)) {
            const newValue = letterDefinition[key];
            const oldValue = this._letterDefinitions[key];
            cc.js.mixin(oldValue, newValue);
        }
    }

    public scaleFontLetterDefinition (scaleFactor: number) {
        for (const fontDefinition of Object.keys(this._letterDefinitions)) {
            const letterDefinitions = this._letterDefinitions[fontDefinition];
            letterDefinitions.width *= scaleFactor;
            letterDefinitions.height *= scaleFactor;
            letterDefinitions.offsetX *= scaleFactor;
            letterDefinitions.offsetY *= scaleFactor;
            letterDefinitions.xAdvance *= scaleFactor;
        }
    }

    public getLetterDefinitionForChar (char: string) {
        const hasKey = this._letterDefinitions.hasOwnProperty(char.charCodeAt(0));
        let letterDefinition;
        if (hasKey) {
            letterDefinition = this._letterDefinitions[char.charCodeAt(0)];
        } else {
            letterDefinition = null;
        }
        return letterDefinition;
    }
}

cc.FontAtlas = FontAtlas;

class LetterInfo {
    public char = '';
    public valid = true;
    public positionX = 0;
    public positionY = 0;
    public lineIndex = 0;
}

const _tmpRect = new Rect();

let _comp: LabelComponent | null = null;

const _horizontalKernings: number[] = [];
const _lettersInfo: LetterInfo[] = [];
const _linesWidth: number[] = [];
const _linesOffsetX: number[] = [];
const _labelDimensions = new Size();

let _fontAtlas: FontAtlas | null = null;
let _fntConfig: IConfig | null = null;
let _numberOfLines = 0;
let _textDesiredHeight = 0;
let _letterOffsetY = 0;
let _tailoredTopY = 0;
let _tailoredBottomY = 0;
let _bmfontScale = 1.0;
const _lineBreakWithoutSpaces = false;
let _spriteFrame: SpriteFrame|null = null;
const _lineSpacing = 0;
let _string = '';
let _fontSize = 0;
let _originFontSize = 0;
const _contentSize = new Size();
let _hAlign = 0;
let _vAlign = 0;
let _spacingX = 0;
let _lineHeight = 0;
let _overflow = 0;
let _isWrapText = false;
let _labelWidth = 0;
let _labelHeight = 0;
let _maxLineWidth = 0;

export const bmfontUtils = {
    updateRenderData (comp: LabelComponent) {
        if (!comp.renderData) {
            return;
        }

        if (!comp.renderData.vertDirty) { return; }
        if (_comp === comp) { return; }

        _comp = comp;

        this._updateProperties();
        this._updateContent();

        _comp.actualFontSize = _fontSize;
        _comp.node.setContentSize(_contentSize);

        _comp.renderData!.vertDirty = _comp.renderData!.uvDirty = false;

        _comp = null;

        this._resetProperties();
    },

    _updateFontScale () {
        _bmfontScale = _fontSize / _originFontSize;
    },

    _updateProperties () {
        if (!_comp){
            return;
        }

        const fontAsset = _comp.font as BitmapFont;
        if (!fontAsset) {
            return;
        }

        _spriteFrame = fontAsset.spriteFrame;
        _fntConfig = fontAsset.fntConfig!;

        _fontAtlas = _comp.fontAtlas;
        if (!_fontAtlas) {
            _fontAtlas = new FontAtlas(_fntConfig);

            const fontDict = _fntConfig.fontDefDictionary;

            for (const fontDef of Object.keys(fontDict) ) {
                const letterDefinition = new FontLetterDefinition();

                const rect = fontDict[fontDef].rect;

                letterDefinition.offsetX = fontDict[fontDef].xOffset;
                letterDefinition.offsetY = fontDict[fontDef].yOffset;
                letterDefinition.width = rect.width;
                letterDefinition.height = rect.height;
                letterDefinition.u = rect.x;
                letterDefinition.v = rect.y;
                // FIXME: only one texture supported for now
                letterDefinition.textureID = 0;
                letterDefinition.validDefinition = true;
                letterDefinition.xAdvance = fontDict[fontDef].xAdvance;

                _fontAtlas.addLetterDefinitions(fontDef, letterDefinition);
            }

            _comp.fontAtlas = _fontAtlas;
        }

        _string = _comp.string.toString();
        _fontSize = _comp.fontSize;
        _originFontSize = _fntConfig.fontSize;
        const contentSize = _comp.node.getContentSize();
        _contentSize.width = contentSize.width;
        _contentSize.height = contentSize.height;
        _hAlign = _comp.horizontalAlign;
        _vAlign = _comp.verticalAlign;
        _spacingX = _comp.spacingX;
        _overflow = _comp.overflow;
        _lineHeight = _comp.lineHeight;

        // should wrap text
        if (_overflow === Overflow.NONE) {
            _isWrapText = false;
        }
        else if (_overflow === Overflow.RESIZE_HEIGHT) {
            _isWrapText = true;
        }
        else {
            _isWrapText = _comp.enableWrapText;
        }

        this._setupBMFontOverflowMetrics();
    },

    _resetProperties () {
        _fontAtlas = null;
        _fntConfig = null;
        _spriteFrame = null;
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
        const horizontalKernings = _horizontalKernings;

        let prev = -1;
        for (let i = 0; i < stringLen; ++i) {
            const key = string.charCodeAt(i);
            const kerningAmount = kerningDict[(prev << 16) | (key & 0xffff)] || 0;
            if (i < stringLen - 1) {
                horizontalKernings[i] = kerningAmount;
            } else {
                horizontalKernings[i] = 0;
            }
            prev = key;
        }
    },

    _multilineTextWrap (nextTokenFunc: Function) {
        const textLen = _string.length;

        let lineIndex = 0;
        let nextTokenX = 0;
        let nextTokenY = 0;
        let longestLine = 0;
        let letterRight = 0;

        let highestY = 0;
        let lowestY = 0;
        let letterDef: FontLetterDefinition | null = null;
        const letterPosition = new Vec2();

        this._updateFontScale();

        const letterDefinitions = _fontAtlas!.letterDefinitions;

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === '\n') {
                _linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= _lineHeight * _bmfontScale + _lineSpacing;
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
                letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);
                if (!letterDef) {
                    this._recordPlaceholderInfo(letterIndex, character);
                    console.log('Can\'t find letter definition in texture atlas ' +
                     _fntConfig!.atlasName + ' for letter:' + character);
                    continue;
                }

                const letterX = nextLetterX + letterDef.offsetX * _bmfontScale;

                if (_isWrapText
                    && _maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.width * _bmfontScale > _maxLineWidth
                    && !isUnicodeSpace(character)) {
                    _linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (_lineHeight * _bmfontScale + _lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = nextTokenY - letterDef.offsetY * _bmfontScale;
                this._recordLetterInfo(letterDefinitions, letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < _horizontalKernings.length && letterIndex < textLen - 1) {
                    nextLetterX += _horizontalKernings[letterIndex + 1];
                }

                nextLetterX += letterDef.xAdvance * _bmfontScale + _spacingX;

                tokenRight = letterPosition.x + letterDef.width * _bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.height * _bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.height * _bmfontScale;
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
        _textDesiredHeight = _numberOfLines * _lineHeight * _bmfontScale;
        if (_numberOfLines > 1) {
            _textDesiredHeight += (_numberOfLines - 1) * _lineSpacing;
        }

        _contentSize.width = _labelWidth;
        _contentSize.height = _labelHeight;
        if (_labelWidth <= 0) {
            _contentSize.width = parseFloat(longestLine.toFixed(2));
        }
        if (_labelHeight <= 0) {
            _contentSize.height = parseFloat(_textDesiredHeight.toFixed(2));
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

    _getFirstWordLen (text: string, startIndex: number, textLen: number) {
        let character = text.charAt(startIndex);
        if (isUnicodeCJK(character)
            || character === '\n'
            || isUnicodeSpace(character)) {
            return 1;
        }

        let len = 1;
        let letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);
        if (!letterDef) {
            return len;
        }
        let nextLetterX = letterDef._xAdvance * _bmfontScale + _spacingX;
        let letterX;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = _fontAtlas && _fontAtlas.getLetterDefinitionForChar(character);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef._offsetX * _bmfontScale;

            if (letterX + letterDef._width * _bmfontScale > _maxLineWidth
                && !isUnicodeSpace(character)
                && _maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef._xAdvance * _bmfontScale + _spacingX;
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
        _lettersInfo[letterIndex].valid = false;
    },

    _recordLetterInfo (letterDefinitions: ILetterDefinition, letterPosition: Vec2, character: string, letterIndex: number, lineIndex: number) {
        if (letterIndex >= _lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            _lettersInfo.push(tmpInfo);
        }

        const cIndex = character.charCodeAt(0);
        _lettersInfo[letterIndex].lineIndex = lineIndex;
        _lettersInfo[letterIndex].char = character;
        _lettersInfo[letterIndex].valid = letterDefinitions[cIndex].validDefinition;
        _lettersInfo[letterIndex].positionX = letterPosition.x;
        _lettersInfo[letterIndex].positionY = letterPosition.y;
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

    _shrinkLabelToContentSize (lambda: Function) {
        const fontSize = _fontSize;
        const originalLineHeight = _lineHeight;
        const fontAtlas = _fontAtlas;

        let i = 0;
        const tempLetterDefinition = fontAtlas ? fontAtlas.cloneLetterDefinition() : {} as ILetterDefinition;
        let flag = true;

        while (lambda()) {
            ++i;

            const newFontSize = fontSize - i;
            flag = false;
            if (newFontSize <= 0) {
                break;
            }

            const scale = newFontSize / fontSize;
            if (fontAtlas) {
                fontAtlas.assignLetterDefinitions(tempLetterDefinition);
                fontAtlas.scaleFontLetterDefinition(scale);
            }
            _lineHeight = originalLineHeight * scale;
            if (!_lineBreakWithoutSpaces) {
                this._multilineTextWrapByWord();
            } else {
                this._multilineTextWrapByChar();
            }
            this._computeAlignmentOffset();
        }

        _lineHeight = originalLineHeight;
        if (fontAtlas) {
            fontAtlas.assignLetterDefinitions(tempLetterDefinition);
        }

        if (!flag) {
            if (fontSize - i >= 0) {
                this._scaleFontSizeDown(fontSize - i);
            }
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
        if (!_fontAtlas){
            return;
        }

        const letterDefinitions = _fontAtlas.letterDefinitions;
        let letterClamp = false;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = _lettersInfo[ctr];
            if (letterInfo.valid) {
                const letterDef = letterDefinitions[letterInfo.char];

                const px = letterInfo.positionX + letterDef.width / 2 * _bmfontScale;
                const lineIndex = letterInfo.lineIndex;
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

        const letterDefinitions = _fontAtlas ? _fontAtlas.letterDefinitions : {};

        const texture = _spriteFrame;

        const node = _comp.node;
        const renderData = _comp.renderData!;
        renderData.dataLength = renderData.vertexCount = renderData.indiceCount = 0;

        const anchorPoint = node.getAnchorPoint();
        const contentSize = _contentSize;
        const appx = anchorPoint.x * contentSize.width;
        const appy = anchorPoint.y * contentSize.height;

        let ret = true;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = _lettersInfo[ctr];
            if (!letterInfo.valid) { continue; }
            const letterDef = letterDefinitions[letterInfo.char.charCodeAt(0)];
            if (!letterDef){
                console.warn('Can\'t find letter in this bitmap-font');
                continue;
            }

            _tmpRect.height = letterDef.height;
            _tmpRect.width = letterDef.width;
            _tmpRect.x = letterDef.u;
            _tmpRect.y = letterDef.v;

            let py = letterInfo.positionY + _letterOffsetY;

            if (_labelHeight > 0) {
                if (py > _tailoredTopY) {
                    const clipTop = py - _tailoredTopY;
                    _tmpRect.y += clipTop;
                    _tmpRect.height -= clipTop;
                    py = py - clipTop;
                }

                if (py - letterDef.height * _bmfontScale < _tailoredBottomY) {
                    _tmpRect.height = (py < _tailoredBottomY) ? 0 : (py - _tailoredBottomY);
                }
            }

            const lineIndex = letterInfo.lineIndex;
            const px = letterInfo.positionX + letterDef.width / 2 * _bmfontScale + _linesOffsetX[lineIndex];

            if (_labelWidth > 0) {
                if (this._isHorizontalClamped(px, lineIndex)) {
                    if (_overflow === Overflow.CLAMP) {
                        _tmpRect.width = 0;
                    } else if (_overflow === Overflow.SHRINK) {
                        if (_contentSize.width > letterDef.width) {
                            ret = false;
                            break;
                        } else {
                            _tmpRect.width = 0;
                        }
                    }
                }
            }

            if (_spriteFrame &&  _tmpRect.height > 0 && _tmpRect.width > 0) {
                const isRotated = _spriteFrame.isRotated();

                const originalSize = _spriteFrame.getOriginalSize();
                const rect = _spriteFrame.getRect();
                const offset = _spriteFrame.getOffset();
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
                        _tmpRect.height = _tmpRect.height + trimmedTop;
                    }
                }

                const letterPositionX = letterInfo.positionX + _linesOffsetX[letterInfo.lineIndex];
                this.appendQuad(renderData, texture, _tmpRect, isRotated, letterPositionX - appx, py - appy, _bmfontScale);
            }
        }

        return ret;
    },

    appendQuad (renderData, texture, rect, rotated, x, y, scale) {
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

        switch (_vAlign) {
            case VerticalTextAlignment.TOP:
                _letterOffsetY = _contentSize.height;
                break;
            case VerticalTextAlignment.CENTER:
                _letterOffsetY = (_contentSize.height + _textDesiredHeight) / 2;
                break;
            case VerticalTextAlignment.BOTTOM:
                _letterOffsetY = _textDesiredHeight;
                break;
            default:
                break;
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
