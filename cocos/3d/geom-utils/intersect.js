import { mat3, vec3 } from '../vmath';
import distance from './distance';
import enums from './enums';

/**
 * ray-plane intersect
 *
 * @param {ray} ray
 * @param {plane} plane
 * @return {number}
 */
let ray_plane = (function () {
  let pt = vec3.create(0, 0, 0);

  return function (ray, plane) {
    distance.pt_point_plane(pt, ray.o, plane);
    let t = vec3.dot(pt, plane.n) / vec3.dot(ray.d, plane.n);
    if (t < 0) return 0;
    return t;
  };
})();

/**
 * line-plane intersect
 *
 * @param {line} line
 * @param {plane} plane
 * @return {number}
 */
let line_plane = (function () {
  let ab = vec3.create(0, 0, 0);

  return function (line, plane) {
    vec3.sub(ab, line.e, line.s);
    let t = (plane.d - vec3.dot(line.s, plane.n)) / vec3.dot(ab, plane.n);
    if (t < 0 || t > 1) return 0;
    return t;
  };
})();

/**
 * ray-triangle intersect
 *
 * @param {ray} ray
 * @param {triangle} triangle
 * @return {number}
 */
let ray_triangle = (function () {
  let ab = vec3.create(0, 0, 0);
  let ac = vec3.create(0, 0, 0);
  let pvec = vec3.create(0, 0, 0);
  let tvec = vec3.create(0, 0, 0);
  let qvec = vec3.create(0, 0, 0);

  return function (ray, triangle) {
    vec3.sub(ab, triangle.b, triangle.a);
    vec3.sub(ac, triangle.c, triangle.a);

    vec3.cross(pvec, ray.d, ac);
    let det = vec3.dot(ab, pvec);

    if (det <= 0) {
      return 0;
    }

    vec3.sub(tvec, ray.o, triangle.a);
    let u = vec3.dot(tvec, pvec);
    if (u < 0 || u > det) {
      return 0;
    }

    vec3.cross(qvec, tvec, ab);
    let v = vec3.dot(ray.d, qvec);
    if (v < 0 || u + v > det) {
      return 0;
    }

    let t = vec3.dot(ac, qvec) / det;
    if (t < 0) return 0;
    return t;
  };
})();

/**
 * line-triangle intersect
 *
 * @param {line} line
 * @param {triangle} triangle
 * @param {vec3} outPt the intersect point if provide
 * @return {number}
 */
let line_triangle = (function () {
  let ab = vec3.create(0, 0, 0);
  let ac = vec3.create(0, 0, 0);
  let qp = vec3.create(0, 0, 0);
  let ap = vec3.create(0, 0, 0);
  let n = vec3.create(0, 0, 0);
  let e = vec3.create(0, 0, 0);

  return function (line, triangle, outPt) {
    vec3.sub(ab, triangle.b, triangle.a);
    vec3.sub(ac, triangle.c, triangle.a);
    vec3.sub(qp, line.s, line.e);

    vec3.cross(n, ab, ac);
    let det = vec3.dot(qp, n);

    if (det <= 0.0) {
      return 0;
    }

    vec3.sub(ap, line.s, triangle.a);
    let t = vec3.dot(ap, n);
    if (t < 0 || t > det) {
      return 0;
    }

    vec3.cross(e, qp, ap);
    let v = vec3.dot(ac, e);
    if (v < 0 || v > det) {
      return 0;
    }

    let w = -vec3.dot(ab, e);
    if (w < 0.0 || v + w > det) {
      return 0;
    }

    if (outPt) {
      let invDet = 1.0 / det;
      v *= invDet;
      w *= invDet;
      let u = 1.0 - v - w;

      // outPt = u*a + v*d + w*c;
      vec3.set(outPt,
        triangle.a.x * u + triangle.b.x * v + triangle.c.x * w,
        triangle.a.y * u + triangle.b.y * v + triangle.c.y * w,
        triangle.a.z * u + triangle.b.z * v + triangle.c.z * w
      );
    }

    return 1;
  };
})();

/**
 * line-quad intersect
 *
 * @param {vec3} p
 * @param {vec3} q
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @param {vec3} d
 * @param {vec3} outPt the intersect point if provide
 * @return {number}
 */
