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
    global.ray = mod.exports;
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
   * Basic Geometry: ray.
   * @zh
   * 基础几何 射线。
   */
  // tslint:disable-next-line:class-name
  var ray = /*#__PURE__*/function () {
    _createClass(ray, [{
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
       * create a new ray
       * @zh
       * 创建一条射线。
       * @param {number} ox 起点的 x 部分。
       * @param {number} oy 起点的 y 部分。
       * @param {number} oz 起点的 z 部分。
       * @param {number} dx 方向的 x 部分。
       * @param {number} dy 方向的 y 部分。
       * @param {number} dz 方向的 z 部分。
       * @return {ray} 射线。
       */
      value: function create() {
        var ox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var oy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var oz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var dx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
        var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
        var dz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
        return new ray(ox, oy, oz, dx, dy, dz);
      }
      /**
       * @en
       * Creates a new ray initialized with values from an existing ray
       * @zh
       * 从一条射线克隆出一条新的射线。
       * @param {ray} a 克隆的目标。
       * @return {ray} 克隆出的新对象。
       */

    }, {
      key: "clone",
      value: function clone(a) {
        return new ray(a.o.x, a.o.y, a.o.z, a.d.x, a.d.y, a.d.z);
      }
      /**
       * @en
       * Copy the values from one ray to another
       * @zh
       * 将从一个 ray 的值复制到另一个 ray。
       * @param {ray} out 接受操作的 ray。
       * @param {ray} a 被复制的 ray。
       * @return {ray} out 接受操作的 ray。
       */

    }, {
      key: "copy",
      value: function copy(out, a) {
        _index.Vec3.copy(out.o, a.o);

        _index.Vec3.copy(out.d, a.d);

        return out;
      }
      /**
       * @en
       * create a ray from two points
       * @zh
       * 用两个点创建一条射线。
       * @param {ray} out 接受操作的射线。
       * @param {Vec3} origin 射线的起点。
       * @param {Vec3} target 射线上的一点。
       * @return {ray} out 接受操作的射线。
       */

    }, {
      key: "fromPoints",
      value: function fromPoints(out, origin, target) {
        _index.Vec3.copy(out.o, origin);

        _index.Vec3.normalize(out.d, _index.Vec3.subtract(out.d, target, origin));

        return out;
      }
      /**
       * @en
       * Set the components of a ray to the given values
       * @zh
       * 将给定射线的属性设置为给定的值。
       * @param {ray} out 接受操作的射线。
       * @param {number} ox 起点的 x 部分。
       * @param {number} oy 起点的 y 部分。
       * @param {number} oz 起点的 z 部分。
       * @param {number} dx 方向的 x 部分。
       * @param {number} dy 方向的 y 部分。
       * @param {number} dz 方向的 z 部分。
       * @return {ray} out 接受操作的射线。
       */

    }, {
      key: "set",
      value: function set(out, ox, oy, oz, dx, dy, dz) {
        out.o.x = ox;
        out.o.y = oy;
        out.o.z = oz;
        out.d.x = dx;
        out.d.y = dy;
        out.d.z = dz;
        return out;
      }
      /**
       * @en
       * The origin of the ray.
       * @zh
       * 起点。
       */

    }]);

    /**
     * @en
     * Construct a ray;
     * @zh
     * 构造一条射线。
     * @param {number} ox 起点的 x 部分。
     * @param {number} oy 起点的 y 部分。
     * @param {number} oz 起点的 z 部分。
     * @param {number} dx 方向的 x 部分。
     * @param {number} dy 方向的 y 部分。
     * @param {number} dz 方向的 z 部分。
     */
    function ray() {
      var ox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var oy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var oz = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
      var dx = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var dy = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
      var dz = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;

      _classCallCheck(this, ray);

      this.o = void 0;
      this.d = void 0;
      this._type = void 0;
      this._type = _enums.default.SHAPE_RAY;
      this.o = new _index.Vec3(ox, oy, oz);
      this.d = new _index.Vec3(dx, dy, dz);
    }
    /**
     * @en
     * Compute a point with the distance between the origin.
     * @zh
     * 根据给定距离计算出射线上的一点。
     * @param out 射线上的另一点。
     * @param distance 给定距离。
     */


    _createClass(ray, [{
      key: "computeHit",
      value: function computeHit(out, distance) {
        _index.Vec3.normalize(out, this.d);

        _index.Vec3.scaleAndAdd(out, this.o, out, distance);
      }
    }]);

    return ray;
  }();

  _exports.default = ray;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZ2VvbWV0cnkvcmF5LnRzIl0sIm5hbWVzIjpbInJheSIsIl90eXBlIiwib3giLCJveSIsIm96IiwiZHgiLCJkeSIsImR6IiwiYSIsIm8iLCJ4IiwieSIsInoiLCJkIiwib3V0IiwiVmVjMyIsImNvcHkiLCJvcmlnaW4iLCJ0YXJnZXQiLCJub3JtYWxpemUiLCJzdWJ0cmFjdCIsImVudW1zIiwiU0hBUEVfUkFZIiwiZGlzdGFuY2UiLCJzY2FsZUFuZEFkZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7O0FBTUE7TUFDcUJBLEc7Ozs7QUEyR2pCOzs7Ozs7MEJBTVk7QUFDUixlQUFPLEtBQUtDLEtBQVo7QUFDSDs7OztBQWpIRDs7Ozs7Ozs7Ozs7OzsrQkFhMkg7QUFBQSxZQUFyR0MsRUFBcUcsdUVBQXhGLENBQXdGO0FBQUEsWUFBckZDLEVBQXFGLHVFQUF4RSxDQUF3RTtBQUFBLFlBQXJFQyxFQUFxRSx1RUFBeEQsQ0FBd0Q7QUFBQSxZQUFyREMsRUFBcUQsdUVBQXhDLENBQXdDO0FBQUEsWUFBckNDLEVBQXFDLHVFQUF4QixDQUF3QjtBQUFBLFlBQXJCQyxFQUFxQix1RUFBUixDQUFRO0FBQ3ZILGVBQU8sSUFBSVAsR0FBSixDQUFRRSxFQUFSLEVBQVlDLEVBQVosRUFBZ0JDLEVBQWhCLEVBQW9CQyxFQUFwQixFQUF3QkMsRUFBeEIsRUFBNEJDLEVBQTVCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs0QkFRcUJDLEMsRUFBYTtBQUM5QixlQUFPLElBQUlSLEdBQUosQ0FDSFEsQ0FBQyxDQUFDQyxDQUFGLENBQUlDLENBREQsRUFDSUYsQ0FBQyxDQUFDQyxDQUFGLENBQUlFLENBRFIsRUFDV0gsQ0FBQyxDQUFDQyxDQUFGLENBQUlHLENBRGYsRUFFSEosQ0FBQyxDQUFDSyxDQUFGLENBQUlILENBRkQsRUFFSUYsQ0FBQyxDQUFDSyxDQUFGLENBQUlGLENBRlIsRUFFV0gsQ0FBQyxDQUFDSyxDQUFGLENBQUlELENBRmYsQ0FBUDtBQUlIO0FBRUQ7Ozs7Ozs7Ozs7OzsyQkFTb0JFLEcsRUFBVU4sQyxFQUFhO0FBQ3ZDTyxvQkFBS0MsSUFBTCxDQUFVRixHQUFHLENBQUNMLENBQWQsRUFBaUJELENBQUMsQ0FBQ0MsQ0FBbkI7O0FBQ0FNLG9CQUFLQyxJQUFMLENBQVVGLEdBQUcsQ0FBQ0QsQ0FBZCxFQUFpQkwsQ0FBQyxDQUFDSyxDQUFuQjs7QUFFQSxlQUFPQyxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OztpQ0FVMEJBLEcsRUFBVUcsTSxFQUFjQyxNLEVBQW1CO0FBQ2pFSCxvQkFBS0MsSUFBTCxDQUFVRixHQUFHLENBQUNMLENBQWQsRUFBaUJRLE1BQWpCOztBQUNBRixvQkFBS0ksU0FBTCxDQUFlTCxHQUFHLENBQUNELENBQW5CLEVBQXNCRSxZQUFLSyxRQUFMLENBQWNOLEdBQUcsQ0FBQ0QsQ0FBbEIsRUFBcUJLLE1BQXJCLEVBQTZCRCxNQUE3QixDQUF0Qjs7QUFDQSxlQUFPSCxHQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJBY21CQSxHLEVBQVVaLEUsRUFBWUMsRSxFQUFZQyxFLEVBQVlDLEUsRUFBWUMsRSxFQUFZQyxFLEVBQWlCO0FBQ3RHTyxRQUFBQSxHQUFHLENBQUNMLENBQUosQ0FBTUMsQ0FBTixHQUFVUixFQUFWO0FBQ0FZLFFBQUFBLEdBQUcsQ0FBQ0wsQ0FBSixDQUFNRSxDQUFOLEdBQVVSLEVBQVY7QUFDQVcsUUFBQUEsR0FBRyxDQUFDTCxDQUFKLENBQU1HLENBQU4sR0FBVVIsRUFBVjtBQUNBVSxRQUFBQSxHQUFHLENBQUNELENBQUosQ0FBTUgsQ0FBTixHQUFVTCxFQUFWO0FBQ0FTLFFBQUFBLEdBQUcsQ0FBQ0QsQ0FBSixDQUFNRixDQUFOLEdBQVVMLEVBQVY7QUFDQVEsUUFBQUEsR0FBRyxDQUFDRCxDQUFKLENBQU1ELENBQU4sR0FBVUwsRUFBVjtBQUVBLGVBQU9PLEdBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7QUE0QkE7Ozs7Ozs7Ozs7OztBQVlBLG1CQUNxRDtBQUFBLFVBRHhDWixFQUN3Qyx1RUFEM0IsQ0FDMkI7QUFBQSxVQUR4QkMsRUFDd0IsdUVBRFgsQ0FDVztBQUFBLFVBRFJDLEVBQ1EsdUVBREssQ0FDTDtBQUFBLFVBQWpEQyxFQUFpRCx1RUFBcEMsQ0FBb0M7QUFBQSxVQUFqQ0MsRUFBaUMsdUVBQXBCLENBQW9CO0FBQUEsVUFBakJDLEVBQWlCLHVFQUFKLENBQUMsQ0FBRzs7QUFBQTs7QUFBQSxXQW5DOUNFLENBbUM4QztBQUFBLFdBM0I5Q0ksQ0EyQjhDO0FBQUEsV0FmbENaLEtBZWtDO0FBQ2pELFdBQUtBLEtBQUwsR0FBYW9CLGVBQU1DLFNBQW5CO0FBQ0EsV0FBS2IsQ0FBTCxHQUFTLElBQUlNLFdBQUosQ0FBU2IsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFUO0FBQ0EsV0FBS1MsQ0FBTCxHQUFTLElBQUlFLFdBQUosQ0FBU1YsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixDQUFUO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7O2lDQVFtQk8sRyxFQUFnQlMsUSxFQUFrQjtBQUNqRFIsb0JBQUtJLFNBQUwsQ0FBZUwsR0FBZixFQUFvQixLQUFLRCxDQUF6Qjs7QUFDQUUsb0JBQUtTLFdBQUwsQ0FBaUJWLEdBQWpCLEVBQXNCLEtBQUtMLENBQTNCLEVBQThCSyxHQUE5QixFQUFtQ1MsUUFBbkM7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBAY2F0ZWdvcnkgZ2VvbWV0cnlcclxuICovXHJcblxyXG5pbXBvcnQgeyBWZWMzIH0gZnJvbSAnLi4vbWF0aCc7XHJcbmltcG9ydCBlbnVtcyBmcm9tICcuL2VudW1zJztcclxuaW1wb3J0IHsgSVZlYzNMaWtlIH0gZnJvbSAnLi4vbWF0aC90eXBlLWRlZmluZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEJhc2ljIEdlb21ldHJ5OiByYXkuXHJcbiAqIEB6aFxyXG4gKiDln7rnoYDlh6DkvZUg5bCE57q/44CCXHJcbiAqL1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y2xhc3MtbmFtZVxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyByYXkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSBuZXcgcmF5XHJcbiAgICAgKiBAemhcclxuICAgICAqIOWIm+W7uuS4gOadoeWwhOe6v+OAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG94IOi1t+eCueeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG95IOi1t+eCueeahCB5IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG96IOi1t+eCueeahCB6IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4IOaWueWQkeeahCB4IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5IOaWueWQkeeahCB5IOmDqOWIhuOAglxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR6IOaWueWQkeeahCB6IOmDqOWIhuOAglxyXG4gICAgICogQHJldHVybiB7cmF5fSDlsITnur/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjcmVhdGUgKG94OiBudW1iZXIgPSAwLCBveTogbnVtYmVyID0gMCwgb3o6IG51bWJlciA9IDAsIGR4OiBudW1iZXIgPSAwLCBkeTogbnVtYmVyID0gMCwgZHo6IG51bWJlciA9IDEpOiByYXkge1xyXG4gICAgICAgIHJldHVybiBuZXcgcmF5KG94LCBveSwgb3osIGR4LCBkeSwgZHopO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHJheSBpbml0aWFsaXplZCB3aXRoIHZhbHVlcyBmcm9tIGFuIGV4aXN0aW5nIHJheVxyXG4gICAgICogQHpoXHJcbiAgICAgKiDku47kuIDmnaHlsITnur/lhYvpmoblh7rkuIDmnaHmlrDnmoTlsITnur/jgIJcclxuICAgICAqIEBwYXJhbSB7cmF5fSBhIOWFi+mahueahOebruagh+OAglxyXG4gICAgICogQHJldHVybiB7cmF5fSDlhYvpmoblh7rnmoTmlrDlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjbG9uZSAoYTogcmF5KTogcmF5IHtcclxuICAgICAgICByZXR1cm4gbmV3IHJheShcclxuICAgICAgICAgICAgYS5vLngsIGEuby55LCBhLm8ueixcclxuICAgICAgICAgICAgYS5kLngsIGEuZC55LCBhLmQueixcclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb3B5IHRoZSB2YWx1ZXMgZnJvbSBvbmUgcmF5IHRvIGFub3RoZXJcclxuICAgICAqIEB6aFxyXG4gICAgICog5bCG5LuO5LiA5LiqIHJheSDnmoTlgLzlpI3liLbliLDlj6bkuIDkuKogcmF544CCXHJcbiAgICAgKiBAcGFyYW0ge3JheX0gb3V0IOaOpeWPl+aTjeS9nOeahCByYXnjgIJcclxuICAgICAqIEBwYXJhbSB7cmF5fSBhIOiiq+WkjeWItueahCByYXnjgIJcclxuICAgICAqIEByZXR1cm4ge3JheX0gb3V0IOaOpeWPl+aTjeS9nOeahCByYXnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBjb3B5IChvdXQ6IHJheSwgYTogcmF5KTogcmF5IHtcclxuICAgICAgICBWZWMzLmNvcHkob3V0Lm8sIGEubyk7XHJcbiAgICAgICAgVmVjMy5jb3B5KG91dC5kLCBhLmQpO1xyXG5cclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjcmVhdGUgYSByYXkgZnJvbSB0d28gcG9pbnRzXHJcbiAgICAgKiBAemhcclxuICAgICAqIOeUqOS4pOS4queCueWIm+W7uuS4gOadoeWwhOe6v+OAglxyXG4gICAgICogQHBhcmFtIHtyYXl9IG91dCDmjqXlj5fmk43kvZznmoTlsITnur/jgIJcclxuICAgICAqIEBwYXJhbSB7VmVjM30gb3JpZ2luIOWwhOe6v+eahOi1t+eCueOAglxyXG4gICAgICogQHBhcmFtIHtWZWMzfSB0YXJnZXQg5bCE57q/5LiK55qE5LiA54K544CCXHJcbiAgICAgKiBAcmV0dXJuIHtyYXl9IG91dCDmjqXlj5fmk43kvZznmoTlsITnur/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBmcm9tUG9pbnRzIChvdXQ6IHJheSwgb3JpZ2luOiBWZWMzLCB0YXJnZXQ6IFZlYzMpOiByYXkge1xyXG4gICAgICAgIFZlYzMuY29weShvdXQubywgb3JpZ2luKTtcclxuICAgICAgICBWZWMzLm5vcm1hbGl6ZShvdXQuZCwgVmVjMy5zdWJ0cmFjdChvdXQuZCwgdGFyZ2V0LCBvcmlnaW4pKTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBTZXQgdGhlIGNvbXBvbmVudHMgb2YgYSByYXkgdG8gdGhlIGdpdmVuIHZhbHVlc1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDlsIbnu5nlrprlsITnur/nmoTlsZ7mgKforr7nva7kuLrnu5nlrprnmoTlgLzjgIJcclxuICAgICAqIEBwYXJhbSB7cmF5fSBvdXQg5o6l5Y+X5pON5L2c55qE5bCE57q/44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3gg6LW354K555qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3kg6LW354K555qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3og6LW354K555qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHgg5pa55ZCR55qEIHgg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHkg5pa55ZCR55qEIHkg6YOo5YiG44CCXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHog5pa55ZCR55qEIHog6YOo5YiG44CCXHJcbiAgICAgKiBAcmV0dXJuIHtyYXl9IG91dCDmjqXlj5fmk43kvZznmoTlsITnur/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHN0YXRpYyBzZXQgKG91dDogcmF5LCBveDogbnVtYmVyLCBveTogbnVtYmVyLCBvejogbnVtYmVyLCBkeDogbnVtYmVyLCBkeTogbnVtYmVyLCBkejogbnVtYmVyKTogcmF5IHtcclxuICAgICAgICBvdXQuby54ID0gb3g7XHJcbiAgICAgICAgb3V0Lm8ueSA9IG95O1xyXG4gICAgICAgIG91dC5vLnogPSBvejtcclxuICAgICAgICBvdXQuZC54ID0gZHg7XHJcbiAgICAgICAgb3V0LmQueSA9IGR5O1xyXG4gICAgICAgIG91dC5kLnogPSBkejtcclxuXHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogVGhlIG9yaWdpbiBvZiB0aGUgcmF5LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDotbfngrnjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIG86IFZlYzM7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBkaXJlY3Rpb24gb2YgdGhlIHJheS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5pa55ZCR44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkOiBWZWMzO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXRzIHRoZSB0eXBlIG9mIHRoZSBzaGFwZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog6I635Y+W5b2i54q255qE57G75Z6L44CCXHJcbiAgICAgKi9cclxuICAgIGdldCB0eXBlICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgX3R5cGU6IG51bWJlcjtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBlblxyXG4gICAgICogQ29uc3RydWN0IGEgcmF5O1xyXG4gICAgICogQHpoXHJcbiAgICAgKiDmnoTpgKDkuIDmnaHlsITnur/jgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveCDotbfngrnnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveSDotbfngrnnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBveiDotbfngrnnmoQgeiDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeCDmlrnlkJHnmoQgeCDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeSDmlrnlkJHnmoQgeSDpg6jliIbjgIJcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeiDmlrnlkJHnmoQgeiDpg6jliIbjgIJcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKG94OiBudW1iZXIgPSAwLCBveTogbnVtYmVyID0gMCwgb3o6IG51bWJlciA9IDAsXHJcbiAgICAgICAgZHg6IG51bWJlciA9IDAsIGR5OiBudW1iZXIgPSAwLCBkejogbnVtYmVyID0gLTEpIHtcclxuICAgICAgICB0aGlzLl90eXBlID0gZW51bXMuU0hBUEVfUkFZO1xyXG4gICAgICAgIHRoaXMubyA9IG5ldyBWZWMzKG94LCBveSwgb3opO1xyXG4gICAgICAgIHRoaXMuZCA9IG5ldyBWZWMzKGR4LCBkeSwgZHopO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBDb21wdXRlIGEgcG9pbnQgd2l0aCB0aGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgb3JpZ2luLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmoLnmja7nu5nlrprot53nprvorqHnrpflh7rlsITnur/kuIrnmoTkuIDngrnjgIJcclxuICAgICAqIEBwYXJhbSBvdXQg5bCE57q/5LiK55qE5Y+m5LiA54K544CCXHJcbiAgICAgKiBAcGFyYW0gZGlzdGFuY2Ug57uZ5a6a6Led56a744CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb21wdXRlSGl0IChvdXQ6IElWZWMzTGlrZSwgZGlzdGFuY2U6IG51bWJlcikge1xyXG4gICAgICAgIFZlYzMubm9ybWFsaXplKG91dCwgdGhpcy5kKVxyXG4gICAgICAgIFZlYzMuc2NhbGVBbmRBZGQob3V0LCB0aGlzLm8sIG91dCwgZGlzdGFuY2UpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==