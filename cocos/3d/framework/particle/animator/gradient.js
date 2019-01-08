import { repeat } from '../../../../core/vmath';
import { Enum, ValueType } from '../../../../core/value-types';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';

const Mode = Enum({
    Blend: 0,
    Fixed: 1
});

@ccclass('cc.ColorKey')
export class ColorKey {

    @property
    color = cc.Color.WHITE;

    @property
    time = 0;
}

// CCClass.fastDefine('cc.ColorKey', ColorKey, {
//     color: cc.Color.WHITE,
//     time: 0
// });

@ccclass('cc.AlphaKey')
export class AlphaKey {

    @property
    alpha = 1;

    @property
    time = 0;
}

// CCClass.fastDefine('cc.AlphaKey', AlphaKey, {
//     alpha: 1,
//     time: 0
// });

@ccclass('cc.Gradient')
export default class Gradient {

    @property
    colorKeys = [];

    @property
    alphaKeys = []

    @property
    mode = Mode.Blend;

    constructor() {
        this._color = cc.Color.WHITE;
    }

    setKeys(colorKeys, alphaKeys) {
        this.colorKeys = colorKeys;
        this.alphaKeys = alphaKeys;
    }

    sortKeys() {
        if (this.colorKeys.length > 1) {
            this.colorKeys.sort((a, b) => a.time - b.time);
        }
        if (this.alphaKeys.length > 1) {
            this.alphaKeys.sort((a, b) => a.time - b.time);
        }
    }

    getRGB(time) {
        if (this.colorKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.colorKeys.length; ++i) {
                let preTime = this.colorKeys[i - 1].time;
                let curTime = this.colorKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this._mode === 'fixed') {
                        return this.colorKeys[i].color;
                    }
                    let factor = (time - preTime) / (curTime - preTime);
                    this.colorKeys[i - 1].color.lerp(this.colorKeys[i].color, factor, this._color);
                    return this._color;
                }
            }
            console.warn('something went wrong. can not get gradient color.');
        } else if (this.colorKeys.length === 1) {
            this._color.set(this.colorKeys[0].color);
            return this._color;
        } else {
            this._color.r = 255;
            this._color.g = 255;
            this._color.b = 255;
            this._color.a = 255;
            return this._color;
        }
    }

    getAlpha(time) {
        if (this.alphaKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.alphaKeys.length; ++i) {
                let preTime = this.alphaKeys[i - 1].time;
                let curTime = this.alphaKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this._mode === 'fixed') {
                        return this.alphaKeys[i].alpha;
                    }
                    let factor = (time - preTime) / (curTime - preTime);
                    return (this.alphaKeys[i - 1].alpha * (1 - factor) + this.alphaKeys[i].alpha * factor);
                }
            }
            console.warn('something went wrong. can not get gradient alpha.');
        } else if (this.alphaKeys.length === 1) {
            return this.alphaKeys[0].alpha;
        } else {
            return 255;
        }
    }

    evaluate(time) {
        this.getRGB(time);
        this._color.a = this.getAlpha(time);
        return this._color;
    }

    randomColor() {
        let c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
        let a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];
        this._color.r = c.r;
        this._color.g = c.g;
        this._color.b = c.b;
        this._color.a = a;
        return this._color;
    }
}

// CCClass.fastDefine('cc.Gradient', Gradient, {
//     mode: Mode.Blend,
//     colorKeys: [],
//     alphaKeys: []
// });
