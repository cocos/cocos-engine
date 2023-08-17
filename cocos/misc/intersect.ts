/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { Vec3, Mat4, IVec3Like, geometry } from '../core';
import { PrimitiveMode } from '../gfx';
import { Mesh } from '../3d/assets/mesh';
import { IBArray, RenderingSubMesh } from '../asset/assets/rendering-sub-mesh';
import { scene } from '../render-scene';

// Implement some intersects functions here. As these functions depends on upper modules, so they are not
// suitable implemented in core module. I am not sure if should implement these functions in corresponding
// modules, such as implement `rayModule` in render-scene module. May move to corresponding modules in future,
// and will not break compatibility.

// FIXME(minggo): rayAABB2 is also implemented in core/geometry/intersects.ts, but it is not exported.
// And i don't think should export this function, so copy the implementation here.
function rayAABB2 (ray: geometry.Ray, min: IVec3Like, max: IVec3Like): number {
    const o = ray.o; const d = ray.d;
    const ix = 1 / d.x; const iy = 1 / d.y; const iz = 1 / d.z;
    const t1 = (min.x - o.x) * ix;
    const t2 = (max.x - o.x) * ix;
    const t3 = (min.y - o.y) * iy;
    const t4 = (max.y - o.y) * iy;
    const t5 = (min.z - o.z) * iz;
    const t6 = (max.z - o.z) * iz;
    const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
    if (tmax < 0 || tmin > tmax) { return 0; }
    return tmin > 0 ? tmin : tmax; // ray origin inside aabb
}

/**
 * @en
 * ray-subMesh intersect detect, in model space.
 * @zh
 * 在模型空间中，射线和子三角网格的相交性检测。
 * @param ray @zh 射线 @en The ray to test
 * @param subMesh @zh 子网格 @en The sub mesh to test
 * @param options @zh 额外选项 @en Optional params
 * @return @zh 0 或非 0 @en 0 or not 0, 0 indicates there is no intersection
 */
const raySubMesh = (function (): (ray: geometry.Ray, submesh: RenderingSubMesh, options?: geometry.IRaySubMeshOptions) => number {
    const tri = geometry.Triangle.create();
    const deOpt: geometry.IRaySubMeshOptions = { distance: Infinity, doubleSided: false, mode: geometry.ERaycastMode.ANY };
    let minDis = 0;

    const fillResult = (m: geometry.ERaycastMode, d: number, i0: number, i1: number, i2: number, r?: geometry.IRaySubMeshResult[]): void => {
        if (m === geometry.ERaycastMode.CLOSEST) {
            if (minDis > d || minDis === 0) {
                minDis = d;
                if (r) {
                    if (r.length === 0) {
                        r.push({ distance: d, vertexIndex0: i0 / 3, vertexIndex1: i1 / 3, vertexIndex2: i2 / 3 });
                    } else {
                        r[0].distance = d; r[0].vertexIndex0 = i0 / 3; r[0].vertexIndex1 = i1 / 3; r[0].vertexIndex2 = i2 / 3;
                    }
                }
            }
        } else {
            minDis = d;
            if (r) r.push({ distance: d, vertexIndex0: i0 / 3, vertexIndex1: i1 / 3, vertexIndex2: i2 / 3 });
        }
    };

    const narrowphase = (vb: Float32Array, ib: IBArray, pm: PrimitiveMode, ray: geometry.Ray, opt: geometry.IRaySubMeshOptions): number => {
        if (pm === PrimitiveMode.TRIANGLE_LIST) {
            const cnt = ib.length;
            for (let j = 0; j < cnt; j += 3) {
                const i0 = ib[j] * 3;
                const i1 = ib[j + 1] * 3;
                const i2 = ib[j + 2] * 3;
                Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                const dist = geometry.intersect.rayTriangle(ray, tri, opt.doubleSided);
                if (dist === 0 || dist > opt.distance) continue;
                fillResult(opt.mode, dist, i0, i1, i2, opt.result);
                if (opt.mode === geometry.ERaycastMode.ANY) return dist;
            }
        } else if (pm === PrimitiveMode.TRIANGLE_STRIP) {
            const cnt = ib.length - 2;
            let rev = 0;
            for (let j = 0; j < cnt; j += 1) {
                const i0 = ib[j - rev] * 3;
                const i1 = ib[j + rev + 1] * 3;
                const i2 = ib[j + 2] * 3;
                Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
                Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                rev = ~rev;
                const dist = geometry.intersect.rayTriangle(ray, tri, opt.doubleSided);
                if (dist === 0 || dist > opt.distance) continue;
                fillResult(opt.mode, dist, i0, i1, i2, opt.result);
                if (opt.mode === geometry.ERaycastMode.ANY) return dist;
            }
        } else if (pm === PrimitiveMode.TRIANGLE_FAN) {
            const cnt = ib.length - 1;
            const i0 = ib[0] * 3;
            Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);
            for (let j = 1; j < cnt; j += 1) {
                const i1 = ib[j] * 3;
                const i2 = ib[j + 1] * 3;
                Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);
                Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);
                const dist = geometry.intersect.rayTriangle(ray, tri, opt.doubleSided);
                if (dist === 0 || dist > opt.distance) continue;
                fillResult(opt.mode, dist, i0, i1, i2, opt.result);
                if (opt.mode === geometry.ERaycastMode.ANY) return dist;
            }
        }
        return minDis;
    };
    return function (ray: geometry.Ray, submesh: RenderingSubMesh, options?: geometry.IRaySubMeshOptions): number {
        minDis = 0;
        if (submesh.geometricInfo.positions.length === 0) return minDis;
        const opt = options === undefined ? deOpt : options;
        const min = submesh.geometricInfo.boundingBox.min;
        const max = submesh.geometricInfo.boundingBox.max;
        if (rayAABB2(ray, min, max)) {
            const pm = submesh.primitiveMode;
            const { positions: vb, indices: ib } = submesh.geometricInfo;
            narrowphase(vb, ib!, pm, ray, opt);
        }
        return minDis;
    };
}());

