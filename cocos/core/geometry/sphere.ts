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

import { Mat4, Quat, Vec3 } from '../math';
import enums from './enums';
import { AABB } from './aabb';

const _v3_tmp = new Vec3();
const _offset = new Vec3();
const _min = new Vec3();
const _max = new Vec3();
function maxComponent (v: Vec3): number { return Math.max(Math.max(v.x, v.y), v.z); }

/**
 * @en
 * Basic Geometry: Sphere.
 * @zh
 * 基础几何：球。
 */

export class Sphere {
    /**
     * @en
     * Creates a new sphere instance.
     * @zh
     * 创建一个新的球实例。
     * @param cx @en The X-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 X 坐标。
     * @param cy @en The Y-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 Y 坐标。
     * @param cz @en The Z-Coordinate of the center point relative to the origin.  @zh 相对于原点的中心点的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 球体的半径
     * @returns @en A new sphere instance. @zh 一个新的球实例。
     */
    public static create (cx: number, cy: number, cz: number, r: number): Sphere {
        return new Sphere(cx, cy, cz, r);
    }

    /**
     * @en
     * Clones a sphere instance.
     * @zh
     * 克隆一个新的球实例。
     * @param p @en The sphere object to clone from. @zh 克隆的目标。
     * @returns @en The sphere object to clone to. @zh 克隆出的实例。
     */
    public static clone (p: Sphere): Sphere {
        return new Sphere(p.center.x, p.center.y, p.center.z, p.radius);
    }

    /**
     * @en
     * Copies the values from one sphere to another.
     * @zh
     * 复制一个球的值到另一个球中。
     * @param out @en The sphere object to copy to. @zh 接受操作的球实例。
     * @param a @en The sphere object to copy from. @zh 被复制的球实例。
     * @returns @en The sphere object to copy to. @zh 接受操作的球实例。
     */
    public static copy (out: Sphere, p: Sphere): Sphere {
        Vec3.copy(out.center, p.center);
        out.radius = p.radius;

        return out;
    }

