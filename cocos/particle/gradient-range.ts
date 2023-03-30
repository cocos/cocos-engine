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
import { legacyCC } from '../core/global-exports';

const SerializableTable = [
    ['_mode', '_color'],
    ['_mode', '_gradient'],
    ['_mode', '_colorMin', '_color'],
    ['_mode', '_gradient', '_gradientMin'],
    ['_mode', '_gradient'],
];

const Mode = Enum({
    Color: 0,
    Gradient: 1,
    TwoColors: 2,
    TwoGradients: 3,
    RandomColor: 4,
});

const tempColor1 = new Color();
const tempColor2 = new Color();

@ccclass('cc.GradientRange')
export class GradientRange {
    public static Mode = Mode;
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

    /**
     * @zh 当mode为Color时的颜色。
     */
    @type(Color)
    public get color () {
        if (!this._color) {
            this._color = Color.WHITE.clone();
        }
        return this._color;
    }

    public set color (val) {
        this._color = val;
    }

    /**
     * @zh 当mode为TwoColors时的颜色下限。
     */
    @type(Color)
    public get colorMin () {
        if (!this._colorMin) {
            this._colorMin = Color.WHITE.clone();
        }
        return this._colorMin;
    }

    public set colorMin (val) {
        this._colorMin = val;
    }

    /**
     * @zh 当mode为TwoColors时的颜色上限。
     */
    @type(Color)
    public get colorMax () {
        return this.color;
    }

    public set colorMax (val) {
        this.color = val;
    }

    /**
     * @zh 当mode为Gradient时的颜色渐变。
     */
    @type(Gradient)
    public get gradient () {
        if (!this._gradient) {
            this._gradient = new Gradient();
        }
        return this._gradient;
    }

    public set gradient (val) {
        this._gradient = val;
    }

    /**
     * @zh 当mode为TwoGradients时的颜色渐变下限。
     */
    @type(Gradient)
    public get gradientMin () {
        if (!this._gradientMin) {
            this._gradientMin = new Gradient();
        }
        return this._gradientMin;
    }

    public set gradientMin (val) {
        this._gradientMin = val;
    }

    /**
     * @zh 当mode为TwoGradients时的颜色渐变上限。
     */
    @type(Gradient)
    public get gradientMax () {
        return this.gradient;
    }

    public set gradientMax (val) {
        this.gradient = val;
    }

    @serializable
    private _mode = Mode.Color;
    @serializable
    private _gradient: Gradient | null = null;
    @serializable
    private _gradientMin: Gradient | null = null;
    @serializable
    private _color: Color | null = null;
    @serializable
    private _colorMin: Color | null = null;

    public evaluate (out: Color, time: number, rndRatio: number) {
        switch (this._mode) {
        case Mode.Color:
            Color.copy(out, this.color);
            break;
        case Mode.TwoColors:
            Color.lerp(out, this.colorMin, this.colorMax, rndRatio);
            break;
        case Mode.RandomColor:
            this.gradient.evaluate(out, rndRatio);
            break;
        case Mode.Gradient:
            this.gradient.evaluate(out, time);
            break;
        case Mode.TwoGradients:
            Color.lerp(out, this.gradientMin.evaluate(tempColor1, time), this.gradientMax.evaluate(tempColor2, time), rndRatio);
            break;
        default:
        }
        return out;
    }

    /**
     * @deprecated since v3.5.0, this is an engine private interface that will be removed in the future.
     */
    public _onBeforeSerialize (props: string[]) {
        return SerializableTable[this._mode];
    }
}
