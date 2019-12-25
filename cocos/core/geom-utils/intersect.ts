/**
 * 几何工具模块
 * @category geometry
 */

import { Mat3, Vec3, EPSILON } from '../math';
import aabb from './aabb';
import * as distance from './distance';
import enums from './enums';
import { frustum } from './frustum';
import line from './line';
import obb from './obb';
import plane from './plane';
import ray from './ray';
import sphere from './sphere';
import triangle from './triangle';
import { capsule } from './capsule';

// tslint:disable:only-arrow-functions
// tslint:disable:one-variable-per-declaration
// tslint:disable:prefer-for-of
// tslint:disable:no-shadowed-variable

/**
 * ray-plane intersect<br/>
 * 射线与平面的相交性检测。
 * @param {ray} ray 射线
 * @param {plane} plane 平面
 * @return {number} 0 或 非 0
 */
const ray_plane = (function () {
    const pt = new Vec3(0, 0, 0);

    return function (ray: ray, plane: plane): number {
        const denom = Vec3.dot(ray.d, plane.n);
        if (Math.abs(denom) < Number.EPSILON) { return 0; }
        Vec3.multiplyScalar(pt, plane.n, plane.d);
        const t = Vec3.dot(Vec3.subtract(pt, pt, ray.o), plane.n) / denom;
        if (t < 0) { return 0; }
        return t;
    };
})();

// based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/
/**
 * ray-triangle intersect<br/>
 * 射线与三角形的相交性检测。
 * @param {ray} ray 射线
 * @param {triangle} triangle 三角形
 * @param {boolean} doubleSided 三角形是否为双面
 * @return {number} 0 或 非 0
 */
const ray_triangle = (function () {
    const ab = new Vec3(0, 0, 0);
    const ac = new Vec3(0, 0, 0);
    const pvec = new Vec3(0, 0, 0);
    const tvec = new Vec3(0, 0, 0);
    const qvec = new Vec3(0, 0, 0);

    return function (ray: ray, triangle: triangle, doubleSided?: boolean) {
        Vec3.subtract(ab, triangle.b, triangle.a);
        Vec3.subtract(ac, triangle.c, triangle.a);

        Vec3.cross(pvec, ray.d, ac);
        const det = Vec3.dot(ab, pvec);
        if (det < Number.EPSILON && (!doubleSided || det > -Number.EPSILON)) { return 0; }

        const inv_det = 1 / det;

        Vec3.subtract(tvec, ray.o, triangle.a);
        const u = Vec3.dot(tvec, pvec) * inv_det;
        if (u < 0 || u > 1) { return 0; }

        Vec3.cross(qvec, tvec, ab);
        const v = Vec3.dot(ray.d, qvec) * inv_det;
        if (v < 0 || u + v > 1) { return 0; }

        const t = Vec3.dot(ac, qvec) * inv_det;
        return t < 0 ? 0 : t;
    };
})();

/**
 * ray-sphere intersect<br/>
 * 射线和球的相交性检测。
 * @param {ray} ray 射线
 * @param {sphere} sphere 球
 * @return {number} 0 或 非 0
 */
const ray_sphere = (function () {
    const e = new Vec3(0, 0, 0);
    return function (ray: ray, sphere: sphere): number {
        const r = sphere.radius;
        const c = sphere.center;
        const o = ray.o;
        const d = ray.d;
        const rSq = r * r;
        Vec3.subtract(e, c, o);
        const eSq = e.lengthSqr();

        const aLength = Vec3.dot(e, d); // assume ray direction already normalized
        const fSq = rSq - (eSq - aLength * aLength);
        if (fSq < 0) { return 0; }

        const f = Math.sqrt(fSq);
        const t = eSq < rSq ? aLength + f : aLength - f;
        if (t < 0) { return 0; }
        return t;
    };
})();

/**
 * ray-aabb intersect<br/>
 * 射线和轴对齐包围盒的相交性检测。
 * @param {ray} ray 射线
 * @param {aabb} aabb 轴对齐包围盒
 * @return {number} 0 或 非 0
 */
const ray_aabb = (function () {
    const min = new Vec3();
    const max = new Vec3();
    return function (ray: ray, aabb: aabb): number {
        const o = ray.o, d = ray.d;
        const ix = 1 / d.x, iy = 1 / d.y, iz = 1 / d.z;
        Vec3.subtract(min, aabb.center, aabb.halfExtents);
        Vec3.add(max, aabb.center, aabb.halfExtents);
        const t1 = (min.x - o.x) * ix;
        const t2 = (max.x - o.x) * ix;
        const t3 = (min.y - o.y) * iy;
        const t4 = (max.y - o.y) * iy;
        const t5 = (min.z - o.z) * iz;
        const t6 = (max.z - o.z) * iz;
        const tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
        const tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
        if (tmax < 0 || tmin > tmax) { return 0; }
        return tmin;
    };
})();

/**
 * ray-obb intersect<br/>
 * 射线和方向包围盒的相交性检测。
 * @param {ray} ray 射线
 * @param {obb} obb 方向包围盒
 * @return {number} 0 或 非 0
 */
