import Asset from './asset';

export default class Texture extends Asset {
  constructor(device) {
    super();

    this._device = device;
    this._texture = null; // gfx.Texture2D | gfx.TextureCube
  }
}
