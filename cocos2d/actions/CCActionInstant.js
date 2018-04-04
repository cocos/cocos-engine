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
 * !#en Instant actions are immediate actions. They don't have a duration like the ActionInterval actions.
 * !#zh 即时动作，这种动作立即就会执行，继承自 FiniteTimeAction。
 * @class ActionInstant
 * @extends FiniteTimeAction
 */
cc.ActionInstant = cc.Class({
    name: 'cc.ActionInstant',
    extends: cc.FiniteTimeAction,
    isDone:function () {
        return true;
    },

    step:function (dt) {
        this.update(1);
    },

    update:function (dt) {
        //nothing
    },

    /**
     * returns a reversed action. <br />
     * For example: <br />
     * - The action is x coordinates of 0 move to 100. <br />
     * - The reversed action will be x of 100 move to 0.
     * @returns {Action}
     */
    reverse:function(){
        return this.clone();
    },

    clone:function(){
        return new cc.ActionInstant();
    }
});

/**
 * @module cc
 */

/*
 * Show the node.
 * @class Show
 * @extends ActionInstant
 */
cc.Show = cc.Class({
    name: 'cc.Show',
    extends: cc.ActionInstant,

    update:function (dt) {
        var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);
        for (var i = 0; i < _renderComps.length; ++i) {
            var render = _renderComps[i];
            render.enabled = true;
        }
    },

    reverse:function () {
        return new cc.Hide();
    },

    clone:function(){
        return new cc.Show();
    }
});

/**
 * !#en Show the Node.
 * !#zh 立即显示。
 * @method show
 * @return {ActionInstant}
 * @example
 * // example
 * var showAction = cc.show();
 */
cc.show = function () {
    return new cc.Show();
};

/*
 * Hide the node.
 * @class Hide
 * @extends ActionInstant
 */
cc.Hide = cc.Class({
    name: 'cc.Hide',
    extends: cc.ActionInstant,

    update:function (dt) {
        var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);
        for (var i = 0; i < _renderComps.length; ++i) {
            var render = _renderComps[i];
            render.enabled = false;
        }
    },

    reverse:function () {
        return new cc.Show();
    },

    clone:function(){
        return new cc.Hide();
    }
});

/**
 * !#en Hide the node.
 * !#zh 立即隐藏。
 * @method hide
 * @return {ActionInstant}
 * @example
 * // example
 * var hideAction = cc.hide();
 */
cc.hide = function () {
    return new cc.Hide();
};

/*
 * Toggles the visibility of a node.
 * @class ToggleVisibility
 * @extends ActionInstant
 */
cc.ToggleVisibility = cc.Class({
    name: 'cc.ToggleVisibility',
    extends: cc.ActionInstant,

    update:function (dt) {
        var _renderComps = this.target.getComponentsInChildren(cc.RenderComponent);
        for (var i = 0; i < _renderComps.length; ++i) {
            var render = _renderComps[i];
            render.enabled = !render.enabled;
        }
    },

    reverse:function () {
        return new cc.ToggleVisibility();
    },

    clone:function(){
        return new cc.ToggleVisibility();
    }
});

/**
 * !#en Toggles the visibility of a node.
 * !#zh 显隐状态切换。
 * @method toggleVisibility
 * @return {ActionInstant}
 * @example
 * // example
 * var toggleVisibilityAction = cc.toggleVisibility();
 */
cc.toggleVisibility = function () {
    return new cc.ToggleVisibility();
};

/*
 * Delete self in the next frame.
 * @class RemoveSelf
 * @extends ActionInstant
 * @param {Boolean} [isNeedCleanUp=true]
 *
 * @example
 * // example
 * var removeSelfAction = new cc.RemoveSelf(false);
 */
