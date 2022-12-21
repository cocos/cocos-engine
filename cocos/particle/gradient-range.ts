/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 */

import { ccclass, type, serializable, editable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Color } from '../core/math';
import { Enum } from '../core/value-types';
import Gradient, { AlphaKey, ColorKey } from './gradient';
import { Texture2D } from '../core';
import { PixelFormat, Filter, WrapMode } from '../core/assets/asset-enum';
import { legacyCC } from '../core/global-exports';

const SerializableTable = EDITOR && [
    ['_mode', 'color'],
    ['_mode', 'gradient'],
    ['_mode', 'colorMin', 'colorMax'],
    ['_mode', 'gradientMin', 'gradientMax'],
    ['_mode', 'gradient'],
];

const Mode = Enum({
    Color: 0,
    Gradient: 1,
    TwoColors: 2,
    TwoGradients: 3,
    RandomColor: 4,
});

@ccclass('cc.GradientRange')
export class GradientRange {
    /**
     * @zh 渐变色类型 [[Mode]]。
     */
    @type(Mode)
    get mode () {
        return this._mode;
    }

    set mode (m) {
        if (EDITOR && !legacyCC.GAME_VIEW) {
            if (m === Mode.RandomColor) {
                if (this.gradient.colorKeys.length === 0) {
                    this.gradient.colorKeys.push(new ColorKey());
                }
                if (this.gradient.alphaKeys.length === 0) {
                    this.gradient.alphaKeys.push(new AlphaKey());
                }
            }
        }
        this._mode = m;
    }

    public static Mode = Mode;

    /**
     * @zh 当mode为Color时的颜色。
     */
    @serializable
    @editable
    public color = Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色下限。
     */
    @serializable
    @editable
    public colorMin = Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色上限。
     */
    @serializable
    @editable
    public colorMax = Color.WHITE.clone();

    /**
     * @zh 当mode为Gradient时的颜色渐变。
     */
    @type(Gradient)
    public gradient = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变下限。
     */
    @type(Gradient)
    public gradientMin = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变上限。
     */
    @type(Gradient)
    public gradientMax = new Gradient();

    @type(Mode)
    private _mode = Mode.Color;

    private _color = Color.WHITE.clone();

    public evaluate (time: number, rndRatio: number) {
        switch (this._mode) {
        case Mode.Color:
            return this.color;
        case Mode.TwoColors:
            Color.lerp(this._color, this.colorMin, this.colorMax, rndRatio);
            return this._color;
        case Mode.RandomColor:
            return this.gradient.randomColor();
        case Mode.Gradient:
            return this.gradient.evaluate(time);
        case Mode.TwoGradients:
            Color.lerp(this._color, this.gradientMin.evaluate(time), this.gradientMax.evaluate(time), rndRatio);
            return this._color;
        default:
            return this.color;
        }
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onBeforeSerialize (props: any) {
        return SerializableTable[this._mode];
    }
}
