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

import { CCClass } from '../data/class';
import { ValueType } from '../value-types/value-type';
import { Mat4 } from './mat4';
import { Size } from './size';
import { IRectLike, IVec2Like } from './type-define';
import { Vec2 } from './vec2';
import { legacyCC } from '../global-exports';

/**
 * 轴对齐矩形。
 * 矩形内的所有点都大于等于矩形的最小点 (xMin, yMin) 并且小于等于矩形的最大点 (xMax, yMax)。
 * 矩形的宽度定义为 xMax - xMin；高度定义为 yMax - yMin。
 */
export class Rect extends ValueType {
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
     * 获取或设置矩形在 x 轴上的最小值。
     */
    get xMin () {
        return this.v[0];
    }

    set xMin (value) {
        this.v[2] += this.v[0] - value;
        this.v[0] = value;
    }

    /**
     * 获取或设置矩形在 y 轴上的最小值。
     */
    get yMin () {
        return this.v[1];
    }

    set yMin (value) {
        this.v[3] += this.v[1] - value;
        this.v[1] = value;
    }

    /**
     * 获取或设置矩形在 x 轴上的最大值。
     */
    get xMax () {
        return this.v[0] + this.v[2];
    }

    set xMax (value) {
        this.v[2] = value - this.v[0];
    }

    /**
     * 获取或设置矩形在 y 轴上的最大值。
     */
    get yMax () {
        return this.v[1] + this.v[3];
    }

    set yMax (value) {
        this.v[3] = value - this.v[1];
    }

    /**
     * 获取或设置矩形中心点的坐标。
     */
    get center () {
        return new Vec2(this.v[0] + this.v[2] * 0.5,
            this.v[1] + this.v[3] * 0.5);
    }

    set center (value) {
        this.v[0] = value.x - this.v[2] * 0.5;
        this.v[1] = value.y - this.v[3] * 0.5;
    }

    /**
     * 获取或设置矩形最小点的坐标。
     */
    get origin () {
        return new legacyCC.Vec2(this.v[0], this.v[1]);
    }

    set origin (value) {
        this.v[0] = value.x;
        this.v[1] = value.y;
    }

    /**
     * 获取或设置矩形的尺寸。
     */
    get size () {
        return new Size(this.v[2], this.v[3]);
    }

    set size (value) {
        this.v[2] = value.width;
        this.v[3] = value.height;
    }

    /**
     * 获取或设置矩形最小点的 x 坐标。
     */
    public get x (): number {
        return this.v[0];
    }
    public set x (val: number){
        this.v[0] = val;
    }

    /**
     * 获取或设置矩形最小点的 y 坐标。
     */
    public get y (): number {
        return this.v[1];
    }
    public set y (val: number){
        this.v[1] = val;
    }

    /**
     * 获取或设置矩形的宽度。
     */
    public get width (): number {
        return this.v[2];
    }
    public set width (val: number){
        this.v[2] = val;
    }
    // compatibility with vector interfaces
    public get z (): number { return this.v[2]; }
    public set z (val: number) { this.v[2] = val; }

    /**
     * 获取或设置矩形的高度。
     */
    public get height (): number {
        return this.v[3];
    }
    public set height (val: number){
        this.v[3] = val;
    }
    // compatibility with vector interfaces
    public get w (): number { return this.v[3]; }
    public set w (val: number) { this.v[3] = val; }

    /**
     * @en Get the internal data in rect.
     * @zh 获取 Rect 的内部数据。
     */
    public declare v: Float32Array;

    /**
     * 构造与指定矩形相等的矩形。
     * @param x 相比较的矩形。
     */
    constructor (x: Rect | Float32Array);

    /**
     * 构造具有指定的最小值和尺寸的矩形。
     * @param x 矩形在 x 轴上的最小值。
     * @param y 矩形在 y 轴上的最小值。
     * @param width 矩形的宽度。
     * @param height 矩形的高度。
     */
    constructor (x?: number, y?: number, width?: number, height?: number);

    constructor (x?: Rect | number | Float32Array, y?: number, width?: number, height?: number) {
        super();
        if (x && typeof x === 'object') {
            if (ArrayBuffer.isView(x)) {
                this.v = x;
            } else {
                const v = x.v;
                this.v = new Float32Array(4);
                this.v[0] = v[0];
                this.v[1] = v[1];
                this.v[2] = v[2];
                this.v[3] = v[3];
            }
        } else {
            this.v = new Float32Array(4);
            this.v[0] = x || 0;
            this.v[1] = y || 0;
            this.v[2] = width || 0;
            this.v[3] = height || 0;
        }
    }

    /**
     * 克隆当前矩形。
     */
    public clone () {
        return new Rect(this.v[0], this.v[1], this.v[2], this.v[3]);
    }

