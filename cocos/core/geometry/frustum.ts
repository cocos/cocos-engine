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

import { Mat4, Vec3 } from '../math';
import { Camera } from '../renderer/scene';
import enums from './enums';
import { Plane } from './plane';
import { AABB } from './aabb';

const _v = new Array(8);
_v[0] = new Vec3(1, 1, 1);
_v[1] = new Vec3(-1, 1, 1);
_v[2] = new Vec3(-1, -1, 1);
_v[3] = new Vec3(1, -1, 1);
_v[4] = new Vec3(1, 1, -1);
_v[5] = new Vec3(-1, 1, -1);
_v[6] = new Vec3(-1, -1, -1);
_v[7] = new Vec3(1, -1, -1);

const _nearTemp = new Vec3();
const _farTemp = new Vec3();
const _temp_v3 = new Vec3();

/**
 * @en
 * Basic Geometry: frustum.
 * @zh
 * 基础几何 截头锥体。
 */

export class Frustum {
    /**
     * @en
     * Create an orthogonal frustum.
     * @zh
     * 创建一个正交视锥体。
     * @param out @en The result orthogonal frustum. @zh 输出的正交视锥体。
     * @param width @en The width of the frustum. @zh 正交视锥体的宽度。
     * @param height @en The height of the frustum. @zh 正交视锥体的高度。
     * @param near @en The near plane of the frustum. @zh 正交视锥体的近平面值。
     * @param far @en The far plane of the frustum. @zh 正交视锥体的远平面值。
     * @param transform @en The transform matrix of the frustum. @zh 正交视锥体的变换矩阵。
     * @return @en The out object @zh 返回正交视锥体.
     */
    public static createOrtho = (() => (out: Frustum, width: number, height: number, near: number, far: number, transform: Mat4) => {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        Vec3.set(_temp_v3, halfWidth, halfHeight, -near);
        Vec3.transformMat4(out.vertices[0], _temp_v3, transform);
        Vec3.set(_temp_v3, -halfWidth, halfHeight, -near);
        Vec3.transformMat4(out.vertices[1], _temp_v3, transform);
        Vec3.set(_temp_v3, -halfWidth, -halfHeight, -near);
        Vec3.transformMat4(out.vertices[2], _temp_v3, transform);
        Vec3.set(_temp_v3, halfWidth, -halfHeight, -near);
        Vec3.transformMat4(out.vertices[3], _temp_v3, transform);
        Vec3.set(_temp_v3, halfWidth, halfHeight, -far);
        Vec3.transformMat4(out.vertices[4], _temp_v3, transform);
        Vec3.set(_temp_v3, -halfWidth, halfHeight, -far);
        Vec3.transformMat4(out.vertices[5], _temp_v3, transform);
        Vec3.set(_temp_v3, -halfWidth, -halfHeight, -far);
        Vec3.transformMat4(out.vertices[6], _temp_v3, transform);
        Vec3.set(_temp_v3, halfWidth, -halfHeight, -far);
        Vec3.transformMat4(out.vertices[7], _temp_v3, transform);

        Plane.fromPoints(out.planes[0], out.vertices[1], out.vertices[6], out.vertices[5]);
        Plane.fromPoints(out.planes[1], out.vertices[3], out.vertices[4], out.vertices[7]);
        Plane.fromPoints(out.planes[2], out.vertices[6], out.vertices[3], out.vertices[7]);
        Plane.fromPoints(out.planes[3], out.vertices[0], out.vertices[5], out.vertices[4]);
        Plane.fromPoints(out.planes[4], out.vertices[2], out.vertices[0], out.vertices[3]);
        Plane.fromPoints(out.planes[5], out.vertices[7], out.vertices[5], out.vertices[6]);
    })();

    /**
     * @en Create a frustum from an AABB box.
     * @zh 从 AABB 包围盒中创建一个视锥体。
     * @param out @en The result frustum @zh 输出的视锥体对象。
     * @param aabb @en The AABB bounding box of the frustum @zh AABB 包围盒。
     * @return @en The out object @zh 返回视锥体.
     */
    public static createFromAABB (out: Frustum, aabb: AABB | Readonly<AABB>) : Frustum {
        const vec3_min = new Vec3(); const vec3_max = new Vec3();
        Vec3.subtract(vec3_min, aabb.center, aabb.halfExtents);
        Vec3.add(vec3_max, aabb.center, aabb.halfExtents);

        out.vertices[0].set(vec3_min.x, vec3_max.y, vec3_min.z);
        out.vertices[1].set(vec3_max.x, vec3_max.y, vec3_min.z);
        out.vertices[2].set(vec3_max.x, vec3_min.y, vec3_min.z);
        out.vertices[3].set(vec3_min.x, vec3_min.y, vec3_min.z);
        out.vertices[4].set(vec3_min.x, vec3_max.y, vec3_max.z);
        out.vertices[5].set(vec3_max.x, vec3_max.y, vec3_max.z);
        out.vertices[6].set(vec3_max.x, vec3_min.y, vec3_max.z);
        out.vertices[7].set(vec3_min.x, vec3_min.y, vec3_max.z);

        if (out._type !== enums.SHAPE_FRUSTUM_ACCURATE) {
            return out;
        }

        out.updatePlanes();

        return out;
    }

