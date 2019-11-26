/**
 * @hidden
 */

import { FiniteTimeAction, Action } from "./action";
import { macro, logID, errorID } from "../../core";
import { ActionInstant } from "./action-instant";

/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


/**
 * !#en
 * <p> An interval action is an action that takes place within a certain period of time. <br/>
 * It has an start time, and a finish time. The finish time is the parameter<br/>
 * duration plus the start time.</p>
 *
 * <p>These CCActionInterval actions have some interesting properties, like:<br/>
 * - They can run normally (default)  <br/>
 * - They can run reversed with the reverse method   <br/>
 * - They can run with the time altered with the Accelerate, AccelDeccel and Speed actions. </p>
 *
 * <p>For example, you can simulate a Ping Pong effect running the action normally and<br/>
 * then running it again in Reverse mode. </p>
 * !#zh 时间间隔动作，这种动作在已定时间内完成，继承 FiniteTimeAction。
 * @class ActionInterval
 * @extends FiniteTimeAction
 * @param {Number} d duration in seconds
 */
export class ActionInterval extends FiniteTimeAction {

    protected MAX_VALUE = 2;
    protected _elapsed = 0;
    protected _firstTick = false;
    protected _easeList: Function[] = [];
    protected _speed = 1;
    protected _repeatForever = false;
    _repeatMethod = false;//Compatible with repeat class, Discard after can be deleted
    protected _speedMethod = false;//Compatible with repeat class, Discard after can be deleted

    constructor (d?: number) {
        super();
        if (d !== undefined && !isNaN(d)) {
            this.initWithDuration(d);
        }
    }

    /*
     * How many seconds had elapsed since the actions started to run.
     * @return {Number}
     */
    getElapsed () {
        return this._elapsed;
    }

    /*
     * Initializes the action.
     * @param {Number} d duration in seconds
     * @return {Boolean}
     */
    initWithDuration (d: number) {
        this._duration = (d === 0) ? macro.FLT_EPSILON : d;
        // prevent division by 0
        // This comparison could be in step:, but it might decrease the performance
        // by 3% in heavy based action games.
        this._elapsed = 0;
        this._firstTick = true;
        return true;
    }

    isDone () {
        return (this._elapsed >= this._duration);
    }

    _cloneDecoration (action: ActionInterval) {
        action._repeatForever = this._repeatForever;
        action._speed = this._speed;
        action._timesForRepeat = this._timesForRepeat;
        action._easeList = this._easeList;
        action._speedMethod = this._speedMethod;
        action._repeatMethod = this._repeatMethod;
    }

    _reverseEaseList (action: ActionInterval) {
        if (this._easeList) {
            action._easeList = [];
            for (var i = 0; i < this._easeList.length; i++) {
                action._easeList.push(this._easeList[i]);
            }
        }
    }

    clone () {
        var action = new ActionInterval(this._duration);
        this._cloneDecoration(action);
        return action;
    }

    /**
     * !#en Implementation of ease motion.
     * !#zh 缓动运动。
     * @method easing
     * @param {Object} easeObj
     * @returns {ActionInterval}
     * @example
     * action.easing(cc.easeIn(3.0));
     */
    easing (easeObj: any): ActionInterval {
        if (this._easeList)
            this._easeList.length = 0;
        else
            this._easeList = [];
        for (var i = 0; i < arguments.length; i++)
            this._easeList.push(arguments[i]);
        return this;
    }

    _computeEaseTime (dt: any) {
        // var locList = this._easeList;
        // if ((!locList) || (locList.length === 0))
        //     return dt;
        // for (var i = 0, n = locList.length; i < n; i++)
        //     dt = locList[i].easing(dt);
        return dt;
    }

    step (dt: number) {
        if (this._firstTick) {
            this._firstTick = false;
            this._elapsed = 0;
        } else
            this._elapsed += dt;

        //this.update((1 > (this._elapsed / this._duration)) ? this._elapsed / this._duration : 1);
        //this.update(Math.max(0, Math.min(1, this._elapsed / Math.max(this._duration, cc.macro.FLT_EPSILON))));
        var t = this._elapsed / (this._duration > 0.0000001192092896 ? this._duration : 0.0000001192092896);
        t = (1 > t ? t : 1);
        this.update(t > 0 ? t : 0);

        //Compatible with repeat class, Discard after can be deleted (this._repeatMethod)
        if (this._repeatMethod && this._timesForRepeat > 1 && this.isDone()) {
            if (!this._repeatForever) {
                this._timesForRepeat--;
            }
            //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
            this.startWithTarget(this.target);
            // to prevent jerk. issue #390 ,1247
            //this._innerAction.step(0);
            //this._innerAction.step(diff);
            this.step(this._elapsed - this._duration);

        }
    }

