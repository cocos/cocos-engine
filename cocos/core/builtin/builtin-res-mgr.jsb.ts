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
import { Device } from '../gfx';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import type { ImageSource }  from '../assets/image-asset';
import { AssetManager } from '../asset-manager/asset-manager';

declare const jsb: any;

const Texture2D = jsb.Texture2D;
const ImageAsset = jsb.ImageAsset;

const BuiltinResMgr = jsb.BuiltinResMgr;
const builtinResMgrProto = BuiltinResMgr.prototype;

const oldInitBuiltinRes = builtinResMgrProto.initBuiltinRes;

builtinResMgrProto.initBuiltinRes = function (device: Device): Promise<void> {
    this._resources = {};
    this._device = device;
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

    return Promise.resolve().then(() => {
        oldInitBuiltinRes.call(device);
    }).then(() => this._preloadAssets());
};

/**
 * @internal
 */
builtinResMgrProto._preloadAssets = async function () {
    const resources = this._resources;
    if (window._CCSettings && window._CCSettings.preloadAssets && window._CCSettings.preloadAssets.length > 0) {
        const preloadedAssets = window._CCSettings.preloadAssets as string[];
        return new Promise<void>((resolve, reject) => (legacyCC.assetManager as AssetManager).loadAny(preloadedAssets, { __outputAsArray__: true }, (err, assets) => {
            if (err) {
                reject(err);
            } else {
                assets.forEach((asset) => resources[asset._uuid] = asset);
                resolve();
            }
        }));
    }
}

builtinResMgrProto.get = function (uuid: string) {
    const res = this._resources[uuid];
    return res || this.getAsset(uuid);
};

const builtinResMgr = legacyCC.builtinResMgr = BuiltinResMgr.getInstance();
export { builtinResMgr };