let line_quad = (function () {
  let pq = vec3.create(0, 0, 0);
  let pa = vec3.create(0, 0, 0);
  let pb = vec3.create(0, 0, 0);
  let pc = vec3.create(0, 0, 0);
  let pd = vec3.create(0, 0, 0);
  let m = vec3.create(0, 0, 0);
  let tmp = vec3.create(0, 0, 0);

  return function (p, q, a, b, c, d, outPt) {
    vec3.sub(pq, q, p);
    vec3.sub(pa, a, p);
    vec3.sub(pb, b, p);
    vec3.sub(pc, c, p);

    // Determine which triangle to test against by testing against diagonal first
    vec3.cross(m, pc, pq);
    let v = vec3.dot(pa, m);

    if (v >= 0) {
      // Test intersection against triangle abc
      let u = -vec3.dot(pb, m);
      if (u < 0) {
        return 0;
      }

      let w = vec3.dot(vec3.cross(tmp, pq, pb), pa);
      if (w < 0) {
        return 0;
      }

      // outPt = u*a + v*b + w*c;
      if (outPt) {
        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        vec3.set(outPt,
          a.x * u + b.x * v + c.x * w,
          a.y * u + b.y * v + c.y * w,
          a.z * u + b.z * v + c.z * w
        );
      }
    } else {
      // Test intersection against triangle dac
      vec3.sub(pd, d, p);

      let u = vec3.dot(pd, m);
      if (u < 0) {
        return 0;
      }

      let w = vec3.dot(vec3.cross(tmp, pq, pa), pd);
      if (w < 0) {
        return 0;
      }

      // outPt = u*a + v*d + w*c;
      if (outPt) {
        v = -v;

        let denom = 1.0 / (u + v + w);
        u *= denom;
        v *= denom;
        w *= denom;

        vec3.set(outPt,
          a.x * u + d.x * v + c.x * w,
          a.y * u + d.y * v + c.y * w,
          a.z * u + d.z * v + c.z * w
        );
      }
    }

    return 1;
  };
})();

/**
 * ray-sphere intersect
 *
 * @param {ray} ray
 * @param {sphere} sphere
 * @return {number}
 */
let ray_sphere = (function () {
  let e = vec3.create(0, 0, 0);
  return function (ray, sphere) {
    let r = sphere.r;
    let c = sphere.c;
    let o = ray.o;
    let d = ray.d;
    let rSq = r * r;
    vec3.sub(e, c, o);
    let eSq = vec3.sqrMag(e);

    let aLength = vec3.dot(e, d); // assume ray direction already normalized
    let fSq = rSq - (eSq - aLength * aLength);
    if (fSq < 0) return 0;

    let f = Math.sqrt(fSq);
    let t = eSq < rSq ? aLength + f : aLength - f;
    if (t < 0) return 0;
    return t;
  };
})();

/**
 * ray-aabb intersect
 *
 * @param {ray} ray
 * @param {aabb} aabb
 * @return {number}
 */
