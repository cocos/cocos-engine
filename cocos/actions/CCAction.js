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

require('../core/platform/CCClass');
const misc = require('../core/utils/misc');

/**
 * @module cc
 */

/**
 * !#en Base class cc.Action for action classes.
 * !#zh Action 类是所有动作类型的基类。
 * @class Action
 */
cc.Action = cc.Class({
    name: 'cc.Action',

    //**************Public Functions***********

    ctor:function () {
        this.originalTarget = null;
        this.target = null;
        this.tag = cc.Action.TAG_INVALID;
    },

    /**
     * !#en
     * to copy object with deep copy.
     * returns a clone of action.
     * !#zh 返回一个克隆的动作。
     * @method clone
     * @return {Action}
     */
    clone:function () {
        var action = new cc.Action();
        action.originalTarget = null;
        action.target = null;
        action.tag = this.tag;
        return action;
    },

    /**
     * !#en
     * return true if the action has finished.
     * !#zh 如果动作已完成就返回 true。
     * @method isDone
     * @return {Boolean}
     */
    isDone:function () {
        return true;
    },

    // called before the action start. It will also set the target.
    startWithTarget:function (target) {
        this.originalTarget = target;
        this.target = target;
    },

    // called after the action has finished. It will set the 'target' to nil.
    stop:function () {
        this.target = null;
    },

    // called every frame with it's delta time. <br />
    step:function (dt) {
        cc.logID(1006);
    },

    // Called once per frame. Time is the number of seconds of a frame interval.
    update:function (dt) {
        cc.logID(1007);
    },

    /**
     * !#en get the target.
     * !#zh 获取当前目标节点。
     * @method getTarget
     * @return {Node}
     */
    getTarget:function () {
        return this.target;
    },

    /**
     * !#en The action will modify the target properties.
     * !#zh 设置目标节点。
     * @method setTarget
     * @param {Node} target
     */
    setTarget:function (target) {
        this.target = target;
    },

    /**
     * !#en get the original target.
     * !#zh 获取原始目标节点。
     * @method getOriginalTarget
     * @return {Node}
     */
    getOriginalTarget:function () {
        return this.originalTarget;
    },

    // Set the original target, since target can be nil.
    // Is the target that were used to run the action.
    // Unless you are doing something complex, like cc.ActionManager, you should NOT call this method.
    setOriginalTarget:function (originalTarget) {
        this.originalTarget = originalTarget;
    },

    /**
     * !#en get tag number.
     * !#zh 获取用于识别动作的标签。
     * @method getTag
     * @return {Number}
     */
    getTag:function () {
        return this.tag;
    },

    /**
     * !#en set tag number.
     * !#zh 设置标签，用于识别动作。
     * @method setTag
     * @param {Number} tag
     */
    setTag:function (tag) {
        this.tag = tag;
    },

    // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
    // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
    // This is a hack, and should be removed once JSB fixes the retain/release bug.
    retain:function () {
    },

    // Currently JavaScript Bindigns (JSB), in some cases, needs to use retain and release. This is a bug in JSB,
    // and the ugly workaround is to use retain/release. So, these 2 methods were added to be compatible with JSB.
    // This is a hack, and should be removed once JSB fixes the retain/release bug.
    release:function () {
    }
});

/**
 * !#en Default Action tag.
 * !#zh 默认动作标签。
 * @property TAG_INVALID
 * @constant
 * @static
 * @type {Number}
 * @default -1
 */
cc.Action.TAG_INVALID = -1;


/**
 * !#en
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * !#zh 有限时间动作，这种动作拥有时长 duration 属性。
 * @class FiniteTimeAction
 * @extends Action
 */
cc.FiniteTimeAction = cc.Class({
    name: 'cc.FiniteTimeAction',
    extends: cc.Action,

    ctor:function () {
        //! duration in seconds
        this._duration = 0;
    },

    /**
     * !#en get duration of the action. (seconds).
     * !#zh 获取动作以秒为单位的持续时间。
     * @method getDuration
     * @return {Number}
     */
    getDuration:function () {
        return this._duration * (this._timesForRepeat || 1);
    },

    /**
     * !#en set duration of the action. (seconds).
     * !#zh 设置动作以秒为单位的持续时间。
     * @method setDuration
     * @param {Number} duration
     */
    setDuration:function (duration) {
        this._duration = duration;
    },

    /**
     * !#en
     * Returns a reversed action. <br />
     * For example: <br />
     * - The action will be x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * - Will be rewritten
     * !#zh 返回一个新的动作，执行与原动作完全相反的动作。
     * @method reverse
     * @return {Null}
     */
    reverse:function () {
        cc.logID(1008);
        return null;
    },

    /**
     * !#en
     * to copy object with deep copy.
     * returns a clone of action.
     * !#zh 返回一个克隆的动作。
     * @method clone
     * @return {FiniteTimeAction}
     */
    clone:function () {
        return new cc.FiniteTimeAction();
    }
});

