import { RealCurve } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from './define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AuxiliaryCurveEntry`)
export class AuxiliaryCurveEntry {
    @serializable
    public name = '';

    @serializable
    public curve = new RealCurve();
}
