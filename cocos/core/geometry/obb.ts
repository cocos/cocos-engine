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

import { Mat3, Mat4, Quat, Vec3 } from '../math';
import enums from './enums';

const _v3_tmp = new Vec3();
const _v3_tmp2 = new Vec3();
const _m3_tmp = new Mat3();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m3 = (out: Vec3, extent: Vec3, m3: Mat3) => {
    _m3_tmp.m00 = Math.abs(m3.m00); _m3_tmp.m01 = Math.abs(m3.m01); _m3_tmp.m02 = Math.abs(m3.m02);
    _m3_tmp.m03 = Math.abs(m3.m03); _m3_tmp.m04 = Math.abs(m3.m04); _m3_tmp.m05 = Math.abs(m3.m05);
    _m3_tmp.m06 = Math.abs(m3.m06); _m3_tmp.m07 = Math.abs(m3.m07); _m3_tmp.m08 = Math.abs(m3.m08);
    Vec3.transformMat3(out, extent, _m3_tmp);
};

/**
 * @en
 * Basic Geometry: directional bounding box.
 * @zh
 * 基础几何  方向包围盒。
 */

export class OBB {
    /**
     * @en
     * create a new obb
     * @zh
     * 创建一个新的 obb 实例。
     * @param cx @zh 形状的相对于原点的 X 坐标。 @en The x coordinate of origin.
     * @param cy @zh 形状的相对于原点的 Y 坐标。 @en The y coordinate of origin.
     * @param cz @zh 形状的相对于原点的 Z 坐标。 @en The z coordinate of origin.
     * @param hw @zh - obb 宽度的一半。 @en Half the width of the OBB.
     * @param hh @zh - obb 高度的一半。 @en Half the height of the OBB.
     * @param hl @zh - obb 长度的一半。 @en Half the length of the OBB.
     * @param ox_1 @zh 方向矩阵参数。 @en The x component of the one axis of the OBB.
     * @param ox_2 @zh 方向矩阵参数。 @en The x component of the second axis of the OBB.
     * @param ox_3 @zh 方向矩阵参数。 @en The x component of the third axis of the OBB.
     * @param oy_1 @zh 方向矩阵参数。 @en The y component of the one axis of the OBB.
     * @param oy_2 @zh 方向矩阵参数。 @en The y component of the second axis of the OBB.
     * @param oy_3 @zh 方向矩阵参数。 @en The y component of the third axis of the OBB.
     * @param oz_1 @zh 方向矩阵参数。 @en The z component of the one axis of the OBB.
     * @param oz_2 @zh 方向矩阵参数。 @en The z component of the second axis of the OBB.
     * @param oz_3 @zh 方向矩阵参数。 @en The z component of the third axis of the OBB.
     * @return @zh 返回一个 obb。 @en A new OBB.
     */
    public static create (
        cx: number, cy: number, cz: number,
        hw: number, hh: number, hl: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number,
    ) {
        return new OBB(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }

    /**
     * @en
     * clone a new obb
     * @zh
     * 克隆一个 obb。
     * @param a @zh 克隆的目标。 @en The input OBB.
     * @returns @zh The new OBB.  @en 克隆出的新对象。
     */
    public static clone (a: OBB) {
        return new OBB(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z,
            a.orientation.m00, a.orientation.m01, a.orientation.m02,
            a.orientation.m03, a.orientation.m04, a.orientation.m05,
            a.orientation.m06, a.orientation.m07, a.orientation.m08);
    }

    /**
     * @en
     * copy the values from one obb to another
     * @zh
     * 将从一个 obb 的值复制到另一个 obb。
     * @param  out @zh 接受操作的 obb。 @en The output OBB.
     * @param  a @zh 被复制的 obb。 @en The input OBB.
     * @returns  @zh out 接受操作的 obb。 @en The reference of the first parameter `out`.
     */
    public static copy (out: OBB, a: OBB): OBB {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);
        Mat3.copy(out.orientation, a.orientation);

        return out;
    }

    /**
     * @en
     * create a new obb from two corner points
     * @zh
     * 用两个点创建一个新的 obb。
     * @param out @zh - 接受操作的 obb。 @en The output OBB.
     * @param minPos @zh - obb 的最小点。 @en The minimum position of the AABB.
     * @param maxPos @zh - obb 的最大点。 @en The maximum position of the AABB.
     * @returns @zh {OBB} out 接受操作的 obb。 @en The reference of the first parameter `out`.
     */
    public static fromPoints (out: OBB, minPos: Vec3, maxPos: Vec3): OBB {
        Vec3.multiplyScalar(out.center, Vec3.add(_v3_tmp, minPos, maxPos), 0.5);
        Vec3.multiplyScalar(out.halfExtents, Vec3.subtract(_v3_tmp2, maxPos, minPos), 0.5);
        Mat3.identity(out.orientation);
        return out;
    }

