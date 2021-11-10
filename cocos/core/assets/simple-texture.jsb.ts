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
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';
import { Filter, PixelFormat, WrapMode } from './asset-enum';

export type SimpleTexture = jsb.SimpleTexture;
export const SimpleTexture = jsb.SimpleTexture;

(SimpleTexture as any).Filter = Filter;
(SimpleTexture as any).PixelFormat = PixelFormat;
(SimpleTexture as any).WrapMode = WrapMode;

const simpleTextureProto = jsb.SimpleTexture.prototype;
const oldUpdateDataFunc = simpleTextureProto.uploadData;
simpleTextureProto.uploadData = function (source, level = 0, arrayIndex = 0) {
    let data;
    if (source instanceof HTMLCanvasElement) {
        data = source.data;
    } else if (source instanceof HTMLImageElement) {
        data = source._data;
    } else if (ArrayBuffer.isView(source)) {
        data = source.buffer;
    }
    oldUpdateDataFunc.call(this, data, level, arrayIndex);
};

const clsDecorator = ccclass('cc.SimpleTexture');

simpleTextureProto._ctor = function () {

};

clsDecorator(SimpleTexture);

legacyCC.SimpleTexture = jsb.SimpleTexture;
