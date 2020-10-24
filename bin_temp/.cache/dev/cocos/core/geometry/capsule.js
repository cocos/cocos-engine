(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "./enums.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("./enums.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.enums);
    global.capsule = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _enums) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.capsule = void 0;
  _enums = _interopRequireDefault(_enums);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en
   * Basic Geometry: capsule.
   * @zh
   * 基础几何，胶囊体。
   */
  var capsule = /*#__PURE__*/function () {
    _createClass(capsule, [{
      key: "type",

      /**
       * @en
       * Gets the type of the shape.
       * @zh
       * 获取形状的类型。
       */
      get: function get() {
        return this._type;
      }
    }]);

    function capsule() {
      var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0.5;
      var halfHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.5;
      var axis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

      _classCallCheck(this, capsule);

      this._type = void 0;
      this.radius = void 0;
      this.halfHeight = void 0;
      this.axis = void 0;
      this.center = void 0;
      this.rotation = void 0;
      this.ellipseCenter0 = void 0;
      this.ellipseCenter1 = void 0;
      this._type = _enums.default.SHAPE_CAPSULE;
      this.radius = radius;
      this.halfHeight = halfHeight;
      this.axis = axis;
      this.center = new _index.Vec3();
      this.rotation = new _index.Quat();
      this.ellipseCenter0 = new _index.Vec3(0, halfHeight, 0);
      this.ellipseCenter1 = new _index.Vec3(0, -halfHeight, 0);
      this.updateCache();
    }
    /**
     * @en
     * Transform this capsule.
     * @zh
     * 变换此胶囊体。
     */


    _createClass(capsule, [{
      key: "transform",
      value: function transform(m, pos, rot, scale, out) {
        var ws = scale;
        var s = (0, _index.absMaxComponent)(ws);
        out.radius = this.radius * Math.abs(s);
        var halfTotalWorldHeight = (this.halfHeight + this.radius) * Math.abs(ws.y);
        var halfWorldHeight = halfTotalWorldHeight - out.radius;
        if (halfWorldHeight < 0) halfWorldHeight = 0;
        out.halfHeight = halfWorldHeight;

        _index.Vec3.transformMat4(out.center, this.center, m);

        _index.Quat.multiply(out.rotation, this.rotation, rot);

        out.updateCache();
      }
    }, {
      key: "updateCache",
      value: function updateCache() {
        this.updateLocalCenter();

        _index.Vec3.transformQuat(this.ellipseCenter0, this.ellipseCenter0, this.rotation);

        _index.Vec3.transformQuat(this.ellipseCenter1, this.ellipseCenter1, this.rotation);

        this.ellipseCenter0.add(this.center);
        this.ellipseCenter1.add(this.center);
      }
    }, {
      key: "updateLocalCenter",
      value: function updateLocalCenter() {
        var halfHeight = this.halfHeight;
        var axis = this.axis;

        switch (axis) {
          case 0:
            this.ellipseCenter0.set(halfHeight, 0, 0);
            this.ellipseCenter1.set(-halfHeight, 0, 0);
            break;

          case 1:
            this.ellipseCenter0.set(0, halfHeight, 0);
            this.ellipseCenter1.set(0, -halfHeight, 0);
            break;

          case 2:
            this.ellipseCenter0.set(0, 0, halfHeight);
            this.ellipseCenter1.set(0, 0, -halfHeight);
            break;
        }
      }
    }]);

    return capsule;
  }();

  _exports.capsule = capsule;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvY2Fwc3VsZS50cyJdLCJuYW1lcyI6WyJjYXBzdWxlIiwiX3R5cGUiLCJyYWRpdXMiLCJoYWxmSGVpZ2h0IiwiYXhpcyIsImNlbnRlciIsInJvdGF0aW9uIiwiZWxsaXBzZUNlbnRlcjAiLCJlbGxpcHNlQ2VudGVyMSIsImVudW1zIiwiU0hBUEVfQ0FQU1VMRSIsIlZlYzMiLCJRdWF0IiwidXBkYXRlQ2FjaGUiLCJtIiwicG9zIiwicm90Iiwic2NhbGUiLCJvdXQiLCJ3cyIsInMiLCJNYXRoIiwiYWJzIiwiaGFsZlRvdGFsV29ybGRIZWlnaHQiLCJ5IiwiaGFsZldvcmxkSGVpZ2h0IiwidHJhbnNmb3JtTWF0NCIsIm11bHRpcGx5IiwidXBkYXRlTG9jYWxDZW50ZXIiLCJ0cmFuc2Zvcm1RdWF0IiwiYWRkIiwic2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBOzs7Ozs7TUFNYUEsTzs7OztBQUVUOzs7Ozs7MEJBTVk7QUFDUixlQUFPLEtBQUtDLEtBQVo7QUFDSDs7O0FBZ0RELHVCQUF1RTtBQUFBLFVBQTFEQyxNQUEwRCx1RUFBekMsR0FBeUM7QUFBQSxVQUFwQ0MsVUFBb0MsdUVBQWYsR0FBZTtBQUFBLFVBQVZDLElBQVUsdUVBQUgsQ0FBRzs7QUFBQTs7QUFBQSxXQTlDcERILEtBOENvRDtBQUFBLFdBdEN2RUMsTUFzQ3VFO0FBQUEsV0E5QnZFQyxVQThCdUU7QUFBQSxXQXRCdkVDLElBc0J1RTtBQUFBLFdBZDlEQyxNQWM4RDtBQUFBLFdBTjlEQyxRQU04RDtBQUFBLFdBSDlEQyxjQUc4RDtBQUFBLFdBRjlEQyxjQUU4RDtBQUNuRSxXQUFLUCxLQUFMLEdBQWFRLGVBQU1DLGFBQW5CO0FBQ0EsV0FBS1IsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsV0FBS0MsVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxXQUFLQyxJQUFMLEdBQVlBLElB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KlxyXG4gKiBAY2F0ZWdvcnkgZ2VvbWV0cnlcclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMzLCBRdWF0LCBNYXQ0LCBhYnNNYXhDb21wb25lbnQgfSBmcm9tIFwiLi4vbWF0aFwiO1xyXG5pbXBvcnQgZW51bXMgZnJvbSBcIi4vZW51bXNcIjtcclxuaW1wb3J0IHsgSVZlYzNMaWtlLCBJUXVhdExpa2UgfSBmcm9tIFwiLi4vbWF0aC90eXBlLWRlZmluZVwiO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNpYyBHZW9tZXRyeTogY2Fwc3VsZS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9le+8jOiDtuWbiuS9k+OAglxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIGNhcHN1bGUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBzaGFwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5b2i54q255qE57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3R5cGU6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ2Fwc3VsZSBzcGhlcmUgcmFkaXVzLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDog7blm4rkvZPnkIPpg6jljYrlvoTjgIJcclxuICAgICAqL1xyXG4gICAgcmFkaXVzOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBkaXN0YW5jZSBiZXR3ZWVuIHRoZSBjZW50ZXIgcG9pbnQgb2YgdGhlIGNhcHN1bGUgYW5kIHRoZSBjZW50ZXIgb2YgdGhlIHNwaGVyZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6IO25ZuK5L2T5Lit5b+D54K55ZKM55CD6YOo5ZyG5b+D55qE6Led56a744CCXHJcbiAgICAgKi9cclxuICAgIGhhbGZIZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTG9jYWwgb3JpZW50YXRpb24gb2YgY2Fwc3VsZSBbMCwxLDJdID0+IFt4LHksel0uXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiDtuWbiuS9k+eahOacrOWcsOacneWQke+8jOaYoOWwhOWFs+ezuyBbMCwxLDJdID0+IFt4LHksel3jgIJcclxuICAgICAqL1xyXG4gICAgYXhpczogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgb3JpZ2luIG9mIHRoZSBjYXBzdWxlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDog7blm4rkvZPnmoTljp/ngrnjgIJcclxuICAgICAqL1xyXG4gICAgcmVhZG9ubHkgY2VudGVyOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgcm90YXRpb24gb2YgdGhlIGNhcHN1bGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiDtuWbiuS9k+eahOaXi+i9rOOAglxyXG4gICAgICovXHJcbiAgICByZWFkb25seSByb3RhdGlvbjogUXVhdDtcclxuXHJcbiAgICAvKiogY2FjaGUsIGxvY2FsIGNlbnRlciBvZiBlbGxpcHNlICovXHJcbiAgICByZWFkb25seSBlbGxpcHNlQ2VudGVyMDogVmVjMztcclxuICAgIHJlYWRvbmx5IGVsbGlwc2VDZW50ZXIxOiBWZWMzO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChyYWRpdXM6IG51bWJlciA9IDAuNSwgaGFsZkhlaWdodDogbnVtYmVyID0gMC41LCBheGlzID0gMSkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBlbnVtcy5TSEFQRV9DQVBTVUxFO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcmFkaXVzO1xyXG4gICAgICAgIHRoaXMuaGFsZkhlaWdodCA9IGhhbGZIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5heGlzID0gYXhpcztcclxuXHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVjMygpO1xyXG4gICAgICAgIHRoaXMucm90YXRpb24gPSBuZXcgUXVhdCgpO1xyXG5cclxuICAgICAgICB0aGlzLmVsbGlwc2VDZW50ZXIwID0gbmV3IFZlYzMoMCwgaGFsZkhlaWdodCwgMCk7XHJcbiAgICAgICAgdGhpcy5lbGxpcHNlQ2VudGVyMSA9IG5ldyBWZWMzKDAsIC1oYWxmSGVpZ2h0LCAwKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRyYW5zZm9ybSB0aGlzIGNhcHN1bGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWPmOaNouatpOiDtuWbiuS9k+OAglxyXG4gICAgICovXHJcbiAgICB0cmFuc2Zvcm0gKG06IE1hdDQsIHBvczogSVZlYzNMaWtlLCByb3Q6IElRdWF0TGlrZSwgc2NhbGU6IElWZWMzTGlrZSwgb3V0OiBjYXBzdWxlKSB7XHJcbiAgICAgICAgY29uc3Qgd3MgPSBzY2FsZTtcclxuICAgICAgICBjb25zdCBzID0gYWJzTWF4Q29tcG9uZW50KHdzIGFzIFZlYzMpO1xyXG4gICAgICAgIG91dC5yYWRpdXMgPSB0aGlzLnJhZGl1cyAqIE1hdGguYWJzKHMpO1xyXG5cclxuICAgICAgICBjb25zdCBoYWxmVG90YWxXb3JsZEhlaWdodCA9ICh0aGlzLmhhbGZIZWlnaHQgKyB0aGlzLnJhZGl1cykgKiBNYXRoLmFicyh3cy55KTtcclxuICAgICAgICBsZXQgaGFsZldvcmxkSGVpZ2h0ID0gaGFsZlRvdGFsV29ybGRIZWlnaHQgLSBvdXQucmFkaXVzO1xyXG4gICAgICAgIGlmIChoYWxmV29ybGRIZWlnaHQgPCAwKSBoYWxmV29ybGRIZWlnaHQgPSAwO1xyXG4gICAgICAgIG91dC5oYWxmSGVpZ2h0ID0gaGFsZldvcmxkSGVpZ2h0O1xyXG5cclxuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LmNlbnRlciwgdGhpcy5jZW50ZXIsIG0pO1xyXG4gICAgICAgIFF1YXQubXVsdGlwbHkob3V0LnJvdGF0aW9uLCB0aGlzLnJvdGF0aW9uLCByb3QpO1xyXG4gICAgICAgIG91dC51cGRhdGVDYWNoZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUNhY2hlICgpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZUxvY2FsQ2VudGVyKCk7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1RdWF0KHRoaXMuZWxsaXBzZUNlbnRlcjAsIHRoaXMuZWxsaXBzZUNlbnRlcjAsIHRoaXMucm90YXRpb24pO1xyXG4gICAgICAgIFZlYzMudHJhbnNmb3JtUXVhdCh0aGlzLmVsbGlwc2VDZW50ZXIxLCB0aGlzLmVsbGlwc2VDZW50ZXIxLCB0aGlzLnJvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLmVsbGlwc2VDZW50ZXIwLmFkZCh0aGlzLmNlbnRlcik7XHJcbiAgICAgICAgdGhpcy5lbGxpcHNlQ2VudGVyMS5hZGQodGhpcy5jZW50ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZUxvY2FsQ2VudGVyICgpIHtcclxuICAgICAgICBjb25zdCBoYWxmSGVpZ2h0ID0gdGhpcy5oYWxmSGVpZ2h0O1xyXG4gICAgICAgIGNvbnN0IGF4aXMgPSB0aGlzLmF4aXM7XHJcbiAgICAgICAgc3dpdGNoIChheGlzKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxsaXBzZUNlbnRlcjAuc2V0KGhhbGZIZWlnaHQsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGxpcHNlQ2VudGVyMS5zZXQoLWhhbGZIZWlnaHQsIDAsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxsaXBzZUNlbnRlcjAuc2V0KDAsIGhhbGZIZWlnaHQsIDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGxpcHNlQ2VudGVyMS5zZXQoMCwgLWhhbGZIZWlnaHQsIDApO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxsaXBzZUNlbnRlcjAuc2V0KDAsIDAsIGhhbGZIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGxpcHNlQ2VudGVyMS5zZXQoMCwgMCwgLWhhbGZIZWlnaHQpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSJdfQ==