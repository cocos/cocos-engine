// reference: https://github.com/v8/v8/blob/master/src/js/array.js

function _compare(a, b) {
  return a - b;
}

function _sort(array, from, to, comparefn) {

  function _insertionSort(a, from, to) {
    for (let i = from + 1; i < to; i++) {
      let element = a[i];
      let j;

      for (j = i - 1; j >= from; j--) {
        let tmp = a[j];
        let order = comparefn(tmp, element);
        if (order > 0) {
          a[j + 1] = tmp;
        } else {
          break;
        }
      }
      a[j + 1] = element;
    }
  }

  // function _getThirdIndex(a, from, to) {
  //   let t_array = new Array();
  //   // Use both 'from' and 'to' to determine the pivot candidates.
  //   let increment = 200 + ((to - from) & 15);
  //   let j = 0;
  //   from += 1;
  //   to -= 1;
  //   for (let i = from; i < to; i += increment) {
  //     t_array[j] = [i, a[i]];
  //     j++;
  //   }
  //   t_array.sort(function (a, b) {
  //     return comparefn(a[1], b[1]);
  //   });
  //   let third_index = t_array[t_array.length >> 1][0];
  //   return third_index;
  // }

  function _quickSort(a, from, to) {
    let third_index = 0;

    while (true) {
      // Insertion sort is faster for short arrays.
      if (to - from <= 10) {
        _insertionSort(a, from, to);
        return;
      }
      // if (to - from > 1000) {
      //   third_index = _getThirdIndex(a, from, to);
      // } else {
        third_index = from + ((to - from) >> 1);
      // }
      // Find a pivot as the median of first, last and middle element.
      let v0 = a[from];
      let v1 = a[to - 1];
      let v2 = a[third_index];
      let c01 = comparefn(v0, v1);
      if (c01 > 0) {
        // v1 < v0, so swap them.
        let tmp = v0;
        v0 = v1;
        v1 = tmp;
      } // v0 <= v1.
      let c02 = comparefn(v0, v2);
      if (c02 >= 0) {
        // v2 <= v0 <= v1.
        let tmp = v0;
        v0 = v2;
        v2 = v1;
        v1 = tmp;
      } else {
        // v0 <= v1 && v0 < v2
        let c12 = comparefn(v1, v2);
        if (c12 > 0) {
          // v0 <= v2 < v1
          let tmp = v1;
          v1 = v2;
          v2 = tmp;
        }
      }
      // v0 <= v1 <= v2
      a[from] = v0;
      a[to - 1] = v2;
      let pivot = v1;
      let low_end = from + 1;   // Upper bound of elements lower than pivot.
      let high_start = to - 1;  // Lower bound of elements greater than pivot.
      a[third_index] = a[low_end];
      a[low_end] = pivot;

      // From low_end to i are elements equal to pivot.
      // From i to high_start are elements that haven't been compared yet.
      partition: for (let i = low_end + 1; i < high_start; i++) {
        let element = a[i];
        let order = comparefn(element, pivot);
        if (order < 0) {
          a[i] = a[low_end];
          a[low_end] = element;
          low_end++;
        } else if (order > 0) {
          do {
            high_start--;
            if (high_start == i) break partition;
            let top_elem = a[high_start];
            order = comparefn(top_elem, pivot);
          } while (order > 0);
          a[i] = a[high_start];
          a[high_start] = element;
          if (order < 0) {
            element = a[i];
            a[i] = a[low_end];
            a[low_end] = element;
            low_end++;
          }
        }
      }
      if (to - high_start < low_end - from) {
        _quickSort(a, high_start, to);
        to = low_end;
      } else {
        _quickSort(a, from, low_end);
        from = high_start;
      }
    }
  }

  if (to - from < 2) {
    return array;
  }

  _quickSort(array, from, to);

  return array;
}


/**
 * Calls the _quickSort function with it's initial values.
 *
 * @public
 * @param {array} array The input array which should be sorted
 * @param {Number} from
 * @param {Number} to
 * @param {Function} cmp
 * @returns {array} array Sorted array
 */
export default function (array, from, to, cmp) {
  if (from === undefined) {
    from = 0;
  }

  if (to === undefined) {
    to = array.length;
  }

  if (cmp === undefined) {
    cmp = _compare;
  }

  return _sort(array, from, to, cmp);
}