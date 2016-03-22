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

/**
 * A 2D rectangle defined by x, y position and width, height.
 *
 * @class Rect
 * @extends ValueType
 */
/**
 * Constructor of cc.Rect class.
 * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
 * @method Rect
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 * @return {Rect}
 */
function Rect (x, y, w, h) {
    if (x && typeof x === 'object') {
        y = x.y;
        w = x.width;
        h = x.height;
        x = x.x;
    }
    this.x = typeof x === 'number' ? x : 0.0;
    this.y = typeof y === 'number' ? y : 0.0;
    this.width = typeof w === 'number' ? w : 0.0;
    this.height = typeof h === 'number' ? h : 0.0;
}
JS.extend(Rect, ValueType);
require('../platform/CCClass').fastDefine('cc.Rect', Rect, ['x', 'y', 'width', 'height']);

/**
 * Creates a rectangle from two coordinate values.
 * @static
 * @method fromMinMax
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Rect}
 */
Rect.fromMinMax = function (v1, v2) {
    var min_x = Math.min(v1.x, v2.x);
    var min_y = Math.min(v1.y, v2.y);
    var max_x = Math.max(v1.x, v2.x);
    var max_y = Math.max(v1.y, v2.y);

    return new Rect(min_x, min_y, max_x - min_x, max_y - min_y);
};

/**
 * Checks if rect contains.
 * @static
 * @method contain
 * @param a {Rect} Rect a
 * @param b {Rect} Rect b
 * @return {Number} The contains result, 1 is a contains b, -1 is b contains a, 0 is no contains.
 */
Rect.contain = function _Contain (a, b) {
    if (a.x <= b.x &&
        a.x + a.width >= b.x + b.width &&
        a.y <= b.y &&
        a.y + a.height >= b.y + b.height) {
        // a contains b
        return 1;
    }
    if (b.x <= a.x &&
        b.x + b.width >= a.x + a.width &&
        b.y <= a.y &&
        b.y + b.height >= a.y + a.height) {
        // b contains a
        return -1;
    }
    return 0;
};

var proto = Rect.prototype;

/**
 * @method clone
 * @return {Rect}
 */
proto.clone = function () {
    return new Rect(this.x, this.y, this.width, this.height);
};

/**
 * @method equals
 * @param {Rect} other
 * @return {Boolean}
 */
proto.equals = function (other) {
    return other &&
           this.x === other.x &&
           this.y === other.y &&
           this.width === other.width &&
           this.height === other.height;
};

/**
 * @method lerp
 * @param {Rect} to
 * @param {Number} ratio - the interpolation coefficient.
 * @param {Rect} [out] - optional, the receiving vector.
 * @return {Rect}
 */
proto.lerp = function (to, ratio, out) {
    out = out || new Rect();
    var x = this.x;
    var y = this.y;
    var width = this.width;
    var height = this.height;
    out.x = x + (to.x - x) * ratio;
    out.y = y + (to.y - y) * ratio;
    out.width = width + (to.width - width) * ratio;
    out.height = height + (to.height - height) * ratio;
    return out;
};

/**
 * @method toString
 * @return {String}
 */
proto.toString = function () {
    return '(' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ', ' + this.width.toFixed(2) +
           ', ' + this.height.toFixed(2) + ')';
};

/**
 * @property xMin
 * @type {Number}
 */
Object.defineProperty(proto, 'xMin', {
    get: function () { return this.x; },
    set: function (value) {
        this.width += this.x - value;
        this.x = value;
    }
});

/**
 * @property yMin
 * @type {Number}
 */
Object.defineProperty(proto, 'yMin', {
    get: function () { return this.y; },
    set: function (value) {
        this.height += this.y - value;
        this.y = value;
    }
});

/**
 * @property xMax
 * @type {Number}
 */
Object.defineProperty(proto, 'xMax', {
    get: function () { return this.x + this.width; },
    set: function (value) { this.width = value - this.x; }
});

/**
 * @property yMax
 * @type {Number}
 */
Object.defineProperty(proto, 'yMax', {
    get: function () { return this.y + this.height; },
    set: function (value) { this.height = value - this.y; }
});

/**
 * @property center
 * @type {Number}
 */
Object.defineProperty(proto, 'center', {
    get: function () {
        return new cc.Vec2(this.x + this.width * 0.5,
            this.y + this.height * 0.5);
    },
    set: function (value) {
        this.x = value.x - this.width * 0.5;
        this.y = value.y - this.height * 0.5;
    }
});

/**
 * @property {Size} size
 */
Object.defineProperty(proto, 'size', {
    get: function () {
        return new cc.Size(this.width, this.height);
    },
    set: function (value) {
        this.width = value.width;
        this.height = value.height;
    }
});

/**
 * @method intersects
 * @param {Rect} rect
 * @type {Boolean}
 */
proto.intersects = function (rect) {
    return cc.rectIntersectsRect(this, rect);
};

/**
 * Returns true if the point inside this rectangle.
 * @method contains
 * @param {Vec2} point
 * @type {Boolean}
 */
proto.contains = function (point) {
    return (this.x <= point.x &&
            this.x + this.width >= point.x &&
            this.y <= point.y &&
            this.y + this.height >= point.y);
};

