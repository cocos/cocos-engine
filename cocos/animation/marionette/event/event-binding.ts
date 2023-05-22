import { editable } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { AnimationGraphCustomEventEmitter } from './custom-event-emitter';

/**
 * @zh 描述动画图中的事件绑定。
 * @en Describes the event bindings in animation graph.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationGraphEventBinding`)
export class AnimationGraphEventBinding {
    /**
     * @zh 绑定的事件名。
     * @en The event name bound.
     */
    @editable
    @serializable
    public eventName = '';

    /**
     * @zh 获取该绑定是否绑定了任何事件。
     * @en Tells if there's any event bound to this binding.
     */
    get isBound () {
        return !!this.eventName;
    }

    public emit (target: AnimationGraphCustomEventEmitter) {
        target.emit(this.eventName);
    }

    public copyTo (that: AnimationGraphEventBinding) {
        that.eventName = this.eventName;
        return this;
    }
}