let ray_aabb = (function() {
  let min = vec3.create();
  let max = vec3.create();
  return function(ray, aabb) {
    let o = ray.o, d = ray.d;
    let ix = 1 / d.x, iy = 1 / d.y, iz = 1 / d.z;
    vec3.sub(min, aabb.center, aabb.halfExtents);
    vec3.add(max, aabb.center, aabb.halfExtents);
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
 * ray-obb intersect
 *
 * @param {ray} ray
 * @param {obb} obb
 * @return {number}
 */
let ray_obb = (function () {
  let center = vec3.create();
  let o = vec3.create();
  let d = vec3.create();
  let X = vec3.create();
  let Y = vec3.create();
  let Z = vec3.create();
  let p = vec3.create();
  let size = new Array(3);
  let f = new Array(3);
  let e = new Array(3);
  let t = new Array(6);

  return function (ray, obb) {
    size[0] = obb.halfExtents.x;
    size[1] = obb.halfExtents.y;
    size[2] = obb.halfExtents.z;
    center = obb.center;
    o = ray.o;
    d = ray.d;

    vec3.set(X, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
    vec3.set(Y, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
    vec3.set(Z, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);
    vec3.sub(p, center, o);

    //The cos values of the ray on the X, Y, Z
    f[0] = vec3.dot(X, d);
    f[1] = vec3.dot(Y, d);
    f[2] = vec3.dot(Z, d);

    //The projection length of P on X, Y, Z
    e[0] = vec3.dot(X, p);
    e[1] = vec3.dot(Y, p);
    e[2] = vec3.dot(Z, p);

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
    let tmin = Math.max(
      Math.max(
        Math.min(t[0], t[1]),
        Math.min(t[2], t[3])),
      Math.min(t[4], t[5])
    );
    let tmax = Math.min(
      Math.min(
        Math.max(t[0], t[1]),
        Math.max(t[2], t[3])),
      Math.max(t[4], t[5])
    );
    if (tmax < 0 || tmin > tmax || tmin < 0) {
      return 0;
    }

    return tmin;
  };
})();

/**
 * aabb-aabb intersect
 *
 * @param {aabb} aabb1
 * @param {aabb} aabb2
 * @return {number}
 */
let aabb_aabb = (function () {
  let aMin = vec3.create();
  let aMax = vec3.create();
  let bMin = vec3.create();
  let bMax = vec3.create();
  return function(aabb1, aabb2) {
    vec3.sub(aMin, aabb1.center, aabb1.halfExtents);
    vec3.add(aMax, aabb1.center, aabb1.halfExtents);
    vec3.sub(bMin, aabb2.center, aabb2.halfExtents);
    vec3.add(bMax, aabb2.center, aabb2.halfExtents);
    return (aMin.x <= bMax.x && aMax.x >= bMin.x) &&
      (aMin.y <= bMax.y && aMax.y >= bMin.y) &&
      (aMin.z <= bMax.z && aMax.z >= bMin.z);
  };
})();

function getAABBVertices(min, max, out) {
  vec3.set(out[0], min.x, max.y, max.z);
  vec3.set(out[1], min.x, max.y, min.z);
  vec3.set(out[2], min.x, min.y, max.z);
  vec3.set(out[3], min.x, min.y, min.z);
  vec3.set(out[4], max.x, max.y, max.z);
  vec3.set(out[5], max.x, max.y, min.z);
  vec3.set(out[6], max.x, min.y, max.z);
  vec3.set(out[7], max.x, min.y, min.z);
}

function getOBBVertices(c, e, a1, a2, a3, out) {
  vec3.set(out[0],
    c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z,
    c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z,
    c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z
  );
  vec3.set(out[1],
    c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z,
    c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z,
    c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z
  );
  vec3.set(out[2],
    c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z,
    c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z,
    c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z
  );
  vec3.set(out[3],
    c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z,
    c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z,
    c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z
  );
  vec3.set(out[4],
    c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z,
    c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z,
    c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z
  );
  vec3.set(out[5],
    c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z,
    c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z,
    c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z
  );
  vec3.set(out[6],
    c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z,
    c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z,
    c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z
  );
  vec3.set(out[7],
    c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z,
    c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z,
    c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z
  );
}

function getInterval(vertices, axis) {
  let min = vec3.dot(axis, vertices[0]), max = min;
  for (let i = 1; i < 8; ++i) {
    let projection = vec3.dot(axis, vertices[i]);
    min = (projection < min) ? projection : min;
    max = (projection > max) ? projection : max;
  }
  return [min, max];
}

/**
 * aabb-obb intersect
 *
 * @param {aabb} aabb
 * @param {obb} obb
 * @return {number}
 */
let aabb_obb = (function () {
  let test = new Array(15);
  for (let i = 0; i < 15; i++) {
    test[i] = vec3.create(0, 0, 0);
  }
  let vertices = new Array(8);
  let vertices2 = new Array(8);
  for (let i = 0; i < 8; i++) {
    vertices[i] = vec3.create(0, 0, 0);
    vertices2[i] = vec3.create(0, 0, 0);
  }
  let min = vec3.create();
  let max = vec3.create();
  return function(aabb, obb) {
    vec3.set(test[0], 1, 0, 0);
    vec3.set(test[1], 0, 1, 0);
    vec3.set(test[2], 0, 0, 1);
    vec3.set(test[3], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
    vec3.set(test[4], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
    vec3.set(test[5], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

    for (let i = 0; i < 3; ++i) { // Fill out rest of axis
      vec3.cross(test[6 + i * 3 + 0], test[i], test[0]);
      vec3.cross(test[6 + i * 3 + 1], test[i], test[1]);
      vec3.cross(test[6 + i * 3 + 1], test[i], test[2]);
    }

    vec3.sub(min, aabb.center, aabb.halfExtents);
    vec3.add(max, aabb.center, aabb.halfExtents);
    getAABBVertices(min, max, vertices);
    getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

    for (let j = 0; j < 15; ++j) {
      let a = getInterval(vertices, test[j]);
      let b = getInterval(vertices2, test[j]);
      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
})();

/**
 * aabb-plane intersect
 *
 * @param {aabb} aabb
 * @param {plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
let aabb_plane = function(aabb, plane) {
  let r = aabb.halfExtents.x * Math.abs(plane.n.x) +
    aabb.halfExtents.y * Math.abs(plane.n.y) +
    aabb.halfExtents.z * Math.abs(plane.n.z);
  let dot = vec3.dot(plane.n, aabb.center);
  if (dot + r < plane.d) return -1;
  else if (dot - r > plane.d) return 0;
  return 1;
};

/**
 * aabb-frustum intersect, faster but has
 * false positive corner cases
 *
 * @param {aabb} aabb
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let aabb_frustum = function (aabb, frustum) {
  for (let i = 0; i < frustum.planes.length; i++)
    // frustum plane normal points to the inside
    if (aabb_plane(aabb, frustum.planes[i]) == -1)
      return 0; // completely outside
  return 1;
};

/**
 * aabb-frustum intersect, handles most of the false positives correctly, read more here:
 * https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
 *
 * @param {aabb} aabb
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let aabb_frustum_accurate = (function () {
  let tmp = new Array(8), out1 = 0, out2 = 0;
  for (let i = 0; i < tmp.length; i++) {
    tmp[i] = vec3.create(0, 0, 0);
  }
  return function (aabb, frustum) {
    let result = 0, intersects = false;
    // 1. aabb inside/outside frustum test
    for (let i = 0; i < frustum.planes.length; i++) {
      result = aabb_plane(aabb, frustum.planes[i]);
      // frustum plane normal points to the inside
      if (result == -1) return 0; // completely outside
      else if (result == 1) intersects = true;
    }
    if (!intersects) return 1; // completely inside
    // in case of false positives
    // 2. frustum inside/outside aabb test
    for (let i = 0; i < frustum.vertices.length; i++)
      vec3.sub(tmp[i], frustum.vertices[i], aabb.center);
    out1 = 0, out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      if (tmp[i].x > aabb.halfExtents.x) out1++;
      else if (tmp[i].x < -aabb.halfExtents.x) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    out1 = 0; out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      if (tmp[i].y > aabb.halfExtents.y) out1++;
      else if (tmp[i].y < -aabb.halfExtents.y) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    out1 = 0; out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      if (tmp[i].z > aabb.halfExtents.z) out1++;
      else if (tmp[i].z < -aabb.halfExtents.z) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    return 1;
  };
})();

/**
 * obb-point intersect
 *
 * @param {obb} obb
 * @param {vec3} point
 * @return {number}
 */
let obb_point = (function () {
  let tmp = vec3.create(0, 0, 0), m3 = mat3.create();
  let lessThan = function(a, b) { return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z; };
  return function(obb, point) {
    vec3.sub(tmp, point, obb.center);
    vec3.transformMat3(tmp, tmp, mat3.transpose(m3, obb.orientation));
    return lessThan(tmp, obb.halfExtents);
  };
})();

/**
 * obb-plane intersect
 *
 * @param {obb} obb
 * @param {plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
let obb_plane = (function () {
  let absDot = function(n, x, y, z) {
    return Math.abs(n.x * x + n.y * y + n.z * z);
  };
  return function (obb, plane) {
    // Real-Time Collision Detection, Christer Ericson, p. 163.
    let r = obb.halfExtents.x * absDot(plane.n, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02) +
      obb.halfExtents.y * absDot(plane.n, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05) +
      obb.halfExtents.z * absDot(plane.n, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

    let dot = vec3.dot(plane.n, obb.center);
    if (dot + r < plane.d) return -1;
    else if (dot - r > plane.d) return 0;
    return 1;
  };
})();

/**
 * obb-frustum intersect, faster but has
 * false positive corner cases
 *
 * @param {obb} obb
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let obb_frustum = function (obb, frustum) {
  for (let i = 0; i < frustum.planes.length; i++)
    // frustum plane normal points to the inside
    if (obb_plane(obb, frustum.planes[i]) == -1)
      return 0; // completely outside
  return 1;
};

/**
 * obb-frustum intersect, handles most of the false positives correctly, read more here:
 * https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/
 *
 * @param {obb} obb
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let obb_frustum_accurate = (function () {
  let tmp = new Array(8), dist = 0, out1 = 0, out2 = 0;
  for (let i = 0; i < tmp.length; i++) {
    tmp[i] = vec3.create(0, 0, 0);
  }
  let dot = function(n, x, y, z) {
    return n.x * x + n.y * y + n.z * z;
  };
  return function (obb, frustum) {
    let result = 0, intersects = false;
    // 1. obb inside/outside frustum test
    for (let i = 0; i < frustum.planes.length; i++) {
      result = obb_plane(obb, frustum.planes[i]);
      // frustum plane normal points to the inside
      if (result == -1) return 0; // completely outside
      else if (result == 1) intersects = true;
    }
    if (!intersects) return 1; // completely inside
    // in case of false positives
    // 2. frustum inside/outside obb test
    for (let i = 0; i < frustum.vertices.length; i++)
      vec3.sub(tmp[i], frustum.vertices[i], obb.center);
    out1 = 0, out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      dist = dot(tmp[i], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);
      if (dist > obb.halfExtents.x) out1++;
      else if (dist < -obb.halfExtents.x) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    out1 = 0; out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      dist = dot(tmp[i], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);
      if (dist > obb.halfExtents.y) out1++;
      else if (dist < -obb.halfExtents.y) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    out1 = 0; out2 = 0;
    for (let i = 0; i < frustum.vertices.length; i++) {
      dist = dot(tmp[i], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);
      if (dist > obb.halfExtents.z) out1++;
      else if (dist < -obb.halfExtents.z) out2++;
    }
    if (out1 == frustum.vertices.length || out2 == frustum.vertices.length) return 0;
    return 1;
  };
})();

/**
 * obb-obb intersect
 *
 * @param {obb} obb
 * @return {number}
 */
let obb_obb = (function () {
  let test = new Array(15);
  for (let i = 0; i < 15; i++) {
    test[i] = vec3.create(0, 0, 0);
  }

  let vertices = new Array(8);
  let vertices2 = new Array(8);
  for (let i = 0; i < 8; i++) {
    vertices[i] = vec3.create(0, 0, 0);
    vertices2[i] = vec3.create(0, 0, 0);
  }

  return function (obb1, obb2) {
    vec3.set(test[0], obb1.orientation.m00, obb1.orientation.m01, obb1.orientation.m02);
    vec3.set(test[1], obb1.orientation.m03, obb1.orientation.m04, obb1.orientation.m05);
    vec3.set(test[2], obb1.orientation.m06, obb1.orientation.m07, obb1.orientation.m08);
    vec3.set(test[3], obb2.orientation.m00, obb2.orientation.m01, obb2.orientation.m02);
    vec3.set(test[4], obb2.orientation.m03, obb2.orientation.m04, obb2.orientation.m05);
    vec3.set(test[5], obb2.orientation.m06, obb2.orientation.m07, obb2.orientation.m08);

    for (let i = 0; i < 3; ++i) { // Fill out rest of axis
      vec3.cross(test[6 + i * 3 + 0], test[i], test[0]);
      vec3.cross(test[6 + i * 3 + 1], test[i], test[1]);
      vec3.cross(test[6 + i * 3 + 1], test[i], test[2]);
    }

    getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
    getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

    for (let i = 0; i < 15; ++i) {
      let a = getInterval(vertices, test[i]);
      let b = getInterval(vertices2, test[i]);
      if (b[0] > a[1] || a[0] > b[1]) {
        return 0; // Seperating axis found
      }
    }

    return 1;
  };
})();

/**
 * sphere-plane intersect, not necessarily faster than obb-plane
 * due to the length calculation of the plane normal to factor out
 * the unnomalized plane distance
 *
 * @param {sphere} sphere
 * @param {plane} plane
 * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
 */
let sphere_plane = function (sphere, plane) {
  let dot = vec3.dot(plane.n, sphere.c);
  let r = sphere.r * vec3.magnitude(plane.n);
  if (dot + r < plane.d) return -1;
  else if (dot - r > plane.d) return 0;
  return 1;
};

/**
 * sphere-frustum intersect, faster but has
 * false positive corner cases
 *
 * @param {sphere} sphere
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let sphere_frustum = function (sphere, frustum) {
  for (let i = 0; i < frustum.planes.length; i++)
    // frustum plane normal points to the inside
    if (sphere_plane(sphere, frustum.planes[i]) == -1)
      return 0; // completely outside
  return 1;
};

/**
 * sphere-frustum intersect, handles the false positives correctly, read more here:
 * https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases
 *
 * @param {sphere} sphere
 * @param {planes: plane[], vertices: vec3[]} frustum
 * @return {number}
 */
let sphere_frustum_accurate = (function () {
  let pt = vec3.create(0, 0, 0), map = [1, -1, 1, -1, 1, -1];
  return function (sphere, frustum) {
    for (let i = 0; i < 6; i++) {
      let plane = frustum.planes[i];
      let r = sphere.r, c = sphere.c;
      let n = plane.n, d = plane.d;
      let dot = vec3.dot(n, c);
      // frustum plane normal points to the inside
      if (dot + r < d) return 0; // completely outside
      else if (dot - r > d) continue;
      // in case of false positives
      // has false negatives, still working on it
      vec3.add(pt, c, vec3.scale(pt, n, r));
      for (let j = 0; j < 6; j++) {
        if (j == i || j == i + map[i]) continue;
        let test = frustum.planes[j];
        if (vec3.dot(test.n, pt) < test.d) return 0;
      }
    }
    return 1;
  };
})();

/**
 * sphere-sphere intersect
 *
 * @param {sphere} sphere0
 * @param {sphere} sphere1
 * @return {number}
 */
let sphere_sphere = function (sphere0, sphere1) {
  let r = sphere0.r + sphere1.r;
  return vec3.sqrDist(sphere0.c, sphere1.c) < r * r;
};

/**
 * sphere-aabb intersect
 *
 * @param {sphere} sphere
 * @param {aabb} aabb
 * @return {number}
 */
let sphere_aabb = (function() {
  let pt = vec3.create();
  return function(sphere, aabb) {
    distance.pt_point_aabb(pt, sphere.o, aabb);
    return vec3.sqrDist(sphere.o, pt) < sphere.r * sphere.r;
  };
})();

/**
 * sphere-obb intersect
 *
 * @param {sphere} sphere
 * @param {obb} obb
 * @return {number}
 */
let sphere_obb = (function () {
  let pt = vec3.create();
  return function (sphere, obb) {
    distance.pt_point_obb(pt, sphere.c, obb);
    return vec3.sqrDist(sphere.c, pt) < sphere.r * sphere.r;
  };
})();

let intersect = {
  ray_sphere,
  ray_aabb,
  ray_obb,
  ray_plane,
  ray_triangle,
  line_plane,
  line_triangle,
  line_quad,

  sphere_sphere,
  sphere_aabb,
  sphere_obb,
  sphere_plane,
  sphere_frustum,
  sphere_frustum_accurate,

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
};

intersect[enums.SHAPE_RAY | enums.SHAPE_SPHERE] = ray_sphere;
intersect[enums.SHAPE_RAY | enums.SHAPE_AABB] = ray_aabb;
intersect[enums.SHAPE_RAY | enums.SHAPE_OBB] = ray_obb;
intersect[enums.SHAPE_RAY | enums.SHAPE_PLANE] = ray_plane;
intersect[enums.SHAPE_RAY | enums.SHAPE_TRIANGLE] = ray_triangle;
intersect[enums.SHAPE_LINE | enums.SHAPE_PLANE] = line_plane;
intersect[enums.SHAPE_LINE | enums.SHAPE_TRIANGLE] = line_triangle;

intersect[enums.SHAPE_SPHERE] = sphere_sphere;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_AABB] = sphere_aabb;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_OBB] = sphere_obb;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_PLANE] = sphere_plane;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_FRUSTUM] = sphere_frustum;
intersect[enums.SHAPE_SPHERE | enums.SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;

intersect[enums.SHAPE_AABB] = aabb_aabb;
intersect[enums.SHAPE_AABB | enums.SHAPE_OBB] = aabb_obb;
intersect[enums.SHAPE_AABB | enums.SHAPE_PLANE] = aabb_plane;
intersect[enums.SHAPE_AABB | enums.SHAPE_FRUSTUM] = aabb_frustum;
intersect[enums.SHAPE_AABB | enums.SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;

intersect[enums.SHAPE_OBB] = obb_obb;
intersect[enums.SHAPE_OBB | enums.SHAPE_PLANE] = obb_plane;
intersect[enums.SHAPE_OBB | enums.SHAPE_FRUSTUM] = obb_frustum;
intersect[enums.SHAPE_OBB | enums.SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;

intersect.resolve = function(g1, g2, outPt = null) {
  let type1 = g1._type, type2 = g2._type;
  let resolver = this[type1 | type2];
  if (type1 < type2) return resolver(g1, g2, outPt);
  else return resolver(g2, g1, outPt);
};

export default intersect;
