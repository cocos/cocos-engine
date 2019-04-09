/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

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
 ****************************************************************************/

export {default as MutableForwardIterator} from './mutable-forward-iterator';

/**
 * Removes the array item at the specified index.
 */
export function removeAt<T> (array: T[], index: number) {
    array.splice(index, 1);
}

/**
 * Removes the array item at the specified index.
 * It's faster but the order of the array will be changed.
 */
export function fastRemoveAt<T> (array: T[], index: number) {
    const length = array.length;
    if (index < 0 || index >= length) {
        return;
    }
    array[index] = array[length - 1];
    array.length = length - 1;
}

/**
 * Removes the first occurrence of a specific object from the array.
 */
export function remove<T> (array: T[], value: T) {
    const index = array.indexOf(value);
    if (index >= 0) {
        removeAt(array, index);
        return true;
    } else {
        return false;
    }
}

/**
 * Removes the first occurrence of a specific object from the array.
 * It's faster but the order of the array will be changed.
 */
export function fastRemove<T> (array: T[], value: T) {
    const index = array.indexOf(value);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        --array.length;
    }
}

/**
 * Verify array's Type.
 */
export function verifyType<T> (array: T[], type: Function) {
    if (array && array.length > 0) {
        for (const item of array) {
            if (!(item instanceof type)) {
                cc.logID(1300);
                return false;
            }
        }
    }
    return true;
}

/**
 * Removes from array all values in minusArr. For each Value in minusArr, the first matching instance in array will be removed.
 * @param array Source Array
 * @param minusArr minus Array
 */
export function removeArray<T> (array: T[], minusArr: T[]) {
    for (let i = 0, l = minusArr.length; i < l; i++) {
        remove(array, minusArr[i]);
    }
}

/**
 * Inserts some objects at index.
 */
export function appendObjectsAt<T> (array: T[], addObjs: T[], index: number) {
    array.splice.apply(array, [index, 0, ...addObjs]);
    return array;
}

/**
 * Exact same function as Array.prototype.indexOf.<br>
 * HACK: ugliy hack for Baidu mobile browser compatibility,
 * stupid Baidu guys modify Array.prototype.indexOf for all pages loaded,
 * their version changes strict comparison to non-strict comparison,
 * it also ignores the second parameter of the original API, and this will cause event handler enter infinite loop.<br>
 * Baidu developers, if you ever see this documentation,
 * here is the standard: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf, Seriously!
 *
 * @method indexOf
 * @param searchElement - Element to locate in the array.
 * @param [fromIndex=0] - The index to start the search at
 * @return the first index at which a given element can be found in the array, or -1 if it is not present.
 */
export function indexOf<T> (array: T[], searchElement: T, fromIndex?: number) {
    return Array.prototype.indexOf.call(array, [searchElement, fromIndex]);
}

/**
 * Determines whether the array contains a specific value.
 */
export function contains<T> (array: T[], value: T) {
    return array.indexOf(value) >= 0;
}

/**
 * Copy an array's item to a new array (its performance is better than Array.slice)
 */
export function copy<T> (array: T[]) {
    const len = array.length;
    const arr_clone = new Array(len);
    for (let i = 0; i < len; i += 1) {
        arr_clone[i] = array[i];
    }
    return arr_clone;
}
