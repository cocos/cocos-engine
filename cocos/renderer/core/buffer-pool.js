// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import { bits } from '../../core/vmath';
import ArrayBufferHelper from './array-buffer-helper';
import enums from '../enums';

const _DEFAULT_MAX_BATCH_BYTES = 512000; // 500 kb
const _MIN_BATCH_BYTES = 64;

let _minLog = bits.log2(_MIN_BATCH_BYTES);

export default class BufferPool {
  constructor(maxBytes = _DEFAULT_MAX_BATCH_BYTES, viewTypes = [enums.BUFFER_VIEW_FLOAT32]) {
    this._buffers = [];
    this._maxBytes = bits.nextPow2(maxBytes);
    this._maxLog = bits.log2(this._maxBytes);

    for (let i = _minLog; i <= this._maxLog; ++i) {
      this._buffers.push(new ArrayBufferHelper(1 << i, viewTypes));
    }
  }

  get maxBytes() {
    return this._maxBytes;
  }

  request(size) {
    let np2 = bits.nextPow2(size);
    let curLog = bits.log2(np2);
    if (curLog > this._maxLog) {
      return this._buffers[this._maxLog - _minLog];
    } else if (curLog < _minLog) {
      return this._buffers[0];
    } else {
      return this._buffers[curLog - _minLog];
    }
  }
}