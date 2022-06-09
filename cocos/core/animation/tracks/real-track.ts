import { ccclass } from 'cc.decorator';
import { RealCurve } from '../../curves';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import { SingleChannelTrack } from './track';

/**
 * @en
 * A real track animates a scalar attribute of target.
 * @zh
 * 实数轨道描述目标上某个标量属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}RealTrack`)
export class RealTrack extends SingleChannelTrack<RealCurve> {
    /**
     * @internal
     */
    protected createCurve () {
        return new RealCurve();
    }
}
