/*
 Copyright (c) 2023 Xiamen Yaji Software Co., Ltd.

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
import { Texture2D } from '../../../asset/assets';
import { WrapMode } from '../../../asset/assets/asset-enum';
import { cclegacy, Color, Pool, Rect, Vec2 } from '../../../core';
import { logID } from '../../../core/platform';
import { SpriteFrame } from '../../assets';
import { FontLetterDefinition } from '../../assets/bitmap-font';
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from '../../components/label';
import { BASELINE_RATIO, fragmentText, getBaselineOffset, isUnicodeCJK, isUnicodeSpace, safeMeasureText } from '../../utils/text-utils';
import { CanvasPool, ISharedLabelData, shareLabelInfo } from './font-utils';
import { TextProcessData } from './text-process-data';

const Alignment = [
    'left', // macro.TextAlignment.LEFT
    'center', // macro.TextAlignment.CENTER
    'right', // macro.TextAlignment.RIGHT
];
const MAX_SIZE = 2048;
const _BASELINE_OFFSET = getBaselineOffset();
const _invisibleAlpha = (1 / 255).toFixed(3);

export interface IRenderData {
    x: number;
    y: number;
    z: number;
    u: number;
    v: number;
    color: Color;
}

const _dataPool = new Pool(() => ({
    x: 0,
    y: 0,
    z: 0,
    u: 0,
    v: 0,
    color: Color.WHITE.clone(),
}), 128);

class LetterInfo {
    public char = '';
    public valid = true;
    public x = 0;
    public y = 0;
    public line = 0;
    public hash = '';
}

export class TextProcessing {
    // -------------------- Common Part --------------------------
    public static instance: TextProcessing;
    constructor () {
        this._canvasData = CanvasPool.getInstance().get();
        this._canvas = this._canvasData.canvas;
        this._context = this._canvasData.context;
    }

    public destroy () {
        CanvasPool.getInstance().put(this._canvasData!);
        this._lettersInfo.length = 0;
    }

    public processingString (info: TextProcessData, out?: string[]) {
        if (!info.isBmFont) {
            this._updatePaddingRect(info);
            this._calculateLabelFont(info);
        } else {
            this._setupBMFontOverflowMetrics(info);
            this._updateFontScale(info);
            this._computeHorizontalKerningForText(info);
            this._alignText(info);
        }
        if (out) {
            out = info.outputLayoutData.parsedString;
        }
    }

    public generateRenderInfo (info: TextProcessData, callback: AnyFunction) {
        if (!info.isBmFont) {
            this._updateLabelDimensions(info);
            this._updateTexture(info);
            this.generateVertexData(info, callback);
        } else {
            this._computeAlignmentOffset(info);
            this.generateVertexData(info, callback);
        }
    }
    // -------------------- Common Part --------------------------

    // -------------------- Canvas Mode Part --------------------------

    // -------------------- String Processing Part --------------------------
    private _context: CanvasRenderingContext2D | null = null;
    private _canvas: HTMLCanvasElement | null = null;
    private _canvasData: ISharedLabelData | null = null;

    private _lettersInfo: LetterInfo[] = [];
    private _tmpRect = new Rect();

    private _calculateLabelFont (info: TextProcessData) {
        if (!this._context) {
            return;
        }

        info.actualFontSize = info.fontSize;
        const paragraphedStrings = info.inputString.split('\n');

        const _splitStrings = info.outputLayoutData.parsedString = paragraphedStrings;
        const _fontDesc = this._getFontDesc(info.actualFontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
        this._context.font = info.fontDesc = _fontDesc;

        switch (info.layout.overFlow) {
        case Overflow.NONE: {
            let canvasSizeX = 0;
            let canvasSizeY = 0;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                const paraLength = safeMeasureText(this._context, paragraphedStrings[i], _fontDesc);
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = (_splitStrings.length + BASELINE_RATIO) * this._getLineHeight(info.layout.lineHeight, info.actualFontSize, info.fontSize);
            const rawWidth = parseFloat(canvasSizeX.toFixed(2));
            const rawHeight = parseFloat(canvasSizeY.toFixed(2));

            info.outputLayoutData.canvasSize.width = rawWidth + info.outputLayoutData.canvasPadding.width;
            info.outputLayoutData.canvasSize.height = rawHeight + info.outputLayoutData.canvasPadding.height;
            info.outputLayoutData.nodeContentSize.width = rawWidth + info.outputLayoutData.contentSizeExtend.width;
            info.outputLayoutData.nodeContentSize.height = rawHeight + info.outputLayoutData.contentSizeExtend.height;
            break;
        }
        case Overflow.SHRINK: {
            this._calculateShrinkFont(paragraphedStrings, info);
            this._calculateWrapText(paragraphedStrings, info);
            break;
        }
        case Overflow.CLAMP: {
            this._calculateWrapText(paragraphedStrings, info);
            break;
        }
        case Overflow.RESIZE_HEIGHT: {
            this._calculateWrapText(paragraphedStrings, info);
            const rawHeight = (info.outputLayoutData.parsedString.length + BASELINE_RATIO) * this._getLineHeight(info.layout.lineHeight, info.actualFontSize, info.fontSize);

            info.outputLayoutData.canvasSize.height = rawHeight + info.outputLayoutData.canvasPadding.height;
            // set node height
            info.outputLayoutData.nodeContentSize.height = rawHeight + info.outputLayoutData.contentSizeExtend.height;
            break;
        }
        default: {
            // nop
        }
        }
    }

    // can cache
    private _getFontDesc (fontSize: number, fontFamily: string, isBold: boolean, isItalic: boolean) {
        let fontDesc = `${fontSize.toString()}px `;
        fontDesc += fontFamily;
        if (isBold) {
            fontDesc = `bold ${fontDesc}`;
        }

        if (isItalic) {
            fontDesc = `italic ${fontDesc}`;
        }

        return fontDesc;
    }

    // can cache
    private _getLineHeight (lineHeight: number, fontSize: number, drawFontsize: number) {
        let nodeSpacingY = lineHeight;
        if (nodeSpacingY === 0) {
            nodeSpacingY = fontSize;
        } else {
            nodeSpacingY = nodeSpacingY * fontSize / drawFontsize;
        }

        return nodeSpacingY | 0;
    }

    private _calculateShrinkFont (paragraphedStrings: string[], info: TextProcessData) {
        if (!this._context) return;
        let _fontDesc = this._getFontDesc(info.actualFontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
        this._context.font = _fontDesc;
        const paragraphLength = this._calculateParagraphLength(paragraphedStrings, this._context, _fontDesc);

        let i = 0;
        let totalHeight = 0;
        let maxLength = 0;
        let _fontSize = info.actualFontSize;

        if (info.layout.wrapping) {
            const canvasWidthNoMargin = info.outputLayoutData.nodeContentSize.width;
            const canvasHeightNoMargin = info.outputLayoutData.nodeContentSize.height;
            if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
                return;
            }
            totalHeight = canvasHeightNoMargin + 1;
            const actualFontSize = info.fontSize + 1;
            let textFragment: string[] = [];
            let left = 0;
            let right = actualFontSize | 0;
            let mid = 0;

            while (left < right) {
                mid = (left + right + 1) >> 1;

                if (mid <= 0) {
                    logID(4003);
                    break;
                }

                _fontSize = mid;
                _fontDesc = this._getFontDesc(_fontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
                this._context.font = _fontDesc;
                const lineHeight = this._getLineHeight(info.layout.lineHeight, _fontSize, info.fontSize);

                totalHeight = 0;
                for (i = 0; i < paragraphedStrings.length; ++i) {
                    const allWidth = safeMeasureText(this._context, paragraphedStrings[i], _fontDesc);
                    textFragment = fragmentText(paragraphedStrings[i],
                        allWidth,
                        canvasWidthNoMargin,
                        this._measureText(this._context, _fontDesc));
                    totalHeight += textFragment.length * lineHeight;
                }

                if (totalHeight > canvasHeightNoMargin) {
                    right = mid - 1;
                } else {
                    left = mid;
                }
            }

            if (left === 0) {
                logID(4003);
            } else {
                _fontSize = left;
                _fontDesc = this._getFontDesc(_fontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
                this._context.font = _fontDesc;
            }
        } else {
            totalHeight = paragraphedStrings.length * this._getLineHeight(info.layout.lineHeight, _fontSize, info.fontSize);

            for (i = 0; i < paragraphedStrings.length; ++i) {
                if (maxLength < paragraphLength[i]) {
                    maxLength = paragraphLength[i];
                }
            }
            const scaleX = (info.outputLayoutData.canvasSize.width - info.outputLayoutData.canvasPadding.width) / maxLength;
            const scaleY = info.outputLayoutData.canvasSize.height / totalHeight;

            _fontSize = (info.fontSize * Math.min(1, scaleX, scaleY)) | 0;
            _fontDesc = this._getFontDesc(_fontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
            this._context.font = _fontDesc;
        }

        info.actualFontSize = _fontSize;
        info.fontDesc = _fontDesc;
    }

    private _calculateWrapText (paragraphedStrings: string[], info: TextProcessData) {
        if (!info.layout.wrapping || !this._context) return;

        let _splitStrings: string[] = [];
        const canvasWidthNoMargin = info.outputLayoutData.nodeContentSize.width;
        const _fontDesc = this._getFontDesc(info.actualFontSize, info.fontFamily, info.style.isBold, info.style.isItalic);
        this._context.font = _fontDesc;
        for (let i = 0; i < paragraphedStrings.length; ++i) {
            const allWidth = safeMeasureText(this._context, paragraphedStrings[i], _fontDesc);
            const textFragment = fragmentText(paragraphedStrings[i],
                allWidth,
                canvasWidthNoMargin,
                this._measureText(this._context, _fontDesc));
            _splitStrings = _splitStrings.concat(textFragment);
        }
        info.outputLayoutData.parsedString = _splitStrings;
        info.fontDesc = _fontDesc;
    }

    private _measureText (ctx: CanvasRenderingContext2D, fontDesc) {
        return (string: string) => safeMeasureText(ctx, string, fontDesc);
    }

    private _calculateParagraphLength (paragraphedStrings: string[], ctx: CanvasRenderingContext2D, fontDesc: string) {
        const paragraphLength: number[] = [];

        for (const para of paragraphedStrings) {
            const width: number = safeMeasureText(ctx, para, fontDesc);
            paragraphLength.push(width);
        }

        return paragraphLength;
    }

    private _updatePaddingRect (info: TextProcessData) {
        let top = 0; let bottom = 0; let left = 0; let right = 0;
        let outlineWidth = 0;
        info.outputLayoutData.contentSizeExtend.width = info.outputLayoutData.contentSizeExtend.height = 0;
        if (info.style.isOutlined) {
            outlineWidth = info.style.outlineWidth;
            top = bottom = left = right = outlineWidth;
            info.outputLayoutData.contentSizeExtend.width = info.outputLayoutData.contentSizeExtend.height = outlineWidth * 2;
        }
        if (info.style.hasShadow) {
            const shadowWidth = info.style.shadowBlur + outlineWidth;
            const offsetX = info.style.shadowOffsetX;
            const offsetY = info.style.shadowOffsetY;
            left = Math.max(left, -offsetX + shadowWidth);
            right = Math.max(right, offsetX + shadowWidth);
            top = Math.max(top, offsetY + shadowWidth);
            bottom = Math.max(bottom, -offsetY + shadowWidth);
        }
        if (info.style.isItalic) {
            // 0.0174532925 = 3.141592653 / 180
            const offset = info.actualFontSize * Math.tan(12 * 0.0174532925);
            right += offset;
            info.outputLayoutData.contentSizeExtend.width += offset;
        }
        info.outputLayoutData.canvasPadding.x = left;
        info.outputLayoutData.canvasPadding.y = top;
        info.outputLayoutData.canvasPadding.width = left + right;
        info.outputLayoutData.canvasPadding.height = top + bottom;
    }

    // -------------------- String Processing Part --------------------------

    // -------------------- Render Processing Part --------------------------

    private _updateLabelDimensions (info: TextProcessData) {
        info.outputLayoutData.canvasSize.width = Math.min(info.outputLayoutData.canvasSize.width, MAX_SIZE);
        info.outputLayoutData.canvasSize.height = Math.min(info.outputLayoutData.canvasSize.height, MAX_SIZE);

        this._canvas!.width = info.outputLayoutData.canvasSize.width;
        this._canvas!.height = info.outputLayoutData.canvasSize.height;

        this._context!.font = info.fontDesc;
        // align
        this._context!.textAlign = Alignment[info.layout.hAlign] as any;
        this._context!.textBaseline = 'alphabetic';
    }

    private _calculateFillTextStartPosition (info: TextProcessData) {
        let labelX = 0;
        if (info.layout.hAlign === HorizontalTextAlignment.RIGHT) {
            labelX = info.outputLayoutData.canvasSize.width - info.outputLayoutData.canvasPadding.width;
        } else if (info.layout.hAlign === HorizontalTextAlignment.CENTER) {
            labelX = (info.outputLayoutData.canvasSize.width - info.outputLayoutData.canvasPadding.width) / 2;
        }

        const lineHeight = this._getLineHeight(info.layout.lineHeight, info.actualFontSize, info.fontSize);
        const drawStartY = lineHeight * (info.outputLayoutData.parsedString.length - 1);
        // TOP
        let firstLinelabelY = info.actualFontSize * (1 - BASELINE_RATIO / 2);
        if (info.layout.vAlign !== VerticalTextAlignment.TOP) {
            // free space in vertical direction
            let blank = drawStartY + info.outputLayoutData.canvasPadding.height + info.actualFontSize - info.outputLayoutData.canvasSize.height;
            if (info.layout.vAlign === VerticalTextAlignment.BOTTOM) {
                // Unlike BMFont, needs to reserve space below.
                blank += BASELINE_RATIO / 2 * info.actualFontSize;
                // BOTTOM
                firstLinelabelY -= blank;
            } else {
                // CENTER
                firstLinelabelY -= blank / 2;
            }
        }

        firstLinelabelY += _BASELINE_OFFSET * info.actualFontSize;

        info.outputLayoutData.startPosition.set(labelX + info.outputLayoutData.canvasPadding.x, firstLinelabelY + info.outputLayoutData.canvasPadding.y);
    }

    private _updateTexture (info: TextProcessData) {
        if (!this._context || !this._canvas) {
            return;
        }

        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.font = info.fontDesc;

        this._calculateFillTextStartPosition(info);
        const lineHeight = this._getLineHeight(info.layout.lineHeight, info.actualFontSize, info.fontSize);
        // use round for line join to avoid sharp intersect point
        this._context.lineJoin = 'round';

        if (info.style.isOutlined) {
            this._context.fillStyle = `rgba(${info.style.outlineColor.r}, ${info.style.outlineColor.g}, ${info.style.outlineColor.b}, ${_invisibleAlpha})`;
            // Notice: fillRect twice will not effect
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        } else {
            this._context.fillStyle = `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${_invisibleAlpha})`;
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
        this._context.fillStyle = `rgb(${info.color.r}, ${info.color.g}, ${info.color.b})`;
        const drawTextPosX = info.outputLayoutData.startPosition.x;
        let drawTextPosY = 0;
        // draw shadow and underline
        this._drawTextEffect(info.outputLayoutData.startPosition, lineHeight, info);
        // draw text and outline
        for (let i = 0; i < info.outputLayoutData.parsedString.length; ++i) {
            drawTextPosY = info.outputLayoutData.startPosition.y + i * lineHeight;
            if (info.style.isOutlined) {
                this._context.strokeText(info.outputLayoutData.parsedString[i], drawTextPosX, drawTextPosY);
            }
            this._context.fillText(info.outputLayoutData.parsedString[i], drawTextPosX, drawTextPosY);
        }

        if (info.style.hasShadow) {
            this._context.shadowColor = 'transparent';
        }

        this._uploadTexture(info);
    }

    private _uploadTexture (info: TextProcessData) {
        if (info.outputRenderData.texture && this._canvas) {
            let tex: Texture2D;
            if (info.outputRenderData.texture instanceof SpriteFrame) {
                tex = (info.outputRenderData.texture.texture as Texture2D);
            } else {
                tex = info.outputRenderData.texture;
            }

            const uploadAgain = this._canvas.width !== 0 && this._canvas.height !== 0;

            if (uploadAgain) {
                tex.reset({
                    width: this._canvas.width,
                    height: this._canvas.height,
                    mipmapLevel: 1,
                });
                tex.uploadData(this._canvas);
                tex.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
                if (info.outputRenderData.texture instanceof SpriteFrame) {
                    info.outputRenderData.texture.rect = new Rect(0, 0, this._canvas.width, this._canvas.height);
                    info.outputRenderData.texture._calculateUV();
                }
                if (cclegacy.director.root && cclegacy.director.root.batcher2D) {
                    if (JSB) {
                        cclegacy.director.root.batcher2D._releaseDescriptorSetCache(tex.getGFXTexture(), tex.getGFXSampler());
                    } else {
                        cclegacy.director.root.batcher2D._releaseDescriptorSetCache(tex.getHash());
                    }
                }
            }
        }
    }

    private _drawTextEffect (startPosition: Vec2, lineHeight: number, info: TextProcessData) {
        if (!info.style.hasShadow && !info.style.isOutlined && !info.style.isUnderline) return;

        const isMultiple = info.outputLayoutData.parsedString.length > 1 && info.style.hasShadow;
        const measureText = this._measureText(this._context!, info.fontDesc);
        let drawTextPosX = 0;
        let drawTextPosY = 0;

        // only one set shadow and outline
        if (info.style.hasShadow) {
            this._setupShadow(info);
        }

        if (info.style.isOutlined) {
            this._setupOutline(info);
        }

        // draw shadow and (outline or text)
        for (let i = 0; i < info.outputLayoutData.parsedString.length; ++i) {
            drawTextPosX = startPosition.x;
            drawTextPosY = startPosition.y + i * lineHeight;
            // multiple lines need to be drawn outline and fill text
            if (isMultiple) {
                if (info.style.isOutlined) {
                    this._context!.strokeText(info.outputLayoutData.parsedString[i], drawTextPosX, drawTextPosY);
                }
                this._context!.fillText(info.outputLayoutData.parsedString[i], drawTextPosX, drawTextPosY);
            }

            // draw underline
            if (info.style.isUnderline) {
                const _drawUnderlineWidth = measureText(info.outputLayoutData.parsedString[i]);
                const _drawUnderlinePos = new Vec2();
                if (info.layout.hAlign === HorizontalTextAlignment.RIGHT) {
                    _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth;
                } else if (info.layout.hAlign === HorizontalTextAlignment.CENTER) {
                    _drawUnderlinePos.x = startPosition.x - (_drawUnderlineWidth / 2);
                } else {
                    _drawUnderlinePos.x = startPosition.x;
                }
                _drawUnderlinePos.y = drawTextPosY + info.actualFontSize / 8;
                this._context!.fillRect(_drawUnderlinePos.x, _drawUnderlinePos.y, _drawUnderlineWidth, info.style.underlineHeight);
            }
        }

        if (isMultiple) {
            this._context!.shadowColor = 'transparent';
        }
    }

    private _setupOutline (info: TextProcessData) {
        this._context!.strokeStyle = `rgba(${info.style.outlineColor.r}, ${info.style.outlineColor.g}, ${info.style.outlineColor.b}, ${info.style.outlineColor.a / 255})`;
        this._context!.lineWidth = info.style.outlineWidth * 2;
    }

    private _setupShadow (info: TextProcessData) {
        this._context!.shadowColor = `rgba(${info.style.shadowColor.r}, ${info.style.shadowColor.g}, ${info.style.shadowColor.b}, ${info.style.shadowColor.a / 255})`;
        this._context!.shadowBlur = info.style.shadowBlur;
        this._context!.shadowOffsetX = info.style.shadowOffsetX;
        this._context!.shadowOffsetY = -info.style.shadowOffsetY;
    }

    // -------------------- Render Processing Part --------------------------

    private generateVertexData (info: TextProcessData, callback: AnyFunction) {
        if (!info.isBmFont) {
            this.updateQuatCount(info); // update vbBuffer count
            callback(info);
        } else {
            this._updateQuads(info, callback);
        }
    }

    private updateQuatCount (info: TextProcessData) {
        const data: IRenderData[] = info.outputRenderData.vertexBuffer;
        const count = info.outputRenderData.quadCount;
        if (data.length !== count) {
            // // Free extra data
            const value = data.length;
            let i = 0;
            for (i = count; i < value; i++) {
                _dataPool.free(data[i]);
            }

            for (i = value; i < count; i++) {
                data[i] = _dataPool.alloc();
            }

            data.length = count;
        }
    }

    // -------------------- Canvas Mode Part ---------------------------
    // -------------------- Multiple Quad Mode Part --------------------

    private _setupBMFontOverflowMetrics (info: TextProcessData) {
        let newWidth = info.outputLayoutData.nodeContentSize.width;
        let newHeight = info.outputLayoutData.nodeContentSize.height;

        if (info.layout.overFlow === Overflow.RESIZE_HEIGHT) {
            newHeight = 0;
        }

        if (info.layout.overFlow === Overflow.NONE) {
            newWidth = 0;
            newHeight = 0;
        }

        info.layout.labelWidth = newWidth;
        info.layout.labelHeight = newHeight;
        info.layout.labelDimensions.width = newWidth;
        info.layout.labelDimensions.height = newHeight;
        info.layout.maxLineWidth = newWidth;
    }

    private _updateFontScale (info: TextProcessData) {
        info.bmfontScale = info.actualFontSize / info.originFontSize;
    }

    private _computeHorizontalKerningForText (info: TextProcessData) {
        const string = info.inputString;
        const stringLen = string.length;
        if (!info.fntConfig) return; // for char

        const kerningDict = info.fntConfig.kerningDict;
        const horizontalKerning = info.layout.horizontalKerning;

        if (!kerningDict || kerningDict.length === 0) {
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
    }

    private _alignText (info: TextProcessData) {
        this._multilineTextWrap(info, this._getFirstWordLen);

        // shrink
        if (info.layout.overFlow === Overflow.SHRINK) {
            if (info.fontSize > 0 && this._isVerticalClamp(info, this)) {
                this._shrinkLabelToContentSize(info, this._isVerticalClamp);
            }
            if (info.fontSize > 0 && this._isHorizontalNeedShrink(info)) {
                this._shrinkLabelToContentSize(info, this._isHorizontalClamp);
            }
        }
        this._parsedString(info);
    }

    private _parsedString (info: TextProcessData) {
        let _splitStrings: string[] = [];
        let textFragment = '';

        for (let i = 0, line = 0, l = info.inputString.length; i < l; ++i) {
            const letterInfo = this._lettersInfo[i];
            if (!letterInfo.valid) { continue; }
            if (line === letterInfo.line) {
                textFragment += letterInfo.char;
            } else {
                _splitStrings = _splitStrings.concat(textFragment);
                line = letterInfo.line;
                textFragment = '';
            }
        }
        _splitStrings = _splitStrings.concat(textFragment);
        info.outputLayoutData.parsedString = _splitStrings;
    }

    private _multilineTextWrap (info: TextProcessData, nextTokenFunc: (arg0: TextProcessData, arg1: string, arg2: number, arg3: number) => number) {
        info.layout.linesWidth.length = 0;

        const _string = info.inputString;
        const textLen = _string.length;

        let lineIndex = 0;
        let nextTokenX = 0;
        let nextTokenY = 0;
        let longestLine = 0;
        let letterRight = 0;

        let highestY = 0;
        let lowestY = 0;
        let letterDef: FontLetterDefinition | null = null;

        const _lineSpacing = 0; // use less?

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === '\n') {
                info.layout.linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= info.layout.lineHeight * this._getFontScale(info) + _lineSpacing;
                this._recordPlaceholderInfo(index, character);
                index++;
                continue;
            }

            const tokenLen = nextTokenFunc(info, _string, index, textLen);
            let tokenHighestY = highestY;
            let tokenLowestY = lowestY;
            let tokenRight = letterRight;
            let nextLetterX = nextTokenX;
            let newLine = false;
            const letterPosition = new Vec2();

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
                        info.fntConfig!.atlasName} for letter:${character}`);
                    continue;
                }

                const letterX = nextLetterX + letterDef.offsetX * info.bmfontScale - shareLabelInfo.margin;

                if (info.layout.wrapping
                    && info.layout.maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.w * info.bmfontScale > info.layout.maxLineWidth
                    && !isUnicodeSpace(character)) {
                    info.layout.linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (info.layout.lineHeight * this._getFontScale(info) + _lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = nextTokenY - letterDef.offsetY * info.bmfontScale;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex);

                if (letterIndex + 1 < info.layout.horizontalKerning.length && letterIndex < textLen - 1) {
                    nextLetterX += info.layout.horizontalKerning[letterIndex + 1] * info.bmfontScale;
                }

                nextLetterX += letterDef.xAdvance * info.bmfontScale + info.layout.spacingX;

                tokenRight = letterPosition.x + letterDef.w * info.bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.h * info.bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.h * info.bmfontScale;
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

        info.layout.linesWidth.push(letterRight);

        info.layout.numberOfLines = lineIndex + 1;
        info.layout.textDesiredHeight = info.layout.numberOfLines * info.layout.lineHeight * this._getFontScale(info);
        if (info.layout.numberOfLines > 1) {
            info.layout.textDesiredHeight += (info.layout.numberOfLines - 1) * _lineSpacing;
        }

        info.outputLayoutData.nodeContentSize.width = info.layout.labelWidth;
        info.outputLayoutData.nodeContentSize.height = info.layout.labelHeight;
        if (info.layout.labelWidth <= 0) {
            info.outputLayoutData.nodeContentSize.width = parseFloat(longestLine.toFixed(2)) + shareLabelInfo.margin * 2;
        }
        if (info.layout.labelHeight <= 0) {
            info.outputLayoutData.nodeContentSize.height = parseFloat(info.layout.textDesiredHeight.toFixed(2)) + shareLabelInfo.margin * 2;
        }

        info.layout.tailoredTopY = info.outputLayoutData.nodeContentSize.height;
        info.layout.tailoredBottomY = 0;
        if (highestY > 0) {
            info.layout.tailoredTopY = info.outputLayoutData.nodeContentSize.height + highestY;
        }
        if (lowestY < -info.layout.textDesiredHeight) {
            info.layout.tailoredBottomY = info.layout.textDesiredHeight + lowestY;
        }

        return true;
    }

    private _recordPlaceholderInfo (letterIndex: number, char: string) {
        if (letterIndex >= this._lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            this._lettersInfo.push(tmpInfo);
        }

        this._lettersInfo[letterIndex].char = char;
        this._lettersInfo[letterIndex].hash = `${char.charCodeAt(0)}${shareLabelInfo.hash}`;
        this._lettersInfo[letterIndex].valid = false;
    }

    private _recordLetterInfo (letterPosition: Vec2, character: string, letterIndex: number, lineIndex: number) {
        if (letterIndex >= this._lettersInfo.length) {
            const tmpInfo = new LetterInfo();
            this._lettersInfo.push(tmpInfo);
        }

        const char = character.charCodeAt(0);
        const key = `${char}${shareLabelInfo.hash}`;

        this._lettersInfo[letterIndex].line = lineIndex;
        this._lettersInfo[letterIndex].char = character;
        this._lettersInfo[letterIndex].hash = key;
        this._lettersInfo[letterIndex].valid = shareLabelInfo.fontAtlas!.getLetter(key).valid;
        this._lettersInfo[letterIndex].x = letterPosition.x;
        this._lettersInfo[letterIndex].y = letterPosition.y;
    }

    private _getFirstWordLen (info: TextProcessData, text: string, startIndex: number, textLen: number) {
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
        let nextLetterX = letterDef.xAdvance * info.bmfontScale + info.layout.spacingX;
        let letterX = 0;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(character, shareLabelInfo);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef.offsetX * info.bmfontScale;

            if (letterX + letterDef.w * info.bmfontScale > info.layout.maxLineWidth
                && !isUnicodeSpace(character)
                && info.layout.maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef.xAdvance * info.bmfontScale + info.layout.spacingX;
            if (character === '\n'
                || isUnicodeSpace(character)
                || isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    }

    private _computeAlignmentOffset (info: TextProcessData) {
        info.layout.linesOffsetX.length = 0;
        info.layout.letterOffsetY = 0;

        switch (info.layout.hAlign) {
        case HorizontalTextAlignment.LEFT:
            for (let i = 0; i < info.layout.numberOfLines; ++i) {
                info.layout.linesOffsetX.push(0);
            }
            break;
        case HorizontalTextAlignment.CENTER:
            for (let i = 0, l = info.layout.linesWidth.length; i < l; i++) {
                info.layout.linesOffsetX.push((info.outputLayoutData.nodeContentSize.width - info.layout.linesWidth[i]) / 2);
            }
            break;
        case HorizontalTextAlignment.RIGHT:
            for (let i = 0, l = info.layout.linesWidth.length; i < l; i++) {
                info.layout.linesOffsetX.push(info.outputLayoutData.nodeContentSize.width - info.layout.linesWidth[i]);
            }
            break;
        default:
            break;
        }

        // TOP
        info.layout.letterOffsetY = info.outputLayoutData.nodeContentSize.height;
        if (info.layout.vAlign !== VerticalTextAlignment.TOP) {
            const blank = info.outputLayoutData.nodeContentSize.height - info.layout.textDesiredHeight
            + info.layout.lineHeight * this._getFontScale(info) - info.originFontSize * info.bmfontScale;
            if (info.layout.vAlign === VerticalTextAlignment.BOTTOM) {
                // BOTTOM
                info.layout.letterOffsetY -= blank;
            } else {
                // CENTER:
                info.layout.letterOffsetY -= blank / 2;
            }
        }
    }

    private _getFontScale (info: TextProcessData) {
        return info.layout.overFlow === Overflow.SHRINK ? info.bmfontScale : 1;
    }

    private _isVerticalClamp (info: TextProcessData, process: TextProcessing) {
        if (info.layout.textDesiredHeight > info.outputLayoutData.nodeContentSize.height) {
            return true;
        } else {
            return false;
        }
    }

    private _isHorizontalClamp (info: TextProcessData, process: TextProcessing) {
        let letterClamp = false;
        const _string = info.inputString;
        for (let ctr = 0, l = _string.length; ctr < l; ++ctr) {
            const letterInfo = process._lettersInfo[ctr];
            if (letterInfo.valid) {
                const letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(letterInfo.char, shareLabelInfo);
                if (!letterDef) {
                    continue;
                }

                const px = letterInfo.x + letterDef.w * info.bmfontScale;
                const lineIndex = letterInfo.line;
                if (info.layout.labelWidth > 0) {
                    if (!info.layout.wrapping) {
                        if (px > info.outputLayoutData.nodeContentSize.width) {
                            letterClamp = true;
                            break;
                        }
                    } else {
                        const wordWidth = info.layout.linesWidth[lineIndex];
                        if (wordWidth > info.outputLayoutData.nodeContentSize.width && (px > info.outputLayoutData.nodeContentSize.width || px < 0)) {
                            letterClamp = true;
                            break;
                        }
                    }
                }
            }
        }

        return letterClamp;
    }

    private _isHorizontalNeedShrink (info: TextProcessData) {
        let wordWidth = 0;
        for (let ctr = 0, l = info.layout.linesWidth.length; ctr < l; ++ctr) {
            wordWidth = info.layout.linesWidth[ctr];
            if (wordWidth > info.outputLayoutData.nodeContentSize.width) return true;
        }
        return false;
    }

    private _shrinkLabelToContentSize (info: TextProcessData, lambda: (info: TextProcessData, process: TextProcessing) => boolean) {
        const fontSize = info.actualFontSize;

        let left = 0;
        let right = fontSize | 0;
        let mid = 0;
        while (left < right) {
            mid = (left + right + 1) >> 1;

            const newFontSize = mid;
            if (newFontSize <= 0) {
                break;
            }

            info.bmfontScale = newFontSize / info.originFontSize;

            this._multilineTextWrap(info, this._getFirstWordLen);

            this._computeAlignmentOffset(info);

            if (lambda(info, this)) {
                right = mid - 1;
            } else {
                left = mid;
            }
        }

        if (left >= 0) {
            this._scaleFontSizeDown(info, left);
        }
    }

    private _scaleFontSizeDown (info: TextProcessData, fontSize: number) {
        let shouldUpdateContent = true;
        if (!fontSize) {
            fontSize = 0.1;
            shouldUpdateContent = false;
        }
        info.actualFontSize = fontSize;

        if (shouldUpdateContent) {
            this._updateFontScale(info);
            this._multilineTextWrap(info, this._getFirstWordLen);
        }
    }

    private _updateQuads (info: TextProcessData, callback) {
        const texture =  info.spriteFrame ? info.spriteFrame.texture : shareLabelInfo.fontAtlas!.getTexture();

        const appX = info.outputRenderData.uiTransAnchorX * info.outputLayoutData.nodeContentSize.width;
        const appY = info.outputRenderData.uiTransAnchorY * info.outputLayoutData.nodeContentSize.height;

        const ret = true;
        for (let ctr = 0, l = info.inputString.length; ctr < l; ++ctr) {
            const letterInfo = this._lettersInfo[ctr];
            if (!letterInfo.valid) { continue; }
            const letterDef = shareLabelInfo.fontAtlas!.getLetter(letterInfo.hash);
            if (!letterDef) {
                console.warn('Can\'t find letter in this bitmap-font');
                continue;
            }

            this._tmpRect.height = letterDef.h;
            this._tmpRect.width = letterDef.w;
            this._tmpRect.x = letterDef.u;
            this._tmpRect.y = letterDef.v;

            let py = letterInfo.y + info.layout.letterOffsetY;

            if (info.layout.labelHeight > 0) {
                if (py > info.layout.tailoredTopY) {
                    const clipTop = py - info.layout.tailoredTopY;
                    this._tmpRect.y += clipTop;
                    this._tmpRect.height -= clipTop;
                    py -= clipTop;
                }

                if ((py - this._tmpRect.height * info.bmfontScale < info.layout.tailoredBottomY) && info.layout.overFlow === Overflow.CLAMP) {
                    this._tmpRect.height = (py < info.layout.tailoredBottomY) ? 0 : (py - info.layout.tailoredBottomY) / info.bmfontScale;
                }
            }

            const lineIndex = letterInfo.line;
            const px = letterInfo.x + letterDef.w / 2 * info.bmfontScale + info.layout.linesOffsetX[lineIndex];

            if (info.layout.labelWidth > 0) {
                if (this._isHorizontalClamped(info, px, lineIndex)) {
                    if (info.layout.overFlow === Overflow.CLAMP) {
                        this._tmpRect.width = 0;
                    }
                }
            }

            if (this._tmpRect.height > 0 && this._tmpRect.width > 0) {
                const isRotated = this._determineRect(info);
                const letterPositionX = letterInfo.x + info.layout.linesOffsetX[letterInfo.line];
                const offset = info.outputRenderData.quadCount;
                info.outputRenderData.quadCount += 4; // Hard Code
                this.updateQuatCount(info);
                callback(info, offset, texture, this._tmpRect, isRotated, letterPositionX - appX, py - appY);
            }
        }
        return ret;
    }

    private _isHorizontalClamped (info: TextProcessData, px: number, lineIndex: number) {
        const wordWidth = info.layout.linesWidth[lineIndex];
        const letterOverClamp = (px > info.outputLayoutData.nodeContentSize.width || px < 0);

        if (!info.layout.wrapping) {
            return letterOverClamp;
        } else {
            return (wordWidth > info.outputLayoutData.nodeContentSize.width && letterOverClamp);
        }
    }

    private _determineRect (info: TextProcessData) {
        const _spriteFrame = info.spriteFrame;
        if (!_spriteFrame) return false; // for char mode
        const isRotated = _spriteFrame.isRotated();

        const originalSize = _spriteFrame.getOriginalSize();
        const rect = _spriteFrame.getRect();
        const offset = _spriteFrame.getOffset();
        const trimmedLeft = offset.x + (originalSize.width - rect.width) / 2;
        const trimmedTop = offset.y - (originalSize.height - rect.height) / 2;

        if (!isRotated) {
            this._tmpRect.x += (rect.x - trimmedLeft);
            this._tmpRect.y += (rect.y + trimmedTop);
        } else {
            const originalX = this._tmpRect.x;
            this._tmpRect.x = rect.x + rect.height - this._tmpRect.y - this._tmpRect.height - trimmedTop;
            this._tmpRect.y = originalX + rect.y - trimmedLeft;
            if (this._tmpRect.y < 0) {
                this._tmpRect.height += trimmedTop;
            }
        }

        return isRotated;
    }

    // -------------------- Multiple Quad Mode Part --------------------
}

TextProcessing.instance = new TextProcessing();
