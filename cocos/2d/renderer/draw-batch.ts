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
import { Texture, Sampler, DrawInfo, Buffer, InputAssembler, DescriptorSet, Shader } from '../../core/gfx';
import { Node } from '../../core/scene-graph';
import { Camera } from '../../core/renderer/scene/camera';
import { RenderScene } from '../../core/renderer/scene/render-scene';
import { Model } from '../../core/renderer/scene/model';
import { Layers } from '../../core/scene-graph/layers';
import { legacyCC } from '../../core/global-exports';
import { Pass } from '../../core/renderer/core/pass';
import { RecyclePool } from '../../core/memop/recycle-pool';
import { NativeDrawBatch2D, NativePass } from '../../core/renderer/scene';
import { IBatcher } from './i-batcher';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class DrawCall {
    // UBO info
    public bufferHash = 0;
    public bufferUboIndex = 0;
    public bufferView!: Buffer; // 直接存 ubo

    // actual draw call info
    public descriptorSet: DescriptorSet = null!;
    public dynamicOffsets = [0]; // 偏移用 // uboindex * _uniformBufferStride
    public drawInfo = new DrawInfo();
}

export class DrawBatch2D {
    static drawcallPool = new RecyclePool(() => new DrawCall(), 100);

    public get native (): NativeDrawBatch2D {
        return this._nativeObj!;
    }

    public get inputAssembler () {
        return this._inputAssember;
    }
    public set inputAssembler (ia: InputAssembler | null) {
        this._inputAssember = ia;
        if (JSB) {
            this._nativeObj!.inputAssembler = ia;
        }
    }
    public get descriptorSet () {
        return this._descriptorSet;
    }
    public set descriptorSet (ds: DescriptorSet | null) {
        this._descriptorSet = ds;
        if (JSB) {
            this._nativeObj!.descriptorSet = ds;
        }
    }
    public get visFlags () {
        return this._visFlags;
    }
    public set visFlags (vis) {
        this._visFlags = vis;

        if (JSB) {
            this._nativeObj!.visFlags = vis;
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
    private _inputAssember: InputAssembler | null = null;
    private _descriptorSet: DescriptorSet | null = null;
    private declare _nativeObj: NativeDrawBatch2D | null;

    public UICapacityDirty = true;

    protected _drawcalls: DrawCall[] = []; // 意味着一个 batch 里会有多个 DC

    get drawcalls () { return this._drawcalls; }

    constructor () {
        if (JSB) {
            this._nativeObj = new NativeDrawBatch2D();
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
        this.inputAssembler = null;
        this.descriptorSet = null;
        this.camera = null;
        this.texture = null;
        this.sampler = null;
        this.model = null;
        this.isStatic = false;
        this.useLocalData = null;
        this.visFlags = UI_VIS_FLAG;
        this.renderScene = null;
        this._drawcalls.length = 0;
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
                // @ts-expect-error hack for UI use pass object
                passInUse._initPassFromTarget(mtlPass, dss, bs, hashFactor);

                this._shaders[i] = passInUse.getShaderVariant(patches)!;

                dirty = true;
            }

            if (JSB) {
                if (dirty) {
                    const nativePasses: NativePass[] = [];
                    const passes = this._passes;
                    for (let i = 0; i < passes.length; i++) {
                        nativePasses.push(passes[i].native);
                    }
                    this._nativeObj!.passes = nativePasses;
                    this._nativeObj!.shaders = this._shaders;
                }
            }
        }
    }

    // 为 batch 添加 drawCall 的过程
    public fillDrawCallAssembler () {
        let dc = this._drawcalls[0];
        const ia = this.inputAssembler;
        if (!dc) {
            dc = DrawBatch2D.drawcallPool.add();
            // 从 ia 里把信息拷贝过来
            this._drawcalls.push(dc);
            dc = this._drawcalls[0];
        }
        if (ia) {
            dc.drawInfo.firstIndex = ia.drawInfo.firstIndex;
            dc.drawInfo.indexCount = ia.drawInfo.indexCount;
        }
    }
}
