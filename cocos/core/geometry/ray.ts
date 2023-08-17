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
import { IVec3Like } from '../math/type-define';

/**
 * @en
 * Basic Geometry: Ray.
 * @zh
 * 基础几何：射线。
 */

export class Ray {
    /**
     * @en
     * Creates a new ray.
     * @zh
     * 创建一条射线。
     * @param {number} ox @en The x component of start point. @zh 起点的 x 部分。
     * @param {number} oy @en The y component of start point. @zh 起点的 y 部分。
     * @param {number} oz @en The z component of start point. @zh 起点的 z 部分。
     * @param {number} dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param {number} dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param {number} dz @en The z component of direction point. @zh 方向的 z 部分。
     * @returns {Ray} @en The created ray object. @zh 新创建的射线。
     */
    public static create (ox = 0, oy = 0, oz = 0, dx = 0, dy = 0, dz = 1): Ray {
        return new Ray(ox, oy, oz, dx, dy, dz);
    }

    /**
     * @en
     * Creates a new ray initialized with the values from an existing ray.
     * @zh
     * 从一条射线克隆出一条新的射线。
     * @param a @en The Ray object to be cloned from. @zh 克隆的目标。
     * @returns @en The cloned Ray object. @zh 克隆出的新对象。
     */
    public static clone (a: Ray): Ray {
        return new Ray(
            a.o.x, a.o.y, a.o.z,
            a.d.x, a.d.y, a.d.z,
        );
    }

    /**
     * @en
     * Copies the values from one ray to another.
     * @zh
     * 复制一个 Ray 的值到另一个 Ray 中。
     * @param out @en The Ray object to copy to. @zh 接受操作的射线。
     * @param a @en The Ray object to copy from. @zh 被复制的射线。
     * @returns @en The Ray object to copy to, same as the `out` parameter. @zh 接受操作的射线，与 `out` 参数相同。
     */
    public static copy (out: Ray, a: Ray): Ray {
        Vec3.copy(out.o, a.o);
        Vec3.copy(out.d, a.d);

        return out;
    }

    /**
     * @en
     * Creates a ray from two points.
     * @zh
     * 用两个点创建一条射线。
     * @param out @en The Ray object. @zh 接受操作的射线。
     * @param origin @en The start point of the ray. @zh 射线的起点。
     * @param target @en The target point on the ray. @zh 射线上的一点。
     * @returns @en The Ray object, same as the `out` parameter. @zh 接受操作的射线，与 `out` 参数相同。
     */
    public static fromPoints (out: Ray, origin: Vec3, target: Vec3): Ray {
        Vec3.copy(out.o, origin);
        Vec3.normalize(out.d, Vec3.subtract(out.d, target, origin));
        return out;
    }

    /**
     * @en
     * Sets the components of a ray to the given values.
     * @zh
     * 将给定射线的属性设置为给定的值。
     * @param out @en The Ray object to be modified @zh 接受操作的射线。
     * @param ox @en The x component of start point. @zh 起点的 x 部分。
     * @param oy @en The y component of start point. @zh 起点的 y 部分。
     * @param oz @en The z component of start point. @zh 起点的 z 部分。
     * @param dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param dz @en The z component of direction point. @zh 方向的 z 部分。
     * @returns @en The Ray object, same as the `out` parameter. @zh 接受操作的射线，与 `out` 相同。
     */
    public static set (out: Ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): Ray {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;

        return out;
    }

    /**
     * @en
     * The origin of the ray.
     * @zh
     * 起点。
     */
    public o: Vec3;

    /**
     * @en
     * The direction of the ray.
     * @zh
     * 方向。
     */
    public d: Vec3;

    /**
     * @en
     * Gets the type of the ray, its value is `enums.SHAPE_RAY`.
     * @zh
     * 获取形状的类型，其值为`enums.SHAPE_RAY`。
     */
    get type (): number {
        return this._type;
    }

    protected readonly _type: number;

    /**
     * @en
     * Constructs a ray.
     * @zh
     * 构造一条射线。
     * @param ox @en The x component of start point. @zh 起点的 x 部分。
     * @param oy @en The y component of start point. @zh 起点的 y 部分。
     * @param oz @en The z component of start point. @zh 起点的 z 部分。
     * @param dx @en The x component of direction point. @zh 方向的 x 部分。
     * @param dy @en The y component of direction point. @zh 方向的 y 部分。
     * @param dz @en The z component of direction point. @zh 方向的 z 部分。
     */
    constructor (ox = 0, oy = 0, oz = 0,
        dx = 0, dy = 0, dz = -1) {
        this._type = enums.SHAPE_RAY;
        this.o = new Vec3(ox, oy, oz);
        this.d = new Vec3(dx, dy, dz);
    }

    /**
     * @en
     * Calculates a point on the ray with the specific distance from the origin point.
     * @zh
     * 根据给定的距离计算出射线上的一点。
     * @param out @en Another point on the ray. @zh 射线上的另一点。
     * @param distance @en The given distance. @zh 给定的距离。
     */
    public computeHit (out: IVec3Like, distance: number): void {
        Vec3.normalize(out, this.d);
        Vec3.scaleAndAdd(out, this.o, out, distance);
    }
}
