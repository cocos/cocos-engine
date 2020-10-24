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
  _exports.default = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /*
   Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.
  
   http://www.cocos.com
  
   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated engine source code (the "Software"), a limited,
   worldwide, royalty-free, non-assignable, revocable and non-exclusive license
   to use Cocos Creator solely to develop games on your target platforms. You shall
   not use Cocos Creator software for developing other software or tools that's
   used for developing games. You are not granted to publish, distribute,
   sublicense, and/or sell copies of Cocos Creator.
  
   The software or tools in this License Agreement are licensed, not sold.
   Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.
  
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.
  */

  /**
   * @en
   * A fixed-length object pool designed for general type.<br>
   * The implementation of this object pool is very simple,
   * it can helps you to improve your game performance for objects which need frequent release and recreate operations<br/>
   * @zh
   * 长度固定的对象缓存池，可以用来缓存各种对象类型。<br/>
   * 这个对象池的实现非常精简，它可以帮助您提高游戏性能，适用于优化对象的反复创建和销毁。
   * @class js.Pool
   * @example
   * ```
   *
   * Example 1:
   *
   * function Details () {
   *     this.uuidList = [];
   * };
   * Details.prototype.reset = function () {
   *     this.uuidList.length = 0;
   * };
   * Details.pool = new js.Pool(function (obj) {
   *     obj.reset();
   * }, 5);
   * Details.pool.get = function () {
   *     return this._get() || new Details();
   * };
   *
   * var detail = Details.pool.get();
   * ...
   * Details.pool.put(detail);
   *
   * Example 2:
   *
   * function Details (buffer) {
   *    this.uuidList = buffer;
   * };
   * ...
   * Details.pool.get = function (buffer) {
   *     var cached = this._get();
   *     if (cached) {
   *         cached.uuidList = buffer;
   *         return cached;
   *     }
   *     else {
   *         return new Details(buffer);
   *     }
   * };
   *
   * var detail = Details.pool.get( [] );
   * ...
   * ```
   */
  var Pool = /*#__PURE__*/function () {
    _createClass(Pool, [{
      key: "get",

      /**
       * @en
       * The current number of available objects, the default is 0, it will gradually increase with the recycle of the object,
       * the maximum will not exceed the size specified when the constructor is called.
       * @zh
       * 当前可用对象数量，一开始默认是 0，随着对象的回收会逐渐增大，最大不会超过调用构造函数时指定的 size。
       * @default 0
       */

      /**
       * @en
       * Get and initialize an object from pool. This method defaults to null and requires the user to implement it.
       * @zh
       * 获取并初始化对象池中的对象。这个方法默认为空，需要用户自己实现。
       * @param args - parameters to used to initialize the object
       */
      value: function get() {
        return this._get();
      }
    }]);

    function Pool(_0, _1) {
      _classCallCheck(this, Pool);

      this.count = void 0;
      this._pool = void 0;
      this._cleanup = void 0;
      var size = _1 === undefined ? _0 : _1;
      var cleanupFunc = _1 === undefined ? null : _0;
      this.count = 0;
      this._pool = new Array(size);
      this._cleanup = cleanupFunc;
    }
    /**
     * @en
     * Get an object from pool, if no available object in the pool, null will be returned.
     * @zh
     * 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     */


    _createClass(Pool, [{
      key: "_get",
      value: function _get() {
        if (this.count > 0) {
          --this.count;
          var cache = this._pool[this.count];
          this._pool[this.count] = null;
          return cache;
        }

        return null;
      }
      /**
       * @en Put an object into the pool.
       * @zh 向对象池返还一个不再需要的对象。
       */

    }, {
      key: "put",
      value: function put(obj) {
        var pool = this._pool;

        if (this.count < pool.length) {
          if (this._cleanup && this._cleanup(obj) === false) {
            return;
          }

          pool[this.count] = obj;
          ++this.count;
        }
      }
      /**
       * @en Resize the pool.
       * @zh 设置对象池容量。
       */

    }, {
      key: "resize",
      value: function resize(length) {
        if (length >= 0) {
          this._pool.length = length;

          if (this.count > length) {
            this.count = length;
          }
        }
      }
    }]);

    return Pool;
  }();

  _exports.default = Pool;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvcG9vbC50cyJdLCJuYW1lcyI6WyJQb29sIiwiX2dldCIsIl8wIiwiXzEiLCJjb3VudCIsIl9wb29sIiwiX2NsZWFudXAiLCJzaXplIiwidW5kZWZpbmVkIiwiY2xlYW51cEZ1bmMiLCJBcnJheSIsImNhY2hlIiwib2JqIiwicG9vbCIsImxlbmd0aCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW9EcUJBLEk7Ozs7QUFDakI7Ozs7Ozs7OztBQVVBOzs7Ozs7OzRCQU9jO0FBQ1YsZUFBTyxLQUFLQyxJQUFMLEVBQVA7QUFDSDs7O0FBdUJELGtCQUFhQyxFQUFiLEVBQThDQyxFQUE5QyxFQUEyRDtBQUFBOztBQUFBLFdBbENwREMsS0FrQ29EO0FBQUEsV0FyQm5EQyxLQXFCbUQ7QUFBQSxXQXBCbkRDLFFBb0JtRDtBQUN2RCxVQUFNQyxJQUFJLEdBQUlKLEVBQUUsS0FBS0ssU0FBUixHQUFzQk4sRUFBdEIsR0FBc0NDLEVBQW5EO0FBQ0EsVUFBTU0sV0FBVyxHQUFJTixFQUFFLEtBQUtLLFNBQVIsR0FBcUIsSUFBckIsR0FBNkJOLEVBQWpEO0FBQ0EsV0FBS0UsS0FBTCxHQUFhLENBQWI7QUFDQSxXQUFLQyxLQUFMLEdBQWEsSUFBSUssS0FBSixDQUFVSCxJQUFWLENBQWI7QUFDQSxXQUFLRCxRQUFMLEdBQWdCRyxXQUFoQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7NkJBTWU7QUFDWCxZQUFJLEtBQUtMLEtBQUwsR0FBYSxDQUFqQixFQUFvQjtBQUNoQixZQUFFLEtBQUtBLEtBQVA7QUFDQSxjQUFNTyxLQUFLLEdBQUcsS0FBS04sS0FBTCxDQUFXLEtBQUtELEtBQWhCLENBQWQ7QUFDQSxlQUFLQyxLQUFMLENBQVcsS0FBS0QsS0FBaEIsSUFBeUIsSUFBekI7QUFDQSxpQkFBT08sS0FBUDtBQUNIOztBQUNELGVBQU8sSUFBUDtBQUNIO0FBRUQ7Ozs7Ozs7MEJBSVlDLEcsRUFBUTtBQUNoQixZQUFNQyxJQUFJLEdBQUcsS0FBS1IsS0FBbEI7O0FBQ0EsWUFBSSxLQUFLRCxLQUFMLEdBQWFTLElBQUksQ0FBQ0MsTUFBdEIsRUFBOEI7QUFDMUIsY0FBSSxLQUFLUixRQUFMLElBQWlCLEtBQUtBLFFBQUwsQ0FBY00sR0FBZCxNQUF1QixLQUE1QyxFQUFtRDtBQUMvQztBQUNIOztBQUNEQyxVQUFBQSxJQUFJLENBQUMsS0FBS1QsS0FBTixDQUFKLEdBQW1CUSxHQUFuQjtBQUNBLFlBQUUsS0FBS1IsS0FBUDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs2QkFJZVUsTSxFQUFnQjtBQUMzQixZQUFJQSxNQUFNLElBQUksQ0FBZCxFQUFpQjtBQUNiLGVBQUtULEtBQUwsQ0FBV1MsTUFBWCxHQUFvQkEsTUFBcEI7O0FBQ0EsY0FBSSxLQUFLVixLQUFMLEdBQWFVLE1BQWpCLEVBQXlCO0FBQ3JCLGlCQUFLVixLQUFMLEdBQWFVLE1BQWI7QUFDSDtBQUNKO0FBQ0oiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDE4IFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLlxyXG5cclxuIGh0dHA6Ly93d3cuY29jb3MuY29tXHJcblxyXG4gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxyXG4gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBlbmdpbmUgc291cmNlIGNvZGUgKHRoZSBcIlNvZnR3YXJlXCIpLCBhIGxpbWl0ZWQsXHJcbiB3b3JsZHdpZGUsIHJveWFsdHktZnJlZSwgbm9uLWFzc2lnbmFibGUsIHJldm9jYWJsZSBhbmQgbm9uLWV4Y2x1c2l2ZSBsaWNlbnNlXHJcbiB0byB1c2UgQ29jb3MgQ3JlYXRvciBzb2xlbHkgdG8gZGV2ZWxvcCBnYW1lcyBvbiB5b3VyIHRhcmdldCBwbGF0Zm9ybXMuIFlvdSBzaGFsbFxyXG4gbm90IHVzZSBDb2NvcyBDcmVhdG9yIHNvZnR3YXJlIGZvciBkZXZlbG9waW5nIG90aGVyIHNvZnR3YXJlIG9yIHRvb2xzIHRoYXQnc1xyXG4gdXNlZCBmb3IgZGV2ZWxvcGluZyBnYW1lcy4gWW91IGFyZSBub3QgZ3JhbnRlZCB0byBwdWJsaXNoLCBkaXN0cmlidXRlLFxyXG4gc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIENvY29zIENyZWF0b3IuXHJcblxyXG4gVGhlIHNvZnR3YXJlIG9yIHRvb2xzIGluIHRoaXMgTGljZW5zZSBBZ3JlZW1lbnQgYXJlIGxpY2Vuc2VkLCBub3Qgc29sZC5cclxuIFhpYW1lbiBZYWppIFNvZnR3YXJlIENvLiwgTHRkLiByZXNlcnZlcyBhbGwgcmlnaHRzIG5vdCBleHByZXNzbHkgZ3JhbnRlZCB0byB5b3UuXHJcblxyXG4gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxyXG4gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXHJcbiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcclxuIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcclxuIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXHJcbiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXHJcbiBUSEUgU09GVFdBUkUuXHJcbiovXHJcblxyXG50eXBlIENsZWFuVXBGdW5jdGlvbjxUPiA9ICh2YWx1ZTogVCkgPT4gYm9vbGVhbiB8IHZvaWQ7XHJcblxyXG4vKipcclxuICogQGVuXHJcbiAqIEEgZml4ZWQtbGVuZ3RoIG9iamVjdCBwb29sIGRlc2lnbmVkIGZvciBnZW5lcmFsIHR5cGUuPGJyPlxyXG4gKiBUaGUgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBvYmplY3QgcG9vbCBpcyB2ZXJ5IHNpbXBsZSxcclxuICogaXQgY2FuIGhlbHBzIHlvdSB0byBpbXByb3ZlIHlvdXIgZ2FtZSBwZXJmb3JtYW5jZSBmb3Igb2JqZWN0cyB3aGljaCBuZWVkIGZyZXF1ZW50IHJlbGVhc2UgYW5kIHJlY3JlYXRlIG9wZXJhdGlvbnM8YnIvPlxyXG4gKiBAemhcclxuICog6ZW/5bqm5Zu65a6a55qE5a+56LGh57yT5a2Y5rGg77yM5Y+v5Lul55So5p2l57yT5a2Y5ZCE56eN5a+56LGh57G75Z6L44CCPGJyLz5cclxuICog6L+Z5Liq5a+56LGh5rGg55qE5a6e546w6Z2e5bi457K+566A77yM5a6D5Y+v5Lul5biu5Yqp5oKo5o+Q6auY5ri45oiP5oCn6IO977yM6YCC55So5LqO5LyY5YyW5a+56LGh55qE5Y+N5aSN5Yib5bu65ZKM6ZSA5q+B44CCXHJcbiAqIEBjbGFzcyBqcy5Qb29sXHJcbiAqIEBleGFtcGxlXHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBFeGFtcGxlIDE6XHJcbiAqXHJcbiAqIGZ1bmN0aW9uIERldGFpbHMgKCkge1xyXG4gKiAgICAgdGhpcy51dWlkTGlzdCA9IFtdO1xyXG4gKiB9O1xyXG4gKiBEZXRhaWxzLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uICgpIHtcclxuICogICAgIHRoaXMudXVpZExpc3QubGVuZ3RoID0gMDtcclxuICogfTtcclxuICogRGV0YWlscy5wb29sID0gbmV3IGpzLlBvb2woZnVuY3Rpb24gKG9iaikge1xyXG4gKiAgICAgb2JqLnJlc2V0KCk7XHJcbiAqIH0sIDUpO1xyXG4gKiBEZXRhaWxzLnBvb2wuZ2V0ID0gZnVuY3Rpb24gKCkge1xyXG4gKiAgICAgcmV0dXJuIHRoaXMuX2dldCgpIHx8IG5ldyBEZXRhaWxzKCk7XHJcbiAqIH07XHJcbiAqXHJcbiAqIHZhciBkZXRhaWwgPSBEZXRhaWxzLnBvb2wuZ2V0KCk7XHJcbiAqIC4uLlxyXG4gKiBEZXRhaWxzLnBvb2wucHV0KGRldGFpbCk7XHJcbiAqXHJcbiAqIEV4YW1wbGUgMjpcclxuICpcclxuICogZnVuY3Rpb24gRGV0YWlscyAoYnVmZmVyKSB7XHJcbiAqICAgIHRoaXMudXVpZExpc3QgPSBidWZmZXI7XHJcbiAqIH07XHJcbiAqIC4uLlxyXG4gKiBEZXRhaWxzLnBvb2wuZ2V0ID0gZnVuY3Rpb24gKGJ1ZmZlcikge1xyXG4gKiAgICAgdmFyIGNhY2hlZCA9IHRoaXMuX2dldCgpO1xyXG4gKiAgICAgaWYgKGNhY2hlZCkge1xyXG4gKiAgICAgICAgIGNhY2hlZC51dWlkTGlzdCA9IGJ1ZmZlcjtcclxuICogICAgICAgICByZXR1cm4gY2FjaGVkO1xyXG4gKiAgICAgfVxyXG4gKiAgICAgZWxzZSB7XHJcbiAqICAgICAgICAgcmV0dXJuIG5ldyBEZXRhaWxzKGJ1ZmZlcik7XHJcbiAqICAgICB9XHJcbiAqIH07XHJcbiAqXHJcbiAqIHZhciBkZXRhaWwgPSBEZXRhaWxzLnBvb2wuZ2V0KCBbXSApO1xyXG4gKiAuLi5cclxuICogYGBgXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb29sPFQ+IHtcclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBUaGUgY3VycmVudCBudW1iZXIgb2YgYXZhaWxhYmxlIG9iamVjdHMsIHRoZSBkZWZhdWx0IGlzIDAsIGl0IHdpbGwgZ3JhZHVhbGx5IGluY3JlYXNlIHdpdGggdGhlIHJlY3ljbGUgb2YgdGhlIG9iamVjdCxcclxuICAgICAqIHRoZSBtYXhpbXVtIHdpbGwgbm90IGV4Y2VlZCB0aGUgc2l6ZSBzcGVjaWZpZWQgd2hlbiB0aGUgY29uc3RydWN0b3IgaXMgY2FsbGVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDlvZPliY3lj6/nlKjlr7nosaHmlbDph4/vvIzkuIDlvIDlp4vpu5jorqTmmK8gMO+8jOmaj+edgOWvueixoeeahOWbnuaUtuS8mumAkOa4kOWinuWkp++8jOacgOWkp+S4jeS8mui2hei/h+iwg+eUqOaehOmAoOWHveaVsOaXtuaMh+WumueahCBzaXpl44CCXHJcbiAgICAgKiBAZGVmYXVsdCAwXHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBjb3VudDogbnVtYmVyO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgYW5kIGluaXRpYWxpemUgYW4gb2JqZWN0IGZyb20gcG9vbC4gVGhpcyBtZXRob2QgZGVmYXVsdHMgdG8gbnVsbCBhbmQgcmVxdWlyZXMgdGhlIHVzZXIgdG8gaW1wbGVtZW50IGl0LlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blubbliJ3lp4vljJblr7nosaHmsaDkuK3nmoTlr7nosaHjgILov5nkuKrmlrnms5Xpu5jorqTkuLrnqbrvvIzpnIDopoHnlKjmiLfoh6rlt7Hlrp7njrDjgIJcclxuICAgICAqIEBwYXJhbSBhcmdzIC0gcGFyYW1ldGVycyB0byB1c2VkIHRvIGluaXRpYWxpemUgdGhlIG9iamVjdFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0ICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0KCk7XHJcbiAgICB9O1xyXG5cclxuICAgIHByaXZhdGUgX3Bvb2w6IEFycmF5PFQgfCBudWxsPjtcclxuICAgIHByaXZhdGUgX2NsZWFudXA6IENsZWFuVXBGdW5jdGlvbjxUPiB8IG51bGw7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvb/nlKjmnoTpgKDlh73mlbDmnaXliJvlu7rkuIDkuKrmjIflrprlr7nosaHnsbvlnovnmoTlr7nosaHmsaDvvIzmgqjlj6/ku6XkvKDpgJLkuIDkuKrlm57osIPlh73mlbDvvIznlKjkuo7lpITnkIblr7nosaHlm57mlLbml7bnmoTmuIXnkIbpgLvovpHjgIJcclxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjbGVhbnVwRnVuY10gLSB0aGUgY2FsbGJhY2sgbWV0aG9kIHVzZWQgdG8gcHJvY2VzcyB0aGUgY2xlYW51cCBsb2dpYyB3aGVuIHRoZSBvYmplY3QgaXMgcmVjeWNsZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2xlYW51cEZ1bmMub2JqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSAtIGluaXRpYWxpemVzIHRoZSBsZW5ndGggb2YgdGhlIGFycmF5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChjbGVhbnVwOiBDbGVhblVwRnVuY3Rpb248VD4sIHNpemU6IG51bWJlcik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkvb/nlKjmnoTpgKDlh73mlbDmnaXliJvlu7rkuIDkuKrmjIflrprlr7nosaHnsbvlnovnmoTlr7nosaHmsaDvvIzmgqjlj6/ku6XkvKDpgJLkuIDkuKrlm57osIPlh73mlbDvvIznlKjkuo7lpITnkIblr7nosaHlm57mlLbml7bnmoTmuIXnkIbpgLvovpHjgIJcclxuICAgICAqIEBtZXRob2QgY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IFtjbGVhbnVwRnVuY10gLSB0aGUgY2FsbGJhY2sgbWV0aG9kIHVzZWQgdG8gcHJvY2VzcyB0aGUgY2xlYW51cCBsb2dpYyB3aGVuIHRoZSBvYmplY3QgaXMgcmVjeWNsZWQuXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gY2xlYW51cEZ1bmMub2JqXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gc2l6ZSAtIGluaXRpYWxpemVzIHRoZSBsZW5ndGggb2YgdGhlIGFycmF5XHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yIChzaXplOiBudW1iZXIpO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yIChfMDogQ2xlYW5VcEZ1bmN0aW9uPFQ+IHwgbnVtYmVyLCBfMT86IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSAoXzEgPT09IHVuZGVmaW5lZCkgPyAoXzAgYXMgbnVtYmVyKSA6IF8xO1xyXG4gICAgICAgIGNvbnN0IGNsZWFudXBGdW5jID0gKF8xID09PSB1bmRlZmluZWQpID8gbnVsbCA6IChfMCBhcyBDbGVhblVwRnVuY3Rpb248VD4pO1xyXG4gICAgICAgIHRoaXMuY291bnQgPSAwO1xyXG4gICAgICAgIHRoaXMuX3Bvb2wgPSBuZXcgQXJyYXkoc2l6ZSk7XHJcbiAgICAgICAgdGhpcy5fY2xlYW51cCA9IGNsZWFudXBGdW5jO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuXHJcbiAgICAgKiBHZXQgYW4gb2JqZWN0IGZyb20gcG9vbCwgaWYgbm8gYXZhaWxhYmxlIG9iamVjdCBpbiB0aGUgcG9vbCwgbnVsbCB3aWxsIGJlIHJldHVybmVkLlxyXG4gICAgICogQHpoXHJcbiAgICAgKiDojrflj5blr7nosaHmsaDkuK3nmoTlr7nosaHvvIzlpoLmnpzlr7nosaHmsaDmsqHmnInlj6/nlKjlr7nosaHvvIzliJnov5Tlm57nqbrjgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIF9nZXQgKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmNvdW50ID4gMCkge1xyXG4gICAgICAgICAgICAtLXRoaXMuY291bnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGNhY2hlID0gdGhpcy5fcG9vbFt0aGlzLmNvdW50XTtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbFt0aGlzLmNvdW50XSA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBjYWNoZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAZW4gUHV0IGFuIG9iamVjdCBpbnRvIHRoZSBwb29sLlxyXG4gICAgICogQHpoIOWQkeWvueixoeaxoOi/lOi/mOS4gOS4quS4jeWGjemcgOimgeeahOWvueixoeOAglxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcHV0IChvYmo6IFQpIHtcclxuICAgICAgICBjb25zdCBwb29sID0gdGhpcy5fcG9vbDtcclxuICAgICAgICBpZiAodGhpcy5jb3VudCA8IHBvb2wubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLl9jbGVhbnVwICYmIHRoaXMuX2NsZWFudXAob2JqKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwb29sW3RoaXMuY291bnRdID0gb2JqO1xyXG4gICAgICAgICAgICArK3RoaXMuY291bnQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQGVuIFJlc2l6ZSB0aGUgcG9vbC5cclxuICAgICAqIEB6aCDorr7nva7lr7nosaHmsaDlrrnph4/jgIJcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2l6ZSAobGVuZ3RoOiBudW1iZXIpIHtcclxuICAgICAgICBpZiAobGVuZ3RoID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5fcG9vbC5sZW5ndGggPSBsZW5ndGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNvdW50ID4gbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvdW50ID0gbGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiJdfQ==