/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

import { Asset } from './asset';

declare class FinalizationRegistry {
    constructor (callback: (heldObj: any) => void);
    register (obj: any, heldObj: any, token?: any);
    unregister (token: any);
}

interface FinalizationCallbackObject {
    heldObj: any;
    type: Constructor<Asset>;
    uuid: string;
}

export class FinalizationManager {
    private _map: Map<Constructor<Asset>, (obj: any) => void> = new Map();

    registerTypeFinalizationHandler (ctor: Constructor<Asset>, callback: (obj: any) => void) {
        this._map.set(ctor, callback);
    }

    register (asset: Asset, heldNativeObj: any) {
        finalizationRegistry.unregister(asset);
        finalizationRegistry.register(asset, { heldObj: heldNativeObj, type: asset.constructor, uuid: asset._uuid }, asset);
    }

    unregister (asset: Asset) {
        finalizationRegistry.unregister(asset);
    }

    finalizationRegistryCallback (obj: FinalizationCallbackObject) {
        const { heldObj, type, uuid } = obj;
        const callback = this._map.get(type);
        if (callback) { callback(heldObj); }
        console.log(`The asset ${uuid} has been reclaimed`);
    }
}

export const finalizationManager = new FinalizationManager();

const finalizationRegistry = new FinalizationRegistry(finalizationManager.finalizationRegistryCallback.bind(finalizationManager));
