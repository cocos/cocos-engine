(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../math/index.js", "./enums.js", "../global-exports.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../math/index.js"), require("./enums.js"), require("../global-exports.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index, global.enums, global.globalExports);
    global.plane = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index, _enums, _globalExports) {
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

  var v1 = new _index.Vec3(0, 0, 0);
  var v2 = new _index.Vec3(0, 0, 0);

  var temp_mat = _globalExports.legacyCC.mat4();

  var temp_vec4 = _globalExports.legacyCC.v4();
  /**
   * @en
   * Basic Geometry: plane.
   * @zh
   * 基础几何 plane。
   */
  // tslint:disable-next-line:class-name


  var plane = /*#__PURE__*/function () {
    _createClass(plane, [{
      key: "type",

      /**
       * @en
       * Gets the type of the shape.
       * @zh
       * 获取形状的类型。
       */
      get: function get() {
        return this._type;
      } // compatibility with vector interfaces

    }, {
      key: "x",
      set: function set(val) {
        this.n.x = val;
      },
      get: function get() {
        return this.n.x;
      }
    }, {
      key: "y",
      set: function set(val) {
        this.n.y = val;
      },
      get: function get() {
        return this.n.y;
      }
    }, {
      key: "z",
      set: function set(val) {
        this.n.z = val;
      },
      get: function get() {
        return this.n.z;
      }
    }, {
      key: "w",
      set: function set(val) {
        this.d = val;
      },
      get: function get() {
        return this.d;
      }
    }], [{
      key: "create",

      /**
       * @en
       * create a new plane
       * @zh
       * 创建一个新的 plane。
       * @param nx 法向分量的 x 部分。
       * @param ny 法向分量的 y 部分。
       * @param nz 法向分量的 z 部分。
       * @param d 与原点的距离。
       * @return
       */
      value: function create(nx, ny, nz, d) {
        return new plane(nx, ny, nz, d);
      }
      /**
       * @en
       * clone a new plane
       * @zh
       * 克隆一个新的 plane。
       * @param p 克隆的来源。
       * @return 克隆出的对象。
       */

    }, {
      key: "clone",
      value: function clone(p) {
        return new plane(p.n.x, p.n.y, p.n.z, p.d);
      }
      /**
       * @en
       * copy the values from one plane to another
       * @zh
       * 复制一个平面的值到另一个。
       * @param out 接受操作的对象。
       * @param p 复制的来源。
       * @return 接受操作的对象。
       */

    }, {
      key: "copy",
      value: function copy(out, p) {
        _index.Vec3.copy(out.n, p.n);

        out.d = p.d;
        return out;
      }
      /**
       * @en
       * create a plane from three points
       * @zh
       * 用三个点创建一个平面。
       * @param out 接受操作的对象。
       * @param a 点 a。
       * @param b 点 b。
       * @param c 点 c。
       * @return out 接受操作的对象。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, a, b, c) {
        _index.Vec3.subtract(v1, b, a);

        _index.Vec3.subtract(v2, c, a);

        _index.Vec3.normalize(out.n, _index.Vec3.cross(out.n, v1, v2));

        out.d = _index.Vec3.dot(out.n, a);
        return out;
      }
      /**
       * @en
       * Set the components of a plane to the given values
       * @zh
       * 将给定平面的属性设置为给定值。
       * @param out 接受操作的对象。
       * @param nx 法向分量的 x 部分。
       * @param ny 法向分量的 y 部分。
       * @param nz 法向分量的 z 部分。
       * @param d 与原点的距离。
       * @return out 接受操作的对象。
       */

    }, {
      key: "set",
      value: function set(out, nx, ny, nz, d) {
        out.n.x = nx;
        out.n.y = ny;
        out.n.z = nz;
        out.d = d;
        return out;
      }
      /**
       * @en
       * create plane from normal and point
       * @zh
       * 用一条法线和一个点创建平面。
       * @param out 接受操作的对象。
       * @param normal 平面的法线。
       * @param point 平面上的一点。
       * @return out 接受操作的对象。
       */

    }, {
      key: "fromNormalAndPoint",
      value: function fromNormalAndPoint(out, normal, point) {
        _index.Vec3.copy(out.n, normal);

        out.d = _index.Vec3.dot(normal, point);
        return out;
      }
      /**
       * @en
       * normalize a plane
       * @zh
       * 归一化一个平面。
       * @param out 接受操作的对象。
       * @param a 操作的源数据。
       * @return out 接受操作的对象。
       */

    }, {
      key: "normalize",
      value: function normalize(out, a) {
        var len = a.n.length();

        _index.Vec3.normalize(out.n, a.n);

        if (len > 0) {
          out.d = a.d / len;
        }

        return out;
      }
      /**
       * @en
       * The normal of the plane.
       * @zh
       * 法线向量。
       */

    }]);

    /**
     * @en
     * Construct a plane.
     * @zh
     * 构造一个平面。
     * @param nx 法向分量的 x 部分。
     * @param ny 法向分量的 y 部分。
     * @param nz 法向分量的 z 部分。
     * @param d 与原点的距离。
     */
    function plane() {
      var nx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var ny = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var nz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var d = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

      _classCallCheck(this, plane);

      this.n = void 0;
      this.d = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_PLANE;
      this.n = new _index.Vec3(nx, ny, nz);
      this.d = d;
    }
    /**
     * @en
     * transform this plane.
     * @zh
     * 变换一个平面。
     * @param mat
     */


    _createClass(plane, [{
      key: "transform",
      value: function transform(mat) {
        _index.Mat4.invert(temp_mat, mat);

        _index.Mat4.transpose(temp_mat, temp_mat);

        _index.Vec4.set(temp_vec4, this.n.x, this.n.y, this.n.z, this.d);

        _index.Vec4.transformMat4(temp_vec4, temp_vec4, temp_mat);

        _index.Vec3.set(this.n, temp_vec4.x, temp_vec4.y, temp_vec4.z);

        this.d = temp_vec4.w;
      }
    }]);

    return plane;
  }();

  _exports.default = plane;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvcGxhbmUudHMiXSwibmFtZXMiOlsidjEiLCJWZWMzIiwidjIiLCJ0ZW1wX21hdCIsImxlZ2FjeUNDIiwibWF0NCIsInRlbXBfdmVjNCIsInY0IiwicGxhbmUiLCJfdHlwZSIsInZhbCIsIm4iLCJ4IiwieSIsInoiLCJkIiwibngiLCJueSIsIm56IiwicCIsIm91dCIsImNvcHkiLCJhIiwiYiIsImMiLCJzdWJ0cmFjdCIsIm5vcm1hbGl6ZSIsImNyb3NzIiwiZG90Iiwibm9ybWFsIiwicG9pbnQiLCJsZW4iLCJsZW5ndGgiLCJlbnVtcyIsIlNIQVBFX1BMQU5FIiwibWF0IiwiTWF0NCIsImludmVydCIsInRyYW5zcG9zZSIsIlZlYzQiLCJzZXQiLCJ0cmFuc2Zvcm1NYXQ0IiwidyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQSxNQUFNQSxFQUFFLEdBQUcsSUFBSUMsV0FBSixDQUFTLENBQVQsRUFBWSxDQUFaLEVBQWUsQ0FBZixDQUFYO0FBQ0EsTUFBTUMsRUFBRSxHQUFHLElBQUlELFdBQUosQ0FBUyxDQUFULEVBQVksQ0FBWixFQUFlLENBQWYsQ0FBWDs7QUFDQSxNQUFNRSxRQUFRLEdBQUdDLHdCQUFTQyxJQUFULEVBQWpCOztBQUNBLE1BQU1DLFNBQVMsR0FBR0Ysd0JBQVNHLEVBQVQsRUFBbEI7QUFFQTs7Ozs7O0FBTUE7OztNQUNxQkMsSzs7OztBQTBJakI7Ozs7OzswQkFNWTtBQUNSLGVBQU8sS0FBS0MsS0FBWjtBQUNILE8sQ0FFRDs7Ozt3QkFDT0MsRyxFQUFLO0FBQUUsYUFBS0MsQ0FBTCxDQUFPQyxDQUFQLEdBQVdGLEdBQVg7QUFBaUIsTzswQkFDdEI7QUFBRSxlQUFPLEtBQUtDLENBQUwsQ0FBT0MsQ0FBZDtBQUFrQjs7O3dCQUN0QkYsRyxFQUFLO0FBQUUsYUFBS0MsQ0FBTCxDQUFPRSxDQUFQLEdBQVdILEdBQVg7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USxDQUFyRDs7QUFDQSxhQUFLQyxDQUFMLEdBQVNULFNBQVMsQ0FBQ29DLENBQW5CO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNhdGVnb3J5IGdlb21ldHJ5XHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgTWF0NCwgVmVjMywgVmVjNCB9IGZyb20gJy4uL21hdGgnO1xyXG5pbXBvcnQgZW51bXMgZnJvbSAnLi9lbnVtcyc7XHJcbmltcG9ydCB7IGxlZ2FjeUNDIH0gZnJvbSAnLi4vZ2xvYmFsLWV4cG9ydHMnO1xyXG5cclxuY29uc3QgdjEgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuY29uc3QgdjIgPSBuZXcgVmVjMygwLCAwLCAwKTtcclxuY29uc3QgdGVtcF9tYXQgPSBsZWdhY3lDQy5tYXQ0KCk7XHJcbmNvbnN0IHRlbXBfdmVjNCA9IGxlZ2FjeUNDLnY0KCk7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEJhc2ljIEdlb21ldHJ5OiBwbGFuZS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9lSBwbGFuZeOAglxyXG4gKi9cclxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNsYXNzLW5hbWVcclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgcGxhbmUge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgcGxhbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yib5bu65LiA5Liq5paw55qEIHBsYW5l44CCXHJcbiAgICAgKiBAcGFyYW0gbngg5rOV5ZCR5YiG6YeP55qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnkg5rOV5ZCR5YiG6YeP55qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnog5rOV5ZCR5YiG6YeP55qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZCDkuI7ljp/ngrnnmoTot53nprvjgIJcclxuICAgICAqIEByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKG54OiBudW1iZXIsIG55OiBudW1iZXIsIG56OiBudW1iZXIsIGQ6IG51bWJlcikge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGxhbmUobngsIG55LCBueiwgZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNsb25lIGEgbmV3IHBsYW5lXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWFi+mahuS4gOS4quaWsOeahCBwbGFuZeOAglxyXG4gICAgICogQHBhcmFtIHAg5YWL6ZqG55qE5p2l5rqQ44CCXHJcbiAgICAgKiBAcmV0dXJuIOWFi+mahuWHuueahOWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNsb25lIChwOiBwbGFuZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgcGxhbmUocC5uLngsIHAubi55LCBwLm4ueiwgcC5kKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY29weSB0aGUgdmFsdWVzIGZyb20gb25lIHBsYW5lIHRvIGFub3RoZXJcclxuICAgICAqIEB6aFxyXG4gICAgICog5aSN5Yi25LiA5Liq5bmz6Z2i55qE5YC85Yiw5Y+m5LiA5Liq44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOaOpeWPl+aTjeS9nOeahOWvueixoeOAglxyXG4gICAgICogQHBhcmFtIHAg5aSN5Yi255qE5p2l5rqQ44CCXHJcbiAgICAgKiBAcmV0dXJuIOaOpeWPl+aTjeS9nOeahOWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGNvcHkgKG91dDogcGxhbmUsIHA6IHBsYW5lKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5uLCBwLm4pO1xyXG4gICAgICAgIG91dC5kID0gcC5kO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBwbGFuZSBmcm9tIHRocmVlIHBvaW50c1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjkuInkuKrngrnliJvlu7rkuIDkuKrlubPpnaLjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5o6l5Y+X5pON5L2c55qE5a+56LGh44CCXHJcbiAgICAgKiBAcGFyYW0gYSDngrkgYeOAglxyXG4gICAgICogQHBhcmFtIGIg54K5IGLjgIJcclxuICAgICAqIEBwYXJhbSBjIOeCuSBj44CCXHJcbiAgICAgKiBAcmV0dXJuIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzIChvdXQ6IHBsYW5lLCBhOiBWZWMzLCBiOiBWZWMzLCBjOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh2MSwgYiwgYSk7XHJcbiAgICAgICAgVmVjMy5zdWJ0cmFjdCh2MiwgYywgYSk7XHJcblxyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKG91dC5uLCBWZWMzLmNyb3NzKG91dC5uLCB2MSwgdjIpKTtcclxuICAgICAgICBvdXQuZCA9IFZlYzMuZG90KG91dC5uLCBhKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgcGxhbmUgdG8gdGhlIGdpdmVuIHZhbHVlc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbnu5nlrprlubPpnaLnmoTlsZ7mgKforr7nva7kuLrnu5nlrprlgLzjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5o6l5Y+X5pON5L2c55qE5a+56LGh44CCXHJcbiAgICAgKiBAcGFyYW0gbngg5rOV5ZCR5YiG6YeP55qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnkg5rOV5ZCR5YiG6YeP55qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnog5rOV5ZCR5YiG6YeP55qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZCDkuI7ljp/ngrnnmoTot53nprvjgIJcclxuICAgICAqIEByZXR1cm4gb3V0IOaOpeWPl+aTjeS9nOeahOWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIHNldCAob3V0OiBwbGFuZSwgbng6IG51bWJlciwgbnk6IG51bWJlciwgbno6IG51bWJlciwgZDogbnVtYmVyKSB7XHJcbiAgICAgICAgb3V0Lm4ueCA9IG54O1xyXG4gICAgICAgIG91dC5uLnkgPSBueTtcclxuICAgICAgICBvdXQubi56ID0gbno7XHJcbiAgICAgICAgb3V0LmQgPSBkO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgcGxhbmUgZnJvbSBub3JtYWwgYW5kIHBvaW50XHJcbiAgICAgKiBAemhcclxuICAgICAqIOeUqOS4gOadoeazlee6v+WSjOS4gOS4queCueWIm+W7uuW5s+mdouOAglxyXG4gICAgICogQHBhcmFtIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqIEBwYXJhbSBub3JtYWwg5bmz6Z2i55qE5rOV57q/44CCXHJcbiAgICAgKiBAcGFyYW0gcG9pbnQg5bmz6Z2i5LiK55qE5LiA54K544CCXHJcbiAgICAgKiBAcmV0dXJuIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tTm9ybWFsQW5kUG9pbnQgKG91dDogcGxhbmUsIG5vcm1hbDogVmVjMywgcG9pbnQ6IFZlYzMpIHtcclxuICAgICAgICBWZWMzLmNvcHkob3V0Lm4sIG5vcm1hbCk7XHJcbiAgICAgICAgb3V0LmQgPSBWZWMzLmRvdChub3JtYWwsIHBvaW50KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogbm9ybWFsaXplIGEgcGxhbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5b2S5LiA5YyW5LiA5Liq5bmz6Z2i44CCXHJcbiAgICAgKiBAcGFyYW0gb3V0IOaOpeWPl+aTjeS9nOeahOWvueixoeOAglxyXG4gICAgICogQHBhcmFtIGEg5pON5L2c55qE5rqQ5pWw5o2u44CCXHJcbiAgICAgKiBAcmV0dXJuIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBub3JtYWxpemUgKG91dDogcGxhbmUsIGE6IHBsYW5lKSB7XHJcbiAgICAgICAgY29uc3QgbGVuID0gYS5uLmxlbmd0aCgpO1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKG91dC5uLCBhLm4pO1xyXG4gICAgICAgIGlmIChsZW4gPiAwKSB7XHJcbiAgICAgICAgICAgIG91dC5kID0gYS5kIC8gbGVuO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbm9ybWFsIG9mIHRoZSBwbGFuZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5rOV57q/5ZCR6YeP44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBuOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZGlzdGFuY2UgZnJvbSB0aGUgb3JpZ2luIHRvIHRoZSBwbGFuZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Y6f54K55Yiw5bmz6Z2i55qE6Led56a744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIHNoYXBlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvaLnirbnmoTnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGNvbXBhdGliaWxpdHkgd2l0aCB2ZWN0b3IgaW50ZXJmYWNlc1xyXG4gICAgc2V0IHggKHZhbCkgeyB0aGlzLm4ueCA9IHZhbDsgfVxyXG4gICAgZ2V0IHggKCkgeyByZXR1cm4gdGhpcy5uLng7IH1cclxuICAgIHNldCB5ICh2YWwpIHsgdGhpcy5uLnkgPSB2YWw7IH1cclxuICAgIGdldCB5ICgpIHsgcmV0dXJuIHRoaXMubi55OyB9XHJcbiAgICBzZXQgeiAodmFsKSB7IHRoaXMubi56ID0gdmFsOyB9XHJcbiAgICBnZXQgeiAoKSB7IHJldHVybiB0aGlzLm4uejsgfVxyXG4gICAgc2V0IHcgKHZhbCkgeyB0aGlzLmQgPSB2YWw7IH1cclxuICAgIGdldCB3ICgpIHsgcmV0dXJuIHRoaXMuZDsgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBfdHlwZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSBwbGFuZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5p6E6YCg5LiA5Liq5bmz6Z2i44CCXHJcbiAgICAgKiBAcGFyYW0gbngg5rOV5ZCR5YiG6YeP55qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnkg5rOV5ZCR5YiG6YeP55qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gbnog5rOV5ZCR5YiG6YeP55qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZCDkuI7ljp/ngrnnmoTot53nprvjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG54ID0gMCwgbnkgPSAxLCBueiA9IDAsIGQgPSAwKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX1BMQU5FO1xyXG4gICAgICAgIHRoaXMubiA9IG5ldyBWZWMzKG54LCBueSwgbnopO1xyXG4gICAgICAgIHRoaXMuZCA9IGQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIHRyYW5zZm9ybSB0aGlzIHBsYW5lLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlj5jmjaLkuIDkuKrlubPpnaLjgIJcclxuICAgICAqIEBwYXJhbSBtYXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHRyYW5zZm9ybSAobWF0OiBNYXQ0KTogdm9pZCB7XHJcbiAgICAgICAgTWF0NC5pbnZlcnQodGVtcF9tYXQsIG1hdCk7XHJcbiAgICAgICAgTWF0NC50cmFuc3Bvc2UodGVtcF9tYXQsIHRlbXBfbWF0KTtcclxuICAgICAgICBWZWM0LnNldCh0ZW1wX3ZlYzQsIHRoaXMubi54LCB0aGlzLm4ueSwgdGhpcy5uLnosIHRoaXMuZCk7XHJcbiAgICAgICAgVmVjNC50cmFuc2Zvcm1NYXQ0KHRlbXBfdmVjNCwgdGVtcF92ZWM0LCB0ZW1wX21hdCk7XHJcbiAgICAgICAgVmVjMy5zZXQodGhpcy5uLCB0ZW1wX3ZlYzQueCwgdGVtcF92ZWM0LnksIHRlbXBfdmVjNC56KTtcclxuICAgICAgICB0aGlzLmQgPSB0ZW1wX3ZlYzQudztcclxuICAgIH1cclxufVxyXG4iXX0=