/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

/*
 * JS Implementation of MurmurHash2
 *
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 *
 * @param {string} str ASCII only
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash
 */

const getUint8ForString = String.prototype.charCodeAt;
function getUint8ForArray (this: Uint8Array, idx: number): number { return this[idx]; }

/**
 * @en JS Implementation of MurmurHash2. Original implementation is http://github.com/garycourt/murmurhash-js.
 * @zh MurmurHash2 的 JS 实现。原始实现是 http://github.com/garycourt/murmurhash-js 。
 * @param input @en ASCII string or a Uint8Array to be hashed. @zh 希望被哈希的 ASCII 字符串或者 Uint8Array.
 * @param seed @en Hash seed. Should be a positive integer. @zh 哈希种子。必须是个正整数。
 * @returns @en 32-bit positive integer hash. @zh 32位正整数哈希值。
 */
export function murmurhash2_32_gc (input: string | Uint8Array, seed: number): number {
    let l = input.length;
    let h = seed ^ l;
    let i = 0;
    const getUint8 = typeof input === 'string' ? getUint8ForString : getUint8ForArray;

    while (l >= 4) {
        let k =            ((getUint8.call(input, i) & 0xff))
            | ((getUint8.call(input, ++i) & 0xff) << 8)
            | ((getUint8.call(input, ++i) & 0xff) << 16)
            | ((getUint8.call(input, ++i) & 0xff) << 24);

        k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        k ^= k >>> 24;
        k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));

        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;

        l -= 4;
        ++i;
    }

    switch (l) {
    // Don't break in case 3 and case 2.
    case 3: h ^= (getUint8.call(input, i + 2) & 0xff) << 16;
    // eslint-disable-next-line no-fallthrough
    case 2: h ^= (getUint8.call(input, i + 1) & 0xff) << 8;
    // eslint-disable-next-line no-fallthrough
    case 1:
        h ^= (getUint8.call(input, i) & 0xff);
        h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
        break;
    default:
        // do nothing, just make VSCode happy.
        break;
    }

    h ^= h >>> 13;
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h ^= h >>> 15;

    return h >>> 0;
}
