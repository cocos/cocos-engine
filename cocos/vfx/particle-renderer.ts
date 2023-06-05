/*
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

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
import { ccclass, displayName, serializable, type } from 'cc.decorator';
import { CCBoolean } from '../core';
import { EmitterDataSet, ParticleDataSet } from './data-set';
import { Material, RenderingSubMesh } from '../asset/assets';
import { MaterialInstance } from '../render-scene';

@ccclass('cc.ParticleRenderer')
export abstract class ParticleRenderer {
    @type(CCBoolean)
    public get enabled () {
        return this._enabled;
    }

    public set enabled (val) {
        this._enabled = val;
    }

    abstract get name (): string;

    @type(Material)
    @displayName('Material')
    public get sharedMaterial () {
        return this._sharedMaterial;
    }

    public set sharedMaterial (val) {
        if (this._sharedMaterial !== val) {
            this._sharedMaterial = val;
            this._material = null;
            this._isMaterialDirty = true;
        }
    }

    public get material () {
        if (!this._material && this._sharedMaterial) {
            this._material = new MaterialInstance({ parent: this._sharedMaterial });
        }
        return this._material;
    }

    public set material (val) {
        if (this._material !== val) {
            this._material = val;
            this._sharedMaterial = null;
            this._isMaterialDirty = true;
        }
    }

    public get renderingSubMesh () {
        return this._renderingSubMesh;
    }

    public get vertexCount () {
        return this._vertexCount;
    }

    public get indexCount () {
        return this._indexCount;
    }

    public get instanceCount () {
        return this._instanceCount;
    }

    public get firstInstance () {
        return this._firstInstance;
    }

    public get firstVertex () {
        return this._firstVertex;
    }

    public get firstIndex () {
        return this._firstIndex;
    }

    protected _isMaterialDirty = false;
    protected _renderingSubMesh: RenderingSubMesh | null = null;
    protected _vertexCount = 0;
    protected _firstIndex = 0;
    protected _indexCount = 0;
    protected _instanceCount = 0;
    protected _firstInstance = 0;
    protected _firstVertex = 0;
    @serializable
    private _sharedMaterial: Material | null = null;
    private _material: MaterialInstance | null = null;
    @serializable
    private _enabled = true;

    public abstract render (particles: ParticleDataSet, emitter: EmitterDataSet);
}
