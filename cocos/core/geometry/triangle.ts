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
 * Basic Geometry: Triangle.
 * @zh
 * 基础几何 三角形。
 */

export class Triangle {
    /**
     * @en
     * create a new triangle
     * @zh
     * 创建一个新的 triangle。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     * @return {Triangle} 一个新的 triangle。
     */
    public static create (ax = 1, ay = 0, az = 0,
        bx = 0, by = 0, bz = 0,
        cx = 0, cy = 0, cz = 1): Triangle {
        return new Triangle(ax, ay, az, bx, by, bz, cx, cy, cz);
    }

    /**
     * @en
     * clone a new triangle
     * @zh
     * 克隆一个新的 triangle。
     * @param {Triangle} t 克隆的目标。
     * @return {Triangle} 克隆出的新对象。
     */
    public static clone (t: Triangle): Triangle {
        return new Triangle(
            t.a.x, t.a.y, t.a.z,
            t.b.x, t.b.y, t.b.z,
            t.c.x, t.c.y, t.c.z,
        );
    }

    /**
     * @en
     * copy the values from one triangle to another
     * @zh
     * 将一个 triangle 的值复制到另一个 triangle。
     * @param {Triangle} out 接受操作的 triangle。
     * @param {Triangle} t 被复制的 triangle。
     * @return {Triangle} out 接受操作的 triangle。
     */
    public static copy (out: Triangle, t: Triangle): Triangle {
        Vec3.copy(out.a, t.a);
        Vec3.copy(out.b, t.b);
        Vec3.copy(out.c, t.c);

        return out;
    }

    /**
     * @en
     * Create a triangle from three points
     * @zh
     * 用三个点创建一个 triangle。
     * @param {Triangle} out 接受操作的 triangle。
     * @param {Vec3} a a 点。
     * @param {Vec3} b b 点。
     * @param {Vec3} c c 点。
     * @return {Triangle} out 接受操作的 triangle。
     */
    public static fromPoints (out: Triangle, a: Vec3, b: Vec3, c: Vec3): Triangle {
        Vec3.copy(out.a, a);
        Vec3.copy(out.b, b);
        Vec3.copy(out.c, c);
        return out;
    }

    /**
     * @en
     * Set the components of a triangle to the given values
     * @zh
     * 将给定三角形的属性设置为给定值。
     * @param {Triangle} out 给定的三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     * @return {Triangle}
     * @function
     */
    public static set (out: Triangle,
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number,
        cx: number, cy: number, cz: number): Triangle {
        out.a.x = ax;
        out.a.y = ay;
        out.a.z = az;

        out.b.x = bx;
        out.b.y = by;
        out.b.z = bz;

        out.c.x = cx;
        out.c.y = cy;
        out.c.z = cz;

        return out;
    }

    /**
     * @en
     * Point a.
     * @zh
     * 点 a。
     */
    public a: Vec3;

    /**
     * @en
     * Point b.
     * @zh
     * 点 b。
     */
    public b: Vec3;

    /**
     * @en
     * Point c.
     * @zh
     * 点 c。
     */
    public c: Vec3;

    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    protected readonly _type: number;

    /**
     * @en
     * Construct a triangle.
     * @zh
     * 构造一个三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     */
    constructor (ax = 0, ay = 0, az = 0,
        bx = 1, by = 0, bz = 0,
        cx = 0, cy = 1, cz = 0) {
        this._type = enums.SHAPE_TRIANGLE;
        this.a = new Vec3(ax, ay, az);
        this.b = new Vec3(bx, by, bz);
        this.c = new Vec3(cx, cy, cz);
    }
}
