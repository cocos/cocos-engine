/*
 Copyright (c) 2022-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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

import { approx } from '../core';

/**
 * Removes keys which are linear interpolations of surrounding keys.
 * @param keys Input keys.
 * @param values Input values.
 * @param maxDiff Max error.
 * @returns The new keys `keys` and new values `values`.
 */
export function removeLinearKeys (keys: number[], values: number[], maxDiff = 1e-3) {
    const nKeys = keys.length;

    if (nKeys < 3) {
        return {
            keys: keys.slice(),
            values: values.slice(),
        };
    }

    const removeFlags = new Array<boolean>(nKeys).fill(false);
    // We may choose to use different key selection policy?
    // http://nfrechette.github.io/2016/12/07/anim_compression_key_reduction/
    const iLastKey = nKeys - 1;
    for (let iKey = 1; iKey< iLastKey; ++iKey) {
        // Should we select previous non-removed key?
        const iPrevious = iKey - 1;
        const iNext = iKey + 1;
        const { [iPrevious]: previousKey, [iKey]: currentKey, [iNext]: nextKey } = keys;
        const { [iPrevious]: previousValue, [iKey]: currentValue, [iNext]: nextValue } = values;
        const alpha = (currentKey - previousKey) / (nextKey - previousKey);
        const expectedValue = (nextValue - previousValue) * alpha + previousValue;
        if (approx(expectedValue, currentValue, maxDiff)) {
            removeFlags[iKey] = true;
        }
    }

    return filterFromRemoveFlags(keys, values, removeFlags);
}

/**
 * Removes trivial frames.
 * @param keys Input keys.
 * @param values Input values.
 * @param maxDiff Max error.
 * @returns The new keys `keys` and new values `values`.
 */
export function removeTrivialKeys (keys: number[], values: number[], maxDiff = 1e-3) {
    const nKeys = keys.length;

    if (nKeys < 2) {
        return {
            keys: keys.slice(),
            values: values.slice(),
        };
    }

    const removeFlags = new Array<boolean>(nKeys).fill(false);
    for (let iKey = 1; iKey< nKeys; ++iKey) {
        // Should we select previous non-removed key?
        const iPrevious = iKey - 1;
        const { [iPrevious]: previousValue, [iKey]: currentValue } = values;
        if (approx(previousValue, currentValue, maxDiff)) {
            removeFlags[iKey] = true;
        }
    }

    return filterFromRemoveFlags(keys, values, removeFlags);
}

function filterFromRemoveFlags (keys: number[], values: number[], removeFlags: boolean[]) {
    const nKeys = keys.length;

    const nRemovals = removeFlags.reduce((n, removeFlag) => removeFlag ? n + 1 : n, 0);
    if (!nRemovals) {
        return {
            keys: keys.slice(),
            values: values.slice(),
        };
    }

    const nNewKeyframes = nKeys - nRemovals;
    const newKeys = new Array<number>(nNewKeyframes).fill(0.0);
    const newValues = new Array<number>(nNewKeyframes).fill(0.0);
    for (let iNewKeys = 0, iKey = 0; iKey < nKeys; ++iKey) {
        if (!removeFlags[iKey]) {
            newKeys[iNewKeys] = keys[iKey];
            newValues[iNewKeys] = values[iKey];
            ++iNewKeys;
        }
    }

    return {
        keys: newKeys,
        values: newValues,
    };
}