import { enums } from './enums';

export default class Texture {
  /**
   * @constructor
   */
  constructor(device) {
    this._device = device;

    this._width = 4;
    this._height = 4;
    this._hasMipmap = false;
    this._compressed = false;

    this._anisotropy = 1;
    this._minFilter = enums.FILTER_LINEAR;
    this._magFilter = enums.FILTER_LINEAR;
    this._mipFilter = enums.FILTER_LINEAR;
    this._wrapS = enums.WRAP_REPEAT;
    this._wrapT = enums.WRAP_REPEAT;
    // wrapR available in webgl2
    // this._wrapR = enums.WRAP_REPEAT;
    this._format = enums.TEXTURE_FMT_RGBA8;

    this._target = -1;
  }

  /**
   * @method destroy
   */
  destroy() {
    if (this._glID === -1) {
      console.error('The texture already destroyed');
      return;
    }

    let gl = this._device._gl;
    gl.deleteTexture(this._glID);

    this._device._stats.tex -= this.bytes;
    this._glID = -1;
  }
}