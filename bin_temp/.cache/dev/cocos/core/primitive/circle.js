(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../gfx/define.js", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../gfx/define.js"), require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define, global.define);
    global.circle = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define, _define2) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = circle;

  /**
   * @category 3d/primitive
   */

  /**
   * @zh
   * 应用默认圆参数。
   * @param options 圆参数。
   */
  function applyDefaultCircleOptions(options) {
    options = (0, _define2.applyDefaultGeometryOptions)(options);
    options.segments = 64;
    return options;
  }
  /**
   * @en
   * Generate a circle with radius 1, centered at origin,
   * but may be repositioned through the `center` option.
   * @zh
   * 生成一个圆，其半径是单位1，中心点在原点。
   * @param options 参数选项。
   */


  function circle(options) {
    var normalizedOptions = applyDefaultCircleOptions(options);
    var segments = normalizedOptions.segments;
    var positions = new Array(3 * (segments + 1));
    positions[0] = 0;
    positions[1] = 0;
    positions[2] = 0;
    var indices = new Array(1 + segments * 2);
    indices[0] = 0;
    var step = Math.PI * 2 / segments;

    for (var iSegment = 0; iSegment < segments; ++iSegment) {
      var angle = step * iSegment;
      var x = Math.cos(angle);
      var y = Math.sin(angle);
      var p = (iSegment + 1) * 3;
      positions[p + 0] = x;
      positions[p + 1] = y;
      positions[p + 2] = 0;
      var i = iSegment * 2;
      indices[1 + i] = iSegment + 1;
      indices[1 + (i + 1)] = iSegment + 2;
    }

    if (segments > 0) {
      indices[indices.length - 1] = 1;
    }

    var result = {
      positions: positions,
      indices: indices,
      minPos: {
        x: 1,
        y: 1,
        z: 0
      },
      maxPos: {
        x: -1,
        y: -1,
        z: 0
      },
      boundingRadius: 1,
      primitiveMode: _define.GFXPrimitiveMode.TRIANGLE_FAN
    };
    return result;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL2NpcmNsZS50cyJdLCJuYW1lcyI6WyJhcHBseURlZmF1bHRDaXJjbGVPcHRpb25zIiwib3B0aW9ucyIsInNlZ21lbnRzIiwiY2lyY2xlIiwibm9ybWFsaXplZE9wdGlvbnMiLCJwb3NpdGlvbnMiLCJBcnJheSIsImluZGljZXMiLCJzdGVwIiwiTWF0aCIsIlBJIiwiaVNlZ21lbnQiLCJhbmdsZSIsIngiLCJjb3MiLCJ5Iiwic2luIiwicCIsImkiLCJsZW5ndGgiLCJyZXN1bHQiLCJtaW5Qb3MiLCJ6IiwibWF4UG9zIiwiYm91bmRpbmdSYWRpdXMiLCJwcmltaXRpdmVNb2RlIiwiR0ZYUHJpbWl0aXZlTW9kZSIsIlRSSUFOR0xFX0ZBTiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQWtCQTs7Ozs7QUFLQSxXQUFTQSx5QkFBVCxDQUFvQ0MsT0FBcEMsRUFBZ0c7QUFDNUZBLElBQUFBLE9BQU8sR0FBRywwQ0FBNENBLE9BQTVDLENBQVY7QUFDQUEsSUFBQUEsT0FBTyxDQUFDQyxRQUFSLEdBQW1CLEVBQW5CO0FBQ0EsV0FBT0QsT0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7QUFRZSxXQUFTRSxNQUFULENBQWlCRixPQUFqQixFQUF5RjtBQUNwRyxRQUFNRyxpQkFBaUIsR0FBR0oseUJBQXlCLENBQUNDLE9BQUQsQ0FBbkQ7QUFDQSxRQUFNQyxRQUFRLEdBQUdFLGlCQUFpQixDQUFDRixRQUFuQztBQUVBLFFBQU1HLFNBQVMsR0FBRyxJQUFJQyxLQUFKLENBQWtCLEtBQUtKLFFBQVEsR0FBRyxDQUFoQixDQUFsQixDQUFsQjtBQUNBRyxJQUFBQSxTQUFTLENBQUMsQ0FBRCxDQUFULEdBQWUsQ0FBZjtBQUNBQSxJQUFBQSxTQUFTLENBQUMsQ0FBRCxDQUFULEdBQWUsQ0FBZjtBQUNBQSxJQUFBQSxTQUFTLENBQUMsQ0FBRCxDQUFULEdBQWUsQ0FBZjtBQUNBLFFBQU1FLE9BQU8sR0FBRyxJQUFJRCxLQUFKLENBQWtCLElBQUlKLFFBQVEsR0FBRyxDQUFqQyxDQUFoQjtBQUNBSyxJQUFBQSxPQUFPLENBQUMsQ0FBRCxDQUFQLEdBQWEsQ0FBYjtBQUNBLFFBQU1DLElBQUksR0FBR0MsSUFBSSxDQUFDQyxFQUFMLEdBQVUsQ0FBVixHQUFjUixRQUEzQjs7QUFDQSxTQUFLLElBQUlTLFFBQVEsR0FBRyxDQUFwQixFQUF1QkEsUUFBUSxHQUFHVCxRQUFsQyxFQUE0QyxFQUFFUyxRQUE5QyxFQUF3RDtBQUNwRCxVQUFNQyxLQUFLLEdBQUdKLElBQUksR0FBR0csUUFBckI7QUFDQSxVQUFNRSxDQUFDLEdBQUdKLElBQUksQ0FBQ0ssR0FBTCxDQUFTRixLQUFULENBQVY7QUFDQSxVQUFNRyxDQUFDLEdBQUdOLElBQUksQ0FBQ08sR0FBTCxDQUFTSixLQUFULENBQVY7QUFDQSxVQUFNSyxDQUFDLEdBQUcsQ0FBQ04sUUFBUSxHQUFHLENBQVosSUFBaUIsQ0FBM0I7QUFDQU4sTUFBQUEsU0FBUyxDQUFDWSxDQUFDLEdBQUcsQ0FBTCxDQUFULEdBQW1CSixDQUFuQjtBQUNBUixNQUFBQSxTQUFTLENBQUNZLENBQUMsR0FBRyxDQUFMLENBQVQsR0FBbUJGLENBQW5CO0FBQ0FWLE1BQUFBLFNBQVMsQ0FBQ1ksQ0FBQyxHQUFHLENBQUwsQ0FBVCxHQUFtQixDQUFuQjtBQUNBLFVBQU1DLENBQUMsR0FBR1AsUUFBUSxHQUFHLENBQXJCO0FBQ0FKLE1BQUFBLE9BQU8sQ0FBQyxJQUFLVyxDQUFOLENBQVAsR0FBbUJQLFFBQVEsR0FBRyxDQUE5QjtBQUNBSixNQUFBQSxPQUFPLENBQUMsS0FBS1csQ0FBQyxHQUFHLENBQVQsQ0FBRCxDQUFQLEdBQXVCUCxRQUFRLEdBQUcsQ0FBbEM7QUFDSDs7QUFDRCxRQUFJVCxRQUFRLEdBQUcsQ0FBZixFQUFrQjtBQUNkSyxNQUFBQSxPQUFPLENBQUNBLE9BQU8sQ0FBQ1ksTUFBUixHQUFpQixDQUFsQixDQUFQLEdBQThCLENBQTlCO0FBQ0g7O0FBRUQsUUFBTUMsTUFBaUIsR0FBRztBQUN0QmYsTUFBQUEsU0FBUyxFQUFUQSxTQURzQjtBQUV0QkUsTUFBQUEsT0FBTyxFQUFQQSxPQUZzQjtBQUd0QmMsTUFBQUEsTUFBTSxFQUFFO0FBQUVSLFFBQUFBLENBQUMsRUFBRSxDQUFMO0FBQVFFLFFBQUFBLENBQUMsRUFBRSxDQUFYO0FBQWNPLFFBQUFBLENBQUMsRUFBRTtBQUFqQixPQUhjO0FBSXRCQyxNQUFBQSxNQUFNLEVBQUU7QUFBRVYsUUFBQUEsQ0FBQyxFQUFFLENBQUMsQ0FBTjtBQUFTRSxRQUFBQSxDQUFDLEVBQUUsQ0FBQyxDQUFiO0FBQWdCTyxRQUFBQSxDQUFDLEVBQUU7QUFBbkIsT0FKYztBQUt0QkUsTUFBQUEsY0FBYyxFQUFFLENBTE07QUFNdEJDLE1BQUFBLGFBQWEsRUFBRUMseUJBQWlCQztBQU5WLEtBQTFCO0FBU0EsV0FBT1AsTUFBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSAzZC9wcmltaXRpdmVcclxuICovXHJcblxyXG5pbXBvcnQgeyBHRlhQcmltaXRpdmVNb2RlIH0gZnJvbSAnLi4vZ2Z4L2RlZmluZSc7XHJcbmltcG9ydCB7IGFwcGx5RGVmYXVsdEdlb21ldHJ5T3B0aW9ucywgSUdlb21ldHJ5LCBJR2VvbWV0cnlPcHRpb25zIH0gZnJvbSAnLi9kZWZpbmUnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBUaGUgZGVmaW5pdGlvbiBvZiB0aGUgcGFyYW1ldGVyIGZvciBidWlsZGluZyBhIGNpcmNsZS5cclxuICogQHpoXHJcbiAqIOWchuW9ouWPguaVsOmAiemhueOAglxyXG4gKi9cclxuaW50ZXJmYWNlIElDaXJjbGVPcHRpb25zIGV4dGVuZHMgSUdlb21ldHJ5T3B0aW9ucyB7XHJcbiAgICAvLyBUaGUgc2VnbWVudHMuIERlZmF1bHQgdG8gNjQuXHJcbiAgICBzZWdtZW50czogbnVtYmVyO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOW6lOeUqOm7mOiupOWchuWPguaVsOOAglxyXG4gKiBAcGFyYW0gb3B0aW9ucyDlnIblj4LmlbDjgIJcclxuICovXHJcbmZ1bmN0aW9uIGFwcGx5RGVmYXVsdENpcmNsZU9wdGlvbnMgKG9wdGlvbnM/OiBSZWN1cnNpdmVQYXJ0aWFsPElDaXJjbGVPcHRpb25zPik6IElDaXJjbGVPcHRpb25zIHtcclxuICAgIG9wdGlvbnMgPSBhcHBseURlZmF1bHRHZW9tZXRyeU9wdGlvbnM8SUNpcmNsZU9wdGlvbnM+KG9wdGlvbnMpO1xyXG4gICAgb3B0aW9ucy5zZWdtZW50cyA9IDY0O1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgYXMgSUNpcmNsZU9wdGlvbnM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogR2VuZXJhdGUgYSBjaXJjbGUgd2l0aCByYWRpdXMgMSwgY2VudGVyZWQgYXQgb3JpZ2luLFxyXG4gKiBidXQgbWF5IGJlIHJlcG9zaXRpb25lZCB0aHJvdWdoIHRoZSBgY2VudGVyYCBvcHRpb24uXHJcbiAqIEB6aFxyXG4gKiDnlJ/miJDkuIDkuKrlnIbvvIzlhbbljYrlvoTmmK/ljZXkvY0x77yM5Lit5b+D54K55Zyo5Y6f54K544CCXHJcbiAqIEBwYXJhbSBvcHRpb25zIOWPguaVsOmAiemhueOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY2lyY2xlIChvcHRpb25zPzogUmVjdXJzaXZlUGFydGlhbDxJQ2lyY2xlT3B0aW9ucz4gfCBJQ2lyY2xlT3B0aW9ucyk6IElHZW9tZXRyeSB7XHJcbiAgICBjb25zdCBub3JtYWxpemVkT3B0aW9ucyA9IGFwcGx5RGVmYXVsdENpcmNsZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICBjb25zdCBzZWdtZW50cyA9IG5vcm1hbGl6ZWRPcHRpb25zLnNlZ21lbnRzO1xyXG5cclxuICAgIGNvbnN0IHBvc2l0aW9ucyA9IG5ldyBBcnJheTxudW1iZXI+KDMgKiAoc2VnbWVudHMgKyAxKSk7XHJcbiAgICBwb3NpdGlvbnNbMF0gPSAwO1xyXG4gICAgcG9zaXRpb25zWzFdID0gMDtcclxuICAgIHBvc2l0aW9uc1syXSA9IDA7XHJcbiAgICBjb25zdCBpbmRpY2VzID0gbmV3IEFycmF5PG51bWJlcj4oMSArIHNlZ21lbnRzICogMik7XHJcbiAgICBpbmRpY2VzWzBdID0gMDtcclxuICAgIGNvbnN0IHN0ZXAgPSBNYXRoLlBJICogMiAvIHNlZ21lbnRzO1xyXG4gICAgZm9yIChsZXQgaVNlZ21lbnQgPSAwOyBpU2VnbWVudCA8IHNlZ21lbnRzOyArK2lTZWdtZW50KSB7XHJcbiAgICAgICAgY29uc3QgYW5nbGUgPSBzdGVwICogaVNlZ21lbnQ7XHJcbiAgICAgICAgY29uc3QgeCA9IE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICBjb25zdCB5ID0gTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgIGNvbnN0IHAgPSAoaVNlZ21lbnQgKyAxKSAqIDM7XHJcbiAgICAgICAgcG9zaXRpb25zW3AgKyAwXSA9IHg7XHJcbiAgICAgICAgcG9zaXRpb25zW3AgKyAxXSA9IHk7XHJcbiAgICAgICAgcG9zaXRpb25zW3AgKyAyXSA9IDA7XHJcbiAgICAgICAgY29uc3QgaSA9IGlTZWdtZW50ICogMjtcclxuICAgICAgICBpbmRpY2VzWzEgKyAoaSldID0gaVNlZ21lbnQgKyAxO1xyXG4gICAgICAgIGluZGljZXNbMSArIChpICsgMSldID0gaVNlZ21lbnQgKyAyO1xyXG4gICAgfVxyXG4gICAgaWYgKHNlZ21lbnRzID4gMCkge1xyXG4gICAgICAgIGluZGljZXNbaW5kaWNlcy5sZW5ndGggLSAxXSA9IDE7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0OiBJR2VvbWV0cnkgPSB7XHJcbiAgICAgICAgcG9zaXRpb25zLFxyXG4gICAgICAgIGluZGljZXMsXHJcbiAgICAgICAgbWluUG9zOiB7IHg6IDEsIHk6IDEsIHo6IDAgfSxcclxuICAgICAgICBtYXhQb3M6IHsgeDogLTEsIHk6IC0xLCB6OiAwIH0sXHJcbiAgICAgICAgYm91bmRpbmdSYWRpdXM6IDEsXHJcbiAgICAgICAgcHJpbWl0aXZlTW9kZTogR0ZYUHJpbWl0aXZlTW9kZS5UUklBTkdMRV9GQU4sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIl19