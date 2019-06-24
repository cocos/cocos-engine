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
 * @module cc
 */

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
cc.ActionInterval = cc.Class({
    name: 'cc.ActionInterval',
    extends: cc.FiniteTimeAction,

    ctor:function (d) {
        this.MAX_VALUE = 2;
        this._elapsed = 0;
        this._firstTick = false;
        this._easeList = null;
        this._speed = 1;
        this._timesForRepeat = 1;
        this._repeatForever = false;
        this._repeatMethod = false;//Compatible with repeat class, Discard after can be deleted
        this._speedMethod = false;//Compatible with repeat class, Discard after can be deleted
        d !== undefined && cc.ActionInterval.prototype.initWithDuration.call(this, d);
    },

    /*
     * How many seconds had elapsed since the actions started to run.
     * @return {Number}
     */
    getElapsed:function () {
        return this._elapsed;
    },

    /*
     * Initializes the action.
     * @param {Number} d duration in seconds
     * @return {Boolean}
     */
    initWithDuration:function (d) {
        this._duration = (d === 0) ? cc.macro.FLT_EPSILON : d;
        // prevent division by 0
        // This comparison could be in step:, but it might decrease the performance
        // by 3% in heavy based action games.
        this._elapsed = 0;
        this._firstTick = true;
        return true;
    },

    isDone:function () {
        return (this._elapsed >= this._duration);
    },

    _cloneDecoration: function(action){
        action._repeatForever = this._repeatForever;
        action._speed = this._speed;
        action._timesForRepeat = this._timesForRepeat;
        action._easeList = this._easeList;
        action._speedMethod = this._speedMethod;
        action._repeatMethod = this._repeatMethod;
    },

    _reverseEaseList: function(action){
        if(this._easeList){
            action._easeList = [];
            for(var i=0; i<this._easeList.length; i++){
                action._easeList.push(this._easeList[i].reverse());
            }
        }
    },

    clone:function () {
        var action = new cc.ActionInterval(this._duration);
        this._cloneDecoration(action);
        return action;
    },

    /**
     * !#en Implementation of ease motion.
     * !#zh 缓动运动。
     * @method easing
     * @param {Object} easeObj
     * @returns {ActionInterval}
     * @example
     * action.easing(cc.easeIn(3.0));
     */
    easing: function (easeObj) {
        if (this._easeList)
            this._easeList.length = 0;
        else
            this._easeList = [];
        for (var i = 0; i < arguments.length; i++)
            this._easeList.push(arguments[i]);
        return this;
    },

    _computeEaseTime: function (dt) {
        var locList = this._easeList;
        if ((!locList) || (locList.length === 0))
            return dt;
        for (var i = 0, n = locList.length; i < n; i++)
            dt = locList[i].easing(dt);
        return dt;
    },

    step:function (dt) {
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
        if(this._repeatMethod && this._timesForRepeat > 1 && this.isDone()){
            if(!this._repeatForever){
                this._timesForRepeat--;
            }
            //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
            this.startWithTarget(this.target);
            // to prevent jerk. issue #390 ,1247
            //this._innerAction.step(0);
            //this._innerAction.step(diff);
            this.step(this._elapsed - this._duration);

        }
    },

    startWithTarget:function (target) {
        cc.Action.prototype.startWithTarget.call(this, target);
        this._elapsed = 0;
        this._firstTick = true;
    },

    reverse:function () {
        cc.logID(1010);
        return null;
    },

    /*
     * Set amplitude rate.
     * @warning It should be overridden in subclass.
     * @param {Number} amp
     */
    setAmplitudeRate:function (amp) {
        // Abstract class needs implementation
        cc.logID(1011);
    },

    /*
     * Get amplitude rate.
     * @warning It should be overridden in subclass.
     * @return {Number} 0
     */
    getAmplitudeRate:function () {
        // Abstract class needs implementation
        cc.logID(1012);
        return 0;
    },

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
    speed: function(speed){
        if(speed <= 0){
            cc.logID(1013);
            return this;
        }

        this._speedMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._speed *= speed;
        return this;
    },

    /**
     * Get this action speed.
     * @return {Number}
     */
    getSpeed: function(){
        return this._speed;
    },

    /**
     * Set this action speed.
     * @param {Number} speed
     * @returns {ActionInterval}
     */
    setSpeed: function(speed){
        this._speed = speed;
        return this;
    },

    /**
     * !#en
     * Repeats an action a number of times.
     * To repeat an action forever use the CCRepeatForever action.
     * !#zh 重复动作可以按一定次数重复一个动作，使用 RepeatForever 动作来永远重复一个动作。
     * @method repeat
     * @param {Number} times
     * @returns {ActionInterval}
     */
    repeat: function(times){
        times = Math.round(times);
        if(isNaN(times) || times < 1){
            cc.logID(1014);
            return this;
        }
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat *= times;
        return this;
    },

    /**
     * !#en
     * Repeats an action for ever.  <br/>
     * To repeat the an action for a limited number of times use the Repeat action. <br/>
     * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 Repeat 动作。
     * @method repeatForever
     * @returns {ActionInterval}
     */
    repeatForever: function(){
        this._repeatMethod = true;//Compatible with repeat class, Discard after can be deleted
        this._timesForRepeat = this.MAX_VALUE;
        this._repeatForever = true;
        return this;
    }
});

cc.actionInterval = function (d) {
    return new cc.ActionInterval(d);
};