/**
 * @module cc
 */

/*
 * Changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 *
 * @warning This action can't be Sequenceable because it is not an cc.IntervalAction
 * @class Speed
 * @extends Action
 *
 * @param {ActionInterval} action
 * @param {Number} speed
 */
cc.Speed = cc.Class({
    name: 'cc.Speed',
    extends: cc.Action,

    ctor:function (action, speed) {
        this._speed = 0;
        this._innerAction = null;

		action && this.initWithAction(action, speed);
    },

    /*
     * Gets the current running speed. <br />
     * Will get a percentage number, compared to the original speed.
     *
     * @method getSpeed
     * @return {Number}
     */
    getSpeed:function () {
        return this._speed;
    },

    /*
     * alter the speed of the inner function in runtime.
     * @method setSpeed
     * @param {Number} speed
     */
    setSpeed:function (speed) {
        this._speed = speed;
    },

    /*
     * initializes the action.
     * @method initWithAction
     * @param {ActionInterval} action
     * @param {Number} speed
     * @return {Boolean}
     */
    initWithAction:function (action, speed) {
        if (!action) {
            cc.errorID(1021);
            return false;
        }

        this._innerAction = action;
        this._speed = speed;
        return true;
    },

    clone:function () {
        var action = new cc.Speed();
        action.initWithAction(this._innerAction.clone(), this._speed);
        return action;
    },

    startWithTarget:function (target) {
        cc.Action.prototype.startWithTarget.call(this, target);
        this._innerAction.startWithTarget(target);
    },

    stop:function () {
        this._innerAction.stop();
        cc.Action.prototype.stop.call(this);
    },

    step:function (dt) {
        this._innerAction.step(dt * this._speed);
    },

    isDone:function () {
        return this._innerAction.isDone();
    },

    reverse:function () {
        return new cc.Speed(this._innerAction.reverse(), this._speed);
    },

    /*
     * Set inner Action.
     * @method setInnerAction
     * @param {ActionInterval} action
     */
    setInnerAction:function (action) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    },

    /*
     * Get inner Action.
     * @method getInnerAction
     * @return {ActionInterval}
     */
    getInnerAction:function () {
        return this._innerAction;
    }
});

/**
 * @module cc
 */

/**
 * !#en
 * Creates the speed action which changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 * !#zh 修改目标动作的速率。
 * @warning This action can't be Sequenceable because it is not an cc.IntervalAction
 *
 * @method speed
 * @param {ActionInterval} action
 * @param {Number} speed
 * @return {Action}
 * @example
 * // change the target action speed;
 * var action = cc.scaleTo(0.2, 1, 0.6);
 * var newAction = cc.speed(action, 0.5);
 */
cc.speed = function (action, speed) {
    return new cc.Speed(action, speed);
};

/*
 * cc.Follow is a follow action which makes its target follows another node.
 *
 * @example
 * //example
 * //Instead of using cc.Camera as a "follower", use this action instead.
 * layer.runAction(cc.follow(hero));
 *
 * @property {Number}  leftBoundary - world leftBoundary.
 * @property {Number}  rightBoundary - world rightBoundary.
 * @property {Number}  topBoundary - world topBoundary.
 * @property {Number}  bottomBoundary - world bottomBoundary.
 *
 * @param {cc.Node} followedNode
 * @param {Rect} rect
 * @example
 * // creates the action with a set boundary
 * var followAction = new cc.Follow(node, cc.rect(0, 0, s.width * 2 - 100, s.height));
 * this.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var followAction = new cc.Follow(node);
 * this.runAction(followAction);
 *
 * @class
 * @extends Action
 */
