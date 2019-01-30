import { lerp } from '../../../../core/vmath';
import { Enum } from '../../../../core/value-types';
import { AnimationCurve } from '../../../geom-utils';
import { CCClass } from '../../../../core/data';
import { property, ccclass } from '../../../../core/data/class-decorator';

const Mode = Enum({
    Constant: 0,
    Curve: 1,
    TwoCurves: 2,
    TwoConstants: 3,
});

@ccclass('cc.CurveRange')
export default class CurveRange {

    @property({
        type: Mode,
    })
    public mode = Mode.Constant;

    @property({
        type: AnimationCurve,
    })
    public curve = new AnimationCurve();

    @property({
        type: AnimationCurve,
    })
    public curveMin = new AnimationCurve();

    @property({
        type: AnimationCurve,
    })
    public curveMax = new AnimationCurve();

    @property
    public constant = 0;

    @property
    public constantMin = 0;

    @property
    public constantMax = 0;

    @property
    public multiplier = 1;

    constructor () {

    }

    public evaluate (time: number, rndRatio: number) {
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
