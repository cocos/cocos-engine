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

import { Mat4, Vec3, Vec4 } from '../math';
import enums from './enums';
import { legacyCC } from '../global-exports';

const v1 = new Vec3(0, 0, 0);
const v2 = new Vec3(0, 0, 0);
const temp_mat = legacyCC.mat4();
const temp_vec4 = legacyCC.v4();

/**
 * @en
 * Basic Geometry: Plane.
 * @zh
 * 基础几何 Plane。
 */

export class Plane {
    /**
     * @en
     * create a new plane
     * @zh
     * 创建一个新的 plane。
     * @param nx @en The x component of normal vector. @zh 法向分量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向分量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向分量的 z 部分。
     * @param d  @en The distance between normal vector and the origin. @zh 与原点的距离。
     * @return
     */
    public static create (nx: number, ny: number, nz: number, d: number) {
        return new Plane(nx, ny, nz, d);
    }

    /**
     * @en
     * clone a new plane
     * @zh
     * 克隆一个新的 plane。
     * @param p @en The Plane object to be cloned from. @zh 克隆的来源。
     * @return @en Cloned objects @zh 克隆出的对象。
     */
    public static clone (p: Plane) {
        return new Plane(p.n.x, p.n.y, p.n.z, p.d);
    }

    /**
     * @en
     * copy the values from one plane to another
     * @zh
     * 复制一个平面的值到另一个。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param p @en The source of replication. @zh 复制的来源。
     * @return @en The object to be operated on. @zh 接受操作的对象。
     */
    public static copy (out: Plane, p: Plane) {
        Vec3.copy(out.n, p.n);
        out.d = p.d;

        return out;
    }

    /**
     * @en
     * create a plane from three points
     * @zh
     * 用三个点创建一个平面。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param a @en Point a. @zh 点 a。
     * @param b @en Point b. @zh 点 b。
     * @param c @en Point c. @zh 点 c。
     * @return out @en The object to be operated on. @zh 接受操作的对象。
     */
    public static fromPoints (out: Plane, a: Vec3, b: Vec3, c: Vec3) {
        Vec3.subtract(v1, b, a);
        Vec3.subtract(v2, c, a);

        Vec3.normalize(out.n, Vec3.cross(out.n, v1, v2));
        out.d = Vec3.dot(out.n, a);

        return out;
    }

    /**
     * @en
     * Set the components of a plane to the given values
     * @zh
     * 将给定平面的属性设置为给定值。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param nx @en The x component of normal vector. @zh 法向分量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向分量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向分量的 z 部分。
     * @param d  @en The distance between normal vector and the origin. @zh 与原点的距离。
     * @return out @en The object to be operated on. @zh 接受操作的对象。
     */
    public static set (out: Plane, nx: number, ny: number, nz: number, d: number) {
        out.n.x = nx;
        out.n.y = ny;
        out.n.z = nz;
        out.d = d;

        return out;
    }

    /**
     * @en
     * create plane from normal and point
     * @zh
     * 用一条法线和一个点创建平面。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param normal @en Normal of the plane. @zh 平面的法线。
     * @param point @en A point in the plane. @zh 平面上的一点。
     * @return out @en The object to be operated on. @zh 接受操作的对象。
     */
    public static fromNormalAndPoint (out: Plane, normal: Vec3, point: Vec3) {
        Vec3.copy(out.n, normal);
        out.d = Vec3.dot(normal, point);

        return out;
    }

    /**
     * @en
     * normalize a plane
     * @zh
     * 归一化一个平面。
     * @param out @en The object to be operated on. @zh 接受操作的对象。
     * @param a @en Source data for the operation. @zh 操作的源数据。
     * @return out @en The object to be operated on. @zh 接受操作的对象。
     */
    public static normalize (out: Plane, a: Plane) {
        const len = a.n.length();
        Vec3.normalize(out.n, a.n);
        if (len > 0) {
            out.d = a.d / len;
        }
        return out;
    }

    /**
     * @en
     * The normal of the plane.
     * @zh
     * 法线向量。
     */
    public n: Vec3;

    /**
     * @en
     * The distance from the origin to the plane.
     * @zh
     * 原点到平面的距离。
     */
    public d: number;

    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    // compatibility with vector interfaces
    set x (val) { this.n.x = val; }
    get x () { return this.n.x; }
    set y (val) { this.n.y = val; }
    get y () { return this.n.y; }
    set z (val) { this.n.z = val; }
    get z () { return this.n.z; }
    set w (val) { this.d = val; }
    get w () { return this.d; }

    protected readonly _type: number;

    /**
     * @en
     * Construct a plane.
     * @zh
     * 构造一个平面。
     * @param nx @en The x component of normal vector. @zh 法向分量的 x 部分。
     * @param ny @en The y component of normal vector. @zh 法向分量的 y 部分。
     * @param nz @en The z component of normal vector. @zh 法向分量的 z 部分。
     * @param d @en The distance between normal vector and the origin. @zh 与原点的距离。
     */
    constructor (nx = 0, ny = 1, nz = 0, d = 0) {
        this._type = enums.SHAPE_PLANE;
        this.n = new Vec3(nx, ny, nz);
        this.d = d;
    }

    /**
     * @en
     * transform this plane.
     * @zh
     * 变换一个平面。
     * @param mat
     */
    public transform (mat: Mat4): void {
        Mat4.invert(temp_mat, mat);
        Mat4.transpose(temp_mat, temp_mat);
        Vec4.set(temp_vec4, this.n.x, this.n.y, this.n.z, this.d);
        Vec4.transformMat4(temp_vec4, temp_vec4, temp_mat);
        Vec3.set(this.n, temp_vec4.x, temp_vec4.y, temp_vec4.z);
        this.d = temp_vec4.w;
    }
}