/**
 * @module cc
 */

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
cc.Sequence = cc.Class({
    name: 'cc.Sequence',
    extends: cc.ActionInterval,

    ctor:function (tempArray) {
        this._actions = [];
        this._split = null;
        this._last = 0;
        this._reversed = false;

        var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if (paramArray.length === 1) {
            cc.errorID(1019);
            return;
        }
        var last = paramArray.length - 1;
        if ((last >= 0) && (paramArray[last] == null))
            cc.logID(1015);

        if (last >= 0) {
            var prev = paramArray[0], action1;
            for (var i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = cc.Sequence._actionOneTwo(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    },

    /*
     * Initializes the action <br/>
     * @param {FiniteTimeAction} actionOne
     * @param {FiniteTimeAction} actionTwo
     * @return {Boolean}
     */
    initWithTwoActions:function (actionOne, actionTwo) {
        if (!actionOne || !actionTwo) {
            cc.errorID(1025);
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
    },

    clone:function () {
        var action = new cc.Sequence();
        this._cloneDecoration(action);
        action.initWithTwoActions(this._actions[0].clone(), this._actions[1].clone());
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._split = this._actions[0]._duration / this._duration;
        this._split *= this._actions[0]._repeatMethod ? this._actions[0]._timesForRepeat : 1;
        this._last = -1;
    },

    stop:function () {
        // Issue #1305
        if (this._last !== -1)
            this._actions[this._last].stop();
        cc.Action.prototype.stop.call(this);
    },

    update:function (dt) {
        var new_t, found = 0;
        var locSplit = this._split, locActions = this._actions, locLast = this._last, actionFound;

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
    },

    reverse:function () {
        var action = cc.Sequence._actionOneTwo(this._actions[1].reverse(), this._actions[0].reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        action._reversed = true;
        return action;
    }
});

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
cc.sequence = function (/*Multiple Arguments*/tempArray) {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    if (paramArray.length === 1) {
        cc.errorID(1019);
        return null;
    }
    var last = paramArray.length - 1;
    if ((last >= 0) && (paramArray[last] == null))
        cc.logID(1015);

    var result = null;
    if (last >= 0) {
        result = paramArray[0];
        for (var i = 1; i <= last; i++) {
            if (paramArray[i]) {
                result = cc.Sequence._actionOneTwo(result, paramArray[i]);
            }
        }
    }

    return result;
};

cc.Sequence._actionOneTwo = function (actionOne, actionTwo) {
    var sequence = new cc.Sequence();
    sequence.initWithTwoActions(actionOne, actionTwo);
    return sequence;
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
cc.Repeat = cc.Class({
    name: 'cc.Repeat',
    extends: cc.ActionInterval,

    ctor: function (action, times) {
        this._times = 0;
        this._total = 0;
        this._nextDt = 0;
        this._actionInstant = false;
        this._innerAction = null;
		times !== undefined && this.initWithAction(action, times);
    },

    /*
     * @param {FiniteTimeAction} action
     * @param {Number} times
     * @return {Boolean}
     */
    initWithAction:function (action, times) {
        var duration = action._duration * times;

        if (this.initWithDuration(duration)) {
            this._times = times;
            this._innerAction = action;
            if (action instanceof cc.ActionInstant){
                this._actionInstant = true;
                this._times -= 1;
            }
            this._total = 0;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.Repeat();
        this._cloneDecoration(action);
        action.initWithAction(this._innerAction.clone(), this._times);
        return action;
    },

    startWithTarget:function (target) {
        this._total = 0;
        this._nextDt = this._innerAction._duration / this._duration;
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction.startWithTarget(target);
    },

    stop:function () {
        this._innerAction.stop();
        cc.Action.prototype.stop.call(this);
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        var locInnerAction = this._innerAction;
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
    },

    isDone:function () {
        return this._total === this._times;
    },

    reverse:function () {
        var action = new cc.Repeat(this._innerAction.reverse(), this._times);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    /*
     * Set inner Action.
     * @param {FiniteTimeAction} action
     */
    setInnerAction:function (action) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    },

    /*
     * Get inner Action.
     * @return {FiniteTimeAction}
     */
    getInnerAction:function () {
        return this._innerAction;
    }
});

/**
 * !#en Creates a Repeat action. Times is an unsigned integer between 1 and pow(2,30)
 * !#zh 重复动作，可以按一定次数重复一个动，如果想永远重复一个动作请使用 repeatForever 动作来完成。
 * @method repeat
 * @param {FiniteTimeAction} action
 * @param {Number} times
 * @return {ActionInterval}
 * @example
 * // example
 * var rep = cc.repeat(cc.sequence(jump2, jump1), 5);
 */
cc.repeat = function (action, times) {
    return new cc.Repeat(action, times);
};


/*
 * Repeats an action for ever.  <br/>
 * To repeat the an action for a limited number of times use the Repeat action. <br/>
 * @warning This action can't be Sequenceable because it is not an IntervalAction
 * @class RepeatForever
 * @extends ActionInterval
 * @param {FiniteTimeAction} action
 * @example
 * var rep = new cc.RepeatForever(cc.sequence(jump2, jump1), 5);
 */
cc.RepeatForever = cc.Class({
    name: 'cc.RepeatForever',
    extends: cc.ActionInterval,

    ctor:function (action) {
        this._innerAction = null;
		action && this.initWithAction(action);
    },

    /*
     * @param {ActionInterval} action
     * @return {Boolean}
     */
    initWithAction:function (action) {
        if (!action) {
            cc.errorID(1026);
            return false;
        }

        this._innerAction = action;
        return true;
    },

    clone:function () {
        var action = new cc.RepeatForever();
        this._cloneDecoration(action);
        action.initWithAction(this._innerAction.clone());
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._innerAction.startWithTarget(target);
    },

    step:function (dt) {
        var locInnerAction = this._innerAction;
        locInnerAction.step(dt);
        if (locInnerAction.isDone()) {
            //var diff = locInnerAction.getElapsed() - locInnerAction._duration;
            locInnerAction.startWithTarget(this.target);
            // to prevent jerk. issue #390 ,1247
            //this._innerAction.step(0);
            //this._innerAction.step(diff);
            locInnerAction.step(locInnerAction.getElapsed() - locInnerAction._duration);
        }
    },

    isDone:function () {
        return false;
    },

    reverse:function () {
        var action = new cc.RepeatForever(this._innerAction.reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    /*
     * Set inner action.
     * @param {ActionInterval} action
     */
    setInnerAction:function (action) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    },

    /*
     * Get inner action.
     * @return {ActionInterval}
     */
    getInnerAction:function () {
        return this._innerAction;
    }
});

/**
 * !#en Create a acton which repeat forever, as it runs forever, it can't be added into cc.sequence and cc.spawn.
 * !#zh 永远地重复一个动作，有限次数内重复一个动作请使用 repeat 动作，由于这个动作不会停止，所以不能被添加到 cc.sequence 或 cc.spawn 中。
 * @method repeatForever
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 * @example
 * // example
 * var repeat = cc.repeatForever(cc.rotateBy(1.0, 360));
 */
cc.repeatForever = function (action) {
    return new cc.RepeatForever(action);
};


/* 
 * Spawn a new action immediately
 * @class Spawn
 * @extends ActionInterval
 */
cc.Spawn = cc.Class({
    name: 'cc.Spawn',
    extends: cc.ActionInterval,

    ctor:function (tempArray) {
        this._one = null;
        this._two = null;

		var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
        if (paramArray.length === 1) {
            cc.errorID(1020);
            return;
        }
		var last = paramArray.length - 1;
		if ((last >= 0) && (paramArray[last] == null))
			cc.logID(1015);

        if (last >= 0) {
            var prev = paramArray[0], action1;
            for (var i = 1; i < last; i++) {
                if (paramArray[i]) {
                    action1 = prev;
                    prev = cc.Spawn._actionOneTwo(action1, paramArray[i]);
                }
            }
            this.initWithTwoActions(prev, paramArray[last]);
        }
    },

    /* initializes the Spawn action with the 2 actions to spawn
     * @param {FiniteTimeAction} action1
     * @param {FiniteTimeAction} action2
     * @return {Boolean}
     */
    initWithTwoActions:function (action1, action2) {
        if (!action1 || !action2) {
            cc.errorID(1027);
            return false;
        }

        var ret = false;

        var d1 = action1._duration;
        var d2 = action2._duration;

        if (this.initWithDuration(Math.max(d1, d2))) {
            this._one = action1;
            this._two = action2;

            if (d1 > d2) {
                this._two = cc.Sequence._actionOneTwo(action2, cc.delayTime(d1 - d2));
            } else if (d1 < d2) {
                this._one = cc.Sequence._actionOneTwo(action1, cc.delayTime(d2 - d1));
            }

            ret = true;
        }
        return ret;
    },

    clone:function () {
        var action = new cc.Spawn();
        this._cloneDecoration(action);
        action.initWithTwoActions(this._one.clone(), this._two.clone());
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._one.startWithTarget(target);
        this._two.startWithTarget(target);
    },

    stop:function () {
        this._one.stop();
        this._two.stop();
        cc.Action.prototype.stop.call(this);
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this._one)
            this._one.update(dt);
        if (this._two)
            this._two.update(dt);
    },

    reverse:function () {
        var action = cc.Spawn._actionOneTwo(this._one.reverse(), this._two.reverse());
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

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
cc.spawn = function (/*Multiple Arguments*/tempArray) {
    var paramArray = (tempArray instanceof Array) ? tempArray : arguments;
    if (paramArray.length === 1) {
        cc.errorID(1020);
        return null;
    }
    if ((paramArray.length > 0) && (paramArray[paramArray.length - 1] == null))
        cc.logID(1015);

    var prev = paramArray[0];
    for (var i = 1; i < paramArray.length; i++) {
        if (paramArray[i] != null)
            prev = cc.Spawn._actionOneTwo(prev, paramArray[i]);
    }
    return prev;
};

cc.Spawn._actionOneTwo = function (action1, action2) {
    var pSpawn = new cc.Spawn();
    pSpawn.initWithTwoActions(action1, action2);
    return pSpawn;
};


/*
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * @class RotateTo
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @example
 * var rotateTo = new cc.RotateTo(2, 61.0);
 */
cc.RotateTo = cc.Class({
    name: 'cc.RotateTo',
    extends: cc.ActionInterval,

    ctor:function (duration, dstAngle) {
        this._startAngle = 0;
        this._dstAngle = 0;
        this._angle = 0;
        dstAngle !== undefined && this.initWithDuration(duration, dstAngle);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number} dstAngle
     * @return {Boolean}
     */
    initWithDuration:function (duration, dstAngle) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._dstAngle = dstAngle;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.RotateTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._dstAngle);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        let startAngle = target.angle % 360;

        let angle = cc.macro.ROTATE_ACTION_CCW ? (this._dstAngle - startAngle) : (this._dstAngle + startAngle);
        if (angle > 180) angle -= 360;
        if (angle < -180) angle += 360;

        this._startAngle = startAngle;
        this._angle = cc.macro.ROTATE_ACTION_CCW ? angle : -angle;
    },

    reverse:function () {
        cc.logID(1016);
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            this.target.angle = this._startAngle + this._angle * dt;
        }
    }
});

/**
 * !#en
 * Rotates a Node object to a certain angle by modifying its angle property. <br/>
 * The direction will be decided by the shortest angle.
 * !#zh 旋转到目标角度，通过逐帧修改它的 angle 属性，旋转方向将由最短的角度决定。
 * @method rotateTo
 * @param {Number} duration duration in seconds
 * @param {Number} dstAngle dstAngle in degrees.
 * @return {ActionInterval}
 * @example
 * // example
 * var rotateTo = cc.rotateTo(2, 61.0);
 */
cc.rotateTo = function (duration, dstAngle) {
    return new cc.RotateTo(duration, dstAngle);
};


/*
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * @class RotateBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @example
 * var actionBy = new cc.RotateBy(2, 360);
 */
cc.RotateBy = cc.Class({
    name: 'cc.RotateBy',
    extends: cc.ActionInterval,

    ctor: function (duration, deltaAngle) {
        deltaAngle *= cc.macro.ROTATE_ACTION_CCW ? 1 : -1;

        this._deltaAngle = 0;
        this._startAngle = 0;
        deltaAngle !== undefined && this.initWithDuration(duration, deltaAngle);
    },

    /*
     * Initializes the action.
     * @param {Number} duration duration in seconds
     * @param {Number} deltaAngle deltaAngle in degrees
     * @return {Boolean}
     */
    initWithDuration:function (duration, deltaAngle) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._deltaAngle = deltaAngle;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.RotateBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._deltaAngle);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._startAngle = target.angle;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            this.target.angle = this._startAngle + this._deltaAngle * dt;
        }
    },

    reverse:function () {
        var action = new cc.RotateBy(this._duration, -this._deltaAngle);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Rotates a Node object clockwise a number of degrees by modifying its angle property.
 * Relative to its properties to modify.
 * !#zh 旋转指定的角度。
 * @method rotateBy
 * @param {Number} duration duration in seconds
 * @param {Number} deltaAngle deltaAngle in degrees
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.rotateBy(2, 360);
 */
cc.rotateBy = function (duration, deltaAngle) {
    return new cc.RotateBy(duration, deltaAngle);
};


/*
 * <p>
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * </p>
 * @class MoveBy
 * @extends ActionInterval
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */
cc.MoveBy = cc.Class({
    name: 'cc.MoveBy',
    extends: cc.ActionInterval,

    ctor:function (duration, deltaPos, deltaY) {
        this._positionDelta = cc.v2(0, 0);
        this._startPosition = cc.v2(0, 0);
        this._previousPosition = cc.v2(0, 0);

        deltaPos !== undefined && cc.MoveBy.prototype.initWithDuration.call(this, duration, deltaPos, deltaY);	
    },

    /*
     * Initializes the action.
     * @param {Number} duration duration in seconds
     * @param {Vec2} position
     * @param {Number} [y]
     * @return {Boolean}
     */
    initWithDuration:function (duration, position, y) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
	        if(position.x !== undefined) {
		        y = position.y;
		        position = position.x;
	        }

            this._positionDelta.x = position;
            this._positionDelta.y = y;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.MoveBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._positionDelta);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        var locPosX = target.x;
        var locPosY = target.y;
        this._previousPosition.x = locPosX;
        this._previousPosition.y = locPosY;
        this._startPosition.x = locPosX;
        this._startPosition.y = locPosY;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            var x = this._positionDelta.x * dt;
            var y = this._positionDelta.y * dt;
            var locStartPosition = this._startPosition;
            if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
                var targetX = this.target.x;
                var targetY = this.target.y;
                var locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x = x + locStartPosition.x;
                y = y + locStartPosition.y;
	            locPreviousPosition.x = x;
	            locPreviousPosition.y = y;
	            this.target.setPosition(x, y);
            } else {
                this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    },

    reverse:function () {
        var action = new cc.MoveBy(this._duration, cc.v2(-this._positionDelta.x, -this._positionDelta.y));
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Moves a Node object x,y pixels by modifying its position property.                                  <br/>
 * x and y are relative to the position of the object.                                                     <br/>
 * Several MoveBy actions can be concurrently called, and the resulting                                  <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动指定的距离。
 * @method moveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} deltaPos
 * @param {Number} [deltaY]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.moveBy(2, cc.v2(windowSize.width - 40, windowSize.height - 40));
 */
cc.moveBy = function (duration, deltaPos, deltaY) {
    return new cc.MoveBy(duration, deltaPos, deltaY);
};


/*
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * @class MoveTo
 * @extends MoveBy
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @example
 * var actionBy = new cc.MoveTo(2, cc.v2(80, 80));
 */
cc.MoveTo = cc.Class({
    name: 'cc.MoveTo',
    extends: cc.MoveBy,

    ctor:function (duration, position, y) {
        this._endPosition = cc.v2(0, 0);
		position !== undefined && this.initWithDuration(duration, position, y);
    },

    /*
     * Initializes the action.
     * @param {Number} duration  duration in seconds
     * @param {Vec2} position
     * @param {Number} [y]
     * @return {Boolean}
     */
    initWithDuration:function (duration, position, y) {
        if (cc.MoveBy.prototype.initWithDuration.call(this, duration, position, y)) {
	        if(position.x !== undefined) {
		        y = position.y;
		        position = position.x;
	        }

            this._endPosition.x = position;
            this._endPosition.y = y;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.MoveTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endPosition);
        return action;
    },

    startWithTarget:function (target) {
        cc.MoveBy.prototype.startWithTarget.call(this, target);
        this._positionDelta.x = this._endPosition.x - target.x;
        this._positionDelta.y = this._endPosition.y - target.y;
    }
});

/**
 * !#en
 * Moves a Node object to the position x,y. x and y are absolute coordinates by modifying its position property. <br/>
 * Several MoveTo actions can be concurrently called, and the resulting                                            <br/>
 * movement will be the sum of individual movements.
 * !#zh 移动到目标位置。
 * @method moveTo
 * @param {Number} duration duration in seconds
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.moveTo(2, cc.v2(80, 80));
 */
cc.moveTo = function (duration, position, y) {
    return new cc.MoveTo(duration, position, y);
};

/*
 * Skews a Node object to given angles by modifying its skewX and skewY properties
 * @class SkewTo
 * @extends ActionInterval
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @example
 * var actionTo = new cc.SkewTo(2, 37.2, -37.2);
 */
cc.SkewTo = cc.Class({
    name: 'cc.SkewTo',
    extends: cc.ActionInterval,

    ctor: function (t, sx, sy) {
        this._skewX = 0;
        this._skewY = 0;
        this._startSkewX = 0;
        this._startSkewY = 0;
        this._endSkewX = 0;
        this._endSkewY = 0;
        this._deltaX = 0;
        this._deltaY = 0;
        sy !== undefined && cc.SkewTo.prototype.initWithDuration.call(this, t, sx, sy);
    },

    /*
     * Initializes the action.
     * @param {Number} t time in seconds
     * @param {Number} sx
     * @param {Number} sy
     * @return {Boolean}
     */
    initWithDuration:function (t, sx, sy) {
        var ret = false;
        if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
            this._endSkewX = sx;
            this._endSkewY = sy;
            ret = true;
        }
        return ret;
    },

    clone:function () {
        var action = new cc.SkewTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endSkewX, this._endSkewY);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        this._startSkewX = target.skewX % 180;
        this._deltaX = this._endSkewX - this._startSkewX;
        if (this._deltaX > 180)
            this._deltaX -= 360;
        if (this._deltaX < -180)
            this._deltaX += 360;

        this._startSkewY = target.skewY % 360;
        this._deltaY = this._endSkewY - this._startSkewY;
        if (this._deltaY > 180)
            this._deltaY -= 360;
        if (this._deltaY < -180)
            this._deltaY += 360;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        this.target.skewX = this._startSkewX + this._deltaX * dt;
        this.target.skewY = this._startSkewY + this._deltaY * dt;
    }
});

/**
 * !#en
 * Create a action which skews a Node object to given angles by modifying its skewX and skewY properties.
 * Changes to the specified value.
 * !#zh 偏斜到目标角度。
 * @method skewTo
 * @param {Number} t time in seconds
 * @param {Number} sx
 * @param {Number} sy
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.skewTo(2, 37.2, -37.2);
 */
cc.skewTo = function (t, sx, sy) {
    return new cc.SkewTo(t, sx, sy);
};

/*
 * Skews a Node object by skewX and skewY degrees.
 * Relative to its property modification.
 * @class SkewBy
 * @extends SkewTo
 * @param {Number} t time in seconds
 * @param {Number} sx  skew in degrees for X axis
 * @param {Number} sy  skew in degrees for Y axis
 */
cc.SkewBy = cc.Class({
    name: 'cc.SkewBy',
    extends: cc.SkewTo,

	ctor: function(t, sx, sy) {
		sy !== undefined && this.initWithDuration(t, sx, sy);
	},

    /*
     * Initializes the action.
     * @param {Number} t time in seconds
     * @param {Number} deltaSkewX  skew in degrees for X axis
     * @param {Number} deltaSkewY  skew in degrees for Y axis
     * @return {Boolean}
     */
    initWithDuration:function (t, deltaSkewX, deltaSkewY) {
        var ret = false;
        if (cc.SkewTo.prototype.initWithDuration.call(this, t, deltaSkewX, deltaSkewY)) {
            this._skewX = deltaSkewX;
            this._skewY = deltaSkewY;
            ret = true;
        }
        return ret;
    },

    clone:function () {
        var action = new cc.SkewBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._skewX, this._skewY);
        return action;
    },

    startWithTarget:function (target) {
        cc.SkewTo.prototype.startWithTarget.call(this, target);
        this._deltaX = this._skewX;
        this._deltaY = this._skewY;
        this._endSkewX = this._startSkewX + this._deltaX;
        this._endSkewY = this._startSkewY + this._deltaY;
    },

    reverse:function () {
        var action = new cc.SkewBy(this._duration, -this._skewX, -this._skewY);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Skews a Node object by skewX and skewY degrees. <br />
 * Relative to its property modification.
 * !#zh 偏斜指定的角度。
 * @method skewBy
 * @param {Number} t time in seconds
 * @param {Number} sx sx skew in degrees for X axis
 * @param {Number} sy sy skew in degrees for Y axis
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.skewBy(2, 0, -90);
 */
cc.skewBy = function (t, sx, sy) {
    return new cc.SkewBy(t, sx, sy);
};


/*
 * Moves a Node object simulating a parabolic jump movement by modifying its position property.
 * Relative to its movement.
 * @class JumpBy
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} height
 * @param {Number} jumps
 * @example
 * var actionBy = new cc.JumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = new cc.JumpBy(2, 300, 0, 50, 4);
 */
cc.JumpBy = cc.Class({
    name: 'cc.JumpBy',
    extends: cc.ActionInterval,

    ctor:function (duration, position, y, height, jumps) {
        this._startPosition = cc.v2(0, 0);
        this._previousPosition = cc.v2(0, 0);
        this._delta = cc.v2(0, 0);
        this._height = 0;
        this._jumps = 0;

        height !== undefined && cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps);
    },
    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Vec2|Number} position
     * @param {Number} [y]
     * @param {Number} height
     * @param {Number} jumps
     * @return {Boolean}
     * @example
     * actionBy.initWithDuration(2, cc.v2(300, 0), 50, 4);
     * actionBy.initWithDuration(2, 300, 0, 50, 4);
     */
    initWithDuration:function (duration, position, y, height, jumps) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
	        if (jumps === undefined) {
		        jumps = height;
		        height = y;
		        y = position.y;
		        position = position.x;
	        }
            this._delta.x = position;
            this._delta.y = y;
            this._height = height;
            this._jumps = jumps;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.JumpBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._delta, this._height, this._jumps);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        var locPosX = target.x;
        var locPosY = target.y;
        this._previousPosition.x = locPosX;
        this._previousPosition.y = locPosY;
        this._startPosition.x = locPosX;
        this._startPosition.y = locPosY;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            var frac = dt * this._jumps % 1.0;
            var y = this._height * 4 * frac * (1 - frac);
            y += this._delta.y * dt;

            var x = this._delta.x * dt;
            var locStartPosition = this._startPosition;
            if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
                var targetX = this.target.x;
                var targetY = this.target.y;
                var locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x = x + locStartPosition.x;
                y = y + locStartPosition.y;
	            locPreviousPosition.x = x;
	            locPreviousPosition.y = y;
	            this.target.setPosition(x, y);
            } else {
                this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    },

    reverse:function () {
        var action = new cc.JumpBy(this._duration, cc.v2(-this._delta.x, -this._delta.y), this._height, this._jumps);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Moves a Node object simulating a parabolic jump movement by modifying it's position property.
 * Relative to its movement.
 * !#zh 用跳跃的方式移动指定的距离。
 * @method jumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionBy = cc.jumpBy(2, cc.v2(300, 0), 50, 4);
 * var actionBy = cc.jumpBy(2, 300, 0, 50, 4);
 */
cc.jumpBy = function (duration, position, y, height, jumps) {
    return new cc.JumpBy(duration, position, y, height, jumps);
};

/*
 * Moves a Node object to a parabolic position simulating a jump movement by modifying it's position property. <br />
 * Jump to the specified location.
 * @class JumpTo
 * @extends JumpBy
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @example
 * var actionTo = new cc.JumpTo(2, cc.v2(300, 0), 50, 4);
 * var actionTo = new cc.JumpTo(2, 300, 0, 50, 4);
 */
cc.JumpTo = cc.Class({
    name: 'cc.JumpTo',
    extends: cc.JumpBy,

    ctor:function (duration, position, y, height, jumps) {
        this._endPosition = cc.v2(0, 0);
        height !== undefined && this.initWithDuration(duration, position, y, height, jumps);
    },
    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Vec2|Number} position
     * @param {Number} [y]
     * @param {Number} height
     * @param {Number} jumps
     * @return {Boolean}
     * @example
     * actionTo.initWithDuration(2, cc.v2(300, 0), 50, 4);
     * actionTo.initWithDuration(2, 300, 0, 50, 4);
     */
    initWithDuration:function (duration, position, y, height, jumps) {
        if (cc.JumpBy.prototype.initWithDuration.call(this, duration, position, y, height, jumps)) {
            if (jumps === undefined) {
                y = position.y;
                position = position.x;
            }
            this._endPosition.x = position;
            this._endPosition.y = y;
            return true;
        }
        return false;
    },

    startWithTarget:function (target) {
        cc.JumpBy.prototype.startWithTarget.call(this, target);
        this._delta.x = this._endPosition.x - this._startPosition.x;
        this._delta.y = this._endPosition.y - this._startPosition.y;
    },

    clone:function () {
        var action = new cc.JumpTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endPosition, this._height, this._jumps);
        return action;
    }
});

/**
 * !#en
 * Moves a Node object to a parabolic position simulating a jump movement by modifying its position property. <br />
 * Jump to the specified location.
 * !#zh 用跳跃的方式移动到目标位置。
 * @method jumpTo
 * @param {Number} duration
 * @param {Vec2|Number} position
 * @param {Number} [y]
 * @param {Number} [height]
 * @param {Number} [jumps]
 * @return {ActionInterval}
 * @example
 * // example
 * var actionTo = cc.jumpTo(2, cc.v2(300, 300), 50, 4);
 * var actionTo = cc.jumpTo(2, 300, 300, 50, 4);
 */
cc.jumpTo = function (duration, position, y, height, jumps) {
    return new cc.JumpTo(duration, position, y, height, jumps);
};

/* An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * @class BezierBy
 * @extends ActionInterval
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = new cc.BezierBy(3, bezier);
 */
function bezierAt (a, b, c, d, t) {
    return (Math.pow(1 - t, 3) * a +
        3 * t * (Math.pow(1 - t, 2)) * b +
        3 * Math.pow(t, 2) * (1 - t) * c +
        Math.pow(t, 3) * d );
};
cc.BezierBy = cc.Class({
    name: 'cc.BezierBy',
    extends: cc.ActionInterval,

    ctor:function (t, c) {
        this._config = [];
        this._startPosition = cc.v2(0, 0);
        this._previousPosition = cc.v2(0, 0);
        c && cc.BezierBy.prototype.initWithDuration.call(this, t, c);
    },

    /*
     * Initializes the action.
     * @param {Number} t - time in seconds
     * @param {Vec2[]} c - Array of points
     * @return {Boolean}
     */
    initWithDuration:function (t, c) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
            this._config = c;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.BezierBy();
        this._cloneDecoration(action);
        var newConfigs = [];
        for (var i = 0; i < this._config.length; i++) {
            var selConf = this._config[i];
            newConfigs.push(cc.v2(selConf.x, selConf.y));
        }
        action.initWithDuration(this._duration, newConfigs);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        var locPosX = target.x;
        var locPosY = target.y;
        this._previousPosition.x = locPosX;
        this._previousPosition.y = locPosY;
        this._startPosition.x = locPosX;
        this._startPosition.y = locPosY;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            var locConfig = this._config;
            var xa = 0;
            var xb = locConfig[0].x;
            var xc = locConfig[1].x;
            var xd = locConfig[2].x;

            var ya = 0;
            var yb = locConfig[0].y;
            var yc = locConfig[1].y;
            var yd = locConfig[2].y;

            var x = bezierAt(xa, xb, xc, xd, dt);
            var y = bezierAt(ya, yb, yc, yd, dt);

            var locStartPosition = this._startPosition;
            if (cc.macro.ENABLE_STACKABLE_ACTIONS) {
                var targetX = this.target.x;
                var targetY = this.target.y;
                var locPreviousPosition = this._previousPosition;

                locStartPosition.x = locStartPosition.x + targetX - locPreviousPosition.x;
                locStartPosition.y = locStartPosition.y + targetY - locPreviousPosition.y;
                x = x + locStartPosition.x;
                y = y + locStartPosition.y;
	            locPreviousPosition.x = x;
	            locPreviousPosition.y = y;
	            this.target.setPosition(x, y);
            } else {
                this.target.setPosition(locStartPosition.x + x, locStartPosition.y + y);
            }
        }
    },

    reverse:function () {
        var locConfig = this._config;
        var x0 = locConfig[0].x, y0 = locConfig[0].y;
        var x1 = locConfig[1].x, y1 = locConfig[1].y;
        var x2 = locConfig[2].x, y2 = locConfig[2].y;
        var r = [
            cc.v2(x1 - x2, y1 - y2),
            cc.v2(x0 - x2, y0 - y2),
            cc.v2(-x2, -y2) ];
        var action = new cc.BezierBy(this._duration, r);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * An action that moves the target with a cubic Bezier curve by a certain distance.
 * Relative to its movement.
 * !#zh 按贝赛尔曲线轨迹移动指定的距离。
 * @method bezierBy
 * @param {Number} t - time in seconds
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierForward = cc.bezierBy(3, bezier);
 */
cc.bezierBy = function (t, c) {
    return new cc.BezierBy(t, c);
};


/* An action that moves the target with a cubic Bezier curve to a destination point.
 * @class BezierTo
 * @extends BezierBy
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = new cc.BezierTo(2, bezier);
 */
cc.BezierTo = cc.Class({
    name: 'cc.BezierTo',
    extends: cc.BezierBy,

    ctor:function (t, c) {
        this._toConfig = [];
		c && this.initWithDuration(t, c);
    },

    /*
     * Initializes the action.
     * @param {Number} t time in seconds
     * @param {Vec2[]} c - Array of points
     * @return {Boolean}
     */
    initWithDuration:function (t, c) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, t)) {
            this._toConfig = c;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.BezierTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._toConfig);
        return action;
    },

    startWithTarget:function (target) {
        cc.BezierBy.prototype.startWithTarget.call(this, target);
        var locStartPos = this._startPosition;
        var locToConfig = this._toConfig;
        var locConfig = this._config;

        locConfig[0] = locToConfig[0].sub(locStartPos);
        locConfig[1] = locToConfig[1].sub(locStartPos);
        locConfig[2] = locToConfig[2].sub(locStartPos);
    }
});
/**
 * !#en An action that moves the target with a cubic Bezier curve to a destination point.
 * !#zh 按贝赛尔曲线轨迹移动到目标位置。
 * @method bezierTo
 * @param {Number} t
 * @param {Vec2[]} c - Array of points
 * @return {ActionInterval}
 * @example
 * // example
 * var bezier = [cc.v2(0, windowSize.height / 2), cc.v2(300, -windowSize.height / 2), cc.v2(300, 100)];
 * var bezierTo = cc.bezierTo(2, bezier);
 */
cc.bezierTo = function (t, c) {
    return new cc.BezierTo(t, c);
};


/* Scales a Node object to a zoom factor by modifying it's scale property.
 * @warning This action doesn't support "reverse"
 * @class ScaleTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = new cc.ScaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = new cc.ScaleTo(2, 0.5, 2);
 */
cc.ScaleTo = cc.Class({
    name: 'cc.ScaleTo',
    extends: cc.ActionInterval,

    ctor:function (duration, sx, sy) {
        this._scaleX = 1;
        this._scaleY = 1;
        this._startScaleX = 1;
        this._startScaleY = 1;
        this._endScaleX = 0;
        this._endScaleY = 0;
        this._deltaX = 0;
        this._deltaY = 0;
        sx !== undefined && cc.ScaleTo.prototype.initWithDuration.call(this, duration, sx, sy);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number} sx
     * @param {Number} [sy=]
     * @return {Boolean}
     */
    initWithDuration:function (duration, sx, sy) { //function overload here
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._endScaleX = sx;
            this._endScaleY = (sy != null) ? sy : sx;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.ScaleTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._startScaleX = target.scaleX;
        this._startScaleY = target.scaleY;
        this._deltaX = this._endScaleX - this._startScaleX;
        this._deltaY = this._endScaleY - this._startScaleY;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target) {
            this.target.scaleX = this._startScaleX + this._deltaX * dt;
	        this.target.scaleY = this._startScaleY + this._deltaY * dt;
        }
    }
});
/**
 * !#en Scales a Node object to a zoom factor by modifying it's scale property.
 * !#zh 将节点大小缩放到指定的倍数。
 * @method scaleTo
 * @param {Number} duration
 * @param {Number} sx  scale parameter in X
 * @param {Number} [sy] scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example
 * // It scales to 0.5 in both X and Y.
 * var actionTo = cc.scaleTo(2, 0.5);
 *
 * // It scales to 0.5 in x and 2 in Y
 * var actionTo = cc.scaleTo(2, 0.5, 2);
 */
cc.scaleTo = function (duration, sx, sy) { //function overload
    return new cc.ScaleTo(duration, sx, sy);
};


/* Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * @class ScaleBy
 * @extends ScaleTo
 */
cc.ScaleBy = cc.Class({
    name: 'cc.ScaleBy',
    extends: cc.ScaleTo,

    startWithTarget:function (target) {
        cc.ScaleTo.prototype.startWithTarget.call(this, target);
        this._deltaX = this._startScaleX * this._endScaleX - this._startScaleX;
        this._deltaY = this._startScaleY * this._endScaleY - this._startScaleY;
    },

    reverse:function () {
        var action = new cc.ScaleBy(this._duration, 1 / this._endScaleX, 1 / this._endScaleY);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    clone:function () {
        var action = new cc.ScaleBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._endScaleX, this._endScaleY);
        return action;
    }
});
/**
 * !#en
 * Scales a Node object a zoom factor by modifying it's scale property.
 * Relative to its changes.
 * !#zh 按指定的倍数缩放节点大小。
 * @method scaleBy
 * @param {Number} duration duration in seconds
 * @param {Number} sx sx  scale parameter in X
 * @param {Number|Null} [sy=] sy scale parameter in Y, if Null equal to sx
 * @return {ActionInterval}
 * @example
 * // example without sy, it scales by 2 both in X and Y
 * var actionBy = cc.scaleBy(2, 2);
 *
 * //example with sy, it scales by 0.25 in X and 4.5 in Y
 * var actionBy2 = cc.scaleBy(2, 0.25, 4.5);
 */
cc.scaleBy = function (duration, sx, sy) {
    return new cc.ScaleBy(duration, sx, sy);
};

/* Blinks a Node object by modifying it's visible property
 * @class Blink
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks  blinks in times
 * @example
 * var action = new cc.Blink(2, 10);
 */
cc.Blink = cc.Class({
    name: 'cc.Blink',
    extends: cc.ActionInterval,

    ctor:function (duration, blinks) {
        this._times = 0;
        this._originalState = false;
		blinks !== undefined && this.initWithDuration(duration, blinks);
    },

    /*
     * Initializes the action.
     * @param {Number} duration duration in seconds
     * @param {Number} blinks blinks in times
     * @return {Boolean}
     */
    initWithDuration:function (duration, blinks) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._times = blinks;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.Blink();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._times);
        return action;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this.target && !this.isDone()) {
            var slice = 1.0 / this._times;
            var m = dt % slice;
            this.target.opacity = (m > (slice / 2)) ? 255 : 0;
        }
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._originalState = target.opacity;
    },

    stop:function () {
        this.target.opacity = this._originalState;
        cc.ActionInterval.prototype.stop.call(this);
    },

    reverse:function () {
        var action = new cc.Blink(this._duration, this._times);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});
/**
 * !#en Blinks a Node object by modifying it's visible property.
 * !#zh 闪烁（基于透明度）。
 * @method blink
 * @param {Number} duration  duration in seconds
 * @param {Number} blinks blinks in times
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.blink(2, 10);
 */
cc.blink = function (duration, blinks) {
    return new cc.Blink(duration, blinks);
};

/* Fades an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from the current value to a custom one.
 * @warning This action doesn't support "reverse"
 * @class FadeTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @example
 * var action = new cc.FadeTo(1.0, 0);
 */
cc.FadeTo = cc.Class({
    name: 'cc.FadeTo',
    extends: cc.ActionInterval,

    ctor:function (duration, opacity) {
        this._toOpacity = 0;
        this._fromOpacity = 0;
        opacity !== undefined && cc.FadeTo.prototype.initWithDuration.call(this, duration, opacity);
    },

    /*
     * Initializes the action.
     * @param {Number} duration  duration in seconds
     * @param {Number} opacity
     * @return {Boolean}
     */
    initWithDuration:function (duration, opacity) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._toOpacity = opacity;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.FadeTo();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._toOpacity);
        return action;
    },

    update:function (time) {
        time = this._computeEaseTime(time);
        var fromOpacity = this._fromOpacity !== undefined ? this._fromOpacity : 255;
        this.target.opacity = fromOpacity + (this._toOpacity - fromOpacity) * time;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._fromOpacity = target.opacity;
    }
});

