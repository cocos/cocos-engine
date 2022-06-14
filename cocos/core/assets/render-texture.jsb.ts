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
import { ccclass, rangeMax, rangeMin, serializable } from 'cc.decorator';
import { EDITOR, TEST } from 'internal:constants';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Filter, PixelFormat, WrapMode } from './asset-enum';

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

const clsDecorator = ccclass('cc.RenderTexture');

const _class2$j = RenderTexture;
const _dec2$b = rangeMin(1);
const _dec3$6 = rangeMax(1024);
const _dec4$5 = rangeMin(1);
const _dec5$2 = rangeMax(1024);

const _descriptor$h = _applyDecoratedDescriptor(_class2$j.prototype, '_width', [serializable, _dec2$b, _dec3$6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 1;
    },
});

const _descriptor2$d = _applyDecoratedDescriptor(_class2$j.prototype, '_height', [serializable, _dec4$5, _dec5$2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 1;
    },
});

renderTextureProto._ctor = function () {
    textureBaseProto._ctor.apply(this, arguments);
    // for deserialization
    // _initializerDefineProperty(_this, '_width', _descriptor$h, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, '_height', _descriptor2$d, _assertThisInitialized(_this));
};

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

clsDecorator(RenderTexture);

legacyCC.RenderTexture = jsb.RenderTexture;
