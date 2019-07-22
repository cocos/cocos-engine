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

var ValueType = require('./value-type');
var js = require('../platform/js');

/**
 * !#en A 2D rectangle defined by x, y position and width, height.
 * !#zh 通过位置和宽高定义的 2D 矩形。
 * @class Rect
 * @extends ValueType
 */
/**
 * !#en
 * Constructor of Rect class.
 * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
 * !#zh
 * Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
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
js.extend(Rect, ValueType);
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

proto.set = function (source) {
    this.x = source.x;
    this.y = source.y;
    this.width = source.width;
    this.height = source.height;
};

/**
 * !#en Check whether the current rectangle intersects with the given one
 * !#zh 当前矩形与指定矩形是否相交。
 * @method intersects
 * @param {Rect} rect
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 10, 10);
 * var b = new cc.Rect(0, 0, 20, 20);
 * a.intersects(b);// true
 */
proto.intersects = function (rect) {
    var maxax = this.x + this.width,
        maxay = this.y + this.height,
        maxbx = rect.x + rect.width,
        maxby = rect.y + rect.height;
    return !(maxax < rect.x || maxbx < this.x || maxay < rect.y || maxby < this.y);
};

/**
 * !#en Returns the overlapping portion of 2 rectangles.
 * !#zh 返回 2 个矩形重叠的部分。
 * @method intersection
 * @param {Rect} out Stores the result
 * @param {Rect} rectB
 * @return {Rect} Returns the out parameter
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * var intersection = new cc.Rect();
 * a.intersection(intersection, b); // intersection {x: 0, y: 10, width: 10, height: 10};
 */
proto.intersection = function (out, rectB) {
    var axMin = this.x, ayMin = this.y, axMax = this.x + this.width, ayMax = this.y + this.height;
    var bxMin = rectB.x, byMin = rectB.y, bxMax = rectB.x + rectB.width, byMax = rectB.y + rectB.height;
    out.x = Math.max(axMin, bxMin);
    out.y = Math.max(ayMin, byMin);
    out.width = Math.min(axMax, bxMax) - out.x;
    out.height = Math.min(ayMax, byMax) - out.y;
    return out;
};

/**
 * !#en Check whether the current rect contains the given point
 * !#zh 当前矩形是否包含指定坐标点。
 * Returns true if the point inside this rectangle.
 * @method contains
 * @param {Vec2} point
 * @return {Boolean}
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
 * @return {Boolean}
 * @example
 * var a = new cc.Rect(0, 0, 20, 20);
 * var b = new cc.Rect(0, 0, 10, 10);
 * a.containsRect(b);// true
 */
proto.containsRect = function (rect) {
    return (this.x <= rect.x &&
            this.x + this.width >= rect.x + rect.width &&
            this.y <= rect.y &&
            this.y + this.height >= rect.y + rect.height);
};

/**
 * !#en Returns the smallest rectangle that contains the current rect and the given rect.
 * !#zh 返回一个包含当前矩形和指定矩形的最小矩形。
 * @method union
 * @param {Rect} out Stores the result
 * @param {Rect} rectB
 * @return {Rect} Returns the out parameter
 * @example
 * var a = new cc.Rect(0, 10, 20, 20);
 * var b = new cc.Rect(0, 10, 10, 10);
 * var union = new cc.Rect();
 * a.union(union, b); // union {x: 0, y: 10, width: 20, height: 20};
 */
proto.union = function (out, rectB) {
    var ax = this.x, ay = this.y, aw = this.width, ah = this.height;
    var bx = rectB.x, by = rectB.y, bw = rectB.width, bh = rectB.height;
    out.x = Math.min(ax, bx);
    out.y = Math.min(ay, by);
    out.width = Math.max(ax + aw, bx + bw) - out.x;
    out.height = Math.max(ay + ah, by + bh) - out.y;
    return out;
};

/**
 * !#en Apply matrix4 to the rect.
 * !#zh 使用 mat4 对矩形进行矩阵转换。
 * @method transformMat4
 * @param out {Rect} The output rect
 * @param mat {Mat4} The matrix4
 */
proto.transformMat4 = function (out, mat) {
    let ol = this.x;
    let ob = this.y;
    let or = ol + this.width;
    let ot = ob + this.height;
    let matm = mat.m;
    let lbx = matm[0] * ol + matm[4] * ob + matm[12];
    let lby = matm[1] * ol + matm[5] * ob + matm[13];
    let rbx = matm[0] * or + matm[4] * ob + matm[12];
    let rby = matm[1] * or + matm[5] * ob + matm[13];
    let ltx = matm[0] * ol + matm[4] * ot + matm[12];
    let lty = matm[1] * ol + matm[5] * ot + matm[13];
    let rtx = matm[0] * or + matm[4] * ot + matm[12];
    let rty = matm[1] * or + matm[5] * ot + matm[13];

    let minX = Math.min(lbx, rbx, ltx, rtx);
    let maxX = Math.max(lbx, rbx, ltx, rtx);
    let minY = Math.min(lby, rby, lty, rty);
    let maxY = Math.max(lby, rby, lty, rty);

    out.x = minX;
    out.y = minY;
    out.width = maxX - minX;
    out.height = maxY - minY;
    return out;
};

/**
 * !#en Output rect informations to string
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
 * !#en The minimum x value, equals to rect.x
 * !#zh 矩形 x 轴上的最小值，等价于 rect.x。
 * @property xMin
 * @type {Number}
 */
js.getset(proto, 'xMin',
    function () { return this.x; },
    function (value) {
        this.width += this.x - value;
        this.x = value;
    }
);

/**
 * !#en The minimum y value, equals to rect.y
 * !#zh 矩形 y 轴上的最小值。
 * @property yMin
 * @type {Number}
 */
js.getset(proto, 'yMin',
    function () { return this.y; },
    function (value) {
        this.height += this.y - value;
        this.y = value;
    }
);

/**
 * !#en The maximum x value.
 * !#zh 矩形 x 轴上的最大值。
 * @property xMax
 * @type {Number}
 */
js.getset(proto, 'xMax',
    function () { return this.x + this.width; },
    function (value) { this.width = value - this.x; }
);

/**
 * !#en The maximum y value.
 * !#zh 矩形 y 轴上的最大值。
 * @property yMax
 * @type {Number}
 */
js.getset(proto, 'yMax',
    function () { return this.y + this.height; },
    function (value) { this.height = value - this.y; }
);

/**
 * !#en The position of the center of the rectangle.
 * !#zh 矩形的中心点。
 * @property {Vec2} center
 */
js.getset(proto, 'center',
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
js.getset(proto, 'origin',
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
js.getset(proto, 'size',
    function () {
        return new cc.Size(this.width, this.height);
    },
    function (value) {
        this.width = value.width;
        this.height = value.height;
    }
);

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

module.exports = cc.Rect;