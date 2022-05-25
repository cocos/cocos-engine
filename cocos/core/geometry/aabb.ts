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
import { IVec3, IVec3Like } from '../math/type-define';
import { Sphere } from './sphere';
import { Frustum } from './frustum';

const _v3_tmp = new Vec3();
const _v3_tmp2 = new Vec3();
const _v3_tmp3 = new Vec3();
const _v3_tmp4 = new Vec3();
const _m3_tmp = new Mat3();

// https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/
const transform_extent_m4 = (out: Vec3, extent: Vec3, m4: Mat4 | Readonly<Mat4>) => {
    _m3_tmp.m00 = Math.abs(m4.m00); _m3_tmp.m01 = Math.abs(m4.m01); _m3_tmp.m02 = Math.abs(m4.m02);
    _m3_tmp.m03 = Math.abs(m4.m04); _m3_tmp.m04 = Math.abs(m4.m05); _m3_tmp.m05 = Math.abs(m4.m06);
    _m3_tmp.m06 = Math.abs(m4.m08); _m3_tmp.m07 = Math.abs(m4.m09); _m3_tmp.m08 = Math.abs(m4.m10);
    Vec3.transformMat3(out, extent, _m3_tmp);
};

/**
  * @en
  * Basic Geometry: Axis-aligned bounding box, using center and half extents structure.
  * @zh
  * 基础几何  轴对齐包围盒，使用中心点和半长宽高的结构。
  */

export class AABB {
    /**
      * @en
      * create a new AABB
      * @zh
      * 创建一个新的 AABB 实例。
      * @param px @zh AABB 的原点的 X 坐标。@en The x coordinate of the origin of the AABB.
      * @param py @zh AABB 的原点的 Y 坐标。@en The y coordinate of the origin of the AABB.
      * @param pz @zh AABB 的原点的 Z 坐标。 @en The z coordinate of the origin of the AABB.
      * @param hw @zh AABB 宽度的一半。 @en Half the width of the AABB.
      * @param hh @zh AABB 高度的一半。@en Half the height of the AABB.
      * @param hl @zh AABB 长度的一半。@en Half the length of the AABB.
      * @returns @zh 返回新创建的 AABB 实例。 @en A new instance of AABB.
      */
    public static create (px?: number, py?: number, pz?: number, hw?: number, hh?: number, hl?: number) {
        return new AABB(px, py, pz, hw, hh, hl);
    }

    /**
      * @en
      * clone a new AABB
      * @zh
      * 克隆一个 AABB。
      * @param a @zh 克隆的目标。 @en Target object.
      * @returns @zh 克隆出的 AABB。@en The new AABB.
      */
    public static clone (a: AABB | Readonly<AABB>) {
        return new AABB(a.center.x, a.center.y, a.center.z,
            a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
    }

    /**
      * @en
      * copy the values from one AABB to another
      * @zh
      * 将从一个 AABB 的值复制到另一个 AABB。
      * @param out @zh 接受操作的 AABB。 @en The output AABB, copy destination.
      * @param a @zh 被复制的 AABB。 @en Source object of copy operation.
      * @returns @zh 接受操作的 AABB。 @en The reference of the first parameter `dst`, the new AABB.
      */
    public static copy (out: AABB, a: AABB | Readonly<AABB>): AABB {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);

        return out;
    }

    /**
      * @en
      * Construct a new AABB from two corner points
      * @zh
      * 从两个点创建一个新的 AABB。
      * @param out @zh 接受操作的 AABB。 @en The output AABB
      * @param minPos @zh AABB 的最小点。 @en Minimum point of the axis-aligned 3d bounding box.
      * @param maxPos @zh AABB 的最大点。 @en Maximum point of the axis-aligned 3d bounding box.
      * @returns @zh out 接受操作的 AABB。 @en The new AABB
      */
    public static fromPoints (out: AABB, minPos: IVec3, maxPos: IVec3): AABB {
        Vec3.add(_v3_tmp, maxPos, minPos);
        Vec3.subtract(_v3_tmp2, maxPos, minPos);
        Vec3.multiplyScalar(out.center, _v3_tmp, 0.5);
        Vec3.multiplyScalar(out.halfExtents, _v3_tmp2, 0.5);
        return out;
    }

