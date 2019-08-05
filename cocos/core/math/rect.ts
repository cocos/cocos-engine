/*
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
*/

/**
 * @category core/math
 */

import CCClass from '../data/class';
import { Mat4 } from './mat4';
import { Size } from './size';
import { IRectLike, IVec2Like } from './type-define';
import { ValueType } from '../value-types/value-type';
import { Vec2 } from './vec2';

let _x: number = 0.0;
let _y: number = 0.0;
let _w: number = 0.0;
let _h: number = 0.0;

/**
 * 轴对齐矩形。
 * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
 * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
 */
export class Rect extends ValueType {
    /**
     * 获取或设置矩形在 x 轴上的最小值。
     */
    get xMin () {
        return this.x;
    }

    set xMin (value) {
        this.width += this.x - value;
        this.x = value;
    }

    /**
     * 获取或设置矩形在 y 轴上的最小值。
     */
    get yMin () {
        return this.y;
    }

    set yMin (value) {
        this.height += this.y - value;
        this.y = value;
    }

    /**
     * 获取或设置矩形在 x 轴上的最大值。
     */
    get xMax () {
        return this.x + this.width;
    }

    set xMax (value) {
        this.width = value - this.x;
    }

    /**
     * 获取或设置矩形在 y 轴上的最大值。
     */
    get yMax () {
        return this.y + this.height;
    }

    set yMax (value) {
        this.height = value - this.y;
    }

    /**
     * 获取或设置矩形中心点的坐标。
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
     * 获取或设置矩形最小点的坐标。
     */
    get origin () {
        return new cc.Vec2(this.x, this.y);
    }

    set origin (value) {
        this.x = value.x;
        this.y = value.y;
    }

    /**
     * 获取或设置矩形的尺寸。
     */
    get size () {
        return new Size(this.width, this.height);
    }

    set size (value) {
        this.width = value.width;
        this.height = value.height;
    }

    /**
     * 由任意两个点创建一个矩形，目标矩形即是这两个点各向 x、y 轴作线所得到的矩形。
     * @param v1 指定的点。
     * @param v2 指定的点。
     * @returns 目标矩形。
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
     * 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param out 本方法将插值结果赋值给此参数
     * @param from 起始矩形。
     * @param to 目标矩形。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public static lerp <Out extends IRectLike> (out: Out, from: Out, to: Out, ratio: number) {
        _x = from.x;
        _y = from.y;
        _w = from.width;
        _h = from.height;
        out.x = _x + (to.x - _x) * ratio;
        out.y = _y + (to.y - _y) * ratio;
        out.width = _w + (to.width - _w) * ratio;
        out.height = _h + (to.height - _h) * ratio;

        return out;
    }

    /**
     * 计算当前矩形与指定矩形重叠部分的矩形，将其赋值给出口矩形。
     * @param out 出口矩形。
     * @param one 指定的一个矩形。
     * @param other 指定的另一个矩形。
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
     * 创建同时包含当前矩形和指定矩形的最小矩形，将其赋值给出口矩形。
     * @param out 出口矩形。
     * @param one 指定的一个矩形。
     * @param other 指定的另一个矩形。
     */
    public static union <Out extends IRectLike> (out: Out, one: Out, other: Out) {
        _x = one.x;
        _y = one.y;
        _w = one.width;
        _h = one.height;
        const bx = other.x;
        const by = other.y;
        const bw = other.width;
        const bh = other.height;
        out.x = Math.min(_x, bx);
        out.y = Math.min(_y, by);
        out.width = Math.max(_x + _w, bx + bw) - out.x;
        out.height = Math.max(_y + _h, by + bh) - out.y;

        return out;
    }

    /**
     * 获取或设置矩形最小点的 x 坐标。
     */
    public x: number;

    /**
     * 获取或设置矩形最小点的 y 坐标。
     */
    public y: number;

    /**
     * 获取或设置矩形的宽度。
     */
    public width: number;

    /**
     * 获取或设置矩形的高度。
     */
    public height: number;

    /**
     * 构造与指定矩形相等的矩形。
     * @param other 相比较的矩形。
     */
    constructor (other: Rect);

