/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

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

import CCClass from '../data/class';
import Mat4 from './mat4';
import Size from './size';
import { ValueType } from './value-type';
import Vec2 from './vec2';

/**
 * !#en A 2D rectangle defined by x, y position and width, height.
 * !#zh 通过位置和宽高定义的 2D 矩形。
 * @class Rect
 * @extends ValueType
 */
export default class Rect extends ValueType {

    /**
     * !#en The minimum x value, equals to rect.x
     * !#zh 矩形 x 轴上的最小值，等价于 rect.x。
     */
    get xMin () { return this.x; }
    set xMin (value) {
        this.width += this.x - value;
        this.x = value;
    }

    /**
     * !#en The minimum y value, equals to rect.y
     * !#zh 矩形 y 轴上的最小值。
     */
    get yMin () { return this.y; }
    set yMin (value) {
        this.height += this.y - value;
        this.y = value;
    }

    /**
     * !#en The maximum x value.
     * !#zh 矩形 x 轴上的最大值。
     */
    get xMax () { return this.x + this.width; }
    set xMax (value) { this.width = value - this.x; }

    /**
     * !#en The maximum y value.
     * !#zh 矩形 y 轴上的最大值。
     */
    get yMax () { return this.y + this.height; }
    set yMax (value) { this.height = value - this.y; }

    /**
     * !#en The position of the center of the rectangle.
     * !#zh 矩形的中心点。
     */
    get center () {
        return new cc.Vec2(this.x + this.width * 0.5,
            this.y + this.height * 0.5);
    }
    set center (value) {
        this.x = value.x - this.width * 0.5;
        this.y = value.y - this.height * 0.5;
    }

    /**
     * !#en The X and Y position of the rectangle.
     * !#zh 矩形的 x 和 y 坐标。
     */
    get origin () {
        return new cc.Vec2(this.x, this.y);
    }
    set origin (value) {
        this.x = value.x;
        this.y = value.y;
    }

    /**
     * !#en Width and height of the rectangle.
     * !#zh 矩形的大小。
     */
    get size () {
        return new Size(this.width, this.height);
    }
    set size (value) {
        this.width = value.width;
        this.height = value.height;
    }

    /**
     * !#en Creates a rectangle from two coordinate values.
     * !#zh 根据指定 2 个坐标创建出一个矩形区域。
     * @param v1
     * @param v2
     * @return
     * @example
     * cc.Rect.fromMinMax(cc.v2(10, 10), cc.v2(20, 20)); // Rect {x: 10, y: 10, width: 10, height: 10};
     */
    public static fromMinMax (v1: Vec2, v2: Vec2) {
        const min_x = Math.min(v1.x, v2.x);
        const min_y = Math.min(v1.y, v2.y);
        const max_x = Math.max(v1.x, v2.x);
        const max_y = Math.max(v1.y, v2.y);

        return new Rect(min_x, min_y, max_x - min_x, max_y - min_y);
    }
    public x: number;

    public y: number;

    public width: number;

    public height: number;

    /**
     * !#en
     * Constructor of Rect class.
     * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
     * !#zh
     * Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
     */
    constructor (rect: Rect);

    /**
     * !#en
     * Constructor of Rect class.
     * see {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} for convenience method.
     * !#zh
     * Rect类的构造函数。可以通过 {{#crossLink "cc/rect:method"}} cc.rect {{/crossLink}} 简便方法进行创建。
     */
    constructor (x?: number, y?: number, width?: number, height?: number);

    constructor (x?: Rect | number, y?: number, width?: number, height?: number) {
        super();
        if (x && typeof x === 'object') {
            this.y = x.y;
            this.width = x.width;
            this.height = x.height;
            this.x = x.x;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            this.width = width || 0;
            this.height = height || 0;
        }
    }