    /**
      * @en
      * Set the components of a AABB to the given values
      * @zh
      * 将 AABB 的属性设置为给定的值。
      * @param @zh out 接受操作的 AABB。 @en The output AABB to set.
      * @param px @zh - AABB 的原点的 X 坐标。 @en The x coordinate of the origin of the AABB.
      * @param py @zh - AABB 的原点的 Y 坐标。 @en The y coordinate of the origin of the AABB.
      * @param pz @zh - AABB 的原点的 Z 坐标。 @en The z coordinate of the origin of the AABB.
      * @param hw @zh - AABB 宽度的一半。 @en Half the width of the AABB.
      * @param hh @zh - AABB 高度的一半。 @en Half the height of the AABB.
      * @param hl @zh - AABB 长度度的一半。 @en Half the length of the AABB.
      * @returns @zh out 接受操作的 AABB。 @en The reference fo the first parameter `out`.
      */
    public static set (out: AABB, px: number, py: number, pz: number, hw: number, hh: number, hl: number): AABB {
        out.center.set(px, py, pz);
        out.halfExtents.set(hw, hh, hl);
        return out;
    }

    /**
      * @en
      * Merge two AABB into one.
      * @zh
      * 合并两个 AABB 到 out。
      * @param out @zh 接受操作的 AABB。 @en The output AABB to storge merge result.
      * @param a @zh 输入的 AABB。 @en The first AABB to be merged.
      * @param b @zh 输入的 AABB。 @en The second AABB to be merged.
      * @returns @zh out 接受操作的 AABB。 @en The reference of the first parameter `out`.
      */
    public static merge (out: AABB, a: AABB | Readonly<AABB>, b: AABB | Readonly<AABB>): AABB {
        Vec3.subtract(_v3_tmp, a.center, a.halfExtents);
        Vec3.subtract(_v3_tmp2, b.center, b.halfExtents);
        Vec3.add(_v3_tmp3, a.center, a.halfExtents);
        Vec3.add(_v3_tmp4, b.center, b.halfExtents);
        Vec3.max(_v3_tmp4, _v3_tmp3, _v3_tmp4);
        Vec3.min(_v3_tmp3, _v3_tmp, _v3_tmp2);
        return AABB.fromPoints(out, _v3_tmp3, _v3_tmp4);
    }

    /**
      * @en
      * Convert AABB to sphere.
      * @zh
      * 包围盒转包围球
      * @param out @zh 接受操作的 sphere。 @en The output sphere.
      * @param a @zh 输入的 AABB。 @en The input AABB.
      * @returns @zh out 接受的 Sphere @en The reference of the first parameter `out`.
      */
    public static toBoundingSphere (out: Sphere, a: AABB | Readonly<AABB>) {
        out.center.set(a.center);
        out.radius = a.halfExtents.length();
        return out;
    }

    /**
      * @en
      * Transform this AABB.
      * @zh
      * 变换一个 AABB 到 out 中。
      * @param out @zh 接受操作的 AABB。 @en The output AABB.
      * @param a @zh 输入的源 AABB。 @en The input AABB.
      * @param matrix @zh 矩阵。 @en The transformation matrix.
      * @returns @zh {AABB} out 接受操作的 AABB。 @en The reference of the first parameter `out`.
      */
    public static transform (out: AABB, a: AABB | Readonly<AABB>, matrix: Mat4 | Readonly<Mat4>): AABB {
        Vec3.transformMat4(out.center, a.center, matrix);
        transform_extent_m4(out.halfExtents, a.halfExtents, matrix);
        return out;
    }

    /**
      * @en
      * The origin point of the AABB
      * @zh
      * 本地坐标的中心点。
      */
    public center: Vec3;

    /**
      * @en
      * Half the size of the AABB
      * @zh
      * 长宽高的一半。
      */
    public halfExtents: Vec3;

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
    constructor (px = 0, py = 0, pz = 0, hw = 1, hh = 1, hl = 1) {
        this._type = enums.SHAPE_AABB;

        this.center = new Vec3(px, py, pz);
        this.halfExtents = new Vec3(hw, hh, hl);
    }