    /**
     * 构造具有指定的最小值和尺寸的矩形。
     * @param x 矩形在 x 轴上的最小值。
     * @param y 矩形在 y 轴上的最小值。
     * @param width 矩形的宽度。
     * @param height 矩形的高度。
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
     * 克隆当前矩形。
     */
    public clone () {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    public set (other: Rect);
    public set (x?: number, y?: number, width?: number, height?: number);
    /**
     * 设置当前矩形使其与指定矩形相等。
     * @param other 相比较的矩形。
     * @returns `this`
     */
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
     * 判断当前矩形是否与指定矩形相等。
     * @param other 相比较的矩形。
     * @returns 两矩阵的最小值和最大值都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Rect) {
        return this.x === other.x &&
            this.y === other.y &&
            this.width === other.width &&
            this.height === other.height;
    }

    /**
     * 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param to 目标矩形。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Rect, ratio: number) {
        _x = this.x;
        _y = this.y;
        _w = this.width;
        _h = this.height;
        this.x = _x + (to.x - _x) * ratio;
        this.y = _y + (to.y - _y) * ratio;
        this.width = _w + (to.width - _w) * ratio;
        this.height = _h + (to.height - _h) * ratio;

        return this;
    }

    /**
     * 返回当前矩形的字符串表示。
     * @returns 当前矩形的字符串表示。
     */
    public toString () {
        return `(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.width.toFixed(2)}, ${this.height.toFixed(2)})`;
    }

    /**
     * 判断当前矩形是否与指定矩形相交。
     * @param other 相比较的矩形。
     * @returns 相交则返回 `true`，否则返回 `false`。
     */
    public intersects (other: Rect) {
        const maxax = this.x + this.width;
        const maxay = this.y + this.height;
        const maxbx = other.x + other.width;
        const maxby = other.y + other.height;
        return !(maxax < other.x || maxbx < this.x || maxay < other.y || maxby < this.y);
    }

    /**
     * 判断当前矩形是否包含指定的点。
     * @param point 指定的点。
     * @returns 指定的点包含在矩形内则返回 `true`，否则返回 `false`。
     */
    public contains (point: Vec2) {
        return (this.x <= point.x &&
                this.x + this.width >= point.x &&
                this.y <= point.y &&
                this.y + this.height >= point.y);
    }

    /**
     * 判断当前矩形是否包含指定矩形。
     * @param other 指定的矩形。
     * @returns 指定矩形所有的点都包含在当前矩形内则返回 `true`，否则返回 `false`。
     */
    public containsRect (other: Rect) {
        return (this.x <= other.x &&
                this.x + this.width >= other.x + other.width &&
                this.y <= other.y &&
                this.y + this.height >= other.y + other.height);
    }

    /**
     * 应用矩阵变换到当前矩形：
     * 应用矩阵变换到当前矩形的最小点得到新的最小点，
     * 将当前矩形的尺寸视为二维向量应用矩阵变换得到新的尺寸；
     * 并将如此构成的新矩形。
     * @param matrix 变换矩阵。
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
}

CCClass.fastDefine('cc.Rect', Rect, { x: 0, y: 0, width: 0, height: 0 });

cc.Rect = Rect;

/**
 * 构造与指定矩形相等的矩形。等价于 `new Rect(rect)`。
 * @param rect 相比较的矩形。
 * @returns `new Rect(rect)`
 */
export function rect (rect: Rect): Rect;

/**
 * 构造具有指定的最小值和尺寸的矩形，等价于`new Rect(x, y, width, height)`。
 * @param x 矩形在 x 轴上的最小值。
 * @param y 矩形在 y 轴上的最小值。
 * @param width 矩形的宽度。
 * @param height 矩形的高度。
 * @returns `new Rect(x, y, width, height)`
 */
export function rect (x?: number, y?: number, width?: number, height?: number): Rect;

export function rect (x: Rect | number = 0, y: number = 0, width: number = 0, height: number = 0): Rect {
    return new Rect(x as any, y, width, height);
}

cc.rect = rect;
