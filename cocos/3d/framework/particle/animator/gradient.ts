/**
 * @hidden
 */

import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { Color, Enum, lerp, repeat } from '../../../../core/value-types';

// tslint:disable: max-line-length

const _black: Color = Color.BLACK;

const _white: Color = Color.WHITE;

const Mode = Enum({
    Blend: 0,
    Fixed: 1,
});

@ccclass('cc.ColorKey')
export class ColorKey {

    @property
    public color = cc.Color.WHITE;

    @property
    public time = 0;
}

// CCClass.fastDefine('cc.ColorKey', ColorKey, {
//     color: cc.Color.WHITE,
//     time: 0
// });

@ccclass('cc.AlphaKey')
export class AlphaKey {

    @property
    public alpha = 1;

    @property
    public time = 0;
}

// CCClass.fastDefine('cc.AlphaKey', AlphaKey, {
//     alpha: 1,
//     time: 0
// });

@ccclass('cc.Gradient')
export default class Gradient {

    public static Mode = Mode;

    @property
    public colorKeys = new Array<ColorKey>();

    @property
    public alphaKeys = new Array<AlphaKey>();

    @property
    public mode = Mode.Blend;

    private _color: Color;

    constructor () {
        this._color = cc.Color.WHITE;
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
                Color.lerp(this._color, _black, this.colorKeys[0].color, time / this.colorKeys[0].time);
            } else if (time > this.colorKeys[lastIndex].time) {
                Color.lerp(this._color, this.colorKeys[lastIndex].color, _black, (time - this.colorKeys[lastIndex].time) / (1 - this.colorKeys[lastIndex].time));
            }
            // console.warn('something went wrong. can not get gradient color.');
        } else if (this.colorKeys.length === 1) {
            this._color.set(this.colorKeys[0].color);
            return this._color;
        } else {
            this._color.set(_white);
            return this._color;
        }
    }

    private getAlpha (time: number) {
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
                    return lerp(this.alphaKeys[i - 1].alpha , this.alphaKeys[i].alpha , factor);
                }
            }
            const lastIndex = this.alphaKeys.length - 1;
            if (time < this.alphaKeys[0].time) {
                return lerp(255, this.alphaKeys[0].alpha, time / this.alphaKeys[0].time);
            } else if (time > this.alphaKeys[lastIndex].time) {
                return lerp(this.alphaKeys[lastIndex].alpha, 255, (time - this.alphaKeys[lastIndex].time) / (1 - this.alphaKeys[lastIndex].time));
            }
        } else if (this.alphaKeys.length === 1) {
            return this.alphaKeys[0].alpha;
        } else {
            return 255;
        }
    }
}

// CCClass.fastDefine('cc.Gradient', Gradient, {
//     mode: Mode.Blend,
//     colorKeys: [],
//     alphaKeys: []
// });
