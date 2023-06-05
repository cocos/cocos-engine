/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { Vec3 } from '../math';
import enums from './enums';

/**
 * @en
 * Basic Geometry: Line.
 * @zh
 * 基础几何：直线。
 */
export class Line {
    /**
     * @en
     * Creates a new line.
     * @zh
     * 创建一条新的直线。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     * @returns @en The created line. @zh 创建的直线。
     */
    public static create (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line {
        return new Line(sx, sy, sz, ex, ey, ez);
    }

    /**
     * @en
     * Creates a new Line initialized with values from an existing Line.
     * @zh
     * 克隆一条新的直线。
     * @param a @en The line to clone from. @zh 克隆的来源 Line 对象。
     * @returns @en The cloned line. @zh 克隆出的新 Line 对象。
     */
    public static clone (a: Line): Line {
        return new Line(
            a.s.x, a.s.y, a.s.z,
            a.e.x, a.e.y, a.e.z,
        );
    }

    /**
     * @en
     * Copies the values from one Line to another.
     * @zh
     * 复制一条直线的值到另一条直线中。
     * @param out @en The output line to store the copied data. @zh 用来存储拷贝数据的 Line 对象。
     * @param a @en The line to copy from. @zh 从这个 Line 对象拷贝信息。
     * @returns @en The `out` parameter. @zh 传入的 `out` 对象。
     */
    public static copy (out: Line, a: Line): Line {
        Vec3.copy(out.s, a.s);
        Vec3.copy(out.e, a.e);

        return out;
    }

    /**
     * @en
     * Creates a line from two points.
     * @zh
     * 用两个点创建一条直线。
     * @param out @en The output line. @zh 接受新数据的 Line 对象。
     * @param start @en The start point. @zh 起点。
     * @param end @en The end point. @zh 终点。
     * @returns @en The `out` parameter. @zh 传入的 out 对象。
     */
    public static fromPoints (out: Line, start: Vec3, end: Vec3): Line {
        Vec3.copy(out.s, start);
        Vec3.copy(out.e, end);
        return out;
    }

    /**
     * @en
     * Sets the start point and the end point of a line with the given values.
     * @zh
     * 将给定线段的起点和终点设置为给定值。
     * @param out @en The output line to set properties. to @zh 接受新数据的 Line 对象。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     * @returns @en The `out` parameter. @zh 传入的 `out` 对象。
     */
    public static set (out: Line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number): Line {
        out.s.x = sx;
        out.s.y = sy;
        out.s.z = sz;
        out.e.x = ex;
        out.e.y = ey;
        out.e.z = ez;

        return out;
    }

    /**
     * @en Calculates the length of the given line.
     * @zh 计算线的长度。
     * @param a @en The line to calculate length. @zh 用于计算长度的线段。
     * @returns @en The length of the given line. @zh 线段的长度。
     */
    public static len (a: Line): number {
        return Vec3.distance(a.s, a.e);
    }

    /**
     * @en The start point.
     * @zh 起点。
     */
    public s: Vec3;

    /**
     * @en The end point.
     * @zh 终点。
     */
    public e: Vec3;

    /**
     * @en Gets the type of the shape. Always returns `enums.SHAPE_LINE`.
     * @zh 获取形状的类型，总是返回 `enums.SHAPE_LINE`。
     */
    get type (): number {
        return this._type;
    }

    private readonly _type: number;

    /**
     * @en Constructs a line.
     * @zh 构造一条线。
     * @param sx @en The x coordinate of the start position. @zh 起点的 x 坐标。
     * @param sy @en The y coordinate of the start position. @zh 起点的 y 坐标。
     * @param sz @en The z coordinate of the start position. @zh 起点的 z 坐标。
     * @param ex @en The x coordinate of the end position. @zh 终点的 x 坐标。
     * @param ey @en The y coordinate of the end position. @zh 终点的 y 坐标。
     * @param ez @en the z coordinate of the end position. @zh 终点的 z 坐标。
     */
    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = new Vec3(sx, sy, sz);
        this.e = new Vec3(ex, ey, ez);
    }

    /**
     * @en Calculates the length of the line.
     * @zh 计算线段的长度。
     * @returns @en The length of the line. @zh 线段的长度。
     */
    public length (): number {
        return Vec3.distance(this.s, this.e);
    }
}
