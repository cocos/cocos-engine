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
    global.binarySearch = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.binarySearchEpsilon = binarySearchEpsilon;
  var EPSILON = 1e-6;

  function binarySearchEpsilon(array, value) {
    var low = 0;
    var high = array.length - 1;
    var middle = high >>> 1;

    for (; low <= high; middle = low + high >>> 1) {
      var middleValue = array[middle];

      if (middleValue > value + EPSILON) {
        high = middle - 1;
      } else if (middleValue < value - EPSILON) {
        low = middle + 1;
      } else {
        return middle;
      }
    }

    return ~low;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvZGF0YS91dGlscy9iaW5hcnktc2VhcmNoLnRzIl0sIm5hbWVzIjpbIkVQU0lMT04iLCJiaW5hcnlTZWFyY2hFcHNpbG9uIiwiYXJyYXkiLCJ2YWx1ZSIsImxvdyIsImhpZ2giLCJsZW5ndGgiLCJtaWRkbGUiLCJtaWRkbGVWYWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU1BLE9BQU8sR0FBRyxJQUFoQjs7QUFFTyxXQUFTQyxtQkFBVCxDQUE4QkMsS0FBOUIsRUFBK0NDLEtBQS9DLEVBQThEO0FBQ2pFLFFBQUlDLEdBQUcsR0FBRyxDQUFWO0FBQ0EsUUFBSUMsSUFBSSxHQUFHSCxLQUFLLENBQUNJLE1BQU4sR0FBZSxDQUExQjtBQUNBLFFBQUlDLE1BQU0sR0FBR0YsSUFBSSxLQUFLLENBQXRCOztBQUNBLFdBQU9ELEdBQUcsSUFBSUMsSUFBZCxFQUFvQkUsTUFBTSxHQUFJSCxHQUFHLEdBQUdDLElBQVAsS0FBaUIsQ0FBOUMsRUFBaUQ7QUFDN0MsVUFBTUcsV0FBVyxHQUFHTixLQUFLLENBQUNLLE1BQUQsQ0FBekI7O0FBQ0EsVUFBSUMsV0FBVyxHQUFJTCxLQUFLLEdBQUdILE9BQTNCLEVBQXFDO0FBQ2pDSyxRQUFBQSxJQUFJLEdBQUdFLE1BQU0sR0FBRyxDQUFoQjtBQUNILE9BRkQsTUFFTyxJQUFJQyxXQUFXLEdBQUlMLEtBQUssR0FBR0gsT0FBM0IsRUFBcUM7QUFDeENJLFFBQUFBLEdBQUcsR0FBR0csTUFBTSxHQUFHLENBQWY7QUFDSCxPQUZNLE1BRUE7QUFDSCxlQUFPQSxNQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLENBQUNILEdBQVI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIlxyXG5jb25zdCBFUFNJTE9OID0gMWUtNjtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBiaW5hcnlTZWFyY2hFcHNpbG9uIChhcnJheTogbnVtYmVyW10sIHZhbHVlOiBudW1iZXIpIHtcclxuICAgIGxldCBsb3cgPSAwO1xyXG4gICAgbGV0IGhpZ2ggPSBhcnJheS5sZW5ndGggLSAxO1xyXG4gICAgbGV0IG1pZGRsZSA9IGhpZ2ggPj4+IDE7XHJcbiAgICBmb3IgKDsgbG93IDw9IGhpZ2g7IG1pZGRsZSA9IChsb3cgKyBoaWdoKSA+Pj4gMSkge1xyXG4gICAgICAgIGNvbnN0IG1pZGRsZVZhbHVlID0gYXJyYXlbbWlkZGxlXTtcclxuICAgICAgICBpZiAobWlkZGxlVmFsdWUgPiAodmFsdWUgKyBFUFNJTE9OKSkge1xyXG4gICAgICAgICAgICBoaWdoID0gbWlkZGxlIC0gMTtcclxuICAgICAgICB9IGVsc2UgaWYgKG1pZGRsZVZhbHVlIDwgKHZhbHVlIC0gRVBTSUxPTikpIHtcclxuICAgICAgICAgICAgbG93ID0gbWlkZGxlICsgMTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gbWlkZGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB+bG93O1xyXG59XHJcbiJdfQ==