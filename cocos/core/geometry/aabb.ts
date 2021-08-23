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

import { JSB } from 'internal:constants';
import { Mat3, Mat4, Quat, Vec3 } from '../math';
import enums from './enums';
import { FloatArray, IVec3, IVec3Like } from '../math/type-define';
import { Sphere } from './sphere';
import { AABBHandle, AABBPool, AABBView, NULL_HANDLE } from '../renderer/core/memory-pools';
import { NativeAABB } from '../renderer/scene/native-scene';
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
      * @param px - AABB 的原点的 X 坐标。
      * @param py - AABB 的原点的 Y 坐标。
      * @param pz - AABB 的原点的 Z 坐标。
      * @param hw - AABB 宽度的一半。
      * @param hh - AABB 高度的一半。
      * @param hl - AABB 长度的一半。
      * @returns 返回新创建的 AABB 实例。
      */
    public static create (px?: number, py?: number, pz?: number, hw?: number, hh?: number, hl?: number) {
        return new AABB(px, py, pz, hw, hh, hl);
    }

    /**
      * @en
      * clone a new AABB
      * @zh
      * 克隆一个 AABB。
      * @param a - 克隆的目标。
      * @returns 克隆出的 AABB。
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
      * @param {AABB} out 接受操作的 AABB。
      * @param {AABB} a 被复制的 AABB。
      * @return {AABB} out 接受操作的 AABB。
      */
    public static copy (out: AABB, a: AABB | Readonly<AABB>): AABB {
        Vec3.copy(out.center, a.center);
        Vec3.copy(out.halfExtents, a.halfExtents);

        return out;
    }

    /**
      * @en
      * create a new AABB from two corner points
      * @zh
      * 从两个点创建一个新的 AABB。
      * @param out - 接受操作的 AABB。
      * @param minPos - AABB 的最小点。
      * @param maxPos - AABB 的最大点。
      * @returns {AABB} out 接受操作的 AABB。
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
      * @param {AABB} out 接受操作的 AABB。
      * @param px - AABB 的原点的 X 坐标。
      * @param py - AABB 的原点的 Y 坐标。
      * @param pz - AABB 的原点的 Z 坐标。
      * @param hw - AABB 宽度的一半。
      * @param hh - AABB 高度的一半。
      * @param hl - AABB 长度度的一半。
      * @return {AABB} out 接受操作的 AABB。
      */
    public static set (out: AABB, px: number, py: number, pz: number, hw: number, hh: number, hl: number): AABB {
        out.center.set(px, py, pz);
        out.halfExtents.set(hw, hh, hl);
        return out;
    }

    /**
      * @en
      * Merge tow AABB.
      * @zh
      * 合并两个 AABB 到 out。
      * @param out 接受操作的 AABB。
      * @param a 输入的 AABB。
      * @param b 输入的 AABB。
      * @returns {AABB} out 接受操作的 AABB。
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
      * AABB to sphere
      * @zh
      * 包围盒转包围球
      * @param out 接受操作的 sphere。
      * @param a 输入的 AABB。
      */
    public static toBoundingSphere (out: Sphere, a: AABB | Readonly<AABB>) {
        a.getBoundary(_v3_tmp, _v3_tmp2);

        // Initialize sphere
        out.center.set(_v3_tmp);
        out.radius = 0.0;

        // Calculate sphere
        Vec3.subtract(_v3_tmp3, _v3_tmp2, out.center);
        const dist = _v3_tmp3.length();

        const half = dist * 0.5;
        out.radius += half;
        Vec3.multiplyScalar(_v3_tmp3, _v3_tmp3, half / dist);
        Vec3.add(out.center, out.center, _v3_tmp3);

        return out;
    }

    /**
      * @en
      * Transform this AABB.
      * @zh
      * 变换一个 AABB 到 out 中。
      * @param out 接受操作的 AABB。
      * @param a 输入的源 AABB。
      * @param matrix 矩阵。
      * @returns {AABB} out 接受操作的 AABB。
      */
    public static transform (out: AABB, a: AABB | Readonly<AABB>, matrix: Mat4 | Readonly<Mat4>): AABB {
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
    protected _aabbHandle: AABBHandle = NULL_HANDLE;
    protected declare _nativeObj: NativeAABB;
    constructor (px = 0, py = 0, pz = 0, hw = 1, hh = 1, hl = 1) {
        this._type = enums.SHAPE_AABB;
        if (JSB) {
            // new aabb
            this._aabbHandle = AABBPool.alloc();
            this.center = new Vec3(AABBPool.getTypedArray(this._aabbHandle, AABBView.CENTER) as any);
            this.halfExtents = new Vec3(AABBPool.getTypedArray(this._aabbHandle, AABBView.HALFEXTENTS) as any);
            this.center.set(px, py, pz);
            this.halfExtents.set(hw, hh, hl);
            this._nativeObj = new NativeAABB();
            this._nativeObj.initWithData(AABBPool.getBuffer(this._aabbHandle));
            return;
        }
        this.center = new Vec3(px, py, pz);
        this.halfExtents = new Vec3(hw, hh, hl);
    }

    get native (): NativeAABB {
        return this._nativeObj;
    }

    /**
      * @en
      * Get the bounding points of this shape
      * @zh
      * 获取 AABB 的最小点和最大点。
      * @param {Vec3} minPos 最小点。
      * @param {Vec3} maxPos 最大点。
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
      * @param m 变换的矩阵。
      * @param pos 变换的位置部分。
      * @param rot 变换的旋转部分。
      * @param scale 变换的缩放部分。
      * @param out 变换的目标。
      */
    public transform (m: Mat4, pos: Vec3 | null, rot: Quat | null, scale: Vec3 | null, out: AABB) {
        Vec3.transformMat4(out.center, this.center, m);
        transform_extent_m4(out.halfExtents, this.halfExtents, m);
    }

    /**
      * @zh
      * 获得克隆。
      * @returns {AABB}
      */
    public clone (): AABB {
        return AABB.clone(this);
    }

    /**
      * @zh
      * 拷贝对象。
      * @param a 拷贝的目标。
      * @returns {AABB}
      */
    public copy (a: AABB | Readonly<AABB>): AABB {
        return AABB.copy(this, a);
    }

    /**
      * @en AABB bounding box merges a vertex.
      * @zh AABB包围盒合并一个顶点。
      * @param point - 某一个位置的顶点。
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
        * @en AABB bounding box merges vertexes.
        * @zh
        * AABB包围盒合并一系列顶点。
        * @param points - 某一个位置的顶点。
        */
    public mergePoints (points: IVec3[]) {
        if (points.length < 1) { return; }
        for (let i = 0; i < points.length; i++) {
            this.mergePoint(points[i]);
        }
    }

    /**
      * @en Frustum merge to AABB.
      * @zh Frustum 合并 到 AABB。
      * @param frustum 输入的 Frustum。
      */
    public mergeFrustum (frustum: Frustum | Readonly<Frustum>) {
        return this.mergePoints(frustum.vertices);
    }
}
