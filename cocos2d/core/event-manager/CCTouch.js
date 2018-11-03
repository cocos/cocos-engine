/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/**
 * !#en The touch event class
 * !#zh 封装了触摸相关的信息。
 * @class Touch
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} id
 */
cc.Touch = function (x, y, id) {
    this._lastModified = 0;
    this.setTouchInfo(id, x, y);
};
cc.Touch.prototype = {
    constructor: cc.Touch,
    /**
     * !#en Returns the current touch location in OpenGL coordinates.、
     * !#zh 获取当前触点位置。
     * @method getLocation
     * @return {Vec2}
     */
    getLocation:function () {
        return cc.v2(this._point.x, this._point.y);
    },

	/**
	 * !#en Returns X axis location value.
     * !#zh 获取当前触点 X 轴位置。
     * @method getLocationX
	 * @returns {Number}
	 */
	getLocationX: function () {
		return this._point.x;
	},

	/**
     * !#en Returns Y axis location value.
     * !#zh 获取当前触点 Y 轴位置。
     * @method getLocationY
	 * @returns {Number}
	 */
	getLocationY: function () {
		return this._point.y;
	},

    /**
     * !#en Returns the previous touch location in OpenGL coordinates.
     * !#zh 获取触点在上一次事件时的位置对象，对象包含 x 和 y 属性。
     * @method getPreviousLocation
     * @return {Vec2}
     */
    getPreviousLocation:function () {
        return cc.v2(this._prevPoint.x, this._prevPoint.y);
    },

    /**
     * !#en Returns the start touch location in OpenGL coordinates.
     * !#zh 获获取触点落下时的位置对象，对象包含 x 和 y 属性。
     * @method getStartLocation
     * @returns {Vec2}
     */
    getStartLocation: function() {
        return cc.v2(this._startPoint.x, this._startPoint.y);
    },

    /**
     * !#en Returns the delta distance from the previous touche to the current one in screen coordinates.
     * !#zh 获取触点距离上一次事件移动的距离对象，对象包含 x 和 y 属性。
     * @method getDelta
     * @return {Vec2}
     */
    getDelta:function () {
        return this._point.sub(this._prevPoint);
    },

    /**
     * !#en Returns the current touch location in screen coordinates.
     * !#zh 获取当前事件在游戏窗口内的坐标位置对象，对象包含 x 和 y 属性。
     * @method getLocationInView
     * @return {Vec2}
     */
    getLocationInView: function() {
        return cc.v2(this._point.x, cc.view._designResolutionSize.height - this._point.y);
    },

    /**
     * !#en Returns the previous touch location in screen coordinates.
     * !#zh 获取触点在上一次事件时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @method getPreviousLocationInView
     * @return {Vec2}
     */
    getPreviousLocationInView: function(){
        return cc.v2(this._prevPoint.x, cc.view._designResolutionSize.height - this._prevPoint.y);
    },

    /**
     * !#en Returns the start touch location in screen coordinates.
     * !#zh 获取触点落下时在游戏窗口中的位置对象，对象包含 x 和 y 属性。
     * @method getStartLocationInView
     * @return {Vec2}
     */
    getStartLocationInView: function(){
        return cc.v2(this._startPoint.x, cc.view._designResolutionSize.height - this._startPoint.y);
    },

    /**
     * !#en Returns the id of cc.Touch.
     * !#zh 触点的标识 ID，可以用来在多点触摸中跟踪触点。
     * @method getID
     * @return {Number}
     */
    getID:function () {
        return this._id;
    },

    /**
     * !#en Sets information to touch.
     * !#zh 设置触摸相关的信息。用于监控触摸事件。
     * @method setTouchInfo
     * @param {Number} id
     * @param  {Number} x
     * @param  {Number} y
     */
    setTouchInfo:function (id, x, y) {
        this._prevPoint = this._point;
        this._point = cc.v2(x || 0, y || 0);
        this._id = id;
        if(!this._startPointCaptured){
            this._startPoint = cc.v2(this._point);
            cc.view._convertPointWithScale(this._startPoint);
            this._startPointCaptured = true;
        }
    },

    _setPoint: function(x, y){
        if(y === undefined){
            this._point.x = x.x;
            this._point.y = x.y;
        }else{
            this._point.x = x;
            this._point.y = y;
        }
    },

    _setPrevPoint:function (x, y) {
        if(y === undefined)
            this._prevPoint = cc.v2(x.x, x.y);
        else
            this._prevPoint = cc.v2(x || 0, y || 0);
    }
};