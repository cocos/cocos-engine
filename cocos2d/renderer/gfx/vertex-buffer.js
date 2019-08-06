import { enums } from './enums';

class VertexBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {VertexFormat} format
   * @param {USAGE_*} usage
   * @param {ArrayBuffer | Uint8Array} data
   */
  constructor(device, format, usage, data) {
    this._device = device;
    this._format = format;
    this._usage = usage;
    this._bytesPerVertex = this._format._bytes;
    this._bytes = data.byteLength;
    this._numVertices = this._bytes / this._bytesPerVertex;

    this._needExpandDataStore = true;

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
        this._numVertices = this._bytes / this._bytesPerVertex;
      }
    }

    let gl = this._device._gl;
    let glUsage = this._usage;

    gl.bindBuffer(gl.ARRAY_BUFFER, this._glID);
    if (this._needExpandDataStore) {
      gl.bufferData(gl.ARRAY_BUFFER, data, glUsage);
      this._needExpandDataStore = false;
    }
    else {
      gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, data);
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
