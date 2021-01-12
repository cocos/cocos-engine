/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */

/**
 * @packageDocumentation
 * @module geometry
 */

import { Vec3 } from '../math';
import enums from './enums';

/**
 * @en
 * Basic Geometry: Line.
 * @zh
 * 基础几何 line。
 */

export class Line {
    /**
     * @en
     * create a new line
     * @zh
     * 创建一个新的 line。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return
     */
    public static create (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        return new Line(sx, sy, sz, ex, ey, ez);
    }

    /**
     * @en
     * Creates a new Line initialized with values from an existing Line
     * @zh
     * 克隆一个新的 line。
     * @param a 克隆的来源。
     * @return 克隆出的对象。
     */
    public static clone (a: Line) {
        return new Line(
            a.s.x, a.s.y, a.s.z,
            a.e.x, a.e.y, a.e.z,
        );
    }

    /**
     * @en
     * Copy the values from one Line to another
     * @zh
     * 复制一个线的值到另一个。
     * @param out 接受操作的对象。
     * @param a 复制的来源。
     * @return 接受操作的对象。
     */
    public static copy (out: Line, a: Line) {
        Vec3.copy(out.s, a.s);
        Vec3.copy(out.e, a.e);

        return out;
    }

    /**
     * @en
     * create a line from two points
     * @zh
     * 用两个点创建一个线。
     * @param out 接受操作的对象。
     * @param start 起点。
     * @param end 终点。
     * @return out 接受操作的对象。
     */
    public static fromPoints (out: Line, start: Vec3, end: Vec3) {
        Vec3.copy(out.s, start);
        Vec3.copy(out.e, end);
        return out;
    }

    /**
     * @en
     * Set the components of a Vec3 to the given values
     * @zh
     * 将给定线的属性设置为给定值。
     * @param out 接受操作的对象。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     * @return out 接受操作的对象。
     */
    public static set (out: Line, sx: number, sy: number, sz: number, ex: number, ey: number, ez: number) {
        out.s.x = sx;
        out.s.y = sy;
        out.s.z = sz;
        out.e.x = ex;
        out.e.y = ey;
        out.e.z = ez;

        return out;
    }

    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */
    public static len (a: Line) {
        return Vec3.distance(a.s, a.e);
    }

    /**
     * @zh
     * 起点。
     */
    public s: Vec3;

    /**
     * @zh
     * 终点。
     */
    public e: Vec3;

    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    private readonly _type: number;

    /**
     * 构造一条线。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     */
    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = new Vec3(sx, sy, sz);
        this.e = new Vec3(ex, ey, ez);
    }

    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */
    public length () {
        return Vec3.distance(this.s, this.e);
    }
}
