(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "./distance.js", "./enums.js", "./ray.js", "./sphere.js", "./triangle.js", "../gfx/index.js", "./spec.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("./distance.js"), require("./enums.js"), require("./ray.js"), require("./sphere.js"), require("./triangle.js"), require("../gfx/index.js"), require("./spec.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.distance, global.enums, global.ray, global.sphere, global.triangle, global.index, global.spec);
    global.intersect = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, distance, _enums, _ray, _sphere, _triangle, _index2, _spec) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  distance = _interopRequireWildcard(distance);
  _enums = _interopRequireDefault(_enums);
  _ray = _interopRequireDefault(_ray);
  _sphere = _interopRequireDefault(_sphere);
  _triangle = _interopRequireDefault(_triangle);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  /**
   * 几何工具模块
   * @category geometry
   */
  // tslint:disable:only-arrow-functions
  // tslint:disable:one-variable-per-declaration
  // tslint:disable:prefer-for-of
  // tslint:disable:no-shadowed-variable

  /**
   * @en
   * ray-plane intersect detect.
   * @zh
   * 射线与平面的相交性检测。
   * @param {ray} ray 射线
   * @param {plane} plane 平面
   * @return {number} 0 或 非0
   */
  var ray_plane = function () {
    var pt = new _index.Vec3(0, 0, 0);
    return function (ray, plane) {
      var denom = _index.Vec3.dot(ray.d, plane.n);

      if (Math.abs(denom) < Number.EPSILON) {
        return 0;
      }

      _index.Vec3.multiplyScalar(pt, plane.n, plane.d);

      var t = _index.Vec3.dot(_index.Vec3.subtract(pt, pt, ray.o), plane.n) / denom;

      if (t < 0) {
        return 0;
      }

      return t;
    };
  }(); // based on http://fileadmin.cs.lth.se/cs/Personal/Tomas_Akenine-Moller/raytri/

  /**
   * @en
   * ray-triangle intersect detect.
   * @zh
   * 射线与三角形的相交性检测。
   * @param {ray} ray 射线
   * @param {triangle} triangle 三角形
   * @param {boolean} doubleSided 三角形是否为双面
   * @return {number} 0 或 非0
   */


  var ray_triangle = function () {
    var ab = new _index.Vec3(0, 0, 0);
    var ac = new _index.Vec3(0, 0, 0);
    var pvec = new _index.Vec3(0, 0, 0);
    var tvec = new _index.Vec3(0, 0, 0);
    var qvec = new _index.Vec3(0, 0, 0);
    return function (ray, triangle, doubleSided) {
      _index.Vec3.subtract(ab, triangle.b, triangle.a);

      _index.Vec3.subtract(ac, triangle.c, triangle.a);

      _index.Vec3.cross(pvec, ray.d, ac);

      var det = _index.Vec3.dot(ab, pvec);

      if (det < Number.EPSILON && (!doubleSided || det > -Number.EPSILON)) {
        return 0;
      }

      var inv_det = 1 / det;

      _index.Vec3.subtract(tvec, ray.o, triangle.a);

      var u = _index.Vec3.dot(tvec, pvec) * inv_det;

      if (u < 0 || u > 1) {
        return 0;
      }

      _index.Vec3.cross(qvec, tvec, ab);

      var v = _index.Vec3.dot(ray.d, qvec) * inv_det;

      if (v < 0 || u + v > 1) {
        return 0;
      }

      var t = _index.Vec3.dot(ac, qvec) * inv_det;
      return t < 0 ? 0 : t;
    };
  }();
  /**
   * @en
   * ray-sphere intersect detect.
   * @zh
   * 射线和球的相交性检测。
   * @param {ray} ray 射线
   * @param {sphere} sphere 球
   * @return {number} 0 或 非0
   */


  var ray_sphere = function () {
    var e = new _index.Vec3(0, 0, 0);
    return function (ray, sphere) {
      var r = sphere.radius;
      var c = sphere.center;
      var o = ray.o;
      var d = ray.d;
      var rSq = r * r;

      _index.Vec3.subtract(e, c, o);

      var eSq = e.lengthSqr();

      var aLength = _index.Vec3.dot(e, d); // assume ray direction already normalized


      var fSq = rSq - (eSq - aLength * aLength);

      if (fSq < 0) {
        return 0;
      }

      var f = Math.sqrt(fSq);
      var t = eSq < rSq ? aLength + f : aLength - f;

      if (t < 0) {
        return 0;
      }

      return t;
    };
  }();
  /**
   * @en
   * ray-aabb intersect detect.
   * @zh
   * 射线和轴对齐包围盒的相交性检测。
   * @param {ray} ray 射线
   * @param {aabb} aabb 轴对齐包围盒
   * @return {number} 0 或 非0
   */


  var ray_aabb = function () {
    var min = new _index.Vec3();
    var max = new _index.Vec3();
    return function (ray, aabb) {
      _index.Vec3.subtract(min, aabb.center, aabb.halfExtents);

      _index.Vec3.add(max, aabb.center, aabb.halfExtents);

      return ray_aabb2(ray, min, max);
    };
  }();

  function ray_aabb2(ray, min, max) {
    var o = ray.o,
        d = ray.d;
    var ix = 1 / d.x,
        iy = 1 / d.y,
        iz = 1 / d.z;
    var t1 = (min.x - o.x) * ix;
    var t2 = (max.x - o.x) * ix;
    var t3 = (min.y - o.y) * iy;
    var t4 = (max.y - o.y) * iy;
    var t5 = (min.z - o.z) * iz;
    var t6 = (max.z - o.z) * iz;
    var tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6));
    var tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));

    if (tmax < 0 || tmin > tmax) {
      return 0;
    }

    return tmin > 0 ? tmin : tmax; // ray origin inside aabb
  }
  /**
   * @en
   * ray-obb intersect detect.
   * @zh
   * 射线和方向包围盒的相交性检测。
   * @param {ray} ray 射线
   * @param {obb} obb 方向包围盒
   * @return {number} 0 或 非0
   */


  var ray_obb = function () {
    var center = new _index.Vec3();
    var o = new _index.Vec3();
    var d = new _index.Vec3();
    var X = new _index.Vec3();
    var Y = new _index.Vec3();
    var Z = new _index.Vec3();
    var p = new _index.Vec3();
    var size = new Array(3);
    var f = new Array(3);
    var e = new Array(3);
    var t = new Array(6);
    return function (ray, obb) {
      size[0] = obb.halfExtents.x;
      size[1] = obb.halfExtents.y;
      size[2] = obb.halfExtents.z;
      center = obb.center;
      o = ray.o;
      d = ray.d;

      _index.Vec3.set(X, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);

      _index.Vec3.set(Y, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);

      _index.Vec3.set(Z, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

      _index.Vec3.subtract(p, center, o); // The cos values of the ray on the X, Y, Z


      f[0] = _index.Vec3.dot(X, d);
      f[1] = _index.Vec3.dot(Y, d);
      f[2] = _index.Vec3.dot(Z, d); // The projection length of P on X, Y, Z

      e[0] = _index.Vec3.dot(X, p);
      e[1] = _index.Vec3.dot(Y, p);
      e[2] = _index.Vec3.dot(Z, p);

      for (var i = 0; i < 3; ++i) {
        if (f[i] === 0) {
          if (-e[i] - size[i] > 0 || -e[i] + size[i] < 0) {
            return 0;
          } // Avoid div by 0!


          f[i] = 0.0000001;
        } // min


        t[i * 2 + 0] = (e[i] + size[i]) / f[i]; // max

        t[i * 2 + 1] = (e[i] - size[i]) / f[i];
      }

      var tmin = Math.max(Math.max(Math.min(t[0], t[1]), Math.min(t[2], t[3])), Math.min(t[4], t[5]));
      var tmax = Math.min(Math.min(Math.max(t[0], t[1]), Math.max(t[2], t[3])), Math.max(t[4], t[5]));

      if (tmax < 0 || tmin > tmax) {
        return 0;
      }

      return tmin > 0 ? tmin : tmax; // ray origin inside aabb
    };
  }();
  /**
   * @en
   * ray-capsule intersect detect.
   * @zh
   * 射线和胶囊体的相交性检测。
   * @param {ray} ray 射线
   * @param {capsule} capsule 胶囊体
   * @return {number} 0 或 非0
   */


  var ray_capsule = function () {
    var v3_0 = new _index.Vec3();
    var v3_1 = new _index.Vec3();
    var v3_2 = new _index.Vec3();
    var v3_3 = new _index.Vec3();
    var v3_4 = new _index.Vec3();
    var v3_5 = new _index.Vec3();
    var v3_6 = new _index.Vec3();
    var sphere_0 = new _sphere.default();
    return function (ray, capsule) {
      var radiusSqr = capsule.radius * capsule.radius;

      var vRayNorm = _index.Vec3.normalize(v3_0, ray.d);

      var A = capsule.ellipseCenter0;
      var B = capsule.ellipseCenter1;

      var BA = _index.Vec3.subtract(v3_1, B, A);

      if (BA.equals(_index.Vec3.ZERO)) {
        sphere_0.radius = capsule.radius;
        sphere_0.center.set(capsule.ellipseCenter0);
        return intersect.ray_sphere(ray, sphere_0);
      }

      var O = ray.o;

      var OA = _index.Vec3.subtract(v3_2, O, A);

      var VxBA = _index.Vec3.cross(v3_3, vRayNorm, BA);

      var a = VxBA.lengthSqr();

      if (a === 0) {
        sphere_0.radius = capsule.radius;

        var BO = _index.Vec3.subtract(v3_4, B, O);

        if (OA.lengthSqr() < BO.lengthSqr()) {
          sphere_0.center.set(capsule.ellipseCenter0);
        } else {
          sphere_0.center.set(capsule.ellipseCenter1);
        }

        return intersect.ray_sphere(ray, sphere_0);
      }

      var OAxBA = _index.Vec3.cross(v3_4, OA, BA);

      var ab2 = BA.lengthSqr();

      var b = 2 * _index.Vec3.dot(VxBA, OAxBA);

      var c = OAxBA.lengthSqr() - radiusSqr * ab2;
      var d = b * b - 4 * a * c;

      if (d < 0) {
        return 0;
      }

      var t = (-b - Math.sqrt(d)) / (2 * a);

      if (t < 0) {
        sphere_0.radius = capsule.radius;

        var _BO = _index.Vec3.subtract(v3_5, B, O);

        if (OA.lengthSqr() < _BO.lengthSqr()) {
          sphere_0.center.set(capsule.ellipseCenter0);
        } else {
          sphere_0.center.set(capsule.ellipseCenter1);
        }

        return intersect.ray_sphere(ray, sphere_0);
      } else {
        // Limit intersection between the bounds of the cylinder's end caps.
        var iPos = _index.Vec3.scaleAndAdd(v3_5, ray.o, vRayNorm, t);

        var iPosLen = _index.Vec3.subtract(v3_6, iPos, A);

        var tLimit = _index.Vec3.dot(iPosLen, BA) / ab2;

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
    };
  }();
  /**
   * @en
   * ray-subMesh intersect detect, in model space.
   * @zh
   * 在模型空间中，射线和子三角网格的相交性检测。
   * @param {ray} ray
   * @param {RenderingSubMesh} subMesh
   * @param {IRaySubMeshOptions} options
   * @return {number} 0 or !0
   */


  var ray_subMesh = function () {
    var tri = _triangle.default.create();

    var deOpt = {
      distance: Infinity,
      doubleSided: false,
      mode: _spec.ERaycastMode.ANY
    };
    var minDis = 0;

    var fillResult = function fillResult(m, d, i0, i1, i2, r) {
      if (m === _spec.ERaycastMode.CLOSEST) {
        if (minDis > d || minDis === 0) {
          minDis = d;

          if (r) {
            if (r.length === 0) {
              r.push({
                distance: d,
                vertexIndex0: i0 / 3,
                vertexIndex1: i1 / 3,
                vertexIndex2: i2 / 3
              });
            } else {
              r[0].distance = d;
              r[0].vertexIndex0 = i0 / 3;
              r[0].vertexIndex1 = i1 / 3;
              r[0].vertexIndex2 = i2 / 3;
            }
          }
        }
      } else {
        minDis = d;
        if (r) r.push({
          distance: d,
          vertexIndex0: i0 / 3,
          vertexIndex1: i1 / 3,
          vertexIndex2: i2 / 3
        });
      }
    };

    var narrowphase = function narrowphase(vb, ib, pm, ray, opt) {
      if (pm === _index2.GFXPrimitiveMode.TRIANGLE_LIST) {
        var cnt = ib.length;

        for (var j = 0; j < cnt; j += 3) {
          var i0 = ib[j] * 3;
          var i1 = ib[j + 1] * 3;
          var i2 = ib[j + 2] * 3;

          _index.Vec3.set(tri.a, vb[i0], vb[i0 + 1], vb[i0 + 2]);

          _index.Vec3.set(tri.b, vb[i1], vb[i1 + 1], vb[i1 + 2]);

          _index.Vec3.set(tri.c, vb[i2], vb[i2 + 1], vb[i2 + 2]);

          var dist = intersect.ray_triangle(ray, tri, opt.doubleSided);
          if (dist === 0 || dist > opt.distance) continue;
          fillResult(opt.mode, dist, i0, i1, i2, opt.result);
          if (opt.mode === _spec.ERaycastMode.ANY) return dist;
        }
      } else if (pm === _index2.GFXPrimitiveMode.TRIANGLE_STRIP) {
        var _cnt = ib.length - 2;

        var rev = 0;

        for (var _j = 0; _j < _cnt; _j += 1) {
          var _i = ib[_j - rev] * 3;

          var _i2 = ib[_j + rev + 1] * 3;

          var _i3 = ib[_j + 2] * 3;

          _index.Vec3.set(tri.a, vb[_i], vb[_i + 1], vb[_i + 2]);

          _index.Vec3.set(tri.b, vb[_i2], vb[_i2 + 1], vb[_i2 + 2]);

          _index.Vec3.set(tri.c, vb[_i3], vb[_i3 + 1], vb[_i3 + 2]);

          rev = ~rev;

          var _dist = intersect.ray_triangle(ray, tri, opt.doubleSided);

          if (_dist === 0 || _dist > opt.distance) continue;
          fillResult(opt.mode, _dist, _i, _i2, _i3, opt.result);
          if (opt.mode === _spec.ERaycastMode.ANY) return _dist;
        }
      } else if (pm === _index2.GFXPrimitiveMode.TRIANGLE_FAN) {
        var _cnt2 = ib.length - 1;

        var _i4 = ib[0] * 3;

        _index.Vec3.set(tri.a, vb[_i4], vb[_i4 + 1], vb[_i4 + 2]);

        for (var _j2 = 1; _j2 < _cnt2; _j2 += 1) {
          var _i5 = ib[_j2] * 3;

          var _i6 = ib[_j2 + 1] * 3;

          _index.Vec3.set(tri.b, vb[_i5], vb[_i5 + 1], vb[_i5 + 2]);

          _index.Vec3.set(tri.c, vb[_i6], vb[_i6 + 1], vb[_i6 + 2]);

          var _dist2 = intersect.ray_triangle(ray, tri, opt.doubleSided);

          if (_dist2 === 0 || _dist2 > opt.distance) continue;
          fillResult(opt.mode, _dist2, _i4, _i5, _i6, opt.result);
          if (opt.mode === _spec.ERaycastMode.ANY) return _dist2;
        }
      }

      return minDis;
    };

    return function (ray, submesh, options) {
      minDis = 0;
      if (submesh.geometricInfo.positions.length === 0) return minDis;
      var opt = options === undefined ? deOpt : options;
      var min = submesh.geometricInfo.boundingBox.min;
      var max = submesh.geometricInfo.boundingBox.max;

      if (ray_aabb2(ray, min, max)) {
        var pm = submesh.primitiveMode;
        var _ref = submesh.geometricInfo,
            vb = _ref.positions,
            ib = _ref.indices;
        narrowphase(vb, ib, pm, ray, opt);
      }

      return minDis;
    };
  }();
  /**
   * @en
   * ray-mesh intersect detect, in model space.
   * @zh
   * 在模型空间中，射线和三角网格资源的相交性检测。
   * @param {ray} ray
   * @param {Mesh} mesh
   * @param {IRayMeshOptions} options
   * @return {number} 0 or !0
   */


  var ray_mesh = function () {
    var minDis = 0;
    var deOpt = {
      distance: Infinity,
      doubleSided: false,
      mode: _spec.ERaycastMode.ANY
    };
    return function (ray, mesh, options) {
      minDis = 0;
      var opt = options === undefined ? deOpt : options;
      var length = mesh.renderingSubMeshes.length;
      var min = mesh.struct.minPosition;
      var max = mesh.struct.maxPosition;
      if (min && max && !ray_aabb2(ray, min, max)) return minDis;

      for (var i = 0; i < length; i++) {
        var sm = mesh.renderingSubMeshes[i];
        var dis = ray_subMesh(ray, sm, opt);

        if (dis) {
          if (opt.mode === _spec.ERaycastMode.CLOSEST) {
            if (minDis === 0 || minDis > dis) {
              minDis = dis;
              if (opt.subIndices) opt.subIndices[0] = i;
            }
          } else {
            minDis = dis;
            if (opt.subIndices) opt.subIndices.push(i);

            if (opt.mode === _spec.ERaycastMode.ANY) {
              return dis;
            }
          }
        }
      }

      if (minDis && opt.mode === _spec.ERaycastMode.CLOSEST) {
        if (opt.result) {
          opt.result[0].distance = minDis;
          opt.result.length = 1;
        }

        if (opt.subIndices) opt.subIndices.length = 1;
      }

      return minDis;
    };
  }();
  /**
   * @en
   * ray-model intersect detect, in world space.
   * @zh
   * 在世界空间中，射线和渲染模型的相交性检测。
   * @param ray
   * @param model
   * @param options
   * @return 0 or !0
   */


  var ray_model = function () {
    var minDis = 0;
    var deOpt = {
      distance: Infinity,
      doubleSided: false,
      mode: _spec.ERaycastMode.ANY
    };
    var modelRay = new _ray.default();
    var m4 = new _index.Mat4();
    return function (r, model, options) {
      minDis = 0;
      var opt = options === undefined ? deOpt : options;
      var wb = model.worldBounds;
      if (wb && !ray_aabb(r, wb)) return minDis;

      _ray.default.copy(modelRay, r);

      if (model.node) {
        _index.Mat4.invert(m4, model.node.getWorldMatrix(m4));

        _index.Vec3.transformMat4(modelRay.o, r.o, m4);

        _index.Vec3.transformMat4Normal(modelRay.d, r.d, m4);
      }

      var subModels = model.subModels;

      for (var i = 0; i < subModels.length; i++) {
        var subMesh = subModels[i].subMesh;
        var dis = ray_subMesh(modelRay, subMesh, opt);

        if (dis) {
          if (opt.mode === _spec.ERaycastMode.CLOSEST) {
            if (minDis === 0 || minDis > dis) {
              minDis = dis;
              if (opt.subIndices) opt.subIndices[0] = i;
            }
          } else {
            minDis = dis;
            if (opt.subIndices) opt.subIndices.push(i);

            if (opt.mode === _spec.ERaycastMode.ANY) {
              return dis;
            }
          }
        }
      }

      if (minDis && opt.mode === _spec.ERaycastMode.CLOSEST) {
        if (opt.result) {
          opt.result[0].distance = minDis;
          opt.result.length = 1;
        }

        if (opt.subIndices) opt.subIndices.length = 1;
      }

      return minDis;
    };
  }();
  /**
   * @en
   * line-plane intersect detect.
   * @zh
   * 线段与平面的相交性检测。
   * @param {line} line 线段
   * @param {plane} plane 平面
   * @return {number} 0 或 非0
   */


  var line_plane = function () {
    var ab = new _index.Vec3(0, 0, 0);
    return function (line, plane) {
      _index.Vec3.subtract(ab, line.e, line.s);

      var t = (plane.d - _index.Vec3.dot(line.s, plane.n)) / _index.Vec3.dot(ab, plane.n);

      if (t < 0 || t > 1) {
        return 0;
      }

      return t;
    };
  }();
  /**
   * @en
   * line-triangle intersect detect.
   * @zh
   * 线段与三角形的相交性检测。
   * @param {line} line 线段
   * @param {triangle} triangle 三角形
   * @param {Vec3} outPt 可选，相交点
   * @return {number} 0 或 非0
   */


  var line_triangle = function () {
    var ab = new _index.Vec3(0, 0, 0);
    var ac = new _index.Vec3(0, 0, 0);
    var qp = new _index.Vec3(0, 0, 0);
    var ap = new _index.Vec3(0, 0, 0);
    var n = new _index.Vec3(0, 0, 0);
    var e = new _index.Vec3(0, 0, 0);
    return function (line, triangle, outPt) {
      _index.Vec3.subtract(ab, triangle.b, triangle.a);

      _index.Vec3.subtract(ac, triangle.c, triangle.a);

      _index.Vec3.subtract(qp, line.s, line.e);

      _index.Vec3.cross(n, ab, ac);

      var det = _index.Vec3.dot(qp, n);

      if (det <= 0.0) {
        return 0;
      }

      _index.Vec3.subtract(ap, line.s, triangle.a);

      var t = _index.Vec3.dot(ap, n);

      if (t < 0 || t > det) {
        return 0;
      }

      _index.Vec3.cross(e, qp, ap);

      var v = _index.Vec3.dot(ac, e);

      if (v < 0 || v > det) {
        return 0;
      }

      var w = -_index.Vec3.dot(ab, e);

      if (w < 0.0 || v + w > det) {
        return 0;
      }

      if (outPt) {
        var invDet = 1.0 / det;
        v *= invDet;
        w *= invDet;
        var u = 1.0 - v - w; // outPt = u*a + v*d + w*c;

        _index.Vec3.set(outPt, triangle.a.x * u + triangle.b.x * v + triangle.c.x * w, triangle.a.y * u + triangle.b.y * v + triangle.c.y * w, triangle.a.z * u + triangle.b.z * v + triangle.c.z * w);
      }

      return 1;
    };
  }();

  var r_t = new _ray.default();
  /**
   * @en
   * line-aabb intersect detect.
   * @zh
   * 线段与轴对齐包围盒的相交性检测
   * @param line 线段
   * @param aabb 轴对齐包围盒
   * @return {number} 0 或 非0
   */

  function line_aabb(line, aabb) {
    r_t.o.set(line.s);

    _index.Vec3.subtract(r_t.d, line.e, line.s);

    r_t.d.normalize();
    var min = ray_aabb(r_t, aabb);
    var len = line.length();

    if (min <= len) {
      return min;
    } else {
      return 0;
    }
  }
  /**
   * @en
   * line-obb intersect detect.
   * @zh
   * 线段与方向包围盒的相交性检测
   * @param line 线段
   * @param obb 方向包围盒
   * @return {number} 0 或 非0
   */


  function line_obb(line, obb) {
    r_t.o.set(line.s);

    _index.Vec3.subtract(r_t.d, line.e, line.s);

    r_t.d.normalize();
    var min = ray_obb(r_t, obb);
    var len = line.length();

    if (min <= len) {
      return min;
    } else {
      return 0;
    }
  }
  /**
   * @en
   * line-sphere intersect detect.
   * @zh
   * 线段与球的相交性检测
   * @param line 线段
   * @param sphere 球
   * @return {number} 0 或 非0
   */


  function line_sphere(line, sphere) {
    r_t.o.set(line.s);

    _index.Vec3.subtract(r_t.d, line.e, line.s);

    r_t.d.normalize();
    var min = ray_sphere(r_t, sphere);
    var len = line.length();

    if (min <= len) {
      return min;
    } else {
      return 0;
    }
  }
  /**
   * @en
   * aabb-aabb intersect detect.
   * @zh
   * 轴对齐包围盒和轴对齐包围盒的相交性检测。
   * @param {aabb} aabb1 轴对齐包围盒1
   * @param {aabb} aabb2 轴对齐包围盒2
   * @return {number} 0 或 非0
   */


  var aabb_aabb = function () {
    var aMin = new _index.Vec3();
    var aMax = new _index.Vec3();
    var bMin = new _index.Vec3();
    var bMax = new _index.Vec3();
    return function (aabb1, aabb2) {
      _index.Vec3.subtract(aMin, aabb1.center, aabb1.halfExtents);

      _index.Vec3.add(aMax, aabb1.center, aabb1.halfExtents);

      _index.Vec3.subtract(bMin, aabb2.center, aabb2.halfExtents);

      _index.Vec3.add(bMax, aabb2.center, aabb2.halfExtents);

      return aMin.x <= bMax.x && aMax.x >= bMin.x && aMin.y <= bMax.y && aMax.y >= bMin.y && aMin.z <= bMax.z && aMax.z >= bMin.z;
    };
  }();

  function getAABBVertices(min, max, out) {
    _index.Vec3.set(out[0], min.x, max.y, max.z);

    _index.Vec3.set(out[1], min.x, max.y, min.z);

    _index.Vec3.set(out[2], min.x, min.y, max.z);

    _index.Vec3.set(out[3], min.x, min.y, min.z);

    _index.Vec3.set(out[4], max.x, max.y, max.z);

    _index.Vec3.set(out[5], max.x, max.y, min.z);

    _index.Vec3.set(out[6], max.x, min.y, max.z);

    _index.Vec3.set(out[7], max.x, min.y, min.z);
  }

  function getOBBVertices(c, e, a1, a2, a3, out) {
    _index.Vec3.set(out[0], c.x + a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y + a3.z * e.z);

    _index.Vec3.set(out[1], c.x - a1.x * e.x + a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y + a3.z * e.z);

    _index.Vec3.set(out[2], c.x + a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y + a3.z * e.z);

    _index.Vec3.set(out[3], c.x + a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x + a2.z * e.y - a3.z * e.z);

    _index.Vec3.set(out[4], c.x - a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y - a3.z * e.z);

    _index.Vec3.set(out[5], c.x + a1.x * e.x - a2.x * e.y - a3.x * e.z, c.y + a1.y * e.x - a2.y * e.y - a3.y * e.z, c.z + a1.z * e.x - a2.z * e.y - a3.z * e.z);

    _index.Vec3.set(out[6], c.x - a1.x * e.x + a2.x * e.y - a3.x * e.z, c.y - a1.y * e.x + a2.y * e.y - a3.y * e.z, c.z - a1.z * e.x + a2.z * e.y - a3.z * e.z);

    _index.Vec3.set(out[7], c.x - a1.x * e.x - a2.x * e.y + a3.x * e.z, c.y - a1.y * e.x - a2.y * e.y + a3.y * e.z, c.z - a1.z * e.x - a2.z * e.y + a3.z * e.z);
  }

  function getInterval(vertices, axis) {
    var min = _index.Vec3.dot(axis, vertices[0]),
        max = min;

    for (var i = 1; i < 8; ++i) {
      var projection = _index.Vec3.dot(axis, vertices[i]);

      min = projection < min ? projection : min;
      max = projection > max ? projection : max;
    }

    return [min, max];
  }
  /**
   * @en
   * aabb-obb intersect detect.
   * @zh
   * 轴对齐包围盒和方向包围盒的相交性检测。
   * @param {aabb} aabb 轴对齐包围盒
   * @param {obb} obb 方向包围盒
   * @return {number} 0 或 非0
   */


  var aabb_obb = function () {
    var test = new Array(15);

    for (var i = 0; i < 15; i++) {
      test[i] = new _index.Vec3(0, 0, 0);
    }

    var vertices = new Array(8);
    var vertices2 = new Array(8);

    for (var _i7 = 0; _i7 < 8; _i7++) {
      vertices[_i7] = new _index.Vec3(0, 0, 0);
      vertices2[_i7] = new _index.Vec3(0, 0, 0);
    }

    var min = new _index.Vec3();
    var max = new _index.Vec3();
    return function (aabb, obb) {
      _index.Vec3.set(test[0], 1, 0, 0);

      _index.Vec3.set(test[1], 0, 1, 0);

      _index.Vec3.set(test[2], 0, 0, 1);

      _index.Vec3.set(test[3], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);

      _index.Vec3.set(test[4], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);

      _index.Vec3.set(test[5], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

      for (var _i8 = 0; _i8 < 3; ++_i8) {
        // Fill out rest of axis
        _index.Vec3.cross(test[6 + _i8 * 3 + 0], test[_i8], test[0]);

        _index.Vec3.cross(test[6 + _i8 * 3 + 1], test[_i8], test[1]);

        _index.Vec3.cross(test[6 + _i8 * 3 + 1], test[_i8], test[2]);
      }

      _index.Vec3.subtract(min, aabb.center, aabb.halfExtents);

      _index.Vec3.add(max, aabb.center, aabb.halfExtents);

      getAABBVertices(min, max, vertices);
      getOBBVertices(obb.center, obb.halfExtents, test[3], test[4], test[5], vertices2);

      for (var j = 0; j < 15; ++j) {
        var a = getInterval(vertices, test[j]);
        var b = getInterval(vertices2, test[j]);

        if (b[0] > a[1] || a[0] > b[1]) {
          return 0; // Seperating axis found
        }
      }

      return 1;
    };
  }();
  /**
   * @en
   * aabb-plane intersect detect.
   * @zh
   * 轴对齐包围盒和平面的相交性检测。
   * @param {aabb} aabb 轴对齐包围盒
   * @param {plane} plane 平面
   * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
   */


  var aabb_plane = function aabb_plane(aabb, plane) {
    var r = aabb.halfExtents.x * Math.abs(plane.n.x) + aabb.halfExtents.y * Math.abs(plane.n.y) + aabb.halfExtents.z * Math.abs(plane.n.z);

    var dot = _index.Vec3.dot(plane.n, aabb.center);

    if (dot + r < plane.d) {
      return -1;
    } else if (dot - r > plane.d) {
      return 0;
    }

    return 1;
  };
  /**
   * @en
   * aabb-frustum intersect detect, faster but has false positive corner cases.
   * @zh
   * 轴对齐包围盒和锥台相交性检测，速度快，但有错误情况。
   * @param {aabb} aabb 轴对齐包围盒
   * @param {frustum} frustum 锥台
   * @return {number} 0 或 非0
   */


  var aabb_frustum = function aabb_frustum(aabb, frustum) {
    for (var i = 0; i < frustum.planes.length; i++) {
      // frustum plane normal points to the inside
      if (aabb_plane(aabb, frustum.planes[i]) === -1) {
        return 0;
      }
    } // completely outside


    return 1;
  }; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

  /**
   * @en
   * aabb-frustum intersect, handles most of the false positives correctly.
   * @zh
   * 轴对齐包围盒和锥台相交性检测，正确处理大多数错误情况。
   * @param {aabb} aabb 轴对齐包围盒
   * @param {frustum} frustum 锥台
   * @return {number}
   */


  var aabb_frustum_accurate = function () {
    var tmp = new Array(8);
    var out1 = 0,
        out2 = 0;

    for (var i = 0; i < tmp.length; i++) {
      tmp[i] = new _index.Vec3(0, 0, 0);
    }

    return function (aabb, frustum) {
      var result = 0,
          intersects = false; // 1. aabb inside/outside frustum test

      for (var _i9 = 0; _i9 < frustum.planes.length; _i9++) {
        result = aabb_plane(aabb, frustum.planes[_i9]); // frustum plane normal points to the inside

        if (result === -1) {
          return 0;
        } // completely outside
        else if (result === 1) {
            intersects = true;
          }
      }

      if (!intersects) {
        return 1;
      } // completely inside
      // in case of false positives
      // 2. frustum inside/outside aabb test


      for (var _i10 = 0; _i10 < frustum.vertices.length; _i10++) {
        _index.Vec3.subtract(tmp[_i10], frustum.vertices[_i10], aabb.center);
      }

      out1 = 0, out2 = 0;

      for (var _i11 = 0; _i11 < frustum.vertices.length; _i11++) {
        if (tmp[_i11].x > aabb.halfExtents.x) {
          out1++;
        } else if (tmp[_i11].x < -aabb.halfExtents.x) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      out1 = 0;
      out2 = 0;

      for (var _i12 = 0; _i12 < frustum.vertices.length; _i12++) {
        if (tmp[_i12].y > aabb.halfExtents.y) {
          out1++;
        } else if (tmp[_i12].y < -aabb.halfExtents.y) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      out1 = 0;
      out2 = 0;

      for (var _i13 = 0; _i13 < frustum.vertices.length; _i13++) {
        if (tmp[_i13].z > aabb.halfExtents.z) {
          out1++;
        } else if (tmp[_i13].z < -aabb.halfExtents.z) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      return 1;
    };
  }();
  /**
   * @en
   * obb contains the point.
   * @zh
   * 方向包围盒和点的相交性检测。
   * @param {obb} obb 方向包围盒
   * @param {Vec3} point 点
   * @return {boolean} true or false
   */


  var obb_point = function () {
    var tmp = new _index.Vec3(0, 0, 0),
        m3 = new _index.Mat3();

    var lessThan = function lessThan(a, b) {
      return Math.abs(a.x) < b.x && Math.abs(a.y) < b.y && Math.abs(a.z) < b.z;
    };

    return function (obb, point) {
      _index.Vec3.subtract(tmp, point, obb.center);

      _index.Vec3.transformMat3(tmp, tmp, _index.Mat3.transpose(m3, obb.orientation));

      return lessThan(tmp, obb.halfExtents);
    };
  }();
  /**
   * @en
   * obb-plane intersect detect.
   * @zh
   * 方向包围盒和平面的相交性检测。
   * @param {obb} obb 方向包围盒
   * @param {plane} plane 平面
   * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
   */


  var obb_plane = function () {
    var absDot = function absDot(n, x, y, z) {
      return Math.abs(n.x * x + n.y * y + n.z * z);
    };

    return function (obb, plane) {
      // Real-Time Collision Detection, Christer Ericson, p. 163.
      var r = obb.halfExtents.x * absDot(plane.n, obb.orientation.m00, obb.orientation.m01, obb.orientation.m02) + obb.halfExtents.y * absDot(plane.n, obb.orientation.m03, obb.orientation.m04, obb.orientation.m05) + obb.halfExtents.z * absDot(plane.n, obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

      var dot = _index.Vec3.dot(plane.n, obb.center);

      if (dot + r < plane.d) {
        return -1;
      } else if (dot - r > plane.d) {
        return 0;
      }

      return 1;
    };
  }();
  /**
   * @en
   * obb-frustum intersect, faster but has false positive corner cases.
   * @zh
   * 方向包围盒和锥台相交性检测，速度快，但有错误情况。
   * @param {obb} obb 方向包围盒
   * @param {frustum} frustum 锥台
   * @return {number} 0 或 非0
   */


  var obb_frustum = function obb_frustum(obb, frustum) {
    for (var i = 0; i < frustum.planes.length; i++) {
      // frustum plane normal points to the inside
      if (obb_plane(obb, frustum.planes[i]) === -1) {
        return 0;
      }
    } // completely outside


    return 1;
  }; // https://cesium.com/blog/2017/02/02/tighter-frustum-culling-and-why-you-may-want-to-disregard-it/

  /**
   * @en
   * obb-frustum intersect, handles most of the false positives correctly.
   * @zh
   * 方向包围盒和锥台相交性检测，正确处理大多数错误情况。
   * @param {obb} obb 方向包围盒
   * @param {frustum} frustum 锥台
   * @return {number} 0 或 非0
   */


  var obb_frustum_accurate = function () {
    var tmp = new Array(8);
    var dist = 0,
        out1 = 0,
        out2 = 0;

    for (var i = 0; i < tmp.length; i++) {
      tmp[i] = new _index.Vec3(0, 0, 0);
    }

    var dot = function dot(n, x, y, z) {
      return n.x * x + n.y * y + n.z * z;
    };

    return function (obb, frustum) {
      var result = 0,
          intersects = false; // 1. obb inside/outside frustum test

      for (var _i14 = 0; _i14 < frustum.planes.length; _i14++) {
        result = obb_plane(obb, frustum.planes[_i14]); // frustum plane normal points to the inside

        if (result === -1) {
          return 0;
        } // completely outside
        else if (result === 1) {
            intersects = true;
          }
      }

      if (!intersects) {
        return 1;
      } // completely inside
      // in case of false positives
      // 2. frustum inside/outside obb test


      for (var _i15 = 0; _i15 < frustum.vertices.length; _i15++) {
        _index.Vec3.subtract(tmp[_i15], frustum.vertices[_i15], obb.center);
      }

      out1 = 0, out2 = 0;

      for (var _i16 = 0; _i16 < frustum.vertices.length; _i16++) {
        dist = dot(tmp[_i16], obb.orientation.m00, obb.orientation.m01, obb.orientation.m02);

        if (dist > obb.halfExtents.x) {
          out1++;
        } else if (dist < -obb.halfExtents.x) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      out1 = 0;
      out2 = 0;

      for (var _i17 = 0; _i17 < frustum.vertices.length; _i17++) {
        dist = dot(tmp[_i17], obb.orientation.m03, obb.orientation.m04, obb.orientation.m05);

        if (dist > obb.halfExtents.y) {
          out1++;
        } else if (dist < -obb.halfExtents.y) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      out1 = 0;
      out2 = 0;

      for (var _i18 = 0; _i18 < frustum.vertices.length; _i18++) {
        dist = dot(tmp[_i18], obb.orientation.m06, obb.orientation.m07, obb.orientation.m08);

        if (dist > obb.halfExtents.z) {
          out1++;
        } else if (dist < -obb.halfExtents.z) {
          out2++;
        }
      }

      if (out1 === frustum.vertices.length || out2 === frustum.vertices.length) {
        return 0;
      }

      return 1;
    };
  }();
  /**
   * @en
   * obb-obb intersect detect.
   * @zh
   * 方向包围盒和方向包围盒的相交性检测。
   * @param {obb} obb1 方向包围盒1
   * @param {obb} obb2 方向包围盒2
   * @return {number} 0 或 非0
   */


  var obb_obb = function () {
    var test = new Array(15);

    for (var i = 0; i < 15; i++) {
      test[i] = new _index.Vec3(0, 0, 0);
    }

    var vertices = new Array(8);
    var vertices2 = new Array(8);

    for (var _i19 = 0; _i19 < 8; _i19++) {
      vertices[_i19] = new _index.Vec3(0, 0, 0);
      vertices2[_i19] = new _index.Vec3(0, 0, 0);
    }

    return function (obb1, obb2) {
      _index.Vec3.set(test[0], obb1.orientation.m00, obb1.orientation.m01, obb1.orientation.m02);

      _index.Vec3.set(test[1], obb1.orientation.m03, obb1.orientation.m04, obb1.orientation.m05);

      _index.Vec3.set(test[2], obb1.orientation.m06, obb1.orientation.m07, obb1.orientation.m08);

      _index.Vec3.set(test[3], obb2.orientation.m00, obb2.orientation.m01, obb2.orientation.m02);

      _index.Vec3.set(test[4], obb2.orientation.m03, obb2.orientation.m04, obb2.orientation.m05);

      _index.Vec3.set(test[5], obb2.orientation.m06, obb2.orientation.m07, obb2.orientation.m08);

      for (var _i20 = 0; _i20 < 3; ++_i20) {
        // Fill out rest of axis
        _index.Vec3.cross(test[6 + _i20 * 3 + 0], test[_i20], test[0]);

        _index.Vec3.cross(test[6 + _i20 * 3 + 1], test[_i20], test[1]);

        _index.Vec3.cross(test[6 + _i20 * 3 + 1], test[_i20], test[2]);
      }

      getOBBVertices(obb1.center, obb1.halfExtents, test[0], test[1], test[2], vertices);
      getOBBVertices(obb2.center, obb2.halfExtents, test[3], test[4], test[5], vertices2);

      for (var _i21 = 0; _i21 < 15; ++_i21) {
        var a = getInterval(vertices, test[_i21]);
        var b = getInterval(vertices2, test[_i21]);

        if (b[0] > a[1] || a[0] > b[1]) {
          return 0; // Seperating axis found
        }
      }

      return 1;
    };
  }(); // tslint:disable-next-line: max-line-length
  // https://github.com/diku-dk/bvh-tvcg18/blob/1fd3348c17bc8cf3da0b4ae60fdb8f2aa90a6ff0/FOUNDATION/GEOMETRY/GEOMETRY/include/overlap/geometry_overlap_obb_capsule.h

  /**
   * @en
   * obb-capsule intersect detect.
   * @zh
   * 方向包围盒和胶囊体的相交性检测。
   * @param obb 方向包围盒
   * @param capsule 胶囊体
   */


  var obb_capsule = function () {
    var sphere_0 = new _sphere.default();
    var v3_0 = new _index.Vec3();
    var v3_1 = new _index.Vec3();
    var v3_2 = new _index.Vec3();
    var v3_verts8 = new Array(8);

    for (var i = 0; i < 8; i++) {
      v3_verts8[i] = new _index.Vec3();
    }

    var v3_axis8 = new Array(8);

    for (var _i22 = 0; _i22 < 8; _i22++) {
      v3_axis8[_i22] = new _index.Vec3();
    }

    return function (obb, capsule) {
      var h = _index.Vec3.squaredDistance(capsule.ellipseCenter0, capsule.ellipseCenter1);

      if (h === 0) {
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
        var axes = v3_axis8;

        var a0 = _index.Vec3.copy(axes[0], v3_0);

        var a1 = _index.Vec3.copy(axes[1], v3_1);

        var a2 = _index.Vec3.copy(axes[2], v3_2);

        var C = _index.Vec3.subtract(axes[3], capsule.center, obb.center);

        C.normalize();

        var B = _index.Vec3.subtract(axes[4], capsule.ellipseCenter0, capsule.ellipseCenter1);

        B.normalize();

        _index.Vec3.cross(axes[5], a0, B);

        _index.Vec3.cross(axes[6], a1, B);

        _index.Vec3.cross(axes[7], a2, B);

        for (var _i23 = 0; _i23 < 8; ++_i23) {
          var a = getInterval(v3_verts8, axes[_i23]);

          var d0 = _index.Vec3.dot(axes[_i23], capsule.ellipseCenter0);

          var d1 = _index.Vec3.dot(axes[_i23], capsule.ellipseCenter1);

          var max_d = Math.max(d0, d1);
          var min_d = Math.min(d0, d1);
          var d_min = min_d - capsule.radius;
          var d_max = max_d + capsule.radius;

          if (d_min > a[1] || a[0] > d_max) {
            return 0; // Seperating axis found
          }
        }

        return 1;
      }
    };
  }();
  /**
   * @en
   * sphere-plane intersect, not necessarily faster than obb-plane,due to the length calculation of the
   * plane normal to factor out the unnomalized plane distance.
   * @zh
   * 球与平面的相交性检测。
   * @param {sphere} sphere 球
   * @param {plane} plane 平面
   * @return {number} inside(back) = -1, outside(front) = 0, intersect = 1
   */


  var sphere_plane = function sphere_plane(sphere, plane) {
    var dot = _index.Vec3.dot(plane.n, sphere.center);

    var r = sphere.radius * plane.n.length();

    if (dot + r < plane.d) {
      return -1;
    } else if (dot - r > plane.d) {
      return 0;
    }

    return 1;
  };
  /**
   * @en
   * sphere-frustum intersect, faster but has false positive corner cases.
   * @zh
   * 球和锥台的相交性检测，速度快，但有错误情况。
   * @param {sphere} sphere 球
   * @param {frustum} frustum 锥台
   * @return {number} 0 或 非0
   */


  var sphere_frustum = function sphere_frustum(sphere, frustum) {
    for (var i = 0; i < frustum.planes.length; i++) {
      // frustum plane normal points to the inside
      if (sphere_plane(sphere, frustum.planes[i]) === -1) {
        return 0;
      }
    } // completely outside


    return 1;
  }; // https://stackoverflow.com/questions/20912692/view-frustum-culling-corner-cases

  /**
   * @en
   * sphere-frustum intersect, handles the false positives correctly.
   * @zh
   * 球和锥台的相交性检测，正确处理大多数错误情况。
   * @param {sphere} sphere 球
   * @param {frustum} frustum 锥台
   * @return {number} 0 或 非0
   */


  var sphere_frustum_accurate = function () {
    var pt = new _index.Vec3(0, 0, 0),
        map = [1, -1, 1, -1, 1, -1];
    return function (sphere, frustum) {
      for (var i = 0; i < 6; i++) {
        var plane = frustum.planes[i];
        var r = sphere.radius,
            c = sphere.center;
        var n = plane.n,
            d = plane.d;

        var dot = _index.Vec3.dot(n, c); // frustum plane normal points to the inside


        if (dot + r < d) {
          return 0;
        } // completely outside
        else if (dot - r > d) {
            continue;
          } // in case of false positives
        // has false negatives, still working on it


        _index.Vec3.add(pt, c, _index.Vec3.multiplyScalar(pt, n, r));

        for (var j = 0; j < 6; j++) {
          if (j === i || j === i + map[i]) {
            continue;
          }

          var test = frustum.planes[j];

          if (_index.Vec3.dot(test.n, pt) < test.d) {
            return 0;
          }
        }
      }

      return 1;
    };
  }();
  /**
   * @en
   * sphere-sphere intersect detect.
   * @zh
   * 球和球的相交性检测。
   * @param {sphere} sphere0 球0
   * @param {sphere} sphere1 球1
   * @return {boolean} true or false
   */


  var sphere_sphere = function sphere_sphere(sphere0, sphere1) {
    var r = sphere0.radius + sphere1.radius;
    return _index.Vec3.squaredDistance(sphere0.center, sphere1.center) < r * r;
  };
  /**
   * @en
   * sphere-aabb intersect detect.
   * @zh
   * 球和轴对齐包围盒的相交性检测。
   * @param {sphere} sphere 球
   * @param {aabb} aabb 轴对齐包围盒
   * @return {boolean} true or false
   */


  var sphere_aabb = function () {
    var pt = new _index.Vec3();
    return function (sphere, aabb) {
      distance.pt_point_aabb(pt, sphere.center, aabb);
      return _index.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
    };
  }();
  /**
   * @en
   * sphere-obb intersect detect.
   * @zh
   * 球和方向包围盒的相交性检测。
   * @param {sphere} sphere 球
   * @param {obb} obb 方向包围盒
   * @return {boolean} true or false
   */


  var sphere_obb = function () {
    var pt = new _index.Vec3();
    return function (sphere, obb) {
      distance.pt_point_obb(pt, sphere.center, obb);
      return _index.Vec3.squaredDistance(sphere.center, pt) < sphere.radius * sphere.radius;
    };
  }();
  /**
   * @en
   * sphere-capsule intersect detect.
   * @zh
   * 球和胶囊体的相交性检测。
   */


  var sphere_capsule = function () {
    var v3_0 = new _index.Vec3();
    var v3_1 = new _index.Vec3();
    return function (sphere, capsule) {
      var r = sphere.radius + capsule.radius;
      var squaredR = r * r;

      var h = _index.Vec3.squaredDistance(capsule.ellipseCenter0, capsule.ellipseCenter1);

      if (h === 0) {
        return _index.Vec3.squaredDistance(sphere.center, capsule.center) < squaredR;
      } else {
        _index.Vec3.subtract(v3_0, sphere.center, capsule.ellipseCenter0);

        _index.Vec3.subtract(v3_1, capsule.ellipseCenter1, capsule.ellipseCenter0);

        var t = _index.Vec3.dot(v3_0, v3_1) / h;

        if (t < 0) {
          return _index.Vec3.squaredDistance(sphere.center, capsule.ellipseCenter0) < squaredR;
        } else if (t > 1) {
          return _index.Vec3.squaredDistance(sphere.center, capsule.ellipseCenter1) < squaredR;
        } else {
          _index.Vec3.scaleAndAdd(v3_0, capsule.ellipseCenter0, v3_1, t);

          return _index.Vec3.squaredDistance(sphere.center, v3_0) < squaredR;
        }
      }
    };
  }(); // http://www.geomalgorithms.com/a07-_distance.html

  /**
   * @en
   * capsule-capsule intersect detect.
   * @zh
   * 胶囊体和胶囊体的相交性检测。
   */


  var capsule_capsule = function () {
    var v3_0 = new _index.Vec3();
    var v3_1 = new _index.Vec3();
    var v3_2 = new _index.Vec3();
    var v3_3 = new _index.Vec3();
    var v3_4 = new _index.Vec3();
    var v3_5 = new _index.Vec3();
    return function capsule_capsule(capsuleA, capsuleB) {
      var u = _index.Vec3.subtract(v3_0, capsuleA.ellipseCenter1, capsuleA.ellipseCenter0);

      var v = _index.Vec3.subtract(v3_1, capsuleB.ellipseCenter1, capsuleB.ellipseCenter0);

      var w = _index.Vec3.subtract(v3_2, capsuleA.ellipseCenter0, capsuleB.ellipseCenter0);

      var a = _index.Vec3.dot(u, u); // always >= 0


      var b = _index.Vec3.dot(u, v);

      var c = _index.Vec3.dot(v, v); // always >= 0


      var d = _index.Vec3.dot(u, w);

      var e = _index.Vec3.dot(v, w);

      var D = a * c - b * b; // always >= 0

      var sc;
      var sN;
      var sD = D; // sc = sN / sD, default sD = D >= 0

      var tc;
      var tN;
      var tD = D; // tc = tN / tD, default tD = D >= 0
      // compute the line parameters of the two closest points

      if (D < _index.EPSILON) {
        // the lines are almost parallel
        sN = 0.0; // force using point P0 on segment S1

        sD = 1.0; // to prevent possible division by 0.0 later

        tN = e;
        tD = c;
      } else {
        // get the closest points on the infinite lines
        sN = b * e - c * d;
        tN = a * e - b * d;

        if (sN < 0.0) {
          // sc < 0 => the s=0 edge is visible
          sN = 0.0;
          tN = e;
          tD = c;
        } else if (sN > sD) {
          // sc > 1  => the s=1 edge is visible
          sN = sD;
          tN = e + b;
          tD = c;
        }
      }

      if (tN < 0.0) {
        // tc < 0 => the t=0 edge is visible
        tN = 0.0; // recompute sc for this edge

        if (-d < 0.0) {
          sN = 0.0;
        } else if (-d > a) {
          sN = sD;
        } else {
          sN = -d;
          sD = a;
        }
      } else if (tN > tD) {
        // tc > 1  => the t=1 edge is visible
        tN = tD; // recompute sc for this edge

        if (-d + b < 0.0) {
          sN = 0;
        } else if (-d + b > a) {
          sN = sD;
        } else {
          sN = -d + b;
          sD = a;
        }
      } // finally do the division to get sc and tc


      sc = Math.abs(sN) < _index.EPSILON ? 0.0 : sN / sD;
      tc = Math.abs(tN) < _index.EPSILON ? 0.0 : tN / tD; // get the difference of the two closest points

      var dP = v3_3;
      dP.set(w);
      dP.add(_index.Vec3.multiplyScalar(v3_4, u, sc));
      dP.subtract(_index.Vec3.multiplyScalar(v3_5, v, tc));
      var radius = capsuleA.radius + capsuleB.radius;
      return dP.lengthSqr() < radius * radius;
    };
  }();
  /**
   * @en
   * Algorithm of intersect detect for basic geometry.
   * @zh
   * 基础几何的相交性检测算法。
   */


  var intersect = {
    ray_sphere: ray_sphere,
    ray_aabb: ray_aabb,
    ray_obb: ray_obb,
    ray_plane: ray_plane,
    ray_triangle: ray_triangle,
    ray_capsule: ray_capsule,
    ray_subMesh: ray_subMesh,
    ray_mesh: ray_mesh,
    ray_model: ray_model,
    line_sphere: line_sphere,
    line_aabb: line_aabb,
    line_obb: line_obb,
    line_plane: line_plane,
    line_triangle: line_triangle,
    sphere_sphere: sphere_sphere,
    sphere_aabb: sphere_aabb,
    sphere_obb: sphere_obb,
    sphere_plane: sphere_plane,
    sphere_frustum: sphere_frustum,
    sphere_frustum_accurate: sphere_frustum_accurate,
    sphere_capsule: sphere_capsule,
    aabb_aabb: aabb_aabb,
    aabb_obb: aabb_obb,
    aabb_plane: aabb_plane,
    aabb_frustum: aabb_frustum,
    aabb_frustum_accurate: aabb_frustum_accurate,
    obb_obb: obb_obb,
    obb_plane: obb_plane,
    obb_frustum: obb_frustum,
    obb_frustum_accurate: obb_frustum_accurate,
    obb_point: obb_point,
    obb_capsule: obb_capsule,
    capsule_capsule: capsule_capsule,

    /**
     * @zh
     * g1 和 g2 的相交性检测，可填入基础几何中的形状。
     * @param g1 几何1
     * @param g2 几何2
     * @param outPt 可选，相交点。（注：仅部分形状的检测带有这个返回值）
     */
    resolve: function resolve(g1, g2) {
      var outPt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var type1 = g1._type,
          type2 = g2._type;
      var resolver = this[type1 | type2];

      if (type1 < type2) {
        return resolver(g1, g2, outPt);
      } else {
        return resolver(g2, g1, outPt);
      }
    }
  };
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_SPHERE] = ray_sphere;
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_AABB] = ray_aabb;
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_OBB] = ray_obb;
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_PLANE] = ray_plane;
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_TRIANGLE] = ray_triangle;
  intersect[_enums.default.SHAPE_RAY | _enums.default.SHAPE_CAPSULE] = ray_capsule;
  intersect[_enums.default.SHAPE_LINE | _enums.default.SHAPE_SPHERE] = line_sphere;
  intersect[_enums.default.SHAPE_LINE | _enums.default.SHAPE_AABB] = line_aabb;
  intersect[_enums.default.SHAPE_LINE | _enums.default.SHAPE_OBB] = line_obb;
  intersect[_enums.default.SHAPE_LINE | _enums.default.SHAPE_PLANE] = line_plane;
  intersect[_enums.default.SHAPE_LINE | _enums.default.SHAPE_TRIANGLE] = line_triangle;
  intersect[_enums.default.SHAPE_SPHERE] = sphere_sphere;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_AABB] = sphere_aabb;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_OBB] = sphere_obb;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_PLANE] = sphere_plane;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_FRUSTUM] = sphere_frustum;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_FRUSTUM_ACCURATE] = sphere_frustum_accurate;
  intersect[_enums.default.SHAPE_SPHERE | _enums.default.SHAPE_CAPSULE] = sphere_capsule;
  intersect[_enums.default.SHAPE_AABB] = aabb_aabb;
  intersect[_enums.default.SHAPE_AABB | _enums.default.SHAPE_OBB] = aabb_obb;
  intersect[_enums.default.SHAPE_AABB | _enums.default.SHAPE_PLANE] = aabb_plane;
  intersect[_enums.default.SHAPE_AABB | _enums.default.SHAPE_FRUSTUM] = aabb_frustum;
  intersect[_enums.default.SHAPE_AABB | _enums.default.SHAPE_FRUSTUM_ACCURATE] = aabb_frustum_accurate;
  intersect[_enums.default.SHAPE_OBB] = obb_obb;
  intersect[_enums.default.SHAPE_OBB | _enums.default.SHAPE_PLANE] = obb_plane;
  intersect[_enums.default.SHAPE_OBB | _enums.default.SHAPE_FRUSTUM] = obb_frustum;
  intersect[_enums.default.SHAPE_OBB | _enums.default.SHAPE_FRUSTUM_ACCURATE] = obb_frustum_accurate;
  intersect[_enums.default.SHAPE_OBB | _enums.default.SHAPE_CAPSULE] = obb_capsule;
  intersect[_enums.default.SHAPE_CAPSULE] = capsule_capsule;
  var _default = intersect;
  _exports.default = _default;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvaW50ZXJzZWN0LnRzIl0sIm5hbWVzIjpbInJheV9wbGFuZSIsInB0IiwiVmVjMyIsInJheSIsInBsYW5lIiwiZGVub20iLCJkb3QiLCJkIiwibiIsIk1hdGgiLCJhYnMiLCJOdW1iZXIiLCJFUFNJTE9OIiwibXVsdGlwbHlTY2FsYXIiLCJ0Iiwic3VidHJhY3QiLCJvIiwicmF5X3RyaWFuZ2xlIiwiYWIiLCJhYyIsInB2ZWMiLCJ0dmVjIiwicXZlYyIsInRyaWFuZ2xlIiwiZG91YmxlU2lkZWQiLCJiIiwiYSIsImMiLCJjcm9zcyIsImRldCIsImludl9kZXQiLCJ1IiwidiIsInJheV9zcGhlcmUiLCJlIiwic3BoZXJlIiwiciIsInJhZGl1cyIsImNlbnRlciIsInJTcSIsImVTcSIsImxlbmd0aFNxciIsImFMZW5ndGgiLCJmU3EiLCJmIiwic3FydCIsInJheV9hYWJiIiwibWluIiwibWF4IiwiYWFiYiIsImhhbGZFeHRlbnRzIiwiYWRkIiwicmF5X2FhYmIyIiwiaXgiLCJ4IiwiaXkiLCJ5IiwiaXoiLCJ6IiwidDEiLCJ0MiIsInQzIiwidDQiLCJ0NSIsInQ2IiwidG1pbiIsInRtYXgiLCJyYXlfb2JiIiwiWCIsIlkiLCJaIiwicCIsInNpemUiLCJBcnJheSIsIm9iYiIsInNldCIsIm9yaWVudGF0aW9uIiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTA0IiwibTA1IiwibTA2IiwibTA3IiwibTA4IiwiaSIsInJheV9jYXBzdWxlIiwidjNfMCIsInYzXzEiLCJ2M18yIiwidjNfMyIsInYzXzQiLCJ2M181IiwidjNfNiIsInNwaGVyZV8wIiwiY2Fwc3VsZSIsInJhZGl1c1NxciIsInZSYXlOb3JtIiwibm9ybWFsaXplIiwiQSIsImVsbGlwc2VDZW50ZXIwIiwiQiIsImVsbGlwc2VDZW50ZXIxIiwiQkEiLCJlcXVhbHMiLCJaRVJPIiwiaW50ZXJzZWN0IiwiTyIsIk9BIiwiVnhCQSIsIkJPIiwiT0F4QkEiLCJhYjIiLCJpUG9zIiwic2NhbGVBbmRBZGQiLCJpUG9zTGVuIiwidExpbWl0IiwicmF5X3N1Yk1lc2giLCJ0cmkiLCJjcmVhdGUiLCJkZU9wdCIsImRpc3RhbmNlIiwiSW5maW5pdHkiLCJtb2RlIiwiRVJheWNhc3RNb2RlIiwiQU5ZIiwibWluRGlzIiwiZmlsbFJlc3VsdCIsIm0iLCJpMCIsImkxIiwiaTIiLCJDTE9TRVNUIiwibGVuZ3RoIiwicHVzaCIsInZlcnRleEluZGV4MCIsInZlcnRleEluZGV4MSIsInZlcnRleEluZGV4MiIsIm5hcnJvd3BoYXNlIiwidmIiLCJpYiIsInBtIiwib3B0IiwiR0ZYUHJpbWl0aXZlTW9kZSIsIlRSSUFOR0xFX0xJU1QiLCJjbnQiLCJqIiwiZGlzdCIsInJlc3VsdCIsIlRSSUFOR0xFX1NUUklQIiwicmV2IiwiVFJJQU5HTEVfRkFOIiwic3VibWVzaCIsIm9wdGlvbnMiLCJnZW9tZXRyaWNJbmZvIiwicG9zaXRpb25zIiwidW5kZWZpbmVkIiwiYm91bmRpbmdCb3giLCJwcmltaXRpdmVNb2RlIiwiaW5kaWNlcyIsInJheV9tZXNoIiwibWVzaCIsInJlbmRlcmluZ1N1Yk1lc2hlcyIsInN0cnVjdCIsIm1pblBvc2l0aW9uIiwibWF4UG9zaXRpb24iLCJzbSIsImRpcyIsInN1YkluZGljZXMiLCJyYXlfbW9kZWwiLCJtb2RlbFJheSIsIm00IiwiTWF0NCIsIm1vZGVsIiwid2IiLCJ3b3JsZEJvdW5kcyIsImNvcHkiLCJub2RlIiwiaW52ZXJ0IiwiZ2V0V29ybGRNYXRyaXgiLCJ0cmFuc2Zvcm1NYXQ0IiwidHJhbnNmb3JtTWF0NE5vcm1hbCIsInN1Yk1vZGVscyIsInN1Yk1lc2giLCJsaW5lX3BsYW5lIiwibGluZSIsInMiLCJsaW5lX3RyaWFuZ2xlIiwicXAiLCJhcCIsIm91dFB0IiwidyIsImludkRldCIsInJfdCIsImxpbmVfYWFiYiIsImxlbiIsImxpbmVfb2JiIiwibGluZV9zcGhlcmUiLCJhYWJiX2FhYmIiLCJhTWluIiwiYU1heCIsImJNaW4iLCJiTWF4IiwiYWFiYjEiLCJhYWJiMiIsImdldEFBQkJWZXJ0aWNlcyIsIm91dCIsImdldE9CQlZlcnRpY2VzIiwiYTEiLCJhMiIsImEzIiwiZ2V0SW50ZXJ2YWwiLCJ2ZXJ0aWNlcyIsImF4aXMiLCJwcm9qZWN0aW9uIiwiYWFiYl9vYmIiLCJ0ZXN0IiwidmVydGljZXMyIiwiYWFiYl9wbGFuZSIsImFhYmJfZnJ1c3R1bSIsImZydXN0dW0iLCJwbGFuZXMiLCJhYWJiX2ZydXN0dW1fYWNjdXJhdGUiLCJ0bXAiLCJvdXQxIiwib3V0MiIsImludGVyc2VjdHMiLCJvYmJfcG9pbnQiLCJtMyIsIk1hdDMiLCJsZXNzVGhhbiIsInBvaW50IiwidHJhbnNmb3JtTWF0MyIsInRyYW5zcG9zZSIsIm9iYl9wbGFuZSIsImFic0RvdCIsIm9iYl9mcnVzdHVtIiwib2JiX2ZydXN0dW1fYWNjdXJhdGUiLCJvYmJfb2JiIiwib2JiMSIsIm9iYjIiLCJvYmJfY2Fwc3VsZSIsInYzX3ZlcnRzOCIsInYzX2F4aXM4IiwiaCIsInNxdWFyZWREaXN0YW5jZSIsInNwaGVyZV9vYmIiLCJheGVzIiwiYTAiLCJDIiwiZDAiLCJkMSIsIm1heF9kIiwibWluX2QiLCJkX21pbiIsImRfbWF4Iiwic3BoZXJlX3BsYW5lIiwic3BoZXJlX2ZydXN0dW0iLCJzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZSIsIm1hcCIsInNwaGVyZV9zcGhlcmUiLCJzcGhlcmUwIiwic3BoZXJlMSIsInNwaGVyZV9hYWJiIiwicHRfcG9pbnRfYWFiYiIsInB0X3BvaW50X29iYiIsInNwaGVyZV9jYXBzdWxlIiwic3F1YXJlZFIiLCJjYXBzdWxlX2NhcHN1bGUiLCJjYXBzdWxlQSIsImNhcHN1bGVCIiwiRCIsInNjIiwic04iLCJzRCIsInRjIiwidE4iLCJ0RCIsImRQIiwicmVzb2x2ZSIsImcxIiwiZzIiLCJ0eXBlMSIsIl90eXBlIiwidHlwZTIiLCJyZXNvbHZlciIsImVudW1zIiwiU0hBUEVfUkFZIiwiU0hBUEVfU1BIRVJFIiwiU0hBUEVfQUFCQiIsIlNIQVBFX09CQiIsIlNIQVBFX1BMQU5FIiwiU0hBUEVfVFJJQU5HTEUiLCJTSEFQRV9DQVBTVUxFIiwiU0hBUEVfTElORSIsIlNIQVBFX0ZSVVNUVU0iLCJTSEFQRV9GUlVTVFVNX0FDQ1VSQVRFIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUF1QkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7OztBQVNBLE1BQU1BLFNBQVMsR0FBSSxZQUFZO0FBQzNCLFFBQU1DLEVBQUUsR0FBRyxJQUFJQyxXQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBQVg7QUFFQSxXQUFPLFVBQVVDLEdBQVYsRUFBb0JDLEtBQXBCLEVBQTBDO0FBQzdDLFVBQU1DLEtBQUssR0FBR0gsWUFBS0ksR0FBTCxDQUFTSCxHQUFHLENBQUNJLENBQWIsRUFBZ0JILEtBQUssQ0FBQ0ksQ0FBdEIsQ0FBZDs7QUFDQSxVQUFJQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0wsS0FBVCxJQUFrQk0sTUFBTSxDQUFDQyxPQUE3QixFQUFzQztBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUNuRFYsa0JBQUtXLGNBQUwsQ0FBb0JaLEVBQXBCLEVBQXdCRyxLQUFLLENBQUNJLENBQTlCLEVBQWlDSixLQUFLLENBQUNHLENBQXZDOztBQUNBLFVBQU1PLENBQUMsR0FBR1osWUFBS0ksR0FBTCxDQUFTSixZQUFLYSxRQUFMLENBQWNkLEVBQWQsRUFBa0JBLEVBQWxCLEVBQXNCRSxHQUFHLENBQUNhLENBQTFCLENBQVQsRUFBdUNaLEtBQUssQ0FBQ0ksQ0FBN0MsSUFBa0RILEtBQTVEOztBQUNBLFVBQUlTLENBQUMsR0FBRyxDQUFSLEVBQVc7QUFBRSxlQUFPLENBQVA7QUFBVzs7QUFDeEIsYUFBT0EsQ0FBUDtBQUNILEtBUEQ7QUFRSCxHQVhpQixFQUFsQixDLENBYUE7O0FBQ0E7Ozs7Ozs7Ozs7OztBQVVBLE1BQU1HLFlBQVksR0FBSSxZQUFZO0FBQzlCLFFBQU1DLEVBQUUsR0FBRyxJQUFJaEIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTWlCLEVBQUUsR0FBRyxJQUFJakIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTWtCLElBQUksR0FBRyxJQUFJbEIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFiO0FBQ0EsUUFBTW1CLElBQUksR0FBRyxJQUFJbkIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFiO0FBQ0EsUUFBTW9CLElBQUksR0FBRyxJQUFJcEIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFiO0FBRUEsV0FBTyxVQUFVQyxHQUFWLEVBQW9Cb0IsUUFBcEIsRUFBd0NDLFdBQXhDLEVBQStEO0FBQ2xFdEIsa0JBQUthLFFBQUwsQ0FBY0csRUFBZCxFQUFrQkssUUFBUSxDQUFDRSxDQUEzQixFQUE4QkYsUUFBUSxDQUFDRyxDQUF2Qzs7QUFDQXhCLGtCQUFLYSxRQUFMLENBQWNJLEVBQWQsRUFBa0JJLFFBQVEsQ0FBQ0ksQ0FBM0IsRUFBOEJKLFFBQVEsQ0FBQ0csQ0FBdkM7O0FBRUF4QixrQkFBSzBCLEtBQUwsQ0FBV1IsSUFBWCxFQUFpQmpCLEdBQUcsQ0FBQ0ksQ0FBckIsRUFBd0JZLEVBQXhCOztBQUNBLFVBQU1VLEdBQUcsR0FBRzNCLFlBQUtJLEdBQUwsQ0FBU1ksRUFBVCxFQUFhRSxJQUFiLENBQVo7O0FBQ0EsVUFBSVMsR0FBRyxHQUFHbEIsTUFBTSxDQUFDQyxPQUFiLEtBQXlCLENBQUNZLFdBQUQsSUFBZ0JLLEdBQUcsR0FBRyxDQUFDbEIsTUFBTSxDQUFDQyxPQUF2RCxDQUFKLEVBQXFFO0FBQUUsZUFBTyxDQUFQO0FBQVc7O0FBRWxGLFVBQU1rQixPQUFPLEdBQUcsSUFBSUQsR0FBcEI7O0FBRUEzQixrQkFBS2EsUUFBTCxDQUFjTSxJQUFkLEVBQW9CbEIsR0FBRyxDQUFDYSxDQUF4QixFQUEyQk8sUUFBUSxDQUFDRyxDQUFwQzs7QUFDQSxVQUFNSyxDQUFDLEdBQUc3QixZQUFLSSxHQUFMLENBQVNlLElBQVQsRUFBZUQsSUFBZixJQUF1QlUsT0FBakM7O0FBQ0EsVUFBSUMsQ0FBQyxHQUFHLENBQUosSUFBU0EsQ0FBQyxHQUFHLENBQWpCLEVBQW9CO0FBQUUsZUFBTyxDQUFQO0FBQVc7O0FBRWpDN0Isa0JBQUswQixLQUFMLENBQVdOLElBQVgsRUFBaUJELElBQWpCLEVBQXVCSCxFQUF2Qjs7QUFDQSxVQUFNYyxDQUFDLEdBQUc5QixZQUFLSSxHQUFMLENBQVNILEdBQUcsQ0FBQ0ksQ0FBYixFQUFnQmUsSUFBaEIsSUFBd0JRLE9BQWxDOztBQUNBLFVBQUlFLENBQUMsR0FBRyxDQUFKLElBQVNELENBQUMsR0FBR0MsQ0FBSixHQUFRLENBQXJCLEVBQXdCO0FBQUUsZUFBTyxDQUFQO0FBQVc7O0FBRXJDLFVBQU1sQixDQUFDLEdBQUdaLFlBQUtJLEdBQUwsQ0FBU2EsRUFBVCxFQUFhRyxJQUFiLElBQXFCUSxPQUEvQjtBQUNBLGFBQU9oQixDQUFDLEdBQUcsQ0FBSixHQUFRLENBQVIsR0FBWUEsQ0FBbkI7QUFDSCxLQXBCRDtBQXFCSCxHQTVCb0IsRUFBckI7QUE4QkE7Ozs7Ozs7Ozs7O0FBU0EsTUFBTW1CLFVBQVUsR0FBSSxZQUFZO0FBQzVCLFFBQU1DLENBQUMsR0FBRyxJQUFJaEMsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFWO0FBQ0EsV0FBTyxVQUFVQyxHQUFWLEVBQW9CZ0MsTUFBcEIsRUFBNEM7QUFDL0MsVUFBTUMsQ0FBQyxHQUFHRCxNQUFNLENBQUNFLE1BQWpCO0FBQ0EsVUFBTVYsQ0FBQyxHQUFHUSxNQUFNLENBQUNHLE1BQWpCO0FBQ0EsVUFBTXRCLENBQUMsR0FBR2IsR0FBRyxDQUFDYSxDQUFkO0FBQ0EsVUFBTVQsQ0FBQyxHQUFHSixHQUFHLENBQUNJLENBQWQ7QUFDQSxVQUFNZ0MsR0FBRyxHQUFHSCxDQUFDLEdBQUdBLENBQWhCOztBQUNBbEMsa0JBQUthLFFBQUwsQ0FBY21CLENBQWQsRUFBaUJQLENBQWpCLEVBQW9CWCxDQUFwQjs7QUFDQSxVQUFNd0IsR0FBRyxHQUFHTixDQUFDLENBQUNPLFNBQUYsRUFBWjs7QUFFQSxVQUFNQyxPQUFPLEdBQUd4QyxZQUFLSSxHQUFMLENBQVM0QixDQUFULEVBQVkzQixDQUFaLENBQWhCLENBVCtDLENBU2Y7OztBQUNoQyxVQUFNb0MsR0FBRyxHQUFHSixHQUFHLElBQUlDLEdBQUcsR0FBR0UsT0FBTyxHQUFHQSxPQUFwQixDQUFmOztBQUNBLFVBQUlDLEdBQUcsR0FBRyxDQUFWLEVBQWE7QUFBRSxlQUFPLENBQVA7QUFBVzs7QUFFMUIsVUFBTUMsQ0FBQyxHQUFHbkMsSUFBSSxDQUFDb0MsSUFBTCxDQUFVRixHQUFWLENBQVY7QUFDQSxVQUFNN0IsQ0FBQyxHQUFHMEIsR0FBRyxHQUFHRCxHQUFOLEdBQVlHLE9BQU8sR0FBR0UsQ0FBdEIsR0FBMEJGLE9BQU8sR0FBR0UsQ0FBOUM7O0FBQ0EsVUFBSTlCLENBQUMsR0FBRyxDQUFSLEVBQVc7QUFBRSxlQUFPLENBQVA7QUFBVzs7QUFDeEIsYUFBT0EsQ0FBUDtBQUNILEtBakJEO0FBa0JILEdBcEJrQixFQUFuQjtBQXNCQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNZ0MsUUFBUSxHQUFJLFlBQVk7QUFDMUIsUUFBTUMsR0FBRyxHQUFHLElBQUk3QyxXQUFKLEVBQVo7QUFDQSxRQUFNOEMsR0FBRyxHQUFHLElBQUk5QyxXQUFKLEVBQVo7QUFDQSxXQUFPLFVBQVVDLEdBQVYsRUFBb0I4QyxJQUFwQixFQUF3QztBQUMzQy9DLGtCQUFLYSxRQUFMLENBQWNnQyxHQUFkLEVBQW1CRSxJQUFJLENBQUNYLE1BQXhCLEVBQWdDVyxJQUFJLENBQUNDLFdBQXJDOztBQUNBaEQsa0JBQUtpRCxHQUFMLENBQVNILEdBQVQsRUFBY0MsSUFBSSxDQUFDWCxNQUFuQixFQUEyQlcsSUFBSSxDQUFDQyxXQUFoQzs7QUFDQSxhQUFPRSxTQUFTLENBQUNqRCxHQUFELEVBQU00QyxHQUFOLEVBQVdDLEdBQVgsQ0FBaEI7QUFDSCxLQUpEO0FBS0gsR0FSZ0IsRUFBakI7O0FBVUEsV0FBU0ksU0FBVCxDQUFvQmpELEdBQXBCLEVBQThCNEMsR0FBOUIsRUFBOENDLEdBQTlDLEVBQThEO0FBQzFELFFBQU1oQyxDQUFDLEdBQUdiLEdBQUcsQ0FBQ2EsQ0FBZDtBQUFBLFFBQWlCVCxDQUFDLEdBQUdKLEdBQUcsQ0FBQ0ksQ0FBekI7QUFDQSxRQUFNOEMsRUFBRSxHQUFHLElBQUk5QyxDQUFDLENBQUMrQyxDQUFqQjtBQUFBLFFBQW9CQyxFQUFFLEdBQUcsSUFBSWhELENBQUMsQ0FBQ2lELENBQS9CO0FBQUEsUUFBa0NDLEVBQUUsR0FBRyxJQUFJbEQsQ0FBQyxDQUFDbUQsQ0FBN0M7QUFDQSxRQUFNQyxFQUFFLEdBQUcsQ0FBQ1osR0FBRyxDQUFDTyxDQUFKLEdBQVF0QyxDQUFDLENBQUNzQyxDQUFYLElBQWdCRCxFQUEzQjtBQUNBLFFBQU1PLEVBQUUsR0FBRyxDQUFDWixHQUFHLENBQUNNLENBQUosR0FBUXRDLENBQUMsQ0FBQ3NDLENBQVgsSUFBZ0JELEVBQTNCO0FBQ0EsUUFBTVEsRUFBRSxHQUFHLENBQUNkLEdBQUcsQ0FBQ1MsQ0FBSixHQUFReEMsQ0FBQyxDQUFDd0MsQ0FBWCxJQUFnQkQsRUFBM0I7QUFDQSxRQUFNTyxFQUFFLEdBQUcsQ0FBQ2QsR0FBRyxDQUFDUSxDQUFKLEdBQVF4QyxDQUFDLENBQUN3QyxDQUFYLElBQWdCRCxFQUEzQjtBQUNBLFFBQU1RLEVBQUUsR0FBRyxDQUFDaEIsR0FBRyxDQUFDVyxDQUFKLEdBQVExQyxDQUFDLENBQUMwQyxDQUFYLElBQWdCRCxFQUEzQjtBQUNBLFFBQU1PLEVBQUUsR0FBRyxDQUFDaEIsR0FBRyxDQUFDVSxDQUFKLEdBQVExQyxDQUFDLENBQUMwQyxDQUFYLElBQWdCRCxFQUEzQjtBQUNBLFFBQU1RLElBQUksR0FBR3hELElBQUksQ0FBQ3VDLEdBQUwsQ0FBU3ZDLElBQUksQ0FBQ3VDLEdBQUwsQ0FBU3ZDLElBQUksQ0FBQ3NDLEdBQUwsQ0FBU1ksRUFBVCxFQUFhQyxFQUFiLENBQVQsRUFBMkJuRCxJQUFJLENBQUNzQyxHQUFMLENBQVNjLEVBQVQsRUFBYUMsRUFBYixDQUEzQixDQUFULEVBQXVEckQsSUFBSSxDQUFDc0MsR0FBTCxDQUFTZ0IsRUFBVCxFQUFhQyxFQUFiLENBQXZELENBQWI7QUFDQSxRQUFNRSxJQUFJLEdBQUd6RCxJQUFJLENBQUNzQyxHQUFMLENBQVN0QyxJQUFJLENBQUNzQyxHQUFMLENBQVN0QyxJQUFJLENBQUN1QyxHQUFMLENBQVNXLEVBQVQsRUFBYUMsRUFBYixDQUFULEVBQTJCbkQsSUFBSSxDQUFDdUMsR0FBTCxDQUFTYSxFQUFULEVBQWFDLEVBQWIsQ0FBM0IsQ0FBVCxFQUF1RHJELElBQUksQ0FBQ3VDLEdBQUwsQ0FBU2UsRUFBVCxFQUFhQyxFQUFiLENBQXZELENBQWI7O0FBQ0EsUUFBSUUsSUFBSSxHQUFHLENBQVAsSUFBWUQsSUFBSSxHQUFHQyxJQUF2QixFQUE2QjtBQUFFLGFBQU8sQ0FBUDtBQUFXOztBQUMxQyxXQUFPRCxJQUFJLEdBQUcsQ0FBUCxHQUFXQSxJQUFYLEdBQWtCQyxJQUF6QixDQVowRCxDQVkzQjtBQUNsQztBQUVEOzs7Ozs7Ozs7OztBQVNBLE1BQU1DLE9BQU8sR0FBSSxZQUFZO0FBQ3pCLFFBQUk3QixNQUFNLEdBQUcsSUFBSXBDLFdBQUosRUFBYjtBQUNBLFFBQUljLENBQUMsR0FBRyxJQUFJZCxXQUFKLEVBQVI7QUFDQSxRQUFJSyxDQUFDLEdBQUcsSUFBSUwsV0FBSixFQUFSO0FBQ0EsUUFBTWtFLENBQUMsR0FBRyxJQUFJbEUsV0FBSixFQUFWO0FBQ0EsUUFBTW1FLENBQUMsR0FBRyxJQUFJbkUsV0FBSixFQUFWO0FBQ0EsUUFBTW9FLENBQUMsR0FBRyxJQUFJcEUsV0FBSixFQUFWO0FBQ0EsUUFBTXFFLENBQUMsR0FBRyxJQUFJckUsV0FBSixFQUFWO0FBQ0EsUUFBTXNFLElBQUksR0FBRyxJQUFJQyxLQUFKLENBQVUsQ0FBVixDQUFiO0FBQ0EsUUFBTTdCLENBQUMsR0FBRyxJQUFJNkIsS0FBSixDQUFVLENBQVYsQ0FBVjtBQUNBLFFBQU12QyxDQUFDLEdBQUcsSUFBSXVDLEtBQUosQ0FBVSxDQUFWLENBQVY7QUFDQSxRQUFNM0QsQ0FBQyxHQUFHLElBQUkyRCxLQUFKLENBQVUsQ0FBVixDQUFWO0FBRUEsV0FBTyxVQUFVdEUsR0FBVixFQUFvQnVFLEdBQXBCLEVBQXNDO0FBQ3pDRixNQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVFLEdBQUcsQ0FBQ3hCLFdBQUosQ0FBZ0JJLENBQTFCO0FBQ0FrQixNQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVFLEdBQUcsQ0FBQ3hCLFdBQUosQ0FBZ0JNLENBQTFCO0FBQ0FnQixNQUFBQSxJQUFJLENBQUMsQ0FBRCxDQUFKLEdBQVVFLEdBQUcsQ0FBQ3hCLFdBQUosQ0FBZ0JRLENBQTFCO0FBQ0FwQixNQUFBQSxNQUFNLEdBQUdvQyxHQUFHLENBQUNwQyxNQUFiO0FBQ0F0QixNQUFBQSxDQUFDLEdBQUdiLEdBQUcsQ0FBQ2EsQ0FBUjtBQUNBVCxNQUFBQSxDQUFDLEdBQUdKLEdBQUcsQ0FBQ0ksQ0FBUjs7QUFFQUwsa0JBQUt5RSxHQUFMLENBQVNQLENBQVQsRUFBWU0sR0FBRyxDQUFDRSxXQUFKLENBQWdCQyxHQUE1QixFQUFpQ0gsR0FBRyxDQUFDRSxXQUFKLENBQWdCRSxHQUFqRCxFQUFzREosR0FBRyxDQUFDRSxXQUFKLENBQWdCRyxHQUF0RTs7QUFDQTdFLGtCQUFLeUUsR0FBTCxDQUFTTixDQUFULEVBQVlLLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkksR0FBNUIsRUFBaUNOLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkssR0FBakQsRUFBc0RQLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQk0sR0FBdEU7O0FBQ0FoRixrQkFBS3lFLEdBQUwsQ0FBU0wsQ0FBVCxFQUFZSSxHQUFHLENBQUNFLFdBQUosQ0FBZ0JPLEdBQTVCLEVBQWlDVCxHQUFHLENBQUNFLFdBQUosQ0FBZ0JRLEdBQWpELEVBQXNEVixHQUFHLENBQUNFLFdBQUosQ0FBZ0JTLEdBQXRFOztBQUNBbkYsa0JBQUthLFFBQUwsQ0FBY3dELENBQWQsRUFBaUJqQyxNQUFqQixFQUF5QnRCLENBQXpCLEVBWHlDLENBYXpDOzs7QUFDQTRCLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTzFDLFlBQUtJLEdBQUwsQ0FBUzhELENBQVQsRUFBWTdELENBQVosQ0FBUDtBQUNBcUMsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPMUMsWUFBS0ksR0FBTCxDQUFTK0QsQ0FBVCxFQUFZOUQsQ0FBWixDQUFQO0FBQ0FxQyxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8xQyxZQUFLSSxHQUFMLENBQVNnRSxDQUFULEVBQVkvRCxDQUFaLENBQVAsQ0FoQnlDLENBa0J6Qzs7QUFDQTJCLE1BQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT2hDLFlBQUtJLEdBQUwsQ0FBUzhELENBQVQsRUFBWUcsQ0FBWixDQUFQO0FBQ0FyQyxNQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9oQyxZQUFLSSxHQUFMLENBQVMrRCxDQUFULEVBQVlFLENBQVosQ0FBUDtBQUNBckMsTUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPaEMsWUFBS0ksR0FBTCxDQUFTZ0UsQ0FBVCxFQUFZQyxDQUFaLENBQVA7O0FBRUEsV0FBSyxJQUFJZSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLENBQXBCLEVBQXVCLEVBQUVBLENBQXpCLEVBQTRCO0FBQ3hCLFlBQUkxQyxDQUFDLENBQUMwQyxDQUFELENBQUQsS0FBUyxDQUFiLEVBQWdCO0FBQ1osY0FBSSxDQUFDcEQsQ0FBQyxDQUFDb0QsQ0FBRCxDQUFGLEdBQVFkLElBQUksQ0FBQ2MsQ0FBRCxDQUFaLEdBQWtCLENBQWxCLElBQXVCLENBQUNwRCxDQUFDLENBQUNvRCxDQUFELENBQUYsR0FBUWQsSUFBSSxDQUFDYyxDQUFELENBQVosR0FBa0IsQ0FBN0MsRUFBZ0Q7QUFDNUMsbUJBQU8sQ0FBUDtBQUNILFdBSFcsQ0FJWjs7O0FBQ0ExQyxVQUFBQSxDQUFDLENBQUMwQyxDQUFELENBQUQsR0FBTyxTQUFQO0FBQ0gsU0FQdUIsQ0FReEI7OztBQUNBeEUsUUFBQUEsQ0FBQyxDQUFDd0UsQ0FBQyxHQUFHLENBQUosR0FBUSxDQUFULENBQUQsR0FBZSxDQUFDcEQsQ0FBQyxDQUFDb0QsQ0FBRCxDQUFELEdBQU9kLElBQUksQ0FBQ2MsQ0FBRCxDQUFaLElBQW1CMUMsQ0FBQyxDQUFDMEMsQ0FBRCxDQUFuQyxDQVR3QixDQVV4Qjs7QUFDQXhFLFFBQUFBLENBQUMsQ0FBQ3dFLENBQUMsR0FBRyxDQUFKLEdBQVEsQ0FBVCxDQUFELEdBQWUsQ0FBQ3BELENBQUMsQ0FBQ29ELENBQUQsQ0FBRCxHQUFPZCxJQUFJLENBQUNjLENBQUQsQ0FBWixJQUFtQjFDLENBQUMsQ0FBQzBDLENBQUQsQ0FBbkM7QUFDSDs7QUFDRCxVQUFNckIsSUFBSSxHQUFHeEQsSUFBSSxDQUFDdUMsR0FBTCxDQUNUdkMsSUFBSSxDQUFDdUMsR0FBTCxDQUNJdkMsSUFBSSxDQUFDc0MsR0FBTCxDQUFTakMsQ0FBQyxDQUFDLENBQUQsQ0FBVixFQUFlQSxDQUFDLENBQUMsQ0FBRCxDQUFoQixDQURKLEVBRUlMLElBQUksQ0FBQ3NDLEdBQUwsQ0FBU2pDLENBQUMsQ0FBQyxDQUFELENBQVYsRUFBZUEsQ0FBQyxDQUFDLENBQUQsQ0FBaEIsQ0FGSixDQURTLEVBSVRMLElBQUksQ0FBQ3NDLEdBQUwsQ0FBU2pDLENBQUMsQ0FBQyxDQUFELENBQVYsRUFBZUEsQ0FBQyxDQUFDLENBQUQsQ0FBaEIsQ0FKUyxDQUFiO0FBTUEsVUFBTW9ELElBQUksR0FBR3pELElBQUksQ0FBQ3NDLEdBQUwsQ0FDVHRDLElBQUksQ0FBQ3NDLEdBQUwsQ0FDSXRDLElBQUksQ0FBQ3VDLEdBQUwsQ0FBU2xDLENBQUMsQ0FBQyxDQUFELENBQVYsRUFBZUEsQ0FBQyxDQUFDLENBQUQsQ0FBaEIsQ0FESixFQUVJTCxJQUFJLENBQUN1QyxHQUFMLENBQVNsQyxDQUFDLENBQUMsQ0FBRCxDQUFWLEVBQWVBLENBQUMsQ0FBQyxDQUFELENBQWhCLENBRkosQ0FEUyxFQUlUTCxJQUFJLENBQUN1QyxHQUFMLENBQVNsQyxDQUFDLENBQUMsQ0FBRCxDQUFWLEVBQWVBLENBQUMsQ0FBQyxDQUFELENBQWhCLENBSlMsQ0FBYjs7QUFNQSxVQUFJb0QsSUFBSSxHQUFHLENBQVAsSUFBWUQsSUFBSSxHQUFHQyxJQUF2QixFQUE2QjtBQUN6QixlQUFPLENBQVA7QUFDSDs7QUFFRCxhQUFPRCxJQUFJLEdBQUcsQ0FBUCxHQUFXQSxJQUFYLEdBQWtCQyxJQUF6QixDQXBEeUMsQ0FvRFY7QUFDbEMsS0FyREQ7QUFzREgsR0FuRWUsRUFBaEI7QUFxRUE7Ozs7Ozs7Ozs7O0FBU0EsTUFBTXFCLFdBQVcsR0FBSSxZQUFZO0FBQzdCLFFBQU1DLElBQUksR0FBRyxJQUFJdEYsV0FBSixFQUFiO0FBQ0EsUUFBTXVGLElBQUksR0FBRyxJQUFJdkYsV0FBSixFQUFiO0FBQ0EsUUFBTXdGLElBQUksR0FBRyxJQUFJeEYsV0FBSixFQUFiO0FBQ0EsUUFBTXlGLElBQUksR0FBRyxJQUFJekYsV0FBSixFQUFiO0FBQ0EsUUFBTTBGLElBQUksR0FBRyxJQUFJMUYsV0FBSixFQUFiO0FBQ0EsUUFBTTJGLElBQUksR0FBRyxJQUFJM0YsV0FBSixFQUFiO0FBQ0EsUUFBTTRGLElBQUksR0FBRyxJQUFJNUYsV0FBSixFQUFiO0FBQ0EsUUFBTTZGLFFBQVEsR0FBRyxJQUFJNUQsZUFBSixFQUFqQjtBQUNBLFdBQU8sVUFBVWhDLEdBQVYsRUFBb0I2RixPQUFwQixFQUFzQztBQUN6QyxVQUFNQyxTQUFTLEdBQUdELE9BQU8sQ0FBQzNELE1BQVIsR0FBaUIyRCxPQUFPLENBQUMzRCxNQUEzQzs7QUFDQSxVQUFNNkQsUUFBUSxHQUFHaEcsWUFBS2lHLFNBQUwsQ0FBZVgsSUFBZixFQUFxQnJGLEdBQUcsQ0FBQ0ksQ0FBekIsQ0FBakI7O0FBQ0EsVUFBTTZGLENBQUMsR0FBR0osT0FBTyxDQUFDSyxjQUFsQjtBQUNBLFVBQU1DLENBQUMsR0FBR04sT0FBTyxDQUFDTyxjQUFsQjs7QUFDQSxVQUFNQyxFQUFFLEdBQUd0RyxZQUFLYSxRQUFMLENBQWMwRSxJQUFkLEVBQW9CYSxDQUFwQixFQUF1QkYsQ0FBdkIsQ0FBWDs7QUFDQSxVQUFJSSxFQUFFLENBQUNDLE1BQUgsQ0FBVXZHLFlBQUt3RyxJQUFmLENBQUosRUFBMEI7QUFDdEJYLFFBQUFBLFFBQVEsQ0FBQzFELE1BQVQsR0FBa0IyRCxPQUFPLENBQUMzRCxNQUExQjtBQUNBMEQsUUFBQUEsUUFBUSxDQUFDekQsTUFBVCxDQUFnQnFDLEdBQWhCLENBQW9CcUIsT0FBTyxDQUFDSyxjQUE1QjtBQUNBLGVBQU9NLFNBQVMsQ0FBQzFFLFVBQVYsQ0FBcUI5QixHQUFyQixFQUEwQjRGLFFBQTFCLENBQVA7QUFDSDs7QUFFRCxVQUFNYSxDQUFDLEdBQUd6RyxHQUFHLENBQUNhLENBQWQ7O0FBQ0EsVUFBTTZGLEVBQUUsR0FBRzNHLFlBQUthLFFBQUwsQ0FBYzJFLElBQWQsRUFBb0JrQixDQUFwQixFQUF1QlIsQ0FBdkIsQ0FBWDs7QUFDQSxVQUFNVSxJQUFJLEdBQUc1RyxZQUFLMEIsS0FBTCxDQUFXK0QsSUFBWCxFQUFpQk8sUUFBakIsRUFBMkJNLEVBQTNCLENBQWI7O0FBQ0EsVUFBTTlFLENBQUMsR0FBR29GLElBQUksQ0FBQ3JFLFNBQUwsRUFBVjs7QUFDQSxVQUFJZixDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1RxRSxRQUFBQSxRQUFRLENBQUMxRCxNQUFULEdBQWtCMkQsT0FBTyxDQUFDM0QsTUFBMUI7O0FBQ0EsWUFBTTBFLEVBQUUsR0FBRzdHLFlBQUthLFFBQUwsQ0FBYzZFLElBQWQsRUFBb0JVLENBQXBCLEVBQXVCTSxDQUF2QixDQUFYOztBQUNBLFlBQUlDLEVBQUUsQ0FBQ3BFLFNBQUgsS0FBaUJzRSxFQUFFLENBQUN0RSxTQUFILEVBQXJCLEVBQXFDO0FBQ2pDc0QsVUFBQUEsUUFBUSxDQUFDekQsTUFBVCxDQUFnQnFDLEdBQWhCLENBQW9CcUIsT0FBTyxDQUFDSyxjQUE1QjtBQUNILFNBRkQsTUFFTztBQUNITixVQUFBQSxRQUFRLENBQUN6RCxNQUFULENBQWdCcUMsR0FBaEIsQ0FBb0JxQixPQUFPLENBQUNPLGNBQTVCO0FBQ0g7O0FBQ0QsZUFBT0ksU0FBUyxDQUFDMUUsVUFBVixDQUFxQjlCLEdBQXJCLEVBQTBCNEYsUUFBMUIsQ0FBUDtBQUNIOztBQUVELFVBQU1pQixLQUFLLEdBQUc5RyxZQUFLMEIsS0FBTCxDQUFXZ0UsSUFBWCxFQUFpQmlCLEVBQWpCLEVBQXFCTCxFQUFyQixDQUFkOztBQUNBLFVBQU1TLEdBQUcsR0FBR1QsRUFBRSxDQUFDL0QsU0FBSCxFQUFaOztBQUNBLFVBQU1oQixDQUFDLEdBQUcsSUFBSXZCLFlBQUtJLEdBQUwsQ0FBU3dHLElBQVQsRUFBZUUsS0FBZixDQUFkOztBQUNBLFVBQU1yRixDQUFDLEdBQUdxRixLQUFLLENBQUN2RSxTQUFOLEtBQXFCd0QsU0FBUyxHQUFHZ0IsR0FBM0M7QUFDQSxVQUFNMUcsQ0FBQyxHQUFHa0IsQ0FBQyxHQUFHQSxDQUFKLEdBQVEsSUFBSUMsQ0FBSixHQUFRQyxDQUExQjs7QUFFQSxVQUFJcEIsQ0FBQyxHQUFHLENBQVIsRUFBVztBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUV4QixVQUFNTyxDQUFDLEdBQUcsQ0FBQyxDQUFDVyxDQUFELEdBQUtoQixJQUFJLENBQUNvQyxJQUFMLENBQVV0QyxDQUFWLENBQU4sS0FBdUIsSUFBSW1CLENBQTNCLENBQVY7O0FBQ0EsVUFBSVosQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQaUYsUUFBQUEsUUFBUSxDQUFDMUQsTUFBVCxHQUFrQjJELE9BQU8sQ0FBQzNELE1BQTFCOztBQUNBLFlBQU0wRSxHQUFFLEdBQUc3RyxZQUFLYSxRQUFMLENBQWM4RSxJQUFkLEVBQW9CUyxDQUFwQixFQUF1Qk0sQ0FBdkIsQ0FBWDs7QUFDQSxZQUFJQyxFQUFFLENBQUNwRSxTQUFILEtBQWlCc0UsR0FBRSxDQUFDdEUsU0FBSCxFQUFyQixFQUFxQztBQUNqQ3NELFVBQUFBLFFBQVEsQ0FBQ3pELE1BQVQsQ0FBZ0JxQyxHQUFoQixDQUFvQnFCLE9BQU8sQ0FBQ0ssY0FBNUI7QUFDSCxTQUZELE1BRU87QUFDSE4sVUFBQUEsUUFBUSxDQUFDekQsTUFBVCxDQUFnQnFDLEdBQWhCLENBQW9CcUIsT0FBTyxDQUFDTyxjQUE1QjtBQUNIOztBQUNELGVBQU9JLFNBQVMsQ0FBQzFFLFVBQVYsQ0FBcUI5QixHQUFyQixFQUEwQjRGLFFBQTFCLENBQVA7QUFDSCxPQVRELE1BU087QUFDSDtBQUNBLFlBQU1tQixJQUFJLEdBQUdoSCxZQUFLaUgsV0FBTCxDQUFpQnRCLElBQWpCLEVBQXVCMUYsR0FBRyxDQUFDYSxDQUEzQixFQUE4QmtGLFFBQTlCLEVBQXdDcEYsQ0FBeEMsQ0FBYjs7QUFDQSxZQUFNc0csT0FBTyxHQUFHbEgsWUFBS2EsUUFBTCxDQUFjK0UsSUFBZCxFQUFvQm9CLElBQXBCLEVBQTBCZCxDQUExQixDQUFoQjs7QUFDQSxZQUFNaUIsTUFBTSxHQUFHbkgsWUFBS0ksR0FBTCxDQUFTOEcsT0FBVCxFQUFrQlosRUFBbEIsSUFBd0JTLEdBQXZDOztBQUVBLFlBQUlJLE1BQU0sSUFBSSxDQUFWLElBQWVBLE1BQU0sSUFBSSxDQUE3QixFQUFnQztBQUM1QixpQkFBT3ZHLENBQVA7QUFDSCxTQUZELE1BRU8sSUFBSXVHLE1BQU0sR0FBRyxDQUFiLEVBQWdCO0FBQ25CdEIsVUFBQUEsUUFBUSxDQUFDMUQsTUFBVCxHQUFrQjJELE9BQU8sQ0FBQzNELE1BQTFCO0FBQ0EwRCxVQUFBQSxRQUFRLENBQUN6RCxNQUFULENBQWdCcUMsR0FBaEIsQ0FBb0JxQixPQUFPLENBQUNLLGNBQTVCO0FBQ0EsaUJBQU9NLFNBQVMsQ0FBQzFFLFVBQVYsQ0FBcUI5QixHQUFyQixFQUEwQjRGLFFBQTFCLENBQVA7QUFDSCxTQUpNLE1BSUEsSUFBSXNCLE1BQU0sR0FBRyxDQUFiLEVBQWdCO0FBQ25CdEIsVUFBQUEsUUFBUSxDQUFDMUQsTUFBVCxHQUFrQjJELE9BQU8sQ0FBQzNELE1BQTFCO0FBQ0EwRCxVQUFBQSxRQUFRLENBQUN6RCxNQUFULENBQWdCcUMsR0FBaEIsQ0FBb0JxQixPQUFPLENBQUNPLGNBQTVCO0FBQ0EsaUJBQU9JLFNBQVMsQ0FBQzFFLFVBQVYsQ0FBcUI5QixHQUFyQixFQUEwQjRGLFFBQTFCLENBQVA7QUFDSCxTQUpNLE1BSUE7QUFDSCxpQkFBTyxDQUFQO0FBQ0g7QUFDSjtBQUVKLEtBbEVEO0FBbUVILEdBNUVtQixFQUFwQjtBQThFQTs7Ozs7Ozs7Ozs7O0FBVUEsTUFBTXVCLFdBQVcsR0FBSSxZQUFZO0FBQzdCLFFBQU1DLEdBQUcsR0FBR2hHLGtCQUFTaUcsTUFBVCxFQUFaOztBQUNBLFFBQU1DLEtBQXlCLEdBQUc7QUFBRUMsTUFBQUEsUUFBUSxFQUFFQyxRQUFaO0FBQXNCbkcsTUFBQUEsV0FBVyxFQUFFLEtBQW5DO0FBQTBDb0csTUFBQUEsSUFBSSxFQUFFQyxtQkFBYUM7QUFBN0QsS0FBbEM7QUFDQSxRQUFJQyxNQUFNLEdBQUcsQ0FBYjs7QUFFQSxRQUFNQyxVQUFVLEdBQUcsU0FBYkEsVUFBYSxDQUFDQyxDQUFELEVBQWtCMUgsQ0FBbEIsRUFBNkIySCxFQUE3QixFQUF5Q0MsRUFBekMsRUFBcURDLEVBQXJELEVBQWlFaEcsQ0FBakUsRUFBNkY7QUFDNUcsVUFBSTZGLENBQUMsS0FBS0osbUJBQWFRLE9BQXZCLEVBQWdDO0FBQzVCLFlBQUlOLE1BQU0sR0FBR3hILENBQVQsSUFBY3dILE1BQU0sS0FBSyxDQUE3QixFQUFnQztBQUM1QkEsVUFBQUEsTUFBTSxHQUFHeEgsQ0FBVDs7QUFDQSxjQUFJNkIsQ0FBSixFQUFPO0FBQ0gsZ0JBQUlBLENBQUMsQ0FBQ2tHLE1BQUYsS0FBYSxDQUFqQixFQUFvQjtBQUNoQmxHLGNBQUFBLENBQUMsQ0FBQ21HLElBQUYsQ0FBTztBQUFFYixnQkFBQUEsUUFBUSxFQUFFbkgsQ0FBWjtBQUFlaUksZ0JBQUFBLFlBQVksRUFBRU4sRUFBRSxHQUFHLENBQWxDO0FBQXFDTyxnQkFBQUEsWUFBWSxFQUFFTixFQUFFLEdBQUcsQ0FBeEQ7QUFBMkRPLGdCQUFBQSxZQUFZLEVBQUVOLEVBQUUsR0FBRztBQUE5RSxlQUFQO0FBQ0gsYUFGRCxNQUVPO0FBQ0hoRyxjQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtzRixRQUFMLEdBQWdCbkgsQ0FBaEI7QUFBbUI2QixjQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtvRyxZQUFMLEdBQW9CTixFQUFFLEdBQUcsQ0FBekI7QUFBNEI5RixjQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtxRyxZQUFMLEdBQW9CTixFQUFFLEdBQUcsQ0FBekI7QUFBNEIvRixjQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELENBQUtzRyxZQUFMLEdBQW9CTixFQUFFLEdBQUcsQ0FBekI7QUFDOUU7QUFDSjtBQUNKO0FBQ0osT0FYRCxNQVdPO0FBQ0hMLFFBQUFBLE1BQU0sR0FBR3hILENBQVQ7QUFDQSxZQUFJNkIsQ0FBSixFQUFPQSxDQUFDLENBQUNtRyxJQUFGLENBQU87QUFBRWIsVUFBQUEsUUFBUSxFQUFFbkgsQ0FBWjtBQUFlaUksVUFBQUEsWUFBWSxFQUFFTixFQUFFLEdBQUcsQ0FBbEM7QUFBcUNPLFVBQUFBLFlBQVksRUFBRU4sRUFBRSxHQUFHLENBQXhEO0FBQTJETyxVQUFBQSxZQUFZLEVBQUVOLEVBQUUsR0FBRztBQUE5RSxTQUFQO0FBQ1Y7QUFDSixLQWhCRDs7QUFrQkEsUUFBTU8sV0FBVyxHQUFHLFNBQWRBLFdBQWMsQ0FBQ0MsRUFBRCxFQUFtQkMsRUFBbkIsRUFBZ0NDLEVBQWhDLEVBQXNEM0ksR0FBdEQsRUFBZ0U0SSxHQUFoRSxFQUE0RjtBQUM1RyxVQUFJRCxFQUFFLEtBQUtFLHlCQUFpQkMsYUFBNUIsRUFBMkM7QUFDdkMsWUFBTUMsR0FBRyxHQUFHTCxFQUFFLENBQUNQLE1BQWY7O0FBQ0EsYUFBSyxJQUFJYSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRCxHQUFwQixFQUF5QkMsQ0FBQyxJQUFJLENBQTlCLEVBQWlDO0FBQzdCLGNBQU1qQixFQUFFLEdBQUdXLEVBQUUsQ0FBQ00sQ0FBRCxDQUFGLEdBQVEsQ0FBbkI7QUFDQSxjQUFNaEIsRUFBRSxHQUFHVSxFQUFFLENBQUNNLENBQUMsR0FBRyxDQUFMLENBQUYsR0FBWSxDQUF2QjtBQUNBLGNBQU1mLEVBQUUsR0FBR1MsRUFBRSxDQUFDTSxDQUFDLEdBQUcsQ0FBTCxDQUFGLEdBQVksQ0FBdkI7O0FBQ0FqSixzQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzdGLENBQWIsRUFBZ0JrSCxFQUFFLENBQUNWLEVBQUQsQ0FBbEIsRUFBd0JVLEVBQUUsQ0FBQ1YsRUFBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NVLEVBQUUsQ0FBQ1YsRUFBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0FoSSxzQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzlGLENBQWIsRUFBZ0JtSCxFQUFFLENBQUNULEVBQUQsQ0FBbEIsRUFBd0JTLEVBQUUsQ0FBQ1QsRUFBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NTLEVBQUUsQ0FBQ1QsRUFBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0FqSSxzQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzVGLENBQWIsRUFBZ0JpSCxFQUFFLENBQUNSLEVBQUQsQ0FBbEIsRUFBd0JRLEVBQUUsQ0FBQ1IsRUFBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NRLEVBQUUsQ0FBQ1IsRUFBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0EsY0FBTWdCLElBQUksR0FBR3pDLFNBQVMsQ0FBQzFGLFlBQVYsQ0FBdUJkLEdBQXZCLEVBQTRCb0gsR0FBNUIsRUFBaUN3QixHQUFHLENBQUN2SCxXQUFyQyxDQUFiO0FBQ0EsY0FBSTRILElBQUksS0FBSyxDQUFULElBQWNBLElBQUksR0FBR0wsR0FBRyxDQUFDckIsUUFBN0IsRUFBdUM7QUFDdkNNLFVBQUFBLFVBQVUsQ0FBQ2UsR0FBRyxDQUFDbkIsSUFBTCxFQUFXd0IsSUFBWCxFQUFpQmxCLEVBQWpCLEVBQXFCQyxFQUFyQixFQUF5QkMsRUFBekIsRUFBNkJXLEdBQUcsQ0FBQ00sTUFBakMsQ0FBVjtBQUNBLGNBQUlOLEdBQUcsQ0FBQ25CLElBQUosS0FBYUMsbUJBQWFDLEdBQTlCLEVBQW1DLE9BQU9zQixJQUFQO0FBQ3RDO0FBQ0osT0FkRCxNQWNPLElBQUlOLEVBQUUsS0FBS0UseUJBQWlCTSxjQUE1QixFQUE0QztBQUMvQyxZQUFNSixJQUFHLEdBQUdMLEVBQUUsQ0FBQ1AsTUFBSCxHQUFZLENBQXhCOztBQUNBLFlBQUlpQixHQUFHLEdBQUcsQ0FBVjs7QUFDQSxhQUFLLElBQUlKLEVBQUMsR0FBRyxDQUFiLEVBQWdCQSxFQUFDLEdBQUdELElBQXBCLEVBQXlCQyxFQUFDLElBQUksQ0FBOUIsRUFBaUM7QUFDN0IsY0FBTWpCLEVBQUUsR0FBR1csRUFBRSxDQUFDTSxFQUFDLEdBQUdJLEdBQUwsQ0FBRixHQUFjLENBQXpCOztBQUNBLGNBQU1wQixHQUFFLEdBQUdVLEVBQUUsQ0FBQ00sRUFBQyxHQUFHSSxHQUFKLEdBQVUsQ0FBWCxDQUFGLEdBQWtCLENBQTdCOztBQUNBLGNBQU1uQixHQUFFLEdBQUdTLEVBQUUsQ0FBQ00sRUFBQyxHQUFHLENBQUwsQ0FBRixHQUFZLENBQXZCOztBQUNBakosc0JBQUt5RSxHQUFMLENBQVM0QyxHQUFHLENBQUM3RixDQUFiLEVBQWdCa0gsRUFBRSxDQUFDVixFQUFELENBQWxCLEVBQXdCVSxFQUFFLENBQUNWLEVBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DVSxFQUFFLENBQUNWLEVBQUUsR0FBRyxDQUFOLENBQXRDOztBQUNBaEksc0JBQUt5RSxHQUFMLENBQVM0QyxHQUFHLENBQUM5RixDQUFiLEVBQWdCbUgsRUFBRSxDQUFDVCxHQUFELENBQWxCLEVBQXdCUyxFQUFFLENBQUNULEdBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DUyxFQUFFLENBQUNULEdBQUUsR0FBRyxDQUFOLENBQXRDOztBQUNBakksc0JBQUt5RSxHQUFMLENBQVM0QyxHQUFHLENBQUM1RixDQUFiLEVBQWdCaUgsRUFBRSxDQUFDUixHQUFELENBQWxCLEVBQXdCUSxFQUFFLENBQUNSLEdBQUUsR0FBRyxDQUFOLENBQTFCLEVBQW9DUSxFQUFFLENBQUNSLEdBQUUsR0FBRyxDQUFOLENBQXRDOztBQUNBbUIsVUFBQUEsR0FBRyxHQUFHLENBQUNBLEdBQVA7O0FBQ0EsY0FBTUgsS0FBSSxHQUFHekMsU0FBUyxDQUFDMUYsWUFBVixDQUF1QmQsR0FBdkIsRUFBNEJvSCxHQUE1QixFQUFpQ3dCLEdBQUcsQ0FBQ3ZILFdBQXJDLENBQWI7O0FBQ0EsY0FBSTRILEtBQUksS0FBSyxDQUFULElBQWNBLEtBQUksR0FBR0wsR0FBRyxDQUFDckIsUUFBN0IsRUFBdUM7QUFDdkNNLFVBQUFBLFVBQVUsQ0FBQ2UsR0FBRyxDQUFDbkIsSUFBTCxFQUFXd0IsS0FBWCxFQUFpQmxCLEVBQWpCLEVBQXFCQyxHQUFyQixFQUF5QkMsR0FBekIsRUFBNkJXLEdBQUcsQ0FBQ00sTUFBakMsQ0FBVjtBQUNBLGNBQUlOLEdBQUcsQ0FBQ25CLElBQUosS0FBYUMsbUJBQWFDLEdBQTlCLEVBQW1DLE9BQU9zQixLQUFQO0FBQ3RDO0FBQ0osT0FoQk0sTUFnQkEsSUFBSU4sRUFBRSxLQUFLRSx5QkFBaUJRLFlBQTVCLEVBQTBDO0FBQzdDLFlBQU1OLEtBQUcsR0FBR0wsRUFBRSxDQUFDUCxNQUFILEdBQVksQ0FBeEI7O0FBQ0EsWUFBTUosR0FBRSxHQUFHVyxFQUFFLENBQUMsQ0FBRCxDQUFGLEdBQVEsQ0FBbkI7O0FBQ0EzSSxvQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzdGLENBQWIsRUFBZ0JrSCxFQUFFLENBQUNWLEdBQUQsQ0FBbEIsRUFBd0JVLEVBQUUsQ0FBQ1YsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NVLEVBQUUsQ0FBQ1YsR0FBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0EsYUFBSyxJQUFJaUIsR0FBQyxHQUFHLENBQWIsRUFBZ0JBLEdBQUMsR0FBR0QsS0FBcEIsRUFBeUJDLEdBQUMsSUFBSSxDQUE5QixFQUFpQztBQUM3QixjQUFNaEIsR0FBRSxHQUFHVSxFQUFFLENBQUNNLEdBQUQsQ0FBRixHQUFRLENBQW5COztBQUNBLGNBQU1mLEdBQUUsR0FBR1MsRUFBRSxDQUFDTSxHQUFDLEdBQUcsQ0FBTCxDQUFGLEdBQVksQ0FBdkI7O0FBQ0FqSixzQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzlGLENBQWIsRUFBZ0JtSCxFQUFFLENBQUNULEdBQUQsQ0FBbEIsRUFBd0JTLEVBQUUsQ0FBQ1QsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NTLEVBQUUsQ0FBQ1QsR0FBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0FqSSxzQkFBS3lFLEdBQUwsQ0FBUzRDLEdBQUcsQ0FBQzVGLENBQWIsRUFBZ0JpSCxFQUFFLENBQUNSLEdBQUQsQ0FBbEIsRUFBd0JRLEVBQUUsQ0FBQ1IsR0FBRSxHQUFHLENBQU4sQ0FBMUIsRUFBb0NRLEVBQUUsQ0FBQ1IsR0FBRSxHQUFHLENBQU4sQ0FBdEM7O0FBQ0EsY0FBTWdCLE1BQUksR0FBR3pDLFNBQVMsQ0FBQzFGLFlBQVYsQ0FBdUJkLEdBQXZCLEVBQTRCb0gsR0FBNUIsRUFBaUN3QixHQUFHLENBQUN2SCxXQUFyQyxDQUFiOztBQUNBLGNBQUk0SCxNQUFJLEtBQUssQ0FBVCxJQUFjQSxNQUFJLEdBQUdMLEdBQUcsQ0FBQ3JCLFFBQTdCLEVBQXVDO0FBQ3ZDTSxVQUFBQSxVQUFVLENBQUNlLEdBQUcsQ0FBQ25CLElBQUwsRUFBV3dCLE1BQVgsRUFBaUJsQixHQUFqQixFQUFxQkMsR0FBckIsRUFBeUJDLEdBQXpCLEVBQTZCVyxHQUFHLENBQUNNLE1BQWpDLENBQVY7QUFDQSxjQUFJTixHQUFHLENBQUNuQixJQUFKLEtBQWFDLG1CQUFhQyxHQUE5QixFQUFtQyxPQUFPc0IsTUFBUDtBQUN0QztBQUNKOztBQUNELGFBQU9yQixNQUFQO0FBQ0gsS0EvQ0Q7O0FBZ0RBLFdBQU8sVUFBVTVILEdBQVYsRUFBb0JzSixPQUFwQixFQUErQ0MsT0FBL0MsRUFBNkU7QUFDaEYzQixNQUFBQSxNQUFNLEdBQUcsQ0FBVDtBQUNBLFVBQUkwQixPQUFPLENBQUNFLGFBQVIsQ0FBc0JDLFNBQXRCLENBQWdDdEIsTUFBaEMsS0FBMkMsQ0FBL0MsRUFBa0QsT0FBT1AsTUFBUDtBQUNsRCxVQUFNZ0IsR0FBRyxHQUFHVyxPQUFPLEtBQUtHLFNBQVosR0FBd0JwQyxLQUF4QixHQUFnQ2lDLE9BQTVDO0FBQ0EsVUFBTTNHLEdBQUcsR0FBRzBHLE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkcsV0FBdEIsQ0FBa0MvRyxHQUE5QztBQUNBLFVBQU1DLEdBQUcsR0FBR3lHLE9BQU8sQ0FBQ0UsYUFBUixDQUFzQkcsV0FBdEIsQ0FBa0M5RyxHQUE5Qzs7QUFDQSxVQUFJSSxTQUFTLENBQUNqRCxHQUFELEVBQU00QyxHQUFOLEVBQVdDLEdBQVgsQ0FBYixFQUE4QjtBQUMxQixZQUFNOEYsRUFBRSxHQUFHVyxPQUFPLENBQUNNLGFBQW5CO0FBRDBCLG1CQUVhTixPQUFPLENBQUNFLGFBRnJCO0FBQUEsWUFFUGYsRUFGTyxRQUVsQmdCLFNBRmtCO0FBQUEsWUFFTWYsRUFGTixRQUVIbUIsT0FGRztBQUcxQnJCLFFBQUFBLFdBQVcsQ0FBQ0MsRUFBRCxFQUFLQyxFQUFMLEVBQVVDLEVBQVYsRUFBYzNJLEdBQWQsRUFBbUI0SSxHQUFuQixDQUFYO0FBQ0g7O0FBQ0QsYUFBT2hCLE1BQVA7QUFDSCxLQVpEO0FBYUgsR0FwRm1CLEVBQXBCO0FBc0ZBOzs7Ozs7Ozs7Ozs7QUFVQSxNQUFNa0MsUUFBUSxHQUFJLFlBQVk7QUFDMUIsUUFBSWxDLE1BQU0sR0FBRyxDQUFiO0FBQ0EsUUFBTU4sS0FBc0IsR0FBRztBQUFFQyxNQUFBQSxRQUFRLEVBQUVDLFFBQVo7QUFBc0JuRyxNQUFBQSxXQUFXLEVBQUUsS0FBbkM7QUFBMENvRyxNQUFBQSxJQUFJLEVBQUVDLG1CQUFhQztBQUE3RCxLQUEvQjtBQUNBLFdBQU8sVUFBVTNILEdBQVYsRUFBb0IrSixJQUFwQixFQUFnQ1IsT0FBaEMsRUFBMkQ7QUFDOUQzQixNQUFBQSxNQUFNLEdBQUcsQ0FBVDtBQUNBLFVBQU1nQixHQUFHLEdBQUdXLE9BQU8sS0FBS0csU0FBWixHQUF3QnBDLEtBQXhCLEdBQWdDaUMsT0FBNUM7QUFDQSxVQUFNcEIsTUFBTSxHQUFHNEIsSUFBSSxDQUFDQyxrQkFBTCxDQUF3QjdCLE1BQXZDO0FBQ0EsVUFBTXZGLEdBQUcsR0FBR21ILElBQUksQ0FBQ0UsTUFBTCxDQUFZQyxXQUF4QjtBQUNBLFVBQU1ySCxHQUFHLEdBQUdrSCxJQUFJLENBQUNFLE1BQUwsQ0FBWUUsV0FBeEI7QUFDQSxVQUFJdkgsR0FBRyxJQUFJQyxHQUFQLElBQWMsQ0FBQ0ksU0FBUyxDQUFDakQsR0FBRCxFQUFNNEMsR0FBTixFQUFXQyxHQUFYLENBQTVCLEVBQTZDLE9BQU8rRSxNQUFQOztBQUM3QyxXQUFLLElBQUl6QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHZ0QsTUFBcEIsRUFBNEJoRCxDQUFDLEVBQTdCLEVBQWlDO0FBQzdCLFlBQU1pRixFQUFFLEdBQUdMLElBQUksQ0FBQ0Msa0JBQUwsQ0FBd0I3RSxDQUF4QixDQUFYO0FBQ0EsWUFBTWtGLEdBQUcsR0FBR2xELFdBQVcsQ0FBQ25ILEdBQUQsRUFBTW9LLEVBQU4sRUFBVXhCLEdBQVYsQ0FBdkI7O0FBQ0EsWUFBSXlCLEdBQUosRUFBUztBQUNMLGNBQUl6QixHQUFHLENBQUNuQixJQUFKLEtBQWFDLG1CQUFhUSxPQUE5QixFQUF1QztBQUNuQyxnQkFBSU4sTUFBTSxLQUFLLENBQVgsSUFBZ0JBLE1BQU0sR0FBR3lDLEdBQTdCLEVBQWtDO0FBQzlCekMsY0FBQUEsTUFBTSxHQUFHeUMsR0FBVDtBQUNBLGtCQUFJekIsR0FBRyxDQUFDMEIsVUFBUixFQUFvQjFCLEdBQUcsQ0FBQzBCLFVBQUosQ0FBZSxDQUFmLElBQW9CbkYsQ0FBcEI7QUFDdkI7QUFDSixXQUxELE1BS087QUFDSHlDLFlBQUFBLE1BQU0sR0FBR3lDLEdBQVQ7QUFDQSxnQkFBSXpCLEdBQUcsQ0FBQzBCLFVBQVIsRUFBb0IxQixHQUFHLENBQUMwQixVQUFKLENBQWVsQyxJQUFmLENBQW9CakQsQ0FBcEI7O0FBQ3BCLGdCQUFJeUQsR0FBRyxDQUFDbkIsSUFBSixLQUFhQyxtQkFBYUMsR0FBOUIsRUFBbUM7QUFDL0IscUJBQU8wQyxHQUFQO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBQ0QsVUFBSXpDLE1BQU0sSUFBSWdCLEdBQUcsQ0FBQ25CLElBQUosS0FBYUMsbUJBQWFRLE9BQXhDLEVBQWlEO0FBQzdDLFlBQUlVLEdBQUcsQ0FBQ00sTUFBUixFQUFnQjtBQUNaTixVQUFBQSxHQUFHLENBQUNNLE1BQUosQ0FBVyxDQUFYLEVBQWMzQixRQUFkLEdBQXlCSyxNQUF6QjtBQUNBZ0IsVUFBQUEsR0FBRyxDQUFDTSxNQUFKLENBQVdmLE1BQVgsR0FBb0IsQ0FBcEI7QUFDSDs7QUFDRCxZQUFJUyxHQUFHLENBQUMwQixVQUFSLEVBQW9CMUIsR0FBRyxDQUFDMEIsVUFBSixDQUFlbkMsTUFBZixHQUF3QixDQUF4QjtBQUN2Qjs7QUFDRCxhQUFPUCxNQUFQO0FBQ0gsS0FqQ0Q7QUFrQ0gsR0FyQ2dCLEVBQWpCO0FBdUNBOzs7Ozs7Ozs7Ozs7QUFVQSxNQUFNMkMsU0FBUyxHQUFJLFlBQVk7QUFDM0IsUUFBSTNDLE1BQU0sR0FBRyxDQUFiO0FBQ0EsUUFBTU4sS0FBdUIsR0FBRztBQUFFQyxNQUFBQSxRQUFRLEVBQUVDLFFBQVo7QUFBc0JuRyxNQUFBQSxXQUFXLEVBQUUsS0FBbkM7QUFBMENvRyxNQUFBQSxJQUFJLEVBQUVDLG1CQUFhQztBQUE3RCxLQUFoQztBQUNBLFFBQU02QyxRQUFRLEdBQUcsSUFBSXhLLFlBQUosRUFBakI7QUFDQSxRQUFNeUssRUFBRSxHQUFHLElBQUlDLFdBQUosRUFBWDtBQUNBLFdBQU8sVUFBVXpJLENBQVYsRUFBa0IwSSxLQUFsQixFQUFzQ3BCLE9BQXRDLEVBQWtFO0FBQ3JFM0IsTUFBQUEsTUFBTSxHQUFHLENBQVQ7QUFDQSxVQUFNZ0IsR0FBRyxHQUFHVyxPQUFPLEtBQUtHLFNBQVosR0FBd0JwQyxLQUF4QixHQUFnQ2lDLE9BQTVDO0FBQ0EsVUFBTXFCLEVBQUUsR0FBR0QsS0FBSyxDQUFDRSxXQUFqQjtBQUNBLFVBQUlELEVBQUUsSUFBSSxDQUFDakksUUFBUSxDQUFDVixDQUFELEVBQUkySSxFQUFKLENBQW5CLEVBQTRCLE9BQU9oRCxNQUFQOztBQUM1QjVILG1CQUFJOEssSUFBSixDQUFTTixRQUFULEVBQW1CdkksQ0FBbkI7O0FBQ0EsVUFBSTBJLEtBQUssQ0FBQ0ksSUFBVixFQUFnQjtBQUNaTCxvQkFBS00sTUFBTCxDQUFZUCxFQUFaLEVBQWdCRSxLQUFLLENBQUNJLElBQU4sQ0FBV0UsY0FBWCxDQUEwQlIsRUFBMUIsQ0FBaEI7O0FBQ0ExSyxvQkFBS21MLGFBQUwsQ0FBbUJWLFFBQVEsQ0FBQzNKLENBQTVCLEVBQStCb0IsQ0FBQyxDQUFDcEIsQ0FBakMsRUFBb0M0SixFQUFwQzs7QUFDQTFLLG9CQUFLb0wsbUJBQUwsQ0FBeUJYLFFBQVEsQ0FBQ3BLLENBQWxDLEVBQXFDNkIsQ0FBQyxDQUFDN0IsQ0FBdkMsRUFBMENxSyxFQUExQztBQUNIOztBQUNELFVBQU1XLFNBQVMsR0FBR1QsS0FBSyxDQUFDUyxTQUF4Qjs7QUFDQSxXQUFLLElBQUlqRyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHaUcsU0FBUyxDQUFDakQsTUFBOUIsRUFBc0NoRCxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLFlBQU1rRyxPQUFPLEdBQUdELFNBQVMsQ0FBQ2pHLENBQUQsQ0FBVCxDQUFha0csT0FBN0I7QUFDQSxZQUFNaEIsR0FBRyxHQUFHbEQsV0FBVyxDQUFDcUQsUUFBRCxFQUFXYSxPQUFYLEVBQW9CekMsR0FBcEIsQ0FBdkI7O0FBQ0EsWUFBSXlCLEdBQUosRUFBUztBQUNMLGNBQUl6QixHQUFHLENBQUNuQixJQUFKLEtBQWFDLG1CQUFhUSxPQUE5QixFQUF1QztBQUNuQyxnQkFBSU4sTUFBTSxLQUFLLENBQVgsSUFBZ0JBLE1BQU0sR0FBR3lDLEdBQTdCLEVBQWtDO0FBQzlCekMsY0FBQUEsTUFBTSxHQUFHeUMsR0FBVDtBQUNBLGtCQUFJekIsR0FBRyxDQUFDMEIsVUFBUixFQUFvQjFCLEdBQUcsQ0FBQzBCLFVBQUosQ0FBZSxDQUFmLElBQW9CbkYsQ0FBcEI7QUFDdkI7QUFDSixXQUxELE1BS087QUFDSHlDLFlBQUFBLE1BQU0sR0FBR3lDLEdBQVQ7QUFDQSxnQkFBSXpCLEdBQUcsQ0FBQzBCLFVBQVIsRUFBb0IxQixHQUFHLENBQUMwQixVQUFKLENBQWVsQyxJQUFmLENBQW9CakQsQ0FBcEI7O0FBQ3BCLGdCQUFJeUQsR0FBRyxDQUFDbkIsSUFBSixLQUFhQyxtQkFBYUMsR0FBOUIsRUFBbUM7QUFDL0IscUJBQU8wQyxHQUFQO0FBQ0g7QUFDSjtBQUNKO0FBQ0o7O0FBQ0QsVUFBSXpDLE1BQU0sSUFBSWdCLEdBQUcsQ0FBQ25CLElBQUosS0FBYUMsbUJBQWFRLE9BQXhDLEVBQWlEO0FBQzdDLFlBQUlVLEdBQUcsQ0FBQ00sTUFBUixFQUFnQjtBQUNaTixVQUFBQSxHQUFHLENBQUNNLE1BQUosQ0FBVyxDQUFYLEVBQWMzQixRQUFkLEdBQXlCSyxNQUF6QjtBQUNBZ0IsVUFBQUEsR0FBRyxDQUFDTSxNQUFKLENBQVdmLE1BQVgsR0FBb0IsQ0FBcEI7QUFDSDs7QUFDRCxZQUFJUyxHQUFHLENBQUMwQixVQUFSLEVBQW9CMUIsR0FBRyxDQUFDMEIsVUFBSixDQUFlbkMsTUFBZixHQUF3QixDQUF4QjtBQUN2Qjs7QUFDRCxhQUFPUCxNQUFQO0FBQ0gsS0F0Q0Q7QUF1Q0gsR0E1Q2lCLEVBQWxCO0FBOENBOzs7Ozs7Ozs7OztBQVNBLE1BQU0wRCxVQUFVLEdBQUksWUFBWTtBQUM1QixRQUFNdkssRUFBRSxHQUFHLElBQUloQixXQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBQVg7QUFFQSxXQUFPLFVBQVV3TCxJQUFWLEVBQXNCdEwsS0FBdEIsRUFBNEM7QUFDL0NGLGtCQUFLYSxRQUFMLENBQWNHLEVBQWQsRUFBa0J3SyxJQUFJLENBQUN4SixDQUF2QixFQUEwQndKLElBQUksQ0FBQ0MsQ0FBL0I7O0FBQ0EsVUFBTTdLLENBQUMsR0FBRyxDQUFDVixLQUFLLENBQUNHLENBQU4sR0FBVUwsWUFBS0ksR0FBTCxDQUFTb0wsSUFBSSxDQUFDQyxDQUFkLEVBQWlCdkwsS0FBSyxDQUFDSSxDQUF2QixDQUFYLElBQXdDTixZQUFLSSxHQUFMLENBQVNZLEVBQVQsRUFBYWQsS0FBSyxDQUFDSSxDQUFuQixDQUFsRDs7QUFDQSxVQUFJTSxDQUFDLEdBQUcsQ0FBSixJQUFTQSxDQUFDLEdBQUcsQ0FBakIsRUFBb0I7QUFBRSxlQUFPLENBQVA7QUFBVzs7QUFDakMsYUFBT0EsQ0FBUDtBQUNILEtBTEQ7QUFNSCxHQVRrQixFQUFuQjtBQVdBOzs7Ozs7Ozs7Ozs7QUFVQSxNQUFNOEssYUFBYSxHQUFJLFlBQVk7QUFDL0IsUUFBTTFLLEVBQUUsR0FBRyxJQUFJaEIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTWlCLEVBQUUsR0FBRyxJQUFJakIsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTTJMLEVBQUUsR0FBRyxJQUFJM0wsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTTRMLEVBQUUsR0FBRyxJQUFJNUwsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsUUFBTU0sQ0FBQyxHQUFHLElBQUlOLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVjtBQUNBLFFBQU1nQyxDQUFDLEdBQUcsSUFBSWhDLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVjtBQUVBLFdBQU8sVUFBVXdMLElBQVYsRUFBc0JuSyxRQUF0QixFQUEwQ3dLLEtBQTFDLEVBQWdFO0FBQ25FN0wsa0JBQUthLFFBQUwsQ0FBY0csRUFBZCxFQUFrQkssUUFBUSxDQUFDRSxDQUEzQixFQUE4QkYsUUFBUSxDQUFDRyxDQUF2Qzs7QUFDQXhCLGtCQUFLYSxRQUFMLENBQWNJLEVBQWQsRUFBa0JJLFFBQVEsQ0FBQ0ksQ0FBM0IsRUFBOEJKLFFBQVEsQ0FBQ0csQ0FBdkM7O0FBQ0F4QixrQkFBS2EsUUFBTCxDQUFjOEssRUFBZCxFQUFrQkgsSUFBSSxDQUFDQyxDQUF2QixFQUEwQkQsSUFBSSxDQUFDeEosQ0FBL0I7O0FBRUFoQyxrQkFBSzBCLEtBQUwsQ0FBV3BCLENBQVgsRUFBY1UsRUFBZCxFQUFrQkMsRUFBbEI7O0FBQ0EsVUFBTVUsR0FBRyxHQUFHM0IsWUFBS0ksR0FBTCxDQUFTdUwsRUFBVCxFQUFhckwsQ0FBYixDQUFaOztBQUVBLFVBQUlxQixHQUFHLElBQUksR0FBWCxFQUFnQjtBQUNaLGVBQU8sQ0FBUDtBQUNIOztBQUVEM0Isa0JBQUthLFFBQUwsQ0FBYytLLEVBQWQsRUFBa0JKLElBQUksQ0FBQ0MsQ0FBdkIsRUFBMEJwSyxRQUFRLENBQUNHLENBQW5DOztBQUNBLFVBQU1aLENBQUMsR0FBR1osWUFBS0ksR0FBTCxDQUFTd0wsRUFBVCxFQUFhdEwsQ0FBYixDQUFWOztBQUNBLFVBQUlNLENBQUMsR0FBRyxDQUFKLElBQVNBLENBQUMsR0FBR2UsR0FBakIsRUFBc0I7QUFDbEIsZUFBTyxDQUFQO0FBQ0g7O0FBRUQzQixrQkFBSzBCLEtBQUwsQ0FBV00sQ0FBWCxFQUFjMkosRUFBZCxFQUFrQkMsRUFBbEI7O0FBQ0EsVUFBSTlKLENBQUMsR0FBRzlCLFlBQUtJLEdBQUwsQ0FBU2EsRUFBVCxFQUFhZSxDQUFiLENBQVI7O0FBQ0EsVUFBSUYsQ0FBQyxHQUFHLENBQUosSUFBU0EsQ0FBQyxHQUFHSCxHQUFqQixFQUFzQjtBQUNsQixlQUFPLENBQVA7QUFDSDs7QUFFRCxVQUFJbUssQ0FBQyxHQUFHLENBQUM5TCxZQUFLSSxHQUFMLENBQVNZLEVBQVQsRUFBYWdCLENBQWIsQ0FBVDs7QUFDQSxVQUFJOEosQ0FBQyxHQUFHLEdBQUosSUFBV2hLLENBQUMsR0FBR2dLLENBQUosR0FBUW5LLEdBQXZCLEVBQTRCO0FBQ3hCLGVBQU8sQ0FBUDtBQUNIOztBQUVELFVBQUlrSyxLQUFKLEVBQVc7QUFDUCxZQUFNRSxNQUFNLEdBQUcsTUFBTXBLLEdBQXJCO0FBQ0FHLFFBQUFBLENBQUMsSUFBSWlLLE1BQUw7QUFDQUQsUUFBQUEsQ0FBQyxJQUFJQyxNQUFMO0FBQ0EsWUFBTWxLLENBQUMsR0FBRyxNQUFNQyxDQUFOLEdBQVVnSyxDQUFwQixDQUpPLENBTVA7O0FBQ0E5TCxvQkFBS3lFLEdBQUwsQ0FBU29ILEtBQVQsRUFDSXhLLFFBQVEsQ0FBQ0csQ0FBVCxDQUFXNEIsQ0FBWCxHQUFldkIsQ0FBZixHQUFtQlIsUUFBUSxDQUFDRSxDQUFULENBQVc2QixDQUFYLEdBQWV0QixDQUFsQyxHQUFzQ1QsUUFBUSxDQUFDSSxDQUFULENBQVcyQixDQUFYLEdBQWUwSSxDQUR6RCxFQUVJekssUUFBUSxDQUFDRyxDQUFULENBQVc4QixDQUFYLEdBQWV6QixDQUFmLEdBQW1CUixRQUFRLENBQUNFLENBQVQsQ0FBVytCLENBQVgsR0FBZXhCLENBQWxDLEdBQXNDVCxRQUFRLENBQUNJLENBQVQsQ0FBVzZCLENBQVgsR0FBZXdJLENBRnpELEVBR0l6SyxRQUFRLENBQUNHLENBQVQsQ0FBV2dDLENBQVgsR0FBZTNCLENBQWYsR0FBbUJSLFFBQVEsQ0FBQ0UsQ0FBVCxDQUFXaUMsQ0FBWCxHQUFlMUIsQ0FBbEMsR0FBc0NULFFBQVEsQ0FBQ0ksQ0FBVCxDQUFXK0IsQ0FBWCxHQUFlc0ksQ0FIekQ7QUFLSDs7QUFFRCxhQUFPLENBQVA7QUFDSCxLQTVDRDtBQTZDSCxHQXJEcUIsRUFBdEI7O0FBdURBLE1BQU1FLEdBQUcsR0FBRyxJQUFJL0wsWUFBSixFQUFaO0FBQ0E7Ozs7Ozs7Ozs7QUFTQSxXQUFTZ00sU0FBVCxDQUFvQlQsSUFBcEIsRUFBZ0N6SSxJQUFoQyxFQUFvRDtBQUNoRGlKLElBQUFBLEdBQUcsQ0FBQ2xMLENBQUosQ0FBTTJELEdBQU4sQ0FBVStHLElBQUksQ0FBQ0MsQ0FBZjs7QUFDQXpMLGdCQUFLYSxRQUFMLENBQWNtTCxHQUFHLENBQUMzTCxDQUFsQixFQUFxQm1MLElBQUksQ0FBQ3hKLENBQTFCLEVBQTZCd0osSUFBSSxDQUFDQyxDQUFsQzs7QUFDQU8sSUFBQUEsR0FBRyxDQUFDM0wsQ0FBSixDQUFNNEYsU0FBTjtBQUNBLFFBQU1wRCxHQUFHLEdBQUdELFFBQVEsQ0FBQ29KLEdBQUQsRUFBTWpKLElBQU4sQ0FBcEI7QUFDQSxRQUFNbUosR0FBRyxHQUFHVixJQUFJLENBQUNwRCxNQUFMLEVBQVo7O0FBQ0EsUUFBSXZGLEdBQUcsSUFBSXFKLEdBQVgsRUFBZ0I7QUFDWixhQUFPckosR0FBUDtBQUNILEtBRkQsTUFFTztBQUNILGFBQU8sQ0FBUDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7Ozs7QUFTQSxXQUFTc0osUUFBVCxDQUFtQlgsSUFBbkIsRUFBK0JoSCxHQUEvQixFQUFpRDtBQUM3Q3dILElBQUFBLEdBQUcsQ0FBQ2xMLENBQUosQ0FBTTJELEdBQU4sQ0FBVStHLElBQUksQ0FBQ0MsQ0FBZjs7QUFDQXpMLGdCQUFLYSxRQUFMLENBQWNtTCxHQUFHLENBQUMzTCxDQUFsQixFQUFxQm1MLElBQUksQ0FBQ3hKLENBQTFCLEVBQTZCd0osSUFBSSxDQUFDQyxDQUFsQzs7QUFDQU8sSUFBQUEsR0FBRyxDQUFDM0wsQ0FBSixDQUFNNEYsU0FBTjtBQUNBLFFBQU1wRCxHQUFHLEdBQUdvQixPQUFPLENBQUMrSCxHQUFELEVBQU14SCxHQUFOLENBQW5CO0FBQ0EsUUFBTTBILEdBQUcsR0FBR1YsSUFBSSxDQUFDcEQsTUFBTCxFQUFaOztBQUNBLFFBQUl2RixHQUFHLElBQUlxSixHQUFYLEVBQWdCO0FBQ1osYUFBT3JKLEdBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxhQUFPLENBQVA7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7O0FBU0EsV0FBU3VKLFdBQVQsQ0FBc0JaLElBQXRCLEVBQWtDdkosTUFBbEMsRUFBMEQ7QUFDdEQrSixJQUFBQSxHQUFHLENBQUNsTCxDQUFKLENBQU0yRCxHQUFOLENBQVUrRyxJQUFJLENBQUNDLENBQWY7O0FBQ0F6TCxnQkFBS2EsUUFBTCxDQUFjbUwsR0FBRyxDQUFDM0wsQ0FBbEIsRUFBcUJtTCxJQUFJLENBQUN4SixDQUExQixFQUE2QndKLElBQUksQ0FBQ0MsQ0FBbEM7O0FBQ0FPLElBQUFBLEdBQUcsQ0FBQzNMLENBQUosQ0FBTTRGLFNBQU47QUFDQSxRQUFNcEQsR0FBRyxHQUFHZCxVQUFVLENBQUNpSyxHQUFELEVBQU0vSixNQUFOLENBQXRCO0FBQ0EsUUFBTWlLLEdBQUcsR0FBR1YsSUFBSSxDQUFDcEQsTUFBTCxFQUFaOztBQUNBLFFBQUl2RixHQUFHLElBQUlxSixHQUFYLEVBQWdCO0FBQ1osYUFBT3JKLEdBQVA7QUFDSCxLQUZELE1BRU87QUFDSCxhQUFPLENBQVA7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7O0FBU0EsTUFBTXdKLFNBQVMsR0FBSSxZQUFZO0FBQzNCLFFBQU1DLElBQUksR0FBRyxJQUFJdE0sV0FBSixFQUFiO0FBQ0EsUUFBTXVNLElBQUksR0FBRyxJQUFJdk0sV0FBSixFQUFiO0FBQ0EsUUFBTXdNLElBQUksR0FBRyxJQUFJeE0sV0FBSixFQUFiO0FBQ0EsUUFBTXlNLElBQUksR0FBRyxJQUFJek0sV0FBSixFQUFiO0FBQ0EsV0FBTyxVQUFVME0sS0FBVixFQUF1QkMsS0FBdkIsRUFBb0M7QUFDdkMzTSxrQkFBS2EsUUFBTCxDQUFjeUwsSUFBZCxFQUFvQkksS0FBSyxDQUFDdEssTUFBMUIsRUFBa0NzSyxLQUFLLENBQUMxSixXQUF4Qzs7QUFDQWhELGtCQUFLaUQsR0FBTCxDQUFTc0osSUFBVCxFQUFlRyxLQUFLLENBQUN0SyxNQUFyQixFQUE2QnNLLEtBQUssQ0FBQzFKLFdBQW5DOztBQUNBaEQsa0JBQUthLFFBQUwsQ0FBYzJMLElBQWQsRUFBb0JHLEtBQUssQ0FBQ3ZLLE1BQTFCLEVBQWtDdUssS0FBSyxDQUFDM0osV0FBeEM7O0FBQ0FoRCxrQkFBS2lELEdBQUwsQ0FBU3dKLElBQVQsRUFBZUUsS0FBSyxDQUFDdkssTUFBckIsRUFBNkJ1SyxLQUFLLENBQUMzSixXQUFuQzs7QUFDQSxhQUFRc0osSUFBSSxDQUFDbEosQ0FBTCxJQUFVcUosSUFBSSxDQUFDckosQ0FBZixJQUFvQm1KLElBQUksQ0FBQ25KLENBQUwsSUFBVW9KLElBQUksQ0FBQ3BKLENBQXBDLElBQ0ZrSixJQUFJLENBQUNoSixDQUFMLElBQVVtSixJQUFJLENBQUNuSixDQUFmLElBQW9CaUosSUFBSSxDQUFDakosQ0FBTCxJQUFVa0osSUFBSSxDQUFDbEosQ0FEakMsSUFFRmdKLElBQUksQ0FBQzlJLENBQUwsSUFBVWlKLElBQUksQ0FBQ2pKLENBQWYsSUFBb0IrSSxJQUFJLENBQUMvSSxDQUFMLElBQVVnSixJQUFJLENBQUNoSixDQUZ4QztBQUdILEtBUkQ7QUFTSCxHQWRpQixFQUFsQjs7QUFnQkEsV0FBU29KLGVBQVQsQ0FBMEIvSixHQUExQixFQUFxQ0MsR0FBckMsRUFBZ0QrSixHQUFoRCxFQUE2RDtBQUN6RDdNLGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUFpQmhLLEdBQUcsQ0FBQ08sQ0FBckIsRUFBd0JOLEdBQUcsQ0FBQ1EsQ0FBNUIsRUFBK0JSLEdBQUcsQ0FBQ1UsQ0FBbkM7O0FBQ0F4RCxnQkFBS3lFLEdBQUwsQ0FBU29JLEdBQUcsQ0FBQyxDQUFELENBQVosRUFBaUJoSyxHQUFHLENBQUNPLENBQXJCLEVBQXdCTixHQUFHLENBQUNRLENBQTVCLEVBQStCVCxHQUFHLENBQUNXLENBQW5DOztBQUNBeEQsZ0JBQUt5RSxHQUFMLENBQVNvSSxHQUFHLENBQUMsQ0FBRCxDQUFaLEVBQWlCaEssR0FBRyxDQUFDTyxDQUFyQixFQUF3QlAsR0FBRyxDQUFDUyxDQUE1QixFQUErQlIsR0FBRyxDQUFDVSxDQUFuQzs7QUFDQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUFpQmhLLEdBQUcsQ0FBQ08sQ0FBckIsRUFBd0JQLEdBQUcsQ0FBQ1MsQ0FBNUIsRUFBK0JULEdBQUcsQ0FBQ1csQ0FBbkM7O0FBQ0F4RCxnQkFBS3lFLEdBQUwsQ0FBU29JLEdBQUcsQ0FBQyxDQUFELENBQVosRUFBaUIvSixHQUFHLENBQUNNLENBQXJCLEVBQXdCTixHQUFHLENBQUNRLENBQTVCLEVBQStCUixHQUFHLENBQUNVLENBQW5DOztBQUNBeEQsZ0JBQUt5RSxHQUFMLENBQVNvSSxHQUFHLENBQUMsQ0FBRCxDQUFaLEVBQWlCL0osR0FBRyxDQUFDTSxDQUFyQixFQUF3Qk4sR0FBRyxDQUFDUSxDQUE1QixFQUErQlQsR0FBRyxDQUFDVyxDQUFuQzs7QUFDQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUFpQi9KLEdBQUcsQ0FBQ00sQ0FBckIsRUFBd0JQLEdBQUcsQ0FBQ1MsQ0FBNUIsRUFBK0JSLEdBQUcsQ0FBQ1UsQ0FBbkM7O0FBQ0F4RCxnQkFBS3lFLEdBQUwsQ0FBU29JLEdBQUcsQ0FBQyxDQUFELENBQVosRUFBaUIvSixHQUFHLENBQUNNLENBQXJCLEVBQXdCUCxHQUFHLENBQUNTLENBQTVCLEVBQStCVCxHQUFHLENBQUNXLENBQW5DO0FBQ0g7O0FBRUQsV0FBU3NKLGNBQVQsQ0FBeUJyTCxDQUF6QixFQUFrQ08sQ0FBbEMsRUFBMkMrSyxFQUEzQyxFQUFxREMsRUFBckQsRUFBK0RDLEVBQS9ELEVBQXlFSixHQUF6RSxFQUFzRjtBQUNsRjdNLGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3Qzs7QUFLQXhELGdCQUFLeUUsR0FBTCxDQUFTb0ksR0FBRyxDQUFDLENBQUQsQ0FBWixFQUNJcEwsQ0FBQyxDQUFDMkIsQ0FBRixHQUFNMkosRUFBRSxDQUFDM0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDb0IsQ0FBZixHQUFtQjRKLEVBQUUsQ0FBQzVKLENBQUgsR0FBT3BCLENBQUMsQ0FBQ3NCLENBQTVCLEdBQWdDMkosRUFBRSxDQUFDN0osQ0FBSCxHQUFPcEIsQ0FBQyxDQUFDd0IsQ0FEN0MsRUFFSS9CLENBQUMsQ0FBQzZCLENBQUYsR0FBTXlKLEVBQUUsQ0FBQ3pKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ29CLENBQWYsR0FBbUI0SixFQUFFLENBQUMxSixDQUFILEdBQU90QixDQUFDLENBQUNzQixDQUE1QixHQUFnQzJKLEVBQUUsQ0FBQzNKLENBQUgsR0FBT3RCLENBQUMsQ0FBQ3dCLENBRjdDLEVBR0kvQixDQUFDLENBQUMrQixDQUFGLEdBQU11SixFQUFFLENBQUN2SixDQUFILEdBQU94QixDQUFDLENBQUNvQixDQUFmLEdBQW1CNEosRUFBRSxDQUFDeEosQ0FBSCxHQUFPeEIsQ0FBQyxDQUFDc0IsQ0FBNUIsR0FBZ0MySixFQUFFLENBQUN6SixDQUFILEdBQU94QixDQUFDLENBQUN3QixDQUg3QztBQUtIOztBQUVELFdBQVMwSixXQUFULENBQXNCQyxRQUF0QixFQUFnREMsSUFBaEQsRUFBNEQ7QUFDeEQsUUFBSXZLLEdBQUcsR0FBRzdDLFlBQUtJLEdBQUwsQ0FBU2dOLElBQVQsRUFBZUQsUUFBUSxDQUFDLENBQUQsQ0FBdkIsQ0FBVjtBQUFBLFFBQXVDckssR0FBRyxHQUFHRCxHQUE3Qzs7QUFDQSxTQUFLLElBQUl1QyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLENBQXBCLEVBQXVCLEVBQUVBLENBQXpCLEVBQTRCO0FBQ3hCLFVBQU1pSSxVQUFVLEdBQUdyTixZQUFLSSxHQUFMLENBQVNnTixJQUFULEVBQWVELFFBQVEsQ0FBQy9ILENBQUQsQ0FBdkIsQ0FBbkI7O0FBQ0F2QyxNQUFBQSxHQUFHLEdBQUl3SyxVQUFVLEdBQUd4SyxHQUFkLEdBQXFCd0ssVUFBckIsR0FBa0N4SyxHQUF4QztBQUNBQyxNQUFBQSxHQUFHLEdBQUl1SyxVQUFVLEdBQUd2SyxHQUFkLEdBQXFCdUssVUFBckIsR0FBa0N2SyxHQUF4QztBQUNIOztBQUNELFdBQU8sQ0FBQ0QsR0FBRCxFQUFNQyxHQUFOLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OztBQVNBLE1BQU13SyxRQUFRLEdBQUksWUFBWTtBQUMxQixRQUFNQyxJQUFJLEdBQUcsSUFBSWhKLEtBQUosQ0FBVSxFQUFWLENBQWI7O0FBQ0EsU0FBSyxJQUFJYSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO0FBQ3pCbUksTUFBQUEsSUFBSSxDQUFDbkksQ0FBRCxDQUFKLEdBQVUsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVjtBQUNIOztBQUNELFFBQU1tTixRQUFRLEdBQUcsSUFBSTVJLEtBQUosQ0FBVSxDQUFWLENBQWpCO0FBQ0EsUUFBTWlKLFNBQVMsR0FBRyxJQUFJakosS0FBSixDQUFVLENBQVYsQ0FBbEI7O0FBQ0EsU0FBSyxJQUFJYSxHQUFDLEdBQUcsQ0FBYixFQUFnQkEsR0FBQyxHQUFHLENBQXBCLEVBQXVCQSxHQUFDLEVBQXhCLEVBQTRCO0FBQ3hCK0gsTUFBQUEsUUFBUSxDQUFDL0gsR0FBRCxDQUFSLEdBQWMsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZDtBQUNBd04sTUFBQUEsU0FBUyxDQUFDcEksR0FBRCxDQUFULEdBQWUsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZjtBQUNIOztBQUNELFFBQU02QyxHQUFHLEdBQUcsSUFBSTdDLFdBQUosRUFBWjtBQUNBLFFBQU04QyxHQUFHLEdBQUcsSUFBSTlDLFdBQUosRUFBWjtBQUNBLFdBQU8sVUFBVStDLElBQVYsRUFBc0J5QixHQUF0QixFQUF3QztBQUMzQ3hFLGtCQUFLeUUsR0FBTCxDQUFTOEksSUFBSSxDQUFDLENBQUQsQ0FBYixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFDQXZOLGtCQUFLeUUsR0FBTCxDQUFTOEksSUFBSSxDQUFDLENBQUQsQ0FBYixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFDQXZOLGtCQUFLeUUsR0FBTCxDQUFTOEksSUFBSSxDQUFDLENBQUQsQ0FBYixFQUFrQixDQUFsQixFQUFxQixDQUFyQixFQUF3QixDQUF4Qjs7QUFDQXZOLGtCQUFLeUUsR0FBTCxDQUFTOEksSUFBSSxDQUFDLENBQUQsQ0FBYixFQUFrQi9JLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkMsR0FBbEMsRUFBdUNILEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkUsR0FBdkQsRUFBNERKLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkcsR0FBNUU7O0FBQ0E3RSxrQkFBS3lFLEdBQUwsQ0FBUzhJLElBQUksQ0FBQyxDQUFELENBQWIsRUFBa0IvSSxHQUFHLENBQUNFLFdBQUosQ0FBZ0JJLEdBQWxDLEVBQXVDTixHQUFHLENBQUNFLFdBQUosQ0FBZ0JLLEdBQXZELEVBQTREUCxHQUFHLENBQUNFLFdBQUosQ0FBZ0JNLEdBQTVFOztBQUNBaEYsa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCL0ksR0FBRyxDQUFDRSxXQUFKLENBQWdCTyxHQUFsQyxFQUF1Q1QsR0FBRyxDQUFDRSxXQUFKLENBQWdCUSxHQUF2RCxFQUE0RFYsR0FBRyxDQUFDRSxXQUFKLENBQWdCUyxHQUE1RTs7QUFFQSxXQUFLLElBQUlDLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUcsQ0FBcEIsRUFBdUIsRUFBRUEsR0FBekIsRUFBNEI7QUFBRTtBQUMxQnBGLG9CQUFLMEIsS0FBTCxDQUFXNkwsSUFBSSxDQUFDLElBQUluSSxHQUFDLEdBQUcsQ0FBUixHQUFZLENBQWIsQ0FBZixFQUFnQ21JLElBQUksQ0FBQ25JLEdBQUQsQ0FBcEMsRUFBeUNtSSxJQUFJLENBQUMsQ0FBRCxDQUE3Qzs7QUFDQXZOLG9CQUFLMEIsS0FBTCxDQUFXNkwsSUFBSSxDQUFDLElBQUluSSxHQUFDLEdBQUcsQ0FBUixHQUFZLENBQWIsQ0FBZixFQUFnQ21JLElBQUksQ0FBQ25JLEdBQUQsQ0FBcEMsRUFBeUNtSSxJQUFJLENBQUMsQ0FBRCxDQUE3Qzs7QUFDQXZOLG9CQUFLMEIsS0FBTCxDQUFXNkwsSUFBSSxDQUFDLElBQUluSSxHQUFDLEdBQUcsQ0FBUixHQUFZLENBQWIsQ0FBZixFQUFnQ21JLElBQUksQ0FBQ25JLEdBQUQsQ0FBcEMsRUFBeUNtSSxJQUFJLENBQUMsQ0FBRCxDQUE3QztBQUNIOztBQUVEdk4sa0JBQUthLFFBQUwsQ0FBY2dDLEdBQWQsRUFBbUJFLElBQUksQ0FBQ1gsTUFBeEIsRUFBZ0NXLElBQUksQ0FBQ0MsV0FBckM7O0FBQ0FoRCxrQkFBS2lELEdBQUwsQ0FBU0gsR0FBVCxFQUFjQyxJQUFJLENBQUNYLE1BQW5CLEVBQTJCVyxJQUFJLENBQUNDLFdBQWhDOztBQUNBNEosTUFBQUEsZUFBZSxDQUFDL0osR0FBRCxFQUFNQyxHQUFOLEVBQVdxSyxRQUFYLENBQWY7QUFDQUwsTUFBQUEsY0FBYyxDQUFDdEksR0FBRyxDQUFDcEMsTUFBTCxFQUFhb0MsR0FBRyxDQUFDeEIsV0FBakIsRUFBOEJ1SyxJQUFJLENBQUMsQ0FBRCxDQUFsQyxFQUF1Q0EsSUFBSSxDQUFDLENBQUQsQ0FBM0MsRUFBZ0RBLElBQUksQ0FBQyxDQUFELENBQXBELEVBQXlEQyxTQUF6RCxDQUFkOztBQUVBLFdBQUssSUFBSXZFLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsRUFBcEIsRUFBd0IsRUFBRUEsQ0FBMUIsRUFBNkI7QUFDekIsWUFBTXpILENBQUMsR0FBRzBMLFdBQVcsQ0FBQ0MsUUFBRCxFQUFXSSxJQUFJLENBQUN0RSxDQUFELENBQWYsQ0FBckI7QUFDQSxZQUFNMUgsQ0FBQyxHQUFHMkwsV0FBVyxDQUFDTSxTQUFELEVBQVlELElBQUksQ0FBQ3RFLENBQUQsQ0FBaEIsQ0FBckI7O0FBQ0EsWUFBSTFILENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0MsQ0FBQyxDQUFDLENBQUQsQ0FBUixJQUFlQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9ELENBQUMsQ0FBQyxDQUFELENBQTNCLEVBQWdDO0FBQzVCLGlCQUFPLENBQVAsQ0FENEIsQ0FDbEI7QUFDYjtBQUNKOztBQUVELGFBQU8sQ0FBUDtBQUNILEtBNUJEO0FBNkJILEdBMUNnQixFQUFqQjtBQTRDQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNa00sVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBVTFLLElBQVYsRUFBc0I3QyxLQUF0QixFQUE0QztBQUMzRCxRQUFNZ0MsQ0FBQyxHQUFHYSxJQUFJLENBQUNDLFdBQUwsQ0FBaUJJLENBQWpCLEdBQXFCN0MsSUFBSSxDQUFDQyxHQUFMLENBQVNOLEtBQUssQ0FBQ0ksQ0FBTixDQUFROEMsQ0FBakIsQ0FBckIsR0FDTkwsSUFBSSxDQUFDQyxXQUFMLENBQWlCTSxDQUFqQixHQUFxQi9DLElBQUksQ0FBQ0MsR0FBTCxDQUFTTixLQUFLLENBQUNJLENBQU4sQ0FBUWdELENBQWpCLENBRGYsR0FFTlAsSUFBSSxDQUFDQyxXQUFMLENBQWlCUSxDQUFqQixHQUFxQmpELElBQUksQ0FBQ0MsR0FBTCxDQUFTTixLQUFLLENBQUNJLENBQU4sQ0FBUWtELENBQWpCLENBRnpCOztBQUdBLFFBQU1wRCxHQUFHLEdBQUdKLFlBQUtJLEdBQUwsQ0FBU0YsS0FBSyxDQUFDSSxDQUFmLEVBQWtCeUMsSUFBSSxDQUFDWCxNQUF2QixDQUFaOztBQUNBLFFBQUloQyxHQUFHLEdBQUc4QixDQUFOLEdBQVVoQyxLQUFLLENBQUNHLENBQXBCLEVBQXVCO0FBQUUsYUFBTyxDQUFDLENBQVI7QUFBWSxLQUFyQyxNQUNLLElBQUlELEdBQUcsR0FBRzhCLENBQU4sR0FBVWhDLEtBQUssQ0FBQ0csQ0FBcEIsRUFBdUI7QUFBRSxhQUFPLENBQVA7QUFBVzs7QUFDekMsV0FBTyxDQUFQO0FBQ0gsR0FSRDtBQVVBOzs7Ozs7Ozs7OztBQVNBLE1BQU1xTixZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFVM0ssSUFBVixFQUFzQjRLLE9BQXRCLEVBQWdEO0FBQ2pFLFNBQUssSUFBSXZJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1SSxPQUFPLENBQUNDLE1BQVIsQ0FBZXhGLE1BQW5DLEVBQTJDaEQsQ0FBQyxFQUE1QyxFQUFnRDtBQUM1QztBQUNBLFVBQUlxSSxVQUFVLENBQUMxSyxJQUFELEVBQU80SyxPQUFPLENBQUNDLE1BQVIsQ0FBZXhJLENBQWYsQ0FBUCxDQUFWLEtBQXdDLENBQUMsQ0FBN0MsRUFBZ0Q7QUFDNUMsZUFBTyxDQUFQO0FBQ0g7QUFDSixLQU5nRSxDQU0vRDs7O0FBQ0YsV0FBTyxDQUFQO0FBQ0gsR0FSRCxDLENBVUE7O0FBQ0E7Ozs7Ozs7Ozs7O0FBU0EsTUFBTXlJLHFCQUFxQixHQUFJLFlBQVk7QUFDdkMsUUFBTUMsR0FBRyxHQUFHLElBQUl2SixLQUFKLENBQVUsQ0FBVixDQUFaO0FBQ0EsUUFBSXdKLElBQUksR0FBRyxDQUFYO0FBQUEsUUFBY0MsSUFBSSxHQUFHLENBQXJCOztBQUNBLFNBQUssSUFBSTVJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcwSSxHQUFHLENBQUMxRixNQUF4QixFQUFnQ2hELENBQUMsRUFBakMsRUFBcUM7QUFDakMwSSxNQUFBQSxHQUFHLENBQUMxSSxDQUFELENBQUgsR0FBUyxJQUFJcEYsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFUO0FBQ0g7O0FBQ0QsV0FBTyxVQUFVK0MsSUFBVixFQUFzQjRLLE9BQXRCLEVBQWdEO0FBQ25ELFVBQUl4RSxNQUFNLEdBQUcsQ0FBYjtBQUFBLFVBQWdCOEUsVUFBVSxHQUFHLEtBQTdCLENBRG1ELENBRW5EOztBQUNBLFdBQUssSUFBSTdJLEdBQUMsR0FBRyxDQUFiLEVBQWdCQSxHQUFDLEdBQUd1SSxPQUFPLENBQUNDLE1BQVIsQ0FBZXhGLE1BQW5DLEVBQTJDaEQsR0FBQyxFQUE1QyxFQUFnRDtBQUM1QytELFFBQUFBLE1BQU0sR0FBR3NFLFVBQVUsQ0FBQzFLLElBQUQsRUFBTzRLLE9BQU8sQ0FBQ0MsTUFBUixDQUFleEksR0FBZixDQUFQLENBQW5CLENBRDRDLENBRTVDOztBQUNBLFlBQUkrRCxNQUFNLEtBQUssQ0FBQyxDQUFoQixFQUFtQjtBQUFFLGlCQUFPLENBQVA7QUFBVyxTQUFoQyxDQUFpQztBQUFqQyxhQUNLLElBQUlBLE1BQU0sS0FBSyxDQUFmLEVBQWtCO0FBQUU4RSxZQUFBQSxVQUFVLEdBQUcsSUFBYjtBQUFvQjtBQUNoRDs7QUFDRCxVQUFJLENBQUNBLFVBQUwsRUFBaUI7QUFBRSxlQUFPLENBQVA7QUFBVyxPQVRxQixDQVNwQjtBQUMvQjtBQUNBOzs7QUFDQSxXQUFLLElBQUk3SSxJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHdUksT0FBTyxDQUFDUixRQUFSLENBQWlCL0UsTUFBckMsRUFBNkNoRCxJQUFDLEVBQTlDLEVBQWtEO0FBQzlDcEYsb0JBQUthLFFBQUwsQ0FBY2lOLEdBQUcsQ0FBQzFJLElBQUQsQ0FBakIsRUFBc0J1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvSCxJQUFqQixDQUF0QixFQUEyQ3JDLElBQUksQ0FBQ1gsTUFBaEQ7QUFDSDs7QUFDRDJMLE1BQUFBLElBQUksR0FBRyxDQUFQLEVBQVVDLElBQUksR0FBRyxDQUFqQjs7QUFDQSxXQUFLLElBQUk1SSxJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHdUksT0FBTyxDQUFDUixRQUFSLENBQWlCL0UsTUFBckMsRUFBNkNoRCxJQUFDLEVBQTlDLEVBQWtEO0FBQzlDLFlBQUkwSSxHQUFHLENBQUMxSSxJQUFELENBQUgsQ0FBT2hDLENBQVAsR0FBV0wsSUFBSSxDQUFDQyxXQUFMLENBQWlCSSxDQUFoQyxFQUFtQztBQUFFMkssVUFBQUEsSUFBSTtBQUFLLFNBQTlDLE1BQ0ssSUFBSUQsR0FBRyxDQUFDMUksSUFBRCxDQUFILENBQU9oQyxDQUFQLEdBQVcsQ0FBQ0wsSUFBSSxDQUFDQyxXQUFMLENBQWlCSSxDQUFqQyxFQUFvQztBQUFFNEssVUFBQUEsSUFBSTtBQUFLO0FBQ3ZEOztBQUNELFVBQUlELElBQUksS0FBS0osT0FBTyxDQUFDUixRQUFSLENBQWlCL0UsTUFBMUIsSUFBb0M0RixJQUFJLEtBQUtMLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQWxFLEVBQTBFO0FBQUUsZUFBTyxDQUFQO0FBQVc7O0FBQ3ZGMkYsTUFBQUEsSUFBSSxHQUFHLENBQVA7QUFBVUMsTUFBQUEsSUFBSSxHQUFHLENBQVA7O0FBQ1YsV0FBSyxJQUFJNUksSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR3VJLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQXJDLEVBQTZDaEQsSUFBQyxFQUE5QyxFQUFrRDtBQUM5QyxZQUFJMEksR0FBRyxDQUFDMUksSUFBRCxDQUFILENBQU85QixDQUFQLEdBQVdQLElBQUksQ0FBQ0MsV0FBTCxDQUFpQk0sQ0FBaEMsRUFBbUM7QUFBRXlLLFVBQUFBLElBQUk7QUFBSyxTQUE5QyxNQUNLLElBQUlELEdBQUcsQ0FBQzFJLElBQUQsQ0FBSCxDQUFPOUIsQ0FBUCxHQUFXLENBQUNQLElBQUksQ0FBQ0MsV0FBTCxDQUFpQk0sQ0FBakMsRUFBb0M7QUFBRTBLLFVBQUFBLElBQUk7QUFBSztBQUN2RDs7QUFDRCxVQUFJRCxJQUFJLEtBQUtKLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQTFCLElBQW9DNEYsSUFBSSxLQUFLTCxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFsRSxFQUEwRTtBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUN2RjJGLE1BQUFBLElBQUksR0FBRyxDQUFQO0FBQVVDLE1BQUFBLElBQUksR0FBRyxDQUFQOztBQUNWLFdBQUssSUFBSTVJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFyQyxFQUE2Q2hELElBQUMsRUFBOUMsRUFBa0Q7QUFDOUMsWUFBSTBJLEdBQUcsQ0FBQzFJLElBQUQsQ0FBSCxDQUFPNUIsQ0FBUCxHQUFXVCxJQUFJLENBQUNDLFdBQUwsQ0FBaUJRLENBQWhDLEVBQW1DO0FBQUV1SyxVQUFBQSxJQUFJO0FBQUssU0FBOUMsTUFDSyxJQUFJRCxHQUFHLENBQUMxSSxJQUFELENBQUgsQ0FBTzVCLENBQVAsR0FBVyxDQUFDVCxJQUFJLENBQUNDLFdBQUwsQ0FBaUJRLENBQWpDLEVBQW9DO0FBQUV3SyxVQUFBQSxJQUFJO0FBQUs7QUFDdkQ7O0FBQ0QsVUFBSUQsSUFBSSxLQUFLSixPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUExQixJQUFvQzRGLElBQUksS0FBS0wsT0FBTyxDQUFDUixRQUFSLENBQWlCL0UsTUFBbEUsRUFBMEU7QUFBRSxlQUFPLENBQVA7QUFBVzs7QUFDdkYsYUFBTyxDQUFQO0FBQ0gsS0FsQ0Q7QUFtQ0gsR0F6QzZCLEVBQTlCO0FBMkNBOzs7Ozs7Ozs7OztBQVNBLE1BQU04RixTQUFTLEdBQUksWUFBWTtBQUMzQixRQUFNSixHQUFHLEdBQUcsSUFBSTlOLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBWjtBQUFBLFFBQStCbU8sRUFBRSxHQUFHLElBQUlDLFdBQUosRUFBcEM7O0FBQ0EsUUFBTUMsUUFBUSxHQUFHLFNBQVhBLFFBQVcsQ0FBVTdNLENBQVYsRUFBbUJELENBQW5CLEVBQXFDO0FBQUUsYUFBT2hCLElBQUksQ0FBQ0MsR0FBTCxDQUFTZ0IsQ0FBQyxDQUFDNEIsQ0FBWCxJQUFnQjdCLENBQUMsQ0FBQzZCLENBQWxCLElBQXVCN0MsSUFBSSxDQUFDQyxHQUFMLENBQVNnQixDQUFDLENBQUM4QixDQUFYLElBQWdCL0IsQ0FBQyxDQUFDK0IsQ0FBekMsSUFBOEMvQyxJQUFJLENBQUNDLEdBQUwsQ0FBU2dCLENBQUMsQ0FBQ2dDLENBQVgsSUFBZ0JqQyxDQUFDLENBQUNpQyxDQUF2RTtBQUEyRSxLQUFuSTs7QUFDQSxXQUFPLFVBQVVnQixHQUFWLEVBQW9COEosS0FBcEIsRUFBMEM7QUFDN0N0TyxrQkFBS2EsUUFBTCxDQUFjaU4sR0FBZCxFQUFtQlEsS0FBbkIsRUFBMEI5SixHQUFHLENBQUNwQyxNQUE5Qjs7QUFDQXBDLGtCQUFLdU8sYUFBTCxDQUFtQlQsR0FBbkIsRUFBd0JBLEdBQXhCLEVBQTZCTSxZQUFLSSxTQUFMLENBQWVMLEVBQWYsRUFBbUIzSixHQUFHLENBQUNFLFdBQXZCLENBQTdCOztBQUNBLGFBQU8ySixRQUFRLENBQUNQLEdBQUQsRUFBTXRKLEdBQUcsQ0FBQ3hCLFdBQVYsQ0FBZjtBQUNILEtBSkQ7QUFLSCxHQVJpQixFQUFsQjtBQVVBOzs7Ozs7Ozs7OztBQVNBLE1BQU15TCxTQUFTLEdBQUksWUFBWTtBQUMzQixRQUFNQyxNQUFNLEdBQUcsU0FBVEEsTUFBUyxDQUFVcE8sQ0FBVixFQUFtQjhDLENBQW5CLEVBQThCRSxDQUE5QixFQUF5Q0UsQ0FBekMsRUFBb0Q7QUFDL0QsYUFBT2pELElBQUksQ0FBQ0MsR0FBTCxDQUFTRixDQUFDLENBQUM4QyxDQUFGLEdBQU1BLENBQU4sR0FBVTlDLENBQUMsQ0FBQ2dELENBQUYsR0FBTUEsQ0FBaEIsR0FBb0JoRCxDQUFDLENBQUNrRCxDQUFGLEdBQU1BLENBQW5DLENBQVA7QUFDSCxLQUZEOztBQUdBLFdBQU8sVUFBVWdCLEdBQVYsRUFBb0J0RSxLQUFwQixFQUEwQztBQUM3QztBQUNBLFVBQU1nQyxDQUFDLEdBQUdzQyxHQUFHLENBQUN4QixXQUFKLENBQWdCSSxDQUFoQixHQUFvQnNMLE1BQU0sQ0FBQ3hPLEtBQUssQ0FBQ0ksQ0FBUCxFQUFVa0UsR0FBRyxDQUFDRSxXQUFKLENBQWdCQyxHQUExQixFQUErQkgsR0FBRyxDQUFDRSxXQUFKLENBQWdCRSxHQUEvQyxFQUFvREosR0FBRyxDQUFDRSxXQUFKLENBQWdCRyxHQUFwRSxDQUExQixHQUNOTCxHQUFHLENBQUN4QixXQUFKLENBQWdCTSxDQUFoQixHQUFvQm9MLE1BQU0sQ0FBQ3hPLEtBQUssQ0FBQ0ksQ0FBUCxFQUFVa0UsR0FBRyxDQUFDRSxXQUFKLENBQWdCSSxHQUExQixFQUErQk4sR0FBRyxDQUFDRSxXQUFKLENBQWdCSyxHQUEvQyxFQUFvRFAsR0FBRyxDQUFDRSxXQUFKLENBQWdCTSxHQUFwRSxDQURwQixHQUVOUixHQUFHLENBQUN4QixXQUFKLENBQWdCUSxDQUFoQixHQUFvQmtMLE1BQU0sQ0FBQ3hPLEtBQUssQ0FBQ0ksQ0FBUCxFQUFVa0UsR0FBRyxDQUFDRSxXQUFKLENBQWdCTyxHQUExQixFQUErQlQsR0FBRyxDQUFDRSxXQUFKLENBQWdCUSxHQUEvQyxFQUFvRFYsR0FBRyxDQUFDRSxXQUFKLENBQWdCUyxHQUFwRSxDQUY5Qjs7QUFJQSxVQUFNL0UsR0FBRyxHQUFHSixZQUFLSSxHQUFMLENBQVNGLEtBQUssQ0FBQ0ksQ0FBZixFQUFrQmtFLEdBQUcsQ0FBQ3BDLE1BQXRCLENBQVo7O0FBQ0EsVUFBSWhDLEdBQUcsR0FBRzhCLENBQU4sR0FBVWhDLEtBQUssQ0FBQ0csQ0FBcEIsRUFBdUI7QUFBRSxlQUFPLENBQUMsQ0FBUjtBQUFZLE9BQXJDLE1BQ0ssSUFBSUQsR0FBRyxHQUFHOEIsQ0FBTixHQUFVaEMsS0FBSyxDQUFDRyxDQUFwQixFQUF1QjtBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUN6QyxhQUFPLENBQVA7QUFDSCxLQVZEO0FBV0gsR0FmaUIsRUFBbEI7QUFpQkE7Ozs7Ozs7Ozs7O0FBU0EsTUFBTXNPLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQVVuSyxHQUFWLEVBQW9CbUosT0FBcEIsRUFBOEM7QUFDOUQsU0FBSyxJQUFJdkksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR3VJLE9BQU8sQ0FBQ0MsTUFBUixDQUFleEYsTUFBbkMsRUFBMkNoRCxDQUFDLEVBQTVDLEVBQWdEO0FBQzVDO0FBQ0EsVUFBSXFKLFNBQVMsQ0FBQ2pLLEdBQUQsRUFBTW1KLE9BQU8sQ0FBQ0MsTUFBUixDQUFleEksQ0FBZixDQUFOLENBQVQsS0FBc0MsQ0FBQyxDQUEzQyxFQUE4QztBQUMxQyxlQUFPLENBQVA7QUFDSDtBQUNKLEtBTjZELENBTTVEOzs7QUFDRixXQUFPLENBQVA7QUFDSCxHQVJELEMsQ0FVQTs7QUFDQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNd0osb0JBQW9CLEdBQUksWUFBWTtBQUN0QyxRQUFNZCxHQUFHLEdBQUcsSUFBSXZKLEtBQUosQ0FBVSxDQUFWLENBQVo7QUFDQSxRQUFJMkUsSUFBSSxHQUFHLENBQVg7QUFBQSxRQUFjNkUsSUFBSSxHQUFHLENBQXJCO0FBQUEsUUFBd0JDLElBQUksR0FBRyxDQUEvQjs7QUFDQSxTQUFLLElBQUk1SSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHMEksR0FBRyxDQUFDMUYsTUFBeEIsRUFBZ0NoRCxDQUFDLEVBQWpDLEVBQXFDO0FBQ2pDMEksTUFBQUEsR0FBRyxDQUFDMUksQ0FBRCxDQUFILEdBQVMsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVDtBQUNIOztBQUNELFFBQU1JLEdBQUcsR0FBRyxTQUFOQSxHQUFNLENBQVVFLENBQVYsRUFBbUI4QyxDQUFuQixFQUE4QkUsQ0FBOUIsRUFBeUNFLENBQXpDLEVBQTREO0FBQ3BFLGFBQU9sRCxDQUFDLENBQUM4QyxDQUFGLEdBQU1BLENBQU4sR0FBVTlDLENBQUMsQ0FBQ2dELENBQUYsR0FBTUEsQ0FBaEIsR0FBb0JoRCxDQUFDLENBQUNrRCxDQUFGLEdBQU1BLENBQWpDO0FBQ0gsS0FGRDs7QUFHQSxXQUFPLFVBQVVnQixHQUFWLEVBQW9CbUosT0FBcEIsRUFBOEM7QUFDakQsVUFBSXhFLE1BQU0sR0FBRyxDQUFiO0FBQUEsVUFBZ0I4RSxVQUFVLEdBQUcsS0FBN0IsQ0FEaUQsQ0FFakQ7O0FBQ0EsV0FBSyxJQUFJN0ksSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBR3VJLE9BQU8sQ0FBQ0MsTUFBUixDQUFleEYsTUFBbkMsRUFBMkNoRCxJQUFDLEVBQTVDLEVBQWdEO0FBQzVDK0QsUUFBQUEsTUFBTSxHQUFHc0YsU0FBUyxDQUFDakssR0FBRCxFQUFNbUosT0FBTyxDQUFDQyxNQUFSLENBQWV4SSxJQUFmLENBQU4sQ0FBbEIsQ0FENEMsQ0FFNUM7O0FBQ0EsWUFBSStELE1BQU0sS0FBSyxDQUFDLENBQWhCLEVBQW1CO0FBQUUsaUJBQU8sQ0FBUDtBQUFXLFNBQWhDLENBQWlDO0FBQWpDLGFBQ0ssSUFBSUEsTUFBTSxLQUFLLENBQWYsRUFBa0I7QUFBRThFLFlBQUFBLFVBQVUsR0FBRyxJQUFiO0FBQW9CO0FBQ2hEOztBQUNELFVBQUksQ0FBQ0EsVUFBTCxFQUFpQjtBQUFFLGVBQU8sQ0FBUDtBQUFXLE9BVG1CLENBU2xCO0FBQy9CO0FBQ0E7OztBQUNBLFdBQUssSUFBSTdJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFyQyxFQUE2Q2hELElBQUMsRUFBOUMsRUFBa0Q7QUFDOUNwRixvQkFBS2EsUUFBTCxDQUFjaU4sR0FBRyxDQUFDMUksSUFBRCxDQUFqQixFQUFzQnVJLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9ILElBQWpCLENBQXRCLEVBQTJDWixHQUFHLENBQUNwQyxNQUEvQztBQUNIOztBQUNEMkwsTUFBQUEsSUFBSSxHQUFHLENBQVAsRUFBVUMsSUFBSSxHQUFHLENBQWpCOztBQUNBLFdBQUssSUFBSTVJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFyQyxFQUE2Q2hELElBQUMsRUFBOUMsRUFBa0Q7QUFDOUM4RCxRQUFBQSxJQUFJLEdBQUc5SSxHQUFHLENBQUMwTixHQUFHLENBQUMxSSxJQUFELENBQUosRUFBU1osR0FBRyxDQUFDRSxXQUFKLENBQWdCQyxHQUF6QixFQUE4QkgsR0FBRyxDQUFDRSxXQUFKLENBQWdCRSxHQUE5QyxFQUFtREosR0FBRyxDQUFDRSxXQUFKLENBQWdCRyxHQUFuRSxDQUFWOztBQUNBLFlBQUlxRSxJQUFJLEdBQUcxRSxHQUFHLENBQUN4QixXQUFKLENBQWdCSSxDQUEzQixFQUE4QjtBQUFFMkssVUFBQUEsSUFBSTtBQUFLLFNBQXpDLE1BQ0ssSUFBSTdFLElBQUksR0FBRyxDQUFDMUUsR0FBRyxDQUFDeEIsV0FBSixDQUFnQkksQ0FBNUIsRUFBK0I7QUFBRTRLLFVBQUFBLElBQUk7QUFBSztBQUNsRDs7QUFDRCxVQUFJRCxJQUFJLEtBQUtKLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQTFCLElBQW9DNEYsSUFBSSxLQUFLTCxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFsRSxFQUEwRTtBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUN2RjJGLE1BQUFBLElBQUksR0FBRyxDQUFQO0FBQVVDLE1BQUFBLElBQUksR0FBRyxDQUFQOztBQUNWLFdBQUssSUFBSTVJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFyQyxFQUE2Q2hELElBQUMsRUFBOUMsRUFBa0Q7QUFDOUM4RCxRQUFBQSxJQUFJLEdBQUc5SSxHQUFHLENBQUMwTixHQUFHLENBQUMxSSxJQUFELENBQUosRUFBU1osR0FBRyxDQUFDRSxXQUFKLENBQWdCSSxHQUF6QixFQUE4Qk4sR0FBRyxDQUFDRSxXQUFKLENBQWdCSyxHQUE5QyxFQUFtRFAsR0FBRyxDQUFDRSxXQUFKLENBQWdCTSxHQUFuRSxDQUFWOztBQUNBLFlBQUlrRSxJQUFJLEdBQUcxRSxHQUFHLENBQUN4QixXQUFKLENBQWdCTSxDQUEzQixFQUE4QjtBQUFFeUssVUFBQUEsSUFBSTtBQUFLLFNBQXpDLE1BQ0ssSUFBSTdFLElBQUksR0FBRyxDQUFDMUUsR0FBRyxDQUFDeEIsV0FBSixDQUFnQk0sQ0FBNUIsRUFBK0I7QUFBRTBLLFVBQUFBLElBQUk7QUFBSztBQUNsRDs7QUFDRCxVQUFJRCxJQUFJLEtBQUtKLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQTFCLElBQW9DNEYsSUFBSSxLQUFLTCxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFsRSxFQUEwRTtBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUN2RjJGLE1BQUFBLElBQUksR0FBRyxDQUFQO0FBQVVDLE1BQUFBLElBQUksR0FBRyxDQUFQOztBQUNWLFdBQUssSUFBSTVJLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUd1SSxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFyQyxFQUE2Q2hELElBQUMsRUFBOUMsRUFBa0Q7QUFDOUM4RCxRQUFBQSxJQUFJLEdBQUc5SSxHQUFHLENBQUMwTixHQUFHLENBQUMxSSxJQUFELENBQUosRUFBU1osR0FBRyxDQUFDRSxXQUFKLENBQWdCTyxHQUF6QixFQUE4QlQsR0FBRyxDQUFDRSxXQUFKLENBQWdCUSxHQUE5QyxFQUFtRFYsR0FBRyxDQUFDRSxXQUFKLENBQWdCUyxHQUFuRSxDQUFWOztBQUNBLFlBQUkrRCxJQUFJLEdBQUcxRSxHQUFHLENBQUN4QixXQUFKLENBQWdCUSxDQUEzQixFQUE4QjtBQUFFdUssVUFBQUEsSUFBSTtBQUFLLFNBQXpDLE1BQ0ssSUFBSTdFLElBQUksR0FBRyxDQUFDMUUsR0FBRyxDQUFDeEIsV0FBSixDQUFnQlEsQ0FBNUIsRUFBK0I7QUFBRXdLLFVBQUFBLElBQUk7QUFBSztBQUNsRDs7QUFDRCxVQUFJRCxJQUFJLEtBQUtKLE9BQU8sQ0FBQ1IsUUFBUixDQUFpQi9FLE1BQTFCLElBQW9DNEYsSUFBSSxLQUFLTCxPQUFPLENBQUNSLFFBQVIsQ0FBaUIvRSxNQUFsRSxFQUEwRTtBQUFFLGVBQU8sQ0FBUDtBQUFXOztBQUN2RixhQUFPLENBQVA7QUFDSCxLQXJDRDtBQXNDSCxHQS9DNEIsRUFBN0I7QUFpREE7Ozs7Ozs7Ozs7O0FBU0EsTUFBTXlHLE9BQU8sR0FBSSxZQUFZO0FBQ3pCLFFBQU10QixJQUFJLEdBQUcsSUFBSWhKLEtBQUosQ0FBVSxFQUFWLENBQWI7O0FBQ0EsU0FBSyxJQUFJYSxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHLEVBQXBCLEVBQXdCQSxDQUFDLEVBQXpCLEVBQTZCO0FBQ3pCbUksTUFBQUEsSUFBSSxDQUFDbkksQ0FBRCxDQUFKLEdBQVUsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBVjtBQUNIOztBQUVELFFBQU1tTixRQUFRLEdBQUcsSUFBSTVJLEtBQUosQ0FBVSxDQUFWLENBQWpCO0FBQ0EsUUFBTWlKLFNBQVMsR0FBRyxJQUFJakosS0FBSixDQUFVLENBQVYsQ0FBbEI7O0FBQ0EsU0FBSyxJQUFJYSxJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHLENBQXBCLEVBQXVCQSxJQUFDLEVBQXhCLEVBQTRCO0FBQ3hCK0gsTUFBQUEsUUFBUSxDQUFDL0gsSUFBRCxDQUFSLEdBQWMsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZDtBQUNBd04sTUFBQUEsU0FBUyxDQUFDcEksSUFBRCxDQUFULEdBQWUsSUFBSXBGLFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBZjtBQUNIOztBQUVELFdBQU8sVUFBVThPLElBQVYsRUFBcUJDLElBQXJCLEVBQXdDO0FBQzNDL08sa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCdUIsSUFBSSxDQUFDcEssV0FBTCxDQUFpQkMsR0FBbkMsRUFBd0NtSyxJQUFJLENBQUNwSyxXQUFMLENBQWlCRSxHQUF6RCxFQUE4RGtLLElBQUksQ0FBQ3BLLFdBQUwsQ0FBaUJHLEdBQS9FOztBQUNBN0Usa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCdUIsSUFBSSxDQUFDcEssV0FBTCxDQUFpQkksR0FBbkMsRUFBd0NnSyxJQUFJLENBQUNwSyxXQUFMLENBQWlCSyxHQUF6RCxFQUE4RCtKLElBQUksQ0FBQ3BLLFdBQUwsQ0FBaUJNLEdBQS9FOztBQUNBaEYsa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCdUIsSUFBSSxDQUFDcEssV0FBTCxDQUFpQk8sR0FBbkMsRUFBd0M2SixJQUFJLENBQUNwSyxXQUFMLENBQWlCUSxHQUF6RCxFQUE4RDRKLElBQUksQ0FBQ3BLLFdBQUwsQ0FBaUJTLEdBQS9FOztBQUNBbkYsa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCd0IsSUFBSSxDQUFDckssV0FBTCxDQUFpQkMsR0FBbkMsRUFBd0NvSyxJQUFJLENBQUNySyxXQUFMLENBQWlCRSxHQUF6RCxFQUE4RG1LLElBQUksQ0FBQ3JLLFdBQUwsQ0FBaUJHLEdBQS9FOztBQUNBN0Usa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCd0IsSUFBSSxDQUFDckssV0FBTCxDQUFpQkksR0FBbkMsRUFBd0NpSyxJQUFJLENBQUNySyxXQUFMLENBQWlCSyxHQUF6RCxFQUE4RGdLLElBQUksQ0FBQ3JLLFdBQUwsQ0FBaUJNLEdBQS9FOztBQUNBaEYsa0JBQUt5RSxHQUFMLENBQVM4SSxJQUFJLENBQUMsQ0FBRCxDQUFiLEVBQWtCd0IsSUFBSSxDQUFDckssV0FBTCxDQUFpQk8sR0FBbkMsRUFBd0M4SixJQUFJLENBQUNySyxXQUFMLENBQWlCUSxHQUF6RCxFQUE4RDZKLElBQUksQ0FBQ3JLLFdBQUwsQ0FBaUJTLEdBQS9FOztBQUVBLFdBQUssSUFBSUMsSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBRyxDQUFwQixFQUF1QixFQUFFQSxJQUF6QixFQUE0QjtBQUFFO0FBQzFCcEYsb0JBQUswQixLQUFMLENBQVc2TCxJQUFJLENBQUMsSUFBSW5JLElBQUMsR0FBRyxDQUFSLEdBQVksQ0FBYixDQUFmLEVBQWdDbUksSUFBSSxDQUFDbkksSUFBRCxDQUFwQyxFQUF5Q21JLElBQUksQ0FBQyxDQUFELENBQTdDOztBQUNBdk4sb0JBQUswQixLQUFMLENBQVc2TCxJQUFJLENBQUMsSUFBSW5JLElBQUMsR0FBRyxDQUFSLEdBQVksQ0FBYixDQUFmLEVBQWdDbUksSUFBSSxDQUFDbkksSUFBRCxDQUFwQyxFQUF5Q21JLElBQUksQ0FBQyxDQUFELENBQTdDOztBQUNBdk4sb0JBQUswQixLQUFMLENBQVc2TCxJQUFJLENBQUMsSUFBSW5JLElBQUMsR0FBRyxDQUFSLEdBQVksQ0FBYixDQUFmLEVBQWdDbUksSUFBSSxDQUFDbkksSUFBRCxDQUFwQyxFQUF5Q21JLElBQUksQ0FBQyxDQUFELENBQTdDO0FBQ0g7O0FBRURULE1BQUFBLGNBQWMsQ0FBQ2dDLElBQUksQ0FBQzFNLE1BQU4sRUFBYzBNLElBQUksQ0FBQzlMLFdBQW5CLEVBQWdDdUssSUFBSSxDQUFDLENBQUQsQ0FBcEMsRUFBeUNBLElBQUksQ0FBQyxDQUFELENBQTdDLEVBQWtEQSxJQUFJLENBQUMsQ0FBRCxDQUF0RCxFQUEyREosUUFBM0QsQ0FBZDtBQUNBTCxNQUFBQSxjQUFjLENBQUNpQyxJQUFJLENBQUMzTSxNQUFOLEVBQWMyTSxJQUFJLENBQUMvTCxXQUFuQixFQUFnQ3VLLElBQUksQ0FBQyxDQUFELENBQXBDLEVBQXlDQSxJQUFJLENBQUMsQ0FBRCxDQUE3QyxFQUFrREEsSUFBSSxDQUFDLENBQUQsQ0FBdEQsRUFBMkRDLFNBQTNELENBQWQ7O0FBRUEsV0FBSyxJQUFJcEksSUFBQyxHQUFHLENBQWIsRUFBZ0JBLElBQUMsR0FBRyxFQUFwQixFQUF3QixFQUFFQSxJQUExQixFQUE2QjtBQUN6QixZQUFNNUQsQ0FBQyxHQUFHMEwsV0FBVyxDQUFDQyxRQUFELEVBQVdJLElBQUksQ0FBQ25JLElBQUQsQ0FBZixDQUFyQjtBQUNBLFlBQU03RCxDQUFDLEdBQUcyTCxXQUFXLENBQUNNLFNBQUQsRUFBWUQsSUFBSSxDQUFDbkksSUFBRCxDQUFoQixDQUFyQjs7QUFDQSxZQUFJN0QsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPQyxDQUFDLENBQUMsQ0FBRCxDQUFSLElBQWVBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0QsQ0FBQyxDQUFDLENBQUQsQ0FBM0IsRUFBZ0M7QUFDNUIsaUJBQU8sQ0FBUCxDQUQ0QixDQUNsQjtBQUNiO0FBQ0o7O0FBRUQsYUFBTyxDQUFQO0FBQ0gsS0ExQkQ7QUEyQkgsR0F4Q2UsRUFBaEIsQyxDQTBDQTtBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBUUEsTUFBTXlOLFdBQVcsR0FBSSxZQUFZO0FBQzdCLFFBQU1uSixRQUFRLEdBQUcsSUFBSTVELGVBQUosRUFBakI7QUFDQSxRQUFNcUQsSUFBSSxHQUFHLElBQUl0RixXQUFKLEVBQWI7QUFDQSxRQUFNdUYsSUFBSSxHQUFHLElBQUl2RixXQUFKLEVBQWI7QUFDQSxRQUFNd0YsSUFBSSxHQUFHLElBQUl4RixXQUFKLEVBQWI7QUFDQSxRQUFNaVAsU0FBUyxHQUFHLElBQUkxSyxLQUFKLENBQWdCLENBQWhCLENBQWxCOztBQUNBLFNBQUssSUFBSWEsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUFFNkosTUFBQUEsU0FBUyxDQUFDN0osQ0FBRCxDQUFULEdBQWUsSUFBSXBGLFdBQUosRUFBZjtBQUE0Qjs7QUFDMUQsUUFBTWtQLFFBQVEsR0FBRyxJQUFJM0ssS0FBSixDQUFnQixDQUFoQixDQUFqQjs7QUFDQSxTQUFLLElBQUlhLElBQUMsR0FBRyxDQUFiLEVBQWdCQSxJQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLElBQUMsRUFBeEIsRUFBNEI7QUFBRThKLE1BQUFBLFFBQVEsQ0FBQzlKLElBQUQsQ0FBUixHQUFjLElBQUlwRixXQUFKLEVBQWQ7QUFBMkI7O0FBQ3pELFdBQU8sVUFBVXdFLEdBQVYsRUFBb0JzQixPQUFwQixFQUFzQztBQUN6QyxVQUFNcUosQ0FBQyxHQUFHblAsWUFBS29QLGVBQUwsQ0FBcUJ0SixPQUFPLENBQUNLLGNBQTdCLEVBQTZDTCxPQUFPLENBQUNPLGNBQXJELENBQVY7O0FBQ0EsVUFBSThJLENBQUMsS0FBSyxDQUFWLEVBQWE7QUFDVHRKLFFBQUFBLFFBQVEsQ0FBQzFELE1BQVQsR0FBa0IyRCxPQUFPLENBQUMzRCxNQUExQjtBQUNBMEQsUUFBQUEsUUFBUSxDQUFDekQsTUFBVCxDQUFnQnFDLEdBQWhCLENBQW9CcUIsT0FBTyxDQUFDSyxjQUE1QjtBQUNBLGVBQU9NLFNBQVMsQ0FBQzRJLFVBQVYsQ0FBcUJ4SixRQUFyQixFQUErQnJCLEdBQS9CLENBQVA7QUFDSCxPQUpELE1BSU87QUFDSGMsUUFBQUEsSUFBSSxDQUFDbEMsQ0FBTCxHQUFTb0IsR0FBRyxDQUFDRSxXQUFKLENBQWdCQyxHQUF6QjtBQUNBVyxRQUFBQSxJQUFJLENBQUNoQyxDQUFMLEdBQVNrQixHQUFHLENBQUNFLFdBQUosQ0FBZ0JFLEdBQXpCO0FBQ0FVLFFBQUFBLElBQUksQ0FBQzlCLENBQUwsR0FBU2dCLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQkcsR0FBekI7QUFDQVUsUUFBQUEsSUFBSSxDQUFDbkMsQ0FBTCxHQUFTb0IsR0FBRyxDQUFDRSxXQUFKLENBQWdCSSxHQUF6QjtBQUNBUyxRQUFBQSxJQUFJLENBQUNqQyxDQUFMLEdBQVNrQixHQUFHLENBQUNFLFdBQUosQ0FBZ0JLLEdBQXpCO0FBQ0FRLFFBQUFBLElBQUksQ0FBQy9CLENBQUwsR0FBU2dCLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQk0sR0FBekI7QUFDQVEsUUFBQUEsSUFBSSxDQUFDcEMsQ0FBTCxHQUFTb0IsR0FBRyxDQUFDRSxXQUFKLENBQWdCTyxHQUF6QjtBQUNBTyxRQUFBQSxJQUFJLENBQUNsQyxDQUFMLEdBQVNrQixHQUFHLENBQUNFLFdBQUosQ0FBZ0JRLEdBQXpCO0FBQ0FNLFFBQUFBLElBQUksQ0FBQ2hDLENBQUwsR0FBU2dCLEdBQUcsQ0FBQ0UsV0FBSixDQUFnQlMsR0FBekI7QUFDQTJILFFBQUFBLGNBQWMsQ0FBQ3RJLEdBQUcsQ0FBQ3BDLE1BQUwsRUFBYW9DLEdBQUcsQ0FBQ3hCLFdBQWpCLEVBQThCc0MsSUFBOUIsRUFBb0NDLElBQXBDLEVBQTBDQyxJQUExQyxFQUFnRHlKLFNBQWhELENBQWQ7QUFFQSxZQUFNSyxJQUFJLEdBQUdKLFFBQWI7O0FBQ0EsWUFBTUssRUFBRSxHQUFHdlAsWUFBSytLLElBQUwsQ0FBVXVFLElBQUksQ0FBQyxDQUFELENBQWQsRUFBbUJoSyxJQUFuQixDQUFYOztBQUNBLFlBQU15SCxFQUFFLEdBQUcvTSxZQUFLK0ssSUFBTCxDQUFVdUUsSUFBSSxDQUFDLENBQUQsQ0FBZCxFQUFtQi9KLElBQW5CLENBQVg7O0FBQ0EsWUFBTXlILEVBQUUsR0FBR2hOLFlBQUsrSyxJQUFMLENBQVV1RSxJQUFJLENBQUMsQ0FBRCxDQUFkLEVBQW1COUosSUFBbkIsQ0FBWDs7QUFDQSxZQUFNZ0ssQ0FBQyxHQUFHeFAsWUFBS2EsUUFBTCxDQUFjeU8sSUFBSSxDQUFDLENBQUQsQ0FBbEIsRUFBdUJ4SixPQUFPLENBQUMxRCxNQUEvQixFQUF1Q29DLEdBQUcsQ0FBQ3BDLE1BQTNDLENBQVY7O0FBQ0FvTixRQUFBQSxDQUFDLENBQUN2SixTQUFGOztBQUNBLFlBQU1HLENBQUMsR0FBR3BHLFlBQUthLFFBQUwsQ0FBY3lPLElBQUksQ0FBQyxDQUFELENBQWxCLEVBQXVCeEosT0FBTyxDQUFDSyxjQUEvQixFQUErQ0wsT0FBTyxDQUFDTyxjQUF2RCxDQUFWOztBQUNBRCxRQUFBQSxDQUFDLENBQUNILFNBQUY7O0FBQ0FqRyxvQkFBSzBCLEtBQUwsQ0FBVzROLElBQUksQ0FBQyxDQUFELENBQWYsRUFBb0JDLEVBQXBCLEVBQXdCbkosQ0FBeEI7O0FBQ0FwRyxvQkFBSzBCLEtBQUwsQ0FBVzROLElBQUksQ0FBQyxDQUFELENBQWYsRUFBb0J2QyxFQUFwQixFQUF3QjNHLENBQXhCOztBQUNBcEcsb0JBQUswQixLQUFMLENBQVc0TixJQUFJLENBQUMsQ0FBRCxDQUFmLEVBQW9CdEMsRUFBcEIsRUFBd0I1RyxDQUF4Qjs7QUFFQSxhQUFLLElBQUloQixJQUFDLEdBQUcsQ0FBYixFQUFnQkEsSUFBQyxHQUFHLENBQXBCLEVBQXVCLEVBQUVBLElBQXpCLEVBQTRCO0FBQ3hCLGNBQU01RCxDQUFDLEdBQUcwTCxXQUFXLENBQUMrQixTQUFELEVBQVlLLElBQUksQ0FBQ2xLLElBQUQsQ0FBaEIsQ0FBckI7O0FBQ0EsY0FBTXFLLEVBQUUsR0FBR3pQLFlBQUtJLEdBQUwsQ0FBU2tQLElBQUksQ0FBQ2xLLElBQUQsQ0FBYixFQUFrQlUsT0FBTyxDQUFDSyxjQUExQixDQUFYOztBQUNBLGNBQU11SixFQUFFLEdBQUcxUCxZQUFLSSxHQUFMLENBQVNrUCxJQUFJLENBQUNsSyxJQUFELENBQWIsRUFBa0JVLE9BQU8sQ0FBQ08sY0FBMUIsQ0FBWDs7QUFDQSxjQUFNc0osS0FBSyxHQUFHcFAsSUFBSSxDQUFDdUMsR0FBTCxDQUFTMk0sRUFBVCxFQUFhQyxFQUFiLENBQWQ7QUFDQSxjQUFNRSxLQUFLLEdBQUdyUCxJQUFJLENBQUNzQyxHQUFMLENBQVM0TSxFQUFULEVBQWFDLEVBQWIsQ0FBZDtBQUNBLGNBQU1HLEtBQUssR0FBR0QsS0FBSyxHQUFHOUosT0FBTyxDQUFDM0QsTUFBOUI7QUFDQSxjQUFNMk4sS0FBSyxHQUFHSCxLQUFLLEdBQUc3SixPQUFPLENBQUMzRCxNQUE5Qjs7QUFDQSxjQUFJME4sS0FBSyxHQUFHck8sQ0FBQyxDQUFDLENBQUQsQ0FBVCxJQUFnQkEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPc08sS0FBM0IsRUFBa0M7QUFDOUIsbUJBQU8sQ0FBUCxDQUQ4QixDQUNwQjtBQUNiO0FBQ0o7O0FBQ0QsZUFBTyxDQUFQO0FBQ0g7QUFDSixLQTVDRDtBQTZDSCxHQXREbUIsRUFBcEI7QUF3REE7Ozs7Ozs7Ozs7OztBQVVBLE1BQU1DLFlBQVksR0FBRyxTQUFmQSxZQUFlLENBQVU5TixNQUFWLEVBQTBCL0IsS0FBMUIsRUFBZ0Q7QUFDakUsUUFBTUUsR0FBRyxHQUFHSixZQUFLSSxHQUFMLENBQVNGLEtBQUssQ0FBQ0ksQ0FBZixFQUFrQjJCLE1BQU0sQ0FBQ0csTUFBekIsQ0FBWjs7QUFDQSxRQUFNRixDQUFDLEdBQUdELE1BQU0sQ0FBQ0UsTUFBUCxHQUFnQmpDLEtBQUssQ0FBQ0ksQ0FBTixDQUFROEgsTUFBUixFQUExQjs7QUFDQSxRQUFJaEksR0FBRyxHQUFHOEIsQ0FBTixHQUFVaEMsS0FBSyxDQUFDRyxDQUFwQixFQUF1QjtBQUFFLGFBQU8sQ0FBQyxDQUFSO0FBQVksS0FBckMsTUFDSyxJQUFJRCxHQUFHLEdBQUc4QixDQUFOLEdBQVVoQyxLQUFLLENBQUNHLENBQXBCLEVBQXVCO0FBQUUsYUFBTyxDQUFQO0FBQVc7O0FBQ3pDLFdBQU8sQ0FBUDtBQUNILEdBTkQ7QUFRQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNMlAsY0FBYyxHQUFHLFNBQWpCQSxjQUFpQixDQUFVL04sTUFBVixFQUEwQjBMLE9BQTFCLEVBQW9EO0FBQ3ZFLFNBQUssSUFBSXZJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUd1SSxPQUFPLENBQUNDLE1BQVIsQ0FBZXhGLE1BQW5DLEVBQTJDaEQsQ0FBQyxFQUE1QyxFQUFnRDtBQUM1QztBQUNBLFVBQUkySyxZQUFZLENBQUM5TixNQUFELEVBQVMwTCxPQUFPLENBQUNDLE1BQVIsQ0FBZXhJLENBQWYsQ0FBVCxDQUFaLEtBQTRDLENBQUMsQ0FBakQsRUFBb0Q7QUFDaEQsZUFBTyxDQUFQO0FBQ0g7QUFDSixLQU5zRSxDQU1yRTs7O0FBQ0YsV0FBTyxDQUFQO0FBQ0gsR0FSRCxDLENBVUE7O0FBQ0E7Ozs7Ozs7Ozs7O0FBU0EsTUFBTTZLLHVCQUF1QixHQUFJLFlBQVk7QUFDekMsUUFBTWxRLEVBQUUsR0FBRyxJQUFJQyxXQUFKLENBQVMsQ0FBVCxFQUFZLENBQVosRUFBZSxDQUFmLENBQVg7QUFBQSxRQUE4QmtRLEdBQUcsR0FBRyxDQUFDLENBQUQsRUFBSSxDQUFDLENBQUwsRUFBUSxDQUFSLEVBQVcsQ0FBQyxDQUFaLEVBQWUsQ0FBZixFQUFrQixDQUFDLENBQW5CLENBQXBDO0FBQ0EsV0FBTyxVQUFVak8sTUFBVixFQUEwQjBMLE9BQTFCLEVBQW9EO0FBQ3ZELFdBQUssSUFBSXZJLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7QUFDeEIsWUFBTWxGLEtBQUssR0FBR3lOLE9BQU8sQ0FBQ0MsTUFBUixDQUFleEksQ0FBZixDQUFkO0FBQ0EsWUFBTWxELENBQUMsR0FBR0QsTUFBTSxDQUFDRSxNQUFqQjtBQUFBLFlBQXlCVixDQUFDLEdBQUdRLE1BQU0sQ0FBQ0csTUFBcEM7QUFDQSxZQUFNOUIsQ0FBQyxHQUFHSixLQUFLLENBQUNJLENBQWhCO0FBQUEsWUFBbUJELENBQUMsR0FBR0gsS0FBSyxDQUFDRyxDQUE3Qjs7QUFDQSxZQUFNRCxHQUFHLEdBQUdKLFlBQUtJLEdBQUwsQ0FBU0UsQ0FBVCxFQUFZbUIsQ0FBWixDQUFaLENBSndCLENBS3hCOzs7QUFDQSxZQUFJckIsR0FBRyxHQUFHOEIsQ0FBTixHQUFVN0IsQ0FBZCxFQUFpQjtBQUFFLGlCQUFPLENBQVA7QUFBVyxTQUE5QixDQUErQjtBQUEvQixhQUNLLElBQUlELEdBQUcsR0FBRzhCLENBQU4sR0FBVTdCLENBQWQsRUFBaUI7QUFBRTtBQUFXLFdBUFgsQ0FReEI7QUFDQTs7O0FBQ0FMLG9CQUFLaUQsR0FBTCxDQUFTbEQsRUFBVCxFQUFhMEIsQ0FBYixFQUFnQnpCLFlBQUtXLGNBQUwsQ0FBb0JaLEVBQXBCLEVBQXdCTyxDQUF4QixFQUEyQjRCLENBQTNCLENBQWhCOztBQUNBLGFBQUssSUFBSStHLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsQ0FBcEIsRUFBdUJBLENBQUMsRUFBeEIsRUFBNEI7QUFDeEIsY0FBSUEsQ0FBQyxLQUFLN0QsQ0FBTixJQUFXNkQsQ0FBQyxLQUFLN0QsQ0FBQyxHQUFHOEssR0FBRyxDQUFDOUssQ0FBRCxDQUE1QixFQUFpQztBQUFFO0FBQVc7O0FBQzlDLGNBQU1tSSxJQUFJLEdBQUdJLE9BQU8sQ0FBQ0MsTUFBUixDQUFlM0UsQ0FBZixDQUFiOztBQUNBLGNBQUlqSixZQUFLSSxHQUFMLENBQVNtTixJQUFJLENBQUNqTixDQUFkLEVBQWlCUCxFQUFqQixJQUF1QndOLElBQUksQ0FBQ2xOLENBQWhDLEVBQW1DO0FBQUUsbUJBQU8sQ0FBUDtBQUFXO0FBQ25EO0FBQ0o7O0FBQ0QsYUFBTyxDQUFQO0FBQ0gsS0FuQkQ7QUFvQkgsR0F0QitCLEVBQWhDO0FBd0JBOzs7Ozs7Ozs7OztBQVNBLE1BQU04UCxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLENBQVVDLE9BQVYsRUFBMkJDLE9BQTNCLEVBQXFEO0FBQ3ZFLFFBQU1uTyxDQUFDLEdBQUdrTyxPQUFPLENBQUNqTyxNQUFSLEdBQWlCa08sT0FBTyxDQUFDbE8sTUFBbkM7QUFDQSxXQUFPbkMsWUFBS29QLGVBQUwsQ0FBcUJnQixPQUFPLENBQUNoTyxNQUE3QixFQUFxQ2lPLE9BQU8sQ0FBQ2pPLE1BQTdDLElBQXVERixDQUFDLEdBQUdBLENBQWxFO0FBQ0gsR0FIRDtBQUtBOzs7Ozs7Ozs7OztBQVNBLE1BQU1vTyxXQUFXLEdBQUksWUFBWTtBQUM3QixRQUFNdlEsRUFBRSxHQUFHLElBQUlDLFdBQUosRUFBWDtBQUNBLFdBQU8sVUFBVWlDLE1BQVYsRUFBMEJjLElBQTFCLEVBQStDO0FBQ2xEeUUsTUFBQUEsUUFBUSxDQUFDK0ksYUFBVCxDQUF1QnhRLEVBQXZCLEVBQTJCa0MsTUFBTSxDQUFDRyxNQUFsQyxFQUEwQ1csSUFBMUM7QUFDQSxhQUFPL0MsWUFBS29QLGVBQUwsQ0FBcUJuTixNQUFNLENBQUNHLE1BQTVCLEVBQW9DckMsRUFBcEMsSUFBMENrQyxNQUFNLENBQUNFLE1BQVAsR0FBZ0JGLE1BQU0sQ0FBQ0UsTUFBeEU7QUFDSCxLQUhEO0FBSUgsR0FObUIsRUFBcEI7QUFRQTs7Ozs7Ozs7Ozs7QUFTQSxNQUFNa04sVUFBVSxHQUFJLFlBQVk7QUFDNUIsUUFBTXRQLEVBQUUsR0FBRyxJQUFJQyxXQUFKLEVBQVg7QUFDQSxXQUFPLFVBQVVpQyxNQUFWLEVBQTBCdUMsR0FBMUIsRUFBNkM7QUFDaERnRCxNQUFBQSxRQUFRLENBQUNnSixZQUFULENBQXNCelEsRUFBdEIsRUFBMEJrQyxNQUFNLENBQUNHLE1BQWpDLEVBQXlDb0MsR0FBekM7QUFDQSxhQUFPeEUsWUFBS29QLGVBQUwsQ0FBcUJuTixNQUFNLENBQUNHLE1BQTVCLEVBQW9DckMsRUFBcEMsSUFBMENrQyxNQUFNLENBQUNFLE1BQVAsR0FBZ0JGLE1BQU0sQ0FBQ0UsTUFBeEU7QUFDSCxLQUhEO0FBSUgsR0FOa0IsRUFBbkI7QUFRQTs7Ozs7Ozs7QUFNQSxNQUFNc08sY0FBYyxHQUFJLFlBQVk7QUFDaEMsUUFBTW5MLElBQUksR0FBRyxJQUFJdEYsV0FBSixFQUFiO0FBQ0EsUUFBTXVGLElBQUksR0FBRyxJQUFJdkYsV0FBSixFQUFiO0FBQ0EsV0FBTyxVQUFVaUMsTUFBVixFQUEwQjZELE9BQTFCLEVBQTRDO0FBQy9DLFVBQU01RCxDQUFDLEdBQUdELE1BQU0sQ0FBQ0UsTUFBUCxHQUFnQjJELE9BQU8sQ0FBQzNELE1BQWxDO0FBQ0EsVUFBTXVPLFFBQVEsR0FBR3hPLENBQUMsR0FBR0EsQ0FBckI7O0FBQ0EsVUFBTWlOLENBQUMsR0FBR25QLFlBQUtvUCxlQUFMLENBQXFCdEosT0FBTyxDQUFDSyxjQUE3QixFQUE2Q0wsT0FBTyxDQUFDTyxjQUFyRCxDQUFWOztBQUNBLFVBQUk4SSxDQUFDLEtBQUssQ0FBVixFQUFhO0FBQ1QsZUFBT25QLFlBQUtvUCxlQUFMLENBQXFCbk4sTUFBTSxDQUFDRyxNQUE1QixFQUFvQzBELE9BQU8sQ0FBQzFELE1BQTVDLElBQXNEc08sUUFBN0Q7QUFDSCxPQUZELE1BRU87QUFDSDFRLG9CQUFLYSxRQUFMLENBQWN5RSxJQUFkLEVBQW9CckQsTUFBTSxDQUFDRyxNQUEzQixFQUFtQzBELE9BQU8sQ0FBQ0ssY0FBM0M7O0FBQ0FuRyxvQkFBS2EsUUFBTCxDQUFjMEUsSUFBZCxFQUFvQk8sT0FBTyxDQUFDTyxjQUE1QixFQUE0Q1AsT0FBTyxDQUFDSyxjQUFwRDs7QUFDQSxZQUFNdkYsQ0FBQyxHQUFHWixZQUFLSSxHQUFMLENBQVNrRixJQUFULEVBQWVDLElBQWYsSUFBdUI0SixDQUFqQzs7QUFDQSxZQUFJdk8sQ0FBQyxHQUFHLENBQVIsRUFBVztBQUNQLGlCQUFPWixZQUFLb1AsZUFBTCxDQUFxQm5OLE1BQU0sQ0FBQ0csTUFBNUIsRUFBb0MwRCxPQUFPLENBQUNLLGNBQTVDLElBQThEdUssUUFBckU7QUFDSCxTQUZELE1BRU8sSUFBSTlQLENBQUMsR0FBRyxDQUFSLEVBQVc7QUFDZCxpQkFBT1osWUFBS29QLGVBQUwsQ0FBcUJuTixNQUFNLENBQUNHLE1BQTVCLEVBQW9DMEQsT0FBTyxDQUFDTyxjQUE1QyxJQUE4RHFLLFFBQXJFO0FBQ0gsU0FGTSxNQUVBO0FBQ0gxUSxzQkFBS2lILFdBQUwsQ0FBaUIzQixJQUFqQixFQUF1QlEsT0FBTyxDQUFDSyxjQUEvQixFQUErQ1osSUFBL0MsRUFBcUQzRSxDQUFyRDs7QUFDQSxpQkFBT1osWUFBS29QLGVBQUwsQ0FBcUJuTixNQUFNLENBQUNHLE1BQTVCLEVBQW9Da0QsSUFBcEMsSUFBNENvTCxRQUFuRDtBQUNIO0FBQ0o7QUFDSixLQW5CRDtBQW9CSCxHQXZCc0IsRUFBdkIsQyxDQXlCQTs7QUFDQTs7Ozs7Ozs7QUFNQSxNQUFNQyxlQUFlLEdBQUksWUFBWTtBQUNqQyxRQUFNckwsSUFBSSxHQUFHLElBQUl0RixXQUFKLEVBQWI7QUFDQSxRQUFNdUYsSUFBSSxHQUFHLElBQUl2RixXQUFKLEVBQWI7QUFDQSxRQUFNd0YsSUFBSSxHQUFHLElBQUl4RixXQUFKLEVBQWI7QUFDQSxRQUFNeUYsSUFBSSxHQUFHLElBQUl6RixXQUFKLEVBQWI7QUFDQSxRQUFNMEYsSUFBSSxHQUFHLElBQUkxRixXQUFKLEVBQWI7QUFDQSxRQUFNMkYsSUFBSSxHQUFHLElBQUkzRixXQUFKLEVBQWI7QUFDQSxXQUFPLFNBQVMyUSxlQUFULENBQTBCQyxRQUExQixFQUE2Q0MsUUFBN0MsRUFBZ0U7QUFDbkUsVUFBTWhQLENBQUMsR0FBRzdCLFlBQUthLFFBQUwsQ0FBY3lFLElBQWQsRUFBb0JzTCxRQUFRLENBQUN2SyxjQUE3QixFQUE2Q3VLLFFBQVEsQ0FBQ3pLLGNBQXRELENBQVY7O0FBQ0EsVUFBTXJFLENBQUMsR0FBRzlCLFlBQUthLFFBQUwsQ0FBYzBFLElBQWQsRUFBb0JzTCxRQUFRLENBQUN4SyxjQUE3QixFQUE2Q3dLLFFBQVEsQ0FBQzFLLGNBQXRELENBQVY7O0FBQ0EsVUFBTTJGLENBQUMsR0FBRzlMLFlBQUthLFFBQUwsQ0FBYzJFLElBQWQsRUFBb0JvTCxRQUFRLENBQUN6SyxjQUE3QixFQUE2QzBLLFFBQVEsQ0FBQzFLLGNBQXRELENBQVY7O0FBQ0EsVUFBTTNFLENBQUMsR0FBR3hCLFlBQUtJLEdBQUwsQ0FBU3lCLENBQVQsRUFBWUEsQ0FBWixDQUFWLENBSm1FLENBSWpDOzs7QUFDbEMsVUFBTU4sQ0FBQyxHQUFHdkIsWUFBS0ksR0FBTCxDQUFTeUIsQ0FBVCxFQUFZQyxDQUFaLENBQVY7O0FBQ0EsVUFBTUwsQ0FBQyxHQUFHekIsWUFBS0ksR0FBTCxDQUFTMEIsQ0FBVCxFQUFZQSxDQUFaLENBQVYsQ0FObUUsQ0FNakM7OztBQUNsQyxVQUFNekIsQ0FBQyxHQUFHTCxZQUFLSSxHQUFMLENBQVN5QixDQUFULEVBQVlpSyxDQUFaLENBQVY7O0FBQ0EsVUFBTTlKLENBQUMsR0FBR2hDLFlBQUtJLEdBQUwsQ0FBUzBCLENBQVQsRUFBWWdLLENBQVosQ0FBVjs7QUFDQSxVQUFNZ0YsQ0FBQyxHQUFHdFAsQ0FBQyxHQUFHQyxDQUFKLEdBQVFGLENBQUMsR0FBR0EsQ0FBdEIsQ0FUbUUsQ0FTbkM7O0FBQ2hDLFVBQUl3UCxFQUFKO0FBQ0EsVUFBSUMsRUFBSjtBQUNBLFVBQUlDLEVBQUUsR0FBR0gsQ0FBVCxDQVptRSxDQVlqRDs7QUFDbEIsVUFBSUksRUFBSjtBQUNBLFVBQUlDLEVBQUo7QUFDQSxVQUFJQyxFQUFFLEdBQUdOLENBQVQsQ0FmbUUsQ0FlakQ7QUFFbEI7O0FBQ0EsVUFBSUEsQ0FBQyxHQUFHcFEsY0FBUixFQUFpQjtBQUFFO0FBQ2ZzUSxRQUFBQSxFQUFFLEdBQUcsR0FBTCxDQURhLENBQ0s7O0FBQ2xCQyxRQUFBQSxFQUFFLEdBQUcsR0FBTCxDQUZhLENBRUs7O0FBQ2xCRSxRQUFBQSxFQUFFLEdBQUduUCxDQUFMO0FBQ0FvUCxRQUFBQSxFQUFFLEdBQUczUCxDQUFMO0FBQ0gsT0FMRCxNQU1LO0FBQWtCO0FBQ25CdVAsUUFBQUEsRUFBRSxHQUFJelAsQ0FBQyxHQUFHUyxDQUFKLEdBQVFQLENBQUMsR0FBR3BCLENBQWxCO0FBQ0E4USxRQUFBQSxFQUFFLEdBQUkzUCxDQUFDLEdBQUdRLENBQUosR0FBUVQsQ0FBQyxHQUFHbEIsQ0FBbEI7O0FBQ0EsWUFBSTJRLEVBQUUsR0FBRyxHQUFULEVBQWM7QUFBUztBQUNuQkEsVUFBQUEsRUFBRSxHQUFHLEdBQUw7QUFDQUcsVUFBQUEsRUFBRSxHQUFHblAsQ0FBTDtBQUNBb1AsVUFBQUEsRUFBRSxHQUFHM1AsQ0FBTDtBQUNILFNBSkQsTUFLSyxJQUFJdVAsRUFBRSxHQUFHQyxFQUFULEVBQWE7QUFBRztBQUNqQkQsVUFBQUEsRUFBRSxHQUFHQyxFQUFMO0FBQ0FFLFVBQUFBLEVBQUUsR0FBR25QLENBQUMsR0FBR1QsQ0FBVDtBQUNBNlAsVUFBQUEsRUFBRSxHQUFHM1AsQ0FBTDtBQUNIO0FBQ0o7O0FBRUQsVUFBSTBQLEVBQUUsR0FBRyxHQUFULEVBQWM7QUFBYTtBQUN2QkEsUUFBQUEsRUFBRSxHQUFHLEdBQUwsQ0FEVSxDQUVWOztBQUNBLFlBQUksQ0FBQzlRLENBQUQsR0FBSyxHQUFULEVBQWM7QUFDVjJRLFVBQUFBLEVBQUUsR0FBRyxHQUFMO0FBQ0gsU0FGRCxNQUdLLElBQUksQ0FBQzNRLENBQUQsR0FBS21CLENBQVQsRUFBWTtBQUNid1AsVUFBQUEsRUFBRSxHQUFHQyxFQUFMO0FBQ0gsU0FGSSxNQUdBO0FBQ0RELFVBQUFBLEVBQUUsR0FBRyxDQUFDM1EsQ0FBTjtBQUNBNFEsVUFBQUEsRUFBRSxHQUFHelAsQ0FBTDtBQUNIO0FBQ0osT0FiRCxNQWNLLElBQUkyUCxFQUFFLEdBQUdDLEVBQVQsRUFBYTtBQUFPO0FBQ3JCRCxRQUFBQSxFQUFFLEdBQUdDLEVBQUwsQ0FEYyxDQUVkOztBQUNBLFlBQUssQ0FBQy9RLENBQUQsR0FBS2tCLENBQU4sR0FBVyxHQUFmLEVBQW9CO0FBQ2hCeVAsVUFBQUEsRUFBRSxHQUFHLENBQUw7QUFDSCxTQUZELE1BR0ssSUFBSyxDQUFDM1EsQ0FBRCxHQUFLa0IsQ0FBTixHQUFXQyxDQUFmLEVBQWtCO0FBQ25Cd1AsVUFBQUEsRUFBRSxHQUFHQyxFQUFMO0FBQ0gsU0FGSSxNQUdBO0FBQ0RELFVBQUFBLEVBQUUsR0FBSSxDQUFDM1EsQ0FBRCxHQUFLa0IsQ0FBWDtBQUNBMFAsVUFBQUEsRUFBRSxHQUFHelAsQ0FBTDtBQUNIO0FBQ0osT0FsRWtFLENBbUVuRTs7O0FBQ0F1UCxNQUFBQSxFQUFFLEdBQUl4USxJQUFJLENBQUNDLEdBQUwsQ0FBU3dRLEVBQVQsSUFBZXRRLGNBQWYsR0FBeUIsR0FBekIsR0FBK0JzUSxFQUFFLEdBQUdDLEVBQTFDO0FBQ0FDLE1BQUFBLEVBQUUsR0FBSTNRLElBQUksQ0FBQ0MsR0FBTCxDQUFTMlEsRUFBVCxJQUFlelEsY0FBZixHQUF5QixHQUF6QixHQUErQnlRLEVBQUUsR0FBR0MsRUFBMUMsQ0FyRW1FLENBdUVuRTs7QUFDQSxVQUFNQyxFQUFFLEdBQUc1TCxJQUFYO0FBQ0E0TCxNQUFBQSxFQUFFLENBQUM1TSxHQUFILENBQU9xSCxDQUFQO0FBQ0F1RixNQUFBQSxFQUFFLENBQUNwTyxHQUFILENBQU9qRCxZQUFLVyxjQUFMLENBQW9CK0UsSUFBcEIsRUFBMEI3RCxDQUExQixFQUE2QmtQLEVBQTdCLENBQVA7QUFDQU0sTUFBQUEsRUFBRSxDQUFDeFEsUUFBSCxDQUFZYixZQUFLVyxjQUFMLENBQW9CZ0YsSUFBcEIsRUFBMEI3RCxDQUExQixFQUE2Qm9QLEVBQTdCLENBQVo7QUFDQSxVQUFNL08sTUFBTSxHQUFHeU8sUUFBUSxDQUFDek8sTUFBVCxHQUFrQjBPLFFBQVEsQ0FBQzFPLE1BQTFDO0FBQ0EsYUFBT2tQLEVBQUUsQ0FBQzlPLFNBQUgsS0FBaUJKLE1BQU0sR0FBR0EsTUFBakM7QUFDSCxLQTlFRDtBQStFSCxHQXRGdUIsRUFBeEI7QUF3RkE7Ozs7Ozs7O0FBTUEsTUFBTXNFLFNBQVMsR0FBRztBQUNkMUUsSUFBQUEsVUFBVSxFQUFWQSxVQURjO0FBRWRhLElBQUFBLFFBQVEsRUFBUkEsUUFGYztBQUdkcUIsSUFBQUEsT0FBTyxFQUFQQSxPQUhjO0FBSWRuRSxJQUFBQSxTQUFTLEVBQVRBLFNBSmM7QUFLZGlCLElBQUFBLFlBQVksRUFBWkEsWUFMYztBQU1kc0UsSUFBQUEsV0FBVyxFQUFYQSxXQU5jO0FBUWQrQixJQUFBQSxXQUFXLEVBQVhBLFdBUmM7QUFTZDJDLElBQUFBLFFBQVEsRUFBUkEsUUFUYztBQVVkUyxJQUFBQSxTQUFTLEVBQVRBLFNBVmM7QUFZZDRCLElBQUFBLFdBQVcsRUFBWEEsV0FaYztBQWFkSCxJQUFBQSxTQUFTLEVBQVRBLFNBYmM7QUFjZEUsSUFBQUEsUUFBUSxFQUFSQSxRQWRjO0FBZWRaLElBQUFBLFVBQVUsRUFBVkEsVUFmYztBQWdCZEcsSUFBQUEsYUFBYSxFQUFiQSxhQWhCYztBQWtCZHlFLElBQUFBLGFBQWEsRUFBYkEsYUFsQmM7QUFtQmRHLElBQUFBLFdBQVcsRUFBWEEsV0FuQmM7QUFvQmRqQixJQUFBQSxVQUFVLEVBQVZBLFVBcEJjO0FBcUJkVSxJQUFBQSxZQUFZLEVBQVpBLFlBckJjO0FBc0JkQyxJQUFBQSxjQUFjLEVBQWRBLGNBdEJjO0FBdUJkQyxJQUFBQSx1QkFBdUIsRUFBdkJBLHVCQXZCYztBQXdCZFEsSUFBQUEsY0FBYyxFQUFkQSxjQXhCYztBQTBCZHBFLElBQUFBLFNBQVMsRUFBVEEsU0ExQmM7QUEyQmRpQixJQUFBQSxRQUFRLEVBQVJBLFFBM0JjO0FBNEJkRyxJQUFBQSxVQUFVLEVBQVZBLFVBNUJjO0FBNkJkQyxJQUFBQSxZQUFZLEVBQVpBLFlBN0JjO0FBOEJkRyxJQUFBQSxxQkFBcUIsRUFBckJBLHFCQTlCYztBQWdDZGdCLElBQUFBLE9BQU8sRUFBUEEsT0FoQ2M7QUFpQ2RKLElBQUFBLFNBQVMsRUFBVEEsU0FqQ2M7QUFrQ2RFLElBQUFBLFdBQVcsRUFBWEEsV0FsQ2M7QUFtQ2RDLElBQUFBLG9CQUFvQixFQUFwQkEsb0JBbkNjO0FBb0NkVixJQUFBQSxTQUFTLEVBQVRBLFNBcENjO0FBcUNkYyxJQUFBQSxXQUFXLEVBQVhBLFdBckNjO0FBdUNkMkIsSUFBQUEsZUFBZSxFQUFmQSxlQXZDYzs7QUF5Q2Q7Ozs7Ozs7QUFPQVcsSUFBQUEsT0FoRGMsbUJBZ0RMQyxFQWhESyxFQWdESUMsRUFoREosRUFnRDJCO0FBQUEsVUFBZDNGLEtBQWMsdUVBQU4sSUFBTTtBQUNyQyxVQUFNNEYsS0FBSyxHQUFHRixFQUFFLENBQUNHLEtBQWpCO0FBQUEsVUFBd0JDLEtBQUssR0FBR0gsRUFBRSxDQUFDRSxLQUFuQztBQUNBLFVBQU1FLFFBQVEsR0FBRyxLQUFLSCxLQUFLLEdBQUdFLEtBQWIsQ0FBakI7O0FBQ0EsVUFBSUYsS0FBSyxHQUFHRSxLQUFaLEVBQW1CO0FBQUUsZUFBT0MsUUFBUSxDQUFDTCxFQUFELEVBQUtDLEVBQUwsRUFBUzNGLEtBQVQsQ0FBZjtBQUFpQyxPQUF0RCxNQUNLO0FBQUUsZUFBTytGLFFBQVEsQ0FBQ0osRUFBRCxFQUFLRCxFQUFMLEVBQVMxRixLQUFULENBQWY7QUFBaUM7QUFDM0M7QUFyRGEsR0FBbEI7QUF3REFwRixFQUFBQSxTQUFTLENBQUNvTCxlQUFNQyxTQUFOLEdBQWtCRCxlQUFNRSxZQUF6QixDQUFULEdBQWtEaFEsVUFBbEQ7QUFDQTBFLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1DLFNBQU4sR0FBa0JELGVBQU1HLFVBQXpCLENBQVQsR0FBZ0RwUCxRQUFoRDtBQUNBNkQsRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUMsU0FBTixHQUFrQkQsZUFBTUksU0FBekIsQ0FBVCxHQUErQ2hPLE9BQS9DO0FBQ0F3QyxFQUFBQSxTQUFTLENBQUNvTCxlQUFNQyxTQUFOLEdBQWtCRCxlQUFNSyxXQUF6QixDQUFULEdBQWlEcFMsU0FBakQ7QUFDQTJHLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1DLFNBQU4sR0FBa0JELGVBQU1NLGNBQXpCLENBQVQsR0FBb0RwUixZQUFwRDtBQUNBMEYsRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUMsU0FBTixHQUFrQkQsZUFBTU8sYUFBekIsQ0FBVCxHQUFtRC9NLFdBQW5EO0FBRUFvQixFQUFBQSxTQUFTLENBQUNvTCxlQUFNUSxVQUFOLEdBQW1CUixlQUFNRSxZQUExQixDQUFULEdBQW1EM0YsV0FBbkQ7QUFDQTNGLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1RLFVBQU4sR0FBbUJSLGVBQU1HLFVBQTFCLENBQVQsR0FBaUQvRixTQUFqRDtBQUNBeEYsRUFBQUEsU0FBUyxDQUFDb0wsZUFBTVEsVUFBTixHQUFtQlIsZUFBTUksU0FBMUIsQ0FBVCxHQUFnRDlGLFFBQWhEO0FBQ0ExRixFQUFBQSxTQUFTLENBQUNvTCxlQUFNUSxVQUFOLEdBQW1CUixlQUFNSyxXQUExQixDQUFULEdBQWtEM0csVUFBbEQ7QUFDQTlFLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1RLFVBQU4sR0FBbUJSLGVBQU1NLGNBQTFCLENBQVQsR0FBcUR6RyxhQUFyRDtBQUVBakYsRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUUsWUFBUCxDQUFULEdBQWdDNUIsYUFBaEM7QUFDQTFKLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1FLFlBQU4sR0FBcUJGLGVBQU1HLFVBQTVCLENBQVQsR0FBbUQxQixXQUFuRDtBQUNBN0osRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUUsWUFBTixHQUFxQkYsZUFBTUksU0FBNUIsQ0FBVCxHQUFrRDVDLFVBQWxEO0FBQ0E1SSxFQUFBQSxTQUFTLENBQUNvTCxlQUFNRSxZQUFOLEdBQXFCRixlQUFNSyxXQUE1QixDQUFULEdBQW9EbkMsWUFBcEQ7QUFDQXRKLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1FLFlBQU4sR0FBcUJGLGVBQU1TLGFBQTVCLENBQVQsR0FBc0R0QyxjQUF0RDtBQUNBdkosRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUUsWUFBTixHQUFxQkYsZUFBTVUsc0JBQTVCLENBQVQsR0FBK0R0Qyx1QkFBL0Q7QUFDQXhKLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1FLFlBQU4sR0FBcUJGLGVBQU1PLGFBQTVCLENBQVQsR0FBc0QzQixjQUF0RDtBQUVBaEssRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUcsVUFBUCxDQUFULEdBQThCM0YsU0FBOUI7QUFDQTVGLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1HLFVBQU4sR0FBbUJILGVBQU1JLFNBQTFCLENBQVQsR0FBZ0QzRSxRQUFoRDtBQUNBN0csRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUcsVUFBTixHQUFtQkgsZUFBTUssV0FBMUIsQ0FBVCxHQUFrRHpFLFVBQWxEO0FBQ0FoSCxFQUFBQSxTQUFTLENBQUNvTCxlQUFNRyxVQUFOLEdBQW1CSCxlQUFNUyxhQUExQixDQUFULEdBQW9ENUUsWUFBcEQ7QUFDQWpILEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1HLFVBQU4sR0FBbUJILGVBQU1VLHNCQUExQixDQUFULEdBQTZEMUUscUJBQTdEO0FBRUFwSCxFQUFBQSxTQUFTLENBQUNvTCxlQUFNSSxTQUFQLENBQVQsR0FBNkJwRCxPQUE3QjtBQUNBcEksRUFBQUEsU0FBUyxDQUFDb0wsZUFBTUksU0FBTixHQUFrQkosZUFBTUssV0FBekIsQ0FBVCxHQUFpRHpELFNBQWpEO0FBQ0FoSSxFQUFBQSxTQUFTLENBQUNvTCxlQUFNSSxTQUFOLEdBQWtCSixlQUFNUyxhQUF6QixDQUFULEdBQW1EM0QsV0FBbkQ7QUFDQWxJLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1JLFNBQU4sR0FBa0JKLGVBQU1VLHNCQUF6QixDQUFULEdBQTREM0Qsb0JBQTVEO0FBQ0FuSSxFQUFBQSxTQUFTLENBQUNvTCxlQUFNSSxTQUFOLEdBQWtCSixlQUFNTyxhQUF6QixDQUFULEdBQW1EcEQsV0FBbkQ7QUFFQXZJLEVBQUFBLFNBQVMsQ0FBQ29MLGVBQU1PLGFBQVAsQ0FBVCxHQUFpQ3pCLGVBQWpDO2lCQUVlbEssUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiDlh6DkvZXlt6XlhbfmqKHlnZdcclxuICogQGNhdGVnb3J5IGdlb21ldHJ5XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgRVBTSUxPTiwgTWF0MywgVmVjMywgTWF0NCB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgYWFiYiBmcm9tICcuL2FhYmInO1xyXG5pbXBvcnQgeyBjYXBzdWxlIH0gZnJvbSAnLi9jYXBzdWxlJztcclxuaW1wb3J0ICogYXMgZGlzdGFuY2UgZnJvbSAnLi9kaXN0YW5jZSc7XHJcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcclxuaW1wb3J0IHsgZnJ1c3R1bSB9IGZyb20gJy4vZnJ1c3R1bSc7XHJcbmltcG9ydCBsaW5lIGZyb20gJy4vbGluZSc7XHJcbmltcG9ydCBvYmIgZnJvbSAnLi9vYmInO1xyXG5pbXBvcnQgcGxhbmUgZnJvbSAnLi9wbGFuZSc7XHJcbmltcG9ydCByYXkgZnJvbSAnLi9yYXknO1xyXG5pbXBvcnQgc3BoZXJlIGZyb20gJy4vc3BoZXJlJztcclxuaW1wb3J0IHRyaWFuZ2xlIGZyb20gJy4vdHJpYW5nbGUnO1xyXG5pbXBvcnQgeyBHRlhQcmltaXRpdmVNb2RlIH0gZnJvbSAnLi4vZ2Z4JztcclxuaW1wb3J0IHsgSUJBcnJheSwgUmVuZGVyaW5nU3ViTWVzaCwgTWVzaCB9IGZyb20gJy4uL2Fzc2V0cy9tZXNoJztcclxuaW1wb3J0IHsgSVJheVN1Yk1lc2hPcHRpb25zLCBFUmF5Y2FzdE1vZGUsIElSYXlTdWJNZXNoUmVzdWx0LCBJUmF5TWVzaE9wdGlvbnMsIElSYXlNb2RlbE9wdGlvbnMgfSBmcm9tICcuL3NwZWMnO1xyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tICcuLi9tYXRoL3R5cGUtZGVmaW5lJztcclxuaW1wb3J0IHsgc2NlbmUgfSBmcm9tICcuLi9yZW5kZXJlcic7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmx5LWFycm93LWZ1bmN0aW9uc1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmUtdmFyaWFibGUtcGVyLWRlY2xhcmF0aW9uXHJcbi8vIHRzbGludDpkaXNhYmxlOnByZWZlci1mb3Itb2ZcclxuLy8gdHNsaW50OmRpc2FibGU6bm8tc2hhZG93ZWQtdmFyaWFibGVcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LXBsYW5lIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDlsITnur/kuI7lubPpnaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheSDlsITnur9cclxuICogQHBhcmFtIHtwbGFuZX0gcGxhbmUg5bmz6Z2iXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3QgcmF5X3BsYW5lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcclxuICAgICAgICBjb25zdCBkZW5vbSA9IFZlYzMuZG90KHJheS5kLCBwbGFuZS5uKTtcclxuICAgICAgICBpZiAoTWF0aC5hYnMoZGVub20pIDwgTnVtYmVyLkVQU0lMT04pIHsgcmV0dXJuIDA7IH1cclxuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKHB0LCBwbGFuZS5uLCBwbGFuZS5kKTtcclxuICAgICAgICBjb25zdCB0ID0gVmVjMy5kb3QoVmVjMy5zdWJ0cmFjdChwdCwgcHQsIHJheS5vKSwgcGxhbmUubikgLyBkZW5vbTtcclxuICAgICAgICBpZiAodCA8IDApIHsgcmV0dXJuIDA7IH1cclxuICAgICAgICByZXR1cm4gdDtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vLyBiYXNlZCBvbiBodHRwOi8vZmlsZWFkbWluLmNzLmx0aC5zZS9jcy9QZXJzb25hbC9Ub21hc19Ba2VuaW5lLU1vbGxlci9yYXl0cmkvXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LXRyaWFuZ2xlIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDlsITnur/kuI7kuInop5LlvaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheSDlsITnur9cclxuICogQHBhcmFtIHt0cmlhbmdsZX0gdHJpYW5nbGUg5LiJ6KeS5b2iXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gZG91YmxlU2lkZWQg5LiJ6KeS5b2i5piv5ZCm5Li65Y+M6Z2iXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3QgcmF5X3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGFiID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICBjb25zdCBhYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgY29uc3QgcHZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgY29uc3QgdHZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgY29uc3QgcXZlYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIHRyaWFuZ2xlOiB0cmlhbmdsZSwgZG91YmxlU2lkZWQ/OiBib29sZWFuKSB7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYiwgdHJpYW5nbGUuYiwgdHJpYW5nbGUuYSk7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XHJcblxyXG4gICAgICAgIFZlYzMuY3Jvc3MocHZlYywgcmF5LmQsIGFjKTtcclxuICAgICAgICBjb25zdCBkZXQgPSBWZWMzLmRvdChhYiwgcHZlYyk7XHJcbiAgICAgICAgaWYgKGRldCA8IE51bWJlci5FUFNJTE9OICYmICghZG91YmxlU2lkZWQgfHwgZGV0ID4gLU51bWJlci5FUFNJTE9OKSkgeyByZXR1cm4gMDsgfVxyXG5cclxuICAgICAgICBjb25zdCBpbnZfZGV0ID0gMSAvIGRldDtcclxuXHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh0dmVjLCByYXkubywgdHJpYW5nbGUuYSk7XHJcbiAgICAgICAgY29uc3QgdSA9IFZlYzMuZG90KHR2ZWMsIHB2ZWMpICogaW52X2RldDtcclxuICAgICAgICBpZiAodSA8IDAgfHwgdSA+IDEpIHsgcmV0dXJuIDA7IH1cclxuXHJcbiAgICAgICAgVmVjMy5jcm9zcyhxdmVjLCB0dmVjLCBhYik7XHJcbiAgICAgICAgY29uc3QgdiA9IFZlYzMuZG90KHJheS5kLCBxdmVjKSAqIGludl9kZXQ7XHJcbiAgICAgICAgaWYgKHYgPCAwIHx8IHUgKyB2ID4gMSkgeyByZXR1cm4gMDsgfVxyXG5cclxuICAgICAgICBjb25zdCB0ID0gVmVjMy5kb3QoYWMsIHF2ZWMpICogaW52X2RldDtcclxuICAgICAgICByZXR1cm4gdCA8IDAgPyAwIDogdDtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIHJheS1zcGhlcmUgaW50ZXJzZWN0IGRldGVjdC5cclxuICogQHpoXHJcbiAqIOWwhOe6v+WSjOeQg+eahOebuOS6pOaAp+ajgOa1i+OAglxyXG4gKiBAcGFyYW0ge3JheX0gcmF5IOWwhOe6v1xyXG4gKiBAcGFyYW0ge3NwaGVyZX0gc3BoZXJlIOeQg1xyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmNvbnN0IHJheV9zcGhlcmUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgZSA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgc3BoZXJlOiBzcGhlcmUpOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzO1xyXG4gICAgICAgIGNvbnN0IGMgPSBzcGhlcmUuY2VudGVyO1xyXG4gICAgICAgIGNvbnN0IG8gPSByYXkubztcclxuICAgICAgICBjb25zdCBkID0gcmF5LmQ7XHJcbiAgICAgICAgY29uc3QgclNxID0gciAqIHI7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChlLCBjLCBvKTtcclxuICAgICAgICBjb25zdCBlU3EgPSBlLmxlbmd0aFNxcigpO1xyXG5cclxuICAgICAgICBjb25zdCBhTGVuZ3RoID0gVmVjMy5kb3QoZSwgZCk7IC8vIGFzc3VtZSByYXkgZGlyZWN0aW9uIGFscmVhZHkgbm9ybWFsaXplZFxyXG4gICAgICAgIGNvbnN0IGZTcSA9IHJTcSAtIChlU3EgLSBhTGVuZ3RoICogYUxlbmd0aCk7XHJcbiAgICAgICAgaWYgKGZTcSA8IDApIHsgcmV0dXJuIDA7IH1cclxuXHJcbiAgICAgICAgY29uc3QgZiA9IE1hdGguc3FydChmU3EpO1xyXG4gICAgICAgIGNvbnN0IHQgPSBlU3EgPCByU3EgPyBhTGVuZ3RoICsgZiA6IGFMZW5ndGggLSBmO1xyXG4gICAgICAgIGlmICh0IDwgMCkgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LWFhYmIgaW50ZXJzZWN0IGRldGVjdC5cclxuICogQHpoXHJcbiAqIOWwhOe6v+WSjOi9tOWvuem9kOWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxyXG4gKiBAcGFyYW0ge3JheX0gcmF5IOWwhOe6v1xyXG4gKiBAcGFyYW0ge2FhYmJ9IGFhYmIg6L205a+56b2Q5YyF5Zu055uSXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3QgcmF5X2FhYmIgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgbWluID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IG1heCA9IG5ldyBWZWMzKCk7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCBhYWJiOiBhYWJiKTogbnVtYmVyIHtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pbiwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIFZlYzMuYWRkKG1heCwgYWFiYi5jZW50ZXIsIGFhYmIuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIHJldHVybiByYXlfYWFiYjIocmF5LCBtaW4sIG1heCk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gcmF5X2FhYmIyIChyYXk6IHJheSwgbWluOiBJVmVjM0xpa2UsIG1heDogSVZlYzNMaWtlKSB7XHJcbiAgICBjb25zdCBvID0gcmF5Lm8sIGQgPSByYXkuZDtcclxuICAgIGNvbnN0IGl4ID0gMSAvIGQueCwgaXkgPSAxIC8gZC55LCBpeiA9IDEgLyBkLno7XHJcbiAgICBjb25zdCB0MSA9IChtaW4ueCAtIG8ueCkgKiBpeDtcclxuICAgIGNvbnN0IHQyID0gKG1heC54IC0gby54KSAqIGl4O1xyXG4gICAgY29uc3QgdDMgPSAobWluLnkgLSBvLnkpICogaXk7XHJcbiAgICBjb25zdCB0NCA9IChtYXgueSAtIG8ueSkgKiBpeTtcclxuICAgIGNvbnN0IHQ1ID0gKG1pbi56IC0gby56KSAqIGl6O1xyXG4gICAgY29uc3QgdDYgPSAobWF4LnogLSBvLnopICogaXo7XHJcbiAgICBjb25zdCB0bWluID0gTWF0aC5tYXgoTWF0aC5tYXgoTWF0aC5taW4odDEsIHQyKSwgTWF0aC5taW4odDMsIHQ0KSksIE1hdGgubWluKHQ1LCB0NikpO1xyXG4gICAgY29uc3QgdG1heCA9IE1hdGgubWluKE1hdGgubWluKE1hdGgubWF4KHQxLCB0MiksIE1hdGgubWF4KHQzLCB0NCkpLCBNYXRoLm1heCh0NSwgdDYpKTtcclxuICAgIGlmICh0bWF4IDwgMCB8fCB0bWluID4gdG1heCkgeyByZXR1cm4gMDsgfVxyXG4gICAgcmV0dXJuIHRtaW4gPiAwID8gdG1pbiA6IHRtYXg7IC8vIHJheSBvcmlnaW4gaW5zaWRlIGFhYmJcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiByYXktb2JiIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDlsITnur/lkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheSDlsITnur9cclxuICogQHBhcmFtIHtvYmJ9IG9iYiDmlrnlkJHljIXlm7Tnm5JcclxuICogQHJldHVybiB7bnVtYmVyfSAwIOaIliDpnZ4wXHJcbiAqL1xyXG5jb25zdCByYXlfb2JiID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBjZW50ZXIgPSBuZXcgVmVjMygpO1xyXG4gICAgbGV0IG8gPSBuZXcgVmVjMygpO1xyXG4gICAgbGV0IGQgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgWCA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCBZID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IFogPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgcCA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCBzaXplID0gbmV3IEFycmF5KDMpO1xyXG4gICAgY29uc3QgZiA9IG5ldyBBcnJheSgzKTtcclxuICAgIGNvbnN0IGUgPSBuZXcgQXJyYXkoMyk7XHJcbiAgICBjb25zdCB0ID0gbmV3IEFycmF5KDYpO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAocmF5OiByYXksIG9iYjogb2JiKTogbnVtYmVyIHtcclxuICAgICAgICBzaXplWzBdID0gb2JiLmhhbGZFeHRlbnRzLng7XHJcbiAgICAgICAgc2l6ZVsxXSA9IG9iYi5oYWxmRXh0ZW50cy55O1xyXG4gICAgICAgIHNpemVbMl0gPSBvYmIuaGFsZkV4dGVudHMuejtcclxuICAgICAgICBjZW50ZXIgPSBvYmIuY2VudGVyO1xyXG4gICAgICAgIG8gPSByYXkubztcclxuICAgICAgICBkID0gcmF5LmQ7XHJcblxyXG4gICAgICAgIFZlYzMuc2V0KFgsIG9iYi5vcmllbnRhdGlvbi5tMDAsIG9iYi5vcmllbnRhdGlvbi5tMDEsIG9iYi5vcmllbnRhdGlvbi5tMDIpO1xyXG4gICAgICAgIFZlYzMuc2V0KFksIG9iYi5vcmllbnRhdGlvbi5tMDMsIG9iYi5vcmllbnRhdGlvbi5tMDQsIG9iYi5vcmllbnRhdGlvbi5tMDUpO1xyXG4gICAgICAgIFZlYzMuc2V0KFosIG9iYi5vcmllbnRhdGlvbi5tMDYsIG9iYi5vcmllbnRhdGlvbi5tMDcsIG9iYi5vcmllbnRhdGlvbi5tMDgpO1xyXG4gICAgICAgIFZlYzMuc3VidHJhY3QocCwgY2VudGVyLCBvKTtcclxuXHJcbiAgICAgICAgLy8gVGhlIGNvcyB2YWx1ZXMgb2YgdGhlIHJheSBvbiB0aGUgWCwgWSwgWlxyXG4gICAgICAgIGZbMF0gPSBWZWMzLmRvdChYLCBkKTtcclxuICAgICAgICBmWzFdID0gVmVjMy5kb3QoWSwgZCk7XHJcbiAgICAgICAgZlsyXSA9IFZlYzMuZG90KFosIGQpO1xyXG5cclxuICAgICAgICAvLyBUaGUgcHJvamVjdGlvbiBsZW5ndGggb2YgUCBvbiBYLCBZLCBaXHJcbiAgICAgICAgZVswXSA9IFZlYzMuZG90KFgsIHApO1xyXG4gICAgICAgIGVbMV0gPSBWZWMzLmRvdChZLCBwKTtcclxuICAgICAgICBlWzJdID0gVmVjMy5kb3QoWiwgcCk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgKytpKSB7XHJcbiAgICAgICAgICAgIGlmIChmW2ldID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoLWVbaV0gLSBzaXplW2ldID4gMCB8fCAtZVtpXSArIHNpemVbaV0gPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBBdm9pZCBkaXYgYnkgMCFcclxuICAgICAgICAgICAgICAgIGZbaV0gPSAwLjAwMDAwMDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gbWluXHJcbiAgICAgICAgICAgIHRbaSAqIDIgKyAwXSA9IChlW2ldICsgc2l6ZVtpXSkgLyBmW2ldO1xyXG4gICAgICAgICAgICAvLyBtYXhcclxuICAgICAgICAgICAgdFtpICogMiArIDFdID0gKGVbaV0gLSBzaXplW2ldKSAvIGZbaV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHRtaW4gPSBNYXRoLm1heChcclxuICAgICAgICAgICAgTWF0aC5tYXgoXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1pbih0WzBdLCB0WzFdKSxcclxuICAgICAgICAgICAgICAgIE1hdGgubWluKHRbMl0sIHRbM10pKSxcclxuICAgICAgICAgICAgTWF0aC5taW4odFs0XSwgdFs1XSksXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCB0bWF4ID0gTWF0aC5taW4oXHJcbiAgICAgICAgICAgIE1hdGgubWluKFxyXG4gICAgICAgICAgICAgICAgTWF0aC5tYXgodFswXSwgdFsxXSksXHJcbiAgICAgICAgICAgICAgICBNYXRoLm1heCh0WzJdLCB0WzNdKSksXHJcbiAgICAgICAgICAgIE1hdGgubWF4KHRbNF0sIHRbNV0pLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaWYgKHRtYXggPCAwIHx8IHRtaW4gPiB0bWF4KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRtaW4gPiAwID8gdG1pbiA6IHRtYXg7IC8vIHJheSBvcmlnaW4gaW5zaWRlIGFhYmJcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIHJheS1jYXBzdWxlIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDlsITnur/lkozog7blm4rkvZPnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheSDlsITnur9cclxuICogQHBhcmFtIHtjYXBzdWxlfSBjYXBzdWxlIOiDtuWbiuS9k1xyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmNvbnN0IHJheV9jYXBzdWxlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHYzXzAgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgdjNfMSA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCB2M18yID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzMgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgdjNfNCA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCB2M181ID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzYgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3Qgc3BoZXJlXzAgPSBuZXcgc3BoZXJlKCk7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCBjYXBzdWxlOiBjYXBzdWxlKSB7XHJcbiAgICAgICAgY29uc3QgcmFkaXVzU3FyID0gY2Fwc3VsZS5yYWRpdXMgKiBjYXBzdWxlLnJhZGl1cztcclxuICAgICAgICBjb25zdCB2UmF5Tm9ybSA9IFZlYzMubm9ybWFsaXplKHYzXzAsIHJheS5kKTtcclxuICAgICAgICBjb25zdCBBID0gY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMDtcclxuICAgICAgICBjb25zdCBCID0gY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMTtcclxuICAgICAgICBjb25zdCBCQSA9IFZlYzMuc3VidHJhY3QodjNfMSwgQiwgQSk7XHJcbiAgICAgICAgaWYgKEJBLmVxdWFscyhWZWMzLlpFUk8pKSB7XHJcbiAgICAgICAgICAgIHNwaGVyZV8wLnJhZGl1cyA9IGNhcHN1bGUucmFkaXVzO1xyXG4gICAgICAgICAgICBzcGhlcmVfMC5jZW50ZXIuc2V0KGNhcHN1bGUuZWxsaXBzZUNlbnRlcjApO1xyXG4gICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0LnJheV9zcGhlcmUocmF5LCBzcGhlcmVfMCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBPID0gcmF5Lm87XHJcbiAgICAgICAgY29uc3QgT0EgPSBWZWMzLnN1YnRyYWN0KHYzXzIsIE8sIEEpO1xyXG4gICAgICAgIGNvbnN0IFZ4QkEgPSBWZWMzLmNyb3NzKHYzXzMsIHZSYXlOb3JtLCBCQSk7XHJcbiAgICAgICAgY29uc3QgYSA9IFZ4QkEubGVuZ3RoU3FyKCk7XHJcbiAgICAgICAgaWYgKGEgPT09IDApIHtcclxuICAgICAgICAgICAgc3BoZXJlXzAucmFkaXVzID0gY2Fwc3VsZS5yYWRpdXM7XHJcbiAgICAgICAgICAgIGNvbnN0IEJPID0gVmVjMy5zdWJ0cmFjdCh2M180LCBCLCBPKTtcclxuICAgICAgICAgICAgaWYgKE9BLmxlbmd0aFNxcigpIDwgQk8ubGVuZ3RoU3FyKCkpIHtcclxuICAgICAgICAgICAgICAgIHNwaGVyZV8wLmNlbnRlci5zZXQoY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGhlcmVfMC5jZW50ZXIuc2V0KGNhcHN1bGUuZWxsaXBzZUNlbnRlcjEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3QucmF5X3NwaGVyZShyYXksIHNwaGVyZV8wKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IE9BeEJBID0gVmVjMy5jcm9zcyh2M180LCBPQSwgQkEpO1xyXG4gICAgICAgIGNvbnN0IGFiMiA9IEJBLmxlbmd0aFNxcigpO1xyXG4gICAgICAgIGNvbnN0IGIgPSAyICogVmVjMy5kb3QoVnhCQSwgT0F4QkEpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBPQXhCQS5sZW5ndGhTcXIoKSAtIChyYWRpdXNTcXIgKiBhYjIpO1xyXG4gICAgICAgIGNvbnN0IGQgPSBiICogYiAtIDQgKiBhICogYztcclxuXHJcbiAgICAgICAgaWYgKGQgPCAwKSB7IHJldHVybiAwOyB9XHJcblxyXG4gICAgICAgIGNvbnN0IHQgPSAoLWIgLSBNYXRoLnNxcnQoZCkpIC8gKDIgKiBhKTtcclxuICAgICAgICBpZiAodCA8IDApIHtcclxuICAgICAgICAgICAgc3BoZXJlXzAucmFkaXVzID0gY2Fwc3VsZS5yYWRpdXM7XHJcbiAgICAgICAgICAgIGNvbnN0IEJPID0gVmVjMy5zdWJ0cmFjdCh2M181LCBCLCBPKTtcclxuICAgICAgICAgICAgaWYgKE9BLmxlbmd0aFNxcigpIDwgQk8ubGVuZ3RoU3FyKCkpIHtcclxuICAgICAgICAgICAgICAgIHNwaGVyZV8wLmNlbnRlci5zZXQoY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzcGhlcmVfMC5jZW50ZXIuc2V0KGNhcHN1bGUuZWxsaXBzZUNlbnRlcjEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBpbnRlcnNlY3QucmF5X3NwaGVyZShyYXksIHNwaGVyZV8wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBMaW1pdCBpbnRlcnNlY3Rpb24gYmV0d2VlbiB0aGUgYm91bmRzIG9mIHRoZSBjeWxpbmRlcidzIGVuZCBjYXBzLlxyXG4gICAgICAgICAgICBjb25zdCBpUG9zID0gVmVjMy5zY2FsZUFuZEFkZCh2M181LCByYXkubywgdlJheU5vcm0sIHQpO1xyXG4gICAgICAgICAgICBjb25zdCBpUG9zTGVuID0gVmVjMy5zdWJ0cmFjdCh2M182LCBpUG9zLCBBKTtcclxuICAgICAgICAgICAgY29uc3QgdExpbWl0ID0gVmVjMy5kb3QoaVBvc0xlbiwgQkEpIC8gYWIyO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRMaW1pdCA+PSAwICYmIHRMaW1pdCA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdDtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0TGltaXQgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBzcGhlcmVfMC5yYWRpdXMgPSBjYXBzdWxlLnJhZGl1cztcclxuICAgICAgICAgICAgICAgIHNwaGVyZV8wLmNlbnRlci5zZXQoY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50ZXJzZWN0LnJheV9zcGhlcmUocmF5LCBzcGhlcmVfMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodExpbWl0ID4gMSkge1xyXG4gICAgICAgICAgICAgICAgc3BoZXJlXzAucmFkaXVzID0gY2Fwc3VsZS5yYWRpdXM7XHJcbiAgICAgICAgICAgICAgICBzcGhlcmVfMC5jZW50ZXIuc2V0KGNhcHN1bGUuZWxsaXBzZUNlbnRlcjEpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGludGVyc2VjdC5yYXlfc3BoZXJlKHJheSwgc3BoZXJlXzApO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LXN1Yk1lc2ggaW50ZXJzZWN0IGRldGVjdCwgaW4gbW9kZWwgc3BhY2UuXHJcbiAqIEB6aFxyXG4gKiDlnKjmqKHlnovnqbrpl7TkuK3vvIzlsITnur/lkozlrZDkuInop5LnvZHmoLznmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheVxyXG4gKiBAcGFyYW0ge1JlbmRlcmluZ1N1Yk1lc2h9IHN1Yk1lc2hcclxuICogQHBhcmFtIHtJUmF5U3ViTWVzaE9wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yICEwXHJcbiAqL1xyXG5jb25zdCByYXlfc3ViTWVzaCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB0cmkgPSB0cmlhbmdsZS5jcmVhdGUoKTtcclxuICAgIGNvbnN0IGRlT3B0OiBJUmF5U3ViTWVzaE9wdGlvbnMgPSB7IGRpc3RhbmNlOiBJbmZpbml0eSwgZG91YmxlU2lkZWQ6IGZhbHNlLCBtb2RlOiBFUmF5Y2FzdE1vZGUuQU5ZIH07XHJcbiAgICBsZXQgbWluRGlzID0gMDtcclxuXHJcbiAgICBjb25zdCBmaWxsUmVzdWx0ID0gKG06IEVSYXljYXN0TW9kZSwgZDogbnVtYmVyLCBpMDogbnVtYmVyLCBpMTogbnVtYmVyLCBpMjogbnVtYmVyLCByPzogSVJheVN1Yk1lc2hSZXN1bHRbXSkgPT4ge1xyXG4gICAgICAgIGlmIChtID09PSBFUmF5Y2FzdE1vZGUuQ0xPU0VTVCkge1xyXG4gICAgICAgICAgICBpZiAobWluRGlzID4gZCB8fCBtaW5EaXMgPT09IDApIHtcclxuICAgICAgICAgICAgICAgIG1pbkRpcyA9IGQ7XHJcbiAgICAgICAgICAgICAgICBpZiAocikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByLnB1c2goeyBkaXN0YW5jZTogZCwgdmVydGV4SW5kZXgwOiBpMCAvIDMsIHZlcnRleEluZGV4MTogaTEgLyAzLCB2ZXJ0ZXhJbmRleDI6IGkyIC8gMyB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByWzBdLmRpc3RhbmNlID0gZDsgclswXS52ZXJ0ZXhJbmRleDAgPSBpMCAvIDM7IHJbMF0udmVydGV4SW5kZXgxID0gaTEgLyAzOyByWzBdLnZlcnRleEluZGV4MiA9IGkyIC8gMztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBtaW5EaXMgPSBkO1xyXG4gICAgICAgICAgICBpZiAocikgci5wdXNoKHsgZGlzdGFuY2U6IGQsIHZlcnRleEluZGV4MDogaTAgLyAzLCB2ZXJ0ZXhJbmRleDE6IGkxIC8gMywgdmVydGV4SW5kZXgyOiBpMiAvIDMgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG5hcnJvd3BoYXNlID0gKHZiOiBGbG9hdDMyQXJyYXksIGliOiBJQkFycmF5LCBwbTogR0ZYUHJpbWl0aXZlTW9kZSwgcmF5OiByYXksIG9wdDogSVJheVN1Yk1lc2hPcHRpb25zKSA9PiB7XHJcbiAgICAgICAgaWYgKHBtID09PSBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX0xJU1QpIHtcclxuICAgICAgICAgICAgY29uc3QgY250ID0gaWIubGVuZ3RoO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNudDsgaiArPSAzKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpMCA9IGliW2pdICogMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkxID0gaWJbaiArIDFdICogMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkyID0gaWJbaiArIDJdICogMztcclxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5hLCB2YltpMF0sIHZiW2kwICsgMV0sIHZiW2kwICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodHJpLmIsIHZiW2kxXSwgdmJbaTEgKyAxXSwgdmJbaTEgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnNldCh0cmkuYywgdmJbaTJdLCB2YltpMiArIDFdLCB2YltpMiArIDJdKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3QgPSBpbnRlcnNlY3QucmF5X3RyaWFuZ2xlKHJheSwgdHJpLCBvcHQuZG91YmxlU2lkZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRpc3QgPT09IDAgfHwgZGlzdCA+IG9wdC5kaXN0YW5jZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBmaWxsUmVzdWx0KG9wdC5tb2RlLCBkaXN0LCBpMCwgaTEsIGkyLCBvcHQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIGlmIChvcHQubW9kZSA9PT0gRVJheWNhc3RNb2RlLkFOWSkgcmV0dXJuIGRpc3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHBtID09PSBHRlhQcmltaXRpdmVNb2RlLlRSSUFOR0xFX1NUUklQKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNudCA9IGliLmxlbmd0aCAtIDI7XHJcbiAgICAgICAgICAgIGxldCByZXYgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNudDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpMCA9IGliW2ogLSByZXZdICogMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkxID0gaWJbaiArIHJldiArIDFdICogMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkyID0gaWJbaiArIDJdICogMztcclxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5hLCB2YltpMF0sIHZiW2kwICsgMV0sIHZiW2kwICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodHJpLmIsIHZiW2kxXSwgdmJbaTEgKyAxXSwgdmJbaTEgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBWZWMzLnNldCh0cmkuYywgdmJbaTJdLCB2YltpMiArIDFdLCB2YltpMiArIDJdKTtcclxuICAgICAgICAgICAgICAgIHJldiA9IH5yZXY7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gaW50ZXJzZWN0LnJheV90cmlhbmdsZShyYXksIHRyaSwgb3B0LmRvdWJsZVNpZGVkKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXN0ID09PSAwIHx8IGRpc3QgPiBvcHQuZGlzdGFuY2UpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsbFJlc3VsdChvcHQubW9kZSwgZGlzdCwgaTAsIGkxLCBpMiwgb3B0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5BTlkpIHJldHVybiBkaXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChwbSA9PT0gR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9GQU4pIHtcclxuICAgICAgICAgICAgY29uc3QgY250ID0gaWIubGVuZ3RoIC0gMTtcclxuICAgICAgICAgICAgY29uc3QgaTAgPSBpYlswXSAqIDM7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5hLCB2YltpMF0sIHZiW2kwICsgMV0sIHZiW2kwICsgMl0pO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IGNudDsgaiArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBpMSA9IGliW2pdICogMztcclxuICAgICAgICAgICAgICAgIGNvbnN0IGkyID0gaWJbaiArIDFdICogMztcclxuICAgICAgICAgICAgICAgIFZlYzMuc2V0KHRyaS5iLCB2YltpMV0sIHZiW2kxICsgMV0sIHZiW2kxICsgMl0pO1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zZXQodHJpLmMsIHZiW2kyXSwgdmJbaTIgKyAxXSwgdmJbaTIgKyAyXSk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0ID0gaW50ZXJzZWN0LnJheV90cmlhbmdsZShyYXksIHRyaSwgb3B0LmRvdWJsZVNpZGVkKTtcclxuICAgICAgICAgICAgICAgIGlmIChkaXN0ID09PSAwIHx8IGRpc3QgPiBvcHQuZGlzdGFuY2UpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgZmlsbFJlc3VsdChvcHQubW9kZSwgZGlzdCwgaTAsIGkxLCBpMiwgb3B0LnJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5BTlkpIHJldHVybiBkaXN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtaW5EaXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChyYXk6IHJheSwgc3VibWVzaDogUmVuZGVyaW5nU3ViTWVzaCwgb3B0aW9ucz86IElSYXlTdWJNZXNoT3B0aW9ucykge1xyXG4gICAgICAgIG1pbkRpcyA9IDA7XHJcbiAgICAgICAgaWYgKHN1Ym1lc2guZ2VvbWV0cmljSW5mby5wb3NpdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm4gbWluRGlzO1xyXG4gICAgICAgIGNvbnN0IG9wdCA9IG9wdGlvbnMgPT09IHVuZGVmaW5lZCA/IGRlT3B0IDogb3B0aW9ucztcclxuICAgICAgICBjb25zdCBtaW4gPSBzdWJtZXNoLmdlb21ldHJpY0luZm8uYm91bmRpbmdCb3gubWluO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IHN1Ym1lc2guZ2VvbWV0cmljSW5mby5ib3VuZGluZ0JveC5tYXg7XHJcbiAgICAgICAgaWYgKHJheV9hYWJiMihyYXksIG1pbiwgbWF4KSkge1xyXG4gICAgICAgICAgICBjb25zdCBwbSA9IHN1Ym1lc2gucHJpbWl0aXZlTW9kZTtcclxuICAgICAgICAgICAgY29uc3QgeyBwb3NpdGlvbnM6IHZiLCBpbmRpY2VzOiBpYiB9ID0gc3VibWVzaC5nZW9tZXRyaWNJbmZvITtcclxuICAgICAgICAgICAgbmFycm93cGhhc2UodmIsIGliISwgcG0sIHJheSwgb3B0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1pbkRpcztcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LW1lc2ggaW50ZXJzZWN0IGRldGVjdCwgaW4gbW9kZWwgc3BhY2UuXHJcbiAqIEB6aFxyXG4gKiDlnKjmqKHlnovnqbrpl7TkuK3vvIzlsITnur/lkozkuInop5LnvZHmoLzotYTmupDnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtyYXl9IHJheVxyXG4gKiBAcGFyYW0ge01lc2h9IG1lc2hcclxuICogQHBhcmFtIHtJUmF5TWVzaE9wdGlvbnN9IG9wdGlvbnNcclxuICogQHJldHVybiB7bnVtYmVyfSAwIG9yICEwXHJcbiAqL1xyXG5jb25zdCByYXlfbWVzaCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBsZXQgbWluRGlzID0gMDtcclxuICAgIGNvbnN0IGRlT3B0OiBJUmF5TWVzaE9wdGlvbnMgPSB7IGRpc3RhbmNlOiBJbmZpbml0eSwgZG91YmxlU2lkZWQ6IGZhbHNlLCBtb2RlOiBFUmF5Y2FzdE1vZGUuQU5ZIH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHJheTogcmF5LCBtZXNoOiBNZXNoLCBvcHRpb25zPzogSVJheU1lc2hPcHRpb25zKSB7XHJcbiAgICAgICAgbWluRGlzID0gMDtcclxuICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zID09PSB1bmRlZmluZWQgPyBkZU9wdCA6IG9wdGlvbnM7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gbWVzaC5yZW5kZXJpbmdTdWJNZXNoZXMubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IG1pbiA9IG1lc2guc3RydWN0Lm1pblBvc2l0aW9uO1xyXG4gICAgICAgIGNvbnN0IG1heCA9IG1lc2guc3RydWN0Lm1heFBvc2l0aW9uO1xyXG4gICAgICAgIGlmIChtaW4gJiYgbWF4ICYmICFyYXlfYWFiYjIocmF5LCBtaW4sIG1heCkpIHJldHVybiBtaW5EaXM7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBzbSA9IG1lc2gucmVuZGVyaW5nU3ViTWVzaGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBkaXMgPSByYXlfc3ViTWVzaChyYXksIHNtLCBvcHQpO1xyXG4gICAgICAgICAgICBpZiAoZGlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5DTE9TRVNUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbkRpcyA9PT0gMCB8fCBtaW5EaXMgPiBkaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluRGlzID0gZGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnN1YkluZGljZXMpIG9wdC5zdWJJbmRpY2VzWzBdID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpcyA9IGRpcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnN1YkluZGljZXMpIG9wdC5zdWJJbmRpY2VzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBFUmF5Y2FzdE1vZGUuQU5ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtaW5EaXMgJiYgb3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5DTE9TRVNUKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHQucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBvcHQucmVzdWx0WzBdLmRpc3RhbmNlID0gbWluRGlzO1xyXG4gICAgICAgICAgICAgICAgb3B0LnJlc3VsdC5sZW5ndGggPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHQuc3ViSW5kaWNlcykgb3B0LnN1YkluZGljZXMubGVuZ3RoID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1pbkRpcztcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogcmF5LW1vZGVsIGludGVyc2VjdCBkZXRlY3QsIGluIHdvcmxkIHNwYWNlLlxyXG4gKiBAemhcclxuICog5Zyo5LiW55WM56m66Ze05Lit77yM5bCE57q/5ZKM5riy5p+T5qih5Z6L55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSByYXlcclxuICogQHBhcmFtIG1vZGVsXHJcbiAqIEBwYXJhbSBvcHRpb25zXHJcbiAqIEByZXR1cm4gMCBvciAhMFxyXG4gKi9cclxuY29uc3QgcmF5X21vZGVsID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGxldCBtaW5EaXMgPSAwO1xyXG4gICAgY29uc3QgZGVPcHQ6IElSYXlNb2RlbE9wdGlvbnMgPSB7IGRpc3RhbmNlOiBJbmZpbml0eSwgZG91YmxlU2lkZWQ6IGZhbHNlLCBtb2RlOiBFUmF5Y2FzdE1vZGUuQU5ZIH07XHJcbiAgICBjb25zdCBtb2RlbFJheSA9IG5ldyByYXkoKTtcclxuICAgIGNvbnN0IG00ID0gbmV3IE1hdDQoKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocjogcmF5LCBtb2RlbDogc2NlbmUuTW9kZWwsIG9wdGlvbnM/OiBJUmF5TW9kZWxPcHRpb25zKSB7XHJcbiAgICAgICAgbWluRGlzID0gMDtcclxuICAgICAgICBjb25zdCBvcHQgPSBvcHRpb25zID09PSB1bmRlZmluZWQgPyBkZU9wdCA6IG9wdGlvbnM7XHJcbiAgICAgICAgY29uc3Qgd2IgPSBtb2RlbC53b3JsZEJvdW5kcztcclxuICAgICAgICBpZiAod2IgJiYgIXJheV9hYWJiKHIsIHdiKSkgcmV0dXJuIG1pbkRpcztcclxuICAgICAgICByYXkuY29weShtb2RlbFJheSwgcik7XHJcbiAgICAgICAgaWYgKG1vZGVsLm5vZGUpIHtcclxuICAgICAgICAgICAgTWF0NC5pbnZlcnQobTQsIG1vZGVsLm5vZGUuZ2V0V29ybGRNYXRyaXgobTQpKTtcclxuICAgICAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG1vZGVsUmF5Lm8sIHIubywgbTQpO1xyXG4gICAgICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDROb3JtYWwobW9kZWxSYXkuZCwgci5kLCBtNCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHN1Yk1vZGVscyA9IG1vZGVsLnN1Yk1vZGVscztcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yk1vZGVscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBzdWJNZXNoID0gc3ViTW9kZWxzW2ldLnN1Yk1lc2g7XHJcbiAgICAgICAgICAgIGNvbnN0IGRpcyA9IHJheV9zdWJNZXNoKG1vZGVsUmF5LCBzdWJNZXNoLCBvcHQpO1xyXG4gICAgICAgICAgICBpZiAoZGlzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5DTE9TRVNUKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbkRpcyA9PT0gMCB8fCBtaW5EaXMgPiBkaXMpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWluRGlzID0gZGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnN1YkluZGljZXMpIG9wdC5zdWJJbmRpY2VzWzBdID0gaTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1pbkRpcyA9IGRpcztcclxuICAgICAgICAgICAgICAgICAgICBpZiAob3B0LnN1YkluZGljZXMpIG9wdC5zdWJJbmRpY2VzLnB1c2goaSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wdC5tb2RlID09PSBFUmF5Y2FzdE1vZGUuQU5ZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChtaW5EaXMgJiYgb3B0Lm1vZGUgPT09IEVSYXljYXN0TW9kZS5DTE9TRVNUKSB7XHJcbiAgICAgICAgICAgIGlmIChvcHQucmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBvcHQucmVzdWx0WzBdLmRpc3RhbmNlID0gbWluRGlzO1xyXG4gICAgICAgICAgICAgICAgb3B0LnJlc3VsdC5sZW5ndGggPSAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvcHQuc3ViSW5kaWNlcykgb3B0LnN1YkluZGljZXMubGVuZ3RoID0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG1pbkRpcztcclxuICAgIH1cclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogbGluZS1wbGFuZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog57q/5q615LiO5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSB7bGluZX0gbGluZSDnur/mrrVcclxuICogQHBhcmFtIHtwbGFuZX0gcGxhbmUg5bmz6Z2iXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3QgbGluZV9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhYiA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiAobGluZTogbGluZSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KGFiLCBsaW5lLmUsIGxpbmUucyk7XHJcbiAgICAgICAgY29uc3QgdCA9IChwbGFuZS5kIC0gVmVjMy5kb3QobGluZS5zLCBwbGFuZS5uKSkgLyBWZWMzLmRvdChhYiwgcGxhbmUubik7XHJcbiAgICAgICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBsaW5lLXRyaWFuZ2xlIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDnur/mrrXkuI7kuInop5LlvaLnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtsaW5lfSBsaW5lIOe6v+autVxyXG4gKiBAcGFyYW0ge3RyaWFuZ2xlfSB0cmlhbmdsZSDkuInop5LlvaJcclxuICogQHBhcmFtIHtWZWMzfSBvdXRQdCDlj6/pgInvvIznm7jkuqTngrlcclxuICogQHJldHVybiB7bnVtYmVyfSAwIOaIliDpnZ4wXHJcbiAqL1xyXG5jb25zdCBsaW5lX3RyaWFuZ2xlID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGFiID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICBjb25zdCBhYyA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgY29uc3QgcXAgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgIGNvbnN0IGFwID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICBjb25zdCBuID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICBjb25zdCBlID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsaW5lOiBsaW5lLCB0cmlhbmdsZTogdHJpYW5nbGUsIG91dFB0PzogVmVjMyk6IG51bWJlciB7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYiwgdHJpYW5nbGUuYiwgdHJpYW5nbGUuYSk7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChhYywgdHJpYW5nbGUuYywgdHJpYW5nbGUuYSk7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChxcCwgbGluZS5zLCBsaW5lLmUpO1xyXG5cclxuICAgICAgICBWZWMzLmNyb3NzKG4sIGFiLCBhYyk7XHJcbiAgICAgICAgY29uc3QgZGV0ID0gVmVjMy5kb3QocXAsIG4pO1xyXG5cclxuICAgICAgICBpZiAoZGV0IDw9IDAuMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzMuc3VidHJhY3QoYXAsIGxpbmUucywgdHJpYW5nbGUuYSk7XHJcbiAgICAgICAgY29uc3QgdCA9IFZlYzMuZG90KGFwLCBuKTtcclxuICAgICAgICBpZiAodCA8IDAgfHwgdCA+IGRldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzMuY3Jvc3MoZSwgcXAsIGFwKTtcclxuICAgICAgICBsZXQgdiA9IFZlYzMuZG90KGFjLCBlKTtcclxuICAgICAgICBpZiAodiA8IDAgfHwgdiA+IGRldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCB3ID0gLVZlYzMuZG90KGFiLCBlKTtcclxuICAgICAgICBpZiAodyA8IDAuMCB8fCB2ICsgdyA+IGRldCkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChvdXRQdCkge1xyXG4gICAgICAgICAgICBjb25zdCBpbnZEZXQgPSAxLjAgLyBkZXQ7XHJcbiAgICAgICAgICAgIHYgKj0gaW52RGV0O1xyXG4gICAgICAgICAgICB3ICo9IGludkRldDtcclxuICAgICAgICAgICAgY29uc3QgdSA9IDEuMCAtIHYgLSB3O1xyXG5cclxuICAgICAgICAgICAgLy8gb3V0UHQgPSB1KmEgKyB2KmQgKyB3KmM7XHJcbiAgICAgICAgICAgIFZlYzMuc2V0KG91dFB0LFxyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS54ICogdSArIHRyaWFuZ2xlLmIueCAqIHYgKyB0cmlhbmdsZS5jLnggKiB3LFxyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS55ICogdSArIHRyaWFuZ2xlLmIueSAqIHYgKyB0cmlhbmdsZS5jLnkgKiB3LFxyXG4gICAgICAgICAgICAgICAgdHJpYW5nbGUuYS56ICogdSArIHRyaWFuZ2xlLmIueiAqIHYgKyB0cmlhbmdsZS5jLnogKiB3LFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuY29uc3Qgcl90ID0gbmV3IHJheSgpO1xyXG4vKipcclxuICogQGVuXHJcbiAqIGxpbmUtYWFiYiBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog57q/5q615LiO6L205a+56b2Q5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWLXHJcbiAqIEBwYXJhbSBsaW5lIOe6v+autVxyXG4gKiBAcGFyYW0gYWFiYiDovbTlr7npvZDljIXlm7Tnm5JcclxuICogQHJldHVybiB7bnVtYmVyfSAwIOaIliDpnZ4wXHJcbiAqL1xyXG5mdW5jdGlvbiBsaW5lX2FhYmIgKGxpbmU6IGxpbmUsIGFhYmI6IGFhYmIpOiBudW1iZXIge1xyXG4gICAgcl90Lm8uc2V0KGxpbmUucyk7XHJcbiAgICBWZWMzLnN1YnRyYWN0KHJfdC5kLCBsaW5lLmUsIGxpbmUucyk7XHJcbiAgICByX3QuZC5ub3JtYWxpemUoKTtcclxuICAgIGNvbnN0IG1pbiA9IHJheV9hYWJiKHJfdCwgYWFiYik7XHJcbiAgICBjb25zdCBsZW4gPSBsaW5lLmxlbmd0aCgpO1xyXG4gICAgaWYgKG1pbiA8PSBsZW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBsaW5lLW9iYiBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog57q/5q615LiO5pa55ZCR5YyF5Zu055uS55qE55u45Lqk5oCn5qOA5rWLXHJcbiAqIEBwYXJhbSBsaW5lIOe6v+autVxyXG4gKiBAcGFyYW0gb2JiIOaWueWQkeWMheWbtOebklxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVfb2JiIChsaW5lOiBsaW5lLCBvYmI6IG9iYik6IG51bWJlciB7XHJcbiAgICByX3Quby5zZXQobGluZS5zKTtcclxuICAgIFZlYzMuc3VidHJhY3Qocl90LmQsIGxpbmUuZSwgbGluZS5zKTtcclxuICAgIHJfdC5kLm5vcm1hbGl6ZSgpO1xyXG4gICAgY29uc3QgbWluID0gcmF5X29iYihyX3QsIG9iYik7XHJcbiAgICBjb25zdCBsZW4gPSBsaW5lLmxlbmd0aCgpO1xyXG4gICAgaWYgKG1pbiA8PSBsZW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBsaW5lLXNwaGVyZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog57q/5q615LiO55CD55qE55u45Lqk5oCn5qOA5rWLXHJcbiAqIEBwYXJhbSBsaW5lIOe6v+autVxyXG4gKiBAcGFyYW0gc3BoZXJlIOeQg1xyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmZ1bmN0aW9uIGxpbmVfc3BoZXJlIChsaW5lOiBsaW5lLCBzcGhlcmU6IHNwaGVyZSk6IG51bWJlciB7XHJcbiAgICByX3Quby5zZXQobGluZS5zKTtcclxuICAgIFZlYzMuc3VidHJhY3Qocl90LmQsIGxpbmUuZSwgbGluZS5zKTtcclxuICAgIHJfdC5kLm5vcm1hbGl6ZSgpO1xyXG4gICAgY29uc3QgbWluID0gcmF5X3NwaGVyZShyX3QsIHNwaGVyZSk7XHJcbiAgICBjb25zdCBsZW4gPSBsaW5lLmxlbmd0aCgpO1xyXG4gICAgaWYgKG1pbiA8PSBsZW4pIHtcclxuICAgICAgICByZXR1cm4gbWluO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gMDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBhYWJiLWFhYmIgaW50ZXJzZWN0IGRldGVjdC5cclxuICogQHpoXHJcbiAqIOi9tOWvuem9kOWMheWbtOebkuWSjOi9tOWvuem9kOWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxyXG4gKiBAcGFyYW0ge2FhYmJ9IGFhYmIxIOi9tOWvuem9kOWMheWbtOebkjFcclxuICogQHBhcmFtIHthYWJifSBhYWJiMiDovbTlr7npvZDljIXlm7Tnm5IyXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3QgYWFiYl9hYWJiID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IGFNaW4gPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgYU1heCA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCBiTWluID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IGJNYXggPSBuZXcgVmVjMygpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChhYWJiMTogYWFiYiwgYWFiYjI6IGFhYmIpIHtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KGFNaW4sIGFhYmIxLmNlbnRlciwgYWFiYjEuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIFZlYzMuYWRkKGFNYXgsIGFhYmIxLmNlbnRlciwgYWFiYjEuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIFZlYzMuc3VidHJhY3QoYk1pbiwgYWFiYjIuY2VudGVyLCBhYWJiMi5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgVmVjMy5hZGQoYk1heCwgYWFiYjIuY2VudGVyLCBhYWJiMi5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgcmV0dXJuIChhTWluLnggPD0gYk1heC54ICYmIGFNYXgueCA+PSBiTWluLngpICYmXHJcbiAgICAgICAgICAgIChhTWluLnkgPD0gYk1heC55ICYmIGFNYXgueSA+PSBiTWluLnkpICYmXHJcbiAgICAgICAgICAgIChhTWluLnogPD0gYk1heC56ICYmIGFNYXgueiA+PSBiTWluLnopO1xyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbmZ1bmN0aW9uIGdldEFBQkJWZXJ0aWNlcyAobWluOiBWZWMzLCBtYXg6IFZlYzMsIG91dDogVmVjM1tdKSB7XHJcbiAgICBWZWMzLnNldChvdXRbMF0sIG1pbi54LCBtYXgueSwgbWF4LnopO1xyXG4gICAgVmVjMy5zZXQob3V0WzFdLCBtaW4ueCwgbWF4LnksIG1pbi56KTtcclxuICAgIFZlYzMuc2V0KG91dFsyXSwgbWluLngsIG1pbi55LCBtYXgueik7XHJcbiAgICBWZWMzLnNldChvdXRbM10sIG1pbi54LCBtaW4ueSwgbWluLnopO1xyXG4gICAgVmVjMy5zZXQob3V0WzRdLCBtYXgueCwgbWF4LnksIG1heC56KTtcclxuICAgIFZlYzMuc2V0KG91dFs1XSwgbWF4LngsIG1heC55LCBtaW4ueik7XHJcbiAgICBWZWMzLnNldChvdXRbNl0sIG1heC54LCBtaW4ueSwgbWF4LnopO1xyXG4gICAgVmVjMy5zZXQob3V0WzddLCBtYXgueCwgbWluLnksIG1pbi56KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T0JCVmVydGljZXMgKGM6IFZlYzMsIGU6IFZlYzMsIGExOiBWZWMzLCBhMjogVmVjMywgYTM6IFZlYzMsIG91dDogVmVjM1tdKSB7XHJcbiAgICBWZWMzLnNldChvdXRbMF0sXHJcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCArIGEyLnggKiBlLnkgKyBhMy54ICogZS56LFxyXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggKyBhMi55ICogZS55ICsgYTMueSAqIGUueixcclxuICAgICAgICBjLnogKyBhMS56ICogZS54ICsgYTIueiAqIGUueSArIGEzLnogKiBlLnosXHJcbiAgICApO1xyXG4gICAgVmVjMy5zZXQob3V0WzFdLFxyXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggKyBhMi54ICogZS55ICsgYTMueCAqIGUueixcclxuICAgICAgICBjLnkgLSBhMS55ICogZS54ICsgYTIueSAqIGUueSArIGEzLnkgKiBlLnosXHJcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCArIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxyXG4gICAgKTtcclxuICAgIFZlYzMuc2V0KG91dFsyXSxcclxuICAgICAgICBjLnggKyBhMS54ICogZS54IC0gYTIueCAqIGUueSArIGEzLnggKiBlLnosXHJcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgKyBhMy55ICogZS56LFxyXG4gICAgICAgIGMueiArIGExLnogKiBlLnggLSBhMi56ICogZS55ICsgYTMueiAqIGUueixcclxuICAgICk7XHJcbiAgICBWZWMzLnNldChvdXRbM10sXHJcbiAgICAgICAgYy54ICsgYTEueCAqIGUueCArIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxyXG4gICAgICAgIGMueSArIGExLnkgKiBlLnggKyBhMi55ICogZS55IC0gYTMueSAqIGUueixcclxuICAgICAgICBjLnogKyBhMS56ICogZS54ICsgYTIueiAqIGUueSAtIGEzLnogKiBlLnosXHJcbiAgICApO1xyXG4gICAgVmVjMy5zZXQob3V0WzRdLFxyXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggLSBhMi54ICogZS55IC0gYTMueCAqIGUueixcclxuICAgICAgICBjLnkgLSBhMS55ICogZS54IC0gYTIueSAqIGUueSAtIGEzLnkgKiBlLnosXHJcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCAtIGEyLnogKiBlLnkgLSBhMy56ICogZS56LFxyXG4gICAgKTtcclxuICAgIFZlYzMuc2V0KG91dFs1XSxcclxuICAgICAgICBjLnggKyBhMS54ICogZS54IC0gYTIueCAqIGUueSAtIGEzLnggKiBlLnosXHJcbiAgICAgICAgYy55ICsgYTEueSAqIGUueCAtIGEyLnkgKiBlLnkgLSBhMy55ICogZS56LFxyXG4gICAgICAgIGMueiArIGExLnogKiBlLnggLSBhMi56ICogZS55IC0gYTMueiAqIGUueixcclxuICAgICk7XHJcbiAgICBWZWMzLnNldChvdXRbNl0sXHJcbiAgICAgICAgYy54IC0gYTEueCAqIGUueCArIGEyLnggKiBlLnkgLSBhMy54ICogZS56LFxyXG4gICAgICAgIGMueSAtIGExLnkgKiBlLnggKyBhMi55ICogZS55IC0gYTMueSAqIGUueixcclxuICAgICAgICBjLnogLSBhMS56ICogZS54ICsgYTIueiAqIGUueSAtIGEzLnogKiBlLnosXHJcbiAgICApO1xyXG4gICAgVmVjMy5zZXQob3V0WzddLFxyXG4gICAgICAgIGMueCAtIGExLnggKiBlLnggLSBhMi54ICogZS55ICsgYTMueCAqIGUueixcclxuICAgICAgICBjLnkgLSBhMS55ICogZS54IC0gYTIueSAqIGUueSArIGEzLnkgKiBlLnosXHJcbiAgICAgICAgYy56IC0gYTEueiAqIGUueCAtIGEyLnogKiBlLnkgKyBhMy56ICogZS56LFxyXG4gICAgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SW50ZXJ2YWwgKHZlcnRpY2VzOiBhbnlbXSB8IFZlYzNbXSwgYXhpczogVmVjMykge1xyXG4gICAgbGV0IG1pbiA9IFZlYzMuZG90KGF4aXMsIHZlcnRpY2VzWzBdKSwgbWF4ID0gbWluO1xyXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCA4OyArK2kpIHtcclxuICAgICAgICBjb25zdCBwcm9qZWN0aW9uID0gVmVjMy5kb3QoYXhpcywgdmVydGljZXNbaV0pO1xyXG4gICAgICAgIG1pbiA9IChwcm9qZWN0aW9uIDwgbWluKSA/IHByb2plY3Rpb24gOiBtaW47XHJcbiAgICAgICAgbWF4ID0gKHByb2plY3Rpb24gPiBtYXgpID8gcHJvamVjdGlvbiA6IG1heDtcclxuICAgIH1cclxuICAgIHJldHVybiBbbWluLCBtYXhdO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIGFhYmItb2JiIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDovbTlr7npvZDljIXlm7Tnm5LlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHthYWJifSBhYWJiIOi9tOWvuem9kOWMheWbtOebklxyXG4gKiBAcGFyYW0ge29iYn0gb2JiIOaWueWQkeWMheWbtOebklxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmNvbnN0IGFhYmJfb2JiID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHRlc3QgPSBuZXcgQXJyYXkoMTUpO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNTsgaSsrKSB7XHJcbiAgICAgICAgdGVzdFtpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmVydGljZXMgPSBuZXcgQXJyYXkoOCk7XHJcbiAgICBjb25zdCB2ZXJ0aWNlczIgPSBuZXcgQXJyYXkoOCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xyXG4gICAgICAgIHZlcnRpY2VzW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICAgICAgdmVydGljZXMyW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBtaW4gPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgbWF4ID0gbmV3IFZlYzMoKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoYWFiYjogYWFiYiwgb2JiOiBvYmIpOiBudW1iZXIge1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMF0sIDEsIDAsIDApO1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMV0sIDAsIDEsIDApO1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbMl0sIDAsIDAsIDEpO1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbM10sIG9iYi5vcmllbnRhdGlvbi5tMDAsIG9iYi5vcmllbnRhdGlvbi5tMDEsIG9iYi5vcmllbnRhdGlvbi5tMDIpO1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbNF0sIG9iYi5vcmllbnRhdGlvbi5tMDMsIG9iYi5vcmllbnRhdGlvbi5tMDQsIG9iYi5vcmllbnRhdGlvbi5tMDUpO1xyXG4gICAgICAgIFZlYzMuc2V0KHRlc3RbNV0sIG9iYi5vcmllbnRhdGlvbi5tMDYsIG9iYi5vcmllbnRhdGlvbi5tMDcsIG9iYi5vcmllbnRhdGlvbi5tMDgpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7ICsraSkgeyAvLyBGaWxsIG91dCByZXN0IG9mIGF4aXNcclxuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDBdLCB0ZXN0W2ldLCB0ZXN0WzBdKTtcclxuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzFdKTtcclxuICAgICAgICAgICAgVmVjMy5jcm9zcyh0ZXN0WzYgKyBpICogMyArIDFdLCB0ZXN0W2ldLCB0ZXN0WzJdKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIFZlYzMuc3VidHJhY3QobWluLCBhYWJiLmNlbnRlciwgYWFiYi5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgVmVjMy5hZGQobWF4LCBhYWJiLmNlbnRlciwgYWFiYi5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgZ2V0QUFCQlZlcnRpY2VzKG1pbiwgbWF4LCB2ZXJ0aWNlcyk7XHJcbiAgICAgICAgZ2V0T0JCVmVydGljZXMob2JiLmNlbnRlciwgb2JiLmhhbGZFeHRlbnRzLCB0ZXN0WzNdLCB0ZXN0WzRdLCB0ZXN0WzVdLCB2ZXJ0aWNlczIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE1OyArK2opIHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGdldEludGVydmFsKHZlcnRpY2VzLCB0ZXN0W2pdKTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGdldEludGVydmFsKHZlcnRpY2VzMiwgdGVzdFtqXSk7XHJcbiAgICAgICAgICAgIGlmIChiWzBdID4gYVsxXSB8fCBhWzBdID4gYlsxXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7IC8vIFNlcGVyYXRpbmcgYXhpcyBmb3VuZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIGFhYmItcGxhbmUgaW50ZXJzZWN0IGRldGVjdC5cclxuICogQHpoXHJcbiAqIOi9tOWvuem9kOWMheWbtOebkuWSjOW5s+mdoueahOebuOS6pOaAp+ajgOa1i+OAglxyXG4gKiBAcGFyYW0ge2FhYmJ9IGFhYmIg6L205a+56b2Q5YyF5Zu055uSXHJcbiAqIEBwYXJhbSB7cGxhbmV9IHBsYW5lIOW5s+mdolxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcclxuICovXHJcbmNvbnN0IGFhYmJfcGxhbmUgPSBmdW5jdGlvbiAoYWFiYjogYWFiYiwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IHIgPSBhYWJiLmhhbGZFeHRlbnRzLnggKiBNYXRoLmFicyhwbGFuZS5uLngpICtcclxuICAgICAgICBhYWJiLmhhbGZFeHRlbnRzLnkgKiBNYXRoLmFicyhwbGFuZS5uLnkpICtcclxuICAgICAgICBhYWJiLmhhbGZFeHRlbnRzLnogKiBNYXRoLmFicyhwbGFuZS5uLnopO1xyXG4gICAgY29uc3QgZG90ID0gVmVjMy5kb3QocGxhbmUubiwgYWFiYi5jZW50ZXIpO1xyXG4gICAgaWYgKGRvdCArIHIgPCBwbGFuZS5kKSB7IHJldHVybiAtMTsgfVxyXG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiAxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBhYWJiLWZydXN0dW0gaW50ZXJzZWN0IGRldGVjdCwgZmFzdGVyIGJ1dCBoYXMgZmFsc2UgcG9zaXRpdmUgY29ybmVyIGNhc2VzLlxyXG4gKiBAemhcclxuICog6L205a+56b2Q5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM6YCf5bqm5b+r77yM5L2G5pyJ6ZSZ6K+v5oOF5Ya144CCXHJcbiAqIEBwYXJhbSB7YWFiYn0gYWFiYiDovbTlr7npvZDljIXlm7Tnm5JcclxuICogQHBhcmFtIHtmcnVzdHVtfSBmcnVzdHVtIOmUpeWPsFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IDAg5oiWIOmdnjBcclxuICovXHJcbmNvbnN0IGFhYmJfZnJ1c3R1bSA9IGZ1bmN0aW9uIChhYWJiOiBhYWJiLCBmcnVzdHVtOiBmcnVzdHVtKTogbnVtYmVyIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS5wbGFuZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAvLyBmcnVzdHVtIHBsYW5lIG5vcm1hbCBwb2ludHMgdG8gdGhlIGluc2lkZVxyXG4gICAgICAgIGlmIChhYWJiX3BsYW5lKGFhYmIsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcclxuICAgIHJldHVybiAxO1xyXG59O1xyXG5cclxuLy8gaHR0cHM6Ly9jZXNpdW0uY29tL2Jsb2cvMjAxNy8wMi8wMi90aWdodGVyLWZydXN0dW0tY3VsbGluZy1hbmQtd2h5LXlvdS1tYXktd2FudC10by1kaXNyZWdhcmQtaXQvXHJcbi8qKlxyXG4gKiBAZW5cclxuICogYWFiYi1mcnVzdHVtIGludGVyc2VjdCwgaGFuZGxlcyBtb3N0IG9mIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5LlxyXG4gKiBAemhcclxuICog6L205a+56b2Q5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXHJcbiAqIEBwYXJhbSB7YWFiYn0gYWFiYiDovbTlr7npvZDljIXlm7Tnm5JcclxuICogQHBhcmFtIHtmcnVzdHVtfSBmcnVzdHVtIOmUpeWPsFxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9XHJcbiAqL1xyXG5jb25zdCBhYWJiX2ZydXN0dW1fYWNjdXJhdGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgdG1wID0gbmV3IEFycmF5KDgpO1xyXG4gICAgbGV0IG91dDEgPSAwLCBvdXQyID0gMDtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG1wLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdG1wW2ldID0gbmV3IFZlYzMoMCwgMCwgMCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKGFhYmI6IGFhYmIsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xyXG4gICAgICAgIGxldCByZXN1bHQgPSAwLCBpbnRlcnNlY3RzID0gZmFsc2U7XHJcbiAgICAgICAgLy8gMS4gYWFiYiBpbnNpZGUvb3V0c2lkZSBmcnVzdHVtIHRlc3RcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0ucGxhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IGFhYmJfcGxhbmUoYWFiYiwgZnJ1c3R1bS5wbGFuZXNbaV0pO1xyXG4gICAgICAgICAgICAvLyBmcnVzdHVtIHBsYW5lIG5vcm1hbCBwb2ludHMgdG8gdGhlIGluc2lkZVxyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09PSAtMSkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcclxuICAgICAgICAgICAgZWxzZSBpZiAocmVzdWx0ID09PSAxKSB7IGludGVyc2VjdHMgPSB0cnVlOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghaW50ZXJzZWN0cykgeyByZXR1cm4gMTsgfSAvLyBjb21wbGV0ZWx5IGluc2lkZVxyXG4gICAgICAgIC8vIGluIGNhc2Ugb2YgZmFsc2UgcG9zaXRpdmVzXHJcbiAgICAgICAgLy8gMi4gZnJ1c3R1bSBpbnNpZGUvb3V0c2lkZSBhYWJiIHRlc3RcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgVmVjMy5zdWJ0cmFjdCh0bXBbaV0sIGZydXN0dW0udmVydGljZXNbaV0sIGFhYmIuY2VudGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0MSA9IDAsIG91dDIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodG1wW2ldLnggPiBhYWJiLmhhbGZFeHRlbnRzLngpIHsgb3V0MSsrOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS54IDwgLWFhYmIuaGFsZkV4dGVudHMueCkgeyBvdXQyKys7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodG1wW2ldLnkgPiBhYWJiLmhhbGZFeHRlbnRzLnkpIHsgb3V0MSsrOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS55IDwgLWFhYmIuaGFsZkV4dGVudHMueSkgeyBvdXQyKys7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgb3V0MSA9IDA7IG91dDIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAodG1wW2ldLnogPiBhYWJiLmhhbGZFeHRlbnRzLnopIHsgb3V0MSsrOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHRtcFtpXS56IDwgLWFhYmIuaGFsZkV4dGVudHMueikgeyBvdXQyKys7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBvYmIgY29udGFpbnMgdGhlIHBvaW50LlxyXG4gKiBAemhcclxuICog5pa55ZCR5YyF5Zu055uS5ZKM54K555qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSB7b2JifSBvYmIg5pa55ZCR5YyF5Zu055uSXHJcbiAqIEBwYXJhbSB7VmVjM30gcG9pbnQg54K5XHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcclxuICovXHJcbmNvbnN0IG9iYl9wb2ludCA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB0bXAgPSBuZXcgVmVjMygwLCAwLCAwKSwgbTMgPSBuZXcgTWF0MygpO1xyXG4gICAgY29uc3QgbGVzc1RoYW4gPSBmdW5jdGlvbiAoYTogVmVjMywgYjogVmVjMyk6IGJvb2xlYW4geyByZXR1cm4gTWF0aC5hYnMoYS54KSA8IGIueCAmJiBNYXRoLmFicyhhLnkpIDwgYi55ICYmIE1hdGguYWJzKGEueikgPCBiLno7IH07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iYjogb2JiLCBwb2ludDogVmVjMyk6IGJvb2xlYW4ge1xyXG4gICAgICAgIFZlYzMuc3VidHJhY3QodG1wLCBwb2ludCwgb2JiLmNlbnRlcik7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQzKHRtcCwgdG1wLCBNYXQzLnRyYW5zcG9zZShtMywgb2JiLm9yaWVudGF0aW9uKSk7XHJcbiAgICAgICAgcmV0dXJuIGxlc3NUaGFuKHRtcCwgb2JiLmhhbGZFeHRlbnRzKTtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIG9iYi1wbGFuZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog5pa55ZCR5YyF5Zu055uS5ZKM5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSB7b2JifSBvYmIg5pa55ZCR5YyF5Zu055uSXHJcbiAqIEBwYXJhbSB7cGxhbmV9IHBsYW5lIOW5s+mdolxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcclxuICovXHJcbmNvbnN0IG9iYl9wbGFuZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBhYnNEb3QgPSBmdW5jdGlvbiAobjogVmVjMywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHo6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmFicyhuLnggKiB4ICsgbi55ICogeSArIG4ueiAqIHopO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAob2JiOiBvYmIsIHBsYW5lOiBwbGFuZSk6IG51bWJlciB7XHJcbiAgICAgICAgLy8gUmVhbC1UaW1lIENvbGxpc2lvbiBEZXRlY3Rpb24sIENocmlzdGVyIEVyaWNzb24sIHAuIDE2My5cclxuICAgICAgICBjb25zdCByID0gb2JiLmhhbGZFeHRlbnRzLnggKiBhYnNEb3QocGxhbmUubiwgb2JiLm9yaWVudGF0aW9uLm0wMCwgb2JiLm9yaWVudGF0aW9uLm0wMSwgb2JiLm9yaWVudGF0aW9uLm0wMikgK1xyXG4gICAgICAgICAgICBvYmIuaGFsZkV4dGVudHMueSAqIGFic0RvdChwbGFuZS5uLCBvYmIub3JpZW50YXRpb24ubTAzLCBvYmIub3JpZW50YXRpb24ubTA0LCBvYmIub3JpZW50YXRpb24ubTA1KSArXHJcbiAgICAgICAgICAgIG9iYi5oYWxmRXh0ZW50cy56ICogYWJzRG90KHBsYW5lLm4sIG9iYi5vcmllbnRhdGlvbi5tMDYsIG9iYi5vcmllbnRhdGlvbi5tMDcsIG9iYi5vcmllbnRhdGlvbi5tMDgpO1xyXG5cclxuICAgICAgICBjb25zdCBkb3QgPSBWZWMzLmRvdChwbGFuZS5uLCBvYmIuY2VudGVyKTtcclxuICAgICAgICBpZiAoZG90ICsgciA8IHBsYW5lLmQpIHsgcmV0dXJuIC0xOyB9XHJcbiAgICAgICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIG9iYi1mcnVzdHVtIGludGVyc2VjdCwgZmFzdGVyIGJ1dCBoYXMgZmFsc2UgcG9zaXRpdmUgY29ybmVyIGNhc2VzLlxyXG4gKiBAemhcclxuICog5pa55ZCR5YyF5Zu055uS5ZKM6ZSl5Y+w55u45Lqk5oCn5qOA5rWL77yM6YCf5bqm5b+r77yM5L2G5pyJ6ZSZ6K+v5oOF5Ya144CCXHJcbiAqIEBwYXJhbSB7b2JifSBvYmIg5pa55ZCR5YyF5Zu055uSXHJcbiAqIEBwYXJhbSB7ZnJ1c3R1bX0gZnJ1c3R1bSDplKXlj7BcclxuICogQHJldHVybiB7bnVtYmVyfSAwIOaIliDpnZ4wXHJcbiAqL1xyXG5jb25zdCBvYmJfZnJ1c3R1bSA9IGZ1bmN0aW9uIChvYmI6IG9iYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0ucGxhbmVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgLy8gZnJ1c3R1bSBwbGFuZSBub3JtYWwgcG9pbnRzIHRvIHRoZSBpbnNpZGVcclxuICAgICAgICBpZiAob2JiX3BsYW5lKG9iYiwgZnJ1c3R1bS5wbGFuZXNbaV0pID09PSAtMSkge1xyXG4gICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICB9XHJcbiAgICB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxyXG4gICAgcmV0dXJuIDE7XHJcbn07XHJcblxyXG4vLyBodHRwczovL2Nlc2l1bS5jb20vYmxvZy8yMDE3LzAyLzAyL3RpZ2h0ZXItZnJ1c3R1bS1jdWxsaW5nLWFuZC13aHkteW91LW1heS13YW50LXRvLWRpc3JlZ2FyZC1pdC9cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBvYmItZnJ1c3R1bSBpbnRlcnNlY3QsIGhhbmRsZXMgbW9zdCBvZiB0aGUgZmFsc2UgcG9zaXRpdmVzIGNvcnJlY3RseS5cclxuICogQHpoXHJcbiAqIOaWueWQkeWMheWbtOebkuWSjOmUpeWPsOebuOS6pOaAp+ajgOa1i++8jOato+ehruWkhOeQhuWkp+WkmuaVsOmUmeivr+aDheWGteOAglxyXG4gKiBAcGFyYW0ge29iYn0gb2JiIOaWueWQkeWMheWbtOebklxyXG4gKiBAcGFyYW0ge2ZydXN0dW19IGZydXN0dW0g6ZSl5Y+wXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3Qgb2JiX2ZydXN0dW1fYWNjdXJhdGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgdG1wID0gbmV3IEFycmF5KDgpO1xyXG4gICAgbGV0IGRpc3QgPSAwLCBvdXQxID0gMCwgb3V0MiA9IDA7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRtcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHRtcFtpXSA9IG5ldyBWZWMzKDAsIDAsIDApO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZG90ID0gZnVuY3Rpb24gKG46IFZlYzMsIHg6IG51bWJlciwgeTogbnVtYmVyLCB6OiBudW1iZXIpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiBuLnggKiB4ICsgbi55ICogeSArIG4ueiAqIHo7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmI6IG9iYiwgZnJ1c3R1bTogZnJ1c3R1bSk6IG51bWJlciB7XHJcbiAgICAgICAgbGV0IHJlc3VsdCA9IDAsIGludGVyc2VjdHMgPSBmYWxzZTtcclxuICAgICAgICAvLyAxLiBvYmIgaW5zaWRlL291dHNpZGUgZnJ1c3R1bSB0ZXN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnBsYW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICByZXN1bHQgPSBvYmJfcGxhbmUob2JiLCBmcnVzdHVtLnBsYW5lc1tpXSk7XHJcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT09IC0xKSB7IHJldHVybiAwOyB9IC8vIGNvbXBsZXRlbHkgb3V0c2lkZVxyXG4gICAgICAgICAgICBlbHNlIGlmIChyZXN1bHQgPT09IDEpIHsgaW50ZXJzZWN0cyA9IHRydWU7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFpbnRlcnNlY3RzKSB7IHJldHVybiAxOyB9IC8vIGNvbXBsZXRlbHkgaW5zaWRlXHJcbiAgICAgICAgLy8gaW4gY2FzZSBvZiBmYWxzZSBwb3NpdGl2ZXNcclxuICAgICAgICAvLyAyLiBmcnVzdHVtIGluc2lkZS9vdXRzaWRlIG9iYiB0ZXN0XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QodG1wW2ldLCBmcnVzdHVtLnZlcnRpY2VzW2ldLCBvYmIuY2VudGVyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb3V0MSA9IDAsIG91dDIgPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBkaXN0ID0gZG90KHRtcFtpXSwgb2JiLm9yaWVudGF0aW9uLm0wMCwgb2JiLm9yaWVudGF0aW9uLm0wMSwgb2JiLm9yaWVudGF0aW9uLm0wMik7XHJcbiAgICAgICAgICAgIGlmIChkaXN0ID4gb2JiLmhhbGZFeHRlbnRzLngpIHsgb3V0MSsrOyB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGRpc3QgPCAtb2JiLmhhbGZFeHRlbnRzLngpIHsgb3V0MisrOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvdXQxID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCB8fCBvdXQyID09PSBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aCkgeyByZXR1cm4gMDsgfVxyXG4gICAgICAgIG91dDEgPSAwOyBvdXQyID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZydXN0dW0udmVydGljZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgZGlzdCA9IGRvdCh0bXBbaV0sIG9iYi5vcmllbnRhdGlvbi5tMDMsIG9iYi5vcmllbnRhdGlvbi5tMDQsIG9iYi5vcmllbnRhdGlvbi5tMDUpO1xyXG4gICAgICAgICAgICBpZiAoZGlzdCA+IG9iYi5oYWxmRXh0ZW50cy55KSB7IG91dDErKzsgfVxyXG4gICAgICAgICAgICBlbHNlIGlmIChkaXN0IDwgLW9iYi5oYWxmRXh0ZW50cy55KSB7IG91dDIrKzsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAob3V0MSA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGggfHwgb3V0MiA9PT0gZnJ1c3R1bS52ZXJ0aWNlcy5sZW5ndGgpIHsgcmV0dXJuIDA7IH1cclxuICAgICAgICBvdXQxID0gMDsgb3V0MiA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGRpc3QgPSBkb3QodG1wW2ldLCBvYmIub3JpZW50YXRpb24ubTA2LCBvYmIub3JpZW50YXRpb24ubTA3LCBvYmIub3JpZW50YXRpb24ubTA4KTtcclxuICAgICAgICAgICAgaWYgKGRpc3QgPiBvYmIuaGFsZkV4dGVudHMueikgeyBvdXQxKys7IH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoZGlzdCA8IC1vYmIuaGFsZkV4dGVudHMueikgeyBvdXQyKys7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dDEgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoIHx8IG91dDIgPT09IGZydXN0dW0udmVydGljZXMubGVuZ3RoKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBvYmItb2JiIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDmlrnlkJHljIXlm7Tnm5LlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtvYmJ9IG9iYjEg5pa55ZCR5YyF5Zu055uSMVxyXG4gKiBAcGFyYW0ge29iYn0gb2JiMiDmlrnlkJHljIXlm7Tnm5IyXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3Qgb2JiX29iYiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB0ZXN0ID0gbmV3IEFycmF5KDE1KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTU7IGkrKykge1xyXG4gICAgICAgIHRlc3RbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2ZXJ0aWNlcyA9IG5ldyBBcnJheSg4KTtcclxuICAgIGNvbnN0IHZlcnRpY2VzMiA9IG5ldyBBcnJheSg4KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7XHJcbiAgICAgICAgdmVydGljZXNbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgICAgICB2ZXJ0aWNlczJbaV0gPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iYjE6IG9iYiwgb2JiMjogb2JiKTogbnVtYmVyIHtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzBdLCBvYmIxLm9yaWVudGF0aW9uLm0wMCwgb2JiMS5vcmllbnRhdGlvbi5tMDEsIG9iYjEub3JpZW50YXRpb24ubTAyKTtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzFdLCBvYmIxLm9yaWVudGF0aW9uLm0wMywgb2JiMS5vcmllbnRhdGlvbi5tMDQsIG9iYjEub3JpZW50YXRpb24ubTA1KTtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzJdLCBvYmIxLm9yaWVudGF0aW9uLm0wNiwgb2JiMS5vcmllbnRhdGlvbi5tMDcsIG9iYjEub3JpZW50YXRpb24ubTA4KTtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzNdLCBvYmIyLm9yaWVudGF0aW9uLm0wMCwgb2JiMi5vcmllbnRhdGlvbi5tMDEsIG9iYjIub3JpZW50YXRpb24ubTAyKTtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzRdLCBvYmIyLm9yaWVudGF0aW9uLm0wMywgb2JiMi5vcmllbnRhdGlvbi5tMDQsIG9iYjIub3JpZW50YXRpb24ubTA1KTtcclxuICAgICAgICBWZWMzLnNldCh0ZXN0WzVdLCBvYmIyLm9yaWVudGF0aW9uLm0wNiwgb2JiMi5vcmllbnRhdGlvbi5tMDcsIG9iYjIub3JpZW50YXRpb24ubTA4KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyArK2kpIHsgLy8gRmlsbCBvdXQgcmVzdCBvZiBheGlzXHJcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAwXSwgdGVzdFtpXSwgdGVzdFswXSk7XHJcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsxXSk7XHJcbiAgICAgICAgICAgIFZlYzMuY3Jvc3ModGVzdFs2ICsgaSAqIDMgKyAxXSwgdGVzdFtpXSwgdGVzdFsyXSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBnZXRPQkJWZXJ0aWNlcyhvYmIxLmNlbnRlciwgb2JiMS5oYWxmRXh0ZW50cywgdGVzdFswXSwgdGVzdFsxXSwgdGVzdFsyXSwgdmVydGljZXMpO1xyXG4gICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYjIuY2VudGVyLCBvYmIyLmhhbGZFeHRlbnRzLCB0ZXN0WzNdLCB0ZXN0WzRdLCB0ZXN0WzVdLCB2ZXJ0aWNlczIpO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDE1OyArK2kpIHtcclxuICAgICAgICAgICAgY29uc3QgYSA9IGdldEludGVydmFsKHZlcnRpY2VzLCB0ZXN0W2ldKTtcclxuICAgICAgICAgICAgY29uc3QgYiA9IGdldEludGVydmFsKHZlcnRpY2VzMiwgdGVzdFtpXSk7XHJcbiAgICAgICAgICAgIGlmIChiWzBdID4gYVsxXSB8fCBhWzBdID4gYlsxXSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7IC8vIFNlcGVyYXRpbmcgYXhpcyBmb3VuZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gMTtcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IG1heC1saW5lLWxlbmd0aFxyXG4vLyBodHRwczovL2dpdGh1Yi5jb20vZGlrdS1kay9idmgtdHZjZzE4L2Jsb2IvMWZkMzM0OGMxN2JjOGNmM2RhMGI0YWU2MGZkYjhmMmFhOTBhNmZmMC9GT1VOREFUSU9OL0dFT01FVFJZL0dFT01FVFJZL2luY2x1ZGUvb3ZlcmxhcC9nZW9tZXRyeV9vdmVybGFwX29iYl9jYXBzdWxlLmhcclxuLyoqXHJcbiAqIEBlblxyXG4gKiBvYmItY2Fwc3VsZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog5pa55ZCR5YyF5Zu055uS5ZKM6IO25ZuK5L2T55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSBvYmIg5pa55ZCR5YyF5Zu055uSXHJcbiAqIEBwYXJhbSBjYXBzdWxlIOiDtuWbiuS9k1xyXG4gKi9cclxuY29uc3Qgb2JiX2NhcHN1bGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3Qgc3BoZXJlXzAgPSBuZXcgc3BoZXJlKCk7XHJcbiAgICBjb25zdCB2M18wID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzEgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgdjNfMiA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCB2M192ZXJ0czggPSBuZXcgQXJyYXk8VmVjMz4oOCk7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykgeyB2M192ZXJ0czhbaV0gPSBuZXcgVmVjMygpOyB9XHJcbiAgICBjb25zdCB2M19heGlzOCA9IG5ldyBBcnJheTxWZWMzPig4KTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgaSsrKSB7IHYzX2F4aXM4W2ldID0gbmV3IFZlYzMoKTsgfVxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvYmI6IG9iYiwgY2Fwc3VsZTogY2Fwc3VsZSkge1xyXG4gICAgICAgIGNvbnN0IGggPSBWZWMzLnNxdWFyZWREaXN0YW5jZShjYXBzdWxlLmVsbGlwc2VDZW50ZXIwLCBjYXBzdWxlLmVsbGlwc2VDZW50ZXIxKTtcclxuICAgICAgICBpZiAoaCA9PT0gMCkge1xyXG4gICAgICAgICAgICBzcGhlcmVfMC5yYWRpdXMgPSBjYXBzdWxlLnJhZGl1cztcclxuICAgICAgICAgICAgc3BoZXJlXzAuY2VudGVyLnNldChjYXBzdWxlLmVsbGlwc2VDZW50ZXIwKTtcclxuICAgICAgICAgICAgcmV0dXJuIGludGVyc2VjdC5zcGhlcmVfb2JiKHNwaGVyZV8wLCBvYmIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHYzXzAueCA9IG9iYi5vcmllbnRhdGlvbi5tMDA7XHJcbiAgICAgICAgICAgIHYzXzAueSA9IG9iYi5vcmllbnRhdGlvbi5tMDE7XHJcbiAgICAgICAgICAgIHYzXzAueiA9IG9iYi5vcmllbnRhdGlvbi5tMDI7XHJcbiAgICAgICAgICAgIHYzXzEueCA9IG9iYi5vcmllbnRhdGlvbi5tMDM7XHJcbiAgICAgICAgICAgIHYzXzEueSA9IG9iYi5vcmllbnRhdGlvbi5tMDQ7XHJcbiAgICAgICAgICAgIHYzXzEueiA9IG9iYi5vcmllbnRhdGlvbi5tMDU7XHJcbiAgICAgICAgICAgIHYzXzIueCA9IG9iYi5vcmllbnRhdGlvbi5tMDY7XHJcbiAgICAgICAgICAgIHYzXzIueSA9IG9iYi5vcmllbnRhdGlvbi5tMDc7XHJcbiAgICAgICAgICAgIHYzXzIueiA9IG9iYi5vcmllbnRhdGlvbi5tMDg7XHJcbiAgICAgICAgICAgIGdldE9CQlZlcnRpY2VzKG9iYi5jZW50ZXIsIG9iYi5oYWxmRXh0ZW50cywgdjNfMCwgdjNfMSwgdjNfMiwgdjNfdmVydHM4KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGF4ZXMgPSB2M19heGlzODtcclxuICAgICAgICAgICAgY29uc3QgYTAgPSBWZWMzLmNvcHkoYXhlc1swXSwgdjNfMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGExID0gVmVjMy5jb3B5KGF4ZXNbMV0sIHYzXzEpO1xyXG4gICAgICAgICAgICBjb25zdCBhMiA9IFZlYzMuY29weShheGVzWzJdLCB2M18yKTtcclxuICAgICAgICAgICAgY29uc3QgQyA9IFZlYzMuc3VidHJhY3QoYXhlc1szXSwgY2Fwc3VsZS5jZW50ZXIsIG9iYi5jZW50ZXIpO1xyXG4gICAgICAgICAgICBDLm5vcm1hbGl6ZSgpO1xyXG4gICAgICAgICAgICBjb25zdCBCID0gVmVjMy5zdWJ0cmFjdChheGVzWzRdLCBjYXBzdWxlLmVsbGlwc2VDZW50ZXIwLCBjYXBzdWxlLmVsbGlwc2VDZW50ZXIxKTtcclxuICAgICAgICAgICAgQi5ub3JtYWxpemUoKTtcclxuICAgICAgICAgICAgVmVjMy5jcm9zcyhheGVzWzVdLCBhMCwgQik7XHJcbiAgICAgICAgICAgIFZlYzMuY3Jvc3MoYXhlc1s2XSwgYTEsIEIpO1xyXG4gICAgICAgICAgICBWZWMzLmNyb3NzKGF4ZXNbN10sIGEyLCBCKTtcclxuXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgODsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBhID0gZ2V0SW50ZXJ2YWwodjNfdmVydHM4LCBheGVzW2ldKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGQwID0gVmVjMy5kb3QoYXhlc1tpXSwgY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkMSA9IFZlYzMuZG90KGF4ZXNbaV0sIGNhcHN1bGUuZWxsaXBzZUNlbnRlcjEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWF4X2QgPSBNYXRoLm1heChkMCwgZDEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgbWluX2QgPSBNYXRoLm1pbihkMCwgZDEpO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZF9taW4gPSBtaW5fZCAtIGNhcHN1bGUucmFkaXVzO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZF9tYXggPSBtYXhfZCArIGNhcHN1bGUucmFkaXVzO1xyXG4gICAgICAgICAgICAgICAgaWYgKGRfbWluID4gYVsxXSB8fCBhWzBdID4gZF9tYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gMDsgLy8gU2VwZXJhdGluZyBheGlzIGZvdW5kXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogc3BoZXJlLXBsYW5lIGludGVyc2VjdCwgbm90IG5lY2Vzc2FyaWx5IGZhc3RlciB0aGFuIG9iYi1wbGFuZSxkdWUgdG8gdGhlIGxlbmd0aCBjYWxjdWxhdGlvbiBvZiB0aGVcclxuICogcGxhbmUgbm9ybWFsIHRvIGZhY3RvciBvdXQgdGhlIHVubm9tYWxpemVkIHBsYW5lIGRpc3RhbmNlLlxyXG4gKiBAemhcclxuICog55CD5LiO5bmz6Z2i55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqIEBwYXJhbSB7c3BoZXJlfSBzcGhlcmUg55CDXHJcbiAqIEBwYXJhbSB7cGxhbmV9IHBsYW5lIOW5s+mdolxyXG4gKiBAcmV0dXJuIHtudW1iZXJ9IGluc2lkZShiYWNrKSA9IC0xLCBvdXRzaWRlKGZyb250KSA9IDAsIGludGVyc2VjdCA9IDFcclxuICovXHJcbmNvbnN0IHNwaGVyZV9wbGFuZSA9IGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgcGxhbmU6IHBsYW5lKTogbnVtYmVyIHtcclxuICAgIGNvbnN0IGRvdCA9IFZlYzMuZG90KHBsYW5lLm4sIHNwaGVyZS5jZW50ZXIpO1xyXG4gICAgY29uc3QgciA9IHNwaGVyZS5yYWRpdXMgKiBwbGFuZS5uLmxlbmd0aCgpO1xyXG4gICAgaWYgKGRvdCArIHIgPCBwbGFuZS5kKSB7IHJldHVybiAtMTsgfVxyXG4gICAgZWxzZSBpZiAoZG90IC0gciA+IHBsYW5lLmQpIHsgcmV0dXJuIDA7IH1cclxuICAgIHJldHVybiAxO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBzcGhlcmUtZnJ1c3R1bSBpbnRlcnNlY3QsIGZhc3RlciBidXQgaGFzIGZhbHNlIHBvc2l0aXZlIGNvcm5lciBjYXNlcy5cclxuICogQHpoXHJcbiAqIOeQg+WSjOmUpeWPsOeahOebuOS6pOaAp+ajgOa1i++8jOmAn+W6puW/q++8jOS9huaciemUmeivr+aDheWGteOAglxyXG4gKiBAcGFyYW0ge3NwaGVyZX0gc3BoZXJlIOeQg1xyXG4gKiBAcGFyYW0ge2ZydXN0dW19IGZydXN0dW0g6ZSl5Y+wXHJcbiAqIEByZXR1cm4ge251bWJlcn0gMCDmiJYg6Z2eMFxyXG4gKi9cclxuY29uc3Qgc3BoZXJlX2ZydXN0dW0gPSBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGZydXN0dW06IGZydXN0dW0pOiBudW1iZXIge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcnVzdHVtLnBsYW5lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXHJcbiAgICAgICAgaWYgKHNwaGVyZV9wbGFuZShzcGhlcmUsIGZydXN0dW0ucGxhbmVzW2ldKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgfVxyXG4gICAgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcclxuICAgIHJldHVybiAxO1xyXG59O1xyXG5cclxuLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA5MTI2OTIvdmlldy1mcnVzdHVtLWN1bGxpbmctY29ybmVyLWNhc2VzXHJcbi8qKlxyXG4gKiBAZW5cclxuICogc3BoZXJlLWZydXN0dW0gaW50ZXJzZWN0LCBoYW5kbGVzIHRoZSBmYWxzZSBwb3NpdGl2ZXMgY29ycmVjdGx5LlxyXG4gKiBAemhcclxuICog55CD5ZKM6ZSl5Y+w55qE55u45Lqk5oCn5qOA5rWL77yM5q2j56Gu5aSE55CG5aSn5aSa5pWw6ZSZ6K+v5oOF5Ya144CCXHJcbiAqIEBwYXJhbSB7c3BoZXJlfSBzcGhlcmUg55CDXHJcbiAqIEBwYXJhbSB7ZnJ1c3R1bX0gZnJ1c3R1bSDplKXlj7BcclxuICogQHJldHVybiB7bnVtYmVyfSAwIOaIliDpnZ4wXHJcbiAqL1xyXG5jb25zdCBzcGhlcmVfZnJ1c3R1bV9hY2N1cmF0ZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBwdCA9IG5ldyBWZWMzKDAsIDAsIDApLCBtYXAgPSBbMSwgLTEsIDEsIC0xLCAxLCAtMV07XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBmcnVzdHVtOiBmcnVzdHVtKTogbnVtYmVyIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDY7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwbGFuZSA9IGZydXN0dW0ucGxhbmVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCByID0gc3BoZXJlLnJhZGl1cywgYyA9IHNwaGVyZS5jZW50ZXI7XHJcbiAgICAgICAgICAgIGNvbnN0IG4gPSBwbGFuZS5uLCBkID0gcGxhbmUuZDtcclxuICAgICAgICAgICAgY29uc3QgZG90ID0gVmVjMy5kb3QobiwgYyk7XHJcbiAgICAgICAgICAgIC8vIGZydXN0dW0gcGxhbmUgbm9ybWFsIHBvaW50cyB0byB0aGUgaW5zaWRlXHJcbiAgICAgICAgICAgIGlmIChkb3QgKyByIDwgZCkgeyByZXR1cm4gMDsgfSAvLyBjb21wbGV0ZWx5IG91dHNpZGVcclxuICAgICAgICAgICAgZWxzZSBpZiAoZG90IC0gciA+IGQpIHsgY29udGludWU7IH1cclxuICAgICAgICAgICAgLy8gaW4gY2FzZSBvZiBmYWxzZSBwb3NpdGl2ZXNcclxuICAgICAgICAgICAgLy8gaGFzIGZhbHNlIG5lZ2F0aXZlcywgc3RpbGwgd29ya2luZyBvbiBpdFxyXG4gICAgICAgICAgICBWZWMzLmFkZChwdCwgYywgVmVjMy5tdWx0aXBseVNjYWxhcihwdCwgbiwgcikpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGogPT09IGkgfHwgaiA9PT0gaSArIG1hcFtpXSkgeyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgY29uc3QgdGVzdCA9IGZydXN0dW0ucGxhbmVzW2pdO1xyXG4gICAgICAgICAgICAgICAgaWYgKFZlYzMuZG90KHRlc3QubiwgcHQpIDwgdGVzdC5kKSB7IHJldHVybiAwOyB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBzcGhlcmUtc3BoZXJlIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDnkIPlkoznkIPnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtzcGhlcmV9IHNwaGVyZTAg55CDMFxyXG4gKiBAcGFyYW0ge3NwaGVyZX0gc3BoZXJlMSDnkIMxXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcclxuICovXHJcbmNvbnN0IHNwaGVyZV9zcGhlcmUgPSBmdW5jdGlvbiAoc3BoZXJlMDogc3BoZXJlLCBzcGhlcmUxOiBzcGhlcmUpOiBib29sZWFuIHtcclxuICAgIGNvbnN0IHIgPSBzcGhlcmUwLnJhZGl1cyArIHNwaGVyZTEucmFkaXVzO1xyXG4gICAgcmV0dXJuIFZlYzMuc3F1YXJlZERpc3RhbmNlKHNwaGVyZTAuY2VudGVyLCBzcGhlcmUxLmNlbnRlcikgPCByICogcjtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogc3BoZXJlLWFhYmIgaW50ZXJzZWN0IGRldGVjdC5cclxuICogQHpoXHJcbiAqIOeQg+WSjOi9tOWvuem9kOWMheWbtOebkueahOebuOS6pOaAp+ajgOa1i+OAglxyXG4gKiBAcGFyYW0ge3NwaGVyZX0gc3BoZXJlIOeQg1xyXG4gKiBAcGFyYW0ge2FhYmJ9IGFhYmIg6L205a+56b2Q5YyF5Zu055uSXHJcbiAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgb3IgZmFsc2VcclxuICovXHJcbmNvbnN0IHNwaGVyZV9hYWJiID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGNvbnN0IHB0ID0gbmV3IFZlYzMoKTtcclxuICAgIHJldHVybiBmdW5jdGlvbiAoc3BoZXJlOiBzcGhlcmUsIGFhYmI6IGFhYmIpOiBib29sZWFuIHtcclxuICAgICAgICBkaXN0YW5jZS5wdF9wb2ludF9hYWJiKHB0LCBzcGhlcmUuY2VudGVyLCBhYWJiKTtcclxuICAgICAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlLmNlbnRlciwgcHQpIDwgc3BoZXJlLnJhZGl1cyAqIHNwaGVyZS5yYWRpdXM7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBzcGhlcmUtb2JiIGludGVyc2VjdCBkZXRlY3QuXHJcbiAqIEB6aFxyXG4gKiDnkIPlkozmlrnlkJHljIXlm7Tnm5LnmoTnm7jkuqTmgKfmo4DmtYvjgIJcclxuICogQHBhcmFtIHtzcGhlcmV9IHNwaGVyZSDnkINcclxuICogQHBhcmFtIHtvYmJ9IG9iYiDmlrnlkJHljIXlm7Tnm5JcclxuICogQHJldHVybiB7Ym9vbGVhbn0gdHJ1ZSBvciBmYWxzZVxyXG4gKi9cclxuY29uc3Qgc3BoZXJlX29iYiA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBwdCA9IG5ldyBWZWMzKCk7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNwaGVyZTogc3BoZXJlLCBvYmI6IG9iYik6IGJvb2xlYW4ge1xyXG4gICAgICAgIGRpc3RhbmNlLnB0X3BvaW50X29iYihwdCwgc3BoZXJlLmNlbnRlciwgb2JiKTtcclxuICAgICAgICByZXR1cm4gVmVjMy5zcXVhcmVkRGlzdGFuY2Uoc3BoZXJlLmNlbnRlciwgcHQpIDwgc3BoZXJlLnJhZGl1cyAqIHNwaGVyZS5yYWRpdXM7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBzcGhlcmUtY2Fwc3VsZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog55CD5ZKM6IO25ZuK5L2T55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqL1xyXG5jb25zdCBzcGhlcmVfY2Fwc3VsZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB2M18wID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzEgPSBuZXcgVmVjMygpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChzcGhlcmU6IHNwaGVyZSwgY2Fwc3VsZTogY2Fwc3VsZSkge1xyXG4gICAgICAgIGNvbnN0IHIgPSBzcGhlcmUucmFkaXVzICsgY2Fwc3VsZS5yYWRpdXM7XHJcbiAgICAgICAgY29uc3Qgc3F1YXJlZFIgPSByICogcjtcclxuICAgICAgICBjb25zdCBoID0gVmVjMy5zcXVhcmVkRGlzdGFuY2UoY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCwgY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMSk7XHJcbiAgICAgICAgaWYgKGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIFZlYzMuc3F1YXJlZERpc3RhbmNlKHNwaGVyZS5jZW50ZXIsIGNhcHN1bGUuY2VudGVyKSA8IHNxdWFyZWRSO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QodjNfMCwgc3BoZXJlLmNlbnRlciwgY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgIFZlYzMuc3VidHJhY3QodjNfMSwgY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMSwgY2Fwc3VsZS5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHQgPSBWZWMzLmRvdCh2M18wLCB2M18xKSAvIGg7XHJcbiAgICAgICAgICAgIGlmICh0IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFZlYzMuc3F1YXJlZERpc3RhbmNlKHNwaGVyZS5jZW50ZXIsIGNhcHN1bGUuZWxsaXBzZUNlbnRlcjApIDwgc3F1YXJlZFI7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodCA+IDEpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUuY2VudGVyLCBjYXBzdWxlLmVsbGlwc2VDZW50ZXIxKSA8IHNxdWFyZWRSO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgVmVjMy5zY2FsZUFuZEFkZCh2M18wLCBjYXBzdWxlLmVsbGlwc2VDZW50ZXIwLCB2M18xLCB0KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBWZWMzLnNxdWFyZWREaXN0YW5jZShzcGhlcmUuY2VudGVyLCB2M18wKSA8IHNxdWFyZWRSO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxufSkoKTtcclxuXHJcbi8vIGh0dHA6Ly93d3cuZ2VvbWFsZ29yaXRobXMuY29tL2EwNy1fZGlzdGFuY2UuaHRtbFxyXG4vKipcclxuICogQGVuXHJcbiAqIGNhcHN1bGUtY2Fwc3VsZSBpbnRlcnNlY3QgZGV0ZWN0LlxyXG4gKiBAemhcclxuICog6IO25ZuK5L2T5ZKM6IO25ZuK5L2T55qE55u45Lqk5oCn5qOA5rWL44CCXHJcbiAqL1xyXG5jb25zdCBjYXBzdWxlX2NhcHN1bGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgdjNfMCA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCB2M18xID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzIgPSBuZXcgVmVjMygpO1xyXG4gICAgY29uc3QgdjNfMyA9IG5ldyBWZWMzKCk7XHJcbiAgICBjb25zdCB2M180ID0gbmV3IFZlYzMoKTtcclxuICAgIGNvbnN0IHYzXzUgPSBuZXcgVmVjMygpO1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNhcHN1bGVfY2Fwc3VsZSAoY2Fwc3VsZUE6IGNhcHN1bGUsIGNhcHN1bGVCOiBjYXBzdWxlKSB7XHJcbiAgICAgICAgY29uc3QgdSA9IFZlYzMuc3VidHJhY3QodjNfMCwgY2Fwc3VsZUEuZWxsaXBzZUNlbnRlcjEsIGNhcHN1bGVBLmVsbGlwc2VDZW50ZXIwKTtcclxuICAgICAgICBjb25zdCB2ID0gVmVjMy5zdWJ0cmFjdCh2M18xLCBjYXBzdWxlQi5lbGxpcHNlQ2VudGVyMSwgY2Fwc3VsZUIuZWxsaXBzZUNlbnRlcjApO1xyXG4gICAgICAgIGNvbnN0IHcgPSBWZWMzLnN1YnRyYWN0KHYzXzIsIGNhcHN1bGVBLmVsbGlwc2VDZW50ZXIwLCBjYXBzdWxlQi5lbGxpcHNlQ2VudGVyMCk7XHJcbiAgICAgICAgY29uc3QgYSA9IFZlYzMuZG90KHUsIHUpOyAgICAgICAgIC8vIGFsd2F5cyA+PSAwXHJcbiAgICAgICAgY29uc3QgYiA9IFZlYzMuZG90KHUsIHYpO1xyXG4gICAgICAgIGNvbnN0IGMgPSBWZWMzLmRvdCh2LCB2KTsgICAgICAgICAvLyBhbHdheXMgPj0gMFxyXG4gICAgICAgIGNvbnN0IGQgPSBWZWMzLmRvdCh1LCB3KTtcclxuICAgICAgICBjb25zdCBlID0gVmVjMy5kb3Qodiwgdyk7XHJcbiAgICAgICAgY29uc3QgRCA9IGEgKiBjIC0gYiAqIGI7ICAgICAgICAvLyBhbHdheXMgPj0gMFxyXG4gICAgICAgIGxldCBzYzogbnVtYmVyO1xyXG4gICAgICAgIGxldCBzTjogbnVtYmVyO1xyXG4gICAgICAgIGxldCBzRCA9IEQ7ICAgICAgIC8vIHNjID0gc04gLyBzRCwgZGVmYXVsdCBzRCA9IEQgPj0gMFxyXG4gICAgICAgIGxldCB0YzogbnVtYmVyO1xyXG4gICAgICAgIGxldCB0TjogbnVtYmVyO1xyXG4gICAgICAgIGxldCB0RCA9IEQ7ICAgICAgIC8vIHRjID0gdE4gLyB0RCwgZGVmYXVsdCB0RCA9IEQgPj0gMFxyXG5cclxuICAgICAgICAvLyBjb21wdXRlIHRoZSBsaW5lIHBhcmFtZXRlcnMgb2YgdGhlIHR3byBjbG9zZXN0IHBvaW50c1xyXG4gICAgICAgIGlmIChEIDwgRVBTSUxPTikgeyAvLyB0aGUgbGluZXMgYXJlIGFsbW9zdCBwYXJhbGxlbFxyXG4gICAgICAgICAgICBzTiA9IDAuMDsgICAgICAgICAvLyBmb3JjZSB1c2luZyBwb2ludCBQMCBvbiBzZWdtZW50IFMxXHJcbiAgICAgICAgICAgIHNEID0gMS4wOyAgICAgICAgIC8vIHRvIHByZXZlbnQgcG9zc2libGUgZGl2aXNpb24gYnkgMC4wIGxhdGVyXHJcbiAgICAgICAgICAgIHROID0gZTtcclxuICAgICAgICAgICAgdEQgPSBjO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHsgICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgY2xvc2VzdCBwb2ludHMgb24gdGhlIGluZmluaXRlIGxpbmVzXHJcbiAgICAgICAgICAgIHNOID0gKGIgKiBlIC0gYyAqIGQpO1xyXG4gICAgICAgICAgICB0TiA9IChhICogZSAtIGIgKiBkKTtcclxuICAgICAgICAgICAgaWYgKHNOIDwgMC4wKSB7ICAgICAgICAvLyBzYyA8IDAgPT4gdGhlIHM9MCBlZGdlIGlzIHZpc2libGVcclxuICAgICAgICAgICAgICAgIHNOID0gMC4wO1xyXG4gICAgICAgICAgICAgICAgdE4gPSBlO1xyXG4gICAgICAgICAgICAgICAgdEQgPSBjO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHNOID4gc0QpIHsgIC8vIHNjID4gMSAgPT4gdGhlIHM9MSBlZGdlIGlzIHZpc2libGVcclxuICAgICAgICAgICAgICAgIHNOID0gc0Q7XHJcbiAgICAgICAgICAgICAgICB0TiA9IGUgKyBiO1xyXG4gICAgICAgICAgICAgICAgdEQgPSBjO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodE4gPCAwLjApIHsgICAgICAgICAgICAvLyB0YyA8IDAgPT4gdGhlIHQ9MCBlZGdlIGlzIHZpc2libGVcclxuICAgICAgICAgICAgdE4gPSAwLjA7XHJcbiAgICAgICAgICAgIC8vIHJlY29tcHV0ZSBzYyBmb3IgdGhpcyBlZGdlXHJcbiAgICAgICAgICAgIGlmICgtZCA8IDAuMCkge1xyXG4gICAgICAgICAgICAgICAgc04gPSAwLjA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSBpZiAoLWQgPiBhKSB7XHJcbiAgICAgICAgICAgICAgICBzTiA9IHNEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc04gPSAtZDtcclxuICAgICAgICAgICAgICAgIHNEID0gYTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0TiA+IHREKSB7ICAgICAgLy8gdGMgPiAxICA9PiB0aGUgdD0xIGVkZ2UgaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICB0TiA9IHREO1xyXG4gICAgICAgICAgICAvLyByZWNvbXB1dGUgc2MgZm9yIHRoaXMgZWRnZVxyXG4gICAgICAgICAgICBpZiAoKC1kICsgYikgPCAwLjApIHtcclxuICAgICAgICAgICAgICAgIHNOID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGlmICgoLWQgKyBiKSA+IGEpIHtcclxuICAgICAgICAgICAgICAgIHNOID0gc0Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBzTiA9ICgtZCArIGIpO1xyXG4gICAgICAgICAgICAgICAgc0QgPSBhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGZpbmFsbHkgZG8gdGhlIGRpdmlzaW9uIHRvIGdldCBzYyBhbmQgdGNcclxuICAgICAgICBzYyA9IChNYXRoLmFicyhzTikgPCBFUFNJTE9OID8gMC4wIDogc04gLyBzRCk7XHJcbiAgICAgICAgdGMgPSAoTWF0aC5hYnModE4pIDwgRVBTSUxPTiA/IDAuMCA6IHROIC8gdEQpO1xyXG5cclxuICAgICAgICAvLyBnZXQgdGhlIGRpZmZlcmVuY2Ugb2YgdGhlIHR3byBjbG9zZXN0IHBvaW50c1xyXG4gICAgICAgIGNvbnN0IGRQID0gdjNfMztcclxuICAgICAgICBkUC5zZXQodyk7XHJcbiAgICAgICAgZFAuYWRkKFZlYzMubXVsdGlwbHlTY2FsYXIodjNfNCwgdSwgc2MpKTtcclxuICAgICAgICBkUC5zdWJ0cmFjdChWZWMzLm11bHRpcGx5U2NhbGFyKHYzXzUsIHYsIHRjKSk7XHJcbiAgICAgICAgY29uc3QgcmFkaXVzID0gY2Fwc3VsZUEucmFkaXVzICsgY2Fwc3VsZUIucmFkaXVzO1xyXG4gICAgICAgIHJldHVybiBkUC5sZW5ndGhTcXIoKSA8IHJhZGl1cyAqIHJhZGl1cztcclxuICAgIH07XHJcbn0pKCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEFsZ29yaXRobSBvZiBpbnRlcnNlY3QgZGV0ZWN0IGZvciBiYXNpYyBnZW9tZXRyeS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9leeahOebuOS6pOaAp+ajgOa1i+eul+azleOAglxyXG4gKi9cclxuY29uc3QgaW50ZXJzZWN0ID0ge1xyXG4gICAgcmF5X3NwaGVyZSxcclxuICAgIHJheV9hYWJiLFxyXG4gICAgcmF5X29iYixcclxuICAgIHJheV9wbGFuZSxcclxuICAgIHJheV90cmlhbmdsZSxcclxuICAgIHJheV9jYXBzdWxlLFxyXG5cclxuICAgIHJheV9zdWJNZXNoLFxyXG4gICAgcmF5X21lc2gsXHJcbiAgICByYXlfbW9kZWwsXHJcblxyXG4gICAgbGluZV9zcGhlcmUsXHJcbiAgICBsaW5lX2FhYmIsXHJcbiAgICBsaW5lX29iYixcclxuICAgIGxpbmVfcGxhbmUsXHJcbiAgICBsaW5lX3RyaWFuZ2xlLFxyXG5cclxuICAgIHNwaGVyZV9zcGhlcmUsXHJcbiAgICBzcGhlcmVfYWFiYixcclxuICAgIHNwaGVyZV9vYmIsXHJcbiAgICBzcGhlcmVfcGxhbmUsXHJcbiAgICBzcGhlcmVfZnJ1c3R1bSxcclxuICAgIHNwaGVyZV9mcnVzdHVtX2FjY3VyYXRlLFxyXG4gICAgc3BoZXJlX2NhcHN1bGUsXHJcblxyXG4gICAgYWFiYl9hYWJiLFxyXG4gICAgYWFiYl9vYmIsXHJcbiAgICBhYWJiX3BsYW5lLFxyXG4gICAgYWFiYl9mcnVzdHVtLFxyXG4gICAgYWFiYl9mcnVzdHVtX2FjY3VyYXRlLFxyXG5cclxuICAgIG9iYl9vYmIsXHJcbiAgICBvYmJfcGxhbmUsXHJcbiAgICBvYmJfZnJ1c3R1bSxcclxuICAgIG9iYl9mcnVzdHVtX2FjY3VyYXRlLFxyXG4gICAgb2JiX3BvaW50LFxyXG4gICAgb2JiX2NhcHN1bGUsXHJcblxyXG4gICAgY2Fwc3VsZV9jYXBzdWxlLFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiBnMSDlkowgZzIg55qE55u45Lqk5oCn5qOA5rWL77yM5Y+v5aGr5YWl5Z+656GA5Yeg5L2V5Lit55qE5b2i54q244CCXHJcbiAgICAgKiBAcGFyYW0gZzEg5Yeg5L2VMVxyXG4gICAgICogQHBhcmFtIGcyIOWHoOS9lTJcclxuICAgICAqIEBwYXJhbSBvdXRQdCDlj6/pgInvvIznm7jkuqTngrnjgILvvIjms6jvvJrku4Xpg6jliIblvaLnirbnmoTmo4DmtYvluKbmnInov5nkuKrov5Tlm57lgLzvvIlcclxuICAgICAqL1xyXG4gICAgcmVzb2x2ZSAoZzE6IGFueSwgZzI6IGFueSwgb3V0UHQgPSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgdHlwZTEgPSBnMS5fdHlwZSwgdHlwZTIgPSBnMi5fdHlwZTtcclxuICAgICAgICBjb25zdCByZXNvbHZlciA9IHRoaXNbdHlwZTEgfCB0eXBlMl07XHJcbiAgICAgICAgaWYgKHR5cGUxIDwgdHlwZTIpIHsgcmV0dXJuIHJlc29sdmVyKGcxLCBnMiwgb3V0UHQpOyB9XHJcbiAgICAgICAgZWxzZSB7IHJldHVybiByZXNvbHZlcihnMiwgZzEsIG91dFB0KTsgfVxyXG4gICAgfSxcclxufTtcclxuXHJcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9TUEhFUkVdID0gcmF5X3NwaGVyZTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX0FBQkJdID0gcmF5X2FhYmI7XHJcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9SQVkgfCBlbnVtcy5TSEFQRV9PQkJdID0gcmF5X29iYjtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX1BMQU5FXSA9IHJheV9wbGFuZTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX1RSSUFOR0xFXSA9IHJheV90cmlhbmdsZTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1JBWSB8IGVudW1zLlNIQVBFX0NBUFNVTEVdID0gcmF5X2NhcHN1bGU7XHJcblxyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfTElORSB8IGVudW1zLlNIQVBFX1NQSEVSRV0gPSBsaW5lX3NwaGVyZTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9BQUJCXSA9IGxpbmVfYWFiYjtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9PQkJdID0gbGluZV9vYmI7XHJcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9MSU5FIHwgZW51bXMuU0hBUEVfUExBTkVdID0gbGluZV9wbGFuZTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0xJTkUgfCBlbnVtcy5TSEFQRV9UUklBTkdMRV0gPSBsaW5lX3RyaWFuZ2xlO1xyXG5cclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRV0gPSBzcGhlcmVfc3BoZXJlO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfQUFCQl0gPSBzcGhlcmVfYWFiYjtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRSB8IGVudW1zLlNIQVBFX09CQl0gPSBzcGhlcmVfb2JiO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfUExBTkVdID0gc3BoZXJlX3BsYW5lO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfU1BIRVJFIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBzcGhlcmVfZnJ1c3R1bTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX1NQSEVSRSB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gc3BoZXJlX2ZydXN0dW1fYWNjdXJhdGU7XHJcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9TUEhFUkUgfCBlbnVtcy5TSEFQRV9DQVBTVUxFXSA9IHNwaGVyZV9jYXBzdWxlO1xyXG5cclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0FBQkJdID0gYWFiYl9hYWJiO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX09CQl0gPSBhYWJiX29iYjtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0FBQkIgfCBlbnVtcy5TSEFQRV9QTEFORV0gPSBhYWJiX3BsYW5lO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1dID0gYWFiYl9mcnVzdHVtO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfQUFCQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gYWFiYl9mcnVzdHVtX2FjY3VyYXRlO1xyXG5cclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX09CQl0gPSBvYmJfb2JiO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfUExBTkVdID0gb2JiX3BsYW5lO1xyXG5pbnRlcnNlY3RbZW51bXMuU0hBUEVfT0JCIHwgZW51bXMuU0hBUEVfRlJVU1RVTV0gPSBvYmJfZnJ1c3R1bTtcclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX09CQiB8IGVudW1zLlNIQVBFX0ZSVVNUVU1fQUNDVVJBVEVdID0gb2JiX2ZydXN0dW1fYWNjdXJhdGU7XHJcbmludGVyc2VjdFtlbnVtcy5TSEFQRV9PQkIgfCBlbnVtcy5TSEFQRV9DQVBTVUxFXSA9IG9iYl9jYXBzdWxlO1xyXG5cclxuaW50ZXJzZWN0W2VudW1zLlNIQVBFX0NBUFNVTEVdID0gY2Fwc3VsZV9jYXBzdWxlO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW50ZXJzZWN0O1xyXG4iXX0=