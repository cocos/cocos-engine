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

import { ccclass, editable, serializable } from 'cc.decorator';
import { Motion } from '../motion';
import { State, InteractiveState } from './state';
import { AnimationGraphEventBinding } from '../event/event-binding';

@ccclass('cc.animation.Motion')
export class MotionState extends InteractiveState {
    @serializable
    public motion: Motion | null = null;

    @serializable
    public speed = 1.0;

    /**
     * Should be float.
     */
    @serializable
    public speedMultiplier = '';

    @serializable
    public speedMultiplierEnabled = false;

    /**
     * @zh 状态进入事件绑定，此处绑定的事件会在状态机向该状态过渡时触发。
     * @en State entered event binding. The event bound here will be triggered
     * when the state machine starts to transition into this state.
     */
    @serializable
    @editable
    public transitionInEventBinding = new AnimationGraphEventBinding();

    /**
     * @zh 状态离开事件绑定，此处绑定的事件会在状态机从该状态离开时触发。
     * @en State left event binding. The event bound here will be triggered
     * when the state machine starts to transition out from this state.
     */
    @serializable
    @editable
    public transitionOutEventBinding = new AnimationGraphEventBinding();

    /**
     * // TODO: HACK
     * @internal
     */
    __callOnAfterDeserializeRecursive (): void {
        this.motion?.__callOnAfterDeserializeRecursive();
    }

    public copyTo (that: MotionState): MotionState {
        super.copyTo(that);
        that.motion = this.motion?.clone() ?? null;
        that.speed = this.speed;
        that.speedMultiplier = this.speedMultiplier;
        that.speedMultiplierEnabled = this.speedMultiplierEnabled;
        this.transitionInEventBinding.copyTo(that.transitionInEventBinding);
        this.transitionOutEventBinding.copyTo(that.transitionOutEventBinding);
        return this;
    }
}
