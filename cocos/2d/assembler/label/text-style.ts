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

import { Color } from '../../../core';
import { IConfig } from '../../assets/bitmap-font';
import { SpriteFrame } from '../../assets/sprite-frame';

export class TextStyle {
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

    public color = Color.WHITE.clone(); // both

    public fontSize = 40; // input fonSize // both
    public actualFontSize = 0; // both

    public isSystemFontUsed = false; // both // ttf & char

    // -----------------------bitMap extra part-------------------------

    public originFontSize = 0; //Layout // both
    public bmfontScale = 1.0;// both

    // font info // todo merge to font
    public fontFamily = 'Arial'; // both
    public fontDesc = ''; // both

    // -----------------------bitMap extra part-------------------------

    // font info // todo remove
    public fntConfig: IConfig | null = null; // For char mode,not have asset
    public spriteFrame: SpriteFrame | null = null; // For char mode,not have spriteFrame in asset

    public fontScale = 1;

    public reset (): void {
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
    }
}
