/*
 Copyright (c) 2021-2023 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights to
 use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
*/

import { TEST, EDITOR, EDITOR_NOT_IN_PREVIEW } from 'internal:constants';
import { SpriteFrame } from '../../2d/assets/sprite-frame';
import type { ImageSource } from '../assets/image-asset';
import assetManager from '../asset-manager/asset-manager';
import { BuiltinBundleName } from '../asset-manager/shared';
import Bundle from '../asset-manager/bundle';
import { Settings, settings, cclegacy } from '../../core';
import { releaseManager } from '../asset-manager/release-manager';
import type { BuiltinResMgr as JsbBuiltinResMgr } from './builtin-res-mgr';

declare const jsb: any;

const Texture2D = jsb.Texture2D;
const ImageAsset = jsb.ImageAsset;

const BuiltinResMgr = jsb.BuiltinResMgr;
const builtinResMgrProto = BuiltinResMgr.prototype;

builtinResMgrProto.init = function () {
    this._resources = {};
    this._materialsToBeCompiled = [];
    const resources = this._resources;
    const len = 2;
    const numChannels = 4;

    const blackValueView = new Uint8Array(len * len * numChannels);
    for (let i = 0; i < len * len; i++) {
        const offset = i * numChannels;
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

    if (cclegacy.SpriteFrame) {
        const spriteFrame = new cclegacy.SpriteFrame() as SpriteFrame;
        const image = imgAsset;
        const texture = new Texture2D();
        texture.image = image;
        spriteFrame.texture = texture;
        spriteFrame._uuid = 'default-spriteframe';
        resources[spriteFrame._uuid] = spriteFrame;
    }
    if (EDITOR) {
        const builtinAssets = settings.querySettings<string[]>(Settings.Category.ENGINE, 'builtinAssets');
        const builtinBundle = new Bundle();
        builtinBundle.init({
            name: BuiltinBundleName.INTERNAL,
            uuids: builtinAssets || [],
            deps: [],
            importBase: '',
            nativeBase: '',
            base: '',
            paths: {},
            scenes: {},
            packs: {},
            versions: { import: [], native: [] },
            redirect: [],
            debug: false,
            types: [],
            extensionMap: {},
        });
    }


    this.initBuiltinRes();
};

builtinResMgrProto.get = function (uuid: string) {
    const res = this._resources[uuid];
    return res || this.getAsset(uuid);
};


builtinResMgrProto.compileBuiltinMaterial = function () {
    // NOTE: Builtin material should be compiled again after the render pipeline setup
    for (let i = 0; i < this._materialsToBeCompiled.length; ++i) {
        const mat = this._materialsToBeCompiled[i];
        for (let j = 0; j < mat.passes.length; ++j) {
            mat.passes[j].tryCompile();
        }
    }
    this._materialsToBeCompiled.length = 0;
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
                        // In Editor, no need to ignore asset destroy, we use auto gc to handle destroy
                        if (!EDITOR_NOT_IN_PREVIEW) releaseManager.addIgnoredAsset(asset);
                        this.addAsset(asset.name, asset);
                        if (asset instanceof cclegacy.Material) {
                            this._materialsToBeCompiled.push(asset);
                        }
                    });
                    resolve();
                }
            });
        });
    });
}

const builtinResMgr = cclegacy.builtinResMgr = BuiltinResMgr.getInstance() as JsbBuiltinResMgr;
export { builtinResMgr };
