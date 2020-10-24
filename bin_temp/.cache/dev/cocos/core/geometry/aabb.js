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
    global.aabb = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _enums) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;
  _enums = _interopRequireDefault(_enums);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  var _v3_tmp = new _index.Vec3();

  var _v3_tmp2 = new _index.Vec3();

  var _v3_tmp3 = new _index.Vec3();

  var _v3_tmp4 = new _index.Vec3();

  var _m3_tmp = new _index.Mat3(); // https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/


  var transform_extent_m4 = function transform_extent_m4(out, extent, m4) {
    _m3_tmp.m00 = Math.abs(m4.m00);
    _m3_tmp.m01 = Math.abs(m4.m01);
    _m3_tmp.m02 = Math.abs(m4.m02);
    _m3_tmp.m03 = Math.abs(m4.m04);
    _m3_tmp.m04 = Math.abs(m4.m05);
    _m3_tmp.m05 = Math.abs(m4.m06);
    _m3_tmp.m06 = Math.abs(m4.m08);
    _m3_tmp.m07 = Math.abs(m4.m09);
    _m3_tmp.m08 = Math.abs(m4.m10);

    _index.Vec3.transformMat3(out, extent, _m3_tmp);
  };
  /**
   * @en
   * Basic Geometry: Axis-aligned bounding box, using center and half extents structure.
   * @zh
   * 基础几何  轴对齐包围盒，使用中心点和半长宽高的结构。
   */
  // tslint:disable-next-line: class-name


  var aabb = /*#__PURE__*/function () {
    _createClass(aabb, [{
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
    }], [{
      key: "create",

      /**
       * @en
       * create a new aabb
       * @zh
       * 创建一个新的 aabb 实例。
       * @param px - aabb 的原点的 X 坐标。
       * @param py - aabb 的原点的 Y 坐标。
       * @param pz - aabb 的原点的 Z 坐标。
       * @param hw - aabb 宽度的一半。
       * @param hh - aabb 高度的一半。
       * @param hl - aabb 长度的一半。
       * @returns 返回新创建的 aabb 实例。
       */
      value: function create(px, py, pz, hw, hh, hl) {
        return new aabb(px, py, pz, hw, hh, hl);
      }
      /**
       * @en
       * clone a new aabb
       * @zh
       * 克隆一个 aabb。
       * @param a - 克隆的目标。
       * @returns 克隆出的 aabb。
       */

    }, {
      key: "clone",
      value: function clone(a) {
        return new aabb(a.center.x, a.center.y, a.center.z, a.halfExtents.x, a.halfExtents.y, a.halfExtents.z);
      }
      /**
       * @en
       * copy the values from one aabb to another
       * @zh
       * 将从一个 aabb 的值复制到另一个 aabb。
       * @param {aabb} out 接受操作的 aabb。
       * @param {aabb} a 被复制的 aabb。
       * @return {aabb} out 接受操作的 aabb。
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        _index.Vec3.copy(out.center, a.center);

        _index.Vec3.copy(out.halfExtents, a.halfExtents);

        return out;
      }
      /**
       * @en
       * create a new aabb from two corner points
       * @zh
       * 从两个点创建一个新的 aabb。
       * @param out - 接受操作的 aabb。
       * @param minPos - aabb 的最小点。
       * @param maxPos - aabb 的最大点。
       * @returns {aabb} out 接受操作的 aabb。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, minPos, maxPos) {
        _index.Vec3.add(_v3_tmp, maxPos, minPos);

        _index.Vec3.subtract(_v3_tmp2, maxPos, minPos);

        _index.Vec3.multiplyScalar(out.center, _v3_tmp, 0.5);

        _index.Vec3.multiplyScalar(out.halfExtents, _v3_tmp2, 0.5);

        return out;
      }
      /**
       * @en
       * Set the components of a aabb to the given values
       * @zh
       * 将 aabb 的属性设置为给定的值。
       * @param {aabb} out 接受操作的 aabb。
       * @param px - aabb 的原点的 X 坐标。
       * @param py - aabb 的原点的 Y 坐标。
       * @param pz - aabb 的原点的 Z 坐标。
       * @param hw - aabb 宽度的一半。
       * @param hh - aabb 高度的一半。
       * @param hl - aabb 长度度的一半。
       * @return {aabb} out 接受操作的 aabb。
       */

    }, {
      key: "set",
      value: function set(out, px, py, pz, hw, hh, hl) {
        _index.Vec3.set(out.center, px, py, pz);

        _index.Vec3.set(out.halfExtents, hw, hh, hl);

        return out;
      }
      /**
       * @en
       * Merge tow aabb.
       * @zh
       * 合并两个 aabb 到 out。
       * @param out 接受操作的 aabb。
       * @param a 输入的 aabb。
       * @param b 输入的 aabb。
       * @returns {aabb} out 接受操作的 aabb。
       */

    }, {
      key: "merge",
      value: function merge(out, a, b) {
        _index.Vec3.subtract(_v3_tmp, a.center, a.halfExtents);

        _index.Vec3.subtract(_v3_tmp2, b.center, b.halfExtents);

        _index.Vec3.add(_v3_tmp3, a.center, a.halfExtents);

        _index.Vec3.add(_v3_tmp4, b.center, b.halfExtents);

        _index.Vec3.max(_v3_tmp4, _v3_tmp3, _v3_tmp4);

        _index.Vec3.min(_v3_tmp3, _v3_tmp, _v3_tmp2);

        return aabb.fromPoints(out, _v3_tmp3, _v3_tmp4);
      }
      /**
       * @en
       * Transform this aabb.
       * @zh
       * 变换一个 aabb 到 out 中。
       * @param out 接受操作的 aabb。
       * @param a 输入的源 aabb。
       * @param matrix 矩阵。
       * @returns {aabb} out 接受操作的 aabb。
       */

    }, {
      key: "transform",
      value: function transform(out, a, matrix) {
        _index.Vec3.transformMat4(out.center, a.center, matrix);

        transform_extent_m4(out.halfExtents, a.halfExtents, matrix);
        return out;
      }
      /**
       * @zh
       * 本地坐标的中心点。
       */

    }]);

    function aabb() {
      var px = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var py = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var pz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var hw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var hh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var hl = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

      _classCallCheck(this, aabb);

      this.center = void 0;
      this.halfExtents = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_AABB;
      this.center = new _index.Vec3(px, py, pz);
      this.halfExtents = new _index.Vec3(hw, hh, hl);
    }
    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 aabb 的最小点和最大点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */


    _createClass(aabb, [{
      key: "getBoundary",
      value: function getBoundary(minPos, maxPos) {
        _index.Vec3.subtract(minPos, this.center, this.halfExtents);

        _index.Vec3.add(maxPos, this.center, this.halfExtents);
      }
      /**
       * @en
       * Transform this shape
       * @zh
       * 将 out 根据这个 aabb 的数据进行变换。
       * @param m 变换的矩阵。
       * @param pos 变换的位置部分。
       * @param rot 变换的旋转部分。
       * @param scale 变换的缩放部分。
       * @param out 变换的目标。
       */

    }, {
      key: "transform",
      value: function transform(m, pos, rot, scale, out) {
        _index.Vec3.transformMat4(out.center, this.center, m);

        transform_extent_m4(out.halfExtents, this.halfExtents, m);
      }
      /**
       * @zh
       * 获得克隆。
       * @returns {aabb}
       */

    }, {
      key: "clone",
      value: function clone() {
        return aabb.clone(this);
      }
      /**
       * @zh
       * 拷贝对象。
       * @param a 拷贝的目标。
       * @returns {aabb}
       */

    }, {
      key: "copy",
      value: function copy(a) {
        return aabb.copy(this, a);
      }
    }]);

    return aabb;
  }();

  _exports.default = aabb;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvYWFiYi50cyJdLCJuYW1lcyI6WyJfdjNfdG1wIiwiVmVjMyIsIl92M190bXAyIiwiX3YzX3RtcDMiLCJfdjNfdG1wNCIsIl9tM190bXAiLCJNYXQzIiwidHJhbnNmb3JtX2V4dGVudF9tNCIsIm91dCIsImV4dGVudCIsIm00IiwibTAwIiwiTWF0aCIsImFicyIsIm0wMSIsIm0wMiIsIm0wMyIsIm0wNCIsIm0wNSIsIm0wNiIsIm0wOCIsIm0wNyIsIm0wOSIsIm0xMCIsInRyYW5zZm9ybU1hdDMiLCJhYWJiIiwiX3R5cGUiLCJweCIsInB5IiwicHoiLCJodyIsImhoIiwiaGwiLCJhIiwiY2VudGVyIiwieCIsInkiLCJ6IiwiaGFsZkV4dGVudHMiLCJjb3B5IiwibWluUG9zIiwibWF4UG9zIiwiYWRkIiwic3VidHJhY3QiLCJtdWx0aXBseVNjYWxhciIsInNldCIsImIiLCJtYXgiLCJtaW4iLCJmcm9tUG9pbnRzIiwibWF0cml4IiwidHJhbnNmb3JtTWF0NCIsImVudW1zIiwiU0hBUEVfQUFCQiIsIm0iLCJwb3MiLCJyb3QiLCJzY2FsZSIsImNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVFBLE1BQU1BLE9BQU8sR0FBRyxJQUFJQyxXQUFKLEVBQWhCOztBQUNBLE1BQU1DLFFBQVEsR0FBRyxJQUFJRCxXQUFKLEVBQWpCOztBQUNBLE1BQU1FLFFBQVEsR0FBRyxJQUFJRixXQUFKLEVBQWpCOztBQUNBLE1BQU1HLFFBQVEsR0FBRyxJQUFJSCxXQUFKLEVBQWpCOztBQUNBLE1BQU1JLE9BQU8sR0FBRyxJQUFJQyxXQUFKLEVBQWhCLEMsQ0FFQTs7O0FBQ0EsTUFBTUMsbUJBQW1CLEdBQUcsU0FBdEJBLG1CQUFzQixDQUFDQyxHQUFELEVBQVlDLE1BQVosRUFBMEJDLEVBQTFCLEVBQXVDO0FBQy9ETCxJQUFBQSxPQUFPLENBQUNNLEdB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QWtCQyxLLEVBQW9CakQsRyxFQUFXO0FBQzFGUCxvQkFBS2tELGFBQUwsQ0FBbUIzQyxHQUFHLENBQUMwQixNQUF2QixFQUErQixLQUFLQSxNQUFwQyxFQUE0Q29CLENBQTVDOztBQUNBL0MsUUFBQUEsbUJBQW1CLENBQUNDLEdBQUcsQ0FBQzhCLFdBQUwsRUFBa0IsS0FBS0EsV0FBdkIsRUFBb0NnQixDQUFwQyxDQUFuQjtBQUNIO0FBRUQ7Ozs7Ozs7OzhCQUtzQjtBQUNsQixlQUFPN0IsSUFBSSxDQUFDaUMsS0FBTCxDQUFXLElBQVgsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OzsyQkFNYXpCLEMsRUFBZTtBQUN4QixlQUFPUixJQUFJLENBQUNjLElBQUwsQ0FBVSxJQUFWLEVBQWdCTixDQUFoQixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdlb21ldHJ5XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0MywgTWF0NCwgUXVhdCwgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vbWF0aC90eXBlLWRlZmluZSc7XHJcblxyXG5jb25zdCBfdjNfdG1wID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX3YzX3RtcDIgPSBuZXcgVmVjMygpO1xyXG5jb25zdCBfdjNfdG1wMyA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF92M190bXA0ID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX20zX3RtcCA9IG5ldyBNYXQzKCk7XHJcblxyXG4vLyBodHRwczovL3pldXhjZy5vcmcvMjAxMC8xMC8xNy9hYWJiLWZyb20tb2JiLXdpdGgtY29tcG9uZW50LXdpc2UtYWJzL1xyXG5jb25zdCB0cmFuc2Zvcm1fZXh0ZW50X200ID0gKG91dDogVmVjMywgZXh0ZW50OiBWZWMzLCBtNDogTWF0NCkgPT4ge1xyXG4gICAgX20zX3RtcC5tMDAgPSBNYXRoLmFicyhtNC5tMDApOyBfbTNfdG1wLm0wMSA9IE1hdGguYWJzKG00Lm0wMSk7IF9tM190bXAubTAyID0gTWF0aC5hYnMobTQubTAyKTtcclxuICAgIF9tM190bXAubTAzID0gTWF0aC5hYnMobTQubTA0KTsgX20zX3RtcC5tMDQgPSBNYXRoLmFicyhtNC5tMDUpOyBfbTNfdG1wLm0wNSA9IE1hdGguYWJzKG00Lm0wNik7XHJcbiAgICBfbTNfdG1wLm0wNiA9IE1hdGguYWJzKG00Lm0wOCk7IF9tM190bXAubTA3ID0gTWF0aC5hYnMobTQubTA5KTsgX20zX3RtcC5tMDggPSBNYXRoLmFicyhtNC5tMTApO1xyXG4gICAgVmVjMy50cmFuc2Zvcm1NYXQzKG91dCwgZXh0ZW50LCBfbTNfdG1wKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQmFzaWMgR2VvbWV0cnk6IEF4aXMtYWxpZ25lZCBib3VuZGluZyBib3gsIHVzaW5nIGNlbnRlciBhbmQgaGFsZiBleHRlbnRzIHN0cnVjdHVyZS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9lSAg6L205a+56b2Q5YyF5Zu055uS77yM5L2/55So5Lit5b+D54K55ZKM5Y2K6ZW/5a696auY55qE57uT5p6E44CCXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6IGNsYXNzLW5hbWVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgYWFiYiB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNyZWF0ZSBhIG5ldyBhYWJiXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBhYWJiIOWunuS+i+OAglxyXG4gICAgICogQHBhcmFtIHB4IC0gYWFiYiDnmoTljp/ngrnnmoQgWCDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBweSAtIGFhYmIg55qE5Y6f54K555qEIFkg5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gcHogLSBhYWJiIOeahOWOn+eCueeahCBaIOWdkOagh+OAglxyXG4gICAgICogQHBhcmFtIGh3IC0gYWFiYiDlrr3luqbnmoTkuIDljYrjgIJcclxuICAgICAqIEBwYXJhbSBoaCAtIGFhYmIg6auY5bqm55qE5LiA5Y2K44CCXHJcbiAgICAgKiBAcGFyYW0gaGwgLSBhYWJiIOmVv+W6pueahOS4gOWNiuOAglxyXG4gICAgICogQHJldHVybnMg6L+U5Zue5paw5Yib5bu655qEIGFhYmIg5a6e5L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY3JlYXRlIChweD86IG51bWJlciwgcHk/OiBudW1iZXIsIHB6PzogbnVtYmVyLCBodz86IG51bWJlciwgaGg/OiBudW1iZXIsIGhsPzogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBhYWJiKHB4LCBweSwgcHosIGh3LCBoaCwgaGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjbG9uZSBhIG5ldyBhYWJiXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWFi+mahuS4gOS4qiBhYWJi44CCXHJcbiAgICAgKiBAcGFyYW0gYSAtIOWFi+mahueahOebruagh+OAglxyXG4gICAgICogQHJldHVybnMg5YWL6ZqG5Ye655qEIGFhYmLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAoYTogYWFiYikge1xyXG4gICAgICAgIHJldHVybiBuZXcgYWFiYihhLmNlbnRlci54LCBhLmNlbnRlci55LCBhLmNlbnRlci56LFxyXG4gICAgICAgICAgICBhLmhhbGZFeHRlbnRzLngsIGEuaGFsZkV4dGVudHMueSwgYS5oYWxmRXh0ZW50cy56KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY29weSB0aGUgdmFsdWVzIGZyb20gb25lIGFhYmIgdG8gYW5vdGhlclxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbku47kuIDkuKogYWFiYiDnmoTlgLzlpI3liLbliLDlj6bkuIDkuKogYWFiYuOAglxyXG4gICAgICogQHBhcmFtIHthYWJifSBvdXQg5o6l5Y+X5pON5L2c55qEIGFhYmLjgIJcclxuICAgICAqIEBwYXJhbSB7YWFiYn0gYSDooqvlpI3liLbnmoQgYWFiYuOAglxyXG4gICAgICogQHJldHVybiB7YWFiYn0gb3V0IOaOpeWPl+aTjeS9nOeahCBhYWJi44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY29weSAob3V0OiBhYWJiLCBhOiBhYWJiKTogYWFiYiB7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5jZW50ZXIsIGEuY2VudGVyKTtcclxuICAgICAgICBWZWMzLmNvcHkob3V0LmhhbGZFeHRlbnRzLCBhLmhhbGZFeHRlbnRzKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY3JlYXRlIGEgbmV3IGFhYmIgZnJvbSB0d28gY29ybmVyIHBvaW50c1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDku47kuKTkuKrngrnliJvlu7rkuIDkuKrmlrDnmoQgYWFiYuOAglxyXG4gICAgICogQHBhcmFtIG91dCAtIOaOpeWPl+aTjeS9nOeahCBhYWJi44CCXHJcbiAgICAgKiBAcGFyYW0gbWluUG9zIC0gYWFiYiDnmoTmnIDlsI/ngrnjgIJcclxuICAgICAqIEBwYXJhbSBtYXhQb3MgLSBhYWJiIOeahOacgOWkp+eCueOAglxyXG4gICAgICogQHJldHVybnMge2FhYmJ9IG91dCDmjqXlj5fmk43kvZznmoQgYWFiYuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21Qb2ludHMgKG91dDogYWFiYiwgbWluUG9zOiBJVmVjM0xpa2UsIG1heFBvczogSVZlYzNMaWtlKTogYWFiYiB7XHJcbiAgICAgICAgVmVjMy5hZGQoX3YzX3RtcCwgbWF4UG9zLCBtaW5Qb3MpO1xyXG4gICAgICAgIFZlYzMuc3VidHJhY3QoX3YzX3RtcDIsIG1heFBvcywgbWluUG9zKTtcclxuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKG91dC5jZW50ZXIsIF92M190bXAsIDAuNSk7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQuaGFsZkV4dGVudHMsIF92M190bXAyLCAwLjUpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIGFhYmIgdG8gdGhlIGdpdmVuIHZhbHVlc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIYgYWFiYiDnmoTlsZ7mgKforr7nva7kuLrnu5nlrprnmoTlgLzjgIJcclxuICAgICAqIEBwYXJhbSB7YWFiYn0gb3V0IOaOpeWPl+aTjeS9nOeahCBhYWJi44CCXHJcbiAgICAgKiBAcGFyYW0gcHggLSBhYWJiIOeahOWOn+eCueeahCBYIOWdkOagh+OAglxyXG4gICAgICogQHBhcmFtIHB5IC0gYWFiYiDnmoTljp/ngrnnmoQgWSDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBweiAtIGFhYmIg55qE5Y6f54K555qEIFog5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gaHcgLSBhYWJiIOWuveW6pueahOS4gOWNiuOAglxyXG4gICAgICogQHBhcmFtIGhoIC0gYWFiYiDpq5jluqbnmoTkuIDljYrjgIJcclxuICAgICAqIEBwYXJhbSBobCAtIGFhYmIg6ZW/5bqm5bqm55qE5LiA5Y2K44CCXHJcbiAgICAgKiBAcmV0dXJuIHthYWJifSBvdXQg5o6l5Y+X5pON5L2c55qEIGFhYmLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgKG91dDogYWFiYiwgcHg6IG51bWJlciwgcHk6IG51bWJlciwgcHo6IG51bWJlciwgaHc6IG51bWJlciwgaGg6IG51bWJlciwgaGw6IG51bWJlcik6IGFhYmIge1xyXG4gICAgICAgIFZlYzMuc2V0KG91dC5jZW50ZXIsIHB4LCBweSwgcHopO1xyXG4gICAgICAgIFZlYzMuc2V0KG91dC5oYWxmRXh0ZW50cywgaHcsIGhoLCBobCk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogTWVyZ2UgdG93IGFhYmIuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWQiOW5tuS4pOS4qiBhYWJiIOWIsCBvdXTjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5o6l5Y+X5pON5L2c55qEIGFhYmLjgIJcclxuICAgICAqIEBwYXJhbSBhIOi+k+WFpeeahCBhYWJi44CCXHJcbiAgICAgKiBAcGFyYW0gYiDovpPlhaXnmoQgYWFiYuOAglxyXG4gICAgICogQHJldHVybnMge2FhYmJ9IG91dCDmjqXlj5fmk43kvZznmoQgYWFiYuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIG1lcmdlIChvdXQ6IGFhYmIsIGE6IGFhYmIsIGI6IGFhYmIpOiBhYWJiIHtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KF92M190bXAsIGEuY2VudGVyLCBhLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KF92M190bXAyLCBiLmNlbnRlciwgYi5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgVmVjMy5hZGQoX3YzX3RtcDMsIGEuY2VudGVyLCBhLmhhbGZFeHRlbnRzKTtcclxuICAgICAgICBWZWMzLmFkZChfdjNfdG1wNCwgYi5jZW50ZXIsIGIuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIFZlYzMubWF4KF92M190bXA0LCBfdjNfdG1wMywgX3YzX3RtcDQpO1xyXG4gICAgICAgIFZlYzMubWluKF92M190bXAzLCBfdjNfdG1wLCBfdjNfdG1wMik7XHJcbiAgICAgICAgcmV0dXJuIGFhYmIuZnJvbVBvaW50cyhvdXQsIF92M190bXAzLCBfdjNfdG1wNCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRyYW5zZm9ybSB0aGlzIGFhYmIuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWPmOaNouS4gOS4qiBhYWJiIOWIsCBvdXQg5Lit44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOaOpeWPl+aTjeS9nOeahCBhYWJi44CCXHJcbiAgICAgKiBAcGFyYW0gYSDovpPlhaXnmoTmupAgYWFiYuOAglxyXG4gICAgICogQHBhcmFtIG1hdHJpeCDnn6npmLXjgIJcclxuICAgICAqIEByZXR1cm5zIHthYWJifSBvdXQg5o6l5Y+X5pON5L2c55qEIGFhYmLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyB0cmFuc2Zvcm0gKG91dDogYWFiYiwgYTogYWFiYiwgbWF0cml4OiBNYXQ0KTogYWFiYiB7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIGEuY2VudGVyLCBtYXRyaXgpO1xyXG4gICAgICAgIHRyYW5zZm9ybV9leHRlbnRfbTQob3V0LmhhbGZFeHRlbnRzLCBhLmhhbGZFeHRlbnRzLCBtYXRyaXgpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOacrOWcsOWdkOagh+eahOS4reW/g+eCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2VudGVyOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDplb/lrr3pq5jnmoTkuIDljYrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGhhbGZFeHRlbnRzOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBzaGFwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5b2i54q255qE57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3R5cGU6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvciAocHggPSAwLCBweSA9IDAsIHB6ID0gMCwgaHcgPSAxLCBoaCA9IDEsIGhsID0gMSkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBlbnVtcy5TSEFQRV9BQUJCO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlYzMocHgsIHB5LCBweik7XHJcbiAgICAgICAgdGhpcy5oYWxmRXh0ZW50cyA9IG5ldyBWZWMzKGh3LCBoaCwgaGwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgdGhlIGJvdW5kaW5nIHBvaW50cyBvZiB0aGlzIHNoYXBlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPliBhYWJiIOeahOacgOWwj+eCueWSjOacgOWkp+eCueOAglxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3Mg5pyA5bCP54K544CCXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvcyDmnIDlpKfngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJvdW5kYXJ5IChtaW5Qb3M6IElWZWMzTGlrZSwgbWF4UG9zOiBJVmVjM0xpa2UpIHtcclxuICAgICAgICBWZWMzLnN1YnRyYWN0KG1pblBvcywgdGhpcy5jZW50ZXIsIHRoaXMuaGFsZkV4dGVudHMpO1xyXG4gICAgICAgIFZlYzMuYWRkKG1heFBvcywgdGhpcy5jZW50ZXIsIHRoaXMuaGFsZkV4dGVudHMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUcmFuc2Zvcm0gdGhpcyBzaGFwZVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIYgb3V0IOagueaNrui/meS4qiBhYWJiIOeahOaVsOaNrui/m+ihjOWPmOaNouOAglxyXG4gICAgICogQHBhcmFtIG0g5Y+Y5o2i55qE55+p6Zi144CCXHJcbiAgICAgKiBAcGFyYW0gcG9zIOWPmOaNoueahOS9jee9rumDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHJvdCDlj5jmjaLnmoTml4vovazpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBzY2FsZSDlj5jmjaLnmoTnvKnmlL7pg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5Y+Y5o2i55qE55uu5qCH44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2Zvcm0gKG06IE1hdDQsIHBvczogVmVjMyB8IG51bGwsIHJvdDogUXVhdCB8IG51bGwsIHNjYWxlOiBWZWMzIHwgbnVsbCwgb3V0OiBhYWJiKSB7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIHRoaXMuY2VudGVyLCBtKTtcclxuICAgICAgICB0cmFuc2Zvcm1fZXh0ZW50X200KG91dC5oYWxmRXh0ZW50cywgdGhpcy5oYWxmRXh0ZW50cywgbSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+W+l+WFi+mahuOAglxyXG4gICAgICogQHJldHVybnMge2FhYmJ9XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKTogYWFiYiB7XHJcbiAgICAgICAgcmV0dXJuIGFhYmIuY2xvbmUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaLt+i0neWvueixoeOAglxyXG4gICAgICogQHBhcmFtIGEg5ou36LSd55qE55uu5qCH44CCXHJcbiAgICAgKiBAcmV0dXJucyB7YWFiYn1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGNvcHkgKGE6IGFhYmIpOiBhYWJiIHtcclxuICAgICAgICByZXR1cm4gYWFiYi5jb3B5KHRoaXMsIGEpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==