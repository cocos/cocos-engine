import { enums } from './enums';

const BYTES_PER_INDEX = {
  [enums.INDEX_FMT_UINT8]: 1,
  [enums.INDEX_FMT_UINT16]: 2,
  [enums.INDEX_FMT_UINT32]: 4,
}

class IndexBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {INDEX_FMT_*} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   */
  constructor(device, format, usage, data) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._bytesPerIndex = BYTES_PER_INDEX[format];
    this._bytes = data.byteLength;
    this._numIndices = this._bytes / this._bytesPerIndex;

    this._needExpandDataStore = true;

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
   * @param {Number} byteOffset
   * @param {ArrayBuffer} data
   */
  update(byteOffset, data) {
    if (this._glID === -1) {
      console.error('The buffer is destroyed');
      return;
    }

    if (data.byteLength === 0) return;

    // Need to create new buffer object when bytes exceed
    if (byteOffset + data.byteLength > this._bytes) {
      if (byteOffset) {
        // Lost data between [0, byteOffset] which is need for new buffer
        console.error('Failed to update data, bytes exceed.');
        return;
      }
      else {
        this._needExpandDataStore = true;
        this._bytes = byteOffset + data.byteLength;
        this._numIndices = this._bytes / this._bytesPerIndex;
      }
    }

    /** @type{WebGLRenderingContext} */
    let gl = this._device._gl;
    let glUsage = this._usage;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glID);
    if (this._needExpandDataStore) {
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, glUsage);
      this._needExpandDataStore = false;
    }
    else {
      gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, byteOffset, data);
    }
    this._device._restoreIndexBuffer();
  }

  get count () {
    return this._numIndices;
  }

  setUsage (usage) {
    this._usage = usage;
  }
}

IndexBuffer.BYTES_PER_INDEX = BYTES_PER_INDEX;

export default IndexBuffer;
