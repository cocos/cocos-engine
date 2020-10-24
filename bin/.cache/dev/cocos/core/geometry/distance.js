(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.distance = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.point_plane = point_plane;
  _exports.pt_point_plane = pt_point_plane;
  _exports.pt_point_aabb = pt_point_aabb;
  _exports.pt_point_obb = pt_point_obb;
  _exports.pt_point_line = pt_point_line;

  /**
   * @category geometry
   */
  var X = new _index.Vec3();
  var Y = new _index.Vec3();
  var Z = new _index.Vec3();
  var d = new _index.Vec3();
  var min = new _index.Vec3();
  var max = new _index.Vec3();
  var u = new Array(3);
  var e = new Array(3);
  /**
   * @en
   * the distance between a point and a plane
   * @zh
   * 计算点和平面之间的距离。
   * @param {Vec3} point 点。
   * @param {plane} plane 平面。
   * @return 距离。
   */

  function point_plane(point, plane_) {
    return _index.Vec3.dot(plane_.n, point) - plane_.d;
  }
  /**
   * @en
   * the closest point on plane to a given point
   * @zh
   * 计算平面上最接近给定点的点。
   * @param out 最近点。
   * @param point 给定点。
   * @param plane 平面。
   * @return 最近点。
   */


  function pt_point_plane(out, point, plane_) {
    var t = point_plane(point, plane_);
    return _index.Vec3.subtract(out, point, _index.Vec3.multiplyScalar(out, plane_.n, t));
  }
  /**
   * @en
   * the closest point on aabb to a given point
   * @zh
   * 计算 aabb 上最接近给定点的点。
   * @param {Vec3} out 最近点。
   * @param {Vec3} point 给定点。
   * @param {aabb} aabb 轴对齐包围盒。
   * @return {Vec3} 最近点。
   */


  function pt_point_aabb(out, point, aabb_) {
    _index.Vec3.copy(out, point);

    _index.Vec3.subtract(min, aabb_.center, aabb_.halfExtents);

    _index.Vec3.add(max, aabb_.center, aabb_.halfExtents);

    out.x = out.x < min.x ? min.x : out.x;
    out.y = out.y < min.x ? min.y : out.y;
    out.z = out.z < min.x ? min.z : out.z;
    out.x = out.x > max.x ? max.x : out.x;
    out.y = out.y > max.x ? max.y : out.y;
    out.z = out.z > max.x ? max.z : out.z;
    return out;
  }
  /**
   * @en
   * the closest point on obb to a given point
   * @zh
   * 计算 obb 上最接近给定点的点。
   * @param {Vec3} out 最近点。
   * @param {Vec3} point 给定点。
   * @param {obb} obb 方向包围盒。
   * @return {Vec3} 最近点。
   */


  function pt_point_obb(out, point, obb_) {
    _index.Vec3.set(X, obb_.orientation.m00, obb_.orientation.m01, obb_.orientation.m02);

    _index.Vec3.set(Y, obb_.orientation.m03, obb_.orientation.m04, obb_.orientation.m05);

    _index.Vec3.set(Z, obb_.orientation.m06, obb_.orientation.m07, obb_.orientation.m08);

    u[0] = X;
    u[1] = Y;
    u[2] = Z;
    e[0] = obb_.halfExtents.x;
    e[1] = obb_.halfExtents.y;
    e[2] = obb_.halfExtents.z;

    _index.Vec3.subtract(d, point, obb_.center); // Start result at center of obb; make steps from there


    _index.Vec3.set(out, obb_.center.x, obb_.center.y, obb_.center.z); // For each OBB axis...


    for (var i = 0; i < 3; i++) {
      // ...project d onto that axis to get the distance
      // along the axis of d from the obb center
      var dist = _index.Vec3.dot(d, u[i]); // if distance farther than the obb extents, clamp to the obb


      if (dist > e[i]) {
        dist = e[i];
      }

      if (dist < -e[i]) {
        dist = -e[i];
      } // Step that distance along the axis to get world coordinate


      out.x += dist * u[i].x;
      out.y += dist * u[i].y;
      out.z += dist * u[i].z;
    }

    return out;
  }
  /**
   * @en
   * Calculate the nearest point on the line to the given point.
   * @zh
   * 计算给定点距离直线上最近的一点。
   * @param out 最近点
   * @param point 给定点
   * @param linePointA 线上的某点 A
   * @param linePointB 线上的某点 B
   */


  function pt_point_line(out, point, linePointA, linePointB) {
    _index.Vec3.subtract(X, linePointA, linePointB);

    var dir = X;

    var dirSquaredLength = _index.Vec3.lengthSqr(dir);

    if (dirSquaredLength == 0) {
      // The point is at the segment start.
      _index.Vec3.copy(out, linePointA);
    } else {
      // Calculate the projection of the point onto the line extending through the segment.
      _index.Vec3.subtract(X, point, linePointA);

      var t = _index.Vec3.dot(X, dir) / dirSquaredLength;

      if (t < 0) {
        // The point projects beyond the segment start.
        _index.Vec3.copy(out, linePointA);
      } else if (t > 1) {
        // The point projects beyond the segment end.
        _index.Vec3.copy(out, linePointB);
      } else {
        // The point projects between the start and end of the segment.
        _index.Vec3.scaleAndAdd(out, linePointA, dir, t);
      }
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvZGlzdGFuY2UudHMiXSwibmFtZXMiOlsiWCIsIlZlYzMiLCJZIiwiWiIsImQiLCJtaW4iLCJtYXgiLCJ1IiwiQXJyYXkiLCJlIiwicG9pbnRfcGxhbmUiLCJwb2ludCIsInBsYW5lXyIsImRvdCIsIm4iLCJwdF9wb2ludF9wbGFuZSIsIm91dCIsInQiLCJzdWJ0cmFjdCIsIm11bHRpcGx5U2NhbGFyIiwicHRfcG9pbnRfYWFiYiIsImFhYmJfIiwiY29weSIsImNlbnRlciIsImhhbGZFeHRlbnRzIiwiYWRkIiwieCIsInkiLCJ6IiwicHRfcG9pbnRfb2JiIiwib2JiXyIsInNldCIsIm9yaWVudGF0aW9uIiwibTAwIiwibTAxIiwibTAyIiwibTAzIiwibTA0IiwibTA1IiwibTA2IiwibTA3IiwibTA4IiwiaSIsImRpc3QiLCJwdF9wb2ludF9saW5lIiwibGluZVBvaW50QSIsImxpbmVQb2ludEIiLCJkaXIiLCJkaXJTcXVhcmVkTGVuZ3RoIiwibGVuZ3RoU3FyIiwic2NhbGVBbmRBZGQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7QUFRQSxNQUFNQSxDQUFDLEdBQUcsSUFBSUMsV0FBSixFQUFWO0FBQ0EsTUFBTUMsQ0FBQyxHQUFHLElBQUlELFdBQUosRUFBVjtBQUNBLE1BQU1FLENBQUMsR0FBRyxJQUFJRixXQUFKLEVBQVY7QUFDQSxNQUFNRyxDQUFDLEdBQUcsSUFBSUgsV0FBSixFQUFWO0FBQ0EsTUFBTUksR0FBRyxHQUFHLElBQUlKLFdBQUosRUFBWjtBQUNBLE1BQU1LLEdBQUcsR0FBRyxJQUFJTCxXQUFKLEVBQVo7QUFDQSxNQUFNTSxDQUFDLEdBQUcsSUFBSUMsS0FBSixDQUFVLENBQVYsQ0FBVjtBQUNBLE1BQU1DLENBQUMsR0FBRyxJQUFJRCxLQUFKLENBQVUsQ0FBVixDQUFWO0FBRUE7Ozs7Ozs7Ozs7QUFTTyxXQUFTRSxXQUFULENBQXNCQyxLQUF0QixFQUFtQ0MsTUFBbkMsRUFBa0Q7QUFDckQsV0FBT1gsWUFBS1ksR0FBTCxDQUFTRCxNQUFNLENBQUNFLENBQWhCLEVBQW1CSCxLQUFuQixJQUE0QkMsTUFBTSxDQUFDUixDQUExQztBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNXLGNBQVQsQ0FBeUJDLEdBQXpCLEVBQW9DTCxLQUFwQyxFQUFpREMsTUFBakQsRUFBZ0U7QUFDbkUsUUFBTUssQ0FBQyxHQUFHUCxXQUFXLENBQUNDLEtBQUQsRUFBUUMsTUFBUixDQUFyQjtBQUNBLFdBQU9YLFlBQUtpQixRQUFMLENBQWNGLEdBQWQsRUFBbUJMLEtBQW5CLEVBQTBCVixZQUFLa0IsY0FBTCxDQUFvQkgsR0FBcEIsRUFBeUJKLE1BQU0sQ0FBQ0UsQ0FBaEMsRUFBbUNHLENBQW5DLENBQTFCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7QUFVTyxXQUFTRyxhQUFULENBQXdCSixHQUF4QixFQUFtQ0wsS0FBbkMsRUFBZ0RVLEtBQWhELEVBQW1FO0FBQ3RFcEIsZ0JBQUtxQixJQUFMLENBQVVOLEdBQVYsRUFBZUwsS0FBZjs7QUFDQVYsZ0JBQUtpQixRQUFMLENBQWNiLEdBQWQsRUFBbUJnQixLQUFLLENBQUNFLE1BQXpCLEVBQWlDRixLQUFLLENBQUNHLFdBQXZDOztBQUNBdkIsZ0JBQUt3QixHQUFMLENBQVNuQixHQUFULEVBQWNlLEtBQUssQ0FBQ0UsTUFBcEIsRUFBNEJGLEtBQUssQ0FBQ0csV0FBbEM7O0FBRUFSLElBQUFBLEdBQUcsQ0FBQ1UsQ0FBSixHQUFTVixHQUFHLENBQUNVLENBQUosR0FBUXJCLEdBQUcsQ0FBQ3FCLENBQWIsR0FBa0JyQixHQUFHLENBQUNxQixDQUF0QixHQUEwQlYsR0FBRyxDQUFDVSxDQUF0QztBQUNBVixJQUFBQSxHQUFHLENBQUNXLENBQUosR0FBU1gsR0FBRyxDQUFDVyxDQUFKLEdBQVF0QixHQUFHLENBQUNxQixDQUFiLEdBQWtCckIsR0FBRyxDQUFDc0IsQ0FBdEIsR0FBMEJYLEdBQUcsQ0FBQ1csQ0FBdEM7QUFDQVgsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVNaLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRdkIsR0FBRyxDQUFDcUIsQ0FBYixHQUFrQnJCLEdBQUcsQ0FBQ3VCLENBQXRCLEdBQTBCWixHQUFHLENBQUNZLENBQXRDO0FBRUFaLElBQUFBLEdBQUcsQ0FBQ1UsQ0FBSixHQUFTVixHQUFHLENBQUNVLENBQUosR0FBUXBCLEdBQUcsQ0FBQ29CLENBQWIsR0FBa0JwQixHQUFHLENBQUNvQixDQUF0QixHQUEwQlYsR0FBRyxDQUFDVSxDQUF0QztBQUNBVixJQUFBQSxHQUFHLENBQUNXLENBQUosR0FBU1gsR0FBRyxDQUFDVyxDQUFKLEdBQVFyQixHQUFHLENBQUNvQixDQUFiLEdBQWtCcEIsR0FBRyxDQUFDcUIsQ0FBdEIsR0FBMEJYLEdBQUcsQ0FBQ1csQ0FBdEM7QUFDQVgsSUFBQUEsR0FBRyxDQUFDWSxDQUFKLEdBQVNaLEdBQUcsQ0FBQ1ksQ0FBSixHQUFRdEIsR0FBRyxDQUFDb0IsQ0FBYixHQUFrQnBCLEdBQUcsQ0FBQ3NCLENBQXRCLEdBQTBCWixHQUFHLENBQUNZLENBQXRDO0FBQ0EsV0FBT1osR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNhLFlBQVQsQ0FBdUJiLEdBQXZCLEVBQWtDTCxLQUFsQyxFQUErQ21CLElBQS9DLEVBQWdFO0FBQ25FN0IsZ0JBQUs4QixHQUFMLENBQVMvQixDQUFULEVBQVk4QixJQUFJLENBQUNFLFdBQUwsQ0FBaUJDLEdBQTdCLEVBQWtDSCxJQUFJLENBQUNFLFdBQUwsQ0FBaUJFLEdBQW5ELEVBQXdESixJQUFJLENBQUNFLFdBQUwsQ0FBaUJHLEdBQXpFOztBQUNBbEMsZ0JBQUs4QixHQUFMLENBQVM3QixDQUFULEVBQVk0QixJQUFJLENBQUNFLFdBQUwsQ0FBaUJJLEdBQTdCLEVBQWtDTixJQUFJLENBQUNFLFdBQUwsQ0FBaUJLLEdBQW5ELEVBQXdEUCxJQUFJLENBQUNFLFdBQUwsQ0FBaUJNLEdBQXpFOztBQUNBckMsZ0JBQUs4QixHQUFMLENBQVM1QixDQUFULEVBQVkyQixJQUFJLENBQUNFLFdBQUwsQ0FBaUJPLEdBQTdCLEVBQWtDVCxJQUFJLENBQUNFLFdBQUwsQ0FBaUJRLEdBQW5ELEVBQXdEVixJQUFJLENBQUNFLFdBQUwsQ0FBaUJTLEdBQXpFOztBQUVBbEMsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPUCxDQUFQO0FBQ0FPLElBQUFBLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBT0wsQ0FBUDtBQUNBSyxJQUFBQSxDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU9KLENBQVA7QUFDQU0sSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPcUIsSUFBSSxDQUFDTixXQUFMLENBQWlCRSxDQUF4QjtBQUNBakIsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPcUIsSUFBSSxDQUFDTixXQUFMLENBQWlCRyxDQUF4QjtBQUNBbEIsSUFBQUEsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPcUIsSUFBSSxDQUFDTixXQUFMLENBQWlCSSxDQUF4Qjs7QUFFQTNCLGdCQUFLaUIsUUFBTCxDQUFjZCxDQUFkLEVBQWlCTyxLQUFqQixFQUF3Qm1CLElBQUksQ0FBQ1AsTUFBN0IsRUFabUUsQ0FjbkU7OztBQUNBdEIsZ0JBQUs4QixHQUFMLENBQVNmLEdBQVQsRUFBY2MsSUFBSSxDQUFDUCxNQUFMLENBQVlHLENBQTFCLEVBQTZCSSxJQUFJLENBQUNQLE1BQUwsQ0FBWUksQ0FBekMsRUFBNENHLElBQUksQ0FBQ1AsTUFBTCxDQUFZSyxDQUF4RCxFQWZtRSxDQWlCbkU7OztBQUNBLFNBQUssSUFBSWMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBRyxDQUFwQixFQUF1QkEsQ0FBQyxFQUF4QixFQUE0QjtBQUV4QjtBQUNBO0FBQ0EsVUFBSUMsSUFBSSxHQUFHMUMsWUFBS1ksR0FBTCxDQUFTVCxDQUFULEVBQVlHLENBQUMsQ0FBQ21DLENBQUQsQ0FBYixDQUFYLENBSndCLENBTXhCOzs7QUFDQSxVQUFJQyxJQUFJLEdBQUdsQyxDQUFDLENBQUNpQyxDQUFELENBQVosRUFBaUI7QUFDYkMsUUFBQUEsSUFBSSxHQUFHbEMsQ0FBQyxDQUFDaUMsQ0FBRCxDQUFSO0FBQ0g7O0FBQ0QsVUFBSUMsSUFBSSxHQUFHLENBQUNsQyxDQUFDLENBQUNpQyxDQUFELENBQWIsRUFBa0I7QUFDZEMsUUFBQUEsSUFBSSxHQUFHLENBQUNsQyxDQUFDLENBQUNpQyxDQUFELENBQVQ7QUFDSCxPQVp1QixDQWN4Qjs7O0FBQ0ExQixNQUFBQSxHQUFHLENBQUNVLENBQUosSUFBU2lCLElBQUksR0FBR3BDLENBQUMsQ0FBQ21DLENBQUQsQ0FBRCxDQUFLaEIsQ0FBckI7QUFDQVYsTUFBQUEsR0FBRyxDQUFDVyxDQUFKLElBQVNnQixJQUFJLEdBQUdwQyxDQUFDLENBQUNtQyxDQUFELENBQUQsQ0FBS2YsQ0FBckI7QUFDQVgsTUFBQUEsR0FBRyxDQUFDWSxDQUFKLElBQVNlLElBQUksR0FBR3BDLENBQUMsQ0FBQ21DLENBQUQsQ0FBRCxDQUFLZCxDQUFyQjtBQUNIOztBQUNELFdBQU9aLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7QUFVTyxXQUFTNEIsYUFBVCxDQUF3QjVCLEdBQXhCLEVBQW1DTCxLQUFuQyxFQUFnRGtDLFVBQWhELEVBQWtFQyxVQUFsRSxFQUFvRjtBQUN2RjdDLGdCQUFLaUIsUUFBTCxDQUFjbEIsQ0FBZCxFQUFpQjZDLFVBQWpCLEVBQTZCQyxVQUE3Qjs7QUFDQSxRQUFNQyxHQUFHLEdBQUcvQyxDQUFaOztBQUNBLFFBQU1nRCxnQkFBZ0IsR0FBRy9DLFlBQUtnRCxTQUFMLENBQWVGLEdBQWYsQ0FBekI7O0FBRUEsUUFBSUMsZ0JBQWdCLElBQUksQ0FBeEIsRUFBMkI7QUFDdkI7QUFDQS9DLGtCQUFLcUIsSUFBTCxDQUFVTixHQUFWLEVBQWU2QixVQUFmO0FBQ0gsS0FIRCxNQUdPO0FBQ0g7QUFDQTVDLGtCQUFLaUIsUUFBTCxDQUFjbEIsQ0FBZCxFQUFpQlcsS0FBakIsRUFBd0JrQyxVQUF4Qjs7QUFDQSxVQUFNNUIsQ0FBQyxHQUFHaEIsWUFBS1ksR0FBTCxDQUFTYixDQUFULEVBQVkrQyxHQUFaLElBQW1CQyxnQkFBN0I7O0FBRUEsVUFBSS9CLENBQUMsR0FBRyxDQUFSLEVBQVc7QUFDUDtBQUNBaEIsb0JBQUtxQixJQUFMLENBQVVOLEdBQVYsRUFBZTZCLFVBQWY7QUFDSCxPQUhELE1BR08sSUFBSTVCLENBQUMsR0FBRyxDQUFSLEVBQVc7QUFDZDtBQUNBaEIsb0JBQUtxQixJQUFMLENBQVVOLEdBQVYsRUFBZThCLFVBQWY7QUFDSCxPQUhNLE1BR0E7QUFDSDtBQUNBN0Msb0JBQUtpRCxXQUFMLENBQWlCbEMsR0FBakIsRUFBc0I2QixVQUF0QixFQUFrQ0UsR0FBbEMsRUFBdUM5QixDQUF2QztBQUNIO0FBQ0o7QUFDSiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2VvbWV0cnlcclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCBhYWJiIGZyb20gJy4vYWFiYic7XHJcbmltcG9ydCBvYmIgZnJvbSAnLi9vYmInO1xyXG5pbXBvcnQgcGxhbmUgZnJvbSAnLi9wbGFuZSc7XHJcbmNvbnN0IFggPSBuZXcgVmVjMygpO1xyXG5jb25zdCBZID0gbmV3IFZlYzMoKTtcclxuY29uc3QgWiA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IGQgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBtaW4gPSBuZXcgVmVjMygpO1xyXG5jb25zdCBtYXggPSBuZXcgVmVjMygpO1xyXG5jb25zdCB1ID0gbmV3IEFycmF5KDMpO1xyXG5jb25zdCBlID0gbmV3IEFycmF5KDMpO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiB0aGUgZGlzdGFuY2UgYmV0d2VlbiBhIHBvaW50IGFuZCBhIHBsYW5lXHJcbiAqIEB6aFxyXG4gKiDorqHnrpfngrnlkozlubPpnaLkuYvpl7TnmoTot53nprvjgIJcclxuICogQHBhcmFtIHtWZWMzfSBwb2ludCDngrnjgIJcclxuICogQHBhcmFtIHtwbGFuZX0gcGxhbmUg5bmz6Z2i44CCXHJcbiAqIEByZXR1cm4g6Led56a744CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcG9pbnRfcGxhbmUgKHBvaW50OiBWZWMzLCBwbGFuZV86IHBsYW5lKSB7XHJcbiAgICByZXR1cm4gVmVjMy5kb3QocGxhbmVfLm4sIHBvaW50KSAtIHBsYW5lXy5kO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIHRoZSBjbG9zZXN0IHBvaW50IG9uIHBsYW5lIHRvIGEgZ2l2ZW4gcG9pbnRcclxuICogQHpoXHJcbiAqIOiuoeeul+W5s+mdouS4iuacgOaOpei/kee7meWumueCueeahOeCueOAglxyXG4gKiBAcGFyYW0gb3V0IOacgOi/keeCueOAglxyXG4gKiBAcGFyYW0gcG9pbnQg57uZ5a6a54K544CCXHJcbiAqIEBwYXJhbSBwbGFuZSDlubPpnaLjgIJcclxuICogQHJldHVybiDmnIDov5HngrnjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwdF9wb2ludF9wbGFuZSAob3V0OiBWZWMzLCBwb2ludDogVmVjMywgcGxhbmVfOiBwbGFuZSkge1xyXG4gICAgY29uc3QgdCA9IHBvaW50X3BsYW5lKHBvaW50LCBwbGFuZV8pO1xyXG4gICAgcmV0dXJuIFZlYzMuc3VidHJhY3Qob3V0LCBwb2ludCwgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQsIHBsYW5lXy5uLCB0KSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogdGhlIGNsb3Nlc3QgcG9pbnQgb24gYWFiYiB0byBhIGdpdmVuIHBvaW50XHJcbiAqIEB6aFxyXG4gKiDorqHnrpcgYWFiYiDkuIrmnIDmjqXov5Hnu5nlrprngrnnmoTngrnjgIJcclxuICogQHBhcmFtIHtWZWMzfSBvdXQg5pyA6L+R54K544CCXHJcbiAqIEBwYXJhbSB7VmVjM30gcG9pbnQg57uZ5a6a54K544CCXHJcbiAqIEBwYXJhbSB7YWFiYn0gYWFiYiDovbTlr7npvZDljIXlm7Tnm5LjgIJcclxuICogQHJldHVybiB7VmVjM30g5pyA6L+R54K544CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHRfcG9pbnRfYWFiYiAob3V0OiBWZWMzLCBwb2ludDogVmVjMywgYWFiYl86IGFhYmIpOiBWZWMzIHtcclxuICAgIFZlYzMuY29weShvdXQsIHBvaW50KTtcclxuICAgIFZlYzMuc3VidHJhY3QobWluLCBhYWJiXy5jZW50ZXIsIGFhYmJfLmhhbGZFeHRlbnRzKTtcclxuICAgIFZlYzMuYWRkKG1heCwgYWFiYl8uY2VudGVyLCBhYWJiXy5oYWxmRXh0ZW50cyk7XHJcblxyXG4gICAgb3V0LnggPSAob3V0LnggPCBtaW4ueCkgPyBtaW4ueCA6IG91dC54O1xyXG4gICAgb3V0LnkgPSAob3V0LnkgPCBtaW4ueCkgPyBtaW4ueSA6IG91dC55O1xyXG4gICAgb3V0LnogPSAob3V0LnogPCBtaW4ueCkgPyBtaW4ueiA6IG91dC56O1xyXG5cclxuICAgIG91dC54ID0gKG91dC54ID4gbWF4LngpID8gbWF4LnggOiBvdXQueDtcclxuICAgIG91dC55ID0gKG91dC55ID4gbWF4LngpID8gbWF4LnkgOiBvdXQueTtcclxuICAgIG91dC56ID0gKG91dC56ID4gbWF4LngpID8gbWF4LnogOiBvdXQuejtcclxuICAgIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogdGhlIGNsb3Nlc3QgcG9pbnQgb24gb2JiIHRvIGEgZ2l2ZW4gcG9pbnRcclxuICogQHpoXHJcbiAqIOiuoeeulyBvYmIg5LiK5pyA5o6l6L+R57uZ5a6a54K555qE54K544CCXHJcbiAqIEBwYXJhbSB7VmVjM30gb3V0IOacgOi/keeCueOAglxyXG4gKiBAcGFyYW0ge1ZlYzN9IHBvaW50IOe7meWumueCueOAglxyXG4gKiBAcGFyYW0ge29iYn0gb2JiIOaWueWQkeWMheWbtOebkuOAglxyXG4gKiBAcmV0dXJuIHtWZWMzfSDmnIDov5HngrnjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwdF9wb2ludF9vYmIgKG91dDogVmVjMywgcG9pbnQ6IFZlYzMsIG9iYl86IG9iYik6IFZlYzMge1xyXG4gICAgVmVjMy5zZXQoWCwgb2JiXy5vcmllbnRhdGlvbi5tMDAsIG9iYl8ub3JpZW50YXRpb24ubTAxLCBvYmJfLm9yaWVudGF0aW9uLm0wMik7XHJcbiAgICBWZWMzLnNldChZLCBvYmJfLm9yaWVudGF0aW9uLm0wMywgb2JiXy5vcmllbnRhdGlvbi5tMDQsIG9iYl8ub3JpZW50YXRpb24ubTA1KTtcclxuICAgIFZlYzMuc2V0KFosIG9iYl8ub3JpZW50YXRpb24ubTA2LCBvYmJfLm9yaWVudGF0aW9uLm0wNywgb2JiXy5vcmllbnRhdGlvbi5tMDgpO1xyXG5cclxuICAgIHVbMF0gPSBYO1xyXG4gICAgdVsxXSA9IFk7XHJcbiAgICB1WzJdID0gWjtcclxuICAgIGVbMF0gPSBvYmJfLmhhbGZFeHRlbnRzLng7XHJcbiAgICBlWzFdID0gb2JiXy5oYWxmRXh0ZW50cy55O1xyXG4gICAgZVsyXSA9IG9iYl8uaGFsZkV4dGVudHMuejtcclxuXHJcbiAgICBWZWMzLnN1YnRyYWN0KGQsIHBvaW50LCBvYmJfLmNlbnRlcik7XHJcblxyXG4gICAgLy8gU3RhcnQgcmVzdWx0IGF0IGNlbnRlciBvZiBvYmI7IG1ha2Ugc3RlcHMgZnJvbSB0aGVyZVxyXG4gICAgVmVjMy5zZXQob3V0LCBvYmJfLmNlbnRlci54LCBvYmJfLmNlbnRlci55LCBvYmJfLmNlbnRlci56KTtcclxuXHJcbiAgICAvLyBGb3IgZWFjaCBPQkIgYXhpcy4uLlxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcclxuXHJcbiAgICAgICAgLy8gLi4ucHJvamVjdCBkIG9udG8gdGhhdCBheGlzIHRvIGdldCB0aGUgZGlzdGFuY2VcclxuICAgICAgICAvLyBhbG9uZyB0aGUgYXhpcyBvZiBkIGZyb20gdGhlIG9iYiBjZW50ZXJcclxuICAgICAgICBsZXQgZGlzdCA9IFZlYzMuZG90KGQsIHVbaV0pO1xyXG5cclxuICAgICAgICAvLyBpZiBkaXN0YW5jZSBmYXJ0aGVyIHRoYW4gdGhlIG9iYiBleHRlbnRzLCBjbGFtcCB0byB0aGUgb2JiXHJcbiAgICAgICAgaWYgKGRpc3QgPiBlW2ldKSB7XHJcbiAgICAgICAgICAgIGRpc3QgPSBlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGlzdCA8IC1lW2ldKSB7XHJcbiAgICAgICAgICAgIGRpc3QgPSAtZVtpXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFN0ZXAgdGhhdCBkaXN0YW5jZSBhbG9uZyB0aGUgYXhpcyB0byBnZXQgd29ybGQgY29vcmRpbmF0ZVxyXG4gICAgICAgIG91dC54ICs9IGRpc3QgKiB1W2ldLng7XHJcbiAgICAgICAgb3V0LnkgKz0gZGlzdCAqIHVbaV0ueTtcclxuICAgICAgICBvdXQueiArPSBkaXN0ICogdVtpXS56O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG91dDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBDYWxjdWxhdGUgdGhlIG5lYXJlc3QgcG9pbnQgb24gdGhlIGxpbmUgdG8gdGhlIGdpdmVuIHBvaW50LlxyXG4gKiBAemhcclxuICog6K6h566X57uZ5a6a54K56Led56a755u057q/5LiK5pyA6L+R55qE5LiA54K544CCXHJcbiAqIEBwYXJhbSBvdXQg5pyA6L+R54K5XHJcbiAqIEBwYXJhbSBwb2ludCDnu5nlrprngrlcclxuICogQHBhcmFtIGxpbmVQb2ludEEg57q/5LiK55qE5p+Q54K5IEFcclxuICogQHBhcmFtIGxpbmVQb2ludEIg57q/5LiK55qE5p+Q54K5IEJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBwdF9wb2ludF9saW5lIChvdXQ6IFZlYzMsIHBvaW50OiBWZWMzLCBsaW5lUG9pbnRBOiBWZWMzLCBsaW5lUG9pbnRCOiBWZWMzKSB7XHJcbiAgICBWZWMzLnN1YnRyYWN0KFgsIGxpbmVQb2ludEEsIGxpbmVQb2ludEIpO1xyXG4gICAgY29uc3QgZGlyID0gWDtcclxuICAgIGNvbnN0IGRpclNxdWFyZWRMZW5ndGggPSBWZWMzLmxlbmd0aFNxcihkaXIpO1xyXG5cclxuICAgIGlmIChkaXJTcXVhcmVkTGVuZ3RoID09IDApIHtcclxuICAgICAgICAvLyBUaGUgcG9pbnQgaXMgYXQgdGhlIHNlZ21lbnQgc3RhcnQuXHJcbiAgICAgICAgVmVjMy5jb3B5KG91dCwgbGluZVBvaW50QSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIENhbGN1bGF0ZSB0aGUgcHJvamVjdGlvbiBvZiB0aGUgcG9pbnQgb250byB0aGUgbGluZSBleHRlbmRpbmcgdGhyb3VnaCB0aGUgc2VnbWVudC5cclxuICAgICAgICBWZWMzLnN1YnRyYWN0KFgsIHBvaW50LCBsaW5lUG9pbnRBKTtcclxuICAgICAgICBjb25zdCB0ID0gVmVjMy5kb3QoWCwgZGlyKSAvIGRpclNxdWFyZWRMZW5ndGg7XHJcblxyXG4gICAgICAgIGlmICh0IDwgMCkge1xyXG4gICAgICAgICAgICAvLyBUaGUgcG9pbnQgcHJvamVjdHMgYmV5b25kIHRoZSBzZWdtZW50IHN0YXJ0LlxyXG4gICAgICAgICAgICBWZWMzLmNvcHkob3V0LCBsaW5lUG9pbnRBKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHQgPiAxKSB7XHJcbiAgICAgICAgICAgIC8vIFRoZSBwb2ludCBwcm9qZWN0cyBiZXlvbmQgdGhlIHNlZ21lbnQgZW5kLlxyXG4gICAgICAgICAgICBWZWMzLmNvcHkob3V0LCBsaW5lUG9pbnRCKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUaGUgcG9pbnQgcHJvamVjdHMgYmV0d2VlbiB0aGUgc3RhcnQgYW5kIGVuZCBvZiB0aGUgc2VnbWVudC5cclxuICAgICAgICAgICAgVmVjMy5zY2FsZUFuZEFkZChvdXQsIGxpbmVQb2ludEEsIGRpciwgdCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==