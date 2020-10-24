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
  _exports.default = binarySearchEpsilon;

  /*
   Copyright (c) 2013-2016 Chukong Technologies Inc.
   Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
  
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
  // tslint:disable
  var EPSILON = 1e-6;
  /**
   * Searches the entire sorted Array for an element and returns the index of the element.
   *
   * @method binarySearch
   * @param {number[]} array
   * @param {number} value
   * @return {number} The index of item in the sorted Array, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of array's length.
   */
  // function binarySearch (array, value) {
  //     for (var l = 0, h = array.length - 1, m = h >>> 1;
  //          l <= h;
  //          m = (l + h) >>> 1
  //     ) {
  //         var test = array[m];
  //         if (test > value) {
  //             h = m - 1;
  //         }
  //         else if (test < value) {
  //             l = m + 1;
  //         }
  //         else {
  //             return m;
  //         }
  //     }
  //     return ~l;
  // }

  /**
   * Searches the entire sorted Array for an element and returns the index of the element.
   * It accepts iteratee which is invoked for value and each element of array to compute their sort ranking.
   * The iteratee is invoked with one argument: (value).
   *
   * @method binarySearchBy
   * @param {number[]} array
   * @param {number} value
   * @param {function} iteratee - the iteratee invoked per element
   * @return {number} The index of item in the sorted Array, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of array's length.
   */
  // function binarySearchBy (array, value, iteratee) {
  //     for (var l = 0, h = array.length - 1, m = h >>> 1;
  //          l <= h;
  //          m = (l + h) >>> 1
  //     ) {
  //         var test = iteratee(array[m]);
  //         if (test > value) {
  //             h = m - 1;
  //         }
  //         else if (test < value) {
  //             l = m + 1;
  //         }
  //         else {
  //             return m;
  //         }
  //     }
  //     return ~l;
  // }

  function binarySearchEpsilon(array, value) {
    var l = 0;

    for (var h = array.length - 1, m = h >>> 1; l <= h; m = l + h >>> 1) {
      var test = array[m];

      if (test > value + EPSILON) {
        h = m - 1;
      } else if (test < value - EPSILON) {
        l = m + 1;
      } else {
        return m;
      }
    }

    return ~l;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvYmluYXJ5LXNlYXJjaC50cyJdLCJuYW1lcyI6WyJFUFNJTE9OIiwiYmluYXJ5U2VhcmNoRXBzaWxvbiIsImFycmF5IiwidmFsdWUiLCJsIiwiaCIsImxlbmd0aCIsIm0iLCJ0ZXN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBO0FBRUEsTUFBTUEsT0FBTyxHQUFHLElBQWhCO0FBRUE7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFZSxXQUFTQyxtQkFBVCxDQUE4QkMsS0FBOUIsRUFBcUNDLEtBQXJDLEVBQTRDO0FBQ3ZELFFBQUlDLENBQUMsR0FBRyxDQUFSOztBQUNBLFNBQUssSUFBSUMsQ0FBQyxHQUFHSCxLQUFLLENBQUNJLE1BQU4sR0FBZSxDQUF2QixFQUEwQkMsQ0FBQyxHQUFHRixDQUFDLEtBQUssQ0FBekMsRUFDSUQsQ0FBQyxJQUFJQyxDQURULEVBRUlFLENBQUMsR0FBSUgsQ0FBQyxHQUFHQyxDQUFMLEtBQVksQ0FGcEIsRUFHRTtBQUNFLFVBQU1HLElBQUksR0FBR04sS0FBSyxDQUFDSyxDQUFELENBQWxCOztBQUNBLFVBQUlDLElBQUksR0FBR0wsS0FBSyxHQUFHSCxPQUFuQixFQUE0QjtBQUN4QkssUUFBQUEsQ0FBQyxHQUFHRSxDQUFDLEdBQUcsQ0FBUjtBQUNILE9BRkQsTUFHSyxJQUFJQyxJQUFJLEdBQUdMLEtBQUssR0FBR0gsT0FBbkIsRUFBNEI7QUFDN0JJLFFBQUFBLENBQUMsR0FBR0csQ0FBQyxHQUFHLENBQVI7QUFDSCxPQUZJLE1BR0E7QUFDRCxlQUFPQSxDQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLENBQUNILENBQVI7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNiBDaHVrb25nIFRlY2hub2xvZ2llcyBJbmMuXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTctMjAxOCBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC5cclxuXHJcbiBodHRwOi8vd3d3LmNvY29zLmNvbVxyXG5cclxuIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcclxuIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZW5naW5lIHNvdXJjZSBjb2RlICh0aGUgXCJTb2Z0d2FyZVwiKSwgYSBsaW1pdGVkLFxyXG4gd29ybGR3aWRlLCByb3lhbHR5LWZyZWUsIG5vbi1hc3NpZ25hYmxlLCByZXZvY2FibGUgYW5kIG5vbi1leGNsdXNpdmUgbGljZW5zZVxyXG4gdG8gdXNlIENvY29zIENyZWF0b3Igc29sZWx5IHRvIGRldmVsb3AgZ2FtZXMgb24geW91ciB0YXJnZXQgcGxhdGZvcm1zLiBZb3Ugc2hhbGxcclxuIG5vdCB1c2UgQ29jb3MgQ3JlYXRvciBzb2Z0d2FyZSBmb3IgZGV2ZWxvcGluZyBvdGhlciBzb2Z0d2FyZSBvciB0b29scyB0aGF0J3NcclxuIHVzZWQgZm9yIGRldmVsb3BpbmcgZ2FtZXMuIFlvdSBhcmUgbm90IGdyYW50ZWQgdG8gcHVibGlzaCwgZGlzdHJpYnV0ZSxcclxuIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiBDb2NvcyBDcmVhdG9yLlxyXG5cclxuIFRoZSBzb2Z0d2FyZSBvciB0b29scyBpbiB0aGlzIExpY2Vuc2UgQWdyZWVtZW50IGFyZSBsaWNlbnNlZCwgbm90IHNvbGQuXHJcbiBYaWFtZW4gWWFqaSBTb2Z0d2FyZSBDby4sIEx0ZC4gcmVzZXJ2ZXMgYWxsIHJpZ2h0cyBub3QgZXhwcmVzc2x5IGdyYW50ZWQgdG8geW91LlxyXG5cclxuIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcclxuIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxyXG4gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXHJcbiBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXHJcbiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxyXG4gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxyXG4gVEhFIFNPRlRXQVJFLlxyXG4qL1xyXG5cclxuLy8gdHNsaW50OmRpc2FibGVcclxuXHJcbmNvbnN0IEVQU0lMT04gPSAxZS02O1xyXG5cclxuLyoqXHJcbiAqIFNlYXJjaGVzIHRoZSBlbnRpcmUgc29ydGVkIEFycmF5IGZvciBhbiBlbGVtZW50IGFuZCByZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgZWxlbWVudC5cclxuICpcclxuICogQG1ldGhvZCBiaW5hcnlTZWFyY2hcclxuICogQHBhcmFtIHtudW1iZXJbXX0gYXJyYXlcclxuICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIGl0ZW0gaW4gdGhlIHNvcnRlZCBBcnJheSwgaWYgaXRlbSBpcyBmb3VuZDsgb3RoZXJ3aXNlLCBhIG5lZ2F0aXZlIG51bWJlciB0aGF0IGlzIHRoZSBiaXR3aXNlIGNvbXBsZW1lbnQgb2YgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBsYXJnZXIgdGhhbiBpdGVtIG9yLCBpZiB0aGVyZSBpcyBubyBsYXJnZXIgZWxlbWVudCwgdGhlIGJpdHdpc2UgY29tcGxlbWVudCBvZiBhcnJheSdzIGxlbmd0aC5cclxuICovXHJcbi8vIGZ1bmN0aW9uIGJpbmFyeVNlYXJjaCAoYXJyYXksIHZhbHVlKSB7XHJcbi8vICAgICBmb3IgKHZhciBsID0gMCwgaCA9IGFycmF5Lmxlbmd0aCAtIDEsIG0gPSBoID4+PiAxO1xyXG4vLyAgICAgICAgICBsIDw9IGg7XHJcbi8vICAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXHJcbi8vICAgICApIHtcclxuLy8gICAgICAgICB2YXIgdGVzdCA9IGFycmF5W21dO1xyXG4vLyAgICAgICAgIGlmICh0ZXN0ID4gdmFsdWUpIHtcclxuLy8gICAgICAgICAgICAgaCA9IG0gLSAxO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIGlmICh0ZXN0IDwgdmFsdWUpIHtcclxuLy8gICAgICAgICAgICAgbCA9IG0gKyAxO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBlbHNlIHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIG07XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgfVxyXG4vLyAgICAgcmV0dXJuIH5sO1xyXG4vLyB9XHJcblxyXG4vKipcclxuICogU2VhcmNoZXMgdGhlIGVudGlyZSBzb3J0ZWQgQXJyYXkgZm9yIGFuIGVsZW1lbnQgYW5kIHJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBlbGVtZW50LlxyXG4gKiBJdCBhY2NlcHRzIGl0ZXJhdGVlIHdoaWNoIGlzIGludm9rZWQgZm9yIHZhbHVlIGFuZCBlYWNoIGVsZW1lbnQgb2YgYXJyYXkgdG8gY29tcHV0ZSB0aGVpciBzb3J0IHJhbmtpbmcuXHJcbiAqIFRoZSBpdGVyYXRlZSBpcyBpbnZva2VkIHdpdGggb25lIGFyZ3VtZW50OiAodmFsdWUpLlxyXG4gKlxyXG4gKiBAbWV0aG9kIGJpbmFyeVNlYXJjaEJ5XHJcbiAqIEBwYXJhbSB7bnVtYmVyW119IGFycmF5XHJcbiAqIEBwYXJhbSB7bnVtYmVyfSB2YWx1ZVxyXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBpdGVyYXRlZSAtIHRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50XHJcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGluZGV4IG9mIGl0ZW0gaW4gdGhlIHNvcnRlZCBBcnJheSwgaWYgaXRlbSBpcyBmb3VuZDsgb3RoZXJ3aXNlLCBhIG5lZ2F0aXZlIG51bWJlciB0aGF0IGlzIHRoZSBiaXR3aXNlIGNvbXBsZW1lbnQgb2YgdGhlIGluZGV4IG9mIHRoZSBuZXh0IGVsZW1lbnQgdGhhdCBpcyBsYXJnZXIgdGhhbiBpdGVtIG9yLCBpZiB0aGVyZSBpcyBubyBsYXJnZXIgZWxlbWVudCwgdGhlIGJpdHdpc2UgY29tcGxlbWVudCBvZiBhcnJheSdzIGxlbmd0aC5cclxuICovXHJcbi8vIGZ1bmN0aW9uIGJpbmFyeVNlYXJjaEJ5IChhcnJheSwgdmFsdWUsIGl0ZXJhdGVlKSB7XHJcbi8vICAgICBmb3IgKHZhciBsID0gMCwgaCA9IGFycmF5Lmxlbmd0aCAtIDEsIG0gPSBoID4+PiAxO1xyXG4vLyAgICAgICAgICBsIDw9IGg7XHJcbi8vICAgICAgICAgIG0gPSAobCArIGgpID4+PiAxXHJcbi8vICAgICApIHtcclxuLy8gICAgICAgICB2YXIgdGVzdCA9IGl0ZXJhdGVlKGFycmF5W21dKTtcclxuLy8gICAgICAgICBpZiAodGVzdCA+IHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgIGggPSBtIC0gMTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSBpZiAodGVzdCA8IHZhbHVlKSB7XHJcbi8vICAgICAgICAgICAgIGwgPSBtICsgMTtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgZWxzZSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBtO1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgIH1cclxuLy8gICAgIHJldHVybiB+bDtcclxuLy8gfVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYmluYXJ5U2VhcmNoRXBzaWxvbiAoYXJyYXksIHZhbHVlKSB7XHJcbiAgICBsZXQgbCA9IDA7XHJcbiAgICBmb3IgKGxldCBoID0gYXJyYXkubGVuZ3RoIC0gMSwgbSA9IGggPj4+IDE7XHJcbiAgICAgICAgbCA8PSBoO1xyXG4gICAgICAgIG0gPSAobCArIGgpID4+PiAxXHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCB0ZXN0ID0gYXJyYXlbbV07XHJcbiAgICAgICAgaWYgKHRlc3QgPiB2YWx1ZSArIEVQU0lMT04pIHtcclxuICAgICAgICAgICAgaCA9IG0gLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0ZXN0IDwgdmFsdWUgLSBFUFNJTE9OKSB7XHJcbiAgICAgICAgICAgIGwgPSBtICsgMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBtO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB+bDtcclxufVxyXG4iXX0=