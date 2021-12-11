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
import { NativeDrawBatch2D, NativeDrawCall, NativePass } from '../../core/renderer/scene';
import { IBatcher } from './i-batcher';
import { Pool } from '../../core/memop';

const UI_VIS_FLAG = Layers.Enum.NONE | Layers.Enum.UI_3D;

export class DrawCall {
    // UBO info
    public bufferHash = 0;
    public bufferUboIndex = 0;
    public _bufferView: Buffer | null = null;

    // actual draw call info
    private _descriptorSet: DescriptorSet | null = null;
    private _dynamicOffsets = [0, 0];// uboindex * _uniformBufferStride
    private _drawInfo: DrawInfo| null = null;

    private declare _nativeObj: NativeDrawCall | null;

    public get native (): NativeDrawCall {
        return this._nativeObj!;
    }

    public get bufferView () {
        return this._bufferView;
    }
    public set bufferView (buffer: Buffer | null) {
        this._bufferView = buffer;
        if (JSB) {
            this._nativeObj!.bufferView = buffer;
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

    public get drawInfo () {
        return this._drawInfo;
    }

    public get dynamicOffsets () {
        return this._dynamicOffsets;
    }
    public set dynamicOffsets (offsets: number[]) {
        this._dynamicOffsets = offsets;
        if (JSB) {
            this._nativeObj!.dynamicOffsets = this._dynamicOffsets;
        }
    }

    public setDynamicOffsets (value: number) {
        this._dynamicOffsets[1] = value;
        if (JSB) {
            this._nativeObj!.setDynamicOffsets(value);
        }
    }

    constructor () {
        if (JSB) {
            this._drawInfo = new gfx.DrawInfo();
            this._nativeObj = new NativeDrawCall();
            this._nativeObj.drawInfo = this.drawInfo;
        } else {
            this._drawInfo = new DrawInfo();
        }
    }
}

export class DrawBatch2D {
    static drawcallPool = new Pool(() => new DrawCall(), 100);

    public get native (): NativeDrawBatch2D {
        return this._nativeObj!;
    }

    public get inputAssembler () {
        return this._inputAssembler;
    }
    public set inputAssembler (ia: InputAssembler | null) {
        this._inputAssembler = ia;
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
    private _inputAssembler: InputAssembler | null = null;
    private _descriptorSet: DescriptorSet | null = null;
    private declare _nativeObj: NativeDrawBatch2D | null;

    protected _drawCalls: DrawCall[] = [];

    get drawCalls () { return this._drawCalls; }

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
        this._drawCalls.length = 0;
        if (JSB) { this._nativeObj!.clearDrawCalls(); }
    }

    protected _pushDrawCall (dc: DrawCall) {
        this._drawCalls.push(dc);
        if (JSB) { this._nativeObj!.pushDrawCall(dc.native); }
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

    public fillDrawCallAssembler () {
        let dc = this._drawCalls[0];
        const ia = this.inputAssembler;
        if (!dc) {
            dc = DrawBatch2D.drawcallPool.alloc();
            dc.bufferHash = 0;
            dc.bufferView = null;
            dc.bufferUboIndex = 0;
            this._pushDrawCall(dc);
        }
        if (ia) {
            dc.drawInfo!.firstIndex = ia.drawInfo.firstIndex;
            dc.drawInfo!.indexCount = ia.drawInfo.indexCount;
        }
    }
}
