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
    global.pool = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.Pool = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * 可以自动分配内存的数据结构
   * @category memop
   */

  /**
   * @zh 对象池。
   */
  var Pool = /*#__PURE__*/function () {
    /**
     * 构造函数。
     * @param ctor 元素构造函数。
     * @param size 初始大小。
     */
    function Pool(ctor, elementsPerBatch) {
      _classCallCheck(this, Pool);

      this._ctor = void 0;
      this._elementsPerBatch = void 0;
      this._nextAvail = void 0;
      this._freepool = [];
      this._ctor = ctor;
      this._elementsPerBatch = Math.max(elementsPerBatch, 1);
      this._nextAvail = this._elementsPerBatch - 1;

      for (var i = 0; i < this._elementsPerBatch; ++i) {
        this._freepool.push(ctor());
      }
    }
    /**
     * @zh 从对象池中取出一个对象。
     */


    _createClass(Pool, [{
      key: "alloc",
      value: function alloc() {
        if (this._nextAvail < 0) {
          var elementsPerBatch = this._elementsPerBatch;

          for (var i = 0; i < elementsPerBatch; i++) {
            this._freepool.push(this._ctor());
          }

          this._nextAvail = elementsPerBatch - 1;
        }

        var ret = this._freepool[this._nextAvail--];
        this._freepool.length--;
        return ret;
      }
      /**
       * @zh 将一个对象放回对象池中。
       * @param obj 释放的对象。
       */

    }, {
      key: "free",
      value: function free(obj) {
        this._freepool.push(obj);

        this._nextAvail++;
      }
      /**
       * @zh 将一组对象放回对象池中。
       * @param objs 一组要释放的对象。
       */

    }, {
      key: "freeArray",
      value: function freeArray(objs) {
        Array.prototype.push.apply(this._freepool, objs);
        this._nextAvail += objs.length;
      }
      /**
       * 释放对象池中所有资源。
       * @param dtor 销毁回调，对每个释放的对象调用一次。
       */

    }, {
      key: "destroy",
      value: function destroy(dtor) {
        if (dtor) {
          for (var i = 0; i <= this._nextAvail; i++) {
            dtor(this._freepool[i]);
          }
        }

        this._freepool.length = 0;
        this._nextAvail = -1;
      }
    }]);

    return Pool;
  }();

  _exports.Pool = Pool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWVtb3AvcG9vbC50cyJdLCJuYW1lcyI6WyJQb29sIiwiY3RvciIsImVsZW1lbnRzUGVyQmF0Y2giLCJfY3RvciIsIl9lbGVtZW50c1BlckJhdGNoIiwiX25leHRBdmFpbCIsIl9mcmVlcG9vbCIsIk1hdGgiLCJtYXgiLCJpIiwicHVzaCIsInJldCIsImxlbmd0aCIsIm9iaiIsIm9ianMiLCJBcnJheSIsInByb3RvdHlwZSIsImFwcGx5IiwiZHRvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7QUFLQTs7O01BR2FBLEk7QUFPVDs7Ozs7QUFLQSxrQkFBYUMsSUFBYixFQUE0QkMsZ0JBQTVCLEVBQXNEO0FBQUE7O0FBQUEsV0FWOUNDLEtBVThDO0FBQUEsV0FUOUNDLGlCQVM4QztBQUFBLFdBUjlDQyxVQVE4QztBQUFBLFdBUDlDQyxTQU84QyxHQVA3QixFQU82QjtBQUNsRCxXQUFLSCxLQUFMLEdBQWFGLElBQWI7QUFDQSxXQUFLRyxpQkFBTCxHQUF5QkcsSUFBSSxDQUFDQyxHQUFMLENBQVNOLGdCQUFULEVBQTJCLENBQTNCLENBQXpCO0FBQ0EsV0FBS0csVUFBTCxHQUFrQixLQUFLRCxpQkFBTCxHQUF5QixDQUEzQzs7QUFFQSxXQUFLLElBQUlLLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUcsS0FBS0wsaUJBQXpCLEVBQTRDLEVBQUVLLENBQTlDLEVBQWlEO0FBQzdDLGFBQUtILFNBQUwsQ0FBZUksSUFBZixDQUFvQlQsSUFBSSxFQUF4QjtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs4QkFHbUI7QUFDZixZQUFJLEtBQUtJLFVBQUwsR0FBa0IsQ0FBdEIsRUFBeUI7QUFDckIsY0FBTUgsZ0JBQWdCLEdBQUcsS0FBS0UsaUJBQTlCOztBQUNBLGVBQUssSUFBSUssQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR1AsZ0JBQXBCLEVBQXNDTyxDQUFDLEVBQXZDLEVBQTJDO0FBQ3ZDLGlCQUFLSCxTQUFMLENBQWVJLElBQWYsQ0FBb0IsS0FBS1AsS0FBTCxFQUFwQjtBQUNIOztBQUNELGVBQUtFLFVBQUwsR0FBa0JILGdCQUFnQixHQUFHLENBQXJDO0FBQ0g7O0FBRUQsWUFBTVMsR0FBRyxHQUFHLEtBQUtMLFNBQUwsQ0FBZSxLQUFLRCxVQUFMLEVBQWYsQ0FBWjtBQUNBLGFBQUtDLFNBQUwsQ0FBZU0sTUFBZjtBQUNBLGVBQU9ELEdBQVA7QUFDSDtBQUVEOzs7Ozs7OzJCQUlhRSxHLEVBQVE7QUFDakIsYUFBS1AsU0FBTCxDQUFlSSxJQUFmLENBQW9CRyxHQUFwQjs7QUFDQSxhQUFLUixVQUFMO0FBQ0g7QUFFRDs7Ozs7OztnQ0FJa0JTLEksRUFBVztBQUN6QkMsUUFBQUEsS0FBSyxDQUFDQyxTQUFOLENBQWdCTixJQUFoQixDQUFxQk8sS0FBckIsQ0FBMkIsS0FBS1gsU0FBaEMsRUFBMkNRLElBQTNDO0FBQ0EsYUFBS1QsVUFBTCxJQUFtQlMsSUFBSSxDQUFDRixNQUF4QjtBQUNIO0FBRUQ7Ozs7Ozs7OEJBSWdCTSxJLEVBQXlCO0FBQ3JDLFlBQUlBLElBQUosRUFBVTtBQUNOLGVBQUssSUFBSVQsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsSUFBSSxLQUFLSixVQUExQixFQUFzQ0ksQ0FBQyxFQUF2QyxFQUEyQztBQUN2Q1MsWUFBQUEsSUFBSSxDQUFDLEtBQUtaLFNBQUwsQ0FBZUcsQ0FBZixDQUFELENBQUo7QUFDSDtBQUNKOztBQUNELGFBQUtILFNBQUwsQ0FBZU0sTUFBZixHQUF3QixDQUF4QjtBQUNBLGFBQUtQLFVBQUwsR0FBa0IsQ0FBQyxDQUFuQjtBQUNIIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbi8qKlxyXG4gKiDlj6/ku6Xoh6rliqjliIbphY3lhoXlrZjnmoTmlbDmja7nu5PmnoRcclxuICogQGNhdGVnb3J5IG1lbW9wXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB6aCDlr7nosaHmsaDjgIJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBQb29sPFQ+IHtcclxuXHJcbiAgICBwcml2YXRlIF9jdG9yOiAoKSA9PiBUO1xyXG4gICAgcHJpdmF0ZSBfZWxlbWVudHNQZXJCYXRjaDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfbmV4dEF2YWlsOiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9mcmVlcG9vbDogVFtdID0gW107XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDmnoTpgKDlh73mlbDjgIJcclxuICAgICAqIEBwYXJhbSBjdG9yIOWFg+e0oOaehOmAoOWHveaVsOOAglxyXG4gICAgICogQHBhcmFtIHNpemUg5Yid5aeL5aSn5bCP44CCXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChjdG9yOiAoKSA9PiBULCBlbGVtZW50c1BlckJhdGNoOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9jdG9yID0gY3RvcjtcclxuICAgICAgICB0aGlzLl9lbGVtZW50c1BlckJhdGNoID0gTWF0aC5tYXgoZWxlbWVudHNQZXJCYXRjaCwgMSk7XHJcbiAgICAgICAgdGhpcy5fbmV4dEF2YWlsID0gdGhpcy5fZWxlbWVudHNQZXJCYXRjaCAtIDE7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZWxlbWVudHNQZXJCYXRjaDsgKytpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2ZyZWVwb29sLnB1c2goY3RvcigpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5LuO5a+56LGh5rGg5Lit5Y+W5Ye65LiA5Liq5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBhbGxvYyAoKTogVCB7XHJcbiAgICAgICAgaWYgKHRoaXMuX25leHRBdmFpbCA8IDApIHtcclxuICAgICAgICAgICAgY29uc3QgZWxlbWVudHNQZXJCYXRjaCA9IHRoaXMuX2VsZW1lbnRzUGVyQmF0Y2g7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZWxlbWVudHNQZXJCYXRjaDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9mcmVlcG9vbC5wdXNoKHRoaXMuX2N0b3IoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5fbmV4dEF2YWlsID0gZWxlbWVudHNQZXJCYXRjaCAtIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByZXQgPSB0aGlzLl9mcmVlcG9vbFt0aGlzLl9uZXh0QXZhaWwtLV07XHJcbiAgICAgICAgdGhpcy5fZnJlZXBvb2wubGVuZ3RoLS07XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEB6aCDlsIbkuIDkuKrlr7nosaHmlL7lm57lr7nosaHmsaDkuK3jgIJcclxuICAgICAqIEBwYXJhbSBvYmog6YeK5pS+55qE5a+56LGh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBmcmVlIChvYmo6IFQpIHtcclxuICAgICAgICB0aGlzLl9mcmVlcG9vbC5wdXNoKG9iaik7XHJcbiAgICAgICAgdGhpcy5fbmV4dEF2YWlsKys7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAemgg5bCG5LiA57uE5a+56LGh5pS+5Zue5a+56LGh5rGg5Lit44CCXHJcbiAgICAgKiBAcGFyYW0gb2JqcyDkuIDnu4TopoHph4rmlL7nmoTlr7nosaHjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIGZyZWVBcnJheSAob2JqczogVFtdKSB7XHJcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkodGhpcy5fZnJlZXBvb2wsIG9ianMpO1xyXG4gICAgICAgIHRoaXMuX25leHRBdmFpbCArPSBvYmpzLmxlbmd0aDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOmHiuaUvuWvueixoeaxoOS4reaJgOaciei1hOa6kOOAglxyXG4gICAgICogQHBhcmFtIGR0b3Ig6ZSA5q+B5Zue6LCD77yM5a+55q+P5Liq6YeK5pS+55qE5a+56LGh6LCD55So5LiA5qyh44CCXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBkZXN0cm95IChkdG9yPzogKG9iajogVCkgPT4gdm9pZCkge1xyXG4gICAgICAgIGlmIChkdG9yKSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IHRoaXMuX25leHRBdmFpbDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBkdG9yKHRoaXMuX2ZyZWVwb29sW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9mcmVlcG9vbC5sZW5ndGggPSAwO1xyXG4gICAgICAgIHRoaXMuX25leHRBdmFpbCA9IC0xO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==