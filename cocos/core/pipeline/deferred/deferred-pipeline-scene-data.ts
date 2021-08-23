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

import { JSB } from 'internal:constants';
import { Device } from '../../gfx';
import { RenderPipeline } from '../render-pipeline';
import { builtinResMgr } from '../../builtin/builtin-res-mgr';
import { Material } from '../../assets';
import { PipelineSceneData } from '../pipeline-scene-data';

export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = 2;
export const BLOOM_COMBINEPASS_INDEX = 3;
export class DeferredPipelineSceneData extends PipelineSceneData {
    public get deferredLightingMaterial () {
        return this._deferredLightingMaterial;
    }

    public set deferredLightingMaterial (mat: Material) {
        if (this._deferredLightingMaterial === mat || !mat) return;
        this._deferredLightingMaterial = mat;
        this.updateDeferredPassInfo();
    }

    public get deferredBloomMaterial() {
        return this._deferredBloomMaterial;
    }

    public set deferredBloomMaterial(mat: Material) {
        if (this._deferredBloomMaterial === mat || !mat) return;
        this._deferredBloomMaterial = mat;
        this.updateDeferredPassInfo();
    }

    public get deferredPostMaterial () {
        return this._deferredPostMaterial;
    }

    public set deferredPostMaterial (mat: Material) {
        if (this._deferredPostMaterial === mat || !mat) return;
        this._deferredPostMaterial = mat;
        this.updateDeferredPassInfo();
    }

    protected declare _deferredLightingMaterial: Material;
    protected declare _deferredBloomMaterial: Material;
    protected declare _deferredPostMaterial: Material;

    public onGlobalPipelineStateChanged () {
        this.updateDeferredPassInfo();
    }

    public initPipelinePassInfo () {
        // builtin deferred material
        const deferredMat = new Material();
        deferredMat._uuid = 'builtin-deferred-material';
        deferredMat.initialize({ effectName: 'deferred-lighting' });
        for (let i = 0; i < deferredMat.passes.length; ++i) {
            deferredMat.passes[i].tryCompile();
        }
        this._deferredLightingMaterial = deferredMat;

        const bloomMat = new Material();
        bloomMat._uuid = 'builtin-bloom-material';
        bloomMat.initialize({ effectName: 'bloom' });
        for (let i = 0; i < bloomMat.passes.length; ++i) {
            bloomMat.passes[i].tryCompile();
        }
        this._deferredBloomMaterial = bloomMat;

        const postMat = new Material();
        postMat._uuid = 'builtin-post-process-material';
        postMat.initialize({ effectName: 'post-process' });
        for (let i = 0; i < postMat.passes.length; ++i) {
            postMat.passes[i].tryCompile();
        }
        this._deferredPostMaterial = postMat;

        this.updateDeferredPassInfo();
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        super.activate(device, pipeline);
        this.initPipelinePassInfo();
        return true;
    }

    private updateDeferredPassInfo () {
        this.updateDeferredLightPass();
        this.updateDeferredBloomPass();
        this.updateDeferredPostPass();
    }

    private updateDeferredLightPass () {
        if (!this._deferredLightingMaterial) return;

        const passLit = this._deferredLightingMaterial.passes[0];
        passLit.beginChangeStatesSilently();
        passLit.tryCompile();
        passLit.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.deferredLightPassShader = passLit.getShaderVariant();
            this._nativeObj!.deferredLightPass = passLit.native;
        }
    }

    private updateDeferredBloomPass() {
        if (!this.deferredBloomMaterial) return;

        const passPrefilter = this.deferredBloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        passPrefilter.beginChangeStatesSilently();
        passPrefilter.tryCompile();
        passPrefilter.endChangeStatesSilently();

        const passDownsample = this.deferredBloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX];
        passDownsample.beginChangeStatesSilently();
        passDownsample.tryCompile();
        passDownsample.endChangeStatesSilently();

        const passUpsample = this.deferredBloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX];
        passUpsample.beginChangeStatesSilently();
        passUpsample.tryCompile();
        passUpsample.endChangeStatesSilently();

        const passCombine = this.deferredBloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        passCombine.beginChangeStatesSilently();
        passCombine.tryCompile();
        passCombine.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.deferredBloomPrefilterPassShader = passPrefilter.getShaderVariant();
            this._nativeObj!.deferredBloomPrefilterPass = passPrefilter.native;
            this._nativeObj!.deferredBloomDownsamplePassShader = passDownsample.getShaderVariant();
            this._nativeObj!.deferredBloomDownsamplePass = passDownsample.native;
            this._nativeObj!.deferredBloomUpsamplePassShader = passUpsample.getShaderVariant();
            this._nativeObj!.deferredBloomUpsamplePass = passUpsample.native;
            this._nativeObj!.deferredBloomCombinePassShader = passCombine.getShaderVariant();
            this._nativeObj!.deferredBloomCombinePass = passCombine.native;
        }
    }

    private updateDeferredPostPass () {
        if (!this.deferredPostMaterial) return;

        const passPost = this.deferredPostMaterial.passes[0];
        passPost.beginChangeStatesSilently();
        passPost.tryCompile();
        passPost.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.deferredPostPassShader = passPost.getShaderVariant();
            this._nativeObj!.deferredPostPass = passPost.native;
        }
    }
}
