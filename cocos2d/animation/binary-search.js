var EPSILON = 1e-6;

//
// Searches the entire sorted Array for an element and returns the zero-based index of the element.
// @method binarySearch
// @param {number[]} array
// @param {number} value
// @return {number} The zero-based index of item in the sorted Array, if item is found; otherwise, a negative number that is the bitwise complement of the index of the next element that is larger than item or, if there is no larger element, the bitwise complement of array's length.
//
function binarySearch (array, value) {
    var l = 0, h = array.length - 1;
    while (l <= h) {
        var m = ((l + h) >> 1);

        if (Math.abs(array[m] - value) < EPSILON) {
            return m;
        }
        if (array[m] > value) {
            h = m - 1;
        }
        else {
            l = m + 1;
        }
    }
    return ~l;
}

module.exports = binarySearch;
