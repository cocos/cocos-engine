import { ccclass } from 'cc.decorator';
import { QuatCurve, Quat } from '../../core';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { SingleChannelTrack } from './track';

/**
 * @en
 * A quaternion track animates a quaternion(rotation) attribute of target.
 * @zh
 * 四元数轨道描述目标上某个四元数（旋转）属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}QuatTrack`)
export class QuatTrack extends SingleChannelTrack<QuatCurve> {
    /**
     * @internal
     */
    protected createCurve () {
        return new QuatCurve();
    }

    /**
     * @internal
     */
    public [createEvalSymbol] () {
        return new QuatTrackEval(this.channels()[0].curve);
    }
}

export class QuatTrackEval {
    constructor (private _curve: QuatCurve) {

    }

    public evaluate (time: number) {
        this._curve.evaluate(time, this._result);
        return this._result;
    }

    private _result: Quat = new Quat();
}