    /**
     * @en Calculate the splitted frustum.
     * @zh 创建一个新的截锥体。
     * @param out @en The output frustum @zh 输出的新截锥体
     * @param camera @en The camera of the frustum @zh 相机参数
     * @param m @en The transform matrix @zh 变换矩阵
     * @param start @en The split start position @zh 分割开始位置
     * @param end @en The split end position @zh 分割末尾位置
     * @return @en The out object @zh 返回新截锥体.
     */
    public static split (out: Frustum, camera: Camera, m: Mat4, start: number, end: number): Frustum {
        // 0: cameraNear  1:cameraFar
        const h = Math.tan(camera.fov * 0.5);
        const w = h * camera.aspect;
        _nearTemp.set(start * w,  start * h, start);
        _farTemp.set(end * w, end * h, end);

        const vertexes = out.vertices;
        // startHalfWidth startHalfHeight
        _temp_v3.set(_nearTemp.x, _nearTemp.y, _nearTemp.z);
        Vec3.transformMat4(vertexes[0], _temp_v3, m);
        _temp_v3.set(-_nearTemp.x, _nearTemp.y, _nearTemp.z);
        Vec3.transformMat4(vertexes[1], _temp_v3, m);
        _temp_v3.set(-_nearTemp.x, -_nearTemp.y, _nearTemp.z);
        Vec3.transformMat4(vertexes[2], _temp_v3, m);
        _temp_v3.set(_nearTemp.x, -_nearTemp.y, _nearTemp.z);
        Vec3.transformMat4(vertexes[3], _temp_v3, m);

        // endHalfWidth, endHalfHeight
        _temp_v3.set(_farTemp.x, _farTemp.y, _farTemp.z);
        Vec3.transformMat4(vertexes[4], _temp_v3, m);
        _temp_v3.set(-_farTemp.x, _farTemp.y, _farTemp.z);
        Vec3.transformMat4(vertexes[5], _temp_v3, m);
        _temp_v3.set(-_farTemp.x, -_farTemp.y, _farTemp.z);
        Vec3.transformMat4(vertexes[6], _temp_v3, m);
        _temp_v3.set(_farTemp.x, -_farTemp.y, _farTemp.z);
        Vec3.transformMat4(vertexes[7], _temp_v3, m);

        out.updatePlanes();
        return out;
    }

    /**
     * @en
     * Create a new frustum.
     * @zh
     * 创建一个新的截锥体。
     * @return @en An empty frustum. @zh 一个空截椎体
     */
    public static create (): Frustum {
        return new Frustum();
    }

    /**
     * @en
     * Clone a frustum.
     * @zh
     * 克隆一个截锥体。
     * @param f @en The frustum to clone from @zh 用于克隆的截锥体
     * @return @en The cloned frustum @zh 克隆出的新截锥体
     */
    public static clone (f: Frustum): Frustum {
        return Frustum.copy(new Frustum(), f);
    }

    /**
     * @en
     * Copy the values from one frustum to another.
     * @zh
     * 从一个视锥体拷贝到另一个视锥体。
     * @param out @en The result frustum @zh 用于存储拷贝数据的截锥体
     * @param f @en The frustum to copy from @zh 用于克隆的截锥体
     * @return @en The out object @zh 传入的 out 对象
     */
    public static copy (out: Frustum, f: Readonly<Frustum>): Frustum {
        out._type = f.type;
        for (let i = 0; i < 6; ++i) {
            Plane.copy(out.planes[i], f.planes[i]);
        }
        for (let i = 0; i < 8; ++i) {
            Vec3.copy(out.vertices[i], f.vertices[i]);
        }
        return out;
    }

    /**
     * @en
     * Set whether to use accurate intersection testing function on this frustum.
     * @zh
     * 设置是否在此截锥体上使用精确的相交测试函数。
     */
    set accurate (b: boolean) {
        this._type = b ? enums.SHAPE_FRUSTUM_ACCURATE : enums.SHAPE_FRUSTUM;
    }