    /**
     * @en
     * Set the components of a obb to the given values
     * @zh
     * 将给定 obb 的属性设置为给定的值。
     * @param out @zh 目标 OBB @en The output OBB.
     * @param cx @zh 形状的相对于原点的 X 坐标。 @en The x coordinate of origin.
     * @param cy @zh 形状的相对于原点的 Y 坐标。 @en The y coordinate of origin.
     * @param cz @zh 形状的相对于原点的 Z 坐标。 @en The z coordinate of origin.
     * @param hw @zh - obb 宽度的一半。 @en Half the width of the OBB.
     * @param hh @zh - obb 高度的一半。 @en Half the height of the OBB.
     * @param hl @zh - obb 长度的一半。 @en Half the length of the OBB.
     * @param ox_1 @zh 方向矩阵参数。 @en The x component of the one axis of the OBB.
     * @param ox_2 @zh 方向矩阵参数。 @en The x component of the second axis of the OBB.
     * @param ox_3 @zh 方向矩阵参数。 @en The x component of the third axis of the OBB.
     * @param oy_1 @zh 方向矩阵参数。 @en The y component of the one axis of the OBB.
     * @param oy_2 @zh 方向矩阵参数。 @en The y component of the second axis of the OBB.
     * @param oy_3 @zh 方向矩阵参数。 @en The y component of the third axis of the OBB.
     * @param oz_1 @zh 方向矩阵参数。 @en The z component of the one axis of the OBB.
     * @param oz_2 @zh 方向矩阵参数。 @en The z component of the second axis of the OBB.
     * @param oz_3 @zh 方向矩阵参数。 @en The z component of the third axis of the OBB.
     * @returns @zh out 接受操作的 OBB @en The reference of the first parameter `out`.
     */
    public static set (
        out: OBB,
        cx: number, cy: number, cz: number,
        hw: number, hh: number, hl: number,
        ox_1: number, ox_2: number, ox_3: number,
        oy_1: number, oy_2: number, oy_3: number,
        oz_1: number, oz_2: number, oz_3: number,
    ): OBB {
        Vec3.set(out.center, cx, cy, cz);
        Vec3.set(out.halfExtents, hw, hh, hl);
        Mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
        return out;
    }

    /**
     * @en
     * Center point of the OBB.
     * @zh
     * 本地坐标的中心点。
     */
    public center: Vec3;

    /**
     * @en
     * Half the distance across the OBB in each local axis.
     * @zh
     * 长宽高的一半。
     */
    public halfExtents: Vec3;

    /**
     * @en
     * Orientation matrix.
     * @zh
     * 方向矩阵。
     */
    public orientation: Mat3;

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

    constructor (cx = 0, cy = 0, cz = 0,
        hw = 1, hh = 1, hl = 1,
        ox_1 = 1, ox_2 = 0, ox_3 = 0,
        oy_1 = 0, oy_2 = 1, oy_3 = 0,
        oz_1 = 0, oz_2 = 0, oz_3 = 1) {
        this._type = enums.SHAPE_OBB;
        this.center = new Vec3(cx, cy, cz);
        this.halfExtents = new Vec3(hw, hh, hl);
        this.orientation = new Mat3(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }

    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 obb 的最小点和最大点。
     * @param minPos @zh 最小点。 @en The out minimum position of the OBB.
     * @param maxPos @zh 最大点。 @en The out maximum position of the OBB.
     */
    public getBoundary (minPos: Vec3, maxPos: Vec3) {
        transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);
        Vec3.subtract(minPos, this.center, _v3_tmp);
        Vec3.add(maxPos, this.center, _v3_tmp);
    }

    /**
     * @en
     * Transform this shape
     * @zh
     * 将 out 根据这个 obb 的数据进行变换。
     * @param m @zh 变换的矩阵。 @en The transform matrix
     * @param pos @zh 变换的位置部分。 @en 3d-vector translation.
     * @param rot @zh 变换的旋转部分。 @en Quaternion rotation.
     * @param scale @zh 变换的缩放部分。 @en 3d-vector scale.
     * @param out @zh 变换的目标。 @en The output OBB.
     */
    public transform (m: Mat4, pos: Vec3, rot: Quat, scale: Vec3, out: OBB) {
        Vec3.transformMat4(out.center, this.center, m);
        // parent shape doesn't contain rotations for now
        Mat3.fromQuat(out.orientation, rot);
        Vec3.multiply(out.halfExtents, this.halfExtents, scale);
    }

    /**
     * @en
     * Transform by matrix and rotation.
     * @zh
     * 将 out 根据这个 obb 的数据进行变换。
     * @param m @zh 变换的矩阵。 @en The transform matrix.
     * @param rot @zh 变换的旋转部分。 @en Quaternion rotation.
     * @param out @zh 变换的目标。 @en The output OBB.
     */
    public translateAndRotate (m: Mat4, rot: Quat, out: OBB) {
        Vec3.transformMat4(out.center, this.center, m);
        // parent shape doesn't contain rotations for now
        Mat3.fromQuat(out.orientation, rot);
    }

    /**
     * @en
     * Scale OBB by a 3d-vector.
     * @zh
     *  将 out 根据这个 obb 的数据进行缩放。
     * @param scale @zh 缩放值。 @en 3d-vector scale.
     * @param out @zh 缩放的目标。 @en The output OBB.
     */
    public setScale (scale: Vec3, out: OBB) {
        Vec3.multiply(out.halfExtents, this.halfExtents, scale);
    }
}