    startWithTarget (target: any) {
        Action.prototype.startWithTarget.call(this, target);
        this._elapsed = 0;
        this._firstTick = true;
    }

    reverse () {
        logID(1010);
        return this;
    }

    /*
     * Set amplitude rate.
     * @warning It should be overridden in subclass.
     * @param {Number} amp
     */
    setAmplitudeRate (amp: any) {
        // Abstract class needs implementation
        logID(1011);
    }

    /*
     * Get amplitude rate.
     * @warning It should be overridden in subclass.
     * @return {Number} 0
     */
    getAmplitudeRate () {
        // Abstract class needs implementation
        logID(1012);
        return 0;
    }

    /**
     * !#en
     * Changes the speed of an action, making it take longer (speed>1)
     * or less (speed<1) time. <br/>
     * Useful to simulate 'slow motion' or 'fast forward' effect.
     * !#zh
     * 改变一个动作的速度，使它的执行使用更长的时间（speed > 1）<br/>
     * 或更少（speed < 1）可以有效得模拟“慢动作”或“快进”的效果。
     * @param {Number} speed
     * @returns {Action}
     */
    speed (speed: number): Action {
        if (speed <= 0) {
            logID(1013);
            return this;
        }

        this._speedMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._speed *= speed;
        return this;
    }

    /**
     * Get this action speed.
     * @return {Number}
     */
    getSpeed (): number {
        return this._speed;
    }

    /**
     * Set this action speed.
     * @param {Number} speed
     * @returns {ActionInterval}
     */
    setSpeed (speed: number): ActionInterval {
        this._speed = speed;
        return this;
    }

    /**
     * !#en
     * Repeats an action a number of times.
     * To repeat an action forever use the CCRepeatForever action.
     * !#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
     * @method repeat
     * @param {Number} times
     * @returns {ActionInterval}
     */
    repeat (times: number): ActionInterval {
        times = Math.round(times);
        if (isNaN(times) || times < 1) {
            logID(1014);
            return this;
        }
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat *= times;
        return this;
    }

    /**
     * !#en
     * Repeats an action for ever.  <br/>
     * To repeat the an action for a limited number of times use the Repeat action. <br/>
     * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。
     * @method repeatForever
     * @returns {ActionInterval}
     */
    repeatForever (): ActionInterval {
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat = this.MAX_VALUE;
        this._repeatForever = true;
        return this;
    }
}

function actionInterval (d: number) {
    return new ActionInterval(d);
}

/*
 * Runs actions sequentially, one after another.
 * @class Sequence
 * @extends ActionInterval
 * @param {Array|FiniteTimeAction} tempArray
 * @example
 * // create sequence with actions
 * var seq = new cc.Sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = new cc.Sequence(actArray);
 */
export class Sequence extends ActionInterval {

    static _actionOneTwo = function (actionOne: ActionInterval, actionTwo: ActionInterval) {
        var sequence = new Sequence();
        sequence.initWithTwoActions(actionOne, actionTwo);
        return sequence;
    }

    private _actions: ActionInterval[] = [];
    private _split = 0;
    private _last = 0;
    private _reversed = false;

