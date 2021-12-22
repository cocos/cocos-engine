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

/**
 * @packageDocumentation
 * @hidden
 */

import { JSB } from 'internal:constants';
import { MeshBuffer } from './mesh-buffer';
import { Material } from '../../core/assets/material';
import { Texture, Sampler, InputAssembler, DescriptorSet, Shader } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Camera } from '../../core/renderer/scene/camera';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Model } from '../../core/renderer/scene/model';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { Pass } from '../../core/renderer/core/pass';
import { IBatcher } from './i-batcher';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class DrawBatch2D {
    public get inputAssembler () {
        return this._inputAssembler;
    }

    public set inputAssembler (ia: InputAssembler | null) {
        this._inputAssembler = ia;
        if (JSB) {
            this._nativeObj.inputAssembler = ia;
        }
    }

    public get descriptorSet () {
        return this._descriptorSet;
    }

    public set descriptorSet (ds: DescriptorSet | null) {
        this._descriptorSet = ds;
        if (JSB) {
            this._nativeObj.descriptorSet = ds;
        }
    }

    public get visFlags () {
        return this._visFlags;
    }
    public set visFlags (vis) {
        this._visFlags = vis;
        if (JSB) {
            this._nativeObj.visFlags = vis;
        }
    }

    get passes () {
        return this._passes;
    }

    public get shaders () {
        return this._shaders;
    }

    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public renderScene: RenderScene | null = null;
    public model: Model | null = null;
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;
    public textureHash = 0;
    public samplerHash = 0;
    private _passes: Pass[] = [];
    private _shaders: Shader[] = [];
    private _visFlags: number = UI_VIS_FLAG;
    private _inputAssembler: InputAssembler | null = null;
    private _descriptorSet: DescriptorSet | null = null;
    private declare _nativeObj: any;

    constructor () {
        if (JSB) {
            // @ts-expect-error jsb related codes
            this._nativeObj = new jsb.DrawBatch2D();
            this._nativeObj.visFlags = this._visFlags;
        }
    }

    public destroy (ui: IBatcher) {
        this._passes = [];
        if (JSB) {
            this._nativeObj = null;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this._inputAssembler = null;
        this._descriptorSet = null;
        this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
        this.renderScene = null;
    }

    // object version
    public fillPasses (mat: Material | null, dss, dssHash, bs, bsHash, patches, batcher: IBatcher) {
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            let hashFactor = 0;
            let dirty = false;

            this._shaders.length = passes.length;

            for (let i = 0; i < passes.length; i++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(legacyCC.director.root);
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];

                mtlPass.update();

                // Hack: Cause pass.hash can not check all pass value

                if (!dss) { dss = mtlPass.depthStencilState; dssHash = 0; }
                if (!bs) { bs = mtlPass.blendState; bsHash = 0; }
                if (bsHash === -1) { bsHash = 0; }

                hashFactor = (dssHash << 16) | bsHash;
                if (JSB) {
                    const nativeDSS = dss._nativeObj ? dss._nativeObj : dss;
                    const nativeBS = bs._nativeObj ? bs._nativeObj : bs;
                    // @ts-expect-error hack for UI use pass object
                    passInUse._initPassFromTarget(mtlPass, nativeDSS, nativeBS, hashFactor);
                } else {
                    // @ts-expect-error hack for UI use pass object
                    passInUse._initPassFromTarget(mtlPass, dss, bs, hashFactor);
                }

                this._shaders[i] = passInUse.getShaderVariant(patches)!;

                dirty = true;
            }

            if (JSB) {
                if (dirty) {
                    this._nativeObj.passes = this._passes;
                    this._nativeObj.shaders = this._shaders;
                }
            }
        }
    }
}
