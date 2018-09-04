// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import enums from '../enums';

function _defineProperty(target, name, internalName, arrayFn) {
  target[internalName] = new arrayFn(target._data);
  Object.defineProperty(target, name, {
    get() {
      return this[internalName];
    },
  });
}

export default class ArrayBufferHelper {
  constructor(size, viewTypes) {
    this._data = new ArrayBuffer(size);

    for (let i = 0; i < viewTypes.length; ++i) {
      let type = viewTypes[i];

      if (type === enums.BUFFER_VIEW_INT8) {
        _defineProperty(this, 'int8View', '_int8View', Int8Array);
      } else if (type === enums.BUFFER_VIEW_UINT8) {
        _defineProperty(this, 'uint8View', '_uint8View', Uint8Array);
      } else if (type === enums.BUFFER_VIEW_INT16) {
        _defineProperty(this, 'int16View', '_int16View', Int16Array);
      } else if (type === enums.BUFFER_VIEW_UINT16) {
        _defineProperty(this, 'uint16View', '_uint16View', Uint16Array);
      } else if (type === enums.BUFFER_VIEW_INT32) {
        _defineProperty(this, 'int32View', '_int32View', Int32Array);
      } else if (type === enums.BUFFER_VIEW_UINT32) {
        _defineProperty(this, 'uint32View', '_uint32View', Uint32Array);
      } else if (type === enums.BUFFER_VIEW_FLOAT32) {
        _defineProperty(this, 'float32View', '_float32View', Float32Array);
      }
    }
  }
}