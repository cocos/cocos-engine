(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./define.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./define.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.define);
    global.quad = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _define) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = quad;

  /**
   * @category 3d/primitive
   */

  /**
   * @en
   * Generate a quad with width and height both to 1, centered at origin.
   * @zh
   * 生成一个四边形，宽高都为1，中心在原点。
   * @param options 参数选项。
   */
  function quad(options) {
    var normalizedOptions = (0, _define.applyDefaultGeometryOptions)(options);
    var result = {
      positions: [-0.5, -0.5, 0, // bottom-left
      -0.5, 0.5, 0, // top-left
      0.5, 0.5, 0, // top-right
      0.5, -0.5, 0 // bottom-right
      ],
      indices: [0, 3, 1, 3, 2, 1],
      minPos: {
        x: -0.5,
        y: -0.5,
        z: 0
      },
      maxPos: {
        x: 0.5,
        y: 0.5,
        z: 0
      },
      boundingRadius: Math.sqrt(0.5 * 0.5 + 0.5 * 0.5)
    };

    if (normalizedOptions.includeNormal !== false) {
      result.normals = [0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1];
    }

    if (normalizedOptions.includeUV !== false) {
      result.uvs = [0, 0, 0, 1, 1, 1, 1, 0];
    }

    return result;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvcHJpbWl0aXZlL3F1YWQudHMiXSwibmFtZXMiOlsicXVhZCIsIm9wdGlvbnMiLCJub3JtYWxpemVkT3B0aW9ucyIsInJlc3VsdCIsInBvc2l0aW9ucyIsImluZGljZXMiLCJtaW5Qb3MiLCJ4IiwieSIsInoiLCJtYXhQb3MiLCJib3VuZGluZ1JhZGl1cyIsIk1hdGgiLCJzcXJ0IiwiaW5jbHVkZU5vcm1hbCIsIm5vcm1hbHMiLCJpbmNsdWRlVVYiLCJ1dnMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFNQTs7Ozs7OztBQU9lLFdBQVNBLElBQVQsQ0FBZUMsT0FBZixFQUFzRDtBQUNqRSxRQUFNQyxpQkFBaUIsR0FBRyx5Q0FBNEJELE9BQTVCLENBQTFCO0FBQ0EsUUFBTUUsTUFBaUIsR0FBRztBQUN0QkMsTUFBQUEsU0FBUyxFQUFFLENBQ1AsQ0FBQyxHQURNLEVBQ0QsQ0FBQyxHQURBLEVBQ0ssQ0FETCxFQUNRO0FBQ2YsT0FBQyxHQUZNLEVBRUEsR0FGQSxFQUVLLENBRkwsRUFFUTtBQUNkLFNBSE0sRUFHQSxHQUhBLEVBR0ssQ0FITCxFQUdRO0FBQ2QsU0FKTSxFQUlELENBQUMsR0FKQSxFQUlLLENBSkwsQ0FJUTtBQUpSLE9BRFc7QUFPdEJDLE1BQUFBLE9BQU8sRUFBRSxDQUNMLENBREssRUFDRixDQURFLEVBQ0MsQ0FERCxFQUVMLENBRkssRUFFRixDQUZFLEVBRUMsQ0FGRCxDQVBhO0FBV3RCQyxNQUFBQSxNQUFNLEVBQUU7QUFDSkMsUUFBQUEsQ0FBQyxFQUFFLENBQUMsR0FEQTtBQUNLQyxRQUFBQSxDQUFDLEVBQUUsQ0FBQyxHQURUO0FBQ2NDLFFBQUFBLENBQUMsRUFBRTtBQURqQixPQVhjO0FBY3RCQyxNQUFBQSxNQUFNLEVBQUU7QUFDSkgsUUFBQUEsQ0FBQyxFQUFFLEdBREM7QUFDSUMsUUFBQUEsQ0FBQyxFQUFFLEdBRFA7QUFDWUMsUUFBQUEsQ0FBQyxFQUFFO0FBRGYsT0FkYztBQWlCdEJFLE1BQUFBLGNBQWMsRUFBRUMsSUFBSSxDQUFDQyxJQUFMLENBQVUsTUFBTSxHQUFOLEdBQVksTUFBTSxHQUE1QjtBQWpCTSxLQUExQjs7QUFtQkEsUUFBSVgsaUJBQWlCLENBQUNZLGFBQWxCLEtBQW9DLEtBQXhDLEVBQStDO0FBQzNDWCxNQUFBQSxNQUFNLENBQUNZLE9BQVAsR0FBaUIsQ0FDYixDQURhLEVBQ1YsQ0FEVSxFQUNQLENBRE8sRUFFYixDQUZhLEVBRVYsQ0FGVSxFQUVQLENBRk8sRUFHYixDQUhhLEVBR1YsQ0FIVSxFQUdQLENBSE8sRUFJYixDQUphLEVBSVYsQ0FKVSxFQUlQLENBSk8sQ0FBakI7QUFNSDs7QUFDRCxRQUFJYixpQkFBaUIsQ0FBQ2MsU0FBbEIsS0FBZ0MsS0FBcEMsRUFBMkM7QUFDdkNiLE1BQUFBLE1BQU0sQ0FBQ2MsR0FBUCxHQUFhLENBQ1QsQ0FEUyxFQUNOLENBRE0sRUFFVCxDQUZTLEVBRU4sQ0FGTSxFQUdULENBSFMsRUFHTixDQUhNLEVBSVQsQ0FKUyxFQUlOLENBSk0sQ0FBYjtBQU1IOztBQUNELFdBQU9kLE1BQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgM2QvcHJpbWl0aXZlXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgYXBwbHlEZWZhdWx0R2VvbWV0cnlPcHRpb25zLCBJR2VvbWV0cnksIElHZW9tZXRyeU9wdGlvbnMgfSBmcm9tICcuL2RlZmluZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEdlbmVyYXRlIGEgcXVhZCB3aXRoIHdpZHRoIGFuZCBoZWlnaHQgYm90aCB0byAxLCBjZW50ZXJlZCBhdCBvcmlnaW4uXHJcbiAqIEB6aFxyXG4gKiDnlJ/miJDkuIDkuKrlm5vovrnlvaLvvIzlrr3pq5jpg73kuLox77yM5Lit5b+D5Zyo5Y6f54K544CCXHJcbiAqIEBwYXJhbSBvcHRpb25zIOWPguaVsOmAiemhueOAglxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcXVhZCAob3B0aW9ucz86IElHZW9tZXRyeU9wdGlvbnMpOiBJR2VvbWV0cnkge1xyXG4gICAgY29uc3Qgbm9ybWFsaXplZE9wdGlvbnMgPSBhcHBseURlZmF1bHRHZW9tZXRyeU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICBjb25zdCByZXN1bHQ6IElHZW9tZXRyeSA9IHtcclxuICAgICAgICBwb3NpdGlvbnM6IFtcclxuICAgICAgICAgICAgLTAuNSwgLTAuNSwgMCwgLy8gYm90dG9tLWxlZnRcclxuICAgICAgICAgICAgLTAuNSwgIDAuNSwgMCwgLy8gdG9wLWxlZnRcclxuICAgICAgICAgICAgIDAuNSwgIDAuNSwgMCwgLy8gdG9wLXJpZ2h0XHJcbiAgICAgICAgICAgICAwLjUsIC0wLjUsIDAsIC8vIGJvdHRvbS1yaWdodFxyXG4gICAgICAgICAgXSxcclxuICAgICAgICBpbmRpY2VzOiBbXHJcbiAgICAgICAgICAgIDAsIDMsIDEsXHJcbiAgICAgICAgICAgIDMsIDIsIDEsXHJcbiAgICAgICAgXSxcclxuICAgICAgICBtaW5Qb3M6IHtcclxuICAgICAgICAgICAgeDogLTAuNSwgeTogLTAuNSwgejogMCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIG1heFBvczoge1xyXG4gICAgICAgICAgICB4OiAwLjUsIHk6IDAuNSwgejogMCxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJvdW5kaW5nUmFkaXVzOiBNYXRoLnNxcnQoMC41ICogMC41ICsgMC41ICogMC41KSxcclxuICAgIH07XHJcbiAgICBpZiAobm9ybWFsaXplZE9wdGlvbnMuaW5jbHVkZU5vcm1hbCAhPT0gZmFsc2UpIHtcclxuICAgICAgICByZXN1bHQubm9ybWFscyA9IFtcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICAgICAgMCwgMCwgMSxcclxuICAgICAgICAgIF07XHJcbiAgICB9XHJcbiAgICBpZiAobm9ybWFsaXplZE9wdGlvbnMuaW5jbHVkZVVWICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHJlc3VsdC51dnMgPSBbXHJcbiAgICAgICAgICAgIDAsIDAsXHJcbiAgICAgICAgICAgIDAsIDEsXHJcbiAgICAgICAgICAgIDEsIDEsXHJcbiAgICAgICAgICAgIDEsIDAsXHJcbiAgICAgICAgXTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbn1cclxuIl19