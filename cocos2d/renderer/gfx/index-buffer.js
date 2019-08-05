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
   * @param {Number} numIndices
   */
  constructor(device, format, usage, data, numIndices) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._numIndices = numIndices;

    this._bytesPerIndex = BYTES_PER_INDEX[format];
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

  setUsage (usage) {
    this._usage = usage;
  }
}

IndexBuffer.BYTES_PER_INDEX = BYTES_PER_INDEX;

export default IndexBuffer;
