import { ccclass } from 'cc.decorator';
import { ObjectCurve } from '../../curves';
import { CLASS_NAME_PREFIX_ANIM, createEvalSymbol } from '../define';
import { SingleChannelTrack } from './track';

/**
 * @en
 * An object track animates an object of attribute of target.
 * @zh
 * 对象轨道描述目标上某个对象类型的属性的动画。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}ObjectTrack`)
export class ObjectTrack<T> extends SingleChannelTrack<ObjectCurve<T>> {
    /**
     * @internal
     */
    protected createCurve () {
        return new ObjectCurve<T>();
    }
}