/**
 * !#en
 * Fades an object that implements the cc.RGBAProtocol protocol.
 * It modifies the opacity from the current value to a custom one.
 * !#zh 修改透明度到指定值。
 * @method fadeTo
 * @param {Number} duration
 * @param {Number} opacity 0-255, 0 is transparent
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeTo(1.0, 0);
 */
cc.fadeTo = function (duration, opacity) {
    return new cc.FadeTo(duration, opacity);
};

/* Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.<br/>
 * The "reverse" of this action is FadeOut
 * @class FadeIn
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */
cc.FadeIn = cc.Class({
    name: 'cc.FadeIn',
    extends: cc.FadeTo,

    ctor:function (duration) {
        if (duration == null)
            duration = 0;
        this._reverseAction = null;
        this.initWithDuration(duration, 255);
    },

    reverse:function () {
        var action = new cc.FadeOut();
        action.initWithDuration(this._duration, 0);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    clone:function () {
        var action = new cc.FadeIn();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._toOpacity);
        return action;
    },

    startWithTarget:function (target) {
        if(this._reverseAction)
            this._toOpacity = this._reverseAction._fromOpacity;
        cc.FadeTo.prototype.startWithTarget.call(this, target);
    }
});

/**
 * !#en Fades In an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 0 to 255.
 * !#zh 渐显效果。
 * @method fadeIn
 * @param {Number} duration duration in seconds
 * @return {ActionInterval}
 * @example
 * //example
 * var action = cc.fadeIn(1.0);
 */
cc.fadeIn = function (duration) {
    return new cc.FadeIn(duration);
};


/* Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * The "reverse" of this action is FadeIn
 * @class FadeOut
 * @extends FadeTo
 * @param {Number} duration duration in seconds
 */
cc.FadeOut = cc.Class({
    name: 'cc.FadeOut',
    extends: cc.FadeTo,

    ctor:function (duration) {
        if (duration == null)
            duration = 0;
        this._reverseAction = null;
        this.initWithDuration(duration, 0);
    },

    reverse:function () {
        var action = new cc.FadeIn();
        action._reverseAction = this;
        action.initWithDuration(this._duration, 255);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    clone:function () {
        var action = new cc.FadeOut();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._toOpacity);
        return action;
    }
});

/**
 * !#en Fades Out an object that implements the cc.RGBAProtocol protocol. It modifies the opacity from 255 to 0.
 * !#zh 渐隐效果。
 * @method fadeOut
 * @param {Number} d  duration in seconds
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.fadeOut(1.0);
 */
cc.fadeOut = function (d) {
    return new cc.FadeOut(d);
};

/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * @warning This action doesn't support "reverse"
 * @class TintTo
 * @extends ActionInterval
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @example
 * var action = new cc.TintTo(2, 255, 0, 255);
 */
cc.TintTo = cc.Class({
    name: 'cc.TintTo',
    extends: cc.ActionInterval,

    ctor:function (duration, red, green, blue) {
        this._to = cc.color(0, 0, 0);
        this._from = cc.color(0, 0, 0);

        if (red instanceof cc.Color) {
            blue = red.b;
            green = red.g;
            red = red.r;
        }

        blue !== undefined && this.initWithDuration(duration, red, green, blue);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number} red 0-255
     * @param {Number} green 0-255
     * @param {Number} blue 0-255
     * @return {Boolean}
     */
    initWithDuration:function (duration, red, green, blue) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._to = cc.color(red, green, blue);
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.TintTo();
        this._cloneDecoration(action);
        var locTo = this._to;
        action.initWithDuration(this._duration, locTo.r, locTo.g, locTo.b);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        this._from = this.target.color;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        var locFrom = this._from, locTo = this._to;
        if (locFrom) {
            this.target.color = cc.color(
                    locFrom.r + (locTo.r - locFrom.r) * dt,
                    locFrom.g + (locTo.g - locFrom.g) * dt,
                    locFrom.b + (locTo.b - locFrom.b) * dt);
        }
    }
});

/**
 * !#en Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * !#zh 修改颜色到指定值。
 * @method tintTo
 * @param {Number} duration
 * @param {Number} red 0-255
 * @param {Number} green  0-255
 * @param {Number} blue 0-255
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintTo(2, 255, 0, 255);
 */
cc.tintTo = function (duration, red, green, blue) {
    return new cc.TintTo(duration, red, green, blue);
};


/* Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * @class TintBy
 * @extends ActionInterval
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @example
 * var action = new cc.TintBy(2, -127, -255, -127);
 */
cc.TintBy = cc.Class({
    name: 'cc.TintBy',
    extends: cc.ActionInterval,

    ctor:function (duration, deltaRed, deltaGreen, deltaBlue) {
        this._deltaR = 0;
        this._deltaG = 0;
        this._deltaB = 0;
        this._fromR = 0;
        this._fromG = 0;
        this._fromB = 0;
		deltaBlue !== undefined && this.initWithDuration(duration, deltaRed, deltaGreen, deltaBlue);
    },

    /*
     * Initializes the action.
     * @param {Number} duration
     * @param {Number} deltaRed 0-255
     * @param {Number} deltaGreen 0-255
     * @param {Number} deltaBlue 0-255
     * @return {Boolean}
     */
    initWithDuration:function (duration, deltaRed, deltaGreen, deltaBlue) {
        if (cc.ActionInterval.prototype.initWithDuration.call(this, duration)) {
            this._deltaR = deltaRed;
            this._deltaG = deltaGreen;
            this._deltaB = deltaBlue;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.TintBy();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration, this._deltaR, this._deltaG, this._deltaB);
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);

        var color = target.color;
        this._fromR = color.r;
        this._fromG = color.g;
        this._fromB = color.b;
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);

        this.target.color = cc.color(this._fromR + this._deltaR * dt,
                                    this._fromG + this._deltaG * dt,
                                    this._fromB + this._deltaB * dt);
    },

    reverse:function () {
        var action = new cc.TintBy(this._duration, -this._deltaR, -this._deltaG, -this._deltaB);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    }
});

