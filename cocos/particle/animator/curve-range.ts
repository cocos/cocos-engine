/**
 * @hidden
 */

import { ccclass, property } from '../../core/data/class-decorator';
import { lerp } from '../../core/math';
import { Enum } from '../../core/value-types';
import { AnimationCurve } from '../../core/geometry';
import { EDITOR } from 'internal:constants';

const SerializableTable = EDITOR && [
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

@ccclass('cc.CurveRange')
export default class CurveRange  {

    public static Mode = Mode;

    /**
     * @zh 曲线类型[[Mode]]。
     */
    @property({
        type: Mode,
    })
    public mode = Mode.Constant;

    /**
     * @zh 当mode为Curve时，使用的曲线。
     */
    @property({
        type: AnimationCurve,
    })
    public curve = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线下限。
     */
    @property({
        type: AnimationCurve,
    })
    public curveMin = new AnimationCurve();

    /**
     * @zh 当mode为TwoCurves时，使用的曲线上限。
     */
    @property({
        type: AnimationCurve,
    })
    public curveMax = new AnimationCurve();

    /**
     * @zh 当mode为Constant时，曲线的值。
     */
    @property
    public constant = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的上限。
     */
    @property
    public constantMin = 0;

    /**
     * @zh 当mode为TwoConstants时，曲线的下限。
     */
    @property
    public constantMax = 0;

    /**
     * @zh 应用于曲线插值的系数。
     */
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

    public getMax (): number {
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

    public _onBeforeSerialize (props) {
        return SerializableTable[this.mode];
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
