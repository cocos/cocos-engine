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
import { IConfig, FontAtlas } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';
import { Rect } from '../../../core';
import { Label, Overflow, CacheMode } from '../../components/label';
import { UITransform } from '../../framework/ui-transform';
import { LetterAtlas, shareLabelInfo } from './font-utils';
import { dynamicAtlasManager } from '../../utils/dynamic-atlas/atlas-manager';
import { TextProcessing } from './text-processing';
import { TextProcessData } from './text-process-data';

const _defaultLetterAtlas = new LetterAtlas(64, 64);
const _defaultFontAtlas = new FontAtlas(null);

let _comp: Label | null = null;
let _uiTrans: UITransform | null = null;

let _fntConfig: IConfig | null = null;
let _spriteFrame: SpriteFrame|null = null;
let QUAD_INDICES;

export const bmfontUtils = {

    updateProcessingData (data: TextProcessData, comp: Label, trans: UITransform) {
        data.inputString = comp.string.toString();
        data.fontSize = comp.fontSize;
        data.actualFontSize = comp.fontSize;
        data.originFontSize = _fntConfig ? _fntConfig.fontSize : comp.fontSize;
        data.hAlign = comp.horizontalAlign;
        data.vAlign = comp.verticalAlign;
        data.spacingX = comp.spacingX;
        const overflow = comp.overflow;
        data.overFlow = overflow;
        data.lineHeight = comp.lineHeight;

        data.nodeContentSize.width = trans.width;
        data.nodeContentSize.height = trans.height;

        // should wrap text
        if (overflow === Overflow.NONE) {
            data.wrapping = false;
            data.nodeContentSize.width += shareLabelInfo.margin * 2;
            data.nodeContentSize.height += shareLabelInfo.margin * 2;
        } else if (overflow === Overflow.RESIZE_HEIGHT) {
            data.wrapping = true;
            data.nodeContentSize.height += shareLabelInfo.margin * 2;
        } else {
            data.wrapping = comp.enableWrapText;
        }

        shareLabelInfo.lineHeight = comp.lineHeight;
        shareLabelInfo.fontSize = comp.fontSize;

        // 同步数据？
        data.spriteFrame = _spriteFrame; // 只同步这一次 // char 模式为 null
        data.fntConfig = _fntConfig; // 只同步这一次
        data.fontAtlas = shareLabelInfo.fontAtlas;
        data.fontFamily = shareLabelInfo.fontFamily;

        data.color.set(comp.color);
    },

    updateRenderData (comp: Label) {
        if (!comp.renderData) {
            return;
        }

        if (_comp === comp) { return; }

        if (comp.renderData.vertDirty) {
            _comp = comp;
            _uiTrans = _comp.node._uiProps.uiTransformComp!;
            const renderData = comp.renderData;

            const processing = TextProcessing.instance;
            const data = comp.processingData;
            data.isBmFont = true; // hard code
            this._updateFontFamily(comp);

            this.updateProcessingData(data, comp, _uiTrans);

            this._updateLabelInfo(comp);

            // 同步下 info 中的内容 // hack
            data.fontDesc = shareLabelInfo.fontDesc;

            // TextProcessing
            processing.processingString(data);// 可以填 out // 用一个flag来避免排版的更新，比如 renderDirtyOnly
            // generateVertex
            this.resetRenderData(comp);
            data.quadCount = 0;
            processing.generateRenderInfo(data, this.generateVertexData); // 传个方法进去

            // 更新 vb
            renderData.dataLength = data.quadCount;
            renderData.resize(renderData.dataLength, renderData.dataLength / 2 * 3);
            const datalist = renderData.data;
            for (let i = 0, l = data.quadCount; i < l; i++) {
                datalist[i] = data.vertexBuffer[i];
            }

            // 处理 ib
            const indexCount = renderData.indexCount;
            this.createQuadIndices(indexCount);
            renderData.chunk.setIndexBuffer(QUAD_INDICES);

            _comp.actualFontSize = data.actualFontSize;
            _uiTrans.setContentSize(data.nodeContentSize);
            this.updateUVs(comp);// dirty need
            this.updateColor(comp); // dirty need

            renderData.vertDirty = false;
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

    updateColor (label: Label) {
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

    resetRenderData (comp: Label) {
        const renderData = comp.renderData!;
        renderData.dataLength = 0;
        renderData.resize(0, 0);
    },

    // callBack function
    generateVertexData (info: TextProcessData, offset: number,
        spriteFrame: SpriteFrame, rect: Rect, rotated: boolean, x: number, y: number) {
        const dataOffset = offset;
        const scale = info.bmfontScale;

        const dataList = info.vertexBuffer;
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

    _updateFontFamily (comp) {
        const fontAsset = comp.font;
        _spriteFrame = fontAsset.spriteFrame;
        _fntConfig = fontAsset.fntConfig;
        shareLabelInfo.fontAtlas = fontAsset.fontDefDictionary;
        if (!shareLabelInfo.fontAtlas) {
            if (comp.cacheMode === CacheMode.CHAR) {
                shareLabelInfo.fontAtlas = _defaultLetterAtlas;
            } else {
                shareLabelInfo.fontAtlas = _defaultFontAtlas;
            }
        }

        dynamicAtlasManager.packToDynamicAtlas(comp, _spriteFrame);
        // TODO update material and uv
    },

    _updateLabelInfo (comp) {
        // clear
        shareLabelInfo.hash = '';
        shareLabelInfo.margin = 0;
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

        if (!kerningDict) {
            return;
        }

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
                    nextLetterX += _horizontalKerning[letterIndex + 1] * _bmfontScale;
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

                if ((py - _tmpRect.height * _bmfontScale < _tailoredBottomY) && _overflow === Overflow.CLAMP) {
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
        const indexCount = renderData.indexCount;
        this.createQuadIndices(indexCount);
        renderData.chunk.setIndexBuffer(QUAD_INDICES);
        return ret;
    },

    createQuadIndices (indexCount) {
        if (indexCount % 6 !== 0) {
            console.error('illegal index count!');
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