/**
 * @en
 * ray-mesh intersect detect, in model space.
 * @zh
 * 在模型空间中，射线和三角网格资源的相交性检测。
 * @param ray @zh 射线 @en The ray to test
 * @param mesh @zh 网格 @en The mesh to test
 * @param options @zh 可选参数 @en Optional param
 * @return @zh 0 或非 0 @en 0 or not 0, 0 indicates there is no intersection
 */
const rayMesh = (function (): (ray: geometry.Ray, mesh: Mesh, options?: geometry.IRayMeshOptions) => number {
    let minDis = 0;
    const deOpt: geometry.IRayMeshOptions = { distance: Infinity, doubleSided: false, mode: geometry.ERaycastMode.ANY };
    return function (ray: geometry.Ray, mesh: Mesh, options?: geometry.IRayMeshOptions): number {
        minDis = 0;
        const opt = options === undefined ? deOpt : options;
        const length = mesh.renderingSubMeshes.length;
        const min = mesh.struct.minPosition;
        const max = mesh.struct.maxPosition;
        if (min && max && !rayAABB2(ray, min, max)) return minDis;
        for (let i = 0; i < length; i++) {
            const sm = mesh.renderingSubMeshes[i];
            const dis = raySubMesh(ray, sm, opt);
            if (dis) {
                if (opt.mode === geometry.ERaycastMode.CLOSEST) {
                    if (minDis === 0 || minDis > dis) {
                        minDis = dis;
                        if (opt.subIndices) opt.subIndices[0] = i;
                    }
                } else {
                    minDis = dis;
                    if (opt.subIndices) opt.subIndices.push(i);
                    if (opt.mode === geometry.ERaycastMode.ANY) {
                        return dis;
                    }
                }
            }
        }
        if (minDis && opt.mode === geometry.ERaycastMode.CLOSEST) {
            if (opt.result) {
                opt.result[0].distance = minDis;
                opt.result.length = 1;
            }
            if (opt.subIndices) opt.subIndices.length = 1;
        }
        return minDis;
    };
}());

/**
 * @en
 * ray-model intersect detect, in world space.
 * @zh
 * 在世界空间中，射线和渲染模型的相交性检测。
 * @param ray @zh 射线 @en The ray to test
 * @param model @zh model @en The model to test
 * @param options @zh 可选参数 @en Optional param
 * @return @zh 0 或非 0 @en 0 or not 0, 0 indicates there is no intersection
 */
const rayModel = (function (): (r: geometry.Ray, model: scene.Model, options?: geometry.IRayModelOptions) => number {
    let minDis = 0;
    const deOpt: geometry.IRayModelOptions = { distance: Infinity, doubleSided: false, mode: geometry.ERaycastMode.ANY };
    const modelRay = new geometry.Ray();
    const m4 = new Mat4();
    return function (r: geometry.Ray, model: scene.Model, options?: geometry.IRayModelOptions): number {
        minDis = 0;
        const opt = options === undefined ? deOpt : options;
        const wb = model.worldBounds;
        if (wb && !geometry.intersect.rayAABB(r, wb)) return minDis;
        geometry.Ray.copy(modelRay, r);
        if (model.node) {
            Mat4.invert(m4, model.node.getWorldMatrix(m4));
            Vec3.transformMat4(modelRay.o, r.o, m4);
            Vec3.transformMat4Normal(modelRay.d, r.d, m4);
        }
        const subModels = model.subModels;
        for (let i = 0; i < subModels.length; i++) {
            const subMesh = subModels[i].subMesh;
            const dis = raySubMesh(modelRay, subMesh, opt);
            if (dis) {
                if (opt.mode === geometry.ERaycastMode.CLOSEST) {
                    if (minDis === 0 || minDis > dis) {
                        minDis = dis;
                        if (opt.subIndices) opt.subIndices[0] = i;
                    }
                } else {
                    minDis = dis;
                    if (opt.subIndices) opt.subIndices.push(i);
                    if (opt.mode === geometry.ERaycastMode.ANY) {
                        return dis;
                    }
                }
            }
        }
        if (minDis && opt.mode === geometry.ERaycastMode.CLOSEST) {
            if (opt.result) {
                opt.result[0].distance = minDis;
                opt.result.length = 1;
            }
            if (opt.subIndices) opt.subIndices.length = 1;
        }
        return minDis;
    };
}());

geometry.intersect.rayModel = rayModel;
geometry.intersect.raySubMesh = raySubMesh;
geometry.intersect.rayMesh = rayMesh;
