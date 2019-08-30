/**
 * @category gemotry-utils
 */

import { Mat3, Mat4, Quat, Vec3 } from '../../core/math';
import enums from './enums';

const _v3_tmp = new Vec3();
const _v3_tmp2 = new Vec3();
const _v3_tmp3 = new Vec3();
const _v3_tmp4 = new Vec3();
const _m3_tmp = new Mat3();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m4 = (out: Vec3, extent: Vec3, m4: Mat4) => {
    _m3_tmp.m00 = Math.abs(m4.m00); _m3_tmp.m01 = Math.abs(m4.m01); _m3_tmp.m02 = Math.abs(m4.m02);
    _m3_tmp.m03 = Math.abs(m4.m04); _m3_tmp.m04 = Math.abs(m4.m05); _m3_tmp.m05 = Math.abs(m4.m06);
    _m3_tmp.m06 = Math.abs(m4.m08); _m3_tmp.m07 = Math.abs(m4.m09); _m3_tmp.m08 = Math.abs(m4.m10);
    Vec3.transformMat3(out, extent, _m3_tmp);
};

/**
 * @zh
 * 基础几何  轴对齐包围盒。
 */
// tslint:disable-next-line: class-name
export default class aabb {

    /**
     * @zh
     * 获取形状的类型。
     */
    get type () {
        return this._type;
    }

    /**
     * @en
     * create a new aabb
     * @zh
     * 创建一个新的 aabb 实例。
     * @param px - aabb 的原点的 X 坐标。
     * @param py - aabb 的原点的 Y 坐标。
     * @param pz - aabb 的原点的 Z 坐标。
     * @param hw - aabb 宽度的一半。
     * @param hh - aabb 高度的一半。
     * @param hl - aabb 长度的一半。
     * @returns 返回新创建的 aabb 实例。
     */
    public static create (px?: number, py?: number, pz?: number, hw?: number, hh?: number, hl?: number) {
        return new aabb(px, py, pz, hw, hh, hl);
    }

    /**
     * @en
     * clone a new aabb
     * @zh
     * 克隆一个 aabb。
     * @param a - 克隆的目标。
     * @returns 克隆出的 aabb。
     */
    public static clone (a: aabb) {
        return new aabb(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
    }

    /**
     * @en
     * copy the values from one aabb to another
     * @zh
     * 将从一个 aabb 的值复制到另一个 aabb。
     * @param {aabb} out 接受操作的 aabb。
     * @param {aabb} a 被复制的 aabb。
     * @return {aabb} out 接受操作的 aabb。
     */
    public static copy (out: aabb, a: aabb): aabb {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);

        return out;
    }

    /**
     * @en
     * create a new aabb from two corner points
     * @zh
     * 从两个点创建一个新的 aabb。
     * @param out - 接受操作的 aabb。
     * @param minPos - aabb 的最小点。
     * @param maxPos - aabb 的最大点。
     * @returns {aabb} out 接受操作的 aabb。
     */
    public static fromPoints (out: aabb, minPos: Vec3, maxPos: Vec3): aabb {
        Vec3.multiplyScalar(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        Vec3.multiplyScalar(out.halfExtents, Vec3.subtract(_v3_tmp2, maxPos, minPos), 0.5);
        return out;
    }

    /**
     * @en
     * Set the components of a aabb to the given values
     * @zh
     * 将 aabb 的属性设置为给定的值。
     * @param {aabb} out 接受操作的 aabb。
     * @param px - aabb 的原点的 X 坐标。
     * @param py - aabb 的原点的 Y 坐标。
     * @param pz - aabb 的原点的 Z 坐标。
     * @param hw - aabb 宽度的一半。
     * @param hh - aabb 高度的一半。
     * @param hl - aabb 长度度的一半。
     * @return {aabb} out 接受操作的 aabb。
     */
    public static set (out: aabb, px: number, py: number, pz: number, hw: number, hh: number, hl: number): aabb {
        Vec3.set(out.center, px, py, pz);
        Vec3.set(out.halfExtents, hw, hh, hl);
        return out;
    }

    /**
     * @zh
     * 合并两个 aabb 到 out。
     * @param out 接受操作的 aabb。
     * @param a 输入的 aabb。
     * @param b 输入的 aabb。
     * @returns {aabb} out 接受操作的 aabb。
     */
    public static merge (out: aabb, a: aabb, b: aabb): aabb {
        Vec3.subtract(_v3_tmp, a.center, a.halfExtents);
        Vec3.subtract(_v3_tmp2, b.center, b.halfExtents);
        Vec3.add(_v3_tmp3, a.center, a.halfExtents);
        Vec3.add(_v3_tmp4, b.center, b.halfExtents);
        Vec3.max(_v3_tmp4, _v3_tmp3, _v3_tmp4);
        Vec3.min(_v3_tmp3, _v3_tmp, _v3_tmp2);
        return aabb.fromPoints(out, _v3_tmp3, _v3_tmp4);
    }

    /**
     * @zh
     * 变换一个 aabb 到 out 中。
     * @param out 接受操作的 aabb。
     * @param a 输入的源 aabb。
     * @param matrix 矩阵。
     * @returns {aabb} out 接受操作的 aabb。
     */
    public static transform (out: aabb, a: aabb, matrix: Mat4): aabb {
        Vec3.transformMat4(out.center, a.center, matrix);
        transform_extent_m4(out.halfExtents, a.halfExtents, matrix);
        return out;
    }

    /**
     * @zh
     * 本地坐标的中心点。
     */
    public center: Vec3;

    /**
     * @zh
     * 长宽高的一半。
     */
    public halfExtents: Vec3;

    protected _type: number = enums.SHAPE_AABB;

    constructor (px = 0, py = 0, pz = 0, hw = 1, hh = 1, hl = 1) {
        this.center = new Vec3(px, py, pz);
        this.halfExtents = new Vec3(hw, hh, hl);
    }

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 aabb 的最小点和最大点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */
    public getBoundary (minPos: Vec3, maxPos: Vec3) {
        Vec3.subtract(minPos, this.center, this.halfExtents);
        Vec3.add(maxPos, this.center, this.halfExtents);
    }

    /**
     * @en
     * Transform this shape
     * @zh
     * 将 out 根据这个 aabb 的数据进行变换。
     * @param m 变换的矩阵。
     * @param pos 变换的位置部分。
     * @param rot 变换的旋转部分。
     * @param scale 变换的缩放部分。
     * @param out 变换的目标。
     */
    public transform (m: Mat4, pos: Vec3 | null, rot: Quat | null, scale: Vec3 | null, out: aabb) {
        Vec3.transformMat4(out.center, this.center, m);
        transform_extent_m4(out.halfExtents, this.halfExtents, m);
    }

    /**
     * @zh
     * 获得克隆。
     * @returns {aabb}
     */
    public clone (): aabb {
        return aabb.clone(this);
    }

    /**
     * @zh
     * 拷贝对象。
     * @param a 拷贝的目标。
     * @returns {aabb}
     */
    public copy (a: aabb): aabb {
        return aabb.copy(this, a);
    }
}
