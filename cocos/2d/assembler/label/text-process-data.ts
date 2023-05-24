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

import { SpriteFrame } from '../../assets';
import { IConfig } from '../../assets/bitmap-font';
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

    // -----------------------Common part-------------------------

    private _style = new TextStyle();
    private _layout = new TextLayout();
    private _font;

    // output part
    private _outputLayoutData = new TextOutputLayoutData();
    private _outputRenderData = new TextOutputRenderData();

    // for change state
    public reset () {
        this.isBmFont = false;

        this.style.fontFamily = 'Arial';
        this.style.isSystemFontUsed = false;

        this.style.fontDesc = '';
        this.style.fontSize = 40;
        this.style.actualFontSize = 0;

        this.style.color.set();

        this.inputString = '';

        this.outputLayoutData.reset();
        this.outputRenderData.reset();
        this.style.reset();
        // resetBMFontState();
        this.style.fntConfig = null;
        this.style.spriteFrame = null;
        this.layout.spacingX = 0;
        this.style.originFontSize = 0;
        this.style.bmfontScale = 1.0;
        this._layout.reset();
    }
}