cc.Follow = cc.Class({
    name: 'cc.Follow',
    extends: cc.Action,

	/*
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
	 * creates the action with a set boundary. <br/>
	 * creates the action with no boundary set.
     * @param {cc.Node} followedNode
     * @param {Rect} rect
	 */
    ctor:function (followedNode, rect) {
        // node to follow
        this._followedNode = null;
        // whether camera should be limited to certain area
        this._boundarySet = false;
        // if screen size is bigger than the boundary - update not needed
        this._boundaryFullyCovered = false;
        // fast access to the screen dimensions
        this._halfScreenSize = null;
        this._fullScreenSize = null;

        this.leftBoundary = 0.0;
        this.rightBoundary = 0.0;
        this.topBoundary = 0.0;
        this.bottomBoundary = 0.0;
        this._worldRect = cc.rect(0, 0, 0, 0);

		if(followedNode)
			rect ? this.initWithTarget(followedNode, rect)
				 : this.initWithTarget(followedNode);
    },

    clone:function () {
        var action = new cc.Follow();
        var locRect = this._worldRect;
        var rect = new cc.Rect(locRect.x, locRect.y, locRect.width, locRect.height);
        action.initWithTarget(this._followedNode, rect);
        return action;
    },

    /*
     * Get whether camera should be limited to certain area.
     *
     * @return {Boolean}
     */
    isBoundarySet:function () {
        return this._boundarySet;
    },

    /*
     * alter behavior - turn on/off boundary.
     *
     * @param {Boolean} value
     */
    setBoudarySet:function (value) {
        this._boundarySet = value;
    },

    /*
     * initializes the action with a set boundary.
     *
     * @param {cc.Node} followedNode
     * @param {Rect} [rect=]
     * @return {Boolean}
     */
    initWithTarget:function (followedNode, rect) {
        if (!followedNode) {
            cc.errorID(1022);
            return false;
        }

        var _this = this;
        rect = rect || cc.rect(0, 0, 0, 0);
        _this._followedNode = followedNode;
        _this._worldRect = rect;

        _this._boundarySet = !(rect.width === 0 && rect.height === 0);

        _this._boundaryFullyCovered = false;

        var winSize = cc.winSize;
        _this._fullScreenSize = cc.v2(winSize.width, winSize.height);
        _this._halfScreenSize = _this._fullScreenSize.mul(0.5);

        if (_this._boundarySet) {
            _this.leftBoundary = -((rect.x + rect.width) - _this._fullScreenSize.x);
            _this.rightBoundary = -rect.x;
            _this.topBoundary = -rect.y;
            _this.bottomBoundary = -((rect.y + rect.height) - _this._fullScreenSize.y);

            if (_this.rightBoundary < _this.leftBoundary) {
                // screen width is larger than world's boundary width
                //set both in the middle of the world
                _this.rightBoundary = _this.leftBoundary = (_this.leftBoundary + _this.rightBoundary) / 2;
            }
            if (_this.topBoundary < _this.bottomBoundary) {
                // screen width is larger than world's boundary width
                //set both in the middle of the world
                _this.topBoundary = _this.bottomBoundary = (_this.topBoundary + _this.bottomBoundary) / 2;
            }

            if ((_this.topBoundary === _this.bottomBoundary) && (_this.leftBoundary === _this.rightBoundary))
                _this._boundaryFullyCovered = true;
        }
        return true;
    },

    step:function (dt) {
        var targetWorldPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var followedWorldPos = this._followedNode.convertToWorldSpaceAR(cc.Vec2.ZERO);
        // compute the offset between followed and target node
        var delta = targetWorldPos.sub(followedWorldPos);
        var tempPos = this.target.parent.convertToNodeSpaceAR(delta.add(this._halfScreenSize));

        if (this._boundarySet) {
            // whole map fits inside a single screen, no need to modify the position - unless map boundaries are increased
            if (this._boundaryFullyCovered)
                return;

	        this.target.setPosition(misc.clampf(tempPos.x, this.leftBoundary, this.rightBoundary), misc.clampf(tempPos.y, this.bottomBoundary, this.topBoundary));
        } else {
            this.target.setPosition(tempPos.x, tempPos.y);
        }
    },

    isDone:function () {
        return ( !this._followedNode.activeInHierarchy );
    },

    stop:function () {
        this.target = null;
        cc.Action.prototype.stop.call(this);
    }
});

/**
 * !#en Create a follow action which makes its target follows another node.
 * !#zh 追踪目标节点的位置。
 * @method follow
 * @param {Node} followedNode
 * @param {Rect} rect
 * @return {Action|Null} returns the cc.Follow object on success
 * @example
 * // example
 * // creates the action with a set boundary
 * var followAction = cc.follow(targetNode, cc.rect(0, 0, screenWidth * 2 - 100, screenHeight));
 * node.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var followAction = cc.follow(targetNode);
 * node.runAction(followAction);
 */
cc.follow = function (followedNode, rect) {
    return new cc.Follow(followedNode, rect);
};
