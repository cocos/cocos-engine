import { editable } from '../../../core';
import { ccclass, serializable } from '../../../core/data/decorators';
import { Node } from '../../../scene-graph';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import { invokeComponentMethodsEngagedInAnimationEvent } from '../../event/event-emitter';

/**
 * @zh 描述动画图中的事件绑定。
 * @en Describes the event bindings in animation graph.
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}AnimationGraphEventBinding`)
export class AnimationGraphEventBinding {
    /**
     * @zh 绑定的方法名。
     * @en The event name bound.
     */
    @editable
    @serializable
    public methodName = '';

    /**
     * @zh 获取该绑定是否绑定了任何事件。
     * @en Tells if there's any event bound to this binding.
     */
    get isBound (): boolean {
        return !!this.methodName;
    }

    public emit (origin: Node): void {
        if (!this.methodName) {
            return;
        }

        invokeComponentMethodsEngagedInAnimationEvent(origin, this.methodName, []);
    }

    public copyTo (that: AnimationGraphEventBinding): AnimationGraphEventBinding {
        that.methodName = this.methodName;
        return this;
    }
}
