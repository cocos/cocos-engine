
/**
 * @hidden
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { Color } from '../../core/math';
import { Enum } from '../../core/value-types';
import Gradient, { AlphaKey, ColorKey } from './gradient';
import { EDITOR } from 'internal:constants';

// tslint:disable: max-line-length

const GRADIENT_MODE_FIX = 0;
const GRADIENT_MODE_BLEND = 1;

const GRADIENT_RANGE_MODE_COLOR = 0;
const GRADIENT_RANGE_MODE_TWO_COLOR = 1;
const GRADIENT_RANGE_MODE_RANDOM_COLOR = 2;
const GRADIENT_RANGE_MODE_GRADIENT = 3;
const GRADIENT_RANGE_MODE_TWO_GRADIENT = 4;

const SerializableTable = EDITOR && [
    [ "_mode", "color" ],
    [ "_mode", "gradient" ],
    [ "_mode", "colorMin", "colorMax" ],
    [ "_mode", "gradientMin", "gradientMax"],
    [ "_mode", "gradient" ]
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
    @property({
        type: Mode,
    })
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
    @property
    public color = Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色下限。
     */
    @property
    public colorMin = Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色上限。
     */
    @property
    public colorMax = Color.WHITE.clone();

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

    @property({
        type: Mode,
    })
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

    public _onBeforeSerialize (props: any): any {
        return SerializableTable[this._mode];
    }
}

// CCClass.fastDefine('cc.GradientRange', GradientRange, {
//     mode: Mode.Color,
//     color: cc.Color.WHITE.clone(),
//     colorMin: cc.Color.WHITE.clone(),
//     colorMax: cc.Color.WHITE.clone(),
//     gradient: new Gradient(),
//     gradientMin: null,
//     gradientMax: null
// });
