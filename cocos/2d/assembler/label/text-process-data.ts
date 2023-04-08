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

import { Material, Texture2D } from '../../../asset/assets';
import { Color, Rect, Size, Vec2 } from '../../../core';
import { SpriteFrame } from '../../assets';
import { FontAtlas, IConfig } from '../../assets/bitmap-font';
import { LetterAtlas } from './font-utils';
import { IRenderData } from './text-processing';

export class TextProcessData {
    // ---------------Common part-----------------
    // type
    public isBmFont = false;

    // font
    // public _font: Font | null = null; // ttf only
    public fontFamily = 'Arial'; // both
    public isSystemFontUsed = false; // both // ttf & char

    // effect
    public fontDesc = ''; // both
    public fontSize = 40; // input fonSize // both
    public actualFontSize = 0; // both
    // public declare _material: Material | null;

    public color = Color.WHITE.clone(); // both

    // Layout
    // alignment
    public hAlign = 0;// Enum  // both
    public vAlign = 0;// Enum // both

    public wrapping = true; // both
    public overFlow = 0;// Enum  // both

    // public _maxWidth = 0; // use less
    public lineHeight = 10; // both

    // Process Output
    public quadCount = 0; // both
    public vertexBuffer: IRenderData[] = []; // both
    public texture: Texture2D | SpriteFrame | null = null;  // both

    // string before process
    public inputString = ''; // both
    // string after process
    public parsedString: string[] = [];
    // public parsedStringStyle; // Prepare for merging richtext

    // node part
    public nodeContentSize = Size.ZERO.clone(); // both
    // anchor
    public uiTransAnchorX = 0.5; // both
    public uiTransAnchorY = 0.5; // both

    // ---------------ttf extra part-----------------
    // bold // style
    public isBold = false; // ttf
    // Italic // style
    public isItalic = false; // ttf
    // under line // style
    public isUnderline = false; // ttf
    public underlineHeight = 1; // ttf
    // outline style
    public isOutlined = false; // both // ttf & char
    public outlineColor = Color.WHITE.clone(); // both // ttf & char
    public outlineWidth = 1; // both // ttf & char
    // shadowStyle
    public hasShadow = false; // ttf
    public shadowColor = Color.BLACK.clone(); // ttf
    public shadowBlur = 2; // ttf
    public shadowOffsetX = 0; // ttf
    public shadowOffsetY = 0; // ttf

    // Node info
    public canvasSize = new Size(); // ttf

    public canvasPadding = new Rect(); // ttf
    public contentSizeExtend = Size.ZERO.clone(); // ttf

    public startPosition = Vec2.ZERO.clone(); // ttf

    // -----------------------bitMap extra part-------------------------

    public fntConfig: IConfig | null = null;
    public fontAtlas: FontAtlas | LetterAtlas | null = null;
    public spriteFrame: SpriteFrame | null = null;

    public spacingX = 0;
    public originFontSize = 0;

    public bmfontScale = 1.0;

    // bmfont used temp value
    public labelWidth = 0;
    public labelHeight = 0;
    public labelDimensions = new Size();
    public maxLineWidth = 0;

    public tailoredTopY = 0;
    public tailoredBottomY = 0;

    public horizontalKerning: number[] = [];

    public numberOfLines = 1;
    public textDesiredHeight = 0;
    public linesWidth: number[] = [];

    public linesOffsetX: number[] = [];
    public letterOffsetY = 0;

    // for change state
    public reset () {
        this._resetCommonState();
        this._resetTTFState();
        this._resetBMFontState();
    }

    public destroy () {
        this.vertexBuffer.length = 0;
        this.texture = null;
        this.fntConfig = null;
        this.fontAtlas = null;
        this.spriteFrame = null;
        this.horizontalKerning.length = 0;
        this.linesWidth.length = 0;
    }

    private _resetCommonState () {
        this.isBmFont = false;

        this.fontFamily = 'Arial';
        this.isSystemFontUsed = false;

        this.fontDesc = '';
        this.fontSize = 40;
        this.actualFontSize = 0;

        this.color.set();

        this.hAlign = 0;
        this.vAlign = 0;

        this.wrapping = true;
        this.overFlow = 0;

        this.lineHeight = 10;

        this.quadCount = 0;
        this.vertexBuffer.length = 0;
        this.texture = null;

        this.inputString = '';
        this.parsedString.length = 0;

        this.nodeContentSize.set(0, 0);
        this.uiTransAnchorX = 0.5;
        this.uiTransAnchorY = 0.5;
    }

    private _resetTTFState () {
        this.isBold = false;
        this.isItalic = false;
        this.isUnderline = false;
        this.underlineHeight = 1;
        this.isOutlined = false;
        this.outlineColor.set();
        this.outlineWidth = 1;
        this.hasShadow = false;
        this.shadowColor.set();
        this.shadowBlur = 2;
        this.shadowOffsetX = 0;
        this.shadowOffsetY = 0;
        this.canvasSize.set();
        this.canvasPadding.set();
        this.contentSizeExtend.set();
    }

    private _resetBMFontState () {
        this.fntConfig = null;
        this.fontAtlas = null;
        this.spriteFrame = null;
        this.spacingX = 0;
        this.originFontSize = 0;
        this.bmfontScale = 1.0;
        this.labelWidth = 0;
        this.labelHeight = 0;
        this.labelDimensions.set();
        this.maxLineWidth = 0;
        this.tailoredTopY = 0;
        this.tailoredBottomY = 0;
        this.horizontalKerning.length = 0;
        this.textDesiredHeight = 0;
        this.linesWidth.length = 0;
        this.numberOfLines = 1;
    }
}
