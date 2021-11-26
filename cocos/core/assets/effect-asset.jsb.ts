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

import { ccclass, editable, editorOnly, serializable } from 'cc.decorator';
import { legacyCC } from '../global-exports';
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';

export type EffectAsset = jsb.EffectAsset;
export const EffectAsset = jsb.EffectAsset;

legacyCC.EffectAsset = EffectAsset;

const clsDecorator = ccclass('cc.EffectAsset');

const effectAssetProto: any = EffectAsset.prototype;

const _descriptor_techniques = _applyDecoratedDescriptor(effectAssetProto, 'techniques', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor_shaders = _applyDecoratedDescriptor(effectAssetProto, 'shaders', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor_combinations = _applyDecoratedDescriptor(effectAssetProto, 'combinations', [serializable, editable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor_hideInEditor = _applyDecoratedDescriptor(effectAssetProto, 'hideInEditor', [serializable, editorOnly], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return false;
    },
});

effectAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    // _initializerDefineProperty(this, 'techniques', _descriptor_techniques, _assertThisInitialized(this));
    // _initializerDefineProperty(this, 'shaders', _descriptor_shaders, _assertThisInitialized(this));
    // _initializerDefineProperty(this, 'combinations', _descriptor_combinations, _assertThisInitialized(this));
    // _initializerDefineProperty(this, 'hideInEditor', _descriptor_hideInEditor, _assertThisInitialized(this));
};

clsDecorator(EffectAsset);
