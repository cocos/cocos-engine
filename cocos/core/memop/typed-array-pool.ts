/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
 */


/**
 * @packageDocumentation
 * @module memop
 */

let _bufferPools: ArrayBuffer[][] = Array(8);
for (let i = 0; i < 8; ++i) {
    _bufferPools[i] = [];
}

function _nextPow16 (v) {
    for (let i = 16; i <= (1 << 28); i *= 16) {
        if (v <= i) {
            return i;
        }
    }
    return 0;
}

function _log2 (v: number) {
    let r = ((v > 0xFFFF) as unknown as number) << 4; v >>>= r;
    let shift = ((v > 0xFF) as unknown as number) << 3; v >>>= shift; r |= shift;
    shift = ((v > 0xF) as unknown as number) << 2; v >>>= shift; r |= shift;
    shift = ((v > 0x3) as unknown as number) << 1; v >>>= shift; r |= shift;
    return r | (v >> 1);
}

function _alloc (n: number) {
    const sz = _nextPow16(n);
    const bin = _bufferPools[_log2(sz) >> 2];
    if (bin.length > 0) {
        return bin.pop() as ArrayBuffer;
    }
    return new ArrayBuffer(sz);
}

function _free (buf) {
    _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

export default {
    /**
     * @en Allocate an Int8Array.
     * @zh 分配一个 Int8Array。
     * @param n Size of the array
     */
    alloc_int8 (n) {
        const result = new Int8Array(_alloc(n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate an Uint8Array.
     * @zh 分配一个 Uint8Array。
     * @param n Size of the array
     */
    alloc_uint8 (n) {
        const result = new Uint8Array(_alloc(n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate an Int16Array.
     * @zh 分配一个 Int16Array。
     * @param n Size of the array
     */
    alloc_int16 (n) {
        const result = new Int16Array(_alloc(2 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate an Uint16Array.
     * @zh 分配一个 Uint16Array。
     * @param n Size of the array
     */
    alloc_uint16 (n) {
        const result = new Uint16Array(_alloc(2 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate an Int32Array.
     * @zh 分配一个 Int32Array。
     * @param n Size of the array
     */
    alloc_int32 (n) {
        const result = new Int32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate an Uint32Array.
     * @zh 分配一个 Uint32Array。
     * @param n Size of the array
     */
    alloc_uint32 (n) {
        const result = new Uint32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate a Float32Array.
     * @zh 分配一个 Float32Array。
     * @param n Size of the array
     */
    alloc_float32 (n) {
        const result = new Float32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @en Allocate a Float64Array.
     * @zh 分配一个 Float64Array。
     * @param n Size of the array
     */
    alloc_float64 (n) {
        const result = new Float64Array(_alloc(8 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    // alloc_dataview (n) {
    //     const result = new DataView(_alloc(n), 0, n);
    //     if (result.length !== n) {
    //         return result.subarray(0, n);
    //     }

    //     return result;
    // },

    /**
     * @en Release a TypeArray.
     * @zh 释放一个 TypeArray。
     * @param array The typed array to be released
     */
    free (array) {
        _free(array.buffer);
    },

    /**
     * @en Reset TypeArray pool.
     * @zh 重置 TypeArray 池。
     */
    reset () {
        _bufferPools = Array(8);
        for (let i = 0; i < 8; ++i) {
            _bufferPools[i] = [];
        }
    },
};
