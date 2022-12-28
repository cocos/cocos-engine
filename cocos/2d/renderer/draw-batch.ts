/*
 Copyright (c) 2020-2023 Xiamen Yaji Software Co., Ltd.

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

import { Material } from '../../asset/assets/material';
import { Texture, Sampler, InputAssembler, DescriptorSet, Shader } from '../../gfx';
import { Node } from '../../scene-graph';
import { Model } from '../../render-scene/scene/model';
import { Layers } from '../../scene-graph/layers';
import { cclegacy } from '../../core';
import { Pass } from '../../render-scene/core/pass';
import { IBatcher } from './i-batcher';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;
export class DrawBatch2D {
    public get inputAssembler () {
        return this._inputAssembler;
    }

    public set inputAssembler (ia: InputAssembler | null) {
        this._inputAssembler = ia;
    }

    public get descriptorSet () {
        return this._descriptorSet;
    }

    public set descriptorSet (ds: DescriptorSet | null) {
        this._descriptorSet = ds;
    }

    public get visFlags () {
        return this._visFlags;
    }
    public set visFlags (vis) {
        this._visFlags = vis;
    }

    get passes () {
        return this._passes;
    }

    public get shaders () {
        return this._shaders;
    }

    // public bufferBatch: MeshBuffer | null = null; // use less
    // public camera: Camera | null = null; // use less
    // public renderScene: RenderScene | null = null; // use less for now
    public model: Model | null = null; // for uimodel
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false; // use less,remove when remove Static batch
    public textureHash = 0;
    public samplerHash = 0;
    private _passes: Pass[] = [];
    private _shaders: Shader[] = [];
    private _visFlags: number = UI_VIS_FLAG;
    private _inputAssembler: InputAssembler | null = null;
    private _descriptorSet: DescriptorSet | null = null;
    //private declare _nativeObj: any;

    public destroy (ui: IBatcher) {
        this._passes = [];
    }

    public clear () {
        // this.bufferBatch = null;
        this._inputAssembler = null;
        this._descriptorSet = null;
        // this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.textureHash = 0;
        this.samplerHash = 0;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
        // this.renderScene = null;
    }

    // object version
    public fillPasses (mat: Material | null, dss, dssHash, patches) {
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            const hashFactor = 0;
            let dirty = false;

            this._shaders.length = passes.length;

            for (let i = 0; i < passes.length; i++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(cclegacy.director.root);
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];

                mtlPass.update();

                // Hack: Cause pass.hash can not check all pass value
                if (!dss) { dss = mtlPass.depthStencilState; dssHash = 0; }

                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dss, dssHash);

                this._shaders[i] = passInUse.getShaderVariant(patches)!;

                dirty = true;
            }
        }
    }
}
