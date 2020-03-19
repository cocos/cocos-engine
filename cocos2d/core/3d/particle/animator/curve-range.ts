import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum  from '../../../platform/CCEnum';
import { lerp } from '../../../value-types';
import { AnimationCurve } from '../curve';

const SerializableTable = CC_EDITOR && [
    [ "mode", "constant", "multiplier" ],
    [ "mode", "curve", "multiplier" ],
    [ "mode", "curveMin", "curveMax", "multiplier" ],
    [ "mode", "constantMin", "constantMax", "multiplier"]
];

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});

/**
 * !#en The curve range of target value.
 * !#zh 目标值的曲线范围
 * @class CurveRange
 */
@ccclass('cc.CurveRange')
export default class CurveRange {
    static Mode = Mode;

    /**
     * !#en Curve type.
     * !#zh 曲线类型。
     * @property {Mode} mode
     */
    @property({
        type: Mode,
    })
    mode = Mode.Constant;

    /**
     * !#en The curve to use when mode is Curve.
     * !#zh 当 mode 为 Curve 时，使用的曲线。
     * @property {AnimationCurve} curve
     */
    @property({
        type: AnimationCurve,
    })
    curve = new AnimationCurve();

    /**
     * !#en The lower limit of the curve to use when mode is TwoCurves
     * !#zh 当 mode 为 TwoCurves 时，使用的曲线下限。
     * @property {AnimationCurve} curveMin
     */
    @property({
        type: AnimationCurve,
    })
    curveMin = new AnimationCurve();

    /**
     * !#en The upper limit of the curve to use when mode is TwoCurves
     * !#zh 当 mode 为 TwoCurves 时，使用的曲线上限。
     * @property {AnimationCurve} curveMax
     */
    @property({
        type: AnimationCurve,
    })
    curveMax = new AnimationCurve();

    /**
     * !#en When mode is Constant, the value of the curve.
     * !#zh 当 mode 为 Constant 时，曲线的值。
     * @property {Number} constant
     */
    @property
    constant = 0;

    /**
     * !#en The lower limit of the curve to use when mode is TwoConstants
     * !#zh 当 mode 为 TwoConstants 时，曲线的下限。
     * @property {Number} constantMin
     */
    @property
    constantMin = 0;


    /**
     * !#en The upper limit of the curve to use when mode is TwoConstants
     * !#zh 当 mode 为 TwoConstants 时，曲线的上限。
     * @property {Number} constantMax
     */
    @property
    constantMax = 0;

    /**
     * !#en Coefficients applied to curve interpolation.
     * !#zh 应用于曲线插值的系数。
     * @property {Number} multiplier
     */
    @property
    multiplier = 1;

    constructor () {

    }

    evaluate (time, rndRatio) {
        switch (this.mode) {
            case Mode.Constant:
                return this.constant;
            case Mode.Curve:
                return this.curve.evaluate(time) * this.multiplier;
            case Mode.TwoCurves:
                return lerp(this.curveMin.evaluate(time), this.curveMax.evaluate(time), rndRatio) * this.multiplier;
            case Mode.TwoConstants:
                return lerp(this.constantMin, this.constantMax, rndRatio);
        }
    }

    getMax () {
        switch (this.mode) {
            case Mode.Constant:
                return this.constant;
            case Mode.Curve:
                return this.multiplier;
            case Mode.TwoConstants:
                return this.constantMax;
            case Mode.TwoCurves:
                return this.multiplier;
        }
        return 0;
    }
}

CC_EDITOR && (CurveRange.prototype._onBeforeSerialize = function(props){return SerializableTable[this.mode];});

cc.CurveRange = CurveRange;