    /**
     * @en
     * Gets the type of the shape.
     * @zh
     * 获取形状的类型。
     * @readonly
     */
    get type () {
        return this._type;
    }

    public planes: Plane[];
    public vertices: Vec3[];

    protected _type: number;

    constructor () {
        this._type = enums.SHAPE_FRUSTUM;
        this.planes = new Array(6);
        for (let i = 0; i < 6; ++i) {
            this.planes[i] = Plane.create(0, 0, 0, 0);
        }
        this.vertices = new Array(8);
        for (let i = 0; i < 8; ++i) {
            this.vertices[i] = new Vec3();
        }
    }

    /**
     * @en
     * Update the frustum information according to the given transform matrix.
     * Note that the resulting planes are not normalized under normal mode.
     * @zh
     * 根据给定的变换矩阵更新截锥体信息，注意得到的平面不是在标准模式下归一化的。
     * @param m @en The view-projection matrix @zh 视图投影矩阵
     * @param inv @en The inverse view-projection matrix @zh 视图投影逆矩阵
     */
    public update (m: Mat4, inv: Mat4) {
        // RTR4, ch. 22.14.1, p. 983
        // extract frustum planes from view-proj matrix.

        // left plane
        Vec3.set(this.planes[0].n, m.m03 + m.m00, m.m07 + m.m04, m.m11 + m.m08);
        this.planes[0].d = -(m.m15 + m.m12);
        // right plane
        Vec3.set(this.planes[1].n, m.m03 - m.m00, m.m07 - m.m04, m.m11 - m.m08);
        this.planes[1].d = -(m.m15 - m.m12);
        // bottom plane
        Vec3.set(this.planes[2].n, m.m03 + m.m01, m.m07 + m.m05, m.m11 + m.m09);
        this.planes[2].d = -(m.m15 + m.m13);
        // top plane
        Vec3.set(this.planes[3].n, m.m03 - m.m01, m.m07 - m.m05, m.m11 - m.m09);
        this.planes[3].d = -(m.m15 - m.m13);
        // near plane
        Vec3.set(this.planes[4].n, m.m03 + m.m02, m.m07 + m.m06, m.m11 + m.m10);
        this.planes[4].d = -(m.m15 + m.m14);
        // far plane
        Vec3.set(this.planes[5].n, m.m03 - m.m02, m.m07 - m.m06, m.m11 - m.m10);
        this.planes[5].d = -(m.m15 - m.m14);

        if (this._type !== enums.SHAPE_FRUSTUM_ACCURATE) { return; }

        // normalize planes
        for (let i = 0; i < 6; i++) {
            const pl = this.planes[i];
            const invDist = 1 / pl.n.length();
            Vec3.multiplyScalar(pl.n, pl.n, invDist);
            pl.d *= invDist;
        }

        // update frustum vertices
        for (let i = 0; i < 8; i++) {
            Vec3.transformMat4(this.vertices[i], _v[i], inv);
        }
    }

    /**
     * @en
     * Transform this frustum.
     * @zh
     * 变换此视锥体。
     * @param mat @en The transform matrix @zh 变换矩阵
     */
    public transform (mat: Mat4) {
        if (this._type !== enums.SHAPE_FRUSTUM_ACCURATE) {
            return;
        }
        for (let i = 0; i < 8; i++) {
            Vec3.transformMat4(this.vertices[i], this.vertices[i], mat);
        }
        this.updatePlanes();
    }

    /**
     * @en Initialize the frustum
     * @zh 初始化视锥体
     */
    public zero () {
        for (let i = 0; i < 8; i++) {
            this.vertices[i].set(0.0, 0.0, 0.0);
        }
        this.updatePlanes();
    }

    /**
     * @en Update all six planes of the frustum
     * @zh 更新视锥体的所有面数据
     */
    public updatePlanes () {
        // left plane
        Plane.fromPoints(this.planes[0], this.vertices[1], this.vertices[6], this.vertices[5]);
        // right plane
        Plane.fromPoints(this.planes[1], this.vertices[3], this.vertices[4], this.vertices[7]);
        // bottom plane
        Plane.fromPoints(this.planes[2], this.vertices[6], this.vertices[3], this.vertices[7]);
        // top plane
        Plane.fromPoints(this.planes[3], this.vertices[0], this.vertices[5], this.vertices[4]);
        // near plane
        Plane.fromPoints(this.planes[4], this.vertices[2], this.vertices[0], this.vertices[3]);
        // far plane
        Plane.fromPoints(this.planes[5], this.vertices[7], this.vertices[5], this.vertices[6]);
    }
}