const ray_obb = (function () {
    let center = new Vec3();
    let o = new Vec3();
    let d = new Vec3();
    const X = new Vec3();
    const Y = new Vec3();
    const Z = new Vec3();
    const p = new Vec3();
    const size = new Array(3);
    const f = new Array(3);
    const e = new Array(3);
    const t = new Array(6);

    return function (ray: ray, obb: obb): number {
        size[0] = obb.halfExtents.x;
        size[1] = obb.halfExtents.y;
        size[2] = obb.halfExtents.z;
        center = obb.center;
        o = ray.o;
        d = ray.d;

        Vec3.set(X, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
        Vec3.set(Y, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
        Vec3.set(Z, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);
        Vec3.subtract(p, center, o);

        // The cos values of the ray on the X, Y, Z
        f[0] = Vec3.dot(X, d);
        f[1] = Vec3.dot(Y, d);
        f[2] = Vec3.dot(Z, d);

        // The projection length of P on X, Y, Z
        e[0] = Vec3.dot(X, p);
        e[1] = Vec3.dot(Y, p);
        e[2] = Vec3.dot(Z, p);

        for (let i = 0; i < 3; ++i) {
            if (f[i] === 0) {
                if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
                    return 0;
                }
                // Avoid div by 0!
                f[i] = 0.0000001;
            }
            // min
            t[i * 2 + 0] = (e[i] + size[i]) / f[i];
            // max
            t[i * 2 + 1] = (e[i] - size[i]) / f[i];
        }
        const tmin = Math.max(
            Math.max(
                Math.min(t[0], t[1]),
                Math.min(t[2], t[3])),
            Math.min(t[4], t[5]),
        );
        const tmax = Math.min(
            Math.min(
                Math.max(t[0], t[1]),
                Math.max(t[2], t[3])),
            Math.max(t[4], t[5]),
        );
        if (tmax < 0 || tmin > tmax || tmin < 0) {
            return 0;
        }

        return tmin;
    };
})();

const ray_capsule = (function () {
    const v3_0 = new Vec3();
    const v3_1 = new Vec3();
    const v3_2 = new Vec3();
    const v3_3 = new Vec3();
    const v3_4 = new Vec3();
    const v3_5 = new Vec3();
    const v3_6 = new Vec3();
    const sphere_0 = new sphere();
    return function (ray: ray, capsule: capsule) {
        const radiusSqr = capsule.radius * capsule.radius;
        var vRayNorm = Vec3.normalize(v3_0, ray.d);
        var A = capsule.ellipseCenter0;
        var B = capsule.ellipseCenter1;
        var BA = Vec3.subtract(v3_1, B, A);
        if (BA.equals(Vec3.ZERO)) {
            sphere_0.radius = capsule.radius;
            sphere_0.center.set(capsule.ellipseCenter0);
            return intersect.ray_sphere(ray, sphere_0);
        }

        var O = ray.o;
        var OA = Vec3.subtract(v3_2, O, A);
        var VxBA = Vec3.cross(v3_3, vRayNorm, BA);
        var a = VxBA.lengthSqr();
        if (a == 0) {
            sphere_0.radius = capsule.radius;
            var BO = Vec3.subtract(v3_4, B, O);
            if (OA.lengthSqr() < BO.lengthSqr()) {
                sphere_0.center.set(capsule.ellipseCenter0);
            } else {
                sphere_0.center.set(capsule.ellipseCenter1);
            }
            return intersect.ray_sphere(ray, sphere_0);
        }

        var OAxBA = Vec3.cross(v3_4, OA, BA);
        var ab2 = BA.lengthSqr();
        var b = 2 * Vec3.dot(VxBA, OAxBA);
        var c = OAxBA.lengthSqr() - (radiusSqr * ab2);
        var d = b * b - 4 * a * c;

        if (d < 0) return 0;

        var t = (-b - Math.sqrt(d)) / (2 * a);
        if (t < 0) {
            sphere_0.radius = capsule.radius;
            var BO = Vec3.subtract(v3_5, B, O);
            if (OA.lengthSqr() < BO.lengthSqr()) {
                sphere_0.center.set(capsule.ellipseCenter0);
            } else {
                sphere_0.center.set(capsule.ellipseCenter1);
            }
            return intersect.ray_sphere(ray, sphere_0);
        } else {
            //Limit intersection between the bounds of the cylinder's end caps.
            var iPos = Vec3.scaleAndAdd(v3_5, ray.o, vRayNorm, t);
            var iPosLen = Vec3.subtract(v3_6, iPos, A);
            var tLimit = Vec3.dot(iPosLen, BA) / ab2;

            if (tLimit >= 0 && tLimit <= 1) {
                return t;
            } else if (tLimit < 0) {
                sphere_0.radius = capsule.radius;
                sphere_0.center.set(capsule.ellipseCenter0);
                return intersect.ray_sphere(ray, sphere_0);
            } else if (tLimit > 1) {
                sphere_0.radius = capsule.radius;
                sphere_0.center.set(capsule.ellipseCenter1);
                return intersect.ray_sphere(ray, sphere_0);
            } else {
                return 0;
            }
        }

    }
})();

/**
 * line-plane intersect<br/>
 * 线段与平面的相交性检测。
 * @param {line} line 线段
 * @param {plane} plane 平面
 * @return {number} 0 或 非 0
 */
const line_plane = (function () {
    const ab = new Vec3(0, 0, 0);

    return function (line: line, plane: plane): number {
        Vec3.subtract(ab, line.e, line.s);
        const t = (plane.d - Vec3.dot(line.s, plane.n)) / Vec3.dot(ab, plane.n);
        if (t < 0 || t > 1) { return 0; }
        return t;
    };
})();

/**
 * line-triangle intersect<br/>
 * 线段与三角形的相交性检测。
 * @param {line} line 线段
 * @param {triangle} triangle 三角形
 * @param {Vec3} outPt 可选，相交点
 * @return {number} 0 或 非 0
 */
const line_triangle = (function () {
    const ab = new Vec3(0, 0, 0);
    const ac = new Vec3(0, 0, 0);
    const qp = new Vec3(0, 0, 0);
    const ap = new Vec3(0, 0, 0);
    const n = new Vec3(0, 0, 0);
    const e = new Vec3(0, 0, 0);

    return function (line: line, triangle: triangle, outPt?: Vec3): number {
        Vec3.subtract(ab, triangle.b, triangle.a);
        Vec3.subtract(ac, triangle.c, triangle.a);
        Vec3.subtract(qp, line.s, line.e);

        Vec3.cross(n, ab, ac);
        const det = Vec3.dot(qp, n);

        if (det <= 0.0) {
            return 0;
        }

        Vec3.subtract(ap, line.s, triangle.a);
        const t = Vec3.dot(ap, n);
        if (t < 0 || t > det) {
            return 0;
        }

        Vec3.cross(e, qp, ap);
        let v = Vec3.dot(ac, e);
        if (v < 0 || v > det) {
            return 0;
        }

        let w = -Vec3.dot(ab, e);
        if (w < 0.0 || v + w > det) {
            return 0;
        }

        if (outPt) {
            const invDet = 1.0 / det;
            v *= invDet;
            w *= invDet;
            const u = 1.0 - v - w;

            // outPt = u*a + v*d + w*c;
            Vec3.set(outPt,
                triangle.a.x * u + triangle.b.x * v + triangle.c.x * w,
                triangle.a.y * u + triangle.b.y * v + triangle.c.y * w,
                triangle.a.z * u + triangle.b.z * v + triangle.c.z * w,
            );
        }

        return 1;
    };
})();

const r_t = new ray();
/**
 * @zh
 * 线段与轴对齐包围盒的相交性检测
 * @param line 线段
 * @param aabb 轴对齐包围盒
 * @return {number} 0 或 非 0
 */
function line_aabb (line: line, aabb: aabb): number {
    r_t.o.set(line.s);
    Vec3.subtract(r_t.d, line.e, line.s);
    r_t.d.normalize();
    const min = ray_aabb(r_t, aabb);
    const len = line.length();
    if (min <= len) {
        return min;
    } else {
        return 0;
    }
}

/**
 * @zh
 * 线段与方向包围盒的相交性检测
 * @param line 线段
 * @param obb 方向包围盒
 * @return {number} 0 或 非 0
 */
function line_obb (line: line, obb: obb): number {
    r_t.o.set(line.s);
    Vec3.subtract(r_t.d, line.e, line.s);
    r_t.d.normalize();
    const min = ray_obb(r_t, obb);
    const len = line.length();
    if (min <= len) {
        return min;
    } else {
        return 0;
    }
}

/**
 * @zh
 * 线段与球的相交性检测
 * @param line 线段
 * @param sphere 球
 * @return {number} 0 或 非 0
 */
function line_sphere (line: line, sphere: sphere): number {
    r_t.o.set(line.s);
    Vec3.subtract(r_t.d, line.e, line.s);
    r_t.d.normalize();
    const min = ray_sphere(r_t, sphere);
    const len = line.length();
    if (min <= len) {
        return min;
    } else {
        return 0;
    }
}

/**
 * aabb-aabb intersect<br/>
 * 轴对齐包围盒和轴对齐包围盒的相交性检测。
 * @param {aabb} aabb1 轴对齐包围盒1
 * @param {aabb} aabb2 轴对齐包围盒2
 * @return {number} 0 或 非 0
 */
const aabb_aabb = (function () {
    const aMin = new Vec3();
    const aMax = new Vec3();
    const bMin = new Vec3();
    const bMax = new Vec3();
    return function (aabb1: aabb, aabb2: aabb) {
        Vec3.subtract(aMin, aabb1.center, aabb1.halfExtents);
        Vec3.add(aMax, aabb1.center, aabb1.halfExtents);
        Vec3.subtract(bMin, aabb2.center, aabb2.halfExtents);
        Vec3.add(bMax, aabb2.center, aabb2.halfExtents);
        return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
            (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
            (aMin.z <= bMax.z && aMax.z >= bMin.z);
    };
})();

function getAABBVertices (min: Vec3, max: Vec3, out: Vec3[]) {
    Vec3.set(out[0], min.x, max.y, max.z);
    Vec3.set(out[1], min.x, max.y, min.z);
    Vec3.set(out[2], min.x, min.y, max.z);
    Vec3.set(out[3], min.x, min.y, min.z);
    Vec3.set(out[4], max.x, max.y, max.z);
    Vec3.set(out[5], max.x, max.y, min.z);
    Vec3.set(out[6], max.x, min.y, max.z);
    Vec3.set(out[7], max.x, min.y, min.z);
}

function getOBBVertices (c: Vec3, e: Vec3, a1: Vec3, a2: Vec3, a3: Vec3, out: Vec3[]) {
    Vec3.set(out[0],
        c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z,
        c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z,
        c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z,
    );
    Vec3.set(out[1],
        c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z,
        c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z,
        c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z,
    );
    Vec3.set(out[2],
        c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z,
        c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z,
        c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z,
    );
    Vec3.set(out[3],
        c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z,
        c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z,
        c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z,
    );
    Vec3.set(out[4],
        c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z,
        c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z,
        c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z,
    );
    Vec3.set(out[5],
        c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z,
        c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z,
        c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z,
    );
    Vec3.set(out[6],
        c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z,
        c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z,
        c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z,
    );
    Vec3.set(out[7],
        c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z,
        c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z,
        c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z,
    );
}

function getInterval (vertices: any[] | Vec3[], axis: Vec3) {
    let min = Vec3.dot(axis, vertices[0]), max = min;
    for (let i = 1; i < 8; ++i) {
        const projection = Vec3.dot(axis, vertices[i]);
        min = (projection < min) ? projection : min;
        max = (projection > max) ? projection : max;
    }
    return [min, max];
}

/**
 * aabb-obb intersect<br/>
 * 轴对齐包围盒和方向包围盒的相交性检测。
 * @param {aabb} aabb 轴对齐包围盒
 * @param {obb} obb 方向包围盒
 * @return {number} 0 或 非 0
 */
const aabb_obb = (function () {
    const test = new Array(15);
    for (let i = 0; i < 15; i++) {
        test[i] = new Vec3(0, 0, 0);
    }
    const vertices = new Array(8);
    const vertices2 = new Array(8);
    for (let i = 0; i < 8; i++) {
        vertices[i] = new Vec3(0, 0, 0);
        vertices2[i] = new Vec3(0, 0, 0);
    }
    const min = new Vec3();
    const max = new Vec3();
    return function (aabb: aabb, obb: obb): number {
        Vec3.set(test[0], 1, 0, 0);
        Vec3.set(test[1], 0, 1, 0);
        Vec3.set(test[2], 0, 0, 1);
        Vec3.set(test[3], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
        Vec3.set(test[4], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
        Vec3.set(test[5], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

        for (let i = 0; i < 3; ++i) { // Fill out rest of axis
            Vec3.cross(test[6 + i * 3 + 0], test[i], test[0]);
            Vec3.cross(test[6 + i * 3 + 1], test[i], test[1]);
            Vec3.cross(test[6 + i * 3 + 1], test[i], test[2]);
        }

        Vec3.subtract(min, aabb.center, aabb.halfExtents);
        Vec3.add(max, aabb.center, aabb.halfExtents);
        getAABBVertices(min, max, vertices);
        getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

        for (let j = 0; j < 15; ++j) {
            const a = getInterval(vertices, test[j]);
            const b = getInterval(vertices2, test[j]);
            if (b[0] > a[1] || a[0] > b[1]) {
                return 0; // Seperating axis found
            }
        }

        return 1;
    };
})();

/**
 * aabb-plane intersect<br/>
 * 轴对齐包围盒和平面的相交性检测。
 * @param {aabb} aabb 轴对齐包围盒
 * @param {plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
const aabb_plane = function (aabb: aabb, plane: plane): number {
    const r = aabb.halfExtents.x * Math.abs(plane.n.x) +
        aabb.halfExtents.y * Math.abs(plane.n.y) +
        aabb.halfExtents.z * Math.abs(plane.n.z);
    const dot = Vec3.dot(plane.n, aabb.center);
    if (dot + r < plane.d) { return -1; }
    else if (dot - r > plane.d) { return 0; }
    return 1;
};

/**
 * aabb-frustum intersect, faster but has false positive corner cases<br/>
 * 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
 * @param {aabb} aabb 轴对齐包围盒
 * @param {frustum} frustum 锥台
 * @return {number} 0 或 非 0
 */
const aabb_frustum = function (aabb: aabb, frustum: frustum): number {
    for (let i = 0; i < frustum.planes.length; i++) {
        // frustum plane normal points to the inside
        if (aabb_plane(aabb, frustum.planes[i]) === -1) {
            return 0;
        }
    } // completely outside
    return 1;
};

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
/**
 * aabb-frustum intersect, handles most of the false positives correctly<br/>
 * 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @param {aabb} aabb 轴对齐包围盒
 * @param {frustum} frustum 锥台
 * @return {number}
 */
const aabb_frustum_accurate = (function () {
    const tmp = new Array(8);
    let out1 = 0, out2 = 0;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = new Vec3(0, 0, 0);
    }
    return function (aabb: aabb, frustum: frustum): number {
        let result = 0, intersects = false;
        // 1. aabb inside/outside frustum test
        for (let i = 0; i < frustum.planes.length; i++) {
            result = aabb_plane(aabb, frustum.planes[i]);
            // frustum plane normal points to the inside
            if (result === -1) { return 0; } // completely outside
            else if (result === 1) { intersects = true; }
        }
        if (!intersects) { return 1; } // completely inside
        // in case of false positives
        // 2. frustum inside/outside aabb test
        for (let i = 0; i < frustum.vertices.length; i++) {
            Vec3.subtract(tmp[i], frustum.vertices[i], aabb.center);
        }
        out1 = 0, out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            if (tmp[i].x > aabb.halfExtents.x) { out1++; }
            else if (tmp[i].x < -aabb.halfExtents.x) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        out1 = 0; out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            if (tmp[i].y > aabb.halfExtents.y) { out1++; }
            else if (tmp[i].y < -aabb.halfExtents.y) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        out1 = 0; out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            if (tmp[i].z > aabb.halfExtents.z) { out1++; }
            else if (tmp[i].z < -aabb.halfExtents.z) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        return 1;
    };
})();

/**
 * obb-point intersect<br/>
 * 方向包围盒和点的相交性检测。
 * @param {obb} obb 方向包围盒
 * @param {Vec3} point 点
 * @return {boolean} true or false
 */
const obb_point = (function () {
    const tmp = new Vec3(0, 0, 0), m3 = new Mat3();
    const lessThan = function (a: Vec3, b: Vec3): boolean { return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z; };
    return function (obb: obb, point: Vec3): boolean {
        Vec3.subtract(tmp, point, obb.center);
        Vec3.transformMat3(tmp, tmp, Mat3.transpose(m3, obb.orientation));
        return lessThan(tmp, obb.halfExtents);
    };
})();

/**
 * obb-plane intersect<br/>
 * 方向包围盒和平面的相交性检测。
 * @param {obb} obb 方向包围盒
 * @param {plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
const obb_plane = (function () {
    const absDot = function (n: Vec3, x: number, y: number, z: number) {
        return Math.abs(n.x * x + n.y * y + n.z * z);
    };
    return function (obb: obb, plane: plane): number {
        // Real-Time Collision Detection, Christer Ericson, p. 163.
        const r = obb.halfExtents.x * absDot(plane.n, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02) +
            obb.halfExtents.y * absDot(plane.n, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05) +
            obb.halfExtents.z * absDot(plane.n, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

        const dot = Vec3.dot(plane.n, obb.center);
        if (dot + r < plane.d) { return -1; }
        else if (dot - r > plane.d) { return 0; }
        return 1;
    };
})();

/**
 * obb-frustum intersect, faster but has false positive corner cases<br/>
 * 方向包围盒和锥台相交性检测，速度快，但有错误情况。
 * @param {obb} obb 方向包围盒
 * @param {frustum} frustum 锥台
 * @return {number} 0 或 非 0
 */
const obb_frustum = function (obb: obb, frustum: frustum): number {
    for (let i = 0; i < frustum.planes.length; i++) {
        // frustum plane normal points to the inside
        if (obb_plane(obb, frustum.planes[i]) === -1) {
            return 0;
        }
    } // completely outside
    return 1;
};

// https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
/**
 * obb-frustum intersect, handles most of the false positives correctly<br/>
 * 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
 * @param {obb} obb 方向包围盒
 * @param {frustum} frustum 锥台
 * @return {number} 0 或 非 0
 */
const obb_frustum_accurate = (function () {
    const tmp = new Array(8);
    let dist = 0, out1 = 0, out2 = 0;
    for (let i = 0; i < tmp.length; i++) {
        tmp[i] = new Vec3(0, 0, 0);
    }
    const dot = function (n: Vec3, x: number, y: number, z: number): number {
        return n.x * x + n.y * y + n.z * z;
    };
    return function (obb: obb, frustum: frustum): number {
        let result = 0, intersects = false;
        // 1. obb inside/outside frustum test
        for (let i = 0; i < frustum.planes.length; i++) {
            result = obb_plane(obb, frustum.planes[i]);
            // frustum plane normal points to the inside
            if (result === -1) { return 0; } // completely outside
            else if (result === 1) { intersects = true; }
        }
        if (!intersects) { return 1; } // completely inside
        // in case of false positives
        // 2. frustum inside/outside obb test
        for (let i = 0; i < frustum.vertices.length; i++) {
            Vec3.subtract(tmp[i], frustum.vertices[i], obb.center);
        }
        out1 = 0, out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            dist = dot(tmp[i], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
            if (dist > obb.halfExtents.x) { out1++; }
            else if (dist < -obb.halfExtents.x) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        out1 = 0; out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            dist = dot(tmp[i], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
            if (dist > obb.halfExtents.y) { out1++; }
            else if (dist < -obb.halfExtents.y) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        out1 = 0; out2 = 0;
        for (let i = 0; i < frustum.vertices.length; i++) {
            dist = dot(tmp[i], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);
            if (dist > obb.halfExtents.z) { out1++; }
            else if (dist < -obb.halfExtents.z) { out2++; }
        }
        if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) { return 0; }
        return 1;
    };
})();

/**
 * obb-obb intersect<br/>
 * 方向包围盒和方向包围盒的相交性检测。
 * @param {obb} obb1 方向包围盒1
 * @param {obb} obb2 方向包围盒2
 * @return {number} 0 或 非 0
 */
const obb_obb = (function () {
    const test = new Array(15);
    for (let i = 0; i < 15; i++) {
        test[i] = new Vec3(0, 0, 0);
    }

    const vertices = new Array(8);
    const vertices2 = new Array(8);
    for (let i = 0; i < 8; i++) {
        vertices[i] = new Vec3(0, 0, 0);
        vertices2[i] = new Vec3(0, 0, 0);
    }

    return function (obb1: obb, obb2: obb): number {
        Vec3.set(test[0], obb1.orientation.m00, obb1.orientation.m01, obb1.orientation.m02);
        Vec3.set(test[1], obb1.orientation.m03, obb1.orientation.m04, obb1.orientation.m05);
        Vec3.set(test[2], obb1.orientation.m06, obb1.orientation.m07, obb1.orientation.m08);
        Vec3.set(test[3], obb2.orientation.m00, obb2.orientation.m01, obb2.orientation.m02);
        Vec3.set(test[4], obb2.orientation.m03, obb2.orientation.m04, obb2.orientation.m05);
        Vec3.set(test[5], obb2.orientation.m06, obb2.orientation.m07, obb2.orientation.m08);

        for (let i = 0; i < 3; ++i) { // Fill out rest of axis
            Vec3.cross(test[6 + i * 3 + 0], test[i], test[0]);
            Vec3.cross(test[6 + i * 3 + 1], test[i], test[1]);
            Vec3.cross(test[6 + i * 3 + 1], test[i], test[2]);
        }

        getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
        getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

        for (let i = 0; i < 15; ++i) {
            const a = getInterval(vertices, test[i]);
            const b = getInterval(vertices2, test[i]);
            if (b[0] > a[1] || a[0] > b[1]) {
                return 0; // Seperating axis found
            }
        }

        return 1;
    };
})();


// https://github.com/diku-dk/bvh-tvcg18/blob/1fd3348c17bc8cf3da0b4ae60fdb8f2aa90a6ff0/FOUNDATION/GEOMETRY/GEOMETRY/include/overlap/geometry_overlap_obb_capsule.h
/**
 * 方向包围盒和胶囊体的重叠检测
 * @param obb 方向包围盒
 * @param capsule 胶囊体
 */
const obb_capsule = (function () {
    const sphere_0 = new sphere();
    const v3_0 = new Vec3();
    const v3_1 = new Vec3();
    const v3_2 = new Vec3();
    const v3_verts8 = new Array<Vec3>(8);
    for (let i = 0; i < 8; i++) { v3_verts8[i] = new Vec3(); }
    const v3_axis7 = new Array<Vec3>(7);
    for (let i = 0; i < 7; i++) { v3_axis7[i] = new Vec3(); }
    return function (obb: obb, capsule: capsule) {
        const h = Vec3.squaredDistance(capsule.ellipseCenter0, capsule.ellipseCenter1);
        if (h == 0) {
            sphere_0.radius = capsule.radius;
            sphere_0.center.set(capsule.ellipseCenter0);
            return intersect.sphere_obb(sphere_0, obb);
        } else {
            v3_0.x = obb.orientation.m00;
            v3_0.y = obb.orientation.m01;
            v3_0.z = obb.orientation.m02;
            v3_1.x = obb.orientation.m03;
            v3_1.y = obb.orientation.m04;
            v3_1.z = obb.orientation.m05;
            v3_2.x = obb.orientation.m06;
            v3_2.y = obb.orientation.m07;
            v3_2.z = obb.orientation.m08;
            getOBBVertices(obb.center, obb.halfExtents, v3_0, v3_1, v3_2, v3_verts8);

            const axes = v3_axis7;
            const a0 = Vec3.copy(axes[0], v3_0);
            const a1 = Vec3.copy(axes[1], v3_1);
            const a2 = Vec3.copy(axes[2], v3_2);
            const B = Vec3.subtract(axes[3], capsule.ellipseCenter0, capsule.ellipseCenter1);
            Vec3.cross(axes[4], a0, B);
            Vec3.cross(axes[5], a1, B);
            Vec3.cross(axes[6], a2, B);
            for (let i = 0; i < 7; ++i) {
                const a = getInterval(v3_verts8, axes[i]);
                const d0 = Vec3.dot(axes[i], capsule.ellipseCenter0);
                const d1 = Vec3.dot(axes[i], capsule.ellipseCenter1);
                const d0_min = d0 - capsule.radius;
                const d0_max = d0 + capsule.radius;
                const d1_min = d1 - capsule.radius;
                const d1_max = d1 + capsule.radius;
                const d_max = Math.max(d0_min, d1_min, d0_max, d1_max);
                const d_min = Math.min(d0_min, d1_min, d0_max, d1_max);

                if (d_min > a[1] || a[0] > d_max) {
                    return 0; // Seperating axis found
                }
            }
            return 1;
        }
    }
})();

/**
 * sphere-plane intersect, not necessarily faster than obb-plane<br/>
 * due to the length calculation of the plane normal to factor out<br/>
 * the unnomalized plane distance<br/>
 * 球与平面的相交性检测。
 * @param {sphere} sphere 球
 * @param {plane} plane 平面
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
const sphere_plane = function (sphere: sphere, plane: plane): number {
    const dot = Vec3.dot(plane.n, sphere.center);
    const r = sphere.radius * plane.n.length();
    if (dot + r < plane.d) { return -1; }
    else if (dot - r > plane.d) { return 0; }
    return 1;
};

/**
 * sphere-frustum intersect, faster but has false positive corner cases<br/>
 * 球和锥台的相交性检测，速度快，但有错误情况。
 * @param {sphere} sphere 球
 * @param {frustum} frustum 锥台
 * @return {number} 0 或 非 0
 */
const sphere_frustum = function (sphere: sphere, frustum: frustum): number {
    for (let i = 0; i < frustum.planes.length; i++) {
        // frustum plane normal points to the inside
        if (sphere_plane(sphere, frustum.planes[i]) === -1) {
            return 0;
        }
    } // completely outside
    return 1;
};

// https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases
/**
 * sphere-frustum intersect, handles the false positives correctly<br/>
 * 球和锥台的相交性检测，正确处理大多数错误情况。
 * @param {sphere} sphere 球
 * @param {frustum} frustum 锥台
 * @return {number} 0 或 非 0
 */
const sphere_frustum_accurate = (function () {
    const pt = new Vec3(0, 0, 0), map = [1, -1, 1, -1, 1, -1];
    return function (sphere: sphere, frustum: frustum): number {
        for (let i = 0; i < 6; i++) {
            const plane = frustum.planes[i];
            const r = sphere.radius, c = sphere.center;
            const n = plane.n, d = plane.d;
            const dot = Vec3.dot(n, c);
            // frustum plane normal points to the inside
            if (dot + r < d) { return 0; } // completely outside
            else if (dot - r > d) { continue; }
            // in case of false positives
            // has false negatives, still working on it
            Vec3.add(pt, c, Vec3.multiplyScalar(pt, n, r));
            for (let j = 0; j < 6; j++) {
                if (j === i || j === i + map[i]) { continue; }
                const test = frustum.planes[j];
                if (Vec3.dot(test.n, pt) < test.d) { return 0; }
            }
        }
        return 1;
    };
})();

/**
 * sphere-sphere intersect<br/>
 * 球和球的相交性检测。
 * @param {sphere} sphere0 球0
 * @param {sphere} sphere1 球1
 * @return {boolean} true or false
 */
const sphere_sphere = function (sphere0: sphere, sphere1: sphere): boolean {
    const r = sphere0.radius + sphere1.radius;
    return Vec3.squaredDistance(sphere0.center, sphere1.center) < r * r;
};

/**
 * sphere-aabb intersect<br/>
 * 球和轴对齐包围盒的相交性检测。
 * @param {sphere} sphere 球
 * @param {aabb} aabb 轴对齐包围盒
 * @return {boolean} true or false
 */
const sphere_aabb = (function () {
    const pt = new Vec3();
    return function (sphere: sphere, aabb: aabb): boolean {
        distance.pt_point_aabb(pt, sphere.center, aabb);
        return Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
    };
})();

/**
 * sphere-obb intersect<br/>
 * 球和方向包围盒的相交性检测。
 * @param {sphere} sphere 球
 * @param {obb} obb 方向包围盒
 * @return {boolean} true or false
 */
const sphere_obb = (function () {
    const pt = new Vec3();
    return function (sphere: sphere, obb: obb): boolean {
        distance.pt_point_obb(pt, sphere.center, obb);
        return Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
    };
})();

const sphere_capsule = (function () {
    const v3_0 = new Vec3();
    const v3_1 = new Vec3();
    return function (sphere: sphere, capsule: capsule) {
        const r = sphere.radius + capsule.radius;
        const squaredR = r * r;
        const h = Vec3.squaredDistance(capsule.ellipseCenter0, capsule.ellipseCenter1);
        if (h == 0) {
            return Vec3.squaredDistance(sphere.center, capsule.center) < squaredR;
        } else {
            Vec3.subtract(v3_0, sphere.center, capsule.ellipseCenter0);
            Vec3.subtract(v3_1, capsule.ellipseCenter1, capsule.ellipseCenter0);
            const t = Vec3.dot(v3_0, v3_1) / h;
            if (t < 0) {
                return Vec3.squaredDistance(sphere.center, capsule.ellipseCenter0) < squaredR;
            } else if (t > 1) {
                return Vec3.squaredDistance(sphere.center, capsule.ellipseCenter1) < squaredR;
            } else {
                Vec3.scaleAndAdd(v3_0, capsule.ellipseCenter0, v3_1, t);
                return Vec3.squaredDistance(sphere.center, v3_0) < squaredR;
            }
        }
    }
})();

// https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_049/test.html
const capsule_capsule = (function () {
    const v3_dirSAB = new Vec3();
    const v3_dirA = new Vec3();
    const v3_dirB = new Vec3();
    const v3_closestA = new Vec3();
    const v3_closestB = new Vec3();
    const v3_closestA_alt = new Vec3();
    const v3_closestB_alt = new Vec3();
    return function capsule_capsule (capsuleA: capsule, capsuleB: capsule) {
        const startA = capsuleA.ellipseCenter0;
        const startB = capsuleB.ellipseCenter0;
        const endA = capsuleA.ellipseCenter1;
        const endB = capsuleB.ellipseCenter1;

        Vec3.subtract(v3_dirSAB, startA, startB);
        Vec3.subtract(v3_dirA, startA, endA);
        Vec3.subtract(v3_dirB, startA, endB);

        const dirBDotDirAToB = Vec3.dot(v3_dirB, v3_dirSAB);
        const dirADotDirAToB = Vec3.dot(v3_dirA, v3_dirSAB);

        const sqrLenDirB = v3_dirB.lengthSqr();
        const sqrLenDirA = v3_dirA.lengthSqr();

        const dirADotDirB = Vec3.dot(v3_dirA, v3_dirB);

        const denominator = sqrLenDirA * sqrLenDirB - dirADotDirB * dirADotDirB;

        const distA = denominator < EPSILON ? 0 : (dirADotDirB * dirBDotDirAToB - sqrLenDirB * dirADotDirAToB) / denominator;
        const distB = (dirBDotDirAToB + dirADotDirB * distA) / sqrLenDirB;

        const isDistAInBounds = distA >= 0 && distA <= 1;
        const isDistBInBounds = distB >= 0 && distB <= 1;
        if (isDistAInBounds) {
            if (isDistBInBounds) {
                // The distances along both line segments are within bounds.
                Vec3.scaleAndAdd(v3_closestA, startA, v3_dirA, distA);
                Vec3.scaleAndAdd(v3_closestB, startB, v3_dirB, distB);
            } else {
                // Only the distance along the first line segment is within bounds.
                distB < 0 ? Vec3.copy(v3_closestB, startB) : Vec3.copy(v3_closestB, endB);
                distance.pt_point_line(v3_closestA, v3_closestB, startA, endA);
            }
        } else {
            if (isDistBInBounds) {
                // Only the distance along the second line segment is within bounds.
                distA < 0 ? Vec3.copy(v3_closestA, startA) : Vec3.copy(v3_closestA, endA);
                distance.pt_point_line(v3_closestB, v3_closestA, startB, endB);
            } else {
                // Neither of the distances along either line segment are within bounds.
                distA < 0 ? Vec3.copy(v3_closestA, startA) : Vec3.copy(v3_closestA, endA);
                distB < 0 ? Vec3.copy(v3_closestB, startB) : Vec3.copy(v3_closestB, endB);

                distance.pt_point_line(v3_closestA_alt, v3_closestB, startA, endA);
                distance.pt_point_line(v3_closestB_alt, v3_closestA, startB, endB);
                if (Vec3.squaredDistance(v3_closestA_alt, v3_closestB) <
                    Vec3.squaredDistance(v3_closestB_alt, v3_closestA)) {
                    Vec3.copy(v3_closestA, v3_closestA_alt);
                } else {
                    Vec3.copy(v3_closestB, v3_closestB_alt);
                }
            }
        }
        const r = capsuleA.radius + capsuleB.radius;
        return Vec3.squaredDistance(v3_closestA, v3_closestB) < r * r;
    }
})();

const intersect = {
    ray_sphere,
    ray_aabb,
    ray_obb,
    ray_plane,
    ray_triangle,
    ray_capsule,

    line_sphere,
    line_aabb,
    line_obb,
    line_plane,
    line_triangle,

    sphere_sphere,
    sphere_aabb,
    sphere_obb,
    sphere_plane,
    sphere_frustum,
    sphere_frustum_accurate,
    sphere_capsule,

    aabb_aabb,
    aabb_obb,
    aabb_plane,
    aabb_frustum,
    aabb_frustum_accurate,

    obb_obb,
    obb_plane,
    obb_frustum,
    obb_frustum_accurate,
    obb_point,
    obb_capsule,

    capsule_capsule,

    /**
     * @zh
     * g1 和 g2 的相交性检测，可填入基础几何中的形状。
     * @param g1 几何1
     * @param g2 几何2
     * @param outPt 可选，相交点。（注：仅部分形状的检测带有这个返回值）
     */
    resolve (g1: any, g2: any, outPt = null) {
        const type1 = g1._type, type2 = g2._type;
        const resolver = this[type1 | type2];
        if (type1 < type2) { return resolver(g1, g2, outPt); }
        else { return resolver(g2, g1, outPt); }
    },
};

intersect[enums.SHAPE_RAY | enums.SHAPE_SPHERE] = ray_sphere;
intersect[enums.SHAPE_RAY | enums.SHAPE_AABB] = ray_aabb;
intersect[enums.SHAPE_RAY | enums.SHAPE_OBB] = ray_obb;
intersect[enums.SHAPE_RAY | enums.SHAPE_PLANE] = ray_plane;
intersect[enums.SHAPE_RAY | enums.SHAPE_TRIANGLE] = ray_triangle;
intersect[enums.SHAPE_RAY | enums.SHAPE_CAPSULE] = ray_capsule;

intersect[enums.SHAPE_LINE | enums.SHAPE_SPHERE] = line_sphere;
intersect[enums.SHAPE_LINE | enums.SHAPE_AABB] = line_aabb;
intersect[enums.SHAPE_LINE | enums.SHAPE_OBB] = line_obb;
intersect[enums.SHAPE_LINE | enums.SHAPE_PLANE] = line_plane;
intersect[enums.SHAPE_LINE | enums.SHAPE_TRIANGLE] = line_triangle;

intersect[enums.SHAPE_SPHERE] = sphere_sphere;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_AABB] = sphere_aabb;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_OBB] = sphere_obb;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_PLANE] = sphere_plane;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_FRUSTUM] = sphere_frustum;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_CAPSULE] = sphere_capsule;

intersect[enums.SHAPE_AABB] = aabb_aabb;
intersect[enums.SHAPE_AABB | enums.SHAPE_OBB] = aabb_obb;
intersect[enums.SHAPE_AABB | enums.SHAPE_PLANE] = aabb_plane;
intersect[enums.SHAPE_AABB | enums.SHAPE_FRUSTUM] = aabb_frustum;
intersect[enums.SHAPE_AABB | enums.SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;

intersect[enums.SHAPE_OBB] = obb_obb;
intersect[enums.SHAPE_OBB | enums.SHAPE_PLANE] = obb_plane;
intersect[enums.SHAPE_OBB | enums.SHAPE_FRUSTUM] = obb_frustum;
intersect[enums.SHAPE_OBB | enums.SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;
intersect[enums.SHAPE_OBB | enums.SHAPE_CAPSULE] = obb_capsule;

intersect[enums.SHAPE_CAPSULE] = capsule_capsule;

export default intersect;
