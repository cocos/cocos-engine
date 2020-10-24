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
    global.cachedArray = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.CachedArray = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @category memop
   */

  /**
   * @zh
   * 缓存数组
   * 该数据结构内存只增不减，适用于处理内存常驻递增的分配策略
   */
  var CachedArray = /*#__PURE__*/function () {
    /**
     * @zh
     * 实际存储的数据内容
     */

    /**
     * @zh
     * 数组长度
     */

    /**
     * @zh
     * 比较函数
     */

    /**
     * 构造函数
     * @param length 数组初始化长度
     * @param compareFn 比较函数
     */
    function CachedArray(length, compareFn) {
      _classCallCheck(this, CachedArray);

      this.array = void 0;
      this.length = 0;
      this._compareFn = void 0;
      this.array = new Array(length);
      this.length = 0;

      if (compareFn !== undefined) {
        this._compareFn = compareFn;
      } else {
        this._compareFn = function (a, b) {
          return a - b;
        };
      }
    }
    /**
     * @zh
     * 向数组中添加一个元素
     * @param item 数组元素
     */


    _createClass(CachedArray, [{
      key: "push",
      value: function push(item) {
        this.array[this.length++] = item;
      }
      /**
       * @zh
       * 弹出数组最后一个元素
       * @param item 数组元素
       */

    }, {
      key: "pop",
      value: function pop() {
        return this.array[--this.length];
      }
      /**
       * @zh
       * 得到数组中指定索引的元素
       * @param item 数组元素
       */

    }, {
      key: "get",
      value: function get(idx) {
        return this.array[idx];
      }
      /**
       * @zh
       * 清空数组所有元素
       */

    }, {
      key: "clear",
      value: function clear() {
        this.length = 0;
      }
      /**
       * @zh
       * 排序数组
       */

    }, {
      key: "sort",
      value: function sort() {
        this.array.length = this.length;
        this.array.sort(this._compareFn);
      }
      /**
       * @zh
       * 连接一个指定数组中的所有元素到当前数组末尾
       */

    }, {
      key: "concat",
      value: function concat(array) {
        for (var i = 0; i < array.length; ++i) {
          this.array[this.length++] = array[i];
        }
      }
      /**
       * @zh 删除指定位置的元素并将最后一个元素移动至该位置。
       * @param idx 数组索引。
       */

    }, {
      key: "fastRemove",
      value: function fastRemove(idx) {
        if (idx >= this.length || idx < 0) {
          return;
        }

        var last = --this.length;
        this.array[idx] = this.array[last];
      }
      /**
       * @zh 返回某个数组元素对应的下标。
       * @param val 数组元素。
       */

    }, {
      key: "indexOf",
      value: function indexOf(val) {
        return this.array.indexOf(val);
      }
    }]);

    return CachedArray;
  }();

  _exports.CachedArray = CachedArray;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWVtb3AvY2FjaGVkLWFycmF5LnRzIl0sIm5hbWVzIjpbIkNhY2hlZEFycmF5IiwibGVuZ3RoIiwiY29tcGFyZUZuIiwiYXJyYXkiLCJfY29tcGFyZUZuIiwiQXJyYXkiLCJ1bmRlZmluZWQiLCJhIiwiYiIsIml0ZW0iLCJpZHgiLCJzb3J0IiwiaSIsImxhc3QiLCJ2YWwiLCJpbmRleE9mIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBOzs7O0FBSUE7Ozs7O01BS2FBLFc7QUFFVDs7Ozs7QUFNQTs7Ozs7QUFNQTs7Ozs7QUFNQTs7Ozs7QUFLQSx5QkFBYUMsTUFBYixFQUE2QkMsU0FBN0IsRUFBaUU7QUFBQTs7QUFBQSxXQW5CMURDLEtBbUIwRDtBQUFBLFdBYjFERixNQWEwRCxHQWJ6QyxDQWF5QztBQUFBLFdBUHpERyxVQU95RDtBQUM3RCxXQUFLRCxLQUFMLEdBQWEsSUFBSUUsS0FBSixDQUFVSixNQUFWLENBQWI7QUFDQSxXQUFLQSxNQUFMLEdBQWMsQ0FBZDs7QUFFQSxVQUFJQyxTQUFTLEtBQUtJLFNBQWxCLEVBQTZCO0FBQ3pCLGFBQUtGLFVBQUwsR0FBa0JGLFNBQWxCO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsYUFBS0UsVUFBTCxHQUFrQixVQUFDRyxDQUFELEVBQVlDLENBQVo7QUFBQSxpQkFBMEJELENBQUMsR0FBR0MsQ0FBOUI7QUFBQSxTQUFsQjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7OzJCQUthQyxJLEVBQVM7QUFDbEIsYUFBS04sS0FBTCxDQUFXLEtBQUtGLE1BQUwsRUFBWCxJQUE0QlEsSUFBNUI7QUFDSDtBQUVEOzs7Ozs7Ozs0QkFLNkI7QUFDekIsZUFBTyxLQUFLTixLQUFMLENBQVcsRUFBRSxLQUFLRixNQUFsQixDQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs7MEJBS1lTLEcsRUFBZ0I7QUFDeEIsZUFBTyxLQUFLUCxLQUFMLENBQVdPLEdBQVgsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OEJBSWdCO0FBQ1osYUFBS1QsTUFBTCxHQUFjLENBQWQ7QUFDSDtBQUVEOzs7Ozs7OzZCQUllO0FBQ1gsYUFBS0UsS0FBTCxDQUFXRixNQUFYLEdBQW9CLEtBQUtBLE1BQXpCO0FBQ0EsYUFBS0UsS0FBTCxDQUFXUSxJQUFYLENBQWdCLEtBQUtQLFVBQXJCO0FBQ0g7QUFFRDs7Ozs7Ozs2QkFJZUQsSyxFQUFZO0FBQ3ZCLGFBQUssSUFBSVMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1QsS0FBSyxDQUFDRixNQUExQixFQUFrQyxFQUFFVyxDQUFwQyxFQUF1QztBQUNuQyxlQUFLVCxLQUFMLENBQVcsS0FBS0YsTUFBTCxFQUFYLElBQTRCRSxLQUFLLENBQUNTLENBQUQsQ0FBakM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7aUNBSW1CRixHLEVBQWE7QUFDNUIsWUFBSUEsR0FBRyxJQUFJLEtBQUtULE1BQVosSUFBc0JTLEdBQUcsR0FBRyxDQUFoQyxFQUFtQztBQUMvQjtBQUNIOztBQUNELFlBQU1HLElBQUksR0FBRyxFQUFFLEtBQUtaLE1BQXBCO0FBQ0EsYUFBS0UsS0FBTCxDQUFXTyxHQUFYLElBQWtCLEtBQUtQLEtBQUwsQ0FBV1UsSUFBWCxDQUFsQjtBQUNIO0FBRUQ7Ozs7Ozs7OEJBSWdCQyxHLEVBQVE7QUFDcEIsZUFBTyxLQUFLWCxLQUFMLENBQVdZLE9BQVgsQ0FBbUJELEdBQW5CLENBQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIlxyXG4vKipcclxuICogQGNhdGVnb3J5IG1lbW9wXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDnvJPlrZjmlbDnu4RcclxuICog6K+l5pWw5o2u57uT5p6E5YaF5a2Y5Y+q5aKe5LiN5YeP77yM6YCC55So5LqO5aSE55CG5YaF5a2Y5bi46am76YCS5aKe55qE5YiG6YWN562W55WlXHJcbiAqL1xyXG5leHBvcnQgY2xhc3MgQ2FjaGVkQXJyYXk8VD4ge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlrp7pmYXlrZjlgqjnmoTmlbDmja7lhoXlrrlcclxuICAgICAqL1xyXG4gICAgcHVibGljIGFycmF5OiBUW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOaVsOe7hOmVv+W6plxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbGVuZ3RoOiBudW1iZXIgPSAwO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmr5TovoPlh73mlbBcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBfY29tcGFyZUZuO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICog5p6E6YCg5Ye95pWwXHJcbiAgICAgKiBAcGFyYW0gbGVuZ3RoIOaVsOe7hOWIneWni+WMlumVv+W6plxyXG4gICAgICogQHBhcmFtIGNvbXBhcmVGbiDmr5TovoPlh73mlbBcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IgKGxlbmd0aDogbnVtYmVyLCBjb21wYXJlRm4/OiAoYTogVCwgYjogVCkgPT4gbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5hcnJheSA9IG5ldyBBcnJheShsZW5ndGgpO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcclxuXHJcbiAgICAgICAgaWYgKGNvbXBhcmVGbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvbXBhcmVGbiA9IGNvbXBhcmVGbjtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9jb21wYXJlRm4gPSAoYTogbnVtYmVyLCBiOiBudW1iZXIpID0+IGEgLSBiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5ZCR5pWw57uE5Lit5re75Yqg5LiA5Liq5YWD57SgXHJcbiAgICAgKiBAcGFyYW0gaXRlbSDmlbDnu4TlhYPntKBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHB1c2ggKGl0ZW06IFQpIHtcclxuICAgICAgICB0aGlzLmFycmF5W3RoaXMubGVuZ3RoKytdID0gaXRlbTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5by55Ye65pWw57uE5pyA5ZCO5LiA5Liq5YWD57SgXHJcbiAgICAgKiBAcGFyYW0gaXRlbSDmlbDnu4TlhYPntKBcclxuICAgICAqL1xyXG4gICAgcHVibGljIHBvcCAoKTogVCB8IHVuZGVmaW5lZCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlbLS10aGlzLmxlbmd0aF07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOW+l+WIsOaVsOe7hOS4reaMh+Wumue0ouW8leeahOWFg+e0oFxyXG4gICAgICogQHBhcmFtIGl0ZW0g5pWw57uE5YWD57SgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXQgKGlkeDogbnVtYmVyKTogVCB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXlbaWR4XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aFxyXG4gICAgICog5riF56m65pWw57uE5omA5pyJ5YWD57SgXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjbGVhciAoKSB7XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDmjpLluo/mlbDnu4RcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNvcnQgKCkge1xyXG4gICAgICAgIHRoaXMuYXJyYXkubGVuZ3RoID0gdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5hcnJheS5zb3J0KHRoaXMuX2NvbXBhcmVGbik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemhcclxuICAgICAqIOi/nuaOpeS4gOS4quaMh+WumuaVsOe7hOS4reeahOaJgOacieWFg+e0oOWIsOW9k+WJjeaVsOe7hOacq+WwvlxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgY29uY2F0IChhcnJheTogVFtdKSB7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICB0aGlzLmFycmF5W3RoaXMubGVuZ3RoKytdID0gYXJyYXlbaV07XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQHpoIOWIoOmZpOaMh+WumuS9jee9rueahOWFg+e0oOW5tuWwhuacgOWQjuS4gOS4quWFg+e0oOenu+WKqOiHs+ivpeS9jee9ruOAglxyXG4gICAgICogQHBhcmFtIGlkeCDmlbDnu4TntKLlvJXjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZhc3RSZW1vdmUgKGlkeDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKGlkeCA+PSB0aGlzLmxlbmd0aCB8fCBpZHggPCAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgbGFzdCA9IC0tdGhpcy5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5hcnJheVtpZHhdID0gdGhpcy5hcnJheVtsYXN0XTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDov5Tlm57mn5DkuKrmlbDnu4TlhYPntKDlr7nlupTnmoTkuIvmoIfjgIJcclxuICAgICAqIEBwYXJhbSB2YWwg5pWw57uE5YWD57Sg44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBpbmRleE9mICh2YWw6IFQpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5hcnJheS5pbmRleE9mKHZhbCk7XHJcbiAgICB9XHJcbn1cclxuIl19