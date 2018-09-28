import { enums } from './enums';

class VertexBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {VertexFormat} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   * @param {Number} numVertices
   */
  constructor(device, format, usage, data, numVertices) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._numVertices = numVertices;

    // calculate bytes
    this._bytes = this._format._bytes * numVertices;

    // update
    this._glID = device._gl.createBuffer();
    this.update(0, data);

    // stats
    device._stats.vb += this._bytes;
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
    this._device._stats.vb -= this.bytes;

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

    let gl = this._device._gl;
    let glUsage = this._usage;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);
    if (!data) {
      if (this._bytes) {
        gl.bufferData(gl.ARRAY_BUFFER, this._bytes, glUsage);
      } else {
        console.warn('bufferData should not submit 0 bytes data');
      }
    } else {
      if (offset) {
        gl.bufferSubData(gl.ARRAY_BUFFER, offset, data);
      } else {
        gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
      }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  get count () {
    return this._numVertices;
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
  let getAttrAt = function(data, idx, fmt, out = []) {
    let offset = idx * fmt.stride + fmt.offset;
    let bytes = fmt.bytes / fmt.num;
    let fname = _type2fn[fmt.type];
    for (let i = 0; i < fmt.num; i++) {
      out[i] = data[fname](offset + i * bytes, littleEndian);
    }
    return out;
  };
  let createAttrCache = function(vb, data, attr) {
    if (!data) return [];
    let fmt = vb._format.element(attr);
    let vcount = data.byteLength / fmt.stride;
    let result = new Array(vcount * fmt.num);
    let t = new Array(fmt.num);
    for (let i = 0; i < vcount; i++) {
      getAttrAt(data, i, fmt, t);
      for (let j = 0; j < fmt.num; j++)
        result[i * fmt.num + j] = t[j];
    }
    return result;
  };
  VertexBuffer.prototype.do_update = VertexBuffer.prototype.update;
  VertexBuffer.prototype.update = function(offset, data) {
    this.do_update(offset, data);
    // don't need to create for IA pools
    if (data && this._bytes !== data.byteLength) return;
    if (data instanceof ArrayBuffer)
      data = new DataView(data);
    else if (ArrayBuffer.isView(data) && !(data instanceof DataView))
      data = new DataView(data.buffer, data.byteOffset, data.byteLength);
    this[enums.ATTR_POSITION] = createAttrCache(this, data, enums.ATTR_POSITION);
  };
}

export default VertexBuffer;
