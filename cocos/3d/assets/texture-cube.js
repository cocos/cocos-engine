/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
// @ts-check
import { _decorator } from "../../core/data/index";
const { ccclass } = _decorator;
import Texture from './texture';

import gfx from '../gfx';
import { gfxFilters, gfxWraps, gfxTextureFmts } from '../misc/mappings';

let _opts = {
  images: [],
  mipmap: true,
  width: 2,
  height: 2,
  format: gfx.TEXTURE_FMT_RGBA8,
  anisotropy: 1,
  wrapS: gfx.WRAP_REPEAT,
  wrapT: gfx.WRAP_REPEAT,
  minFilter: gfx.FILTER_LINEAR,
  magFilter: gfx.FILTER_LINEAR,
  mipFilter: gfx.FILTER_LINEAR,
};

function _updateOpts(out, texture) {
  out.images = texture._images;
  out.mipmap = texture._mipmap;
  out.width = texture._width;
  out.height = texture._height;
  out.format = gfxTextureFmts[texture._format];
  out.anisotropy = texture._anisotropy;
  out.wrapS = gfxWraps[texture._wrapS];
  out.wrapT = gfxWraps[texture._wrapT];
  out.minFilter = gfxFilters[texture._minFilter];
  out.magFilter = gfxFilters[texture._magFilter];
  out.mipFilter = gfxFilters[texture._mipFilter];
}

@ccclass
export class TextureCube extends Texture {
  constructor(device, width = 2, height = 2, fmt = 'rgba8') {
    super(device);

    //
    this._images = [];
    this._mipmap = true;
    this._width = width;
    this._height = height;
    this._format = fmt;
    this._anisotropy = 1;
    this._wrapS = 'repeat';
    this._wrapT = 'repeat';
    this._minFilter = 'linear';
    this._magFilter = 'linear';
    this._mipFilter = 'linear';
  }

  destroy() {
    this._texture.destory();
    return super.destroy();
  }

  setImages(imgs) {
    this._images = imgs;
    this.resize(imgs[0][0].width, imgs[0][0].height);
  }

  resize(width, height) {
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set mipmap(val) {
    this._mipmap = val;
  }
  get mipmap() {
    return this._mipmap;
  }

  set anisotropy(val) {
    this._anisotropy = val;
  }
  get anisotropy() {
    return this._anisotropy;
  }

  set wrapS(val) {
    this._wrapS = val;
  }
  get wrapS() {
    return this._wrapS;
  }

  set wrapT(val) {
    this._wrapT = val;
  }
  get wrapT() {
    return this._wrapT;
  }

  set minFilter(val) {
    this._minFilter = val;
  }
  get minFilter() {
    return this._minFilter;
  }

  set magFilter(val) {
    this._magFilter = val;
  }
  get magFilter() {
    return this._magFilter;
  }

  set mipFilter(val) {
    this._mipFilter = val;
  }
  get mipFilter() {
    return this._mipFilter;
  }

  commit() {
    _updateOpts(_opts, this);
    if (!this._texture) {
      this._texture = new gfx.TextureCube(this._device, _opts);
    } else {
      this._texture.update(_opts);
    }
    this._images = [];
  }
}
