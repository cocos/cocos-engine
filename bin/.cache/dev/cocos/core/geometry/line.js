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
    global.line = mod.exports;
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
   * Basic Geometry: line.
   * @zh
   * 基础几何 line。
   */
  // tslint:disable-next-line:class-name
  var line = /*#__PURE__*/function () {
    _createClass(line, [{
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
       * create a new line
       * @zh
       * 创建一个新的 line。
       * @param sx 起点的 x 部分。
       * @param sy 起点的 y 部分。
       * @param sz 起点的 z 部分。
       * @param ex 终点的 x 部分。
       * @param ey 终点的 y 部分。
       * @param ez 终点的 z 部分。
       * @return
       */
      value: function create(sx, sy, sz, ex, ey, ez) {
        return new line(sx, sy, sz, ex, ey, ez);
      }
      /**
       * @en
       * Creates a new line initialized with values from an existing line
       * @zh
       * 克隆一个新的 line。
       * @param a 克隆的来源。
       * @return 克隆出的对象。
       */

    }, {
      key: "clone",
      value: function clone(a) {
        return new line(a.s.x, a.s.y, a.s.z, a.e.x, a.e.y, a.e.z);
      }
      /**
       * @en
       * Copy the values from one line to another
       * @zh
       * 复制一个线的值到另一个。
       * @param out 接受操作的对象。
       * @param a 复制的来源。
       * @return 接受操作的对象。
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        _index.Vec3.copy(out.s, a.s);

        _index.Vec3.copy(out.e, a.e);

        return out;
      }
      /**
       * @en
       * create a line from two points
       * @zh
       * 用两个点创建一个线。
       * @param out 接受操作的对象。
       * @param start 起点。
       * @param end 终点。
       * @return out 接受操作的对象。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, start, end) {
        _index.Vec3.copy(out.s, start);

        _index.Vec3.copy(out.e, end);

        return out;
      }
      /**
       * @en
       * Set the components of a Vec3 to the given values
       * @zh
       * 将给定线的属性设置为给定值。
       * @param out 接受操作的对象。
       * @param sx 起点的 x 部分。
       * @param sy 起点的 y 部分。
       * @param sz 起点的 z 部分。
       * @param ex 终点的 x 部分。
       * @param ey 终点的 y 部分。
       * @param ez 终点的 z 部分。
       * @return out 接受操作的对象。
       */

    }, {
      key: "set",
      value: function set(out, sx, sy, sz, ex, ey, ez) {
        out.s.x = sx;
        out.s.y = sy;
        out.s.z = sz;
        out.e.x = ex;
        out.e.y = ey;
        out.e.z = ez;
        return out;
      }
      /**
       * @zh
       * 计算线的长度。
       * @param a 要计算的线。
       * @return 长度。
       */

    }, {
      key: "len",
      value: function len(a) {
        return _index.Vec3.distance(a.s, a.e);
      }
      /**
       * @zh
       * 起点。
       */

    }]);

    /**
     * 构造一条线。
     * @param sx 起点的 x 部分。
     * @param sy 起点的 y 部分。
     * @param sz 起点的 z 部分。
     * @param ex 终点的 x 部分。
     * @param ey 终点的 y 部分。
     * @param ez 终点的 z 部分。
     */
    function line() {
      var sx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var sy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var sz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var ex = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var ey = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var ez = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;

      _classCallCheck(this, line);

      this.s = void 0;
      this.e = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_LINE;
      this.s = new _index.Vec3(sx, sy, sz);
      this.e = new _index.Vec3(ex, ey, ez);
    }
    /**
     * @zh
     * 计算线的长度。
     * @param a 要计算的线。
     * @return 长度。
     */


    _createClass(line, [{
      key: "length",
      value: function length() {
        return _index.Vec3.distance(this.s, this.e);
      }
    }]);

    return line;
  }();

  _exports.default = line;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvbGluZS50cyJdLCJuYW1lcyI6WyJsaW5lIiwiX3R5cGUiLCJzeCIsInN5Iiwic3oiLCJleCIsImV5IiwiZXoiLCJhIiwicyIsIngiLCJ5IiwieiIsImUiLCJvdXQiLCJWZWMzIiwiY29weSIsInN0YXJ0IiwiZW5kIiwiZGlzdGFuY2UiLCJlbnVtcyIsIlNIQVBFX0xJTkUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBT0E7Ozs7OztBQU1BO01BQ3FCQSxJOzs7O0FBaUhqQjs7Ozs7OzBCQU1ZO0FBQ1IsZUFBTyxLQUFLQyxLQUFaO0FBQ0g7Ozs7QUF2SEQ7Ozs7Ozs7Ozs7Ozs7NkJBYXNCQyxFLEVBQVlDLEUsRUFBWUMsRSxFQUFZQyxFLEVBQVlDLEUsRUFBWUMsRSxFQUFZO0FBQzFGLGVBQU8sSUFBSVAsSUFBSixDQUFTRSxFQUFULEVBQWFDLEVBQWIsRUFBaUJDLEVBQWpCLEVBQXFCQyxFQUFyQixFQUF5QkMsRUFBekIsRUFBNkJDLEVBQTdCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs0QkFRcUJDLEMsRUFBUztBQUMxQixlQUFPLElBQUlSLElBQUosQ0FDSFEsQ0FBQyxDQUFDQyxDQUFGLENBQUlDLENBREQsRUFDSUYsQ0FBQyxDQUFDQyxDQUFGLENBQUlFLENBRFIsRUFDV0gsQ0FBQyxDQUFDQyxDQUFGLENBQUlHLENBRGYsRUFFSEosQ0FBQyxDQUFDSyxDQUFGLENBQUlILENBRkQsRUFFSUYsQ0FBQyxDQUFDSyxDQUFGLENBQUlGLENBRlIsRUFFV0gsQ0FBQyxDQUFDSyxDQUFGLENBQUlELENBRmYsQ0FBUDtBQUlIO0FBRUQ7Ozs7Ozs7Ozs7OzsyQkFTb0JFLEcsRUFBV04sQyxFQUFTO0FBQ3BDTyxvQkFBS0MsSUFBTCxDQUFVRixHQUFHLENBQUNMLENBQWQsRUFBaUJELENBQUMsQ0FBQ0MsQ0FBbkI7O0FBQ0FNLG9CQUFLQyxJQUFMLENBQVVGLEdBQUcsQ0FBQ0QsQ0FBZCxFQUFpQkwsQ0FBQyxDQUFDSyxDQUFuQjs7QUFFQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVMEJBLEcsRUFBV0csSyxFQUFhQyxHLEVBQVc7QUFDekRILG9CQUFLQyxJQUFMLENBQVVGLEdBQUcsQ0FBQ0wsQ0FBZCxFQUFpQlEsS0FBakI7O0FBQ0FGLG9CQUFLQyxJQUFMLENBQVVGLEdBQUcsQ0FBQ0QsQ0FBZCxFQUFpQkssR0FBakI7O0FBQ0EsZUFBT0osR0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7OzBCQWNtQkEsRyxFQUFXWixFLEVBQVlDLEUsRUFBWUMsRSxFQUFZQyxFLEVBQVlDLEUsRUFBWUMsRSxFQUFZO0FBQ2xHTyxRQUFBQSxHQUFHLENBQUNMLENBQUosQ0FBTUMsQ0FBTixHQUFVUixFQUFWO0FBQ0FZLFFBQUFBLEdBQUcsQ0FBQ0wsQ0FBSixDQUFNRSxDQUFOLEdBQVVSLEVBQVY7QUFDQVcsUUFBQUEsR0FBRyxDQUFDTCxDQUFKLENBQU1HLENBQU4sR0FBVVIsRUFBVjtBQUNBVSxRQUFBQSxHQUFHLENBQUNELENBQUosQ0FBTUgsQ0FBTixHQUFVTCxFQUFWO0FBQ0FTLFFBQUFBLEdBQUcsQ0FBQ0QsQ0FBSixDQUFNRixDQUFOLEdBQVVMLEVBQVY7QUFDQVEsUUFBQUEsR0FBRyxDQUFDRCxDQUFKLENBQU1ELENBQU4sR0FBVUwsRUFBVjtBQUVBLGVBQU9PLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7MEJBTW1CTixDLEVBQVM7QUFDeEIsZUFBT08sWUFBS0ksUUFBTCxDQUFjWCxDQUFDLENBQUNDLENBQWhCLEVBQW1CRCxDQUFDLENBQUNLLENBQXJCLENBQVA7QUFDSDtBQUVEOzs7Ozs7O0FBd0JBOzs7Ozs7Ozs7QUFTQSxvQkFBOEQ7QUFBQSxVQUFqRFgsRUFBaUQsdUVBQTVDLENBQTRDO0FBQUEsVUFBekNDLEVBQXlDLHVFQUFwQyxDQUFvQztBQUFBLFVBQWpDQyxFQUFpQyx1RUFBNUIsQ0FBNEI7QUFBQSxVQUF6QkMsRUFBeUIsdUVBQXBCLENBQW9CO0FBQUEsVUFBakJDLEVBQWlCLHVFQUFaLENBQVk7QUFBQSxVQUFUQyxFQUFTLHVFQUFKLENBQUMsQ0FBRzs7QUFBQTs7QUFBQSxXQTdCdkRFLENBNkJ1RDtBQUFBLFdBdkJ2REksQ0F1QnVEO0FBQUEsV0FYN0NaLEtBVzZDO0FBQzFELFdBQUtBLEtBQUwsR0FBYW1CLGVBQU1DLFVBQW5CO0FBQ0EsV0FBS1osQ0FBTCxHQUFTLElBQUlNLFdBQUosQ0FBU2IsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFUO0FBQ0EsV0FBS1MsQ0FBTCxHQUFTLElBQUlFLFdBQUosQ0FBU1YsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFUO0FBQ0g7QUFFRDs7Ozs7Ozs7OzsrQkFNaUI7QUFDYixlQUFPUSxZQUFLSSxRQUFMLENBQWMsS0FBS1YsQ0FBbkIsRUFBc0IsS0FBS0ksQ0FBM0IsQ0FBUDtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBnZW9tZXRyeVxyXG4gKi9cclxuXHJcbmltcG9ydCB7IFZlYzMgfSBmcm9tICcuLi9tYXRoJztcclxuaW1wb3J0IGVudW1zIGZyb20gJy4vZW51bXMnO1xyXG5cclxuLyoqXHJcbiAqIEBlblxyXG4gKiBCYXNpYyBHZW9tZXRyeTogbGluZS5cclxuICogQHpoXHJcbiAqIOWfuuehgOWHoOS9lSBsaW5l44CCXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBsaW5lIHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogY3JlYXRlIGEgbmV3IGxpbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5Yib5bu65LiA5Liq5paw55qEIGxpbmXjgIJcclxuICAgICAqIEBwYXJhbSBzeCDotbfngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBzeSDotbfngrnnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBzeiDotbfngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleCDnu4jngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleSDnu4jngrnnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleiDnu4jngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEByZXR1cm5cclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKHN4OiBudW1iZXIsIHN5OiBudW1iZXIsIHN6OiBudW1iZXIsIGV4OiBudW1iZXIsIGV5OiBudW1iZXIsIGV6OiBudW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gbmV3IGxpbmUoc3gsIHN5LCBzeiwgZXgsIGV5LCBleik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIENyZWF0ZXMgYSBuZXcgbGluZSBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIGxpbmVcclxuICAgICAqIEB6aFxyXG4gICAgICog5YWL6ZqG5LiA5Liq5paw55qEIGxpbmXjgIJcclxuICAgICAqIEBwYXJhbSBhIOWFi+mahueahOadpea6kOOAglxyXG4gICAgICogQHJldHVybiDlhYvpmoblh7rnmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAoYTogbGluZSkge1xyXG4gICAgICAgIHJldHVybiBuZXcgbGluZShcclxuICAgICAgICAgICAgYS5zLngsIGEucy55LCBhLnMueixcclxuICAgICAgICAgICAgYS5lLngsIGEuZS55LCBhLmUueixcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgbGluZSB0byBhbm90aGVyXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWkjeWItuS4gOS4que6v+eahOWAvOWIsOWPpuS4gOS4quOAglxyXG4gICAgICogQHBhcmFtIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqIEBwYXJhbSBhIOWkjeWItueahOadpea6kOOAglxyXG4gICAgICogQHJldHVybiDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IGxpbmUsIGE6IGxpbmUpIHtcclxuICAgICAgICBWZWMzLmNvcHkob3V0LnMsIGEucyk7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5lLCBhLmUpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBsaW5lIGZyb20gdHdvIHBvaW50c1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDnlKjkuKTkuKrngrnliJvlu7rkuIDkuKrnur/jgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5o6l5Y+X5pON5L2c55qE5a+56LGh44CCXHJcbiAgICAgKiBAcGFyYW0gc3RhcnQg6LW354K544CCXHJcbiAgICAgKiBAcGFyYW0gZW5kIOe7iOeCueOAglxyXG4gICAgICogQHJldHVybiBvdXQg5o6l5Y+X5pON5L2c55qE5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBzdGF0aWMgZnJvbVBvaW50cyAob3V0OiBsaW5lLCBzdGFydDogVmVjMywgZW5kOiBWZWMzKSB7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5zLCBzdGFydCk7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5lLCBlbmQpO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFNldCB0aGUgY29tcG9uZW50cyBvZiBhIFZlYzMgdG8gdGhlIGdpdmVuIHZhbHVlc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbnu5nlrprnur/nmoTlsZ7mgKforr7nva7kuLrnu5nlrprlgLzjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5o6l5Y+X5pON5L2c55qE5a+56LGh44CCXHJcbiAgICAgKiBAcGFyYW0gc3gg6LW354K555qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gc3kg6LW354K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gc3og6LW354K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZXgg57uI54K555qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZXkg57uI54K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0gZXog57uI54K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcmV0dXJuIG91dCDmjqXlj5fmk43kvZznmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgKG91dDogbGluZSwgc3g6IG51bWJlciwgc3k6IG51bWJlciwgc3o6IG51bWJlciwgZXg6IG51bWJlciwgZXk6IG51bWJlciwgZXo6IG51bWJlcikge1xyXG4gICAgICAgIG91dC5zLnggPSBzeDtcclxuICAgICAgICBvdXQucy55ID0gc3k7XHJcbiAgICAgICAgb3V0LnMueiA9IHN6O1xyXG4gICAgICAgIG91dC5lLnggPSBleDtcclxuICAgICAgICBvdXQuZS55ID0gZXk7XHJcbiAgICAgICAgb3V0LmUueiA9IGV6O1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDorqHnrpfnur/nmoTplb/luqbjgIJcclxuICAgICAqIEBwYXJhbSBhIOimgeiuoeeul+eahOe6v+OAglxyXG4gICAgICogQHJldHVybiDplb/luqbjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBsZW4gKGE6IGxpbmUpIHtcclxuICAgICAgICByZXR1cm4gVmVjMy5kaXN0YW5jZShhLnMsIGEuZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi1t+eCueOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgczogVmVjMztcclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog57uI54K544CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBlOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBzaGFwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5b2i54q255qE57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IF90eXBlOiBudW1iZXI7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDkuIDmnaHnur/jgIJcclxuICAgICAqIEBwYXJhbSBzeCDotbfngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBzeSDotbfngrnnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBzeiDotbfngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleCDnu4jngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleSDnu4jngrnnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSBleiDnu4jngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKHN4ID0gMCwgc3kgPSAwLCBzeiA9IDAsIGV4ID0gMCwgZXkgPSAwLCBleiA9IC0xKSB7XHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IGVudW1zLlNIQVBFX0xJTkU7XHJcbiAgICAgICAgdGhpcy5zID0gbmV3IFZlYzMoc3gsIHN5LCBzeik7XHJcbiAgICAgICAgdGhpcy5lID0gbmV3IFZlYzMoZXgsIGV5LCBleik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuoeeul+e6v+eahOmVv+W6puOAglxyXG4gICAgICogQHBhcmFtIGEg6KaB6K6h566X55qE57q/44CCXHJcbiAgICAgKiBAcmV0dXJuIOmVv+W6puOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gVmVjMy5kaXN0YW5jZSh0aGlzLnMsIHRoaXMuZSk7XHJcbiAgICB9XHJcbn1cclxuIl19