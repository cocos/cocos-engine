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
     * @param sx @en Start position x @zh 起点的 x 坐标。
     * @param sy @en Start position y @zh 起点的 y 坐标。
     * @param sz @en Start position z @zh 起点的 z 坐标。
     * @param ex @en End position x @zh 终点的 x 坐标。
     * @param ey @en End position y @zh 终点的 y 坐标。
     * @param ez @en End position z @zh 终点的 z 坐标。
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
     * @param a @en The line to clone from @zh 克隆的来源 Line 对象。
     * @return @en The new line cloned @zh 克隆出的新 Line 对象
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
     * @param out @en The output line to store the copied data @zh 用来存储拷贝数据的 Line 对象
     * @param a @en The line to copy from @zh 从这个 Line 对象拷贝信息。
     * @return @en The out object @zh 会直接返回传入的 out 对象
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
     * @param out @en The output line @zh 接受新数据的 Line 对象
     * @param start @en The start point @zh 起点
     * @param end @en The end point @zh 终点
     * @return @en The out object @zh 会直接返回传入的 out 对象
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
     * @param out @en The output line to set properties to @zh 接受新数据的 Line 对象
     * @param sx @en Start position x @zh 起点到 x 坐标
     * @param sy @en Start position y @zh 起点到 y 坐标
     * @param sz @en Start position z @zh 起点到 z 坐标
     * @param ex @en End position x @zh 终点到 x 坐标
     * @param ey @en End position y @zh 终点到 y 坐标
     * @param ez @en End position z @zh 终点到 z 坐标
     * @return @en The out object @zh 会直接返回传入的 out 对象
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
     * @en Calculate the length of the given line
     * @zh 计算线的长度。
     * @param a @en The line @zh 用于计算长度的线段
     * @return @en The length of the given line @zh 线段的长度
     */
    public static len (a: Line) {
        return Vec3.distance(a.s, a.e);
    }

    /**
     * @en Start point
     * @zh 起点。
     */
    public s: Vec3;

    /**
     * @en End point
     * @zh 终点。
     */
    public e: Vec3;

    /**
     * @en Gets the type of the shape.
     * @zh 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    private readonly _type: number;

    /**
     * @en Constructor of the line
     * @zh 构造一条线。
     * @param sx @en Start position x @zh 起点的 x 坐标
     * @param sy @en Start position y @zh 起点的 y 坐标
     * @param sz @en Start position z @zh 起点的 z 坐标
     * @param ex @en End position x @zh 终点的 x 坐标
     * @param ey @en End position y @zh 终点的 y 坐标
     * @param ez @en End position z @zh 终点的 z 坐标
     */
    constructor (sx = 0, sy = 0, sz = 0, ex = 0, ey = 0, ez = -1) {
        this._type = enums.SHAPE_LINE;
        this.s = new Vec3(sx, sy, sz);
        this.e = new Vec3(ex, ey, ez);
    }

    /**
     * @en Calculate the length of the line
     * @zh 计算线的长度。
     * @return @en The length @zh 线段的长度
     */
    public length () {
        return Vec3.distance(this.s, this.e);
    }
}
