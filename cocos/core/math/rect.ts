/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { CCClass } from '../data/class';
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { Size } from './size';
import { IRectLike, IVec2Like } from './type-define';
import { Vec2 } from './vec2';
import { legacyCC } from '../global-exports';

/**
 * @en
 * A 2D rectangle defined by x, y position and width, height.
 * @zh
 * 轴对齐矩形。
 * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
 * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
 */
export class Rect extends ValueType {
    /**
     * @en Creates a rectangle from two coordinate values.
     * @zh 由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形。
     * @param v1 Specified point 1.
     * @param v2 Specified point 2.
     * @returns Target rectangle.
     */
    public static fromMinMax <Out extends IRectLike, VecLike extends IVec2Like> (out: Out, v1: VecLike, v2: VecLike) {
        const minX = Math.min(v1.x, v2.x);
        const minY = Math.min(v1.y, v2.y);
        const maxX = Math.max(v1.x, v2.x);
        const maxY = Math.max(v1.y, v2.y);
        out.x = minX;
        out.y = minY;
        out.width = maxX - minX;
        out.height = maxY - minY;

        return out;
    }

    /**
     * @en Calculate the interpolation result between this rect and another one with given ratio
     * @zh 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param out Output rect.
     * @param from Original rect.
     * @param to Target rect.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public static lerp <Out extends IRectLike> (out: Out, from: Out, to: Out, ratio: number) {
        const x = from.x;
        const y = from.y;
        const w = from.width;
        const h = from.height;
        out.x = x + (to.x - x) * ratio;
        out.y = y + (to.y - y) * ratio;
        out.width = w + (to.width - w) * ratio;
        out.height = h + (to.height - h) * ratio;

        return out;
    }

    /**
     * @en Returns the overlapping portion of 2 rectangles.
     * @zh 计算当前矩形与指定矩形重叠部分的矩形，将其赋值给输出矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    public static intersection <Out extends IRectLike> (out: Out, one: Out, other: Out) {
        const axMin = one.x;
        const ayMin = one.y;
        const axMax = one.x + one.width;
        const ayMax = one.y + one.height;
        const bxMin = other.x;
        const byMin = other.y;
        const bxMax = other.x + other.width;
        const byMax = other.y + other.height;
        out.x = Math.max(axMin, bxMin);
        out.y = Math.max(ayMin, byMin);
        out.width = Math.min(axMax, bxMax) - out.x;
        out.height = Math.min(ayMax, byMax) - out.y;

        return out;
    }

    /**
     * @en Returns the smallest rectangle that contains the current rect and the given rect.
     * @zh 创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给输出矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    public static union <Out extends IRectLike> (out: Out, one: Out, other: Out) {
        const x = one.x;
        const y = one.y;
        const w = one.width;
        const h = one.height;
        const bx = other.x;
        const by = other.y;
        const bw = other.width;
        const bh = other.height;
        out.x = Math.min(x, bx);
        out.y = Math.min(y, by);
        out.width = Math.max(x + w, bx + bw) - out.x;
        out.height = Math.max(y + h, by + bh) - out.y;

        return out;
    }

    /**
     * @en The minimum x value.
     * @zh 获取或设置矩形在 x 轴上的最小值。
     */
    get xMin () {
        return this.x;
    }

    set xMin (value) {
        this.width += this.x - value;
        this.x = value;
    }

    /**
     * @en The minimum y value.
     * @zh 获取或设置矩形在 y 轴上的最小值。
     */
    get yMin () {
        return this.y;
    }

    set yMin (value) {
        this.height += this.y - value;
        this.y = value;
    }

    /**
     * @en The maximum x value.
     * @zh 获取或设置矩形在 x 轴上的最大值。
     */
    get xMax () {
        return this.x + this.width;
    }

    set xMax (value) {
        this.width = value - this.x;
    }

    /**
     * @en The maximum y value.
     * @zh 获取或设置矩形在 y 轴上的最大值。
     */
    get yMax () {
        return this.y + this.height;
    }

    set yMax (value) {
        this.height = value - this.y;
    }

    /**
     * @en The position of the center of the rectangle.
     * @zh 获取或设置矩形中心点的坐标。
     */
    get center () {
        return new Vec2(this.x + this.width * 0.5,
            this.y + this.height * 0.5);
    }

    set center (value) {
        this.x = value.x - this.width * 0.5;
        this.y = value.y - this.height * 0.5;
    }

    /**
     * @en Returns a new [[Vec2]] object representing the position of the rectangle
     * @zh 获取或设置矩形的 x 和 y 坐标。
     */
    get origin () {
        return new Vec2(this.x, this.y);
    }

    set origin (value) {
        this.x = value.x;
        this.y = value.y;
    }

    /**
     * @en Returns a new [[Size]] object represents the width and height of the rectangle
     * @zh 获取或设置矩形的尺寸。
     */
    get size () {
        return new Size(this.width, this.height);
    }

    set size (value) {
        this.width = value.width;
        this.height = value.height;
    }

    // compatibility with vector interfaces
    set z (val) { this.width = val; }
    get z () { return this.width; }
    set w (val) { this.height = val; }
    get w () { return this.height; }

    /**
     * @en The minimum x value.
     * @zh 矩形最小点的 x 坐标。
     */
    public declare x: number;

    /**
     * @en The minimum y value.
     * @zh 矩形最小点的 y 坐标。
     */
    public declare y: number;

    /**
     * @en The width of the Rect.
     * @zh 矩形的宽度。
     */
    public declare width: number;

    /**
     * @en The height of the Rect.
     * @zh 矩形的高度。
     */
    public declare height: number;

    /**
     * @en Constructs a Rect from another one.
     * @zh 构造与指定矩形相等的矩形。
     * @param other Specified Rect.
     */
    constructor (other: Rect);

    /**
     * @en Constructs a Rect with specified values.
     * @zh 构造具有指定的最小值和尺寸的矩形。
     * @param x The minimum X coordinate of the rectangle.
     * @param y The minimum Y coordinate of the rectangle.
     * @param width The width of the rectangle, measured from the X position.
     * @param height The height of the rectangle, measured from the Y position.
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
     * @en clone the current Rect.
     * @zh 克隆当前矩形。
     */
    public clone () {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    /**
     * @en Set values with another Rect.
     * @zh 设置当前矩形使其与指定矩形相等。
     * @param other Specified Rect.
     * @returns `this`
     */
    public set (other: Rect);

    /**
     * @en Set the value of each component of the current Rect.
     * @zh 设置当前矩形使其与指定参数的矩形相等。
     * @param x The x parameter of the specified rectangle
     * @param y The y parameter of the specified rectangle
     * @param width The width parameter of the specified rectangle
     * @param height The height parameter of the specified rectangle
     * @returns `this`
     */
    public set (x?: number, y?: number, width?: number, height?: number);

    public set (x?: Rect | number, y?: number, width?: number, height?: number) {
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
        return this;
    }

    /**
     * @en Check whether the current Rect equals another one.
     * @zh 判断当前矩形是否与指定矩形相等。
     * @param other Specified rectangles.
     * @returns Returns `true' when the minimum and maximum values of both rectangles are equal, respectively; otherwise, returns `false'.
     */
    public equals (other: Rect) {
        return this.x === other.x
            && this.y === other.y
            && this.width === other.width
            && this.height === other.height;
    }

    /**
     * @en Calculate the interpolation result between this Rect and another one with given ratio.
     * @zh 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param to Target Rect.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public lerp (to: Rect, ratio: number) {
        const x = this.x;
        const y = this.y;
        const w = this.width;
        const h = this.height;
        this.x = x + (to.x - x) * ratio;
        this.y = y + (to.y - y) * ratio;
        this.width = w + (to.width - w) * ratio;
        this.height = h + (to.height - h) * ratio;

        return this;
    }

    /**
     * @en Return the information of the current rect in string
     * @zh 返回当前矩形的字符串表示。
     * @returns The information of the current rect in string
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.width.toFixed(2)}, ${this.height.toFixed(2)})`;
    }

    /**
     * @en Check whether the current rectangle intersects with the given one.
     * @zh 判断当前矩形是否与指定矩形相交。
     * @param other Specified rectangles.
     * @returns If intersected, return `true', otherwise return `false'.
     */
    public intersects (other: Rect) {
        const maxax = this.x + this.width;
        const maxay = this.y + this.height;
        const maxbx = other.x + other.width;
        const maxby = other.y + other.height;
        return !(maxax < other.x || maxbx < this.x || maxay < other.y || maxby < this.y);
    }

    /**
     * @en Check whether the current rect contains the given point.
     * @zh 判断当前矩形是否包含指定的点。
     * @param point Specified point.
     * @returns The specified point is included in the rectangle and returns `true', otherwise it returns `false'.
     */
    public contains (point: Vec2) {
        return (this.x <= point.x
                && this.x + this.width >= point.x
                && this.y <= point.y
                && this.y + this.height >= point.y);
    }

    /**
     * @en Returns true if the other rect entirely inside this rectangle.
     * @zh 判断当前矩形是否包含指定矩形。
     * @param other Specified rectangles.
     * @returns Returns `true' if all the points of the specified rectangle are included in the current rectangle, `false' otherwise.
     */
    public containsRect (other: Rect) {
        return (this.x <= other.x
                && this.x + this.width >= other.x + other.width
                && this.y <= other.y
                && this.y + this.height >= other.y + other.height);
    }

    /**
     * @en Apply matrix4 to the rect.
     * @zh
     * 应用矩阵变换到当前矩形：
     * 应用矩阵变换到当前矩形的最小点得到新的最小点，
     * 将当前矩形的尺寸视为二维向量应用矩阵变换得到新的尺寸；
     * 并将如此构成的新矩形。
     * @param matrix The matrix4
     */
    public transformMat4 (mat: Mat4) {
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

        this.x = minX;
        this.y = minY;
        this.width = maxX - minX;
        this.height = maxY - minY;

        return this;
    }

    /**
     * @en
     * Applies a matrix transformation to the current rectangle and outputs the result to the four vertices.
     * @zh
     * 应用矩阵变换到当前矩形，并将结果输出到四个顶点上。
     *
     * @param mat The mat4 to apply
     * @param out_lb The left bottom point
     * @param out_lt The left top point
     * @param out_rb The right bottom point
     * @param out_rt The right top point
     */
    public transformMat4ToPoints (mat: Mat4, out_lb: Vec2, out_lt: Vec2, out_rt: Vec2, out_rb: Vec2) {
        const ol = this.x;
        const ob = this.y;
        const or = ol + this.width;
        const ot = ob + this.height;
        out_lb.x = mat.m00 * ol + mat.m04 * ob + mat.m12;
        out_lb.y = mat.m01 * ol + mat.m05 * ob + mat.m13;
        out_rb.x = mat.m00 * or + mat.m04 * ob + mat.m12;
        out_rb.y = mat.m01 * or + mat.m05 * ob + mat.m13;
        out_lt.x = mat.m00 * ol + mat.m04 * ot + mat.m12;
        out_lt.y = mat.m01 * ol + mat.m05 * ot + mat.m13;
        out_rt.x = mat.m00 * or + mat.m04 * ot + mat.m12;
        out_rt.y = mat.m01 * or + mat.m05 * ot + mat.m13;
    }
}

CCClass.fastDefine('cc.Rect', Rect, { x: 0, y: 0, width: 0, height: 0 });

legacyCC.Rect = Rect;

/**
 * @en The convenient method to create a new Rect.
 * @zh 构造与指定矩形相等的矩形。等价于 `new Rect(rect)`。
 * @param rect Specified Rect.
 * @returns `new Rect(rect)`
 */
export function rect (rect: Rect): Rect;

/**
 * @en The convenient method to create a new Rect.
 * @zh 构造具有指定的最小值和尺寸的矩形，等价于`new Rect(x, y, width, height)`。
 * @param x The minimum X coordinate of the rectangle.
 * @param y The minimum Y coordinate of the rectangle.
 * @param width The width of the rectangle, measured from the X position.
 * @param height The height of the rectangle, measured from the Y position.
 * @returns `new Rect(x, y, width, height)`
 */
export function rect (x?: number, y?: number, width?: number, height?: number): Rect;

export function rect (x: Rect | number = 0, y = 0, width = 0, height = 0): Rect {
    return new Rect(x as any, y, width, height);
}

legacyCC.rect = rect;
