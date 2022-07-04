/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

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
*/
import { ccclass } from 'cc.decorator';
import { EDITOR, TEST } from 'internal:constants';
import {
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Filter, PixelFormat, WrapMode } from './asset-enum';
import './asset';

declare const jsb: any;
const renderTextureProto: any = jsb.RenderTexture.prototype;
const textureBaseProto: any = jsb.TextureBase.prototype;

renderTextureProto.createNode = null!;

// @ts-ignore
export type RenderTexture = jsb.RenderTexture;
export const RenderTexture: any = jsb.RenderTexture;

RenderTexture.Filter = Filter;
RenderTexture.PixelFormat = PixelFormat;
RenderTexture.WrapMode = WrapMode;

renderTextureProto._serialize = function (ctxForExporting: any): any {
    if (EDITOR || TEST) {
        return { base: textureBaseProto._serialize(ctxForExporting), w: this._width, h: this._height, n: this._name };
    }
    return {};
}


renderTextureProto._deserialize = function (serializedData: any, handle: any) {
    const data = serializedData;
    this._width = data.w;
    this._height = data.h;
    this._name = data.n;
    textureBaseProto._deserialize.call(this, data.base, handle);
};

const oldReadPixels = renderTextureProto.readPixels;
renderTextureProto.readPixels = function readPixels (x: number, y: number, width: number, height: number, buffer?: Uint8Array) {
    x = x || 0;
    y = y || 0;
    width = width || this.width;
    height = height || this.height;


    let tmpBuffer = oldReadPixels.call(this, x, y, width, height);
    if (tmpBuffer.length == 0) {
        return null;
    }
    buffer = tmpBuffer;
    return buffer;
};

legacyCC.RenderTexture = jsb.RenderTexture;

// handle meta data, it is generated automatically
ccclass('cc.RenderTexture')(RenderTexture);