    /**
      * @en
      * Get the bounding points of this shape
      * @zh
      * 获取 AABB 的最小点和最大点。
      * @param minPos @zh 最小点。 @en Minimum position of the axis-aligned 3d bounding box.
      * @param maxPos @zh 最大点。 @en Maximum position of the axis-aligned 3d bounding box.
      */
    public getBoundary (minPos: IVec3Like, maxPos: IVec3Like) {
        Vec3.subtract(minPos, this.center, this.halfExtents);
        Vec3.add(maxPos, this.center, this.halfExtents);
    }

    /**
      * @en
      * Transform this shape
      * @zh
      * 将 out 根据这个 AABB 的数据进行变换。
      * @param m @zh 变换的矩阵。 @en The transform matrix.
      * @param pos @zh 变换的位置部分。 @en 3d-vector translation.
      * @param rot @zh 变换的旋转部分。 @en Quaternion rotation .
      * @param scale @zh 变换的缩放部分。 @en 3d-vector scale.
      * @param out @zh 变换的目标。 @en The output AABB.
      */
    public transform (m: Mat4, pos: Vec3 | null, rot: Quat | null, scale: Vec3 | null, out: AABB) {
        Vec3.transformMat4(out.center, this.center, m);
        transform_extent_m4(out.halfExtents, this.halfExtents, m);
    }

    /**
      * @en
      * Clones the AABB
      * @zh
      * 获得克隆。
      * @returns @zh {AABB} @en A copy of the object.
      */
    public clone (): AABB {
        return AABB.clone(this);
    }

    /**
      * @en
      * Copy the input to the receiver object.
      * @zh
      * 拷贝对象。
      * @param a @zh 拷贝的目标。 @en Copy target
      * @returns @zh This object @en The reference of this.
      */
    public copy (a: AABB | Readonly<AABB>): AABB {
        return AABB.copy(this, a);
    }

    /**
      * @en AABB and point merge.
      * @zh AABB包围盒合并一个顶点。
      * @param point @zh - 某一个位置的顶点。 @en A point in 3d space.
      */
    public mergePoint (point: IVec3) {
        // _v3_tmp is min pos
        // _v3_tmp2 is max pos
        this.getBoundary(_v3_tmp, _v3_tmp2);
        if (point.x < _v3_tmp.x) { _v3_tmp.x = point.x; }
        if (point.y < _v3_tmp.y) { _v3_tmp.y = point.y; }
        if (point.z < _v3_tmp.z) { _v3_tmp.z = point.z; }
        if (point.x > _v3_tmp2.x) { _v3_tmp2.x = point.x; }
        if (point.y > _v3_tmp2.y) { _v3_tmp2.y = point.y; }
        if (point.z > _v3_tmp2.z) { _v3_tmp2.z = point.z; }

        // _v3_tmp3 is center pos
        Vec3.add(_v3_tmp3, _v3_tmp, _v3_tmp2);
        this.center.set(Vec3.multiplyScalar(_v3_tmp3, _v3_tmp3, 0.5));
        this.halfExtents.set(_v3_tmp2.x - _v3_tmp3.x, _v3_tmp2.y - _v3_tmp3.y, _v3_tmp2.z - _v3_tmp3.z);
    }

    /**
      * @en AABB and points merge.
      * @zh AABB包围盒合并一系列顶点。
      * @param points @zh - 某一个位置的顶点。 @en A list of points in 3d space.
      */
    public mergePoints (points: IVec3[]) {
        if (points.length < 1) { return; }
        for (let i = 0; i < points.length; i++) {
            this.mergePoint(points[i]);
        }
    }

    /**
      * @en AABB and frustum merge.
      * @zh Frustum 合并到 AABB。
      * @param frustum @zh 输入的 Frustum。 @en The frustum object.
      */
    public mergeFrustum (frustum: Frustum | Readonly<Frustum>) {
        return this.mergePoints(frustum.vertices);
    }
}
