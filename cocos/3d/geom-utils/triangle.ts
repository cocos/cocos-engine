/**
 * @category gemotry-utils
 */

import { Vec3 } from '../../core/value-types';
import enums from './enums';

/**
 * @zh
 * 基础几何 三角形。
 */
// tslint:disable-next-line:class-name
export default class triangle {

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
     * @return {triangle} 一个新的 triangle。
     */
    public static create (ax: number = 1, ay: number = 0, az: number = 0,
                          bx: number = 0, by: number = 0, bz: number = 0,
                          cx: number = 0, cy: number = 0, cz: number = 1): triangle {
        return new triangle(ax, ay, az, bx, by, bz, cx, cy, cz);
    }

    /**
     * @en
     * clone a new triangle
     * @zh
     * 克隆一个新的 triangle。
     * @param {triangle} t 克隆的目标。
     * @return {triangle} 克隆出的新对象。
     */
    public static clone (t: triangle): triangle {
        return new triangle(
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
     * @param {triangle} out 接受操作的 triangle。
     * @param {triangle} t 被复制的 triangle。
     * @return {triangle} out 接受操作的 triangle。
     */
    public static copy (out: triangle, t: triangle): triangle {
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
     * @param {triangle} out 接受操作的 triangle。
     * @param {Vec3} a a 点。
     * @param {Vec3} b b 点。
     * @param {Vec3} c c 点。
     * @return {triangle} out 接受操作的 triangle。
     */
    public static fromPoints (out: triangle, a: Vec3, b: Vec3, c: Vec3): triangle {
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
     * @param {triangle} out 给定的三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     * @return {triangle}
     * @function
     */
    public static set (out: triangle,
                       ax: number, ay: number, az: number,
                       bx: number, by: number, bz: number,
                       cx: number, cy: number, cz: number): triangle {
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
     * @zh
     * 点 a。
     */
    public a: Vec3;

    /**
     * @zh
     * 点 b。
     */
    public b: Vec3;

    /**
     * @zh
     * 点 c。
     */
    public c: Vec3;

    private _type: number;

    /**
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
    constructor (ax: number = 0, ay: number = 0, az: number = 0,
                 bx: number = 1, by: number = 0, bz: number = 0,
                 cx: number = 0, cy: number = 1, cz: number = 0) {
        this._type = enums.SHAPE_TRIANGLE;
        this.a = Vec3.create(ax, ay, az);
        this.b = Vec3.create(bx, by, bz);
        this.c = Vec3.create(cx, cy, cz);
    }
}
