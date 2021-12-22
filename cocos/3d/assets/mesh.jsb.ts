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
import { ccclass, serializable } from 'cc.decorator';
import { _applyDecoratedDescriptor } from '../../core/data/utils/decorator-jsb-utils';
import { legacyCC } from '../../core/global-exports';

export declare namespace Mesh {
    export interface IBufferView {
        offset: number;
        length: number;
        count: number;
        stride: number;
    }
    export type IVertexBundle = jsb.Mesh.IVertexBundle;
    export type ISubMesh = jsb.Mesh.ISubMesh;
    export type IStruct = jsb.Mesh.IStruct;
    export type ICreateInfo = jsb.Mesh.ICreateInfo;
}
export type Mesh = jsb.Mesh;
export const Mesh = jsb.Mesh;

const meshAssetProto: any = jsb.Mesh.prototype;

meshAssetProto.createNode = null!;

const clsDecorator = ccclass('cc.Mesh');

const _class2$V = Mesh;

const _descriptor$M = _applyDecoratedDescriptor(_class2$V.prototype, '_struct', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return {
            vertexBundles: [],
            primitives: [],
        };
    },
});
const _descriptor2$y = _applyDecoratedDescriptor(_class2$V.prototype, '_hash', [serializable], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function initializer () {
        return 0;
    },
});

meshAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    // _initializerDefineProperty(_this, "_struct", _descriptor$M, _assertThisInitialized(_this));
    // _initializerDefineProperty(_this, "_hash", _descriptor2$y, _assertThisInitialized(_this));
    this._struct = {
        vertexBundles: [],
        primitives: [],
    };
};

Object.defineProperty(meshAssetProto, 'struct', {
    configurable: true,
    enumerable: true,
    get () {
        return this.getStruct();
    }
});

meshAssetProto.onLoaded = function () {
    this.setStruct(this._struct);
    // Set to null to release memory in JS
    this._struct = null;
};

clsDecorator(Mesh);

legacyCC.Mesh = jsb.Mesh;
