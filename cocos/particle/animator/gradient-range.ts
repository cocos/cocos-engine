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

/**
 * @packageDocumentation
 * @hidden
 */

import { ccclass, type, serializable, editable } from 'cc.decorator';
import { EDITOR } from 'internal:constants';
import { Color } from '../../core/math';
import { Enum } from '../../core/value-types';
import Gradient, { AlphaKey, ColorKey } from './gradient';
import { Texture2D } from '../../core';
import { PixelFormat, Filter, WrapMode } from '../../core/assets/asset-enum';

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
export default class GradientRange {
    /**
     * @zh 渐变色类型 [[Mode]]。
     */
    @type(Mode)
    get mode () {
        return this._mode;
    }

    set mode (m) {
        if (EDITOR) {
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
     * @legacy_public
     */
    public _onBeforeSerialize (props: any): any {
        return SerializableTable[this._mode];
    }
}

function evaluateGradient (gr: GradientRange, time: number, index: number) {
    switch (gr.mode) {
    case Mode.Color:
        return gr.color;
    case Mode.TwoColors:
        return index === 0 ? gr.colorMin : gr.colorMax;
    case Mode.RandomColor:
        return gr.gradient.randomColor();
    case Mode.Gradient:
        return gr.gradient.evaluate(time);
    case Mode.TwoGradients:
        return index === 0 ? gr.gradientMin.evaluate(time) : gr.gradientMax.evaluate(time);
    default:
        return gr.color;
    }
}
function evaluateHeight (gr: GradientRange) {
    switch (gr.mode) {
    case Mode.TwoColors:
        return 2;
    case Mode.TwoGradients:
        return 2;
    default:
        return 1;
    }
}
export function packGradientRange (samples: number, gr: GradientRange) {
    const height = evaluateHeight(gr);
    const data = new Uint8Array(samples * height * 4);
    const interval = 1.0 / (samples - 1);
    let offset = 0;

    for (let h = 0; h < height; h++) {
        for (let j = 0; j < samples; j++) {
            const color = evaluateGradient(gr, interval * j, h);
            data[offset] = color.r;
            data[offset + 1] = color.g;
            data[offset + 2] = color.b;
            data[offset + 3] = color.a;
            offset += 4;
        }
    }

    const texture = new Texture2D();
    texture.create(samples, height, PixelFormat.RGBA8888);
    texture.setFilters(Filter.LINEAR, Filter.LINEAR);
    texture.setWrapMode(WrapMode.CLAMP_TO_EDGE, WrapMode.CLAMP_TO_EDGE);
    texture.uploadData(data);

    return texture;
}
