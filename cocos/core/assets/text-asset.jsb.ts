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
import { ccclass, editable, serializable } from 'cc.decorator';
import { legacyCC } from '../global-exports';
import './asset';

const textAssetProto: any = jsb.TextAsset.prototype;

textAssetProto.createNode = null!;

export type TextAsset = jsb.TextAsset;
export const TextAsset = jsb.TextAsset;

textAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
};

legacyCC.TextAsset = jsb.TextAsset;

// handle meta data, it is generated automatically
const TextAssetProto = TextAsset.prototype;
editable(TextAssetProto, 'text');
serializable(TextAssetProto, 'text');
ccclass('cc.TextAsset')(TextAsset);
