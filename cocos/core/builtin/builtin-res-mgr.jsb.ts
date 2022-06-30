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

import { legacyCC } from '../global-exports';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import type { ImageSource }  from '../assets/image-asset';
import assetManager from '../asset-manager/asset-manager';
import { BuiltinBundleName } from '../asset-manager/shared';
import { EDITOR, TEST } from 'internal:constants';
import { Settings, settings } from '../settings';
import releaseManager from '../asset-manager/release-manager';

declare const jsb: any;

const Texture2D = jsb.Texture2D;
const ImageAsset = jsb.ImageAsset;

const BuiltinResMgr = jsb.BuiltinResMgr;
const builtinResMgrProto = BuiltinResMgr.prototype;

builtinResMgrProto.init = function (): Promise<void> {
    this._resources = {};
    const resources = this._resources;
    const len = 2;
    const numChannels = 4;

    const blackValueView   = new Uint8Array(len * len * numChannels);
    let offset = 0;
    for (let i = 0; i < len * len; i++) {
        blackValueView[offset] = 0;
        blackValueView[offset + 1] = 0;
        blackValueView[offset + 2] = 0;
        blackValueView[offset + 3] = 255;
    }

    const blackMemImageSource: ImageSource = {
        width: len,
        height: len,
        _data: blackValueView,
        _compressed: false,
        format: Texture2D.PixelFormat.RGBA8888,
    };

    // black texture
    const imgAsset = new ImageAsset(blackMemImageSource);
    const blackTexture = new Texture2D();
    blackTexture._uuid = 'black-texture';
    blackTexture.image = imgAsset;
    resources[blackTexture._uuid] = blackTexture;

    if (legacyCC.SpriteFrame) {
        const spriteFrame = new legacyCC.SpriteFrame() as SpriteFrame;
        const image = imgAsset;
        const texture = new Texture2D();
        texture.image = image;
        spriteFrame.texture = texture;
        spriteFrame._uuid = 'default-spriteframe';
        resources[spriteFrame._uuid] = spriteFrame;
    }

    this.initBuiltinRes();
};

builtinResMgrProto.get = function (uuid: string) {
    const res = this._resources[uuid];
    return res || this.getAsset(uuid);
};

builtinResMgrProto.loadBuiltinAssets = function () {
   const builtinAssets = settings.querySettings<string[]>(Settings.Category.ENGINE, 'builtinAssets');
   if (TEST || !builtinAssets) return Promise.resolve();
   const resources = this._resources;
   return new Promise<void>((resolve, reject) => {
       assetManager.loadBundle(BuiltinBundleName.INTERNAL, (err, bundle) => {
           if (err) {
               reject(err);
               return;
           }
           assetManager.loadAny(builtinAssets, (err, assets) => {
               if (err) {
                   reject(err);
               } else {
                    assets.forEach((asset) => {
                        resources[asset.name] = asset;
                        const url = asset.nativeUrl;
                        releaseManager.addIgnoredAsset(asset);
                        this.addAsset(asset.name, asset);
                    });
                   resolve();
               }
           });
       });
   });
}

const builtinResMgr = legacyCC.builtinResMgr = BuiltinResMgr.getInstance();
export { builtinResMgr };