/**
 * Returns true if the other rect totally inside this rectangle.
 * @method containsRect
 * @param {Rect} rect
 * @type {Boolean}
 */
proto.containsRect = function (rect) {
    return (this.x <= rect.x &&
            this.x + this.width >= rect.x + rect.width &&
            this.y <= rect.y &&
            this.y + this.height >= rect.y + rect.height);
};

cc.Rect = Rect;

/**
 * @module cc
 */

/**
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @method rect
 * @param {Number[]|Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 * @return {Rect}
 */
cc.rect = function rect (x, y, w, h) {
    return new Rect(x, y, w, h);
};


// Functional style API, for backward compatibility

/**
 * Check whether a rect's value equals to another.
 * @method rectEqualToRect
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 */
cc.rectEqualToRect = function (rect1, rect2) {
    return rect1 && rect2 && (rect1.x === rect2.x) && (rect1.y === rect2.y) && (rect1.width === rect2.width) && (rect1.height === rect2.height);
};

cc._rectEqualToZero = function(rect){
    return rect && (rect.x === 0) && (rect.y === 0) && (rect.width === 0) && (rect.height === 0);
};

/**
 * Check whether the rect1 contains rect2.
 * @method rectContainsRect
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 */
cc.rectContainsRect = function (rect1, rect2) {
    if (!rect1 || !rect2)
        return false;
    return !((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height));
};

/**
 * Returns the rightmost x-value of a rect.
 * @method rectGetMaxX
 * @param {Rect} rect
 * @return {Number} The rightmost x value.
 */
cc.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

/**
 * Return the midpoint x-value of a rect.
 * @method rectGetMidX
 * @param {Rect} rect
 * @return {Number} The midpoint x value.
 */
cc.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};
/**
 * Returns the leftmost x-value of a rect.
 * @method rectGetMinX
 * @param {Rect} rect
 * @return {Number} The leftmost x value.
 */
cc.rectGetMinX = function (rect) {
    return rect.x;
};

/**
 * Return the topmost y-value of a rect.
 * @method rectGetMaxY
 * @param {Rect} rect
 * @return {Number} The topmost y value.
 */
cc.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

/**
 * Return the midpoint y-value of `rect'.
 * @method rectGetMidY
 * @param {Rect} rect
 * @return {Number} The midpoint y value.
 */
cc.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

/**
 * Return the bottommost y-value of a rect.
 * @method rectGetMinY
 * @param {Rect} rect
 * @return {Number} The bottommost y value.
 */
cc.rectGetMinY = function (rect) {
    return rect.y;
};

/**
 * Check whether a rect contains a point.
 * @method rectContainsPoint
 * @param {Rect} rect
 * @param {Vec2} point
 * @return {Boolean}
 */
cc.rectContainsPoint = function (rect, point) {
    return (point.x >= cc.rectGetMinX(rect) && point.x <= cc.rectGetMaxX(rect) &&
        point.y >= cc.rectGetMinY(rect) && point.y <= cc.rectGetMaxY(rect)) ;
};

/**
 * Check whether a rect intersect with another.
 * @method rectIntersectsRect
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Boolean}
 */
cc.rectIntersectsRect = function (ra, rb) {
    var maxax = ra.x + ra.width,
        maxay = ra.y + ra.height,
        maxbx = rb.x + rb.width,
        maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
};

/**
 * Check whether a rect overlaps another.
 * @method rectOverlapsRect
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Boolean}
 */
cc.rectOverlapsRect = function (rectA, rectB) {
    return !((rectA.x + rectA.width < rectB.x) ||
        (rectB.x + rectB.width < rectA.x) ||
        (rectA.y + rectA.height < rectB.y) ||
        (rectB.y + rectB.height < rectA.y));
};

/**
 * Returns the smallest rectangle that contains the two source rectangles.
 * @method rectUnion
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 */
cc.rectUnion = function (rectA, rectB) {
    var rect = cc.rect(0, 0, 0, 0);
    rect.x = Math.min(rectA.x, rectB.x);
    rect.y = Math.min(rectA.y, rectB.y);
    rect.width = Math.max(rectA.x + rectA.width, rectB.x + rectB.width) - rect.x;
    rect.height = Math.max(rectA.y + rectA.height, rectB.y + rectB.height) - rect.y;
    return rect;
};

/**
 * Returns the overlapping portion of 2 rectangles.
 * @method rectUnion
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 */
cc.rectIntersection = function (rectA, rectB) {
    var intersection = cc.rect(
        Math.max(cc.rectGetMinX(rectA), cc.rectGetMinX(rectB)),
        Math.max(cc.rectGetMinY(rectA), cc.rectGetMinY(rectB)),
        0, 0);

    intersection.width = Math.min(cc.rectGetMaxX(rectA), cc.rectGetMaxX(rectB)) - cc.rectGetMinX(intersection);
    intersection.height = Math.min(cc.rectGetMaxY(rectA), cc.rectGetMaxY(rectB)) - cc.rectGetMinY(intersection);
    return intersection;
};

module.exports = cc.Rect;