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

  getFormat (name) {
    return this._format.element(name);
  }

  setUsage (usage) {
    this._usage = usage;
  }
}

export default VertexBuffer;
