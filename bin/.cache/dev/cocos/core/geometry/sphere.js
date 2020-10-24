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
    global.sphere = mod.exports;
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

  var _offset = new _index.Vec3();

  var _min = new _index.Vec3();

  var _max = new _index.Vec3();

  function maxComponent(v) {
    return Math.max(Math.max(v.x, v.y), v.z);
  }
  /**
   * @en
   * Basic Geometry: sphere.
   * @zh
   * 基础几何 轴对齐球。
   */
  // tslint:disable-next-line: class-name


  var sphere = /*#__PURE__*/function () {
    _createClass(sphere, [{
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
       * create a new sphere
       * @zh
       * 创建一个新的 sphere 实例。
       * @param cx 形状的相对于原点的 X 坐标。
       * @param cy 形状的相对于原点的 Y 坐标。
       * @param cz 形状的相对于原点的 Z 坐标。
       * @param r 球体的半径
       * @return {sphere} 返回一个 sphere。
       */
      value: function create(cx, cy, cz, r) {
        return new sphere(cx, cy, cz, r);
      }
      /**
       * @en
       * clone a new sphere
       * @zh
       * 克隆一个新的 sphere 实例。
       * @param {sphere} p 克隆的目标。
       * @return {sphere} 克隆出的示例。
       */

    }, {
      key: "clone",
      value: function clone(p) {
        return new sphere(p.center.x, p.center.y, p.center.z, p.radius);
      }
      /**
       * @en
       * copy the values from one sphere to another
       * @zh
       * 将从一个 sphere 的值复制到另一个 sphere。
       * @param {sphere} out 接受操作的 sphere。
       * @param {sphere} a 被复制的 sphere。
       * @return {sphere} out 接受操作的 sphere。
       */

    }, {
      key: "copy",
      value: function copy(out, p) {
        _index.Vec3.copy(out.center, p.center);

        out.radius = p.radius;
        return out;
      }
      /**
       * @en
       * create a new bounding sphere from two corner points
       * @zh
       * 从两个点创建一个新的 sphere。
       * @param out - 接受操作的 sphere。
       * @param minPos - sphere 的最小点。
       * @param maxPos - sphere 的最大点。
       * @returns {sphere} out 接受操作的 sphere。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, minPos, maxPos) {
        _index.Vec3.multiplyScalar(out.center, _index.Vec3.add(_v3_tmp, minPos, maxPos), 0.5);

        out.radius = _index.Vec3.subtract(_v3_tmp, maxPos, minPos).length() * 0.5;
        return out;
      }
      /**
       * @en
       * Set the components of a sphere to the given values
       * @zh
       * 将球体的属性设置为给定的值。
       * @param {sphere} out 接受操作的 sphere。
       * @param cx 形状的相对于原点的 X 坐标。
       * @param cy 形状的相对于原点的 Y 坐标。
       * @param cz 形状的相对于原点的 Z 坐标。
       * @param {number} r 半径。
       * @return {sphere} out 接受操作的 sphere。
       * @function
       */

    }, {
      key: "set",
      value: function set(out, cx, cy, cz, r) {
        out.center.x = cx;
        out.center.y = cy;
        out.center.z = cz;
        out.radius = r;
        return out;
      }
      /**
       * @zh
       * 球跟点合并
       */

    }, {
      key: "mergePoint",
      value: function mergePoint(out, s, point) {
        if (s.radius < 0.0) {
          out.center = point;
          out.radius = 0.0;
          return out;
        }

        _index.Vec3.subtract(_offset, point, s.center);

        var dist = _offset.length();

        if (dist > s.radius) {
          var half = (dist - s.radius) * 0.5;
          out.radius += half;

          _index.Vec3.multiplyScalar(_offset, _offset, half / dist);

          _index.Vec3.add(out.center, out.center, _offset);
        }

        return out;
      }
      /**
       * @zh
       * 球跟立方体合并
       */

    }, {
      key: "mergeAABB",
      value: function mergeAABB(out, s, a) {
        a.getBoundary(_min, _max);
        sphere.mergePoint(out, s, _min);
        sphere.mergePoint(out, s, _max);
        return out;
      }
      /**
       * @en
       * The center of this sphere.
       * @zh
       * 本地坐标的中心点。
       */

    }]);

    /**
     * @en
     * Construct a sphere.
     * @zh
     * 构造一个球。
     * @param cx 该球的世界坐标的 X 坐标。
     * @param cy 该球的世界坐标的 Y 坐标。
     * @param cz 该球的世界坐标的 Z 坐标。
     * @param {number} r 半径。
     */
    function sphere() {
      var cx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var cy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var cz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var r = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;

      _classCallCheck(this, sphere);

      this.center = void 0;
      this.radius = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_SPHERE;
      this.center = new _index.Vec3(cx, cy, cz);
      this.radius = r;
    }
    /**
     * @en
     * Get a clone.
     * @zh
     * 获得克隆。
     */


    _createClass(sphere, [{
      key: "clone",
      value: function clone() {
        return sphere.clone(this);
      }
      /**
       * @en
       * Copy a sphere.
       * @zh
       * 拷贝对象。
       * @param a 拷贝的目标。
       */

    }, {
      key: "copy",
      value: function copy(a) {
        return sphere.copy(this, a);
      }
      /**
       * @en
       * Get the bounding points of this shape
       * @zh
       * 获取此形状的边界点。
       * @param {Vec3} minPos 最小点。
       * @param {Vec3} maxPos 最大点。
       */

    }, {
      key: "getBoundary",
      value: function getBoundary(minPos, maxPos) {
        _index.Vec3.set(minPos, this.center.x - this.radius, this.center.y - this.radius, this.center.z - this.radius);

        _index.Vec3.set(maxPos, this.center.x + this.radius, this.center.y + this.radius, this.center.z + this.radius);
      }
      /**
       * @en
       * Transform this shape
       * @zh
       * 将 out 根据这个 sphere 的数据进行变换。
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

        out.radius = this.radius * maxComponent(scale);
      }
      /**
       * @en
       * Translate and rotate this sphere.
       * @zh
       * 将 out 根据这个 sphere 的数据进行变换。
       * @param m 变换的矩阵。
       * @param rot 变换的旋转部分。
       * @param out 变换的目标。
       */

    }, {
      key: "translateAndRotate",
      value: function translateAndRotate(m, rot, out) {
        _index.Vec3.transformMat4(out.center, this.center, m);
      }
      /**
       * @en
       * Scaling this sphere.
       * @zh
       * 将 out 根据这个 sphere 的数据进行缩放。
       * @param scale 缩放值。
       * @param out 缩放的目标。
       */

    }, {
      key: "setScale",
      value: function setScale(scale, out) {
        out.radius = this.radius * maxComponent(scale);
      }
    }]);

    return sphere;
  }();

  _exports.default = sphere;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvc3BoZXJlLnRzIl0sIm5hbWVzIjpbIl92M190bXAiLCJWZWMzIiwiX29mZnNldCIsIl9taW4iLCJfbWF4IiwibWF4Q29tcG9uZW50IiwidiIsIk1hdGgiLCJtYXgiLCJ4IiwieSIsInoiLCJzcGhlcmUiLCJfdHlwZSIsImN4IiwiY3kiLCJjeiIsInIiLCJwIiwiY2VudGVyIiwicmFkaXVzIiwib3V0IiwiY29weSIsIm1pblBvcyIsIm1heFBvcyIsIm11bHRpcGx5U2NhbGFyIiwiYWRkIiwic3VidHJhY3QiLCJsZW5ndGgiLCJzIiwicG9pbnQiLCJkaXN0IiwiaGFsZiIsImEiLCJnZXRCb3VuZGFyeSIsIm1lcmdlUG9pbnQiLCJlbnVtcyIsIlNIQVBFX1NQSEVSRSIsImNsb25lIiwic2V0IiwibSIsInBvcyIsInJvdCIsInNjYWxlIiwidHJhbnNmb3JtTWF0NCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxNQUFNQSxPQUFPLEdBQUcsSUFBSUMsV0FBSixFQUFoQjs7QUFDQSxNQUFNQyxPQUFPLEdBQUcsSUFBSUQsV0FBSixFQUFoQjs7QUFDQSxNQUFNRSxJQUFJLEdBQUcsSUFBSUYsV0FBSixFQUFiOztBQUNBLE1BQU1HLElBQUksR0FBRyxJQUFJSCxXQUFKLEVBQWI7O0FBQ0EsV0FBU0ksWUFBVCxDQUF1QkMsQ0FBdkIsRUFBZ0M7QUFBRSxXQUFPQyxJQUFJLENBQUNDLEdBQUwsQ0FBU0QsSUFBSSxDQUFDQyxHQUFMLENBQVNGLENBQUMsQ0FBQ0csQ0FBWCxFQUFjSCxDQUFDLENBQUNJLENBQWhCLENBQVQsRUFBNkJKLENBQUMsQ0FBQ0ssQ0FBL0IsQ0FBUDtBQUEyQztBQUU3RTs7Ozs7O0FBTUE7OztNQUNxQkMsTTs7OztBQXdJakI7Ozs7OzswQkFNWTtBQUNSLGVBQU8sS0FBS0MsS0FBWjtBQUNIOzs7O0FBOUlEOzs7Ozs7Ozs7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Rzs7QUFDQW5CLG9CQUFLc0MsR0FBTCxDQUFTZixNQUFULEVBQWlCLEtBQUtMLE1BQUwsQ0FBWVYsQ0FBWixHQUFnQixLQUFLVyxNQUF0QyxFQUE4QyxLQUFLRCxNQUFMLENBQVlULENBQVosR0FBZ0IsS0FBS1UsTUFBbkUsRUFBMkUsS0FBS0QsTUFBTCxDQUFZUixDQUFaLEdBQWdCLEtBQUtTLE1BQWhHO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Z0NBV2tCb0IsQyxFQUFTQyxHLEVBQVdDLEcsRUFBV0MsSyxFQUFhdEIsRyxFQUFhO0FBQ3ZFcEIsb0JBQUsyQyxhQUFMLENBQW1CdkIsR0FBRyxDQUFDRixNQUF2QixFQUErQixLQUFLQSxNQUFwQyxFQUE0Q3FCLENBQTVDOztBQUNBbkIsUUFBQUEsR0FBRyxDQUFDRCxNQUFKLEdBQWEsS0FBS0EsTUFBTCxHQUFjZixZQUFZLENBQUNzQyxLQUFELENBQXZDO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O3lDQVMyQkgsQyxFQUFTRSxHLEVBQVdyQixHLEVBQWE7QUFDeERwQixvQkFBSzJDLGFBQUwsQ0FBbUJ2QixHQUFHLENBQUNGLE1BQXZCLEVBQStCLEtBQUtBLE1BQXBDLEVBQTRDcUIsQ0FBNUM7QUFDSDtBQUVEOzs7Ozs7Ozs7OzsrQkFRaUJHLEssRUFBYXRCLEcsRUFBYTtBQUN2Q0EsUUFBQUEsR0FBRyxDQUFDRCxNQUFKLEdBQWEsS0FBS0EsTUFBTCxHQUFjZixZQUFZLENBQUNzQyxLQUFELENBQXZDO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdlb21ldHJ5XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0NCwgUXVhdCwgVmVjMyB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XHJcbmltcG9ydCBhYWJiIGZyb20gJy4vYWFiYic7XHJcblxyXG5jb25zdCBfdjNfdG1wID0gbmV3IFZlYzMoKTtcclxuY29uc3QgX29mZnNldCA9IG5ldyBWZWMzKCk7XHJcbmNvbnN0IF9taW4gPSBuZXcgVmVjMygpO1xyXG5jb25zdCBfbWF4ID0gbmV3IFZlYzMoKTtcclxuZnVuY3Rpb24gbWF4Q29tcG9uZW50ICh2OiBWZWMzKSB7IHJldHVybiBNYXRoLm1heChNYXRoLm1heCh2LngsIHYueSksIHYueik7IH1cclxuXHJcbi8qKlxyXG4gKiBAZW5cclxuICogQmFzaWMgR2VvbWV0cnk6IHNwaGVyZS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9lSDovbTlr7npvZDnkIPjgIJcclxuICovXHJcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTogY2xhc3MtbmFtZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBzcGhlcmUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgc3BoZXJlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uuS4gOS4quaWsOeahCBzcGhlcmUg5a6e5L6L44CCXHJcbiAgICAgKiBAcGFyYW0gY3gg5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFgg5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gY3kg5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFkg5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gY3og5b2i54q255qE55u45a+55LqO5Y6f54K555qEIFog5Z2Q5qCH44CCXHJcbiAgICAgKiBAcGFyYW0gciDnkIPkvZPnmoTljYrlvoRcclxuICAgICAqIEByZXR1cm4ge3NwaGVyZX0g6L+U5Zue5LiA5LiqIHNwaGVyZeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNyZWF0ZSAoY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3o6IG51bWJlciwgcjogbnVtYmVyKTogc3BoZXJlIHtcclxuICAgICAgICByZXR1cm4gbmV3IHNwaGVyZShjeCwgY3ksIGN6LCByKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY2xvbmUgYSBuZXcgc3BoZXJlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWFi+mahuS4gOS4quaWsOeahCBzcGhlcmUg5a6e5L6L44CCXHJcbiAgICAgKiBAcGFyYW0ge3NwaGVyZX0gcCDlhYvpmobnmoTnm67moIfjgIJcclxuICAgICAqIEByZXR1cm4ge3NwaGVyZX0g5YWL6ZqG5Ye655qE56S65L6L44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgY2xvbmUgKHA6IHNwaGVyZSk6IHNwaGVyZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBzcGhlcmUocC5jZW50ZXIueCwgcC5jZW50ZXIueSwgcC5jZW50ZXIueiwgcC5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgc3BoZXJlIHRvIGFub3RoZXJcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCG5LuO5LiA5LiqIHNwaGVyZSDnmoTlgLzlpI3liLbliLDlj6bkuIDkuKogc3BoZXJl44CCXHJcbiAgICAgKiBAcGFyYW0ge3NwaGVyZX0gb3V0IOaOpeWPl+aTjeS9nOeahCBzcGhlcmXjgIJcclxuICAgICAqIEBwYXJhbSB7c3BoZXJlfSBhIOiiq+WkjeWItueahCBzcGhlcmXjgIJcclxuICAgICAqIEByZXR1cm4ge3NwaGVyZX0gb3V0IOaOpeWPl+aTjeS9nOeahCBzcGhlcmXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHNwaGVyZSwgcDogc3BoZXJlKTogc3BoZXJlIHtcclxuICAgICAgICBWZWMzLmNvcHkob3V0LmNlbnRlciwgcC5jZW50ZXIpO1xyXG4gICAgICAgIG91dC5yYWRpdXMgPSBwLnJhZGl1cztcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY3JlYXRlIGEgbmV3IGJvdW5kaW5nIHNwaGVyZSBmcm9tIHR3byBjb3JuZXIgcG9pbnRzXHJcbiAgICAgKiBAemhcclxuICAgICAqIOS7juS4pOS4queCueWIm+W7uuS4gOS4quaWsOeahCBzcGhlcmXjgIJcclxuICAgICAqIEBwYXJhbSBvdXQgLSDmjqXlj5fmk43kvZznmoQgc3BoZXJl44CCXHJcbiAgICAgKiBAcGFyYW0gbWluUG9zIC0gc3BoZXJlIOeahOacgOWwj+eCueOAglxyXG4gICAgICogQHBhcmFtIG1heFBvcyAtIHNwaGVyZSDnmoTmnIDlpKfngrnjgIJcclxuICAgICAqIEByZXR1cm5zIHtzcGhlcmV9IG91dCDmjqXlj5fmk43kvZznmoQgc3BoZXJl44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBvaW50cyAob3V0OiBzcGhlcmUsIG1pblBvczogVmVjMywgbWF4UG9zOiBWZWMzKTogc3BoZXJlIHtcclxuICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKG91dC5jZW50ZXIsIFZlYzMuYWRkKF92M190bXAsIG1pblBvcywgbWF4UG9zKSwgMC41KTtcclxuICAgICAgICBvdXQucmFkaXVzID0gVmVjMy5zdWJ0cmFjdChfdjNfdG1wLCBtYXhQb3MsIG1pblBvcykubGVuZ3RoKCkgKiAwLjU7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgc3BoZXJlIHRvIHRoZSBnaXZlbiB2YWx1ZXNcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCG55CD5L2T55qE5bGe5oCn6K6+572u5Li657uZ5a6a55qE5YC844CCXHJcbiAgICAgKiBAcGFyYW0ge3NwaGVyZX0gb3V0IOaOpeWPl+aTjeS9nOeahCBzcGhlcmXjgIJcclxuICAgICAqIEBwYXJhbSBjeCDlvaLnirbnmoTnm7jlr7nkuo7ljp/ngrnnmoQgWCDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBjeSDlvaLnirbnmoTnm7jlr7nkuo7ljp/ngrnnmoQgWSDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSBjeiDlvaLnirbnmoTnm7jlr7nkuo7ljp/ngrnnmoQgWiDlnZDmoIfjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByIOWNiuW+hOOAglxyXG4gICAgICogQHJldHVybiB7c3BoZXJlfSBvdXQg5o6l5Y+X5pON5L2c55qEIHNwaGVyZeOAglxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChvdXQ6IHNwaGVyZSwgY3g6IG51bWJlciwgY3k6IG51bWJlciwgY3o6IG51bWJlciwgcjogbnVtYmVyKTogc3BoZXJlIHtcclxuICAgICAgICBvdXQuY2VudGVyLnggPSBjeDtcclxuICAgICAgICBvdXQuY2VudGVyLnkgPSBjeTtcclxuICAgICAgICBvdXQuY2VudGVyLnogPSBjejtcclxuICAgICAgICBvdXQucmFkaXVzID0gcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog55CD6Lef54K55ZCI5bm2XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgbWVyZ2VQb2ludCAob3V0OiBzcGhlcmUsIHM6IHNwaGVyZSwgcG9pbnQ6IFZlYzMpIHtcclxuICAgICAgICBpZiAocy5yYWRpdXMgPCAwLjApIHtcclxuICAgICAgICAgICAgb3V0LmNlbnRlciA9IHBvaW50O1xyXG4gICAgICAgICAgICBvdXQucmFkaXVzID0gMC4wO1xyXG4gICAgICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdChfb2Zmc2V0LCBwb2ludCwgcy5jZW50ZXIpO1xyXG4gICAgICAgIGNvbnN0IGRpc3QgPSBfb2Zmc2V0Lmxlbmd0aCgpO1xyXG5cclxuICAgICAgICBpZiAoZGlzdCA+IHMucmFkaXVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhhbGYgPSAoZGlzdCAtIHMucmFkaXVzKSAqIDAuNTtcclxuICAgICAgICAgICAgb3V0LnJhZGl1cyArPSBoYWxmO1xyXG4gICAgICAgICAgICBWZWMzLm11bHRpcGx5U2NhbGFyKF9vZmZzZXQsIF9vZmZzZXQsIGhhbGYgLyBkaXN0KTtcclxuICAgICAgICAgICAgVmVjMy5hZGQob3V0LmNlbnRlciwgb3V0LmNlbnRlciwgX29mZnNldCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDnkIPot5/nq4vmlrnkvZPlkIjlubZcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBtZXJnZUFBQkIgKG91dDogc3BoZXJlLCBzOnNwaGVyZSwgYTogYWFiYikge1xyXG4gICAgICAgIGEuZ2V0Qm91bmRhcnkoX21pbiwgX21heCk7XHJcblxyXG4gICAgICAgIHNwaGVyZS5tZXJnZVBvaW50KG91dCwgcywgX21pbik7XHJcbiAgICAgICAgc3BoZXJlLm1lcmdlUG9pbnQob3V0LCBzLCBfbWF4KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIGNlbnRlciBvZiB0aGlzIHNwaGVyZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pys5Zyw5Z2Q5qCH55qE5Lit5b+D54K544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjZW50ZXI6IFZlYzM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSByYWRpdXMgb2YgdGhpcyBzcGhlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWNiuW+hOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmFkaXVzOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIHNoYXBlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvaLnirbnmoTnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBfdHlwZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBzcGhlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaehOmAoOS4gOS4queQg+OAglxyXG4gICAgICogQHBhcmFtIGN4IOivpeeQg+eahOS4lueVjOWdkOagh+eahCBYIOWdkOagh+OAglxyXG4gICAgICogQHBhcmFtIGN5IOivpeeQg+eahOS4lueVjOWdkOagh+eahCBZIOWdkOagh+OAglxyXG4gICAgICogQHBhcmFtIGN6IOivpeeQg+eahOS4lueVjOWdkOagh+eahCBaIOWdkOagh+OAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHIg5Y2K5b6E44CCXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChjeDogbnVtYmVyID0gMCwgY3k6IG51bWJlciA9IDAsIGN6OiBudW1iZXIgPSAwLCByOiBudW1iZXIgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX1NQSEVSRTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZWMzKGN4LCBjeSwgY3opO1xyXG4gICAgICAgIHRoaXMucmFkaXVzID0gcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogR2V0IGEgY2xvbmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiOt+W+l+WFi+mahuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY2xvbmUgKCkge1xyXG4gICAgICAgIHJldHVybiBzcGhlcmUuY2xvbmUodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENvcHkgYSBzcGhlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaLt+i0neWvueixoeOAglxyXG4gICAgICogQHBhcmFtIGEg5ou36LSd55qE55uu5qCH44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb3B5IChhOiBzcGhlcmUpIHtcclxuICAgICAgICByZXR1cm4gc3BoZXJlLmNvcHkodGhpcywgYSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldCB0aGUgYm91bmRpbmcgcG9pbnRzIG9mIHRoaXMgc2hhcGVcclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5q2k5b2i54q255qE6L6555WM54K544CCXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IG1pblBvcyDmnIDlsI/ngrnjgIJcclxuICAgICAqIEBwYXJhbSB7VmVjM30gbWF4UG9zIOacgOWkp+eCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0Qm91bmRhcnkgKG1pblBvczogVmVjMywgbWF4UG9zOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5zZXQobWluUG9zLCB0aGlzLmNlbnRlci54IC0gdGhpcy5yYWRpdXMsIHRoaXMuY2VudGVyLnkgLSB0aGlzLnJhZGl1cywgdGhpcy5jZW50ZXIueiAtIHRoaXMucmFkaXVzKTtcclxuICAgICAgICBWZWMzLnNldChtYXhQb3MsIHRoaXMuY2VudGVyLnggKyB0aGlzLnJhZGl1cywgdGhpcy5jZW50ZXIueSArIHRoaXMucmFkaXVzLCB0aGlzLmNlbnRlci56ICsgdGhpcy5yYWRpdXMpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUcmFuc2Zvcm0gdGhpcyBzaGFwZVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIYgb3V0IOagueaNrui/meS4qiBzcGhlcmUg55qE5pWw5o2u6L+b6KGM5Y+Y5o2i44CCXHJcbiAgICAgKiBAcGFyYW0gbSDlj5jmjaLnmoTnn6npmLXjgIJcclxuICAgICAqIEBwYXJhbSBwb3Mg5Y+Y5o2i55qE5L2N572u6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gcm90IOWPmOaNoueahOaXi+i9rOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHNjYWxlIOWPmOaNoueahOe8qeaUvumDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIG91dCDlj5jmjaLnmoTnm67moIfjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybSAobTogTWF0NCwgcG9zOiBWZWMzLCByb3Q6IFF1YXQsIHNjYWxlOiBWZWMzLCBvdXQ6IHNwaGVyZSkge1xyXG4gICAgICAgIFZlYzMudHJhbnNmb3JtTWF0NChvdXQuY2VudGVyLCB0aGlzLmNlbnRlciwgbSk7XHJcbiAgICAgICAgb3V0LnJhZGl1cyA9IHRoaXMucmFkaXVzICogbWF4Q29tcG9uZW50KHNjYWxlKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVHJhbnNsYXRlIGFuZCByb3RhdGUgdGhpcyBzcGhlcmUuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWwhiBvdXQg5qC55o2u6L+Z5LiqIHNwaGVyZSDnmoTmlbDmja7ov5vooYzlj5jmjaLjgIJcclxuICAgICAqIEBwYXJhbSBtIOWPmOaNoueahOefqemYteOAglxyXG4gICAgICogQHBhcmFtIHJvdCDlj5jmjaLnmoTml4vovazpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5Y+Y5o2i55qE55uu5qCH44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyB0cmFuc2xhdGVBbmRSb3RhdGUgKG06IE1hdDQsIHJvdDogUXVhdCwgb3V0OiBzcGhlcmUpIHtcclxuICAgICAgICBWZWMzLnRyYW5zZm9ybU1hdDQob3V0LmNlbnRlciwgdGhpcy5jZW50ZXIsIG0pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTY2FsaW5nIHRoaXMgc3BoZXJlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIYgb3V0IOagueaNrui/meS4qiBzcGhlcmUg55qE5pWw5o2u6L+b6KGM57yp5pS+44CCXHJcbiAgICAgKiBAcGFyYW0gc2NhbGUg57yp5pS+5YC844CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOe8qeaUvueahOebruagh+OAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0U2NhbGUgKHNjYWxlOiBWZWMzLCBvdXQ6IHNwaGVyZSkge1xyXG4gICAgICAgIG91dC5yYWRpdXMgPSB0aGlzLnJhZGl1cyAqIG1heENvbXBvbmVudChzY2FsZSk7XHJcbiAgICB9XHJcbn1cclxuIl19