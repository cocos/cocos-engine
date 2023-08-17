/*
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2023 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

/**
 * Searches the **ascending sorted** array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the element to be searched or,
 * returns the complement of array's length if no element is greater than the element to be searched or the array is empty.
 * @engineInternal
 */
export function binarySearch (array: number[], value: number): number {
    return binarySearchEpsilon(array, value, 0);
}

/**
 * Searches the **ascending sorted** number array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @param EPSILON The epsilon to compare the numbers. Default to `1e-6`.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the element to be searched or,
 * returns the complement of array's length if no element is greater than the element to be searched or the array is empty.
 * @engineInternal
 */
export function binarySearchEpsilon (array: Readonly<ArrayLike<number>>, value: number, EPSILON = 1e-6): number {
    let low = 0;
    let high = array.length - 1;
    let middle = high >>> 1;
    for (; low <= high; middle = (low + high) >>> 1) {
        const test = array[middle];
        if (test > (value + EPSILON)) {
            high = middle - 1;
        } else if (test < (value - EPSILON)) {
            low = middle + 1;
        } else {
            return middle;
        }
    }
    return ~low;
}

/**
 * Searches the **ascending sorted** array for an element and returns the index of that element.
 * @param array The array to search in.
 * @param value The value to search.
 * @param lessThan Comparison function object which returns ​true if the first argument is less than the second.
 * @returns The index of the searched element in the sorted array, if found;
 * otherwise, returns the complement of the index of the next element greater than the searching element or,
 * returns the complement of array's length if no element is greater than the searching element or the array is empty.
 * @engineInternal
 */
export function binarySearchBy<T, U> (array: T[], value: U, lessThan: (lhs: T, rhs: U) => number): number {
    let low = 0;
    let high = array.length - 1;
    let middle = high >>> 1;
    for (; low <= high; middle = (low + high) >>> 1) {
        const test = array[middle];
        if (lessThan(test, value) < 0) {
            high = middle - 1;
        } else if (lessThan(test, value) > 0) {
            low = middle + 1;
        } else {
            return middle;
        }
    }
    return ~low;
}
