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

import { MeshBuffer } from './mesh-buffer';
import { Material } from '../../core/assets/material';
import { Texture, Sampler } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Camera } from '../../core/renderer/scene/camera';
import { Model } from '../../core/renderer/scene/model';
import { UI } from './ui';
import { NULL_HANDLE, UIBatchHandle, UIBatchPool, UIBatchView, PassPool } from '../../core/renderer/core/memory-pools';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { Pass } from '../../core/renderer/core/pass';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class UIDrawBatch {
    public get handle () {
        return this._handle;
    }
    public get hInputAssembler () {
        return UIBatchPool.get(this._handle, UIBatchView.INPUT_ASSEMBLER);
    }
    public set hInputAssembler (handle) {
        UIBatchPool.set(this._handle, UIBatchView.INPUT_ASSEMBLER, handle);
    }
    public get hDescriptorSet () {
        return UIBatchPool.get(this._handle, UIBatchView.DESCRIPTOR_SET);
    }
    public set hDescriptorSet (handle) {
        UIBatchPool.set(this._handle, UIBatchView.DESCRIPTOR_SET, handle);
    }
    public get visFlags () {
        return UIBatchPool.get(this._handle, UIBatchView.VIS_FLAGS);
    }
    public set visFlags (vis) {
        UIBatchPool.set(this._handle, UIBatchView.VIS_FLAGS, vis);
    }
    public get passes () {
        return this._passes;
    }

    public bufferBatch: MeshBuffer | null = null;
    public camera: Camera | null = null;
    public model: Model | null = null;
    public texture: Texture | null = null;
    public sampler: Sampler | null = null;
    public useLocalData: Node | null = null;
    public isStatic = false;
    public textureHash = 0;
    public samplerHash = 0;
    private _handle: UIBatchHandle = NULL_HANDLE;
    private _passes: Pass[] = [];

    constructor () {
        this._handle = UIBatchPool.alloc();
        UIBatchPool.set(this._handle, UIBatchView.VIS_FLAGS, UI_VIS_FLAG);
        UIBatchPool.set(this._handle, UIBatchView.INPUT_ASSEMBLER, NULL_HANDLE);
        UIBatchPool.set(this._handle, UIBatchView.DESCRIPTOR_SET, NULL_HANDLE);
    }

    public destroy (ui: UI) {
        if (this._handle) {
            const length = this.passes.length;
            for (let i = 0; i < length; i++) {
                // @ts-expect-error hack for UI destroyHandle
                this.passes[i]._destroyHandle();
            }
            this._passes = [];
            UIBatchPool.free(this._handle);
            this._handle = NULL_HANDLE;
        }
    }

    public clear () {
        this.bufferBatch = null;
        this.hInputAssembler = NULL_HANDLE;
        this.hDescriptorSet = NULL_HANDLE;
        this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
    }

    // object version
    public fillPasses (mat: Material | null, dss, bs) {
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            UIBatchPool.set(this._handle, UIBatchView.PASS_COUNT, passes.length);
            let passOffset = UIBatchView.PASS_0;
            let shaderOffset = UIBatchView.SHADER_0;
            for (let i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(legacyCC.director.root);
                    // @ts-expect-error hack for UI use pass object
                    this._passes[i]._handle = PassPool.alloc();
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];
                const dsState = mtlPass.depthStencilState;
                if (dss) {
                    dsState.stencilTestFront = dss.stencilTestFront;
                    dsState.stencilFuncFront = dss.stencilFuncFront;
                    dsState.stencilReadMaskFront = dss.stencilReadMaskFront;
                    dsState.stencilWriteMaskFront = dss.stencilWriteMaskFront;
                    dsState.stencilFailOpFront = dss.stencilFailOpFront;
                    dsState.stencilZFailOpFront = dss.stencilZFailOpFront;
                    dsState.stencilPassOpFront = dss.stencilPassOpFront;
                    dsState.stencilRefFront = dss.stencilRefFront;
                    dsState.stencilTestBack = dss.stencilTestBack;
                    dsState.stencilFuncBack = dss.stencilFuncBack;
                    dsState.stencilReadMaskBack = dss.stencilReadMaskBack;
                    dsState.stencilWriteMaskBack = dss.stencilWriteMaskBack;
                    dsState.stencilFailOpBack = dss.stencilFailOpBack;
                    dsState.stencilZFailOpBack = dss.stencilZFailOpBack;
                    dsState.stencilPassOpBack = dss.stencilPassOpBack;
                    dsState.stencilRefBack = dss.stencilRefBack;
                }
                if (!bs) { bs = mtlPass.blendState; }

                mtlPass.update();
                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dsState, bs);
                UIBatchPool.set(this._handle, passOffset, passInUse.handle);
                UIBatchPool.set(this._handle, shaderOffset, passInUse.getShaderVariant());
            }
        }
    }
}