    /**
     * @en
     * Creates a new sphere instance from two points.
     * @zh
     * 从两个点创建一个新的球实例。
     * @param out - @en The sphere created from the two points. @zh 接受操作的球实例。
     * @param minPos - @en The lower point of the sphere. @zh 球的较小点。
     * @param maxPos - @en The upper point of the sphere. @zh 球的较大点。
     * @returns @en The created sphere, same as the `out` parameter. @zh 接受操作的球实例，与 `out` 参数相同。
     */
    public static fromPoints (out: Sphere, minPos: Vec3, maxPos: Vec3): Sphere {
        Vec3.multiplyScalar(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        out.radius = Vec3.subtract(_v3_tmp, maxPos, minPos).length() * 0.5;
        return out;
    }

    /**
     * @en
     * Sets the components of a sphere to the given values
     * @zh
     * 将球体的属性设置为给定的值。
     * @param out @en The sphere to set values to. @zh 接受操作的球实例。
     * @param cx @en The X-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 X 坐标。
     * @param cy @en The Y-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 Y 坐标。
     * @param cz @en The Z-Coordinate of the center point which relative to the origin.  @zh 相对于原点的中心点的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 要设置的球的半径。
     * @returns @en The sphere to set values to, same as the `out` parameter. @zh 接受操作的实例，与 `out` 相同。
     * @function
     */
    public static set (out: Sphere, cx: number, cy: number, cz: number, r: number): Sphere {
        out.center.x = cx;
        out.center.y = cy;
        out.center.z = cz;
        out.radius = r;

        return out;
    }

    /**
     * @en
     * The center of this sphere.
     * @zh
     * 当前球在本地坐标中的中心点。
     */
    protected _center: Vec3 = new Vec3(0, 0, 0);
    get center (): Vec3 {
        return this._center;
    }

    set center (val: Vec3) {
        this._center = val;
    }

    private _radius = 0;

    /**
      * @en
      * The radius of this sphere.
      * @zh
      * 当前球的半径。
      */
    get radius (): number {
        return this._radius;
    }

    set radius (val: number) {
        this._radius = val;
    }

    /**
     * @en
     * Gets the type of the shape, always returns `enums.SHAPE_SPHERE`.
     * @zh
     * 获取球的类型，固定返回 `enums.SHAPE_SPHERE`。
     */
    get type (): number {
        return this._type;
    }

    protected readonly _type: number;

    /**
     * @en
     * Constructs a sphere instance.
     * @zh
     * 构造一个球。
     * @param cx @en The X-Coordinate of the sphere. @zh 该球的世界坐标的 X 坐标。
     * @param cy @en The Y-Coordinate of the sphere. @zh 该球的世界坐标的 Y 坐标。
     * @param cz @en The Z-Coordinate of the sphere. @zh 该球的世界坐标的 Z 坐标。
     * @param r @en The radius of the sphere. @zh 球的半径。
     */
    constructor (cx = 0, cy = 0, cz = 0, r = 1) {
        this._type = enums.SHAPE_SPHERE;
        this._center = new Vec3(cx, cy, cz);
        this._radius = r;
    }

    public destroy (): void {
    }

    /**
     * @en
     * Clones a sphere instance.
     * @zh
     * 克隆一个球实例。
     * @returns @en The cloned sphere instance. @zh 克隆的球实例。
     */
    public clone (): Sphere {
        return Sphere.clone(this);
    }

    /**
     * @en
     * Copies the values from a sphere to the current sphere.
     * @zh
     * 复制一个球的值到当前球实例中。
     * @param a @en The sphere to copy from. @zh 拷贝的目标。
     */
    public copy (a: Sphere): Sphere {
        return Sphere.copy(this, a);
    }

    /**
     * @en
     * Gets the bounding points of this sphere.
     * @zh
     * 获取此球体的边界点。
     * @param minPos @en The point with maximum coordinates of the sphere. @zh 当前球实例的最小点。
     * @param maxPos @en The point with minimum coordinates of the sphere. @zh 当前球实例的最大点。
     */
    public getBoundary (minPos: Vec3, maxPos: Vec3): void {
        Vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
        Vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
    }

    /**
     * @en
     * Transforms this sphere by a 4x4 matrix and RTS and stores to the `out` parameter.
     * @zh
     * 用一个 4x4 矩阵和一组 RTS 变换此球体，并将结果存储在 `out` 参数中。
     * @param m @en The 4x4 transform matrix. @zh 4x4 变换矩阵。
     * @param pos @en The position part of the transform. @zh 变换的位置部分。
     * @param rot @en The rotation part of the transform. @zh 变换的旋转部分。
     * @param scale @en The scale part of the transform. @zh 变换的缩放部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    public transform (m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: Sphere): void {
        Vec3.transformMat4(out.center, this.center, m);
        out.radius = this.radius * maxComponent(scale);
    }

    /**
     * @en
     * Transforms this sphere by a 4x4 matrix and a quaternion, stores the result to the `out` parameter.
     * @zh
     * 使用一个 4x4 矩阵和一个四元数变换此球体，并将结果存储在 `out` 参数中。
     * @param m @en The 4x4 transform matrix. @zh 4x4 变换矩阵。
     * @param rot @en The rotation part of the transform. @zh 变换的旋转部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    public translateAndRotate (m: Mat4, rot: Quat, out: Sphere): void {
        Vec3.transformMat4(out.center, this.center, m);
    }

    /**
     * @en
     * Scales this sphere and stores the result to the `out` parameter.
     * @zh
     * 对当前球实例进行缩放处理，并将结果存储在 `out` 参数中。
     * @param scale @en The scale value. @zh 缩放值。
     * @param out @en The sphere which the scale will be applied to. @zh 缩放的目标。
     */
    public setScale (scale: Vec3, out: Sphere): void {
        out.radius = this.radius * maxComponent(scale);
    }

    /**
     * @en Merges a point to this sphere.
     * @zh 合并一个点到当前球实例中。
     * @param point @en The point to be merged to this sphere. @zh 要合并到当前球实例的点。
     */
    public mergePoint (point: Vec3): void {
        // if sphere.radius Less than 0,
        // Set this point as anchor,
        // And set radius to 0.
        if (this.radius < 0.0) {
            this.center.set(point);
            this.radius = 0.0;
        }

        Vec3.subtract(_offset, point, this.center);
        const dist = _offset.length();

        if (dist > this.radius) {
            const half = (dist - this.radius) * 0.5;
            this.radius += half;
            Vec3.multiplyScalar(_offset, _offset, half / dist);
            Vec3.add(this.center, this.center, _offset);
        }
    }

    /**
     * @en Merges some points to this sphere.
     * @zh 合并一些点到当前球实例中。
     * @param points @en The points to be merged to this sphere. @zh 要合并到当前球实例的点列表。
     */
    public mergePoints (points: Vec3[]): void {
        const length = points.length;
        if (length < 1) return;

        // Init Invalid Sphere
        this.radius = -1.0;

        for (let i = 0; i < length; i++) {
            this.mergePoint(points[i]);
        }
    }

    /**
     * @en Merges a AABB to this sphere.
     * @zh 合并一个 AABB 到当前球实例中。
     * @param a @en The AABB instance to be merged to this sphere. @zh 要合并到当前球实例的 AABB 实例。
     */
    public mergeAABB (a: AABB): void {
        a.getBoundary(_min, _max);

        this.mergePoint(_min);
        this.mergePoint(_max);
    }
}
