/*
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
*/

import { logID } from '../platform/debug';

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

export function removeIf<T> (array: T[], predicate: (value: T) => boolean) {
    const index = array.findIndex(predicate);
    if (index >= 0) {
        const value = array[index];
        removeAt(array, index);
        return value;
    }
}

/**
 * Verify array's Type.
 */
export function verifyType<T> (array: T[], type: Function) {
    if (array && array.length > 0) {
        for (const item of array) {
            if (!(item instanceof type)) {
                logID(1300);
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
