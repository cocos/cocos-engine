export default class RenderBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {RB_FMT_*} format
   * @param {Number} width
   * @param {Number} height
   */
  constructor(device, format, width, height) {
    this._device = device;
    this._format = format;
    
    this._glID = device._gl.createRenderbuffer();
    this.update(width, height);
  }

  update (width, height) {
    this._width = width;
    this._height = height;

    const gl = this._device._gl;
    gl.bindRenderbuffer(gl.RENDERBUFFER, this._glID);
    gl.renderbufferStorage(gl.RENDERBUFFER, this._format, width, height);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
  }

  /**
   * @method destroy
   */
  destroy() {
    if (this._glID === null) {
      console.error('The render-buffer already destroyed');
      return;
    }

    const gl = this._device._gl;

    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.deleteRenderbuffer(this._glID);

    this._glID = null;
  }
}