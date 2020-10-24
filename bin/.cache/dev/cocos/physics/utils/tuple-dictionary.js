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
    global.tupleDictionary = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.TupleDictionary = void 0;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  /**
   * @class TupleDictionary
   * @constructor
   */
  var TupleDictionary = /*#__PURE__*/function () {
    /**
     * The data storage
     */
    function TupleDictionary() {
      _classCallCheck(this, TupleDictionary);

      this.data = void 0;
      this.data = {
        keys: []
      };
    }
    /**
     * @method get
     * @param  {number} i
     * @param  {number} j
     * @return {Object}
     */


    _createClass(TupleDictionary, [{
      key: "get",
      value: function get(i, j) {
        if (i > j) {
          // swap
          var temp = j;
          j = i;
          i = temp;
        }

        return this.data[i + '-' + j];
      }
    }, {
      key: "set",

      /**
       * @method set
       * @param  {number} i
       * @param  {number} j
       * @param {Object} value
       */
      value: function set(i, j, value) {
        if (i > j) {
          var temp = j;
          j = i;
          i = temp;
        }

        var key = i + '-' + j;

        if (value == null) {
          var idx = this.data.keys.indexOf(key);

          if (idx != -1) {
            this.data.keys.splice(idx, 1);
            delete this.data[key];
            return value;
          }
        } // Check if key already exists


        if (!this.get(i, j)) {
          this.data.keys.push(key);
        }

        this.data[key] = value;
        return this.data[key];
      }
    }, {
      key: "reset",

      /**
       * @method reset
       */
      value: function reset() {
        var data = this.data,
            keys = data.keys;

        while (keys.length > 0) {
          var key = keys.pop();
          delete data[key];
        }
      }
    }, {
      key: "getLength",

      /**
       * @method getLength
       */
      value: function getLength() {
        return this.data.keys.length;
      }
    }, {
      key: "getKeyByIndex",

      /**
       * @method getKeyByIndex
       * @param {number} index
       */
      value: function getKeyByIndex(index) {
        return this.data.keys[index];
      }
    }, {
      key: "getDataByKey",

      /**
       * @method getDataByKey
       * @param {string} Key
       */
      value: function getDataByKey(Key) {
        return this.data[Key];
      }
    }]);

    return TupleDictionary;
  }();

  _exports.TupleDictionary = TupleDictionary;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL3BoeXNpY3MvdXRpbHMvdHVwbGUtZGljdGlvbmFyeS50cyJdLCJuYW1lcyI6WyJUdXBsZURpY3Rpb25hcnkiLCJkYXRhIiwia2V5cyIsImkiLCJqIiwidGVtcCIsInZhbHVlIiwia2V5IiwiaWR4IiwiaW5kZXhPZiIsInNwbGljZSIsImdldCIsInB1c2giLCJsZW5ndGgiLCJwb3AiLCJpbmRleCIsIktleSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztNQUlhQSxlO0FBRVQ7OztBQUtBLCtCQUFlO0FBQUE7O0FBQUEsV0FGUkMsSUFFUTtBQUNYLFdBQUtBLElBQUwsR0FBWTtBQUFFQyxRQUFBQSxJQUFJLEVBQUU7QUFBUixPQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7OzswQkFNZUMsQyxFQUFXQyxDLEVBQWM7QUFDcEMsWUFBSUQsQ0FBQyxHQUFHQyxDQUFSLEVBQVc7QUFDUDtBQUNBLGNBQUlDLElBQUksR0FBR0QsQ0FBWDtBQUNBQSxVQUFBQSxDQUFDLEdBQUdELENBQUo7QUFDQUEsVUFBQUEsQ0FBQyxHQUFHRSxJQUFKO0FBQ0g7O0FBQ0QsZUFBTyxLQUFLSixJQUFMLENBQVVFLENBQUMsR0FBRyxHQUFKLEdBQVVDLENBQXBCLENBQVA7QUFDSDs7OztBQUVEOzs7Ozs7MEJBTWVELEMsRUFBV0MsQyxFQUFXRSxLLEVBQWE7QUFFOUMsWUFBSUgsQ0FBQyxHQUFHQyxDQUFSLEVBQVc7QUFDUCxjQUFJQyxJQUFJLEdBQUdELENBQVg7QUFDQUEsVUFBQUEsQ0FBQyxHQUFHRCxDQUFKO0FBQ0FBLFVBQUFBLENBQUMsR0FBR0UsSUFBSjtBQUNIOztBQUNELFlBQUlFLEdBQUcsR0FBR0osQ0FBQyxHQUFHLEdBQUosR0FBVUMsQ0FBcEI7O0FBRUEsWUFBSUUsS0FBSyxJQUFJLElBQWIsRUFBbUI7QUFDZixjQUFJRSxHQUFHLEdBQUcsS0FBS1AsSUFBTCxDQUFVQyxJQUFWLENBQWVPLE9BQWYsQ0FBdUJGLEdBQXZCLENBQVY7O0FBQ0EsY0FBSUMsR0FBRyxJQUFJLENBQUMsQ0FBWixFQUFlO0FBQ1gsaUJBQUtQLElBQUwsQ0FBVUMsSUFBVixDQUFlUSxNQUFmLENBQXNCRixHQUF0QixFQUEyQixDQUEzQjtBQUNBLG1CQUFPLEtBQUtQLElBQUwsQ0FBVU0sR0FBVixDQUFQO0FBQ0EsbUJBQU9ELEtBQVA7QUFDSDtBQUNKLFNBaEI2QyxDQWtCOUM7OztBQUNBLFlBQUksQ0FBQyxLQUFLSyxHQUFMLENBQVNSLENBQVQsRUFBWUMsQ0FBWixDQUFMLEVBQXFCO0FBQ2pCLGVBQUtILElBQUwsQ0FBVUMsSUFBVixDQUFlVSxJQUFmLENBQW9CTCxHQUFwQjtBQUNIOztBQUVELGFBQUtOLElBQUwsQ0FBVU0sR0FBVixJQUFpQkQsS0FBakI7QUFDQSxlQUFPLEtBQUtMLElBQUwsQ0FBVU0sR0FBVixDQUFQO0FBQ0g7Ozs7QUFFRDs7OzhCQUdnQjtBQUNaLFlBQUlOLElBQUksR0FBRyxLQUFLQSxJQUFoQjtBQUFBLFlBQ0lDLElBQUksR0FBR0QsSUFBSSxDQUFDQyxJQURoQjs7QUFFQSxlQUFPQSxJQUFJLENBQUNXLE1BQUwsR0FBYyxDQUFyQixFQUF3QjtBQUNwQixjQUFJTixHQUFHLEdBQUdMLElBQUksQ0FBQ1ksR0FBTCxFQUFWO0FBQ0EsaUJBQU9iLElBQUksQ0FBQ00sR0FBRCxDQUFYO0FBQ0g7QUFDSjs7OztBQUVEOzs7a0NBR29CO0FBQ2hCLGVBQU8sS0FBS04sSUFBTCxDQUFVQyxJQUFWLENBQWVXLE1BQXRCO0FBQ0g7Ozs7QUFFRDs7OztvQ0FJc0JFLEssRUFBZTtBQUNqQyxlQUFPLEtBQUtkLElBQUwsQ0FBVUMsSUFBVixDQUFlYSxLQUFmLENBQVA7QUFDSDs7OztBQUVEOzs7O21DQUl3QkMsRyxFQUFnQjtBQUNwQyxlQUFPLEtBQUtmLElBQUwsQ0FBVWUsR0FBVixDQUFQO0FBQ0giLCJzb3VyY2VzQ29udGVudCI6WyIvKipcclxuICogQGNsYXNzIFR1cGxlRGljdGlvbmFyeVxyXG4gKiBAY29uc3RydWN0b3JcclxuICovXHJcbmV4cG9ydCBjbGFzcyBUdXBsZURpY3Rpb25hcnkge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogVGhlIGRhdGEgc3RvcmFnZVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZGF0YTogeyBrZXlzOiBzdHJpbmdbXSB9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yICgpIHtcclxuICAgICAgICB0aGlzLmRhdGEgPSB7IGtleXM6IFtdIH07XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWV0aG9kIGdldFxyXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBpXHJcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGpcclxuICAgICAqIEByZXR1cm4ge09iamVjdH1cclxuICAgICAqL1xyXG4gICAgcHVibGljIGdldDxUPiAoaTogbnVtYmVyLCBqOiBudW1iZXIpOiBUIHtcclxuICAgICAgICBpZiAoaSA+IGopIHtcclxuICAgICAgICAgICAgLy8gc3dhcFxyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGo7XHJcbiAgICAgICAgICAgIGogPSBpO1xyXG4gICAgICAgICAgICBpID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtpICsgJy0nICsgal07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1ldGhvZCBzZXRcclxuICAgICAqIEBwYXJhbSAge251bWJlcn0gaVxyXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBqXHJcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHVibGljIHNldDxUPiAoaTogbnVtYmVyLCBqOiBudW1iZXIsIHZhbHVlOiBUKTogVCB7XHJcblxyXG4gICAgICAgIGlmIChpID4gaikge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IGo7XHJcbiAgICAgICAgICAgIGogPSBpO1xyXG4gICAgICAgICAgICBpID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIGtleSA9IGkgKyAnLScgKyBqO1xyXG5cclxuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaWR4ID0gdGhpcy5kYXRhLmtleXMuaW5kZXhPZihrZXkpO1xyXG4gICAgICAgICAgICBpZiAoaWR4ICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEua2V5cy5zcGxpY2UoaWR4LCAxKTtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFba2V5IV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIGtleSBhbHJlYWR5IGV4aXN0c1xyXG4gICAgICAgIGlmICghdGhpcy5nZXQoaSwgaikpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLmtleXMucHVzaChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5kYXRhW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07XHJcbiAgICB9O1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1ldGhvZCByZXNldFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgcmVzZXQgKCkge1xyXG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxyXG4gICAgICAgICAgICBrZXlzID0gZGF0YS5rZXlzO1xyXG4gICAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XHJcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2tleSFdO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWV0aG9kIGdldExlbmd0aFxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0TGVuZ3RoICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhLmtleXMubGVuZ3RoO1xyXG4gICAgfTtcclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZXRob2QgZ2V0S2V5QnlJbmRleFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4XHJcbiAgICAgKi9cclxuICAgIHB1YmxpYyBnZXRLZXlCeUluZGV4IChpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5rZXlzW2luZGV4XTtcclxuICAgIH07XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWV0aG9kIGdldERhdGFCeUtleVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IEtleVxyXG4gICAgICovXHJcbiAgICBwdWJsaWMgZ2V0RGF0YUJ5S2V5PFQ+IChLZXk6IHN0cmluZyk6IFQge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbS2V5XTtcclxuICAgIH07XHJcblxyXG59Il19