/*
 Copyright (c) 2017-2020 Xiamen Yaji Software Co., Ltd.

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

/**
 * @packageDocumentation
 * @module asset
 */

import { ccclass, type, serializable } from 'cc.decorator';
import { CCString } from '../../core/data/utils/attribute';
import { Mat4 } from '../../core/math';
import { DataPoolManager } from '../skeletal-animation/data-pool-manager';
import { Asset } from '../../core/assets/asset';
import { legacyCC } from '../../core/global-exports';
import { _applyDecoratedDescriptor } from '../../core/data/utils/decorator-jsb-utils';

export const Skeleton = jsb.Skeleton;
export type Skeleton = jsb.Skeleton;
legacyCC.Skeleton = Skeleton;
const skeletonProto: any = Skeleton.prototype;

const skeletonDecorator = ccclass('cc.Skeleton');

Object.defineProperty(skeletonProto, 'bindposes', {
    enumerable: true,
    configurable: true,
    get () {
        return this._bindposes;
    },
    set (v) {
        this._bindposes = v;
        this._setBindposes(v);
    },
});

const _dec2$1 = type([CCString]);
const _dec3$1 = type([Mat4]);

const _descriptor$2 = _applyDecoratedDescriptor(skeletonProto, '_joints', [_dec2$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor2$2 = _applyDecoratedDescriptor(skeletonProto, '_bindposes', [_dec3$1], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return [];
    },
});

const _descriptor3$1 = _applyDecoratedDescriptor(skeletonProto, '_hash', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0;
    },
});

skeletonProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this._bindposes = [];
};

skeletonProto.destroy = function () {
    (legacyCC.director.root?.dataPoolManager as DataPoolManager)?.releaseSkeleton(this);
    return Asset.prototype.destroy.call(this);
};

const oldSkeletonProtoOnLoaded = skeletonProto.onLoaded;
skeletonProto.onLoaded = function () {
    this._setBindposes(this._bindposes);
    oldSkeletonProtoOnLoaded.call(this);
};

skeletonDecorator(Skeleton);
