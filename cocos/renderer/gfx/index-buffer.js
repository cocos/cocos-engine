import { enums } from './enums';

class IndexBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {INDEX_FMT_*} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   * @param {Number} numIndices
   */
  constructor(device, format, usage, data, numIndices) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._numIndices = numIndices;
    this._bytesPerIndex = 0;

    // calculate bytes
    if (format === enums.INDEX_FMT_UINT8) {
      this._bytesPerIndex = 1;
    } else if (format === enums.INDEX_FMT_UINT16) {
      this._bytesPerIndex = 2;
    } else if (format === enums.INDEX_FMT_UINT32) {
      this._bytesPerIndex = 4;
    }
    this._bytes = this._bytesPerIndex * numIndices;

    // update
    this._glID = device._gl.createBuffer();
    this.update(0, data);

    // stats
    device._stats.ib += this._bytes;
  }

  /**
   * @method destroy
   */
  destroy() {
    if (this._glID === -1) {
      console.error('The buffer already destroyed');
      return;
    }

    let gl = this._device._gl;
    gl.deleteBuffer(this._glID);
    this._device._stats.ib -= this.bytes;

    this._glID = -1;
  }

  /**
   * @method update
   * @param {Number} offset
   * @param {ArrayBuffer} data
   */
  update(offset, data) {
    if (this._glID === -1) {
      console.error('The buffer is destroyed');
      return;
    }

    if (data && data.byteLength + offset > this._bytes) {
      console.error('Failed to update data, bytes exceed.');
      return;
    }

    /** @type{WebGLRenderingContext} */
    let gl = this._device._gl;
    let glUsage = this._usage;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);
    if (!data) {
      if (this._bytes) {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this._bytes, glUsage);
      } else {
        console.warn('bufferData should not submit 0 bytes data');
      }
    } else {
      if (offset) {
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, offset, data);
      } else {
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
      }
    }
    this._device._restoreIndexBuffer();
  }

  get count () {
    return this._numIndices;
  }
}

if (CC_EDITOR) {
  let _type2fn = {
    [enums.ATTR_TYPE_INT8]: 'getInt8',
    [enums.ATTR_TYPE_UINT8]: 'getUint8',
    [enums.ATTR_TYPE_INT16]: 'getInt16',
    [enums.ATTR_TYPE_UINT16]: 'getUint16',
    [enums.ATTR_TYPE_INT32]: 'getInt32',
    [enums.ATTR_TYPE_UINT32]: 'getUint32',
    [enums.ATTR_TYPE_FLOAT32]: 'getFloat32'
  };
  let littleEndian = (function() {
    let buffer = new ArrayBuffer(2);
    new DataView(buffer).setInt16(0, 256, true);
    // Int16Array uses the platform's endianness.
    return new Int16Array(buffer)[0] === 256;
  })();
  let createCache = function(ib, data) {
    if (!data) return [];
    let icount = data.byteLength / ib._bytesPerIndex;
    let result = new Array(icount);
    for (let i = 0; i < icount; i++) {
      let fname = _type2fn[ib._format];
      result[i] = data[fname](i * ib._bytesPerIndex, littleEndian);
    }
    return result;
  };
  IndexBuffer.prototype.do_update = IndexBuffer.prototype.update;
  IndexBuffer.prototype.update = function(offset, data) {
    this.do_update(offset, data);
    // don't need to create for IA pools
    if (data && this._bytes !== data.byteLength) return;
    if (data instanceof ArrayBuffer)
      data = new DataView(data);
    else if (ArrayBuffer.isView(data) && !(data instanceof DataView))
      data = new DataView(data.buffer, data.byteOffset, data.byteLength);
    this._data = createCache(this, data);
  };
}

export default IndexBuffer;