cc.RemoveSelf = cc.Class({
    name: 'cc.RemoveSelf',
    extends: cc.ActionInstant,

    ctor:function(isNeedCleanUp){
        this._isNeedCleanUp = true;
	    isNeedCleanUp !== undefined && this.init(isNeedCleanUp);
    },

    update:function(dt){
        this.target.removeFromParent(this._isNeedCleanUp);
    },

    init:function(isNeedCleanUp){
        this._isNeedCleanUp = isNeedCleanUp;
        return true;
    },

    reverse:function(){
        return new cc.RemoveSelf(this._isNeedCleanUp);
    },

    clone:function(){
        return new cc.RemoveSelf(this._isNeedCleanUp);
    }
});

/**
 * !#en Create a RemoveSelf object with a flag indicate whether the target should be cleaned up while removing.
 * !#zh 从父节点移除自身。
 * @method removeSelf
 * @param {Boolean} [isNeedCleanUp = true]
 * @return {ActionInstant}
 *
 * @example
 * // example
 * var removeSelfAction = cc.removeSelf();
 */
cc.removeSelf = function(isNeedCleanUp){
    return new cc.RemoveSelf(isNeedCleanUp);
};

/*
 * Flips the sprite horizontally.
 * @class FlipX
 * @extends ActionInstant
 * @param {Boolean} flip Indicate whether the target should be flipped or not
 *
 * @example
 * var flipXAction = new cc.FlipX(true);
 */
cc.FlipX = cc.Class({
    name: 'cc.FlipX',
    extends: cc.ActionInstant,

    ctor:function(flip){
        this._flippedX = false;
		flip !== undefined && this.initWithFlipX(flip);
    },

    /*
     * initializes the action with a set flipX.
     * @param {Boolean} flip
     * @return {Boolean}
     */
    initWithFlipX:function (flip) {
        this._flippedX = flip;
        return true;
    },

    update:function (dt) {
        this.target.scaleX = Math.abs(this.target.scaleX) * (this._flippedX ? -1 : 1);
    },

    reverse:function () {
        return new cc.FlipX(!this._flippedX);
    },

    clone:function(){
        var action = new cc.FlipX();
        action.initWithFlipX(this._flippedX);
        return action;
    }
});

/**
 * !#en Create a FlipX action to flip or unflip the target.
 * !#zh X轴翻转。
 * @method flipX
 * @param {Boolean} flip Indicate whether the target should be flipped or not
 * @return {ActionInstant}
 * @example
 * var flipXAction = cc.flipX(true);
 */
cc.flipX = function (flip) {
    return new cc.FlipX(flip);
};

/*
 * Flips the sprite vertically
 * @class FlipY
 * @extends ActionInstant
 * @param {Boolean} flip
 * @example
 * var flipYAction = new cc.FlipY(true);
 */
cc.FlipY = cc.Class({
    name: 'cc.FlipY',
    extends: cc.ActionInstant,

    ctor: function(flip){
        this._flippedY = false;
		flip !== undefined && this.initWithFlipY(flip);
    },

    /*
     * initializes the action with a set flipY.
     * @param {Boolean} flip
     * @return {Boolean}
     */
    initWithFlipY:function (flip) {
        this._flippedY = flip;
        return true;
    },

    update:function (dt) {
        this.target.scaleY = Math.abs(this.target.scaleY) * (this._flippedY ? -1 : 1);
    },

    reverse:function () {
        return new cc.FlipY(!this._flippedY);
    },

    clone:function(){
        var action = new cc.FlipY();
        action.initWithFlipY(this._flippedY);
        return action;
    }
});

/**
 * !#en Create a FlipY action to flip or unflip the target.
 * !#zh Y轴翻转。
 * @method flipY
 * @param {Boolean} flip
 * @return {ActionInstant}
 * @example
 * var flipYAction = cc.flipY(true);
 */
cc.flipY = function (flip) {
    return new cc.FlipY(flip);
};

/*
 * Places the node in a certain position
 * @class Place
 * @extends ActionInstant
 * @param {Vec2|Number} pos
 * @param {Number} [y]
 * @example
 * var placeAction = new cc.Place(cc.v2(200, 200));
 * var placeAction = new cc.Place(200, 200);
 */
