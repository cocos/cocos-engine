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

import { CCClass, Enum } from '../core';
import { Color, lerp, repeat } from '../core/math';

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

export default class Gradient {
    public static Mode = Mode;
    /**
     * @en Array of color key.
     * @zh 颜色关键帧列表。
     */
    public colorKeys: ColorKey[] = [];
    /**
     * @en Array of alpha key.
     * @zh 透明度关键帧列表。
     */
    public alphaKeys: AlphaKey[] = [];
    /**
     * @en Blend mode.
     * @zh 混合模式。
     */
    public mode = Mode.Blend;

    public setKeys (colorKeys: ColorKey[], alphaKeys: AlphaKey[]) {
        this.colorKeys = colorKeys;
        this.alphaKeys = alphaKeys;
    }

    public sortKeys () {
        if (this.colorKeys.length > 1) {
            this.colorKeys.sort((a, b) => a.time - b.time);
        }
        if (this.alphaKeys.length > 1) {
            this.alphaKeys.sort((a, b) => a.time - b.time);
        }
    }

    public evaluate (out: Color, time: number) {
        this.getRGB(out, time);
        out._set_a_unsafe(this.getAlpha(time)!);
        return out;
    }

    private getRGB (out: Color, time: number) {
        const colorKeys = this.colorKeys;
        const length = colorKeys.length;
        if (length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < length; ++i) {
                const preTime = colorKeys[i - 1].time;
                const curTime = colorKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === Mode.Fixed) {
                        Color.copy(out, colorKeys[i].color);
                        return out;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
                    Color.lerp(out, colorKeys[i - 1].color, colorKeys[i].color, factor);
                    return out;
                }
            }
            const lastIndex = length - 1;
            if (time < colorKeys[0].time) {
                Color.lerp(out, Color.BLACK, colorKeys[0].color, time / colorKeys[0].time);
            } else if (time > colorKeys[lastIndex].time) {
                Color.lerp(out, colorKeys[lastIndex].color, Color.BLACK, (time - colorKeys[lastIndex].time) / (1 - colorKeys[lastIndex].time));
            }
            // console.warn('something went wrong. can not get gradient color.');
        } else if (length === 1) {
            Color.copy(out, colorKeys[0].color);
        } else {
            Color.copy(out, Color.WHITE);
        }
        return out;
    }

    private getAlpha (time: number) {
        const basicAlpha = 0; // default alpha is 0
        const alphaKeys = this.alphaKeys;
        const length = alphaKeys.length;
        if (length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < length; ++i) {
                const preTime = alphaKeys[i - 1].time;
                const curTime = alphaKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === Mode.Fixed) {
                        return alphaKeys[i].alpha;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
                    return lerp(alphaKeys[i - 1].alpha, alphaKeys[i].alpha, factor);
                }
            }
            const lastIndex = length - 1;
            if (time < alphaKeys[0].time) {
                return lerp(basicAlpha, alphaKeys[0].alpha, time / alphaKeys[0].time);
            } else if (time > alphaKeys[lastIndex].time) {
                return lerp(alphaKeys[lastIndex].alpha, basicAlpha, (time - alphaKeys[lastIndex].time) / (1 - alphaKeys[lastIndex].time));
            }
            return 255;
        } else if (length === 1) {
            return alphaKeys[0].alpha;
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
