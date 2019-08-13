/**
 * @category gemotry-utils
 */

import { Mat4, Vec3, Vec4 } from '../../core/math';
import enums from './enums';

const v1 = new Vec3(0, 0, 0);
const v2 = new Vec3(0, 0, 0);
const temp_mat = cc.mat4();
const temp_vec4 = cc.v4();

/**
 * @zh
 * 基础几何 plane。
 */
// tslint:disable-next-line:class-name
export default class plane {

    /**
     * @en
     * create a new plane
     * @zh
     * 创建一个新的 plane。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     * @return
     */
    public static create (nx: number, ny: number, nz: number, d: number) {
        return new plane(nx, ny, nz, d);
    }

    /**
     * @en
     * clone a new plane
     * @zh
     * 克隆一个新的 plane。
     * @param p 克隆的来源。
     * @return 克隆出的对象。
     */
    public static clone (p: plane) {
        return new plane(p.n.x, p.n.y, p.n.z, p.d);
    }

    /**
     * @en
     * copy the values from one plane to another
     * @zh
     * 复制一个平面的值到另一个。
     * @param out 接受操作的对象。
     * @param p 复制的来源。
     * @return 接受操作的对象。
     */
    public static copy (out: plane, p: plane) {
        Vec3.copy(out.n, p.n);
        out.d = p.d;

        return out;
    }

    /**
     * @en
     * create a plane from three points
     * @zh
     * 用三个点创建一个平面。
     * @param out 接受操作的对象。
     * @param a 点 a。
     * @param b 点 b。
     * @param c 点 c。
     * @return out 接受操作的对象。
     */
    public static fromPoints (out: plane, a: Vec3, b: Vec3, c: Vec3) {
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
     * @param out 接受操作的对象。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     * @return out 接受操作的对象。
     */
    public static set (out: plane, nx: number, ny: number, nz: number, d: number) {
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
     * @param out 接受操作的对象。
     * @param normal 平面的法线。
     * @param point 平面上的一点。
     * @return out 接受操作的对象。
     */
    public static fromNormalAndPoint (out: plane, normal: Vec3, point: Vec3) {
        Vec3.copy(out.n, normal);
        out.d = Vec3.dot(normal, point);

        return out;
    }

    /**
     * @en
     * normalize a plane
     * @zh
     * 归一化一个平面。
     * @param out 接受操作的对象。
     * @param a 操作的源数据。
     * @return out 接受操作的对象。
     */
    public static normalize (out: plane, a: plane) {
        const len = a.n.length();
        Vec3.normalize(out.n, a.n);
        if (len > 0) {
            out.d = a.d / len;
        }
        return out;
    }

    /**
     * @zh
     * 法线向量。
     */
    public n: Vec3;

    /**
     * @zh
     * 原点到平面的距离。
     */
    public d: number;

    private _type: number;

    /**
     * 构造一个平面。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     */
    constructor (nx = 0, ny = 1, nz = 0, d = 0) {
        this._type = enums.SHAPE_PLANE;
        this.n = new Vec3(nx, ny, nz);
        this.d = d;
    }

    /**
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
