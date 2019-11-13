import { ccclass, property } from '../../../platform/CCClassDecorator';
import Enum  from '../../../platform/CCEnum';
import { lerp } from '../../../value-types';
import { AnimationCurve } from '../../../geom-utils/curve';

export const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});

@ccclass('cc.CurveRange')
export default class CurveRange {
    static Mode = Mode;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    @property({
        type: Mode,
    })
    mode = Mode.Constant;

    /**
     * @zh 当mode为Curve时，使用的曲线。
     */
    @property({
        type: AnimationCurve,
    })
    curve = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     */
    @property({
        type: AnimationCurve,
    })
    curveMin = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */
    @property({
        type: AnimationCurve,
    })
    curveMax = new AnimationCurve();

    /**
     * @zh 当mode为Constant时，曲线的值。
     */
    @property
    constant = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */
    @property
    constantMin = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */
    @property
    constantMax = 0;

    /**
     * @zh 应用于曲线插值的系数。
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

cc.CurveRange = CurveRange;
