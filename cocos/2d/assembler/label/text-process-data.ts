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
import { SpriteFrame } from '../../assets';
import { FontAtlas, IConfig } from '../../assets/bitmap-font';
import { LetterAtlas } from './font-utils';
import { TextStyle } from './text-style';
import { TextLayout } from './text-layout';
import { TextOutputLayoutData, TextOutputRenderData } from './text-output-data';

export class TextProcessData {
    get style () {
        return this._style;
    }

    get layout () {
        return this._layout;
    }

    get outputRenderData () {
        return this._outputRenderData;
    }

    get outputLayoutData () {
        return this._outputLayoutData;
    }

    // ---------------Common part-----------------
    // type
    public isBmFont = false;

    // string before process
    public inputString = ''; // both

    public color = Color.WHITE.clone(); // both

    // font info
    public fontFamily = 'Arial'; // both
    public isSystemFontUsed = false; // both // ttf & char
    public fontDesc = ''; // both
    public fontSize = 40; // input fonSize // both
    public actualFontSize = 0; // both

    // -----------------------bitMap extra part-------------------------

    // font info
    public fntConfig: IConfig | null = null; // font
    public fontAtlas: FontAtlas | LetterAtlas | null = null; // font
    public spriteFrame: SpriteFrame | null = null; // render
    public originFontSize = 0; //Layout // both
    public bmfontScale = 1.0;// both

    // -----------------------Common part-------------------------

    private _style = new TextStyle();
    private _layout = new TextLayout();
    private _font;

    // output part
    private _outputLayoutData = new TextOutputLayoutData();
    private _outputRenderData = new TextOutputRenderData();

    // for change state
    public reset () {
        // resetCommonState();

        this.isBmFont = false;

        this.fontFamily = 'Arial';
        this.isSystemFontUsed = false;

        this.fontDesc = '';
        this.fontSize = 40;
        this.actualFontSize = 0;

        this.color.set();

        this.inputString = '';

        this.outputLayoutData.reset();
        this.outputRenderData.reset();
        this.style.reset();
        // resetBMFontState();
        this.fntConfig = null;
        this.fontAtlas = null;
        this.spriteFrame = null;
        this.layout.spacingX = 0;
        this.originFontSize = 0;
        this.bmfontScale = 1.0;
        this._layout.reset();
    }

    public destroy () {
        this._style.destroy();
        this._layout.destroy();
        this._outputLayoutData.destroy();
        this._outputRenderData.destroy();
        this.fntConfig = null;
        this.fontAtlas = null;
        this.spriteFrame = null;
    }
}
