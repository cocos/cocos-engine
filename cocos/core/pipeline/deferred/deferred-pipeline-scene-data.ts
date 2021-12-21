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

import { Device } from '../../gfx';
import { RenderPipeline, MAX_BLOOM_FILTER_PASS_NUM } from '../render-pipeline';
import { Material } from '../../assets';
import { PipelineSceneData } from '../pipeline-scene-data';
import { macro } from '../../platform/macro';
import { NativePass } from '../../renderer/scene';

// Anti-aliasing type, other types will be gradually added in the future
export enum AntiAliasing {
    NONE,
    FXAA,
}
export const BLOOM_PREFILTERPASS_INDEX = 0;
export const BLOOM_DOWNSAMPLEPASS_INDEX = 1;
export const BLOOM_UPSAMPLEPASS_INDEX = BLOOM_DOWNSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export const BLOOM_COMBINEPASS_INDEX = BLOOM_UPSAMPLEPASS_INDEX + MAX_BLOOM_FILTER_PASS_NUM;
export class DeferredPipelineSceneData extends PipelineSceneData {
    protected _antiAliasing: AntiAliasing = AntiAliasing.NONE;
    set antiAliasing (value: AntiAliasing) {
        this._antiAliasing = value;
        if (this._postprocessMaterial) {
            const defines = this._postprocessMaterial.passes[0].defines;
            Object.assign(defines, { ANTIALIAS_TYPE: value });
            const renderMat = new Material();
            renderMat.initialize({
                effectAsset: this._postprocessMaterial.effectAsset,
                defines,
            });
            for (let i = 0; i < renderMat.passes.length; ++i) {
                renderMat.passes[i].tryCompile();
            }
            this._postprocessMaterial = renderMat;
        }
    }

    get antiAliasing () {
        return this._antiAliasing;
    }

    public get bloomMaterial () {
        return this._bloomMaterial;
    }

    public set bloomMaterial (mat: Material) {
        if (this._bloomMaterial === mat || !mat) return;
        this._bloomMaterial = mat;
        this.updatePipelinePassInfo();
    }
    protected declare _bloomMaterial: Material;

    public get postprocessMaterial () {
        return this._postprocessMaterial;
    }

    public set postprocessMaterial (mat: Material) {
        if (this._postprocessMaterial === mat || !mat) return;
        this._postprocessMaterial = mat;
        this.updatePipelinePassInfo();
    }
    protected declare _postprocessMaterial: Material;

    public onGlobalPipelineStateChanged () {
        this.updatePipelinePassInfo();
    }

    private updateBloomPass () {
        if (!this._bloomMaterial) return;

        const prefilterPass = this._bloomMaterial.passes[BLOOM_PREFILTERPASS_INDEX];
        prefilterPass.beginChangeStatesSilently();
        prefilterPass.tryCompile();
        prefilterPass.endChangeStatesSilently();

        const downsamplePasses : NativePass[] = [];
        const upsamplePasses : NativePass[] = [];
        for (let i = 0; i < MAX_BLOOM_FILTER_PASS_NUM; ++i) {
            const downsamplePass = this._bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX + i];
            downsamplePass.beginChangeStatesSilently();
            downsamplePass.tryCompile();
            downsamplePass.endChangeStatesSilently();

            const upsamplePass = this._bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX + i];
            upsamplePass.beginChangeStatesSilently();
            upsamplePass.tryCompile();
            upsamplePass.endChangeStatesSilently();

            downsamplePasses.push(downsamplePass.native);
            upsamplePasses.push(upsamplePass.native);
        }

        const combinePass = this._bloomMaterial.passes[BLOOM_COMBINEPASS_INDEX];
        combinePass.beginChangeStatesSilently();
        combinePass.tryCompile();
        combinePass.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.bloomPrefilterPassShader = prefilterPass.getShaderVariant();
            this._nativeObj!.bloomPrefilterPass = prefilterPass.native;
            this._nativeObj!.bloomDownsamplePassShader = this._bloomMaterial.passes[BLOOM_DOWNSAMPLEPASS_INDEX].getShaderVariant();
            this._nativeObj!.bloomDownsamplePass = downsamplePasses;
            this._nativeObj!.bloomUpsamplePassShader = this._bloomMaterial.passes[BLOOM_UPSAMPLEPASS_INDEX].getShaderVariant();
            this._nativeObj!.bloomUpsamplePass = upsamplePasses;
            this._nativeObj!.bloomCombinePassShader = combinePass.getShaderVariant();
            this._nativeObj!.bloomCombinePass = combinePass.native;
        }
    }

    private updatePostProcessPass () {
        if (!this.postprocessMaterial) return;

        const passPost = this.postprocessMaterial.passes[0];
        passPost.beginChangeStatesSilently();
        passPost.tryCompile();
        passPost.endChangeStatesSilently();

        if (JSB) {
            this._nativeObj!.pipelinePostPassShader = passPost.getShaderVariant();
            this._nativeObj!.pipelinePostPass = passPost.native;
        }
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
        this._bloomMaterial = bloomMat;

        const postMat = new Material();
        postMat._uuid = 'builtin-post-process-material';
        if (macro.ENABLE_ANTIALIAS_FXAA) {
            this._antiAliasing = AntiAliasing.FXAA;
        }
        postMat.initialize({
            effectName: 'post-process',
            defines: {
                // Anti-aliasing type, currently only fxaa, so 1 means fxaa
                ANTIALIAS_TYPE: this._antiAliasing,
            },
        });
        for (let i = 0; i < postMat.passes.length; ++i) {
            postMat.passes[i].tryCompile();
        }
        this._postprocessMaterial = postMat;

        this.updatePipelinePassInfo();
    }

    public get deferredLightingMaterial () {
        return this._deferredLightingMaterial;
    }

    public set deferredLightingMaterial (mat: Material) {
        if (this._deferredLightingMaterial === mat || !mat) return;
        this._deferredLightingMaterial = mat;
        this.updatePipelinePassInfo();
    }

    protected declare _deferredLightingMaterial: Material;
    protected declare _deferredPostMaterial: Material;

    protected updatePipelinePassInfo () {
        this.updateBloomPass();
        this.updatePostProcessPass();
        this.updateDeferredPassInfo();
    }

    public activate (device: Device, pipeline: RenderPipeline) {
        super.activate(device, pipeline);
        this.initPipelinePassInfo();
        return true;
    }

    private updateDeferredPassInfo () {
        this.updateDeferredLightPass();
    }

    private updateDeferredLightPass () {
        if (!this._deferredLightingMaterial) return;

        // It's temporary solution for main light shadowmap
        if (this.shadows.enabled) {
            this._pipeline.macros.CC_RECEIVE_SHADOW = 1;
        }

        const passLit = this._deferredLightingMaterial.passes[0];
        passLit.beginChangeStatesSilently();
        passLit.tryCompile();
        passLit.endChangeStatesSilently();
    }
<<<<<<< HEAD

    private updateDeferredPostPass () {
        if (!this.deferredPostMaterial) return;

        const passPost = this.deferredPostMaterial.passes[0];
        passPost.beginChangeStatesSilently();
        passPost.tryCompile();
        passPost.endChangeStatesSilently();
    }
=======
>>>>>>> v3.4.0
}
