/****************************************************************************
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

//Action frame type
/**
 * The flag move action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_MOVE = 0;
/**
 * The flag scale action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_SCALE = 1;
/**
 * The flag rotate action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_ROTATE = 2;
/**
 * The flag tint action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_TINT = 3;
/**
 * The flag fade action type of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_FADE = 4;
/**
 * The max flag of Cocostudio frame.
 * @constant
 * @type {number}
 */
ccs.FRAME_TYPE_MAX = 5;

/**
 * The ease type of Cocostudio frame.
 * @constant
 * @type {Object}
 */
ccs.FrameEaseType = {
    CUSTOM : -1,

    LINEAR : 0,

    SINE_EASEIN : 1,
    SINE_EASEOUT : 2,
    SINE_EASEINOUT : 3,

    QUAD_EASEIN : 4,
    QUAD_EASEOUT : 5,
    QUAD_EASEINOUT : 6,

    CUBIC_EASEIN : 7,
    CUBIC_EASEOUT : 8,
    CUBIC_EASEINOUT : 9,

    QUART_EASEIN : 10,
    QUART_EASEOUT : 11,
    QUART_EASEINOUT : 12,

    QUINT_EASEIN : 13,
    QUINT_EASEOUT : 14,
    QUINT_EASEINOUT : 15,

    EXPO_EASEIN : 16,
    EXPO_EASEOUT : 17,
    EXPO_EASEINOUT : 18,

    CIRC_EASEIN : 19,
    CIRC_EASEOUT : 20,
    CIRC_EASEINOUT : 21,

    ELASTIC_EASEIN : 22,
    ELASTIC_EASEOUT : 23,
    ELASTIC_EASEINOUT : 24,

    BACK_EASEIN : 25,
    BACK_EASEOUT : 26,
    BACK_EASEINOUT : 27,

    BOUNCE_EASEIN : 28,
    BOUNCE_EASEOUT : 29,
    BOUNCE_EASEINOUT : 30,

    TWEEN_EASING_MAX: 1000
};


/**
 * The action frame of Cocostudio. It's the base class of ccs.ActionMoveFrame, ccs.ActionScaleFrame etc.
 * @class
 * @extends ccs.Class
 *
 * @property {Number}               frameType               - frame type of ccs.ActionFrame
 * @property {Number}               easingType              - easing type of ccs.ActionFrame
 * @property {Number}               frameIndex              - frame index of ccs.ActionFrame
 * @property {Number}               time                    - time of ccs.ActionFrame
 */
