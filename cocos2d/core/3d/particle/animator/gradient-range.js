import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum from '../../../platform/CCEnum';
import { color4 } from '../../../vmath';
import { Gradient, AlphaKey, ColorKey } from './gradient';

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

    static Mode = Mode;

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
    color = cc.Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色下限。
     */
    @property
    colorMin = cc.Color.WHITE.clone();

    /**
     * @zh 当mode为TwoColors时的颜色上限。
     */
    @property
    colorMax = cc.Color.WHITE.clone();

    /**
     * @zh 当mode为Gradient时的颜色渐变。
     */
    @property({
        type: Gradient,
    })
    gradient = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变下限。
     */
    @property({
        type: Gradient,
    })
    gradientMin = new Gradient();

    /**
     * @zh 当mode为TwoGradients时的颜色渐变上限。
     */
    @property({
        type: Gradient,
    })
    gradientMax = new Gradient();

    _mode = Mode.Color;

    _color = cc.Color.WHITE.clone();

    evaluate (time, rndRatio) {
        switch (this.mode) {
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

cc.GradientRange = GradientRange;
