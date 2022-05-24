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

import { Mat4, Quat, Vec3 } from '../math';
import enums from './enums';
import { AABB } from './aabb';

const _v3_tmp = new Vec3();
const _offset = new Vec3();
const _min = new Vec3();
const _max = new Vec3();
function maxComponent (v: Vec3) { return Math.max(Math.max(v.x, v.y), v.z); }

/**
 * @en
 * Basic Geometry: Sphere.
 * @zh
 * 基础几何 轴对齐球。
 */

export class Sphere {
    /**
     * @en
     * create a new sphere
     * @zh
     * 创建一个新的 sphere 实例。
     * @param cx @en X-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 X 坐标。
     * @param cy @en Y-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 Y 坐标。
     * @param cz @en Z-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 Z 坐标。
     * @param r @en Radius of the sphere. @zh 球体的半径
     * @return @en return a new sphere. @zh 返回一个 sphere。
     */
    public static create (cx: number, cy: number, cz: number, r: number): Sphere {
        return new Sphere(cx, cy, cz, r);
    }

    /**
     * @en
     * clone a new sphere
     * @zh
     * 克隆一个新的 sphere 实例。
     * @param p @en The sphere object to clone from. @zh 克隆的目标。
     * @return @en The sphere object to clone to. @zh 克隆出的示例。
     */
    public static clone (p: Sphere): Sphere {
        return new Sphere(p.center.x, p.center.y, p.center.z, p.radius);
    }

    /**
     * @en
     * copy the values from one sphere to another
     * @zh
     * 将从一个 sphere 的值复制到另一个 sphere。
     * @param out @en The sphere object to copy to. @zh 接受操作的 sphere。
     * @param a @en The sphere object to copy from. @zh 被复制的 sphere。
     * @return @en The sphere object to copy to. @zh 接受操作的 sphere。
     */
    public static copy (out: Sphere, p: Sphere): Sphere {
        Vec3.copy(out.center, p.center);
        out.radius = p.radius;

        return out;
    }

    /**
     * @en
     * create a new bounding sphere from two corner points
     * @zh
     * 从两个点创建一个新的 sphere。
     * @param out - @en Sphere created from points. @zh 接受操作的 sphere。
     * @param minPos - @en Lower point of the sphere. @zh sphere 的较小点。
     * @param maxPos - @en Upper point of the sphere. @zh sphere 的较大点。
     * @returns @en The output sphere object to save the created sphere data. @zh 接受操作的 sphere。
     */
    public static fromPoints (out: Sphere, minPos: Vec3, maxPos: Vec3): Sphere {
        Vec3.multiplyScalar(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        out.radius = Vec3.subtract(_v3_tmp, maxPos, minPos).length() * 0.5;
        return out;
    }

    /**
     * @en
     * Set the components of a sphere to the given values
     * @zh
     * 将球体的属性设置为给定的值。
     * @param out @en The sphere to set properties to. @zh 接受操作的 sphere。
     * @param cx @en X-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 X 坐标。
     * @param cy @en Y-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 Y 坐标。
     * @param cz @en Z-Coordinate of center point relative to the origin.  @zh 中心点的相对于原点的 Z 坐标。
     * @param r @en Radius of the sphere. @zh 半径。
     * @return @en Sphere which the properties will be set to. @zh 接受操作的 sphere。
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
     * 本地坐标的中心点。
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
      * 半径。
      */
    get radius (): number {
        return this._radius;
    }

    set radius (val: number) {
        this._radius = val;
    }

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
     * Construct a sphere.
     * @zh
     * 构造一个球。
     * @param cx @en The X-Coordinate of the sphere. @zh 该球的世界坐标的 X 坐标。
     * @param cy @en The Y-Coordinate of the sphere. @zh 该球的世界坐标的 Y 坐标。
     * @param cz @en The Z-Coordinate of the sphere. @zh 该球的世界坐标的 Z 坐标。
     * @param r @en The radius. @zh 半径。
     */
    constructor (cx = 0, cy = 0, cz = 0, r = 1) {
        this._type = enums.SHAPE_SPHERE;
        this._center = new Vec3(cx, cy, cz);
        this._radius = r;
    }

    public destroy () {
    }

    /**
     * @en
     * Get a clone.
     * @zh
     * 获得克隆。
     */
    public clone () {
        return Sphere.clone(this);
    }

    /**
     * @en
     * Copy a sphere.
     * @zh
     * 拷贝对象。
     * @param a @en The sphere to copy from. @zh 拷贝的目标。
     */
    public copy (a: Sphere) {
        return Sphere.copy(this, a);
    }

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取此形状的边界点。
     * @param minPos @en The point with maximum coordinates of the sphere. @zh 最小点。
     * @param maxPos @en The point with minimum coordinates of the sphere. @zh 最大点。
     */
    public getBoundary (minPos: Vec3, maxPos: Vec3) {
        Vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);
        Vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
    }

    /**
     * @en
     * Transform this shape
     * @zh
     * 将 out 根据这个 sphere 的数据进行变换。
     * @param m @en The transform matrix. @zh 变换的矩阵。
     * @param pos @en The position. @zh 变换的位置部分。
     * @param rot @en The rotation. @zh 变换的旋转部分。
     * @param scale @en The scale. @zh 变换的缩放部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    public transform (m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: Sphere) {
        Vec3.transformMat4(out.center, this.center, m);
        out.radius = this.radius * maxComponent(scale);
    }

    /**
     * @en
     * Translate and rotate this sphere.
     * @zh
     * 将 out 根据这个 sphere 的数据进行变换。
     * @param m @en The transform matrix. @zh 变换的矩阵。
     * @param rot @en The rotation. @zh 变换的旋转部分。
     * @param out @en The sphere which the transform will be applied to. @zh 变换的目标。
     */
    public translateAndRotate (m: Mat4, rot: Quat, out: Sphere) {
        Vec3.transformMat4(out.center, this.center, m);
    }

    /**
     * @en
     * Scaling this sphere.
     * @zh
     * 将 out 根据这个 sphere 的数据进行缩放。
     * @param scale @en The scale. @zh 缩放值。
     * @param out @en The sphere which the scale will be applied to. @zh 缩放的目标。
     */
    public setScale (scale: Vec3, out: Sphere) {
        out.radius = this.radius * maxComponent(scale);
    }

    /**
     * @en The point to be merged.
     * @zh 球跟点合并
     * @param point @en The point to be merged. @zh 点
     */
    public mergePoint (point: Vec3) {
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
     * @en The sphere and points to be merged.
     * @zh 球跟一系列点合并
     * @param points @en The point to be merged. @zh 一系列点
     */
    public mergePoints (points: Vec3[]) {
        const length = points.length;
        if (length < 1) return;

        // Init Invalid Sphere
        this.radius = -1.0;

        for (let i = 0; i < length; i++) {
            this.mergePoint(points[i]);
        }
    }

    /**
     * @en The axis-aligned bounding box to be merged.
     * @zh 球跟立方体合并
     * @param a @en Cube. @zh 立方体
     */
    public mergeAABB (a: AABB) {
        a.getBoundary(_min, _max);

        this.mergePoint(_min);
        this.mergePoint(_max);
    }
}