    constructor (tempArray?: any) {
        super();

        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if (paramArray.length === 1) {
            errorID(1019);
            return;
        }
        var last = paramArray.length - 1;
        if ((last >= 0) && (paramArray[last] == null))
            logID(1015);

        if (last >= 0) {
            var prev = paramArray[0], action1: any;
            for (var i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = Sequence._actionOneTwo(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    /*
     * Initializes the action <br/>
     * @param {FiniteTimeAction} actionOne
     * @param {FiniteTimeAction} actionTwo
     * @return {Boolean}
     */
    initWithTwoActions (actionOne: any, actionTwo: any) {
        if (!actionOne || !actionTwo) {
            errorID(1025);
            return false;
        }

        var durationOne = actionOne._duration, durationTwo = actionTwo._duration;
        durationOne *= actionOne._repeatMethod ? actionOne._timesForRepeat : 1;
        durationTwo *= actionTwo._repeatMethod ? actionTwo._timesForRepeat : 1;
        var d = durationOne + durationTwo;
        this.initWithDuration(d);

        this._actions[0] = actionOne;
        this._actions[1] = actionTwo;
        return true;
    }

    clone () {
        var action = new Sequence();
        this._cloneDecoration(action as any);
        action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return action as any;
    }

    startWithTarget (target: any) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._split = this._actions[0]._duration / this._duration;
        this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
        this._last = -1;
    }

    stop () {
        // Issue #1305
        if (this._last !== -1)
            this._actions[this._last].stop();
        Action.prototype.stop.call(this);
    }

    update (dt: number) {
        var new_t: number, found = 0;
        var locSplit = this._split;
        var locActions = this._actions;
        var locLast = this._last;
        var actionFound: ActionInterval;

        dt = this._computeEaseTime(dt);
        if (dt < locSplit) {
            // action[0]
            new_t = (locSplit !== 0) ? dt / locSplit : 1;

            if (found === 0 && locLast === 1 && this._reversed) {
                // Reverse mode ?
                // XXX: Bug. this case doesn't contemplate when _last==-1, found=0 and in "reverse mode"
                // since it will require a hack to know if an action is on reverse mode or not.
                // "step" should be overriden, and the "reverseMode" value propagated to inner Sequences.
                locActions[1].update(0);
                locActions[1].stop();
            }
        } else {
            // action[1]
            found = 1;
            new_t = (locSplit === 1) ? 1 : (dt - locSplit) / (1 - locSplit);

            if (locLast === -1) {
                // action[0] was skipped, execute it.
                locActions[0].startWithTarget(this.target);
                locActions[0].update(1);
                locActions[0].stop();
            }
            if (locLast === 0) {
                // switching to action 1. stop action 0.
                locActions[0].update(1);
                locActions[0].stop();
            }
        }

        actionFound = locActions[found];
        // Last action found and it is done.
        if (locLast === found && actionFound.isDone())
            return;

        // Last action not found
        if (locLast !== found)
            actionFound.startWithTarget(this.target);

        new_t = new_t * actionFound._timesForRepeat;
        actionFound.update(new_t > 1 ? new_t % 1 : new_t);
        this._last = found;
    }

    reverse () {
        var action = Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action._reversed = true;
        return action as any;
    }
}

/**
 * !#en
 * Helper constructor to create an array of sequenceable actions
 * The created action will run actions sequentially, one after another.
 * !#zh 顺序执行动作，创建的动作将按顺序依次运行。
 * @method sequence
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {ActionInterval}
 * @example
 * // example
 * // create sequence with actions
 * var seq = cc.sequence(act1, act2);
 *
 * // create sequence with array
 * var seq = cc.sequence(actArray);
 */
// todo: It should be use new
export function sequence (/*Multiple Arguments*/tempArray: any): ActionInterval {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    if (paramArray.length === 1) {
        errorID(1019);
        return null as any;
    }
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        logID(1015);

    var result: any = null;
    if (last >= 0) {
        result = paramArray[0];
        for (var i = 1; i <= last; i++) {
            if (paramArray[i]) {
                result = Sequence._actionOneTwo(result, paramArray[i]);
            }
        }
    }

    return result as any;
};

/*
 * Repeats an action a number of times.
 * To repeat an action forever use the CCRepeatForever action.
 * @class Repeat
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @example
 * var rep = new cc.Repeat(cc.sequence(jump2, jump1), 5);
 */
export class Repeat extends ActionInterval {

    private _times = 0;
    private _total = 0;
    private _nextDt = 0;
    private _actionInstant = false;
    private _innerAction: FiniteTimeAction | null = null;

    constructor (action?: any, times?: any) {
        super();
        times !== undefined && this.initWithAction(action, times);
    }

    /*
     * @param {FiniteTimeAction} action
     * @param {Number} times
     * @return {Boolean}
     */
    initWithAction (action: FiniteTimeAction, times: number) {
        var duration = action._duration * times;

        if (this.initWithDuration(duration)) {
            this._times = times;
            this._innerAction = action;
            if (action instanceof ActionInstant) {
                this._actionInstant = true;
                this._times -= 1;
            }
            this._total = 0;
            return true;
        }
        return false;
    }

    clone () {
        var action = new Repeat();
        this._cloneDecoration(action);
        action.initWithAction(this._innerAction!.clone(), this._times);
        return action;
    }

    startWithTarget (target: any) {
        this._total = 0;
        this._nextDt = this._innerAction!._duration / this._duration;
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    stop () {
        this._innerAction!.stop();
        Action.prototype.stop.call(this);
    }

    update (dt: number) {
        dt = this._computeEaseTime(dt);
        var locInnerAction = this._innerAction!;
        var locDuration = this._duration;
        var locTimes = this._times;
        var locNextDt = this._nextDt;

        if (dt >= locNextDt) {
            while (dt > locNextDt && this._total < locTimes) {
                locInnerAction.update(1);
                this._total++;
                locInnerAction.stop();
                locInnerAction.startWithTarget(this.target);
                locNextDt += locInnerAction._duration / locDuration;
                this._nextDt = locNextDt > 1 ? 1 : locNextDt;
            }

            // fix for issue #1288, incorrect end value of repeat
            if (dt >= 1.0 && this._total < locTimes) {
                // fix for cocos-creator/fireball/issues/4310
                locInnerAction.update(1);
                this._total++;
            }

            // don't set a instant action back or update it, it has no use because it has no duration
            if (!this._actionInstant) {
                if (this._total === locTimes) {
                    locInnerAction.stop();
                } else {
                    // issue #390 prevent jerk, use right update
                    locInnerAction.update(dt - (locNextDt - locInnerAction._duration / locDuration));
                }
            }
        } else {
            locInnerAction.update((dt * locTimes) % 1.0);
        }
    }

    isDone () {
        return this._total === this._times;
    }

    reverse () {
        var action = new Repeat(this._innerAction!.reverse(), this._times);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action as any;
    }

    /*
     * Set inner Action.
     * @param {FiniteTimeAction} action
     */
    setInnerAction (action: any) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    /*
     * Get inner Action.
     * @return {FiniteTimeAction}
     */
    getInnerAction () {
        return this._innerAction;
    }
}

/**
 * !#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * !#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
 * @method repeat
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @return {Action}
 * @example
 * // example
 * var rep = repeat(cc.sequence(jump2, jump1), 5);
 */
export function repeat (action: any, times: any): Action {
    return new Repeat(action, times);
}

/*
 * Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class RepeatForever
 * @extends ActionInterval
 * @param {ActionInterval} action
 * @example
 * var rep = new RepeatForever(cc.sequence(jump2, jump1), 5);
 */
export class RepeatForever extends ActionInterval {

    private _innerAction: ActionInterval | null = null;

    constructor (action?: ActionInterval) {
        super();
        action && this.initWithAction(action);
    }

    /*
     * @param {ActionInterval} action
     * @return {Boolean}
     */
    initWithAction (action: ActionInterval) {
        if (!action) {
            errorID(1026);
            return false;
        }

        this._innerAction = action;
        return true;
    }

    clone () {
        var action = new RepeatForever();
        this._cloneDecoration(action);
        action.initWithAction(this._innerAction!.clone());
        return action;
    }

    startWithTarget (target: any) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction!.startWithTarget(target);
    }

    step (dt: any) {
        var locInnerAction = this._innerAction!;
        locInnerAction.step(dt);
        if (locInnerAction.isDone()) {
            //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
            locInnerAction.startWithTarget(this.target);
            // to prevent jerk. issue #390 ,1247
            //this._innerAction.step(0);
            //this._innerAction.step(diff);
            locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
        }
    }

    isDone () {
        return false;
    }

    reverse () {
        var action = new RepeatForever(this._innerAction!.reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action as any;
    }

    /*
     * Set inner action.
     * @param {ActionInterval} action
     */
    setInnerAction (action: any) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    }

    /*
     * Get inner action.
     * @return {ActionInterval}
     */
    getInnerAction () {
        return this._innerAction;
    }
}

/**
 * !#en Create a acton which repeat forever, as it runs forever, it can't be added into cc.sequence and cc.spawn.
 * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 cc.sequence 或 cc.spawn 中。
 * @method repeatForever
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 * var repeat = repeatForever(cc.rotateBy(1.0, 360));
 */
export function repeatForever (action?: ActionInterval): ActionInterval {
    return new RepeatForever(action);
}

/* 
 * Spawn a new action immediately
 * @class Spawn
 * @extends ActionInterval
 */
export class Spawn extends ActionInterval {

    static _actionOneTwo = function (action1: any, action2: any) {
        var pSpawn = new Spawn();
        pSpawn.initWithTwoActions(action1, action2);
        return pSpawn;
    }

    private _one: ActionInterval | null = null;
    private _two: ActionInterval | null = null;

    constructor (tempArray?: any) {
        super();

        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if (paramArray.length === 1) {
            errorID(1020);
            return;
        }
        var last = paramArray.length - 1;
        if ((last >= 0) && (paramArray[last] == null))
            logID(1015);

        if (last >= 0) {
            var prev = paramArray[0], action1: any;
            for (var i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = Spawn._actionOneTwo(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    }

    /* initializes the Spawn action with the 2 actions to spawn
     * @param {FiniteTimeAction} action1
     * @param {FiniteTimeAction} action2
     * @return {Boolean}
     */
    initWithTwoActions (action1: any, action2: any) {
        if (!action1 || !action2) {
            errorID(1027);
            return false;
        }

        var ret = false;

        var d1 = action1._duration;
        var d2 = action2._duration;

        if (this.initWithDuration(Math.max(d1, d2))) {
            this._one = action1;
            this._two = action2;

            if (d1 > d2) {
                this._two = Sequence._actionOneTwo(action2, delayTime(d1 - d2));
            } else if (d1 < d2) {
                this._one = Sequence._actionOneTwo(action1, delayTime(d2 - d1));
            }

            ret = true;
        }
        return ret;
    }

    clone () {
        var action = new Spawn();
        this._cloneDecoration(action);
        action.initWithTwoActions(this._one!.clone(), this._two!.clone());
        return action;
    }

    startWithTarget (target: any) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._one!.startWithTarget(target);
        this._two!.startWithTarget(target);
    }

    stop () {
        this._one!.stop();
        this._two!.stop();
        Action.prototype.stop.call(this);
    }

    update (dt: any) {
        dt = this._computeEaseTime(dt);
        if (this._one)
            this._one.update(dt);
        if (this._two)
            this._two.update(dt);
    }

    reverse () {
        var action = Spawn._actionOneTwo(this._one!.reverse(), this._two!.reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action as any;
    }
}

/**
 * !#en Create a spawn action which runs several actions in parallel.
 * !#zh 同步执行动作，同步执行一组动作。
 * @method spawn
 * @param {FiniteTimeAction|FiniteTimeAction[]} actionOrActionArray
 * @param {FiniteTimeAction} ...tempArray
 * @return {FiniteTimeAction}
 * @example
 * // example
 * var action = cc.spawn(cc.jumpBy(2, cc.v2(300, 0), 50, 4), cc.rotateBy(2, 720));
 * todo:It should be the direct use new
 */
export function spawn (/*Multiple Arguments*/tempArray: any): FiniteTimeAction {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    if (paramArray.length === 1) {
        errorID(1020);
        return null as any;
    }
    if ((paramArray.length > 0) && (paramArray[paramArray.length - 1] == null))
        logID(1015);

    var prev = paramArray[0];
    for (var i = 1; i < paramArray.length; i++) {
        if (paramArray[i] != null)
            prev = Spawn._actionOneTwo(prev, paramArray[i]);
    }
    return prev;
}

/* Delays the action a certain amount of seconds
 * @class DelayTime
 * @extends ActionInterval
 */
class DelayTime extends ActionInterval {

    update (dt: any) { }

    reverse () {
        var action = new DelayTime(this._duration);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action as any;
    }

    clone () {
        var action = new DelayTime();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration);
        return action;
    }
}

/**
 * !#en Delays the action a certain amount of seconds.
 * !#zh 延迟指定的时间量。
 * @method delayTime
 * @param {Number} d duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var delay = cc.delayTime(1);
 */
export function delayTime (d: number): ActionInterval {
    return new DelayTime(d);
};

/*
 * <p>
 * Executes an action in reverse order, from time=duration to time=0                                     <br/>
 * @warning Use this action carefully. This action is not sequenceable.                                 <br/>
 * Use it as the default "reversed" method of your own actions, but using it outside the "reversed"      <br/>
 * scope is not recommended.
 * </p>
 * @class ReverseTime
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 *  var reverse = new cc.ReverseTime(this);
 */
export class ReverseTime extends ActionInterval {

    private _other: ActionInterval | null = null;

    constructor (action?: any) {
        super();
        action && this.initWithAction(action);
    }

    /*
     * @param {FiniteTimeAction} action
     * @return {Boolean}
     */
    initWithAction (action: ActionInterval) {
        if (!action) {
            errorID(1028);
            return false;
        }
        if (action === this._other) {
            errorID(1029);
            return false;
        }

        if (ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
            // Don't leak if action is reused
            this._other = action;
            return true;
        }
        return false;
    }

    clone () {
        var action = new ReverseTime();
        this._cloneDecoration(action);
        action.initWithAction(this._other!.clone());
        return action;
    }

    startWithTarget (target: any) {
        ActionInterval.prototype.startWithTarget.call(this, target);
        this._other!.startWithTarget(target);
    }

    update (dt: number) {
        dt = this._computeEaseTime(dt);
        if (this._other)
            this._other.update(1 - dt);
    }

    reverse () {
        return this._other!.clone() as any;
    }

    stop () {
        this._other!.stop();
        Action.prototype.stop.call(this);
    }
}

/**
 * !#en Executes an action in reverse order, from time=duration to time=0.
 * !#zh 反转目标动作的时间轴。
 * @method reverseTime
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 *  var reverse = cc.reverseTime(this);
 */
export function reverseTime (action: any): ActionInterval {
    return new ReverseTime(action);
}
