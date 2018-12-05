export default class FrameBuffer {
  /**
   * @constructor
   * @param {Device} device
   * @param {Number} width
   * @param {Number} height
   * @param {Object} options
   * @param {Array} options.colors
   * @param {RenderBuffer|Texture2D|TextureCube} options.depth
   * @param {RenderBuffer|Texture2D|TextureCube} options.stencil
   * @param {RenderBuffer|Texture2D|TextureCube} options.depthStencil
   */
  constructor(device, width, height, options) {
    this._device = device;
    this._width = width;
    this._height = height;

    this._colors = options.colors || [];
    this._depth = options.depth || null;
    this._stencil = options.stencil || null;
    this._depthStencil = options.depthStencil || null;

    this._glID = device._gl.createFramebuffer();
  }

  /**
   * @method destroy
   */
  destroy() {
    if (this._glID === null) {
      console.error('The frame-buffer already destroyed');
      return;
    }

    const gl = this._device._gl;

    gl.deleteFramebuffer(this._glID);

    this._glID = null;
  }
}