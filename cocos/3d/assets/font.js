import Asset from './asset';

export default class Font extends Asset {
  constructor() {
    super();

    this._size = 32; // font size
    this._type = 'unknow'; // font type: bitmap or opentype
    // bitmap font glyph: {char, x, y, width, height, xoffset, yoffset, xadvance}
    // opentype font glyph: {id, x, y, width, height, xoffset, yoffset, xadvance}
    this._glyphs = {};
    this._lineHeight = 32;
    this._useKerning = false;
  }

  get size() {
    return this._size;
  }

  get lineHeight() {
    return this._lineHeight;
  }

  get type() {
    return this._type;
  }

}