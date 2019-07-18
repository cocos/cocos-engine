/**
 * @category gemotry-utils
 */

import { Vec3 } from '../../core/value-types';
import enums from './enums';

/**
 * @zh
 * 基础几何 射线。
 */
// tslint:disable-next-line:class-name
export default class ray {

    /**
     * @en
     * create a new ray
     * @zh
     * 创建一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     * @return {ray} 射线。
     */
    public static create (ox: number = 0, oy: number = 0, oz: number = 0, dx: number = 0, dy: number = 0, dz: number = 1): ray {
        return new ray(ox, oy, oz, dx, dy, dz);
    }

    /**
     * @en
     * Creates a new ray initialized with values from an existing ray
     * @zh
     * 从一条射线克隆出一条新的射线。
     * @param {ray} a 克隆的目标。
     * @return {ray} 克隆出的新对象。
     */
    public static clone (a: ray): ray {
        return new ray(
            a.o.x, a.o.y, a.o.z,
            a.d.x, a.d.y, a.d.z,
        );
    }

    /**
     * @en
     * Copy the values from one ray to another
     * @zh
     * 将从一个 ray 的值复制到另一个 ray。
     * @param {ray} out 接受操作的 ray。
     * @param {ray} a 被复制的 ray。
     * @return {ray} out 接受操作的 ray。
     */
    public static copy (out: ray, a: ray): ray {
        Vec3.copy(out.o, a.o);
        Vec3.copy(out.d, a.d);

        return out;
    }

    /**
     * @en
     * create a ray from two points
     * @zh
     * 用两个点创建一条射线。
     * @param {ray} out 接受操作的射线。
     * @param {Vec3} origin 射线的起点。
     * @param {Vec3} target 射线上的一点。
     * @return {ray} out 接受操作的射线。
     */
    public static fromPoints (out: ray, origin: Vec3, target: Vec3): ray {
        Vec3.copy(out.o, origin);
        Vec3.normalize(out.d, Vec3.subtract(out.d, target, origin));
        return out;
    }

    /**
     * @en
     * Set the components of a ray to the given values
     * @zh
     * 将给定射线的属性设置为给定的值。
     * @param {ray} out 接受操作的射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     * @return {ray} out 接受操作的射线。
     */
    public static set (out: ray, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number): ray {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;

        return out;
    }

    /**
     * @zh
     * 起点。
     */
    public o: Vec3;

    /**
     * @zh
     * 方向。
     */
    public d: Vec3;

    private _type: number;

    /**
     * 构造一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     */
    constructor (ox: number = 0, oy: number = 0, oz: number = 0,
                 dx: number = 0, dy: number = 0, dz: number = -1) {
        this._type = enums.SHAPE_RAY;
        this.o = Vec3.create(ox, oy, oz);
        this.d = Vec3.create(dx, dy, dz);
    }
}
