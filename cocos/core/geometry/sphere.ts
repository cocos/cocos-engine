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

import { Mat4, Quat, Vec3 } from '../math';
import enums from './enums';
import { AABB } from './aabb';
import { sphere } from '../../primitive';

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
     * @param cx 形状的相对于原点的 X 坐标。
     * @param cy 形状的相对于原点的 Y 坐标。
     * @param cz 形状的相对于原点的 Z 坐标。
     * @param r 球体的半径
     * @return {Sphere} 返回一个 sphere。
     */
    public static create (cx: number, cy: number, cz: number, r: number): Sphere {
        return new Sphere(cx, cy, cz, r);
    }

    /**
     * @en
     * clone a new sphere
     * @zh
     * 克隆一个新的 sphere 实例。
     * @param {Sphere} p 克隆的目标。
     * @return {Sphere} 克隆出的示例。
     */
    public static clone (p: Sphere): Sphere {
        return new Sphere(p.center.x, p.center.y, p.center.z, p.radius);
    }

    /**
     * @en
     * copy the values from one sphere to another
     * @zh
     * 将从一个 sphere 的值复制到另一个 sphere。
     * @param {Sphere} out 接受操作的 sphere。
     * @param {Sphere} a 被复制的 sphere。
     * @return {Sphere} out 接受操作的 sphere。
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
     * @param out - 接受操作的 sphere。
     * @param minPos - sphere 的最小点。
     * @param maxPos - sphere 的最大点。
     * @returns {Sphere} out 接受操作的 sphere。
     */
    public static fromPoints (out: Sphere, minPos: Vec3, maxPos: Vec3): Sphere {
        Vec3.multiplyScalar(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        out.radius = Vec3.subtract(_v3_tmp, maxPos, minPos).length() * 0.5;
        return out;
    }

    /**
     * @en
     * @zh
     * @param out -
     * @param minPos -
     * @param maxPos -
     * @returns {Sphere}
     */
    public static fromPointArray (out: Sphere, s: Sphere, points: Vec3[]): Sphere {
        const length = points.length;
        if (length < 1) return out;

        // clear
        out.center.set(0.0, 0.0, 0.0);
        out.radius = 0.0;

        for (let i = 0; i < length; i++) {
            this.mergePoint(out, s, points[i]);
        }

        return out;
    }

    /**
     * @en
     * Set the components of a sphere to the given values
     * @zh
     * 将球体的属性设置为给定的值。
     * @param {Sphere} out 接受操作的 sphere。
     * @param cx 形状的相对于原点的 X 坐标。
     * @param cy 形状的相对于原点的 Y 坐标。
     * @param cz 形状的相对于原点的 Z 坐标。
     * @param {number} r 半径。
     * @return {Sphere} out 接受操作的 sphere。
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
     * @zh
     * 球跟点合并
     */
    public static mergePoint (out: Sphere, s: Sphere, point: Vec3) {
        // if sphere.radius Less than 0,
        // Set this point as anchor,
        // And set radius to 0.
        if (s.radius < 0.0) {
            out.center.set(point);
            out.radius = 0.0;
            return out;
        }

        Vec3.subtract(_offset, point, s.center);
        const dist = _offset.length();

        if (dist > s.radius) {
            const half = (dist - s.radius) * 0.5;
            out.radius += half;
            Vec3.multiplyScalar(_offset, _offset, half / dist);
            Vec3.add(out.center, out.center, _offset);
        }

        return out;
    }

    /**
     * @zh
     * 球跟立方体合并
     */
    public static mergeAABB (out: Sphere, s:Sphere, a: AABB) {
        a.getBoundary(_min, _max);

        Sphere.mergePoint(out, s, _min);
        Sphere.mergePoint(out, s, _max);

        return out;
    }

    /**
     * @en
     * The center of this sphere.
     * @zh
     * 本地坐标的中心点。
     */
    protected _center: Vec3 = new Vec3(0, 0, 0);
    get center () : Vec3 {
        return this._center;
    }

    set center (val:Vec3) {
        this._center = val;
    }

    private _radius = 0;

    /**
      * @en
      * The radius of this sphere.
      * @zh
      * 半径。
      */
    get radius () : number {
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
     * @param cx 该球的世界坐标的 X 坐标。
     * @param cy 该球的世界坐标的 Y 坐标。
     * @param cz 该球的世界坐标的 Z 坐标。
     * @param {number} r 半径。
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
     * @param a 拷贝的目标。
     */
    public copy (a: Sphere) {
        return Sphere.copy(this, a);
    }

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取此形状的边界点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
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
     * @param m 变换的矩阵。
     * @param pos 变换的位置部分。
     * @param rot 变换的旋转部分。
     * @param scale 变换的缩放部分。
     * @param out 变换的目标。
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
     * @param m 变换的矩阵。
     * @param rot 变换的旋转部分。
     * @param out 变换的目标。
     */
    public translateAndRotate (m: Mat4, rot: Quat, out: Sphere) {
        Vec3.transformMat4(out.center, this.center, m);
    }

    /**
     * @en
     * Scaling this sphere.
     * @zh
     * 将 out 根据这个 sphere 的数据进行缩放。
     * @param scale 缩放值。
     * @param out 缩放的目标。
     */
    public setScale (scale: Vec3, out: Sphere) {
        out.radius = this.radius * maxComponent(scale);
    }
}
