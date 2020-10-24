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
    global.torus = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = torus;

  /**
   * @category 3d/primitive
   */

  /**
   * @en
   * Generate a torus with raidus 0.4, tube 0.1 and centered at origin.
   * @zh
   * 生成一个环面。
   * @param radius 环面半径。
   * @param tube 管形大小。
   * @param opts 参数选项。
   */
  function torus() {
    var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.4;
    var tube = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.1;
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var radialSegments = opts.radialSegments || 32;
    var tubularSegments = opts.tubularSegments || 32;
    var arc = opts.arc || 2.0 * Math.PI;
    var positions = [];
    var normals = [];
    var uvs = [];
    var indices = [];
    var minPos = new _index.Vec3(-radius - tube, -tube, -radius - tube);
    var maxPos = new _index.Vec3(radius + tube, tube, radius + tube);
    var boundingRadius = radius + tube;

    for (var j = 0; j <= radialSegments; j++) {
      for (var i = 0; i <= tubularSegments; i++) {
        var u = i / tubularSegments;
        var v = j / radialSegments;
        var u1 = u * arc;
        var v1 = v * Math.PI * 2; // vertex

        var x = (radius + tube * Math.cos(v1)) * Math.sin(u1);
        var y = tube * Math.sin(v1);
        var z = (radius + tube * Math.cos(v1)) * Math.cos(u1); // this vector is used to calculate the normal

        var nx = Math.sin(u1) * Math.cos(v1);
        var ny = Math.sin(v1);
        var nz = Math.cos(u1) * Math.cos(v1);
        positions.push(x, y, z);
        normals.push(nx, ny, nz);
        uvs.push(u, v);

        if (i < tubularSegments && j < radialSegments) {
          var seg1 = tubularSegments + 1;
          var a = seg1 * j + i;
          var b = seg1 * (j + 1) + i;
          var c = seg1 * (j + 1) + i + 1;
          var d = seg1 * j + i + 1;
          indices.push(a, d, b);
          indices.push(d, c, b);
        }
      }
    }

    return {
      positions: positions,
      normals: normals,
      uvs: uvs,
      indices: indices,
      minPos: minPos,
      maxPos: maxPos,
      boundingRadius: boundingRadius
    };
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL3RvcnVzLnRzIl0sIm5hbWVzIjpbInRvcnVzIiwicmFkaXVzIiwidHViZSIsIm9wdHMiLCJyYWRpYWxTZWdtZW50cyIsInR1YnVsYXJTZWdtZW50cyIsImFyYyIsIk1hdGgiLCJQSSIsInBvc2l0aW9ucyIsIm5vcm1hbHMiLCJ1dnMiLCJpbmRpY2VzIiwibWluUG9zIiwiVmVjMyIsIm1heFBvcyIsImJvdW5kaW5nUmFkaXVzIiwiaiIsImkiLCJ1IiwidiIsInUxIiwidjEiLCJ4IiwiY29zIiwic2luIiwieSIsInoiLCJueCIsIm55IiwibnoiLCJwdXNoIiwic2VnMSIsImEiLCJiIiwiYyIsImQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFpQkE7Ozs7Ozs7OztBQVNlLFdBQVNBLEtBQVQsR0FBc0Y7QUFBQSxRQUF0RUMsTUFBc0UsdUVBQTdELEdBQTZEO0FBQUEsUUFBeERDLElBQXdELHVFQUFqRCxHQUFpRDtBQUFBLFFBQTVDQyxJQUE0Qyx1RUFBSixFQUFJO0FBQ25HLFFBQU1DLGNBQWMsR0FBR0QsSUFBSSxDQUFDQyxjQUFMLElBQXVCLEVBQTlDO0FBQ0EsUUFBTUMsZUFBZSxHQUFHRixJQUFJLENBQUNFLGVBQUwsSUFBd0IsRUFBaEQ7QUFDQSxRQUFNQyxHQUFHLEdBQUdILElBQUksQ0FBQ0csR0FBTCxJQUFZLE1BQU1DLElBQUksQ0FBQ0MsRUFBbkM7QUFFQSxRQUFNQyxTQUFtQixHQUFHLEVBQTVCO0FBQ0EsUUFBTUMsT0FBaUIsR0FBRyxFQUExQjtBQUNBLFFBQU1DLEdBQWEsR0FBRyxFQUF0QjtBQUNBLFFBQU1DLE9BQWlCLEdBQUcsRUFBMUI7QUFDQSxRQUFNQyxNQUFNLEdBQUcsSUFBSUMsV0FBSixDQUFTLENBQUNiLE1BQUQsR0FBVUMsSUFBbkIsRUFBeUIsQ0FBQ0EsSUFBMUIsRUFBZ0MsQ0FBQ0QsTUFBRCxHQUFVQyxJ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LE1BQUFBLE9BQU8sRUFBUEEsT0FGSztBQUdMQyxNQUFBQSxHQUFHLEVBQUhBLEdBSEs7QUFJTEMsTUFBQUEsT0FBTyxFQUFQQSxPQUpLO0FBS0xDLE1BQUFBLE1BQU0sRUFBTkEsTUFMSztBQU1MRSxNQUFBQSxNQUFNLEVBQU5BLE1BTks7QUFPTEMsTUFBQUEsY0FBYyxFQUFkQTtBQVBLLEtBQVA7QUFTRCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgM2QvcHJpbWl0aXZlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgeyBJR2VvbWV0cnlPcHRpb25zIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDnjq/pnaLlj4LmlbDpgInpobnjgIJcclxuICovXHJcbmludGVyZmFjZSBJVG9ydXNPcHRpb25zIGV4dGVuZHMgSUdlb21ldHJ5T3B0aW9ucyB7XHJcbiAgcmFkaWFsU2VnbWVudHM6IG51bWJlcjtcclxuICB0dWJ1bGFyU2VnbWVudHM6IG51bWJlcjtcclxuICBhcmM6IG51bWJlcjtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBHZW5lcmF0ZSBhIHRvcnVzIHdpdGggcmFpZHVzIDAuNCwgdHViZSAwLjEgYW5kIGNlbnRlcmVkIGF0IG9yaWdpbi5cclxuICogQHpoXHJcbiAqIOeUn+aIkOS4gOS4queOr+mdouOAglxyXG4gKiBAcGFyYW0gcmFkaXVzIOeOr+mdouWNiuW+hOOAglxyXG4gKiBAcGFyYW0gdHViZSDnrqHlvaLlpKflsI/jgIJcclxuICogQHBhcmFtIG9wdHMg5Y+C5pWw6YCJ6aG544CCXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0b3J1cyAocmFkaXVzID0gMC40LCB0dWJlID0gMC4xLCBvcHRzOiBSZWN1cnNpdmVQYXJ0aWFsPElUb3J1c09wdGlvbnM+ID0ge30pIHtcclxuICBjb25zdCByYWRpYWxTZWdtZW50cyA9IG9wdHMucmFkaWFsU2VnbWVudHMgfHwgMzI7XHJcbiAgY29uc3QgdHVidWxhclNlZ21lbnRzID0gb3B0cy50dWJ1bGFyU2VnbWVudHMgfHwgMzI7XHJcbiAgY29uc3QgYXJjID0gb3B0cy5hcmMgfHwgMi4wICogTWF0aC5QSTtcclxuXHJcbiAgY29uc3QgcG9zaXRpb25zOiBudW1iZXJbXSA9IFtdO1xyXG4gIGNvbnN0IG5vcm1hbHM6IG51bWJlcltdID0gW107XHJcbiAgY29uc3QgdXZzOiBudW1iZXJbXSA9IFtdO1xyXG4gIGNvbnN0IGluZGljZXM6IG51bWJlcltdID0gW107XHJcbiAgY29uc3QgbWluUG9zID0gbmV3IFZlYzMoLXJhZGl1cyAtIHR1YmUsIC10dWJlLCAtcmFkaXVzIC0gdHViZSk7XHJcbiAgY29uc3QgbWF4UG9zID0gbmV3IFZlYzMocmFkaXVzICsgdHViZSwgdHViZSwgcmFkaXVzICsgdHViZSk7XHJcbiAgY29uc3QgYm91bmRpbmdSYWRpdXMgPSByYWRpdXMgKyB0dWJlO1xyXG5cclxuICBmb3IgKGxldCBqID0gMDsgaiA8PSByYWRpYWxTZWdtZW50czsgaisrKSB7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8PSB0dWJ1bGFyU2VnbWVudHM7IGkrKykge1xyXG4gICAgICBjb25zdCB1ID0gaSAvIHR1YnVsYXJTZWdtZW50cztcclxuICAgICAgY29uc3QgdiA9IGogLyByYWRpYWxTZWdtZW50cztcclxuXHJcbiAgICAgIGNvbnN0IHUxID0gdSAqIGFyYztcclxuICAgICAgY29uc3QgdjEgPSB2ICogTWF0aC5QSSAqIDI7XHJcblxyXG4gICAgICAvLyB2ZXJ0ZXhcclxuICAgICAgY29uc3QgeCA9IChyYWRpdXMgKyB0dWJlICogTWF0aC5jb3ModjEpKSAqIE1hdGguc2luKHUxKTtcclxuICAgICAgY29uc3QgeSA9IHR1YmUgKiBNYXRoLnNpbih2MSk7XHJcbiAgICAgIGNvbnN0IHogPSAocmFkaXVzICsgdHViZSAqIE1hdGguY29zKHYxKSkgKiBNYXRoLmNvcyh1MSk7XHJcblxyXG4gICAgICAvLyB0aGlzIHZlY3RvciBpcyB1c2VkIHRvIGNhbGN1bGF0ZSB0aGUgbm9ybWFsXHJcbiAgICAgIGNvbnN0IG54ID0gTWF0aC5zaW4odTEpICogTWF0aC5jb3ModjEpO1xyXG4gICAgICBjb25zdCBueSA9IE1hdGguc2luKHYxKTtcclxuICAgICAgY29uc3QgbnogPSBNYXRoLmNvcyh1MSkgKiBNYXRoLmNvcyh2MSk7XHJcblxyXG4gICAgICBwb3NpdGlvbnMucHVzaCh4LCB5LCB6KTtcclxuICAgICAgbm9ybWFscy5wdXNoKG54LCBueSwgbnopO1xyXG4gICAgICB1dnMucHVzaCh1LCB2KTtcclxuXHJcbiAgICAgIGlmICgoaSA8IHR1YnVsYXJTZWdtZW50cykgJiYgKGogPCByYWRpYWxTZWdtZW50cykpIHtcclxuICAgICAgICBjb25zdCBzZWcxID0gdHVidWxhclNlZ21lbnRzICsgMTtcclxuICAgICAgICBjb25zdCBhID0gc2VnMSAqIGogKyBpO1xyXG4gICAgICAgIGNvbnN0IGIgPSBzZWcxICogKGogKyAxKSArIGk7XHJcbiAgICAgICAgY29uc3QgYyA9IHNlZzEgKiAoaiArIDEpICsgaSArIDE7XHJcbiAgICAgICAgY29uc3QgZCA9IHNlZzEgKiBqICsgaSArIDE7XHJcblxyXG4gICAgICAgIGluZGljZXMucHVzaChhLCBkLCBiKTtcclxuICAgICAgICBpbmRpY2VzLnB1c2goZCwgYywgYik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwb3NpdGlvbnMsXHJcbiAgICBub3JtYWxzLFxyXG4gICAgdXZzLFxyXG4gICAgaW5kaWNlcyxcclxuICAgIG1pblBvcyxcclxuICAgIG1heFBvcyxcclxuICAgIGJvdW5kaW5nUmFkaXVzLFxyXG4gIH07XHJcbn1cclxuIl19