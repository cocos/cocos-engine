import Font from './font';
import Texture2D from '../assets/texture-2d';
import ShelfPack from './utils/shelf-pack';
import { vec2 } from '../vmath';

export default class OpenTypeFont extends Font {
  constructor(device, width = 1024, height = 1024) {
    super();

    this._font = null; // opentype.Font
    this._padding = 2;
    this._fontScale = 1;
    this._textCache = {};
    // this._face = null; // TODO:
    this._packer = new ShelfPack(width, height); // TODO: auto resize
    this._packCanvas = document.createElement('canvas');
    this._packCanvas.width = width;
    this._packCanvas.height = height;
    this._fontAtlas = new Texture2D(device, width, height);
    this._fontAtlas.mipmap = false;
    this._fontAtlas.premultiplyAlpha = true;
    this._defaultGlyph = {
      id: 32, // space charCode
      x: 0,
      y: 0,
      width: 16,
      height: 16,
      xoffset: 0,
      yoffset: 0,
      xadvance: 16,
      uvs: [
        vec2.create(0, 0),
        vec2.create(0, 0),
        vec2.create(0, 0),
        vec2.create(0, 0)
      ],
    };
    this._type = 'opentype';
  }

  set font(val) {
    this._font = val;
    this._fontScale = this._size / this._font.unitsPerEm;
  }
  get font() {
    return this._font;
  }

  get texture() {
    return this._fontAtlas;
  }

  set size(val) {
    if (this._size !== val) {
      this._size = val;
      // when font size changed, we need to clear font atlas.
      this.clear();
    }
  }

  set lineHeight(val) {
    if (this._lineHeight !== val) {
      this._lineHeight = val;
      this.clear();
    }
  }

  addText(text) {
    if (this._textCache[text] === undefined) {
      this._textCache[text] = text;
      this._addTextToFontAtlas(text);
    }
  }

  removeText(text) {
    if (this._textCache[text] === undefined) {
      console.warn(`can not remove text: '${text}' from font. not exists.`);
    } else {
      this._removeTextFromFontAtlas(text);
      delete this._textCache[text];
    }
  }

  clear() {
    this._packer.clear();
    let ctx = this._packCanvas.getContext('2d');
    ctx.clearRect(0, 0, this._packCanvas.width, this._packCanvas.height);
    this._fontAtlas.setImages([this._packCanvas]);
    this._fontAtlas.commit();
  }

  _addTextToFontAtlas(text) {
    let ctx = this._packCanvas.getContext('2d');
    let fontAtlasDirty = false;

    for (let i = 0; i < text.length; ++i) {
      let char = text[i];
      let charCode = text.charCodeAt(i);
      // get opentype glyph
      let otGlyph = this._font.charToGlyph(char);
      if (otGlyph.path.getBoundingBox === undefined) { // opentype's bug ? some glyph such as space do not have getBoundingBox func.
        continue;
      }
      let bbox = otGlyph.getBoundingBox();
      let glyph = {
        id: charCode,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xoffset: 0,
        yoffset: 0,
        xadvance: 0,
      };
      glyph.width = (bbox.x2 - bbox.x1) * this._fontScale;
      glyph.height = (bbox.y2 - bbox.y1) * this._fontScale;
      if (this._glyphs[charCode] !== undefined) {
        this._packer.packOne(glyph.width, glyph.height, glyph.id); // increment refcount
      } else {
        fontAtlasDirty = true;
        glyph.xadvance = otGlyph.advanceWidth * this._fontScale;
        this._glyphs[charCode] = glyph;
        let bin = this._packer.packOne(glyph.width + this._padding, glyph.height + this._padding, glyph.id); // pack a new one
        if (bin !== null) {
          glyph.xoffset = bbox.x1 * this._fontScale;
          glyph.yoffset = this._size - bbox.y2 * this._fontScale + this._font.descender * this._fontScale;

          // compute uvs
          let u0 = (bin.x + this._padding / 2) / this._packCanvas.width;
          let u1 = (bin.x + this._padding / 2 + glyph.width) / this._packCanvas.width;
          let v0 = 1.0 - (bin.y + this._padding / 2 + glyph.height) / this._packCanvas.height;
          let v1 = 1.0 - (bin.y + this._padding / 2) / this._packCanvas.height;
          glyph.uvs = [
            vec2.create(u0, v0),
            vec2.create(u1, v0),
            vec2.create(u0, v1),
            vec2.create(u1, v1)
          ];
          let path = otGlyph.getPath(bin.x - bbox.x1 * this._fontScale + this._padding / 2, bin.y + bbox.y2 * this._fontScale + this._padding / 2, this._size, {xScale: this._fontScale, yScale: this._fontScale});
          path.fill = '#FFFFFF';
          path.draw(ctx);
        } else {
          console.error('font glyph pack failed. font atlas size is not enough.');
        }
      }
    }

    if (fontAtlasDirty) {
      // update font atlas
      this._fontAtlas.setImages([this._packCanvas]);
      this._fontAtlas.commit();
    }
  }

  _removeTextFromFontAtlas(text) {
    let ctx = this._packCanvas.getContext('2d');
    let fontAtlasDirty = false;

    for (let i = 0; i < text.length; ++i) {
      let charCode = text.charCodeAt(i);
      if (this._glyphs[charCode] !== undefined) {
        let bin = this._packer.getBin(charCode);
        let refCount = this._packer.unref(bin);
        if (refCount === 0) {
          delete this._glyphs[charCode];
          ctx.clearRect(bin.x, bin.y, bin.w, bin.h);
          fontAtlasDirty = true;
        }
      } else {
        console.warn('try to remove a no exist glyph.');
      }
    }

    if (fontAtlasDirty) {
      // update font atlas
      this._fontAtlas.setImages([this._packCanvas]);
      this._fontAtlas.commit();
    }
  }

}