import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum from '../../../platform/CCEnum';
import { Color } from '../../../value-types';
import { Gradient, AlphaKey, ColorKey } from './gradient';

const GRADIENT_MODE_FIX = 0;
const GRADIENT_MODE_BLEND = 1;

const GRADIENT_RANGE_MODE_COLOR = 0;
const GRADIENT_RANGE_MODE_TWO_COLOR = 1;
const GRADIENT_RANGE_MODE_RANDOM_COLOR = 2;
const GRADIENT_RANGE_MODE_GRADIENT = 3;
const GRADIENT_RANGE_MODE_TWO_GRADIENT = 4;

const SerializableTable = CC_EDITOR && [
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

/**
 * !#en The gradient range of color.
 * !#zh 颜色值的渐变范围
 * @class GradientRange
 */
@ccclass('cc.GradientRange')
export default class GradientRange {

    static Mode = Mode;

    @property
    _mode = Mode.Color;
    /**
     * !#en Gradient type.
     * !#zh 渐变色类型。
     * @property {Mode} mode
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

    @property
    _color = cc.Color.WHITE.clone();
    /** 
     * !#en The color when mode is Color.
     * !#zh 当 mode 为 Color 时的颜色。
     * @property {Color} color
     */
    @property
    color = cc.Color.WHITE.clone();

    /**
     * !#en Lower color limit when mode is TwoColors.
     * !#zh 当 mode 为 TwoColors 时的颜色下限。
     * @property {Color} colorMin
     */
    @property
    colorMin = cc.Color.WHITE.clone();

    /**
     * !#en Upper color limit when mode is TwoColors.
     * !#zh 当 mode 为 TwoColors 时的颜色上限。
     * @property {Color} colorMax
     */
    @property
    colorMax = cc.Color.WHITE.clone();

    /**
     * !#en Color gradient when mode is Gradient
     * !#zh 当 mode 为 Gradient 时的颜色渐变。
     * @property {Gradient} gradient
     */
    @property({
        type: Gradient,
    })
    gradient = new Gradient();

    /**
     * !#en Lower color gradient limit when mode is TwoGradients.
     * !#zh 当 mode 为 TwoGradients 时的颜色渐变下限。
     * @property {Gradient} gradientMin
     */
    @property({
        type: Gradient,
    })
    gradientMin = new Gradient();

    /**
     * !#en Upper color gradient limit when mode is TwoGradients.
     * !#zh 当 mode 为 TwoGradients 时的颜色渐变上限。
     * @property {Gradient} gradientMax
     */
    @property({
        type: Gradient,
    })
    gradientMax = new Gradient();

    evaluate (time, rndRatio) {
        switch (this._mode) {
            case Mode.Color:
                return this.color;
            case Mode.TwoColors:
                this.colorMin.lerp(this.colorMax, rndRatio, this._color);
                return this._color;
            case Mode.RandomColor:
                return this.gradient.randomColor();
            case Mode.Gradient:
                return this.gradient.evaluate(time);
            case Mode.TwoGradients:
                this.gradientMin.evaluate(time).lerp(this.gradientMax.evaluate(time), rndRatio, this._color);
                return this._color;
            default:
                return this.color;
        }
    }
}

CC_EDITOR && (GradientRange.prototype._onBeforeSerialize = function(props){return SerializableTable[this._mode];});

cc.GradientRange = GradientRange;
