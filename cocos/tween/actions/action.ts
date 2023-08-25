/*
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

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

import { logID, errorID } from '../../core';
import { Node } from '../../scene-graph';

/**
 * @en Base classAction for action classes.
 * @zh Action 类是所有动作类型的基类。
 * @class Action
 */
export class Action {
    /**
     * @en Default Action tag.
     * @zh 默认动作标签。
     * @constant
     * @static
     * @default -1
     */
    static TAG_INVALID = -1;

    protected originalTarget: Node | null = null;
    protected target: Node | null = null;
    protected tag = Action.TAG_INVALID;

    /**
     * @en
     * to copy object with deep copy.
     * returns a clone of action.
     * @zh 返回一个克隆的动作。
     * @method clone
     * @return {Action}
     */
    clone (): Action {
        const action = new Action();
        action.originalTarget = null;
        action.target = null;
        action.tag = this.tag;
        return action;
    }

    /**
     * @en
     * return true if the action has finished.
     * @zh 如果动作已完成就返回 true。
     * @method isDone
     * @return {Boolean}
     */
    isDone (): boolean {
        return true;
    }

    // called before the action start. It will also set the target.
    startWithTarget (target: any): void {
        this.originalTarget = target;
        this.target = target;
    }

    // called after the action has finished. It will set the 'target' to nil.
    stop (): void {
        this.target = null;
    }

    // called every frame with it's delta time. <br />
    step (dt: number): void {
        logID(1006);
    }

    // Called once per frame. Time is the number of seconds of a frame interval.
    update (dt: number): void {
        logID(1007);
    }

    /**
     * @en get the target.
     * @zh 获取当前目标节点。
     * @method getTarget
     * @return {object}
     */
    getTarget (): Node | null {
        return this.target;
    }

    /**
     * @en The action will modify the target properties.
     * @zh 设置目标节点。
     * @method setTarget
     * @param {object} target
     */
    setTarget (target: Node): void {
        this.target = target;
    }

    /**
     * @en get the original target.
     * @zh 获取原始目标节点。
     * @method getOriginalTarget
     * @return {object}
     */
    getOriginalTarget (): Node | null {
        return this.originalTarget;
    }

    // Set the original target, since target can be nil.
    // Is the target that were used to run the action.
    // Unless you are doing something complex, like `ActionManager`, you should NOT call this method.
    setOriginalTarget (originalTarget: any): void {
        this.originalTarget = originalTarget;
    }

    /**
     * @en get tag number.
     * @zh 获取用于识别动作的标签。
     * @method getTag
     * @return {Number}
     */
    getTag (): number {
        return this.tag;
    }

    /**
     * @en set tag number.
     * @zh 设置标签，用于识别动作。
     * @method setTag
     * @param {Number} tag
     */
    setTag (tag: number): void {
        this.tag = tag;
    }

    /**
     * @en
     * Returns a reversed action. <br />
     * For example: <br />
     * - The action will be x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * - Will be rewritten
     * @zh 返回一个新的动作，执行与原动作完全相反的动作。
     * @method reverse
     * @return {Action | null}
     */
    reverse (): Action | null {
        logID(1008);
        return null;
    }

    // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
    // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
    // This is a hack, and should be removed once JSB fixes the retain/release bug.
    retain (): void { }

    // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
    // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
    // This is a hack, and should be removed once JSB fixes the retain/release bug.
    release (): void { }
}

/**
 * @en
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * @zh 有限时间动作，这种动作拥有时长 duration 属性。
 * @class FiniteTimeAction
 * @extends Action
 */
export class FiniteTimeAction extends Action {
    _duration = 0;
    _timesForRepeat = 1;

    /**
     * @en get duration of the action. (seconds).
     * @zh 获取动作以秒为单位的持续时间。
     * @method getDuration
     * @return {Number}
     */
    getDuration (): number {
        return this._duration * (this._timesForRepeat || 1);
    }

    /**
     * @en set duration of the action. (seconds).
     * @zh 设置动作以秒为单位的持续时间。
     * @method setDuration
     * @param {Number} duration
     */
    setDuration (duration: number): void {
        this._duration = duration;
    }

    /**
     * @en
     * to copy object with deep copy.
     * returns a clone of action.
     * @zh 返回一个克隆的动作。
     * @method clone
     * @return {FiniteTimeAction}
     */
    clone (): FiniteTimeAction {
        return new FiniteTimeAction();
    }
}

/*
 * Changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 */
export class Speed extends Action {
    protected _speed = 0;
    protected _innerAction: Action | null = null;

    /**
     * @warning This action can't be `Sequence-able` because it is not an `IntervalAction`
     */
    constructor (action?: Action, speed = 1) {
        super();
        action && this.initWithAction(action, speed);
    }

    /*
     * Gets the current running speed. <br />
     * Will get a percentage number, compared to the original speed.
     *
     * @method getSpeed
     * @return {Number}
     */
    getSpeed (): number {
        return this._speed;
    }

    /*
     * alter the speed of the inner function in runtime.
     * @method setSpeed
     * @param {Number} speed
     */
    setSpeed (speed: number): void {
        this._speed = speed;
    }

    /*
     * initializes the action.
     * @method initWithAction
     * @param {ActionInterval} action
     * @param {Number} speed
     * @return {Boolean}
     */
    initWithAction (action: Action, speed: number): boolean {
        if (!action) {
            errorID(1021);
            return false;
        }

        this._innerAction = action;
        this._speed = speed;
        return true;
    }

    clone (): Speed {
        const action = new Speed();
        action.initWithAction(this._innerAction!.clone(), this._speed);
        return action;
    }

    startWithTarget (target: any): void {
        Action.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    stop (): void {
        this._innerAction!.stop();
        Action.prototype.stop.call(this);
    }

    step (dt: number): void {
        this._innerAction!.step(dt * this._speed);
    }

    isDone (): boolean {
        return this._innerAction!.isDone();
    }

    reverse (): Speed {
        return new Speed(this._innerAction!.reverse()!, this._speed);
    }

    /*
     * Set inner Action.
     * @method setInnerAction
     * @param {ActionInterval} action
     */
    setInnerAction (action: any): void {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    /*
     * Get inner Action.
     * @method getInnerAction
     * @return {ActionInterval}
     */
    getInnerAction (): Action | null {
        return this._innerAction;
    }
}
