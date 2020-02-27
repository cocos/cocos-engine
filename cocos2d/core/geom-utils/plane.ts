/****************************************************************************
 Copyright (c) 2019 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

import { Mat4, Vec3, Vec4 } from '../value-types';
import enums from './enums';

const v1 = new Vec3(0, 0, 0);
const v2 = new Vec3(0, 0, 0);
const temp_mat = cc.mat4();
const temp_vec4 = cc.v4();

/**
 * !#en
 * plane。
 * !#zh
 * 平面。
 * @class geomUtils.Plane
 */
export default class plane {

    /**
     * !#en
     * create a new plane
     * !#zh
     * 创建一个新的 plane。
     * @method create
     * @param {Number} nx The x part of the normal component.
     * @param {Number} ny The y part of the normal component.
     * @param {Number} nz The z part of the normal component.
     * @param {Number} d Distance from the origin.
     * @return {Plane}
     */
    public static create (nx: number, ny: number, nz: number, d: number) {
        return new plane(nx, ny, nz, d);
    }

    /**
     * !#en
     * clone a new plane
     * !#zh
     * 克隆一个新的 plane。
     * @method clone
     * @param {Plane} p The source of cloning.
     * @return {Plane} The cloned object.
     */
    public static clone (p: plane) {
        return new plane(p.n.x, p.n.y, p.n.z, p.d);
    }

    /**
     * !#en
     * copy the values from one plane to another
     * !#zh
     * 复制一个平面的值到另一个。
     * @method copy
     * @param {Plane} out The object that accepts the action.
     * @param {Plane} p The source of the copy.
     * @return {Plane} The object that accepts the action.
     */
    public static copy (out: plane, p: plane) {
        Vec3.copy(out.n, p.n);
        out.d = p.d;

        return out;
    }

    /**
     * !#en
     * create a plane from three points
     * !#zh
     * 用三个点创建一个平面。
     * @method fromPoints
     * @param {Plane} out The object that accepts the action.
     * @param {Vec3} a Point a。
     * @param {Vec3} b Point b。
     * @param {Vec3} c Point c。
     * @return {Plane} out The object that accepts the action.
     */
    public static fromPoints (out: plane, a: Vec3, b: Vec3, c: Vec3) {
        Vec3.subtract(v1, b, a);
        Vec3.subtract(v2, c, a);

        Vec3.normalize(out.n, Vec3.cross(out.n, v1, v2));
        out.d = Vec3.dot(out.n, a);

        return out;
    }

    /**
     * !#en
     * Set the components of a plane to the given values
     * !#zh
     * 将给定平面的属性设置为给定值。
     * @method set
     * @param {Plane} out The object that accepts the action.
     * @param {Number} nx The x part of the normal component.
     * @param {Number} ny The y part of the normal component.
     * @param {Number} nz The z part of the normal component.
     * @param {Number} d Distance from the origin.
     * @return {Plane} out The object that accepts the action.
     */
    public static set (out: plane, nx: number, ny: number, nz: number, d: number) {
        out.n.x = nx;
        out.n.y = ny;
        out.n.z = nz;
        out.d = d;

        return out;
    }

    /**
     * !#en
     * create plane from normal and point
     * !#zh
     * 用一条法线和一个点创建平面。
     * @method fromNormalAndPoint
     * @param {Plane} out The object that accepts the action.
     * @param {Vec3} normal The normal of a plane.
     * @param {Vec3} point A point on the plane.
     * @return {Plane} out The object that accepts the action.
     */
    public static fromNormalAndPoint (out: plane, normal: Vec3, point: Vec3) {
        Vec3.copy(out.n, normal);
        out.d = Vec3.dot(normal, point);

        return out;
    }

    /**
     * !#en
     * normalize a plane
     * !#zh
     * 归一化一个平面。
     * @method normalize
     * @param {Plane} out The object that accepts the action.
     * @param {Plane} a Source data for operations.
     * @return {Plane} out The object that accepts the action.
     */
    public static normalize (out: plane, a: plane) {
        const len = a.n.len();
        Vec3.normalize(out.n, a.n);
        if (len > 0) {
            out.d = a.d / len;
        }
        return out;
    }

    /**
     * !#en
     * A normal vector.
     * !#zh
     * 法线向量。
     * @property {Vec3} n
     */
    public n: Vec3;

    /**
     * !#en
     * The distance from the origin to the plane.
     * !#zh
     * 原点到平面的距离。
     * @property {number} d
     */
    public d: number;

    private _type: number;

    /**
     * !#en Construct a plane.
     * !#zh 构造一个平面。
     * @constructor
     * @param {Number} nx The x part of the normal component.
     * @param {Number} ny The y part of the normal component.
     * @param {Number} nz The z part of the normal component.
     * @param {Number} d Distance from the origin.
     */
    constructor (nx = 0, ny = 1, nz = 0, d = 0) {
        this._type = enums.SHAPE_PLANE;
        this.n = new Vec3(nx, ny, nz);
        this.d = d;
    }

    /**
     * !#en
     * Transform a plane.
     * !#zh
     * 变换一个平面。
     * @method transform
     * @param {Mat4} mat
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