    /**
     * !#en TODO
     * !#zh 克隆一个新的 Rect。
     * @example
     * var a = new cc.Rect(0, 0, 10, 10);
     * a.clone();// Rect {x: 0, y: 0, width: 10, height: 10}
     */
    public clone () {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    /**
     * !#en TODO
     * !#zh 是否等于指定的矩形。
     * @param other
     * @example
     * var a = new cc.Rect(0, 0, 10, 10);
     * var b = new cc.Rect(0, 0, 10, 10);
     * a.equals(b);// true;
     */
    public equals (other: Rect) {
        return this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height;
    }

    /**
     * !#en TODO
     * !#zh 线性插值
     *
     * @param to
     * @param ratio - the interpolation coefficient.
     * @param out - optional, the receiving vector.
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
    public lerp (to: Rect, ratio: number, out?: Rect) {
        out = out || new Rect();
        const x = this.x;
        const y = this.y;
        const width = this.width;
        const height = this.height;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        out.width = width + (to.width - width) * ratio;
        out.height = height + (to.height - height) * ratio;
        return out;
    }

    public set (source: Rect) {
        this.x = source.x;
        this.y = source.y;
        this.width = source.width;
        this.height = source.height;
    }

    /**
     * !#en Check whether the current rectangle intersects with the given one
     * !#zh 当前矩形与指定矩形是否相交。
     *
     * @param other
     * @return
     * @example
     * var a = new cc.Rect(0, 0, 10, 10);
     * var b = new cc.Rect(0, 0, 20, 20);
     * a.intersects(b);// true
     */
    public intersects (other: Rect) {
        const maxax = this.x + this.width;
        const maxay = this.y + this.height;
        const maxbx = other.x + other.width;
        const maxby = other.y + other.height;
        return !(maxax < other.x || maxbx < this.x || maxay < other.y || maxby < this.y);
    }

    /**
     * !#en Returns the overlapping portion of 2 rectangles.
     * !#zh 返回 2 个矩形重叠的部分。
     *
     * @param out Stores the result
     * @param rectB
     * @return Returns the out parameter
     * @example
     * var a = new cc.Rect(0, 10, 20, 20);
     * var b = new cc.Rect(0, 10, 10, 10);
     * var intersection = new cc.Rect();
     * a.intersection(intersection, b); // intersection {x: 0, y: 10, width: 10, height: 10};
     */
    public intersection (out: Rect, rectB: Rect) {
        const axMin = this.x;
        const ayMin = this.y;
        const axMax = this.x + this.width;
        const ayMax = this.y + this.height;
        const bxMin = rectB.x;
        const byMin = rectB.y;
        const bxMax = rectB.x + rectB.width;
        const byMax = rectB.y + rectB.height;
        out.x = Math.max(axMin, bxMin);
        out.y = Math.max(ayMin, byMin);
        out.width = Math.min(axMax, bxMax) - out.x;
        out.height = Math.min(ayMax, byMax) - out.y;
        return out;
    }

    /**
     * !#en Check whether the current rect contains the given point
     * !#zh 当前矩形是否包含指定坐标点。
     * Returns true if the point inside this rectangle.
     * @param point
     * @example
     * var a = new cc.Rect(0, 0, 10, 10);
     * var b = new cc.Vec2(0, 5);
     * a.contains(b);// true
     */
    public contains (point: Vec2) {
        return (this.x <= point.x &&
                this.x + this.width >= point.x &&
                this.y <= point.y &&
                this.y + this.height >= point.y);
    }

    /**
     * !#en Returns true if the other rect totally inside this rectangle.
     * !#zh 当前矩形是否包含指定矩形。
     * @param other
     * @example
     * var a = new cc.Rect(0, 0, 20, 20);
     * var b = new cc.Rect(0, 0, 10, 10);
     * a.containsRect(b);// true
     */
    public containsRect (other: Rect) {
        return (this.x <= other.x &&
                this.x + this.width >= other.x + other.width &&
                this.y <= other.y &&
                this.y + this.height >= other.y + other.height);
    }

    /**
     * !#en Returns the smallest rectangle that contains the current rect and the given rect.
     * !#zh 返回一个包含当前矩形和指定矩形的最小矩形。
     * @param out Stores the result
     * @param rectB
     * @return Returns the out parameter
     * @example
     * var a = new cc.Rect(0, 10, 20, 20);
     * var b = new cc.Rect(0, 10, 10, 10);
     * var union = new cc.Rect();
     * a.union(union, b); // union {x: 0, y: 10, width: 20, height: 20};
     */
    public union (out: Rect, rectB: Rect) {
        const ax = this.x;
        const ay = this.y;
        const aw = this.width;
        const ah = this.height;
        const bx = rectB.x;
        const by = rectB.y;
        const bw = rectB.width;
        const bh = rectB.height;
        out.x = Math.min(ax, bx);
        out.y = Math.min(ay, by);
        out.width = Math.max(ax + aw, bx + bw) - out.x;
        out.height = Math.max(ay + ah, by + bh) - out.y;
        return out;
    }

    /**
     * !#en Apply matrix4 to the rect.
     * !#zh 使用 mat4 对矩形进行矩阵转换。
     * @param out The output rect
     * @param mat The matrix4
     */
    public transformMat4 (out: Rect, mat: Mat4) {
        const ol = this.x;
        const ob = this.y;
        const or = ol + this.width;
        const ot = ob + this.height;
        const lbx = mat.m00 * ol + mat.m04 * ob + mat.m12;
        const lby = mat.m01 * ol + mat.m05 * ob + mat.m13;
        const rbx = mat.m00 * or + mat.m04 * ob + mat.m12;
        const rby = mat.m01 * or + mat.m05 * ob + mat.m13;
        const ltx = mat.m00 * ol + mat.m04 * ot + mat.m12;
        const lty = mat.m01 * ol + mat.m05 * ot + mat.m13;
        const rtx = mat.m00 * or + mat.m04 * ot + mat.m12;
        const rty = mat.m01 * or + mat.m05 * ot + mat.m13;

        const minX = Math.min(lbx, rbx, ltx, rtx);
        const maxX = Math.max(lbx, rbx, ltx, rtx);
        const minY = Math.min(lby, rby, lty, rty);
        const maxY = Math.max(lby, rby, lty, rty);

        out.x = minX;
        out.y = minY;
        out.width = maxX - minX;
        out.height = maxY - minY;
        return out;
    }

    /**
     * !#en Output rect informations to string
     * !#zh 转换为方便阅读的字符串
     * @example
     * var a = new cc.Rect(0, 0, 10, 10);
     * a.toString();// "(0.00, 0.00, 10.00, 10.00)";
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.width.toFixed(2)}, ${this.height.toFixed(2)})`;
    }
}

CCClass.fastDefine('cc.Rect', Rect, { x: 0, y: 0, width: 0, height: 0 });

cc.Rect = Rect;

/**
 * !#en
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * !#zh
 * 该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @param rect
 * @example
 * var a = cc.rect(new Rect(0, 0, 10, 0));
 */
export function rect (rect: Rect): Rect;

/**
 * !#en
 * The convenience method to create a new Rect.
 * see {{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * !#zh
 * 该方法用来快速创建一个新的矩形。{{#crossLink "Rect/Rect:method"}}cc.Rect{{/crossLink}}
 * @param rect
 * @param x
 * @param y
 * @param width
 * @param height
 * @example
 * var a = cc.rect(0, 0, 10, 0);
 */
export function rect (x?: number, y?: number, width?: number, height?: number): Rect;

export function rect (x: Rect | number = 0, y: number = 0, width: number = 0, height: number = 0): Rect {
    return new Rect(x as any, y, width, height);
}

cc.rect = rect;
