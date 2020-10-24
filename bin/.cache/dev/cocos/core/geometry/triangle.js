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
    global.triangle = mod.exports;
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

  /**
   * @en
   * Basic Geometry: triangle.
   * @zh
   * 基础几何 三角形。
   */
  // tslint:disable-next-line:class-name
  var triangle = /*#__PURE__*/function () {
    _createClass(triangle, [{
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
       * create a new triangle
       * @zh
       * 创建一个新的 triangle。
       * @param {number} ax a 点的 x 部分。
       * @param {number} ay a 点的 y 部分。
       * @param {number} az a 点的 z 部分。
       * @param {number} bx b 点的 x 部分。
       * @param {number} by b 点的 y 部分。
       * @param {number} bz b 点的 z 部分。
       * @param {number} cx c 点的 x 部分。
       * @param {number} cy c 点的 y 部分。
       * @param {number} cz c 点的 z 部分。
       * @return {triangle} 一个新的 triangle。
       */
      value: function create() {
        var ax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        var ay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var az = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var bx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var by = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var bz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var cx = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var cy = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;
        var cz = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 1;
        return new triangle(ax, ay, az, bx, by, bz, cx, cy, cz);
      }
      /**
       * @en
       * clone a new triangle
       * @zh
       * 克隆一个新的 triangle。
       * @param {triangle} t 克隆的目标。
       * @return {triangle} 克隆出的新对象。
       */

    }, {
      key: "clone",
      value: function clone(t) {
        return new triangle(t.a.x, t.a.y, t.a.z, t.b.x, t.b.y, t.b.z, t.c.x, t.c.y, t.c.z);
      }
      /**
       * @en
       * copy the values from one triangle to another
       * @zh
       * 将一个 triangle 的值复制到另一个 triangle。
       * @param {triangle} out 接受操作的 triangle。
       * @param {triangle} t 被复制的 triangle。
       * @return {triangle} out 接受操作的 triangle。
       */

    }, {
      key: "copy",
      value: function copy(out, t) {
        _index.Vec3.copy(out.a, t.a);

        _index.Vec3.copy(out.b, t.b);

        _index.Vec3.copy(out.c, t.c);

        return out;
      }
      /**
       * @en
       * Create a triangle from three points
       * @zh
       * 用三个点创建一个 triangle。
       * @param {triangle} out 接受操作的 triangle。
       * @param {Vec3} a a 点。
       * @param {Vec3} b b 点。
       * @param {Vec3} c c 点。
       * @return {triangle} out 接受操作的 triangle。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, a, b, c) {
        _index.Vec3.copy(out.a, a);

        _index.Vec3.copy(out.b, b);

        _index.Vec3.copy(out.c, c);

        return out;
      }
      /**
       * @en
       * Set the components of a triangle to the given values
       * @zh
       * 将给定三角形的属性设置为给定值。
       * @param {triangle} out 给定的三角形。
       * @param {number} ax a 点的 x 部分。
       * @param {number} ay a 点的 y 部分。
       * @param {number} az a 点的 z 部分。
       * @param {number} bx b 点的 x 部分。
       * @param {number} by b 点的 y 部分。
       * @param {number} bz b 点的 z 部分。
       * @param {number} cx c 点的 x 部分。
       * @param {number} cy c 点的 y 部分。
       * @param {number} cz c 点的 z 部分。
       * @return {triangle}
       * @function
       */

    }, {
      key: "set",
      value: function set(out, ax, ay, az, bx, by, bz, cx, cy, cz) {
        out.a.x = ax;
        out.a.y = ay;
        out.a.z = az;
        out.b.x = bx;
        out.b.y = by;
        out.b.z = bz;
        out.c.x = cx;
        out.c.y = cy;
        out.c.z = cz;
        return out;
      }
      /**
       * @en
       * Point a.
       * @zh
       * 点 a。
       */

    }]);

    /**
     * @en
     * Construct a triangle.
     * @zh
     * 构造一个三角形。
     * @param {number} ax a 点的 x 部分。
     * @param {number} ay a 点的 y 部分。
     * @param {number} az a 点的 z 部分。
     * @param {number} bx b 点的 x 部分。
     * @param {number} by b 点的 y 部分。
     * @param {number} bz b 点的 z 部分。
     * @param {number} cx c 点的 x 部分。
     * @param {number} cy c 点的 y 部分。
     * @param {number} cz c 点的 z 部分。
     */
    function triangle() {
      var ax = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var ay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var az = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var bx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
      var by = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var bz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
      var cx = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
      var cy = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
      var cz = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 0;

      _classCallCheck(this, triangle);

      this.a = void 0;
      this.b = void 0;
      this.c = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_TRIANGLE;
      this.a = new _index.Vec3(ax, ay, az);
      this.b = new _index.Vec3(bx, by, bz);
      this.c = new _index.Vec3(cx, cy, cz);
    }

    return triangle;
  }();

  _exports.default = triangle;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvdHJpYW5nbGUudHMiXSwibmFtZXMiOlsidHJpYW5nbGUiLCJfdHlwZSIsImF4IiwiYXkiLCJheiIsImJ4IiwiYnkiLCJieiIsImN4IiwiY3kiLCJjeiIsInQiLCJhIiwieCIsInkiLCJ6IiwiYiIsImMiLCJvdXQiLCJWZWMzIiwiY29weSIsImVudW1zIiwiU0hBUEVfVFJJQU5HTEUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0E7Ozs7OztBQU1BO01BQ3FCQSxROzs7O0FBd0lqQjs7Ozs7OzBCQU1ZO0FBQ1IsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozs7QUE5SUQ7Ozs7Ozs7Ozs7Ozs7Ozs7K0JBa0JnRjtBQUFBLFlBRjFEQyxFQUUwRCx1RUFGN0MsQ0FFNkM7QUFBQSxZQUYxQ0MsRUFFMEMsdUVBRjdCLENBRTZCO0FBQUEsWUFGMUJDLEVBRTBCLHVFQUZiLENBRWE7QUFBQSxZQUQxREMsRUFDMEQsdUVBRDdDLENBQzZDO0FBQUEsWUFEMUNDLEVBQzBDLHVFQUQ3QixDQUM2QjtBQUFBLFlBRDFCQyxFQUMwQix1RUFEYixDQUNhO0FBQUEsWUFBMURDLEVBQTBELHVFQUE3QyxDQUE2QztBQUFBLFlBQTFDQyxFQUEwQyx1RUFBN0IsQ0FBNkI7QUFBQSxZQUExQkMsRUFBMEIsdUVBQWIsQ0FBYTtBQUM1RSxlQUFPLElBQUlWLFFBQUosQ0FBYUUsRUFBYixFQUFpQkMsRUFBakIsRUFBcUJDLEVBQXJCLEVBQXlCQyxFQUF6QixFQUE2QkMsRUFBN0IsRUFBaUNDLEVBQWpDLEVBQXFDQyxFQUFyQyxFQUF5Q0MsRUFBekMsRUFBNkNDLEVBQTdDLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs0QkFRcUJDLEMsRUFBdUI7QUFDeEMsZUFBTyxJQUFJWCxRQUFKLENBQ0hXLENBQUMsQ0FBQ0MsQ0FBRixDQUFJQyxDQURELEVBQ0lGLENBQUMsQ0FBQ0Ms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Q0FBTCxHQUFTLElBQUlPLFdBQUosQ0FBU2pCLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNBLFdBQUtZLENBQUwsR0FBUyxJQUFJRyxXQUFKLENBQVNkLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNBLFdBQUtVLENBQUwsR0FBUyxJQUFJRSxXQUFKLENBQVNYLEVBQVQsRUFBYUMsRUFBYixFQUFpQkMsRUFBakIsQ0FBVDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZW9tZXRyeVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNpYyBHZW9tZXRyeTogdHJpYW5nbGUuXHJcbiAqIEB6aFxyXG4gKiDln7rnoYDlh6DkvZUg5LiJ6KeS5b2i44CCXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyB0cmlhbmdsZSB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNyZWF0ZSBhIG5ldyB0cmlhbmdsZVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDliJvlu7rkuIDkuKrmlrDnmoQgdHJpYW5nbGXjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBheCBhIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGF5IGEg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXogYSDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieCBiIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5IGIg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnogYiDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjeCBjIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGN5IGMg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3ogYyDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEByZXR1cm4ge3RyaWFuZ2xlfSDkuIDkuKrmlrDnmoQgdHJpYW5nbGXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKGF4OiBudW1iZXIgPSAxLCBheTogbnVtYmVyID0gMCwgYXo6IG51bWJlciA9IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYng6IG51bWJlciA9IDAsIGJ5OiBudW1iZXIgPSAwLCBiejogbnVtYmVyID0gMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjeDogbnVtYmVyID0gMCwgY3k6IG51bWJlciA9IDAsIGN6OiBudW1iZXIgPSAxKTogdHJpYW5nbGUge1xyXG4gICAgICAgIHJldHVybiBuZXcgdHJpYW5nbGUoYXgsIGF5LCBheiwgYngsIGJ5LCBieiwgY3gsIGN5LCBjeik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGNsb25lIGEgbmV3IHRyaWFuZ2xlXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWFi+mahuS4gOS4quaWsOeahCB0cmlhbmdsZeOAglxyXG4gICAgICogQHBhcmFtIHt0cmlhbmdsZX0gdCDlhYvpmobnmoTnm67moIfjgIJcclxuICAgICAqIEByZXR1cm4ge3RyaWFuZ2xlfSDlhYvpmoblh7rnmoTmlrDlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAodDogdHJpYW5nbGUpOiB0cmlhbmdsZSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyB0cmlhbmdsZShcclxuICAgICAgICAgICAgdC5hLngsIHQuYS55LCB0LmEueixcclxuICAgICAgICAgICAgdC5iLngsIHQuYi55LCB0LmIueixcclxuICAgICAgICAgICAgdC5jLngsIHQuYy55LCB0LmMueixcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgdHJpYW5nbGUgdG8gYW5vdGhlclxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbkuIDkuKogdHJpYW5nbGUg55qE5YC85aSN5Yi25Yiw5Y+m5LiA5LiqIHRyaWFuZ2xl44CCXHJcbiAgICAgKiBAcGFyYW0ge3RyaWFuZ2xlfSBvdXQg5o6l5Y+X5pON5L2c55qEIHRyaWFuZ2xl44CCXHJcbiAgICAgKiBAcGFyYW0ge3RyaWFuZ2xlfSB0IOiiq+WkjeWItueahCB0cmlhbmdsZeOAglxyXG4gICAgICogQHJldHVybiB7dHJpYW5nbGV9IG91dCDmjqXlj5fmk43kvZznmoQgdHJpYW5nbGXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHRyaWFuZ2xlLCB0OiB0cmlhbmdsZSk6IHRyaWFuZ2xlIHtcclxuICAgICAgICBWZWMzLmNvcHkob3V0LmEsIHQuYSk7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5iLCB0LmIpO1xyXG4gICAgICAgIFZlYzMuY29weShvdXQuYywgdC5jKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ3JlYXRlIGEgdHJpYW5nbGUgZnJvbSB0aHJlZSBwb2ludHNcclxuICAgICAqIEB6aFxyXG4gICAgICog55So5LiJ5Liq54K55Yib5bu65LiA5LiqIHRyaWFuZ2xl44CCXHJcbiAgICAgKiBAcGFyYW0ge3RyaWFuZ2xlfSBvdXQg5o6l5Y+X5pON5L2c55qEIHRyaWFuZ2xl44CCXHJcbiAgICAgKiBAcGFyYW0ge1ZlYzN9IGEgYSDngrnjgIJcclxuICAgICAqIEBwYXJhbSB7VmVjM30gYiBiIOeCueOAglxyXG4gICAgICogQHBhcmFtIHtWZWMzfSBjIGMg54K544CCXHJcbiAgICAgKiBAcmV0dXJuIHt0cmlhbmdsZX0gb3V0IOaOpeWPl+aTjeS9nOeahCB0cmlhbmdsZeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc3RhdGljIGZyb21Qb2ludHMgKG91dDogdHJpYW5nbGUsIGE6IFZlYzMsIGI6IFZlYzMsIGM6IFZlYzMpOiB0cmlhbmdsZSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5hLCBhKTtcclxuICAgICAgICBWZWMzLmNvcHkob3V0LmIsIGIpO1xyXG4gICAgICAgIFZlYzMuY29weShvdXQuYywgYyk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogU2V0IHRoZSBjb21wb25lbnRzIG9mIGEgdHJpYW5nbGUgdG8gdGhlIGdpdmVuIHZhbHVlc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbnu5nlrprkuInop5LlvaLnmoTlsZ7mgKforr7nva7kuLrnu5nlrprlgLzjgIJcclxuICAgICAqIEBwYXJhbSB7dHJpYW5nbGV9IG91dCDnu5nlrprnmoTkuInop5LlvaLjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBheCBhIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGF5IGEg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXogYSDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieCBiIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ5IGIg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnogYiDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjeCBjIOeCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGN5IGMg54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3ogYyDngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEByZXR1cm4ge3RyaWFuZ2xlfVxyXG4gICAgICogQGZ1bmN0aW9uXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgc2V0IChvdXQ6IHRyaWFuZ2xlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgIGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGF6OiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgYng6IG51bWJlciwgYnk6IG51bWJlciwgYno6IG51bWJlcixcclxuICAgICAgICAgICAgICAgICAgICAgICBjeDogbnVtYmVyLCBjeTogbnVtYmVyLCBjejogbnVtYmVyKTogdHJpYW5nbGUge1xyXG4gICAgICAgIG91dC5hLnggPSBheDtcclxuICAgICAgICBvdXQuYS55ID0gYXk7XHJcbiAgICAgICAgb3V0LmEueiA9IGF6O1xyXG5cclxuICAgICAgICBvdXQuYi54ID0gYng7XHJcbiAgICAgICAgb3V0LmIueSA9IGJ5O1xyXG4gICAgICAgIG91dC5iLnogPSBiejtcclxuXHJcbiAgICAgICAgb3V0LmMueCA9IGN4O1xyXG4gICAgICAgIG91dC5jLnkgPSBjeTtcclxuICAgICAgICBvdXQuYy56ID0gY3o7XHJcblxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFBvaW50IGEuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOeCuSBh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBQb2ludCBiLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDngrkgYuOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYjogVmVjMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogUG9pbnQgYy5cclxuICAgICAqIEB6aFxyXG4gICAgICog54K5IGPjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGM6IFZlYzM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIEdldHMgdGhlIHR5cGUgb2YgdGhlIHNoYXBlLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blvaLnirbnmoTnsbvlnovjgIJcclxuICAgICAqL1xyXG4gICAgZ2V0IHR5cGUgKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl90eXBlO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBfdHlwZTogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb25zdHJ1Y3QgYSB0cmlhbmdsZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5p6E6YCg5LiA5Liq5LiJ6KeS5b2i44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXggYSDngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBheSBhIOeCueeahCB5IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGF6IGEg54K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYnggYiDngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBieSBiIOeCueeahCB5IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJ6IGIg54K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY3ggYyDngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjeSBjIOeCueeahCB5IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGN6IGMg54K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChheDogbnVtYmVyID0gMCwgYXk6IG51bWJlciA9IDAsIGF6OiBudW1iZXIgPSAwLFxyXG4gICAgICAgICAgICAgICAgIGJ4OiBudW1iZXIgPSAxLCBieTogbnVtYmVyID0gMCwgYno6IG51bWJlciA9IDAsXHJcbiAgICAgICAgICAgICAgICAgY3g6IG51bWJlciA9IDAsIGN5OiBudW1iZXIgPSAxLCBjejogbnVtYmVyID0gMCkge1xyXG4gICAgICAgIHRoaXMuX3R5cGUgPSBlbnVtcy5TSEFQRV9UUklBTkdMRTtcclxuICAgICAgICB0aGlzLmEgPSBuZXcgVmVjMyhheCwgYXksIGF6KTtcclxuICAgICAgICB0aGlzLmIgPSBuZXcgVmVjMyhieCwgYnksIGJ6KTtcclxuICAgICAgICB0aGlzLmMgPSBuZXcgVmVjMyhjeCwgY3ksIGN6KTtcclxuICAgIH1cclxufVxyXG4iXX0=