    /**
     * 设置当前矩形使其与指定矩形相等。
     * @param other 相比较的矩形。
     * @returns `this`
     */
    public set (other: Rect);

    /**
     * 设置当前矩形使其与指定参数的矩形相等。
     * @param x 指定矩形的 x 参数
     * @param y 指定矩形的 y 参数
     * @param width 指定矩形的 width 参数
     * @param height 指定矩形的 height 参数
     * @returns `this`
     */
    public set (x?: number, y?: number, width?: number, height?: number);

    public set (x?: Rect | number, y?: number, width?: number, height?: number) {
        if (x && typeof x === 'object') {
            this.v[0] = x.v[0];
            this.v[1] = x.v[1];
            this.v[2] = x.v[2];
            this.v[3] = x.v[3];
        } else {
            this.v[0] = x || 0;
            this.v[1] = y || 0;
            this.v[2] = width || 0;
            this.v[3] = height || 0;
        }
        return this;
    }

    /**
     * 判断当前矩形是否与指定矩形相等。
     * @param other 相比较的矩形。
     * @returns 两矩阵的最小值和最大值都分别相等时返回 `true`；否则返回 `false`。
     */
    public equals (other: Rect) {
        return this.v[0] === other.v[0] &&
            this.v[1] === other.v[1] &&
            this.v[2] === other.v[2] &&
            this.v[3] === other.v[3];
    }

    /**
     * 根据指定的插值比率，从当前矩形到目标矩形之间做插值。
     * @param to 目标矩形。
     * @param ratio 插值比率，范围为 [0,1]。
     */
    public lerp (to: Rect, ratio: number) {
        const x = this.v[0];
        const y = this.v[1];
        const w = this.v[2];
        const h = this.v[3];
        this.v[0] = x + (to.v[0] - x) * ratio;
        this.v[1] = y + (to.v[1] - y) * ratio;
        this.v[2] = w + (to.v[2] - w) * ratio;
        this.v[3] = h + (to.v[3] - h) * ratio;

        return this;
    }

    /**
     * 返回当前矩形的字符串表示。
     * @returns 当前矩形的字符串表示。
     */
    public toString () {
        return `(${this.v[0].toFixed(2)}, ${this.v[1].toFixed(2)}, ${this.v[2].toFixed(2)}, ${this.v[3].toFixed(2)})`;
    }

    /**
     * 判断当前矩形是否与指定矩形相交。
     * @param other 相比较的矩形。
     * @returns 相交则返回 `true`，否则返回 `false`。
     */
    public intersects (other: Rect) {
        const maxax = this.v[0] + this.v[2];
        const maxay = this.v[1] + this.v[3];
        const maxbx = other.v[0] + other.v[2];
        const maxby = other.v[1] + other.v[3];
        return !(maxax < other.v[0] || maxbx < this.v[0] || maxay < other.v[1] || maxby < this.v[1]);
    }

    /**
     * 判断当前矩形是否包含指定的点。
     * @param point 指定的点。
     * @returns 指定的点包含在矩形内则返回 `true`，否则返回 `false`。
     */
    public contains (point: Vec2) {
        return (this.v[0] <= point.v[0] &&
                this.v[0] + this.v[2] >= point.v[0] &&
                this.v[1] <= point.v[1] &&
                this.v[1] + this.v[3] >= point.v[1]);
    }

    /**
     * 判断当前矩形是否包含指定矩形。
     * @param other 指定的矩形。
     * @returns 指定矩形所有的点都包含在当前矩形内则返回 `true`，否则返回 `false`。
     */
    public containsRect (other: Rect) {
        return (this.v[0] <= other.v[0] &&
                this.v[0] + this.v[2] >= other.v[0] + other.v[2] &&
                this.v[1] <= other.v[1] &&
                this.v[1] + this.v[3] >= other.v[1] + other.v[3]);
    }

    /**
     * 应用矩阵变换到当前矩形：
     * 应用矩阵变换到当前矩形的最小点得到新的最小点，
     * 将当前矩形的尺寸视为二维向量应用矩阵变换得到新的尺寸；
     * 并将如此构成的新矩形。
     * @param matrix 变换矩阵。
     */
    public transformMat4 (mat: Mat4) {
        const ol = this.v[0];
        const ob = this.v[1];
        const or = ol + this.v[2];
        const ot = ob + this.v[3];
        const v = mat.v;
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

        this.v[0] = minX;
        this.v[1] = minY;
        this.v[2] = maxX - minX;
        this.v[3] = maxY - minY;

        return this;
    }
}

CCClass.fastDefine('cc.Rect', Rect, { x: 0, y: 0, width: 0, height: 0 });

legacyCC.Rect = Rect;

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

legacyCC.rect = rect;
