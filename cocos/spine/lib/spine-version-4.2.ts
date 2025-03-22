/*
 Copyright (c) 2025 Xiamen Yaji Software Co., Ltd.

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
import { DataInput, SkeletonBinary } from "./spine-binary";
import { BUILD } from 'internal:constants';
export const SPINE_VERSION = '4.2';

function isVersionCompatible(version: string | null): boolean {
    if (!BUILD) {
        if (!version || !version.startsWith('4.2.')) {
            return false;
        }
    }
    return true;
};

/**
 * @internal Used only by editor. 
 */
export function isBinaryCompatible (buffer: Uint8Array): boolean {
    if (!BUILD) {
        const input = new DataInput(buffer);
        SkeletonBinary.readInt(input);// read hash
        SkeletonBinary.readInt(input);// read hash
        const version = SkeletonBinary.readString(input);

        return isVersionCompatible(version);
    }
    return false;
}

/**
 * @internal Used only by editor.
 */
export function isJsonCompatible (json: JSON): boolean {
    if (!BUILD) {
        return isVersionCompatible(json['skeleton']['spine']);
    }
    return false;
}
