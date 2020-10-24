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
    global.utils = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.equals = equals;
  _exports.approx = approx;
  _exports.clamp = clamp;
  _exports.clamp01 = clamp01;
  _exports.lerp = lerp;
  _exports.toRadian = toRadian;
  _exports.toDegree = toDegree;
  _exports.randomRange = randomRange;
  _exports.randomRangeInt = randomRangeInt;
  _exports.pseudoRandom = pseudoRandom;
  _exports.pseudoRandomRange = pseudoRandomRange;
  _exports.pseudoRandomRangeInt = pseudoRandomRangeInt;
  _exports.nextPow2 = nextPow2;
  _exports.repeat = repeat;
  _exports.pingPong = pingPong;
  _exports.inverseLerp = inverseLerp;
  _exports.absMaxComponent = absMaxComponent;
  _exports.absMax = absMax;
  _exports.random = _exports.EPSILON = void 0;

  /**
   * @category core/math
   */
  var _d2r = Math.PI / 180.0;

  var _r2d = 180.0 / Math.PI;

  var EPSILON = 0.000001;
  /**
   * @en Tests whether or not the arguments have approximately the same value, within an absolute<br/>
   * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less<br/>
   * than or equal to 1.0, and a relative tolerance is used for larger values)
   * @zh 在glMatrix的绝对或相对容差范围内，测试参数是否具有近似相同的值。<br/>
   * EPSILON(小于等于1.0的值采用绝对公差，大于1.0的值采用相对公差)
   * @param a The first number to test.
   * @param b The second number to test.
   * @return True if the numbers are approximately equal, false otherwise.
   */

  _exports.EPSILON = EPSILON;

  function equals(a, b) {
    return Math.abs(a - b) <= EPSILON * Math.max(1.0, Math.abs(a), Math.abs(b));
  }
  /**
   * @en Tests whether or not the arguments have approximately the same value by given maxDiff<br/>
   * @zh 通过给定的最大差异，测试参数是否具有近似相同的值。
   * @param a The first number to test.
   * @param b The second number to test.
   * @param maxDiff Maximum difference.
   * @return True if the numbers are approximately equal, false otherwise.
   */


  function approx(a, b, maxDiff) {
    maxDiff = maxDiff || EPSILON;
    return Math.abs(a - b) <= maxDiff;
  }
  /**
   * @en Clamps a value between a minimum float and maximum float value.<br/>
   * @zh 返回最小浮点数和最大浮点数之间的一个数值。可以使用 clamp 函数将不断变化的数值限制在范围内。
   * @param val
   * @param min
   * @param max
   */


  function clamp(val, min, max) {
    if (min > max) {
      var temp = min;
      min = max;
      max = temp;
    }

    return val < min ? min : val > max ? max : val;
  }
  /**
   * @en Clamps a value between 0 and 1.<br/>
   * @zh 将值限制在0和1之间。
   * @param val
   */


  function clamp01(val) {
    return val < 0 ? 0 : val > 1 ? 1 : val;
  }
  /**
   * @param from
   * @param to
   * @param ratio - The interpolation coefficient.
   */


  function lerp(from, to, ratio) {
    return from + (to - from) * ratio;
  }
  /**
   * @en Convert Degree To Radian<br/>
   * @zh 把角度换算成弧度。
   * @param {Number} a Angle in Degrees
   */


  function toRadian(a) {
    return a * _d2r;
  }
  /**
   * @en Convert Radian To Degree<br/>
   * @zh 把弧度换算成角度。
   * @param {Number} a Angle in Radian
   */


  function toDegree(a) {
    return a * _r2d;
  }
  /**
   * @method random
   */


  var random = Math.random;
  /**
   * @en Returns a floating-point random number between min (inclusive) and max (exclusive).<br/>
   * @zh 返回最小(包含)和最大(不包含)之间的浮点随机数。
   * @method randomRange
   * @param min
   * @param max
   * @return The random number.
   */

  _exports.random = random;

  function randomRange(min, max) {
    return Math.random() * (max - min) + min;
  }
  /**
   * @en Returns a random integer between min (inclusive) and max (exclusive).<br/>
   * @zh 返回最小(包含)和最大(不包含)之间的随机整数。
   * @param min
   * @param max
   * @return The random integer.
   */


  function randomRangeInt(min, max) {
    return Math.floor(randomRange(min, max));
  }
  /**
   * Linear congruential generator using Hull-Dobell Theorem.
   *
   * @param seed The random seed.
   * @return The pseudo random.
   */


  function pseudoRandom(seed) {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
  }
  /**
   * Returns a floating-point pseudo-random number between min (inclusive) and max (exclusive).
   *
   * @param seed
   * @param min
   * @param max
   * @return The random number.
   */


  function pseudoRandomRange(seed, min, max) {
    return pseudoRandom(seed) * (max - min) + min;
  }
  /**
   * @en Returns a pseudo-random integer between min (inclusive) and max (exclusive).<br/>
   * @zh 返回最小(包含)和最大(不包含)之间的浮点伪随机数。
   * @param seed
   * @param min
   * @param max
   * @return The random integer.
   */


  function pseudoRandomRangeInt(seed, min, max) {
    return Math.floor(pseudoRandomRange(seed, min, max));
  }
  /**
   * Returns the next power of two for the value.<br/>
   *
   * @param val
   * @return The the next power of two.
   */


  function nextPow2(val) {
    --val;
    val = val >> 1 | val;
    val = val >> 2 | val;
    val = val >> 4 | val;
    val = val >> 8 | val;
    val = val >> 16 | val;
    ++val;
    return val;
  }
  /**
   * @en Returns float remainder for t / length.<br/>
   * @zh 返回t / length的浮点余数。
   * @param t Time start at 0.
   * @param length Time of one cycle.
   * @return The Time wrapped in the first cycle.
   */


  function repeat(t, length) {
    return t - Math.floor(t / length) * length;
  }
  /**
   * Returns time wrapped in ping-pong mode.
   *
   * @param t Time start at 0.
   * @param length Time of one cycle.
   * @return The time wrapped in the first cycle.
   */


  function pingPong(t, length) {
    t = repeat(t, length * 2);
    t = length - Math.abs(t - length);
    return t;
  }
  /**
   * @en Returns ratio of a value within a given range.<br/>
   * @zh 返回给定范围内的值的比率。
   * @param from Start value.
   * @param to End value.
   * @param value Given value.
   * @return The ratio between [from, to].
   */


  function inverseLerp(from, to, value) {
    return (value - from) / (to - from);
  }
  /**
   * @zh 对所有分量的绝对值进行比较大小，返回绝对值最大的分量。
   * @param v 类 Vec3 结构
   * @returns 绝对值最大的分量
   */


  function absMaxComponent(v) {
    if (Math.abs(v.x) > Math.abs(v.y)) {
      if (Math.abs(v.x) > Math.abs(v.z)) {
        return v.x;
      } else {
        return v.z;
      }
    } else {
      if (Math.abs(v.y) > Math.abs(v.z)) {
        return v.y;
      } else {
        return v.z;
      }
    }
  }
  /**
   * @zh 对 a b 的绝对值进行比较大小，返回绝对值最大的值。
   * @param a number
   * @param b number
   */


  function absMax(a, b) {
    if (Math.abs(a) > Math.abs(b)) {
      return a;
    } else {
      return b;
    }
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvbWF0aC91dGlscy50cyJdLCJuYW1lcyI6WyJfZDJyIiwiTWF0aCIsIlBJIiwiX3IyZCIsIkVQU0lMT04iLCJlcXVhbHMiLCJhIiwiYiIsImFicyIsIm1heCIsImFwcHJveCIsIm1heERpZmYiLCJjbGFtcCIsInZhbCIsIm1pbiIsInRlbXAiLCJjbGFtcDAxIiwibGVycCIsImZyb20iLCJ0byIsInJhdGlvIiwidG9SYWRpYW4iLCJ0b0RlZ3JlZSIsInJhbmRvbSIsInJhbmRvbVJhbmdlIiwicmFuZG9tUmFuZ2VJbnQiLCJmbG9vciIsInBzZXVkb1JhbmRvbSIsInNlZWQiLCJwc2V1ZG9SYW5kb21SYW5nZSIsInBzZXVkb1JhbmRvbVJhbmdlSW50IiwibmV4dFBvdzIiLCJyZXBlYXQiLCJ0IiwibGVuZ3RoIiwicGluZ1BvbmciLCJpbnZlcnNlTGVycCIsInZhbHVlIiwiYWJzTWF4Q29tcG9uZW50IiwidiIsIngiLCJ5IiwieiIsImFic01heCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7O0FBTUEsTUFBTUEsSUFBSSxHQUFHQyxJQUFJLENBQUNDLEVBQUwsR0FBVSxLQUF2Qjs7QUFFQSxNQUFNQyxJQUFJLEdBQUcsUUFBUUYsSUFBSSxDQUFDQyxFQUExQjs7QUFFTyxNQUFNRSxPQUFPLEdBQUcsUUFBaEI7QUFFUDs7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNDLE1BQVQsQ0FBaUJDLENBQWpCLEVBQTRCQyxDQUE1QixFQUF1QztBQUMxQyxXQUFPTixJQUFJLENBQUNPLEdBQUwsQ0FBU0YsQ0FBQyxHQUFHQyxDQUFiLEtBQW1CSCxPQUFPLEdBQUdILElBQUksQ0FBQ1EsR0FBTCxDQUFTLEdBQVQsRUFBY1IsSUFBSSxDQUFDTyxHQUFMLENBQVNGLENBQVQsQ0FBZCxFQUEyQkwsSUFBSSxDQUFDTyxHQUFMLENBQVNELENBQVQsQ0FBM0IsQ0FB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QVgsQ0FBcEIsRUFBbUM7QUFDL0IsVUFBSXhDLElBQUksQ0FBQ08sR0FBTCxDQUFTK0IsQ0FBQyxDQUFDQyxDQUFYLElBQWdCdkMsSUFBSSxDQUFDTyxHQUFMLENBQVMrQixDQUFDLENBQUNHLENBQVgsQ0FBcEIsRUFBbUM7QUFDL0IsZUFBT0gsQ0FBQyxDQUFDQyxDQUFUO0FBQ0gsT0FGRCxNQUVPO0FBQ0gsZUFBT0QsQ0FBQyxDQUFDRyxDQUFUO0FBQ0g7QUFDSixLQU5ELE1BTU87QUFDSCxVQUFJekMsSUFBSSxDQUFDTyxHQUFMLENBQVMrQixDQUFDLENBQUNFLENBQVgsSUFBZ0J4QyxJQUFJLENBQUNPLEdBQUwsQ0FBUytCLENBQUMsQ0FBQ0csQ0FBWCxDQUFwQixFQUFtQztBQUMvQixlQUFPSCxDQUFDLENBQUNFLENBQVQ7QUFDSCxPQUZELE1BRU87QUFDSCxlQUFPRixDQUFDLENBQUNHLENBQVQ7QUFDSDtBQUNKO0FBQ0o7QUFFRDs7Ozs7OztBQUtPLFdBQVNDLE1BQVQsQ0FBaUJyQyxDQUFqQixFQUE0QkMsQ0FBNUIsRUFBdUM7QUFDMUMsUUFBSU4sSUFBSSxDQUFDTyxHQUFMLENBQVNGLENBQVQsSUFBY0wsSUFBSSxDQUFDTyxHQUFMLENBQVNELENBQVQsQ0FBbEIsRUFBK0I7QUFDM0IsYUFBT0QsQ0FBUDtBQUNILEtBRkQsTUFFTztBQUNILGFBQU9DLENBQVA7QUFDSDtBQUNKIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXHJcbiAqIEBjYXRlZ29yeSBjb3JlL21hdGhcclxuICovXHJcblxyXG5pbXBvcnQgeyBJVmVjM0xpa2UgfSBmcm9tIFwiLi90eXBlLWRlZmluZVwiO1xyXG5cclxuY29uc3QgX2QyciA9IE1hdGguUEkgLyAxODAuMDtcclxuXHJcbmNvbnN0IF9yMmQgPSAxODAuMCAvIE1hdGguUEk7XHJcblxyXG5leHBvcnQgY29uc3QgRVBTSUxPTiA9IDAuMDAwMDAxO1xyXG5cclxuLyoqXHJcbiAqIEBlbiBUZXN0cyB3aGV0aGVyIG9yIG5vdCB0aGUgYXJndW1lbnRzIGhhdmUgYXBwcm94aW1hdGVseSB0aGUgc2FtZSB2YWx1ZSwgd2l0aGluIGFuIGFic29sdXRlPGJyLz5cclxuICogb3IgcmVsYXRpdmUgdG9sZXJhbmNlIG9mIGdsTWF0cml4LkVQU0lMT04gKGFuIGFic29sdXRlIHRvbGVyYW5jZSBpcyB1c2VkIGZvciB2YWx1ZXMgbGVzczxici8+XHJcbiAqIHRoYW4gb3IgZXF1YWwgdG8gMS4wLCBhbmQgYSByZWxhdGl2ZSB0b2xlcmFuY2UgaXMgdXNlZCBmb3IgbGFyZ2VyIHZhbHVlcylcclxuICogQHpoIOWcqGdsTWF0cml455qE57ud5a+55oiW55u45a+55a655beu6IyD5Zu05YaF77yM5rWL6K+V5Y+C5pWw5piv5ZCm5YW35pyJ6L+R5Ly855u45ZCM55qE5YC844CCPGJyLz5cclxuICogRVBTSUxPTijlsI/kuo7nrYnkuo4xLjDnmoTlgLzph4fnlKjnu53lr7nlhazlt67vvIzlpKfkuo4xLjDnmoTlgLzph4fnlKjnm7jlr7nlhazlt64pXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBudW1iZXIgdG8gdGVzdC5cclxuICogQHBhcmFtIGIgVGhlIHNlY29uZCBudW1iZXIgdG8gdGVzdC5cclxuICogQHJldHVybiBUcnVlIGlmIHRoZSBudW1iZXJzIGFyZSBhcHByb3hpbWF0ZWx5IGVxdWFsLCBmYWxzZSBvdGhlcndpc2UuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxzIChhOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIE1hdGguYWJzKGEgLSBiKSA8PSBFUFNJTE9OICogTWF0aC5tYXgoMS4wLCBNYXRoLmFicyhhKSwgTWF0aC5hYnMoYikpO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFRlc3RzIHdoZXRoZXIgb3Igbm90IHRoZSBhcmd1bWVudHMgaGF2ZSBhcHByb3hpbWF0ZWx5IHRoZSBzYW1lIHZhbHVlIGJ5IGdpdmVuIG1heERpZmY8YnIvPlxyXG4gKiBAemgg6YCa6L+H57uZ5a6a55qE5pyA5aSn5beu5byC77yM5rWL6K+V5Y+C5pWw5piv5ZCm5YW35pyJ6L+R5Ly855u45ZCM55qE5YC844CCXHJcbiAqIEBwYXJhbSBhIFRoZSBmaXJzdCBudW1iZXIgdG8gdGVzdC5cclxuICogQHBhcmFtIGIgVGhlIHNlY29uZCBudW1iZXIgdG8gdGVzdC5cclxuICogQHBhcmFtIG1heERpZmYgTWF4aW11bSBkaWZmZXJlbmNlLlxyXG4gKiBAcmV0dXJuIFRydWUgaWYgdGhlIG51bWJlcnMgYXJlIGFwcHJveGltYXRlbHkgZXF1YWwsIGZhbHNlIG90aGVyd2lzZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHByb3ggKGE6IG51bWJlciwgYjogbnVtYmVyLCBtYXhEaWZmOiBudW1iZXIpIHtcclxuICAgIG1heERpZmYgPSBtYXhEaWZmIHx8IEVQU0lMT047XHJcbiAgICByZXR1cm4gTWF0aC5hYnMoYSAtIGIpIDw9IG1heERpZmY7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gQ2xhbXBzIGEgdmFsdWUgYmV0d2VlbiBhIG1pbmltdW0gZmxvYXQgYW5kIG1heGltdW0gZmxvYXQgdmFsdWUuPGJyLz5cclxuICogQHpoIOi/lOWbnuacgOWwj+a1rueCueaVsOWSjOacgOWkp+a1rueCueaVsOS5i+mXtOeahOS4gOS4quaVsOWAvOOAguWPr+S7peS9v+eUqCBjbGFtcCDlh73mlbDlsIbkuI3mlq3lj5jljJbnmoTmlbDlgLzpmZDliLblnKjojIPlm7TlhoXjgIJcclxuICogQHBhcmFtIHZhbFxyXG4gKiBAcGFyYW0gbWluXHJcbiAqIEBwYXJhbSBtYXhcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcCAodmFsOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgaWYgKG1pbiA+IG1heCkge1xyXG4gICAgICAgIGNvbnN0IHRlbXAgPSBtaW47XHJcbiAgICAgICAgbWluID0gbWF4O1xyXG4gICAgICAgIG1heCA9IHRlbXA7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbCA8IG1pbiA/IG1pbiA6IHZhbCA+IG1heCA/IG1heCA6IHZhbDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBDbGFtcHMgYSB2YWx1ZSBiZXR3ZWVuIDAgYW5kIDEuPGJyLz5cclxuICogQHpoIOWwhuWAvOmZkOWItuWcqDDlkowx5LmL6Ze044CCXHJcbiAqIEBwYXJhbSB2YWxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGFtcDAxICh2YWw6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHZhbCA8IDAgPyAwIDogdmFsID4gMSA/IDEgOiB2YWw7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAcGFyYW0gZnJvbVxyXG4gKiBAcGFyYW0gdG9cclxuICogQHBhcmFtIHJhdGlvIC0gVGhlIGludGVycG9sYXRpb24gY29lZmZpY2llbnQuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gbGVycCAoZnJvbTogbnVtYmVyLCB0bzogbnVtYmVyLCByYXRpbzogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gZnJvbSArICh0byAtIGZyb20pICogcmF0aW87XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gQ29udmVydCBEZWdyZWUgVG8gUmFkaWFuPGJyLz5cclxuICogQHpoIOaKiuinkuW6puaNoueul+aIkOW8p+W6puOAglxyXG4gKiBAcGFyYW0ge051bWJlcn0gYSBBbmdsZSBpbiBEZWdyZWVzXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9SYWRpYW4gKGE6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGEgKiBfZDJyO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIENvbnZlcnQgUmFkaWFuIFRvIERlZ3JlZTxici8+XHJcbiAqIEB6aCDmiorlvKfluqbmjaLnrpfmiJDop5LluqbjgIJcclxuICogQHBhcmFtIHtOdW1iZXJ9IGEgQW5nbGUgaW4gUmFkaWFuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdG9EZWdyZWUgKGE6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIGEgKiBfcjJkO1xyXG59XHJcblxyXG4vKipcclxuICogQG1ldGhvZCByYW5kb21cclxuICovXHJcbmV4cG9ydCBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbTtcclxuXHJcbi8qKlxyXG4gKiBAZW4gUmV0dXJucyBhIGZsb2F0aW5nLXBvaW50IHJhbmRvbSBudW1iZXIgYmV0d2VlbiBtaW4gKGluY2x1c2l2ZSkgYW5kIG1heCAoZXhjbHVzaXZlKS48YnIvPlxyXG4gKiBAemgg6L+U5Zue5pyA5bCPKOWMheWQqynlkozmnIDlpKco5LiN5YyF5ZCrKeS5i+mXtOeahOa1rueCuemaj+acuuaVsOOAglxyXG4gKiBAbWV0aG9kIHJhbmRvbVJhbmdlXHJcbiAqIEBwYXJhbSBtaW5cclxuICogQHBhcmFtIG1heFxyXG4gKiBAcmV0dXJuIFRoZSByYW5kb20gbnVtYmVyLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVJhbmdlIChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAZW4gUmV0dXJucyBhIHJhbmRvbSBpbnRlZ2VyIGJldHdlZW4gbWluIChpbmNsdXNpdmUpIGFuZCBtYXggKGV4Y2x1c2l2ZSkuPGJyLz5cclxuICogQHpoIOi/lOWbnuacgOWwjyjljIXlkKsp5ZKM5pyA5aSnKOS4jeWMheWQqynkuYvpl7TnmoTpmo/mnLrmlbTmlbDjgIJcclxuICogQHBhcmFtIG1pblxyXG4gKiBAcGFyYW0gbWF4XHJcbiAqIEByZXR1cm4gVGhlIHJhbmRvbSBpbnRlZ2VyLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVJhbmdlSW50IChtaW46IG51bWJlciwgbWF4OiBudW1iZXIpIHtcclxuICAgIHJldHVybiBNYXRoLmZsb29yKHJhbmRvbVJhbmdlKG1pbiwgbWF4KSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBMaW5lYXIgY29uZ3J1ZW50aWFsIGdlbmVyYXRvciB1c2luZyBIdWxsLURvYmVsbCBUaGVvcmVtLlxyXG4gKlxyXG4gKiBAcGFyYW0gc2VlZCBUaGUgcmFuZG9tIHNlZWQuXHJcbiAqIEByZXR1cm4gVGhlIHBzZXVkbyByYW5kb20uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHNldWRvUmFuZG9tIChzZWVkOiBudW1iZXIpIHtcclxuICAgIHNlZWQgPSAoc2VlZCAqIDkzMDEgKyA0OTI5NykgJSAyMzMyODA7XHJcbiAgICByZXR1cm4gc2VlZCAvIDIzMzI4MC4wO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyBhIGZsb2F0aW5nLXBvaW50IHBzZXVkby1yYW5kb20gbnVtYmVyIGJldHdlZW4gbWluIChpbmNsdXNpdmUpIGFuZCBtYXggKGV4Y2x1c2l2ZSkuXHJcbiAqXHJcbiAqIEBwYXJhbSBzZWVkXHJcbiAqIEBwYXJhbSBtaW5cclxuICogQHBhcmFtIG1heFxyXG4gKiBAcmV0dXJuIFRoZSByYW5kb20gbnVtYmVyLlxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHBzZXVkb1JhbmRvbVJhbmdlIChzZWVkOiBudW1iZXIsIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHBzZXVkb1JhbmRvbShzZWVkKSAqIChtYXggLSBtaW4pICsgbWluO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFJldHVybnMgYSBwc2V1ZG8tcmFuZG9tIGludGVnZXIgYmV0d2VlbiBtaW4gKGluY2x1c2l2ZSkgYW5kIG1heCAoZXhjbHVzaXZlKS48YnIvPlxyXG4gKiBAemgg6L+U5Zue5pyA5bCPKOWMheWQqynlkozmnIDlpKco5LiN5YyF5ZCrKeS5i+mXtOeahOa1rueCueS8qumaj+acuuaVsOOAglxyXG4gKiBAcGFyYW0gc2VlZFxyXG4gKiBAcGFyYW0gbWluXHJcbiAqIEBwYXJhbSBtYXhcclxuICogQHJldHVybiBUaGUgcmFuZG9tIGludGVnZXIuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcHNldWRvUmFuZG9tUmFuZ2VJbnQgKHNlZWQ6IG51bWJlciwgbWluOiBudW1iZXIsIG1heDogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gTWF0aC5mbG9vcihwc2V1ZG9SYW5kb21SYW5nZShzZWVkLCBtaW4sIG1heCkpO1xyXG59XHJcblxyXG4vKipcclxuICogUmV0dXJucyB0aGUgbmV4dCBwb3dlciBvZiB0d28gZm9yIHRoZSB2YWx1ZS48YnIvPlxyXG4gKlxyXG4gKiBAcGFyYW0gdmFsXHJcbiAqIEByZXR1cm4gVGhlIHRoZSBuZXh0IHBvd2VyIG9mIHR3by5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBuZXh0UG93MiAodmFsOiBudW1iZXIpIHtcclxuICAgIC0tdmFsO1xyXG4gICAgdmFsID0gKHZhbCA+PiAxKSB8IHZhbDtcclxuICAgIHZhbCA9ICh2YWwgPj4gMikgfCB2YWw7XHJcbiAgICB2YWwgPSAodmFsID4+IDQpIHwgdmFsO1xyXG4gICAgdmFsID0gKHZhbCA+PiA4KSB8IHZhbDtcclxuICAgIHZhbCA9ICh2YWwgPj4gMTYpIHwgdmFsO1xyXG4gICAgKyt2YWw7XHJcbiAgICByZXR1cm4gdmFsO1xyXG59XHJcblxyXG4vKipcclxuICogQGVuIFJldHVybnMgZmxvYXQgcmVtYWluZGVyIGZvciB0IC8gbGVuZ3RoLjxici8+XHJcbiAqIEB6aCDov5Tlm550IC8gbGVuZ3Ro55qE5rWu54K55L2Z5pWw44CCXHJcbiAqIEBwYXJhbSB0IFRpbWUgc3RhcnQgYXQgMC5cclxuICogQHBhcmFtIGxlbmd0aCBUaW1lIG9mIG9uZSBjeWNsZS5cclxuICogQHJldHVybiBUaGUgVGltZSB3cmFwcGVkIGluIHRoZSBmaXJzdCBjeWNsZS5cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQgKHQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0IC0gTWF0aC5mbG9vcih0IC8gbGVuZ3RoKSAqIGxlbmd0aDtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgdGltZSB3cmFwcGVkIGluIHBpbmctcG9uZyBtb2RlLlxyXG4gKlxyXG4gKiBAcGFyYW0gdCBUaW1lIHN0YXJ0IGF0IDAuXHJcbiAqIEBwYXJhbSBsZW5ndGggVGltZSBvZiBvbmUgY3ljbGUuXHJcbiAqIEByZXR1cm4gVGhlIHRpbWUgd3JhcHBlZCBpbiB0aGUgZmlyc3QgY3ljbGUuXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcGluZ1BvbmcgKHQ6IG51bWJlciwgbGVuZ3RoOiBudW1iZXIpIHtcclxuICAgIHQgPSByZXBlYXQodCwgbGVuZ3RoICogMik7XHJcbiAgICB0ID0gbGVuZ3RoIC0gTWF0aC5hYnModCAtIGxlbmd0aCk7XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEBlbiBSZXR1cm5zIHJhdGlvIG9mIGEgdmFsdWUgd2l0aGluIGEgZ2l2ZW4gcmFuZ2UuPGJyLz5cclxuICogQHpoIOi/lOWbnue7meWumuiMg+WbtOWGheeahOWAvOeahOavlOeOh+OAglxyXG4gKiBAcGFyYW0gZnJvbSBTdGFydCB2YWx1ZS5cclxuICogQHBhcmFtIHRvIEVuZCB2YWx1ZS5cclxuICogQHBhcmFtIHZhbHVlIEdpdmVuIHZhbHVlLlxyXG4gKiBAcmV0dXJuIFRoZSByYXRpbyBiZXR3ZWVuIFtmcm9tLCB0b10uXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gaW52ZXJzZUxlcnAgKGZyb206IG51bWJlciwgdG86IG51bWJlciwgdmFsdWU6IG51bWJlcikge1xyXG4gICAgcmV0dXJuICh2YWx1ZSAtIGZyb20pIC8gKHRvIC0gZnJvbSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemgg5a+55omA5pyJ5YiG6YeP55qE57ud5a+55YC86L+b6KGM5q+U6L6D5aSn5bCP77yM6L+U5Zue57ud5a+55YC85pyA5aSn55qE5YiG6YeP44CCXHJcbiAqIEBwYXJhbSB2IOexuyBWZWMzIOe7k+aehFxyXG4gKiBAcmV0dXJucyDnu53lr7nlgLzmnIDlpKfnmoTliIbph49cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhYnNNYXhDb21wb25lbnQgKHY6IElWZWMzTGlrZSkge1xyXG4gICAgaWYgKE1hdGguYWJzKHYueCkgPiBNYXRoLmFicyh2LnkpKSB7XHJcbiAgICAgICAgaWYgKE1hdGguYWJzKHYueCkgPiBNYXRoLmFicyh2LnopKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2Lng7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHYuejtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChNYXRoLmFicyh2LnkpID4gTWF0aC5hYnModi56KSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdi55O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB2Lno7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogQHpoIOWvuSBhIGIg55qE57ud5a+55YC86L+b6KGM5q+U6L6D5aSn5bCP77yM6L+U5Zue57ud5a+55YC85pyA5aSn55qE5YC844CCXHJcbiAqIEBwYXJhbSBhIG51bWJlclxyXG4gKiBAcGFyYW0gYiBudW1iZXJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBhYnNNYXggKGE6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgICBpZiAoTWF0aC5hYnMoYSkgPiBNYXRoLmFicyhiKSkge1xyXG4gICAgICAgIHJldHVybiBhO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gYjtcclxuICAgIH1cclxufSJdfQ==