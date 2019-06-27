
/**
 * @hidden
 */
/**
 * @disable
 */

import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';
import { Enum, ValueType, Color } from '../../../../core/value-types';
import { color4 } from '../../../../core/vmath';
import Gradient, { AlphaKey, ColorKey } from './gradient';

// tslint:disable: max-line-length

const GRADIENT_MODE_FIX = 0;
const GRADIENT_MODE_BLEND = 1;

const GRADIENT_RANGE_MODE_COLOR = 0;
const GRADIENT_RANGE_MODE_TWO_COLOR = 1;
const GRADIENT_RANGE_MODE_RANDOM_COLOR = 2;
const GRADIENT_RANGE_MODE_GRADIENT = 3;
const GRADIENT_RANGE_MODE_TWO_GRADIENT = 4;

const Mode = Enum({
    Color: 0,
    Gradient: 1,
    TwoColors: 2,
    TwoGradients: 3,
    RandomColor: 4,
});

@ccclass('cc.GradientRange')
export default class GradientRange {

    public static Mode = Mode;

    @property({
        type: Mode,
    })
    private _mode = Mode.Color;

    /**
     * @zh 渐变色类型 [[Mode]]。
     */
    @property({
        type: Mode,
    })
    get mode () {
        return this._mode;
    }

    set mode (m) {
        if (CC_EDITOR) {
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
    @property
    public color = cc.Color.WHITE;

    /**
     * @zh 当mode为TwoColors时的颜色下限。
     */
    @property
    public colorMin = cc.Color.WHITE;

    /**
     * @zh 当mode为TwoColors时的颜色上限。
     */
    @property
    public colorMax = cc.Color.WHITE;

    /**
     * @zh 当mode为Gradient时的颜色渐变。
     */
    @property({
        type: Gradient,
    })
    public gradient = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变下限。
     */
    @property({
        type: Gradient,
    })
    public gradientMin = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变上限。
     */
    @property({
        type: Gradient,
    })
    public gradientMax = new Gradient();

    public evaluate (time: number, rndRatio: number) {
        switch (this.mode) {
            case Mode.Color:
                return this.color;
            case Mode.TwoColors:
                Color.lerp(this.colorMin, this.colorMax, rndRatio, this.color);
                return this.color;
            case Mode.RandomColor:
                return this.gradient.randomColor();
            case Mode.Gradient:
                return this.gradient.evaluate(time);
            case Mode.TwoGradients:
                this.colorMin = this.gradientMin.evaluate(time);
                this.colorMax = this.gradientMax.evaluate(time);
                Color.lerp(this.colorMin, this.colorMax, rndRatio, this.color);
                return this.color;
        }
    }
}

// CCClass.fastDefine('cc.GradientRange', GradientRange, {
//     mode: Mode.Color,
//     color: cc.Color.WHITE,
//     colorMin: cc.Color.WHITE,
//     colorMax: cc.Color.WHITE,
//     gradient: new Gradient(),
//     gradientMin: null,
//     gradientMax: null
// });

export class GradientUniform {
    public gr: GradientRange | null;
    public minColor: Float32Array | null = null;
    public maxColor: Float32Array | null = null;
    public minColorKeyTime: Float32Array | null = null;
    public minColorKeyValue: Float32Array | null = null;
    public minAlphaKeyTime: Float32Array | null = null;
    public minAlphaKeyValue: Float32Array | null = null;
    public maxColorKeyTime: Float32Array | null = null;
    public maxColorKeyValue: Float32Array | null = null;
    public maxAlphaKeyTime: Float32Array | null = null;
    public maxAlphaKeyValue: Float32Array | null = null;

    constructor (gr: GradientRange) {
        this.gr = gr;
        if (gr.mode === 'color') {
            this.minColor = new Float32Array(4);
            color4.array(this.minColor, gr.color);
        } else if (gr.mode === 'twoColors') {
            this.minColor = new Float32Array(4);
            this.maxColor = new Float32Array(4);
            color4.array(this.minColor, gr.colorMin);
            color4.array(this.maxColor, gr.colorMax);
        } else if (gr.mode === 'gradient') {
            this.minColorKeyTime = new Float32Array(gr.gradient.colorKeys.length);
            this.minColorKeyValue = new Float32Array(3 * this.minColorKeyTime.length);
            this.minAlphaKeyTime = new Float32Array(gr.gradient.alphaKeys.length);
            this.minAlphaKeyValue = new Float32Array(this.minAlphaKeyTime.length);
            (this.constructor as any).generateGradientUniform(gr.gradient, this.minColorKeyTime, this.minColorKeyValue, this.minAlphaKeyTime, this.minAlphaKeyValue);
        } else if (gr.mode === 'twoGradients') {
            this.minColorKeyTime = new Float32Array(gr.gradientMin.colorKeys.length);
            this.minColorKeyValue = new Float32Array(3 * this.minColorKeyTime.length);
            this.minAlphaKeyTime = new Float32Array(gr.gradientMin.alphaKeys.length);
            this.minAlphaKeyValue = new Float32Array(this.minAlphaKeyTime.length);
            (this.constructor as any).generateGradientUniform(gr.gradientMin, this.minColorKeyTime, this.minColorKeyValue, this.minAlphaKeyTime, this.minAlphaKeyValue);
            this.maxColorKeyTime = new Float32Array(gr.gradientMax.colorKeys.length);
            this.maxColorKeyValue = new Float32Array(3 * this.maxColorKeyTime.length);
            this.maxAlphaKeyTime = new Float32Array(gr.gradientMax.alphaKeys.length);
            this.maxAlphaKeyValue = new Float32Array(this.maxAlphaKeyTime.length);
            (this.constructor as any).generateGradientUniform(gr.gradientMax, this.maxColorKeyTime, this.maxColorKeyValue, this.maxAlphaKeyTime, this.maxAlphaKeyValue);
        }
    }

    public uploadUniform (device: any, name: string) {
        if (this.gr != null) {
            if (this.gr.mode === 'color') {
                device.setUniform('u_' + name + '_rangeMode', GRADIENT_RANGE_MODE_COLOR);
                device.setUniform('u_' + name + '_minColor', this.minColor);
            } else if (this.gr.mode === 'twoColors') {
                device.setUniform('u_' + name + '_rangeMode', GRADIENT_RANGE_MODE_TWO_COLOR);
                device.setUniform('u_' + name + '_minColor', this.minColor);
                device.setUniform('u_' + name + '_maxColor', this.maxColor);
            } else if (this.gr.mode === 'gradient') {
                device.setUniform('u_' + name + '_rangeMode', GRADIENT_RANGE_MODE_GRADIENT);
                device.setUniform('u_' + name + '_minGradMode', this.gr.gradient.mode === 'blend' ? GRADIENT_MODE_BLEND : GRADIENT_MODE_FIX);
                device.setUniform('u_' + name + '_minColorKeyValue', this.minColorKeyValue);
                device.setUniform('u_' + name + '_minColorKeyTime', this.minColorKeyTime);
                device.setUniform('u_' + name + '_minAlphaKeyValue', this.minAlphaKeyValue);
                device.setUniform('u_' + name + '_minAlphaKeyTime', this.minAlphaKeyTime);
            } else if (this.gr.mode === 'twoGradients') {
                device.setUniform('u_' + name + '_rangeMode', GRADIENT_RANGE_MODE_TWO_GRADIENT);
                device.setUniform('u_' + name + '_minGradMode', this.gr.gradientMin.mode === 'blend' ? GRADIENT_MODE_BLEND : GRADIENT_MODE_FIX);
                device.setUniform('u_' + name + '_minColorKeyValue', this.minColorKeyValue);
                device.setUniform('u_' + name + '_minColorKeyTime', this.minColorKeyTime);
                device.setUniform('u_' + name + '_minAlphaKeyValue', this.minAlphaKeyValue);
                device.setUniform('u_' + name + '_minAlphaKeyTime', this.minAlphaKeyTime);

                device.setUniform('u_' + name + '_maxGradMode', this.gr.gradientMax.mode === 'blend' ? GRADIENT_MODE_BLEND : GRADIENT_MODE_FIX);
                device.setUniform('u_' + name + '_maxColorKeyValue', this.maxColorKeyValue);
                device.setUniform('u_' + name + '_maxColorKeyTime', this.maxColorKeyTime);
                device.setUniform('u_' + name + '_maxAlphaKeyValue', this.maxAlphaKeyValue);
                device.setUniform('u_' + name + '_maxAlphaKeyTime', this.maxAlphaKeyTime);
            }
        }
    }

    public static generateGradientUniform (gradient: Gradient, colorKeyTime: number, colorKeyValue: Float32Array, alphaKeyTime: number, alphaKeyValue: Float32Array) {
        for (let i = 0; i < gradient.colorKeys.length; i++) {
            colorKeyTime[i] = gradient.colorKeys[i].time;
            colorKeyValue[i * 3] = gradient.colorKeys[i].color.r;
            colorKeyValue[i * 3 + 1] = gradient.colorKeys[i].color.g;
            colorKeyValue[i * 3 + 2] = gradient.colorKeys[i].color.b;
        }
        for (let i = 0; i < gradient.alphaKeys.length; i++) {
            alphaKeyTime[i] = gradient.alphaKeys[i].time;
            alphaKeyValue[i] = gradient.alphaKeys[i].alpha;
        }
    }
}
