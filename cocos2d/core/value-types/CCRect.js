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
 * !#en A 2D rectangle defined by x, y position and width, height.
 * !#zh 通过位置和宽高定义的 2D 矩形。
 * @class Rect
 * @extends ValueType
 */
/**
 * !#en
 * Constructor of cc.Rect class.
 * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
 * !#zh
 * cc.Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
 *
 * @method constructor
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 */
function Rect (x, y, w, h) {
    if (x && typeof x === 'object') {
        y = x.y;
        w = x.width;
        h = x.height;
        x = x.x;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.width = w || 0;
    this.height = h || 0;
}
JS.extend(Rect, ValueType);
require('../platform/CCClass').fastDefine('cc.Rect', Rect, { x: 0, y: 0, width: 0, height: 0 });

/**
 * @property {Number} x
 */
/**
 * @property {Number} y
 */
/**
 * @property {Number} width
 */
/**
 * @property {Number} height
 */

/**
 * !#en Creates a rectangle from two coordinate values.
 * !#zh 根据指定 2 个坐标创建出一个矩形区域。
 * @static
 * @method fromMinMax
 * @param {Vec2} v1
 * @param {Vec2} v2
 * @return {Rect}
 * @example
 * cc.Rect.fromMinMax(cc.v2(10, 10), cc.v2(20, 20)); // Rect {x: 10, y: 10, width: 10, height: 10};
 */
Rect.fromMinMax = function (v1, v2) {
    var min_x = Math.min(v1.x, v2.x);
    var min_y = Math.min(v1.y, v2.y);
    var max_x = Math.max(v1.x, v2.x);
    var max_y = Math.max(v1.y, v2.y);

    return new Rect(min_x, min_y, max_x - min_x, max_y - min_y);
};

/**
 * !#en Checks if rect contains.
 * !#zh
 * 判断 2 个矩形是否有包含。<br/>
 * 返回 1 为 a 包含 b，如果 -1 为 b 包含 a,
 * 0 这则都不包含。
 * @static
 * @method contain
 * @param a {Rect} Rect a
 * @param b {Rect} Rect b
 * @return {Number} The contains result, 1 is a contains b, -1 is b contains a, 0 is no contains.
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(5, 5, 5, 5);
 * var c = new cc.Rect(20, 20, 10, 10);
 * cc.Rect.contain(a, b); //  1;
 * cc.Rect.contain(b, a); // -1;
 * cc.Rect.contain(a, c); //  0;
 */
Rect.contain = function _Contain (a, b) {
    if (a.x < b.x &&
        a.x + a.width > b.x + b.width &&
        a.y < b.y &&
        a.y + a.height > b.y + b.height) {
        // a contains b
        return 1;
    }
    if (b.x < a.x &&
        b.x + b.width > a.x + a.width &&
        b.y < a.y &&
        b.y + b.height > a.y + a.height) {
        // b contains a
        return -1;
    }
    return 0;
};

var proto = Rect.prototype;

/**
 * !#en TODO
 * !#zh 克隆一个新的 Rect。
 * @method clone
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * a.clone();// Rect {x: 0, y: 0, width: 10, height: 10}
 */
proto.clone = function () {
    return new Rect(this.x, this.y, this.width, this.height);
};

/**
 * !#en TODO
 * !#zh 是否等于指定的矩形。
 * @method equals
 * @param {Rect} other
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(0, 0, 10, 10);
 * a.equals(b);// true;
 */
proto.equals = function (other) {
    return other &&
           this.x === other.x &&
           this.y === other.y &&
           this.width === other.width &&
           this.height === other.height;
};

/**
 * !#en TODO
 * !#zh 线性插值
 * @method lerp
 * @param {Rect} to
 * @param {Number} ratio - the interpolation coefficient.
 * @param {Rect} [out] - optional, the receiving vector.
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(50, 50, 100, 100);
 * update (dt) {
 *    // method 1;
 *    var c = a.lerp(b, dt * 0.1);
 *    // method 2;
 *    a.lerp(b, dt * 0.1, c);
 * }
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
 * !#en TODO
 * !#zh 转换为方便阅读的字符串
 * @method toString
 * @return {String}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * a.toString();// "(0.00, 0.00, 10.00, 10.00)";
 */
proto.toString = function () {
    return '(' + this.x.toFixed(2) + ', ' + this.y.toFixed(2) + ', ' + this.width.toFixed(2) +
           ', ' + this.height.toFixed(2) + ')';
};

/**
 * !#en TODO
 * !#zh 矩形 x 轴上的最小值。
 * @property xMin
 * @type {Number}
 */
JS.getset(proto, 'xMin',
    function () { return this.x; },
    function (value) {
        this.width += this.x - value;
        this.x = value;
    }
);

/**
 * !#en TODO
 * !#zh 矩形 y 轴上的最小值。
 * @property yMin
 * @type {Number}
 */
JS.getset(proto, 'yMin',
    function () { return this.y; },
    function (value) {
        this.height += this.y - value;
        this.y = value;
    }
);

/**
 * !#en TODO
 * !#zh 矩形 x 轴上的最大值。
 * @property xMax
 * @type {Number}
 */
JS.getset(proto, 'xMax',
    function () { return this.x + this.width; },
    function (value) { this.width = value - this.x; }
);

/**
 * !#en TODO
 * !#zh 矩形 y 轴上的最大值。
 * @property yMax
 * @type {Number}
 */
JS.getset(proto, 'yMax',
    function () { return this.y + this.height; },
    function (value) { this.height = value - this.y; }
);

/**
 * !#en The position of the center of the rectangle.
 * !#zh 矩形的中心点。
 * @property {Vec2} center
 */
JS.getset(proto, 'center',
    function () {
        return new cc.Vec2(this.x + this.width * 0.5,
            this.y + this.height * 0.5);
    },
    function (value) {
        this.x = value.x - this.width * 0.5;
        this.y = value.y - this.height * 0.5;
    }
);

/**
 * !#en The X and Y position of the rectangle.
 * !#zh 矩形的 x 和 y 坐标。
 * @property {Vec2} origin
 */
JS.getset(proto, 'origin',
    function () {
        return new cc.Vec2(this.x, this.y);
    },
    function (value) {
        this.x = value.x;
        this.y = value.y;
    }
);

/**
 * !#en Width and height of the rectangle.
 * !#zh 矩形的大小。
 * @property {Size} size
 */
JS.getset(proto, 'size',
    function () {
        return new cc.Size(this.width, this.height);
    },
    function (value) {
        this.width = value.width;
        this.height = value.height;
    }
);

/**
 * !#en TODO
 * !#zh 当前矩形与指定矩形是否相交。
 * @method intersects
 * @param {Rect} rect
 * @type {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(0, 0, 20, 20);
 * a.intersects(b);// true
 */
proto.intersects = function (rect) {
    return cc.rectIntersectsRect(this, rect);
};

/**
 * !#en TODO
 * !#zh 当前矩形是否包含指定坐标点。
 * Returns true if the point inside this rectangle.
 * @method contains
 * @param {Vec2} point
 * @type {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Vec2(0, 5);
 * a.contains(b);// true
 */
proto.contains = function (point) {
    return (this.x <= point.x &&
            this.x + this.width >= point.x &&
            this.y <= point.y &&
            this.y + this.height >= point.y);
};

/**
 * !#en Returns true if the other rect totally inside this rectangle.
 * !#zh 当前矩形是否包含指定矩形。
 * @method containsRect
 * @param {Rect} rect
 * @type {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(0, 0, 20, 20);
 * a.containsRect(b);// true
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
 * !#en
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * !#zh
 * 该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @method rect
 * @param {Number} [x=0]
 * @param {Number} [y=0]
 * @param {Number} [w=0]
 * @param {Number} [h=0]
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0 , 0, 10, 0);
 */
cc.rect = function rect (x, y, w, h) {
    return new Rect(x, y, w, h);
};


// Functional style API, for backward compatibility

/**
 * !#en Check whether a rect's value equals to another.
 * !#zh 判断两个矩形是否相等。
 * @method rectEqualToRect
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(0, 0, 5, 5);
 * cc.rectEqualToRect(a, b); // false;
 * var c = new cc.Rect(0, 0, 5, 5);
 * cc.rectEqualToRect(b, c); // true;
 */
cc.rectEqualToRect = function (rect1, rect2) {
    return rect1 && rect2 && (rect1.x === rect2.x) && (rect1.y === rect2.y) && (rect1.width === rect2.width) && (rect1.height === rect2.height);
};

cc._rectEqualToZero = function(rect){
    return rect && (rect.x === 0) && (rect.y === 0) && (rect.width === 0) && (rect.height === 0);
};

/**
 * !#en Check whether the rect1 contains rect2.
 * !#zh
 * 检查 rect1 矩形是否包含 rect2 矩形。 <br/>
 * 注意：如果要允许 rect1 和 rect2 的边界重合，应该用 cc.rectOverlapsRect
 * @method rectContainsRect
 * @param {Rect} rect1
 * @param {Rect} rect2
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 20, 20);
 * var b = new cc.Rect(10, 10, 20, 20);
 * cc.rectContainsRect(a, b); // true;
 */
cc.rectContainsRect = function (rect1, rect2) {
    if (!rect1 || !rect2)
        return false;
    return !((rect1.x >= rect2.x) || (rect1.y >= rect2.y) ||
        ( rect1.x + rect1.width <= rect2.x + rect2.width) ||
        ( rect1.y + rect1.height <= rect2.y + rect2.height));
};

/**
 * !#en Returns the rightmost x-value of a rect.
 * !#zh 返回矩形在 x 轴上的最大值
 * @method rectGetMaxX
 * @param {Rect} rect
 * @return {Number} The rightmost x value.
 * @example
 * var a = new cc.Rect(10, 0, 20, 20);
 * cc.rectGetMaxX(a); // 30;
 */
cc.rectGetMaxX = function (rect) {
    return (rect.x + rect.width);
};

/**
 * !#en Return the midpoint x-value of a rect.
 * !#zh 返回矩形在 x 轴上的中点。
 * @method rectGetMidX
 * @param {Rect} rect
 * @return {Number} The midpoint x value.
 * @example
 * var a = new cc.Rect(10, 0, 20, 20);
 * cc.rectGetMidX(a); // 20;
 */
cc.rectGetMidX = function (rect) {
    return (rect.x + rect.width / 2.0);
};
/**
 * !#en Returns the leftmost x-value of a rect.
 * !#zh 返回矩形在 x 轴上的最小值。
 * @method rectGetMinX
 * @param {Rect} rect
 * @return {Number} The leftmost x value.
 * @example
 * var a = new cc.Rect(10, 0, 20, 20);
 * cc.rectGetMinX(a); // 10;
 */
cc.rectGetMinX = function (rect) {
    return rect.x;
};

/**
 * !#en Return the topmost y-value of a rect.
 * !#zh 返回矩形在 y 轴上的最大值。
 * @method rectGetMaxY
 * @param {Rect} rect
 * @return {Number} The topmost y value.
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * cc.rectGetMaxY(a); // 30;
 */
cc.rectGetMaxY = function (rect) {
    return(rect.y + rect.height);
};

/**
 * !#en Return the midpoint y-value of `rect'.
 * !#zh 返回矩形在 y 轴上的中点。
 * @method rectGetMidY
 * @param {Rect} rect
 * @return {Number} The midpoint y value.
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * cc.rectGetMidY(a); // 20;
 */
cc.rectGetMidY = function (rect) {
    return rect.y + rect.height / 2.0;
};

/**
 * !#en Return the bottommost y-value of a rect.
 * !#zh 返回矩形在 y 轴上的最小值。
 * @method rectGetMinY
 * @param {Rect} rect
 * @return {Number} The bottommost y value.
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * cc.rectGetMinY(a); // 10;
 */
cc.rectGetMinY = function (rect) {
    return rect.y;
};

/**
 * !#en Check whether a rect contains a point.
 * !#zh 检查一个矩形是否包含某个坐标点。
 * @method rectContainsPoint
 * @param {Rect} rect
 * @param {Vec2} point
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Vec2(0, 10, 10, 10);
 * cc.rectContainsPoint(a, b); // true;
 */
cc.rectContainsPoint = function (rect, point) {
    return (point.x >= cc.rectGetMinX(rect) && point.x <= cc.rectGetMaxX(rect) &&
        point.y >= cc.rectGetMinY(rect) && point.y <= cc.rectGetMaxY(rect)) ;
};

/**
 * !#en Check whether a rect intersect with another.
 * !#zh 检查一个矩形是否与另一个相交。
 * @method rectIntersectsRect
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * cc.rectIntersectsRect(a, b); // true;
 */
cc.rectIntersectsRect = function (ra, rb) {
    var maxax = ra.x + ra.width,
        maxay = ra.y + ra.height,
        maxbx = rb.x + rb.width,
        maxby = rb.y + rb.height;
    return !(maxax < rb.x || maxbx < ra.x || maxay < rb.y || maxby < ra.y);
};

/**
 * !#en Check whether a rect overlaps another.
 * !#zh 检查一个矩形是否重叠另一个。
 * @method rectOverlapsRect
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * cc.rectOverlapsRect(a, b); // true;
 */
cc.rectOverlapsRect = function (rectA, rectB) {
    return !((rectA.x + rectA.width < rectB.x) ||
        (rectB.x + rectB.width < rectA.x) ||
        (rectA.y + rectA.height < rectB.y) ||
        (rectB.y + rectB.height < rectA.y));
};

/**
 * !#en Returns the smallest rectangle that contains the two source rectangles.
 * !#zh 返回一个包含两个指定矩形的最小矩形。
 * @method rectUnion
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * cc.rectUnion(a, b); // Rect {x: 0, y: 10, width: 20, height: 20};
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
 * !#en Returns the overlapping portion of 2 rectangles.
 * !#zh 返回 2 个矩形重叠的部分。
 * @method rectIntersection
 * @param {Rect} rectA
 * @param {Rect} rectB
 * @return {Rect}
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * cc.rectIntersection(a, b); // Rect {x: 0, y: 10, width: 10, height: 10};
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