
/**
 * @category memop
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
     * @zh 分配一个Int8Array。
     * @param n 数组长度。
     */
    alloc_int8 (n) {
        const result = new Int8Array(_alloc(n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Uint8Array。
     * @param n 数组长度。
     */
    alloc_uint8 (n) {
        const result = new Uint8Array(_alloc(n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Int16Array。
     * @param n 数组长度。
     */
    alloc_int16 (n) {
        const result = new Int16Array(_alloc(2 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Uint16Array。
     * @param n 数组长度。
     */
    alloc_uint16 (n) {
        const result = new Uint16Array(_alloc(2 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Int32Array。
     * @param n 数组长度。
     */
    alloc_int32 (n) {
        const result = new Int32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Uint32Array。
     * @param n 数组长度。
     */
    alloc_uint32 (n) {
        const result = new Uint32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Float32Array。
     * @param n 数组长度。
     */
    alloc_float32 (n) {
        const result = new Float32Array(_alloc(4 * n), 0, n);
        if (result.length !== n) {
            return result.subarray(0, n);
        }

        return result;
    },

    /**
     * @zh 分配一个Float64Array。
     * @param n 数组长度。
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
     * 释放一个TypeArray。
     * @param array 释放的数组。
     */
    free (array) {
        _free(array.buffer);
    },

    /**
     * @zh 重置TypeArray池。
     */
    reset () {
        _bufferPools = Array(8);
        for (let i = 0; i < 8; ++i) {
            _bufferPools[i] = [];
        }
    },
};
