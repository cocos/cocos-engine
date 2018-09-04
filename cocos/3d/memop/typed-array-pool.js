let _bufferPools = Array(8);
for (let i = 0; i < 8; ++i) {
  _bufferPools[i] = [];
}

function _nextPow16(v) {
  for (let i = 16; i <= (1 << 28); i *= 16) {
    if (v <= i) {
      return i;
    }
  }
  return 0;
}

function _log2(v) {
  let r, shift;
  r = (v > 0xFFFF) << 4; v >>>= r;
  shift = (v > 0xFF) << 3; v >>>= shift; r |= shift;
  shift = (v > 0xF) << 2; v >>>= shift; r |= shift;
  shift = (v > 0x3) << 1; v >>>= shift; r |= shift;
  return r | (v >> 1);
}

function _alloc(n) {
  let sz = _nextPow16(n);
  let bin = _bufferPools[_log2(sz) >> 2];
  if (bin.length > 0) {
    return bin.pop();
  }
  return new ArrayBuffer(sz);
}

function _free(buf) {
  _bufferPools[_log2(buf.byteLength) >> 2].push(buf);
}

export default {
  alloc_int8(n) {
    let result = new Int8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint8(n) {
    let result = new Uint8Array(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int16(n) {
    let result = new Int16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint16(n) {
    let result = new Uint16Array(_alloc(2 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_int32(n) {
    let result = new Int32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_uint32(n) {
    let result = new Uint32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float32(n) {
    let result = new Float32Array(_alloc(4 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_float64(n) {
    let result = new Float64Array(_alloc(8 * n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  alloc_dataview(n) {
    let result = new DataView(_alloc(n), 0, n);
    if (result.length !== n) {
      return result.subarray(0, n);
    }

    return result;
  },

  free(array) {
    _free(array.buffer);
  },

  reset() {
    let _bufferPools = Array(8);
    for (let i = 0; i < 8; ++i) {
      _bufferPools[i] = [];
    }
  },
};