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
import {
    _applyDecoratedDescriptor,
    _assertThisInitialized,
    _initializerDefineProperty,
} from '../data/utils/decorator-jsb-utils';
import { Material } from '../../assets';
import { RenderableComponent } from '../../components';

export const MaterialInstance = jsb.MaterialInstance;
export type MaterialInstance = jsb.MaterialInstance;

const materialInstanceProto:any = jsb.MaterialInstance.prototype;

export interface IMaterialInstanceInfo {
    parent: Material;
    owner?: RenderableComponent;
    subModelIdx?: number;
}

Object.defineProperty(materialInstanceProto, 'parent', {
    configurable: true,
    enumerable: true,
    get () {
        return this._parent;
    },
});

Object.defineProperty(materialInstanceProto, 'owner', {
    configurable: true,
    enumerable: true,
    get () {
        return this._owner;
    },
});

materialInstanceProto._ctor = function (info: IMaterialInstanceInfo) {
    this._registerListeners();
    this._parent = info.parent;
    this._owner = info.owner || null;
    this._subModelIdx = info.subModelIdx || 0;
};

materialInstanceProto._onRebuildPSO = function () {
    if (this._owner) {
        this._owner._onRebuildPSO(this._subModelIdx, this);
    }
};

const clsDecorator = ccclass('cc.MaterialInstance');

// TODO:
// _applyDecoratedDescriptor

clsDecorator(MaterialInstance);
