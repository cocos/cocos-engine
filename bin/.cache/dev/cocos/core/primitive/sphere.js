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
    global.sphere = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = sphere;

  /**
   * @category 3d/primitive
   */

  /**
   * @en
   * Generate a shpere with radius 0.5.
   * @zh
   * 生成一个球。
   * @param radius 球半径。
   * @param options 参数选项。
   */
  function sphere() {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var segments = opts.segments !== undefined ? opts.segments : 32; // lat === latitude
    // lon === longitude

    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];
    var minPos = new _index.Vec3(-radius, -radius, -radius);
    var maxPos = new _index.Vec3(radius, radius, radius);
    var boundingRadius = radius;

    for (var lat = 0; lat <= segments; ++lat) {
      var theta = lat * Math.PI / segments;
      var sinTheta = Math.sin(theta);
      var cosTheta = -Math.cos(theta);

      for (var lon = 0; lon <= segments; ++lon) {
        var phi = lon * 2 * Math.PI / segments - Math.PI / 2.0;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var x = sinPhi * sinTheta;
        var y = cosTheta;
        var z = cosPhi * sinTheta;
        var u = lon / segments;
        var v = lat / segments;
        positions.push(x * radius, y * radius, z * radius);
        normals.push(x, y, z);
        uvs.push(u, v);

        if (lat < segments && lon < segments) {
          var seg1 = segments + 1;
          var a = seg1 * lat + lon;
          var b = seg1 * (lat + 1) + lon;
          var c = seg1 * (lat + 1) + lon + 1;
          var d = seg1 * lat + lon + 1;
          indices.push(a, d, b);
          indices.push(d, c, b);
        }
      }
    }

    return {
      positions: positions,
      indices: indices,
      normals: normals,
      uvs: uvs,
      minPos: minPos,
      maxPos: maxPos,
      boundingRadius: boundingRadius
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL3NwaGVyZS50cyJdLCJuYW1lcyI6WyJzcGhlcmUiLCJyYWRpdXMiLCJvcHRzIiwic2VnbWVudHMiLCJ1bmRlZmluZWQiLCJwb3NpdGlvbnMiLCJub3JtYWxzIiwidXZzIiwiaW5kaWNlcyIsIm1pblBvcyIsIlZlYzMiLCJtYXhQb3MiLCJib3VuZGluZ1JhZGl1cyIsImxhdCIsInRoZXRhIiwiTWF0aCIsIlBJIiwic2luVGhldGEiLCJzaW4iLCJjb3NUaGV0YSIsImNvcyIsImxvbiIsInBoaSIsInNpblBoaSIsImNvc1BoaSIsIngiLCJ5IiwieiIsInUiLCJ2IiwicHVzaCIsInNlZzEiLCJhIiwiYiIsImMiLCJkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBZUE7Ozs7Ozs7O0FBUWUsV0FBU0EsTUFBVCxHQUF1RjtBQUFBLFFBQXRFQyxNQUFzRSx1RUFBN0QsR0FBNkQ7QUFBQSxRQUF4REMsSUFBd0QsdUVBQWYsRUFBZTtBQUNwRyxRQUFNQyxRQUFRLEdBQUdELElBQUksQ0FBQ0MsUUFBTCxLQUFrQkMsU0FBbEIsR0FBOEJGLElBQUksQ0FBQ0MsUUFBbkMsR0FBOEMsRUFBL0QsQ0FEb0csQ0FHcEc7QUFDQTs7QUFFQSxRQUFNRSxTQUFtQixHQUFHLEVBQTVCO0FBQ0EsUUFBTUMsT0FBaUIsR0FBRyxFQUExQjtBQUNBLFFBQU1DLEdBQWEsR0FBRyxFQUF0QjtBQUNBLFFBQU1DLE9BQWlCLEdBQUcsRUFBMUI7QUFDQSxRQUFNQyxNQUFNLEdBQUcsSUFBSUMsV0FBSixDQUFTLENBQUNULE1BQVYsRUFBa0IsQ0FBQ0EsTUFBbkIsRUFBMkIsQ0FBQ0EsTUFBNUIsQ0FBZjtBQUNBLFFBQU1VLE1BQU0sR0FBRyxJQUFJRCxXQUFKLENBQVNULE1BQVQsRUFBaUJBLE1BQWpCLEVBQXlCQSxNQUF6QixDQUFmO0FBQ0EsUUFBTVcsY0FBYyxHQUFHWCxNQUF2Qjs7QUFFQSxTQUFLLElBQUlZLEdBQUcsR0FBRyxDQUFmLEVBQWtCQSxHQUFHLElBQUlWLFFBQXpCLEVBQW1DLEVBQUVVLEdBQXJDLEVBQTBDO0FBQ3hDLFVBQU1DLEtBQUssR0FBR0QsR0FBRyxHQUFHRSxJQUFJLENBQUNDLEVBQVgsR0FBZ0JiLFFBQTlCO0FBQ0EsVUFBTWMsUUFBUSxHQUFHRixJQUFJLENBQUNHLEdBQUwsQ0FBU0osS0FBVCxDQUFqQjtBQUNBLFVBQU1LLFFBQVEsR0FBRyxDQUFDSixJQUFJLENBQUNLLEdBQUwsQ0FBU04sS0FBVCxDQUFsQjs7QUFFQSxXQUFLLElBQUlPLEdBQUcsR0FBRyxDQUFmLEVBQWtCQSxHQUFHLElBQUlsQixRQUF6QixFQUFtQyxFQUFFa0IsR0FBckMsRUFBMEM7QUFDeEMsWUFBTUMsR0FBRyxHQUFHRCxHQUFHLEdBQUcsQ0FBTixHQUFVTixJQUFJLENBQUNDLEVBQWYsR0FBb0JiLFFBQXBCLEdBQStCWSxJQUFJLENBQUNDLEVBQUwsR0FBVSxHQUFyRDtBQUNBLFlBQU1PLE1BQU0sR0FBR1IsSUFBSSxDQUFDRyxHQUFMLENBQVNJLEdBQVQsQ0FBZjtBQUNBLFlBQU1FLE1BQU0sR0FBR1QsSUFBSSxDQUFDSyxHQUFMLENBQVNFLEdBQVQsQ0FBZjtBQUVBLFlBQU1HLENBQUMsR0FBR0YsTUFBTSxHQUFHTixRQUFuQjtBQUNBLFlBQU1TLENBQUMsR0FBR1AsUUFBVjtBQUNBLFlBQU1RLENBQUMsR0FBR0gsTUFBTSxHQUFHUCxRQUFuQjtBQUNBLFlBQU1XLENBQUMsR0FBR1AsR0FBRyxHQUFHbEIsUUFBaEI7QUFDQSxZQUFNMEIsQ0FBQyxHQUFHaEIsR0FBRyxHQUFHVixRQUFoQjtBQUVBRSxRQUFBQSxTQUFTLENBQUN5QixJQUFWLENBQWVMLENBQUMsR0FBR3hCLE1BQW5CLEVBQTJCeUIsQ0FBQyxHQUFHekIsTUFBL0IsRUFBdUMwQixDQUFDLEdBQUcxQixNQUEzQztBQUNBSyxRQUFBQSxPQUFPLENBQUN3QixJQUFSLENBQWFMLENBQWIsRUFBZ0JDLENBQWhCLEVBQW1CQyxDQUFuQjtBQUNBcEIsUUFBQUEsR0FBRyxDQUFDdUIsSUFBSixDQUFTRixDQUFULEVBQVlDLENBQVo7O0FBRUEsWUFBS2hCLEdBQUcsR0FBR1YsUUFBUCxJQUFxQmtCLEdBQUcsR0FBR2xCLFFBQS9CLEVBQTBDO0FBQ3hDLGNBQU00QixJQUFJLEdBQUc1QixRQUFRLEdBQUcsQ0FBeEI7QUFDQSxjQUFNNkIsQ0FBQyxHQUFHRCxJQUFJLEdBQUdsQixHQUFQLEdBQWFRLEdBQXZCO0FBQ0EsY0FBTVksQ0FBQyxHQUFHRixJQUFJLElBQUlsQixHQUFHLEdBQUcsQ0FBVixDQUFKLEdBQW1CUSxHQUE3QjtBQUNBLGNBQU1hLENBQUMsR0FBR0gsSUFBSSxJQUFJbEIsR0FBRyxHQUFHLENBQVYsQ0FBSixHQUFtQlEsR0FBbkIsR0FBeUIsQ0FBbkM7QUFDQSxjQUFNYyxDQUFDLEdBQUdKLElBQUksR0FBR2xCLEdBQVAsR0FBYVEsR0FBYixHQUFtQixDQUE3QjtBQUVBYixVQUFBQSxPQUFPLENBQUNzQixJQUFSLENBQWFFLENBQWIsRUFBZ0JHLENBQWhCLEVBQW1CRixDQUFuQjtBQUNBekIsVUFBQUEsT0FBTyxDQUFDc0IsSUFBUixDQUFhSyxDQUFiLEVBQWdCRCxDQUFoQixFQUFtQkQsQ0FBbkI7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsV0FBTztBQUNMNUIsTUFBQUEsU0FBUyxFQUFUQSxTQURLO0FBRUxHLE1BQUFBLE9BQU8sRUFBUEEsT0FGSztBQUdMRixNQUFBQSxPQUFPLEVBQVBBLE9BSEs7QUFJTEMsTUFBQUEsR0FBRyxFQUFIQSxHQUpLO0FBS0xFLE1BQUFBLE1BQU0sRUFBTkEsTUFMSztBQU1MRSxNQUFBQSxNQUFNLEVBQU5BLE1BTks7QUFPTEMsTUFBQUEsY0FBYyxFQUFkQTtBQVBLLEtBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgM2QvcHJpbWl0aXZlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBJR2VvbWV0cnksIElHZW9tZXRyeU9wdGlvbnMgfSBmcm9tICcuL2RlZmluZSc7XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOeQg+WPguaVsOmAiemhueOAglxyXG4gKi9cclxuaW50ZXJmYWNlIElTcGhlcmVPcHRpb25zIGV4dGVuZHMgSUdlb21ldHJ5T3B0aW9ucyB7XHJcbiAgICBzZWdtZW50czogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEdlbmVyYXRlIGEgc2hwZXJlIHdpdGggcmFkaXVzIDAuNS5cclxuICogQHpoXHJcbiAqIOeUn+aIkOS4gOS4queQg+OAglxyXG4gKiBAcGFyYW0gcmFkaXVzIOeQg+WNiuW+hOOAglxyXG4gKiBAcGFyYW0gb3B0aW9ucyDlj4LmlbDpgInpobnjgIJcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNwaGVyZSAocmFkaXVzID0gMC41LCBvcHRzOiBSZWN1cnNpdmVQYXJ0aWFsPElTcGhlcmVPcHRpb25zPiA9IHt9KTogSUdlb21ldHJ5IHtcclxuICBjb25zdCBzZWdtZW50cyA9IG9wdHMuc2VnbWVudHMgIT09IHVuZGVmaW5lZCA/IG9wdHMuc2VnbWVudHMgOiAzMjtcclxuXHJcbiAgLy8gbGF0ID09PSBsYXRpdHVkZVxyXG4gIC8vIGxvbiA9PT0gbG9uZ2l0dWRlXHJcblxyXG4gIGNvbnN0IHBvc2l0aW9uczogbnVtYmVyW10gPSBbXTtcclxuICBjb25zdCBub3JtYWxzOiBudW1iZXJbXSA9IFtdO1xyXG4gIGNvbnN0IHV2czogbnVtYmVyW10gPSBbXTtcclxuICBjb25zdCBpbmRpY2VzOiBudW1iZXJbXSA9IFtdO1xyXG4gIGNvbnN0IG1pblBvcyA9IG5ldyBWZWMzKC1yYWRpdXMsIC1yYWRpdXMsIC1yYWRpdXMpO1xyXG4gIGNvbnN0IG1heFBvcyA9IG5ldyBWZWMzKHJhZGl1cywgcmFkaXVzLCByYWRpdXMpO1xyXG4gIGNvbnN0IGJvdW5kaW5nUmFkaXVzID0gcmFkaXVzO1xyXG5cclxuICBmb3IgKGxldCBsYXQgPSAwOyBsYXQgPD0gc2VnbWVudHM7ICsrbGF0KSB7XHJcbiAgICBjb25zdCB0aGV0YSA9IGxhdCAqIE1hdGguUEkgLyBzZWdtZW50cztcclxuICAgIGNvbnN0IHNpblRoZXRhID0gTWF0aC5zaW4odGhldGEpO1xyXG4gICAgY29uc3QgY29zVGhldGEgPSAtTWF0aC5jb3ModGhldGEpO1xyXG5cclxuICAgIGZvciAobGV0IGxvbiA9IDA7IGxvbiA8PSBzZWdtZW50czsgKytsb24pIHtcclxuICAgICAgY29uc3QgcGhpID0gbG9uICogMiAqIE1hdGguUEkgLyBzZWdtZW50cyAtIE1hdGguUEkgLyAyLjA7XHJcbiAgICAgIGNvbnN0IHNpblBoaSA9IE1hdGguc2luKHBoaSk7XHJcbiAgICAgIGNvbnN0IGNvc1BoaSA9IE1hdGguY29zKHBoaSk7XHJcblxyXG4gICAgICBjb25zdCB4ID0gc2luUGhpICogc2luVGhldGE7XHJcbiAgICAgIGNvbnN0IHkgPSBjb3NUaGV0YTtcclxuICAgICAgY29uc3QgeiA9IGNvc1BoaSAqIHNpblRoZXRhO1xyXG4gICAgICBjb25zdCB1ID0gbG9uIC8gc2VnbWVudHM7XHJcbiAgICAgIGNvbnN0IHYgPSBsYXQgLyBzZWdtZW50cztcclxuXHJcbiAgICAgIHBvc2l0aW9ucy5wdXNoKHggKiByYWRpdXMsIHkgKiByYWRpdXMsIHogKiByYWRpdXMpO1xyXG4gICAgICBub3JtYWxzLnB1c2goeCwgeSwgeik7XHJcbiAgICAgIHV2cy5wdXNoKHUsIHYpO1xyXG5cclxuICAgICAgaWYgKChsYXQgPCBzZWdtZW50cykgJiYgKGxvbiA8IHNlZ21lbnRzKSkge1xyXG4gICAgICAgIGNvbnN0IHNlZzEgPSBzZWdtZW50cyArIDE7XHJcbiAgICAgICAgY29uc3QgYSA9IHNlZzEgKiBsYXQgKyBsb247XHJcbiAgICAgICAgY29uc3QgYiA9IHNlZzEgKiAobGF0ICsgMSkgKyBsb247XHJcbiAgICAgICAgY29uc3QgYyA9IHNlZzEgKiAobGF0ICsgMSkgKyBsb24gKyAxO1xyXG4gICAgICAgIGNvbnN0IGQgPSBzZWcxICogbGF0ICsgbG9uICsgMTtcclxuXHJcbiAgICAgICAgaW5kaWNlcy5wdXNoKGEsIGQsIGIpO1xyXG4gICAgICAgIGluZGljZXMucHVzaChkLCBjLCBiKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBvc2l0aW9ucyxcclxuICAgIGluZGljZXMsXHJcbiAgICBub3JtYWxzLFxyXG4gICAgdXZzLFxyXG4gICAgbWluUG9zLFxyXG4gICAgbWF4UG9zLFxyXG4gICAgYm91bmRpbmdSYWRpdXMsXHJcbiAgfTtcclxufVxyXG4iXX0=