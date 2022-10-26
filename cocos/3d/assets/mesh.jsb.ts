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
import { cclegacy, Vec3 } from '../../core';

declare const jsb: any;

export declare namespace Mesh {
    export interface IBufferView {
        offset: number;
        length: number;
        count: number;
        stride: number;
    }
    export type IVertexBundle = jsb.Mesh.IVertexBundle;
    export type ISubMesh = jsb.Mesh.ISubMesh;
    export type IDynamicInfo = jsb.Mesh.IDynamicInfo;
    export type IDynamicStruct = jsb.Mesh.IDynamicStruct;
    export type IStruct = jsb.Mesh.IStruct;
    export type ICreateInfo = jsb.Mesh.ICreateInfo;
}
export type Mesh = jsb.Mesh;
export const Mesh = jsb.Mesh;

const IStructProto: any = jsb.Mesh.IStruct.prototype;

Object.defineProperty(IStructProto, 'minPosition', {
    configurable: true,
    enumerable: true,
    get () {
        const r = this.getMinPosition();
        if (r) {
            if (!this._minPositionCache) {
                this._minPositionCache = new Vec3(r.x, r.y, r.z);
            } else {
                this._minPositionCache.set(r.x, r.y, r.z);
            }
        } else {
            this._minPositionCache = undefined;
        }
        return this._minPositionCache;
    },
    set (v) {
        this.setMinPosition(v);
    }
});

Object.defineProperty(IStructProto, 'maxPosition', {
    configurable: true,
    enumerable: true,
    get () {
        const r = this.getMaxPosition();
        if (r) {
            if (!this._maxPositionCache) {
                this._maxPositionCache = new Vec3(r.x, r.y, r.z);
            } else {
                this._maxPositionCache.set(r.x, r.y, r.z);
            }
        } else {
            this._maxPositionCache = undefined;
        }
        return this._maxPositionCache;
    },
    set (v) {
        this.setMaxPosition(v);
    }
});

const meshAssetProto: any = jsb.Mesh.prototype;

meshAssetProto.createNode = null!;
const originOnLoaded = meshAssetProto.onLoaded;

meshAssetProto._ctor = function () {
    jsb.Asset.prototype._ctor.apply(this, arguments);
    this._struct = {
        vertexBundles: [],
        primitives: [],
    };
    this._minPosition = undefined;
    this._maxPosition = undefined;
};

Object.defineProperty(meshAssetProto, 'struct', {
    configurable: true,
    enumerable: true,
    get () {
        return this.getStruct();
    }
});

Object.defineProperty(meshAssetProto, 'minPosition', {
    configurable: true,
    enumerable: true,
    get () {
        const r = this.getMinPosition();
        if (r) {
            if (!this._minPosition) {
                this._minPosition = new Vec3(r.x, r.y, r.z);
            } else {
                this._minPosition.set(r.x, r.y, r.z);
            }
        } else {
            this._minPosition = undefined;
        }
        return this._minPosition;
    }
});

Object.defineProperty(meshAssetProto, 'maxPosition', {
    configurable: true,
    enumerable: true,
    get () {
        const r = this.getMaxPosition();
        if (r) {
            if (!this._maxPosition) {
                this._maxPosition = new Vec3(r.x, r.y, r.z);
            } else {
                this._maxPosition.set(r.x, r.y, r.z);
            }
        } else {
            this._maxPosition = undefined;
        }
        return this._maxPosition;
    }
});

meshAssetProto.onLoaded = function () {
    // might be undefined
    if (this._struct != undefined) {
        this.setStruct(this._struct);
    }
    // Set to null to release memory in JS
    this._struct = null;
    originOnLoaded.apply(this);
};

cclegacy.Mesh = jsb.Mesh;

// handle meta data, it is generated automatically
const MeshProto = Mesh.prototype;
serializable(MeshProto, '_struct');
serializable(MeshProto, '_hash');
serializable(MeshProto, '_allowDataAccess');
ccclass('cc.Mesh')(Mesh);
