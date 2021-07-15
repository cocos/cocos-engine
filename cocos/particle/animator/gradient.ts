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

import { ccclass, serializable, editable } from 'cc.decorator';
import { Color, lerp, repeat } from '../../core/math';
import { Enum } from '../../core/value-types';

const Mode = Enum({
    Blend: 0,
    Fixed: 1,
});

@ccclass('cc.ColorKey')
export class ColorKey {
    /**
     * @en Color value.
     * @zh 颜色值。
     */
    @serializable
    @editable
    public color = Color.WHITE.clone();

    /**
     * @en Time value.
     * @zh 时间值。
     */
    @serializable
    @editable
    public time = 0;
}

@ccclass('cc.AlphaKey')
export class AlphaKey {
    /**
     * @en Alpha value.
     * @zh 透明度。
     */
    @serializable
    @editable
    public alpha = 1;
    /**
     * @en Time.
     * @zh 时间帧。
     */
    @serializable
    @editable
    public time = 0;
}

@ccclass('cc.Gradient')
export default class Gradient {
    public static Mode = Mode;
    /**
     * @en Array of color key.
     * @zh 颜色关键帧列表。
     */
    @serializable
    @editable
    public colorKeys = new Array<ColorKey>();
    /**
     * @en Array of alpha key.
     * @zh 透明度关键帧列表。
     */
    @serializable
    @editable
    public alphaKeys = new Array<AlphaKey>();
    /**
     * @en Blend mode.
     * @zh 混合模式。
     */
    @serializable
    @editable
    public mode = Mode.Blend;

    private _color: Color;

    constructor () {
        this._color = Color.WHITE.clone();
    }

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

    public evaluate (time: number) {
        this.getRGB(time);
        this._color._set_a_unsafe(this.getAlpha(time)!);
        return this._color;
    }

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
        } else if (this.colorKeys.length === 1) {
            this._color.set(this.colorKeys[0].color);
            return this._color;
        } else {
            this._color.set(Color.WHITE);
            return this._color;
        }
    }

    private getAlpha (time: number) {
        const basicAlpha: number = 0; // default alpha is 0
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
        } else if (this.alphaKeys.length === 1) {
            return this.alphaKeys[0].alpha;
        } else {
            return basicAlpha;
        }
    }
}
