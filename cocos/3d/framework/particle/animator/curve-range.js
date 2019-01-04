import { lerp } from '../../../../core/vmath';
import { Enum } from '../../../../core/value-types';
import { AnimationCurve } from '../../../geom-utils';
import { CCClass } from '../../../../core/data';
import { ccclass, property } from '../../../../core/data/class-decorator';

const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3
});

@ccclass('cc.CurveRange')
export default class CurveRange {

    @property({ type: Mode })
    mode = Mode.Constant;

    @property({ type: AnimationCurve })
    curve = null;

    @property({ type: AnimationCurve })
    curveMin = null;

    @property({ type: AnimationCurve })
    curveMax = null;

    @property
    constant = 0;

    @property
    constantMin = 0;

    @property
    constantMax = 0;

    @property
    multiplier = 1;

    constructor() {

    }

    evaluate(time, rndRatio) {
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
}

// CCClass.fastDefine('cc.CurveRange', CurveRange, {
//     mode: Mode.Constant,
//     constant: 0,
//     constantMin: 0,
//     constantMax: 0,
//     curve: new AnimationCurve(),
//     curveMin: new AnimationCurve(),
//     curveMax: new AnimationCurve(),
//     multiplier: 1
// });
