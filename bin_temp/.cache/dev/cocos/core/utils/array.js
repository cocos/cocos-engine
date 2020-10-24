(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "../platform/debug.js", "./mutable-forward-iterator.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("../platform/debug.js"), require("./mutable-forward-iterator.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.debug, global.mutableForwardIterator);
    global.array = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _debug, _mutableForwardIterator) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.removeAt = removeAt;
  _exports.fastRemoveAt = fastRemoveAt;
  _exports.remove = remove;
  _exports.fastRemove = fastRemove;
  _exports.removeIf = removeIf;
  _exports.verifyType = verifyType;
  _exports.removeArray = removeArray;
  _exports.appendObjectsAt = appendObjectsAt;
  _exports.contains = contains;
  _exports.copy = copy;
  Object.defineProperty(_exports, "MutableForwardIterator", {
    enumerable: true,
    get: function () {
      return _mutableForwardIterator.default;
    }
  });
  _mutableForwardIterator = _interopRequireDefault(_mutableForwardIterator);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

  function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

  function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

  function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

  function _createForOfIteratorHelper(o) { if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (o = _unsupportedIterableToArray(o))) { var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var it, normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

  /**
   * @zh
   * 移除指定索引的数组元素。
   * @en
   * Removes the array item at the specified index.
   * @param array 数组。
   * @param index 待移除元素的索引。
   */
  function removeAt(array, index) {
    array.splice(index, 1);
  }
  /**
   * @zh
   * 移除指定索引的数组元素。
   * 此函数十分高效，但会改变数组的元素次序。
   * @en
   * Removes the array item at the specified index.
   * It's faster but the order of the array will be changed.
   * @param array 数组。
   * @param index 待移除元素的索引。
   */


  function fastRemoveAt(array, index) {
    var length = array.length;

    if (index < 0 || index >= length) {
      return;
    }

    array[index] = array[length - 1];
    array.length = length - 1;
  }
  /**
   * @zh
   * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
   * @en
   * Removes the first occurrence of a specific object from the array.
   * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
   * @param array 数组。
   * @param value 待移除元素。
   */


  function remove(array, value) {
    var index = array.indexOf(value);

    if (index >= 0) {
      removeAt(array, index);
      return true;
    } else {
      return false;
    }
  }
  /**
   * @zh
   * 移除首个指定的数组元素。判定元素相等时相当于于使用了 `Array.prototype.indexOf`。
   * 此函数十分高效，但会改变数组的元素次序。
   * @en
   * Removes the first occurrence of a specific object from the array.
   * Decision of the equality of elements is similar to `Array.prototype.indexOf`.
   * It's faster but the order of the array will be changed.
   * @param array 数组。
   * @param value 待移除元素。
   */


  function fastRemove(array, value) {
    var index = array.indexOf(value);

    if (index >= 0) {
      array[index] = array[array.length - 1];
      --array.length;
    }
  }
  /**
   * @zh
   * 移除首个使谓词满足的数组元素。
   * @en
   * Removes the first occurrence of a specific object from the array where `predicate` is `true`.
   * @param array 数组。
   * @param predicate 谓词。
   */


  function removeIf(array, predicate) {
    var index = array.findIndex(predicate);

    if (index >= 0) {
      var _value = array[index];
      removeAt(array, index);
      return _value;
    }
  }
  /**
   * @zh
   * 验证数组的类型。
   * 此函数将用 `instanceof` 操作符验证每一个元素。
   * @en
   * Verify array's Type.
   * This function tests each element using `instanceof` operator.
   * @param array 数组。
   * @param type 类型。
   * @returns 当每一个元素都是指定类型时返回 `true`，否则返回 `false`。
   */


  function verifyType(array, type) {
    if (array && array.length > 0) {
      var _iterator = _createForOfIteratorHelper(array),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          if (!(item instanceof type)) {
            (0, _debug.logID)(1300);
            return false;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return true;
  }
  /**
   * @zh
   * 移除多个数组元素。
   * @en
   * Removes multiple array elements.
   * @param array 源数组。
   * @param removals 所有待移除的元素。此数组的每个元素所对应的首个源数组的元素都会被移除。
   */


  function removeArray(array, removals) {
    for (var i = 0, l = removals.length; i < l; i++) {
      remove(array, removals[i]);
    }
  }
  /**
   * @zh
   * 在数组的指定索引上插入对象。
   * @en
   * Inserts some objects at specified index.
   * @param array 数组。
   * @param objects 插入的所有对象。
   * @param index 插入的索引。
   * @returns `array`。
   */


  function appendObjectsAt(array, objects, index) {
    array.splice.apply(array, [index, 0].concat(_toConsumableArray(objects)));
    return array;
  }
  /**
   * @zh
   * 返回数组是否包含指定的元素。
   * @en
   * Determines whether the array contains a specific element.
   * @returns 返回数组是否包含指定的元素。
   */


  function contains(array, value) {
    // eslint-disable-next-line @typescript-eslint/prefer-includes
    return array.indexOf(value) >= 0;
  }
  /**
   * @zh
   * 拷贝数组。
   * @en
   * Copy an array.
   * @param 源数组。
   * @returns 数组的副本。
   */


  function copy(array) {
    var len = array.length;
    var cloned = new Array(len);

    for (var i = 0; i < len; i += 1) {
      cloned[i] = array[i];
    }

    return cloned;
  }
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImU6L2QwMDQ1MjUyMC9HaXRodWIvZW5naW5lL2NvY29zL2NvcmUvdXRpbHMvYXJyYXkudHMiXSwibmFtZXMiOlsicmVtb3ZlQXQiLCJhcnJheSIsImluZGV4Iiwic3BsaWNlIiwiZmFzdFJlbW92ZUF0IiwibGVuZ3RoIiwicmVtb3ZlIiwidmFsdWUiLCJpbmRleE9mIiwiZmFzdFJlbW92ZSIsInJlbW92ZUlmIiwicHJlZGljYXRlIiwiZmluZEluZGV4IiwidmVyaWZ5VHlwZSIsInR5cGUiLCJpdGVtIiwicmVtb3ZlQXJyYXkiLCJyZW1vdmFscyIsImkiLCJsIiwiYXBwZW5kT2JqZWN0c0F0Iiwib2JqZWN0cyIsImFwcGx5IiwiY29udGFpbnMiLCJjb3B5IiwibGVuIiwiY2xvbmVkIiwiQXJyYXkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUE2QkE7Ozs7Ozs7O0FBUU8sV0FBU0EsUUFBVCxDQUFzQkMsS0FBdEIsRUFBa0NDLEtBQWxDLEVBQWlEO0FBQ3BERCxJQUFBQSxLQUFLLENBQUNFLE1BQU4sQ0FBYUQsS0FBYixFQUFvQixDQUFwQjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7OztBQVVPLFdBQVNFLFlBQVQsQ0FBMEJILEtBQTFCLEVBQXNDQyxLQUF0QyxFQUFxRDtBQUN4RCxRQUFNRyxNQUFNLEdBQUdKLEtBQUssQ0FBQ0ksTUFBckI7O0FBQ0EsUUFBSUgsS0FBSyxHQUFHLENBQVIsSUFBYUEsS0FBSyxJQUFJRyxNQUExQixFQUFrQztBQUM5QjtBQUNIOztBQUNESixJQUFBQSxLQUFLLENBQUNDLEtBQUQsQ0FBTCxHQUFlRCxLQUFLLENBQUNJLE1BQU0sR0FBRyxDQUFWLENBQXBCO0FBQ0FKLElBQUFBLEtBQUssQ0FBQ0ksTUFBTixHQUFlQSxNQUFNLEdBQUcsQ0FBeEI7QUFDSDtBQUVEOzs7Ozs7Ozs7OztBQVNPLFdBQVNDLE1BQVQsQ0FBb0JMLEtBQXBCLEVBQWdDTSxLQUFoQyxF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QkEsQ0FBQyxHQUFHTyxHQUFwQixFQUF5QlAsQ0FBQyxJQUFJLENBQTlCLEVBQWlDO0FBQzdCUSxNQUFBQSxNQUFNLENBQUNSLENBQUQsQ0FBTixHQUFZakIsS0FBSyxDQUFDaUIsQ0FBRCxDQUFqQjtBQUNIOztBQUNELFdBQU9RLE1BQVA7QUFDSCIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiBDb3B5cmlnaHQgKGMpIDIwMTggWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuXHJcblxyXG4gaHR0cDovL3d3dy5jb2Nvcy5jb21cclxuXHJcbiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XHJcbiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGVuZ2luZSBzb3VyY2UgY29kZSAodGhlIFwiU29mdHdhcmVcIiksIGEgbGltaXRlZCxcclxuIHdvcmxkd2lkZSwgcm95YWx0eS1mcmVlLCBub24tYXNzaWduYWJsZSwgcmV2b2NhYmxlIGFuZCBub24tZXhjbHVzaXZlIGxpY2Vuc2VcclxuIHRvIHVzZSBDb2NvcyBDcmVhdG9yIHNvbGVseSB0byBkZXZlbG9wIGdhbWVzIG9uIHlvdXIgdGFyZ2V0IHBsYXRmb3Jtcy4gWW91IHNoYWxsXHJcbiBub3QgdXNlIENvY29zIENyZWF0b3Igc29mdHdhcmUgZm9yIGRldmVsb3Bpbmcgb3RoZXIgc29mdHdhcmUgb3IgdG9vbHMgdGhhdCdzXHJcbiB1c2VkIGZvciBkZXZlbG9waW5nIGdhbWVzLiBZb3UgYXJlIG5vdCBncmFudGVkIHRvIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsXHJcbiBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgQ29jb3MgQ3JlYXRvci5cclxuXHJcbiBUaGUgc29mdHdhcmUgb3IgdG9vbHMgaW4gdGhpcyBMaWNlbnNlIEFncmVlbWVudCBhcmUgbGljZW5zZWQsIG5vdCBzb2xkLlxyXG4gWGlhbWVuIFlhamkgU29mdHdhcmUgQ28uLCBMdGQuIHJlc2VydmVzIGFsbCByaWdodHMgbm90IGV4cHJlc3NseSBncmFudGVkIHRvIHlvdS5cclxuXHJcbiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXHJcbiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcclxuIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxyXG4gQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxyXG4gTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcclxuIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cclxuIFRIRSBTT0ZUV0FSRS5cclxuKi9cclxuXHJcbmltcG9ydCB7IGxvZ0lEIH0gZnJvbSAnLi4vcGxhdGZvcm0vZGVidWcnO1xyXG5cclxuZXhwb3J0IHtkZWZhdWx0IGFzIE11dGFibGVGb3J3YXJkSXRlcmF0b3J9IGZyb20gJy4vbXV0YWJsZS1mb3J3YXJkLWl0ZXJhdG9yJztcclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog56e76Zmk5oyH5a6a57Si5byV55qE5pWw57uE5YWD57Sg44CCXHJcbiAqIEBlblxyXG4gKiBSZW1vdmVzIHRoZSBhcnJheSBpdGVtIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXguXHJcbiAqIEBwYXJhbSBhcnJheSDmlbDnu4TjgIJcclxuICogQHBhcmFtIGluZGV4IOW+heenu+mZpOWFg+e0oOeahOe0ouW8leOAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZUF0PFQ+IChhcnJheTogVFtdLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBhcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOenu+mZpOaMh+Wumue0ouW8leeahOaVsOe7hOWFg+e0oOOAglxyXG4gKiDmraTlh73mlbDljYHliIbpq5jmlYjvvIzkvYbkvJrmlLnlj5jmlbDnu4TnmoTlhYPntKDmrKHluo/jgIJcclxuICogQGVuXHJcbiAqIFJlbW92ZXMgdGhlIGFycmF5IGl0ZW0gYXQgdGhlIHNwZWNpZmllZCBpbmRleC5cclxuICogSXQncyBmYXN0ZXIgYnV0IHRoZSBvcmRlciBvZiB0aGUgYXJyYXkgd2lsbCBiZSBjaGFuZ2VkLlxyXG4gKiBAcGFyYW0gYXJyYXkg5pWw57uE44CCXHJcbiAqIEBwYXJhbSBpbmRleCDlvoXnp7vpmaTlhYPntKDnmoTntKLlvJXjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBmYXN0UmVtb3ZlQXQ8VD4gKGFycmF5OiBUW10sIGluZGV4OiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGxlbmd0aCA9IGFycmF5Lmxlbmd0aDtcclxuICAgIGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gbGVuZ3RoKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgYXJyYXlbaW5kZXhdID0gYXJyYXlbbGVuZ3RoIC0gMV07XHJcbiAgICBhcnJheS5sZW5ndGggPSBsZW5ndGggLSAxO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOenu+mZpOmmluS4quaMh+WumueahOaVsOe7hOWFg+e0oOOAguWIpOWumuWFg+e0oOebuOetieaXtuebuOW9k+S6juS6juS9v+eUqOS6hiBgQXJyYXkucHJvdG90eXBlLmluZGV4T2Zg44CCXHJcbiAqIEBlblxyXG4gKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGZyb20gdGhlIGFycmF5LlxyXG4gKiBEZWNpc2lvbiBvZiB0aGUgZXF1YWxpdHkgb2YgZWxlbWVudHMgaXMgc2ltaWxhciB0byBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgLlxyXG4gKiBAcGFyYW0gYXJyYXkg5pWw57uE44CCXHJcbiAqIEBwYXJhbSB2YWx1ZSDlvoXnp7vpmaTlhYPntKDjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiByZW1vdmU8VD4gKGFycmF5OiBUW10sIHZhbHVlOiBUKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YodmFsdWUpO1xyXG4gICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICByZW1vdmVBdChhcnJheSwgaW5kZXgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog56e76Zmk6aaW5Liq5oyH5a6a55qE5pWw57uE5YWD57Sg44CC5Yik5a6a5YWD57Sg55u4562J5pe255u45b2T5LqO5LqO5L2/55So5LqGIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZmDjgIJcclxuICog5q2k5Ye95pWw5Y2B5YiG6auY5pWI77yM5L2G5Lya5pS55Y+Y5pWw57uE55qE5YWD57Sg5qyh5bqP44CCXHJcbiAqIEBlblxyXG4gKiBSZW1vdmVzIHRoZSBmaXJzdCBvY2N1cnJlbmNlIG9mIGEgc3BlY2lmaWMgb2JqZWN0IGZyb20gdGhlIGFycmF5LlxyXG4gKiBEZWNpc2lvbiBvZiB0aGUgZXF1YWxpdHkgb2YgZWxlbWVudHMgaXMgc2ltaWxhciB0byBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgLlxyXG4gKiBJdCdzIGZhc3RlciBidXQgdGhlIG9yZGVyIG9mIHRoZSBhcnJheSB3aWxsIGJlIGNoYW5nZWQuXHJcbiAqIEBwYXJhbSBhcnJheSDmlbDnu4TjgIJcclxuICogQHBhcmFtIHZhbHVlIOW+heenu+mZpOWFg+e0oOOAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGZhc3RSZW1vdmU8VD4gKGFycmF5OiBUW10sIHZhbHVlOiBUKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmluZGV4T2YodmFsdWUpO1xyXG4gICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICBhcnJheVtpbmRleF0gPSBhcnJheVthcnJheS5sZW5ndGggLSAxXTtcclxuICAgICAgICAtLWFycmF5Lmxlbmd0aDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDnp7vpmaTpppbkuKrkvb/osJPor43mu6HotrPnmoTmlbDnu4TlhYPntKDjgIJcclxuICogQGVuXHJcbiAqIFJlbW92ZXMgdGhlIGZpcnN0IG9jY3VycmVuY2Ugb2YgYSBzcGVjaWZpYyBvYmplY3QgZnJvbSB0aGUgYXJyYXkgd2hlcmUgYHByZWRpY2F0ZWAgaXMgYHRydWVgLlxyXG4gKiBAcGFyYW0gYXJyYXkg5pWw57uE44CCXHJcbiAqIEBwYXJhbSBwcmVkaWNhdGUg6LCT6K+N44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSWY8VD4gKGFycmF5OiBUW10sIHByZWRpY2F0ZTogKHZhbHVlOiBUKSA9PiBib29sZWFuKSB7XHJcbiAgICBjb25zdCBpbmRleCA9IGFycmF5LmZpbmRJbmRleChwcmVkaWNhdGUpO1xyXG4gICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGFycmF5W2luZGV4XTtcclxuICAgICAgICByZW1vdmVBdChhcnJheSwgaW5kZXgpO1xyXG4gICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDpqozor4HmlbDnu4TnmoTnsbvlnovjgIJcclxuICog5q2k5Ye95pWw5bCG55SoIGBpbnN0YW5jZW9mYCDmk43kvZznrKbpqozor4Hmr4/kuIDkuKrlhYPntKDjgIJcclxuICogQGVuXHJcbiAqIFZlcmlmeSBhcnJheSdzIFR5cGUuXHJcbiAqIFRoaXMgZnVuY3Rpb24gdGVzdHMgZWFjaCBlbGVtZW50IHVzaW5nIGBpbnN0YW5jZW9mYCBvcGVyYXRvci5cclxuICogQHBhcmFtIGFycmF5IOaVsOe7hOOAglxyXG4gKiBAcGFyYW0gdHlwZSDnsbvlnovjgIJcclxuICogQHJldHVybnMg5b2T5q+P5LiA5Liq5YWD57Sg6YO95piv5oyH5a6a57G75Z6L5pe26L+U5ZueIGB0cnVlYO+8jOWQpuWImei/lOWbniBgZmFsc2Vg44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gdmVyaWZ5VHlwZTxUIGV4dGVuZHMgRnVuY3Rpb24+IChhcnJheTogYW55W10sIHR5cGU6IFQpOiBhcnJheSBpcyBUW10ge1xyXG4gICAgaWYgKGFycmF5ICYmIGFycmF5Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgYXJyYXkpIHtcclxuICAgICAgICAgICAgaWYgKCEoaXRlbSBpbnN0YW5jZW9mIHR5cGUpKSB7XHJcbiAgICAgICAgICAgICAgICBsb2dJRCgxMzAwKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuICogQHpoXHJcbiAqIOenu+mZpOWkmuS4quaVsOe7hOWFg+e0oOOAglxyXG4gKiBAZW5cclxuICogUmVtb3ZlcyBtdWx0aXBsZSBhcnJheSBlbGVtZW50cy5cclxuICogQHBhcmFtIGFycmF5IOa6kOaVsOe7hOOAglxyXG4gKiBAcGFyYW0gcmVtb3ZhbHMg5omA5pyJ5b6F56e76Zmk55qE5YWD57Sg44CC5q2k5pWw57uE55qE5q+P5Liq5YWD57Sg5omA5a+55bqU55qE6aaW5Liq5rqQ5pWw57uE55qE5YWD57Sg6YO95Lya6KKr56e76Zmk44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQXJyYXk8VD4gKGFycmF5OiBUW10sIHJlbW92YWxzOiBUW10pIHtcclxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gcmVtb3ZhbHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XHJcbiAgICAgICAgcmVtb3ZlKGFycmF5LCByZW1vdmFsc1tpXSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBAemhcclxuICog5Zyo5pWw57uE55qE5oyH5a6a57Si5byV5LiK5o+S5YWl5a+56LGh44CCXHJcbiAqIEBlblxyXG4gKiBJbnNlcnRzIHNvbWUgb2JqZWN0cyBhdCBzcGVjaWZpZWQgaW5kZXguXHJcbiAqIEBwYXJhbSBhcnJheSDmlbDnu4TjgIJcclxuICogQHBhcmFtIG9iamVjdHMg5o+S5YWl55qE5omA5pyJ5a+56LGh44CCXHJcbiAqIEBwYXJhbSBpbmRleCDmj5LlhaXnmoTntKLlvJXjgIJcclxuICogQHJldHVybnMgYGFycmF5YOOAglxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZE9iamVjdHNBdDxUPiAoYXJyYXk6IFRbXSwgb2JqZWN0czogVFtdLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICBhcnJheS5zcGxpY2UuYXBwbHkoYXJyYXksIFtpbmRleCwgMCwgLi4ub2JqZWN0c10pO1xyXG4gICAgcmV0dXJuIGFycmF5O1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDov5Tlm57mlbDnu4TmmK/lkKbljIXlkKvmjIflrprnmoTlhYPntKDjgIJcclxuICogQGVuXHJcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgYXJyYXkgY29udGFpbnMgYSBzcGVjaWZpYyBlbGVtZW50LlxyXG4gKiBAcmV0dXJucyDov5Tlm57mlbDnu4TmmK/lkKbljIXlkKvmjIflrprnmoTlhYPntKDjgIJcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBjb250YWluczxUPiAoYXJyYXk6IFRbXSwgdmFsdWU6IFQpIHtcclxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcHJlZmVyLWluY2x1ZGVzXHJcbiAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSkgPj0gMDtcclxufVxyXG5cclxuLyoqXHJcbiAqIEB6aFxyXG4gKiDmi7fotJ3mlbDnu4TjgIJcclxuICogQGVuXHJcbiAqIENvcHkgYW4gYXJyYXkuXHJcbiAqIEBwYXJhbSDmupDmlbDnu4TjgIJcclxuICogQHJldHVybnMg5pWw57uE55qE5Ymv5pys44CCXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29weTxUPiAoYXJyYXk6IFRbXSkge1xyXG4gICAgY29uc3QgbGVuID0gYXJyYXkubGVuZ3RoO1xyXG4gICAgY29uc3QgY2xvbmVkID0gbmV3IEFycmF5KGxlbik7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XHJcbiAgICAgICAgY2xvbmVkW2ldID0gYXJyYXlbaV07XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2xvbmVkO1xyXG59XHJcbiJdfQ==