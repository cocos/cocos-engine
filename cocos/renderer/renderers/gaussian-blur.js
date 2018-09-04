// Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

import gfx from '../../gfx';

export default class GaussianBlur {
  constructor(device, proglib) {
    this._device = device;
    this._width = 1024;
    this._height = 1024;
    this._XBlurFrameBuffer = null;
    this._XBluredTexture = null;
    this._YBlurFrameBuffer = null;
    this._YBluredTexture = null;
    this._sourceTexture = null;
    this._programLib = proglib;
  }

  setupBlur(tex) {
    this._sourceTexture = tex;
    this._width = tex._width;
    this._height = tex._height;
    if (!this._XBlurFrameBuffer || !this._YBlurFrameBuffer) {
      this._XBluredTexture = new gfx.Texture2D(this._device, {
        width: this._width,
        height: this._height,
        format: gfx.TEXTURE_FMT_RGBA8,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
      });
      this._XBlurFrameBuffer = new gfx.FrameBuffer(this._device, this._width, this._height, {
        colors: [this._XBluredTexture],
      });
      this._YBluredTexture = new gfx.Texture2D(this._device, {
        width: this._width,
        height: this._height,
        format: gfx.TEXTURE_FMT_RGBA8,
        wrapS: gfx.WRAP_CLAMP,
        wrapT: gfx.WRAP_CLAMP,
      });
      this._YBlurFrameBuffer = new gfx.FrameBuffer(this._device, this._width, this._height, {
        colors: [this._YBluredTexture],
      });
    }
  }

  processBlur() {
    // position.xy  uv
    let verts = [
      -1, 1, 0, 1,
      -1, -1, 0, 0,
      1, -1, 1, 0,
      -1, 1, 0, 1,
      1, -1, 1, 0,
      1, 1, 1, 1
    ];
    let vfmt = [
      { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
      { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 }
    ];
    let vb = new gfx.VertexBuffer(
      this._device,
      new gfx.VertexFormat(vfmt),
      gfx.USAGE_STATIC,
      new Float32Array(verts),
      6
    );
    // x-blur
    this._device.setFrameBuffer(this._XBlurFrameBuffer);
    this._device.setViewport(0, 0, this._width, this._height);
    this._device.clear({
      color: [0, 0, 0, 1]
    });
    this._device.setTexture('texture', this._sourceTexture, 0);
    this._device.setUniform('pixelSize',new Float32Array([1.0 / this._width, 0.0]));
    this._device.setVertexBuffer(0, vb);
    this._device.setProgram(this._programLib.getProgram('gaussian-blur'));
    this._device.draw(0, 6);
    // y-blur
    this._device.setFrameBuffer(this._YBlurFrameBuffer);
    this._device.clear({
      color: [0, 0, 0, 1]
    });
    this._device.setTexture('texture', this._XBluredTexture, 0);
    this._device.setUniform('pixelSize',new Float32Array([0.0, 1.0 / this._height]));
    this._device.setVertexBuffer(0, vb);
    this._device.setProgram(this._programLib.getProgram('gaussian-blur'));
    this._device.draw(0, 6);
    this._device.setFrameBuffer(null);
  }

  getBluredTexture() {
    // TODO: should support only x-blur or y-blur ?
    return this._YBluredTexture;
  }

}