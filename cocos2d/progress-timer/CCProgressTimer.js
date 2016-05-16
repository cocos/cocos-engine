/****************************************************************************
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011-2012 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 Copyright (c) 2010      Lam Pham

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
 * cc.Progresstimer is a subclass of ccsg.Node.   <br/>
 * It renders the inner sprite according to the percentage.<br/>
 * The progress can be Radial, Horizontal or vertical.
 * @class
 * @extends _ccsg.Node
 *
 * @property {cc.Vec2}     midPoint        <p>- Midpoint is used to modify the progress start position.<br/>
 *                                          If you're using radials type then the midpoint changes the center point<br/>
 *                                          If you're using bar type the the midpoint changes the bar growth<br/>
 *                                              it expands from the center but clamps to the sprites edge so:<br/>
 *                                              you want a left to right then set the midpoint all the way to cc.p(0,y)<br/>
 *                                              you want a right to left then set the midpoint all the way to cc.p(1,y)<br/>
 *                                              you want a bottom to top then set the midpoint all the way to cc.p(x,0)<br/>
 *                                              you want a top to bottom then set the midpoint all the way to cc.p(x,1)</p>
 * @property {cc.Vec2}     barChangeRate   - This allows the bar type to move the component at a specific rate.
 * @property {cc.ProgressTimer.Type} type   - Type of the progress timer.
 * @property {Number}       percentage      - Percentage to change progress, from 0 to 100.
 * @property {_ccsg.Sprite}    sprite          - The sprite to show the progress percentage.
 * @property {Boolean}      reverseDir      - Indicate whether the direction is reversed.
 *
 */
cc.ProgressTimer = _ccsg.Node.extend(/** @lends cc.ProgressTimer# */{
    _type:null,
    _percentage:0.0,
    _sprite:null,

    _midPoint:null,
    _barChangeRate:null,
    _reverseDirection:false,
    _className:"ProgressTimer",

    /**
     * constructor of cc.ProgressTimer
     * @function
     * @param {_ccsg.Sprite} sprite
     */
    ctor: function(sprite){
        _ccsg.Node.prototype.ctor.call(this);

        this._type = cc.ProgressTimer.Type.RADIAL;
        this._percentage = 0.0;
        this._midPoint = cc.p(0, 0);
        this._barChangeRate = cc.p(0, 0);
        this._reverseDirection = false;
        this._sprite = null;

        sprite && this.initWithSprite(sprite);
    },

    /**
     *    Midpoint is used to modify the progress start position.
     *    If you're using radials type then the midpoint changes the center point
     *    If you're using bar type the the midpoint changes the bar growth
     *        it expands from the center but clamps to the sprites edge so:
     *        you want a left to right then set the midpoint all the way to cc.p(0,y)
     *        you want a right to left then set the midpoint all the way to cc.p(1,y)
     *        you want a bottom to top then set the midpoint all the way to cc.p(x,0)
     *        you want a top to bottom then set the midpoint all the way to cc.p(x,1)
     *  @return {cc.Vec2}
     */
    getMidpoint:function () {
        return cc.p(this._midPoint.x, this._midPoint.y);
    },

    /**
     * Midpoint setter
     * @param {cc.Vec2} mpoint
     */
    setMidpoint:function (mpoint) {
        this._midPoint = cc.pClamp(mpoint, cc.p(0, 0), cc.p(1, 1));
    },

    /**
     *    This allows the bar type to move the component at a specific rate
     *    Set the component to 0 to make sure it stays at 100%.
     *    For example you want a left to right bar but not have the height stay 100%
     *    Set the rate to be cc.p(0,1); and set the midpoint to = cc.p(0,.5f);
     *  @return {cc.Vec2}
     */
    getBarChangeRate:function () {
        return cc.p(this._barChangeRate.x, this._barChangeRate.y);
    },

    /**
     * @param {cc.Vec2} barChangeRate
     */
    setBarChangeRate:function (barChangeRate) {
        this._barChangeRate = cc.pClamp(barChangeRate, cc.p(0, 0), cc.p(1, 1));
    },

    /**
     *  Change the percentage to change progress
     * @return {cc.ProgressTimer.Type}
     */
    getType:function () {
        return this._type;
    },

    /**
     * Percentages are from 0 to 100
     * @return {Number}
     */
    getPercentage:function () {
        return this._percentage;
    },

    /**
     * The image to show the progress percentage, retain
     * @return {_ccsg.Sprite}
     */
    getSprite:function () {
        return this._sprite;
    },

    /**
     * from 0-100
     * @param {Number} percentage
     */
    setPercentage:function (percentage) {
        if (this._percentage !== percentage) {
            this._percentage = cc.clampf(percentage, 0, 100);
            this._renderCmd._updateProgress();
        }
    },
    /**
     * only use for jsbinding
     * @param bValue
     */
    setOpacityModifyRGB:function (bValue) {
    },
    /**
     * only use for jsbinding
     * @returns {boolean}
     */
    isOpacityModifyRGB:function () {
        return false;
    },
    /**
     * return if reverse direction
     * @returns {boolean}
     */
    isReverseDirection:function () {
        return this._reverseDirection;
    },

    /**
     * set color of sprite
     * @param {cc.Color} color
     */
    setColor:function (color) {
        this._sprite.color = color;
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.colorDirty);
    },

    /**
     *  set opacity of sprite
     * @param {Number} opacity
     */
    setOpacity:function (opacity) {
        this._sprite.opacity = opacity;
        //this._renderCmd._updateColor();
        this._renderCmd.setDirtyFlag(_ccsg.Node._dirtyFlags.opacityDirty);
    },

    /**
     * return color of sprite
     * @return {cc.Color}
     */
    getColor:function () {
        return this._sprite.color;
    },

    /**
     * return Opacity of sprite
     * @return {Number}
     */
    getOpacity:function () {
        return this._sprite.opacity;
    },

    /**
     * set reverse cc.ProgressTimer
     * @function
     * @param {Boolean} reverse
     */
    setReverseProgress: function(reverse){
        if (this._reverseDirection !== reverse){
            this._reverseDirection = reverse;
            this._renderCmd.releaseData();
        }
    },

    /**
     * set sprite for cc.ProgressTimer
     * @function
     * @param {_ccsg.Sprite} sprite
     */
    setSprite: function(sprite){
        if (this._sprite !== sprite) {
            this._sprite = sprite;
            if(sprite)
                this.setContentSize(sprite.width,sprite.height);
            else
                this.setContentSize(0,0);
            this._renderCmd.releaseData();
        }
    },

    /**
     * set Progress type of cc.ProgressTimer
     * @function
     * @param {cc.ProgressTimer.Type} type
     */
    setType: function(type){
        if (type !== this._type){
            this._type = type;
            this._renderCmd.releaseData();
        }
    },

    /**
     * Reverse Progress setter
     * @function
     * @param {Boolean} reverse
     */
    setReverseDirection: function(reverse){
        if (this._reverseDirection !== reverse){
            this._reverseDirection = reverse;
            this._renderCmd.releaseData();
        }
    },

    /**
     * Initializes a progress timer with the sprite as the shape the timer goes through
     * @function
     * @param {_ccsg.Sprite} sprite
     * @return {Boolean}
     */
    initWithSprite: function(sprite){
        this.percentage = 0;
        this.setAnchorPoint(0.5,0.5);

        this._type = cc.ProgressTimer.Type.RADIAL;
        this._reverseDirection = false;
        this.midPoint = cc.p(0.5, 0.5);
        this.barChangeRate = cc.p(1, 1);
        this.setSprite(sprite);
        this._renderCmd.initCmd();
        return true;
    },

    _createRenderCmd: function(){
        if(cc._renderType === cc.game.RENDER_TYPE_CANVAS)
            return new cc.ProgressTimer.CanvasRenderCmd(this);
        else
            return new cc.ProgressTimer.WebGLRenderCmd(this);
    }
});

