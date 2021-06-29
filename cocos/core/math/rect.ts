/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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
*/

/**
 * @packageDocumentation
 * @module core/math
 */

import { CCClass } from '../data/class';
import { Mat4 } from './mat4';
import { Size } from './size';
import { IRectLike, IVec2Like, FloatArray } from './type-define';
import { Vec2 } from './vec2';
import { legacyCC } from '../global-exports';
import { MathBase } from './math-base';

/**
 * @en
 * A 2D rectangle defined by x, y position and width, height.
 * @zh
 * 轴对齐矩形。
 * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
 * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
 */
export class Rect extends MathBase {
    /**
     * @en Creates a rectangle from two coordinate values.
     * @zh 由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形。
     * @param v1 Specified point 1.
     * @param v2 Specified point 2.
     * @returns Target rectangle.
     */
    public static fromMinMax <Out extends IRectLike> (out: Out, v1: Readonly<IVec2Like>, v2: Readonly<IVec2Like>) {
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
    public static lerp <Out extends IRectLike> (out: Out, from: Readonly<IRectLike>, to: Readonly<IRectLike>, ratio: number) {
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
     * @zh 计算当前矩形与指定矩形重叠部分的矩形，将其赋值给出口矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    public static intersection <Out extends IRectLike> (out: Out, one: Readonly<IRectLike>, other: Readonly<IRectLike>) {
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
     * @zh 创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给出口矩形。
     * @param out Output Rect.
     * @param one One of the specify Rect.
     * @param other Another of the specify Rect.
     */
    public static union <Out extends IRectLike> (out: Out, one: Readonly<IRectLike>, other: Readonly<IRectLike>) {
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
        return this._array[0];
    }

    set xMin (value) {
        this._array[2] += this._array[0] - value;
        this._array[0] = value;
    }

    /**
     * @en The minimum y value.
     * @zh 获取或设置矩形在 y 轴上的最小值。
     */
    get yMin () {
        return this._array[1];
    }

    set yMin (value) {
        this._array[3] += this._array[1] - value;
        this._array[1] = value;
    }

    /**
     * @en The maximum x value.
     * @zh 获取或设置矩形在 x 轴上的最大值。
     */
    get xMax () {
        return this._array[0] + this._array[2];
    }

    set xMax (value) {
        this._array[2] = value - this._array[0];
    }

    /**
     * @en The maximum y value.
     * @zh 获取或设置矩形在 y 轴上的最大值。
     */
    get yMax () {
        return this._array[1] + this._array[3];
    }

    set yMax (value) {
        this._array[3] = value - this._array[1];
    }

    /**
     * @en The position of the center of the rectangle.
     * @zh 获取或设置矩形中心点的坐标。
     */
    get center () {
        return new Vec2(this._array[0] + this._array[2] * 0.5,
            this._array[1] + this._array[3] * 0.5);
    }

    set center (value) {
        this._array[0] = value.x - this._array[2] * 0.5;
        this._array[1] = value.y - this._array[3] * 0.5;
    }

    /**
     * @en Returns a new {{Vec2}} object representing the position of the rectangle
     * @zh 获取或设置矩形的 x 和 y 坐标。
     */
    get origin () {
        return new Vec2(this._array[0], this._array[1]);
    }

    set origin (value) {
        this._array[0] = value.x;
        this._array[1] = value.y;
    }

    /**
     * @en Returns a new {{Size}} object represents the width and height of the rectangle
     * @zh 获取或设置矩形的尺寸。
     */
    get size () {
        return new Size(this._array[2], this._array[3]);
    }

    set size (value) {
        this._array[2] = value.width;
        this._array[3] = value.height;
    }

    /**
     * @en The minimum x value.
     * @zh 矩形最小点的 x 坐标。
     */
    public get x (): number {
        return this._array[0];
    }
    public set x (val: number) {
        this._array[0] = val;
    }

    /**
     * @en The minimum y value.
     * @zh 矩形最小点的 y 坐标。
     */
    public get y (): number {
        return this._array[1];
    }
    public set y (val: number) {
        this._array[1] = val;
    }

    /**
     * @en The width of the Rect.
     * @zh 矩形的宽度。
     */
    public get width (): number {
        return this._array[2];
    }
    public set width (val: number) {
        this._array[2] = val;
    }
    // compatibility with vector interfaces
    public get z (): number { return this._array[2]; }
    public set z (val: number) { this._array[2] = val; }

    /**
     * @en The height of the Rect.
     * @zh 矩形的高度。
     */
    public get height (): number {
        return this._array[3];
    }
    public set height (val: number) {
        this._array[3] = val;
    }
    // compatibility with vector interfaces
    public get w (): number { return this._array[3]; }
    public set w (val: number) { this._array[3] = val; }

    /**
     * @en Constructs a Rect from another one.
     * @zh 构造与指定矩形相等的矩形。
     * @param other Specified Rect.
     */
    constructor (x: Readonly<Rect> | FloatArray);

    /**
     * @en Constructs a Rect with specified values.
     * @zh 构造具有指定的最小值和尺寸的矩形。
     * @param x The minimum X coordinate of the rectangle.
     * @param y The minimum Y coordinate of the rectangle.
     * @param width The width of the rectangle, measured from the X position.
     * @param height The height of the rectangle, measured from the Y position.
     */
    constructor (x?: number, y?: number, width?: number, height?: number);

    constructor (x?: Readonly<Rect> | number | FloatArray, y?: number, width?: number, height?: number) {
        super();
        if (x && typeof x === 'object') {
            if (ArrayBuffer.isView(x)) {
                this._array = x;
                this._array.fill(0);
            } else {
                const v = x.array;
                this._array = MathBase.createFloatArray(4);
                this._array[0] = v[0];
                this._array[1] = v[1];
                this._array[2] = v[2];
                this._array[3] = v[3];
            }
        } else {
            this._array = MathBase.createFloatArray(4);
            this._array[0] = x || 0;
            this._array[1] = y || 0;
            this._array[2] = width || 0;
            this._array[3] = height || 0;
        }
    }

    /**
     * @en clone the current Rect.
     * @zh 克隆当前矩形。
     */
    public clone () {
        return new Rect(this._array[0], this._array[1], this._array[2], this._array[3]);
    }

    /**
     * @en Set values with another Rect.
     * @zh 设置当前矩形使其与指定矩形相等。
     * @param other Specified Rect.
     * @returns `this`
     */
    public set (other: Readonly<Rect>);

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

    public set (x?: Readonly<Rect> | number, y?: number, width?: number, height?: number) {
        if (x && typeof x === 'object') {
            const v = x.array;
            this._array[0] = v[0];
            this._array[1] = v[1];
            this._array[2] = v[2];
            this._array[3] = v[3];
        } else {
            this._array[0] = x || 0;
            this._array[1] = y || 0;
            this._array[2] = width || 0;
            this._array[3] = height || 0;
        }
        return this;
    }

    /**
     * @en Check whether the current Rect equals another one.
     * @zh 判断当前矩形是否与指定矩形相等。
     * @param other Specified rectangles.
     * @returns Returns `true' when the minimum and maximum values of both rectangles are equal, respectively; otherwise, returns `false'.
     */
    public equals (other: Readonly<Rect>) {
        const v = other.array;
        return this._array[0] === v[0]
            && this._array[1] === v[1]
            && this._array[2] === v[2]
            && this._array[3] === v[3];
    }

    /**
     * @en Calculate the interpolation result between this Rect and another one with given ratio.
     * @zh 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param to Target Rect.
     * @param ratio The interpolation coefficient.The range is [0,1].
     */
    public lerp (to: Readonly<Rect>, ratio: number) {
        const x = this._array[0];
        const y = this._array[1];
        const w = this._array[2];
        const h = this._array[3];
        const v = to.array;
        this._array[0] = x + (v[0] - x) * ratio;
        this._array[1] = y + (v[1] - y) * ratio;
        this._array[2] = w + (v[2] - w) * ratio;
        this._array[3] = h + (v[3] - h) * ratio;

        return this;
    }

    /**
     * @en Return the information of the current rect in string
     * @zh 返回当前矩形的字符串表示。
     * @returns The information of the current rect in string
     */
    public toString () {
        return `(${this._array[0].toFixed(2)}, ${this._array[1].toFixed(2)}, ${this._array[2].toFixed(2)}, ${this._array[3].toFixed(2)})`;
    }

    /**
     * @en Check whether the current rectangle intersects with the given one.
     * @zh 判断当前矩形是否与指定矩形相交。
     * @param other Specified rectangles.
     * @returns If intersected, return `true', otherwise return `false'.
     */
    public intersects (other: Readonly<Rect>) {
        const maxax = this._array[0] + this._array[2];
        const maxay = this._array[1] + this._array[3];
        const v = other.array;
        const maxbx = v[0] + v[2];
        const maxby = v[1] + v[3];
        return !(maxax < v[0] || maxbx < this._array[0] || maxay < v[1] || maxby < this._array[1]);
    }

    /**
     * @en Check whether the current rect contains the given point.
     * @zh 判断当前矩形是否包含指定的点。
     * @param point Specified point.
     * @returns The specified point is included in the rectangle and returns `true', otherwise it returns `false'.
     */
    public contains (point: Readonly<Vec2>) {
        const v = point.array;
        return (this._array[0] <= v[0]
                && this._array[0] + this._array[2] >= v[0]
                && this._array[1] <= v[1]
                && this._array[1] + this._array[3] >= v[1]);
    }

    /**
     * @en Returns true if the other rect entirely inside this rectangle.
     * @zh 判断当前矩形是否包含指定矩形。
     * @param other Specified rectangles.
     * @returns Returns `true' if all the points of the specified rectangle are included in the current rectangle, `false' otherwise.
     */
    public containsRect (other: Readonly<Rect>) {
        const v = other.array;
        return (this._array[0] <= v[0]
                && this._array[0] + this._array[2] >= v[0] + v[2]
                && this._array[1] <= v[1]
                && this._array[1] + this._array[3] >= v[1] + v[3]);
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
    public transformMat4 (mat: Readonly<Mat4>) {
        const ol = this._array[0];
        const ob = this._array[1];
        const or = ol + this._array[2];
        const ot = ob + this._array[3];
        const v = mat.array;
        const lbx = v[0] * ol + v[4] * ob + v[12];
        const lby = v[1] * ol + v[5] * ob + v[13];
        const rbx = v[0] * or + v[4] * ob + v[12];
        const rby = v[1] * or + v[5] * ob + v[13];
        const ltx = v[0] * ol + v[4] * ot + v[12];
        const lty = v[1] * ol + v[5] * ot + v[13];
        const rtx = v[0] * or + v[4] * ot + v[12];
        const rty = v[1] * or + v[5] * ot + v[13];

        const minX = Math.min(lbx, rbx, ltx, rtx);
        const maxX = Math.max(lbx, rbx, ltx, rtx);
        const minY = Math.min(lby, rby, lty, rty);
        const maxY = Math.max(lby, rby, lty, rty);

        this._array[0] = minX;
        this._array[1] = minY;
        this._array[2] = maxX - minX;
        this._array[3] = maxY - minY;

        return this;
    }

    /**
     * 应用矩阵变换到当前矩形，并将结果输出到四个顶点上。
     */
    public transformMat4ToPoints (mat: Readonly<Mat4>, out_lb: Vec2, out_lt: Vec2, out_rt: Vec2, out_rb: Vec2) {
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
CCClass.enumerableProps(Rect.prototype, ['x', 'y', 'z', 'w', 'width', 'height', 'xMin', 'yMin', 'xMax', 'yMax']);
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
