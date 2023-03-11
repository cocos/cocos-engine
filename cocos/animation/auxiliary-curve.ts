import { RealCurve } from '../core';
import { ccclass, serializable } from '../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from './define';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}AuxiliaryCurveInfo`)
export class AuxiliaryCurveInfo {
    @serializable
    public name = '';

    @serializable
    public curve = new RealCurve();
}