cc.Place = cc.Class({
    name: 'cc.Place',
    extends: cc.ActionInstant,

    ctor:function(pos, y){
        this._x = 0;
	    this._y = 0;

		if (pos !== undefined) {
			if (pos.x !== undefined) {
				y = pos.y;
				pos = pos.x;
			}
			this.initWithPosition(pos, y);
		}
    },

    /*
     * Initializes a Place action with a position
     * @param {number} x
     * @param {number} y
     * @return {Boolean}
     */
    initWithPosition: function (x, y) {
        this._x = x;
        this._y = y;
        return true;
    },

    update:function (dt) {
        this.target.setPosition(this._x, this._y);
    },

    clone:function(){
        var action = new cc.Place();
        action.initWithPosition(this._x, this._y);
        return action;
    }
});

/**
 * !#en Creates a Place action with a position.
 * !#zh 放置在目标位置。
 * @method place
 * @param {Vec2|Number} pos
 * @param {Number} [y]
 * @return {ActionInstant}
 * @example
 * // example
 * var placeAction = cc.place(cc.v2(200, 200));
 * var placeAction = cc.place(200, 200);
 */
cc.place = function (pos, y) {
    return new cc.Place(pos, y);
};


/*
 * Calls a 'callback'.
 * @class CallFunc
 * @extends ActionInstant
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] data for function, it accepts all data types.
 * @example
 * // example
 * // CallFunc without data
 * var finish = new cc.CallFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = new cc.CallFunc(this.removeFromParentAndCleanup, this,  true);
 */
cc.CallFunc = cc.Class({
    name: 'cc.CallFunc',
    extends: cc.ActionInstant,

    /*
     * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function. <br />
	 * Creates a CallFunc action with the callback.
	 * @param {function} selector
	 * @param {object} [selectorTarget=null]
	 * @param {*} [data=null] data for function, it accepts all data types.
	 */
    ctor:function(selector, selectorTarget, data){
        this._selectorTarget = null;
        this._function = null;
        this._data = null;
        this.initWithFunction(selector, selectorTarget, data);
    },

    /*
     * Initializes the action with a function or function and its target
     * @param {function} selector
     * @param {object|Null} selectorTarget
     * @param {*|Null} [data] data for function, it accepts all data types.
     * @return {Boolean}
     */
    initWithFunction:function (selector, selectorTarget, data) {
        if (selector) {
            this._function = selector;
        }
        if (selectorTarget) {
            this._selectorTarget = selectorTarget;
        }
        if (data !== undefined) {
            this._data = data;
        }
        return true;
    },

    /*
     * execute the function.
     */
    execute:function () {
        if (this._function) {
            this._function.call(this._selectorTarget, this.target, this._data);
        }
    },

    update:function (dt) {
        this.execute();
    },

    /*
     * Get selectorTarget.
     * @return {object}
     */
    getTargetCallback:function () {
        return this._selectorTarget;
    },

    /*
     * Set selectorTarget.
     * @param {object} sel
     */
    setTargetCallback:function (sel) {
        if (sel !== this._selectorTarget) {
            if (this._selectorTarget)
                this._selectorTarget = null;
            this._selectorTarget = sel;
        }
    },

    clone:function(){
        var action = new cc.CallFunc();
        action.initWithFunction(this._function, this._selectorTarget, this._data);
        return action;
    }
});

/**
 * !#en Creates the action with the callback.
 * !#zh 执行回调函数。
 * @method callFunc
 * @param {function} selector
 * @param {object} [selectorTarget=null]
 * @param {*} [data=null] - data for function, it accepts all data types.
 * @return {ActionInstant}
 * @example
 * // example
 * // CallFunc without data
 * var finish = cc.callFunc(this.removeSprite, this);
 *
 * // CallFunc with data
 * var finish = cc.callFunc(this.removeFromParentAndCleanup, this._grossini,  true);
 */
cc.callFunc = function (selector, selectorTarget, data) {
    return new cc.CallFunc(selector, selectorTarget, data);
};
