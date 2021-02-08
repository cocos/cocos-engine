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
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Model } from '../../core/renderer/scene/model';
import { Batcher2D } from './batcher-2d';
import { NULL_HANDLE, BatchHandle2D, BatchPool2D, BatchView2D, PassPool } from '../../core/renderer/core/memory-pools';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { Pass } from '../../core/renderer/core/pass';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class DrawBatch2D {
    public get handle () {
        return this._handle;
    }
    public get hInputAssembler () {
        return BatchPool2D.get(this._handle, BatchView2D.INPUT_ASSEMBLER);
    }
    public set hInputAssembler (handle) {
        BatchPool2D.set(this._handle, BatchView2D.INPUT_ASSEMBLER, handle);
    }
    public get hDescriptorSet () {
        return BatchPool2D.get(this._handle, BatchView2D.DESCRIPTOR_SET);
    }
    public set hDescriptorSet (handle) {
        BatchPool2D.set(this._handle, BatchView2D.DESCRIPTOR_SET, handle);
    }
    public get visFlags () {
        return BatchPool2D.get(this._handle, BatchView2D.VIS_FLAGS);
    }
    public set visFlags (vis) {
        BatchPool2D.set(this._handle, BatchView2D.VIS_FLAGS, vis);
    }
    public get passes () {
        return this._passes;
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
    private _handle: BatchHandle2D = NULL_HANDLE;
    private _passes: Pass[] = [];

    constructor () {
        this._handle = BatchPool2D.alloc();
        BatchPool2D.set(this._handle, BatchView2D.VIS_FLAGS, UI_VIS_FLAG);
        BatchPool2D.set(this._handle, BatchView2D.INPUT_ASSEMBLER, NULL_HANDLE);
        BatchPool2D.set(this._handle, BatchView2D.DESCRIPTOR_SET, NULL_HANDLE);
    }

    public destroy (ui: Batcher2D) {
        if (this._handle) {
            const length = this.passes.length;
            for (let i = 0; i < length; i++) {
                // @ts-expect-error hack for UI destroyHandle
                this.passes[i]._destroyHandle();
            }
            this._passes = [];
            BatchPool2D.free(this._handle);
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
    public fillPasses (mat: Material | null, dss, dssHash, bs, bsHash, patches) {
        if (mat) {
            const passes = mat.passes;
            if (!passes) { return; }

            BatchPool2D.set(this._handle, BatchView2D.PASS_COUNT, passes.length);
            let passOffset = BatchView2D.PASS_0;
            let shaderOffset = BatchView2D.SHADER_0;
            let hashFactor = 0;
            for (let i = 0; i < passes.length; i++, passOffset++, shaderOffset++) {
                if (!this._passes[i]) {
                    this._passes[i] = new Pass(legacyCC.director.root);
                    // @ts-expect-error hack for UI use pass object
                    this._passes[i]._handle = PassPool.alloc();
                }
                const mtlPass = passes[i];
                const passInUse = this._passes[i];
                if (!dss) { dss = mtlPass.depthStencilState; dssHash = 0; }
                if (!bs) { bs = mtlPass.blendState; bsHash = 0; }
                if (bsHash === -1) { bsHash = 0; }

                hashFactor = (dssHash << 16) | bsHash;

                mtlPass.update();
                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dss, bs, hashFactor);
                BatchPool2D.set(this._handle, passOffset, passInUse.handle);
                BatchPool2D.set(this._handle, shaderOffset, passInUse.getShaderVariant(patches));
            }
        }
    }
}
