/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var ValueType = require('./CCValueType');
var JS = require('../platform/js');
var FireClass = require('../platform/CCClass');

/**
 * Representation of 2D vectors and points.
 *
 * @class Vec2
 * @extends ValueType
 * @constructor
 */

 /**
 * Constructor
 * see {{#crossLink "cc/vec2:method"}}cc.v2{{/crossLink}} or {{#crossLink "cc/p:method"}}cc.p{{/crossLink}}
 * @method Vec2
 * @param {number} [x=0]
 * @param {number} [y=0]
 * @return {Vec2}
 */
function Vec2 (x, y) {
    if (x && typeof x === 'object') {
        y = x.y;
        x = x.x;
    }
    this.x = (typeof x === 'number' ? x : 0.0);
    this.y = (typeof y === 'number' ? y : 0.0);
}
JS.extend(Vec2, ValueType);
FireClass.fastDefine('cc.Vec2', Vec2, ['x', 'y']);

JS.mixin(Vec2.prototype, {

    /**
     * !#en clone a Vec2 value
     * !#zh 克隆一个 Vec2 值
     * @method clone
     * @return {Vec2}
     */
    clone: function () {
        return new Vec2(this.x, this.y);
    },

    /**
     * @method set
     * @param {Vec2} newValue - !#en new value to set. !#zh 要设置的新值
     * @return {Vec2} returns this
     * @chainable
     */
    set: function (newValue) {
        this.x = newValue.x;
        this.y = newValue.y;
        return this;
    },

    /**
     * @method equals
     * @param {Vec2} other
     * @return {Boolean}
     */
    equals: function (other) {
        return other && this.x === other.x && this.y === other.y;
    },

    /**
     * @method toString
     * @return {string}
     */
    toString: function () {
        return "(" +
               this.x.toFixed(2) + ", " +
               this.y.toFixed(2) + ")"
            ;
    },

    /**
     * @method lerp
     * @param {Vec2} to
     * @param {number} ratio - the interpolation coefficient
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2}
     */
    lerp: function (to, ratio, out) {
        out = out || new Vec2();
        var x = this.x;
        var y = this.y;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        return out;
    },

    /**
     * Adds this vector. If you want to save result to another vector, use add() instead.
     * @method addSelf
     * @param {Vec2} vector
     * @return {Vec2} returns this
     * @chainable
     */
    addSelf: function (vector) {
        this.x += vector.x;
        this.y += vector.y;
        return this;
    },

    /**
     * Adds two vectors, and returns the new result.
     * @method add
     * @param {Vec2} vector
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    add: function (vector, out) {
        out = out || new Vec2();
        out.x = this.x + vector.x;
        out.y = this.y + vector.y;
        return out;
    },

    /**
     * Subtracts one vector from this. If you want to save result to another vector, use sub() instead.
     * @method subSelf
     * @param {Vec2} vector
     * @return {Vec2} returns this
     * @chainable
     */
    subSelf: function (vector) {
        this.x -= vector.x;
        this.y -= vector.y;
        return this;
    },

    /**
     * Subtracts one vector from this, and returns the new result.
     * @method sub
     * @param {Vec2} vector
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    sub: function (vector, out) {
        out = out || new Vec2();
        out.x = this.x - vector.x;
        out.y = this.y - vector.y;
        return out;
    },

    /**
     * Multiplies this by a number. If you want to save result to another vector, use mul() instead.
     * @method mulSelf
     * @param {number} num
     * @return {Vec2} returns this
     * @chainable
     */
    mulSelf: function (num) {
        this.x *= num;
        this.y *= num;
        return this;
    },

    /**
     * Multiplies by a number, and returns the new result.
     * @method mul
     * @param {number} num
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    mul: function (num, out) {
        out = out || new Vec2();
        out.x = this.x * num;
        out.y = this.y * num;
        return out;
    },

    /**
     * Multiplies two vectors.
     * @method scaleSelf
     * @param {Vec2} vector
     * @return {Vec2} returns this
     * @chainable
     */
    scaleSelf: function (vector) {
        this.x *= vector.x;
        this.y *= vector.y;
        return this;
    },

    /**
     * Multiplies two vectors, and returns the new result.
     * @method scale
     * @param {Vec2} vector
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    scale: function (vector, out) {
        out = out || new Vec2();
        out.x = this.x * vector.x;
        out.y = this.y * vector.y;
        return out;
    },

    /**
     * Divides by a number. If you want to save result to another vector, use div() instead.
     * @method divSelf
     * @param {Vec2} vector
     * @return {Vec2} returns this
     * @chainable
     */
    divSelf: function (num) {
        this.x /= num;
        this.y /= num;
        return this;
    },

    /**
     * Divides by a number, and returns the new result.
     * @method div
     * @param {Vec2} vector
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    div: function (num, out) {
        out = out || new Vec2();
        out.x = this.x / num;
        out.y = this.y / num;
        return out;
    },

    /**
     * Negates the components. If you want to save result to another vector, use neg() instead.
     * @method negSelf
     * @return {Vec2} returns this
     * @chainable
     */
    negSelf: function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },

    /**
     * Negates the components, and returns the new result.
     * @method neg
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    neg: function (out) {
        out = out || new Vec2();
        out.x = -this.x;
        out.y = -this.y;
        return out;
    },

    /**
     * Dot product
     * @method dot
     * @param {Vec2} [vector]
     * @return {number} the result
     */
    dot: function (vector) {
        return this.x * vector.x + this.y * vector.y;
    },

    /**
     * Cross product
     * @method cross
     * @param {Vec2} [vector]
     * @return {number} the result
     */
    cross: function (vector) {
        return this.y * vector.x - this.x * vector.y;
    },

    /**
     * Returns the length of this vector.
     * @method mag
     * @return {number} the result
     */
    mag: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },

    /**
     * Returns the squared length of this vector.
     * @method magSqr
     * @return {number} the result
     */
    magSqr: function () {
        return this.x * this.x + this.y * this.y;
    },

    /**
     * Make the length of this vector to 1.
     * @method normalizeSelf
     * @return {Vec2} returns this
     * @chainable
     */
    normalizeSelf: function () {
        var magSqr = this.x * this.x + this.y * this.y;
        if (magSqr === 1.0)
            return this;

        if (magSqr === 0.0) {
            console.warn("Can't normalize zero vector");
            return this;
        }

        var invsqrt = 1.0 / Math.sqrt(magSqr);
        this.x *= invsqrt;
        this.y *= invsqrt;

        return this;
    },

    /**
     * Returns this vector with a magnitude of 1.
     *
     * Note that the current vector is unchanged and a new normalized vector is returned. If you want to normalize the current vector, use normalizeSelf function.
     * @method normalize
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} result
     */
    normalize: function (out) {
        out = out || new Vec2();
        out.x = this.x;
        out.y = this.y;
        out.normalizeSelf();
        return out;
    },

    /**
     * Get angle in radian between this and vector
     * @method angle
     * @param {Vec2} vector
     * @return {number} from 0 to Math.PI
     */
    angle: function (vector) {
        var magSqr1 = this.magSqr();
        var magSqr2 = vector.magSqr();

        if (magSqr1 === 0 || magSqr2 === 0) {
            console.warn("Can't get angle between zero vector");
            return 0.0;
        }

        var dot = this.dot(vector);
        var theta = dot / (Math.sqrt(magSqr1 * magSqr2));
        theta = cc.clampf(theta, -1.0, 1.0);
        return Math.acos(theta);
    },

    /**
     * Get angle in radian between this and vector with direction
     * @method signAngle
     * @param {Vec2} vector
     * @return {number} from -MathPI to Math.PI
     */
    signAngle: function (vector) {
        // NOTE: this algorithm will return 0.0 without signed if vectors are parallex
        // var angle = this.angle(vector);
        // var cross = this.cross(vector);
        // return Math.sign(cross) * angle;

        return Math.atan2(this.y, this.x) - Math.atan2(vector.y, vector.x);
    },

    /**
     * rotate
     * @method rotate
     * @param {number} radians
     * @param {Vec2} [out] - optional, the receiving vector
     * @return {Vec2} the result
     */
    rotate: function (radians, out) {
        out = out || new Vec2();
        out.x = this.x;
        out.y = this.y;
        return out.rotateSelf(radians);
    },

    /**
     * rotate self
     * @method rotateSelf
     * @param {number} radians
     * @return {Vec2} returns this
     * @chainable
     */
    rotateSelf: function (radians) {
        var sin = Math.sin(radians);
        var cos = Math.cos(radians);
        var x = this.x;
        this.x = cos * x - sin * this.y;
        this.y = sin * x + cos * this.y;
        return this;
    }

    //_serialize: function () {
    //    return [this.x, this.y];
    //},
    //_deserialize: function (data) {
    //    this.x = data[0];
    //    this.y = data[1];
    //}
});

