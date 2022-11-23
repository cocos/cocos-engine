import { ccclass } from 'cc.decorator';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import type { AnimationController, MotionStateStatus } from './animation-controller';

/**
 * @en State machine component.
 * @zh 状态机组件。
 */
@ccclass(`${CLASS_NAME_PREFIX_ANIM}StateMachineComponent`)
export class StateMachineComponent {
    /**
     * @en
     * Called when a motion state right after it entered.
     * @zh
     * 在刚刚进入动作状态时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateEnter (controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void {
        // Can be overrode
    }

    /**
     * @en
     * Called when a motion state is going to be exited.
     * @zh
     * 在即将退出动作状态时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateExit (controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void {
        // Can be overrode
    }

    /**
     * @en
     * Called when a motion state updated except for the first and last frame.
     * @zh
     * 在动作状态更新时调用，但不会在第一次和最后一次时调用。
     * @param controller The animation controller it within.
     * @param motionStateStatus The status of the motion.
     */
    public onMotionStateUpdate (controller: AnimationController, motionStateStatus: Readonly<MotionStateStatus>): void {
        // Can be overrode
    }

    /**
     * @en
     * Called when a state machine right after it entered.
     * @zh
     * 在刚刚进入状态机时调用。
     * @param controller The animation controller it within.
     */
    public onStateMachineEnter (controller: AnimationController) {
        // Can be overrode
    }

    /**
     * @en
     * Called when a state machine right after it entered.
     * @zh
     * 在即将退出状态机时调用。
     * @param controller The animation controller it within.
     */
    public onStateMachineExit (controller: AnimationController) {
        // Can be overrode
    }
}
