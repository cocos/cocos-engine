
const Aabb = require('./aabb');
const Ray = require('./ray');
const Triangle = require('./triangle');

import Mat4 from '../value-types/mat4';
import Vec3 from '../value-types/vec3';
import gfx from '../../renderer/gfx';
import RecyclePool from '../../renderer/memop/recycle-pool';


/**
 * !#en 3D intersection helper class
 * !#zh 辅助类，用于测试 3D 物体是否相交
 * @class geomUtils.intersect
 * @static
 */
let intersect = {};

/** 
 * !#en
 * Check whether ray intersect with a 3d aabb
 * !#zh
 * 检测射线是否与 3D 包围盒相交
 * @method rayAabb
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Aabb} aabb
 * @return {Number}
*/
intersect.rayAabb = (function () {
    let min = new Vec3();
    let max = new Vec3();
    return function (ray, aabb) {
        let o = ray.o, d = ray.d;
        let ix = 1 / d.x, iy = 1 / d.y, iz = 1 / d.z;
        Vec3.sub(min, aabb.center, aabb.halfExtents);
        Vec3.add(max, aabb.center, aabb.halfExtents);
        let t1 = (min.x - o.x) * ix;
        let t2 = (max.x - o.x) * ix;
        let t3 = (min.y - o.y) * iy;
        let t4 = (max.y - o.y) * iy;
        let t5 = (min.z - o.z) * iz;
        let t6 = (max.z - o.z) * iz;
        let tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
        let tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
        if (tmax < 0 || tmin > tmax) return 0;
        return tmin;
    };
})();

/** 
 * !#en
 * Check whether ray intersect with a 3D triangle
 * !#zh
 * 检测射线是否与 3D 三角形相交
 * @method rayTriangle
 * @param {geomUtils.Ray} ray
 * @param {geomUtils.Triangle} triangle
*/
intersect.rayTriangle = (function () {
    let ab = new Vec3();
    let ac = new Vec3();
    let pvec = new Vec3();
    let tvec = new Vec3();
    let qvec = new Vec3();

    return function (ray, triangle) {
        Vec3.sub(ab, triangle.b, triangle.a);
        Vec3.sub(ac, triangle.c, triangle.a);

        Vec3.cross(pvec, ray.d, ac);
        let det = Vec3.dot(ab, pvec);

        if (det <= 0) {
            return 0;
        }

        Vec3.sub(tvec, ray.o, triangle.a);
        let u = Vec3.dot(tvec, pvec);
        if (u < 0 || u > det) {
            return 0;
        }

        Vec3.cross(qvec, tvec, ab);
        let v = Vec3.dot(ray.d, qvec);
        if (v < 0 || u + v > det) {
            return 0;
        }

        let t = Vec3.dot(ac, qvec) / det;
        if (t < 0) return 0;
        return t;
    };
})();


intersect.rayMesh = (function () {
    let tri = Triangle.create();
    let minDist = Infinity;

    function getVec3 (out, data, idx, stride) {
        Vec3.set(out, data[idx*stride], data[idx*stride + 1], data[idx*stride + 2]);
    }
    
    return function (ray, mesh) {
        minDist = Infinity;
        let subMeshes = mesh._subMeshes;

        for (let i = 0; i < subMeshes.length; i++) {
            if (subMeshes[i]._primitiveType !== gfx.PT_TRIANGLES) continue;

            let subData = (mesh._subDatas[i] || mesh._subDatas[0]);
            let posData = mesh._getAttrMeshData(i, gfx.ATTR_POSITION);
            let iData = subData.getIData(Uint16Array);

            let format = subData.vfm;
            let fmt = format.element(gfx.ATTR_POSITION);
            let num = fmt.num;
            for (let i = 0; i < iData.length; i += 3) {
                getVec3(tri.a, posData, iData[ i ], num);
                getVec3(tri.b, posData, iData[i+1], num);
                getVec3(tri.c, posData, iData[i+2], num);

                let dist = intersect.rayTriangle(ray, tri);
                if (dist > 0 && dist < minDist) {
                    minDist = dist;
                }
            }
        }
        return minDist;
    };
})();


/** 
 * !#en
 * Check whether ray intersect with nodes
 * !#zh
 * 检测射线是否与物体有交集
 * @method raycast
 * @param {Node} root - If root is null, then traversal nodes from scene node
 * @param {geomUtils.Ray} worldRay
 * @param {Function} handler
 * @param {Function} filter
 * @return [{node, distance}]
*/
intersect.raycast = (function () {
    function traversal (node, cb) {
        var children = node.children;

        for (var i = children.length - 1; i >= 0; i--) {
            var child = children[i];
            traversal(child, cb);
        }

        cb(node);
    }

    function cmp (a, b) {
        return a.distance - b.distance;
    }

    function transformMat4Normal (out, a, m) {
        let mm = m.m;
        let x = a.x, y = a.y, z = a.z,
            rhw = mm[3] * x + mm[7] * y + mm[11] * z;
        rhw = rhw ? 1 / rhw : 1;
        out.x = (mm[0] * x + mm[4] * y + mm[8] * z) * rhw;
        out.y = (mm[1] * x + mm[5] * y + mm[9] * z) * rhw;
        out.z = (mm[2] * x + mm[6] * y + mm[10] * z) * rhw;
        return out;
    }

    let resultsPool = new RecyclePool(function () {
        return {
            distance: 0,
            node: null
        }
    }, 1);

    let results = [];

    // temp variable
    let nodeAabb = Aabb.create();
    let minPos = new Vec3();
    let maxPos = new Vec3();

    let modelRay = new Ray();
    let m4_1 = cc.mat4();
    let m4_2 = cc.mat4();
    let d = new Vec3();

    function distanceValid (distance) {
        return distance > 0 && distance < Infinity;
    }

    return function (root, worldRay, handler, filter) {
        resultsPool.reset();
        results.length = 0;

        root = root || cc.director.getScene();
        traversal(root, function (node) {
            if (filter && !filter(node)) return;

            // transform world ray to model ray
            Mat4.invert(m4_2, node.getWorldMatrix(m4_1));
            Vec3.transformMat4(modelRay.o, worldRay.o, m4_2);
            Vec3.normalize(modelRay.d, transformMat4Normal(modelRay.d, worldRay.d, m4_2));

            // raycast with bounding box
            let distance = Infinity;
            let component = node._renderComponent;
            if (component instanceof cc.MeshRenderer ) {
                distance = intersect.rayAabb(modelRay, component._boundingBox);
            }
            else if (node.width && node.height) {
                Vec3.set(minPos, -node.width * node.anchorX, -node.height * node.anchorY, node.z);
                Vec3.set(maxPos, node.width * (1 - node.anchorX), node.height * (1 - node.anchorY), node.z);
                Aabb.fromPoints(nodeAabb, minPos, maxPos);
                distance = intersect.rayAabb(modelRay, nodeAabb);
            }

            if (!distanceValid(distance)) return;

            if (handler) {
                distance = handler(modelRay, node, distance);
            }

            if (distanceValid(distance)) {
                Vec3.scale(d, modelRay.d, distance);
                transformMat4Normal(d, d, m4_1);
                let res = resultsPool.add();
                res.node = node;
                res.distance = Vec3.mag(d);
                results.push(res);
            }
        });

        results.sort(cmp);
        return results;
    }
})();

export default intersect;
