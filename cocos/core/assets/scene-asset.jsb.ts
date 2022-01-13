/*
 Copyright (c) 2021 Xiamen Yaji Software Co., Ltd.

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
*/
import { ccclass, editable, serializable } from 'cc.decorator';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { legacyCC } from '../global-exports';

export const SceneAsset = jsb.SceneAsset;
export type SceneAsset = jsb.SceneAsset;

legacyCC.SceneAsset = SceneAsset;
const sceneAssetDecorator = ccclass('cc.SceneAsset');

const sceneAssetProto: any = SceneAsset.prototype;

const des_scene = _applyDecoratedDescriptor(sceneAssetProto, 'scene', [editable, serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return null;
    },
});

Object.defineProperty(sceneAssetProto, 'scene', {
    enumerable: true,
    configurable: true,
    get () {
        if (!this._scene) {
            this._scene = this.getScene();
        }
        return this._scene;
    },
    set (v) {
        this._scene = v;
        this.setScene(v);
    }
});

sceneAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    // _initializerDefineProperty(this, "scene", des_scene, _assertThisInitialized(this));
    this._scene = null;
};

sceneAssetDecorator(SceneAsset);