// static

/**
 * return a Vec2 object with x = 1 and y = 1
 * @property ONE
 * @type Vec2
 * @static
 */
JS.get(Vec2, 'ONE', function () {
    return new Vec2(1.0, 1.0);
});

/**
 * return a Vec2 object with x = 0 and y = 0
 * @property ZERO
 * @type Vec2
 * @static
 */
JS.get(Vec2, 'ZERO', function () {
    return new Vec2(0.0, 0.0);
});

/**
 * return a Vec2 object with x = 0 and y = 1
 * @property up
 * @type Vec2
 * @static
 */
JS.get(Vec2, 'UP', function () {
    return new Vec2(0.0, 1.0);
});

/**
 * return a Vec2 object with x = 1 and y = 0
 * @property RIGHT
 * @type Vec2
 * @static
 */
JS.get(Vec2, 'RIGHT', function () {
    return new Vec2(1.0, 0.0);
});

cc.Vec2 = Vec2;

/**
 * @module cc
 */


/**
 * The convenience method to create a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * @method v2
 * @param {Number|Object} [x=0]
 * @param {Number} [y=0]
 * @return {Vec2}
 */
cc.v2 = function v2 (x, y) {
    return new Vec2(x, y);
};

/**
 * The convenience method to creates a new {{#crossLink "Vec2"}}cc.Vec2{{/crossLink}}.
 * @method p
 * @param {Number|Object} [x=0] a Number or a size object
 * @param {Number} [y=0]
 * @return {Vec2}
 * @example
 * var point1 = cc.p();
 * var point2 = cc.p(100, 100);
 * var point3 = cc.p(point2);
 * var point4 = cc.p({x: 100, y: 100});
 */
cc.p = cc.v2;


// Functional style API, for backward compatibility

/**
 * Check whether a point's value equals to another
 * @method pointEqualToPoint
 * @param {Vec2} point1
 * @param {Vec2} point2
 * @return {Boolean}
 */
cc.pointEqualToPoint = function (point1, point2) {
    return point1 && point2 && (point1.x === point2.x) && (point1.y === point2.y);
};

module.exports = cc.Vec2;