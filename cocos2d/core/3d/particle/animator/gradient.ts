import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum from '../../../platform/CCEnum';
import { lerp, repeat } from '../../../value-types';

// tslint:disable: max-line-length

const Mode = Enum({
    Blend: 0,
    Fixed: 1,
});

@ccclass('cc.ColorKey')
export class ColorKey {

    @property
    color = cc.Color.WHITE.clone();

    @property
    time = 0;
}

@ccclass('cc.AlphaKey')
export class AlphaKey {

    @property
    alpha = 1;

    @property
    time = 0;
}

@ccclass('cc.Gradient')
export class Gradient {

    static Mode = Mode;

    @property({
        type: [ColorKey],
    })
    colorKeys = new Array();

    @property({
        type: [AlphaKey],
    })
    alphaKeys = new Array();

    @property({
        type: Mode,
    })
    mode = Mode.Blend;

    _color = null;

    constructor () {
        this._color = cc.Color.WHITE.clone();
    }

    setKeys (colorKeys, alphaKeys) {
        this.colorKeys = colorKeys;
        this.alphaKeys = alphaKeys;
    }

    sortKeys () {
        if (this.colorKeys.length > 1) {
            this.colorKeys.sort((a, b) => a.time - b.time);
        }
        if (this.alphaKeys.length > 1) {
            this.alphaKeys.sort((a, b) => a.time - b.time);
        }
    }

    evaluate (time) {
        this.getRGB(time);
        this._color._fastSetA(this.getAlpha(time));
        return this._color;
    }

    randomColor () {
        const c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
        const a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];
        this._color.set(c.color);
        this._color._fastSetA(a.alpha);
        return this._color;
    }

    getRGB (time) {
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
                    this.colorKeys[i - 1].color.lerp(this.colorKeys[i].color, factor, this._color);
                    return this._color;
                }
            }
            const lastIndex = this.colorKeys.length - 1;
            if (time < this.colorKeys[0].time) {
                cc.Color.BLACK.lerp(this.colorKeys[0].color, time / this.colorKeys[0].time, this._color);
            } else if (time > this.colorKeys[lastIndex].time) {
                this.colorKeys[lastIndex].color.lerp(cc.Color.BLACK, (time - this.colorKeys[lastIndex].time) / (1 - this.colorKeys[lastIndex].time), this._color);
            }
            // console.warn('something went wrong. can not get gradient color.');
        } else if (this.colorKeys.length === 1) {
            this._color.set(this.colorKeys[0].color);
            return this._color;
        } else {
            this._color.set(cc.Color.WHITE);
            return this._color;
        }
    }

    getAlpha (time) {
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

cc.ColorKey = ColorKey;
cc.AlphaKey = AlphaKey;
cc.Gradient = Gradient;

