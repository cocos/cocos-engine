import { repeat } from '../../../../core/vmath';
import { Enum, ValueType, Color } from '../../../../core/value-types';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';

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

    private getRGB (time: number) {
        if (this.colorKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.colorKeys.length; ++i) {
                const preTime = this.colorKeys[i - 1].time;
                const curTime = this.colorKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === 'fixed') {
                        return this.colorKeys[i].color;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
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

    private getAlpha (time: number) {
        if (this.alphaKeys.length > 1) {
            time = repeat(time, 1);
            for (let i = 1; i < this.alphaKeys.length; ++i) {
                const preTime = this.alphaKeys[i - 1].time;
                const curTime = this.alphaKeys[i].time;
                if (time >= preTime && time < curTime) {
                    if (this.mode === 'fixed') {
                        return this.alphaKeys[i].alpha;
                    }
                    const factor = (time - preTime) / (curTime - preTime);
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

    public evaluate (time: number) {
        this.getRGB(time);
        this._color.a = this.getAlpha(time)!;
        return this._color;
    }

    public randomColor () {
        const c = this.colorKeys[Math.trunc(Math.random() * this.colorKeys.length)];
        const a = this.alphaKeys[Math.trunc(Math.random() * this.alphaKeys.length)];
        this._color.r = c.color.r;
        this._color.g = c.color.g;
        this._color.b = c.color.b;
        this._color.a = a.alpha;
        return this._color;
    }
}

// CCClass.fastDefine('cc.Gradient', Gradient, {
//     mode: Mode.Blend,
//     colorKeys: [],
//     alphaKeys: []
// });
