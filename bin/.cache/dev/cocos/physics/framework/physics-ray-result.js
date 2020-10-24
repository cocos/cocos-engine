(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../../core/math/index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../../core/math/index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.physicsRayResult = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _index) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.PhysicsRayResult = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @en
   * Used to store physics ray test results.
   * @zh
   * 用于保存物理射线检测结果。
   */
  var PhysicsRayResult = /*#__PURE__*/function () {
    function PhysicsRayResult() {
      _classCallCheck(this, PhysicsRayResult);

      this._hitPoint = new _index.Vec3();
      this._hitNormal = new _index.Vec3();
      this._distance = 0;
      this._collider = null;
    }

    _createClass(PhysicsRayResult, [{
      key: "_assign",

      /**
       * @en
       * internal methods.
       * @zh
       * 设置射线，此方法由引擎内部使用，请勿在外部脚本调用。
       */
      value: function _assign(hitPoint, distance, collider, hitNormal) {
        _index.Vec3.copy(this._hitPoint, hitPoint);

        _index.Vec3.copy(this._hitNormal, hitNormal);

        this._distance = distance;
        this._collider = collider;
      }
      /**
       * @en
       * clone.
       * @zh
       * 克隆。
       */

    }, {
      key: "clone",
      value: function clone() {
        var c = new PhysicsRayResult();

        _index.Vec3.copy(c._hitPoint, this._hitPoint);

        _index.Vec3.copy(c._hitNormal, this._hitNormal);

        c._distance = this._distance;
        c._collider = this._collider;
        return c;
      }
    }, {
      key: "hitPoint",

      /**
       * @en
       * The hit point，in world space.
       * @zh
       * 在世界坐标系下的击中点。
       */
      get: function get() {
        return this._hitPoint;
      }
      /**
       * @en
       * The distance between the ray origin with the hit.
       * @zh
       * 距离。
       */

    }, {
      key: "distance",
      get: function get() {
        return this._distance;
      }
      /**
       * @en
       * The collider hit by the ray.
       * @zh
       * 击中的碰撞盒
       */

    }, {
      key: "collider",
      get: function get() {
        return this._collider;
      }
      /**
       * @en
       * The normal of the hit plane，in world space.
       * @zh
       * 在世界坐标系下击中面的法线。
       */

    }, {
      key: "hitNormal",
      get: function get() {
        return this._hitNormal;
      }
    }]);

    return PhysicsRayResult;
  }();

  _exports.PhysicsRayResult = PhysicsRayResult;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvZnJhbWV3b3JrL3BoeXNpY3MtcmF5LXJlc3VsdC50cyJdLCJuYW1lcyI6WyJQaHlzaWNzUmF5UmVzdWx0IiwiX2hpdFBvaW50IiwiVmVjMyIsIl9oaXROb3JtYWwiLCJfZGlzdGFuY2UiLCJfY29sbGlkZXIiLCJoaXRQb2ludCIsImRpc3RhbmNlIiwiY29sbGlkZXIiLCJoaXROb3JtYWwiLCJjb3B5IiwiYyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFRQTs7Ozs7O01BTWFBLGdCOzs7O1dBMENEQyxTLEdBQWtCLElBQUlDLFdBQUosRTtXQUNsQkMsVSxHQUFtQixJQUFJRCxXQUFKLEU7V0FDbkJFLFMsR0FBb0IsQztXQUNwQkMsUyxHQUE2QixJOzs7Ozs7QUFFckM7Ozs7Ozs4QkFNZ0JDLFEsRUFBcUJDLFEsRUFBa0JDLFEsRUFBb0JDLFMsRUFBc0I7QUFDN0ZQLG9CQUFLUSxJQUFMLENBQVUsS0FBS1QsU0FBZixFQUEwQkssUUFBMUI7O0FBQ0FKLG9CQUFLUSxJQUFMLENBQVUsS0FBS1AsVUFBZixFQUEyQk0sU0FBM0I7O0FBQ0EsYUFBS0wsU0FBTCxHQUFpQkcsUUFBakI7QUFDQSxhQUFLRixTQUFMLEdBQWlCRyxRQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs4QkFNZ0I7QUFDWixZQUFNRyxDQUFDLEdBQUcsSUFBSVgsZ0JBQUosRUFBVjs7QUFDQUUsb0JBQUtRLElBQUwsQ0FBVUMsQ0FBQyxDQUFDVixTQUFaLEVBQXVCLEtBQUtBLFNBQTVCOztBQUNBQyxvQkFBS1EsSUFBTCxDQUFVQyxDQUFDLENBQUNSLFVBQVosRUFBd0IsS0FBS0EsVUFBN0I7O0FBQ0FRLFFBQUFBLENBQUMsQ0FBQ1AsU0FBRixHQUFjLEtBQUtBLFNBQW5CO0FBQ0FPLFFBQUFBLENBQUMsQ0FBQ04sU0FBRixHQUFjLEtBQUtBLFNBQW5CO0FBQ0EsZUFBT00sQ0FBUDtBQUNIOzs7O0FBdkVEOzs7Ozs7MEJBTXNCO0FBQ2xCLGVBQU8sS0FBS1YsU0FBWjtBQUNIO0FBRUQ7Ozs7Ozs7OzswQkFNd0I7QUFDcEIsZUFBTyxLQUFLRyxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7OzBCQU0wQjtBQUN0QixlQUFPLEtBQUtDLFNBQVo7QUFDSDtBQUVEOzs7Ozs7Ozs7MEJBTXVCO0FBQ25CLGVBQU8sS0FBS0YsVUFBWjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBwaHlzaWNzXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgVmVjMyB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aCc7XHJcbmltcG9ydCB7IENvbGxpZGVyIH0gZnJvbSAnLi4vLi4vLi4vZXhwb3J0cy9waHlzaWNzLWZyYW1ld29yayc7XHJcbmltcG9ydCB7IElWZWMzTGlrZSB9IGZyb20gJy4uLy4uL2NvcmUvbWF0aC90eXBlLWRlZmluZSc7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIFVzZWQgdG8gc3RvcmUgcGh5c2ljcyByYXkgdGVzdCByZXN1bHRzLlxyXG4gKiBAemhcclxuICog55So5LqO5L+d5a2Y54mp55CG5bCE57q/5qOA5rWL57uT5p6c44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUGh5c2ljc1JheVJlc3VsdCB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIFRoZSBoaXQgcG9pbnTvvIxpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5LiW55WM5Z2Q5qCH57O75LiL55qE5Ye75Lit54K544CCXHJcbiAgICAgKi9cclxuICAgIGdldCBoaXRQb2ludCAoKTogVmVjMyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2hpdFBvaW50O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgZGlzdGFuY2UgYmV0d2VlbiB0aGUgcmF5IG9yaWdpbiB3aXRoIHRoZSBoaXQuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi3neemu+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgZGlzdGFuY2UgKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgY29sbGlkZXIgaGl0IGJ5IHRoZSByYXkuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOWHu+S4reeahOeisOaSnuebklxyXG4gICAgICovXHJcbiAgICBnZXQgY29sbGlkZXIgKCk6IENvbGxpZGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29sbGlkZXIhO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgbm9ybWFsIG9mIHRoZSBoaXQgcGxhbmXvvIxpbiB3b3JsZCBzcGFjZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5Zyo5LiW55WM5Z2Q5qCH57O75LiL5Ye75Lit6Z2i55qE5rOV57q/44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBoaXROb3JtYWwgKCk6IFZlYzMge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9oaXROb3JtYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaGl0UG9pbnQ6IFZlYzMgPSBuZXcgVmVjMygpO1xyXG4gICAgcHJpdmF0ZSBfaGl0Tm9ybWFsOiBWZWMzID0gbmV3IFZlYzMoKTtcclxuICAgIHByaXZhdGUgX2Rpc3RhbmNlOiBudW1iZXIgPSAwO1xyXG4gICAgcHJpdmF0ZSBfY29sbGlkZXI6IENvbGxpZGVyIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW5cclxuICAgICAqIGludGVybmFsIG1ldGhvZHMuXHJcbiAgICAgKiBAemhcclxuICAgICAqIOiuvue9ruWwhOe6v++8jOatpOaWueazleeUseW8leaTjuWGhemDqOS9v+eUqO+8jOivt+WLv+WcqOWklumDqOiEmuacrOiwg+eUqOOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgX2Fzc2lnbiAoaGl0UG9pbnQ6IElWZWMzTGlrZSwgZGlzdGFuY2U6IG51bWJlciwgY29sbGlkZXI6IENvbGxpZGVyLCBoaXROb3JtYWw6IElWZWMzTGlrZSkge1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9oaXRQb2ludCwgaGl0UG9pbnQpO1xyXG4gICAgICAgIFZlYzMuY29weSh0aGlzLl9oaXROb3JtYWwsIGhpdE5vcm1hbCk7XHJcbiAgICAgICAgdGhpcy5fZGlzdGFuY2UgPSBkaXN0YW5jZTtcclxuICAgICAgICB0aGlzLl9jb2xsaWRlciA9IGNvbGxpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBjbG9uZS5cclxuICAgICAqIEB6aFxyXG4gICAgICog5YWL6ZqG44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbG9uZSAoKSB7XHJcbiAgICAgICAgY29uc3QgYyA9IG5ldyBQaHlzaWNzUmF5UmVzdWx0KCk7XHJcbiAgICAgICAgVmVjMy5jb3B5KGMuX2hpdFBvaW50LCB0aGlzLl9oaXRQb2ludCk7XHJcbiAgICAgICAgVmVjMy5jb3B5KGMuX2hpdE5vcm1hbCwgdGhpcy5faGl0Tm9ybWFsKTtcclxuICAgICAgICBjLl9kaXN0YW5jZSA9IHRoaXMuX2Rpc3RhbmNlO1xyXG4gICAgICAgIGMuX2NvbGxpZGVyID0gdGhpcy5fY29sbGlkZXI7XHJcbiAgICAgICAgcmV0dXJuIGM7XHJcbiAgICB9XHJcbn1cclxuIl19