ccs.ActionFrame = ccs.Class.extend(/** @lends ccs.ActionFrame# */{
    frameType: 0,
    easingType: 0,
    frameIndex: 0,
    _Parameter: null,
    time: 0,

    /**
     * The constructor of cc.ActionFrame.
     */
    ctor: function () {
        this.frameType = 0;
        this.easingType = ccs.FrameEaseType.LINEAR;
        this.frameIndex = 0;
        this.time = 0;
    },

    /**
     * Returns the action of ActionFrame. its subClass need override it.
     * @param {number} duration the duration time of ActionFrame
     * @param {ccs.ActionFrame} srcFrame source frame.
     * @returns {null}
     */
    getAction: function (duration, srcFrame) {
        cc.log("Need a definition of <getAction> for ActionFrame");
        return null;
    },

    _getEasingAction : function (action) {
        if (action === null) {
            console.error("Action cannot be null!");
            return null;
        }

        var resultAction;
        switch (this.easingType) {
            case ccs.FrameEaseType.CUSTOM:
                break;
            case ccs.FrameEaseType.LINEAR:
                resultAction = action;
                break;
            case ccs.FrameEaseType.SINE_EASEIN:
                resultAction = action.easing(cc.easeSineIn());
                break;
            case ccs.FrameEaseType.SINE_EASEOUT:
                resultAction = action.easing(cc.easeSineOut());
                break;
            case ccs.FrameEaseType.SINE_EASEINOUT:
                resultAction = action.easing(cc.easeSineInOut());
                break;
            case ccs.FrameEaseType.QUAD_EASEIN:
                resultAction = action.easing(cc.easeQuadraticActionIn());
                break;
            case ccs.FrameEaseType.QUAD_EASEOUT:
                resultAction = action.easing(cc.easeQuadraticActionOut());
                break;
            case ccs.FrameEaseType.QUAD_EASEINOUT:
                resultAction = action.easing(cc.easeQuadraticActionInOut());
                break;
            case ccs.FrameEaseType.CUBIC_EASEIN:
                resultAction = action.easing(cc.easeCubicActionIn());
                break;
            case ccs.FrameEaseType.CUBIC_EASEOUT:
                resultAction = action.easing(cc.easeCubicActionOut());
                break;
            case ccs.FrameEaseType.CUBIC_EASEINOUT:
                resultAction = action.easing(cc.easeCubicActionInOut());
                break;
            case ccs.FrameEaseType.QUART_EASEIN:
                resultAction = action.easing(cc.easeQuarticActionIn());
                break;
            case ccs.FrameEaseType.QUART_EASEOUT:
                resultAction = action.easing(cc.easeQuarticActionOut());
                break;
            case ccs.FrameEaseType.QUART_EASEINOUT:
                resultAction = action.easing(cc.easeQuarticActionInOut());
                break;
            case ccs.FrameEaseType.QUINT_EASEIN:
                resultAction = action.easing(cc.easeQuinticActionIn());
                break;
            case ccs.FrameEaseType.QUINT_EASEOUT:
                resultAction = action.easing(cc.easeQuinticActionOut());
                break;
            case ccs.FrameEaseType.QUINT_EASEINOUT:
                resultAction = action.easing(cc.easeQuinticActionInOut());
                break;
            case ccs.FrameEaseType.EXPO_EASEIN:
                resultAction = action.easing(cc.easeExponentialIn());
                break;
            case ccs.FrameEaseType.EXPO_EASEOUT:
                resultAction = action.easing(cc.easeExponentialOut());
                break;
            case ccs.FrameEaseType.EXPO_EASEINOUT:
                resultAction = action.easing(cc.easeExponentialInOut());
                break;
            case ccs.FrameEaseType.CIRC_EASEIN:
                resultAction = action.easing(cc.easeCircleActionIn());
                break;
            case ccs.FrameEaseType.CIRC_EASEOUT:
                resultAction = action.easing(cc.easeCircleActionOut());
                break;
            case ccs.FrameEaseType.CIRC_EASEINOUT:
                resultAction = action.easing(cc.easeCircleActionInOut());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEIN:
                resultAction = action.easing(cc.easeElasticIn());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEOUT:
                resultAction = action.easing(cc.easeElasticOut());
                break;
            case ccs.FrameEaseType.ELASTIC_EASEINOUT:
                resultAction = action.easing(cc.easeElasticInOut());
                break;
            case ccs.FrameEaseType.BACK_EASEIN:
                resultAction = action.easing(cc.easeBackIn());
                break;
            case ccs.FrameEaseType.BACK_EASEOUT:
                resultAction = action.easing(cc.easeBackOut());
                break;
            case ccs.FrameEaseType.BACK_EASEINOUT:
                resultAction = action.easing(cc.easeBackInOut());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEIN:
                resultAction = action.easing(cc.easeBounceIn());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEOUT:
                resultAction = action.easing(cc.easeBounceOut());
                break;
            case ccs.FrameEaseType.BOUNCE_EASEINOUT:
                resultAction = action.easing(cc.easeBounceInOut());
                break;
        }

        return resultAction;
    },

    /**
     * Sets the easing parameter to action frame.
     * @param {Array} parameter
     */
    setEasingParameter: function(parameter){
        this._Parameter = [];
        for(var i=0;i<parameter.length;i++)
            this._Parameter.push(parameter[i]);
    },

    /**
     * Sets the easing type to ccs.ActionFrame
     * @param {Number} easingType
     */
    setEasingType: function(easingType){
        this.easingType = easingType;
    }
});

/**
 * The Cocostudio's move action frame.
 * @class
 * @extends ccs.ActionFrame
 */
ccs.ActionMoveFrame = ccs.ActionFrame.extend(/** @lends ccs.ActionMoveFrame# */{
    _position: null,
    /**
     * Construction of ccs.ActionMoveFrame
     */
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._position = cc.p(0, 0);
        this.frameType = ccs.FRAME_TYPE_MOVE;
    },

    /**
     * Changes the move action position.
     * @param {cc.Vec2|Number} pos
     * @param {Number} y
     */
    setPosition: function (pos, y) {
        if (y === undefined) {
            this._position.x = pos.x;
            this._position.y = pos.y;
        } else {
            this._position.x = pos;
            this._position.y = y;
        }
    },

    /**
     * Returns the move action position.
     * @returns {cc.Vec2}
     */
    getPosition: function () {
        return this._position;
    },

    /**
     * Returns the CCAction of ActionFrame.
     * @param {number} duration
     * @returns {cc.MoveTo}
     */
    getAction: function (duration) {
        return this._getEasingAction(cc.moveTo(duration, this._position));
    }
});

/**
 * The Cocostudio's scale action frame
 * @class
 * @extends ccs.ActionFrame
 */
