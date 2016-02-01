/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.

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

/** Default Action tag
 * @constant
 * @type {Number}
 * @default
 */
cc.ACTION_TAG_INVALID = -1;

/**
 * Base class cc.Action for action classes.
 * @class Action
 *
 * @extends _Class
 */
cc.Action = cc._Class.extend({
    //***********variables*************
    originalTarget:null,
    target:null,
    tag:cc.ACTION_TAG_INVALID,

    //**************Public Functions***********

    ctor:function () {
        this.originalTarget = null;
        this.target = null;
        this.tag = cc.ACTION_TAG_INVALID;
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
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
     * return true if the action has finished.
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
        cc.log("[Action step]. override me");
    },

    // Called once per frame. Time is the number of seconds of a frame interval.
    update:function (dt) {
        cc.log("[Action update]. override me");
    },

    /**
     * get the target.
     * @method getTarget
     * @return {Node}
     */
    getTarget:function () {
        return this.target;
    },

    /**
     * The action will modify the target properties.
     * @method setTarget
     * @param {Node} target
     */
    setTarget:function (target) {
        this.target = target;
    },

    /**
     * get the original target.
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
     * get tag number.
     * @method getTag
     * @return {Number}
     */
    getTag:function () {
        return this.tag;
    },

    /**
     * set tag number.
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

cc.action = function () {
    return new cc.Action();
};

cc.Action.create = cc.action;


/**
 * Base class actions that do have a finite time duration. <br/>
 * Possible actions: <br/>
 * - An action with a duration of 0 seconds. <br/>
 * - An action with a duration of 35.5 seconds.
 *
 * Infinite time actions are valid
 * @class FiniteTimeAction
 * @extends Action
 */
cc.FiniteTimeAction = cc.Action.extend({
    //! duration in seconds
    _duration:0,

    ctor:function () {
        cc.Action.prototype.ctor.call(this);
        this._duration = 0;
    },

    /**
     * get duration of the action. (seconds)
     * @method getDuration
     * @return {Number}
     */
    getDuration:function () {
        return this._duration * (this._timesForRepeat || 1);
    },

    /**
     * set duration of the action. (seconds)
     * @method setDuration
     * @param {Number} duration
     */
    setDuration:function (duration) {
        this._duration = duration;
    },

    /**
     * Returns a reversed action. <br />
     * For example: <br />
     * - The action will be x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * - Will be rewritten
     * @method reverse
     * @return {Null}
     */
    reverse:function () {
        cc.log("cocos2d: FiniteTimeAction#reverse: Implement me");
        return null;
    },

    /**
     * to copy object with deep copy.
     * returns a clone of action.
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
 * @constructor
 * @param {ActionInterval} action
 * @param {Number} speed
 */
cc.Speed = cc.Action.extend({
    _speed:0.0,
    _innerAction:null,

    ctor:function (action, speed) {
        cc.Action.prototype.ctor.call(this);
        this._speed = 0;
        this._innerAction = null;

		action && this.initWithAction(action, speed);
    },

    /**
     * Gets the current running speed. <br />
     * Will get a percentage number, compared to the original speed.
     *
     * @method getSpeed
     * @return {Number}
     */
    getSpeed:function () {
        return this._speed;
    },

    /**
     * alter the speed of the inner function in runtime.
     * @method setSpeed
     * @param {Number} speed
     */
    setSpeed:function (speed) {
        this._speed = speed;
    },

    /**
     * initializes the action.
     * @method initWithAction
     * @param {ActionInterval} action
     * @param {Number} speed
     * @return {Boolean}
     */
    initWithAction:function (action, speed) {
        if(!action)
            throw new Error("cc.Speed.initWithAction(): action must be non nil");

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

    /**
     * Set inner Action.
     * @method setInnerAction
     * @param {ActionInterval} action
     */
    setInnerAction:function (action) {
        if (this._innerAction !== action) {
            this._innerAction = action;
        }
    },

    /**
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
 * Creates the speed action which changes the speed of an action, making it take longer (speed > 1)
 * or less (speed < 1) time. <br/>
 * Useful to simulate 'slow motion' or 'fast forward' effect.
 *
 * @warning This action can't be Sequenceable because it is not an cc.IntervalAction
 *
 * @method speed
 * @param {ActionInterval} action
 * @param {Number} speed
 * @return {Action}
 */
cc.speed = function (action, speed) {
    return new cc.Speed(action, speed);
};

cc.Speed.create = cc.speed;

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
 * @param {_ccsg.Node} followedNode
 * @param {Rect} rect
 * @example
 * // creates the action with a set boundary
 * var sprite = new _ccsg.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite, cc.rect(0, 0, s.width * 2 - 100, s.height));
 * this.runAction(followAction);
 *
 * // creates the action with no boundary set
 * var sprite = new _ccsg.Sprite("spriteFileName");
 * var followAction = new cc.Follow(sprite);
 * this.runAction(followAction);
 *
 * @class
 * @extends Action
 */
cc.Follow = cc.Action.extend({
    // node to follow
    _followedNode:null,
    // whether camera should be limited to certain area
    _boundarySet:false,
    // if screen size is bigger than the boundary - update not needed
    _boundaryFullyCovered:false,
    // fast access to the screen dimensions
    _halfScreenSize:null,
    _fullScreenSize:null,
    _worldRect:null,

    leftBoundary:0.0,
    rightBoundary:0.0,
    topBoundary:0.0,
    bottomBoundary:0.0,

	/**
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
	 * creates the action with a set boundary. <br/>
	 * creates the action with no boundary set.
     * @param {_ccsg.Node} followedNode
     * @param {Rect} rect
	 */
    ctor:function (followedNode, rect) {
        cc.Action.prototype.ctor.call(this);
        this._followedNode = null;
        this._boundarySet = false;

        this._boundaryFullyCovered = false;
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
     * @param {_ccsg.Node} followedNode
     * @param {Rect} [rect=]
     * @return {Boolean}
     */
    initWithTarget:function (followedNode, rect) {
        if(!followedNode)
            throw new Error("cc.Follow.initWithAction(): followedNode must be non nil");

        var _this = this;
        rect = rect || cc.rect(0, 0, 0, 0);
        _this._followedNode = followedNode;
        _this._worldRect = rect;

        _this._boundarySet = !cc._rectEqualToZero(rect);

        _this._boundaryFullyCovered = false;

        var winSize = cc.director.getWinSize();
        _this._fullScreenSize = cc.p(winSize.width, winSize.height);
        _this._halfScreenSize = cc.pMult(_this._fullScreenSize, 0.5);

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
        var tempPosX = this._followedNode.x;
        var tempPosY = this._followedNode.y;
        tempPosX = this._halfScreenSize.x - tempPosX;
        tempPosY = this._halfScreenSize.y - tempPosY;

        //TODO Temporary treatment - The dirtyFlag symbol error
        this.target._renderCmd._dirtyFlag = 0;

        if (this._boundarySet) {
            // whole map fits inside a single screen, no need to modify the position - unless map boundaries are increased
            if (this._boundaryFullyCovered)
                return;

	        this.target.setPosition(cc.clampf(tempPosX, this.leftBoundary, this.rightBoundary), cc.clampf(tempPosY, this.bottomBoundary, this.topBoundary));
        } else {
            this.target.setPosition(tempPosX, tempPosY);
        }
    },

    isDone:function () {
        return ( !this._followedNode.running );
    },

    stop:function () {
        this.target = null;
        cc.Action.prototype.stop.call(this);
    }
});

/**
 * Create a follow action which makes its target follows another node.
 *
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

cc.Follow.create = cc.follow;
