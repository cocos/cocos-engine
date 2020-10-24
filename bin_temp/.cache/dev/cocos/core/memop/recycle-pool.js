(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.recyclePool = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.RecyclePool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @category memop
   */

  /**
   * @zh 循环对象池。
   */
  var RecyclePool = /*#__PURE__*/function () {
    /**
     * 构造函数。
     * @param fn 对象构造函数。
     * @param size 初始大小。
     */
    function RecyclePool(fn, size) {
      _classCallCheck(this, RecyclePool);

      this._fn = void 0;
      this._count = 0;
      this._data = void 0;
      this._fn = fn;
      this._data = new Array(size);

      for (var i = 0; i < size; ++i) {
        this._data[i] = fn();
      }
    }
    /**
     * @zh 对象池大小。
     */


    _createClass(RecyclePool, [{
      key: "reset",

      /**
       * @zh 清空对象池。
       */
      value: function reset() {
        this._count = 0;
      }
      /**
       * @zh 设置对象池大小。
       * @param size 对象池大小。
       */

    }, {
      key: "resize",
      value: function resize(size) {
        if (size > this._data.length) {
          for (var i = this._data.length; i < size; ++i) {
            this._data[i] = this._fn();
          }
        }
      }
      /**
       * @zh 从对象池中取出一个对象。
       */

    }, {
      key: "add",
      value: function add() {
        if (this._count >= this._data.length) {
          this.resize(this._data.length * 2);
        }

        return this._data[this._count++];
      }
      /**
       * @zh 释放对象池中的一个元素。
       * @param idx 释放对象的索引。
       */

    }, {
      key: "removeAt",
      value: function removeAt(idx) {
        if (idx >= this._count) {
          return;
        }

        var last = this._count - 1;
        var tmp = this._data[idx];
        this._data[idx] = this._data[last];
        this._data[last] = tmp;
        this._count -= 1;
      }
    }, {
      key: "length",
      get: function get() {
        return this._count;
      }
      /**
       * @zh 对象池数组。
       */

    }, {
      key: "data",
      get: function get() {
        return this._data;
      }
    }]);

    return RecyclePool;
  }();

  _exports.RecyclePool = RecyclePool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWVtb3AvcmVjeWNsZS1wb29sLnRzIl0sIm5hbWVzIjpbIlJlY3ljbGVQb29sIiwiZm4iLCJzaXplIiwiX2ZuIiwiX2NvdW50IiwiX2RhdGEiLCJBcnJheSIsImkiLCJsZW5ndGgiLCJyZXNpemUiLCJpZHgiLCJsYXN0IiwidG1wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBSUE7OztNQUdhQSxXO0FBS1Q7Ozs7O0FBS0EseUJBQWFDLEVBQWIsRUFBMEJDLElBQTFCLEVBQXdDO0FBQUE7O0FBQUEsV0FUaENDLEdBU2dDO0FBQUEsV0FSaENDLE1BUWdDLEdBUnZCLENBUXVCO0FBQUEsV0FQaENDLEtBT2dDO0FBQ3BDLFdBQUtGLEdBQUwsR0FBV0YsRUFBWDtBQUNBLFdBQUtJLEtBQUwsR0FBYSxJQUFJQyxLQUFKLENBQVVKLElBQVYsQ0FBYjs7QUFFQSxXQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdMLElBQXBCLEVBQTBCLEVBQUVLLENBQTVCLEVBQStCO0FBQzNCLGFBQUtGLEtBQUwsQ0FBV0UsQ0FBWCxJQUFnQk4sRUFBRSxFQUFsQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7QUFjQTs7OzhCQUdnQjtBQUNaLGFBQUtHLE1BQUwsR0FBYyxDQUFkO0FBQ0g7QUFFRDs7Ozs7Ozs2QkFJZUYsSSxFQUFjO0FBQ3pCLFlBQUlBLElBQUksR0FBRyxLQUFLRyxLQUFMLENBQVdHLE1BQXRCLEVBQThCO0FBQzFCLGVBQUssSUFBSUQsQ0FBQyxHQUFHLEtBQUtGLEtBQUwsQ0FBV0csTUFBeEIsRUFBZ0NELENBQUMsR0FBR0wsSUFBcEMsRUFBMEMsRUFBRUssQ0FBNUMsRUFBK0M7QUFDM0MsaUJBQUtGLEtBQUwsQ0FBV0UsQ0FBWCxJQUFnQixLQUFLSixHQUFMLEVBQWhCO0FBQ0g7QUFDSjtBQUNKO0FBRUQ7Ozs7Ozs0QkFHYztBQUNWLFlBQUksS0FBS0MsTUFBTCxJQUFlLEtBQUtDLEtBQUwsQ0FBV0csTUFBOUIsRUFBc0M7QUFDbEMsZUFBS0MsTUFBTCxDQUFZLEtBQUtKLEtBQUwsQ0FBV0csTUFBWCxHQUFvQixDQUFoQztBQUNIOztBQUVELGVBQU8sS0FBS0gsS0FBTCxDQUFXLEtBQUtELE1BQUwsRUFBWCxDQUFQO0FBQ0g7QUFFRDs7Ozs7OzsrQkFJaUJNLEcsRUFBYTtBQUMxQixZQUFJQSxHQUFHLElBQUksS0FBS04sTUFBaEIsRUFBd0I7QUFDcEI7QUFDSDs7QUFFRCxZQUFNTyxJQUFJLEdBQUcsS0FBS1AsTUFBTCxHQUFjLENBQTNCO0FBQ0EsWUFBTVEsR0FBRyxHQUFHLEtBQUtQLEtBQUwsQ0FBV0ssR0FBWCxDQUFaO0FBQ0EsYUFBS0wsS0FBTCxDQUFXSyxHQUFYLElBQWtCLEtBQUtMLEtBQUwsQ0FBV00sSUFBWCxDQUFsQjtBQUNBLGFBQUtOLEtBQUwsQ0FBV00sSUFBWCxJQUFtQkMsR0FBbkI7QUFDQSxhQUFLUixNQUFMLElBQWUsQ0FBZjtBQUNIOzs7MEJBdkRhO0FBQ1YsZUFBTyxLQUFLQSxNQUFaO0FBQ0g7QUFFRDs7Ozs7OzBCQUdZO0FBQ1IsZUFBTyxLQUFLQyxLQUFaO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyJcclxuLyoqXHJcbiAqIEBjYXRlZ29yeSBtZW1vcFxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAemgg5b6q546v5a+56LGh5rGg44CCXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgUmVjeWNsZVBvb2w8VCA9IGFueT4ge1xyXG4gICAgcHJpdmF0ZSBfZm46ICgpID0+IFQ7XHJcbiAgICBwcml2YXRlIF9jb3VudCA9IDA7XHJcbiAgICBwcml2YXRlIF9kYXRhOiBUW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDlh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSBmbiDlr7nosaHmnoTpgKDlh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSBzaXplIOWIneWni+Wkp+Wwj+OAglxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvciAoZm46ICgpID0+IFQsIHNpemU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2ZuID0gZm47XHJcbiAgICAgICAgdGhpcy5fZGF0YSA9IG5ldyBBcnJheShzaXplKTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyArK2kpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGF0YVtpXSA9IGZuKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWvueixoeaxoOWkp+Wwj+OAglxyXG4gICAgICovXHJcbiAgICBnZXQgbGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5a+56LGh5rGg5pWw57uE44CCXHJcbiAgICAgKi9cclxuICAgIGdldCBkYXRhICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDmuIXnqbrlr7nosaHmsaDjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICB0aGlzLl9jb3VudCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg6K6+572u5a+56LGh5rGg5aSn5bCP44CCXHJcbiAgICAgKiBAcGFyYW0gc2l6ZSDlr7nosaHmsaDlpKflsI/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2l6ZSAoc2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHNpemUgPiB0aGlzLl9kYXRhLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5fZGF0YS5sZW5ndGg7IGkgPCBzaXplOyArK2kpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2RhdGFbaV0gPSB0aGlzLl9mbigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOS7juWvueixoeaxoOS4reWPluWHuuS4gOS4quWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgYWRkICgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY291bnQgPj0gdGhpcy5fZGF0YS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgdGhpcy5yZXNpemUodGhpcy5fZGF0YS5sZW5ndGggKiAyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhW3RoaXMuX2NvdW50KytdO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOmHiuaUvuWvueixoeaxoOS4reeahOS4gOS4quWFg+e0oOOAglxyXG4gICAgICogQHBhcmFtIGlkeCDph4rmlL7lr7nosaHnmoTntKLlvJXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlbW92ZUF0IChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmIChpZHggPj0gdGhpcy5fY291bnQpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbGFzdCA9IHRoaXMuX2NvdW50IC0gMTtcclxuICAgICAgICBjb25zdCB0bXAgPSB0aGlzLl9kYXRhW2lkeF07XHJcbiAgICAgICAgdGhpcy5fZGF0YVtpZHhdID0gdGhpcy5fZGF0YVtsYXN0XTtcclxuICAgICAgICB0aGlzLl9kYXRhW2xhc3RdID0gdG1wO1xyXG4gICAgICAgIHRoaXMuX2NvdW50IC09IDE7XHJcbiAgICB9XHJcbn1cclxuIl19