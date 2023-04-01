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
import { BASELINE_RATIO, fragmentText, getBaselineOffset, isUnicodeCJK, isUnicodeSpace, safeMeasureText } from '../../utils/text-utils';// 工具函数待整合
import { CanvasPool, shareLabelInfo } from './font-utils';
import { TextProcessData } from './text-process-data';

// 其只负责数据的处理和组织，不负责和具体的组件交互
// 两种方案，句子模式和拼接模式，需要做到上层无感的切换
// 接口不论上层是什么组件，都和处理层无关
// 处理层拿到信息之后进行组织
// 之后返回回去，可以针对数据进行判断是否要进行更新
// 返回的应该是顶点数组和图，请针对它进行更新操作

// 用于将对齐枚举转换为字符串
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

// 所以需要一个 TextProcessingData 来作为上层数据的提供者和处理器的返回者
export class TextProcessing {
    // -------------------- 公用公开接口部分 --------------------------
    public static instance: TextProcessing;
    constructor () {
        const data = CanvasPool.getInstance().get();
        this._canvas = data.canvas;
        this._context = data.context;
    }

    public destroy () {
    }

    // 两个接口
    // 排版一个，渲染一个
    // 在进行 string 的分析的时候，也会计算出 node 的 content size
    // 有些奇怪，受到了组件化的影响,需要更新出contentSize
    // 能否将节点信息更新的过程拆分出来
    public processingString (info: TextProcessData, out?: string[]) {
        if (!info.isBmFont) {
            // 返回处理过换行甚至是字间排版的数据？
            // 相通之处在于目前只需要存换好行的数据
            // 先进行 padding 的计算
            // if (info.styleChange)
            this._updatePaddingRect(info);
            // 类似于 richText 的拆分
            this._calculateLabelFont(info);
            if (out) {
                out = info.parsedString; // 不太好
            }
        } else {
            this._setupBMFontOverflowMetrics(info);
            this._updateFontScale(info);
            this._computeHorizontalKerningForText(info); // char 模式分化
            this._alignText(info);// 换行操作

            if (out) {
                out = info.parsedString; // 不太好
            }
        }
    }

    public generateRenderInfo (info: TextProcessData, callback: AnyFunction, out?: number[]) {
        if (!info.isBmFont) {
        // 处理 info 中的数据
        // 生成 渲染数据
        // 根据参数决定是否要 out
        // 会更新到 textProcessData 中的 vertexBuffer 中
        // 使用之前需要同步一次 context 的信息
            this._updateLabelDimensions(info);
            this._updateTexture(info);
            this.generateVertexData(info, callback);
            if (out) {
                out = info.vertexBuffer; // 不太好
            }
        } else {
            this._computeAlignmentOffset(info); // 和分解字符无关， 和排版渲染相关
            this.generateVertexData(info, callback);
            if (out) {
                out = info.vertexBuffer; // 不太好
            }
        }
    }
    // -------------------- 公用公开接口部分 --------------------------

    // -------------------- 句子模式处理部分 --------------------------

    // -------------------- 换行处理部分 --------------------------
    private _context: CanvasRenderingContext2D | null = null; // 需要注意这个变量是否为零时使用的，穿插容易出现错误
    private _canvas: HTMLCanvasElement | null = null;

    private _calculateLabelFont (info: TextProcessData) {
        if (!this._context) {
            return;
        }

        info._actualFontSize = info._fontSize;
        const paragraphedStrings = info.inputString.split('\n');

        const _splitStrings = info.parsedString = paragraphedStrings;
        const _fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, info.isBold, info.isItalic);
        this._context.font = info._fontDesc = _fontDesc;

