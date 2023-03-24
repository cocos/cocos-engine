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
import { HorizontalTextAlignment, Overflow, VerticalTextAlignment } from '../../components/label';
import { BASELINE_RATIO, fragmentText, getBaselineOffset, safeMeasureText } from '../../utils/text-utils';// 工具函数待整合
import { CanvasPool } from './font-utils';
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

// 所以需要一个 TextProcessingData 来作为上层数据的提供者和处理器的返回者
export class TextProcessing {
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

    public generateRenderInfo (info: TextProcessData, out?: number[]) {
        // 处理 info 中的数据
        // 生成 渲染数据
        // 根据参数决定是否要 out
        // 会更新到 textProcessData 中的 vertexBuffer 中
        // 使用之前需要同步一次 context 的信息
        this._updateLabelDimensions(info);
        this._updateTexture(info);
        this.generateVertexData(info);
        if (out) {
            out = info.vertexBuffer; // 不太好
        }
    }

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

    private generateVertexData (info: TextProcessData) {
        this.updateQuatCount(info); // 更新vbBuffer数量
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
}

TextProcessing.instance = new TextProcessing();
