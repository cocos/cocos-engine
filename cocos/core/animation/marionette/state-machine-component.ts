import { ccclass } from 'cc.decorator';
import { CLASS_NAME_PREFIX_ANIM } from '../define';
import type { AnimationController, StateStatus } from './animation-controller';

@ccclass(`${CLASS_NAME_PREFIX_ANIM}StateMachineComponent`)
export class StateMachineComponent {
    /**
     * Called when a motion state right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateEnter (controller: AnimationController, stateStatus: Readonly<StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a motion state is going to be exited.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateExit (controller: AnimationController, stateStatus: Readonly<StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a motion state updated except for the first and last frame.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onMotionStateUpdate (controller: AnimationController, stateStatus: Readonly<StateStatus>): void {
        // Can be overrode
    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineEnter (controller: AnimationController) {
        // Can be overrode
    }

    /**
     * Called when a state machine right after it entered.
     * @param controller The animation controller it within.
     * @param stateStatus The status of the motion.
     */
    public onStateMachineExit (controller: AnimationController) {
        // Can be overrode
    }
}
