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
    global.arrayCollisionMatrix = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.ArrayCollisionMatrix = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * Collision "matrix". It's actually a triangular-shaped array of whether two bodies are touching this step, for reference next step
   * @class ArrayCollisionMatrix
   * @constructor
   */
  var ArrayCollisionMatrix = /*#__PURE__*/function () {
    function ArrayCollisionMatrix() {
      _classCallCheck(this, ArrayCollisionMatrix);

      this.matrix = [];
    }

    _createClass(ArrayCollisionMatrix, [{
      key: "get",

      /**
       * Get an element
       * @method get
       * @param  {Number} i
       * @param  {Number} j
       * @return {Number}
       */
      value: function get(i, j) {
        if (j > i) {
          var temp = j;
          j = i;
          i = temp;
        }

        return this.matrix[(i * (i + 1) >> 1) + j - 1];
      }
      /**
       * Set an element
       * @method set
       * @param {Number} i
       * @param {Number} j
       * @param {boolean} value
       */

    }, {
      key: "set",
      value: function set(i, j, value) {
        if (j > i) {
          var temp = j;
          j = i;
          i = temp;
        }

        this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0;
      }
      /**
       * Sets all elements to zero
       * @method reset
       */

    }, {
      key: "reset",
      value: function reset() {
        this.matrix.length = 0;
      }
      /**
       * Sets the max number of objects
       * @param {Number} n
       */

    }, {
      key: "setNumObjects",
      value: function setNumObjects(n) {
        this.matrix.length = n * (n - 1) >> 1;
      }
    }]);

    return ArrayCollisionMatrix;
  }();

  _exports.ArrayCollisionMatrix = ArrayCollisionMatrix;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvdXRpbHMvYXJyYXktY29sbGlzaW9uLW1hdHJpeC50cyJdLCJuYW1lcyI6WyJBcnJheUNvbGxpc2lvbk1hdHJpeCIsIm1hdHJpeCIsImkiLCJqIiwidGVtcCIsInZhbHVlIiwibGVuZ3RoIiwibiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7TUFLYUEsb0I7Ozs7V0FLRkMsTSxHQUFtQixFOzs7Ozs7QUFFMUI7Ozs7Ozs7MEJBT1lDLEMsRUFBV0MsQyxFQUFtQjtBQUN0QyxZQUFJQSxDQUFDLEdBQUdELENBQVIsRUFBVztBQUNQLGNBQU1FLElBQUksR0FBR0QsQ0FBYjtBQUNBQSxVQUFBQSxDQUFDLEdBQUdELENBQUo7QUFDQUEsVUFBQUEsQ0FBQyxHQUFHRSxJQUFKO0FBQ0g7O0FBQ0QsZUFBTyxLQUFLSCxNQUFMLENBQVksQ0FBQ0MsQ0FBQyxJQUFJQSxDQUFDLEdBQUcsQ0FBUixDQUFELElBQWUsQ0FBaEIsSUFBcUJDLENBQXJCLEdBQXlCLENBQXJDLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7OzBCQU9ZRCxDLEVBQVdDLEMsRUFBV0UsSyxFQUFnQjtBQUM5QyxZQUFJRixDQUFDLEdBQUdELENBQVIsRUFBVztBQUNQLGNBQU1FLElBQUksR0FBR0QsQ0FBYjtBQUNBQSxVQUFBQSxDQUFDLEdBQUdELENBQUo7QUFDQUEsVUFBQUEsQ0FBQyxHQUFHRSxJQUFKO0FBQ0g7O0FBQ0QsYUFBS0gsTUFBTCxDQUFZLENBQUNDLENBQUMsSUFBSUEsQ0FBQyxHQUFHLENBQVIsQ0FBRCxJQUFlLENBQWhCLElBQXFCQyxDQUFyQixHQUF5QixDQUFyQyxJQUEwQ0UsS0FBSyxHQUFHLENBQUgsR0FBTyxDQUF0RDtBQUNIO0FBRUQ7Ozs7Ozs7OEJBSWdCO0FBQ1osYUFBS0osTUFBTCxDQUFZSyxNQUFaLEdBQXFCLENBQXJCO0FBQ0g7QUFFRDs7Ozs7OztvQ0FJc0JDLEMsRUFBVztBQUM3QixhQUFLTixNQUFMLENBQVlLLE1BQVosR0FBcUJDLENBQUMsSUFBSUEsQ0FBQyxHQUFHLENBQVIsQ0FBRCxJQUFlLENBQXBDO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQ29sbGlzaW9uIFwibWF0cml4XCIuIEl0J3MgYWN0dWFsbHkgYSB0cmlhbmd1bGFyLXNoYXBlZCBhcnJheSBvZiB3aGV0aGVyIHR3byBib2RpZXMgYXJlIHRvdWNoaW5nIHRoaXMgc3RlcCwgZm9yIHJlZmVyZW5jZSBuZXh0IHN0ZXBcclxuICogQGNsYXNzIEFycmF5Q29sbGlzaW9uTWF0cml4XHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGNsYXNzIEFycmF5Q29sbGlzaW9uTWF0cml4IHtcclxuXHJcbiAgICAvKipcclxuICAgICAqIFRoZSBtYXRyaXggc3RvcmFnZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgbWF0cml4OiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFuIGVsZW1lbnRcclxuICAgICAqIEBtZXRob2QgZ2V0XHJcbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9IGlcclxuICAgICAqIEBwYXJhbSAge051bWJlcn0galxyXG4gICAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0IChpOiBudW1iZXIsIGo6IG51bWJlcik6IG51bWJlciB7XHJcbiAgICAgICAgaWYgKGogPiBpKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRlbXAgPSBqO1xyXG4gICAgICAgICAgICBqID0gaTtcclxuICAgICAgICAgICAgaSA9IHRlbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLm1hdHJpeFsoaSAqIChpICsgMSkgPj4gMSkgKyBqIC0gMV07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgYW4gZWxlbWVudFxyXG4gICAgICogQG1ldGhvZCBzZXRcclxuICAgICAqIEBwYXJhbSB7TnVtYmVyfSBpXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0galxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSB2YWx1ZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0IChpOiBudW1iZXIsIGo6IG51bWJlciwgdmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICBpZiAoaiA+IGkpIHtcclxuICAgICAgICAgICAgY29uc3QgdGVtcCA9IGo7XHJcbiAgICAgICAgICAgIGogPSBpO1xyXG4gICAgICAgICAgICBpID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5tYXRyaXhbKGkgKiAoaSArIDEpID4+IDEpICsgaiAtIDFdID0gdmFsdWUgPyAxIDogMDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldHMgYWxsIGVsZW1lbnRzIHRvIHplcm9cclxuICAgICAqIEBtZXRob2QgcmVzZXRcclxuICAgICAqL1xyXG4gICAgcHVibGljIHJlc2V0ICgpIHtcclxuICAgICAgICB0aGlzLm1hdHJpeC5sZW5ndGggPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0cyB0aGUgbWF4IG51bWJlciBvZiBvYmplY3RzXHJcbiAgICAgKiBAcGFyYW0ge051bWJlcn0gblxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgc2V0TnVtT2JqZWN0cyAobjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5tYXRyaXgubGVuZ3RoID0gbiAqIChuIC0gMSkgPj4gMTtcclxuICAgIH1cclxuXHJcbn1cclxuIl19