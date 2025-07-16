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

export function blend1D (weights: number[], thresholds: readonly number[], value: number): void {
    weights.fill(0.0);
    if (thresholds.length === 0) {
        // Do nothing
    } else if (value <= thresholds[0]) {
        weights[0] = 1;
    } else if (value >= thresholds[thresholds.length - 1]) {
        weights[weights.length - 1] = 1;
    } else {
        let iUpper = 0;
        for (let iThresholds = 1; iThresholds < thresholds.length; ++iThresholds) {
            if (thresholds[iThresholds] > value) {
                iUpper = iThresholds;
                break;
            }
        }
        const lower = thresholds[iUpper - 1];
        const upper = thresholds[iUpper];
        const dVal = upper - lower;
        weights[iUpper - 1] = (upper - value) / dVal;
        weights[iUpper] = (value - lower) / dVal;
    }
}