ccs.ActionScaleFrame = ccs.ActionFrame.extend(/** @lends ccs.ActionScaleFrame# */{
    _scaleX: 1,
    _scaleY: 1,
    /**
     * Construction of ccs.ActionScaleFrame
     */
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._scaleX = 1;
        this._scaleY = 1;
        this.frameType = ccs.FRAME_TYPE_SCALE;
    },

    /**
     * Changes the scale action scaleX.
     * @param {number} scaleX
     */
    setScaleX: function (scaleX) {
        this._scaleX = scaleX;
    },

    /**
     * Returns the scale action scaleX.
     * @returns {number}
     */
    getScaleX: function () {
        return this._scaleX;
    },

    /**
     * Changes the scale action scaleY.
     * @param {number} scaleY
     */
    setScaleY: function (scaleY) {
        this._scaleY = scaleY;
    },

    /**
     * Returns the scale action scaleY.
     * @returns {number}
     */
    getScaleY: function () {
        return this._scaleY;
    },

    /**
     * Returns the action of ActionFrame.
     * @param {number} duration
     * @returns {cc.ScaleTo}
     */
    getAction: function (duration) {
        return this._getEasingAction(cc.scaleTo(duration, this._scaleX, this._scaleY));
    }
});

/**
 * The Cocostudio's rotation action frame.
 * @class
 * @extends ccs.ActionFrame
 */
ccs.ActionRotationFrame = ccs.ActionFrame.extend(/** @lends ccs.ActionRotationFrame# */{
    _rotation: 0,
    /**
     * Construction of ccs.ActionRotationFrame
     */
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._rotation = 0;
        this.frameType = ccs.FRAME_TYPE_ROTATE;
    },

    /**
     * Changes rotate action rotation.
     * @param {number} rotation
     */
    setRotation: function (rotation) {
        this._rotation = rotation;
    },

    /**
     * Returns the rotate action rotation.
     * @returns {number}
     */
    getRotation: function () {
        return this._rotation;
    },

    /**
     * Returns the CCAction of ActionFrame.
     * @param {number} duration
     * @param {cc.ActionFrame} [srcFrame]
     * @returns {cc.RotateTo}
     */
    getAction: function (duration, srcFrame) {
        if(srcFrame === undefined)
            return this._getEasingAction(cc.rotateTo(duration, this._rotation));
        else {
            if (!(srcFrame instanceof cc.ActionRotationFrame))
                return this.getAction(duration);
            else{
                var diffRotation = this._rotation - srcFrame._rotation;
                return this._getEasingAction(cc.rotateBy(duration,diffRotation));
            }
        }
    }
});

/**
 * The Cocostudio's fade action frame.
 * @class
 * @extends ccs.ActionFrame
 */
ccs.ActionFadeFrame = ccs.ActionFrame.extend(/** @lends ccs.ActionFadeFrame# */{
    _opacity: 255,
    /**
     * Construction of ccs.ActionFadeFrame
     */
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._opacity = 255;
        this.frameType = ccs.FRAME_TYPE_FADE;
    },

    /**
     * Changes the fade action opacity.
     * @param {number} opacity
     */
    setOpacity: function (opacity) {
        this._opacity = opacity;
    },

    /**
     * Returns the fade action opacity.
     * @returns {number}
     */
    getOpacity: function () {
        return this._opacity;
    },

    /**
     * Returns a fade action with easing.
     * @param {Number} duration
     * @returns {cc.FadeTo}
     */
    getAction: function (duration) {
        return this._getEasingAction(cc.fadeTo(duration, this._opacity));
    }
});

/**
 * The Cocostudio's tint action frame.
 * @class
 * @extends ccs.ActionFrame
 */
ccs.ActionTintFrame = ccs.ActionFrame.extend(/** @lends ccs.ActionTintFrame# */{
    _color: null,
    /**
     * Construction of ccs.ActionTintFrame
     */
    ctor: function () {
        ccs.ActionFrame.prototype.ctor.call(this);
        this._color = cc.color(255, 255, 255, 255);
        this.frameType = ccs.FRAME_TYPE_TINT;
    },

    /**
     * Changes the tint action color.
     * @param {cc.Color} color
     */
    setColor: function (color) {
        var locColor = this._color;
        locColor.r = color.r;
        locColor.g = color.g;
        locColor.b = color.b;
    },

    /**
     * Returns the color of tint action.
     * @returns {cc.Color}
     */
    getColor: function () {
        var locColor = this._color;
        return cc.color(locColor.r, locColor.g, locColor.b, locColor.a);
    },

    /**
     * Returns a tint action with easing.
     * @param duration
     * @returns {cc.TintTo}
     */
    getAction: function (duration) {
        return this._getEasingAction(cc.tintTo(duration, this._color.r, this._color.g, this._color.b));
    }
});