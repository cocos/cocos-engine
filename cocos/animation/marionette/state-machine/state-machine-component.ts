/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { ccclass } from 'cc.decorator';
import { CLASS_NAME_PREFIX_ANIM } from '../../define';
import type { AnimationController, MotionStateStatus } from '../animation-controller';

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
    public onStateMachineEnter (controller: AnimationController): void {
        // Can be overrode
    }

    /**
     * @en
     * Called when a state machine is going to be exited.
     * @zh
     * 在即将退出状态机时调用。
     * @param controller The animation controller it within.
     */
    public onStateMachineExit (controller: AnimationController): void {
        // Can be overrode
    }
}
