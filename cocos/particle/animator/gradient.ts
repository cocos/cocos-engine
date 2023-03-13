/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { CCClass, Color, lerp, repeat, Enum } from '../../core';

const Mode = Enum({
    Blend: 0,
    Fixed: 1,
});

export class ColorKey {
    /**
     * @en Color value.
     * @zh 颜色值。
     */
    public color = Color.WHITE.clone();

    /**
     * @en Time value.
     * @zh 时间值。
     */
    public time = 0;
}

CCClass.fastDefine('cc.ColorKey', ColorKey, {
    color: Color.WHITE.clone(),
    time: 0,
});

CCClass.Attr.setClassAttr(ColorKey, 'color', 'visible', true);
CCClass.Attr.setClassAttr(ColorKey, 'time', 'visible', true);

export class AlphaKey {
    /**
     * @en Alpha value.
     * @zh 透明度。
     */
    public alpha = 1;
    /**
     * @en Time.
     * @zh 时间帧。
     */
    public time = 0;
}

CCClass.fastDefine('cc.AlphaKey', AlphaKey, {
    alpha: 1,
    time: 0,
});

CCClass.Attr.setClassAttr(AlphaKey, 'alpha', 'visible', true);
CCClass.Attr.setClassAttr(AlphaKey, 'time', 'visible', true);

/**
 * @en Gradient is a component that has a lot of color keys and alpha keys to get the interpolated color value.
 * @zh 渐变曲线控件包含了颜色关键帧和透明度关键帧，在关键帧中进行插值渐变返回最终的颜色值。
 */
export default class Gradient {
    /**
     * @en
     * There are 2 kind of mode:
     * Blend just interpolate the nearest 2 colors from keys.
     * Fixed get the nearest color from keys without interpolate.
     * @zh
     * 这个控件包含了两种取色模式：
     * 混合模式对取到的最近两个颜色帧进行插值计算。
     * 固定模式直接取最近的颜色帧返回，不进行插值。
     */
    public static Mode = Mode;
    /**
     * @en Array of color key.
     * @zh 颜色关键帧列表。
     */
    public colorKeys = new Array<ColorKey>();
    /**
     * @en Array of alpha key.
     * @zh 透明度关键帧列表。
     */
    public alphaKeys = new Array<AlphaKey>();
    /**
     * @en Blend mode.
     * @zh 混合模式。
     */
    public mode = Mode.Blend;

    private _color: Color;

    constructor () {
        this._color = Color.WHITE.clone();
    }

    /**
     * @en Set color keys array and alpha keys array.
     * @zh 设置颜色和透明度的关键帧列表。
     * @param colorKeys @en Array of color keys @zh 颜色关键帧列表
     * @param alphaKeys @en Array of alpha keys @zh 透明度关键帧列表
     */
    public setKeys (colorKeys: ColorKey[], alphaKeys: AlphaKey[]) {
        this.colorKeys = colorKeys;
        this.alphaKeys = alphaKeys;
    }

    /**
     * @en Sort color keys and alpha keys.
     * @zh 对颜色和透明度的关键帧进行排序。
     */
    public sortKeys () {
        if (this.colorKeys.length > 1) {
            this.colorKeys.sort((a, b) => a.time - b.time);
        }
        if (this.alphaKeys.length > 1) {
            this.alphaKeys.sort((a, b) => a.time - b.time);
        }
    }

    /**
     * @en Interpolate color and alpha from color and alpha keys.
     * @zh 根据颜色列表插值计算颜色和透明度。
     * @param time @en Normalized time to interpolate. @zh 用于插值的归一化时间。
     * @returns @en Interpolated color value. @zh 插值过后的颜色值。
     */
    public evaluate (time: number) {
        this.getRGB(time);
        this._color._set_a_unsafe(this.getAlpha(time)!);
        return this._color;
    }

    /**
     * @en Generates a random color and alpha.
     * @zh 随机生成颜色和透明度。
     * @returns @en Randomized color. @zh 随机生成的颜色。
     */
    public randomColor () {
        const c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
        const a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];
        this._color.set(c.color);
        this._color._set_a_unsafe(a.alpha);
        return this._color;
    }

    private getRGB (time: number) {
        if (this.colorKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.colorKeys.length; ++i) {
                const preTime = this.colorKeys[i - 1].time;
                const curTime = this.colorKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === Mode.Fixed) {
                        return this.colorKeys[i].color;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
                    Color.lerp(this._color, this.colorKeys[i - 1].color, this.colorKeys[i].color, factor);
                    return this._color;
                }
            }
            const lastIndex = this.colorKeys.length - 1;
            if (time < this.colorKeys[0].time) {
                Color.lerp(this._color, Color.BLACK, this.colorKeys[0].color, time / this.colorKeys[0].time);
            } else if (time > this.colorKeys[lastIndex].time) {
                Color.lerp(this._color, this.colorKeys[lastIndex].color, Color.BLACK, (time - this.colorKeys[lastIndex].time) / (1 - this.colorKeys[lastIndex].time));
            }
            // console.warn('something went wrong. can not get gradient color.');
            return this._color;
        } else if (this.colorKeys.length === 1) {
            this._color.set(this.colorKeys[0].color);
            return this._color;
        } else {
            this._color.set(Color.WHITE);
            return this._color;
        }
    }

    private getAlpha (time: number) {
        const basicAlpha = 0; // default alpha is 0
        if (this.alphaKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.alphaKeys.length; ++i) {
                const preTime = this.alphaKeys[i - 1].time;
                const curTime = this.alphaKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === Mode.Fixed) {
                        return this.alphaKeys[i].alpha;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
                    return lerp(this.alphaKeys[i - 1].alpha, this.alphaKeys[i].alpha, factor);
                }
            }
            const lastIndex = this.alphaKeys.length - 1;
            if (time < this.alphaKeys[0].time) {
                return lerp(basicAlpha, this.alphaKeys[0].alpha, time / this.alphaKeys[0].time);
            } else if (time > this.alphaKeys[lastIndex].time) {
                return lerp(this.alphaKeys[lastIndex].alpha, basicAlpha, (time - this.alphaKeys[lastIndex].time) / (1 - this.alphaKeys[lastIndex].time));
            }
            return 255;
        } else if (this.alphaKeys.length === 1) {
            return this.alphaKeys[0].alpha;
        } else {
            return 255;
        }
    }
}

CCClass.fastDefine('cc.Gradient', Gradient, {
    colorKeys: [],
    alphaKeys: [],
    mode: Mode.Blend,
});

CCClass.Attr.setClassAttr(Gradient, 'colorKeys', 'visible', true);
CCClass.Attr.setClassAttr(Gradient, 'alphaKeys', 'visible', true);
CCClass.Attr.setClassAttr(Gradient, 'mode', 'visible', true);
