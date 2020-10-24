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
    global.obb = mod.exports;
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

  var _m3_tmp = new _index.Mat3(); // https://zeuxcg.org/2010/10/17/aabb-from-obb-with-component-wise-abs/


  var transform_extent_m3 = function transform_extent_m3(out, extent, m3) {
    _m3_tmp.m00 = Math.abs(m3.m00);
    _m3_tmp.m01 = Math.abs(m3.m01);
    _m3_tmp.m02 = Math.abs(m3.m02);
    _m3_tmp.m03 = Math.abs(m3.m03);
    _m3_tmp.m04 = Math.abs(m3.m04);
    _m3_tmp.m05 = Math.abs(m3.m05);
    _m3_tmp.m06 = Math.abs(m3.m06);
    _m3_tmp.m07 = Math.abs(m3.m07);
    _m3_tmp.m08 = Math.abs(m3.m08);

    _index.Vec3.transformMat3(out, extent, _m3_tmp);
  };
  /**
   * @en
   * Basic Geometry: directional bounding box.
   * @zh
   * 基础几何  方向包围盒。
   */
  // tslint:disable-next-line:class-name


  var obb = /*#__PURE__*/function () {
    _createClass(obb, [{
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
       * create a new obb
       * @zh
       * 创建一个新的 obb 实例。
       * @param cx 形状的相对于原点的 X 坐标。
       * @param cy 形状的相对于原点的 Y 坐标。
       * @param cz 形状的相对于原点的 Z 坐标。
       * @param hw - obb 宽度的一半。
       * @param hh - obb 高度的一半。
       * @param hl - obb 长度的一半。
       * @param ox_1 方向矩阵参数。
       * @param ox_2 方向矩阵参数。
       * @param ox_3 方向矩阵参数。
       * @param oy_1 方向矩阵参数。
       * @param oy_2 方向矩阵参数。
       * @param oy_3 方向矩阵参数。
       * @param oz_1 方向矩阵参数。
       * @param oz_2 方向矩阵参数。
       * @param oz_3 方向矩阵参数。
       * @return 返回一个 obb。
       */
      value: function create(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
        return new obb(cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
      }
      /**
       * @en
       * clone a new obb
       * @zh
       * 克隆一个 obb。
       * @param a 克隆的目标。
       * @returns 克隆出的新对象。
       */

    }, {
      key: "clone",
      value: function clone(a) {
        return new obb(a.center.x, a.center.y, a.center.z, a.halfExtents.x, a.halfExtents.y, a.halfExtents.z, a.orientation.m00, a.orientation.m01, a.orientation.m02, a.orientation.m03, a.orientation.m04, a.orientation.m05, a.orientation.m06, a.orientation.m07, a.orientation.m08);
      }
      /**
       * @en
       * copy the values from one obb to another
       * @zh
       * 将从一个 obb 的值复制到另一个 obb。
       * @param {obb} out 接受操作的 obb。
       * @param {obb} a 被复制的 obb。
       * @return {obb} out 接受操作的 obb。
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        _index.Vec3.copy(out.center, a.center);

        _index.Vec3.copy(out.halfExtents, a.halfExtents);

        _index.Mat3.copy(out.orientation, a.orientation);

        return out;
      }
      /**
       * @en
       * create a new obb from two corner points
       * @zh
       * 用两个点创建一个新的 obb。
       * @param out - 接受操作的 obb。
       * @param minPos - obb 的最小点。
       * @param maxPos - obb 的最大点。
       * @returns {obb} out 接受操作的 obb。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, minPos, maxPos) {
        _index.Vec3.multiplyScalar(out.center, _index.Vec3.add(_v3_tmp, minPos, maxPos), 0.5);

        _index.Vec3.multiplyScalar(out.halfExtents, _index.Vec3.subtract(_v3_tmp2, maxPos, minPos), 0.5);

        _index.Mat3.identity(out.orientation);

        return out;
      }
      /**
       * @en
       * Set the components of a obb to the given values
       * @zh
       * 将给定 obb 的属性设置为给定的值。
       * @param cx - obb 的原点的 X 坐标。
       * @param cy - obb 的原点的 Y 坐标。
       * @param cz - obb 的原点的 Z 坐标。
       * @param hw - obb 宽度的一半。
       * @param hh - obb 高度的一半。
       * @param hl - obb 长度的一半。
       * @param ox_1 方向矩阵参数。
       * @param ox_2 方向矩阵参数。
       * @param ox_3 方向矩阵参数。
       * @param oy_1 方向矩阵参数。
       * @param oy_2 方向矩阵参数。
       * @param oy_3 方向矩阵参数。
       * @param oz_1 方向矩阵参数。
       * @param oz_2 方向矩阵参数。
       * @param oz_3 方向矩阵参数。
       * @return {obb} out
       */

    }, {
      key: "set",
      value: function set(out, cx, cy, cz, hw, hh, hl, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3) {
        _index.Vec3.set(out.center, cx, cy, cz);

        _index.Vec3.set(out.halfExtents, hw, hh, hl);

        _index.Mat3.set(out.orientation, ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);

        return out;
      }
      /**
       * @zh
       * 本地坐标的中心点。
       */

    }]);

    function obb() {
      var cx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var cy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var hw = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var hh = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
      var hl = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
      var ox_1 = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
      var ox_2 = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
      var ox_3 = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;
      var oy_1 = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 0;
      var oy_2 = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1;
      var oy_3 = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : 0;
      var oz_1 = arguments.length > 12 && arguments[12] !== undefined ? arguments[12] : 0;
      var oz_2 = arguments.length > 13 && arguments[13] !== undefined ? arguments[13] : 0;
      var oz_3 = arguments.length > 14 && arguments[14] !== undefined ? arguments[14] : 1;

      _classCallCheck(this, obb);

      this.center = void 0;
      this.halfExtents = void 0;
      this.orientation = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_OBB;
      this.center = new _index.Vec3(cx, cy, cz);
      this.halfExtents = new _index.Vec3(hw, hh, hl);
      this.orientation = new _index.Mat3(ox_1, ox_2, ox_3, oy_1, oy_2, oy_3, oz_1, oz_2, oz_3);
    }
    /**
     * @en
     * Get the bounding points of this shape
     * @zh
     * 获取 obb 的最小点和最大点。
     * @param {Vec3} minPos 最小点。
     * @param {Vec3} maxPos 最大点。
     */


    _createClass(obb, [{
      key: "getBoundary",
      value: function getBoundary(minPos, maxPos) {
        transform_extent_m3(_v3_tmp, this.halfExtents, this.orientation);

        _index.Vec3.subtract(minPos, this.center, _v3_tmp);

        _index.Vec3.add(maxPos, this.center, _v3_tmp);
      }
      /**
       * Transform this shape
       * @zh
       * 将 out 根据这个 obb 的数据进行变换。
       * @param m 变换的矩阵。
       * @param pos 变换的位置部分。
       * @param rot 变换的旋转部分。
       * @param scale 变换的缩放部分。
       * @param out 变换的目标。
       */

    }, {
      key: "transform",
      value: function transform(m, pos, rot, scale, out) {
        _index.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


        _index.Mat3.fromQuat(out.orientation, rot);

        _index.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
      }
      /**
       * @zh
       * 将 out 根据这个 obb 的数据进行变换。
       * @param m 变换的矩阵。
       * @param rot 变换的旋转部分。
       * @param out 变换的目标。
       */

    }, {
      key: "translateAndRotate",
      value: function translateAndRotate(m, rot, out) {
        _index.Vec3.transformMat4(out.center, this.center, m); // parent shape doesn't contain rotations for now


        _index.Mat3.fromQuat(out.orientation, rot);
      }
      /**
       * @zh
       *  将 out 根据这个 obb 的数据进行缩放。
       * @param scale 缩放值。
       * @param out 缩放的目标。
       */

    }, {
      key: "setScale",
      value: function setScale(scale, out) {
        _index.Vec3.multiply(out.halfExtents, this.halfExtents, scale);
      }
    }]);

    return obb;
  }();

  _exports.default = obb;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvb2JiLnRzIl0sIm5hbWVzIjpbIl92M190bXAiLCJWZWMzIiwiX3YzX3RtcDIiLCJfbTNfdG1wIiwiTWF0MyIsInRyYW5zZm9ybV9leHRlbnRfbTMiLCJvdXQiLCJleHRlbnQiLCJtMyIsIm0wMCIsIk1hdGgiLCJhYnMiLCJtMDEiLCJtMDIiLCJtMDMiLCJtMDQiLCJtMDUiLCJtMDYiLCJtMDciLCJtMDgiLCJ0cmFuc2Zvcm1NYXQzIiwib2JiIiwiX3R5cGUiLCJjeCIsImN5IiwiY3oiLCJodyIsImhoIiwiaGwiLCJveF8xIiwib3hfMiIsIm94XzMiLCJveV8xIiwib3lfMiIsIm95XzMiLCJvel8xIiwib3pfMiIsIm96XzMiLCJhIiwiY2VudGVyIiwieCIsInkiLCJ6IiwiaGFsZkV4dGVudHMiLCJvcmllbnRhdGlvbiIsImNvcHkiLCJtaW5Qb3MiLCJtYXhQb3MiLCJtdWx0aXBseVNjYWxhciIsImFkZCIsInN1YnRyYWN0IiwiaWRlbnRpdHkiLCJzZXQiLCJlbnVtcyIsIlNIQVBFX09CQiIsIm0iLCJwb3MiLCJyb3QiLCJzY2FsZSIsInRyYW5zZm9ybU1hdDQiLCJmcm9tUXVhdCIsIm11bHRpcGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9BLE1BQU1BLE9BQU8sR0FBRyxJQUFJQyxXQUFKLEVBQWhCOztBQUNBLE1BQU1DLFFBQVEsR0FBRyxJQUFJRCxXQUFKLEVBQWpCOztBQUNBLE1BQU1FLE9BQU8sR0FBRyxJQUFJQyxXQUFKLEVBQWhCLEMsQ0FFQTs7O0FBQ0EsTUFBTUMsbUJBQW1CLEdBQUcsU0FBdEJBLG1CQUFzQixDQUFDQyxHQUFELEVBQVlDLE1BQVosRUFBMEJDLEVBQTFCLEVBQXVDO0FBQy9ETCxJQUFBQSxPQUFPLENBQUNNLEdBQVIsR0FBY0MsSUFBSSxDQUFDQyxHQUFMLENBQVNILEVBQUUsQ0FBQ0MsR0FBWixDQUFk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QUFLd0QsUUFBTCxDQUFjdEQsR0FBRyxDQUFDc0MsV0FBbEIsRUFBK0JhLEdBQS9CO0FBQ0g7QUFFRDs7Ozs7Ozs7OytCQU1pQkMsSyxFQUFhcEQsRyxFQUFVO0FBQ3BDTCxvQkFBSzRELFFBQUwsQ0FBY3ZELEdBQUcsQ0FBQ3FDLFdBQWxCLEVBQStCLEtBQUtBLFdBQXBDLEVBQWlEZSxLQUFqRDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZW9tZXRyeVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IE1hdDMsIE1hdDQsIFF1YXQsIFZlYzMgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xyXG5cclxuY29uc3QgX3YzX3RtcCA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF92M190bXAyID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX20zX3RtcCA9IG5ldyBNYXQzKCk7XHJcblxyXG4vLyBodHRwczovL3pldXhjZy5vcmcvMjAxMC8xMC8xNy9hYWJiLWZyb20tb2JiLXdpdGgtY29tcG9uZW50LXdpc2UtYWJzL1xyXG5jb25zdCB0cmFuc2Zvcm1fZXh0ZW50X20zID0gKG91dDogVmVjMywgZXh0ZW50OiBWZWMzLCBtMzogTWF0MykgPT4ge1xyXG4gICAgX20zX3RtcC5tMDAgPSBNYXRoLmFicyhtMy5tMDApOyBfbTNfdG1wLm0wMSA9IE1hdGguYWJzKG0zLm0wMSk7IF9tM190bXAubTAyID0gTWF0aC5hYnMobTMubTAyKTtcclxuICAgIF9tM190bXAubTAzID0gTWF0aC5hYnMobTMubTAzKTsgX20zX3RtcC5tMDQgPSBNYXRoLmFicyhtMy5tMDQpOyBfbTNfdG1wLm0wNSA9IE1hdGguYWJzKG0zLm0wNSk7XHJcbiAgICBfbTNfdG1wLm0wNiA9IE1hdGguYWJzKG0zLm0wNik7IF9tM190bXAubTA3ID0gTWF0aC5hYnMobTMubTA3KTsgX20zX3RtcC5tMDggPSBNYXRoLmFicyhtMy5tMDgpO1xyXG4gICAgVmVjMy50cmFuc2Zvcm1NYXQzKG91dCwgZXh0ZW50LCBfbTNfdG1wKTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQmFzaWMgR2VvbWV0cnk6IGRpcmVjdGlvbmFsIGJvdW5kaW5nIGJveC5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9lSAg5pa55ZCR5YyF5Zu055uS44CCXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBvYmIge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgb2JiXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBvYmIg5a6e5L6L44CCXHJcbiAgICAgKiBAcGFyYW0gY3gg5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFgg5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gY3kg5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFkg5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gY3og5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFog5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gaHcgLSBvYmIg5a695bqm55qE5LiA5Y2K44CCXHJcbiAgICAgKiBAcGFyYW0gaGggLSBvYmIg6auY5bqm55qE5LiA5Y2K44CCXHJcbiAgICAgKiBAcGFyYW0gaGwgLSBvYmIg6ZW/5bqm55qE5LiA5Y2K44CCXHJcbiAgICAgKiBAcGFyYW0gb3hfMSDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBveF8yIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG94XzMg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3lfMSDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBveV8yIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG95XzMg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3pfMSDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBvel8yIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG96XzMg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcmV0dXJuIOi/lOWbnuS4gOS4qiBvYmLjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKFxyXG4gICAgICAgIGN4OiBudW1iZXIsIGN5OiBudW1iZXIsIGN6OiBudW1iZXIsXHJcbiAgICAgICAgaHc6IG51bWJlciwgaGg6IG51bWJlciwgaGw6IG51bWJlcixcclxuICAgICAgICBveF8xOiBudW1iZXIsIG94XzI6IG51bWJlciwgb3hfMzogbnVtYmVyLFxyXG4gICAgICAgIG95XzE6IG51bWJlciwgb3lfMjogbnVtYmVyLCBveV8zOiBudW1iZXIsXHJcbiAgICAgICAgb3pfMTogbnVtYmVyLCBvel8yOiBudW1iZXIsIG96XzM6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgb2JiKGN4LCBjeSwgY3osIGh3LCBoaCwgaGwsIG94XzEsIG94XzIsIG94XzMsIG95XzEsIG95XzIsIG95XzMsIG96XzEsIG96XzIsIG96XzMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjbG9uZSBhIG5ldyBvYmJcclxuICAgICAqIEB6aFxyXG4gICAgICog5YWL6ZqG5LiA5LiqIG9iYuOAglxyXG4gICAgICogQHBhcmFtIGEg5YWL6ZqG55qE55uu5qCH44CCXHJcbiAgICAgKiBAcmV0dXJucyDlhYvpmoblh7rnmoTmlrDlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAoYTogb2JiKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBvYmIoYS5jZW50ZXIueCwgYS5jZW50ZXIueSwgYS5jZW50ZXIueixcclxuICAgICAgICAgICAgYS5oYWxmRXh0ZW50cy54LCBhLmhhbGZFeHRlbnRzLnksIGEuaGFsZkV4dGVudHMueixcclxuICAgICAgICAgICAgYS5vcmllbnRhdGlvbi5tMDAsIGEub3JpZW50YXRpb24ubTAxLCBhLm9yaWVudGF0aW9uLm0wMixcclxuICAgICAgICAgICAgYS5vcmllbnRhdGlvbi5tMDMsIGEub3JpZW50YXRpb24ubTA0LCBhLm9yaWVudGF0aW9uLm0wNSxcclxuICAgICAgICAgICAgYS5vcmllbnRhdGlvbi5tMDYsIGEub3JpZW50YXRpb24ubTA3LCBhLm9yaWVudGF0aW9uLm0wOCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNvcHkgdGhlIHZhbHVlcyBmcm9tIG9uZSBvYmIgdG8gYW5vdGhlclxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbku47kuIDkuKogb2JiIOeahOWAvOWkjeWItuWIsOWPpuS4gOS4qiBvYmLjgIJcclxuICAgICAqIEBwYXJhbSB7b2JifSBvdXQg5o6l5Y+X5pON5L2c55qEIG9iYuOAglxyXG4gICAgICogQHBhcmFtIHtvYmJ9IGEg6KKr5aSN5Yi255qEIG9iYuOAglxyXG4gICAgICogQHJldHVybiB7b2JifSBvdXQg5o6l5Y+X5pON5L2c55qEIG9iYuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgKG91dDogb2JiLCBhOiBvYmIpOiBvYmIge1xyXG4gICAgICAgIFZlYzMuY29weShvdXQuY2VudGVyLCBhLmNlbnRlcik7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5oYWxmRXh0ZW50cywgYS5oYWxmRXh0ZW50cyk7XHJcbiAgICAgICAgTWF0My5jb3B5KG91dC5vcmllbnRhdGlvbiwgYS5vcmllbnRhdGlvbik7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNyZWF0ZSBhIG5ldyBvYmIgZnJvbSB0d28gY29ybmVyIHBvaW50c1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjkuKTkuKrngrnliJvlu7rkuIDkuKrmlrDnmoQgb2Ji44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IC0g5o6l5Y+X5pON5L2c55qEIG9iYuOAglxyXG4gICAgICogQHBhcmFtIG1pblBvcyAtIG9iYiDnmoTmnIDlsI/ngrnjgIJcclxuICAgICAqIEBwYXJhbSBtYXhQb3MgLSBvYmIg55qE5pyA5aSn54K544CCXHJcbiAgICAgKiBAcmV0dXJucyB7b2JifSBvdXQg5o6l5Y+X5pON5L2c55qEIG9iYuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21Qb2ludHMgKG91dDogb2JiLCBtaW5Qb3M6IFZlYzMsIG1heFBvczogVmVjMyk6IG9iYiB7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQuY2VudGVyLCBWZWMzLmFkZChfdjNfdG1wLCBtaW5Qb3MsIG1heFBvcyksIDAuNSk7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseVNjYWxhcihvdXQuaGFsZkV4dGVudHMsIFZlYzMuc3VidHJhY3QoX3YzX3RtcDIsIG1heFBvcywgbWluUG9zKSwgMC41KTtcclxuICAgICAgICBNYXQzLmlkZW50aXR5KG91dC5vcmllbnRhdGlvbik7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgb2JiIHRvIHRoZSBnaXZlbiB2YWx1ZXNcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCG57uZ5a6aIG9iYiDnmoTlsZ7mgKforr7nva7kuLrnu5nlrprnmoTlgLzjgIJcclxuICAgICAqIEBwYXJhbSBjeCAtIG9iYiDnmoTljp/ngrnnmoQgWCDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBjeSAtIG9iYiDnmoTljp/ngrnnmoQgWSDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBjeiAtIG9iYiDnmoTljp/ngrnnmoQgWiDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBodyAtIG9iYiDlrr3luqbnmoTkuIDljYrjgIJcclxuICAgICAqIEBwYXJhbSBoaCAtIG9iYiDpq5jluqbnmoTkuIDljYrjgIJcclxuICAgICAqIEBwYXJhbSBobCAtIG9iYiDplb/luqbnmoTkuIDljYrjgIJcclxuICAgICAqIEBwYXJhbSBveF8xIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG94XzIg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3hfMyDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBveV8xIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG95XzIg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3lfMyDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEBwYXJhbSBvel8xIOaWueWQkeefqemYteWPguaVsOOAglxyXG4gICAgICogQHBhcmFtIG96XzIg5pa55ZCR55+p6Zi15Y+C5pWw44CCXHJcbiAgICAgKiBAcGFyYW0gb3pfMyDmlrnlkJHnn6npmLXlj4LmlbDjgIJcclxuICAgICAqIEByZXR1cm4ge29iYn0gb3V0XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChcclxuICAgICAgICBvdXQ6IG9iYixcclxuICAgICAgICBjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBjejogbnVtYmVyLFxyXG4gICAgICAgIGh3OiBudW1iZXIsIGhoOiBudW1iZXIsIGhsOiBudW1iZXIsXHJcbiAgICAgICAgb3hfMTogbnVtYmVyLCBveF8yOiBudW1iZXIsIG94XzM6IG51bWJlcixcclxuICAgICAgICBveV8xOiBudW1iZXIsIG95XzI6IG51bWJlciwgb3lfMzogbnVtYmVyLFxyXG4gICAgICAgIG96XzE6IG51bWJlciwgb3pfMjogbnVtYmVyLCBvel8zOiBudW1iZXIpOiBvYmIge1xyXG4gICAgICAgIFZlYzMuc2V0KG91dC5jZW50ZXIsIGN4LCBjeSwgY3opO1xyXG4gICAgICAgIFZlYzMuc2V0KG91dC5oYWxmRXh0ZW50cywgaHcsIGhoLCBobCk7XHJcbiAgICAgICAgTWF0My5zZXQob3V0Lm9yaWVudGF0aW9uLCBveF8xLCBveF8yLCBveF8zLCBveV8xLCBveV8yLCBveV8zLCBvel8xLCBvel8yLCBvel8zKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmnKzlnLDlnZDmoIfnmoTkuK3lv4PngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGNlbnRlcjogVmVjMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog6ZW/5a696auY55qE5LiA5Y2K44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBoYWxmRXh0ZW50czogVmVjMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5pa55ZCR55+p6Zi144CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBvcmllbnRhdGlvbjogTWF0MztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0cyB0aGUgdHlwZSBvZiB0aGUgc2hhcGUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+WPluW9oueKtueahOexu+Wei+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgdHlwZSAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IF90eXBlOiBudW1iZXI7XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yIChjeCA9IDAsIGN5ID0gMCwgY3ogPSAwLFxyXG4gICAgICAgICAgICAgICAgIGh3ID0gMSwgaGggPSAxLCBobCA9IDEsXHJcbiAgICAgICAgICAgICAgICAgb3hfMSA9IDEsIG94XzIgPSAwLCBveF8zID0gMCxcclxuICAgICAgICAgICAgICAgICBveV8xID0gMCwgb3lfMiA9IDEsIG95XzMgPSAwLFxyXG4gICAgICAgICAgICAgICAgIG96XzEgPSAwLCBvel8yID0gMCwgb3pfMyA9IDEpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gZW51bXMuU0hBUEVfT0JCO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlYzMoY3gsIGN5LCBjeik7XHJcbiAgICAgICAgdGhpcy5oYWxmRXh0ZW50cyA9IG5ldyBWZWMzKGh3LCBoaCwgaGwpO1xyXG4gICAgICAgIHRoaXMub3JpZW50YXRpb24gPSBuZXcgTWF0MyhveF8xLCBveF8yLCBveF8zLCBveV8xLCBveV8yLCBveV8zLCBvel8xLCBvel8yLCBvel8zKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0IHRoZSBib3VuZGluZyBwb2ludHMgb2YgdGhpcyBzaGFwZVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5Ygb2JiIOeahOacgOWwj+eCueWSjOacgOWkp+eCueOAglxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBtaW5Qb3Mg5pyA5bCP54K544CCXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1heFBvcyDmnIDlpKfngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldEJvdW5kYXJ5IChtaW5Qb3M6IFZlYzMsIG1heFBvczogVmVjMykge1xyXG4gICAgICAgIHRyYW5zZm9ybV9leHRlbnRfbTMoX3YzX3RtcCwgdGhpcy5oYWxmRXh0ZW50cywgdGhpcy5vcmllbnRhdGlvbik7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChtaW5Qb3MsIHRoaXMuY2VudGVyLCBfdjNfdG1wKTtcclxuICAgICAgICBWZWMzLmFkZChtYXhQb3MsIHRoaXMuY2VudGVyLCBfdjNfdG1wKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFRyYW5zZm9ybSB0aGlzIHNoYXBlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIG9iYiDnmoTmlbDmja7ov5vooYzlj5jmjaLjgIJcclxuICAgICAqIEBwYXJhbSBtIOWPmOaNoueahOefqemYteOAglxyXG4gICAgICogQHBhcmFtIHBvcyDlj5jmjaLnmoTkvY3nva7pg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSByb3Qg5Y+Y5o2i55qE5peL6L2s6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gc2NhbGUg5Y+Y5o2i55qE57yp5pS+6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOWPmOaNoueahOebruagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgdHJhbnNmb3JtIChtOiBNYXQ0LCBwb3M6IFZlYzMsIHJvdDogUXVhdCwgc2NhbGU6IFZlYzMsIG91dDogb2JiKSB7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIHRoaXMuY2VudGVyLCBtKTtcclxuICAgICAgICAvLyBwYXJlbnQgc2hhcGUgZG9lc24ndCBjb250YWluIHJvdGF0aW9ucyBmb3Igbm93XHJcbiAgICAgICAgTWF0My5mcm9tUXVhdChvdXQub3JpZW50YXRpb24sIHJvdCk7XHJcbiAgICAgICAgVmVjMy5tdWx0aXBseShvdXQuaGFsZkV4dGVudHMsIHRoaXMuaGFsZkV4dGVudHMsIHNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCGIG91dCDmoLnmja7ov5nkuKogb2JiIOeahOaVsOaNrui/m+ihjOWPmOaNouOAglxyXG4gICAgICogQHBhcmFtIG0g5Y+Y5o2i55qE55+p6Zi144CCXHJcbiAgICAgKiBAcGFyYW0gcm90IOWPmOaNoueahOaXi+i9rOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIG91dCDlj5jmjaLnmoTnm67moIfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zbGF0ZUFuZFJvdGF0ZSAobTogTWF0NCwgcm90OiBRdWF0LCBvdXQ6IG9iYil7XHJcbiAgICAgICAgVmVjMy50cmFuc2Zvcm1NYXQ0KG91dC5jZW50ZXIsIHRoaXMuY2VudGVyLCBtKTtcclxuICAgICAgICAvLyBwYXJlbnQgc2hhcGUgZG9lc24ndCBjb250YWluIHJvdGF0aW9ucyBmb3Igbm93XHJcbiAgICAgICAgTWF0My5mcm9tUXVhdChvdXQub3JpZW50YXRpb24sIHJvdCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqICDlsIYgb3V0IOagueaNrui/meS4qiBvYmIg55qE5pWw5o2u6L+b6KGM57yp5pS+44CCXHJcbiAgICAgKiBAcGFyYW0gc2NhbGUg57yp5pS+5YC844CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOe8qeaUvueahOebruagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0U2NhbGUgKHNjYWxlOiBWZWMzLCBvdXQ6IG9iYikge1xyXG4gICAgICAgIFZlYzMubXVsdGlwbHkob3V0LmhhbGZFeHRlbnRzLCB0aGlzLmhhbGZFeHRlbnRzLCBzY2FsZSk7XHJcbiAgICB9XHJcbn1cclxuIl19