// Extended properties
var _p = cc.ProgressTimer.prototype;

/** @expose */
_p.midPoint;
cc.defineGetterSetter(_p, "midPoint", _p.getMidpoint, _p.setMidpoint);
/** @expose */
_p.barChangeRate;
cc.defineGetterSetter(_p, "barChangeRate", _p.getBarChangeRate, _p.setBarChangeRate);
/** @expose */
_p.type;
cc.defineGetterSetter(_p, "type", _p.getType, _p.setType);
/** @expose */
_p.percentage;
cc.defineGetterSetter(_p, "percentage", _p.getPercentage, _p.setPercentage);
/** @expose */
_p.sprite;
cc.defineGetterSetter(_p, "sprite", _p.getSprite, _p.setSprite);
/** @expose */
_p.reverseDir;
cc.defineGetterSetter(_p, "reverseDir", _p.isReverseDirection, _p.setReverseDirection);


/**
 * create a progress timer object with image file name that renders the inner sprite according to the percentage
 * @deprecated since v3.0,please use new cc.ProgressTimer(sprite) instead.
 * @param {_ccsg.Sprite} sprite
 * @return {cc.ProgressTimer}
 */
cc.ProgressTimer.create = function (sprite) {
    return new cc.ProgressTimer(sprite);
};

/**
 * @constant
 * @type Number
 */
cc.ProgressTimer.TEXTURE_COORDS_COUNT = 4;

/**
 * @constant
 * @type Number
 */
cc.ProgressTimer.TEXTURE_COORDS = 0x4b;

/**
 * Enum for type of ProgressTimer
 * @readonly
 * @enum {number}
 */
cc.ProgressTimer.Type = cc.Enum({
    /**
     * Radial Counter-Clockwise
     */
    RADIAL: 0,
    BAR: 1
});

// fireball#2856
var progressTimerPro = cc.ProgressTimer.prototype;
Object.defineProperty(progressTimerPro, 'color', {
    get: progressTimerPro.getColor,
    set: progressTimerPro.setColor
});

Object.defineProperty(progressTimerPro, 'opacity', {
    get: progressTimerPro.getOpacity,
    set: progressTimerPro.setOpacity
});