/**
 * !#en
 * Tints a Node that implements the cc.NodeRGB protocol from current tint to a custom one.
 * Relative to their own color change.
 * !#zh 按照指定的增量修改颜色。
 * @method tintBy
 * @param {Number} duration  duration in seconds
 * @param {Number} deltaRed
 * @param {Number} deltaGreen
 * @param {Number} deltaBlue
 * @return {ActionInterval}
 * @example
 * // example
 * var action = cc.tintBy(2, -127, -255, -127);
 */
cc.tintBy = function (duration, deltaRed, deltaGreen, deltaBlue) {
    return new cc.TintBy(duration, deltaRed, deltaGreen, deltaBlue);
};

/* Delays the action a certain amount of seconds
 * @class DelayTime
 * @extends ActionInterval
 */
cc.DelayTime = cc.Class({
    name: 'cc.DelayTime',
    extends: cc.ActionInterval,

    update:function (dt) {},

    reverse:function () {
        var action = new cc.DelayTime(this._duration);
        this._cloneDecoration(action);
        this._reverseEaseList(action);
        return action;
    },

    clone:function () {
        var action = new cc.DelayTime();
        this._cloneDecoration(action);
        action.initWithDuration(this._duration);
        return action;
    }
});

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
cc.delayTime = function (d) {
    return new cc.DelayTime(d);
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
cc.ReverseTime = cc.Class({
    name: 'cc.ReverseTime',
    extends: cc.ActionInterval,

    ctor:function (action) {
        this._other = null;
		action && this.initWithAction(action);
    },

    /*
     * @param {FiniteTimeAction} action
     * @return {Boolean}
     */
    initWithAction:function (action) {
        if (!action) {
            cc.errorID(1028);
            return false;
        }
        if (action === this._other) {
            cc.errorID(1029);
            return false;
        }

        if (cc.ActionInterval.prototype.initWithDuration.call(this, action._duration)) {
            // Don't leak if action is reused
            this._other = action;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.ReverseTime();
        this._cloneDecoration(action);
        action.initWithAction(this._other.clone());
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._other.startWithTarget(target);
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        if (this._other)
            this._other.update(1 - dt);
    },

    reverse:function () {
        return this._other.clone();
    },

    stop:function () {
        this._other.stop();
        cc.Action.prototype.stop.call(this);
    }
});

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
cc.reverseTime = function (action) {
    return new cc.ReverseTime(action);
};

/*
 * <p>
 * Overrides the target of an action so that it always runs on the target<br/>
 * specified at action creation rather than the one specified by runAction.
 * </p>
 * @class TargetedAction
 * @extends ActionInterval
 * @param {Node} target
 * @param {FiniteTimeAction} action
 */
cc.TargetedAction = cc.Class({
    name: 'cc.TargetedAction',
    extends: cc.ActionInterval,

    ctor: function (target, action) {
        this._action = null;
        this._forcedTarget = null;
		action && this.initWithTarget(target, action);
    },

    /*
     * Init an action with the specified action and forced target
     * @param {Node} target
     * @param {FiniteTimeAction} action
     * @return {Boolean}
     */
    initWithTarget:function (target, action) {
        if (this.initWithDuration(action._duration)) {
            this._forcedTarget = target;
            this._action = action;
            return true;
        }
        return false;
    },

    clone:function () {
        var action = new cc.TargetedAction();
        this._cloneDecoration(action);
        action.initWithTarget(this._forcedTarget, this._action.clone());
        return action;
    },

    startWithTarget:function (target) {
        cc.ActionInterval.prototype.startWithTarget.call(this, target);
        this._action.startWithTarget(this._forcedTarget);
    },

    stop:function () {
        this._action.stop();
    },

    update:function (dt) {
        dt = this._computeEaseTime(dt);
        this._action.update(dt);
    },

    /*
     * return the target that the action will be forced to run with
     * @return {Node}
     */
    getForcedTarget:function () {
        return this._forcedTarget;
    },

    /*
     * set the target that the action will be forced to run with
     * @param {Node} forcedTarget
     */
    setForcedTarget:function (forcedTarget) {
        if (this._forcedTarget !== forcedTarget)
            this._forcedTarget = forcedTarget;
    }
});

/**
 * !#en Create an action with the specified action and forced target.
 * !#zh 用已有动作和一个新的目标节点创建动作。
 * @method targetedAction
 * @param {Node} target
 * @param {FiniteTimeAction} action
 * @return {ActionInterval}
 */
cc.targetedAction = function (target, action) {
    return new cc.TargetedAction(target, action);
};