        switch (info._overFlow) {
        case Overflow.NONE: {
            let canvasSizeX = 0;
            let canvasSizeY = 0;
            for (let i = 0; i < paragraphedStrings.length; ++i) {
                const paraLength = safeMeasureText(this._context, paragraphedStrings[i], _fontDesc);
                canvasSizeX = canvasSizeX > paraLength ? canvasSizeX : paraLength;
            }
            canvasSizeY = (_splitStrings.length + BASELINE_RATIO) * this._getLineHeight(info._lineHeight, info._actualFontSize, info._fontSize);// 定义不明
            const rawWidth = parseFloat(canvasSizeX.toFixed(2));
            const rawHeight = parseFloat(canvasSizeY.toFixed(2));
            // 设置其他的上层使用的信息，可以用于输出
            info._canvasSize.width = rawWidth + info._canvasPadding.width;
            info._canvasSize.height = rawHeight + info._canvasPadding.height;
            info._nodeContentSize.width = rawWidth + info._contentSizeExtend.width;
            info._nodeContentSize.height = rawHeight + info._contentSizeExtend.height;
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
            const rawHeight = (info.parsedString.length + BASELINE_RATIO) * this._getLineHeight(info._lineHeight, info._actualFontSize, info._fontSize);// 定义不明
            // 设置其他的上层使用的信息，可以用于输出
            info._canvasSize.height = rawHeight + info._canvasPadding.height;
            // set node height
            info._nodeContentSize.height = rawHeight + info._contentSizeExtend.height;
            break;
        }
        default: {
            // nop
        }
        }
    }

    // 或者这一步提前组织好，存在 data 里
    // 比如 info.fontStyle
    // 由于访问频繁，存在 data 里是一个更好的选择
    // 可以做缓存
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

    // 做个缓存，既然我不是状态机了那么这些值直接取就行了
    // 注意所有使用的地方可能都有问题
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
        let _fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, info.isBold, info.isItalic);
        const paragraphLength = this._calculateParagraphLength(paragraphedStrings, this._context, _fontDesc);

        let i = 0;
        let totalHeight = 0;
        let maxLength = 0;
        let _fontSize = info._actualFontSize;

        if (info._wrapping) {
            const canvasWidthNoMargin = info._nodeContentSize.width; // 提供最大的换行宽度
            const canvasHeightNoMargin = info._nodeContentSize.height;
            if (canvasWidthNoMargin < 0 || canvasHeightNoMargin < 0) {
                return;
            }
            totalHeight = canvasHeightNoMargin + 1;
            const actualFontSize = info._fontSize + 1;
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
                _fontDesc = this._getFontDesc(_fontSize, info._fontFamily, info.isBold, info.isItalic);
                this._context.font = _fontDesc;
                const lineHeight = this._getLineHeight(info._lineHeight, _fontSize, info._fontSize); //小心

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
                _fontDesc = this._getFontDesc(_fontSize, info._fontFamily, info.isBold, info.isItalic);
                this._context.font = _fontDesc;// 会有问题，不可使用 context 来存储信息
            }
        } else {
            totalHeight = paragraphedStrings.length * this._getLineHeight(info._lineHeight, _fontSize, info._fontSize);

            for (i = 0; i < paragraphedStrings.length; ++i) {
                if (maxLength < paragraphLength[i]) {
                    maxLength = paragraphLength[i];
                }
            }
            const scaleX = (info._canvasSize.width - info._canvasPadding.width) / maxLength;
            const scaleY = info._canvasSize.height / totalHeight;

            _fontSize = (info._fontSize * Math.min(1, scaleX, scaleY)) | 0; // 进行字号缩放
            _fontDesc = this._getFontDesc(_fontSize, info._fontFamily, info.isBold, info.isItalic); // 需要保存
            this._context.font = _fontDesc;
        }

        info._actualFontSize = _fontSize;
        info._fontDesc = _fontDesc;
    }

    private _calculateWrapText (paragraphedStrings: string[], info: TextProcessData) {
        if (!info._wrapping || !this._context) return; // 用于提前判断是否能够换行

        let _splitStrings: string[] = [];
        const canvasWidthNoMargin = info._nodeContentSize.width;
        const _fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, info.isBold, info.isItalic);
        for (let i = 0; i < paragraphedStrings.length; ++i) {
            const allWidth = safeMeasureText(this._context, paragraphedStrings[i], _fontDesc);
            const textFragment = fragmentText(paragraphedStrings[i],
                allWidth,
                canvasWidthNoMargin,
                this._measureText(this._context, _fontDesc));
            _splitStrings = _splitStrings.concat(textFragment);
        }
        info.parsedString = _splitStrings;
        // 是否要 return _splitStrings
        info._fontDesc = _fontDesc; // 同步时机在这里不合适
    }

    private _measureText (ctx: CanvasRenderingContext2D, fontDesc) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

    // 在对齐之前执行
    // 是收到后效影响的位置偏移
    // 比如斜体 contentSize 要宽一些才行
    private _updatePaddingRect (info: TextProcessData) {
        let top = 0; let bottom = 0; let left = 0; let right = 0;
        let outlineWidth = 0;
        info._contentSizeExtend.width = info._contentSizeExtend.height = 0;
        if (info._isOutlined) {
            outlineWidth = info.outlineWidth;
            top = bottom = left = right = outlineWidth;
            info._contentSizeExtend.width = info._contentSizeExtend.height = outlineWidth * 2;
        }
        if (info._hasShadow) {
            const shadowWidth = info.shadowBlur + outlineWidth;
            const offsetX = info.shadowOffsetX;
            const offsetY = info.shadowOffsetY;
            left = Math.max(left, -offsetX + shadowWidth);
            right = Math.max(right, offsetX + shadowWidth);
            top = Math.max(top, offsetY + shadowWidth);
            bottom = Math.max(bottom, -offsetY + shadowWidth);
        }
        if (info.isItalic) {
            // 0.0174532925 = 3.141592653 / 180
            const offset = info._actualFontSize * Math.tan(12 * 0.0174532925);
            right += offset;
            info._contentSizeExtend.width += offset;
        }
        info._canvasPadding.x = left;
        info._canvasPadding.y = top;
        info._canvasPadding.width = left + right;
        info._canvasPadding.height = top + bottom;
    }

    // -------------------- 换行处理部分 --------------------------

    // -------------------- 渲染处理部分 --------------------------

    // 同步处理一次 context 使用的信息
    private _updateLabelDimensions (info: TextProcessData) {
        info._canvasSize.width = Math.min(info._canvasSize.width, MAX_SIZE);
        info._canvasSize.height = Math.min(info._canvasSize.height, MAX_SIZE);

        let recreate = false;
        if (this._canvas!.width !== info._canvasSize.width) {
            this._canvas!.width = info._canvasSize.width;
            recreate = true;
        }

        if (this._canvas!.height !== info._canvasSize.height) {
            this._canvas!.height = info._canvasSize.height;
            recreate = true;
        }

        if (recreate) this._context!.font = info._fontDesc;
        // align
        this._context!.textAlign = Alignment[info._hAlign] as any;
        this._context!.textBaseline = 'alphabetic';
    }

    private _calculateFillTextStartPosition (info: TextProcessData) {
        let labelX = 0;
        if (info._hAlign === HorizontalTextAlignment.RIGHT) {
            labelX = info._canvasSize.width - info._canvasPadding.width;
        } else if (info._hAlign === HorizontalTextAlignment.CENTER) {
            labelX = (info._canvasSize.width - info._canvasPadding.width) / 2;
        }

        const lineHeight = this._getLineHeight(info._lineHeight, info._actualFontSize, info._fontSize);
        const drawStartY = lineHeight * (info.parsedString.length - 1);
        // TOP
        let firstLinelabelY = info._actualFontSize * (1 - BASELINE_RATIO / 2);
        if (info._vAlign !== VerticalTextAlignment.TOP) {
            // free space in vertical direction
            let blank = drawStartY + info._canvasPadding.height + info._actualFontSize - info._canvasSize.height;
            if (info._vAlign === VerticalTextAlignment.BOTTOM) {
                // Unlike BMFont, needs to reserve space below.
                blank += BASELINE_RATIO / 2 * info._actualFontSize;
                // BOTTOM
                firstLinelabelY -= blank;
            } else {
                // CENTER
                firstLinelabelY -= blank / 2;
            }
        }

        firstLinelabelY += _BASELINE_OFFSET * info._actualFontSize;

        info._startPosition.set(labelX + info._canvasPadding.x, firstLinelabelY + info._canvasPadding.y);
    }

    private _updateTexture (info: TextProcessData) {
        if (!this._context || !this._canvas) {
            return;
        }

        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        this._context.font = info._fontDesc;

        this._calculateFillTextStartPosition(info);
        const lineHeight = this._getLineHeight(info._lineHeight, info._actualFontSize, info._fontSize);
        // use round for line join to avoid sharp intersect point
        this._context.lineJoin = 'round';

        if (info._isOutlined) {
            this._context.fillStyle = `rgba(${info._outlineColor.r}, ${info._outlineColor.g}, ${info._outlineColor.b}, ${_invisibleAlpha})`;
            // Notice: fillRect twice will not effect
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        } else {
            this._context.fillStyle = `rgba(${info._color.r}, ${info._color.g}, ${info._color.b}, ${_invisibleAlpha})`;
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
        this._context.fillStyle = `rgb(${info._color.r}, ${info._color.g}, ${info._color.b})`;
        const drawTextPosX = info._startPosition.x;
        let drawTextPosY = 0;
        // draw shadow and underline
        this._drawTextEffect(info._startPosition, lineHeight, info);
        // draw text and outline
        for (let i = 0; i < info.parsedString.length; ++i) {
            drawTextPosY = info._startPosition.y + i * lineHeight;
            if (info._isOutlined) {
                this._context.strokeText(info.parsedString[i], drawTextPosX, drawTextPosY);
            }
            this._context.fillText(info.parsedString[i], drawTextPosX, drawTextPosY);
        }

        if (info._hasShadow) {
            this._context.shadowColor = 'transparent';
        }

        this._uploadTexture(info);
    }

    private _uploadTexture (info: TextProcessData) {
        // May better for JIT
        // if (comp.cacheMode === Label.CacheMode.BITMAP) {
        //     const frame = comp.ttfSpriteFrame!;
        //     dynamicAtlasManager.deleteAtlasSpriteFrame(frame);
        //     frame._resetDynamicAtlasFrame();
        // }

        if (info._texture && this._canvas) {
            let tex: Texture2D;
            if (info._texture instanceof SpriteFrame) {
                tex = (info._texture.texture as Texture2D);
            } else {
                tex = info._texture;
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
                if (info._texture instanceof SpriteFrame) {
                    info._texture.rect = new Rect(0, 0, this._canvas.width, this._canvas.height);
                    info._texture._calculateUV();
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
        if (!info._hasShadow && !info._isOutlined && !info.isUnderline) return;

        const isMultiple = info.parsedString.length > 1 && info._hasShadow;
        const measureText = this._measureText(this._context!, info._fontDesc);
        let drawTextPosX = 0;
        let drawTextPosY = 0;

        // only one set shadow and outline
        if (info._hasShadow) {
            this._setupShadow(info);
        }

        if (info._isOutlined) {
            this._setupOutline(info);
        }

        // draw shadow and (outline or text)
        for (let i = 0; i < info.parsedString.length; ++i) {
            drawTextPosX = startPosition.x;
            drawTextPosY = startPosition.y + i * lineHeight;
            // multiple lines need to be drawn outline and fill text
            if (isMultiple) {
                if (info._isOutlined) {
                    this._context!.strokeText(info.parsedString[i], drawTextPosX, drawTextPosY);
                }
                this._context!.fillText(info.parsedString[i], drawTextPosX, drawTextPosY);
            }

            // draw underline
            if (info.isUnderline) {
                const _drawUnderlineWidth = measureText(info.parsedString[i]);
                const _drawUnderlinePos = new Vec2();
                if (info._hAlign === HorizontalTextAlignment.RIGHT) {
                    _drawUnderlinePos.x = startPosition.x - _drawUnderlineWidth;
                } else if (info._hAlign === HorizontalTextAlignment.CENTER) {
                    _drawUnderlinePos.x = startPosition.x - (_drawUnderlineWidth / 2);
                } else {
                    _drawUnderlinePos.x = startPosition.x;
                }
                _drawUnderlinePos.y = drawTextPosY + info._actualFontSize / 8;
                this._context!.fillRect(_drawUnderlinePos.x, _drawUnderlinePos.y, _drawUnderlineWidth, info.underlineHeight);
            }
        }

        if (isMultiple) {
            this._context!.shadowColor = 'transparent';
        }
    }

    private _setupOutline (info: TextProcessData) {
        this._context!.strokeStyle = `rgba(${info._outlineColor.r}, ${info._outlineColor.g}, ${info._outlineColor.b}, ${info._outlineColor.a / 255})`;
        this._context!.lineWidth = info.outlineWidth * 2;
    }

    private _setupShadow (info: TextProcessData) {
        this._context!.shadowColor = `rgba(${info.shadowColor.r}, ${info.shadowColor.g}, ${info.shadowColor.b}, ${info.shadowColor.a / 255})`;
        this._context!.shadowBlur = info.shadowBlur;
        this._context!.shadowOffsetX = info.shadowOffsetX;
        this._context!.shadowOffsetY = -info.shadowOffsetY;
    }

    // -------------------- 渲染处理部分 --------------------------

    private generateVertexData (info: TextProcessData, callback: AnyFunction) {
        if (!info.isBmFont) {
            this.updateQuatCount(info); // 更新vbBuffer数量

            // 对于不同的模式，存在不同的顶点对接方式
            callback(info);
        } else {
            // 对于不同的模式，存在不同的顶点对接方式
            this._updateQuads(info, callback);

            // callback(info);
        }
    }

    private updateQuatCount (info: TextProcessData) {
        const data: IRenderData[] = info.vertexBuffer;
        const count = info.quadCount;
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

    // -------------------- 句子模式处理部分 --------------------------
    // -------------------- 单字模式处理部分 --------------------------

    // 处理之前的预计算
    private _setupBMFontOverflowMetrics (info: TextProcessData) {
        let newWidth = info._nodeContentSize.width;
        let newHeight = info._nodeContentSize.height;

        if (info._overFlow === Overflow.RESIZE_HEIGHT) {
            newHeight = 0;
        }

        if (info._overFlow === Overflow.NONE) {
            newWidth = 0;
            newHeight = 0;
        }

        info._labelWidth = newWidth;
        info._labelHeight = newHeight;
        info._labelDimensions.width = newWidth;
        info._labelDimensions.height = newHeight;
        info._maxLineWidth = newWidth;
    }

    private _updateFontScale (info: TextProcessData) {
        info._bmfontScale = info._actualFontSize / info._originFontSize;
    }

    private _computeHorizontalKerningForText (info: TextProcessData) {
        const string = info.inputString;
        const stringLen = string.length;

        const kerningDict = info._fntConfig!.kerningDict; // 应该是用于处理连词的
        const horizontalKerning = info._horizontalKerning; // 不重置的话可能存在泄露风险

        if (!kerningDict || kerningDict.length === 0) { // 新加了保护
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
        this._multilineTextWrap(info, this._getFirstWordLen);// 先尝试计算一次换行信息

        // shrink
        if (info._overFlow === Overflow.SHRINK) {
            if (info._fontSize > 0 && this._isVerticalClamp(info, this)) {
                this._shrinkLabelToContentSize(info, this._isVerticalClamp); // 竖直字号处理完毕
            }
            // 然后这里加个条件，判断上面的字号是不是需要横向缩小？
            if (info._fontSize > 0 && this._isHorizontalClamped(info)) {
                this._shrinkLabelToContentSize(info, this._isHorizontalClamp);
            }
        }
        // 分析完成，取行号和结果出来
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
        info.parsedString = _splitStrings;
    }

    // hack
    private _numberOfLines = 0;
    private _textDesiredHeight = 0;
    private _multilineTextWrap (info: TextProcessData, nextTokenFunc: (arg0: TextProcessData, arg1: string, arg2: number, arg3: number) => number) {
        info._textDesiredHeight = 0; // 跨函数临时变量 // 存 data 不合适
        info._linesWidth.length = 0; // 跨函数临时变量 // 存 data 不合适

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

        const _lineSpacing = 0; // 这个也是？有啥用？？？？？？原代码还是个全局变量

        for (let index = 0; index < textLen;) {
            let character = _string.charAt(index);
            if (character === '\n') {
                info._linesWidth.push(letterRight);
                letterRight = 0;
                lineIndex++;
                nextTokenX = 0;
                nextTokenY -= info._lineHeight * this._getFontScale(info) + _lineSpacing;
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
                        info._fntConfig!.atlasName} for letter:${character}`);
                    continue;
                }

                const letterX = nextLetterX + letterDef.offsetX * info._bmfontScale - shareLabelInfo.margin;

                if (info._wrapping
                    && info._maxLineWidth > 0
                    && nextTokenX > 0
                    && letterX + letterDef.w * info._bmfontScale > info._maxLineWidth
                    && !isUnicodeSpace(character)) {
                    info._linesWidth.push(letterRight);
                    letterRight = 0;
                    lineIndex++;
                    nextTokenX = 0;
                    nextTokenY -= (info._lineHeight * this._getFontScale(info) + _lineSpacing);
                    newLine = true;
                    break;
                } else {
                    letterPosition.x = letterX;
                }

                letterPosition.y = nextTokenY - letterDef.offsetY * info._bmfontScale;
                this._recordLetterInfo(letterPosition, character, letterIndex, lineIndex); // 换行信息录入 // 应该此处就可以分割了

                if (letterIndex + 1 < info._horizontalKerning.length && letterIndex < textLen - 1) {
                    nextLetterX += info._horizontalKerning[letterIndex + 1];
                }

                nextLetterX += letterDef.xAdvance * info._bmfontScale + info._spacingX;

                tokenRight = letterPosition.x + letterDef.w * info._bmfontScale;

                if (tokenHighestY < letterPosition.y) {
                    tokenHighestY = letterPosition.y;
                }

                if (tokenLowestY > letterPosition.y - letterDef.h * info._bmfontScale) {
                    tokenLowestY = letterPosition.y - letterDef.h * info._bmfontScale;
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

        info._linesWidth.push(letterRight);

        this._numberOfLines = lineIndex + 1;
        this._textDesiredHeight = this._numberOfLines * info._lineHeight * this._getFontScale(info);
        if (this._numberOfLines > 1) {
            this._textDesiredHeight += (this._numberOfLines - 1) * _lineSpacing;
        }

        info._nodeContentSize.width = info._labelWidth;
        info._nodeContentSize.height = info._labelHeight;
        if (info._labelWidth <= 0) {
            info._nodeContentSize.width = parseFloat(longestLine.toFixed(2)) + shareLabelInfo.margin * 2;
        }
        if (info._labelHeight <= 0) {
            info._nodeContentSize.height = parseFloat(this._textDesiredHeight.toFixed(2)) + shareLabelInfo.margin * 2;
        }

        info._tailoredTopY = info._nodeContentSize.height;
        info._tailoredBottomY = 0;
        if (highestY > 0) {
            info._tailoredTopY = info._nodeContentSize.height + highestY;
        }
        if (lowestY < -this._textDesiredHeight) {
            info._tailoredBottomY = this._textDesiredHeight + lowestY;
        }

        return true;
    }

    // 这个值公用可能比较危险，因为是俩函数了
    private _lettersInfo: LetterInfo[] = []; // 尝试公用 // 需要管理，之前那个写法可能会泄露
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
        let nextLetterX = letterDef.xAdvance * info._bmfontScale + info._spacingX;
        let letterX = 0;
        for (let index = startIndex + 1; index < textLen; ++index) {
            character = text.charAt(index);

            letterDef = shareLabelInfo.fontAtlas!.getLetterDefinitionForChar(character, shareLabelInfo);
            if (!letterDef) {
                break;
            }
            letterX = nextLetterX + letterDef.offsetX * info._bmfontScale;

            if (letterX + letterDef.w * info._bmfontScale > info._maxLineWidth
                && !isUnicodeSpace(character)
                && info._maxLineWidth > 0) {
                return len;
            }
            nextLetterX += letterDef.xAdvance * info._bmfontScale + info._spacingX;
            if (character === '\n'
                || isUnicodeSpace(character)
                || isUnicodeCJK(character)) {
                break;
            }
            len++;
        }

        return len;
    }

    private _linesOffsetX: number[] = [];
    private _letterOffsetY = 0;
    private _computeAlignmentOffset (info: TextProcessData) {
        this._linesOffsetX.length = 0;

        switch (info._hAlign) {
        case HorizontalTextAlignment.LEFT:
            for (let i = 0; i < this._numberOfLines; ++i) {
                this._linesOffsetX.push(0);
            }
            break;
        case HorizontalTextAlignment.CENTER:
            for (let i = 0, l = info._linesWidth.length; i < l; i++) {
                this._linesOffsetX.push((info._nodeContentSize.width - info._linesWidth[i]) / 2);
            }
            break;
        case HorizontalTextAlignment.RIGHT:
            for (let i = 0, l = info._linesWidth.length; i < l; i++) {
                this._linesOffsetX.push(info._nodeContentSize.width - info._linesWidth[i]);
            }
            break;
        default:
            break;
        }

        // TOP
        this._letterOffsetY = info._nodeContentSize.height;
        if (info._vAlign !== VerticalTextAlignment.TOP) {
            const blank = info._nodeContentSize.height - this._textDesiredHeight
            + info._lineHeight * this._getFontScale(info) - info._originFontSize * info._bmfontScale;
            if (info._vAlign === VerticalTextAlignment.BOTTOM) {
                // BOTTOM
                this._letterOffsetY -= blank;
            } else {
                // CENTER:
                this._letterOffsetY -= blank / 2;
            }
        }
    }

    private _getFontScale (info: TextProcessData) {
        return info._overFlow === Overflow.SHRINK ? info._bmfontScale : 1;
    }

    private _isVerticalClamp (info: TextProcessData, process: TextProcessing) {
        if (process._textDesiredHeight > info._nodeContentSize.height) {
            return true;
        } else {
            return false;
        }
    }

    // 这里，实际上就遍历了 // 有点伤
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

                const px = letterInfo.x + letterDef.w * info._bmfontScale;
                const lineIndex = letterInfo.line;
                if (info._labelWidth > 0) {
                    if (!info._wrapping) {
                        if (px > info._nodeContentSize.width) {
                            letterClamp = true;
                            break;
                        }
                    } else {
                        const wordWidth = info._linesWidth[lineIndex];
                        if (wordWidth > info._nodeContentSize.width && (px > info._nodeContentSize.width || px < 0)) {
                            letterClamp = true;
                            break;
                        }
                    }
                }
            }
        }

        return letterClamp;
    }

    // 可能存在 px 的问题，不必要的累加
    private _isHorizontalClamped (info: TextProcessData) {
        let wordWidth = 0;
        for (let ctr = 0, l = info._linesWidth.length; ctr < l; ++ctr) {
            wordWidth = info._linesWidth[ctr];
            if (wordWidth > info._nodeContentSize.width) return true;
        }
        return false;
    }

    private _shrinkLabelToContentSize (info: TextProcessData, lambda: (info: TextProcessData, process: TextProcessing) => boolean) {
        const fontSize = info._actualFontSize;

        let left = 0;
        let right = fontSize | 0;
        let mid = 0;
        while (left < right) {
            mid = (left + right + 1) >> 1;

            const newFontSize = mid;
            if (newFontSize <= 0) {
                break;
            }

            // 注意此处赋值可能带来的流程不统一的问题
            info._bmfontScale = newFontSize / info._originFontSize; // 可以考虑在函数外同步

            this._multilineTextWrap(info, this._getFirstWordLen);

            this._computeAlignmentOffset(info);

            if (lambda(info, this)) { // 不行不行
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
        info._actualFontSize = fontSize; // 可能只要这一步就够了

        if (shouldUpdateContent) {
            this._updateFontScale(info); // 这步也是
            this._multilineTextWrap(info, this._getFirstWordLen); // 这部不一定要啊
        }
    }

    private _tmpRect = new Rect(); // 跨函数的临时变量
    private _updateQuads (info: TextProcessData, callback) {
        // 这个取 spriteFrame 的操作有点奇怪
        const texture =  info._spriteFrame ? info._spriteFrame.texture : shareLabelInfo.fontAtlas!.getTexture();

        const appX = info.uiTransAnchorX * info._nodeContentSize.width;
        const appY = info.uiTransAnchorY * info._nodeContentSize.height;

        const ret = true;
        for (let ctr = 0, l = info.inputString.length; ctr < l; ++ctr) {
            const letterInfo = this._lettersInfo[ctr]; // 危险
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

            let py = letterInfo.y + this._letterOffsetY;

            if (info._labelHeight > 0) {
                if (py > info._tailoredTopY) {
                    const clipTop = py - info._tailoredTopY;
                    this._tmpRect.y += clipTop;
                    this._tmpRect.height -= clipTop;
                    py -= clipTop;
                }

                if ((py - this._tmpRect.height * info._bmfontScale < info._tailoredBottomY) && info._overFlow === Overflow.CLAMP) {
                    this._tmpRect.height = (py < info._tailoredBottomY) ? 0 : (py - info._tailoredBottomY) / info._bmfontScale;
                }
            }

            const lineIndex = letterInfo.line; // 关键位置，这个行号说明了是第几行
            const px = letterInfo.x + letterDef.w / 2 * info._bmfontScale + this._linesOffsetX[lineIndex];

            if (info._labelWidth > 0) {
                if (this._isHorizontalClamped(info)) { // px 的风险
                    if (info._overFlow === Overflow.CLAMP) {
                        this._tmpRect.width = 0;
                    }
                }
            }

            if (this._tmpRect.height > 0 && this._tmpRect.width > 0) {
                const isRotated = this._determineRect(info);
                const letterPositionX = letterInfo.x + this._linesOffsetX[letterInfo.line];
                const offset = info.quadCount; // hack
                info.quadCount += 4; // hack
                this.updateQuatCount(info); // 更新vbBuffer数量
                callback(info, offset, texture, this._tmpRect, isRotated, letterPositionX - appX, py - appY);
            }
        }
        return ret;
    }

    _determineRect (info: TextProcessData) {
        const _spriteFrame = info._spriteFrame;
        const isRotated = _spriteFrame!.isRotated();

        const originalSize = _spriteFrame!.getOriginalSize();
        const rect = _spriteFrame!.getRect();
        const offset = _spriteFrame!.getOffset();
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

    // -------------------- 单字模式处理部分 --------------------------
}

TextProcessing.instance = new TextProcessing();
