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
import { logID } from '../../../core/platform';
import { Overflow } from '../../components/label';
import { BASELINE_RATIO, fragmentText, safeMeasureText } from '../../utils/text-utils';// 工具函数待整合
import { TextProcessData } from './text-process-data';

// 其只负责数据的处理和组织，不负责和具体的组件交互
// 两种方案，句子模式和拼接模式，需要做到上层无感的切换
// 接口不论上层是什么组件，都和处理层无关
// 处理层拿到信息之后进行组织
// 之后返回回去，可以针对数据进行判断是否要进行更新
// 返回的应该是顶点数组和图，请针对它进行更新操作

// 所以需要一个 TextProcessingData 来作为上层数据的提供者和处理器的返回者
export class TextProcessing {
    // 两个接口
    // 排版一个，渲染一个
    // 在进行 string 的分析的时候，也会计算出 node 的 content size
    // 有些奇怪，受到了组件化的影响,需要更新出contentSize
    public processingString (info: TextProcessData, out?: string[]) {
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
    }

    public generateRenderInfo (info: TextProcessData, out?: Float32Array[]) {
        // 处理 info 中的数据
        // 生成 渲染数据
        // 根据参数决定是否要 out
        // 会更新到 textProcessData 中的 vertexBuffer 中
    }

    private _context: CanvasRenderingContext2D | null = null; // 需要注意这个变量是否为零时使用的，穿插容易出现错误
    private _canvas: HTMLCanvasElement | null = null;

    private _calculateLabelFont (info: TextProcessData) {
        if (!this._context) {
            return;
        }

        const paragraphedStrings = info.inputString.split('\n');

        const _splitStrings = paragraphedStrings;
        const _fontDesc = this._getFontDesc(info._fontSize, info._fontFamily, false, false);
        this._context.font = _fontDesc;

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
            const rawHeight = (_splitStrings.length + BASELINE_RATIO) * this._getLineHeight(info._lineHeight, info._actualFontSize, info._fontSize);// 定义不明
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
        let _fontDesc = this._getFontDesc(info._fontSize, info._fontFamily, false, false);
        const paragraphLength = this._calculateParagraphLength(paragraphedStrings, this._context, _fontDesc);

        let i = 0;
        let totalHeight = 0;
        let maxLength = 0;

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
            let fontDesc = '';

            while (left < right) {
                mid = (left + right + 1) >> 1;

                if (mid <= 0) {
                    logID(4003);
                    break;
                }

                info._actualFontSize = mid;
                fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, false, false);
                this._context.font = _fontDesc;
                const lineHeight = this._getLineHeight(info._lineHeight, info._actualFontSize, info._actualFontSize);

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
                info._actualFontSize = left;
                _fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, false, false);
                this._context.font = _fontDesc;// 会有问题，不可使用 context 来存储信息
            }
        } else {
            totalHeight = paragraphedStrings.length * this._getLineHeight(info._lineHeight, info._actualFontSize, info._actualFontSize);

            for (i = 0; i < paragraphedStrings.length; ++i) {
                if (maxLength < paragraphLength[i]) {
                    maxLength = paragraphLength[i];
                }
            }
            const scaleX = (info._canvasSize.width - info._canvasPadding.width) / maxLength;
            const scaleY = info._canvasSize.height / totalHeight;

            info._actualFontSize = (info._actualFontSize * Math.min(1, scaleX, scaleY)) | 0; // 进行字号缩放
            _fontDesc = this._getFontDesc(info._actualFontSize, info._fontFamily, false, false); // 需要保存
            this._context.font = _fontDesc;
        }
    }

    private _calculateWrapText (paragraphedStrings: string[], info: TextProcessData) {
        if (!info._wrapping || !this._context) return; // 用于提前判断是否能够换行

        let _splitStrings: string[] = [];
        const canvasWidthNoMargin = info._nodeContentSize.width;
        const _fontDesc = this._getFontDesc(info._fontSize, info._fontFamily, false, false);
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
}
