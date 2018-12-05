/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
 ****************************************************************************/

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

function binarySearchEpsilon (array, value) {
    for (var l = 0, h = array.length - 1, m = h >>> 1;
         l <= h;
         m = (l + h) >>> 1
    ) {
        var test = array[m];
        if (test > value + EPSILON) {
            h = m - 1;
        }
        else if (test < value - EPSILON) {
            l = m + 1;
        }
        else {
            return m;
        }
    }
    return ~l;
}


module.exports = {
    binarySearchEpsilon
};
